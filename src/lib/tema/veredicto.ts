/**
 * El veredicto de una vuelta de «Adiviná el tema» (`T-535`): qué línea canta, qué número es
 * el grande y qué puerta queda abierta. Lo usa la isla `partida-tema.ts`; vive acá para que
 * lo pueda correr un test.
 *
 * ## Por qué no alcanza con `tramo()` del quiz
 *
 * La isla llamaba a `tramo(aciertos, temas)`, que corta en 30 % y 70 % **de aciertos**. En una
 * vuelta de cuatro temas —uno fácil y tres entre media y difícil, `vuelta.ts`— eso manda a
 * `bajo` a todo el que sacó uno, sin mirar con cuánto audio. Al que sacó un tema con la
 * primera décima, que es la hazaña del juego, el resultado le decía «Te falta escuchar disco.»
 * (`REV-24` r0-afuera, C-5).
 *
 * El juego tiene dos monedas y la banda miraba una sola. Acá mira las dos:
 *
 *  - **bajo** — menos del 30 % de los temas, menos del 30 % de los puntos, y ningún tema
 *    sacado con dos segundos o menos. Es el único que dice «Te falta escuchar disco.»;
 *  - **oido** — pocos temas, pero alguno de oído (o los puntos ya pasan el corte);
 *  - **medio** y **alto** — como antes, por aciertos (`BR-05`).
 *
 * ## Y nunca sola
 *
 * La línea de `bajo` va siempre con la cuenta de lo que sacaste como número grande
 * (`titularDeLaVuelta`) y con una puerta (`puertaDeLaVuelta`). `veredicto.test.ts` falla si
 * alguna de las tres falta, o si la frase le sale a quien sacó bien.
 */

import { tramo as tramoPorAciertos, CORTE_MEDIO } from '../quiz/tramo.ts';
import { puertaHacia, type Puerta } from '../puerta.ts';
import { ESCALERA, puntajeMaximo } from './escalera.ts';
import { RESULTADO, TARJETA, TITULAR } from './copy.ts';

/** Las claves de `TRAMOS` en `tema/copy.ts`. La isla indexa con esto. */
export type TramoDeVuelta = 'bajo' | 'oido' | 'medio' | 'alto';

/**
 * Desde cuántos puntos un tema cuenta como sacado **de oído**: 60 es el tercer escalón, dos
 * segundos de audio. De ahí para abajo (4 s, 8 s, el resto) ya hubo tiempo de reconocerlo.
 */
export const PUNTOS_DE_OIDO = 60;

function aciertosDe(marcador: readonly number[]): number {
  return marcador.filter((p) => p > 0).length;
}

function puntosDe(marcador: readonly number[]): number {
  return marcador.reduce((a, p) => a + p, 0);
}

/**
 * En qué tramo cae la vuelta.
 *
 * @param marcador los puntos de cada tema jugado, en orden; 0 es "no salió"
 * @param temas    cuántos temas tenía la vuelta
 */
export function tramoDeLaVuelta(marcador: readonly number[], temas: number): TramoDeVuelta {
  const porAciertos = tramoPorAciertos(aciertosDe(marcador), temas);
  if (porAciertos !== 'bajo') return porAciertos;
  if (marcador.some((p) => p >= PUNTOS_DE_OIDO)) return 'oido';
  if ((puntosDe(marcador) / puntajeMaximo(temas)) * 100 >= CORTE_MEDIO) return 'oido';
  return 'bajo';
}

/** Lo que va en la cifra grande del resultado, con su rótulo y su renglón de abajo. */
export interface Titular {
  /** Qué es el número grande: el tiempo, o lo que sacaste. */
  readonly es: 'tiempo' | 'sacaste';
  readonly rotulo: string;
  readonly numero: string;
  /** El renglón chico de abajo: lo que no fue titular. */
  readonly pie: string;
  /** El rótulo del mismo número adentro de la tarjeta que se comparte. */
  readonly rotuloTarjeta: string;
}

/**
 * Qué número es el grande.
 *
 * El tiempo, cuando sacaste **al menos la mitad**: ahí es lo que se cuenta al salir, y es lo
 * que pidió el usuario el 2026-08-27. Con menos de la mitad, el reloj mide cuánto estuviste
 * pidiendo audio, y ponerlo en lo más grande era castigar (`REV-24` r0-afuera, A-6 y C-6):
 * lo grande pasa a ser cuántos sacaste, y el reloj baja al renglón de abajo. Si sacaste uno
 * solo, el renglón dice además con cuánto audio.
 *
 * @param tiempo el total de la vuelta ya escrito (`duracion()` de `reloj.ts`)
 */
export function titularDeLaVuelta(marcador: readonly number[], temas: number, tiempo: string): Titular {
  const aciertos = aciertosDe(marcador);
  const puntos = RESULTADO.puntos(puntosDe(marcador), puntajeMaximo(temas));

  if (aciertos * 2 >= temas) {
    return {
      es: 'tiempo',
      rotulo: RESULTADO.rotuloTiempo,
      numero: tiempo,
      pie: `${RESULTADO.sacaste(aciertos, temas)} · ${puntos}`,
      rotuloTarjeta: TARJETA.rotuloTiempo,
    };
  }

  const partes: string[] = [];
  if (aciertos === 1) {
    const sacado = marcador.find((p) => p > 0)!;
    const paso = ESCALERA.find((e) => e.puntos === sacado);
    if (paso) partes.push(TITULAR.conAudio(paso.deAudio));
  }
  partes.push(puntos, TITULAR.enTiempo(tiempo));
  return {
    es: 'sacaste',
    rotulo: TITULAR.rotuloSacaste,
    numero: TITULAR.cuenta(aciertos, temas),
    pie: partes.join(' · '),
    rotuloTarjeta: TITULAR.rotuloSacaste,
  };
}

/**
 * La puerta de la vuelta: solo cuando la línea es la de `bajo`, que es la que no puede ir
 * sola. Lleva al artículo del disco del **primer tema que no salió**.
 *
 * @param discos el disco de cada tema de la vuelta, en el mismo orden que `marcador`
 */
export function puertaDeLaVuelta(
  discos: readonly string[],
  marcador: readonly number[],
  temas: number = discos.length,
): Puerta | null {
  if (tramoDeLaVuelta(marcador, temas) !== 'bajo') return null;
  const i = discos.findIndex((_, k) => (marcador[k] ?? 0) <= 0);
  return puertaHacia(i >= 0 ? discos[i] : null);
}
