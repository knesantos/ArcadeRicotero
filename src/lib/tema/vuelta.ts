/**
 * Cómo se arma una vuelta de "Adiviná el tema" (`US-02`). Lo usa la isla
 * `src/scripts/partida-tema.ts`, y vive acá para que un test lo pueda correr contra el
 * catálogo real: la isla no se puede importar desde Node.
 *
 * ## Por qué hay un cupo de Fáciles
 *
 * Desde `T-279` el pozo tiene 8 Fáciles (lo más tocado en vivo, `CTR-19.5`). `escalonar()`
 * sin cupo llena la vuelta de 4 desde el nivel más bajo, así que con todos los discos las
 * cuatro canciones salían **siempre** de esos 8 y los otros 87 temas no sonaban nunca. Es
 * la vidriera fija de `BR-01` punto 3, pasada de un ítem a la vuelta entera
 * (`CTR-19.14` punto 3, y la verificación de `T-279`).
 *
 * Con un Fácil por vuelta: el primero sigue siendo Fácil y varía entre los 8 (punto 1 y 3),
 * los otros tres se sortean entre Media y Difícil y se ordenan (punto 2), y cualquier tema
 * del pozo puede sonar.
 *
 * **El número es provisorio y es de `producto`.** `CTR-19.14` punto 3 le deja la regla a
 * `producto` y el código al hilo principal. `1` es la primera salida de la lista que
 * `arquitectura` le pasó (`Docs/SUGERENCIAS/ARQ-para-producto-lo-que-el-corte-en-vivo-deja-abierto.md`
 * §3). Si `producto` fija otra, se cambia esta constante y nada más.
 */

import { escalonar, type Escalonable } from '../escalonar.ts';

/** Cuántos temas tiene una vuelta. Cuatro entran en los dos o tres minutos del brief. */
export const LARGO_VUELTA = 4;

/** Cuántos Fáciles, como mucho, abren una vuelta. Provisorio hasta que decida `producto`. */
export const FACILES_POR_VUELTA = 1;

/** La vuelta de `US-02`: escalonada, con cupo en el nivel más bajo. */
export function armarVuelta<T extends Escalonable>(
  pozo: readonly T[],
  azar: () => number = Math.random,
): T[] {
  return escalonar(pozo, LARGO_VUELTA, azar, { cupoPrimerNivel: FACILES_POR_VUELTA });
}
