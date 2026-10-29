/**
 * El amorcito que mordió el vidrio (`D-73`, vigesimosegunda vuelta), colgada de la ventana rota del bajo.
 *
 * *"Voy a cuidar de mi amorcito, que mordió el vidrio por demás otra vez. Me llama nene, sifón"* es de
 * *Ñam fri frufi fali fru*, en *Gulp!* (1985). Por eso viste esa tapa, medida con sharp: la piel es el papel
 * blanco de la fotocopia, el pelo y el vestido la tinta, y lo que grita es el verde ácido de las letras de
 * *Patricio Rey* escritas a mano; la boca pintada es el rojo del sello de *Gulp!* de la contratapa.
 *
 * De la letra son el vidrio entre los dientes, que está borracha por demás otra vez, el sifón, que muerde
 * alocada y el *¡Ñam!*, escrito en el aire con la letra de la tapa, y que cuando empieza a cabalgar no la
 * cambia por nada. Del dibujo, todo lo demás: que asoma por el agujero de su propia ventana, colgada del
 * marco con la panza, los cachetes colorados, los ojos que no se ponen de acuerdo, y el hipo, que es una
 * burbuja de soda.
 *
 * Coordenadas: el (0, 0) es el medio del marco de abajo de la ventana (`rig-amorcito.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { caja, cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { AMORCITO, AMORCITO_ARMADO as A, NAM, QUIETO, marcas, type Momento } from './rig-amorcito.ts';

/** Las tintas de *Gulp!* (`tokens.css`), y la luz del bajo que se refleja en el vidrio. */
const C = {
  papel: 'var(--bestia-amorcito-papel)',
  papelClaro: 'var(--bestia-amorcito-papel-claro)',
  gris: 'var(--bestia-amorcito-gris)',
  tinta: 'var(--bestia-amorcito-tinta)',
  tintaHonda: 'var(--bestia-amorcito-tinta-honda)',
  verde: 'var(--bestia-amorcito-verde)',
  verdeClaro: 'var(--bestia-amorcito-verde-claro)',
  verdeHondo: 'var(--bestia-amorcito-verde-hondo)',
  rojo: 'var(--bestia-amorcito-rojo)',
  rojoHondo: 'var(--bestia-amorcito-rojo-hondo)',
  rubor: 'var(--bestia-amorcito-rubor)',
  celeste: 'var(--entorno-bajo-celeste)',
  llama: 'var(--entorno-bajo-llama-clara)',
};

/* ------------------------------------------------------------------
   El cuerpo: el vestido de tinta con las letras verdes, y el marco de la ventana
   ------------------------------------------------------------------ */

function torso(): string {
  const d = curva([[-24, -42], [-10, -48], [10, -48], [24, -42], [22, -20], [18, 0], [-18, 0], [-22, -20]]);
  // Las letras de la tapa garabateadas en el vestido, como si alguien le hubiera escrito encima.
  const garabatos = [[-14, -30], [2, -22], [-8, -12], [12, -36], [10, -8]].map(([x, y], i) =>
    trazo(`M${x! - 5} ${y! + 2} q2 -6 4 0 t4 -1 M${x! - 4} ${y! - 4} l2 8`, i % 2 ? C.verdeClaro : C.verde, 1.2, 0.85)).join('');
  // El escote, la piel del pecho y el breteles.
  const piel = curva([[-14, -48], [14, -48], [10, -40], [0, -36], [-10, -40]]);
  return conGrano(
    enmascarado('m-amor-torso', d, forma(d, C.tinta) + nube(-10, -30, 8, 18, C.gris, 'm', 0.35) + nube(14, -20, 8, 20, C.tintaHonda, 'm', 0.9) + garabatos) +
    enmascarado('m-amor-pecho', piel, forma(piel, C.papel) + nube(0, -38, 10, 3, C.gris, 's', 0.6)) +
    trazo('M-16 -46 L-12 -52 M16 -46 L12 -52', C.tinta, 1.6) +
    // Un collar de cuentas verdes, torcido.
    [-10, -6, -2, 2, 6, 10].map((x, i) => forma(elipse(x, -46 + Math.abs(x) * -0.2 + i * 0.4, 1.6, 1.6), C.verdeClaro)).join(''),
  );
}

