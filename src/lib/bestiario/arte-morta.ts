/**
 * El Morta (`D-73`, decimoquinta vuelta), en el templo de Momo.
 *
 * *"El Morta quiere más japines / Va perdiendo aceite, relincha de más"* es de *Morta punto com*, la
 * pista 2 de *Momo Sampler* (2000). El Morta no está en ninguna tapa: se inventa en la de su disco
 * (`D-19`, `T-440`). **Está pintado a aerógrafo como la cara del interior del disco**: la piel violeta
 * casi negra, partida por la luz en una mitad lila y otra hundida, las rayas de pintura de murga en los
 * cachetes y los espirales de plata en la frente, como los del lomo de la tapa. El toallón es la plata
 * del medallón de Momo. Las tintas se midieron en las tapas (`--bestia-morta-*`).
 *
 * Es medio caballo y medio tipo, como dice la estampa: el pescuezo y la cabeza de caballo, las patas de
 * caballo con sus pezuñas (*"con sus gambas de poli brinca y cae"*), y en el medio un tipo de barrio con
 * panza, la cadenita de oro y el toallón atado a la cintura (*"cubre su rabo con un gran toallón"*), que
 * se le resbala. El marulo, hinchado de gin, es una frente abombada. Los ojos son de persona, como los
 * animales de Rocambole. Va perdiendo aceite: gotea por debajo del toallón, y la mancha negra con brillo
 * de plata le queda en el papel picado del piso.
 *
 * La luz es la del templo: los focos de la guirnalda, cálidos, que lo prenden de arriba y a la
 * izquierda, y la plata que devuelve el piso, que le sube por abajo. El corte entre la luz y la sombra
 * es de borde duro, la máscara de papel; adentro se sopla. Así se despega del negro sin contorno.
 *
 * Coordenadas del títere: el (0, 0) es el piso entre las pezuñas, arriba es negativo (`rig-morta.ts`).
 * La cabeza se dibuja acostada, con la nuca en el (0, 0) y el hocico a la izquierda (`CABEZA_LOCAL`).
 */

import { forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { azar } from './pincel.ts';
import {
  CABEZA_LOCAL as CL, MANCHA, MORTA as LUGAR, MORTA_ARMADO as A, PIVOTE_PARPADO, POSES, caminoDelChorro, entre, gota, mancha, transformes,
  type Pose, type Punto,
} from './rig-morta.ts';

type P = Punto;
const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** Las tintas del interior de *Momo Sampler* (`--bestia-morta-*`), la plata del medallón y la luz del templo. */
const M = {
  hondo: 'var(--bestia-morta-hondo)',
  piel: 'var(--bestia-morta-piel)',
  media: 'var(--bestia-morta-media)',
  lila: 'var(--bestia-morta-lila)',
  lilaClara: 'var(--bestia-morta-lila-clara)',
  brillo: 'var(--bestia-morta-brillo)',
  pintura: 'var(--bestia-morta-pintura)',
  pinturaViva: 'var(--bestia-morta-pintura-viva)',
  violeta: 'var(--bestia-morta-violeta)',
  metal: 'var(--bestia-morta-metal)',
  metalHondo: 'var(--bestia-morta-metal-hondo)',
  plata: 'var(--disco-momo-sampler-tinta)',
  peltre: 'var(--disco-momo-sampler-apoyo)',
  foco: 'var(--entorno-templo-foco)',
  oro: 'var(--acento-2)',
  ojo: 'var(--bestia-ojo-blanco)',
  negro: 'var(--fondo)',
};

/* ------------------------------------------------------------------
   Herramientas: la curva, la máscara, el tubo, el pelo mojado
   ------------------------------------------------------------------ */

/** Una curva suave que pasa por todos los puntos (Catmull-Rom llevada a Bézier). */
function curva(pts: readonly P[], cerrada = true): string {
  const n = pts.length;
  const en = (i: number): P => (cerrada ? pts[(i + n) % n]! : pts[Math.min(n - 1, Math.max(0, i))]!);
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  for (let i = 0; i < (cerrada ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [en(i - 1), en(i), en(i + 1), en(i + 2)];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return cerrada ? `${d} Z` : d;
}

const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;
/** El rociado de la boquilla abierta encima del grano: el polvo grueso de la cara del interior. */
const conRociado = (s: string): string => `<g filter="url(#rociado)">${conGrano(s)}</g>`;
const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;
/** Un trazo soplado: la boquilla que pasa a lo largo, sin borde. */
const pasada = (d: string, color: string, ancho: number, tam: 'xs' | 's' | 'm', o = 1): string =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${f(ancho)}" stroke-linecap="round" filter="url(#soplo-${tam})"${o < 1 ? ` opacity="${f(o)}"` : ''}/>`;

/**
 * La máscara del aerógrafo, con varias siluetas que se suman. La imprenta junta los caminos del recorte
 * en uno: todos tienen que girar para el mismo lado, o se restan donde se pisan.
 */
function enmascarado(id: string, siluetas: string | readonly string[], adentro: string): string {
  const todas = typeof siluetas === 'string' ? [siluetas] : siluetas;
  return `<clipPath id="${id}">${todas.map((d) => `<path d="${d}"/>`).join('')}</clipPath><g clip-path="url(#${id})">${adentro}</g>`;
}

/** Un punto de una línea quebrada, en `t` de 0 a 1 de su largo, con la dirección. */
function enLinea(pts: readonly P[], t: number): { p: P; dir: P } {
  const largos = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i]![0], p[1] - pts[i]![1]));
  const total = largos.reduce((s, l) => s + l, 0);
  let falta = t * total;
  for (let i = 0; i < largos.length; i++) {
    const l = largos[i]!;
    if (falta <= l || i === largos.length - 1) {
      const k = l ? Math.min(1, falta / l) : 0;
      const [a, b] = [pts[i]!, pts[i + 1]!];
      return { p: [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], dir: [(b[0] - a[0]) / (l || 1), (b[1] - a[1]) / (l || 1)] };
    }
    falta -= l;
  }
  return { p: pts[pts.length - 1]!, dir: [0, 1] };
}

/** Un tubo que se afina a lo largo de un eje: un brazo, una pata, un mechón. Las puntas, redondas. */
function tubo(eje: readonly P[], anchos: readonly number[], pasos = 14, punta = 0.42): string {
  const ancho = (t: number): number => {
    const x = t * (anchos.length - 1);
    const i = Math.min(anchos.length - 2, Math.floor(x));
    return anchos[i]! + (anchos[i + 1]! - anchos[i]!) * (x - i);
  };
  const izq: P[] = [];
  const der: P[] = [];
  for (let k = 0; k <= pasos; k++) {
    const t = k / pasos;
    const { p, dir } = enLinea(eje, t);
    const w = ancho(t) / 2;
    izq.push([p[0] + dir[1] * w, p[1] - dir[0] * w]);
    der.push([p[0] - dir[1] * w, p[1] + dir[0] * w]);
  }
  const a = enLinea(eje, 0);
  const b = enLinea(eje, 1);
  const pa: P = [a.p[0] - a.dir[0] * ancho(0) * punta, a.p[1] - a.dir[1] * ancho(0) * punta];
  const pb: P = [b.p[0] + b.dir[0] * ancho(1) * punta, b.p[1] + b.dir[1] * ancho(1) * punta];
  return curva([pa, ...izq, pb, ...der.reverse()]);
}

/** Un mechón de pelo mojado: el eje que cae, y el ancho de la raíz. */
interface Mechon {
  eje: P[];
  ancho: number;
}

/** Mechones que nacen de `raiz` (un punto por mechón) y caen para `caida`, doblándose un poco. */
function mechonesDe(rnd: () => number, n: number, raiz: (i: number) => P, caida: (p: P, i: number) => P, largo: readonly [number, number], grueso: readonly [number, number], curvo = 0.5): Mechon[] {
  const salida: Mechon[] = [];
  for (let i = 0; i < n; i++) {
    const a = raiz(i);
    const [dx, dy] = caida(a, i);
    const m = Math.hypot(dx, dy) || 1;
    const dir: P = [dx / m, dy / m];
    const l = largo[0] + rnd() * (largo[1] - largo[0]);
    const dobla = (rnd() - 0.5) * curvo;
    const eje: P[] = [];
    for (let k = 0; k <= 6; k++) {
      const t = k / 6;
      const lado = t * t * dobla * l * 0.5;
      eje.push([a[0] + dir[0] * l * t - dir[1] * lado, a[1] + dir[1] * l * t + dir[0] * lado]);
    }
    salida.push({ eje, ancho: grueso[0] + rnd() * (grueso[1] - grueso[0]) });
  }
  return salida;
}

/**
 * El pelo mojado, pegado en mechones, como sale del baño. Es una sola máscara, la suma de todos los
 * mechones, con las puntas duras afuera (la máscara de papel); adentro se sopla a lo largo de cada
 * mechón, de lo negro a lo violeta, y donde le pega la luz el mojado brilla en hilos finitos.
 */
function pelo(id: string, mechones: readonly Mechon[], luz: (p: P) => number, brilla = M.lilaClara): string {
  const siluetas = mechones.map((m) => tubo(m.eje, [m.ancho, m.ancho * 0.95, m.ancho * 0.72, m.ancho * 0.38, 0.4], 14, 0.1));
  let adentro = '';
  for (const m of mechones) {
    const k = luz(m.eje[0]!);
    const lomo = curva(m.eje.slice(0, 6), false);
    adentro += pasada(lomo, M.hondo, m.ancho * 0.7, 's', 0.9) + pasada(curva(m.eje.slice(0, 4), false), M.piel, m.ancho * 0.35, 's', 0.2 + k * 0.6);
  }
  // Los brillos del mojado: hilos que siguen el mechón, solo en los que agarran la luz.
  for (const [i, m] of mechones.entries()) {
    const k = luz(m.eje[0]!);
    if (k < 0.2) continue;
    const corre = (i % 2 ? 1 : -1) * m.ancho * 0.18;
    const [a, b] = [m.eje[0]!, m.eje[2]!];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const [nx, ny] = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
    adentro += `<g transform="translate(${f(nx * corre)} ${f(ny * corre)})">${trazo(curva(m.eje.slice(1, 4), false), brilla, Math.max(0.45, m.ancho * 0.1), 0.2 + k * 0.55)}</g>`;
  }
  // Las mismas máscaras giran para el mismo lado: el tubo las arma todas igual.
  return enmascarado(id, siluetas, forma(`M-400 -600 L400 -600 L400 400 L-400 400 Z`, M.negro) + adentro);
}

/** Un espiral como los del lomo de *Momo Sampler* y los de la frente de la cara del interior. */
function espiral(cx: number, cy: number, r: number, vueltas = 2.2): string {
  let d = '';
  for (let k = 0; k <= 40; k++) {
    const a = (k / 40) * Math.PI * 2 * vueltas;
    const rr = (r * k) / 40;
    d += `${k ? 'L' : 'M'}${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)} `;
  }
  return d;
}

/** Lo desparejo del aerógrafo: manchitas sopladas de más y de menos, más claras donde pega la luz. */
function manchas(rnd: () => number, n: number, [x0, y0, w, h]: readonly [number, number, number, number], luz: (p: P) => number, claro = M.media, oscuro = M.hondo): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const [x, y] = [x0 + rnd() * w, y0 + rnd() * h];
    s += nube(x, y, 1.5 + rnd() * 3.5, 1.5 + rnd() * 3, rnd() < luz([x, y]) ? claro : oscuro, 's', 0.18 + rnd() * 0.25);
  }
  return s;
}

