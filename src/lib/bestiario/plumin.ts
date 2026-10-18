/**
 * El plumín de *Un baión para el ojo idiota* (`D-73`): con lo que se dibuja a la vaca cubana.
 *
 * El frente de *Un baión* no es aerógrafo ni pincel seco: es **plumín sobre aguada**. Rocambole
 * lava el color (el naranja, el rojo y el amarillo de la tele, el lila de la luz) y encima pasa
 * tinta china: un raspado de rayas paralelas, apretadas, que siguen la cara de cada cosa, un
 * contorno nervioso que se repasa y se pasa de largo en las esquinas, y la luz que larga la tele,
 * que son garabatos en zigzag que se abren desde el centro. La vaca es de ese disco y no está en
 * ninguna tapa: se inventa en esa estética (`T-440`).
 *
 * - `plumin`: una línea de tinta de ancho variable. Entra fina, carga en el medio, tiembla, y a
 *   veces la mano la repasa corrida.
 * - `rayado`: el raspado de la tele. Rayas paralelas en un ángulo, recortadas por una forma.
 * - `aguada`: el color lavado de abajo, con el borde blando donde el agua junta pigmento.
 * - `zigzag` y `rayos`: el garabato de la luz, ida y vuelta, que se abre desde un punto.
 * - `rulos`: el humo, un resorte de tinta que sube.
 *
 * Como el aerógrafo y el pincel seco, esto no lo pinta el navegador: lo imprime
 * `scripts/imprimir-bestiario.mjs`, una vez.
 */

import { azar, muestrear, ruido1, type P } from './pincel.ts';

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

export interface Pluma {
  /** El ancho de la línea donde más carga. */
  ancho: number;
  /** Cuánto tiembla de costado, en unidades. */
  nervio?: number;
  /** La tinta (un token). */
  tinta?: string;
  /** Cuánto se afina al entrar y al salir: 0 es punta, 1 es parejo. */
  punta?: number;
  /** La chance de que la mano la repase, un poco corrida y más fina. */
  repaso?: number;
}

/** Una línea de plumín: un polígono de ancho variable que sigue el recorrido. */
function linea(pts: readonly P[], ancho: number, nervio: number, punta: number, rnd: () => number): string {
  const n = pts.length;
  if (n < 2) return '';
  const largo = (n - 1) * 2;
  const presion = ruido1(rnd, largo, 26);
  const temblor = ruido1(rnd, largo, 7);
  const izq: string[] = [];
  const der: string[] = [];
  for (let k = 0; k < n; k++) {
    const s = k * 2;
    const t = k / (n - 1);
    const [x, y] = pts[k]!;
    const [xa, ya] = pts[Math.max(0, k - 1)]!;
    const [xb, yb] = pts[Math.min(n - 1, k + 1)]!;
    const tx = xb - xa;
    const ty = yb - ya;
    const m = Math.hypot(tx, ty) || 1;
    const nx = -ty / m;
    const ny = tx / m;
    const afina = punta + (1 - punta) * Math.min(1, t / 0.14, (1 - t) / 0.14);
    const w = (ancho * (0.55 + 0.75 * presion(s)) * afina) / 2;
    const j = (temblor(s) - 0.5) * nervio;
    izq.push(`${f(x + nx * (j + w))} ${f(y + ny * (j + w))}`);
    der.push(`${f(x + nx * (j - w))} ${f(y + ny * (j - w))}`);
  }
  return `M${izq.join('L')}L${der.reverse().join('L')}Z`;
}

/** Una línea de plumín. El recorrido es una cúbica (cuatro puntos) o una polilínea. */
export function plumin(recorrido: readonly P[], pluma: Pluma, semilla: number): string {
  const rnd = azar(semilla);
  const { ancho, nervio = 1.2, tinta = 'var(--fondo)', punta = 0.25, repaso = 0 } = pluma;
  const pts = muestrear(recorrido, 2);
  let d = linea(pts, ancho, nervio, punta, rnd);
  if (rnd() < repaso && pts.length > 8) {
    // La mano vuelve: un tramo del medio, corrido de costado, más fino.
    const desde = Math.floor(pts.length * rnd() * 0.4);
    const hasta = Math.ceil(pts.length * (0.6 + rnd() * 0.4));
    const corre = (rnd() < 0.5 ? -1 : 1) * ancho * (0.7 + rnd() * 0.8);
    const tramo = pts.slice(desde, hasta).map(([x, y], k, a): P => {
      const [xa, ya] = a[Math.max(0, k - 1)]!;
      const [xb, yb] = a[Math.min(a.length - 1, k + 1)]!;
      const m = Math.hypot(xb - xa, yb - ya) || 1;
      return [x - ((yb - ya) / m) * corre, y + ((xb - xa) / m) * corre];
    });
    d += linea(tramo, ancho * 0.55, nervio, 0.15, rnd);
  }
  return `<path d="${d}" fill="${tinta}"/>`;
}

