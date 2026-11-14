/**
 * Los buitres de la tele (`D-73`, vigesimoctava vuelta), dos arriba de la antena, esperando.
 *
 * *"Hay buitres en la tele"* es de *Estás frito angelito*, en *Último bondi a Finisterre* (1998). Se toma al pie de
 * la letra, y con el resto del tema: *"estás frito, angelito"* dicho trece veces. Si el angelito está frito, los buitres
 * que esperan arriba de la tele esperan a cenar: cada uno lleva la servilleta metida en la gorguera, uno el tenedor y el
 * otro el cuchillo, y se paran en un travesaño que alguien ató a la antena para que se posaran. Solos, esperan y miran
 * la pantalla, cuchichean, se afilan el cuchillo contra el tenedor (y sale una chispa) y a veces a uno se le suelta la
 * servilleta, el viento se la lleva y el otro se la vuelve a prender. Tocados, giran la cabeza de golpe para quien los
 * toca, estiran el cogote y levantan los cubiertos: *"estás frito"*, y después se hacen los que miraban para otro lado.
 *
 * De la letra son los buitres, la tele, el estar frito y el esperar. Del dibujo son las servilletas, los cubiertos, el
 * travesaño y la chispa.
 *
 * Viste *Último bondi a Finisterre*, medido con sharp: el plumaje es el acero negro de la tapa, el cuello pelado es su
 * piel de cuero, la gorguera y el barro de las uñas son su óxido, el pico y los ojos son el vidrio de la tele, las
 * servilletas son su blanco y los cubiertos son su acero claro.
 *
 * Coordenadas: el (0, 0) es la cara de arriba del travesaño, en el medio (`rig-buitres.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli } from './trazos.ts';
import { BUITRE, BUITRES, CHOCAN, ENCIMA, LUGARES, QUIETO, marcas, type Momento } from './rig-buitres.ts';

const ID = 'los-buitres-de-la-tele';

/** Las tintas de *Último bondi a Finisterre* (`tokens.css`). */
const C = {
  plumaje: 'var(--bestia-buitres-plumaje)',
  hondo: 'var(--bestia-buitres-plumaje-hondo)',
  claro: 'var(--bestia-buitres-plumaje-claro)',
  pizarra: 'var(--bestia-buitres-pizarra)',
  piel: 'var(--bestia-buitres-piel)',
  pielClara: 'var(--bestia-buitres-piel-clara)',
  oxido: 'var(--bestia-buitres-oxido)',
  oxidoClaro: 'var(--bestia-buitres-oxido-claro)',
  hueso: 'var(--bestia-buitres-hueso)',
  servilleta: 'var(--bestia-buitres-servilleta)',
  acero: 'var(--bestia-buitres-acero)',
};

/* ------------------------------------------------------------------
   El travesaño y la chispa
   ------------------------------------------------------------------ */

/** El travesaño: un fierro oxidado atado a la antena con alambre, con las vueltas del alambre y un clavo torcido. */
function travesano(): string {
  const d = poli([[-148, 0], [148, -1], [150, 6], [146, 8], [-146, 8], [-150, 4]]);
  let alambre = '';
  for (const x of [-6, 6]) alambre += trazo(`M${x - 4} -4 q4 8 8 12 M${x + 4} -4 q-4 8 -8 12`, C.acero, 1.6, 0.9);
  return conGrano(
    nube(0, 10, 130, 4, C.hondo, 's', 0.7) +
    enmascarado('m-buitres-travesano', d, forma(d, C.oxido) + nube(0, 6, 144, 3, C.hondo, 'xs', 0.9) + nube(-60, 0, 60, 1.6, C.oxidoClaro, 'xs', 0.9) + nube(80, 3, 40, 2, C.pizarra, 'xs', 0.7) + trazo('M-120 2 l6 4 M-80 1 l8 5 M30 2 l6 4 M110 1 l7 6', C.hondo, 1, 0.8)) +
    alambre + forma(elipse(0, 2, 3, 3), C.acero) +
    // Los tirantes: dos varillas del travesaño a la antena, con la abrazadera y los tornillos. La antena pasa por el medio.
    trazo('M-132 6 L30 56 M132 6 L30 56', C.oxido, 3.4) + trazo('M-132 5 L30 55 M132 5 L30 55', C.oxidoClaro, 1, 0.7) +
    forma(poli([[24, 50], [38, 50], [38, 62], [24, 62]]), C.oxido) + trazo('M24 50 L38 50 L38 62 L24 62 Z', C.acero, 1.2, 0.9) + forma(elipse(31, 56, 1.8, 1.8), C.acero) +
    trazo('M-134 6 q-4 8 2 12 M134 6 q4 8 -2 12', C.acero, 1.8, 0.9) +
    trazo('M-8 -4 q4 10 8 14 q4 -4 8 -14', C.acero, 2, 0.95) +
    // El clavo torcido de la punta, de donde alguna vez colgó algo.
    trazo('M140 6 l8 4 l-1 6', C.acero, 1.6, 0.9),
  );
}

