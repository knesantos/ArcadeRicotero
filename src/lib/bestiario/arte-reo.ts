/**
 * El reo semental (`D-73`, vigesimosexta vuelta), en la celda grande del ala de la izquierda de la prisión.
 *
 * *"El reo semental se va a licuar"* es de *Barbazul versus el amor letal*, en *Gulp!* (1985). Es un preso de
 * los de antes: el traje a rayas, la chapa con el número, el jopo con gomina. Semental porque es un toro: el
 * cuello más ancho que la cabeza, el pecho peludo que le abre la camisa, los brazos como jamones agarrados a
 * los barrotes, y en el brazo un tatuaje viejo, verde, de un corazón con un puñal. Y se licúa, al pie de la
 * letra: suda a chorros, se le estira la cara, se le cae el jopo, las rayas del traje le chorrean del ruedo
 * como pintura fresca, y cuando lo tocan se derrite entero hasta quedar hecho un charco a rayas con los dos
 * ojos flotando. Después se vuelve a armar, de abajo para arriba, y se sacude.
 *
 * De la letra son el reo, el semental y el licuarse. Del dibujo son el tatuaje, la chapa, el jopo y los ojos que
 * quedan flotando en el charco.
 *
 * Viste *Gulp!*, medido con sharp: las rayas son la tinta y el papel de la fotocopia de la tapa, la piel el gris
 * donde la fotocopia se ensucia, el tatuaje y el charco el verde de las letras del frente, la boca el sello rojo
 * de la contratapa, y el sudor y la chapa el amarillo que asoma en ese sello.
 *
 * Coordenadas: el (0, 0) es el piso de la celda entre las botas, y está de frente (`rig-reo.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { BARROTES, HUECO, LICUADO, QUIETO, REO, REO_ARMADO as A, SALA, TRAVESANIOS, alTitere, marcas, type Momento, type Punto } from './rig-reo.ts';

const ID = 'el-reo-semental';

/** Las tintas de *Gulp!* (`tokens.css`). */
const C = {
  tinta: 'var(--bestia-reo-tinta)',
  tintaHonda: 'var(--bestia-reo-tinta-honda)',
  papel: 'var(--bestia-reo-papel)',
  papelSucio: 'var(--bestia-reo-papel-sucio)',
  piel: 'var(--bestia-reo-gris-claro)',
  pielHonda: 'var(--bestia-reo-gris)',
  gris: 'var(--bestia-reo-gris-hondo)',
  verde: 'var(--bestia-reo-verde)',
  verdeHondo: 'var(--bestia-reo-verde-hondo)',
  verdeNoche: 'var(--bestia-reo-verde-noche)',
  rojo: 'var(--bestia-reo-rojo)',
  rosa: 'var(--bestia-reo-rosa)',
  amarillo: 'var(--bestia-reo-amarillo)',
  amarilloClaro: 'var(--bestia-reo-amarillo-claro)',
};

/** Las rayas del traje: horizontales, de tinta sobre el papel, adentro de una silueta. `y0` alinea las rayas de todas las piezas. */
function rayas(id: string, silueta: string, y0: number, y1: number, x0: number, x1: number, sombra: string): string {
  let s = '';
  for (let y = y0; y < y1; y += 22) s += forma(`M${f(x0)} ${f(y)} h${f(x1 - x0)} v11 h${f(x0 - x1)} Z`, C.tinta);
  return enmascarado(id, silueta, forma(silueta, C.papel) + s + sombra);
}

/* ------------------------------------------------------------------
   El charco, las piernas y las rayas que chorrean
   ------------------------------------------------------------------ */

