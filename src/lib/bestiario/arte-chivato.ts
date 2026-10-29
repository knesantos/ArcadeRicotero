/**
 * El chivato (`D-73`, vigesimotercera vuelta), con la oreja pegada a la reja de la celda del reo, en el ala
 * de la izquierda de la prisión de Barbazul.
 *
 * *"Penas del corazón que duran siempre menos que las de prisión, chivato"* es de *Murga purga*, en
 * *Momo Sampler* (2000). La palabra sirve para el animal y para el buchón, y el dibujo usa las dos: es un
 * chivito parado en dos patas, vestido de murguero —levita con lentejuelas y faldones, galera chiquita
 * entre los cuernitos, guantes blancos—, que escucha lo que se dice adentro de la celda y lo anota en una
 * libretita, con el lápiz atrás de la oreja. Mira de reojo para el pasillo con sus ojos de cabra, la pupila
 * de rendija acostada, por si viene alguien.
 *
 * De la letra son también el buche y el sebo (la panza redonda adentro de la levita), el bolsillo dado vuelta
 * (*"ya no hay más propina"*) y el balido cuando canta. Del dibujo: la hoja de la libreta que se come, como
 * buen chivo, y la gota de sudor cuando lo descubren.
 *
 * Viste la cara del interior de *Momo Sampler*, medida con sharp (`tokens.css`): el pelo violeta casi negro
 * con la luz lila, las rayas de pintura de murga en los cachetes y el brillo de plata de la nariz. La levita
 * es la luz violeta de la contratapa, el oro es el de las letras del título, y los cuernos y la barbita, el
 * lomo plateado de la tapa.
 *
 * Coordenadas: el (0, 0) es el piso entre las pezuñas, y está de frente (`rig-chivato.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { PIEZAS_PRISION } from './arte-prision.ts';
import { cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { CANTA, CHIVATO, CHIVATO_ARMADO as A, QUIETO, marcas, type Momento } from './rig-chivato.ts';

const ID = 'el-chivato';

/** Las tintas de *Momo Sampler* (`tokens.css`). */
const C = {
  hondo: 'var(--bestia-chivato-hondo)',
  pelo: 'var(--bestia-chivato-pelo)',
  lila: 'var(--bestia-chivato-lila)',
  lilaClara: 'var(--bestia-chivato-lila-clara)',
  brillo: 'var(--bestia-chivato-brillo)',
  pintura: 'var(--bestia-chivato-pintura)',
  pinturaViva: 'var(--bestia-chivato-pintura-viva)',
  plata: 'var(--bestia-chivato-plata)',
  plataClara: 'var(--bestia-chivato-plata-clara)',
  peltre: 'var(--bestia-chivato-peltre)',
  peltreHondo: 'var(--bestia-chivato-peltre-hondo)',
  oro: 'var(--bestia-chivato-oro)',
  oroHondo: 'var(--bestia-chivato-oro-hondo)',
  levita: 'var(--bestia-chivato-levita)',
  levitaHonda: 'var(--bestia-chivato-levita-honda)',
  papel: 'var(--bestia-chivato-papel)',
  negro: 'var(--bestia-chivato-negro)',
  rojo: 'var(--bestia-chivato-rojo)',
};

/** Un azar fijo, para que las lentejuelas caigan siempre en el mismo lugar. */
function sembrar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a * 16807) % 2147483647;
    return (a - 1) / 2147483646;
  };
}

/** Una lentejuela: el disquito de oro con su brillo. */
const lentejuela = (x: number, y: number, r = 1.2): string =>
  forma(elipse(x, y, r, r), C.oro) + forma(elipse(x - r * 0.3, y - r * 0.3, r * 0.4, r * 0.4), C.papel, 0.9);

/** Lentejuelas desparramadas adentro de una caja (x, y, ancho, alto). */
function lentejuelas(x: number, y: number, w: number, h: number, n: number, semilla: number): string {
  const r = sembrar(semilla);
  return Array.from({ length: n }, () => lentejuela(x + r() * w, y + r() * h, 0.9 + r() * 0.6)).join('');
}

