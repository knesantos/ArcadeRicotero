/**
 * Tu animal (`D-73`, decimoctava vuelta): la sombra con dos ojos entre las tiras del monte.
 *
 * *"Si vos cuidás que tu animal / no nos muestre libremente"* es de *Unos pocos peligros sensatos*, en
 * *Gulp!* (1985). Por eso está pintado con el pincel seco de *Gulp!* (`pincel.ts`), fotocopiado, en el
 * negro verdoso que tiene la brocha en el interior de la tapa (no es negro: es petróleo, medido), y lo
 * que tiene de color es el rojo y el amarillo corridos de las letras del interior: los ojos, el collar y
 * la boca cuando pela los dientes.
 *
 * Qué animal es no lo dice la letra, y el dibujo tampoco lo dice del todo: es grande, flaco y encorvado,
 * con la melena erizada en la cruz, hocico largo y orejas de punta, y casi nunca se ve entero. Lo que se
 * ve siempre son los ojos. Lleva collar, y la correa se va para arriba y afuera del monte: alguien lo
 * cuida. Eso es del dibujo; de la letra es que cada uno tiene el suyo.
 *
 * Coordenadas del títere: el (0, 0) es el piso debajo de la panza (`rig-animal.ts`).
 */

import { forma, imagenesDe, nube, soplo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { azar, corrido, mancha, pincelada, tinta, type P } from './pincel.ts';
import { ANIMAL, ANIMAL_ARMADO as A, MUESTRA, QUIETO, marcas, type Momento } from './rig-animal.ts';

const f = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Las tintas del interior de *Gulp!* (`tokens.css`), y el crema del papel para la luz de la luna. */
const C = {
  tinta: 'var(--bestia-animal-tinta)',
  verde: 'var(--bestia-animal-verde)',
  ojo: 'var(--bestia-animal-ojo)',
  rojo: 'var(--bestia-animal-rojo)',
  crema: 'var(--disco-gulp-apoyo)',
};

/* ------------------------------------------------------------------
   Herramientas
   ------------------------------------------------------------------ */

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
const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;
function cajaDe(pts: readonly P[], margen = 4): readonly [number, number, number, number] {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, y0] = [Math.min(...xs) - margen, Math.min(...ys) - margen];
  return [x0, y0, Math.max(...xs) + margen - x0, Math.max(...ys) + margen - y0];
}

/**
 * Los pelos del borde: pinceladas cortas que salen de la silueta para afuera, como cuando la brocha se
 * pasa del borde. Es lo que hace que no tenga contorno: tiene pelo.
 */
function pelos(pts: readonly P[], largo: number, ancho: number, semilla: number, cada = 2): string {
  const rnd = azar(semilla);
  let s = '';
  const n = pts.length;
  let cx = 0;
  let cy = 0;
  for (const [x, y] of pts) {
    cx += x / n;
    cy += y / n;
  }
  for (let i = 0; i < n; i += cada) {
    const [x, y] = pts[i]!;
    const a = Math.atan2(y - cy, x - cx) + (rnd() - 0.5) * 0.7;
    const l = largo * (0.6 + rnd() * 0.7);
    s += pincelada([[x - Math.cos(a) * 6, y - Math.sin(a) * 6], [x + Math.cos(a) * l * 0.5, y + Math.sin(a) * l * 0.5], [x + Math.cos(a + 0.2) * l, y + Math.sin(a + 0.2) * l]], { ancho, seco: 0.35, apoyo: [0.9, 0.2], grano: 9, tinta: C.tinta }, semilla * 7 + i);
  }
  return s;
}

/** La luz de la luna en el lomo: pasadas secas de crema, que se cortan enseguida. */
const luna = (recorridos: ReadonlyArray<readonly P[]>, ancho: number, semilla: number): string =>
  recorridos.map((r, i) => pincelada(r, { ancho, seco: 0.72, apoyo: [0.5, 0.3], grano: 7, tinta: C.crema }, semilla + i * 11)).join('');

/* ------------------------------------------------------------------
   El cuerpo: el lomo encorvado, la melena, las patas largas, el collar
   ------------------------------------------------------------------ */

/** El lomo: la cruz alta y encorvada, la melena encima, y de ahí baja hasta el anca. El pecho hondo. */
const LOMO: readonly P[] = [[-62, -126], [-50, -150], [-26, -160], [0, -150], [30, -128], [62, -112], [86, -100], [90, -82], [76, -70], [44, -66], [12, -64], [-20, -70], [-46, -80], [-62, -98]];

