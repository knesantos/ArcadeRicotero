/**
 * El caníbal (`D-73`, decimoquinta vuelta), en la cabecera de la mesa servida.
 *
 * *"Soy un gourmet que huele eternamente mal. / Un caníbal de mi estilo."* es de *Yo caníbal*, que abre
 * *Cordero atado* (1993). El caníbal no está en ninguna tapa: se inventa en la de su disco (`D-19`,
 * `T-440`), y la del cordero es aerógrafo. **Está pintado como el frente de *Cordero atado***: la cara es
 * la máscara marrón de la bestia, con el ojo verde de persona y el borde rojo alrededor; las manos son
 * su pezuña, con las uñas blancas y cuadradas; el saco es la lana azul en escamas del cordero (el
 * gourmet se vistió con lo que se va a comer), y la sonrisa que pela es la de la contratapa del disco,
 * la medialuna negra con dos filas de dientes. Las tintas se midieron en las tapas (`--bestia-canibal-*`).
 *
 * La mesa viste *La mosca y la sopa*, que es collage: recortes pegados sobre el rojo. El caníbal es uno
 * más, un recorte de *Cordero atado* pegado en la cabecera. **Lo que es de la mesa es papel de la
 * mesa**: la servilleta atada al cuello es un recorte rasgado, del mismo papel que el canto de los
 * otros, con la salsa naranja de la olla chorreada encima; la silla es papel negro, como las de los
 * otros comensales. Así se despega del rojo sin contorno: el azul contra el rojo, el papel blanco, y
 * la luz fría que le entra de la ventana por la derecha, la que da a la pastura. Desde abajo le pega
 * la luz tibia del mantel, que es la que alumbra feo a uno que espera la comida.
 *
 * Coordenadas del títere: el (0, 0) es el canto de atrás del tablero, debajo del medio del caníbal;
 * arriba es negativo (`rig-canibal.ts`). Lo que baja de ahí lo tapa la mesa, salvo los codos, las
 * manos y los cubiertos, que están arriba del mantel.
 */

import { forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { azar } from './pincel.ts';
import {
  CANIBAL as LUGAR, CANIBAL_ARMADO as A, GESTOS, MOSCAS_QUIETAS, PIVOTES_PARPADO, codoDibujado, dondeVa, moscaEn, munecaDibujada, transformes,
  type Gesto, type Punto,
} from './rig-canibal.ts';

type P = Punto;
const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** Las tintas de *Cordero atado* (`--bestia-canibal-*`) y las de la mesa, que son de *La mosca y la sopa*. */
const C = {
  lana: 'var(--bestia-canibal-lana)',
  lanaHonda: 'var(--bestia-canibal-lana-honda)',
  lanaViva: 'var(--bestia-canibal-lana-viva)',
  mascara: 'var(--bestia-canibal-mascara)',
  mascaraLuz: 'var(--bestia-canibal-mascara-luz)',
  piel: 'var(--bestia-canibal-piel)',
  carne: 'var(--bestia-canibal-carne)',
  hondo: 'var(--bestia-canibal-hondo)',
  pezunia: 'var(--bestia-canibal-pezunia)',
  pezuniaLuz: 'var(--bestia-canibal-pezunia-luz)',
  una: 'var(--bestia-canibal-una)',
  papel: 'var(--entorno-mesa-papel)',
  blanco: 'var(--papel)',
  sepia: 'var(--entorno-mesa-sepia)',
  sepiaClara: 'var(--entorno-mesa-sepia-clara)',
  sepiaHonda: 'var(--entorno-mesa-sepia-honda)',
  haz: 'var(--entorno-mesa-haz)',
  salsa: 'var(--disco-la-mosca-y-la-sopa-tinta)',
  plata: 'var(--disco-ultimo-bondi-a-finisterre-tinta)',
  rojo: 'var(--entorno-mesa-rojo)',
  ojo: 'var(--bestia-ojo-blanco)',
  boca: 'var(--bestia-canibal-boca)',
  oro: 'var(--acento-2)',
  negro: 'var(--fondo)',
};

/* ------------------------------------------------------------------
   Herramientas: la curva, la máscara, el rasgado y el tubo
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
const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;
/** El rociado de la boquilla abierta encima del grano: el polvo grueso de las tapas, en la cara y el saco. */
const conRociado = (s: string): string => `<g filter="url(#rociado)">${conGrano(s)}</g>`;
const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;

/**
 * La máscara del aerógrafo, con varias siluetas que se suman. La imprenta junta los caminos del recorte
 * en uno: todos tienen que girar para el mismo lado, o se restan donde se pisan.
 */
function enmascarado(id: string, siluetas: string | readonly string[], adentro: string): string {
  const todas = typeof siluetas === 'string' ? [siluetas] : siluetas;
  return `<clipPath id="${id}">${todas.map((d) => `<path d="${d}"/>`).join('')}</clipPath><g clip-path="url(#${id})">${adentro}</g>`;
}

/** Un borde partido en dientes chicos: el papel rasgado a mano, como los recortes de la mesa. */
function rasgado(pts: readonly P[], amp: number, semilla: number, paso = 4): P[] {
  const rnd = azar(semilla);
  const salida: P[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i]!, pts[i + 1]!];
    const largo = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const k = Math.max(1, Math.round(largo / paso));
    const [nx, ny] = [-(b[1] - a[1]) / largo, (b[0] - a[0]) / largo];
    for (let j = 0; j < k; j++) {
      const t = j / k;
      const tiembla = j === 0 ? 0 : (rnd() - 0.5) * 2 * amp;
      salida.push([a[0] + (b[0] - a[0]) * t + nx * tiembla, a[1] + (b[1] - a[1]) * t + ny * tiembla]);
    }
  }
  salida.push(pts[pts.length - 1]!);
  return salida;
}

/** Un tubo derecho que se afina, de `a` a `b`: una manga. Las puntas se cierran redondas. */
function manga(a: P, b: P, anchos: readonly [number, number]): string {
  const largo = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const [ux, uy] = [(b[0] - a[0]) / largo, (b[1] - a[1]) / largo];
  const [nx, ny] = [-uy, ux];
  const [wa, wb] = [anchos[0] / 2, anchos[1] / 2];
  const m = (k: number, w: number): P => [a[0] + ux * largo * k + nx * w, a[1] + uy * largo * k + ny * w];
  return curva([
    [a[0] - ux * wa * 0.7, a[1] - uy * wa * 0.7],
    m(0, wa), m(0.5, (wa + wb) / 2 * 1.04), m(1, wb),
    [b[0] + ux * wb * 0.6, b[1] + uy * wb * 0.6],
    m(1, -wb), m(0.5, -(wa + wb) / 2 * 1.04), m(0, -wa),
  ]);
}

