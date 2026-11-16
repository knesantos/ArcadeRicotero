/**
 * El pajarito del Lavi-rap (`D-73`, vigesimonovena vuelta), en su jaula linda, colgada en el ala izquierda de la prisión.
 *
 * *"Al comprar el 'pajarito' debieron preguntar, tal vez, cuánto costaba. La linda jaula del Lavi-Rap"* y *"Si el
 * pajarito da la buena van al Tortoni o al Castelar"* son de *Lavi-Rap* (1993). Es el pajarito de la suerte del
 * organillero: saca papelitos con el pico de un cajoncito. La jaula es linda y cara, y le cuelga una etiqueta con
 * el precio más grande que él. Él está flaco y pelado de a parches: lo caro era la jaula.
 *
 * De la letra son el pajarito, la compra, el precio que nadie preguntó, la linda jaula y que da la buena. Del
 * dibujo, el cajoncito de los papelitos, los parches pelados y que la etiqueta tenga más ceros del otro lado.
 * No repite al de Mister Ed (`arte-ed.ts`), que lleva la jaula en la pezuña: allá es una cosa del caballo; acá
 * manda el precio.
 *
 * Viste la tapa de *Cordero atado*, medida con sharp: las plumas son el azul de las escamas del cordero, el pico
 * y las patas el naranja del fondo, lo pelado su carne, y la jaula y la etiqueta, el oro de las letras.
 *
 * Coordenadas: el (0, 0) es la argolla de arriba de la jaula (`rig-pajarito.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { BUENA, PAJARITO, PAJARITO_ARMADO as A, QUIETO, marcas, type Momento } from './rig-pajarito.ts';

const ID = 'el-pajarito-del-lavi-rap';

/** Las tintas de *Cordero atado* (`tokens.css`). */
const C = {
  negro: 'var(--bestia-pajarito-negro)',
  azul: 'var(--bestia-pajarito-azul)',
  azulClaro: 'var(--bestia-pajarito-azul-claro)',
  azulHondo: 'var(--bestia-pajarito-azul-hondo)',
  naranja: 'var(--bestia-pajarito-naranja)',
  carne: 'var(--bestia-pajarito-carne)',
  oro: 'var(--bestia-pajarito-oro)',
  oroClaro: 'var(--bestia-pajarito-oro-claro)',
  oroHondo: 'var(--bestia-pajarito-oro-hondo)',
  cuero: 'var(--bestia-pajarito-cuero)',
};

const J = A.jaula;

/* ------------------------------------------------------------------
   La jaula linda
   ------------------------------------------------------------------ */

/** Un barrote: sale de la argolla, hace la cúpula y baja derecho a la base. */
const barrote = (x: number): string => `M0 4 Q${x * 0.9} 6 ${x} ${J.hombro} L${x} ${J.base}`;

/** Lo de atrás: la cadena al techo, los barrotes del otro lado, la percha y el piso de la jaula. */
function fondo(): string {
  const cadena = Array.from({ length: 9 }, (_, i) => `<ellipse cx="0" cy="${-76 + i * 8.6}" rx="${i % 2 ? 1 : 2.4}" ry="5" fill="none" stroke="${C.oroHondo}" stroke-width="1.4"/>`).join('');
  const atras = [-30, -10, 10, 30].map((x) => trazo(barrote(x), C.oroHondo, 1.2, 0.9)).join('');
  return conGrano(
    cadena + atras +
    // El piso de la jaula, con el alpiste desparramado, y la percha.
    forma(elipse(0, J.base, J.medio, 5), C.oroHondo) + nube(-6, J.base - 1, 20, 2, C.cuero, 'xs', 0.8) +
    [[-20, 0], [-12, 1.6], [-4, -0.6], [6, 1.4], [15, 0.4], [24, 1.6], [-27, 1.4]].map(([x, y]) => forma(elipse(x!, J.base - 1 + y!, 1, 0.6), C.oroClaro, 0.9)).join('') +
    trazo(`M${-J.medio + 3} ${A.percha + 1.4} L${J.medio - 3} ${A.percha + 1.4}`, C.cuero, 3) + trazo(`M${-J.medio + 4} ${A.percha + 0.6} L${J.medio - 4} ${A.percha + 0.6}`, C.oroClaro, 0.6, 0.6),
  );
}

