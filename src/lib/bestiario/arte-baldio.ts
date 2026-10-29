/**
 * Limón, por los techos del baldío (`D-73`, décima vuelta).
 *
 * Pedido del usuario, textual: *"que limón sea un limón colombiano que corre por las chapas, es una
 * leyenda interesante que parece ser real"*. El verso es de *"Me matan, Limón!"* (*Luzbelito*,
 * 1996): *"Me matan, Limón / Por los techos viene el bloque"*. El Indio contó que el tema narra el
 * final de Pablo Escobar, perseguido con su ladero por los tejados (`RES-21`), y ese ladero, el
 * Limón, existió (`RES-170`). El dibujo no lo retrata: es un limón, de los verdes, que en Colombia
 * es el que se llama así.
 *
 * Limón no está en ninguna tapa: se inventa en la estética del recinto donde vive, que es el baldío
 * en el crayón de *Un baión* (`arte.ts`, `rayones`), el mismo crayón del perro de esa tapa. Así que
 * está **pintado a crayón**: una mancha de base y, encima, cientos de rayones cortos que dan la
 * vuelta a la fruta. El color de cada rayón lo decide la luz, que es la del farol del baldío, arriba
 * a la derecha: del lado del farol el verde se va al amarillo; del otro, al violeta de la noche. El
 * borde no es una línea: es donde los rayones se aprietan y se oscurecen. Y como los demás títeres,
 * va **recortado en piezas** —la fruta, las dos piernas, los dos brazos, la hoja, la boca— que mueve
 * la isla.
 *
 * Acá también viven la chapa por donde corre, que remata la medianera, y el haz de las linternas
 * del bloque, que barre los techos.
 *
 * Limón está en coordenadas de títere (`rig.ts`, `LIMON_ARMADO`): el (0, 0) es la chapa entre los
 * dos pies, arriba es negativo, y mira para la derecha.
 */

