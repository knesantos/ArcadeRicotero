/**
 * Los números del chivato (`D-73`, vigesimotercera vuelta): dónde se para en la prisión, cómo está armado
 * y cómo se pone. Los lee el dibujo (`arte-chivato.ts`), para la pose quieta del HTML y para el retrato, y
 * la conducta (`scripts/bestiario/chivato.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del chivato**: el (0, 0) es el piso entre las dos pezuñas; arriba es negativo. Está de frente,
 *   parado en dos patas como un murguero, con la oreja de la izquierda pegada a la reja.
 * - **El del recinto** (la prisión, −250…1150 × 640): afuera de la celda nueva del ala de la izquierda, la
 *   del reo, entre la reja y la columna de adelante, a la izquierda de Barbazul.
 */

import { rot, type P } from './trazos.ts';

export type Punto = P;

/** Dónde se para, y lo que mide. */
export const CHIVATO = { x: -54, piso: 630, escala: 0.95 } as const;

/** Cómo está armado, en las coordenadas del chivato. El 1 es el lado de la izquierda (el de la reja). */
export const CHIVATO_ARMADO = {
  /** La cintura: de acá se inclina el torso para pegar la oreja. */
  cintura: [0, -74] as Punto,
  caderas: [[-11, -74], [11, -74]] as readonly [Punto, Punto],
  pezunas: [[-15, -2], [15, -2]] as readonly [Punto, Punto],
  /** De dónde cuelgan los faldones de la levita. */
  faldones: [0, -86] as Punto,
  hombros: [[-24, -136], [24, -136]] as readonly [Punto, Punto],
  /** Las manos: la 1 con la libretita delante del pecho, la 2 apoyada en la panza. */
  manos: [[-13, -110], [12, -92]] as readonly [Punto, Punto],
  /** El medio de la libretita, en la mano 1. */
  libreta: [-12, -119] as Punto,
  /** El cogote: de acá cabecea. */
  cuello: [0, -146] as Punto,
  ojos: [[-10, -186], [10, -186]] as readonly [Punto, Punto],
  /** La base de cada oreja. */
  orejas: [[-19, -192], [19, -192]] as readonly [Punto, Punto],
  /** El lápiz atrás de la oreja 2. */
  lapiz: [36, -194] as Punto,
  /** La boca: de acá baja la quijada. */
  boca: [0, -158] as Punto,
  /** Donde apoya la galera, entre los cuernos. */
  galera: [0, -212] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Cuánto se inclina el torso en la cintura (grados; negativo es para la reja). */
  inclina: number;
  /** Cuánto se achica entero, encogido (0 a 1). */
  encoge: number;
  /** Cuánto gira la cabeza en el cogote (grados) y cuánto se le hunde en el cuello de la levita (0 a 1). */
  cabeza: number;
  hunde: number;
  /** Cuánto gira cada brazo en su hombro y cada pierna en su cadera (grados). */
  brazos: readonly [number, number];
  piernas: readonly [number, number];
  /** Cuánto gira cada oreja en su base (grados). */
  orejas: readonly [number, number];
  /** Para dónde miran las pupilas, de −1 a 1 (x a la derecha, y para abajo). */
  mira: readonly [number, number];
  /** Los párpados: 0 abiertos, 1 cerrados. El asombro le levanta el párpado pesado (0 a 1). */
  parpado: number;
  asombro: number;
  /** La quijada: cuánto baja (0 a 1) y cuánto mastica de costado (−1 a 1). */
  abre: number;
  mastica: number;
  /** La boca abierta del balido (0 a 1), el bocado de hoja en la boca, y las ondas del balido. */
  boca: number;
  bocado: number;
  balido: number;
  /** El lápiz: 0 atrás de la oreja, 1 en la mano. */
  lapiz: number;
  /** La galera: cuánto se le baja sobre los ojos (0 a 1), cuánto salta (unidades) y cuánto gira (grados). */
  galera: number;
  salto: number;
  ladeo: number;
  /** Los faldones de la levita (grados). */
  faldon: number;
  /** La hoja de la lista que se vuela: 0 en la libreta, de 0 a 1 en el aire. */
  hoja: number;
  /** La gota de sudor, cuando lo descubren (0 a 1). */
  gota: number;
}

/** La pose quieta, la del HTML: inclinado contra la reja, la oreja pegada, mirando de reojo al pasillo. */
export const QUIETO: Momento = {
  inclina: -7,
  encoge: 0,
  cabeza: -16,
  hunde: 0,
  brazos: [0, 0],
  piernas: [0, 0],
  orejas: [6, 0],
  mira: [1, 0.15],
  parpado: 0,
  asombro: 0,
  abre: 0,
  mastica: 0,
  boca: 0,
  bocado: 0,
  balido: 0,
  lapiz: 0,
  galera: 0,
  salto: 0,
  ladeo: 8,
  faldon: 0,
  hoja: 0,
  gota: 0,
};