function cuerpo(): string {
  const L = curva(LOMO);
  // Las patas: largas y flacas, cuatro pinceladas que bajan al piso; las de allá más oscuras y más finas.
  const patas = [
    { r: [[-46, -84], [-52, -46], [-48, -14], [-56, 0]] as P[], ancho: 11, seco: 0.2 },
    { r: [[-26, -74], [-22, -40], [-26, -12], [-20, 0]] as P[], ancho: 8, seco: 0.45 },
    { r: [[54, -76], [62, -42], [56, -14], [62, 0]] as P[], ancho: 12, seco: 0.2 },
    { r: [[74, -80], [82, -44], [78, -14], [84, 0]] as P[], ancho: 8, seco: 0.5 },
  ];
  const lasPatas = patas.map((p, i) => pincelada(p.r, { ancho: p.ancho, seco: p.seco, apoyo: [1, 1.3], grano: 9, tinta: C.tinta }, 2201 + i)).join('');
  // Lo que pinta la brocha: el petróleo de fondo, y encima las pasadas negras que dejan rayas.
  const relleno = soplo(L, C.verde, 'xs', 0.95);
  const pasadas = mancha('an-lomo', L, cajaDe(LOMO, 8), { ancho: 11, seco: 0.42, angulo: -18, curva: 0.2, grano: 10, tinta: C.tinta }, 2211);
  // La melena: pinceladas largas que salen de la cruz y caen para atrás, erizadas.
  const rnd = azar(2215);
  let melena = '';
  for (let i = 0; i < 16; i++) {
    const x = -62 + i * 6 + rnd() * 4;
    const y = -150 + Math.abs(x + 26) * 0.35 - rnd() * 6;
    const largo = 26 + rnd() * 22;
    melena += pincelada([[x, y + 10], [x + largo * 0.3, y - 6 - rnd() * 8], [x + largo * 0.75, y - 4 - rnd() * 10], [x + largo, y + 6]], { ancho: 5 + rnd() * 3, seco: 0.4, apoyo: [1, 0.15], grano: 7, tinta: C.tinta }, 2216 + i);
  }
  const luz = luna([
    [[-52, -152], [-34, -162], [-12, -158], [8, -146]],
    [[14, -136], [40, -122], [64, -112]],
    [[70, -106], [86, -96]],
  ], 4.5, 2221);
  // El collar: una tira roja corrida sobre amarillo, como las letras del interior, con la argolla.
  const [ax, ay] = A.argolla;
  const collar = corrido(`M-70 -126 Q-60 -102 -46 -94`, 6, C.rojo, C.ojo, [2, 1.8]) + `<path d="${elipse(ax, ay, 4.2, 4.2)}" fill="none" stroke="${C.ojo}" stroke-width="2"/>`;
  return `<g>${relleno}${tinta(lasPatas + pasadas + melena + pelos(LOMO, 10, 4, 2231) + luz)}${collar}</g>`;
}

/** La cola: larga y flaca, que se arrastra y se abre en cerdas al final, como una pasada seca. */
function cola(): string {
  const [cx, cy] = A.cola;
  return tinta(
    pincelada([[cx - 8, cy + 4], [cx + 22, cy + 6], [cx + 44, cy + 24], [cx + 60, cy + 58]], { ancho: 10, seco: 0.45, apoyo: [1, 1.6], grano: 8, tinta: C.tinta }, 2241) +
    pincelada([[cx + 4, cy + 2], [cx + 26, cy + 8], [cx + 42, cy + 22]], { ancho: 3.5, seco: 0.8, apoyo: [0.6, 0.3], grano: 6, tinta: C.crema }, 2242),
  );
}

/* ------------------------------------------------------------------
   La cabeza: el cráneo, las orejas de punta, el hocico largo; la boca y la quijada
   ------------------------------------------------------------------ */

const CRANEO: readonly P[] = [[-62, -108], [-66, -128], [-74, -144], [-76, -172], [-66, -146], [-84, -140], [-96, -174], [-98, -142], [-112, -134], [-130, -118], [-150, -110], [-152, -100], [-132, -98], [-104, -100], [-80, -98]];

function cabeza(): string {
  const K = curva(CRANEO);
  const pasadas = mancha('an-craneo', K, cajaDe(CRANEO, 6), { ancho: 7, seco: 0.35, angulo: 10, curva: 0.15, grano: 9, tinta: C.tinta }, 2251);
  // La nariz: una bola de tinta en la punta del hocico, con un brillo de crema.
  const [hx, hy] = A.hocico;
  const nariz = forma(elipse(hx + 2, hy - 3, 5.4, 4.2), C.tinta) + forma(elipse(hx + 0.5, hy - 4.6, 1.4, 1), C.crema, 0.8);
  // Las cuencas hondas, y la luz amarilla que sale de los ojos, soplada en la cara.
  const brillo = A.ojos.map(({ centro: [x, y], radio }) => nube(x, y, radio * 2, radio * 1.5, C.tinta, 's', 0.9) + nube(x, y, radio * 3.4, radio * 2.6, C.ojo, 'm', 0.3)).join('');
  const luz = luna([[[-70, -140], [-90, -134], [-116, -122], [-144, -108]], [[-74, -160], [-75, -146]], [[-95, -164], [-97, -148]]], 3.6, 2261);
  return soplo(K, C.verde, 'xs', 0.9) + tinta(pasadas + pelos(CRANEO, 6, 3, 2271, 1) + luz) + brillo + nariz;
}

