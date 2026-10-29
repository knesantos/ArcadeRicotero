/**
 * Los números del ratón (`D-73`, vigesimocuarta vuelta): dónde se agazapa en la canaleta, cómo está armado y
 * cómo se pone. Los lee el dibujo (`arte-raton.ts`), para la pose quieta del HTML y para el retrato, y la
 * conducta (`scripts/bestiario/raton.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del ratón**: el (0, 0) es el fondo de la canaleta debajo de la panza; arriba es negativo y mira a la
 *   **izquierda**, para el lado del gato matón. Está dibujado al doble, y la escena lo achica con `RATON.escala`.
 * - **El del recinto** (los techos, 1500 × 640): en la canaleta que corre por delante de la chapa del canto,
 *   delante de la cara del gato y antes de donde camina el Atila. Los ojos quedan donde estaban sus ojos en lo
 *   oscuro (`VECINOS_DEL_BALDIO`).
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde se agazapa, y lo que mide. */
export const RATON = { x: 392, piso: 300, escala: 0.5 } as const;

/** Cómo está armado, en las coordenadas del ratón. El brazo 1 es el de atrás; el 2, el de adelante. */
export const RATON_ARMADO = {
  /** El talón de las patas de atrás: de acá se para en dos patas. */
  talon: [30, 0] as Punto,
  /** El medio del lomo: de acá respira y se aplasta. */
  lomo: [16, -2] as Punto,
  /** De dónde sale la cola. */
  cola: [50, -14] as Punto,
  hombros: [[-8, -24], [-14, -22]] as readonly [Punto, Punto],
  manos: [[-22, -2], [-30, -1]] as readonly [Punto, Punto],
  /** El cuello: de acá gira la cabeza. */
  cuello: [-14, -30] as Punto,
  ojo: [-40, -38] as Punto,
  /** La base de la oreja de adelante, la mordida. */
  oreja: [-24, -46] as Punto,
  /** La base del hocico, que olfatea solo, y la nariz, en la punta. */
  hocico: [-52, -31] as Punto,
  nariz: [-70, -31] as Punto,
  /** De donde salen los bigotes. */
  bigotes: [-62, -28] as Punto,
  dientes: [-62, -21] as Punto,
  /** El queso de rallar robado, apoyado en el borde de la canaleta: de acá tiembla cuando lo roe. */
  queso: [-74, -6] as Punto,
  /** Hasta dónde lo tapa el labio de la canaleta: lo que baja de acá no se ve. */
  labio: 18,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Parado en dos patas (0 en cuatro, 1 parado del todo). */
  pose: number;
  /** Aplastado contra la canaleta, del susto (0 a 1). La respiración (−1 a 1). */
  agacha: number;
  respira: number;
  /** Dónde está: corrido adentro de la canaleta, para esconderse (unidades del ratón). */
  huida: readonly [number, number];
  /** Cuánto gira la cabeza en el cuello, la oreja, el hocico y la cola (grados). */
  cabeza: number;
  oreja: number;
  hocico: number;
  cola: number;
  /** Lo que olfatea: el hocico se arruga y la nariz late (0 a 1). */
  olfato: number;
  /** Los bigotes de arriba y los de abajo, cada mazo por su lado (grados). */
  bigotes: readonly [number, number];
  /** Cuánto gira cada brazo en su hombro (grados). */
  brazos: readonly [number, number];
  /** El párpado (0 abierto, 1 cerrado), el ojo del espanto, los dientes afuera y el pelo erizado (0 a 1). */
  parpado: number;
  espanto: number;
  dientes: number;
  erizo: number;
  /** El queso, que tiembla cuando lo roe (grados). */
  queso: number;
  /** El olor del gato que le llega a la nariz: cuánto se ve y por dónde viene (0 a 1). */
  olor: number;
  viene: number;
}

/** La pose quieta, la del HTML: en cuatro patas en la canaleta, al lado del queso, con el hocico al gato. */
export const QUIETO: Momento = {
  pose: 0,
  agacha: 0,
  respira: 0,
  huida: [0, 0],
  cabeza: 4,
  oreja: 0,
  hocico: 0,
  cola: 0,
  olfato: 0,
  bigotes: [0, 0],
  brazos: [0, 0],
  parpado: 0,
  espanto: 0,
  dientes: 0,
  erizo: 0,
  queso: 0,
  olor: 0,
  viene: 0,
};

