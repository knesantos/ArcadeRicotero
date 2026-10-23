/**
 * La mosca (`D-73`, decimoséptima vuelta), volando sobre la olla de la mesa servida.
 *
 * *"Sentís la mosca joder detrás de la oreja"* es de *Queso ruso*, que cierra *La mosca y la sopa*
 * (1991). La mosca está en la tapa: es la foto de una mosca de verdad, vista desde arriba, pegada sobre
 * el rótulo amarillo, con el lomo azul acero y las alas de vidrio. En la mesa todo es recorte del collage
 * de la contratapa, así que **la mosca es ese recorte**: la foto, con el canto blanco del papel donde
 * pasó la tijera, que se despegó del rótulo y anda suelta. Las tintas se midieron en la mosca del rótulo
 * (`--bestia-mosca-*`); arriba le pega el seguidor que se escapa de la foto del escenario, y abajo el
 * rojo de la tapa le rebota rosado en el lomo.
 *
 * Es la misma que vuela por la portada del sitio: allá es la mosca de siempre, acá es la de la tapa.
 *
 * Coordenadas del títere: el (0, 0) es el medio del tórax, vista de arriba, con la cabeza para arriba
 * (`MOSCA_ARMADA`). Está dibujada a cuatro veces y la escena la achica con `ESCALA`.
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { azar } from './pincel.ts';
import { ENCIMA, MOSCA_ARMADA, OCHO, OLLA, QUIETA, marcas, type Momento, type Punto } from './rig-mosca.ts';

type P = Punto;
const f = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Las tintas de la mosca del rótulo (`tokens.css`), y las de la mesa que le pegan. */
const C = {
  cuerpo: 'var(--bestia-mosca-cuerpo)',
  honda: 'var(--bestia-mosca-honda)',
  plata: 'var(--bestia-mosca-plata)',
  ojo: 'var(--bestia-mosca-ojo)',
  reflejo: 'var(--bestia-mosca-reflejo)',
  haz: 'var(--entorno-mesa-haz)',
  luz: 'var(--entorno-mesa-luz)',
  rojo: 'var(--entorno-mesa-rojo)',
  papel: 'var(--entorno-mesa-papel)',
};

const A = MOSCA_ARMADA;

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
const espejo = (pts: readonly P[]): P[] => pts.map(([x, y]) => [-x, y] as P);
const linea = (pts: readonly P[]): string => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')}`;
const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;

/** El canto de papel del recorte: la silueta un poco más gorda, en el papel de la contratapa. */
const canto = (d: string, ancho = 3.2): string =>
  `<path d="${d}" fill="${C.papel}" stroke="${C.papel}" stroke-width="${ancho}" stroke-linejoin="round"/>`;

/* ------------------------------------------------------------------
   El cuerpo: cabeza, tórax, panza y las cuatro patas de atrás
   ------------------------------------------------------------------ */

const CABEZA = elipse(0, -18, 10.5, 7.6);
const OJOS: readonly [string, string] = [elipse(6.6, -20.4, 6.4, 7.8), elipse(-6.6, -20.4, 6.4, 7.8)];
const TORAX = curva([[0, -14.6], [8.6, -11], [10.6, -2], [8.4, 8], [0, 10.6], [-8.4, 8], [-10.6, -2], [-8.6, -11]]);
const PANZA = curva([[0, 6], [9.4, 10], [10.8, 20], [7.6, 31], [0, 36.4], [-7.6, 31], [-10.8, 20], [-9.4, 10]]);

/** Una pata de la mosca: tres tramos finos, con el codo marcado. */
const PATAS_DE_ATRAS: readonly (readonly P[])[] = [
  [[8, -2], [19, 1], [26, 9], [30, 11]],
  [[7, 6], [16, 15], [20, 28], [22, 33]],
];

function patas(lado: 1 | -1, conCanto: boolean): string {
  return PATAS_DE_ATRAS.map((pts) => {
    const d = linea(lado === 1 ? pts : espejo(pts));
    return conCanto ? trazo(d, C.papel, 3.6) : trazo(d, C.honda, 1.3) + trazo(d, C.plata, 0.4, 0.5);
  }).join('');
}

