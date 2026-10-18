/**
 * La talla de *Oktubre* (`D-73`, séptima vuelta): con lo que se graba la drácula con tacones y la
 * prisión de Barbazul.
 *
 * La tapa de *Oktubre* (1986) es la gente y las banderas, y la gente está **tallada**: la plancha
 * es negra, y la luz se le saca a gubia. Donde la luz pega fuerte, los cortes se ensanchan hasta
 * juntarse y queda un plano blanco (la frente, el pómulo, el puente de la nariz); donde la forma
 * se da vuelta, los cortes se afinan y se cortan, y queda el negro (las cuencas, debajo del
 * pómulo, el cogote). Y los cortes nunca son rectos ni parejos: dan la vuelta a la forma, como
 * los paralelos de un globo. Eso es lo que hace esto, en SVG, para que la imprenta lo pase a
 * imágenes como al aerógrafo (`scripts/imprimir-bestiario.mjs`).
 *
 * Una pieza se arma en tres capas: la plancha negra con la silueta, las tallas blancas que salen
 * de un **campo de luz** (`tono`) y de una **familia de líneas** (`envolventes`, `paralelas`,
 * `siguiendo`, `rayos`), y encima los trazos negros que la gubia dejó en lo blanco (el párpado,
 * la boca, la aleta de la nariz). Los colores son tokens, como en todo el bestiario.
 */

import { azar, type P } from './pincel.ts';

export type { P };

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const suave = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/* ------------------------------------------------------------------
   El campo de luz: cuánta luz hay en cada punto, de 0 (negro) a 1 (papel)
   ------------------------------------------------------------------ */

export type Tono = (x: number, y: number) => number;

/**
 * Una mancha de luz (`peso` positivo) o de sombra (negativo): una elipse que pesa entera en el
 * medio y se apaga hacia el borde. `blando` es qué parte del radio usa para apagarse.
 */
export interface Mancha {
  c: P;
  r: P;
  peso: number;
  giro?: number;
  blando?: number;
}

/** Algo que suma luz: una mancha, o una función del punto. */
export type Capa = Mancha | ((x: number, y: number) => number);

/** El campo de luz: una base y lo que le suman o le restan las manchas, sin salirse de 0 a 1. */
export function tono(base: number, capas: readonly Capa[]): Tono {
  const pre = capas.map((c) => {
    if (typeof c === 'function') return c;
    const a = ((c.giro ?? 0) * Math.PI) / 180;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    const blando = c.blando ?? 0.6;
    return (x: number, y: number): number => {
      const dx = x - c.c[0];
      const dy = y - c.c[1];
      const u = (dx * cos + dy * sin) / c.r[0];
      const v = (-dx * sin + dy * cos) / c.r[1];
      const d = Math.sqrt(u * u + v * v);
      return d >= 1 ? 0 : c.peso * (d <= 1 - blando ? 1 : suave((1 - d) / blando));
    };
  });
  return (x, y) => {
    let t = base;
    for (const c of pre) t += c(x, y);
    return t < 0 ? 0 : t > 1 ? 1 : t;
  };
}

/**
 * La luz sobre una forma redonda: un elipsoide visto de frente, iluminado desde `luz` (x, y
 * hacia la luz en el plano, z hacia el que mira). Afuera de la elipse no suma nada.
 */
export function bola(c: P, r: P, luz: readonly [number, number, number], peso = 1, giro = 0): Capa {
  const n = Math.hypot(...luz);
  const [lx, ly, lz] = luz.map((v) => v / n) as [number, number, number];
  const a = (giro * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return (x, y) => {
    const dx = x - c[0];
    const dy = y - c[1];
    const u = (dx * cos + dy * sin) / r[0];
    const v = (-dx * sin + dy * cos) / r[1];
    const q = u * u + v * v;
    if (q >= 1) return 0;
    const w = Math.sqrt(1 - q);
    // La normal, vuelta a la escena (la rotación del plano no toca z).
    const nx = u * cos - v * sin;
    const ny = u * sin + v * cos;
    return peso * Math.max(0, nx * lx + ny * ly + w * lz);
  };
}

/* ------------------------------------------------------------------
   Las familias de líneas: por dónde pasa la gubia
   ------------------------------------------------------------------ */

/** Un ruido suave de una dimensión: el pulso de la mano. */
function ruido1(rnd: () => number, largo: number, paso: number): (s: number) => number {
  const n = Math.max(2, Math.ceil(largo / paso) + 2);
  const v = Array.from({ length: n }, () => rnd());
  return (s) => {
    const x = Math.max(0, s / paso);
    const i = Math.min(n - 2, Math.floor(x));
    const t = x - i;
    const u = t * t * (3 - 2 * t);
    return v[i]! * (1 - u) + v[i + 1]! * u;
  };
}

/** Una cúbica de cuatro puntos, muestreada. */
export function cubica([a, b, c, d]: readonly [P, P, P, P], n = 48): P[] {
  const pts: P[] = [];
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const m = 1 - t;
    pts.push([
      m * m * m * a[0] + 3 * m * m * t * b[0] + 3 * m * t * t * c[0] + t * t * t * d[0],
      m * m * m * a[1] + 3 * m * m * t * b[1] + 3 * m * t * t * c[1] + t * t * t * d[1],
    ]);
  }
  return pts;
}

