/**
 * Los sonidos de interfaz de los juegos (ronda 2 de la pulida, 2026-11-18).
 *
 * Cinco ruidos mecánicos, todos sintetizados con Web Audio: **ningún archivo**. Son los del
 * objeto que la pantalla dibuja —una casetera y un sello de goma—, cortos y bajos:
 *
 * - `tic`: una tecla de máquina, para cada letra que se escribe.
 * - `tecla`: una tecla de casetera que baja, para los botones.
 * - `clac`: el mecanismo que engancha o suelta la cinta.
 * - `golpe`: el error. Sordo y grave.
 * - `sello`: el acierto. El golpe del sello de goma contra la hoja.
 *
 * ## Las tres reglas
 *
 * 1. **Nunca encima de un fragmento que se está adivinando.** Este módulo no sabe si hay un
 *    fragmento sonando: lo sabe la isla, y es ella la que no llama mientras suena. Lo que sí
 *    garantiza este módulo es que cada efecto dura menos que `TOPE_EFECTO_SEG`.
 * 2. **Usa el contexto de audio del sitio, y solo si ya está despierto** (`contexto.ts`,
 *    `ADR-04.2`). No crea uno ni lo despierta: si la persona todavía no tocó "Empezá", acá no
 *    suena nada. Y como sale por el mismo contexto que la música, sigue la misma suerte que
 *    ella con la llave de silencio del teléfono (`D-66`, `sesion.ts`).
 * 3. **Bajos.** `GANANCIA_EFECTOS` es la perilla de todos juntos, y está muy por debajo de la
 *    música, que sale a ganancia 1.
 *
 * El molde es `lib/skayboy/sonido.ts` (`CTR-17`): fichas con números con nombre, y una
 * función que programa nodos y los suelta al terminar.
 */

import { contextoVivo } from './contexto.ts';

export type Efecto = 'tic' | 'tecla' | 'clac' | 'golpe' | 'sello';

/** La perilla de todos los efectos juntos. La música sale a 1. */
export const GANANCIA_EFECTOS = 0.16;
/** Ningún efecto dura más que esto. */
export const TOPE_EFECTO_SEG = 0.25;
const SILENCIO = 0.0001;
const ATAQUE_SEG = 0.003;

/** Un soplido de ruido filtrado: el cuerpo de casi todos los ruidos mecánicos. */
interface Soplido {
  /** Cuándo arranca, en segundos desde el disparo. */
  readonly desde: number;
  readonly largoSeg: number;
  readonly filtro: BiquadFilterType;
  readonly hz: number;
  readonly nivel: number;
}

/** Un tono que cae: el cuerpo grave de un golpe. */
interface Caida {
  readonly desde: number;
  readonly largoSeg: number;
  readonly desdeHz: number;
  readonly hastaHz: number;
  readonly nivel: number;
}

export interface FichaDeEfecto {
  readonly soplidos: readonly Soplido[];
  readonly caidas: readonly Caida[];
}

export const EFECTOS: Readonly<Record<Efecto, FichaDeEfecto>> = {
  tic: {
    soplidos: [{ desde: 0, largoSeg: 0.012, filtro: 'highpass', hz: 3200, nivel: 0.35 }],
    caidas: [],
  },
  tecla: {
    soplidos: [{ desde: 0, largoSeg: 0.03, filtro: 'bandpass', hz: 1400, nivel: 0.8 }],
    caidas: [{ desde: 0, largoSeg: 0.04, desdeHz: 220, hastaHz: 140, nivel: 0.35 }],
  },
  clac: {
    soplidos: [
      { desde: 0, largoSeg: 0.022, filtro: 'bandpass', hz: 950, nivel: 0.9 },
      { desde: 0.055, largoSeg: 0.03, filtro: 'bandpass', hz: 620, nivel: 0.7 },
    ],
    caidas: [{ desde: 0.055, largoSeg: 0.05, desdeHz: 130, hastaHz: 80, nivel: 0.5 }],
  },
  golpe: {
    soplidos: [{ desde: 0, largoSeg: 0.06, filtro: 'lowpass', hz: 480, nivel: 0.8 }],
    caidas: [{ desde: 0, largoSeg: 0.16, desdeHz: 150, hastaHz: 52, nivel: 1 }],
  },
  sello: {
    soplidos: [
      { desde: 0, largoSeg: 0.02, filtro: 'bandpass', hz: 2400, nivel: 0.7 },
      { desde: 0.005, largoSeg: 0.07, filtro: 'lowpass', hz: 700, nivel: 0.6 },
    ],
    caidas: [{ desde: 0, largoSeg: 0.12, desdeHz: 120, hastaHz: 64, nivel: 0.9 }],
  },
};

