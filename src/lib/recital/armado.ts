/**
 * La lista de "Armá tu recital" (`D-72`): qué temas, en qué orden, y cuáles van de bis.
 *
 * **Puro**: sin DOM, sin `node:*`, sin JSON importado. Lo usan la isla del juego y sus tests,
 * y por eso no puede arrastrar nada que el navegador no tenga (`islas.test.ts`).
 *
 * ## El modelo: dos tiras, la lista y los bises
 *
 * Un recital de la banda era una lista larga y después la gente pidiendo otra, y otra: en la
 * lista entera de Concordia del 9 de diciembre de 1995 la fuente marca tres bises
 * (la pieza 2 de `CTR-19`). Acá hay dos tiras de índices en el catálogo de los 105, sin repetir: la
 * lista y los bises. **El borde entre las dos se cruza moviendo**: bajar el último de la
 * lista lo manda al primer bis, y subir el primer bis lo devuelve al final de la lista. Así
 * no hace falta un botón para cada cosa en una pantalla de 375 px.
 *
 * Todas las funciones devuelven una lista nueva y nunca tocan la que reciben, y **ante un
 * movimiento imposible devuelven la misma**, sin tirar: un toque que no hace nada es mejor
 * que una partida rota.
 *
 * ## Sin puntaje
 *
 * Como "Ponelos en fila" (`BR-22`), acá no hay una lista correcta, así que no hay número
 * que ganar ni comparación contra ninguna lista que el jugador no haya armado. El único
 * número que se muestra es cuánto dura, y sale de los discos (`RES-20`), no de un juicio.
 */

import { MAX_TEMAS_RECITAL, MAX_BISES_RECITAL } from '../desafio.ts';

export { MAX_TEMAS_RECITAL, MAX_BISES_RECITAL };

/** Con menos que esto no hay recital: es una previa. */
export const MIN_TEMAS_RECITAL = 5;

/** Un tema del catálogo tal como llega a la isla. */
export interface TemaDelCatalogo {
  readonly slug: string;
  readonly titulo: string;
  readonly disco: string;
  readonly pista: number;
  /** Lo que dura en el disco, o `null` si `RES-20` no lo midió. No es un cero. */
  readonly segundos: number | null;
}

/** La lista armada: índices en el catálogo. */
export interface Armado {
  readonly lista: readonly number[];
  readonly bises: readonly number[];
}

export type Tira = 'lista' | 'bises';

export const VACIO: Armado = { lista: [], bises: [] };

/** En qué tira está un tema, o `null` si no está. */
export function tiraDe(a: Armado, i: number): Tira | null {
  if (a.lista.includes(i)) return 'lista';
  if (a.bises.includes(i)) return 'bises';
  return null;
}

export function cuantos(a: Armado): number {
  return a.lista.length + a.bises.length;
}

/** ¿Entra un tema más en algún lado? */
export function hayLugar(a: Armado): boolean {
  return a.lista.length < MAX_TEMAS_RECITAL || a.bises.length < MAX_BISES_RECITAL;
}

/**
 * Suma un tema al final de la lista. Si la lista está llena, va a los bises; si las dos
 * están llenas, o el tema ya está, no pasa nada.
 */
export function agregar(a: Armado, i: number): Armado {
  if (tiraDe(a, i) !== null) return a;
  if (a.lista.length < MAX_TEMAS_RECITAL) return { lista: [...a.lista, i], bises: a.bises };
  if (a.bises.length < MAX_BISES_RECITAL) return { lista: a.lista, bises: [...a.bises, i] };
  return a;
}

export function sacar(a: Armado, i: number): Armado {
  if (tiraDe(a, i) === null) return a;
  return { lista: a.lista.filter((x) => x !== i), bises: a.bises.filter((x) => x !== i) };
}

/** Lo sube un lugar. El primer bis sube al final de la lista, si en la lista hay lugar. */
export function subir(a: Armado, i: number): Armado {
  const enLista = a.lista.indexOf(i);
  if (enLista > 0) return { lista: intercambiar(a.lista, enLista, enLista - 1), bises: a.bises };
  const enBises = a.bises.indexOf(i);
  if (enBises > 0) return { lista: a.lista, bises: intercambiar(a.bises, enBises, enBises - 1) };
  if (enBises === 0 && a.lista.length < MAX_TEMAS_RECITAL) {
    return { lista: [...a.lista, i], bises: a.bises.slice(1) };
  }
  return a;
}

