/**
 * Los números de la rana rubia (`D-73`, vigesimoséptima vuelta): dónde toma sol arriba de la pila de containers,
 * cómo está armada y cómo se pone. Los lee el dibujo (`arte-rana.ts`), para la pose quieta del HTML y para el
 * retrato, y la conducta (`scripts/bestiario/rana.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de la rana**: el (0, 0) es el techo del container debajo del medio de la reposera; arriba es negativo.
 *   Está recostada con la cabeza a la **izquierda** y mira a la derecha, para el lado del farol. Está dibujada al
 *   doble, y la escena la achica con `RANA.escala`.
 * - **El del recinto** (900 × 640, el de los astilleros): arriba de la pila, a la derecha del pibe, donde estaba
 *   su silueta. En el camino el piso es más ancho y todo lo fijo se corre con `k` (`K_ENTORNO`): el marco la
 *   corre `ancla · (k − 1)`.
 */

import type { P } from './trazos.ts';
import { ASTILLERO } from './rig-entornos.ts';

export type Punto = P;

/** Dónde está la reposera, y lo que mide. El piso es el techo de la pila. */
export const RANA = { x: 252, piso: ASTILLERO.pila.arriba + 1, escala: 0.5 } as const;

/** Cómo está armada, en sus coordenadas. */
export const RANA_ARMADO = {
  /** El medio de la panza: de acá respira. */
  panza: [-16, -42] as Punto,
  /** El cogote: de acá gira la cabeza, y de acá se infla el buche. */
  cuello: [-42, -58] as Punto,
  buche: [-36, -60] as Punto,
  /** Los ojos, saltones, arriba de la cabeza: el 1 es el de lejos. Y lo que miden. */
  ojos: [[-44, -92], [-64, -89]] as readonly [Punto, Punto],
  radio: 9,
  /** La comisura de la boca de este lado: de acá sale la lengua. */
  boca: [-30, -70] as Punto,
  /** Para dónde tira la lengua (grados) y cuánto mide estirada. */
  lengua: { giro: -34, largo: 96 },
  /** El hombro del brazo del reflector. */
  hombro: [-30, -52] as Punto,
  /** El tobillo de la pierna cruzada: de acá mueve el pie. */
  tobillo: [58, -40] as Punto,
  /** De dónde cuelga la etiqueta del alquiler, en el respaldo de la reposera. */
  etiqueta: [-82, -50] as Punto,
  /** Dónde anda la mosca cuando nadie la molesta, y el radio de la vuelta. */
  mosca: { centro: [40, -112] as Punto, radio: [26, 10] as Punto },
} as const;

/** Adónde van los anteojos levantados: a la frente, arriba de la peluca. */
export const SUBE = [-7, -23] as const;
/** Lo que crece el buche inflado a pleno. */
export const INFLA = 2.6;
/** Lo que sube de la reposera cuando el buche la levanta, en sus unidades. */
export const FLOTA = 16;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** La respiración (−1 a 1). */
  respira: number;
  /** El buche (0 desinflado, 1 a pleno) y lo que la levanta de la reposera (0 a 1). */
  buche: number;
  flota: number;
  /** Cuánto gira la cabeza en el cogote (grados; negativo levanta la trompa). */
  cabeza: number;
  /** Los anteojos (0 puestos, 1 levantados a la frente). */
  anteojos: number;
  /** Los párpados (0 abiertos, 1 cerrados) y las pupilas (corrimiento). */
  parpado: number;
  pupila: readonly [number, number];
  /** La peluca: lo que se corrió, lo que saltó y lo que se torció (grados). */
  peluca: readonly [number, number, number];
  /** El pie de la pierna cruzada (grados) y el brazo del reflector (grados). */
  pie: number;
  brazo: number;
  /** La lengua (0 adentro, 1 estirada del todo). */
  lengua: number;
  /** La etiqueta del alquiler, que cuelga (grados). */
  etiqueta: number;
  /** La mosca: dónde anda, desde su centro, y cuánto se ve. */
  mosca: readonly [number, number];
  moscaSe: number;
}

