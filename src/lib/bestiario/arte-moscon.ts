/**
 * El moscón zumbón (`D-73`, vigesimosexta vuelta), atrapado en un vaso boca abajo en la punta de la mesa.
 *
 * *"Sos un moscón zumbón / Que quedó atrapado / En un vaso boca abajo"* es de *Murga purga*, en *Luzbelito* (1996).
 * Se toma al pie de la letra: un vaso de los de la mesa, dado vuelta, y adentro un moscón de los grandes, de los
 * de carne: gordo, peludo, con el tórax de bronce y el abdomen negro con el brillo de aceite, los ojos rojos
 * compuestos que le ocupan toda la cabeza, la trompa de esponja y las alas de vidrio. El vaso ya tiene lo que le
 * dejó: el vidrio empañado del lado donde respira, los rayones de tanto pegarle, y la marca de vino que quedó en el
 * mantel cuando lo dieron vuelta. Zumba, se da contra el vidrio, cae mareado, se frota las patas y vuelve a
 * empezar. Nadie lo oye.
 *
 * De la letra son el moscón, el vaso boca abajo y el estar atrapado. Del dibujo son el vaho, los rayones, la
 * mancha de vino y las estrellitas del golpe.
 *
 * Viste *Luzbelito*, medido con sharp: el vaso es el mármol verde de la tapa, el moscón el negro del cuero y el
 * bronce del marco ovalado, el brillo del abdomen el oro de LUZBELITO, los ojos el mar rojo del interior, las alas
 * los morados de su cielo, el vaho su nube, y el vino, lo hondo del mar.
 *
 * Coordenadas: el (0, 0) es el mantel en el medio de la boca del vaso (`rig-moscon.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { GOLPEA, MOSCON, MOSCON_ARMADO as A, QUIETO, VASO, marcas, type Momento } from './rig-moscon.ts';

const ID = 'el-moscon-zumbon';

/** Las tintas de *Luzbelito* (`tokens.css`). */
const C = {
  verde: 'var(--bestia-moscon-verde)',
  verdeHondo: 'var(--bestia-moscon-verde-hondo)',
  verdeClaro: 'var(--bestia-moscon-verde-claro)',
  negro: 'var(--bestia-moscon-negro)',
  bronce: 'var(--bestia-moscon-bronce)',
  bronceHondo: 'var(--bestia-moscon-bronce-hondo)',
  oro: 'var(--bestia-moscon-oro)',
  oroClaro: 'var(--bestia-moscon-oro-claro)',
  pelo: 'var(--bestia-moscon-pelo)',
  vela: 'var(--bestia-moscon-vela)',
  rojo: 'var(--bestia-moscon-rojo)',
  rojoVivo: 'var(--bestia-moscon-rojo-vivo)',
  morado: 'var(--bestia-moscon-morado)',
  lila: 'var(--bestia-moscon-lila)',
  nube: 'var(--bestia-moscon-nube)',
  llama: 'var(--bestia-moscon-llama)',
  vino: 'var(--bestia-moscon-vino)',
};

const { boca: B, culo: K, alto: H, vidrio: V } = VASO;

/** La silueta del vaso boca abajo: la boca abajo, apoyada, y el culo arriba, un poco más angosto. */
const SILUETA = `M${-B} 0 L${-K} ${-H + 6} Q${-K} ${-H} ${-K + 6} ${-H} L${K - 6} ${-H} Q${K} ${-H} ${K} ${-H + 6} L${B} 0 Z`;
/** Lo de adentro del vidrio: donde vive el moscón. */
const ADENTRO = `M${-B + V} 0 L${-K + V} ${-H + V + 4} Q${-K + V} ${-H + V} ${-K + V + 4} ${-H + V} L${K - V - 4} ${-H + V} Q${K - V} ${-H + V} ${K - V} ${-H + V + 4} L${B - V} 0 Z`;

