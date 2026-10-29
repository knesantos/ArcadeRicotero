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
  fuente: Fuente;
  poligono: readonly Punto[];
  /** Cuánto se sopla el borde, en píxeles de la tapa. */
  plumado: number;
  /** Si se cruza con la silueta del cordero (`cordero-rulo.png`). */
  conSilueta?: boolean;
  /** Si el canto de la tapa (arriba, izquierda) se funde en vez de cortar seco. */
  fundirBordes?: boolean;
  /**
   * Si el fondo de la tapa es oscuro y la figura clara (Luzbelito en su óvalo, el medallón de
   * Momo): lo que está por debajo de `desde` de luminosidad se vuelve transparente, y entre
   * `desde` y `hasta` se funde.
   */
  fondoOscuro?: { desde: number; hasta: number };
  /**
   * Si la figura tiene sombras tan oscuras como el fondo (el busto de Luzbelito): en vez de
   * transparentar por luminosidad, se separa la silueta —lo que se aleja más de `umbral` del color
   * `fondo`—, se le tapan los agujeros y queda maciza. Solo el canto se sopla, `canto` píxeles. `incluye`
   * es lo que es figura aunque tenga el color del fondo, dibujado a mano. `pelar` son las pasadas
   * que le sacan al canto el ribete del fondo que el cierre deja pegado.
   */
  macizo?: {
    fondo: readonly [number, number, number];
    umbral: number;
    canto: number;
    incluye?: readonly (readonly Punto[])[];
    pelar?: number;
  };
  /**
   * Lo que se pinta encima de la tapa antes de cortar, en sus píxeles: un SVG hecho con las tintas
   * de `tokens.css` (`tinta` da el hex de un token). Lo pintado cuenta como figura.
   */
  pintado?: (tinta: (token: string) => string) => string;
  /** Cuánto se achica al guardarlo, si no es el `REDUCCION` de siempre: las figuras chicas, enteras. */
  reduccion?: number;
  /**
   * Para usar una tapa como textura: el negro queda negro y lo claro se tiñe con dos tokens, de
   * `medio` a `claro`. `sinVerde` borra las letras verdes de la tapa de *Gulp!* antes de teñir.
   */
  tenido?: { medio: string; claro: string; sinVerde?: boolean };
}

/** De qué archivo sale cada uno. */
export const FUENTES = {
  lobo: 'Docs/INVESTIGACION/TapasDiscos/lobo-suelto-cordero-atado-cd1-frontal.jpg',
  cordero: 'Docs/INVESTIGACION/TapasDiscos/lobo-suelto-cordero-atado-cd2-frontal.jpg',
  perro: 'Docs/INVESTIGACION/TapasDiscos/un-baion-para-el-ojo-idiota-frontal.jpg',
  luzbelito: 'Docs/INVESTIGACION/TapasDiscos/luzbelito-frontal.jpg',
  momo: 'Docs/INVESTIGACION/TapasDiscos/momo-sampler-frontal.jpg',
  gulp: 'Docs/INVESTIGACION/TapasDiscos/gulp-frontal.jpg',
} as const;

export type Fuente = keyof typeof FUENTES;

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

/*
 * El perro de *Un baión* (`RES-06`, `RES-22`): la cabeza roja de crayón, con la boca abierta y
 * los dientes, entrando por el borde izquierdo de la tapa. Es "ese perro que sigue allí" de
 * *Todo un palo*, que es de ese disco. Tres piezas: la cabeza de arriba, la mandíbula (que se
 * abre para ladrar) y el fondo de la boca, que queda quieto detrás. La tapa lo corta en el
 * borde izquierdo, y así entra en el baldío: por el borde.
 */
const CABEZA_PERRO: readonly Punto[] = [
  [0, 488], [60, 500], [140, 520], [205, 532], [250, 545], [252, 575], [220, 598], [180, 612], [140, 630], [100, 646], [40, 662], [0, 668],
];
const MANDIBULA_PERRO: readonly Punto[] = [
  [0, 650], [60, 640], [110, 630], [160, 614], [205, 600], [244, 598], [252, 640], [236, 676], [196, 712], [140, 760], [80, 806], [0, 826],
];
const BOCA_PERRO: readonly Punto[] = [
  [60, 610], [130, 585], [200, 570], [248, 572], [248, 630], [190, 640], [120, 652], [60, 660],
];

