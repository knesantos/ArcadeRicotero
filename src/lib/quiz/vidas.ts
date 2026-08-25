/**
 * La partida por vidas del quiz. Implementa `BR-19` (`Docs/PRODUCTO/PRD-alcance-v1.md`).
 *
 * ## Por que este archivo existe en vez de reescribir `ronda.ts`
 *
 * `armarRonda` y `contarAciertos` **los comparten los cuatro juegos**: el quiz
 * (`partida.ts`), adivinar la tapa (`partida-tapa.ts`) y completar la letra
 * (`partida-letra.ts`) los importan tal cual, y `tramo.ts` lo usa ademas adivinar el
 * tema. Meterle vidas a `ronda.ts` habria cambiado la mecanica de tres juegos que hoy
 * andan y que nadie pidio tocar — y el sitio esta **desplegado**, asi que se habrian roto
 * en vivo.
 *
 * Entonces esto **compone sobre** lo que ya hay: `armarRonda(banco, banco.length)` sirve
 * el banco entero ya ordenado por nivel y barajado adentro de cada nivel, que es
 * exactamente el orden que `BR-19` necesita. Este archivo le pone las vidas encima y
 * decide cuando la partida termina.
 *
 * ## El escalon dura lo que dura el pozo, y no son 10
 *
 * El usuario pidio *"cada 10 preguntas aumenta la dificultad"*. `BR-19` apartado 2 se
 * desvia a proposito y sirve **10 / 15 / 15**, que son los pozos reales del banco. El
 * motivo esta escrito entero alla, pero el resumen es que un escalon parejo de 10 deja
 * items sin usar, y eso vuelve **imposible** la otra instruccion del mismo usuario: que
 * agotar el banco de 40 sea la victoria. Entre las dos gana la del desenlace.
 *
 * Consecuencia practica: **este archivo no tiene ninguna constante de largo de escalon.**
 * El escalon es el pozo, y el pozo lo define el banco. Si `contenido` carga cinco faciles
 * mas, el primer escalon pasa a durar 15 sin que nadie toque codigo.
 *
 * ## Tres desenlaces, no dos
 *
 * `BR-19` apartado 6 y 7. Ademas de ganar y perder hay **retirada voluntaria**, y no es
 * un adorno: la partida ganada mide ~18 minutos y 40 segundos medidos contra el texto
 * real del banco, contra los "dos o tres minutos" que declara el brief. Sin una salida
 * limpia, el unico modo de cerrar una partida que va bien es perderla — que es cobrarle
 * la sesion larga justo al que mas sabe.
 */

import { armarRonda, type Jugable } from './ronda.ts';
import type { Dificultad } from './banco.ts';

/** `BR-19` apartado 1. Se pierde una **solo** por responder incorrecto. */
export const VIDAS_INICIALES = 3;

/**
 * En que termino la partida.
 *
 * `retirada` es un estado propio y no una variante de `derrota` a proposito: `BR-19`
 * apartado 6 punto 1 es explicito en que **retirarse no es perder**, y de los tres solo
 * la derrota se presenta como algo que salio mal.
 */
export type Desenlace = 'jugando' | 'victoria' | 'derrota' | 'retirada';

export interface Partida<T extends Jugable> {
  /** El banco entero, ordenado por `armarRonda`: pozo facil, pozo medio, pozo dificil. */
  readonly orden: readonly T[];
  /** Cual se esta jugando. Al terminar queda apuntando a la ultima respondida. */
  readonly indice: number;
  readonly vidas: number;
  /** Lo elegido en cada pregunta respondida, en orden. */
  readonly elegidas: readonly (string | null)[];
  readonly desenlace: Desenlace;
}

/** Lo que la pantalla de resultado necesita. `BR-19` apartado 6. */
export interface Resultado {
  readonly desenlace: Exclude<Desenlace, 'jugando'>;
  /** Numero de la ultima pregunta respondida, en base 1. */
  readonly pregunta: number;
  /** Cuantas tiene el banco entero. */
  readonly total: number;
  /** En que nivel estaba al momento del desenlace. `null` si se retiro sin responder. */
  readonly nivel: Dificultad | null;
  readonly aciertos: number;
  readonly respondidas: number;
  /**
   * Solo en `retirada`. `BR-19` apartado 6 punto 4: es lo que distingue una retirada
   * tranquila de una al limite. En victoria siempre quedo al menos 1 y en derrota
   * siempre 0, asi que ahi el dato no agrega nada.
   */
  readonly vidasRestantes: number | null;
}

export class PartidaImposible extends Error {}

/**
 * Arranca una partida con el banco entero.
 *
 * El `largo` que recibe `armarRonda` es `banco.length` y no un numero fijo: es la unica
 * linea de este archivo que implementa el apartado 2 de `BR-19`, y por eso esta sola y
 * comentada. Todo lo demas de esta funcion es estado inicial.
 */
export function comenzar<T extends Jugable>(
  banco: readonly T[],
  azar: () => number = Math.random,
): Partida<T> {
  if (banco.length === 0) throw new PartidaImposible('el banco esta vacio');
  return {
    orden: armarRonda(banco, banco.length, azar),
    indice: 0,
    vidas: VIDAS_INICIALES,
    elegidas: [],
    desenlace: 'jugando',
  };
}

