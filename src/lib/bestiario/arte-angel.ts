/**
 * El ángel de la soledad (`D-73`, decimoséptima vuelta), al pie del árbol del gran bonete.
 *
 * *"Y caes en manos / del Ángel de la soledad / tampoco cree en lo que oye"* es de *Un ángel para tu
 * soledad*, del disco 1 de *Lobo suelto, cordero atado* (1993). No está en ninguna tapa: se inventa en
 * la de su disco. La contratapa de ese disco es un aerógrafo sepia de pliegues blandos, cortados por
 * máscaras de papel con el borde serruchado, que dejan una fila de dientes de luz. **El ángel está
 * soplado en ese sepia**: la túnica son los pliegues y **las plumas son los dientes**, filas de borde
 * serruchado que se pisan como las tejas. La cara es la grisalla del lobo del frente: las cuencas hondas
 * y un ojo más grande que el otro, que mira de reojo. Las tintas se midieron en la contratapa
 * (`--bestia-angel-*`); la luz roja de la llanura le pega de abajo y la violeta del cielo, de atrás.
 *
 * Cerradas, las alas lo envuelven como una capa y le tapan los brazos: así está en la estampa, *"con las
 * alas cerradas"*. Abiertas, se despliegan para arriba y para afuera, y aparecen las manos.
 *
 * Coordenadas del títere: el (0, 0) es la tierra entre los pies, arriba es negativo (`ANGEL_ARMADO`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { azar } from './pincel.ts';
import { ABIERTO, ALA_ADENTRO, ALA_CANTO, ANGEL_ARMADO, LUGAR, QUIETA, marcas, type Momento, type Punto } from './rig-angel.ts';

type P = Punto;
const f = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Las tintas de la contratapa de *Lobo suelto* (`tokens.css`), y las del árbol que le pegan. */
const C = {
  hondo: 'var(--bestia-angel-hondo)',
  sepia: 'var(--bestia-angel-sepia)',
  medio: 'var(--bestia-angel-medio)',
  crema: 'var(--bestia-angel-crema)',
  luz: 'var(--bestia-angel-luz)',
  frio: 'var(--bestia-angel-frio)',
  cielo: 'var(--entorno-arbol-nube)',
  violeta: 'var(--entorno-arbol-violeta)',
  rojo: 'var(--entorno-arbol-tierra-viva)',
  tierra: 'var(--entorno-arbol-tierra-honda)',
  plata: 'var(--disco-momo-sampler-tinta)',
  peltre: 'var(--disco-momo-sampler-apoyo)',
  papel: 'var(--papel)',
  negro: 'var(--fondo)',
};

const A = ANGEL_ARMADO;

/* ------------------------------------------------------------------
   Herramientas: la curva y el serrucho
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

const poli = (pts: readonly P[]): string => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;
const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;
const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;

/**
 * Una fila de dientes de serrucho de `a` a `b`, con `n` dientes que salen `hondo` para el lado de
 * `hacia` (por defecto, para abajo). Es el borde de la máscara de papel de la contratapa.
 */
function serrucho(a: P, b: P, n: number, hondo: number, rnd: () => number, hacia: P = [0, 1]): P[] {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const l = Math.hypot(dx, dy) || 1;
  let [nx, ny] = [-dy / l, dx / l];
  if (nx * hacia[0] + ny * hacia[1] < 0) [nx, ny] = [-nx, -ny];
  const pts: P[] = [a];
  for (let i = 0; i < n; i++) {
    // El diente se inclina para el lado de `b`, como una pluma que apunta a la punta.
    const t = (i + 0.72 + (rnd() - 0.5) * 0.16) / n;
    const h = hondo * (0.75 + rnd() * 0.5);
    pts.push([a[0] + dx * t + nx * h, a[1] + dy * t + ny * h]);
    pts.push([a[0] + (dx * (i + 1)) / n, a[1] + (dy * (i + 1)) / n]);
  }
  return pts;
}

/* ------------------------------------------------------------------
   La túnica
   ------------------------------------------------------------------ */

