/**
 * Los números de la Mariposa Pontiac (`D-73`, decimoquinta vuelta): dónde se agarra cada pieza,
 * cuánto se mueve y con qué tiempos. Los leen el dibujo (`arte-pontiac.ts`, para la pose quieta del
 * HTML) y la conducta (`scripts/bestiario/pontiac.ts`); por eso acá no hay nada que dibuje.
 *
 * El títere va adentro del `.cuerpo` de su fierro, con el (0, 0) donde las ruedas tocan el carril y
 * la trompa para la derecha, como la imagen vieja (`ruta-pontiac`). El tránsito lo corre; esto mueve
 * lo de adentro.
 */

import { FIERROS, RUTA } from './rig-entornos.ts';

type P = readonly [number, number];

/** El carril de cada fierro de la ruta, en `y`: el de ella y el de los que pasa. */
export const CARRIL_DE: Readonly<Record<string, number>> = Object.fromEntries(
  Object.entries(FIERROS).map(([id, { carril }]) => [id, RUTA.carriles[carril]!]),
);

export const PONTIAC_ARMADO = {
  /** El lomo: donde las alas se agarran del techo. Es el pivote de las cuatro. */
  bisagra: [-2, -93] as P,
  /** Las ruedas, de adelante y de atrás (la de atrás va medio tapada por el faldón). */
  ruedas: [[70, -16], [-66, -16]] as readonly P[],
  radioRueda: 16,
  /**
   * La base de cada antena: la trompa es la cabeza de la polilla, así que salen de arriba de los
   * guardabarros de adelante y tantean la noche en el haz de los faros. La de este lado y la del otro.
   */
  antenas: [[106, -52], [100, -57]] as readonly P[],
  /**
   * Las alas se dibujan a su medida y el títere las achica sobre su raíz (`k`), para que no se coman
   * la ruta. Lo de adentro de cada ala (el ojo, la cola) va en las medidas del dibujo.
   */
  escalaAlas: { anterior: { raiz: [0, -94] as P, k: 0.88 }, posterior: { raiz: [-2, -94] as P, k: 0.92 } },
  /** Donde la cola cuelga del ala de atrás. */
  cola: [-106, -106] as P,
  /**
   * Los dos ojos humanos, cada uno adentro del óvalo de cobre de su ala: el del ala de adelante y el
   * de la de atrás. `radio` es el del blanco; `mira`, cuánto se corre el iris para cada lado.
   */
  ojos: [
    { centro: [58, -148] as P, radio: [10, 4.8] as P, mira: [3.6, 1.1] as P },
    { centro: [-64, -124] as P, radio: [9, 4.4] as P, mira: [3.2, 1] as P },
  ],
  /** Los óvalos de cobre: el radio de afuera (el de adentro es el negro, como en la tapa). */
  ovalos: [[15, 24] as P, [13.6, 21.8] as P],
  /** La vela que lleva en la cabeza el busto de la trompa: el pabilo. */
  llama: [88.8, -81] as P,
  /** El faro, de donde sale el haz. */
  faro: [110, -45] as P,
  /** Donde se apoya cuando cabecea: el medio del auto, a la altura de los ejes. */
  cabeceo: [0, -20] as P,
} as const;

/**
 * La cámara mira la ruta un poco desde arriba (`ELEVACION`, en grados). Por eso, cuando las alas se
 * abren, la de este lado se acuesta hacia vos y se achica, y la del otro lado se acuesta para allá y
 * se ve casi entera: eso es lo que se lee como una V.
 */
export const ELEVACION = 22;

