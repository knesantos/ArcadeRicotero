/**
 * Las tres pantallas donde el sitio se saca la voz.
 *
 * Bulacio, Olavarría y la muerte del Indio. `.claude/rules/voz-ricotera.md` §6 lo dice sin
 * matices —*"Registro 3 entero, prosa incluida […] Ahí no hay voz que valga"*— y `UX-20`
 * §3.4 lo extiende de la prosa a **la pantalla entera**: sin velo, sin capa de fondo más
 * allá del grano, sin entrada propia, sin paralaje, sin capitular.
 *
 * ## Por qué esto es un archivo y no una constante adentro de `arte.ts`
 *
 * La lista vivía en `arte.ts`, que importa `node:fs` para medir imágenes en build. Una
 * isla que la importara arrastraría Node al navegador y moriría en silencio: es
 * literalmente el defecto de `D-29`, que llegó por un módulo que no tenía una sola línea
 * de Node propia. `src/lib/islas.test.ts` recorre el grafo entero y lo caza, pero recién
 * después de escribirlo.
 *
 * La isla que la necesitaba era la cama de cinta, que desde el ciclo 11 no se prendía en
 * estas tres pantallas: una revisión adversarial encontró que podía sonar en la de la
 * muerte del Indio si alguien la había dejado prendida en otra. La cinta se sacó del sitio
 * el 2026-10-01 y hoy la lista la lee solo el build (el detalle de tapa, la capitular).
 * **Este archivo sigue sin importar nada**, para que la próxima isla que la necesite la
 * pueda leer sin dos verdades sobre quiénes son los tres.
 */

/** Los tres artículos, por su slug en `redondopedia.json`. */
export const SLUGS_GRAVES: readonly string[] = [
  'muerte-del-indio',
  'walter-bulacio',
  'olavarria-2017',
];
