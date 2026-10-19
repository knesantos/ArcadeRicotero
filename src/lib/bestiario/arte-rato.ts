/**
 * El rato molhado (`D-73`, decimoquinta vuelta), nadando en el bajo inundado.
 *
 * *"Tumberito jamón y porrón / mirá vos qué tan lejos llegó"* cierra *Momo Sampler* (2000), que es el
 * último disco de la banda. El rato no está en ninguna tapa: se inventa en la de su disco (`D-19`,
 * `T-440`). Adentro de *Momo Sampler* hay una cara de murga soplada a aerógrafo que sale de lo oscuro:
 * piel violeta casi negra, plata mojada en la frente y en la nariz, ojos que brillan, rayas de pintura
 * en los cachetes. **El rato está soplado así**: el pelo es ese violeta, empapado y pegado en mechones
 * que gotean, con la plata en cada mechón; lo pelado (la nariz, las orejas, las manos, la cola) es el
 * lila del labio de la contratapa; los ojos son de persona, como los animales de Rocambole, y llevan la
 * raya roja de la murga abajo. La camisa es el rojo de adentro de las letras del título, y la cadena,
 * los dientes y el porrón, su oro. Las botas son negras y plateadas como el medallón del frente, y del
 * cuello le cuelga **el medallón mismo**, recortado de la tapa de verdad (`tapa:` en la imprenta): el
 * rey del carnaval colgado de un tumberito que llegó lejos.
 *
 * Es un recorte de *Momo Sampler* pegado en la noche de *Un baión*: la luz le viene de la puerta del
 * vidrio roto, arriba a la derecha, tibia, y de abajo le sube el frío del agua. Con eso se despega del
 * azul sin contorno.
 *
 * Está metido en el agua hasta el pecho, como Pierre: lo que queda abajo del agua no se ve (la escena lo
 * corta en la línea del agua) y se refleja dado vuelta y cortado en tiras. Las botas nuevas las tiene en
 * alto para que no se le mojen; el porrón, en la otra mano.
 *
 * Coordenadas del títere: el (0, 0) es el agua debajo del medio del pecho, arriba es negativo
 * (`rig-rato.ts`).
 */

import { forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Nombres, Personaje } from './elenco.ts';
import { azar } from './pincel.ts';
import { BOTAS, GESTOS, PIVOTES_PARPADO, RATO as R, RATO_ARMADO as A, dibujado, transformes, type Gesto, type Punto } from './rig-rato.ts';

type P = Punto;
const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** Las tintas de *Momo Sampler* (`tokens.css`), la luz de la puerta y el frío del agua del bajo. */
const C = {
  hondo: 'var(--bestia-rato-hondo)',
  pelo: 'var(--bestia-rato-pelo)',
  plata: 'var(--bestia-rato-plata)',
  lila: 'var(--bestia-rato-lila)',
  lilaHonda: 'var(--bestia-rato-lila-honda)',
  rojo: 'var(--bestia-rato-rojo)',
  rojoHondo: 'var(--bestia-rato-rojo-hondo)',
  oro: 'var(--bestia-rato-oro)',
  oroHondo: 'var(--bestia-rato-oro-hondo)',
  cromo: 'var(--bestia-rato-cromo)',
  medallon: 'var(--disco-momo-sampler-tinta)',
  peltre: 'var(--disco-momo-sampler-apoyo)',
  blanco: 'var(--bestia-ojo-blanco)',
  llama: 'var(--entorno-bajo-llama)',
  llamaClara: 'var(--entorno-bajo-llama-clara)',
  celeste: 'var(--entorno-bajo-celeste)',
  negro: 'var(--fondo)',
};

/* ------------------------------------------------------------------
   Herramientas: la curva, la máscara, el tubo, los mechones mojados
   ------------------------------------------------------------------ */

/** Una curva suave cerrada que pasa por todos los puntos (Catmull-Rom llevada a Bézier). */
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

/** La misma curva, pero en puntos: `porTramo` por cada tramo entre dos puntos. */
function muestrear(pts: readonly P[], porTramo = 8): P[] {
  const n = pts.length;
  const out: P[] = [];
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [pts[(i - 1 + n) % n]!, pts[i]!, pts[(i + 1) % n]!, pts[(i + 2) % n]!];
    for (let k = 0; k < porTramo; k++) {
      const t = k / porTramo;
      const [t2, t3] = [t * t, t * t * t];
      const c = (j: 0 | 1): number => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3);
      out.push([c(0), c(1)]);
    }
  }
  return out;
}

const poli = (pts: readonly P[]): string => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;
const linea = (pts: readonly P[]): string => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')}`;
const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;
const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;

/**
 * La máscara del aerógrafo, con varias siluetas que se suman. La imprenta junta los caminos del
 * recorte en uno: todas tienen que girar para el mismo lado, o se restan donde se pisan.
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

/** Un tubo que se afina: el contorno de un brazo o de la cola. `anchos` va de punta a punta. */
function tubo(eje: readonly P[], anchos: readonly number[], pasos = 16): { d: string; izq: P[]; der: P[]; muestra: (t: number) => { p: P; dir: P; ancho: number } } {
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
  const puntaA: P = [a.p[0] - a.dir[0] * ancho(0) * 0.4, a.p[1] - a.dir[1] * ancho(0) * 0.4];
  const puntaB: P = [b.p[0] + b.dir[0] * ancho(1) * 0.4, b.p[1] + b.dir[1] * ancho(1) * 0.4];
  return { d: curva([puntaA, ...izq, puntaB, ...[...der].reverse()]), izq, der, muestra: (t) => ({ ...enLinea(eje, t), ancho: ancho(t) }) };
}

/** Cuánta luz le toca a una dirección: la puerta está arriba a la derecha. */
const LUZ: P = [0.42, -0.91];
const luzDe = ([nx, ny]: P): number => Math.max(0, nx * LUZ[0] + ny * LUZ[1]);

interface Mechones {
  /** El contorno con los mechones. */
  pts: P[];
  /** Cada mechón: dónde nace, dónde termina en punta, y cuánta luz le toca. */
  puntas: Array<{ base: P; punta: P; luz: number }>;
}

/**
 * El pelo empapado se pega en mechones que terminan en punta y cuelgan: el agua los tira para abajo.
 * Sobre un contorno muestreado, entre `desde` y `hasta` (índices, pueden dar la vuelta), cada tantos
 * puntos uno se corre para afuera y para abajo. Es el borde duro de la máscara, recortado a mechones.
 */
function mechones(contorno: readonly P[], centro: P, desde: number, hasta: number, largo: number, semilla: number, cada = 3, gravedad = 0.55): Mechones {
  const rnd = azar(semilla);
  const n = contorno.length;
  const pts = contorno.map((p) => [p[0], p[1]] as P);
  const puntas: Mechones['puntas'] = [];
  const corre = (j: number, k: number, dx: number, dy: number): void => {
    const q = ((j % n) + n) % n;
    pts[q] = [contorno[q]![0] + dx * k, contorno[q]![1] + dy * k];
  };
  for (let i = desde; i < hasta; i += cada + Math.floor(rnd() * 3)) {
    const j = ((i % n) + n) % n;
    const [x, y] = contorno[j]!;
    let [nx, ny] = [x - centro[0], y - centro[1]];
    const l = Math.hypot(nx, ny) || 1;
    [nx, ny] = [nx / l, ny / l];
    const luz = luzDe([nx, ny]);
    [nx, ny] = [nx * (1 - gravedad), ny * (1 - gravedad) + gravedad];
    const m = Math.hypot(nx, ny) || 1;
    const L = largo * (0.35 + rnd() * rnd() * 1.3);
    const [dx, dy] = [(nx / m) * L, (ny / m) * L];
    // El mechón es ancho en la raíz y se afina: la punta se corre entera, las de al lado un poco.
    corre(j - 1, 0.32, dx, dy);
    corre(j + 1, 0.22, dx, dy);
    const punta: P = [x + dx, y + dy];
    pts[j] = punta;
    puntas.push({ base: [x - dx * 1.4, y - dy * 1.4], punta, luz });
  }
  return { pts, puntas };
}

/**
 * Lo que hace mojado al pelo: en cada mechón, la raya honda que lo separa del de al lado y el filo de
 * plata donde le pega la luz; y en la punta, a veces, la gota que está por caer.
 */