/** La túnica: del cuello al ruedo, que termina en serrucho; asoman los dedos de los pies. */
function tunica(): string {
  const rnd = azar(1701);
  const ruedo = serrucho([33, -6], [-33, -6], 9, 6, rnd);
  const lados: P[] = [[-29, -52], [-27, -104], [-25, -142], [-21, -157], [-9, -167], [9, -167], [21, -157], [25, -142], [27, -104], [29, -52]];
  const d = curva(lados, false).replace(/^M/, `M${f(ruedo.at(-1)![0])} ${f(ruedo.at(-1)![1])} L`) + ` L${ruedo.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;
  // Los pliegues: bandas blandas que bajan de los hombros y se abren hacia el ruedo.
  let pliegues = '';
  for (const [x0, x1, color, o] of [
    [-16, -22, C.hondo, 0.75], [-5, -6, C.hondo, 0.55], [9, 13, C.hondo, 0.7], [20, 26, C.hondo, 0.6],
    [-10, -14, C.crema, 0.65], [2, 3, C.crema, 0.55], [15, 19, C.crema, 0.45],
  ] as const) pliegues += soplo(`M${f(x0 - 1.6)} -150 Q${f((x0 + x1) / 2 - 3)} -80 ${f(x1 - 2.6)} -6 L${f(x1 + 2.6)} -6 Q${f((x0 + x1) / 2 + 3)} -80 ${f(x0 + 1.6)} -150 Z`, color, 's', o);
  // Los dientes de luz del ruedo: la máscara serruchada deja un filo claro arriba de cada diente.
  let filos = '';
  for (let i = 1; i < ruedo.length - 1; i += 2) {
    const [x, y] = ruedo[i]!;
    filos += forma(poli([[x - 3.4, y - 7], [x, y - 1.2], [x + 3.4, y - 7], [x, y - 4.4]]), C.luz, 0.55);
  }
  const pies =
    forma(curva([[-12, -3], [-9, -6], [-4, -5], [-2, -1], [-7, 0.6], [-12, 0]]), C.crema) + nube(-7, -1, 4, 1.6, C.sepia, 'xs', 0.7) +
    forma(curva([[3, -4], [8, -6], [13, -4], [14, -0.6], [9, 0.6], [4, 0]]), C.crema) + nube(9, -1, 4, 1.6, C.sepia, 'xs', 0.7);
  return conGrano(
    pies +
    enmascarado('m-angel-tunica', d,
      forma(d, C.medio) +
      // La luz de arriba a la izquierda, y lo hondo de abajo, donde la tierra roja le devuelve la luz.
      nube(-8, -146, 26, 18, C.crema, 'l', 0.55) +
      // El escote: la sombra del mentón sobre el cuello de la túnica.
      nube(2, -164, 11, 5, C.hondo, 's', 0.8) + nube(0, -158, 16, 6, C.sepia, 'm', 0.6) +
      nube(14, -60, 22, 70, C.sepia, 'l', 0.55) +
      pliegues +
      nube(0, -2, 40, 14, C.rojo, 'm', 0.5) + nube(0, 4, 40, 8, C.tierra, 's', 0.6) +
      nube(-30, -90, 4, 70, C.cielo, 's', 0.5) +
      filos),
  );
}

/* ------------------------------------------------------------------
   Las alas: plumas de borde serruchado, que se pisan como tejas
   ------------------------------------------------------------------ */

/** La silueta de un ala cerrada, en el títere: `n` 0 es la de la derecha, 1 su espejo. */
export function siluetaDeAla(n: 0 | 1): P[] {
  const [px, py] = A.alas[n];
  const s = n === 0 ? 1 : -1;
  const rnd = azar(1711 + n);
  const en = ([x, y]: P): P => [px + s * x, py + y];
  // El hueso, liso, del hombro a la punta.
  const afuera = ALA_CANTO.map(en);
  // Las plumas largas, de la punta para arriba: dientes que apuntan a la punta, para adentro del ala.
  const adentro = [ALA_CANTO.at(-1)!, ...ALA_ADENTRO].map(en);
  const plumas: P[] = [];
  const largas = [5, 5, 4, 3, 2];
  for (let i = 0; i < adentro.length - 1; i++) {
    const tramo = serrucho(adentro[i + 1]!, adentro[i]!, largas[i]!, 15 - i * 2.6, rnd, [-s, 0.6]);
    plumas.push(...tramo.reverse().slice(1));
  }
  return [[px, py], ...afuera, ...plumas];
}

function ala(n: 0 | 1): string {
  const [px, py] = A.alas[n];
  const s = n === 0 ? 1 : -1;
  const d = poli(siluetaDeAla(n));
  const rnd = azar(1721 + n);
  const en = ([x, y]: P): P => [px + s * x, py + y];
  // Tres filas de plumas a lo largo del ala, como las de un ala de verdad: las chicas pegadas al hueso,
  // las medianas, y las largas que son el canto de adentro. Cada fila es un serrucho que tapa la que
  // sigue, así que se pintan de adentro para afuera.
  let filas = '';
  for (const [desde, hasta, dientes, hondo, color] of [
    [[4, 6], [12, 148], 13, 7, C.medio],
    [[14, -2], [26, 132], 12, 5.5, C.crema],
    [[22, -6], [36, 100], 10, 4, C.luz],
  ] as const) {
    const fila = serrucho(en(desde), en(hasta), dientes, hondo, rnd, [-s, 0.5]);
    const tapa = [...fila, en([60, hasta[1]]), en([60, desde[1] - 30])];
    filas +=
      soplo(poli(fila.map(([x, y]) => [x - s * 3, y + 2] as P).concat([en([60, hasta[1]]), en([60, desde[1] - 30])])), C.hondo, 's', 0.6) +
      forma(poli(tapa), color, 0.42) +
      trazo(`M${fila.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')}`, C.luz, 0.7, 0.55);
  }
  // Las barbas: rayas finas que bajan hacia la punta.
  let barbas = '';
  for (let i = 0; i < 30; i++) {
    const [x, y] = en([-4 + rnd() * 40, 6 + rnd() * 146]);
    barbas += trazo(`M${f(x)} ${f(y)} l${f(-s * (1 + rnd() * 2))} ${f(6 + rnd() * 8)}`, C.sepia, 0.6, 0.4);
  }
  const hueso = curva(ALA_CANTO.map(en), false);
  return conGrano(
    enmascarado(`m-angel-ala-${n + 1}`, d,
      forma(d, C.sepia) +
      // Lo hondo de las plumas largas, y la tierra roja que les pega de abajo, en la punta.
      nube(...en([-4, 100]), 12, 60, C.hondo, 'l', 0.7) +
      nube(...en([14, 150]), 22, 12, C.rojo, 'm', 0.35) +
      filas + barbas +
      // El hueso del ala: la luz de arriba en el canto, y el cielo violeta del lado de atrás.
      nube(...en([30, 20]), 12, 30, C.luz, 'm', 0.55) +
      nube(...en([40, 80]), 4, 50, n ? C.cielo : C.violeta, 's', n ? 0.65 : 0.5)) +
    trazo(hueso, C.luz, 1.4, 0.6) + trazo(hueso, C.crema, 0.6, 0.8),
  );
}

