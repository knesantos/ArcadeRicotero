/**
 * Los números de los buitres de la tele (`D-73`, vigesimoctava vuelta): los dos que esperan arriba de la antena.
 * Los lee el dibujo (`arte-buitres.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/buitres.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de los buitres**: el (0, 0) es la cara de arriba del travesaño donde están parados, en el medio; arriba es
 *   negativo. Cada buitre se dibuja mirando a la **derecha**, con el (0, 0) debajo de sus patas, y el segundo va
 *   espejado: se miran. Está dibujado al doble, y la escena lo achica con `BUITRES.escala`.
 * - **El del recinto** (900 × 640, el de Cybersiberia): arriba de la tele, en la punta izquierda de la antena de conejo,
 *   donde esperaban sus siluetas pintadas (`CYBER.antena.izq`). En el camino Cybersiberia se estira con `k`.
 */

import { CYBER } from './rig-entornos.ts';
import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde esperan, y lo que miden: un poco abajo de la punta de la antena, donde se ata el travesaño. */
export const BUITRES = { x: CYBER.antena.izq[0] + 9, piso: CYBER.antena.izq[1] + 18, escala: 0.6 } as const;

/** Cómo están armados, en sus coordenadas (mirando a la derecha). */
export const BUITRE = {
  /** El medio del cuerpo: de acá respira. */
  lomo: [-4, -34] as Punto,
  /** La base del cuello, bajo la gorguera: de acá gira el cuello con la cabeza. */
  cuello: [22, -54] as Punto,
  /** El ojo y lo que mide. */
  ojo: { centro: [41, -94] as Punto, radio: [4.4, 4] as Punto },
  /** La punta del pico. */
  pico: [61, -90] as Punto,
  /** El cuello de la servilleta, metida en la gorguera. */
  servilleta: [24, -54] as Punto,
  /** La mano de ala que sostiene el cubierto. */
  mano: [40, -30] as Punto,
} as const;

/** Dónde se paran: los dos están a cada lado del medio del travesaño, y el de la derecha va espejado. */
export const LUGARES = [
  { x: -70, mira: 1 },
  { x: 70, mira: -1 },
] as const;

/** Dónde chocan el tenedor y el cuchillo cuando se afilan: en el medio, a la altura de las manos. */
export const CHOCAN: Punto = [0, -52];

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

type Dos = readonly [number, number];

export interface Momento {
  /** La respiración (−1 a 1). */
  respira: number;
  /** Cuánto gira el cuello con la cabeza (grados; positivo la baja para adelante) y cuánto se estira (1 normal). */
  cuello: Dos;
  estira: Dos;
  /** El párpado (0 abierto, 1 cerrado). */
  parpado: Dos;
  /** La servilleta (grados) y el cubierto (grados; negativo lo levanta), que llegan después que el cuerpo. */
  servilleta: Dos;
  cubierto: Dos;
  /** El sacudón de plumas (grados) y lo que salta cada uno (unidades). */
  sacude: Dos;
  salta: Dos;
  /** La chispa del cuchillo contra el tenedor (0 nada, 1 a pleno). */
  chispa: number;
}

export const QUIETO: Momento = {
  respira: 0,
  cuello: [-2, 2],
  estira: [1, 1],
  parpado: [0.3, 0.35],
  servilleta: [2, -2],
  cubierto: [-8, -8],
  sacude: [0, 0],
  salta: [0, 0],
  chispa: 0,
};

/**
 * *"Estás frito, angelito"*: los dos giran la cabeza de golpe para quien los toca, estiran el cogote, abren los ojos y
 * levantan el tenedor y el cuchillo, con las servilletas tiesas. Es el toque quieto y el retrato.
 */
export const ENCIMA: Momento = {
  ...QUIETO,
  cuello: [-14, -12],
  estira: [1.18, 1.18],
  parpado: [0, 0],
  servilleta: [10, -10],
  cubierto: [10, 10],
  salta: [2, 2],
  chispa: 0.8,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [BUITRES.x + x * BUITRES.escala, BUITRES.piso + y * BUITRES.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = BUITRE;
  const [lx, ly] = A.lomo;
  const [nx, ny] = A.cuello;
  const [sx, sy] = A.servilleta;
  const [mx, my] = A.mano;
  const { centro: [ex, ey], radio: [, ry] } = A.ojo;
  const top = ey - ry - 0.6;
  const transform: Record<string, string> = { entero: `translate(${BUITRES.x} ${BUITRES.piso}) scale(${BUITRES.escala})` };
  for (const i of [0, 1] as const) {
    const n = i + 1;
    const L = LUGARES[i];
    transform[`buitre-${n}`] = `translate(${L.x} ${n2(-m.salta[i])}) scale(${L.mira} 1)`;
    transform[`cuerpo-${n}`] = `translate(${lx} ${ly + 30}) rotate(${n2(m.sacude[i])}) scale(${n2(1 - 0.01 * m.respira)} ${n2(1 + 0.03 * m.respira)}) translate(${-lx} ${-ly - 30})`;
    transform[`cuello-${n}`] = `translate(${nx} ${ny}) scale(1 ${n2(m.estira[i])}) rotate(${n2(m.cuello[i])}) translate(${-nx} ${-ny})`;
    transform[`parpado-${n}`] = `translate(${ex} ${top}) scale(1 ${n2(Math.max(0.02, m.parpado[i]))}) translate(${-ex} ${-top})`;
    transform[`servilleta-${n}`] = `rotate(${n2(m.servilleta[i])} ${sx} ${sy})`;
    transform[`cubierto-${n}`] = `rotate(${n2(m.cubierto[i])} ${mx} ${my})`;
  }
  const [cx, cy] = CHOCAN;
  transform.chispa = `translate(${cx} ${cy}) scale(${n2(0.4 + 0.9 * m.chispa)})`;
  return { transform, opacity: { chispa: n2(Math.min(1, m.chispa)) } };
}

/** Dónde dicen su verso: arriba de las cabezas, en el recinto. */
export const VERSO: Punto = alRecinto([0, -118]);
