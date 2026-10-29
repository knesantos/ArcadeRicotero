/**
 * La lechuza que circula (`D-73`, vigesimotercera vuelta), parada en una rama seca del árbol del gran bonete.
 *
 * *"Tuve temprano entre mis manos mi boleto y oí que en el ensayo ya chingaba nuestra onda, y pensé: con la
 * lechuza que circula, ya no se puede más"* es de *Mariposa Pontiac / Rock del país*, en *Luzbelito* (1996).
 * En la letra la lechuza es la que vigila; qué es, cada uno lo sabe. Por eso es una lechuza de campanario,
 * la de acá, con la cara de corazón y dos ojos negros enormes como dos discos, que casi no pestañean, y
 * muerde un pito de vigilante, colgado del cuello con un cordón. En la astilla de la rama tiene pinchado un
 * boleto de recital, cortado, sin nombre de nadie. Lo del dibujo: el surco de disco en los ojos y la anilla
 * de cobre en la pata, que es la de los pájaros fichados.
 *
 * Viste la tapa de *Luzbelito*, medida con sharp: el lomo es el cobre y el oro del marco ovalado, el pecho y
 * la cara son el yeso del busto con la vela, las motas son el azul de pizarra de sus antiparras, los ojos son
 * el negro de adentro del marco, y la rama es el papel marmolado verde de la tapa, como el árbol.
 *
 * Coordenadas: el (0, 0) es donde las garras agarran la rama, y mira de frente (`rig-lechuza.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { CIRCULA, LECHUZA, LECHUZA_ARMADO as A, QUIETO, marcas, type Momento } from './rig-lechuza.ts';

/** Las tintas de *Luzbelito* (`tokens.css`). */
const C = {
  cobre: 'var(--bestia-lechuza-cobre)',
  cobreClaro: 'var(--bestia-lechuza-cobre-claro)',
  cobreHondo: 'var(--bestia-lechuza-cobre-hondo)',
  oro: 'var(--bestia-lechuza-oro)',
  oxido: 'var(--bestia-lechuza-oxido)',
  hueso: 'var(--bestia-lechuza-hueso)',
  huesoClaro: 'var(--bestia-lechuza-hueso-claro)',
  vela: 'var(--bestia-lechuza-vela)',
  llama: 'var(--bestia-lechuza-llama)',
  pizarra: 'var(--bestia-lechuza-pizarra)',
  negro: 'var(--bestia-lechuza-negro)',
  marmol: 'var(--bestia-lechuza-marmol)',
  marmolHondo: 'var(--bestia-lechuza-marmol-hondo)',
  marmolClaro: 'var(--bestia-lechuza-marmol-claro)',
  veta: 'var(--bestia-lechuza-veta)',
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

/** Siembra `n` motas adentro de una forma. */
const motas = (semilla: number, n: number, x0: number, y0: number, w: number, h: number, dentro: (x: number, y: number) => boolean, pinta: (x: number, y: number, r: () => number) => string): string => {
  const r = azar(semilla);
  let s = '';
  for (let i = 0, puestas = 0; i < n * 6 && puestas < n; i++) {
    const x = x0 + r() * w;
    const y = y0 + r() * h;
    if (!dentro(x, y)) continue;
    s += pinta(x, y, r);
    puestas++;
  }
  return s;
};

/* ------------------------------------------------------------------
   La rama seca, el boleto pinchado en su astilla
   ------------------------------------------------------------------ */

function rama(): string {
  const pts = A.rama;
  // El contorno: el eje con un grosor que se afina hacia la punta seca.
  const ancho = (i: number): number => 10 - (i / (pts.length - 1)) * 7;
  const lado = (s: 1 | -1): P[] =>
    pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)]!;
      const b = pts[Math.min(pts.length - 1, i + 1)]!;
      const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
      const l = Math.hypot(dx, dy);
      return [p[0] - (dy / l) * ancho(i) * s, p[1] + (dx / l) * ancho(i) * s] as P;
    });
  const arriba = lado(1);
  const abajo = lado(-1).reverse();
  const d = curva([...arriba, ...abajo]);
  // La astilla donde está pinchado el boleto, y la horqueta de ramitas secas de la punta.
  const [bx, by] = A.boleto;
  const astilla = poli([[bx - 4, -10], [bx + 3, -13], [bx + 2, by - 6], [bx, by - 8]]);
  const ramitas =
    trazo(`M160 -52 Q178 -76 172 -100`, C.marmolHondo, 4) + trazo(`M160 -52 Q178 -76 172 -100`, C.marmolClaro, 1.4, 0.7) +
    trazo(`M190 -70 Q210 -70 222 -84`, C.marmolHondo, 3) + trazo(`M172 -100 l-8 -10 M172 -100 l6 -12`, C.marmolHondo, 2) +
    trazo(`M-60 26 Q-70 6 -62 -10`, C.marmolHondo, 4) + trazo(`M-60 26 Q-70 6 -62 -10`, C.veta, 1, 0.5);
  return conGrano(
    // La sombra que hace la rama en el cielo, y la punta que se mete en la copa, soplada para que no corte.
    nube(-150, 70, 40, 26, C.marmolHondo, 'l', 0.8) +
    ramitas +
    enmascarado('m-lechuza-rama', d,
      forma(d, C.marmol) +
      // El mármol de la tapa: el lomo con la luz del cielo, la panza honda y las vetas que corren a lo largo.
      nube(20, -8, 200, 5, C.marmolClaro, 's', 0.9) + nube(20, 12, 200, 6, C.marmolHondo, 's', 0.9) +
      trazo(curva(pts.map(([x, y]) => [x, y - 3] as P), false), C.veta, 1.2, 0.55) +
      trazo(curva(pts.slice(1, 6).map(([x, y], i) => [x + 6, y + 2 + (i % 2) * 2] as P), false), C.veta, 0.8, 0.4) +
      [-120, -70, -10, 70, 130].map((x, i) => trazo(`M${x} ${f(pts[0]![1] + (x + 170) * -0.38 + 4)} q6 ${i % 2 ? 3 : -3} 14 0`, C.marmolHondo, 1.4, 0.8)).join('') +
      nube(-150, 64, 28, 20, C.marmolHondo, 'm', 0.7)) +
    // Un nudo, donde se cortó otra rama.
    forma(elipse(84, -12, 5, 3.4), C.marmolHondo) + trazo(`M80 -13 q4 -2 8 0`, C.veta, 0.8, 0.6) +
    forma(astilla, C.marmolHondo) + trazo(`M${bx - 1} -11 L${bx + 1} ${by - 6}`, C.veta, 0.8, 0.6),
  );
}

