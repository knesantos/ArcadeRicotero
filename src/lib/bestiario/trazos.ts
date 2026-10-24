/**
 * Las herramientas de dibujo que repetía cada personaje del elenco (`D-73`): la curva que pasa por unos
 * puntos, la elipse, la caja y el grano. Las usan los cinco de la vigésima vuelta (`arte-zippo.ts`,
 * `arte-veloz.ts`, `arte-desencarnada.ts`, `arte-colgado.ts`, `arte-fumador.ts`); los de antes siguen
 * con su copia, que es la misma cuenta.
 */

export type P = readonly [number, number];

/** Un número con dos decimales, sin ceros de más: lo que va adentro de un `d`. */
export const f = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Una curva suave que pasa por todos los puntos (Catmull-Rom pasada a Bézier), cerrada o abierta. */
export function curva(pts: readonly P[], cerrada = true): string {
  const n = pts.length;
  const en = (i: number): P => (cerrada ? pts[(i + n) % n]! : pts[Math.min(n - 1, Math.max(0, i))]!);
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  for (let i = 0; i < (cerrada ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [en(i - 1), en(i), en(i + 1), en(i + 2)];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return cerrada ? `${d} Z` : d;
}

export const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;

export const caja = (x: number, y: number, w: number, h: number): string => `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;

/** Una caja de esquinas redondeadas. */
export const cajaRedonda = (x: number, y: number, w: number, h: number, r: number): string =>
  `M${f(x + r)} ${f(y)} H${f(x + w - r)} Q${f(x + w)} ${f(y)} ${f(x + w)} ${f(y + r)} V${f(y + h - r)} Q${f(x + w)} ${f(y + h)} ${f(x + w - r)} ${f(y + h)} H${f(x + r)} Q${f(x)} ${f(y + h)} ${f(x)} ${f(y + h - r)} V${f(y + r)} Q${f(x)} ${f(y)} ${f(x + r)} ${f(y)} Z`;

/** El polvo del aerógrafo encima de lo que se le pase. */
export const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;

/** Gira `p` alrededor de `c`, en grados (positivo es como las agujas, como en SVG). */
export function rot([x, y]: P, [cx, cy]: P, grados: number): P {
  const a = (grados * Math.PI) / 180;
  const [dx, dy] = [x - cx, y - cy];
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
}

/** Un polígono de rectas por los puntos. */
export const poli = (pts: readonly P[]): string => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;
