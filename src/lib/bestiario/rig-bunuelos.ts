/**
 * Los números de los redonditos de ricota (`D-73`, vigesimoctava vuelta): la fuente de buñuelos en la mesita, al lado
 * de la silla vacía de Patricio Rey. Los lee el dibujo (`arte-bunuelos.ts`), para la pose quieta del HTML y para el
 * retrato, y la conducta (`scripts/bestiario/bunuelos.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de la fuente**: el (0, 0) es la tapa de la mesita, debajo del medio del plato; arriba es negativo. Está
 *   dibujada al doble, y la escena la achica con `FUENTE.escala`.
 * - **El del recinto** (900 × 640, el del galpón): sobre el tablado, al lado de la silla, donde estaba la cosa del toque
 *   (`COSAS_DEL_GALPON`). En el camino el galpón se estira con `k` y la fuente va con él (`ancla`).
 */

import { GALPON } from './rig-entornos.ts';
import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde está, y lo que mide: la tapa de la mesita (`rig-entornos.ts`: la fuente se apoya 40 arriba del piso de las patas). */
export const FUENTE = { x: GALPON.fuente.x, piso: GALPON.fuente.piso - 40, escala: 0.6 } as const;

/** Cómo está armada, en sus coordenadas. */
export const FUENTE_ARMADA = {
  /** El borde del plato, de donde sale la pila. */
  plato: { y: -12, rx: 62 },
  /** El buñuelo de arriba de la pila, que es el que sale. */
  tope: [0, -92] as Punto,
  /** El resorte de las pinzas, donde se unen los dos brazos: las puntas miran a la pila, apoyadas en el plato. */
  bisagra: [134, -12] as Punto,
  /** Las pinzas apoyadas en la mesa: de cuánto se corren (x, y) y cuánto giran (grados) para agarrar el de arriba. */
  agarra: [-4, 4, 22] as readonly [number, number, number],
  /** Por dónde sube el vapor, de cada lado. */
  vapor: [[-14, -60], [18, -64]] as readonly Punto[],
  /** Hasta dónde llega el buñuelo cuando rueda a la mesa. */
  borde: [118, -13] as Punto,
} as const;

/** Lo que dice el toque, en registro 1 (`voz-ricotera.md`): voseo, ocho palabras o menos. Va de `aria-description`. */
export const LINEA = 'Agarrá uno. Son de quien pase.';

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** La pila se asienta (0 como está, 1 aplastada): cruje un poco. */
  asienta: number;
  /** El buñuelo de arriba: dónde está (se suma a su lugar), cuánto gira (grados) y cuánto crece. */
  tope: readonly [number, number, number, number];
  /** Las pinzas: cuánto se corren, cuánto giran (grados) y cuánto abren (0 cerradas, 1 abiertas). */
  pinza: readonly [number, number, number];
  abre: number;
  /** El azúcar: cuánto cayó (0 nada, 1 todo) y el vapor (segundos, para el desfase de cada hilo). */
  azucar: number;
  vapor: number;
}

export const QUIETO: Momento = {
  asienta: 0,
  tope: [0, 0, 0, 1],
  pinza: [0, 0, 0],
  abre: 0.35,
  azucar: 0,
  vapor: 0.5,
};

/**
 * *"Agarrá uno"*: el de arriba sale de la pila hacia quien mira, grande, sostenido en las pinzas, con el azúcar cayendo.
 * Es el toque quieto y el retrato.
 */
export const OFRECE: Momento = {
  ...QUIETO,
  asienta: 0.4,
  tope: [46, 52, 24, 1.75],
  pinza: [-4, 10, 24],
  abre: 0.1,
  azucar: 0.5,
  vapor: 2.1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [FUENTE.x + x * FUENTE.escala, FUENTE.piso + y * FUENTE.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = FUENTE_ARMADA;
  const [bx, by] = A.bisagra;
  const [tx, ty] = A.tope;
  const transform: Record<string, string> = {
    entero: `translate(${FUENTE.x} ${FUENTE.piso}) scale(${FUENTE.escala})`,
    pila: `translate(0 ${A.plato.y}) scale(${n2(1 + 0.03 * m.asienta)} ${n2(1 - 0.06 * m.asienta)}) translate(0 ${-A.plato.y})`,
    tope: `translate(${n2(tx + m.tope[0])} ${n2(ty + m.tope[1])}) rotate(${n2(m.tope[2])}) scale(${n2(m.tope[3])})`,
    pinza: `translate(${n2(m.pinza[0])} ${n2(m.pinza[1])}) rotate(${n2(m.pinza[2])} ${bx} ${by})`,
    // Los dos brazos abren y cierran alrededor de la bisagra.
    'pinza-1': `rotate(${n2(-1 - 7 * m.abre)} ${bx} ${by})`,
    'pinza-2': `rotate(${n2(1 + 7 * m.abre)} ${bx} ${by})`,
    azucar: `translate(0 ${n2(-10 + 34 * m.azucar)})`,
  };
  const opacity: Record<string, string> = { azucar: n2(Math.sin(Math.PI * Math.min(1, Math.max(0, m.azucar))) * 0.9) };
  A.vapor.forEach(([x, y], i) => {
    const fase = (((m.vapor * 0.28 + i * 0.5) % 1) + 1) % 1;
    transform[`vapor-${i + 1}`] = `translate(${n2(x + 5 * Math.sin(fase * 6.28 + i))} ${n2(y - 38 * fase)}) scale(${n2(0.8 + 0.5 * fase)})`;
    opacity[`vapor-${i + 1}`] = n2(Math.sin(Math.PI * fase) * 0.55);
  });
  return { transform, opacity };
}

/** Dónde dice su línea: arriba de la pila, en el recinto. */
export const VERSO: Punto = alRecinto([0, -170]);
