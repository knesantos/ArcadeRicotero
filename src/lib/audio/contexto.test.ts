/**
 * Verificación del contexto de audio compartido (`ADR-04.2`).
 *
 * Lo que se prueba acá no es que suene: es **que haya uno solo y que se despierte bien**.
 * Un segundo `AudioContext` no hace ruido: duplica un ciclo de vida —nace `suspended` en el
 * celular, cae en `interrupted` con una llamada— que costó dos defectos aprender a manejar,
 * y eso recién se descubre con el juego entero armado.
 *
 * Hasta el 2026-10-01 este archivo probaba además el token de la salida (`ADR-04.3`), que
 * existía para que la cama de cinta se callara cuando sonaba un fragmento. La cinta se sacó
 * del sitio, y el token con ella.
 *
 * Corre en Node con dobles de `AudioContext`, con los mismos modales que `audio.test.ts`:
 * se instalan globales, se arma el caso, y se restaura en un `finally` que además llama a
 * `reiniciarAudioParaPruebas()` — porque el módulo guarda un contexto en su ámbito y sin
 * ese reinicio el segundo caso mide lo que dejó el primero.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  contextoDeAudio,
  contextoVivo,
  despertarSalida,
  reiniciarAudioParaPruebas,
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
  /** Un navegador sin Web Audio: el caso en que el reveal cae al repuesto y Skayboy calla. */
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
    assert.equal(e.registro.construidos, 1, 'un segundo contexto duplica un ciclo de vida que ya costó dos defectos');
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
    assert.equal(estado, 'running', 'quien llama decide con esto si sigue esperando un toque');

    await despertarSalida();
    assert.equal(e.registro.mudos, 1, 'el destrabe es una vez por contexto, no por toque');
  } finally {
    e.restaurar();
  }
});

test('si el navegador rechaza el resume, despertarSalida lo dice en vez de tirar', async () => {
  // Es el caso 2 de `ADR-04.4`: la ventana incrustada que recorta el audio. Quien llama
  // necesita enterarse para esperar el próximo toque; lo que no puede pasar es que una
  // promesa rechazada llegue sin capturar a la consola de la gente por algo que acá ya
  // está manejado.
  const e = conEntorno({ estado: 'suspended', resumeFunciona: false });
  try {
    const estado = await despertarSalida();
    assert.equal(estado, 'suspended', 'quedó parado, y se dice');
    assert.equal(e.registro.resumes, 1, 'un intento y nada más: no se reintenta');
  } finally {
    e.restaurar();
  }
});
