/**
 * La polilla (`D-73`, vigesimocuarta vuelta), colgada del cable de la guirnalda del templo de Momo, al lado
 * de un foco.
 *
 * *"Otra polilla en busca de la luz"* es de *Murga de la virgencita*, en *Momo sampler* (2000). La de acá es
 * una polilla de ropero: gorda, peluda, de polvo lila, con un cuello de piel claro como el de un tapado viejo
 * y un batido en la cabeza. Se cuelga del cable con las dos patas de adelante, como del pasamanos de un
 * colectivo. Las alas de adelante tienen una estampita cada una, que es la virgencita del tema (el envase del
 * disco promete *"estampas saturnales"*); las de atrás, un ojo de mentira. Lo del dibujo: el lentejuelón de
 * la murga pegado en el pecho, la trompa enrollada como un resorte, el zurcido en el ala derecha —a esta
 * también se la comieron— y las cacas de mosca en el vidrio del foco. La lamparita es suya: la pinta encima
 * de la del fondo para poder hamacarla cuando se la lleva por delante.
 *
 * Viste la contratapa de *Momo sampler*, medida con sharp: el polvo de las alas es la luz lila de la máscara,
 * lo claro es la boca, el pelo es el violeta de la sombra, el cuello de piel es el lomo plateado del envase, y
 * el oro del lentejuelón y del foco es el de las letras del título.
 *
 * Coordenadas: el (0, 0) es el medio del tórax, y mira de frente (`rig-polilla.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, type P } from './trazos.ts';
import { FOCO, INSISTE, POLILLA, POLILLA_ARMADO as A, QUIETO, marcas, type Momento } from './rig-polilla.ts';

/** Las tintas de *Momo sampler* (`tokens.css`). */
const C = {
  polvo: 'var(--bestia-polilla-polvo)',
  polvoClaro: 'var(--bestia-polilla-polvo-claro)',
  polvoHondo: 'var(--bestia-polilla-polvo-hondo)',
  pelo: 'var(--bestia-polilla-pelo)',
  peloHondo: 'var(--bestia-polilla-pelo-hondo)',
  negro: 'var(--bestia-polilla-negro)',
  rosa: 'var(--bestia-polilla-rosa)',
  plata: 'var(--bestia-polilla-plata)',
  plataClara: 'var(--bestia-polilla-plata-clara)',
  brillo: 'var(--bestia-polilla-brillo)',
  papel: 'var(--bestia-polilla-papel)',
  oro: 'var(--bestia-polilla-oro)',
  oroHondo: 'var(--bestia-polilla-oro-hondo)',
  rojo: 'var(--bestia-polilla-rojo)',
};

/** Un azar con semilla (mulberry32): las motas caen siempre en el mismo lugar. */
function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const dentroDe = (pts: readonly P[]) => (x: number, y: number): boolean => {
  let adentro = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]!;
    const [xj, yj] = pts[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) adentro = !adentro;
  }
  return adentro;
};

/** Siembra `n` motas adentro de una forma. */
const motas = (semilla: number, n: number, [x0, y0, w, h]: readonly [number, number, number, number], dentro: (x: number, y: number) => boolean, pinta: (x: number, y: number, r: () => number) => string): string => {
  const r = azar(semilla);
  let s = '';
  for (let i = 0, puestas = 0; i < n * 8 && puestas < n; i++) {
    const x = x0 + r() * w;
    const y = y0 + r() * h;
    if (!dentro(x, y)) continue;
    s += pinta(x, y, r);
    puestas++;
  }
  return s;
};

/** Un pelo de la pelusa: un trazo corto, apenas curvo. */
const pelo = (x: number, y: number, a: number, l: number, color: string, ancho: number, o = 1): string =>
  trazo(`M${f(x)} ${f(y)} q${f(Math.cos(a + 0.4) * l * 0.5)} ${f(Math.sin(a + 0.4) * l * 0.5)} ${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}`, color, ancho, o);

/** Pelusa a lo largo de un borde: pelos que salen para afuera de un centro. */
const pelusa = (semilla: number, pts: readonly P[], [cx, cy]: P, largo: number, color: string, ancho: number, o = 1): string => {
  const r = azar(semilla);
  return pts.map(([x, y]) => pelo(x, y, Math.atan2(y - cy, x - cx) + (r() - 0.5) * 0.7, largo * (0.6 + r() * 0.6), color, ancho, o)).join('');
};