/**
 * La lana del cordero, en escamas: hileras de plumas que apuntan para abajo, como las del frente de
 * *Cordero atado*. Cada una es una máscara chica soplada: el borde de arriba duro, la punta blanda. Las
 * del lado de la ventana agarran el azul de tiza; las del otro lado casi no se ven.
 */
function escamas(x0: number, y0: number, x1: number, y1: number, semilla: number, luz: (p: P) => number, paso = 8): string {
  const rnd = azar(semilla);
  let s = '';
  let fila = 0;
  for (let y = y0; y < y1; y += paso * 0.72, fila++) {
    for (let x = x0 + (fila % 2 ? paso / 2 : 0); x < x1; x += paso) {
      const [cx, cy] = [x + (rnd() - 0.5) * 1.6, y + (rnd() - 0.5) * 1.4];
      const k = luz([cx, cy]);
      const w = paso * 0.5;
      const h = paso * (1 + rnd() * 0.25);
      const d = `M${f(cx - w)} ${f(cy)} C${f(cx - w)} ${f(cy + h * 0.55)} ${f(cx - w * 0.3)} ${f(cy + h * 0.9)} ${f(cx)} ${f(cy + h)} C${f(cx + w * 0.3)} ${f(cy + h * 0.9)} ${f(cx + w)} ${f(cy + h * 0.55)} ${f(cx + w)} ${f(cy)} Z`;
      s += forma(d, k > 0.55 ? C.lanaViva : C.lana, (k > 0.55 ? 0.14 + k * 0.32 : 0.12 + k * 0.38) * (0.75 + rnd() * 0.35));
      s += nube(cx, cy + h * 0.85, w * 0.8, h * 0.28, C.negro, 'xs', 0.35);
    }
  }
  return s;
}

/* ------------------------------------------------------------------
   La silla de la cabecera: papel negro, como las de los otros
   ------------------------------------------------------------------ */

const SILLA =
  'M-64 1 L-64 -148 L-67 -151 Q-70 -158 -65 -162 L-64 -172 L-63 -162 Q-58 -158 -60 -153 C-38 -166 -18 -178 0 -180 ' +
  'C18 -178 38 -166 60 -153 Q58 -158 63 -162 L64 -172 L65 -162 Q70 -158 67 -151 L64 -148 L64 1 Z';

function silla(): string {
  return (
    forma(SILLA, C.negro, 0.86) +
    // El canto del respaldo, tallado, con el rojo de la pared metido en la veta, como las sillas de adelante.
    trazo('M-57 -150 C-36 -162 -18 -173 0 -175 C18 -173 36 -162 57 -150', C.rojo, 2.4, 0.55) +
    // Lo poco que agarra de la ventana: el remate de la derecha.
    nube(65, -162, 2, 4, C.haz, 'xs', 0.3)
  );
}

/* ------------------------------------------------------------------
   El cuerpo: el saco de lana de cordero y la servilleta atada al cuello
   ------------------------------------------------------------------ */

/**
 * La silueta del saco: los hombros caídos de gordo, de la mesa a la mesa. El corte de abajo es una
 * recta en el canto del tablero (la cierra el `Z`): una curva ahí se pasaría al mantel.
 */
export const TORSO: readonly P[] = [
  [62, 0.6], [63, -7], [65, -22], [64, -39], [58, -51], [46, -59], [31, -64], [17, -67], [0, -64.5],
  [-17, -67], [-30, -64], [-45, -59], [-56, -51], [-62, -39], [-62, -22], [-59, -7], [-55.5, 0.6],
];
const SACO = `${curva(TORSO, false)} Z`;

/**
 * La servilleta: cuelga del cuello hasta abajo de la mesa, y se abre. Los costados van rasgados, como
 * los recortes de la mesa; abajo, derecha en el canto del tablero, que es donde la tapa la mesa.
 */
export const SERVILLETA: readonly P[] = [
  ...rasgado([[-19, -65], [-28, -50], [-35, -28], [-37, -8], [-36, 0.6]], 1.1, 911, 3.5),
  ...rasgado([[36.5, 0.6], [38, -8], [36, -28], [29, -50], [20, -65]], 1.1, 913, 3.5),
  [9, -63], [0, -62.5], [-9, -63],
];
/** Las dos puntas del nudo, que asoman a los costados del cuello. */
const PUNTA_1: readonly P[] = [[-20, -64.5], [-30, -73.5], [-26.5, -75.5], [-14, -68.5]];
const PUNTA_2: readonly P[] = [[20, -64.5], [31, -74.5], [27.5, -76.5], [14, -68.5]];

/** Cuánta luz de la ventana le toca a un punto del cuerpo: viene de arriba a la derecha. */
const ventanaEn = ([x, y]: P): number => Math.max(0, Math.min(1, 0.5 + x / 95 - (y + 60) / 260));

function salsa(): string {
  // La mancha grande, con sus chorreadas que bajan, y unas gotas sueltas: la salsa abunda.
  const rnd = azar(923);
  const [mx, my] = A.mancha;
  const borde: P[] = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const r = 7.5 + rnd() * 3.5;
    borde.push([mx + Math.cos(a) * r * 1.15, my + Math.sin(a) * r * 0.8]);
  }
  const chorreada = (x: number, largo: number, ancho: number): string =>
    forma(`M${f(x - ancho)} ${f(my + 4)} L${f(x - ancho * 0.7)} ${f(my + 4 + largo)} Q${f(x)} ${f(my + 6 + largo + ancho)} ${f(x + ancho * 0.7)} ${f(my + 4 + largo)} L${f(x + ancho)} ${f(my + 4)} Z`, C.salsa, 0.92);
  return (
    forma(curva(borde), C.salsa, 0.9) +
    chorreada(mx - 4, 13, 2.2) +
    chorreada(mx + 5, 21, 1.8) +
    nube(mx + 1, my - 1, 5, 3.5, C.carne, 's', 0.55) +
    nube(mx - 3, my - 2.5, 3, 1.6, C.blanco, 'xs', 0.4) +
    [[12, -48, 1.8], [17, -30, 1.3], [-24, -20, 1.5], [6, -14, 1.1]].map(([x, y, r]) => forma(elipse(x!, y!, r!, r! * 0.85), C.salsa, 0.85)).join('')
  );
}