/** Lo que dura cada cosa y cuánto se mueve. Los tiempos varían adentro de cada rango. */
export const PONTIAC_VIDA = {
  /** Cuánto abre cuando respira (grados), y cuánto tarda una respiración. */
  respira: { cerrada: 9, abierta: 31, periodo: [2.6, 4.6] as P },
  /** Cada tanto las pliega del todo, como una polilla quieta, y las tiene así un rato. */
  pliega: { cada: [9, 17] as P, dura: [1.4, 2.8] as P },
  /** El viento de la ruta: cuánto las tira para atrás, y cuánto más cuando pasa al lado de otro. */
  viento: 7,
  rafagaAlPasar: 14,
  /** Pasa al lado de otro fierro cuando están a menos de esto (en x). */
  alLado: 170,
  /** Una luz de adelante la llama (es polilla) si está entre estas distancias. */
  luzAdelante: [140, 520] as P,
  /** Cuánto se ven las colas sacudirse con el viento. */
  colaSacude: 5,
  /** El parpadeo: cada cuánto, y cuánto dura. */
  parpadeo: { cada: [2.2, 5.2] as P, dura: 0.14 },
  /** El párpado de siempre, medio caído; y el del susto, arriba del todo. */
  parpadoQuieto: 0.24,
  /**
   * Tocada, *"¿qué va a ser de mí?"*: el susto (abre de golpe y muestra los ojos), los aletazos con
   * que despega, el rato en el aire, la bajada y el asiento. En segundos, desde que la tocan.
   */
  susto: 0.35,
  despega: 1.0,
  enElAire: 2.0,
  baja: 2.75,
  asienta: 3.4,
  /** Cuánto sube, cuánto le cuelgan las ruedas y cuánto levanta la trompa. */
  alto: 30,
  colgado: 7,
  cabeceo: -5,
  /** Los aletazos: cuántos por segundo y cuánto abren. */
  aletazos: 1.7,
  abreAletazo: 66,
} as const;

/**
 * Lo que mira de los fierros del otro carril, que van más despacio y los pasa: quién viaja colgado o
 * tirado arriba, y de dónde sale su luz. Medido del dibujo de cada uno (`bondi()` y `camion()` en
 * `arte-entornos.ts`), con el (0, 0) donde tocan el carril.
 */
export const DE_LOS_OTROS: Readonly<Record<string, { pasajero: P; luz: P }>> = {
  'el-zumba': { pasajero: [-164, -76], luz: [230, -40] },
  'el-heroe-del-whisky': { pasajero: [-80, -76], luz: [200, -44] },
};

/** La que espera en la banquina de arriba: cuando pasa cerca, los ojos se le van para allá. */
export const LA_SENORA = 'la-bella-senora-desencarnada';

/** La pose de un cuadro: todo lo que la isla le cambia al títere. */
export interface Pose {
  /** Cuánto abren las alas, en grados: 0 es cerradas para arriba, como una polilla quieta. */
  abre: number;
  /** Cuánto las tira para atrás el viento, en grados. */
  barre: number;
  /** Cuánto se corre para adelante el ala de adelante (el susto, que muestra el ojo de atrás). */
  adelanta: number;
  /** El giro de la cola, en grados. */
  cola: number;
  /** El giro de cada antena, en grados. */
  antenas: readonly [number, number];
  /** Cuánto despegó del carril. */
  alto: number;
  /** La trompa para arriba (negativo), en grados. */
  cabeceo: number;
  /** Cuánto le bajan las ruedas cuando despega. */
  colgado: number;
  /** El giro de las ruedas, en grados. */
  giro: number;
  /** Los párpados: 0 abierto, 1 cerrado. */
  parpados: readonly [number, number];
  /** Adónde miran los dos ojos: de -1 a 1 en cada eje. */
  mira: readonly [number, number];
  /** La llama de la vela: cuánto se estira con el viento (de 0 a 1). */
  llama: number;
}

/** La pose sin JavaScript: va por la ruta con las alas a media altura, mirando para adelante. */
export const QUIETA: Pose = {
  abre: 20,
  barre: 7,
  adelanta: 0,
  cola: 0,
  antenas: [0, 0],
  alto: 0,
  cabeceo: 0,
  colgado: 0,
  giro: 0,
  parpados: [0.24, 0.24],
  mira: [0.7, 0.15],
  llama: 0.7,
};