/* ------------------------------------------------------------------
   Las piernas: bombacha de murga, la caña peluda y la pezuña partida
   ------------------------------------------------------------------ */

function pierna(n: 0 | 1): string {
  const s = n ? 1 : -1;
  const [px] = A.pezunas[n];
  const bombacha = curva([[s * 2, -82], [s * 21, -80], [s * 24, -60], [s * 21, -42], [s * 9, -38], [s * 3, -58]]);
  const cana = poli([[s * 10, -44], [s * 21, -44], [s * 20, -26], [s * 21, -10], [s * 9, -10], [s * 11, -28]]);
  const pezuna = curva([[px - 8, -10], [px + 8, -10], [px + 9, -1], [px - 9, -1]]);
  return conGrano(
    enmascarado(`m-chivato-cana-${n}`, cana, forma(cana, C.pelo) + nube(px - s * 3, -28, 4, 14, C.lila, 's', 0.7) + nube(px + s * 4, -16, 4, 8, C.hondo, 's', 0.8)) +
    // Los mechones de pelo que asoman abajo de la bombacha.
    forma(poli([[s * 8, -42], [s * 11, -34], [s * 14, -41], [s * 17, -33], [s * 20, -42], [s * 23, -36], [s * 22, -44], [s * 8, -44]]), C.pelo) +
    enmascarado(`m-chivato-pezuna-${n}`, pezuna, forma(pezuna, C.negro) + nube(px - 3, -7, 4, 2, C.peltre, 's', 0.8)) +
    trazo(`M${px} -9 L${px} -1`, C.peltreHondo, 1.2) +
    enmascarado(`m-chivato-bombacha-${n}`, bombacha,
      forma(bombacha, C.levitaHonda) + nube(s * 12, -66, 8, 12, C.levita, 'm', 0.95) + nube(s * 16, -50, 6, 6, C.lila, 's', 0.45) +
      lentejuelas(s > 0 ? 4 : -22, -78, 18, 36, 5, 31 + n)) +
    // El ribete de la bombacha, fruncido en la caña.
    trazo(`M${s * 9} -40 Q${s * 15} -36 ${s * 21} -42`, C.oro, 1.4, 0.9),
  );
}

/** Los faldones de la levita, que cuelgan atrás, con los flecos de murga. */
function faldones(): string {
  const una = (s: number): string => {
    const d = curva([[s * 16, -92], [s * 30, -88], [s * 40, -60], [s * 38, -40], [s * 30, -44], [s * 24, -52], [s * 18, -76]]);
    const flecos = Array.from({ length: 6 }, (_, i) => {
      const x = s * (25 + i * 2.6);
      const y = -45 + Math.abs(i - 3) * 1.5;
      return trazo(`M${x} ${y} l${s * 0.8} 9`, i % 2 ? C.oro : C.oroHondo, 1.2);
    }).join('');
    return enmascarado(`m-chivato-faldon-${s > 0 ? 2 : 1}`, d, forma(d, C.levitaHonda) + nube(s * 30, -70, 6, 18, C.levita, 'm', 0.8) + nube(s * 26, -50, 8, 6, C.pintura, 's', 0.7) + lentejuelas(s > 0 ? 18 : -40, -86, 22, 40, 7, s > 0 ? 7 : 9)) + flecos;
  };
  return conGrano(una(-1) + una(1));
}

/* ------------------------------------------------------------------
   El torso: la levita de murguero, con el buche y el sebo adentro
   ------------------------------------------------------------------ */

const LEVITA: readonly P[] = [[-24, -142], [-10, -149], [10, -149], [24, -142], [29, -124], [31, -104], [27, -84], [15, -72], [0, -70], [-15, -72], [-27, -84], [-31, -104], [-29, -124]];

