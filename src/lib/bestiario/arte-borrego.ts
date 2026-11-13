/**
 * El borrego (`D-73`, vigesimoséptima vuelta), suelto en la pastura, cerca del palo del cordero.
 *
 * *"Y ya sabés que jugando al borrego te van a carnear"* es de *Rock yugular*, en *Luzbelito* (1996). Se toma al
 * pie de la letra: no es un borrego, es uno que **juega** al borrego. El vellón es un disfraz, con cierre en el lomo
 * y costuras, y abajo hay un bicho flaco y pelado que ya tiene marcados en el cuero, con línea de puntos, los
 * cortes del carnicero. Del mismo tema: *"caen, caen al fin, caen los disfraces, caen desnudándote"* (cuando lo
 * tocan pega un brinco y el disfraz se le cae hasta las pezuñas), *"vas copiando tu herida sobre un pañuelo
 * rojo"* (lleva un pañuelo rojo atado al cogote, justo en la yugular, con una mancha más oscura) y el *rock
 * yugular* (la línea de puntos más gruesa le cruza el cogote, y tiene una tijerita dibujada al lado).
 * Anda suelto y por estar suelto, más a mano: brinca, pasta, tira patadas al aire y mira al que está atado.
 *
 * De la letra son el borrego, el juego, el disfraz que cae, el pañuelo rojo, la yugular y el carneo. Del dibujo
 * son el cierre, la capucha de lana que no se le cae y la cara de no haber entendido.
 *
 * Viste *Luzbelito*, medido con sharp: el vellón es el marfil del busto, el cuero pelado es la cera de las velas
 * de la contratapa, la cara y las patas son el bronce del marco en lo hondo, el cierre y los ojos son su oro, la
 * línea de puntos es el cobre, el pañuelo es el rojo del marco, y la sombra es el verde del mármol.
 *
 * Coordenadas: el (0, 0) es el piso debajo del medio de la panza, y mira a la derecha (`rig-borrego.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { BORREGO, BORREGO_ARMADO as A, DESNUDO, QUIETO, marcas, type Momento } from './rig-borrego.ts';

const ID = 'el-borrego';

/** Las tintas de *Luzbelito* (`tokens.css`). */
const C = {
  marfil: 'var(--bestia-borrego-marfil)',
  hueso: 'var(--bestia-borrego-hueso)',
  cera: 'var(--bestia-borrego-cera)',
  ceraHonda: 'var(--bestia-borrego-cera-honda)',
  oro: 'var(--bestia-borrego-oro)',
  oroClaro: 'var(--bestia-borrego-oro-claro)',
  bronce: 'var(--bestia-borrego-bronce)',
  cobre: 'var(--bestia-borrego-cobre)',
  rojo: 'var(--bestia-borrego-rojo)',
  verde: 'var(--bestia-borrego-verde)',
  verdeClaro: 'var(--bestia-borrego-verde-claro)',
  tinta: 'var(--bestia-borrego-tinta)',
  sombra: 'var(--bestia-borrego-sombra)',
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

/** Una línea de puntos: el corte que marcó el carnicero. */
const puntos = (d: string, ancho = 1.6, o = 0.95): string => `<path d="${d}" fill="none" stroke="${C.cobre}" stroke-width="${ancho}" stroke-linecap="round" stroke-dasharray="${f(ancho * 1.6)} ${f(ancho * 2.6)}"${o < 1 ? ` opacity="${o}"` : ''}/>`;

/** Un copo de lana: una silueta de bollos alrededor de una elipse, con el rulo adentro. */
function lana(cx: number, cy: number, rx: number, ry: number, bollos: number, semilla: number): { d: string; rulos: string } {
  const rnd = azar(semilla);
  let d = elipse(cx, cy, rx * 0.86, ry * 0.86);
  let rulos = '';
  for (let i = 0; i < bollos; i++) {
    const a = (i / bollos) * Math.PI * 2;
    const r = Math.min(rx, ry) * (0.26 + rnd() * 0.1);
    const [x, y] = [cx + Math.cos(a) * (rx - r * 0.5), cy + Math.sin(a) * (ry - r * 0.5)];
    d += ' ' + elipse(x, y, r, r);
    rulos += trazo(`M${f(x - r * 0.5)} ${f(y)} a${f(r * 0.5)} ${f(r * 0.5)} 0 1 1 ${f(r * 0.5)} ${f(r * 0.5)}`, C.ceraHonda, 0.9, 0.55);
  }
  for (let i = 0; i < bollos; i++) {
    const [x, y] = [cx + (rnd() - 0.5) * rx * 1.2, cy + (rnd() - 0.5) * ry * 1.1];
    const r = 4 + rnd() * 4;
    rulos += trazo(`M${f(x - r)} ${f(y)} a${f(r)} ${f(r)} 0 1 1 ${f(r)} ${f(r)}`, C.ceraHonda, 0.9, 0.4);
  }
  return { d, rulos };
}

/* ------------------------------------------------------------------
   El pasto pisado, la cola y las patas
   ------------------------------------------------------------------ */

/** Donde pisa: el pasto aplastado de tanto brincar en el mismo lugar, y unas briznas. */
function pasto(): string {
  const rnd = azar(307);
  let briznas = '';
  for (let i = 0; i < 16; i++) {
    const x = -78 + rnd() * 156;
    briznas += trazo(`M${f(x)} ${f(2 + rnd() * 6)} q${f(-2 + rnd() * 4)} ${f(-6 - rnd() * 4)} ${f(-4 + rnd() * 8)} ${f(-10 - rnd() * 6)}`, i % 3 ? C.sombra : C.bronce, 1.2, 0.7);
  }
  return conGrano(nube(0, 3, 70, 5, C.sombra, 's', 0.7) + nube(0, 2, 40, 3, C.tinta, 's', 0.5) + briznas);
}

function cola(): string {
  const [kx, ky] = A.cola;
  const d = curva([[kx + 4, ky - 6], [kx - 8, ky - 4], [kx - 14, ky + 8], [kx - 10, ky + 20], [kx - 2, ky + 18], [kx + 2, ky + 6]]);
  return conGrano(enmascarado('m-borrego-cola', d, forma(d, C.cera) + nube(kx - 4, ky + 14, 6, 6, C.ceraHonda, 'xs', 0.7)));
}

/** Una pata: flaca, pelada, con la rodilla y la pezuña partida. `n` 0 es la de cerca. */
function pata(base: P, n: 0 | 1, atras: boolean): string {
  const [x, y] = base;
  const alto = -y;
  const rod = atras ? -4 : 2;
  const d = curva([[x - 6, y - 6], [x + 6, y - 6], [x + 5 + rod, y + alto * 0.45], [x + 4, y + alto - 8], [x + 7, y + alto], [x - 6, y + alto], [x - 4, y + alto - 8], [x - 5 + rod, y + alto * 0.45]]);
  const id = `m-borrego-${atras ? 'tras' : 'del'}-${n}`;
  return conGrano(
    enmascarado(id, d, forma(d, n ? C.ceraHonda : C.cera) + nube(x + 3, y + alto * 0.5, 3, alto * 0.4, C.sombra, 'xs', n ? 0.7 : 0.4) + nube(x + rod, y + alto * 0.45, 5, 4, C.oro, 'xs', 0.35) +
      // La pezuña, partida al medio.
      forma(poli([[x - 7, y + alto - 9], [x + 8, y + alto - 9], [x + 8, y + alto + 1], [x - 7, y + alto + 1]]), C.tinta)) +
    trazo(`M${f(x + 0.5)} ${f(y + alto - 8)} l0 8`, C.bronce, 0.9, 0.9),
  );
}

/* ------------------------------------------------------------------
   El cuerpo pelado, con los cortes; el disfraz; el pañuelo
   ------------------------------------------------------------------ */

function cuerpo(): string {
  const d = curva([[-58, -86], [-30, -97], [20, -97], [50, -90], [58, -72], [46, -55], [0, -49], [-44, -53], [-62, -68]]);
  return conGrano(
    enmascarado('m-borrego-cuerpo', d,
      forma(d, C.cera) + nube(0, -52, 60, 9, C.ceraHonda, 'm', 0.85) + nube(-50, -70, 12, 14, C.verde, 's', 0.3) + nube(4, -92, 44, 5, C.hueso, 's', 0.6) +
      // Las costillas, que se le cuentan.
      trazo('M-14 -88 q-4 14 0 30 M0 -90 q-4 14 0 32 M14 -90 q-4 14 0 32 M28 -88 q-4 12 0 28', C.ceraHonda, 1.3, 0.55)) +
    // Los cortes del carnicero, a línea de puntos: el cuarto de atrás, el costillar, la paleta, y el sello.
    puntos('M-28 -96 Q-34 -74 -26 -51') + puntos('M-8 -97 Q-12 -74 -6 -49') + puntos('M30 -96 Q24 -76 32 -52') + puntos('M-28 -74 L30 -76', 1.3, 0.8) +
    `<circle cx="10" cy="-64" r="6.5" fill="none" stroke="${C.cobre}" stroke-width="1.3" opacity="0.8"/>` + trazo('M7 -64 l6 0 M10 -67 l0 6', C.cobre, 1.1, 0.8),
  );
}

/** El disfraz: el vellón, con el cierre en el lomo, las costuras y las mangas de las patas. */
function vellon(): string {
  const { d, rulos } = lana(-2, -76, 68, 35, 15, 311);
  const [zx, zy] = A.cierre;
  // Las mangas: cuatro tubitos de lana por donde salen las patas.
  const mangas = [A.hombros[0], A.caderas[0]].map(([x, y]) => elipse(x, y + 16, 11, 9)).join(' ');
  const todo = `${d} ${mangas}`;
  let dientes = '';
  for (let y = zy + 6; y < -46; y += 4.4) dientes += trazo(`M${f(zx - 2.6)} ${f(y)} l5.2 0`, C.bronce, 1.2, 0.9);
  return conGrano(
    enmascarado('m-borrego-vellon', todo,
      forma(todo, C.marfil) + nube(-4, -48, 64, 12, C.cera, 'm', 0.9) + nube(-4, -42, 60, 6, C.verdeClaro, 'm', 0.45) + nube(-50, -70, 14, 20, C.cera, 'm', 0.6) + nube(10, -104, 40, 8, C.hueso, 's', 0.9) + rulos) +
    // El cierre: la cinta, los dientes y el carrito de oro, con su tirador.
    trazo(`M${zx} ${zy} L${zx} -46`, C.ceraHonda, 5, 0.7) + dientes +
    forma(poli([[zx - 4, zy - 4], [zx + 4, zy - 4], [zx + 5, zy + 5], [zx - 5, zy + 5]]), C.oro) + trazo(`M${zx} ${zy + 4} l-5 9`, C.oroClaro, 1.6) + forma(elipse(zx - 6, zy + 15, 2.6, 3.4), C.oroClaro) +
    // Las costuras, a puntadas largas, y la etiqueta del disfraz cosida en el anca.
    trazo('M-52 -92 q-8 16 -2 36', C.ceraHonda, 1, 0.6) + forma(poli([[-58, -58], [-46, -60], [-45, -52], [-57, -50]]), C.oroClaro, 0.9) + trazo('M-55 -56 l7 -1 M-55 -53.6 l5 -0.8', C.bronce, 0.7, 0.8),
  );
}

/**
 * El pañuelo rojo atado al cogote: el nudo, las dos puntas y la herida copiada. *Luzbelito* no tiene rojo: el del
 * marco es un naranja, y sobre el pasto naranja no se veía. Va de dos tintas: ese rojo adentro, y un canto oscuro,
 * el de la base del busto, que es el que lo recorta. Los lunares de marfil lo hacen pañuelo y no mancha.
 */
function panuelo(): string {
  const [nx, ny] = A.cuello;
  const d = curva([[nx - 11, ny - 3], [nx + 9, ny - 5], [nx + 11, ny + 7], [nx + 3, ny + 13], [nx + 11, ny + 36], [nx - 1, ny + 28], [nx - 12, ny + 40], [nx - 10, ny + 13]]);
  return conGrano(
    trazo(d, C.sombra, 3.4) +
    enmascarado('m-borrego-panuelo', d, forma(d, C.rojo) + nube(nx - 4, ny + 32, 8, 8, C.cobre, 'xs', 0.8) + nube(nx + 8, ny + 20, 3, 12, C.cobre, 'xs', 0.6) +
      // La herida, copiada en el paño: una mancha oscura, con sus gotas.
      nube(nx, ny + 18, 3.6, 4.6, C.sombra, 'xs', 0.9) +
      [[-6, 10], [5, 9], [-7, 26], [6, 27], [0, 34], [-3, -1]].map(([x, y]) => forma(elipse(nx + x!, ny + y!, 1.3, 1.3), C.hueso, 0.9)).join('')) +
    forma(elipse(nx - 1, ny + 3, 5, 4.4), C.sombra) + forma(elipse(nx - 1, ny + 3, 3.4, 3), C.cobre) + trazo(`M${nx - 4} ${ny + 2} q3 -2 6 0`, C.oroClaro, 0.8, 0.7),
  );
}

/** El cogote: lo que une la cabeza con el cuerpo. Gira con la cabeza, la mitad, y tapa el hueco cuando la agacha. */
function cuello(): string {
  const d = curva([[34, -72], [36, -92], [48, -108], [64, -108], [74, -96], [70, -78], [54, -66], [42, -66]]);
  return conGrano(enmascarado('m-borrego-cuello', d, forma(d, C.bronce) + nube(46, -72, 14, 8, C.sombra, 's', 0.7) + nube(54, -102, 12, 5, C.oro, 's', 0.3) + trazo('M44 -98 q-4 12 2 26 M56 -104 q-3 14 4 30', C.sombra, 0.9, 0.5)));
}

/* ------------------------------------------------------------------
   La cabeza: la cara, la capucha de lana, la quijada, las orejas, el ojo
   ------------------------------------------------------------------ */

function cabeza(): string {
  const d = curva([[50, -96], [54, -120], [70, -132], [92, -129], [108, -114], [116, -101], [106, -91], [84, -88], [60, -84]]);
  const { centro: [ex, ey], radio: [rx, ry] } = A.ojo;
  const [hx, hy] = A.hocico;
  const [nx, ny] = A.cuello;
  const capucha = lana(66, -124, 22, 15, 9, 313);
  return conGrano(
    enmascarado('m-borrego-cabeza', d,
      forma(d, C.bronce) + nube(96, -106, 18, 10, C.cera, 's', 0.55) + nube(70, -92, 20, 8, C.sombra, 's', 0.7) + nube(88, -124, 16, 5, C.oro, 's', 0.4)) +
    // La línea de puntos del cogote: por acá. Y la tijerita.
    puntos(`M${nx - 2} ${ny - 16} Q${nx + 8} ${ny - 2} ${nx + 4} ${ny + 12}`, 2, 1) +
    trazo(`M${nx + 12} ${ny - 16} l5 6 M${nx + 17} ${ny - 16} l-5 6`, C.oroClaro, 1, 0.9) + `<circle cx="${nx + 11}" cy="${ny - 8.6}" r="1.6" fill="none" stroke="${C.oroClaro}" stroke-width="0.9"/><circle cx="${nx + 18}" cy="${ny - 8.6}" r="1.6" fill="none" stroke="${C.oroClaro}" stroke-width="0.9"/>` +
    // La capucha del disfraz, que no se le cae: sigue atada abajo de la quijada.
    enmascarado('m-borrego-capucha', capucha.d, forma(capucha.d, C.marfil) + nube(62, -114, 20, 6, C.cera, 's', 0.8) + nube(70, -134, 14, 4, C.hueso, 'xs', 0.9) + capucha.rulos) +
    trazo('M58 -110 Q62 -94 76 -86', C.marfil, 1.6, 0.85) +
    // El ojo: de oro, con la pupila acostada de las ovejas.
    forma(elipse(ex, ey, rx + 1.2, ry + 1.2), C.tinta) + forma(elipse(ex, ey, rx, ry), C.oroClaro) + nube(ex + 1, ey + 2, 3, 2, C.oro, 'xs', 0.7) +
    // El hocico: la nariz partida y la boca de no haber entendido.
    forma(poli([[hx - 3, hy - 6], [hx + 3, hy - 5], [hx + 1, hy]]), C.tinta) + trazo(`M${hx + 1} ${hy} l-1 4 M${hx} ${hy + 4} q-10 4 -20 0`, C.tinta, 1.3, 0.85),
  );
}

function quijada(): string {
  const [qx, qy] = A.quijada;
  const d = curva([[qx - 6, qy - 2], [qx + 10, qy - 3], [qx + 24, qy - 2], [qx + 26, qy + 3], [qx + 12, qy + 8], [qx - 4, qy + 7]]);
  return conGrano(enmascarado('m-borrego-quijada', d, forma(d, C.bronce) + nube(qx + 10, qy + 1, 12, 3, C.sombra, 'xs', 0.7)) + [8, 13, 18].map((x) => forma(poli([[qx + x, qy - 3], [qx + x + 3.4, qy - 3], [qx + x + 3, qy - 6.4], [qx + x + 0.4, qy - 6.4]]), C.hueso)).join(''));
}

/** Una oreja caída, de borrego, con el adentro de cera. */
function oreja(n: 0 | 1): string {
  const [ox, oy] = A.orejas[n];
  const d = curva([[ox + 4, oy - 5], [ox - 12, oy - 6], [ox - 26, oy + 2], [ox - 30, oy + 12], [ox - 18, oy + 12], [ox - 4, oy + 6], [ox + 4, oy + 4]]);
  return conGrano(enmascarado(`m-borrego-oreja-${n}`, d, forma(d, n ? C.bronce : C.sombra) + nube(ox - 14, oy + 4, 10, 4, C.cera, 'xs', n ? 0.6 : 0.3)));
}

function parpado(): string {
  const { centro: [ex, ey], radio: [rx, ry] } = A.ojo;
  return conGrano(forma(elipse(ex, ey, rx + 2.2, ry + 2.2), C.bronce) + trazo(`M${ex - rx - 1} ${ey + 1} Q${ex} ${ey + ry + 2} ${ex + rx + 1} ${ey + 1}`, C.tinta, 1.1));
}

function pupila(): string {
  const { centro: [ex, ey] } = A.ojo;
  return forma(`M${ex - 4} ${ey - 1.5} h8 v3 h-8 Z`, C.tinta) + forma(elipse(ex + 2, ey - 2.4, 1, 1), C.hueso);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;
const O = A.ojo.centro;
const cajaDePata = ([x, y]: P): readonly [number, number, number, number] => [x - 12, y - 10, 24, -y + 14];

export const PIEZAS_BORREGO: readonly Pieza[] = [
  { nombre: 'borrego-pasto', caja: [-90, -18, 180, 30], dibujo: pasto(), densidad: 1.8 },
  { nombre: 'borrego-cola', caja: [A.cola[0] - 18, A.cola[1] - 10, 26, 34], dibujo: cola(), densidad: D },
  { nombre: 'borrego-pata-tras-2', caja: cajaDePata(A.caderas[1]), dibujo: pata(A.caderas[1], 1, true), densidad: D },
  { nombre: 'borrego-pata-del-2', caja: cajaDePata(A.hombros[1]), dibujo: pata(A.hombros[1], 1, false), densidad: D },
  { nombre: 'borrego-cuerpo', caja: [-68, -102, 132, 58], dibujo: cuerpo(), densidad: D },
  { nombre: 'borrego-pata-tras-1', caja: cajaDePata(A.caderas[0]), dibujo: pata(A.caderas[0], 0, true), densidad: D },
  { nombre: 'borrego-pata-del-1', caja: cajaDePata(A.hombros[0]), dibujo: pata(A.hombros[0], 0, false), densidad: D },
  { nombre: 'borrego-vellon', caja: [-78, -116, 152, 84], dibujo: vellon(), densidad: D },
  { nombre: 'borrego-cuello', caja: [28, -114, 52, 54], dibujo: cuello(), densidad: D * 1.2 },
  { nombre: 'borrego-oreja-1', caja: [A.orejas[0][0] - 34, A.orejas[0][1] - 10, 42, 26], dibujo: oreja(0), densidad: D * 1.4 },
  { nombre: 'borrego-quijada', caja: [A.quijada[0] - 10, A.quijada[1] - 10, 40, 22], dibujo: quijada(), densidad: D * 1.6 },
  { nombre: 'borrego-cabeza', caja: [38, -146, 84, 80], dibujo: cabeza(), densidad: D * 1.4 },
  { nombre: 'borrego-pupila', caja: [O[0] - 6, O[1] - 6, 12, 12], dibujo: pupila(), densidad: D * 2.4 },
  { nombre: 'borrego-parpado', caja: [O[0] - 11, O[1] - 10, 22, 20], dibujo: parpado(), densidad: D * 2 },
  { nombre: 'borrego-oreja-2', caja: [A.orejas[1][0] - 34, A.orejas[1][1] - 10, 42, 26], dibujo: oreja(1), densidad: D * 1.4 },
  { nombre: 'borrego-panuelo', caja: [A.cuello[0] - 16, A.cuello[1] - 9, 32, 54], dibujo: panuelo(), densidad: D * 1.4 },
];

const img = imagenesDe(PIEZAS_BORREGO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El borrego armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t } = marcas(m);
  return (
    img('borrego-pasto') +
    parte('cuerpo',
      parte('cola', img('borrego-cola'), t.cola) +
      parte('pata-tras-2', img('borrego-pata-tras-2'), t['pata-tras-2']) +
      parte('pata-del-2', img('borrego-pata-del-2'), t['pata-del-2']) +
      parte('tronco', img('borrego-cuerpo'), t.tronco) +
      parte('pata-tras-1', img('borrego-pata-tras-1'), t['pata-tras-1']) +
      parte('pata-del-1', img('borrego-pata-del-1'), t['pata-del-1']) +
      parte('vellon', img('borrego-vellon'), t.vellon) +
      parte('cuello', img('borrego-cuello'), t.cuello) +
      parte('cabeza',
        parte('oreja-1', img('borrego-oreja-1'), t['oreja-1']) +
        parte('quijada', img('borrego-quijada'), t.quijada) +
        img('borrego-cabeza') +
        parte('pupila', img('borrego-pupila'), t.pupila) +
        parte('parpado', img('borrego-parpado'), t.parpado) +
        parte('oreja-2', img('borrego-oreja-2'), t['oreja-2']),
        t.cabeza) +
      parte('panuelo', img('borrego-panuelo'), t.panuelo),
      t.cuerpo)
  );
}

/** El borrego en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function borregoEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: parado, con el disfraz puesto, mirando al palo. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--borrego" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El borrego'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: pelado, con el disfraz en las pezuñas y los cortes a la vista. */
export const RETRATO = { caja: [BORREGO.x - 52, BORREGO.piso - 80, 124, 92] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/monte-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/monte-cerca.webp" x="0" y="240" width="900" height="400" preserveAspectRatio="none"/>` +
    borregoEn(DESNUDO)
  );
}

export const BORREGO_PERSONAJE: Personaje = {
  id: ID,
  region: 'la-pastura',
  ancla: BORREGO.x,
  piezas: PIEZAS_BORREGO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