/** Lo de adelante: la argolla, la cúpula con sus volutas, los barrotes, los dos aros y el zócalo labrado. */
function frente(): string {
  const barrotes = J.barrotes.map((x) => trazo(barrote(x), C.oro, 1.6) + trazo(`M${x - 0.5} ${J.hombro + 2} L${x - 0.5} ${J.base - 2}`, C.oroClaro, 0.4, 0.7)).join('');
  const voluta = (x: number, s: number): string => trazo(`M${x} ${J.hombro - 1} q${s * 5} -8 ${s * 9} -2 q${s * -1} 4 ${s * -5} 2`, C.oroClaro, 1, 0.95);
  const zocalo = cajaRedonda(-J.medio - 3, J.base - 2, J.medio * 2 + 6, 9, 2);
  return conGrano(
    `<circle cx="0" cy="0" r="4.4" fill="none" stroke="${C.oro}" stroke-width="1.8"/>` + forma(elipse(0, 5, 3.4, 2.2), C.oro) +
    barrotes +
    trazo(`M${-J.medio} ${J.hombro} Q0 ${J.hombro + 4} ${J.medio} ${J.hombro}`, C.oro, 2.2) +
    [-30, -10, 10].map((x) => voluta(x, 1)).join('') + voluta(30, -1) +
    // El zócalo: labrado, con sus patitas, que para algo costó lo que costó.
    enmascarado('m-pajarito-zocalo', zocalo, forma(zocalo, C.oro) + nube(0, J.base, J.medio, 1.6, C.oroClaro, 'xs', 0.8) + nube(0, J.base + 6, J.medio, 2, C.oroHondo, 'xs', 0.9) +
      Array.from({ length: 11 }, (_, i) => `<circle cx="${-35 + i * 7}" cy="${J.base + 2.6}" r="1.5" fill="${C.oroHondo}"/>`).join('')) +
    forma(elipse(-J.medio + 4, J.base + 9, 3, 2.2), C.oro) + forma(elipse(J.medio - 4, J.base + 9, 3, 2.2), C.oro),
  );
}

/** El cajoncito de los papelitos de la suerte, enganchado a los barrotes: los papelitos asoman de canto. */
function cajon(): string {
  const [x, y] = A.cajon;
  return conGrano(
    [[-5, -7, -8], [-1.6, -8.6, 4], [2, -7.4, -3], [5, -8.2, 9]].map(([dx, top, g]) => `<g transform="rotate(${g} ${x + dx!} ${y})">${forma(poli([[x + dx! - 1.6, y + 2], [x + dx! - 1.6, y + top!], [x + dx! + 1.8, y + top! + 0.6], [x + dx! + 1.8, y + 2]]), C.oroClaro)}</g>`).join('') +
    forma(poli([[x - 9, y], [x + 9, y], [x + 8, y + 11], [x - 8, y + 11]]), C.cuero) + nube(x, y + 9, 8, 2, C.oroHondo, 'xs', 0.9) +
    trazo(`M${x - 9} ${y} L${x + 9} ${y}`, C.oroClaro, 0.7, 0.8) + `<circle cx="${x}" cy="${y + 5.6}" r="1.3" fill="${C.oro}"/>`,
  );
}

/* ------------------------------------------------------------------
   El pajarito
   ------------------------------------------------------------------ */

/** Unas plumas en escamita, como las del cordero de la tapa. */
const escamas = (pts: ReadonlyArray<readonly [number, number]>, tinta: string): string =>
  pts.map(([x, y]) => trazo(`M${x - 2.2} ${y} q2.2 2.6 4.4 0`, tinta, 0.6, 0.85)).join('');

/** Un cañón: la pluma que no salió, parada en lo pelado. */
const canon = (x: number, y: number, a: number): string =>
  trazo(`M${x} ${y} l${Math.cos(a) * 3.4} ${Math.sin(a) * 3.4}`, C.azulHondo, 0.8) + forma(elipse(x + Math.cos(a) * 3.8, y + Math.sin(a) * 3.8, 0.8, 0.8), C.oroClaro);

