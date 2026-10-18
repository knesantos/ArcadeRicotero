/**
 * La carga de a una (`D-73`, octava vuelta, `T-445`): que la página del bestiario no baje todas
 * las imágenes de una al abrir.
 *
 * Cada recinto de noche y cada retrato de un títere son un SVG con `<image>` que apuntan a las
 * piezas impresas (`public/bestiario/`). Puestos tal cual, el navegador las baja todas apenas carga
 * la página: medido el 2026-10-18, 59 imágenes y 1673 kB antes de que la gente vea el plano. El
 * índice no ayudaba: sus retratos usan las mismas piezas que las escenas.
 *
 * El truco es el `<noscript>`. El SVG entero va guardado adentro de uno, y afuera queda un SVG vacío
 * con las mismas clases y la misma caja, que guarda el lugar (`data-espera`):
 *
 * - **Sin JavaScript**, el `<noscript>` se dibuja como siempre, y una regla que solo existe sin
 *   JavaScript esconde el que guarda el lugar. Se ve todo, igual que antes: los molinetes siguen
 *   abiertos y no hay nada repetido en la página.
 * - **Con JavaScript**, lo de adentro de un `<noscript>` es texto: no se dibuja ni baja nada. La isla
 *   lo pasa a SVG recién cuando el recinto o la ficha se acercan a la pantalla, y lo pone en el
 *   lugar del vacío, que ya medía lo mismo: la página no salta.
 *
 * Esto son cadenas, no dibujo: lo usan la página y la isla, y la isla no se lleva nada que dibuje.
 */

/** El atributo del SVG vacío que guarda el lugar. */
export const ESPERA = 'data-espera';
/** El atributo del `<noscript>` que guarda el SVG de verdad. */
export const GUARDADO = 'data-diferido';

/** Si un dibujo pide piezas impresas: si no, no hay nada que esperar. */
export const pidePiezas = (svg: string): boolean => /\shref="\/bestiario\/[a-z0-9-]+\.webp"/.test(svg);

/**
 * Un SVG que espera: el vacío que guarda el lugar y, al lado, el de verdad guardado en su
 * `<noscript>`. `atributos` van en los dos (la clase y la caja, para que midan lo mismo). Si el
 * dibujo no pide piezas, sale tal cual, sin esperar.
 */
export function enEspera(atributos: string, interior: string): string {
  const entero = `<svg ${atributos}>${interior}</svg>`;
  if (!pidePiezas(interior)) return entero;
  return `<svg ${atributos} ${ESPERA}></svg><noscript ${GUARDADO}>${entero}</noscript>`;
}

/** La regla que, sin JavaScript, esconde los vacíos: el `<noscript>` ya dibuja el de verdad. */
export const SIN_ISLA = `<noscript><style>[${ESPERA}]{display:none}</style></noscript>`;
