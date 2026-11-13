/**
 * El taxi paranormal (`D-73`, vigesimoséptima vuelta), volcado en la banquina, con las ruedas para arriba.
 *
 * *"Volanteás, volcás tu taxi paranormal"* es de *Pensando como una acelga*, en *Momo Sampler* (2000). Se toma al
 * pie de la letra, y del mismo tema sale todo lo que tiene encima: *"tan fuera de foco"* (tiene un doble
 * corrido, como una foto movida, que se le despega), *"parpadeando a lo gurú-vudú"* (el faro que quedó prendido
 * es un ojo, con párpado, y parpadea), *"tu cerebro es un jabón"* (por el escape le salen pompas),
 * *"con tu flor de espadas"* (tres naipes de espadas enganchados en el limpiaparabrisas), *"en plan de chofer
 * suicida"* y *"cara de loco esqueleto"* (el brazo del chofer cuelga de la ventanilla, y es puro hueso, con el
 * reloj puesto), *"loco por una colilla"* (hay una en el pasto, todavía humeando), *"se te escapa un poquito el
 * diablo"* (por el baúl mal cerrado le asoma una cola con punta de flecha) y *"así también te ves bien"* (cuando
 * lo tocan, el chofer saluda). Tocado, hace lo paranormal: levita a un palmo de la banquina, se va de foco, se le
 * abre el baúl, se le escapa el diablo entero, y cae.
 *
 * De la letra son el taxi, el vuelco, el foco, el parpadeo, el jabón, las espadas, el esqueleto, la colilla y el
 * diablo. Del dibujo son el cartel del techo, la bandera del reloj y la huella de la volanteada.
 *
 * Es negro y amarillo, como todo taxi de Buenos Aires y como el toxi-taxi que pasa por el carril: esas dos tintas son
 * las del sitio (`T`). *Momo Sampler*, medido con sharp, va en los detalles: el brillo de la chapa es el violeta de
 * la contratapa, los cromados, el piso del auto y las llantas son la plata del medallón, y el diablo, el doble, las
 * pompas y el hueso son los lilas de la contratapa.
 *
 * Coordenadas: el (0, 0) es la banquina debajo del medio del techo, y la trompa va a la derecha (`rig-taxi.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, f, poli } from './trazos.ts';
import { LEVITA, QUIETO, TAXI, TAXI_ARMADO as A, marcas, type Momento } from './rig-taxi.ts';

const ID = 'el-taxi-paranormal';

/**
 * Lo que lo nombra taxi en Buenos Aires: el negro y el amarillo, los mismos del toxi-taxi que pasa por el carril
 * (`arte-entornos.ts`), y el rojo de su cartel. Son tintas del sitio, no de la tapa: la tapa va en los detalles.
 */
const T = {
  negro: 'var(--fondo)',
  amarillo: 'var(--acento-2)',
  rojo: 'var(--marca-rojo)',
  yuyo: 'var(--disco-luzbelito-apoyo)',
  yuyoClaro: 'var(--disco-luzbelito-tinta)',
};

