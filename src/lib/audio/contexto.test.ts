/**
 * Verificación del contexto de audio compartido (`ADR-04.2` y `ADR-04.3`).
 *
 * Lo que se prueba acá no es que suene: es **quién es dueño de la salida y cómo se la
 * pasan**. Son las dos cosas que, si están mal, no se notan escuchando:
 *
 * - Un segundo `AudioContext` no hace ruido: hace que la cama de cinta no pueda callarse
 *   cuando suena un fragmento, y eso recién se descubre con el juego entero armado.
 * - Un pedido de la salida que se filtra deja la atmósfera muda **para siempre y sin
 *   síntoma**. Nadie reporta una cama que no vuelve; simplemente el sitio se apaga solo.
 *
 * Corre en Node con dobles de `AudioContext`, con los mismos modales que `audio.test.ts`:
 * se instalan globales, se arma el caso, y se restaura en un `finally` que además llama a
 * `reiniciarAudioParaPruebas()` — porque el módulo guarda un contexto en su ámbito y sin
 * ese reinicio el segundo caso mide lo que dejó el primero.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  alCambiarLaSalida,
  contextoDeAudio,
  contextoVivo,
  despertarSalida,
  reiniciarAudioParaPruebas,
  salidaOcupada,
  tomarLaSalida,
} from './contexto.ts';

type Estado = 'running' | 'suspended' | 'interrupted' | 'closed';

interface Registro {
  construidos: number;
  resumes: number;
  mudos: number;
  arrancados: number;
}

/**
 * Un `AudioContext` de mentira, **nuevo en cada construcción**.
 *
 * El doble de `audio.test.ts` devuelve siempre el mismo objeto, que allá alcanza. Acá no:
 * la pregunta de `ADR-04.2` es justamente si el módulo construye uno o dos, y con un doble
 * que devuelve el mismo objeto esa prueba pasaría sola sin probar nada.
 */
function contextoFalso(estado: Estado, resumeFunciona: boolean, registro: Registro) {
  registro.construidos++;
  const ctx = {
    state: estado,
    currentTime: 0,
    sampleRate: 44100,
    destination: {},
    resume() {
      registro.resumes++;
      if (!resumeFunciona) return Promise.reject(new Error('no'));
      ctx.state = 'running' as Estado;
      return Promise.resolve();
    },
    createBuffer() {
      registro.mudos++;
      return { duration: 0 } as unknown as AudioBuffer;
    },
    createBufferSource() {
      return {
        buffer: null as AudioBuffer | null,
        connect() {},
        start() {
          registro.arrancados++;
        },
        stop() {},
        disconnect() {},
      };
    },
  };
  return ctx;
}

interface Entorno {
  readonly estado: Estado;
  readonly resumeFunciona: boolean;
  /** Un navegador sin Web Audio: el caso en que la cama ni se ofrece. */
  readonly conWebAudio: boolean;
}

/** Instala los dobles en el entorno global y devuelve cómo desarmarlos. */
function conEntorno(opciones: Partial<Entorno> = {}) {
  const estado = opciones.estado ?? 'suspended';
  const resumeFunciona = opciones.resumeFunciona ?? true;
  const conWebAudio = opciones.conWebAudio ?? true;
  const registro: Registro = { construidos: 0, resumes: 0, mudos: 0, arrancados: 0 };
  const g = globalThis as Record<string, unknown>;
  const previos = { AudioContext: g.AudioContext, window: g.window };

  const Ctor = function () {
    return contextoFalso(estado, resumeFunciona, registro);
  };
  g.AudioContext = conWebAudio ? Ctor : undefined;
  // El módulo mira `window`, no `globalThis`: es lo que hay en un navegador y es lo que ya
  // hacía el motor antes de la mudanza.
  g.window = conWebAudio ? { AudioContext: Ctor } : {};

  return {
    registro,
    restaurar() {
      g.AudioContext = previos.AudioContext;
      g.window = previos.window;
      // Sin esto, el contexto del caso anterior sobrevive y el que sigue mide otra cosa.
      reiniciarAudioParaPruebas();
    },
  };
}

