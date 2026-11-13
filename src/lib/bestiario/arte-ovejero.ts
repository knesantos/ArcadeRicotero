/**
 * El ovejero (`D-73`, vigesimosexta vuelta), echado en un manto negro en el borde de la pastura.
 *
 * *"Tu perro un perro cruel, con la costumbre de / No contentarse con los restos. / Ovejero que descansa en manto
 * negro!"* es de *Vencedores vencidos*, en *Un baión para el ojo idiota* (1988). Se toma al pie de la letra: un
 * ovejero alemán grande, de lomo negro y patas canela, echado sobre un manto negro en el borde del claro, de
 * donde ve al cordero sin moverse. Adelante tiene el plato de lata con los restos —dos huesos pelados y una
 * costilla— que no tocó: no se conforma con las sobras. Lo que quiere está atado a un palo, ahí nomás. Tiene el
 * collar de púas con la chapa, y enganchado en el collar, un vellón de lana de alguna vez. Cuando lo tocan se para,
 * se le eriza el lomo, muestra los dientes, ladra sin ruido tres veces, patea el plato, y se vuelve a echar con el
 * ojo en el cordero.
 *
 * De la letra son el ovejero, el manto negro, lo cruel y los restos. Del dibujo son el collar, el vellón, el plato
 * de lata y la patada.
 *
 * Viste *Un baión*, medido con sharp: el manto es la noche rayada a pluma del frente y el azul de la contratapa,
 * el lomo es la tinta, el pelo canela y los ojos son el fuego de la contratapa, las fauces la boca del perro rojo
 * del frente, el collar el rosa de la muñeca, los dientes y los huesos el estallido blanco, y el plato de lata, los
 * azules claros del rayado.
 *
 * Coordenadas: el (0, 0) es el piso debajo del medio de la panza, parado, y mira a la derecha (`rig-ovejero.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { CAIDA, CRUEL, OVEJERO, OVEJERO_ARMADO as A, QUIETO, marcas, type Momento } from './rig-ovejero.ts';

const ID = 'el-ovejero';

/** Las tintas de *Un baión* (`tokens.css`). */
const C = {
  azul: 'var(--bestia-ovejero-azul)',
  azulHondo: 'var(--bestia-ovejero-azul-hondo)',
  noche: 'var(--bestia-ovejero-noche)',
  violeta: 'var(--bestia-ovejero-violeta)',
  tinta: 'var(--bestia-ovejero-tinta)',
  amarillo: 'var(--bestia-ovejero-amarillo)',
  naranja: 'var(--bestia-ovejero-naranja)',
  naranjaHondo: 'var(--bestia-ovejero-naranja-hondo)',
  fuego: 'var(--bestia-ovejero-fuego)',
  rojo: 'var(--bestia-ovejero-rojo)',
  rojoHondo: 'var(--bestia-ovejero-rojo-hondo)',
  rosa: 'var(--bestia-ovejero-rosa)',
  rosaClara: 'var(--bestia-ovejero-rosa-clara)',
  blanco: 'var(--bestia-ovejero-blanco)',
  hueso: 'var(--bestia-ovejero-hueso)',
  morado: 'var(--bestia-ovejero-morado)',
  gris: 'var(--bestia-ovejero-gris)',
  grisClaro: 'var(--bestia-ovejero-gris-claro)',
};

/** Un azar con semilla, para que el rayado a pluma caiga siempre igual. */
function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Un mechón de pelo: un trazo corto que sale del borde. */
const mechon = (x: number, y: number, dx: number, dy: number, tinta: string, o = 0.7): string => trazo(`M${f(x)} ${f(y)} l${f(dx)} ${f(dy)}`, tinta, 1.1, o);

/* ------------------------------------------------------------------
   El manto negro y el plato con los restos
   ------------------------------------------------------------------ */

