/**
 * Las bestias que hablan solas (`D-78`, segunda vuelta).
 *
 * Pedido del usuario: que *"a veces sí y a veces no, las bestias hablen por sí solas con la frase
 * que tienen asignada"*, y que sea *"mucho menor el porcentaje"*: **una de cada cinco** que
 * aparecen en pantalla. En el teléfono no hay mouse que pase por encima, así que es la única
 * manera de leer un verso sin tocar, y tocar ahora abre la ficha.
 *
 * ## Las reglas
 *
 * - **Se sortea al aparecer**, una vez por aparición: la bestia que entra en la pantalla tira una
 *   vez. Si sale y vuelve a entrar, vuelve a tirar.
 * - **Una a la vez, y con aire entre una y otra** (`RESPIRO_MS`): si tres ganan juntas, hablan de
 *   a una. La que salió de la pantalla mientras esperaba ya no habla.
 * - **Nunca encima de otra cosa**: con la ficha abierta, el mouse arriba de un bicho o un
 *   bocadillo ya en pantalla, espera.
 *
 * Lógica pura: el azar y el reloj se le pasan, para que el test los fije.
 */

/** Qué parte de las bestias que aparecen dice su verso sola. */
export const PROBABILIDAD = 0.2;

/** Lo mínimo entre dos que hablan solas, en milisegundos. */
export const RESPIRO_MS = 9000;

export class Charla {
  /** Las que están en pantalla y ya tiraron en esta aparición. */
  private readonly vistas = new Set<string>();
  /** Las que ganaron y esperan su turno, en el orden en que aparecieron. */
  private cola: string[] = [];
  private ultima = -Infinity;
  private readonly azar: () => number;
  private readonly probabilidad: number;

  constructor(azar: () => number = Math.random, probabilidad = PROBABILIDAD) {
    this.azar = azar;
    this.probabilidad = probabilidad;
  }

  /**
   * Se llama cada tanto con las que se ven. Devuelve la que tiene que hablar ahora, o `null`.
   * `ocupado`: hay ficha abierta, mouse encima o bocadillo en pantalla.
   */
  mirar(visibles: Iterable<string>, ahora: number, ocupado: boolean): string | null {
    const ahoraVisibles = new Set(visibles);
    for (const id of [...this.vistas]) if (!ahoraVisibles.has(id)) this.vistas.delete(id);
    this.cola = this.cola.filter((id) => ahoraVisibles.has(id));
    for (const id of ahoraVisibles) {
      if (this.vistas.has(id)) continue;
      this.vistas.add(id);
      if (this.azar() < this.probabilidad) this.cola.push(id);
    }
    if (ocupado || !this.cola.length || ahora - this.ultima < RESPIRO_MS) return null;
    this.ultima = ahora;
    return this.cola.shift()!;
  }
}