function brillos(m: Mechones, semilla: number, luzMinima = 0.15, gotas = 0.3): string {
  const rnd = azar(semilla);
  let hondo = '';
  let plata = '';
  let gota = '';
  for (const { base, punta, luz } of m.puntas) {
    const medio: P = [(base[0] + punta[0]) / 2 + (rnd() - 0.5) * 2, (base[1] + punta[1]) / 2];
    const d = `M${f(base[0])} ${f(base[1])} Q${f(medio[0])} ${f(medio[1])} ${f(punta[0])} ${f(punta[1])}`;
    hondo += trazo(d, C.negro, 1.6, 0.42);
    const k = Math.max(luzMinima, luz);
    // El brillo no llega a la punta: se corta antes, donde el mechón se afina.
    const corto = `M${f(base[0])} ${f(base[1])} Q${f(medio[0])} ${f(medio[1])} ${f(base[0] + (punta[0] - base[0]) * 0.78)} ${f(base[1] + (punta[1] - base[1]) * 0.78)}`;
    plata += `<g transform="translate(-0.9 0)">${trazo(corto, C.plata, 1.1, Math.min(0.7, 0.12 + k * 0.6))}</g>`;
    if (rnd() < gotas) {
      const r = 0.9 + rnd() * 0.8;
      gota += `<circle cx="${f(punta[0])}" cy="${f(punta[1] + r * 0.8)}" r="${f(r)}" fill="${C.plata}" opacity="0.75"/>` + `<circle cx="${f(punta[0] + r * 0.25)}" cy="${f(punta[1] + r * 1.2)}" r="${f(r * 0.55)}" fill="${C.hondo}" opacity="0.6"/>`;
    }
  }
  return hondo + `<g filter="url(#soplo-xs)">${plata}</g>` + gota;
}

/**
 * El pelo empapado y peinado para atrás, como el que se tira gel: rayas largas que siguen el peinado,
 * la honda entre mechón y mechón, y la plata encima de cada uno, más donde le pega la luz. Soplado
 * fino, no a pluma: el aerógrafo deja el borde blando.
 */
function peinadoMojado(rnd: () => number, n: number, lugar: () => P, direccion: (p: P) => P, paso: number, pasos: number, luz: (p: P) => number, adentro: (p: P) => boolean = () => true): string {
  let hondo = '';
  let plata = '';
  for (let i = 0; i < n; i++) {
    let p = lugar();
    const pts: P[] = [p];
    const l = pasos * (0.5 + rnd() * 0.7);
    for (let k = 0; k < l; k++) {
      const [dx, dy] = direccion(p);
      const q: P = [p[0] + dx * paso, p[1] + dy * paso];
      if (!adentro(q)) break;
      pts.push(q);
      p = q;
    }
    if (pts.length < 2) continue;
    const d = curva(pts, false);
    const k = luz(pts[Math.floor(pts.length / 2)]!);
    hondo += trazo(d, C.negro, 1.2 + rnd() * 0.8, 0.28 + rnd() * 0.22);
    if (k > 0.06) plata += `<g transform="translate(0.9 -1)">${trazo(d, C.plata, 0.9 + rnd() * 0.9, Math.min(0.75, k * (0.35 + rnd() * 0.45)))}</g>`;
  }
  return hondo + `<g filter="url(#soplo-xs)">${plata}</g>`;
}

/** Mechas adentro del pelo: rayas cortas que siguen el peinado, hondas, con el filo de plata del lado de la luz. */
function mechas(rnd: () => number, n: number, lugar: () => P, peinado: (p: P) => number, largo: number, luz: (p: P) => number): string {
  let hondo = '';
  let filo = '';
  for (let i = 0; i < n; i++) {
    const [x, y] = lugar();
    const a = peinado([x, y]) + (rnd() - 0.5) * 0.35;
    const l = largo * (0.5 + rnd() * 0.8);
    const [dx, dy] = [Math.cos(a) * l, Math.sin(a) * l];
    const d = `M${f(x)} ${f(y)} q${f(dx * 0.5 + dy * 0.12)} ${f(dy * 0.5 - dx * 0.12)} ${f(dx)} ${f(dy)}`;
    hondo += trazo(d, C.negro, 0.9 + rnd() * 0.5, 0.3 + rnd() * 0.25);
    const k = luz([x, y]);
    if (k > 0.1) filo += `<g transform="translate(0.7 -0.6)">${trazo(d, C.plata, 0.5, Math.min(0.7, k * (0.25 + rnd() * 0.35)))}</g>`;
  }
  return hondo + filo;
}

const enElipse = (rnd: () => number, cx: number, cy: number, rx: number, ry: number) => (): P => {
  const a = rnd() * Math.PI * 2;
  const r = Math.sqrt(rnd());
  return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r];
};

/** La caja de un juego de puntos, con aire. */
const cajaDe = (pts: readonly P[], aire: number): readonly [number, number, number, number] => {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, y0] = [Math.floor(Math.min(...xs) - aire), Math.floor(Math.min(...ys) - aire)];
  return [x0, y0, Math.ceil(Math.max(...xs) + aire) - x0, Math.ceil(Math.max(...ys) + aire) - y0];
};

/* ------------------------------------------------------------------
   La cabeza: de tres cuartos, el hocico para la puerta
   ------------------------------------------------------------------ */

/**
 * El contorno de la cabeza, de la nuca para arriba, por la frente y el hocico hasta la nariz, y de
 * vuelta por la barbilla y el cachete de acá. El de allá queda detrás del hocico.
 */
export const CABEZA: readonly P[] = [
  [-46, -172], [-38, -189], [-22, -200], [-2, -204], [15, -200], [27, -191], [35, -178], [43, -164], [52, -151], [61, -139],
  [68, -129], [73, -121], [75, -114], [72, -108], [64, -104], [54, -101], [44, -99], [34, -97], [24, -94], [12, -90],
  [-2, -89], [-16, -93], [-30, -101], [-42, -114], [-50, -131], [-52, -152],
];
/** La oreja de allá, detrás de la coronilla. */
const OREJA_ALLA = { c: [6, -210] as P, r: [12, 15] as P, giro: 18 };
/** Por dónde corta la luz la cara: de este lado (la izquierda, y abajo del hocico) se va a lo hondo. */
const SOMBRA_CARA = 'M-60 -224 L-4 -218 Q2 -194 0 -174 Q-2 -160 2 -148 Q8 -134 18 -123 Q30 -111 48 -104 Q62 -101 80 -104 L80 -80 L-60 -80 Z';

/** Si un punto está adentro de un polígono (rayo a la derecha). */
function enPoligono(pts: readonly P[], [x, y]: P): boolean {
  let dentro = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]!;
    const [xj, yj] = pts[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}

/**
 * Para dónde va el pelo de la cabeza, peinado para atrás por el agua: del hocico a la frente, por
 * arriba a la nuca y de la nuca para abajo, dando la vuelta alrededor del ojo de acá. En los cachetes
 * cae, que el agua lo tira.
 */
function flujoDeLaCabeza([x, y]: P): P {
  let dx = -1;
  let dy: number;
  if (x > 30) dy = -0.85; // por el lomo del hocico sube a la frente
  else if (y < -160) dy = -0.18 + Math.max(0, (-14 - x) / 26); // por arriba va para atrás, y en la nuca cae
  else dy = 0.3 + Math.max(0, (y + 160) / 40) + Math.max(0, (-24 - x) / 30); // en los cachetes cae
  if (x < -30 && y < -160) dx = -0.6;
  const l = Math.hypot(dx, dy) || 1;
  return [dx / l, dy / l];
}

/** Cuánta luz le toca a un punto de la cabeza: del lado de la sombra, casi nada. */
function luzDeLaCabeza([x, y]: P): number {
  const corte = Math.max(0, (y + 150) * 0.9);
  if (x < corte) return 0.07;
  return Math.max(0, Math.min(1, 0.22 + (x - corte) / 70 + (-150 - y) / 110));
}

