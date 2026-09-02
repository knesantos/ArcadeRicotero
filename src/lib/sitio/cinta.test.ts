/**
 * Verificación de la cama de cinta (`ADR-04`).
 *
 * Lo que se prueba acá **no es que suene**: que suene a cinta y no a televisor lo decide un
 * oído en un teléfono, y esa lista está al final del ADR. Lo que se prueba es todo lo que,
 * si está mal, **no se descubre escuchando**:
 *
 * - Que la cama se calle cuando algo suena. Si esto falla, lo que se rompe no es la
 *   atmósfera: es el escalón de 0,1 s del reveal, que es lo único que este sitio promete
 *   servir bien.
 * - Que **vuelva**. Un `<audio>` que la pantalla borra mientras suena la dejaría muda para
 *   siempre y sin síntoma — nadie reporta una cama que no vuelve.
 * - Que el bamboleo no entre al gain maestro. Si entra, "callada" **no es silencio**, y eso
 *   se oye como un defecto del juego, no de la atmósfera.
 * - Que apagarla no deje nada atrás. Un escucha vivo sobre `document` después de apagar es
 *   una fuga que no se ve.
 *
 * Corre en Node con dobles de `AudioContext`, `document` y `localStorage`, con los mismos
 * modales que `audio.test.ts` y `contexto.test.ts`: se instalan globales, se arma el caso, y
 * se restaura en un `finally` que reinicia **los dos** módulos —el de la cama y el del
 * contexto—, porque los dos guardan estado en su ámbito.
 *
 * **Los temporizadores también son dobles**, y no por gusto: la espera para volver dura seis
 * segundos de verdad, y una prueba que los espere es una prueba que nadie corre. Con el
 * doble se puede además contestar la pregunta que importa —*¿quedó alguno pendiente después
 * de apagar?*— que con el real no se puede ni mirar.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ARRASTRE_HZ,
  BAJADA_SEG,
  BAMBOLEO_HZ,
  CAMA_HABILITADA,
  CRUCE_SEG,
  ESPERA_PARA_VOLVER_SEG,
  FLUTTER_HZ,
  GANANCIA_CAMA,
  LARGO_BUCLE_SEG,
  NIVEL_ARRASTRE,
  PISO_HZ,
  PROFUNDIDAD_BAMBOLEO,
  PROFUNDIDAD_FLUTTER,
  SISEO_HZ,
  SUBIDA_SEG,
  alCambiarLaCinta,
  apagarCinta,
  cintaDisponible,
  estadoDeLaCinta,
  prenderCinta,
  rearmarCinta,
  reiniciarCintaParaPruebas,
} from './cinta.ts';
import { reiniciarAudioParaPruebas, tomarLaSalida } from '../audio/contexto.ts';

const TASA = 44100;

// ---------------------------------------------------------------------------------------
// Los dobles
// ---------------------------------------------------------------------------------------

interface ParametroFalso {
  value: number;
  cancelados: number;
  fijados: Array<{ a: number; en: number }>;
  rampas: Array<{ a: number; en: number }>;
  cancelScheduledValues(en?: number): void;
  setValueAtTime(a: number, en: number): void;
  linearRampToValueAtTime(a: number, en: number): void;
}

function parametroFalso(valor: number): ParametroFalso {
  const p: ParametroFalso = {
    value: valor,
    cancelados: 0,
    fijados: [],
    rampas: [],
    cancelScheduledValues() {
      p.cancelados++;
    },
    setValueAtTime(a, en) {
      p.fijados.push({ a, en });
      p.value = a;
    },
    linearRampToValueAtTime(a, en) {
      p.rampas.push({ a, en });
      p.value = a;
    },
  };
  return p;
}

interface NodoFalso {
  clase: 'fuente' | 'gain' | 'biquad' | 'oscilador';
  type: string;
  loop: boolean;
  buffer: unknown;
  gain: ParametroFalso;
  frequency: ParametroFalso;
  Q: ParametroFalso;
  playbackRate: ParametroFalso;
  onended: null | (() => void);
  arrancado: boolean;
  detenidoEn: number | null;
  desconexiones: number;
  connect(destino: unknown): void;
  disconnect(): void;
  start(en?: number): void;
  stop(en?: number): void;
}

interface BufferFalso {
  length: number;
  datos: Float32Array;
  getChannelData(): Float32Array;
}

interface Registro {
  construidos: number;
  contextos: ContextoFalso[];
  gains: NodoFalso[];
  biquads: NodoFalso[];
  osciladores: NodoFalso[];
  fuentes: NodoFalso[];
  buffers: BufferFalso[];
  conexiones: Array<{ de: NodoFalso; a: unknown }>;
  escuchasDelContexto: Array<{ tipo: string; fn: unknown }>;
}

interface ContextoFalso {
  state: string;
  currentTime: number;
  sampleRate: number;
  destination: object;
  resume(): Promise<void>;
  createBuffer(canales: number, muestras: number, tasa: number): BufferFalso;
  createBufferSource(): NodoFalso;
  createGain(): NodoFalso;
  createBiquadFilter(): NodoFalso;
  createOscillator(): NodoFalso;
  addEventListener(tipo: string, fn: unknown): void;
  removeEventListener(tipo: string, fn: unknown): void;
}

function nodoFalso(clase: NodoFalso['clase'], registro: Registro): NodoFalso {
  const nodo: NodoFalso = {
    clase,
    type: '',
    loop: false,
    buffer: null,
    gain: parametroFalso(1),
    frequency: parametroFalso(350),
    Q: parametroFalso(1),
    playbackRate: parametroFalso(1),
    onended: null,
    arrancado: false,
    detenidoEn: null,
    desconexiones: 0,
    connect(destino) {
      registro.conexiones.push({ de: nodo, a: destino });
    },
    disconnect() {
      nodo.desconexiones++;
    },
    start() {
      nodo.arrancado = true;
    },
    stop(en) {
      nodo.detenidoEn = en ?? 0;
    },
  };
  return nodo;
}

function contextoFalso(estado: string, resumeFunciona: boolean, registro: Registro): ContextoFalso {
  registro.construidos++;
  const ctx: ContextoFalso = {
    state: estado,
    currentTime: 0,
    sampleRate: TASA,
    destination: { esLaSalida: true },
    resume() {
      if (!resumeFunciona) return Promise.reject(new Error('no'));
      ctx.state = 'running';
      return Promise.resolve();
    },
    createBuffer(_canales, muestras) {
      const datos = new Float32Array(muestras);
      const buffer: BufferFalso = { length: muestras, datos, getChannelData: () => datos };
      registro.buffers.push(buffer);
      return buffer;
    },
    createBufferSource() {
      const n = nodoFalso('fuente', registro);
      registro.fuentes.push(n);
      return n;
    },
    createGain() {
      const n = nodoFalso('gain', registro);
      registro.gains.push(n);
      return n;
    },
    createBiquadFilter() {
      const n = nodoFalso('biquad', registro);
      registro.biquads.push(n);
      return n;
    },
    createOscillator() {
      const n = nodoFalso('oscilador', registro);
      registro.osciladores.push(n);
      return n;
    },
    addEventListener(tipo, fn) {
      registro.escuchasDelContexto.push({ tipo, fn });
    },
    removeEventListener(tipo, fn) {
      const i = registro.escuchasDelContexto.findIndex((e) => e.tipo === tipo && e.fn === fn);
      if (i >= 0) registro.escuchasDelContexto.splice(i, 1);
    },
  };
  registro.contextos.push(ctx);
  return ctx;
}

interface EscuchaDelDocumento {
  tipo: string;
  fn: (evento: unknown) => void;
  captura: boolean;
  unaVez: boolean;
}

interface DocumentoFalso {
  hidden: boolean;
  escuchas: EscuchaDelDocumento[];
  addEventListener(tipo: string, fn: (evento: unknown) => void, opciones?: unknown): void;
  removeEventListener(tipo: string, fn: (evento: unknown) => void, opciones?: unknown): void;
  disparar(tipo: string, blanco?: unknown): void;
}

function documentoFalso(): DocumentoFalso {
  const doc: DocumentoFalso = {
    hidden: false,
    escuchas: [],
    addEventListener(tipo, fn, opciones) {
      const op = (opciones ?? {}) as { capture?: boolean; once?: boolean };
      doc.escuchas.push({
        tipo,
        fn,
        captura: opciones === true || op.capture === true,
        unaVez: op.once === true,
      });
    },
    removeEventListener(tipo, fn) {
      const i = doc.escuchas.findIndex((e) => e.tipo === tipo && e.fn === fn);
      if (i >= 0) doc.escuchas.splice(i, 1);
    },
    disparar(tipo, blanco) {
      for (const escucha of [...doc.escuchas]) {
        if (escucha.tipo !== tipo) continue;
        if (escucha.unaVez) doc.removeEventListener(escucha.tipo, escucha.fn);
        escucha.fn({ type: tipo, target: blanco ?? doc });
      }
    },
  };
  return doc;
}

interface MedioFalso {
  paused: boolean;
  ended: boolean;
  isConnected: boolean;
}

/** Un `<audio>` de mentira: alcanza con lo que el barrido de `ADR-04.3` le pregunta. */
function medioFalso(): MedioFalso {
  return { paused: false, ended: false, isConnected: true };
}

