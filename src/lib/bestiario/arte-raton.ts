/**
 * El ratón (`D-73`, vigesimocuarta vuelta), en la canaleta del canto, con el gato matón encima.
 *
 * *"Quiero verte oler como el ratón el peligro del gato matón"* es de *Rock para el negro Atila*, en *Lobo
 * suelto* (1993); en *Noticias de ayer* vuelve: *"que gocen los ratones"*. Es un ratón que vive de oler: todo
 * el bicho es un hocico, con una nariz roja de tanto meterla, y unos bigotes que trabajan solos, cada mazo
 * por su lado. Ya zafó otras veces: tiene la oreja mordida, un bigote quebrado, una calva
 * en el anca y una curita en la cola. En el fondo de la canaleta guarda un pedazo de queso de rallar
 * robado, con la marca de los dientes y de la rallada.
 *
 * Viste las tapas de *Lobo suelto*, medidas con sharp: el pelo es el gris verdoso del aerógrafo de las manos
 * del interior del disco, la nariz es el rojo de la lengua de ese mismo interior, y lo pelado (las orejas,
 * las manos, la cola) es el lila de la cara de la bestia de la tapa. La canaleta es de zinc, el gris claro
 * de esas manos, con el óxido de la cadena de gillettes.
 *
 * Coordenadas: el (0, 0) es el fondo de la canaleta debajo de la panza, y mira a la izquierda (`rig-raton.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { HUELE, QUIETO, RATON, RATON_ARMADO as A, marcas, type Momento } from './rig-raton.ts';

/** Las tintas de *Lobo suelto* (`tokens.css`). */
const C = {
  pelo: 'var(--bestia-raton-pelo)',
  peloClaro: 'var(--bestia-raton-pelo-claro)',
  peloHondo: 'var(--bestia-raton-pelo-hondo)',
  gris: 'var(--bestia-raton-gris)',
  tinta: 'var(--bestia-raton-tinta)',
  panza: 'var(--bestia-raton-panza)',
  rosa: 'var(--bestia-raton-rosa)',
  rosaClara: 'var(--bestia-raton-rosa-clara)',
  nariz: 'var(--bestia-raton-nariz)',
  narizHonda: 'var(--bestia-raton-nariz-honda)',
  ojo: 'var(--bestia-raton-ojo)',
  diente: 'var(--bestia-raton-diente)',
  queso: 'var(--bestia-raton-queso)',
  cascara: 'var(--bestia-raton-queso-cascara)',
  quesoHondo: 'var(--bestia-raton-queso-hondo)',
  zinc: 'var(--bestia-raton-zinc)',
  zincClaro: 'var(--bestia-raton-zinc-claro)',
  zincHondo: 'var(--bestia-raton-zinc-hondo)',
  oxido: 'var(--bestia-raton-oxido)',
  hueco: 'var(--bestia-raton-hueco)',
  hoja: 'var(--bestia-raton-hoja)',
};

/* ------------------------------------------------------------------
   La canaleta: el fondo, con la bajada, y el labio de adelante
   ------------------------------------------------------------------ */

const [C0, C1] = [-102, 110];

/** Lo de adentro de la canaleta: el hueco oscuro, el borde de atrás y la bajada que se va por la pared. */
function canaleta(): string {
  const bajada = curva([[92, 8], [104, 8], [105, 62], [91, 62]]);
  return conGrano(
    forma(cajaRedonda(C0, -12, C1 - C0, 16, 3), C.hueco) +
    trazo(`M${C0 + 2} -11 L${C1 - 2} -11`, C.zincHondo, 2.4, 0.9) + trazo(`M${C0 + 4} -12 L${C1 - 4} -12`, C.zincClaro, 0.9, 0.6) +
    // La mugre del fondo: barro seco, una ramita y la humedad que nunca se va.
    nube(-20, -2, 70, 4, C.hoja, 'm', 0.45) + trazo('M18 -4 l16 -3 l4 2', C.hoja, 1.1, 0.8) +
    enmascarado('m-raton-bajada', bajada, forma(bajada, C.zinc) + nube(94, 34, 3, 28, C.zincHondo, 's', 0.8) + nube(102, 30, 2, 26, C.zincClaro, 's', 0.7) + nube(98, 50, 6, 10, C.oxido, 'm', 0.7)) +
    trazo('M90 40 L106 40 M90 56 L106 56', C.zincHondo, 1.4, 0.8),
  );
}

