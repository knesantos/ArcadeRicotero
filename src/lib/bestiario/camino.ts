/**
 * El camino con cruces (`D-73`, séptima vuelta): cada región es una página que se camina de
 * costado, y al final hay un cruce con un cartel por cada región vecina. Desde `D-77` son las trece:
 * todos los entornos están conectados, y se entra al bestiario caminando.
 *
 * Esto son números, como `rig.ts`: lo lee la página para armar la escena y lo lee la isla para
 * moverla, y no puede importar nada que dibuje (`camino.test.ts` lo vigila).
 *
 * ## Cómo se camina
 *
 * La escena es una tira más ancha que la pantalla, en capas. Cada capa se corre a su velocidad:
 * lo lejano (`f` < 1) va más despacio que el piso, y lo de adelante (`f` > 1) pasa más rápido. El
 * piso es la capa de los bichos y va a la velocidad del dedo: un píxel de deslizar es un píxel de
 * caminar. Todo se mide en unidades de escena, con el alto fijo en `ALTO`; en la pantalla la
 * escena se escala para que el alto llene la vista.
 *
 * ## Tres formas de tramo (`D-77`)
 *
 * - **largo**: el monte y la pastura, con su arte propio a lo largo (`arte-camino.ts`). El cruce
 *   va encima del final del piso, donde asoma la luz de la región que sigue.
 * - **entorno**: los seis de la décima vuelta, pintados a lo largo con las mismas funciones que
 *   pintan su recinto (`arte-entornos.ts`, que reciben el ancho). Las cosas fijas se corren con
 *   `k = LARGO / 900`, y los bichos van donde el dibujo los espera.
 * - **recinto**: los cinco recintos de títeres, enteros. Son chicos por naturaleza: no se caminan,
 *   se ven a pantalla completa y se recorren con el dedo. El pedido del usuario: *"si el entorno es
 *   chico por naturaleza del concepto está bien que no se camine, pero debe ser inmersivo"*.
 *
 * Los entornos y los recintos terminan en una pieza de cruce (`camino-<región>-cruce`): la noche
 * de afuera se come el borde de la escena, y ahí, sin ningún bicho abajo, se paran los carteles.
 */

/** El alto de toda escena del camino, el mismo de los recintos de noche (`rig.ts`). */
export const ALTO = 640;

/** Lo ancho que puede ser la vista, en unidades de escena; más allá, la escena no se estira. */
export const VISTA_MAX = 1400;
/** Lo angosto: un teléfono parado, con la escena escalada al alto. */
export const VISTA_MIN = 280;

/** Las velocidades de las capas del monte: lo lejano, el piso con los bichos y lo de adelante. */
export const VELOCIDAD = { lejos: 0.45, piso: 1, frente: 1.3 } as const;

/** El ancho de un recinto de noche (`ESCENA` en `rig.ts`). */
export const RECINTO = 900;
/** Lo largo de un entorno de la décima vuelta pintado para caminarlo. */
export const LARGO = 2400;
/** Cuánto se corren las cosas fijas de un entorno pintado a lo largo. */
export const K_ENTORNO = LARGO / RECINTO;
/** El cruce, al final de la escena: lo que ocupa la noche de afuera con los carteles. */
export const CRUCE = 440;
/**
 * Lo que la pieza del cruce se mete sobre el final de la escena, para comerse el borde. Poco: en
 * los recintos hay bichos pegados al borde (las sirenas del bajo, en 862 de 900).
 */
export const SOLAPE = 70;

/**
 * Lo ancha que tiene que ser una capa para no quedarse corta en ninguna pantalla. Si la vista
 * mide `v` y el piso `ancho`, la cámara recorre `ancho - v`, y una capa de velocidad `f` tiene
 * que cubrir `f · (ancho - v) + v`. Lo lejano pide más con la vista más ancha; lo de adelante,
 * con la más angosta.
 */
export function anchoDeCapa(f: number, ancho: number): number {
  const v = f < 1 ? VISTA_MAX : VISTA_MIN;
  return Math.ceil(f * (ancho - v) + v);
}

/** Unos ojos en lo oscuro, en su lugar del piso: `[x, y, tinta]`. */
export type Ojos = readonly [number, number, 'oro' | 'papel'];

