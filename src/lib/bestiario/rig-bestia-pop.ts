/**
 * Los números de la bestia pop (`D-73`, decimoquinta vuelta): dónde está parada en el galpón y
 * dónde se dobla. Son números, como `rig.ts`: los lee el dibujo (`arte-bestia-pop.ts`) para
 * recortar cada pieza alrededor de su bisagra, y los lee la conducta
 * (`scripts/bestiario/bestia-pop.ts`) para mover las piezas sin llevarse el pincel al teléfono.
 *
 * Todo va en coordenadas de títere: el (0, 0) es el tablado entre los dos pies, arriba es negativo,
 * y a escala 1 mide lo que pide el galpón (`GALPON.bestiaPop.alto`).
 */

import { GALPON } from './rig-entornos.ts';

export type P = readonly [number, number];

/** Lo que mide el títere dibujado, de las plataformas a la coronilla (sin el pelo parado). */
const ALTO_DIBUJADO = 190;

/** Dónde está parada: del lado izquierdo de la silla, en el tablado, y a qué escala. */
export const POP = {
  x: GALPON.bestiaPop.x,
  piso: GALPON.bestiaPop.piso,
  escala: Math.round((GALPON.bestiaPop.alto / ALTO_DIBUJADO) * 1000) / 1000,
} as const;

/** Un gesto: cuánto gira el brazo en el hombro y el antebrazo en el codo (se suma al del brazo). */
export interface Gesto {
  brazo: number;
  antebrazo: number;
}

/**
 * El títere armado. El brazo `0` es el de adelante (a la izquierda, el que da a la gente y se tapa
 * la cara) y el `1` el de atrás (a la derecha, del lado de la silla, el que busca la luz).
 */
export const POP_ARMADO = {
  /** Donde se dobla el cuerpo sobre las piernas: respira y se endereza desde acá. */
  cadera: [0, -58] as P,
  /** Donde la cabeza se apoya, hundida en el cuello de lentejuelas. */
  cuello: [6, -142] as P,
  hombros: [[-50, -136], [58, -134]] as readonly [P, P],
  codos: [[-78, -84], [86, -82]] as readonly [P, P],
  /** Los nudillos, que apoya en el tablado como un gorila. */
  manos: [[-90, -14], [98, -12]] as readonly [P, P],
  /** La cara: el hueco negro donde la gente le pone la suya. */
  cara: { centro: [6, -160] as P, radio: [20, 25] as P },
  /** Cuántas caras tiene para ponerse. */
  caras: 4,
  /**
   * Los gestos. Se calcularon para que la mano llegue adonde tiene que llegar, y el test lo mide:
   * - `tapa`: el brazo de adelante cruza y la mano le tapa la cara.
   * - `busca`: el brazo de atrás se estira hasta el cono del seguidor, sin llegar a la silla.
   * - `brilla`: los dos brazos arriba y abiertos, como la gente con los puños en alto.
   */
  gestos: {
    tapa: { brazo: -64, antebrazo: -110 } as Gesto,
    busca: { brazo: 22, antebrazo: -104 } as Gesto,
    brilla: [
      { brazo: 104, antebrazo: 18 },
      { brazo: -104, antebrazo: -18 },
    ] as readonly [Gesto, Gesto],
  },
  /** Cuánto se endereza cuando brilla: sube el cuerpo y levanta la cabeza hacia el reflector. */
  endereza: { sube: 9, cabeza: 5 },
} as const;

/** El seguidor que cae sobre la silla, en el recinto: la bestia lo busca y no se mete. */
export const SEGUIDOR = { x: GALPON.silla.x, arriba: -20, piso: GALPON.silla.piso + 6, abreArriba: 26, abreAbajo: 112 } as const;

/** La silla vacía, en el recinto: su caja, para que nadie la tape. */
export const SILLA = { x0: GALPON.silla.x - 37, x1: GALPON.silla.x + 37, arriba: GALPON.silla.piso - 104, piso: GALPON.silla.piso } as const;

/** Un punto del títere, llevado al recinto. */
export const enElRecinto = ([x, y]: P): P => [POP.x + x * POP.escala, POP.piso + y * POP.escala];

/** Rota `p` alrededor de `c`, en grados (positivo es como las agujas, como en SVG). */
export function rotar([x, y]: P, [cx, cy]: P, grados: number): P {
  const a = (grados * Math.PI) / 180;
  const [dx, dy] = [x - cx, y - cy];
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
}

/**
 * Dónde queda un punto del antebrazo `n` con el gesto puesto: primero gira en el codo y después
 * todo el brazo en el hombro, que es como están anidadas las piezas.
 */
export function enElAntebrazo(n: 0 | 1, p: P, { brazo, antebrazo }: Gesto): P {
  const A = POP_ARMADO;
  return rotar(rotar(p, A.codos[n], antebrazo), A.hombros[n], brazo);
}

/** Dónde queda la mano `n` con el gesto puesto. */
export const manoCon = (n: 0 | 1, g: Gesto): P => enElAntebrazo(n, POP_ARMADO.manos[n], g);
