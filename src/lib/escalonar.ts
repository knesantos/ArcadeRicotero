/**
 * Reparte una ronda **escalonada**: el primero sale del pozo más fácil que exista, y de
 * ahí la dificultad no baja. `BR-01` puntos 1 y 2.
 *
 * ## Por qué existe, y por qué no es `armarRonda`
 *
 * `src/lib/quiz/ronda.ts` ya escalona, pero pide más de lo que dos de los seis juegos
 * pueden dar: sus ítems necesitan `id` y `opciones` —las baraja para tapar el defecto de
 * la correcta siempre primera— y **tira `RondaImposible` si no hay un solo `facil`**.
 *
 * Los juegos de pozo abierto no tienen ninguna de las dos cosas. "Adiviná el tema" y
 * "Sacalo por la letra" se responden con un buscador sobre los 105 títulos, así que no hay
 * opciones que barajar; y su dificultad se **deriva** de las escuchas (`D-27`), que hoy no
 * están medidas: sin la clave de YouTube los niveles caen todos en `dificil` y `armarRonda`
 * les cerraría la puerta en la cara al arrancar.
 *
 * Por eso esta función **degrada en vez de tirar**. Sin ningún `facil` reparte lo que hay,
 * que con un solo nivel es un barajado — el mismo resultado que el barajado accidental que
 * `FIND-29` encontró, pero declarado, y con el mecanismo listo para funcionar solo el día
 * que las mediciones existan.
 *
 * ## De dónde salió
 *
 * De `partida-por-la-letra.ts`, donde nació al cerrar `FIND-29` en el ciclo 9. Se extrajo
 * acá en el ciclo 10 (`T-163`) cuando `US-02` necesitó lo mismo: una tercera copia de la
 * regla de `BR-01` es lo que el motivo 3 de `CTR-03.8` llama el modo de falla — la copia
 * que nadie se acuerda de tocar queda mintiendo.
 *
 * **`ronda.ts` no se toca**: lo comparten el quiz, las tapas y las letras, y su reparto por
 * cupo proporcional es otra cosa, no una versión más de esta.
 */

/** Lo mínimo que un ítem tiene que declarar para poder escalonarse. */
export interface Escalonable {
  readonly dificultad: string;
}

/**
 * El orden de `BR-01`. Un ítem sin etiquetar se trata como el más duro, para que un hueco
 * de datos nunca abra una partida.
 */
export const ORDEN_DIFICULTAD: Record<string, number> = {
  facil: 0,
  media: 1,
  dificil: 2,
  'sin-clasificar': 3,
};

/** Fisher-Yates. El azar se inyecta para que los tests no dependan de la suerte. */
export function barajar<T>(xs: readonly T[], azar: () => number = Math.random): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * Lo que se le puede pedir a `escalonar()` además del largo. Todo es opcional: sin nada,
 * la función hace lo mismo que hizo siempre, y `US-07` no se entera.
 */
export interface OpcionesEscalonar {
  /**
   * Cuántos ítems, como mucho, salen del nivel más bajo que haya en el pozo. El resto de la
   * ronda se sortea **parejo entre todos los niveles de arriba** y se ordena por nivel.
   *
   * Existe por `CTR-19.14` punto 3 (`FIND` de la verificación de `T-279`): llenar la ronda
   * desde abajo hasta completar el largo convierte un pozo con 8 Fáciles y una vuelta de 4
   * en una vidriera fija de 8 temas —los otros 87 no suenan nunca—, que es justo lo que
   * `BR-01` punto 3 prohíbe. Con cupo, el primero sigue siendo del nivel más bajo (punto 1)
   * y el orden sigue sin bajar (punto 2), pero todo el pozo puede sonar.
   *
   * Si arriba no alcanza para completar el largo, se completa con lo que sobró del nivel
   * más bajo: quedarse corto por respetar el cupo sería romper la partida por un número.
   * Un cupo de 0 se lee como 1: el punto 1 de `BR-01` no se negocia.
   */
  readonly cupoPrimerNivel?: number;
}

const nivelDe = (it: Escalonable): string =>
  it.dificultad in ORDEN_DIFICULTAD ? it.dificultad : 'sin-clasificar';

function escalonarConCupo<T extends Escalonable>(
  items: readonly T[],
  largo: number,
  cupo: number,
  azar: () => number,
): T[] {
  if (items.length === 0 || largo <= 0) return [];
  const piso = Math.min(...items.map((it) => ORDEN_DIFICULTAD[nivelDe(it)]!));
  const deAbajo = barajar(items.filter((it) => ORDEN_DIFICULTAD[nivelDe(it)] === piso), azar);
  const deArriba = barajar(items.filter((it) => ORDEN_DIFICULTAD[nivelDe(it)] !== piso), azar);

  const tope = Math.max(1, Math.min(cupo, largo));
  const elegidos = deAbajo.slice(0, tope);
  elegidos.push(...deArriba.slice(0, largo - elegidos.length));
  elegidos.push(...deAbajo.slice(tope, tope + (largo - elegidos.length)));

  // `sort` es estable: adentro de un nivel queda el orden del barajado.
  return elegidos.sort(
    (a, b) => ORDEN_DIFICULTAD[nivelDe(a)]! - ORDEN_DIFICULTAD[nivelDe(b)]!,
  );
}

/**
 * Devuelve hasta `largo` ítems, del más fácil al más difícil, barajados dentro de cada
 * nivel para que dos partidas seguidas no sean iguales.
 *
 * Un nivel desconocido cae al fondo, con los `sin-clasificar`. Si `items` trae menos de
 * `largo`, devuelve los que hay: quedarse corto de pozo es un estado que la pantalla sabe
 * manejar, y tirar acá sería romper la partida por un archivo a medio llenar.
 */
export function escalonar<T extends Escalonable>(
  items: readonly T[],
  largo: number,
  azar: () => number = Math.random,
  opciones: OpcionesEscalonar = {},
): T[] {
  if (opciones.cupoPrimerNivel !== undefined) {
    return escalonarConCupo(items, largo, opciones.cupoPrimerNivel, azar);
  }

  const porNivel = new Map<string, T[]>();
  for (const it of items) {
    const nivel = it.dificultad in ORDEN_DIFICULTAD ? it.dificultad : 'sin-clasificar';
    if (!porNivel.has(nivel)) porNivel.set(nivel, []);
    porNivel.get(nivel)!.push(it);
  }

  const niveles = [...porNivel.keys()].sort(
    (a, b) => ORDEN_DIFICULTAD[a]! - ORDEN_DIFICULTAD[b]!,
  );

  const salida: T[] = [];
  for (const nivel of niveles) {
    for (const it of barajar(porNivel.get(nivel)!, azar)) {
      if (salida.length >= largo) return salida;
      salida.push(it);
    }
  }
  return salida;
}

/**
 * ¿Esta ronda escalona de verdad, o es un barajado con otro nombre?
 *
 * Existe para que un test pueda afirmar la diferencia sin adivinarla: devuelve `false`
 * cuando todos los ítems comparten nivel, que es el estado de hoy en los dos juegos que
 * dependen de las escuchas.
 */
export function hayEscalones(items: readonly Escalonable[]): boolean {
  return new Set(items.map((i) => i.dificultad)).size > 1;
}
