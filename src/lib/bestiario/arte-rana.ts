/**
 * La rana rubia (`D-73`, vigesimoséptima vuelta), tomando sol arriba de un container.
 *
 * *"Alquiló una rana rubia, tibia y haragana"* es de *El pibe de los astilleros*, en *La mosca y la sopa* (1991).
 * Se toma al pie de la letra, palabra por palabra: es una **rana**; es **rubia** porque tiene una peluca, que se le
 * corre; está **tibia** porque toma sol en una reposera, de noche y con llovizna, con un reflector de papel de
 * aluminio abajo del mentón para que le dé el farol de la grúa, y ya está colorada; es **haragana** porque le tira
 * un lengüetazo a la mosca sin levantarse y le erra; y está **alquilada**: de la reposera cuelga la etiqueta del
 * alquiler, con el piolín, como en una casa de disfraces. Del mismo tema: *"el más bello fuselaje que jamás lustró"*
 * (tiene el cuero lustrado, con un brillo largo en el muslo) y *"una linda damita"* (la boca pintada). Cuando la
 * tocan se levanta los anteojos, mira, y croa: el buche se le infla tanto que la levanta de la reposera.
 *
 * De la letra son la rana, lo rubia, lo tibia, lo haragana, el alquiler y el lustre. Del dibujo son la reposera, el
 * reflector, los anteojos y la mosca, que es la del disco.
 *
 * Viste *La mosca y la sopa*, medido con sharp: el cuero es el rosa del lomo de la caja, colorado del sol con el
 * rojo de la tapa; la peluca es el amarillo de las letras; los anteojos son el negro de la foto; el reflector es
 * el haz del seguidor; la reposera, las rayas rojas y crema; y la etiqueta, el cartón de la contratapa.
 *
 * Coordenadas: el (0, 0) es el techo del container debajo del medio de la reposera (`rig-rana.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, poli } from './trazos.ts';
import { CROA, QUIETO, RANA, RANA_ARMADO as A, marcas, type Momento } from './rig-rana.ts';

const ID = 'la-rana-rubia';

/** Las tintas de *La mosca y la sopa* (`tokens.css`). */
const C = {
  piel: 'var(--bestia-rana-piel)',
  pielClara: 'var(--bestia-rana-piel-clara)',
  pielHonda: 'var(--bestia-rana-piel-honda)',
  rojo: 'var(--bestia-rana-rojo)',
  rojoHondo: 'var(--bestia-rana-rojo-hondo)',
  amarillo: 'var(--bestia-rana-amarillo)',
  amarilloClaro: 'var(--bestia-rana-amarillo-claro)',
  amarilloHondo: 'var(--bestia-rana-amarillo-hondo)',
  negro: 'var(--bestia-rana-negro)',
  haz: 'var(--bestia-rana-haz)',
  hazHondo: 'var(--bestia-rana-haz-hondo)',
  sepia: 'var(--bestia-rana-sepia)',
  carton: 'var(--bestia-rana-carton)',
  crema: 'var(--bestia-rana-crema)',
};

/* ------------------------------------------------------------------
   La reposera y la etiqueta del alquiler
   ------------------------------------------------------------------ */

/** La reposera: la lona a rayas, el respaldo, y las patas de caño cruzadas sobre el techo del container. */
function reposera(): string {
  const lona = 'M-86 -56 L-34 -14 L34 -14 L74 -6 L72 0 L32 -7 L-38 -7 L-92 -50 Z';
  let rayas = '';
  for (let i = 0; i < 14; i++) {
    const x = -90 + i * 12.4;
    rayas += forma(poli([[x, -70], [x + 6.2, -70], [x + 6.2, 6], [x, 6]]), i % 2 ? C.crema : C.rojo);
  }
  return conGrano(
    // Los caños, cruzados, y el apoyabrazos.
    trazo('M-78 -42 L-10 0 M-40 -18 L-66 0 M30 -10 L52 0 M60 -8 L36 0', C.hazHondo, 3.4) + trazo('M-78 -42 L-10 0 M30 -10 L52 0', C.haz, 1, 0.6) +
    enmascarado('m-rana-lona', lona, rayas + nube(0, -4, 80, 5, C.rojoHondo, 's', 0.6) + nube(-66, -40, 14, 12, C.rojoHondo, 's', 0.4)) +
    trazo('M-86 -56 L-34 -14 L34 -14 L74 -6', C.haz, 1.6, 0.8) +
    // Las gotas de la llovizna, en el techo del container, y el charquito.
    nube(0, 1, 84, 2.4, C.negro, 'xs', 0.55) + [[-60, 2], [-22, 3], [44, 2], [70, 3]].map(([x, y]) => forma(elipse(x!, y!, 2.4, 1), C.haz, 0.5)).join(''),
  );
}

