/**
 * El motor de "Ponelos en fila" (`US-08`). Implementa `CTR-13`.
 *
 * Funciones puras sobre un dato flaco, y las dos cosas están relacionadas: **el tablero
 * es un arreglo de números paralelo a la lista de fichas**, un número por ficha, donde 0
 * es "sin ubicar" y 1..n son las filas, por posición. Las de siempre son cuatro; desde
 * `D-69` el jugador arma las suyas, de dos a siete, y por eso casi todas las funciones de
 * abajo reciben **cuántas filas hay** (por defecto, las cuatro de `filas.ts`).
 *
 * ## Por qué un arreglo de números y no un mapa de objetos
 *
 * Porque es exactamente lo que viaja en el link. `ADR-06` empaqueta tres bits por ficha
 * en el orden canónico del conjunto; si acá adentro el tablero fuera un `Map` de slugs a
 * objetos, habría que traducir de ida y de vuelta, y esa traducción es el lugar donde se
 * mete un desfasaje que nadie ve hasta que un link viejo abre la lista corrida un lugar.
 * Con esta forma, compartir es empaquetar el mismo arreglo que la pantalla ya tiene.
 *
 * ## La decisión que más se nota jugando: dentro de una fila, el orden es el del catálogo
 *
 * Una tier list de la web ordena cada fila **por orden de llegada**: la ficha que soltaste
 * última queda última. Acá no, y no es pereza.
 *
 * El link lleva **en qué fila** está cada ficha y nada más — el orden de llegada serían
 * otros ~7 bits por ficha para un dato que no significa nada, porque adentro de una fila
 * no hay ranking. Si la pantalla usara orden de llegada y el link no lo llevara, **la
 * lista que abre el que la recibe no sería la que armó el que la mandó**: mismas fichas,
 * otro orden, y nadie se enteraría. Entre "se ve raro al colocar" y "el compartido miente
 * en silencio", gana lo primero.
 *
 * De yapa, el orden del catálogo es el del disco: la fila queda leyéndose como un
 * tracklist, que es como se lee un disco de verdad.
 *
 * ## Lo que este archivo no hace, y es a propósito
 *
 * **No devuelve ningún puntaje, ni ninguna comparación entre filas.** `BR-22` prohíbe que
 * el sitio tenga un orden correcto, y la forma de hacerlo cumplir desde el tipo —el mismo
 * mecanismo que usó `dos-ejes/partida.ts`— es que acá no exista la función que lo
 * calcularía. `cuentas()` devuelve cuántas hay en cada fila, que es orientación (como el
 * "3 de 10" del test de dos ejes) y no medición: no las compara, no las ordena y no dice
 * cuál está mejor.
 */

import { FILAS, SIN_UBICAR, MAX_FILAS, MIN_FILAS, filasDe, nombresDeSiempre, type FilaPropia } from './filas.ts';

/** Una ficha del conjunto, tal como la ve el navegador (`CTR-13`). */
export interface Ficha {
  /** Identidad. Sale de `slugDeTitulo` para los temas y del slug del disco para los discos. */
  readonly slug: string;
  readonly titulo: string;
  /** El disco al que pertenece: es lo que la viste con su tinta real (`RES-37`, `D-19`). */
  readonly disco: string;
  /** El renglón chico: número de pista, o año del disco. Registro 3. */
  readonly pie: string;
  /** La tapa, cuando la ficha se mira en vez de leerse. `null` es un hueco declarado. */
  readonly imagen: string | null;
}

/** Cómo se dibuja una ficha de este conjunto. Lo decide el conjunto, nunca la ficha. */
export type FormatoFicha = 'tapa' | 'titulo';

/** Un conjunto ordenable: lo que la página arma en build y le pasa a la isla (`CTR-13`). */
export interface Conjunto {
  /** El id que viaja en el link. Fija el orden canónico de referencia (`ADR-06`). */
  readonly id: string;
  readonly nombre: string;
  /** La línea que canta, arriba del tablero. */
  readonly bajada: string;
  readonly formato: FormatoFicha;
  readonly fichas: readonly Ficha[];
}

/** Un número por ficha, en el orden del conjunto. 0 = sin ubicar, 1..n = fila. */
export type Reparto = readonly number[];

export class RepartoInvalido extends Error {}

/** El tablero vacío: todas las fichas en la bandeja. */
export function vacio(cuantas: number): Reparto {
  if (!Number.isInteger(cuantas) || cuantas < 1) {
    throw new RepartoInvalido(`un conjunto de ${cuantas} fichas no se puede repartir`);
  }
  return new Array<number>(cuantas).fill(SIN_UBICAR);
}

/**
 * ¿Este arreglo describe un tablero de `cuantas` fichas?
 *
 * Es la guarda de lo que entra por el link, y por eso es estricta con el largo: un reparto
 * más corto o más largo que el conjunto **no es un reparto de ese conjunto**. Se rechaza
 * entero en vez de completarlo con ceros — completar sería inventarle al que compartió una
 * lista que no armó.
 */
export function esValido(reparto: unknown, cuantas: number, filas: number = FILAS.length): reparto is Reparto {
  if (!Array.isArray(reparto) || reparto.length !== cuantas) return false;
  return reparto.every((v) => Number.isInteger(v) && v >= SIN_UBICAR && v <= filas);
}

