/**
 * Los números del que duerme colgado (`D-73`, vigésima vuelta): de dónde cuelga en el árbol del gran
 * bonete, cómo está armado y cómo se pone. Los lee el dibujo (`arte-colgado.ts`), para la pose quieta del
 * HTML y para el retrato, y la conducta (`scripts/bestiario/colgado.ts`), que se lleva esto y nada que
 * dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del colgado**: el (0, 0) es donde las rodillas se enganchan en la rama; está cabeza abajo, así
 *   que lo positivo es para abajo, hacia la tierra. Dibujado a dos veces, la escena lo achica.
 * - **El del recinto** (900 × 640): cuelga de la rama soldada (`ARBOL.soldada`), a la derecha del tronco,
 *   donde antes estaba pintada su sombra.
 */

import { ARBOL } from './rig-entornos.ts';
import { rot, type P } from './trazos.ts';

export type Punto = P;

const { x0, y0, x1, y1 } = ARBOL.soldada;
const X = 612;
/** Dónde cuelga: el punto de la rama soldada donde se enganchan las rodillas, y lo que mide. */
export const COLGADO = { x: X, rama: y0 + ((y1 - y0) * (X - x0)) / (x1 - x0), escala: 0.52 } as const;

/** Cómo está armado, en las coordenadas del colgado (cabeza abajo). */
export const COLGADO_ARMADO = {
  /** De acá se hamaca todo lo que cuelga: las rodillas en la rama. */
  rodillas: [0, 0] as Punto,
  caderas: [0, 54] as Punto,
  /** Los hombros, abajo: de acá se abre cada ala del saco cuando se despierta. */
  hombros: [[-18, 134], [18, 134]] as readonly [Punto, Punto],
  /** El cuello y la cara (dada vuelta). */
  cuello: [0, 146] as Punto,
  cara: [0, 168] as Punto,
  /** La coronilla, lo más bajo de la cabeza: de acá cuelga el gorro de dormir. */
  coronilla: [0, 188] as Punto,
  /** El dedo donde está sentado el temor: la punta, y el carozo arriba. */
  dedo: [-24, 86] as Punto,
  carozo: [-24, 74] as Punto,
  /** El sueño: la nube de tiza al costado de la cabeza, donde juegan los angelitos. */
  sueno: { centro: [104, 196] as Punto, rx: 70, ry: 54 },
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Cuánto se hamaca desde las rodillas, y cuánto gira la cabeza (grados). */
  hamaca: number;
  cabeza: number;
  /** El gorro de dormir, que cuelga y se hamaca solo (grados). */
  gorro: number;
  /** Las dos alas del saco: 0 cerradas, envolviéndolo como un murciélago; 1 abiertas del todo. */
  alas: number;
  /** Los ojos (0 cerrados, 1 abiertos) y la boca (0 cerrada, 1 abierta del susto o del ronquido). */
  ojos: number;
  boca: number;
  /** El carozo: lo que se aparta del dedo (en las del colgado) y cuánto gira. */
  carozo: { x: number; y: number; giro: number };
  /** La gota de almíbar que se le cae al carozo: cuánto bajó desde él, y cuánto se ve. */
  gota: { y: number; o: number };
  /** El sueño: tamaño, cuánto se ve, por dónde van los angelitos (radianes) y el fogonazo de los tiros. */
  sueno: { s: number; o: number };
  angelitos: number;
  tiro: number;
  /** El sueño que revienta cuando lo despiertan: de 0 a 1. */
  pop: number;
}

/** La pose quieta, la del HTML: dormido, envuelto en el saco, soñando angelitos. */
export const QUIETO: Momento = {
  hamaca: 0,
  cabeza: 0,
  gorro: 0,
  alas: 0,
  ojos: 0,
  boca: 0,
  carozo: { x: 0, y: 0, giro: 0 },
  gota: { y: 0, o: 0 },
  sueno: { s: 1, o: 1 },
  angelitos: 0.6,
  tiro: 0,
  pop: 0,
};

