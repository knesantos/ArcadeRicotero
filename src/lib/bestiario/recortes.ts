/**
 * Los recortes del lobo y el cordero, de las tapas mismas (`D-73`, cuarta vuelta).
 *
 * Pedido del usuario, textual: *"Animados se refiere a que se muevan, no estilo cartoon. Deben
 * ser lo más fiel posible al diseño real y los inventados lo más fiel a la estética posible."*
 *
 * Así que el lobo y el cordero **no se redibujan**: son el arte de Rocambole de los frentes del
 * disco doble de 1993, recortado en piezas como un títere de papel, y lo que se mueve son esas
 * piezas. Las coordenadas son píxeles de los frentes de `Docs/INVESTIGACION/TapasDiscos/`
 * (953 × 953). `scripts/recortar-bestiario.mjs` corta cada pieza con su polígono, plumea el
 * borde —el aerógrafo no tiene canto duro— y la escribe en `public/bestiario/`.
 *
 * - **El lobo** es un busto: la cabeza (orejas, cara, colmillos) y el pecho a bandas con los
 *   eslabones de papel. No tiene patas en la tapa, y no se le inventan: acecha asomándose desde
 *   lo oscuro del monte, como asoma en la tapa.
 * - **El cordero** es la criatura entera de la tapa: la máscara dada vuelta con los dos ojos
 *   verdes y los cuernos, el cuerpo de escamas, y las dos patas con sus pies de uñas. La silueta
 *   sale del recorte que ya estaba en el repo (`public/arte/cordero-rulo.png`, que es el frente
 *   entero achicado), llevada al tamaño grande. El cuerpo está cortado por el borde de la tapa
 *   arriba y a la izquierda: ahí lo completa, por debajo, un lomo de escamas a aerógrafo en los
 *   azules medidos de la tapa (`arte.ts`, `cordero-lomo`). Es lo único inventado.
 */

export type Punto = readonly [number, number];

export interface Recorte {
  nombre: string;
  fuente: 'lobo' | 'cordero';
  poligono: readonly Punto[];
  /** Cuánto se sopla el borde, en píxeles de la tapa. */
  plumado: number;
  /** Si se cruza con la silueta del cordero (`cordero-rulo.png`). */
  conSilueta?: boolean;
  /** Si el canto de la tapa (arriba, izquierda) se funde en vez de cortar seco. */
  fundirBordes?: boolean;
}

/** De qué archivo sale cada uno. */
export const FUENTES = {
  lobo: 'Docs/INVESTIGACION/TapasDiscos/lobo-suelto-cordero-atado-cd1-frontal.jpg',
  cordero: 'Docs/INVESTIGACION/TapasDiscos/lobo-suelto-cordero-atado-cd2-frontal.jpg',
} as const;

/** El lado de los frentes, en píxeles. */
export const LADO_TAPA = 953;

/** Cuánto se achica cada recorte al guardarlo: alcanza y sobra para el tamaño en pantalla. */
export const REDUCCION = 0.55;

const CABEZA_LOBO: readonly Punto[] = [
  [105, 62], [180, 98], [250, 148], [300, 176], [360, 186], [420, 158], [480, 148], [525, 146], [590, 50], [640, 0],
  [725, 0], [745, 110], [728, 250], [705, 340], [682, 430], [640, 480], [590, 504], [500, 520], [420, 536], [330, 552],
  [255, 542], [215, 505], [204, 440], [196, 380], [190, 330], [176, 250], [150, 165], [118, 92],
];

const PECHO_LOBO: readonly Punto[] = [
  [205, 470], [330, 500], [430, 488], [520, 470], [600, 455], [680, 430], [760, 520], [860, 556], [950, 586],
  [950, 704], [860, 714], [762, 704], [732, 762], [722, 824], [560, 826], [400, 826], [270, 826], [200, 826], [100, 834],
  [30, 834], [40, 770], [90, 700], [130, 620], [170, 560],
];

