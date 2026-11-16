/**
 * El escorzo (`D-91`, tanda 3): lo que cruza el piso y se va al horizonte.
 *
 * La lección de la tanda 1 fue que un punto de fuga hace más por la profundidad que cualquier niebla.
 * Acá está lo que se repetía cada vez que se armaba uno (el sendero del monte, el damero del salón):
 * una fila de pasos que arranca ancha y cerca, y se apila contra el horizonte cada vez más angosta. Es
 * geometría, no dibujo: cada región le pone su tinta y su cosa (vías, postes, una huella en la tierra).
 */

/** Un paso del escorzo: dónde está, lo ancho que es ahí, y lo lejos que quedó (0, acá; 1, el horizonte). */
export type Paso = readonly [x: number, y: number, ancho: number, hondo: number];

/**
 * Los pasos de algo derecho visto en perspectiva, de `desde` (cerca) a `hasta` (lejos). `onda` lo
 * tuerce de costado, y la torcedura se achica con la distancia como todo lo demás.
 */
export function fuga(desde: readonly [number, number], hasta: readonly [number, number], cerca: number, lejos: number, n = 24, onda = 0, fase = 0.4): Paso[] {
  const ps: Paso[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const hondo = 1 - (1 - u) ** 2.2;
    const achica = 1 - hondo * 0.9;
    ps.push([
      desde[0] + (hasta[0] - desde[0]) * hondo + Math.sin(u * Math.PI * 2.2 + fase) * onda * achica,
      desde[1] + (hasta[1] - desde[1]) * hondo,
      lejos + (cerca - lejos) * (1 - hondo) ** 1.6,
      hondo,
    ]);
  }
  return ps;
}

/** El punto de un escorzo a una hondura dada (de 0 a 1), sin torcedura: para clavar cosas a lo largo. */
export function enLaFuga(desde: readonly [number, number], hasta: readonly [number, number], hondo: number): readonly [number, number] {
  return [desde[0] + (hasta[0] - desde[0]) * hondo, desde[1] + (hasta[1] - desde[1]) * hondo];
}

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/**
 * La cinta que arman los pasos: un contorno cerrado. `k` la angosta (0,5: la mitad de ancha) y `corre`
 * la desplaza de costado, en anchos (−0,5: sobre el canto izquierdo). Con las dos se sacan rieles y surcos.
 */
export function cinta(ps: readonly Paso[], k = 1, corre = 0): string {
  const ida = ps.map(([x, y, w], i) => `${i ? 'L' : 'M'}${f(x + (corre - k / 2) * w)} ${f(y)}`).join(' ');
  const vuelta = [...ps].reverse().map(([x, y, w]) => `L${f(x + (corre + k / 2) * w)} ${f(y)}`).join(' ');
  return `${ida} ${vuelta} Z`;
}

/** La línea que corre a lo largo de los pasos, corrida `corre` anchos de costado: un riel, el filo de un surco. */
export function linea(ps: readonly Paso[], corre = 0): string {
  return ps.map(([x, y, w], i) => `${i ? 'L' : 'M'}${f(x + corre * w)} ${f(y)}`).join(' ');
}
