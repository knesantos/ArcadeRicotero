/**
 * Los números del diablo más veloz (`D-73`, vigésima vuelta): dónde arrastra los pies en el salón del
 * infierno, cómo está armado y cómo se pone. Los lee el dibujo (`arte-veloz.ts`), para la pose quieta
 * del HTML y para el retrato, y la conducta (`scripts/bestiario/veloz.ts`), que se lleva esto y nada que
 * dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del diablo**: el (0, 0) es el piso entre las dos pezuñas; arriba es negativo, y mira a la
 *   izquierda. Está dibujado a dos veces y la escena lo achica con `VELOZ.escala`.
 * - **El del recinto** (900 × 640): está en el damero, a la derecha de la piedra de Luzbelito y más
 *   adelante que el diablo que mea. La Caja de los Truenos espera más a la derecha, en el piso.
 */

import { rot, type P } from './trazos.ts';

export type Punto = P;

/** Dónde está quieto, lo que mide, hasta dónde arrastra los pies para cada lado, y la Caja de los Truenos. */
export const VELOZ = { x: 712, piso: 486, escala: 0.68, rango: 52, caja: { x: 846, piso: 492 } } as const;

/** Cómo está armado, en las coordenadas del diablo. */
export const VELOZ_ARMADO = {
  /** Las caderas: de acá cuelga cada pata de chivo. La 1 es la de adelante (la de la izquierda). */
  caderas: [[-8, -124], [10, -126]] as readonly [Punto, Punto],
  /** Los hombros: de acá gira cada brazo entero, de la manga a la mano. */
  hombros: [[-22, -196], [24, -198]] as readonly [Punto, Punto],
  /** Las manos con el brazo quieto: la manzana en la 1, la cadena del reloj en la 2. */
  manos: [[-34, -120], [30, -122]] as readonly [Punto, Punto],
  /** El cuello: de acá gira la cabeza, con los cuernos y la barba. */
  cuello: [-2, -212] as Punto,
  /** La quijada: gira desde acá para morder. */
  quijada: [-24, -232] as Punto,
  /** La boca: de acá sale la lengua de oro. */
  boca: [-34, -228] as Punto,
  /** El bolsillo de adentro del saco, donde esconde el fuego robado: el cuerpo del delito. */
  bolsillo: [6, -176] as Punto,
  /** La cola: sale de abajo del saco, atrás. */
  cola: [24, -128] as Punto,
  /** El reloj sin agujas, colgando de la cadena: el que no tiene tiempo. */
  largoCadena: 24,
} as const;

/** La caja, en las suyas propias: el (0, 0) es el piso en el medio, y la bisagra de la tapa atrás arriba. */
export const CAJA = { ancho: 64, alto: 46, bisagra: [30, -46] as Punto } as const;

/* ------------------------------------------------------------------
   El momento: lo que la conducta decide en cada cuadro
   ------------------------------------------------------------------ */

export interface Momento {
  /** Lo que se corre de su lugar, en el recinto (para la caja, positivo), y cuánto se hamaca el cuerpo (grados). */
  dx: number;
  hamaca: number;
  /** Cuánto gira cada pata en la cadera, y cuánto se levanta (el pie que arrastra no se levanta casi). */
  patas: readonly [number, number];
  /** Cuánto gira cada brazo en el hombro (grados; negativo lo levanta por delante). */
  brazos: readonly [number, number];
  /** Cuánto gira la cabeza, cuánto abre la quijada (grados), y cuánto saca la lengua de oro (0 a 1). */
  cabeza: number;
  quijada: number;
  lengua: number;
  /** El reloj: cuánto se hamaca en la cadena (grados) y si lo tiene en alto mirándolo (0 a 1). */
  reloj: number;
  /** La manzana: 0 entera con su sello, 1 mordida; y lo que se aparta de la mano cuando la tira (en las del diablo). */
  mordida: number;
  fruta: { x: number; y: number; giro: number };
  /** El fuego robado en el bolsillo, de 0 a 1 (más es que se le escapa). */
  fuego: number;
  /** La cola (grados). */
  cola: number;
  /** El borrón de lo veloz detrás de él, de 0 a 1, y las chispas que sacan las pezuñas al arrastrarse. */
  estela: number;
  chispas: number;
  /** La Caja de los Truenos: cuánto se abre la tapa (grados), cuánto salta (en el recinto) y los rayos (0 a 1). */
  tapa: number;
  salto: number;
  rayos: number;
}

/** La pose quieta, la del HTML: parado, encorvado, con la manzana entera y el reloj colgando. */
export const QUIETO: Momento = {
  dx: 0,
  hamaca: 0,
  patas: [0, 0],
  brazos: [0, 0],
  cabeza: 0,
  quijada: 0,
  lengua: 0,
  reloj: 0,
  mordida: 0,
  fruta: { x: 0, y: 0, giro: 0 },
  fuego: 1,
  cola: 0,
  estela: 0,
  chispas: 0,
  tapa: 0,
  salto: 0,
  rayos: 0,
};