function cabeza(): string {
  const base = muestrear(CABEZA, 8);
  const n = CABEZA.length * 8;
  // Mojado: la nuca, el cachete de acá y la barbilla (de la barbilla a la nuca, dando la vuelta).
  const m = mechones(base, [-4, -146], 17 * 8, n + 10, 8, 1211, 5, 0.6);
  const silueta = poli(m.pts);
  const rnd = azar(1217);
  const [o1, o2] = A.ojos;
  const [ox, oy] = OREJA_ALLA.c;
  const orejaD = poli(ovalo(OREJA_ALLA.c, OREJA_ALLA.r, OREJA_ALLA.giro));
  // La de allá se ve de canto: el borde de piel lila del lado de la luz, y adentro lo hondo.
  const orejaAlla =
    forma(orejaD, C.hondo) +
    nube(ox + 3, oy - 1, 6, 11, C.lilaHonda, 's', 0.95, OREJA_ALLA.giro) +
    nube(ox + 6, oy - 3, 3, 9, C.lila, 's', 0.85, OREJA_ALLA.giro) +
    nube(ox + 9, oy - 7, 1.4, 6, C.llama, 'xs', 0.6, OREJA_ALLA.giro);
  // Los dientes asoman debajo del labio: van en la máscara aunque se salgan del contorno.
  const dientes = 'M57 -105 L65.6 -105 L65.4 -90 Q63.6 -88.6 61.6 -89.2 Q60 -88 58.2 -89.4 Z';

  /** El ojo de persona: la cuenca, el blanco, el pliegue de arriba y la bolsa de abajo. */
  const ojo = (o: (typeof A.ojos)[number], enLaLuz: boolean): string => {
    const [cx, cy] = o.centro;
    const [rx, ry] = o.radio;
    return (
      nube(cx, cy + 0.5, rx + 5, ry + 5, C.negro, 's', enLaLuz ? 0.55 : 0.75) +
      `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.blanco}"${enLaLuz ? '' : ' opacity="0.62"'}/>` +
      // La sombra del párpado sobre el blanco, y la esquina de adentro, rosada.
      nube(cx, cy - ry * 0.55, rx * 1.05, ry * 0.6, C.hondo, 'xs', 0.55) +
      nube(cx + (enLaLuz ? -rx : rx) * 0.85, cy + 0.6, rx * 0.22, ry * 0.4, C.lilaHonda, 'xs', 0.9) +
      // El pliegue de arriba, pesado, y la bolsa de abajo: ojos de gente que durmió poco.
      trazo(`M${f(cx - rx - 1)} ${f(cy - ry - 1.6)} Q${f(cx)} ${f(cy - ry - 5.4)} ${f(cx + rx + 1.2)} ${f(cy - ry - 1.4)}`, C.negro, 1.1, 0.7) +
      `<g transform="translate(0.5 -0.9)">${trazo(`M${f(cx - rx * 0.6)} ${f(cy - ry - 3.2)} Q${f(cx)} ${f(cy - ry - 5.6)} ${f(cx + rx * 0.7)} ${f(cy - ry - 3)}`, C.plata, 0.6, enLaLuz ? 0.5 : 0.18)}</g>` +
      trazo(`M${f(cx - rx * 0.9)} ${f(cy + ry + 1.8)} Q${f(cx)} ${f(cy + ry + 4.6)} ${f(cx + rx)} ${f(cy + ry + 1.4)}`, C.lilaHonda, 1, 0.75) +
      nube(cx, cy + ry + 4.4, rx * 0.8, 1.6, enLaLuz ? C.pelo : C.hondo, 'xs', 0.7)
    );
  };

  const adentro =
    orejaAlla +
    forma(curva(CABEZA), C.hondo) +
    forma(silueta, C.hondo) +
    // La mitad de la luz: la coronilla, la frente, el lomo del hocico y el cachete de allá. Soplado
    // de a capas, de lo hondo a lo claro, como la frente de la cara del interior.
    // La bóveda de la frente.
    nube(16, -184, 20, 14, C.pelo, 'l', 0.95) +
    nube(22, -190, 10, 6, C.pelo, 'm', 0.8) +
    nube(-10, -198, 12, 6, C.pelo, 'm', 0.5) +
    // El hocico es un caño: prendido arriba, se apaga para abajo.
    soplo('M22 -176 Q44 -158 58 -138 Q66 -127 72 -118 L66 -112 Q56 -122 46 -134 Q32 -152 16 -168 Z', C.pelo, 'm', 0.9) +
    nube(52, -118, 16, 5, C.hondo, 'm', 0.55, 30) +
    // El pómulo de allá, debajo del ojo, y la cuenca de ese ojo, que se hunde.
    nube(38, -138, 9, 7, C.pelo, 'm', 0.55) +
    nube(21, -160, 11, 8, C.hondo, 'm', 0.55) +
    peinadoMojado(rnd, 170, enElipse(rnd, 6, -156, 60, 56), flujoDeLaCabeza, 3.2, 8, luzDeLaCabeza, (p) => enPoligono(CABEZA, p)) +
    // Lo más mojado, donde más pega la luz: la frente y el lomo del hocico, en la plata de la nariz de
    // la cara del interior. Borde blando arriba, cortado abajo, como el brillo de un caño.
    nube(18, -188, 10, 5, C.plata, 'm', 0.5) +
    soplo('M26 -184 Q42 -166 54 -148 Q62 -136 70 -124 L67.6 -122.4 Q59 -134 51 -146 Q38 -164 23 -181 Z', C.plata, 'xs', 0.7) +
    nube(40, -156, 4, 8, C.plata, 's', 0.35, -40) +
    // El canto que da a la puerta: la luz tibia de la calle por el vidrio roto.
    trazo('M-10 -203.4 Q12 -203.4 26 -192 Q36 -181 43 -165 Q53 -148 66 -131 Q72 -124 75 -116', C.llama, 1.8, 0.6) +
    `<g filter="url(#soplo-xs)">${trazo('M0 -203 Q18 -200 28 -190 Q38 -178 45 -162', C.llamaClara, 1.2, 0.55)}</g>` +
    // La mitad de la sombra: el cachete de acá, la nuca y abajo del hocico, casi negros.
    enmascarado('m-rato-sombra-cara', SOMBRA_CARA,
      forma(SOMBRA_CARA, C.hondo, 0.6) +
      nube(-30, -128, 12, 16, C.pelo, 'm', 0.18) +
      nube(30, -100, 26, 8, C.negro, 'm', 0.6)) +
    // El frío del agua, que le sube por abajo: el canto del cachete, la barbilla y abajo del hocico.
    nube(-40, -114, 5, 3, C.celeste, 's', 0.55, 40) +
    nube(-18, -95, 12, 2.6, C.celeste, 's', 0.5) +
    nube(20, -93, 10, 2, C.celeste, 's', 0.4) +
    nube(56, -102, 10, 1.6, C.celeste, 's', 0.3) +
    // Los ojos: el de acá en la sombra, el de allá en la luz, pegado al hocico.
    ojo(o1, false) +
    ojo(o2, true) +
    // La pintura de la murga, como en los cachetes de la cara del interior: una raya roja y una violeta
    // debajo, cruzadas de lado a lado. En la sombra casi no se ve.
    soplo('M-30 -137.6 Q-14 -141.6 2 -138.6 L2.4 -135.4 Q-14 -138.4 -30 -134.6 Z', C.rojo, 'xs', 0.45) +
    soplo('M-28 -132.2 Q-14 -135.4 0 -133 L0.2 -130.8 Q-14 -133 -28 -130 Z', C.lila, 'xs', 0.22) +
    soplo('M13 -146.6 Q24 -149.6 34 -145.6 L33.4 -142.4 Q24 -146 13 -143.4 Z', C.rojo, 'xs', 0.85) +
    soplo('M15 -141.4 Q24 -144 32 -140.8 L31.4 -138.6 Q24 -141.4 15 -139.2 Z', C.lila, 'xs', 0.5) +
    // La nariz: la almohadilla lila de la punta, con su plata y las dos ventanas.
    soplo('M66 -125 Q72 -129 77 -123 Q79 -116 75 -110 Q70 -106 66 -109 Q62 -114 66 -125 Z', C.lila, 'xs', 0.95) +
    nube(73, -123, 2.6, 1.8, C.plata, 'xs', 0.9) +
    nube(68, -111, 3, 1.6, C.lilaHonda, 'xs', 0.85) +
    soplo('M68.6 -115.6 Q71 -117.4 72.6 -115 Q71.4 -113 69.4 -113.6 Z', C.negro, 'xs', 0.9) +
    soplo('M74.4 -116 Q76.2 -117.4 77 -115 Q76 -113.4 74.6 -114 Z', C.negro, 'xs', 0.75) +
    // Debajo de la nariz, el labio partido y los dos dientes de oro, largos, de roedor.
    forma('M57.4 -104.6 L61.2 -104.6 L61.6 -89.6 Q60 -88.4 58.4 -89.6 Z', C.oroHondo) +
    forma('M61.4 -104.8 L65.4 -104.8 L65.2 -90.6 Q63.6 -89.2 62 -90.4 Z', C.oroHondo) +
    soplo('M58.4 -103.6 L60 -103.6 L60.4 -91 L59.2 -90.6 Z', C.oro, 'xs', 0.95) +
    soplo('M62.4 -103.8 L63.8 -103.8 L63.8 -91.6 L62.8 -91.2 Z', C.oro, 'xs', 0.85) +
    trazo('M61.3 -104.4 L61.6 -89.8', C.negro, 0.7, 0.6) +
    nube(59, -97, 0.7, 3, C.plata, 'xs', 0.9) +
    // El labio de arriba, que les tapa la raíz, partido debajo de la nariz.
    soplo('M54 -107 Q60 -103.6 66 -105.6 Q70 -103.6 74 -107.4 Q72 -110 68 -109.6 Q62 -109 54 -107 Z', C.lilaHonda, 'xs', 0.95) +
    trazo('M70 -109.4 Q69 -106.6 66 -105', C.negro, 0.9, 0.75) +
    // La comisura, que se va para atrás, y la barbilla mojada debajo.
    trazo('M56 -104 Q48 -102 40 -101.6', C.negro, 1.1, 0.65) +
    nube(46, -96, 9, 3, C.negro, 's', 0.55) +
    // Los poros de los bigotes, en el costado del hocico.
    [[54, -116], [58, -113], [62, -116], [56, -110], [60, -109], [64, -111], [52, -112]].map(([x, y]) => nube(x!, y!, 0.7, 0.6, C.negro, 'xs', 0.75)).join('') +
    brillos(m, 1223, 0.1, 0.35);
  return conGrano(enmascarado('m-rato-cabeza', [silueta, orejaD, dientes], adentro));
}

