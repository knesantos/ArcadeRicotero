/**
 * Los números de la tipa rapaz (`D-73`, vigesimocuarta vuelta): dónde se para en la mesa servida, cómo
 * está armada y cómo se pone. Los lee el dibujo (`arte-rapaz.ts`), para la pose quieta del HTML y para el
 * retrato, y la conducta (`scripts/bestiario/rapaz.ts`), que se lleva esto y nada que dibuje. La misma
 * cuenta la para sin JavaScript y con la isla.
 *
 * Dos sistemas de coordenadas, como el verdugo de al lado (`rig-verdugo.ts`):
 * - **El de la tipa**: el (0, 0) es el canto de atrás del tablero, debajo de su cintura; arriba es
 *   negativo. Nada de ella baja de ahí, salvo la mano que se apoya en la mesa y la billetera que hay
 *   arriba del mantel. Está dibujada a dos veces y la escena la achica con `RAPAZ.escala`.
 * - **El del recinto** (900 × 640): la mesa de `MESA` (`rig-entornos.ts`).
 */

import { MESA, OJOS_DE_LA_MESA } from './rig-entornos.ts';
import { rot, type P } from './trazos.ts';

export type Punto = P;

/**
 * Dónde se para: detrás de la mesa, donde miraban sus ojos (`OJOS_DE_LA_MESA`), con la cintura en el
 * canto de atrás del tablero. Es el ancla de su marco: en el camino la mesa se estira y ella se corre.
 */
export const RAPAZ = {
  x: OJOS_DE_LA_MESA['la-tipa-rapaz']![0],
  mesa: MESA.tablero.atras,
  escala: 0.5,
} as const;

/** Cómo está armada, en las coordenadas de la tipa. La mano 1 es la de la copa (a la izquierda de quien mira), la 2 la garra. */
export const RAPAZ_ARMADO = {
  /** De acá se inclina y se agacha todo lo de arriba de la mesa. */
  cintura: [0, 4] as Punto,
  /** De acá se ladea la cabeza, con el cuello. */
  cuello: [4, -112] as Punto,
  /** Los hombros: de acá cuelga cada brazo, dibujado derecho para abajo hasta el codo. */
  hombros: [[-31, -98], [31, -98]] as readonly [Punto, Punto],
  /** El brazo, del hombro al codo; el antebrazo, del codo a la muñeca (dibujado derecho para arriba). */
  largos: { brazo: 46, antebrazo: 44 },
  /** Lo que mide la mano desde la muñeca hasta la punta de las uñas, dibujada para arriba. */
  mano: 30,
  /** El medio de la cara, que mira de tres cuartos para la derecha de quien mira. */
  cabeza: [6, -152] as Punto,
  /** Los ojos: el de cerca, grande, y el de lejos, más angosto. Y el largo de cada uno. */
  ojos: [[-1, -158], [18, -159]] as readonly [Punto, Punto],
  anchoOjo: [7, 5] as readonly [number, number],
  altoOjo: 3.6,
  /** La boca pintada, debajo del pico. */
  boca: [21, -136] as Punto,
  /** La punta de la nariz de pico, que se dobla para abajo. */
  nariz: [34, -146] as Punto,
  /** El lóbulo de la oreja: de acá cuelga el aro, y se hamaca. */
  aro: [-15, -146] as Punto,
  /** El escote, entre las dos puntas de la estola: adonde va a parar lo que se lleva. */
  escote: [2, -86] as Punto,
  /** La copa de cóctel, en la mano 1: el tallo y el cáliz, contados desde el puño para arriba. */
  copa: { tallo: 15, caliz: 17, radio: 12 },
  /** La billetera olvidada en la mesa, delante suyo: el medio, arriba del mantel. */
  billetera: [20, 14] as Punto,
} as const;

/* ------------------------------------------------------------------
   Las cuentas: del títere al recinto, y el brazo que alcanza
   ------------------------------------------------------------------ */

/** Un punto de la tipa, llevado al recinto. */
export const alRecinto = ([x, y]: Punto): Punto => [RAPAZ.x + x * RAPAZ.escala, RAPAZ.mesa + y * RAPAZ.escala];