function cuerpo(): string {
  const saco = SACO;
  const lana =
    forma(saco, C.lanaHonda) +
    // La luz fría de la ventana, del lado derecho; el otro lado se hunde en la pared oscura.
    nube(44, -36, 22, 34, C.lana, 'l', 0.95) +
    nube(60, -30, 5, 30, C.lanaViva, 'm', 0.6) +
    nube(50, -55, 12, 6, C.lanaViva, 'm', 0.45) +
    escamas(-64, -64, 66, 2, 931, ventanaEn) +
    nube(-46, -30, 20, 40, C.negro, 'l', 0.75) +
    nube(-60, -26, 6, 30, C.negro, 'm', 0.5) +
    // Las solapas, más hondas, que asoman a los costados de la servilleta.
    soplo('M-17 -66 L-31 -60 L-40 -30 L-39 -6 L-34 -6 L-32 -34 Z', C.hondo, 's', 0.85) +
    soplo('M17 -66 L31 -60 L41 -30 L40 -6 L35 -6 L33 -34 Z', C.hondo, 's', 0.7) +
    trazo('M31 -60 L41 -30 L40 -6', C.lanaViva, 1.2, 0.5) +
    // Lo tibio del mantel, que sube desde abajo, apenas.
    nube(0, 2, 60, 7, C.sepia, 'm', 0.3);
  const servilleta = poli(SERVILLETA);
  const papel =
    forma(servilleta, C.papel) +
    // La ventana le pega a la derecha; a la izquierda el papel se apaga.
    nube(22, -30, 16, 34, C.blanco, 'l', 0.9) +
    nube(-26, -26, 14, 36, C.sepiaClara, 'l', 0.85) +
    nube(-30, -20, 6, 30, C.sepia, 'm', 0.4) +
    // La sombra de la papada sobre el nudo, y los dos pliegues que bajan del cuello.
    nube(2, -60, 18, 6, C.sepia, 'm', 0.75) +
    nube(-12, -30, 2.2, 26, C.sepia, 's', 0.5) +
    nube(15, -32, 2, 24, C.sepia, 's', 0.4) +
    nube(18, -34, 1.2, 22, C.blanco, 'xs', 0.5) +
    salsa() +
    // Lo tibio del mantel, de abajo.
    nube(0, 1, 40, 5, C.sepiaClara, 's', 0.5);
  const punta = (pts: readonly P[], id: string, luz: number): string =>
    enmascarado(id, poli(pts), forma(poli(pts), C.papel) + nube(pts[1]![0], pts[1]![1], 8, 6, luz > 0.5 ? C.blanco : C.sepiaClara, 's', 0.8) + nube(pts[0]![0], pts[0]![1] + 1, 6, 3, C.sepia, 's', 0.6));
  // El moño de gourmet, que asoma entre las puntas del nudo, debajo de la papada: lo elegante.
  const mono = 'M-8 -70.5 L-1.4 -67.6 L1.4 -67.6 L8 -70.5 L8.6 -63.6 L1.4 -66.2 L-1.4 -66.2 L-8 -63.6 Z';
  return conRociado(
    enmascarado('m-canibal-saco', saco, lana) +
    enmascarado('m-canibal-servilleta', servilleta, papel) +
    punta(PUNTA_1, 'm-canibal-punta-1', 0.2) +
    punta(PUNTA_2, 'm-canibal-punta-2', 0.8) +
    enmascarado('m-canibal-mono', mono, forma(mono, C.negro) + nube(5, -68.5, 2.4, 1.6, C.lanaViva, 'xs', 0.7) + nube(0, -66.9, 1.6, 1.4, C.hondo, 'xs', 0.9) + nube(6.5, -66.4, 1.6, 1, C.sepiaClara, 'xs', 0.35)),
  );
}

/* ------------------------------------------------------------------
   La cabeza: de tres cuartos, mirando por la ventana, pelada
   ------------------------------------------------------------------ */

/** La silueta: la nuca, la pelada, la frente, la nariz grande, la boca, la papada, y el cuello que baja detrás del saco. */
export const CABEZA: readonly P[] = [
  [-18, -56], [-25, -73], [-29, -94], [-28, -116], [-20, -132], [-6, -142], [10, -145], [24, -139], [33, -128], [37, -117],
  [37, -109], [41, -103], [46, -97], [49, -93.5], [46.5, -90], [42, -89.5], [42.5, -86], [41.5, -82.5], [42.5, -79],
  [40, -74.5], [40.5, -70], [37, -66], [30, -62], [20, -59], [10, -57.5], [2, -53],
];

/**
 * Donde la luz corta la cara, como en el lobo de la tapa: de este lado de la línea, la nuca, la oreja
 * y la sien se van a lo hondo; del otro, la cara que mira la ventana. El borde es duro (la máscara de
 * papel) y adentro se sopla.
 */
const SOMBRA_CARA = 'M-40 -152 L-24 -150 Q-10 -140 -5 -126 Q-6 -116 -5.5 -106 Q-4 -98 3 -92 Q9 -84 9 -76 Q11 -66 16 -58 L16 -46 L-40 -46 Z';

