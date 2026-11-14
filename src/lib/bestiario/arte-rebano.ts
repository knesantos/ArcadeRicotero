/**
 * El rebaño (`D-73`, vigesimoctava vuelta), amontonado en la punta de abajo de la pastura, lo más lejos del monte.
 *
 * *"Esos tipos soplan con el viento, al rebaño y su temor"* es de *El pibe de los astilleros*, en *La mosca y la
 * sopa* (1991). Se toma al pie de la letra, las dos cosas: el rebaño tiene miedo de todo lo que sopla, y los que
 * soplan, soplan con el viento. Por eso son tres ovejas apretadas alrededor de una veleta: el gallo de lata gira
 * para donde sopla, y ellas con él, cada una un poco más tarde que la anterior. Lo que sopla es una bolsa de nailon
 * enganchada en el palo que aletea sin parar y que, cada tanto, se suelta y les pasa por arriba. Tocado, el miedo
 * se les sube a todas juntas: saltan, sueltan copos de lana, la veleta da vueltas y se vuelven a apretar, más.
 *
 * De la letra son el rebaño, el temor, lo que sopla y el viento que manda. Del dibujo son la veleta, la bolsa, las
 * tres caras distintas y la que se mete la cabeza debajo.
 *
 * Viste *La mosca y la sopa*, medido con sharp: la lana es la crema de la olla, la lana sucia y la sombra son su
 * cartón y su sepia, las caras son el negro y el vino del escenario, el gallo es el rojo del frente, la veleta y la
 * bolsa son el haz del seguidor.
 *
 * Coordenadas: el (0, 0) es el piso debajo del medio del montón (`rig-rebano.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli } from './trazos.ts';
import { COPOS, OVEJA, OVEJAS, QUIETO, REBANO, VELETA, BOLSA, ESPANTADO, marcas, type Momento } from './rig-rebano.ts';

const ID = 'el-rebano';

/** Las tintas de *La mosca y la sopa* (`tokens.css`). */
const C = {
  lana: 'var(--bestia-rebano-lana)',
  lanaHonda: 'var(--bestia-rebano-lana-honda)',
  sepia: 'var(--bestia-rebano-sepia)',
  negro: 'var(--bestia-rebano-negro)',
  vino: 'var(--bestia-rebano-vino)',
  rosa: 'var(--bestia-rebano-rosa)',
  haz: 'var(--bestia-rebano-haz)',
  hazHondo: 'var(--bestia-rebano-haz-hondo)',
  rojo: 'var(--bestia-rebano-rojo)',
  rojoHondo: 'var(--bestia-rebano-rojo-hondo)',
  amarillo: 'var(--bestia-rebano-amarillo)',
};

function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Un copo de lana: una silueta de bollos alrededor de una elipse, con los rulos adentro. */
function vellon(cx: number, cy: number, rx: number, ry: number, bollos: number, semilla: number, rulo: string): { d: string; rulos: string } {
  const rnd = azar(semilla);
  let d = elipse(cx, cy, rx * 0.86, ry * 0.86);
  let rulos = '';
  for (let i = 0; i < bollos; i++) {
    const a = (i / bollos) * Math.PI * 2;
    const r = Math.min(rx, ry) * (0.24 + rnd() * 0.1);
    const [x, y] = [cx + Math.cos(a) * (rx - r * 0.5), cy + Math.sin(a) * (ry - r * 0.5)];
    d += ' ' + elipse(x, y, r, r);
    rulos += trazo(`M${f(x - r * 0.5)} ${f(y)} a${f(r * 0.5)} ${f(r * 0.5)} 0 1 1 ${f(r * 0.5)} ${f(r * 0.5)}`, rulo, 0.9, 0.55);
  }
  for (let i = 0; i < bollos; i++) {
    const [x, y] = [cx + (rnd() - 0.5) * rx * 1.3, cy + (rnd() - 0.5) * ry * 1.2];
    const r = 3.5 + rnd() * 3.5;
    rulos += trazo(`M${f(x - r)} ${f(y)} a${f(r)} ${f(r)} 0 1 1 ${f(r)} ${f(r)}`, rulo, 0.9, 0.4);
  }
  return { d, rulos };
}