/** La chispa: una estrella de cuatro puntas con rayitas, centrada en el (0, 0). Es el acero contra el acero. */
function chispa(): string {
  return nube(0, 0, 12, 12, C.hueso, 's', 0.7) + forma(poli([[0, -12], [2.4, -2.4], [12, 0], [2.4, 2.4], [0, 12], [-2.4, 2.4], [-12, 0], [-2.4, -2.4]]), C.servilleta) + trazo('M-9 -9 l3 3 M9 -9 l-3 3 M9 9 l-3 -3 M-9 9 l3 -3 M0 -16 l0 3 M0 16 l0 -3', C.hueso, 1.2, 0.9);
}

/* ------------------------------------------------------------------
   Un buitre: el cuerpo con la gorguera, el cuello con la cabeza pelada, el párpado, la servilleta y el cubierto
   ------------------------------------------------------------------ */

function cuerpo(v: 'a' | 'b'): string {
  const capa = curva([[-42, -4], [-40, -32], [-24, -58], [4, -66], [27, -55], [33, -30], [27, -8], [4, -3], [-20, -2]]);
  let plumas = '';
  for (let r = 0; r < 5; r++) for (let i = 0; i < 6; i++) plumas += trazo(`M${f(-34 + i * 11 + (r % 2) * 5.5)} ${f(-56 + r * 11)} q5 8 11 0`, r < 2 ? C.acero : C.claro, 1.1, r < 2 ? 0.42 : 0.6);
  const hondo = v === 'a' ? C.hondo : C.plumaje;
  const base = v === 'a' ? C.plumaje : C.pizarra;
  const manos = poli([[14, -28], [36, -26], [46, -20], [44, -14], [18, -10]]);
  return conGrano(
    // Las patas, con las uñas largas agarradas del travesaño, y la cola que sobra para atrás.
    trazo('M-2 -8 L-3 0 M12 -8 L13 0', C.piel, 4.4) + trazo('M-10 0 h12 M8 0 h12', C.piel, 3) + trazo('M-11 1 l-3 3 M2 1 l3 3 M19 1 l3 3', C.hondo, 1.8) +
    forma(poli([[-36, -12], [-68, -2], [-64, 6], [-32, 1]]), hondo) + trazo('M-36 -8 l-30 6 M-36 -4 l-28 8', C.claro, 1, 0.5) +
    enmascarado(`m-buitres-cuerpo-${v}`, capa,
      forma(capa, base) + nube(-12, -20, 38, 24, hondo, 's', 0.95) + nube(4, -60, 28, 7, C.claro, 's', 0.8) + nube(-30, -34, 7, 28, C.pizarra, 's', 0.5) + nube(24, -22, 8, 16, hondo, 's', 0.7) + plumas) +
    // El filo de luz de la espalda: lo que lo despega de la pared negra.
    trazo('M-40 -30 Q-24 -60 4 -66 Q22 -62 30 -48', C.acero, 2.4, 0.85) + trazo('M-36 -28 Q-22 -54 2 -62', C.servilleta, 0.9, 0.55) + trazo('M-38 -20 Q-34 -40 -26 -52', C.acero, 0.9, 0.5) + trazo('M20 -30 Q30 -44 27 -54', C.acero, 1.2, 0.55) +
    // Las plumas de la mano, que sostiene el cubierto.
    enmascarado(`m-buitres-mano-${v}`, manos, forma(manos, base) + nube(32, -14, 14, 6, hondo, 'xs', 0.9)) + trazo('M24 -24 l16 8 M26 -18 l16 8 M28 -13 l12 6', C.claro, 0.9, 0.55) +
    // La gorguera: el collar de plumas que le tapa la base del cuello, con el borde de luz.
    forma(poli([[8, -52], [9, -60], [14, -54], [18, -64], [23, -56], [29, -63], [34, -54], [37, -47], [30, -42], [16, -42], [8, -46]]), hondo) +
    forma(poli([[10, -52], [12, -58], [16, -53], [20, -61], [24, -54], [29, -59], [32, -52], [28, -48], [14, -48]]), base) + trazo('M10 -53 L14 -60 L19 -55 L23 -63 L27 -56 L33 -60', C.claro, 1.1, 0.8),
  );
}