/** El charco a rayas, con el borde verdoso de licuado y una burbuja. Se arma desde el piso, creciendo. */
function charco(): string {
  const d = curva([[-120, 0], [-70, -16], [0, -22], [70, -16], [124, 0], [90, 14], [0, 18], [-90, 14]]);
  return conGrano(
    enmascarado('m-reo-charco', d,
      forma(d, C.papel) + [-14, -6, 2, 10].map((y) => forma(`M-130 ${y} q60 -6 130 0 q70 6 130 0 v4 q-70 6 -130 0 q-70 -6 -130 0 Z`, C.tinta)).join('') +
      nube(0, 10, 90, 8, C.verdeHondo, 'm', 0.5) + nube(-60, -6, 20, 6, C.verde, 's', 0.4)) +
    trazo('M-120 0 q60 -24 124 0', C.verdeNoche, 2.4, 0.8) + forma(elipse(40, -10, 4, 2.4), C.papel, 0.8) + forma(elipse(40, -10, 2, 1.2), C.verde, 0.8),
  );
}

/** Los dos ojos que quedan flotando en el charco. */
function charcoOjos(): string {
  const ojo = (x: number): string => forma(elipse(x, -8, 9, 5), C.papel) + forma(elipse(x + 1, -8, 3.6, 3.2), C.tinta) + forma(elipse(x + 2.2, -9.2, 1, 1), C.papel);
  return ojo(-22) + ojo(22);
}

function piernas(): string {
  const d = curva([[-62, -210], [62, -210], [66, -120], [60, -30], [-60, -30], [-66, -120]]);
  const bota = (x: number): string => conGrano(forma(cajaRedonda(x - 30, -34, 60, 36, 6), C.tinta) + nube(x, -20, 22, 6, C.gris, 's', 0.6) + trazo(`M${x - 26} -8 h52`, C.tintaHonda, 2) + nube(x - 8, -28, 10, 3, C.papelSucio, 'xs', 0.4));
  return conGrano(
    rayas('m-reo-piernas', d, -210, -30, -70, 70, nube(0, -120, 8, 90, C.gris, 'm', 0.5) + nube(-50, -130, 14, 80, C.gris, 'm', 0.6) + nube(50, -130, 14, 80, C.gris, 'm', 0.6)) +
    // La raya de entre las piernas, y las rodillas marcadas.
    trazo('M0 -110 v80', C.gris, 3, 0.7) + nube(-32, -100, 10, 6, C.papelSucio, 's', 0.5) + nube(32, -100, 10, 6, C.papelSucio, 's', 0.5),
  ) + bota(-34) + bota(34);
}

/** Las rayas que chorrean del ruedo de la camisa, como pintura fresca: crecen desde el ruedo. */
function chorreado(): string {
  const r = A.ruedo;
  const gota = (x: number, l: number, w: number): string =>
    forma(`M${f(x - w)} ${r} v${f(l)} q0 ${f(w)} ${f(w)} ${f(w)} q${f(w)} 0 ${f(w)} ${f(-w)} v${f(-l)} Z`, C.tinta) + nube(x, r + l + w, w * 0.5, w * 0.4, C.papelSucio, 'xs', 0.5);
  return conGrano(gota(-60, 30, 6) + gota(-28, 52, 7) + gota(4, 24, 5) + gota(36, 44, 7) + gota(62, 18, 5) + forma(elipse(-28, r + 68, 4, 2.4), C.tinta) + forma(elipse(36, r + 60, 3, 2), C.tinta));
}

/* ------------------------------------------------------------------
   El torso: la camisa a rayas abierta, el pecho peludo, la chapa y el tatuaje
   ------------------------------------------------------------------ */

const TORSO: readonly P[] = [[-80, -348], [-30, -356], [30, -356], [80, -348], [92, -300], [86, -250], [74, -206], [-74, -206], [-86, -250], [-92, -300]];

