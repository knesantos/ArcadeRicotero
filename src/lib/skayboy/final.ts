/**
 * El final de Skayboy y Poligirl (ronda de pulida de los juegos, 2026-11-18): **pasar el último
 * nivel de la fila es terminar el juego**, y hasta acá el toque volvía al primero sin decir nada.
 *
 * Lo que hay: una capa de HTML encima del área (`#final-juego`) con el título, los créditos que
 * suben y dos salidas. Acá vive lo que se puede jugar en Node: qué dicen los créditos y de qué
 * lado va la capa. No decide nada de la partida: el mundo ya terminó.
 *
 * **Los créditos son los niveles.** Un fichín de fans no tiene elenco que nombrar —y el pie de
 * homenaje ya dice quién no tuvo nada que ver (`CNT-17`)—; lo que se hizo fueron doce salas con
 * nombre, y esos nombres son lo que sube. Salen del banco sembrado, no de una lista escrita acá.
 */

import { TILE, type Mundo } from './mundo.ts';
import { celdasDeTipo, type Nivel } from './niveles.ts';
import { FINAL } from './copy.ts';

/** Los renglones que suben: cada nivel con su número, en el orden de la fila, y el cierre. */
export function creditosDelFinal(niveles: readonly Pick<Nivel, 'nombre'>[]): string[] {
  return [...niveles.map((n, i) => `${i + 1}. ${n.nombre}`), FINAL.cierre];
}

export type LadoDelFinal = 'izquierda' | 'derecha' | 'medio';

/**
 * **De qué lado va la capa**: del contrario a las puertas, que es donde bailan los dos. Con las
 * dos puertas en la misma mitad del área, la otra mitad; con una en cada punta no hay lado libre,
 * y la capa va al medio, angosta, entre las dos.
 */
export function ladoDelFinal(mundo: Mundo): LadoDelFinal {
  const medio = (mundo.nivel.grilla[0]?.length ?? 0) * TILE / 2;
  const puertas = celdasDeTipo(mundo.banco, mundo.nivel, 'puerta').map((p) => p.columna * TILE + TILE / 2);
  if (puertas.length === 0) return 'medio';
  if (puertas.every((x) => x > medio)) return 'izquierda';
  if (puertas.every((x) => x < medio)) return 'derecha';
  return 'medio';
}