/**
 * *"¡Es hora de levantarse, querido!"*: despierto de golpe, con los ojos como platos, el saco abierto
 * como alas, el sueño reventado y el carozo saltando del dedo. Es el toque quieto y el retrato.
 */
export const LEVANTARSE: Momento = {
  ...QUIETO,
  hamaca: 14,
  cabeza: -8,
  gorro: 24,
  alas: 1,
  ojos: 1,
  boca: 1,
  carozo: { x: -6, y: -30, giro: -40 },
  sueno: { s: 1.2, o: 0 },
  pop: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto, hamaca = 0): Punto => {
  const [rx, ry] = rot([x, y], COLGADO_ARMADO.rodillas, hamaca);
  return [COLGADO.x + rx * COLGADO.escala, COLGADO.rama + ry * COLGADO.escala];
};

/** Dónde va un angelito en el sueño (en las del colgado), y para qué lado mira. */
export function enElSueno(fase: number, i: number): { punto: Punto; mira: 1 | -1 } {
  const { centro: [cx, cy], rx, ry } = COLGADO_ARMADO.sueno;
  const a = fase + i * Math.PI;
  return { punto: [cx + Math.cos(a) * rx * 0.48, cy + Math.sin(a) * ry * 0.34 - 4], mira: Math.sin(a) > 0 ? 1 : -1 };
}

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Lo que se abre cada ala del saco, en grados, con `alas` en 1. */
export const ABRE_ALAS = 64;

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = COLGADO_ARMADO;
  const [cx, cy] = A.cuello;
  const [gx, gy] = A.coronilla;
  const [kx, ky] = A.carozo;
  const { centro: [sx, sy] } = A.sueno;
  const transform: Record<string, string> = {
    entero: `translate(${COLGADO.x} ${n2(COLGADO.rama)}) scale(${COLGADO.escala})`,
    hamaca: `rotate(${n2(m.hamaca)} 0 0)`,
    cabeza: `rotate(${n2(m.cabeza)} ${cx} ${cy})`,
    gorro: `rotate(${n2(m.gorro)} ${gx} ${gy})`,
    // Cada ala gira desde su hombro, para afuera: la de la izquierda en contra de las agujas.
    'ala-1': `rotate(${n2(-ABRE_ALAS * m.alas)} ${A.hombros[0][0]} ${A.hombros[0][1]})`,
    'ala-2': `rotate(${n2(ABRE_ALAS * m.alas)} ${A.hombros[1][0]} ${A.hombros[1][1]})`,
    carozo: `translate(${n2(m.carozo.x)} ${n2(m.carozo.y)}) rotate(${n2(m.carozo.giro)} ${kx} ${ky})`,
    gota: `translate(0 ${n2(m.gota.y)})`,
    sueno: `translate(${sx} ${sy}) scale(${n2(Math.max(0.01, m.sueno.s))}) translate(${-sx} ${-sy})`,
    pop: `translate(${sx} ${sy}) scale(${n2(0.6 + 0.8 * m.pop)}) translate(${-sx} ${-sy})`,
  };
  for (const i of [0, 1] as const) {
    const { punto: [x, y], mira } = enElSueno(m.angelitos, i);
    transform[`angelito-${i + 1}`] = `translate(${n2(x)} ${n2(y)}) scale(${mira} 1)`;
  }
  const opacity: Record<string, string> = {
    ojos: m.ojos > 0.02 ? '1' : '0',
    dormido: m.ojos > 0.02 ? '0' : '1',
    boca: n2(m.boca),
    gota: n2(m.gota.o),
    sueno: n2(m.sueno.o),
    'tiro-1': n2(m.tiro),
    'tiro-2': n2(m.tiro),
    pop: n2(m.pop > 0 && m.pop < 1 ? 1 - m.pop : 0),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: debajo de su cabeza, en el recinto (está cabeza abajo). */
export const VERSO: Punto = alRecinto([0, 214]);