const CABEZA_CORDERO: readonly Punto[] = [
  [300, 0], [560, 0], [630, 30], [760, 60], [880, 100], [800, 125], [665, 125], [725, 190], [810, 292], [953, 238],
  [953, 340], [870, 336], [800, 425], [700, 455], [560, 468], [420, 476], [285, 458], [236, 404], [250, 300],
  [320, 228], [300, 150],
];

const PATA_TRAS_CORDERO: readonly Punto[] = [
  [290, 600], [490, 600], [505, 760], [475, 862], [430, 953], [225, 953], [222, 872], [300, 846], [330, 760], [305, 690],
];

const PATA_DEL_CORDERO: readonly Punto[] = [
  [598, 528], [720, 515], [790, 590], [880, 700], [900, 800], [880, 915], [680, 892], [690, 800], [672, 720], [608, 650],
];

/** Lo que queda del cordero cuando se le sacan la cabeza y las patas (con un poco de solape). */
const CUERPO_CORDERO: readonly Punto[] = [
  [0, 0], [330, 0], [300, 150], [320, 228], [250, 300], [236, 404], [285, 458], [420, 476], [560, 468], [585, 515],
  [545, 555], [552, 650], [500, 680], [300, 690], [250, 700], [0, 700],
];

export const RECORTES: readonly Recorte[] = [
  { nombre: 'lobo-real-cabeza', fuente: 'lobo', poligono: CABEZA_LOBO, plumado: 9 },
  { nombre: 'lobo-real-pecho', fuente: 'lobo', poligono: PECHO_LOBO, plumado: 9 },
  { nombre: 'cordero-real-cabeza', fuente: 'cordero', poligono: CABEZA_CORDERO, plumado: 3, conSilueta: true },
  { nombre: 'cordero-real-cuerpo', fuente: 'cordero', poligono: CUERPO_CORDERO, plumado: 3, conSilueta: true, fundirBordes: true },
  { nombre: 'cordero-real-pata-tras', fuente: 'cordero', poligono: PATA_TRAS_CORDERO, plumado: 2, conSilueta: true },
  { nombre: 'cordero-real-pata-del', fuente: 'cordero', poligono: PATA_DEL_CORDERO, plumado: 2, conSilueta: true },
];

/** La caja de un recorte en píxeles de la tapa: la del polígono, con aire para el plumado. */
export function cajaDeRecorte(r: Recorte): readonly [number, number, number, number] {
  const xs = r.poligono.map((p) => p[0]);
  const ys = r.poligono.map((p) => p[1]);
  const aire = r.plumado * 3;
  const x0 = Math.max(0, Math.floor(Math.min(...xs) - aire));
  const y0 = Math.max(0, Math.floor(Math.min(...ys) - aire));
  const x1 = Math.min(LADO_TAPA, Math.ceil(Math.max(...xs) + aire));
  const y1 = Math.min(LADO_TAPA, Math.ceil(Math.max(...ys) + aire));
  return [x0, y0, x1 - x0, y1 - y0];
}

/**
 * Dónde gira cada pieza y dónde pisa cada uno, en píxeles de la tapa. El títere se dibuja en
 * esas coordenadas y la isla lo escala: el lobo se apoya en el borde de abajo del pecho, el
 * cordero en la línea de sus pies.
 */
export const ARMADO = {
  lobo: {
    piso: [450, 826],
    cabeza: [430, 520],
    ojos: [
      { centro: [352, 258], radio: [40, 30] },
      { centro: [583, 222], radio: [32, 26] },
    ],
  },
  cordero: {
    piso: [560, 905],
    cabeza: [470, 470],
    'pata-tras': [400, 640],
    'pata-del': [650, 570],
    ojos: [
      { centro: [470, 74], radio: [44, 26], giro: 18 },
      { centro: [690, 290], radio: [44, 24], giro: 22 },
    ],
    /** Dónde se ata la soga: el cogote, entre la máscara y las escamas. */
    nudo: [520, 520],
  },
} as const;
