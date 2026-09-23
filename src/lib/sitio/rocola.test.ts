/**
 * Verificación de la rocola (`ADR-07`, `T-217`).
 *
 * Lo que se prueba acá **no es que suene a casete**: eso lo decide un oído en un teléfono, y
 * esa lista está al final de `ARQ-rocola.md`. Lo que se prueba es lo que, si está mal, no se
 * descubre escuchando:
 *
 * - Que **no suene en una pantalla de juego**, ni aunque se la llame a mano. Es el riesgo
 *   número uno del ciclo: los recortes son las respuestas de `US-02`.
 * - Que **el elemento lleve marca y viva fuera del documento**. Sin eso la rocola se calla a
 *   sí misma en el primer segundo, y el síntoma es "a veces no suena".
 * - Que **no decodifique**. Un tema de cuatro minutos en `AudioBuffer` son decenas de MB de
 *   RAM en un teléfono, y eso no se ve hasta que el navegador mata la pestaña.
 * - Que **la vuelta no repita un tema**, y que los enteros salgan antes que los recortes, que
 *   es literalmente lo que pidió el usuario.
 * - Que **una pieza que no baja no deje la cinta en silencio**.
 *
 * Desde `T-244` se prueba además el cuarto modo, y ahí lo que no se descubre escuchando son
 * las dos cosas que lo definen: que **no sortee** —con la pantalla sembrada de más, que es el
 * caso adverso— y que **no arranque sin un dedo**. Lo segundo se mira desde el otro lado, en
 * `cinta.test.ts`, que es donde vive el rearme.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  FALLAS_SEGUIDAS,
  GANANCIA_ROCOLA,
  PROFUNDIDAD_BAMBOLEO_ROCOLA,
  RETARDO_BASE_SEG,
  TEMA_FIJO,
  type Pieza,
  apagarRocola,
  alCambiarLaPieza,
  piezaSonando,
  prenderRocola,
  prenderTemaFijo,
  proximaPieza,
  reiniciarRocolaParaPruebas,
  rocolaSembrada,
  sembrarRocola,
} from './rocola.ts';
import { RUTA_TEMA_FIJO } from './rutas-sonoras.ts';

// ---------------------------------------------------------------------------------------
// Los dobles
// ---------------------------------------------------------------------------------------

interface ParamFalso {
  value: number;
  cancelScheduledValues(): void;
  setValueAtTime(a: number): void;
  linearRampToValueAtTime(a: number): void;
}

const paramFalso = (v: number): ParamFalso => ({
  value: v,
  cancelScheduledValues() {},
  setValueAtTime(a) {
    this.value = a;
  },
  linearRampToValueAtTime(a) {
    this.value = a;
  },
});

interface NodoFalso {
  clase: string;
  type: string;
  gain: ParamFalso;
  frequency: ParamFalso;
  Q: ParamFalso;
  delayTime: ParamFalso;
  conectadoA: unknown[];
  arrancado: boolean;
  frenado: boolean;
  desconexiones: number;
  connect(d: unknown): unknown;
  disconnect(): void;
  start(): void;
  stop(): void;
}

interface RegistroAudio {
  nodos: NodoFalso[];
  fuentesDeMedio: number;
  decodificaciones: number;
}

function nodoFalso(clase: string, reg: RegistroAudio): NodoFalso {
  const n: NodoFalso = {
    clase,
    type: '',
    gain: paramFalso(1),
    frequency: paramFalso(440),
    Q: paramFalso(1),
    delayTime: paramFalso(0),
    conectadoA: [],
    arrancado: false,
    frenado: false,
    desconexiones: 0,
    connect(d) {
      n.conectadoA.push(d);
      return d;
    },
    disconnect() {
      n.desconexiones++;
    },
    start() {
      n.arrancado = true;
    },
    stop() {
      n.frenado = true;
    },
  };
  reg.nodos.push(n);
  return n;
}

function contextoFalso(reg: RegistroAudio, opciones: { fuenteTira?: boolean } = {}) {
  return {
    currentTime: 0,
    sampleRate: 48000,
    destination: { esLaSalida: true },
    createBuffer(_c: number, muestras: number) {
      const datos = new Float32Array(muestras);
      return { duration: muestras / 48000, length: muestras, getChannelData: () => datos };
    },
    createBufferSource: () => nodoFalso('fuente', reg),
    createGain: () => nodoFalso('gain', reg),
    createBiquadFilter: () => nodoFalso('biquad', reg),
    createDelay: () => nodoFalso('delay', reg),
    createOscillator: () => nodoFalso('oscilador', reg),
    createMediaElementSource() {
      if (opciones.fuenteTira) throw new Error('este iOS no sabe');
      reg.fuentesDeMedio++;
      return nodoFalso('fuenteDeMedio', reg);
    },
    // Está a propósito: si la rocola la llamara, el caso 9 lo caza.
    decodeAudioData() {
      reg.decodificaciones++;
      return Promise.resolve({});
    },
  };
}

interface MedioFalso {
  src: string;
  preload: string;
  volume: number;
  paused: boolean;
  dataset: { cinta?: string };
  isConnected: boolean;
  pedidos: string[];
  escuchas: Record<string, Array<() => void>>;
  addEventListener(t: string, f: () => void): void;
  play(): Promise<void>;
  pause(): void;
  removeAttribute(a: string): void;
}

let ultimoMedio: MedioFalso | null = null;

function instalarAudio(opciones: { playTira?: boolean } = {}): void {
  (globalThis as Record<string, unknown>).Audio = function AudioFalso(this: MedioFalso) {
    const m: MedioFalso = {
      src: '',
      preload: '',
      volume: 1,
      paused: true,
      dataset: {},
      isConnected: false,
      pedidos: [],
      escuchas: {},
      addEventListener(t, f) {
        (m.escuchas[t] ??= []).push(f);
      },
      play() {
        m.paused = false;
        m.pedidos.push(m.src);
        return opciones.playTira ? Promise.reject(new Error('no')) : Promise.resolve();
      },
      pause() {
        m.paused = true;
      },
      removeAttribute() {
        m.src = '';
      },
    };
    ultimoMedio = m;
    return m;
  } as unknown as typeof Audio;
}

function instalarVentana(ruta: string): void {
  (globalThis as Record<string, unknown>).window = { location: { pathname: ruta } };
}

function limpiar(): void {
  reiniciarRocolaParaPruebas();
  delete (globalThis as Record<string, unknown>).window;
  delete (globalThis as Record<string, unknown>).Audio;
  ultimoMedio = null;
}

/** Un caso listo: ventana en una ruta que puede sonar, elemento falso y contexto falso. */
function caso(ruta = '/', opciones: { fuenteTira?: boolean; playTira?: boolean } = {}) {
  limpiar();
  instalarVentana(ruta);
  instalarAudio({ playTira: opciones.playTira });
  const reg: RegistroAudio = { nodos: [], fuentesDeMedio: 0, decodificaciones: 0 };
  const ctx = contextoFalso(reg, { fuenteTira: opciones.fuenteTira });
  const salida = nodoFalso('salida', reg);
  return { reg, ctx, salida };
}