/** Las tintas de *Momo Sampler* (`tokens.css`). */
const C = {
  negro: 'var(--bestia-taxi-negro)',
  violeta: 'var(--bestia-taxi-violeta)',
  violetaHondo: 'var(--bestia-taxi-violeta-hondo)',
  violetaClaro: 'var(--bestia-taxi-violeta-claro)',
  malva: 'var(--bestia-taxi-malva)',
  lila: 'var(--bestia-taxi-lila)',
  hueso: 'var(--bestia-taxi-hueso)',
  plata: 'var(--bestia-taxi-plata)',
  plataHonda: 'var(--bestia-taxi-plata-honda)',
  plataClara: 'var(--bestia-taxi-plata-clara)',
  oro: 'var(--bestia-taxi-oro)',
  oroClaro: 'var(--bestia-taxi-oro-claro)',
  oroHondo: 'var(--bestia-taxi-oro-hondo)',
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

/** La carrocería, patas arriba: abajo la cabina con el techo apoyado, arriba el piso del auto. */
const CHAPA = curva([[-152, -50], [-148, -76], [-122, -84], [0, -86], [122, -84], [150, -76], [156, -58], [150, -44], [84, -40], [-92, -40], [-150, -42]]);
const CABINA = poli([[-92, -41], [84, -41], [60, -3], [-68, -5]]);

/* ------------------------------------------------------------------
   La banquina: la huella de la volanteada, los vidrios y la colilla
   ------------------------------------------------------------------ */

function banquina(): string {
  const rnd = azar(401);
  let vidrios = '';
  for (let i = 0; i < 16; i++) {
    const x = -130 + rnd() * 260;
    const y = 2 + rnd() * 10;
    vidrios += forma(poli([[x, y], [x + 2 + rnd() * 3, y - 1.4], [x + 1.4, y + 1.6]]), i % 3 ? C.lila : C.plataClara, 0.5 + rnd() * 0.4);
  }
  return conGrano(
    // Donde apoya: la mancha, y el pasto aplastado.
    nube(0, 4, 150, 7, C.negro, 's', 0.85) + nube(10, 6, 90, 4, C.violetaHondo, 's', 0.7) +
    // La huella de la volanteada: dos frenadas que vienen de la ruta, en curva, y se cortan donde volcó.
    trazo('M-196 -6 Q-120 14 -40 10 M-190 2 Q-110 22 -20 16', C.violeta, 5, 0.5) + trazo('M-196 -6 Q-120 14 -40 10', C.malva, 1, 0.3) +
    vidrios +
    // La colilla, todavía prendida, y su hilito de humo.
    `<g transform="rotate(-12 150 8)">${forma(cajaRedonda(140, 6, 16, 4, 1.6), C.hueso)}${forma(cajaRedonda(140, 6, 5, 4, 1.4), C.oro)}${forma(elipse(156.4, 8, 1.6, 2), C.oroClaro)}</g>` +
    trazo('M157 6 q-5 -8 1 -15 q5 -7 -1 -14', C.lila, 0.9, 0.5),
  );
}

/* ------------------------------------------------------------------
   El fierro: el doble corrido, la carrocería, las ruedas
   ------------------------------------------------------------------ */

/** El doble: el mismo taxi, soplado y sin detalle. Es lo que se le despega cuando se va de foco. */
function doble(): string {
  return soplo(CHAPA, C.malva, 's', 0.9) + soplo(CABINA, C.malva, 's', 0.8) + A.ruedas.map(([x, y]) => nube(x, y, A.radio, A.radio, C.lila, 's', 0.8)).join('');
}

function carroceria(): string {
  const [lx, ly] = A.libre;
  const { centro: [fx, fy], radio } = A.faro;
  const vidrio = (pts: ReadonlyArray<readonly [number, number]>, id: string, rajado = false): string => {
    const d = poli(pts);
    const [x0, y0] = pts[0]!;
    return enmascarado(id, d, forma(d, C.negro) + nube(x0 + 14, y0 + 6, 16, 5, C.violeta, 's', 0.7) + trazo(`M${x0 + 4} ${y0 + 22} l14 -18`, C.lila, 1.2, 0.3)) +
      (rajado ? trazo(`M${x0 + 20} ${y0 + 12} l-8 -8 M${x0 + 20} ${y0 + 12} l10 -6 M${x0 + 20} ${y0 + 12} l-4 12 M${x0 + 20} ${y0 + 12} l12 8`, C.lila, 0.7, 0.7) : '');
  };
  // Los tres naipes de la flor de espadas, enganchados en el limpiaparabrisas.
  const naipe = (x: number, y: number, giro: number): string =>
    `<g transform="rotate(${giro} ${x} ${y + 14})">${forma(cajaRedonda(x - 5, y, 10, 15, 1.4), C.hueso)}${trazo(`M${x} ${y + 3} l0 8 M${x - 2} ${y + 9.4} l4 0`, C.violetaHondo, 1.2)}${forma(poli([[x - 1.2, y + 3.4], [x + 1.2, y + 3.4], [x, y + 1.4]]), C.violetaHondo)}</g>`;
  return conGrano(
    // La cabina, abajo: los parantes, el techo amarillo de taxi apoyado en el pasto, y el cartel del techo, aplastado.
    enmascarado('m-taxi-cabina', CABINA, forma(CABINA, T.amarillo) + nube(0, -38, 90, 4, C.oroHondo, 's', 0.8) + nube(-76, -20, 6, 16, C.oroHondo, 's', 0.5)) +
    vidrio([[-84, -37], [-42, -37], [-46, -11], [-64, -11]], 'm-taxi-v1') + vidrio([[-34, -37], [26, -37], [24, -11], [-38, -11]], 'm-taxi-v2') + vidrio([[34, -37], [78, -37], [58, -11], [32, -11]], 'm-taxi-v3', true) +
    naipe(60, -32, -24) + naipe(66, -31, 0) + naipe(72, -32, 24) + trazo('M40 -14 L78 -30', C.plata, 1.6, 0.9) +
    enmascarado('m-taxi-techo', poli([[-70, -11], [62, -11], [60, -1], [-68, -3]]), forma(poli([[-70, -11], [62, -11], [60, -1], [-68, -3]]), T.amarillo) + nube(0, -2, 70, 3, C.oroHondo, 'xs', 0.9)) +
    // La carrocería: negra, con el violeta donde le da la luna, el zócalo cromado y el paragolpes.
    enmascarado('m-taxi-chapa', CHAPA,
      // Negra, de taxi. Para que una chapa negra se vea sobre el pasto negro, lleva el brillo de la luna en el lomo (el
      // violeta de la contratapa), el piso del auto en plata arriba, y el canto entero perfilado.
      forma(CHAPA, T.negro) + nube(40, -62, 90, 6, C.violeta, 's', 0.9) + nube(70, -60, 40, 3, C.violetaClaro, 's', 0.7) + nube(-100, -60, 30, 5, C.violeta, 's', 0.6) + nube(0, -84, 150, 5, C.plataHonda, 's', 0.9) +
      // Las puertas, y la franja amarilla del taxi, que quedó abajo.
      trazo('M-36 -42 L-38 -78 M30 -42 L28 -78 M-96 -42 L-98 -62', C.violeta, 1.4, 0.9) + forma(poli([[-150, -50], [152, -50], [152, -43], [-150, -42]]), T.amarillo)) +
    trazo(CHAPA, C.plata, 1.4, 0.75) +
    trazo('M-148 -76 Q-122 -86 0 -87 Q122 -86 150 -76', C.plata, 2.2, 0.9) + trazo('M-150 -46 L152 -47', C.plataClara, 0.8, 0.5) +
    // El piso del auto, al aire: el cardán, el caño de escape con su silenciador, y la boca.
    trazo('M-96 -92 L98 -92', C.plataHonda, 4) + forma(cajaRedonda(-60, -98, 44, 10, 4), C.plata) + nube(-38, -96, 18, 2, C.plataClara, 'xs', 0.7) +
    trazo(`M-60 -93 L${A.escape[0] + 4} ${A.escape[1]}`, C.plata, 3.4) + forma(elipse(A.escape[0] + 3, A.escape[1], 2.4, 3.4), C.negro) +
    // Los paragolpes y la patente, colgando de un tornillo.
    forma(cajaRedonda(148, -60, 8, 20, 3), C.plata) + forma(cajaRedonda(-158, -62, 8, 20, 3), C.plata) +
    `<g transform="rotate(24 -158 -46)">${forma(cajaRedonda(-168, -46, 20, 9, 1.4), C.hueso)}${trazo('M-164 -41.4 l12 0', C.violetaHondo, 1.6, 0.8)}</g>` +
    // El faro que quedó prendido: un ojo. Y la luz de atrás.
    forma(elipse(fx, fy, radio + 2, radio + 2), C.plata) + forma(elipse(fx, fy, radio, radio), C.hueso) + nube(fx, fy, 5, 5, C.oroClaro, 'xs', 0.8) + forma(elipse(fx + 1, fy - 1, 3.2, 3.6), C.negro) + forma(elipse(fx + 2, fy - 2.4, 1, 1), C.hueso) +
    forma(cajaRedonda(-152, -70, 6, 10, 2), C.malva) +
    // El cartel del techo, que quedó abajo, aplastado contra el pasto y dado vuelta como todo: TAXI, patas arriba.
    `<g transform="rotate(176 -4 -11)">` + nube(-4, -11, 30, 10, T.amarillo, 's', 0.35) + forma(cajaRedonda(-30, -19, 52, 16, 3), T.amarillo) + forma(cajaRedonda(-30, -19, 52, 3.4, 1.6), T.rojo) +
    trazo('M-24 -13 h8 M-20 -13 v8 M-11 -5 l4 -8 l4 8 M-9.6 -8 h5.2 M1 -13 l7 8 M8 -13 l-7 8 M13.6 -13 v8', T.negro, 2) + `</g>` +
    // La manija, y la bandera del reloj, apagada: la luz la prende la isla.
    trazo('M10 -62 l12 0', C.plata, 2, 0.9) + forma(cajaRedonda(lx - 5, ly - 4, 10, 8, 1.4), C.violeta),
  );
}

/** La bandera del reloj, prendida: «libre», sin letras. */
function libre(): string {
  const [lx, ly] = A.libre;
  return nube(lx, ly, 9, 8, C.oroClaro, 's', 0.55) + forma(cajaRedonda(lx - 5, ly - 4, 10, 8, 1.4), C.oroClaro) + trazo(`M${lx - 2.6} ${ly} l5.2 0`, C.oroHondo, 1.2, 0.8);
}

/** Una rueda: la cubierta, la llanta de plata y los rayos, para que se vea que gira. La de adelante quedó torcida. */
function rueda(n: 0 | 1): string {
  const [x, y] = A.ruedas[n];
  const r = A.radio;
  let rayos = '';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + n;
    rayos += trazo(`M${f(x)} ${f(y)} L${f(x + Math.cos(a) * r * 0.56)} ${f(y + Math.sin(a) * r * 0.56)}`, C.plataHonda, 2.6);
  }
  return conGrano(
    forma(elipse(x, y, r, r), C.violetaHondo) + nube(x - 6, y - 10, r * 0.8, r * 0.5, C.violetaClaro, 's', 0.6) + `<circle cx="${x}" cy="${y}" r="${r - 1}" fill="none" stroke="${C.violetaClaro}" stroke-width="1" opacity="0.6"/>` +
    forma(elipse(x, y, r * 0.62, r * 0.62), C.plata) + nube(x - 4, y - 4, r * 0.3, r * 0.3, C.plataClara, 'xs', 0.9) + rayos + forma(elipse(x, y, r * 0.2, r * 0.2), C.plataClara) +
    // El parche de la cubierta, y el tapón de la válvula: lo que deja ver la vuelta.
    forma(poli([[x + r * 0.7, y - 4], [x + r - 1, y - 5], [x + r - 1, y + 5], [x + r * 0.7, y + 4]]), C.lila, 0.7) + forma(elipse(x - r * 0.66, y + r * 0.3, 2, 2), C.oro),
  );
}

