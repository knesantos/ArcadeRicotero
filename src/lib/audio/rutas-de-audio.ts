/**
 * Dónde vive el audio del sitio. Una sola verdad, en un módulo que no importa nada.
 *
 * ## Por qué esto es un archivo y no dos constantes adentro de `tema/audio.ts`
 *
 * Es el mismo movimiento —y el mismo motivo— que sacó la lista de los tres graves a
 * `sitio/graves.ts`.
 *
 * Estas dos carpetas las necesitan **dos motores que no se pueden importar entre sí**: el de
 * fragmentos (`tema/audio.ts`, que decodifica para el reveal de `US-02`) y la rocola
 * (`sitio/rocola.ts`, que transmite para la cinta). `ADR-04` dejó escrito por qué no se
 * cruzan: *"la dirección es única —`tema/audio.ts` → `audio/contexto.ts` ← `sitio/cinta.ts`—
 * y si algún día se cruzan, la convivencia pasa a depender de quién cargó primero, que es
 * otra forma de decir que deja de estar decidida"*. Hay un test que lo fija
 * (`cinta.test.ts`), y tenía razón: al construir `T-217` la rocola importó `tema/audio.ts`
 * por estas dos funciones y **cruzó la flecha**.
 *
 * Las dos salidas malas eran escribir `/audio/fragmentos` por segunda vez —la segunda verdad
 * sobre dónde vive el audio, que el día que una cambie deja a la otra vieja sin síntoma— o
 * aflojar el candado del ADR. Esta es la tercera: la constante baja a una hoja, y los dos
 * motores la miran desde arriba sin mirarse entre ellos.
 *
 * **No importa nada, y no puede.** Es lo que hace que la misma verdad sirva en build (los
 * scripts que generan los archivos) y en el navegador, sin arrastrar `node:*` (`D-29`).
 */

/** Dónde viven los fragmentos de 15 s del reveal (`CTR-01.4`). */
export const CARPETA_FRAGMENTOS = '/audio/fragmentos';

/** Dónde viven los temas enteros (`D-23`, nivel 2; `D-22`). */
export const CARPETA_TEMAS = '/audio/temas';

/** El recorte de un tema. Existe para los 95 que `generar-fragmentos` ya produjo. */
export function urlDeFragmento(slug: string): string {
  return `${CARPETA_FRAGMENTOS}/${slug}.mp3`;
}

/**
 * El tema entero.
 *
 * **Puede no existir**, y quien la llame tiene que haberlo preguntado antes: el manifiesto
 * marca `entero` por tema. Hoy no hay ninguno — salen de los discos del usuario, y el
 * `README.md` de esa carpeta dice cómo.
 */
export function urlDeTema(slug: string): string {
  return `${CARPETA_TEMAS}/${slug}.mp3`;
}