/** El boleto de recital, cortado, pinchado en la astilla. Sin marca y sin nombre: el talón y el número. */
function boleto(): string {
  const [bx, by] = A.boleto;
  const papel = poli([[bx - 13, by - 6], [bx + 13, by - 8], [bx + 14, by + 9], [bx - 1, by + 10], [bx - 4, by + 7], [bx - 7, by + 11], [bx - 12, by + 9]]);
  const picado = Array.from({ length: 5 }, (_, i) => forma(elipse(bx + 7, by - 5 + i * 3.2, 0.6, 0.8), C.cobreHondo, 0.7)).join('');
  return conGrano(
    enmascarado('m-lechuza-boleto', papel,
      forma(papel, C.huesoClaro) + nube(bx + 8, by + 6, 10, 6, C.hueso, 's', 0.9) +
      // La franja de color del talón y los números, garabateados.
      forma(poli([[bx - 14, by - 2], [bx + 14, by - 4], [bx + 14, by], [bx - 14, by + 2]]), C.llama, 0.85) +
      trazo(`M${bx - 10} ${by + 5} l10 -0.6 M${bx - 10} ${by + 8} l6 -0.4`, C.oxido, 0.8, 0.8) +
      trazo(`M${bx + 9} ${by + 3} l3 0 M${bx + 9} ${by + 6} l3 0`, C.oxido, 0.8, 0.8) +
      nube(bx - 8, by - 4, 6, 2, C.vela, 'xs', 0.8)) +
    picado +
    // El agujero de la astilla, y la punta que asoma.
    forma(elipse(bx, by, 1.6, 1.4), C.marmolHondo) + forma(poli([[bx - 1.4, by], [bx + 1.4, by], [bx + 0.6, by - 6], [bx - 0.4, by - 6]]), C.marmolHondo),
  );
}

