/**
 * El gato matón (`D-73`, vigesimosegunda vuelta), agazapado en la chapa del canto de la medianera.
 *
 * *"Quiero verte oler como el ratón el peligro del gato matón, que ha cambiado la sirena, y compró matraca
 * nueva, de ocasión"* es de *Rock para el negro Atila*, en *Lobo suelto* (1993). En la letra el gato matón
 * es la cana: por eso tiene gorra de vigilante, con la sirena nueva arriba, y en la mano la matraca de
 * ocasión, con la etiqueta del precio todavía colgando. El Atila camina por el mismo canto, unos metros más
 * allá; la sirena de verdad pasa por la calle de abajo.
 *
 * Viste la tapa de *Lobo suelto*, medida con sharp: el gato está soplado en el crema y el sepia de la bestia
 * de la tapa, con la mancha de hollín alrededor de un ojo y los dos colmillos afuera; la gorra es el negro de
 * abajo a la derecha, y el collar es la cadena de gillettes de la tapa. La sirena viene de la tapa gemela,
 * *Cordero atado*: la mitad naranja del fondo y la mitad azul de la bestia.
 *
 * Coordenadas: el (0, 0) es la chapa debajo de la panza, y mira a la derecha (`rig-maton.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { caja, cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { MATON, MATON_ARMADO as A, OPERATIVO, QUIETO, marcas, type Momento } from './rig-maton.ts';

/** Las tintas de *Lobo suelto* y de la sirena de *Cordero atado* (`tokens.css`). */
const C = {
  crema: 'var(--bestia-maton-crema)',
  cremaClara: 'var(--bestia-maton-crema-clara)',
  sepia: 'var(--bestia-maton-sepia)',
  sepiaHonda: 'var(--bestia-maton-sepia-honda)',
  ceniza: 'var(--bestia-maton-ceniza)',
  cenizaClara: 'var(--bestia-maton-ceniza-clara)',
  hollin: 'var(--bestia-maton-hollin)',
  carbon: 'var(--bestia-maton-carbon)',
  carbonHondo: 'var(--bestia-maton-carbon-hondo)',
  ojo: 'var(--bestia-maton-ojo)',
  pupila: 'var(--bestia-maton-pupila)',
  hoja: 'var(--bestia-maton-hoja)',
  hojaClara: 'var(--bestia-maton-hoja-clara)',
  naranja: 'var(--bestia-maton-sirena-naranja)',
  azul: 'var(--bestia-maton-sirena-azul)',
  rosa: 'var(--bestia-maton-rosa)',
};

/* ------------------------------------------------------------------
   El cuerpo agazapado, con la pata de atrás doblada y el collar de gillettes
   ------------------------------------------------------------------ */

const LOMO: readonly P[] = [[-86, -44], [-74, -66], [-40, -74], [0, -72], [30, -78], [52, -84], [66, -60], [60, -34], [40, -18], [0, -12], [-40, -10], [-76, -6], [-94, -24]];