function cuerpo(): string {
  const d = curva(LEVITA);
  const pechera = poli([[-9, -148], [9, -148], [0, -114]]);
  const solapa = (s: number): string => forma(poli([[s * 10, -148], [s * 3, -140], [s * 1, -114], [s * 7, -118], [s * 18, -140]]), C.pintura) + trazo(`M${s * 10} -147 L${s * 2} -116`, C.pinturaViva, 0.9, 0.8);
  const lazo = forma(poli([[0, -143], [-8, -147], [-8, -139]]), C.oro) + forma(poli([[0, -143], [8, -147], [8, -139]]), C.oro) + forma(elipse(0, -143, 2, 2), C.oroHondo);
  const botones = [-104, -94, -84].map((y) => forma(elipse(-3, y, 1.6, 1.6), C.oro) + forma(elipse(-3.4, y - 0.5, 0.6, 0.6), C.papel)).join('');
  // *"Ya no hay más propina"*: el bolsillo dado vuelta, con el forro colgando.
  const bolsillo = trazo('M12 -86 L24 -86', C.negro, 1.4) + forma(curva([[13, -86], [23, -86], [22, -78], [18, -75], [15, -79]]), C.papel) + trazo('M15 -82 Q18 -80 21 -82', C.peltre, 0.7, 0.8);
  return conGrano(
    nube(0, -70, 34, 6, C.negro, 'm', 0.5) +
    enmascarado('m-chivato-levita', d,
      forma(d, C.levitaHonda) +
      // El sebo: la panza redonda, que levanta la luz del foco del pasillo.
      nube(-6, -98, 20, 18, C.levita, 'm', 0.95) + nube(-10, -104, 8, 7, C.lila, 'm', 0.5) +
      nube(24, -110, 8, 30, C.negro, 'm', 0.6) + nube(-26, -124, 6, 16, C.levita, 's', 0.6) +
      lentejuelas(-28, -136, 56, 62, 22, 17)) +
    // El frente abierto de la levita, debajo de la pechera.
    trazo('M0 -114 Q-2 -92 0 -71', C.negro, 1.4, 0.9) +
    enmascarado('m-chivato-pechera', pechera, forma(pechera, C.papel) + nube(3, -134, 4, 10, C.lilaClara, 's', 0.7)) +
    solapa(-1) + solapa(1) + lazo + botones + bolsillo +
    // El ribete dorado del borde de abajo.
    trazo('M-27 -84 Q-15 -72 0 -70 Q15 -72 27 -84', C.oro, 1.3, 0.85),
  );
}

/* ------------------------------------------------------------------
   Los brazos: la manga con lentejuelas, el puño de volados y el guante blanco
   ------------------------------------------------------------------ */

/** Un tramo de manga, de un punto al otro, con su ancho. */
function tramo([ax, ay]: P, [bx, by]: P, ancho: number): string {
  const ang = Math.atan2(by - ay, bx - ax);
  const [nx, ny] = [-Math.sin(ang) * ancho, Math.cos(ang) * ancho];
  return poli([[ax + nx, ay + ny], [bx + nx * 0.85, by + ny * 0.85], [bx - nx * 0.85, by - ny * 0.85], [ax - nx, ay - ny]]);
}

/** El guante de murga: la mano blanca, el pulgar y el volado del puño. */
function guante([hx, hy]: P, giro: number): string {
  return `<g transform="rotate(${giro} ${hx} ${hy})">` +
    forma(poli([[hx - 6, hy - 6], [hx - 2, hy - 8], [hx + 2, hy - 6], [hx + 6, hy - 8], [hx + 7, hy - 4], [hx - 7, hy - 3]]), C.papel) +
    forma(elipse(hx, hy, 6, 5), C.papel) + nube(hx + 2, hy + 2, 4, 3, C.lilaClara, 's', 0.7) +
    trazo(`M${hx - 2} ${hy - 1} l0 4 M${hx + 1} ${hy - 1} l0 4`, C.peltre, 0.6, 0.7) + `</g>`;
}

