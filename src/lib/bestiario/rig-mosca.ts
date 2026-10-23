/**
 * Los números de la mosca (`D-73`, decimoséptima vuelta): por dónde vuela sobre la olla de la mesa
 * servida, dónde se posa, cómo está armada y cómo aletea. Los lee el dibujo (`arte-mosca.ts`), para la
 * pose quieta del HTML y para el retrato, y la conducta (`scripts/bestiario/mosca.ts`), que se lleva
 * esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del títere**: el (0, 0) es el medio del tórax, vista de arriba, con la cabeza para arriba
 *   (negativo). Está dibujada cuatro veces más grande que en la escena (`ESCALA`).
 * - **El del recinto** (900 × 640): la mesa (`MESA`, `rig-entornos.ts`). Vuela en ochos sobre la olla
 *   de la contratapa, en el seguidor que se escapa de la foto, y se posa en el borde, en el cucharón y
 *   en la sopa.
 *
 * En el camino la mesa se estira con `k` y el marco de la mosca se corre entero: la olla le queda a la
 * misma distancia, porque la olla es el ancla.
 */

import { MESA } from './rig-entornos.ts';

export type Punto = readonly [number, number];

/** Lo que mide la mosca en la escena: el títere está dibujado a cuatro veces. */
export const ESCALA = 0.26;

const { x: OX, piso: OP, ancho: OW, alto: OH } = MESA.olla;
/** El borde de la olla (`ollaAdentro` en `arte-entornos.ts`): el medio, y sus radios. */
export const OLLA = { x: OX, y: OP - OH + 10, rx: OW / 2, ry: 12 } as const;

/** Dónde se posa, en el recinto, y para dónde mira cuando está ahí (grados, 0 es la cabeza para arriba). */
export const POSADAS = {
  'borde-izquierdo': { punto: [OLLA.x - OLLA.rx + 8, OLLA.y - 3] as Punto, rumbo: 70 },
  'borde-derecho': { punto: [OLLA.x + OLLA.rx - 8, OLLA.y - 3] as Punto, rumbo: -64 },
  sopa: { punto: [OLLA.x - 18, OLLA.y + 2] as Punto, rumbo: 20 },
  // La punta del mango del cucharón, que sale de la sopa para arriba y a la derecha.
  cucharon: { punto: [OX + 48, OP - OH - 42] as Punto, rumbo: -150 },
} as const;
export type Posada = keyof typeof POSADAS;

/** El ocho que vuela sobre la olla: el medio, lo ancho y lo alto. */
export const OCHO = { x: OLLA.x + 8, y: OLLA.y - 56, rx: 74, ry: 30 } as const;

/** Dónde vuela en el ocho, en la vuelta `u` (una vuelta entera es 2π). */
export function enElOcho(u: number): Punto {
  return [OCHO.x + OCHO.rx * Math.sin(u), OCHO.y + OCHO.ry * Math.sin(2 * u) * 0.9 + 6 * Math.sin(3 * u + 1)];
}

/** El rumbo de quien va de `a` a `b`, en grados (0 es para arriba, como la cabeza del títere). */
export const rumboDe = ([ax, ay]: Punto, [bx, by]: Punto): number => (Math.atan2(bx - ax, -(by - ay)) * 180) / Math.PI;

/** Cómo está armada, en el títere: la 1 es la de la derecha del dibujo. */
export const MOSCA_ARMADA = {
  /** De dónde salen las alas y las patas de adelante. */
  alas: [[7, -6], [-7, -6]] as readonly [Punto, Punto],
  patas: [[6, -12], [-6, -12]] as readonly [Punto, Punto],
  /** Cuánto se abren las alas volando, desde plegadas sobre la panza (grados). */
  abre: 58,
} as const;

/* ------------------------------------------------------------------
   El momento: lo que la conducta decide en cada cuadro
   ------------------------------------------------------------------ */

export interface Momento {
  /** Dónde está en el recinto, para dónde mira y cuánto más grande se ve (cuando se te viene encima). */
  x: number;
  y: number;
  rumbo: number;
  cerca: number;
  /** Cuánto abre las alas (0 plegadas, 1 abiertas) y cuánto zumba (el borrón del aleteo). */
  alas: number;
  zumba: number;
  /** Cuánto gira cada pata de adelante (las que se frota), en grados. */
  patas: readonly [number, number];
  /** La sombra, cuando está posada; y los anillos de la sopa, de 0 a 1 (−1 si no hay). */
  sombra: number;
  anillo: number;
  /** Si se ve: cuando se va volando por arriba, un rato no está. */
  visible: boolean;
}

/** La pose quieta, la del HTML: posada en el borde de la olla, con las alas plegadas. */
export const QUIETA: Momento = {
  x: POSADAS['borde-derecho'].punto[0],
  y: POSADAS['borde-derecho'].punto[1],
  rumbo: POSADAS['borde-derecho'].rumbo,
  cerca: 0,
  alas: 0,
  zumba: 0,
  patas: [0, 0],
  sombra: 1,
  anillo: -1,
  visible: true,
};

/** *"Sentís la mosca joder detrás de la oreja"*: se te viene encima, zumbando. Es la del toque quieto y la del retrato. */
export const ENCIMA: Momento = { ...QUIETA, x: OCHO.x, y: OCHO.y - 6, rumbo: 180, cerca: 1, alas: 1, zumba: 1, sombra: 0 };

/** Cuánto más grande se ve cuando se te viene encima. */
export const CERCA = 2.6;

/* ------------------------------------------------------------------
   La pose: del momento a cada pieza
   ------------------------------------------------------------------ */

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Cuánto gira cada ala, en grados: plegadas en V sobre la panza, y abiertas para los costados. */
export function giroDeAla(n: 0 | 1, m: Momento): number {
  const g = MOSCA_ARMADA.abre * m.alas;
  return n === 0 ? -g : g;
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el
 * HTML (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = MOSCA_ARMADA;
  const k = ESCALA * (1 + (CERCA - 1) * m.cerca);
  const transform: Record<string, string> = {
    entero: `translate(${n2(m.x)} ${n2(m.y)}) rotate(${n2(m.rumbo)}) scale(${k.toFixed(3)})`,
    sombra: `translate(${n2(m.x + 1.4)} ${n2(m.y + 2.4)}) rotate(${n2(m.rumbo)})`,
    anillo: `translate(${n2(POSADAS.sopa.punto[0])} ${n2(POSADAS.sopa.punto[1] + 2)}) scale(${n2(0.4 + Math.max(0, m.anillo) * 2.2)} ${n2((0.4 + Math.max(0, m.anillo) * 2.2) * 0.32)})`,
  };
  for (const n of [0, 1] as const) {
    const [ax, ay] = A.alas[n];
    transform[`ala-${n + 1}`] = `rotate(${n2(giroDeAla(n, m))} ${ax} ${ay})`;
    const [px, py] = A.patas[n];
    transform[`pata-${n + 1}`] = `rotate(${n2(m.patas[n])} ${px} ${py})`;
  }
  const opacity: Record<string, string> = {
    entero: m.visible ? '1' : '0',
    zumbido: n2(m.zumba),
    sombra: n2(m.sombra * 0.55),
    anillo: m.anillo < 0 ? '0' : n2((1 - m.anillo) * 0.7),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba del ocho, debajo de la ventana. */
export const VERSO: Punto = [OCHO.x, OCHO.y - OCHO.ry - 34];
