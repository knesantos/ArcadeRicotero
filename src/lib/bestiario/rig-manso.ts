/**
 * Los números del perro manso (`D-73`, vigesimonovena vuelta): dónde come en el baldío, cómo está armado y cómo se
 * pone. Los lee el dibujo (`arte-manso.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/manso.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del perro**: el (0, 0) es la tierra debajo de la panza; arriba es negativo y mira a la **izquierda**, con
 *   la cabeza en la olla.
 * - **El del recinto** (los techos, 1500 × 640): en la tierra del baldío, a la derecha, donde estaban sus ojos
 *   (`VECINOS_DEL_BALDIO`), pasando al perro dinamita.
 */

import type { P } from './trazos.ts';

export type Punto = P;

export const MANSO = { x: 1370, piso: 606, escala: 1.25 } as const;

export const MANSO_ARMADO = {
  /** El medio del tronco: de acá respira. */
  panza: [4, -30] as Punto,
  /** El cogote: de acá gira la cabeza. */
  cuello: [-28, -46] as Punto,
  ojo: [-49, -47] as Punto,
  quijada: [-46, -35] as Punto,
  oreja: [-41.6, -55.4] as Punto,
  hocico: [-66, -33] as Punto,
  /** La cola, y su punta, de donde cuelga el piolín del palo. */
  cola: [40, -52] as Punto,
  punta: [49, -64] as Punto,
  /** Las seis costillas: la `x` de cada una y dónde arrancan. Van numeradas del 1 al 6 desde el pecho. */
  costillas: { x: [-14, -6, 2, 10, 18, 26] as readonly number[], y: -47 },
  /** El palo: lo que mide, y el piolín. */
  palo: 26,
  piolin: 38,
  /** La olla, y los tres cucharones que se ríen. */
  olla: [-78, -30] as Punto,
  cucharones: [[-99, -31, -15], [-92, -33, -3], [-85, -32, 6]] as ReadonlyArray<readonly [number, number, number]>,
  /** Dónde sale la burbuja de sopa. */
  burbuja: [-70, -36] as Punto,
  /** Cuánto mide cada cucharón que se ríe, contra el dibujo: ninguno igual a otro. */
  largos: [1, 0.72, 1.2] as readonly number[],
} as const;

export interface Momento {
  respira: number;
  /** La cabeza (grados; positivo la levanta de la olla), la quijada (0 a 1), la oreja y la cola (grados), el párpado. */
  cabeza: number;
  mastica: number;
  oreja: number;
  cola: number;
  parpado: number;
  /** Un tirón del cuerpo, de la tos. */
  sacude: number;
  /** Cuánto salta cada costilla. */
  costillas: readonly number[];
  /** El palo: dónde tiene el medio y cuánto está girado (0 es colgando derecho). */
  palo: readonly [number, number, number];
  /** Cuánto se tuerce cada cucharón que se ríe (grados). */
  cucharones: readonly [number, number, number];
  /** La burbuja de sopa (0 no hay, crece hasta 1, y en 1 ya reventó) y la espina atravesada (0 a 1). */
  burbuja: number;
  espina: number;
}

const rad = (g: number): number => (g * Math.PI) / 180;
const girar = ([x, y]: Punto, [cx, cy]: Punto, g: number): Punto => {
  const [c, s] = [Math.cos(rad(g)), Math.sin(rad(g))];
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
};

/** La punta de la cola, con la cola girada. */
export const puntaDeLaCola = (cola: number): Punto => girar(MANSO_ARMADO.punta, MANSO_ARMADO.cola, cola);

/** El palo colgando de la punta de la cola: dónde queda el medio con la cola y el vaivén que le digan. */
export function colgado(cola: number, vaiven: number): readonly [number, number, number] {
  const A = MANSO_ARMADO;
  const [tx, ty] = puntaDeLaCola(cola);
  const l = A.piolin + A.palo / 2;
  return [tx + 1 - Math.sin(rad(vaiven)) * l, ty + Math.cos(rad(vaiven)) * l, vaiven];
}

/** El palo, sin que el piolín se estire: si el nudo quedó más lejos de la cola de lo que mide el piolín, se acerca. */
export function atado(palo: readonly [number, number, number], cola: number): readonly [number, number, number] {
  const A = MANSO_ARMADO;
  const [x, y, g] = palo;
  const [tx, ty] = puntaDeLaCola(cola);
  const [nx, ny] = [x + Math.sin(rad(g)) * (A.palo / 2) - tx, y - Math.cos(rad(g)) * (A.palo / 2) - ty];
  const d = Math.hypot(nx, ny);
  if (d <= A.piolin) return palo;
  const k = (d - A.piolin) / d;
  return [x - nx * k, y - ny * k, g];
}

