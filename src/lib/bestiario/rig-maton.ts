/**
 * Los números del gato matón (`D-73`, vigesimosegunda vuelta): dónde se agazapa en la chapa del canto,
 * cómo está armado y cómo se pone. Los lee el dibujo (`arte-maton.ts`), para la pose quieta del HTML y
 * para el retrato, y la conducta (`scripts/bestiario/maton.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del gato**: el (0, 0) es la chapa debajo de la panza; arriba es negativo y mira a la derecha,
 *   para el lado del ratón. Está dibujado a una vez y media, y la escena lo achica con `MATON.escala`.
 * - **El del recinto** (los techos, 1500 × 640): agazapado en la chapa que remata la medianera, a la
 *   izquierda de donde camina el Atila. El ratón que ya lo olió está un poco más allá, en la misma chapa.
 */

import { rot, type P } from './trazos.ts';

export type Punto = P;

/** Dónde se agazapa, y lo que mide. */
export const MATON = { x: 226, piso: 300, escala: 0.6 } as const;

/** Dónde quedan los ojos del ratón: en la chapa, del lado de la cara del gato. */
export const RATON: Punto = [370, 282];

/** Cómo está armado, en las coordenadas del gato. La pata 1 es la de atrás, apoyada; la 2 la de la matraca. */
export const MATON_ARMADO = {
  /** El medio del lomo: de acá se agazapa y se estira el cuerpo. */
  lomo: [-14, -44] as Punto,
  cadera: [-58, -34] as Punto,
  /** De dónde sale la cola. */
  cola: [-84, -42] as Punto,
  hombros: [[26, -46], [40, -52]] as readonly [Punto, Punto],
  /** Las manos: la 1 apoyada en la chapa, la 2 levantada con la matraca. */
  manos: [[44, -2], [76, -34]] as readonly [Punto, Punto],
  /** El cuello: de acá gira la cabeza. */
  cuello: [50, -66] as Punto,
  cara: [80, -82] as Punto,
  ojos: [[70, -90], [94, -88]] as readonly [Punto, Punto],
  boca: [88, -66] as Punto,
  /** La sirena nueva, arriba de la gorra. */
  sirena: [74, -132] as Punto,
  /** El eje de la matraca, en la mano 2: de acá gira la paleta. */
  matraca: [80, -50] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Cuánto se agazapa (0 parado, 1 pegado a la chapa) y cuánto se estira en el salto (0 a 1). */
  agazapa: number;
  estira: number;
  /** El meneo del culo antes de saltar (grados de la cadera). */
  menea: number;
  /** El salto: cuánto se corre y cuánto sube (en unidades del gato), y cuánto gira el cuerpo. */
  salto: readonly [number, number];
  vuelo: number;
  /** Cuánto gira la cabeza en el cuello, y la cola en su base (grados). */
  cabeza: number;
  cola: number;
  /** Cuánto gira cada pata en su hombro (grados). */
  patas: readonly [number, number];
  /** Los párpados: 0 abiertos, 1 cerrados. La boca: 0 cerrada, 1 abierta con los colmillos. */
  parpado: number;
  boca: number;
  /** La matraca: cuánto giró la paleta (grados) y el ra-ta-tá de alrededor (0 a 1). */
  matraca: number;
  ratata: number;
  /** La sirena: lo prendida que está (0 a 1), y para dónde barre la luz (grados). */
  sirena: number;
  barre: number;
  /** La lengua afuera, lamiéndose la mano (0 a 1). */
  lengua: number;
}

/** La pose quieta, la del HTML: agazapado, mirando para abajo, con la sirena apagada. */
export const QUIETO: Momento = {
  agazapa: 0.3,
  estira: 0,
  menea: 0,
  salto: [0, 0],
  vuelo: 0,
  cabeza: 8,
  cola: 0,
  patas: [0, 0],
  parpado: 0,
  boca: 0,
  matraca: 0,
  ratata: 0,
  sirena: 0,
  barre: 0,
  lengua: 0,
};

/**
 * *"Ha cambiado la sirena, y compró matraca nueva, de ocasión"*: la sirena prendida barriendo, la matraca
 * a toda máquina y la boca abierta. Es el toque quieto y el retrato.
 */
export const OPERATIVO: Momento = {
  ...QUIETO,
  agazapa: 0.6,
  cabeza: -4,
  cola: 18,
  patas: [0, -28],
  boca: 1,
  matraca: 40,
  ratata: 1,
  sirena: 1,
  barre: 30,
};

/** Hasta dónde llega el salto, en unidades del gato: no alcanza al Atila, y cae donde estaba el ratón. */
export const SALTO = { largo: 214, alto: 92 } as const;

/** Lo que gira la pata de la matraca para llevársela a la boca y lamerse. */
export const LAME = -58;

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [MATON.x + x * MATON.escala, MATON.piso + y * MATON.escala];

/** La mano 2 con la pata girada (sin contar la cabeza): para ver que la lengua llega a la mano. */
export const manoQueLame = (pata: number): Punto => rot(MATON_ARMADO.manos[1], MATON_ARMADO.hombros[1], pata);

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = MATON_ARMADO;
  const [lx, ly] = A.lomo;
  const [kx, ky] = A.cadera;
  const [cx, cy] = A.cola;
  const [nx, ny] = A.cuello;
  const [sx, sy] = A.sirena;
  const [mx, my] = A.matraca;
  // Agazapado se achata y se alarga; en el salto se estira para adelante.
  const alto = 1 - 0.16 * m.agazapa + 0.08 * m.estira;
  const largo = 1 + 0.06 * m.agazapa + 0.18 * m.estira;
  const transform: Record<string, string> = {
    entero: `translate(${MATON.x} ${MATON.piso}) scale(${MATON.escala})`,
    salto: `translate(${n2(m.salto[0])} ${n2(-m.salto[1])}) rotate(${n2(m.vuelo)} ${lx} ${ly})`,
    cuerpo: `rotate(${n2(m.menea)} ${kx} ${ky}) translate(${lx} 0) scale(${n2(largo)} ${n2(alto)}) translate(${-lx} 0)`,
    cola: `rotate(${n2(m.cola + m.menea * 2)} ${cx} ${cy})`,
    // La cabeza baja con el lomo cuando se agazapa.
    cabeza: `translate(0 ${n2((1 - alto) * -ly * 0.9)}) rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    haz: `rotate(${n2(m.barre)} ${sx} ${sy})`,
    paleta: `rotate(${n2(m.matraca)} ${mx} ${my})`,
  };
  for (const n of [0, 1] as const) {
    const [hx, hy] = A.hombros[n];
    transform[`pata-${n + 1}`] = `translate(0 ${n2((1 - alto) * -hy * 0.8)}) rotate(${n2(m.patas[n])} ${hx} ${hy})`;
  }
  const opacity: Record<string, string> = {
    parpado: n2(m.parpado),
    boca: n2(m.boca),
    ratata: n2(m.ratata),
    luz: n2(0.25 + 0.75 * m.sirena),
    haz: n2(m.sirena * 0.85),
    lengua: n2(m.lengua),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la sirena, en el recinto. */
export const VERSO: Punto = alRecinto([60, -170]);
