/**
 * Lo que necesita cualquier títere de papel para moverse (`D-73`): encontrar sus piezas, girarlas
 * sobre su pivote y bajarle los párpados. Lo usan la isla del bestiario y la del camino con
 * cruces; vive aparte para que las dos muevan a los títeres igual.
 */

export type Parte = SVGGraphicsElement;

/** Las piezas de un títere, por nombre (`data-parte`). */
export function partes(titere: SVGGElement): Map<string, Parte> {
  const m = new Map<string, Parte>();
  for (const el of titere.querySelectorAll<Parte>('[data-parte]')) m.set(el.dataset.parte!, el);
  return m;
}

export const girar = (el: Parte | undefined, ang: number, [px, py]: readonly [number, number], mas = ''): void =>
  el?.setAttribute('transform', `${mas}rotate(${ang.toFixed(2)} ${px} ${py})`);

/** Un párpado: baja desde su pivote. `k` va de 0 (abierto) a 1 (cerrado). */
export function parpado(el: Parte | undefined, k: number): void {
  if (!el) return;
  const [px, py] = (el.dataset.pivote ?? '0 0').split(' ').map(Number) as [number, number];
  el.setAttribute('transform', `translate(${px} ${py}) scale(1 ${k.toFixed(2)}) translate(${-px} ${-py})`);
}

export const hacia = (actual: number, meta: number, paso: number): number =>
  Math.abs(meta - actual) <= paso ? meta : actual + Math.sign(meta - actual) * paso;
export const suave = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
