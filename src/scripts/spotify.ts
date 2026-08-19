/**
 * El unico punto del sitio que toca Spotify. Implementa `ADR-01` opcion B y su `RQ-B8`.
 *
 * `RQ-B8` pide que esto viva aislado: **si borrar este archivo no rompe nada mas, el
 * requisito se cumple.** Y eso importa porque `ADR-01` cerro en deep link sabiendo que
 * la Developer Policy de Spotify prohibe los juegos (`RES-26`), y que el plan de
 * reversion es literalmente borrar el componente. Que sea barato de borrar es lo que
 * hace que la decision sea defendible.
 *
 * Los otros requisitos, todos verificables con grep sobre `dist/`:
 *   RQ-B1  la URL exacta, sin parametros
 *   RQ-B2  un <a> y nada mas: sin iframe, sin script, sin fetch, sin SDK
 *   RQ-B3  target="_blank" + rel="noopener noreferrer"
 *   RQ-B4  nada de preconnect / dns-prefetch / prefetch / preload a dominios de Spotify
 *   RQ-B5  sin trackId no se renderiza el boton: ni deshabilitado, ni gris
 *   RQ-B6  aparece despues del reveal, y nunca bloquea la partida
 *   RQ-B7  ningun asset servido por Spotify
 */

/** Devuelve el link, o `null` si no hay trackId. `RQ-B5`. */
export function botonSpotify(trackId: string | undefined): HTMLAnchorElement | null {
  if (!trackId) return null;
  const a = document.createElement('a');
  a.className = 'spotify';
  a.textContent = 'Escuchalo en Spotify';
  a.href = `https://open.spotify.com/track/${trackId}`;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  return a;
}