/** Las dos patas, de alambre: el tarso finito, la rodilla hinchada y los dedos largos agarrados a la percha. */
function patas(): string {
  const una = (x: number, tinta: string): string =>
    trazo(`M${x + 1.6} 61 L${x + 0.4} 65.4 L${x} ${A.percha - 0.6}`, tinta, 0.9) + forma(elipse(x + 0.5, 65.4, 1.2, 1.1), tinta) +
    trazo(`M${x} ${A.percha - 1} q-4 0.2 -3.6 3.8 M${x} ${A.percha - 1} q0.4 2.2 -0.6 4.2 M${x} ${A.percha - 1} q3.8 0.2 3.6 3.8`, tinta, 0.8);
  return conGrano(una(-6, C.cuero) + una(1, C.naranja));
}

/**
 * El cuerpo: flaco, con medio pecho y la panza pelados, claros, en piel de gallina, y la quilla marcada. Lo que le
 * queda de plumas no brilla: es opaco, y en el lomo las tiene paradas a contrapelo.
 */
function cuerpo(): string {
  const d = curva([[-1, 44], [6.6, 47.6], [9.6, 56], [5, 64.6], [-4, 67], [-12, 64], [-15, 56], [-12, 48], [-7, 44]]);
  const pelado = curva([[-3, 44.6], [7, 47.6], [10, 56], [5.6, 65], [-3, 67.4], [-8, 60], [-7, 50]]);
  const gallina = [[1, 48.6], [5, 51], [0, 52.6], [6.6, 55.6], [3, 56.6], [-1, 58.6], [5.6, 60], [2, 62.6], [-3, 55.6], [-2, 63.6], [-4, 49.6], [-5, 59.6], [7, 52.6]];
  // Las plumas a contrapelo: salen del lomo para atrás y para arriba, cada una para su lado.
  const paradas = [[-13, 49, 200], [-15, 54, 172], [-15.4, 59, 150], [-12, 46, 230], [-13.6, 63, 128]].map(([x, y, g]) =>
    `<g transform="translate(${x} ${y}) rotate(${g})">${forma('M0 -1.5 L6.4 -0.6 L5.4 0.4 L6.8 1.4 L0 1.5 Z', C.azulHondo)}${trazo('M0.6 0 L5.6 0.2', C.cuero, 0.35, 0.8)}</g>`).join('');
  return conGrano(
    paradas +
    enmascarado('m-pajarito-cuerpo', d,
      forma(d, C.azulHondo) + nube(-11, 58, 5, 8, C.negro, 's', 0.5) +
      forma(pelado, C.oroClaro) + nube(5, 62, 5, 4, C.carne, 's', 0.8) + nube(-5, 56, 3, 7, C.carne, 's', 0.6) +
      gallina.map(([x, y]) => forma(elipse(x!, y!, 0.6, 0.55), C.carne) + forma(elipse(x! + 0.2, y! + 0.2, 0.3, 0.3), C.cuero)).join('') +
      // La quilla y dos costillas, que se le cuentan.
      trazo('M3.6 49 q2.4 6 -1 14', C.cuero, 0.8, 0.9) + trazo('M-1 54 q2.4 0.8 4.4 -0.4 M-2 58.6 q3 1 5 -0.2', C.cuero, 0.5, 0.85) +
      forma(elipse(-11, 61, 3, 2.4), C.carne) + forma(elipse(-11.6, 61, 0.5, 0.5), C.cuero) + forma(elipse(-10, 62, 0.5, 0.5), C.cuero) +
      escamas([[-10, 50], [-11, 55]], C.negro)) +
    trazo(d, C.cuero, 0.6, 0.85) +
    canon(7.6, 57, 0.2) + canon(5.6, 62.6, 0.6) + canon(8, 51, -0.2) + canon(-12.6, 61, 2.6),
  );
}

/** El ala plegada, a la que le faltan dos plumas. */
function ala(): string {
  const d = curva([[-7, 47], [-1, 50], [-1, 57], [-5, 61], [-8, 59], [-10, 62], [-13, 58], [-12, 51]]);
  return conGrano(
    enmascarado('m-pajarito-ala', d, forma(d, C.azulHondo) + nube(-6, 50, 3, 2, C.azul, 'xs', 0.5) + escamas([[-7, 51], [-4, 54], [-9, 55]], C.azul) +
      trazo('M-3 56 L-6 60 M-6 56 L-9 60', C.negro, 0.5, 0.7)) +
    trazo(d, C.cuero, 0.5, 0.8),
  );
}