/* ------------------------------------------------------------------
   El cuerpo, la cola, las patas
   ------------------------------------------------------------------ */

const CUERPO: readonly P[] = [[0, -116], [24, -110], [34, -92], [40, -62], [38, -34], [28, -14], [12, -6], [0, -5], [-12, -6], [-28, -14], [-38, -34], [-40, -62], [-34, -92], [-24, -110]];
const dentroDe = (pts: readonly P[]) => (x: number, y: number): boolean => {
  let adentro = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]!;
    const [xj, yj] = pts[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) adentro = !adentro;
  }
  return adentro;
};

function cuerpo(): string {
  const d = curva(CUERPO);
  // Las motas del pecho de la lechuza: gotitas oscuras chicas, más ralas arriba.
  const gotas = motas(31, 46, -32, -96, 64, 86, dentroDe(CUERPO), (x, y, r) => {
    const s = 0.7 + r() * 0.9;
    return forma(`M${f(x)} ${f(y - s * 1.8)} Q${f(x + s)} ${f(y)} ${f(x)} ${f(y + s)} Q${f(x - s)} ${f(y)} ${f(x)} ${f(y - s * 1.8)} Z`, C.pizarra, 0.75);
  });
  // Las plumas del pecho: escamas apenas marcadas.
  const escamas = Array.from({ length: 6 }, (_, fila) =>
    Array.from({ length: 5 }, (_, i) => {
      const x = -24 + i * 12 + (fila % 2) * 6;
      const y = -94 + fila * 14;
      return trazo(`M${x - 5} ${y} Q${x} ${y + 4} ${x + 5} ${y}`, C.hueso, 1, 0.7);
    }).join(''),
  ).join('');
  // El cordón rojo del pito, colgado del cuello, que se va para arriba del lado del pico.
  const cordon = trazo('M-26 -106 Q-6 -88 14 -96 Q26 -102 28 -112', C.cobreHondo, 3, 0.9) + trazo('M-26 -106 Q-6 -88 14 -96 Q26 -102 28 -112', C.llama, 1.8);
  return conGrano(
    enmascarado('m-lechuza-cuerpo', d,
      forma(d, C.hueso) +
      // El pecho claro como el yeso del busto, con la luz de la vela de frente; la pechera de oro bajo la cara.
      nube(0, -70, 26, 40, C.huesoClaro, 'm', 0.95) + nube(-6, -82, 12, 18, C.vela, 'm', 0.6) +
      nube(0, -108, 34, 10, C.oro, 'm', 0.85) + nube(0, -112, 30, 6, C.cobre, 's', 0.6) +
      nube(0, -8, 40, 12, C.cobreHondo, 'm', 0.5) + nube(30, -50, 10, 40, C.cobreHondo, 'm', 0.35) +
      escamas + gotas) +
    cordon,
  );
}

/** La cola corta, barrada, que asoma detrás de la rama. */
function cola(): string {
  const d = curva([[-16, -30], [16, -30], [18, -4], [12, 18], [0, 22], [-12, 18], [-18, -4]]);
  const barras = [-14, -4, 6, 14].map((y) => trazo(`M-16 ${y} Q0 ${y + 4} 16 ${y}`, C.cobreHondo, 2.4, 0.75)).join('');
  return conGrano(enmascarado('m-lechuza-cola', d, forma(d, C.oro) + nube(8, 4, 12, 20, C.cobre, 'm', 0.8) + nube(-6, -6, 6, 16, C.huesoClaro, 's', 0.4) + barras + nube(0, 20, 16, 5, C.cobreHondo, 's', 0.8)) + trazo('M0 -28 L0 20', C.cobreHondo, 0.8, 0.5));
}

