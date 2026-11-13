/**
 * Los números del rebaño (`D-73`, vigesimoctava vuelta): dónde se amontona en la punta de la pastura, cómo está armado
 * y cómo se pone. Los lee el dibujo (`arte-rebano.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/rebano.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del rebaño**: el (0, 0) es el piso debajo del medio del montón; arriba es negativo. Cada oveja se dibuja
 *   mirando a la **derecha** con el (0, 0) debajo de su panza, y la que mira para el otro lado va espejada. Está
 *   dibujado al doble, y la escena lo achica con `REBANO.escala`.
 * - **El del recinto** (900 × 640, el del monte y la pastura): en la punta de abajo a la derecha, lo más lejos del
 *   monte que da el claro, donde estaban sus ojos. En el camino el claro va corrido entero (`claro.dx`).
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde se amontona, y lo que mide. */
export const REBANO = { x: 655, piso: 540, escala: 0.45 } as const;

/** Cuántas son y cómo están paradas: dónde, qué tan adelante (`y`) y para qué lado miran (1 derecha, −1 izquierda). */
export const OVEJAS = [
  { x: -48, y: -4, mira: -1 },
  { x: 2, y: 7, mira: 1 },
  { x: 52, y: -3, mira: 1 },
] as const;

/** Cómo está armada cada oveja, en sus coordenadas (mirando a la derecha). */
export const OVEJA = {
  /** El medio de la lana: de acá respira. */
  lomo: [0, -48] as Punto,
  /** El cogote: de acá gira la cabeza. */
  cuello: [34, -52] as Punto,
  /** La base de la oreja, caída, en la cabeza. */
  oreja: [44, -64] as Punto,
  /** El ojo y lo que mide. */
  ojo: { centro: [58, -58] as Punto, radio: [6, 5] as Punto },
  /** La comisura de la boca. */
  boca: [72, -40] as Punto,
} as const;

/** El palo de la veleta: dónde está clavado, hasta dónde sube, y el gallo y la cinta. */
export const VELETA = { x: 4, pie: -10, punta: -112, gallo: [4, -112] as Punto, cinta: [4, -86] as Punto } as const;
/** La bolsa de nailon enganchada en el palo, que es lo que sopla. */
export const BOLSA = { x: 12, y: -98 } as const;

/** Cuántos copos de lana saltan en el toque, y para dónde sale cada uno. */
/** Dónde está cada uno sobre la lana y adónde se va (el resto lo hace el arco). */
export const COPOS: readonly (readonly [number, number, number])[] = [[-70, -50, -60], [-24, -26, -110], [10, 10, -130], [52, 40, -100], [86, 70, -50]];

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

type Tres = readonly [number, number, number];

export interface Momento {
  /** La respiración (−1 a 1). */
  respira: number;
  /** Cuánto se aprietan (0 como están, 1 todas contra la del medio) y cuánto se abren (0 a 1, cada una para su lado). */
  apreta: number;
  abre: number;
  /** El temblor de cada una (unidades) y lo que salta (unidades). */
  tiembla: Tres;
  salta: Tres;
  /** Cuánto gira la cabeza de cada una en el cogote (grados; positivo la baja) y las orejas (grados; positivo las echa atrás). */
  cabeza: Tres;
  orejas: Tres;
  /** La boca (0 cerrada, 1 abierta) y el ojo (1 normal, más es de susto). */
  boca: Tres;
  ojo: Tres;
  /** El gallo de la veleta, de cara a un lado (1) o al otro (−1); pasando por 0 está de canto. Y la cinta (grados). */
  viento: number;
  cinta: number;
  /** La bolsa: dónde está en su vuelo (−1 enganchada en el palo, 0 a 1 volando) y cuánto aletea (grados). */
  bolsa: number;
  aletea: number;
  /** Los copos: cuánto salieron (0 pegados a la lana, 1 lo más lejos). */
  copos: number;
}

export const QUIETO: Momento = {
  respira: 0,
  apreta: 0.3,
  abre: 0,
  tiembla: [0, 0, 0],
  salta: [0, 0, 0],
  cabeza: [-4, 2, -6],
  orejas: [14, 18, 12],
  boca: [0, 0, 0],
  ojo: [1, 1, 1],
  viento: 1,
  cinta: 8,
  bolsa: -1,
  aletea: -8,
  copos: 0,
};