/** La cola: tres plumas largas, una quebrada. */
function cola(): string {
  const pluma = (x: number, y: number, tinta: string): string => forma(curva([[-13, 60], [-10, 63], [x + 2, y - 1], [x, y + 1], [x - 2.4, y - 1]]), tinta);
  return conGrano(pluma(-25, 80, C.azulHondo) + pluma(-21, 83, C.azul) + forma(curva([[-12, 61], [-9, 63], [-12, 71], [-6, 76], [-8, 78], [-15, 73]]), C.azul) +
    trazo('M-12 62 L-22 80 M-11 62 L-13 75', C.oroClaro, 0.4, 0.5));
}

/** La cabeza: redonda, el ojo grande y redondo, el pico corto y la cresta rala. */
function cabeza(): string {
  const [ex, ey] = A.ojo;
  const craneo = curva([[-3, 44], [-4, 37], [0, 30.6], [7, 29], [13, 32], [15, 38], [12, 44], [5, 47]]);
  return conGrano(
    enmascarado('m-pajarito-craneo', craneo,
      forma(craneo, C.azulHondo) + nube(8, 33, 4, 2.4, C.azul, 's', 0.55) + nube(-1, 42, 4, 4, C.negro, 's', 0.4) +
      // El cogote pelado, en piel de gallina, y un parche en la coronilla.
      forma(curva([[1, 47.6], [2, 41.6], [8, 40.6], [14, 42], [12, 47.6]]), C.oroClaro) + nube(6, 46, 5, 2, C.carne, 'xs', 0.7) +
      [[5, 44], [8, 43.4], [10.6, 44.6], [7, 45.8]].map(([x, y]) => forma(elipse(x!, y!, 0.5, 0.45), C.cuero)).join('') +
      forma(elipse(0.6, 33, 3, 2.4), C.oroClaro) + forma(elipse(0, 33, 0.4, 0.4), C.cuero) + forma(elipse(1.6, 33.8, 0.4, 0.4), C.cuero) + escamas([[4, 34], [-1, 39]], C.azul)) +
    trazo(craneo, C.cuero, 0.6, 0.85) +
    // El pico, corto y fuerte, con la comisura.
    forma(poli([[13.4, 36.4], [A.pico[0], A.pico[1]], [13.6, 40.2]]), C.naranja) + forma(poli([[13.6, 40.2], [19, 41], [13.4, 42.6]]), C.cuero) +
    trazo(`M13.6 40.2 L${A.pico[0] - 1} ${A.pico[1] + 0.2}`, C.negro, 0.4, 0.7) +
    // El ojo: redondo, de pájaro, con su aro.
    forma(elipse(ex, ey, 3.6, 3.6), C.oroClaro) + forma(elipse(ex + 0.3, ey, 2.4, 2.4), C.negro) + forma(elipse(ex - 0.5, ey - 0.9, 0.8, 0.8), C.oroClaro) +
    // La ojera, y el párpado de arriba, que le pesa.
    trazo(`M${ex - 3.6} ${ey + 2.4} Q${ex} ${ey + 5.6} ${ex + 3.6} ${ey + 2.2}`, C.negro, 1.1, 0.85) + trazo(`M${ex - 3.4} ${ey + 4.4} Q${ex} ${ey + 6.6} ${ex + 2.6} ${ey + 4.4}`, C.cuero, 0.5, 0.8) +
    forma(`M${ex - 3.6} ${ey} A3.6 3.6 0 0 1 ${ex + 3.6} ${ey} L${ex + 3.4} ${ey - 1.2} Q${ex} ${ey - 2} ${ex - 3.4} ${ey - 1.2} Z`, C.carne) +
    // La cresta: cuatro pelos y un cañón.
    trazo('M4.6 30 l-1.4 -6 l5.4 -2.6', C.azulClaro, 1.1, 0.95) + trazo('M7.4 29.6 q1.4 -2.6 0.4 -4.6', C.azul, 0.8, 0.95) + canon(0, 31.6, 4.2) + canon(2, 30.6, 4.6),
  );
}

/** El párpado, que sube desde abajo, como en los pájaros. */
function parpado(): string {
  const [ex, ey] = A.ojo;
  return conGrano(forma(elipse(ex, ey, 3.7, 3.7), C.carne) + trazo(`M${ex - 3} ${ey - 0.6} Q${ex} ${ey - 2.4} ${ex + 3} ${ey - 0.6}`, C.cuero, 0.6));
}