export type Forma = 'largo' | 'entorno' | 'recinto';

export interface Tramo {
  /** La región del JSON (`bestiario.json`). */
  region: string;
  forma: Forma;
  /** Todo lo que se recorre, en unidades de escena: la escena y, al final, el cruce. */
  ancho: number;
  /** Dónde termina la escena. En un tramo largo es el ancho: el cruce va encima del final. */
  escena: number;
  /** Las velocidades de lo lejano y lo de adelante; sin paralaje, las dos en 1. */
  velocidad: { lejos: number; frente: number };
  /**
   * Dónde lo lejano cae justo detrás del piso, como en el recinto: el disco colgado arriba de la
   * silla vacía, la ventana arriba de la olla. Caminando, lo lejano se corre más despacio, y se
   * acomoda para que coincidan cuando ese punto pasa por el medio de la vista. Cero: al arrancar.
   */
  foco: number;
  /** Las piezas impresas de cada capa (`arte-camino.ts`); `null`, la capa no está. */
  piezas: { lejos: string | null; piso: string | null; frente: string | null; cruce: string | null };
  /** Los que se ven como ojos, en coordenadas del piso (los tramos largos). */
  ojos: Readonly<Record<string, Ojos>>;
  /** El lobo suelto, si acecha en este tramo: dónde asoma. */
  lobo?: { x: number };
  /**
   * El claro de la pastura, si está en este tramo: cuánto se corre la escena del recinto
   * (`rig.ts`, con el palo en `PALO`) para caer en el piso del camino. Adentro del claro valen
   * las mismas coordenadas que en el recinto del monte, y la isla mueve al lobo, al cordero y a
   * la vaca cubana con la misma lógica.
   */
  claro?: { dx: number; ojos: Readonly<Record<string, Ojos>> };
  /** Los que no viven en la región pero andan por el tramo (el lobo en la pastura). */
  deVisita?: readonly string[];
}

const SIN_PARALAJE = { lejos: 1, frente: 1 } as const;

/**
 * Un entorno de la décima vuelta, pintado a lo largo. `lejos`: lo despacio que va el fondo (los de
 * adentro, el galpón y la mesa, tienen la pared cerca). `foco`: el centro del recinto de 900 (`foco`
 * en `escenas-entornos.ts`), corrido a lo largo.
 */
function entorno(region: string, pieza: string, lejos: number, foco: number): Tramo {
  return {
    region,
    forma: 'entorno',
    ancho: LARGO + CRUCE,
    escena: LARGO,
    velocidad: { lejos, frente: VELOCIDAD.frente },
    foco: Math.round(foco * K_ENTORNO),
    piezas: { lejos: `camino-${pieza}-lejos`, piso: `camino-${pieza}-piso`, frente: `camino-${pieza}-frente`, cruce: `camino-${region}-cruce` },
    ojos: {},
  };
}

/** Un recinto de títeres, entero: la escena del bestiario, y el cruce pegado a su borde. */
function recinto(region: string): Tramo {
  return {
    region,
    forma: 'recinto',
    ancho: RECINTO + CRUCE,
    escena: RECINTO,
    velocidad: SIN_PARALAJE,
    foco: 0,
    piezas: { lejos: null, piso: null, frente: null, cruce: `camino-${region}-cruce` },
    ojos: {},
  };
}

/**
 * Los trece tramos, en el orden en que se entra: el monte primero. El monte y la pastura son el
 * primero de prueba: la pastura es un claro adentro del monte (`D-73`), así que las dos comparten
 * lo lejano y lo de adelante, y el que pasa de una a otra sigue viendo los mismos árboles.
 */