/** La etiqueta del alquiler: un cartón con el ojal, el piolín, y unos renglones que no se leen. */
function etiqueta(): string {
  const [ex, ey] = A.etiqueta;
  const d = poli([[ex - 9, ey + 14], [ex - 3, ey + 9], [ex + 6, ey + 12], [ex + 4, ey + 38], [ex - 12, ey + 36]]);
  return conGrano(
    trazo(`M${ex} ${ey} Q${ex + 2} ${ey + 6} ${ex - 3} ${ey + 13}`, C.crema, 1, 0.9) +
    enmascarado('m-rana-etiqueta', d, forma(d, C.carton) + nube(ex - 2, ey + 34, 10, 4, C.sepia, 'xs', 0.6)) +
    forma(elipse(ex - 3, ey + 14, 1.6, 1.6), C.negro) +
    trazo(`M${ex - 8} ${ey + 21} l10 1 M${ex - 9} ${ey + 26} l11 1 M${ex - 9} ${ey + 31} l6 0.6`, C.sepia, 1.1, 0.85) +
    // El sello colorado de «alquilada».
    `<rect x="${ex - 6}" y="${ey + 27}" width="9" height="6" fill="none" stroke="${C.rojo}" stroke-width="1.1" transform="rotate(-14 ${ex - 2} ${ey + 30})"/>`,
  );
}

/* ------------------------------------------------------------------
   La rana: el cuerpo recostado, la pierna cruzada, el pie, el brazo del reflector
   ------------------------------------------------------------------ */

/** El cuerpo: la panza para arriba, el brazo de atrás de la nuca, el muslo doblado y la pierna de lejos estirada. */
function cuerpo(): string {
  const torso = curva([[-58, -62], [-40, -66], [-10, -58], [18, -42], [28, -26], [10, -16], [-26, -18], [-52, -34]]);
  // La pierna de lejos, estirada sobre la lona, con la pata en la punta.
  const lejos = curva([[10, -30], [40, -24], [66, -16], [84, -20], [90, -12], [70, -6], [40, -10], [12, -16]]);
  // La de cerca: el muslo sube a la rodilla y la canilla cruza por arriba.
  const muslo = curva([[4, -36], [22, -52], [34, -70], [44, -68], [40, -48], [26, -28], [10, -22]]);
  const canilla = curva([[32, -68], [42, -72], [60, -50], [62, -38], [54, -36], [44, -50]]);
  const brazo = curva([[-50, -60], [-66, -70], [-82, -72], [-86, -66], [-70, -58], [-52, -50]]);
  return conGrano(
    enmascarado('m-rana-lejos', lejos, forma(lejos, C.pielHonda) + nube(50, -10, 30, 4, C.rojoHondo, 's', 0.6)) +
    [0, 1, 2].map((i) => forma(elipse(88 + i * 3, -20 + i * 5, 3.4, 2.8), C.pielHonda)).join('') +
    enmascarado('m-rana-brazo-atras', brazo, forma(brazo, C.pielHonda) + nube(-70, -60, 12, 4, C.rojoHondo, 'xs', 0.5)) +
    enmascarado('m-rana-torso', torso,
      forma(torso, C.piel) + nube(-14, -22, 40, 8, C.pielHonda, 's', 0.8) +
      // La panza, más clara, y colorada del sol arriba, con la marca de la malla que no tiene.
      nube(-16, -50, 28, 10, C.pielClara, 's', 0.9) + nube(-6, -56, 22, 4, C.rojo, 's', 0.5) + trazo('M-22 -44 q4 3 8 0', C.pielHonda, 1, 0.8)) +
    enmascarado('m-rana-muslo', muslo, forma(muslo, C.piel) + nube(26, -34, 8, 16, C.pielHonda, 's', 0.6) +
      // El lustre: el brillo largo del fuselaje.
      trazo('M14 -40 Q26 -52 36 -66', C.amarilloClaro, 2.2, 0.75) + nube(30, -60, 6, 6, C.rojo, 'xs', 0.4)) +
    enmascarado('m-rana-canilla', canilla, forma(canilla, C.piel) + nube(52, -44, 5, 12, C.pielHonda, 'xs', 0.6) + trazo('M40 -68 Q52 -56 58 -42', C.amarilloClaro, 1.4, 0.6)) +
    // Las manchas del lomo, que asoman por el costado.
    [[-40, -26, 4], [-30, -22, 3], [0, -20, 3.4]].map(([x, y, r]) => forma(elipse(x!, y!, r!, r! * 0.7), C.rojoHondo, 0.5)).join(''),
  );
}

