/**
 * Los números del pichón (`D-73`, vigesimoquinta vuelta): dónde está parado en el alféizar de la ventana de la
 * prisión, cómo está armado y cómo se pone. Los lee el dibujo (`arte-pichon.ts`), para la pose quieta del HTML
 * y para el retrato, y la conducta (`scripts/bestiario/pichon.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del pichón**: el (0, 0) es el alféizar entre las dos patas; arriba es negativo y mira a la
 *   **izquierda**, para el medio de la ventana. Está dibujado al doble, y la escena lo achica con `PICHON.escala`.
 * - **El del recinto** (la prisión): abajo a la derecha del hueco de la ventana (`PRISION.ventana`), entre los
 *   dos últimos barrotes, del lado de la calle. El ojo queda donde estaban sus ojos en lo oscuro
 *   (`VECINOS_DE_LA_PRISION`). Lo que va delante de la reja (las plumas que vuelan, el fogonazo y los agujeros
 *   de bala en la piedra del marco) usa las mismas coordenadas, en la capa de la figura.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/**
 * Dónde está parado, y lo que mide: unas 70 unidades de alto, que se vea y se toque en un teléfono. El ojo queda
 * entre dos barrotes; uno le pasa por el medio del cuerpo y otro por la cola, que para eso está preso.
 */
export const PICHON = { x: 518, piso: 340, escala: 1.45 } as const;

/** Cómo está armado, en las coordenadas del pichón. La pata 1 es la de atrás; la 2, la vendada, la de adelante. */
export const PICHON_ARMADO = {
  /** Las caderas, de donde gira cada pata, y los pies. */
  caderas: [[8, -12], [-2, -12]] as readonly [Punto, Punto],
  pies: [[10, 0], [-4, 0]] as readonly [Punto, Punto],
  /** El medio del cuerpo: de acá respira, se esponja y se sacude. */
  panza: [8, -18] as Punto,
  /** El hombro del ala, la base de la cola y el cuello, de donde gira la cabeza. */
  hombro: [2, -26] as Punto,
  cola: [28, -16] as Punto,
  cuello: [-2, -26] as Punto,
  /** El medio de la cabeza: de acá se da vuelta para mirar con el otro ojo. */
  cabeza: [-5, -36] as Punto,
  ojo: [-8, -35] as Punto,
  /** La punta del pico. */
  pico: [-22, -32] as Punto,
  /** El canto del alféizar: lo que baja de acá no se ve, queda del lado de la calle. */
  canto: 2,
  /** El borde de abajo del canto, que es el del alféizar de la ventana (`PRISION.ventana.abajo` + 14). */
  pie: 5.5,
  /** La lata con agujeros y la pizarrita de los palitos, apoyadas en el alféizar. */
  lata: [-64, 0] as Punto,
  pizarra: [-38, 0] as Punto,
  /**
   * Dónde va el palito nuevo de cada tiro, en el renglón de abajo de la pizarrita, y cuánto se tuerce: cuatro
   * parados, el quinto los cruza, y el sexto empieza la otra tanda.
   */
  rayitas: [[-46, -8, 4], [-44, -8, -3], [-42, -8, 2], [-40, -8, -2], [-43, -8, 62], [-35, -8, 3]] as ReadonlyArray<readonly [number, number, number]>,
  /** Los agujeros nuevos, en el orden en que los abre cada tiro: en la jamba de piedra y en el canto del alféizar. */
  agujeros: [[46, -28], [-24, 3.6], [45, -54], [8, 3.8], [47, -80], [46, -104]] as readonly Punto[],
  /** De dónde sale el fogonazo: abajo, del lado del pasillo, que es el de quien mira. */
  fogonazo: [-60, 70] as Punto,
} as const;

