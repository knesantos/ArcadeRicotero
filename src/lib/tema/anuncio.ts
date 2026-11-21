/**
 * Lo que escucha quien no ve "Adiviná el tema" cuando pasa algo que solo se ve (`T-534`,
 * `REV-24` perfil C, hallazgo 2).
 *
 * Registro 3 (`voz-ricotera.md` §5): dice qué pasó y se calla. Las palabras que ya están a la
 * vista salen de `copy.ts` —el grito, "Era", los puntos—, así el que escucha y el que mira
 * reciben lo mismo. Lo único propio es el intento errado, que a la vista es una cruz.
 *
 * Los intentos que quedan no se dicen acá: los anuncia su propio renglón, que ya es región
 * viva (`restantesEl` en `partida-tema.ts`).
 */

import { REVELACION } from './copy.ts';

/** Un intento que no era: nombra lo que se arriesgó, para que se sepa cuál se gastó. */
export function anuncioErrado(titulo: string): string {
  return `No era ${titulo}.`;
}

/** La revelación, en una frase por dato: cómo salió, cuál era y qué sumó. */
export function anuncioRevelacion(acerto: boolean, titulo: string, ganados: number): string {
  const era = `${REVELACION.eraEl} ${titulo}.`;
  return acerto ? `${REVELACION.acerto} ${era} ${REVELACION.puntos(ganados)}.` : `${REVELACION.fallo} ${era}`;
}
