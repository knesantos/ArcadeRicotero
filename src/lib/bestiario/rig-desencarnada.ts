/**
 * Los números de la bella señora desencarnada (`D-73`, vigésima vuelta): dónde espera al costado de la
 * ruta, cómo está armada y cómo se pone. Los lee el dibujo (`arte-desencarnada.ts`), para la pose quieta
 * del HTML y para el retrato, y la conducta (`scripts/bestiario/desencarnada.ts`), que se lleva esto y
 * nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de la señora**: el (0, 0) es el piso entre los pies; arriba es negativo. Está de frente,
 *   dibujada a dos veces, y la escena la achica con `SENORA.escala`.
 * - **El del recinto** (900 × 640): parada en la banquina de abajo, la de este lado, entre la piba de
 *   Greenpeace que duerme y el taxi volcado. Los fierros pasan por detrás de ella.
 */

import { rot, type P } from './trazos.ts';

export type Punto = P;

/** Dónde espera, y lo que mide. */
export const SENORA = { x: 478, piso: 620, escala: 0.56 } as const;

/** Cómo está armada, en las coordenadas de la señora. El brazo 1 es el de la cartera, el 2 el que levanta el velo. */
export const SENORA_ARMADO = {
  /** La cintura: de acá se mece el cuerpo de arriba; la pollera se mece desde el ruedo. */
  cintura: [0, -170] as Punto,
  hombros: [[-24, -228], [24, -228]] as readonly [Punto, Punto],
  /** Las manos con los brazos quietos: la cartera colgando de la 1, la 2 apoyada en la pollera. */
  manos: [[-34, -150], [32, -156]] as readonly [Punto, Punto],
  cuello: [0, -244] as Punto,
  /** El medio de la calavera, y las cuencas. */
  cara: [0, -270] as Punto,
  cuencas: [[-7, -274], [7, -274]] as readonly [Punto, Punto],
  /** La coronilla con la peineta: de acá cuelga el velo. */
  coronilla: [0, -292] as Punto,
  /** El corazón, donde se viene el día. */
  corazon: [-6, -206] as Punto,
  /** El nudo del pañuelo de seda, en el cuello: de acá flamean las puntas. */
  nudo: [8, -240] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Cuánto se mece el cuerpo de arriba desde la cintura, y la pollera desde los pies (grados). */
  mece: number;
  pollera: number;
  /** Cuánto gira la cabeza (grados). */
  cabeza: number;
  /** Cuánto gira cada brazo en el hombro (grados). */
  brazos: readonly [number, number];
  /** El velo: lo que lo tira el viento (grados) y lo levantado que está (0 caído, 1 levantado del todo). */
  viento: number;
  velo: number;
  /** Lo que flamea el pañuelo (grados). */
  panuelo: number;
  /** El corazón: 0 apagado; 1 el día que se viene. Y la luz en las cuencas, de 0 a 1. */
  dia: number;
  cuencas: number;
}

/** La pose quieta, la del HTML: esperando, con el velo caído y la cartera colgando. */
export const QUIETO: Momento = {
  mece: 0,
  pollera: 0,
  cabeza: 0,
  brazos: [0, 0],
  viento: 0,
  velo: 0,
  panuelo: 0,
  dia: 0.12,
  cuencas: 0,
};

/** Lo que gira el brazo del velo para levantarlo. */
export const ALZA = -165;

/**
 * *"Cuando la noche es más oscura, se viene el día en tu corazón"*: el velo levantado, la calavera a la
 * vista, y el día que se le prende en el pecho. Es el toque quieto y el retrato.
 */
export const EL_DIA: Momento = {
  ...QUIETO,
  cabeza: -4,
  brazos: [6, ALZA],
  viento: 6,
  velo: 1,
  panuelo: 10,
  dia: 1,
  cuencas: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [SENORA.x + x * SENORA.escala, SENORA.piso + y * SENORA.escala];

/** La mano 2 con el brazo girado, y la coronilla con la cintura mecida: para ver que la mano llega al velo. */
export const manoDelVelo = (brazo: number): Punto => rot(SENORA_ARMADO.manos[1], SENORA_ARMADO.hombros[1], brazo);

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = SENORA_ARMADO;
  const [wx, wy] = A.cintura;
  const [cx, cy] = A.cuello;
  const [kx, ky] = A.coronilla;
  const [nx, ny] = A.nudo;
  const [hx, hy] = A.corazon;
  const transform: Record<string, string> = {
    entero: `translate(${SENORA.x} ${SENORA.piso}) scale(${SENORA.escala})`,
    pollera: `rotate(${n2(m.pollera)} 0 0)`,
    torso: `rotate(${n2(m.mece)} ${wx} ${wy})`,
    cabeza: `rotate(${n2(m.cabeza)} ${cx} ${cy})`,
    // El velo cuelga de la peineta: el viento lo tira de costado y al levantarlo se recoge para arriba.
    velo: `rotate(${n2(m.viento - 8 * m.velo)} ${kx} ${ky}) translate(${kx} ${ky}) scale(1 ${n2(Math.max(0.12, 1 - 0.84 * m.velo))}) translate(${-kx} ${-ky})`,
    panuelo: `rotate(${n2(m.panuelo)} ${nx} ${ny})`,
    dia: `translate(${hx} ${hy}) scale(${n2(0.3 + 0.7 * m.dia)}) translate(${-hx} ${-hy})`,
  };
  for (const n of [0, 1] as const) {
    const [sx, sy] = A.hombros[n];
    transform[`brazo-${n + 1}`] = `rotate(${n2(m.brazos[n])} ${sx} ${sy})`;
  }
  const opacity: Record<string, string> = {
    dia: n2(m.dia),
    cuencas: n2(m.cuencas),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la peineta, en el recinto. */
export const VERSO: Punto = alRecinto([0, -340]);