/* ------------------------------------------------------------------
   La cabeza: de caballo, acostada (la nuca en el 0, 0; el hocico a la izquierda)
   ------------------------------------------------------------------ */

/** La silueta de arriba de la cabeza: la frente abombada (el marulo hinchado), la caña de la nariz, el hocico. */
export const CABEZA: readonly P[] = [
  [8, -9], [2, -19], [-8, -27], [-20, -32.5], [-34, -33], [-45, -28],
  [-53, -21], [-64, -17], [-78, -14], [-92, -11], [-104, -8],
  [-112, -4.5], [-118, 0.5], [-120.5, 7], [-117.5, 12.5], [-108, 14.5],
  [-95, 13.5], [-80, 14], [-62, 14.5], [-46, 13.5], [-32, 11.5], [-20, 9], [-10, 10], [-2, 13], [7, 10], [11, 1],
];

/**
 * La arista de la cara, de la frente al hocico: arriba de ella está el plano de adelante, la caña de la
 * nariz, que se ve de tres cuartos y le da de lleno la luz de los focos; abajo, el costado de la cara,
 * a media luz. El borde es duro, la máscara de papel.
 */
const ARISTA: readonly P[] = [[-14, -26], [-30, -24.5], [-46, -19], [-62, -13.5], [-80, -10], [-96, -7], [-108, -3.5], [-124, 0]];

/** La quijada, que va detrás de la cabeza: el cachete redondo, la barbilla y el labio de abajo. */
export const QUIJADA: readonly P[] = [
  [-112, 4], [-92, 5], [-62, 5], [-36, 3], [-16, -2], [-3, 2],
  [5, 12], [3, 25], [-6, 35], [-19, 42], [-33, 43], [-45, 38],
  [-58, 31], [-74, 27], [-90, 26], [-101, 27], [-109, 26], [-114, 21], [-116, 15],
];

