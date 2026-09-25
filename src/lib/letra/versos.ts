/**
 * Los versos de un tema tal como los ve "completar la letra" (`US-03`), y sus vecinos.
 *
 * Vive acá, y no adentro de `scripts/generar-letra.mjs`, porque la usan **dos** lugares:
 * el generador, que corta los huecos y su contexto, y `banco.test.ts` (`n3`), que
 * reconstruye la lista para afirmar que el contexto de cada ítem son de verdad los vecinos
 * del verso. Si el test la copiara, la copia mentiría en la próxima versión del filtro
 * (`CTR-04.14` paso 2, el mismo defecto que `FIND-75`).
 *
 * ## Por qué la lista es del tema y no de la estrofa
 *
 * Hasta `CTR-04` v2 el contexto se tomaba **dentro de la estrofa**, y el nivel salía de ahí:
 * un verso con dos vecinos de cada lado en su estrofa era Fácil. Desde v3 (`D-46`, `BR-30`)
 * el nivel es del tema y el contexto lo sigue (`BR-03`). Tomarlo dentro de la estrofa
 * dejaría sin ítems justo a los temas Fáciles —en una estrofa de cuatro versos ninguno
 * tiene dos y dos— (`CTR-04.14`, alternativa 4). Entonces la lista se **aplana**: los
 * versos del tema en el orden del cancionero, sin cortar en el borde de la estrofa.
 *
 * Sin `node:fs`: recibe el tema ya leído.
 */

import { sirveComoVerso } from '../cancionero/anotacion.ts';
import { motivoDescarteVerso } from '../por-la-letra/filtro.ts';
import { sinEtiquetaFinal } from '../cancionero/taller.ts';

/** Lo que este módulo lee de un tema de `cancionero.json`. */
export interface TemaConSecciones {
  readonly secciones: readonly {
    readonly lineas: readonly { readonly t: string; readonly texto?: string }[];
  }[];
}

/**
 * Los versos de letra de un tema, en orden, en una sola lista.
 *
 * Los filtros son los de siempre: `sirveComoVerso` y el filtro endurecido de `CNT-11`
 * (`motivoDescarteVerso`, `REV-08` / `FIND-31`), y `sinEtiquetaFinal` para sacar la marca
 * que el transcriptor pegó al final del verso (`"...le da! Riff 1"`). Cada verso sale
 * recortado de espacios: es el texto que va al banco.
 */
export function versosDelTema(tema: TemaConSecciones): string[] {
  const salida: string[] = [];
  for (const seccion of tema.secciones) {
    for (const linea of seccion.lineas) {
      if (linea.t !== 'letra' || typeof linea.texto !== 'string') continue;
      if (!sirveComoVerso(linea.texto) || motivoDescarteVerso(linea.texto) !== null) continue;
      salida.push(sinEtiquetaFinal(linea.texto).trim());
    }
  }
  return salida;
}

/**
 * Los `n` versos inmediatamente anteriores y los `n` posteriores al verso `i`.
 *
 * **Si no hay `n` de cada lado, devuelve `null`**: ese verso no da ítem en ese nivel. No se
 * baja de nivel ni se rellena (`CTR-04.7` enmendado, `CTR-04.14` alternativa 5): bajar de
 * nivel volvería a sacar el nivel de la posición del verso, que es lo que `D-46` reemplazó.
 */
export function vecinos(
  versos: readonly string[],
  i: number,
  n: number,
): { readonly antes: string[]; readonly despues: string[] } | null {
  if (!Number.isInteger(n) || n < 0) throw new RangeError(`n tiene que ser un entero no negativo y es ${n}`);
  if (i - n < 0 || i + n >= versos.length) return null;
  return { antes: versos.slice(i - n, i), despues: versos.slice(i + 1, i + 1 + n) };
}
