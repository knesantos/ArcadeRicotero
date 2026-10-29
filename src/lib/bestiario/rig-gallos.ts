/**
 * Los números de los gallos sofocados (`D-73`, vigesimotercera vuelta): dónde se apoyan uno en el otro en
 * el templo de Momo, cómo está armado cada gallo y cómo se ponen. Los lee el dibujo (`arte-gallos.ts`), para
 * la pose quieta del HTML y para el retrato, y la conducta (`scripts/bestiario/gallos.ts`), que se lleva esto
 * y nada que dibuje.
 *
 * Tres sistemas de coordenadas:
 * - **El de cada gallo**: el (0, 0) es el piso entre sus patas, arriba es negativo y mira a la derecha. Los
 *   dos gallos usan el mismo esqueleto (`GALLO`); el flaco va espejado, para mirar al otro, y un poco más
 *   chico.
 * - **El de la pareja**: el (0, 0) es el piso entre los dos. El del espolón (A) a la izquierda, el flaco (B)
 *   a la derecha. Están dibujados a dos veces y la escena los achica con `GALLOS.escala`.
 * - **El del recinto**: el templo agrandado (`MARCO_DEL_RECINTO`, de −300 a 1200). Llegan por el ala de la
 *   derecha, entre la columna del Dr. Saturno y la última, a la derecha de donde miran Mister Ed y Huesito.
 */

import { rot, type P } from './trazos.ts';

export type Punto = P;

/** Dónde se apoyan uno en el otro: el piso entre los dos, y lo que miden. */
export const GALLOS = { x: 1100, piso: 588, escala: 0.5 } as const;

/** Dónde está cada gallo en la pareja, y cuánto mide el flaco al lado del otro. */
export const PAREJA = { a: -72, b: 72, flaco: 0.92 } as const;

