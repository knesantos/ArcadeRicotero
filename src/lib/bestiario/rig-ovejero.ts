/**
 * Los números del ovejero (`D-73`, vigesimosexta vuelta): dónde descansa en el borde de la pastura, cómo está
 * armado y cómo se pone. Los lee el dibujo (`arte-ovejero.ts`), para la pose quieta del HTML y para el retrato, y
 * la conducta (`scripts/bestiario/ovejero.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del perro**: el (0, 0) es el piso debajo del medio de la panza **parado**; arriba es negativo y mira a la
 *   **derecha**, para el lado del cordero. Echado, el cuerpo baja `CAIDA` y las patas se doblan. Está dibujado al
 *   doble, y la escena lo achica con `OVEJERO.escala`.
 * - **El del recinto** (900 × 640, el del monte y la pastura): en el borde de la izquierda del claro, sobre su manto,
 *   donde estaban sus ojos. En el camino el claro va corrido entero (`claro.dx` en `camino.ts`) y él con el claro.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde descansa, y lo que mide. */
export const OVEJERO = { x: 116, piso: 438, escala: 0.5 } as const;

/** Lo que baja el cuerpo echado, en unidades del perro. */
export const CAIDA = 54;

/** Cómo está armado, parado, en sus coordenadas. El 1 es la pata de lejos. */
export const OVEJERO_ARMADO = {
  /** El medio del lomo: de acá respira. */
  lomo: [-10, -92] as Punto,
  /** Los hombros y las caderas, de cerca y de lejos: de acá giran las patas. */
  hombros: [[40, -84], [30, -86]] as readonly [Punto, Punto],
  caderas: [[-56, -84], [-46, -86]] as readonly [Punto, Punto],
  /** El cogote: de acá gira la cabeza. */
  cuello: [58, -104] as Punto,
  /** De dónde sale la cola. */
  cola: [-80, -98] as Punto,
  /** La bisagra de la quijada, y la punta del hocico. */
  quijada: [92, -112] as Punto,
  hocico: [136, -118] as Punto,
  /** El ojo de este lado, y lo que mide. */
  ojo: { centro: [104, -134] as Punto, radio: [7, 6] as Punto },
  /** Las bases de las orejas: la 1 es la de atrás. */
  orejas: [[76, -150], [92, -152]] as readonly [Punto, Punto],
  /** El plato de lata con los restos, adelante, en el piso: de acá se corre cuando lo aparta o lo patea. */
  plato: [170, -4] as Punto,
  /** Hasta dónde se adelanta el cuerpo cuando ladra, en sus unidades. */
  arremete: 18,
} as const;

/** Lo que se doblan las patas echado, en grados: las de adelante estiradas para adelante, las de atrás debajo. */
export const DOBLADA = { delantera: -82, trasera: -76 } as const;
/** Cuánto abre la quijada a pleno, en grados. */
export const ABRE = 30;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Echado (1) o parado (0), y la respiración (−1 a 1). */
  echado: number;
  respira: number;
  /** Lo que se adelanta el cuerpo (unidades) y el temblor del gruñido (unidades). */
  arremete: number;
  tiembla: number;
  /** Cuánto gira la cabeza en el cogote (grados; negativo levanta el hocico). */
  cabeza: number;
  /** La quijada (0 cerrada, 1 abierta), la lengua afuera (0 a 1) y el belfo levantado con los dientes (0 a 1). */
  quijada: number;
  lengua: number;
  belfo: number;
  /** Las orejas (grados; negativo las echa para atrás). */
  orejas: readonly [number, number];
  /** El párpado (0 abierto, 1 cerrado) y la pupila (corrimiento, para mirar al cordero). */
  parpado: number;
  pupila: readonly [number, number];
  /** La cola (grados) y el pelo erizado del lomo (0 a 1). */
  cola: number;
  erizo: number;
  /** Las patas de atrás y de adelante de cerca, lo que giran de más (grados): para rascarse y para patear. */
  rasca: number;
  patea: number;
  /** El plato: dónde está (unidades desde su lugar) y cuánto giró; los huesos que vuelan (fase 0 a 1 y cuánto se ven). */
  plato: readonly [number, number, number];
  huesos: number;
  huesosSe: number;
}