/** Puntos repartidos por una curva cerrada, para la pelusa del borde. */
const porElBorde = (pts: readonly P[], n: number): P[] => {
  const salida: P[] = [];
  const largos = pts.map((p, i) => Math.hypot(pts[(i + 1) % pts.length]![0] - p[0], pts[(i + 1) % pts.length]![1] - p[1]));
  const total = largos.reduce((s, l) => s + l, 0);
  for (let k = 0; k < n; k++) {
    let d = (k / n) * total;
    let i = 0;
    while (d > largos[i]!) d -= largos[i++]!;
    const [a, b] = [pts[i]!, pts[(i + 1) % pts.length]!];
    const t = d / largos[i]!;
    salida.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return salida;
};

const espejo = (pts: readonly P[]): P[] => pts.map(([x, y]) => [-x, y] as P);

/* ------------------------------------------------------------------
   Las alas de adelante: el polvo, las rayas en zigzag, la estampita y los flecos
   ------------------------------------------------------------------ */

const ALA: readonly P[] = [[-8, -12], [-22, -30], [-46, -48], [-78, -62], [-104, -64], [-118, -54], [-121, -38], [-113, -18], [-98, -1], [-80, 12], [-58, 20], [-36, 18], [-18, 8], [-8, -2]];
/** El borde de afuera del ala de adelante, de la punta para abajo: ahí van los flecos. */
const BORDE_ALA: readonly P[] = [[-104, -64], [-118, -54], [-121, -38], [-113, -18], [-98, -1], [-80, 12], [-58, 20]];
/** El medio de la estampita, en el ala izquierda. */
const ESTAMPITA: P = [-70, -24];

/** Una raya en zigzag de polilla, de un punto a otro, con su sombra clara al lado. */
function zigzag([x0, y0]: P, [x1, y1]: P, dientes: number, alto: number, X: (x: number) => number): string {
  let d = `M${f(X(x0))} ${f(y0)}`;
  for (let k = 1; k <= dientes; k++) {
    const t = k / dientes;
    const off = k % 2 ? alto : -alto * 0.5;
    d += ` L${f(X(x0 + (x1 - x0) * t + off))} ${f(y0 + (y1 - y0) * t)}`;
  }
  return trazo(d, C.peloHondo, 1.5, 0.85) + `<g transform="translate(${f(X(2.2) - X(0))} 0)">${trazo(d, C.polvoClaro, 1, 0.55)}</g>`;
}

/** Los flecos del borde: rayitas cortas, una oscura y una clara, como las de las polillas de verdad. */
function flecos(borde: readonly P[], centro: P, X: (x: number) => number): string {
  const pts = porElBorde(borde, 30).slice(0, 26);
  return pts
    .map(([x, y], i) => {
      const a = Math.atan2(y - centro[1], x - centro[0]);
      const [bx, by] = [X(x), y];
      const ax = X(x + Math.cos(a) * 6) - bx;
      return trazo(`M${f(bx)} ${f(by)} l${f(ax)} ${f(Math.sin(a) * 6)}`, i % 3 === 0 ? C.peloHondo : C.plataClara, 1.6, 0.8);
    })
    .join('');
}

/**
 * La estampita de la virgencita, en un óvalo de oro como las de la billetera: la aureola de puntos, el
 * manto violeta y las manos juntas. Chiquita, que de lejos es un ojo más.
 */
function estampita([cx, cy]: P, giro: number, n: number): string {
  const [rx, ry] = [13, 16];
  const aureola = Array.from({ length: 9 }, (_, k) => {
    const a = -Math.PI + (k / 8) * Math.PI;
    return forma(elipse(cx + Math.cos(a) * 5.4, cy - 7 + Math.sin(a) * 5.4, 0.9, 0.9), C.oro);
  }).join('');
  const rayos = Array.from({ length: 10 }, (_, k) => {
    const a = (k / 10) * Math.PI * 2;
    return trazo(`M${f(cx + Math.cos(a) * 8)} ${f(cy + 1 + Math.sin(a) * 10)} L${f(cx + Math.cos(a) * 11.5)} ${f(cy + 1 + Math.sin(a) * 14)}`, C.oro, 0.8, 0.7);
  }).join('');
  const manto = `M${cx} ${cy - 10} Q${cx + 7} ${cy - 8} ${cx + 7.5} ${cy + 2} L${cx + 9} ${cy + 13} Q${cx} ${cy + 15.5} ${cx - 9} ${cy + 13} L${cx - 7.5} ${cy + 2} Q${cx - 7} ${cy - 8} ${cx} ${cy - 10} Z`;
  const ovalo = elipse(cx, cy, rx, ry);
  return (
    `<g transform="rotate(${giro} ${cx} ${cy})">` +
    forma(elipse(cx, cy, rx + 2.6, ry + 2.6), C.oroHondo) +
    forma(elipse(cx, cy, rx + 1.4, ry + 1.4), C.oro) +
    enmascarado(`m-polilla-estampita-${n}`, ovalo,
      forma(ovalo, C.papel) + nube(cx, cy - 4, 9, 9, C.oro, 's', 0.55) + nube(cx, cy + 14, 14, 6, C.polvoClaro, 's', 0.7) +
      rayos +
      forma(manto, C.pelo) + nube(cx + 3, cy + 4, 3, 8, C.polvo, 's', 0.7) +
      // El vestido de abajo, rosa, y las manos juntas.
      forma(`M${cx - 2.6} ${cy - 1} L${cx + 2.6} ${cy - 1} L${cx + 3.4} ${cy + 13} L${cx - 3.4} ${cy + 13} Z`, C.rosa) +
      forma(elipse(cx, cy + 0.6, 1.5, 2.2), C.polvoClaro) +
      aureola +
      forma(elipse(cx, cy - 7, 2.7, 3.1), C.polvoClaro) + nube(cx - 0.6, cy - 7.6, 1.2, 1.2, C.papel, 'xs', 0.8) +
      // La medialuna a los pies.
      trazo(`M${cx - 7} ${cy + 12} Q${cx} ${cy + 17} ${cx + 7} ${cy + 12}`, C.oroHondo, 1.2, 0.9)) +
    // El papel gastado del borde.
    nube(cx + 6, cy + 10, 5, 4, C.polvoHondo, 's', 0.45) +
    `</g>`
  );
}

/** El zurcido: a esta también se la comieron, y alguien le remendó el agujero con hilo de oro. */
function zurcido([cx, cy]: P): string {
  const agujero = elipse(cx, cy, 6.4, 4.8);
  const hilos =
    [-4, -2, 0, 2, 4].map((d) => trazo(`M${cx - 6} ${cy + d} L${cx + 6} ${cy + d + 0.6}`, C.oro, 0.7, 0.85)).join('') +
    [-4, -1.5, 1, 3.5].map((d) => trazo(`M${cx + d} ${cy - 5} L${cx + d - 0.6} ${cy + 5}`, C.oroHondo, 0.7, 0.9)).join('');
  return forma(agujero, C.peloHondo) + nube(cx, cy, 6, 4.4, C.negro, 's', 0.6) + hilos + trazo(`M${cx - 7} ${cy - 1} q-2 -3 -5 -2`, C.oro, 0.6, 0.7);
}

function ala(n: 0 | 1): string {
  const s = n === 0 ? 1 : -1;
  const X = (x: number): number => x * s;
  const pts = n === 0 ? ALA : espejo(ALA);
  const d = curva(pts);
  const polvo = motas(70 + n, 90, [-122, -66, 116, 88], dentroDe(ALA), (x, y, r) => forma(elipse(X(x), y, 0.5 + r() * 0.7, 0.4 + r() * 0.5), r() < 0.5 ? C.polvoClaro : C.peloHondo, 0.25 + r() * 0.35));
  const puntos = [[-100, -52], [-110, -38], [-104, -20], [-92, -6], [-76, 6]].map(([x, y]) => forma(elipse(X(x!), y!, 1.3, 1.1), C.negro, 0.75)).join('');
  return conGrano(
    enmascarado(`m-polilla-ala-${n + 1}`, d,
      forma(d, C.polvo) +
      // El polvo: la panza del ala más clara, el borde de adelante y la base peluda más oscuros.
      nube(X(-78), -10, 34, 18, C.polvoClaro, 'm', 0.55) + nube(X(-104), -40, 12, 18, C.polvoClaro, 'm', 0.5) +
      soplo(`M${X(-8)} -14 L${X(-48)} -50 L${X(-104)} -66 L${X(-118)} -56 L${X(-80)} -54 L${X(-40)} -38 Z`, C.polvoHondo, 's', 0.8) +
      nube(X(-14), -2, 14, 16, C.pelo, 'm', 0.95) + nube(X(-26), 4, 14, 10, C.peloHondo, 'm', 0.6) +
      nube(X(-60), 18, 30, 6, C.polvoHondo, 's', 0.6) +
      zigzag([-30, -36], [-40, 16], 6, 3.4, X) + zigzag([-92, -60], [-90, 10], 8, 3, X) +
      // La sombra de la mancha del medio, donde va la estampita.
      nube(X(ESTAMPITA[0]), ESTAMPITA[1], 20, 22, C.polvoHondo, 'm', 0.55) +
      polvo + puntos + flecos(BORDE_ALA, [-60, -24], X) +
      estampita([X(ESTAMPITA[0]), ESTAMPITA[1]], -18 * s, n + 1) +
      (n === 1 ? zurcido([X(-100), -34]) : '')) +
    // El borde de adelante, de pelo.
    trazo(curva(pts.slice(0, 5), false), C.peloHondo, 1.4, 0.7),
  );
}

/* ------------------------------------------------------------------
   Las alas de atrás: más claras, con un ojo de mentira
   ------------------------------------------------------------------ */

const TRASERA: readonly P[] = [[-6, 2], [-24, 6], [-50, 12], [-74, 24], [-89, 42], [-87, 60], [-71, 73], [-49, 73], [-30, 61], [-16, 41], [-7, 20]];
const OCELO: P = [-58, 46];

function trasera(n: 0 | 1): string {
  const s = n === 0 ? 1 : -1;
  const X = (x: number): number => x * s;
  const pts = n === 0 ? TRASERA : espejo(TRASERA);
  const d = curva(pts);
  const [ox, oy] = [X(OCELO[0]), OCELO[1]];
  const polvo = motas(80 + n, 50, [-90, 0, 86, 76], dentroDe(TRASERA), (x, y, r) => forma(elipse(X(x), y, 0.5 + r() * 0.6, 0.4 + r() * 0.5), r() < 0.6 ? C.plataClara : C.polvoHondo, 0.25 + r() * 0.3));
  // Las venas, del cuerpo para afuera.
  const venas = [[-60, 18], [-80, 34], [-84, 56], [-66, 70], [-44, 70]].map(([x, y]) => trazo(`M${X(-8)} 10 Q${X(x! * 0.5)} ${(y! + 10) * 0.5 + 4} ${X(x!)} ${y}`, C.polvoHondo, 0.9, 0.55)).join('');
  return conGrano(
    enmascarado(`m-polilla-trasera-${n + 1}`, d,
      forma(d, C.polvoClaro) + nube(X(-12), 14, 16, 18, C.pelo, 'm', 0.9) + nube(X(-40), 30, 24, 20, C.polvo, 'm', 0.7) +
      nube(X(-80), 56, 14, 18, C.polvoHondo, 'm', 0.55) + venas + polvo +
      // El ojo de mentira: el anillo violeta, el rojo de las letras, el negro y la pupila de luz.
      forma(elipse(ox, oy, 10.5, 9.5), C.pelo) + forma(elipse(ox, oy, 8.4, 7.6), C.rojo) + nube(ox + X(2), oy + 2, 6, 5, C.negro, 's', 0.5) +
      forma(elipse(ox, oy, 5.6, 5), C.negro) + forma(elipse(ox - X(1.6), oy - 1.6, 1.7, 1.5), C.brillo, 0.95) +
      trazo(`M${ox - 7} ${oy + 4} Q${ox} ${oy + 9} ${ox + 7} ${oy + 4}`, C.oro, 0.9, 0.6) +
      flecos(pts === TRASERA ? TRASERA.slice(3, 9) : TRASERA.slice(3, 9), [-46, 36], X)),
  );
}

/* ------------------------------------------------------------------
   El cuerpo: el tórax con el cuello de piel y el lentejuelón, la panza, las patas
   ------------------------------------------------------------------ */

function cuerpo(): string {
  const d = elipse(0, -4, 16, 19);
  const [lx, ly] = A.lentejuela;
  const borde = porElBorde([[0, -23], [12, -18], [16, -4], [12, 10], [0, 15], [-12, 10], [-16, -4], [-12, -18]], 40);
  // El lentejuelón de la murga: un disco de oro de caras, con el agujerito y la puntada que lo tiene.
  const caras = Array.from({ length: 12 }, (_, k) => {
    const a = (k / 12) * Math.PI * 2;
    return trazo(`M${f(lx + Math.cos(a) * 1.8)} ${f(ly + Math.sin(a) * 1.8)} L${f(lx + Math.cos(a) * 7)} ${f(ly + Math.sin(a) * 7)}`, k % 2 ? C.oroHondo : C.brillo, 0.5, 0.5);
  }).join('');
  const lentejuela =
    forma(elipse(lx, ly, 8.4, 8.2), C.oroHondo) + forma(elipse(lx, ly, 7.4, 7.2), C.oro) + caras +
    nube(lx - 3, ly - 3, 3.4, 2.4, C.brillo, 's', 0.95) + nube(lx + 3, ly + 3.4, 3.6, 2.6, C.oroHondo, 's', 0.6) +
    forma(elipse(lx, ly, 1.5, 1.5), C.peloHondo) +
    trazo(`M${lx - 1} ${ly} l-6 -4 M${lx + 1} ${ly} l6 -4`, C.plataClara, 0.8, 0.9);
  return conGrano(
    pelusa(91, borde, [0, -4], 5, C.pelo, 1.6, 0.9) +
    enmascarado('m-polilla-cuerpo', d,
      forma(d, C.pelo) + nube(-4, -8, 9, 12, C.polvo, 'm', 0.6) + nube(6, 6, 9, 10, C.peloHondo, 'm', 0.7) +
      motas(93, 60, [-16, -23, 32, 38], (x, y) => (x * x) / 256 + ((y + 4) * (y + 4)) / 361 < 1, (x, y, r) => pelo(x, y, Math.PI / 2 + (r() - 0.5) * 1.2, 3 + r() * 2, r() < 0.5 ? C.polvo : C.peloHondo, 0.8, 0.6))) +
    // Los mechones de los hombros, que tapan donde se pegan las alas.
    [-1, 1].map((s) => nube(s * 11, -10, 7, 6, C.polvoClaro, 's', 0.8) + pelusa(95 + s, porElBorde([[s * 6, -15], [s * 17, -14], [s * 18, -4], [s * 8, -6]], 10), [s * 11, -9], 4, C.plataClara, 1, 0.75)).join('') +
    // El cuello de piel, como el de un tapado viejo.
    nube(0, -19, 16, 6, C.plataClara, 's', 0.95) + nube(0, -17, 12, 3, C.plata, 's', 0.8) +
    pelusa(97, porElBorde([[-15, -20], [0, -25], [15, -20], [10, -15], [0, -13], [-10, -15]], 28), [0, -19], 4, C.plataClara, 1.2, 0.85) +
    lentejuela,
  );
}

const PANZA: readonly P[] = [[-12, 9], [12, 9], [15, 24], [14, 40], [10, 54], [5, 64], [0, 67], [-5, 64], [-10, 54], [-14, 40], [-15, 24]];

function panza(): string {
  const d = curva(PANZA);
  const anillos = [20, 30, 40, 50, 59].map((y, i) => {
    const w = 14 - i * 1.8;
    return trazo(`M${-w} ${y - 2} Q0 ${y + 3} ${w} ${y - 2}`, C.peloHondo, 1.6, 0.75) + pelusa(100 + i, porElBorde([[-w, y - 1], [w, y - 1], [w * 0.6, y + 1], [-w * 0.6, y + 1]], 10), [0, y - 6], 3.4, C.polvoClaro, 0.9, 0.6);
  }).join('');
  return conGrano(
    pelusa(108, porElBorde(PANZA, 36), [0, 36], 4.4, C.pelo, 1.4, 0.85) +
    enmascarado('m-polilla-panza', d,
      forma(d, C.pelo) + nube(-4, 30, 6, 22, C.polvo, 'm', 0.6) + nube(7, 40, 6, 24, C.peloHondo, 'm', 0.7) + anillos) +
    // El pincel de la punta.
    pelusa(110, [[-3, 65], [-1, 66], [1, 66], [3, 65], [0, 66]], [0, 58], 6, C.polvo, 1.2, 0.9),
  );
}

/** Las cuatro patas de atrás, que cuelgan: finitas, peludas en el muslo, con los ganchitos de la punta. */
function patas(): string {
  const una = (s: number, pts: readonly P[]): string => {
    const X = (x: number): number => x * s;
    const d = `M${X(pts[0]![0])} ${pts[0]![1]} Q${X(pts[1]![0])} ${pts[1]![1]} ${X(pts[2]![0])} ${pts[2]![1]} L${X(pts[3]![0])} ${pts[3]![1]}`;
    const [tx, ty] = pts[3]!;
    return (
      trazo(d, C.peloHondo, 3.4) + trazo(d, C.plata, 1, 0.55) +
      pelusa(120 + Math.round(tx), porElBorde([pts[0]!, pts[1]!, pts[2]!].map(([x, y]) => [X(x), y] as P), 8), [X(pts[1]![0]) * 0.5, pts[1]![1] - 6], 2.6, C.polvoHondo, 0.8, 0.7) +
      trazo(`M${X(tx)} ${ty} l${X(-2)} 3 M${X(tx)} ${ty} l${X(2)} 2.6`, C.peloHondo, 1, 0.9)
    );
  };
  return conGrano(
    [1, -1].map((s) => una(s, [[-13, 1], [-34, 2], [-38, 16], [-40, 30]]) + una(s, [[-10, 12], [-24, 22], [-27, 38], [-26, 52]])).join(''),
  );
}

/** Una pata de adelante: el muslo peludo, la canilla con su mechón y el gancho que agarra el cable. */
function pata(n: 0 | 1): string {
  const s = n === 0 ? 1 : -1;
  const X = (x: number): number => x * s;
  const [bx, by] = A.patas[n];
  const [gx, gy] = A.agarre[n];
  const rodilla: P = [X(-25), -30];
  const muslo = `M${bx} ${by} Q${X(-18)} -20 ${rodilla[0]} ${rodilla[1]}`;
  const canilla = `M${rodilla[0]} ${rodilla[1]} Q${X(-28)} -44 ${gx} ${gy + 3}`;
  return conGrano(
    trazo(muslo, C.peloHondo, 5) + trazo(muslo, C.pelo, 3) +
    pelusa(130 + n, porElBorde([[bx, by], [X(-18), -20], rodilla], 10), [X(-14), -18], 3.4, C.polvo, 1, 0.8) +
    trazo(canilla, C.peloHondo, 3.4) + trazo(canilla, C.plata, 0.9, 0.5) +
    // El mechón de la canilla, como una polaina.
    nube(X(-26.5), -41, 3.4, 6, C.polvoClaro, 's', 0.9) + pelusa(134 + n, porElBorde([[X(-24), -36], [X(-29), -38], [X(-29), -46], [X(-25), -46]], 10), [X(-26.5), -41], 3, C.plataClara, 0.9, 0.85) +
    // Los deditos que se cierran sobre el cable.
    trazo(`M${gx} ${gy + 3} Q${gx} ${gy - 3} ${X(-20)} ${gy - 3} Q${X(-17)} ${gy - 2} ${X(-18)} ${gy + 1}`, C.peloHondo, 2, 0.95) +
    trazo(`M${gx} ${gy + 3} Q${X(-28)} ${gy - 2} ${X(-29)} ${gy + 1}`, C.peloHondo, 1.6, 0.9),
  );
}

/* ------------------------------------------------------------------
   La cabeza: el batido, los ojos de polilla, la trompa de resorte, las antenas de pluma
   ------------------------------------------------------------------ */

function cabeza(): string {
  const [hx, hy] = A.cabeza;
  const d = elipse(hx, hy, A.radioCabeza, A.radioCabeza * 0.94);
  const borde = porElBorde([[hx, hy - 15], [hx + 11, hy - 11], [hx + 15, hy], [hx + 11, hy + 10], [hx, hy + 14], [hx - 11, hy + 10], [hx - 15, hy], [hx - 11, hy - 11]], 34);
  const [tx, ty] = A.trompa;
  // La trompa enrollada: un resorte de oro viejo abajo de la cara.
  let espiral = '';
  for (let k = 0; k <= 36; k++) {
    const a = (k / 36) * Math.PI * 4.4;
    const r = 4.6 - (k / 36) * 3.8;
    espiral += `${k ? 'L' : 'M'}${f(tx + Math.sin(a) * r)} ${f(ty + 1 + Math.cos(a) * r * 0.8)} `;
  }
  const ojo = ([x, y]: P, i: number): string => {
    const r = A.radioOjo;
    return (
      forma(elipse(x, y, r + 1.2, r + 1.1), C.peloHondo) +
      forma(elipse(x, y, r, r), C.negro) +
      // Los ojos de polilla son de muchas facetas: una trama apenas, y la luz del foco en un costado.
      motas(140 + i, 18, [x - r, y - r, r * 2, r * 2], (px, py) => (px - x) ** 2 + (py - y) ** 2 < r * r * 0.8, (px, py) => forma(elipse(px, py, 0.6, 0.6), C.pelo, 0.5)) +
      nube(x + 1.6, y + 2.4, 3.6, 2.6, C.pelo, 's', 0.6) +
      forma(elipse(x - 2.4, y - 2.4, 1.9, 1.6), C.brillo, 0.95) + forma(elipse(x - 3.6, y + 1.2, 1, 0.9), C.oro, 0.85) + forma(elipse(x + 2.2, y + 2.4, 0.7, 0.6), C.brillo, 0.5)
    );
  };
  return conGrano(
    pelusa(150, borde, [hx, hy], 5, C.pelo, 1.6, 0.9) +
    enmascarado('m-polilla-cabeza', d,
      forma(d, C.pelo) + nube(hx, hy - 6, 10, 8, C.polvo, 'm', 0.7) + nube(hx, hy + 8, 12, 6, C.peloHondo, 'm', 0.7) +
      // Los cachetes peludos, donde van los palpos.
      nube(hx - 4.6, hy + 9, 3.4, 3, C.polvoClaro, 's', 0.8) + nube(hx + 4.6, hy + 9, 3.4, 3, C.polvoClaro, 's', 0.8)) +
    // El batido: un copete esponjado en la frente, como el de una señora que va a la murga.
    nube(hx, hy - 15, 9, 6, C.polvoClaro, 's', 0.95) + nube(hx - 3, hy - 17, 5, 3, C.plataClara, 's', 0.9) +
    pelusa(152, porElBorde([[hx - 9, hy - 14], [hx - 4, hy - 21], [hx + 4, hy - 21], [hx + 9, hy - 14], [hx, hy - 12]], 26), [hx, hy - 13], 4.4, C.plataClara, 1.1, 0.85) +
    A.ojos.map(ojo).join('') +
    trazo(espiral, C.oroHondo, 1.3) + trazo(espiral, C.oro, 0.5, 0.6),
  );
}

/** Los párpados peludos: la isla los baja desde arriba de cada ojo. */
function parpado(n: 0 | 1): string {
  const [x, y] = A.ojos[n];
  const r = A.radioOjo;
  const d = elipse(x, y, r + 1.4, r + 1.3);
  return conGrano(
    enmascarado(`m-polilla-parpado-${n + 1}`, d, forma(d, C.pelo) + nube(x, y - r, r, 4, C.polvo, 's', 0.9) + nube(x, y + r, r, 3, C.peloHondo, 's', 0.6)) +
    trazo(`M${x - r} ${y + r - 1} Q${x} ${y + r + 2} ${x + r} ${y + r - 1}`, C.polvoClaro, 1.1, 0.9),
  );
}

/** Una antena de pluma: el lomo de oro viejo y las barbas de plata, más largas al medio. */
function antena(n: 0 | 1): string {
  const s = n === 0 ? 1 : -1;
  const X = (x: number): number => x * s;
  const [bx, by] = A.antenas[n];
  const [c, p]: [P, P] = [[X(-12), -82], [X(-40), -97]];
  const en = (t: number): P => [(1 - t) ** 2 * bx + 2 * (1 - t) * t * c[0] + t * t * p[0], (1 - t) ** 2 * by + 2 * (1 - t) * t * c[1] + t * t * p[1]];
  let barbas = '';
  for (let k = 2; k <= 26; k++) {
    const t = k / 27;
    const [x, y] = en(t);
    const [x2, y2] = en(t + 0.01);
    const a = Math.atan2(y2 - y, x2 - x);
    const l = 7.5 * Math.sin(Math.PI * Math.min(1, t * 1.15)) + 1.2;
    for (const lado of [-1, 1]) {
      const b = a + lado * 1.15;
      barbas += trazo(`M${f(x)} ${f(y)} l${f(Math.cos(b) * l)} ${f(Math.sin(b) * l)}`, k % 2 ? C.plata : C.plataClara, 0.7, 0.85);
    }
  }
  const lomo = `M${bx} ${by} Q${c[0]} ${c[1]} ${p[0]} ${p[1]}`;
  return conGrano(barbas + trazo(lomo, C.oroHondo, 1.6) + trazo(lomo, C.oro, 0.5, 0.6) + forma(elipse(bx, by, 2.2, 2), C.peloHondo));
}

/** Los ojos de mareo: un remolino que tapa cada ojo cuando se dio el golpe. Centrado en el (0, 0). */
function mareo(): string {
  let d = '';
  for (let k = 0; k <= 44; k++) {
    const a = (k / 44) * Math.PI * 5;
    const r = 0.3 + (k / 44) * 5.6;
    d += `${k ? 'L' : 'M'}${f(Math.cos(a) * r)} ${f(Math.sin(a) * r)} `;
  }
  return forma(elipse(0, 0, A.radioOjo + 0.4, A.radioOjo + 0.4), C.negro) + trazo(d, C.papel, 1.2, 0.95) + trazo(d, C.oro, 0.4, 0.6);
}

/* ------------------------------------------------------------------
   La lamparita, su halo, el chispazo y el polvo (en el recinto)
   ------------------------------------------------------------------ */

function foco(): string {
  const [ax, ay] = FOCO.cuelga;
  const [cx, cy] = FOCO.centro;
  const r = FOCO.radio;
  const vidrio = `M${cx - 3.4} ${ay + 8} Q${cx - r - 1} ${cy - 3} ${cx - r} ${cy + 1} Q${cx - r + 0.5} ${cy + r + 1} ${cx} ${cy + r + 1.4} Q${cx + r - 0.5} ${cy + r + 1} ${cx + r} ${cy + 1} Q${cx + r + 1} ${cy - 3} ${cx + 3.4} ${ay + 8} Z`;
  return conGrano(
    // El cable que baja al portalámparas, y el casquillo de rosca.
    trazo(`M${ax} ${ay - 6} L${ax} ${ay}`, C.peloHondo, 1.4) +
    forma(`M${ax - 3.6} ${ay} L${ax + 3.6} ${ay} L${ax + 3.4} ${ay + 8.4} L${ax - 3.4} ${ay + 8.4} Z`, C.plata) +
    [2.2, 4.4, 6.6].map((d) => trazo(`M${ax - 3.5} ${ay + d} L${ax + 3.5} ${ay + d - 0.8}`, C.peloHondo, 0.6, 0.8)).join('') +
    nube(ax - 1.4, ay + 4, 1, 3.6, C.plataClara, 'xs', 0.9) +
    enmascarado('m-polilla-vidrio', vidrio,
      forma(vidrio, C.oro) + nube(cx, cy, r, r, C.brillo, 's', 0.9) + nube(cx + 3, cy + 4, 4, 4, C.oroHondo, 's', 0.35) +
      // El filamento, prendido.
      trazo(`M${cx - 2.4} ${ay + 9} L${cx - 2} ${cy - 1} l1 -1.4 l1 1.4 l1 -1.4 l1 1.4 L${cx + 2.4} ${ay + 9}`, C.rojo, 0.6, 0.8) +
      nube(cx, cy - 1.4, 2.6, 1.6, C.papel, 'xs') +
      // Las cacas de mosca del vidrio, que es un foco de verdad.
      forma(elipse(cx + 3.6, cy + 2, 0.5, 0.5), C.peloHondo, 0.7) + forma(elipse(cx + 2.4, cy + 4.4, 0.4, 0.4), C.peloHondo, 0.6) + forma(elipse(cx - 4, cy + 3.6, 0.45, 0.45), C.peloHondo, 0.6)) +
    trazo(`M${cx - r + 1.6} ${cy - 1} Q${cx - r + 1.4} ${cy + 4} ${cx - 2} ${cy + 6}`, C.brillo, 0.9, 0.8),
  );
}

function halo(): string {
  const [cx, cy] = FOCO.centro;
  return nube(cx, cy, 34, 30, C.oro, 'l', 0.4) + nube(cx, cy, 16, 15, C.oro, 'm', 0.55) + nube(cx, cy, 8, 8, C.brillo, 's', 0.5);
}

/** El chispazo del golpe: rayas que saltan del vidrio, en oro y en luz. */
function golpe(): string {
  const [cx, cy] = FOCO.centro;
  return (
    nube(cx, cy, 14, 13, C.brillo, 'm', 0.6) +
    Array.from({ length: 11 }, (_, i) => {
      const a = (i / 11) * Math.PI * 2 + 0.2;
      const [r0, r1] = [12, 21 + (i % 3) * 5];
      return trazo(`M${f(cx + Math.cos(a) * r0)} ${f(cy + Math.sin(a) * r0)} L${f(cx + Math.cos(a) * r1)} ${f(cy + Math.sin(a) * r1)}`, i % 2 ? C.oro : C.brillo, 1.6, 0.95);
    }).join('')
  );
}

/** Una nubecita de polvo de ala: motas lila y plata, sueltas. Centrada en el (0, 0). */
function polvo(): string {
  const r = azar(160);
  let s = nube(0, 0, 7, 6, C.polvoClaro, 's', 0.45);
  for (let i = 0; i < 18; i++) {
    const a = r() * Math.PI * 2;
    const d = r() * 9;
    s += forma(elipse(Math.cos(a) * d, Math.sin(a) * d, 1 + r() * 1.1, 0.8 + r() * 0.8), [C.polvoClaro, C.plataClara, C.polvo][i % 3]!, 0.5 + r() * 0.5);
  }
  return s;
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;
const [HX, HY] = A.cabeza;
const [FX, FY] = FOCO.centro;

export const PIEZAS_POLILLA: readonly Pieza[] = [
  { nombre: 'polilla-halo', caja: [FX - 70, FY - 66, 140, 132], dibujo: halo(), densidad: 1.2 },
  { nombre: 'polilla-foco', caja: [FX - 10, FOCO.cuelga[1] - 8, 20, 34], dibujo: foco(), densidad: 8 },
  { nombre: 'polilla-trasera-1', caja: [-94, -2, 92, 80], dibujo: trasera(0), densidad: D },
  { nombre: 'polilla-trasera-2', caja: [2, -2, 92, 80], dibujo: trasera(1), densidad: D },
  { nombre: 'polilla-ala-1', caja: [-130, -72, 126, 98], dibujo: ala(0), densidad: D },
  { nombre: 'polilla-ala-2', caja: [4, -72, 126, 98], dibujo: ala(1), densidad: D },
  { nombre: 'polilla-patas', caja: [-46, -4, 92, 62], dibujo: patas(), densidad: D },
  { nombre: 'polilla-panza', caja: [-22, 2, 44, 74], dibujo: panza(), densidad: D },
  { nombre: 'polilla-cuerpo', caja: [-24, -30, 48, 52], dibujo: cuerpo(), densidad: D * 1.3 },
  { nombre: 'polilla-pata-1', caja: [-36, -66, 32, 56], dibujo: pata(0), densidad: D * 1.3 },
  { nombre: 'polilla-pata-2', caja: [4, -66, 32, 56], dibujo: pata(1), densidad: D * 1.3 },
  { nombre: 'polilla-antena-1', caja: [-54, -110, 54, 70], dibujo: antena(0), densidad: D * 1.3 },
  { nombre: 'polilla-antena-2', caja: [0, -110, 54, 70], dibujo: antena(1), densidad: D * 1.3 },
  { nombre: 'polilla-cabeza', caja: [HX - 22, HY - 28, 44, 50], dibujo: cabeza(), densidad: D * 1.5 },
  { nombre: 'polilla-parpado-1', caja: [A.ojos[0][0] - 9, A.ojos[0][1] - 9, 18, 18], dibujo: parpado(0), densidad: D * 1.5 },
  { nombre: 'polilla-parpado-2', caja: [A.ojos[1][0] - 9, A.ojos[1][1] - 9, 18, 18], dibujo: parpado(1), densidad: D * 1.5 },
  { nombre: 'polilla-mareo', caja: [-8, -8, 16, 16], dibujo: mareo(), densidad: D * 1.5 },
  { nombre: 'polilla-golpe', caja: [FX - 40, FY - 40, 80, 80], dibujo: golpe(), densidad: 2.4 },
  { nombre: 'polilla-polvo', caja: [-12, -12, 24, 24], dibujo: polvo(), densidad: 4 },
];

const img = imagenesDe(PIEZAS_POLILLA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** La polilla armada con las marcas de un momento, con su foco y su polvo, en el recinto. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const ojo = (n: 1 | 2): string => parte(`mareo-${n}`, img('polilla-mareo'), t[`mareo-${n}`]);
  return (
    parte('entero',
      parte('vuelo',
        parte('trasera-1', img('polilla-trasera-1'), t['trasera-1']) + parte('trasera-2', img('polilla-trasera-2'), t['trasera-2']) +
        parte('ala-1', img('polilla-ala-1'), t['ala-1']) + parte('ala-2', img('polilla-ala-2'), t['ala-2']) +
        parte('patas', img('polilla-patas'), t.patas) +
        parte('panza', img('polilla-panza'), t.panza) +
        img('polilla-cuerpo') +
        parte('pata-1', img('polilla-pata-1'), t['pata-1']) + parte('pata-2', img('polilla-pata-2'), t['pata-2']) +
        parte('cabeza',
          parte('antena-1', img('polilla-antena-1'), t['antena-1']) + parte('antena-2', img('polilla-antena-2'), t['antena-2']) +
          img('polilla-cabeza') +
          parte('parpado-1', img('polilla-parpado-1'), t['parpado-1']) + parte('parpado-2', img('polilla-parpado-2'), t['parpado-2']) +
          parte('mareos', ojo(1) + ojo(2), '', o.mareos),
          t.cabeza),
        t.vuelo),
      t.entero) +
    // El foco va delante: cuando le da vueltas, pasa por detrás del vidrio, y el halo la alumbra.
    parte('foco', img('polilla-foco') + parte('halo', img('polilla-halo'), '', o.halo), t.foco) +
    parte('golpe', img('polilla-golpe'), '', o.golpe) +
    [1, 2, 3, 4].map((k) => parte(`polvo-${k}`, img('polilla-polvo'), t[`polvo-${k}`], o[`polvo-${k}`])).join('')
  );
}

/** La polilla en un momento, sin lo que la hace tocable: para el test, el retrato y para mirarla. */
export function polillaEn(m: Momento = QUIETO): string {
  return `<g>${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: colgada del cable al lado del foco, con las alas abiertas. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--polilla" data-id="la-polilla" role="button" tabindex="0" aria-label="${nombres.get('la-polilla') ?? 'La polilla'}">` +
    armado(QUIETO) +
    `</g>`
  );
}

/** El retrato de la ficha: pegada al vidrio, con las alas para arriba, el chispazo y el polvo en el aire. */
export const RETRATO = { caja: [FX - 58, FY - 62, 170, 132] as const };
function retrato(): string {
  return `<image href="/bestiario/templo-lejos.webp" x="-300" y="0" width="1500" height="640" preserveAspectRatio="none"/>` + polillaEn(INSISTE);
}

export const POLILLA_PERSONAJE: Personaje = {
  id: 'la-polilla',
  region: 'el-templo',
  ancla: POLILLA.x,
  piezas: PIEZAS_POLILLA,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