/** El manto: una frazada negra tirada en el pasto, con el rayado a pluma de la tapa, los pliegues y un mordisco. */
function manto(): string {
  const d = curva([[-150, 8], [-100, -18], [0, -26], [110, -22], [190, -4], [200, 18], [150, 34], [40, 38], [-80, 36], [-160, 28]]);
  const rnd = azar(43);
  let rayado = '';
  for (let i = 0; i < 90; i++) {
    const x = -160 + rnd() * 360;
    const y = -22 + rnd() * 58;
    const l = 6 + rnd() * 14;
    rayado += trazo(`M${f(x)} ${f(y)} l${f(l)} ${f(-l * 0.18 + rnd() * 2)}`, i % 3 ? C.azul : C.violeta, 0.7, 0.35 + rnd() * 0.3);
  }
  return conGrano(
    enmascarado('m-ovejero-manto', d,
      forma(d, C.tinta) + nube(0, 6, 150, 20, C.noche, 'l', 0.8) + nube(-90, 20, 40, 10, C.azulHondo, 'm', 0.6) + nube(120, 10, 40, 10, C.azulHondo, 'm', 0.5) + rayado +
      // Los pliegues, con la luz del farol del claro.
      trazo('M-120 -6 q30 10 70 4 M20 30 q40 -8 90 -2', C.azul, 1.4, 0.45) + trazo('M-60 -14 q20 6 50 2', C.azulHondo, 2, 0.6)) +
    // El ruedo con el fleco, y el mordisco de la punta.
    trazo('M-150 8 q-6 10 -10 20 M-140 24 l-6 10 M190 -4 l10 8', C.azulHondo, 1.4, 0.8) +
    forma(poli([[188, -6], [196, -14], [200, -4]]), C.naranjaHondo, 0.35),
  );
}

/** El plato de lata con los restos que no tocó: dos huesos pelados y una costilla, y una mosca que se los mira. */
function plato(): string {
  const [px, py] = A.plato;
  const lata = `M${px - 34} ${py - 6} L${px - 26} ${py - 20} L${px + 26} ${py - 20} L${px + 34} ${py - 6} Q${px} ${py + 8} ${px - 34} ${py - 6} Z`;
  return conGrano(
    enmascarado('m-ovejero-plato', lata, forma(lata, C.gris) + nube(px, py - 2, 30, 6, C.violeta, 's', 0.7) + nube(px - 10, py - 16, 14, 3, C.grisClaro, 's', 0.8) + nube(px + 20, py - 10, 6, 6, C.azulHondo, 's', 0.6)) +
    trazo(`M${px - 26} ${py - 20} L${px + 26} ${py - 20}`, C.grisClaro, 1.6, 0.9) + trazo(`M${px - 30} ${py - 12} L${px + 30} ${py - 12}`, C.azulHondo, 0.8, 0.5),
  );
}

/** Los restos: dos huesos pelados y una costilla, que salen volando cuando patea el plato. */
function huesos(): string {
  const [px, py] = A.plato;
  const hueso = (x: number, y: number, l: number, giro: number): string =>
    `<g transform="rotate(${giro} ${f(x)} ${f(y)})">${forma(cajaRedonda(x - l / 2, y - 2.4, l, 4.8, 2), C.hueso)}${forma(elipse(x - l / 2, y - 2.2, 3.4, 2.6), C.hueso)}${forma(elipse(x - l / 2, y + 2.2, 3.4, 2.6), C.hueso)}${forma(elipse(x + l / 2, y - 2.2, 3.4, 2.6), C.hueso)}${forma(elipse(x + l / 2, y + 2.2, 3.4, 2.6), C.hueso)}${nube(x, y + 1, l * 0.3, 1.2, C.gris, 'xs', 0.5)}</g>`;
  const costilla = `<path d="M${px - 4} ${py - 22} q14 -6 24 4" fill="none" stroke="${C.hueso}" stroke-width="4" stroke-linecap="round"/><path d="M${px - 4} ${py - 22} q14 -6 24 4" fill="none" stroke="${C.gris}" stroke-width="1" stroke-linecap="round" opacity="0.5"/>`;
  return conGrano(hueso(px - 10, py - 12, 24, -12) + hueso(px + 8, py - 9, 20, 8) + costilla);
}

