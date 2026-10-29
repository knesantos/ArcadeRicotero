/**
 * El diablo más veloz (`D-73`, vigésima vuelta), arrastrando los pies por el damero del infierno.
 *
 * *"Llegó el que no tiene tiempo, el diablo más veloz, arrastrando los pies"* es de *Fanfarria del
 * cabrío*, el cuarto tema de *Luzbelito* (1996). Por eso viste la contratapa de ese disco, medida con
 * sharp: el saco es el revoque verdoso de la pared, la piel es el óxido del óvalo, los cuernos y la lengua
 * son la cera de las dos velas. El diablo que mea ya se había llevado el frente y el interior.
 *
 * De la letra son el que no tiene tiempo (el reloj de bolsillo sin agujas), el que arrastra los pies, la
 * manzana que muerde solo porque se la prohibieron (con su sello de prohibido pegado, como las frutas del
 * mercado), el cuerpo del delito escondido en el corazón (el fuego robado que le asoma del bolsillo de
 * adentro), la lengua de oro y la Caja de los Truenos. Del dibujo, que es un cabrío entero: patas de chivo,
 * barba, la pupila partida de las cabras.
 *
 * Coordenadas: el (0, 0) es el piso entre las pezuñas (`rig-veloz.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { caja as rect, cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { CAJA, PATADA, QUIETO, VELOZ, VELOZ_ARMADO as A, marcas, type Momento } from './rig-veloz.ts';

/** Las tintas de la contratapa de *Luzbelito* (`tokens.css`). */
const C = {
  pared: 'var(--bestia-veloz-pared)',
  paredClara: 'var(--bestia-veloz-pared-clara)',
  paredHonda: 'var(--bestia-veloz-pared-honda)',
  oxido: 'var(--bestia-veloz-oxido)',
  oxidoHondo: 'var(--bestia-veloz-oxido-hondo)',
  verdin: 'var(--bestia-veloz-verdin)',
  cera: 'var(--bestia-veloz-cera)',
  ceraAmbar: 'var(--bestia-veloz-cera-ambar)',
  ceraClara: 'var(--bestia-veloz-cera-clara)',
  rosa: 'var(--bestia-veloz-rosa)',
};

/* ------------------------------------------------------------------
   Las patas de chivo y la cola
   ------------------------------------------------------------------ */

/**
 * Una pata de chivo: el muslo baja para adelante, el garrón se quiebra para atrás y la pezuña partida
 * arrastra la punta. Peluda, del hierro del óvalo, con la luz de la vela en el canto.
 */
function pata(n: 0 | 1): string {
  const [hx, hy] = A.caderas[n];
  const lejos = n === 1;
  // El muslo ancho y peludo baja para adelante; el garrón se quiebra para atrás, filoso; la caña es flaca.
  const pts: P[] = [[hx - 16, hy - 6], [hx + 16, hy - 4], [hx + 14, hy + 24], [hx + 4, hy + 46], [hx + 18, hy + 74], [hx + 9, hy + 108], [hx - 3, hy + 108], [hx + 4, hy + 78], [hx - 12, hy + 56], [hx - 22, hy + 30]];
  const P0 = curva(pts);
  // El pelo de chivo: mechones largos que cuelgan del muslo y del garrón, más claros en el canto.
  const pelo = Array.from({ length: 12 }, (_, i) => {
    const y = hy + 4 + i * 6;
    const x = hx - 20 + (i < 8 ? i * 1.6 : 12 + (i - 8) * 2.4);
    return trazo(`M${x} ${y} q-4 5 -7 11`, i % 3 ? C.verdin : C.oxido, 1.2, 0.8);
  }).join('');
  const fleco = Array.from({ length: 5 }, (_, i) => trazo(`M${hx - 18 + i * 2} ${hy + 40 + i * 4} q-6 4 -8 10`, C.oxidoHondo, 1.6, 0.9)).join('');
  // La pezuña partida, negra y lustrosa, con la punta gastada de arrastrarla.
  const pezuna = (dx: number): string => curva([[hx + dx - 7, hy + 106], [hx + dx + 5, hy + 106], [hx + dx + 4, hy + 122], [hx + dx - 10, hy + 124], [hx + dx - 12, hy + 118]]);
  return conGrano(
    enmascarado(`m-vel-pata-${n}`, P0,
      forma(P0, lejos ? C.verdin : C.oxidoHondo) +
      nube(hx - 12, hy + 14, 9, 28, C.oxido, 'm', lejos ? 0.25 : 0.55) + nube(hx + 12, hy + 76, 5, 18, C.oxido, 'm', lejos ? 0.2 : 0.45) +
      nube(hx + 12, hy + 36, 10, 40, C.verdin, 'm', 0.75) + nube(hx + 2, hy + 100, 8, 10, C.verdin, 's', 0.8) + pelo) +
    (lejos ? '' : fleco) +
    forma(pezuna(-2), C.verdin) + forma(pezuna(6), C.verdin) + trazo(`M${hx + 2} ${hy + 108} l-1 16`, C.oxidoHondo, 1.4) +
    nube(hx - 4, hy + 110, 5, 2, C.cera, 'xs', lejos ? 0.25 : 0.6),
  );
}