import { enmascarado, forma, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { azar, type P } from './pincel.ts';
import { CHAPA, LIMON_ARMADO as A, LINTERNAS, marcoDelRecinto } from './rig.ts';

const L = {
  hondo: 'var(--bestia-limon-hondo)',
  verde: 'var(--bestia-limon-verde)',
  claro: 'var(--bestia-limon-claro)',
  brillo: 'var(--bestia-limon-brillo)',
  noche: 'var(--entorno-baion-noche)',
  violeta: 'var(--entorno-baion-violeta)',
  lila: 'var(--entorno-baion-lila)',
  luz: 'var(--entorno-baion-luz)',
  azul: 'var(--entorno-baion-azul)',
  rosa: 'var(--entorno-baion-rosa)',
  papel: 'var(--papel)',
  negro: 'var(--fondo)',
};

/** De dónde viene la luz: el farol, arriba a la derecha y un poco adelante. */
const LUZ = (() => {
  const [x, y, z] = [0.55, -0.6, 0.58];
  const m = Math.hypot(x, y, z);
  return [x / m, y / m, z / m] as const;
})();

const n = (v: number): string => (Math.round(v * 10) / 10).toString();
const poli = (pts: readonly P[]): string => `M${pts.map(([x, y]) => `${n(x)} ${n(y)}`).join(' L')} Z`;

/** Un rayón de crayón: un trazo corto, apenas curvado, con su ancho y su presión. */
function rayon(x: number, y: number, ang: number, largo: number, color: string, ancho: number, o: number, curva = 0): string {
  const dx = Math.cos(ang) * largo;
  const dy = Math.sin(ang) * largo;
  const cx = x + dx / 2 - Math.sin(ang) * curva;
  const cy = y + dy / 2 + Math.cos(ang) * curva;
  return trazo(`M${n(x)} ${n(y)} Q${n(cx)} ${n(cy)} ${n(x + dx)} ${n(y + dy)}`, color, ancho, o);
}

/* ------------------------------------------------------------------
   La fruta: un limón verde, con el pezón adelante y el cabito arriba
   ------------------------------------------------------------------ */

/** El contorno del limón, a mano: una elipse que se estira en la punta y se hunde en el cabito. */
function contornoFruta(): P[] {
  const { centro: [cx, cy], radio: [rx, ry] } = A.fruta;
  const rnd = azar(401);
  const pts: P[] = [];
  const lados = 64;
  for (let i = 0; i < lados; i++) {
    const a = (i / lados) * Math.PI * 2;
    // El pezón: adelante y un poco arriba, como lo lleva el limón cuando corre inclinado.
    const dp = ((a + 0.18 + Math.PI) % (Math.PI * 2)) - Math.PI;
    const pezon = 9 * Math.exp(-(dp * dp) / 0.018);
    // Atrás, donde estaba el cabito, la cáscara se aplana apenas.
    const culo = -3 * Math.exp(-((a - Math.PI) * (a - Math.PI)) / 0.08);
    const temblor = (rnd() - 0.5) * 1.4;
    const r = 1 + (pezon + culo + temblor) / Math.max(rx, ry);
    pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
  }
  return pts;
}

/** Cuánta luz le toca a un punto de la fruta, de 0 (de espaldas al farol) a 1. */
function luzEn(x: number, y: number): { k: number; u: number; v: number } {
  const { centro: [cx, cy], radio: [rx, ry] } = A.fruta;
  const u = (x - cx) / rx;
  const v = (y - cy) / ry;
  const w = Math.sqrt(Math.max(0, 1 - u * u - v * v));
  return { k: Math.max(0, u * LUZ[0] + v * LUZ[1] + w * LUZ[2]), u, v };
}

/** La tinta de un rayón según la luz: del violeta de la noche al amarillo del farol. */
function tintaDeLuz(k: number, r: number): string {
  if (k < 0.12) return r < 0.6 ? L.noche : L.violeta;
  if (k < 0.32) return r < 0.55 ? L.hondo : L.violeta;
  if (k < 0.55) return r < 0.7 ? L.verde : L.hondo;
  if (k < 0.78) return r < 0.6 ? L.claro : L.verde;
  return r < 0.55 ? L.brillo : L.claro;
}

/**
 * Los rayones que le dan el volumen: cortos, tirados casi en paralelo al borde (dan la vuelta a la
 * fruta, como cuando se rellena una pelota con crayón), más apretados y más oscuros del lado de la
 * sombra.
 */
function volumenACrayon(semilla: number): string {
  const { centro: [cx, cy], radio: [rx, ry] } = A.fruta;
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < 1500; i++) {
    const x = cx + (rnd() * 2 - 1) * (rx + 10);
    const y = cy + (rnd() * 2 - 1) * (ry + 10);
    const { k, u, v } = luzEn(x, y);
    // Del lado del farol hay menos rayones: ahí manda el papel claro de la base.
    if (k > 0.7 && rnd() < 0.35) continue;
    const tangente = Math.atan2(v * rx, u * ry) + Math.PI / 2;
    const ang = tangente + (rnd() - 0.5) * 0.7;
    const largo = 6 + rnd() * 13;
    s += rayon(x, y, ang, largo, tintaDeLuz(k, rnd()), 1.6 + rnd() * 2.2, 0.45 + rnd() * 0.5, (rnd() - 0.5) * 3);
  }
  return s;
}

/** Los poros de la cáscara: puntitos de crayón, más visibles donde pega la luz. */
function poros(semilla: number): string {
  const { centro: [cx, cy], radio: [rx, ry] } = A.fruta;
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < 140; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * 0.92;
    const x = cx + Math.cos(a) * rx * d;
    const y = cy + Math.sin(a) * ry * d;
    const { k } = luzEn(x, y);
    if (k < 0.3) continue;
    s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(0.7 + rnd() * 0.9)}" fill="${k > 0.7 ? L.verde : L.hondo}" opacity="${n(0.4 + rnd() * 0.4)}"/>`;
  }
  return s;
}

