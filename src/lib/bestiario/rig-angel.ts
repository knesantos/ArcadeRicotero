/**
 * Los números del ángel de la soledad (`D-73`, decimoséptima vuelta): dónde se para al pie del árbol del
 * gran bonete, cómo está armado, cómo abre las alas y cómo ataja. Los lee el dibujo (`arte-angel.ts`),
 * para la pose quieta del HTML y para el retrato, y la conducta (`scripts/bestiario/angel.ts`), que se
 * lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del títere**: el (0, 0) es la tierra entre los pies, arriba es negativo, y mira para adelante,
 *   a la gente, apenas de tres cuartos hacia el tronco.
 * - **El del recinto** (900 × 640): el árbol (`ARBOL`, `rig-entornos.ts`). Está parado a la izquierda del
 *   tronco, debajo del nido de los pájaros de la noche, que es de donde se caen los huevos que ataja.
 *
 * En el camino la llanura se estira con `k` y el marco del ángel se corre entero; el nido se corre con la
 * copa, así que la conducta corrige la caída con `k` (`nidoEn`).
 */

import { ARBOL } from './rig-entornos.ts';

export type Punto = readonly [number, number];

/** El ángel en el recinto: al pie del árbol, del lado del marco de cobre, donde estaba su silueta. */
export const LUGAR = {
  x: 372,
  piso: 534,
  escala: 0.5,
} as const;

/** Cómo está armado, en el títere. El 1 es el lado de la derecha del dibujo (el del tronco); el 2, el otro. */
export const ANGEL_ARMADO = {
  /** El pescuezo, de donde gira la cabeza, y el medio de la cara. */
  cuello: [1, -164] as Punto,
  cara: [2, -188] as Punto,
  /** Los ojos, con su radio: el de la derecha más grande, como el ojo del lobo de la tapa. */
  ojos: [
    { centro: [8.6, -190] as Punto, radio: [4.6, 3.6] as Punto },
    { centro: [-5.4, -189.4] as Punto, radio: [3.9, 3.2] as Punto },
  ],
  /** La oreja del lado del tronco: ahí se lleva el huevo para escucharlo. */
  oreja: [16.5, -186] as Punto,
  /** Los hombros, de donde cuelgan los brazos, y lo que mide cada tramo. */
  hombros: [[16, -152], [-16, -152]] as readonly [Punto, Punto],
  brazo: 36,
  antebrazo: 40,
  /** De dónde se abren las alas: atrás de los hombros. Cerradas cuelgan y lo envuelven como una capa. */
  alas: [[11, -156], [-11, -156]] as readonly [Punto, Punto],
  /** Cuánto giran abiertas del todo: para afuera y para arriba. */
  abre: 118,
} as const;

/** El nido de los pájaros de la noche, de donde se cae el huevo, en el recinto (`nido()` en `arte-entornos.ts`). */
export const NIDO: Punto = [ARBOL.nidos[0][0] - 4, ARBOL.nidos[0][1] - 2];

/** Del recinto al títere. */
export const alTitere = ([x, y]: Punto): Punto => [(x - LUGAR.x) / LUGAR.escala, (y - LUGAR.piso) / LUGAR.escala];
/** Del títere al recinto. */
export const alRecinto = ([x, y]: Punto): Punto => [LUGAR.x + x * LUGAR.escala, LUGAR.piso + y * LUGAR.escala];

/**
 * El nido en el títere. En el camino la copa se estira con `k` y el ángel se corre con su marco: el
 * nido le queda a `(NIDO.x − LUGAR.x) · k` de distancia, no a `NIDO.x − LUGAR.x`.
 */
export const nidoEn = (k = 1): Punto => [((NIDO[0] - LUGAR.x) * k) / LUGAR.escala, (NIDO[1] - LUGAR.piso) / LUGAR.escala];

/** Rota `p` alrededor de `c`, en grados (positivo es como las agujas, como en SVG). */
export function rotar([x, y]: Punto, [cx, cy]: Punto, grados: number): Punto {
  const a = (grados * Math.PI) / 180;
  const [dx, dy] = [x - cx, y - cy];
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
}

/* ------------------------------------------------------------------
   Los brazos: dos tramos que llegan adonde se les pide
   ------------------------------------------------------------------ */

/** El giro que lleva la dirección de colgar (para abajo) a la de `d`, en grados SVG. */
const giroDe = ([dx, dy]: Punto): number => (Math.atan2(-dx, dy) * 180) / Math.PI;

/**
 * Lleva la mano del brazo `n` a `meta`, con el codo para afuera. Devuelve el giro del brazo en el hombro,
 * el del antebrazo en el codo (contado desde el brazo), y dónde quedan el codo y la mano.
 */
