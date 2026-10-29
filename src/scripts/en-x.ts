/**
 * "Compartí" cuando el juego se juega adentro de X (`T-512`).
 *
 * Adentro del reproductor la escalera de siempre (`compartir.ts`) se queda corta: un iframe
 * ajeno no tiene permiso para el menú del sistema ni para el portapapeles, y terminaba en la
 * dirección escrita para copiar a mano. Y el que juega adentro de X ya está en X: lo que
 * quiere es postear. Así que el primer escalón es el posteo ya escrito, con **la puente**
 * como dirección (`lib/en-x.ts`), para que el posteo nuevo también se juegue adentro.
 *
 * Tiene que llamarse **antes del primer `await`**: abrir una pestaña pide el toque en la mano.
 * Si el navegador la bloquea, devuelve `false` y cada juego sigue con su escalera.
 */
import { enlaceDePosteo, puenteDe } from '../lib/en-x.ts';

/** El juego está adentro de un reproductor: lo marca `Cabeza` antes de pintar. */
export const incrustado = (): boolean => document.documentElement.classList.contains('incrustado');

export function postearEnX(texto: string, direccion: string): boolean {
  const pestania = window.open(enlaceDePosteo(texto, puenteDe(direccion)), '_blank');
  if (!pestania) return false;
  pestania.opener = null;
  return true;
}
