/**
 * Los números del angelito frito (`D-73`, vigesimoctava vuelta): dónde cae en el pie del árbol, cómo está armado y cómo se
 * pone. Los lee el dibujo (`arte-angelito.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/angelito.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del angelito**: el (0, 0) es la tierra debajo de la cadera; arriba es negativo. Está sentado, mirando para la
 *   **izquierda**, que es el lado del galpón, y el enchufe va en esa mano. Está dibujado al doble y la escena lo achica
 *   con `ANGELITO.escala`.
 * - **El del recinto** (900 × 640, el del árbol): al pie del tronco, a la izquierda, donde estaban sus ojos. En el
 *   camino el piso es más ancho y todo lo fijo se corre con `k` (`K_ENTORNO`): el marco lo corre `ancla · (k − 1)`.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde está sentado y lo que mide: la tierra bajo la cadera, a la izquierda del tronco, donde caían sus ojos. */
export const ANGELITO = { x: 176, piso: 548, escala: 0.58 } as const;

/** Cómo está armado, en sus coordenadas. */
export const ANGELITO_ARMADO = {
  /** La cadera, de donde se mece todo el cuerpo, y el cogote, de donde gira la cabeza. */
  cadera: [4, -12] as Punto,
  cuello: [-4, -62] as Punto,
  /** El centro de la cabeza (es grande, de angelito) y lo que mide. */
  cabeza: [-8, -84] as Punto,
  radio: 20,
  /** Los dos ojos: el de lejos y el de cerca; y lo que mide el blanco. */
  ojos: [[-17, -88], [-1, -88]] as readonly [Punto, Punto],
  radioOjo: 7,
  /** La boca, de donde sale la tos. */
  boca: [-18, -73] as Punto,
  /** Cuánto flota la aureola sobre la cabeza, y de dónde se agarra. */
  aureola: [-8, -110] as Punto,
  /** Donde se agarran las alas: la espalda. */
  hombroAla: [8, -58] as Punto,
  /** El hombro del brazo que lleva el enchufe, y el enchufe. */
  hombro: [-6, -52] as Punto,
  enchufe: [-52, -30] as Punto,
  /** El tobillo del pie que patea, y la base del brote. */
  tobillo: [-60, -10] as Punto,
  brote: [-96, -2] as Punto,
  /** Las puntas de las alas, de donde sale el humo, y la boca de donde sale el de la tos. */
  humo: [[46, -112], [24, -124]] as readonly Punto[],
  /** Donde el humo de la zapatilla. */
  humoPie: [-74, -14] as Punto,
} as const;

/** Cuánto sube el humo antes de irse (unidades). */
export const SUBE_HUMO = 40;

export interface Momento {
  /** La respiración (−1 a 1). */
  respira: number;
  /** La inclinación del cuerpo en la cadera (grados). */
  tumbo: number;
  /** La cabeza en el cogote (grados, negativo mira para arriba). */
  cabeza: number;
  /** Cuánto se le para el pelo (1 es lacio, 1.4 es a pleno). */
  pelo: number;
  /** Los ojos: cuánto se le mueven las pupilas y cuánto se le salen (escala). */
  pupilas: readonly [number, number, number];
  /** La aureola: cuánto se corrió, cuánto subió, cuánto se torció (grados) y cuánto brilla (0 a 1). */
  aureola: readonly [number, number, number, number];
  /** Las dos alas (grados): hacia afuera es positivo. */
  alas: readonly [number, number];
  /** Las brasas de las alas y del ruedo de la túnica: cuánto brillan (0 a 1). */
  brasas: number;
  /** Las bocanadas de las dos alas y la del pie, cada una en su fase (0 a 1), y la de la boca (0 sin tos). */
  humo: readonly [number, number, number];
  tos: number;
  /** El brazo que lleva el enchufe (grados) y las chispas del enchufe (0 a 1). */
  brazo: number;
  chispas: number;
  /** Los huesos que se ven por el choque de la corriente (0 a 1). */
  esqueleto: number;
  /** El pie que patea (grados, positivo levanta la punta) y el brote que lo quiere (grados, positivo se arrima al pie). */
  pie: number;
  brote: number;
  /** El temblor de todo el cuerpo (unidades) cuando lo cruza la corriente. */
  temblor: readonly [number, number];
}

