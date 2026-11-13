/**
 * Los números de la liebre muerta (`D-73`, vigesimoséptima vuelta): dónde está tendida en el monte, cómo está armada
 * y cómo se pone. Los lee el dibujo (`arte-liebre.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/liebre.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de la liebre**: el (0, 0) es el piso debajo del medio del lomo; arriba es negativo. Está panza arriba, con
 *   la cabeza a la **derecha**. Está dibujada al doble, y la escena la achica con `LIEBRE.escala`.
 * - **El del recinto** (900 × 640, el del monte): en el borde de abajo del claro, lejos de la soga del cordero. Sus
 *   ojos se corrieron con ella (`VECINOS_DEL_MONTE`). En el camino va corrida entera adonde la esperaban (`ojos` del tramo en `camino.ts`).
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde está tendida, y lo que mide. */
export const LIEBRE = { x: 512, piso: 530, escala: 0.45 } as const;

/** Cómo está armada, en sus coordenadas. El 1 es la pata de lejos. */
export const LIEBRE_ARMADO = {
  /** El medio de la panza: de acá respira. */
  panza: [-6, -30] as Punto,
  /** Las caderas y los hombros: de acá giran las patas, que apuntan para arriba. */
  caderas: [[-46, -40], [-56, -38]] as readonly [Punto, Punto],
  hombros: [[40, -46], [30, -48]] as readonly [Punto, Punto],
  /** El cogote: de acá gira la cabeza. */
  cuello: [62, -28] as Punto,
  /** El ojo de este lado, y lo que mide. */
  ojo: { centro: [92, -30] as Punto, radio: [7, 6.4] as Punto },
  /** La comisura de la boca: de acá cuelga la lengua. */
  boca: [103, -55] as Punto,
  /** Las bases de las orejas, en la coronilla, contra el piso. */
  orejas: [[80, -14], [72, -16]] as readonly [Punto, Punto],
  /** El pompón de la cola. */
  cola: [-80, -24] as Punto,
  /** La guinda de arriba del montón, en el terciopelo, y la punta de la pata que la agarra. */
  guinda: [150, -14] as Punto,
  /** Por dónde pasa la piedra que rueda: de dónde sale y hasta dónde llega, y a qué altura. */
  piedra: { desde: -170, hasta: 200, y: 12 },
} as const;

/** Cómo tiene las patas cuando nadie mira, en grados: abiertas, cada una para su lado. */
export const FLOJAS = { traseras: [-34, 22], delanteras: [48, 76] } as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** La respiración (−1 a 1): casi no se le nota. */
  respira: number;
  /** Tiesa (0 floja, 1 con las cuatro patas derechas para arriba) y el temblor del esfuerzo (unidades). */
  tiesa: number;
  tiembla: number;
  /** Lo que giran de más las patas de atrás y las de adelante (grados): el reflejo, y el manotazo a la guinda. */
  patea: readonly [number, number];
  manotea: number;
  /** Cuánto levanta la cabeza del piso (grados; negativo la levanta). */
  cabeza: number;
  /** El párpado (0 abierto, 1 cerrado) y la pupila (corrimiento). */
  parpado: number;
  pupila: readonly [number, number];
  /** La lengua afuera (0 a 1). */
  lengua: number;
  /** Las orejas (grados; negativo las para). */
  orejas: readonly [number, number];
  /** El pompón, que se le mueve solo (grados). */
  cola: number;
  /** La guinda: cuánto del camino a la boca hizo (0 a 1) y cuánto se ve. */
  guinda: number;
  guindaSe: number;
  /** La piedra que rueda: la fase (0 a 1). Fuera de eso no se ve. */
  piedra: number;
}

