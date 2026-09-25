/**
 * Qué casete del portal dice "Jugá" y cuál dice "En la cocina".
 *
 * ## Por qué existe
 *
 * Hasta el ciclo 16 lo decidía la copia: un casete sin `accion` en `copy.ts` salía "en la
 * cocina", y el de "Completá la letra" nunca la tuvo. Mientras tanto la página del juego
 * decidía sola, con el banco (`cargarBanco()` sobre `letra.json`), y con los primeros
 * versos listos se prendió. **El portal siguió diciendo "en la cocina" de un juego que ya
 * se jugaba**, uno de los cuatro de la v1, y nadie lo vio porque ningún test miraba las
 * dos pantallas juntas.
 *
 * Ahora el portal pregunta lo mismo que la página, con la misma función: si el banco
 * tiene partida, el casete muestra su acción; si no, sale "en la cocina". La copia dice
 * qué acción tendría; el banco decide si la tiene.
 *
 * Es puro a propósito: el banco lo carga quien llama (el portal en build, el test en
 * Node), así este módulo no arrastra `node:fs` a ningún lado.
 */

import type { Casete } from './copy.ts';

/**
 * El casete tal como lo muestra el portal.
 *
 * Con partida, igual que en la copia. Sin partida, sin `accion`: el marcado del portal
 * pinta "en la cocina" cuando no hay acción. Un casete que ya no tenía acción en la copia
 * no gana una por tener partida.
 */
export function segunLaPartida(casete: Casete, hayPartida: boolean): Casete {
  if (hayPartida || casete.accion === undefined) return casete;
  const { accion: _sinAccion, ...enLaCocina } = casete;
  return enLaCocina;
}