/**
 * Las líneas que dan la vuelta a una forma redonda, como los paralelos de un globo visto un poco
 * desde arriba: cruzan la forma de lado a lado y se comban hacia abajo. `desde` y `hasta` dicen
 * qué franja de la forma cubren (-1 arriba, 1 abajo); `comba` cuánto se curvan.
 */
export function envolventes(
  c: P,
  r: P,
  { paso, comba = 0.22, giro = 0, desde = -1, hasta = 1, sobra = 1.15, semilla }: { paso: number; comba?: number; giro?: number; desde?: number; hasta?: number; sobra?: number; semilla: number },
): P[][] {
  const rnd = azar(semilla);
  const a = (giro * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const lineas: P[][] = [];
  for (let v = desde; v <= hasta; v += (paso / r[1]) * (0.8 + rnd() * 0.4)) {
    const medio = Math.sqrt(Math.max(0.02, 1 - v * v));
    const temblor = ruido1(rnd, 2, 0.35);
    const pts: P[] = [];
    for (let k = 0; k <= 40; k++) {
      const u = -sobra + (2 * sobra * k) / 40;
      const x = u * r[0] * medio;
      const y = v * r[1] + comba * r[1] * medio * Math.sqrt(Math.max(0, 1 - Math.min(1, u * u))) + (temblor((u + sobra) / sobra) - 0.5) * paso * 0.5;
      pts.push([c[0] + x * cos - y * sin, c[1] + x * sin + y * cos]);
    }
    lineas.push(pts);
  }
  return lineas;
}

/**
 * Líneas paralelas que cruzan una caja en un ángulo, con un poco de comba y el temblor de la
 * mano. Para un plano: una pared, el piso, el pecho de un vestido.
 */
export function paralelas(
  [x, y, ancho, alto]: readonly [number, number, number, number],
  { angulo, paso, comba = 0, semilla }: { angulo: number; paso: number; comba?: number; semilla: number },
): P[][] {
  const rnd = azar(semilla);
  const cx = x + ancho / 2;
  const cy = y + alto / 2;
  const a = (angulo * Math.PI) / 180;
  const [ux, uy] = [Math.cos(a), Math.sin(a)];
  const [nx, ny] = [-uy, ux];
  const radio = Math.hypot(ancho, alto) / 2 + paso;
  const lineas: P[][] = [];
  let i = 0;
  for (let o = -radio; o <= radio; o += paso * (0.82 + rnd() * 0.36), i++) {
    const temblor = ruido1(rnd, 2 * radio, 30 + rnd() * 30);
    const pts: P[] = [];
    for (let k = 0; k <= 40; k++) {
      const s = -radio + (2 * radio * k) / 40;
      const t = s / radio;
      const off = o + comba * radio * (1 - t * t) + (temblor(s + radio) - 0.5) * paso * 0.6;
      pts.push([cx + ux * s + nx * off, cy + uy * s + ny * off]);
    }
    lineas.push(pts);
  }
  return lineas;
}

/**
 * Líneas que siguen una guía corridas de costado, cada una con su temblor: los mechones de un
 * pelo largo, los pliegues de una capa. `abre` es cuánto se separan al final, como un pelo que se
 * abre al caer.
 */
export function siguiendo(
  guia: readonly P[],
  { n, separacion, abre = 1, semilla, recorta = 0 }: { n: number; separacion: number; abre?: number; semilla: number; recorta?: number },
): P[][] {
  const rnd = azar(semilla);
  const pts = guia.length === 4 ? cubica(guia as [P, P, P, P]) : [...guia];
  const lineas: P[][] = [];
  for (let j = 0; j < n; j++) {
    const lugar = n === 1 ? 0 : j / (n - 1) - 0.5;
    const temblor = ruido1(rnd, 1, 0.22 + rnd() * 0.2);
    // Cada mechón arranca y termina un poco distinto.
    const corta0 = rnd() * recorta;
    const corta1 = 1 - rnd() * recorta;
    const linea: P[] = [];
    for (let k = 0; k < pts.length; k++) {
      const t = k / (pts.length - 1);
      if (t < corta0 || t > corta1) continue;
      const [xa, ya] = pts[Math.max(0, k - 1)]!;
      const [xb, yb] = pts[Math.min(pts.length - 1, k + 1)]!;
      const nrm = Math.hypot(xb - xa, yb - ya) || 1;
      const nx = -(yb - ya) / nrm;
      const ny = (xb - xa) / nrm;
      const o = lugar * separacion * n * (1 + (abre - 1) * t) + (temblor(t) - 0.5) * separacion * 0.9;
      linea.push([pts[k]![0] + nx * o, pts[k]![1] + ny * o]);
    }
    if (linea.length > 2) lineas.push(linea);
  }
  return lineas;
}

/** Líneas que salen de un punto, como la luz en los grabados: de `r0` a `r1`, entre dos ángulos. */
export function rayos(c: P, { desde, hasta, n, r0, r1, semilla }: { desde: number; hasta: number; n: number; r0: number; r1: number; semilla: number }): P[][] {
  const rnd = azar(semilla);
  const lineas: P[][] = [];
  for (let i = 0; i < n; i++) {
    const a = ((desde + ((hasta - desde) * (i + 0.5 + (rnd() - 0.5) * 0.6)) / n) * Math.PI) / 180;
    const largo = r0 + (r1 - r0) * (0.55 + rnd() * 0.45);
    const pts: P[] = [];
    for (let k = 0; k <= 16; k++) {
      const r = r0 + ((largo - r0) * k) / 16;
      pts.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]);
    }
    lineas.push(pts);
  }
  return lineas;
}

