/**
 * Los números del caníbal (`D-73`, decimoquinta vuelta): dónde se sienta en la mesa servida, cómo
 * está armado y cómo se pone. Los lee el dibujo (`arte-canibal.ts`), para la pose quieta que va en el
 * HTML y para el retrato, y la conducta (`scripts/bestiario/canibal.ts`), que se lleva esto y nada que
 * dibuje. Por eso la pose se calcula acá: la misma cuenta lo sienta sin JavaScript y con la isla.
 *
 * Dos sistemas de coordenadas:
 * - **El del títere**: el (0, 0) es el canto de atrás del tablero, debajo del medio del caníbal; arriba
 *   es negativo. Lo que baja de ahí lo tapa la mesa, así que nada de él baja, salvo los codos, las
 *   manos y los cubiertos, que están arriba del mantel. Se dibuja a esta medida y la escena lo achica
 *   con `CANIBAL.escala`.
 * - **El del recinto** (900 × 640): la mesa es la de `MESA` (`rig-entornos.ts`).
 */

import { MESA, OJOS_DE_LA_MESA } from './rig-entornos.ts';

export type Punto = readonly [number, number];

/**
 * Dónde se sienta: en la cabecera de la izquierda, en el lugar donde antes miraban sus ojos rojos
 * (`OJOS_DE_LA_MESA`), con la cintura en el canto de atrás del tablero. El plato que le sirvió la mesa
 * está ahí mismo, así que en el camino, corrido con `k`, sigue teniéndolo adelante.
 */
export const CANIBAL = {
  x: OJOS_DE_LA_MESA['el-canibal']![0],
  mesa: MESA.tablero.atras,
  escala: 0.5,
} as const;

/** Cómo está armado, en las coordenadas del títere. La mano 1 es la de la izquierda (el cuchillo), la 2 la del tenedor. */
export const CANIBAL_ARMADO = {
  /** De acá gira la cabeza: mira la ventana, olfatea, te mira. */
  cuello: [6, -64] as Punto,
  /**
   * La cabeza se dibuja a una medida y se achica desde el cuello: es chica para ese cuerpo, como la de
   * un gordo; dibujada entera a esa medida perdía los ojos y la boca.
   */
  cabeza: 0.86,
  /** Los hombros: de acá cuelga cada brazo, dibujado derecho para abajo hasta el codo. */
  hombros: [[-46, -52], [48, -52]] as readonly [Punto, Punto],
  /** El brazo, del hombro al codo; el antebrazo, del codo a la muñeca (dibujado derecho para arriba). */
  largos: { brazo: 60, antebrazo: 34 },
  /** Lo que sube el puño desde la muñeca: el medio del puño. */
  puno: 8,
  /** Lo que miden los cubiertos arriba del puño. */
  cuchillo: 50,
  tenedor: 44,
  /** Los ojos: el de la izquierda es el de cerca, el otro se achica hacia la nariz (está de tres cuartos). */
  ojos: [
    { centro: [5, -108] as Punto, radio: [6.2, 4] as Punto },
    { centro: [26, -110] as Punto, radio: [4.6, 3.6] as Punto },
  ],
  /** La boca cerrada, donde se abre la sonrisa y por donde pasa la lengua. */
  boca: [30, -82] as Punto,
  /** La punta de la nariz, la que olfatea. */
  nariz: [46, -95] as Punto,
  /** Dónde se paran las moscas: la pelada, la mancha de salsa de la servilleta y la oreja. */
  pelada: [-4, -142] as Punto,
  mancha: [-8, -38] as Punto,
  oreja: [-17, -102] as Punto,
} as const;

/* ------------------------------------------------------------------
   Las cuentas: del títere al recinto, girar, y el brazo que alcanza
   ------------------------------------------------------------------ */