const recortes = (n: number): Pieza[] =>
  Array.from({ length: n }, (_, i) => ({ slug: `tema-${i}`, titulo: `Tema ${i}`, entero: false }));

/** Dispara un evento del elemento, como haría el navegador. */
function disparar(tipo: string): void {
  for (const f of ultimoMedio?.escuchas[tipo] ?? []) f();
}

// ---------------------------------------------------------------------------------------
// El candado de la ruta (casos 5 y 20)
// ---------------------------------------------------------------------------------------

test('🔴 caso 5: en una pantalla de juego no arranca, no crea un nodo y no pide un byte', () => {
  for (const ruta of [
    '/juegos/adivinar-el-tema/',
    '/juegos/completar-la-letra/',
    '/juegos/adivinar-por-la-letra/',
    '/quiz/',
    '/redondopedia/walter-bulacio/',
  ]) {
    const { reg, ctx, salida } = caso(ruta);
    sembrarRocola(recortes(95));
    const arranco = prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
    assert.equal(arranco, false, `arrancó en ${ruta}: le sopla la respuesta al que juega`);
    assert.equal(reg.nodos.length, 1, `creó nodos en ${ruta}`); // solo la salida del caso
    assert.equal(ultimoMedio, null, `creó el elemento en ${ruta}`);
    assert.equal(piezaSonando(), null);
  }
  limpiar();
});