/** El párpado del faro: de chapa. */
function parpado(): string {
  const { centro: [fx, fy], radio } = A.faro;
  return conGrano(forma(elipse(fx, fy, radio + 1.6, radio + 1.6), C.violeta) + nube(fx - 2, fy - 3, 5, 3, C.violetaClaro, 'xs', 0.7) + trazo(`M${fx - radio - 0.6} ${fy + 1.4} Q${fx} ${fy + radio + 2.4} ${fx + radio + 0.6} ${fy + 1.4}`, C.plata, 1.4));
}

/** El haz del faro, que con el taxi dado vuelta alumbra el cielo: un cono cortado a mano, con el canto roto. */
function haz(): string {
  const { centro: [fx, fy] } = A.faro;
  const cono = poli([[fx + 6, fy - 4], [fx + 9, fy + 5], [fx + 96, fy - 60], [fx + 150, fy - 150], [fx + 170, fy - 230], [fx + 128, fy - 236], [fx + 110, fy - 170], [fx + 70, fy - 96]]);
  const rnd = azar(409);
  let polvo = '';
  for (let i = 0; i < 26; i++) {
    const t = 0.15 + rnd() * 0.8;
    polvo += forma(elipse(fx + 20 + t * 130 + (rnd() - 0.5) * 30 * t, fy - 10 - t * 200 + (rnd() - 0.5) * 20, 0.8 + rnd(), 0.8 + rnd()), C.hueso, 0.3 + rnd() * 0.4);
  }
  return `<g filter="url(#rociado)">${soplo(cono, C.lila, 's', 0.32)}${soplo(poli([[fx + 6, fy - 2], [fx + 8, fy + 3], [fx + 60, fy - 50], [fx + 50, fy - 60]]), C.hueso, 's', 0.4)}</g>` + polvo;
}

