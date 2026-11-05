/**
 * Los números del joven lobo (`D-73`, vigesimosexta vuelta): dónde está sentado en la cima del volcán del
 * monte, cómo está armado y cómo se pone. Los lee el dibujo (`arte-joven.ts`), para la pose quieta del HTML y
 * para el retrato, y la conducta (`scripts/bestiario/joven.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del lobo**: el (0, 0) es el borde del cráter debajo del ojo; arriba es negativo y mira a la
 *   **izquierda**, para el lado del monte y de la pastura. Está dibujado al doble, y la escena lo achica con
 *   `JOVEN.escala`.
 * - **El del recinto** (900 × 640): arriba a la derecha del monte, entre las tiras, donde estaban sus ojos. El
 *   volcán baja desde el cráter hasta meterse entre las tiras. En el camino el monte es un tramo largo y el marco
 *   lo corre entero adonde estaban sus ojos, y lo baja hasta el piso (`bajan` en `camino.ts`).
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde está sentado, y lo que mide. */
export const JOVEN = { x: 846, piso: 230, escala: 0.5 } as const;

/** Cómo está armado, en sus coordenadas. La pata 1 es la de lejos. */
export const JOVEN_ARMADO = {
  /** La cadera, en el anca: de acá gira el cuerpo cuando se yergue, y la pata de atrás cuando se rasca. */
  cadera: [66, -30] as Punto,
  /** El medio del pecho, donde arde la brasa. */
  brasa: [-4, -72] as Punto,
  /** De dónde salen las llamas del lomo. */
  llamas: [30, -84] as Punto,
  /** El cogote: de acá gira la cabeza. */
  cuello: [-2, -92] as Punto,
  /** El ojo, y lo que mide. */
  ojo: { centro: [0, -128] as Punto, radio: [8, 7] as Punto },
  /** De dónde gira la quijada, y la punta del hocico. */
  quijada: [-30, -104] as Punto,
  hocico: [-64, -120] as Punto,
  /** Las bases de las orejas: la 1 es la de atrás. */
  orejas: [[18, -146], [2, -150]] as readonly [Punto, Punto],
  /** Los hombros de las patas de adelante. */
  hombros: [[2, -64], [-8, -62]] as readonly [Punto, Punto],
  /** De dónde sale la cola, y la punta que humea. */
  cola: [94, -22] as Punto,
  puntaCola: [128, -78] as Punto,
  /** El cráter: el medio de la lava, detrás del lobo. */
  crater: [50, -4] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** La respiración (−1 a 1). */
  respira: number;
  /** Cuánto se yergue sobre las patas (0 sentado, 1 parado de pecho). */
  yergue: number;
  /** Cuánto gira la cabeza en el cogote (grados; negativo es hacia el cielo). */
  cabeza: number;
  /** La quijada (0 cerrada, 1 abierta de aullar). */
  quijada: number;
  /** Las orejas (grados, cada una). */
  orejas: readonly [number, number];
  /** El párpado (0 abierto, 1 cerrado). */
  parpado: number;
  /** La cola (grados) y el humo de su punta (fase 0 a 1, y cuánto se ve). */
  cola: number;
  colaHumo: number;
  colaHumoSe: number;
  /** La pata de atrás que se rasca (grados). */
  rasca: number;
  /** La brasa del pecho (0 apagada, 1 al rojo), las llamas del lomo (0 a 1, lo que crecen) y cuánto se ven. */
  brasa: number;
  llamas: number;
  llamasSe: number;
  /** La lava del cráter (0 a 1) y el humo que sube (fase 0 a 1). */
  lava: number;
  humo: number;
  /** Las chispas de la erupción: fase (0 abajo, 1 arriba) y cuánto se ven. */
  chispas: number;
  chispasSe: number;
  /** El vaho del aullido: fase (0 a 1) y cuánto se ve. */
  aullido: number;
  aullidoSe: number;
  /** El humo con forma de corazón: fase y cuánto se ve. */
  corazon: number;
  corazonSe: number;
}

/** La pose quieta, la del HTML: sentado en el cráter, mirando al monte, con la brasa a medio arder. */
export const QUIETO: Momento = {
  respira: 0,
  yergue: 0,
  cabeza: 0,
  quijada: 0.08,
  orejas: [0, 0],
  parpado: 0,
  cola: 0,
  colaHumo: 0.4,
  colaHumoSe: 0.6,
  rasca: 0,
  brasa: 0.5,
  llamas: 0.5,
  llamasSe: 0.8,
  lava: 0.5,
  humo: 0.3,
  chispas: 0,
  chispasSe: 0,
  aullido: 0,
  aullidoSe: 0,
  corazon: 0,
  corazonSe: 0,
};

/**
 * *"Y el joven lobo quemándose de amor"*: aúlla con la cabeza al cielo, la quijada abierta, la brasa al rojo y
 * las llamas altas, y del aullido sube un humo con forma de corazón. Es el toque quieto y el retrato.
 */