/** El borde a crayón: rayones que siguen el contorno, cortados, más gruesos del lado oscuro. */
function bordeACrayon(pts: readonly P[], semilla: number): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < pts.length; i++) {
    if (rnd() < 0.18) continue;
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[(i + 1 + Math.floor(rnd() * 2)) % pts.length]!;
    const { k } = luzEn(x0, y0);
    const color = k < 0.35 ? L.noche : k < 0.65 ? L.hondo : L.verde;
    s += trazo(`M${n(x0)} ${n(y0)} L${n(x1)} ${n(y1)}`, color, k < 0.35 ? 3.4 + rnd() * 1.6 : 1.6 + rnd() * 1.4, 0.7 + rnd() * 0.3);
  }
  return s;
}

/** La cara: los blancos de los ojos, desorbitados, las cejas de susto y la gota que se le cae. */
function cara(): string {
  const rnd = azar(433);
  let s = '';
  for (const { centro: [x, y], radio: [rx, ry] } of A.ojos) {
    s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${L.papel}"/>`;
    // El blanco también va a crayón: un poco de lila del lado de la sombra, y su borde roto.
    for (let i = 0; i < 26; i++) {
      const a = Math.PI * (0.55 + rnd() * 0.9);
      s += rayon(x + Math.cos(a) * rx * 0.7, y + Math.sin(a) * ry * 0.7, a + Math.PI / 2, 3 + rnd() * 4, L.lila, 1.2, 0.5);
    }
    s += trazo(`M${n(x - rx)} ${n(y)} A${rx} ${ry} 0 1 1 ${n(x + rx)} ${n(y)} A${rx} ${ry} 0 1 1 ${n(x - rx)} ${n(y)}`, L.noche, 1.8, 0.85);
  }
  // Las cejas, levantadas por dentro: el susto del que mira para atrás.
  const [[x1, y1], [x2, y2]] = [A.ojos[0].centro, A.ojos[1].centro];
  s += trazo(`M${x1 - 9} ${y1 - 9} Q${x1 - 1} ${y1 - 15} ${x1 + 6} ${y1 - 19}`, L.noche, 3.6);
  s += trazo(`M${x2 - 5} ${y2 - 19} Q${x2 + 2} ${y2 - 16} ${x2 + 9} ${y2 - 10}`, L.noche, 3.2);
  // Las arrugas del cachete, de tanto correr, y la gota de sudor que se le va para atrás.
  s += trazo(`M${A.boca[0] + 14} ${A.boca[1] - 12} q4 6 0 13`, L.hondo, 2.4, 0.8);
  s += forma(`M-46 -92 q-5 7 0 10 q5 -3 0 -10 Z`, L.luz, 0.9);
  s += forma(`M-54 -76 q-4 6 0 8 q4 -2 0 -8 Z`, L.luz, 0.75);
  return s;
}

function fruta(): string {
  const pts = contornoFruta();
  const silueta = poli(pts);
  const { centro: [cx, cy], radio: [rx, ry] } = A.fruta;
  const adentro =
    forma(silueta, L.verde) +
    // La base soplada: el verde se va al amarillo del lado del farol y a la noche del otro.
    nube(cx + rx * 0.35, cy - ry * 0.35, rx * 0.7, ry * 0.6, L.claro, 'l', 0.9) +
    nube(cx - rx * 0.55, cy + ry * 0.5, rx * 0.8, ry * 0.7, L.hondo, 'l', 0.85) +
    volumenACrayon(411) +
    poros(417) +
    // El brillo del farol, apretado y amarillo, y el rebote violeta de la medianera abajo.
    nube(cx + rx * 0.42, cy - ry * 0.48, 7, 5, L.brillo, 's', 0.85, -30) +
    nube(cx - rx * 0.1, cy + ry * 0.92, rx * 0.7, 8, L.lila, 'm', 0.35);
  return `<g filter="url(#grano)">${enmascarado('m-limon', silueta, adentro)}${bordeACrayon(pts, 421)}${cara()}</g>`;
}