/* ------------------------------------------------------------------
   El mantel debajo: la marca de vino y la sombra del vaso
   ------------------------------------------------------------------ */

function sombra(): string {
  return nube(6, 4, B + 10, 7, C.morado, 'm', 0.5) +
    // El aro de vino que dejó el vaso cuando lo dieron vuelta, y una gota que corrió.
    trazo(`M${-B - 4} 2 Q0 12 ${B + 4} 2`, C.vino, 2.6, 0.7) + trazo(`M${-B - 2} 3 Q0 -5 ${B + 2} 3`, C.vino, 1.4, 0.5) + nube(B + 10, 6, 5, 3, C.vino, 's', 0.7);
}

/** El fondo del vaso: la pared de atrás del vidrio, con su tinte verde y el reflejo del seguidor. */
function vasoFondo(): string {
  return conGrano(enmascarado('m-moscon-fondo', SILUETA, forma(SILUETA, C.verdeHondo, 0.14) + nube(-K + 10, -H * 0.5, 6, H * 0.4, C.verdeClaro, 'm', 0.3) + nube(0, -H + 8, K, 6, C.verde, 's', 0.45)));
}

/* ------------------------------------------------------------------
   El moscón: las patas, el cuerpo, las alas y la cabeza
   ------------------------------------------------------------------ */

/** Un par de patas: la de este lado y la del otro, de la coxa al tarso con los pelitos. */
function patas(n: 0 | 1): string {
  const pata = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, tinta: string): string =>
    trazo(`M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}`, tinta, 1.8) + trazo(`M${f(x1)} ${f(y1)} l-1 -3 M${f((x1 + x2) / 2)} ${f((y1 + y2) / 2)} l-1.5 -2`, tinta, 0.7, 0.8) +
    trazo(`M${f(x2)} ${f(y2)} l2 1 l-3 1`, tinta, 1);
  if (n === 0) {
    // Las de atrás y las del medio, de los dos lados.
    return pata(-6, -10, -16, -22, -22, 0, C.negro) + pata(-2, -9, -2, -24, 6, 0, C.negro) + pata(-8, -12, -20, -18, -26, -2, C.bronceHondo) + pata(-4, -12, 0, -22, 10, -2, C.bronceHondo);
  }
  // Las de adelante, que se frotan: salen de la coxa y suben a la trompa.
  const [px, py] = A.patasDel;
  return pata(px, py, px + 12, py - 12, px + 20, py - 2, C.negro) + pata(px - 1, py - 2, px + 10, py - 14, px + 18, py - 6, C.bronceHondo);
}

/** El abdomen: negro con el brillo de aceite, los anillos y los pelos duros. */
function abdomen(): string {
  const d = curva([[2, -14], [-8, -20], [-20, -18], [-26, -10], [-20, -2], [-8, -2]]);
  const rnd = (i: number): number => ((i * 7919) % 97) / 97;
  let pelos = '';
  for (let i = 0; i < 16; i++) pelos += trazo(`M${f(-24 + rnd(i) * 26)} ${f(-20 + rnd(i + 3) * 6)} l${f(-1 + rnd(i + 5) * 2)} -4`, C.pelo, 0.8, 0.8);
  return conGrano(
    enmascarado('m-moscon-abdomen', d, forma(d, C.negro) + nube(-12, -14, 10, 4, C.oro, 's', 0.45) + nube(-14, -6, 10, 4, C.bronceHondo, 's', 0.6) +
      [-6, -12, -18].map((x) => trazo(`M${x} -19 q-2 9 0 17`, C.oroClaro, 0.8, 0.5)).join('') + nube(-10, -16, 4, 2, C.oroClaro, 'xs', 0.7)) + pelos,
  );
}

