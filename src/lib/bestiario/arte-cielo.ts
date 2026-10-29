/**
 * El que no se cayó del cielo (`D-73`, vigesimoquinta vuelta), sentado en el borde de la chapa del canto.
 *
 * *"Yo no me caí del cielo / Pero sí de un bar muy triste / nena hay mucho olor a gato"* es de *Yo no me caí
 * del cielo*, en *Gulp!* (1985). Es un tipo de saco arrugado y corbata floja que se cayó de un bar y aterrizó
 * sentado en el filo del techo, con el vaso en la mano, y el vaso no se le volcó. Trae el pelo revuelto de la
 * caída, un ojo hinchado de alguna discusión, la ceja cortada y la barba de dos días. Del cuello le asoma una
 * medalla de la virgen: del cielo no se cayó, pero alguien lo encomendó. En el bolsillo del saco tiene una
 * servilleta del bar con un teléfono anotado; a un botón del saco le queda el hilo nada más; le falta un
 * zapato a medio salir, y por la media roja asoma el talón por un agujero; en la suela del otro se le pegó
 * un posavasos del bar. Al lado, en la chapa, una botella vacía que rueda sola. Y hay mucho olor a gato: el
 * gato matón está en la misma chapa, lejos a la izquierda.
 *
 * Viste *Gulp!*, medido con sharp: el saco es el verde de las letras del frente donde lo come la tinta, la
 * camisa el papel de la contratapa, la corbata y las medias el rojo de las letras del interior, la ginebra y
 * la medalla el amarillo que asoma debajo de ese rojo, y la piel el sello «gulp.» de la contratapa, donde el
 * rojo se lava en el papel. El farol del fondo le pega de arriba a la izquierda.
 *
 * Coordenadas: el (0, 0) es el filo de la chapa debajo del culo, y está de frente (`rig-cielo.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { BRINDIS, CIELO, CIELO_ARMADO as A, QUIETO, manoDibujada, marcas, type Momento } from './rig-cielo.ts';

/** Las tintas de *Gulp!* (`tokens.css`). */
const C = {
  negro: 'var(--bestia-cielo-negro)',
  noche: 'var(--bestia-cielo-noche)',
  verdeNoche: 'var(--bestia-cielo-verde-noche)',
  verdeHondo: 'var(--bestia-cielo-verde-hondo)',
  verdeMedio: 'var(--bestia-cielo-verde-medio)',
  verde: 'var(--bestia-cielo-verde)',
  grafito: 'var(--bestia-cielo-grafito)',
  grafitoClaro: 'var(--bestia-cielo-grafito-claro)',
  papel: 'var(--bestia-cielo-papel)',
  papelHondo: 'var(--bestia-cielo-papel-hondo)',
  crema: 'var(--bestia-cielo-crema)',
  rojo: 'var(--bestia-cielo-rojo)',
  rojoHondo: 'var(--bestia-cielo-rojo-hondo)',
  sello: 'var(--bestia-cielo-sello)',
  piel: 'var(--bestia-cielo-piel)',
  pielHonda: 'var(--bestia-cielo-piel-honda)',
  quemada: 'var(--bestia-cielo-piel-quemada)',
  oro: 'var(--bestia-cielo-oro)',
  oroHondo: 'var(--bestia-cielo-oro-hondo)',
};

/** Un azar con semilla, para que la barba y las motas salgan siempre iguales. */
function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------
   La botella vacía, acostada en la chapa
   ------------------------------------------------------------------ */

function botella(): string {
  const [bx, by] = A.botella;
  const x0 = bx - 22;
  const x1 = bx + 12;
  const d = poli([[x0, by - 7.5], [x1, by - 7.5], [x1 + 7, by - 3], [x1 + 17, by - 2.6], [x1 + 19, by - 3.2], [x1 + 19, by + 3.2], [x1 + 17, by + 2.6], [x1 + 7, by + 3], [x1, by + 7.5], [x0, by + 7.5]]);
  const etiqueta = cajaRedonda(x0 + 8, by - 7.5, 15, 15, 1);
  return conGrano(
    // La sombra que hace en la chapa.
    nube(bx + 2, 0.5, 30, 2, C.noche, 's', 0.8) +
    enmascarado('m-cielo-botella', d,
      forma(d, C.verdeHondo) + nube(bx, by + 4, 34, 4, C.verdeNoche, 's', 0.95) + nube(bx - 6, by - 4, 26, 2.4, C.verde, 's', 0.55) +
      // Lo que quedó adentro: una gota, en el fondo.
      nube(x0 + 3, by + 5, 4, 1.4, C.oro, 'xs', 0.7) +
      forma(etiqueta, C.crema) + nube(x0 + 15, by + 4, 9, 3, C.quemada, 's', 0.45) +
      forma(cajaRedonda(x0 + 8, by - 3.4, 15, 2.2, 0.5), C.sello) + trazo(`M${x0 + 10} ${by + 3} q3 -2 5 0 t5 0`, C.sello, 0.8, 0.9) +
      nube(x1 + 12, by - 1, 6, 1.4, C.verde, 'xs', 0.6)) +
    // El culo de la botella, de vidrio grueso, y el brillo del farol a lo largo.
    forma(elipse(x0, by, 2.2, 7.5), C.verdeNoche) + forma(elipse(x0 + 0.4, by, 1.2, 5.4), C.verdeHondo) +
    trazo(`M${x0 + 2} ${by - 5.4} L${x1 - 1} ${by - 5.4} Q${x1 + 5} ${by - 4.6} ${x1 + 9} ${by - 2.4}`, C.papel, 1, 0.55) +
    forma(elipse(x1 + 19, by, 0.9, 3.2), C.noche),
  );
}