/*
 * Luzbelito (`RES-06`): la cabeza esculpida con la vela encendida en la coronilla, del óvalo de
 * su tapa. El fondo del óvalo es negro, pero la sombra de la cara y del cuello es casi igual de
 * oscura: por luminosidad se transparentaba entera. Así que va maciza (`macizo`): la silueta se
 * separa por la distancia al negro verdoso del óvalo y se le tapan los agujeros. El polígono solo
 * acota dónde buscarla: corta en la base del busto, antes del pie y del marco. La llama va aparte
 * para que titile.
 */
const BUSTO_LUZBELITO: readonly Punto[] = [
  [428, 382], [470, 368], [496, 372], [498, 352], [512, 352], [514, 372], [556, 384], [580, 420], [574, 498], [586, 520],
  [594, 586], [545, 590], [490, 586], [458, 578], [448, 540], [440, 520], [424, 480], [424, 420],
];
/**
 * El lente oscuro del antiparras, el de su izquierda: es del mismo verde negro que el óvalo, así
 * que por color se cortaba a mordiscos. Va a mano, hasta la correa, que es el canto de la cabeza.
 */
const LENTE_LUZBELITO: readonly Punto[] = [
  [504, 383], [514, 385], [524, 389], [534, 395], [541, 401], [548, 410], [554, 420], [558, 431], [560, 442],
  [532, 442], [514, 426], [503, 404],
];
/**
 * El mismo lente, repintado (pedido del usuario: *"todavía no se recorta bien el lente, generalo"*).
 * Un vidrio oval con su aro, soplado de lo hondo a la luz de la vela, con el brillo donde la tapa
 * lo tiene y el grano de la foto. Las medidas son las del lente de la tapa.
 */
function lenteDeLuzbelito(tinta: (token: string) => string): string {
  const [cx, cy, rx, ry, giro] = [521, 408, 21, 14, 30];
  return (
    `<defs>` +
    `<clipPath id="vidrio"><ellipse cx="0" cy="0" rx="${rx}" ry="${ry}"/></clipPath>` +
    `<filter id="soplo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5"/></filter>` +
    `<filter id="brillo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>` +
    `<filter id="aro"><feGaussianBlur stdDeviation="0.5"/></filter>` +
    `<filter id="grano"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="7"/>` +
    `<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 -0.1"/><feComposite in2="SourceGraphic" operator="in"/></filter>` +
    `</defs>` +
    `<g transform="translate(${cx} ${cy}) rotate(${giro})">` +
    `<ellipse rx="${rx}" ry="${ry}" fill="${tinta('--bestia-luzbelito-vidrio')}"/>` +
    `<g clip-path="url(#vidrio)"><ellipse cx="-3" cy="-7" rx="${rx * 0.8}" ry="${ry * 0.55}" fill="${tinta('--bestia-luzbelito-vidrio-luz')}" filter="url(#soplo)"/></g>` +
    `<ellipse rx="${rx}" ry="${ry}" fill="${tinta('--bestia-luzbelito-vidrio')}" filter="url(#grano)"/>` +
    `<ellipse rx="${rx - 0.8}" ry="${ry - 0.8}" fill="none" stroke="${tinta('--bestia-luzbelito-aro')}" stroke-width="1.3" filter="url(#aro)"/>` +
    `<ellipse cx="-10" cy="-4" rx="5.5" ry="4.2" fill="${tinta('--bestia-luzbelito-brillo')}" filter="url(#brillo)"/>` +
    `<ellipse cx="-4" cy="-8" rx="2.2" ry="0.9" fill="${tinta('--bestia-luzbelito-brillo')}" opacity="0.7" filter="url(#brillo)"/>` +
    `</g>`
  );
}
const LLAMA_LUZBELITO: readonly Punto[] = [[494, 312], [516, 312], [516, 360], [494, 360]];

