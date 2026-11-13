/**
 * Los números del taxi paranormal (`D-73`, vigesimoséptima vuelta): dónde quedó volcado en la banquina, cómo está
 * armado y cómo se pone. Los lee el dibujo (`arte-taxi.ts`), para la pose quieta del HTML y para el retrato, y la
 * conducta (`scripts/bestiario/taxi.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del taxi**: el (0, 0) es la banquina debajo del medio del techo, que es lo que apoya; arriba es negativo.
 *   Está **con las ruedas para arriba** y con la trompa a la **derecha**. Está dibujado al doble, y la escena lo
 *   achica con `TAXI.escala`.
 * - **El del recinto** (900 × 640, el de la ruta): en la banquina de este lado, donde estaba pintado
 *   (`RUTA.volcado`). No es del tránsito: está quieto, y va adelante de los yuyos (`delante`), que si no lo rayan. En el camino el piso es más ancho y todo lo fijo se corre
 *   con `k` (`K_ENTORNO`): el marco lo corre `ancla · (k − 1)`.
 */

import type { P } from './trazos.ts';
import { RUTA } from './rig-entornos.ts';

export type Punto = P;

/** Dónde quedó, y lo que mide. */
export const TAXI = { x: RUTA.volcado.x, piso: RUTA.volcado.piso, escala: 0.7 } as const;

/** Cómo está armado, patas arriba, en sus coordenadas. */
export const TAXI_ARMADO = {
  /** El medio del fierro: de acá se inclina cuando levita. */
  medio: [0, -44] as Punto,
  /** Los ejes de las ruedas, la de atrás y la de adelante, y lo que miden. */
  ruedas: [[-96, -98], [98, -98]] as readonly [Punto, Punto],
  radio: 25,
  /** El faro que quedó prendido, en la trompa, y lo que mide: es un ojo, y parpadea. */
  faro: { centro: [146, -62] as Punto, radio: 9 },
  /** La bisagra del baúl, que con el taxi dado vuelta se abre para abajo, y por dónde se escapa el diablo. */
  baul: [-98, -43] as Punto,
  diablo: [-124, -20] as Punto,
  /** De dónde le sale la cola al diablo. */
  cola: [-136, -40] as Punto,
  /** El codo del chofer, en la ventanilla: de acá gira el brazo, que cuelga hasta el piso. */
  codo: [-2, -32] as Punto,
  /** La boca del caño de escape, de donde salen las pompas. */
  escape: [-156, -88] as Punto,
  /** La bandera del reloj, en el parabrisas. */
  libre: [46, -28] as Punto,
} as const;

/** Lo que sube cuando levita, en sus unidades, y lo que se abre el baúl, en grados. */
export const LEVITA_ALTO = 34;
export const ABRE = 38;
/** Lo que se corre el doble cuando se va de foco, en sus unidades. */
export const CORRE = [16, -9] as const;
/** Lo que sube el diablo para esconderse atrás de la chapa, en sus unidades. */
export const ESCONDE = 40;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Cuánto levita (0 apoyado, 1 arriba), lo que se inclina (grados) y el temblor (unidades). */
  levita: number;
  inclina: number;
  tiembla: number;
  /** Lo que se aplasta contra la banquina cuando cae (0 a 1). */
  aplasta: number;
  /** Las ruedas: lo que giró cada una, en grados. */
  ruedas: readonly [number, number];
  /** El párpado del faro (0 abierto, 1 cerrado) y el haz que tira al cielo (0 a 1). */
  parpado: number;
  haz: number;
  /** Fuera de foco (0 a 1): cuánto se le despega el doble. */
  foco: number;
  /** El baúl (0 cerrado, 1 abierto), el diablo que asoma (0 a 1), y su cola: cuánto sacó (0 a 1) y cómo la mueve (grados). */
  baul: number;
  diablo: number;
  cola: number;
  colea: number;
  /** El brazo del chofer (grados; 0 cuelga al piso, negativo lo levanta para afuera). */
  brazo: number;
  /** Las pompas de jabón del escape: la fase de la tanda (0 a 1). En las puntas no se ven. */
  pompas: number;
  /** La bandera del reloj (0 apagada, 1 prendida). */
  libre: number;
}

