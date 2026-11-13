/**
 * Los números del moscón zumbón (`D-73`, vigesimosexta vuelta): dónde está el vaso boca abajo en la mesa servida,
 * cómo está armado el moscón y cómo se mueve adentro. Los lee el dibujo (`arte-moscon.ts`), para la pose quieta
 * del HTML y para el retrato, y la conducta (`scripts/bestiario/moscon.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del vaso**: el (0, 0) es el mantel en el medio de la boca del vaso; arriba es negativo. El moscón se
 *   dibuja mirando a la derecha, en el (0, 0), y la isla lo lleva por adentro del vaso con `pos` y lo gira. Está
 *   dibujado al doble, y la escena lo achica con `MOSCON.escala`.
 * - **El del recinto** (900 × 640): en la punta derecha del mantel, donde el piso de la mesa pintaba el vaso
 *   (`MESA.vaso` en `rig-entornos.ts`), al lado del frasco de miel y de las hormigas.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde está el vaso, y lo que mide. */
export const MOSCON = { x: 760, piso: 400, escala: 0.5 } as const;

/** El vaso boca abajo, en sus unidades: la boca apoyada en el mantel, el culo arriba, y el vidrio. */
export const VASO = { boca: 38, culo: 32, alto: 118, vidrio: 5 } as const;

/** Cómo está armado el moscón, en sus coordenadas: el (0, 0) es el mantel debajo de la panza, parado. */
export const MOSCON_ARMADO = {
  /** El medio del cuerpo: de acá gira entero y de acá se da vuelta cuando cae de espaldas. */
  centro: [0, -11] as Punto,
  /** De dónde salen las alas, en el tórax. */
  alas: [-2, -16] as Punto,
  /** El cuello: de acá gira la cabeza. */
  cuello: [12, -14] as Punto,
  /** Los ojos compuestos, rojos, y lo que miden. */
  ojos: [
    { centro: [16, -18] as Punto, radio: [5, 5.6] as Punto },
    { centro: [20, -14] as Punto, radio: [4, 4.4] as Punto },
  ],
  /** La trompa, en la punta de la cabeza. */
  trompa: [24, -8] as Punto,
  /** De dónde salen las patas de adelante, que se frotan. */
  patasDel: [9, -8] as Punto,
  /** Hasta dónde llega el moscón adentro del vaso, en sus unidades: el vidrio frena. */
  tope: { x: VASO.boca - 12, arriba: -(VASO.alto - 14) },
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Dónde está el moscón adentro del vaso (unidades), y hacia dónde apunta (grados; 0 es a la derecha). */
  pos: readonly [number, number];
  rumbo: number;
  /** Si va de espaldas (0 parado, 1 patas arriba). */
  panza: number;
  /** La respiración del abdomen (−1 a 1). */
  respira: number;
  /** Las alas: cuánto se abren (grados) y el zumbido (0 quietas, 1 a toda velocidad). */
  alas: number;
  zumba: number;
  /** La fase del zumbido, para batir las alas: la pone la conducta con el reloj. */
  bate: number;
  /** Las patas de adelante que se frotan (grados) y las que patalean de espaldas (grados). */
  frota: number;
  patalea: number;
  /** Lo que ladea la cabeza (grados). */
  cabeza: number;
  /** El vaho del moscón en el vidrio (0 nada, 1 empañado), dónde (unidades del vaso), y los rayones (0 a 1). */
  vaho: number;
  vahoEn: readonly [number, number];
  rayones: number;
  /** Las estrellitas del golpe (0 a 1) y cuánto giran (grados). */
  estrellas: number;
  giroEstrellas: number;
  /** El vaso: el temblor (unidades, de costado) y lo que se corrió del lugar (unidades). */
  tiembla: number;
  corre: number;
}

