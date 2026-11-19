/**
 * Los números del animal que no late (`D-73`, vigesimonovena vuelta, `T-529`): dónde está montado en el monte, cómo
 * está armado y cómo se pone. Los lee el dibujo (`arte-nolate.ts`), para la pose quieta del HTML y para el retrato,
 * y la conducta (`scripts/bestiario/nolate.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del animal**: el (0, 0) es el piso debajo del medio de la peana; arriba es negativo. Está montado mirando a
 *   la **derecha**, en puntas de pie. Está dibujado más grande y la escena lo achica con `NOLATE.escala`.
 * - **El del recinto** (900 × 640, el del monte): arriba a la izquierda, entre las tiras del bosque, donde estaban
 *   sus ojos (`VECINOS_DEL_MONTE`). En el camino va corrido entero adonde lo esperaban (`ojos` del tramo en `camino.ts`).
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde está montado, y lo que mide. El piso es donde apoyan las rueditas de la peana. */
export const NOLATE = { x: 300, piso: 266, escala: 0.62 } as const;

/** Cómo está armado, en sus coordenadas. */
export const NOLATE_ARMADO = {
  /** La tabla de la peana: de dónde a dónde, y a qué altura está su lomo. */
  peana: { desde: -86, hasta: 86, lomo: -18 },
  /** Los ejes de las dos rueditas. */
  ruedas: [[-64, -5], [64, -5]] as readonly [Punto, Punto],
  /** Donde la varilla entra en la panza: de acá se bambolea el bicho entero. */
  varilla: [-4, -18] as Punto,
  /** El hombro de la pata levantada, la raíz de la cola y el medio de la cintura, de donde sale la paja. */
  hombro: [40, -98] as Punto,
  cola: [-52, -106] as Punto,
  cintura: [-16, -98] as Punto,
  /** La puertita del pecho: la caja (x, y, ancho, alto). La bisagra está en su canto izquierdo. */
  puerta: [6, -114, 34, 30] as readonly [number, number, number, number],
  /** La base de la antena, en el lomo, y lo que mide estirada. */
  antena: { base: [16, -119] as Punto, largo: 56 },
  /** El ojo de vidrio de este lado, y lo que mide. */
  ojo: { centro: [79, -173] as Punto, radio: 4.8 },
  /** De dónde cuelgan el flequillo y la etiqueta. */
  flequillo: [68, -188] as Punto,
  etiqueta: [56, -180] as Punto,
  /** La nube: el centro, y lo que mide de ancho y de alto. Su panza está en `panza`. */
  nube: { centro: [4, -272] as Punto, ancho: 170, alto: 64, panza: -244 },
  /** Lo que mide un tramo de lluvia: la isla la baja un tramo y vuelve, sin salto. */
  tramo: 44,
  /** Hasta dónde rueda el ojo cuando se le cae: lo que baja y lo que se va para atrás. */
  caida: { baja: 150, rueda: -74 },
} as const;

/** Cuánto está abierta la puertita cuando nadie la toca (deja ver una rendija del dial) y cuánto asoma la antena. */
export const ENTORNADA = 0.14;
export const ASOMA = 0.3;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** La nube: lo que deriva (unidades), lo que se hincha (0 a 1). */
  deriva: number;
  hincha: number;
  /** La lluvia: la fase del tramo (0 a 1) y la fuerza (0 a 1). */
  lluvia: number;
  fuerza: number;
  /** La chispa que no llega a rayo, y el rayo (0 a 1). */
  chispa: number;
  rayo: number;
  /** La puertita (0 cerrada, 1 abierta de par en par) y la antena (0 guardada, 1 estirada). */
  puerta: number;
  antena: number;
  /**
   * Lo que suena la radio (0 a 1, un golpe) y para qué lado vibra en ese cuadro (−1 a 1). El sonido no se dibuja: se
   * ve en lo que sacude. La radio tiembla en su hueco, la antena vibra, la paja salta y las patas repiquetean.
   */
  suena: number;
  vibra: number;
  /** Lo que se bambolea el bicho en la varilla (grados) y lo que rueda la peana (unidades). */
  baila: number;
  rueda: number;
  /** La pata levantada (grados; negativo la sube). */
  pata: number;
  /** Lo que cuelga: el flequillo, la paja, la etiqueta y la cola (grados). */
  flequillo: number;
  paja: number;
  etiqueta: number;
  cola: number;
  /** El ojo de vidrio que se le cae: cuánto del viaje hizo (0 en la cuenca, 1 de vuelta en la cuenca). */
  ojo: number;
}

/** La pose quieta, la del HTML: tieso en su peana, con la puertita entornada y la antena apenas asomada. */
export const QUIETO: Momento = {
  deriva: 0,
  hincha: 0,
  lluvia: 0,
  fuerza: 0.5,
  chispa: 0,
  rayo: 0,
  puerta: ENTORNADA,
  antena: ASOMA,
  suena: 0,
  vibra: 0,
  baila: 0,
  rueda: 0,
  pata: -12,
  flequillo: 0,
  paja: 0,
  etiqueta: 0,
  cola: 0,
  ojo: 0,
};

/**
 * *"La radio… rata-ta-ta"*: la puertita del pecho abierta de par en par, la radio sonando donde iba el corazón, la
 * antena estirada con el rayo encima, y el bicho en medio compás, tieso. Es el toque quieto y el retrato.
 */