function brazo(n: 0 | 1): string {
  const s = n ? 1 : -1;
  const hombro = A.hombros[n];
  const codo: P = n ? [31, -112] : [-32, -116];
  const mano = A.manos[n];
  const arriba = tramo(hombro, codo, 6.5);
  const abajo = tramo(codo, mano, 5.5);
  const manga = (d: string, id: string): string => enmascarado(id, d, forma(d, C.levitaHonda) + nube(codo[0] - s * 2, codo[1], 6, 12, C.levita, 'm', 0.9) + nube(hombro[0], hombro[1] + 6, 6, 6, C.lila, 's', 0.4) + lentejuelas(Math.min(hombro[0], codo[0], mano[0]) - 4, Math.min(hombro[1], mano[1]) - 4, 40, 50, 8, 41 + n));
  return manga(arriba, `m-chivato-brazo-${n}-a`) + forma(elipse(codo[0], codo[1], 6, 6), C.levitaHonda) + manga(abajo, `m-chivato-brazo-${n}-b`);
}

/** La libretita: la tapa negra, la hoja con la lista, el elástico, y el guante que la agarra. */
function libreta(): string {
  const [lx, ly] = A.libreta;
  const pagina = cajaRedonda(lx - 8, ly - 11, 16, 22, 1);
  const lista = [0, 1, 2, 3, 4].map((i) => trazo(`M${lx - 5} ${ly - 6 + i * 4} l${6 + (i * 7) % 5} ${i % 2 ? -0.5 : 0.4}`, C.levitaHonda, 0.8, 0.9)).join('');
  return forma(cajaRedonda(lx - 10, ly - 13, 20, 26, 1.6), C.negro) + forma(pagina, C.papel) +
    [0, 1, 2, 3, 4].map((i) => trazo(`M${lx - 7} ${ly - 7 + i * 4} L${lx + 7} ${ly - 7 + i * 4}`, C.lilaClara, 0.4, 0.8)).join('') + lista +
    // Uno ya tachado.
    trazo(`M${lx - 6} ${ly + 1} L${lx + 5} ${ly - 1}`, C.rojo, 0.9) +
    forma(cajaRedonda(lx + 5, ly - 13, 1.6, 26, 0.6), C.oroHondo);
}

function brazo1(): string {
  return conGrano(brazo(0) + libreta() + guante(A.manos[0], -20));
}

function brazo2(): string {
  return conGrano(brazo(1) + guante(A.manos[1], 30));
}

/** Un lápiz amarillo de oro, con la punta y la goma. */
function lapiz([ax, ay]: P, [bx, by]: P): string {
  const d = tramo([ax, ay], [bx, by], 1.8);
  const ang = Math.atan2(by - ay, bx - ax);
  const punta: P = [bx + Math.cos(ang) * 4, by + Math.sin(ang) * 4];
  return forma(d, C.oro) + trazo(`M${ax} ${ay} L${bx} ${by}`, C.oroHondo, 0.6, 0.8) +
    forma(poli([[bx - Math.sin(ang) * 1.8, by + Math.cos(ang) * 1.8], punta, [bx + Math.sin(ang) * 1.8, by - Math.cos(ang) * 1.8]]), C.plataClara) + forma(elipse(punta[0], punta[1], 0.7, 0.7), C.negro) +
    forma(elipse(ax, ay, 2, 2), C.pinturaViva);
}

/** El lápiz en la mano 2, para escribir: la punta para adelante del puño. */
const LAPIZ_MANO: readonly [P, P] = [[A.manos[1][0] + 7, A.manos[1][1] - 7], [A.manos[1][0] - 4, A.manos[1][1] + 6]];
/** El lápiz atrás de la oreja 2. */
const LAPIZ_OREJA: readonly [P, P] = [[A.lapiz[0] - 7, A.lapiz[1] - 10], [A.lapiz[0] + 5, A.lapiz[1] + 10]];

/* ------------------------------------------------------------------
   La cabeza: cara de chivo, cuernitos, la pintura de murga y la barbita
   ------------------------------------------------------------------ */

const CRANEO: readonly P[] = [[0, -217], [16, -211], [22, -197], [18, -180], [12, -166], [8, -157], [0, -153], [-8, -157], [-12, -166], [-18, -180], [-22, -197], [-16, -211]];