/** Un óvalo girado, en puntos (girando como el contorno de la cabeza, para que la máscara los sume). */
function ovalo([cx, cy]: P, [rx, ry]: P, giro: number, n = 28): P[] {
  const g = (giro * Math.PI) / 180;
  return Array.from({ length: n }, (_, i): P => {
    const a = (i / n) * Math.PI * 2;
    const [x, y] = [Math.cos(a) * rx, Math.sin(a) * ry];
    return [cx + x * Math.cos(g) - y * Math.sin(g), cy + x * Math.sin(g) + y * Math.cos(g)];
  });
}

/** La oreja de acá: redonda, pelada por adentro, que se sacude. */
const OREJA = { c: [-33, -190] as P, r: [16, 19] as P, giro: -24 };

function oreja(): string {
  const [cx, cy] = OREJA.c;
  const [rx, ry] = OREJA.r;
  // El canto de atrás va mojado, a mechones; el de adelante es piel.
  const base = muestrear(Array.from({ length: 16 }, (_, i): P => {
    const a = (i / 16) * Math.PI * 2;
    const g = (OREJA.giro * Math.PI) / 180;
    const [x, y] = [Math.cos(a) * rx, Math.sin(a) * ry];
    return [cx + x * Math.cos(g) - y * Math.sin(g), cy + x * Math.sin(g) + y * Math.cos(g)];
  }), 4);
  const m = mechones(base, [cx, cy], 26, 48, 4, 1231, 5, 0.4);
  const silueta = poli(m.pts);
  const adentro =
    forma(silueta, C.hondo) +
    // Adentro es piel: lila, fina, con el doblez del borde y lo hondo en el fondo, abajo.
    forma(poli(ovalo([cx + 2.4, cy + 0.6], [rx * 0.8, ry * 0.82], OREJA.giro)), C.lilaHonda) +
    nube(cx + 4, cy - 1.5, rx * 0.62, ry * 0.66, C.lila, 's', 1, OREJA.giro) +
    nube(cx + 5, cy - 3, rx * 0.42, ry * 0.46, C.lila, 'xs', 0.8, OREJA.giro) +
    nube(cx + 6, cy - 6, rx * 0.22, ry * 0.3, C.plata, 's', 0.4, OREJA.giro) +
    nube(cx - 1, cy + 9, rx * 0.36, ry * 0.26, C.lilaHonda, 's', 1) +
    nube(cx - 2, cy + 11, rx * 0.2, ry * 0.15, C.negro, 's', 0.6) +
    // El borde que da a la puerta: la luz de la calle le pasa por la piel fina.
    trazo(`M${f(cx + 2)} ${f(cy - ry + 0.6)} Q${f(cx + rx + 1)} ${f(cy - ry * 0.6)} ${f(cx + rx - 0.6)} ${f(cy + 4)}`, C.llama, 1.6, 0.6) +
    // El pliegue de adentro, y la luz que se mete de arriba a la derecha.
    trazo(`M${cx - 4} ${cy + 8} Q${cx + 2} ${cy - 2} ${cx + 4} ${cy - 12}`, C.lilaHonda, 1.6, 0.8) +
    nube(cx + 10, cy - 10, 3, 6, C.lila, 'xs', 0.6, OREJA.giro) +
    nube(cx + 12, cy - 13, 1.4, 4, C.llama, 'xs', 0.45, OREJA.giro) +
    nube(cx - 6, cy + 10, 8, 5, C.hondo, 's', 0.65) +
    brillos(m, 1237, 0.15, 0.4);
  return conGrano(enmascarado('m-rato-oreja', silueta, adentro));
}

/** Los bigotes: largos, caídos por el agua, con la gota en la punta. Los de allá salen del hocico; los de acá cruzan el cachete. */
const BIGOTES: ReadonlyArray<readonly [P, P, P]> = [
  [[64, -115], [86, -122], [106, -116]],
  [[65, -111], [88, -110], [108, -98]],
  [[64, -108], [82, -100], [98, -84]],
  [[61, -106], [72, -96], [84, -80]],
  [[56, -114], [38, -120], [20, -114]],
  [[56, -110], [36, -108], [22, -96]],
  [[57, -107], [44, -98], [36, -84]],
];

function bigotes(): string {
  const rnd = azar(1241);
  return BIGOTES.map(([a, b, c], i) => {
    const d = `M${f(a[0])} ${f(a[1])} Q${f(b[0])} ${f(b[1])} ${f(c[0])} ${f(c[1])}`;
    const alla = i < 4;
    return (
      trazo(d, C.negro, 1.1, 0.35) +
      `<g transform="translate(0 -0.5)">${trazo(d, C.plata, 0.55, alla ? 0.7 : 0.45)}</g>` +
      (rnd() < 0.6 ? `<circle cx="${f(c[0])}" cy="${f(c[1] + 1)}" r="${f(0.9 + rnd() * 0.5)}" fill="${C.plata}" opacity="0.7"/>` : '')
    );
  }).join('');
}

/* ------------------------------------------------------------------
   El cuerpo: la camisa colorada abierta, la cadena y el medallón
   ------------------------------------------------------------------ */

export const CUERPO: readonly P[] = [
  [-28, -98], [-38, -88], [-48, -78], [-57, -66], [-62, -50], [-63, -26], [-62, 0], [-60, 36], [56, 36], [58, 0], [58, -28], [56, -54],
  [50, -68], [40, -80], [28, -92], [18, -98],
];

/** El medallón de Momo en la tapa del frente (953 px): el centro y el radio. */
export const MEDALLON_EN_LA_TAPA = { x: 556, y: 500, r: 166 } as const;
/** Dónde le cuelga en el pecho, y de qué tamaño. */
export const MEDALLON = { x: 6, y: -48, r: 8.5 } as const;

function cadena(): string {
  // Los eslabones gordos, de oro, de un lado y del otro del cuello hasta el medallón.
  let s = '';
  const rnd = azar(1251);
  const tramo = (a: P, b: P, c: P, n: number): void => {
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * b[0] + t * t * c[0];
      const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * b[1] + t * t * c[1];
      const g = i % 2 ? 60 : -20 + rnd() * 10;
      s +=
        `<ellipse cx="${f(x)}" cy="${f(y)}" rx="3.4" ry="2.2" transform="rotate(${f(g)} ${f(x)} ${f(y)})" fill="none" stroke="${C.oroHondo}" stroke-width="1.7"/>` +
        `<ellipse cx="${f(x - 0.4)}" cy="${f(y - 0.5)}" rx="2.6" ry="1.4" transform="rotate(${f(g)} ${f(x)} ${f(y)})" fill="none" stroke="${C.oro}" stroke-width="0.7" opacity="${f(x > -4 ? 0.95 : 0.55)}"/>`;
    }
  };
  tramo([-22, -90], [-14, -62], [MEDALLON.x - 2, MEDALLON.y - MEDALLON.r - 2], 9);
  tramo([26, -92], [22, -64], [MEDALLON.x + 2, MEDALLON.y - MEDALLON.r - 2], 9);
  const { x, y, r } = MEDALLON;
  const T = MEDALLON_EN_LA_TAPA;
  const k = r / T.r;
  // El medallón: la cara del rey del carnaval, la tapa misma, recortada en redondo, con su argolla.
  const medalla =
    `<clipPath id="m-rato-medallon"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath>` +
    `<g clip-path="url(#m-rato-medallon)"><g transform="translate(${f(x)} ${f(y)}) scale(${k.toFixed(5)}) translate(${-T.x} ${-T.y})">` +
    `<image href="tapa:momo-sampler-frontal" x="0" y="0" width="953" height="953" preserveAspectRatio="none"/></g>` +
    // La luz de la puerta le pega de arriba a la derecha; abajo, el agua.
    nube(x + 4, y - 4, r * 0.6, r * 0.5, C.llamaClara, 's', 0.28) +
    nube(x - 3, y + 5, r * 0.7, r * 0.4, C.hondo, 's', 0.5) +
    `</g>` +
    `<circle cx="${x}" cy="${y}" r="${f(r + 0.3)}" fill="none" stroke="${C.peltre}" stroke-width="0.9"/>` +
    `<ellipse cx="${x}" cy="${f(y - r - 1.6)}" rx="2" ry="1.5" fill="none" stroke="${C.cromo}" stroke-width="1"/>`;
  return s + medalla;
}

