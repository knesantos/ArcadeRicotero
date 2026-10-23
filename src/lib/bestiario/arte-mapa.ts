/**
 * Las escenas de cada zona del plano (`D-79`, segunda vuelta).
 *
 * Pedido del usuario: *"que se sigan diferenciando las zonas, pero que sea más grande el mapa, con
 * detalles de cada zona, un diseño más detallado y complejo. Más rocambolesco."* Cada región deja
 * de ser una tinta plana con dibujitos encima: tiene su escena vista desde arriba, a aerógrafo, en
 * la paleta de su disco (`D-19`). La tierra del plano (`arte-portal.ts`, `mapa-tierra`) llama a la
 * escena de cada región y la recorta con su contorno: lo que se pinta afuera no se ve.
 *
 * Las escenas viven en tres archivos, de a cuatro zonas, para que se puedan pintar por separado:
 * `arte-mapa-norte.ts`, `arte-mapa-sur.ts` y `arte-mapa-oeste.ts`. Acá está el registro; lo que
 * comparten está en `arte-mapa-base.ts`. Para mirar cómo quedan: `node --experimental-strip-types scripts/mirar-mapa.mjs`.
 */

import type { Escena } from './arte-mapa-base.ts';
import { ESCENAS_NORTE } from './arte-mapa-norte.ts';
import { ESCENAS_SUR } from './arte-mapa-sur.ts';
import { ESCENAS_OESTE } from './arte-mapa-oeste.ts';

/** Las escenas de las doce zonas, por id de región. Una zona sin escena queda con su tinta. */
export const ESCENAS: Readonly<Record<string, Escena>> = {
  ...ESCENAS_NORTE,
  ...ESCENAS_SUR,
  ...ESCENAS_OESTE,
};