function cabeza(): string {
  const sil = curva(CABEZA);
  const rnd = azar(1201);
  const [ox, oy] = CL.ojo.centro;
  const [rx, ry] = CL.ojo.radio;
  const arriba = `M30 -70 L-140 -70 L-140 ${ARISTA[ARISTA.length - 1]![1]} ${ARISTA.slice().reverse().map(([x, y]) => `L${x} ${y}`).join(' ')} L30 -26 Z`;
  // El plano de adelante, arriba de la arista: la caña de la nariz y el marulo, de lleno en la luz.
  const prendida =
    forma(sil, M.media) +
    nube(-70, -14, 40, 4, M.lila, 'm', 0.95) +
    nube(-86, -11.6, 22, 1.8, M.lilaClara, 's', 0.85) +
    nube(-74, -13.6, 10, 0.9, M.brillo, 'xs', 0.5) +
    nube(-104, -7, 6, 1.4, M.brillo, 'xs', 0.7) +
    // El marulo hinchado de gin: la frente abombada, lo más prendido de todo.
    nube(-27, -26, 18, 6, M.lila, 'm', 0.95) +
    nube(-24, -29, 10, 3, M.lilaClara, 's', 0.9) +
    nube(-21, -31, 4, 1.2, M.brillo, 'xs', 0.5) +
    // Abajo de la arista se hunde un poco: el filo del plano.
    trazo(curva(ARISTA, false), M.piel, 1.4, 0.7);
  // El costado de la cara, a media luz: el pómulo, la cresta que baja al hocico, y lo hondo de abajo.
  const costado =
    forma(sil, M.hondo) +
    nube(-50, -8, 46, 12, M.piel, 'l', 0.95) +
    nube(-46, -14, 26, 6, M.media, 'l', 0.55) +
    nube(-14, -8, 12, 9, M.media, 'm', 0.7) +
    nube(-16, -11, 6, 4, M.lila, 's', 0.5) +
    nube(-66, 2, 26, 3.4, M.media, 'm', 0.6) +
    trazo('M-74 3 Q-58 -0.6 -44 2.4 Q-32 4.6 -20 2', M.lila, 1.2, 0.4) +
    nube(-60, 10, 44, 5, M.hondo, 'm', 0.85) +
    nube(-56, 13, 40, 2.6, M.negro, 's', 0.6) +
    nube(-2, 4, 9, 9, M.negro, 'm', 0.55) +
    nube(-104, 2, 9, 7, M.media, 'm', 0.85) +
    nube(-30, 9, 18, 3, M.hondo, 's', 0.6) +
    nube(-106, 10, 8, 3, M.hondo, 's', 0.5) +
    trazo('M-118 12.4 Q-110 15 -100 14 Q-70 14.8 -40 14 Q-20 11 -4 13', M.plata, 0.9, 0.35);
  // El ojo: la cuenca honda debajo del marulo, el borde colorado del gin, el blanco, y la bolsa de abajo.
  const blanco = `M${f(ox - rx)} ${f(oy + 0.8)} Q${f(ox - rx * 0.45)} ${f(oy - ry * 1.2)} ${f(ox + rx * 0.3)} ${f(oy - ry * 1.02)} Q${f(ox + rx)} ${f(oy - ry * 0.5)} ${f(ox + rx)} ${f(oy + 0.2)} Q${f(ox + rx * 0.15)} ${f(oy + ry * 1.08)} ${f(ox - rx)} ${f(oy + 0.8)} Z`;
  const ojo =
    nube(ox + 1, oy - 1, rx + 7, ry + 6.5, M.hondo, 's', 0.95) +
    nube(ox - 1, oy - ry - 4.5, rx + 6, 3.4, M.negro, 's', 0.75) +
    forma(elipse(ox + 0.2, oy + 0.5, rx + 1.6, ry + 1.5), M.pintura, 0.8) +
    nube(ox - rx - 0.5, oy + 1, 2, 2, M.pinturaViva, 'xs', 0.9) +
    `<path d="${blanco}" fill="${M.ojo}"/>` +
    // La sombra del párpado de arriba en el blanco, y las venitas del gin.
    nube(ox, oy - ry * 0.75, rx * 1.05, ry * 0.5, M.media, 'xs', 0.65) +
    trazo(`M${f(ox - rx + 1)} ${f(oy + 0.8)} l2.6 -0.8 l1.4 0.6`, M.pintura, 0.4, 0.6) +
    trazo(`M${f(ox + rx - 1)} ${f(oy + 0.5)} l-2.4 -1 l-1.2 0.6`, M.pintura, 0.4, 0.55) +
    // El pliegue del párpado, pesado, y la bolsa de abajo.
    trazo(`M${f(ox - rx - 1.6)} ${f(oy - 1)} Q${f(ox - rx * 0.2)} ${f(oy - ry - 4.6)} ${f(ox + rx + 1.6)} ${f(oy - ry * 0.55)}`, M.hondo, 1.2, 0.85) +
    nube(ox + 0.5, oy - ry - 5.4, rx * 0.9, 1.3, M.lilaClara, 'xs', 0.6) +
    nube(ox + 1, oy + ry + 3.6, rx + 1.6, 2.6, M.pintura, 's', 0.75) +
    trazo(`M${f(ox - rx)} ${f(oy + ry + 1.4)} Q${f(ox + 1)} ${f(oy + ry + 4.8)} ${f(ox + rx + 2.4)} ${f(oy + ry + 0.6)}`, M.hondo, 1, 0.75) +
    nube(ox + 1.5, oy + ry + 6, rx, 1.3, M.lila, 'xs', 0.5);
  // Las rayas de murga del cachete, como las de la cara del interior: dos rojas y una violeta, que
  // siguen la curva del cachete y cruzan el corte de la luz.
  const raya = (y0: number, x0: number, x1: number, ancho: number, tinta: string, o: number): string =>
    soplo(`M${f(x0)} ${f(y0)} Q${f((x0 + x1) / 2)} ${f(y0 + 3)} ${f(x1)} ${f(y0 + 1)} L${f(x1)} ${f(y0 + 1 + ancho)} Q${f((x0 + x1) / 2)} ${f(y0 + 3 + ancho)} ${f(x0)} ${f(y0 + ancho)} Z`, tinta, 'xs', o);
  const murga =
    raya(1.5, -36, -4, 3.8, M.pinturaViva, 0.95) +
    raya(7.4, -40, -8, 3, M.violeta, 0.9) +
    raya(5.5, -64, -52, 3, M.pinturaViva, 0.8) +
    raya(-11.5, -14, 2, 2.4, M.pintura, 0.7);
  // Los espirales de plata de la frente de la cara del interior, un poco borroneados.
  const espirales =
    trazo(espiral(-33, -19, 4.6), M.plata, 0.9, 0.6) +
    trazo(espiral(-20, -21, 3.6, 2), M.plata, 0.8, 0.5) +
    nube(-27, -20, 12, 6, M.lila, 's', 0.2);
  // El hocico: la ventana de la nariz grande, abierta, con el borde prendido, y el labio de arriba.
  const hocico =
    forma(curva([[-115.5, -1.5], [-110, -4.5], [-104.5, -0.5], [-105.5, 5.5], [-111, 6.5], [-116, 3]]), M.negro, 0.95) +
    nube(-110, 1.5, 3, 2.4, M.hondo, 'xs', 0.9) +
    trazo('M-116.2 -2.2 Q-110 -6.4 -103.4 -0.6', M.lilaClara, 1, 0.75) +
    nube(-103.8, 2, 1.6, 2.8, M.lila, 'xs', 0.6) +
    // La otra ventana, del otro lado, que asoma apenas por arriba de la caña.
    nube(-115.5, -6.4, 2.8, 1.1, M.negro, 'xs', 0.75) +
    // El labio de arriba, carnoso, colgando, y los pelos del bigote.
    nube(-109, 10.4, 9, 2.6, M.media, 's', 0.7) +
    nube(-112, 9.4, 3.4, 1.3, M.lila, 'xs', 0.6) +
    [[-114, 9], [-109, 11], [-104, 12], [-99, 12.4], [-95, 12.4]].map(([x, y], i) => trazo(`M${x} ${y} l${f(-1.6 - i * 0.3)} ${f(3 + i * 0.2)}`, M.lilaClara, 0.4, 0.55)).join('');
  // El canto que agarra los focos: arriba del marulo y de la nuca, oro.
  const cantos =
    trazo('M3 -19 Q-12 -30 -30 -32.8 Q-43 -31.4 -51 -22', M.foco, 1.3, 0.7) +
    nube(-26, -33, 8, 1.3, M.oro, 'xs', 0.55) +
    trazo('M-54 -20.6 Q-80 -14 -105 -8.2', M.foco, 0.8, 0.4);
  // El flequillo mojado, que le cae de entre las orejas sobre la frente, pegado, sin taparle el ojo.
  const flequillo = pelo('m-morta-flequillo', mechonesDe(azar(1213), 3, (i) => [-4 - i * 4.4, -27 + i * 1.2], (_, i) => [-0.92, 0.3 + i * 0.12], [18, 24], [6, 7.6], 0.7), () => 0.85);
  const adentro =
    costado +
    enmascarado('m-morta-cabeza-arriba', arriba, prendida) +
    murga +
    espirales +
    ojo +
    hocico +
    // La boca: la línea donde se juntan los labios, honda.
    trazo('M-118 12.8 Q-106 15 -94 13.6', M.negro, 1.2, 0.85) +
    cantos +
    flequillo +
    manchas(rnd, 28, [-112, -30, 118, 42], (p) => (p[1] < 4 ? 0.7 : 0.15));
  return conRociado(enmascarado('m-morta-cabeza', sil, adentro));
}

/** La quijada: el cachete redondo en la sombra, la barbilla, el labio de abajo, y la plata del piso abajo. */
function quijada(): string {
  const sil = curva(QUIJADA);
  return conRociado(enmascarado('m-morta-quijada', sil,
    forma(sil, M.hondo) +
    // El cachete: redondo, apenas levantado por la luz que se le cuela atrás.
    nube(-22, 18, 18, 13, M.piel, 'l', 0.8) +
    nube(-18, 12, 9, 5, M.media, 'm', 0.45) +
    nube(-70, 16, 30, 6, M.piel, 'm', 0.45) +
    nube(-20, 40, 22, 5, M.negro, 'm', 0.5) +
    // El borde del hueso del cachete, y la barba que cuelga.
    trazo('M-46 33 Q-30 41 -14 35 Q-3 27 -2 13', M.negro, 1.6, 0.5) +
    nube(-107, 19, 8, 5, M.piel, 'm', 0.8) +
    nube(-110, 16.5, 3.6, 1.6, M.media, 'xs', 0.6) +
    // Los dientes de abajo, que asoman cuando la abre.
    [0, 1, 2, 3, 4].map((i) => forma(`M${f(-112 + i * 4.8)} 8.6 l4.2 0 l-0.3 -4 q-1.8 -1.2 -3.6 0 Z`, M.ojo, 0.9)).join('') +
    nube(-100, 8.6, 14, 1.2, M.hondo, 'xs', 0.6) +
    // La plata del piso, que le pega de abajo en la barbilla y el cachete.
    trazo('M-113 24.6 Q-100 28.4 -84 26.4 Q-62 28.8 -44 38.4 Q-30 43.6 -14 40', M.plata, 1.2, 0.5) +
    nube(-30, 43, 12, 1.6, M.plata, 'xs', 0.4)));
}