function cola(): string {
  const [cx, cy] = A.cola;
  const d = `M${cx} ${cy} C${cx + 30} ${cy + 10} ${cx + 44} ${cy + 50} ${cx + 30} ${cy + 80} C${cx + 22} ${cy + 96} ${cx + 34} ${cy + 104} ${cx + 44} ${cy + 98}`;
  const punta = poli([[cx + 40, cy + 92], [cx + 58, cy + 94], [cx + 46, cy + 108]]);
  return conGrano(trazo(d, C.oxidoHondo, 4.6) + trazo(d, C.oxido, 2, 0.8) + forma(punta, C.oxido) + nube(cx + 48, cy + 96, 4, 3, C.cera, 'xs', 0.5));
}

/* ------------------------------------------------------------------
   El torso: el saco de revoque y el fuego robado
   ------------------------------------------------------------------ */

const SACO: readonly P[] = [[-20, -206], [-34, -198], [-40, -180], [-40, -150], [-36, -112], [-10, -104], [20, -106], [36, -112], [38, -150], [36, -184], [28, -200], [10, -208]];

function cuerpo(): string {
  const d = curva(SACO);
  // Las solapas anchas y gastadas, y la camisa negra adentro.
  const camisa = poli([[-8, -206], [10, -206], [4, -150], [-4, -150]]);
  const solapa = (s: number): string => curva([[s * 2, -206], [s * 18, -202], [s * 14, -176], [s * 4, -150], [s * 2, -170]]);
  const [bx, by] = A.bolsillo;
  // El bolsillo de adentro: una raja oscura en la solapa de él, con el resplandor del fuego que esconde.
  const bolsillo = forma(poli([[bx - 7, by], [bx + 7, by - 2], [bx + 6, by + 3], [bx - 6, by + 4]]), C.verdin) + nube(bx, by - 2, 12, 8, C.ceraAmbar, 'm', 0.45);
  const botones = [-140, -124].map((y) => forma(elipse(2, y, 2.4, 2.4), C.verdin) + nube(1.4, y - 0.6, 1, 1, C.cera, 'xs', 0.6)).join('');
  const adentro =
    forma(d, C.pared) +
    // La luz de las velas desde la derecha (de él, atrás), la sombra honda adelante y abajo; el revoque se agrieta.
    nube(26, -180, 16, 30, C.paredClara, 'm', 0.7) + nube(30, -190, 6, 10, C.rosa, 's', 0.35) + nube(-30, -150, 18, 50, C.paredHonda, 'm', 0.8) + nube(0, -108, 40, 10, C.verdin, 'm', 0.75) +
    trazo('M-28 -170 l4 6 l-3 7 l5 6', C.paredHonda, 0.8, 0.7) + trazo('M24 -140 l-3 6 l4 5', C.paredHonda, 0.8, 0.6) +
    forma(camisa, C.verdin) + forma(solapa(-1), C.paredHonda) + forma(solapa(1), C.paredHonda) + nube(14, -196, 5, 6, C.paredClara, 's', 0.5) +
    bolsillo + botones;
  return conGrano(enmascarado('m-vel-saco', d, adentro));
}

/** El fuego robado, que le asoma del bolsillo de adentro: el cuerpo del delito. */
function fuego(): string {
  const [bx, by] = A.bolsillo;
  const lengua = (alto: number, ancho: number, torcida: number): string =>
    `M${bx - ancho} ${by} Q${bx - ancho * 1.2} ${by - alto * 0.5} ${bx + torcida} ${by - alto} Q${bx + ancho * 1.1} ${by - alto * 0.45} ${bx + ancho} ${by} Z`;
  return nube(bx, by - 6, 10, 10, C.ceraAmbar, 's', 0.5) + soplo(lengua(16, 5, 2), C.oxido, 'xs', 0.9) + soplo(lengua(12, 3.6, 1), C.ceraAmbar, 'xs') + forma(lengua(7, 2, 0), C.ceraClara);
}

