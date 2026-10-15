/**
 * Lo que ya pasó en una partida del quiz, leído de la partida misma (`D-71`).
 *
 * El tablero de la partida (el riel), la racha y la planilla del resultado necesitan saber
 * qué se acertó y qué no, y dónde arranca cada escalón. Nada de eso se lleva aparte: sale de
 * `orden` y `elegidas`, que ya guarda `vidas.ts`. Un contador paralelo es un segundo lugar
 * donde la verdad se puede desincronizar.
 */

import type { Jugable } from './ronda.ts';
import type { Partida } from './vidas.ts';

function correcta(item: Jugable): string | null {
  return item.opciones.find((o) => o.correcta)?.texto ?? null;
}

/** Acierto o error de cada pregunta respondida, en orden. */
export function historial<T extends Jugable>(p: Partida<T>): boolean[] {
  return p.elegidas.map((e, i) => {
    const item = p.orden[i];
    return !!item && e === correcta(item);
  });
}

/** Cuántos aciertos seguidos van al final del historial. Un error la corta a cero. */
export function racha<T extends Jugable>(p: Partida<T>): number {
  const h = historial(p);
  let n = 0;
  for (let i = h.length - 1; i >= 0 && h[i]; i--) n++;
  return n;
}

/** Un escalón: su nivel y el índice global de cada pregunta que lo forma. */
export interface Escalon {
  readonly nivel: string;
  readonly indices: readonly number[];
}

/**
 * El orden partido en escalones. Un escalón es una racha de preguntas del mismo nivel
 * (`BR-19` apartado 2: el escalón es el pozo), así que su largo sale del banco.
 */
export function escalones<T extends Jugable>(p: Partida<T>): Escalon[] {
  const grupos: { nivel: string; indices: number[] }[] = [];
  p.orden.forEach((item, i) => {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.nivel === item.dificultad) ultimo.indices.push(i);
    else grupos.push({ nivel: item.dificultad, indices: [i] });
  });
  return grupos;
}

/** Lo respondido, escalón por escalón: lo que se comparte debajo de la frase del resultado. */
export function respondidasPorEscalon<T extends Jugable>(
  p: Partida<T>,
): boolean[][] {
  const h = historial(p);
  return escalones(p).map((g) => g.indices.filter((i) => i < h.length).map((i) => h[i]!));
}