/** Varias líneas con la misma pluma. */
export const plumines = (recorridos: ReadonlyArray<readonly P[]>, pluma: Pluma, semilla: number): string =>
  recorridos.map((r, i) => plumin(r, pluma, semilla * 37 + i * 11)).join('');

/** Una raya suelta del raspado: una polilínea temblorosa, con un trazo de ancho fijo. */
function raya(a: P, b: P, comba: number, nervio: number, rnd: () => number): string {
  const largo = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const pasos = Math.max(2, Math.round(largo / 9));
  const ux = (b[0] - a[0]) / largo;
  const uy = (b[1] - a[1]) / largo;
  const tiembla = ruido1(rnd, largo, 10);
  const puntos: string[] = [];
  for (let k = 0; k <= pasos; k++) {
    const t = k / pasos;
    const o = comba * 4 * t * (1 - t) + (tiembla(t * largo) - 0.5) * nervio;
    puntos.push(`${f(a[0] + (b[0] - a[0]) * t - uy * o)} ${f(a[1] + (b[1] - a[1]) * t + ux * o)}`);
  }
  return `M${puntos.join('L')}`;
}

export interface Rayado {
  /** El ángulo de las rayas, en grados. */
  angulo: number;
  /** La distancia entre rayas. */
  paso: number;
  /** El ancho de cada raya. */
  ancho: number;
  tinta?: string;
  /** Cuánto se comban, como fracción del largo. */
  comba?: number;
  /** Cuánto tiemblan de costado. */
  nervio?: number;
  /** La chance de que una raya se corte antes de cruzar la forma: el raspado no es parejo. */
  corta?: number;
  /** La opacidad del grupo. */
  o?: number;
  /** Si todas las rayas se comban para el mismo lado, que es como se redondea una forma. */
  pareja?: boolean;
  /** Cuánto puede tardar en entrar cada raya desde el borde de la zona: deshilacha ese borde. */
  entra?: number;
  /** Dónde empieza la zona, medido a lo largo de las rayas desde el centro de la caja (para `entra`). */
  desde?: number;
}

/**
 * El raspado de la tele: rayas paralelas que cruzan la caja en un ángulo, recortadas por la
 * forma `d`. Cada raya entra y sale un poco al azar, así el borde no queda como regla.
 */
export function rayado(id: string, d: string, caja: readonly [number, number, number, number], r: Rayado, semilla: number): string {
  const rnd = azar(semilla);
  const [x, y, ancho, alto] = caja;
  const cx = x + ancho / 2;
  const cy = y + alto / 2;
  const a = (r.angulo * Math.PI) / 180;
  const [ux, uy] = [Math.cos(a), Math.sin(a)];
  const [nx, ny] = [-uy, ux];
  const radio = Math.hypot(ancho, alto) / 2 + 4;
  const { comba = 0.04, nervio = 0.9, corta = 0.18, tinta = 'var(--fondo)', o = 1 } = r;
  const porAncho = new Map<string, string>();
  for (let s = -radio; s <= radio; s += r.paso * (0.8 + rnd() * 0.4)) {
    const bx = cx + nx * s;
    const by = cy + ny * s;
    // Dónde arranca y dónde termina: casi siempre de borde a borde, a veces se corta.
    const t0 = r.entra ? (r.desde ?? -radio) + rnd() * r.entra : -radio + (rnd() < corta ? rnd() * radio : 0);
    const t1 = radio - (rnd() < corta ? rnd() * radio : 0);
    if (t1 - t0 < 6) continue;
    const w = f(r.ancho * (0.7 + rnd() * 0.6));
    const curva = r.pareja ? comba * (t1 - t0) * (0.8 + rnd() * 0.4) : comba * (t1 - t0) * (rnd() - 0.5);
    const tramo = raya([bx + ux * t0, by + uy * t0], [bx + ux * t1, by + uy * t1], curva, nervio, rnd);
    porAncho.set(w, (porAncho.get(w) ?? '') + tramo);
  }
  let rayas = '';
  for (const [w, camino] of porAncho) rayas += `<path d="${camino}" stroke-width="${w}"/>`;
  return (
    `<clipPath id="${id}"><path d="${d}"/></clipPath>` +
    `<g clip-path="url(#${id})" fill="none" stroke="${tinta}" stroke-linecap="round"${o < 1 ? ` opacity="${f(o)}"` : ''}>${rayas}</g>`
  );
}

/**
 * Una aguada: la forma lavada de un color, con el borde blando, y el pigmento que el agua junta
 * en la orilla, un poco más oscuro. Va siempre adentro de la silueta de una pieza.
 */
