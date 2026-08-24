/**
 * Armado de la ronda. Implementa `BR-01` y el criterio 1 de `US-01`.
 *
 * `BR-01` tiene tres puntos y los tres son duros:
 *
 *  1. El primer item de toda partida es **Facil**. Nunca Media ni Dificil. Es la
 *     traduccion directa de "sin muro de entrada" (`D-09`), que `D-14` reformulo como
 *     **abrir los molinetes**: el que llega sin saber nada tiene que poder pasar.
 *  2. Dentro de la partida la dificultad **no baja**: facil -> media -> dificil.
 *  3. Tiene que haber suficientes faciles para que el primero no sea siempre el mismo.
 *     Un solo item facil no es escalonamiento, es una vidriera fija.
 *
 * El barajado es responsabilidad de esta funcion, asi que recibe la fuente de azar por
 * parametro: un test que no puede fijar la semilla no puede probar nada.
 */

import type { Dificultad } from './banco.ts';

/**
 * Lo minimo que un item necesita para poder entrar en una ronda.
 *
 * Existe porque `US-04` (adivinar la tapa) juega con la misma mecanica: dificultad
 * escalonada de `BR-01` y cuatro opciones de `BR-04`. Duplicar esta logica alla seria
 * duplicar tambien el arreglo del defecto que documenta `barajarOpciones` mas abajo — y
 * la copia se olvidaria de arreglarlo. Un juego nuevo se engancha implementando esta
 * forma, no copiando este archivo.
 */
export interface Jugable {
  readonly id: string;
  readonly dificultad: Dificultad;
  readonly opciones: readonly { readonly texto: string; readonly correcta: boolean }[];
}

/** Orden de `BR-01`. El indice es lo que hace comparable la regla 2. */
const ORDEN: Record<Dificultad, number> = { facil: 0, media: 1, dificil: 2 };

/**
 * En que proporcion se mezclan los tres niveles dentro de una ronda.
 *
 * **Son los numeros del piso de `US-01`, no una preferencia de este archivo**: `producto`
 * pide 40 preguntas con minimo 10 faciles, 15 medias y 15 dificiles, *"para que `BR-01` no
 * repita siempre el mismo"*. Una ronda es una muestra del banco, asi que se muestrea en la
 * proporcion en que el banco esta declarado. Para la ronda de 8 de `US-01` da 2 / 3 / 3.
 *
 * **Por que existe esta constante — el defecto que arregla.** Hasta el ciclo 7 la ronda se
 * llenaba tomando del pozo mas facil hasta completar el largo. Con 10 faciles en el banco y
 * una ronda de 8, eso significaba que **toda partida era ocho faciles**: simulando 300
 * rondas contra el banco real salieron 2.400 preguntas y **las 2.400 eran faciles**. Las 15
 * medias y las 15 dificiles no salian nunca, y la categoria `letras` entera —recien cerrada
 * en el ciclo 7— era inalcanzable. El banco tenia 40 preguntas y el jugador veia 10.
 *
 * Cumplia `BR-01` al pie de la letra (arranca facil, la dificultad nunca baja) y traicionaba
 * las tres razones por las que `BR-01` existe.
 */
const MEZCLA: Record<Dificultad, number> = { facil: 10, media: 15, dificil: 15 };

/**
 * Cuantos items de cada nivel entran en la ronda.
 *
 * Reparte `largo` segun `MEZCLA` por resto mayor, y despues **acomoda contra lo que el
 * banco tiene de verdad**: si un nivel no llega a su cupo, la diferencia se la reparten los
 * otros. Sin eso, un banco a medio llenar serviria rondas mas cortas que `largo`.
 *
 * El pozo de faciles siempre aporta al menos uno, porque el primero de la partida sale de
 * ahi (`BR-01` punto 1) y ese lugar no lo puede ocupar otro nivel.
 */
function repartirCupo(
  largo: number,
  disponibles: Readonly<Record<Dificultad, number>>,
): Record<Dificultad, number> {
  const niveles = ['facil', 'media', 'dificil'] as const;
  const total = MEZCLA.facil + MEZCLA.media + MEZCLA.dificil;

  const exacto: Record<Dificultad, number> = {
    facil: (largo * MEZCLA.facil) / total,
    media: (largo * MEZCLA.media) / total,
    dificil: (largo * MEZCLA.dificil) / total,
  };
  const cupo: Record<Dificultad, number> = {
    facil: Math.floor(exacto.facil),
    media: Math.floor(exacto.media),
    dificil: Math.floor(exacto.dificil),
  };

  // El primero de la partida es facil si o si: el pozo facil nunca aporta cero.
  if (cupo.facil === 0) cupo.facil = 1;

  // Los lugares que dejo el redondeo van a los niveles con el resto mas grande.
  const porResto = [...niveles].sort(
    (a, b) => ((exacto[b] % 1) - (exacto[a] % 1)) || (ORDEN[a] - ORDEN[b]),
  );
  let libres = largo - (cupo.facil + cupo.media + cupo.dificil);
  while (libres > 0) {
    for (const n of porResto) {
      if (libres <= 0) break;
      cupo[n]++;
      libres--;
    }
  }
  // Si forzar el facil se paso del largo, se lo devuelve el nivel mas holgado.
  for (let sobra = -libres; sobra > 0; sobra--) {
    const n = [...niveles].sort((a, b) => cupo[b] - cupo[a])[0]!;
    cupo[n]--;
  }

  // Nadie puede dar mas de lo que tiene. Lo que falte se reparte entre los que sí pueden.
  let deuda = 0;
  for (const n of niveles) {
    if (cupo[n] > disponibles[n]) {
      deuda += cupo[n] - disponibles[n];
      cupo[n] = disponibles[n];
    }
  }
  while (deuda > 0) {
    const pueden = niveles.filter((n) => cupo[n] < disponibles[n]);
    if (pueden.length === 0) break;
    for (const n of pueden) {
      if (deuda <= 0) break;
      cupo[n]++;
      deuda--;
    }
  }
  return cupo;
}

