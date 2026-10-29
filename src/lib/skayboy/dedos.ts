/**
 * El pulgar en el mando de Skayboy y Poligirl (`D-61` punto 4): **qué tecla aprieta un dedo según
 * dónde está, y qué pasa cuando se corre sin levantarse.**
 *
 * ## Por qué existe
 *
 * Hasta el 2026-10-04 cada botón capturaba su puntero: el dedo que bajaba en ← quedaba apretando ←
 * hasta levantarse, aunque se corriera a →. En un teléfono eso es un mando que no responde. Y
 * correr saltando pedía dos dedos en la misma columna —la flecha y el bloque de saltar a la vez—,
 * cuando los niveles 4 a 6 solo se ganan así (los cinco renglones con salto de
 * `skayboy-soluciones.json` son todos salto y dirección).
 *
 * Ahora el puntero lo captura **la columna**, y este módulo decide:
 *
 * 1. **La tecla es la que queda más cerca del dedo** (`teclaBajoElDedo()`): sin franjas muertas
 *    entre teclas, que son justo por donde pasa un pulgar que cambia de dirección. Lejos de todas
 *    —más de `MARGEN_DEL_DEDO`—, ninguna: el dedo se fue de la columna.
 * 2. **La dirección viaja con el pulgar al saltar** (`moverDedo()`): si el dedo sube de una flecha
 *    al bloque de saltar sin levantarse, aprieta saltar **y sigue apretando esa flecha**. Así un
 *    pulgar por columna alcanza para correr saltando, que es como `UX-28` §2.2 contaba que se iba a
 *    jugar en solitario. Si el dedo baja a una flecha, queda solo esa; si baja derecho en saltar,
 *    salta parado.
 *
 * La física no se entera: el mundo sigue leyendo un `Mando` con tres booleanos, el salto sigue
 * saliendo por flanco (`mundo.ts`), y las trazas y el solucionador no cambian.
 *
 * Módulo hoja, sin DOM y sin motor: las cajas las mide la isla y se las pasa en px CSS. Lo juega
 * `dedos.test.ts`.
 */

import type { TeclaDelMando } from './teclado.ts';

/** La caja de una tecla, en px CSS, medida desde el mismo origen que el dedo. */
export interface CajaDeTecla {
  readonly izquierda: number;
  readonly arriba: number;
  readonly ancho: number;
  readonly alto: number;
}

/** Las cajas de una columna. Una tecla escondida (`display: none`, `D-55`) mide cero y no cuenta. */
export type CajasDelMando = Readonly<Partial<Record<TeclaDelMando, CajaDeTecla>>>;

/**
 * Hasta dónde se corre un dedo afuera de la tecla más cercana y sigue apretándola, en px CSS. Es
 * dos tercios de `--toque-min` (48): alcanza para el pulgar que se pasa un poco del borde de la
 * columna, y no llega a la otra columna, que en el apilado está a 8.
 */
export const MARGEN_DEL_DEDO = 32;

/**
 * El orden en que se desempata. **Las flechas primero**: en la franja entre el piso y el bloque de
 * saltar, a igual distancia de los dos, gana seguir caminando. Saltar sin querer es peor que
 * tardar un píxel en saltar.
 */
const ORDEN: readonly TeclaDelMando[] = ['izquierda', 'derecha', 'salto'];

/** La distancia de un punto a una caja: cero adentro, y la del borde más cercano afuera. */
export function distanciaACaja(caja: CajaDeTecla, x: number, y: number): number {
  const dx = Math.max(caja.izquierda - x, 0, x - (caja.izquierda + caja.ancho));
  const dy = Math.max(caja.arriba - y, 0, y - (caja.arriba + caja.alto));
  return Math.hypot(dx, dy);
}

/**
 * **La tecla que aprieta un dedo en ese punto**: la de la caja más cercana, o `null` si todas
 * quedan a más de `margen`. Las cajas vacías no cuentan: con mouse los botones están escondidos
 * (`D-55`) y un clic sobre la leyenda no tiene que apretar nada.
 */
export function teclaBajoElDedo(cajas: CajasDelMando, x: number, y: number, margen = MARGEN_DEL_DEDO): TeclaDelMando | null {
  let mejor: TeclaDelMando | null = null;
  let distancia = Infinity;
  for (const tecla of ORDEN) {
    const caja = cajas[tecla];
    if (caja === undefined || !(caja.ancho > 0) || !(caja.alto > 0)) continue;
    const d = distanciaACaja(caja, x, y);
    if (d < distancia) {
      mejor = tecla;
      distancia = d;
    }
  }
  return distancia <= margen ? mejor : null;
}

/** Una dirección: lo único que puede viajar con el pulgar. */
export type Direccion = 'izquierda' | 'derecha';

/** Lo que aprieta un dedo: la tecla bajo él y, si subió de una flecha a saltar, esa flecha. */
export interface Dedo {
  readonly tecla: TeclaDelMando | null;
  readonly arrastre: Direccion | null;
}

/** Un dedo que no aprieta nada: se fue de la columna. */
export const SIN_TECLA: Dedo = Object.freeze({ tecla: null, arrastre: null });

const esDireccion = (t: TeclaDelMando | null): t is Direccion => t === 'izquierda' || t === 'derecha';

/** El dedo que acaba de bajar: aprieta lo que tiene abajo y nada más. Bajar en saltar es saltar parado. */
export function apoyarDedo(bajo: TeclaDelMando | null): Dedo {
  return bajo === null ? SIN_TECLA : { tecla: bajo, arrastre: null };
}

/**
 * **El dedo que se corrió sin levantarse.** Devuelve el mismo objeto si no cambió nada, así la isla
 * puede comparar por identidad y no tocar el DOM.
 *
 * - A saltar, desde una flecha: salta y **se lleva la flecha**. Desde saltar con una flecha ya
 *   arrastrada, la conserva.
 * - A una flecha: esa flecha sola. El arrastre se suelta: el pulgar volvió al piso.
 * - Afuera de la columna: nada. Si vuelve, aprieta lo que encuentre, como recién apoyado.
 */
export function moverDedo(antes: Dedo, bajo: TeclaDelMando | null): Dedo {
  if (bajo === antes.tecla) return antes;
  if (bajo === null) return SIN_TECLA;
  if (bajo === 'salto') return { tecla: 'salto', arrastre: esDireccion(antes.tecla) ? antes.tecla : antes.arrastre };
  return { tecla: bajo, arrastre: null };
}

/** Las teclas que aprieta ese dedo, sin repetir: la de abajo y la que arrastra. */
export function teclasDelDedo(dedo: Dedo): TeclaDelMando[] {
  const teclas: TeclaDelMando[] = [];
  if (dedo.tecla !== null) teclas.push(dedo.tecla);
  if (dedo.arrastre !== null && dedo.arrastre !== dedo.tecla) teclas.push(dedo.arrastre);
  return teclas;
}
