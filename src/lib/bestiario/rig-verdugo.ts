/**
 * Los números del verdugo que cena distinguido (`D-73`, decimoctava vuelta): dónde se sienta en la mesa
 * servida, cómo está armado y cómo se pone. Los lee el dibujo (`arte-verdugo.ts`), para la pose quieta
 * del HTML y para el retrato, y la conducta (`scripts/bestiario/verdugo.ts`), que se lleva esto y nada
 * que dibuje. La misma cuenta lo sienta sin JavaScript y con la isla.
 *
 * Dos sistemas de coordenadas, como el caníbal de la otra punta (`rig-canibal.ts`):
 * - **El del títere**: el (0, 0) es el canto de atrás del tablero, debajo del medio del verdugo; arriba
 *   es negativo. Nada de él baja de ahí, salvo las manos cuando pinchan el plato. Está dibujado a dos
 *   veces y la escena lo achica con `VERDUGO.escala`.
 * - **El del recinto** (900 × 640): la mesa de `MESA` (`rig-entornos.ts`).
 */

import { MESA, OJOS_DE_LA_MESA } from './rig-entornos.ts';

export type Punto = readonly [number, number];

/**
 * Dónde se sienta: en la otra punta de la mesa, donde miraban sus ojos (`OJOS_DE_LA_MESA`), con la
 * cintura en el canto de atrás del tablero. El plato que le sirvió la mesa queda adelante suyo.
 */
export const VERDUGO = {
  x: OJOS_DE_LA_MESA['el-verdugo-que-cena']![0],
  mesa: MESA.tablero.atras,
  escala: 0.5,
} as const;

/** Cómo está armado, en las coordenadas del títere. La mano 1 es la de la izquierda (la copa), la 2 la del tenedor. */
export const VERDUGO_ARMADO = {
  /** De acá gira la cabeza, con la capucha entera. */
  cuello: [0, -124] as Punto,
  /** Los hombros: de acá cuelga cada brazo, dibujado derecho para abajo hasta el codo. */
  hombros: [[-40, -110], [40, -110]] as readonly [Punto, Punto],
  /** El brazo, del hombro al codo; el antebrazo, del codo a la muñeca (dibujado derecho para arriba). */
  largos: { brazo: 54, antebrazo: 46 },
  /** Lo que sube el puño enguantado desde la muñeca. */
  puno: 7,
  /** Los dos agujeros de la capucha, y lo que se ve adentro: dos puntos al rojo. */
  ojos: [
    { centro: [-11, -168] as Punto, radio: [6.4, 3.6] as Punto },
    { centro: [11, -168] as Punto, radio: [6.4, 3.6] as Punto },
  ],
  /** El faldón de la capucha, que se levanta para comer: de dónde cuelga y hasta dónde llega. */
  babero: { arriba: -153, abajo: -121, ancho: 25 },
  /** La boca, debajo del faldón: adonde van el tenedor y la copa. */
  boca: [0, -138] as Punto,
  /** La copa, en la mano 1: el pie, el tallo y el cáliz, contados desde el puño para arriba. */
  copa: { tallo: 14, caliz: 16, radio: 9.5 },
  /** El tenedor, en la mano 2: lo que mide arriba del puño. */
  tenedor: 30,
  /** El hacha, apoyada en la silla: el pie, contra el canto de la mesa, y la cabeza. */
  hacha: { pie: [68, -2] as Punto, cabeza: [82, -170] as Punto },
  /** El bocado, en el plato (debajo del canto de la mesa, que es donde está el plato). */
  plato: [8, 22] as Punto,
} as const;

/* ------------------------------------------------------------------
   Las cuentas: del títere al recinto, girar, y el brazo que alcanza
   ------------------------------------------------------------------ */

/** Un punto del títere, llevado al recinto. */
export const alRecinto = ([x, y]: Punto): Punto => [VERDUGO.x + x * VERDUGO.escala, VERDUGO.mesa + y * VERDUGO.escala];

/** Gira `p` alrededor de `c`, en grados (positivo es como las agujas, como en SVG). */
export function rot([x, y]: Punto, [cx, cy]: Punto, grados: number): Punto {
  const a = (grados * Math.PI) / 180;
  const [dx, dy] = [x - cx, y - cy];
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
}

const grados = ([x, y]: Punto): number => (Math.atan2(y, x) * 180) / Math.PI;
const vuelta = (a: number): number => ((((a + 180) % 360) + 360) % 360) - 180;