/** El medallón de Momo, de la tapa de *Momo Sampler*: un círculo de plata con la cara del rey del carnaval. */
const MEDALLON_MOMO: readonly Punto[] = [[725, 500], [724, 522], [719, 544], [712, 565], [702, 585], [690, 603], [675, 620], [658, 635], [640, 647], [620, 657], [599, 664], [577, 669], [555, 670], [533, 669], [511, 664], [490, 657], [470, 647], [452, 635], [435, 620], [420, 603], [408, 585], [398, 565], [391, 544], [386, 522], [385, 500], [386, 478], [391, 456], [398, 435], [408, 415], [420, 397], [435, 380], [452, 365], [470, 353], [490, 343], [511, 336], [533, 331], [555, 330], [577, 331], [599, 336], [620, 343], [640, 353], [658, 365], [675, 380], [690, 397], [702, 415], [712, 435], [719, 456], [724, 478]];

/*
 * El fuego del infierno: el pincel seco de la tapa de *Gulp!*, sin las letras, teñido de brasa y
 * fuego. Las llamas del infierno son pinceladas de Rocambole, no un dibujo nuevo.
 */
const TAPA_ENTERA: readonly Punto[] = [[0, 0], [953, 0], [953, 953], [0, 953]];

export const RECORTES: readonly Recorte[] = [
  { nombre: 'lobo-real-cabeza', fuente: 'lobo', poligono: CABEZA_LOBO, plumado: 9 },
  { nombre: 'lobo-real-pecho', fuente: 'lobo', poligono: PECHO_LOBO, plumado: 9 },
  { nombre: 'cordero-real-cabeza', fuente: 'cordero', poligono: CABEZA_CORDERO, plumado: 3, conSilueta: true },
  { nombre: 'cordero-real-cuerpo', fuente: 'cordero', poligono: CUERPO_CORDERO, plumado: 3, conSilueta: true, fundirBordes: true },
  { nombre: 'cordero-real-pata-tras', fuente: 'cordero', poligono: PATA_TRAS_CORDERO, plumado: 2, conSilueta: true },
  { nombre: 'cordero-real-pata-del', fuente: 'cordero', poligono: PATA_DEL_CORDERO, plumado: 2, conSilueta: true },
  { nombre: 'perro-real-boca', reduccion: 1, fuente: 'perro', poligono: BOCA_PERRO, plumado: 4, fundirBordes: true },
  { nombre: 'perro-real-mandibula', reduccion: 1, fuente: 'perro', poligono: MANDIBULA_PERRO, plumado: 4, fundirBordes: true },
  { nombre: 'perro-real-cabeza', reduccion: 1, fuente: 'perro', poligono: CABEZA_PERRO, plumado: 4, fundirBordes: true },
  { nombre: 'luzbelito-real-busto', reduccion: 1, fuente: 'luzbelito', poligono: BUSTO_LUZBELITO, plumado: 3, macizo: { fondo: [31, 33, 35], umbral: 20, canto: 0.8, incluye: [LENTE_LUZBELITO], pelar: 2 }, pintado: lenteDeLuzbelito },
  { nombre: 'luzbelito-real-llama', reduccion: 1, fuente: 'luzbelito', poligono: LLAMA_LUZBELITO, plumado: 3, fondoOscuro: { desde: 40, hasta: 90 } },
  {
    nombre: 'infierno-pincelada',
    fuente: 'gulp',
    poligono: TAPA_ENTERA,
    plumado: 0,
    reduccion: 0.7,
    tenido: { medio: '--entorno-infierno-brasa', claro: '--entorno-infierno-fuego', sinVerde: true },
  },
  { nombre: 'momo-real-medallon', reduccion: 1, fuente: 'momo', poligono: MEDALLON_MOMO, plumado: 2, fondoOscuro: { desde: 14, hasta: 40 } },
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
  perro: {
    /** El canto de la tapa: por ahí entra en el baldío. */
    borde: [0, 650],
    /** La bisagra de la mandíbula, adentro, contra el borde. */
    mandibula: [20, 650],
    cabeza: [20, 600],
  },
  luzbelito: {
    piso: [510, 600],
    cuello: [500, 540],
    llama: [505, 350],
  },
  momo: {
    /** De dónde cuelga: la argolla de arriba del medallón. */
    argolla: [555, 334],
    centro: [555, 500],
    radio: 168,
  },
} as const;