/** La pose quieta, la del HTML: tendida a la Bartola, con el ojo cerrado y la lengua afuera. */
export const QUIETO: Momento = {
  respira: 0,
  tiesa: 0,
  tiembla: 0,
  patea: [0, 0],
  manotea: 0,
  cabeza: 0,
  parpado: 1,
  pupila: [0, 0],
  lengua: 0.7,
  orejas: [0, 0],
  cola: 0,
  guinda: 0,
  guindaSe: 1,
  piedra: 0,
};

/**
 * *"¡Caras de liebre! ¿De liebre muerta?"*: más muerta que nunca. Las cuatro patas derechas para arriba, la lengua
 * afuera del todo, y un ojo a medio abrir, que mira si la siguen mirando. Es el toque quieto y el retrato.
 */
export const TIESA: Momento = {
  ...QUIETO,
  tiesa: 1,
  parpado: 0.5,
  pupila: [-2.4, 1],
  lengua: 1,
  orejas: [-8, -4],
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [LIEBRE.x + x * LIEBRE.escala, LIEBRE.piso + y * LIEBRE.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = LIEBRE_ARMADO;
  const [px, py] = A.panza;
  const [nx, ny] = A.cuello;
  const [bx, by] = A.boca;
  const [kx, ky] = A.cola;
  const [gx, gy] = A.guinda;
  const hincha = 1 + 0.025 * m.respira;
  const transform: Record<string, string> = {
    entero: `translate(${LIEBRE.x} ${LIEBRE.piso}) scale(${LIEBRE.escala})`,
    cuerpo: `translate(${n2(m.tiembla)} 0)`,
    panza: `translate(${px} ${py}) scale(1 ${n2(hincha)}) translate(${-px} ${-py})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    lengua: `translate(${bx} ${by}) scale(${n2(0.25 + 0.75 * m.lengua)}) translate(${-bx} ${-by})`,
    cola: `rotate(${n2(m.cola)} ${kx + 10} ${ky})`,
    // La guinda va de su lugar en el montón a la boca, con la cabeza levantada.
    guinda: `translate(${n2((bx - 6 - gx) * m.guinda)} ${n2((by - 22 - gy) * m.guinda - 16 * Math.sin(m.guinda * Math.PI))})`,
    piedra: `translate(${n2(mezclar(A.piedra.desde, A.piedra.hasta, m.piedra))} ${n2(A.piedra.y - 5 * Math.abs(Math.sin(m.piedra * Math.PI * 5)))}) rotate(${n2(900 * m.piedra)})`,
  };
  for (const n of [0, 1] as const) {
    const [cx, cy] = A.caderas[n];
    const [hx, hy] = A.hombros[n];
    const [ox, oy] = A.orejas[n];
    transform[`pata-tras-${n + 1}`] = `rotate(${n2(mezclar(FLOJAS.traseras[n], n ? -5 : 3, m.tiesa) + m.patea[n])} ${cx} ${cy})`;
    // La de adelante de cerca es la que manotea la guinda.
    transform[`pata-del-${n + 1}`] = `rotate(${n2(mezclar(FLOJAS.delanteras[n], n ? -8 : 4, m.tiesa) + (n ? 0 : m.manotea))} ${hx} ${hy})`;
    transform[`oreja-${n + 1}`] = `rotate(${n2(m.orejas[n])} ${ox} ${oy})`;
  }
  const { centro: [ex, ey], radio: [, ry] } = A.ojo;
  const top = ey - ry - 0.6;
  transform.parpado = `translate(${ex} ${top}) scale(1 ${n2(Math.max(0.02, m.parpado))}) translate(${-ex} ${-top})`;
  transform.pupila = `translate(${n2(m.pupila[0])} ${n2(m.pupila[1])})`;
  const enCamino = m.piedra > 0.001 && m.piedra < 0.999;
  const opacity: Record<string, string> = {
    guinda: n2(m.guindaSe),
    piedra: enCamino ? n2(Math.min(1, 8 * Math.sin(m.piedra * Math.PI))) : '0',
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de las patas, en el recinto. */
export const VERSO: Punto = alRecinto([10, -150]);