/** Cuánto se corre para llegar a la caja: queda pegado, con la pata de adelante en la tapa. */
export const HASTA_LA_CAJA = VELOZ.caja.x - VELOZ.x - 62;

/**
 * *"Llegó y pateó la Caja de los Truenos y sonrió"*: al lado de la caja, la pata de atrás arriba de la
 * patada, la tapa volando, los rayos afuera y la lengua de oro. Es el toque quieto y el retrato.
 */
export const PATADA: Momento = {
  ...QUIETO,
  dx: HASTA_LA_CAJA,
  hamaca: -6,
  patas: [4, -58],
  brazos: [-40, 30],
  cabeza: 8,
  quijada: 10,
  lengua: 1,
  reloj: 30,
  mordida: 1,
  fuego: 1.4,
  cola: 30,
  tapa: -118,
  salto: 10,
  rayos: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto, dx = 0): Punto => [VELOZ.x + dx + x * VELOZ.escala, VELOZ.piso + y * VELOZ.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = VELOZ_ARMADO;
  const [nx, ny] = A.cuello;
  const [qx, qy] = A.quijada;
  const [cx, cy] = A.cola;
  const [hx, hy] = A.manos[1];
  const [bx, by] = A.bolsillo;
  const [tx, ty] = CAJA.bisagra;
  const transform: Record<string, string> = {
    entero: `translate(${VELOZ.x} ${VELOZ.piso}) scale(${VELOZ.escala})`,
    anda: `translate(${n2(m.dx / VELOZ.escala)} 0)`,
    // Se hamaca desde las caderas: el torso, la cabeza y los brazos.
    torso: `rotate(${n2(m.hamaca)} 0 -124)`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    quijada: `rotate(${n2(m.quijada)} ${qx} ${qy})`,
    lengua: `translate(${A.boca[0]} ${A.boca[1]}) scale(${n2(Math.max(0.01, m.lengua))} 1) translate(${-A.boca[0]} ${-A.boca[1]})`,
    cola: `rotate(${n2(m.cola)} ${cx} ${cy})`,
    reloj: `rotate(${n2(m.reloj)} ${hx} ${hy})`,
    fuego: `translate(${bx} ${by}) scale(${n2(0.7 + 0.3 * m.fuego)} ${n2(Math.max(0.01, m.fuego))}) translate(${-bx} ${-by})`,
    caja: `translate(${VELOZ.caja.x} ${n2(VELOZ.caja.piso - m.salto)}) scale(${VELOZ.escala})`,
    tapa: `rotate(${n2(m.tapa)} ${tx} ${ty})`,
  };
  // La manzana va suelta: sigue a la mano 1 con el brazo como esté, más lo que vuele cuando la tira.
  const [mx, my] = A.manos[0];
  const [fx, fy] = rot(A.manos[0], A.hombros[0], m.brazos[0]);
  transform.fruta = `translate(${n2(fx - mx + m.fruta.x)} ${n2(fy - my + m.fruta.y)}) rotate(${n2(m.fruta.giro)} ${mx - 6} ${my + 2})`;
  for (const n of [0, 1] as const) {
    const [px, py] = A.caderas[n];
    transform[`pata-${n + 1}`] = `rotate(${n2(m.patas[n])} ${px} ${py})`;
    const [sx, sy] = A.hombros[n];
    transform[`brazo-${n + 1}`] = `rotate(${n2(m.brazos[n])} ${sx} ${sy})`;
  }
  const opacity: Record<string, string> = {
    lengua: m.lengua > 0.02 ? '1' : '0',
    entera: n2(1 - m.mordida),
    mordida: n2(m.mordida),
    estela: n2(m.estela),
    chispas: n2(m.chispas),
    rayos: n2(m.rayos),
  };
  return { transform, opacity };
}

/** Dónde queda la mano 1 (la de la manzana) con el brazo girado, y la boca con la cabeza girada, en las del diablo. */
export const manoDeLaFruta = (brazo: number): Punto => rot(VELOZ_ARMADO.manos[0], VELOZ_ARMADO.hombros[0], brazo);
export const bocaCon = (cabeza: number): Punto => rot(VELOZ_ARMADO.boca, VELOZ_ARMADO.cuello, cabeza);

/** Dónde dice su verso: arriba de los cuernos, en el recinto, desde donde esté. */
export const versoDesde = (dx: number): Punto => alRecinto([-6, -330], dx);
export const VERSO: Punto = versoDesde(HASTA_LA_CAJA);
