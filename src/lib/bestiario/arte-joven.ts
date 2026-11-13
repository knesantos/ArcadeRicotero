/**
 * El joven lobo (`D-73`, vigesimosexta vuelta), en la cima del volcán que cierra el monte.
 *
 * *"Y el joven lobo quemándose de amor. / Está en la cima del volcán"* es de *La parabellum del buen psicópata*,
 * en *Lobo suelto* (1993). Se toma al pie de la letra las dos cosas: está sentado en el borde del cráter de un
 * volcán chico, con la lava abajo que le prende la panza de rojo, y se está quemando. No de afuera: de adentro.
 * En el pecho, entre las costillas, tiene una brasa que late y que se le ve a través del pelo; del lomo le
 * salen llamas cortas, como a un leño; la punta de la cola humea. Es flaco y joven: las patas largas, el pelo
 * de cachorro, las orejas demasiado grandes, y el aro azul en el ojo que tienen los lobos de la tapa.
 *
 * De la letra son el volcán, el fuego de adentro y el aullido (es el lobo de un psicópata enamorado). Del
 * dibujo son las llamas del lomo, el humo de la cola, la pata que se rasca donde le arde, y el humo con forma
 * de corazón que le sube del aullido cuando alguien lo toca.
 *
 * Viste *Lobo suelto*, medido con sharp: el pelo es el sepia soplado de la bestia de la tapa, de la crema de la
 * luz al pardo de la sombra; el aro del ojo, el azul del ojo de la tapa; la roca, el gris del fondo; la lava, la
 * brasa y las llamas, el teléfono rojo del interior; y el vaho del aullido, el aerógrafo blanco de las manos.
 *
 * Coordenadas: el (0, 0) es el borde del cráter debajo del ojo, y mira a la izquierda (`rig-joven.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { ARDE, JOVEN, JOVEN_ARMADO as A, QUIETO, marcas, type Momento } from './rig-joven.ts';

/** Las tintas de *Lobo suelto* (`tokens.css`). */
const C = {
  crema: 'var(--bestia-joven-crema)',
  cremaClara: 'var(--bestia-joven-crema-clara)',
  sepia: 'var(--bestia-joven-sepia)',
  sepiaHonda: 'var(--bestia-joven-sepia-honda)',
  pardo: 'var(--bestia-joven-pardo)',
  tinta: 'var(--bestia-joven-tinta)',
  gris: 'var(--bestia-joven-gris)',
  grisClaro: 'var(--bestia-joven-gris-claro)',
  azul: 'var(--bestia-joven-azul)',
  azulClaro: 'var(--bestia-joven-azul-claro)',
  noche: 'var(--bestia-joven-noche)',
  rojo: 'var(--bestia-joven-rojo)',
  rojoHondo: 'var(--bestia-joven-rojo-hondo)',
  naranja: 'var(--bestia-joven-naranja)',
  llama: 'var(--bestia-joven-llama)',
  papel: 'var(--bestia-joven-papel)',
  granate: 'var(--bestia-joven-granate)',
};

/** Un azar con semilla, para que las chispas y las grietas caigan siempre en el mismo lugar. */
function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Un mechón de pelo de cachorro: un trazo corto que sale del borde, de la tinta que se le pase. */
const mechon = (x: number, y: number, dx: number, dy: number, tinta: string, o = 0.6): string => trazo(`M${f(x)} ${f(y)} l${f(dx)} ${f(dy)}`, tinta, 0.9, o);

/* ------------------------------------------------------------------
   El volcán: el cono, el cráter, la lava, el humo y las chispas
   ------------------------------------------------------------------ */

const CONO: readonly P[] = [[-70, -2], [-30, -8], [60, -10], [100, -2], [104, 40], [106, 150], [-220, 150], [-176, 70], [-130, 30]];