/** El pie de la pierna cruzada: la pata larga de rana, con los tres dedos y sus ventosas, que cuelga y se mueve. */
function pie(): string {
  const [tx, ty] = A.tobillo;
  const d = curva([[tx - 5, ty - 5], [tx + 6, ty - 4], [tx + 20, ty + 4], [tx + 30, ty + 2], [tx + 34, ty + 10], [tx + 20, ty + 14], [tx + 4, ty + 6], [tx - 6, ty + 3]]);
  return conGrano(
    enmascarado('m-rana-pie', d, forma(d, C.piel) + nube(tx + 16, ty + 10, 14, 3, C.pielHonda, 'xs', 0.7)) +
    [[30, 0], [35, 7], [30, 14]].map(([x, y]) => trazo(`M${tx + 22} ${ty + 7} L${tx + x!} ${ty + y!}`, C.piel, 3) + forma(elipse(tx + x! + 1.6, ty + y!, 3.2, 3), C.pielClara)).join(''),
  );
}

/** El brazo de cerca, con el reflector: un cartón forrado en papel de aluminio, abierto abajo del mentón. */
function brazo(): string {
  const [hx, hy] = A.hombro;
  const d = curva([[hx - 6, hy - 4], [hx + 6, hy - 7], [hx + 22, hy - 6], [hx + 34, hy - 12], [hx + 38, hy - 6], [hx + 24, hy + 3], [hx + 4, hy + 5]]);
  // La hoja de arriba es un abanico arrugado, no una pantalla: los pliegues salen todos del mismo punto.
  const hoja = poli([[hx + 30, hy - 4], [hx + 22, hy - 36], [hx + 34, hy - 54], [hx + 52, hy - 58], [hx + 68, hy - 46], [hx + 72, hy - 26], [hx + 62, hy - 2]]);
  const hoja2 = poli([[hx + 30, hy - 4], [hx + 62, hy - 2], [hx + 70, hy + 8], [hx + 26, hy + 6]]);
  const pliegues = [[22, -36], [34, -54], [52, -58], [68, -46], [72, -26]].map(([x, y]) => `M${hx + 46} ${hy - 3} L${hx + x!} ${hy + y!}`).join(' ');
  return conGrano(
    enmascarado('m-rana-hoja2', hoja2, forma(hoja2, C.hazHondo) + nube(hx + 48, hy + 2, 18, 3, C.haz, 'xs', 0.6)) +
    enmascarado('m-rana-hoja', hoja, forma(hoja, C.haz) + nube(hx + 62, hy - 20, 10, 22, C.hazHondo, 's', 0.6) + nube(hx + 26, hy - 30, 5, 14, C.hazHondo, 's', 0.4) +
      // Las arrugas del papel de aluminio, y el farol de la grúa, que le rebota.
      trazo(pliegues, C.hazHondo, 0.8, 0.75) + nube(hx + 42, hy - 38, 7, 8, C.amarilloClaro, 'xs', 0.95)) +
    trazo(`M${hx + 42} ${hy - 50} l0 24 M${hx + 30} ${hy - 38} l24 0 M${hx + 34} ${hy - 46} l16 16 M${hx + 50} ${hy - 46} l-16 16`, C.amarilloClaro, 0.9, 0.85) +
    trazo(`M${hx + 30} ${hy - 4} L${hx + 62} ${hy - 2}`, C.negro, 1, 0.6) +
    enmascarado('m-rana-brazo', d, forma(d, C.piel) + nube(hx + 16, hy + 2, 16, 3, C.pielHonda, 'xs', 0.7) + nube(hx + 8, hy - 6, 8, 2, C.rojo, 'xs', 0.4)) +
    [[36, -14], [40, -9], [38, -3]].map(([x, y]) => forma(elipse(hx + x!, hy + y!, 3, 2.6), C.pielClara)).join(''),
  );
}