/** Cuántos agujeros y palitos nuevos entran antes de que la pared y la pizarra vuelvan a empezar. */
export const TIROS = 6;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Corrido por el alféizar (unidades del pichón; negativo es para la izquierda) y en el aire (arriba es positivo). */
  paso: number;
  salto: number;
  /** Tirado abajo del alféizar, del lado de la calle (0 a 1: con 1 no se le ve nada). */
  baja: number;
  /** Agachado, con las patas dobladas y el cuerpo contra la piedra (0 a 1). */
  agacha: number;
  /** La respiración (−1 a 1), y cuánto se esponja el plumón (0 a 1). */
  respira: number;
  esponja: number;
  /** Cuánto se inclina el cuerpo entero sobre las patas (grados): adelante para picotear, de lado al sacudirse. */
  cuerpo: number;
  /** Cuánto gira la cabeza en el cuello (grados; negativo baja el pico) y cuánto va y viene adelante. */
  cabeza: number;
  cabeceo: number;
  /** Para qué lado mira: 1 al medio de la ventana, −1 al otro lado, con el otro ojo. En el medio, de frente. */
  giro: number;
  /** El párpado (0 abierto, 1 cerrado). */
  parpado: number;
  /** El ala plegada (grados), las dos alas abiertas del salto (0 a 1) y la cola (grados). */
  ala: number;
  alas: number;
  cola: number;
  /** Cuánto gira cada pata en su cadera (grados): la 2 es la vendada, con la que se rasca. */
  patas: readonly [number, number];
  /** Las plumas que vuelan del tiro: por dónde van (0 no hay, 1 ya cayeron). */
  plumas: number;
  /** El fogonazo (0 a 1), y las esquirlas del agujero nuevo (por dónde van: 0 no hay, 1 ya cayeron). */
  fogonazo: number;
  esquirlas: number;
  /** Cuántos agujeros nuevos hay en la piedra y cuántos palitos nuevos en la pizarra (0 a `TIROS`; la parte que sobra es el que está apareciendo). */
  agujeros: number;
  rayitas: number;
}

/** La pose quieta, la del HTML: parado en el alféizar, mirando para el medio de la ventana, sin tiros nuevos. */
export const QUIETO: Momento = {
  paso: 0,
  salto: 0,
  baja: 0,
  agacha: 0,
  respira: 0,
  esponja: 0,
  cuerpo: 0,
  cabeza: 0,
  cabeceo: 0,
  giro: 1,
  parpado: 0,
  ala: 0,
  alas: 0,
  cola: 0,
  patas: [0, 0],
  plumas: 0,
  fogonazo: 0,
  esquirlas: 0,
  agujeros: 0,
  rayitas: 0,
};

/**
 * *"Practicamos tiro al pichón"*: agachado contra la piedra, con el plumón parado y la cabeza metida, mientras le
 * vuelan las plumas. Es el toque quieto y el retrato.
 */
export const AGACHADO: Momento = {
  ...QUIETO,
  agacha: 1,
  esponja: 1,
  cabeza: -10,
  cola: -8,
  plumas: 0.32,
};