/** Las orejas, detrás de la cabeza: la de este lado entera y la de allá asomando. */
function orejas(): string {
  const oreja = (bx: number, by: number, dx: number, dy: number, largo: number, ancho: number, cerca: boolean): string => {
    const [ux, uy] = [dx / Math.hypot(dx, dy), dy / Math.hypot(dx, dy)];
    const [nx, ny] = [-uy, ux];
    const p = (t: number, w: number): P => [bx + ux * largo * t + nx * w, by + uy * largo * t + ny * w];
    const sil = curva([p(0, -ancho / 2), p(0.45, -ancho * 0.58), p(0.85, -ancho * 0.25), p(1, 0), p(0.8, ancho * 0.3), p(0.4, ancho * 0.55), p(0, ancho / 2), p(-0.12, 0)]);
    const id = `m-morta-oreja-${cerca ? 1 : 2}`;
    const hueco = curva([p(0.05, -ancho * 0.22), p(0.5, -ancho * 0.28), p(0.86, -ancho * 0.06), p(0.55, ancho * 0.16), p(0.1, ancho * 0.18)]);
    return enmascarado(id, sil,
      forma(sil, M.hondo) +
      nube(...p(0.5, -ancho * 0.3), ancho * 0.35, largo * 0.42, cerca ? M.media : M.piel, 'm', 0.9) +
      forma(hueco, M.negro, cerca ? 0.85 : 0.6) +
      nube(...p(0.55, 0), ancho * 0.12, largo * 0.22, M.violeta, 's', cerca ? 0.45 : 0.2) +
      trazo(curva([p(0.05, -ancho * 0.5), p(0.55, -ancho * 0.6), p(0.98, 0)], false), M.foco, 1.1, cerca ? 0.65 : 0.35) +
      // Los pelos de adentro, que salen del borde.
      [0.3, 0.45, 0.6].map((t) => trazo(`M${f(p(t, ancho * 0.1)[0])} ${f(p(t, ancho * 0.1)[1])} l${f(nx * 3.4)} ${f(ny * 3.4)}`, M.lilaClara, 0.45, 0.55)).join(''));
  };
  return conRociado(oreja(-24, -26, 0.4, -1, 24, 11, false) + oreja(-10, -22, 0.85, -0.8, 32, 14, true));
}

/* ------------------------------------------------------------------
   El pescuezo de caballo, con la crin mojada que le cae sobre el hombro
   ------------------------------------------------------------------ */

export const PESCUEZO: readonly P[] = [
  [-40, -266], [-46, -286], [-48, -306], [-46, -324], [-40, -338], [-28, -352], [-12, -358],
  [4, -352], [16, -338], [26, -318], [33, -298], [37, -278], [32, -266], [0, -260],
];
function pescuezo(): string {
  const sil = curva(PESCUEZO);
  const rnd = azar(1301);
  // La crin: mojada, en mechones, que nace en el canto de atrás y cae para el otro lado, sobre el
  // hombro izquierdo; arriba, contra la nuca, un par de mechones se le vienen para este lado.
  const atras = mechonesDe(rnd, 15, (i) => {
    const t = i / 14;
    return [-8 + t * 42 + (rnd() - 0.5) * 3, -354 + t * 82];
  }, (p) => [0.55 + (p[1] + 354) / 240, 1], [28, 48], [8, 12], 0.7);
  const adelante = mechonesDe(rnd, 3, (i) => [-6 + i * 6, -352 + i * 9], () => [-0.35, 1], [22, 34], [6.5, 8.5], 0.6);
  const crin =
    pelo('m-morta-crin', atras, (p) => Math.max(0.1, 0.7 - (p[1] + 354) / 110), M.lila) +
    pelo('m-morta-crin-adelante', adelante, () => 0.75);
  const adentro =
    forma(sil, M.hondo) +
    nube(-20, -306, 24, 44, M.piel, 'l', 0.95) +
    // La luz de los focos, de arriba a la izquierda: el costado de adelante prendido, el de atrás hundido.
    nube(-32, -316, 12, 36, M.media, 'l', 0.85) +
    nube(-34, -324, 6, 22, M.lila, 'm', 0.85) +
    nube(-38, -318, 2.4, 14, M.lilaClara, 's', 0.6) +
    nube(-20, -288, 12, 20, M.media, 'm', 0.6) +
    nube(18, -304, 18, 50, M.hondo, 'l', 0.95) +
    nube(28, -294, 10, 34, M.negro, 'm', 0.75) +
    // El músculo que baja de la quijada al pecho, y la garganta.
    trazo('M-38 -334 Q-30 -300 -22 -268', M.hondo, 2.6, 0.45) +
    nube(-46, -300, 3, 30, M.hondo, 'm', 0.6) +
    // El canto de la garganta, que agarra los focos.
    trazo('M-47 -292 Q-48.6 -312 -43 -333', M.foco, 1, 0.45) +
    // Abajo, donde se junta con los hombros de tipo: se hunde.
    nube(-4, -263, 36, 6, M.negro, 'm', 0.6) +
    manchas(rnd, 14, [-44, -350, 74, 86], (p) => (p[0] < -8 ? 0.6 : 0.1));
  return conRociado(enmascarado('m-morta-pescuezo', sil, adentro) + crin);
}

/* ------------------------------------------------------------------
   El torso de tipo: la panza, el pecho con pelos y la cadenita de oro
   ------------------------------------------------------------------ */

export const TORSO: readonly P[] = [
  [-36, -270], [-50, -270], [-59, -262], [-59, -248], [-53, -236], [-50, -222], [-48, -208],
  [-51, -196], [-50, -186], [-42, -179], [-26, -175], [-8, -173.5], [10, -174], [28, -177], [44, -182],
  [51, -192], [49, -206], [47, -222], [51, -236], [57, -250], [58, -262], [50, -268], [36, -268], [0, -264],
];
/** El corte de la luz en el torso: baja a la derecha del esternón y rodea la panza por abajo. */
const CORTE_TORSO: readonly P[] = [[16, -280], [12, -256], [8, -236], [16, -220], [24, -204], [18, -186], [-6, -180], [-40, -183], [-70, -186]];