function cuerpo(): string {
  const base = muestrear(CUERPO, 6);
  const silueta = poli(base);
  const rnd = azar(1261);
  // El pecho de pelo que deja ver la camisa abierta, y los dos paños de la camisa.
  const pecho = 'M-14 -96 Q-20 -60 -12 -24 Q-6 0 -2 40 L16 40 Q18 0 22 -26 Q28 -62 22 -96 Z';
  const panoAca = 'M-28 -98 L-14 -96 Q-20 -60 -12 -24 Q-6 0 -2 40 L-64 40 L-64 -40 Q-60 -72 -28 -98 Z';
  const panoAlla = 'M18 -98 L22 -96 Q28 -62 22 -26 Q18 0 16 40 L60 40 L60 -40 Q56 -72 18 -98 Z';
  // El cuello de la camisa, abierto, tirado sobre los hombros.
  const cuelloAca = 'M-28 -98 Q-20 -92 -14 -86 L-24 -66 Q-34 -76 -40 -86 Z';
  const cuelloAlla = 'M18 -98 Q24 -92 26 -86 L34 -70 Q38 -80 40 -86 Z';
  const adentro =
    forma(silueta, C.rojoHondo) +
    // La camisa de raso: el hombro de allá agarra la luz de la puerta; el de acá, apenas el brillo.
    nube(40, -62, 18, 22, C.rojo, 'l', 0.9) +
    nube(46, -70, 7, 9, C.plata, 'm', 0.3) +
    nube(52, -40, 6, 30, C.rojo, 'm', 0.6) +
    nube(-44, -66, 12, 12, C.rojo, 'm', 0.5) +
    nube(-56, -40, 4, 26, C.rojo, 's', 0.35) +
    // Los pliegues del raso, donde se pega mojado.
    [[-48, -54, -36, -20], [-40, -30, -30, -2], [34, -50, 42, -14], [44, -30, 50, -4]].map(([a, b, c, d]) => trazo(`M${a} ${b} Q${f((a! + c!) / 2 + 3)} ${f((b! + d!) / 2)} ${c} ${d}`, C.rojoHondo, 2.4, 0.6)).join('') +
    [[-46, -58, -34, -24], [36, -54, 44, -18]].map(([a, b, c, d]) => trazo(`M${a! + 1.6} ${b} Q${f((a! + c!) / 2 + 4.6)} ${f((b! + d!) / 2)} ${c! + 1.6} ${d}`, C.rojo, 1, 0.5)).join('') +
    // Mojada, la camisa se oscurece desde el agua para arriba.
    nube(0, 2, 70, 12, C.hondo, 'l', 0.75) +
    // El pecho de pelo, mojado, entre los dos paños.
    enmascarado('m-rato-pecho', pecho,
      forma(pecho, C.hondo) +
      nube(10, -70, 8, 18, C.pelo, 'm', 0.6) +
      mechas(rnd, 40, enElipse(rnd, 4, -50, 14, 46), () => Math.PI / 2 + 0.2, 6, ([x]) => Math.max(0, 0.3 + x / 20))) +
    // Los paños de la camisa por encima del pecho: el borde del lado de la luz agarra plata.
    `<path d="${panoAca}" fill="none" stroke="${C.negro}" stroke-width="1.4" opacity="0.4"/>` +
    trazo('M22 -94 Q27 -62 21 -26', C.plata, 0.9, 0.35) +
    trazo('M-13 -94 Q-19 -60 -11 -24', C.rojo, 1, 0.5) +
    forma(cuelloAca, C.rojoHondo) +
    nube(-26, -84, 6, 8, C.rojo, 's', 0.5) +
    trazo('M-28 -97 Q-36 -90 -40 -86', C.rojo, 1, 0.6) +
    forma(cuelloAlla, C.rojo) +
    nube(30, -84, 5, 7, C.plata, 's', 0.3) +
    trazo('M18 -97 Q24 -92 26 -86 L34 -70', C.rojoHondo, 0.9, 0.7) +
    // La sombra que tira la cabeza sobre el cuello.
    nube(2, -92, 26, 7, C.negro, 'm', 0.6) +
    cadena() +
    // El frío del agua, que le sube por el canto del cuerpo y la camisa.
    nube(-58, -8, 4, 10, C.celeste, 's', 0.45) +
    nube(54, -8, 4, 10, C.celeste, 's', 0.4) +
    // `panoAlla` queda como recorte del raso: el canto del paño contra el pecho.
    `<path d="${panoAlla}" fill="none" stroke="${C.negro}" stroke-width="1.2" opacity="0.3"/>`;
  return conGrano(enmascarado('m-rato-cuerpo', silueta, adentro));
}

/* ------------------------------------------------------------------
   Los brazos: dibujados derechos para arriba, desde el hombro
   ------------------------------------------------------------------ */

const L = A.largos;
const [H1, H2] = A.hombros;

/** La manga de raso, del hombro al codo. En el brazo de acá está corrida y se arruga en el codo. */
function brazo(n: 0 | 1): string {
  const s = A.hombros[n];
  const codo = dibujado(n).codo;
  const t = tubo([[s[0], s[1] + 8], [s[0], s[1] - L.brazo * 0.5], [codo[0], codo[1] - 3]], n === 0 ? [30, 27, 26] : [26, 23, 21]);
  const luzDerecha = 1;
  const [mx, my] = [s[0], (s[1] + codo[1]) / 2];
  const arrugas =
    n === 0
      ? [0, 1, 2, 3].map((i) => trazo(`M${f(s[0] - 12)} ${f(codo[1] + 4 + i * 4.6)} Q${f(s[0])} ${f(codo[1] + 1 + i * 4.6)} ${f(s[0] + 12)} ${f(codo[1] + 5 + i * 4.6)}`, C.rojoHondo, 2, 0.75)).join('') +
        [0, 1, 2].map((i) => trazo(`M${f(s[0] - 6)} ${f(codo[1] + 6 + i * 4.6)} Q${f(s[0] + 2)} ${f(codo[1] + 3.6 + i * 4.6)} ${f(s[0] + 10)} ${f(codo[1] + 6.6 + i * 4.6)}`, C.rojo, 0.9, 0.55)).join('')
      : '';
  return conGrano(
    enmascarado(`m-rato-brazo-${n + 1}`, t.d,
      forma(t.d, C.rojoHondo) +
      nube(mx + 6 * luzDerecha, my, 7, L.brazo * 0.5, C.rojo, 'm', n === 1 ? 0.95 : 0.6) +
      nube(mx + 9, my - 6, 2.4, L.brazo * 0.3, C.plata, 's', n === 1 ? 0.35 : 0.2) +
      nube(mx - 10, my, 5, L.brazo * 0.5, C.negro, 's', 0.45) +
      arrugas +
      nube(s[0], s[1] + 6, 16, 6, C.hondo, 's', 0.6)),
  );
}

/** El antebrazo de acá: pelado de la manga, con el pelo mojado que cuelga hacia el codo. */
function antebrazo1(): string {
  const { codo, puno } = dibujado(0);
  const eje: P[] = [[codo[0], codo[1] + 4], [codo[0], (codo[1] + puno[1]) / 2], [puno[0], puno[1] + 4]];
  const t = tubo(eje, [22, 19, 15], 16);
  // Los mechones cuelgan del canto de afuera y de adentro, para el codo.
  const contorno = muestrear([...t.izq, ...[...t.der].reverse()].filter((_, i) => i % 2 === 0), 3);
  const m = mechones(contorno, [codo[0], (codo[1] + puno[1]) / 2], 0, contorno.length, 4.5, 1271, 5, 0.85);
  const silueta = poli(m.pts);
  const rnd = azar(1277);
  const adentro =
    forma(silueta, C.hondo) +
    nube(codo[0] + 5, (codo[1] + puno[1]) / 2, 5, 22, C.pelo, 'm', 0.85) +
    nube(codo[0] + 7, (codo[1] + puno[1]) / 2 - 8, 1.8, 14, C.plata, 's', 0.4) +
    mechas(rnd, 40, enElipse(rnd, codo[0], (codo[1] + puno[1]) / 2, 8, 24), () => Math.PI / 2, 6, ([x]) => Math.max(0, (x - codo[0] + 2) / 10)) +
    brillos(m, 1279, 0.18, 0.45);
  return conGrano(enmascarado('m-rato-antebrazo-1', silueta, adentro));
}