/** La pose quieta, la del HTML: volcado, con el faro a medio párpado alumbrando el cielo y el brazo colgando. */
export const QUIETO: Momento = {
  levita: 0,
  inclina: 0,
  tiembla: 0,
  aplasta: 0,
  ruedas: [0, 0],
  parpado: 0.35,
  haz: 0.6,
  foco: 0.12,
  baul: 0.12,
  // Se le escapa un poquito: en reposo ya le asoman los cuernos y los ojos por abajo del baúl.
  diablo: 0.6,
  cola: 0.35,
  colea: 0,
  brazo: 0,
  pompas: 0,
  libre: 0.5,
};

/**
 * Paranormal: levita a un palmo de la banquina, inclinado, fuera de foco, con el faro abierto de par en par, el
 * baúl abierto, el diablo asomado y el chofer saludando. Es el toque quieto y el retrato.
 */
export const LEVITA: Momento = {
  ...QUIETO,
  levita: 1,
  inclina: -7,
  ruedas: [40, 110],
  parpado: 0,
  haz: 1,
  foco: 1,
  baul: 1,
  diablo: 1,
  cola: 1,
  colea: -14,
  brazo: -118,
  pompas: 0.45,
  libre: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [TAXI.x + x * TAXI.escala, TAXI.piso + y * TAXI.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = TAXI_ARMADO;
  const [mx, my] = A.medio;
  const [bx, by] = A.baul;
  const [kx, ky] = A.cola;
  const [cx, cy] = A.codo;
  const { centro: [fx, fy], radio } = A.faro;
  const top = fy - radio - 0.6;
  const fase = Math.min(1, Math.max(0, m.pompas));
  const transform: Record<string, string> = {
    entero: `translate(${TAXI.x} ${TAXI.piso}) scale(${TAXI.escala})`,
    // Levita, se inclina y tiembla; cuando cae, se aplasta contra el piso, desde el piso.
    fierro: `translate(${n2(m.tiembla)} ${n2(-LEVITA_ALTO * m.levita)}) rotate(${n2(m.inclina)} ${mx} ${my}) scale(${n2(1 + 0.04 * m.aplasta)} ${n2(1 - 0.08 * m.aplasta)})`,
    doble: `translate(${n2(CORRE[0] * m.foco)} ${n2(CORRE[1] * m.foco)})`,
    'rueda-1': `rotate(${n2(m.ruedas[0])} ${A.ruedas[0][0]} ${A.ruedas[0][1]})`,
    'rueda-2': `rotate(${n2(m.ruedas[1])} ${A.ruedas[1][0]} ${A.ruedas[1][1]})`,
    parpado: `translate(${fx} ${top}) scale(1 ${n2(Math.max(0.02, m.parpado))}) translate(${-fx} ${-top})`,
    baul: `rotate(${n2(-ABRE * m.baul)} ${bx} ${by})`,
    // El diablo cuelga cabeza abajo del baúl, que está dado vuelta: escondido queda atrás de la chapa, y baja.
    diablo: `translate(0 ${n2(-ESCONDE * (1 - m.diablo))})`,
    cola: `rotate(${n2(m.colea)} ${kx} ${ky}) translate(${kx} ${ky}) scale(${n2(Math.max(0.04, m.cola))}) translate(${-kx} ${-ky})`,
    brazo: `rotate(${n2(m.brazo)} ${cx} ${cy})`,
    pompas: `translate(${n2(-14 * fase)} ${n2(-64 * fase)}) translate(${A.escape[0]} ${A.escape[1]}) scale(${n2(0.5 + 0.8 * fase)}) translate(${-A.escape[0]} ${-A.escape[1]})`,
  };
  const opacity: Record<string, string> = {
    doble: n2(0.18 + 0.5 * m.foco),
    haz: n2(m.haz * (1 - 0.85 * m.parpado)),
    pompas: n2(fase <= 0 || fase >= 1 ? 0 : Math.min(1, 5 * Math.sin(fase * Math.PI))),
    libre: n2(m.libre),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de las ruedas, en el recinto. */
export const VERSO: Punto = alRecinto([0, -150]);