function torso(): string {
  const sil = curva(TORSO);
  const rnd = azar(1401);
  const luz = `M-80 -290 L${CORTE_TORSO.map(([x, y]) => `${x} ${y}`).join(' L')} L-80 -170 Z`;
  // Los pelos del pecho, ralos y enrulados, y el caminito que baja del ombligo al toallón.
  let pelos = '';
  for (let i = 0; i < 30; i++) {
    const enCamino = i > 21;
    const [x, y] = enCamino ? [-3 + (rnd() - 0.5) * 6, -194 + rnd() * 16] : [(rnd() - 0.5) * 30, -252 + rnd() * 24];
    pelos += trazo(`M${f(x)} ${f(y)} q${f(1.5 + rnd())} ${f(-1 - rnd())} ${f(2 + rnd() * 1.5)} ${f(1 + rnd())}`, M.negro, 0.75, 0.6);
  }
  // La cadenita de oro con la medalla: un Momo chiquito, de plata, como el del medio del templo.
  let cadena = '';
  for (let k = 0; k <= 26; k++) {
    const t = k / 26;
    const [x, y] = [-26 + t * 52, -258 + Math.sin(t * Math.PI) * 27];
    cadena += nube(x, y, 1.3, 1, k < 15 ? M.oro : M.foco, 'xs', k < 15 ? 0.95 : 0.6) + (k % 2 && k < 16 ? nube(x - 0.3, y - 0.4, 0.5, 0.4, M.brillo, 'xs', 0.7) : '');
  }
  const medalla =
    nube(1.5, -222, 6, 5, M.negro, 's', 0.6) +
    forma(elipse(0, -225, 6, 6.2), M.metal) +
    nube(-1.6, -226.6, 4, 4, M.plata, 'xs', 0.85) +
    // La cara de Momo, apenas: el ceño y la boca del medallón.
    trazo('M-3 -227 Q0 -229 3 -227 M-2.4 -222.6 Q0 -221.2 2.4 -222.6', M.metalHondo, 0.7, 0.8) +
    nube(-0.8, -225, 0.6, 1.4, M.metalHondo, 'xs', 0.7) +
    nube(2.4, -222, 2.4, 3, M.metalHondo, 'xs', 0.55) +
    nube(-2.6, -228.4, 1, 0.8, M.brillo, 'xs', 0.95) +
    trazo('M0 -232 L0 -231.2', M.oro, 1.4, 0.9);
  const prendida =
    forma(sil, M.piel) +
    nube(0, -230, 30, 50, M.hondo, 'l', 0.6) +
    // Lo que agarra la luz de arriba: el hombro, el pecho de este lado, el lomo de la panza.
    nube(-32, -251, 18, 13, M.media, 'l', 0.9) +
    nube(-40, -257, 13, 7, M.lila, 'm', 0.95) +
    nube(-50, -263, 7, 3.6, M.lilaClara, 's', 0.9) +
    nube(-53, -264.6, 3, 1.4, M.brillo, 'xs', 0.5) +
    nube(-26, -246, 7, 4, M.lila, 's', 0.6) +
    nube(-12, -206, 26, 16, M.media, 'l', 0.9) +
    nube(-18, -214, 13, 6.4, M.lila, 'm', 0.85) +
    nube(-22, -216.4, 6, 2.6, M.lilaClara, 's', 0.8) +
    nube(-24, -217, 2.4, 1, M.brillo, 'xs', 0.45) +
    // Los pectorales caídos: la sombra de abajo de cada uno.
    soplo('M-42 -236 Q-24 -229 -6 -236 Q-24 -226 -42 -231 Z', M.hondo, 's', 0.85) +
    nube(-22, -244, 14, 6, M.media, 'm', 0.6);
  const adentro =
    forma(sil, M.hondo) +
    enmascarado('m-morta-torso-luz', luz, prendida) +
    // Del otro lado del corte, hundido: apenas el pectoral y la panza en lo violeta, y el costado negro.
    nube(46, -226, 10, 40, M.negro, 'l', 0.7) +
    nube(28, -244, 14, 7, M.piel, 'm', 0.55) +
    nube(34, -208, 10, 14, M.piel, 'm', 0.35) +
    // El canto de la derecha agarra los focos de ese lado: un hilo de oro en el hombro.
    trazo('M38 -267 Q52 -267 57.6 -258', M.foco, 1.3, 0.55) +
    // Los pezones, el esternón y las costillas, apenas.
    forma(elipse(-22, -235, 2.2, 1.7), M.violeta, 0.85) +
    forma(elipse(24, -235, 2, 1.6), M.violeta, 0.45) +
    nube(2, -244, 2.2, 14, M.hondo, 's', 0.6) +
    [0, 1, 2].map((i) => trazo(`M${-47 + i} ${-224 + i * 7} q8 2 14 -1`, M.hondo, 1, 0.35)).join('') +
    // El ombligo, y lo de abajo de la panza, que cuelga sobre el toallón.
    forma(elipse(-4, -197, 1.9, 2.6), M.negro, 0.9) +
    nube(-4.8, -199.6, 1.5, 0.8, M.lilaClara, 'xs', 0.55) +
    nube(8, -181, 44, 6, M.negro, 'm', 0.75) +
    // Las clavículas.
    trazo('M-42 -262 Q-25 -257 -10 -261', M.lilaClara, 1.2, 0.5) +
    trazo('M10 -261 Q24 -258 40 -262', M.lila, 1, 0.25) +
    // La plata del piso, que le sube por abajo de la panza.
    trazo('M-44 -180 Q-24 -174 -4 -173.6 Q18 -174 40 -181', M.plata, 1.2, 0.45) +
    pelos +
    manchas(rnd, 30, [-56, -270, 112, 96], (p) => (p[0] < 10 ? 0.65 : 0.1)) +
    cadena +
    medalla;
  // La sombra que la panza tira en el toallón: afuera de la silueta, soplada.
  const sombra = nube(4, -171, 48, 5, M.negro, 'm', 0.65);
  return conRociado(sombra + enmascarado('m-morta-torso', sil, adentro));
}

/* ------------------------------------------------------------------
   El toallón: plata del medallón, de rizo, con la franja roja y el nudo
   ------------------------------------------------------------------ */

export const TOALLON: readonly P[] = [
  [-53, -199], [-26, -203.5], [0, -204.5], [26, -203.5], [53, -199],
  [56, -184], [57, -160], [58, -130], [59.5, -104],
  [50, -99], [36, -101.5], [23, -98.5], [12, -100.5], [0, -100], [-14, -98.5], [-30, -100.5], [-46, -98.5], [-57, -101.5],
  [-56, -130], [-55, -160], [-54, -184],
];

/** El canto de la solapa, que baja del nudo al ruedo: de un lado la tela de arriba, del otro la de abajo. */
const SOLAPA: readonly P[] = [[33, -186], [28, -160], [21, -130], [14, -106], [12, -100]];

function toallon(): string {
  const sil = curva(TOALLON);
  const rnd = azar(1501);
  // El rizo: lazos chiquitos, cada uno corrido un poco, que el grano desparejo.
  let rizo = '';
  for (let y = -202; y < -100; y += 2.4) {
    for (let x = -58 + ((y / 2.4) % 2 ? 1.2 : 0); x < 60; x += 2.4) {
      if (rnd() < 0.55) continue;
      rizo += `M${f(x + rnd() * 0.8)} ${f(y + rnd() * 0.8)} h0.9 `;
    }
  }
  // Los pliegues que caen de la cintura: sombras largas y el lomo de cada uno prendido.
  let pliegues = '';
  for (const [x, o] of [[-46, 0.7], [-33, 0.55], [-19, 0.6], [-4, 0.45], [44, 0.75], [52, 0.5]] as const) {
    const dx = (rnd() - 0.5) * 5;
    pliegues += soplo(`M${x} -196 Q${f(x + dx)} -150 ${f(x + dx * 1.5 + 1)} -101 L${f(x + dx * 1.5 + 4.4)} -101 Q${f(x + dx + 3.4)} -150 ${x + 2.4} -196 Z`, M.metalHondo, 's', o);
    pliegues += nube(x - 4 + dx, -150, 2.4, 42, M.plata, 's', o * 0.75);
  }
  // La franja tejida cerca del ruedo: roja como la pintura de murga, y corrida en la solapa.
  const franja = (dy: number, alto: number, tinta: string, o: number): string =>
    forma(`M-62 ${-116 + dy} Q-24 ${-118.6 + dy} 14 ${-116 + dy} L14 ${-116 + dy + alto} Q-24 ${-118.6 + dy + alto} -62 ${-116 + dy + alto} Z`, tinta, o) +
    forma(`M14 ${-113.4 + dy} Q36 ${-114.4 + dy} 62 ${-111.8 + dy} L62 ${-111.8 + dy + alto} Q36 ${-114.4 + dy + alto} 14 ${-113.4 + dy + alto} Z`, tinta, o * 0.7);
  const solapa = curva(SOLAPA, false);
  const adentro =
    forma(sil, M.metal) +
    // La luz de los focos, de arriba a la izquierda: plata de ese lado, peltre del otro, y lo hondo atrás.
    nube(-30, -158, 30, 58, M.plata, 'l', 0.75) +
    nube(-44, -186, 10, 10, M.plata, 'm', 0.6) +
    nube(40, -150, 22, 62, M.peltre, 'l', 0.95) +
    nube(56, -150, 6, 52, M.metalHondo, 'm', 0.9) +
    nube(0, -108, 60, 8, M.peltre, 'm', 0.5) +
    pliegues +
    // La tela de abajo, del otro lado de la solapa, en la sombra de la de arriba.
    soplo(`M${SOLAPA.map(([x, y]) => `${x + 1} ${y}`).join(' L')} L20 -100 L28 -112 L36 -150 L40 -186 Z`, M.metalHondo, 's', 0.8) +
    // El tajo de abajo, donde la solapa se abre: lo oscuro de adentro, de donde sale el aceite.
    soplo('M7 -100 L13 -124 Q15.4 -110 23 -100 Z', M.negro, 'xs', 0.95) +
    franja(0, 4.4, M.pinturaViva, 0.9) +
    franja(7, 1.8, M.pintura, 0.85) +
    franja(-4, 0.9, M.plata, 0.7) +
    // El rizo, que agarra la luz apenas.
    `<path d="${rizo}" stroke="${M.plata}" stroke-width="0.8" stroke-linecap="round" opacity="0.28"/>` +
    // El canto de la solapa: el doblez prendido, y su sombra.
    pasada(solapa, M.plata, 2.4, 'xs', 0.7) +
    `<g transform="translate(2.4 0.6)">${pasada(solapa, M.negro, 2, 'xs', 0.45)}</g>` +
    // El rollo de arriba, donde está metido: prendido por los focos, y la sombra debajo.
    nube(-8, -201, 56, 3.4, M.plata, 's', 0.9) +
    trazo('M-52 -199.6 Q-20 -204.8 10 -204.2 Q34 -203.2 52 -199.2', M.foco, 1.1, 0.55) +
    nube(0, -194.4, 56, 2.4, M.metalHondo, 's', 0.7) +
    // El nudo: la tela retorcida en la cadera, con sus pliegues.
    nube(33, -186, 9, 7, M.plata, 's', 0.9) +
    trazo('M25 -191 Q33 -184 41 -190 M26 -183 Q34 -178.6 40 -183', M.metalHondo, 1.3, 0.85) +
    // El ruedo: el dobladillo, y la plata del piso que le pega abajo.
    trazo('M-57 -102 Q-30 -99 0 -100.4 Q30 -98.4 59 -104', M.metalHondo, 2.2, 0.7) +
    nube(-10, -100.6, 50, 1.8, M.plata, 's', 0.6) +
    manchas(rnd, 22, [-56, -200, 112, 100], () => 0.5, M.plata, M.metalHondo);
  return conGrano(enmascarado('m-morta-toallon', sil, adentro));
}

