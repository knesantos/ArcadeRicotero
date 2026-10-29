/**
 * La geometría de los seis entornos de la décima vuelta (`D-73`): el galpón, el árbol del gran
 * bonete, Cybersiberia, los astilleros, la mesa servida y la ruta del último bondi.
 *
 * Son números, como `rig.ts`: los lee el aerógrafo (`arte-entornos.ts`) para pintar cada entorno
 * y los lee la escena (`escenas-entornos.ts`) para poner a cada bicho donde el dibujo lo espera.
 * No importa nada que dibuje, así lo puede leer también el camino (`camino.ts`) sin llevarse el
 * aerógrafo al teléfono.
 *
 * Todo está en la escena de 900 × 640 de los recintos de noche (`ESCENA` en `rig.ts`). Cuando una
 * capa se pinta más ancha, las cosas fijas se corren con `k = ancho / 900`, y lo sembrado al azar
 * se siembra a lo ancho.
 */

/** El alto de toda escena de noche, y el ancho del recinto. */
export const ALTO = 640;
export const ANCHO = 900;

/** Unos ojos en lo oscuro: dónde miran y de qué color brillan (`ojos()` en `escenas.ts`). */
export type Ojos = readonly [number, number, 'oro' | 'papel' | 'rojo'];
/**
 * Una cosa pintada que se toca: la silla vacía, la tele, el balde. El bicho no tiene ojos porque
 * es una cosa o porque no se lo ve, y se toca el lugar donde está: `[x, y, radio del toque]`.
 */
export type Cosa = readonly [number, number, number];

/* ------------------------------------------------------------------
   El galpón de Patricio Rey: un tablado, una silla vacía y la gente
   ------------------------------------------------------------------ */

export const GALPON = {
  /** La luz roja de atrás, arriba a la derecha, como en la tapa de *En directo*. */
  luz: { x: 760, y: 70 },
  /** El disco colgado de fondo del escenario. */
  disco: { x: 450, y: 176, r: 118 },
  /** El borde del tablado: de acá para arriba es escenario. */
  tablado: { fondo: 318, borde: 410 },
  /** La silla vacía, con el cono del seguidor encima. Las patas tocan el tablado en `piso`. */
  silla: { x: 450, piso: 382 },
  /** La mesita con la fuente de buñuelos, al lado de la silla. */
  fuente: { x: 566, piso: 376 },
  /** La bestia pop: un bulto grande que brilla, parado del otro lado. */
  bestiaPop: { x: 262, piso: 392, alto: 190 },
  /** Desde acá para abajo está la gente, de espaldas, mirando la silla. */
  gente: 470,
} as const;

export const OJOS_DEL_GALPON: Readonly<Record<string, Ojos>> = {
  'la-bestia-pop': [264, 196, 'oro'],
};
export const COSAS_DEL_GALPON: Readonly<Record<string, Cosa>> = {
  'patricio-rey': [450, 330, 50],
  'redonditos-de-ricota': [566, 344, 36],
};

/* ------------------------------------------------------------------
   El árbol del gran bonete: la llanura roja de *Luzbelito*
   ------------------------------------------------------------------ */

export const ARBOL = {
  /** La línea donde la llanura roja se junta con el cielo violeta. */
  horizonte: 352,
  /** El tronco: el pie en la tierra y de dónde salen las ramas. */
  tronco: { x: 450, pie: 500, horqueta: 214, ancho: 64 },
  /** El fruto raro, colgado de una rama a la derecha. */
  fruto: { x: 596, y: 226, r: 22 },
  /** El marco ovalado de cobre de la tapa, colgado vacío de una rama a la izquierda. */
  marco: { x: 286, y: 262, rx: 34, ry: 48 },
  /** La rama soldada de la que duerme colgado el que sueña con angelitos. */
  soldada: { x0: 488, y0: 300, x1: 660, y1: 312 },
  /** Los nidos de los pájaros de la noche, en la copa. */
  nidos: [
    [364, 132],
    [534, 98],
  ],
} as const;

export const OJOS_DEL_ARBOL: Readonly<Record<string, Ojos>> = {
  'el-senor-de-los-cielos': [452, 20, 'papel'],
  'el-bicho-del-gran-bonete': [628, 212, 'oro'],
  'el-jocker-burlon': [318, 352, 'oro'],
  'el-monito-que-trepa': [474, 374, 'papel'],
  'la-lechuza-que-circula': [800, 98, 'oro'],
  'el-angel-de-la-soledad': [372, 470, 'papel'],
  'el-angel-guardian': [640, 472, 'papel'],
  'los-angelitos-profesionales': [730, 526, 'papel'],
  'el-que-duerme-colgado': [612, 382, 'papel'],
  'el-angelito-frito': [176, 532, 'papel'],
};
export const COSAS_DEL_ARBOL: Readonly<Record<string, Cosa>> = {
  'los-pajaros-de-la-noche': [364, 132, 40],
};