/* ------------------------------------------------------------------
   Las piernas: el muslo de punta (sentado) y estirado (colgado), la canilla y el zapato
   ------------------------------------------------------------------ */

function muslo(n: 0 | 1): string {
  const [ix] = A.ingles[n];
  const d = curva([[ix - 13, -10], [ix + 13, -10], [ix + 12, 30], [ix + 10, 58], [ix - 10, 58], [ix - 12, 30]]);
  return conGrano(enmascarado(`m-cielo-muslo-${n + 1}`, d,
    forma(d, C.grafito) + nube(ix - 6, 24, 4, 30, C.grafitoClaro, 'm', 0.75) + nube(ix + 8, 26, 4, 34, C.noche, 'm', 0.75) +
    trazo(`M${ix} -8 L${ix + 1} 56`, C.noche, 0.8, 0.5) + nube(ix, 52, 8, 4, C.grafitoClaro, 's', 0.6) +
    trazo(`M${ix - 10} 40 q8 3 14 -2 M${ix + 4} 14 q4 2 8 0`, C.noche, 0.7, 0.6)));
}

function canilla(n: 0 | 1): string {
  const [ix] = A.ingles[n];
  const [, ky] = [ix, A.ingles[n][1] + A.muslo];
  const ty = ky + A.canilla;
  const d = curva([[ix - 10, ky - 4], [ix + 10, ky - 4], [ix + 9.5, ky + 40], [ix + 10.5, ty - 4], [ix - 10.5, ty - 4], [ix - 9.5, ky + 40]]);
  // La media roja, con el pie adentro: cuando se sale el zapato, se ve, y en la de la derecha, el agujero del talón.
  const media = curva([[ix - 6, ty - 6], [ix + 6, ty - 6], [ix + 6.6, ty + 8], [ix + 3, ty + 14], [ix - 3, ty + 14], [ix - 6.6, ty + 8]]);
  return conGrano(
    enmascarado(`m-cielo-media-${n + 1}`, media, forma(media, C.rojo) + nube(ix + 4, ty + 6, 4, 10, C.rojoHondo, 's', 0.9) + nube(ix - 3, ty + 2, 2, 5, C.oro, 'xs', 0.3) +
      trazo(`M${ix - 6} ${ty - 2} L${ix + 6} ${ty - 2} M${ix - 6} ${ty} L${ix + 6} ${ty}`, C.rojoHondo, 0.5, 0.7) +
      (n ? forma(elipse(ix + 2, ty + 9, 2.6, 2), C.piel) + nube(ix + 2.6, ty + 9.6, 1.4, 1, C.pielHonda, 'xs', 0.9) + trazo(`M${ix - 0.6} ${ty + 8} l-1 -1 M${ix + 4.6} ${ty + 8} l1 -1`, C.rojoHondo, 0.5) : '')) +
    enmascarado(`m-cielo-canilla-${n + 1}`, d,
      forma(d, C.grafito) + nube(ix - 6, ky + 34, 3.4, 40, C.grafitoClaro, 'm', 0.7) + nube(ix + 7, ky + 38, 4, 42, C.noche, 'm', 0.8) +
      trazo(`M${ix + 1} ${ky} L${ix} ${ty - 6}`, C.noche, 0.7, 0.45) +
      // El ruedo descosido, que arrastra el piso del bar.
      nube(ix, ty - 6, 12, 2.6, C.noche, 's', 0.8) + trazo(`M${ix - 10} ${ty - 5} L${ix + 10} ${ty - 5}`, C.grafitoClaro, 0.8, 0.6)) +
    trazo(`M${ix - 6} ${ty - 4} l-0.6 3.4 M${ix - 3} ${ty - 4} l0.4 2.6 M${ix + 5} ${ty - 4} l1 3`, C.grafito, 0.6, 0.9),
  );
}

function zapato(n: 0 | 1): string {
  const [ix] = A.ingles[n];
  const ty = A.ingles[n][1] + A.muslo + A.canilla;
  // De frente y colgando, el zapato es la puntera: angosto en el tobillo, ancho abajo, con la suela de canto.
  const d = curva([[ix - 6, ty - 2], [ix + 6, ty - 2], [ix + 8, ty + 5], [ix + 10.6, ty + 11], [ix + 8, ty + 16.4], [ix, ty + 18], [ix - 8, ty + 16.4], [ix - 10.6, ty + 11], [ix - 8, ty + 5]]);
  // En la suela de la izquierda se le pegó un posavasos del bar, con la marca en rojo.
  const posavasos = n ? '' :
    forma(elipse(ix + 3, ty + 17, 10.5, 3.2), C.crema) + nube(ix + 6, ty + 18, 6, 1.6, C.quemada, 'xs', 0.5) +
    trazo(`M${ix - 5.6} ${ty + 17} a8.6 2.4 0 1 0 17.2 0 a8.6 2.4 0 1 0 -17.2 0`, C.sello, 0.7, 0.85) +
    trazo(`M${ix + 6} ${ty + 17.6} q1.4 -1.6 2.6 0 t2.4 0 t2 -0.4`, C.sello, 0.6, 0.9);
  // El de la derecha, a medio salir: los cordones desatados, uno colgando.
  const cordon = n ? trazo(`M${ix + 2} ${ty + 2} q3 6 1 12 q-1 4 2 6`, C.papelHondo, 0.7, 0.85) : '';
  return conGrano(
    posavasos +
    enmascarado(`m-cielo-zapato-${n + 1}`, d,
      forma(d, C.negro) + nube(ix - 3.4, ty + 11, 4, 3, C.grafitoClaro, 's', 0.8) + nube(ix - 4, ty + 10.4, 1.4, 1, C.papelHondo, 'xs', 0.5) +
      nube(ix + 7, ty + 9, 3, 8, C.noche, 's', 0.9) + forma(elipse(ix, ty - 1.4, 5.4, 1.6), C.noche) +
      // La costura de la puntera y los cordones, de a uno, para arriba.
      trazo(`M${ix - 8} ${ty + 9} Q${ix} ${ty + 6} ${ix + 8} ${ty + 9}`, C.grafito, 0.6, 0.8) +
      [0, 1, 2].map((k) => trazo(`M${ix - 2.4} ${ty + 1 + k * 2} L${ix + 2.4} ${ty + 2 + k * 2}`, C.papelHondo, 0.5, 0.65)).join('')) +
    // La suela, de canto, gastada.
    trazo(`M${ix - 9.6} ${ty + 14} Q${ix} ${ty + 20} ${ix + 9.6} ${ty + 14}`, C.grafito, 1.6, 0.9) + cordon,
  );
}

