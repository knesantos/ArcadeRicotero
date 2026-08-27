/**
 * Adónde va una corrección. `CTR-10` apartado 6.
 *
 * ## 🔴 Por qué esto es `null` y el botón funciona igual
 *
 * **El repo no tiene casilla de correo, y es una decisión del usuario, no un olvido.**
 * Poner un mail personal en un `mailto:` de un sitio público es entregárselo a los
 * raspadores de spam, y la dirección que se ponga acá tiene que ser **descartable**: si
 * algún día se llena de basura, se cambia esta línea y listo.
 *
 * Mientras sea `null`, el transporte de mail **no existe** — ni botón muerto, ni `mailto:`
 * generado hacia ningún lado. El frente cierra igual por portapapeles, y en el peor caso
 * por el texto a la vista, que no puede fallar. **Nadie queda sin poder corregir por esto**
 * (`D-14`).
 *
 * Para prenderlo: poner la dirección acá. Es la única línea que hay que tocar.
 */
export const CASILLA: string | null = null;

/** El asunto del mail. La parte legible la fija `CNT-12`. */
export function ASUNTO(juego: string): string {
  return `Corrección del arcade ricotero — ${juego}`;
}
