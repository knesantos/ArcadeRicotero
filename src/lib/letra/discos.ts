/**
 * Los diez discos de Patricio Rey, y nada más.
 *
 * ## Por qué existe este archivo de once líneas
 *
 * La lista vivía adentro de `temas.ts`, que **importa `node:fs` en la primera línea**
 * porque parsea la ficha `RES-20`. Eso está bien para lo que hace `temas.ts` —corre en
 * build y en los tests, nunca en el navegador—, pero convierte a la lista de discos en
 * un dato que el navegador no puede tocar sin arrastrar medio Node adentro del bundle.
 *
 * Y el navegador la necesita: `tema/paleta.ts` la usa para saber qué diez discos tienen
 * tinta propia. La primera versión la importaba de `temas.ts` y **el juego entero dejó de
 * arrancar** — `Module "node:fs" has been externalized for browser compatibility`, y con
 * la isla muerta la portada no respondía a un solo toque. No lo agarró `npm test` (Node
 * tiene `fs`) ni `npm run check` (los tipos estaban bien): lo agarró abrir la página.
 *
 * El patrón no es nuevo, es el mismo que `temas.ts` ya había usado para los
 * normalizadores de texto, y con el mismo argumento escrito ahí: *"son funciones puras
 * que también las necesita el navegador, y este archivo importa `node:fs`: entero no
 * entra a un bundle de cliente"*. Lo que faltaba era aplicárselo a la lista de discos.
 *
 * **Este archivo no importa nada.** Es la condición para que pueda importarlo cualquiera
 * de los dos lados, y lo que hace que siga habiendo **una sola** lista de discos.
 */

/** Los diez discos, con el slug que usan el schema, la Redondopedia y los tokens. */
export const DISCOS = [
  'gulp',
  'oktubre',
  'un-baion-para-el-ojo-idiota',
  'bang-bang-estas-liquidado',
  'la-mosca-y-la-sopa',
  'lobo-suelto',
  'cordero-atado',
  'luzbelito',
  'ultimo-bondi-a-finisterre',
  'momo-sampler',
] as const;

export type Disco = (typeof DISCOS)[number];

/**
 * Cómo se llama cada disco cuando se lo nombra en pantalla.
 *
 * Vive acá por la misma razón que la lista: el navegador lo necesita y no puede importar
 * `temas.ts`. Hasta el ciclo 16 la cabecera de "Completá la letra" y el índice del
 * cancionero armado lo sacaban del slug (`disco.replace(/-/g, ' ')`), y en pantalla salía
 * "ULTIMO BONDI A FINISTERRE", "UN BAION PARA EL OJO IDIOTA" y "GULP" pelado: sin tildes y
 * sin signos, justo lo que el que se sabe los discos nota primero. `TITULO_DE_DISCO` de
 * `sitio/arte.ts` es este mismo mapa, no una copia.
 */
export const TITULO_DEL_DISCO: Readonly<Record<Disco, string>> = {
  gulp: 'Gulp!',
  oktubre: 'Oktubre',
  'un-baion-para-el-ojo-idiota': 'Un baión para el ojo idiota',
  'bang-bang-estas-liquidado': '¡Bang! ¡Bang!… Estás liquidado',
  'la-mosca-y-la-sopa': 'La mosca y la sopa',
  'lobo-suelto': 'Lobo suelto',
  'cordero-atado': 'Cordero atado',
  luzbelito: 'Luzbelito',
  'ultimo-bondi-a-finisterre': 'Último bondi a Finisterre',
  'momo-sampler': 'Momo Sampler',
};

/**
 * El nombre en pantalla de un slug que llega de un JSON como texto suelto.
 *
 * Si el slug no es uno de los diez, devuelve el slug tal cual: un dato que no se reconoce
 * se muestra como viene, no se disfraza de título.
 */
export function tituloDelDisco(slug: string): string {
  return (TITULO_DEL_DISCO as Record<string, string>)[slug] ?? slug;
}
