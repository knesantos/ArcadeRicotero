/**
 * El aviso de un sacudón (`D-80`): cualquier bicho o ruido que pega fuerte lo pide, y la cámara del
 * camino (`camino.ts`, `lib/bestiario/camara.ts`) lo siente. Va por un evento del documento para que
 * nadie tenga que conocer a la cámara: en el mapa del bestiario no hay cámara y el aviso se pierde,
 * que es lo que tiene que pasar.
 */

const SACUDON = 'bestiario:sacudon';

/** Pedir un sacudón, de 0 (nada) a 1 (el meteorito de la vaca). */
export function sacudir(fuerza: number): void {
  // Los tests de los títeres corren sin navegador: ahí no hay a quién avisar.
  if (typeof document === 'undefined') return;
  document.dispatchEvent(new CustomEvent<number>(SACUDON, { detail: fuerza }));
}

/** Escuchar los sacudones. */
export function alSacudon(hacer: (fuerza: number) => void): void {
  document.addEventListener(SACUDON, (ev) => hacer((ev as CustomEvent<number>).detail));
}