/* ------------------------------------------------------------------
   Cybersiberia: la tele prendida en la nieve
   ------------------------------------------------------------------ */

export const CYBER = {
  /** Donde la nieve se junta con el cielo de acero. */
  horizonte: 330,
  /** La tele: una consola de acero remachada, con la pantalla de ojo de buey de *Último bondi*. */
  tele: { x: 450, piso: 404, ancho: 250, alto: 196, pantalla: { y: 290, r: 72 } },
  /** Las puntas de la antena de conejo: en la izquierda esperan los buitres. */
  antena: { izq: [372, 92], der: [548, 74] },
  /** La tele chica, caída en la nieve, que pasa el noticiero. */
  teleChica: { x: 150, piso: 546, ancho: 96, alto: 74 },
  /** La fila de puntos que se come el pac-man, y dónde está él. */
  puntos: { desde: 262, hasta: 664, y: 584 },
  pacman: { x: 690, y: 580, r: 18 },
} as const;

export const OJOS_DE_CYBERSIBERIA: Readonly<Record<string, Ojos>> = {
  'el-rey-garufa': [722, 432, 'papel'],
  'super-walter': [640, 100, 'oro'],
  comboman: [806, 462, 'papel'],
  'la-princesita-sapito': [566, 530, 'oro'],
  'porco-rex': [214, 472, 'rojo'],
  'los-camellos-prestigiosos': [96, 380, 'papel'],
  drogocop: [328, 492, 'rojo'],
  'el-super-boca': [860, 404, 'papel'],
};
export const COSAS_DE_CYBERSIBERIA: Readonly<Record<string, Cosa>> = {
  'el-capitan-buscapina': [450, 474, 44],
  'el-alien-duce': [450, 290, 58],
  'la-divina-tv-fuhrer': [450, 386, 30],
  'los-buitres-de-la-tele': [374, 96, 32],
  'el-gavilan': [124, 74, 40],
  'el-pac-man': [690, 580, 30],
  'las-monjas-verdes': [150, 512, 40],
};

/* ------------------------------------------------------------------
   Los astilleros: el muelle de noche, en la tiza azul de *Cordero atado*
   ------------------------------------------------------------------ */

export const ASTILLERO = {
  /** La otra orilla, y el agua quieta entre las dos. */
  orilla: 300,
  /** El canto del muelle: de acá para abajo son tablones. */
  muelle: 432,
  /** La pila de containers a la izquierda, con el pibe arriba. */
  pila: { x0: 26, x1: 318, arriba: 196, piso: 440 },
  /** El farol de sodio del muelle; de su poste y de la pila cuelga la hamaca. */
  farol: { x: 440, piso: 476, alto: 240 },
  hamaca: { desde: [318, 372], hasta: [436, 376], comba: 26 },
  /** El ferry que sale, en el agua, y la planchada que baja al muelle. */
  ferry: { x0: 570, x1: 880, agua: 372, cubierta: 340 },
  planchada: { muelle: [486, 432], cubierta: [594, 340] },
  /** La caña apoyada en una bita. Del que mordió el anzuelo, que cuelga de la punta, se ocupa `rig-anzuelo.ts`. */
  cania: { x: 716, piso: 476, punta: [770, 322] },
  /** El lanchón amarrado en la punta del muelle, con la proa para la izquierda. */
  lanchon: { x0: 784, x1: 910, agua: 430 },
  /** El balde de las almejas y la valija del as del Club París. */
  balde: { x: 470, piso: 566 },
  valija: { x: 262, piso: 520 },
} as const;

export const OJOS_DE_LOS_ASTILLEROS: Readonly<Record<string, Ojos>> = {
  'el-pibe-de-los-astilleros': [150, 170, 'papel'],
  'la-rana-rubia': [270, 184, 'oro'],
  'la-gran-lady': [380, 400, 'papel'],
  'el-botija-rapado': [532, 382, 'papel'],
  'la-hija-del-fletero': [736, 308, 'papel'],
  'la-del-lanchon': [816, 372, 'papel'],
  'el-as-del-club-paris': [236, 468, 'papel'],
};
export const COSAS_DE_LOS_ASTILLEROS: Readonly<Record<string, Cosa>> = {
  'la-pequena-novia-del-carioca': [640, 404, 40],
  'el-que-mordio-el-anzuelo': [770, 424, 30],
  'las-almejas': [470, 548, 30],
};

