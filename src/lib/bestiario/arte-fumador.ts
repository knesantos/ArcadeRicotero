/**
 * El santo fumador (`D-73`, vigésima vuelta), dormido en su anda en el ala izquierda del templo de Momo.
 *
 * *"Santo fumador, de allá de La Plata, salí del letargo, vení a desfilar"* es de *Templo de Momo*, en
 * *Momo sampler* (2000), el disco del templo. Por eso está fundido en la plata del medallón de la tapa,
 * medida con sharp, con el oro de las letras del interior en la aureola y el rosa de esas letras en la
 * flor chillona; el humo es la máscara del interior donde le pega la luz. Y es de plata porque es de La
 * Plata.
 *
 * De la letra son el santo, el pucho, el letargo, el desfile, la flor chillona y el galpón de luz. Del
 * dibujo, todo lo demás: que la aureola es un tubo de luz de galpón que titila, que el pucho lo tiene en
 * la mano de la bendición, entre los dos dedos, y que duerme parado en el anda de una procesión, esperando
 * que lo carguen.
 *
 * Coordenadas: el (0, 0) es el piso en el medio del anda (`rig-fumador.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { caja, cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { ANILLOS, DESFILE, FUMADOR, FUMADOR_ARMADO as A, QUIETO, marcas, type Momento } from './rig-fumador.ts';

/** Las tintas de *Momo sampler* (`tokens.css`). */
const C = {
  plataHonda: 'var(--bestia-fumador-plata-honda)',
  plata: 'var(--bestia-fumador-plata)',
  plataClara: 'var(--bestia-fumador-plata-clara)',
  lomo: 'var(--bestia-fumador-lomo)',
  brillo: 'var(--bestia-fumador-brillo)',
  hondo: 'var(--bestia-fumador-hondo)',
  humo: 'var(--bestia-fumador-humo)',
  humoClaro: 'var(--bestia-fumador-humo-claro)',
  oro: 'var(--bestia-fumador-oro)',
  oroClaro: 'var(--bestia-fumador-oro-claro)',
  cobre: 'var(--bestia-fumador-cobre)',
  flor: 'var(--bestia-fumador-flor)',
  florClara: 'var(--bestia-fumador-flor-clara)',
  florHonda: 'var(--bestia-fumador-flor-honda)',
};

/** Un espiral de los del lomo de *Momo sampler*, repujado. */
function espiral(x: number, y: number, r: number, color: string): string {
  let d = `M${x} ${y}`;
  for (let i = 1; i <= 24; i++) {
    const a = i * 0.5;
    const rr = (r * i) / 24;
    d += ` L${(x + Math.cos(a) * rr).toFixed(2)} ${(y + Math.sin(a) * rr).toFixed(2)}`;
  }
  return trazo(d, color, 1.1, 0.9);
}

/** Una flor chillona: seis pétalos rosados abiertos de más, con el corazón de oro. */
function florChillona(x: number, y: number, r: number, giro = 0): string {
  const petalos = Array.from({ length: 6 }, (_, i) => {
    const a = giro + (i / 6) * Math.PI * 2;
    const [px, py] = [x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62];
    return `<ellipse cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" rx="${(r * 0.52).toFixed(2)}" ry="${(r * 0.3).toFixed(2)}" transform="rotate(${((a * 180) / Math.PI).toFixed(1)} ${px.toFixed(2)} ${py.toFixed(2)})" fill="${i % 2 ? C.flor : C.florClara}"/>`;
  }).join('');
  return petalos + nube(x + r * 0.3, y + r * 0.3, r * 0.6, r * 0.5, C.florHonda, 's', 0.6) + forma(elipse(x, y, r * 0.28, r * 0.28), C.oro) + nube(x - r * 0.08, y - r * 0.1, r * 0.12, r * 0.12, C.oroClaro, 'xs', 0.9);
}

/* ------------------------------------------------------------------
   El anda y el pedestal
   ------------------------------------------------------------------ */