test('🔴 caso 20, candado C: sin sembrar no arranca, aunque la ruta lo permita', () => {
  const { ctx, salida } = caso('/');
  assert.equal(rocolaSembrada(), false);
  assert.equal(prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode), false);
  assert.equal(ultimoMedio, null, 'creó el elemento sin tener qué poner');
  limpiar();
});

// ---------------------------------------------------------------------------------------
// El elemento (casos 6 y 9)
// ---------------------------------------------------------------------------------------

test('🔴 caso 6: el elemento lleva marca y no está conectado al documento', () => {
  const { ctx, salida } = caso('/');
  sembrarRocola(recortes(5));
  prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
  assert.equal(ultimoMedio?.dataset.cinta, 'rocola', 'sin la marca, la cama se calla a sí misma');
  assert.equal(ultimoMedio?.isConnected, false, 'el elemento entró al documento');
  assert.equal(ultimoMedio?.preload, 'none', 'precarga: son 3–4 MB que nadie pidió');
  limpiar();
});

test('🔴 caso 9: no decodifica nunca, y crea UNA sola fuente de medio en toda la sesión', () => {
  const { reg, ctx, salida } = caso('/');
  sembrarRocola(recortes(6));
  prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
  proximaPieza();
  proximaPieza();
  proximaPieza();
  assert.equal(reg.decodificaciones, 0, 'decodificó: son decenas de MB de RAM por tema');
  assert.equal(reg.fuentesDeMedio, 1, 'createMediaElementSource tira la segunda vez sobre el mismo elemento');
  limpiar();
});

test('🔴 `rocola.ts` no nombra `decodeAudioData` ni una vez', () => {
  const fuente = readFileSync('src/lib/sitio/rocola.ts', 'utf-8');
  const codigo = fuente.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.ok(!codigo.includes('decodeAudioData'), 'la regla más dura de ADR-07.4 se rompió');
});

test('caso 10: si `createMediaElementSource` tira, el tema suena igual, sin cadena', () => {
  const { reg, ctx, salida } = caso('/', { fuenteTira: true });
  sembrarRocola(recortes(4));
  const arranco = prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
  assert.equal(arranco, true, 'sin filtro es un detalle; sin música es cerrarle el molinete a alguien');
  assert.equal(ultimoMedio?.pedidos.length, 1, 'no llegó a pedir el tema');
  assert.equal(ultimoMedio?.volume, GANANCIA_ROCOLA, 'sin cadena, el nivel lo tiene que poner el elemento');
  assert.equal(reg.fuentesDeMedio, 0);
  limpiar();
});

test('la cadena de ADR-07.5 se arma con sus cinco nodos y sus valores', () => {
  const { reg, ctx, salida } = caso('/');
  sembrarRocola(recortes(3));
  prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
  const delay = reg.nodos.find((n) => n.clase === 'delay');
  const osc = reg.nodos.find((n) => n.clase === 'oscilador');
  assert.ok(delay, 'sin DelayNode no hay arrastre: es el único camino sin `playbackRate`');
  assert.equal(delay.delayTime.value, RETARDO_BASE_SEG);
  assert.ok(osc?.arrancado, 'el bamboleo no arrancó');
  // El bamboleo entra al `delayTime`, nunca al volumen: una entrada conectada a un
  // `AudioParam` se suma al valor, así que con el volumen en cero seguiría sumando.
  const profundidad = reg.nodos.find(
    (n) => n.clase === 'gain' && n.gain.value === PROFUNDIDAD_BAMBOLEO_ROCOLA,
  );
  assert.ok(profundidad, 'no hay gain de profundidad del bamboleo');
  assert.ok(
    profundidad.conectadoA.includes(delay.delayTime),
    'el bamboleo no entra al delayTime: si entrara al volumen, "callada" no sería silencio',
  );
  limpiar();
});