interface Programado {
  id: number;
  ms: number;
  fn: () => void;
}

interface Opciones {
  estado: string;
  resumeFunciona: boolean;
  conWebAudio: boolean;
  /** Lo que hay guardado en `arcade.cinta` antes de empezar. */
  guardado: string | null;
  /** Un `localStorage` que tira, como Safari en privado o una ventana incrustada. */
  almacenTira: 'no' | 'leer' | 'escribir' | 'todo';
}

function conEntorno(opciones: Partial<Opciones> = {}) {
  const estado = opciones.estado ?? 'suspended';
  const resumeFunciona = opciones.resumeFunciona ?? true;
  const conWebAudio = opciones.conWebAudio ?? true;
  const almacenTira = opciones.almacenTira ?? 'no';

  const registro: Registro = {
    construidos: 0,
    contextos: [],
    gains: [],
    biquads: [],
    osciladores: [],
    fuentes: [],
    buffers: [],
    conexiones: [],
    escuchasDelContexto: [],
  };
  const doc = documentoFalso();
  const guardado = new Map<string, string>();
  if (opciones.guardado !== undefined && opciones.guardado !== null) {
    guardado.set('arcade.cinta', opciones.guardado);
  }

  const g = globalThis as Record<string, unknown>;
  const previos = {
    AudioContext: g.AudioContext,
    window: g.window,
    document: g.document,
    localStorage: g.localStorage,
    setTimeout: g.setTimeout,
    clearTimeout: g.clearTimeout,
  };

  const Ctor = function () {
    return contextoFalso(estado, resumeFunciona, registro);
  };
  g.AudioContext = conWebAudio ? Ctor : undefined;
  g.window = conWebAudio ? { AudioContext: Ctor } : {};
  g.document = doc;
  g.localStorage = {
    getItem(clave: string) {
      if (almacenTira === 'leer' || almacenTira === 'todo') throw new Error('modo privado');
      return guardado.get(clave) ?? null;
    },
    setItem(clave: string, valor: string) {
      if (almacenTira === 'escribir' || almacenTira === 'todo') throw new Error('modo privado');
      guardado.set(clave, valor);
    },
  };

  // Los temporizadores, en la mano. Ver el encabezado del archivo.
  const programados = new Map<number, Programado>();
  let proximoId = 0;
  g.setTimeout = (fn: () => void, ms: number) => {
    const id = ++proximoId;
    programados.set(id, { id, ms, fn });
    return id;
  };
  g.clearTimeout = (id: number) => {
    programados.delete(id);
  };

  return {
    registro,
    doc,
    guardado,
    /** Los que todavía no corrieron ni se cancelaron. */
    pendientes: (): Programado[] => [...programados.values()],
    correrTemporizadores(): void {
      const listos = [...programados.values()];
      programados.clear();
      for (const p of listos) p.fn();
    },
    restaurar() {
      g.AudioContext = previos.AudioContext;
      g.window = previos.window;
      g.document = previos.document;
      g.localStorage = previos.localStorage;
      g.setTimeout = previos.setTimeout;
      g.clearTimeout = previos.clearTimeout;
      // Los dos módulos guardan estado en su ámbito: si no se reinician los dos, el caso
      // siguiente arranca con el contexto, el bucle de ruido y los escuchas del anterior.
      reiniciarCintaParaPruebas();
      reiniciarAudioParaPruebas();
    },
  };
}