/** El esqueleto de un gallo, mirando a la derecha. La pata 1 es la de atrás, la 2 la de adelante (la del espolón). */
export const GALLO = {
  caderas: [[-12, -62], [4, -60]] as readonly [Punto, Punto],
  pies: [[-16, 0], [8, 0]] as readonly [Punto, Punto],
  /** El espolón, en la pata 2: la punta para atrás. */
  espolon: [-12, -16] as Punto,
  /** De acá se infla el pecho. */
  centro: [-6, -94] as Punto,
  /** De acá sale la cola, y de acá gira el ala. */
  rabadilla: [-42, -112] as Punto,
  hombro: [8, -112] as Punto,
  /** La base del pescuezo: de acá cabecea y pica. */
  cuello: [22, -120] as Punto,
  cabeza: [38, -178] as Punto,
  ojo: [44, -184] as Punto,
  /** La base de la cresta: de acá se le cae sobre el ojo. */
  cresta: [36, -194] as Punto,
  /** La bisagra del pico, y la punta. */
  comisura: [50, -178] as Punto,
  pico: [70, -177] as Punto,
  /** De acá cuelga la barba. */
  barba: [52, -169] as Punto,
  /** La punta del ala del del espolón, con la botella agarrada del culo, y la boca de la botella. */
  punta: [40, -72] as Punto,
  boca: [64, -42] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

/** Un par de números: el del espolón (A) y el flaco (B). */
export type Par = readonly [number, number];

export interface Momento {
  /** El tambaleo de los dos juntos, desde el piso del medio (grados). */
  tambaleo: number;
  /** Cuánto se inclina cada uno hacia el otro desde sus patas (grados), y cuánto se le arrima (unidades). */
  inclina: Par;
  arrima: Par;
  /** Cuánto se levanta del piso (un saltito, un hipo). */
  salto: Par;
  /** Cada pata en su cadera (grados; negativo es para adelante). */
  patas: readonly [Par, Par];
  /** Lo inflado: 0 sofocado, 1 de riña. */
  infla: Par;
  /** La cola en la rabadilla (grados; positivo la levanta), el ala en el hombro y el pescuezo en su base (grados; positivo es para atrás y abajo el ala, para adelante y abajo el pescuezo). */
  cola: Par;
  ala: Par;
  cuello: Par;
  /** Lo que se le cae la cresta sobre el ojo (grados), lo que abre el pico (grados) y lo que se hamaca la barba. */
  cresta: Par;
  pico: Par;
  barba: Par;
  /** Los párpados: 0 abiertos, 1 cerrados. */
  parpado: Par;
  /** El cacareo del del espolón (0 a 1) y el hipo del flaco (0 a 1, lo que subió la burbuja). */
  cacareo: number;
  hipo: number;
  /** Las plumas que vuelan en la riña: cuánto se ven y cuánto subieron. */
  plumas: number;
  vuelo: number;
}

/**
 * La pose quieta, la del HTML: apoyados uno en el otro, el del espolón con la cabeza caída en el pecho del
 * flaco y el flaco con el pico para arriba, las crestas caídas sobre el ojo, los picos abiertos de
 * sofocados, los párpados a media asta y la botella colgando.
 */
export const QUIETO: Momento = {
  tambaleo: 0,
  inclina: [10, 3],
  arrima: [0, 0],
  salto: [0, 0],
  patas: [[6, -4], [4, -3]],
  infla: [0, 0],
  cola: [-10, -14],
  ala: [6, 4],
  cuello: [42, -16],
  cresta: [8, 30],
  pico: [8, 16],
  barba: [0, 0],
  parpado: [0.6, 0.4],
  cacareo: 0,
  hipo: 0,
  plumas: 0,
  vuelo: 0,
};

/**
 * *"No hay quien le quite a ese gallo el espolón"*: la riña de opereta. El del espolón inflado, para atrás,
 * pateando con el espolón y cacareando; el flaco tirándole un picotazo; las plumas en el aire. Es el toque
 * quieto y el retrato.
 */
export const RINA: Momento = {
  ...QUIETO,
  inclina: [-8, 12],
  arrima: [-24, -20],
  salto: [14, 0],
  patas: [[10, -62], [8, -14]],
  infla: [1, 1],
  cola: [18, 16],
  ala: [-64, 24],
  cuello: [-22, 30],
  cresta: [0, 4],
  pico: [26, 18],
  parpado: [0, 0],
  cacareo: 1,
  plumas: 1,
  vuelo: -10,
};

/** El trago, como toman las gallinas: sube el ala con la botella hasta que la boca le llega al pico, mete el pico, y después tira la cabeza para atrás para tragar. */
export const TRAGO = { ala: -101, cuello: -4 } as const;

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Un punto de un gallo (0 el del espolón, 1 el flaco), en las coordenadas de la pareja, quieto y derecho. */
export const enLaPareja = (n: 0 | 1, [u, y]: Punto): Punto => (n === 0 ? [PAREJA.a + u, y] : [PAREJA.b - u * PAREJA.flaco, y * PAREJA.flaco]);

export const alRecinto = ([x, y]: Punto): Punto => [GALLOS.x + x * GALLOS.escala, GALLOS.piso + y * GALLOS.escala];

/** La boca de la botella y la punta del pico, con el ala y el pescuezo girados, en coordenadas del gallo (sin inflar). */
export function bocaYPico(ala: number, cuello: number): { boca: Punto; pico: Punto } {
  return { boca: rot(GALLO.boca, GALLO.hombro, ala), pico: rot(GALLO.pico, GALLO.cuello, cuello) };
}

/** Lo que crece el pecho inflado (ancho y alto). */
const INFLA = [0.2, 0.14] as const;

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const G = GALLO;
  const transform: Record<string, string> = {
    entero: `translate(${GALLOS.x} ${GALLOS.piso}) scale(${GALLOS.escala})`,
    tambaleo: `rotate(${n2(m.tambaleo)} 0 0)`,
    plumas: `translate(0 ${n2(m.vuelo)})`,
  };
  const opacity: Record<string, string> = {
    cacareo: n2(m.cacareo),
    hipo: n2(Math.sin(Math.PI * Math.min(1, Math.max(0, m.hipo)))),
    plumas: n2(m.plumas),
  };
  (['a', 'b'] as const).forEach((g, n) => {
    const x = n === 0 ? PAREJA.a + m.arrima[0] : PAREJA.b - m.arrima[1];
    const espejo = n === 0 ? '' : ` scale(${-PAREJA.flaco} ${PAREJA.flaco})`;
    transform[`gallo-${g}`] = `translate(${n2(x)} ${n2(-m.salto[n])})${espejo} rotate(${n2(m.inclina[n])} 0 0)`;
    for (const p of [0, 1] as const) {
      const [hx, hy] = G.caderas[p];
      transform[`pata-${g}-${p + 1}`] = `rotate(${n2(m.patas[n][p])} ${hx} ${hy})`;
    }
    const i = m.infla[n];
    const [cx, cy] = G.centro;
    transform[`infla-${g}`] = `translate(${cx} ${cy}) scale(${n2(1 + INFLA[0] * i)} ${n2(1 + INFLA[1] * i)}) translate(${-cx} ${-cy})`;
    transform[`cola-${g}`] = `rotate(${n2(m.cola[n])} ${G.rabadilla[0]} ${G.rabadilla[1]})`;
    transform[`ala-${g}`] = `rotate(${n2(m.ala[n])} ${G.hombro[0]} ${G.hombro[1]})`;
    // Inflado, el pescuezo sube y se adelanta con el pecho.
    transform[`cuello-${g}`] = `translate(${n2(5 * i)} ${n2(-9 * i)}) rotate(${n2(m.cuello[n])} ${G.cuello[0]} ${G.cuello[1]})`;
    transform[`cresta-${g}`] = `rotate(${n2(m.cresta[n])} ${G.cresta[0]} ${G.cresta[1]})`;
    transform[`pico-${g}`] = `rotate(${n2(m.pico[n])} ${G.comisura[0]} ${G.comisura[1]})`;
    // La barba cuelga siempre para abajo: deshace lo que giran el pescuezo y el cuerpo, y se hamaca.
    transform[`barba-${g}`] = `rotate(${n2(m.barba[n] - m.cuello[n] - m.inclina[n])} ${G.barba[0]} ${G.barba[1]})`;
    const [ox, oy] = G.ojo;
    const k = Math.min(1, Math.max(0, m.parpado[n]));
    transform[`parpado-${g}`] = `translate(${ox} ${oy - 5.5}) scale(1 ${n2(k)}) translate(${-ox} ${-(oy - 5.5)})`;
  });
  transform.hipo = `translate(0 ${n2(-16 * m.hipo)})`;
  return { transform, opacity };
}

/** Lo cerrado de un párpado, leído de su transformación (para el test). */
export const cerradoDe = (transform: string): number => {
  const r = /scale\(1 ([-\d.]+)\)/.exec(transform);
  return r ? Number(r[1]) : NaN;
};

/** Dónde dicen su verso: arriba de las dos crestas, en el recinto. */
export const VERSO: Punto = alRecinto([0, -250]);
