/**
 * El pincel seco de *Gulp!* (`D-73`, sexta vuelta): con lo que se pinta al gordo Pierre.
 *
 * La tapa de *Gulp!* es pincel seco en negro sobre papel blanco, fotocopiado: pasadas anchas
 * donde las cerdas se abren y dejan rayas de papel, el trazo que se seca al final, y el borde
 * comido por la copia. Pierre, el vitricida es de ese disco, y no está en ninguna tapa: se
 * inventa en esa estética (`T-440`).
 *
 * Una pincelada son cerdas: cada una sigue el recorrido del pincel corrida de costado, con su
 * grosor, y se corta donde se queda sin tinta. Se queda antes en los bordes del pincel y al
 * final del trazo, como pasa con un pincel seco de verdad. Después la imprenta le pasa la
 * "fotocopia" (`filtros()`, `#xerox`): corre el borde con ruido y lo vuelve duro.
 *
 * No lo pinta el navegador: lo imprime `scripts/imprimir-bestiario.mjs`, como al aerógrafo.
 */

export type P = readonly [number, number];

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** El azar con semilla de todo el bestiario: la misma pincelada sale igual en cada impresión. */
export function azar(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Un ruido de una dimensión, suave: valores al azar cada `paso`, unidos con curva. */
export function ruido1(rnd: () => number, largo: number, paso: number): (s: number) => number {
  const n = Math.ceil(largo / paso) + 2;
  const v = Array.from({ length: n }, () => rnd());
  return (s: number): number => {
    const x = Math.max(0, s / paso);
    const i = Math.min(n - 2, Math.floor(x));
    const t = x - i;
    const u = t * t * (3 - 2 * t);
    return v[i]! * (1 - u) + v[i + 1]! * u;
  };
}

/** Un recorrido: una cúbica (cuatro puntos) o una polilínea, muestreado cada `paso`. */
export function muestrear(puntos: readonly P[], paso: number): P[] {
  const crudo: P[] = [];
  if (puntos.length === 4) {
    const [a, b, c, d] = puntos as [P, P, P, P];
    for (let k = 0; k <= 200; k++) {
      const t = k / 200;
      const m = 1 - t;
      crudo.push([
        m * m * m * a[0] + 3 * m * m * t * b[0] + 3 * m * t * t * c[0] + t * t * t * d[0],
        m * m * m * a[1] + 3 * m * m * t * b[1] + 3 * m * t * t * c[1] + t * t * t * d[1],
      ]);
    }
  } else crudo.push(...puntos);
  // A distancias iguales, para que la tinta se gaste pareja.
  const salida: P[] = [crudo[0]!];
  let resto = 0;
  for (let i = 1; i < crudo.length; i++) {
    const [x0, y0] = crudo[i - 1]!;
    const [x1, y1] = crudo[i]!;
    let d = Math.hypot(x1 - x0, y1 - y0);
    let t0 = 0;
    while (resto + d >= paso) {
      const t = t0 + (paso - resto) / Math.hypot(x1 - x0, y1 - y0);
      salida.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]);
      d -= paso - resto;
      t0 = t;
      resto = 0;
    }
    resto += d;
  }
  return salida;
}

export interface Pincel {
  /** El ancho del pincel apoyado. */
  ancho: number;
  /** Cuánto se seca: 0 es una pasada cargada, 1 se queda sin tinta enseguida. */
  seco?: number;
  /** Cómo se apoya: el ancho al principio y al final, como fracción del ancho. */
  apoyo?: readonly [number, number];
  /** El color de la tinta (un token). */
  tinta?: string;
  /** Lo que tarda en cortarse una cerda: el largo típico de una raya de tinta. */
  grano?: number;
}

/**
 * Una pincelada de pincel seco. Devuelve trazos sueltos, uno por cada tramo de cerda que tuvo
 * tinta; se pintan juntos con un solo `stroke` en el grupo de afuera.
 */