/** Un punto del títere, llevado al recinto. */
export const alRecinto = ([x, y]: Punto): Punto => [CANIBAL.x + x * CANIBAL.escala, CANIBAL.mesa + y * CANIBAL.escala];

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
  const [sx, sy] = CANIBAL_ARMADO.hombros[n];
  return [sx, sy + CANIBAL_ARMADO.largos.brazo];
};
export const munecaDibujada = (n: 0 | 1): Punto => {
  const [ex, ey] = codoDibujado(n);
  return [ex, ey - CANIBAL_ARMADO.largos.antebrazo];
};

/**
 * Un brazo de dos tramos que lleva la muñeca a `meta`: el codo sale para afuera y para abajo, que es
 * apoyado en la mesa. Devuelve cuánto gira el brazo en el hombro, cuánto el antebrazo en el codo
 * (adentro del brazo), y dónde quedaron el codo y la muñeca de verdad.
 */
export function alcanzar(n: 0 | 1, meta: Punto, alza = 0): { brazo: number; antebrazo: number; codo: Punto; muneca: Punto } {
  const [sx, sy0] = CANIBAL_ARMADO.hombros[n];
  const sy = sy0 - alza;
  const { brazo: l1, antebrazo: l2 } = CANIBAL_ARMADO.largos;
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
  // El codo va para afuera y para abajo: el que más se aleja del medio, y que no suba.
  const cuanto = ([x, y]: Punto): number => x * afuera + y * 0.6;
  const codo = cuanto(codos[0]!) >= cuanto(codos[1]!) ? codos[0]! : codos[1]!;
  const brazo = vuelta(grados([codo[0] - sx, codo[1] - sy]) - 90);
  const antebrazo = vuelta(grados([meta[0] - codo[0], meta[1] - codo[1]]) + 90 - brazo);
  const hasta = Math.hypot(meta[0] - codo[0], meta[1] - codo[1]) || 1;
  const muneca: Punto = [codo[0] + ((meta[0] - codo[0]) / hasta) * l2, codo[1] + ((meta[1] - codo[1]) / hasta) * l2];
  return { brazo, antebrazo, codo, muneca };
}

/* ------------------------------------------------------------------
   La pose: lo que la isla escribe en cada pieza
   ------------------------------------------------------------------ */

/** Una mano: dónde va la muñeca y cuánto se tuercen los cubiertos (0 es parado, positivo para la derecha). */
export interface Mano {
  muneca: Punto;
  giro: number;
}

/**
 * Lo que hace con todo el cuerpo: cuánto gira la cabeza (negativo es para arriba, porque mira a la
 * derecha), adónde miran las pupilas (de -1 a 1), cuánto bajan los párpados, si pela los dientes,
 * dónde va la punta de la lengua (`lengua` de -1 a 1, y `relame` cuánto se ve), cuánto aire tiene en
 * el pecho y dónde tiene cada mano.
 */
export interface Gesto {
  cabeza: number;
  mira: Punto;
  parpados: readonly [number, number];
  mueca: number;
  lengua: number;
  relame: number;
  respira: number;
  manos: readonly [Mano, Mano];
}

/** Las manos quietas: los codos en la mesa y los cubiertos parados, abiertos apenas, como dos cetros. */
export const MANOS_QUIETAS: readonly [Mano, Mano] = [
  { muneca: [-45, -26], giro: -7 },
  { muneca: [47, -26], giro: 8 },
];

/**
 * Las manos afilando: el cuchillo cruzado sobre el tenedor delante de la servilleta. El cuchillo va y
 * viene por su filo (`FILO`), y la cuenta del brazo lo sigue.
 */
export const MANOS_AFILA: readonly [Mano, Mano] = [
  { muneca: [-16, -18], giro: 52 },
  { muneca: [34, -20], giro: -28 },
];
/** Para dónde va el cuchillo cuando afila: a lo largo de su hoja. */
export const FILO: Punto = [Math.sin((52 * Math.PI) / 180), -Math.cos((52 * Math.PI) / 180)];

/** Hacia dónde está la ventana, mirando desde los ojos: arriba a la derecha, por encima de la mesa. */
export const VENTANA: Punto = [(MESA.ventana.x0 + MESA.ventana.x1) / 2, (MESA.ventana.arriba + MESA.ventana.abajo) / 2];