function cuerpo(): string {
  const d = curva(LOMO);
  const anca = curva([[-90, -40], [-70, -58], [-40, -52], [-26, -30], [-30, -8], [-60, -2], [-88, -14]]);
  const pie = curva([[-46, -10], [-10, -12], [4, -6], [2, 0], [-46, 0]]);
  // Las rayas del atigrado, sopladas de costado sobre el lomo: el hollín de la tapa.
  const rayas = [-66, -48, -30, -12, 6, 24].map((x, i) => nube(x, -66 + Math.abs(x) * 0.04, 4, 14, C.hollin, 's', 0.55 + (i % 2) * 0.2, -14 + x * 0.12)).join('');
  // El collar: la cadena de gillettes de la tapa, cada hoja con su agujero, alrededor del cuello.
  const hoja = (x: number, y: number, giro: number): string => {
    const h = `<g transform="rotate(${giro} ${x} ${y})">`;
    // La gillette de doble filo: el cuerpo de acero, las muescas de los lados y el agujero alargado del medio.
    return h + forma(cajaRedonda(x - 9, y - 5, 18, 10, 1.2), C.hoja) + nube(x - 3, y - 3, 5, 1.6, C.hojaClara, 'xs', 0.95) + nube(x + 4, y + 3, 5, 2, C.ceniza, 'xs', 0.8) +
      forma(poli([[x - 6, y - 1.4], [x - 2, y - 1.4], [x - 1, y - 3], [x + 1, y - 3], [x + 2, y - 1.4], [x + 6, y - 1.4], [x + 6, y + 1.4], [x - 6, y + 1.4]]), C.carbonHondo) +
      forma(elipse(x - 9, y, 1.4, 1.6), C.sepia) + forma(elipse(x + 9, y, 1.4, 1.6), C.sepia) + `</g>`;
  };
  const collar = trazo('M34 -80 Q46 -60 58 -40', C.ceniza, 1.6, 0.9) + [[36, -76, 64], [42, -64, 58], [48, -52, 52], [55, -42, 46]].map(([x, y, g]) => hoja(x!, y!, g!)).join('');
  return conGrano(
    nube(-20, -2, 86, 8, C.carbonHondo, 'm', 0.6) +
    enmascarado('m-maton-lomo', d,
      forma(d, C.sepia) +
      // El pecho y la panza en el crema de la tapa, el lomo hondo, y la luz del farol que le pega de arriba.
      nube(44, -46, 20, 30, C.crema, 'm', 0.95) + nube(10, -20, 50, 10, C.cremaClara, 'm', 0.6) + nube(-30, -70, 60, 10, C.sepiaHonda, 'm', 0.8) +
      rayas + nube(-10, -74, 30, 4, C.cremaClara, 's', 0.55)) +
    enmascarado('m-maton-anca', anca, forma(anca, C.sepia) + nube(-60, -40, 24, 16, C.ceniza, 'm', 0.7) + nube(-40, -22, 14, 14, C.crema, 'm', 0.7) + nube(-82, -12, 10, 10, C.hollin, 'm', 0.8)) +
    trazo('M-88 -38 Q-62 -60 -30 -32', C.sepiaHonda, 1.2, 0.6) +
    enmascarado('m-maton-pie', pie, forma(pie, C.crema) + nube(-20, -4, 18, 4, C.ceniza, 's', 0.7)) +
    trazo('M-6 -6 l0 6 M-1 -6 l0 6', C.sepiaHonda, 0.9, 0.7) +
    collar,
  );
}

/** La cola larga de gato de techo, que se le enrosca arriba de la espalda, atigrada. */
function cola(): string {
  const [x, y] = A.cola;
  const d = `M${x} ${y} C${x - 30} ${y - 6} ${x - 50} ${y - 40} ${x - 40} ${y - 74} C${x - 34} ${y - 96} ${x - 10} ${y - 98} ${x - 6} ${y - 82}`;
  const anillos = [0.2, 0.36, 0.52, 0.68, 0.84].map((t, i) => {
    // Puntos a ojo sobre la curva, para las rayas oscuras.
    const px = x - 34 * Math.sin(t * 3) - 6 * t;
    const py = y - 96 * t;
    return nube(px, py, 7, 3, C.hollin, 'xs', 0.85, 30 + i * 10);
  }).join('');
  return conGrano(trazo(d, C.sepiaHonda, 16) + trazo(d, C.sepia, 12) + trazo(d, C.crema, 4, 0.5) + anillos + nube(x - 6, y - 84, 6, 6, C.hollin, 's', 0.9));
}

/* ------------------------------------------------------------------
   Las patas de adelante, y la matraca de ocasión
   ------------------------------------------------------------------ */