function torso(): string {
  const d = curva(TORSO);
  // El escote de la camisa abierta, con el pecho peludo adentro.
  const escote = curva([[-26, -356], [26, -356], [30, -320], [14, -270], [0, -256], [-14, -270], [-30, -320]]);
  let pelos = '';
  for (let i = 0; i < 26; i++) {
    const x = -20 + ((i * 37) % 40);
    const y = -340 + ((i * 53) % 70);
    pelos += trazo(`M${f(x)} ${f(y)} q${f(-2 + (i % 3))} -5 ${f(2 - (i % 2) * 3)} -8`, C.tinta, 1.2, 0.8);
  }
  return conGrano(
    rayas('m-reo-torso', d, -354, -206, -100, 100, nube(0, -280, 40, 60, C.papelSucio, 'l', 0.35) + nube(-74, -280, 14, 60, C.gris, 'm', 0.6) + nube(74, -280, 14, 60, C.gris, 'm', 0.6) + nube(0, -215, 80, 8, C.gris, 'm', 0.6)) +
    enmascarado('m-reo-escote', escote, forma(escote, C.piel) + nube(0, -300, 16, 40, C.pielHonda, 'm', 0.8) + pelos) +
    // El cuello de la camisa, levantado, y los botones que quedan.
    trazo('M-26 -356 L-34 -322 L-18 -328 M26 -356 L34 -322 L18 -328', C.papelSucio, 3, 0.95) +
    [-262, -240, -218].map((y) => forma(elipse(0, y, 2.4, 2.4), C.tinta)).join('') +
    // La chapa con el número, cosida en el pecho.
    forma(cajaRedonda(30, -300, 44, 22, 2), C.amarillo) + nube(52, -284, 18, 4, C.gris, 's', 0.5) +
    trazo('M38 -294 v10 M46 -294 v10 M54 -294 v10 M62 -294 v10 M38 -284 h24', C.tinta, 1.6, 0.9) + trazo('M40 -296 h2 M56 -296 h2', C.tinta, 1.6, 0.9),
  );
}

/* ------------------------------------------------------------------
   Los brazos: del puño en el barrote al hombro, con la manga arremangada, el bíceps y el tatuaje
   ------------------------------------------------------------------ */

function brazo(n: 0 | 1): string {
  const s = n ? 1 : -1;
  const [fx, fy] = A.punios[n];
  const [hx, hy] = A.hombros[n];
  // El antebrazo sube del codo al puño; el brazo baja del codo al hombro: un jamón doblado.
  const codo: P = [s * 96, -372];
  const d = curva([[fx - 14, fy - 2], [fx + 14, fy - 2], [codo[0] + s * 10, codo[1] - 10], [codo[0] + s * 14, codo[1] + 16], [hx + s * 22, hy + 8], [hx - s * 10, hy + 6], [hx - s * 12, hy - 14], [codo[0] - s * 12, codo[1]]]);
  const manga = curva([[hx - s * 14, hy - 16], [hx + s * 26, hy - 4], [hx + s * 24, hy + 12], [codo[0] + s * 14, codo[1] + 18], [codo[0] - s * 8, codo[1] + 8]]);
  // El tatuaje: un corazón con un puñal clavado, verde de viejo, en el bíceps de afuera.
  const [tx, ty] = [s * 86, -352];
  const corazon = `M${f(tx)} ${f(ty + 10)} C${f(tx - 12)} ${f(ty)} ${f(tx - 10)} ${f(ty - 12)} ${f(tx - 1)} ${f(ty - 6)} C${f(tx + 8)} ${f(ty - 12)} ${f(tx + 12)} ${f(ty)} ${f(tx)} ${f(ty + 10)} Z`;
  return conGrano(
    enmascarado(`m-reo-brazo-${n}`, d, forma(d, C.piel) + nube(codo[0], codo[1] + 2, 16, 20, C.pielHonda, 'm', 0.8) + nube(fx, fy + 20, 10, 16, C.pielHonda, 'm', 0.6) + nube(s * 84, -350, 14, 16, C.papel, 'm', 0.35)) +
    // La manga arremangada a rayas, hasta arriba del codo.
    rayas(`m-reo-manga-${n}`, manga, -354, -300, hx - 60, hx + 60, nube(hx, hy, 24, 10, C.gris, 'm', 0.5)) +
    trazo(`M${f(codo[0] - s * 8)} ${f(codo[1] + 8)} Q${f(codo[0] + s * 4)} ${f(codo[1] + 22)} ${f(codo[0] + s * 14)} ${f(codo[1] + 18)}`, C.papelSucio, 4, 0.9) +
    // El tatuaje, y la vena del brazo.
    trazo(corazon, C.verdeHondo, 1.8, 0.9) + forma(corazon, C.verde, 0.35) + trazo(`M${f(tx + s * 6)} ${f(ty - 14)} L${f(tx - s * 5)} ${f(ty + 8)} M${f(tx + s * 2)} ${f(ty - 12)} l${f(s * 6)} 3`, C.verdeHondo, 1.6, 0.9) +
    trazo(`M${f(fx + s * 4)} ${f(fy + 12)} q${f(s * 6)} 14 ${f(s * 2)} 26`, C.pielHonda, 1.2, 0.5) +
    // El puño cerrado en el barrote: los nudillos y el pulgar.
    forma(elipse(fx, fy, 16, 13), C.piel) + nube(fx, fy + 5, 12, 5, C.pielHonda, 's', 0.7) +
    [-9, -3, 3, 9].map((dx) => forma(elipse(fx + dx, fy - 7, 2.6, 2.6), C.papel, 0.5)).join('') + trazo(`M${f(fx - s * 12)} ${f(fy + 2)} q${f(s * 8)} 6 ${f(s * 16)} 2`, C.pielHonda, 1.6, 0.8),
  );
}