function cabeza(): string {
  const silueta = curva(CABEZA);
  const rnd = azar(947);
  const [o1, o2] = A.ojos;
  /** El ojo: la cuenca honda de la máscara, el borde rojo, el blanco amarillento, y la bolsa de abajo. */
  const ojo = (o: (typeof A.ojos)[number], cerca: boolean): string => {
    const [cx, cy] = o.centro;
    const [rx, ry] = o.radio;
    return (
      nube(cx + 1, cy + 0.5, rx + 5, ry + 5, C.hondo, 's', 0.9) +
      nube(cx, cy - ry - 2, rx + 3, 2.6, C.negro, 's', 0.6) +
      // El pliegue del párpado de arriba, pesado.
      trazo(`M${f(cx - rx - 0.4)} ${f(cy - ry - 0.8)} Q${f(cx)} ${f(cy - ry - 3.6)} ${f(cx + rx + 0.8)} ${f(cy - ry - 1.2)}`, C.hondo, 0.8, 0.7) +
      nube(cx + 1, cy - ry - 3.2, rx * 0.7, 0.8, C.mascaraLuz, 'xs', 0.45) +
      forma(elipse(cx, cy + 0.5, rx + 0.9, ry + 0.8), C.carne, 0.75) +
      `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.ojo}"/>` +
      nube(cx - rx * 0.3, cy - ry * 0.4, rx * 0.9, ry * 0.7, C.hondo, 'xs', cerca ? 0.5 : 0.6) +
      nube(cx + rx * 0.6, cy + ry * 0.2, rx * 0.4, ry * 0.6, C.sepiaClara, 'xs', 0.45) +
      // La bolsa de abajo, la del que come de más y duerme de menos, prendida por el mantel.
      nube(cx + 0.5, cy + ry + 3.6, rx + 1, 2.4, C.carne, 's', 0.75) +
      nube(cx + 1, cy + ry + 5.2, rx, 1.5, C.mascaraLuz, 'xs', 0.7) +
      trazo(`M${f(cx - rx - 0.5)} ${f(cy + ry + 1.8)} Q${f(cx)} ${f(cy + ry + 4.2)} ${f(cx + rx + 1)} ${f(cy + ry + 1.4)}`, C.hondo, 0.8, 0.55)
    );
  };
  // Tres pelos grasientos peinados de costado sobre la pelada, y las manchas de viejo.
  let pelos = '';
  for (let i = 0; i < 4; i++) {
    const y = -137 + i * 3;
    const d = `M${f(-20 + rnd() * 3)} ${f(y + 13)} Q${f(-2 + rnd() * 4)} ${f(y - 4)} ${f(17 + rnd() * 5)} ${f(y + 1 + rnd() * 2)}`;
    pelos += trazo(d, C.hondo, 0.75, 0.6) + `<g transform="translate(0.3 -0.5)">${trazo(d, C.haz, 0.35, 0.25)}</g>`;
  }
  const manchas = [[4, -134, 2.4], [12, -128, 1.6], [-6, -126, 2], [20, -130, 1.2], [26, -122, 1.6]].map(([x, y, r]) => nube(x!, y!, r!, r! * 0.8, C.hondo, 'xs', 0.45)).join('');
  // La corona de pelo que le queda en la nuca, sobre la oreja: en la sombra.
  let corona = '';
  for (let i = 0; i < 30; i++) {
    const [x, y] = [-28 + rnd() * 16, -122 + rnd() * 44];
    corona += trazo(`M${f(x)} ${f(y)} q${f(-1.6 + rnd() * 2)} ${f(3 + rnd() * 3)} ${f(-1 - rnd() * 2)} ${f(6 + rnd() * 3)}`, rnd() < 0.25 ? C.mascara : C.negro, 0.8, 0.5);
  }
  const oreja = elipse(-15, -101, 5.4, 9.4);
  const adentro =
    forma(silueta, C.mascara) +
    // La cara que da a la ventana: la frente, el pómulo, la papada. Volumen soplado, de gordo.
    nube(24, -122, 15, 16, C.mascaraLuz, 'l', 0.8) +
    nube(29, -94, 10, 11, C.mascaraLuz, 'l', 0.85) +
    nube(22, -72, 12, 8, C.mascaraLuz, 'l', 0.7) +
    nube(14, -100, 10, 12, C.piel, 'm', 0.55) +
    // El pómulo y la frente, donde más pega: lo más claro de la máscara, como en la tapa.
    nube(30, -97, 5, 4, C.sepiaClara, 'm', 0.5) +
    nube(27, -127, 6, 5, C.sepiaClara, 'm', 0.4) +
    // La quijada, que separa la cara de la papada que cuelga.
    soplo('M8 -84 Q14 -74 26 -70 Q34 -68 39 -71 L39 -69 Q33 -66 25 -67.6 Q13 -71 6 -82 Z', C.hondo, 's', 0.55) +
    // Los cachetes colorados, de vino.
    nube(26, -92, 7, 5, C.carne, 'm', 0.55) +
    // La máscara marrón de la bestia del frente: le cruza la cara a la altura de los ojos.
    nube(16, -109, 22, 8, C.mascara, 'm', 0.9) +
    nube(15, -110, 18, 5, C.hondo, 'm', 0.5) +
    // La pelada: brillosa, con las manchas de viejo y lo que queda de pelo.
    nube(18, -136, 12, 6, C.mascaraLuz, 'm', 0.7) +
    manchas +
    pelos +
    // El ceño: el hueso de la frente agarra la ventana; abajo, la cuenca se hunde.
    nube(20, -118, 16, 2.4, C.mascaraLuz, 's', 0.7) +
    nube(30, -119, 7, 1.6, C.haz, 'xs', 0.4) +
    ojo(o1, true) +
    ojo(o2, false) +
    // La nariz grande, la que huele: el lomo frío de la ventana, la punta colorada y brillosa, la aleta
    // en sombra, y abajo la luz tibia del mantel.
    nube(41, -101, 3.4, 8, C.mascaraLuz, 's', 0.85) +
    nube(43.5, -103, 1.2, 6, C.haz, 'xs', 0.6) +
    nube(45.5, -94, 4, 3.2, C.carne, 's', 0.95) +
    nube(46.6, -95.6, 1.3, 1, C.haz, 'xs', 0.85) +
    nube(36.5, -93, 3.6, 3.2, C.hondo, 's', 0.85) +
    nube(39.5, -91, 3, 1.6, C.mascaraLuz, 's', 0.6) +
    nube(42, -90.2, 1.6, 0.9, C.negro, 'xs', 0.95) +
    // El surco que baja de la nariz a la comisura: sombra blanda, no una raya.
    soplo('M33.5 -92 Q28 -88 26.5 -80.5 L28 -80.5 Q30 -87 35 -91 Z', C.hondo, 'xs', 0.75) +
    // La boca cerrada, chica y carnosa: el labio de arriba en sombra, el de abajo gordo y prendido por
    // el mantel, y la comisura de la izquierda, que se le va para arriba.
    forma('M25 -85.2 Q29 -86.2 32.6 -86.8 Q34.6 -86 36.6 -86.6 Q39.6 -86.2 41.6 -84.4 L41.2 -83.9 Q33 -83.2 25.2 -84.6 Z', C.carne, 0.7) +
    nube(34, -86, 7, 1.2, C.hondo, 'xs', 0.6) +
    forma('M26.6 -83.6 Q33 -82.6 40.6 -83.6 Q39.8 -79.8 33.6 -79.3 Q28.4 -79.9 26.6 -83.6 Z', C.carne, 0.95) +
    nube(34, -81, 4.2, 1.3, C.mascaraLuz, 'xs', 0.85) +
    nube(35.4, -81.2, 1.2, 0.5, C.haz, 'xs', 0.7) +
    forma('M24.8 -84.9 Q30 -83.6 33 -83.7 Q37 -83.9 41.6 -84.3 L41.4 -83.4 Q37 -83 33 -82.9 Q29.4 -82.8 25.1 -84.1 Z', C.boca) +
    // La comisura de la izquierda, hundida y torcida para arriba: sonríe de costado.
    nube(24.6, -85, 1.4, 1.2, C.negro, 'xs', 0.85) +
    trazo('M24.7 -85.3 Q23.8 -86.4 24 -88', C.hondo, 0.7, 0.75) +
    nube(33.5, -77.6, 5, 0.9, C.hondo, 'xs', 0.5) +
    // La papada doble, que se apoya en la servilleta: el pliegue y la luz del mantel abajo de cada uno.
    soplo('M17 -64 Q27 -65.5 37.5 -68.5 L37 -66.6 Q27 -63.4 18 -62.2 Z', C.hondo, 'xs', 0.75) +
    nube(25, -60.5, 10, 2.2, C.sepiaClara, 's', 0.65) +
    nube(38, -72, 4, 2, C.sepiaClara, 's', 0.55) +
    nube(30, -77, 8, 4, C.mascaraLuz, 's', 0.5) +
    // Lo que no ve la ventana: la nuca, la oreja y la sien, del otro lado del corte.
    enmascarado('m-canibal-sombra', SOMBRA_CARA,
      forma(SOMBRA_CARA, C.hondo, 0.82) +
      nube(-3, -110, 4, 34, C.mascara, 's', 0.55) +
      // La nuca y el cráneo de este lado, apenas modelados en lo oscuro.
      nube(-16, -128, 8, 8, C.mascara, 'm', 0.35) +
      nube(-20, -80, 8, 10, C.mascara, 'm', 0.3) +
      // El rojo de la pared, que le rebota apenas en el canto de la nuca.
      nube(-28, -104, 3, 26, C.carne, 'm', 0.7) +
      enmascarado('m-canibal-oreja', oreja, forma(oreja, C.carne, 0.55) + nube(-13, -100, 3, 6, C.mascara, 's', 0.6) + nube(-16, -96, 2, 3, C.negro, 'xs', 0.8) + trazo('M-18.6 -108.6 Q-13.4 -112 -12 -103', C.mascara, 0.8, 0.6)) +
      corona) +
    // La luz fría que lo recorta por la derecha: el canto de la pelada y de la frente.
    trazo('M8 -144.8 Q25 -142 34.6 -127.6 Q38.6 -121 39.3 -114.5', C.haz, 1.3, 0.6) +
    nube(23, -140.5, 5, 1.4, C.haz, 'xs', 0.75) +
    nube(0, -55, 16, 5, C.negro, 's', 0.7);
  return conRociado(enmascarado('m-canibal-cabeza', silueta, adentro));
}

