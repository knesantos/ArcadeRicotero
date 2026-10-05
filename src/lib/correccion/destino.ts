/**
 * Adónde va una corrección. `CTR-10` apartado 6.
 *
 * ## La casilla, y por qué está partida
 *
 * Hasta el 2026-10-01 esto era `null`, por decisión del usuario: un mail personal en un
 * `mailto:` de un sitio público se lo entrega a los raspadores de spam. Mientras fue `null`
 * el transporte de mail no existía y el botón cerraba por portapapeles — o sea que la
 * corrección se armaba, se copiaba, **y no llegaba a ningún lado**. Era la primera de las
 * tres mitigaciones de `D-25`, y sin casilla era una pata en el aire.
 *
 * Ese día el usuario la dio, sabiendo el costo (`D-51`). Va **partida en dos y se arma al
 * cargar el módulo**, no escrita entera: así no aparece como `usuario@dominio` en el JavaScript
 * publicado, que es el patrón que busca un raspador de los baratos. No es un candado —el
 * que lea el código la encuentra—, es no dejarla tirada en la vereda.
 *
 * **Para cambiarla, o para apagar el mail:** estas dos líneas. Con `null` el transporte
 * vuelve a no existir y el botón sigue funcionando por portapapeles (`D-14`: nadie queda
 * sin poder corregir).
 */
const PARTES: readonly [string, string] | null = ['santiagocanedo123', 'gmail.com'];

export const CASILLA: string | null = PARTES ? PARTES.join('@') : null;

/** El asunto del mail. La parte legible la fija `CNT-12`. */
export function ASUNTO(juego: string): string {
  return `Corrección del fichín ricotero — ${juego}`;
}
