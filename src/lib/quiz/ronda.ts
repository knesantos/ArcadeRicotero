/**
 * Armado de la ronda. Implementa `BR-01` y el criterio 1 de `US-01`.
 *
 * `BR-01` tiene tres puntos y los tres son duros:
 *
 *  1. El primer item de toda partida es **Facil**. Nunca Media ni Dificil. Es la
 *     traduccion directa de "sin muro de entrada" (`D-09`), que `D-14` reformulo como
 *     **abrir los molinetes**: el que llega sin saber nada tiene que poder pasar.
 *  2. Dentro de la partida la dificultad **no baja**: facil -> media -> dificil.
 *  3. Tiene que haber suficientes faciles para que el primero no sea siempre el mismo.
 *     Un solo item facil no es escalonamiento, es una vidriera fija.
 *
 * El barajado es responsabilidad de esta funcion, asi que recibe la fuente de azar por
 * parametro: un test que no puede fijar la semilla no puede probar nada.
 */

import type { Dificultad, Item } from './banco.ts';

/** Orden de `BR-01`. El indice es lo que hace comparable la regla 2. */
const ORDEN: Record<Dificultad, number> = { facil: 0, media: 1, dificil: 2 };

export class RondaImposible extends Error {}

/** Fisher-Yates con azar inyectable. */
function barajar<T>(xs: readonly T[], azar: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * Arma una ronda que cumple `BR-01`.
 *
 * @param items  el banco jugable
 * @param largo  cuantas preguntas tiene la ronda (`US-01` criterio 1: 8)
 * @param azar   fuente de aleatoriedad, inyectable para los tests
 */
export function armarRonda(items: readonly Item[], largo: number, azar: () => number = Math.random): readonly Item[] {
  if (!Number.isInteger(largo) || largo <= 0) throw new RangeError('largo tiene que ser un entero positivo');
  if (items.length < largo) {
    throw new RondaImposible(`el banco tiene ${items.length} items y la ronda pide ${largo}`);
  }

  const faciles = items.filter((i) => i.dificultad === 'facil');
  if (faciles.length === 0) {
    throw new RondaImposible('BR-01 punto 1: no hay ningun item facil para abrir la partida');
  }

  // Punto 1: el primero sale del pozo de faciles, barajado -> no es siempre el mismo.
  const primero = barajar(faciles, azar)[0]!;

  // Punto 2: el resto se ordena por dificultad ascendente. Dentro de cada nivel se
  // baraja, para que dos partidas seguidas no sean identicas.
  const resto = items.filter((i) => i.id !== primero.id);
  const porNivel: Record<Dificultad, Item[]> = {
    facil: barajar(resto.filter((i) => i.dificultad === 'facil'), azar),
    media: barajar(resto.filter((i) => i.dificultad === 'media'), azar),
    dificil: barajar(resto.filter((i) => i.dificultad === 'dificil'), azar),
  };

  const ronda: Item[] = [primero];
  for (const nivel of ['facil', 'media', 'dificil'] as const) {
    for (const it of porNivel[nivel]) {
      if (ronda.length >= largo) break;
      ronda.push(it);
    }
  }
  return ronda;
}

/** Verifica que una ronda cumpla `BR-01`. Se usa en los tests y en la revision. */
export function cumpleBR01(ronda: readonly Item[]): boolean {
  if (ronda.length === 0) return false;
  if (ronda[0]!.dificultad !== 'facil') return false;
  for (let i = 1; i < ronda.length; i++) {
    if (ORDEN[ronda[i]!.dificultad] < ORDEN[ronda[i - 1]!.dificultad]) return false;
  }
  return true;
}

/** Cuantos aciertos tiene un conjunto de respuestas. Una respuesta es el texto elegido. */
export function contarAciertos(ronda: readonly Item[], elegidas: readonly (string | null)[]): number {
  let n = 0;
  for (let i = 0; i < ronda.length; i++) {
    const correcta = ronda[i]!.opciones.find((o) => o.correcta);
    if (correcta && elegidas[i] === correcta.texto) n++;
  }
  return n;
}