/** Los gestos quietos: mira por la ventana para el lado de la pastura; o te pela los dientes, afilando. */
export const GESTOS: Readonly<Record<'ventana' | 'afila', Gesto>> = {
  ventana: { cabeza: -5, mira: [0.85, -0.6], parpados: [0.4, 0.44], mueca: 0, lengua: 0, relame: 0, respira: 0, manos: MANOS_QUIETAS },
  afila: { cabeza: 2, mira: [-0.7, 0.1], parpados: [0.18, 0.22], mueca: 1, lengua: 0, relame: 0, respira: 0, manos: MANOS_AFILA },
};

/** Las miradas de la conducta, con la cabeza y los ojos: la ventana, vos, el plato vacío, los cubiertos. */
export const MIRADAS: Readonly<Record<'ventana' | 'vos' | 'plato' | 'olfatea', { cabeza: number; mira: Punto; parpados: readonly [number, number] }>> = {
  ventana: GESTOS.ventana,
  vos: { cabeza: 0, mira: [-0.75, 0.15], parpados: [0.3, 0.34] },
  plato: { cabeza: 6, mira: [-0.2, 1], parpados: [0.55, 0.58] },
  olfatea: { cabeza: -12, mira: [0.6, -0.9], parpados: [0.85, 0.88] },
};

/** Cuánto se corre la pupila adentro del blanco, en el títere. */
export const MIRA = [2.6, 1.6] as const;

/** De dónde baja cada párpado: el borde de arriba del ojo. */
export const PIVOTES_PARPADO: readonly Punto[] = CANIBAL_ARMADO.ojos.map(({ centro: [cx, cy], radio: [, ry] }) => [cx, Math.round((cy - ry - 0.6) * 10) / 10] as const);

/** Lo que sube algo que está a la altura `y` cuando el pecho se llena (el pecho crece desde la mesa). */
export const alzaDe = (y: number, respira: number): number => -y * respira;

/** Dónde queda un punto de la cabeza con el gesto puesto (se achica y gira en el cuello, y sube con el pecho). */
export function enLaCabeza([px, py]: Punto, g: Pick<Gesto, 'cabeza' | 'respira'>): Punto {
  const [nx, ny] = CANIBAL_ARMADO.cuello;
  const k = CANIBAL_ARMADO.cabeza;
  const [x, y] = rot([nx + (px - nx) * k, ny + (py - ny) * k], CANIBAL_ARMADO.cuello, g.cabeza);
  return [x, y - alzaDe(ny, g.respira)];
}

/** Dónde queda un punto del pecho (la servilleta) con el aire puesto. */
export const enElPecho = ([x, y]: Punto, respira: number): Punto => [x, y * (1 + respira)];

/**
 * La pose de los dos brazos para unas manos, con el pecho que sube los hombros. Cuando se llena de
 * aire, los puños suben con él: si no, el brazo se estira y el codo se va de la mesa.
 */
export function brazos(manos: readonly [Mano, Mano], respira = 0) {
  return manos.map((m, i) => {
    const n = i as 0 | 1;
    const alza = alzaDe(CANIBAL_ARMADO.hombros[n][1], respira);
    const r = alcanzar(n, [m.muneca[0], m.muneca[1] - alza], alza);
    return { ...r, mano: vuelta(m.giro - r.brazo - r.antebrazo), alza };
  }) as unknown as readonly [ReturnType<typeof alcanzar> & { mano: number; alza: number }, ReturnType<typeof alcanzar> & { mano: number; alza: number }];
}

/** Dónde queda la punta de un cubierto (y el medio del puño) con la mano puesta. */
export function puntaDe(m: Mano, n: 0 | 1): { puno: Punto; punta: Punto } {
  const largo = n === 0 ? CANIBAL_ARMADO.cuchillo : CANIBAL_ARMADO.tenedor;
  const puno = rot([m.muneca[0], m.muneca[1] - CANIBAL_ARMADO.puno], m.muneca, m.giro);
  const punta = rot([m.muneca[0], m.muneca[1] - CANIBAL_ARMADO.puno - 8 - largo], m.muneca, m.giro);
  return { puno, punta };
}