function anda(): string {
  const { y, ancho, varas } = A.anda;
  const w = ancho / 2;
  const frente = caja(-w, y, ancho, 30);
  // Las varas para cargarla, de punta a punta, con los regatones de oro.
  const vara = forma(cajaRedonda(-varas, y + 10, varas * 2, 7, 3), C.hondo) + forma(caja(-varas, y + 10, 10, 7), C.oro) + forma(caja(varas - 10, y + 10, 10, 7), C.oro) + trazo(`M${-varas} ${y + 11} l${varas * 2} 0`, C.plataClara, 0.6, 0.5);
  const patas = [-w + 6, w - 14].map((x) => forma(caja(x, y + 30, 8, -y - 30), C.hondo)).join('');
  const repujado = [-44, -14, 16, 46].map((x, i) => espiral(x, y + 15, 8, i % 2 ? C.oro : C.lomo)).join('');
  const { y: py, ancho: pw } = A.pedestal;
  const pedestal = caja(-pw / 2, py, pw, y - py);
  return conGrano(
    vara + patas +
    enmascarado('m-fum-anda', frente, forma(frente, C.plata) + nube(-w * 0.4, y + 6, w * 0.6, 10, C.lomo, 'm', 0.6) + nube(w * 0.6, y + 24, w * 0.5, 14, C.plataHonda, 'm', 0.8) + repujado) +
    forma(caja(-w - 3, y - 3, ancho + 6, 5), C.oro) + nube(-w * 0.5, y - 2, 20, 2, C.oroClaro, 'xs', 0.7) +
    enmascarado('m-fum-pedestal', pedestal, forma(pedestal, C.plataHonda) + nube(-pw * 0.2, py + 8, pw * 0.3, 12, C.plataClara, 'm', 0.6) + nube(pw * 0.4, py + 20, 10, 14, C.hondo, 's', 0.7)) +
    forma(caja(-pw / 2 - 2, py - 3, pw + 4, 4), C.lomo) + trazo(`M${-pw / 2} ${py + 12} l${pw} 0`, C.oro, 1.2, 0.8) +
    // Pura flor chillona: en las cuatro puntas del anda.
    florChillona(-w + 4, y - 6, 9, 0.3) + florChillona(w - 4, y - 6, 9, 1.1) + florChillona(-w + 20, y - 4, 6, 0.8) + florChillona(w - 20, y - 4, 6, 0.1),
  );
}

/* ------------------------------------------------------------------
   El santo: la túnica de plata, el manto y la cabeza
   ------------------------------------------------------------------ */

const TUNICA: readonly P[] = [[-24, -204], [-34, -194], [-36, -160], [-38, -120], [-42, -76], [-20, -72], [0, -74], [20, -72], [42, -76], [38, -120], [36, -160], [34, -194], [24, -204]];

function cuerpo(): string {
  const d = curva(TUNICA);
  // Los pliegues de la túnica: canales hondos y lomos que agarran la luz del templo, de arriba a la izquierda.
  const pliegues = [-28, -14, 0, 14, 28].map((x, i) => nube(x + 2, -110, 3, 42, i % 2 ? C.plataHonda : C.lomo, 's', i % 2 ? 0.8 : 0.55, x * 0.15)).join('');
  // El manto oscuro, cruzado del hombro izquierdo a la cadera derecha, con el ribete de oro.
  const manto = curva([[-30, -198], [-14, -204], [6, -180], [28, -140], [38, -110], [30, -100], [10, -128], [-12, -160], [-30, -180]]);
  const ribete = trazo('M-14 -204 C 4 -182 24 -146 38 -110', C.oro, 1.8) + trazo('M-30 -180 C -10 -158 10 -128 30 -100', C.oro, 1.2, 0.7);
  const cordon = trazo('M-34 -152 Q0 -144 34 -152', C.cobre, 2.4) + trazo('M-4 -148 l-3 26 M2 -148 l2 22', C.cobre, 1.8) + forma(elipse(-7, -120, 2.4, 3), C.oro) + forma(elipse(4, -124, 2.4, 3), C.oro);
  const pies = [-10, 10].map((x) => forma(curva([[x - 7, -72], [x + 7, -72], [x + 8, -68], [x - 8, -68]]), C.plataClara) + trazo(`M${x - 5} -71 l10 0`, C.cobre, 0.8, 0.8)).join('');
  return conGrano(
    pies +
    enmascarado('m-fum-tunica', d,
      forma(d, C.plata) + nube(-18, -180, 18, 22, C.lomo, 'm', 0.7) + nube(-20, -184, 6, 8, C.brillo, 's', 0.6) + nube(26, -120, 16, 60, C.plataHonda, 'm', 0.85) + nube(0, -74, 50, 10, C.hondo, 'm', 0.6) + pliegues +
      enmascarado('m-fum-manto', manto, forma(manto, C.hondo) + nube(-16, -190, 10, 8, C.humo, 's', 0.45) + nube(24, -120, 10, 20, C.hondo, 's', 0.9)) + ribete + cordon) +
    // El cuello, en la sombra de la barba.
    forma(caja(-6, -212, 12, 10), C.plataHonda),
  );
}

