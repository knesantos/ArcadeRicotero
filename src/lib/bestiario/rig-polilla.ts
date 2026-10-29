/**
 * Los números de la polilla (`D-73`, vigesimocuarta vuelta): de qué foco de la guirnalda del templo de
 * Momo se cuelga, cómo está armada, por dónde da vueltas alrededor de la luz y dónde se da los golpes. Los
 * lee el dibujo (`arte-polilla.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/polilla.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de la polilla**: el (0, 0) es el medio del tórax, donde se pegan las alas; arriba es negativo. Está
 *   de frente, colgada del cable de la guirnalda con las dos patas de adelante, como del pasamanos de un
 *   colectivo. Está dibujada a dos veces, y la escena la achica con `POLILLA.escala`.
 * - **El del recinto** (el templo agrandado, de −300 a 1200): el foco es uno de los que pinta el fondo, el
 *   cuarto del tramo de la derecha de la guirnalda de arriba (`FOCOS_TEMPLO`), a la derecha de Momo y arriba
 *   del Morta. La polilla trae su propia lamparita, encima de la pintada, para poder hamacarla.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde cuelga, en el recinto: el medio del tórax, colgada del cable a la derecha del foco. Y lo que mide. */
export const POLILLA = { x: 668, y: 166, escala: 0.45 } as const;

/**
 * El foco: el del fondo pintado (`FOCOS_TEMPLO[10]`, el cable en 600, 132). `cuelga` es de donde se hamaca,
 * `centro` es el medio del vidrio y `radio` lo que mide el vidrio. `contacto` es a qué distancia del vidrio
 * queda el medio de la polilla cuando se da el golpe.
 */
export const FOCO = { cuelga: [600, 129] as Punto, centro: [600, 145] as Punto, radio: 7, contacto: 24 } as const;

/** Cómo está armada, en las coordenadas de la polilla. La 1 es la izquierda de quien mira. */
export const POLILLA_ARMADO = {
  /** De acá se ladea entera en el vuelo. */
  centro: [0, 0] as Punto,
  /** Donde se pegan las alas de adelante y las de atrás. */
  hombros: [[-9, -7], [9, -7]] as readonly [Punto, Punto],
  caderas: [[-7, 8], [7, 8]] as readonly [Punto, Punto],
  /** La cintura: de acá cuelga la panza, y respira. */
  cintura: [0, 13] as Punto,
  /** El cuello, de donde se ladea la cabeza, y el medio de la cabeza peluda. */
  cuello: [0, -20] as Punto,
  cabeza: [0, -33] as Punto,
  radioCabeza: 15,
  /** Los ojos, a los costados de la cabeza como los de toda polilla, y su radio. */
  ojos: [[-9.5, -35], [9.5, -35]] as readonly [Punto, Punto],
  radioOjo: 6.4,
  /** De donde salen las antenas de pluma. */
  antenas: [[-5, -46], [5, -46]] as readonly [Punto, Punto],
  /** Las patas de adelante: de dónde salen y dónde agarran el cable. */
  patas: [[-9, -15], [9, -15]] as readonly [Punto, Punto],
  agarre: [[-24, -58], [24, -58]] as readonly [Punto, Punto],
  /** El lentejuelón de la murga, pegado en el pecho. */
  lentejuela: [0, -3] as Punto,
  /** La trompa enrollada, abajo de la cabeza. */
  trompa: [0, -19] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Dónde está el medio del tórax, en el recinto, y lo que se ladea entera (grados). */
  donde: Punto;
  ladeo: number;
  /** Lo abiertas que están las alas (1 planas, 0 cerradas para abajo, como un tapado) y lo que suben (grados). */
  alas: number;
  aleteo: number;
  /** Las antenas (grados, positivo para afuera) y la cabeza ladeada (grados). */
  antenas: readonly [number, number];
  cabeza: number;
  /** Los párpados peludos: 0 abiertos, 1 cerrados. */
  parpados: readonly [number, number];
  /** Los ojos de mareo: cuánto se ven (0 a 1) y lo que giran (grados). */
  mareo: number;
  giroMareo: number;
  /** La respiración (de −1 a 1) y lo que se hamaca la panza (grados). */
  respira: number;
  panza: number;
  /** Las patas de adelante, desde el agarre (grados, positivo para afuera), y las otras cuatro (grados). */
  patas: readonly [number, number];
  cuelga: number;
  /** La lamparita: lo que se hamaca (grados), lo que alumbra el halo (0 a 1) y el chispazo del golpe (0 a 1). */
  foco: number;
  brillo: number;
  golpe: number;
  /** Las cuatro motas de polvo que se le caen de las alas, en el recinto: x, y y cuánto se ven. */
  polvo: ReadonlyArray<readonly [number, number, number]>;
}

