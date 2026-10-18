/**
 * El elenco de la decimoquinta vuelta (`D-73`): diez que pasan de ojos en lo oscuro a títere, uno
 * por entorno, empezando por los que no tenían ninguno.
 *
 * Cada personaje vive entero en sus archivos: el dibujo en `arte-<slug>.ts`, los números en
 * `rig-<slug>.ts` y la conducta en `scripts/bestiario/<slug>.ts`. Este registro es lo único que los
 * junta, y lo leen las escenas (`escenas.ts`, `escenas-entornos.ts`, `escenas-camino.ts`), la imprenta
 * (`arte.ts`) y el retrato de la ficha (`titeres.ts`). Mientras un personaje vale `null`, sigue siendo
 * ojos en lo oscuro como antes; cuando tiene títere, deja de dibujarse como ojos o como cosa.
 *
 * Todo lo que dibuja un personaje va en las coordenadas del recinto (900 × 640). El camino pinta los
 * seis entornos más anchos y corre lo fijo con `k` (`K_ENTORNO`): por eso cada capa va envuelta en un
 * marco que la corre `ancla · (k − 1)`, y adentro todo sigue en las coordenadas del recinto. La isla
 * encuentra a cada personaje por su marco (`[data-marco]`, `scripts/bestiario/vivos.ts`).
 */

import type { Pieza } from './aerografo.ts';
import { BESTIA_POP } from './arte-bestia-pop.ts';
import { MONITO } from './arte-monito.ts';
import { BUSCAPINA } from './arte-buscapina.ts';
import { PIBE } from './arte-pibe.ts';
import { CANIBAL } from './arte-canibal.ts';
import { PONTIAC } from './arte-pontiac.ts';
import { DIABLO } from './arte-diablo.ts';
import { RATO } from './arte-rato.ts';
import { MORTA } from './arte-morta.ts';
import { ESCLAVO } from './arte-esclavo.ts';

export type Nombres = ReadonlyMap<string, string>;

/**
 * Dónde va cada capa en la escena de su recinto:
 * - `atras`: lo más hondo que no es el cielo. En los seis entornos, entre lo lejano y el piso (el piso
 *   lo tapa); en los recintos de títeres, después del fondo (en la prisión, detrás de la reja de las
 *   celdas; en el bajo, detrás de Pierre).
 * - `figura`: donde se para un títere. Delante de los ojos, las cosas y los demás títeres, y detrás de
 *   lo de adelante (`*-frente`).
 * - `delante`: encima de todo, lo de adelante incluido.
 */
export type Capa = 'atras' | 'figura' | 'delante';

export interface Personaje {
  /** El id de la bestia en `bestiario.json`. */
  id: string;
  /** Su región en `bestiario.json`: la escena que lo dibuja. */
  region: string;
  /** Dónde está parado en el recinto (la `x` de 900). El camino lo corre a `ancla · k`. */
  ancla: number;
  /** Sus piezas impresas: la imprenta las imprime y el test mira que estén en `public/bestiario`. */
  piezas: readonly Pieza[];
  /**
   * Lo que dibuja en cada capa, en coordenadas del recinto. Lo que se toca es un grupo con
   * `class="titere titere--<slug>"`, `data-id`, `role="button"`, `tabindex="0"` y `aria-label`: la
   * conducta le pone su toque.
   */
  capas: Partial<Record<Capa, (nombres: Nombres) => string>>;
  /**
   * Solo en la ruta: el títere que reemplaza a la imagen de su fierro, con el (0, 0) donde las ruedas
   * tocan el carril, como la imagen. Viaja adentro del `.cuerpo` del fierro, así que el tránsito lo
   * mueve igual que a los otros.
   */
  fierro?: () => string;
  /** El retrato de la ficha: el títere quieto, encuadrado en `caja` (x, y, ancho, alto). */
  retrato?: { caja: readonly [number, number, number, number]; cuerpo: () => string };
}

/** Los diez lugares, en el orden del recorrido. `null` es que todavía son ojos en lo oscuro. */
const LUGARES: ReadonlyArray<Personaje | null> = [BESTIA_POP, MONITO, BUSCAPINA, PIBE, CANIBAL, PONTIAC, DIABLO, RATO, MORTA, ESCLAVO];

/** Los que ya tienen títere. */
export const ELENCO: readonly Personaje[] = LUGARES.filter((p): p is Personaje => p !== null);

/** Los ids que ya no se dibujan como ojos ni como cosa: tienen títere. */
export const CON_TITERE: ReadonlySet<string> = new Set(ELENCO.map((p) => p.id));

/** Todas las piezas del elenco, para la imprenta (`arte.ts`). */
export const PIEZAS_ELENCO: readonly Pieza[] = ELENCO.flatMap((p) => p.piezas);

/** Saca de una lista de ojos o de cosas a los que ya tienen títere. */
export function sinTitere<T>(lugares: Readonly<Record<string, T>>): Readonly<Record<string, T>> {
  return Object.fromEntries(Object.entries(lugares).filter(([id]) => !CON_TITERE.has(id)));
}

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/**
 * El marcado de los personajes de una región para una capa. Cada uno va en su marco, corrido
 * `ancla · (k − 1)`: en el recinto `k` es 1 y el marco no corre nada; en el camino, el piso largo de
 * los seis entornos pide `K_ENTORNO`.
 */
export function capasDe(region: string, capa: Capa, nombres: Nombres, k = 1): string {
  return ELENCO.filter((p) => p.region === region && p.capas[capa])
    .map((p) => {
      const dx = Math.round(p.ancla * (k - 1));
      const corre = dx ? ` transform="translate(${f(dx)} 0)"` : '';
      return `<g data-marco="${p.id}" data-capa="${capa}" data-dx="${dx}"${corre}>${p.capas[capa]!(nombres)}</g>`;
    })
    .join('');
}

/** El títere que viaja en lugar de la imagen de un fierro de la ruta, o `null` si sigue siendo la imagen. */
export function fierroDe(id: string): string | null {
  const p = ELENCO.find((q) => q.id === id && q.fierro);
  return p ? `<g data-marco="${p.id}" data-capa="fierro" data-dx="0">${p.fierro!()}</g>` : null;
}

/** El retrato de ficha de un personaje del elenco, o `null`. */
export function retratoDe(id: string): Personaje['retrato'] | null {
  return ELENCO.find((p) => p.id === id)?.retrato ?? null;
}

/** Los ids del elenco que viven en una región (tengan títere o no): el test los cuenta. */
export const LUGAR_EN_EL_ELENCO: Readonly<Record<string, string>> = {
  'la-bestia-pop': 'el-galpon',
  'el-monito-que-trepa': 'el-arbol',
  'el-capitan-buscapina': 'cybersiberia',
  'el-pibe-de-los-astilleros': 'los-astilleros',
  'el-canibal': 'la-mesa',
  'la-mariposa-pontiac': 'la-ruta',
  'el-diablo-que-mea-en-todas-partes': 'el-infierno',
  'el-rato-molhado': 'el-bajo',
  'el-morta': 'el-templo',
  'el-esclavo-sensible-y-chillon': 'la-prision',
};
