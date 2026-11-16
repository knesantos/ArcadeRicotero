/**
 * El velo que hace de loader (`D-91`, `T-530`; los números, en `lib/bestiario/velos.ts`).
 *
 * Dos cosas, y ninguna puede dejar a nadie adentro:
 *
 * 1. **Soltar el velo de llegada** cuando lo que se ve al llegar ya está: la isla llama a
 *    `soltarElVelo()` al terminar de arrancar, y acá se espera a que estén decodificadas las imágenes
 *    que caen en la primera pantalla (el piso, lo lejano, las baldosas del aire, los títeres de la
 *    entrada). Recién entonces se le pone `data-listo` al velo y la hoja de estilo lo retira. Hay un
 *    tope (`ESPERA.tope`); y si este módulo ni llega a correr, la hoja de estilo lo corta sola
 *    (`--respaldo-velo`). Nada de esto frena el dedo: el velo no agarra toques.
 *
 * 2. **Responder al toque al irse**: al tocar un cartel del cruce, «Al plano» o una región del plano,
 *    la hoja del destino (ya pedida de antemano) entra en la página que se deja. No se frena la
 *    navegación ni un milisegundo: el navegador sigue su camino y la página que llega ya viene tapada
 *    por la misma hoja. Si la página no llega (sin red), la hoja de salida se retira sola.
 */

import { EL_PLANO, ESPERA, SOBRA, VELOS, rutaDelVelo } from '../../lib/bestiario/velos.ts';

const espera = (ms: number): Promise<void> => new Promise((listo) => setTimeout(listo, ms));

/** Una imagen, pedida y decodificada. Si falla, no importa: no es motivo para retener a nadie. */
function decodificada(url: string): Promise<void> {
  const im = new Image();
  im.src = url;
  return im.decode().then(
    () => undefined,
    () => undefined,
  );
}

/** Lo que cae en la primera pantalla (con medio ancho de más, que es lo que asoma al primer paso). */
function loDeLaEntrada(): string[] {
  const urls = new Set<string>();
  const ancho = window.innerWidth;
  const alto = window.innerHeight;
  const cae = (e: Element): boolean => {
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.right > -ancho * 0.25 && r.left < ancho * 1.5 && r.bottom > 0 && r.top < alto;
  };
  for (const e of document.querySelectorAll<HTMLImageElement>('main img, #camino img')) {
    if (e.loading !== 'lazy' && e.currentSrc && cae(e)) urls.add(e.currentSrc);
  }
  for (const e of document.querySelectorAll<SVGImageElement>('main svg image, #camino svg image')) {
    const href = e.getAttribute('href') ?? e.getAttribute('xlink:href');
    if (href && !href.startsWith('data:') && cae(e)) urls.add(href);
  }
  // Las baldosas del aire entran por una variable y van de fondo: el navegador no las cuenta como imágenes.
  for (const e of document.querySelectorAll<HTMLElement>('[data-aire]')) {
    const m = /url\(["']?([^"')]+)["']?\)/.exec(e.style.getPropertyValue('--baldosa'));
    if (m) urls.add(m[1]!);
  }
  return [...urls];
}

let soltado = false;

/**
 * Lo llama la isla cuando ya armó la escena. Devuelve cuando el velo quedó suelto (o cuando no hay
 * velo, o ya estaba suelto).
 */
export async function soltarElVelo(): Promise<void> {
  const velo = document.querySelector<HTMLElement>('.velo-de-llegada');
  if (!velo || soltado) return;
  soltado = true;
  // El tope se cuenta desde que la página empezó a llegar, no desde acá: es lo que vio pasar la gente.
  const queda = Math.max(0, ESPERA.tope - performance.now());
  const hoja = /url\(["']?([^"')]+)["']?\)/.exec(velo.style.getPropertyValue('--velo'))?.[1];
  await Promise.race([Promise.all([...loDeLaEntrada(), ...(hoja ? [hoja] : [])].map(decodificada)), espera(queda)]);
  // Un respiro para que lo decodificado se pinte debajo antes de correr la hoja.
  await espera(60);
  velo.dataset.listo = '';
}

/** La región a la que lleva un enlace del bestiario, o `null` si no es un paso entre pantallas del bestiario. */
export function destinoDe(href: string, aca: string): string | null {
  let url: URL;
  let desde: URL;
  try {
    desde = new URL(aca);
    url = new URL(href, desde);
  } catch {
    return null;
  }
  if (url.origin !== desde.origin) return null;
  const limpio = (p: string): string => p.replace(/\/+$/, '');
  if (limpio(url.pathname) === limpio(desde.pathname)) return null;
  const m = /^\/redondopedia\/bestiario(?:\/([a-z-]+))?$/.exec(limpio(url.pathname));
  if (!m) return null;
  const region = m[1] ?? EL_PLANO;
  return VELOS[region] ? region : null;
}

/** Saca la hoja de salida, si quedó: al volver con «atrás» la página vuelve como estaba. */
function sacarLaSalida(): void {
  document.querySelector('.velo-de-salida')?.remove();
}

/** Escucha los toques que llevan a otra pantalla del bestiario y les contesta enseguida con la hoja del destino. */
export function contestarAlIrse(): void {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.('a[href]');
    if (!a || a.getAttribute('target') === '_blank' || a.hasAttribute('download')) return;
    const region = destinoDe(a.getAttribute('href')!, location.href);
    if (!region) return;
    sacarLaSalida();
    const v = VELOS[region]!;
    const hoja = document.createElement('div');
    hoja.className = 'velo-de-salida';
    hoja.setAttribute('aria-hidden', 'true');
    hoja.dataset.rumbo = v.rumbo;
    hoja.style.setProperty('--velo', `url(${rutaDelVelo(region)})`);
    hoja.style.setProperty('--sobra', String(SOBRA / 100));
    hoja.style.setProperty('--tinta-velo', v.tinta);
    document.body.append(hoja);
    setTimeout(sacarLaSalida, ESPERA.salida);
  });
  // La página guardada para «atrás» vuelve sin la hoja de salida encima.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) sacarLaSalida();
  });
}

// Si la isla se cae antes de avisar, el velo se suelta igual: un error no deja a nadie mirando una hoja.
if (typeof window !== 'undefined') {
  window.addEventListener('error', () => {
    const velo = document.querySelector<HTMLElement>('.velo-de-llegada');
    if (velo && !soltado) velo.dataset.listo = '';
  });
}