/** Las patas emplumadas, los dedos grises con las uñas negras sobre la rama, y la anilla de cobre. */
function patas(): string {
  const pierna = (x: number): string => {
    const d = curva([[x - 7, -24], [x + 7, -24], [x + 6, -6], [x + 3, -1], [x - 3, -1], [x - 6, -6]]);
    return enmascarado(`m-lechuza-pierna-${x < 0 ? 1 : 2}`, d, forma(d, C.hueso) + nube(x + 3, -10, 4, 10, C.cobreHondo, 's', 0.4) + nube(x - 2, -18, 3, 6, C.vela, 's', 0.6));
  };
  // Tres dedos que abrazan el lomo de la rama, cada uno con su uña que se clava adelante.
  const dedos = (x: number, s: number): string =>
    [-1, 0, 1].map((i) => {
      const [x0, x1] = [x + i * 3, x + i * 5 + s * 1.5];
      return trazo(`M${x0} -3 Q${x1} -1 ${x1} 4`, C.pizarra, 3.2) + trazo(`M${x0} -3.6 Q${x1} -1.6 ${x1} 3`, C.veta, 0.8, 0.6) + forma(`M${x1 - 1.4} 3 Q${x1 + 2.6} 6 ${x1 + 0.4} 10 Q${x1} 6.6 ${x1 - 1.6} 4.6 Z`, C.negro);
    }).join('');
  // La anilla: la de los pájaros fichados, con su número.
  const anilla = forma(cajaRedonda(7.5, -14, 13, 5, 1.2), C.cobre) + nube(11, -13, 3, 1, C.oro, 'xs', 0.9) + trazo('M10 -11.4 l2 0 M13.5 -11.4 l3 0', C.cobreHondo, 0.6, 0.9);
  return conGrano(pierna(-14) + pierna(14) + dedos(-14, -1) + dedos(14, 1) + anilla);
}

/* ------------------------------------------------------------------
   Las alas: plegadas a los costados, y abiertas para la vuelta
   ------------------------------------------------------------------ */

const ALA: readonly P[] = [[-24, -104], [-34, -100], [-44, -78], [-46, -46], [-40, -18], [-28, 4], [-20, 6], [-22, -16], [-24, -50], [-24, -80]];
const espejo = (pts: readonly P[]): P[] => pts.map(([x, y]) => [-x, y] as P);

function ala(n: 0 | 1): string {
  const pts = n === 0 ? ALA : espejo(ALA);
  const s = n === 0 ? 1 : -1;
  const d = curva(pts);
  const X = (x: number): number => x * s;
  // El lomo de la lechuza: oro y cobre, con el gris de pizarra corrido y los puntitos blancos de borde negro.
  const puntos = motas(41 + n, 16, -46, -100, 26, 96, dentroDe(ALA), (x, y) => forma(elipse(X(x), y, 1.2, 1), C.vela, 0.9) + forma(elipse(X(x) + 0.6 * s, y + 1.4, 0.8, 0.6), C.negro, 0.8));
  const plumas = [-40, -28, -16, -4].map((y, i) => trazo(`M${X(-44 + i)} ${y} Q${X(-34)} ${y + 6} ${X(-24)} ${y + 2}`, C.cobreHondo, 1.4, 0.7)).join('');
  const barras = [-14, -6, 2].map((y) => trazo(`M${X(-38)} ${y - 6} L${X(-24)} ${y}`, C.oxido, 2, 0.6)).join('');
  return conGrano(
    enmascarado(`m-lechuza-ala-${n + 1}`, d,
      forma(d, C.oro) + nube(X(-40), -60, 8, 46, C.cobre, 'm', 0.9) + nube(X(-30), -88, 10, 12, C.pizarra, 'm', 0.5) + nube(X(-34), -50, 6, 20, C.pizarra, 'm', 0.45) +
      nube(X(-26), -70, 4, 30, C.huesoClaro, 's', 0.35) + nube(X(-30), -2, 10, 10, C.cobreHondo, 'm', 0.6) +
      plumas + barras + puntos) +
    trazo(curva(pts.slice(1, 6), false), C.oxido, 1.2, 0.6),
  );
}

