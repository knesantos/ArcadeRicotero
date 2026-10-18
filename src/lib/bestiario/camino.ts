/**
 * El camino con cruces (`D-73`, séptima vuelta): cada región es una página que se camina de
 * costado bajando con el dedo, y al final hay un cruce con un cartel por cada región vecina.
 *
 * Esto son números, como `rig.ts`: lo lee la página para armar la escena y lo lee la isla para
 * moverla, y no puede importar nada que dibuje (`camino.test.ts` lo vigila).
 *
 * ## Cómo se camina
 *
 * La escena es una tira más ancha que la pantalla, en capas. Cada capa se corre a su velocidad:
 * lo lejano (`f` < 1) va más despacio que el piso, y lo de adelante (`f` > 1) pasa más rápido. El
 * piso es la capa de los bichos y va a la velocidad del dedo: un píxel de bajar es un píxel de
 * caminar. Todo se mide en unidades de escena, con el alto fijo en `ALTO`; en la pantalla la
 * escena se escala para que el alto llene la vista.
 */

/** El alto de toda escena del camino, el mismo de los recintos de noche (`rig.ts`). */
export const ALTO = 640;

/** Lo ancho que puede ser la vista, en unidades de escena; más allá, la escena no se estira. */
export const VISTA_MAX = 1400;
/** Lo angosto: un teléfono parado, con la escena escalada al alto. */
export const VISTA_MIN = 280;

/** Las velocidades de las capas: lo lejano, el piso con los bichos y lo de adelante. */
export const VELOCIDAD = { lejos: 0.45, piso: 1, frente: 1.3 } as const;

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

export interface Tramo {
  /** La región del JSON (`bestiario.json`). */
  region: string;
  /** El ancho del piso, en unidades de escena. */
  ancho: number;
  /** Las piezas impresas de cada capa (`arte-camino.ts`). */
  piezas: { lejos: string; piso: string; frente: string };
  /** Los que se ven como ojos, en coordenadas del piso. */
  ojos: Readonly<Record<string, Ojos>>;
  /** El lobo suelto, si acecha en este tramo: dónde asoma. */
  lobo?: { x: number };
  /**
   * El claro de la pastura, si está en este tramo: cuánto se corre la escena del recinto
   * (`rig.ts`, con el palo en `PALO`) para caer en el piso del camino. Adentro del claro valen
   * las mismas coordenadas que en el recinto del monte, y la isla mueve al lobo y al cordero
   * con la misma lógica.
   */
  claro?: { dx: number; ojos: Readonly<Record<string, Ojos>> };
  /** Los que no viven en la región pero andan por el tramo (el lobo en la pastura). */
  deVisita?: readonly string[];
}

/**
 * Los tramos que ya se caminan. El monte y la pastura son el primero de prueba: la pastura es
 * un claro adentro del monte (`D-73`), así que las dos comparten lo lejano y lo de adelante, y
 * el que pasa de una a otra sigue viendo los mismos árboles.
 */
export const CAMINOS: Readonly<Record<string, Tramo>> = {
  'el-monte': {
    region: 'el-monte',
    ancho: 2400,
    piezas: { lejos: 'camino-monte-lejos', piso: 'camino-monte-piso', frente: 'camino-monte-frente' },
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
    ancho: 2400,
    piezas: { lejos: 'camino-monte-lejos', piso: 'camino-pastura-piso', frente: 'camino-monte-frente' },
    ojos: {},
    claro: {
      dx: 720,
      // Los mismos lugares que en el recinto del monte (`escena-monte.ts`).
      ojos: {
        'el-ovejero': [168, 396, 'oro'],
        'el-borrego': [214, 470, 'papel'],
        'aquella-solitaria-vaca-cubana': [722, 350, 'papel'],
        'el-rebano': [640, 560, 'papel'],
      },
    },
    deVisita: ['el-lobo-suelto'],
  },
};

/** Las regiones que ya tienen su camino. */
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

/** La cuenta de la cámara: dónde está la vista para un avance `p` de 0 a 1, en píxeles. */
export function camara(p: number, anchoPx: number, vistaPx: number): number {
  return Math.max(0, anchoPx - vistaPx) * Math.min(1, Math.max(0, p));
}