function pata(n: 0 | 1): string {
  const [sx, sy] = A.hombros[n];
  const [hx, hy] = A.manos[n];
  const ang = Math.atan2(hy - sy, hx - sx);
  const [nx, ny] = [-Math.sin(ang), Math.cos(ang)];
  const ancho = n === 0 ? 8 : 9;
  const d = poli([[sx + nx * ancho * 1.4, sy + ny * ancho * 1.4], [hx + nx * ancho * 0.7, hy + ny * ancho * 0.7], [hx - nx * ancho * 0.7, hy - ny * ancho * 0.7], [sx - nx * ancho * 1.4, sy - ny * ancho * 1.4]]);
  // La mano: el puño de gato, con los dedos marcados y las uñas afuera, que es un matón.
  const mano = forma(elipse(hx, hy, 9, 7), n === 0 ? C.crema : C.cremaClara) + trazo(`M${hx + 2} ${hy - 6} l1 6 M${hx + 6} ${hy - 4} l0 6`, C.sepiaHonda, 0.8, 0.7) +
    [0, 1, 2].map((i) => trazo(`M${hx + 6 + i * 1.5} ${hy - 3 + i * 3} l4 1`, C.hojaClara, 0.9)).join('');
  return conGrano(enmascarado(`m-maton-pata-${n}`, d, forma(d, n === 0 ? C.sepiaHonda : C.sepia) + nube(sx + 4, sy + 6, 10, 14, C.ceniza, 'm', 0.7) + nube((sx + hx) / 2 + 3, (sy + hy) / 2, 6, 10, C.crema, 's', 0.6)) + mano);
}

/** El mango de la matraca, en el puño, con la etiqueta del precio colgando de un piolín. */
function mango(): string {
  const [mx, my] = A.matraca;
  const etiqueta = curva([[mx + 6, my + 36], [mx + 22, my + 32], [mx + 26, my + 44], [mx + 10, my + 48]]);
  return conGrano(
    forma(cajaRedonda(mx - 3, my, 6, 30, 2), C.sepiaHonda) + nube(mx - 1, my + 14, 1.4, 12, C.crema, 'xs', 0.6) +
    forma(elipse(mx, my + 30, 4, 3), C.carbonHondo) +
    trazo(`M${mx} ${my + 30} Q${mx + 4} ${my + 34} ${mx + 8} ${my + 38}`, C.crema, 0.6) +
    // De ocasión: el cartoncito del precio, con el número tachado y el nuevo garabateado al lado.
    forma(etiqueta, C.cremaClara) + forma(elipse(mx + 9, my + 39, 1.2, 1.2), C.carbon) +
    trazo(`M${mx + 12} ${my + 40} l8 -2 M${mx + 11} ${my + 39} l10 0`, C.carbonHondo, 0.8) + trazo(`M${mx + 13} ${my + 44} q2 -2 4 0 t4 -1`, C.naranja, 0.9),
  );
}

/** La paleta de la matraca, que gira alrededor del mango: la rueda dentada y el marco con la lengüeta. */
function paleta(): string {
  const [mx, my] = A.matraca;
  const marco = cajaRedonda(mx - 4, my - 8, 46, 16, 3);
  const dientes = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return forma(poli([[mx + Math.cos(a - 0.18) * 8, my + Math.sin(a - 0.18) * 8], [mx + Math.cos(a) * 12, my + Math.sin(a) * 12], [mx + Math.cos(a + 0.18) * 8, my + Math.sin(a + 0.18) * 8]]), C.ceniza);
  }).join('');
  return conGrano(
    enmascarado('m-maton-paleta', marco, forma(marco, C.sepia) + nube(mx + 20, my - 4, 22, 3, C.crema, 's', 0.7) + nube(mx + 30, my + 6, 18, 4, C.sepiaHonda, 's', 0.8)) +
    forma(caja(mx + 6, my - 3, 32, 6), C.carbonHondo) + trazo(`M${mx + 6} ${my} L${mx + 36} ${my}`, C.cremaClara, 1.2, 0.8) +
    // Nueva: la madera sin una mancha, y el brillo del barniz.
    nube(mx + 30, my - 5, 6, 1.4, C.cremaClara, 'xs', 0.9) +
    dientes + forma(elipse(mx, my, 8, 8), C.cenizaClara) + forma(elipse(mx, my, 2.6, 2.6), C.carbonHondo),
  );
}