export function alcanzar(n: 0 | 1, meta: Punto): { brazo: number; antebrazo: number; codo: Punto; mano: Punto } {
  const A = ANGEL_ARMADO;
  const s = A.hombros[n];
  const [l1, l2] = [A.brazo, A.antebrazo];
  let [dx, dy] = [meta[0] - s[0], meta[1] - s[1]];
  let d = Math.hypot(dx, dy) || 1e-6;
  const max = l1 + l2 - 0.01;
  const min = Math.abs(l1 - l2) + 0.01;
  if (d > max || d < min) {
    const k = (d > max ? max : min) / d;
    [dx, dy] = [dx * k, dy * k];
    d = d > max ? max : min;
  }
  const a = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  // El codo para afuera: de los dos lados posibles de la línea, el que queda más lejos del cuerpo.
  const [ux, uy] = [dx / d, dy / d];
  const codoA = (lado: number): Punto => {
    const [cos, sin] = [Math.cos(a * lado), Math.sin(a * lado)];
    return [s[0] + (ux * cos - uy * sin) * l1, s[1] + (ux * sin + uy * cos) * l1];
  };
  const [c1, c2] = [codoA(1), codoA(-1)];
  const codo = (n === 0 ? c1[0] >= c2[0] : c1[0] <= c2[0]) ? c1 : c2;
  const mano: Punto = [s[0] + dx, s[1] + dy];
  const brazo = giroDe([codo[0] - s[0], codo[1] - s[1]]);
  const antebrazo = giroDe([mano[0] - codo[0], mano[1] - codo[1]]) - brazo;
  return { brazo, antebrazo, codo, mano };
}

/* ------------------------------------------------------------------
   El momento: lo que la conducta decide en cada cuadro
   ------------------------------------------------------------------ */

export interface Momento {
  /** Cuánto abre las alas, de 0 (cerradas, de capa) a 1 (abiertas del todo), y lo que respiran, en grados. */
  alas: number;
  respira: number;
  /** Adónde lleva cada mano, en el títere: la 1 es la del lado del tronco. */
  manos: readonly [Punto, Punto];
  /** Cuánto se agacha al atajar, de 0 a 1. */
  agacha: number;
  /** La cabeza: cuánto gira (positivo, para el lado del tronco). */
  cabeza: number;
  /** Adónde miran las pupilas, de -1 a 1 en cada eje. */
  mira: Punto;
  /** Cuánto bajan los párpados, de 0 (abiertos) a 1 (cerrados). */
  parpados: number;
  /** La ceja de no creer: de 0 a 1. */
  ceja: number;
  /** El huevo que ataja: dónde está en el títere, cuánto gira y cuánto se ve. */
  huevo: { x: number; y: number; giro: number; o: number };
}

/** Las manos colgando, tapadas por las alas cerradas. */
export const MANOS_QUIETAS: readonly [Punto, Punto] = [[19, -80], [-19, -80]];
/** Las manos abiertas, para recibir al que se cae. */
export const MANOS_ABIERTAS: readonly [Punto, Punto] = [[64, -132], [-64, -132]];
/** Las manos arriba de la cabeza, ahuecadas, donde cae el huevo. */
export const MANOS_ATAJAN: readonly [Punto, Punto] = [[3, -220], [-14, -219]];
/** Dónde queda el huevo en las manos que atajan. */
export const ATAJADO: Punto = [-5.5, -229];
/** La mano con el huevo pegado a la oreja, para escucharlo. */
export const MANO_OREJA: Punto = [27, -194];
/** Las manos del abrazo: cruzadas sobre el pecho, abrazando el aire. */
export const MANOS_ABRAZO: readonly [Punto, Punto] = [[-12, -126], [12, -122]];

/** La pose quieta, la del HTML: las alas cerradas, de capa, y la mirada de reojo, sin creer nada. */
export const QUIETA: Momento = {
  alas: 0,
  respira: 0,
  manos: MANOS_QUIETAS,
  agacha: 0,
  cabeza: 0,
  mira: [0.25, 0.1],
  parpados: 0.42,
  ceja: 0.3,
  huevo: { x: 0, y: 0, giro: 0, o: 0 },
};

/** *"Y caes en manos del Ángel de la soledad"*: las alas abiertas y las manos para recibirte. Es la del toque quieto y la del retrato. */
export const ABIERTO: Momento = { ...QUIETA, alas: 1, manos: MANOS_ABIERTAS, mira: [0, 0.1], parpados: 0.18, ceja: 0.7 };

/* ------------------------------------------------------------------
   La pose: del momento a cada pieza
   ------------------------------------------------------------------ */

const n2 = (v: number): string => v.toFixed(2);

