/**
 * El recinto del monte y la pastura (`D-73`), de noche.
 *
 * Capas, de atrás para adelante:
 *
 * 1. `monte-lejos`: la noche y las tiras de la contratapa de *Lobo suelto* (inventado, en su
 *    estética, `arte.ts`).
 * 2. **El lobo**, el busto de la tapa: acecha subiendo desde atrás del borde de la capa que sigue.
 * 3. `monte-cerca`: el piso del monte y la pastura naranja de *Cordero atado*, con el palo.
 * 4. Los ojos de los demás del monte, la soga, **el cordero**, la criatura de la tapa, y en la
 *    punta de la pastura **la vaca cubana**, con su satélite (`escena-vaca.ts`).
 * 5. `monte-frente`: las tiras de adelante.
 *
 * La geometría vive en `rig.ts`, que es lo único que se lleva la isla.
 */

import { imagen, lobo, cordero } from './titeres.ts';
import { ojos, type Tinta } from './escenas.ts';
import { ESCENA, PALO } from './rig.ts';
import { vacaEnElClaro } from './escena-vaca.ts';

export { ESCENA, PALO };

/**
 * Los demás del monte y la pastura: de noche se les ven los ojos. Dónde mira cada uno desde
 * lo oscuro, y de qué color brillan (los lobos y lo que acecha, oro; lo demás, papel).
 */
export const VECINOS_DEL_MONTE: Readonly<Record<string, readonly [number, number, Tinta]>> = {
  'el-joven-lobo': [790, 252, 'oro'],
  'las-antiguas-lobas': [104, 282, 'oro'],
  'el-animal-que-no-late': [300, 232, 'papel'],
  'el-rey-de-esta-jungla': [566, 222, 'papel'],
  'tu-animal': [846, 352, 'oro'],
  'el-lobo-caido': [92, 486, 'oro'],
  'la-liebre-muerta': [818, 540, 'papel'],
  'el-borrego': [214, 470, 'papel'],
  'el-rebano': [640, 560, 'papel'],
  'el-ovejero': [168, 396, 'oro'],
};

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
    vacaEnElClaro(nombres.get('aquella-solitaria-vaca-cubana') ?? '') +
    `<g class="escena-frente" pointer-events="none">${imagen('monte-frente')}</g>`
  );
}