/** El ra-ta-tá: rayitas que saltan alrededor de la matraca cuando gira. */
function ratata(): string {
  const [mx, my] = A.matraca;
  return Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 + 0.3;
    const [r0, r1] = [52, 64 + (i % 3) * 6];
    return trazo(`M${mx + Math.cos(a) * r0} ${my + Math.sin(a) * r0} L${mx + Math.cos(a) * r1} ${my + Math.sin(a) * r1}`, i % 2 ? C.cremaClara : C.naranja, 2.4, 0.9);
  }).join('');
}

/* ------------------------------------------------------------------
   La cabeza: la cara de la bestia de la tapa, la gorra y la sirena
   ------------------------------------------------------------------ */

const CRANEO: readonly P[] = [[56, -104], [70, -110], [92, -108], [108, -96], [114, -78], [106, -62], [90, -54], [70, -56], [54, -66], [48, -84]];

function cabeza(): string {
  const d = curva(CRANEO);
  const [cx, cy] = A.cara;
  // Las orejas en punta; la de adelante mordida, de alguna pelea de techo.
  const oreja = (pts: readonly P[], id: string): string => {
    const o = curva(pts);
    return enmascarado(id, o, forma(o, C.sepia) + nube(pts[1]![0], pts[1]![1] + 8, 4, 10, C.rosa, 's', 0.7) + nube(pts[0]![0], pts[0]![1], 8, 6, C.hollin, 's', 0.6));
  };
  const orejas = oreja([[58, -98], [54, -128], [74, -106]], 'm-maton-oreja-1') + oreja([[88, -106], [104, -132], [110, -92]], 'm-maton-oreja-2') + forma(poli([[100, -122], [104, -116], [98, -114]]), C.carbonHondo);
  // Ojos de matón: el párpado de arriba cae en diagonal hacia el hocico, la pupila es una rendija y mira
  // para abajo, al ratón.
  const ojo = ([x, y]: P, i: number): string => {
    const s = i ? 1 : -1;
    const blanco = elipse(x, y, 7, 6);
    return enmascarado(`m-maton-ojo-${i}`, blanco,
      forma(blanco, C.ojo) + nube(x, y + 3, 7, 3, C.ceniza, 's', 0.5) + forma(elipse(x + 2.4, y + 1.6, 1.1, 4.4), C.pupila) + forma(elipse(x - 1.4, y + 0.6, 1.2, 1), C.cremaClara) +
      forma(poli([[x - 9, y - 8], [x + 9, y - 8], [x + 9, y - 2 + s * 3], [x - 9, y - 2 - s * 3]]), i ? C.sepia : C.hollin)) +
      trazo(`M${x - 8} ${y - 2 - s * 3} L${x + 8} ${y - 2 + s * 3}`, C.carbonHondo, 1.6) +
      // El ceño: dos pelos duros que bajan hacia el medio.
      trazo(`M${x - 9 * s} ${y - 9 - 3} L${x + 4 * s} ${y - 5}`, C.carbonHondo, 2, 0.85);
  };
  // Los mechones de los cachetes, desgreñados, de gato que duerme en la chapa.
  const mechon = (x: number, y: number, s: number): string =>
    forma(poli([[x, y - 8], [x + s * 10, y - 4], [x + s * 4, y], [x + s * 12, y + 4], [x + s * 2, y + 6], [x + s * 8, y + 12], [x - s * 2, y + 10]]), C.crema) + nube(x + s * 3, y + 4, 4, 6, C.sepiaHonda, 's', 0.5);
  const adentro =
    forma(d, C.crema) +
    // La mancha de hollín alrededor del ojo de atrás, como la bestia de la tapa, y el sepia de los cachetes.
    nube(A.ojos[0][0] - 2, A.ojos[0][1] + 2, 14, 12, C.hollin, 'm', 0.9) + nube(64, -70, 14, 10, C.sepia, 'm', 0.8) + nube(100, -96, 12, 12, C.ceniza, 'm', 0.6) +
    nube(cx + 10, cy - 18, 16, 6, C.cremaClara, 's', 0.8) + nube(cx, cy + 22, 28, 6, C.sepiaHonda, 's', 0.6) +
    A.ojos.map(ojo).join('') +
    // El tajo de una pelea que le cruza el ojo de adelante.
    trazo(`M${A.ojos[1][0] - 6} ${A.ojos[1][1] - 12} L${A.ojos[1][0] + 4} ${A.ojos[1][1] + 10}`, C.rosa, 1.2, 0.8);
  const [bx, by] = A.boca;
  const hocico =
    forma(poli([[bx + 6, by - 12], [bx + 13, by - 13], [bx + 10, by - 8]]), C.carbonHondo) +
    trazo(`M${bx + 10} ${by - 8} l0 4 M${bx + 2} ${by - 3} Q${bx + 10} ${by + 1} ${bx + 17} ${by - 3}`, C.carbonHondo, 1.2) +
    // Los dos colmillos afuera, como la tapa.
    forma(poli([[bx + 4, by - 2], [bx + 7, by - 2], [bx + 5.4, by + 6]]), C.cremaClara) + forma(poli([[bx + 13, by - 2], [bx + 16, by - 2], [bx + 14.6, by + 5]]), C.cremaClara);
  const bigotes = [-1, 0, 1].map((i) => trazo(`M${bx + 12} ${by - 6 + i * 3} q14 ${i * 4 - 2} 30 ${i * 8 - 1}`, C.cremaClara, 0.6, 0.8) + trazo(`M${bx + 2} ${by - 6 + i * 3} q-14 ${i * 3} -26 ${i * 6 + 2}`, C.cremaClara, 0.5, 0.6)).join('');
  // La mandíbula pesada, soplada en lo hondo, como la bestia de la tapa.
  const quijada = nube(cx + 4, cy + 22, 22, 6, C.hollin, 'm', 0.55);
  return conGrano(mechon(52, -70, -1) + mechon(110, -66, 1) + orejas + enmascarado('m-maton-cara', d, adentro + quijada) + hocico + bigotes);
}