/** El labio de la canaleta, de zinc abollado, con las grampas, el óxido y una hoja seca enganchada. */
function labio(): string {
  const d = `M${C0} -6 L${C1} -6 L${C1} 8 Q${C1 - 4} 20 ${C1 - 16} 20 L${C0 + 14} 20 Q${C0 + 2} 20 ${C0} 8 Z`;
  const abolladura = (x: number, y: number, r: number): string => nube(x - r * 0.3, y - r * 0.2, r, r * 0.7, C.zincHondo, 's', 0.8) + nube(x + r * 0.4, y + r * 0.3, r * 0.8, r * 0.5, C.zincClaro, 's', 0.8);
  // El óxido chorrea de las uniones y de los remaches.
  const chorro = (x: number): string => nube(x, 6, 4, 9, C.oxido, 's', 0.75) + trazo(`M${x} 2 q1 8 -1 16`, C.oxido, 1, 0.7);
  const hoja = curva([[98, 2], [108, 6], [113, 18], [106, 28], [99, 20]]);
  return conGrano(
    enmascarado('m-raton-labio', d,
      forma(d, C.zinc) + nube(0, 8, 130, 14, C.zincHondo, 'l', 0.55) +
      nube(0, 18, 120, 6, C.zincHondo, 'm', 0.9) + nube(-20, -1, 90, 2.4, C.zincClaro, 's', 0.7) +
      abolladura(-62, 8, 9) + abolladura(-8, 10, 6) + abolladura(46, 6, 10) +
      chorro(-30) + chorro(20) + chorro(84) +
      // La unión de dos tramos, con sus remaches.
      trazo('M20 -6 L20 20', C.zincHondo, 1.4) + trazo('M22 -6 L22 20', C.zincClaro, 0.8, 0.8) +
      [-1, 6, 13].map((y) => forma(elipse(17, y, 1.4, 1.4), C.zincHondo) + forma(elipse(25, y, 1.4, 1.4), C.zincHondo)).join('')) +
    // El borde enrollado de arriba, que brilla con el farol.
    trazo(`M${C0} -6 L${C1} -6`, C.zincClaro, 3) + trazo(`M${C0} -4.4 L${C1} -4.4`, C.zincHondo, 0.8, 0.8) +
    // La tapa de la punta, que es del lado del gato.
    forma(elipse(C0, 7, 4, 13), C.zincHondo) + forma(elipse(C0 - 1, 7, 2, 11), C.zinc) +
    // Las grampas que la cuelgan de la chapa.
    [-70, 64].map((x) => forma(poli([[x - 3, -14], [x + 3, -14], [x + 3, 2], [x - 3, 2]]), C.zincHondo) + forma(elipse(x, -10, 1.4, 1.4), C.zincClaro)).join('') +
    // La hoja seca, colgada del borde.
    enmascarado('m-raton-hoja', hoja, forma(hoja, C.hoja) + nube(108, 12, 5, 6, C.oxido, 's', 0.8) + nube(102, 24, 4, 4, C.tinta, 's', 0.5)) +
    trazo('M100 4 Q106 14 105 26', C.queso, 0.7, 0.6) + trazo('M99 3 l-2 -6', C.hoja, 1),
  );
}

/* ------------------------------------------------------------------
   El queso de rallar, robado
   ------------------------------------------------------------------ */


