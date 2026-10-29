/**
 * Los números del club de mantis (`D-73`, vigesimoquinta vuelta): dónde se sientan en la mesa servida, cómo
 * está armada cada una, dónde llega el macho y cómo se pone todo. Los lee el dibujo (`arte-mantis.ts`), para la
 * pose quieta del HTML y para el retrato, y la conducta (`scripts/bestiario/mantis.ts`), que se lleva esto y
 * nada que dibuje. La misma cuenta las sienta sin JavaScript y con la isla.
 *
 * Tres sistemas de coordenadas, uno adentro del otro:
 * - **El del club**: el (0, 0) es el canto de atrás del tablero, debajo de los ojos de la del medio; arriba es
 *   negativo. Nada de ellas baja de ahí, salvo las pinzas que apoyan en el mantel; en el mantel están también
 *   la fuente de masitas, la flor y la antena que quedan en el plato, y el macho, que llega caminando por ahí.
 *   Está dibujado al doble, y la escena lo achica con `CLUB.escala`.
 * - **El de cada mantis**: el (0, 0) es el canto debajo de su medio; las tres están armadas igual (`ARMADA`) y
 *   cada una se corre y se achica a su lugar (`SILLAS`). Las patas de la derecha son las de la izquierda en el
 *   espejo.
 * - **El del macho**: el (0, 0) es el mantel entre sus patas, y mira a la izquierda, para el lado del plato.
 *
 * El del recinto (900 × 640) es la mesa de `MESA` (`rig-entornos.ts`): los ojos de la del medio quedan donde
 * estaban sus ojos en lo oscuro (`OJOS_DE_LA_MESA`), y esa `x` es el ancla del marco: en el camino la mesa se
 * estira y el club se corre con ella.
 */

import { MESA, OJOS_DE_LA_MESA } from './rig-entornos.ts';
import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde se sientan, y lo que miden. */
export const CLUB = {
  x: OJOS_DE_LA_MESA['el-club-de-mantis']![0],
  mesa: MESA.tablero.atras,
  escala: 0.5,
} as const;

/** Cómo está armada una mantis, en sus coordenadas. La pata `a` es la de la izquierda de quien mira. */
export const ARMADA = {
  /** De acá se hamaca, como se hamacan las mantis de verdad: escondida detrás del canto. */
  base: [0, 0] as Punto,
  /** De acá gira la cabeza triangular, de golpe. */
  cuello: [0, -78] as Punto,
  /** Los dos ojos compuestos, en las puntas de arriba del triángulo, y lo que miden. */
  ojos: [[-14, -93], [14, -93]] as readonly [Punto, Punto],
  radioOjo: [8, 9] as readonly [number, number],
  /** Lo que se corre la pseudopupila adentro del ojo cuando mira a un costado o para abajo. */
  corrida: [4.2, 3.4] as readonly [number, number],
  /** La boca, en la punta de abajo del triángulo: de acá se abren las mandíbulas. */
  boca: [0, -73] as Punto,
  /** De dónde salen las antenas, entre los ojos. */
  antena: [-3, -102] as Punto,
  largoAntena: 46,
  /** El hombro de la pata de la izquierda: el fémur cuelga dibujado derecho hasta el codo, y la tibia sube plegada. */
  hombro: [-6, -63] as Punto,
  codo: [-6, 7] as Punto,
  largos: { brazo: 70, pinza: 46 },
  /** El nudo de la servilleta, atada al cogote. */
  nudo: [0, -66] as Punto,
} as const;

/** La punta de la pinza de la izquierda, plegada: de acá agarra el abanico. */
export const PUNTA: Punto = [ARMADA.codo[0] + 4, ARMADA.codo[1] - ARMADA.largos.pinza];

/**
 * Las tres sillas, en las coordenadas del club: la del abanico a la izquierda, la del collar de perlas en el
 * medio (la de los ojos de oro) y la que mastica a la derecha, del lado de la tipa rapaz.
 */
export const SILLAS = [
  { x: -94, escala: 0.92 },
  { x: 0, escala: 1 },
  { x: 76, escala: 0.95 },
] as const;

/** El plato de la del medio (el que pinta el piso de la mesa), la fuente de masitas y adónde llega el macho. */
export const PLATO: Punto = [0, 24];
export const FUENTE: Punto = [-48, 23];
/** El macho: dónde está llegando en la pose quieta, de dónde vuelve a aparecer, y dónde se sienta, en el plato. */
export const MACHO = {
  llega: [116, 34] as Punto,
  vuelve: [132, 34] as Punto,
  plato: [12, 26] as Punto,
  escala: 0.72,
} as const;