/** Los párpados, del pelo de la cara: para pestañear y para hacerse el distraído. */
function parpados(): string {
  return A.ojos.map(([x, y], i) => enmascarado(`m-maton-parpado-${i}`, elipse(x, y, 7.4, 6.4), forma(elipse(x, y, 8, 7), i ? C.crema : C.hollin) + trazo(`M${x - 7} ${y + 1} Q${x} ${y + 4} ${x + 7} ${y + 1}`, C.carbonHondo, 1.2))).join('');
}

/** La boca abierta del maullido de cana, con los colmillos y el cielo rosa. */
function boca(): string {
  const [bx, by] = A.boca;
  const d = curva([[bx, by - 4], [bx + 18, by - 4], [bx + 15, by + 12], [bx + 7, by + 15], [bx + 1, by + 10]]);
  return conGrano(enmascarado('m-maton-boca', d, forma(d, C.carbonHondo) + nube(bx + 9, by + 8, 6, 4, C.rosa, 's', 0.9)) +
    forma(poli([[bx + 2, by - 4], [bx + 6, by - 4], [bx + 4, by + 6]]), C.cremaClara) + forma(poli([[bx + 13, by - 4], [bx + 17, by - 4], [bx + 15, by + 5]]), C.cremaClara));
}

/** La lengua, que sale a lamer la mano. */
function lengua(): string {
  const [bx, by] = A.boca;
  const d = curva([[bx + 4, by + 2], [bx + 12, by + 2], [bx + 14, by + 16], [bx + 8, by + 20], [bx + 3, by + 14]]);
  return conGrano(enmascarado('m-maton-lengua', d, forma(d, C.rosa) + nube(bx + 7, by + 8, 2, 6, C.cremaClara, 'xs', 0.6)) + trazo(`M${bx + 8} ${by + 4} l0 10`, C.sepiaHonda, 0.6, 0.6));
}

