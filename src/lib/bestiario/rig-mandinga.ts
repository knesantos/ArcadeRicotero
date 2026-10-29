/**
 * Los números de Mandinga (`D-73`, vigesimosegunda vuelta): dónde se para en el damero del infierno, cómo
 * está armado y cómo se pone. Los lee el dibujo (`arte-mandinga.ts`), para la pose quieta del HTML y para el
 * retrato, y la conducta (`scripts/bestiario/mandinga.ts`), que se lleva esto y nada que dibuje.
 *
 * Mandinga es un títere de sombra: un recorte chato, de perfil, sostenido con varillas desde abajo. Por eso
 * para irse se pone de canto (`giro` 0) y deja de verse.
 *
 * Dos sistemas de coordenadas:
 * - **El de Mandinga**: el (0, 0) es el piso entre las botas; arriba es negativo, y mira a la izquierda, para
 *   el lado de Luzbelito. Está dibujado a dos veces, y la escena lo achica con `MANDINGA.escala`.
 * - **El del recinto** (900 × 640): parado adelante en el damero, a la derecha del busto de Luzbelito, con el
 *   candil en el piso detrás. Su sombra chinesca se proyecta en la pared del fondo (`SOMBRA`).
 */

import { rot, type P } from './trazos.ts';

export type Punto = P;

/** Dónde se para, y lo que mide. */
export const MANDINGA = { x: 612, piso: 598, escala: 0.66 } as const;

/** Dónde cae su sombra chinesca en la pared del fondo, en el recinto: el pie y lo que mide. */
export const SOMBRA = { x: 610, piso: 336, escala: 0.62 } as const;

/** Cómo está armado, en sus coordenadas. El brazo 1 es el de adelante, el del saludo; el 2 el de atrás. */
export const MANDINGA_ARMADO = {
  /** Las botas: de acá se hamaca el cuerpo entero. */
  pies: [0, 0] as Punto,
  hombros: [[-20, -184], [18, -184]] as readonly [Punto, Punto],
  codos: [[-36, -142], [30, -140]] as readonly [Punto, Punto],
  manos: [[-50, -112], [36, -104]] as readonly [Punto, Punto],
  cuello: [-2, -198] as Punto,
  cara: [-8, -224] as Punto,
  /** La nariz, la de la manga. */
  nariz: [-34, -222] as Punto,
  /** Donde apoya el sombrero en la cabeza: de acá se lo saca. */
  copa: [-4, -252] as Punto,
  /** De dónde cuelga el cascabel, en el ala del sombrero. */
  cascabel: [-40, -250] as Punto,
  /** La varilla del cuerpo, que lo sostiene desde abajo del piso. */
  varilla: [2, -150] as Punto,
  /** El candil, en el piso detrás, y la llama. */
  candil: [74, 0] as Punto,
  llama: [74, -18] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** El giro del recorte: 1 de perfil, 0 de canto (no se ve). */
  giro: number;
  /** Cuánto se hamaca desde las botas (grados) y cuánto rebota (unidades, para arriba). */
  hamaca: number;
  rebota: number;
  /** Cuánto gira la cabeza en el cuello (grados). */
  cabeza: number;
  /** Cuánto gira cada brazo en el hombro y cada antebrazo en el codo (grados). */
  brazos: readonly [number, number];
  codos: readonly [number, number];
  /** El sombrero: cuánto se levanta (0 puesto, 1 en la mano) . */
  sombrero: number;
  /** El cascabel: cuánto se hamaca (grados). */
  cascabel: number;
  /** La llama del candil: lo viva que está (0 a 1). El fogonazo que encandila (0 a 1). */
  llama: number;
  destello: number;
  /** La sombra chinesca en la pared: lo negra que se ve (0 a 1) y lo grande (0 a 1). */
  sombra: number;
  crece: number;
}

/** La pose quieta, la del HTML: de perfil, con el sombrero puesto y el candil bajo. */
export const QUIETO: Momento = {
  giro: 1,
  hamaca: 0,
  rebota: 0,
  cabeza: 0,
  brazos: [0, 0],
  codos: [0, 0],
  sombrero: 0,
  cascabel: 0,
  llama: 0.4,
  destello: 0,
  sombra: 0.12,
  crece: 0,
};