/* ------------------------------------------------------------------
   La cabeza: el buche, la cara, la boca pintada, los ojos, los anteojos, la peluca
   ------------------------------------------------------------------ */

/** El buche: la bolsa de abajo del mentón, que se infla. Va dibujada desinflable: una bola con los pliegues. */
function buche(): string {
  const [bx, by] = A.buche;
  const d = elipse(bx + 2, by + 2, 11, 10);
  return conGrano(enmascarado('m-rana-buche', d, forma(d, C.pielClara) + nube(bx + 5, by + 6, 7, 5, C.piel, 'xs', 0.8) + nube(bx - 2, by - 3, 4, 3, C.crema, 'xs', 0.8) + trazo(`M${bx - 4} ${by + 8} q6 3 12 -2 M${bx - 6} ${by + 3} q8 4 15 -3`, C.pielHonda, 0.5, 0.5)));
}

function cabeza(): string {
  const d = curva([[-84, -70], [-78, -84], [-58, -90], [-36, -86], [-24, -76], [-26, -64], [-40, -56], [-62, -54], [-80, -60]]);
  const [mx, my] = A.boca;
  return conGrano(
    // Los ojos saltones, arriba de la cabeza: el bulto, el blanco y el brillo.
    A.ojos.map(([ox, oy], n) => forma(elipse(ox, oy, A.radio + 2.4, A.radio + 2.4), n ? C.pielHonda : C.piel) + forma(elipse(ox, oy, A.radio, A.radio), C.amarilloClaro) + nube(ox + 2, oy + 3, 5, 3, C.amarilloHondo, 'xs', 0.6)).reverse().join('') +
    enmascarado('m-rana-cabeza', d,
      forma(d, C.piel) + nube(-56, -58, 26, 6, C.pielClara, 's', 0.9) + nube(-76, -68, 8, 10, C.pielHonda, 's', 0.6) +
      // La nariz colorada del sol.
      nube(-34, -82, 8, 4, C.rojo, 'xs', 0.6)) +
    forma(elipse(-30, -81, 1.2, 0.9), C.negro) + forma(elipse(-34, -83, 1.2, 0.9), C.negro) +
    // La boca: ancha, pintada, con la comisura para arriba de este lado.
    trazo(`M-78 -64 Q-56 -60 ${mx} ${my}`, C.rojo, 3.2) + trazo(`M-78 -64 Q-56 -60 ${mx} ${my}`, C.rojoHondo, 0.9, 0.9) + trazo(`M${mx} ${my} q3 -2 3 -5`, C.rojoHondo, 1, 0.9),
  );
}

/** La lengua: larga, con la bola pegajosa en la punta. Va dibujada estirada para la derecha; la isla la gira y la encoge. */
function lengua(): string {
  const [mx, my] = A.boca;
  const l = A.lengua.largo;
  const d = curva([[mx, my - 2.4], [mx + l * 0.5, my - 1.8], [mx + l - 8, my - 2.6], [mx + l - 3, my - 5], [mx + l + 2, my], [mx + l - 3, my + 5], [mx + l - 8, my + 2.6], [mx + l * 0.5, my + 1.8], [mx, my + 2.4]]);
  return conGrano(enmascarado('m-rana-lengua', d, forma(d, C.rojo) + nube(mx + l - 3, my - 1, 4, 3, C.pielClara, 'xs', 0.7) + trazo(`M${mx} ${my + 1.4} L${mx + l - 8} ${my + 1.6}`, C.rojoHondo, 0.8, 0.7)));
}

function parpado(n: 0 | 1): string {
  const [ox, oy] = A.ojos[n];
  const r = A.radio;
  return conGrano(forma(elipse(ox, oy, r + 1.6, r + 1.6), n ? C.pielHonda : C.piel) + nube(ox, oy - 3, r - 2, 3, C.rojo, 'xs', 0.45) + trazo(`M${ox - r - 0.6} ${oy + 1.4} Q${ox} ${oy + r + 2.4} ${ox + r + 0.6} ${oy + 1.4}`, C.rojoHondo, 1.2) +
    // Las pestañas, postizas.
    [-5, 0, 5].map((x) => trazo(`M${ox + x} ${oy + r + 1} l${x * 0.2 + 0.6} 3.6`, C.negro, 0.9, 0.9)).join(''));
}

