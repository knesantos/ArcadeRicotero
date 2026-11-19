/**
 * Los números de los camellos prestigiosos (`D-73`, vigesimonovena vuelta): dónde están parados en la nieve, cómo
 * están armados y cómo se ponen. Los lee el dibujo (`arte-camellos.ts`), para la pose quieta del HTML y para el
 * retrato, y la conducta (`scripts/bestiario/camellos.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de los camellos**: el (0, 0) es la nieve debajo del medio del cajón; arriba es negativo. Está dibujado al
 *   doble y la escena lo achica con `CAMELLOS.escala`.
 * - **El del recinto** (900 × 640, el de Cybersiberia): en la nieve de atrás, a la izquierda de todo, donde estaba
 *   pintado el camello. En el camino el marco lo corre `ancla · (k − 1)`.
 *
 * Tienen **dos poses enteras**, y por eso dos juegos de partes: parados en dos patas, de sobretodo, despachando
 * (`parados`), y a cuatro patas, haciéndose los camellos (`cuatro`). La conducta pasa de una a otra detrás de una
 * polvareda de nieve.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde están, y lo que miden. */
export const CAMELLOS = { x: 92, piso: 458, escala: 0.5 } as const;

/** Cómo están armados, en sus coordenadas. */
export const CAMELLOS_ARMADO = {
  /** Dónde está parado cada uno: el joyero, atrás del cajón, y el campana, a la derecha. */
  joyero: -22,
  campana: 98,
  /** El campana es más alto que el joyero: no son mellizos. */
  alto: 1.1,
  /** En el cuerpo parado (el (0, 0) entre sus pezuñas): de dónde sale el cogote, la pata que resbala, la cola y el hombro del brazo que pesa. */
  cogote: [4, -158] as Punto,
  pata: [12, -44] as Punto,
  cola: [-31, -64] as Punto,
  hombro: [14, -146] as Punto,
  /** La punta de la pinza, desde el hombro, con el brazo como está dibujado. */
  pinza: [56, 34] as Punto,
  /** El cajón de chapa: de dónde a dónde va, y lo alto que es el frente y la tapa. */
  cajon: { x0: -76, x1: 58, frente: -62, tapa: -74 },
  /** La balanza: el pie del poste, arriba del cajón, la cruz (de ahí gira el fiel) y el medio brazo. */
  balanza: { pie: [0, -70] as Punto, cruz: [0, -122] as Punto, brazo: 40, cuelga: 18 },
  /** A cuatro patas: dónde queda cada uno (el (0, 0) debajo del medio del lomo), lo que miden y de dónde sale el cogote. */
  cuatro: { joyero: -106, campana: 88, escala: 0.9, cogote: [48, -96] as Punto },
  /** El sobre que se escapa de abajo del sobretodo que tapa el cajón. */
  sobreSuelto: [-26, -4] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** El aliento (−1 a 1). */
  respira: number;
  /** Cuál de las dos poses se ve: 1 parados, 0 a cuatro patas. */
  parados: number;
  /** Parados: lo que se hunden al tirarse (0 a 1). A cuatro patas: lo que se aplastan al caer (0 a 1). */
  hunde: number;
  aplasta: number;
  /** La polvareda de nieve que tapa el cambio: el tamaño (0 a 1) y cuánto se ve. */
  polvo: number;
  polvoSe: number;
  /** Los cogotes, parados (grados; positivo es para adelante y abajo): el joyero y el campana. Y para dónde mira el campana. */
  cogote: readonly [number, number];
  mira: 1 | -1;
  /** Los cogotes a cuatro patas. */
  cogote4: readonly [number, number];
  /** La quijada de cada uno (lo que se corre de costado, rumiando) y los párpados (0 a 1). */
  quijada: readonly [number, number];
  parpado: readonly [number, number];
  /** El brazo del joyero (grados), el copo en la pinza (el tamaño, 0 a 1) y lo que se inclina la balanza. */
  brazo: number;
  copo: number;
  balanza: number;
  /** El campana: lo que se corre y se ladea (x, y, grados), la pata que resbala (grados) y la cola (grados). */
  campana: readonly [number, number, number];
  pata: number;
  cola: number;
  /** El sobrecito que pasa de la cola al cajón: dónde está, lo que gira y si se ve. */
  sobre: readonly [number, number, number];
  sobreSe: number;
  /** A cuatro patas: el sobre que asoma de abajo del bulto (lo que salió, en unidades) y si se ve. */
  suelto: number;
  sueltoSe: number;
}