function cuello(v: 'a' | 'b'): string {
  const { centro: [ex, ey], radio: [rx, ry] } = BUITRE.ojo;
  const piel = v === 'a' ? C.piel : C.pielClara;
  const cuelloD = 'M24 -48 C20 -64 32 -74 34 -88';
  return conGrano(
    // El cuello: largo, flaco, pelado, con las arrugas y el plumón de atrás.
    trazo(cuelloD, C.hondo, 12.4, 0.9) + trazo(cuelloD, piel, 10) + trazo('M23 -54 C21 -66 30 -74 31 -86', C.hondo, 3, 0.55) + trazo('M28 -52 C26 -64 36 -72 38 -84', v === 'a' ? C.pielClara : C.oxidoClaro, 2.2, 0.6) +
    trazo('M20 -58 l7 2 M21 -66 l7 1 M27 -74 l6 -1 M29 -80 l6 -2', C.hondo, 1, 0.55) + trazo('M17 -70 l-4 -3 M19 -62 l-4 -1 M22 -78 l-4 -4', C.claro, 1.1, 0.85) +
    // La cabeza: chica, pelada, con la gorra de plumón y el rubor de cuero viejo alrededor del ojo.
    enmascarado(`m-buitres-cabeza-${v}`, elipse(ex - 1, ey + 1, 11, 9.4),
      forma(elipse(ex - 1, ey + 1, 11, 9.4), piel) + nube(ex - 6, ey - 6, 10, 5, C.hondo, 's', 0.6) + nube(ex + 3, ey - 5, 8, 4, v === 'a' ? C.pielClara : C.oxidoClaro, 's', 0.8) + nube(ex, ey + 1, 9, 7, C.oxido, 's', 0.7)) +
    // El pico: de gancho, de hueso, con la punta oscura y la cera arriba.
    forma(poli([[ex + 8, ey - 3], [ex + 21, ey + 2], [ex + 20, ey + 7], [ex + 16, ey + 9], [ex + 12, ey + 6], [ex + 8, ey + 5]]), C.hueso) + forma(poli([[ex + 19, ey + 3], [ex + 23, ey + 8], [ex + 18, ey + 10], [ex + 18, ey + 6]]), C.hondo) + nube(ex + 11, ey - 1, 4, 2, C.oxido, 'xs', 0.9) + trazo(`M${ex + 8} ${ey + 5} q6 3 12 -1`, C.hondo, 0.9, 0.85) +
    // La barbilla colgando: oxido, de cuero viejo.
    forma(elipse(ex + 8, ey + 10, 3.4, 5), C.oxido) + nube(ex + 8, ey + 12, 2, 3, C.oxidoClaro, 'xs', 0.7) +
    // El ojo: de vidrio, con la ceja pesada y la pupila clavada en lo que mira.
    forma(elipse(ex, ey, rx + 1.2, ry + 1.2), C.hondo) + forma(elipse(ex, ey, rx, ry), C.hueso) + forma(elipse(ex + 1.4, ey, 2, 2.2), C.hondo) + forma(elipse(ex + 2, ey - 0.9, 0.8, 0.8), C.servilleta) +
    trazo(`M${ex - 7} ${ey - 5} Q${ex} ${ey - 6.4} ${ex + 8} ${ey - 4.4}`, C.hondo, 1.6, 0.9),
  );
}