/**
 * Una mano de rata: el dorso lila, cuatro dedos largos y pelados que se cierran, y las uñas. `abierta`
 * dice para dónde van los dedos (la de las botas los cierra sobre las manijas, la del porrón sobre el vidrio).
 */
function mano([x, y]: P, lado: 1 | -1, id: string): string {
  // El puño visto de frente: la fila de nudillos arriba, los dedos largos doblados para abajo con las
  // uñas que asoman curvas, y el pulgar del costado de `lado`. Pelado, en el lila de la contratapa.
  const dorso = curva([[x - 8, y + 5], [x - 9, y - 2], [x - 7, y - 8], [x - 1, y - 10], [x + 6, y - 9], [x + 9, y - 3], [x + 8.6, y + 4], [x + 4, y + 7.4], [x - 3, y + 7.6]]);
  const pulgar = poli(ovalo([x + lado * 8.4, y - 1], [2.8, 4.6], 0, 16));
  const nudillos = [-5.4, -1.8, 1.8, 5.4];
  return enmascarado(id, [dorso, pulgar],
    forma(dorso, C.lilaHonda) +
    nube(x + 1, y - 4, 7, 5, C.lila, 's', 0.75) +
    nube(x - 4, y + 4, 5, 4, C.hondo, 's', 0.6) +
    // Los nudillos, prendidos por la luz de arriba, y los pliegues entre dedo y dedo.
    nudillos.map((dx) => nube(x + dx + 0.4, y - 6.6, 1.7, 1.3, C.lila, 'xs', 0.95) + nube(x + dx + 0.6, y - 7.2, 0.7, 0.5, C.plata, 'xs', 0.6)).join('') +
    [-3.6, 0, 3.6].map((dx) => trazo(`M${f(x + dx)} ${f(y - 5.4)} L${f(x + dx - 0.2)} ${f(y + 2.4)}`, C.negro, 0.7, 0.55)).join('') +
    trazo(`M${f(x - 7.4)} ${f(y - 1.6)} Q${f(x)} ${f(y - 0.4)} ${f(x + 7.6)} ${f(y - 1.8)}`, C.lilaHonda, 0.9, 0.9) +
    // Las uñas, del cromo del medallón, chicas y curvas, abajo de cada dedo.
    nudillos.map((dx) => trazo(`M${f(x + dx - 0.6)} ${f(y + 3.4)} q${f(0.8)} ${f(1.6)} ${f(-0.4)} ${f(3)}`, C.medallon, 0.8, 0.8)).join('') +
    forma(pulgar, C.lilaHonda) +
    nube(x + lado * 8.4, y - 2.4, 1.6, 3, C.lila, 'xs', 0.8) +
    // La muñeca, donde empieza el pelo mojado.
    nube(x, y + 8, 9, 3, C.hondo, 's', 0.9));
}

/** El puño de acá, cerrado sobre las manijas de las botas: va encima de ellas. */
function puno1(): string {
  const { puno } = dibujado(0);
  return conGrano(mano(puno, 1, 'm-rato-puno-1'));
}

/**
 * El antebrazo de allá, con la manga hasta la muñeca (con esa se seca la nariz) y el porrón en la mano,
 * torcido contra el antebrazo como lo agarra el que lo tiene de la panza.
 */
function antebrazo2(): string {
  const { codo, puno } = dibujado(1);
  const t = tubo([[codo[0], codo[1] + 4], [codo[0], (codo[1] + puno[1]) / 2], [puno[0], puno[1] + 10]], [21, 19, 17], 14);
  const [mx, my] = [codo[0], (codo[1] + puno[1]) / 2];
  const manga = enmascarado('m-rato-manga-2', t.d,
    forma(t.d, C.rojoHondo) +
    nube(mx + 5, my, 6, 24, C.rojo, 'm', 0.95) +
    nube(mx + 7.5, my - 4, 1.8, 16, C.plata, 's', 0.32) +
    nube(mx - 8, my, 4, 24, C.negro, 's', 0.4) +
    // El puño de la camisa, con su botón, y la manga mojada que se le pega.
    trazo(`M${f(puno[0] - 9)} ${f(puno[1] + 12)} L${f(puno[0] + 9)} ${f(puno[1] + 11)}`, C.rojoHondo, 2, 0.9) +
    nube(puno[0] + 5, puno[1] + 14, 1.4, 1.4, C.oro, 'xs', 0.8) +
    nube(mx, codo[1] - 4, 10, 5, C.hondo, 's', 0.5));
  const g = A.porron;
  const [px, py] = puno;
  return conGrano(manga + `<g transform="rotate(${g} ${f(px)} ${f(py)})">${mano(puno, -1, 'm-rato-mano-2')}</g>`);
}

/**
 * El porrón: vidrio color ámbar del oro de las letras, con la chapita y la plata del reflejo. Va en el
 * puño de allá, torcido contra el antebrazo, y gira adentro del puño (`Gesto.porron`): lo da vuelta
 * para secarse la nariz y lo levanta para brindar. Se dibuja detrás de la mano, que lo agarra.
 */
function porron(): string {
  const g = A.porron;
  const [px, py] = dibujado(1).puno;
  const vidrio = 'M-9 22 L-9 -4 Q-9 -14 -4 -18 L-3.4 -34 L3.4 -34 L4 -18 Q9 -14 9 -4 L9 22 Q0 24.6 -9 22 Z';
  return conGrano(
    `<g transform="translate(${f(px)} ${f(py)}) rotate(${g})">` +
    enmascarado('m-rato-porron', vidrio,
      forma(vidrio, C.oroHondo) +
      nube(-5, 0, 3, 26, C.hondo, 's', 0.75) +
      nube(4, -2, 3, 22, C.oro, 's', 0.7) +
      nube(5, -6, 1.2, 16, C.plata, 'xs', 0.9) +
      nube(1, -26, 1, 6, C.plata, 'xs', 0.7) +
      nube(0, 18, 9, 3, C.negro, 's', 0.5) +
      // La cerveza adentro, hasta la mitad: la línea del líquido.
      trazo('M-9 2 Q0 3.2 9 2', C.oro, 0.8, 0.6)) +
    forma('M-4.2 -34 L4.2 -34 L4.4 -37.2 L-4.4 -37.2 Z', C.oro) +
    trazo('M-4.4 -36.6 L4.4 -36.6', C.oroHondo, 0.8, 0.8) +
    `</g>`,
  );
}

/* ------------------------------------------------------------------
   Las botas nuevas: negras y plateadas como el medallón
   ------------------------------------------------------------------ */

/**
 * El par cuelga de las manijas: la de atrás corrida y más oscura. Se dibujan colgando derecho del puño
 * de acá (en el brazo dibujado derecho), con la punta para la derecha. Una tiene todavía la etiqueta.
 */
