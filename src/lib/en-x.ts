/**
 * Los juegos que se juegan adentro de un posteo de X (`T-513`).
 *
 * X no tiene miniapps: la única vía es la **Player Card**, un iframe adentro del posteo que
 * apunta al juego de siempre con `?incrustado`. La dirección que se pega en X no es la del
 * juego sino la de su **página puente** (`/en-x/…`), que es la que lleva las etiquetas del
 * reproductor y le manda el juego a quien la abre en un navegador.
 *
 * Este módulo hace la cuenta que cierra el círculo: el que terminó de jugar adentro de X y
 * toca "Compartí" postea **la puente**, no el juego, así el posteo nuevo también se juega
 * adentro. Sin `document` ni `window`, para que se pruebe en Node.
 */

/** Cada juego que tiene puente: la ruta del juego, y la de su puente. */
export const PUENTES: ReadonlyArray<readonly [juego: string, puente: string]> = [
  ['/juegos/adivinar-el-tema/', '/en-x/adivinar-el-tema/'],
  ['/juegos/dos-ejes/', '/en-x/que-tipo-de-ricotero-sos/'],
  // El bestiario redondo (`T-517`): la portada y cada región que se camina, que cuelgan de acá.
  ['/redondopedia/bestiario/', '/en-x/bestiario/'],
];

/** El reproductor que X dibuja: vertical, porque todo lo que va adentro se pensó para el celular parado. */
export const REPRODUCTOR = { ancho: 480, alto: 720 } as const;

/**
 * La puente de una dirección del sitio, con lo que traiga detrás: las postales de dos ejes
 * (`cu-1/` … `cu-4/`) y las regiones del bestiario tienen la suya, y el desafío de la búsqueda
 * y la bestia del `#` viajan tal cual.
 * Una dirección sin puente vuelve como llegó.
 */
export function puenteDe(direccion: string): string {
  const url = new URL(direccion);
  const par = PUENTES.find(([juego]) => url.pathname.startsWith(juego));
  if (!par) return direccion;
  url.pathname = par[1] + url.pathname.slice(par[0].length);
  return url.href;
}

/** El posteo de X ya escrito, para abrir en una pestaña: el texto y la dirección por separado. */
export function enlaceDePosteo(texto: string, direccion: string): string {
  const url = new URL('https://x.com/intent/post');
  url.searchParams.set('text', texto);
  url.searchParams.set('url', direccion);
  return url.href;
}