const n2 = (v: number): string => v.toFixed(2);

/**
 * Las transformaciones de cada parte de la página para un gesto: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function transformes(g: Gesto): Record<string, string> {
  const A = CANIBAL_ARMADO;
  const [nx, ny] = A.cuello;
  const t: Record<string, string> = {
    entero: `translate(${CANIBAL.x} ${CANIBAL.mesa}) scale(${CANIBAL.escala})`,
    torso: `scale(1 ${(1 + g.respira).toFixed(4)})`,
    cabeza: `translate(0 ${n2(-alzaDe(ny, g.respira))}) rotate(${n2(g.cabeza)} ${nx} ${ny}) translate(${nx} ${ny}) scale(${A.cabeza}) translate(${-nx} ${-ny})`,
    mueca: n2(g.mueca),
    lengua: `translate(${n2(g.lengua * 7)} 0)`,
    relame: n2(g.relame),
  };
  const b = brazos(g.manos, g.respira);
  for (const n of [0, 1] as const) {
    const [sx, sy] = A.hombros[n];
    const [ex, ey] = codoDibujado(n);
    const [wx, wy] = munecaDibujada(n);
    t[`brazo-${n + 1}`] = `translate(0 ${n2(-b[n].alza)}) rotate(${n2(b[n].brazo)} ${sx} ${sy})`;
    t[`antebrazo-${n + 1}`] = `rotate(${n2(b[n].antebrazo)} ${ex} ${ey})`;
    t[`mano-${n + 1}`] = `rotate(${n2(b[n].mano)} ${wx} ${wy})`;
    t[`pupila-${n + 1}`] = `translate(${n2(g.mira[0] * MIRA[0])} ${n2(g.mira[1] * MIRA[1])})`;
    const [px, py] = PIVOTES_PARPADO[n]!;
    t[`parpado-${n + 1}`] = `translate(${px} ${py}) scale(1 ${n2(g.parpados[n]!)}) translate(${-px} ${-py})`;
  }
  return t;
}

/* ------------------------------------------------------------------
   Las moscas, y dónde dice su verso
   ------------------------------------------------------------------ */

/** Dónde se posa una mosca: en qué parte (se mueve con ella), el punto, y hacia dónde mira. */
export interface Posada {
  en: 'cabeza' | 'pecho' | 'aire';
  punto: Punto;
  giro: number;
}

/** Los lugares donde se posan: lo prefieren a él. La pelada, la mancha de salsa, la oreja, la punta del cuchillo. */
export const POSADAS: readonly Posada[] = [
  { en: 'cabeza', punto: CANIBAL_ARMADO.pelada, giro: -20 },
  { en: 'pecho', punto: CANIBAL_ARMADO.mancha, giro: 35 },
  { en: 'cabeza', punto: CANIBAL_ARMADO.oreja, giro: -70 },
  { en: 'cabeza', punto: [20, -132], giro: 15 },
  { en: 'pecho', punto: [16, -22], giro: -40 },
];

/** Las tres moscas en la pose quieta: una en la pelada, otra en la salsa, y la tercera dando vueltas al lado de la oreja. */
export const MOSCAS_QUIETAS: readonly Posada[] = [POSADAS[0]!, POSADAS[1]!, { en: 'aire', punto: [-60, -122], giro: 10 }];

/** Dónde queda una mosca posada, con el gesto puesto. */
export function dondeVa(p: Posada, g: Pick<Gesto, 'cabeza' | 'respira'>): Punto {
  if (p.en === 'cabeza') return enLaCabeza(p.punto, g);
  if (p.en === 'pecho') return enElPecho(p.punto, g.respira);
  return p.punto;
}

/** La transformación de una mosca en un punto, girada. */
export const moscaEn = ([x, y]: Punto, giro: number): string => `translate(${n2(x)} ${n2(y)}) rotate(${n2(giro)})`;

/** Dónde dice su verso: arriba de la pelada, debajo de los recortes de la pared. */
export const VERSO: Punto = alRecinto([4, -190]);