/* ------------------------------------------------------------------
   La cabeza: el cuello de toro, la cara cuadrada, el jopo, las cejas, los ojos y la boca
   ------------------------------------------------------------------ */

function cabeza(): string {
  const [nx, ny] = A.cuello;
  const cara = curva([[-44, -470], [0, -482], [44, -470], [50, -430], [46, -396], [30, -372], [0, -364], [-30, -372], [-46, -396], [-50, -430]]);
  const ojo = (n: 0 | 1): string => {
    const { centro: [ex, ey], radio: [rx, ry] } = A.ojos[n];
    return forma(elipse(ex, ey, rx, ry), C.papel) + nube(ex, ey - 2, rx, 2, C.papelSucio, 'xs', 0.6) + nube(ex, ey + ry + 4, rx, 3, C.pielHonda, 's', 0.6);
  };
  return conGrano(
    // El cuello de toro, más ancho que la cabeza, con los tendones.
    forma(cajaRedonda(nx - 40, ny - 24, 80, 40, 10), C.pielHonda) + nube(nx, ny - 4, 20, 10, C.piel, 's', 0.6) + trazo(`M${nx - 20} ${ny - 18} v26 M${nx + 20} ${ny - 18} v26`, C.gris, 1.6, 0.5) +
    enmascarado('m-reo-cara', cara,
      forma(cara, C.piel) + nube(0, -456, 30, 14, C.papel, 'm', 0.35) + nube(-30, -410, 14, 30, C.pielHonda, 'm', 0.7) + nube(30, -410, 14, 30, C.pielHonda, 'm', 0.7) +
      // La barba de tres días, de la quijada a las patillas, y las patillas.
      nube(0, -382, 34, 14, C.gris, 'm', 0.55) + nube(-44, -430, 6, 30, C.gris, 'm', 0.8) + nube(44, -430, 6, 30, C.gris, 'm', 0.8) +
      // La nariz rota, torcida, y el surco de la frente.
      trazo('M-4 -440 q-8 18 2 26 q8 4 12 -2', C.pielHonda, 2.2, 0.9) + nube(2, -418, 7, 4, C.pielHonda, 's', 0.6) + trazo('M-14 -464 q14 4 28 0', C.pielHonda, 1.4, 0.5) +
      // La cicatriz del pómulo.
      trazo('M24 -420 l10 -14 M26 -428 l4 2 M30 -432 l4 2', C.papel, 1.2, 0.7)) +
    ojo(0) + ojo(1) +
    // Las orejas, chicas y pegadas.
    forma(elipse(-50, -428, 6, 9), C.piel) + forma(elipse(50, -428, 6, 9), C.piel) + trazo('M-50 -432 q-2 4 0 8 M50 -432 q2 4 0 8', C.pielHonda, 1.2),
  );
}

