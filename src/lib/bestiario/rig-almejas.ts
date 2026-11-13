/**
 * Los números de las almejas (`D-73`, vigesimoctava vuelta): dónde está su balde en el muelle, cómo está armado y
 * cómo se pone. Los lee el dibujo (`arte-almejas.ts`), para la pose quieta del HTML y para el retrato, y la
 * conducta (`scripts/bestiario/almejas.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del balde**: el (0, 0) es la tabla del muelle debajo del medio del balde; arriba es negativo. Está dibujado
 *   a un tamaño y la escena lo achica con `ALMEJAS.escala`.
 * - **El del recinto** (900 × 640, el de los astilleros): adelante del todo, en el muelle, donde estaba pintado el
 *   balde (`ASTILLERO.balde`). En el camino el piso es más ancho y todo lo fijo se corre con `k` (`K_ENTORNO`): el
 *   marco lo corre `ancla · (k − 1)`.
 */

import type { P } from './trazos.ts';
import { ASTILLERO } from './rig-entornos.ts';

export type Punto = P;

/** Dónde está el balde, y lo que mide. El piso es la tabla del muelle. */
export const ALMEJAS = { x: ASTILLERO.balde.x + 18, piso: ASTILLERO.balde.piso, escala: 0.7 } as const;

/** Cómo está armado, en sus coordenadas. */
export const ALMEJAS_ARMADO = {
  /** El medio de la boca del balde, y lo que miden el aro de arriba y el de abajo. */
  boca: [0, -86] as Punto,
  rx: 46,
  ry: 11,
  pie: 36,
  /** Las tres almejas que asoman arriba del montón: dónde apoyan (x, y) y lo que están ladeadas (grados). */
  almejas: [[-22, -91, -14], [6, -96, 4], [30, -90, 20]] as ReadonlyArray<readonly [number, number, number]>,
  /** La bisagra de cada almeja, en sus coordenadas: de ahí gira la valva de arriba. */
  bisagra: [-14, 1] as Punto,
  /** Cuánto se abre la valva a pleno (grados). */
  abre: 64,
  /** La que se escapó: dónde está, hasta dónde llega por la tabla (hacia la izquierda), y el piso que pisa. */
  fugitiva: { x: -66, y: -10, hasta: 40 },
  /** El plato de lata, con su sopa, y el pivote de la cuchara (donde se apoya el cabo). */
  plato: [112, -10] as Punto,
  cuchara: { pivote: [134, -34] as Punto, punta: [-52, 14] as Punto },
  /** De dónde sube el vapor de la sopa. */
  vapor: [112, -26] as Punto,
  /** Dónde queda el higo seco que nunca tuvo. */
  higo: [60, -6] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Cuánto abre la valva cada una de las tres almejas del balde (0 cerrada, 1 a pleno). */
  abre: readonly [number, number, number];
  /** El balde: cuánto saltó (unidades) y cuánto tiembla de costado. */
  salto: number;
  tiembla: number;
  /** Los chorros que tiran las almejas (0 a 1, lo que se estira cada uno). */
  chorro: readonly [number, number, number];
  /** La que se escapó: lo que anduvo desde su lugar (unidades, hacia la izquierda), cuánto saca el pie (0 a 1), cuánto abre y para dónde mira. */
  fuga: number;
  pie: number;
  fugiAbre: number;
  mira: -1 | 1;
  /** La cuchara: lo que se corre (x, y) y lo que gira (grados). Y cuánto tiene agarrada a la almeja de la derecha (0 a 1). */
  cuchara: readonly [number, number, number];
  prendida: number;
  /** La perla: dónde está y cuánto se ve. */
  perla: readonly [number, number];
  perlaSe: number;
  /** El vapor de la sopa: la fase (0 a 1) y cuánto hay. */
  vapor: number;
  hay: number;
}

/** La pose quieta, la del HTML: las almejas entreabiertas, la cuchara en el plato y la fugitiva en su lugar. */
export const QUIETO: Momento = {
  abre: [0.3, 0.46, 0.22],
  salto: 0,
  tiembla: 0,
  chorro: [0, 0, 0],
  fuga: 0,
  pie: 0,
  fugiAbre: 0.26,
  mira: 1,
  cuchara: [0, 0, 0],
  prendida: 0,
  perla: [0, 0],
  perlaSe: 0,
  vapor: 0.3,
  hay: 0.8,
};

/**
 * *"Sopa de almejas es todo lo que como"*: las tres abiertas a pleno, cada una con su chorro, y la perla
 * en el aire arriba del plato. Es el toque quieto y el retrato.
 */
