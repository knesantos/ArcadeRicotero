/**
 * Los números del gato que llamás con silbidos (`D-73`, vigesimonovena vuelta): dónde está su señal en los techos,
 * cómo está armado y cómo se pone. Los lee el dibujo (`arte-silbido.ts`), para la pose quieta del HTML y para el
 * retrato, y la conducta (`scripts/bestiario/silbido.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de la señal**: el (0, 0) es el pie del palo, en la chapa; arriba es negativo. Está dibujado mirando a la
 *   derecha y la escena lo da vuelta (`SILBIDO.lado`): en los techos mira a la **izquierda**, para donde pasa el tren.
 * - **El del recinto** (los techos, 1500 × 640): en la chapa del canto, entre el Atila y la torre, cerca de donde
 *   estaban sus ojos (`VECINOS_DEL_BALDIO`).
 */

import type { P } from './trazos.ts';

export type Punto = P;

export const SILBIDO = { x: 832, piso: 290, escala: 1.3, lado: -1 } as const;

export const SILBIDO_ARMADO = {
  /** La tabla donde está sentado, y el medio de su asiento: de acá se para. */
  tabla: -96,
  asiento: [24, -96] as Punto,
  /** Los hombros: lo que sube cuando se para. */
  hombros: 40,
  cuello: [24, -140] as Punto,
  ojo: [31.6, -149] as Punto,
  orejas: [[17, -158], [29.6, -159]] as readonly [Punto, Punto],
  cola: [38, -99] as Punto,
  /** El hombro del atadito, y el medio del bulto. */
  hombro: [15, -124] as Punto,
  bulto: [-5, -161] as Punto,
  /** El eje del brazo de la señal. */
  eje: [0, -188] as Punto,
  /** Por dónde pasa el tren, lejos: de dónde a dónde, y a qué altura. */
  tren: { desde: 46, hasta: 76, y: -66 },
  /** Cuántos silbidos nuevos entran en el montón antes de que no quepa uno más. */
  tope: 3,
  /** El silbido que le tiran: de dónde sale, dónde le pega en el lomo y dónde cae, en el montón. */
  silbido: { sale: [-84, -24] as Punto, pega: [13, -124] as Punto, cae: [-1, -102] as Punto },
  /** Dónde queda cada silbido nuevo del montón. */
  pila: [[-7, -111, 18], [7, -114, -32], [0, -119, 66]] as ReadonlyArray<readonly [number, number, number]>,
} as const;

export interface Momento {
  respira: number;
  /** Cuánto se paró (0 sentado, 1 parado) y cuánto se agazapa para saltar (grados). */
  para: number;
  agazapa: number;
  /** La cabeza (grados; negativo la levanta), cada oreja (grados), el párpado (0 abierto) y la cola (grados). */
  cabeza: number;
  orejas: readonly [number, number];
  parpado: number;
  cola: number;
  /** El atadito al hombro (grados) y cuánto le late (0 a 1). */
  atadito: number;
  late: number;
  /** El brazo de la señal (grados: 0 parado, negativo baja y da vía libre). */
  brazo: number;
  /** El tren, lejos (0 no hay; de 0 a 1 pasa y se va). */
  tren: number;
  /** El silbido que vuela (0 no hay, 1 ya cayó al montón) y si es el grande, el de quien toca. */
  silbido: number;
  grande: number;
  /** Cuántos silbidos nuevos hay en el montón (0 a 3) y cuánto los barrió la cola (0 a 1). */
  pila: number;
  barre: number;
}

/** La pose quieta, la del HTML: sentado de espaldas en la tabla de la señal, con el atadito al hombro. */
export const QUIETO: Momento = { respira: 0, para: 0, agazapa: 0, cabeza: 0, orejas: [0, 0], parpado: 0.25, cola: 0, atadito: 0, late: 0, brazo: 0, tren: 0, silbido: 0, grande: 0, pila: 0, barre: 0 };

/** *"Yo voy en trenes"*: parado, agazapado para saltar, con la señal baja y el tren que ya se va. El silbido de quien toca, en el montón. */
export const TREN: Momento = { ...QUIETO, para: 1, agazapa: 11, cabeza: -10, orejas: [10, -14], parpado: 0, cola: 34, atadito: -16, brazo: -45, tren: 0.5, pila: 1 };