function oreja(n: 0 | 1): string {
  const s = n ? 1 : -1;
  const [ox, oy] = A.orejas[n];
  const d = curva([[ox - s * 2, oy - 4], [ox + s * 12, oy - 9], [ox + s * 28, oy - 6], [ox + s * 36, oy + 2], [ox + s * 26, oy + 7], [ox + s * 12, oy + 5], [ox - s * 2, oy + 4]]);
  return conGrano(enmascarado(`m-chivato-oreja-${n}`, d,
    forma(d, C.pelo) + nube(ox + s * 18, oy + 1, 12, 3, C.pinturaViva, 's', 0.75) + nube(ox + s * 14, oy - 6, 12, 2, C.lilaClara, 's', 0.6) + nube(ox + s * 32, oy + 3, 5, 4, C.hondo, 's', 0.8)));
}

function cabeza(): string {
  const d = curva(CRANEO);
  // Los cuernitos, que salen por los costados de la galera, con los anillos.
  const cuerno = (s: number): string => {
    const c = curva([[s * 4, -204], [s * 12, -214], [s * 22, -230], [s * 27, -244], [s * 22, -238], [s * 13, -226], [s * 4, -212]]);
    const anillos = [0.25, 0.45, 0.65, 0.82].map((t) => trazo(`M${s * (6 + 16 * t)} ${-208 - 30 * t + 4} l${s * 5} ${-5}`, C.peltreHondo, 1, 0.9)).join('');
    return nube(s * 14, -222, 8, 12, C.negro, 's', 0.6) + enmascarado(`m-chivato-cuerno-${s > 0 ? 2 : 1}`, c, forma(c, C.plata) + nube(s * 10, -214, 4, 10, C.plataClara, 's', 0.95) + nube(s * 20, -234, 4, 8, C.peltre, 's', 0.8)) + anillos;
  };
  const ojo = ([x, y]: P, i: number): string => {
    const blanco = curva([[x - 7, y + 0.5], [x - 2, y - 4], [x + 4, y - 3.6], [x + 7, y + 0.5], [x + 2, y + 3.4], [x - 3, y + 3]]);
    return enmascarado(`m-chivato-ojo-${i}`, blanco, forma(blanco, C.papel) + forma(elipse(x, y, 4, 4), C.oro) + nube(x, y + 1.6, 4, 2, C.oroHondo, 's', 0.8));
  };
  // La pintura de murga: dos rayas que bajan de cada ojo por el cachete, como la cara del interior.
  const rayas = A.ojos.map(([x, y]) => [-2.5, 2.5].map((dx) => forma(poli([[x + dx - 1.3, y + 5], [x + dx + 1.3, y + 5], [x + dx * 1.3 + 0.8, y + 20], [x + dx * 1.3 - 0.8, y + 20]]), C.pintura, 0.9)).join('')).join('');
  const adentro =
    forma(d, C.pelo) +
    nube(0, -206, 14, 8, C.lilaClara, 'm', 0.7) + nube(0, -172, 8, 14, C.lila, 'm', 0.85) + nube(-18, -186, 6, 16, C.hondo, 'm', 0.8) + nube(18, -184, 6, 14, C.hondo, 'm', 0.7) +
    // El rombo de murga en la frente.
    forma(poli([[0, -206], [3, -200], [0, -194], [-3, -200]]), C.pinturaViva, 0.9) +
    rayas + A.ojos.map(ojo).join('') +
    // El hocico, con el brillo de plata mojada en la nariz.
    nube(0, -165, 6, 4, C.brillo, 's', 0.8) +
    forma(poli([[-5, -163], [-2, -161], [-3, -159]]), C.negro) + forma(poli([[5, -163], [2, -161], [3, -159]]), C.negro) +
    trazo('M-6 -157 Q0 -155 6 -157', C.negro, 1.1, 0.9);
  return conGrano(cuerno(-1) + cuerno(1) + enmascarado('m-chivato-cara', d, adentro) +
    // El mechón de la nuca, entre los cuernos.
    forma(poli([[-6, -214], [-2, -220], [0, -214], [3, -221], [6, -213]]), C.pelo));
}

/** Las pupilas de cabra: la rendija acostada, que mira de reojo. */
function pupilas(): string {
  return A.ojos.map(([x, y]) => forma(cajaRedonda(x - 3, y - 1, 6, 2, 1), C.negro) + forma(elipse(x - 1.6, y - 1.6, 0.7, 0.7), C.papel)).join('');
}

