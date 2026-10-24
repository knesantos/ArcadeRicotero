/**
 * Los números del santo fumador (`D-73`, vigésima vuelta): dónde duerme en el templo de Momo, cómo está
 * armado con su anda y cómo se pone. Los lee el dibujo (`arte-fumador.ts`), para la pose quieta del HTML
 * y para el retrato, y la conducta (`scripts/bestiario/fumador.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del santo**: el (0, 0) es el piso en el medio del anda; arriba es negativo. Está de frente,
 *   dibujado a dos veces, y la escena lo achica con `FUMADOR.escala`.
 * - **El del recinto**: el templo agrandado (`MARCO_DEL_RECINTO`, desde x −300). Duerme en el ala de la
 *   izquierda, entre las dos primeras columnas, lejos de Momo y del Dr. Saturno.
 */

import { rot, type P } from './trazos.ts';

export type Punto = P;

/** Dónde duerme, lo que mide, y hasta dónde sube el humo antes de deshacerse. */
export const FUMADOR = { x: -104, piso: 588, escala: 0.56, techoDelHumo: 250 } as const;

/** Cómo está armado, en las coordenadas del santo. El brazo 1 es el de la flor (a la izquierda), el 2 el del pucho. */
export const FUMADOR_ARMADO = {
  /** La tapa del anda, donde se para el pedestal, y las varas que la cargan. */
  anda: { y: -44, ancho: 136, varas: 104 },
  /** El pedestal sobre el anda. */
  pedestal: { y: -70, ancho: 60 },
  /** De acá se cabecea el santo entero cuando se duerme, y de acá gira la cabeza. */
  pies: [0, -70] as Punto,
  cuello: [0, -206] as Punto,
  /** El medio de la cara, y la boca. */
  cara: [0, -230] as Punto,
  boca: [0, -216] as Punto,
  /** Los ojos, con sus párpados de yeso. */
  ojos: [[-8, -232], [8, -232]] as readonly [Punto, Punto],
  /** La aureola: el tubo de luz detrás de la cabeza. */
  aureola: { centro: [0, -246] as Punto, rx: 34, ry: 31 },
  /** Los hombros, de donde gira cada brazo. */
  hombros: [[-26, -196], [26, -196]] as readonly [Punto, Punto],
  /** La mano de la flor, a la altura de la cintura, y la de la bendición, al lado de la cara, con el pucho. */
  manos: [[-30, -138], [36, -232]] as readonly [Punto, Punto],
  /** La brasa del pucho, en la mano de la bendición: de acá sale el hilo de humo. */
  brasa: [54, -240] as Punto,
  /** La boquilla del pucho, la punta que va a la boca cuando pita. */
  boquilla: [28, -236] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

/** Un anillo de humo, en el recinto: dónde, tamaño y cuánto se ve. */
export interface Anillo {
  x: number;
  y: number;
  s: number;
  o: number;
}

export interface Momento {
  /** Lo que sube el anda (la cargan) y lo que se corre de costado, en el recinto, y su meneo (grados). */
  alza: number;
  dx: number;
  meneo: number;
  /** Lo que cabecea el santo entero desde los pies, y la cabeza en el cuello (grados). */
  dormita: number;
  cabeza: number;
  /** Los párpados: 1 cerrados (el letargo), 0 abiertos. */
  parpados: number;
  /** Cuánto gira cada brazo en el hombro (grados). */
  brazos: readonly [number, number];
  /** La brasa del pucho (0, apagada; 1, la de siempre; más, cuando pita) y el hilo de humo. */
  brasa: number;
  hilo: number;
  /** La ceniza: lo larga que está (0 a 1), y la que se le cayó (en las del santo: dónde y cuánto se ve). */
  ceniza: number;
  cae: { x: number; y: number; o: number };
  /** La aureola: cuánto se prende el tubo (0 apagado; 1 prendido; más, encandila). */
  aureola: number;
  anillos: readonly Anillo[];
}

/** Cuántos anillos de humo tiene armados. */
export const ANILLOS = 4;

const guardado: Anillo = { x: FUMADOR.x, y: FUMADOR.piso, s: 1, o: 0 };

/** La pose quieta, la del HTML: dormido en el pedestal, con el pucho en la mano de la bendición. */
export const QUIETO: Momento = {
  alza: 0,
  dx: 0,
  meneo: 0,
  dormita: 0,
  cabeza: 10,
  parpados: 1,
  brazos: [0, 0],
  brasa: 1,
  hilo: 1,
  ceniza: 0.4,
  cae: { x: 0, y: 0, o: 0 },
  aureola: 1,
  anillos: Array.from({ length: ANILLOS }, () => guardado),
};

/**
 * *"Salí del letargo, vení a desfilar"*: despierto, con el anda en alto, meneándose como en la
 * procesión, la flor en alto y la aureola que encandila. Es el toque quieto y el retrato.
 */
export const DESFILE: Momento = {
  ...QUIETO,
  alza: 26,
  meneo: -5,
  cabeza: -4,
  parpados: 0,
  brazos: [104, -10],
  brasa: 1.4,
  aureola: 1.5,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto, m: Pick<Momento, 'alza' | 'dx'> = QUIETO): Punto => [FUMADOR.x + m.dx + x * FUMADOR.escala, FUMADOR.piso - m.alza + y * FUMADOR.escala];

/** La brasa con el brazo 2 girado, en las del santo (sin el cabeceo ni el meneo). */
export const brasaCon = (brazo: number): Punto => rot(FUMADOR_ARMADO.brasa, FUMADOR_ARMADO.hombros[1], brazo);

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = FUMADOR_ARMADO;
  const [px, py] = A.pies;
  const [cx, cy] = A.cuello;
  const [bx, by] = A.brasa;
  const transform: Record<string, string> = {
    entero: `translate(${FUMADOR.x} ${FUMADOR.piso}) scale(${FUMADOR.escala})`,
    // El anda sube y se menea desde el medio de la tapa, como cuando la cargan entre varios.
    anda: `translate(${n2(m.dx / FUMADOR.escala)} ${n2(-m.alza / FUMADOR.escala)}) rotate(${n2(m.meneo)} 0 ${A.anda.y})`,
    santo: `rotate(${n2(m.dormita)} ${px} ${py})`,
    cabeza: `rotate(${n2(m.cabeza)} ${cx} ${cy})`,
    // La brasa crece desde su punta, y la ceniza se alarga desde la brasa para afuera.
    brasa: `translate(${bx} ${by}) scale(${n2(Math.max(0.01, 0.6 + 0.4 * m.brasa))}) translate(${-bx} ${-by})`,
    ceniza: `translate(${bx} ${by}) scale(${n2(Math.max(0.01, m.ceniza))} 1) translate(${-bx} ${-by})`,
    cae: `translate(${n2(m.cae.x)} ${n2(m.cae.y)})`,
    // El hilo de humo sale de la brasa, donde esté la mano, pero sube derecho: no gira con el brazo.
    hilo: (() => {
      const [hx, hy] = brasaCon(m.brazos[1]);
      return `translate(${n2(hx - bx)} ${n2(hy - by)})`;
    })(),
    // La sombra en el piso se achica cuando el anda sube.
    sombra: `scale(${n2(1 - m.alza / 140)} 1)`,
  };
  for (const n of [0, 1] as const) {
    const [sx, sy] = A.hombros[n];
    transform[`brazo-${n + 1}`] = `rotate(${n2(m.brazos[n])} ${sx} ${sy})`;
    const [ox, oy] = A.ojos[n];
    transform[`parpado-${n + 1}`] = `translate(${ox} ${oy - 4}) scale(1 ${n2(Math.max(0.01, m.parpados))}) translate(${-ox} ${-(oy - 4)})`;
  }
  const opacity: Record<string, string> = {
    // El tubo nunca se apaga del todo: queda el filamento.
    aureola: n2(Math.min(1, 0.12 + 0.88 * m.aureola)),
    encandila: n2(Math.max(0, Math.min(1, m.aureola - 1) * 2)),
    hilo: n2(m.hilo),
    cae: n2(m.cae.o),
    ojos: m.parpados < 0.98 ? '1' : '0',
  };
  m.anillos.forEach((a, i) => {
    transform[`anillo-${i + 1}`] = `translate(${n2(a.x)} ${n2(a.y)}) scale(${n2(a.s)})`;
    opacity[`anillo-${i + 1}`] = n2(a.o);
  });
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la aureola, en el recinto. */
export const VERSO: Punto = alRecinto([0, -300], DESFILE);