/* ------------------------------------------------------------------
   El perro: la cola, las patas, el cuerpo con el collar, el erizo, la cabeza
   ------------------------------------------------------------------ */

/** La cola, larga y peluda, caída de ovejero. */
function cola(): string {
  const [kx, ky] = A.cola;
  const d = curva([[kx, ky - 8], [kx - 16, ky - 2], [kx - 32, ky + 16], [kx - 44, ky + 40], [kx - 40, ky + 60], [kx - 30, ky + 62], [kx - 22, ky + 44], [kx - 14, ky + 18], [kx + 2, ky + 6]]);
  const rnd = azar(61);
  let pelos = '';
  for (let i = 0; i < 12; i++) pelos += mechon(kx - 44 + rnd() * 30, ky + 10 + rnd() * 50, -5, 3 + rnd() * 3, i % 2 ? C.tinta : C.naranjaHondo);
  return conGrano(enmascarado('m-ovejero-cola', d, forma(d, C.tinta) + nube(kx - 28, ky + 40, 10, 20, C.naranjaHondo, 'm', 0.5) + nube(kx - 10, ky + 8, 8, 8, C.morado, 's', 0.4)) + pelos);
}

/** Una pata de atrás: el muslo musculoso, el corvejón y el pie con las uñas. `n` 1 es la de cerca. */
function pataTras(n: 0 | 1): string {
  const [cx, cy] = A.caderas[n];
  const d = curva([[cx - 22, cy - 10], [cx + 14, cy - 8], [cx + 12, cy + 28], [cx - 2, cy + 50], [cx + 2, cy + 74], [cx + 16, cy + 84], [cx - 10, cy + 86], [cx - 18, cy + 60], [cx - 20, cy + 30]]);
  const pie = curva([[cx - 12, cy + 80], [cx + 20, cy + 80], [cx + 26, cy + 86], [cx - 14, cy + 86]]);
  return conGrano(
    enmascarado(`m-ovejero-tras-${n}`, d, forma(d, n ? C.naranja : C.naranjaHondo) + nube(cx - 6, cy + 4, 16, 14, C.tinta, 'm', 0.85) + nube(cx, cy + 40, 6, 20, n ? C.naranjaHondo : C.morado, 'm', 0.6) + nube(cx + 6, cy + 8, 6, 8, C.amarillo, 's', n ? 0.35 : 0.15)) +
    enmascarado(`m-ovejero-pie-tras-${n}`, pie, forma(pie, n ? C.naranja : C.naranjaHondo) + nube(cx + 6, cy + 85, 16, 2, C.morado, 's', 0.6)) +
    [-4, 4, 12, 20].map((x) => trazo(`M${cx + x} ${cy + 86} l-1 4`, C.tinta, 1.6, 0.9)).join(''),
  );
}

/** Una pata de adelante: recta, canela, con el pie grande. */
function pataDel(n: 0 | 1): string {
  const [hx, hy] = A.hombros[n];
  const d = curva([[hx - 14, hy - 8], [hx + 14, hy - 8], [hx + 12, hy + 40], [hx + 10, hy + 78], [hx + 20, hy + 86], [hx - 12, hy + 86], [hx - 10, hy + 40]]);
  return conGrano(
    enmascarado(`m-ovejero-del-${n}`, d, forma(d, n ? C.naranja : C.naranjaHondo) + nube(hx, hy, 14, 12, C.tinta, 'm', 0.7) + nube(hx + 4, hy + 50, 5, 26, n ? C.naranjaHondo : C.morado, 'm', 0.6) + nube(hx + 6, hy + 84, 12, 2, C.morado, 's', 0.6)) +
    [-6, 2, 10, 18].map((x) => trazo(`M${hx + x} ${hy + 86} l-1 4`, C.tinta, 1.6, 0.9)).join(''),
  );
}