/* ------------------------------------------------------------------
   La cabeza de cabrío: los cuernos, la pupila partida y la barba
   ------------------------------------------------------------------ */

function cuerno(base: P, s: number, lejos: boolean): string {
  const [x, y] = base;
  const g = lejos ? 0.8 : 1.08;
  // Se va para atrás y para arriba y se enrula en la punta, con los anillos del cuerno de chivo.
  const d = curva([[x - 6 * g, y], [x + 6 * s * g, y - 24 * g], [x + 24 * s * g, y - 42 * g], [x + 46 * s * g, y - 42 * g], [x + 52 * s * g, y - 30 * g], [x + 42 * s * g, y - 31 * g], [x + 24 * s * g, y - 30 * g], [x + 12 * s * g, y - 13 * g], [x + 7 * g, y + 2]]);
  const anillos = [0.2, 0.36, 0.52, 0.68].map((k) => trazo(`M${x + 8 * s + k * 28 * s} ${y - 6 - k * 34} l${4 * s} 6`, C.ceraAmbar, 1, 0.8)).join('');
  return enmascarado(`m-vel-cuerno-${lejos ? 'l' : 'c'}`, d, forma(d, lejos ? C.ceraAmbar : C.cera) + nube(x + 20 * s, y - 34, 18, 6, C.ceraClara, 's', lejos ? 0.3 : 0.7) + nube(x + 6 * s, y - 4, 8, 10, C.oxidoHondo, 's', 0.7) + anillos);
}

const CARA: readonly P[] = [[-2, -268], [12, -262], [18, -246], [14, -226], [2, -214], [-12, -216], [-26, -224], [-40, -232], [-48, -238], [-46, -246], [-32, -252], [-18, -262]];

function cabeza(): string {
  const d = curva(CARA);
  // El ojo de cabra: amarillo de cera, con la pupila partida de costado.
  const [ox, oy] = [-14, -248];
  const ojo = forma(elipse(ox, oy, 6, 4.4), C.verdin) + forma(elipse(ox, oy, 5, 3.6), C.ceraClara) + nube(ox + 1, oy + 1, 4, 2.4, C.ceraAmbar, 'xs', 0.8) +
    forma(cajaRedonda(ox - 3.6, oy - 0.8, 7.2, 1.6, 0.8), C.verdin) + forma(elipse(ox - 2, oy - 1.6, 0.9, 0.7), C.rosa);
  const ceja = trazo(`M${ox - 8} ${oy - 7} Q${ox} ${oy - 11} ${ox + 9} ${oy - 6}`, C.oxidoHondo, 2.2);
  const oreja = curva([[6, -250], [24, -262], [40, -258], [26, -248], [10, -244]]);
  const nariz = forma(elipse(-44, -240, 3, 2), C.verdin) + trazo('M-46 -236 q4 2 6 0', C.oxidoHondo, 0.8);
  const adentro =
    forma(d, C.oxido) +
    // El hocico largo agarra la luz arriba; abajo y atrás la cara se hunde en el hierro.
    nube(-24, -252, 18, 5, C.rosa, 's', 0.4) + nube(-6, -260, 12, 6, C.ceraAmbar, 's', 0.35) +
    nube(8, -226, 14, 14, C.oxidoHondo, 'm', 0.85) + nube(-30, -226, 18, 5, C.oxidoHondo, 's', 0.6) +
    trazo('M-30 -244 q6 -2 10 0', C.oxidoHondo, 0.8, 0.6) + ojo + ceja + nariz;
  return conGrano(
    cuerno([14, -270], 1, true) +
    enmascarado('m-vel-oreja', oreja, forma(oreja, C.oxido) + nube(22, -254, 10, 4, C.oxidoHondo, 's', 0.7)) +
    enmascarado('m-vel-cara', d, adentro) +
    cuerno([-8, -264], 1, false) +
    // El pescuezo flaco, en la sombra de la cabeza.
    forma(curva([[-6, -218], [6, -220], [5, -204], [-5, -204]]), C.oxido) + nube(2, -210, 5, 6, C.oxidoHondo, 's', 0.8),
  );
}

