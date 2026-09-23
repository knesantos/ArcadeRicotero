/**
 * Verificación de los tres efectos de `CTR-17`.
 *
 * Lo que se prueba acá **no es que suenen bien**: si el salto suena a salto lo decide un
 * oído en un teléfono, y el contrato lo dice con todas las letras —se afinan escuchando, lo
 * único que él fija son los topes—. Lo que se prueba es todo lo que, si está mal, **no se
 * descubre escuchando**:
 *
 * - Que **el fracaso no dispare nada**. Es la regla que `UX-29` puso por encima de la
 *   afinación: el silencio ahí no es un valor bajo, es la decisión. Un efecto de fallo no se
 *   descubre escuchando porque el que lo agrega lo escucha y le gusta.
 * - Que **no haya un segundo `AudioContext`** (`ADR-07.10` punto 7). El segundo contexto no
 *   hace ruido: hace que la cinta no pueda callarse, y eso aparece recién con el juego
 *   entero armado.
 * - Que **cada voz se suelte sola**. Un plataformas dispara decenas de veces por minuto; un
 *   nodo que no se suelta no se oye, se acumula.
 * - Que **con la cinta apagada no suene nada** (`CTR-17.5`). Alguien que apagó el sitio en
 *   el colectivo no espera que el juego le haga ruido, y un efecto suelto no lo reporta
 *   nadie como defecto de este archivo.
 * - Que **no entre un archivo ni un buffer** por la ventana (`CTR-17.4`): cero bytes de red
 *   y cero MB de RAM es el presupuesto entero.
 *
 * Los dobles son propios y chicos a propósito. El de `cinta.test.ts` arrastra documento,
 * almacén y temporizadores porque la cama los necesita; acá alcanza con un contexto que
 * sepa hacer dos nodos y decir la hora, y **el reloj se mueve a mano**, que es lo que deja
 * probar la ventana de un cuadro sin esperar un cuadro.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  type Efecto,
  EFECTOS,
  GANANCIA_EFECTOS,
  MISMO_CUADRO_SEG,
  NODOS_POR_VOZ,
  PUERTA_HZ,
  SALTO_DESDE_HZ,
  SALTO_HASTA_HZ,
  TESORO_HZ,
  TESORO_HZ_AGUDO,
  TOPE_EFECTO_SEG,
  VOCES_MAX,
  armarEfectos,
  efectosArmados,
  reiniciarEfectosParaPruebas,
  sonar,
  soltarEfectos,
  vocesVivas,
} from './sonido.ts';
import { contextoDeAudio, reiniciarAudioParaPruebas } from '../audio/contexto.ts';

// ---------------------------------------------------------------------------------------
// Los dobles
// ---------------------------------------------------------------------------------------

interface ParametroFalso {
  value: number;
  fijados: Array<{ a: number; en: number }>;
  rampas: Array<{ a: number; en: number; tipo: 'lineal' | 'exponencial' }>;
  setValueAtTime(a: number, en: number): void;
  linearRampToValueAtTime(a: number, en: number): void;
  exponentialRampToValueAtTime(a: number, en: number): void;
}

function parametroFalso(valor: number): ParametroFalso {
  const p: ParametroFalso = {
    value: valor,
    fijados: [],
    rampas: [],
    setValueAtTime(a, en) {
      p.fijados.push({ a, en });
      p.value = a;
    },
    linearRampToValueAtTime(a, en) {
      p.rampas.push({ a, en, tipo: 'lineal' });
      p.value = a;
    },
    exponentialRampToValueAtTime(a, en) {
      p.rampas.push({ a, en, tipo: 'exponencial' });
      p.value = a;
    },
  };
  return p;
}

interface NodoFalso {
  clase: 'gain' | 'oscilador';
  type: string;
  gain: ParametroFalso;
  frequency: ParametroFalso;
  onended: null | (() => void);
  arrancadoEn: number | null;
  detenidoEn: number | null;
  desconexiones: number;
  connect(destino: unknown): unknown;
  disconnect(): void;
  start(en?: number): void;
  stop(en?: number): void;
}

interface Registro {
  nodos: NodoFalso[];
  /** Los buffers que alguien pidió. Tiene que quedar en cero: son osciladores puros. */
  buffers: number;
  conexiones: Array<{ de: NodoFalso; a: unknown }>;
}