const CUERPO: readonly P[] = [[-84, -112], [-50, -132], [0, -136], [40, -132], [66, -120], [70, -96], [60, -72], [20, -60], [-30, -62], [-70, -70], [-86, -90]];

function cuerpo(): string {
  const d = curva(CUERPO);
  const rnd = azar(79);
  let pelos = '';
  for (let i = 0; i < 24; i++) pelos += mechon(-80 + rnd() * 140, -134 + rnd() * 10, -3 + rnd() * 2, -6 - rnd() * 5, i % 3 ? C.tinta : C.naranjaHondo);
  // El collar de púas con la chapa, en el cogote, y el vellón de lana enganchado.
  const [nx, ny] = A.cuello;
  const collar = `M${nx - 14} ${ny - 18} Q${nx + 2} ${ny - 4} ${nx + 4} ${ny + 14}`;
  return conGrano(
    enmascarado('m-ovejero-cuerpo', d,
      forma(d, C.tinta) + nube(-10, -70, 60, 16, C.naranja, 'l', 0.9) + nube(40, -90, 20, 24, C.naranjaHondo, 'm', 0.7) + nube(-20, -126, 50, 8, C.morado, 'm', 0.35) +
      // Las costillas del flanco, apenas, y la luz del farol del claro en el lomo.
      trazo('M-40 -100 q-3 10 0 20 M-26 -104 q-3 10 0 22 M-12 -106 q-3 10 0 22', C.morado, 1.4, 0.3) + nube(10, -130, 30, 4, C.azul, 's', 0.25)) +
    pelos +
    trazo(collar, C.rosa, 8) + trazo(collar, C.morado, 2, 0.6) +
    [[nx - 10, ny - 14], [nx - 3, ny - 6], [nx + 2, ny + 4]].map(([x, y]) => forma(poli([[x! - 2, y!], [x! + 2, y!], [x!, y! - 5]]), C.grisClaro)).join('') +
    forma(elipse(nx + 4, ny + 20, 5, 6), C.grisClaro) + trazo(`M${nx + 2} ${ny + 18} l4 4`, C.gris, 1) +
    nube(nx - 6, ny + 2, 7, 5, C.rosaClara, 's', 0.95) + trazo(`M${nx - 12} ${ny} q4 -4 8 0 q4 3 8 -1`, C.blanco, 1, 0.6),
  );
}

/** El pelo erizado del lomo: la cresta de mechones que se le para cuando se enoja. */
function erizo(): string {
  const base = CUERPO.slice(0, 5);
  const pts: P[] = [base[0]!];
  for (let i = 0; i < base.length - 1; i++) {
    const [ax, ay] = base[i]!;
    const [bx, by] = base[i + 1]!;
    for (const t of [0.2, 0.4, 0.6, 0.8, 1]) {
      const x = ax + (bx - ax) * t;
      const y = ay + (by - ay) * t;
      pts.push([x - 4, y - 2], [x + 2, y - 16 - ((i * 7 + t * 10) % 5) * 2], [x + 6, y - 1]);
    }
  }
  pts.push([70, -118], [0, -120], [-84, -100]);
  const d = poli(pts);
  return conGrano(enmascarado('m-ovejero-erizo', d, forma(d, C.tinta) + nube(-10, -140, 50, 6, C.morado, 's', 0.5)) + pts.filter((_, i) => i % 3 === 2).map(([x, y]) => trazo(`M${f(x)} ${f(y)} l2 -5`, C.naranjaHondo, 0.8, 0.6)).join(''));
}

const CABEZA: readonly P[] = [[56, -100], [50, -126], [60, -150], [84, -162], [108, -158], [124, -146], [138, -128], [142, -116], [128, -110], [108, -104], [84, -100]];