/* ------------------------------------------------------------------
   Los brazos: las mangas de lana, los puños de camisa y las manos de pezuña
   ------------------------------------------------------------------ */

/** El brazo, del hombro al codo, dibujado derecho para abajo. El de la derecha agarra la ventana. */
function brazo(n: 0 | 1): string {
  const s = A.hombros[n];
  const e = codoDibujado(n);
  const d = manga([s[0], s[1] - 4], [e[0], e[1] + 2], [24, 19]);
  const luz = n === 1;
  return conGrano(
    enmascarado(`m-canibal-brazo-${n + 1}`, d,
      forma(d, C.lanaHonda) +
      escamas(s[0] - 14, s[1] - 6, s[0] + 14, e[1] + 4, 951 + n, () => (luz ? 0.65 : 0.15), 7) +
      nube(s[0] + 7, (s[1] + e[1]) / 2, 5, 36, luz ? C.lanaViva : C.lana, 'm', luz ? 0.55 : 0.35) +
      nube(s[0] - 8, (s[1] + e[1]) / 2, 6, 36, C.negro, 'm', luz ? 0.4 : 0.7) +
      nube(s[0], s[1] - 2, 12, 5, luz ? C.lanaViva : C.lana, 'm', luz ? 0.4 : 0.15)),
  );
}

/** El antebrazo, del codo apoyado en el mantel a la muñeca, con el puño de la camisa y el gemelo. */
function antebrazo(n: 0 | 1): string {
  const e = codoDibujado(n);
  const w = munecaDibujada(n);
  const d = manga([e[0], e[1] + 3], [w[0], w[1] + 4], [19, 16]);
  const luz = n === 1;
  const puno = curva([[w[0] - 8.6, w[1] + 7], [w[0] - 8.2, w[1] + 1], [w[0], w[1] - 0.4], [w[0] + 8.2, w[1] + 1], [w[0] + 8.6, w[1] + 7], [w[0], w[1] + 7.8]]);
  return conGrano(
    // La sombra del codo en el mantel, abajo de todo.
    nube(e[0] + 1, e[1] + 5.5, 12, 3.2, C.sepiaHonda, 's', 0.7) +
    enmascarado(`m-canibal-antebrazo-${n + 1}`, d,
      forma(d, C.lanaHonda) +
      escamas(e[0] - 12, w[1] + 4, e[0] + 12, e[1] + 8, 961 + n, () => (luz ? 0.7 : 0.25), 6.5) +
      nube(e[0] + 6, (e[1] + w[1]) / 2, 4, 20, luz ? C.lanaViva : C.lana, 'm', luz ? 0.6 : 0.4) +
      nube(e[0] - 6, (e[1] + w[1]) / 2, 4, 20, C.negro, 'm', 0.55) +
      // El codo, gastado de tanto apoyarlo.
      nube(e[0], e[1] + 2, 8, 4, C.lana, 's', 0.5)) +
    enmascarado(`m-canibal-puno-camisa-${n + 1}`, puno,
      forma(puno, C.papel) + nube(w[0] - 5, w[1] + 4, 4, 5, C.sepiaClara, 's', 0.9) + nube(w[0] + 5, w[1] + 3, 3, 4, C.blanco, 's', 0.7) + nube(w[0], w[1] + 7.5, 9, 1.4, C.sepia, 'xs', 0.6)) +
    // El gemelo de oro, que es lo único que brilla.
    nube(w[0] + (n ? 5.5 : -5.5), w[1] + 4, 1.4, 1.4, C.oro, 'xs', 0.95),
  );
}