export const ARDE: Momento = {
  ...QUIETO,
  yergue: 0.7,
  cabeza: -34,
  quijada: 1,
  orejas: [-18, -22],
  parpado: 0.85,
  cola: 14,
  colaHumoSe: 1,
  brasa: 1,
  llamas: 1,
  llamasSe: 1,
  lava: 1,
  chispas: 0.4,
  chispasSe: 1,
  aullido: 0.5,
  aullidoSe: 1,
  corazon: 0.5,
  corazonSe: 1,
};

/** Cuánto gira el cuerpo en la cadera cuando se yergue del todo, y cuánto abre la quijada a pleno (grados). */
export const YERGUE = -14;
export const ABRE = 28;

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [JOVEN.x + x * JOVEN.escala, JOVEN.piso + y * JOVEN.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = JOVEN_ARMADO;
  const [cx, cy] = A.cadera;
  const [nx, ny] = A.cuello;
  const [qx, qy] = A.quijada;
  const [kx, ky] = A.cola;
  const [px, py] = A.puntaCola;
  const [bx, by] = A.brasa;
  const [lx, ly] = A.llamas;
  const [vx, vy] = A.crater;
  const [hx, hy] = A.hocico;
  // Respira desde el pecho: el cuerpo se hincha apenas.
  const pecho = 1 + 0.025 * m.respira;
  const transform: Record<string, string> = {
    entero: `translate(${JOVEN.x} ${JOVEN.piso}) scale(${JOVEN.escala})`,
    cuerpo: `rotate(${n2(YERGUE * m.yergue)} ${cx} ${cy}) translate(${bx} ${by}) scale(${n2(pecho)}) translate(${-bx} ${-by})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    quijada: `rotate(${n2(ABRE * m.quijada)} ${qx} ${qy})`,
    cola: `rotate(${n2(m.cola)} ${kx} ${ky})`,
    'cola-humo': `translate(${n2(-6 * m.colaHumo)} ${n2(-26 * m.colaHumo)}) translate(${px} ${py}) scale(${n2(0.6 + 0.7 * m.colaHumo)}) translate(${-px} ${-py})`,
    rasca: `rotate(${n2(m.rasca)} ${cx} ${cy})`,
    llamas: `translate(${lx} ${ly}) scale(${n2(0.7 + 0.6 * m.llamas)} ${n2(0.5 + 0.9 * m.llamas)}) translate(${-lx} ${-ly})`,
    humo: `translate(${n2(8 * Math.sin(m.humo * Math.PI * 2))} ${n2(-70 * m.humo)}) translate(${vx} ${vy}) scale(${n2(0.6 + 0.9 * m.humo)}) translate(${-vx} ${-vy})`,
    chispas: `translate(0 ${n2(-90 * m.chispas)}) translate(${vx} ${vy}) scale(${n2(0.5 + m.chispas)}) translate(${-vx} ${-vy})`,
    aullido: `translate(${n2(-30 * m.aullido)} ${n2(-50 * m.aullido)}) translate(${hx} ${hy}) scale(${n2(0.4 + 1.2 * m.aullido)}) translate(${-hx} ${-hy})`,
    corazon: `translate(${n2(-16 * m.corazon)} ${n2(-110 * m.corazon)}) translate(${hx} ${hy}) scale(${n2(0.3 + 1.1 * m.corazon)}) translate(${-hx} ${-hy})`,
  };
  for (const n of [0, 1] as const) {
    const [ox, oy] = A.orejas[n];
    transform[`oreja-${n + 1}`] = `rotate(${n2(m.orejas[n])} ${ox} ${oy})`;
    const [sx, sy] = A.hombros[n];
    // Erguido, las patas de adelante se enderezan desde el hombro.
    transform[`pata-${n + 1}`] = `rotate(${n2(-YERGUE * m.yergue * 0.8)} ${sx} ${sy})`;
  }
  const { centro: [ex, ey], radio: [, ry] } = A.ojo;
  const top = ey - ry - 0.6;
  transform.parpado = `translate(${ex} ${top}) scale(1 ${n2(Math.max(0.02, m.parpado))}) translate(${-ex} ${-top})`;
  const humea = (fase: number): number => Math.sin(Math.min(1, Math.max(0, fase)) * Math.PI);
  const opacity: Record<string, string> = {
    brasa: n2(0.3 + 0.7 * m.brasa),
    llamas: n2(m.llamasSe),
    lava: n2(0.4 + 0.6 * m.lava),
    humo: n2(0.75 * humea(m.humo)),
    'cola-humo': n2(m.colaHumoSe * humea(m.colaHumo)),
    chispas: n2(m.chispasSe * humea(m.chispas)),
    aullido: n2(m.aullidoSe * humea(m.aullido)),
    corazon: n2(m.corazonSe * humea(m.corazon)),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de las orejas, en el recinto. */
export const VERSO: Punto = alRecinto([-10, -190]);