/**
 * *"Mandinga lo pone así, siniestro pero gentil, una sombra chinesca"*: el sombrero en la mano, los cuernos a
 * la vista, el candil vivo y la sombra grande en la pared. Es el toque quieto y el retrato.
 */
export const GENTIL: Momento = {
  ...QUIETO,
  hamaca: -6,
  cabeza: 10,
  brazos: [152, 0],
  codos: [0, 0],
  sombrero: 1,
  cascabel: 14,
  llama: 1,
  sombra: 0.8,
  crece: 1,
};

/** Lo que gira el brazo y el codo para llevarse la manga a la nariz. */
export const MANGA = { brazo: 92, codo: 132 } as const;

/** Dónde clava cada varilla de las manos, abajo del piso, en sus coordenadas. */
export const VARILLAS = [[-74, 70], [56, 70]] as const;

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [MANDINGA.x + x * MANDINGA.escala, MANDINGA.piso + y * MANDINGA.escala];

/** La mano 1 con el brazo y el codo girados: para ver que el saludo llega al sombrero y la manga a la nariz. */
export function manoCon(brazo: number, codo: number, n: 0 | 1 = 0): Punto {
  const A = MANDINGA_ARMADO;
  const codoGirado = rot(A.codos[n], A.hombros[n], brazo);
  const mano = rot(A.manos[n], A.hombros[n], brazo);
  return rot(mano, codoGirado, codo);
}

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = MANDINGA_ARMADO;
  const [cx, cy] = A.cuello;
  const [kx, ky] = A.copa;
  const [qx, qy] = A.cascabel;
  const [lx, ly] = A.llama;
  // El sombrero, al sacárselo, sube y se va para adelante, como en un saludo de gaucho.
  const [sx, sy] = [-18 * m.sombrero, -26 * m.sombrero];
  const transform: Record<string, string> = {
    entero: `translate(${MANDINGA.x} ${MANDINGA.piso}) scale(${MANDINGA.escala})`,
    recorte: `scale(${n2(Math.max(0.001, m.giro))} 1)`,
    cuerpo: `translate(0 ${n2(-m.rebota)}) rotate(${n2(m.hamaca)} 0 0)`,
    cabeza: `rotate(${n2(m.cabeza)} ${cx} ${cy})`,
    sombrero: `translate(${n2(sx)} ${n2(sy)}) rotate(${n2(-24 * m.sombrero)} ${kx} ${ky})`,
    cascabel: `rotate(${n2(m.cascabel)} ${qx} ${qy})`,
    llama: `translate(${lx} ${ly}) scale(${n2(0.6 + 0.8 * m.llama)} ${n2(0.5 + 1.1 * m.llama)}) translate(${-lx} ${-ly})`,
    sombra: `translate(${SOMBRA.x} ${SOMBRA.piso}) scale(${n2(SOMBRA.escala * (0.7 + 0.6 * m.crece))})`,
  };
  for (const n of [0, 1] as const) {
    const [hx, hy] = A.hombros[n];
    const [ex, ey] = A.codos[n];
    transform[`brazo-${n + 1}`] = `rotate(${n2(m.brazos[n])} ${hx} ${hy})`;
    transform[`antebrazo-${n + 1}`] = `rotate(${n2(m.codos[n])} ${ex} ${ey})`;
    // La varilla de la mano va de la mano hasta donde clava abajo del piso, siga la mano adonde siga: es una
    // raya de largo 1 que se gira y se estira.
    const [mx, my] = manoCon(m.brazos[n], m.codos[n], n);
    const [bx, by] = VARILLAS[n];
    const ang = (Math.atan2(-(bx - mx), by - my) * 180) / Math.PI;
    transform[`varilla-${n + 1}`] = `translate(${n2(mx)} ${n2(my)}) rotate(${n2(ang)}) scale(1 ${n2(Math.hypot(bx - mx, by - my))})`;
  }
  const opacity: Record<string, string> = {
    llama: n2(0.5 + 0.5 * m.llama),
    resplandor: n2(0.2 + 0.8 * m.llama),
    destello: n2(m.destello),
    sombra: n2(m.sombra),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de los cuernos, en el recinto. */
export const VERSO: Punto = alRecinto([0, -320]);