function volcan(): string {
  const d = curva(CONO);
  const rnd = azar(31);
  // Las grietas por donde asoma la lava, bajando por la ladera.
  let grietas = '';
  for (let i = 0; i < 7; i++) {
    const x = -150 + rnd() * 320;
    const y0 = 10 + rnd() * 30;
    const l = 30 + rnd() * 70;
    grietas += trazo(`M${f(x)} ${f(y0)} q${f(-8 + rnd() * 16)} ${f(l * 0.4)} ${f(-6 + rnd() * 12)} ${f(l)}`, C.rojoHondo, 2.6, 0.9) + trazo(`M${f(x)} ${f(y0)} q${f(-8 + rnd() * 16)} ${f(l * 0.4)} ${f(-6 + rnd() * 12)} ${f(l)}`, C.naranja, 1, 0.8);
  }
  // Las piedras sueltas de la ladera.
  let piedras = '';
  for (let i = 0; i < 12; i++) {
    const x = -200 + rnd() * 420;
    const y = 40 + rnd() * 100;
    piedras += nube(x, y, 5 + rnd() * 9, 3 + rnd() * 5, C.grisClaro, 's', 0.5) + nube(x + 3, y + 3, 5 + rnd() * 9, 3 + rnd() * 4, C.tinta, 's', 0.6);
  }
  return conGrano(
    enmascarado('m-joven-cono', d,
      forma(d, C.gris) + nube(-40, 120, 170, 60, C.tinta, 'l', 0.9) + nube(160, 120, 90, 50, C.tinta, 'l', 0.8) +
      // La luz de la lava que sube por la ladera, y el borde del cráter prendido.
      nube(40, 10, 120, 24, C.rojoHondo, 'l', 0.8) + nube(30, -4, 90, 10, C.naranja, 'm', 0.7) + nube(-20, 30, 50, 14, C.grisClaro, 'm', 0.5) +
      grietas + piedras) +
    // El labio de adelante del cráter, con las costras.
    trazo('M-66 -2 Q-20 -14 60 -12 Q120 -10 134 -2', C.grisClaro, 3, 0.8) + trazo('M-50 -4 Q0 -10 40 -9', C.rojoHondo, 1.2, 0.7),
  );
}

/** La lava del cráter, detrás del lobo: un charco al rojo con la costra negra flotando. */
function lava(): string {
  const [vx, vy] = A.crater;
  return nube(vx, vy, 90, 14, C.rojo, 'm', 0.95) + nube(vx + 10, vy - 2, 50, 7, C.naranja, 's', 0.9) + nube(vx - 20, vy - 3, 16, 3, C.llama, 'xs', 0.9) +
    nube(vx + 40, vy, 14, 4, C.tinta, 's', 0.7) + nube(vx - 50, vy + 2, 12, 3, C.tinta, 's', 0.6);
}

/** El humo del cráter: una nube que sube y se abre. */
function humo(): string {
  const [vx, vy] = A.crater;
  return nube(vx, vy - 20, 44, 22, C.noche, 'l', 0.8) + nube(vx + 16, vy - 36, 26, 16, C.noche, 'm', 0.7) + nube(vx - 20, vy - 30, 20, 12, C.gris, 'm', 0.5);
}

/** Las chispas de la erupción: puntos de fuego que salen del cráter. */
function chispas(): string {
  const [vx, vy] = A.crater;
  const rnd = azar(57);
  let s = '';
  for (let i = 0; i < 26; i++) {
    const x = vx - 70 + rnd() * 140;
    const y = vy - 10 - rnd() * 90;
    const r = 0.7 + rnd() * 1.3;
    s += forma(elipse(x, y, r, r), i % 3 ? C.llama : C.naranja, 0.9) + trazo(`M${f(x)} ${f(y + r)} l${f(-1 + rnd() * 2)} ${f(5 + rnd() * 9)}`, C.rojo, 0.6, 0.45);
  }
  return s;
}

/* ------------------------------------------------------------------
   El lobo: el anca, la cola, el cuerpo con la brasa y las llamas, las patas, la cabeza
   ------------------------------------------------------------------ */

const ANCA: readonly P[] = [[30, -58], [66, -66], [96, -50], [104, -22], [92, 0], [50, 0], [22, -10], [18, -36]];