/** La pose quieta, la del HTML: echado en el manto, con la cabeza en alto y el ojo puesto en el cordero. */
export const QUIETO: Momento = {
  echado: 1,
  respira: 0,
  arremete: 0,
  tiembla: 0,
  cabeza: 8,
  quijada: 0.1,
  lengua: 0,
  belfo: 0,
  orejas: [0, 0],
  parpado: 0,
  pupila: [2, 0],
  cola: 0,
  erizo: 0,
  rasca: 0,
  patea: 0,
  plato: [0, 0, 0],
  huesos: 0,
  huesosSe: 0,
};

/**
 * *"Tu perro, un perro cruel"*: parado sobre el manto, el pelo de punta, las orejas atrás, el belfo levantado y
 * los dientes afuera, gruñendo, con el plato pateado y los huesos en el aire. Es el toque quieto y el retrato.
 */
export const CRUEL: Momento = {
  ...QUIETO,
  echado: 0,
  arremete: 10,
  cabeza: 4,
  quijada: 0.45,
  belfo: 1,
  orejas: [-34, -38],
  parpado: 0.3,
  pupila: [3, -1],
  cola: 24,
  erizo: 1,
  plato: [44, 2, 28],
  huesos: 0.5,
  huesosSe: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [OVEJERO.x + x * OVEJERO.escala, OVEJERO.piso + y * OVEJERO.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = OVEJERO_ARMADO;
  const [lx, ly] = A.lomo;
  const [nx, ny] = A.cuello;
  const [qx, qy] = A.quijada;
  const [kx, ky] = A.cola;
  const [px, py] = A.plato;
  const [hx, hy] = A.hocico;
  const caida = CAIDA * m.echado;
  // Respira desde el lomo; echado, la cabeza baja con el cuerpo.
  const hincha = 1 + 0.03 * m.respira;
  const transform: Record<string, string> = {
    entero: `translate(${OVEJERO.x} ${OVEJERO.piso}) scale(${OVEJERO.escala})`,
    cuerpo: `translate(${n2(m.arremete + m.tiembla)} ${n2(caida)}) translate(${lx} ${ly}) scale(${n2(hincha)} ${n2(hincha)}) translate(${-lx} ${-ly})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    quijada: `rotate(${n2(ABRE * m.quijada)} ${qx} ${qy})`,
    lengua: `translate(${n2(10 * m.lengua)} ${n2(6 * m.lengua)}) translate(${hx} ${hy}) scale(${n2(0.3 + 0.7 * m.lengua)}) translate(${-hx} ${-hy})`,
    cola: `rotate(${n2(m.cola - 30 * m.echado)} ${kx} ${ky})`,
    plato: `translate(${n2(m.plato[0])} ${n2(m.plato[1])}) rotate(${n2(m.plato[2])} ${px} ${py})`,
    huesos: `translate(${n2(30 * m.huesos)} ${n2(-50 * Math.sin(Math.min(1, m.huesos) * Math.PI))}) rotate(${n2(120 * m.huesos)} ${px + 20} ${py - 10})`,
  };
  for (const n of [0, 1] as const) {
    const [ox, oy] = A.orejas[n];
    transform[`oreja-${n + 1}`] = `rotate(${n2(m.orejas[n])} ${ox} ${oy})`;
    const [hbx, hby] = A.hombros[n];
    const [cdx, cdy] = A.caderas[n];
    // Echado, las patas se doblan; la de adelante de cerca patea y la de atrás de cerca se rasca.
    const patea = n ? m.patea : 0;
    const rasca = n ? m.rasca : 0;
    transform[`pata-del-${n + 1}`] = `rotate(${n2(DOBLADA.delantera * m.echado + patea)} ${hbx} ${hby})`;
    transform[`pata-tras-${n + 1}`] = `rotate(${n2(DOBLADA.trasera * m.echado + rasca)} ${cdx} ${cdy})`;
  }
  const { centro: [ex, ey], radio: [, ry] } = A.ojo;
  const top = ey - ry - 0.6;
  transform.parpado = `translate(${ex} ${top}) scale(1 ${n2(Math.max(0.02, m.parpado))}) translate(${-ex} ${-top})`;
  transform.pupila = `translate(${n2(m.pupila[0])} ${n2(m.pupila[1])})`;
  const opacity: Record<string, string> = {
    belfo: n2(m.belfo),
    erizo: n2(m.erizo),
    lengua: m.lengua > 0.03 ? '1' : '0',
    huesos: n2(m.huesosSe * Math.sin(Math.min(1, Math.max(0, m.huesos)) * Math.PI)),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de las orejas, echado, en el recinto. */
export const VERSO: Punto = alRecinto([80, -176 + CAIDA]);