/** Deja terminar las promesas de `prenderCinta()` sin depender del `setTimeout` de mentira. */
const respirar = (): Promise<void> => new Promise((listo) => setImmediate(listo));

/** Los nodos de la cama, sin contar el buffer mudo que `contexto.ts` arranca para iOS. */
function nodosDeLaCama(registro: Registro): number {
  return (
    registro.gains.length +
    registro.biquads.length +
    registro.osciladores.length +
    registro.fuentes.filter((f) => f.loop).length
  );
}

/**
 * El gain maestro: el único nodo de la cama que llega a la salida.
 *
 * Se pide que sea un `gain` y no cualquier cosa **porque el buffer mudo que `contexto.ts`
 * dispara para destrabar iOS también se conecta a `destination`**, y llega antes. Buscar
 * "lo primero que toca la salida" devolvía ese, que no tiene rampas ni las va a tener — y
 * las tres pruebas que dependían de esto fallaban acusando al grafo de algo que estaba bien.
 */
const maestroDe = (registro: Registro): NodoFalso => {
  const salida = registro.contextos[0]!.destination;
  const conexion = registro.conexiones.find((c) => c.a === salida && c.de.clase === 'gain');
  assert.ok(conexion, 'nada de la cama llega a la salida: el grafo no está armado');
  return conexion.de;
};

// ---------------------------------------------------------------------------------------
// El apagado de emergencia y la disponibilidad (`ADR-04.7`)
// ---------------------------------------------------------------------------------------

test('sin Web Audio no se ofrece, y prenderla no crea un solo nodo', async () => {
  // Con `CAMA_HABILITADA` en `true`: lo que la deja afuera es el navegador, no el apagado
  // de emergencia. Si esto fallara, el interruptor aparecería en un aparato donde tocarlo
  // no puede hacer nada — un botón que miente.
  const e = conEntorno({ conWebAudio: false });
  try {
    assert.equal(CAMA_HABILITADA, true, 'el apagado de emergencia está en su lugar');
    assert.equal(cintaDisponible(), false);
    assert.equal(await prenderCinta(), 'apagada');
    assert.equal(nodosDeLaCama(e.registro), 0);
    assert.equal(e.registro.construidos, 0, 'ni siquiera se construye el contexto');
    assert.equal(e.doc.escuchas.length, 0, 'ni un escucha registrado');
  } finally {
    e.restaurar();
  }
});