/** La quijada con la barba de chivo: se abre para morder y la barba mastica con ella. */
function quijada(): string {
  const [qx, qy] = A.quijada;
  const d = curva([[qx + 10, qy + 6], [qx - 4, qy + 2], [qx - 20, qy - 4], [qx - 22, qy + 2], [qx - 6, qy + 10], [qx + 8, qy + 12]]);
  const barba = curva([[qx - 9, qy + 6], [qx + 4, qy + 9], [qx + 1, qy + 22], [qx - 6, qy + 40], [qx - 9, qy + 24]]);
  return conGrano(
    enmascarado('m-vel-quijada', d, forma(d, C.oxido) + nube(qx - 6, qy + 8, 14, 4, C.oxidoHondo, 's', 0.8)) +
    enmascarado('m-vel-barba', barba, forma(barba, C.oxido) + nube(qx - 6, qy + 12, 4, 8, C.rosa, 's', 0.35) + nube(qx + 2, qy + 20, 5, 14, C.oxidoHondo, 's', 0.8) + [0, 1, 2, 3].map((i) => trazo(`M${qx - 7 + i * 2.6} ${qy + 10} l${-2 + i} ${18 + i * 3}`, C.oxidoHondo, 0.7, 0.8)).join('')) +
    // Los dientes de abajo, chuecos.
    [0, 1, 2].map((i) => forma(poli([[qx - 18 + i * 5, qy - 2], [qx - 15 + i * 5, qy - 2], [qx - 16.5 + i * 5, qy - 6]]), C.cera)).join(''),
  );
}

/** La lengua de oro: larga, de la cera prendida de la vela, con la punta partida como la de las víboras. */
function lengua(): string {
  const [bx, by] = A.boca;
  const d = curva([[bx + 2, by - 2], [bx - 20, by - 3], [bx - 40, by + 2], [bx - 48, by - 2], [bx - 46, by + 4], [bx - 52, by + 8], [bx - 40, by + 6], [bx - 20, by + 4], [bx + 2, by + 3]]);
  return conGrano(enmascarado('m-vel-lengua', d, forma(d, C.cera) + nube(bx - 24, by - 1, 18, 1.6, C.ceraClara, 'xs', 0.9) + nube(bx - 10, by + 3, 12, 2, C.ceraAmbar, 'xs', 0.8)) + nube(bx - 30, by, 26, 8, C.ceraClara, 'm', 0.25));
}

/* ------------------------------------------------------------------
   Los brazos, la manzana prohibida y el reloj sin agujas
   ------------------------------------------------------------------ */

function brazo(n: 0 | 1): string {
  const [sx, sy] = A.hombros[n];
  const [hx, hy] = A.manos[n];
  const s = n === 0 ? -1 : 1;
  const [wx, wy] = [hx - s * 2, hy - 14];
  const manga = curva([[sx - 10, sy - 6], [sx + 10, sy - 4], [sx + s * 4 + 9, sy + 36], [wx + 9, wy], [wx - 9, wy], [sx + s * 4 - 9, sy + 38]]);
  // La mano flaca de óxido, con las uñas largas de cera.
  const mano = curva([[wx - 7, wy], [wx + 7, wy], [hx + 8, hy + 2], [hx + 4, hy + 8], [hx - 6, hy + 6]]);
  const unas = [-4, 0, 4].map((dx) => trazo(`M${hx + dx} ${hy + 6} l${s * 1} 6`, C.cera, 1.4)).join('');
  return conGrano(
    enmascarado(`m-vel-manga-${n}`, manga, forma(manga, n ? C.paredHonda : C.pared) + nube(sx + s * 6, sy + 20, 6, 24, C.paredClara, 'm', n ? 0.25 : 0.55) + nube(wx, wy, 12, 10, C.verdin, 'm', 0.6)) +
    trazo(`M${wx - 9} ${wy} l18 0`, C.verdin, 2) +
    enmascarado(`m-vel-mano-${n}`, mano, forma(mano, C.oxido) + nube(hx - 2, hy + 4, 5, 4, C.oxidoHondo, 's', 0.8)) + unas,
  );
}