/** Una pupila, que mira adonde la isla la corra. */
function pupila(n: 0 | 1): string {
  const { centro: [ex, ey] } = A.ojos[n];
  return forma(elipse(ex, ey, 3.8, 3.6), C.tinta) + forma(elipse(ex + 1.4, ey - 1.4, 1.1, 1.1), C.papel);
}

function parpado(n: 0 | 1): string {
  const { centro: [ex, ey], radio: [rx, ry] } = A.ojos[n];
  return conGrano(forma(elipse(ex, ey, rx + 1, ry + 1), C.piel) + trazo(`M${f(ex - rx)} ${f(ey + 1)} Q${f(ex)} ${f(ey + ry + 1)} ${f(ex + rx)} ${f(ey + 1)}`, C.gris, 1));
}

/** Una ceja gruesa, que gira para el ceño. */
function ceja(n: 0 | 1): string {
  const [cx, cy] = A.cejas[n];
  const s = n ? 1 : -1;
  return conGrano(forma(curva([[cx - s * 12, cy - 2], [cx + s * 12, cy - 6], [cx + s * 13, cy], [cx - s * 11, cy + 4]]), C.tinta) + trazo(`M${f(cx - s * 10)} ${f(cy + 2)} l${f(s * 4)} -3`, C.gris, 0.8, 0.5));
}

/** El jopo con gomina, con el rulo que cae en la frente, y el pelo corto de los costados. */
function jopo(): string {
  const [jx, jy] = A.jopo;
  const d = curva([[jx - 40, jy + 12], [jx - 30, jy - 10], [jx - 8, jy - 24], [jx + 20, jy - 22], [jx + 40, jy - 8], [jx + 44, jy + 10], [jx + 20, jy + 2], [jx, jy - 2], [jx - 18, jy + 4]]);
  return conGrano(
    enmascarado('m-reo-jopo', d, forma(d, C.tinta) + nube(jx, jy - 12, 24, 5, C.pielHonda, 's', 0.5) + trazo(`M${jx - 30} ${jy - 2} q20 -14 50 -8`, C.gris, 1.2, 0.6)) +
    trazo(`M${jx + 20} ${jy + 2} q10 10 2 20 q-4 6 2 10`, C.tinta, 3.2, 0.95),
  );
}

/** La boca: los labios, la raya, y el diente de oro que asoma. Se abre y se estira al licuarse. */
function boca(): string {
  const [bx, by] = A.boca;
  const d = curva([[bx - 22, by - 2], [bx - 8, by - 6], [bx + 8, by - 6], [bx + 22, by - 2], [bx + 8, by + 8], [bx - 8, by + 8]]);
  return conGrano(enmascarado('m-reo-boca', d, forma(d, C.rojo) + nube(bx, by + 4, 14, 4, C.rosa, 's', 0.8) + forma(cajaRedonda(bx - 12, by - 4, 24, 5, 1), C.papel) + forma(cajaRedonda(bx + 2, by - 4, 5, 5, 1), C.amarillo)) +
    trazo(`M${bx - 22} ${by - 2} Q${bx} ${by + 2} ${bx + 22} ${by - 2}`, C.gris, 1.6, 0.9));
}

/** Los dientes del gruñido: la hilera entera, apretada. */
function dientes(): string {
  const [bx, by] = A.boca;
  return conGrano(forma(cajaRedonda(bx - 20, by - 6, 40, 12, 2), C.rojo) + forma(cajaRedonda(bx - 18, by - 5, 36, 5, 1), C.papel) + forma(cajaRedonda(bx - 18, by + 1, 36, 4, 1), C.papel) +
    [-12, -6, 0, 6, 12].map((x) => trazo(`M${bx + x} ${by - 5} v10`, C.gris, 0.8, 0.7)).join('') + forma(cajaRedonda(bx + 2, by - 5, 5, 5, 1), C.amarillo));
}