/** Lo que baja el cuerpo cuando se agacha a atajar. */
export const AGACHA = 7;

/** El giro de cada ala para un momento: la 1 se abre para la derecha, la 2 para la izquierda. */
export function giroDeAla(n: 0 | 1, m: Momento): number {
  const g = ANGEL_ARMADO.abre * m.alas + m.respira;
  return n === 0 ? -g : g;
}

/**
 * El canto de afuera del ala de la derecha, cerrada, desde el hombro: es el hueso del ala, liso, que
 * abierta queda arriba. Sube en joroba atrás del hombro, se abre en panza y baja hasta la punta. La de la
 * izquierda es su espejo. Lo dibuja `arte-angel.ts` y lo mira el test contra los vecinos.
 */
export const ALA_CANTO: readonly Punto[] = [[9, -18], [22, -8], [34, 30], [40, 78], [38, 118], [27, 142], [14, 153]];
/**
 * El canto de adentro, de la punta para arriba: el de las plumas largas, serruchado. Cerrada, es la
 * abertura de la capa, por delante; abierta, cuelga para abajo.
 */
export const ALA_ADENTRO: readonly Punto[] = [[5, 140], [-5, 104], [-9, 60], [-7, 22], [-2, 4]];

/** Dónde queda la punta de cada ala, en el títere. */
export function puntaDeAla(n: 0 | 1, m: Momento): Punto {
  return cantoDeAla(n, m).at(-1)!;
}

/** Por dónde corre el canto de afuera de cada ala, en el títere: el test lo mira contra los vecinos. */
export function cantoDeAla(n: 0 | 1, m: Momento): Punto[] {
  const A = ANGEL_ARMADO;
  const p = A.alas[n];
  const s = n === 0 ? 1 : -1;
  const canto: Punto[] = ALA_CANTO.map(([x, y]) => [p[0] + s * x, p[1] + y] as Punto);
  return canto.map((q) => {
    const [x, y] = rotar(q, p, giroDeAla(n, m));
    return [x, y + m.agacha * AGACHA] as Punto;
  });
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el
 * HTML (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = ANGEL_ARMADO;
  const [cx, cy] = A.cuello;
  const transform: Record<string, string> = {
    entero: `translate(${LUGAR.x} ${LUGAR.piso}) scale(${LUGAR.escala})`,
    cuerpo: `translate(0 ${n2(m.agacha * AGACHA)})`,
    cabeza: `rotate(${n2(m.cabeza)} ${cx} ${cy})`,
    ceja: `translate(0 ${n2(-m.ceja * 3.2)}) rotate(${n2(-m.ceja * 9)} 8.6 -196)`,
    huevo: `translate(${n2(m.huevo.x)} ${n2(m.huevo.y)}) rotate(${n2(m.huevo.giro)})`,
  };
  for (const n of [0, 1] as const) {
    const [ax, ay] = A.alas[n];
    transform[`ala-${n + 1}`] = `rotate(${n2(giroDeAla(n, m))} ${ax} ${ay})`;
    // Las manos se piden con el cuerpo derecho; agachado, el cuerpo las baja con él.
    const meta: Punto = [m.manos[n][0], m.manos[n][1] - m.agacha * AGACHA];
    const r = alcanzar(n, meta);
    const [sx, sy] = A.hombros[n];
    transform[`brazo-${n + 1}`] = `rotate(${n2(r.brazo)} ${sx} ${sy})`;
    transform[`antebrazo-${n + 1}`] = `rotate(${n2(r.antebrazo)} ${sx} ${sy + A.brazo})`;
    const { centro: [ox, oy], radio: [rx, ry] } = A.ojos[n];
    transform[`pupila-${n + 1}`] = `translate(${n2(m.mira[0] * rx * 0.45)} ${n2(m.mira[1] * ry * 0.4)})`;
    const py = Math.round((oy - ry - 0.5) * 10) / 10;
    transform[`parpado-${n + 1}`] = `translate(${ox} ${py}) scale(1 ${n2(Math.max(0.02, m.parpados))}) translate(${-ox} ${-py})`;
  }
  const opacity: Record<string, string> = { huevo: n2(m.huevo.o) };
  return { transform, opacity };
}

/** Dónde queda la mano `n` en un momento, en el títere (con el cuerpo agachado). */
export function manoEn(n: 0 | 1, m: Momento): Punto {
  const r = alcanzar(n, [m.manos[n][0], m.manos[n][1] - m.agacha * AGACHA]);
  return [r.mano[0], r.mano[1] + m.agacha * AGACHA];
}

/** Dónde dice su verso: arriba de la cabeza, debajo del jocker. */
export const VERSO: Punto = [LUGAR.x + 4, LUGAR.piso - 132];