/**
 * La mano: un puño de pezuña que agarra el cubierto parado. Los dedos se doblan alrededor del mango y
 * las uñas quedan para afuera, blancas y cuadradas, como las de las pezuñas de la tapa. La 1 tiene el
 * cuchillo de carne, con dientes; la 2, el tenedor.
 */
function mano(n: 0 | 1): string {
  const [wx, wy] = munecaDibujada(n);
  const cy = wy - A.puno;
  const lado = n === 0 ? -1 : 1;
  const largo = n === 0 ? A.cuchillo : A.tenedor;
  const tope = cy - 8;
  const luz = n === 1 ? 1 : 0.55;
  // El cubierto: el mango de madera que asoma abajo del puño, y la hoja o los dientes arriba.
  const mango = forma(`M${f(wx - 2.4)} ${f(cy)} L${f(wx + 2.4)} ${f(cy)} L${f(wx + 2.2)} ${f(wy + 9)} Q${f(wx)} ${f(wy + 10.6)} ${f(wx - 2.2)} ${f(wy + 9)} Z`, C.sepiaHonda) +
    nube(wx + 1, wy + 4, 0.8, 4, C.sepiaClara, 'xs', 0.6) + nube(wx, wy + 8, 1.6, 0.8, C.oro, 'xs', 0.5);
  let hoja = '';
  if (n === 0) {
    // El cuchillo de carne: el lomo derecho, el filo con dientes que se curva hasta la punta.
    let dientes = '';
    const pasos = 11;
    for (let i = 0; i <= pasos; i++) {
      const y = tope - 3 - (i * (largo - 8)) / pasos;
      const x = wx - 2.6 - Math.sin((i / pasos) * Math.PI * 0.5) * 0.6;
      dientes += `L${f(x - 0.9)} ${f(y + 1.6)} L${f(x)} ${f(y)} `;
    }
    const d = `M${f(wx + 2.2)} ${f(tope)} L${f(wx + 2.2)} ${f(tope - largo + 3)} Q${f(wx + 1.6)} ${f(tope - largo - 1)} ${f(wx - 1.2)} ${f(tope - largo + 2)} ${dientes}L${f(wx - 2.4)} ${f(tope)} Z`;
    hoja = enmascarado('m-canibal-cuchillo', d,
      forma(d, C.plata) +
      nube(wx + 1.4, tope - largo / 2, 0.9, largo / 2, C.haz, 'xs', 0.9) +
      nube(wx - 2, tope - largo / 2, 1, largo / 2, C.hondo, 'xs', 0.6) +
      nube(wx, tope - largo * 0.3, 2, 3, C.blanco, 'xs', 0.5)) +
      forma(`M${f(wx - 3.4)} ${f(tope + 0.8)} L${f(wx + 3.4)} ${f(tope + 0.8)} L${f(wx + 3)} ${f(tope - 1.4)} L${f(wx - 3)} ${f(tope - 1.4)} Z`, C.plata);
  } else {
    // El tenedor: el cuello finito, la pala que se abre y los cuatro dientes.
    const base = tope - largo + 12;
    const d =
      `M${f(wx - 1.5)} ${f(tope)} L${f(wx - 1.3)} ${f(base + 6)} Q${f(wx - 4.6)} ${f(base + 3)} ${f(wx - 4.6)} ${f(base)} ` +
      [0, 1, 2, 3].map((i) => {
        const x = wx - 4.6 + i * 3.07;
        return `L${f(x)} ${f(tope - largo)} L${f(x + 1.4)} ${f(tope - largo)} L${f(x + 1.4)} ${f(base - 0.4)} L${f(x + 1.67)} ${f(base - 0.4)}`;
      }).join(' ') +
      ` L${f(wx + 4.6)} ${f(base)} Q${f(wx + 4.6)} ${f(base + 3)} ${f(wx + 1.3)} ${f(base + 6)} L${f(wx + 1.5)} ${f(tope)} Z`;
    hoja = enmascarado('m-canibal-tenedor', d,
      forma(d, C.plata) +
      nube(wx + 2.4, tope - largo / 2, 1.2, largo / 2, C.haz, 'xs', 0.95) +
      nube(wx - 2.6, tope - largo / 2, 1.2, largo / 2, C.hondo, 'xs', 0.55));
  }
  // El puño: el dorso, y los cuatro dedos doblados alrededor del mango, uno debajo del otro, cada uno
  // más chico, con la uña blanca y cuadrada en la punta: la pezuña de la tapa. El pulgar aprieta arriba.
  const dorso = curva(([[wx - lado * 9, cy + 7], [wx - lado * 9.6, cy], [wx - lado * 8, cy - 7], [wx, cy - 8.4], [wx + lado * 3, cy + 2], [wx + lado * 2, cy + 8.6]] as P[])[lado < 0 ? 'slice' : 'reverse']());
  const dedos = [0, 1, 2, 3].map((i) => {
    const largo = 7.4 - i * 0.7;
    return { x: wx + lado * (1.6 + i * 0.4), y: cy - 4.2 + i * 3.7, rx: largo, ry: 2.3 - i * 0.12 };
  });
  const pulgar = elipse(wx - lado * 0.6, cy - 7.8, 5.8, 2.9);
  let modelado = '';
  for (const [i, d] of dedos.entries()) {
    const punta = d.x + lado * (d.rx - 1.4);
    modelado +=
      // El dedo, prendido arriba por la ventana y el mantel, y la sombra que le tira el de arriba.
      nube(d.x + lado * 1, d.y - 0.7, d.rx * 0.8, 0.9, C.pezuniaLuz, 'xs', (0.5 + 0.3 * luz) * (1 - i * 0.12)) +
      soplo(`M${f(d.x - d.rx)} ${f(d.y + d.ry - 0.6)} Q${f(d.x)} ${f(d.y + d.ry + 0.9)} ${f(d.x + d.rx)} ${f(d.y + d.ry - 0.6)} L${f(d.x + d.rx)} ${f(d.y + d.ry + 0.4)} L${f(d.x - d.rx)} ${f(d.y + d.ry + 0.4)} Z`, C.hondo, 'xs', 0.7) +
      // La uña: blanca, cuadrada, en la punta de cada dedo, como las de la pezuña.
      forma(`M${f(punta - 1.6)} ${f(d.y - 1.2)} L${f(punta + 1.6)} ${f(d.y - 1.2)} L${f(punta + 1.5)} ${f(d.y + 1.2)} L${f(punta - 1.5)} ${f(d.y + 1.2)} Z`, C.una, 0.95) +
      nube(punta + lado * 0.6, d.y + 0.6, 0.9, 0.8, C.sepia, 'xs', 0.55);
  }
  const siluetas = [dorso, ...dedos.map((d) => elipse(d.x, d.y, d.rx, d.ry)), pulgar];
  const puno =
    siluetas.map((d) => forma(d, C.pezunia)).join('') +
    nube(wx - lado * 6, cy, 4, 8, n === 1 ? C.hondo : C.negro, 's', 0.6) +
    nube(wx + 3, cy - 1, 5, 7, C.pezuniaLuz, 's', 0.45 * luz) +
    modelado +
    // El pulgar, que aprieta el mango por arriba, prendido, con su uña.
    nube(wx - lado * 0.6, cy - 8.6, 4.6, 1.4, C.pezuniaLuz, 'xs', 0.55 + 0.35 * luz) +
    forma(elipse(wx + lado * 3.6, cy - 7.9, 1.7, 1.2), C.una, 0.9) +
    // Lo tibio del mantel, abajo del puño.
    nube(wx, cy + 8, 7, 1.6, C.mascaraLuz, 's', 0.45);
  return conGrano(mango + hoja + enmascarado(`m-canibal-mano-${n + 1}`, siluetas, puno));
}

