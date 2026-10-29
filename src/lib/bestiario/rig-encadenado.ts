/**
 * Los números del esclavo encadenado (`D-73`, vigesimoprimera vuelta): dónde se arrodilla en la
 * prisión, cómo está cortado y cómo se pone. Los lee el dibujo (`arte-encadenado.ts`), para la pose
 * quieta del HTML y para el retrato; el que prepara el máster (`scripts/preparar-encadenado.mjs`),
 * para saber qué es cadena y qué es cuerpo; y la conducta (`scripts/bestiario/encadenado.ts`), que se
 * lleva esto y nada que dibuje.
 *
 * **No se redibuja**: es el dibujo que trajo el usuario, el estarcido blanco sobre negro del esclavo
 * que rompe las cadenas (`Docs/UX/recortes-master/esclavo-encadenado.png`, 480 × 640), cortado en
 * piezas como un títere de papel. Por eso hay dos sistemas de coordenadas:
 * - **El del dibujo**: píxeles del máster. Todas las piezas, los cortes y los pivotes van acá.
 * - **El del recinto** (900 × 640, agrandado a −250…1150): se arrodilla adelante de la celda de la
 *   derecha, la de los reos, de la que se escapó.
 */

export type Punto = readonly [number, number];

/** El máster, y dónde apoya las rodillas: abajo de eso está la raya del piso del estarcido, que no va. */
export const MASTER = { ancho: 480, alto: 640, piso: 619 } as const;
/** El (0, 0) del títere: entre las dos rodillas, en el piso. */
export const ORIGEN: Punto = [240, MASTER.piso];

/** Dónde se arrodilla en el recinto, y lo que mide (un píxel del máster son `escala` del recinto). */
export const ENCADENADO = { x: 975, piso: 624, escala: 0.47 } as const;

/*
 * Los cortes, en píxeles del máster. Cada pieza se corta con su `corte`; el cuerpo es lo que queda
 * cuando se le sacan los `huecos`. En las articulaciones el hueco es más corto que el corte: la pieza
 * se mete un poco abajo del cuerpo, como la solapa de un títere de papel, para que al girar no se abra
 * la juntura.
 */

/** La cabeza que ruge mirando para arriba, con el cuello a rayas hasta el collar. */
const CABEZA: readonly Punto[] = [
  [186, 150], [192, 128], [210, 117], [221, 100], [241, 99], [252, 110], [263, 103], [284, 108], [292, 122], [288, 130],
  [280, 145], [271, 165], [268, 190], [272, 220], [277, 250], [281, 260], [255, 264], [228, 264], [200, 263], [184, 258],
  [195, 235], [199, 206], [195, 186], [186, 174],
];
const HUECO_CABEZA: readonly Punto[] = [...CABEZA.slice(0, 14), [273, 236], [240, 238], [200, 238], ...CABEZA.slice(20)];

/** El antebrazo alzado con el puño cerrado sobre la cadena, hasta adentro de la manga. */
const ANTEBRAZO: readonly Punto[] = [
  [305, 30], [318, 18], [345, 7], [366, 7], [386, 10], [396, 24], [399, 40], [396, 60], [381, 72], [363, 86], [360, 102],
  [358, 128], [363, 150], [345, 161], [315, 159], [306, 150], [311, 120], [315, 92], [311, 72], [304, 50],
];
const HUECO_ANTEBRAZO: readonly Punto[] = [...ANTEBRAZO.slice(0, 12), [359, 138], [310, 138], ...ANTEBRAZO.slice(16)];

/** La cadena que sale del puño para la izquierda: la que se rompe. */
const CADENA_ALTA: readonly Punto[] = [
  [0, 140], [20, 128], [55, 116], [66, 111], [100, 109], [111, 117], [128, 100], [148, 84], [163, 61], [184, 44], [204, 24],
  [231, 11], [255, 1], [285, 0], [304, 6], [309, 26], [306, 48], [297, 58], [270, 57], [250, 61], [231, 78], [207, 104],
  [196, 116], [180, 140], [171, 168], [161, 192], [129, 197], [113, 176], [99, 161], [70, 163], [40, 176], [10, 184], [0, 178],
];

/** La punta de cadena que sale del puño para la derecha. */
const CADENA_PUNTA: readonly Punto[] = [
  [396, 40], [420, 33], [446, 36], [470, 48], [480, 53], [480, 102], [460, 100], [438, 91], [418, 76], [404, 66], [396, 58],
];

/** El puño de abajo, el que aprieta, con la muñeca hasta adentro de la manga. */
const PUNO: readonly Punto[] = [
  [46, 326], [68, 296], [92, 299], [102, 311], [104, 330], [102, 345], [105, 367], [112, 374], [119, 392], [110, 403],
  [92, 403], [82, 393], [70, 372], [58, 352], [49, 340],
];
const HUECO_PUNO: readonly Punto[] = [...PUNO.slice(0, 7), [99, 380], [84, 386], ...PUNO.slice(12)];