/** Lo que gira el brazo de la libreta para alzarla (cuando canta) y el del lápiz para llegar a la oreja. */
export const ALZA = 185;
export const A_LA_OREJA = -183;
/** Lo que gira el brazo del lápiz para escribir en la libreta. */
export const ESCRIBE = 47;

/**
 * *"Penas del corazón que duran siempre menos que las de prisión, chivato"*: canta la delación como un
 * murguero, la boca abierta, la libreta en alto, la patada, y la hoja con la lista volándose. Es el toque
 * quieto y el retrato.
 */
export const CANTA: Momento = {
  ...QUIETO,
  inclina: 3,
  cabeza: 10,
  brazos: [ALZA, -150],
  piernas: [0, -24],
  orejas: [-18, 18],
  mira: [-0.4, -0.8],
  asombro: 1,
  abre: 1,
  boca: 1,
  balido: 1,
  ladeo: -6,
  salto: -4,
  faldon: 14,
  hoja: 0.32,
};

/** Adónde llega la hoja: arriba de la celda del reo, en coordenadas del chivato. */
export const VUELO = { dx: -150, dy: -150, giro: 260 } as const;

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [CHIVATO.x + x * CHIVATO.escala, CHIVATO.piso + y * CHIVATO.escala];

/** La mano del lápiz con el brazo girado (sin contar la inclinación): para ver que llega a la oreja y a la libreta. */
export const manoDelLapiz = (brazo: number): Punto => rot(CHIVATO_ARMADO.manos[1], CHIVATO_ARMADO.hombros[1], brazo);

/** De dónde se suelta la hoja: el medio de la libreta con el brazo alzado y el torso de cuando canta. */
export const SUELTA: Punto = rot(rot(CHIVATO_ARMADO.libreta, CHIVATO_ARMADO.hombros[0], ALZA), CHIVATO_ARMADO.cintura, CANTA.inclina);

/** Dónde está la hoja en un punto del vuelo (0 a 1), en coordenadas del chivato. */
export function enVuelo(t: number): { x: number; y: number; giro: number } {
  const [sx, sy] = SUELTA;
  return {
    x: sx + VUELO.dx * t + 10 * Math.sin(t * 9),
    y: sy + VUELO.dy * Math.sin((Math.PI / 2) * Math.min(1, t * 1.3)) + 40 * Math.max(0, t - 0.77),
    giro: VUELO.giro * t + 24 * Math.sin(t * 11),
  };
}

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = CHIVATO_ARMADO;
  const [wx, wy] = A.cintura;
  const [fx, fy] = A.faldones;
  const [nx, ny] = A.cuello;
  const [gx, gy] = A.galera;
  const [lx, ly] = A.libreta;
  const v = enVuelo(m.hoja);
  const transform: Record<string, string> = {
    entero: `translate(${CHIVATO.x} ${CHIVATO.piso}) scale(${CHIVATO.escala})`,
    agacha: `scale(${n2(1 + 0.04 * m.encoge)} ${n2(1 - 0.14 * m.encoge)})`,
    torso: `rotate(${n2(m.inclina)} ${wx} ${wy})`,
    faldones: `rotate(${n2(m.faldon)} ${fx} ${fy})`,
    cabeza: `translate(0 ${n2(m.hunde * 14)}) rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    cejas: `translate(0 ${n2(-m.asombro * 3.4)})`,
    pupilas: `translate(${n2(m.mira[0] * 2.6)} ${n2(m.mira[1] * 1.6)})`,
    quijada: `translate(${n2(m.mastica * 2.4)} ${n2(m.abre * 7)})`,
    galera: `translate(0 ${n2(m.galera * 12 + m.salto)}) rotate(${n2(m.ladeo)} ${gx} ${gy})`,
    hoja: `translate(${n2(v.x)} ${n2(v.y)}) rotate(${n2(v.giro)}) translate(${-lx} ${-ly})`,
  };
  for (const n of [0, 1] as const) {
    const [hx, hy] = A.hombros[n];
    const [cx, cy] = A.caderas[n];
    const [ox, oy] = A.orejas[n];
    transform[`brazo-${n + 1}`] = `rotate(${n2(m.brazos[n])} ${hx} ${hy})`;
    transform[`pierna-${n + 1}`] = `rotate(${n2(m.piernas[n])} ${cx} ${cy})`;
    transform[`oreja-${n + 1}`] = `rotate(${n2(m.orejas[n])} ${ox} ${oy})`;
  }
  const visible = m.hoja > 0 && m.hoja < 1 ? Math.min(1, (1 - m.hoja) / 0.25) : 0;
  const opacity: Record<string, string> = {
    parpado: n2(m.parpado),
    boca: n2(m.boca),
    bocado: n2(m.bocado),
    balido: n2(m.balido),
    'lapiz-oreja': n2(1 - m.lapiz),
    'lapiz-mano': n2(m.lapiz),
    hoja: n2(visible),
    gota: n2(m.gota),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la galera, en el recinto. */
export const VERSO: Punto = alRecinto([0, -270]);