const ABIERTA: readonly P[] = [
  [-26, -106], [-62, -128], [-110, -138], [-150, -128], [-184, -104], [-168, -96], [-178, -86], [-156, -82], [-162, -70], [-138, -72], [-138, -60], [-114, -66], [-106, -54], [-84, -62], [-72, -52], [-52, -62], [-32, -76],
];

function abierta(n: 0 | 1): string {
  const pts = n === 0 ? ABIERTA : espejo(ABIERTA);
  const s = n === 0 ? 1 : -1;
  const X = (x: number): number => x * s;
  const d = curva(pts);
  // La panza del ala de la lechuza es casi blanca: un fantasma. El borde de adelante es el oro del lomo.
  const barras = [0, 1, 2, 3].map((i) => trazo(`M${X(-118 - i * 14)} ${-122 + i * 4} Q${X(-128 - i * 14)} ${-100 + i * 2} ${X(-134 - i * 12)} ${-76 + i * 2}`, C.pizarra, 1.4, 0.35)).join('');
  const puntas = [[-178, -88], [-160, -74], [-140, -64], [-110, -58], [-78, -56]].map(([x, y]) => nube(X(x!), y!, 6, 4, C.cobreHondo, 's', 0.6)).join('');
  const raquis = [-170, -150, -128, -100, -74].map((x, i) => trazo(`M${X(-110 + i * 6)} -122 L${X(x)} ${-84 + i * 6}`, C.hueso, 0.9, 0.6)).join('');
  const puntos = motas(51 + n, 18, -170, -136, 140, 70, dentroDe(ABIERTA.map(([x, y]) => [x, y] as P)), (x, y) => forma(elipse(X(x), y, 1, 1.2), C.pizarra, 0.55));
  return conGrano(
    enmascarado(`m-lechuza-abierta-${n + 1}`, d,
      forma(d, C.huesoClaro) + nube(X(-100), -82, 70, 18, C.vela, 'm', 0.8) +
      soplo(`M${X(-20)} -110 L${X(-110)} -142 L${X(-190)} -108 L${X(-150)} -118 L${X(-100)} -124 Z`, C.oro, 's', 0.95) +
      nube(X(-60), -116, 30, 6, C.cobre, 's', 0.8) + nube(X(-40), -90, 18, 16, C.hueso, 'm', 0.7) +
      barras + raquis + puntos + puntas),
  );
}

/* ------------------------------------------------------------------
   La cabeza: el cráneo, la nuca, la cara de corazón, los ojos de disco y el pito
   ------------------------------------------------------------------ */

function craneo(): string {
  const [hx, hy] = A.cabeza;
  const d = elipse(hx, hy, 42, 40);
  const puntos = motas(61, 26, -40, -178, 80, 70, (x, y) => (x * x) / 1600 + ((y - hy) * (y - hy)) / 1500 < 1, (x, y) => forma(elipse(x, y, 1.1, 0.9), C.vela, 0.85) + forma(elipse(x + 0.5, y + 1.2, 0.7, 0.5), C.negro, 0.7));
  return conGrano(
    enmascarado('m-lechuza-craneo', d,
      forma(d, C.oro) + nube(hx, hy - 30, 36, 14, C.pizarra, 'm', 0.55) + nube(hx - 22, hy + 10, 14, 26, C.cobre, 'm', 0.8) + nube(hx + 24, hy + 8, 14, 26, C.cobreHondo, 'm', 0.6) +
      nube(hx - 10, hy - 22, 14, 8, C.huesoClaro, 's', 0.5) + puntos),
  );
}

