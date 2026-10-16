/**
 * El recinto del monte y la pastura (`D-73`), de noche.
 *
 * Capas, de atrás para adelante:
 *
 * 1. `monte-lejos`: la noche y las tiras de la contratapa de *Lobo suelto* (inventado, en su
 *    estética, `arte.ts`).
 * 2. **El lobo**, el busto de la tapa: acecha subiendo desde atrás del borde de la capa que sigue.
 * 3. `monte-cerca`: el piso del monte y la pastura naranja de *Cordero atado*, con el palo.
 * 4. Los ojos de los demás del monte, la soga, y **el cordero**, la criatura de la tapa.
 * 5. `monte-frente`: las tiras de adelante.
 *
 * La geometría vive en `rig.ts`, que es lo único que se lleva la isla.
 */

import { imagen, lobo, cordero } from './titeres.ts';
import { ESCENA, PALO } from './rig.ts';

export { ESCENA, PALO };

/**
 * Los demás del monte y la pastura: de noche se les ven los ojos. Dónde mira cada uno desde
 * lo oscuro, y de qué color brillan (los lobos y lo que acecha, oro; lo demás, papel).
 */
export const VECINOS_DEL_MONTE: Readonly<Record<string, readonly [number, number, 'oro' | 'papel']>> = {
  'el-joven-lobo': [790, 252, 'oro'],
  'las-antiguas-lobas': [104, 282, 'oro'],
  'el-animal-que-no-late': [300, 232, 'papel'],
  'el-rey-de-esta-jungla': [566, 222, 'papel'],
  'tu-animal': [846, 352, 'oro'],
  'el-lobo-caido': [92, 486, 'oro'],
  'la-liebre-muerta': [818, 540, 'papel'],
  'el-borrego': [214, 470, 'papel'],
  'aquella-solitaria-vaca-cubana': [722, 350, 'papel'],
  'el-rebano': [640, 560, 'papel'],
  'el-ovejero': [168, 396, 'oro'],
};

/** Un par de ojos que miran desde lo oscuro: tocables, y parpadean. */
function ojos(id: string, nombre: string, x: number, y: number, tinta: 'oro' | 'papel'): string {
  const clase = tinta === 'oro' ? 'ojos-oro' : 'ojos-papel';
  return (
    `<g class="bestia bestia--ojos" data-id="${id}" data-x="${x}" data-y="${y}" role="button" tabindex="0" aria-label="${nombre}">` +
    `<circle class="toque" cx="${x}" cy="${y}" r="26"/>` +
    `<g class="cuerpo"><ellipse cx="${x - 6}" cy="${y}" rx="3.2" ry="2.4" class="${clase}"/><ellipse cx="${x + 6}" cy="${y}" rx="3.2" ry="2.4" class="${clase}"/></g>` +
    `<g class="marca-anotada" transform="translate(${x + 14} ${y - 12})"><circle r="6" class="b-pp b-borde"/><path d="M-3 0 l2 2.5 l4 -5" class="b-tz" stroke-width="2"/></g>` +
    `</g>`
  );
}

/** La escena entera, por capas. La isla mueve al lobo, al cordero y la soga. */
export function escenaMonte(nombres: ReadonlyMap<string, string>): string {
  const vecinos = Object.entries(VECINOS_DEL_MONTE)
    .map(([id, [x, y, tinta]]) => ojos(id, nombres.get(id) ?? id, x, y, tinta))
    .join('');
  return (
    imagen('monte-lejos') +
    `<g class="acecho"><g class="titere titere--lobo" data-id="el-lobo-suelto" role="button" tabindex="0" aria-label="${nombres.get('el-lobo-suelto')}">${lobo()}</g></g>` +
    imagen('monte-cerca') +
    `<g class="ojos-del-monte">${vecinos}</g>` +
    `<path id="soga" class="bt-trazo-soga" stroke-width="2.8" d="M${PALO.x} ${PALO.y - 46} L${PALO.x + 40} ${PALO.y}"/>` +
    `<g class="actores"><g class="titere titere--cordero" data-id="el-cordero-atado" role="button" tabindex="0" aria-label="${nombres.get('el-cordero-atado')}">${cordero()}</g></g>` +
    `<g class="escena-frente" pointer-events="none">${imagen('monte-frente')}</g>`
  );
}