function nodoFalso(clase: NodoFalso['clase'], registro: Registro): NodoFalso {
  const nodo: NodoFalso = {
    clase,
    type: '',
    gain: parametroFalso(1),
    frequency: parametroFalso(440),
    onended: null,
    arrancadoEn: null,
    detenidoEn: null,
    desconexiones: 0,
    connect(destino) {
      registro.conexiones.push({ de: nodo, a: destino });
      return destino;
    },
    disconnect() {
      nodo.desconexiones++;
    },
    start(en) {
      nodo.arrancadoEn = en ?? 0;
    },
    stop(en) {
      nodo.detenidoEn = en ?? 0;
    },
  };
  registro.nodos.push(nodo);
  return nodo;
}

interface ContextoFalso {
  state: string;
  currentTime: number;
  sampleRate: number;
  destination: object;
  resume(): Promise<void>;
  createBuffer(): unknown;
  createBufferSource(): unknown;
  createGain(): NodoFalso;
  createOscillator(): NodoFalso;
}

function contextoFalso(registro: Registro): ContextoFalso {
  return {
    state: 'running',
    currentTime: 0,
    sampleRate: 48000,
    destination: { esLaSalida: true },
    resume: () => Promise.resolve(),
    createBuffer() {
      registro.buffers++;
      return { duration: 0 };
    },
    createBufferSource() {
      registro.buffers++;
      return { connect() {}, start() {}, stop() {}, disconnect() {} };
    },
    createGain: () => nodoFalso('gain', registro),
    createOscillator: () => nodoFalso('oscilador', registro),
  };
}

interface Entorno {
  /** Un navegador sin Web Audio: el caso en que el juego se juega mudo y entero. */
  readonly conWebAudio: boolean;
  /** Se arma el grafo antes de empezar, como hace la isla adentro del gesto. */
  readonly armado: boolean;
}

/**
 * Instala los dobles, deja el contexto compartido creado y devuelve cómo desarmar.
 *
 * El contexto se crea con `contextoDeAudio()` —el del sitio, el único— y no con un `new`
 * propio: es la forma de que esta prueba recorra el mismo camino que la página, donde el
 * contexto lo construye la cinta y este módulo se lo encuentra puesto.
 */
function conEntorno(opciones: Partial<Entorno> = {}) {
  const conWebAudio = opciones.conWebAudio ?? true;
  const registro: Registro = { nodos: [], buffers: 0, conexiones: [] };
  const g = globalThis as Record<string, unknown>;
  const previos = { AudioContext: g.AudioContext, window: g.window };

  const Ctor = function () {
    return contextoFalso(registro);
  };
  g.AudioContext = conWebAudio ? Ctor : undefined;
  g.window = conWebAudio ? { AudioContext: Ctor } : {};

  const ctx = conWebAudio ? (contextoDeAudio() as unknown as ContextoFalso) : null;
  if (opciones.armado ?? true) armarEfectos();

  return {
    registro,
    ctx,
    /** Mueve el reloj del audio. Nunca hay que esperar un cuadro de verdad. */
    avanzar(seg: number): void {
      if (ctx) ctx.currentTime += seg;
    },
    osciladores: (): NodoFalso[] => registro.nodos.filter((n) => n.clase === 'oscilador'),
    restaurar() {
      g.AudioContext = previos.AudioContext;
      g.window = previos.window;
      // Los dos módulos guardan estado en su ámbito: sin reiniciar los dos, el caso que
      // sigue arranca con el contexto y el maestro del anterior, y mide otra cosa.
      reiniciarEfectosParaPruebas();
      reiniciarAudioParaPruebas();
    },
  };
}