/** El párpado pesado de buchón, que tapa medio ojo, y el ceño. */
function cejas(): string {
  return A.ojos.map(([x, y], i) => {
    const s = i ? 1 : -1;
    const lid = curva([[x - 8, y - 7], [x + 8, y - 7], [x + 8, y - 0.6], [x, y - 1.4], [x - 8, y - 0.6]]);
    return forma(lid, C.pelo) + nube(x, y - 4, 6, 2, C.lila, 'xs', 0.6) + trazo(`M${x - 7} ${y - 0.6} Q${x} ${y - 2} ${x + 7} ${y - 0.6}`, C.negro, 1.2) +
      trazo(`M${x + s * 8} ${y - 9} L${x - s * 4} ${y - 6.5}`, C.hondo, 1.6, 0.9);
  }).join('');
}

function parpados(): string {
  return A.ojos.map(([x, y], i) => enmascarado(`m-chivato-parpado-${i}`, elipse(x, y - 1, 8, 6), forma(elipse(x, y - 1, 8.4, 6.4), C.pelo) + trazo(`M${x - 7} ${y + 1} Q${x} ${y + 3} ${x + 7} ${y + 1}`, C.negro, 1.1))).join('');
}

/** La boca abierta del balido: lo oscuro y la lengua. */
function boca(): string {
  const d = elipse(0, -155, 6.5, 6);
  return conGrano(enmascarado('m-chivato-boca', d, forma(d, C.negro) + nube(0, -151, 4, 3, C.pinturaViva, 's', 0.95)) + forma(poli([[-4, -160], [-2, -160], [-3, -157]]), C.papel) + forma(poli([[2, -160], [4, -160], [3, -157]]), C.papel));
}

/** La quijada con la barbita de chivo, que mastica de costado. */
function quijada(): string {
  const labio = curva([[-7, -158], [7, -158], [6, -152], [0, -149.5], [-6, -152]]);
  const barba = curva([[-4, -152], [4, -152], [3, -143], [2, -136], [0.5, -130], [-1, -136], [-3, -143]]);
  return conGrano(
    nube(0, -140, 6, 10, C.negro, 's', 0.7) +
    enmascarado('m-chivato-barba', barba, forma(barba, C.peltre) + nube(0.5, -144, 2, 7, C.plataClara, 's', 0.9) + nube(-2.5, -140, 1.5, 6, C.peltreHondo, 's', 0.8)) +
    trazo('M-1 -150 Q0 -140 0.5 -131 M2 -150 Q2.5 -142 1.5 -136', C.peltreHondo, 0.6, 0.8) +
    enmascarado('m-chivato-labio', labio, forma(labio, C.pelo) + nube(0, -154, 5, 2, C.lila, 's', 0.7)),
  );
}

/** El bocado: la punta de una hoja de la libreta, que le asoma de la boca mientras mastica. */
function bocado(): string {
  const d = poli([[-6, -157], [-16, -152], [-14, -146], [-11, -149], [-9, -145], [-4, -153]]);
  return forma(d, C.papel) + trazo('M-14 -150 L-7 -153 M-13 -147.5 L-8 -150', C.lilaClara, 0.5, 0.9);
}

/** La galera chiquita de murguero, entre los cuernos, con la cinta y una lentejuela. */
function galera(): string {
  const [gx, gy] = A.galera;
  const copa = poli([[gx - 10, gy - 1], [gx - 12, gy - 28], [gx + 12, gy - 28], [gx + 10, gy - 1]]);
  return conGrano(
    enmascarado('m-chivato-copa', copa, forma(copa, C.negro) + nube(gx - 5, gy - 16, 3, 12, C.levitaHonda, 's', 0.9) + nube(gx + 7, gy - 20, 2, 8, C.peltreHondo, 's', 0.6)) +
    forma(poli([[gx - 10.4, gy - 8], [gx + 10.4, gy - 8], [gx + 10.1, gy - 3], [gx - 10.1, gy - 3]]), C.pinturaViva) +
    forma(elipse(gx, gy - 28, 12, 2), C.levitaHonda) +
    forma(elipse(gx, gy, 18, 3.4), C.negro) + nube(gx - 6, gy - 1, 8, 1.2, C.peltre, 'xs', 0.6) +
    lentejuela(gx + 6, gy - 5.6, 1.6),
  );
}