/* ------------------------------------------------------------------
   El piso pisado, la veleta, la bolsa y los copos
   ------------------------------------------------------------------ */

/** Donde se amontonan: el pasto aplastado de tanto apretarse, y unas briznas que no se enderezan. */
function pasto(): string {
  const rnd = azar(401);
  let briznas = '';
  for (let i = 0; i < 18; i++) {
    const x = -130 + rnd() * 260;
    briznas += trazo(`M${f(x)} ${f(2 + rnd() * 6)} q${f(-2 + rnd() * 4)} ${f(-6 - rnd() * 4)} ${f(-4 + rnd() * 8)} ${f(-9 - rnd() * 6)}`, i % 3 ? C.sepia : C.lanaHonda, 1.2, 0.7);
  }
  return conGrano(nube(0, 4, 120, 7, C.sepia, 's', 0.65) + nube(0, 2, 80, 4, C.vino, 's', 0.45) + briznas);
}

/** El palo de la veleta: un fierro clavado, con la cruz de los rumbos, torcido de tanto viento. */
function palo(): string {
  const { x, pie, punta } = VELETA;
  const d = `M${x - 1.8} ${pie} L${x - 1.2} ${punta + 6} L${x + 1.2} ${punta + 6} L${x + 1.8} ${pie} Z`;
  return conGrano(
    nube(x + 3, pie + 6, 12, 3, C.sepia, 'xs', 0.7) +
    enmascarado('m-rebano-palo', d, forma(d, C.hazHondo) + nube(x - 1, (pie + punta) / 2, 1, 70, C.haz, 'xs', 0.6) + nube(x + 2, pie - 20, 2, 30, C.rojoHondo, 'xs', 0.5)) +
    // La cruz de los rumbos, a media altura, con sus cuatro puntitas.
    trazo(`M${x - 22} ${punta + 56} L${x + 22} ${punta + 56} M${x} ${punta + 40} L${x} ${punta + 72}`, C.hazHondo, 2.2) +
    [[x - 22, punta + 56], [x + 22, punta + 56], [x, punta + 40], [x, punta + 72]].map(([a, b]) => forma(elipse(a!, b!, 2.6, 2.6), C.haz)).join('') +
    // El remache de arriba, donde gira el gallo.
    forma(elipse(x, punta + 6, 3.4, 3.4), C.haz),
  );
}

/** El gallo de lata de la veleta, de perfil mirando a la derecha: se da vuelta en el palo, y de canto casi no se ve. */
function gallo(): string {
  const [gx, gy] = VELETA.gallo;
  const cuerpo = curva([[gx - 18, gy + 4], [gx - 8, gy - 6], [gx + 6, gy - 8], [gx + 14, gy - 18], [gx + 22, gy - 12], [gx + 18, gy - 4], [gx + 10, gy + 4], [gx - 2, gy + 12], [gx - 12, gy + 12]]);
  const cola = curva([[gx - 16, gy + 2], [gx - 36, gy - 24], [gx - 30, gy - 2], [gx - 42, gy - 10], [gx - 28, gy + 8]]);
  return conGrano(
    enmascarado('m-rebano-cola', cola, forma(cola, C.rojoHondo) + nube(gx - 34, gy - 10, 6, 10, C.rojo, 'xs', 0.7)) +
    enmascarado('m-rebano-gallo', cuerpo, forma(cuerpo, C.rojo) + nube(gx - 2, gy + 8, 16, 5, C.rojoHondo, 'xs', 0.8) + nube(gx + 4, gy - 6, 8, 3, C.amarillo, 'xs', 0.45)) +
    // La cresta, el pico y el ojito: la cresta es de lata recortada.
    forma(poli([[gx + 10, gy - 17], [gx + 14, gy - 26], [gx + 17, gy - 19], [gx + 20, gy - 25], [gx + 22, gy - 13]]), C.rojoHondo) +
    forma(poli([[gx + 21, gy - 11], [gx + 31, gy - 8], [gx + 21, gy - 5]]), C.amarillo) +
    forma(elipse(gx + 15, gy - 11, 1.8, 1.8), C.negro) +
    // La patita, soldada al remache.
    trazo(`M${gx - 1} ${gy + 10} L${gx} ${gy + 20}`, C.hazHondo, 2),
  );
}