const CARA: readonly P[] = [[0, -252], [13, -246], [17, -230], [14, -214], [6, -206], [0, -205], [-6, -206], [-14, -214], [-17, -230], [-13, -246]];

function cabeza(): string {
  const d = curva(CARA);
  const [cx, cy] = A.cara;
  // La tonsura: la corona de pelo de los frailes, con la pelada que brilla arriba.
  const pelo = curva([[-17, -236], [-19, -248], [-12, -258], [0, -261], [12, -258], [19, -248], [17, -236], [12, -244], [0, -248], [-12, -244]]);
  const barba = curva([[-13, -218], [-6, -212], [0, -213], [6, -212], [13, -218], [11, -206], [4, -198], [-4, -198], [-11, -206]]);
  // La boca chica, torcida para el lado del pucho, y la nariz de yeso.
  const boca = trazo(`M${cx - 4} ${cy + 14} Q${cx + 1} ${cy + 16} ${cx + 6} ${cy + 12}`, C.hondo, 1.6) + nube(cx + 1, cy + 15, 4, 1.4, C.florHonda, 'xs', 0.5);
  const nariz = trazo(`M${cx} ${cy - 6} L${cx - 2} ${cy + 6} L${cx + 2} ${cy + 7}`, C.plataHonda, 1.2, 0.8);
  const adentro =
    forma(d, C.plata) +
    nube(cx - 6, cy - 10, 10, 10, C.lomo, 'm', 0.8) + nube(cx - 8, cy - 12, 4, 4, C.brillo, 's', 0.6) +
    nube(cx + 12, cy + 4, 6, 14, C.plataHonda, 'm', 0.85) +
    // Los cachetes colorados del que fuma y no duerme bien.
    nube(cx - 9, cy + 6, 4, 3, C.flor, 's', 0.35) + nube(cx + 9, cy + 6, 4, 3, C.flor, 's', 0.3) +
    // Las ojeras, debajo de donde van los ojos.
    nube(cx - 8, cy + 1, 5, 2, C.hondo, 's', 0.5) + nube(cx + 8, cy + 1, 5, 2, C.hondo, 's', 0.5) +
    nariz + boca;
  return conGrano(
    enmascarado('m-fum-cara', d, adentro) +
    enmascarado('m-fum-barba', barba, forma(barba, C.plataHonda) + nube(-4, -206, 6, 6, C.plata, 's', 0.6) + [-6, -2, 2, 6].map((x) => trazo(`M${x} -210 l${x * 0.1} 10`, C.hondo, 0.6, 0.7)).join('')) +
    enmascarado('m-fum-pelo', pelo, forma(pelo, C.plataHonda) + nube(-10, -252, 8, 4, C.plata, 's', 0.6)) +
    // La pelada, arriba, que brilla como el medallón.
    forma(elipse(0, -252, 11, 6), C.lomo) + nube(-3, -254, 5, 2, C.brillo, 's', 0.9),
  );
}

/** Los ojos pintados de los santos: mirando para arriba, con el iris de oro. Solo se ven cuando despierta. */
function ojos(): string {
  return A.ojos.map(([x, y]) => forma(elipse(x, y, 4.6, 3), C.brillo) + forma(elipse(x, y - 1, 2.2, 2.2), C.oro) + forma(elipse(x, y - 1.2, 1, 1), C.hondo) + nube(x - 0.8, y - 2, 0.7, 0.6, C.brillo, 'xs', 0.9)).join('');
}

/** Un párpado de yeso, pesado, con la raya de las pestañas abajo. */
function parpado(n: 0 | 1): string {
  const [x, y] = A.ojos[n];
  const d = `M${x - 5.6} ${y - 4} Q${x} ${y - 6} ${x + 5.6} ${y - 4} L${x + 5.6} ${y + 0.5} Q${x} ${y + 3.4} ${x - 5.6} ${y + 0.5} Z`;
  return conGrano(forma(d, C.plata) + nube(x - 1, y - 3, 4, 1.4, C.lomo, 'xs', 0.6) + trazo(`M${x - 5.4} ${y + 0.6} Q${x} ${y + 3.4} ${x + 5.4} ${y + 0.6}`, C.hondo, 1));
}

