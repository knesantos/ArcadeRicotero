/**
 * Los ruidos del camino (`D-76`): los pasos, el viento, los grillos, la cama de fondo de cada
 * región y lo que anda suelto en lo oscuro.
 *
 * Pedido del usuario: *"que se escuchen otras cosas, pasos, sonidos de los personajes, ruidos
 * del entorno, que sea todo bien inmersivo"*, y después *"mejora de ambiente en sonido del
 * bestiario, mejores efectos de sonido, mejores pasos, pasos en el agua, botellas rotas"*. Y al
 * final: *"los efectos de sonido van a quedar mejor si buscas una libreria con efectos ya hechos y
 * cargados, que hacerlos vos"*.
 *
 * ## Archivo primero, síntesis de respaldo
 *
 * Cada efecto tiene un nombre (`EFECTOS`, en `lib/bestiario/sonido.ts`) y sus variantes en mp3.
 * Al prender, se cargan solo los que pide la receta de la región, sin apuro: mientras no llegan,
 * o si no están, suena la síntesis de antes, que es ruido con forma y osciladores. Así el camino
 * nunca queda mudo por un archivo que falta.
 *
 * Cada vez que suena un archivo se elige otra variante, con un poco más o menos de tono y de
 * fuerza: dos pasos seguidos no son el mismo paso. Lo que no se finge con osciladores (una voz,
 * una risa, un aullido, un balido) sigue pedido en `Docs/SUGERENCIAS/HILO-sonidos-del-bestiario.md`.
 *
 * ## La sala
 *
 * Cada región tiene su eco: la prisión y el templo largo, el galpón grande, el monte casi seco.
 * Es un `ConvolverNode` con una respuesta que se arma una sola vez, con ruido que se apaga.
 *
 * ## Lo que cuesta en un teléfono
 *
 * Un solo buffer de ruido para toda la síntesis, una respuesta de sala por tamaño, un tope de
 * voces a la vez, y nada que nazca en cada cuadro: los pasos van atados a lo caminado, un paso
 * cada tantos píxeles de escena, con un tope de velocidad.
 *
 * Lo prende el mismo botón que el recital de lejos (`lejos.ts`), y comparte su contexto.
 */

import { EFECTOS, efectosDe, rutaDeEfecto, type Receta, type Sala, type Suelo } from '../../lib/bestiario/sonido.ts';
import { sacudir } from './sacudon.ts';

/** Los ruidos que pegan fuerte y sacuden la cámara del camino cuando suenan (`D-80`), y cuánto. */
const SACUDEN: Readonly<Record<string, number>> = { bombo: 0.18, vidrio: 0.22, metal: 0.12, campana: 0.08 };

/** El volumen de todo el entorno, debajo del recital y por arriba del silencio. */
const VOLUMEN = 0.7;
/** Entre paso y paso, como mínimo: más rápido que esto ya es correr. */
const PASO_MIN_SEG = 0.2;
/** Cuántas cosas suenan a la vez, como mucho, sin contar las camas. Más que esto ya es barro. */
const MAX_VOCES = 12;
/** Lo que dura una cama cuando se la prueba sola, en la página de diagnóstico. */
const CAMA_DE_PRUEBA_SEG = 6;

/** Qué sonó: el archivo, la síntesis de respaldo, o nada (sin lugar, o sin sonido). */
export type Sono = 'archivo' | 'sintesis' | 'nada';

export interface Entorno {
  prender(ctx: AudioContext): void;
  apagar(): void;
  /** Lo caminado, en unidades de escena: de acá salen los pasos. */
  caminar(x: number): void;
  /** Un toque a un bicho que tiene sonido propio en la receta. */
  tocar(id: string): void;
  /** Un efecto cualquiera, aunque la receta no lo pida. Espera que cargue. Para el diagnóstico. */
  oir(nombre: string): Promise<Sono>;
  /** Un paso suelto, sobre el suelo que se pida. Para el diagnóstico. */
  pisar(suelo: Suelo): Promise<Sono>;
}

/* ------------------------------------------------------------------
   Lo que se comparte entre caminos: los archivos, el ruido, las salas
   ------------------------------------------------------------------ */

/** Cada archivo se pide una vez sola en toda la visita. `null`: no está o no se pudo leer. */
const archivos = new Map<string, Promise<AudioBuffer | null>>();
let ruidoCompartido: AudioBuffer | null = null;
const salas = new Map<string, AudioBuffer>();

function cargarArchivo(c: AudioContext, ruta: string): Promise<AudioBuffer | null> {
  let p = archivos.get(ruta);
  if (!p) {
    p = fetch(ruta)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
      .then((datos) => c.decodeAudioData(datos))
      .catch(() => null);
    archivos.set(ruta, p);
  }
  return p;
}

/** Dos segundos de ruido blanco: la materia prima de casi toda la síntesis. */
function ruidoDe(c: AudioContext): AudioBuffer {
  if (ruidoCompartido && ruidoCompartido.sampleRate === c.sampleRate) return ruidoCompartido;
  const b = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  ruidoCompartido = b;
  return b;
}

/**
 * La respuesta de una sala: ruido que se apaga en `largo` segundos, y que además se va oscureciendo,
 * porque en una pieza de verdad los agudos se los come la pared antes que los graves. Dos canales
 * distintos, para que el eco abra a los costados.
 */
function respuestaDe(c: AudioContext, s: Sala): AudioBuffer {
  const clave = `${s.largo}|${s.brillo}|${c.sampleRate}`;
  const hecha = salas.get(clave);
  if (hecha) return hecha;
  const sr = c.sampleRate;
  const n = Math.max(1, Math.floor(sr * s.largo));
  const b = c.createBuffer(2, n, sr);
  for (let canal = 0; canal < 2; canal++) {
    const d = b.getChannelData(canal);
    let y = 0;
    let a = 0;
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      // El filtro se recalcula cada tanto, no en cada muestra: alcanza y no traba.
      if ((i & 63) === 0) a = Math.exp((-2 * Math.PI * s.brillo * (1 - (0.75 * t) / s.largo)) / sr);
      y = (1 - a) * (Math.random() * 2 - 1) + a * y;
      // Un respiro de diez milisegundos antes del primer rebote.
      const entra = Math.min(1, t / 0.01);
      d[i] = y * Math.exp((-6.9 * t) / s.largo) * entra;
    }
  }
  salas.set(clave, b);
  return b;
}