/* ------------------------------------------------------------------
   Los brazos: la manga ancha y la mano de grisalla
   ------------------------------------------------------------------ */

/** El brazo, colgando del hombro hasta el codo: la manga de la túnica. */
function brazo(n: 0 | 1): string {
  const [sx, sy] = A.hombros[n];
  const s = n === 0 ? 1 : -1;
  const l = A.brazo;
  const d = curva([[sx - 7, sy - 4], [sx + 7, sy - 4], [sx + 8.4, sy + l * 0.5], [sx + 8, sy + l + 2], [sx - 8, sy + l + 2], [sx - 8.2, sy + l * 0.5]]);
  return conGrano(
    enmascarado(`m-angel-brazo-${n + 1}`, d,
      forma(d, C.medio) + nube(sx - s * 3, sy + l * 0.4, 4, l * 0.5, C.crema, 's', 0.7) + nube(sx + s * 5, sy + l * 0.5, 3.4, l * 0.5, C.hondo, 's', 0.6) +
      trazo(`M${f(sx - 2)} ${f(sy + 6)} Q${f(sx + 1)} ${f(sy + l * 0.6)} ${f(sx - 1)} ${f(sy + l)}`, C.sepia, 0.8, 0.6)),
  );
}

/** El antebrazo, del codo a la mano: la manga que se abre en campana y la mano larga, de dedos juntos. */
function antebrazo(n: 0 | 1): string {
  const [sx, sy0] = A.hombros[n];
  const s = n === 0 ? 1 : -1;
  const sy = sy0 + A.brazo;
  const l = A.antebrazo;
  const manga = curva([[sx - 7.6, sy - 2], [sx + 7.6, sy - 2], [sx + 10, sy + l * 0.5], [sx + 8, sy + l * 0.62], [sx - 8, sy + l * 0.62], [sx - 10, sy + l * 0.5]]);
  const mano = curva([[sx - 4.6, sy + l * 0.55], [sx + 4.6, sy + l * 0.55], [sx + 5.4, sy + l * 0.82], [sx + 3, sy + l + 3], [sx - 1, sy + l + 4], [sx - 4.8, sy + l * 0.9]]);
  const pulgar = curva([[sx - s * 4, sy + l * 0.62], [sx - s * 7.4, sy + l * 0.78], [sx - s * 6.8, sy + l * 0.9], [sx - s * 4.4, sy + l * 0.8]]);
  return conGrano(
    enmascarado(`m-angel-pulgar-${n + 1}`, pulgar, forma(pulgar, C.crema) + nube(sx - s * 6, sy + l * 0.84, 2, 3, C.sepia, 's', 0.6)) +
    enmascarado(`m-angel-mano-${n + 1}`, mano,
      forma(mano, C.crema) +
      nube(sx + s * 3, sy + l * 0.8, 3, 8, C.sepia, 's', 0.7) + nube(sx - s * 2, sy + l * 0.66, 3, 3, C.luz, 's', 0.8) +
      [-1.8, 0.4, 2.6].map((dx) => trazo(`M${f(sx + dx)} ${f(sy + l * 0.84)} l0 ${f(l * 0.14)}`, C.sepia, 0.6, 0.65)).join('') +
      nube(sx, sy + l + 3, 5, 3, C.rojo, 's', 0.4)) +
    enmascarado(`m-angel-manga-${n + 1}`, manga,
      forma(manga, C.medio) + nube(sx - s * 3, sy + l * 0.3, 5, l * 0.4, C.crema, 's', 0.65) + nube(sx + s * 6, sy + l * 0.4, 3, l * 0.4, C.hondo, 's', 0.6) +
      // El borde de la campana, serruchado como el ruedo.
      forma(poli(serrucho([sx + 10, sy + l * 0.56], [sx - 10, sy + l * 0.56], 4, 2.4, azar(1731 + n)).concat([[sx - 10, sy + l * 0.7], [sx + 10, sy + l * 0.7]])), C.hondo, 0.85)),
  );
}