/* ------------------------------------------------------------------
   Lo que se escapa: el baúl, el diablo, la cola, el brazo del chofer, las pompas
   ------------------------------------------------------------------ */

/** La tapa del baúl, que con el taxi dado vuelta se abre para abajo. */
function baul(): string {
  const [bx, by] = A.baul;
  const d = poli([[bx, by - 1], [bx - 52, by + 1], [bx - 53, by + 7], [bx, by + 5]]);
  return conGrano(enmascarado('m-taxi-baul', d, forma(d, C.negro) + nube(bx - 26, by + 1, 26, 2, C.violeta, 'xs', 0.9)) + forma(elipse(bx - 46, by + 4, 2, 2), C.plata) + trazo(`M${bx - 2} ${by + 5} L${bx - 52} ${by + 7}`, C.oro, 1.4, 0.8));
}

/**
 * El diablo, lo poquito que se escapa: cuelga cabeza abajo del baúl, que está dado vuelta, con los cuernos para el
 * pasto, los ojos amarillos, la sonrisa al revés y las garras agarradas del borde.
 */
function diablo(): string {
  const [dx, dy] = A.diablo;
  const d = curva([[dx - 20, dy - 14], [dx - 22, dy + 2], [dx - 14, dy + 13], [dx, dy + 17], [dx + 14, dy + 13], [dx + 22, dy + 2], [dx + 20, dy - 14], [dx, dy - 20]]);
  const cuerno = (s: 1 | -1): string => curva([[dx + s * 7, dy + 12], [dx + s * 11, dy + 26], [dx + s * 21, dy + 31], [dx + s * 19, dy + 19], [dx + s * 17, dy + 9]]);
  return conGrano(
    forma(cuerno(1), C.hueso) + forma(cuerno(-1), C.hueso) + nube(dx - 14, dy + 16, 4, 6, C.lila, 'xs', 0.5) +
    enmascarado('m-taxi-diablo', d, forma(d, C.lila) + nube(dx, dy - 12, 20, 8, C.malva, 's', 0.9) + nube(dx + 14, dy + 2, 6, 12, C.malva, 's', 0.6) + nube(dx - 6, dy + 10, 8, 4, C.hueso, 'xs', 0.5)) +
    // Los ojos, con la pupila de chivo; las cejas; y la sonrisa con los colmillos, todo patas arriba.
    [-9, 9].map((x) => forma(elipse(dx + x, dy + 3, 6.4, 5.2), C.negro) + forma(elipse(dx + x, dy + 3, 5.2, 4.2), T.amarillo) + forma(cajaRedonda(dx + x - 3.2, dy + 2, 6.4, 2.2, 1), C.negro)).join('') +
    trazo(`M${dx - 16} ${dy + 10} l10 -3 M${dx + 16} ${dy + 10} l-10 -3`, C.negro, 1.8) + trazo(`M${dx - 9} ${dy - 6} q9 -7 18 0`, C.negro, 1.6) +
    forma(poli([[dx - 6, dy - 8], [dx - 3.6, dy - 13], [dx - 2, dy - 9.4]]), C.hueso) + forma(poli([[dx + 6, dy - 8], [dx + 3.6, dy - 13], [dx + 2, dy - 9.4]]), C.hueso) +
    // Las garras, agarradas del canto del baúl.
    [-26, 26].map((x) => [0, 4, 8].map((i) => trazo(`M${dx + x + (x < 0 ? i - 4 : -i + 4)} ${dy - 22} l0 9`, C.malva, 2.6)).join('')).join(''),
  );
}