function pupila(n: 0 | 1): string {
  const [ox, oy] = A.ojos[n];
  return forma(`M${ox - 5} ${oy + 1} q5 -5 10 0 q-5 5 -10 0 Z`, C.negro) + forma(elipse(ox + 2, oy - 0.6, 1, 1), C.amarilloClaro);
}

/**
 * Los anteojos de sol: dos lentes de gata separados, cada uno con su marco claro y su reflejo, el puente y la patilla.
 * Tienen que leerse como anteojos también levantados en la frente: por eso los lentes no se tocan y llevan marco.
 */
function anteojos(): string {
  const lente = ([ox, oy]: readonly [number, number]): string => curva([[ox - 9, oy - 1], [ox - 5, oy - 8], [ox + 5, oy - 8], [ox + 11, oy - 11], [ox + 9, oy + 3], [ox + 3, oy + 8], [ox - 6, oy + 7]]);
  const [a, b] = A.ojos;
  return conGrano(
    // La patilla, que va para la oreja, y el puente, arriba, entre los dos lentes.
    trazo(`M${b[0] - 9} ${b[1] - 2} l-11 7`, C.negro, 2) +
    trazo(`M${b[0] + 8} ${b[1] - 6} Q${(a[0] + b[0]) / 2} ${a[1] - 12} ${a[0] - 8} ${a[1] - 6}`, C.negro, 2.4) + trazo(`M${b[0] + 8} ${b[1] - 6} Q${(a[0] + b[0]) / 2} ${a[1] - 12} ${a[0] - 8} ${a[1] - 6}`, C.haz, 0.7, 0.8) +
    [b, a].map((o, i) => forma(lente(o), C.negro) + trazo(lente(o), C.haz, 1.1, 0.9) + nube(o[0] + 3, o[1] + 3, 4, 2.4, i ? C.hazHondo : C.sepia, 'xs', 0.8) +
      // El farol de la grúa, en cada lente.
      trazo(`M${o[0] - 5} ${o[1] - 3} l6 -3`, C.haz, 1.8, 0.95) + trazo(`M${o[0] - 3} ${o[1] + 1} l3 -1.4`, C.haz, 1, 0.8)).join(''),
  );
}

/** La peluca rubia: un carré con flequillo, que le tapa la nuca y se le corre. */
function peluca(): string {
  const d = curva([[-54, -96], [-66, -106], [-82, -104], [-94, -92], [-98, -74], [-96, -56], [-86, -50], [-80, -58], [-84, -72], [-80, -84], [-70, -90], [-58, -88]]);
  return conGrano(
    enmascarado('m-rana-peluca', d, forma(d, C.amarillo) + nube(-92, -64, 6, 16, C.amarilloHondo, 's', 0.8) + nube(-78, -100, 12, 4, C.amarilloClaro, 'xs', 0.9) + nube(-84, -54, 8, 4, C.sepia, 'xs', 0.4) +
      // Los mechones, peinados con spray.
      trazo('M-66 -104 Q-84 -98 -90 -78 M-74 -102 Q-92 -90 -94 -66 M-60 -94 q-10 -2 -18 6', C.amarilloHondo, 1, 0.75) + trazo('M-80 -102 Q-92 -94 -95 -80', C.amarilloClaro, 1.2, 0.8)) +
    // La red de la peluca, que asoma abajo.
    trazo('M-94 -54 l10 5 M-90 -50 l8 -4', C.sepia, 0.7, 0.7),
  );
}