/** La nuca: lo que se ve cuando gira de más. La raya del medio y el gris del cogote. */
function nuca(): string {
  const [hx, hy] = A.cabeza;
  const d = elipse(hx, hy, 40, 38);
  return conGrano(
    enmascarado('m-lechuza-nuca', d,
      forma(d, C.oro) + nube(hx - 20, hy + 6, 16, 30, C.cobre, 'm', 0.8) + nube(hx + 20, hy + 6, 16, 30, C.cobre, 'm', 0.8) +
      nube(hx, hy - 6, 30, 30, C.pizarra, 'm', 0.45) + nube(hx, hy + 20, 26, 14, C.cobre, 'm', 0.7) +
      trazo(`M${hx} ${hy - 36} Q${hx + 2} ${hy} ${hx} ${hy + 36}`, C.cobreHondo, 2.4, 0.7) +
      [-24, -12, 0, 12, 24].map((y) => trazo(`M${hx - 30} ${hy + y} Q${hx - 14} ${hy + y - 4} ${hx - 4} ${hy + y + 2} M${hx + 30} ${hy + y} Q${hx + 14} ${hy + y - 4} ${hx + 4} ${hy + y + 2}`, C.oxido, 1.1, 0.6)).join('')),
  );
}

/** El disco de la cara: el corazón de la lechuza de campanario, con su borde de oro. */
const DISCO: readonly P[] = [[0, -158], [12, -172], [30, -172], [40, -156], [40, -132], [30, -112], [14, -102], [0, -98], [-14, -102], [-30, -112], [-40, -132], [-40, -156], [-30, -172], [-12, -172]];