function botas(): string {
  const [hx, hy] = dibujado(0).puno;
  const largo = BOTAS.largo;
  const una = (dx: number, dy: number, atras: boolean, id: string): string => {
    const x = hx + dx;
    const y = hy + dy;
    // La caña, el empeine, la punta y el taco: de la boca (arriba) a la suela.
    const caña: P[] = [[x - 8, y + 12], [x + 8, y + 11], [x + 7, y + 38], [x + 8, y + largo - 24], [x + 13, y + largo - 16], [x + 24, y + largo - 12], [x + 29.5, y + largo - 7], [x + 28, y + largo - 1], [x - 3, y + largo], [x - 9, y + largo], [x - 10, y + largo - 8], [x - 8.5, y + largo - 26], [x - 9.5, y + 38]];
    const d = curva(caña);
    const manijas =
      trazo(`M${f(x - 5)} ${f(y + 13)} Q${f(x - 4)} ${f(y + 2)} ${f(hx - 1)} ${f(hy - 2)}`, atras ? C.hondo : C.peltre, 2.4, 0.95) +
      trazo(`M${f(x + 5)} ${f(y + 12)} Q${f(x + 4)} ${f(y + 2)} ${f(hx + 1)} ${f(hy - 2)}`, atras ? C.hondo : C.peltre, 2.4, 0.95);
    return (
      manijas +
      enmascarado(id, d,
        forma(d, C.negro) +
        // El charol: la caña es un caño, con la plata que corre de arriba a abajo del lado de la luz.
        nube(x + 4, y + 40, 3.4, 26, atras ? C.peltre : C.cromo, 'm', atras ? 0.4 : 0.7) +
        nube(x + 5, y + 36, 1.2, 20, C.medallon, 'xs', atras ? 0.3 : 0.85) +
        nube(x - 7, y + 40, 2, 24, C.peltre, 's', atras ? 0.15 : 0.3) +
        // La boca de la caña, por donde se ve lo negro de adentro.
        `<ellipse cx="${f(x)}" cy="${f(y + 12)}" rx="9" ry="2.4" fill="${C.hondo}"/>` +
        trazo(`M${f(x - 9)} ${f(y + 12)} Q${f(x)} ${f(y + 15)} ${f(x + 9)} ${f(y + 11.6)}`, C.peltre, 0.8, 0.7) +
        // La punta y el taco de metal, plateados.
        soplo(`M${f(x + 18)} ${f(y + largo - 13)} Q${f(x + 30)} ${f(y + largo - 10)} ${f(x + 30)} ${f(y + largo - 3)} L${f(x + 18)} ${f(y + largo - 2)} Z`, atras ? C.peltre : C.cromo, 'xs', 0.95) +
        nube(x + 25, y + largo - 9, 2.4, 1.4, C.medallon, 'xs', atras ? 0.4 : 0.95) +
        forma(`M${f(x - 11)} ${f(y + largo - 6)} L${f(x - 3)} ${f(y + largo - 6)} L${f(x - 3)} ${f(y + largo)} L${f(x - 10)} ${f(y + largo)} Z`, atras ? C.peltre : C.cromo) +
        // La suela, el pliegue del empeine y la costura.
        trazo(`M${f(x - 10)} ${f(y + largo - 0.6)} L${f(x + 28)} ${f(y + largo - 1.4)}`, C.peltre, 1.2, 0.8) +
        trazo(`M${f(x + 9)} ${f(y + largo - 22)} Q${f(x + 6)} ${f(y + largo - 14)} ${f(x + 12)} ${f(y + largo - 9)}`, C.peltre, 0.8, 0.5) +
        // La luz tibia de la puerta en el canto de la derecha.
        nube(x + 9, y + 34, 1.2, 18, C.llama, 'xs', atras ? 0.2 : 0.55))
    );
  };
  // La etiqueta de las botas nuevas, colgada de la manija de la de adelante con su hilo.
  const [ex, ey] = [hx + 12, hy + 26];
  const etiqueta =
    trazo(`M${f(hx + 4)} ${f(hy + 8)} Q${f(hx + 12)} ${f(hy + 14)} ${f(ex)} ${f(ey - 5)}`, C.blanco, 0.6, 0.8) +
    `<g transform="rotate(14 ${f(ex)} ${f(ey)})">` +
    forma(`M${f(ex - 4)} ${f(ey - 4)} L${f(ex + 4)} ${f(ey - 4)} L${f(ex + 4)} ${f(ey + 5)} L${f(ex - 4)} ${f(ey + 5)} Z`, C.blanco) +
    `<circle cx="${f(ex)}" cy="${f(ey - 2.4)}" r="0.8" fill="${C.hondo}"/>` +
    nube(ex - 2, ey + 3, 3, 2, C.hondo, 'xs', 0.35) +
    `</g>`;
  return conGrano(una(13, -7, true, 'm-rato-bota-atras') + una(0, 0, false, 'm-rato-bota') + etiqueta);
}

/* ------------------------------------------------------------------
   La cola, que flota detrás de él
   ------------------------------------------------------------------ */

const COLA_EJE: readonly P[] = [[-22, -6], [-46, -8], [-70, -17], [A.punta[0], A.punta[1]]];
const PUNTA_EJE: readonly P[] = [[A.punta[0] + 2, A.punta[1]], [-114, -14], [-130, -8], [-146, -10], [-158, -18]];

/** Un tramo de la cola: pelada, lila, con los anillos de escamas y la plata mojada encima. */
function tramoDeCola(eje: readonly P[], anchos: readonly number[], id: string, semilla: number): string {
  const t = tubo(eje, anchos, 24);
  // El lomo de la cola es el canto de arriba; el de abajo toca el agua.
  const [arriba, abajo] = t.izq[4]![1] < t.der[4]![1] ? [t.izq, t.der] : [t.der, t.izq];
  const rnd = azar(semilla);
  let anillos = '';
  for (let k = 1; k < 26; k++) {
    const { p, dir, ancho } = t.muestra(k / 26 + (rnd() - 0.5) * 0.01);
    const [nx, ny] = [dir[1], -dir[0]];
    anillos += trazo(`M${f(p[0] + nx * ancho * 0.45)} ${f(p[1] + ny * ancho * 0.45)} L${f(p[0] - nx * ancho * 0.45)} ${f(p[1] - ny * ancho * 0.45)}`, C.hondo, 0.45, 0.35);
  }
  const lomo = arriba.map(([x, y], i) => {
    const [bx, by] = abajo[i]!;
    return [x + (bx - x) * 0.28, y + (by - y) * 0.28] as P;
  });
  return conGrano(
    enmascarado(id, t.d,
      forma(t.d, C.lilaHonda) +
      soplo(curva([...arriba, ...[...lomo].reverse()]), C.lila, 'xs', 0.75) +
      `<g filter="url(#soplo-xs)">${trazo(curva(abajo, false), C.hondo, 2.4, 0.75)}</g>` +
      anillos +
      `<g filter="url(#soplo-xs)">${trazo(curva(lomo, false), C.plata, 0.9, 0.55)}</g>`),
  );
}

const cola = (): string => tramoDeCola(COLA_EJE, [11, 9, 8, 7], 'm-rato-cola', 1281);
const punta = (): string => tramoDeCola(PUNTA_EJE, [7, 6, 4.4, 3, 1.6], 'm-rato-punta', 1283);

/* ------------------------------------------------------------------
   Las tiras del reflejo
   ------------------------------------------------------------------ */

/** La máscara que corta el reflejo del rato en tiras, como el agua corta el de Pierre (`bajo-ondas`). */
export const TIRAS = { x: 28, ancho: 180, alto: 150 } as const;

