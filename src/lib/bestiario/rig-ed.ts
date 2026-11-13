/**
 * Los números de Mister Ed y Huesito (`D-73`, vigesimoctava vuelta): dónde hacen su número en el templo, cómo
 * está armado y cómo se pone. Los lee el dibujo (`arte-ed.ts`), para la pose quieta del HTML y para el retrato,
 * y la conducta (`scripts/bestiario/ed.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del número**: el (0, 0) es el piso debajo del medio del tambor del lavarropas; arriba es negativo. El caballo
 *   está parado en dos patas arriba del tambor, mirando a la **derecha**, y Huesito en el lomo. Está dibujado al
 *   doble y la escena lo achica con `ED.escala`.
 * - **El del recinto** (el del templo, que arranca antes del cero: `MARCO_DEL_RECINTO`): entre el medallón de Momo
 *   y el Morta, donde el piso del templo está más despejado. El templo va entero al camino, así que ahí queda igual.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde hacen el número, y lo que miden. El piso es el del templo. */
export const ED = { x: 494, piso: 586, escala: 0.68 } as const;

/** Cómo está armado, en sus coordenadas. */
export const ED_ARMADO = {
  /** El tambor: el centro, el radio de afuera, y lo que ocupa de alto la pila de caballo (los pies están en la cima). */
  tambor: { centro: [0, -40] as Punto, radio: 40, cima: -80 },
  /** Los pies: de acá se inclina todo el caballo. */
  pies: [-8, -80] as Punto,
  /** La cadera, de donde giran las patas, y la raíz de la cola. */
  cadera: [-6, -128] as Punto,
  cola: [-38, -124] as Punto,
  /** El cogote: de acá gira la cabeza, y la crin cuelga de acá. */
  cuello: [40, -248] as Punto,
  crin: [30, -244] as Punto,
  /** La bisagra de la mandíbula, el ojo (de la cara, en sus coordenadas absolutas) y lo que mide. */
  mandibula: [54, -218] as Punto,
  ojo: [56, -244] as Punto,
  radio: 6.4,
  /** Los hombros de los dos brazos: el 0 es el de lejos, y de donde cuelga la jaula. */
  hombros: [[30, -170], [26, -164]] as readonly [Punto, Punto],
  jaula: [76, -190] as Punto,
  /** Donde apoya Huesito, en el lomo, en las coordenadas del caballo; y su altura. */
  lomo: [-15, -146] as Punto,
  /** El hueco de la red donde se cae: el centro. */
  hueco: [-66, 6] as Punto,
  /** De dónde suben las burbujas de jabón. */
  burbujas: [[-52, -4], [50, -8], [-24, 2]] as readonly Punto[],
} as const;

/** Lo que gira la cabeza para arriba cuando relincha, y lo que se abre la mandíbula a pleno (grados). */
export const RELINCHA = -22;
export const ABRE_LA_BOCA = 24;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** La respiración (−1 a 1). */
  respira: number;
  /** El tambor: lo que rodó (unidades), lo que giró (grados), lo que giró la ropa, y lo que saltó (unidades). */
  tx: number;
  rueda: number;
  ropa: number;
  salto: number;
  /** El caballo: cuánto se inclina entero desde los pies (grados; negativo, para atrás), y lo que giran las patas, la cola y la crin. */
  incl: number;
  patas: number;
  cola: number;
  crin: number;
  /** La cabeza (grados; negativo levanta el hocico), la mandíbula (0 cerrada, 1 a pleno), el párpado (0 abierto, 1 cerrado) y la pupila. */
  cabeza: number;
  mandibula: number;
  parpado: number;
  pupila: readonly [number, number];
  /** Los brazos: el de lejos, el de cerca (grados). */
  brazoL: number;
  brazoC: number;
  /** La jaula que cuelga del de lejos (grados) y el canario: lo que salta (unidades) y cuánto abre el pico. */
  jaula: number;
  canario: readonly [number, number];
  /** Huesito: lo que se corrió del lomo (x, y), cuánto giró (grados), cuánto se agachó (1 parado, menos es agachado), los brazos y el cráneo (grados). */
  h: readonly [number, number];
  hgiro: number;
  hagacha: number;
  hbrazos: number;
  hcraneo: number;
  /** Cuánto acompaña la inclinación del caballo (1 apoyado en el lomo, 0 suelto en el aire o en el piso). */
  sobre: number;
  /** Las burbujas de jabón: la fase de la vuelta (0 a 1) y cuánto hay. */
  burbuja: number;
  hay: number;
  /** La red, que tiembla cuando algo cae (0 a 1). */
  red: number;
}