/* ------------------------------------------------------------------
   El torso: el saco arrugado, la camisa, la corbata floja, la servilleta
   ------------------------------------------------------------------ */

const SACO: readonly P[] = [[-36, -84], [-31, -92], [-14, -96], [14, -96], [31, -90], [37, -80], [33, -60], [29, -36], [27, -18], [33, -3], [27, 4], [0, 4], [-27, 4], [-33, -3], [-28, -18], [-30, -36], [-34, -60]];

function torso(): string {
  const d = curva(SACO);
  const camisa = poli([[-11, -96], [11, -96], [3, -44], [-3, -44]]);
  const solapaIzq = poli([[-11, -96], [-21, -92], [-17, -76], [-19, -73], [-9, -56], [-3, -44]]);
  const solapaDer = poli([[11, -96], [21, -92], [17, -76], [19, -73], [9, -56], [3, -44]]);
  // La corbata floja: el nudo bajado y torcido, y la pala que se mete abajo de la solapa.
  const nudo = poli([[-4.6, -84], [3.6, -83], [2.2, -77], [-2.8, -77.4]]);
  const pala = curva([[-2.6, -77.6], [2.2, -77.2], [6.4, -60], [7, -50], [4, -46], [0.6, -50], [-1.6, -62]]);
  const servilleta = poli([[13, -66], [16, -78], [21, -74], [25.6, -77], [26, -66]]);
  return conGrano(
    // El cogote, con la barba de dos días.
    forma(cajaRedonda(-8, -108, 16, 18, 4), C.piel) + nube(2, -100, 9, 4, C.quemada, 's', 0.8) + nube(-4, -103, 3, 3, C.piel, 's', 0.6) +
    enmascarado('m-cielo-saco', d,
      forma(d, C.verdeNoche) +
      // El farol le pega de arriba a la izquierda: el hombro, el pecho y el brazo de ese lado.
      nube(-22, -66, 9, 22, C.verdeHondo, 'm', 0.75) + nube(-27, -86, 8, 4, C.verdeMedio, 's', 0.55) + nube(22, -44, 14, 50, C.noche, 'l', 0.95) +
      nube(0, 0, 34, 10, C.noche, 'm', 0.95) + nube(-16, -26, 6, 8, C.verdeHondo, 'm', 0.45) + nube(6, -60, 8, 20, C.noche, 'm', 0.5) +
      // Las arrugas: de dormir vestido, de la caída, del bar.
      trazo('M-26 -32 q10 5 19 -1 M-24 -16 q8 4 16 2 M8 -28 q8 4 18 -2 M10 -12 q6 3 14 0 M-28 -52 q4 2 7 -1', C.noche, 1, 0.8) +
      trazo('M-25 -33.4 q10 5 18 -1 M-23 -17.4 q8 4 15 2', C.verdeMedio, 0.6, 0.55) +
      enmascarado('m-cielo-camisa', camisa, forma(camisa, C.papelHondo) + nube(-4, -88, 3, 6, C.papel, 's', 0.7) + nube(4, -60, 5, 16, C.grafito, 's', 0.55) + nube(0, -46, 6, 4, C.noche, 's', 0.6) +
        // Una mancha de ginebra en la pechera.
        nube(-2, -66, 2.4, 2, C.oro, 'xs', 0.6)) +
      forma(solapaIzq, C.verdeHondo) + nube(-16, -84, 4, 8, C.verdeMedio, 's', 0.8) + trazo('M-11 -96 L-21 -92 L-17 -76 L-19 -73 L-9 -56 L-3 -44', C.verdeMedio, 0.8, 0.8) +
      forma(solapaDer, C.verdeNoche) + nube(16, -70, 4, 10, C.noche, 's', 0.8) + trazo('M17 -76 L19 -73', C.noche, 1.2) +
      // El bolsillo del pecho y la servilleta del bar, con el teléfono anotado en birome roja.
      trazo('M12 -66 L27 -67', C.noche, 1.2) + forma(servilleta, C.crema) + nube(22, -68, 4, 3, C.papelHondo, 's', 0.8) +
      trazo('M15.4 -70.4 l0.6 -2.6 M17.2 -70.8 q1 -1.8 0.2 -2.8 M19 -71 l1.2 -2.6 l-1.6 0.2 M21.4 -70.6 l0.4 -2.8 M23.2 -70 q1.4 -1 0 -2.4', C.rojoHondo, 0.5, 0.95) +
      // Un botón que queda, y el hilo del que se perdió en la caída.
      forma(elipse(2.6, -34, 2.2, 2.2), C.negro) + forma(elipse(2.2, -34.6, 0.8, 0.6), C.grafitoClaro) +
      trazo('M2.4 -21 l1.4 2.6 M2.4 -21 l-1 2', C.papelHondo, 0.35, 0.8)) +
    // El cuello de la camisa: una punta para abajo y la otra parada.
    forma(poli([[-11, -96], [-15, -86], [-5, -90]]), C.papel) + forma(poli([[11, -96], [17, -101], [8, -91]]), C.papelHondo) + nube(13, -96, 2, 2, C.quemada, 'xs', 0.4) +
    enmascarado('m-cielo-pala', pala, forma(pala, C.rojo) + nube(5, -58, 3, 14, C.rojoHondo, 's', 0.9) + nube(-0.4, -70, 1.4, 6, C.oro, 'xs', 0.35)) +
    forma(nudo, C.rojoHondo) + nube(-1.6, -81, 2, 1.6, C.rojo, 'xs', 0.9),
  );
}

