/**
 * Los números del lobo caído (`D-73`, vigesimoctava vuelta): dónde está tirado entre las raíces, cómo está armado y
 * cómo se pone. Los lee el dibujo (`arte-lobocaido.ts`), para la pose quieta del HTML y para el retrato, y la
 * conducta (`scripts/bestiario/lobocaido.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del lobo**: el (0, 0) es el piso debajo del medio del cuerpo; arriba es negativo. Está tirado de panza, con
 *   la cabeza apoyada en las patas, mirando a la **derecha**. Está dibujado al doble, y la escena lo achica con
 *   `LOBO.escala`.
 * - **El del recinto** (900 × 640, el del monte): abajo a la izquierda, entre las raíces, donde estaban sus ojos. En el
 *   camino va corrido entero adonde lo esperaban (`ojos` del tramo en `camino.ts`).
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde está tirado, y lo que mide. */
export const LOBO = { x: 156, piso: 514, escala: 0.44 } as const;

/** Cómo está armado, en sus coordenadas. */
export const LOBO_ARMADO = {
  /** El medio del cuerpo: de acá respira y de acá se alza cuando intenta pararse. */
  lomo: [-20, -40] as Punto,
  /** El hombro: de acá giran las patas de adelante y se levanta el pecho. */
  hombro: [36, -34] as Punto,
  /** El cogote: de acá gira la cabeza, y la bisagra de la quijada. */
  cuello: [62, -42] as Punto,
  quijada: [116, -26] as Punto,
  /** El ojo de este lado, y lo que mide. */
  ojo: { centro: [112, -62] as Punto, radio: [6, 3.8] as Punto },
  /** Las bases de las orejas: la 1 es la de cerca, la que lleva la trompetilla. */
  orejas: [[78, -72], [70, -76]] as readonly [Punto, Punto],
  /** De dónde sale la cola. */
  cola: [-100, -28] as Punto,
  /** La rodilla de raíz donde marca los tantos, y dónde cae cada uno. */
  rodilla: { x: 198, piso: 0 },
  tantos: [[185, -26], [190, -26], [195, -26], [200, -26], [192, -20]] as readonly Punto[],
  /** Por dónde cruza el otro lobo, detrás: de dónde sale, hasta dónde llega, a qué altura y qué mide de largo. */
  paso: { desde: 300, hasta: -230, y: -62, escala: 1.2 },
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** La respiración (−1 a 1): se le notan las costillas. */
  respira: number;
  /** Cuánto se alza el pecho del piso (unidades) y cuánto se inclina el cuerpo (grados, negativo levanta el pecho). */
  alza: number;
  inclina: number;
  /** El temblor del esfuerzo (unidades). */
  tiembla: number;
  /** La pata de adelante: lo que gira (grados, negativo la levanta) y lo que se adelanta (unidades). */
  pata: number;
  alcanza: number;
  /** Cuánto gira la cabeza en el cogote (grados; negativo la levanta). */
  cabeza: number;
  /** La quijada (0 cerrada, 1 abierta). */
  quijada: number;
  /** Las orejas (grados): la de cerca, con la trompetilla, y la de lejos. */
  orejas: readonly [number, number];
  /** El párpado (0 abierto, 1 cerrado). */
  parpado: number;
  /** La cola (grados). */
  cola: number;
  /** Cuántos tantos tiene marcados en la raíz (0 a 5, con coma: el último se va marcando). */
  tantos: number;
  /** El otro lobo: dónde va de su cruce (−1 no está, 0 a 1 cruzando) y qué pata apoya (0 o 1). */
  paso: number;
  zancada: number;
}

export const QUIETO: Momento = {
  respira: 0,
  alza: 0,
  inclina: 0,
  tiembla: 0,
  pata: 0,
  alcanza: 0,
  cabeza: 0,
  quijada: 0,
  orejas: [10, 14],
  parpado: 0.55,
  cola: 0,
  tantos: 3,
  paso: -1,
  zancada: 0,
};