/* ------------------------------------------------------------------
   Los brazos: de tipo, dibujados derechos para abajo desde el hombro
   ------------------------------------------------------------------ */

const L = A.largos;

/** Un tramo del brazo, partido por la luz a lo largo: la 1 de afuera prendida, la 2 casi toda hundida. */
function tramo(eje: readonly P[], anchos: readonly number[], luz: boolean, semilla: number, id: string): string {
  const d = tubo(eje, anchos);
  const rnd = azar(semilla);
  const [a, b] = [eje[0]!, eje[eje.length - 1]!];
  const [mx, my] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const largo = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const w = Math.max(...anchos);
  // El corte: a lo largo, corrido para el lado de la sombra.
  const corte = luz ? w * 0.18 : -w * 0.22;
  const ladoLuz = `M${f(mx - w * 2)} ${f(a[1] - 10)} L${f(mx + corte)} ${f(a[1] - 10)} L${f(mx + corte - 1.5)} ${f(b[1] + 10)} L${f(mx - w * 2)} ${f(b[1] + 10)} Z`;
  return enmascarado(id, d,
    forma(d, M.hondo) +
    enmascarado(`${id}-luz`, ladoLuz,
      forma(d, M.piel) +
      nube(mx - w * 0.2, my, w * 0.3, largo * 0.46, M.media, 'm', luz ? 0.95 : 0.6) +
      (luz ? nube(mx - w * 0.3, my - largo * 0.1, w * 0.12, largo * 0.36, M.lila, 's', 0.85) + nube(mx - w * 0.3, my - largo * 0.18, w * 0.05, largo * 0.2, M.lilaClara, 'xs', 0.6) : '')) +
    nube(mx + w * 0.42, my, w * 0.14, largo * 0.45, M.negro, 's', luz ? 0.4 : 0.6) +
    nube(a[0], a[1] + 3, w * 0.5, 3, M.negro, 's', 0.45) +
    manchas(rnd, 6, [mx - w / 2, Math.min(a[1], b[1]), w, largo], () => (luz ? 0.6 : 0.2)));
}

/**
 * El codo: una bola en el pivote, en las dos piezas, así el brazo y el antebrazo giran uno contra el
 * otro sin que se vea la costura.
 */
function codoRedondo(x: number, y: number, r: number, luz: boolean, id: string): string {
  const d = elipse(x, y, r, r);
  return enmascarado(id, d,
    forma(d, M.hondo) +
    nube(x - r * 0.4, y - r * 0.1, r * 0.6, r * 0.9, M.piel, 's', luz ? 0.95 : 0.6) +
    (luz ? nube(x - r * 0.55, y - r * 0.2, r * 0.25, r * 0.5, M.media, 'xs', 0.7) : ''));
}

/** El brazo, del hombro al codo, con el hombro redondo arriba que agarra los focos. */
function brazo(n: 0 | 1): string {
  const [sx, sy] = A.hombros[n];
  const luz = n === 0;
  return conRociado(
    codoRedondo(sx, sy + L.brazo, 8.4, luz, `m-morta-codo-${n + 1}`) +
    tramo([[sx, sy - 6], [sx, sy + L.brazo * 0.5], [sx, sy + L.brazo + 2]], [25, 21, 16.5], luz, 1601 + n, `m-morta-brazo-${n + 1}`) +
    nube(sx - (luz ? 4 : -2), sy - 4, 8, 4, luz ? M.lila : M.media, 's', luz ? 0.75 : 0.45) +
    trazo(`M${sx - 10} ${sy - 7} Q${sx} ${sy - 11} ${sx + 10} ${sy - 7}`, M.foco, 1.1, luz ? 0.45 : 0.3),
  );
}

/** El antebrazo con la mano: la 1 cuelga floja, abierta; la 2 es un puño que agarra el nudo del toallón. */
function antebrazo(n: 0 | 1): string {
  const [sx, sy] = A.hombros[n];
  const codo: P = [sx, sy + L.brazo];
  const muneca: P = [sx, codo[1] + L.antebrazo - 11];
  const luz = n === 0;
  const brazoD =
    codoRedondo(codo[0], codo[1], 8.2, luz, `m-morta-codo-ante-${n + 1}`) +
    tramo([[codo[0], codo[1] + 1], [codo[0], codo[1] + L.antebrazo * 0.45], [muneca[0], muneca[1] + 1]], [16.6, 15.5, 11.5], luz, 1611 + n, `m-morta-antebrazo-${n + 1}`);
  const [mx, my] = [sx, codo[1] + L.antebrazo];
  let mano: string;
  if (n === 0) {
    // La mano floja, colgando: la palma para el muslo, los dedos que se doblan un poco.
    const palma = curva([[mx - 6, my - 10], [mx + 6, my - 10], [mx + 7.2, my - 1], [mx + 6, my + 6], [mx + 2, my + 11], [mx - 3, my + 11.5], [mx - 7, my + 7], [mx - 7.4, my - 2]]);
    const pulgar = curva([[mx - 6, my - 6], [mx - 10, my - 1], [mx - 10.6, my + 4], [mx - 8.4, my + 5.2], [mx - 6.6, my + 1]]);
    mano = enmascarado('m-morta-mano-1', [palma, pulgar],
      forma(palma, M.hondo) + forma(pulgar, M.piel) +
      nube(mx - 3, my - 2, 5, 9, M.media, 's', 0.9) +
      nube(mx - 4, my - 4, 2.6, 5, M.lila, 's', 0.6) +
      nube(mx + 5, my + 2, 3, 8, M.negro, 's', 0.6) +
      [-3, 0, 3].map((dx) => trazo(`M${f(mx + dx)} ${f(my + 3)} L${f(mx + dx * 1.15)} ${f(my + 11)}`, M.negro, 0.8, 0.6)).join('') +
      nube(mx, my + 11, 6, 1.4, M.plata, 'xs', 0.4) +
      nube(mx - 9, my + 1, 1.4, 3, M.lila, 'xs', 0.6));
  } else {
    // El puño cerrado sobre el nudo: los nudillos para afuera, el pulgar encima.
    const dorso = curva([[mx - 8, my - 7], [mx + 7, my - 8], [mx + 9, my], [mx + 7.6, my + 7], [mx, my + 9], [mx - 7.6, my + 7], [mx - 9, my]]);
    mano = enmascarado('m-morta-mano-2', dorso,
      forma(dorso, M.hondo) +
      nube(mx - 3, my - 2, 6, 6, M.piel, 's', 0.9) +
      nube(mx - 4, my - 4, 3, 2.4, M.media, 's', 0.7) +
      [-4.5, -1.5, 1.5, 4.5].map((dx) => nube(mx + dx, my + 5.8, 1.4, 1.2, M.lila, 'xs', 0.6)).join('') +
      [-3, 0, 3].map((dx) => trazo(`M${f(mx + dx)} ${f(my + 3)} L${f(mx + dx)} ${f(my + 8.6)}`, M.negro, 0.8, 0.7)).join('') +
      trazo(`M${f(mx - 8)} ${f(my - 1)} Q${f(mx - 2)} ${f(my + 1)} ${f(mx + 3)} ${f(my - 2)}`, M.negro, 1.1, 0.6));
  }
  return conRociado(brazoD + mano);
}

/* ------------------------------------------------------------------
   Las patas de caballo, con las pezuñas, y la cola
   ------------------------------------------------------------------ */