/* ------------------------------------------------------------------
   La mesa servida: un collage rojo de *La mosca y la sopa*
   ------------------------------------------------------------------ */

export const MESA = {
  /** El canto de atrás y el de adelante del tablero (más ancho, porque está más cerca), y lo que cuelga el mantel. */
  tablero: { atras: 330, adelante: 428, izq: 70, der: 830, cuelga: 506 },
  /** La olla de la contratapa, en el medio de la mesa. */
  olla: { x: 450, piso: 372, ancho: 128, alto: 92 },
  /** El seguidor que se escapa de la foto del escenario y cae sobre la olla. */
  haz: { desde: [812, 64], hasta: [450, 360] },
  /** El frasco de miel, con la fila de hormigas que llega hasta el borde. */
  miel: { x: 646, piso: 392 },
  /** El vaso boca abajo con el moscón adentro. */
  vaso: { x: 760, piso: 400 },
  /** El membrillo, y la hormiga dormida al lado. */
  membrillo: { x: 548, piso: 418 },
  /** El queso, con la mula al lado, y la manzana de Pituca. */
  queso: { x: 236, piso: 410 },
  manzana: { x: 346, piso: 404 },
  /** La ventana que da a la pastura. */
  ventana: { x0: 412, x1: 522, arriba: 64, abajo: 200 },
} as const;

export const OJOS_DE_LA_MESA: Readonly<Record<string, Ojos>> = {
  'el-canibal': [98, 296, 'rojo'],
  'el-canibal-desdentado': [176, 290, 'papel'],
  'la-mula-de-la-enfermedad': [252, 288, 'papel'],
  pituca: [324, 292, 'papel'],
  'el-club-de-mantis': [600, 284, 'oro'],
  'la-tipa-rapaz': [700, 252, 'papel'],
  'el-verdugo-que-cena': [806, 292, 'papel'],
};
export const COSAS_DE_LA_MESA: Readonly<Record<string, Cosa>> = {
  'la-mosca': [470, 232, 26],
  'el-moscon-zumbon': [760, 384, 28],
  // Se corrió de al lado del verdugo, que ahora tiene el hacha ahí: zumba al costado de la ventana.
  'el-moscardon-imaginario': [540, 206, 30],
  'las-hormigas': [672, 414, 26],
  'la-hormiga-dormida': [570, 416, 22],
};

/* ------------------------------------------------------------------
   La ruta del último bondi: la ruta es el surco del disco
   ------------------------------------------------------------------ */

export const RUTA = {
  /** El horizonte, con el mundo redondo recortado a lo lejos. */
  horizonte: 318,
  /** La banquina de arriba, el asfalto y la de abajo. */
  asfalto: { arriba: 430, abajo: 560 },
  /** Los dos carriles: por donde pasan los fierros, de izquierda a derecha. */
  carriles: [490, 546],
  /** El taxi paranormal, volcado en la banquina de abajo. */
  volcado: { x: 690, piso: 612 },
} as const;

export const OJOS_DE_LA_RUTA: Readonly<Record<string, Ojos>> = {
  'la-bella-senora-desencarnada': [520, 378, 'papel'],
  'la-piba-de-greenpeace': [252, 598, 'papel'],
};
export const COSAS_DE_LA_RUTA: Readonly<Record<string, Cosa>> = {
  'el-taxi-paranormal': [690, 590, 44],
};

/**
 * Los fierros que pasan por la ruta: cada uno es una imagen impresa con el (0, 0) donde las ruedas
 * tocan el carril, su caja alrededor, y la isla los corre de costado (`recintoDeRuta`). `x` es
 * dónde está cada uno cuando la escena se ve quieta.
 */
export const FIERROS = {
  'el-zumba': { pieza: 'ruta-bondi', carril: 0, caja: [-176, -150, 470, 166], x: 250 },
  'el-heroe-del-whisky': { pieza: 'ruta-camion', carril: 0, caja: [-130, -118, 400, 132], x: 760 },
  'la-mariposa-pontiac': { pieza: 'ruta-pontiac', carril: 1, caja: [-110, -150, 360, 166], x: 560 },
  'el-toxi-taxi': { pieza: 'ruta-taxi', carril: 1, caja: [-240, -84, 470, 98], x: 120 },
} as const;