/** La pose quieta, la del HTML: en equilibrio sobre el tambor, la boca cerrada, Huesito en el lomo con los brazos abiertos. */
export const QUIETO: Momento = {
  respira: 0,
  tx: 0,
  rueda: 0,
  ropa: 0,
  salto: 0,
  incl: 0,
  patas: 0,
  cola: 0,
  crin: 0,
  cabeza: 0,
  mandibula: 0.08,
  parpado: 0.3,
  pupila: [0, 0],
  brazoL: 0,
  brazoC: 0,
  jaula: 0,
  canario: [0, 0],
  h: [0, 0],
  hgiro: 0,
  hagacha: 1,
  hbrazos: 0,
  hcraneo: 0,
  sobre: 1,
  burbuja: 0.2,
  hay: 0.8,
  red: 0,
};

/**
 * *"Van a saltar otra vez sin red"*: relincha parado de manos con la boca abierta, el tambor se le va, la jaula
 * sale volando de su pezuña, y Huesito, patas para arriba, en el aire, con la red debajo con un agujero. Es el toque
 * quieto y el retrato.
 */
export const SALTA: Momento = {
  ...QUIETO,
  tx: 10,
  rueda: -50,
  ropa: 90,
  salto: 8,
  incl: -13,
  patas: -7,
  cola: 22,
  crin: -14,
  cabeza: RELINCHA,
  mandibula: 1,
  parpado: 0,
  pupila: [1.6, -0.6],
  brazoL: -34,
  brazoC: -46,
  jaula: 34,
  canario: [9, 1],
  h: [-52, -92],
  hgiro: -168,
  hagacha: 1,
  hbrazos: 22,
  hcraneo: -10,
  sobre: 0,
  red: 0.7,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [ED.x + x * ED.escala, ED.piso + y * ED.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const rad = (g: number): number => (g * Math.PI) / 180;

/** Gira `p` alrededor de `c` los grados de siempre: el mismo giro que el `rotate` de SVG. */
function gira([x, y]: Punto, [cx, cy]: Punto, g: number): Punto {
  const a = rad(g);
  return [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)];
}

/** Dónde apoyan los pies de Huesito en un momento: en el lomo, que sube con el caballo y el tambor, más lo que se corrió. */
export function dondeEstaHuesito(m: Momento): Punto {
  const A = ED_ARMADO;
  const [lx, ly] = gira(A.lomo, A.pies, m.incl);
  // Siempre lleva lo que se corrió el tambor y lo que saltó; en el aire, `h` lo despega del lomo.
  return [lx + m.tx + m.h[0], ly - m.salto + m.h[1]];
}

/** Lo que hay que correr a Huesito del lomo para que los pies estén en `mundo` (en las coordenadas del número), con el caballo como esté. */
export function correrHasta(m: Momento, mundo: Punto): Punto {
  const [lx, ly] = gira(ED_ARMADO.lomo, ED_ARMADO.pies, m.incl);
  return [mundo[0] - lx - m.tx, mundo[1] - ly + m.salto];
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = ED_ARMADO;
  const [tcx, tcy] = A.tambor.centro;
  const [px, py] = A.pies;
  const [hx, hy] = A.cadera;
  const [kx, ky] = A.cola;
  const [nx, ny] = A.cuello;
  const [cx, cy] = A.crin;
  const [bx, by] = A.mandibula;
  const [ox, oy] = A.ojo;
  const [wx, wy] = dondeEstaHuesito(m);
  const respira = 1 + 0.012 * m.respira;
  const transform: Record<string, string> = {
    entero: `translate(${ED.x} ${ED.piso}) scale(${ED.escala})`,
    cabalgata: `translate(${n2(m.tx)} ${n2(-m.salto)})`,
    tambor: `rotate(${n2(m.rueda)} ${tcx} ${tcy})`,
    ropa: `rotate(${n2(m.ropa)} ${tcx} ${tcy})`,
    ed: `rotate(${n2(m.incl)} ${px} ${py})`,
    patas: `rotate(${n2(m.patas)} ${hx} ${hy})`,
    cuerpo: `translate(${-28} ${-150}) scale(${n2(respira)}) translate(${28} ${150})`,
    cola: `rotate(${n2(m.cola)} ${kx} ${ky})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    mandibula: `rotate(${n2(ABRE_LA_BOCA * m.mandibula)} ${bx} ${by})`,
    crin: `rotate(${n2(m.crin)} ${cx} ${cy})`,
    parpado: `translate(${ox} ${n2(oy - A.radio - 0.6)}) scale(1 ${n2(Math.max(0.02, m.parpado))}) translate(${-ox} ${n2(-(oy - A.radio - 0.6))})`,
    pupila: `translate(${n2(m.pupila[0])} ${n2(m.pupila[1])})`,
    'brazo-lejos': `rotate(${n2(m.brazoL)} ${A.hombros[0][0]} ${A.hombros[0][1]})`,
    'brazo-cerca': `rotate(${n2(m.brazoC)} ${A.hombros[1][0]} ${A.hombros[1][1]})`,
    // La jaula cuelga de la pezuña de lejos, que ya giró con el brazo: lo que gira acá es el balanceo propio, más lo que el brazo la lleva.
    jaula: `rotate(${n2(m.jaula)} ${A.jaula[0]} ${A.jaula[1]})`,
    canario: `translate(0 ${n2(-m.canario[0])})`,
    huesito: `translate(${n2(wx)} ${n2(wy)}) rotate(${n2(m.hgiro + m.incl * 0.8 * m.sobre)}) scale(1 ${n2(m.hagacha)})`,
    'hueso-brazos': `rotate(${n2(m.hbrazos)} 0 -70)`,
    'hueso-craneo': `rotate(${n2(m.hcraneo)} 0 -75)`,
    red: `translate(${n2(A.hueco[0])} 6) scale(${n2(1 + 0.03 * m.red)} ${n2(1 - 0.06 * m.red)}) translate(${-A.hueco[0]} -6)`,
  };
  for (const i of [0, 1, 2] as const) {
    const fase = (m.burbuja + i / 3) % 1;
    const [bbx, bby] = A.burbujas[i]!;
    transform[`burbuja-${i + 1}`] = `translate(${n2(bbx + 6 * Math.sin((fase + i) * 6.28))} ${n2(bby - 54 * fase)}) scale(${n2(0.7 + 0.9 * fase)})`;
  }
  const f = (v: number): string => n2(Math.min(1, Math.max(0, v)));
  const opacity: Record<string, string> = {
    'burbuja-1': f(Math.sin(((m.burbuja + 0) % 1) * Math.PI) * m.hay),
    'burbuja-2': f(Math.sin(((m.burbuja + 1 / 3) % 1) * Math.PI) * m.hay),
    'burbuja-3': f(Math.sin(((m.burbuja + 2 / 3) % 1) * Math.PI) * m.hay),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la cabeza del caballo, en el recinto. */
export const VERSO: Punto = alRecinto([40, -290]);