function queso(): string {
  // Una cuña de reggianito: la cáscara del lado de afuera, la mordida en la punta y la rallada en la cara.
  const d = curva([[-90, 3], [-90, -6], [-86, -16], [-80, -16], [-72, -11], [-68, -12], [-64, -8], [-60, -8], [-58, -2], [-58, 3]]);
  const ralla = Array.from({ length: 4 }, (_, i) => Array.from({ length: 5 - i }, (_, j) => forma(elipse(-82 + j * 4 + i * 2, -8 + i * 3, 0.8, 0.5), C.quesoHondo)).join('')).join('');
  // Se dibuja en el fondo y se sube y se agranda a su lugar: asoma por arriba del labio, que se vea que lo tiene.
  return `<g transform="translate(-74 ${A.queso[1]}) scale(1.25) translate(74 -2)">` + conGrano(
    nube(-74, 3, 18, 2.4, C.hueco, 's', 0.8) +
    enmascarado('m-raton-queso', d,
      forma(d, C.queso) + nube(-80, -10, 8, 4, C.panza, 's', 0.7) + nube(-66, 0, 10, 4, C.quesoHondo, 's', 0.7) +
      forma(poli([[-92, 4], [-92, -8], [-88, -18], [-84, -18], [-86, -6], [-86, 4]]), C.cascara) +
      nube(-88, -2, 2, 8, C.quesoHondo, 'xs', 0.8) + ralla) +
    // La marca de los dientes en la mordida: dos rayitas por diente.
    trazo('M-71 -10 l1 3 M-67 -11 l1 3 M-63 -7 l1 3', C.quesoHondo, 0.7, 0.9),
  ) + `</g>`;
}

/** El olor del gato que le llega: tres hilos que bajan ondulando del lado de la chapa hasta la nariz. */
function olor(): string {
  const hilo = (y: number, k: number): string => {
    const d = `M${-150 + k * 6} ${y - 30} q10 -8 18 0 t18 4 t18 2 t16 10 t12 10`;
    return trazo(d, C.panza, 3.2, 0.35) + trazo(d, C.rosaClara, 1.2, 0.85);
  };
  return nube(-118, -54, 30, 10, C.panza, 'm', 0.25, 30) + hilo(-30, 0) + hilo(-20, 3) + hilo(-40, -2);
}

/* ------------------------------------------------------------------
   El cuerpo, el pelo erizado, la cola y los brazos
   ------------------------------------------------------------------ */

const LOMO: readonly P[] = [[-24, -20], [-20, -36], [-6, -48], [14, -53], [34, -50], [50, -40], [58, -22], [52, -6], [38, 0], [10, 1], [-12, 0], [-22, -8]];

function cuerpo(): string {
  const d = curva(LOMO);
  const anca = curva([[20, -30], [40, -36], [56, -22], [52, -4], [32, -2], [18, -14]]);
  const pie = curva([[12, -4], [40, -4], [48, -1], [44, 2], [12, 2]]);
  // El pelo corto, a contrapelo en el lomo, de ratón que duerme mojado.
  const pelos = Array.from({ length: 14 }, (_, i) => {
    const x = -14 + i * 5;
    const y = -40 - Math.sin(((i + 1) / 15) * Math.PI) * 12;
    return trazo(`M${x} ${y + 4} l${-2 + (i % 3)} -5`, i % 2 ? C.tinta : C.peloClaro, 0.7, 0.55);
  }).join('');
  return conGrano(
    enmascarado('m-raton-lomo', d,
      forma(d, C.pelo) +
      // El lomo oscuro y la panza clara, y la luz del farol que le pega de arriba.
      nube(14, -46, 40, 10, C.gris, 'm', 0.85) + nube(-8, -6, 24, 10, C.panza, 'm', 0.9) + nube(20, 0, 30, 5, C.peloHondo, 'm', 0.8) +
      nube(8, -50, 22, 4, C.peloClaro, 's', 0.7) + pelos) +
    enmascarado('m-raton-anca', anca,
      forma(anca, C.pelo) + nube(42, -26, 12, 10, C.peloClaro, 'm', 0.6) + nube(30, -8, 16, 8, C.peloHondo, 'm', 0.8) +
      // La calva del anca, de alguna otra vez que zafó: la piel lila con dos pelos parados.
      nube(46, -22, 5, 4, C.rosa, 's', 0.95) + trazo('M45 -24 l-1 -5 M48 -23 l1 -4', C.tinta, 0.5, 0.8)) +
    trazo('M20 -30 Q40 -38 56 -22', C.peloHondo, 1, 0.6) +
    enmascarado('m-raton-pie', pie, forma(pie, C.rosa) + nube(30, 1, 18, 2, C.narizHonda, 's', 0.3) + nube(24, -3, 10, 1.4, C.rosaClara, 'xs', 0.8)) +
    // Los dedos largos de la pata de atrás, con las uñas.
    [0, 1, 2, 3].map((i) => trazo(`M${14 - i * 0.5} ${-2 + i * 1.2} l-6 ${i * 0.6}`, C.rosa, 1.6) + forma(elipse(7.6 - i * 0.5, -2 + i * 1.8, 0.8, 0.6), C.tinta)).join(''),
  );
}

