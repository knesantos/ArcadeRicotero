/**
 * Los números del polizón del remolque (`D-73`, vigesimoséptima vuelta): dónde flota su bote dado vuelta en el bajo,
 * cómo está armado y cómo se pone. Los lee el dibujo (`arte-polizon.ts`), para la pose quieta del HTML y para el
 * retrato, y la conducta (`scripts/bestiario/polizon.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del bote**: el (0, 0) es el agua debajo del medio del bote, que está **dado vuelta**, con la quilla para
 *   arriba, la popa a la izquierda y la proa a la derecha. Arriba es negativo. Está dibujado más grande, y la
 *   escena lo achica con `POLIZON.escala`.
 * - **El del recinto** (el del bajo, que arranca antes del cero: `MARCO_DEL_RECINTO`): adelante y a la izquierda,
 *   donde estaba pintado el bote, que ahora es suyo. El bajo va entero al camino, así que ahí queda igual.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde flota, y lo que mide. */
export const POLIZON = { x: 130, piso: 606, escala: 0.6 } as const;

/** Cómo está armado, en sus coordenadas. */
export const POLIZON_ARMADO = {
  /** La popa, en el agua: la bisagra. El bote se levanta de la proa girando acá. */
  popa: [-172, 0] as Punto,
  /** La proa, en el agua, con el bote apoyado. */
  proa: [176, 0] as Punto,
  /** El lomo del bote, donde tiene la quilla. */
  quilla: [0, -62] as Punto,
  /** La cara del polizón, con el bote levantado del todo, y lo que se agacha cuando el bote baja. */
  cara: [78, -54] as Punto,
  agachado: 57,
  /** Los ojos (el 1 es el de lejos) y lo que miden. */
  ojos: [[70, -58], [89, -57]] as readonly [Punto, Punto],
  radio: [5.6, 4.6] as Punto,
  /** El hombro del brazo que hace callar. */
  hombro: [102, -22] as Punto,
  /** Donde se apoya la corona en el lomo del bote: de acá se le cae de costado. */
  corona: [-64, -58] as Punto,
  /** Por dónde saca el pocillo de café: de atrás de la proa, para afuera. */
  cafe: { adentro: [150, -4] as Punto, afuera: 62 },
  /** Por dónde saca el salero: de atrás de la popa, para afuera. */
  salero: { adentro: [-120, -6] as Punto, afuera: -78 },
  /** Donde prende el fósforo, adentro. */
  fosforo: [112, -10] as Punto,
} as const;

/** Cuánto se levanta el bote a pleno, en grados, y lo que se abre la rendija para espiar. */
export const ABRE = 26;
export const RENDIJA = 0.2;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Cuánto se levantó el bote de la proa (0 apoyado, 1 abierto del todo). */
  abre: number;
  /** Lo que se mece en el agua: lo que sube (unidades) y lo que se ladea (grados). Y el temblor (unidades). */
  mece: readonly [number, number];
  tiembla: number;
  /** La corona: lo que se cayó de costado (grados). Llega después que el bote. */
  corona: number;
  /** Los párpados (0 abiertos, 1 cerrados) y las pupilas (corrimiento). */
  parpado: number;
  pupila: readonly [number, number];
  /**
   * Cuánta luz le llega (0 a oscuras, 1 destapado). A oscuras es una sombra con dos ojos: si no, por la rendija se le
   * ve la cara entera pegada al agua, como una cabeza cortada.
   */
  luz: number;
  /** El resplandor (0 a 1) y la luz del fósforo (0 a 1). */
  resplandor: number;
  fosforo: number;
  /** El brazo que hace callar (0 guardado, 1 con el dedo en la boca). */
  chist: number;
  /** El pocillo de café y el salero: cuánto los sacó (0 a 1), y cómo sacude el salero (grados). */
  cafe: number;
  salero: number;
  sacude: number;
  /** Las ondas del agua cuando el bote cae: la fase (0 a 1). En las puntas no se ven. */
  ondas: number;
}