/** El tórax: de bronce, jorobado, con los pelos tiesos y el escudete. */
function torax(): string {
  const d = curva([[14, -10], [12, -22], [2, -27], [-8, -22], [-8, -8], [2, -4]]);
  return conGrano(
    enmascarado('m-moscon-torax', d, forma(d, C.bronce) + nube(2, -22, 7, 4, C.oro, 's', 0.6) + nube(0, -8, 8, 4, C.bronceHondo, 's', 0.8) + trazo('M-4 -24 q6 -2 12 0 M-6 -16 q8 -2 16 0', C.bronceHondo, 0.8, 0.6)) +
    [-6, -2, 2, 6, 10].map((x) => trazo(`M${x} -25 l0.5 -4`, C.pelo, 0.9, 0.9)).join(''),
  );
}

/** Un ala de vidrio, lila, con las venas, que gira en la raíz. */
function ala(n: 0 | 1): string {
  const [ax, ay] = A.alas;
  const s = n ? 1 : -1;
  const d = curva([[ax, ay], [ax - 14, ay - 4 * s - 2], [ax - 30, ay - 6 * s - 2], [ax - 38, ay - 2 * s], [ax - 30, ay + 2 * s + 2], [ax - 12, ay + 2 * s + 2]]);
  return enmascarado(`m-moscon-ala-${n}`, d, forma(d, C.lila, 0.55) + nube(ax - 24, ay, 10, 3, C.vela, 's', 0.5)) +
    trazo(`M${ax} ${ay} L${ax - 36} ${ay - 2 * s} M${ax - 4} ${ay} Q${ax - 20} ${ay - 5 * s - 2} ${ax - 30} ${ay - 5 * s - 1} M${ax - 6} ${ay + 1} Q${ax - 18} ${ay + 3 * s + 2} ${ax - 28} ${ay + 2 * s + 2}`, C.morado, 0.6, 0.8) +
    trazo(d, C.morado, 0.5, 0.6);
}

/** La cabeza: los ojos rojos compuestos, el facetado, las antenitas y la trompa de esponja. */
function cabeza(): string {
  const [nx, ny] = A.cuello;
  const [tx, ty] = A.trompa;
  const cara = curva([[nx - 2, ny - 8], [nx + 10, ny - 10], [nx + 14, ny - 2], [nx + 10, ny + 6], [nx, ny + 4]]);
  const ojo = (n: 0 | 1): string => {
    const { centro: [ex, ey], radio: [rx, ry] } = A.ojos[n];
    let facetas = '';
    for (let i = 0; i < 9; i++) facetas += forma(elipse(ex - rx * 0.6 + ((i * 3) % 6) * (rx / 2.6), ey - ry * 0.6 + Math.floor(i / 3) * (ry / 1.6), 0.6, 0.6), C.rojoVivo, 0.9);
    return forma(elipse(ex, ey, rx, ry), C.rojo) + facetas + nube(ex - 1.5, ey - 2, 1.5, 1, C.llama, 'xs', 0.8);
  };
  return conGrano(
    enmascarado('m-moscon-cara', cara, forma(cara, C.negro) + nube(nx + 6, ny - 2, 5, 5, C.bronceHondo, 's', 0.8)) +
    ojo(1) + ojo(0) +
    // Las antenitas y la trompa, que termina en la esponja.
    trazo(`M${nx + 10} ${ny - 9} l2 -4 M${nx + 12} ${ny - 8} l3 -3`, C.negro, 0.9) +
    trazo(`M${nx + 12} ${ny + 2} Q${tx} ${ty - 2} ${tx} ${ty + 2}`, C.negro, 1.6) + forma(elipse(tx, ty + 3, 2.4, 1.6), C.bronce) + nube(tx, ty + 3, 1.2, 0.6, C.oroClaro, 'xs', 0.8),
  );
}

/* ------------------------------------------------------------------
   El vidrio de adelante: el vaso, el vaho, los rayones, las estrellitas
   ------------------------------------------------------------------ */

/** El vaho del moscón en el vidrio: una mancha blanca que la isla agranda donde respira. */
function vaho(): string {
  return nube(0, 0, 14, 10, C.nube, 'm', 0.55) + nube(2, -2, 7, 5, C.vela, 's', 0.5);
}