function anca(): string {
  const d = curva(ANCA);
  // La pata de atrás, doblada debajo del anca: el muslo y el pie apoyado en el cráter.
  const pie = curva([[48, -4], [30, -10], [10, -6], [2, 0], [8, 3], [50, 3]]);
  const rnd = azar(71);
  let pelos = '';
  for (let i = 0; i < 14; i++) pelos += mechon(40 + rnd() * 60, -60 + rnd() * 12, -3 + rnd() * 2, -6 - rnd() * 5, i % 2 ? C.pardo : C.cremaClara);
  return conGrano(
    enmascarado('m-joven-anca', d,
      forma(d, C.sepia) + nube(70, -40, 26, 20, C.crema, 'm', 0.8) + nube(60, -6, 40, 14, C.pardo, 'm', 0.9) + nube(96, -30, 10, 20, C.sepiaHonda, 'm', 0.8) +
      // La luz de la lava, que le prende el anca desde abajo.
      nube(60, 0, 44, 8, C.rojoHondo, 'm', 0.6) +
      // Las costillas de lobo flaco, marcadas en el flanco.
      trazo('M36 -46 q-4 8 0 16 M44 -50 q-5 10 -1 20 M52 -52 q-5 10 -1 22', C.sepiaHonda, 1.4, 0.45)) +
    pelos +
    enmascarado('m-joven-pie', pie, forma(pie, C.sepia) + nube(20, -2, 20, 4, C.pardo, 's', 0.9) + nube(30, 2, 20, 2, C.rojoHondo, 's', 0.5)) +
    [10, 18, 26].map((x) => trazo(`M${x} 0 l-2 3`, C.tinta, 1.4, 0.8)).join(''),
  );
}

/** La pata de atrás suelta, la que se rasca: el muslo y la pata con las uñas, que gira en la cadera. */
function rasca(): string {
  const [cx, cy] = A.cadera;
  const d = curva([[cx - 4, cy - 10], [cx + 14, cy - 6], [cx + 10, cy + 10], [cx - 14, cy + 28], [cx - 36, cy + 30], [cx - 40, cy + 22], [cx - 22, cy + 10], [cx - 12, cy - 2]]);
  return conGrano(enmascarado('m-joven-rasca', d, forma(d, C.sepia) + nube(cx - 20, cy + 20, 14, 6, C.pardo, 's', 0.9) + nube(cx + 2, cy, 8, 8, C.crema, 's', 0.6)) +
    [0, 1, 2].map((i) => trazo(`M${f(cx - 36 + i * 5)} ${f(cy + 30)} l-2 4`, C.tinta, 1.4, 0.9)).join(''));
}

/** La cola, larga y flaca, con la punta chamuscada. */
function cola(): string {
  const [kx, ky] = A.cola;
  const [px, py] = A.puntaCola;
  const d = `M${kx} ${ky} C${kx + 24} ${ky - 2} ${px - 10} ${py + 30} ${px} ${py}`;
  return conGrano(
    trazo(d, C.pardo, 13) + trazo(d, C.sepia, 9) + trazo(`M${kx + 6} ${ky - 2} C${kx + 26} ${ky - 6} ${px - 8} ${py + 26} ${px - 2} ${py + 4}`, C.crema, 3, 0.6) +
    // Los pelos de la cola, al viento, y la punta chamuscada, negra, con la brasita.
    [0.3, 0.5, 0.7].map((t) => { const x = kx + (px - kx) * t; const y = ky + (py - ky) * t * t; return mechon(x, y + 5, 2, 7, C.pardo, 0.7) + mechon(x + 4, y - 5, 3, -6, C.cremaClara, 0.6); }).join('') +
    nube(px, py, 7, 7, C.tinta, 's', 0.95) + forma(elipse(px + 1, py - 2, 2.2, 2.2), C.rojo) + forma(elipse(px + 1, py - 2, 1, 1), C.llama),
  );
}

/** El humo de la punta de la cola: tres volutas que suben. */
function colaHumo(): string {
  const [px, py] = A.puntaCola;
  return nube(px + 2, py - 12, 7, 6, C.noche, 'm', 0.8) + nube(px - 4, py - 24, 9, 7, C.noche, 'm', 0.7) + nube(px + 4, py - 36, 11, 8, C.gris, 'm', 0.55);
}

const CUERPO: readonly P[] = [[-16, -100], [10, -102], [34, -92], [48, -70], [40, -40], [18, -24], [-6, -30], [-20, -50], [-24, -76]];