// ---------------------------------------------------------------------------------------
// La vuelta (casos 11 a 14)
// ---------------------------------------------------------------------------------------

test('🔴 caso 11: con 0 enteros y 95 recortes, las 95 primeras piezas son 95 temas distintos', () => {
  const { ctx, salida } = caso('/');
  sembrarRocola(recortes(95));
  prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
  const salieron = [piezaSonando()!.slug];
  for (let i = 1; i < 95; i++) {
    proximaPieza();
    salieron.push(piezaSonando()!.slug);
  }
  assert.equal(new Set(salieron).size, 95, 'una vuelta repitió un tema');
  limpiar();
});

test('🔴 caso 12: con enteros sembrados, todos salen antes que el primer recorte', () => {
  const { ctx, salida } = caso('/');
  const piezas: Pieza[] = [
    ...Array.from({ length: 8 }, (_, i) => ({ slug: `e-${i}`, titulo: `E ${i}`, entero: true })),
    ...recortes(20),
  ];
  sembrarRocola(piezas);
  prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
  const orden = [piezaSonando()!];
  for (let i = 1; i < 28; i++) {
    proximaPieza();
    orden.push(piezaSonando()!);
  }
  const primerRecorte = orden.findIndex((p) => !p.entero);
  assert.equal(primerRecorte, 8, 'los enteros no salieron todos primero');
  assert.ok(orden.slice(0, 8).every((p) => p.entero));
  assert.ok(orden.slice(8).every((p) => !p.entero));
  limpiar();
});

test('de cada tema suena la mejor pieza que tenga: el entero si existe, el recorte si no', () => {
  const { ctx, salida } = caso('/');
  sembrarRocola([
    { slug: 'con-entero', titulo: 'Con entero', entero: true },
    { slug: 'sin-entero', titulo: 'Sin entero', entero: false },
  ]);
  prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
  proximaPieza();
  const pedidos = ultimoMedio!.pedidos;
  assert.ok(pedidos.some((u) => u === '/audio/temas/con-entero.mp3'), 'el entero no salió de su carpeta');
  assert.ok(
    pedidos.some((u) => u === '/audio/fragmentos/sin-entero.mp3'),
    'el recorte no salió de su carpeta',
  );
  limpiar();
});

test('🔴 caso 13: la vuelta nueva no arranca con el último tema que sonó', () => {
  // Es el único lugar donde se puede oír el mismo tema dos veces seguidas, y es el que se
  // nota. Con dos piezas el empalme es forzoso, así que el caso es máximamente adverso: sin
  // la línea que lo corrige, esto falla en la mitad de las corridas.
  for (let intento = 0; intento < 40; intento++) {
    const { ctx, salida } = caso('/');
    sembrarRocola(recortes(2));
    prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
    proximaPieza();
    const ultimoDeLaVuelta = piezaSonando()!.slug;
    proximaPieza(); // acá se agota y se rearma
    assert.notEqual(piezaSonando()!.slug, ultimoDeLaVuelta, 'el empalme repitió el mismo tema');
  }
  limpiar();
});

test('🔴 caso 14: un tema con entero Y con recorte sale una sola vez por vuelta', () => {
  // La vuelta es de temas, no de archivos. Si fuera de archivos, este tema saldría dos veces:
  // una entero y otra en diez segundos.
  const { ctx, salida } = caso('/');
  sembrarRocola([{ slug: 'uno', titulo: 'Uno', entero: true }, ...recortes(3)]);
  prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
  const salieron = [piezaSonando()!.slug];
  for (let i = 1; i < 4; i++) {
    proximaPieza();
    salieron.push(piezaSonando()!.slug);
  }
  assert.equal(salieron.filter((s) => s === 'uno').length, 1, 'el tema con las dos piezas salió dos veces');
  limpiar();
});