function cabeza(): string {
  const d = curva(CABEZA);
  const { centro: [ex, ey], radio: [rx, ry] } = A.ojo;
  const [hx, hy] = A.hocico;
  const rnd = azar(89);
  let pelos = '';
  for (let i = 0; i < 10; i++) pelos += mechon(60 + rnd() * 50, -160 + rnd() * 8, -2 + rnd() * 2, -5 - rnd() * 4, i % 2 ? C.tinta : C.naranjaHondo);
  return conGrano(
    enmascarado('m-ovejero-cabeza', d,
      forma(d, C.naranja) + nube(84, -146, 30, 14, C.tinta, 'm', 0.9) + nube(120, -124, 20, 8, C.naranjaHondo, 'm', 0.7) + nube(70, -110, 16, 10, C.naranjaHondo, 'm', 0.7) +
      // El antifaz negro de ovejero, y la ceja canela.
      nube(ex - 4, ey - 2, 22, 12, C.tinta, 'm', 0.85) + nube(ex - 2, ey - 12, 8, 3, C.naranja, 's', 0.9)) +
    pelos +
    // El ojo: amarillo de fuego, con la pupila que mira al cordero y el brillo.
    forma(elipse(ex, ey, rx + 1.2, ry + 1.2), C.tinta) + forma(elipse(ex, ey, rx, ry), C.amarillo) + nube(ex + 2, ey + 2, 3, 2, C.naranjaHondo, 'xs', 0.6) +
    // El hocico: la trompa, la nariz negra, el labio de arriba y los bigotes.
    nube(hx - 10, hy + 2, 12, 6, C.naranjaHondo, 's', 0.6) + forma(elipse(hx, hy - 2, 6, 5), C.tinta) + nube(hx - 1, hy - 4, 2.4, 1.2, C.blanco, 'xs', 0.6) +
    trazo(`M${hx + 2} ${hy + 3} q-10 6 -24 2`, C.tinta, 1.6, 0.8) +
    trazo(`M${hx - 2} ${hy + 4} l-18 8 M${hx - 2} ${hy + 2} l-20 2 M${hx - 2} ${hy + 6} l-16 12`, C.blanco, 0.6, 0.45) +
    // Los colmillos de arriba, que asoman del belfo.
    forma(poli([[122, -108], [125, -100], [128, -108]]), C.blanco) + forma(poli([[104, -104], [107, -98], [110, -104]]), C.blanco),
  );
}

/** La quijada de abajo: la papada, el labio y los dientes de abajo. */
function quijada(): string {
  const [qx, qy] = A.quijada;
  const d = curva([[qx - 6, qy], [qx + 10, qy - 2], [qx + 30, qy - 4], [qx + 44, qy - 2], [qx + 42, qy + 6], [qx + 20, qy + 12], [qx - 4, qy + 10]]);
  return conGrano(
    enmascarado('m-ovejero-quijada', d, forma(d, C.rojoHondo) + nube(qx + 24, qy + 4, 14, 4, C.rojo, 's', 0.8)) +
    trazo(`M${qx - 4} ${qy + 10} Q${qx + 20} ${qy + 16} ${qx + 42} ${qy + 6}`, C.naranjaHondo, 4, 0.95) +
    forma(poli([[qx + 36, qy - 1], [qx + 38, qy - 7], [qx + 40, qy - 1]]), C.blanco) + forma(poli([[qx + 16, qy - 2], [qx + 18, qy - 7], [qx + 20, qy - 2]]), C.blanco),
  );
}

/** La lengua, que sale a lamerse los belfos. */
function lengua(): string {
  const [hx, hy] = A.hocico;
  const d = curva([[hx - 16, hy + 6], [hx - 4, hy + 4], [hx + 6, hy + 10], [hx + 4, hy + 18], [hx - 8, hy + 16], [hx - 16, hy + 12]]);
  return conGrano(enmascarado('m-ovejero-lengua', d, forma(d, C.fuego) + nube(hx - 2, hy + 10, 6, 3, C.rosaClara, 'xs', 0.6) + trazo(`M${hx - 12} ${hy + 8} q8 2 14 8`, C.rojo, 1, 0.6)));
}