const SIN_POLVO: ReadonlyArray<readonly [number, number, number]> = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];

/**
 * La pose quieta, la del HTML: colgada del cable con las dos patas de adelante, las alas abiertas y quietas
 * mostrando las estampitas, los ojos entornados, como dormida. Al lado de la luz, sin tocarla.
 */
export const QUIETO: Momento = {
  donde: [POLILLA.x, POLILLA.y],
  ladeo: 0,
  alas: 0.94,
  aleteo: 6,
  antenas: [0, 0],
  cabeza: 0,
  parpados: [0.3, 0.3],
  mareo: 0,
  giroMareo: 0,
  respira: 0,
  panza: 0,
  patas: [0, 0],
  cuelga: 0,
  foco: 0,
  brillo: 0.7,
  golpe: 0,
  polvo: SIN_POLVO,
};

/** Las patas de adelante, sueltas del cable: recogidas contra el pecho para volar. */
export const SUELTAS = 128;

/** Un punto pegado al vidrio, del lado de donde viene, a la distancia del golpe. */
export function contraElVidrio(desde: Punto, extra = 0): Punto {
  const [fx, fy] = FOCO.centro;
  const [dx, dy] = [desde[0] - fx, desde[1] - fy];
  const l = Math.hypot(dx, dy) || 1;
  return [fx + (dx / l) * (FOCO.contacto + extra), fy + (dy / l) * (FOCO.contacto + extra)];
}

/**
 * *"Otra polilla en busca de la luz"*: pegada al vidrio, con las alas para arriba, las antenas tiradas
 * contra la luz, el chispazo y el polvo en el aire. Es el toque quieto y el retrato.
 */
export const INSISTE: Momento = {
  ...QUIETO,
  donde: contraElVidrio([POLILLA.x, POLILLA.y], 2),
  ladeo: -16,
  alas: 0.82,
  aleteo: 34,
  antenas: [-34, 22],
  cabeza: -10,
  parpados: [0, 0],
  patas: [SUELTAS * 0.55, SUELTAS * 0.4],
  cuelga: 14,
  foco: -9,
  brillo: 1,
  golpe: 1,
  polvo: [[628, 176, 0.9], [606, 190, 0.75], [640, 204, 0.6], [618, 222, 0.45]],
};

/* ------------------------------------------------------------------
   La ronda alrededor de la luz
   ------------------------------------------------------------------ */

const suaveP = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const rampaP = (u: number, a: number, b: number): number => suaveP((u - a) / (b - a));
const lomaP = (u: number, a: number, b: number, c: number, d: number): number => rampaP(u, a, b) * (1 - rampaP(u, c, d));

/** Cuánto dura una ronda, en segundos, y cuándo se da los golpes contra el vidrio (más un corrimiento por vez). */
export const RONDA = { dura: 6.4, golpes: [1.7, 3.35, 4.75] as readonly number[] } as const;

/** Los golpes de una ronda, para una `fase` de 0 a 1: no se los da siempre en el mismo segundo. */
export const golpesDeLaRonda = (fase: number): number[] => RONDA.golpes.map((h, i) => h + (i === 1 ? 0.35 : 0.25) * (fase - 0.5));