/**
 * *"Dije que el lobo estaba sordo, que no escuchaba más"*: levanta la cabeza, abre la boca y grita sin que se oiga
 * nada, con la oreja de la trompetilla parada para el lado de quien lo toca. Es el toque quieto y el retrato.
 */
export const GRITA: Momento = {
  ...QUIETO,
  alza: 6,
  inclina: -8,
  pata: -14,
  cabeza: -26,
  quijada: 0.85,
  orejas: [-26, 14],
  parpado: 0,
  cola: 18,
  tantos: 5,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [LOBO.x + x * LOBO.escala, LOBO.piso + y * LOBO.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Dónde va el otro lobo en su cruce (de derecha a izquierda, detrás del caído) y si está de frente o de lado. */
export function lugarDelPaso(k: number): { x: number; y: number } {
  const { desde, hasta, y } = LOBO_ARMADO.paso;
  const kk = Math.min(1, Math.max(0, k));
  return { x: desde + (hasta - desde) * kk, y: y + 1.4 * Math.sin(kk * 40) };
}

export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = LOBO_ARMADO;
  const [lx, ly] = A.lomo;
  const [hx, hy] = A.hombro;
  const [nx, ny] = A.cuello;
  const [qx, qy] = A.quijada;
  const [kx, ky] = A.cola;
  const { centro: [ex, ey], radio: [, ry] } = A.ojo;
  const hincha = 1 + 0.035 * m.respira;
  const top = ey - ry - 0.6;
  const transform: Record<string, string> = {
    entero: `translate(${LOBO.x} ${LOBO.piso}) scale(${LOBO.escala})`,
    // El pecho se alza del piso; las patas de atrás quedan.
    cuerpo: `translate(${n2(m.tiembla)} ${n2(-m.alza * 0.4)}) rotate(${n2(m.inclina * 0.4)} ${lx - 50} 0)`,
    tronco: `translate(${lx} ${ly + 20}) scale(1 ${n2(hincha)}) translate(${-lx} ${-ly - 20})`,
    pata: `translate(${n2(m.alcanza)} ${n2(-m.alza)}) rotate(${n2(m.pata)} ${hx} ${hy})`,
    cuello: `translate(${n2(m.tiembla)} ${n2(-m.alza)}) rotate(${n2(m.cabeza * 0.5)} ${nx} ${ny})`,
    cabeza: `translate(${n2(m.tiembla)} ${n2(-m.alza)}) rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    quijada: `rotate(${n2(30 * m.quijada)} ${qx} ${qy})`,
    cola: `rotate(${n2(m.cola)} ${kx} ${ky})`,
    parpado: `translate(${ex} ${top}) scale(1 ${n2(Math.max(0.02, m.parpado))}) translate(${-ex} ${-top})`,
  };
  A.orejas.forEach(([ox, oy], i) => (transform[`oreja-${i + 1}`] = `rotate(${n2(m.orejas[i]!)} ${ox} ${oy})`));
  const opacity: Record<string, string> = {};
  A.tantos.forEach((_, i) => (opacity[`tanto-${i + 1}`] = n2(Math.min(1, Math.max(0, m.tantos - i)))));
  if (m.paso < 0) {
    transform.paso = `translate(${A.paso.desde} ${A.paso.y}) scale(${A.paso.escala})`;
    opacity['paso-1'] = '0';
    opacity['paso-2'] = '0';
  } else {
    const { x, y } = lugarDelPaso(m.paso);
    transform.paso = `translate(${n2(x)} ${n2(y)}) scale(${A.paso.escala})`;
    opacity['paso-1'] = m.zancada ? '0' : '1';
    opacity['paso-2'] = m.zancada ? '1' : '0';
  }
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la cabeza, en el recinto. */
export const VERSO: Punto = alRecinto([100, -110]);