/** La boca abierta, con los dientes de arriba: jadea. La isla la achica y la agranda. */
function boca(): string {
  const [x, y] = A.boca;
  // Un hueco redondo y alto, el de quien se queda sin aire, apenas torcido para atrás.
  const hueco = `M${x - 5} ${y - 6} Q${x + 1} ${y - 10} ${x + 6} ${y - 5} Q${x + 8} ${y + 3} ${x + 3} ${y + 9} Q${x - 3} ${y + 11} ${x - 6} ${y + 4} Q${x - 8} ${y - 2} ${x - 5} ${y - 6} Z`;
  return (
    forma(hueco, L.noche) +
    nube(x, y + 5, 3.4, 3, L.rosa, 'xs', 0.8) +
    forma(`M${x - 4.6} ${y - 5.6} Q${x + 1} ${y - 8.6} ${x + 5.6} ${y - 4.8} L${x + 5} ${y - 2.6} L${x - 5} ${y - 3} Z`, L.papel, 0.92) +
    trazo(hueco, L.noche, 1.8)
  );
}

/** El cabito y la hoja: la hoja, verde de las de atrás, a crayón; la isla la sacude al correr. */
function hoja(): string {
  const [x, y] = A.cabito;
  const rnd = azar(441);
  const contorno = `M${x} ${y} C${x - 10} ${y - 8} ${x - 26} ${y - 8} ${x - 34} ${y - 2} C${x - 26} ${y + 6} ${x - 12} ${y + 6} ${x} ${y} Z`;
  let rayones = '';
  for (let i = 0; i < 70; i++) {
    const t = rnd();
    const px = x - 4 - t * 28;
    const py = y - 1 + (rnd() - 0.5) * 9 * Math.sin(Math.PI * t);
    rayones += rayon(px, py, -0.5 + (rnd() - 0.5) * 0.6, 4 + rnd() * 5, rnd() < 0.55 ? L.hondo : L.verde, 1.4 + rnd(), 0.6 + rnd() * 0.35);
  }
  return (
    trazo(`M${x + 4} ${y + 6} L${x} ${y}`, L.noche, 3.6) +
    `<g filter="url(#grano)">${enmascarado('m-limon-hoja', contorno, forma(contorno, L.hondo) + rayones)}</g>` +
    trazo(`M${x - 1} ${y} Q${x - 16} ${y - 1} ${x - 31} ${y - 2}`, L.noche, 1.4, 0.8) +
    trazo(contorno, L.noche, 1.6, 0.8)
  );
}

/**
 * Una pierna: la pierna, flaca y oscura, rayada en el violeta de la noche, y la zapatilla gastada,
 * blanca de papel con la franja rosa. Cuelga de la cadera (0, 0) y la suela queda en `A.pierna`.
 * La de atrás va más apagada, porque le da la sombra de la fruta.
 */
function pierna(atras: boolean, semilla: number): string {
  const rnd = azar(semilla);
  const largo = A.pierna;
  const oscuro = atras ? L.noche : L.violeta;
  let s = '';
  for (let i = 0; i < 46; i++) {
    const t = rnd();
    s += rayon(-3 + rnd() * 6, t * (largo - 8), Math.PI / 2 + (rnd() - 0.5) * 0.5, 4 + rnd() * 6, rnd() < 0.6 ? oscuro : L.noche, 2 + rnd() * 1.4, 0.75);
  }
  s += trazo(`M0 0 L0 ${largo - 8}`, L.noche, 6, 0.9) + s;
  // La zapatilla: la punta para adelante, la suela gruesa y la franja.
  const z = `M-7 ${largo - 9} Q-2 ${largo - 12} 6 ${largo - 9} Q16 ${largo - 7} 17 ${largo - 2} L17 ${largo} L-8 ${largo} Q-10 ${largo - 5} -7 ${largo - 9} Z`;
  s += forma(z, atras ? L.lila : L.papel);
  s += trazo(`M-4 ${largo - 5} Q4 ${largo - 8} 12 ${largo - 4}`, L.rosa, 2.4, 0.9);
  s += forma(`M-8 ${largo - 1.6} L17 ${largo - 1.6} L17 ${largo + 0.8} L-8 ${largo + 0.8} Z`, L.noche);
  s += trazo(z, L.noche, 1.6, 0.85);
  return `<g filter="url(#grano)">${s}</g>`;
}