/** La pata: la caña flaca, el menudillo con sus cerdas, la cuartilla y la pezuña, dibujada para abajo. */
function pata(n: 0 | 1): string {
  const [cx, cy] = A.caderas[n];
  const luz = n === 0;
  const rnd = azar(1701 + n);
  const lado = luz ? -1 : 1;
  // El corvejón asoma apenas debajo del ruedo, y de ahí baja la caña, flaca y chata.
  const cana = tubo([[cx, cy], [cx, -94], [cx + lado * 0.6, -72], [cx + lado * 0.8, -36]], [19, 21, 14.5, 13.5], 16, 0.3);
  const menudillo = elipse(cx + lado * 0.8, -31, 10.5, 9);
  const cuartilla = tubo([[cx + lado * 0.8, -30], [cx + lado * 1.4, -16]], [15, 16.5], 6, 0.2);
  const corte = `M${f(cx - 30)} ${cy - 10} L${f(cx + (luz ? 3 : -2))} ${cy - 10} L${f(cx + (luz ? 2 : -3))} 4 L${f(cx - 30)} 4 Z`;
  const hueso =
    forma(cana, M.hondo) + forma(menudillo, M.hondo) + forma(cuartilla, M.hondo) +
    enmascarado(`m-morta-pata-luz-${n + 1}`, corte,
      forma(cana, M.piel) + forma(menudillo, M.piel) + forma(cuartilla, M.piel) +
      nube(cx - 3, -80, 4, 40, M.media, 'm', luz ? 0.95 : 0.6) +
      (luz ? nube(cx - 6, -78, 1.6, 34, M.lila, 's', 0.85) + nube(cx - 6.4, -84, 0.8, 18, M.lilaClara, 'xs', 0.6) : nube(cx - 5, -78, 1.2, 30, M.lila, 's', 0.45)) +
      nube(cx - 4, -32, 5, 5, M.media, 's', 0.8) +
      nube(cx - 5, -33, 2, 2.4, M.lila, 'xs', 0.6)) +
    // El tendón de atrás, y el nudo del menudillo.
    trazo(`M${f(cx - lado * 3.4)} -98 L${f(cx - lado * 4)} -42`, M.negro, 1.3, 0.45) +
    // La plata del piso, que sube por la cuartilla.
    nube(cx, -18, 6, 3, M.peltre, 's', 0.35);
  // Las cerdas del menudillo: pelo largo y mojado que le tapa el casco por arriba, en mechones.
  const cerdas = pelo(`m-morta-cerdas-${n + 1}`, mechonesDe(rnd, 6, (i) => [cx - 8 + i * 3.2 + (rnd() - 0.5) * 2, -40 + rnd() * 4], (p) => [(p[0] - cx) * 0.045, 1], [22, 30], [6.4, 8.4], 0.6), () => (luz ? 0.7 : 0.25));
  const casco = curva([[cx - 10.5, -16], [cx + 10.5, -16], [cx + 13.6, -7], [cx + 15, -1], [cx + 10, 0.8], [cx - 10, 0.8], [cx - 15, -1], [cx - 13.6, -7]]);
  const cascoD = enmascarado(`m-morta-casco-${n + 1}`, casco,
    forma(casco, M.negro) +
    nube(cx - lado * -2, -9, 6, 7, M.peltre, 's', luz ? 0.5 : 0.25) +
    nube(cx - 5, -10, 2.6, 5, M.metal, 's', luz ? 0.45 : 0.15) +
    // Las vetas del vaso, y el canto de abajo, que agarra la plata del piso.
    [-7, -3, 1, 5, 9].map((dx) => trazo(`M${f(cx + dx)} -14 L${f(cx + dx * 1.3)} -1`, M.peltre, 0.5, 0.4)).join('') +
    trazo(`M${f(cx - 13)} -0.6 Q${cx} 1.6 ${f(cx + 13)} -0.6`, M.plata, 1.8, 0.75) +
    nube(cx - 6, -13, 2.4, 1.2, M.foco, 'xs', 0.45));
  return conRociado(
    // La sombra de la pezuña en el piso, que la pega.
    nube(cx + 3, 1.6, 17, 2.6, M.negro, 's', 0.75) +
    enmascarado(`m-morta-pata-${n + 1}`, [cana, menudillo, cuartilla], hueso) +
    cascoD +
    cerdas,
  );
}

/** La cola de caballo: asoma por debajo del toallón, atrás, y cae mojada hasta cerca del piso. */
function cola(): string {
  const rnd = azar(1801);
  const [dx, dy] = A.cola;
  const mechones = mechonesDe(rnd, 7, (i) => [dx + 4 + i * 2.4, dy + 34 + i * 1.5], (_, i) => [0.2 + i * 0.018, 1], [96, 120], [13, 17], 0.4);
  return conRociado(
    nube(dx + 12, -110, 14, 10, M.negro, 'm', 0.8) +
    pelo('m-morta-cola', mechones, (p) => Math.max(0, 0.5 - (p[0] - dx) / 40), M.lila),
  );
}

/* ------------------------------------------------------------------
   La mancha de aceite en el piso: negro, con el brillo de plata y el tornasol
   ------------------------------------------------------------------ */

function manchaDeAceite(): string {
  const rnd = azar(1901);
  const borde: P[] = [];
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const r = 1 + (rnd() - 0.5) * 0.3;
    borde.push([Math.cos(a) * (MANCHA.ancho / 2) * r, Math.sin(a) * (MANCHA.alto / 2) * r]);
  }
  const sil = curva(borde);
  const gotitas = [[-50, 2, 2.4], [-46, -4, 1.4], [46, 3, 1.8], [52, -1, 1.2], [-30, 7.5, 1.6], [24, -7, 1.3]]
    .map(([x, y, r]) => forma(elipse(x!, y!, r! * 1.4, r! * 0.6), M.negro, 0.95) + nube(x! - 0.4, y! - 0.2, r! * 0.6, r! * 0.2, M.plata, 'xs', 0.6)).join('');
  return (
    nube(0, 0, MANCHA.ancho / 2 + 4, MANCHA.alto / 2 + 2, M.negro, 's', 0.5) +
    enmascarado('m-morta-mancha', sil,
      forma(sil, M.negro) +
      // El tornasol del aceite: violeta y oro de los focos, en anillos corridos.
      nube(-10, -1, 22, 3, M.violeta, 's', 0.5) +
      nube(14, 1, 16, 2.2, M.foco, 's', 0.25) +
      nube(-24, 2, 10, 1.6, M.lila, 's', 0.35) +
      // Los focos de la guirnalda reflejados, y la plata del borde que da a la luz.
      [[-16, -2], [-2, -3], [12, -2.4], [24, -1]].map(([x, y]) => nube(x!, y!, 2.2, 0.7, M.oro, 'xs', 0.75)).join('') +
      trazo(`M${-MANCHA.ancho / 2 + 4} -1 Q-10 ${-MANCHA.alto / 2 - 0.5} ${MANCHA.ancho / 2 - 6} -2.4`, M.plata, 1, 0.6)) +
    gotitas
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

/** La densidad: la ficha lo muestra de cerca; en la escena va a poco más de la mitad. */
const D = 3.2;
const Q = 90;

const cajaBrazo = (n: 0 | 1): readonly [number, number, number, number] => [A.hombros[n][0] - 15, A.hombros[n][1] - 14, 30, L.brazo + 26];
const cajaAntebrazo = (n: 0 | 1): readonly [number, number, number, number] => [A.hombros[n][0] - 14, A.hombros[n][1] + L.brazo - 10, 28, L.antebrazo + 26];

export const PIEZAS_MORTA: readonly Pieza[] = [
  { nombre: 'morta-cola', caja: [A.cola[0] - 14, A.cola[1] - 6, 76, 150], dibujo: cola(), densidad: D, calidad: Q },
  { nombre: 'morta-pata-1', caja: [A.caderas[0][0] - 22, A.caderas[0][1] - 4, 44, 128], dibujo: pata(0), densidad: D, calidad: Q },
  { nombre: 'morta-pata-2', caja: [A.caderas[1][0] - 22, A.caderas[1][1] - 4, 44, 128], dibujo: pata(1), densidad: D, calidad: Q },
  { nombre: 'morta-toallon', caja: [-62, -208, 124, 112], dibujo: toallon(), densidad: D, calidad: Q },
  { nombre: 'morta-torso', caja: [-62, -274, 124, 110], dibujo: torso(), densidad: D, calidad: Q },
  { nombre: 'morta-brazo-1', caja: cajaBrazo(0), dibujo: brazo(0), densidad: D, calidad: Q },
  { nombre: 'morta-antebrazo-1', caja: cajaAntebrazo(0), dibujo: antebrazo(0), densidad: D, calidad: Q },
  { nombre: 'morta-brazo-2', caja: cajaBrazo(1), dibujo: brazo(1), densidad: D, calidad: Q },
  { nombre: 'morta-antebrazo-2', caja: cajaAntebrazo(1), dibujo: antebrazo(1), densidad: D, calidad: Q },
  { nombre: 'morta-pescuezo', caja: [-52, -364, 112, 122], dibujo: pescuezo(), densidad: D, calidad: Q },
  { nombre: 'morta-orejas', caja: [-34, -62, 46, 46], dibujo: orejas(), densidad: D * 1.2, calidad: Q },
  { nombre: 'morta-quijada', caja: [-120, -4, 130, 52], dibujo: quijada(), densidad: D * 1.2, calidad: Q },
  { nombre: 'morta-cabeza', caja: [-126, -38, 142, 56], dibujo: cabeza(), densidad: D * 1.3, calidad: Q },
  { nombre: 'morta-mancha', caja: [-MANCHA.ancho / 2 - 18, -MANCHA.alto / 2 - 8, MANCHA.ancho + 36, MANCHA.alto + 16], dibujo: manchaDeAceite(), densidad: 3, calidad: Q },
];

const img = imagenesDe(PIEZAS_MORTA);
const parte = (nombre: string, cuerpo: string, transform = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}>${cuerpo}</g>`;

/** El ojo de la página: la pupila que mira y el párpado que baja, pesado de gin. Va adentro de la cabeza. */
function ojo(t: Readonly<Record<string, string>>): string {
  const [cx, cy] = CL.ojo.centro;
  const [rx, ry] = CL.ojo.radio;
  const [px, py] = PIVOTE_PARPADO;
  const ri = ry * 0.9;
  return (
    // La pupila se recorta en el blanco: mire adonde mire, no se sale del ojo.
    `<clipPath id="m-morta-blanco"><ellipse cx="${cx}" cy="${f(cy + 0.3)}" rx="${rx}" ry="${f(ry + 0.2)}"/></clipPath>` +
    `<g clip-path="url(#m-morta-blanco)"><g data-parte="pupila" transform="${t.pupila}">` +
    `<circle cx="${cx}" cy="${cy}" r="${f(ri)}" class="bt-morta-iris"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${f(ri * 0.5)}" class="bt-morta-pupila"/>` +
    `<circle cx="${f(cx - ri * 0.35)}" cy="${f(cy - ri * 0.38)}" r="${f(ri * 0.22)}" class="bt-morta-brillo"/></g></g>` +
    `<g data-parte="parpado" data-pivote="${px} ${py}" transform="${t.parpado}">` +
    `<ellipse cx="${cx}" cy="${f(cy - 0.2)}" rx="${f(rx + 1.4)}" ry="${f(ry + 1.1)}" class="bt-morta-parpado"/>` +
    `<path d="M${f(cx - rx - 1)} ${f(cy - 0.2)} Q${cx} ${f(cy - 0.2 + 2 * (ry + 1.1))} ${f(cx + rx + 1.2)} ${f(cy - 0.2)}" class="bt-morta-pestana"/></g>`
  );
}