/**
 * Mueve una ficha, y devuelve un tablero nuevo.
 *
 * `fila` en `SIN_UBICAR` la devuelve a la bandeja, que es lo que hace sacarla de una fila.
 * **Una ficha nunca se borra**: el conjunto es fijo, y lo único que cambia es dónde está.
 */
export function ubicar(reparto: Reparto, indice: number, fila: number, filas: number = FILAS.length): Reparto {
  if (!Number.isInteger(indice) || indice < 0 || indice >= reparto.length) {
    throw new RepartoInvalido(`no hay ficha en la posición ${indice}`);
  }
  if (!Number.isInteger(fila) || fila < SIN_UBICAR || fila > filas) {
    throw new RepartoInvalido(`${fila} no es ninguna de las ${filas} filas`);
  }
  const copia = [...reparto];
  copia[indice] = fila;
  return copia;
}

/** Todas a la bandeja. Es lo que hace el botón de empezar de nuevo. */
export function vaciar(reparto: Reparto): Reparto {
  return vacio(reparto.length);
}

/**
 * Cuántas fichas hay en cada fila, más cuántas quedan sin ubicar.
 *
 * Orientación, no medición — ver el encabezado. Se devuelve indexado por el número de
 * fila para que la pantalla no tenga que contar de nuevo en cada repintado.
 */
export function cuentas(reparto: Reparto, filas: number = FILAS.length): Readonly<Record<number, number>> {
  const cuenta: Record<number, number> = { [SIN_UBICAR]: 0 };
  for (let f = 1; f <= filas; f++) cuenta[f] = 0;
  for (const v of reparto) cuenta[v] = (cuenta[v] ?? 0) + 1;
  return cuenta;
}

/** Cuántas quedan en la bandeja. Cero significa que la lista está armada. */
export function restan(reparto: Reparto): number {
  return reparto.filter((v) => v === SIN_UBICAR).length;
}

/** ¿Ya está todo ubicado? Es lo único que termina una partida — no hay tiempo ni vidas. */
export function terminado(reparto: Reparto): boolean {
  return restan(reparto) === 0;
}

/** Una fila con las fichas que le tocaron, **en el orden del catálogo** (ver encabezado). */
export interface FilaArmada {
  readonly fila: FilaPropia;
  readonly fichas: readonly Ficha[];
}

/**
 * Las filas armadas, siempre todas, aunque alguna esté vacía. `nombres` son las filas del
 * tablero, en orden; sin decir nada, las cuatro de siempre.
 */
export function porFila(
  conjunto: Conjunto,
  reparto: Reparto,
  nombres: readonly string[] = nombresDeSiempre(),
): readonly FilaArmada[] {
  if (!esValido(reparto, conjunto.fichas.length, nombres.length)) {
    throw new RepartoInvalido(`el reparto no corresponde al conjunto "${conjunto.id}"`);
  }
  return filasDe(nombres).map((fila) => ({
    fila,
    fichas: conjunto.fichas.filter((_, i) => reparto[i] === fila.id),
  }));
}

/* ==================================================================
   Las filas propias (`D-69`): sumar, sacar y renombrar

   Renombrar no toca el reparto —el número de una fila es su posición, no su nombre—, así
   que no tiene función acá: es cambiar una cadena en la lista de nombres. Sumar tampoco:
   la fila nueva va al final y nadie la ocupa todavía. **Sacar sí**, y es lo único delicado
   de las filas propias: las fichas de la fila que se va vuelven a la bandeja, y las de las
   filas de abajo suben un número, porque ahora están una posición más arriba.
   ================================================================== */

export class FilasInvalidas extends Error {}

/** ¿Se puede sumar una fila más a un tablero de `filas`? */
export function entraOtraFila(filas: number): boolean {
  return filas < MAX_FILAS;
}

/** ¿Se puede sacar una fila de un tablero de `filas`? */
export function sePuedeSacar(filas: number): boolean {
  return filas > MIN_FILAS;
}

/**
 * Saca la fila `id` de un tablero de `filas` filas, y devuelve el reparto renumerado.
 *
 * Las fichas que estaban ahí **vuelven a la bandeja, no se borran** —la misma regla que
 * sacar una ficha de una fila—. Las de las filas de abajo bajan un número.
 */
export function sacarFila(reparto: Reparto, id: number, filas: number): Reparto {
  if (!sePuedeSacar(filas)) throw new FilasInvalidas(`con ${filas} filas no se puede sacar ninguna`);
  if (!Number.isInteger(id) || id < 1 || id > filas) {
    throw new FilasInvalidas(`${id} no es ninguna de las ${filas} filas`);
  }
  return reparto.map((v) => (v === id ? SIN_UBICAR : v > id ? v - 1 : v));
}

/**
 * Un reparto que llegó con más filas de las que hay ahora (un link de siete abierto con
 * las cuatro de siempre, o al revés) se ajusta: lo que cae fuera vuelve a la bandeja.
 */
export function ajustarAFilas(reparto: Reparto, filas: number): Reparto {
  return reparto.map((v) => (v > filas ? SIN_UBICAR : v));
}

/** Las que siguen en la bandeja, en el orden del catálogo. */
export function enLaBandeja(conjunto: Conjunto, reparto: Reparto): readonly Ficha[] {
  return conjunto.fichas.filter((_, i) => reparto[i] === SIN_UBICAR);
}