/* ------------------------------------------------------------------
   La cabeza: la grisalla del lobo, con un ojo más grande que el otro
   ------------------------------------------------------------------ */

/** La silueta de la cabeza, de tres cuartos hacia el tronco: la mandíbula larga, la oreja de este lado. */
const CABEZA: readonly P[] = [[0, -207.5], [9, -205.5], [14.6, -198], [16.4, -188], [14.6, -178], [9.6, -170.4], [3.4, -166.6], [-4, -168], [-10, -174], [-13.2, -184], [-13.4, -195], [-8.4, -204]];

function cabeza(): string {
  const d = curva(CABEZA);
  const [o1, o2] = A.ojos;
  const rnd = azar(1741);
  // El pelo corto, de rulos apretados, que termina en la frente con un flequillo serruchado.
  const flequillo = serrucho([15.6, -196], [-14.4, -194], 8, 4.6, rnd);
  const pelo = poli([...flequillo, [-15.6, -199], [-13, -207], [-5, -211.6], [4, -212], [12, -209], [16.6, -202]]);
  let rulos = '';
  for (let i = 0; i < 22; i++) {
    const [x, y] = [-12 + rnd() * 26, -209 + rnd() * 11];
    rulos += trazo(`M${f(x)} ${f(y)} q${f(1.4 + rnd())} ${f(-1.6)} ${f(2.6)} ${f(0.4)}`, i % 3 ? C.sepia : C.medio, 0.8, 0.85);
  }
  const ojo = ({ centro: [x, y], radio: [rx, ry] }: (typeof A.ojos)[number], grande: boolean): string =>
    // La cuenca honda alrededor, el blanco y el aro oscuro del iris, como el ojo del lobo.
    nube(x, y, rx * 1.9, ry * 2, C.hondo, 's', grande ? 0.75 : 0.65) +
    forma(elipse(x, y, rx, ry), C.luz) +
    nube(x, y - ry * 0.4, rx, ry * 0.5, C.crema, 'xs', 0.7) +
    `<circle cx="${f(x)}" cy="${f(y)}" r="${f(ry * 0.78)}" fill="none" stroke="${C.sepia}" stroke-width="${f(ry * 0.34)}" opacity="0.85"/>`;
  return conGrano(
    enmascarado('m-angel-cara', d,
      forma(d, C.crema) +
      // La luz de arriba a la izquierda; la sombra del lado del tronco, debajo del pómulo, que se va al frío.
      nube(-5, -194, 10, 9, C.luz, 'm', 0.7) + nube(2, -186, 11, 13, C.luz, 'l', 0.45) +
      nube(13, -180, 7, 12, C.sepia, 'm', 0.8) + nube(14, -176, 3, 6, C.frio, 's', 0.35) +
      nube(-11, -180, 4, 8, C.medio, 's', 0.6) + nube(2, -168, 10, 4, C.sepia, 's', 0.7) +
      // La luz roja de la llanura, de abajo, en el mentón; el cielo violeta en el canto de atrás.
      nube(2, -166, 8, 3, C.rojo, 's', 0.6) + nube(-13, -188, 2.4, 12, C.cielo, 's', 0.7) +
      ojo(o1, true) + ojo(o2, false) +
      // La nariz larga, recta, con la sombra del lado del tronco y el brillo en el caballete.
      soplo(`M3.6 -191 L6.8 -180.4 L4 -179 Z`, C.hondo, 'xs', 0.7) +
      trazo('M2.6 -191 L4.6 -181.6', C.luz, 0.9, 0.75) +
      forma(elipse(5.6, -179.4, 1.4, 0.8), C.hondo, 0.8) +
      // La boca finita, con las comisuras para abajo: no cree nada.
      trazo('M-1.8 -173.6 Q3 -175 7.4 -173', C.hondo, 1.1, 0.85) +
      trazo('M-0.4 -172 Q3 -171.2 6 -172', C.crema, 0.7, 0.55) +
      // La ceja de este lado, la que no se mueve: chata y caída.
      trazo('M-9.4 -194.6 Q-5.6 -196.4 -1.6 -194.8', C.hondo, 1.3, 0.85)) +
    // El pelo, encima: se sale apenas del cráneo, como los rulos apretados de una cabeza de yeso.
    enmascarado('m-angel-pelo', pelo, forma(pelo, C.hondo) + nube(-5, -207, 9, 4, C.sepia, 's', 0.9) + nube(12, -200, 4, 6, C.negro, 's', 0.5) + rulos) +
    // La oreja del lado del tronco, chica y pegada.
    enmascarado('m-angel-oreja', elipse(16.2, -186, 2.6, 4.4), forma(elipse(16.2, -186, 2.6, 4.4), C.medio) + nube(17, -186, 1.4, 3, C.hondo, 'xs', 0.7) + nube(15.4, -188, 1, 1.4, C.crema, 'xs', 0.7)),
  );
}