const grados = ([x, y]: Punto): number => (Math.atan2(y, x) * 180) / Math.PI;
const vuelta = (a: number): number => ((((a + 180) % 360) + 360) % 360) - 180;

/** El codo y la muñeca como se dibujan: el brazo derecho para abajo, el antebrazo derecho para arriba. */
export const codoDibujado = (n: 0 | 1): Punto => {
  const [sx, sy] = RAPAZ_ARMADO.hombros[n];
  return [sx, sy + RAPAZ_ARMADO.largos.brazo];
};
export const munecaDibujada = (n: 0 | 1): Punto => {
  const [ex, ey] = codoDibujado(n);
  return [ex, ey - RAPAZ_ARMADO.largos.antebrazo];
};

/**
 * Un brazo de dos tramos que lleva la muñeca a `meta`, con el hombro corrido `baja` para abajo. El codo va
 * para afuera y para abajo, como en una señora que se cuida la postura. Devuelve cuánto gira el brazo en el
 * hombro, cuánto el antebrazo en el codo (adentro del brazo), y dónde quedaron el codo y la muñeca.
 */
export function alcanzar(n: 0 | 1, meta: Punto, baja = 0): { brazo: number; antebrazo: number; codo: Punto; muneca: Punto } {
  const [sx, sy0] = RAPAZ_ARMADO.hombros[n];
  const sy = sy0 + baja;
  const { brazo: l1, antebrazo: l2 } = RAPAZ_ARMADO.largos;
  const lejos = Math.hypot(meta[0] - sx, meta[1] - sy);
  const d = Math.min(l1 + l2 - 0.5, Math.max(l1 - l2 + 0.5, lejos));
  const u: Punto = [(meta[0] - sx) / (lejos || 1), (meta[1] - sy) / (lejos || 1)];
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const base: Punto = [sx + u[0] * a, sy + u[1] * a];
  const afuera = n === 0 ? -1 : 1;
  const codos: Punto[] = [
    [base[0] - u[1] * h, base[1] + u[0] * h],
    [base[0] + u[1] * h, base[1] - u[0] * h],
  ];
  const cuanto = ([x, y]: Punto): number => y + x * afuera * 0.6;
  const codo = cuanto(codos[0]!) >= cuanto(codos[1]!) ? codos[0]! : codos[1]!;
  const brazo = vuelta(grados([codo[0] - sx, codo[1] - sy]) - 90);
  const antebrazo = vuelta(grados([meta[0] - codo[0], meta[1] - codo[1]]) + 90 - brazo);
  const hasta = Math.hypot(meta[0] - codo[0], meta[1] - codo[1]) || 1;
  const muneca: Punto = [codo[0] + ((meta[0] - codo[0]) / hasta) * l2, codo[1] + ((meta[1] - codo[1]) / hasta) * l2];
  return { brazo, antebrazo, codo, muneca };
}

/* ------------------------------------------------------------------
   El momento: lo que la conducta decide en cada cuadro
   ------------------------------------------------------------------ */

/** Una mano: dónde va la muñeca (en coordenadas de la tipa) y para dónde apuntan los dedos (0 es para arriba). */
export interface Mano {
  muneca: Punto;
  giro: number;
}

export interface Momento {
  /** Lo que se inclina todo lo de arriba de la mesa (grados, positivo para la derecha de quien mira). */
  inclina: number;
  /** Lo agachada sobre la mesa (0 a 1), la respiración (de −1 a 1) y el sacudón de la risa (unidades). */
  agacha: number;
  respira: number;
  sacude: number;
  /** Lo que se ladea la cabeza en el cuello (grados), y adónde miran los ojos (de −1 a 1). */
  cabeza: number;
  mira: Punto;
  /** Los párpados: 0 abiertos, 1 cerrados. Cada uno por su cuenta. */
  parpados: readonly [number, number];
  /** Las cejas levantadas (0 a 1), la boca abierta de la risa (0 a 1) y lo que se hamaca el aro (grados). */
  ceja: number;
  risa: number;
  aro: number;
  /** La estola levantada para acomodarla (0 a 1), y las plumas sueltas: cuánto se ven y cuánto cayeron. */
  estola: number;
  plumas: number;
  caen: number;
  /** Las dos manos, y la garra: 0 abierta, 1 cerrada. */
  manos: readonly [Mano, Mano];
  garra: number;
  /** Dónde está la billetera, cuánto se levantó de la mesa (unidades) y cuán abierta está (0 a 1). */
  billetera: 'mesa' | 'mano';
  cae: number;
  abierta: number;
  /** El billete que se lleva, de 0 (no está) a 1, y lo que se ladea el cóctel en la copa (grados). */
  billete: number;
  vino: number;
}