/** El marco de abajo de la ventana, con los dientes de vidrio que quedaron, delante de la panza. */
function marco(): string {
  const madera = caja(-56, 0, 112, 10);
  const diente = (x: number, alto: number, inclina: number): string => {
    const d = poli([[x - 4, 1], [x + inclina, -alto], [x + 5, 1]]);
    return enmascarado(`m-amor-diente-${x}`, d, forma(d, C.celeste, 0.55) + nube(x + inclina * 0.5 - 1, -alto * 0.5, 1.4, alto * 0.4, C.papelClaro, 'xs', 0.9));
  };
  return conGrano(
    enmascarado('m-amor-madera', madera, forma(madera, C.tintaHonda) + nube(0, 2, 56, 2, C.gris, 's', 0.5) + nube(30, 8, 20, 3, C.tinta, 's', 0.9)) +
    trazo('M-56 0 L56 0', C.gris, 1.2, 0.8) +
    diente(-40, 18, 4) + diente(-28, 10, -2) + diente(26, 14, 3) + diente(40, 22, -5) + diente(48, 9, 2),
  );
}

/* ------------------------------------------------------------------
   Los brazos, y el sifón
   ------------------------------------------------------------------ */

function brazo(n: 0 | 1): string {
  const [sx, sy] = A.hombros[n];
  const [ex, ey] = A.codos[n];
  const [hx, hy] = A.manos[n];
  // Dos tramos: el brazo hasta el codo apoyado en el marco, y el antebrazo que cuelga para afuera.
  const tramo = ([ax, ay]: P, [bx, by]: P, a0: number, a1: number): string => {
    const ang = Math.atan2(by - ay, bx - ax);
    const [nx, ny] = [-Math.sin(ang), Math.cos(ang)];
    return poli([[ax + nx * a0, ay + ny * a0], [bx + nx * a1, by + ny * a1], [bx - nx * a1, by - ny * a1], [ax - nx * a0, ay - ny * a0]]);
  };
  const arriba = tramo([sx, sy], [ex, ey], 7, 5.4);
  const abajo = tramo([ex, ey], [hx, hy], 5.4, 4);
  // Las pulseras: anillos de vidrio verde de botella, que tintinean.
  const pulseras = [0.66, 0.78].map((k) => {
    const [x, y] = [ex + (hx - ex) * k, ey + (hy - ey) * k];
    return forma(elipse(x, y, 5.6, 2), C.verde, 0.85) + nube(x - 2, y - 0.6, 2, 0.6, C.verdeClaro, 'xs', 0.9);
  }).join('');
  const mano = forma(elipse(hx, hy + 2, 5, 6), C.papel) + nube(hx + 2, hy + 3, 3, 4, C.gris, 's', 0.5) + trazo(`M${hx - 3} ${hy + 6} l0 3 M${hx} ${hy + 7} l0 3 M${hx + 3} ${hy + 6} l0 3`, C.gris, 0.8) +
    // Las uñas pintadas del rojo del sello.
    [-3, 0, 3].map((dx) => forma(elipse(hx + dx, hy + 9.4, 1.1, 1.4), C.rojo)).join('');
  const s = n === 0 ? -1 : 1;
  return conGrano(
    enmascarado(`m-amor-brazo-${n}`, arriba, forma(arriba, C.papel) + nube(sx - s * 2, sy + 8, 4, 14, C.gris, 'm', 0.6) + nube(sx + s * 3, sy + 4, 2, 10, C.papelClaro, 's', 0.8)) +
    enmascarado(`m-amor-antebrazo-${n}`, abajo, forma(abajo, C.papel) + nube(ex + s * 3, (ey + hy) / 2, 3, 16, C.gris, 'm', 0.7) + nube(ex - s * 2, ey + 6, 2, 8, C.papelClaro, 's', 0.8)) +
    // El codo, huesudo, apoyado en la madera.
    forma(elipse(ex, ey, 6, 5), C.papel) + nube(ex, ey + 2, 5, 2, C.gris, 's', 0.6) +
    pulseras + mano,
  );
}

