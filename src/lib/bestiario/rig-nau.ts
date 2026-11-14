/**
 * Los números de los náufragos (`D-73`, vigesimoctava vuelta): dónde asoman del agua en el bajo, cómo están armados y
 * cómo se ponen. Los lee el dibujo (`arte-nau.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/nau.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de los náufragos**: el (0, 0) es la línea del agua entre los dos; arriba es negativo. El de la izquierda
 *   es el A y el de la derecha el B. Está dibujado al tamaño de la tapa y la escena lo achica con `NAUF.escala`.
 * - **El del recinto** (el del bajo, que arranca antes del cero: `MARCO_DEL_RECINTO`): adelante, en el agua, entre el
 *   ahogado y el bote del polizón, donde estaban sus ojos. El bajo va entero al camino, así que ahí queda igual.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde asoman, y lo que miden. El piso es la línea del agua. */
export const NAUF = { x: -58, piso: 608, escala: 0.75 } as const;

/** Cómo están armados, en sus coordenadas. */
export const NAUF_ARMADO = {
  /** El cogote de cada uno: de acá gira la cabeza. El 0 es el A, el 1 el B. */
  cuello: [[-46, -52], [46, -52]] as readonly [Punto, Punto],
  /** Las bocas, y lo que mide la cabeza. */
  bocas: [[-46, -66], [46, -66]] as readonly [Punto, Punto],
  /** Los hombros de los brazos que se dan la mano, adentro, arriba del agua. */
  hombros: [[-24, -42], [24, -42]] as readonly [Punto, Punto],
  /** Donde se juntan las manos, levantadas, entre los dos. */
  manos: [0, -118] as Punto,
  /** El hombro del brazo libre del A, que se tapa los ojos para mirar lejos; y el del B, con el tubo. */
  libreA: [-62, -42] as Punto,
  tuboB: [62, -42] as Punto,
  /** La bomba que flota a la izquierda: el centro, el radio, y la punta de la mecha. */
  bomba: { centro: [-100, -6] as Punto, radio: 17, mecha: [-96, -34] as Punto },
  /** Donde cae el rayo, arriba, y las cabezas de atrás (para los tests). */
  rayo: [-14, -150] as Punto,
  /** El agua: hasta donde se ven los cuerpos (todo lo que pase de acá para abajo se esconde). */
  agua: 2,
} as const;

/** Cuánto se abre la boca de un grito, y cuánto sube la multitud de atrás cuando el rayo los alumbra. */
export const GRITA = 1;
export const MULTITUD_SUBE = 12;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Lo que cabecea cada uno en el agua (unidades, para arriba) y cuánto se hunde (unidades, para abajo). */
  mece: readonly [number, number];
  hundido: readonly [number, number];
  /** Cuánto se ladea el cuerpo de cada uno (grados) y para dónde gira la cabeza (grados). */
  incl: readonly [number, number];
  cabeza: readonly [number, number];
  /** La boca de cada uno (0 cerrada, 1 abierta de un grito). */
  boca: readonly [number, number];
  /** Los brazos que se dan la mano: cuánto se bajó cada uno del centro (grados, 0 es la mano juntada) y cuánto se sacuden juntos (grados). */
  brazoA: number;
  brazoB: number;
  sacude: number;
  /** El brazo libre del A (grados: 70 colgando, 0 con la mano en la frente, −30 levantado) y el del tubo del B (grados). */
  libreA: number;
  tuboB: number;
  /** La bomba: cuánto está inflada (1 llena, 0 desinflada), cuánto le queda de mecha (1 entera), si hay chispa, el humo del pedo (0 a 1) y lo que cabecea. */
  bomba: number;
  mecha: number;
  chispa: number;
  humo: number;
  mecePompa: number;
  /** La multitud de atrás: cuánto se ve (0 a 1), cuánto sube (0 a 1) y las manos que levanta. */
  multitud: number;
  sube: number;
  manosMultitud: number;
  /** El rayo (0 a 1), y para qué lado sale. */
  rayo: number;
  rayoLado: 1 | -1;
  /** El chorro de agua del estornudo (0 a 1: lo que avanzó) y el de las burbujas del que se hunde. */
  gotas: number;
  burbuja: number;
  /** Las ondas del agua alrededor (la fase de 0 a 1). */
  ondas: number;
}

/** La pose quieta, la del HTML: asoman, agarrados de la mano, la multitud apenas se adivina atrás. */
export const QUIETO: Momento = {
  mece: [0, 0],
  hundido: [0, 0],
  incl: [0, 0],
  cabeza: [4, -4],
  boca: [0.12, 0.08],
  brazoA: 0,
  brazoB: 0,
  sacude: 0,
  libreA: 72,
  tuboB: 0,
  bomba: 1,
  mecha: 1,
  chispa: 1,
  humo: 0,
  mecePompa: 0,
  multitud: 0.38,
  sube: 0,
  manosMultitud: 0,
  rayo: 0,
  rayoLado: 1,
  gotas: 0,
  burbuja: 0,
  ondas: 0.3,
};