export class RondaImposible extends Error {}

/** Fisher-Yates con azar inyectable. */
function barajar<T>(xs: readonly T[], azar: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * Arma una ronda que cumple `BR-01`.
 *
 * @param items  el banco jugable
 * @param largo  cuantas preguntas tiene la ronda (`US-01` criterio 1: 8)
 * @param azar   fuente de aleatoriedad, inyectable para los tests
 */
export function armarRonda<T extends Jugable>(
  items: readonly T[],
  largo: number,
  azar: () => number = Math.random,
): readonly T[] {
  if (!Number.isInteger(largo) || largo <= 0) throw new RangeError('largo tiene que ser un entero positivo');
  if (items.length < largo) {
    throw new RondaImposible(`el banco tiene ${items.length} items y la ronda pide ${largo}`);
  }

  const faciles = items.filter((i) => i.dificultad === 'facil');
  if (faciles.length === 0) {
    throw new RondaImposible('BR-01 punto 1: no hay ningun item facil para abrir la partida');
  }

  // Punto 1: el primero sale del pozo de faciles, barajado -> no es siempre el mismo.
  const primero = barajar(faciles, azar)[0]!;

  // Punto 2: el resto se ordena por dificultad ascendente. Dentro de cada nivel se
  // baraja, para que dos partidas seguidas no sean identicas.
  const resto = items.filter((i) => i.id !== primero.id);
  const porNivel: Record<Dificultad, T[]> = {
    facil: barajar(resto.filter((i) => i.dificultad === 'facil'), azar),
    media: barajar(resto.filter((i) => i.dificultad === 'media'), azar),
    dificil: barajar(resto.filter((i) => i.dificultad === 'dificil'), azar),
  };

  // El primero ya gasto un lugar del pozo facil, asi que el cupo lo cuenta con el +1.
  const cupo = repartirCupo(largo, {
    facil: porNivel.facil.length + 1,
    media: porNivel.media.length,
    dificil: porNivel.dificil.length,
  });

  const ronda: T[] = [primero];
  for (const nivel of ['facil', 'media', 'dificil'] as const) {
    const cuantos = nivel === 'facil' ? cupo.facil - 1 : cupo[nivel];
    for (const it of porNivel[nivel].slice(0, Math.max(0, cuantos))) ronda.push(it);
  }
  return ronda.map((it) => barajarOpciones(it, azar));
}

/**
 * Baraja las opciones de un item.
 *
 * **Por que existe esto.** Al jugar la primera partida de verdad se descubrio que en
 * **25 de los 30 items la respuesta correcta era la primera opcion**: tocando siempre la
 * de arriba se sacaba 83% sin saber nada. No lo agarro nadie — ni `contenido`, ni el
 * schema, ni las tres revisiones — porque en el JSON cada item se lee correcto por
 * separado; el patron solo existe en el conjunto.
 *
 * Es un agujero mucho mas grave que el que discutio `BR-04`: esa regla eligio 4 opciones
 * en vez de 3 para bajar el azar de 33% a 25%, y mientras tanto el orden fijo lo tenia
 * en 83%.
 *
 * Se arregla aca y no en el contenido a proposito. Quien escribe una pregunta pone
 * naturalmente la respuesta correcta primero y despues inventa los distractores; pelear
 * contra esa costumbre en 40 items, y en los 45 que faltan de los otros juegos, es una
 * batalla perdida que ademas hay que volver a pelear cada vez que entra contenido nuevo.
 * Barajar al servir lo resuelve una vez y para siempre.
 */
export function barajarOpciones<T extends Jugable>(item: T, azar: () => number): T {
  return { ...item, opciones: barajar(item.opciones, azar) };
}

/** Verifica que una ronda cumpla `BR-01`. Se usa en los tests y en la revision. */
export function cumpleBR01(ronda: readonly Jugable[]): boolean {
  if (ronda.length === 0) return false;
  if (ronda[0]!.dificultad !== 'facil') return false;
  for (let i = 1; i < ronda.length; i++) {
    if (ORDEN[ronda[i]!.dificultad] < ORDEN[ronda[i - 1]!.dificultad]) return false;
  }
  return true;
}

/** Cuantos aciertos tiene un conjunto de respuestas. Una respuesta es el texto elegido. */
export function contarAciertos(ronda: readonly Jugable[], elegidas: readonly (string | null)[]): number {
  let n = 0;
  for (let i = 0; i < ronda.length; i++) {
    const correcta = ronda[i]!.opciones.find((o) => o.correcta);
    if (correcta && elegidas[i] === correcta.texto) n++;
  }
  return n;
}