function cuerpo(): string {
  const d = curva(CUERPO);
  const [bx, by] = A.brasa;
  const rnd = azar(83);
  let pelos = '';
  for (let i = 0; i < 18; i++) pelos += mechon(-6 + rnd() * 50, -104 + rnd() * 16, -3 + rnd() * 3, -6 - rnd() * 6, i % 2 ? C.pardo : C.cremaClara);
  return conGrano(
    enmascarado('m-joven-cuerpo', d,
      forma(d, C.sepia) + nube(20, -90, 20, 12, C.crema, 'm', 0.7) + nube(30, -46, 16, 24, C.pardo, 'm', 0.9) + nube(-12, -40, 14, 20, C.cremaClara, 'm', 0.8) +
      // Las costillas del pecho, por donde se ve la brasa.
      [[-14, -82], [-10, -70], [-6, -58]].map(([x, y]) => trazo(`M${x} ${y} q12 -4 24 2`, C.sepiaHonda, 1.6, 0.5)).join('') +
      // La luz de la lava, de abajo.
      nube(10, -26, 30, 8, C.rojoHondo, 'm', 0.5)) +
    pelos +
    // La piel quemada alrededor de la brasa: el pelo chamuscado.
    nube(bx, by, 11, 9, C.tinta, 's', 0.6) + nube(bx, by + 2, 6, 5, C.rojoHondo, 's', 0.8),
  );
}

/** La brasa del pecho, que late: el rojo entre las costillas y el brillo. */
function brasa(): string {
  const [bx, by] = A.brasa;
  return nube(bx, by, 14, 12, C.rojo, 'm', 0.9) + nube(bx, by, 7, 6, C.naranja, 's', 0.95) + nube(bx - 1, by - 1, 3, 2.4, C.llama, 'xs', 0.95) +
    trazo(`M${bx - 8} ${by - 4} q6 2 14 0 M${bx - 7} ${by + 4} q7 2 14 -1`, C.sepiaHonda, 1.2, 0.5);
}

/** Las llamas del lomo: tres lenguas que crecen desde la base, como en un leño. */
function llamas(): string {
  const [lx, ly] = A.llamas;
  const lengua = (x: number, h: number, w: number, o: number): string => {
    const d = `M${f(x - w)} ${f(ly)} Q${f(x - w * 0.6)} ${f(ly - h * 0.5)} ${f(x + w * 0.2)} ${f(ly - h)} Q${f(x + w * 0.8)} ${f(ly - h * 0.45)} ${f(x + w)} ${f(ly)} Z`;
    return forma(d, C.rojo, o) + forma(`M${f(x - w * 0.5)} ${f(ly)} Q${f(x - w * 0.2)} ${f(ly - h * 0.4)} ${f(x + w * 0.15)} ${f(ly - h * 0.7)} Q${f(x + w * 0.45)} ${f(ly - h * 0.35)} ${f(x + w * 0.5)} ${f(ly)} Z`, C.naranja, o) + nube(x, ly - h * 0.3, w * 0.3, h * 0.25, C.llama, 'xs', 0.9);
  };
  return `<g filter="url(#soplo-xs)">${lengua(lx - 14, 22, 7, 0.9) + lengua(lx + 2, 34, 9, 0.95) + lengua(lx + 18, 18, 6, 0.85)}</g>`;
}

/** Una pata de adelante, larga y flaca, del hombro a la pata con las uñas. */
function pata(n: 0 | 1): string {
  const [sx, sy] = A.hombros[n];
  const px = sx - 10 + n * 2;
  const d = curva([[sx - 9, sy - 4], [sx + 9, sy - 4], [px + 7, -6], [px + 10, 0], [px - 8, 0], [px - 7, -6]]);
  return conGrano(
    enmascarado(`m-joven-pata-${n}`, d, forma(d, n ? C.sepia : C.sepiaHonda) + nube(sx, sy + 10, 6, 12, n ? C.crema : C.pardo, 's', 0.6) + nube(px, -4, 8, 4, C.rojoHondo, 's', 0.5)) +
    [-5, 0, 5].map((dx) => trazo(`M${f(px + dx)} 0 l-1 3`, C.tinta, 1.3, 0.9)).join(''),
  );
}