/** El pelo de punta, del susto: un serrucho de mechones por todo el lomo. */
function erizo(): string {
  // Mechones de largo desparejo, tirados para la cola, por todo el lomo y la nuca.
  const base = LOMO.slice(0, 8);
  const pts: P[] = [base[0]!];
  let k = 0;
  for (let i = 0; i < base.length - 1; i++) {
    const [ax, ay] = base[i]!;
    const [bx, by] = base[i + 1]!;
    const [nx, ny] = [by - ay, -(bx - ax)];
    const l = Math.hypot(nx, ny) || 1;
    for (const f of [0.25, 0.5, 0.75, 1]) {
      const [px, py] = [ax + (bx - ax) * f, ay + (by - ay) * f];
      const largo = 4 + ((k * 7) % 5) * 1.2;
      k++;
      pts.push([px - (nx / l) * 0.6 - 3, py - (ny / l) * 0.6], [px + (nx / l) * largo + 3, py + (ny / l) * largo - 1], [px, py]);
    }
  }
  pts.push([50, -22], [40, -30], [0, -34]);
  const d = poli(pts);
  return conGrano(enmascarado('m-raton-erizo', d, forma(d, C.peloHondo) + nube(14, -58, 44, 6, C.peloClaro, 's', 0.6) + nube(14, -44, 40, 8, C.gris, 'm', 0.9)) +
    pts.filter((_, i) => i % 3 === 2).map(([x, y], i) => trazo(`M${x} ${y} l${2 + (i % 2)} -4`, C.tinta, 0.6, 0.6)).join(''));
}

/** La cola pelada, larga, con los anillos, y una curita en la mitad. Va por arriba del labio y se enrosca al final. */
function cola(): string {
  const [x, y] = A.cola;
  const tramo: readonly P[] = [[x, y], [x + 22, y + 2], [x + 36, y - 6], [x + 48, y - 2]];
  const d = `M${x} ${y} C${tramo[1]![0]} ${tramo[1]![1]} ${tramo[2]![0]} ${tramo[2]![1]} ${tramo[3]![0]} ${tramo[3]![1]} C${x + 60} ${y + 2} ${x + 64} ${y - 14} ${x + 54} ${y - 20} C${x + 46} ${y - 24} ${x + 40} ${y - 16} ${x + 46} ${y - 12}`;
  // Un punto del primer tramo, para los anillos y la curita.
  const en = (t: number): P => {
    const u = 1 - t;
    const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
    return [k.reduce((s, c, i) => s + c * tramo[i]![0], 0), k.reduce((s, c, i) => s + c * tramo[i]![1], 0)];
  };
  const anillos = Array.from({ length: 9 }, (_, i) => {
    const [px, py] = en((i + 1) / 10);
    const g = 3 - i * 0.18;
    return trazo(`M${px} ${py - g} l0.6 ${2 * g}`, C.narizHonda, 0.6, 0.45);
  }).join('');
  const [cx, cy] = en(0.55);
  return conGrano(
    trazo(d, C.peloHondo, 6.4) + trazo(d, C.rosa, 4.6) + trazo(d, C.rosaClara, 1.4, 0.6) + anillos +
    // La curita, cruzada en la cola.
    `<g transform="rotate(-8 ${cx} ${cy})">` + forma(cajaRedonda(cx - 4, cy - 6, 8, 12, 2), C.queso) + forma(cajaRedonda(cx - 3.4, cy - 2.4, 6.8, 4.8, 1), C.cascara) +
    [-1, 1].map((dy) => forma(elipse(cx - 1.5, cy + dy * 4, 0.4, 0.4), C.quesoHondo) + forma(elipse(cx + 1.5, cy + dy * 4, 0.4, 0.4), C.quesoHondo)).join('') + `</g>`,
  );
}