/** La pose quieta, la del HTML: el bote dado vuelta, cerrado, con la corona encima. A oscuras. */
export const QUIETO: Momento = {
  abre: 0,
  mece: [0, 0],
  tiembla: 0,
  corona: 0,
  parpado: 0,
  pupila: [0, 0],
  luz: 0,
  resplandor: 0,
  fosforo: 0,
  chist: 0,
  cafe: 0,
  salero: 0,
  sacude: 0,
  ondas: 0,
};

/**
 * *"Todos te daban por muerto, y vos allí"*: el bote levantado de la proa, y él abajo, maquillado, resplandeciendo,
 * con el dedo en la boca: que no se sepa. La corona, torcida. Es el toque quieto y el retrato.
 */
export const ASOMA: Momento = {
  ...QUIETO,
  abre: 1,
  corona: 16,
  pupila: [1.4, 0.8],
  luz: 1,
  resplandor: 1,
  chist: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [POLIZON.x + x * POLIZON.escala, POLIZON.piso + y * POLIZON.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = POLIZON_ARMADO;
  const [px, py] = A.popa;
  const [kx, ky] = A.corona;
  const [hx, hy] = A.hombro;
  const a = Math.min(1, Math.max(0, m.abre));
  const fase = Math.min(1, Math.max(0, m.ondas));
  const transform: Record<string, string> = {
    entero: `translate(${POLIZON.x} ${POLIZON.piso}) scale(${POLIZON.escala})`,
    // El bote: se mece, y se levanta de la proa girando en la popa.
    bote: `translate(${n2(m.tiembla)} ${n2(-m.mece[0])}) rotate(${n2(-ABRE * a)} ${px} ${py}) rotate(${n2(m.mece[1])} 0 0)`,
    // Lo oscuro de abajo: una cuña con la punta en la popa, que se abre con el bote.
    adentro: `translate(${n2(m.tiembla)} 0) scale(1 ${n2(Math.max(0.001, a))})`,
    // Él: agachado mientras el bote está bajo, se endereza cuando se abre.
    polizon: `translate(0 ${n2(A.agachado * (1 - a))})`,
    corona: `rotate(${n2(m.corona)} ${kx} ${ky})`,
    // El brazo está dibujado con el dedo en la boca: guardado, cuelga para abajo.
    brazo: `rotate(${n2(96 * (1 - m.chist))} ${hx} ${hy})`,
    cafe: `translate(${n2(A.cafe.afuera * m.cafe)} 0)`,
    salero: `translate(${n2(A.salero.afuera * m.salero)} 0) rotate(${n2(m.sacude)} ${A.salero.adentro[0] - 20} ${A.salero.adentro[1]})`,
    ondas: `scale(${n2(0.7 + 0.5 * fase)} 1)`,
  };
  for (const n of [0, 1] as const) {
    const [ox, oy] = A.ojos[n];
    const top = oy - A.radio[1] - 0.6;
    transform[`parpado-${n + 1}`] = `translate(${ox} ${top}) scale(1 ${n2(Math.max(0.02, m.parpado))}) translate(${-ox} ${-top})`;
    transform[`pupila-${n + 1}`] = `translate(${n2(m.pupila[0])} ${n2(m.pupila[1])})`;
  }
  const opacity: Record<string, string> = {
    // Sin rendija no se ve nada de él: ni los ojos.
    polizon: a > 0.02 ? '1' : '0',
    sombra: n2(1 - Math.min(1, Math.max(0, m.luz))),
    resplandor: n2(m.resplandor),
    fosforo: n2(m.fosforo),
    brazo: m.chist > 0.02 ? '1' : '0',
    cafe: m.cafe > 0.02 ? '1' : '0',
    salero: m.salero > 0.02 ? '1' : '0',
    ondas: n2(fase <= 0 || fase >= 1 ? 0 : Math.sin(fase * Math.PI) * 0.8),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la quilla, en el recinto. */
export const VERSO: Punto = alRecinto([20, -130]);