/** Los rayones de tanto pegarle al vidrio: rayitas finas, cruzadas, del lado de arriba. */
function rayones(): string {
  const rnd = (i: number): number => ((i * 104729) % 101) / 101;
  let s = '';
  for (let i = 0; i < 12; i++) {
    const x = -K + 8 + rnd(i) * (2 * K - 16);
    const y = -H + 10 + rnd(i + 2) * 40;
    s += trazo(`M${f(x)} ${f(y)} l${f(-4 + rnd(i + 4) * 8)} ${f(3 + rnd(i + 6) * 5)}`, C.vela, 0.6, 0.6);
  }
  return s;
}

/** Las estrellitas del golpe, que giran alrededor de la cabeza. */
function estrellas(): string {
  const estrella = (x: number, y: number, r: number): string => forma(poli([[x, y - r], [x + r * 0.3, y - r * 0.3], [x + r, y], [x + r * 0.3, y + r * 0.3], [x, y + r], [x - r * 0.3, y + r * 0.3], [x - r, y], [x - r * 0.3, y - r * 0.3]]), C.oroClaro, 0.95);
  return estrella(-10, 0, 4) + estrella(8, -4, 3) + estrella(2, 6, 2.6) + forma(elipse(-2, -6, 1, 1), C.llama) + forma(elipse(12, 4, 1, 1), C.llama);
}

