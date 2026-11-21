/**
 * La puerta del resultado del quiz (`T-535`, `REV-24` r0-afuera C-11).
 *
 * Solo en la **derrota**: es el desenlace en el que algo se escapó (tres preguntas, por lo
 * menos) y el único que hoy deja al jugador en un callejón. La retirada es una decisión y la
 * victoria no necesita consuelo.
 *
 * Lleva al disco de la **última pregunta errada que tenga disco** —la que apagó la partida,
 * o la más cercana—, y si ninguna de las erradas remite a un disco (la misa, los trapos), al
 * juego que se juega mirando. La regla común está en `lib/puerta.ts`.
 */

import { puertaHacia, type Puerta } from '../puerta.ts';
import { historial } from './recorrido.ts';
import type { Jugable } from './ronda.ts';
import type { Partida } from './vidas.ts';

export function puertaDelQuiz<T extends Jugable & { readonly disco?: string }>(p: Partida<T>): Puerta | null {
  if (p.desenlace !== 'derrota') return null;
  const h = historial(p);
  for (let i = h.length - 1; i >= 0; i--) {
    const disco = p.orden[i]?.disco;
    if (!h[i] && disco) return puertaHacia(disco);
  }
  return puertaHacia(null);
}