/** El belfo levantado: el labio arrugado y la hilera de dientes de arriba, del gruñido. */
function belfo(): string {
  const d = curva([[96, -116], [112, -118], [130, -116], [140, -110], [136, -102], [120, -100], [100, -102], [92, -108]]);
  return conGrano(
    enmascarado('m-ovejero-belfo', d, forma(d, C.naranjaHondo) + nube(118, -108, 20, 6, C.rojoHondo, 's', 0.9) + trazo('M100 -114 q6 -4 10 0 M112 -116 q6 -4 10 0', C.tinta, 1.2, 0.7)) +
    [[98, 4], [106, 6], [114, 7], [122, 6], [130, 5]].map(([x, h]) => forma(poli([[x! - 2.5, -108], [x!, -108 + h!], [x! + 2.5, -108]]), C.blanco)).join('') +
    forma(poli([[124, -110], [127, -99], [131, -110]]), C.blanco),
  );
}

/** Una oreja parada de ovejero, grande, con el adentro canela. */
function oreja(n: 0 | 1): string {
  const [ox, oy] = A.orejas[n];
  const d = curva([[ox - 10, oy + 2], [ox - 12, oy - 16], [ox - 4, oy - 34], [ox + 4, oy - 36], [ox + 12, oy - 18], [ox + 10, oy + 2]]);
  return conGrano(
    enmascarado(`m-ovejero-oreja-${n}`, d, forma(d, C.tinta) + nube(ox, oy - 14, 5, 14, n ? C.naranja : C.naranjaHondo, 's', 0.8) + nube(ox - 6, oy - 24, 3, 6, C.rosa, 's', 0.3)) +
    mechon(ox - 10, oy - 10, -4, -2, C.naranjaHondo) + mechon(ox + 10, oy - 12, 4, -2, C.tinta),
  );
}

function parpado(): string {
  const { centro: [ex, ey], radio: [rx, ry] } = A.ojo;
  return conGrano(forma(elipse(ex, ey, rx + 2.4, ry + 2.4), C.tinta) + trazo(`M${ex - rx - 1} ${ey + 1} Q${ex} ${ey + ry + 2} ${ex + rx + 1} ${ey + 1}`, C.naranjaHondo, 1));
}