/** Tocada y quieta (movimiento reducido): el susto, con las alas abiertas y los ojos bien abiertos. */
export const ASUSTADA: Pose = {
  ...QUIETA,
  abre: 14,
  barre: 0,
  adelanta: 16,
  parpados: [0, 0],
  mira: [-0.2, 0.4],
};

const g = (v: number): string => (Math.round(v * 100) / 100).toString();
const rad = (v: number): number => (v * Math.PI) / 180;

/**
 * Cuánto se ve de alto un ala abierta `abre` grados: la de este lado (`cerca`) y la del otro. Con la
 * cámara un poco desde arriba, la de este lado se achica más rápido. Nunca llega a darse vuelta.
 */
export function alturaDeAla(abre: number, cerca: boolean): number {
  const e = ELEVACION;
  const a = Math.min(abre, 80);
  // La del otro lado crece un poco al abrirse, hasta que se acuesta; no más que lo que mide.
  return Math.min(1, Math.max(0.06, Math.cos(rad(cerca ? a + e : a - e)) / Math.cos(rad(e))));
}

/**
 * Lo que la pose le hace a cada pieza: el `transform` (y la opacidad, la sombra) de cada
 * `data-parte`. Lo usan el HTML, para la pose quieta, y la isla, en cada cuadro: así las dos dicen
 * lo mismo.
 */
export function transformaciones(p: Pose): Record<string, { transform: string; opacity?: string }> {
  const A = PONTIAC_ARMADO;
  const [hx, hy] = A.bisagra;
  const ala = (giro: number, alto: number, sube = 0): string =>
    `translate(${hx} ${g(hy - sube)}) scale(1 ${g(alto)}) translate(${-hx} ${-hy}) rotate(${g(giro)} ${hx} ${hy})`;
  const cerca = alturaDeAla(p.abre, true);
  const lejos = alturaDeAla(p.abre, false);
  const [cx, cy] = A.cabeceo;
  const salida: Record<string, { transform: string; opacity?: string }> = {
    entero: { transform: `translate(0 ${g(-p.alto)}) rotate(${g(p.cabeceo)} ${cx} ${cy})` },
    // La sombra se queda en el carril: se achica y se apaga cuando despega.
    sombra: { transform: `scale(${g(Math.min(1, Math.max(0.55, 1 - p.alto / 120)))} 1)`, opacity: g(Math.min(1, Math.max(0.25, 1 - p.alto / 55))) },
    'ala-anterior': { transform: ala(p.adelanta - p.barre, cerca) },
    'ala-posterior': { transform: ala(-p.barre * 0.7, cerca) },
    // La del otro lado, un poco más barrida y apenas más alta: asoma atrás cuando se abren.
    'ala-lejos': { transform: ala(-p.barre * 1.15 - 3, lejos, 2) },
    cola: { transform: `rotate(${g(p.cola)} ${A.cola[0]} ${A.cola[1]})` },
    llama: { transform: `translate(${A.llama[0]} ${A.llama[1]}) scale(${g(0.75 + p.llama * 0.45)} ${g(1.05 - p.llama * 0.2)})` },
  };
  A.antenas.forEach(([ax, ay], i) => {
    salida[`antena-${i + 1}`] = { transform: `translate(${ax} ${ay}) rotate(${g(p.antenas[i]!)})${i ? ' scale(0.9)' : ''}` };
  });
  A.ruedas.forEach(([rx, ry], i) => {
    salida[`rueda-${i + 1}`] = { transform: `translate(${rx} ${g(ry + p.colgado)}) rotate(${g(p.giro)})` };
  });
  A.ojos.forEach((o, i) => {
    const [ox, oy] = o.centro;
    salida[`iris-${i + 1}`] = { transform: `translate(${g(ox + p.mira[0] * o.mira[0])} ${g(oy + p.mira[1] * o.mira[1])})` };
    const k = Math.min(1, Math.max(0, p.parpados[i]!));
    const top = oy - o.radio[1] - 0.6;
    salida[`parpado-${i + 1}`] = { transform: `translate(${ox} ${g(top)}) scale(1 ${g(k)}) translate(${-ox} ${g(-top)})` };
  });
  return salida;
}