/** Un papelito de la suerte, doblado: en blanco. Va en el pico, o cayendo. */
function papelito(x: number, y: number): string {
  return conGrano(forma(poli([[x - 5, y - 7], [x + 5.6, y - 6.2], [x + 5, y + 7], [x - 5.6, y + 6.2]]), C.oroClaro) +
    trazo(`M${x - 4} ${y} L${x + 4.2} ${y + 0.4}`, C.oro, 0.4, 0.8) + nube(x + 2, y + 3, 2, 2, C.oro, 'xs', 0.35));
}

/** La tilde del papelito bueno. */
function tilde(x: number, y: number): string {
  return conGrano(trazo(`M${x - 3.4} ${y} l2.4 3.4 l4.6 -7`, C.oroHondo, 2.6) + trazo(`M${x - 3.4} ${y} l2.4 3.4 l4.6 -7`, C.naranja, 1.2));
}

/** Una pluma que se le cae. */
function pluma(): string {
  return conGrano(forma(curva([[0, -7], [2.2, -2], [1.4, 5], [0, 7], [-1.6, 4], [-2.2, -2]]), C.azul) + trazo('M0 -6 L0.2 8', C.oroClaro, 0.5, 0.8) + nube(-0.8, -2, 1, 3, C.azulClaro, 'xs', 0.8));
}

/* ------------------------------------------------------------------
   La etiqueta del precio
   ------------------------------------------------------------------ */

const E = A.etiqueta;

/** Los números, a mano: un peso, un nueve, y ceros de a tres. */
const cero = (x: number, y: number, h: number): string => `<ellipse cx="${x}" cy="${y}" rx="${h * 0.3}" ry="${h * 0.5}" fill="none" stroke="${C.negro}" stroke-width="${h * 0.15}"/>`;
const punto = (x: number, y: number, h: number): string => `<circle cx="${x}" cy="${y + h * 0.48}" r="${h * 0.09}" fill="${C.negro}"/>`;
const nueve = (x: number, y: number, h: number): string =>
  `<circle cx="${x}" cy="${y - h * 0.18}" r="${h * 0.28}" fill="none" stroke="${C.negro}" stroke-width="${h * 0.15}"/>` + trazo(`M${x + h * 0.28} ${y - h * 0.16} Q${x + h * 0.3} ${y + h * 0.4} ${x - h * 0.2} ${y + h * 0.5}`, C.negro, h * 0.15);
const peso = (x: number, y: number, h: number): string =>
  trazo(`M${x + h * 0.26} ${y - h * 0.3} Q${x} ${y - h * 0.6} ${x - h * 0.24} ${y - h * 0.26} Q${x - h * 0.3} ${y} ${x} ${y} Q${x + h * 0.34} ${y + h * 0.04} ${x + h * 0.24} ${y + h * 0.3} Q${x} ${y + h * 0.6} ${x - h * 0.28} ${y + h * 0.3}`, C.negro, h * 0.14) +
  trazo(`M${x} ${y - h * 0.66} L${x} ${y + h * 0.66}`, C.negro, h * 0.1);

/** Una tira de precio desde `x`: el peso, el nueve y `grupos` de tres ceros con su punto. Devuelve el dibujo. */
function precio(x: number, y: number, h: number, grupos: number, conPeso = true): string {
  const paso = h * 0.78;
  let s = conPeso ? peso(x, y, h) + nueve(x + paso * 1.15, y, h) : '';
  let cx = x + (conPeso ? paso * 1.9 : 0);
  for (let g = 0; g < grupos; g++) {
    s += punto(cx, y, h);
    cx += paso * 0.55;
    for (let i = 0; i < 3; i++) { s += cero(cx, y, h); cx += paso; }
    cx -= paso * 0.3;
  }
  return s;
}

