/**
 * Los números de las sirenas (`D-73`, vigesimosegunda vuelta): dónde flotan en el agua del bajo, cómo están
 * armadas y cómo se ponen. Los lee el dibujo (`arte-sirenas.ts`), para la pose quieta del HTML y para el
 * retrato, y la conducta (`scripts/bestiario/sirenas.ts`), que se lleva esto y nada que dibuje.
 *
 * Son dos, y se mueven juntas: la 1 es la gata linda, con orejas de gata; la 2 es la llena, redonda, con el
 * botín en la mano.
 *
 * Dos sistemas de coordenadas:
 * - **El de cada sirena**: el (0, 0) es donde la corta el agua, en el medio de la cintura; arriba es
 *   negativo. Lo que está más abajo del agua no se ve (`AGUA`): por ahí se zambullen. Están dibujadas a dos
 *   veces, y la escena las achica con su `escala`.
 * - **El del recinto** (el bajo, de −250 a 1200): en el agua de la derecha, delante de la tarima donde la
 *   banda tocó igual, del lado que da al fuego.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde flota cada una, y lo que mide. La 2 está más atrás, más chica. */
export const SIRENAS = [
  { x: 1086, agua: 476, escala: 0.56 },
  { x: 1166, agua: 452, escala: 0.48 },
] as const;

/** Hasta dónde se ve una sirena para abajo: la línea del agua, un poquito más abajo de la cintura. */
export const AGUA = 4;

/** Cómo está armada cada una, en sus coordenadas. */
export const SIRENA_ARMADO = {
  cuello: [[0, -54], [0, -50]] as readonly [Punto, Punto],
  cara: [[0, -74], [0, -72]] as readonly [Punto, Punto],
  boca: [[0, -64], [0, -61]] as readonly [Punto, Punto],
  /** El hombro del brazo que se mueve: la gata llama con la mano; la llena levanta el botín. */
  hombro: [[-18, -44], [22, -40]] as readonly [Punto, Punto],
  mano: [[-28, -8], [36, -10]] as readonly [Punto, Punto],
  /** El prendedor radioactivo, en la camisa apretada de la gata. */
  prendedor: [8, -34] as Punto,
  /** Donde asoma la cola cuando la saca: lejos del cuerpo, del otro lado. */
  cola: [[56, 0], [-50, 0]] as readonly [Punto, Punto],
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export type Par = readonly [number, number];

export interface Momento {
  /** Cuánto sale cada una del agua (unidades, para arriba): negativo es zambullida. */
  alto: Par;
  /** Cuánto se mece cada una (grados). */
  mece: Par;
  /** Cuánto gira cada cabeza (grados). */
  cabeza: Par;
  /** Cuánto gira el brazo que se mueve (grados). */
  brazo: Par;
  /** La boca de cada una: 0 cerrada, 1 cantando. */
  boca: Par;
  /** Cuánto saca cada una la cola del agua (0 adentro, 1 afuera del todo) y cuánto la gira (grados). */
  cola: Par;
  coleo: Par;
  /** Las salpicaduras de cada una (0 a 1, qué tan alto). */
  salpica: Par;
  /** Lo que canta: los arcos que salen para el lado del fuego (0 a 1, qué tan lejos van). */
  canto: number;
  /** El brillo del prendedor radioactivo (0 a 1). */
  radio: number;
  /** Las ondas del agua alrededor de cada una (0 a 1). */
  ondas: Par;
}

/** La pose quieta, la del HTML: las dos asomadas, con la boca cerrada. */
export const QUIETO: Momento = {
  alto: [0, 0],
  mece: [0, 0],
  cabeza: [-6, 4],
  brazo: [0, -40],
  boca: [0, 0],
  cola: [0, 0],
  coleo: [0, 0],
  salpica: [0, 0],
  canto: 0,
  radio: 0.4,
  ondas: [0.4, 0.4],
};

/**
 * *"Gatas lindas, sirenas llenas, reclamando el botín para la prisión"*: las dos arriba, cantando para el
 * lado del fuego, la gata con la mano en la boca y la llena con el botín en alto. Es el toque quieto y el
 * retrato.
 */
export const CANTAN: Momento = {
  ...QUIETO,
  alto: [10, 8],
  cabeza: [-16, -10],
  brazo: [-60, -110],
  boca: [1, 1],
  cola: [0.8, 0],
  coleo: [20, 0],
  canto: 0.8,
  radio: 1,
  ondas: [1, 0.8],
};

/** Cuánto se hunden al zambullirse: lo que las tapa enteras. */
export const HONDO = -140;

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = (n: 0 | 1, [x, y]: Punto): Punto => [SIRENAS[n].x + x * SIRENAS[n].escala, SIRENAS[n].agua + y * SIRENAS[n].escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta. Cada parte lleva el número de su sirena.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = SIRENA_ARMADO;
  const transform: Record<string, string> = {};
  const opacity: Record<string, string> = {};
  for (const n of [0, 1] as const) {
    const k = n + 1;
    const [cx, cy] = A.cuello[n];
    const [hx, hy] = A.hombro[n];
    const [bx, by] = A.boca[n];
    const [qx] = A.cola[n];
    transform[`entera-${k}`] = `translate(${SIRENAS[n].x} ${SIRENAS[n].agua}) scale(${SIRENAS[n].escala})`;
    transform[`cuerpo-${k}`] = `translate(0 ${n2(-m.alto[n])}) rotate(${n2(m.mece[n])} 0 0)`;
    transform[`cabeza-${k}`] = `rotate(${n2(m.cabeza[n])} ${cx} ${cy})`;
    // El pelo va detrás del cuerpo pero gira con la cabeza.
    transform[`pelo-${k}`] = transform[`cabeza-${k}`]!;
    transform[`brazo-${k}`] = `rotate(${n2(m.brazo[n])} ${hx} ${hy})`;
    transform[`boca-${k}`] = `translate(${bx} ${by}) scale(1 ${n2(0.3 + 0.7 * m.boca[n])}) translate(${-bx} ${-by})`;
    // La cola sube desde abajo del agua, y gira en la base.
    transform[`cola-${k}`] = `translate(0 ${n2(92 * (1 - m.cola[n]))}) rotate(${n2(m.coleo[n])} ${qx} 0)`;
    transform[`salpica-${k}`] = `translate(${qx} 0) scale(${n2(0.4 + 0.8 * m.salpica[n])}) translate(${-qx} 0)`;
    transform[`ondas-${k}`] = `scale(${n2(0.8 + 0.4 * m.ondas[n])} 1)`;
    opacity[`boca-${k}`] = n2(m.boca[n]);
    opacity[`salpica-${k}`] = n2(m.salpica[n] > 0 ? Math.min(1, m.salpica[n] * 2) * (1 - m.salpica[n] * 0.5) : 0);
    opacity[`ondas-${k}`] = n2(0.3 + 0.6 * m.ondas[n]);
  }
  transform.canto = `translate(${n2(-60 * m.canto)} 0)`;
  opacity.canto = n2(m.canto > 0 ? Math.sin(Math.PI * Math.min(1, m.canto)) : 0);
  opacity.radio = n2(m.radio);
  return { transform, opacity };
}

/** Dónde dicen su verso: arriba de las dos, en el recinto. */
export const VERSO: Punto = [(SIRENAS[0].x + SIRENAS[1].x) / 2, 370];