/** La manzana con el sello de prohibido pegado, como las del mercado. Mordida, le falta el mordiscón. */
function manzana(mordida: boolean): string {
  const [hx, hy] = A.manos[0];
  const [cx, cy] = [hx - 6, hy + 2];
  const fruta = curva([[cx, cy - 11], [cx + 9, cy - 13], [cx + 13, cy - 4], [cx + 11, cy + 8], [cx + 3, cy + 13], [cx - 4, cy + 12], [cx - 12, cy + 6], [cx - 13, cy - 5], [cx - 8, cy - 12]]);
  const mordiscon = elipse(cx - 13, cy - 1, 6.5, 7.5);
  const sello = forma(elipse(cx + 4, cy + 2, 4.6, 4.6), C.cera) + `<circle cx="${cx + 4}" cy="${cy + 2}" r="3.3" fill="none" stroke="${C.oxido}" stroke-width="1.1"/>` + trazo(`M${cx + 1.8} ${cy + 4.2} l4.4 -4.4`, C.oxido, 1.1);
  const adentro =
    forma(fruta, C.oxido) + nube(cx - 4, cy - 5, 5, 4, C.rosa, 's', 0.8) + nube(cx + 7, cy + 7, 7, 6, C.oxidoHondo, 's', 0.8) +
    (mordida ? forma(mordiscon, C.ceraClara) + trazo(`M${cx - 7.5} ${cy - 7} Q${cx - 5} ${cy - 1} ${cx - 7.5} ${cy + 6}`, C.ceraAmbar, 1, 0.8) + [-4, 0, 4].map((dy) => forma(elipse(cx - 9, cy + dy, 0.8, 1.4), C.verdin)).join('') : '') +
    sello;
  return conGrano(enmascarado(`m-vel-manzana-${mordida ? 'm' : 'e'}`, fruta, adentro) + trazo(`M${cx - 1} ${cy - 11} q1 -5 3 -6`, C.verdin, 1.4) + forma(curva([[cx + 2, cy - 15], [cx + 9, cy - 19], [cx + 6, cy - 13]]), C.pared));
}

/** El reloj de bolsillo, colgado de la cadena: de oro de cera, con la esfera sin agujas. */
function reloj(): string {
  const [hx, hy] = A.manos[1];
  const [rx, ry] = [hx, hy + A.largoCadena];
  const cadena = Array.from({ length: 6 }, (_, i) => forma(elipse(hx, hy + 4 + i * ((A.largoCadena - 10) / 5), 1.3, 2), C.ceraAmbar)).join('');
  const marcas = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return trazo(`M${rx + Math.cos(a) * 6.4} ${ry + Math.sin(a) * 6.4} L${rx + Math.cos(a) * 7.6} ${ry + Math.sin(a) * 7.6}`, C.oxidoHondo, 0.8);
  }).join('');
  return conGrano(
    cadena + forma(rect(rx - 2, ry - 12, 4, 3), C.cera) +
    forma(elipse(rx, ry, 10, 10), C.ceraAmbar) + forma(elipse(rx, ry, 8.6, 8.6), C.rosa) + nube(rx - 3, ry - 3, 4, 4, C.ceraClara, 's', 0.9) + marcas +
    // Ni una aguja: el eje solo, en el medio.
    forma(elipse(rx, ry, 1.2, 1.2), C.verdin) + nube(rx + 5, ry + 6, 5, 3, C.oxidoHondo, 's', 0.5),
  );
}

/* ------------------------------------------------------------------
   Lo veloz: la estela y las chispas
   ------------------------------------------------------------------ */

/** El borrón que deja cuando se va de golpe: tiras sopladas del saco y del óxido, para atrás. */
function estela(): string {
  return [[-150, -170, 0.5], [-120, -200, 0.6], [-140, -130, 0.55], [-110, -240, 0.4], [-130, -60, 0.45]].map(([x, y, o], i) =>
    soplo(`M${x! + 120} ${y! - 10} L${x!} ${y! - 4} L${x!} ${y! + 4} L${x! + 120} ${y! + 12} Z`, i % 2 ? C.oxido : C.pared, 's', o!)).join('');
}

/** Las chispas de las pezuñas que arrastra contra el damero. */
function chispas(): string {
  return [[-14, -2, 8, -10], [-4, -4, 14, -16], [6, -1, 18, -6], [-20, -6, 4, -18]].map(([x, y, dx, dy]) => trazo(`M${x} ${y} l${dx} ${dy}`, C.ceraClara, 1.4, 0.9)).join('') + nube(-6, -3, 14, 5, C.ceraAmbar, 's', 0.6);
}

/* ------------------------------------------------------------------
   La Caja de los Truenos
   ------------------------------------------------------------------ */