/** La cinta atada al palo, bajo el gallo: cuelga para abajo y el viento la tira para el lado. */
function cinta(): string {
  const [cx, cy] = VELETA.cinta;
  const d = curva([[cx - 1.5, cy], [cx + 2, cy + 1], [cx + 4, cy + 14], [cx + 2, cy + 30], [cx + 6, cy + 42], [cx - 2, cy + 40], [cx - 3, cy + 28], [cx - 1, cy + 12]]);
  return conGrano(enmascarado('m-rebano-cinta', d, forma(d, C.amarillo) + nube(cx, cy + 36, 4, 8, C.rojo, 'xs', 0.6)) + trazo(`M${cx - 2.6} ${cy + 1} L${cx + 3} ${cy + 1}`, C.rojoHondo, 2));
}

/**
 * La bolsa de nailon, de las del supermercado: dos asas anudadas arriba (de donde cuelga), el cuerpo inflado por el
 * viento, hinchado abajo y fruncido arriba, con las arrugas que salen del nudo, las esquinas de abajo en punta y un
 * franja impresa. Centrada en el (0, 0), que es el nudo de las asas.
 */
function bolsa(): string {
  const cuerpo = curva([[-9, 2], [9, 2], [20, 9], [31, 24], [26, 44], [9, 55], [-10, 51], [-25, 41], [-27, 24], [-20, 10]]);
  return conGrano(
    // Las dos asas: dos lazos largos que salen de los hombros y se juntan en el nudo, uno por delante del otro.
    trazo('M-9 3 C-22 -14 -6 -34 3 -26 C8 -20 -2 -8 0 0', C.haz, 2.6, 0.95) + trazo('M9 3 C22 -14 6 -34 -3 -26 C-8 -20 2 -8 0 0', C.haz, 2.6, 0.95) +
    trazo('M-9 3 C-22 -14 -6 -34 3 -26', C.hazHondo, 0.8, 0.6) +
    enmascarado('m-rebano-bolsa', cuerpo,
      forma(cuerpo, C.haz, 0.86) + nube(-10, 40, 14, 14, C.hazHondo, 's', 0.55) + nube(14, 22, 8, 16, C.hazHondo, 's', 0.35) + nube(-12, 20, 5, 10, C.haz, 'xs', 0.95) + nube(10, 44, 7, 5, C.haz, 'xs', 0.9) +
      // La franja impresa y las arrugas que bajan del nudo, como un abanico.
      forma(poli([[-30, 30], [30, 26], [30, 34], [-30, 38]]), C.rojo, 0.55) +
      trazo('M-4 4 q-9 16 -11 38 M6 5 q10 12 9 30 M-9 8 q-12 8 -14 20', C.hazHondo, 0.9, 0.5) +
      trazo('M-22 20 q8 -4 16 2 M6 36 q8 -4 16 0', C.haz, 1.1, 0.7)) +
    // Las esquinas de abajo, estiradas en puntitas por el aire que no deja de empujar, y el canto de la bolsa.
    forma(poli([[-22, 48], [-30, 60], [-14, 54]]), C.haz, 0.8) + forma(poli([[22, 48], [31, 58], [13, 54]]), C.haz, 0.8) +
    trazo(cuerpo, C.hazHondo, 1.1, 0.6) + forma(elipse(0, 2, 3.4, 2.6), C.hazHondo) + forma(elipse(-0.6, 1.4, 1.4, 1), C.haz),
  );
}

/** Un copo de lana suelto: un bollo con rulos, centrado en el (0, 0). */
function copo(): string {
  const { d, rulos } = vellon(0, 0, 11, 8, 7, 419, C.lanaHonda);
  return conGrano(enmascarado('m-rebano-copo', d, forma(d, C.lana) + nube(0, 4, 10, 4, C.lanaHonda, 'xs', 0.7) + nube(-2, -4, 6, 3, C.haz, 'xs', 0.7) + rulos));
}

/* ------------------------------------------------------------------
   Una oveja: el cuerpo de lana, la cabeza, la oreja, el ojo y la boca
   ------------------------------------------------------------------ */