const CABEZA: readonly P[] = [[-16, -100], [-40, -106], [-66, -110], [-72, -118], [-60, -128], [-38, -138], [-22, -150], [0, -156], [20, -152], [30, -136], [28, -112], [10, -96]];

function cabeza(): string {
  const d = curva(CABEZA);
  const { centro: [ex, ey], radio: [rx, ry] } = A.ojo;
  const [hx, hy] = A.hocico;
  const rnd = azar(97);
  let pelos = '';
  for (let i = 0; i < 10; i++) pelos += mechon(-10 + rnd() * 36, -150 + rnd() * 8, -2 + rnd() * 2, -5 - rnd() * 4, i % 2 ? C.pardo : C.cremaClara);
  return conGrano(
    enmascarado('m-joven-cabeza', d,
      forma(d, C.sepia) + nube(6, -140, 16, 10, C.crema, 'm', 0.8) + nube(-40, -118, 22, 7, C.cremaClara, 'm', 0.7) + nube(20, -112, 10, 16, C.pardo, 'm', 0.9) +
      nube(-50, -130, 12, 5, C.sepiaHonda, 's', 0.6) + trazo('M-36 -136 q-10 6 -22 8', C.sepiaHonda, 1.2, 0.5) +
      // El antifaz oscuro del cachorro, alrededor del ojo.
      nube(ex, ey, 14, 9, C.pardo, 'm', 0.7)) +
    pelos +
    // El ojo de la tapa: el aro azul, el blanco, la pupila y el brillo; va mirando al monte.
    forma(elipse(ex, ey, rx + 1.6, ry + 1.6), C.azul) + forma(elipse(ex, ey, rx, ry), C.azulClaro) +
    forma(elipse(ex - 2, ey + 0.5, 4.2, 4.6), C.tinta) + forma(elipse(ex - 3.2, ey - 1.6, 1.3, 1.3), C.papel) +
    trazo(`M${ex - rx - 1} ${ey - 2} Q${ex} ${ey - ry - 3} ${ex + rx + 1} ${ey - 1}`, C.tinta, 1.2, 0.8) +
    // El hocico: la trompa, la nariz negra y los bigotes.
    nube(hx + 6, hy, 10, 5, C.cremaClara, 's', 0.7) + forma(elipse(hx, hy - 1, 5, 4), C.tinta) + nube(hx - 1, hy - 2.6, 2, 1, C.papel, 'xs', 0.6) +
    trazo(`M${hx + 4} ${hy + 3} l-16 6 M${hx + 4} ${hy + 1} l-18 1 M${hx + 4} ${hy + 5} l-14 10`, C.papel, 0.6, 0.5) +
    // Los colmillos de arriba, que asoman aunque cierre la boca.
    forma(poli([[-54, -110], [-51, -102], [-48, -110]]), C.papel) + forma(poli([[-38, -106], [-35, -100], [-32, -106]]), C.papel),
  );
}

/** La quijada de abajo: el labio, la lengua y los dientes de abajo. Gira en la bisagra. */
function quijada(): string {
  const [qx, qy] = A.quijada;
  const d = curva([[qx - 4, qy - 2], [qx - 20, qy - 6], [qx - 34, qy - 4], [qx - 36, qy + 2], [qx - 24, qy + 8], [qx - 4, qy + 8]]);
  return conGrano(
    enmascarado('m-joven-quijada', d, forma(d, C.granate) + nube(qx - 18, qy + 4, 10, 4, C.rojo, 's', 0.8) + nube(qx - 22, qy, 8, 3, C.rojoHondo, 's', 0.7)) +
    trazo(`M${qx - 36} ${qy + 2} Q${qx - 20} ${qy + 10} ${qx - 4} ${qy + 8}`, C.sepiaHonda, 3.2, 0.95) +
    forma(poli([[qx - 30, qy - 3], [qx - 28, qy - 9], [qx - 25, qy - 3]]), C.papel) + forma(poli([[qx - 12, qy - 3], [qx - 10, qy - 8], [qx - 8, qy - 3]]), C.papel),
  );
}

