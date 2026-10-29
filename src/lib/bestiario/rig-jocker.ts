/**
 * Los números del jocker burlón (`D-73`, vigesimocuarta vuelta): de qué rama del árbol del gran bonete se
 * cuelga, cómo está armado, cómo alcanza con la mano libre lo que quiere (la oreja, el que está abajo) y
 * cómo se da vuelta como un naipe. Los lee el dibujo (`arte-jocker.ts`), para la pose quieta del HTML y para
 * el retrato, y la conducta (`scripts/bestiario/jocker.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del jocker**: el (0, 0) es el puño que agarra la rama baja; lo positivo es para abajo. Cuelga de
 *   un brazo, con la cabeza al costado del brazo y las piernas sueltas. Dibujado a dos veces, la escena lo
 *   achica con `JOCKER.escala`.
 * - **El del recinto** (900 × 640): cuelga de la rama baja de la izquierda del tronco (la última rama de
 *   `siluetaDelArbol`, en `arte-entornos.ts`), debajo del marco de cobre y arriba del ángel de la soledad.
 *   El ancla es el eje del tronco, como la lechuza: en el camino el árbol se corre `450 · (k − 1)` entero,
 *   y la rama con él.
 */

import { ARBOL } from './rig-entornos.ts';
import { rot, type P } from './trazos.ts';

export type Punto = P;

/**
 * La rama baja, como la dibuja `siluetaDelArbol` (con `k` = 1): el borde de arriba y el de abajo, dos
 * Bézier cúbicas que salen del tronco. Copiada acá para que el test mire que el puño esté adentro.
 */
export const RAMA_BAJA = {
  arriba: [[424, 322], [380, 312], [330, 304], [276, 298]] as readonly Punto[],
  abajo: [[276, 308], [330, 314], [380, 324], [424, 342]] as readonly Punto[],
} as const;

/** Un punto de una Bézier cúbica. */
export function bezier(pts: readonly Punto[], t: number): Punto {
  const [a, b, c, d] = pts as [Punto, Punto, Punto, Punto];
  const u = 1 - t;
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [k[0]! * a[0] + k[1]! * b[0] + k[2]! * c[0] + k[3]! * d[0], k[0]! * a[1] + k[1]! * b[1] + k[2]! * c[1] + k[3]! * d[1]];
}

/** Dónde agarra la rama (el puño, en el recinto), lo que mide, y el ancla del marco: el eje del tronco. */
export const JOCKER = { x: 324, rama: 309, escala: 0.5, ancla: ARBOL.tronco.x } as const;

/** Cómo está armado, en las coordenadas del jocker. El 1 es el lado del brazo que cuelga (el del tronco). */
export const JOCKER_ARMADO = {
  /** El puño en la rama: de acá se hamaca todo, y alrededor de acá da el molinete. */
  puno: [0, 0] as Punto,
  /** Los hombros: el 1 es el del brazo que cuelga; el 2, el del brazo libre, que alcanza cosas. */
  hombros: [[4, 64], [-36, 70]] as readonly [Punto, Punto],
  /** El cuello, de donde gira la cabeza, y el medio de la cara. */
  cuello: [-16, 64] as Punto,
  cara: [-28, 40] as Punto,
  /** Los ojos (el 1 es el de la izquierda de quien mira, el de la mitad pintada) y su radio. */
  ojos: [[-38, 36], [-18, 34]] as readonly [Punto, Punto],
  radioOjo: 6.5,
  /** La boca, la nariz y la oreja de afuera, de donde saca el naipe. */
  boca: [-26, 56] as Punto,
  nariz: [-30, 44] as Punto,
  oreja: [-52, 42] as Punto,
  /** El bonete: de dónde nace cada punta, en la vincha, y dónde cuelga su cascabel. */
  puntas: [[-44, 20], [-30, 14], [-16, 16]] as readonly [Punto, Punto, Punto],
  cascabeles: [[-80, 24], [-50, -18], [-2, -14]] as readonly [Punto, Punto, Punto],
  /** El medio del pecho (respira de acá) y el alfiler de la estrella de lata. */
  pecho: [-16, 104] as Punto,
  alfiler: [-12, 86] as Punto,
  /** Las caderas, y las rodillas con las piernas derechas. */
  caderas: [[-4, 148], [-28, 150]] as readonly [Punto, Punto],
  rodillas: [[-4, 192], [-28, 194]] as readonly [Punto, Punto],
  /** Lo que mide cada tramo de pierna, hasta el talón. */
  muslo: 44,
  canilla: 42,
  /** El brazo libre: lo que mide cada tramo, del hombro al codo y del codo al medio del puño. */
  brazo: 40,
  antebrazo: 38,
  /** El naipe gigante: la pinza en la rama, y la caja del naipe que cuelga de ella. */
  naipe: [-50, 10, 100, 146] as readonly [number, number, number, number],
} as const;