/** El vidrio: la pared de adelante, con el grosor del culo, el brillo del seguidor, la pestaña saltada y el borde. */
function vaso(): string {
  const culo = `M${-K} ${-H + 6} Q${-K} ${-H} ${-K + 6} ${-H} L${K - 6} ${-H} Q${K} ${-H} ${K} ${-H + 6} L${K - V} ${-H + V + 4} Q${K - V} ${-H + V} ${K - V - 4} ${-H + V} L${-K + V + 4} ${-H + V} Q${-K + V} ${-H + V} ${-K + V} ${-H + V + 4} Z`;
  return conGrano(
    enmascarado('m-moscon-vaso', SILUETA,
      forma(SILUETA, C.verde, 0.08) +
      // El brillo largo del seguidor, de arriba abajo, y el reflejo de la olla del otro lado.
      nube(-K + 12, -H * 0.5, 4, H * 0.42, C.vela, 's', 0.55) + nube(K - 10, -H * 0.4, 3, H * 0.3, C.verdeClaro, 's', 0.4) +
      // El grosor del culo, que es lo más verde.
      forma(culo, C.verde, 0.45) + nube(0, -H + 3, K - 8, 2, C.verdeClaro, 'xs', 0.7)) +
    // Los bordes del vidrio.
    trazo(`M${-B} 0 L${-K} ${-H + 6} Q${-K} ${-H} ${-K + 6} ${-H} L${K - 6} ${-H} Q${K} ${-H} ${K} ${-H + 6} L${B} 0`, C.verdeClaro, 1.6, 0.9) +
    trazo(`M${-B + 2} -1 L${B - 2} -1`, C.verdeHondo, 1.2, 0.6) +
    // La pestaña saltada en la boca, del lado de la miel, y la grieta que sube de ahí.
    forma(poli([[B - 6, 0], [B - 1, -7], [B + 2, -1]]), C.verdeHondo, 0.9) + trazo(`M${B - 3} -6 l-3 -14 l2 -8`, C.verdeClaro, 0.8, 0.8),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3;

export const PIEZAS_MOSCON: readonly Pieza[] = [
  { nombre: 'moscon-sombra', caja: [-B - 12, -8, 2 * B + 30, 24], dibujo: sombra(), densidad: D * 0.7 },
  { nombre: 'moscon-vaso-fondo', caja: [-B - 2, -H - 2, 2 * B + 4, H + 4], dibujo: vasoFondo(), densidad: D * 0.7 },
  { nombre: 'moscon-patas-1', caja: [-30, -28, 44, 32], dibujo: patas(0), densidad: D * 1.5 },
  { nombre: 'moscon-abdomen', caja: [-30, -24, 36, 26], dibujo: abdomen(), densidad: D * 1.5 },
  { nombre: 'moscon-torax', caja: [-12, -32, 30, 32], dibujo: torax(), densidad: D * 1.5 },
  { nombre: 'moscon-ala-1', caja: [A.alas[0] - 42, A.alas[1] - 14, 46, 24], dibujo: ala(0), densidad: D * 1.5 },
  { nombre: 'moscon-ala-2', caja: [A.alas[0] - 42, A.alas[1] - 12, 46, 24], dibujo: ala(1), densidad: D * 1.5 },
  { nombre: 'moscon-cabeza', caja: [A.cuello[0] - 4, A.cuello[1] - 14, 22, 26], dibujo: cabeza(), densidad: D * 2 },
  { nombre: 'moscon-patas-2', caja: [A.patasDel[0] - 4, A.patasDel[1] - 18, 28, 24], dibujo: patas(1), densidad: D * 1.5 },
  { nombre: 'moscon-vaho', caja: [-18, -14, 36, 28], dibujo: vaho(), densidad: D * 0.7 },
  { nombre: 'moscon-rayones', caja: [-K - 2, -H - 2, 2 * K + 4, 60], dibujo: rayones(), densidad: D },
  { nombre: 'moscon-estrellas', caja: [-16, -12, 32, 24], dibujo: estrellas(), densidad: D * 1.5 },
  { nombre: 'moscon-vaso', caja: [-B - 4, -H - 4, 2 * B + 10, H + 8], dibujo: vaso(), densidad: D },
];

const img = imagenesDe(PIEZAS_MOSCON);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El moscón y el vaso armados con las marcas de un momento. Lo de adentro no se sale del vidrio: `recorte` es el id del clip. */
function armado(m: Momento, recorte: string): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    img('moscon-sombra') +
    parte('vaso',
      img('moscon-vaso-fondo') +
      `<clipPath id="${recorte}"><path d="${ADENTRO}"/></clipPath>` +
      `<g clip-path="url(#${recorte})">` +
      parte('mosca',
        parte('patas-1', img('moscon-patas-1'), t['patas-1']) +
        parte('abdomen', img('moscon-abdomen'), t.abdomen) +
        parte('alas', parte('ala-1', img('moscon-ala-1'), t['ala-1']) + parte('ala-2', img('moscon-ala-2'), t['ala-2']), '', o.alas) +
        img('moscon-torax') +
        parte('cabeza', img('moscon-cabeza'), t.cabeza) +
        parte('patas-2', img('moscon-patas-2'), t['patas-2']),
        t.mosca) +
      parte('estrellas', img('moscon-estrellas'), t.estrellas, o.estrellas) +
      parte('vaho', img('moscon-vaho'), t.vaho, o.vaho) +
      `</g>` +
      parte('rayones', img('moscon-rayones'), '', o.rayones) +
      img('moscon-vaso'),
      t.vaso)
  );
}

/** El moscón en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function mosconEn(m: Momento = QUIETO, recorte = 'moscon-vidrio-mirar'): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m, recorte)}</g>`;
}

/** El títere que se toca, en la pose quieta: parado en el mantel adentro del vaso. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--moscon" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El moscón zumbón'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO, 'moscon-vidrio')}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: dándose contra el culo del vaso, zumbando, con el vidrio empañado. */
export const RETRATO = { caja: [MOSCON.x - 40, MOSCON.piso - 70, 80, 82] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('mesa-lejos') + fondo('mesa-piso') + mosconEn(GOLPEA, 'moscon-vidrio-retrato');
}

export const MOSCON_PERSONAJE: Personaje = {
  id: ID,
  region: 'la-mesa',
  ancla: MOSCON.x,
  piezas: PIEZAS_MOSCON,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
