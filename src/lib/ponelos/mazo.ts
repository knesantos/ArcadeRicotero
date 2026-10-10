/**
 * El mazo de "Ponelos en fila" (`US-08`, `D-69`): en qué orden se reparten las fichas que
 * siguen sin ubicar.
 *
 * ## Por qué hay un mazo, si el tablero ya sabe qué falta
 *
 * Hasta `D-69` se jugaba "tocás una ficha, tocás una fila": dos toques por ficha, y entre
 * los dos un salto de pantalla, porque la bandeja y las filas no entran juntas en un
 * teléfono. Con diez fichas se aguantaba. Con los ciento cinco temas —que es lo que el
 * usuario pidió, y con razón: *"la gracia de los tierlist así es que sean muchísimas cosas
 * las que estás poniendo en orden"*— eran doscientos diez toques y ciento cinco saltos.
 *
 * Ahora el juego **reparte de a una**: abajo, en la zona del pulgar, queda la que sigue, y
 * debajo un botón por fila. Un toque y aparece la próxima. El tablero sigue siendo la
 * verdad de dónde está cada ficha; el mazo es solo **el orden en que se te ofrecen**, y por
 * eso no viaja en el link ni toca el orden canónico de `conjuntos.ts`.
 *
 * ## Funciones puras, como el tablero
 *
 * El mazo es un arreglo de índices del conjunto. Nada acá muta lo que recibe, y todo se
 * puede rehacer desde el reparto con `sincronizar`, que es lo que hace imposible que el
 * mazo y el tablero se contradigan: si se deshace una jugada, se desarma la lista o llega
 * un link, el mazo se reconcilia en vez de confiar en su propia memoria.
 */

import { SIN_UBICAR } from './filas.ts';
import type { Reparto } from './tablero.ts';

/** Índices de fichas del conjunto, en el orden en que se van a repartir. */
export type Mazo = readonly number[];

/** El mazo de un reparto: las que faltan ubicar, en el orden del conjunto. */
export function armarMazo(reparto: Reparto): Mazo {
  const mazo: number[] = [];
  reparto.forEach((v, i) => {
    if (v === SIN_UBICAR) mazo.push(i);
  });
  return mazo;
}

/**
 * Reconcilia el mazo con el tablero.
 *
 * Se quedan, en el orden que tenían, las que siguen sin ubicar; se van las que ya se
 * ubicaron; y las que volvieron a la bandeja sin estar en el mazo (una ficha que se sacó de
 * una fila, una jugada deshecha) **van al fondo**, en el orden del conjunto. Al fondo y no
 * arriba: el que está repartiendo no tiene que volver a ver de golpe una que ya decidió.
 */
export function sincronizar(mazo: Mazo, reparto: Reparto): Mazo {
  const siguen = mazo.filter(
    (i, n) => Number.isInteger(i) && reparto[i] === SIN_UBICAR && mazo.indexOf(i) === n,
  );
  const ya = new Set(siguen);
  const vuelven = armarMazo(reparto).filter((i) => !ya.has(i));
  return [...siguen, ...vuelven];
}

/** La que sigue, o `null` si no queda ninguna. */
export function primera(mazo: Mazo): number | null {
  return mazo.length > 0 ? mazo[0]! : null;
}

/** Cuántas quedan por repartir. */
export function quedan(mazo: Mazo): number {
  return mazo.length;
}

/** Saltear: la que sigue pasa al fondo del mazo. Con una sola, no cambia nada. */
export function saltear(mazo: Mazo, indice: number): Mazo {
  if (!mazo.includes(indice)) return mazo;
  return [...mazo.filter((i) => i !== indice), indice];
}

/** Elegir una del mazo a mano: pasa arriba de todo, y el resto queda como estaba. */
export function alFrente(mazo: Mazo, indice: number): Mazo {
  if (!mazo.includes(indice)) return mazo;
  return [indice, ...mazo.filter((i) => i !== indice)];
}

/**
 * Mezclar: el mazo en otro orden, con el azar inyectado (Fisher-Yates sobre una copia).
 *
 * No toca qué fichas hay, solo en qué orden salen. Es lo que hace que repartir los ciento
 * cinco no sea siempre arrancar por *Gulp!*.
 */
export function mezclar(mazo: Mazo, rnd: () => number = Math.random): Mazo {
  const a = [...mazo];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
