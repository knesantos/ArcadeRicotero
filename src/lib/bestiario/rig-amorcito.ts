/**
 * Los números del amorcito que mordió el vidrio (`D-73`, vigesimosegunda vuelta): dónde se cuelga de la
 * ventana rota del bajo, cómo está armada y cómo se pone. Los lee el dibujo (`arte-amorcito.ts`), para la
 * pose quieta del HTML y para el retrato, y la conducta (`scripts/bestiario/amorcito.ts`), que se lleva esto
 * y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del amorcito**: el (0, 0) es el medio del marco de abajo de la ventana, donde apoya la panza;
 *   arriba es negativo. Está de frente, dibujada a dos veces, y la escena la achica con `AMORCITO.escala`.
 * - **El del recinto** (el bajo, de −250 a 1200): la ventana de al lado de la puerta, la que se corrió a la
 *   derecha (`arte-bajo.ts`, `CORRE_VENTANA`), con el marco de abajo en 240. El agua está más abajo, en 372.
 */

import { rot, type P } from './trazos.ts';

export type Punto = P;

/** Dónde se cuelga, y lo que mide. */
export const AMORCITO = { x: 794, alfeizar: 240, escala: 0.6 } as const;

/** La cabeza va más grande que el cuerpo, como en un dibujo de la tapa: cuánto, desde el cuello. */
export const CABEZA = 1.3;

/** La ventana rota, en el recinto: el hueco donde está ella. */
export const VENTANA = { x0: 748, x1: 840, arriba: 128, abajo: 240 } as const;

/** Cómo está armada, en sus coordenadas. El brazo 1 es el que cuelga suelto; el 2, el del sifón. */
export const AMORCITO_ARMADO = {
  /** La cintura, apoyada en el marco: de acá se mece y se zarandea. */
  cintura: [0, -4] as Punto,
  hombros: [[-22, -40], [22, -40]] as readonly [Punto, Punto],
  /** Los codos, apoyados en el marco, y las manos colgando para afuera de la ventana. */
  codos: [[-36, -4], [34, -4]] as readonly [Punto, Punto],
  manos: [[-30, 30], [30, 34]] as readonly [Punto, Punto],
  cuello: [0, -48] as Punto,
  /** El medio de la cara, los ojos y la boca. */
  cara: [0, -70] as Punto,
  ojos: [[-8, -74], [8, -74]] as readonly [Punto, Punto],
  boca: [0, -58] as Punto,
  /** El pico del sifón, abajo de la mano 2: de acá sale el chorro. */
  pico: [40, 44] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Cuánto se mece desde la cintura (grados) y cuánto rebota en el marco (unidades, para arriba). */
  mece: number;
  rebota: number;
  /** Cuánto gira la cabeza en el cuello (grados). */
  cabeza: number;
  /** Cuánto gira cada brazo en el hombro (grados). */
  brazos: readonly [number, number];
  /** Los párpados: 0 abiertos, 1 cerrados. La boca: 0 cerrada mordiendo, 1 abierta de par en par. */
  parpado: number;
  boca: number;
  /** El vidrio entre los dientes: 1 entero, 0 ya mordido. Y las migas que saltan, de 0 a 1 (qué tan lejos). */
  vidrio: number;
  migas: number;
  /** El chorro del sifón (0 a 1), el colorado del vino en los cachetes (0 a 1) y el hipo (0 a 1, la burbuja). */
  chorro: number;
  colorado: number;
  hipo: number;
  /** El ¡Ñam! escrito en el aire, de 0 a 1. */
  nam: number;
}

/** La pose quieta, la del HTML: colgada del marco, con el vidrio entre los dientes y los ojos a media asta. */
export const QUIETO: Momento = {
  mece: 0,
  rebota: 0,
  cabeza: -6,
  brazos: [0, 0],
  parpado: 0.45,
  boca: 0,
  vidrio: 1,
  migas: 0,
  chorro: 0,
  colorado: 0.5,
  hipo: 0,
  nam: 0,
};

/**
 * *"Cuando me muerda alocada: ¡Ñam fri frufi fali fru!"*: la boca abierta, el vidrio hecho migas y el ¡Ñam!
 * en el aire, con el sifón para arriba. Es el toque quieto y el retrato.
 */
export const NAM: Momento = {
  ...QUIETO,
  rebota: 6,
  cabeza: 8,
  brazos: [-30, -120],
  parpado: 0,
  boca: 1,
  vidrio: 0,
  migas: 0.7,
  chorro: 1,
  colorado: 1,
  nam: 1,
};

/** Lo que gira el brazo del sifón para llevárselo a la boca. */
export const SORBO = -150;

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [AMORCITO.x + x * AMORCITO.escala, AMORCITO.alfeizar + y * AMORCITO.escala];

/** El pico del sifón con el brazo girado: para ver que el sorbo le llega a la boca. */
export const picoCon = (brazo: number): Punto => rot(AMORCITO_ARMADO.pico, AMORCITO_ARMADO.hombros[1], brazo);

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = AMORCITO_ARMADO;
  const [wx, wy] = A.cintura;
  const [cx, cy] = A.cuello;
  const [bx, by] = A.boca;
  const [px, py] = A.pico;
  const transform: Record<string, string> = {
    entero: `translate(${AMORCITO.x} ${AMORCITO.alfeizar}) scale(${AMORCITO.escala})`,
    torso: `translate(0 ${n2(-m.rebota)}) rotate(${n2(m.mece)} ${wx} ${wy})`,
    cabeza: `rotate(${n2(m.cabeza)} ${cx} ${cy}) translate(${cx} ${cy}) scale(${CABEZA}) translate(${-cx} ${-cy})`,
    // La boca abierta estira la quijada para abajo.
    quijada: `translate(0 ${n2(6 * m.boca)})`,
    // Las migas salen de la boca y se abren.
    migas: `translate(${bx} ${by}) scale(${n2(0.3 + 1.4 * m.migas)}) translate(${-bx} ${-by})`,
    chorro: `translate(${px} ${py}) scale(${n2(0.2 + 0.8 * m.chorro)}) translate(${-px} ${-py})`,
    hipo: `translate(0 ${n2(-30 * m.hipo)})`,
    nam: `translate(0 ${n2(-10 * m.nam)}) rotate(${n2(-8 + 8 * m.nam)} 0 -110)`,
  };
  // Los brazos cuelgan por afuera del marco, pero se zarandean con el cuerpo.
  transform.brazos = transform.torso!;
  for (const n of [0, 1] as const) {
    const [sx, sy] = A.hombros[n];
    transform[`brazo-${n + 1}`] = `rotate(${n2(m.brazos[n])} ${sx} ${sy})`;
  }
  const opacity: Record<string, string> = {
    parpado: n2(m.parpado),
    boca: n2(m.boca),
    vidrio: n2(m.vidrio),
    migas: n2(m.migas > 0 && m.migas < 1 ? 1 - m.migas * 0.6 : 0),
    chorro: n2(m.chorro),
    colorado: n2(m.colorado),
    hipo: n2(m.hipo > 0 ? Math.sin(Math.PI * m.hipo) : 0),
    nam: n2(m.nam),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la ventana, en el recinto. */
export const VERSO: Punto = alRecinto([0, -150]);
