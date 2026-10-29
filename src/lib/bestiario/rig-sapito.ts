/**
 * Los números de la princesita sapito (`D-73`, vigesimocuarta vuelta): dónde se sienta en la nieve de
 * Cybersiberia, cómo está armada y cómo se pone. Los lee el dibujo (`arte-sapito.ts`), para la pose quieta
 * del HTML y para el retrato, y la conducta (`scripts/bestiario/sapito.ts`), que se lleva esto y nada que
 * dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de la sapita**: el (0, 0) es donde se sienta, en el medio de la panza contra la nieve; arriba es
 *   negativo. Mira de frente. Está dibujada a dos veces, y la escena la achica con `SAPITO.escala`.
 * - **El del recinto** (900 × 640): en la nieve de adelante, a la derecha de la tele, entre el capitán
 *   Buscapina y el Rey Garufa, y arriba del pasillo del pac-man. Donde estaba la silueta pintada.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde se sienta y lo que mide. El ancla es su `x`. */
export const SAPITO = { x: 566, piso: 556, escala: 0.5 } as const;

/** Cómo está armada, en sus coordenadas. La 1 es la izquierda de quien mira. */
export const SAPITO_ARMADO = {
  /** Lo que sube el cuerpo cuando se para en las patas de atrás. */
  alza: 46,
  /** De dónde se ladea la cabeza: las comisuras, que en un sapo no hay cuello. */
  cuello: [0, -50] as Punto,
  /** Los ojos saltones, arriba de la cabeza, y su radio. */
  ojos: [[-25, -86], [25, -86]] as readonly [Punto, Punto],
  radioOjo: 13,
  /** La boca: el medio de la raya, de donde sale la lengua y donde se arma la trompa del beso. */
  boca: [0, -54] as Punto,
  /** El saco de la garganta: de acá cuelga cuando se infla. */
  garganta: [0, -50] as Punto,
  /** Los hombros, y dónde apoya cada mano en la nieve. */
  hombros: [[-34, -50], [34, -50]] as readonly [Punto, Punto],
  manos: [[-42, 0], [42, 0]] as readonly [Punto, Punto],
  /** Los tobillos: de acá salen las canillas cuando se para, y el pie del zapatito gira en el talón 2. */
  tobillos: [[-50, -2], [50, -2]] as readonly [Punto, Punto],
  /** El zapatito de cristal, calzado en la punta de los dedos del pie 2. */
  zapato: [80, -6] as Punto,
  /** La base de la corona, encima de la cabeza y corrida a la derecha. */
  corona: [8, -100] as Punto,
  /** La cintura, de donde cuelga el jirón de tul. */
  cintura: [0, -26] as Punto,
  /** El medio de las chispas del encantamiento, y del puf. */
  hechizo: [0, -62] as Punto,
  /** Lo que mide la lengua estirada, desde la boca. */
  lengua: 110,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Parada en las patas de atrás (0 sentada, 1 parada), lo aplastada (0 a 1) y la respiración (de −1 a 1). */
  alza: number;
  agacha: number;
  respira: number;
  /** El temblor del frío: cuánto se corre de costado, en unidades de la sapita. */
  tirita: number;
  /** El saco de la garganta: 0 apenas, 1 inflado del todo. */
  garganta: number;
  /** Los párpados de arriba: 0 abiertos, 1 cerrados. Cada uno por su cuenta. */
  parpados: readonly [number, number];
  /** Adónde miran las pupilas (corrimiento, en unidades). */
  mira: readonly [number, number];
  /** Lo que ladea la cabeza (grados). */
  cabeza: number;
  /** La corona: lo torcida (grados), y lo caída sobre el ojo 1 (0 a 1). */
  corona: number;
  cae: number;
  /** Lo que gira cada brazo en el hombro (grados; la 1 para adentro es negativo, la 2 positivo). */
  brazos: readonly [number, number];
  /** Lo que levanta el pie del zapatito, girando en el talón (grados). */
  pie: number;
  /** El tul: lo que se le vuela (inclinación, grados). */
  tul: number;
  /** La lengua: hacia dónde apunta (grados desde arriba, a la derecha positivo) y lo que se estira (0 a 1). */
  lengua: readonly [number, number];
  /** El copo de nieve: dónde está (unidades de la sapita) y cuánto se ve. */
  copo: readonly [number, number];
  copoSe: number;
  /** La trompa del beso (0 a 1), el vaho del frío (0 a 1). */
  trompa: number;
  vaho: number;
  /** Las chispas del encantamiento: cuánto se ven (0 a 1) y cuánto giran (grados). */
  chispas: number;
  giro: number;
  /** El puf: lo que se agranda la nube (0 a 1) y cuánto se ve. */
  puf: number;
  pufSe: number;
}

/**
 * La pose quieta, la del HTML: sentada en su trono de nieve, con la corona torcida, los párpados a media
 * asta de princesa aburrida y las manos en la nieve.
 */
export const QUIETO: Momento = {
  alza: 0,
  agacha: 0,
  respira: 0,
  tirita: 0,
  garganta: 0,
  parpados: [0.3, 0.3],
  mira: [0, 0],
  cabeza: 0,
  corona: 14,
  cae: 0,
  brazos: [0, 0],
  pie: 0,
  tul: 0,
  lengua: [0, 0],
  copo: [0, 0],
  copoSe: 0,
  trompa: 0,
  vaho: 0,
  chispas: 0,
  giro: 0,
  puf: 0,
  pufSe: 0,
};

/**
 * *"Su princesita, ay, se transformó en sapito"*: el intento de volver. Parada en las patas de atrás, la
 * corona derecha, los ojos cerrados, la trompa pintada y las chispas alrededor, esperando. Es el toque
 * quieto y el retrato.
 */