function cuerpo(v: 'a' | 'b'): string {
  const [lx, ly] = OVEJA.lomo;
  const sucia = v === 'b';
  const { d, rulos } = vellon(lx, ly, 46, 32, 12, sucia ? 421 : 433, C.lanaHonda);
  const pata = (x: number, lejos: boolean): string => {
    const p = poli([[x - 4, -26], [x + 4, -26], [x + 3.4, -2], [x + 6, 0], [x - 5, 0], [x - 3.4, -2]]);
    return forma(p, lejos ? C.vino : C.negro);
  };
  return conGrano(
    pata(-24, true) + pata(26, true) + pata(-14, false) + pata(36, false) +
    // La cola: un mechón corto.
    forma(elipse(-46, -50, 6, 8), C.lanaHonda) +
    enmascarado(`m-rebano-cuerpo-${v}`, d,
      forma(d, sucia ? C.lanaHonda : C.lana) + nube(lx, ly + 22, 48, 14, sucia ? C.sepia : C.lanaHonda, 'm', 0.85) + nube(lx - 4, ly - 26, 36, 7, sucia ? C.lana : C.haz, 's', 0.75) +
      nube(lx + 30, ly + 2, 12, 22, sucia ? C.sepia : C.lanaHonda, 's', 0.4) + rulos),
  );
}

function cabeza(v: 'a' | 'b'): string {
  const d = curva([[28, -66], [44, -76], [64, -70], [80, -50], [78, -36], [62, -33], [46, -40], [32, -52]]);
  const [mx, my] = OVEJA.boca;
  const negra = v === 'a';
  return conGrano(
    enmascarado(`m-rebano-cabeza-${v}`, d,
      forma(d, negra ? C.negro : C.sepia) + nube(54, -42, 18, 6, negra ? C.vino : C.negro, 's', 0.8) + nube(44, -72, 14, 4, negra ? C.hazHondo : C.lanaHonda, 's', 0.5) +
      // El hocico: más claro, con la nariz partida.
      nube(76, -42, 8, 8, negra ? C.vino : C.lanaHonda, 's', 0.9)) +
    forma(poli([[mx + 2, my - 8], [mx + 8, my - 7], [mx + 6, my - 2]]), C.negro) +
    trazo(`M${mx + 5} ${my - 2} l-1 4 M${mx + 4} ${my + 2} q-9 3 -18 0`, C.negro, 1.2, 0.9) +
    // El copete de lana que le cae sobre la frente.
    forma(elipse(34, -70, 12, 7), C.lana) + nube(34, -66, 9, 3, C.lanaHonda, 'xs', 0.7),
  );
}

function oreja(): string {
  const [ox, oy] = OVEJA.oreja;
  const d = curva([[ox + 3, oy - 3], [ox - 8, oy - 6], [ox - 22, oy + 2], [ox - 24, oy + 14], [ox - 12, oy + 12], [ox - 2, oy + 6]]);
  return conGrano(enmascarado('m-rebano-oreja', d, forma(d, C.sepia) + nube(ox - 10, oy + 6, 8, 4, C.rosa, 'xs', 0.65) + nube(ox - 4, oy - 2, 8, 3, C.negro, 'xs', 0.6)));
}

function ojo(): string {
  const { centro: [ex, ey], radio: [rx, ry] } = OVEJA.ojo;
  return forma(elipse(ex, ey, rx + 1, ry + 1), C.negro) + forma(elipse(ex, ey, rx, ry), C.amarillo) + forma(`M${ex - 3.6} ${ey - 1.4} h7.2 v2.8 h-7.2 Z`, C.negro) + forma(elipse(ex + 1.6, ey - 2, 0.9, 0.9), C.haz);
}