export function aguada(d: string, color: string, { orilla, o = 1, blando = 's' }: { orilla?: string; o?: number; blando?: 'xs' | 's' | 'm' | 'l' } = {}): string {
  const op = o < 1 ? ` opacity="${f(o)}"` : '';
  return (
    `<path d="${d}" fill="${color}" filter="url(#soplo-${blando})"${op}/>` +
    (orilla ? `<path d="${d}" fill="none" stroke="${orilla}" stroke-width="3" filter="url(#soplo-xs)"${o < 1 ? ` opacity="${f(o * 0.6)}"` : ' opacity="0.6"'}/>` : '')
  );
}

/** El garabato de la luz: ida y vuelta de un punto a otro, cada vez más abierto. */
export function zigzag(desde: P, hasta: P, amplitud: number, paso: number, pluma: Pluma, semilla: number): string {
  const rnd = azar(semilla);
  const largo = Math.hypot(hasta[0] - desde[0], hasta[1] - desde[1]);
  const ux = (hasta[0] - desde[0]) / largo;
  const uy = (hasta[1] - desde[1]) / largo;
  const pts: P[] = [desde];
  let lado = 1;
  for (let s = paso; s < largo; s += paso * (0.7 + rnd() * 0.6)) {
    const abre = amplitud * (0.35 + 0.65 * (s / largo)) * (0.7 + rnd() * 0.6);
    pts.push([desde[0] + ux * s - uy * abre * lado, desde[1] + uy * s + ux * abre * lado]);
    lado = -lado;
  }
  pts.push(hasta);
  return plumin(pts, { punta: 0.4, ...pluma }, semilla);
}

/**
 * La luz de la tele: rayos que salen de un centro, cada uno un zigzag (o una raya, si
 * `amplitud` es cero). `r0` y `r1` son dónde arranca y dónde termina cada rayo.
 */
export function rayos(
  [cx, cy]: P,
  r0: number,
  r1: number,
  cuantos: number,
  { amplitud = 0, paso = 7, achate = 1, ...pluma }: Pluma & { amplitud?: number; paso?: number; achate?: number },
  semilla: number,
): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < cuantos; i++) {
    const a = ((i + rnd() * 0.7) / cuantos) * Math.PI * 2;
    const ra = r0 * (0.75 + rnd() * 0.5);
    const rb = r1 * (0.55 + rnd() * 0.55);
    const de: P = [cx + Math.cos(a) * ra, cy + Math.sin(a) * ra * achate];
    const a2 = a + (rnd() - 0.5) * 0.12;
    const al: P = [cx + Math.cos(a2) * rb, cy + Math.sin(a2) * rb * achate];
    s += amplitud > 0 ? zigzag(de, al, amplitud, paso, pluma, semilla * 7 + i) : plumin([de, al], pluma, semilla * 7 + i);
  }
  return s;
}

/** El humo: un resorte de tinta que sigue un recorrido y se abre al subir. */
export function rulos(recorrido: readonly P[], radio: number, vueltas: number, pluma: Pluma, semilla: number): string {
  const base = muestrear(recorrido, 1.5);
  const n = base.length;
  const pts: P[] = base.map(([x, y], k) => {
    const t = k / Math.max(1, n - 1);
    const th = t * vueltas * Math.PI * 2;
    const r = radio * (0.35 + 0.65 * t);
    return [x + Math.cos(th) * r, y + Math.sin(th) * r * 0.55];
  });
  return plumin(pts, { punta: 0.2, ...pluma }, semilla);
}

/* ------------------------------------------------------------------
   Los caminos: siluetas hechas de tramos, para dibujar el contorno tramo por tramo
   ------------------------------------------------------------------ */

/** Un tramo de una silueta: una cúbica de cuatro puntos. */
export type Tramo = readonly [P, P, P, P];

/**
 * Una silueta escrita como se escribe un `d`, pero con números: un punto de partida y después
 * curvas (`[c1, c2, p]`) o rectas (`[p]`). Devuelve los tramos, para el `d` y para el contorno.
 */
export function silueta(desde: P, pasos: ReadonlyArray<readonly [P] | readonly [P, P, P]>): Tramo[] {
  const tramos: Tramo[] = [];
  let a = desde;
  for (const paso of pasos) {
    if (paso.length === 1) {
      const [b] = paso;
      tramos.push([a, [a[0] + (b[0] - a[0]) / 3, a[1] + (b[1] - a[1]) / 3], [a[0] + ((b[0] - a[0]) * 2) / 3, a[1] + ((b[1] - a[1]) * 2) / 3], b]);
      a = b;
    } else {
      const [c1, c2, b] = paso;
      tramos.push([a, c1, c2, b]);
      a = b;
    }
  }
  return tramos;
}