export const alRecinto = ([x, y]: Punto): Punto => [SILBIDO.x + SILBIDO.lado * x * SILBIDO.escala, SILBIDO.piso + y * SILBIDO.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const entre01 = (v: number): number => Math.min(1, Math.max(0, v));
const suave = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/** Por dónde va el silbido a los `p` de su vuelo: sube hasta el lomo, rebota y cae al montón. */
export function vuelo(p: number): { x: number; y: number; giro: number; opacidad: number } {
  const { sale, pega, cae } = SILBIDO_ARMADO.silbido;
  const corte = 0.6;
  if (p < corte) {
    const k = p / corte;
    return { x: sale[0] + (pega[0] - sale[0]) * k, y: sale[1] + (pega[1] - sale[1]) * k - 26 * Math.sin(Math.PI * k), giro: 420 * k, opacidad: p <= 0 ? 0 : entre01(k * 6) };
  }
  const k = (p - corte) / (1 - corte);
  return { x: pega[0] + (cae[0] - pega[0]) * k, y: pega[1] + (cae[1] - pega[1]) * k * k - 12 * Math.sin(Math.PI * k), giro: 420 - 200 * k, opacidad: p >= 1 ? 0 : 1 };
}

/** Las transformaciones y las opacidades de cada parte para un momento. */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = SILBIDO_ARMADO;
  const [ax, ay] = A.asiento;
  const [nx, ny] = A.cuello;
  const [kx, ky] = A.cola;
  const [hx, hy] = A.hombro;
  const [bx, by] = A.bulto;
  const [ex, ey] = A.ojo;
  const p = entre01(m.para);
  const alto = 1 + 0.28 * p + 0.02 * m.respira;
  const v = vuelo(m.silbido);
  const tam = 1 + 0.9 * m.grande;
  const late = 1 + 0.2 * m.late;
  const transform: Record<string, string> = {
    entero: `translate(${SILBIDO.x} ${SILBIDO.piso}) scale(${SILBIDO.lado * SILBIDO.escala} ${SILBIDO.escala})`,
    gato: `rotate(${n2(m.agazapa)} ${ax} ${ay})`,
    lomo: `translate(${ax} ${ay}) scale(${n2(1 - 0.08 * p + 0.012 * m.respira)} ${n2(alto)}) translate(${-ax} ${-ay})`,
    // Lo de arriba del lomo sube lo que el lomo se estira.
    arriba: `translate(0 ${n2(-A.hombros * (alto - 1))})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    cola: `rotate(${n2(m.cola)} ${kx} ${ky})`,
    atadito: `rotate(${n2(m.atadito)} ${hx} ${hy})`,
    bulto: `translate(${bx} ${by}) scale(${n2(late)}) translate(${-bx} ${-by})`,
    parpado: `translate(0 ${ey - 3}) scale(1 ${n2(Math.max(0.02, entre01(m.parpado)))}) translate(0 ${-(ey - 3)})`,
    brazo: `rotate(${n2(m.brazo)} ${A.eje[0]} ${A.eje[1]})`,
    tren: `translate(${n2(A.tren.desde + (A.tren.hasta - A.tren.desde) * entre01(m.tren))} ${A.tren.y})`,
    silbido: `translate(${n2(v.x)} ${n2(v.y)}) rotate(${n2(v.giro)}) scale(${n2(tam)})`,
    // Lo barrido se va de la tabla y cae.
    pila: `translate(${n2(-22 * m.barre)} ${n2(60 * m.barre * m.barre)}) rotate(${n2(-50 * m.barre)} 0 ${A.tabla})`,
  };
  A.orejas.forEach(([ox, oy], i) => (transform[`oreja-${i + 1}`] = `translate(${ox} ${oy}) rotate(${n2(m.orejas[i]!)})`));
  const opacity: Record<string, string> = {
    tren: n2(m.tren <= 0 || m.tren >= 1 ? 0 : suave(m.tren / 0.12) * (1 - suave((m.tren - 0.78) / 0.22))),
    silbido: n2(v.opacidad),
    pila: n2(1 - entre01((m.barre - 0.5) * 2)),
  };
  A.pila.forEach((_, i) => (opacity[`pila-${i + 1}`] = n2(entre01(m.pila - i))));
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la señal, en el recinto. */
export const VERSO: Punto = alRecinto([10, -206]);