/** El toque quieto y el retrato: todas de un brinco, con las orejas para atrás, los ojos de susto y los copos al aire. */
export const ESPANTADO: Momento = {
  ...QUIETO,
  apreta: 0.62,
  salta: [10, 18, 10],
  cabeza: [-26, -30, -22],
  orejas: [38, 40, 36],
  boca: [0.3, 0.7, 0.3],
  ojo: [1.45, 1.5, 1.45],
  viento: -1,
  cinta: -30,
  aletea: 12,
  copos: 0.55,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [REBANO.x + x * REBANO.escala, REBANO.piso + y * REBANO.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** El camino de la bolsa cuando se suelta: sale del palo, sube, da la vuelta por la derecha y vuelve a engancharse. */
export function caminoDeLaBolsa(k: number): { x: number; y: number; giro: number } {
  const s = Math.sin(Math.PI * k);
  return { x: BOLSA.x + 250 * s, y: BOLSA.y - 90 * s + 16 * Math.sin(k * 24) * s, giro: 540 * k * s };
}

/** Dónde queda cada oveja en un momento. */
export function lugarDeOveja(n: 0 | 1 | 2, m: Momento): { x: number; y: number } {
  const o = OVEJAS[n];
  const dir = n === 0 ? -1 : n === 2 ? 1 : 0;
  return { x: o.x * (1 - 0.28 * m.apreta - (m.apreta > 0.5 ? 0.12 * (m.apreta - 0.5) : 0)) + m.tiembla[n] + dir * 46 * m.abre, y: o.y - m.salta[n] };
}

export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = OVEJA;
  const [lx, ly] = A.lomo;
  const [nx, ny] = A.cuello;
  const [ox, oy] = A.oreja;
  const [ex, ey] = A.ojo.centro;
  const [bx, by] = A.boca;
  const transform: Record<string, string> = { entero: `translate(${REBANO.x} ${REBANO.piso}) scale(${REBANO.escala})` };
  const opacity: Record<string, string> = {};
  for (const i of [0, 1, 2] as const) {
    const { x, y } = lugarDeOveja(i, m);
    transform[`oveja-${i + 1}`] = `translate(${n2(x)} ${n2(y)}) scale(${OVEJAS[i].mira} 1)`;
    transform[`cuerpo-${i + 1}`] = `translate(${lx} ${ly + 28}) scale(1 ${n2(1 + 0.035 * m.respira)}) translate(${-lx} ${-ly - 28})`;
    transform[`cabeza-${i + 1}`] = `rotate(${n2(m.cabeza[i])} ${nx} ${ny})`;
    transform[`oreja-${i + 1}`] = `rotate(${n2(m.orejas[i])} ${ox} ${oy})`;
    transform[`ojo-${i + 1}`] = `translate(${ex} ${ey}) scale(${n2(m.ojo[i])}) translate(${-ex} ${-ey})`;
    transform[`boca-${i + 1}`] = `translate(${bx} ${by}) scale(1 ${n2(Math.max(0.02, m.boca[i]))}) translate(${-bx} ${-by})`;
  }
  const [gx, gy] = VELETA.gallo;
  transform.gallo = `translate(${gx} ${gy}) scale(${n2(m.viento)} 1) translate(${-gx} ${-gy})`;
  transform.cinta = `rotate(${n2(m.cinta)} ${VELETA.cinta[0]} ${VELETA.cinta[1]})`;
  if (m.bolsa < 0) transform.bolsa = `translate(${BOLSA.x} ${BOLSA.y}) rotate(${n2(m.aletea)})`;
  else {
    const c = caminoDeLaBolsa(Math.min(1, m.bolsa));
    transform.bolsa = `translate(${n2(c.x)} ${n2(c.y)}) rotate(${n2(c.giro + m.aletea)})`;
  }
  COPOS.forEach(([x0, dx, dy], i) => {
    const k = m.copos;
    transform[`copo-${i + 1}`] = `translate(${n2(x0 + dx * k)} ${n2(-86 + dy * k - 30 * Math.sin(Math.PI * Math.min(1, k)))}) rotate(${n2(k * 200 * (i % 2 ? 1 : -1))})`;
    opacity[`copo-${i + 1}`] = k < 0.02 ? '0' : n2(Math.min(1, 1.6 - k * 1.2));
  });
  return { transform, opacity };
}

/** Dónde dice su verso: arriba del montón, en el recinto. */
export const VERSO: Punto = alRecinto([0, -156]);