test('el contexto se construye una sola vez: dos pedidos devuelven el mismo objeto', () => {
  const e = conEntorno({ estado: 'running' });
  try {
    const uno = contextoDeAudio();
    const otro = contextoDeAudio();
    assert.ok(uno, 'con Web Audio tiene que haber contexto');
    assert.equal(uno, otro, 'el segundo que lo pide se cuelga del que hay');
    assert.equal(e.registro.construidos, 1, 'un segundo contexto no puede callar al primero');
  } finally {
    e.restaurar();
  }
});

test('contextoVivo mira sin tocar: no construye nada', () => {
  const e = conEntorno({ estado: 'running' });
  try {
    assert.equal(contextoVivo(), null, 'antes de que alguien lo pida no hay nada');
    assert.equal(e.registro.construidos, 0, 'mirar no puede sonar: eso es autoreproducción');
    const creado = contextoDeAudio();
    assert.equal(contextoVivo(), creado, 'y después devuelve el que hay, sin crear otro');
    assert.equal(e.registro.construidos, 1);
  } finally {
    e.restaurar();
  }
});

test('sin Web Audio devuelve null y no rompe: queda el camino de repuesto', async () => {
  const e = conEntorno({ conWebAudio: false });
  try {
    assert.equal(contextoDeAudio(), null);
    assert.equal(await despertarSalida(), null, 'sin salida no hay estado que informar');
  } finally {
    e.restaurar();
  }
});

test('reiniciarAudioParaPruebas deja el módulo sin contexto', () => {
  // El caso que sostiene a `audio.test.ts`: si el contexto sobreviviera al `restaurar()`,
  // el `assert.equal(e.registro.mudos, 1)` de allá empezaría a contar buffers mudos de
  // casos anteriores — y lo peor es que contaría bien un rato.
  const e = conEntorno({ estado: 'running' });
  try {
    const primero = contextoDeAudio();
    reiniciarAudioParaPruebas();
    assert.equal(contextoVivo(), null, 'el reinicio tiene que soltar la referencia');
    const segundo = contextoDeAudio();
    assert.notEqual(segundo, primero, 'después del reinicio se construye uno nuevo');
    assert.equal(e.registro.construidos, 2);
  } finally {
    e.restaurar();
  }
});

test('despertarSalida pide volver y hace sonar el buffer mudo, una sola vez', async () => {
  const e = conEntorno({ estado: 'suspended' });
  try {
    const estado = await despertarSalida();
    assert.equal(e.registro.resumes, 1, 'un contexto parado tiene que pedir volver');
    assert.equal(e.registro.mudos, 1, 'el buffer mudo es lo que destraba iOS, no el resume solo');
    assert.equal(estado, 'running', 'quien llama decide con esto si se declara bloqueada');

    await despertarSalida();
    assert.equal(e.registro.mudos, 1, 'el destrabe es una vez por contexto, no por toque');
  } finally {
    e.restaurar();
  }
});

test('si el navegador rechaza el resume, despertarSalida lo dice en vez de tirar', async () => {
  // Es el caso 2 de `ADR-04.4`: la ventana incrustada que recorta el audio. Lo que la cama
  // necesita es enterarse para declararse `bloqueada` y no guardar la preferencia; lo que
  // no puede pasar es que una promesa rechazada llegue sin capturar a la consola de la
  // gente por algo que acá ya está manejado.
  const e = conEntorno({ estado: 'suspended', resumeFunciona: false });
  try {
    const estado = await despertarSalida();
    assert.equal(estado, 'suspended', 'quedó parado, y se dice');
    assert.equal(e.registro.resumes, 1, 'un intento y nada más: no se reintenta');
  } finally {
    e.restaurar();
  }
});