function parpado(): string {
  const { centro: [ex, ey], radio: [rx, ry] } = BUITRE.ojo;
  return conGrano(forma(elipse(ex, ey, rx + 2, ry + 2), C.piel) + trazo(`M${ex - rx - 1} ${ey + 1} Q${ex} ${ey + ry + 2.4} ${ex + rx + 1} ${ey + 1}`, C.hondo, 1.1));
}

/** La servilleta metida en la gorguera: blanca, con cuadritos de óxido, un doblez y la mancha de lo que ya comió. */
function servilleta(): string {
  const d = poli([[12, -52], [37, -50], [39, -24], [34, -22], [30, -26], [24, -22], [18, -26], [12, -24]]);
  return conGrano(
    enmascarado('m-buitres-servilleta', d,
      forma(d, C.servilleta) + nube(30, -32, 10, 14, C.claro, 's', 0.6) + nube(18, -40, 8, 4, C.claro, 'xs', 0.4) + nube(26, -26, 4, 4, C.oxido, 'xs', 0.75) +
      trazo('M12 -44 H40 M12 -36 H40 M12 -28 H40 M20 -52 V-22 M28 -52 V-22 M36 -52 V-22', C.oxido, 0.8, 0.4) + trazo('M14 -48 L36 -46', C.claro, 1.4, 0.6)) +
    trazo(d, C.claro, 0.9, 0.55),
  );
}

/** El tenedor: el mango de acero con el puño de plumas y los tres dientes, parado desde la mano y torcido hacia el medio. */
function tenedor(): string {
  const [mx, my] = BUITRE.mano;
  const [px, py] = [mx + 12, my - 24];
  return conGrano(
    trazo(`M${mx} ${my} L${px} ${py}`, C.acero, 2.8) + trazo(`M${mx + 1} ${my - 2} L${px + 1} ${py}`, C.servilleta, 0.9, 0.7) +
    trazo(`M${px - 5} ${py + 3} q5 4 10 -2 M${px - 5} ${py + 3} L${px - 7} ${py - 8} M${px} ${py + 1} L${px - 1} ${py - 9} M${px + 5} ${py - 2} L${px + 5} ${py - 10}`, C.acero, 1.8) +
    forma(poli([[mx - 4, my + 2], [mx + 6, my - 6], [mx + 10, my + 2], [mx + 2, my + 8]]), C.hondo) + trazo(`M${mx - 2} ${my + 1} l8 -4`, C.claro, 0.8, 0.6),
  );
}