/** La cola del diablo: sale del baúl y se arrastra por el pasto, con la punta de flecha. */
function cola(): string {
  const [kx, ky] = A.cola;
  const d = `M${kx} ${ky} C${kx - 6} ${ky + 22} ${kx - 30} ${ky + 34} ${kx - 44} ${ky + 26} C${kx - 54} ${ky + 20} ${kx - 52} ${ky + 8} ${kx - 44} ${ky + 8}`;
  return conGrano(trazo(d, C.malva, 4.6) + trazo(d, C.lila, 1.2, 0.5) + forma(poli([[kx - 44, ky + 1], [kx - 34, ky + 9], [kx - 46, ky + 16], [kx - 43, ky + 8]]), C.malva));
}

/** El brazo del chofer: puro hueso, con el reloj y la manga de la camisa. Cuelga de la ventanilla hasta el pasto. */
function brazo(): string {
  const [cx, cy] = A.codo;
  const hueso = (x0: number, y0: number, x1: number, y1: number, ancho: number): string => trazo(`M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}`, C.hueso, ancho) + forma(elipse(x0, y0, ancho * 0.8, ancho * 0.8), C.hueso) + forma(elipse(x1, y1, ancho * 0.8, ancho * 0.8), C.hueso);
  const [mx, my] = [cx + 26, cy + 26];
  return conGrano(
    // La manga, arremangada.
    forma(poli([[cx - 7, cy - 6], [cx + 6, cy - 8], [cx + 12, cy + 4], [cx - 2, cy + 8]]), C.plata) + trazo(`M${cx - 2} ${cy + 8} l14 -4`, C.plataHonda, 1.6) +
    // El cúbito y el radio, el reloj, y la mano: cinco dedos de tres falanges.
    hueso(cx + 4, cy + 4, mx - 3, my - 5, 2.4) + hueso(cx + 7, cy + 2, mx, my - 7, 2) +
    forma(cajaRedonda(cx + 13, cy + 12, 9, 7, 2), C.oro) + forma(elipse(cx + 17.5, cy + 15.5, 2.4, 2.4), C.hueso) +
    [[8, -2], [10, 2], [10, 6], [8, 10], [2, 8]].map(([x, y], i) => trazo(`M${f(mx - 1)} ${f(my - 3 + i)} l${f(x! * 0.55)} ${f(y! * 0.55)} l${f(x! * 0.45)} ${f(y! * 0.45 + 1)}`, C.hueso, 1.7)).join('') +
    forma(elipse(mx - 1, my - 2, 4, 4.4), C.hueso) + nube(mx - 1, my - 1, 2, 2, C.lila, 'xs', 0.6),
  );
}