test('el apagado de emergencia es un literal, para que se pueda encontrar con un grep', () => {
  // `ADR-04.7` pide exactamente esto: que se pueda cambiar sin entender el módulo. Un
  // valor calculado —una variable de entorno, una función— obligaría a mirar la
  // configuración del despliegue para saber si el sitio hace ruido.
  const fuente = readFileSync('src/lib/sitio/cinta.ts', 'utf-8');
  assert.match(fuente, /^export const CAMA_HABILITADA = (true|false);$/m);
});

test('la cama no importa nada que la pueda matar en el navegador', () => {
  /*
   * `ADR-04.6` fija la lista de lo prohibido, y las tres razones son distintas:
   *
   * - **`node:*`, directo o a tres saltos** (`D-29`): una isla que arrastra Node muere al
   *   cargar y deja la pantalla dibujada y sin responder. `islas.test.ts` recorre el grafo
   *   entero desde `src/scripts/`; esto es el mismo candado, un salto antes.
   * - **`tema/audio.ts`**: la dirección es única —`audio.ts → contexto.ts ← cinta.ts`—. Si
   *   se cruzan, la regla de convivencia pasa a depender de quién cargó primero.
   * - **cualquier JSON de datos**: la cama no tiene datos. Cero bytes es cero bytes.
   *
   * **Desvío declarado:** el ADR dice "lo único que puede importar es `contexto.ts`" y acá
   * hay dos, porque el ciclo agregó `sitio/graves.ts` —las tres pantallas donde el sitio se
   * saca la voz— para que la preferencia guardada no pueda prender la cinta en la pantalla
   * de un muerto. Es un módulo hoja que no importa nada, así que la razón de fondo del ADR
   * (que la cama no arrastre nada al navegador) queda intacta.
   */
  const fuente = readFileSync('src/lib/sitio/cinta.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from\s+'([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa, ['../audio/contexto.ts', './graves.ts']);
});

// ---------------------------------------------------------------------------------------
// La preferencia (`ADR-04.5`)
// ---------------------------------------------------------------------------------------

test('arranca apagada aunque la preferencia diga que sí: al cargar no se construye nada', async () => {
  // `ADR-04.4`: cada documento es un contexto nuevo y ningún navegador deja sonar nada sin
  // un gesto. La preferencia guardada no prende: arma un escucha de un solo uso y espera el
  // primer toque de la página. Prender solo sería autoreproducción, que es la razón número
  // uno por la que alguien cierra una pestaña.
  const e = conEntorno({ estado: 'running', guardado: '1' });
  try {
    assert.equal(estadoDeLaCinta(), 'apagada');
    assert.equal(nodosDeLaCama(e.registro), 0);

    rearmarCinta();
    assert.equal(nodosDeLaCama(e.registro), 0, 'armar el escucha tampoco construye nada');

    e.doc.disparar('pointerdown');
    await respirar();
    assert.equal(estadoDeLaCinta(), 'sonando');
    assert.equal(nodosDeLaCama(e.registro), 11);
    assert.equal(
      e.doc.escuchas.filter((x) => x.tipo === 'pointerdown').length,
      0,
      'el escucha del primer toque era de un solo uso',
    );
  } finally {
    e.restaurar();
  }
});

test('un valor corrupto en la clave es apagada: no es una preferencia', async () => {
  for (const raro of ['si', '', '2', 'true']) {
    const e = conEntorno({ estado: 'running', guardado: raro });
    try {
      rearmarCinta();
      e.doc.disparar('pointerdown');
      await respirar();
      assert.equal(estadoDeLaCinta(), 'apagada', `"${raro}" no puede prender la cinta`);
      assert.equal(nodosDeLaCama(e.registro), 0);
    } finally {
      e.restaurar();
    }
  }
});

test('si localStorage tira al leer o al escribir, la cinta prende igual', async () => {
  // Safari en privado y las ventanas incrustadas tiran. Que la cama rompa el sitio por no
  // poder guardar un `'1'` sería ridículo: se traga y la preferencia vale por lo que dure
  // la página.
  const e = conEntorno({ estado: 'running', almacenTira: 'todo' });
  try {
    assert.equal(await prenderCinta(), 'sonando');
    apagarCinta();
    assert.equal(estadoDeLaCinta(), 'apagada', 'apagar tampoco puede romperse por el almacén');
  } finally {
    e.restaurar();
  }
});

test('prendida se guarda un 1; apagada, un 0', async () => {
  const e = conEntorno({ estado: 'running' });
  try {
    assert.equal(e.guardado.has('arcade.cinta'), false, 'apagada por defecto no escribe nada');
    await prenderCinta();
    assert.equal(e.guardado.get('arcade.cinta'), '1');
    apagarCinta();
    assert.equal(e.guardado.get('arcade.cinta'), '0');
  } finally {
    e.restaurar();
  }
});

// ---------------------------------------------------------------------------------------
// El grafo (`ADR-04.1`)
// ---------------------------------------------------------------------------------------

test('el grafo son once nodos, con el siseo abajo del televisor y la rama de arrastre', async () => {
  const e = conEntorno({ estado: 'running' });
  try {
    assert.equal(await prenderCinta(), 'sonando');
    assert.equal(nodosDeLaCama(e.registro), 11, 'once nodos, ni uno más ni uno menos');

    const fuente = e.registro.fuentes.find((f) => f.loop);
    assert.ok(fuente, 'el ruido tiene que ir en bucle');
    assert.equal(fuente.arrancado, true);

    const siseo = e.registro.biquads.find((b) => b.frequency.value === SISEO_HZ);
    assert.ok(siseo, 'sin el siseo filtrado esto es una estática de televisor');
    assert.equal(siseo.type, 'lowpass');

    // La rama que nadie pone: la misma fuente filtrada abajo de todo. No se escucha como
    // sonido, se escucha como que algo está girando.
    const arrastre = e.registro.biquads.find((b) => b.frequency.value === ARRASTRE_HZ);
    assert.ok(arrastre, 'sin la rama de arrastre la cama es aire, no un aparato');
    assert.ok(
      e.registro.conexiones.some((c) => c.de === fuente && c.a === arrastre),
      'el arrastre sale de la misma fuente de ruido, no de otra',
    );
    const nivel = e.registro.gains.find((g) => g.gain.value === NIVEL_ARRASTRE);
    assert.ok(nivel, 'el arrastre entra a la mezcla por su propio nivel');
    assert.ok(e.registro.conexiones.some((c) => c.de === arrastre && c.a === nivel));

    const piso = e.registro.biquads.find((b) => b.frequency.value === PISO_HZ);
    assert.ok(piso, 'falta el piso que saca el barro de abajo');
    assert.equal(piso.type, 'highpass');
  } finally {
    e.restaurar();
  }
});

test('🔴 el bamboleo entra a la respiración y NUNCA al gain maestro', async () => {
  // Es la regla del apartado, no una preferencia: una entrada conectada a un `AudioParam`
  // **se suma** al valor de la automatización. Con el bamboleo en el maestro, la cama en
  // cero seguiría sumando ±0,15 y "callada" no sería silencio — o sea, la atmósfera pisaría
  // el escalón de 0,1 s justo cuando se supone que se calló.
  const e = conEntorno({ estado: 'running' });
  try {
    await prenderCinta();
    const maestro = maestroDe(e.registro);
    const respiracion = e.registro.conexiones.find((c) => c.a === maestro)?.de;
    assert.ok(respiracion, 'falta el gain de respiración entre la mezcla y el maestro');
    assert.notEqual(respiracion, maestro, 'respiración y maestro tienen que ser dos nodos');

    const profundidad = e.registro.gains.find((g) => g.gain.value === PROFUNDIDAD_BAMBOLEO);
    assert.ok(profundidad);
    assert.ok(
      e.registro.conexiones.some((c) => c.de === profundidad && c.a === respiracion.gain),
      'el bamboleo tiene que entrar al gain de la respiración',
    );
    assert.equal(
      e.registro.conexiones.filter((c) => c.a === maestro.gain).length,
      0,
      'nada puede entrar al gain maestro: el maestro en 0 es cero absoluto',
    );

    // Y el flutter va a la velocidad de lectura, que es el temblor de la cinta contra la
    // cabeza — no al volumen.
    const profundidadFlutter = e.registro.gains.find((g) => g.gain.value === PROFUNDIDAD_FLUTTER);
    assert.ok(profundidadFlutter);
    const fuente = e.registro.fuentes.find((f) => f.loop)!;
    assert.ok(
      e.registro.conexiones.some((c) => c.de === profundidadFlutter && c.a === fuente.playbackRate),
      'el flutter entra a playbackRate, no a un volumen',
    );
  } finally {
    e.restaurar();
  }
});

test('el bucle dura lo que dice y el cruce no le come energía al final', async () => {
  const e = conEntorno({ estado: 'running' });
  try {
    await prenderCinta();
    const bucle = e.registro.buffers.find((b) => b.length > 1);
    assert.ok(bucle, 'no se generó el bucle de ruido');
    assert.equal(bucle.length, LARGO_BUCLE_SEG * TASA);

    // El cruce es de potencia constante. Con pesos lineales la energía cae ~3 dB en el
    // medio del cruce, y ese bache da la vuelta cada tres segundos: un patrón audible, que
    // es lo único que esta pieza no puede tener.
    const cruce = Math.floor(CRUCE_SEG * TASA);
    const energia = (desde: number, hasta: number): number => {
      let suma = 0;
      for (let i = desde; i < hasta; i++) suma += bucle.datos[i]! ** 2;
      return suma / (hasta - desde);
    };
    const medio = energia(cruce, cruce * 2);
    const final = energia(bucle.length - cruce, bucle.length);
    assert.ok(
      Math.abs(final - medio) / medio < 0.1,
      `el cruce cambia el nivel del final (${final.toFixed(4)} contra ${medio.toFixed(4)})`,
    );
  } finally {
    e.restaurar();
  }
});

test('los topes del ADR están puestos, y el bamboleo no cae en el largo del bucle', () => {
  assert.ok(GANANCIA_CAMA <= 0.08, 'techo duro de volumen: no hay perilla, hay interruptor');
  assert.ok(LARGO_BUCLE_SEG <= 4, 'arriba de esto se rompe el presupuesto de RAM');
  assert.ok(SISEO_HZ <= 2500, 'arriba de acá vuelve el televisor');
  assert.ok(BAJADA_SEG <= 0.02, 'el paso 1 del reveal dura 0,1 s: la bajada no puede subir');
  assert.ok(CRUCE_SEG >= 0.25, 'menos que esto y el bucle chasquea');
  assert.ok(FLUTTER_HZ > BAMBOLEO_HZ, 'el flutter es el temblor rápido, el bamboleo el lento');

  // Si el período del bamboleo fuera múltiplo o divisor del bucle, los dos volverían a
  // empezar juntos y el bucle se volvería audible como patrón — o sea, la cama llamaría la
  // atención sobre sí misma, que es justo lo que no puede hacer.
  const periodo = 1 / BAMBOLEO_HZ;
  const resto = periodo % LARGO_BUCLE_SEG;
  assert.ok(resto > 0.2 && Math.abs(resto - LARGO_BUCLE_SEG) > 0.2, `el bamboleo cae en el bucle: ${resto}`);
});

// ---------------------------------------------------------------------------------------
// La convivencia (`ADR-04.3`)
// ---------------------------------------------------------------------------------------

test('🔴 cuando la salida se ocupa la cama se calla, y no vuelve antes de la espera', async () => {
  const e = conEntorno({ estado: 'running' });
  try {
    await prenderCinta();
    const maestro = maestroDe(e.registro);
    assert.deepEqual(maestro.gain.rampas, [{ a: GANANCIA_CAMA, en: SUBIDA_SEG }], 'la subida');

    const soltar = tomarLaSalida('fragmento', 30);
    assert.equal(estadoDeLaCinta(), 'callada');
    assert.deepEqual(
      maestro.gain.rampas.at(-1),
      { a: 0, en: BAJADA_SEG },
      'tiene que estar abajo antes del primer quinto del escalón de 0,1 s',
    );

    soltar();
    assert.equal(estadoDeLaCinta(), 'callada', 'no vuelve en el mismo cuadro en que se libera');
    const [espera] = e.pendientes();
    assert.ok(espera, 'tiene que quedar contando para volver');
    assert.equal(espera.ms, ESPERA_PARA_VOLVER_SEG * 1000);

    e.correrTemporizadores();
    assert.equal(estadoDeLaCinta(), 'sonando');
    assert.deepEqual(maestro.gain.rampas.at(-1), { a: GANANCIA_CAMA, en: SUBIDA_SEG });
  } finally {
    e.restaurar();
  }
});

test('un <audio> del documento que emite play en captura también la calla', async () => {
  // Los eventos de medios **no burbujean**: sin fase de captura, el reproductor del tema
  // entero —tres niveles más abajo, creado por la isla— no llegaría nunca hasta acá y la
  // cama seguiría siseando arriba del tema.
  const e = conEntorno({ estado: 'running' });
  try {
    await prenderCinta();
    for (const tipo of ['play', 'playing', 'pause', 'ended']) {
      const escucha = e.doc.escuchas.find((x) => x.tipo === tipo);
      assert.ok(escucha, `falta el escucha de ${tipo}`);
      assert.equal(escucha.captura, true, `${tipo} sin captura no llega nunca`);
    }

    const audio = medioFalso();
    e.doc.disparar('play', audio);
    assert.equal(estadoDeLaCinta(), 'callada');

    audio.paused = true;
    e.doc.disparar('pause', audio);
    e.correrTemporizadores();
    assert.equal(estadoDeLaCinta(), 'sonando');
  } finally {
    e.restaurar();
  }
});

test('🔴 un <audio> que se saca del documento mientras sonaba no la deja muda para siempre', async () => {
  // Al elemento que la pantalla borra no le dispara `pause` nadie. Sin el barrido, la cama
  // se quedaría esperando un evento que ya no puede llegar — y el síntoma sería que la
  // atmósfera "se apagó sola" en algún momento que nadie puede reconstruir.
  const e = conEntorno({ estado: 'running' });
  try {
    await prenderCinta();
    const audio = medioFalso();
    e.doc.disparar('play', audio);
    assert.equal(estadoDeLaCinta(), 'callada');

    // El juego reemplaza la pantalla al seguir: el elemento se va del árbol sonando.
    audio.isConnected = false;

    // El próximo evento que despierte la pregunta —acá, otro medio cualquiera— barre.
    const otro = medioFalso();
    e.doc.disparar('play', otro);
    otro.paused = true;
    e.doc.disparar('pause', otro);
    e.correrTemporizadores();
    assert.equal(estadoDeLaCinta(), 'sonando', 'el barrido tiene que soltar al que ya no está');
  } finally {
    e.restaurar();
  }
});

test('con la página escondida se calla, y al volver vuelve', async () => {
  // `ADR-04.8`: un sitio que sigue siseando en el bolsillo es el peor final posible de esta
  // pieza. Es lo mismo que el juego ya hace con el fragmento.
  const e = conEntorno({ estado: 'running' });
  try {
    await prenderCinta();
    e.doc.hidden = true;
    e.doc.disparar('visibilitychange');
    assert.equal(estadoDeLaCinta(), 'callada');

    e.doc.hidden = false;
    e.doc.disparar('visibilitychange');
    e.correrTemporizadores();
    assert.equal(estadoDeLaCinta(), 'sonando');
  } finally {
    e.restaurar();
  }
});

test('prendida mientras algo suena, nace callada: no pisa nada', async () => {
  const e = conEntorno({ estado: 'running' });
  try {
    const soltar = tomarLaSalida('fragmento', 30);
    assert.equal(await prenderCinta(), 'callada');
    const maestro = maestroDe(e.registro);
    assert.deepEqual(maestro.gain.rampas, [], 'no puede haber ni una rampa hacia arriba');
    soltar();
    e.correrTemporizadores();
    assert.equal(estadoDeLaCinta(), 'sonando');
  } finally {
    e.restaurar();
  }
});

// ---------------------------------------------------------------------------------------
// El interruptor: prender, apagar, y avisar
// ---------------------------------------------------------------------------------------

test('bloqueada: si el navegador no la deja, no guarda la preferencia ni deja un nodo vivo', async () => {
  // El caso 2 de `ADR-04.4`, que pasa de verdad en las ventanas incrustadas. Un intento y
  // nada más: reintentar, o dejar armado un escucha del próximo toque, es exactamente el
  // truco que la política de autoreproducción existe para impedir.
  const e = conEntorno({ estado: 'suspended', resumeFunciona: false });
  try {
    assert.equal(await prenderCinta(), 'bloqueada');
    assert.equal(nodosDeLaCama(e.registro), 0, 'cero nodos: el grafo no se llega a armar');
    assert.equal(e.guardado.has('arcade.cinta'), false, 'nunca se recuerda lo que no llegó a pasar');
    assert.equal(e.doc.escuchas.length, 0, 'ni un escucha esperando el próximo toque');
    assert.equal(e.pendientes().length, 0, 'ni un temporizador esperando para reintentar');
  } finally {
    e.restaurar();
  }
});

test('el segundo toque sobre una cama armada no arma una segunda cama', async () => {
  const e = conEntorno({ estado: 'running' });
  try {
    await prenderCinta();
    await prenderCinta();
    assert.equal(nodosDeLaCama(e.registro), 11, 'dos camas serían el doble de volumen sin apagado');
    assert.equal(e.registro.construidos, 1, 'y un solo contexto para todo el sitio');
  } finally {
    e.restaurar();
  }
});

test('🔴 apagarCinta no deja nada atrás: ni escuchas, ni temporizadores, ni nodos', async () => {
  const e = conEntorno({ estado: 'running' });
  try {
    await prenderCinta();
    const maestro = maestroDe(e.registro);
    const fuente = e.registro.fuentes.find((f) => f.loop)!;

    // Se deja el peor caso armado: la salida ocupada y soltada, o sea con la espera
    // contando. Un temporizador vivo después de apagar es una fuga que no se ve.
    const soltar = tomarLaSalida('fragmento', 30);
    soltar();
    assert.equal(e.pendientes().length, 1);

    apagarCinta();
    assert.equal(estadoDeLaCinta(), 'apagada');
    assert.equal(e.pendientes().length, 0, 'quedó un temporizador pendiente');
    assert.equal(e.doc.escuchas.length, 0, 'quedó un escucha vivo sobre el documento');
    assert.equal(e.registro.escuchasDelContexto.length, 0, 'quedó un escucha vivo sobre el contexto');
    assert.deepEqual(maestro.gain.rampas.at(-1), { a: 0, en: BAJADA_SEG }, 'se baja con rampa');

    // Las fuentes se frenan en el reloj del audio, no con un `setTimeout`; la desconexión
    // cuelga del `onended`, que es un evento y no una encuesta.
    assert.equal(fuente.detenidoEn, BAJADA_SEG);
    for (const osc of e.registro.osciladores) assert.equal(osc.detenidoEn, BAJADA_SEG);
    fuente.onended?.();
    const nodos = [...e.registro.gains, ...e.registro.biquads, ...e.registro.osciladores, fuente];
    for (const nodo of nodos) assert.equal(nodo.desconexiones, 1, 'quedó un nodo sin soltar');
  } finally {
    e.restaurar();
  }
});

test('apagada, los eventos del documento ya no la mueven', async () => {
  const e = conEntorno({ estado: 'running' });
  try {
    await prenderCinta();
    apagarCinta();
    const audio = medioFalso();
    e.doc.disparar('play', audio);
    e.correrTemporizadores();
    assert.equal(estadoDeLaCinta(), 'apagada', 'apagada es apagada, pase lo que pase afuera');
  } finally {
    e.restaurar();
  }
});

test('alCambiarLaCinta avisa cada cambio, y darse de baja funciona', async () => {
  const e = conEntorno({ estado: 'running' });
  try {
    const avisos: string[] = [];
    const darDeBaja = alCambiarLaCinta((estado) => avisos.push(estado));

    await prenderCinta();
    const soltar = tomarLaSalida('fragmento', 30);
    assert.deepEqual(avisos, ['sonando', 'callada']);

    // `callada` es un estado visible a propósito: si la cama se calla sola y el interruptor
    // sigue diciendo prendida, la persona lo toca pensando que se rompió.
    soltar();
    e.correrTemporizadores();
    assert.deepEqual(avisos, ['sonando', 'callada', 'sonando']);

    darDeBaja();
    apagarCinta();
    assert.deepEqual(avisos, ['sonando', 'callada', 'sonando'], 'dado de baja no le llega nada');
  } finally {
    e.restaurar();
  }
});

test('un interruptor que rompe no se lleva puesto al resto', async () => {
  const e = conEntorno({ estado: 'running' });
  try {
    const avisos: string[] = [];
    alCambiarLaCinta(() => {
      throw new Error('el interruptor tuvo un mal día');
    });
    alCambiarLaCinta((estado) => avisos.push(estado));
    await prenderCinta();
    assert.deepEqual(avisos, ['sonando']);
  } finally {
    e.restaurar();
  }
});

/* =======================================================================================
   Los cuatro defectos que encontró la refutación adversarial del ciclo 11.

   Ninguno lo encontró una prueba: los encontró alguien leyendo el código con la consigna de
   **refutar**, no de confirmar. Van con su caso porque un arreglo sin prueba es un arreglo
   que vuelve, y estos tres son de la clase que no se descubre escuchando.
   ======================================================================================= */

test('🔴 dos toques que se pisan no arman dos camas', async () => {
  // El candado estaba **antes** del `await`, y `nodos` se asigna después: dos llamadas
  // simultáneas —el dedo que rebota, o el rearme del primer toque llegando junto con el
  // toque sobre el propio interruptor— pasaban las dos con `nodos` en `null`. La segunda
  // pisaba la referencia de la primera, que quedaba sonando **sin apagador**.
  const e = conEntorno({ estado: 'running' });
  try {
    const antes = nodosDeLaCama(e.registro);
    const a = prenderCinta();
    const b = prenderCinta();
    const [ea, eb] = await Promise.all([a, b]);
    await respirar();

    assert.equal(ea, 'sonando');
    assert.equal(eb, 'sonando');
    assert.equal(
      nodosDeLaCama(e.registro) - antes,
      11,
      'se armó más de un grafo: el segundo deja al primero sonando sin forma de apagarlo',
    );

    // Y la prueba que de verdad importa: apagar tiene que dejar cero.
    apagarCinta();
    assert.equal(estadoDeLaCinta(), 'apagada');
    assert.equal(e.pendientes().length, 0, 'quedó un temporizador vivo');
  } finally {
    e.restaurar();
  }
});

test('🔴 prendida mientras un <audio> YA sonaba, no le pasa por encima', async () => {
  // Los escuchas solo traen eventos futuros. Sin barrer el documento al registrarlos, una
  // cama prendida en el medio de un tema que ya estaba sonando nacía encima de él.
  const e = conEntorno({ estado: 'running' });
  try {
    const yaSonando = medioFalso();
    // El doble del documento no tenía `querySelectorAll` porque hasta ahora nadie lo usaba.
    (e.doc as unknown as { querySelectorAll: (s: string) => MedioFalso[] }).querySelectorAll = () => [
      yaSonando,
    ];

    await prenderCinta();
    assert.equal(
      estadoDeLaCinta(),
      'callada',
      'nació sonando arriba de algo que ya sonaba: eso es exactamente lo que el candado 3 prohíbe',
    );
  } finally {
    e.restaurar();
  }
});

test('🔴 un medio que se va sin avisar y sin que pase nada más: la red la despierta', async () => {
  // El barrido existía y solo corría adentro de un evento. Si el medio se va del documento y
  // **no pasa nada más** —ni otro medio, ni un `pause`, ni un cambio de visibilidad—, no
  // había quién despertara la pregunta y la cama quedaba muda para siempre.
  const e = conEntorno({ estado: 'running' });
  try {
    await prenderCinta();
    const audio = medioFalso();
    e.doc.disparar('play', audio);
    assert.equal(estadoDeLaCinta(), 'callada');

    audio.isConnected = false;
    assert.ok(e.pendientes().length > 0, 'no quedó armada la red: nadie va a volver a preguntar');

    // La red vuelve a preguntar, barre, y de ahí sale la espera normal para volver.
    e.correrTemporizadores();
    e.correrTemporizadores();
    assert.equal(estadoDeLaCinta(), 'sonando', 'la cama se quedó muda sin nada que la despierte');
  } finally {
    e.restaurar();
  }
});

test('la isla llama a rearmarCinta: la preferencia significa algo al cambiar de pantalla', () => {
  // `ADR-04.4` promete que la cinta se rearma con el primer toque de la pantalla siguiente.
  // La función existía y **no la llamaba nadie en todo el sitio**, así que la promesa era
  // solo del documento. Se verifica leyendo el fuente porque el defecto era ese: la ausencia
  // de una llamada, que ninguna prueba del módulo puede ver.
  const isla = readFileSync('src/scripts/cinta.ts', 'utf-8');
  assert.match(
    isla,
    /rearmarCinta\(\)/,
    'la isla no rearma la cinta: quien la prendió en la portada la ve apagada en cada juego',
  );
});