// ---------------------------------------------------------------------------------------
// Cuando algo no baja (caso 15)
// ---------------------------------------------------------------------------------------

test('🔴 caso 15: tres fallas seguidas y se rinde a cama, sin reintentar el mismo archivo', () => {
  const { ctx, salida } = caso('/');
  sembrarRocola(recortes(20));
  let rendida = 0;
  prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode, () => {
    rendida++;
  });
  const primero = ultimoMedio!.pedidos[0]!;
  for (let i = 0; i < FALLAS_SEGUIDAS; i++) disparar('error');

  assert.equal(rendida, 1, 'no avisó que se rendía: la cinta se quedaría en silencio');
  assert.equal(piezaSonando(), null);
  const pedidos = ultimoMedio!.pedidos;
  assert.equal(new Set(pedidos).size, pedidos.length, 'reintentó un archivo que ya había fallado');
  assert.ok(pedidos.filter((u) => u === primero).length === 1);
  limpiar();
});

test('rendirse deja el elemento pausado y sin `src`: lo que corta la descarga', () => {
  const { ctx, salida } = caso('/');
  sembrarRocola(recortes(10));
  prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
  apagarRocola();
  assert.equal(ultimoMedio?.paused, true);
  assert.equal(ultimoMedio?.src, '', 'con `src` puesto el navegador puede seguir bajando');
  limpiar();
});

test('una falla sola no se rinde: pasa a la siguiente', () => {
  const { ctx, salida } = caso('/');
  sembrarRocola(recortes(10));
  let rendida = 0;
  prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode, () => {
    rendida++;
  });
  disparar('error');
  assert.equal(rendida, 0);
  assert.ok(piezaSonando(), 'se quedó sin pieza por una falla sola');
  assert.equal(ultimoMedio!.pedidos.length, 2);
  limpiar();
});

// ---------------------------------------------------------------------------------------
// El aviso de pieza (el hueco que encontró `UX-26`)
// ---------------------------------------------------------------------------------------

test('🔴 avisa cada vez que cambia la pieza, aunque el estado de la cinta no cambie', () => {
  // `alCambiarLaCinta()` avisa por estado, y pasar de un tema al siguiente no cambia el
  // estado: sigue `sonando`. Sin este aviso el interruptor mostraría para siempre el título
  // de la primera pieza. Lo encontró `UX-26` leyendo el contrato, no escuchando.
  const { ctx, salida } = caso('/');
  sembrarRocola(recortes(5));
  const vistos: Array<string | null> = [];
  const baja = alCambiarLaPieza((p) => vistos.push(p?.slug ?? null));
  prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
  proximaPieza();
  proximaPieza();
  assert.equal(vistos.length, 3, 'no avisó una vez por pieza');
  assert.equal(new Set(vistos).size, 3);
  baja();
  proximaPieza();
  assert.equal(vistos.length, 3, 'siguió avisando después de la baja');
  limpiar();
});

test('apagar avisa que ya no hay pieza', () => {
  const { ctx, salida } = caso('/');
  sembrarRocola(recortes(3));
  prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
  const vistos: Array<string | null> = [];
  alCambiarLaPieza((p) => vistos.push(p?.slug ?? null));
  apagarRocola();
  assert.deepEqual(vistos, [null]);
  assert.equal(piezaSonando(), null);
  limpiar();
});

test('un oyente con un defecto no apaga la rocola', () => {
  const { ctx, salida } = caso('/');
  sembrarRocola(recortes(3));
  alCambiarLaPieza(() => {
    throw new Error('interruptor roto');
  });
  prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
  assert.ok(piezaSonando(), 'un interruptor roto se llevó puesta la música');
  limpiar();
});