/* ------------------------------------------------------------------
   La mosca: las de la mesa, que lo prefieren a él
   ------------------------------------------------------------------ */

/** Una mosca chica, como la de la sopa (`mosca` en `arte-entornos.ts`): el cuerpo negro, las alas de vidrio. */
function mosca(): string {
  const t = 6.4;
  return (
    forma(elipse(-t * 0.8, -t * 0.3, t * 0.82, t * 0.36), C.haz, 0.5) +
    forma(elipse(t * 0.8, -t * 0.3, t * 0.82, t * 0.36), C.haz, 0.5) +
    trazo(`M${f(-t * 0.3)} ${f(t * 0.1)} l${f(-t * 0.5)} ${f(t * 0.5)} M${f(t * 0.3)} ${f(t * 0.1)} l${f(t * 0.5)} ${f(t * 0.5)} M${f(-t * 0.3)} ${f(-t * 0.2)} l${f(-t * 0.55)} ${f(-t * 0.2)} M${f(t * 0.3)} ${f(-t * 0.2)} l${f(t * 0.55)} ${f(-t * 0.2)}`, C.negro, t * 0.11) +
    forma(elipse(0, t * 0.2, t * 0.42, t * 0.72), C.negro) +
    forma(elipse(0, -t * 0.62, t * 0.38, t * 0.34), C.negro) +
    nube(-t * 0.16, -t * 0.7, t * 0.12, t * 0.1, C.carne, 'xs', 0.9) +
    nube(t * 0.16, -t * 0.7, t * 0.12, t * 0.1, C.carne, 'xs', 0.9) +
    forma(elipse(-t * 0.14, t * 0.05, t * 0.08, t * 0.22), C.haz, 0.45)
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

/** La densidad la pide la ficha, que lo muestra de cerca. En la escena sobra. */
const D = 4;

const cajaMano = (n: 0 | 1): readonly [number, number, number, number] => {
  const [wx, wy] = munecaDibujada(n);
  const largo = n === 0 ? A.cuchillo : A.tenedor;
  return [wx - 11, wy - A.puno - 10 - largo, 22, largo + A.puno + 23];
};
const cajaBrazo = (n: 0 | 1): readonly [number, number, number, number] => {
  const [sx, sy] = A.hombros[n];
  return [sx - 14, sy - 12, 28, A.largos.brazo + 24];
};
const cajaAntebrazo = (n: 0 | 1): readonly [number, number, number, number] => {
  const [ex, ey] = codoDibujado(n);
  const [, wy] = munecaDibujada(n);
  return [ex - 14, wy - 4, 28, ey - wy + 16];
};

export const PIEZAS_CANIBAL: readonly Pieza[] = [
  { nombre: 'canibal-silla', caja: [-74, -186, 148, 189], dibujo: silla(), densidad: 2 },
  { nombre: 'canibal-cabeza', caja: [-32, -150, 86, 98], dibujo: cabeza(), densidad: D * 1.3 },
  { nombre: 'canibal-cuerpo', caja: [-68, -84, 136, 87], dibujo: cuerpo(), densidad: D },
  { nombre: 'canibal-brazo-1', caja: cajaBrazo(0), dibujo: brazo(0), densidad: D },
  { nombre: 'canibal-antebrazo-1', caja: cajaAntebrazo(0), dibujo: antebrazo(0), densidad: D },
  { nombre: 'canibal-mano-1', caja: cajaMano(0), dibujo: mano(0), densidad: D * 1.2 },
  { nombre: 'canibal-brazo-2', caja: cajaBrazo(1), dibujo: brazo(1), densidad: D },
  { nombre: 'canibal-antebrazo-2', caja: cajaAntebrazo(1), dibujo: antebrazo(1), densidad: D },
  { nombre: 'canibal-mano-2', caja: cajaMano(1), dibujo: mano(1), densidad: D * 1.2 },
  { nombre: 'canibal-mosca', caja: [-10, -10, 20, 18], dibujo: mosca(), densidad: 6 },
];

const img = imagenesDe(PIEZAS_CANIBAL);
const parte = (nombre: string, cuerpo: string, transform = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}>${cuerpo}</g>`;

/** Los ojos de la página: la pupila verde que mira y el párpado que baja. Van adentro de la cabeza. */
function ojos(t: Readonly<Record<string, string>>): string {
  return A.ojos
    .map(({ centro: [cx, cy], radio: [rx, ry] }, i) => {
      const n = i + 1;
      const [px, py] = PIVOTES_PARPADO[i]!;
      const ri = ry * 0.86;
      return (
        `<g data-parte="pupila-${n}" transform="${t[`pupila-${n}`]}">` +
        `<circle cx="${cx}" cy="${cy}" r="${f(ri)}" class="bt-canibal-iris"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${f(ri * 0.5)}" class="bt-canibal-pupila"/>` +
        `<circle cx="${f(cx + ri * 0.34)}" cy="${f(cy - ri * 0.36)}" r="${f(ri * 0.22)}" class="bt-canibal-brillo"/></g>` +
        // El párpado de la máscara, con el borde de las pestañas: baja desde arriba del ojo.
        `<g data-parte="parpado-${n}" data-pivote="${px} ${py}" transform="${t[`parpado-${n}`]}">` +
        `<ellipse cx="${cx}" cy="${f(cy - 0.2)}" rx="${f(rx + 1.1)}" ry="${f(ry + 0.9)}" class="bt-canibal-parpado"/>` +
        `<path d="M${f(cx - rx - 0.8)} ${f(cy - 0.2)} Q${cx} ${f(cy - 0.2 + 2 * (ry + 0.9))} ${f(cx + rx + 0.8)} ${f(cy - 0.2)}" class="bt-canibal-pestana"/></g>`
      );
    })
    .join('');
}