function cuerpo(): string {
  const rnd = azar(1801);
  // Los pelos del tórax: cerdas cortas y oscuras, como en la foto.
  let cerdas = '';
  for (let i = 0; i < 26; i++) {
    const [x, y] = [-8 + rnd() * 16, -12 + rnd() * 20];
    const a = Math.atan2(y + 2, x) + (rnd() - 0.5);
    cerdas += trazo(`M${f(x)} ${f(y)} l${f(Math.cos(a) * 2.2)} ${f(Math.sin(a) * 2.2)}`, C.honda, 0.5, 0.9);
  }
  // Las facetas de los ojos: puntitos en grilla, apenas.
  let facetas = '';
  for (let j = 0; j < 8; j++) for (let i = 0; i < 6; i++) facetas += `<circle cx="${f(-13 + i * 2.2 + (j % 2) * 1.1)}" cy="${f(-27 + j * 1.9)}" r="0.45"/>`;
  // La panza en damero, como la de una mosca de verdad: plata y acero.
  let damero = '';
  for (let j = 0; j < 4; j++) for (let i = -2; i < 2; i++) if ((i + j) % 2 === 0) damero += forma(`M${f(i * 5)} ${f(10 + j * 6)}h5v6h-5Z`, C.plata, 0.5);
  return conGrano(
    // El canto del recorte, por debajo de todo.
    patas(1, true) + patas(-1, true) + canto(CABEZA) + canto(OJOS[0]) + canto(OJOS[1]) + canto(TORAX) + canto(PANZA) +
    patas(1, false) + patas(-1, false) +
    enmascarado('m-mosca-panza', PANZA,
      forma(PANZA, C.cuerpo) + `<g filter="url(#soplo-xs)" opacity="0.8">${damero}</g>` +
      [12, 18, 24, 30].map((y) => nube(0, y, 11, 1.1, C.honda, 'xs', 0.85)).join('') +
      nube(-4, 14, 4, 6, C.reflejo, 's', 0.75) + nube(5, 26, 5, 8, C.honda, 's', 0.55) + nube(0, 35, 6, 3, C.honda, 's', 0.8) +
      nube(0, 20, 12, 18, C.rojo, 'm', 0.18)) +
    enmascarado('m-mosca-torax', TORAX,
      forma(TORAX, C.cuerpo) +
      [-4, 0, 4].map((x) => nube(x, -2, 1.1, 10, C.honda, 'xs', 0.9)).join('') +
      nube(-4, -9, 5, 4, C.haz, 's', 0.6) + nube(6, 4, 5, 6, C.honda, 's', 0.5) + cerdas) +
    enmascarado('m-mosca-cabeza', CABEZA, forma(CABEZA, C.honda) + nube(0, -14, 6, 3, C.cuerpo, 's', 0.8)) +
    [0, 1].map((n) =>
      enmascarado(`m-mosca-ojo-${n + 1}`, OJOS[n as 0 | 1],
        forma(OJOS[n as 0 | 1], C.ojo) + nube(n ? -6 : 6, -18, 5, 6, C.luz, 's', 0.55) +
        `<g fill="${C.honda}" opacity="0.5">${facetas}</g>` +
        nube(n ? -7.6 : 5, -23.6, 2.2, 1.6, C.reflejo, 'xs', 0.95) + nube(n ? -4 : 8.4, -15, 2.4, 2, C.honda, 's', 0.7)),
    ).join(''),
  );
}

/* ------------------------------------------------------------------
   Las patas de adelante, las alas y el zumbido
   ------------------------------------------------------------------ */

/** Una pata de adelante: sale de abajo de la cabeza y va para adelante; es la que se frota. */
function pataAdelante(n: 0 | 1): string {
  const [px, py] = A.patas[n];
  const s = n === 0 ? 1 : -1;
  const d = linea([[px, py], [px + s * 8, py - 8], [px + s * 6, py - 19], [px + s * 4, py - 23]]);
  return conGrano(trazo(d, C.papel, 3.6) + trazo(d, C.honda, 1.3) + trazo(d, C.plata, 0.4, 0.5));
}

/** La silueta de un ala plegada: de vidrio, larga, en V sobre la panza. */
function siluetaDeAla(n: 0 | 1): P[] {
  const pts: P[] = [[7, -6], [13, -4], [19, 9], [20.6, 25], [16, 36], [9.6, 31], [6.4, 15], [5.4, 0]];
  return n === 0 ? pts : espejo(pts);
}