/** La pose quieta, la del HTML: parado en el mantel adentro del vaso, mirando el vidrio. */
export const QUIETO: Momento = {
  pos: [-4, 0],
  rumbo: 0,
  panza: 0,
  respira: 0,
  alas: 0,
  zumba: 0,
  bate: 0,
  frota: 0,
  patalea: 0,
  cabeza: 0,
  vaho: 0.25,
  vahoEn: [18, -30],
  rayones: 0.5,
  estrellas: 0,
  giroEstrellas: 0,
  tiembla: 0,
  corre: 0,
};

/**
 * *"Que quedó atrapado en un vaso boca abajo"*: dándose contra el vidrio. Pegado al culo del vaso, zumbando a
 * toda velocidad, el vidrio empañado y rayado, y el vaso temblando. Es el toque quieto y el retrato.
 */
export const GOLPEA: Momento = {
  ...QUIETO,
  pos: [10, -92],
  rumbo: -70,
  alas: 40,
  zumba: 1,
  bate: 0.5,
  vaho: 1,
  vahoEn: [14, -96],
  rayones: 1,
  estrellas: 1,
  tiembla: 2,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [MOSCON.x + x * MOSCON.escala, MOSCON.piso + y * MOSCON.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Un punto adentro del vaso: lo que se pasa del vidrio se frena. */
export function adentroDelVaso([x, y]: Punto): Punto {
  const T = MOSCON_ARMADO.tope;
  const yy = Math.min(0, Math.max(T.arriba, y));
  // El vaso se angosta hacia el culo: el tope de costado se achica con la altura.
  const k = 1 - (0.16 * -yy) / VASO.alto;
  return [Math.min(T.x * k, Math.max(-T.x * k, x)), yy];
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = MOSCON_ARMADO;
  const [cx, cy] = A.centro;
  const [ax, ay] = A.alas;
  const [nx, ny] = A.cuello;
  const [px, py] = A.patasDel;
  const [x, y] = adentroDelVaso(m.pos);
  // Hacia la izquierda se da vuelta entero; el rumbo gira el cuerpo; de espaldas, gira 180 sobre su centro.
  const lado = Math.cos((m.rumbo * Math.PI) / 180) < 0 ? -1 : 1;
  const rumbo = lado < 0 ? 180 - m.rumbo : m.rumbo;
  // Las alas baten con la fase del zumbido: a toda velocidad, de −60 a 60.
  const bate = m.alas + 60 * m.zumba * Math.sin(m.bate * Math.PI * 2);
  const panza = 1 + 0.06 * m.respira;
  const [vx, vy] = m.vahoEn;
  const transform: Record<string, string> = {
    entero: `translate(${MOSCON.x} ${MOSCON.piso}) scale(${MOSCON.escala})`,
    vaso: `translate(${n2(m.corre + m.tiembla)} 0)`,
    mosca: `translate(${n2(x)} ${n2(y)}) rotate(${n2(rumbo)} ${cx} ${cy}) scale(${lado} 1) rotate(${n2(180 * m.panza)} ${cx} ${cy})`,
    abdomen: `translate(${cx - 8} ${cy}) scale(${n2(panza)}) translate(${-cx + 8} ${-cy})`,
    'ala-1': `rotate(${n2(-bate)} ${ax} ${ay})`,
    'ala-2': `rotate(${n2(bate)} ${ax} ${ay})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    'patas-2': `rotate(${n2(m.frota + m.patalea)} ${px} ${py})`,
    'patas-1': `rotate(${n2(-m.patalea * 0.7)} ${cx} ${cy})`,
    vaho: `translate(${n2(vx)} ${n2(vy)}) scale(${n2(0.5 + 0.9 * m.vaho)})`,
    estrellas: `translate(${n2(x + 10)} ${n2(y - 22)}) rotate(${n2(m.giroEstrellas)})`,
  };
  const opacity: Record<string, string> = {
    vaho: n2(0.9 * m.vaho),
    rayones: n2(0.35 + 0.65 * m.rayones),
    estrellas: n2(m.estrellas),
    alas: n2(1 - 0.55 * m.zumba),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba del culo del vaso, en el recinto. */
export const VERSO: Punto = alRecinto([0, -VASO.alto - 18]);