// ---------------------------------------------------------------------------------------
// Los dos casos que faltaban (`FIND-54`, `REV-13`)
// ---------------------------------------------------------------------------------------

test('🔴 caso 19: el apagado de emergencia es un literal que se puede grepear y cambiar', () => {
  /*
   * `ADR-07.9` lo pide con las mismas palabras que `ADR-04.7` pide el de la cama: **que se
   * pueda cambiar sin entender el módulo**. Un valor calculado —una variable de entorno, una
   * función— obligaría a mirar la configuración del despliegue para saber si el sitio pone
   * música.
   *
   * Por qué esto se prueba leyendo el archivo y no llamando a la función: la constante se
   * evalúa al cargar el módulo, así que una prueba no puede ponerla en `false` sin volver a
   * importar todo. Lo que sí se puede fijar —y es lo que el ADR promete— es **la forma**.
   */
  const fuente = readFileSync('src/lib/sitio/rocola.ts', 'utf-8');
  assert.match(fuente, /^export const ROCOLA_HABILITADA = (true|false);$/m);

  // Y que esté mirado antes que nada en la puerta de entrada: si estuviera después de crear
  // el elemento, apagarla igual pediría bytes.
  const cuerpo = fuente.slice(fuente.indexOf('export function prenderRocola'));
  assert.ok(
    cuerpo.indexOf('ROCOLA_HABILITADA') < cuerpo.indexOf('crearElemento'),
    'el apagado de emergencia se mira después de empezar a construir',
  );
});

test('🔴 caso 17: con la pantalla escondida la rocola sigue, y la cama se calla sola', () => {
  /*
   * **Los dos lados de esto viven en capas distintas, y por eso es fácil romperlo sin
   * darse cuenta.** La cama se calla con `document.hidden` porque `debeCallarse()` lo
   * pregunta (`cinta.ts`). La rocola **no se entera**: un tema que se corta porque alguien
   * miró un mensaje y vuelve no es una atmósfera, es un reproductor roto — y el navegador ya
   * decide solo qué hacer con el audio de una pestaña escondida.
   *
   * Lo que fija esta prueba es que **la rocola no tenga ningún escucha de visibilidad**:
   * mientras no lo tenga, esconder la pantalla no puede tocarla. `ADR-07.8` lo declara como
   * desvío de `ADR-04.8`, y hasta `FIND-54` no lo cubría ninguna prueba.
   */
  const { ctx, salida } = caso('/');
  sembrarRocola(recortes(6));
  prenderRocola(ctx as unknown as AudioContext, salida as unknown as AudioNode);
  const antes = piezaSonando();
  assert.ok(antes, 'no arrancó');

  // El navegador esconde la pestaña. La rocola no tiene por dónde enterarse.
  (globalThis as Record<string, unknown>).document = {
    hidden: true,
    addEventListener() {
      throw new Error('la rocola registró un escucha de visibilidad');
    },
  };
  try {
    assert.equal(piezaSonando()?.slug, antes.slug, 'la pieza cambió al esconder la pantalla');
    assert.equal(ultimoMedio?.paused, false, 'el tema se pausó solo');
  } finally {
    delete (globalThis as Record<string, unknown>).document;
  }

  const fuente = readFileSync('src/lib/sitio/rocola.ts', 'utf-8');
  const codigo = fuente.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.ok(!codigo.includes('visibilitychange'), 'la rocola escucha visibilidad y no debe');
  assert.ok(!codigo.includes('document.hidden'), 'la rocola mira `document.hidden` y no debe');
  limpiar();
});

// ---------------------------------------------------------------------------------------
// El cuarto modo: `tema-fijo` (`D-39`, `ADR-08.9`, `T-244`)
// ---------------------------------------------------------------------------------------

/** La ruta sale del módulo y no de una cadena escrita acá: si la página se renombra, sigue. */
const RUTA_FIJA = `/juegos/${RUTA_TEMA_FIJO}/`;

