/**
 * Las tres pantallas donde el sitio se saca la voz.
 *
 * Bulacio, Olavarría y la muerte del Indio. `.claude/rules/voz-ricotera.md` §6 lo dice sin
 * matices —*"Registro 3 entero, prosa incluida […] Ahí no hay voz que valga"*— y `UX-20`
 * §3.4 lo extiende de la prosa a **la pantalla entera**: sin velo, sin capa de fondo más
 * allá del grano, sin entrada propia, sin paralaje, sin capitular. Y desde el ciclo 11,
 * **sin sonido**: la cama de cinta no se prende ahí ni aunque la preferencia diga que sí.
 *
 * ## Por qué esto es un archivo y no una constante adentro de `arte.ts`
 *
 * La lista vivía en `arte.ts`, que importa `node:fs` para medir imágenes en build. Una
 * isla que la importara arrastraría Node al navegador y moriría en silencio: es
 * literalmente el defecto de `D-29`, que llegó por un módulo que no tenía una sola línea
 * de Node propia. `src/lib/islas.test.ts` recorre el grafo entero y lo caza, pero recién
 * después de escribirlo.
 *
 * **Este archivo no importa nada, y no puede.** Es la única forma de que la misma lista
 * sirva en build (el detalle de tapa, la capitular) y en el navegador (la cama), sin dos
 * verdades sobre quiénes son los tres.
 *
 * El hallazgo que lo hizo necesario salió de una revisión adversarial del ciclo 11: la
 * cama de cinta podía sonar en la pantalla de la muerte del Indio si alguien la había
 * dejado prendida en otra. Nadie lo había escrito porque nadie lo había imaginado.
 */

/** Los tres artículos, por su slug en `redondopedia.json`. */
export const SLUGS_GRAVES: readonly string[] = [
  'muerte-del-indio',
  'walter-bulacio',
  'olavarria-2017',
];

/**
 * ¿Esta ruta es una de las tres?
 *
 * Compara por segmento y no por `includes()`: un artículo que mañana se llame
 * `homenaje-a-walter-bulacio` es otro artículo, y hacerlo callar por parecido sería
 * decidir por adivinanza. Tolera la barra final o su ausencia.
 */
export function esPantallaGrave(ruta: string): boolean {
  const segmentos = ruta.split('/').filter(Boolean);
  const ultimo = segmentos[segmentos.length - 1];
  return ultimo !== undefined && SLUGS_GRAVES.includes(ultimo);
}