/** Lo que baja para tirarse del lado de la calle: con esto no se le ve ni el plumón de la cabeza. */
export const HONDO = 64;

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [PICHON.x + x * PICHON.escala, PICHON.piso + y * PICHON.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const entre01 = (v: number): number => Math.min(1, Math.max(0, v));

/**
 * Por dónde va cada pluma suelta del tiro, a los `p` de su vuelo: salen del cuerpo para todos lados, frenan en el
 * aire y caen hamacándose. Las tres primeras son plumas del ala; las otras tres, copos de plumón.
 */
export const PLUMAS: ReadonlyArray<{ v: Punto; giro: number }> = [
  { v: [-46, -54], giro: 160 },
  { v: [40, -70], giro: -220 },
  { v: [-12, -86], giro: 300 },
  { v: [-64, -24], giro: -140 },
  { v: [26, -40], giro: 200 },
  { v: [6, -64], giro: -260 },
];

export function pluma(i: number, p: number): { x: number; y: number; giro: number; opacidad: number } {
  const { v, giro } = PLUMAS[i]!;
  const [x0, y0] = PICHON_ARMADO.panza;
  const t = p * 2.6;
  const frena = 1 - Math.exp(-3.2 * t);
  const cae = i < 3 ? 22 : 14;
  return {
    x: x0 + v[0] * frena + 6 * Math.sin(t * 3.4 + i) * frena,
    y: y0 + v[1] * frena + cae * t * t * 0.5 + 10 * t,
    giro: giro * frena + 30 * Math.sin(t * 2.8 + i),
    opacidad: p <= 0 || p >= 1 ? 0 : entre01((1 - p) * 5),
  };
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = PICHON_ARMADO;
  const [px, py] = A.panza;
  const [ax, ay] = A.hombro;
  const [cx, cy] = A.cola;
  const [nx, ny] = A.cuello;
  const [hx] = A.cabeza;
  // Respira ligero; esponjado se infla, y agachado se aplasta contra la piedra.
  const ancho = 1 + 0.015 * m.respira + 0.1 * m.esponja + 0.06 * m.agacha;
  const alto = 1 + 0.03 * m.respira + 0.12 * m.esponja - 0.08 * m.agacha;
  // La vuelta de la cabeza: de perfil a perfil pasando por de frente, nunca a cero del todo.
  const g = Math.sign(m.giro || 1) * Math.max(0.12, Math.abs(m.giro));
  const entero = `translate(${PICHON.x} ${PICHON.piso}) scale(${PICHON.escala})`;
  const transform: Record<string, string> = {
    entero,
    delante: entero,
    pichon: `translate(${n2(m.paso)} ${n2(-m.salto + m.baja * HONDO)})`,
    cuerpo: `translate(0 ${n2(m.agacha * 8)}) rotate(${n2(m.cuerpo)} 4 -6)`,
    bulto: `translate(${px} ${py}) scale(${n2(ancho)} ${n2(alto)}) translate(${-px} ${-py})`,
    plumon: `translate(${px} ${py}) scale(${n2(0.9 + 0.12 * m.esponja)}) translate(${-px} ${-py})`,
    ala: `rotate(${n2(m.ala)} ${ax} ${ay})`,
    alas: `translate(${ax} ${ay}) scale(1 ${n2(0.5 + 0.5 * m.alas)}) translate(${-ax} ${-ay})`,
    cola: `rotate(${n2(m.cola)} ${cx} ${cy})`,
    cabeza: `translate(${n2(m.cabeceo)} ${n2(m.agacha * 4)}) rotate(${n2(m.cabeza)} ${nx} ${ny}) translate(${hx} 0) scale(${n2(g)} 1) translate(${-hx} 0)`,
    fogonazo: `translate(${A.fogonazo[0]} ${A.fogonazo[1]}) scale(${n2(0.4 + 0.5 * m.fogonazo)})`,
  };
  for (const n of [0, 1] as const) {
    const [hx2, hy2] = A.caderas[n];
    const [fx, fy] = A.pies[n];
    // Agachado, la pata se dobla: se acorta desde el pie.
    transform[`pata-${n + 1}`] = `translate(${fx} ${fy}) scale(1 ${n2(1 - 0.55 * m.agacha)}) translate(${-fx} ${-fy}) rotate(${n2(m.patas[n])} ${hx2} ${hy2})`;
  }
  const opacity: Record<string, string> = {
    parpado: n2(m.parpado),
    plumon: n2(m.esponja),
    ala: n2(1 - m.alas),
    alas: n2(m.alas),
    fogonazo: n2(m.fogonazo),
  };
  for (let i = 0; i < PLUMAS.length; i++) {
    const q = pluma(i, m.plumas);
    transform[`pluma-${i + 1}`] = `translate(${n2(q.x)} ${n2(q.y)}) rotate(${n2(q.giro)})`;
    opacity[`pluma-${i + 1}`] = n2(q.opacidad);
  }
  // Las esquirlas saltan del último agujero que abrió el tiro.
  const ultimo = A.agujeros[Math.max(0, Math.ceil(m.agujeros) - 1)]!;
  transform.esquirlas = `translate(${ultimo[0]} ${ultimo[1]}) scale(${n2(0.4 + 0.6 * m.esquirlas)})`;
  opacity.esquirlas = n2(m.esquirlas <= 0 || m.esquirlas >= 1 ? 0 : entre01((1 - m.esquirlas) * 1.6));
  for (let i = 0; i < TIROS; i++) {
    opacity[`agujero-${i + 1}`] = n2(entre01(m.agujeros - i));
    opacity[`rayita-${i + 1}`] = n2(entre01(m.rayitas - i));
  }
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la cabeza, en el recinto. */
export const VERSO: Punto = alRecinto([-6, -72]);