/** Las pompas de jabón del escape: tres, con su reflejo. Van dibujadas en la boca del caño; la isla las sube. */
function pompas(): string {
  const [ex, ey] = A.escape;
  return [[-6, -2, 6], [-16, -12, 4.4], [-4, -18, 3]].map(([x, y, r]) =>
    `<circle cx="${ex + x!}" cy="${ey + y!}" r="${r}" fill="${C.lila}" fill-opacity="0.18" stroke="${C.lila}" stroke-width="0.9"/>` + trazo(`M${ex + x! - r! * 0.5} ${ey + y! - r! * 0.2} a${f(r! * 0.5)} ${f(r! * 0.5)} 0 0 1 ${f(r! * 0.4)} ${f(-r! * 0.4)}`, C.hueso, 0.9, 0.9)).join('');
}

/** Los yuyos de adelante: unas matas bajas al pie, para que no quede pegado encima del pasto. No llegan al faro. */
function yuyos(): string {
  const rnd = azar(431);
  let s = '';
  for (let i = 0; i < 46; i++) {
    const x = -196 + rnd() * 372;
    // Delante del faro y del baúl, el pasto va más corto todavía.
    const tope = x > 110 || x < -96 ? 12 : 22;
    const h = tope * (0.4 + rnd() * 0.6);
    const dx = (rnd() - 0.5) * 12;
    s += trazo(`M${f(x)} ${f(12 + rnd() * 4)} q${f(dx * 0.3)} ${f(-h * 0.6)} ${f(dx)} ${f(-h)}`, rnd() < 0.8 ? T.yuyo : T.yuyoClaro, 1.6 + rnd() * 1.6, 0.9);
  }
  return s;
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;
const F = A.faro;
const cajaRueda = (n: 0 | 1): readonly [number, number, number, number] => [A.ruedas[n][0] - A.radio - 2, A.ruedas[n][1] - A.radio - 2, A.radio * 2 + 4, A.radio * 2 + 4];

export const PIEZAS_TAXI: readonly Pieza[] = [
  { nombre: 'taxi-banquina', caja: [-204, -30, 372, 46], dibujo: banquina(), densidad: 1.8 },
  { nombre: 'taxi-haz', caja: [F.centro[0] - 4, F.centro[1] - 246, 190, 262], dibujo: haz(), densidad: 1.2 },
  { nombre: 'taxi-doble', caja: [-172, -126, 344, 136], dibujo: doble(), densidad: 1 },
  { nombre: 'taxi-diablo', caja: [A.diablo[0] - 34, A.diablo[1] - 26, 68, 62], dibujo: diablo(), densidad: D * 1.5 },
  { nombre: 'taxi-cola', caja: [A.cola[0] - 60, A.cola[1] - 6, 66, 44], dibujo: cola(), densidad: D },
  { nombre: 'taxi-rueda-1', caja: cajaRueda(0), dibujo: rueda(0), densidad: D },
  { nombre: 'taxi-rueda-2', caja: cajaRueda(1), dibujo: rueda(1), densidad: D },
  { nombre: 'taxi-carroceria', caja: [-172, -100, 344, 104], dibujo: carroceria(), densidad: D },
  { nombre: 'taxi-libre', caja: [A.libre[0] - 20, A.libre[1] - 18, 40, 36], dibujo: libre(), densidad: D },
  { nombre: 'taxi-parpado', caja: [F.centro[0] - 13, F.centro[1] - 12, 26, 26], dibujo: parpado(), densidad: D * 1.8 },
  { nombre: 'taxi-baul', caja: [A.baul[0] - 56, A.baul[1] - 4, 60, 14], dibujo: baul(), densidad: D },
  { nombre: 'taxi-brazo', caja: [A.codo[0] - 10, A.codo[1] - 10, 50, 46], dibujo: brazo(), densidad: D * 1.5 },
  { nombre: 'taxi-yuyos', caja: [-204, -14, 388, 34], dibujo: yuyos(), densidad: 1.8 },
  { nombre: 'taxi-pompas', caja: [A.escape[0] - 24, A.escape[1] - 24, 30, 30], dibujo: pompas(), densidad: D * 1.5 },
];

const img = imagenesDe(PIEZAS_TAXI);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El taxi armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    img('taxi-banquina') +
    parte('fierro',
      parte('haz', img('taxi-haz'), '', o.haz) +
      parte('doble', img('taxi-doble'), t.doble, o.doble) +
      parte('cola', img('taxi-cola'), t.cola) +
      // La tapa del baúl va atrás del diablo: si no, le cruza la cara.
      parte('baul', img('taxi-baul'), t.baul) +
      parte('diablo', img('taxi-diablo'), t.diablo) +
      parte('rueda-1', img('taxi-rueda-1'), t['rueda-1']) +
      parte('rueda-2', img('taxi-rueda-2'), t['rueda-2']) +
      img('taxi-carroceria') +
      parte('libre', img('taxi-libre'), '', o.libre) +
      parte('parpado', img('taxi-parpado'), t.parpado) +
      parte('brazo', img('taxi-brazo'), t.brazo) +
      parte('pompas', img('taxi-pompas'), t.pompas, o.pompas),
      t.fierro) +
    img('taxi-yuyos')
  );
}

/** El taxi en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function taxiEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: volcado, con el faro a medio párpado. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--taxi" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El taxi paranormal'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: levitando, fuera de foco, con el diablo asomado y el chofer saludando. */
export const RETRATO = { caja: [TAXI.x - 130, TAXI.piso - 136, 264, 150] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/ruta-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/ruta-piso.webp" x="0" y="200" width="900" height="440" preserveAspectRatio="none"/>` +
    taxiEn(LEVITA)
  );
}

export const TAXI_PERSONAJE: Personaje = {
  id: ID,
  region: 'la-ruta',
  ancla: TAXI.x,
  piezas: PIEZAS_TAXI,
  // Adelante de todo: los yuyos de `ruta-frente` lo rayaban entero. Trae sus propias matas, bajas.
  capas: { delante: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
