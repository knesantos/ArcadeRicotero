/**
 * Los números del Alien Duce (`D-73`, vigesimosegunda vuelta): dónde está, adentro de la pantalla de ojo de
 * buey de la tele de Cybersiberia, cómo está armado y cómo se pone. Los lee el dibujo (`arte-alien.ts`),
 * para la pose quieta del HTML y para el retrato, y la conducta (`scripts/bestiario/alien.ts`), que se lleva
 * esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del Alien**: el (0, 0) es el medio de la pantalla; arriba es negativo. Lo que queda afuera del
 *   círculo (`PANTALLA.r`) no se ve, salvo lo que se sale de la tele: el ticket, el bollo y los puntos de luz.
 *   Está dibujado a dos veces, y la escena lo achica con `ALIEN.escala`.
 * - **El del recinto** (900 × 640): la pantalla de la tele grande (`CYBER.tele.pantalla` en `rig-entornos.ts`),
 *   con la consola abajo y la nieve más abajo todavía.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde está la pantalla en el recinto, y lo que mide él. */
export const ALIEN = { x: 450, y: 290, escala: 0.5 } as const;

/** La pantalla, en sus coordenadas: lo que se ve de él es lo de adentro de este círculo. */
export const PANTALLA = { r: 142 } as const;

/** Cómo está armado, en sus coordenadas. */
export const ALIEN_ARMADO = {
  /** El pecho, de donde se acerca al vidrio y se hamaca. */
  pecho: [0, 96] as Punto,
  cuello: [0, 54] as Punto,
  /** La bola de efectos: el centro del cráneo de espejos y su radio. */
  bola: [0, -72] as Punto,
  radioBola: 76,
  ojos: [[-20, 10], [20, 10]] as readonly [Punto, Punto],
  /** La boca, de donde sale el ticket con el evangelio. */
  boca: [0, 36] as Punto,
  /** Las antenas: de dónde salen en la bola y dónde tienen la lamparita. */
  antenas: [[[-34, -130], [-46, -126]], [[34, -130], [48, -124]]] as readonly [readonly [Punto, Punto], readonly [Punto, Punto]],
  /** El brazo del puño: el hombro y el puño en alto. */
  hombro: [74, 92] as Punto,
  puno: [96, 6] as Punto,
  /** Dónde cae el bollo escupido, afuera de la tele, en la nieve. */
  cae: [214, 366] as Punto,
} as const;

/** Lo que mide el ticket desenrollado, en sus coordenadas. */
export const TICKET = { largo: 300, ancho: 30 } as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Cuánto se acerca al vidrio (0 en su lugar, 1 aplastado contra la pantalla), y cuánto se hamaca (grados). */
  acerca: number;
  hamaca: number;
  /** Cuánto levanta la quijada (grados, para arriba negativo), y cuánto abre la boca (0 a 1). */
  cabeza: number;
  boca: number;
  /** Cuánto gira el brazo del puño en el hombro (grados). */
  puno: number;
  /** Lo que se mueven las antenas (grados) y lo prendidas que están las lamparitas (0 a 1). */
  antenas: number;
  lamparas: number;
  /** La bola de efectos: cuánto giró (grados de los puntos de luz) y lo prendidos que están los puntos (0 a 1). */
  bola: number;
  puntos: number;
  /** Las manos aplastadas contra el vidrio (0 a 1), y la interferencia (0 a 1, y dónde está la franja). */
  palmas: number;
  ruido: number;
  franja: number;
  /** El ticket del evangelio: cuánto salió (0 a 1). El bollo escupido: cuánto voló (0 a 1). */
  ticket: number;
  bollo: number;
}

/** La pose quieta, la del HTML: con la quijada para arriba, la boca cerrada y la bola apagada. */
export const QUIETO: Momento = {
  acerca: 0,
  hamaca: 0,
  cabeza: -6,
  boca: 0,
  puno: 0,
  antenas: 0,
  lamparas: 0.4,
  bola: 0,
  puntos: 0.15,
  palmas: 0,
  ruido: 0,
  franja: 0,
  ticket: 0,
  bollo: 0,
};