function caja(): string {
  const { ancho: w, alto: h } = CAJA;
  const d = cajaRedonda(-w / 2, -h, w, h, 3);
  const tablas = [-h * 0.66, -h * 0.33].map((y) => trazo(`M${-w / 2} ${y} l${w} 0`, C.verdin, 1.2, 0.8)).join('');
  // El rayo pintado al frente, descascarado, y las esquinas de cera.
  const rayo = poli([[-4, -h + 8], [8, -h + 8], [2, -h / 2], [10, -h / 2], [-8, -6], [-2, -h / 2 + 4], [-10, -h / 2 + 4]]);
  const esquinas = [[-w / 2, -h], [w / 2 - 8, -h], [-w / 2, -8], [w / 2 - 8, -8]].map(([x, y]) => forma(cajaRedonda(x!, y!, 8, 8, 2), C.ceraAmbar)).join('');
  return conGrano(
    nube(0, 0, w * 0.7, 6, C.verdin, 's', 0.9) +
    enmascarado('m-vel-caja', d, forma(d, C.oxidoHondo) + nube(-w / 4, -h * 0.7, w / 3, h / 3, C.oxido, 'm', 0.35) + nube(w / 3, -h / 3, w / 4, h / 2, C.verdin, 'm', 0.8) + tablas +
      forma(rayo, C.cera, 0.85) + nube(-6, -h * 0.6, 6, 4, C.oxidoHondo, 'xs', 0.7) + esquinas),
  );
}

function tapa(): string {
  const { ancho: w, alto: h } = CAJA;
  const d = cajaRedonda(-w / 2 - 3, -h - 9, w + 6, 10, 3);
  return conGrano(enmascarado('m-vel-tapa', d, forma(d, C.oxidoHondo) + nube(-10, -h - 7, 22, 3, C.oxido, 's', 0.5) + nube(w / 2, -h - 2, 10, 6, C.verdin, 's', 0.8)) + forma(cajaRedonda(-6, -h - 6, 12, 5, 2), C.cera));
}