/** La gorra de vigilante, con la visera para el lado del ratón y la chapa de la repartición. */
function gorra(): string {
  const [sx, sy] = A.sirena;
  const copa = curva([[54, -106], [58, -122], [74, -128], [98, -124], [108, -110], [104, -100], [60, -100]]);
  const visera = curva([[94, -104], [112, -102], [124, -96], [104, -96]]);
  return conGrano(
    enmascarado('m-maton-copa', copa, forma(copa, C.carbon) + nube(70, -122, 16, 4, C.ceniza, 's', 0.6) + nube(96, -104, 12, 6, C.carbonHondo, 's', 0.9)) +
    forma(caja(56, -106, 50, 6), C.carbonHondo) + trazo('M58 -103 L104 -103', C.hoja, 0.8, 0.7) +
    enmascarado('m-maton-visera', visera, forma(visera, C.carbonHondo) + nube(110, -101, 8, 1.6, C.cenizaClara, 'xs', 0.7)) +
    // La chapa, que es una gillette más.
    forma(cajaRedonda(74, -118, 10, 7, 1), C.hoja) + forma(caja(77, -115.5, 4, 2), C.carbonHondo) +
    // La base de la sirena, atornillada a la copa.
    forma(cajaRedonda(sx - 7, sy + 4, 14, 5, 1.4), C.ceniza) + nube(sx - 3, sy + 5, 3, 1, C.hojaClara, 'xs', 0.9),
  );
}

/** La sirena nueva: la cúpula de vidrio, mitad naranja y mitad azul. Siempre está; prendida, brilla. */
function sirena(): string {
  const [sx, sy] = A.sirena;
  const d = curva([[sx - 7, sy + 4], [sx - 6, sy - 6], [sx, sy - 10], [sx + 6, sy - 6], [sx + 7, sy + 4]]);
  return conGrano(enmascarado('m-maton-sirena', d, forma(caja(sx - 8, sy - 12, 8, 18), C.naranja) + forma(caja(sx, sy - 12, 8, 18), C.azul) + nube(sx - 2, sy - 4, 2, 4, C.cremaClara, 'xs', 0.9)));
}

/** La luz de la sirena prendida: el resplandor alrededor de la cúpula. */
function luz(): string {
  const [sx, sy] = A.sirena;
  return nube(sx - 6, sy - 2, 12, 12, C.naranja, 'm', 0.9) + nube(sx + 6, sy - 2, 12, 12, C.azul, 'm', 0.9) + nube(sx, sy - 2, 4, 5, C.cremaClara, 's', 1);
}