/* ------------------------------------------------------------------
   La gubia: el corte con ancho
   ------------------------------------------------------------------ */

/** Una línea muestreada a distancias iguales. */
function parejo(pts: readonly P[], paso: number): P[] {
  const salida: P[] = [pts[0]!];
  let resto = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]!;
    const [x1, y1] = pts[i]!;
    const d = Math.hypot(x1 - x0, y1 - y0);
    if (!d) continue;
    let s = paso - resto;
    while (s <= d) {
      salida.push([x0 + ((x1 - x0) * s) / d, y0 + ((y1 - y0) * s) / d]);
      s += paso;
    }
    resto = d - (s - paso);
  }
  return salida;
}

/**
 * Una línea con ancho: el polígono que deja una gubia (o un pincel) que entra fino, se abre y
 * sale fino. `ancho(i, x, y)` dice el ancho en cada punto; donde da menos que `minimo`, la gubia
 * se levanta y la línea se corta en dos.
 */
function conAncho(linea: readonly P[], ancho: (s: number, x: number, y: number) => number, minimo: number, punta: number): string {
  const pts = parejo(linea, 1.5);
  if (pts.length < 3) return '';
  const largo = (pts.length - 1) * 1.5;
  let d = '';
  let izq: string[] = [];
  let der: string[] = [];
  let ini: P | null = null;
  let ult: P | null = null;
  const cerrar = (): void => {
    if (izq.length > 1 && ini && ult) d += `M${f(ini[0])} ${f(ini[1])}L${izq.join('L')}L${f(ult[0])} ${f(ult[1])}L${der.reverse().join('L')}Z`;
    izq = [];
    der = [];
    ini = null;
  };
  for (let k = 1; k < pts.length - 1; k++) {
    const [x, y] = pts[k]!;
    const s = k * 1.5;
    // Entra y sale en punta.
    const extremos = Math.min(1, s / punta, (largo - s) / punta);
    const w = ancho(s, x, y) * suave(extremos);
    if (w < minimo) {
      cerrar();
      continue;
    }
    const [xa, ya] = pts[k - 1]!;
    const [xb, yb] = pts[k + 1]!;
    const n = Math.hypot(xb - xa, yb - ya) || 1;
    const nx = -(yb - ya) / n;
    const ny = (xb - xa) / n;
    if (!ini) ini = [xa, ya];
    izq.push(`${f(x + (nx * w) / 2)} ${f(y + (ny * w) / 2)}`);
    der.push(`${f(x - (nx * w) / 2)} ${f(y - (ny * w) / 2)}`);
    ult = [xb, yb];
  }
  cerrar();
  return d;
}

export interface Gubia {
  /** El ancho de un corte donde la luz es plena. Con los cortes a `paso`, más que el paso los junta. */
  ancho: number;
  /** El tono en que la gubia empieza a cortar y el tono en que ya corta a pleno. */
  umbral?: readonly [number, number];
  /** Cuánto late el ancho a lo largo del corte, de 0 a 1. */
  pulso?: number;
  /** El largo de la punta con que entra y sale. */
  punta?: number;
  semilla: number;
}

/**
 * Las tallas: cada línea de la familia, cortada con el ancho que pide la luz. Devuelve el `d` de
 * un solo camino con todos los cortes, que se rellena del color del papel.
 */
