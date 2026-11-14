/**
 * Los números de la hormiga dormida (`D-73`, vigesimoctava vuelta): dónde duerme en el mantel, al lado del membrillo, cómo
 * está armada y cómo se pone. Los lee el dibujo (`arte-hormiga.ts`), para la pose quieta del HTML y para el retrato, y la
 * conducta (`scripts/bestiario/hormiga.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de la hormiga**: el (0, 0) es el mantel debajo del medio de su cuerpo; arriba es negativo. Está tirada panza arriba,
 *   con la cabeza a la **izquierda**, sobre un dedal. Está dibujada al doble y la escena la achica con `HORMIGA.escala`. El
 *   membrillo, el palillo y el hilo donde se seca la camisa están dibujados en el mismo sistema, a su alrededor.
 * - **El del recinto** (900 × 640, el de la mesa): en el borde de adelante del tablero, a la derecha del membrillo, donde
 *   estaba su silueta. En el camino el piso es más ancho y todo lo fijo se corre con `k` (`K_ENTORNO`): el marco la corre
 *   `ancla · (k − 1)`.
 */

import type { P } from './trazos.ts';
import { COSAS_DE_LA_MESA, MESA } from './rig-entornos.ts';

export type Punto = P;

/** Dónde duerme y lo que mide: sobre el mantel, en el canto de adelante del tablero, al lado del membrillo. */
export const HORMIGA = { x: 603, piso: MESA.membrillo.piso, escala: 0.56 } as const;

/** Cómo está armada, en sus coordenadas. */
export const HORMIGA_ARMADO = {
  /** El centro del cuerpo: de acá da vueltas cuando baila de espaldas. */
  centro: [-6, -18] as Punto,
  /** El cogote, de donde gira la cabeza, y el centro de la cabeza. */
  cuello: [-36, -16] as Punto,
  cabeza: [-48, -16] as Punto,
  radio: 14,
  /** Los dos ojos: el de lejos y el de cerca. */
  ojos: [[-56, -21], [-41, -23]] as readonly [Punto, Punto],
  radioOjo: 4.6,
  /** La boca, de donde sale la burbuja del ronquido. */
  boca: [-60, -10] as Punto,
  /** La raíz de cada antena, en la cabeza. */
  antenas: [[-57, -28], [-48, -31]] as readonly Punto[],
  /** Donde se agarran las patas: arriba del tórax. Y la panza, de donde respira. */
  patas: [-12, -30] as Punto,
  tronco: [12, 0] as Punto,
  /** Arriba de la cabeza, de donde suben las zetas, y de donde sale la gota del susto. */
  zzz: [-50, -38] as Punto,
  gota: [-36, -36] as Punto,
  /** El dedal donde apoya la cabeza, y el membrillo, y de dónde cuelga la camisa del hilo. */
  dedal: [-54, -6] as Punto,
  membrillo: [-98, -22] as Punto,
  camisa: [60, -53] as Punto,
  /** El palillo clavado en el mantel, donde se ata el otro extremo del hilo. */
  palillo: [110, 0] as Punto,
} as const;

/** Cuánto sube la zeta antes de irse, y cuánto cae la gota (unidades). */
export const SUBE_ZETA = 30;
export const CAE_GOTA = 20;

export interface Momento {
  /** La respiración (−1 a 1). */
  respira: number;
  /** La cabeza en el cogote (grados). */
  cabeza: number;
  /** Los ojos (0 cerrados, 1 abiertos del todo). */
  ojos: number;
  /** Cada antena (grados): negativo la levanta. */
  antenas: readonly [number, number];
  /** Cada grupo de patas (grados): las tres de cerca y las tres de lejos. */
  patas: readonly [number, number];
  /** El giro sobre la espalda: el cuerpo se da vuelta de izquierda a derecha (1 a −1) y el giro de lado (grados). */
  flip: number;
  giro: number;
  /** Cuánto salta del mantel. */
  salto: number;
  /** La burbuja del ronquido: cuánto se infla (0 sin burbuja, 1 a punto de reventar). */
  burbuja: number;
  /** Las zetas: en qué punto de su subida van (0 a 1), y cuánto se ven. */
  zzz: number;
  zzzVe: number;
  /** La gota fría del susto: en qué punto de su caída va (0 sin gota a 1). */
  gota: number;
  /** La camisa que se seca (grados). */
  camisa: number;
}