/** Los tres nombres, para las pruebas que recorren la tabla entera. */
const TODOS: readonly Efecto[] = ['salto', 'tesoro', 'puerta'];

// ---------------------------------------------------------------------------------------
// Los tres, y ninguno más
// ---------------------------------------------------------------------------------------

test('son exactamente tres efectos: salto, tesoro y puerta', () => {
  assert.deepEqual(Object.keys(EFECTOS).sort(), ['puerta', 'salto', 'tesoro']);
});

test('🔴 el fracaso no dispara nada: un nombre que no está en la tabla no crea un solo nodo', () => {
  const e = conEntorno();
  try {
    const nodosAlArmar = e.registro.nodos.length;
    // Los cuatro nombres que alguien escribiría si viniera a ponerle sonido al fallo, más
    // los dos que el prototipo regala gratis y que una tabla mal consultada devolvería.
    for (const inventado of ['fracaso', 'caida', 'golpe', 'derrota', 'constructor', 'toString']) {
      assert.equal(sonar(inventado as Efecto), false, `${inventado} sonó, y no existe`);
    }
    assert.equal(e.registro.nodos.length, nodosAlArmar, 'creó un nodo para algo que no existe');
    assert.equal(vocesVivas(), 0);
  } finally {
    e.restaurar();
  }
});

test('🔴 ninguno pasa del tope de 400 ms, ni en la tabla ni en lo que se programa', () => {
  const e = conEntorno();
  try {
    for (const efecto of TODOS) {
      assert.ok(
        EFECTOS[efecto].largoSeg <= TOPE_EFECTO_SEG,
        `${efecto} dura ${EFECTOS[efecto].largoSeg}, pasado el techo del contrato`,
      );
      assert.equal(sonar(efecto), true, `${efecto} no sonó`);
      e.avanzar(MISMO_CUADRO_SEG * 2);
    }
    for (const osc of e.osciladores()) {
      assert.notEqual(osc.detenidoEn, null, 'un oscilador quedó sin freno: sonaría para siempre');
      assert.ok(
        osc.detenidoEn! - osc.arrancadoEn! <= TOPE_EFECTO_SEG + 1e-9,
        `un efecto dura ${osc.detenidoEn! - osc.arrancadoEn!} seg`,
      );
    }
  } finally {
    e.restaurar();
  }
});

test('🔴 ninguno comparte registro con otro: las tres bandas no se pisan', () => {
  for (const uno of TODOS) {
    for (const otro of TODOS) {
      if (uno === otro) continue;
      const [aGrave, aAgudo] = EFECTOS[uno].registro;
      const [bGrave, bAgudo] = EFECTOS[otro].registro;
      assert.ok(
        Math.max(aGrave, bGrave) > Math.min(aAgudo, bAgudo),
        `${uno} y ${otro} comparten registro, y los dos pueden sonar en el mismo segundo`,
      );
    }
  }
});

test('la puerta es la grave y el tesoro el agudo, como quedó después de FIND-57', () => {
  assert.ok(EFECTOS.puerta.registro[1] < EFECTOS.salto.registro[0], 'la puerta tiene que ser la más grave');
  assert.ok(EFECTOS.salto.registro[1] < EFECTOS.tesoro.registro[0], 'el tesoro tiene que ser el más agudo');
});

// ---------------------------------------------------------------------------------------
// La forma de cada uno: lo poco que se puede mirar sin oído
// ---------------------------------------------------------------------------------------