/** Un brazo, del hombro a la mano de cuatro dedos, rosada. */
function brazo(n: 0 | 1): string {
  const [sx, sy] = A.hombros[n];
  const [hx, hy] = A.manos[n];
  const ang = Math.atan2(hy - sy, hx - sx);
  const [nx, ny] = [-Math.sin(ang), Math.cos(ang)];
  const w = n ? 5 : 4.4;
  const d = curva([[sx + nx * w * 1.6, sy + ny * w * 1.6], [(sx + hx) / 2 + nx * w, (sy + hy) / 2 + ny * w], [hx + nx * 2, hy + ny * 2], [hx - nx * 2, hy - ny * 2], [(sx + hx) / 2 - nx * w * 0.8, (sy + hy) / 2 - ny * w * 0.8], [sx - nx * w * 1.6, sy - ny * w * 1.6]]);
  const [ux, uy] = [Math.cos(ang), Math.sin(ang)];
  // Los dedos se abren en abanico desde la muñeca, como una mano de verdad: es lo que lo hace grotesco.
  const dedos = [-0.7, -0.25, 0.2, 0.65].map((a, i) => {
    const [dx, dy] = [ux * Math.cos(a) - uy * Math.sin(a), ux * Math.sin(a) + uy * Math.cos(a)];
    const l = i === 0 || i === 3 ? 4.6 : 6;
    return trazo(`M${hx} ${hy} l${dx * l} ${dy * l}`, n ? C.rosa : C.rosaClara, 1.5) + forma(elipse(hx + dx * (l + 0.6), hy + dy * (l + 0.6), 0.6, 0.6), C.tinta);
  }).join('');
  return conGrano(
    enmascarado(`m-raton-brazo-${n}`, d, forma(d, n ? C.pelo : C.peloHondo) + nube(sx, sy + 2, 6, 6, C.gris, 's', 0.6) + nube((sx + hx) / 2, (sy + hy) / 2, 3, 6, C.peloClaro, 's', 0.5)) +
    forma(elipse(hx, hy, 2.6, 2.2), n ? C.rosa : C.rosaClara) + dedos,
  );
}

/* ------------------------------------------------------------------
   La cabeza: el cráneo con el ojo, la oreja mordida y el hocico que olfatea solo
   ------------------------------------------------------------------ */

const CRANEO: readonly P[] = [[-10, -32], [-14, -44], [-26, -51], [-40, -49], [-50, -42], [-58, -36], [-62, -32], [-60, -26], [-52, -22], [-38, -18], [-22, -18], [-12, -24]];

function craneo(): string {
  const d = curva(CRANEO);
  const [ex, ey] = A.ojo;
  // La oreja de atrás, que asoma detrás de la nuca.
  const atras = curva([[-14, -44], [-8, -56], [2, -58], [4, -48], [-6, -40]]);
  return conGrano(
    enmascarado('m-raton-oreja-atras', atras, forma(atras, C.peloHondo) + nube(-2, -50, 4, 5, C.rosa, 's', 0.8)) +
    enmascarado('m-raton-craneo', d,
      forma(d, C.pelo) +
      nube(-26, -46, 18, 6, C.gris, 'm', 0.9) + nube(-44, -24, 16, 6, C.panza, 'm', 0.9) + nube(-30, -22, 14, 4, C.peloClaro, 's', 0.7) +
      nube(-16, -28, 8, 10, C.peloHondo, 'm', 0.7) +
      // La cuenca del ojo, hundida, y la mejilla de bolsillo.
      nube(ex, ey, 8, 6.4, C.tinta, 's', 0.7) + nube(-48, -30, 6, 5, C.peloClaro, 's', 0.6) +
      // Los puntos de donde salen los bigotes.
      [[-54, -30], [-56, -27], [-52, -26], [-55, -24]].map(([x, y]) => forma(elipse(x!, y!, 0.6, 0.6), C.tinta)).join('')) +
    // El ojo: una cuenta negra que sobresale, con el aro ámbar, el borde irritado y dos brillos.
    forma(elipse(ex, ey, 4.8, 4.4), C.narizHonda) + forma(elipse(ex, ey, 4.2, 3.9), C.tinta) +
    trazo(`M${ex - 2.4} ${ey + 2.6} Q${ex + 1} ${ey + 3.8} ${ex + 3.4} ${ey + 1.4}`, C.ojo, 0.7, 0.8) +
    forma(elipse(ex - 1.4, ey - 1.4, 1.2, 1), C.panza) + forma(elipse(ex + 1.6, ey + 1, 0.5, 0.5), C.panza, 0.8) +
    // El mechón de la coronilla, parado.
    trazo('M-22 -50 l-2 -6 M-26 -50 l-4 -5 M-18 -49 l1 -6', C.gris, 0.9, 0.85),
  );
}