/** La aureola: un tubo de luz de galpón doblado en óvalo, con los dos bornes y el alambre que la tiene. */
function aureola(): string {
  const { centro: [cx, cy], rx, ry } = A.aureola;
  const arco = `M${cx + 6} ${cy + ry} A${rx} ${ry} 0 1 0 ${cx - 6} ${cy + ry}`;
  const borne = (x: number): string => forma(cajaRedonda(x - 3, cy + ry - 4, 6, 8, 2), C.plataHonda) + trazo(`M${x} ${cy + ry + 4} l0 4`, C.cobre, 1);
  return (
    trazo(`M${cx} ${cy + ry} L${cx} ${cy + ry + 14}`, C.plataHonda, 1.6) +
    `<path d="${arco}" fill="none" stroke="${C.oro}" stroke-width="9" opacity="0.35" filter="url(#soplo-s)"/>` +
    `<path d="${arco}" fill="none" stroke="${C.oro}" stroke-width="4.2" stroke-linecap="round"/>` +
    `<path d="${arco}" fill="none" stroke="${C.oroClaro}" stroke-width="1.6" stroke-linecap="round"/>` +
    borne(cx + 6) + borne(cx - 6)
  );
}

/** Cuando la aureola encandila: el resplandor del tubo prendido de más. */
function encandila(): string {
  const { centro: [cx, cy] } = A.aureola;
  return nube(cx, cy, 70, 64, C.oro, 'xl', 0.55) + nube(cx, cy, 40, 36, C.oroClaro, 'l', 0.5);
}

/* ------------------------------------------------------------------
   Los brazos, la flor y el pucho
   ------------------------------------------------------------------ */

function manga(n: 0 | 1): string {
  const [sx, sy] = A.hombros[n];
  const [hx, hy] = A.manos[n];
  const s = n === 0 ? -1 : 1;
  // El brazo de la flor cuelga; el de la bendición se dobla para arriba, con el codo afuera.
  const codo: P = n === 0 ? [sx - 10, sy + 30] : [sx + 18, sy + 18];
  const M = curva([[sx - 9, sy - 6], [sx + 9, sy - 4], [codo[0] + s * 4 + 8, codo[1] + 6], [hx + 8, hy + (n ? 8 : -2)], [hx - 6, hy + (n ? 10 : -4)], [codo[0] - 8 + s * -2, codo[1] - 4]]);
  // La mano de yeso: la de la bendición con dos dedos para arriba, que es donde tiene el pucho.
  const mano = n === 0
    ? curva([[hx - 6, hy - 6], [hx + 6, hy - 6], [hx + 7, hy + 4], [hx, hy + 8], [hx - 6, hy + 4]])
    : curva([[hx - 6, hy + 6], [hx - 5, hy - 2], [hx - 3, hy - 14], [hx - 0.5, hy - 14], [hx, hy - 4], [hx + 2, hy - 15], [hx + 4.5, hy - 15], [hx + 5, hy - 2], [hx + 7, hy + 6]]);
  return conGrano(
    enmascarado(`m-fum-manga-${n}`, M, forma(M, C.plata) + nube(sx + s * 4, sy + 10, 8, 16, C.lomo, 'm', n ? 0.4 : 0.6) + nube(codo[0], codo[1] + 6, 10, 12, C.plataHonda, 'm', 0.75)) +
    enmascarado(`m-fum-mano-${n}`, mano, forma(mano, C.plataClara) + nube(hx - 2, hy - 4, 4, 4, C.lomo, 's', 0.7) + nube(hx + 4, hy + 4, 4, 4, C.plataHonda, 's', 0.7)),
  );
}

function flor(): string {
  const [hx, hy] = A.manos[0];
  return conGrano(trazo(`M${hx} ${hy + 6} Q${hx - 4} ${hy + 30} ${hx - 2} ${hy + 44}`, C.hondo, 2) + forma(curva([[hx - 2, hy + 22], [hx - 14, hy + 18], [hx - 4, hy + 28]]), C.hondo) + florChillona(hx - 2, hy - 14, 15, 0.4));
}

