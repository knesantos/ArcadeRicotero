/**
 * Los números del pajarito del Lavi-rap (`D-73`, vigesimonovena vuelta): dónde cuelga su jaula en la prisión, cómo
 * está armado y cómo se pone. Los lee el dibujo (`arte-pajarito.ts`), para la pose quieta del HTML y para el
 * retrato, y la conducta (`scripts/bestiario/pajarito.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de la jaula**: el (0, 0) es la argolla de arriba, de donde cuelga; abajo es positivo. El pajarito mira a la
 *   **derecha**, para el pasillo.
 * - **El del recinto** (la prisión): en el ala de la izquierda, colgada del techo, arriba de la celda del reo, donde
 *   colgaba la jaulita que estaba tallada en el piso de la prisión.
 */

import type { P } from './trazos.ts';

export type Punto = P;

export const PAJARITO = { x: -130, y: 76, escala: 1.2 } as const;

export const PAJARITO_ARMADO = {
  /** El clavo del techo: de acá se hamaca todo. */
  clavo: [0, -80] as Punto,
  /** La jaula: medio ancho, dónde termina la cúpula, la base, y los barrotes de adelante. */
  jaula: { medio: 40, hombro: 23, base: 104, barrotes: [-40, -20, 0, 20, 40] as readonly number[] },
  /** La percha y dónde se agarra. */
  percha: 70,
  pies: [-2, 70] as Punto,
  /** El medio del cuerpo, el hombro del ala, la base de la cola y el cuello. */
  panza: [-3, 56] as Punto,
  hombro: [-6, 49] as Punto,
  cola: [-12, 62] as Punto,
  cuello: [2, 46] as Punto,
  ojo: [9, 37] as Punto,
  pico: [21, 40] as Punto,
  /** El cajoncito de los papelitos, enganchado a los barrotes. */
  cajon: [30, 58] as Punto,
  /** De dónde cuelga la etiqueta del precio, y su medio. */
  nudo: [36, 106] as Punto,
  etiqueta: { x: 2, y: 112, ancho: 74, alto: 44 },
} as const;

export interface Momento {
  /** Cuánto se hamaca la jaula (grados) y cuánto la etiqueta, de más (grados). */
  mece: number;
  etiqueta: number;
  /** La etiqueta dada vuelta (0 la cara de siempre, 1 la de atrás, con más ceros). */
  vuelta: number;
  /** Cuánto se inclina sobre la percha para el cajoncito (grados) y cuánto salta. */
  inclina: number;
  salto: number;
  /** La cabeza (grados; positivo baja el pico), el párpado (0 abierto), el ala y la cola (grados). */
  cabeza: number;
  parpado: number;
  ala: number;
  cola: number;
  respira: number;
  /** El papelito en el pico (0 a 1) y si es el bueno (0 a 1: aparece la tilde). */
  papel: number;
  buena: number;
  /** El papelito en blanco que se le cae (por dónde va: 0 no hay, 1 ya cayó) y la pluma que se le cae. */
  suelto: number;
  pluma: number;
}

/** La pose quieta, la del HTML: parado en la percha, mirando al pasillo, con la etiqueta colgando. */
export const QUIETO: Momento = { mece: 0, etiqueta: 0, vuelta: 0, inclina: 0, salto: 0, cabeza: 0, parpado: 0, ala: 0, cola: 0, respira: 0, papel: 0, buena: 0, suelto: 0, pluma: 0 };

/** *"Si el pajarito da la buena"*: con el papelito bueno en el pico, y la etiqueta dada vuelta. El toque quieto y el retrato. */
export const BUENA: Momento = { ...QUIETO, cabeza: -16, ala: -34, cola: 12, papel: 1, buena: 1, vuelta: 1, etiqueta: 8, mece: -2 };

export const alRecinto = ([x, y]: Punto): Punto => [PAJARITO.x + x * PAJARITO.escala, PAJARITO.y + y * PAJARITO.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const entre01 = (v: number): number => Math.min(1, Math.max(0, v));

/** Por dónde va lo que se le cae a los `p` de su caída: sale de `de`, pasa entre los barrotes y se va hamacando. */
export function caida(de: Punto, p: number, lado: number): { x: number; y: number; giro: number; opacidad: number } {
  return {
    x: de[0] + lado * (10 * p + 7 * Math.sin(p * 9)),
    y: de[1] + 110 * p * p + 14 * p,
    giro: lado * (40 * Math.sin(p * 8) + 90 * p),
    opacidad: p <= 0 || p >= 1 ? 0 : entre01((1 - p) * 4),
  };
}

/** Las transformaciones y las opacidades de cada parte para un momento. */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = PAJARITO_ARMADO;
  const [px, py] = A.panza;
  const [nx, ny] = A.nudo;
  const medio = A.etiqueta.x + A.etiqueta.ancho / 2;
  const canto = Math.cos(Math.PI * entre01(m.vuelta));
  const s = caida([A.pico[0] + 4, A.pico[1] + 8], m.suelto, 1);
  const q = caida([A.panza[0] - 6, A.panza[1]], m.pluma, -1);
  const transform: Record<string, string> = {
    entero: `translate(${PAJARITO.x} ${PAJARITO.y}) scale(${PAJARITO.escala})`,
    colgada: `rotate(${n2(m.mece)} ${A.clavo[0]} ${A.clavo[1]})`,
    pajaro: `translate(0 ${n2(-m.salto)}) rotate(${n2(m.inclina)} ${A.pies[0]} ${A.pies[1]})`,
    bulto: `translate(${px} ${py}) scale(${n2(1 + 0.02 * m.respira)} ${n2(1 + 0.04 * m.respira)}) translate(${-px} ${-py})`,
    cola: `rotate(${n2(m.cola - m.inclina * 0.5)} ${A.cola[0]} ${A.cola[1]})`,
    ala: `rotate(${n2(m.ala)} ${A.hombro[0]} ${A.hombro[1]})`,
    cabeza: `rotate(${n2(m.cabeza - m.inclina * 0.3)} ${A.cuello[0]} ${A.cuello[1]})`,
    // Lo que cuelga, cuelga para abajo: la etiqueta deshace el giro de la jaula y suma el suyo, que llega después.
    etiqueta: `rotate(${n2(m.etiqueta - m.mece)} ${nx} ${ny})`,
    cara: `translate(${medio} 0) scale(${n2(Math.sign(canto || 1) * Math.max(0.08, Math.abs(canto)))} 1) translate(${-medio} 0)`,
    suelto: `translate(${n2(s.x)} ${n2(s.y)}) rotate(${n2(s.giro)})`,
    pluma: `translate(${n2(q.x)} ${n2(q.y)}) rotate(${n2(q.giro)})`,
  };
  const opacity: Record<string, string> = {
    parpado: n2(entre01(m.parpado)),
    papel: n2(entre01(m.papel)),
    buena: n2(entre01(m.buena)),
    'precio-1': canto >= 0 ? '1' : '0',
    'precio-2': canto >= 0 ? '0' : '1',
    suelto: n2(s.opacidad),
    pluma: n2(q.opacidad),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: al costado de la jaula, en el recinto. */
export const VERSO: Punto = alRecinto([20, -10]);
