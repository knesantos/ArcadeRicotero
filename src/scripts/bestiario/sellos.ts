/**
 * Los sellos que se asientan (`D-83`): lo que las dos islas del bestiario le hacen a un sello de
 * goma para que termine de apoyar.
 *
 * Nada en el sitio aparece con un fundido (`sitio.css`, el umbral): un sello llega ya estampado y
 * lo único que hace es asentarse, en `--duracion-sello`. El bocadillo, la hoja de la ficha y la
 * libreta ya tienen esa animación en CSS; acá está el empujón para que vuelva a correr cuando el
 * elemento ya estaba a la vista (otro verso en el mismo bocadillo, otra ficha en la misma hoja),
 * y el sello «Anotado» que se le pega a la copia de la ficha, con la cuenta de la libreta.
 *
 * Solo DOM y copy: nada que dibuje, como piden `camino.test.ts` y `bestiario.test.ts`.
 */

import { BESTIARIO } from '../../lib/bestiario/copy.ts';

/**
 * Vuelve a apoyar algo que ya estaba a la vista: se esconde, se mide (para que el navegador lo
 * dé por ido) y se muestra. Si estaba escondido, es mostrarlo y nada más.
 */
export function reposar(el: HTMLElement): void {
  el.hidden = true;
  void el.offsetWidth;
  el.hidden = false;
}

/** Vuelve a estampar un sello que ya tiene su clase (la libreta cuando la cuenta sube). */
export function sellar(el: HTMLElement, clase: string): void {
  el.classList.remove(clase);
  void el.offsetWidth;
  el.classList.add(clase);
}

/**
 * El sello «Anotado» y la cuenta de la libreta, pegados al sello de clase de la copia de la ficha
 * que va a la hoja. Así lo anotado se ve donde se anota, también en el camino, donde la libreta
 * vive plegada en el tablero. `nueva`: recién anotada, el sello se estampa; si no, ya estaba.
 */
export function sellarAnotada(copia: HTMLElement, nueva: boolean, anotadas: number, total: number): void {
  const sello = copia.querySelector('.bestiario-sello');
  if (!sello) return;
  const anotado = document.createElement('span');
  anotado.className = `bestiario-anotada-sello bestiario-anotada-sello--hoja${nueva ? ' bestiario-anotada-sello--nueva' : ''}`;
  anotado.textContent = BESTIARIO.anotada;
  const cuenta = document.createElement('span');
  cuenta.className = 'bestiario-hoja-cuenta';
  cuenta.textContent = BESTIARIO.libreta(anotadas, total);
  sello.after(anotado, cuenta);
}