/**
 * La sonrisa de la contratapa de *Cordero atado*: la medialuna negra con dos filas de dientes, que se
 * abre de costado, casi de oreja a oreja. Y la lengua, que pasa por el labio. Son tinta de la página
 * (`bt-canibal-*`): la isla las prende y las apaga.
 */
function boca(t: Readonly<Record<string, string>>): string {
  const medialuna = 'M20.5 -86.8 Q31 -84.4 43 -87.4 Q42 -77.8 33.5 -74.6 Q24.6 -76.6 20.5 -86.8 Z';
  const fila = (pts: ReadonlyArray<readonly [number, number, number, number]>): string => pts.map(([x, y, w, h]) => `M${f(x - w / 2)} ${f(y)} q0 ${f(h)} ${f(w / 2)} ${f(h)} q${f(w / 2)} 0 ${f(w / 2)} ${f(-h)} Z`).join(' ');
  const arriba = fila([[23.4, -86.2, 2.6, 3], [26.4, -85.6, 2.8, 3.4], [29.4, -85.3, 2.9, 3.6], [32.5, -85.3, 2.8, 3.6], [35.6, -85.6, 2.6, 3.4], [38.5, -86.1, 2.4, 3.1], [41.1, -86.8, 2.1, 2.6]]);
  const abajo = fila([[27, -78.7, 2.5, -2.6], [30, -77.6, 2.7, -2.9], [33, -77.4, 2.7, -3], [36, -78.2, 2.5, -2.8], [38.8, -79.6, 2.2, -2.5]]);
  return (
    `<g data-parte="mueca" opacity="${t.mueca}"><path d="${medialuna}" class="bt-canibal-boca"/><path d="${arriba} ${abajo}" class="bt-canibal-dientes"/></g>` +
    `<g data-parte="relame" opacity="${t.relame}"><g data-parte="lengua" transform="${t.lengua}"><path d="M30 -84 Q33.5 -86 37 -84 Q37 -80.6 33.5 -80.4 Q30 -80.6 30 -84 Z" class="bt-canibal-lengua"/></g></g>`
  );
}

/** El caníbal armado con las transformaciones de un gesto (`transformes`, `rig-canibal.ts`). */
function armado(g: Gesto): string {
  const t = transformes(g);
  const brazoCon = (n: 0 | 1): string =>
    parte(`brazo-${n + 1}`, img(`canibal-brazo-${n + 1}`) + parte(`antebrazo-${n + 1}`, img(`canibal-antebrazo-${n + 1}`) + parte(`mano-${n + 1}`, img(`canibal-mano-${n + 1}`), t[`mano-${n + 1}`]), t[`antebrazo-${n + 1}`]), t[`brazo-${n + 1}`]);
  const moscas = MOSCAS_QUIETAS.map((m, i) => parte(`mosca-${i + 1}`, img('canibal-mosca'), moscaEn(dondeVa(m, g), m.giro))).join('');
  return (
    img('canibal-silla') +
    parte('cabeza', img('canibal-cabeza') + ojos(t) + boca(t), t.cabeza) +
    parte('torso', img('canibal-cuerpo'), t.torso) +
    brazoCon(1) +
    brazoCon(0) +
    `<g class="canibal-moscas">${moscas}</g>`
  );
}

/** El caníbal en un gesto, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function canibalEn(g: Gesto = GESTOS.ventana): string {
  return `<g transform="${transformes(g).entero}">${armado(g)}</g>`;
}

/** El títere que se toca, en la pose quieta: mira por la ventana para el lado de la pastura. */
function titere(nombres: ReadonlyMap<string, string>): string {
  const g = GESTOS.ventana;
  return (
    `<g class="titere titere--canibal" data-id="el-canibal" role="button" tabindex="0" aria-label="${nombres.get('el-canibal') ?? 'El caníbal'}">` +
    `<g data-parte="entero" transform="${transformes(g).entero}">${armado(g)}</g>` +
    `</g>`
  );
}

/**
 * El retrato de la ficha: el caníbal en su cabecera, sobre su pedazo de pared y de mesa (las dos capas
 * del recinto, que la página ya cargó), mirando la ventana.
 */
export const RETRATO = { caja: [46, 228, 108, 124] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('mesa-lejos') + fondo('mesa-piso') + canibalEn(GESTOS.ventana);
}

export const CANIBAL: Personaje = {
  id: 'el-canibal',
  region: 'la-mesa',
  ancla: LUGAR.x,
  piezas: PIEZAS_CANIBAL,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
