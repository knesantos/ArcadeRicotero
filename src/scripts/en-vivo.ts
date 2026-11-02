/**
 * La isla de la página "En vivo" (`D-72`): cada tema con recorte suena al tocarlo, y cada
 * lista entera suena de punta a punta, diez segundos por tema, marcando el renglón que suena.
 *
 * Todo lo que se lee ya está en el HTML: los rótulos de los botones vienen en `data-` desde
 * `lib/recital/copy.ts`, así que esta isla no trae ni una cadena propia (`voz.test.ts` audita
 * los módulos de copy, no las islas).
 */

import { crearRocola } from './rocola.ts';

const rocola = crearRocola();
const aviso = document.getElementById('en-vivo-aviso');

/**
 * Llegar por el `#` de una lista la abre (`D-84`: el afiche de noviembre manda a la noche del
 * 19). `:target` no abre un `<details>` solo: el navegador baja hasta el resumen y la lista
 * queda plegada, que es llegar a una puerta cerrada.
 */
function abrirLaDelHash(): void {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const lista = document.getElementById(id);
  if (lista instanceof HTMLDetailsElement) lista.open = true;
}
abrirLaDelHash();
window.addEventListener('hashchange', abrirLaDelHash);

/** El botón que está en "Pará", para devolverlo a su rótulo cuando termina. */
let botonActivo: HTMLButtonElement | null = null;

function soltar(): void {
  document.querySelectorAll('.en-vivo-tema--sonando').forEach((n) => n.classList.remove('en-vivo-tema--sonando'));
  if (botonActivo) {
    botonActivo.textContent = botonActivo.dataset.escuchar ?? '';
    botonActivo.setAttribute('aria-pressed', 'false');
  }
  botonActivo = null;
}

function tomar(b: HTMLButtonElement): void {
  soltar();
  botonActivo = b;
  b.textContent = b.dataset.parar ?? '';
  b.setAttribute('aria-pressed', 'true');
}

function marcar(li: Element | null): void {
  document.querySelectorAll('.en-vivo-tema--sonando').forEach((n) => n.classList.remove('en-vivo-tema--sonando'));
  if (!li) return;
  li.classList.add('en-vivo-tema--sonando');
  // Con movimiento reducido, de un salto (`REV-23`, `FIND-166`).
  const calma = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  li.scrollIntoView({ block: 'nearest', behavior: calma ? 'auto' : 'smooth' });
  if (aviso) aviso.textContent = li.querySelector('.en-vivo-titulo')?.textContent?.trim() ?? '';
}

document.addEventListener('click', (e) => {
  const b = (e.target as Element | null)?.closest<HTMLButtonElement>('button.en-vivo-play, button.en-vivo-escuchar');
  if (!b) return;
  if (b === botonActivo) {
    rocola.parar();
    return;
  }
  // Lo que sonaba se corta primero, con su propio aviso de fin, y recién después el botón
  // nuevo pasa a "Pará": al revés, el fin de lo viejo soltaría el botón nuevo.
  rocola.parar();
  if (b.classList.contains('en-vivo-play')) {
    const slug = b.dataset.slug;
    if (!slug) return;
    tomar(b);
    marcar(b.closest('.en-vivo-tema'));
    rocola.tocar(slug, soltar);
    return;
  }
  const lista = document.getElementById(b.dataset.lista ?? '');
  if (!lista) return;
  const renglones = [...lista.querySelectorAll<HTMLElement>('.en-vivo-tema[data-suena]')];
  if (renglones.length === 0) return;
  tomar(b);
  rocola.tocarLista(
    renglones.map((r) => r.dataset.suena!),
    (pos) => marcar(renglones[pos] ?? null),
    soltar,
  );
});