function ojo([x, y]: P, i: number): string {
  const r = A.radioOjo;
  // Negro como el adentro del marco, con el surco de un disco y la luz de la vela en una punta.
  const surcos = [3.6, 5.2, 6.8, 8.4, 9.8].map((rr, k) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="none" stroke="${C.vela}" stroke-width="0.5" opacity="${(0.08 + (k % 2) * 0.06).toFixed(2)}"/>`).join('');
  return (
    nube(x + (i ? -6 : 6), y + 2, 10, 12, C.cobreClaro, 's', 0.55) +
    forma(elipse(x, y, r + 1.6, r + 1.4), C.cobreHondo) +
    forma(elipse(x, y, r, r), C.negro) +
    surcos +
    nube(x + 2, y + 4, 6, 4, C.pizarra, 's', 0.5) +
    forma(elipse(x - 3.6, y - 3.8, 2.2, 1.8), C.vela, 0.95) + forma(elipse(x + 3, y + 3.6, 0.9, 0.8), C.vela, 0.6)
  );
}

function cara(): string {
  const d = curva(DISCO);
  const [px, py] = A.pico;
  const pico = forma(`M${px - 4} ${py - 8} Q${px} ${py - 11} ${px + 4} ${py - 8} L${px + 3} ${py + 2} Q${px} ${py + 8} ${px - 1} ${py + 4} L${px - 3} ${py + 1} Z`, C.hueso) + nube(px + 2, py, 2, 5, C.cobreClaro, 'xs', 0.8) + trazo(`M${px - 2} ${py - 6} l1 6`, C.vela, 0.8, 0.8);
  return conGrano(
    // El borde del corazón: el oro del marco, con el cobre por afuera.
    trazo(d, C.cobre, 8) + trazo(d, C.oro, 4.4) +
    enmascarado('m-lechuza-cara', d,
      forma(d, C.huesoClaro) + nube(0, -134, 30, 30, C.vela, 'm', 0.85) +
      // El ceño de la lechuza: la raya del medio que baja de la frente al pico, y lo hondo arriba de los ojos.
      nube(0, -150, 6, 14, C.cobreClaro, 's', 0.7) + nube(0, -128, 3, 10, C.hueso, 's', 0.8) +
      nube(-16, -160, 14, 5, C.hueso, 's', 0.8) + nube(16, -160, 14, 5, C.hueso, 's', 0.8) +
      nube(0, -104, 22, 6, C.hueso, 's', 0.7) +
      // Las plumitas del disco, que salen como rayos desde los ojos.
      A.ojos.map(([x, y]) => Array.from({ length: 12 }, (_, k) => {
        const a = (k / 12) * Math.PI * 2;
        return trazo(`M${f(x + Math.cos(a) * 15)} ${f(y + Math.sin(a) * 15)} L${f(x + Math.cos(a) * 24)} ${f(y + Math.sin(a) * 24)}`, C.hueso, 0.8, 0.6);
      }).join('')).join('') +
      A.ojos.map(ojo).join('')) +
    pico,
  );
}

/** Los párpados, cerrados del todo: la isla los baja desde arriba de cada ojo. */
function parpado(n: 0 | 1): string {
  const [x, y] = A.ojos[n];
  const r = A.radioOjo;
  const d = elipse(x, y, r + 1.8, r + 1.6);
  return conGrano(enmascarado(`m-lechuza-parpado-${n + 1}`, d, forma(d, C.huesoClaro) + nube(x, y - r, r, 5, C.hueso, 's', 0.9) + nube(x, y + r, r, 3, C.cobreClaro, 's', 0.6)) + trazo(`M${x - r} ${y + r - 1} Q${x} ${y + r + 2.4} ${x + r} ${y + r - 1}`, C.cobreHondo, 1.4));
}

/** El pito de vigilante, de lata, mordido de costado: la boquilla chata, el tambor redondo y la argolla del cordón. */
function pito(): string {
  const [px, py] = A.pico;
  const [wx, wy] = A.pito;
  // La boquilla y el lomo del pito, de una sola chapa, hasta el tambor.
  const chapa = poli([[px + 1, py - 4], [wx, wy - 8], [wx, wy + 1], [px + 2, py + 1]]);
  const tambor = elipse(wx, wy, 8, 8);
  return conGrano(
    enmascarado('m-lechuza-chapa', chapa, forma(chapa, C.hueso) + nube(px + 10, py - 3, 12, 1.6, C.vela, 'xs', 0.95) + nube(px + 10, py + 1, 12, 2, C.pizarra, 's', 0.6)) +
    enmascarado('m-lechuza-tambor', tambor, forma(tambor, C.hueso) + nube(wx - 2, wy - 3, 4, 3, C.vela, 's', 1) + nube(wx + 3, wy + 4, 6, 5, C.pizarra, 's', 0.85)) +
    trazo(`M${px + 1} ${py - 4} L${wx} ${wy - 8}`, C.pizarra, 0.8, 0.8) +
    // La ventanita de arriba, por donde sale el pitido.
    forma(poli([[wx - 9, wy - 7.4], [wx - 3, wy - 8.4], [wx - 3, wy - 5], [wx - 9, wy - 4.6]]), C.negro) +
    // La argolla abajo del tambor, con el cordón rojo.
    `<circle cx="${wx + 2}" cy="${wy + 10}" r="2.6" fill="none" stroke="${C.pizarra}" stroke-width="1.2"/>` +
    trazo(`M${wx + 3} ${wy + 12} q4 3 8 0`, C.llama, 1.8),
  );
}

/** El pitido: rayas que saltan de la ranura del pito cuando sopla. */
function pitido(): string {
  const [wx, wy] = A.pito;
  return Array.from({ length: 7 }, (_, i) => {
    const a = -1.2 + (i / 6) * 1.7;
    const [r0, r1] = [14, 24 + (i % 2) * 7];
    return trazo(`M${f(wx + Math.cos(a) * r0)} ${f(wy - 4 + Math.sin(a) * r0)} L${f(wx + Math.cos(a) * r1)} ${f(wy - 4 + Math.sin(a) * r1)}`, i % 2 ? C.vela : C.llama, 2.2, 0.9);
  }).join('');
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;
const [HX, HY] = A.cabeza;
const [WX, WY] = A.pito;
const [BX, BY] = A.boleto;

export const PIEZAS_LECHUZA: readonly Pieza[] = [
  { nombre: 'lechuza-cola', caja: [-24, -36, 48, 64], dibujo: cola(), densidad: D },
  { nombre: 'lechuza-rama', caja: [-200, -116, 430, 210], dibujo: rama(), densidad: 1.6 },
  { nombre: 'lechuza-boleto', caja: [BX - 18, BY - 12, 36, 26], dibujo: boleto(), densidad: D * 1.4 },
  { nombre: 'lechuza-abierta-1', caja: [-196, -150, 180, 106], dibujo: abierta(0), densidad: D },
  { nombre: 'lechuza-abierta-2', caja: [16, -150, 180, 106], dibujo: abierta(1), densidad: D },
  { nombre: 'lechuza-cuerpo', caja: [-46, -122, 92, 122], dibujo: cuerpo(), densidad: D },
  { nombre: 'lechuza-ala-1', caja: [-52, -110, 38, 122], dibujo: ala(0), densidad: D },
  { nombre: 'lechuza-ala-2', caja: [14, -110, 38, 122], dibujo: ala(1), densidad: D },
  { nombre: 'lechuza-patas', caja: [-26, -28, 52, 42], dibujo: patas(), densidad: D * 1.4 },
  { nombre: 'lechuza-craneo', caja: [HX - 46, HY - 46, 92, 92], dibujo: craneo(), densidad: D },
  { nombre: 'lechuza-nuca', caja: [HX - 44, HY - 42, 88, 84], dibujo: nuca(), densidad: D },
  { nombre: 'lechuza-cara', caja: [-56, -192, 112, 104], dibujo: cara(), densidad: D * 1.3 },
  { nombre: 'lechuza-parpado-1', caja: [A.ojos[0][0] - 15, A.ojos[0][1] - 15, 30, 30], dibujo: parpado(0), densidad: D * 1.3 },
  { nombre: 'lechuza-parpado-2', caja: [A.ojos[1][0] - 15, A.ojos[1][1] - 15, 30, 30], dibujo: parpado(1), densidad: D * 1.3 },
  { nombre: 'lechuza-pito', caja: [A.pico[0] - 2, A.pico[1] - 14, 42, 42], dibujo: pito(), densidad: D * 1.4 },
  { nombre: 'lechuza-pitido', caja: [WX - 6, WY - 40, 46, 64], dibujo: pitido(), densidad: 1.6 },
];

const img = imagenesDe(PIEZAS_LECHUZA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** La lechuza armada con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    parte('vuelo-atras', parte('cola', img('lechuza-cola'), t.cola), t['vuelo-atras']) +
    img('lechuza-rama') +
    parte('boleto', img('lechuza-boleto'), t.boleto) +
    parte('vuelo',
      parte('cuerpo',
        parte('abiertas', parte('abierta-1', img('lechuza-abierta-1'), t['abierta-1']) + parte('abierta-2', img('lechuza-abierta-2'), t['abierta-2']), '', o.abiertas) +
        img('lechuza-cuerpo') +
        parte('plegadas', parte('ala-1', img('lechuza-ala-1'), t['ala-1']) + parte('ala-2', img('lechuza-ala-2'), t['ala-2']), '', o.plegadas),
        t.cuerpo) +
      parte('patas', img('lechuza-patas'), t.patas) +
      parte('cabeza',
        img('lechuza-craneo') +
        parte('nuca', img('lechuza-nuca'), t.nuca, o.nuca) +
        parte('cara',
          img('lechuza-cara') +
          parte('parpado-1', img('lechuza-parpado-1'), t['parpado-1']) +
          parte('parpado-2', img('lechuza-parpado-2'), t['parpado-2']) +
          parte('pito', img('lechuza-pito') + parte('pitido', img('lechuza-pitido'), '', o.pitido), t.pito),
          t.cara, o.cara),
        t.cabeza),
      t.vuelo)
  );
}

/** La lechuza en un momento, sin lo que la hace tocable: para el test, el retrato y para mirarla. */
export function lechuzaEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: parada en la rama, mirando, con el pito en el pico. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--lechuza" data-id="la-lechuza-que-circula" role="button" tabindex="0" aria-label="${nombres.get('la-lechuza-que-circula') ?? 'La lechuza que circula'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: las alas abiertas en la rama, los ojos de par en par y el pito sonando. */
export const RETRATO = { caja: [LECHUZA.x - 104, LECHUZA.piso - 100, 208, 136] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('arbol-lejos') + fondo('arbol-piso') + lechuzaEn(CIRCULA);
}

export const LECHUZA_PERSONAJE: Personaje = {
  id: 'la-lechuza-que-circula',
  region: 'el-arbol',
  ancla: LECHUZA.ancla,
  piezas: PIEZAS_LECHUZA,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