export function tallar(lineas: ReadonlyArray<readonly P[]>, luz: Tono, { ancho, umbral = [0.22, 0.9], pulso = 0.35, punta = 7, semilla }: Gubia): string {
  const rnd = azar(semilla);
  const [u0, u1] = umbral;
  return lineas
    .map((l) => {
      const late = ruido1(rnd, 2000, 9 + rnd() * 10);
      const fase = rnd() * 400;
      return conAncho(l, (s, x, y) => ancho * suave((luz(x, y) - u0) / (u1 - u0)) * (1 - pulso / 2 + pulso * late(s + fase)), 0.35, punta);
    })
    .join('');
}

/**
 * Un trazo de tinta con ancho: lo negro que la gubia dejó en lo blanco (el párpado, la comisura,
 * la aleta de la nariz), o una línea blanca suelta (el brillo de un ojo, el filo de un colmillo).
 * `perfil` va de 0 a 1 a lo largo del trazo y multiplica el ancho; por defecto, una panza.
 */
export function trazo(linea: readonly P[], ancho: number, semilla: number, perfil: (t: number) => number = (t) => Math.sin(Math.PI * t) ** 0.6): string {
  const pts = linea.length === 4 ? cubica(linea as [P, P, P, P], 32) : linea;
  const rnd = azar(semilla);
  const late = ruido1(rnd, 2000, 8);
  let largo = 0;
  for (let i = 1; i < pts.length; i++) largo += Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
  return conAncho(pts, (s) => ancho * perfil(s / largo) * (0.8 + 0.4 * late(s)), 0.2, 2);
}

/**
 * El picado: los golpecitos cortos de gubia en los medios tonos, que le dan al grabado el grano
 * de la madera. Cortes de dos a cinco unidades, en un ángulo, donde la luz está entre `rango`.
 */
export function picado(
  [x, y, ancho, alto]: readonly [number, number, number, number],
  luz: Tono,
  { rango, densidad, angulo, semilla }: { rango: readonly [number, number]; densidad: number; angulo: number; semilla: number },
): string {
  const rnd = azar(semilla);
  const cuantos = Math.round((ancho * alto * densidad) / 1000);
  const a = (angulo * Math.PI) / 180;
  let d = '';
  for (let i = 0; i < cuantos; i++) {
    const px = x + rnd() * ancho;
    const py = y + rnd() * alto;
    const t = luz(px, py);
    if (t < rango[0] || t > rango[1]) continue;
    const l = 2 + rnd() * 3.5;
    const g = a + (rnd() - 0.5) * 0.7;
    const [dx, dy] = [(Math.cos(g) * l) / 2, (Math.sin(g) * l) / 2];
    const w = 0.5 + rnd() * 0.7;
    const [nx, ny] = [-Math.sin(g) * w, Math.cos(g) * w];
    d += `M${f(px - dx)} ${f(py - dy)}L${f(px + nx)} ${f(py + ny)}L${f(px + dx)} ${f(py + dy)}L${f(px - nx)} ${f(py - ny)}Z`;
  }
  return d;
}

/**
 * La plancha: la silueta entintada de negro (puede tener agujeros: se rellena par-impar), con las tallas y los trazos adentro, recortados por
 * ella. El orden es el de la gubia: lo tallado, lo blanco suelto, lo negro que queda encima, y
 * los brillos, que se cortan al final. La gubia corre el borde de cada corte (`#gubia`), y la
 * prensa deja motas de papel en el negro (`#motas`), como un grabado impreso a mano.
 */
export function plancha(
  id: string,
  silueta: string,
  {
    negro,
    papel,
    tallas,
    trazos = '',
    blancos = '',
    brillos = '',
    caja,
    motas = true,
  }: {
    negro: string;
    papel: string;
    tallas: string;
    trazos?: string;
    blancos?: string;
    brillos?: string;
    caja: readonly [number, number, number, number];
    /** Las motas de la prensa. Los planos de atrás van sin: lejos no se ven, y pesan. */
    motas?: boolean;
  },
): string {
  const [x, y, ancho, alto] = caja;
  return (
    `<clipPath id="${id}"><path d="${silueta}" clip-rule="evenodd"/></clipPath>` +
    `<g clip-path="url(#${id})">` +
    `<path d="${silueta}" fill="${negro}" fill-rule="evenodd"/>` +
    (motas ? `<rect x="${f(x)}" y="${f(y)}" width="${f(ancho)}" height="${f(alto)}" filter="url(#motas)"/>` : '') +
    `<g filter="url(#gubia)"><path d="${tallas}" fill="${papel}"/>${blancos ? `<path d="${blancos}" fill="${papel}"/>` : ''}${trazos ? `<path d="${trazos}" fill="${negro}"/>` : ''}${brillos ? `<path d="${brillos}" fill="${papel}"/>` : ''}</g>` +
    `</g>`
  );
}
