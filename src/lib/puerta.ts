/**
 * La puerta del que sacó poco (`T-535`).
 *
 * `REV-24` (`r0-afuera.md`, C-5 y C-11): el que llega sin idea por un enlace pierde, lee un
 * veredicto y se encuentra con Compartí / Jugá de nuevo / Al fichín. Nada lo manda a ningún
 * lado. Los molinetes de `CLAUDE.md` §6 dicen que el que no sabe juega igual; un resultado que
 * solo le ofrece volver a perder es un molinete cerrado con buenos modales.
 *
 * Así que un resultado bajo trae **una** puerta, y concreta:
 *
 *  - si lo que se le escapó tiene disco, el artículo de ese disco en la Redondopedia. Los diez
 *    discos tienen artículo y el slug es el mismo (`puerta.test.ts` lo comprueba contra
 *    `redondopedia.json`, para que el enlace no pueda dar un 404);
 *  - si no tiene disco, «Adiviná la tapa»: cuatro opciones, la imagen entera y sin vidas. Es
 *    el juego que el crítico de afuera marcó como el más amable de los cuatro (C-9).
 *
 * Este archivo no importa nada de Node: lo usan las islas.
 */

import { DISCOS, type Disco } from './letra/discos.ts';
import { PUERTAS } from './sitio/copy.ts';

export interface Puerta {
  /** Lo que dice el enlace. Registro 1, voseo, ocho palabras como techo. */
  readonly texto: string;
  readonly href: string;
}

/** El juego que se juega mirando. La dirección es la del casete del portal. */
export const HREF_TAPAS = '/juegos/adivinar-la-tapa/';

/** La dirección del artículo de un disco. `[slug].astro` las sirve con barra al final. */
export function hrefDelDisco(disco: Disco): string {
  return `/redondopedia/${disco}/`;
}

function esDisco(x: string | null | undefined): x is Disco {
  return !!x && (DISCOS as readonly string[]).includes(x);
}

/**
 * La puerta que corresponde a lo que se escapó.
 *
 * @param disco el disco de lo que se falló, o nada si no lo tiene (una pregunta sobre la misa)
 */
export function puertaHacia(disco: string | null | undefined): Puerta {
  if (esDisco(disco)) return { texto: PUERTAS.alDisco, href: hrefDelDisco(disco) };
  return { texto: PUERTAS.aLasTapas, href: HREF_TAPAS };
}