/** El sudor: gotas que bajan por la frente y las sienes. */
function gotas(): string {
  const gota = (x: number, y: number, r: number): string => forma(`M${f(x)} ${f(y - r * 1.6)} Q${f(x + r)} ${f(y)} ${f(x)} ${f(y + r)} Q${f(x - r)} ${f(y)} ${f(x)} ${f(y - r * 1.6)} Z`, C.amarilloClaro, 0.9) + forma(elipse(x - r * 0.3, y - r * 0.2, r * 0.3, r * 0.3), C.papel, 0.8);
  return gota(-34, -456, 3) + gota(30, -448, 2.6) + gota(-10, -470, 2.2) + gota(42, -416, 2.4) + gota(-44, -412, 2) + gota(12, -462, 2.6);
}

/* ------------------------------------------------------------------
   La reja de adelante: los mismos barrotes de la celda, tallados encima
   ------------------------------------------------------------------ */

/** Los barrotes y los travesaños de la celda, en el recinto, delante del reo: así está preso. */
function reja(): string {
  let s = '';
  for (const b of BARROTES) s += `<rect x="${f(b.x - b.grueso / 2)}" y="${f(b.arriba)}" width="${f(b.grueso)}" height="${f(660 - b.arriba)}" fill="var(--bestia-dracula-papel)"/>`;
  for (const t of TRAVESANIOS) {
    const [ax, ay] = t.izq;
    const [bx, by] = t.der;
    s += `<path d="M${f(ax)} ${f(ay - 2.2)} L${f(bx)} ${f(by - 2)} L${f(bx)} ${f(by + 2)} L${f(ax)} ${f(ay + 2.2)} Z" fill="var(--bestia-dracula-papel)"/>`;
  }
  return `<g filter="url(#gubia)">${s}</g>`;
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 1.6;
const O = A.ojos;
const [RX0, RY0] = [HUECO[3]![0] - 6, HUECO[3]![1] - 8];
const [RX1] = [HUECO[1]![0] + 6];

export const PIEZAS_REO: readonly Pieza[] = [
  { nombre: 'reo-charco', caja: [-134, -30, 268, 52], dibujo: charco(), densidad: D },
  { nombre: 'reo-charco-ojos', caja: [-36, -18, 72, 20], dibujo: charcoOjos(), densidad: D * 2 },
  { nombre: 'reo-piernas', caja: [-72, -214, 144, 218], dibujo: piernas(), densidad: D },
  { nombre: 'reo-chorreado', caja: [-72, A.ruedo - 2, 144, 84], dibujo: chorreado(), densidad: D },
  { nombre: 'reo-torso', caja: [-96, -362, 192, 162], dibujo: torso(), densidad: D },
  { nombre: 'reo-brazo-1', caja: [-124, -444, 72, 134], dibujo: brazo(0), densidad: D },
  { nombre: 'reo-brazo-2', caja: [52, -444, 72, 134], dibujo: brazo(1), densidad: D },
  { nombre: 'reo-cabeza', caja: [-60, -490, 120, 162], dibujo: cabeza(), densidad: D * 1.3 },
  { nombre: 'reo-pupila-1', caja: [O[0].centro[0] - 6, O[0].centro[1] - 6, 12, 12], dibujo: pupila(0), densidad: D * 2.4 },
  { nombre: 'reo-pupila-2', caja: [O[1].centro[0] - 6, O[1].centro[1] - 6, 12, 12], dibujo: pupila(1), densidad: D * 2.4 },
  { nombre: 'reo-parpado-1', caja: [O[0].centro[0] - 12, O[0].centro[1] - 10, 24, 20], dibujo: parpado(0), densidad: D * 2 },
  { nombre: 'reo-parpado-2', caja: [O[1].centro[0] - 12, O[1].centro[1] - 10, 24, 20], dibujo: parpado(1), densidad: D * 2 },
  { nombre: 'reo-ceja-1', caja: [A.cejas[0][0] - 16, A.cejas[0][1] - 10, 32, 18], dibujo: ceja(0), densidad: D * 2 },
  { nombre: 'reo-ceja-2', caja: [A.cejas[1][0] - 16, A.cejas[1][1] - 10, 32, 18], dibujo: ceja(1), densidad: D * 2 },
  { nombre: 'reo-jopo', caja: [A.jopo[0] - 44, A.jopo[1] - 28, 92, 66], dibujo: jopo(), densidad: D * 1.4 },
  { nombre: 'reo-boca', caja: [A.boca[0] - 26, A.boca[1] - 10, 52, 22], dibujo: boca(), densidad: D * 2 },
  { nombre: 'reo-dientes', caja: [A.boca[0] - 24, A.boca[1] - 10, 48, 20], dibujo: dientes(), densidad: D * 2 },
  { nombre: 'reo-gotas', caja: [-52, -480, 104, 76], dibujo: gotas(), densidad: D * 1.6 },
  { nombre: 'reo-reja', caja: [RX0, RY0, RX1 - RX0, 660 - RY0], dibujo: reja(), densidad: 1.8 },
];

const img = imagenesDe(PIEZAS_REO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El reo armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    parte('charco', img('reo-charco') + parte('charco-ojos', img('reo-charco-ojos'), '', o['charco-ojos']), t.charco, o.charco) +
    parte('figura',
      img('reo-piernas') +
      parte('chorrea', img('reo-chorreado'), t.chorrea, o.chorrea) +
      parte('torso', img('reo-torso'), t.torso) +
      parte('cabeza',
        img('reo-cabeza') +
        parte('pupila-1', img('reo-pupila-1'), t['pupila-1']) +
        parte('pupila-2', img('reo-pupila-2'), t['pupila-2']) +
        parte('parpado-1', img('reo-parpado-1'), t['parpado-1']) +
        parte('parpado-2', img('reo-parpado-2'), t['parpado-2']) +
        parte('ceja-1', img('reo-ceja-1'), t['ceja-1']) +
        parte('ceja-2', img('reo-ceja-2'), t['ceja-2']) +
        parte('boca', img('reo-boca'), t.boca) +
        parte('dientes', img('reo-dientes'), '', o.dientes) +
        parte('jopo', img('reo-jopo'), t.jopo) +
        parte('gotas', img('reo-gotas'), t.gotas, o.gotas),
        t.cabeza) +
      parte('brazo-1', img('reo-brazo-1'), t['brazo-1']) +
      parte('brazo-2', img('reo-brazo-2'), t['brazo-2']),
      t.figura)
  );
}