test('dos tomas y dos sueltas dejan la salida libre; con una sola sigue ocupada', () => {
  try {
    assert.equal(salidaOcupada(), false, 'de arranque no suena nada');
    const soltarUna = tomarLaSalida('fragmento', 30);
    const soltarOtra = tomarLaSalida('tema entero', 30);
    assert.equal(salidaOcupada(), true);

    soltarUna();
    assert.equal(salidaOcupada(), true, 'todavía queda uno sonando: la cama no puede volver');

    soltarOtra();
    assert.equal(salidaOcupada(), false, 'con la última suelta, la salida queda libre');
  } finally {
    reiniciarAudioParaPruebas();
  }
});

test('soltar de más no deja deuda: el contador nunca queda negativo', () => {
  try {
    const soltar = tomarLaSalida('fragmento', 30);
    soltar();
    soltar();
    soltar();
    assert.equal(salidaOcupada(), false);

    // La prueba de que no quedó deuda escondida: si soltar de más hubiera descontado de
    // más, este pedido nuevo nacería ya cancelado y la cama pisaría el fragmento siguiente.
    const otro = tomarLaSalida('fragmento', 30);
    assert.equal(salidaOcupada(), true, 'un pedido nuevo ocupa la salida igual que siempre');
    otro();
    assert.equal(salidaOcupada(), false);
  } finally {
    reiniciarAudioParaPruebas();
  }
});

test('soltar un pedido viejo no libera el que está sonando ahora', () => {
  try {
    const viejo = tomarLaSalida('fragmento', 30);
    viejo();
    const ahora = tomarLaSalida('fragmento', 30);
    viejo(); // el que quedó en la mano de nadie, llamado tarde
    assert.equal(salidaOcupada(), true, 'cada pedido suelta el suyo y ninguno más');
    ahora();
    assert.equal(salidaOcupada(), false);
  } finally {
    reiniciarAudioParaPruebas();
  }
});

test('un pedido que nadie suelta se libera solo al vencer el tope', async () => {
  // La red de seguridad de `ADR-04.3`, copiada del corte por temporizador que el camino de
  // repuesto ya tenía. Sin esto, un `onended` que no llega deja la cama muda para siempre
  // y sin nadie a quien reclamarle.
  try {
    tomarLaSalida('fragmento', 0.02);
    assert.equal(salidaOcupada(), true);
    await new Promise((res) => setTimeout(res, 60));
    assert.equal(salidaOcupada(), false, 'un pedido que se filtra se suelta solo');
  } finally {
    reiniciarAudioParaPruebas();
  }
});

test('el oyente se entera de los cambios, y darse de baja funciona', () => {
  try {
    const avisos: boolean[] = [];
    const darDeBaja = alCambiarLaSalida((ocupada) => avisos.push(ocupada));

    const soltarUna = tomarLaSalida('fragmento', 30);
    const soltarOtra = tomarLaSalida('fragmento', 30);
    // Solo los cambios de mano, no cada pedido: la cama baja una vez y vuelve una vez. Un
    // aviso por toque la haría respirar alrededor de cada escalón, que se nota más que no
    // tenerla.
    assert.deepEqual(avisos, [true], 'el segundo pedido no es un cambio de estado');

    soltarUna();
    assert.deepEqual(avisos, [true], 'con uno vivo, la salida sigue ocupada');
    soltarOtra();
    assert.deepEqual(avisos, [true, false]);

    darDeBaja();
    const ultimo = tomarLaSalida('fragmento', 30);
    ultimo();
    assert.deepEqual(avisos, [true, false], 'dado de baja, no le llega nada más');
  } finally {
    reiniciarAudioParaPruebas();
  }
});

test('un oyente que rompe no se lleva puesto al resto', () => {
  // El motor de fragmentos no se puede caer porque la atmósfera tenga un defecto: la cama
  // es lo último que se agregó y lo primero que se saca.
  try {
    const avisos: boolean[] = [];
    alCambiarLaSalida(() => {
      throw new Error('la cama tuvo un mal día');
    });
    alCambiarLaSalida((ocupada) => avisos.push(ocupada));
    const soltar = tomarLaSalida('fragmento', 30);
    soltar();
    assert.deepEqual(avisos, [true, false]);
  } finally {
    reiniciarAudioParaPruebas();
  }
});