/**
 * *"Va escribiendo su evangelio en los tickets de Carrefour"*: la boca abierta, el ticket afuera de la tele
 * hasta la nieve, el puño en alto y la bola de efectos prendida. Es el toque quieto y el retrato.
 */
export const EVANGELIO: Momento = {
  ...QUIETO,
  cabeza: -14,
  boca: 1,
  puno: -24,
  antenas: 10,
  lamparas: 1,
  bola: 30,
  puntos: 1,
  ticket: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [ALIEN.x + x * ALIEN.escala, ALIEN.y + y * ALIEN.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Dónde está el bollo escupido para un vuelo de 0 a 1: sale de la boca y cae en la nieve, en arco. */
export function bolloEn(k: number): Punto {
  const [bx, by] = ALIEN_ARMADO.boca;
  const [cx, cy] = ALIEN_ARMADO.cae;
  return [bx + (cx - bx) * k, by + (cy - by) * k - 160 * Math.sin(Math.PI * k)];
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = ALIEN_ARMADO;
  const [px, py] = A.pecho;
  const [cx, cy] = A.cuello;
  const [hx, hy] = A.hombro;
  const [bx, by] = A.boca;
  const [kx, ky] = bolloEn(m.bollo);
  // Al acercarse al vidrio se agranda desde el pecho, y sube un poco: la cara llena la pantalla.
  const s = 1 + 0.42 * m.acerca;
  const transform: Record<string, string> = {
    entero: `translate(${ALIEN.x} ${ALIEN.y}) scale(${ALIEN.escala})`,
    busto: `translate(0 ${n2(-40 * m.acerca)}) rotate(${n2(m.hamaca)} ${px} ${py + 60}) translate(${px} ${py}) scale(${n2(s)}) translate(${-px} ${-py})`,
    cabeza: `rotate(${n2(m.cabeza)} ${cx} ${cy})`,
    quijada: `translate(0 ${n2(9 * m.boca)})`,
    brazo: `rotate(${n2(m.puno)} ${hx} ${hy})`,
    'antena-1': `rotate(${n2(-m.antenas)} ${A.antenas[0][0][0]} ${A.antenas[0][0][1]})`,
    'antena-2': `rotate(${n2(m.antenas)} ${A.antenas[1][0][0]} ${A.antenas[1][0][1]})`,
    // Los puntos de luz de la bola giran alrededor de la tele.
    puntos: `rotate(${n2(m.bola)} 0 0)`,
    // Los destellos de los espejitos giran con la bola, sobre la bola.
    brillos: `rotate(${n2(m.bola * 1.5)} ${A.bola[0]} ${A.bola[1]})`,
    franja: `translate(0 ${n2(-140 + 280 * m.franja)})`,
    // El ticket se desenrolla para abajo desde la boca.
    ticket: `translate(${bx} ${by}) scale(1 ${n2(Math.max(0.001, m.ticket))}) translate(${-bx} ${-by})`,
    bollo: `translate(${n2(kx - bx)} ${n2(ky - by)}) rotate(${n2(540 * m.bollo)} ${bx} ${by})`,
  };
  const opacity: Record<string, string> = {
    boca: n2(m.boca),
    lamparas: n2(m.lamparas),
    puntos: n2(m.puntos),
    brillos: n2(0.3 + 0.7 * m.puntos),
    palmas: n2(m.palmas),
    ruido: n2(m.ruido),
    ticket: n2(m.ticket > 0.01 ? 1 : 0),
    bollo: n2(m.bollo > 0 && m.bollo < 1.2 ? 1 : 0),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la antena de la tele, en el recinto. */
export const VERSO: Punto = alRecinto([0, -170]);