/** El `d` cerrado de una silueta. */
export const camino = (tramos: readonly Tramo[]): string =>
  `M${f(tramos[0]![0][0])} ${f(tramos[0]![0][1])}` +
  tramos.map(([, c1, c2, b]) => `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(b[0])} ${f(b[1])}`).join('') +
  'Z';

/**
 * El contorno de una silueta a plumín, tramo por tramo: cada tramo con su peso (0 lo saltea, que
 * es donde le da la luz y la línea se pierde), un poco pasado de largo en las esquinas, como lo
 * dibuja una mano rápida.
 */
export function contorno(tramos: readonly Tramo[], pesos: (i: number, t: Tramo) => number, pluma: Pluma, semilla: number): string {
  const rnd = azar(semilla);
  let s = '';
  tramos.forEach((t, i) => {
    const peso = pesos(i, t);
    if (peso <= 0) return;
    const [a, c1, c2, b] = t;
    // Se pasa de largo: el principio arranca un poco antes y el final termina un poco después.
    const pasa = (p: P, q: P, k: number): P => [p[0] + (p[0] - q[0]) * k, p[1] + (p[1] - q[1]) * k];
    const k0 = rnd() < 0.3 ? 0.12 + rnd() * 0.1 : 0;
    const k1 = rnd() < 0.3 ? 0.12 + rnd() * 0.1 : 0;
    s += plumin([pasa(a, c1, k0), c1, c2, pasa(b, c2, k1)], { ...pluma, ancho: pluma.ancho * peso }, semilla * 53 + i);
  });
  return s;
}

/**
 * El garabato del fondo de la tapa: renglones de ida y vuelta, apretados, que llenan una forma.
 * Es como Rocambole oscurece en *Un baión* lo que no es una cara de la tele.
 */
export function garabato(id: string, d: string, caja: readonly [number, number, number, number], g: Rayado & { amplitud?: number }, semilla: number): string {
  const rnd = azar(semilla);
  const [x, y, ancho, alto] = caja;
  const cx = x + ancho / 2;
  const cy = y + alto / 2;
  const a = (g.angulo * Math.PI) / 180;
  const [ux, uy] = [Math.cos(a), Math.sin(a)];
  const [nx, ny] = [-uy, ux];
  const radio = Math.hypot(ancho, alto) / 2 + 4;
  const amplitud = g.amplitud ?? g.paso * 0.75;
  const { tinta = 'var(--fondo)', o = 1 } = g;
  let caminos = '';
  for (let s = -radio; s <= radio; s += g.paso * (0.85 + rnd() * 0.3)) {
    const pts: string[] = [];
    let lado = 1;
    for (let t = -radio; t <= radio; t += amplitud * (0.55 + rnd() * 0.5)) {
      const o2 = s + lado * amplitud * (0.6 + rnd() * 0.5);
      pts.push(`${f(cx + ux * t + nx * o2)} ${f(cy + uy * t + ny * o2)}`);
      lado = -lado;
    }
    caminos += `M${pts.join('L')}`;
  }
  return (
    `<clipPath id="${id}"><path d="${d}"/></clipPath>` +
    `<g clip-path="url(#${id})" fill="none" stroke="${tinta}" stroke-width="${f(g.ancho)}" stroke-linejoin="round" stroke-linecap="round"${o < 1 ? ` opacity="${f(o)}"` : ''}><path d="${caminos}"/></g>`
  );
}

/**
 * Una mancha de forma suelta, para las manchas del cuero: un borde blando, con entrantes y
 * salientes de distinto tamaño, que no se repite. `lobulos` es cuántas ondas grandes tiene.
 */
export function mancha(c: P, [rx, ry]: P, semilla: number, giro = 0, lobulos = 3): string {
  const rnd = azar(semilla);
  const n = 22;
  const g = (giro * Math.PI) / 180;
  const ondas = [
    [lobulos, 0.16 + rnd() * 0.1, rnd() * 6.3],
    [lobulos + 2, 0.08 + rnd() * 0.06, rnd() * 6.3],
    [lobulos * 2 + 3, 0.04 + rnd() * 0.03, rnd() * 6.3],
  ] as const;
  const pts: P[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = ondas.reduce((acc, [frec, amp, fase]) => acc + amp * Math.sin(frec * a + fase), 1);
    const x = Math.cos(a) * rx * k;
    const y = Math.sin(a) * ry * k;
    pts.push([c[0] + x * Math.cos(g) - y * Math.sin(g), c[1] + x * Math.sin(g) + y * Math.cos(g)]);
  }
  // Una curva cerrada que pasa por los puntos (Catmull-Rom llevada a cúbicas).
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]!;
    const p1 = pts[i]!;
    const p2 = pts[(i + 1) % n]!;
    const p3 = pts[(i + 2) % n]!;
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + 'Z';
}