/**
 * *"Quiero verte oler como el ratón"*: parado en dos patas, con el hocico estirado para el lado del gato, los
 * bigotes abiertos, el pelo de punta y el ojo del espanto, mientras le llega el olor. Es el toque quieto y el
 * retrato.
 */
export const HUELE: Momento = {
  ...QUIETO,
  pose: 0.62,
  cabeza: 10,
  oreja: -14,
  hocico: 8,
  cola: -16,
  olfato: 1,
  bigotes: [-14, 12],
  brazos: [62, 52],
  espanto: 1,
  erizo: 1,
  olor: 1,
  viene: 1,
};

/** Cuánto gira el cuerpo entero, parado del todo, alrededor del talón. */
export const PARADO = 58;
/** Lo que baja para meterse en la canaleta: con esto no se le ve ni la punta de las orejas. */
export const HONDO = 74;

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [RATON.x + x * RATON.escala, RATON.piso + y * RATON.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = RATON_ARMADO;
  const [tx, ty] = A.talon;
  const [lx, ly] = A.lomo;
  const [cx, cy] = A.cola;
  const [nx, ny] = A.cuello;
  const [ox, oy] = A.oreja;
  const [hx, hy] = A.hocico;
  const [bx, by] = A.bigotes;
  const [qx, qy] = A.queso;
  // Respira ligero, como respira un ratón; aplastado se achata y se alarga.
  const alto = 1 + 0.035 * m.respira - 0.2 * m.agacha;
  const largo = 1 + 0.02 * m.respira + 0.08 * m.agacha;
  // Parado, la cabeza se endereza sola: no mira al cielo, mira adelante.
  const cabeza = m.cabeza - m.pose * (PARADO - 6);
  const arruga = 1 - 0.1 * m.olfato;
  const transform: Record<string, string> = {
    entero: `translate(${RATON.x} ${RATON.piso}) scale(${RATON.escala})`,
    huida: `translate(${n2(m.huida[0])} ${n2(m.huida[1])})`,
    pose: `rotate(${n2(m.pose * PARADO)} ${tx} ${ty})`,
    cuerpo: `translate(${lx} ${ly}) scale(${n2(largo)} ${n2(alto)}) translate(${-lx} ${-ly})`,
    erizo: `translate(${lx} ${ly}) scale(${n2(largo)} ${n2(alto)}) translate(${-lx} ${-ly})`,
    // Parado, la cola no se levanta con el cuerpo: se queda apoyada en el borde de la canaleta.
    cola: `rotate(${n2(m.cola - m.pose * PARADO * 0.8)} ${cx} ${cy})`,
    cabeza: `translate(0 ${n2(m.agacha * 9)}) rotate(${n2(cabeza)} ${nx} ${ny})`,
    oreja: `rotate(${n2(m.oreja)} ${ox} ${oy})`,
    hocico: `rotate(${n2(m.hocico)} ${hx} ${hy}) translate(${hx} ${hy}) scale(${n2(arruga)} ${n2(1 + 0.06 * m.olfato)}) translate(${-hx} ${-hy})`,
    'bigotes-1': `rotate(${n2(m.bigotes[0])} ${bx} ${by})`,
    'bigotes-2': `rotate(${n2(m.bigotes[1])} ${bx} ${by})`,
    queso: `rotate(${n2(m.queso)} ${qx} ${qy})`,
    olor: `translate(${n2(-30 * (1 - m.viene))} ${n2(-14 * (1 - m.viene))})`,
  };
  for (const n of [0, 1] as const) {
    const [sx, sy] = A.hombros[n];
    transform[`brazo-${n + 1}`] = `translate(0 ${n2(m.agacha * 5)}) rotate(${n2(m.brazos[n])} ${sx} ${sy})`;
  }
  const opacity: Record<string, string> = {
    parpado: n2(m.parpado),
    espanto: n2(m.espanto),
    dientes: n2(m.dientes),
    erizo: n2(m.erizo),
    olor: n2(m.olor),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de las orejas, en el recinto. */
export const VERSO: Punto = alRecinto([-24, -104]);