/** Un brazo: flaco, en el violeta de la noche, con la mano abierta de cuatro dedos, a crayón. */
function brazo(atras: boolean, semilla: number): string {
  const rnd = azar(semilla);
  const largo = A.brazo;
  const tinta = atras ? L.noche : L.violeta;
  let s = trazo(`M0 0 Q2 ${largo * 0.5} 0 ${largo - 4}`, L.noche, 4.6, 0.9);
  for (let i = 0; i < 24; i++) s += rayon(-2 + rnd() * 4, rnd() * (largo - 6), Math.PI / 2 + (rnd() - 0.5) * 0.5, 3 + rnd() * 5, tinta, 1.6 + rnd(), 0.75);
  // La mano: la palma y cuatro dedos que se abren para correr.
  s += `<ellipse cx="0" cy="${largo - 1}" rx="4.6" ry="4" fill="${atras ? L.noche : L.violeta}"/>`;
  for (const a of [-0.5, 0.0, 0.5, 1.1]) s += trazo(`M0 ${largo} l${n(Math.sin(a) * 7)} ${n(Math.cos(a) * 7)}`, L.noche, 2.2);
  return `<g filter="url(#grano)">${s}</g>`;
}

/* ------------------------------------------------------------------
   La chapa y las linternas del bloque
   ------------------------------------------------------------------ */

/**
 * La chapa: un remate de chapa acanalada sobre la medianera, de punta a punta, que es por donde
 * corre. Las ondas de la chapa son rayones verticales, alternados en lila (donde les pega el farol)
 * y en la noche; con dos o tres chapas levantadas, y los clavos.
 */
/** Los techos, agrandados a la derecha, y el farol de la parte nueva (el otro lo pinta `arte.ts`). */
const TECHOS = marcoDelRecinto('los-techos');
export const FAROL_DEL_FONDO = { x: 1240, y: 150 } as const;

function chapa(): string {
  // De punta a punta de los techos, que se agrandaron a la derecha (`MARCO_DEL_RECINTO`).
  const { ancho } = TECHOS;
  const { arriba, piso, abajo } = CHAPA;
  const rnd = azar(451);
  let s = forma(`M-10 ${piso} L${ancho + 10} ${piso} L${ancho + 10} ${abajo} L-10 ${abajo} Z`, L.violeta);
  for (let x = -10; x < ancho + 10; x += 7) {
    const luz = Math.max(0, 1 - Math.abs(x - 650) / 420, 0.8 - Math.abs(x - FAROL_DEL_FONDO.x) / 380);
    s += rayon(x, piso + 1, Math.PI / 2, abajo - piso - 2, (x / 7) % 2 < 1 ? L.noche : rnd() < luz ? L.luz : L.lila, 3.4, 0.55 + luz * 0.35);
  }
  // El filo de arriba, que es lo que pisa, tocado por la luz.
  for (let x = -10; x < ancho + 10; x += 10 + rnd() * 12) s += rayon(x, piso, (rnd() - 0.5) * 0.15, 10 + rnd() * 14, rnd() < 0.5 ? L.luz : L.lila, 2.2, 0.8);
  // Las chapas levantadas, con su sombra abajo.
  for (const x of [384, 548, 742, 1086, 1288]) {
    s += forma(`M${x} ${piso} L${x + 46} ${piso} L${x + 44} ${arriba} L${x + 2} ${arriba + 3} Z`, L.violeta);
    for (let k = 0; k < 7; k++) s += rayon(x + 3 + k * 6, piso, -Math.PI / 2 + 0.06, piso - arriba - 2, k % 2 ? L.noche : L.lila, 3, 0.7);
    s += nube(x + 22, piso + 4, 26, 3, L.noche, 's', 0.8);
  }
  for (let x = 30; x < ancho; x += 64 + rnd() * 30) s += `<circle cx="${n(x)}" cy="${n(piso + 5)}" r="1.6" fill="${L.noche}"/>`;
  // El borde de abajo, donde la chapa le hace sombra a la medianera.
  s += soplo(`M-10 ${abajo - 2} L${ancho + 10} ${abajo - 2} L${ancho + 10} ${abajo + 8} L-10 ${abajo + 8} Z`, L.noche, 's', 0.7);
  return `<g filter="url(#rociado)">${s}</g>`;
}