/** La mosca: la del disco. Va dibujada en el (0, 0), que la corre la isla. */
function mosca(): string {
  return conGrano(forma(elipse(-3.4, -3, 4.4, 2.2), C.haz, 0.7) + forma(elipse(3, -3.4, 4.4, 2.2), C.haz, 0.7) + forma(elipse(0, 0, 3.6, 2.6), C.negro) + forma(elipse(3.6, -0.4, 1.8, 1.6), C.rojoHondo));
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.6;
const cajaOjo = ([x, y]: readonly [number, number], r: number): readonly [number, number, number, number] => [x - r, y - r, r * 2, r * 2];

export const PIEZAS_RANA: readonly Pieza[] = [
  { nombre: 'rana-reposera', caja: [-98, -74, 180, 82], dibujo: reposera(), densidad: D },
  { nombre: 'rana-etiqueta', caja: [A.etiqueta[0] - 16, A.etiqueta[1] - 4, 28, 48], dibujo: etiqueta(), densidad: D * 1.4 },
  { nombre: 'rana-cuerpo', caja: [-92, -80, 190, 80], dibujo: cuerpo(), densidad: D },
  { nombre: 'rana-pie', caja: [A.tobillo[0] - 10, A.tobillo[1] - 10, 52, 30], dibujo: pie(), densidad: D * 1.2 },
  { nombre: 'rana-buche', caja: [A.buche[0] - 12, A.buche[1] - 12, 28, 28], dibujo: buche(), densidad: D * 2.2 },
  { nombre: 'rana-peluca', caja: [-104, -112, 56, 70], dibujo: peluca(), densidad: D * 1.3 },
  { nombre: 'rana-cabeza', caja: [-90, -106, 72, 58], dibujo: cabeza(), densidad: D * 1.4 },
  { nombre: 'rana-pupila-1', caja: cajaOjo(A.ojos[0], 7), dibujo: pupila(0), densidad: D * 2.2 },
  { nombre: 'rana-pupila-2', caja: cajaOjo(A.ojos[1], 7), dibujo: pupila(1), densidad: D * 2.2 },
  { nombre: 'rana-parpado-1', caja: [A.ojos[0][0] - 12, A.ojos[0][1] - 12, 24, 28], dibujo: parpado(0), densidad: D * 1.8 },
  { nombre: 'rana-parpado-2', caja: [A.ojos[1][0] - 12, A.ojos[1][1] - 12, 24, 28], dibujo: parpado(1), densidad: D * 1.8 },
  { nombre: 'rana-anteojos', caja: [-88, -108, 62, 32], dibujo: anteojos(), densidad: D * 1.6 },
  { nombre: 'rana-lengua', caja: [A.boca[0] - 2, A.boca[1] - 7, A.lengua.largo + 6, 14], dibujo: lengua(), densidad: D * 1.4 },
  { nombre: 'rana-brazo', caja: [A.hombro[0] - 10, A.hombro[1] - 62, 86, 74], dibujo: brazo(), densidad: D },
  { nombre: 'rana-mosca', caja: [-9, -7, 18, 12], dibujo: mosca(), densidad: D * 2.4 },
];

const img = imagenesDe(PIEZAS_RANA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** La rana armada con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    img('rana-reposera') +
    parte('etiqueta', img('rana-etiqueta'), t.etiqueta) +
    parte('cuerpo',
      parte('panza', img('rana-cuerpo'), t.panza) +
      parte('pie', img('rana-pie'), t.pie) +
      parte('buche', img('rana-buche'), t.buche) +
      parte('cabeza',
        parte('peluca', img('rana-peluca'), t.peluca) +
        img('rana-cabeza') +
        parte('pupila-2', img('rana-pupila-2'), t['pupila-2']) +
        parte('parpado-2', img('rana-parpado-2'), t['parpado-2']) +
        parte('pupila-1', img('rana-pupila-1'), t['pupila-1']) +
        parte('parpado-1', img('rana-parpado-1'), t['parpado-1']) +
        parte('anteojos', img('rana-anteojos'), t.anteojos) +
        parte('lengua', img('rana-lengua'), t.lengua, o.lengua),
        t.cabeza) +
      parte('brazo', img('rana-brazo'), t.brazo),
      t.cuerpo) +
    parte('mosca', img('rana-mosca'), t.mosca, o.mosca)
  );
}

/** La rana en un momento, sin lo que la hace tocable: para el test, el retrato y para mirarla. */
export function ranaEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: recostada, con los anteojos puestos. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--rana" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'La rana rubia'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: croando, con los anteojos en la frente y el buche a pleno. */
export const RETRATO = { caja: [RANA.x - 58, RANA.piso - 76, 116, 84] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/astillero-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/astillero-piso.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    ranaEn(CROA)
  );
}

export const RANA_PERSONAJE: Personaje = {
  id: ID,
  region: 'los-astilleros',
  ancla: RANA.x,
  piezas: PIEZAS_RANA,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