/** Cuánto dura un efecto entero, del disparo al último nodo. */
export function largoDe(ficha: FichaDeEfecto): number {
  return Math.max(0, ...[...ficha.soplidos, ...ficha.caidas].map((p) => p.desde + p.largoSeg));
}

let salida: GainNode | null = null;
let ruido: AudioBuffer | null = null;

function preparar(ctx: AudioContext): GainNode | null {
  if (salida && salida.context === ctx) return salida;
  try {
    const maestro = ctx.createGain();
    maestro.gain.value = GANANCIA_EFECTOS;
    maestro.connect(ctx.destination);
    salida = maestro;
    // Un cuarto de segundo de ruido blanco, hecho una vez: de acá salen todos los soplidos.
    const muestras = Math.ceil(ctx.sampleRate * TOPE_EFECTO_SEG);
    ruido = ctx.createBuffer(1, muestras, ctx.sampleRate);
    const datos = ruido.getChannelData(0);
    for (let i = 0; i < muestras; i++) datos[i] = Math.random() * 2 - 1;
    return salida;
  } catch {
    salida = null;
    return null;
  }
}

function envolver(ganancia: AudioParam, inicio: number, fin: number, pico: number): void {
  ganancia.setValueAtTime(SILENCIO, inicio);
  ganancia.linearRampToValueAtTime(pico, inicio + Math.min(ATAQUE_SEG, (fin - inicio) / 3));
  ganancia.exponentialRampToValueAtTime(SILENCIO, fin);
}

/**
 * Hace sonar un efecto. Devuelve `false` —y no hace nada— si el audio del sitio todavía no
 * está despierto. Nunca lanza: un sonido de interfaz que falla no puede romper una partida.
 */
export function sonarEfecto(efecto: Efecto): boolean {
  const ctx = contextoVivo();
  if (!ctx || ctx.state !== 'running') return false;
  const maestro = preparar(ctx);
  if (!maestro || !ruido) return false;
  const ficha = EFECTOS[efecto];
  const t0 = ctx.currentTime;
  try {
    for (const s of ficha.soplidos) {
      const fuente = ctx.createBufferSource();
      fuente.buffer = ruido;
      const filtro = ctx.createBiquadFilter();
      filtro.type = s.filtro;
      filtro.frequency.value = s.hz;
      const envolvente = ctx.createGain();
      envolver(envolvente.gain, t0 + s.desde, t0 + s.desde + s.largoSeg, s.nivel);
      fuente.connect(filtro).connect(envolvente).connect(maestro);
      fuente.start(t0 + s.desde);
      fuente.stop(t0 + s.desde + s.largoSeg + 0.01);
      fuente.onended = () => envolvente.disconnect();
    }
    for (const c of ficha.caidas) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(c.desdeHz, t0 + c.desde);
      osc.frequency.exponentialRampToValueAtTime(c.hastaHz, t0 + c.desde + c.largoSeg);
      const envolvente = ctx.createGain();
      envolver(envolvente.gain, t0 + c.desde, t0 + c.desde + c.largoSeg, c.nivel);
      osc.connect(envolvente).connect(maestro);
      osc.start(t0 + c.desde);
      osc.stop(t0 + c.desde + c.largoSeg + 0.01);
      osc.onended = () => envolvente.disconnect();
    }
    return true;
  } catch {
    return false;
  }
}