/** El sifón, colgando de la mano 2 por la cabeza: el vidrio verde acanalado y la cabeza de metal con la palanca. */
function sifon(): string {
  const [hx, hy] = A.manos[1];
  const [px, py] = A.pico;
  const botella = cajaRedonda(hx - 9, hy + 10, 18, 52, 5);
  const acanalado = [-6, -2, 2, 6].map((dx) => trazo(`M${hx + dx} ${hy + 14} L${hx + dx} ${hy + 58}`, C.verdeClaro, 1, 0.4)).join('');
  return conGrano(
    enmascarado('m-amor-botella', botella, forma(botella, C.verdeHondo, 0.92) + acanalado + nube(hx - 4, hy + 34, 2, 18, C.verdeClaro, 's', 0.8) + nube(hx + 6, hy + 40, 4, 20, C.tintaHonda, 'm', 0.7) +
      // La soda adentro, con burbujas.
      [[-2, 50], [3, 44], [-4, 30], [2, 22]].map(([dx, dy]) => `<circle cx="${hx + dx!}" cy="${hy + dy!}" r="1.2" fill="none" stroke="${C.papelClaro}" stroke-width="0.5" opacity="0.7"/>`).join('')) +
    // La cabeza de metal, la palanca debajo de los dedos, y el pico para afuera.
    forma(cajaRedonda(hx - 7, hy + 2, 14, 10, 2), C.gris) + nube(hx - 3, hy + 4, 3, 2, C.papelClaro, 'xs', 0.9) +
    forma(poli([[hx - 6, hy + 2], [hx + 2, hy - 4], [hx + 4, hy - 2], [hx - 2, hy + 3]]), C.gris) +
    forma(poli([[hx + 6, hy + 6], [px + 2, py - 4], [px + 3, py + 1], [hx + 6, hy + 10]]), C.gris) + nube((hx + px) / 2 + 2, (hy + py) / 2 - 2, 3, 1, C.papelClaro, 'xs', 0.8),
  );
}

/** El chorro de soda, que sale del pico para el lado de la botella y se abre en gotas. */
function chorro(): string {
  const [px, py] = A.pico;
  const gotas = Array.from({ length: 12 }, (_, i) => {
    const k = (i + 1) / 12;
    const x = px + 8 + k * 26 + Math.sin(i * 2.3) * 4 * k;
    const y = py + k * 70;
    return forma(elipse(x, y, 1.6 + k, 2 + k), C.papelClaro, 0.85 - k * 0.4);
  }).join('');
  return soplo(`M${px} ${py} Q${px + 14} ${py + 30} ${px + 30} ${py + 70} L${px + 40} ${py + 70} Q${px + 22} ${py + 30} ${px + 3} ${py - 1} Z`, C.papelClaro, 's', 0.7) + trazo(`M${px + 1} ${py} Q${px + 14} ${py + 30} ${px + 34} ${py + 72}`, C.celeste, 1.4, 0.8) + gotas;
}

/* ------------------------------------------------------------------
   La cabeza: el pelo de tinta, la cara de papel y lo que hace la boca
   ------------------------------------------------------------------ */

const CARA: readonly P[] = [[0, -94], [14, -90], [20, -76], [18, -60], [10, -50], [0, -47], [-10, -50], [-18, -60], [-20, -76], [-14, -90]];

/** El pelo, alborotado de tanto: mechones de tinta para todos lados, con el reflejo verde de la tapa. */
function pelo(): string {
  const [cx, cy] = A.cara;
  const puntas: P[] = [];
  for (let i = 0; i < 22; i++) {
    const a = Math.PI * (0.9 + (i / 21) * 1.2) + Math.sin(i * 7.7) * 0.08;
    const r = 30 + (i % 3) * 7 + Math.sin(i * 3.1) * 4;
    puntas.push([cx + Math.cos(a) * r, cy - 4 + Math.sin(a) * r * 0.9]);
    puntas.push([cx + Math.cos(a + 0.07) * (r - 12), cy - 4 + Math.sin(a + 0.07) * (r - 12) * 0.9]);
  }
  // Abajo se cierra a los costados de la cara, en dos mechones largos que le caen sobre los hombros.
  const d = curva([...puntas, [cx + 26, cy + 4], [cx + 30, cy + 28], [cx + 18, cy + 14], [cx - 18, cy + 14], [cx - 32, cy + 26], [cx - 26, cy + 4]]);
  return conGrano(enmascarado('m-amor-pelo', d, forma(d, C.tinta) + nube(cx - 14, cy - 26, 14, 6, C.verdeHondo, 'm', 0.9) + nube(cx - 10, cy - 30, 8, 2, C.verde, 's', 0.6) + nube(cx + 20, cy, 10, 20, C.tintaHonda, 'm', 0.9)) +
    trazo(`M${cx - 20} ${cy - 30} q6 -10 18 -8 M${cx + 4} ${cy - 36} q10 2 14 10`, C.verdeHondo, 1, 0.8));
}