/** Los dos haces de la sirena, para lados contrarios, que barren los techos. */
function haz(): string {
  const [sx, sy] = A.sirena;
  const cono = (dir: 1 | -1, color: string): string => soplo(`M${sx} ${sy} L${sx + dir * 240} ${sy - 46} L${sx + dir * 240} ${sy + 46} Z`, color, 'm', 0.55) + soplo(`M${sx} ${sy} L${sx + dir * 160} ${sy - 12} L${sx + dir * 160} ${sy + 12} Z`, color, 's', 0.6);
  return cono(1, C.naranja) + cono(-1, C.azul);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3;
const [SX, SY] = A.sirena;
const [MX, MY] = A.matraca;
const [BX, BY] = A.boca;
const [CX, CY] = A.cola;

export const PIEZAS_MATON: readonly Pieza[] = [
  { nombre: 'maton-haz', caja: [SX - 250, SY - 60, 500, 120], dibujo: haz(), densidad: 0.8 },
  { nombre: 'maton-cola', caja: [CX - 60, CY - 106, 70, 116], dibujo: cola(), densidad: D },
  { nombre: 'maton-pata-1', caja: [12, -60, 48, 70], dibujo: pata(0), densidad: D },
  { nombre: 'maton-cuerpo', caja: [-104, -94, 176, 104], dibujo: cuerpo(), densidad: D },
  { nombre: 'maton-cabeza', caja: [40, -136, 86, 92], dibujo: cabeza(), densidad: D * 1.3 },
  { nombre: 'maton-parpados', caja: [60, -100, 44, 22], dibujo: parpados(), densidad: D * 1.3 },
  { nombre: 'maton-boca', caja: [BX - 2, BY - 6, 22, 24], dibujo: boca(), densidad: D * 1.3 },
  { nombre: 'maton-lengua', caja: [BX, BY - 2, 18, 26], dibujo: lengua(), densidad: D * 1.3 },
  { nombre: 'maton-gorra', caja: [50, -134, 78, 40], dibujo: gorra(), densidad: D * 1.3 },
  { nombre: 'maton-sirena', caja: [SX - 10, SY - 14, 20, 22], dibujo: sirena(), densidad: D * 1.6 },
  { nombre: 'maton-luz', caja: [SX - 40, SY - 36, 80, 68], dibujo: luz(), densidad: 1.4 },
  { nombre: 'maton-pata-2', caja: [24, -70, 72, 50], dibujo: pata(1), densidad: D },
  { nombre: 'maton-mango', caja: [MX - 6, MY - 2, 36, 54], dibujo: mango(), densidad: D * 1.3 },
  { nombre: 'maton-paleta', caja: [MX - 14, MY - 14, 58, 28], dibujo: paleta(), densidad: D * 1.3 },
  { nombre: 'maton-ratata', caja: [MX - 74, MY - 74, 148, 148], dibujo: ratata(), densidad: 1.6 },
];

const img = imagenesDe(PIEZAS_MATON);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El gato armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    `<ellipse cx="-10" cy="1" rx="86" ry="6" class="bt-maton-sombra"/>` +
    parte('salto',
      parte('cola', img('maton-cola'), t.cola) +
      parte('pata-1', img('maton-pata-1'), t['pata-1']) +
      parte('cuerpo', img('maton-cuerpo'), t.cuerpo) +
      parte('cabeza',
        parte('haz', img('maton-haz'), t.haz, o.haz) +
        img('maton-cabeza') +
        parte('parpado', img('maton-parpados'), '', o.parpado) +
        parte('boca', img('maton-boca'), '', o.boca) +
        parte('lengua', img('maton-lengua'), '', o.lengua) +
        img('maton-gorra') + img('maton-sirena') +
        parte('luz', img('maton-luz'), '', o.luz),
        t.cabeza) +
      parte('pata-2',
        img('maton-pata-2') + img('maton-mango') +
        parte('paleta', img('maton-paleta'), t.paleta) +
        parte('ratata', img('maton-ratata'), '', o.ratata),
        t['pata-2']),
      t.salto)
  );
}

/** El gato en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function matonEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: agazapado, con la sirena apagada. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--maton" data-id="el-gato-maton" role="button" tabindex="0" aria-label="${nombres.get('el-gato-maton') ?? 'El gato matón'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: en operativo, con la sirena prendida y la matraca sonando, en la chapa. */
export const RETRATO = { caja: [MATON.x - 80, MATON.piso - 104, 170, 120] as const };
function retrato(): string {
  return `<image href="/bestiario/baldio-lejos.webp" x="0" y="0" width="1500" height="640" preserveAspectRatio="none"/>` +
    // La chapa, en su caja de `arte-baldio.ts`: del canto de arriba al de abajo.
    `<image href="/bestiario/baldio-chapa.webp" x="0" y="284" width="1500" height="42" preserveAspectRatio="none"/>` + matonEn(OPERATIVO);
}

export const MATON_PERSONAJE: Personaje = {
  id: 'el-gato-maton',
  region: 'los-techos',
  ancla: MATON.x,
  piezas: PIEZAS_MATON,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