/** La pose quieta, la del HTML: parados, el joyero pesando un copo y el campana mirando para el lado de Drogocop. */
export const QUIETO: Momento = {
  respira: 0,
  parados: 1,
  hunde: 0,
  aplasta: 0,
  polvo: 0,
  polvoSe: 0,
  cogote: [32, 2],
  mira: 1,
  cogote4: [16, 10],
  quijada: [0, 0],
  parpado: [0, 0],
  brazo: 0,
  copo: 1,
  balanza: -4,
  campana: [0, 0, 0],
  pata: 0,
  cola: 0,
  sobre: [0, 0, 0],
  sobreSe: 0,
  suelto: 0,
  sueltoSe: 0,
};

/**
 * *"Camellos prestigiosos"*, con alguien mirando: a cuatro patas, rumiando nieve, con el sobretodo de manta y el
 * cajón tapado como una joroba más. Un sobre asoma. Es el toque quieto y el retrato.
 */
export const CAMELLOS_NOMAS: Momento = {
  ...QUIETO,
  parados: 0,
  cogote4: [10, -6],
  quijada: [2.4, -2.4],
  parpado: [0, 0],
  suelto: 16,
  sueltoSe: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [CAMELLOS.x + x * CAMELLOS.escala, CAMELLOS.piso + y * CAMELLOS.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const rad = (g: number): number => (g * Math.PI) / 180;

/** Dónde está la punta de la pinza del joyero con el brazo girado `g`. */
export function puntaDeLaPinza(g: number): Punto {
  const A = CAMELLOS_ARMADO;
  const [px, py] = A.pinza;
  const a = rad(g);
  return [A.joyero + A.hombro[0] + px * Math.cos(a) - py * Math.sin(a), A.hombro[1] + px * Math.sin(a) + py * Math.cos(a)];
}

/** Dónde está cada platillo de la balanza (0 el de la izquierda, 1 el de la derecha) con el fiel inclinado `g`. */
export function platillo(i: 0 | 1, g: number): Punto {
  const { cruz: [cx, cy], brazo, cuelga } = CAMELLOS_ARMADO.balanza;
  const s = i === 0 ? -1 : 1;
  const a = rad(g);
  return [cx + s * brazo * Math.cos(a), cy + s * brazo * Math.sin(a) + cuelga];
}

/** Cuánto hay que girar el brazo para que la pinza llegue al platillo de la derecha. */
export const BRAZO_AL_PLATILLO = 12;

/** Dónde tiene la punta de la cola el campana (para el sobrecito), con la cola girada `g`. */
export function puntaDeLaCola(g: number, m: Pick<Momento, 'campana'>): Punto {
  const A = CAMELLOS_ARMADO;
  const a = rad(g);
  const [lx, ly] = [-30, 26];
  return [A.campana + m.campana[0] + A.alto * (A.cola[0] + lx * Math.cos(a) - ly * Math.sin(a)), m.campana[1] + A.alto * (A.cola[1] + lx * Math.sin(a) + ly * Math.cos(a))];
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = CAMELLOS_ARMADO;
  const sube = 1.4 * m.respira;
  const [gx, gy] = A.cogote;
  const [qx, qy] = A.cuatro.cogote;
  const [bx, by] = A.balanza.cruz;
  const e = A.cuatro.escala;
  const f = (v: number): string => n2(Math.min(1, Math.max(0, v)));
  const cuatro = (x: number, fase: number): string => `translate(${x} ${n2(0)}) scale(${n2(e * (1 + 0.06 * m.aplasta))} ${n2(e * (1 - 0.14 * m.aplasta) * (1 + 0.006 * m.respira * fase))})`;
  const transform: Record<string, string> = {
    entero: `translate(${CAMELLOS.x} ${CAMELLOS.piso}) scale(${CAMELLOS.escala})`,
    parados: `scale(${n2(1 + 0.05 * m.hunde)} ${n2(1 - 0.34 * m.hunde)})`,
    joyero: `translate(${A.joyero} ${n2(-sube * 0.4)})`,
    'j-cogote': `translate(${gx} ${n2(gy - sube)}) rotate(${n2(m.cogote[0])})`,
    'j-quijada': `translate(${n2(m.quijada[0])} ${n2(Math.abs(m.quijada[0]) * 0.5)})`,
    brazo: `translate(${A.hombro[0]} ${n2(A.hombro[1] - sube)}) rotate(${n2(m.brazo)})`,
    copo: `translate(${A.pinza[0]} ${A.pinza[1]}) scale(${n2(Math.max(0.02, m.copo))})`,
    balanza: `translate(${bx} ${by}) rotate(${n2(m.balanza)})`,
    campana: `translate(${n2(A.campana + m.campana[0])} ${n2(m.campana[1])}) rotate(${n2(m.campana[2])}) scale(${A.alto})`,
    'c-cola': `translate(${A.cola[0]} ${A.cola[1]}) rotate(${n2(m.cola)})`,
    'c-pata': `translate(${A.pata[0]} ${A.pata[1]}) rotate(${n2(m.pata)})`,
    'c-cogote': `translate(${gx} ${n2(gy - sube)}) scale(${m.mira} 1) rotate(${n2(m.cogote[1])})`,
    'c-quijada': `translate(${n2(m.quijada[1])} ${n2(Math.abs(m.quijada[1]) * 0.5)})`,
    sobre: `translate(${n2(m.sobre[0])} ${n2(m.sobre[1])}) rotate(${n2(m.sobre[2])})`,
    'q-joyero': cuatro(A.cuatro.joyero, 1),
    'q-campana': cuatro(A.cuatro.campana, -1),
    'q1-cogote': `translate(${qx} ${qy}) rotate(${n2(m.cogote4[0])})`,
    'q2-cogote': `translate(${qx} ${qy}) rotate(${n2(m.cogote4[1])})`,
    'q1-quijada': `translate(${n2(m.quijada[0])} ${n2(Math.abs(m.quijada[0]) * 0.5)})`,
    'q2-quijada': `translate(${n2(m.quijada[1])} ${n2(Math.abs(m.quijada[1]) * 0.5)})`,
    suelto: `translate(${n2(A.sobreSuelto[0] - m.suelto * 0.5)} ${n2(A.sobreSuelto[1] + m.suelto * 0.7)}) rotate(${n2(-8 - m.suelto)})`,
    polvo: `scale(${n2(0.3 + 0.9 * m.polvo)} ${n2(0.3 + 0.8 * m.polvo)})`,
  };
  const parados = m.parados > 0.5;
  const opacity: Record<string, string> = {
    parados: parados ? '1' : '0',
    cuatro: parados ? '0' : '1',
    'j-parpado': m.parpado[0] > 0.5 ? '1' : '0',
    'c-parpado': m.parpado[1] > 0.5 ? '1' : '0',
    'q1-parpado': m.parpado[0] > 0.5 ? '1' : '0',
    'q2-parpado': m.parpado[1] > 0.5 ? '1' : '0',
    copo: m.copo > 0.05 ? '1' : '0',
    sobre: f(m.sobreSe),
    suelto: f(m.sueltoSe),
    polvo: f(m.polvoSe),
  };
  return { transform, opacity };
}

/** Dónde dicen su verso: arriba de los dos, en el recinto. */
export const VERSO: Punto = alRecinto([40, -236]);