function cara(): string {
  const d = curva(CARA);
  const [cx, cy] = A.cara;
  // Los ojos no se ponen de acuerdo: cada pupila mira para el lado de la otra.
  const ojo = ([x, y]: P, i: number): string => {
    const s = i ? -1 : 1;
    return forma(elipse(x, y, 5, 3.6), C.papelClaro) + forma(elipse(x + s * 1.6, y + 0.4, 1.8, 2.2), C.tinta) + forma(elipse(x + s * 1.2, y - 0.4, 0.6, 0.6), C.papelClaro) +
      // El delineado de tinta, corrido, que se escapa para afuera.
      trazo(`M${x - 6} ${y - 1} Q${x} ${y - 5} ${x + 6} ${y - 1} l${-s * -3} ${-2}`, C.tinta, 1.6) + trazo(`M${x - 4} ${y + 3} q4 2 8 0`, C.gris, 0.8, 0.8) +
      trazo(`M${x - 5} ${y - 7} Q${x} ${y - 9} ${x + 5} ${y - 7}`, C.tinta, 1.1);
  };
  const [bx, by] = A.boca;
  // La boca mordiendo: los labios del rojo del sello apretados alrededor del vidrio.
  const labios = forma(curva([[bx - 7, by], [bx - 2, by - 2.4], [bx, by - 1.6], [bx + 2, by - 2.4], [bx + 7, by], [bx + 3, by + 3], [bx - 3, by + 3]]), C.rojo) + trazo(`M${bx - 6} ${by + 0.4} L${bx + 6} ${by + 0.4}`, C.rojoHondo, 0.9) + nube(bx - 2, by + 2, 2, 0.6, C.papelClaro, 'xs', 0.6);
  return conGrano(
    forma(cajaRedonda(-6, -52, 12, 10, 3), C.papel) + nube(0, -46, 6, 3, C.gris, 's', 0.6) +
    enmascarado('m-amor-cara', d, forma(d, C.papel) + nube(cx + 12, cy + 4, 8, 16, C.gris, 'm', 0.5) + nube(cx - 6, cy - 14, 8, 6, C.papelClaro, 'm', 0.8) + nube(cx, cy + 22, 14, 4, C.gris, 's', 0.5)) +
    A.ojos.map(ojo).join('') +
    // La nariz, apenas un trazo, y un lunar.
    trazo(`M${cx + 1} ${cy - 2} q2 6 -1 8`, C.gris, 0.9) + forma(elipse(cx + 10, cy + 8, 0.8, 0.8), C.tinta) +
    labios +
    // El flequillo, desgreñado, que le cae sobre un ojo.
    enmascarado('m-amor-flequillo', curva([[-21, -82], [-16, -96], [0, -100], [16, -96], [21, -82], [16, -86], [12, -78], [8, -86], [2, -80], [-2, -88], [-8, -76], [-11, -86], [-16, -80]]),
      forma(caja(-24, -102, 48, 28), C.tinta) + nube(-8, -94, 10, 3, C.verdeHondo, 's', 0.9) + nube(-6, -95, 5, 1.2, C.verde, 'xs', 0.7)) +
    // Los aros, un vidrio de botella cada uno.
    [-1, 1].map((s) => forma(poli([[cx + s * 19, cy + 2], [cx + s * 22, cy + 10], [cx + s * 17, cy + 9]]), C.verde, 0.85)).join(''),
  );
}

/** Los párpados a media asta: está borracha por demás. */
function parpados(): string {
  return A.ojos.map(([x, y], i) => enmascarado(`m-amor-parpado-${i}`, elipse(x, y, 5.4, 4), forma(elipse(x, y - 1, 6, 4.4), C.papel) + nube(x, y - 2, 4, 2, C.verdeHondo, 's', 0.45) + trazo(`M${x - 6} ${y + 1} Q${x} ${y + 3} ${x + 6} ${y + 1}`, C.tinta, 1.6))).join('');
}

/** Los cachetes colorados. */
function colorado(): string {
  const [cx, cy] = A.cara;
  return nube(cx - 12, cy + 6, 6, 3.6, C.rubor, 's', 0.8) + nube(cx + 12, cy + 6, 6, 3.6, C.rubor, 's', 0.8) + nube(cx, cy + 1, 3, 2, C.rubor, 's', 0.5);
}