/** Lo baja un lugar. El último de la lista baja al primer bis, si en los bises hay lugar. */
export function bajar(a: Armado, i: number): Armado {
  const enLista = a.lista.indexOf(i);
  if (enLista !== -1 && enLista < a.lista.length - 1) {
    return { lista: intercambiar(a.lista, enLista, enLista + 1), bises: a.bises };
  }
  // El último de la lista no se va a los bises si es el único: sin lista no hay recital.
  if (enLista === a.lista.length - 1 && a.lista.length > 1 && a.bises.length < MAX_BISES_RECITAL) {
    return { lista: a.lista.slice(0, -1), bises: [i, ...a.bises] };
  }
  const enBises = a.bises.indexOf(i);
  if (enBises !== -1 && enBises < a.bises.length - 1) {
    return { lista: a.lista, bises: intercambiar(a.bises, enBises, enBises + 1) };
  }
  return a;
}

/** Lo manda de una tira a la otra: de la lista al último bis, o de los bises al final de la lista. */
export function cambiarDeTira(a: Armado, i: number): Armado {
  const tira = tiraDe(a, i);
  if (tira === 'lista' && a.bises.length < MAX_BISES_RECITAL && a.lista.length > 1) {
    return { lista: a.lista.filter((x) => x !== i), bises: [...a.bises, i] };
  }
  if (tira === 'bises' && a.lista.length < MAX_TEMAS_RECITAL) {
    return { lista: [...a.lista, i], bises: a.bises.filter((x) => x !== i) };
  }
  return a;
}

/**
 * ¿Es una lista que el juego pudo haber armado? Sin repetidos y dentro de los techos. La usa
 * la isla para validar la lista guardada en el navegador **sin rearmarla**: pasarla por las
 * operaciones la cambiaba (`REV-23`, `FIND-157`).
 */
export function esPosible(a: Armado): boolean {
  const todos = [...a.lista, ...a.bises];
  return (
    new Set(todos).size === todos.length &&
    a.lista.length <= MAX_TEMAS_RECITAL &&
    a.bises.length <= MAX_BISES_RECITAL
  );
}

/** ¿Se puede cerrar la lista y salir a tocar? */
export function sePuedeCerrar(a: Armado): boolean {
  return a.lista.length >= MIN_TEMAS_RECITAL;
}

/**
 * Elige un tema al azar entre los que todavía no están. `azar` devuelve un número en
 * [0, 1), como `Math.random`; los tests le pasan uno fijo. `null` si no queda ninguno o no
 * hay lugar.
 */
export function sortear(a: Armado, candidatos: readonly number[], azar: () => number = Math.random): number | null {
  if (!hayLugar(a)) return null;
  const libres = candidatos.filter((i) => tiraDe(a, i) === null);
  if (libres.length === 0) return null;
  return libres[Math.min(libres.length - 1, Math.floor(azar() * libres.length))]!;
}

/** El orden en que suena: la lista y después los bises. */
export function enOrden(a: Armado): readonly number[] {
  return [...a.lista, ...a.bises];
}

/**
 * Cuánto dura, sumando lo que dura cada tema en su disco. `sinMedir` cuenta los que
 * `RES-20` no midió: se dicen, no se esconden ni se cuentan como cero.
 */
export function duracion(a: Armado, catalogo: readonly TemaDelCatalogo[]): { readonly segundos: number; readonly sinMedir: number } {
  let segundos = 0;
  let sinMedir = 0;
  for (const i of enOrden(a)) {
    const s = catalogo[i]?.segundos;
    if (typeof s === 'number') segundos += s;
    else sinMedir++;
  }
  return { segundos, sinMedir };
}

/** "1 h 24 min", "48 min". Se redondea al minuto: nadie mira un recital en segundos. */
export function formatoDuracion(segundos: number): string {
  const minutos = Math.round(segundos / 60);
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

function intercambiar(t: readonly number[], x: number, y: number): number[] {
  const copia = [...t];
  [copia[x], copia[y]] = [copia[y]!, copia[x]!];
  return copia;
}