/** La cadena que le cuelga del costado derecho. */
const CADENA_BAJA: readonly Punto[] = [
  [336, 376], [355, 369], [375, 351], [410, 351], [431, 364], [450, 377], [470, 384], [479, 410], [473, 429], [456, 440],
  [461, 451], [459, 471], [441, 489], [431, 506], [414, 506], [419, 489], [404, 481], [401, 460], [419, 438], [424, 425],
  [409, 411], [399, 398], [380, 399], [354, 393], [337, 393],
];

export const CORTES = {
  cabeza: CABEZA,
  antebrazo: ANTEBRAZO,
  'cadena-alta': CADENA_ALTA,
  'cadena-punta': CADENA_PUNTA,
  puno: PUNO,
  'cadena-baja': CADENA_BAJA,
} as const;
export type Corte = keyof typeof CORTES;

/** Lo que se le saca al cuerpo. */
export const HUECOS: readonly (readonly Punto[])[] = [HUECO_CABEZA, HUECO_ANTEBRAZO, CADENA_ALTA, CADENA_PUNTA, HUECO_PUNO, CADENA_BAJA];

/** Las cadenas: en el máster no se hacen macizas (entre eslabón y eslabón se ve lo de atrás). */
export const CADENAS: readonly (readonly Punto[])[] = [CADENA_ALTA, CADENA_PUNTA, CADENA_BAJA];

/** Cómo está armado, en píxeles del máster: de dónde gira cada pieza. */
export const ENCADENADO_ARMADO = {
  /** El cuello, en el collar: la cabeza ruge para atrás desde acá. */
  cuello: [238, 254] as Punto,
  /** El codo, adentro de la manga: el antebrazo tironea desde acá. */
  codo: [334, 176] as Punto,
  /** Donde el puño agarra cada cadena. */
  agarre: [311, 30] as Punto,
  agarrePunta: [398, 50] as Punto,
  /** La muñeca del puño de abajo. */
  muneca: [104, 394] as Punto,
  /** Donde la cadena de abajo se engancha en la túnica. */
  enganche: [340, 382] as Punto,
  /** El eslabón que salta: el primero de la cadena alta, pegado al puño. */
  eslabon: [282, 30] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** El pecho que sube y baja: de −1 a 1. */
  respira: number;
  /** Cuánto gira cada pieza desde su pivote (grados). */
  cabeza: number;
  antebrazo: number;
  puno: number;
  punta: number;
  baja: number;
  /** La cadena alta: lo que gira en el agarre, y cuando se rompe, lo que se va y cuánto se ve. */
  alta: { giro: number; x: number; y: number; o: number };
  /** La chispa del eslabón que salta (0 nada, 1 el fogonazo). */
  chispa: number;
}

/** La pose quieta, la del HTML y la del retrato: la del dibujo, tal cual. */
export const QUIETO: Momento = {
  respira: 0,
  cabeza: 0,
  antebrazo: 0,
  puno: 0,
  punta: 0,
  baja: 0,
  alta: { giro: 0, x: 0, y: 0, o: 1 },
  chispa: 0,
};

/**
 * La cadena rota: el brazo arriba de un tirón, la cabeza para atrás rugiendo, la cadena alta que ya
 * se fue y la chispa del eslabón. Es el toque con movimiento reducido.
 */
export const ROTA: Momento = {
  ...QUIETO,
  cabeza: -7,
  antebrazo: -9,
  puno: -10,
  punta: 14,
  baja: 6,
  alta: { giro: -50, x: -60, y: 120, o: 0 },
  chispa: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** De píxeles del máster al recinto (sin respirar ni girar nada). */
export const alRecinto = ([x, y]: Punto): Punto => [
  ENCADENADO.x + (x - ORIGEN[0]) * ENCADENADO.escala,
  ENCADENADO.piso + (y - ORIGEN[1]) * ENCADENADO.escala,
];

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el
 * HTML (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = ENCADENADO_ARMADO;
  const [ox, oy] = ORIGEN;
  const gira = (ang: number, [px, py]: Punto): string => `rotate(${n2(ang)} ${px} ${py})`;
  const sube = 1 + 0.012 * m.respira;
  const transform: Record<string, string> = {
    entero: `translate(${ENCADENADO.x} ${ENCADENADO.piso}) scale(${ENCADENADO.escala}) translate(${-ox} ${-oy})`,
    torso: `translate(${ox} ${oy}) scale(1 ${n2(sube)}) translate(${-ox} ${-oy})`,
    cabeza: gira(m.cabeza, A.cuello),
    antebrazo: gira(m.antebrazo, A.codo),
    puno: gira(m.puno, A.muneca),
    'cadena-punta': gira(m.punta, A.agarrePunta),
    'cadena-baja': gira(m.baja, A.enganche),
    'cadena-alta': `translate(${n2(m.alta.x)} ${n2(m.alta.y)}) ${gira(m.alta.giro, A.agarre)}`,
    chispa: `translate(${A.eslabon[0]} ${A.eslabon[1]}) scale(${n2(0.4 + 0.8 * m.chispa)})`,
  };
  const opacity: Record<string, string> = {
    'cadena-alta': n2(m.alta.o),
    chispa: n2(m.chispa),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la cabeza que ruge, en el recinto. */
export const VERSO: Punto = alRecinto([236, 92]);