const A = JOCKER_ARMADO;
/** El codo y el puño del brazo libre, derecho para abajo: así está dibujado, y de ahí se gira. */
export const CODO: Punto = [A.hombros[1][0], A.hombros[1][1] + A.brazo];
export const MANO: Punto = [CODO[0], CODO[1] + A.antebrazo];

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Cuánto se hamaca alrededor del puño (grados; el molinete da la vuelta entera). */
  hamaca: number;
  /**
   * Lo que se dio vuelta como un naipe, en medias vueltas: 0 es él, 1 el dorso de la Estrella del Sur, 2
   * el as de picas y 3 él otra vez. Entre una y otra se angosta de canto.
   */
  vuelta: number;
  /** Lo que ladea la cabeza en el cuello (grados), y adónde miran las pupilas (de −1 a 1). */
  cabeza: number;
  mira: readonly [number, number];
  /** Los párpados: 0 abiertos, 1 cerrados. Cada uno por su cuenta, para el guiño. */
  parpados: readonly [number, number];
  /** La boca: 0 la sonrisa de costado, 1 la carcajada con la lengua afuera. */
  boca: number;
  /** Las tres puntas del bonete (grados, cada una en su base) y el tilín de los cascabeles (0 a 1). */
  puntas: readonly [number, number, number];
  tilin: number;
  /** El brazo libre: el hombro y el codo (grados, desde derecho para abajo; positivo abre para afuera). */
  brazo: number;
  antebrazo: number;
  /** El mazo en la mano: lo que gira, y lo que se abre en abanico (0 cerrado, 1 abierto). */
  mazo: number;
  abanico: number;
  /** El naipe que saca de la oreja: 0 no está, 1 lo tiene en la mano. */
  oreja: number;
  /** Las piernas: los muslos en la cadera y las canillas en la rodilla (grados). */
  muslos: readonly [number, number];
  canillas: readonly [number, number];
  /** La estrella de lata que cuelga del alfiler (grados) y su brillo (0 a 1). */
  estrella: number;
  brillo: number;
  /** La respiración, de −1 a 1. */
  respira: number;
}

/**
 * La pose quieta, la del HTML: colgado de un brazo, las piernas cruzadas como en un sillón, el mazo
 * cerrado contra la panza y la sonrisa de costado. Un ojo más entornado que el otro.
 */
export const QUIETO: Momento = {
  hamaca: 0,
  vuelta: 0,
  cabeza: -4,
  mira: [-0.2, 0.4],
  parpados: [0.3, 0.12],
  boca: 0,
  puntas: [0, 0, 0],
  tilin: 0,
  brazo: 22,
  antebrazo: -96,
  mazo: 70,
  abanico: 0,
  oreja: 0,
  muslos: [-14, 10],
  canillas: [34, -6],
  estrella: 0,
  brillo: 0,
  respira: 0,
};