/** La medalla de la virgen, que le asoma del cuello abierto en una cadenita. */
function medalla(): string {
  const [mx, my] = A.medalla;
  const [cx, cy] = [mx, my + 8];
  return conGrano(
    trazo(`M${mx - 5} ${my - 4} L${cx} ${cy - 4} L${mx + 5} ${my - 4}`, C.oro, 0.5, 0.9) +
    forma(elipse(cx, cy, 3.2, 4), C.oroHondo) + forma(elipse(cx - 0.2, cy - 0.2, 2.6, 3.4), C.oro) +
    // La virgen, de manto, con la corona de rayitos.
    forma(`M${cx} ${cy - 2.2} L${cx + 1.4} ${cy + 2.6} L${cx - 1.4} ${cy + 2.6} Z`, C.crema) + forma(elipse(cx, cy - 2.2, 0.7, 0.7), C.crema) +
    trazo(`M${cx - 1.4} ${cy - 3.2} l-0.6 -0.6 M${cx} ${cy - 3.6} l0 -0.8 M${cx + 1.4} ${cy - 3.2} l0.6 -0.6`, C.oroHondo, 0.4) +
    nube(cx - 1.2, cy - 1.6, 0.8, 1, C.papel, 'xs', 0.6),
  );
}

/* ------------------------------------------------------------------
   Los brazos: la manga del saco, el puño de la camisa y la mano
   ------------------------------------------------------------------ */

function brazoArriba(n: 0 | 1): string {
  const [sx, sy] = A.hombros[n];
  const e = sy + A.brazo;
  const d = curva([[sx - 12, sy - 4], [sx, sy - 7], [sx + 12, sy - 4], [sx + 10, sy + 24], [sx + 9, e + 3], [sx - 9, e + 3], [sx - 10, sy + 24]]);
  return conGrano(enmascarado(`m-cielo-brazo-${n + 1}`, d,
    forma(d, C.verdeNoche) + nube(sx - 6, sy + 22, 4, 26, C.verdeHondo, 'm', n ? 0.35 : 0.75) + nube(sx + 8, sy + 26, 4, 30, C.noche, 'm', 0.9) +
    // La manga se junta en el codo, en arrugas.
    trazo(`M${sx - 9} ${e - 6} q5 3 9 0 M${sx - 8} ${e - 1} q6 -2 12 1 M${sx + 2} ${e - 10} q4 2 7 -1`, C.noche, 0.9, 0.85) +
    trazo(`M${sx - 8} ${e - 7} q5 3 8 0`, C.verdeMedio, 0.5, 0.6)));
}

function antebrazo(n: 0 | 1): string {
  const [sx, sy] = A.hombros[n];
  const e = sy + A.brazo;
  const [, hy] = manoDibujada(n);
  const w = hy - 10;
  const d = curva([[sx - 9, e - 4], [sx + 9, e - 4], [sx + 8, e + 24], [sx + 8.6, w], [sx - 8.6, w], [sx - 8, e + 24]]);
  // La mano: la de la izquierda, floja, con los dedos para agarrarse; la del vaso, cerrada.
  const mano = n
    ? curva([[sx - 7.4, w + 2], [sx + 7.4, w + 2], [sx + 9, hy], [sx + 7.6, hy + 8], [sx, hy + 10], [sx - 7.6, hy + 8], [sx - 9, hy]])
    : curva([[sx - 7, w + 2], [sx + 7, w + 2], [sx + 8.4, hy + 2], [sx + 6, hy + 11], [sx + 1, hy + 12], [sx - 4, hy + 11], [sx - 8.4, hy + 3]]);
  const dedos = n
    ? trazo(`M${sx - 8} ${hy - 2} L${sx + 8} ${hy - 2} M${sx - 8} ${hy + 2} L${sx + 8} ${hy + 2} M${sx - 7} ${hy + 6} L${sx + 7} ${hy + 6}`, C.quemada, 0.7, 0.8)
    : trazo(`M${sx - 4} ${hy + 3} l-0.6 8 M${sx} ${hy + 3} l0 9 M${sx + 4} ${hy + 3} l0.6 8`, C.quemada, 0.7, 0.8);
  return conGrano(
    enmascarado(`m-cielo-antebrazo-${n + 1}`, d,
      forma(d, C.verdeNoche) + nube(sx - 5, e + 18, 3.4, 18, C.verdeHondo, 'm', n ? 0.35 : 0.75) + nube(sx + 7, e + 20, 4, 22, C.noche, 'm', 0.85) +
      trazo(`M${sx - 7} ${w - 6} q6 2 14 -1`, C.noche, 0.8, 0.7)) +
    // El puño de la camisa, sucio, con el gemelo que no está.
    forma(cajaRedonda(sx - 7.4, w - 3, 14.8, 5.6, 1.6), C.papelHondo) + nube(sx + 4, w, 4, 2, C.quemada, 'xs', 0.45) +
    enmascarado(`m-cielo-mano-${n + 1}`, mano,
      forma(mano, C.piel) + nube(sx + 6, hy + 4, 4, 8, C.pielHonda, 's', 0.95) + nube(sx - 4, hy - 2, 3, 4, C.crema, 's', 0.35) +
      nube(sx, w + 3, 9, 2, C.quemada, 'xs', 0.7) + dedos) +
    // Los nudillos colorados del frío y de la pared.
    nube(sx - 2, hy - 3, 5, 1.4, C.sello, 'xs', 0.35),
  );
}