/** Las manos quietas: la copa a la altura del pecho, con el meñique parado; la garra apoyada en el mantel. */
export const MANOS_QUIETAS: readonly [Mano, Mano] = [
  { muneca: [-40, -42], giro: -4 },
  { muneca: [33, -10], giro: 172 },
];

/** *"Como te gusta a vos"*: la copa en alto para el lado de quien mira, y la billetera apretada en la garra. */
export const MANOS_BRINDA: readonly [Mano, Mano] = [
  { muneca: [-74, -124], giro: -6 },
  { muneca: [14, -40], giro: -12 },
];

/**
 * La pose quieta, la del HTML: parada detrás de la mesa, la copa en una mano y la garra en el mantel, los
 * párpados pesados, mirando de reojo a quien la mira. La billetera de otro está en la mesa, delante suyo.
 */
export const QUIETO: Momento = {
  inclina: 0,
  agacha: 0,
  respira: 0,
  sacude: 0,
  cabeza: 0,
  mira: [-0.7, 0.2],
  parpados: [0.38, 0.42],
  ceja: 0,
  risa: 0,
  aro: 0,
  estola: 0,
  plumas: 0,
  caen: 0,
  manos: MANOS_QUIETAS,
  garra: 0,
  billetera: 'mesa',
  cae: 0,
  abierta: 0,
  billete: 0,
  vino: 0,
};

/** El brindis con lo ajeno en la garra: el toque quieto y el retrato. */
export const BRINDA: Momento = {
  ...QUIETO,
  inclina: -3,
  cabeza: -7,
  mira: [-0.9, 0.1],
  parpados: [0.5, 0.55],
  ceja: 1,
  risa: 0.35,
  aro: 8,
  manos: MANOS_BRINDA,
  garra: 1,
  billetera: 'mano',
  vino: -10,
};

/* ------------------------------------------------------------------
   Las marcas
   ------------------------------------------------------------------ */

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Lo que el torso se achata (agachada) o se llena (respira), desde la cintura. */
export const estiro = (m: Pick<Momento, 'agacha' | 'respira'>): number => 1 - 0.13 * m.agacha + 0.012 * m.respira;

/** Lo que baja algo que está a la altura `y` del torso, cuando se agacha o respira. */
export const bajaDe = (y: number, m: Pick<Momento, 'agacha' | 'respira'>): number => (y - RAPAZ_ARMADO.cintura[1]) * (estiro(m) - 1);

/** Los dos brazos para unas manos: la meta va al marco del cuerpo inclinado, y los hombros bajan con el torso. */
export function brazos(m: Pick<Momento, 'manos' | 'inclina' | 'agacha' | 'respira' | 'sacude'>) {
  const A = RAPAZ_ARMADO;
  return m.manos.map((mano, i) => {
    const n = i as 0 | 1;
    const baja = bajaDe(A.hombros[n][1], m) + m.sacude;
    const meta = rot(mano.muneca, A.cintura, -m.inclina);
    const r = alcanzar(n, meta, baja);
    return { ...r, mano: vuelta(mano.giro - m.inclina - r.brazo - r.antebrazo), baja };
  }) as unknown as readonly [ReturnType<typeof alcanzar> & { mano: number; baja: number }, ReturnType<typeof alcanzar> & { mano: number; baja: number }];
}