/** Lo de adentro de la celda se ve por el hueco: lo de afuera es pared. */
const RECORTE = `<clipPath id="reo-hueco"><path d="${poli(HUECO)}"/></clipPath>`;

/** El reo en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function reoEn(m: Momento = QUIETO): string {
  return `${RECORTE}<g clip-path="url(#reo-hueco)"><g transform="${marcas(m).transform.entero}">${armado(m)}</g></g>${img('reo-reja')}`;
}

/** El títere que se toca, en la pose quieta: agarrado a la reja, sudando, y la reja delante. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    RECORTE +
    `<g clip-path="url(#reo-hueco)">` +
    `<g class="titere titere--reo" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El reo semental'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g></g>` +
    `<g pointer-events="none">${img('reo-reja')}</g>`
  );
}

/** El retrato de la ficha: su celda, con él a medio licuar y la reja delante. El fondo es el de la prisión. */
export const RETRATO = { caja: [REO.x - 84, HUECO[3]![1] - 6, 168, 640 - HUECO[3]![1] + 6] as const };
function retrato(): string {
  return `<image href="/bestiario/prision-lejos.webp" x="${SALA.x}" y="0" width="${SALA.ancho}" height="640" preserveAspectRatio="none"/>` + reoEn(LICUADO);
}

export const REO_PERSONAJE: Personaje = {
  id: ID,
  region: 'la-prision',
  ancla: REO.x,
  piezas: PIEZAS_REO,
  capas: { atras: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};

/** El puño de cada brazo, en el recinto: el test mira que caigan entre dos barrotes de la reja. */
export const PUNIOS_EN_EL_RECINTO: readonly Punto[] = A.punios.map((p) => [REO.x + p[0] * REO.escala, REO.piso + p[1] * REO.escala]);
export { alTitere };
