/**
 * Dónde empieza a sonar de verdad cada fragmento de "adiviná el tema" (`T-533`).
 *
 * ## El defecto
 *
 * Los 95 fragmentos del PR #8 son recortes de 10 s hechos a mano, y varios arrancan con
 * silencio: la entrada del tema antes del primer golpe, o un fundido. El motor reproducía
 * siempre `[0, segundos]`, así que en esos temas el paso 1 (0,1 s) y el paso 2 (0,5 s)
 * **sonaban iguales: a nada**. El peor medía 9,29 s hasta el primer sonido que se oye.
 * No hay masters ni ffmpeg en la PC del usuario: no se pueden recortar de nuevo.
 *
 * ## La salida
 *
 * Se mide el arranque real de cada mp3 y el motor reproduce desde ahí. Este archivo es
 * **la regla**, y es pura: recibe la envolvente de un fragmento (el nivel RMS de cada
 * ventana de 10 ms, en dBFS) y decide el `inicioSeg` y si el tema entra al sorteo. No
 * decodifica nada — eso solo lo sabe hacer un navegador, y lo hace
 * `scripts/medir-fragmentos.mjs`, que guarda las envolventes en
 * `scripts/fragmentos-envolvente.json`. De ahí salen los números del manifiesto, y
 * `arranque.test.ts` falla si el manifiesto dice otra cosa que esta regla.
 *
 * ## Por qué −30 dBFS y no −45
 *
 * Medido sobre los 95: un fragmento que suena normal promedia entre −14 y −20 dBFS. A
 * −45 "algo suena" en el sentido de que no es cero digital, pero queda 30 dB debajo de un
 * tema normal: por el parlante de un teléfono, en la calle, es silencio. Arrancar ahí
 * dejaba el paso 1 de `nuotatori-professionisti` o de `dr-saturno` tan mudo como antes.
 * A −30 el paso queda como mucho 15 dB debajo de un tema que arranca fuerte: bajo, pero
 * se oye con el volumen que ya tiene puesto quien viene jugando.
 *
 * ## Por qué no alcanza con "la primera ventana que pasa el umbral"
 *
 * Porque el paso 1 tiene que sonar a algo y no a un clic. Un chasquido de 10 ms seguido
 * de silencio pasa cualquier umbral de ventana. Por eso el arranque pide tres cosas a la
 * vez, y las tres miran **la décima de segundo que va a sonar en el paso 1**:
 *
 * 1. la ventana donde arranca llega al umbral (no se empieza en un hueco);
 * 2. la décima entera promedia el umbral;
 * 3. más de la mitad de sus ventanas están a menos de 10 dB del umbral (sostenido).
 */

import { ESCALERA } from './escalera.ts';

/** El ancho de cada ventana de la envolvente. */
export const VENTANA_MS = 10;
/** El nivel desde el que un arranque "se oye". Ver la cabecera. */
export const UMBRAL_DB = -30;
/** Cuánto puede caer una ventana debajo del umbral y seguir contando como sostenida. */
export const MARGEN_SOSTEN_DB = 10;
/** Cuántas ventanas de la primera décima tienen que estar sostenidas. */
export const VENTANAS_SOSTENIDAS = 6;
/** El piso de la envolvente: lo que se guarda para el silencio digital. */
export const PISO_DB = -100;

const POR_SEG = 1000 / VENTANA_MS;
const PASO_CORTO = ESCALERA[0]!.segundos;
const VENTANAS_PASO_CORTO = Math.round(PASO_CORTO * POR_SEG);

/**
 * Cuánto fragmento tiene que quedar después del arranque para que el tema se sortee: lo
 * que dura el penúltimo paso. Con eso los cinco pasos que prometen un número lo cumplen
 * enteros desde el primer sonido, y el último —que no promete número: es "el resto"—
 * suena lo que quede hasta el final (`ventana()` en `escalera.ts`).
 */
export const RESTO_MINIMO_SEG = ESCALERA[ESCALERA.length - 2]!.segundos;

/** Una envolvente: el nivel RMS en dBFS de cada ventana de `VENTANA_MS`. */
export type Envolvente = readonly number[];

/** Por qué un fragmento queda fuera del sorteo. `null` es que entra. */
export type MotivoFuera = 'sin-arranque' | 'arranque-tardio';

export interface Arranque {
  /** Dónde arranca el corte. `null`: nunca llega a sonar sostenido sobre el umbral. */
  readonly inicioSeg: number | null;
  readonly sorteo: boolean;
  readonly motivo: MotivoFuera | null;
}

/** Un byte por ventana: `dB = byte / 2 − 100`. Medio dB de resolución, de −100 a +27,5. */
export function codificarEnvolvente(db: Envolvente): string {
  const bytes = db.map((v) => Math.max(0, Math.min(255, Math.round((v - PISO_DB) * 2))));
  return Buffer.from(Uint8Array.from(bytes)).toString('base64');
}

export function decodificarEnvolvente(base64: string): number[] {
  return [...Buffer.from(base64, 'base64')].map((b) => b / 2 + PISO_DB);
}

/** El nivel RMS, en dBFS, del tramo `[desdeSeg, hastaSeg)`. Vacío da el piso. */
export function nivelDb(env: Envolvente, desdeSeg: number, hastaSeg: number): number {
  const a = Math.max(0, Math.round(desdeSeg * POR_SEG));
  const b = Math.min(env.length, Math.round(hastaSeg * POR_SEG));
  if (b <= a) return PISO_DB;
  let potencia = 0;
  for (let i = a; i < b; i++) potencia += 10 ** (env[i]! / 10);
  return Math.max(PISO_DB, 10 * Math.log10(potencia / (b - a)));
}

/** ¿La décima que arranca en la ventana `i` suena a algo? Las tres condiciones de arriba. */
function suenaDesde(env: Envolvente, i: number): boolean {
  if (env[i]! < UMBRAL_DB) return false;
  const fin = i + VENTANAS_PASO_CORTO;
  if (fin > env.length) return false;
  let sostenidas = 0;
  for (let k = i; k < fin; k++) if (env[k]! >= UMBRAL_DB - MARGEN_SOSTEN_DB) sostenidas++;
  if (sostenidas < VENTANAS_SOSTENIDAS) return false;
  return nivelDb(env, i / POR_SEG, fin / POR_SEG) >= UMBRAL_DB;
}

/** El primer instante desde el que el paso 1 suena a algo. `null` si no lo hay. */
export function medirInicio(env: Envolvente): number | null {
  for (let i = 0; i + VENTANAS_PASO_CORTO <= env.length; i++) {
    if (suenaDesde(env, i)) return i / POR_SEG;
  }
  return null;
}

/** La regla entera: dónde arranca y si se sortea. */
export function decidirArranque(env: Envolvente, duracionSeg: number): Arranque {
  const inicioSeg = medirInicio(env);
  if (inicioSeg === null) return { inicioSeg: null, sorteo: false, motivo: 'sin-arranque' };
  if (duracionSeg - inicioSeg < RESTO_MINIMO_SEG) {
    return { inicioSeg, sorteo: false, motivo: 'arranque-tardio' };
  }
  return { inicioSeg, sorteo: true, motivo: null };
}
