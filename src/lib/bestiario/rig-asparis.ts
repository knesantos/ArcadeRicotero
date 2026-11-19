/**
 * Los números del as del Club París (`D-73`, vigesimonovena vuelta): dónde está parado en el muelle, cómo está armado
 * y cómo se pone. Los lee el dibujo (`arte-asparis.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/asparis.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del as**: el (0, 0) es la tabla del muelle entre sus zapatos; arriba es negativo. Está dibujado al doble y la
 *   escena lo achica con `ASPARIS.escala`. La valija está a su derecha, en `ASPARIS_ARMADO.valija`.
 * - **El del recinto** (900 × 640, el de los astilleros): en el muelle, al pie de la pila de containers, donde estaba
 *   pintado, con la valija donde estaba la valija (`ASTILLERO.valija`). En el camino el marco lo corre `ancla · (k − 1)`.
 */

import type { P } from './trazos.ts';
import { ASTILLERO } from './rig-entornos.ts';

export type Punto = P;

/** Lo que mide, y dónde está parado: la valija queda en la x donde estaba pintada. */
const ESCALA = 0.52;
const A_LA_VALIJA = 104;
export const ASPARIS = { x: ASTILLERO.valija.x - A_LA_VALIJA * ESCALA, piso: ASTILLERO.valija.piso + 2, escala: ESCALA } as const;

/** Cómo está armado, en sus coordenadas. */
export const ASPARIS_ARMADO = {
  /**
   * El naipe: lo que mide, dónde tiene el canto de abajo (el largo de las piernas) y el doblez. El doblez no está justo
   * en el medio: la mitad de abajo es más larga, así que doblada asoma por arriba de la cara.
   */
  ancho: 104,
  alto: 150,
  pie: -52,
  doblez: -134,
  copete: -202,
  /** Los hombros, en el canto del naipe, y lo que mide el brazo dibujado, del hombro al guante. */
  hombros: [[-50, -150], [50, -150]] as readonly [Punto, Punto],
  brazo: 46,
  /** La boca, debajo del bigote: de ahí sale el matasuegras. Y el medio del bigote. */
  boca: [-2, -140] as Punto,
  bigote: [0, -149] as Punto,
  /** La valija: el medio, lo que mide, y la bisagra de la tapa (el canto de arriba). */
  valija: { x: A_LA_VALIJA, ancho: 92, alto: 60 },
  /** Dónde queda el naipe cuando está medio adentro de la valija (doblado al medio), y cuando entró del todo (doblado en cuatro). */
  medioAdentro: [A_LA_VALIJA, 66] as Punto,
  adentro: [A_LA_VALIJA, 117] as Punto,
  /** Doblada, la mitad de abajo no calza justo: queda torcida (grados) y corrida de costado. */
  torcida: [-5, 7] as readonly [number, number],
  /** Lo que se achica para entrar: todo lo suyo cabe, pero justo. */
  justo: 0.84,
  /** Dónde cae la moneda cuando se le escapa, y hasta dónde rueda (atrás de la valija). */
  cae: [34, -7] as Punto,
  rueda: A_LA_VALIJA + 6,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** El aliento (−1 a 1). */
  respira: number;
  /** El naipe: lo que se corre de su lugar (x, y), lo que se ladea (grados) y lo que se achica para entrar. */
  naipe: Punto;
  ladea: number;
  chico: number;
  /** De frente es 1, de canto es 0, de espaldas es −1. */
  cara: number;
  /** Los dobleces: la mitad de abajo, que se pliega para atrás y queda mostrando el dorso (0 a 1), y después al medio de costado (0 a 1). */
  dobla: number;
  dobla2: number;
  /**
   * Si, doblado, está sentado en las piernas (1) o suelto (0, adentro de la valija). Sentado, lo que queda del naipe
   * baja hasta apoyar el doblez en las piernas: así nunca flota arriba de ellas.
   */
  sentado: number;
  /** Si se ve el naipe (0 cuando la valija se cerró con él adentro). */
  naipeSe: number;
  /** Las piernas: cuánto las tiene afuera (0 a 1). */
  piernas: number;
  /** Los brazos: lo que gira cada uno del hombro (grados) y si se ven. */
  brazos: readonly [number, number];
  brazosSe: number;
  /** Los párpados (0 a 1) y lo torcido que tiene el bigote postizo (grados). */
  parpado: number;
  bigote: number;
  /** La galera de cartón: lo que se corre de arriba del naipe (x, y) y lo que gira. */
  galera: readonly [number, number, number];
  /** La moneda: si la tiene en la mano; y si no, dónde está. Lo que giró (vueltas) y si se ve. */
  enMano: boolean;
  moneda: Punto;
  vueltas: number;
  monedaSe: number;
  /** El matasuegras: cuánto se desenrolló (0 a 1), lo que se cae (grados) y si se ve. */
  mata: number;
  mataCae: number;
  mataSe: number;
  /** La valija: cuánto abre la tapa (0 a 1), lo que está corrida por la sacudida (−1 a 1), y si asoma el guante agarrado del canto. */
  tapa: number;
  sacude: number;
  guante: number;
}

