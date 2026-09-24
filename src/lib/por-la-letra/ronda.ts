/**
 * Cómo se arma una ronda de "Sacalo por la letra" (`US-07`). Lo usa la isla
 * `src/scripts/partida-por-la-letra.ts`, y vive acá para que un test lo pueda correr contra el
 * banco real: la isla no se puede importar desde Node. Es el hermano de `tema/vuelta.ts`.
 *
 * ## Por qué hay un cupo de Fáciles
 *
 * Desde `D-46` (`T-285`) el banco trae niveles de verdad: los tercios del conteo en vivo
 * (`CTR-19.15`) dan 30 Fáciles sobre 88. `escalonar()` sin cupo llena la ronda de 5 desde el
 * nivel más bajo, así que **las cinco preguntas saldrían siempre de los 30 más tocados** y
 * los otros 58 temas no aparecerían nunca. Es lo mismo que `CTR-19.14` punto 3 encontró en
 * `US-02`: la vidriera fija de `BR-01` punto 3, pasada de un ítem a la ronda entera.
 *
 * Con cupo, `BR-01` se cumple entero: el primero es Fácil y varía entre los 30 (puntos 1 y 3),
 * la dificultad no baja (punto 2), y cualquier tema del banco puede salir.
 *
 * **El número es provisorio y es de `producto`.** Sale de la misma regla de tercios aplicada
 * a la ronda: `⌈5 / 3⌉ = 2` Fáciles, y los otros tres se sortean parejo entre Media y Difícil.
 * Con uno solo, como `US-02`, la ronda de cinco quedaría con cuatro de los dos tercios de
 * abajo. El pedido está en `Docs/SUGERENCIAS/HILO-para-producto-el-cupo-de-la-ronda-de-us07.md`;
 * si `producto` fija otro, se cambia esta constante y nada más.
 */

import { escalonar, type Escalonable } from '../escalonar.ts';

/** Cuántos temas tiene una ronda. Cinco entran en los dos o tres minutos del brief. */
export const LARGO_RONDA = 5;

/** Cuántos Fáciles, como mucho, abren una ronda. Provisorio hasta que decida `producto`. */
export const FACILES_POR_RONDA = 2;

/** La ronda de `US-07`: escalonada, con cupo en el nivel más bajo. */
export function armarRonda<T extends Escalonable>(
  banco: readonly T[],
  azar: () => number = Math.random,
): T[] {
  return escalonar(banco, LARGO_RONDA, azar, { cupoPrimerNivel: FACILES_POR_RONDA });
}