/** El cartón de la etiqueta, con el ojal, el piolín y el nudo; `atras` es la cara de atrás, más sucia. */
function carton(atras: boolean): string {
  const [nx, ny] = A.nudo;
  const d = poli([[E.x + 7, E.y], [E.x + E.ancho, E.y + 1], [E.x + E.ancho - 1, E.y + E.alto], [E.x + 1, E.y + E.alto - 1], [E.x, E.y + 8]]);
  return (
    trazo(`M${nx} ${ny} Q${nx - 3} ${ny + 6} ${E.x + 9} ${E.y + 6}`, C.cuero, 0.9) +
    enmascarado(`m-pajarito-carton-${atras ? 2 : 1}`, d,
      forma(d, C.oroClaro) + nube(E.x + E.ancho, E.y + E.alto, 16, 10, C.oro, 'm', atras ? 0.55 : 0.3) + nube(E.x + 10, E.y + 6, 12, 6, C.carne, 's', atras ? 0.4 : 0.15)) +
    trazo(d, C.oroHondo, 0.7, 0.8) + `<circle cx="${E.x + 9}" cy="${E.y + 7}" r="2.2" fill="${C.negro}"/><circle cx="${E.x + 9}" cy="${E.y + 7}" r="3.2" fill="none" stroke="${C.oro}" stroke-width="0.9"/>`
  );
}

/** La cara de adelante: el precio, que nadie preguntó. Entra entero en el cartón. */
function etiqueta1(): string {
  return conGrano(carton(false) + precio(E.x + 9, E.y + 25, 9.6, 2) + trazo(`M${E.x + 7} ${E.y + 37} L${E.x + E.ancho - 6} ${E.y + 38}`, C.naranja, 1.3, 0.9));
}

/** Dónde arranca la tira de papel de la cara de atrás, y lo que mide. */
const TIRA = { x: E.x + 44, y: E.y + E.alto - 8, ancho: 22, alto: 42 } as const;

/**
 * La de atrás: el precio sigue, y como el cartón se quedó corto, sigue en una tira de papel pegada con dos cintas,
 * que cuelga: tres renglones más de ceros, y la punta rasgada.
 */
