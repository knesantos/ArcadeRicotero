/**
 * Qué aparato y qué navegador está del otro lado.
 *
 * Existe porque el audio del juego depende de cosas que **la web no puede medir**, y lo
 * único que se puede hacer es saber a quién avisarle.
 *
 * ## El caso que lo motivó
 *
 * El usuario reportó dos veces que no le sonaban los temas en el celular. Después de
 * arreglar dos defectos reales del motor de audio, resultó ser **la llave lateral de
 * silencio del iPhone**: apaga el audio de Web Audio aunque el volumen esté alto, y no
 * avisa ni deja rastro.
 *
 * **No hay ninguna API que diga si esa llave está puesta.** Ni una. Así que el aviso no
 * puede aparecer "cuando corresponde": lo único honesto es decírselo a quien tiene un
 * iPhone, que es donde la trampa existe, y no molestar al resto.
 *
 * Desde `D-66` sí hay una que la **salta**: `audio/sesion.ts` pide la sesión de la música y
 * el aviso queda solo para los iPhone que no la tienen.
 */

/** Un iPhone o un iPad, incluido el iPad que se hace pasar por Mac. */
export function esIOS(ua: string = navigator.userAgent): boolean {
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  // Desde iPadOS 13 el iPad manda un user agent de Mac. Los puntos táctiles lo delatan.
  return typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

/**
 * Si la página corre adentro de una aplicación en vez de en el navegador del teléfono.
 *
 * Devuelve el nombre de la aplicación, o `null`. Importa para el audio: esas ventanas
 * heredan la sesión de sonido de la aplicación anfitriona y recortan cosas que el
 * navegador de verdad no.
 */
export function navegadorIncrustado(ua: string = navigator.userAgent): string | null {
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return 'Facebook';
  if (/Instagram/i.test(ua)) return 'Instagram';
  if (/WhatsApp/i.test(ua)) return 'WhatsApp';
  if (/Telegram/i.test(ua)) return 'Telegram';
  if (/TikTok|musical_ly|BytedanceWebview/i.test(ua)) return 'TikTok';
  if (/Twitter/i.test(ua)) return 'Twitter';
  if (/Line\//i.test(ua)) return 'LINE';
  if (/; wv\)/.test(ua)) return 'otra aplicación';
  return null;
}

/** Un teléfono o tablet, de cualquier marca: donde el volumen es una perilla aparte. */
export function esMovil(ua: string = navigator.userAgent): boolean {
  return esIOS(ua) || /Android|Mobile/i.test(ua);
}