/** La boca abierta de par en par para morder: el rojo, los dientes y lo oscuro. */
function boca(): string {
  const [bx, by] = A.boca;
  const d = curva([[bx - 8, by - 2], [bx, by - 4], [bx + 8, by - 2], [bx + 6, by + 6], [bx, by + 9], [bx - 6, by + 6]]);
  return conGrano(enmascarado('m-amor-boca', d, forma(d, C.rojoHondo) + forma(elipse(bx, by + 2, 5, 4), C.tintaHonda) + forma(caja(bx - 5, by - 3, 10, 2.4), C.papelClaro) + forma(caja(bx - 4, by + 6, 8, 1.6), C.papelClaro)) +
    trazo(`M${bx - 8} ${by - 2} Q${bx} ${by - 6} ${bx + 8} ${by - 2}`, C.rojo, 1.8) + trazo(`M${bx - 6} ${by + 6} Q${bx} ${by + 10} ${bx + 6} ${by + 6}`, C.rojo, 1.6));
}

/** El vidrio entre los dientes: un pedazo del de la ventana, filoso, que agarra la luz del bajo. */
function vidrio(): string {
  const [bx, by] = A.boca;
  const d = poli([[bx - 26, by - 5], [bx + 4, by - 3], [bx + 22, by - 10], [bx + 14, by + 3], [bx - 20, by + 4]]);
  return conGrano(enmascarado('m-amor-vidrio', d, forma(d, C.celeste, 0.75) + nube(bx + 6, by, 10, 3, C.papelClaro, 's', 0.5) + nube(bx - 10, by - 1, 8, 1.4, C.papelClaro, 'xs', 0.95) + nube(bx + 12, by - 3, 3, 1.6, C.llama, 'xs', 0.9)) + trazo(`M${bx - 22} ${by - 3} L${bx + 4} ${by - 2} L${bx + 18} ${by - 7}`, C.papelClaro, 0.6, 0.9));
}

/** Las migas del vidrio mordido, que saltan para todos lados. */
function migas(): string {
  const [bx, by] = A.boca;
  return Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2 + 0.4;
    const r = 10 + (i % 4) * 4;
    const [x, y] = [bx + Math.cos(a) * r, by + Math.sin(a) * r * 0.8];
    const t = 1.6 + (i % 3);
    return forma(poli([[x - t, y], [x + t * 0.4, y - t * 1.2], [x + t, y + t * 0.5]]), i % 3 ? C.celeste : C.papelClaro, 0.85);
  }).join('');
}

/** La burbuja del hipo: una de soda, que sube. */
function hipo(): string {
  const [bx, by] = A.boca;
  return `<circle cx="${bx + 6}" cy="${by - 10}" r="6" fill="none" stroke="${C.papelClaro}" stroke-width="1" opacity="0.85"/>` + nube(bx + 4, by - 12, 2, 1.4, C.papelClaro, 'xs', 0.9) + `<circle cx="${bx + 14}" cy="${by - 20}" r="2.6" fill="none" stroke="${C.papelClaro}" stroke-width="0.8" opacity="0.7"/>`;
}