function tiras(): string {
  const rnd = azar(1291);
  const { agua } = R;
  let s = `<rect x="${TIRAS.x - 2}" y="${agua - 2}" width="${TIRAS.ancho + 4}" height="${TIRAS.alto + 4}" fill="black"/>`;
  for (let y = agua + 1; y < agua + TIRAS.alto; y += 2.4 + rnd() * 2.2) {
    const k = (y - agua) / TIRAS.alto;
    for (let x = TIRAS.x + rnd() * 10; x < TIRAS.x + TIRAS.ancho; x += 4 + rnd() * 12) {
      const largo = 14 + rnd() * 40;
      s += trazo(`M${f(x)} ${f(y)} l${f(largo)} 0`, 'white', 1.8 + rnd() * 2.2, Math.max(0, (1 - k * 1.15) * (0.6 + rnd() * 0.4)));
      x += largo;
    }
  }
  return s;
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

/** La densidad la pide la ficha, que lo muestra de cerca. En la escena sobra. */
const D = 3.2;

const { codo: CODO1, puno: PUNO1 } = dibujado(0);
const { codo: CODO2, puno: PUNO2 } = dibujado(1);

export const PIEZAS_RATO: readonly Pieza[] = [
  { nombre: 'rato-cola', caja: cajaDe(COLA_EJE, 9), dibujo: cola(), densidad: D },
  { nombre: 'rato-punta', caja: cajaDe(PUNTA_EJE, 7), dibujo: punta(), densidad: D },
  { nombre: 'rato-cuerpo', caja: cajaDe(CUERPO, 4), dibujo: cuerpo(), densidad: D },
  { nombre: 'rato-brazo-2', caja: [H2[0] - 16, CODO2[1] - 8, 32, L.brazo + 24], dibujo: brazo(1), densidad: D },
  { nombre: 'rato-antebrazo-2', caja: [CODO2[0] - 16, PUNO2[1] - 14, 32, L.antebrazo + 22], dibujo: antebrazo2(), densidad: D },
  { nombre: 'rato-porron', caja: [PUNO2[0] - 33, PUNO2[1] - 38, 59, 66], dibujo: porron(), densidad: D },
  { nombre: 'rato-cabeza', caja: [-62, -228, 142, 152], dibujo: cabeza(), densidad: D * 1.3 },
  { nombre: 'rato-oreja', caja: [-56, -216, 46, 50], dibujo: oreja(), densidad: D * 1.3 },
  { nombre: 'rato-bigotes', caja: [14, -130, 100, 56], dibujo: bigotes(), densidad: D * 1.3 },
  { nombre: 'rato-brazo-1', caja: [H1[0] - 18, CODO1[1] - 8, 36, L.brazo + 24], dibujo: brazo(0), densidad: D },
  { nombre: 'rato-antebrazo-1', caja: [CODO1[0] - 16, PUNO1[1] - 4, 32, L.antebrazo + 16], dibujo: antebrazo1(), densidad: D },
  { nombre: 'rato-botas', caja: [PUNO1[0] - 16, PUNO1[1] - 6, 62, BOTAS.largo + 10], dibujo: botas(), densidad: D },
  { nombre: 'rato-puno-1', caja: [PUNO1[0] - 12, PUNO1[1] - 18, 24, 30], dibujo: puno1(), densidad: D * 1.3 },
  { nombre: 'rato-tiras', caja: [TIRAS.x, R.agua, TIRAS.ancho, TIRAS.alto], dibujo: tiras(), opaca: true, densidad: 1 },
];

const img = imagenesDe(PIEZAS_RATO);
const parte = (nombre: string, cuerpo: string, transform = ''): string => `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}>${cuerpo}</g>`;

/** Los ojos de la página: el iris lila, la pupila, el brillo y el párpado pesado. Van adentro de la cabeza. */
function ojos(t: Readonly<Record<string, string>>): string {
  return A.ojos
    .map(({ centro: [cx, cy], radio: [rx, ry] }, i) => {
      const n = i + 1;
      const [px, py] = PIVOTES_PARPADO[i]!;
      const r = ry * 0.82;
      return (
        `<clipPath id="ID-ojo-${n}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath>` +
        `<g clip-path="url(#ID-ojo-${n})">` +
        `<g data-parte="pupila-${n}" transform="${t[`pupila-${n}`]}">` +
        `<circle cx="${cx}" cy="${cy}" r="${f(r)}" class="bt-rato-iris"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${f(r * 0.48)}" class="bt-rato-pupila"/>` +
        `<circle cx="${f(cx + r * 0.32)}" cy="${f(cy - r * 0.36)}" r="${f(r * 0.24)}" class="bt-rato-brillo"/></g>` +
        `<ellipse data-parte="parpado-${n}" data-pivote="${px} ${py}" cx="${cx}" cy="${f(cy - 0.3)}" rx="${f(rx + 1.2)}" ry="${f(ry + 1)}" class="${n === 1 ? 'bt-rato-parpado-hondo' : 'bt-rato-parpado'}" transform="${t[`parpado-${n}`]}"/>` +
        `</g>`
      );
    })
    .join('');
}

/** El destello de los dientes de oro cuando brinda: una cruz de luz chica, como el diente de la contratapa. */
function destello(t: Readonly<Record<string, string>>): string {
  const [x, y] = A.dientes;
  return (
    `<g data-parte="brillo" opacity="${t.brillo}">` +
    `<path d="M${x - 7} ${y} L${x + 7} ${y} M${x} ${y - 7} L${x} ${y + 7}" class="bt-rato-destello"/>` +
    `<circle cx="${x}" cy="${y}" r="1.6" class="bt-rato-chispa"/></g>`
  );
}

/** El rato armado con las transformaciones de un gesto (`transformes`, `rig-rato.ts`). `ID` se cambia por el prefijo. */
function armado(t: Readonly<Record<string, string>>): string {
  // El brazo del porrón va delante de la cabeza: cuando se seca la nariz, la manga le pasa por abajo.
  return (
    img('rato-cuerpo') +
    parte('cabeza', img('rato-cabeza') + ojos(t) + destello(t) + parte('bigotes', img('rato-bigotes'), t.bigotes) + parte('oreja', img('rato-oreja'), t.oreja), t.cabeza) +
    parte('brazo-2', img('rato-brazo-2') + parte('antebrazo-2', parte('porron', img('rato-porron'), t.porron) + img('rato-antebrazo-2'), t['antebrazo-2']), t['brazo-2']) +
    parte('brazo-1', img('rato-brazo-1') + parte('antebrazo-1', img('rato-antebrazo-1') + parte('botas', img('rato-botas'), t.botas) + img('rato-puno-1'), t['antebrazo-1']), t['brazo-1'])
  );
}

/** La cola flota detrás, en el agua: va aparte del cuerpo, que es lo que se refleja. */
const laCola = (t: Readonly<Record<string, string>>): string =>
  parte('cola', img('rato-cola') + parte('punta', img('rato-punta'), t.punta), t.cola);

/**
 * El agua alrededor: las ondas de atrás (detrás de él), las de adelante (cortadas en la línea del
 * agua), el agua que chorrea de las botas y las gotas. Todo arranca apagado: lo prende la isla.
 */
const ONDAS = 3;
function ondas(lado: 'atras' | 'adelante'): string {
  let s = '';
  for (let i = 1; i <= ONDAS; i++) s += `<ellipse data-parte="onda-${lado}-${i}" class="bajo-onda" cx="${R.x}" cy="${R.agua}" rx="20" ry="2.6" opacity="0"/>`;
  return s;
}

/**
 * Todo el rato, en un gesto, con un prefijo para los ids (la escena y la ficha no pueden compartirlos).
 * Con `toque`, el grupo que se toca; sin él, el títere quieto para la ficha.
 */
export function ratoEn(g: Gesto | 'nada' | 'brinda' = 'nada', prefijo = 'rato', nombres?: Nombres): string {
  const gesto = typeof g === 'string' ? GESTOS[g] : g;
  const t = transformes(gesto);
  const { agua } = R;
  const id = (s: string): string => `${prefijo}-${s}`;
  const cuerpo = armado(t).replaceAll('ID-ojo-', id('ojo-'));
  const tocable = nombres
    ? `<g class="titere titere--rato" data-id="el-rato-molhado" role="button" tabindex="0" aria-label="${nombres.get('el-rato-molhado') ?? 'El rato molhado'}">`
    : '<g>';
  return (
    // Lo de atrás: las ondas que pasan por detrás de él.
    `<g aria-hidden="true" pointer-events="none">${ondas('atras')}</g>` +
    `<clipPath id="${id('seco')}"><rect x="-10" y="-10" width="920" height="${agua + 10}"/></clipPath>` +
    `<clipPath id="${id('mojado')}"><rect x="-10" y="${agua}" width="920" height="${640 - agua + 10}"/></clipPath>` +
    `<mask id="${id('tiras')}" maskUnits="userSpaceOnUse" x="${TIRAS.x}" y="${agua}" width="${TIRAS.ancho}" height="${TIRAS.alto}">${img('rato-tiras')}</mask>` +
    `<g clip-path="url(#${id('seco')})">` +
    tocable +
    parte('flota', laCola(t), t.entero) +
    `<g id="${id('entero')}" data-parte="entero" transform="${t.entero}">${cuerpo}</g>` +
    `</g>` +
    // El agua que le sale a las botas cuando las vuelca, y las gotas que le caen del hocico.
    `<g aria-hidden="true" pointer-events="none">` +
    `<path data-parte="chorro" class="bajo-chorro" d="M0 0 L0 1" opacity="0"/>` +
    [1, 2, 3].map((n) => `<circle data-parte="gota-${n}" class="bt-rato-gota" cx="${R.x}" cy="${agua - 40}" r="1.3" opacity="0"/>`).join('') +
    `</g></g>` +
    // El reflejo: el rato dado vuelta en el agua, cortado en tiras, apagado. Lo de abajo del agua no.
    `<g class="bajo-reflejo" aria-hidden="true" pointer-events="none" clip-path="url(#${id('mojado')})" mask="url(#${id('tiras')})">` +
    `<g transform="translate(0 ${agua * 2}) scale(1 -1)"><g data-parte="reflejo"><use href="#${id('entero')}"/></g></g></g>` +
    // Lo de adelante: las ondas, cortadas donde el agua lo toca, y el anillo de agua pegado al pecho.
    `<g aria-hidden="true" pointer-events="none" clip-path="url(#${id('mojado')})">` +
    `<ellipse class="bajo-onda" cx="${R.x - 1}" cy="${agua + 0.6}" rx="${f(60 * R.escala)}" ry="3" opacity="0.3"/>` +
    ondas('adelante') +
    `</g>`
  );
}

/** El títere que se toca, en la pose quieta: nadando con el agua al pecho, las botas en alto. */
const titere = (nombres: Nombres): string => ratoEn('nada', 'rato', nombres);

/**
 * El retrato de la ficha: brindando, con el pecho afuera, sobre su pedazo del bajo (la pared y el agua,
 * que la página ya cargó), así no brinda en el aire.
 */
export const RETRATO = { caja: [16, 296, 180, 214] as const };
function retrato(): string {
  const fondo = (nombre: string, y = 0, alto = 640): string => `<image href="/bestiario/${nombre}.webp" x="0" y="${y}" width="900" height="${alto}" preserveAspectRatio="none"/>`;
  return fondo('bajo-lejos') + fondo('bajo-agua', 368, 272) + ratoEn('brinda', 'rato-ficha');
}

export const RATO: Personaje = {
  id: 'el-rato-molhado',
  region: 'el-bajo',
  ancla: R.x,
  piezas: PIEZAS_RATO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