/** La pose quieta, la del HTML: recostada, con los anteojos puestos, el pie colgando y el reflector en el mentón. */
export const QUIETO: Momento = {
  respira: 0,
  buche: 0,
  flota: 0,
  cabeza: 0,
  anteojos: 0,
  parpado: 0.55,
  pupila: [0, 0],
  peluca: [0, 0, 0],
  pie: 0,
  brazo: 0,
  lengua: 0,
  etiqueta: 0,
  mosca: [RANA_ARMADO.mosca.radio[0], 0],
  moscaSe: 1,
};

/**
 * Croa: los anteojos en la frente, los ojos abiertos, el buche inflado a pleno, que la levanta de la reposera,
 * y la peluca corrida. Es el toque quieto y el retrato.
 */
export const CROA: Momento = {
  ...QUIETO,
  buche: 1,
  flota: 1,
  cabeza: -10,
  anteojos: 1,
  parpado: 0.1,
  pupila: [2.4, 1],
  peluca: [-8, -6, -16],
  pie: -24,
  brazo: 30,
  etiqueta: 14,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [RANA.x + x * RANA.escala, RANA.piso + y * RANA.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = RANA_ARMADO;
  const [px, py] = A.panza;
  const [nx, ny] = A.cuello;
  const [bx, by] = A.buche;
  const [mx, my] = A.boca;
  const [hx, hy] = A.hombro;
  const [tx, ty] = A.tobillo;
  const [ex, ey] = A.etiqueta;
  const [cx, cy] = A.mosca.centro;
  const hincha = 1 + 0.04 * m.respira;
  const buche = 0.5 + (INFLA - 0.5) * m.buche + 0.08 * m.respira;
  const transform: Record<string, string> = {
    entero: `translate(${RANA.x} ${RANA.piso}) scale(${RANA.escala})`,
    cuerpo: `translate(0 ${n2(-FLOTA * m.flota)}) rotate(${n2(-5 * m.flota)} 20 -20)`,
    panza: `translate(${px} ${py}) scale(${n2(hincha)}) translate(${-px} ${-py})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    buche: `translate(${bx} ${by}) scale(${n2(buche)}) translate(${-bx} ${-by})`,
    // Levantados van a la frente, bien arriba de los ojos: pegados a los ojos se leían como una mata negra.
    anteojos: `translate(${n2(SUBE[0] * m.anteojos)} ${n2(SUBE[1] * m.anteojos)}) rotate(${n2(-16 * m.anteojos)} ${A.ojos[1][0]} ${A.ojos[1][1]})`,
    peluca: `translate(${n2(m.peluca[0])} ${n2(m.peluca[1])}) rotate(${n2(m.peluca[2])} -70 -96)`,
    pie: `rotate(${n2(m.pie)} ${tx} ${ty})`,
    brazo: `rotate(${n2(m.brazo)} ${hx} ${hy})`,
    lengua: `rotate(${A.lengua.giro} ${mx} ${my}) translate(${mx} ${my}) scale(${n2(Math.max(0.02, m.lengua))} 1) translate(${-mx} ${-my})`,
    etiqueta: `rotate(${n2(m.etiqueta)} ${ex} ${ey})`,
    mosca: `translate(${n2(cx + m.mosca[0])} ${n2(cy + m.mosca[1])})`,
  };
  for (const n of [0, 1] as const) {
    const [ox, oy] = A.ojos[n];
    const top = oy - A.radio - 0.6;
    transform[`parpado-${n + 1}`] = `translate(${ox} ${top}) scale(1 ${n2(Math.max(0.02, m.parpado))}) translate(${-ox} ${-top})`;
    transform[`pupila-${n + 1}`] = `translate(${n2(m.pupila[0])} ${n2(m.pupila[1])})`;
  }
  const opacity: Record<string, string> = {
    lengua: m.lengua > 0.03 ? '1' : '0',
    mosca: n2(m.moscaSe),
  };
  return { transform, opacity };
}

/** La punta de la lengua estirada del todo, en sus coordenadas: ahí tiene que estar la mosca para que la agarre. */
export function puntaDeLaLengua(k = 1): Punto {
  const A = RANA_ARMADO;
  const a = (A.lengua.giro * Math.PI) / 180;
  return [A.boca[0] + Math.cos(a) * A.lengua.largo * k, A.boca[1] + Math.sin(a) * A.lengua.largo * k];
}

/** Dónde dice su verso: arriba de la peluca, en el recinto. */
export const VERSO: Punto = alRecinto([-30, -150]);
