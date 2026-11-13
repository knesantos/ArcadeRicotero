/**
 * Los números del borrego (`D-73`, vigesimoséptima vuelta): dónde anda suelto en la pastura, cómo está armado y cómo
 * se pone. Los lee el dibujo (`arte-borrego.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/borrego.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del borrego**: el (0, 0) es el piso debajo del medio de la panza; arriba es negativo y mira a la
 *   **derecha**, para el lado del palo. Está dibujado al doble, y la escena lo achica con `BORREGO.escala`.
 * - **El del recinto** (900 × 640, el del monte y la pastura): en el claro, abajo y a la izquierda del palo, justo
 *   afuera de donde llega el cordero con la soga tirante. En el camino el claro va corrido entero (`claro.dx` en
 *   `camino.ts`) y él con el claro.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde anda, y lo que mide. */
export const BORREGO = { x: 300, piso: 516, escala: 0.5 } as const;

/** Cómo está armado, en sus coordenadas. El 1 es la pata de lejos. */
export const BORREGO_ARMADO = {
  /** El medio del cuerpo: de acá respira y de acá gira cuando tira la patada. */
  lomo: [0, -72] as Punto,
  /** Los hombros y las caderas: de acá giran las patas. */
  hombros: [[36, -60], [26, -62]] as readonly [Punto, Punto],
  caderas: [[-42, -60], [-50, -62]] as readonly [Punto, Punto],
  /** El cogote: de acá gira la cabeza, y acá lleva atado el pañuelo. */
  cuello: [46, -84] as Punto,
  /** La bisagra de la quijada y la punta del hocico. */
  quijada: [84, -94] as Punto,
  hocico: [112, -100] as Punto,
  /** El ojo de este lado, y lo que mide. */
  ojo: { centro: [86, -113] as Punto, radio: [6.4, 5.8] as Punto },
  /** Las bases de las orejas, caídas: la 1 es la de atrás. */
  orejas: [[62, -118], [70, -122]] as readonly [Punto, Punto],
  /** De dónde sale la cola. */
  cola: [-58, -78] as Punto,
  /** El carrito del cierre del disfraz, en el lomo. */
  cierre: [8, -104] as Punto,
  /** Cuánto mide de alto el disfraz puesto: de acá sale lo que se aplasta cuando se cae. */
  vellon: { arriba: -110, abajo: -42 },
} as const;

/** Lo que se aplasta el disfraz caído: lo ancho que queda y lo alto, y lo que baja para tocar el piso. */
export const CAIDO = { ancho: 1.22, alto: 0.3, baja: 12.6 } as const;
/** Cuánto del giro de la cabeza acompaña el cogote. */
export const COGOTE = 0.5;
/** Cuánto abre la quijada a pleno, en grados. */
export const ABRE = 26;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** La respiración (−1 a 1). */
  respira: number;
  /** El brinco: lo que sube (unidades) y lo que se inclina el cuerpo (grados; positivo levanta el anca). */
  salta: number;
  inclina: number;
  /** El temblor (unidades). */
  tiembla: number;
  /** Las patas, en grados: adelante de cerca y de lejos, atrás de cerca y de lejos. */
  patas: readonly [number, number, number, number];
  /** Cuánto gira la cabeza en el cogote (grados; positivo la baja a pastar). */
  cabeza: number;
  /** La quijada (0 cerrada, 1 abierta). */
  quijada: number;
  /** Las orejas (grados; negativo las para). */
  orejas: readonly [number, number];
  /** El párpado (0 abierto, 1 cerrado) y la pupila (corrimiento). */
  parpado: number;
  pupila: readonly [number, number];
  /** La cola (grados) y las puntas del pañuelo (grados), que llegan después que el cuerpo. */
  cola: number;
  panuelo: number;
  /** El disfraz: cuánto se le cayó (0 puesto, 1 en el piso). */
  caido: number;
}