/**
 * Lo de adentro de la boca, que se ve cuando relincha: lo hondo, la lengua y los dientes de arriba, de
 * caballo. Es tinta de la página. Lo hondo gira con la mitad de lo que gira la quijada, así llena la
 * abertura; cerrada, la tapan la cabeza arriba y la quijada abajo.
 */
function boca(t: Readonly<Record<string, string>>): string {
  const hueco = 'M-118 -6 L-20 -6 L-14 6 Q-40 18 -70 22 Q-100 24 -118 20 Z';
  const dientes = [0, 1, 2, 3, 4, 5].map((i) => {
    const x = -115 + i * 5.2;
    return `M${f(x)} ${f(12.6 - i * 0.2)} l4.6 0 l-0.4 ${f(4.6 - i * 0.3)} q-1.9 1.3 -3.8 0 Z`;
  }).join(' ');
  return (
    `<g data-parte="boca" transform="${t.boca}"><path d="${hueco}" class="bt-morta-boca"/>` +
    `<path d="M-110 16 Q-92 11 -66 15 Q-88 21 -110 20 Z" class="bt-morta-lengua"/></g>` +
    `<path d="${dientes}" class="bt-morta-dientes"/>`
  );
}

/** El Morta armado con las transformaciones de una pose (`transformes`, `rig-morta.ts`). */
function armado(p: Pose, chorro = 0): string {
  const t = transformes(p);
  const brazoCon = (n: 0 | 1): string => parte(`brazo-${n + 1}`, img(`morta-brazo-${n + 1}`) + parte(`antebrazo-${n + 1}`, img(`morta-antebrazo-${n + 1}`), t[`antebrazo-${n + 1}`]), t[`brazo-${n + 1}`]);
  const cabezaD = parte('cabeza',
    parte('orejas', img('morta-orejas'), t.orejas) +
    boca(t) +
    parte('quijada', img('morta-quijada'), t.quijada) +
    img('morta-cabeza') +
    ojo(t),
    t.cabeza);
  return (
    parte('cuerpo',
      parte('cola', img('morta-cola'), t.cola) +
      parte('pata-1', img('morta-pata-1'), t['pata-1']) +
      parte('pata-2', img('morta-pata-2'), t['pata-2']) +
      parte('toallon', img('morta-toallon'), t.toallon) +
      parte('torso',
        img('morta-torso') +
        brazoCon(0) +
        brazoCon(1) +
        parte('pescuezo', img('morta-pescuezo') + cabezaD, t.pescuezo),
        t.torso),
      t.cuerpo) +
    // El chorro y la gota van afuera del cuerpo: caen derecho al piso, aunque él se escore.
    `<path data-parte="chorro" d="${caminoDelChorro(chorro, p)}" class="bt-morta-chorro" opacity="${chorro > 0 ? 1 : 0}"/>` +
    `<path data-parte="chorro-brillo" d="${caminoDelChorro(chorro, p, true)}" class="bt-morta-chorro-brillo" opacity="${chorro > 0 ? 1 : 0}"/>` +
    `<g data-parte="gota" transform="${gota(p, 0.55, 0)}" opacity="1"><path d="M0 -2.6 Q1.9 0.4 1.9 1.6 A1.9 1.9 0 1 1 -1.9 1.6 Q-1.9 0.4 0 -2.6 Z" class="bt-morta-aceite"/>` +
    `<ellipse cx="-0.6" cy="1.2" rx="0.5" ry="0.8" class="bt-morta-reflejo"/></g>`
  );
}

/** Las poses para mirarlo y para el test: las dos quietas y el relincho con el chorro en el aire. */
export const POSES_DE_MIRAR: Readonly<Record<string, { pose: Pose; chorro: number }>> = {
  'de-pie': { pose: POSES['de-pie'], chorro: 0 },
  relincha: { pose: POSES.relincha, chorro: 0.45 },
  'a-medias': { pose: entre(POSES['de-pie'], POSES.relincha, 0.5), chorro: 0.2 },
};

/** El Morta en una pose, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function mortaEn(cual: string | Pose = 'de-pie', chorro = 0): string {
  const { pose, chorro: c } = typeof cual === 'string' ? POSES_DE_MIRAR[cual]! : { pose: cual, chorro };
  return `<g transform="${transformes(pose).entero}">${armado(pose, c)}</g>`;
}

/** El títere que se toca, en la pose quieta: de pie apenas, escorado a estribor, con la gota que se forma. */
function titere(nombres: ReadonlyMap<string, string>): string {
  const p = POSES['de-pie'];
  return (
    `<g class="titere titere--morta" data-id="el-morta" role="button" tabindex="0" aria-label="${nombres.get('el-morta') ?? 'El Morta'}">` +
    `<g data-parte="entero" transform="${transformes(p).entero}">${armado(p)}</g>` +
    `</g>`
  );
}

/** La mancha en el piso, atrás de todo lo que se para: la isla la agranda con lo que cae. */
function atras(): string {
  return `<g class="morta-mancha" pointer-events="none"><g data-parte="mancha" transform="${mancha(1)}">${img('morta-mancha')}</g></g>`;
}

/**
 * El retrato de la ficha: relinchando, con la boca abierta del grito del interior del disco y el chorro
 * de aceite en el aire, sobre su pedazo de templo (la capa de atrás del recinto, que la página ya cargó).
 */
export const RETRATO = { caja: [LUGAR.x - 100, 336, 184, 262] as const };
function retrato(): string {
  const fondo = `<image href="/bestiario/templo-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo + `<g transform="${mancha(1.15)}">${img('morta-mancha')}</g>` + mortaEn('relincha');
}

export const MORTA: Personaje = {
  id: 'el-morta',
  region: 'el-templo',
  ancla: LUGAR.x,
  piezas: PIEZAS_MORTA,
  capas: { atras, figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