export function pincelada(recorrido: readonly P[], pincel: Pincel, semilla: number): string {
  const rnd = azar(semilla);
  const { ancho, seco = 0.35, apoyo = [0.45, 0.7], grano = 14 } = pincel;
  const pts = muestrear(recorrido, 1.6);
  if (pts.length < 3) return '';
  const largo = (pts.length - 1) * 1.6;
  const cerdas = Math.min(44, Math.max(3, Math.round(ancho / 2.2)));
  const separacion = ancho / cerdas;
  const presion = ruido1(rnd, largo, 26);
  let d = '';
  const grupos = new Map<string, string>();
  // Las cerdas se pegan en mechones: un mechón se carga y se seca junto, y eso es lo que deja
  // las rayas largas de papel de la tapa en vez de un picado parejo.
  let mechon = ruido1(rnd, largo, grano * 1.6);
  let quedan = 0;
  for (let j = 0; j < cerdas; j++) {
    const lugar = cerdas === 1 ? 0 : j / (cerdas - 1) - 0.5;
    const borde = Math.abs(lugar) * 2;
    if (quedan-- <= 0) {
      mechon = ruido1(rnd, largo, grano * (1.2 + rnd() * 1.4));
      quedan = 2 + Math.floor(rnd() * 5);
    }
    const propia = ruido1(rnd, largo, grano * (0.6 + rnd() * 0.8));
    const delMechon = mechon;
    const tinta = (s: number): number => delMechon(s) * 0.72 + propia(s) * 0.28;
    const temblor = ruido1(rnd, largo, 18);
    const grueso = separacion * (1.05 + rnd() * 1.1);
    const arranca = rnd() * rnd() * Math.min(18, largo * 0.15) * (0.3 + borde);
    let tramo: string[] = [];
    const cerrar = (): void => {
      if (tramo.length > 1) {
        const clave = f(grueso);
        grupos.set(clave, (grupos.get(clave) ?? '') + `M${tramo.join('L')}`);
      }
      tramo = [];
    };
    for (let k = 1; k < pts.length - 1; k++) {
      const s = k * 1.6;
      const t = s / largo;
      if (s < arranca) continue;
      const [x, y] = pts[k]!;
      const [xa, ya] = pts[k - 1]!;
      const [xb, yb] = pts[k + 1]!;
      const tx = xb - xa;
      const ty = yb - ya;
      const n = Math.hypot(tx, ty) || 1;
      const nx = -ty / n;
      const ny = tx / n;
      // El ancho apoyado: entra fino, se abre, y al final se afina o se abre en cerdas.
      const perfil = t < 0.12 ? apoyo[0] + (1 - apoyo[0]) * (t / 0.12) : t > 0.8 ? 1 + (apoyo[1] - 1) * ((t - 0.8) / 0.2) : 1;
      const w = ancho * perfil * (0.85 + presion(s) * 0.3);
      const o = lugar * w + (temblor(s) - 0.5) * 1.6;
      // La tinta se gasta con el largo y en los bordes del pincel.
      const umbral = 0.08 + seco * (0.25 + t * 0.75) + borde * borde * (0.15 + seco * 0.5);
      if (tinta(s) > umbral) tramo.push(`${f(x + nx * o)} ${f(y + ny * o)}`);
      else cerrar();
    }
    cerrar();
  }
  const tinta = pincel.tinta ?? 'var(--fondo)';
  for (const [grueso, camino] of grupos) d += `<path d="${camino}" stroke-width="${grueso}" stroke="${tinta}"/>`;
  return d;
}

/**
 * Una mancha de sombra pintada a pincel seco: pasadas paralelas que cruzan la zona en un
 * ángulo, un poco curvadas, recortadas por la forma de la sombra. Así pinta Rocambole lo
 * oscuro en *Gulp!*: no con un contorno, con pasadas que se secan contra la luz.
 */