test('el salto barre hacia arriba, y en rampa exponencial', () => {
  const e = conEntorno();
  try {
    sonar('salto');
    const osc = e.osciladores()[0]!;
    assert.ok(
      osc.frequency.fijados.some((f) => f.a === SALTO_DESDE_HZ),
      'el salto no arranca donde dice la tabla',
    );
    const rampa = osc.frequency.rampas.find((r) => r.a === SALTO_HASTA_HZ);
    assert.ok(rampa, 'el salto no llega arriba: sin barrido no hay despegue');
    assert.equal(rampa.tipo, 'exponencial', 'una rampa lineal sube todo el barrido al final');
    assert.ok(SALTO_HASTA_HZ > SALTO_DESDE_HZ, 'un salto que baja de tono suena a caída');
  } finally {
    e.restaurar();
  }
});

test('el tesoro son dos tonos, el segundo más agudo, con un solo oscilador', () => {
  const e = conEntorno();
  try {
    sonar('tesoro');
    const oscs = e.osciladores();
    assert.equal(oscs.length, 1, 'dos osciladores serían un tercer nodo por voz');
    const tonos = oscs[0]!.frequency.fijados;
    assert.deepEqual(
      tonos.map((f) => f.a),
      [TESORO_HZ, TESORO_HZ_AGUDO],
      'los dos tonos no son los de la tabla, o no están en ese orden',
    );
    assert.ok(tonos[1]!.en > tonos[0]!.en, 'el segundo tono no llega después del primero');
    // Dos subidas: si fuera un tono solo con un quiebre en el medio, habría una sola.
    const ganancias = e.registro.nodos.filter((n) => n.clase === 'gain');
    const envolvente = ganancias[ganancias.length - 1]!;
    assert.equal(
      envolvente.gain.rampas.filter((r) => r.tipo === 'lineal').length,
      2,
      'el tesoro tiene que ser dos golpes, no uno',
    );
  } finally {
    e.restaurar();
  }
});

test('la puerta es un tono sostenido que se apaga solo', () => {
  const e = conEntorno();
  try {
    sonar('puerta');
    const osc = e.osciladores()[0]!;
    assert.deepEqual(
      osc.frequency.fijados.map((f) => f.a),
      [PUERTA_HZ],
      'la puerta no sostiene un tono: le cambia la frecuencia',
    );
    assert.equal(osc.frequency.rampas.length, 0, 'la puerta no barre, se abre');
  } finally {
    e.restaurar();
  }
});

test('🔴 ninguna envolvente pasa de su pico, y el maestro no pasa del techo duro', () => {
  const e = conEntorno();
  try {
    assert.ok(GANANCIA_EFECTOS <= 0.4, 'la constante ya pasa el techo duro de 0,4');
    for (const efecto of TODOS) {
      sonar(efecto);
      e.avanzar(MISMO_CUADRO_SEG * 2);
    }
    const maestro = e.registro.nodos[0]!;
    assert.equal(maestro.gain.value, GANANCIA_EFECTOS, 'el maestro no quedó en la ganancia de la tabla');
    for (const nodo of e.registro.nodos.slice(1)) {
      for (const r of [...nodo.gain.rampas, ...nodo.gain.fijados]) {
        assert.ok(r.a <= 1 + 1e-9, `una envolvente llegó a ${r.a}: el pico es relativo al maestro`);
      }
    }
  } finally {
    e.restaurar();
  }
});

// ---------------------------------------------------------------------------------------
// El grafo: de dónde cuelga, cuánto vive y cuándo se suelta
// ---------------------------------------------------------------------------------------

test('🔴 nada se cuelga del destino salvo el maestro, que es uno solo por página', () => {
  const e = conEntorno();
  try {
    for (const efecto of TODOS) {
      sonar(efecto);
      e.avanzar(MISMO_CUADRO_SEG * 2);
    }
    const alDestino = e.registro.conexiones.filter((c) => c.a === e.ctx!.destination);
    assert.equal(alDestino.length, 1, 'hay más de una cosa colgada del destino');
    assert.equal(alDestino[0]!.de, e.registro.nodos[0], 'lo que cuelga del destino no es el maestro');
  } finally {
    e.restaurar();
  }
});

