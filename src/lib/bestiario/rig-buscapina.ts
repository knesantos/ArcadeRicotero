/**
 * Los números del Capitán Buscapina (`D-73`, decimoquinta vuelta): dónde está sentado en la nieve de
 * Cybersiberia y dónde se dobla. Son números, como `rig.ts`: los lee el dibujo (`arte-buscapina.ts`)
 * para recortar cada pieza alrededor de su bisagra, y los lee la conducta
 * (`scripts/bestiario/buscapina.ts`) para moverlas sin llevarse el aerógrafo al teléfono.
 *
 * Todo va en coordenadas de títere: el (0, 0) es la nieve donde está sentado, entre las dos rodillas;
 * arriba es negativo. A escala 1 mide lo que mide el dibujo; la escena lo achica (`BUSCA.escala`).
 */

import { CYBER, COSAS_DE_CYBERSIBERIA } from './rig-entornos.ts';

export type P = readonly [number, number];

/** Lo que mide sentado, de la nieve a la copa de la gorra. */
export const ALTO_DIBUJADO = 202;

/**
 * Dónde está sentado: delante de la tele, un poco a la izquierda del medio (la mira de abajo y de
 * costado), en el charco de luz que la pantalla tira sobre la nieve. Más abajo que la vieja silueta
 * (`COSAS_DE_CYBERSIBERIA`, [450, 474]) para que la gorra no se meta en el toque de la Divina TV Führer.
 */
export const BUSCA = {
  x: CYBER.tele.x - 12,
  piso: CYBER.tele.piso + 128,
  escala: 0.5,
} as const;

/** Un gesto de un brazo: cuánto gira en el hombro y cuánto el antebrazo en el codo (se suma). */
export interface Gesto {
  brazo: number;
  antebrazo: number;
}

/**
 * El títere armado. El brazo `1` es el izquierdo de él, que es el de nuestra izquierda (lo vemos de
 * espaldas): el de las boletas. El `2` es el derecho: el del control remoto.
 */
export const BUSCA_ARMADO = {
  /** Donde se dobla la espalda: en la nieve, entre las nalgas, así el montón de nieve no se despega. */
  asiento: [0, -4] as P,
  /**
   * Donde la cabeza se apoya en el cogote. Está echado para la izquierda, apoyado en ese brazo, así
   * que el cogote queda corrido de la línea del asiento.
   */
  cuello: [-8, -131] as P,
  /** El izquierdo, subido por el brazo en que se apoya; el derecho, caído. */
  hombros: [[-48, -104], [34, -102]] as readonly [P, P],
  codos: [[-62, -56], [56, -62]] as readonly [P, P],
  /**
   * Las manos: la izquierda, plantada en la capa encima de las boletas (que no se vuelen); la derecha,
   * colgando del otro lado de la rodilla, con el control.
   */
  manos: [[-76, 0], [78, -62]] as readonly [P, P],
  /** La rodilla derecha, levantada: es donde apoya el brazo del control. La otra pierna va estirada. */
  rodilla: [68, -72] as P,
  /** La cabeza, sin la gorra: el centro del cráneo y sus radios. Mira para arriba, a la pantalla. */
  craneo: { centro: [-3, -148] as P, radio: [18, 21] as P },
  /** El ojo de la cabeza vuelta: el único que se le ve cuando te mira por encima del hombro. */
  ojo: [-23, -149] as P,
  /** Dónde cae en la nieve la boleta que tira, atrás de él (de nuestro lado), y cuánto sube antes. */
  boleta: { cae: [-110, 36] as P, alto: 64 },
  /** La boca: de acá sale el vaho, para el lado de la tele. */
  boca: [17, -138] as P,
  /**
   * Los gestos. Se calcularon para que la mano llegue adonde tiene que llegar, y el test lo mide:
   * - `paga`: el brazo de las boletas se despega de la capa y la mano pasa por encima del hombro,
   *   para tirar una para atrás sin darse vuelta del todo.
   * - `canal`: el del control se levanta de la rodilla y apunta para arriba, a la pantalla.
   * - `costado`: el del control se dobla y la mano se va al costado, debajo de las costillas: el hígado.
   */
  gestos: {
    paga: { brazo: 62, antebrazo: 141 } as Gesto,
    canal: { brazo: -20, antebrazo: -80 } as Gesto,
    costado: { brazo: -7, antebrazo: -154 } as Gesto,
  },
  /** Cuánto se inclina la espalda cuando le agarra el costado, y cuánto tirita. */
  inclina: 3.5,
  tirita: 1.1,
} as const;

/** La vieja silueta pintada: el capitán se toca ahora en el títere, y esto queda para los tests. */
export const SILUETA_VIEJA = COSAS_DE_CYBERSIBERIA['el-capitan-buscapina']!;

/** Un punto del títere, llevado al recinto. */
export const enElRecinto = ([x, y]: P): P => [BUSCA.x + x * BUSCA.escala, BUSCA.piso + y * BUSCA.escala];

/** Rota `p` alrededor de `c`, en grados (positivo es como las agujas, como en SVG). */
export function rotar([x, y]: P, [cx, cy]: P, grados: number): P {
  const a = (grados * Math.PI) / 180;
  const [dx, dy] = [x - cx, y - cy];
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
}

/**
 * Dónde queda un punto del antebrazo `n` (0 el izquierdo, 1 el derecho) con el gesto puesto: primero
 * gira en el codo y después todo el brazo en el hombro, que es como están anidadas las piezas.
 */
export function enElAntebrazo(n: 0 | 1, p: P, { brazo, antebrazo }: Gesto): P {
  const A = BUSCA_ARMADO;
  return rotar(rotar(p, A.codos[n], antebrazo), A.hombros[n], brazo);
}

/** Dónde queda la mano `n` con el gesto puesto. */
export const manoCon = (n: 0 | 1, g: Gesto): P => enElAntebrazo(n, BUSCA_ARMADO.manos[n], g);

/** El golpe de muñeca con que la suelta: el de `paga`, con el antebrazo un poco más atrás. */
export const SUELTA: Gesto = { brazo: BUSCA_ARMADO.gestos.paga.brazo, antebrazo: BUSCA_ARMADO.gestos.paga.antebrazo + 22 };

/**
 * El vuelo de la boleta: una parábola que sale de la mano, por encima del hombro, en el golpe de
 * muñeca (`SUELTA`), y cae en la nieve de nuestro lado. `k` va de 0 (en la mano) a 1 (en la nieve).
 * Devuelve dónde está y cuánto giró.
 */
export function vuelo(k: number): { p: P; giro: number } {
  const { cae, alto } = BUSCA_ARMADO.boleta;
  const sale = manoCon(0, SUELTA);
  const t = Math.max(0, Math.min(1, k));
  const x = sale[0] + (cae[0] - sale[0]) * t;
  const y = sale[1] + (cae[1] - sale[1]) * t - alto * 4 * t * (1 - t);
  return { p: [x, y], giro: -220 * t + 18 * Math.sin(t * 9) };
}
