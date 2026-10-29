/**
 * Los números del ahogado y su fiel fantasma (`D-73`, vigesimoquinta vuelta): dónde se hunde en el agua del
 * bajo, cómo están armados los dos y cómo se ponen. Los lee el dibujo (`arte-ahogado.ts`), para la pose quieta
 * del HTML y para el retrato, y la conducta (`scripts/bestiario/ahogado.ts`), que se lleva esto y nada que
 * dibuje.
 *
 * Son dos en un títere: **el ahogado**, con el agua a la boca, y **su fantasma**, una sábana que flota arriba,
 * atada con un piolín al tobillo del otro, que está debajo del agua y no se ve.
 *
 * Dos sistemas de coordenadas:
 * - **El del ahogado**: el (0, 0) es donde el agua le toca la boca; arriba es negativo. Lo que baja de
 *   `AGUA` no se dibuja: por ahí se van a pique los dos. Están dibujados a casi el doble, y la escena los
 *   achica con `AHOGADO.escala`.
 * - **El del recinto** (el bajo, de −250 a 1200): en el agua de la izquierda, entre la pared del recinto y el
 *   bote dado vuelta. Los ojos quedan donde estaban sus ojos en lo oscuro (`VECINOS_DEL_BAJO`).
 */

import type { P } from './trazos.ts';

export type Punto = P;

/**
 * Dónde se hunde, y lo que mide. `agua` es la línea del agua a su altura: más adelante que la de Pierre
 * (476) y que la de la pared del fondo (372), porque el ahogado está más cerca del que mira.
 */
export const AHOGADO = { x: -170, agua: 500, escala: 0.6 } as const;

/** Hasta dónde se ve para abajo: la línea del agua, un poquito más abajo de la boca. */
export const AGUA = 3;