/**
 * El descanso entre piezas, en la mano.
 *
 * Sin esto, ver la repetición costaría 0,8 segundos de espera real por vuelta, y una prueba
 * que hay que esperar es una prueba que nadie corre. Es el mismo modal que usa
 * `cinta.test.ts` con sus temporizadores, y por el mismo motivo.
 */
function conDescansoEnLaMano<T>(cuerpo: (correr: () => void) => T): T {
  const g = globalThis as Record<string, unknown>;
  const previos = { setTimeout: g.setTimeout, clearTimeout: g.clearTimeout };
  const pendientes = new Map<number, () => void>();
  let proximoId = 0;
  g.setTimeout = (fn: () => void) => {
    pendientes.set(++proximoId, fn);
    return proximoId;
  };
  g.clearTimeout = (id: number) => {
    pendientes.delete(id);
  };
  try {
    return cuerpo(() => {
      const listos = [...pendientes.values()];
      pendientes.clear();
      for (const fn of listos) fn();
    });
  } finally {
    g.setTimeout = previos.setTimeout;
    g.clearTimeout = previos.clearTimeout;
  }
}

test('🔴 el cuarto modo NO sortea: con 95 recortes sembrados suena el mismo tema, vuelta tras vuelta', () => {
  conDescansoEnLaMano((correrDescanso) => {
    const { ctx, salida } = caso(RUTA_FIJA);
    // La siembra de más es el caso adverso a propósito: si el modo mirara la vuelta en vez de
    // su pieza, acá sonaría cualquiera de los 95 y el defecto pasaría por música.
    sembrarRocola(recortes(95));
    const arranco = prenderTemaFijo(ctx as unknown as AudioContext, salida as unknown as AudioNode);

    assert.equal(arranco, true, 'no arrancó en la única pantalla que lo declara');
    assert.equal(piezaSonando()?.slug, TEMA_FIJO.slug, 'sorteó: puso un tema que nadie eligió');

    // Doce vueltas: el tema termina, descansa y vuelve a empezar. Siempre el mismo.
    for (let vuelta = 0; vuelta < 12; vuelta++) {
      disparar('ended');
      correrDescanso();
      assert.equal(piezaSonando()?.slug, TEMA_FIJO.slug, `en la vuelta ${vuelta} cambió de tema`);
    }

    const pedidos = ultimoMedio!.pedidos;
    assert.equal(pedidos.length, 13, 'no volvió a empezar: el tema no queda en repetición');
    assert.equal(new Set(pedidos).size, 1, `pidió más de un archivo: ${[...new Set(pedidos)].join(', ')}`);
    limpiar();
  });
});

test('🔴 las dos puertas no se abren en la pantalla de la otra', () => {
  // Es el candado de `caso 5` para el modo nuevo, en los dos sentidos. El de ida importa
  // porque la pantalla del tema fijo es un juego: una rocola sorteando ahí pondría los 95
  // recortes, que son las respuestas de `US-02`.
  const enLaFija = caso(RUTA_FIJA);
  sembrarRocola(recortes(95));
  assert.equal(
    prenderRocola(enLaFija.ctx as unknown as AudioContext, enLaFija.salida as unknown as AudioNode),
    false,
    'la rocola sorteó en la pantalla del tema fijo',
  );
  assert.equal(ultimoMedio, null, 'creó el elemento igual');
  assert.equal(piezaSonando(), null);

  for (const ruta of ['/', '/letras-y-acordes/', '/redondopedia/', '/juegos/dos-ejes/', '/quiz/']) {
    const { ctx, salida } = caso(ruta);
    sembrarRocola(recortes(95));
    const arranco = prenderTemaFijo(ctx as unknown as AudioContext, salida as unknown as AudioNode);
    assert.equal(arranco, false, `el tema fijo sonó en ${ruta}, que no lo declara`);
    assert.equal(ultimoMedio, null, `creó el elemento en ${ruta}`);
    assert.equal(piezaSonando(), null);
  }
  limpiar();
});