export function mancha(
  id: string,
  d: string,
  caja: readonly [number, number, number, number],
  pincel: Pincel & { angulo: number; curva?: number },
  semilla: number,
): string {
  const [x, y, ancho, alto] = caja;
  const cx = x + ancho / 2;
  const cy = y + alto / 2;
  const a = (pincel.angulo * Math.PI) / 180;
  const [ux, uy] = [Math.cos(a), Math.sin(a)];
  const [nx, ny] = [-uy, ux];
  const radio = Math.hypot(ancho, alto) / 2 + pincel.ancho;
  const paso = pincel.ancho * 0.62;
  const curva = pincel.curva ?? 0.12;
  let s = '';
  let i = 0;
  for (let o = -radio; o <= radio; o += paso, i++) {
    const bx = cx + nx * o;
    const by = cy + ny * o;
    const c = curva * radio * (i % 2 ? 1 : -0.6);
    s += pincelada(
      [
        [bx - ux * radio, by - uy * radio],
        [bx - ux * radio * 0.35 + nx * c, by - uy * radio * 0.35 + ny * c],
        [bx + ux * radio * 0.35 + nx * c, by + uy * radio * 0.35 + ny * c],
        [bx + ux * radio, by + uy * radio],
      ],
      pincel,
      semilla * 13 + i,
    );
  }
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${s}</g>`;
}

/**
 * El volumen de una forma redonda: la sombra es la medialuna que queda cuando a la forma se le
 * saca su parte iluminada (la misma forma corrida hacia la luz), y se pinta con pasadas que dan
 * la vuelta a la forma, como se pinta una papa o una panza. `luz` es hacia dónde está la luz,
 * como fracción del radio: `[-0.3, -0.35]` es arriba a la izquierda, la puerta del bajo. `hondo`
 * es cuánto se corre la parte iluminada hacia la luz: más es una sombra más gorda.
 */
export function volumen(
  id: string,
  [cx, cy]: P,
  [rx, ry]: P,
  luz: P,
  pincel: Pincel,
  semilla: number,
  { giro = 0, vueltas = 5, abre = 1.15, hondo = 0.9 }: { giro?: number; vueltas?: number; abre?: number; hondo?: number } = {},
): string {
  const [lx, ly] = luz;
  // De qué lado está la sombra: el contrario a la luz.
  const centro = Math.atan2(-ly * rx, -lx * ry);
  let s = '';
  for (let v = 0; v < vueltas; v++) {
    const k = 1.04 - (v / Math.max(1, vueltas - 1)) * 0.5;
    const desde = centro - abre * (1.25 - v * 0.08);
    const hasta = centro + abre * (1.25 - v * 0.08);
    const arco: P[] = [];
    for (let a = desde; a <= hasta; a += 0.04) arco.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    s += pincelada(arco, pincel, semilla * 17 + v);
  }
  const elipse = (x: number, y: number, a: number, b: number, fill: string): string =>
    `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(a)}" ry="${f(b)}" fill="${fill}"/>`;
  const rot = giro ? ` transform="rotate(${giro} ${f(cx)} ${f(cy)})"` : '';
  return (
    `<mask id="${id}" maskUnits="userSpaceOnUse" x="${f(cx - rx * 1.6)}" y="${f(cy - ry * 1.6)}" width="${f(rx * 3.2)}" height="${f(ry * 3.2)}">` +
    `<g${rot}>${elipse(cx, cy, rx, ry, 'white')}${elipse(cx + lx * rx * hondo, cy + ly * ry * hondo, rx * 1.02, ry * 1.02, 'black')}</g></mask>` +
    `<g mask="url(#${id})"><g${rot}>${s}</g></g>`
  );
}

/** Varias pinceladas con el mismo pincel. */
export const pinceladas = (recorridos: ReadonlyArray<readonly P[]>, pincel: Pincel, semilla: number): string =>
  recorridos.map((r, i) => pincelada(r, pincel, semilla * 31 + i * 7)).join('');

/** El grupo de afuera de las pinceladas: cerdas redondas, sin relleno, y la fotocopia. */
export const tinta = (adentro: string, fotocopia = true): string =>
  `<g fill="none" stroke-linecap="round" stroke-linejoin="round"${fotocopia ? ' filter="url(#xerox)"' : ''}>${adentro}</g>`;

/**
 * Un trazo de birome corrido, como las letras de *Gulp!*: rojo encima y amarillo debajo, un
 * poco desplazados, que es lo que pasa cuando la imprenta no calza las dos tintas.
 */
export function corrido(d: string, ancho: number, arriba = 'var(--disco-gulp-tinta)', abajo = 'var(--bestia-pierre-amarillo)', corre: P = [2.4, 2.2]): string {
  return (
    `<g fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#xerox-fino)">` +
    `<path d="${d}" stroke="${abajo}" stroke-width="${f(ancho * 1.15)}" transform="translate(${corre[0]} ${corre[1]})"/>` +
    `<path d="${d}" stroke="${arriba}" stroke-width="${f(ancho)}"/>` +
    `</g>`
  );
}