function ala(n: 0 | 1): string {
  const s = n === 0 ? 1 : -1;
  const d = curva(siluetaDeAla(n));
  // Las venas: salen de la raíz y se abren hacia la punta.
  const venas = ([
    [[7, -5], [12, 6], [16, 22], [16, 34]],
    [[7, -5], [10, 10], [12, 26]],
    [[7, -4], [8, 14], [9, 30]],
    [[13, 6], [18, 14]],
  ] as const satisfies readonly (readonly P[])[]).map((v) => trazo(curva(s === 1 ? v : espejo(v), false), C.honda, 0.5, 0.75)).join('');
  return conGrano(
    canto(d, 1.6) +
    enmascarado(`m-mosca-ala-${n + 1}`, d,
      forma(d, C.plata, 0.55) + nube(s * 11, 6, 5, 12, C.haz, 's', 0.6) + nube(s * 16, 26, 5, 8, C.rojo, 's', 0.25) + venas),
  );
}

/** El borrón del aleteo: las alas en todas partes a la vez, sopladas. */
function zumbido(): string {
  return [1, -1].map((s) => nube(s * 22, -2, 22, 13, C.haz, 'm', 0.5, s * 10) + nube(s * 26, -4, 12, 7, C.plata, 's', 0.35, s * 10)).join('');
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.6;

export const PIEZAS_MOSCA: readonly Pieza[] = [
  { nombre: 'mosca-cuerpo', caja: [-34, -32, 68, 72], dibujo: cuerpo(), densidad: D },
  { nombre: 'mosca-pata-1', caja: [2, -40, 20, 32], dibujo: pataAdelante(0), densidad: D },
  { nombre: 'mosca-pata-2', caja: [-22, -40, 20, 32], dibujo: pataAdelante(1), densidad: D },
  { nombre: 'mosca-ala-1', caja: [2, -10, 22, 50], dibujo: ala(0), densidad: D },
  { nombre: 'mosca-ala-2', caja: [-24, -10, 22, 50], dibujo: ala(1), densidad: D },
  { nombre: 'mosca-zumbido', caja: [-60, -34, 120, 62], dibujo: zumbido(), densidad: 1.4 },
];

const img = imagenesDe(PIEZAS_MOSCA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** La mosca armada con las marcas de un momento (`marcas`, `rig-mosca.ts`). */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    // Los anillos de la sopa y la sombra van en la escena, sin girar ni agrandarse con ella.
    parte('anillo', `<ellipse cx="0" cy="0" rx="8" ry="8" class="bt-mosca-anillo"/>`, t.anillo, o.anillo) +
    parte('sombra', `<ellipse cx="0" cy="0" rx="3.4" ry="5" class="bt-mosca-sombra"/>`, t.sombra, o.sombra) +
    parte('entero',
      parte('zumbido', img('mosca-zumbido'), '', o.zumbido) +
      parte('pata-1', img('mosca-pata-1'), t['pata-1']) +
      parte('pata-2', img('mosca-pata-2'), t['pata-2']) +
      img('mosca-cuerpo') +
      parte('ala-2', img('mosca-ala-2'), t['ala-2']) +
      parte('ala-1', img('mosca-ala-1'), t['ala-1']),
      t.entero, o.entero)
  );
}

/** La mosca en cualquier momento, sin lo que la hace tocable: para el test y para el retrato. */
export function moscaEn(m: Momento = QUIETA): string {
  return armado(m);
}

/**
 * El títere que se toca, en la pose quieta: posada en el borde de la olla. Es chica para un dedo, así que
 * se toca todo el aire donde vuela, encima de la olla.
 */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--mosca" data-id="la-mosca" role="button" tabindex="0" aria-label="${nombres.get('la-mosca') ?? 'La mosca'}">` +
    `<ellipse cx="${OCHO.x}" cy="${OCHO.y + 14}" rx="${OCHO.rx + 16}" ry="${OCHO.ry + 30}" class="bt-mosca-toque"/>` +
    armado(QUIETA) +
    `</g>`
  );
}

/** El retrato de la ficha: se te viene encima, zumbando, sobre la olla. */
export const RETRATO = { caja: [ENCIMA.x - 58, ENCIMA.y - 50, 116, 100] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('mesa-lejos') + fondo('mesa-piso') + moscaEn(ENCIMA);
}

export const MOSCA: Personaje = {
  id: 'la-mosca',
  region: 'la-mesa',
  ancla: OLLA.x,
  piezas: PIEZAS_MOSCA,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