/**
 * *"Soy un jocker burlón de la Estrella del Sur"*: la carcajada con la lengua afuera, el mazo abierto en
 * abanico, los cascabeles sonando y la estrella brillando. Es el toque quieto y el retrato.
 */
export const BURLON: Momento = {
  ...QUIETO,
  hamaca: -6,
  cabeza: 10,
  mira: [0, 0],
  parpados: [0, 0.85],
  boca: 1,
  puntas: [14, -10, -16],
  tilin: 1,
  brazo: 70,
  antebrazo: -52,
  mazo: 40,
  abanico: 1,
  muslos: [-30, 24],
  canillas: [56, -10],
  estrella: 10,
  brillo: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto, hamaca = 0): Punto => {
  const [rx, ry] = rot([x, y], A.puno, hamaca);
  return [JOCKER.x + rx * JOCKER.escala, JOCKER.rama + ry * JOCKER.escala];
};
export const alJocker = ([x, y]: Punto): Punto => [(x - JOCKER.x) / JOCKER.escala, (y - JOCKER.rama) / JOCKER.escala];

/** Para dónde apunta un tramo girado `g` grados desde derecho para abajo. */
const dir = (g: number, largo: number): Punto => {
  const a = (g * Math.PI) / 180;
  return [-Math.sin(a) * largo, Math.cos(a) * largo];
};
const grados = ([dx, dy]: Punto): number => (Math.atan2(-dx, dy) * 180) / Math.PI;

/** El codo y el puño del brazo libre para un brazo y un antebrazo (el antebrazo se suma al brazo). */
export function brazoEn(brazo: number, antebrazo: number): { codo: Punto; mano: Punto } {
  const [sx, sy] = A.hombros[1];
  const [ex, ey] = dir(brazo, A.brazo);
  const codo: Punto = [sx + ex, sy + ey];
  const [mx, my] = dir(brazo + antebrazo, A.antebrazo);
  return { codo, mano: [codo[0] + mx, codo[1] + my] };
}

/**
 * El brazo libre que alcanza un punto (en las del jocker): las dos cuentas del codo, y se queda con la del
 * codo para afuera (a la izquierda), que es como dobla el brazo un tipo colgado. Si no llega, se estira.
 */
export function alcanza(punto: Punto): { brazo: number; antebrazo: number } {
  const [sx, sy] = A.hombros[1];
  const [dx, dy] = [punto[0] - sx, punto[1] - sy];
  const largo = Math.min(A.brazo + A.antebrazo - 0.01, Math.max(Math.abs(A.brazo - A.antebrazo) + 0.01, Math.hypot(dx, dy)));
  const base = grados([dx, dy]);
  const abre = (Math.acos((A.brazo ** 2 + largo ** 2 - A.antebrazo ** 2) / (2 * A.brazo * largo)) * 180) / Math.PI;
  const opciones = [base + abre, base - abre].map((b) => {
    const [ex, ey] = dir(b, A.brazo);
    const codo: Punto = [sx + ex, sy + ey];
    const meta: Punto = [sx + (dx / Math.hypot(dx, dy)) * largo, sy + (dy / Math.hypot(dx, dy)) * largo];
    const ante = grados([meta[0] - codo[0], meta[1] - codo[1]]) - b;
    return { brazo: b, antebrazo: ((ante + 540) % 360) - 180, x: codo[0] };
  });
  const [mejor] = opciones.sort((a, b) => a.x - b.x);
  return { brazo: mejor!.brazo, antebrazo: mejor!.antebrazo };
}

/** Lo que se ve en cada media vuelta: él, el dorso o el as; y lo angosto que queda de canto. */
export function caraDeLaVuelta(vuelta: number): { cual: 'jocker' | 'dorso' | 'as'; ancho: number } {
  const n = ((Math.round(vuelta) % 3) + 3) % 3;
  return { cual: n === 0 ? 'jocker' : n === 1 ? 'dorso' : 'as', ancho: Math.max(0.02, Math.abs(Math.cos(vuelta * Math.PI))) };
}