/** El pucho: el cigarrillo entre los dos dedos de la bendición, con la boquilla para el lado de la cara. */
function pucho(): string {
  const [qx, qy] = A.boquilla;
  const [bx, by] = A.brasa;
  return conGrano(trazo(`M${qx} ${qy} L${bx - 2} ${by + 0.3}`, C.brillo, 3.4) + trazo(`M${qx} ${qy} L${qx + 6} ${qy - 0.4}`, C.florHonda, 3.4) + trazo(`M${qx + 2} ${qy - 1.4} L${bx - 3} ${by - 1}`, C.lomo, 0.6, 0.6));
}

/** La brasa en la punta, y la ceniza que crece para afuera (se estira desde la brasa). */
function brasa(): string {
  const [bx, by] = A.brasa;
  return nube(bx, by, 6, 6, C.florClara, 's', 0.6) + forma(elipse(bx, by + 0.2, 2, 1.8), C.cobre) + forma(elipse(bx + 0.6, by + 0.2, 1.2, 1.1), C.oro) + nube(bx + 0.6, by, 2, 2, C.oroClaro, 'xs', 0.9);
}
function ceniza(): string {
  const [bx, by] = A.brasa;
  return forma(cajaRedonda(bx + 1, by - 1.6, 12, 3.4, 1.4), C.plataHonda) + trazo(`M${bx + 3} ${by - 1} l8 0`, C.humo, 0.6, 0.7);
}

/** El hilo de humo que sube de la brasa, retorcido. */
function hilo(): string {
  const [bx, by] = A.brasa;
  const d = `M${bx} ${by - 2} C${bx - 6} ${by - 16} ${bx + 8} ${by - 26} ${bx + 1} ${by - 40} C${bx - 6} ${by - 52} ${bx + 6} ${by - 60} ${bx} ${by - 74}`;
  return `<path d="${d}" fill="none" stroke="${C.humoClaro}" stroke-width="2.2" opacity="0.7" filter="url(#soplo-xs)"/>` + `<path d="${d}" fill="none" stroke="${C.humo}" stroke-width="6" opacity="0.3" filter="url(#soplo-s)"/>`;
}

/** Un anillo de humo de los que larga cuando pita: un óvalo soplado. */
function anillo(): string {
  return `<ellipse cx="0" cy="0" rx="13" ry="7" fill="none" stroke="${C.humoClaro}" stroke-width="3" opacity="0.8" filter="url(#soplo-xs)"/>` + `<ellipse cx="0" cy="0" rx="13" ry="7" fill="none" stroke="${C.humo}" stroke-width="7" opacity="0.35" filter="url(#soplo-s)"/>`;
}