/** El vaso de whisky, con la ginebra a nivel y un hielo que ya es agua: se dibuja derecho en la mano del vaso. */
function vaso(): string {
  const [vx, vy] = manoDibujada(1);
  const [arriba, abajo, nivel] = [vy - 30, vy + 4, vy - 18];
  const d = poli([[vx - 13, arriba], [vx + 13, arriba], [vx + 11, abajo], [vx - 11, abajo]]);
  const ancho = (y: number): number => 13 - ((y - arriba) / (abajo - arriba)) * 2;
  const liquido = poli([[vx - ancho(nivel), nivel], [vx + ancho(nivel), nivel], [vx + 11, abajo - 3], [vx - 11, abajo - 3]]);
  return conGrano(
    enmascarado('m-cielo-vaso', d,
      forma(d, C.papel, 0.16) + forma(liquido, C.oro, 0.85) + nube(vx + 6, abajo - 6, 8, 8, C.oroHondo, 's', 0.9) + nube(vx - 6, nivel + 5, 3, 6, C.crema, 's', 0.5) +
      // El hielo, flotando, casi deshecho.
      forma(poli([[vx - 3, nivel - 2], [vx + 3, nivel - 3], [vx + 4.4, nivel + 2.6], [vx - 2, nivel + 3.4]]), C.papel, 0.45) +
      // El culo grueso del vaso de bar.
      forma(poli([[vx - 11.4, abajo - 3], [vx + 11.4, abajo - 3], [vx + 11, abajo], [vx - 11, abajo]]), C.papelHondo, 0.7) +
      nube(vx - 10, (arriba + abajo) / 2, 1.6, 16, C.papel, 's', 0.7)) +
    // La superficie, a nivel, y el borde.
    forma(elipse(vx, nivel, ancho(nivel), 1.6), C.oro) + trazo(`M${vx - ancho(nivel)} ${nivel} Q${vx} ${nivel + 1.8} ${vx + ancho(nivel)} ${nivel}`, C.crema, 0.6, 0.8) +
    trazo(`M${vx - 13} ${arriba} Q${vx} ${arriba + 2.4} ${vx + 13} ${arriba} Q${vx} ${arriba - 2.4} ${vx - 13} ${arriba}`, C.papel, 0.7, 0.85) +
    trazo(`M${vx - 13} ${arriba} L${vx - 11} ${abajo}`, C.papel, 0.8, 0.9) + trazo(`M${vx + 13} ${arriba} L${vx + 11} ${abajo}`, C.grafito, 0.7, 0.8) +
    trazo(`M${vx - 6} ${arriba + 3} L${vx - 5} ${abajo - 2} M${vx + 5} ${arriba + 3} L${vx + 4.4} ${abajo - 2}`, C.papel, 0.4, 0.4),
  );
}

/* ------------------------------------------------------------------
   La cabeza: la cara de tres cuartos, el ojo hinchado, el pelo revuelto
   ------------------------------------------------------------------ */

const CRANEO: readonly P[] = [[-14, -140], [-4, -148], [10, -147], [19, -138], [21, -124], [19, -110], [13, -101], [3, -97], [-7, -99], [-14, -106], [-18, -118], [-18, -130]];