/** Cómo está armado el macho, en sus coordenadas. */
export const MACHO_ARMADO = {
  /** El hombro de la pata de la flor, y la flor en la punta, levantada. */
  hombro: [-7, -44] as Punto,
  flor: [-20, -92] as Punto,
  /** La cadera: de acá se sienta y saluda con todo el cuerpo. */
  cadera: [4, -14] as Punto,
  /** Los ojos, para que miren al club. */
  ojo: [-12, -60] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface UnaMantis {
  /** Lo que se hamaca de un lado al otro, en su base (grados), y lo que se corre de costado (unidades). */
  hamaca: number;
  corre: number;
  /** Lo que ladea la cabeza en el cuello (grados), y lo que la da vuelta para un costado (−1 a 1). */
  cabeza: number;
  gira: number;
  /** Adónde miran las pseudopupilas, de −1 a 1 en cada eje. */
  mira: Punto;
  /** Cuánto gira cada antena en su base (grados; la de la derecha, en el espejo). */
  antenas: readonly [number, number];
  /** Cuánto gira cada fémur en el hombro (grados, para afuera y arriba) y cada tibia en el codo (0 es la pinza cerrada). */
  brazos: readonly [number, number];
  pinzas: readonly [number, number];
  /** Las mandíbulas abiertas (0 a 1) y la servilleta levantada (0 a 1). */
  mastica: number;
  servilleta: number;
}

export interface Momento {
  mantis: readonly [UnaMantis, UnaMantis, UnaMantis];
  /** El abanico, en la pinza de la del abanico (grados). */
  abanico: number;
  /** La pata de no se sabe qué que le asoma de la boca a la que mastica (0 adentro, 1 afuera), y el bocado que traga. */
  pata: number;
  traga: number;
  bocado: number;
  /** Lo que se corre la fuente de masitas por el mantel (unidades del club). */
  fuente: number;
  /** El macho: dónde está, el paso (0 a 1, cambia de patas), el saludo con la flor (0 a 1), sentado (0 a 1), y si se ve. */
  macho: { en: Punto; paso: number; saluda: number; sentado: number; ve: number };
  /** Lo que queda en el plato: la flor y una antena (0 a 1). */
  flor: number;
  antena: number;
}

const MANTIS_QUIETA: UnaMantis = {
  hamaca: 0,
  corre: 0,
  cabeza: 0,
  gira: 0,
  mira: [0, 0.3],
  antenas: [0, 0],
  brazos: [24, 24],
  pinzas: [22, 22],
  mastica: 0,
  servilleta: 0,
};

/** Las patas de la del abanico: la de la izquierda levantada con el abanico al lado de la cara. */
export const BRAZOS_ABANICO: readonly [number, number] = [148, 8];
export const PINZAS_ABANICO: readonly [number, number] = [26, 0];

/**
 * La pose quieta, la del HTML: las tres sentadas a la mesa, con la servilleta al cuello, mirando a quien
 * mira; la del abanico con el abanico en alto, la que mastica con la pata asomándole de la boca, y el macho
 * que ya está llegando por la derecha, contento, con la flor en alto.
 */
export const QUIETO: Momento = {
  mantis: [
    { ...MANTIS_QUIETA, cabeza: -5, mira: [0.3, 0.3], brazos: [BRAZOS_ABANICO[0], 24], pinzas: [PINZAS_ABANICO[0], 22], antenas: [4, -6] },
    { ...MANTIS_QUIETA },
    { ...MANTIS_QUIETA, cabeza: 7, mira: [-0.3, 0.4], brazos: [27, 20], pinzas: [18, 25], antenas: [-4, 6] },
  ],
  abanico: 0,
  pata: 1,
  traga: 0,
  bocado: 0,
  fuente: 0,
  macho: { en: MACHO.llega, paso: 0, saluda: 0.25, sentado: 0, ve: 1 },
  flor: 0,
  antena: 0,
};

/**
 * Lo que queda: la flor sola en el plato, con una antena, y las tres mirando el plato con la servilleta
 * levantada de haberse limpiado. Es la otra pose del toque quieto, la del movimiento reducido.
 */
export const SOLA: Momento = {
  ...QUIETO,
  mantis: [
    { ...QUIETO.mantis[0], cabeza: 8, mira: [0.8, 0.8], servilleta: 0.7 },
    { ...QUIETO.mantis[1], cabeza: -4, mira: [0.1, 1], servilleta: 0.7, mastica: 0.4 },
    { ...QUIETO.mantis[2], cabeza: -9, mira: [-0.8, 0.8], servilleta: 0.7 },
  ],
  macho: { ...QUIETO.macho, ve: 0 },
  flor: 1,
  antena: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

/** Un punto del club, llevado al recinto. */
export const alRecinto = ([x, y]: Punto): Punto => [CLUB.x + x * CLUB.escala, CLUB.mesa + y * CLUB.escala];
/** Un punto de la mantis `n` (0 a 2), sentada derecha, llevado al club. */
export const alClub = (n: number, [x, y]: Punto): Punto => [SILLAS[n]!.x + x * SILLAS[n]!.escala, y * SILLAS[n]!.escala];
/** Un punto del macho, parado en `en`, llevado al club. */
export const delMacho = (en: Punto, [x, y]: Punto): Punto => [en[0] + x * MACHO.escala, en[1] + y * MACHO.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Lo que se levanta el macho en cada paso, y lo que se agacha sentado. */
export const saltito = (paso: number): number => -3 * Math.abs(Math.sin(paso * Math.PI * 2));

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = ARMADA;
  const [cx, cy] = A.cuello;
  const [bx, by] = A.boca;
  const [ax, ay] = A.antena;
  const [sx, sy] = A.hombro;
  const [ex, ey] = A.codo;
  const [nx, ny] = A.nudo;
  const transform: Record<string, string> = {
    entero: `translate(${CLUB.x} ${CLUB.mesa}) scale(${CLUB.escala})`,
  };
  const opacity: Record<string, string> = {};
  m.mantis.forEach((u, i) => {
    const n = i + 1;
    const { x, escala } = SILLAS[i]!;
    transform[`mantis-${n}`] = `translate(${n2(x + u.corre)} 0) scale(${escala}) rotate(${n2(u.hamaca)})`;
    // La cabeza se ladea en el cuello y, cuando se da vuelta, se angosta para el lado que mira.
    const ancho = 1 - 0.22 * Math.abs(u.gira);
    transform[`cabeza-${n}`] = `rotate(${n2(u.cabeza)} ${cx} ${cy}) translate(${n2(cx + 5 * u.gira)} ${cy}) scale(${n2(ancho)} 1) translate(${-cx} ${-cy})`;
    transform[`pupilas-${n}`] = `translate(${n2(u.mira[0] * A.corrida[0])} ${n2(u.mira[1] * A.corrida[1])})`;
    transform[`mandibulas-${n}`] = `translate(${bx} ${by}) scale(${n2(1 + 0.3 * u.mastica)} ${n2(1 + 0.7 * u.mastica)}) translate(${-bx} ${-by})`;
    transform[`servilleta-${n}`] = `translate(0 ${n2(-4 * u.servilleta)}) rotate(${n2(-10 * u.servilleta)} ${nx} ${ny}) translate(${nx} ${ny}) scale(1 ${n2(1 - 0.18 * u.servilleta)}) translate(${-nx} ${-ny})`;
    (['a', 'b'] as const).forEach((lado, k) => {
      transform[`antena-${n}-${lado}`] = `rotate(${n2(u.antenas[k]!)} ${ax} ${ay})`;
      transform[`brazo-${n}-${lado}`] = `rotate(${n2(u.brazos[k]!)} ${sx} ${sy})`;
      transform[`pinza-${n}-${lado}`] = `rotate(${n2(u.pinzas[k]!)} ${ex} ${ey})`;
    });
  });
  transform.abanico = `rotate(${n2(m.abanico)} ${PUNTA[0]} ${PUNTA[1]})`;
  // La pata se mete en la boca para arriba; el bocado baja por el cogote hasta perderse detrás del nudo.
  transform.pata = `translate(${bx} ${by}) scale(${n2(0.3 + 0.7 * m.pata)}) translate(${-bx} ${-by})`;
  transform.bocado = `translate(0 ${n2(14 * m.traga)})`;
  transform.fuente = `translate(${n2(m.fuente)} 0)`;
  const { en, paso, saluda, sentado } = m.macho;
  const [hx, hy] = MACHO_ARMADO.cadera;
  const [hox, hoy] = MACHO_ARMADO.hombro;
  transform.macho = `translate(${n2(en[0])} ${n2(en[1] + saltito(paso) * (1 - sentado))}) scale(${MACHO.escala})`;
  // Saluda inclinándose para el lado de las señoras; sentado, se echa para atrás y baja.
  transform['macho-cuerpo'] = `translate(0 ${n2(7 * sentado)}) rotate(${n2(-14 * saluda * (1 - sentado) + 10 * sentado)} ${hx} ${hy})`;
  transform['macho-brazo'] = `rotate(${n2(-40 * saluda + 25 * sentado)} ${hox} ${hoy})`;
  opacity.macho = n2(m.macho.ve);
  const otra = Math.floor(((paso % 1) + 1) % 1 * 2) === 1;
  opacity['patas-1'] = sentado > 0.5 || !otra ? '1' : '0';
  opacity['patas-2'] = sentado > 0.5 || !otra ? '0' : '1';
  opacity.pata = n2(Math.min(1, m.pata * 1.4));
  opacity.bocado = n2(m.bocado);
  opacity.flor = n2(m.flor);
  opacity['antena-suelta'] = n2(m.antena);
  return { transform, opacity };
}

/** Dónde dicen su verso: arriba de las antenas de la del medio, en el recinto. */
export const VERSO: Punto = alRecinto([0, -170]);