/* ------------------------------------------------------------------
   El huevo de plata, y la sombra
   ------------------------------------------------------------------ */

/** Un huevo de los de la llanura, que se cae del nido: peltre, con el brillo de plata y la tierra roja abajo. */
function huevo(): string {
  const d = elipse(0, 0, 8.6, 11);
  return conGrano(
    enmascarado('m-angel-huevo', d,
      forma(d, C.peltre) + nube(3, 4, 7, 8, C.tierra, 's', 0.6) + nube(1, 8, 7, 4, C.rojo, 's', 0.5) +
      nube(-2.6, -4, 3.2, 4, C.plata, 's', 0.95) + nube(-3, -5.4, 1.2, 1.4, C.papel, 'xs', 0.95)),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

/** La densidad: va a la mitad de su medida y el retrato lo agranda. */
const D = 3.6;

export const PIEZAS_ANGEL: readonly Pieza[] = [
  { nombre: 'angel-tunica', caja: [-38, -172, 76, 175], dibujo: tunica(), densidad: D },
  ...([0, 1] as const).flatMap((n) => {
    const [sx, sy] = A.hombros[n];
    const [ax, ay] = A.alas[n];
    const s = n === 0 ? 1 : -1;
    return [
      { nombre: `angel-brazo-${n + 1}`, caja: [sx - 11, sy - 7, 22, A.brazo + 12] as const, dibujo: brazo(n), densidad: D },
      { nombre: `angel-antebrazo-${n + 1}`, caja: [sx - 13, sy + A.brazo - 5, 26, A.antebrazo + 12] as const, dibujo: antebrazo(n), densidad: D },
      { nombre: `angel-ala-${n + 1}`, caja: [s > 0 ? ax - 28 : ax - 46, ay - 24, 74, 196] as const, dibujo: ala(n), densidad: D },
    ];
  }),
  { nombre: 'angel-cabeza', caja: [-18, -216, 38, 54], dibujo: cabeza(), densidad: D * 1.6 },
  { nombre: 'angel-huevo', caja: [-12, -14, 24, 28], dibujo: huevo(), densidad: D * 1.4 },
];

const img = imagenesDe(PIEZAS_ANGEL);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Los párpados y las pupilas, en la página: la isla los mueve. */
function ojos(t: Record<string, string>): string {
  return A.ojos
    .map(({ centro: [x, y], radio: [rx, ry] }, i) => {
      const py = Math.round((y - ry - 0.5) * 10) / 10;
      return (
        parte(`pupila-${i + 1}`, `<circle cx="${f(x)}" cy="${f(y)}" r="${f(ry * 0.5)}" class="bt-angel-pupila"/><circle cx="${f(x - ry * 0.18)}" cy="${f(y - ry * 0.2)}" r="${f(ry * 0.14)}" class="bt-angel-brillo"/>`, t[`pupila-${i + 1}`]) +
        `<path data-parte="parpado-${i + 1}" data-pivote="${x} ${py}" d="M${f(x - rx - 0.6)} ${f(y)} A${f(rx + 0.6)} ${f(ry + 1)} 0 0 1 ${f(x + rx + 0.6)} ${f(y)} L${f(x + rx + 0.6)} ${f(y + ry + 0.6)} L${f(x - rx - 0.6)} ${f(y + ry + 0.6)} Z" class="bt-angel-parpado" transform="${t[`parpado-${i + 1}`]}"/>`
      );
    })
    .join('');
}

/** El ángel armado con las marcas de un momento (`marcas`, `rig-angel.ts`). */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const brazoEntero = (n: 1 | 2): string => parte(`brazo-${n}`, img(`angel-brazo-${n}`) + parte(`antebrazo-${n}`, img(`angel-antebrazo-${n}`), t[`antebrazo-${n}`]), t[`brazo-${n}`]);
  return (
    `<ellipse cx="0" cy="1" rx="44" ry="6" class="bt-angel-sombra"/>` +
    parte('cuerpo',
      img('angel-tunica') +
      brazoEntero(2) + brazoEntero(1) +
      parte('ala-2', img('angel-ala-2'), t['ala-2']) +
      parte('ala-1', img('angel-ala-1'), t['ala-1']) +
      parte('cabeza',
        img('angel-cabeza') + ojos(t) +
        `<path data-parte="ceja" d="M5 -195.6 Q9 -198 13 -195.4" class="bt-angel-ceja" transform="${t.ceja}"/>`,
        t.cabeza),
      t.cuerpo) +
    parte('huevo', img('angel-huevo'), t.huevo, o.huevo)
  );
}

/** El ángel en cualquier momento, sin lo que lo hace tocable: para el test y para el retrato. */
export function angelEn(m: Momento = QUIETA): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: con las alas cerradas, al pie del árbol. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--angel" data-id="el-angel-de-la-soledad" role="button" tabindex="0" aria-label="${nombres.get('el-angel-de-la-soledad') ?? 'El ángel de la soledad'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETA).transform.entero}">${armado(QUIETA)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: con las alas abiertas y las manos para recibirte, sobre su pedazo de llanura. */
export const RETRATO = { caja: [LUGAR.x - 82, LUGAR.piso - 134, 164, 146] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('arbol-lejos') + fondo('arbol-piso') + angelEn(ABIERTO);
}

export const ANGEL: Personaje = {
  id: 'el-angel-de-la-soledad',
  region: 'el-arbol',
  ancla: LUGAR.x,
  piezas: PIEZAS_ANGEL,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