/** La pose quieta, la del HTML: con la cabeza en la olla, el palo colgando de la cola. */
export const QUIETO: Momento = { respira: 0, cabeza: 0, mastica: 0.2, oreja: 0, cola: 0, parpado: 0.3, sacude: 0, costillas: [0, 0, 0, 0, 0, 0], palo: colgado(0, 3), cucharones: [0, 0, 0], burbuja: 0, espina: 0 };

/** *"Le cuentan las costillas con un palo a carcajadas"*: el palo en la cuarta, tres costillas en el aire, los cucharones torcidos. Él come. */
export const CONTADO: Momento = { ...QUIETO, cola: 26, parpado: 0.55, oreja: -8, costillas: [0, 2, 7, 3, 0, 0], palo: [15, -40, 84], cucharones: [13, -11, 15], mastica: 0.7 };

export const alRecinto = ([x, y]: Punto): Punto => [MANSO.x + x * MANSO.escala, MANSO.piso + y * MANSO.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const entre01 = (v: number): number => Math.min(1, Math.max(0, v));

/** Las transformaciones y las opacidades de cada parte para un momento. */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = MANSO_ARMADO;
  const [px, py] = A.panza;
  const [nx, ny] = A.cuello;
  const [qx, qy] = A.quijada;
  const [ox, oy] = A.oreja;
  const [kx, ky] = A.cola;
  const [bx, by] = A.burbuja;
  const [x, y, g] = m.palo;
  // El piolín: de la punta de la cola a la punta de arriba del palo.
  const [tx, ty] = puntaDeLaCola(m.cola);
  const arriba: Punto = [x + Math.sin(rad(g)) * (A.palo / 2), y - Math.cos(rad(g)) * (A.palo / 2)];
  const [dx, dy] = [arriba[0] - tx, arriba[1] - ty];
  const transform: Record<string, string> = {
    entero: `translate(${MANSO.x} ${MANSO.piso}) scale(${MANSO.escala})`,
    perro: `translate(${n2(m.sacude)} 0)`,
    tronco: `translate(${px} ${py}) scale(1 ${n2(1 + 0.03 * m.respira)}) translate(${-px} ${-py})`,
    cola: `rotate(${n2(m.cola)} ${kx} ${ky})`,
    cogote: `rotate(${n2(m.cabeza * 0.5)} ${nx} ${ny})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    quijada: `rotate(${n2(-16 * m.mastica)} ${qx} ${qy})`,
    // Lo que cuelga, cuelga para abajo: la oreja deshace la mitad del giro de la cabeza.
    oreja: `rotate(${n2(m.oreja - m.cabeza * 0.6)} ${ox} ${oy})`,
    palo: `translate(${n2(x)} ${n2(y)}) rotate(${n2(g)})`,
    piolin: `translate(${n2(tx)} ${n2(ty)}) rotate(${n2((Math.atan2(dy, dx) * 180) / Math.PI)}) scale(${n2(Math.max(0.05, Math.hypot(dx, dy) / 20))} 1)`,
    burbuja: `translate(${bx} ${by}) scale(${n2(0.25 + 0.75 * entre01(m.burbuja))})`,
    // El párpado baja desde arriba: entornado es a medias.
    parpado: `translate(0 ${A.ojo[1] - 3.2}) scale(1 ${n2(Math.max(0.02, entre01(m.parpado)))}) translate(0 ${-(A.ojo[1] - 3.2)})`,
  };
  A.costillas.x.forEach((cx, i) => (transform[`costilla-${i + 1}`] = `translate(${cx} ${n2(A.costillas.y - (m.costillas[i] ?? 0))})`));
  A.cucharones.forEach(([cx, cy, g0], i) => (transform[`cucharon-${i + 1}`] = `translate(${cx} ${cy}) rotate(${n2(g0 + m.cucharones[i]!)})`));
  const opacity: Record<string, string> = {
    burbuja: m.burbuja <= 0 || m.burbuja >= 1 ? '0' : '1',
    espina: n2(entre01(m.espina)),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba del lomo, en el recinto. */
export const VERSO: Punto = alRecinto([0, -84]);