export const CAMINOS: Readonly<Record<string, Tramo>> = {
  'el-monte': {
    region: 'el-monte',
    forma: 'largo',
    ancho: 2400,
    escena: 2400,
    velocidad: { lejos: VELOCIDAD.lejos, frente: VELOCIDAD.frente },
    foco: 0,
    piezas: { lejos: 'camino-monte-lejos', piso: 'camino-monte-piso', frente: 'camino-monte-frente', cruce: null },
    ojos: {
      'las-antiguas-lobas': [380, 300, 'oro'],
      'el-animal-que-no-late': [660, 262, 'papel'],
      'el-lobo-caido': [900, 492, 'oro'],
      'el-joven-lobo': [1600, 282, 'oro'],
      'el-rey-de-esta-jungla': [1830, 250, 'papel'],
      'tu-animal': [2020, 338, 'oro'],
      'la-liebre-muerta': [2190, 528, 'papel'],
    },
    lobo: { x: 1260 },
  },
  'la-pastura': {
    region: 'la-pastura',
    forma: 'largo',
    ancho: 2400,
    escena: 2400,
    velocidad: { lejos: VELOCIDAD.lejos, frente: VELOCIDAD.frente },
    foco: 0,
    piezas: { lejos: 'camino-monte-lejos', piso: 'camino-pastura-piso', frente: 'camino-monte-frente', cruce: null },
    ojos: {},
    claro: {
      dx: 720,
      // Los mismos lugares que en el recinto del monte (`escena-monte.ts`).
      ojos: {
        'el-ovejero': [168, 396, 'oro'],
        'el-borrego': [214, 470, 'papel'],
        'el-rebano': [640, 560, 'papel'],
      },
    },
    deVisita: ['el-lobo-suelto'],
  },
  'la-mesa': entorno('la-mesa', 'mesa', 0.8, 450),
  'los-techos': recinto('los-techos'),
  'la-prision': recinto('la-prision'),
  'el-infierno': recinto('el-infierno'),
  'el-bajo': recinto('el-bajo'),
  // Los astilleros arrancan en la pila de containers, con el pibe arriba.
  'los-astilleros': entorno('los-astilleros', 'astillero', 0.5, 300),
  'el-templo': recinto('el-templo'),
  'cybersiberia': entorno('cybersiberia', 'cyber', 0.6, 450),
  'el-arbol': entorno('el-arbol', 'arbol', 0.5, 450),
  'el-galpon': entorno('el-galpon', 'galpon', 0.8, 450),
  // La ruta: el bondi del Zumba, que es el que la abre en el recinto.
  'la-ruta': entorno('la-ruta', 'ruta', 0.45, 250),
};

/** Las regiones que ya tienen su camino: todas, desde `D-77`. */
export const CON_CAMINO: readonly string[] = Object.keys(CAMINOS);

/**
 * Por dónde se entra al bestiario (`D-76`): caminando, por el primer tramo. El plano y los
 * recintos quedan en `/redondopedia/bestiario/`, a un toque desde el camino.
 */
export const ENTRADA = `/redondopedia/bestiario/${CON_CAMINO[0]}/`;

/** El recinto de una región en el plano viejo: el monte y la pastura son uno solo. */
export const recintoDe = (region: string): string =>
  region === 'el-monte' || region === 'la-pastura' ? 'monte-pastura' : region;

/**
 * Adónde lleva el cartel de una región: a su camino si ya lo tiene, y si no, a su recinto en
 * la página del bestiario. Al camino se entra por el principio (`#camino`).
 */
export function hrefDeRegion(region: string): string {
  return CON_CAMINO.includes(region)
    ? `/redondopedia/bestiario/${region}/#camino`
    : `/redondopedia/bestiario/#recinto-${recintoDe(region)}`;
}

/** Si un tramo tiene capas que se corren a otra velocidad que el piso. */
export const conParalaje = (t: Tramo): boolean => t.velocidad.lejos !== 1 || t.velocidad.frente !== 1;

/** La cuenta de la cámara: dónde está la vista para un avance `p` de 0 a 1, en píxeles. */
export function camara(p: number, anchoPx: number, vistaPx: number): number {
  return Math.max(0, anchoPx - vistaPx) * Math.min(1, Math.max(0, p));
}

/**
 * Cuánto se corre una capa, en píxeles, con la cámara en `cam`. Lo lejano se acomoda para caer
 * justo detrás del piso cuando el foco pasa por el medio de la vista (`foco`, en píxeles); antes
 * de eso no puede correrse para atrás, o asomaría el borde de su imagen.
 */
export function corrimiento(f: number, cam: number, focoPx: number, vistaPx: number): number {
  if (f >= 1) return f * cam;
  return f * cam + (1 - f) * Math.max(0, focoPx - vistaPx / 2);
}