function pupila(): string {
  const { centro: [ex, ey] } = A.ojo;
  return forma(elipse(ex, ey, 3.4, 3.6), C.tinta) + forma(elipse(ex + 1.2, ey - 1.4, 1.1, 1.1), C.blanco);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;
const O = A.ojo.centro;

export const PIEZAS_OVEJERO: readonly Pieza[] = [
  { nombre: 'ovejero-manto', caja: [-166, -30, 372, 72], dibujo: manto(), densidad: 1.5 },
  { nombre: 'ovejero-plato', caja: [A.plato[0] - 38, A.plato[1] - 24, 76, 36], dibujo: plato(), densidad: D },
  { nombre: 'ovejero-huesos', caja: [A.plato[0] - 30, A.plato[1] - 30, 60, 30], dibujo: huesos(), densidad: D },
  { nombre: 'ovejero-cola', caja: [A.cola[0] - 50, A.cola[1] - 12, 58, 80], dibujo: cola(), densidad: D },
  { nombre: 'ovejero-pata-tras-1', caja: [A.caderas[0][0] - 26, A.caderas[0][1] - 14, 56, 108], dibujo: pataTras(0), densidad: D },
  { nombre: 'ovejero-pata-del-1', caja: [A.hombros[0][0] - 18, A.hombros[0][1] - 12, 42, 106], dibujo: pataDel(0), densidad: D },
  { nombre: 'ovejero-cuerpo', caja: [-92, -142, 168, 90], dibujo: cuerpo(), densidad: D },
  { nombre: 'ovejero-erizo', caja: [-92, -160, 168, 72], dibujo: erizo(), densidad: D },
  { nombre: 'ovejero-pata-tras-2', caja: [A.caderas[1][0] - 26, A.caderas[1][1] - 14, 56, 108], dibujo: pataTras(1), densidad: D },
  { nombre: 'ovejero-cabeza', caja: [46, -170, 102, 76], dibujo: cabeza(), densidad: D * 1.4 },
  { nombre: 'ovejero-quijada', caja: [A.quijada[0] - 10, A.quijada[1] - 10, 60, 26], dibujo: quijada(), densidad: D * 1.6 },
  { nombre: 'ovejero-lengua', caja: [A.hocico[0] - 20, A.hocico[1], 32, 22], dibujo: lengua(), densidad: D * 1.6 },
  { nombre: 'ovejero-belfo', caja: [88, -122, 58, 26], dibujo: belfo(), densidad: D * 1.6 },
  { nombre: 'ovejero-parpado', caja: [O[0] - 12, O[1] - 11, 24, 22], dibujo: parpado(), densidad: D * 2 },
  { nombre: 'ovejero-pupila', caja: [O[0] - 6, O[1] - 6, 12, 12], dibujo: pupila(), densidad: D * 2.4 },
  { nombre: 'ovejero-oreja-1', caja: [A.orejas[0][0] - 16, A.orejas[0][1] - 40, 32, 46], dibujo: oreja(0), densidad: D * 1.4 },
  { nombre: 'ovejero-oreja-2', caja: [A.orejas[1][0] - 16, A.orejas[1][1] - 40, 32, 46], dibujo: oreja(1), densidad: D * 1.4 },
  { nombre: 'ovejero-pata-del-2', caja: [A.hombros[1][0] - 18, A.hombros[1][1] - 12, 42, 106], dibujo: pataDel(1), densidad: D },
];

const img = imagenesDe(PIEZAS_OVEJERO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El perro armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    img('ovejero-manto') +
    parte('plato', img('ovejero-plato'), t.plato) +
    parte('huesos', img('ovejero-huesos'), t.huesos, o.huesos) +
    parte('cuerpo',
      parte('cola', img('ovejero-cola'), t.cola) +
      parte('pata-tras-1', img('ovejero-pata-tras-1'), t['pata-tras-1']) +
      parte('pata-del-1', img('ovejero-pata-del-1'), t['pata-del-1']) +
      parte('erizo', img('ovejero-erizo'), '', o.erizo) +
      img('ovejero-cuerpo') +
      parte('pata-tras-2', img('ovejero-pata-tras-2'), t['pata-tras-2']) +
      parte('cabeza',
        parte('oreja-1', img('ovejero-oreja-1'), t['oreja-1']) +
        parte('quijada', img('ovejero-quijada'), t.quijada) +
        parte('lengua', img('ovejero-lengua'), t.lengua, o.lengua) +
        img('ovejero-cabeza') +
        parte('belfo', img('ovejero-belfo'), '', o.belfo) +
        parte('pupila', img('ovejero-pupila'), t.pupila) +
        parte('parpado', img('ovejero-parpado'), t.parpado) +
        parte('oreja-2', img('ovejero-oreja-2'), t['oreja-2']),
        t.cabeza) +
      parte('pata-del-2', img('ovejero-pata-del-2'), t['pata-del-2']),
      t.cuerpo)
  );
}

/** El perro en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function ovejeroEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: echado en el manto, con el ojo en el cordero. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--ovejero" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El ovejero'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: parado sobre el manto, erizado, gruñendo, con el plato pateado. */
export const RETRATO = { caja: [OVEJERO.x - 90, OVEJERO.piso - 92, 200, 112] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/monte-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/monte-cerca.webp" x="0" y="240" width="900" height="400" preserveAspectRatio="none"/>` +
    ovejeroEn(CRUEL)
  );
}

export const OVEJERO_PERSONAJE: Personaje = {
  id: ID,
  region: 'la-pastura',
  ancla: OVEJERO.x,
  piezas: PIEZAS_OVEJERO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};

/** Lo que baja echado, para el test. */
export { CAIDA };