/** Lo de adentro de la boca, detrás de la quijada: el rojo y el amarillo corridos, con los colmillos. */
function boca(): string {
  const [qx, qy] = A.quijada;
  const [hx, hy] = A.hocico;
  const adentro = curva([[qx, qy - 2], [hx + 8, hy + 1], [hx + 12, hy + 10], [qx - 4, qy + 10]]);
  const dientes = [0, 1, 2, 3, 4, 5].map((i) => {
    const x = hx + 10 + i * 9;
    const l = i === 0 || i === 4 ? 10 : 6;
    return `M${f(x)} ${f(hy)} l2.6 ${l} l2.6 ${-l} Z`;
  }).join('');
  return `<g transform="translate(2 1.6)">${forma(adentro, C.ojo)}</g>` + forma(adentro, C.rojo) + forma(dientes, C.crema) + `<g transform="translate(1.2 1)">${forma(dientes, C.ojo, 0.5)}</g>`;
}

/** La quijada de abajo: gira desde atrás de la boca y la deja ver. */
const QUIJADA: readonly P[] = [[A.quijada[0] + 2, A.quijada[1] - 2], [A.hocico[0] + 10, A.hocico[1] + 3], [A.hocico[0] + 14, A.hocico[1] + 10], [A.quijada[0] - 18, A.quijada[1] + 12], [A.quijada[0] + 4, A.quijada[1] + 7]];

function quijada(): string {
  const Q = curva(QUIJADA);
  return soplo(Q, C.verde, 'xs', 0.9) + forma(Q, C.tinta, 0.75) + tinta(pelos(QUIJADA, 5, 2.6, 2281, 1));
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.6;

export const PIEZAS_ANIMAL: readonly Pieza[] = [
  { nombre: 'animal-cuerpo', caja: [-96, -196, 210, 204], dibujo: cuerpo(), densidad: D },
  { nombre: 'animal-cola', caja: [A.cola[0] - 20, A.cola[1] - 20, 104, 104], dibujo: cola(), densidad: D },
  { nombre: 'animal-cabeza', caja: [-166, -186, 116, 98], dibujo: cabeza(), densidad: D * 1.3 },
  { nombre: 'animal-boca', caja: [-158, -114, 86, 34], dibujo: boca(), densidad: D * 1.3 },
  { nombre: 'animal-quijada', caja: [-158, -114, 90, 40], dibujo: quijada(), densidad: D * 1.3 },
];

const img = imagenesDe(PIEZAS_ANIMAL);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Los ojos amarillos, la pupila y el párpado: tinta de la página, que la isla mueve. El brillo va soplado en la cabeza. */
function ojos(t: Readonly<Record<string, string>>): string {
  return A.ojos.map(({ centro: [x, y], radio }, i) =>
    `<circle cx="${x}" cy="${y}" r="${radio}" class="bt-animal-ojo"/>` +
    parte(`pupila-${i + 1}`, `<ellipse cx="${x}" cy="${y}" rx="${f(radio * 0.32)}" ry="${f(radio * 0.8)}" class="bt-animal-pupila"/>`, t[`pupila-${i + 1}`]) +
    parte(`parpado-${i + 1}`, `<ellipse cx="${x}" cy="${y}" rx="${f(radio + 0.8)}" ry="${f(radio + 0.8)}" class="bt-animal-parpado"/>`, t[`parpado-${i + 1}`]),
  ).join('');
}

/** Tu animal armado con las marcas de un momento (`marcas`, `rig-animal.ts`). */
function armado(m: Momento): string {
  const { transform: t, opacity: o, correa } = marcas(m);
  return (
    parte('sombra', `<ellipse cx="14" cy="2" rx="96" ry="10" class="bt-animal-sombra"/>`, '', o.sombra) +
    `<path data-parte="correa" d="${correa}" class="bt-animal-correa"/>` +
    parte('anda',
      parte('cuerpo',
        parte('cola', img('animal-cola'), t.cola) +
        parte('torso', img('animal-cuerpo'), t.torso) +
        parte('cabeza', parte('boca', img('animal-boca'), '', o.boca) + img('animal-cabeza') + parte('quijada', img('animal-quijada'), t.quijada), t.cabeza),
        '', o.cuerpo) +
      parte('ojos', ojos(t), t.ojos),
      t.anda)
  );
}

/** Tu animal en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function animalEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/**
 * El títere que se toca, en la pose quieta: medio metido en lo oscuro. Se toca también el hueco oscuro
 * donde está, que lo que se ve de él son los ojos.
 */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--animal" data-id="tu-animal" role="button" tabindex="0" aria-label="${nombres.get('tu-animal') ?? 'Tu animal'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">` +
    `<ellipse cx="-30" cy="-96" rx="130" ry="92" class="bt-animal-toque"/>` +
    armado(QUIETO) +
    `</g></g>`
  );
}

/** El retrato de la ficha: mostrándose entero, con los dientes pelados, entre las tiras del monte. */
export const RETRATO = { caja: [ANIMAL.x - 96, ANIMAL.piso - 112, 176, 122] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/monte-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/monte-cerca.webp" x="0" y="240" width="900" height="400" preserveAspectRatio="none"/>` +
    animalEn(MUESTRA)
  );
}

export const TU_ANIMAL: Personaje = {
  id: 'tu-animal',
  region: 'el-monte',
  ancla: ANIMAL.x,
  piezas: PIEZAS_ANIMAL,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