test('"poné otro tema" no hace nada en el cuarto modo: no hay otro', () => {
  // Volver a empezar la misma pieza sería un control que dice una cosa y hace otra. El
  // interruptor tampoco lo ofrece ahí (`UX-26`), y son dos candados sobre la misma puerta.
  const { ctx, salida } = caso(RUTA_FIJA);
  prenderTemaFijo(ctx as unknown as AudioContext, salida as unknown as AudioNode);
  const pedidos = ultimoMedio!.pedidos.length;
  proximaPieza();
  proximaPieza();
  assert.equal(ultimoMedio!.pedidos.length, pedidos, 'volvió a empezar el mismo tema');
  assert.equal(piezaSonando()?.slug, TEMA_FIJO.slug);
  limpiar();
});

test('🔴 en el cuarto modo una pieza que no baja se cae a cama de una, sin reintentar', () => {
  // `FALLAS_SEGUIDAS` cuenta piezas distintas, y acá hay una sola: reintentar sería pedir
  // tres veces el archivo que acaba de no bajar, con la púa encima cada vez.
  const { ctx, salida } = caso(RUTA_FIJA);
  let rendida = 0;
  prenderTemaFijo(ctx as unknown as AudioContext, salida as unknown as AudioNode, () => {
    rendida++;
  });
  const pedidos = ultimoMedio!.pedidos.length;
  assert.equal(pedidos, 1);

  disparar('error');
  assert.equal(rendida, 1, 'no avisó que se rendía: la cinta se quedaría en silencio, no con la cama');
  assert.equal(piezaSonando(), null);
  assert.equal(ultimoMedio!.pedidos.length, pedidos, 'reintentó el archivo que ya había fallado');
  limpiar();
});

test('🔴 el tema fijo existe de verdad: el slug y el título son los del cancionero', () => {
  /*
   * Un slug mal escrito acá no rompe nada al construir. Se descubre el día que alguien
   * prende la cinta en esa pantalla y no baja nada — o sea, no se descubre. `CNT-20` eligió
   * el tema leyendo este JSON, y esta prueba es la que mantiene atadas las dos puntas.
   */
  const cancionero = JSON.parse(readFileSync('src/data/cancionero.json', 'utf-8')) as {
    temas: Array<{ slug: string; titulo: string }>;
  };
  const tema = cancionero.temas.find((t) => t.slug === TEMA_FIJO.slug);
  assert.ok(tema, `el slug "${TEMA_FIJO.slug}" no está en el cancionero`);
  assert.equal(tema.titulo, TEMA_FIJO.titulo, 'el título no es el que dice el cancionero');
});

test('🔴 ADR-08.9: el tema fijo sale del dato del juego, y el codigo no lo puede contradecir', () => {
  /*
   * `ADR-08.9` es explícito sobre dónde vive el tema: **lo declara `temaFijo` en
   * `src/data/skayboy.json`**, lo elige `contenido` (`CNT-20`) y la cinta lo repite. Hoy el
   * código además lo tiene escrito en `TEMA_FIJO`, y eso deja **dos verdades sobre la misma
   * cosa**.
   *
   * Mientras sean dos, esta prueba las obliga a decir lo mismo. El defecto que impide es
   * silencioso y de los peores: alguien cambia el tema en el JSON —que es el lugar que el
   * contrato manda tocar—, la cinta sigue poniendo el viejo, y nada se rompe. Se descubre
   * escuchando, o no se descubre.
   *
   * **Esto no reemplaza el arreglo de fondo**, que es que la página siembre el tema como
   * siembra el banco (el candado C de `ADR-07.9`) y que `rocola.ts` deje de conocer a un
   * juego por su nombre. Eso entra con la isla, en `T-247`. Hasta entonces, acá está la
   * atadura.
   */
  const dato = JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as {
    temaFijo: string | null;
  };
  assert.equal(
    dato.temaFijo,
    TEMA_FIJO.slug,
    'el dato del juego y la constante de la cinta nombran temas distintos: manda el dato (`ADR-08.9`)',
  );
});