/** La pose quieta, la del HTML: parado, con el disfraz puesto y mirando al palo. */
export const QUIETO: Momento = {
  respira: 0,
  salta: 0,
  inclina: 0,
  tiembla: 0,
  patas: [0, 0, 0, 0],
  cabeza: 0,
  quijada: 0,
  orejas: [0, 0],
  parpado: 0,
  pupila: [1.6, 0],
  cola: 0,
  panuelo: 0,
  caido: 0,
};

/**
 * *"Caen, caen al fin, caen los disfraces, caen desnudándote"*: el vellón en el piso, y él pelado, con los cortes
 * del carnicero marcados en el cuero y las orejas gachas. Es el toque quieto y el retrato.
 */
export const DESNUDO: Momento = {
  ...QUIETO,
  patas: [6, -4, -6, 4],
  cabeza: -8,
  quijada: 0.5,
  orejas: [24, 28],
  parpado: 0,
  pupila: [-2.6, 1.4],
  cola: 30,
  panuelo: 10,
  caido: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [BORREGO.x + x * BORREGO.escala, BORREGO.piso + y * BORREGO.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = BORREGO_ARMADO;
  const [lx, ly] = A.lomo;
  const [nx, ny] = A.cuello;
  const [qx, qy] = A.quijada;
  const [kx, ky] = A.cola;
  const hincha = 1 + 0.03 * m.respira;
  const c = Math.min(1, Math.max(0, m.caido));
  const transform: Record<string, string> = {
    entero: `translate(${BORREGO.x} ${BORREGO.piso}) scale(${BORREGO.escala})`,
    cuerpo: `translate(${n2(m.tiembla)} ${n2(-m.salta)}) rotate(${n2(m.inclina)} ${lx} ${ly})`,
    tronco: `translate(${lx} ${ly}) scale(1 ${n2(hincha)}) translate(${-lx} ${-ly})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    // El cogote gira la mitad que la cabeza, en el mismo punto: así nunca queda un hueco entre los dos.
    cuello: `rotate(${n2(m.cabeza * COGOTE)} ${nx} ${ny})`,
    quijada: `rotate(${n2(ABRE * m.quijada)} ${qx} ${qy})`,
    cola: `rotate(${n2(m.cola)} ${kx} ${ky})`,
    panuelo: `rotate(${n2(m.panuelo)} ${nx} ${ny + 4})`,
    // El disfraz baja por las patas y se aplasta contra el piso. Va adentro del cuerpo, así que puesto salta con él;
    // caído se queda donde cayó, aunque el borrego brinque.
    vellon: `translate(0 ${n2((CAIDO.baja + m.salta) * c)}) scale(${n2(1 + (CAIDO.ancho - 1) * c)} ${n2(1 - (1 - CAIDO.alto) * c)})`,
  };
  for (const n of [0, 1] as const) {
    const [hx, hy] = A.hombros[n];
    const [cx, cy] = A.caderas[n];
    const [ox, oy] = A.orejas[n];
    transform[`pata-del-${n + 1}`] = `rotate(${n2(m.patas[n])} ${hx} ${hy})`;
    transform[`pata-tras-${n + 1}`] = `rotate(${n2(m.patas[2 + n])} ${cx} ${cy})`;
    transform[`oreja-${n + 1}`] = `rotate(${n2(m.orejas[n])} ${ox} ${oy})`;
  }
  const { centro: [ex, ey], radio: [, ry] } = A.ojo;
  const top = ey - ry - 0.6;
  transform.parpado = `translate(${ex} ${top}) scale(1 ${n2(Math.max(0.02, m.parpado))}) translate(${-ex} ${-top})`;
  transform.pupila = `translate(${n2(m.pupila[0])} ${n2(m.pupila[1])})`;
  return { transform, opacity: {} };
}

/** Dónde dice su verso: arriba de la cabeza, en el recinto. */
export const VERSO: Punto = alRecinto([60, -160]);