/** El codo y la muñeca como se dibujan: el brazo derecho para abajo, el antebrazo derecho para arriba. */
export const codoDibujado = (n: 0 | 1): Punto => {
  const [sx, sy] = VERDUGO_ARMADO.hombros[n];
  return [sx, sy + VERDUGO_ARMADO.largos.brazo];
};
export const munecaDibujada = (n: 0 | 1): Punto => {
  const [ex, ey] = codoDibujado(n);
  return [ex, ey - VERDUGO_ARMADO.largos.antebrazo];
};

/**
 * Un brazo de dos tramos que lleva la muñeca a `meta`. Tiene buenos modales: el codo va pegado al
 * cuerpo y para abajo, nunca apoyado en la mesa. Devuelve cuánto gira el brazo en el hombro, cuánto el
 * antebrazo en el codo (adentro del brazo), y dónde quedaron el codo y la muñeca de verdad.
 */
export function alcanzar(n: 0 | 1, meta: Punto, alza = 0): { brazo: number; antebrazo: number; codo: Punto; muneca: Punto } {
  const [sx, sy0] = VERDUGO_ARMADO.hombros[n];
  const sy = sy0 - alza;
  const { brazo: l1, antebrazo: l2 } = VERDUGO_ARMADO.largos;
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
  // El codo, abajo y apenas para afuera: el que más baja, con un poco de afuera.
  const cuanto = ([x, y]: Punto): number => y + x * afuera * 0.2;
  const codo = cuanto(codos[0]!) >= cuanto(codos[1]!) ? codos[0]! : codos[1]!;
  const brazo = vuelta(grados([codo[0] - sx, codo[1] - sy]) - 90);
  const antebrazo = vuelta(grados([meta[0] - codo[0], meta[1] - codo[1]]) + 90 - brazo);
  const hasta = Math.hypot(meta[0] - codo[0], meta[1] - codo[1]) || 1;
  const muneca: Punto = [codo[0] + ((meta[0] - codo[0]) / hasta) * l2, codo[1] + ((meta[1] - codo[1]) / hasta) * l2];
  return { brazo, antebrazo, codo, muneca };
}

/* ------------------------------------------------------------------
   El gesto: lo que la conducta decide en cada cuadro
   ------------------------------------------------------------------ */

/** Una mano: dónde va la muñeca y cuánto se tuerce lo que tiene (0 es parado, positivo para la derecha). */
export interface Mano {
  muneca: Punto;
  giro: number;
}

/**
 * Lo que hace con todo el cuerpo: cuánto gira la cabeza, adónde miran los dos puntos rojos (de -1 a 1),
 * cuánto se le levanta el faldón (0 tapado, 1 arriba), cuánto aire tiene, la risa (el temblor de la
 * capucha, de 0 a 1), dónde está el bocado, cuánto vino queda, el brillo del filo del hacha y las manos.
 */
export interface Gesto {
  cabeza: number;
  mira: Punto;
  babero: number;
  respira: number;
  risa: number;
  bocado: 'plato' | 'tenedor' | 'nada';
  vino: number;
  filo: number;
  manos: readonly [Mano, Mano];
}

/** Las manos quietas: la copa a la altura del pecho, el meñique parado; el tenedor descansa al lado del plato. */
export const MANOS_QUIETAS: readonly [Mano, Mano] = [
  { muneca: [-30, -58], giro: -4 },
  { muneca: [34, -22], giro: 18 },
];

/** *"Brinda por tu suerte"*: la copa en alto, para el lado de quien mira. */
export const MANOS_BRINDA: readonly [Mano, Mano] = [
  { muneca: [-62, -150], giro: -24 },
  { muneca: [34, -22], giro: 18 },
];

/** Las manos a la boca: con el tenedor, o con la copa. */
export const A_LA_BOCA = {
  tenedor: { muneca: [15, -98], giro: -20 } as Mano,
  copa: { muneca: [-21, -100], giro: 30 } as Mano,
  /** Pinchando el plato, que está debajo del canto de la mesa. */
  plato: { muneca: [2, -22], giro: 172 } as Mano,
} as const;

/** Los gestos quietos: el de siempre, con la copa en la mano; y el brindis. */
export const GESTOS: Readonly<Record<'quieto' | 'brinda', Gesto>> = {
  quieto: { cabeza: -4, mira: [-0.6, 0.25], babero: 0, respira: 0, risa: 0, bocado: 'plato', vino: 1, filo: 0, manos: MANOS_QUIETAS },
  brinda: { cabeza: -9, mira: [-0.9, 0.5], babero: 0, respira: 0.02, risa: 0, bocado: 'plato', vino: 1, filo: 1, manos: MANOS_BRINDA },
};