function cabeza(): string {
  const d = curva(CRANEO);
  const [[ex1, ey1], [ex2, ey2]] = A.ojos;
  const [nx, ny] = A.nariz;
  const [bx, by] = A.boca;
  const rnd = azar(1985);
  // La barba de dos días: puntitos en la quijada y arriba del labio.
  let barba = '';
  for (let i = 0; i < 140; i++) {
    const x = -16 + rnd() * 34;
    const y = -116 + rnd() * 18;
    const dentro = ((x - 2) / 17) ** 2 + ((y + 104) / 12) ** 2 < 1 && !(Math.abs(x - bx) < 6 && Math.abs(y - by) < 2.4);
    if (dentro) barba += forma(elipse(x, y, 0.45, 0.45), C.grafito, 0.5);
  }
  const blanco = (x: number, y: number, alto: number): string => curva([[x - 5, y], [x, y - alto], [x + 5, y], [x, y + alto * 0.6]]);
  const nariz = curva([[nx - 1, ny - 9], [nx + 1.4, ny - 5], [nx + 2.4, ny], [nx + 0.4, ny + 3], [nx - 5, ny + 3], [nx - 6.4, ny + 0.6], [nx - 3.6, ny - 3]]);
  return conGrano(
    // La oreja de la derecha, que asoma; la otra queda detrás.
    forma(elipse(20.4, -122, 3.6, 6.4), C.pielHonda) + trazo('M21 -126 q2 3 0 7', C.quemada, 0.8) +
    enmascarado('m-cielo-cara', d,
      forma(d, C.piel) +
      nube(-8, -138, 10, 6, C.crema, 'm', 0.45) + nube(-12, -118, 5, 7, C.crema, 's', 0.3) +
      nube(17, -120, 8, 22, C.pielHonda, 'm', 1) + nube(19, -114, 4, 12, C.quemada, 'm', 0.7) + nube(6, -100, 14, 5, C.quemada, 'm', 0.6) +
      // Colorado de la noche: los cachetes y la punta de las orejas.
      nube(-12, -116, 4, 3, C.sello, 's', 0.45) + nube(12, -116, 4, 3, C.sello, 's', 0.4) +
      // Las ojeras y la frente arrugada.
      nube(ex1, ey1 + 3, 5, 2.4, C.quemada, 's', 0.7) + nube(ex2, ey2, 7, 5, C.quemada, 's', 0.6) +
      trazo('M-10 -141 q8 -2 16 0 M-8 -138 q7 -1.6 13 0', C.pielHonda, 0.6, 0.7) +
      trazo(`M${ex1 - 4.6} ${ey1 + 3} q4.6 2 9 0`, C.quemada, 0.6, 0.8) +
      barba) +
    // Los ojos: el bueno, cansado; el otro es una rendija.
    forma(blanco(ex1, ey1, 3), C.papelHondo) + nube(ex1 + 2, ey1 + 0.6, 2, 1.4, C.quemada, 'xs', 0.5) +
    forma(curva([[ex2 - 5, ey2 + 0.4], [ex2, ey2 - 1.2], [ex2 + 5, ey2 + 0.4], [ex2, ey2 + 1.2]]), C.papelHondo) +
    // Las cejas caídas para afuera; la derecha, cortada.
    trazo(`M${ex1 - 6} ${ey1 - 5} Q${ex1 - 1} ${ey1 - 8.6} ${ex1 + 5} ${ey1 - 8}`, C.negro, 1.6, 0.9) +
    trazo(`M${ex2 - 5} ${ey2 - 9} Q${ex2 + 1} ${ey2 - 9.4} ${ex2 + 6} ${ey2 - 5.6}`, C.negro, 1.6, 0.9) + trazo(`M${ex2 + 1.6} ${ey2 - 11} l1.4 4`, C.rojoHondo, 0.8) +
    // La nariz, colorada de tanto bar.
    enmascarado('m-cielo-nariz', nariz, forma(nariz, C.piel) + nube(nx + 2, ny - 2, 2, 6, C.pielHonda, 's', 0.9) + nube(nx - 2, ny + 0.6, 4, 2.6, C.sello, 's', 0.95) + nube(nx - 3, ny - 1, 1.2, 0.8, C.crema, 'xs', 0.7)) +
    forma(elipse(nx - 4.4, ny + 2, 0.9, 0.6), C.noche, 0.8) + forma(elipse(nx - 0.8, ny + 2.2, 0.9, 0.6), C.noche, 0.8) +
    // La boca para abajo, con el labio de abajo colgado.
    trazo(`M${bx - 7} ${by + 1} Q${bx - 1} ${by - 1.2} ${bx + 6} ${by + 1.4}`, C.rojoHondo, 1.1) +
    forma(curva([[bx - 4.4, by + 1], [bx + 3.6, by + 1.2], [bx + 2, by + 3.2], [bx - 3, by + 3]]), C.quemada, 0.85) +
    trazo(`M${bx - 1} ${by + 7} q1 1 2 0`, C.pielHonda, 0.6, 0.8),
  );
}

/** El pelo, revuelto de la caída: mechones para arriba y para el costado, y canas en las sienes. */
function pelo(): string {
  const d = curva([[-17, -127], [-20, -141], [-12, -152], [0, -157], [14, -155], [23, -144], [22, -130], [19, -137], [10, -145], [-2, -146], [-12, -140], [-15, -128]]);
  // Los mechones parados, cada uno para su lado: de dormir en la mesa y de caerse del bar.
  const mechones = ['M1 -153 q0 -9 6 -12', 'M7 -153 q6 -7 13 -6', 'M-6 -151 q-5 -6 -12 -6', 'M18 -146 q7 -3 11 2', 'M-14 -142 q-7 -1 -9 5', 'M12 -150 q2 -6 -1 -10'];
  return conGrano(
    mechones.map((m, i) => trazo(m, i % 2 ? C.negro : C.noche, 3.4 - (i % 3) * 0.6) + trazo(m, C.grafito, 0.6, 0.55)).join('') +
    enmascarado('m-cielo-pelo', d,
      forma(d, C.negro) + nube(-8, -150, 10, 4, C.grafito, 's', 0.8) + nube(-18, -134, 4, 7, C.grafitoClaro, 's', 0.85) + nube(21, -136, 3, 6, C.grafitoClaro, 's', 0.7) +
      trazo('M-14 -146 q8 -6 18 -6 M-6 -150 q8 -4 16 -2', C.grafitoClaro, 0.6, 0.6)) +
    // El mechón que le cae en la frente.
    trazo('M-3 -146 Q-9 -142 -10 -134', C.negro, 2.2) + trazo('M-3 -146 Q-8 -142 -9 -135', C.grafito, 0.6, 0.6) +
    trazo('M4 -146 q-2 4 -1 8', C.negro, 1.4, 0.9),
  );
}

function pupilas(): string {
  const [[ex1, ey1], [ex2, ey2]] = A.ojos;
  return forma(elipse(ex1, ey1 - 0.3, 1.9, 2.1), C.negro) + forma(elipse(ex1 - 0.6, ey1 - 1, 0.5, 0.5), C.papel, 0.9) + forma(elipse(ex2, ey2, 1.6, 1.4), C.negro);
}