/** Cuánto se abre cada naipe del mazo en abanico (grados), del de atrás al de adelante. */
export const ABANICO = 24;
export const NAIPES = ['diamante', 'trebol', 'corazon', 'pica'] as const;

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const [nx, ny] = A.cuello;
  const [px, py] = A.pecho;
  const [ax, ay] = A.alfiler;
  const [bx, by] = A.boca;
  const [sx, sy] = A.hombros[1];
  const v = caraDeLaVuelta(m.vuelta);
  const transform: Record<string, string> = {
    entero: `translate(${JOCKER.x} ${JOCKER.rama}) scale(${JOCKER.escala})`,
    hamaca: `rotate(${n2(m.hamaca)})`,
    vuelta: `scale(${n2(v.ancho)} 1)`,
    pecho: `translate(${px} ${py}) scale(${n2(1 + 0.014 * m.respira)} ${n2(1 + 0.02 * m.respira)}) translate(${-px} ${-py})`,
    estrella: `rotate(${n2(m.estrella)} ${ax} ${ay})`,
    cabeza: `translate(0 ${n2(-1.2 * m.respira)}) rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    // La carcajada se abre desde el labio de arriba.
    'boca-abierta': `translate(${bx} ${by - 4}) scale(1 ${n2(Math.max(0.05, m.boca))}) translate(${-bx} ${-(by - 4)})`,
    brazo: `rotate(${n2(m.brazo)} ${sx} ${sy})`,
    antebrazo: `rotate(${n2(m.antebrazo)} ${CODO[0]} ${CODO[1]})`,
    mazo: `rotate(${n2(m.mazo)} ${MANO[0]} ${MANO[1]})`,
    oreja: `rotate(${n2(-m.mazo * 0.4)} ${MANO[0]} ${MANO[1]})`,
  };
  for (const i of [0, 1, 2] as const) transform[`punta-${i + 1}`] = `rotate(${n2(m.puntas[i])} ${A.puntas[i][0]} ${A.puntas[i][1]})`;
  NAIPES.forEach((nombre, i) => {
    transform[`naipe-${nombre}`] = `rotate(${n2((i - 1.5) * (2 + (ABANICO - 2) * m.abanico))} ${MANO[0]} ${MANO[1]})`;
  });
  for (const n of [0, 1] as const) {
    const [hx, hy] = A.caderas[n];
    const [kx, ky] = A.rodillas[n];
    transform[`muslo-${n + 1}`] = `rotate(${n2(m.muslos[n])} ${hx} ${hy})`;
    transform[`canilla-${n + 1}`] = `rotate(${n2(m.canillas[n])} ${kx} ${ky})`;
    const [ex, ey] = A.ojos[n];
    transform[`pupila-${n + 1}`] = `translate(${n2(m.mira[0] * 2.6)} ${n2(m.mira[1] * 2.2)})`;
    const top = ey - A.radioOjo - 1;
    transform[`parpado-${n + 1}`] = `translate(${ex} ${top}) scale(1 ${n2(Math.max(0.02, m.parpados[n]))}) translate(${-ex} ${-top})`;
  }
  const opacity: Record<string, string> = {
    jocker: v.cual === 'jocker' ? '1' : '0',
    dorso: v.cual === 'dorso' ? '1' : '0',
    as: v.cual === 'as' ? '1' : '0',
    'boca-cerrada': m.boca > 0.25 ? '0' : '1',
    'boca-abierta': m.boca > 0.25 ? '1' : '0',
    tilin: n2(m.tilin),
    oreja: n2(m.oreja),
    brillo: n2(m.brillo),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: a la izquierda de la cabeza, arriba del cascabel de afuera, en el recinto. */
export const VERSO: Punto = alRecinto([-60, -30]);