/** Un tirón: el envión de golpe y después se le va. */
const tiron = (t: number): number => (t <= 0 ? 0 : t < 0.07 ? t / 0.07 : Math.exp(-(t - 0.07) / 0.28));
const TIRONES: ReadonlyArray<readonly [number, number, number]> = [[0.95, 14, -9], [2.45, -12, 7], [3.95, 6, 13], [5.25, -13, -5]];

/**
 * Dónde está en la ronda a los `u` segundos: suelta el cable, cae un poco, agarra vuelo y gira alrededor de
 * la luz con un radio que va y viene, a tirones y temblando, y se da contra el vidrio en cada golpe. Al final
 * vuelve al cable. `lado` es para dónde gira; `fase` corre los golpes y la forma de las vueltas.
 */
export function enLaRonda(u: number, lado: 1 | -1, fase: number): Punto {
  const [fx, fy] = FOCO.centro;
  const R: Punto = [POLILLA.x, POLILLA.y];
  const golpes = golpesDeLaRonda(fase);
  // El ángulo arranca del lado de donde sale, y gira de a saltos.
  const a0 = Math.atan2(R[1] - fy, R[0] - fx);
  const a = a0 + lado * (Math.PI * 0.95 * u + 0.8 * Math.sin(1.9 * u + 6 * fase) - 0.8 * Math.sin(6 * fase) + 0.35 * Math.sin(4.3 * u));
  let r = 46 + 16 * Math.sin(1.3 * u + 5 * fase) + 7 * Math.sin(3.1 * u);
  for (const h of golpes) {
    const g = rampaP(u, h - 0.42, h) * (1 - rampaP(u, h, h + 0.16));
    r = r + (FOCO.contacto - r) * g + 20 * lomaP(u, h, h + 0.1, h + 0.18, h + 0.55);
  }
  let x = fx + r * Math.cos(a);
  let y = fy + 0.72 * r * Math.sin(a);
  // El temblor de vuelo de polilla, que se apaga cerca del vidrio para que el golpe sea golpe.
  const cerca = golpes.reduce((s, h) => Math.max(s, lomaP(u, h - 0.3, h - 0.08, h + 0.04, h + 0.2)), 0);
  x += (1 - cerca) * (3 * Math.sin(13 * u) + 2 * Math.sin(23 * u + 1));
  y += (1 - cerca) * (3 * Math.sin(17 * u + 2) + 1.5 * Math.sin(29 * u));
  for (const [t, dx, dy] of TIRONES) {
    const k = tiron(u - t - 0.2 * fase) * (1 - cerca);
    x += lado * dx * k;
    y += dy * k;
  }
  // Suelta el cable y cae un poco antes de agarrar vuelo; al final vuelve a colgarse.
  const sale = rampaP(u, 0.1, 0.85);
  const llega = rampaP(u, RONDA.dura - 1, RONDA.dura - 0.1);
  const cae = 12 * lomaP(u, 0, 0.12, 0.25, 0.6);
  const px = R[0] + (x - R[0]) * sale;
  const py = R[1] + cae + (y - R[1]) * sale;
  return afueraDelVidrio([px + (R[0] - px) * llega, py + (R[1] - py) * llega]);
}

/** El vidrio no se atraviesa: lo que quede más cerca que el golpe, se empuja para afuera. */
function afueraDelVidrio([x, y]: Punto): Punto {
  const [fx, fy] = FOCO.centro;
  const d = Math.hypot(x - fx, y - fy);
  if (d >= FOCO.contacto) return [x, y];
  if (d < 1e-6) return [fx + FOCO.contacto, fy];
  return [fx + ((x - fx) / d) * FOCO.contacto, fy + ((y - fy) / d) * FOCO.contacto];
}

/* ------------------------------------------------------------------
   El toque: va derecho a la luz, se da el golpe, queda mareada e insiste
   ------------------------------------------------------------------ */