/** La pregunta que se esta jugando, o `null` si la partida termino. */
export function actual<T extends Jugable>(p: Partida<T>): T | null {
  if (p.desenlace !== 'jugando') return null;
  return p.orden[p.indice] ?? null;
}

/** El nivel de la pregunta en juego. Es lo que `UX-07` marca al cambiar de escalon. */
export function nivel<T extends Jugable>(p: Partida<T>): Dificultad | null {
  return p.orden[p.indice]?.dificultad ?? null;
}

/**
 * Si la pregunta en juego abre un escalon nuevo.
 *
 * La primera no cuenta como cambio: abrir la partida en Facil es `BR-01` punto 1, no un
 * ascenso. Avisar "ahora viene lo facil" en la pregunta 1 seria ruido.
 */
export function abreEscalon<T extends Jugable>(p: Partida<T>): boolean {
  if (p.desenlace !== 'jugando' || p.indice === 0) return false;
  const previa = p.orden[p.indice - 1];
  const hoy = p.orden[p.indice];
  return !!previa && !!hoy && previa.dificultad !== hoy.dificultad;
}

/** El texto de la opcion correcta de un item. */
function correcta<T extends Jugable>(item: T): string | null {
  return item.opciones.find((o) => o.correcta)?.texto ?? null;
}

/**
 * Responde la pregunta en juego y devuelve la partida siguiente.
 *
 * El orden de las dos condiciones del final importa y es la unica sutileza del archivo:
 * **quedarse sin vidas gana sobre haber llegado al final.** `BR-19` apartado 3, ultimo
 * punto: perder la tercera vida en la pregunta 40 es derrota, no victoria, porque la
 * condicion que puso el usuario fue "sin morir". Si se evaluara primero el fin del banco,
 * la peor partida posible terminaria festejando.
 */
export function responder<T extends Jugable>(p: Partida<T>, texto: string): Partida<T> {
  if (p.desenlace !== 'jugando') return p;
  const item = p.orden[p.indice];
  if (!item) return p;

  const acerto = texto === correcta(item);
  const vidas = acerto ? p.vidas : p.vidas - 1;
  const elegidas = [...p.elegidas, texto];

  if (vidas <= 0) return { ...p, vidas: 0, elegidas, desenlace: 'derrota' };
  if (p.indice + 1 >= p.orden.length) return { ...p, vidas, elegidas, desenlace: 'victoria' };
  return { ...p, indice: p.indice + 1, vidas, elegidas, desenlace: 'jugando' };
}

/**
 * Cierra la partida por decision del jugador. `BR-19` apartado 7.
 *
 * Disponible desde la primera pregunta, incluso sin haber respondido ninguna: el que
 * abre el quiz, mira y se va tiene derecho a una pantalla que cierre, igual que el que
 * llego a la 40. Retirarse con cero respondidas es raro pero no es un error.
 */
export function retirarse<T extends Jugable>(p: Partida<T>): Partida<T> {
  if (p.desenlace !== 'jugando') return p;
  return { ...p, desenlace: 'retirada' };
}

/** Cuantas respondio bien. */
export function aciertos<T extends Jugable>(p: Partida<T>): number {
  let n = 0;
  for (let i = 0; i < p.elegidas.length; i++) {
    const item = p.orden[i];
    if (item && p.elegidas[i] === correcta(item)) n++;
  }
  return n;
}

/**
 * El resultado, listo para la pantalla y para el link compartido.
 *
 * Devuelve `null` mientras la partida sigue: una pantalla de resultado a mitad de partida
 * no existe, y devolver un objeto a medio llenar invita a pintarla igual.
 */
export function resultado<T extends Jugable>(p: Partida<T>): Resultado | null {
  if (p.desenlace === 'jugando') return null;
  // Hasta donde llego se cuenta por respuestas dadas, **no** por `indice`.
  //
  // Un test lo encontro: `indice` significa cosas distintas segun como termino la
  // partida. Si termino respondiendo (derrota o victoria) quedo apuntando a la ultima
  // respondida, porque `responder` no lo avanza en el paso final; pero si termino en
  // **retirada**, ya habia avanzado a la pregunta que el jugador estaba mirando y no
  // llego a contestar. Con 12 respondidas y una retirada, reportaba "pregunta 13".
  //
  // `elegidas.length` no tiene esa ambiguedad en ninguno de los tres desenlaces, y es
  // ademas lo que `BR-19` apartado 6 punto 2 pide de verdad: "la ultima pregunta
  // respondida".
  const respondidas = p.elegidas.length;
  return {
    desenlace: p.desenlace,
    pregunta: respondidas,
    total: p.orden.length,
    // El mismo item que `pregunta`, para que los dos datos hablen de la misma pregunta.
    nivel: respondidas === 0 ? null : (p.orden[respondidas - 1]?.dificultad ?? null),
    aciertos: aciertos(p),
    respondidas,
    vidasRestantes: p.desenlace === 'retirada' ? p.vidas : null,
  };
}