function etiqueta2(): string {
  const T = TIRA;
  const papel = poli([[T.x, T.y], [T.x + T.ancho, T.y + 0.6], [T.x + T.ancho - 0.6, T.y + T.alto - 3], [T.x + T.ancho - 5, T.y + T.alto], [T.x + T.ancho - 10, T.y + T.alto - 3.4], [T.x + 6, T.y + T.alto - 0.4], [T.x + 0.6, T.y + T.alto - 4]]);
  const renglones = [0, 1, 2].map((i) => precio(T.x + 2.2, T.y + 13 + i * 9.4, 6, 1, false)).join('');
  const cinta = (x: number, y: number, g: number): string => `<g transform="rotate(${g} ${x} ${y})">${forma(poli([[x - 6, y - 2.4], [x + 6, y - 2.8], [x + 6.4, y + 2.4], [x - 5.6, y + 2.8]]), C.oro, 0.8)}${trazo(`M${x - 6} ${y - 2.4} l0.6 5.2 M${x + 6} ${y - 2.8} l0.4 5.2`, C.oroHondo, 0.4, 0.7)}</g>`;
  return conGrano(
    forma(papel, C.oroClaro) + trazo(papel, C.oroHondo, 0.5, 0.7) + nube(T.x + T.ancho / 2, T.y + T.alto - 6, 8, 6, C.oro, 's', 0.3) + renglones +
    carton(true) + precio(E.x + 9, E.y + 18, 8.6, 2) + trazo(`M${E.x + 7} ${E.y + 28} L${E.x + 40} ${E.y + 28.6}`, C.naranja, 1.1, 0.9) +
    cinta(T.x + 5, T.y + 9, -24) + cinta(T.x + T.ancho - 4, T.y + 9, 18),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 4;
const [EX, EY] = A.ojo;
const [BX, BY] = [A.pico[0] + 4, A.pico[1] + 8];
const CAJA_ETIQUETA = [E.x - 4, A.nudo[1] - 2, E.ancho + 8, TIRA.y + TIRA.alto + 4 - (A.nudo[1] - 2)] as const;

export const PIEZAS_PAJARITO: readonly Pieza[] = [
  { nombre: 'pajarito-fondo', caja: [-J.medio - 6, -82, J.medio * 2 + 12, J.base + 90], dibujo: fondo(), densidad: D * 0.8 },
  { nombre: 'pajarito-cajon', caja: [A.cajon[0] - 11, A.cajon[1] - 11, 22, 24], dibujo: cajon(), densidad: D * 1.4 },
  { nombre: 'pajarito-patas', caja: [-12, 60, 20, 16], dibujo: patas(), densidad: D * 1.6 },
  { nombre: 'pajarito-cola', caja: [-29, 57, 22, 28], dibujo: cola(), densidad: D * 1.4 },
  { nombre: 'pajarito-cuerpo', caja: [-24, 38, 38, 33], dibujo: cuerpo(), densidad: D * 1.6 },
  { nombre: 'pajarito-ala', caja: [-16, 44, 18, 21], dibujo: ala(), densidad: D * 1.6 },
  { nombre: 'pajarito-cabeza', caja: [-8, 19, 32, 31], dibujo: cabeza(), densidad: D * 1.8 },
  { nombre: 'pajarito-parpado', caja: [EX - 5, EY - 5, 10, 10], dibujo: parpado(), densidad: D * 2.4 },
  { nombre: 'pajarito-papel', caja: [BX - 7, BY - 8, 14, 16], dibujo: papelito(BX, BY), densidad: D * 2 },
  { nombre: 'pajarito-tilde', caja: [BX - 5, BY - 6, 10, 11], dibujo: tilde(BX, BY), densidad: D * 2.4 },
  { nombre: 'pajarito-jaula', caja: [-J.medio - 6, -6, J.medio * 2 + 12, J.base + 20], dibujo: frente(), densidad: D * 0.9 },
  { nombre: 'pajarito-etiqueta-1', caja: CAJA_ETIQUETA, dibujo: etiqueta1(), densidad: D * 1.2 },
  { nombre: 'pajarito-etiqueta-2', caja: CAJA_ETIQUETA, dibujo: etiqueta2(), densidad: D * 1.2 },
  { nombre: 'pajarito-suelto', caja: [-7, -8, 14, 16], dibujo: papelito(0, 0), densidad: D * 2 },
  { nombre: 'pajarito-pluma', caja: [-4, -8, 8, 17], dibujo: pluma(), densidad: D * 2 },
];

const img = imagenesDe(PIEZAS_PAJARITO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** La jaula con el pajarito, armada con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return parte('colgada',
    img('pajarito-fondo') +
    img('pajarito-cajon') +
    parte('pajaro',
      img('pajarito-patas') +
      parte('cola', img('pajarito-cola'), t.cola) +
      parte('bulto', img('pajarito-cuerpo'), t.bulto) +
      parte('ala', img('pajarito-ala'), t.ala) +
      parte('cabeza',
        img('pajarito-cabeza') +
        parte('parpado', img('pajarito-parpado'), '', o.parpado) +
        parte('papel', img('pajarito-papel') + parte('buena', img('pajarito-tilde'), '', o.buena), '', o.papel),
        t.cabeza),
      t.pajaro) +
    parte('pluma', img('pajarito-pluma'), t.pluma, o.pluma) +
    parte('suelto', img('pajarito-suelto'), t.suelto, o.suelto) +
    img('pajarito-jaula') +
    parte('etiqueta',
      parte('cara', parte('precio-1', img('pajarito-etiqueta-1'), '', o['precio-1']) + parte('precio-2', `<g transform="translate(${2 * E.x + E.ancho} 0) scale(-1 1)">${img('pajarito-etiqueta-2')}</g>`, '', o['precio-2']), t.cara),
      t.etiqueta),
    t.colgada);
}

/** El pajarito en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function pajaritoEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** Un rectángulo sin tinta del tamaño de la jaula y su etiqueta: se toca por entre los barrotes. */
const TOQUE = `<rect x="${-J.medio - 6}" y="-4" width="${E.x + E.ancho + J.medio + 10}" height="${E.y + E.alto + 6}" fill="transparent"/>`;

function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--pajarito" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El pajarito del Lavi-rap'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${TOQUE}${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: con el papelito bueno en el pico y la etiqueta dada vuelta. */
export const RETRATO = { caja: [PAJARITO.x - 62, PAJARITO.y - 8, 150, 200] as const };
function retrato(): string {
  return `<image href="/bestiario/prision-lejos.webp" x="-250" y="0" width="1400" height="640" preserveAspectRatio="none"/>` + pajaritoEn(BUENA);
}

export const PAJARITO_PERSONAJE: Personaje = {
  id: ID,
  region: 'la-prision',
  ancla: PAJARITO.x,
  piezas: PIEZAS_PAJARITO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