/** Los tiempos del toque, en segundos: para el test y para la conducta. */
export const TOQUE_T = {
  suelta: [0, 0.5],
  va: [0.5, 1.3],
  golpe: 1.3,
  rebota: [1.3, 1.95],
  mareada: [1.95, 4.5],
  sacude: [4.4, 5.05],
  vuelve: [5.05, 5.75],
  golpe2: 5.75,
  rebota2: [5.75, 6.2],
  posa: [6.2, 7.4],
  dura: 7.8,
} as const;

/** Adonde la tira el golpe: abajo y a la derecha del foco, lejos de Momo. Ahí queda mareada. */
export const MAREO: Punto = [652, 212];

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto, donde: Punto = [POLILLA.x, POLILLA.y]): Punto => [donde[0] + x * POLILLA.escala, donde[1] + y * POLILLA.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = POLILLA_ARMADO;
  const [wx, wy] = A.cintura;
  const [nx, ny] = A.cuello;
  // Las alas: cerradas se le caen a los costados de la panza, como un tapado sobre los hombros; abiertas, planas.
  const cerradas = 1 - Math.max(0, Math.min(1, m.alas));
  const abre = 1 - 0.68 * cerradas;
  const sube = m.aleteo - 58 * cerradas;
  const transform: Record<string, string> = {
    entero: `translate(${POLILLA.x} ${POLILLA.y}) scale(${POLILLA.escala})`,
    vuelo: `translate(${n2((m.donde[0] - POLILLA.x) / POLILLA.escala)} ${n2((m.donde[1] - POLILLA.y) / POLILLA.escala)}) rotate(${n2(m.ladeo)})`,
    panza: `translate(${wx} ${wy}) rotate(${n2(m.panza)}) scale(${n2(1 + 0.03 * m.respira)} ${n2(1 + 0.05 * m.respira)}) translate(${-wx} ${-wy})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    patas: `rotate(${n2(m.cuelga)} 0 0)`,
    foco: `rotate(${n2(m.foco)} ${FOCO.cuelga[0]} ${FOCO.cuelga[1]})`,
  };
  for (const n of [0, 1] as const) {
    // La 1 sube girando para la derecha (la punta va para arriba), la 2 al revés.
    const s = n === 0 ? 1 : -1;
    const [hx, hy] = A.hombros[n];
    const [cx, cy] = A.caderas[n];
    transform[`ala-${n + 1}`] = `translate(${hx} ${hy}) rotate(${n2(s * sube)}) scale(${n2(abre)} 1) translate(${-hx} ${-hy})`;
    // Las de atrás van un poco detrás de las de adelante, y suben menos.
    transform[`trasera-${n + 1}`] = `translate(${cx} ${cy}) rotate(${n2(s * sube * 0.78)}) scale(${n2(abre * (1 - 0.3 * cerradas))} 1) translate(${-cx} ${-cy})`;
    const [ax, ay] = A.antenas[n];
    transform[`antena-${n + 1}`] = `rotate(${n2(-s * m.antenas[n])} ${ax} ${ay})`;
    const [px, py] = A.patas[n];
    transform[`pata-${n + 1}`] = `rotate(${n2(-s * m.patas[n])} ${px} ${py})`;
    const [ex, ey] = A.ojos[n];
    const top = ey - A.radioOjo - 1;
    transform[`parpado-${n + 1}`] = `translate(${ex} ${top}) scale(1 ${n2(Math.max(0.02, m.parpados[n]))}) translate(${-ex} ${-top})`;
    transform[`mareo-${n + 1}`] = `translate(${ex} ${ey}) rotate(${n2(s * m.giroMareo)})`;
  }
  m.polvo.forEach(([x, y], k) => {
    transform[`polvo-${k + 1}`] = `translate(${n2(x)} ${n2(y)})`;
  });
  const opacity: Record<string, string> = {
    mareos: n2(m.mareo),
    halo: n2(m.brillo),
    golpe: n2(m.golpe),
  };
  m.polvo.forEach(([, , o], k) => {
    opacity[`polvo-${k + 1}`] = n2(o);
  });
  return { transform, opacity };
}

/** Dónde dice su verso: arriba del foco, en el recinto. */
export const VERSO: Punto = [636, 92];