/** Una pizca de ceniza que se cae. */
function pizca(): string {
  return forma(cajaRedonda(-5, -1.6, 10, 3.2, 1.4), C.plataHonda) + trazo('M-3 -0.6 l6 0', C.humo, 0.6, 0.7);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.4;
const { centro: [AX, AY], rx: ARX, ry: ARY } = A.aureola;
const [M1x, M1y] = A.manos[0];
const [M2x, M2y] = A.manos[1];
const [BX, BY] = A.brasa;

export const PIEZAS_FUMADOR: readonly Pieza[] = [
  { nombre: 'fumador-anillo', caja: [-22, -16, 44, 32], dibujo: anillo(), densidad: 3 },
  { nombre: 'fumador-encandila', caja: [AX - 110, AY - 100, 220, 200], dibujo: encandila(), densidad: 1 },
  { nombre: 'fumador-aureola', caja: [AX - ARX - 12, AY - ARY - 12, (ARX + 12) * 2, (ARY + 12) * 2 + 16], dibujo: aureola(), densidad: D },
  { nombre: 'fumador-anda', caja: [-A.anda.varas - 4, A.pedestal.y - 18, A.anda.varas * 2 + 8, -A.pedestal.y + 20], dibujo: anda(), densidad: D * 0.8 },
  { nombre: 'fumador-cuerpo', caja: [-46, -216, 92, 150], dibujo: cuerpo(), densidad: D },
  { nombre: 'fumador-cabeza', caja: [-24, -266, 48, 72], dibujo: cabeza(), densidad: D * 1.3 },
  { nombre: 'fumador-ojos', caja: [-16, -238, 32, 12], dibujo: ojos(), densidad: D * 2 },
  { nombre: 'fumador-parpado-1', caja: [A.ojos[0][0] - 7, A.ojos[0][1] - 8, 14, 13], dibujo: parpado(0), densidad: D * 2 },
  { nombre: 'fumador-parpado-2', caja: [A.ojos[1][0] - 7, A.ojos[1][1] - 8, 14, 13], dibujo: parpado(1), densidad: D * 2 },
  { nombre: 'fumador-brazo-1', caja: [M1x - 18, A.hombros[0][1] - 12, 48, 76], dibujo: manga(0), densidad: D },
  { nombre: 'fumador-flor', caja: [M1x - 22, M1y - 34, 40, 86], dibujo: flor(), densidad: D },
  { nombre: 'fumador-brazo-2', caja: [A.hombros[1][0] - 14, M2y - 22, 50, 64], dibujo: manga(1), densidad: D },
  { nombre: 'fumador-pucho', caja: [A.boquilla[0] - 4, BY - 6, BX - A.boquilla[0] + 6, 12], dibujo: pucho(), densidad: D * 2 },
  { nombre: 'fumador-ceniza', caja: [BX, BY - 4, 16, 8], dibujo: ceniza(), densidad: D * 2 },
  { nombre: 'fumador-brasa', caja: [BX - 8, BY - 8, 16, 16], dibujo: brasa(), densidad: D * 2 },
  { nombre: 'fumador-hilo', caja: [BX - 14, BY - 82, 28, 84], dibujo: hilo(), densidad: 2.4 },
  { nombre: 'fumador-pizca', caja: [-7, -4, 14, 8], dibujo: pizca(), densidad: D * 2 },
];

const img = imagenesDe(PIEZAS_FUMADOR);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Los anillos de humo, en el recinto. */
function anillos(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return Array.from({ length: ANILLOS }, (_, i) => parte(`anillo-${i + 1}`, img('fumador-anillo'), t[`anillo-${i + 1}`], o[`anillo-${i + 1}`])).join('');
}

/** El santo y su anda, armados con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    parte('sombra', `<ellipse cx="0" cy="2" rx="${A.anda.varas}" ry="12" class="bt-fumador-sombra"/>`, t.sombra) +
    parte('anda',
      img('fumador-anda') +
      parte('santo',
        parte('encandila', img('fumador-encandila'), '', o.encandila) +
        parte('aureola', img('fumador-aureola'), '', o.aureola) +
        img('fumador-cuerpo') +
        parte('cabeza',
          img('fumador-cabeza') + parte('ojos', img('fumador-ojos'), '', o.ojos) +
          parte('parpado-1', img('fumador-parpado-1'), t['parpado-1']) + parte('parpado-2', img('fumador-parpado-2'), t['parpado-2']),
          t.cabeza) +
        parte('brazo-1', img('fumador-brazo-1') + img('fumador-flor'), t['brazo-1']) +
        parte('brazo-2', img('fumador-brazo-2') + img('fumador-pucho') + parte('ceniza', img('fumador-ceniza'), t.ceniza) + parte('brasa', img('fumador-brasa'), t.brasa), t['brazo-2']) +
        parte('hilo', img('fumador-hilo'), t.hilo, o.hilo) +
        parte('cae', img('fumador-pizca'), t.cae, o.cae),
        t.santo),
      t.anda)
  );
}

/** El santo fumador en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function fumadorEn(m: Momento = QUIETO): string {
  return anillos(m) + `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: dormido en su anda, con el pucho. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--fumador" data-id="el-santo-fumador" role="button" tabindex="0" aria-label="${nombres.get('el-santo-fumador') ?? 'El santo fumador de La Plata'}">` +
    anillos(QUIETO) +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: despierto, con el anda en alto, desfilando. */
export const RETRATO = { caja: [FUMADOR.x - 74, FUMADOR.piso - 210, 148, 222] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="-300" y="0" width="1500" height="640" preserveAspectRatio="none"/>`;
  return fondo('templo-lejos') + fumadorEn(DESFILE);
}

export const FUMADOR_PERSONAJE: Personaje = {
  id: 'el-santo-fumador',
  region: 'el-templo',
  ancla: FUMADOR.x,
  piezas: PIEZAS_FUMADOR,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