/** Cómo están armados, en las coordenadas del ahogado. El brazo 1 es el del auxilio; el 2, el del salvavidas. */
export const AHOGADO_ARMADO = {
  /** Los dos ojos desorbitados, y el medio de los dos: donde estaban en lo oscuro. */
  ojos: [[-10, -25], [10, -25]] as readonly [Punto, Punto],
  ojo: [0, -25] as Punto,
  /** El cogote, debajo del agua: de acá ladea la cabeza. */
  cuello: [0, 14] as Punto,
  boca: [0, 0] as Punto,
  nariz: [0, -11] as Punto,
  /** Los hombros, debajo del agua, y las manos: la que pide auxilio con la moneda, y la del salvavidas. */
  hombros: [[24, 12], [-24, 12]] as readonly [Punto, Punto],
  manos: [[56, -84], [-48, -4]] as readonly [Punto, Punto],
  /** La moneda para el barquero, entre los dedos de la mano levantada. */
  moneda: [61, -101] as Punto,
  /** El salvavidas desinflado, que flota apenas al lado de la mano. */
  salvavidas: [-80, -2] as Punto,
  /** El sombrero, que flota solo, para el lado del bote. */
  sombrero: [124, -2] as Punto,
  /** El pescado que le queda en la cabeza cuando vuelve: de acá coletea. */
  pescado: [4, -56] as Punto,
  /** El medio de la sábana del fantasma, en su lugar de siempre: arriba a la izquierda del ahogado. */
  fantasma: [-30, -150] as Punto,
  /** Los dos agujeros de la sábana, por donde se ve la noche del bajo. */
  agujeros: [[-42, -170], [-18, -170]] as readonly [Punto, Punto],
  /** La boca del BU, que no es un agujero: es la tela que se abre para adentro. */
  bocaF: [-30, -130] as Punto,
  /** Los hombros de la sábana: de acá giran las mangas. */
  mangas: [[-64, -160], [4, -160]] as readonly [Punto, Punto],
  /** El canto de arriba del ruedo, que flamea. */
  ruedo: -114,
  /** El nudo del piolín, en la punta izquierda del ruedo: va al tobillo del ahogado. */
  nudo: [-78, -92] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export type Par = readonly [number, number];

export interface Momento {
  /** Cuánto sale el ahogado del agua (unidades, para arriba): negativo es irse a pique. */
  alto: number;
  /** Cuánto ladea la cabeza en el cogote (grados). */
  ladea: number;
  /** Cuánto gira cada brazo en su hombro (grados). */
  brazos: Par;
  /** Para dónde miran las pupilas (corrimiento x, y). */
  mira: Par;
  /** Los párpados del ahogado (0 abiertos, 1 cerrados), y la boca (0 cerrada, 1 el glu glu). */
  parpado: number;
  boca: number;
  /** El chorrito que escupe (0 a 1, cuánto salió). */
  chorro: number;
  /** Cada racimo de burbujas del glu glu: cuánto subió (0 a 1; 0 es que no hay). */
  glu: Par;
  /** El glu glu grande, de cuando se va a pique del todo (0 a 1). */
  burbujon: number;
  /** El alga con el pescado que le queda en la cabeza (0 a 1), y cuánto coletea el pescado (grados). */
  alga: number;
  pescado: number;
  /** El sombrero que flota solo: cuánto se corre, cuánto sube y baja, y cuánto gira. */
  sombrero: readonly [number, number, number];
  /** Las ondas del agua alrededor de los dos (0 a 1). */
  ondas: number;
  /** Dónde está el fantasma, corrido de su lugar (x, y; para abajo es positivo: se zambulle). */
  fantasma: Par;
  /** Cuánto se infla (0 de siempre, 1 el BU enorme), y cuánto se da vuelta (0 de frente, 1 de espaldas). */
  infla: number;
  vuelta: number;
  /** Cuánto se inclina la sábana (grados): para asomarse a mirarlo. */
  inclina: number;
  /** Los agujeros que se achican: el pestañeo del fantasma (0 abiertos, 1 cerrados). */
  agujeros: number;
  /** La boca del BU (0 cerrada, 1 abierta del todo). */
  bu: number;
  /** El ruedo que flamea (−1 a 1). */
  flamea: number;
  /** Cuánto gira cada manga en su hombro (grados). */
  mangas: Par;
  /** La sábana retorcida, escurriéndose (0 a 1), y las gotas que caen (0 a 1, cuánto cayeron; 0 es que no hay). */
  escurre: number;
  gotas: number;
}

/** La pose quieta, la del HTML: el agua a la boca, la mano con la moneda arriba y el fantasma encima. */
export const QUIETO: Momento = {
  alto: 0,
  ladea: 0,
  brazos: [0, 0],
  mira: [0, -1.5],
  parpado: 0,
  boca: 0,
  chorro: 0,
  glu: [0, 0],
  burbujon: 0,
  alga: 0,
  pescado: 0,
  sombrero: [0, 0, 0],
  ondas: 0.4,
  fantasma: [0, 0],
  infla: 0,
  vuelta: 0,
  inclina: 0,
  agujeros: 0,
  bu: 0,
  flamea: 0,
  mangas: [0, 0],
  escurre: 0,
  gotas: 0,
};

/**
 * *"Me estoy por ahogar, me voy a pique, glu glu, bu buuu"*: el fantasma inflado, con la boca abierta en el BU
 * y las mangas arriba, y el ahogado haciendo glu glu, mirándolo. Es el toque quieto y el retrato.
 */
export const BU: Momento = {
  ...QUIETO,
  alto: -4,
  brazos: [-14, 8],
  mira: [-3, -3],
  boca: 1,
  glu: [0.45, 0.15],
  ondas: 1,
  fantasma: [16, 4],
  infla: 1,
  inclina: 6,
  bu: 1,
  flamea: 0.6,
  mangas: [118, -118],
};

/** Lo que baja el ahogado para irse a pique del todo: con esto no se le ve ni la moneda. */
export const HONDO = 120;
/** Lo que baja el fantasma para zambullirse detrás de él, aunque esté inflado. */
export const ZAMBULLE = 270;
/** Cuánto se agranda la sábana inflada del todo, en el BU. */
export const INFLADO = 0.4;

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [AHOGADO.x + x * AHOGADO.escala, AHOGADO.agua + y * AHOGADO.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** La escala de la sábana en un momento: inflada, dada vuelta (de canto, angosta) y retorcida. */
export function escalaDeLaSabana(m: Momento): [number, number] {
  const infla = 1 + INFLADO * m.infla;
  const canto = Math.cos(Math.PI * m.vuelta);
  const giro = Math.sign(canto || 1) * Math.max(0.06, Math.abs(canto));
  return [infla * giro * (1 - 0.34 * m.escurre), infla * (1 + 0.08 * m.escurre)];
}

/** Dónde queda un punto de la sábana en un momento: corrido, girado e inflado alrededor de su medio. */
export function alFantasma(m: Momento, [x, y]: Punto): Punto {
  const [fx, fy] = AHOGADO_ARMADO.fantasma;
  const [ex, ey] = escalaDeLaSabana(m);
  const r = (m.inclina * Math.PI) / 180;
  const [dx, dy] = [(x - fx) * ex, (y - fy) * ey];
  return [fx + m.fantasma[0] + dx * Math.cos(r) - dy * Math.sin(r), fy + m.fantasma[1] + dx * Math.sin(r) + dy * Math.cos(r)];
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = AHOGADO_ARMADO;
  const [cx, cy] = A.cuello;
  const [bx, by] = A.boca;
  const [fx, fy] = A.fantasma;
  const [px, py] = A.pescado;
  const [sx, sy] = A.sombrero;
  const [ux, uy] = A.bocaF;
  const [ex, ey] = escalaDeLaSabana(m);
  // Los párpados bajan desde arriba del ojo; los agujeros se achican desde arriba del agujero.
  const arribaDelOjo = A.ojo[1] - 8;
  const arribaDelAgujero = A.agujeros[0][1] - 10;
  const nudo = alFantasma(m, A.nudo);
  const fantasma = `translate(${n2(m.fantasma[0])} ${n2(m.fantasma[1])}) translate(${fx} ${fy}) rotate(${n2(m.inclina)}) scale(${n2(ex)} ${n2(ey)}) translate(${-fx} ${-fy})`;
  const transform: Record<string, string> = {
    entero: `translate(${AHOGADO.x} ${AHOGADO.agua}) scale(${AHOGADO.escala})`,
    ahogado: `translate(0 ${n2(-m.alto)})`,
    cabeza: `rotate(${n2(m.ladea)} ${cx} ${cy})`,
    pupilas: `translate(${n2(m.mira[0])} ${n2(m.mira[1])})`,
    parpados: `translate(0 ${arribaDelOjo}) scale(1 ${n2(Math.max(0.02, m.parpado))}) translate(0 ${-arribaDelOjo})`,
    boca: `translate(${bx} ${by}) scale(${n2(0.7 + 0.3 * m.boca)} ${n2(0.25 + 0.75 * m.boca)}) translate(${-bx} ${-by})`,
    chorro: `translate(${bx} ${by - 2}) scale(${n2(0.2 + 0.8 * m.chorro)}) translate(${-bx} ${-(by - 2)})`,
    'burbujas-1': `translate(0 ${n2(-46 * m.glu[0])}) translate(${bx} ${by - 8}) scale(${n2(0.6 + 0.6 * m.glu[0])}) translate(${-bx} ${-(by - 8)})`,
    'burbujas-2': `translate(0 ${n2(-52 * m.glu[1])}) translate(${bx} ${by - 8}) scale(${n2(0.6 + 0.6 * m.glu[1])}) translate(${-bx} ${-(by - 8)})`,
    burbujon: `translate(${bx} ${by}) scale(${n2(0.5 + 0.6 * m.burbujon)}) translate(${-bx} ${-by})`,
    pescado: `rotate(${n2(m.pescado)} ${px} ${py})`,
    sombrero: `translate(${n2(m.sombrero[0])} ${n2(m.sombrero[1])}) rotate(${n2(m.sombrero[2])} ${sx} ${sy})`,
    ondas: `scale(${n2(0.85 + 0.3 * m.ondas)} 1)`,
    // El fantasma: la sábana, su piolín por detrás del ahogado y sus mangas por delante, con la misma cuenta.
    fantasma,
    // El piolín no se infla con la sábana: va adonde vaya el nudo, nada más.
    piolin: `translate(${n2(nudo[0] - A.nudo[0])} ${n2(nudo[1] - A.nudo[1])})`,
    'fantasma-delante': fantasma,
    agujeros: `translate(0 ${arribaDelAgujero}) scale(1 ${n2(Math.max(0.02, m.agujeros))}) translate(0 ${-arribaDelAgujero})`,
    'boca-f': `translate(${ux} ${uy}) scale(${n2(0.4 + 0.6 * m.bu)} ${n2(0.2 + 0.8 * m.bu)}) translate(${-ux} ${-uy})`,
    ruedo: `translate(0 ${A.ruedo}) skewX(${n2(14 * m.flamea)}) translate(0 ${-A.ruedo})`,
    gotas: `translate(0 ${n2(34 * m.gotas)})`,
  };
  for (const n of [0, 1] as const) {
    const [hx, hy] = A.hombros[n];
    const [mx, my] = A.mangas[n];
    transform[`brazo-${n + 1}`] = `rotate(${n2(m.brazos[n])} ${hx} ${hy})`;
    transform[`manga-${n + 1}`] = `rotate(${n2(m.mangas[n])} ${mx} ${my})`;
  }
  const opacity: Record<string, string> = {
    chorro: n2(m.chorro > 0 ? Math.min(1, m.chorro * 3) * (1 - 0.6 * m.chorro) : 0),
    'burbujas-1': n2(m.glu[0] > 0 ? Math.sin(Math.PI * Math.min(1, m.glu[0])) : 0),
    'burbujas-2': n2(m.glu[1] > 0 ? Math.sin(Math.PI * Math.min(1, m.glu[1])) : 0),
    burbujon: n2(m.burbujon),
    alga: n2(m.alga),
    ondas: n2(0.35 + 0.65 * m.ondas),
    espalda: m.vuelta > 0.5 ? '1' : '0',
    'boca-f': n2(m.bu),
    gotas: n2(m.gotas > 0 ? Math.sin(Math.PI * Math.min(1, m.gotas)) : 0),
  };
  return { transform, opacity };
}

/** Dónde dicen su verso: arriba de la sábana, en el recinto. */
export const VERSO: Punto = alRecinto([-10, -236]);
