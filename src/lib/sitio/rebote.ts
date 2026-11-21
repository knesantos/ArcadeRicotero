/**
 * La guarda del rebote: el toque que venía para otra cosa no contesta la pregunta nueva.
 *
 * **De dónde sale** (`REV-24`, `r0-uso.md`, perfil A, hallazgo 2; `T-534`). En el quiz y en
 * "Adiviná la tapa" el botón de seguir queda a la misma altura que la opción D de la
 * pregunta que viene (737 contra 737 px en el quiz; 734 contra 707–766 en la tapa, medido a
 * 375 × 812). Un doble toque, o el sacudón del bondi, y el segundo toque cae sobre una
 * opción que el jugador ni leyó. En el quiz eso cuesta una vida.
 *
 * **Qué hace.** Durante `GRACIA_MS` desde que se arma la lista de opciones, un `click` de
 * puntero sobre ella no llega a los botones. Se frena en la fase de captura del contenedor,
 * así que los oyentes de cada opción —que son `{ once: true }`— **no se gastan**: pasado el
 * plazo, el mismo botón responde como siempre.
 *
 * **Qué no frena, a propósito.** La activación por teclado o por lector de pantalla llega
 * como un `click` con `detail === 0`, y pasa siempre: ahí no hay dedo que rebote, y demorar
 * a quien navega sin puntero sería cobrarle un defecto que no es suyo.
 *
 * **Por qué 400 ms.** El segundo toque de un doble toque llega antes de los 300 ms; leer una
 * pregunta nueva y elegir tarda bastante más que 400. El plazo entra entre los dos.
 *
 * No toca el DOM más que para escuchar: no pinta nada, no deshabilita nada, y por eso no hay
 * estado que comunicar (`diseno-marca.md`: ningún estado solo con color — acá no hay estado).
 */

export const GRACIA_MS = 400;

/** Lo mínimo que la guarda necesita de un `click`. */
export interface Toque {
  /** `0` cuando la activación no vino de un puntero (teclado, lector de pantalla). */
  readonly detail: number;
  stopImmediatePropagation(): void;
  preventDefault(): void;
}

/** ¿Este toque es un rebote? Pura: es lo que se prueba. */
export function esRebote(detail: number, msDesdeQueSeArmo: number, gracia: number = GRACIA_MS): boolean {
  return detail > 0 && msDesdeQueSeArmo < gracia;
}

/** El oyente que va en la captura del contenedor. Separado para probarlo sin DOM. */
export function frenoDeRebote(
  ahora: () => number = () => performance.now(),
  gracia: number = GRACIA_MS,
): (ev: Toque) => void {
  const armada = ahora();
  return (ev) => {
    if (!esRebote(ev.detail, ahora() - armada, gracia)) return;
    ev.stopImmediatePropagation();
    ev.preventDefault();
  };
}

/**
 * Protege una lista de opciones recién armada. Se llama una vez por pregunta, sobre el
 * contenedor nuevo: el plazo corre desde esta llamada.
 */
export function protegerDeRebote(lista: HTMLElement): void {
  lista.addEventListener('click', frenoDeRebote(), true);
}