function boca(): string {
  const [mx, my] = OVEJA.boca;
  return forma(elipse(mx - 4, my + 2, 8, 6), C.vino) + forma(elipse(mx - 4, my + 4, 4.6, 3), C.rojo, 0.85);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;
const caja = (cx: number, cy: number, w: number, h: number): readonly [number, number, number, number] => [cx - w / 2, cy - h / 2, w, h];
const [OJX, OJY] = OVEJA.ojo.centro;

export const PIEZAS_REBANO: readonly Pieza[] = [
  { nombre: 'rebano-pasto', caja: [-140, -18, 280, 34], dibujo: pasto(), densidad: 1.8 },
  { nombre: 'rebano-palo', caja: [VELETA.x - 30, VELETA.punta - 2, 60, -VELETA.punta + 30], dibujo: palo(), densidad: D },
  { nombre: 'rebano-cuerpo-a', caja: [-58, -92, 116, 98], dibujo: cuerpo('a'), densidad: D },
  { nombre: 'rebano-cuerpo-b', caja: [-58, -92, 116, 98], dibujo: cuerpo('b'), densidad: D },
  { nombre: 'rebano-cabeza-a', caja: [22, -84, 66, 56], dibujo: cabeza('a'), densidad: D * 1.4 },
  { nombre: 'rebano-cabeza-b', caja: [22, -84, 66, 56], dibujo: cabeza('b'), densidad: D * 1.4 },
  { nombre: 'rebano-oreja', caja: [OVEJA.oreja[0] - 32, OVEJA.oreja[1] - 12, 40, 34], dibujo: oreja(), densidad: D * 1.6 },
  { nombre: 'rebano-ojo', caja: caja(OJX, OJY, 18, 16), dibujo: ojo(), densidad: D * 2.4 },
  { nombre: 'rebano-boca', caja: caja(OVEJA.boca[0] - 4, OVEJA.boca[1] + 3, 22, 18), dibujo: boca(), densidad: D * 2 },
  { nombre: 'rebano-gallo', caja: [VELETA.gallo[0] - 50, VELETA.gallo[1] - 34, 90, 62], dibujo: gallo(), densidad: D * 1.4 },
  { nombre: 'rebano-cinta', caja: [VELETA.cinta[0] - 12, VELETA.cinta[1] - 6, 24, 54], dibujo: cinta(), densidad: D * 1.6 },
  { nombre: 'rebano-bolsa', caja: [-36, -42, 72, 108], dibujo: bolsa(), densidad: D * 1.4 },
  { nombre: 'rebano-copo', caja: [-16, -12, 32, 24], dibujo: copo(), densidad: D * 1.6 },
];

const img = imagenesDe(PIEZAS_REBANO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Qué cuerpo y qué cara lleva cada oveja. */
const VARIANTES: readonly (readonly ['a' | 'b', 'a' | 'b'])[] = [['b', 'a'], ['a', 'b'], ['a', 'a']];

/** El rebaño armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const oveja = (i: 0 | 1 | 2): string => {
    const n = i + 1;
    const [c, h] = VARIANTES[i]!;
    return parte(`oveja-${n}`,
      parte(`cabeza-${n}`,
        img(`rebano-cabeza-${h}`) + parte(`oreja-${n}`, img('rebano-oreja'), t[`oreja-${n}`]) + parte(`boca-${n}`, img('rebano-boca'), t[`boca-${n}`]) + parte(`ojo-${n}`, img('rebano-ojo'), t[`ojo-${n}`]),
        t[`cabeza-${n}`]) +
      parte(`cuerpo-${n}`, img(`rebano-cuerpo-${c}`), t[`cuerpo-${n}`]),
      t[`oveja-${n}`]);
  };
  return (
    img('rebano-pasto') +
    img('rebano-palo') +
    parte('gallo', img('rebano-gallo'), t.gallo) +
    parte('cinta', img('rebano-cinta'), t.cinta) +
    oveja(0) + oveja(2) + oveja(1) +
    COPOS.map((_, i) => parte(`copo-${i + 1}`, img('rebano-copo'), t[`copo-${i + 1}`], o[`copo-${i + 1}`])).join('') +
    parte('bolsa', img('rebano-bolsa'), t.bolsa)
  );
}

/** El rebaño en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function rebanoEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--rebano" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El rebaño'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: el montón de un brinco, con la veleta dada vuelta y los copos en el aire. */
export const RETRATO = { caja: [REBANO.x - 100, REBANO.piso - 130, 210, 150] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/monte-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/monte-cerca.webp" x="0" y="240" width="900" height="400" preserveAspectRatio="none"/>` +
    rebanoEn(ESPANTADO)
  );
}

export const REBANO_PERSONAJE: Personaje = {
  id: ID,
  region: 'la-pastura',
  ancla: REBANO.x,
  piezas: PIEZAS_REBANO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};

export { OVEJAS };