export const BESO: Momento = {
  ...QUIETO,
  alza: 1,
  parpados: [1, 1],
  corona: 0,
  brazos: [-46, 46],
  trompa: 1,
  chispas: 1,
  giro: 12,
  tul: 4,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [SAPITO.x + x * SAPITO.escala, SAPITO.piso + y * SAPITO.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** La corona en un momento: el ángulo y el corrimiento, de torcida a caída sobre el ojo 1. */
export function coronaEn(m: Pick<Momento, 'corona' | 'cae'>): { ang: number; dx: number; dy: number } {
  return { ang: m.corona + (-44 - m.corona) * m.cae, dx: -30 * m.cae, dy: 10 * m.cae };
}

/** La punta de la lengua, en sus coordenadas: para que el copo viaje pegado. */
export function puntaDeLengua([ang, largo]: readonly [number, number]): Punto {
  const [bx, by] = SAPITO_ARMADO.boca;
  const a = (ang * Math.PI) / 180;
  const l = SAPITO_ARMADO.lengua * largo;
  return [bx + Math.sin(a) * l, by - Math.cos(a) * l];
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = SAPITO_ARMADO;
  const [cx, cy] = A.cuello;
  const [bx, by] = A.boca;
  const [gx, gy] = A.garganta;
  const [kx, ky] = A.corona;
  const [tx, ty] = A.cintura;
  const [hx, hy] = A.hechizo;
  // Aplastada se ensancha; parada se estira un poco; respira apenas.
  const sx = 1 + 0.1 * m.agacha + 0.012 * m.respira - 0.04 * m.alza;
  const sy = 1 - 0.14 * m.agacha + 0.016 * m.respira + 0.06 * m.alza;
  const c = coronaEn(m);
  const gsx = 0.5 + 0.5 * m.garganta + 0.03 * m.respira;
  const gsy = 0.26 + 0.74 * m.garganta + 0.05 * m.respira;
  const [la, ll] = m.lengua;
  const pf = 0.35 + 0.85 * m.puf;
  const ch = 0.7 + 0.3 * m.chispas;
  const transform: Record<string, string> = {
    entero: `translate(${SAPITO.x} ${SAPITO.piso}) scale(${SAPITO.escala})`,
    sapo: `translate(${n2(m.tirita)} ${n2(-A.alza * m.alza)}) scale(${n2(sx)} ${n2(sy)})`,
    cabeza: `rotate(${n2(m.cabeza)} ${cx} ${cy})`,
    garganta: `translate(${gx} ${gy}) scale(${n2(gsx)} ${n2(gsy)}) translate(${-gx} ${-gy})`,
    corona: `translate(${n2(c.dx)} ${n2(c.dy)}) rotate(${n2(c.ang)} ${kx} ${ky})`,
    tul: `translate(${tx} ${ty}) skewX(${n2(m.tul)}) translate(${-tx} ${-ty})`,
    'pie-2': `rotate(${n2(-m.pie)} ${A.tobillos[1][0]} ${A.tobillos[1][1]})`,
    lengua: `translate(${bx} ${by}) rotate(${n2(la)}) scale(1 ${n2(Math.max(0.02, ll))}) translate(${-bx} ${-by})`,
    copo: `translate(${n2(m.copo[0])} ${n2(m.copo[1])})`,
    vaho: `translate(${n2(14 * m.vaho)} ${n2(-12 * m.vaho)}) translate(${bx + 16} ${by - 4}) scale(${n2(0.5 + 0.7 * m.vaho)}) translate(${-bx - 16} ${-by + 4})`,
    chispas: `translate(${hx} ${hy}) rotate(${n2(m.giro)}) scale(${n2(ch)}) translate(${-hx} ${-hy})`,
    puf: `translate(${hx} ${hy}) scale(${n2(pf)}) translate(${-hx} ${-hy})`,
  };
  for (const n of [0, 1] as const) {
    const [ox, oy] = A.hombros[n];
    transform[`brazo-${n + 1}`] = `rotate(${n2(m.brazos[n])} ${ox} ${oy})`;
    // La canilla nace del tobillo y se estira lo que sube el cuerpo.
    const [ax, ay] = A.tobillos[n];
    transform[`canilla-${n + 1}`] = `translate(${ax} ${ay}) scale(1 ${n2(Math.max(0.02, m.alza))}) translate(${-ax} ${-ay})`;
    // El párpado baja desde el borde de arriba del ojo, y las pestañas postizas bajan con su borde.
    const [ex, ey] = A.ojos[n];
    const r = A.radioOjo;
    const top = ey - r - 1;
    const p = Math.max(0.02, m.parpados[n]);
    transform[`parpado-${n + 1}`] = `translate(${ex} ${top}) scale(1 ${n2(p)}) translate(${-ex} ${-top})`;
    transform[`pestanas-${n + 1}`] = `translate(0 ${n2((2 * r + 2) * p)})`;
    transform[`pupila-${n + 1}`] = `translate(${n2(m.mira[0])} ${n2(m.mira[1])})`;
  }
  const opacity: Record<string, string> = {
    lengua: ll > 0.03 ? '1' : '0',
    copo: n2(m.copoSe),
    trompa: n2(m.trompa),
    vaho: n2(m.vaho > 0.01 ? Math.sin(Math.min(1, m.vaho) * Math.PI) * 0.9 : 0),
    chispas: n2(m.chispas),
    puf: n2(m.pufSe),
    canillas: m.alza > 0.03 ? '1' : '0',
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la corona, en el recinto. */
export const VERSO: Punto = alRecinto([0, -150]);