/** La oreja de adelante: grande, finita, con las venas y un mordiscón arriba. */
function oreja(): string {
  const [ox, oy] = A.oreja;
  const [cx, cy] = [ox - 2, oy - 13];
  // La silueta redonda con el mordiscón en V arriba.
  const borde = curva([[ox + 5, oy + 1], [cx + 13, cy + 4], [cx + 11, cy - 7], [cx + 4, cy - 12], [cx + 1, cy - 7], [cx - 2, cy - 13], [cx - 10, cy - 10], [cx - 14, cy], [cx - 9, cy + 9], [ox - 4, oy + 1]]);
  const venas = trazo(`M${ox} ${oy} q-2 -8 -6 -16 M${ox} ${oy} q3 -8 4 -14 M${ox - 3} ${oy - 7} q-4 -2 -7 -3`, C.narizHonda, 0.45, 0.5);
  return conGrano(
    enmascarado('m-raton-oreja', borde,
      forma(borde, C.pelo) + nube(cx, cy + 1, 10, 10, C.rosa, 's', 0.95) + nube(cx - 2, cy - 2, 6, 6, C.rosaClara, 's', 0.8) +
      nube(cx + 3, cy + 2, 4, 4, C.narizHonda, 'xs', 0.25) + venas + nube(cx + 8, cy - 4, 5, 6, C.peloHondo, 's', 0.6)) +
    // La marca de los dientes del gato, en el borde del mordiscón.
    trazo(`M${cx + 4} ${cy - 12} l-3 5 l-3 -6`, C.narizHonda, 0.6, 0.7),
  );
}

/** El párpado, del pelo de la cara: para pestañear y para lavarse la cara. */
function parpado(): string {
  const [ex, ey] = A.ojo;
  return conGrano(enmascarado('m-raton-parpado', elipse(ex, ey, 5.2, 4.8), forma(elipse(ex, ey, 6, 6), C.pelo) + nube(ex, ey - 3, 5, 2, C.peloClaro, 'xs', 0.7)) + trazo(`M${ex - 4.6} ${ey + 1} Q${ex} ${ey + 3.4} ${ex + 4.6} ${ey + 1}`, C.tinta, 0.9));
}

/** El ojo del espanto: el blanco alrededor de una pupila que se achica a nada. */
function espanto(): string {
  const [ex, ey] = A.ojo;
  return conGrano(
    forma(elipse(ex, ey, 5.8, 5.4), C.narizHonda) + forma(elipse(ex, ey, 5.2, 4.9), C.panza) + nube(ex + 1, ey + 2, 4, 2, C.peloClaro, 'xs', 0.7) +
    forma(elipse(ex - 1.2, ey - 0.4, 1.6, 1.8), C.tinta) + forma(elipse(ex - 1.6, ey - 1, 0.5, 0.5), C.panza) +
    trazo(`M${ex - 6} ${ey - 7} L${ex + 3} ${ey - 6}`, C.tinta, 0.9, 0.8),
  );
}

/** El hocico: la trompa larga, la nariz roja de tanto meterla, y la boca. */
function hocico(): string {
  const d = curva([[-50, -36], [-60, -36], [-68, -34], [-73, -30], [-70, -25], [-60, -22], [-50, -24]]);
  const [nx, ny] = A.nariz;
  return conGrano(
    enmascarado('m-raton-hocico', d, forma(d, C.pelo) + nube(-62, -24, 10, 4, C.panza, 's', 0.9) + nube(-56, -35, 8, 3, C.gris, 's', 0.8) +
      // Las arrugas del hocico, que se juntan cuando olfatea.
      trazo('M-56 -36 q-1 4 0 7 M-60 -35 q-1 3 0 6', C.peloHondo, 0.6, 0.7)) +
    forma(elipse(nx, ny, 5.4, 4.6), C.nariz) + nube(nx + 1, ny + 2, 4, 2.4, C.narizHonda, 's', 0.9) + nube(nx - 1.4, ny - 2, 2, 1.2, C.rosaClara, 'xs', 0.95) +
    forma(elipse(nx - 2.6, ny + 1.4, 1, 0.7), C.narizHonda) + forma(elipse(nx - 1.4, ny - 2.2, 0.6, 0.4), C.panza) +
    trazo(`M${nx + 2} ${ny + 4} q-2 3 -6 3 M${nx + 2} ${ny + 4} q2 3 8 2`, C.narizHonda, 0.8, 0.85),
  );
}