/** La pose quieta, la del HTML: sentado en el cráter, con el enchufe en la mano, la aureola torcida y las alas humeando. */
export const QUIETO: Momento = {
  respira: 0,
  tumbo: 0,
  cabeza: 0,
  pelo: 1,
  pupilas: [0, 0, 1],
  aureola: [0, 0, -14, 0.8],
  alas: [0, 0],
  brasas: 0.7,
  humo: [0.2, 0.55, 0.4],
  tos: 0,
  brazo: 0,
  chispas: 0,
  esqueleto: 0,
  pie: 0,
  brote: 0,
  temblor: [0, 0],
};

/**
 * Lo atraviesa la corriente, *"estás frito, angelito"*: el pelo parado, los ojos afuera, los huesos a la vista, las alas
 * abiertas de golpe, la aureola en el aire y chispas en el enchufe. Es el toque quieto y el retrato.
 */
export const FRITO: Momento = {
  ...QUIETO,
  tumbo: -4,
  cabeza: -8,
  pelo: 1.42,
  pupilas: [0, 0, 1.5],
  aureola: [4, -22, 18, 1],
  alas: [16, 22],
  brasas: 1,
  humo: [0.3, 0.6, 0.3],
  brazo: -10,
  chispas: 1,
  esqueleto: 1,
  pie: 18,
  brote: 14,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [ANGELITO.x + x * ANGELITO.escala, ANGELITO.piso + y * ANGELITO.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = ANGELITO_ARMADO;
  const [cx, cy] = A.cadera;
  const [nx, ny] = A.cuello;
  const [ax, ay] = A.aureola;
  const [hx, hy] = A.hombroAla;
  const [sx, sy] = A.hombro;
  const [tx, ty] = A.tobillo;
  const [bx, by] = A.brote;
  const [px, py] = A.cabeza;
  const respira = 1 + 0.018 * m.respira;
  const transform: Record<string, string> = {
    entero: `translate(${ANGELITO.x} ${ANGELITO.piso}) scale(${ANGELITO.escala})`,
    cuerpo: `translate(${n2(m.temblor[0])} ${n2(m.temblor[1])}) rotate(${n2(m.tumbo)} ${cx} ${cy})`,
    torso: `translate(${cx} ${cy}) scale(1 ${n2(respira)}) translate(${-cx} ${-cy})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    pelo: `translate(${px} ${py - 14}) scale(${n2(1 + (m.pelo - 1) * 0.6)} ${n2(m.pelo)}) translate(${-px} ${-(py - 14)})`,
    aureola: `translate(${n2(m.aureola[0])} ${n2(m.aureola[1])}) rotate(${n2(m.aureola[2])} ${ax} ${ay})`,
    'ala-1': `rotate(${n2(m.alas[0])} ${hx} ${hy})`,
    'ala-2': `rotate(${n2(m.alas[1])} ${hx} ${hy})`,
    brazo: `rotate(${n2(m.brazo)} ${sx} ${sy})`,
    pie: `rotate(${n2(m.pie)} ${tx} ${ty})`,
    brote: `rotate(${n2(m.brote)} ${bx} ${by})`,
    pupilas: `translate(${n2(m.pupilas[0])} ${n2(m.pupilas[1])})`,
  };
  const puff = (u: number, [x, y]: Punto, i: string): void => {
    transform[`humo-${i}`] = `translate(${n2(-u * 14)} ${n2(-u * SUBE_HUMO)}) translate(${x} ${y}) scale(${n2(0.5 + 1.1 * u)}) translate(${-x} ${-y})`;
  };
  puff(m.humo[0], A.humo[0]!, '1');
  puff(m.humo[1], A.humo[1]!, '2');
  puff(m.humo[2], A.humoPie, '3');
  const clara = (u: number): string => n2(u < 0.15 ? u / 0.15 : (1 - u) / 0.85);
  const [bx2, by2] = A.boca;
  transform.tos = `translate(${n2(-m.tos * 26)} ${n2(-m.tos * 12)}) translate(${bx2} ${by2}) scale(${n2(0.4 + 1.2 * m.tos)}) translate(${-bx2} ${-by2})`;
  const opacity: Record<string, string> = {
    brasas: n2(m.brasas),
    'humo-1': clara(m.humo[0]),
    'humo-2': clara(m.humo[1]),
    'humo-3': n2(0.8 * Number(clara(m.humo[2]))),
    tos: m.tos > 0.02 ? n2(0.9 * (1 - m.tos * 0.7)) : '0',
    chispas: n2(m.chispas),
    esqueleto: n2(m.esqueleto),
    aureola: n2(0.35 + 0.65 * m.aureola[3]),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la aureola, en el recinto. */
export const VERSO: Punto = alRecinto([-8, -138]);