/** Los truenos que se escapan: rayos de cera prendida que salen para arriba, con el fogonazo rosado. */
function rayos(): string {
  const { alto: h } = CAJA;
  const zig = (x: number, giro: number, largo: number): string => {
    const pts: P[] = [];
    for (let i = 0; i <= 5; i++) pts.push([x + (i % 2 ? 7 : -7) + Math.sin(giro) * i * largo * 0.18, -h - i * largo * 0.2]);
    return `M${pts.map(([a, b]) => `${a} ${b}`).join(' L')}`;
  };
  const bolts = [[-14, -0.6, 90], [4, 0.1, 120], [20, 0.7, 84]].map(([x, g, l]) => trazo(zig(x!, g!, l!), C.ceraClara, 3) + trazo(zig(x!, g!, l!), C.rosa, 7, 0.35)).join('');
  return nube(0, -h - 40, 70, 60, C.rosa, 'l', 0.5) + nube(0, -h - 10, 34, 20, C.ceraClara, 'm', 0.8) + bolts;
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.2;
const [M1x, M1y] = A.manos[0];
const [M2x, M2y] = A.manos[1];

export const PIEZAS_VELOZ: readonly Pieza[] = [
  { nombre: 'veloz-estela', caja: [-160, -270, 290, 230], dibujo: estela(), densidad: 1 },
  { nombre: 'veloz-chispas', caja: [-30, -30, 60, 36], dibujo: chispas(), densidad: 3 },
  { nombre: 'veloz-pata-2', caja: [A.caderas[1][0] - 26, A.caderas[1][1] - 10, 48, 140], dibujo: pata(1), densidad: D },
  { nombre: 'veloz-cola', caja: [A.cola[0] - 6, A.cola[1] - 6, 70, 120], dibujo: cola(), densidad: D },
  { nombre: 'veloz-pata-1', caja: [A.caderas[0][0] - 26, A.caderas[0][1] - 10, 48, 140], dibujo: pata(0), densidad: D },
  { nombre: 'veloz-brazo-2', caja: [M2x - 24, A.hombros[1][1] - 12, 50, 106], dibujo: brazo(1), densidad: D },
  { nombre: 'veloz-reloj', caja: [M2x - 14, M2y - 4, 28, A.largoCadena + 18], dibujo: reloj(), densidad: D * 1.2 },
  { nombre: 'veloz-cuerpo', caja: [-46, -214, 90, 116], dibujo: cuerpo(), densidad: D },
  { nombre: 'veloz-fuego', caja: [A.bolsillo[0] - 14, A.bolsillo[1] - 24, 28, 30], dibujo: fuego(), densidad: 4 },
  { nombre: 'veloz-cabeza', caja: [-54, -312, 108, 112], dibujo: cabeza(), densidad: D * 1.1 },
  { nombre: 'veloz-quijada', caja: [A.quijada[0] - 28, A.quijada[1] - 10, 44, 52], dibujo: quijada(), densidad: D * 1.2 },
  { nombre: 'veloz-lengua', caja: [A.boca[0] - 60, A.boca[1] - 14, 66, 26], dibujo: lengua(), densidad: D * 1.2 },
  { nombre: 'veloz-brazo-1', caja: [M1x - 24, A.hombros[0][1] - 12, 50, 106], dibujo: brazo(0), densidad: D },
  { nombre: 'veloz-manzana', caja: [M1x - 24, M1y - 24, 34, 40], dibujo: manzana(false), densidad: D * 1.4 },
  { nombre: 'veloz-mordida', caja: [M1x - 24, M1y - 24, 34, 40], dibujo: manzana(true), densidad: D * 1.4 },
  { nombre: 'veloz-caja', caja: [-CAJA.ancho / 2 - 8, -CAJA.alto - 4, CAJA.ancho + 16, CAJA.alto + 14], dibujo: caja(), densidad: D },
  { nombre: 'veloz-tapa', caja: [-CAJA.ancho / 2 - 6, -CAJA.alto - 12, CAJA.ancho + 12, 16], dibujo: tapa(), densidad: D },
  { nombre: 'veloz-rayos', caja: [-90, -CAJA.alto - 140, 180, 160], dibujo: rayos(), densidad: 1.6 },
];

const img = imagenesDe(PIEZAS_VELOZ);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El diablo armado con las marcas de un momento (sin la caja). */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return parte('anda',
    `<ellipse cx="0" cy="2" rx="46" ry="8" class="bt-veloz-sombra"/>` +
    parte('estela', img('veloz-estela'), '', o.estela) +
    parte('chispas', img('veloz-chispas'), '', o.chispas) +
    parte('pata-2', img('veloz-pata-2'), t['pata-2']) +
    parte('torso',
      parte('cola', img('veloz-cola'), t.cola) +
      parte('brazo-2', img('veloz-brazo-2') + parte('reloj', img('veloz-reloj'), t.reloj), t['brazo-2']) +
      img('veloz-cuerpo') +
      parte('fuego', img('veloz-fuego'), t.fuego) +
      parte('cabeza', img('veloz-cabeza') + parte('lengua', img('veloz-lengua'), t.lengua, o.lengua) + parte('quijada', img('veloz-quijada'), t.quijada), t.cabeza) +
      parte('brazo-1', img('veloz-brazo-1'), t['brazo-1']) +
      parte('fruta', parte('entera', img('veloz-manzana'), '', o.entera) + parte('mordida', img('veloz-mordida'), '', o.mordida), t.fruta),
      t.torso) +
    parte('pata-1', img('veloz-pata-1'), t['pata-1']),
    t.anda);
}

/** La Caja de los Truenos en un momento. */
function cajaEn(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return parte('caja', parte('rayos', img('veloz-rayos'), '', o.rayos) + img('veloz-caja') + parte('tapa', img('veloz-tapa'), t.tapa), t.caja);
}

/** El diablo más veloz en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function velozEn(m: Momento = QUIETO): string {
  return cajaEn(m) + `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta, y al lado la Caja de los Truenos. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--veloz" data-id="el-diablo-mas-veloz" role="button" tabindex="0" aria-label="${nombres.get('el-diablo-mas-veloz') ?? 'El diablo más veloz'}">` +
    cajaEn(QUIETO) +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: pateando la Caja de los Truenos, con la lengua de oro afuera. */
export const RETRATO = { caja: [VELOZ.x + PATADA.dx - 70, VELOZ.piso - 262, 190, 280] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('infierno-lejos') + fondo('infierno-cerca') + velozEn(PATADA);
}

export const VELOZ_PERSONAJE: Personaje = {
  id: 'el-diablo-mas-veloz',
  region: 'el-infierno',
  ancla: VELOZ.x,
  piezas: PIEZAS_VELOZ,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
