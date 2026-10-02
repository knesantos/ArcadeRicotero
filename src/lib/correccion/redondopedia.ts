/**
 * El adaptador de la Redondopedia para el botón de corrección. Implementa la fila
 * `redondopedia` de `CTR-10` §2.1.
 *
 * ## Por qué existe
 *
 * El botón llegó a la Redondopedia el 2026-10-01 (`D-51`) mandando solo el título del
 * artículo. `REV-17` (`FIND-87`) lo marcó contra el contrato, y con razón: `CTR-10` §2.1 pide
 * que `dice` sea **el texto del párrafo o el valor del dato**, que `rotulo` diga con qué
 * casilla está marcado hoy, y que `ubicacion` diga cuál (`párrafo 3`). La tercera categoría
 * de corrección de `BR-21` es *rótulo mal puesto*, y sin el rótulo en el mensaje esa
 * categoría llega incompleta: quien lee sabe de qué artículo se habla, no de qué frase.
 *
 * El artículo es uno y las partes son muchas, así que el panel deja elegir cuál: este módulo
 * arma la lista. Es puro y no toca el navegador, igual que `armar.ts`, para que se pueda
 * probar con los artículos de verdad.
 *
 * **El texto viaja sin la marca de los enlaces** (`[[slug|texto]]` se lee "texto"): es lo
 * que la persona ve en pantalla, y `CTR-10` §2.1 dice que el texto se manda porque el índice
 * se mueve cuando alguien edita el artículo, y el texto no.
 */

import type { Correccion } from './armar.ts';
import { segmentar, type Articulo } from '../redondopedia.ts';

/** Lo que el botón manda, menos lo que escribe la persona. */
export type DatosDeCorreccion = Omit<Correccion, 'contrato' | 'v' | 'deberiaDecir'>;

export interface ParteCorregible {
  /** Cómo se lee la opción en el panel. Registro 3: dice qué parte es y se calla. */
  readonly etiqueta: string;
  readonly datos: DatosDeCorreccion;
}

/** `redondopedia.json` no tiene encabezado de contrato (`CTR-10` §2.2). */
const BANCO = { contrato: 'sin-contrato', version: 0 } as const;

/** El texto que ve la persona, sin la marca de los enlaces internos. */
export function textoPlano(texto: string): string {
  return segmentar(texto)
    .map((p) => p.texto)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Las primeras palabras de un párrafo, para reconocerlo en la lista sin leerlo entero. */
function comienzo(texto: string, palabras = 6): string {
  const todas = texto.split(' ');
  return todas.slice(0, palabras).join(' ').replace(/[,;:.]$/, '');
}

/** `fichas` con lo que diga `fuente`, si dice algo. */
function fuenteDe(fuente: string | null | undefined): { fuente?: { fichas: string[] } } {
  return fuente ? { fuente: { fichas: [fuente] } } : {};
}

/**
 * Las partes de un artículo que se pueden corregir, en el orden en que se leen: el artículo
 * entero primero (para lo que no es de una frase: "falta algo"), después los datos de la
 * ficha y después cada párrafo.
 */
export function partesParaCorregir(articulo: Articulo): ParteCorregible[] {
  const comunes = { juego: 'redondopedia' as const, itemId: articulo.slug, banco: BANCO };
  const partes: ParteCorregible[] = [
    {
      etiqueta: 'Todo el artículo',
      datos: { ...comunes, ubicacion: 'el artículo', dice: textoPlano(articulo.resumen) },
    },
  ];
  for (const d of articulo.datos) {
    partes.push({
      etiqueta: `Dato: ${d.etiqueta}`,
      datos: {
        ...comunes,
        // `ubicacion` tiene tope de 40 (`armar.ts`): la etiqueta de un dato es corta, y si
        // alguna no lo fuera, se corta acá y no rompe el botón.
        ubicacion: `dato: ${d.etiqueta}`.slice(0, 40),
        dice: `${d.etiqueta}: ${textoPlano(d.valor)}`,
        rotulo: d.rotulo,
        ...fuenteDe(d.fuente),
      },
    });
  }
  articulo.cuerpo.forEach((seg, i) => {
    const texto = textoPlano(seg.texto);
    partes.push({
      etiqueta: `Párrafo ${i + 1}: «${comienzo(texto)}»`,
      datos: {
        ...comunes,
        ubicacion: `párrafo ${i + 1}`,
        dice: texto,
        rotulo: seg.rotulo,
        ...fuenteDe(seg.fuente),
      },
    });
  });
  return partes;
}