test('el maestro se crea una sola vez, aunque se arme dos', () => {
  const e = conEntorno();
  try {
    assert.equal(e.registro.nodos.length, 1, 'armar tiene que crear un nodo y nada más');
    assert.equal(armarEfectos(), true);
    assert.equal(e.registro.nodos.length, 1, 'armó un segundo maestro: dos ganancias sobre la misma salida');
  } finally {
    e.restaurar();
  }
});

test('una voz son dos nodos: el oscilador y su envolvente', () => {
  const e = conEntorno();
  try {
    const antes = e.registro.nodos.length;
    assert.equal(sonar('salto'), true);
    assert.equal(e.registro.nodos.length - antes, NODOS_POR_VOZ, 'una voz creó más nodos de los presupuestados');
    assert.equal(vocesVivas(), 1);
  } finally {
    e.restaurar();
  }
});

test('🔴 cada voz se suelta sola en `onended`: en reposo queda un solo nodo vivo', () => {
  const e = conEntorno();
  try {
    sonar('salto');
    const osc = e.osciladores()[0]!;
    assert.ok(osc.onended, 'la voz no avisa cuando termina: se acumula sin hacer ruido');
    assert.equal(vocesVivas(), 1);
    osc.onended!();
    assert.equal(vocesVivas(), 0, 'la voz no se soltó al terminar');
    for (const nodo of e.registro.nodos.slice(1)) {
      assert.ok(nodo.desconexiones > 0, 'quedó un nodo de la voz conectado');
    }
    assert.equal(e.registro.nodos[0]!.desconexiones, 0, 'se soltó el maestro, que vive toda la página');
  } finally {
    e.restaurar();
  }
});

test('🔴 la quinta voz se descarta, no se encola', () => {
  const e = conEntorno();
  try {
    // Cuatro voces vivas: tres efectos distintos y un salto más, un cuadro después.
    for (const efecto of TODOS) assert.equal(sonar(efecto), true, `${efecto} no sonó`);
    e.avanzar(MISMO_CUADRO_SEG * 2);
    assert.equal(sonar('salto'), true, 'la cuarta tiene que entrar');
    assert.equal(vocesVivas(), VOCES_MAX);

    e.avanzar(MISMO_CUADRO_SEG * 2);
    const antes = e.registro.nodos.length;
    assert.equal(sonar('tesoro'), false, 'la quinta sonó: el hilo de audio es el techo, no la RAM');
    assert.equal(e.registro.nodos.length, antes, 'la quinta creó nodos que nadie va a oír');

    // Y cuando una termina, la próxima entra: descartar no es cerrar la puerta.
    e.osciladores()[0]!.onended!();
    assert.equal(vocesVivas(), VOCES_MAX - 1);
    assert.equal(sonar('tesoro'), true, 'con una voz libre tiene que volver a sonar');
  } finally {
    e.restaurar();
  }
});

test('🔴 el mismo efecto en el mismo cuadro suena una vez', () => {
  const e = conEntorno();
  try {
    assert.equal(sonar('salto'), true);
    const antes = e.registro.nodos.length;
    assert.equal(sonar('salto'), false, 'dos saltos en fase suman amplitud: se oye un golpe, no dos saltos');
    assert.equal(e.registro.nodos.length, antes);
    e.avanzar(MISMO_CUADRO_SEG * 1.5);
    assert.equal(sonar('salto'), true, 'pasado el cuadro tiene que volver a sonar');
  } finally {
    e.restaurar();
  }
});

test('un salto y una puerta en el mismo cuadro son dos cosas distintas, y las dos suenan', () => {
  const e = conEntorno();
  try {
    assert.equal(sonar('salto'), true);
    assert.equal(sonar('puerta'), true, 'la ventana de un cuadro no puede ser una sola para los tres');
    assert.equal(vocesVivas(), 2);
  } finally {
    e.restaurar();
  }
});