/** El ojo hinchado: el párpado de arriba inflado y brilloso, y el moretón que ya se pone verde y amarillo. */
function hinchado(): string {
  const [ex, ey] = A.ojos[1];
  const arriba = curva([[ex - 7.4, ey - 1.6], [ex - 4, ey - 7], [ex + 2, ey - 8], [ex + 7.4, ey - 4], [ex + 7, ey - 0.4], [ex, ey - 0.6], [ex - 5, ey - 0.4]]);
  const abajo = curva([[ex - 6, ey + 1.2], [ex, ey + 1.6], [ex + 6.4, ey + 1], [ex + 5, ey + 4.4], [ex, ey + 5.4], [ex - 5, ey + 4]]);
  return conGrano(
    nube(ex + 2, ey, 9, 8, C.verdeHondo, 'm', 0.35) + nube(ex - 1, ey + 5, 6, 3, C.oro, 's', 0.3) +
    enmascarado('m-cielo-hinchado', arriba, forma(arriba, C.quemada) + nube(ex, ey - 5, 5, 3, C.rojoHondo, 's', 0.85) + nube(ex + 4, ey - 2, 3, 3, C.sello, 's', 0.6) + nube(ex - 2, ey - 6, 2, 1, C.crema, 'xs', 0.55)) +
    enmascarado('m-cielo-bolsa', abajo, forma(abajo, C.quemada) + nube(ex, ey + 3, 5, 2, C.rojoHondo, 's', 0.7) + nube(ex + 4, ey + 4, 3, 2, C.verdeHondo, 's', 0.5)) +
    trazo(`M${ex - 5} ${ey - 0.4} Q${ex} ${ey - 1} ${ex + 7} ${ey - 0.4}`, C.noche, 0.7, 0.85),
  );
}

function parpados(): string {
  const [[ex1, ey1], [ex2, ey2]] = A.ojos;
  return forma(curva([[ex1 - 5.6, ey1], [ex1, ey1 - 3.6], [ex1 + 5.6, ey1], [ex1, ey1 + 2]]), C.piel) + trazo(`M${ex1 - 5} ${ey1 + 0.6} Q${ex1} ${ey1 + 2.2} ${ex1 + 5} ${ey1 + 0.6}`, C.noche, 0.8) +
    forma(curva([[ex2 - 5.6, ey2 + 0.4], [ex2, ey2 - 2], [ex2 + 5.6, ey2 + 0.4], [ex2, ey2 + 1.6]]), C.quemada) + trazo(`M${ex2 - 5} ${ey2 + 0.8} Q${ex2} ${ey2 + 1.8} ${ex2 + 5} ${ey2 + 0.6}`, C.noche, 0.8);
}

/** La boca abierta: el bostezo, el susto. */
function boca(): string {
  const [bx, by] = A.boca;
  const d = elipse(bx, by + 2, 4.4, 5.2);
  return conGrano(forma(elipse(bx, by + 2, 5.4, 6.2), C.quemada) + enmascarado('m-cielo-boca', d, forma(d, C.noche) + nube(bx, by + 6.4, 3.4, 2.2, C.rojoHondo, 's', 0.95) + forma(cajaRedonda(bx - 3.4, by - 3.6, 6.8, 2, 0.6), C.papelHondo, 0.9)));
}

/** La cara de asco: la nariz fruncida, el labio levantado, el ojo bueno apretado. */
function asco(): string {
  const [nx, ny] = A.nariz;
  const [bx, by] = A.boca;
  const [ex1, ey1] = A.ojos[0];
  return trazo(`M${nx - 4} ${ny - 6} q2 -1 4 0 M${nx - 4.6} ${ny - 4} q2.4 -1.2 5 0 M${nx - 3} ${ny - 8} q1.4 -0.6 3 0`, C.quemada, 0.8, 0.95) +
    trazo(`M${bx - 6} ${by + 0.4} Q${bx - 2} ${by - 3} ${bx + 2} ${by - 1.4} L${bx + 6} ${by + 1}`, C.rojoHondo, 1.1) +
    trazo(`M${ex1 - 6} ${ey1 + 1} Q${ex1} ${ey1 - 1.4} ${ex1 + 5} ${ey1 + 0.6} M${ex1 - 7} ${ey1 - 1} l-2 -1 M${ex1 - 7} ${ey1 + 1.4} l-2 1`, C.quemada, 0.9, 0.95) +
    trazo(`M${ex1 + 3} ${ey1 - 7} l3 2`, C.negro, 1.2, 0.8);
}

