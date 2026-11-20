/**
 * Decirle algo a quien no ve la pantalla, sin mover el foco.
 *
 * **De dónde sale** (`REV-24`, `r0-uso.md`, perfil C, hallazgo 2; `T-534`). En "Adiviná el
 * tema" la revelación pinta el grito, el título y los puntos, y el foco va al botón de
 * seguir: el lector de pantalla dice "Seguí, botón" y nada más. Y el intento errado solo
 * cambia una lista.
 *
 * **Por qué una región aparte y no `role="status"` sobre la ficha.** La ficha de la
 * revelación trae adentro un reproductor, un enlace y el botón; como región viva se leería
 * entera, botón incluido, y además se llena estando escondida y recién después se muestra,
 * que es el caso en que los lectores no anuncian. Acá la región existe desde que carga la
 * isla, vacía, y lo único que cambia después es su texto: el caso que todos anuncian.
 *
 * Va con `.solo-lector` (`juego.css`): existe para quien no ve y no ocupa lugar. Es `polite`:
 * no pisa lo que el lector esté diciendo.
 */

/** Lo mínimo que hace falta del nodo. Así se prueba sin navegador. */
export interface NodoDeAnuncio {
  className: string;
  textContent: string | null;
  setAttribute(nombre: string, valor: string): void;
}

/** Lo que distingue un texto repetido del anterior: un espacio duro, que no se pronuncia. */
export const REPETIDO = '\u00a0';

/** Viste un nodo de región viva y devuelve la función que le habla. Es lo que se prueba. */
export function hacerRegion(region: NodoDeAnuncio): (texto: string) => void {
  region.className = 'solo-lector';
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', 'polite');
  let ultimo: string | null = null;
  return (texto) => {
    /*
     * Decir lo mismo dos veces seguidas lo vuelve a decir. Vaciar y volver a llenar en la
     * misma tarea no alcanza: el lector ve un solo cambio, y si el texto final es el que ya
     * estaba, ninguno. Entonces el repetido se escribe con un espacio duro al final, y el
     * siguiente repetido sin él: el texto de la región cambia siempre, y se escucha igual.
     */
    const escrito = texto === ultimo ? `${texto}${REPETIDO}` : texto;
    region.textContent = escrito;
    ultimo = escrito;
  };
}

/**
 * Crea la región —una sola vez, al cargar la isla, no al primer anuncio— y devuelve la
 * función que le habla.
 */
export function anunciador(doc: Document = document): (texto: string) => void {
  const region = doc.createElement('p');
  const decir = hacerRegion(region);
  doc.body.append(region);
  return decir;
}