test('🔴 todo se agenda contra el reloj del audio: nada arranca en el pasado', () => {
  const e = conEntorno();
  try {
    e.avanzar(12.5);
    for (const efecto of TODOS) {
      sonar(efecto);
      e.avanzar(MISMO_CUADRO_SEG * 2);
    }
    for (const osc of e.osciladores()) {
      assert.ok(osc.arrancadoEn! >= 12.5, `un efecto arrancó en ${osc.arrancadoEn}, antes del presente`);
    }
  } finally {
    e.restaurar();
  }
});

test('🔴 cero buffers: los tres son osciladores puros', () => {
  const e = conEntorno();
  try {
    for (const efecto of TODOS) {
      sonar(efecto);
      e.avanzar(MISMO_CUADRO_SEG * 2);
    }
    assert.equal(e.registro.buffers, 0, 'pidió un buffer, y el presupuesto de RAM de CTR-17.4 es cero');
  } finally {
    e.restaurar();
  }
});

// ---------------------------------------------------------------------------------------
// La compuerta de `CTR-17.5`: un interruptor, no tres
// ---------------------------------------------------------------------------------------

test('🔴 sin armar no suena nada: con la cinta apagada el juego se juega en silencio entero', () => {
  const e = conEntorno({ armado: false });
  try {
    assert.equal(efectosArmados(), false);
    for (const efecto of TODOS) {
      assert.equal(sonar(efecto), false, `${efecto} sonó sin que nadie prendiera nada`);
    }
    assert.equal(e.registro.nodos.length, 0, 'creó nodos con el interruptor en cero');
  } finally {
    e.restaurar();
  }
});

test('🔴 sin contexto vivo no se arma: este módulo no construye ninguno', () => {
  const e = conEntorno({ conWebAudio: false, armado: false });
  try {
    assert.equal(armarEfectos(), false, 'armó sin Web Audio, así que se construyó un contexto de algún lado');
    assert.equal(sonar('salto'), false);
    assert.equal(e.registro.nodos.length, 0);
  } finally {
    e.restaurar();
  }
});

test('🔴 `soltarEfectos()` desarma: lo que se dispare después no suena', () => {
  const e = conEntorno();
  try {
    sonar('salto');
    const maestro = e.registro.nodos[0]!;
    soltarEfectos();
    assert.equal(efectosArmados(), false);
    assert.equal(vocesVivas(), 0, 'quedó una voz viva después de soltar');
    assert.ok(maestro.desconexiones > 0, 'el maestro quedó colgado del destino: es una fuga que no se ve');
    const antes = e.registro.nodos.length;
    assert.equal(sonar('salto'), false, 'sonó con la cinta apagada, que es la única forma de romper CTR-17.5');
    assert.equal(e.registro.nodos.length, antes);
  } finally {
    e.restaurar();
  }
});

test('🔴 si el contexto tira a mitad de la voz, no suena y no deja nada colgado', () => {
  const e = conEntorno();
  try {
    // Tira el **segundo** nodo, con el maestro ya creado: es el caso que deja un oscilador
    // huérfano si el rescate mira una variable que nunca se llegó a asignar.
    e.ctx!.createGain = () => {
      throw new Error('este navegador no sabe');
    };
    const antes = e.registro.nodos.length;
    assert.equal(sonar('salto'), false, 'dijo que sonó cuando no pudo crear un nodo');
    assert.equal(vocesVivas(), 0);
    assert.equal(e.registro.nodos.length, antes + 1, 'la falla tiene que ser después del oscilador');
    for (const nodo of e.registro.nodos.slice(antes)) {
      assert.ok(nodo.desconexiones > 0, 'quedó un nodo colgado después de la falla');
    }
  } finally {
    e.restaurar();
  }
});