export const SOPA: Momento = {
  ...QUIETO,
  abre: [1, 1, 1],
  chorro: [1, 1, 1],
  fugiAbre: 1,
  perla: [74, -150],
  perlaSe: 1,
  hay: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [ALMEJAS.x + x * ALMEJAS.escala, ALMEJAS.piso + y * ALMEJAS.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const rad = (g: number): number => (g * Math.PI) / 180;

/** Dónde queda la punta de la cuchara (la parte honda) con un corrimiento y un giro. */
export function puntaDeLaCuchara(dx: number, dy: number, ang: number): Punto {
  const { pivote: [px, py], punta: [ux, uy] } = ALMEJAS_ARMADO.cuchara;
  const a = rad(ang);
  return [px + dx + ux * Math.cos(a) - uy * Math.sin(a), py + dy + ux * Math.sin(a) + uy * Math.cos(a)];
}

/** El corrimiento que lleva la punta de la cuchara a `objetivo` con un giro dado. */
export function cucharaA(objetivo: Punto, ang: number): readonly [number, number, number] {
  const [x, y] = puntaDeLaCuchara(0, 0, ang);
  return [objetivo[0] - x, objetivo[1] - y, ang];
}

/** Dónde está cada almeja del balde en un momento: apoyada en el montón, o colgando de la cuchara si la tiene agarrada (la de la derecha). */
export function dondeEsta(i: 0 | 1 | 2, m: Momento): readonly [number, number, number] {
  const [x, y, g] = ALMEJAS_ARMADO.almejas[i];
  if (i !== 2 || m.prendida <= 0) return [x, y, g];
  const [tx, ty] = puntaDeLaCuchara(...m.cuchara);
  const k = m.prendida;
  // Cuelga de la punta: un poco abajo y torcida con la cuchara.
  return [x + (tx - x) * k, y + (ty + 4 - y) * k, g + (m.cuchara[2] * 0.6 - g) * k];
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = ALMEJAS_ARMADO;
  const [bx, by] = A.bisagra;
  const [cvx, cvy] = A.cuchara.pivote;
  const transform: Record<string, string> = {
    entero: `translate(${ALMEJAS.x} ${ALMEJAS.piso}) scale(${ALMEJAS.escala})`,
    balde: `translate(${n2(m.tiembla)} ${n2(-m.salto)})`,
    // La que se escapó: va de costado, mirando para donde va, con el pie por delante.
    fugi: `translate(${n2(A.fugitiva.x - m.fuga)} ${n2(A.fugitiva.y - 2 * Math.abs(Math.sin(m.fuga * 0.5)) * m.pie)})`,
    'fugi-cuerpo': `scale(${m.mira === 1 ? -1 : 1} 1)`,
    'fugi-tapa': `rotate(${n2(-A.abre * m.fugiAbre)} ${bx} ${by})`,
    'fugi-pie': `translate(${n2(12)} ${n2(7)}) scale(${n2(Math.max(0.05, m.pie))} 1)`,
    cuchara: `translate(${n2(m.cuchara[0])} ${n2(m.cuchara[1])}) rotate(${n2(m.cuchara[2])} ${cvx} ${cvy})`,
    perla: `translate(${n2(m.perla[0])} ${n2(m.perla[1])})`,
    'vapor-1': `translate(${n2(A.vapor[0] + 3 * Math.sin(m.vapor * 6.28))} ${n2(A.vapor[1] - 22 * m.vapor)}) scale(${n2(0.7 + 0.5 * m.vapor)})`,
    'vapor-2': `translate(${n2(A.vapor[0] - 10 + 4 * Math.sin((m.vapor + 0.5) * 6.28))} ${n2(A.vapor[1] - 22 * ((m.vapor + 0.5) % 1))}) scale(${n2(0.7 + 0.5 * ((m.vapor + 0.5) % 1))})`,
  };
  for (const i of [0, 1, 2] as const) {
    const [x, y, g] = dondeEsta(i, m);
    transform[`almeja-${i + 1}`] = `translate(${n2(x)} ${n2(y)}) rotate(${n2(g)})`;
    transform[`tapa-${i + 1}`] = `rotate(${n2(-A.abre * m.abre[i]!)} ${bx} ${by})`;
    // El chorro sale del labio de la almeja, para arriba y un poco para donde mira, y se estira.
    transform[`chorro-${i + 1}`] = `translate(${n2(x + 8)} ${n2(y - 9)}) scale(1 ${n2(Math.max(0.02, m.chorro[i]!))})`;
  }
  const f = (v: number): string => n2(Math.min(1, Math.max(0, v)));
  const opacity: Record<string, string> = {
    'chorro-1': m.chorro[0]! > 0.03 ? '1' : '0',
    'chorro-2': m.chorro[1]! > 0.03 ? '1' : '0',
    'chorro-3': m.chorro[2]! > 0.03 ? '1' : '0',
    perla: f(m.perlaSe),
    'vapor-1': f(Math.sin(m.vapor * Math.PI) * 0.95 * m.hay),
    'vapor-2': f(Math.sin(((m.vapor + 0.5) % 1) * Math.PI) * 0.95 * m.hay),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba del balde, en el recinto. */
export const VERSO: Punto = alRecinto([10, -150]);