/** El ¡ÑAM! escrito en el aire con la letra a mano de la tapa, en el verde ácido. */
function nam(): string {
  // Cada letra son unos trazos a pulso, apenas torcidos, como las letras de *Patricio Rey*.
  const letras =
    // ¡
    'M-49 -130 l0 2 M-50 -122 l1 18 ' +
    // Ñ, con la virgulilla
    'M-40 -104 L-38 -128 L-24 -106 L-22 -130 M-40 -136 q4 -4 8 0 t8 -1 ' +
    // A
    'M-14 -104 L-6 -130 L4 -103 M-11 -114 L1 -115 ' +
    // M
    'M10 -104 L12 -130 L20 -112 L28 -131 L31 -104 ' +
    // !
    'M40 -131 l-1 18 M38 -106 l0 2';
  return trazo(letras, C.tintaHonda, 6.4, 0.7) + trazo(letras, C.verde, 4.2) + trazo(letras, C.verdeClaro, 1.4, 0.8);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.4;
const [BX, BY] = A.boca;
const [PX, PY] = A.pico;
const [H2x, H2y] = A.manos[1];

export const PIEZAS_AMORCITO: readonly Pieza[] = [
  { nombre: 'amorcito-pelo', caja: [-46, -122, 92, 80], dibujo: pelo(), densidad: D },
  { nombre: 'amorcito-torso', caja: [-28, -56, 56, 60], dibujo: torso(), densidad: D },
  { nombre: 'amorcito-cara', caja: [-26, -98, 52, 58], dibujo: cara(), densidad: D * 1.4 },
  { nombre: 'amorcito-parpados', caja: [-16, -82, 32, 14], dibujo: parpados(), densidad: D * 1.4 },
  { nombre: 'amorcito-colorado', caja: [-30, -80, 60, 30], dibujo: colorado(), densidad: D },
  { nombre: 'amorcito-boca', caja: [BX - 10, BY - 8, 20, 20], dibujo: boca(), densidad: D * 1.4 },
  { nombre: 'amorcito-vidrio', caja: [BX - 28, BY - 12, 52, 18], dibujo: vidrio(), densidad: D * 1.4 },
  { nombre: 'amorcito-migas', caja: [BX - 26, BY - 24, 52, 48], dibujo: migas(), densidad: D },
  { nombre: 'amorcito-hipo', caja: [BX - 2, BY - 26, 22, 24], dibujo: hipo(), densidad: D },
  { nombre: 'amorcito-nam', caja: [-56, -142, 102, 44], dibujo: nam(), densidad: D },
  { nombre: 'amorcito-marco', caja: [-58, -24, 116, 36], dibujo: marco(), densidad: D },
  { nombre: 'amorcito-brazo-1', caja: [-46, -50, 36, 94], dibujo: brazo(0), densidad: D },
  { nombre: 'amorcito-brazo-2', caja: [10, -50, 36, 98], dibujo: brazo(1), densidad: D },
  { nombre: 'amorcito-sifon', caja: [H2x - 12, H2y - 8, PX - H2x + 18, 74], dibujo: sifon(), densidad: D },
  { nombre: 'amorcito-chorro', caja: [PX - 4, PY - 4, 52, 84], dibujo: chorro(), densidad: D * 0.8 },
];

const img = imagenesDe(PIEZAS_AMORCITO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El amorcito armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    parte('torso',
      img('amorcito-torso') +
      parte('cabeza',
        img('amorcito-pelo') + img('amorcito-cara') +
        parte('colorado', img('amorcito-colorado'), '', o.colorado) +
        parte('parpado', img('amorcito-parpados'), '', o.parpado) +
        parte('boca', img('amorcito-boca'), t.quijada, o.boca) +
        parte('vidrio', img('amorcito-vidrio'), '', o.vidrio) +
        parte('migas', img('amorcito-migas'), t.migas, o.migas) +
        parte('hipo', img('amorcito-hipo'), t.hipo, o.hipo),
        t.cabeza),
      t.torso) +
    img('amorcito-marco') +
    // Los brazos cuelgan por afuera del marco, y se zarandean con el cuerpo.
    parte('brazos',
      parte('brazo-1', img('amorcito-brazo-1'), t['brazo-1']) +
      parte('brazo-2', img('amorcito-brazo-2') + img('amorcito-sifon') + parte('chorro', img('amorcito-chorro'), t.chorro, o.chorro), t['brazo-2']),
      t.brazos) +
    parte('nam', img('amorcito-nam'), t.nam, o.nam)
  );
}

/** El amorcito en un momento, sin lo que la hace tocable: para el test, el retrato y para mirarla. */
export function amorcitoEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: colgada del marco, con el vidrio entre los dientes. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--amorcito" data-id="el-amorcito-que-mordio-el-vidrio" role="button" tabindex="0" aria-label="${nombres.get('el-amorcito-que-mordio-el-vidrio') ?? 'El amorcito que mordió el vidrio'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: mordiendo alocada, con el ¡Ñam! en el aire, en su ventana. */
export const RETRATO = { caja: [AMORCITO.x - 50, AMORCITO.alfeizar - 82, 100, 136] as const };
function retrato(): string {
  // El fondo de la sala, en su caja de `arte-bajo.ts`: del borde izquierdo del bajo agrandado al derecho.
  return `<image href="/bestiario/bajo-lejos.webp" x="-250" y="0" width="1450" height="640" preserveAspectRatio="none"/>` + amorcitoEn(NAM);
}

export const AMORCITO_PERSONAJE: Personaje = {
  id: 'el-amorcito-que-mordio-el-vidrio',
  region: 'el-bajo',
  ancla: AMORCITO.x,
  piezas: PIEZAS_AMORCITO,
  capas: { atras: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