/** Los dientes de roer: dos paletas largas, amarillas, de las que se gastan solas. */
function dientes(): string {
  const [dx, dy] = A.dientes;
  return conGrano(
    forma(cajaRedonda(dx - 3.4, dy - 1, 6.8, 9, 1.4), C.diente) + nube(dx + 1, dy + 5, 2, 4, C.quesoHondo, 'xs', 0.6) +
    trazo(`M${dx} ${dy - 1} L${dx} ${dy + 8}`, C.tinta, 0.7) + nube(dx - 1.6, dy + 1, 0.8, 3, C.panza, 'xs', 0.8) +
    trazo(`M${dx - 4} ${dy - 1} Q${dx} ${dy - 2.6} ${dx + 4} ${dy - 1}`, C.nariz, 1.2, 0.9),
  );
}

/** Los bigotes, en dos mazos que trabajan cada uno por su lado. Uno de los de arriba está quebrado. */
function bigotes(n: 0 | 1): string {
  const [bx, by] = A.bigotes;
  const s = n ? 1 : -1;
  const largos = n ? [36, 30, 26] : [40, 34, 28, 22];
  return largos.map((l, i) => {
    const a = (n ? 12 : -10) + s * i * 9;
    const r = (a * Math.PI) / 180;
    const [ex, ey] = [bx - Math.cos(r) * l, by + Math.sin(r) * l];
    const [qx, qy] = [bx - Math.cos(r) * l * 0.5, by + Math.sin(r) * l * 0.5 + s * 3];
    // El quebrado: a los dos tercios dobla para abajo, como una antena vieja.
    const d = !n && i === 1 ? `M${bx} ${by} Q${qx} ${qy} ${bx - Math.cos(r) * l * 0.66} ${by + Math.sin(r) * l * 0.66} l-8 9` : `M${bx} ${by} Q${qx} ${qy} ${ex} ${ey}`;
    // Y los de atrás, más cortos, que se van para el lado de la oreja.
    const atras = `M${bx + 2} ${by} q${10} ${s * 4} ${l * 0.5} ${s * (6 + i * 3)}`;
    return trazo(d, C.tinta, 1.4, 0.35) + trazo(d, C.panza, 0.6, 0.9) + (i < 2 ? trazo(atras, C.panza, 0.5, 0.6) : '');
  }).join('');
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.4;
const [QX, QY] = A.queso;

export const PIEZAS_RATON: readonly Pieza[] = [
  { nombre: 'raton-canaleta', caja: [C0 - 4, -16, C1 - C0 + 8, 82], dibujo: canaleta(), densidad: 2.4 },
  { nombre: 'raton-olor', caja: [-160, -96, 96, 72], dibujo: olor(), densidad: 1.6 },
  { nombre: 'raton-queso', caja: [QX - 24, QY - 26, 46, 30], dibujo: queso(), densidad: D * 1.3 },
  { nombre: 'raton-cola', caja: [A.cola[0] - 4, A.cola[1] - 30, 82, 46], dibujo: cola(), densidad: D },
  { nombre: 'raton-brazo-1', caja: [-34, -32, 34, 40], dibujo: brazo(0), densidad: D * 1.3 },
  { nombre: 'raton-cuerpo', caja: [-30, -58, 92, 64], dibujo: cuerpo(), densidad: D },
  { nombre: 'raton-erizo', caja: [-34, -68, 98, 48], dibujo: erizo(), densidad: D },
  { nombre: 'raton-craneo', caja: [-66, -62, 74, 48], dibujo: craneo(), densidad: D * 1.3 },
  { nombre: 'raton-parpado', caja: [A.ojo[0] - 7, A.ojo[1] - 7, 14, 14], dibujo: parpado(), densidad: D * 2 },
  { nombre: 'raton-espanto', caja: [A.ojo[0] - 8, A.ojo[1] - 10, 16, 18], dibujo: espanto(), densidad: D * 2 },
  { nombre: 'raton-oreja', caja: [A.oreja[0] - 20, A.oreja[1] - 32, 38, 36], dibujo: oreja(), densidad: D * 1.5 },
  { nombre: 'raton-dientes', caja: [A.dientes[0] - 6, A.dientes[1] - 5, 12, 16], dibujo: dientes(), densidad: D * 2 },
  { nombre: 'raton-hocico', caja: [-80, -40, 34, 24], dibujo: hocico(), densidad: D * 1.6 },
  { nombre: 'raton-bigotes-1', caja: [-110, -66, 86, 44], dibujo: bigotes(0), densidad: D * 1.3 },
  { nombre: 'raton-bigotes-2', caja: [-110, -32, 86, 46], dibujo: bigotes(1), densidad: D * 1.3 },
  { nombre: 'raton-brazo-2', caja: [-40, -30, 34, 40], dibujo: brazo(1), densidad: D * 1.3 },
  { nombre: 'raton-labio', caja: [C0 - 8, -22, C1 - C0 + 16, 54], dibujo: labio(), densidad: 2.4 },
];

const img = imagenesDe(PIEZAS_RATON);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/**
 * El ratón armado con las marcas de un momento. Lo que baja del labio de la canaleta no se ve: el recorte
 * va con un nombre propio por cada uso, para que el títere y el retrato no se pisen el id.
 */
function armado(m: Momento, recorte: string): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    `<clipPath id="${recorte}"><rect x="-200" y="-200" width="400" height="${200 + A.labio}"/></clipPath>` +
    img('raton-canaleta') +
    parte('olor', img('raton-olor'), t.olor, o.olor) +
    parte('queso', img('raton-queso'), t.queso) +
    `<g clip-path="url(#${recorte})">` +
    parte('huida',
      parte('pose',
        parte('cola', img('raton-cola'), t.cola) +
        parte('brazo-1', img('raton-brazo-1'), t['brazo-1']) +
        parte('cuerpo', img('raton-cuerpo'), t.cuerpo) +
        parte('erizo', img('raton-erizo'), t.erizo, o.erizo) +
        parte('cabeza',
          img('raton-craneo') +
          parte('parpado', img('raton-parpado'), '', o.parpado) +
          parte('espanto', img('raton-espanto'), '', o.espanto) +
          parte('oreja', img('raton-oreja'), t.oreja) +
          parte('hocico',
            parte('dientes', img('raton-dientes'), '', o.dientes) +
            img('raton-hocico') +
            parte('bigotes-1', img('raton-bigotes-1'), t['bigotes-1']) +
            parte('bigotes-2', img('raton-bigotes-2'), t['bigotes-2']),
            t.hocico),
          t.cabeza) +
        parte('brazo-2', img('raton-brazo-2'), t['brazo-2']),
        t.pose),
      t.huida) +
    `</g>` +
    img('raton-labio')
  );
}

/** El ratón en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function ratonEn(m: Momento = QUIETO, recorte = 'raton-canaleta-mirar'): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m, recorte)}</g>`;
}

/** El títere que se toca, en la pose quieta: en cuatro patas en la canaleta, con el hocico al gato. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--raton" data-id="el-raton" role="button" tabindex="0" aria-label="${nombres.get('el-raton') ?? 'El ratón'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO, 'raton-canaleta-recorte')}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: parado en la canaleta, oliendo al gato, con el pelo de punta. */
export const RETRATO = { caja: [RATON.x - 76, RATON.piso - 64, 140, 92] as const };
function retrato(): string {
  return `<image href="/bestiario/baldio-lejos.webp" x="0" y="0" width="1500" height="640" preserveAspectRatio="none"/>` +
    // La chapa, en su caja de `arte-baldio.ts`: del canto de arriba al de abajo.
    `<image href="/bestiario/baldio-chapa.webp" x="0" y="284" width="1500" height="42" preserveAspectRatio="none"/>` + ratonEn(HUELE, 'raton-canaleta-retrato');
}

export const RATON_PERSONAJE: Personaje = {
  id: 'el-raton',
  region: 'los-techos',
  ancla: RATON.x,
  piezas: PIEZAS_RATON,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