export const SUENA: Momento = {
  ...QUIETO,
  hincha: 1,
  rayo: 0.85,
  puerta: 1,
  antena: 1,
  suena: 1,
  vibra: 1,
  baila: -6,
  rueda: 6,
  pata: -34,
  flequillo: 24,
  paja: 8,
  etiqueta: -18,
  cola: 8,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [NOLATE.x + x * NOLATE.escala, NOLATE.piso + y * NOLATE.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const tramo = (k: number, a: number, b: number): number => Math.min(1, Math.max(0, (k - a) / (b - a)));

/**
 * Por dónde va el ojo que se cae, para una fase de 0 a 1: se suelta, cae a la peana, rebota, rueda para atrás hasta
 * el canto, se queda dudando, vuelve rodando y de un salto se mete en la cuenca. Devuelve lo que se corrió y lo que giró.
 */
export function ojoEn(k: number): { dx: number; dy: number; giro: number } {
  const { baja, rueda } = NOLATE_ARMADO.caida;
  if (k <= 0 || k >= 1) return { dx: 0, dy: 0, giro: 0 };
  const cae = tramo(k, 0.04, 0.2);
  const rebote = Math.abs(Math.sin(tramo(k, 0.2, 0.3) * Math.PI)) * 14;
  const ida = tramo(k, 0.2, 0.5);
  const vuelta = tramo(k, 0.64, 0.86);
  const salta = tramo(k, 0.86, 0.99);
  const s = (v: number): number => v * v * (3 - 2 * v);
  const dx = 6 * cae * (1 - salta) + (rueda - 6) * s(ida) * (1 - s(vuelta));
  const dy = baja * cae * cae * (1 - salta * (2 - salta)) - rebote;
  return { dx, dy: Math.max(0, dy), giro: dx * 9 };
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = NOLATE_ARMADO;
  const [vx, vy] = A.varilla;
  const [hx, hy] = A.hombro;
  const [kx, ky] = A.cola;
  const [cx, cy] = A.cintura;
  const [fx, fy] = A.flequillo;
  const [ex, ey] = A.etiqueta;
  const [nx, ny] = A.nube.centro;
  const [ax, ay] = A.antena.base;
  const [px, py, pw, ph] = A.puerta;
  const [rx0, ry0] = [px + pw / 2, py + ph / 2];
  // La puertita gira en su bisagra: de plana (1) pasa por el canto (0) y queda abierta para el otro lado.
  const hoja = mezclar(1, -0.72, m.puerta);
  const ojo = ojoEn(m.ojo);
  const transform: Record<string, string> = {
    entero: `translate(${NOLATE.x} ${NOLATE.piso}) scale(${NOLATE.escala})`,
    nube: `translate(${n2(m.deriva + nx)} ${ny}) scale(${n2(1 + 0.1 * m.hincha)} ${n2(1 + 0.16 * m.hincha)}) translate(${-nx} ${-ny})`,
    lluvia: `translate(${n2(m.deriva * 0.5)} ${n2(A.tramo * (m.lluvia - Math.floor(m.lluvia)))})`,
    carro: `translate(${n2(m.rueda)} 0)`,
    bicho: `rotate(${n2(m.baila)} ${vx} ${vy})`,
    pata: `rotate(${n2(m.pata)} ${hx} ${hy})`,
    cola: `rotate(${n2(m.cola)} ${kx} ${ky})`,
    // Con cada golpe de la radio la paja salta: se abre desde la cintura.
    paja: `rotate(${n2(m.paja)} ${cx} ${cy}) translate(${cx} ${cy}) scale(${n2(1 + 0.16 * m.suena)}) translate(${-cx} ${-cy})`,
    // La radio tiembla en su hueco, y el parlante se hincha con el golpe.
    radio: `translate(${n2(0.9 * m.vibra * m.suena)} ${n2(-0.7 * m.suena)}) translate(${rx0} ${ry0}) scale(${n2(1 + 0.08 * m.suena)}) translate(${-rx0} ${-ry0})`,
    // El rata-ta-ta, en las patas.
    patas: `translate(${n2(1.2 * m.vibra * m.suena)} 0)`,
    puerta: `translate(${px} 0) scale(${n2(Math.max(0.02, hoja))} 1) translate(${-px} 0)`,
    // Pasado el canto se le ve el revés, que está dibujado del otro lado de la bisagra.
    reves: `translate(${px} 0) scale(${n2(Math.max(0.02, -hoja))} 1) translate(${-px} 0)`,
    antena: `translate(${ax} ${ay}) rotate(${n2(5 * m.vibra * m.suena)}) scale(1 ${n2(Math.max(0.02, m.antena))}) translate(${-ax} ${-ay})`,
    flequillo: `rotate(${n2(m.flequillo)} ${fx} ${fy})`,
    etiqueta: `rotate(${n2(m.etiqueta)} ${ex} ${ey})`,
    ojo: `translate(${n2(ojo.dx)} ${n2(ojo.dy)}) rotate(${n2(ojo.giro)} ${A.ojo.centro[0]} ${A.ojo.centro[1]})`,
  };
  for (const n of [0, 1] as const) {
    const [rx, ry] = A.ruedas[n];
    // La ruedita gira lo que rodó la peana (el radio es 6).
    transform[`rueda-${n + 1}`] = `translate(${rx} ${ry}) rotate(${n2((m.rueda / 6) * (180 / Math.PI))})`;
  }
  const opacity: Record<string, string> = {
    lluvia: n2(0.35 + 0.65 * m.fuerza),
    puerta: hoja > 0 ? '1' : '0',
    reves: hoja > 0 ? '0' : '1',
    chispa: n2(m.chispa),
    rayo: n2(m.rayo),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: al costado de la nube, en el recinto. */
export const VERSO: Punto = alRecinto([30, -310]);