/**
 * *"Ya no estás solo, estamos todos en naufragar"*: el rayo los alumbra y se ve que atrás hay una multitud de cabezas,
 * con los brazos levantados; ellos gritan agarrados de la mano, y el rayo cruza. Es el toque quieto y el retrato.
 */
export const TODOS: Momento = {
  ...QUIETO,
  mece: [3, 2],
  cabeza: [-10, 10],
  boca: [1, 1],
  brazoA: -4,
  brazoB: -4,
  sacude: 3,
  libreA: -16,
  tuboB: -18,
  multitud: 1,
  sube: 1,
  manosMultitud: 1,
  rayo: 1,
  rayoLado: 1,
  ondas: 0.7,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [NAUF.x + x * NAUF.escala, NAUF.piso + y * NAUF.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = NAUF_ARMADO;
  const f = (v: number): string => n2(Math.min(1, Math.max(0, v)));
  const transform: Record<string, string> = {
    entero: `translate(${NAUF.x} ${NAUF.piso}) scale(${NAUF.escala})`,
    multitud: `translate(0 ${n2(-MULTITUD_SUBE * m.sube)})`,
    'multitud-brazos': `translate(0 ${n2(-MULTITUD_SUBE * m.sube)}) scale(1 ${n2(Math.max(0.02, m.manosMultitud))})`,
    ondas: `scale(${n2(0.85 + 0.3 * m.ondas)} 1)`,
    // La bomba flota: cabecea, y desinflada se achata contra el agua. Gira de la línea del agua.
    bomba: `translate(${A.bomba.centro[0]} ${n2(A.agua + m.mecePompa)}) scale(${n2(0.4 + 0.6 * m.bomba)} ${n2(0.28 + 0.72 * m.bomba)}) translate(${-A.bomba.centro[0]} ${-A.agua})`,
    mecha: `translate(${A.bomba.mecha[0]} ${A.bomba.mecha[1]}) scale(1 ${n2(Math.max(0.02, m.mecha))}) translate(${-A.bomba.mecha[0]} ${-A.bomba.mecha[1]})`,
    // La chispa va bajando por la mecha: de la punta de arriba hasta la bomba.
    chispa: `translate(0 ${n2((1 - m.mecha) * 26)})`,
    humo: `translate(${A.bomba.mecha[0]} ${n2(A.bomba.mecha[1] - 10 * m.humo)}) scale(${n2(0.6 + 1.4 * m.humo)}) translate(${-A.bomba.mecha[0]} ${-A.bomba.mecha[1]})`,
    rayo: `translate(${n2(A.rayo[0] * m.rayoLado)} 0) scale(${m.rayoLado} 1)`,
    gotas: `translate(${n2(-34 * m.gotas)} ${n2(-14 * Math.sin(Math.min(1, m.gotas) * Math.PI) * 1.4)})`,
    burbuja: `translate(0 ${n2(-26 * m.burbuja)}) scale(${n2(0.8 + 0.5 * m.burbuja)})`,
    'brazo-a': `rotate(${n2(m.brazoA + m.sacude)} ${A.hombros[0][0]} ${A.hombros[0][1]})`,
    'brazo-b': `rotate(${n2(-m.brazoB - m.sacude)} ${A.hombros[1][0]} ${A.hombros[1][1]})`,
    'libre-a': `rotate(${n2(m.libreA)} ${A.libreA[0]} ${A.libreA[1]})`,
    'tubo-b': `rotate(${n2(m.tuboB)} ${A.tuboB[0]} ${A.tuboB[1]})`,
  };
  const nombre = ['a', 'b'] as const;
  for (const i of [0, 1] as const) {
    const [nx, ny] = A.cuello[i];
    transform[nombre[i]] = `translate(0 ${n2(-m.mece[i] + m.hundido[i])}) rotate(${n2(m.incl[i])} ${nx} ${A.agua})`;
    transform[`cabeza-${nombre[i]}`] = `rotate(${n2(m.cabeza[i])} ${nx} ${ny})`;
    const [bx, by] = A.bocas[i];
    transform[`boca-${nombre[i]}`] = `translate(${bx} ${by}) scale(1 ${n2(Math.max(0.12, m.boca[i]))}) translate(${-bx} ${-by})`;
  }
  const opacity: Record<string, string> = {
    multitud: f(m.multitud),
    'multitud-brazos': f(m.manosMultitud > 0.02 ? m.multitud : 0),
    chispa: m.chispa > 0.5 && m.mecha > 0.02 ? '1' : '0',
    humo: f(Math.sin(Math.min(1, m.humo) * Math.PI) * 0.8),
    rayo: f(m.rayo),
    gotas: f(Math.sin(Math.min(1, m.gotas) * Math.PI) * 1.2),
    burbuja: f(Math.sin(Math.min(1, m.burbuja) * Math.PI)),
    ondas: f(0.3 + 0.5 * Math.sin(m.ondas * Math.PI)),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de las manos juntas, en el recinto. */
export const VERSO: Punto = alRecinto([0, -170]);