// ---------------------------------------------------------------------------------------
// Lo que se audita leyendo el archivo, porque no se puede probar corriéndolo
// ---------------------------------------------------------------------------------------

const FUENTE = readFileSync(new URL('./sonido.ts', import.meta.url), 'utf8');
/** Solo el código: los comentarios nombran lo prohibido a propósito, para que se sepa. */
const CODIGO = FUENTE.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

test('🔴 no construye ningún `AudioContext`: se lo pide prestado a `contexto.ts`', () => {
  // Las tres formas van partidas por el mismo motivo que las palabras de más abajo: el
  // barrido que `ARQ-rocola.md` deja escrito al final busca estas mismas tres sobre
  // `src/lib` y `src/scripts`, y tiene que seguir nombrando `contexto.ts` y
  // `diagnostico-audio.ts` y nadie más. Una prueba que escriba la forma prohibida para
  // prohibirla se mete sola en esa lista, y la próxima persona que corra el barrido tiene
  // que leer un resultado y decidir que ese no cuenta.
  for (const prohibida of ['new ' + 'AudioContext', 'webkit' + 'AudioContext', 'new ' + 'Ctor(', 'new (']) {
    assert.ok(!CODIGO.includes(prohibida), `usa ${prohibida}: ADR-07.10 punto 7 no tiene excepción acá`);
  }
});

test('🔴 cero archivos y cero buffers: nada de lo que CTR-17 descartó entra por la ventana', () => {
  for (const prohibida of [
    'createBuffer',
    'decodeAudioData',
    'fetch(',
    'XMLHttpRequest',
    '.mp3',
    'AudioWorkletNode',
    'audioWorklet',
    'ConvolverNode',
    'createConvolver',
    'ScriptProcessorNode',
  ]) {
    assert.ok(!CODIGO.includes(prohibida), `usa ${prohibida}, que CTR-17 descartó por escrito`);
  }
});

test('🔴 no mira el otro reloj: se programa en el del audio', () => {
  for (const prohibida of ['setTimeout', 'setInterval', 'requestAnimationFrame', 'Date.now', 'performance.now']) {
    assert.ok(!CODIGO.includes(prohibida), `usa ${prohibida}: dos relojes no se sincronizan a mano`);
  }
});

test('🔴 no importa el motor, y lo único que importa es el contexto compartido', () => {
  const importaciones = FUENTE.match(/^\s*import\s[^\n]*$/gm) ?? [];
  assert.deepEqual(
    importaciones.map((linea) => linea.trim()),
    ["import { contextoVivo } from '../audio/contexto.ts';"],
    'cambió lo que importa este módulo: el límite de CTR-16.8 es el motor y cualquier otro contexto',
  );
  assert.ok(!CODIGO.includes('kaplay'), 'importó el motor, que trae su propio contexto apagado');
});

test('🔴 el vocabulario del fallo no entra ni en el módulo ni en esta prueba', () => {
  /*
   * Las palabras van partidas a propósito. La barredora de `UX-29 §9.1` corre sobre
   * `src/lib/skayboy/` **entera**, y estos dos archivos están adentro: una prueba que
   * escriba la palabra prohibida para prohibirla ensucia el barrido que existe para
   * encontrarla, y la próxima persona que lo corra tiene que leer un resultado y decidir
   * que ese no cuenta. Partidas, el barrido sale vacío y la guarda sigue en pie.
   */
  const prohibidas = ['vi' + 'da', 'muer' + 'te', 'mo' + 'riste', 'per' + 'diste', 'game' + ' over'];
  const prueba = readFileSync(new URL('./sonido.test.ts', import.meta.url), 'utf8');
  for (const archivo of [FUENTE, prueba]) {
    for (const palabra of prohibidas) {
      assert.ok(
        !archivo.toLowerCase().includes(palabra),
        'entró una palabra de la lista de BR-24: acá el fracaso devuelve a la entrada y nada más',
      );
    }
  }
});