/** El cuchillo: el filo de sierra con la luz, el lomo oscuro y el cabo de óxido. */
function cuchillo(): string {
  const [mx, my] = BUITRE.mano;
  const hoja = poli([[mx + 6, my - 8], [mx + 11, my - 34], [mx + 19, my - 29], [mx + 15, my - 13]]);
  return conGrano(
    forma(poli([[mx - 3, my + 3], [mx + 4, my - 8], [mx + 11, my - 12], [mx + 6, my - 2], [mx + 1, my + 6]]), C.oxido) + trazo(`M${mx} ${my} l7 -8`, C.oxidoClaro, 0.9, 0.7) +
    forma(hoja, C.acero) + trazo(`M${mx + 11} ${my - 34} L${mx + 19} ${my - 29}`, C.servilleta, 1.2, 0.9) + nube(mx + 14, my - 22, 2.2, 8, C.servilleta, 'xs', 0.7, 10) + trazo(`M${mx + 6} ${my - 9} L${mx + 11} ${my - 32}`, C.hondo, 1.4, 0.7) +
    trazo(`M${mx + 14} ${my - 15} l3 -1 M${mx + 15} ${my - 22} l3 -1 M${mx + 17} ${my - 28} l3 -1`, C.hondo, 1, 0.8),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;
const [OX, OY] = BUITRE.ojo.centro;
const [SX, SY] = BUITRE.servilleta;

export const PIEZAS_BUITRES: readonly Pieza[] = [
  { nombre: 'buitres-travesano', caja: [-154, -6, 308, 80], dibujo: travesano(), densidad: D * 1.4 },
  { nombre: 'buitres-cuerpo-a', caja: [-72, -72, 124, 82], dibujo: cuerpo('a'), densidad: D },
  { nombre: 'buitres-cuerpo-b', caja: [-72, -72, 124, 82], dibujo: cuerpo('b'), densidad: D },
  { nombre: 'buitres-cuello-a', caja: [8, -110, 58, 66], dibujo: cuello('a'), densidad: D * 1.6 },
  { nombre: 'buitres-cuello-b', caja: [8, -110, 58, 66], dibujo: cuello('b'), densidad: D * 1.6 },
  { nombre: 'buitres-parpado', caja: [OX - 12, OY - 11, 24, 22], dibujo: parpado(), densidad: D * 2.4 },
  { nombre: 'buitres-servilleta', caja: [SX - 16, SY - 4, 34, 34], dibujo: servilleta(), densidad: D * 1.6 },
  { nombre: 'buitres-tenedor', caja: [BUITRE.mano[0] - 12, BUITRE.mano[1] - 52, 44, 64], dibujo: tenedor(), densidad: D * 1.6 },
  { nombre: 'buitres-cuchillo', caja: [BUITRE.mano[0] - 12, BUITRE.mano[1] - 54, 50, 66], dibujo: cuchillo(), densidad: D * 1.6 },
  { nombre: 'buitres-chispa', caja: [CHOCAN[0] - 22, CHOCAN[1] - 22, 44, 44], dibujo: `<g transform="translate(${CHOCAN[0]} ${CHOCAN[1]})">${chispa()}</g>`, densidad: D * 1.6 },
];

const img = imagenesDe(PIEZAS_BUITRES);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Qué cuerpo y qué cabeza lleva cada uno, y qué cubierto: el de la izquierda, el tenedor; el de la derecha, el cuchillo. */
const VARIANTES: readonly (readonly ['a' | 'b', 'tenedor' | 'cuchillo'])[] = [['a', 'tenedor'], ['b', 'cuchillo']];

/** Los dos buitres armados con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const buitre = (i: 0 | 1): string => {
    const n = i + 1;
    const [v, cubierto] = VARIANTES[i]!;
    return parte(`buitre-${n}`,
      parte(`cuello-${n}`, img(`buitres-cuello-${v}`) + parte(`parpado-${n}`, img('buitres-parpado'), t[`parpado-${n}`]), t[`cuello-${n}`]) +
      parte(`cuerpo-${n}`, img(`buitres-cuerpo-${v}`), t[`cuerpo-${n}`]) +
      parte(`servilleta-${n}`, img('buitres-servilleta'), t[`servilleta-${n}`]) +
      parte(`cubierto-${n}`, img(`buitres-${cubierto}`), t[`cubierto-${n}`]),
      t[`buitre-${n}`]);
  };
  return img('buitres-travesano') + buitre(0) + buitre(1) + parte('chispa', img('buitres-chispa'), t.chispa, o.chispa);
}

/** Los buitres en un momento, sin lo que los hace tocables: para el test, el retrato y para mirarlos. */
export function buitresEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--buitres" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'Los buitres de la tele'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: los dos de golpe encima de quien mira, con los cubiertos arriba. */
export const RETRATO = { caja: [BUITRES.x - 80, BUITRES.piso - 90, 160, 110] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/cyber-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    buitresEn(ENCIMA)
  );
}

export const BUITRES_PERSONAJE: Personaje = {
  id: ID,
  region: 'cybersiberia',
  ancla: BUITRES.x,
  piezas: PIEZAS_BUITRES,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};

export { LUGARES };