/** Cuánto se corren los puntos rojos adentro de cada agujero. */
export const MIRA = [2.4, 0.9] as const;

/** Lo que sube algo que está a la altura `y` cuando el pecho se llena (el pecho crece desde la mesa). */
export const alzaDe = (y: number, respira: number): number => -y * respira;

/** Lo que tiembla la cabeza cuando se ríe: arriba y abajo, de a sacudones. */
export const sacudon = (risa: number): number => -risa * 3.2;

/** Dónde queda un punto de la cabeza con el gesto puesto (gira en el cuello y sube con el pecho y la risa). */
export function enLaCabeza(p: Punto, g: Pick<Gesto, 'cabeza' | 'respira' | 'risa'>): Punto {
  const [x, y] = rot(p, VERDUGO_ARMADO.cuello, g.cabeza);
  return [x, y - alzaDe(VERDUGO_ARMADO.cuello[1], g.respira) + sacudon(g.risa)];
}

/**
 * La pose de los dos brazos para unas manos, con el pecho que sube los hombros. Cuando se llena de aire,
 * los puños suben con él.
 */
export function brazos(manos: readonly [Mano, Mano], respira = 0) {
  return manos.map((m, i) => {
    const n = i as 0 | 1;
    const alza = alzaDe(VERDUGO_ARMADO.hombros[n][1], respira);
    const r = alcanzar(n, [m.muneca[0], m.muneca[1] - alza], alza);
    return { ...r, mano: vuelta(m.giro - r.brazo - r.antebrazo), alza };
  }) as unknown as readonly [ReturnType<typeof alcanzar> & { mano: number; alza: number }, ReturnType<typeof alcanzar> & { mano: number; alza: number }];
}

/** Dónde queda el borde de la copa (o la punta del tenedor) con la mano puesta. */
export function puntaDe(m: Mano, n: 0 | 1): Punto {
  const A = VERDUGO_ARMADO;
  const largo = n === 0 ? A.copa.tallo + A.copa.caliz : A.tenedor;
  return rot([m.muneca[0], m.muneca[1] - A.puno - 6 - largo], m.muneca, m.giro);
}

const n2 = (v: number): string => v.toFixed(2);

/**
 * Las transformaciones y las opacidades de cada parte para un gesto: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(g: Gesto): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = VERDUGO_ARMADO;
  const [nx, ny] = A.cuello;
  const { arriba } = A.babero;
  const transform: Record<string, string> = {
    entero: `translate(${VERDUGO.x} ${VERDUGO.mesa}) scale(${VERDUGO.escala})`,
    torso: `scale(1 ${(1 + g.respira).toFixed(4)})`,
    cabeza: `translate(0 ${n2(-alzaDe(ny, g.respira) + sacudon(g.risa))}) rotate(${n2(g.cabeza)} ${nx} ${ny})`,
    // El faldón se recoge para arriba, como una cortina: se achica desde donde cuelga.
    babero: `translate(0 ${arriba}) scale(1 ${n2(1 - 0.78 * g.babero)}) translate(0 ${-arriba})`,
    vino: `translate(0 ${n2((1 - g.vino) * A.copa.caliz * 0.8)}) scale(1 ${n2(Math.max(0.02, g.vino))})`,
  };
  const b = brazos(g.manos, g.respira);
  for (const n of [0, 1] as const) {
    const [sx, sy] = A.hombros[n];
    const [ex, ey] = codoDibujado(n);
    const [wx, wy] = munecaDibujada(n);
    transform[`brazo-${n + 1}`] = `translate(0 ${n2(-b[n].alza)}) rotate(${n2(b[n].brazo)} ${sx} ${sy})`;
    transform[`antebrazo-${n + 1}`] = `rotate(${n2(b[n].antebrazo)} ${ex} ${ey})`;
    transform[`mano-${n + 1}`] = `rotate(${n2(b[n].mano)} ${wx} ${wy})`;
    // Los puntos rojos: miran juntos, y con la risa se achinan.
    transform[`ojo-${n + 1}`] = `translate(${n2(g.mira[0] * MIRA[0])} ${n2(g.mira[1] * MIRA[1])})`;
  }
  const opacity: Record<string, string> = {
    'bocado-plato': g.bocado === 'plato' ? '1' : '0',
    'bocado-tenedor': g.bocado === 'tenedor' ? '1' : '0',
    filo: n2(g.filo),
    risa: n2(g.risa),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la capucha, sin taparle la cara a la tipa rapaz. */
export const VERSO: Punto = [VERDUGO.x - 30, VERDUGO.mesa - 128];