/** El olor a gato, que viene de la izquierda, de donde está el matón: tres hilos verdosos. */
function olor(): string {
  const hilo = (y: number, k: number): string => {
    const d = `M${-90 + k * 4} ${y} q8 -6 16 0 t16 0 t16 -2 t14 4 t10 2`;
    return trazo(d, C.verde, 3, 0.25) + trazo(d, C.verde, 1, 0.75);
  };
  return nube(-56, -126, 30, 10, C.verdeHondo, 'm', 0.3, -6) + hilo(-128, 0) + hilo(-120, 3) + hilo(-136, -2);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.4;
const [MV0, MV1] = [manoDibujada(1)[0], manoDibujada(1)[1]];

export const PIEZAS_CIELO: readonly Pieza[] = [
  { nombre: 'cielo-olor', caja: [-94, -148, 76, 36], dibujo: olor(), densidad: 1.6 },
  { nombre: 'cielo-botella', caja: [A.botella[0] - 28, -18, 64, 22], dibujo: botella(), densidad: D },
  ...([0, 1] as const).flatMap((n) => {
    const [ix] = A.ingles[n];
    const ky = A.ingles[n][1] + A.muslo;
    return [
      { nombre: `cielo-muslo-${n + 1}`, caja: [ix - 15, -12, 30, 74] as const, dibujo: muslo(n), densidad: D * 0.8 },
      { nombre: `cielo-canilla-${n + 1}`, caja: [ix - 13, ky - 8, 26, A.canilla + 26] as const, dibujo: canilla(n), densidad: D * 0.8 },
      { nombre: `cielo-zapato-${n + 1}`, caja: [ix - 14, ky + A.canilla - 6, 28, 30] as const, dibujo: zapato(n), densidad: D },
    ];
  }),
  { nombre: 'cielo-torso', caja: [-42, -110, 84, 118], dibujo: torso(), densidad: D * 0.9 },
  { nombre: 'cielo-medalla', caja: [A.medalla[0] - 7, A.medalla[1] - 6, 14, 20], dibujo: medalla(), densidad: D * 1.6 },
  { nombre: 'cielo-cabeza', caja: [-24, -152, 50, 60], dibujo: cabeza(), densidad: D * 1.3 },
  { nombre: 'cielo-pupilas', caja: [-14, -134, 28, 12], dibujo: pupilas(), densidad: D * 2 },
  { nombre: 'cielo-hinchado', caja: [-2, -142, 22, 22], dibujo: hinchado(), densidad: D * 1.6 },
  { nombre: 'cielo-parpados', caja: [-16, -136, 34, 14], dibujo: parpados(), densidad: D * 2 },
  { nombre: 'cielo-boca', caja: [-9, -116, 16, 18], dibujo: boca(), densidad: D * 2 },
  { nombre: 'cielo-asco', caja: [-18, -140, 30, 36], dibujo: asco(), densidad: D * 1.6 },
  { nombre: 'cielo-pelo', caja: [-26, -172, 60, 48], dibujo: pelo(), densidad: D * 1.3 },
  ...([0, 1] as const).flatMap((n) => {
    const [sx, sy] = A.hombros[n];
    return [
      { nombre: `cielo-brazo-${n + 1}`, caja: [sx - 14, sy - 10, 28, A.brazo + 16] as const, dibujo: brazoArriba(n), densidad: D },
      { nombre: `cielo-antebrazo-${n + 1}`, caja: [sx - 12, sy + A.brazo - 6, 24, A.antebrazo + 20] as const, dibujo: antebrazo(n), densidad: D },
    ];
  }),
  { nombre: 'cielo-vaso', caja: [MV0 - 16, MV1 - 34, 32, 42], dibujo: vaso(), densidad: D * 1.3 },
];

const img = imagenesDe(PIEZAS_CIELO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El tipo armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const pierna = (n: 1 | 2): string =>
    parte(`muslo-${n}`, img(`cielo-muslo-${n}`), t[`muslo-${n}`]) +
    parte(`canilla-${n}`, img(`cielo-canilla-${n}`), t[`canilla-${n}`]) +
    parte(`zapato-${n}`, img(`cielo-zapato-${n}`), t[`zapato-${n}`]);
  const brazo = (n: 1 | 2): string =>
    parte(`hombro-${n}`,
      img(`cielo-brazo-${n}`) +
      parte(`codo-${n}`, (n === 2 ? parte('vaso', img('cielo-vaso'), t.vaso) : '') + img(`cielo-antebrazo-${n}`), t[`codo-${n}`]),
      t[`hombro-${n}`]);
  return (
    parte('olor', img('cielo-olor'), t.olor, o.olor) +
    parte('botella', img('cielo-botella'), t.botella) +
    parte('caida',
      pierna(1) + pierna(2) +
      parte('torso',
        img('cielo-torso') +
        parte('medalla', img('cielo-medalla'), t.medalla) +
        parte('cabeza',
          img('cielo-cabeza') +
          parte('pupilas', img('cielo-pupilas'), t.pupilas) +
          img('cielo-hinchado') +
          parte('parpados', img('cielo-parpados'), '', o.parpados) +
          parte('boca', img('cielo-boca'), '', o.boca) +
          parte('asco', img('cielo-asco'), '', o.asco) +
          parte('pelo', img('cielo-pelo'), t.pelo),
          t.cabeza),
        t.torso) +
      // Los brazos, delante de todo.
      parte('torso-brazos', brazo(1) + brazo(2), t['torso-brazos']),
      t.caida)
  );
}

/** El tipo en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function cieloEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: sentado en el filo de la chapa, con el vaso en la rodilla. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--cielo" data-id="el-que-no-se-cayo-del-cielo" role="button" tabindex="0" aria-label="${nombres.get('el-que-no-se-cayo-del-cielo') ?? 'El que no se cayó del cielo'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: sentado en la chapa, con el vaso alzado y la mirada para arriba. */
export const RETRATO = { caja: [CIELO.x - 68, CIELO.piso - 96, 148, 156] as const };
function retrato(): string {
  return `<image href="/bestiario/baldio-lejos.webp" x="0" y="0" width="1500" height="640" preserveAspectRatio="none"/>` +
    // La chapa, en su caja de `arte-baldio.ts`: del canto de arriba al de abajo.
    `<image href="/bestiario/baldio-chapa.webp" x="0" y="284" width="1500" height="42" preserveAspectRatio="none"/>` + cieloEn(BRINDIS);
}

export const CIELO_PERSONAJE: Personaje = {
  id: 'el-que-no-se-cayo-del-cielo',
  region: 'los-techos',
  ancla: CIELO.x,
  piezas: PIEZAS_CIELO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