/** Una oreja, demasiado grande para la cabeza, con el adentro rosado y el pelo del borde. */
function oreja(n: 0 | 1): string {
  const [ox, oy] = A.orejas[n];
  const d = curva([[ox - 10, oy + 2], [ox - 12, oy - 14], [ox - 4, oy - 30], [ox + 4, oy - 32], [ox + 12, oy - 14], [ox + 10, oy + 2]]);
  return conGrano(
    enmascarado(`m-joven-oreja-${n}`, d, forma(d, n ? C.sepia : C.sepiaHonda) + nube(ox, oy - 12, 5, 12, C.granate, 's', n ? 0.45 : 0.3) + nube(ox - 6, oy - 20, 4, 8, n ? C.crema : C.pardo, 's', 0.6)) +
    mechon(ox - 10, oy - 10, -4, -3, C.cremaClara) + mechon(ox + 10, oy - 12, 4, -2, C.pardo),
  );
}

/** El párpado, del pelo de la cara. */
function parpado(): string {
  const { centro: [ex, ey], radio: [rx, ry] } = A.ojo;
  return conGrano(forma(elipse(ex, ey, rx + 2.2, ry + 2.2), C.sepia) + nube(ex, ey - 2, 6, 2, C.pardo, 'xs', 0.6) + trazo(`M${ex - rx - 1} ${ey + 1} Q${ex} ${ey + ry + 2} ${ex + rx + 1} ${ey + 1}`, C.tinta, 1));
}

/** El vaho del aullido: la nube que sale del hocico y se abre hacia el cielo. */
function aullido(): string {
  const [hx, hy] = A.hocico;
  return nube(hx - 10, hy - 14, 14, 9, C.papel, 'm', 0.55) + nube(hx - 22, hy - 28, 18, 12, C.papel, 'm', 0.45) + nube(hx - 30, hy - 42, 22, 14, C.papel, 'l', 0.35);
}