/** La pose quieta, la del HTML: parado al lado de su valija cerrada, con la moneda en la mano. */
export const QUIETO: Momento = {
  respira: 0,
  naipe: [0, 0],
  ladea: -2,
  chico: 1,
  cara: 1,
  dobla: 0,
  dobla2: 0,
  sentado: 0,
  naipeSe: 1,
  piernas: 1,
  brazos: [16, -22],
  brazosSe: 1,
  parpado: 0,
  bigote: 5,
  galera: [0, 0, -9],
  enMano: true,
  moneda: [0, 0],
  vueltas: 0,
  monedaSe: 1,
  mata: 0,
  mataCae: 0,
  mataSe: 0,
  tapa: 0,
  sacude: 0,
  guante: 0,
};

/**
 * *"Pero cabe todo lo tuyo en una maldita valija"*: doblado al medio y metido hasta la cintura en la valija abierta,
 * agarrado del canto, con la galera puesta y la moneda tirada en el muelle. Es el toque quieto y el retrato.
 */
export const CABE: Momento = {
  ...QUIETO,
  naipe: ASPARIS_ARMADO.medioAdentro,
  ladea: 3,
  chico: ASPARIS_ARMADO.justo,
  dobla: 1,
  piernas: 0,
  brazosSe: 0,
  bigote: -14,
  galera: [0, 0, 12],
  enMano: false,
  moneda: ASPARIS_ARMADO.cae,
  vueltas: 0.21,
  tapa: 1,
  guante: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [ASPARIS.x + x * ASPARIS.escala, ASPARIS.piso + y * ASPARIS.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const rad = (g: number): number => (g * Math.PI) / 180;

/** Lo ancho que se ve el naipe: de canto no llega a nada, y el segundo doblez lo deja en la mitad. El signo dice si da la cara. */
export function anchoVisto(m: Momento): number {
  const c = Math.abs(m.cara) < 0.045 ? (m.cara < 0 ? -0.045 : 0.045) : m.cara;
  return c * (1 - 0.5 * m.dobla2);
}

/** Lo que baja el naipe para apoyar el doblez en las piernas, cuando está sentado: nada entero, la mitad de abajo cuando está doblado. */
export function asiento(m: Momento): number {
  const A = ASPARIS_ARMADO;
  return m.sentado * (A.pie - A.doblez) * m.chico * Math.min(1, 2 * m.dobla);
}

/** Dónde queda un punto del naipe (en sus coordenadas, de frente y derecho) en un momento. */
export function enElNaipe([x, y]: Punto, m: Momento): Punto {
  const A = ASPARIS_ARMADO;
  const [qx, qy] = [x * anchoVisto(m) * m.chico, (y - A.pie) * m.chico];
  const a = rad(m.ladea);
  return [m.naipe[0] + qx * Math.cos(a) - qy * Math.sin(a), m.naipe[1] + asiento(m) + A.pie + qx * Math.sin(a) + qy * Math.cos(a)];
}

/** Dónde tiene el guante de un brazo (0 el de la izquierda de quien mira, 1 el de la derecha). */
export function guanteDe(m: Momento, i: 0 | 1): Punto {
  const A = ASPARIS_ARMADO;
  const [hx, hy] = A.hombros[i];
  const a = rad(m.brazos[i]);
  return enElNaipe([hx - A.brazo * Math.sin(a), hy + A.brazo * Math.cos(a)], m);
}

/** Dónde está la moneda en un momento: en el guante de la derecha, o donde la conducta diga. */
export const dondeLaMoneda = (m: Momento): Punto => (m.enMano ? guanteDe(m, 1) : m.moneda);

/** Dónde apoya la galera: en el canto de arriba del naipe. */
export const copete = (m: Momento): Punto => enElNaipe([0, ASPARIS_ARMADO.copete], m);

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = ASPARIS_ARMADO;
  const ancho = anchoVisto(m);
  const sube = 1.2 * m.respira;
  const vuelta = Math.min(1, Math.max(0, 2 * m.dobla - 1));
  const [cx, cy] = copete(m);
  const [mx, my] = dondeLaMoneda(m);
  const valija = `translate(${n2(2.4 * m.sacude)} ${n2(-Math.abs(1.6 * m.sacude))})`;
  const f = (v: number): string => n2(Math.min(1, Math.max(0, v)));
  const transform: Record<string, string> = {
    entero: `translate(${n2(ASPARIS.x)} ${n2(ASPARIS.piso)}) scale(${ASPARIS.escala})`,
    piernas: `translate(${n2(m.naipe[0])} ${n2(m.naipe[1] + A.pie)}) scale(${n2(Math.max(0.2, Math.abs(m.cara)))} ${n2(Math.max(0.02, m.piernas))}) translate(0 ${-A.pie})`,
    naipe: `translate(${n2(m.naipe[0])} ${n2(m.naipe[1] + asiento(m) + A.pie - sube)}) rotate(${n2(m.ladea)}) scale(${n2(ancho * m.chico)} ${n2(m.chico)}) translate(0 ${-A.pie})`,
    // El pliegue: la mitad de abajo gira en el doblez. Hasta la mitad se la ve de frente, cada vez más de canto; después
    // pasa para atrás y sube, y se le ve el dorso.
    abajo: `translate(0 ${A.doblez}) scale(1 ${n2(Math.max(0.02, 1 - 2 * m.dobla))}) translate(0 ${-A.doblez})`,
    vuelta: `translate(${n2(A.torcida[1] * vuelta)} ${A.doblez}) rotate(${n2(A.torcida[0] * vuelta)}) scale(1 ${n2(-Math.max(0.02, vuelta))}) translate(0 ${-A.doblez})`,
    'brazo-i': `translate(${A.hombros[0][0]} ${A.hombros[0][1]}) rotate(${n2(m.brazos[0])})`,
    'brazo-d': `translate(${A.hombros[1][0]} ${A.hombros[1][1]}) rotate(${n2(m.brazos[1])})`,
    bigote: `translate(${A.bigote[0]} ${A.bigote[1]}) rotate(${n2(m.bigote)})`,
    mata: `translate(${A.boca[0]} ${A.boca[1]}) rotate(${n2(-m.mataCae)}) scale(${n2(Math.max(0.16, m.mata))} 1)`,
    galera: `translate(${n2(cx + m.galera[0])} ${n2(cy - sube + m.galera[1])}) rotate(${n2(m.ladea + m.galera[2])}) scale(${n2(Math.max(0.1, Math.abs(m.cara)) * m.chico)} ${n2(m.chico)})`,
    moneda: `translate(${n2(mx)} ${n2(my)}) scale(1 ${n2(Math.max(0.12, Math.abs(Math.cos(m.vueltas * Math.PI * 2))))})`,
    tapa: `${valija} translate(0 ${-A.valija.alto}) scale(1 ${n2(Math.max(0.02, m.tapa))}) translate(0 ${A.valija.alto})`,
    cierre: valija,
    'valija-fondo': valija,
    'valija-frente': valija,
  };
  const opacity: Record<string, string> = {
    naipe: f(m.naipeSe),
    piernas: m.piernas > 0.06 ? '1' : '0',
    abajo: m.dobla < 0.5 ? '1' : '0',
    vuelta: m.dobla < 0.5 ? '0' : '1',
    dorso: ancho < 0 ? '1' : '0',
    brazos: f(m.brazosSe),
    parpados: m.parpado > 0.5 ? '1' : '0',
    mata: f(m.mataSe),
    moneda: f(m.monedaSe),
    tapa: m.tapa > 0.12 ? '1' : '0',
    cierre: m.tapa > 0.12 ? '0' : '1',
    'valija-fondo': m.tapa > 0.12 ? '1' : '0',
    guante: f(m.guante),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la galera, en el recinto. */
export const VERSO: Punto = alRecinto([40, -262]);
