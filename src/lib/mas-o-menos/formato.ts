/**
 * Cómo se escribe un número de "Más o menos" (`US-10`) en pantalla.
 *
 * Tres escalas, tres maneras, y ninguna la decide el navegador: un año va pelado (1986, no
 * 1.986), una cantidad lleva el punto de miles desde el mil (4.700, 70.000), y una duración
 * va en minutos y segundos (5:34), que es como la lee cualquiera que miró un disco.
 *
 * **El punto de miles va a mano, no con `Intl`.** La regla de CLDR para el castellano no
 * agrupa los números de cuatro cifras (daría "4700"), y además cambia según la versión de
 * ICU que traiga cada navegador. El mismo número tiene que verse igual en el teléfono, en el
 * build y en el test.
 */

import type { Escala } from './referencia.ts';

/** `1986` → `"1986"`; `70000` → `"70.000"`; `334` segundos → `"5:34"`. */
export function numeroEnPantalla(valor: number, escala: Escala): string {
  if (escala === 'anio') return String(valor);
  if (escala === 'segundos') {
    const minutos = Math.floor(valor / 60);
    const segundos = valor % 60;
    return `${minutos}:${String(segundos).padStart(2, '0')}`;
  }
  return conPuntoDeMiles(valor);
}

export function conPuntoDeMiles(valor: number): string {
  const signo = valor < 0 ? '-' : '';
  const cifras = String(Math.abs(Math.trunc(valor)));
  return signo + cifras.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** El número con su unidad, cuidando el singular: "1 tema", "34 temas". */
export function conUnidad(valor: number, escala: Escala, unidad?: readonly [string, string]): string {
  const numero = numeroEnPantalla(valor, escala);
  if (!unidad) return numero;
  return `${numero} ${valor === 1 ? unidad[0] : unidad[1]}`;
}
