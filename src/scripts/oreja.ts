/**
 * La oreja de la portada de la Redondopedia (`D-75`): una leyenda por día.
 *
 * El build ya trae todas las leyendas del archivo en la ronda, con la primera a la vista; esto
 * deja a la vista la que toca hoy según la fecha del teléfono de quien mira. No crea nodos ni
 * clases: mueve un `hidden`. Si no llega a correr, queda la primera, que también es una
 * leyenda entera y bien rotulada.
 */

import { indiceDelDia } from '../lib/redondopedia.ts';

const ronda = document.querySelector<HTMLElement>('[data-oreja]');
const leyendas = ronda ? [...ronda.children].filter((n): n is HTMLElement => n instanceof HTMLElement) : [];

if (leyendas.length > 1) {
  const hoy = indiceDelDia(new Date(), leyendas.length);
  leyendas.forEach((leyenda, i) => {
    leyenda.hidden = i !== hoy;
  });
}