/**
 * El haz de una linterna: un cono de luz soplado que sale del (0, 0) para la derecha, lila afuera y
 * blanco en el eje, con unos rayones de crayón adentro, como el farol. La isla lo pone afuera de la
 * escena y lo hace barrer los techos.
 */
function linterna(): string {
  const { largo } = LINTERNAS;
  const abre = 0.15;
  const cono = (k: number): string => {
    const y = Math.tan(abre * k) * largo;
    return `M0 0 L${largo} ${n(-y)} L${largo} ${n(y)} Z`;
  };
  const rnd = azar(461);
  let rayones = '';
  for (let i = 0; i < 90; i++) {
    const x = 60 + rnd() * (largo - 80);
    const y = (rnd() - 0.5) * Math.tan(abre) * x * 1.4;
    rayones += rayon(x, y, (rnd() - 0.5) * 0.3, 8 + rnd() * 18, rnd() < 0.6 ? L.luz : L.lila, 2 + rnd() * 2, 0.25 + rnd() * 0.3);
  }
  return soplo(cono(1), L.lila, 'l', 0.4) + soplo(cono(0.45), L.luz, 'm', 0.45) + rayones + nube(4, 0, 10, 8, L.luz, 's', 0.9);
}

/* ------------------------------------------------------------------
   Las piezas
   ------------------------------------------------------------------ */

const { centro: [fx, fy], radio: [frx, fry] } = A.fruta;

export const PIEZAS_LIMON: readonly Pieza[] = [
  { nombre: 'limon-fruta', caja: [fx - frx - 26, fy - fry - 26, (frx + 26) * 2 + 4, (fry + 26) * 2], dibujo: fruta(), densidad: 3 },
  { nombre: 'limon-boca', caja: [A.boca[0] - 12, A.boca[1] - 12, 24, 24], dibujo: boca(), densidad: 3 },
  { nombre: 'limon-hoja', caja: [A.cabito[0] - 40, A.cabito[1] - 14, 50, 26], dibujo: hoja(), densidad: 3 },
  { nombre: 'limon-pierna', caja: [-12, -4, 32, A.pierna + 8], dibujo: pierna(false, 471), densidad: 3 },
  { nombre: 'limon-pierna-atras', caja: [-12, -4, 32, A.pierna + 8], dibujo: pierna(true, 473), densidad: 3 },
  { nombre: 'limon-brazo', caja: [-12, -4, 24, A.brazo + 16], dibujo: brazo(false, 481), densidad: 3 },
  { nombre: 'limon-brazo-atras', caja: [-12, -4, 24, A.brazo + 16], dibujo: brazo(true, 483), densidad: 3 },
];

export const PIEZAS_BALDIO: readonly Pieza[] = [
  { nombre: 'baldio-chapa', caja: [0, CHAPA.arriba - 4, TECHOS.ancho, CHAPA.abajo - CHAPA.arriba + 16], dibujo: chapa(), densidad: 2 },
  { nombre: 'baldio-linterna', caja: [-20, -110, LINTERNAS.largo + 20, 220], dibujo: linterna(), densidad: 1 },
  ...PIEZAS_LIMON,
];