/** La pose quieta, la del HTML: dormida panza arriba, las patas flojas en el aire, la burbuja del ronquido a medias. */
export const QUIETO: Momento = {
  respira: 0,
  cabeza: 0,
  ojos: 0,
  antenas: [0, 0],
  patas: [0, 0],
  flip: 1,
  giro: 0,
  salto: 0,
  burbuja: 0.55,
  zzz: 0.3,
  zzzVe: 1,
  gota: 0,
  camisa: 0,
};

/**
 * *"Vamos, negrita, bailá hasta el fin"*: despierta de golpe, con los ojos abiertos de par en par y la gota fría del susto, y
 * baila de espaldas, pateando para todos lados. Es el toque quieto y el retrato.
 */
export const BAILA: Momento = {
  ...QUIETO,
  cabeza: -10,
  ojos: 1,
  antenas: [-26, -34],
  patas: [-34, 30],
  giro: -9,
  salto: 8,
  burbuja: 0,
  zzzVe: 0,
  gota: 0.5,
  camisa: 12,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [HORMIGA.x + x * HORMIGA.escala, HORMIGA.piso + y * HORMIGA.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = HORMIGA_ARMADO;
  const [cx, cy] = A.centro;
  const [nx, ny] = A.cuello;
  const [px, py] = A.patas;
  const [tx, ty] = A.tronco;
  const [zx, zy] = A.zzz;
  const [gx, gy] = A.gota;
  const [bx, by] = A.boca;
  const [sx, sy] = A.camisa;
  const respira = 1 + 0.035 * m.respira;
  const transform: Record<string, string> = {
    entero: `translate(${HORMIGA.x} ${HORMIGA.piso}) scale(${HORMIGA.escala})`,
    // Da la vuelta sobre la espalda (el flip achata el cuerpo de lado a lado y lo da vuelta), y salta.
    cuerpo: `translate(0 ${n2(-m.salto)}) translate(${cx} 0) scale(${n2(m.flip)} 1) translate(${-cx} 0) rotate(${n2(m.giro)} ${cx} ${cy})`,
    tronco: `translate(${tx} ${ty}) scale(${n2(1 + 0.02 * m.respira)} ${n2(respira)}) translate(${-tx} ${-ty})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    'antena-1': `rotate(${n2(m.antenas[0])} ${A.antenas[0]![0]} ${A.antenas[0]![1]})`,
    'antena-2': `rotate(${n2(m.antenas[1])} ${A.antenas[1]![0]} ${A.antenas[1]![1]})`,
    'patas-1': `rotate(${n2(m.patas[0])} ${px} ${py})`,
    'patas-2': `rotate(${n2(m.patas[1])} ${px - 4} ${py})`,
    burbuja: `translate(${bx} ${by}) scale(${n2(0.15 + 0.85 * m.burbuja)}) translate(${-bx} ${-by})`,
    zzz: `translate(${n2(-m.zzz * 8)} ${n2(-m.zzz * SUBE_ZETA)}) translate(${zx} ${zy}) scale(${n2(0.6 + 0.7 * m.zzz)}) translate(${-zx} ${-zy})`,
    gota: `translate(0 ${n2(m.gota * CAE_GOTA)}) translate(${gx} ${gy}) scale(${n2(0.6 + 0.6 * m.gota)}) translate(${-gx} ${-gy})`,
    camisa: `rotate(${n2(m.camisa)} ${sx} ${sy})`,
  };
  const opacity: Record<string, string> = {
    ojos: n2(m.ojos),
    burbuja: n2(m.burbuja > 0.02 ? 0.9 : 0),
    zzz: n2(m.zzzVe * (m.zzz < 0.2 ? m.zzz / 0.2 : 1 - (m.zzz - 0.2) / 0.8)),
    gota: n2(m.gota > 0.02 ? 0.9 * (1 - m.gota * 0.6) : 0),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de las zetas, en el recinto. */
export const VERSO: Punto = alRecinto([-30, -74]);

/** La posición vieja de la silueta, que el test mira para saber que no se movió de lugar. */
export const SILUETA_VIEJA = COSAS_DE_LA_MESA['la-hormiga-dormida']!;