/* ------------------------------------------------------------------
   El entorno de un camino
   ------------------------------------------------------------------ */

type Sintesis = (e: AudioNode) => void;
type CamaSintetizada = (g: AudioNode, vol: number, fuentes: AudioScheduledSourceNode[], viva: () => boolean) => void;

export function crearEntorno(receta: Receta): Entorno {
  let ctx: AudioContext | null = null;
  let general: GainNode | null = null;
  /** Lo que va seco y lo que pasa por la sala. Las dos van al general. */
  let seco: GainNode | null = null;
  let conSala: GainNode | null = null;
  let ruido: AudioBuffer | null = null;
  let prendido = false;
  /** Cada vez que se apaga sube la vuelta: lo que llega tarde de antes no hace nada. */
  let vuelta = 0;
  const relojes: number[] = [];
  const camas: Array<() => void> = [];
  /** Las variantes que ya llegaron, por efecto. */
  const cargados = new Map<string, AudioBuffer[]>();
  const cargando = new Map<string, Promise<void>>();
  const ultima = new Map<string, number>();
  let voces = 0;

  let ultimoX: number | null = null;
  let andado = 0;
  let ultimoPaso = 0;
  let pie = 1;

  /* ---------------- Las salidas ---------------- */

  function entrada(sala: boolean): AudioNode {
    return (sala ? conSala : seco)!;
  }

  function panear(e: AudioNode, p: number): AudioNode {
    const c = ctx!;
    const n = c.createStereoPanner?.();
    const destino: AudioNode = n ?? c.createGain();
    if (n) n.pan.value = Math.max(-1, Math.min(1, p));
    destino.connect(e);
    return destino;
  }

  /** Con paneo y, de lejos, un pasabajos que se come los agudos. */
  function lejos(e: AudioNode, p: number, f?: number): AudioNode {
    const destino = panear(e, p);
    if (!f) return destino;
    const filtro = ctx!.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = f;
    filtro.connect(destino);
    return filtro;
  }

  /** Un paneo que cruza de un lado al otro mientras dura el sonido. */
  function cruzando(e: AudioNode, dura: number, desde: number): AudioNode {
    const c = ctx!;
    const t = c.currentTime;
    const pan = c.createStereoPanner?.();
    const destino: AudioNode = pan ?? c.createGain();
    destino.connect(e);
    if (pan) {
      pan.pan.setValueAtTime(desde, t);
      pan.pan.linearRampToValueAtTime(-desde, t + dura);
    }
    return destino;
  }

  /** Reserva lugar para una voz. Sin lugar, no suena: mejor un ruido menos que un amontonamiento. */
  function ocupar(seg: number): boolean {
    if (voces >= MAX_VOCES) return false;
    voces++;
    window.setTimeout(() => voces--, Math.max(0.1, seg) * 1000);
    return true;
  }

  /* ---------------- Los archivos ---------------- */

  function carga(nombre: string): Promise<void> {
    const ef = EFECTOS[nombre];
    if (!ctx || !ef || ef.variantes < 1) return Promise.resolve();
    let p = cargando.get(nombre);
    if (!p) {
      const c = ctx;
      const rutas = Array.from({ length: ef.variantes }, (_, i) => rutaDeEfecto(nombre, i + 1));
      p = Promise.all(rutas.map((r) => cargarArchivo(c, r))).then((bs) => {
        const buenos = bs.filter((b): b is AudioBuffer => b !== null);
        if (buenos.length) cargados.set(nombre, buenos);
      });
      cargando.set(nombre, p);
    }
    return p;
  }

  /** Una variante al azar, nunca la misma dos veces seguidas. */
  function variante(nombre: string): AudioBuffer | null {
    const lista = cargados.get(nombre);
    if (!lista?.length) return null;
    let i = Math.floor(Math.random() * lista.length);
    if (lista.length > 1 && i === ultima.get(nombre)) i = (i + 1) % lista.length;
    ultima.set(nombre, i);
    return lista[i]!;
  }

  /** Suena el archivo, con un poco más o menos de tono y de fuerza. Devuelve lo que dura. */
  function tocarArchivo(b: AudioBuffer, nombre: string, destino: AudioNode, fuerza = 1): number {
    const c = ctx!;
    const s = c.createBufferSource();
    s.buffer = b;
    const tono = 0.94 + Math.random() * 0.12;
    s.playbackRate.value = tono;
    const g = c.createGain();
    g.gain.value = EFECTOS[nombre]!.vol * fuerza * (0.85 + Math.random() * 0.3);
    s.connect(g);
    g.connect(destino);
    s.start();
    return b.duration / tono;
  }

  /* ---------------- Los ladrillos de la síntesis ---------------- */

  /** Un golpe de ruido filtrado, que puede barrer de una frecuencia a otra. */
  function rafaga(
    d: AudioNode,
    o: { tipo: BiquadFilterType; f: number; f1?: number; q: number; dura: number; vol: number; cuando?: number; ataque?: number },
  ): void {
    const c = ctx!;
    const t = o.cuando ?? c.currentTime;
    const s = c.createBufferSource();
    s.buffer = ruido;
    const filtro = c.createBiquadFilter();
    filtro.type = o.tipo;
    filtro.frequency.setValueAtTime(o.f, t);
    if (o.f1) filtro.frequency.exponentialRampToValueAtTime(o.f1, t + o.dura);
    filtro.Q.value = o.q;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(o.vol, t + (o.ataque ?? 0.008));
    g.gain.exponentialRampToValueAtTime(0.0008, t + o.dura);
    s.connect(filtro);
    filtro.connect(g);
    g.connect(d);
    s.start(t, Math.random() * 1.5, o.dura + 0.05);
  }

  /**
   * Muchas micro-ráfagas sobre una sola fuente: el crujido de las hojas, la nieve, la grava. Los
   * granos son picos en la envolvente, así que cuestan tres nodos y no tres por grano.
   */
  function granos(d: AudioNode, o: { tipo: BiquadFilterType; f: number; q: number; cuando: number; dura: number; n: number; vol: number; largo: number }): void {
    const c = ctx!;
    const s = c.createBufferSource();
    s.buffer = ruido;
    const filtro = c.createBiquadFilter();
    filtro.type = o.tipo;
    filtro.frequency.value = o.f;
    filtro.Q.value = o.q;
    const g = c.createGain();
    g.gain.setValueAtTime(0, o.cuando);
    const tiempos = Array.from({ length: o.n }, () => o.cuando + Math.random() * o.dura).sort((a, b) => a - b);
    let libre = o.cuando;
    for (const t of tiempos) {
      if (t < libre) continue;
      const largo = Math.max(0.002, o.largo * (0.5 + Math.random()));
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(o.vol * (0.3 + Math.random() * 0.7), t + 0.0012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + largo);
      libre = t + largo;
    }
    s.connect(filtro);
    filtro.connect(g);
    g.connect(d);
    s.start(o.cuando, Math.random() * 1.5, o.dura + o.largo * 2 + 0.05);
  }

  /** Un oscilador con su envolvente: sube rápido y se apaga. */
  function tono(d: AudioNode, o: { tipo: OscillatorType; f0: number; f1?: number; dura: number; vol: number; cuando?: number }): OscillatorNode {
    const c = ctx!;
    const t = o.cuando ?? c.currentTime;
    const osc = c.createOscillator();
    osc.type = o.tipo;
    osc.frequency.setValueAtTime(o.f0, t);
    if (o.f1 !== undefined) osc.frequency.exponentialRampToValueAtTime(o.f1, t + o.dura);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol, t + Math.min(0.03, o.dura / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dura);
    osc.connect(g);
    g.connect(d);
    osc.start(t);
    osc.stop(t + o.dura + 0.05);
    return osc;
  }

  /** Lo que resuena después del golpe: parciales que se apagan cada uno a su tiempo. */
  function modos(d: AudioNode, cuando: number, parciales: ReadonlyArray<readonly [number, number, number]>): void {
    const c = ctx!;
    for (const [f, decae, vol] of parciales) {
      const o = c.createOscillator();
      o.frequency.value = f;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, cuando);
      g.gain.exponentialRampToValueAtTime(vol, cuando + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, cuando + decae);
      o.connect(g);
      g.connect(d);
      o.start(cuando);
      o.stop(cuando + decae + 0.05);
    }
  }

  /** Una burbuja: un seno corto que sube mientras se apaga. Así suena el aire que sale del agua. */
  function burbuja(d: AudioNode, cuando: number, f: number, sube: number, dura: number, vol: number): void {
    const c = ctx!;
    const o = c.createOscillator();
    o.frequency.setValueAtTime(f, cuando);
    o.frequency.exponentialRampToValueAtTime(f * sube, cuando + dura);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, cuando);
    g.gain.exponentialRampToValueAtTime(vol, cuando + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, cuando + dura);
    o.connect(g);
    g.connect(d);
    o.start(cuando);
    o.stop(cuando + dura + 0.03);
  }

  /** La madera que se queja: pulsos lentos por un filtro angosto. */
  function crujido(d: AudioNode, cuando: number, dura: number, vol: number): void {
    const c = ctx!;
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(32 + Math.random() * 10, cuando);
    o.frequency.linearRampToValueAtTime(55 + Math.random() * 20, cuando + dura);
    const filtro = c.createBiquadFilter();
    filtro.type = 'bandpass';
    filtro.frequency.value = 900 + Math.random() * 500;
    filtro.Q.value = 5;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, cuando);
    g.gain.exponentialRampToValueAtTime(vol, cuando + dura * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, cuando + dura);
    o.connect(filtro);
    filtro.connect(g);
    g.connect(d);
    o.start(cuando);
    o.stop(cuando + dura + 0.05);
  }

  /** El pie que entra al agua: el golpe grave, la salpicadura y las burbujas que suben. */
  function chapoteo(d: AudioNode, cuando: number, fuerza: number): void {
    rafaga(d, { tipo: 'lowpass', f: 750, f1: 220, q: 0.8, dura: 0.26, vol: 0.28 * fuerza, cuando, ataque: 0.012 });
    rafaga(d, { tipo: 'bandpass', f: 1600, q: 0.7, dura: 0.12, vol: 0.09 * fuerza, cuando: cuando + 0.01 });
    const n = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      burbuja(d, cuando + 0.02 + Math.random() * 0.16, 300 + Math.random() * 600, 1.6 + Math.random() * 0.8, 0.03 + Math.random() * 0.04, (0.03 + Math.random() * 0.02) * fuerza);
    }
  }

  /* ---------------- Los pasos ---------------- */

  /** El golpe del talón en cada suelo: frecuencia del pasabajos, lo que dura y su volumen. */
  const TALON: Record<Suelo, readonly [number, number, number]> = {
    hojas: [380, 0.09, 0.45],
    pasto: [360, 0.09, 0.4],
    tablas: [200, 0.16, 0.55],
    baldosa: [600, 0.05, 0.3],
    chapa: [300, 0.08, 0.35],
    nieve: [420, 0.08, 0.3],
    agua: [260, 0.12, 0.3],
    tierra: [480, 0.08, 0.4],
  };

  /**
   * Un paso sintetizado, en dos tiempos: el talón y, un poco después, la punta. Cada paso cambia la
   * fuerza, el tono y lo que tarda la punta, y cada suelo suena con lo suyo encima del golpe.
   */
  function pasoSintetizado(suelo: Suelo, d: AudioNode): void {
    const c = ctx!;
    const t = c.currentTime;
    const fuerza = 0.75 + Math.random() * 0.35;
    const k = 0.88 + Math.random() * 0.24;
    const punta = t + 0.05 + Math.random() * 0.04;
    const [f, dura, vol] = TALON[suelo];
    rafaga(d, { tipo: 'lowpass', f: f * k, q: 0.7, dura, vol: vol * fuerza, cuando: t });
    rafaga(d, { tipo: 'lowpass', f: f * k * 1.2, q: 0.7, dura: dura * 0.7, vol: vol * fuerza * 0.45, cuando: punta });
    for (const [cuando, peso] of [[t, 1], [punta, 0.6]] as const) {
      const v = fuerza * peso;
      switch (suelo) {
        case 'hojas':
          granos(d, { tipo: 'bandpass', f: 3200 * k, q: 0.9, cuando, dura: 0.12, n: 12, vol: 0.22 * v, largo: 0.012 });
          break;
        case 'pasto':
          rafaga(d, { tipo: 'bandpass', f: 5200 * k, f1: 3600 * k, q: 0.5, dura: 0.13, vol: 0.09 * v, cuando });
          break;
        case 'tablas':
          modos(d, cuando, [[115 * k, 0.14, 0.1 * v], [190 * k, 0.09, 0.05 * v], [300 * k, 0.05, 0.03 * v]]);
          break;
        case 'baldosa':
          rafaga(d, { tipo: 'highpass', f: (peso === 1 ? 2600 : 3200) * k, q: 0.7, dura: peso === 1 ? 0.03 : 0.02, vol: 0.2 * v, cuando });
          break;
        case 'chapa':
          rafaga(d, { tipo: 'bandpass', f: 1800 * k, q: 1, dura: 0.03, vol: 0.1 * v, cuando });
          modos(d, cuando, [420, 617, 878, 1189].map((h, i) => [h * k, 0.5 - i * 0.1, 0.025 * v] as const));
          break;
        case 'nieve':
          granos(d, { tipo: 'bandpass', f: 1300 * k, q: 1.1, cuando, dura: 0.15, n: 16, vol: 0.16 * v, largo: 0.008 });
          break;
        case 'tierra':
          granos(d, { tipo: 'bandpass', f: 2600 * k, q: 0.7, cuando, dura: 0.08, n: 8, vol: 0.1 * v, largo: 0.01 });
          break;
        case 'agua':
          chapoteo(d, cuando, v);
          break;
      }
    }
    // La tabla vieja se queja de vez en cuando.
    if (suelo === 'tablas' && Math.random() < 0.15) crujido(d, t + 0.03, 0.25, 0.04);
    // Y el agua gotea del pie cuando se levanta.
    if (suelo === 'agua') {
      const n = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < n; i++) burbuja(d, punta + 0.25 + Math.random() * 0.25, 1000 + Math.random() * 900, 1.5, 0.05, 0.03);
    }
  }

  function paso(suelo: Suelo): Sono {
    if (!ctx || !general) return 'nada';
    const nombre = `pasos-${suelo}`;
    if (!ocupar(0.6)) return 'nada';
    pie = -pie;
    const destino = panear(entrada(EFECTOS[nombre]?.sala ?? true), pie * (0.12 + Math.random() * 0.1));
    const b = variante(nombre);
    if (b) {
      tocarArchivo(b, nombre, destino, 0.8 + Math.random() * 0.3);
      return 'archivo';
    }
    pasoSintetizado(suelo, destino);
    return 'sintesis';
  }

  /* ---------------- Los que pasan cada tanto, sintetizados ---------------- */

  /** Un grillo: tres o cuatro pulsos de una nota aguda, de un lado del monte. */
  function grillo(e: AudioNode, vol: number): void {
    const c = ctx!;
    const t = c.currentTime;
    const o = c.createOscillator();
    o.frequency.value = 4100 + Math.random() * 600;
    const g = c.createGain();
    g.gain.value = 0;
    const pulsos = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < pulsos; i++) {
      const a = t + i * 0.045;
      g.gain.setValueAtTime(0, a);
      g.gain.linearRampToValueAtTime(vol, a + 0.006);
      g.gain.linearRampToValueAtTime(0, a + 0.03);
    }
    o.connect(g);
    g.connect(panear(e, Math.random() * 1.6 - 0.8));
    o.start(t);
    o.stop(t + pulsos * 0.045 + 0.05);
  }

  /** La lechuza: dos ululares graves, el segundo más largo y cayendo. */
  function lechuza(e: AudioNode): void {
    const c = ctx!;
    const d = lejos(e, Math.random() < 0.5 ? -0.6 : 0.6, 900);
    const t = c.currentTime;
    for (const [desde, dura, f0, f1] of [[0, 0.22, 410, 400], [0.42, 0.75, 420, 360]] as const) {
      const o = c.createOscillator();
      o.frequency.setValueAtTime(f0, t + desde);
      o.frequency.linearRampToValueAtTime(f1, t + desde + dura);
      const g = c.createGain();
      g.gain.setValueAtTime(0, t + desde);
      g.gain.linearRampToValueAtTime(0.09, t + desde + 0.06);
      g.gain.setValueAtTime(0.09, t + desde + dura - 0.15);
      g.gain.linearRampToValueAtTime(0, t + desde + dura);
      o.connect(g);
      g.connect(d);
      o.start(t + desde);
      o.stop(t + desde + dura + 0.05);
    }
  }

  /** El cencerro de la vaca: dos parciales que no son armónicos, y se apagan rápido. */
  function cencerro(e: AudioNode): void {
    const c = ctx!;
    const t = c.currentTime;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    const cuerpo = c.createBiquadFilter();
    cuerpo.type = 'bandpass';
    cuerpo.frequency.value = 820;
    cuerpo.Q.value = 2;
    for (const f of [545, 815]) {
      const o = c.createOscillator();
      o.type = 'square';
      o.frequency.value = f;
      o.connect(cuerpo);
      o.start(t);
      o.stop(t + 1);
    }
    cuerpo.connect(g);
    g.connect(panear(e, 0.3));
  }

  /** Una gota que cae en el agua: un tono que baja de golpe. */
  function gota(e: AudioNode): void {
    tono(panear(e, Math.random() * 1.2 - 0.6), { tipo: 'sine', f0: 1500 + Math.random() * 500, f1: 520, dura: 0.07, vol: 0.06 });
  }

  /** Las moscas: un zumbido que tiembla y cruza de un lado al otro. */
  function mosca(e: AudioNode): void {
    const c = ctx!;
    const t = c.currentTime;
    const dura = 1.4 + Math.random() * 1.2;
    const filtro = c.createBiquadFilter();
    filtro.type = 'bandpass';
    filtro.frequency.value = 900;
    filtro.Q.value = 1.5;
    filtro.connect(cruzando(e, dura, Math.random() < 0.5 ? -0.8 : 0.8));
    const ala = tono(filtro, { tipo: 'sawtooth', f0: 200 + Math.random() * 40, dura, vol: 0.035 });
    const temblor = c.createOscillator();
    temblor.frequency.value = 9;
    const temblorG = c.createGain();
    temblorG.gain.value = 14;
    temblor.connect(temblorG);
    temblorG.connect(ala.frequency);
    temblor.start(t);
    temblor.stop(t + dura + 0.05);
  }

  /** La sirena de la cana, de lejos: un tono que sube y baja dos veces. */
  function sirena(e: AudioNode): void {
    const c = ctx!;
    const t = c.currentTime;
    const o = c.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(640, t);
    for (let i = 0; i < 2; i++) {
      o.frequency.linearRampToValueAtTime(940, t + i * 1.6 + 0.8);
      o.frequency.linearRampToValueAtTime(640, t + i * 1.6 + 1.6);
    }
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.04, t + 0.6);
    g.gain.setValueAtTime(0.04, t + 2.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.3);
    o.connect(g);
    g.connect(lejos(e, Math.random() < 0.5 ? -0.7 : 0.7, 1200));
    o.start(t);
    o.stop(t + 3.4);
  }

  /** Las llaves y las cadenas: unos cuantos golpecitos metálicos, desparejos. */
  function cadenas(e: AudioNode): void {
    const c = ctx!;
    const d = panear(e, Math.random() * 1.2 - 0.6);
    const golpes = 4 + Math.floor(Math.random() * 4);
    for (let i = 0; i < golpes; i++) {
      rafaga(d, { tipo: 'bandpass', f: 4200 + Math.random() * 2400, q: 12, dura: 0.12, vol: 0.12, cuando: c.currentTime + i * (0.05 + Math.random() * 0.07) });
    }
  }

  /** Las brasas del infierno: chispazos cortos y secos, de a varios. */
  function brasas(e: AudioNode): void {
    const c = ctx!;
    const d = panear(e, Math.random() * 1.4 - 0.7);
    const chispas = 2 + Math.floor(Math.random() * 5);
    for (let i = 0; i < chispas; i++) {
      rafaga(d, { tipo: 'highpass', f: 2200 + Math.random() * 2000, q: 0.8, dura: 0.02, vol: 0.12, cuando: c.currentTime + Math.random() * 0.6 });
    }
  }

  /** Un ruido largo con forma: el agua del muelle, la gente del galpón. */
  function oleada(d: AudioNode, o: { tipo: BiquadFilterType; f: readonly number[]; q: number; vol: number; dura: number }): void {
    const c = ctx!;
    const t = c.currentTime;
    const s = c.createBufferSource();
    s.buffer = ruido;
    s.loop = true;
    const filtro = c.createBiquadFilter();
    filtro.type = o.tipo;
    filtro.Q.value = o.q;
    o.f.forEach((f, i) => filtro.frequency[i ? 'linearRampToValueAtTime' : 'setValueAtTime'](f, t + (o.dura * i) / (o.f.length - 1 || 1)));
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol, t + o.dura * 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dura);
    s.connect(filtro);
    filtro.connect(g);
    g.connect(d);
    s.start(t, Math.random() * 1.5);
    s.stop(t + o.dura + 0.05);
  }

  /** El agua contra los pilotes del muelle: una ola grave que va y viene. */
  function ola(e: AudioNode): void {
    oleada(panear(e, Math.random() * 1.2 - 0.6), { tipo: 'lowpass', f: [300, 900, 250], q: 0.7, vol: 0.16, dura: 2.3 });
  }

  /** La gente que espera en el galpón: un murmullo que crece y se va. */
  function gente(e: AudioNode): void {
    oleada(lejos(e, 0, 1400), { tipo: 'bandpass', f: [600, 700, 600], q: 0.8, vol: 0.05, dura: 4.5 });
  }

  /** La bocina del ferry que sale: dos notas graves, un poco desafinadas entre sí. */
  function bocina(e: AudioNode): void {
    const d = lejos(e, 0.5, 700);
    for (const f of [110, 113.5]) tono(d, { tipo: 'sawtooth', f0: f, dura: 2.2, vol: 0.05 });
  }

  /** El bombo de la murga, de lejos: un golpe grave que se apaga, y su contratiempo. */
  function bombo(e: AudioNode): void {
    const c = ctx!;
    const d = lejos(e, -0.4, 500);
    for (const [cuando, vol] of [[0, 0.22], [0.42, 0.14], [0.63, 0.18]] as const) {
      tono(d, { tipo: 'sine', f0: 92, f1: 48, dura: 0.35, vol, cuando: c.currentTime + cuando });
    }
  }

  /** La tele que se va de canal: chasquidos de estática. */
  function estatica(e: AudioNode): void {
    const c = ctx!;
    const d = panear(e, 0);
    for (let i = 0; i < 3; i++) {
      rafaga(d, { tipo: 'highpass', f: 1800, q: 0.5, dura: 0.18 + Math.random() * 0.2, vol: 0.05, cuando: c.currentTime + i * 0.22 });
    }
  }

  /** Un fierro que pasa por la ruta: el motor viene de un lado, crece y se va para el otro. */
  function motor(e: AudioNode): void {
    const c = ctx!;
    const t = c.currentTime;
    const dura = 3.2;
    const filtro = c.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.setValueAtTime(260, t);
    filtro.frequency.linearRampToValueAtTime(900, t + dura / 2);
    filtro.frequency.linearRampToValueAtTime(220, t + dura);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + dura / 2);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dura);
    filtro.connect(g);
    g.connect(cruzando(e, dura, -0.9));
    const o = c.createOscillator();
    o.type = 'sawtooth';
    // Cuando pasa, el tono sube al acercarse y baja al irse.
    o.frequency.setValueAtTime(58, t);
    o.frequency.linearRampToValueAtTime(66, t + dura / 2);
    o.frequency.linearRampToValueAtTime(50, t + dura);
    o.connect(filtro);
    o.start(t);
    o.stop(t + dura + 0.05);
    const s = c.createBufferSource();
    s.buffer = ruido;
    s.connect(filtro);
    s.start(t, 0, dura);
  }

  /**
   * La botella que se rompe: el crack, los parciales agudos del vidrio que se apagan cada uno a su
   * tiempo, y las astillas que caen desparramadas durante medio segundo largo.
   */
  function vidrio(e: AudioNode): void {
    const c = ctx!;
    const t = c.currentTime;
    const d = panear(e, Math.random() * 0.8 - 0.4);
    rafaga(d, { tipo: 'highpass', f: 1800, q: 0.7, dura: 0.05, vol: 0.3, cuando: t });
    rafaga(d, { tipo: 'bandpass', f: 3800, q: 0.8, dura: 0.14, vol: 0.15, cuando: t + 0.004 });
    modos(d, t, Array.from({ length: 7 }, () => [2400 + Math.random() * 6600, 0.05 + Math.random() * 0.35, 0.015 + Math.random() * 0.025] as const));
    const lados = [panear(e, -0.5), panear(e, 0), panear(e, 0.5)];
    const n = 10 + Math.floor(Math.random() * 5);
    for (let i = 0; i < n; i++) {
      const r = Math.random();
      const cuando = t + 0.06 + 0.64 * r ** 1.6;
      modos(lados[Math.floor(Math.random() * 3)]!, cuando, [[3000 + Math.random() * 5500, 0.03 + Math.random() * 0.06, 0.02 * (1 - 0.6 * r)]]);
    }
    granos(d, { tipo: 'highpass', f: 5000, q: 0.7, cuando: t + 0.05, dura: 0.5, n: 20, vol: 0.05, largo: 0.006 });
  }

  /** La rama que se dobla, se queja y se parte. */
  function rama(e: AudioNode): void {
    const c = ctx!;
    const t = c.currentTime;
    const d = lejos(e, Math.random() * 1.4 - 0.7, 3500);
    crujido(d, t, 0.3, 0.05);
    granos(d, { tipo: 'bandpass', f: 1800, q: 1.5, cuando: t + 0.2, dura: 0.12, n: 10, vol: 0.12, largo: 0.01 });
    rafaga(d, { tipo: 'bandpass', f: 1100, q: 1, dura: 0.07, vol: 0.22, cuando: t + 0.32 });
  }

  /** Los cubiertos contra el plato: dos a cuatro tintineos, cada uno con sus tres parciales. */
  function cubiertos(e: AudioNode): void {
    const c = ctx!;
    const d = panear(e, Math.random() * 1.2 - 0.6);
    let t = c.currentTime;
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const f = 2200 + Math.random() * 1400;
      rafaga(d, { tipo: 'highpass', f: 4000, q: 0.7, dura: 0.012, vol: 0.08, cuando: t });
      modos(d, t, [[f, 0.25, 0.02], [f * 1.52, 0.18, 0.014], [f * 2.37, 0.1, 0.01]]);
      t += 0.12 + Math.random() * 0.23;
    }
  }

  /** La campanada, de lejos: los parciales de una campana de iglesia, que no son armónicos. */
  function campana(e: AudioNode): void {
    const c = ctx!;
    const d = lejos(e, Math.random() < 0.5 ? -0.5 : 0.5, 2500);
    const f = 280 + Math.random() * 40;
    const parciales = [[0.5, 4, 0.02], [1, 3, 0.03], [1.19, 2.4, 0.015], [1.5, 2, 0.012], [2, 1.5, 0.01], [2.5, 1.1, 0.006], [3, 0.8, 0.004]] as const;
    for (const golpe of [0, 2.4]) {
      modos(d, c.currentTime + golpe, parciales.map(([r, decae, vol]) => [f * r, decae, vol] as const));
    }
  }

  /** El metal del astillero, de lejos: dos o tres martillazos contra una chapa gruesa. */
  function metal(e: AudioNode): void {
    const c = ctx!;
    const d = lejos(e, Math.random() * 1.4 - 0.7, 3500);
    const f = 160 + Math.random() * 40;
    let t = c.currentTime;
    const n = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      rafaga(d, { tipo: 'bandpass', f: 1500, q: 1, dura: 0.03, vol: 0.12, cuando: t });
      modos(d, t, [[f, 1, 0.04], [f * 2.76, 0.5, 0.025], [f * 5.4, 0.25, 0.012]]);
      t += 0.55 + Math.random() * 0.2;
    }
  }

  const SINTESIS: Record<string, Sintesis> = {
    vidrio, gota, rama, cubiertos, campana, metal, lechuza, cencerro, mosca, sirena, cadenas, bombo, gente, motor, bocina, estatica, ola, brasas,
  };

  /* ---------------- Las camas sintetizadas ---------------- */

  /** Ruido en vuelta por un filtro, con su volumen. La base de todas las camas. */
  function ruidoEnVuelta(d: AudioNode, tipo: BiquadFilterType, f: number, q: number, vol: number, fuentes: AudioScheduledSourceNode[]): { filtro: BiquadFilterNode; g: GainNode } {
    const c = ctx!;
    const s = c.createBufferSource();
    s.buffer = ruido;
    s.loop = true;
    const filtro = c.createBiquadFilter();
    filtro.type = tipo;
    filtro.frequency.value = f;
    filtro.Q.value = q;
    const g = c.createGain();
    g.gain.value = vol;
    s.connect(filtro);
    filtro.connect(g);
    g.connect(d);
    s.start(c.currentTime, Math.random() * 1.5);
    fuentes.push(s);
    return { filtro, g };
  }

  /** Un oscilador lento que mueve un parámetro: la respiración de una cama. */
  function vaiven(param: AudioParam, frec: number, hondo: number, fuentes: AudioScheduledSourceNode[]): void {
    const c = ctx!;
    const o = c.createOscillator();
    o.frequency.value = frec;
    const g = c.createGain();
    g.gain.value = hondo;
    o.connect(g);
    g.connect(param);
    o.start();
    fuentes.push(o);
  }

  /** Algo que vuelve cada tanto mientras la cama esté viva. */
  function repetir(hacer: () => void, min: number, max: number, viva: () => boolean): void {
    const vuelta = (): void => {
      if (!viva()) return;
      if (document.visibilityState === 'visible' && voces < MAX_VOCES) hacer();
      relojes.push(window.setTimeout(vuelta, (min + Math.random() * (max - min)) * 1000));
    };
    relojes.push(window.setTimeout(vuelta, min * 1000));
  }

  const CAMAS: Record<string, CamaSintetizada> = {
    /** El viento: ruido por un pasabanda que respira despacio. */
    viento(g, vol, fuentes) {
      const { filtro, g: v } = ruidoEnVuelta(g, 'bandpass', 420, 0.9, 0.06 * vol, fuentes);
      // Dos osciladores lentos: uno mueve el tono, el otro las ráfagas.
      vaiven(filtro.frequency, 0.07, 180, fuentes);
      vaiven(v.gain, 0.11, 0.036 * vol, fuentes);
    },
    grillos(g, vol, _fuentes, viva) {
      repetir(() => grillo(g, 0.015 * vol), 0.4, 1.6, viva);
    },
    /** El agua que corre en el bajo: un pasabanda que se mueve, el fondo grave y alguna burbuja. */
    'agua-corriendo'(g, vol, fuentes, viva) {
      const { filtro } = ruidoEnVuelta(g, 'bandpass', 700, 0.5, 0.05 * vol, fuentes);
      vaiven(filtro.frequency, 0.13, 250, fuentes);
      ruidoEnVuelta(g, 'lowpass', 260, 0.7, 0.05 * vol, fuentes);
      repetir(() => burbuja(panear(g, Math.random() * 1.4 - 0.7), ctx!.currentTime, 400 + Math.random() * 800, 1.8, 0.05, 0.025 * vol), 0.25, 0.9, viva);
    },
    /** El río contra los pilotes: un golpe de agua grave que va y viene. */
    rio(g, vol, fuentes) {
      const { g: v } = ruidoEnVuelta(g, 'lowpass', 380, 0.7, 0.07 * vol, fuentes);
      vaiven(v.gain, 0.17, 0.035 * vol, fuentes);
      ruidoEnVuelta(g, 'bandpass', 1400, 0.8, 0.012 * vol, fuentes);
    },
    /** El fuego del infierno: el rumor grave y el chisporroteo que no para. */
    fuego(g, vol, fuentes, viva) {
      const { g: v } = ruidoEnVuelta(g, 'lowpass', 220, 0.7, 0.07 * vol, fuentes);
      vaiven(v.gain, 0.3, 0.02 * vol, fuentes);
      repetir(() => granos(panear(g, Math.random() * 1.2 - 0.6), { tipo: 'highpass', f: 1500 + Math.random() * 2000, q: 0.8, cuando: ctx!.currentTime, dura: 0.2, n: 4, vol: 0.06 * vol, largo: 0.01 }), 0.12, 0.5, viva);
    },
    /** Los cables de Cybersiberia: el zumbido de la red y su soplido agudo. */
    'zumbido-electrico'(g, vol, fuentes) {
      const c = ctx!;
      const filtro = c.createBiquadFilter();
      filtro.type = 'lowpass';
      filtro.frequency.value = 300;
      const v = c.createGain();
      v.gain.value = 0.02 * vol;
      filtro.connect(v);
      v.connect(g);
      for (const [tipo, f] of [['sawtooth', 50], ['sine', 100]] as const) {
        const o = c.createOscillator();
        o.type = tipo;
        o.frequency.value = f;
        o.connect(filtro);
        o.start();
        fuentes.push(o);
      }
      vaiven(v.gain, 0.5, 0.008 * vol, fuentes);
      ruidoEnVuelta(g, 'highpass', 6000, 0.7, 0.004 * vol, fuentes);
    },
    /** El tono de la sala en la prisión: el aire quieto y un zumbido de tubo. */
    'tono-de-sala'(g, vol, fuentes) {
      ruidoEnVuelta(g, 'lowpass', 160, 0.7, 0.05 * vol, fuentes);
      const o = ctx!.createOscillator();
      o.frequency.value = 55;
      const v = ctx!.createGain();
      v.gain.value = 0.006 * vol;
      o.connect(v);
      v.connect(g);
      o.start();
      fuentes.push(o);
    },
    /** La olla que hierve en la mesa: un fondo apagado y las burbujas que revientan. */
    olla(g, vol, fuentes, viva) {
      ruidoEnVuelta(g, 'lowpass', 350, 0.7, 0.02 * vol, fuentes);
      repetir(() => burbuja(panear(g, 0.3), ctx!.currentTime, 180 + Math.random() * 300, 1.8, 0.04 + Math.random() * 0.03, 0.04 * vol), 0.08, 0.35, viva);
    },
  };

  /** Prende una cama: el archivo en vuelta si llegó, la síntesis si no. Devuelve con qué sonó y cómo se apaga. */
  function cama(nombre: string, vol: number): { sono: Sono; apagar: () => void } {
    const ef = EFECTOS[nombre];
    if (!ctx || !general || !ef) return { sono: 'nada', apagar: () => {} };
    const c = ctx;
    const g = c.createGain();
    g.gain.value = 0;
    g.gain.setTargetAtTime(1, c.currentTime, 0.8);
    g.connect(entrada(ef.sala));
    const fuentes: AudioScheduledSourceNode[] = [];
    let viva = true;
    let sono: Sono = 'nada';
    const b = variante(nombre);
    if (b) {
      const s = c.createBufferSource();
      s.buffer = b;
      s.loop = true;
      const v = c.createGain();
      v.gain.value = ef.vol * vol;
      s.connect(v);
      v.connect(g);
      s.start(c.currentTime, Math.random() * b.duration);
      fuentes.push(s);
      sono = 'archivo';
    } else if (CAMAS[nombre]) {
      CAMAS[nombre](g, vol, fuentes, () => viva && prendido);
      sono = 'sintesis';
    }
    return {
      sono,
      apagar() {
        if (!viva) return;
        viva = false;
        g.gain.setTargetAtTime(0, c.currentTime, 0.4);
        window.setTimeout(() => {
          for (const f of fuentes) {
            try {
              f.stop();
            } catch {
              // Ya estaba parada.
            }
          }
          g.disconnect();
        }, 2000);
      },
    };
  }

  /* ---------------- Lo que suena suelto ---------------- */

  function lanzar(nombre: string): Sono {
    const ef = EFECTOS[nombre];
    if (!ctx || !general || !ef) return 'nada';
    const b = variante(nombre);
    if (!ocupar(b ? b.duration : 3)) return 'nada';
    const e = entrada(ef.sala);
    if (SACUDEN[nombre]) sacudir(SACUDEN[nombre]!);
    if (b) {
      tocarArchivo(b, nombre, panear(e, Math.random() * 1.2 - 0.6));
      return 'archivo';
    }
    const hacer = SINTESIS[nombre];
    if (!hacer) return 'nada';
    hacer(e);
    return 'sintesis';
  }

  /** Agenda algo que vuelve cada tanto, con azar para que no se oiga la cuenta. */
  function cadaTanto(hacer: () => void, min: number, max: number): void {
    const vuelta = (): void => {
      if (!prendido) return;
      if (document.visibilityState === 'visible') hacer();
      relojes.push(window.setTimeout(vuelta, (min + Math.random() * (max - min)) * 1000));
    };
    relojes.push(window.setTimeout(vuelta, (min / 2 + Math.random() * min) * 1000));
  }

  /** El volumen de cada cama de la receta. El viento y los grillos vienen medidos a la vieja usanza. */
  function camasDeLaReceta(): Array<[string, number]> {
    const lista: Array<[string, number]> = Object.entries(receta.cama ?? {});
    if (receta.viento > 0) lista.push(['viento', receta.viento / 0.06]);
    if (receta.grillos > 0) lista.push(['grillos', receta.grillos / 0.015]);
    return lista;
  }

  return {
    prender(c) {
      if (prendido) return;
      ctx = c;
      ruido = ruidoDe(c);
      const mia = ++vuelta;
      general = c.createGain();
      general.gain.value = 0;
      general.gain.setTargetAtTime(VOLUMEN, c.currentTime, 0.6);
      general.connect(c.destination);
      seco = c.createGain();
      seco.connect(general);
      conSala = c.createGain();
      const sala = receta.sala;
      if (sala && sala.mezcla > 0) {
        const eco = c.createConvolver();
        eco.buffer = respuestaDe(c, sala);
        const mojado = c.createGain();
        mojado.gain.value = sala.mezcla * 0.6;
        const directo = c.createGain();
        directo.gain.value = 1 - sala.mezcla * 0.4;
        conSala.connect(eco);
        eco.connect(mojado);
        mojado.connect(general);
        conSala.connect(directo);
        directo.connect(general);
      } else {
        conSala.connect(general);
      }
      prendido = true;
      for (const nombre of efectosDe(receta)) void carga(nombre);
      // Cada cama espera su archivo, y si no está, arranca con la síntesis.
      for (const [nombre, vol] of camasDeLaReceta()) {
        void carga(nombre).then(() => {
          if (prendido && vuelta === mia) camas.push(cama(nombre, vol).apagar);
        });
      }
      for (const [nombre, [min, max]] of Object.entries(receta.cadaTanto ?? {})) cadaTanto(() => lanzar(nombre), min, max);
    },
    apagar() {
      if (!prendido || !ctx || !general) return;
      prendido = false;
      vuelta++;
      for (const r of relojes.splice(0)) clearTimeout(r);
      for (const a of camas.splice(0)) a();
      const g = general;
      g.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      window.setTimeout(() => g.disconnect(), 2000);
      general = null;
      ultimoX = null;
    },
    caminar(x) {
      if (!prendido || !ctx) return;
      if (ultimoX === null) {
        ultimoX = x;
        return;
      }
      andado += Math.abs(x - ultimoX);
      ultimoX = x;
      if (andado < receta.zancada) return;
      andado = 0;
      const ahora = ctx.currentTime;
      if (ahora - ultimoPaso < PASO_MIN_SEG) return;
      ultimoPaso = ahora;
      paso(receta.suelo);
    },
    tocar(id) {
      if (!prendido) return;
      const nombre = receta.alTocar?.[id];
      if (nombre) lanzar(nombre);
    },
    async oir(nombre) {
      if (!prendido) return 'nada';
      await carga(nombre);
      if (!prendido) return 'nada';
      if (!EFECTOS[nombre]?.bucle) return lanzar(nombre);
      const { sono, apagar } = cama(nombre, 1);
      relojes.push(window.setTimeout(apagar, CAMA_DE_PRUEBA_SEG * 1000));
      camas.push(apagar);
      return sono;
    },
    async pisar(suelo) {
      if (!prendido) return 'nada';
      await carga(`pasos-${suelo}`);
      return prendido ? paso(suelo) : 'nada';
    },
  };
}