/** El humo con forma de corazón que le sube del aullido. */
function corazon(): string {
  const [hx, hy] = A.hocico;
  const cx = hx - 10;
  const cy = hy - 50;
  const d = `M${cx} ${cy + 16} C${cx - 20} ${cy} ${cx - 16} ${cy - 18} ${cx - 2} ${cy - 10} C${cx + 12} ${cy - 18} ${cx + 16} ${cy} ${cx} ${cy + 16} Z`;
  return `<g filter="url(#soplo-s)">${forma(d, C.noche, 0.75)}${forma(d, C.rojoHondo, 0.35)}</g>` + nube(cx - 6, cy - 6, 4, 3, C.gris, 's', 0.6);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.6;
const O = A.ojo.centro;

export const PIEZAS_JOVEN: readonly Pieza[] = [
  { nombre: 'joven-volcan', caja: [-226, -16, 332, 170], dibujo: volcan(), densidad: 1.6 },
  { nombre: 'joven-lava', caja: [A.crater[0] - 100, A.crater[1] - 24, 200, 44], dibujo: lava(), densidad: 1.6 },
  { nombre: 'joven-humo', caja: [A.crater[0] - 70, A.crater[1] - 70, 140, 80], dibujo: humo(), densidad: 1.3 },
  { nombre: 'joven-chispas', caja: [A.crater[0] - 80, A.crater[1] - 110, 160, 120], dibujo: chispas(), densidad: 1.6 },
  { nombre: 'joven-cola', caja: [A.cola[0] - 8, A.puntaCola[1] - 16, 60, 80], dibujo: cola(), densidad: D },
  { nombre: 'joven-cola-humo', caja: [A.puntaCola[0] - 20, A.puntaCola[1] - 50, 40, 54], dibujo: colaHumo(), densidad: 1.3 },
  { nombre: 'joven-rasca', caja: [A.cadera[0] - 46, A.cadera[1] - 14, 66, 52], dibujo: rasca(), densidad: D },
  { nombre: 'joven-anca', caja: [-2, -72, 114, 78], dibujo: anca(), densidad: D },
  { nombre: 'joven-cuerpo', caja: [-30, -114, 86, 96], dibujo: cuerpo(), densidad: D },
  { nombre: 'joven-brasa', caja: [A.brasa[0] - 18, A.brasa[1] - 16, 36, 32], dibujo: brasa(), densidad: D * 1.4 },
  { nombre: 'joven-llamas', caja: [A.llamas[0] - 26, A.llamas[1] - 40, 56, 44], dibujo: llamas(), densidad: D },
  { nombre: 'joven-pata-1', caja: [A.hombros[0][0] - 22, A.hombros[0][1] - 8, 36, 72], dibujo: pata(0), densidad: D },
  { nombre: 'joven-cabeza', caja: [-80, -164, 116, 76], dibujo: cabeza(), densidad: D * 1.3 },
  { nombre: 'joven-quijada', caja: [A.quijada[0] - 42, A.quijada[1] - 14, 48, 26], dibujo: quijada(), densidad: D * 1.6 },
  { nombre: 'joven-parpado', caja: [O[0] - 12, O[1] - 11, 24, 22], dibujo: parpado(), densidad: D * 2 },
  { nombre: 'joven-oreja-1', caja: [A.orejas[0][0] - 16, A.orejas[0][1] - 36, 32, 42], dibujo: oreja(0), densidad: D * 1.4 },
  { nombre: 'joven-oreja-2', caja: [A.orejas[1][0] - 16, A.orejas[1][1] - 36, 32, 42], dibujo: oreja(1), densidad: D * 1.4 },
  { nombre: 'joven-aullido', caja: [A.hocico[0] - 60, A.hocico[1] - 64, 90, 66], dibujo: aullido(), densidad: 1.3 },
  { nombre: 'joven-corazon', caja: [A.hocico[0] - 36, A.hocico[1] - 76, 52, 46], dibujo: corazon(), densidad: 1.6 },
  { nombre: 'joven-pata-2', caja: [A.hombros[1][0] - 22, A.hombros[1][1] - 8, 36, 72], dibujo: pata(1), densidad: D },
];

const img = imagenesDe(PIEZAS_JOVEN);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El lobo armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    parte('humo', img('joven-humo'), t.humo, o.humo) +
    parte('lava', img('joven-lava'), '', o.lava) +
    parte('chispas', img('joven-chispas'), t.chispas, o.chispas) +
    img('joven-volcan') +
    parte('cola', img('joven-cola') + parte('cola-humo', img('joven-cola-humo'), t['cola-humo'], o['cola-humo']), t.cola) +
    parte('rasca', img('joven-rasca'), t.rasca) +
    img('joven-anca') +
    parte('cuerpo',
      img('joven-cuerpo') +
      parte('brasa', img('joven-brasa'), '', o.brasa) +
      parte('llamas', img('joven-llamas'), t.llamas, o.llamas) +
      parte('pata-1', img('joven-pata-1'), t['pata-1']) +
      parte('cabeza',
        parte('oreja-1', img('joven-oreja-1'), t['oreja-1']) +
        parte('quijada', img('joven-quijada'), t.quijada) +
        img('joven-cabeza') +
        parte('parpado', img('joven-parpado'), t.parpado) +
        parte('oreja-2', img('joven-oreja-2'), t['oreja-2']) +
        parte('aullido', img('joven-aullido'), t.aullido, o.aullido) +
        parte('corazon', img('joven-corazon'), t.corazon, o.corazon),
        t.cabeza) +
      parte('pata-2', img('joven-pata-2'), t['pata-2']),
      t.cuerpo)
  );
}

/** El lobo en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function jovenEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: sentado en el cráter, mirando al monte, con la brasa a medio arder. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--joven" data-id="el-joven-lobo" role="button" tabindex="0" aria-label="${nombres.get('el-joven-lobo') ?? 'El joven lobo'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: aullando al cielo con la brasa al rojo, las llamas altas y el corazón de humo. */
export const RETRATO = { caja: [JOVEN.x - 96, JOVEN.piso - 128, 200, 172] as const };
function retrato(): string {
  return `<image href="/bestiario/monte-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` + jovenEn(ARDE);
}

export const JOVEN_PERSONAJE: Personaje = {
  id: 'el-joven-lobo',
  region: 'el-monte',
  ancla: JOVEN.x,
  piezas: PIEZAS_JOVEN,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
