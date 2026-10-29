/**
 * Los números de Zippo (`D-73`, vigésima vuelta): dónde vuela en el infierno, cómo está armado él con
 * su avioneta y cómo se pone. Los lee el dibujo (`arte-zippo.ts`), para la pose quieta del HTML y para
 * el retrato, y la conducta (`scripts/bestiario/zippo.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de la avioneta**: el (0, 0) es el medio de la cabina, donde va sentado; arriba es negativo y la
 *   trompa mira a la izquierda. Está dibujado a dos veces y la escena lo achica con `ZIPPO.escala`.
 * - **El del recinto** (900 × 640): vuela arriba a la derecha del salón, delante de la pared de fuego,
 *   lejos de la piedra de Luzbelito. Su mala sombra va por el damero, abajo.
 */

import { rot, type P } from './trazos.ts';

export type Punto = P;

/** Dónde vuela quieto, lo que mide, y la línea del damero por donde va su sombra. */
export const ZIPPO = { x: 742, y: 176, escala: 0.58, pisoSombra: 422 } as const;

/** Cómo está armado, en las coordenadas de la avioneta. */
export const ZIPPO_ARMADO = {
  /** La hélice, en la trompa: gira de costado, así que se ve como un palo que se achica y se estira. */
  helice: [-118, 6] as Punto,
  largoHelice: 46,
  /** El cuello: de acá gira la cabeza, que es el encendedor. */
  cuello: [-6, -40] as Punto,
  /** La cabeza: la caja del encendedor, de esquina a esquina. */
  caja: { x: -30, y: -112, ancho: 50, alto: 70 },
  /** La bisagra de la tapa, arriba a la derecha de la caja: de acá se abre. */
  bisagra: [21, -112] as Punto,
  /** La boca de la chimenea, donde nace la llama. */
  chimenea: [-6, -126] as Punto,
  /** La boca, en la cara de la caja: la risa de mil dientes. */
  boca: [-6, -62] as Punto,
  /** El hombro del brazo que se ve (el de adelante): de acá gira, de la manga al guante. */
  hombro: [-26, -30] as Punto,
  /** La mano, agarrada del borde de la cabina con el brazo quieto. */
  mano: [-48, -6] as Punto,
  /** El nudo de la bufanda, de donde flamea para atrás. */
  nudo: [6, -38] as Punto,
  /** El asiento de atrás, el del copiloto que no está. */
  asientoVacio: [66, -8] as Punto,
  /** El bolsillo de la campera, de donde se le caen las fichas. */
  bolsillo: [-12, 2] as Punto,
  /** El caño de escape, de donde sale el humo: debajo de la cabina, para atrás. */
  escape: [34, 30] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento: lo que la conducta decide en cada cuadro
   ------------------------------------------------------------------ */

/** Una bocanada de humo, o una ficha que cae, en las coordenadas del recinto. */
export interface Suelto {
  x: number;
  y: number;
  /** El tamaño (humo) o el giro en grados (ficha). */
  s: number;
  /** Cuánto se ve, de 0 a 1. */
  o: number;
}

export interface Momento {
  /** Lo que se corre la avioneta de su lugar, en el recinto, y cuánto cabecea (grados; positivo levanta la trompa). */
  dx: number;
  dy: number;
  cabecea: number;
  /** Por dónde va la hélice (radianes) y qué tan borroneada se ve (0, quieta; 1, a fondo). */
  helice: number;
  borron: number;
  /** La tapa del encendedor: 0, cerrada; 1, abierta del todo. */
  tapa: number;
  /** El tamaño de la llama (0, apagada; 1, la de siempre; más, la de la picada) y cuánto la tira el viento (grados). */
  llama: number;
  viento: number;
  /** La risa de mil dientes, de 0 a 1. */
  risa: number;
  /** Cuánto gira el brazo en el hombro (grados; positivo lo levanta por delante) y la cabeza en el cuello. */
  brazo: number;
  cabeza: number;
  /** Lo que flamea la bufanda (grados). */
  bufanda: number;
  /** La mala sombra: lo que se atrasa o se adelanta de él (en el recinto) y cuánto se ve. */
  sombra: { dx: number; o: number };
  /** El azufre de la risa: tamaño y cuánto se ve. */
  azufre: { s: number; o: number };
  humo: readonly Suelto[];
  fichas: readonly Suelto[];
}

/** Cuántas bocanadas y cuántas fichas hay armadas en el títere. */
export const HUMOS = 5;
export const FICHAS = 2;

const guardado: Suelto = { x: ZIPPO.x, y: ZIPPO.y, s: 1, o: 0 };

/** La pose quieta, la del HTML: volando derecho, con la cabeza prendida y la hélice a fondo. */
export const QUIETO: Momento = {
  dx: 0,
  dy: 0,
  cabecea: 0,
  helice: 0.6,
  borron: 1,
  tapa: 1,
  llama: 1,
  viento: 18,
  risa: 0,
  brazo: 0,
  cabeza: 0,
  bufanda: 0,
  sombra: { dx: 0, o: 1 },
  azufre: { s: 0.4, o: 0 },
  humo: Array.from({ length: HUMOS }, () => guardado),
  fichas: Array.from({ length: FICHAS }, () => guardado),
};

/**
 * *"Se va gritando Cruz Diablo! por pura cortesía"*: en la picada, la trompa abajo, la llama larga, el
 * brazo arriba saludando y la risa de mil dientes. Es el toque quieto y el retrato.
 */
export const PICADA: Momento = {
  ...QUIETO,
  dy: 34,
  cabecea: -24,
  llama: 1.7,
  viento: 64,
  risa: 1,
  brazo: 118,
  cabeza: -8,
  bufanda: -14,
  azufre: { s: 1, o: 0.9 },
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

/** Un punto de la avioneta, llevado al recinto, con lo que se corrió y lo que cabecea. */
export function alRecinto(p: Punto, m: Pick<Momento, 'dx' | 'dy' | 'cabecea'> = QUIETO): Punto {
  const [x, y] = rot(p, [0, 0], m.cabecea);
  return [ZIPPO.x + m.dx + x * ZIPPO.escala, ZIPPO.y + m.dy + y * ZIPPO.escala];
}

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** El ángulo de la tapa abierta, en la bisagra: se va para atrás y queda colgando. */
export const ABRE = 128;

/** Lo que gira el brazo para llevarse el índice a la boca (el *¡chist!*) y para saludar en la picada. */
export const CHIST = 172;
export const SALUDO = 118;

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = ZIPPO_ARMADO;
  const [hx, hy] = A.helice;
  const [cx, cy] = A.cuello;
  const [bx, by] = A.bisagra;
  const [sx, sy] = A.hombro;
  const [nx, ny] = A.nudo;
  const [lx, ly] = A.chimenea;
  // La hélice se ve de costado: un palo vertical que se achica por el medio cuando da la vuelta.
  const giro = Math.cos(m.helice);
  const transform: Record<string, string> = {
    entero: `translate(${ZIPPO.x} ${ZIPPO.y}) scale(${ZIPPO.escala})`,
    vuelo: `translate(${n2(m.dx / ZIPPO.escala)} ${n2(m.dy / ZIPPO.escala)}) rotate(${n2(m.cabecea)})`,
    helice: `translate(${hx} ${hy}) scale(1 ${n2(giro)}) translate(${-hx} ${-hy})`,
    cabeza: `rotate(${n2(m.cabeza)} ${cx} ${cy})`,
    tapa: `rotate(${n2(m.tapa * ABRE)} ${bx} ${by})`,
    // La llama nace en la chimenea: crece desde ahí, y el viento la acuesta para atrás.
    llama: `translate(${lx} ${ly}) rotate(${n2(m.viento)}) scale(${n2(Math.max(0.01, 0.8 + 0.2 * m.llama))} ${n2(Math.max(0.01, m.llama))}) translate(${-lx} ${-ly})`,
    brazo: `rotate(${n2(m.brazo)} ${sx} ${sy})`,
    bufanda: `rotate(${n2(m.bufanda)} ${nx} ${ny})`,
    azufre: `translate(${A.boca[0]} ${A.boca[1]}) scale(${n2(m.azufre.s)}) translate(${-A.boca[0]} ${-A.boca[1]})`,
  };
  // El nubarrón que lo sigue de atrás: su cielo, que se le ennegrece. Se queda un poco cuando él se va.
  transform.nubarron = `translate(${n2(ZIPPO.x + m.dx * 0.55 + 18)} ${n2(ZIPPO.y + m.dy * 0.55 - 14)})`;
  // La sombra va por el damero, en el recinto: debajo de él, más chica y más clara cuanto más alto vuela.
  const alto = ZIPPO.pisoSombra - (ZIPPO.y + m.dy);
  const k = Math.max(0.35, Math.min(1.6, 1.25 - alto / 520));
  transform.sombra = `translate(${n2(ZIPPO.x + m.dx + m.sombra.dx)} ${ZIPPO.pisoSombra}) scale(${n2(k)} ${n2(k * 0.5)})`;
  const opacity: Record<string, string> = {
    borron: n2(m.borron),
    helice: n2(1 - 0.75 * m.borron),
    llama: n2(Math.min(1, m.llama * 1.4)),
    risa: n2(m.risa),
    azufre: n2(m.azufre.o),
    sombra: n2(m.sombra.o * Math.max(0.25, Math.min(0.85, k * 0.6))),
  };
  m.humo.forEach((h, i) => {
    transform[`humo-${i + 1}`] = `translate(${n2(h.x)} ${n2(h.y)}) scale(${n2(h.s)})`;
    opacity[`humo-${i + 1}`] = n2(h.o);
  });
  m.fichas.forEach((c, i) => {
    transform[`ficha-${i + 1}`] = `translate(${n2(c.x)} ${n2(c.y)}) rotate(${n2(c.s)}) scale(${ZIPPO.escala})`;
    opacity[`ficha-${i + 1}`] = n2(c.o);
  });
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la llama, en el recinto. */
export const VERSO: Punto = alRecinto([-10, -230]);