/** La gota de sudor de cuando lo descubren. */
function gota(): string {
  return forma(curva([[26, -214], [29, -206], [27, -201], [24, -202], [23, -206]]), C.brillo) + forma(elipse(25.4, -205, 0.8, 1.4), C.papel);
}

/** El balido: las ondas que le salen de la boca cuando canta. */
function balido(): string {
  const arco = (r: number, i: number): string => {
    const a0 = (-50 * Math.PI) / 180;
    const a1 = (40 * Math.PI) / 180;
    const [cx, cy] = [8, -154];
    return trazo(`M${cx + Math.cos(a0) * r} ${cy + Math.sin(a0) * r} A${r} ${r} 0 0 1 ${cx + Math.cos(a1) * r} ${cy + Math.sin(a1) * r}`, i % 2 ? C.oro : C.papel, 2.4 - i * 0.4, 0.95);
  };
  return arco(12, 0) + arco(20, 1) + arco(28, 2) +
    // Y del otro lado, para la celda.
    trazo('M-12 -164 Q-18 -168 -22 -164 M-14 -150 Q-22 -148 -26 -152', C.papel, 1.6, 0.85);
}

/** La hoja de la lista, suelta: la que se vuela. */
function hoja(): string {
  const [lx, ly] = A.libreta;
  const d = poli([[lx - 8, ly - 10], [lx - 5, ly - 11], [lx - 2, ly - 10], [lx + 1, ly - 11.4], [lx + 4, ly - 10], [lx + 8, ly - 11], [lx + 8, ly + 11], [lx - 8, ly + 11]]);
  return conGrano(forma(d, C.papel) + nube(lx + 4, ly + 6, 5, 5, C.lilaClara, 's', 0.6) +
    [0, 1, 2, 3, 4].map((i) => trazo(`M${lx - 5} ${ly - 6 + i * 4} l${6 + (i * 5) % 6} 0`, C.levitaHonda, 0.8, 0.9)).join('') +
    trazo(`M${lx - 6} ${ly + 5} L${lx + 5} ${ly + 3}`, C.rojo, 0.9));
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.6;
const [LX, LY] = A.libreta;

export const PIEZAS_CHIVATO: readonly Pieza[] = [
  { nombre: 'chivato-faldones', caja: [-44, -96, 88, 64], dibujo: faldones(), densidad: D },
  { nombre: 'chivato-pierna-1', caja: [-30, -88, 34, 90], dibujo: pierna(0), densidad: D },
  { nombre: 'chivato-pierna-2', caja: [-4, -88, 34, 90], dibujo: pierna(1), densidad: D },
  { nombre: 'chivato-cuerpo', caja: [-38, -156, 76, 92], dibujo: cuerpo(), densidad: D },
  { nombre: 'chivato-oreja-1', caja: [-60, -206, 46, 26], dibujo: oreja(0), densidad: D * 1.3 },
  { nombre: 'chivato-oreja-2', caja: [14, -206, 46, 26], dibujo: oreja(1), densidad: D * 1.3 },
  { nombre: 'chivato-lapiz-oreja', caja: [24, -210, 22, 32], dibujo: conGrano(lapiz(LAPIZ_OREJA[0], LAPIZ_OREJA[1])), densidad: D * 1.3 },
  { nombre: 'chivato-cabeza', caja: [-32, -250, 64, 106], dibujo: cabeza(), densidad: D * 1.3 },
  { nombre: 'chivato-pupilas', caja: [-16, -192, 32, 12], dibujo: pupilas(), densidad: D * 1.6 },
  { nombre: 'chivato-cejas', caja: [-20, -198, 40, 18], dibujo: cejas(), densidad: D * 1.6 },
  { nombre: 'chivato-parpados', caja: [-20, -196, 40, 16], dibujo: parpados(), densidad: D * 1.6 },
  { nombre: 'chivato-boca', caja: [-9, -163, 18, 16], dibujo: boca(), densidad: D * 1.6 },
  { nombre: 'chivato-quijada', caja: [-10, -161, 20, 40], dibujo: quijada(), densidad: D * 1.6 },
  { nombre: 'chivato-bocado', caja: [-18, -159, 16, 16], dibujo: conGrano(bocado()), densidad: D * 1.6 },
  { nombre: 'chivato-galera', caja: [-20, -244, 40, 38], dibujo: galera(), densidad: D * 1.6 },
  { nombre: 'chivato-gota', caja: [20, -217, 12, 18], dibujo: conGrano(gota()), densidad: D * 1.6 },
  { nombre: 'chivato-balido', caja: [-30, -190, 70, 70], dibujo: balido(), densidad: D },
  { nombre: 'chivato-brazo-2', caja: [4, -146, 40, 64], dibujo: brazo2(), densidad: D },
  { nombre: 'chivato-lapiz-mano', caja: [2, -104, 22, 22], dibujo: conGrano(lapiz(LAPIZ_MANO[0], LAPIZ_MANO[1])), densidad: D * 1.3 },
  { nombre: 'chivato-brazo-1', caja: [-42, -146, 44, 52], dibujo: brazo1(), densidad: D },
  { nombre: 'chivato-hoja', caja: [LX - 10, LY - 13, 20, 26], dibujo: hoja(), densidad: D * 1.6 },
];

const img = imagenesDe(PIEZAS_CHIVATO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El chivato armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    `<ellipse cx="0" cy="1" rx="34" ry="4.6" class="bt-chivato-sombra"/>` +
    parte('agacha',
      parte('faldones', img('chivato-faldones'), t.faldones) +
      parte('pierna-2', img('chivato-pierna-2'), t['pierna-2']) +
      parte('pierna-1', img('chivato-pierna-1'), t['pierna-1']) +
      parte('torso',
        img('chivato-cuerpo') +
        parte('cabeza',
          parte('oreja-1', img('chivato-oreja-1'), t['oreja-1']) +
          parte('oreja-2', img('chivato-oreja-2') + parte('lapiz-oreja', img('chivato-lapiz-oreja'), '', o['lapiz-oreja']), t['oreja-2']) +
          img('chivato-cabeza') +
          parte('pupilas', img('chivato-pupilas'), t.pupilas) +
          parte('cejas', img('chivato-cejas'), t.cejas) +
          parte('parpado', img('chivato-parpados'), '', o.parpado) +
          parte('boca', img('chivato-boca'), '', o.boca) +
          parte('quijada', img('chivato-quijada') + parte('bocado', img('chivato-bocado'), '', o.bocado), t.quijada) +
          parte('galera', img('chivato-galera'), t.galera) +
          parte('gota', img('chivato-gota'), '', o.gota) +
          parte('balido', img('chivato-balido'), '', o.balido),
          t.cabeza) +
        parte('brazo-2', img('chivato-brazo-2') + parte('lapiz-mano', img('chivato-lapiz-mano'), '', o['lapiz-mano']), t['brazo-2']) +
        parte('brazo-1', img('chivato-brazo-1'), t['brazo-1']),
        t.torso) +
      parte('hoja', img('chivato-hoja'), t.hoja, o.hoja),
      t.agacha)
  );
}

/** El chivato en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function chivatoEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: la oreja pegada a la reja. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--chivato" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El chivato'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: cantando la delación, con la hoja de la lista en el aire, contra la celda. */
export const RETRATO = { caja: [CHIVATO.x - 130, CHIVATO.piso - 250, 210, 256] as const };
const fondo = imagenesDe(PIEZAS_PRISION);
function retrato(): string {
  return fondo('prision-lejos') + chivatoEn(CANTA);
}

export const CHIVATO_PERSONAJE: Personaje = {
  id: ID,
  region: 'la-prision',
  ancla: CHIVATO.x,
  piezas: PIEZAS_CHIVATO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