/** Dónde queda la punta de los dedos de una mano puesta, en las coordenadas de la tipa. */
export function puntaDe(m: Mano, largo: number = RAPAZ_ARMADO.mano): Punto {
  return rot([m.muneca[0], m.muneca[1] - largo], m.muneca, m.giro);
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = RAPAZ_ARMADO;
  const [cx, cy] = A.cintura;
  const [nx, ny] = A.cuello;
  const s = estiro(m);
  const [ax, ay] = A.aro;
  const [bx, by] = A.billetera;
  const transform: Record<string, string> = {
    entero: `translate(${RAPAZ.x} ${RAPAZ.mesa}) scale(${RAPAZ.escala})`,
    cuerpo: `rotate(${n2(m.inclina)} ${cx} ${cy})`,
    torso: `translate(${cx} ${cy}) scale(${n2(1 + 0.008 * m.respira)} ${n2(s)}) translate(${-cx} ${-cy})`,
    // La estola baja con los hombros, y para acomodarla se levanta y se tuerce un poco desde el cuello.
    estola: `translate(0 ${n2(bajaDe(-104, m) + m.sacude - 5 * m.estola)}) rotate(${n2(-6 * m.estola)} 0 -108)`,
    plumas: `translate(${n2(6 * m.caen)} ${n2(bajaDe(-90, m) + 46 * m.caen)}) rotate(${n2(14 * m.caen)} 0 -84)`,
    cabeza: `translate(0 ${n2(bajaDe(ny, m) + m.sacude * 0.7)}) rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    pupilas: `translate(${n2(m.mira[0] * 1.8)} ${n2(m.mira[1] * 0.8)})`,
    ceja: `translate(0 ${n2(-3.2 * m.ceja)})`,
    aro: `rotate(${n2(m.aro)} ${ax} ${ay})`,
    // La billetera de la mesa: se levanta y cae, y al caer se tuerce apenas.
    'billetera-mesa': `translate(${bx} ${n2(by - m.cae)}) rotate(${n2(-0.4 * m.cae)})`,
    vino: `rotate(${n2(m.vino)} ${munecaDibujada(0)[0]} ${n2(munecaDibujada(0)[1] - 12 - A.copa.tallo - A.copa.caliz * 0.45)})`,
  };
  // El hombro de la estola que va encima del brazo de la copa se mueve con la estola.
  transform.hombrera = transform.estola!;
  const b = brazos(m);
  for (const n of [0, 1] as const) {
    const [sx, sy] = A.hombros[n];
    const [ex, ey] = codoDibujado(n);
    const [wx, wy] = munecaDibujada(n);
    transform[`brazo-${n + 1}`] = `translate(0 ${n2(b[n].baja)}) rotate(${n2(b[n].brazo)} ${sx} ${sy})`;
    transform[`antebrazo-${n + 1}`] = `rotate(${n2(b[n].antebrazo)} ${ex} ${ey})`;
    transform[`mano-${n + 1}`] = `rotate(${n2(b[n].mano)} ${wx} ${wy})`;
    // El párpado baja desde el borde de arriba del ojo.
    const [ox, oy] = A.ojos[n];
    const top = oy - A.altoOjo - 0.6;
    transform[`parpado-${n + 1}`] = `translate(${ox} ${top}) scale(1 ${n2(Math.max(0.02, m.parpados[n]))}) translate(${-ox} ${-top})`;
  }
  const enMano = m.billetera === 'mano';
  const opacity: Record<string, string> = {
    sonrisa: n2(1 - m.risa),
    risa: n2(m.risa),
    plumas: n2(m.plumas),
    'garra-abierta': n2(1 - m.garra),
    'garra-cerrada': n2(m.garra),
    'billetera-mesa': enMano ? '0' : '1',
    'billetera-mano': enMano ? '1' : '0',
    'billetera-cerrada': n2(1 - m.abierta),
    'billetera-abierta': n2(m.abierta),
    billete: n2(m.billete),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba del peinado, en el recinto. */
export const VERSO: Punto = alRecinto([-6, -238]);
