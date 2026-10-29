/**
 * Los gallos sofocados (`D-73`, vigesimotercera vuelta): dos gallos que llegan tambaleando a la fiesta del
 * templo de Momo y se apoyan uno en el otro para no caerse.
 *
 * *"Vienen tambaleando, gallos sofocados, y la 'quetejedi' prepara el festín"* es de *Templo de Momo*, y
 * *"No hay quien le quite a ese gallo el espolón"* de *Pool, Averna y Papusa*: los dos en *Momo sampler*
 * (2000). De la letra son el tambaleo, el pico abierto de sofocados, el espolón enorme del de la izquierda,
 * la flor chillona (*"pura flor chillona y pura ambriaguez"*) que el flaco lleva clavada atrás de la cresta
 * y la botella de licor (*"licor y baladas para embaucar"*), sin marca, que el del espolón tiene agarrada
 * del culo con la punta del ala y que gotea. Del dibujo: la serpentina enroscada en el pescuezo, el papel
 * picado pegado en las plumas, y las crestas caídas sobre el ojo, de fin de fiesta.
 *
 * Visten *Momo sampler*, medido con sharp: el del espolón está soplado en el violeta de la máscara de murga
 * de la contratapa, con la golilla en el cobre y el oro de las letras del título; el flaco, en la plata del
 * lomo del envase. Las crestas son el rojo quemado de esas letras, y la flor, el rosa de la máscara del
 * interior.
 *
 * Coordenadas: cada gallo mira a la derecha con el (0, 0) entre sus patas; el flaco va espejado en la pareja
 * (`rig-gallos.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, poli, rot, type P } from './trazos.ts';
import { GALLO as G, GALLOS, PAREJA, QUIETO, RINA, marcas, type Momento } from './rig-gallos.ts';

/** Las tintas de *Momo sampler* (`tokens.css`). */
const C = {
  hondo: 'var(--bestia-gallos-hondo)',
  violeta: 'var(--bestia-gallos-violeta)',
  violetaClara: 'var(--bestia-gallos-violeta-clara)',
  mascara: 'var(--bestia-gallos-mascara)',
  plataHonda: 'var(--bestia-gallos-plata-honda)',
  plata: 'var(--bestia-gallos-plata)',
  plataClara: 'var(--bestia-gallos-plata-clara)',
  brillo: 'var(--bestia-gallos-brillo)',
  oro: 'var(--bestia-gallos-oro)',
  oroClaro: 'var(--bestia-gallos-oro-claro)',
  oroHondo: 'var(--bestia-gallos-oro-hondo)',
  cobre: 'var(--bestia-gallos-cobre)',
  rojo: 'var(--bestia-gallos-rojo)',
  rojoQuemado: 'var(--bestia-gallos-rojo-quemado)',
  rosa: 'var(--bestia-gallos-rosa)',
  rosaClara: 'var(--bestia-gallos-rosa-clara)',
};

type Cual = 'a' | 'b';

/** El plumaje de cada uno: el del espolón, violeta y cobre; el flaco, plata y oro. */
const PLUMAJE = {
  a: { base: C.violeta, sombra: C.hondo, luz: C.violetaClara, brillo: C.mascara, golilla: C.cobre, golillaLuz: C.oroHondo, cola: C.hondo, colaLuz: C.plataHonda, muslo: C.violeta },
  b: { base: C.plata, sombra: C.plataHonda, luz: C.plataClara, brillo: C.brillo, golilla: C.oroClaro, golillaLuz: C.plataClara, cola: C.plataClara, colaLuz: C.brillo, muslo: C.plata },
} as const;

/** El papel picado del carnaval, pegado en las plumas: rectangulitos torcidos. */
const picado = (pts: ReadonlyArray<readonly [number, number, number]>): string =>
  pts.map(([x, y, g], i) => forma(cajaRedonda(x - 2.4, y - 1.6, 4.8, 3.2, 0.4), [C.rosaClara, C.oroClaro, C.plataClara, C.rosa][i % 4]!, 0.9).replace('/>', ` transform="rotate(${g} ${x} ${y})"/>`)).join('');

/* ------------------------------------------------------------------
   Las patas: el muslo de plumas, la caña con escamas, los dedos y el espolón
   ------------------------------------------------------------------ */

function pata(g: Cual, n: 0 | 1): string {
  const L = PLUMAJE[g];
  const [hx, hy] = G.caderas[n];
  const [fx, fy] = G.pies[n];
  const rodilla: P = [hx + (fx - hx) * 0.3 + 2, hy + 22];
  const cana = poli([[rodilla[0] - 3.4, rodilla[1]], [rodilla[0] + 3.4, rodilla[1]], [fx + 3, fy - 3], [fx - 3, fy - 3]]);
  const escamas = [0.2, 0.4, 0.6, 0.8].map((t) => {
    const y = rodilla[1] + (fy - 3 - rodilla[1]) * t;
    const x = rodilla[0] + (fx - rodilla[0]) * t;
    return trazo(`M${x - 3} ${y} q3 2 6 0`, C.oroHondo, 0.8, 0.8);
  }).join('');
  // Los dedos: tres para adelante, abiertos de tambaleo, y el de atrás.
  const dedo = (dx: number, dy: number): string => trazo(`M${fx} ${fy - 2} q${dx * 0.5} ${dy - 3} ${dx} ${dy}`, C.oroHondo, 3.4) + trazo(`M${fx + dx} ${fy + dy} l${Math.sign(dx) * 2.4} 0.6`, C.hondo, 1.4);
  const dedos = dedo(18, 2) + dedo(14, -1) + dedo(10, 3) + dedo(-12, 1);
  const muslo = curva([[hx - 12, hy - 8], [hx + 2, hy - 14], [hx + 13, hy - 4], [hx + 8, hy + 16], [rodilla[0], rodilla[1] + 2], [hx - 8, hy + 14]]);
  // El espolón de la pata de adelante: el del de la izquierda es enorme, de oro, y nadie se lo quita.
  const [ex, ey] = G.espolon;
  const espolon = g === 'a' && n === 1
    ? enmascarado('m-gallos-espolon', `M${fx - 1} ${ey - 4} C${ex + 6} ${ey - 2} ${ex - 2} ${ey - 2} ${ex - 6} ${ey - 12} C${ex + 4} ${ey + 2} ${ex + 8} ${ey + 6} ${fx - 1} ${ey + 4} Z`,
      forma(`M${fx - 1} ${ey - 4} C${ex + 6} ${ey - 2} ${ex - 2} ${ey - 2} ${ex - 6} ${ey - 12} C${ex + 4} ${ey + 2} ${ex + 8} ${ey + 6} ${fx - 1} ${ey + 4} Z`, C.oro) +
      nube(ex + 4, ey - 2, 8, 2, C.oroClaro, 'xs', 0.95, -20) + nube(ex + 6, ey + 4, 9, 3, C.oroHondo, 's', 0.8)) +
      forma(elipse(ex - 5.4, ey - 11, 1.2, 1.2), C.brillo, 0.9)
    : g === 'b' && n === 1 ? trazo(`M${fx - 2} ${ey} q-5 -1 -7 -4`, C.oroHondo, 2.6) : '';
  return conGrano(
    dedos +
    enmascarado(`m-gallos-cana-${g}-${n}`, cana, forma(cana, n === 0 ? C.oroHondo : C.oro) + nube(rodilla[0] + 2, (rodilla[1] + fy) / 2, 2, 20, C.oroClaro, 's', 0.6) + nube(rodilla[0] - 3, (rodilla[1] + fy) / 2, 2, 20, C.rojoQuemado, 's', 0.4)) +
    escamas + espolon +
    enmascarado(`m-gallos-muslo-${g}-${n}`, muslo, forma(muslo, n === 0 ? L.sombra : L.muslo) + nube(hx + 2, hy - 6, 10, 8, L.luz, 'm', n === 0 ? 0.4 : 0.8) + nube(hx, hy + 14, 12, 5, L.sombra, 's', 0.9) +
      // El muslo desplumado: plumas sueltas que se paran.
      [0, 1, 2].map((i) => trazo(`M${hx - 8 + i * 7} ${hy + 10} l${-2 + i} 6`, L.sombra, 1.2, 0.8)).join('')),
  );
}

/* ------------------------------------------------------------------
   La cola revuelta
   ------------------------------------------------------------------ */

/** Una pluma de hoz: una medialuna afinada que sale de la rabadilla. */
function hoz(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, ancho: number): string {
  const [nx, ny] = [-(cy - y0), cx - x0];
  const l = Math.hypot(nx, ny) || 1;
  const [ox, oy] = [(nx / l) * ancho, (ny / l) * ancho];
  return `M${x0 - ox * 0.5} ${y0 - oy * 0.5} Q${cx - ox} ${cy - oy} ${x1} ${y1} Q${cx + ox} ${cy + oy} ${x0 + ox * 0.5} ${y0 + oy * 0.5} Z`;
}

function cola(g: Cual): string {
  const L = PLUMAJE[g];
  const [rx, ry] = G.rabadilla;
  // Las hoces: largas, despeinadas, una doblada para el otro lado y otra quebrada.
  const plumas: Array<[number, number, number, number, number]> = g === 'a'
    ? [[-70, -210, -104, -190, 9], [-84, -200, -116, -160, 8], [-60, -190, -96, -130, 7], [-50, -220, -60, -214, 6], [-90, -150, -112, -112, 7]]
    : [[-60, -170, -96, -168, 13], [-74, -160, -106, -134, 12], [-50, -176, -66, -188, 10], [-78, -128, -102, -104, 11], [-64, -150, -94, -150, 12]];
  const hoces = plumas.map(([cx, cy, x1, y1, w], i) => {
    const d = hoz(rx, ry, cx, cy, x1, y1, w);
    return enmascarado(`m-gallos-hoz-${g}-${i}`, d, forma(d, i % 2 ? L.cola : L.base) + soplo(hoz(rx, ry, cx + 4, cy + 4, x1, y1, w * 0.3), L.colaLuz, 's', 0.8) + nube(x1, y1, 10, 10, g === 'a' ? C.violetaClara : C.plataHonda, 's', 0.6)) +
      trazo(`M${rx} ${ry} Q${cx} ${cy} ${x1} ${y1}`, L.sombra, 0.8, 0.7);
  }).join('');
  // La pluma quebrada, que cuelga: se la pisaron en la fiesta.
  // La pluma quebrada, que cuelga: se la pisaron en la fiesta.
  const q = g === 'a' ? hoz(rx - 4, ry - 6, -76, -156, -66, -120, 6) : hoz(rx - 4, ry - 4, -70, -142, -62, -112, 7);
  const quebrada = forma(q, g === 'a' ? C.violeta : C.plataClara) + soplo(q, g === 'a' ? C.violetaClara : C.brillo, 'xs', 0.5);
  const tapadas = forma(curva([[rx + 6, ry - 6], [rx - 12, ry - 24], [rx - 30, ry - 12], [rx - 20, ry + 10], [rx + 4, ry + 8]]), L.base) + nube(rx - 12, ry - 8, 10, 8, L.luz, 's', 0.6);
  return conGrano(hoces + quebrada + tapadas + picado([[-80, -170, 20], [-66, -150, -30]]));
}

/* ------------------------------------------------------------------
   El cuerpo: el del espolón, de pecho grande; el flaco, de quilla
   ------------------------------------------------------------------ */

const CUERPO: Readonly<Record<Cual, readonly P[]>> = {
  a: [[36, -106], [42, -88], [32, -66], [8, -52], [-22, -54], [-46, -68], [-54, -96], [-42, -118], [-14, -124], [10, -128], [28, -124]],
  b: [[30, -108], [34, -90], [24, -68], [4, -56], [-20, -58], [-40, -70], [-48, -96], [-38, -116], [-14, -122], [8, -126], [24, -122]],
};

function cuerpo(g: Cual): string {
  const L = PLUMAJE[g];
  const d = curva(CUERPO[g]);
  // Las plumas del lomo, como escamas sopladas, y la luz de los focos del templo que le pega de arriba.
  const escamas = [-36, -24, -12, 0, 12].flatMap((x, i) => [-110, -96, -82].map((y, j) => nube(x + j * 4, y + Math.abs(x) * 0.08, 7, 4, (i + j) % 2 ? L.luz : L.sombra, 'xs', 0.5))).join('');
  const sudor = g === 'a' ? '' : nube(14, -82, 4, 8, C.brillo, 's', 0.5);
  return conGrano(
    enmascarado(`m-gallos-cuerpo-${g}`, d,
      forma(d, L.base) +
      nube(-20, -66, 40, 14, L.sombra, 'm', 0.9) + nube(28, -92, 14, 24, L.luz, 'm', 0.7) + nube(-14, -120, 34, 8, L.brillo, 's', g === 'a' ? 0.35 : 0.8) +
      escamas + nube(30, -70, 12, 10, L.sombra, 's', 0.7) + sudor +
      picado(g === 'a' ? [[-30, -100, 30], [6, -78, -20], [20, -112, 60], [-40, -82, 10]] : [[-24, -104, -40], [10, -74, 15], [-6, -92, 70]])) +
    // La quilla: el borde del pecho, en la sombra.
    trazo(g === 'a' ? 'M40 -96 Q38 -70 14 -54' : 'M33 -96 Q30 -72 10 -58', L.sombra, 1.6, 0.7),
  );
}

/* ------------------------------------------------------------------
   Las alas: la del espolón agarra la botella; la del flaco, plegada
   ------------------------------------------------------------------ */

function ala(g: Cual): string {
  const L = PLUMAJE[g];
  if (g === 'a') {
    const d = curva([[-4, -120], [16, -122], [34, -102], [46, -82], [46, -68], [36, -68], [26, -80], [4, -94], [-10, -106]]);
    // Las primarias, abiertas como dedos alrededor del culo de la botella.
    const dedos = [[36, -66, 44, -60], [42, -70, 50, -66], [30, -70, 34, -62]].map(([x, y, x1, y1]) => trazo(`M${x} ${y} L${x1} ${y1}`, L.sombra, 4) + trazo(`M${x} ${y} L${x1} ${y1}`, L.luz, 1.4, 0.7)).join('');
    return conGrano(
      dedos +
      enmascarado('m-gallos-ala-a', d, forma(d, L.luz) + nube(10, -110, 16, 10, C.cobre, 'm', 0.95) + nube(34, -84, 10, 12, L.sombra, 'm', 0.9) + nube(4, -102, 18, 5, C.mascara, 's', 0.5) +
        [0, 1, 2, 3].map((i) => trazo(`M${8 + i * 6} ${-98 + i * 2} L${30 + i * 4} ${-74 + i}`, L.sombra, 1.4, 0.9)).join('')) +
      trazo(`M-6 -118 Q20 -124 36 -102 Q46 -88 46 -70`, C.oroHondo, 1.2, 0.8),
    );
  }
  const d = curva([[14, -114], [2, -122], [-20, -116], [-44, -96], [-50, -80], [-36, -78], [-14, -86], [6, -96]]);
  const primarias = [0, 1, 2, 3].map((i) => trazo(`M${-6 - i * 8} ${-96 + i * 2} L${-34 - i * 4} ${-80 + i * 0.5}`, L.sombra, 1.2, 0.8)).join('');
  return conGrano(enmascarado('m-gallos-ala-b', d, forma(d, L.base) + nube(-4, -110, 16, 8, L.brillo, 's', 0.8) + nube(-30, -84, 22, 9, L.sombra, 'm', 1) + primarias + nube(-46, -82, 9, 6, C.violeta, 's', 0.9)) +
    // Las puntas de las primarias, festoneadas, que asoman debajo del ala plegada.
    [0, 1, 2, 3, 4].map((i) => forma(elipse(-14 - i * 8, -84 + i * 1.2, 6, 3), i % 2 ? L.sombra : C.violetaClara, 0.8).replace('/>', ` transform="rotate(-12 ${-14 - i * 8} ${-84 + i * 1.2})"/>`)).join('') +
    picado([[-18, -100, 40]]));
}

/** La botella de licor, sin marca, agarrada del culo: cuelga para adelante y gotea. */
function botella(): string {
  const [bx, by] = G.punta;
  const [mx, my] = G.boca;
  const ang = (Math.atan2(my - by, mx - bx) * 180) / Math.PI;
  const largo = Math.hypot(mx - bx, my - by);
  // Dibujada acostada desde el culo (0, 0) hasta la boca (largo, 0), y girada.
  const cuerpoB = `M0 -7 L${largo * 0.55} -7 Q${largo * 0.7} -7 ${largo * 0.74} -3 L${largo - 1} -2.6 L${largo} -3 L${largo} 3 L${largo - 1} 2.6 L${largo * 0.74} 3 Q${largo * 0.7} 7 ${largo * 0.55} 7 L0 7 Z`;
  const adentro =
    forma(cuerpoB, C.hondo) +
    // El licor oscuro, ladeado adentro de la botella, y el reflejo del vidrio.
    forma(`M0 -7 L${largo * 0.4} -7 L${largo * 0.3} 7 L0 7 Z`, C.rojoQuemado, 0.85) +
    nube(largo * 0.35, -4, largo * 0.3, 1.4, C.mascara, 'xs', 0.8) + nube(largo * 0.86, -1.6, 4, 0.8, C.brillo, 'xs', 0.8) +
    // La etiqueta lisa, sin marca, con la franja roja.
    forma(`M${largo * 0.14} -7 L${largo * 0.46} -7 L${largo * 0.46} 7 L${largo * 0.14} 7 Z`, C.oroClaro) + forma(`M${largo * 0.14} -2 L${largo * 0.46} -2 L${largo * 0.46} 1.4 L${largo * 0.14} 1.4 Z`, C.rojo) +
    nube(largo * 0.3, 5, largo * 0.16, 2, C.oroHondo, 's', 0.6);
  const gota = forma(`M${mx + 1} ${my + 1} q2.4 4 0 6 q-2.4 -2 0 -6 Z`, C.rojoQuemado) + forma(elipse(mx + 1.6, my + 7.8, 2.6, 3), C.cobre, 0.9) + forma(elipse(mx + 0.8, my + 7, 0.8, 1), C.oroClaro, 0.9);
  return conGrano(`<g transform="translate(${bx} ${by}) rotate(${(Math.round(ang * 100) / 100)})">${enmascarado('m-gallos-botella', cuerpoB, adentro)}${forma(`M${largo} -3.4 L${largo + 3} -3.4 L${largo + 3} 3.4 L${largo} 3.4 Z`, C.rojo)}</g>` + gota);
}

/* ------------------------------------------------------------------
   La cabeza: el pescuezo con la golilla, la cara roja, el ojo y el pico
   ------------------------------------------------------------------ */

function cabeza(g: Cual): string {
  const L = PLUMAJE[g];
  const [cx, cy] = G.cabeza;
  const [ox, oy] = G.ojo;
  const pescuezo = curva([[8, -124], [10, -150], [24, -176], [44, -186], [52, -170], [42, -150], [38, -126], [24, -114]]);
  // La golilla: las plumas largas y puntudas que bajan de la nuca y se paran, despeinadas.
  const golilla = Array.from({ length: 16 }, (_, i) => {
    const t = i / 15;
    const x = 14 + 26 * t - (i % 3) * 2;
    const y = -174 + 50 * t;
    const largo = 18 + (i % 3) * 4;
    const tuerce = (i % 2 ? 1 : -1) * (2 + (i % 3) * 2) - 3;
    return forma(`M${x - 5} ${y} Q${x - 4 + tuerce * 0.3} ${y + largo * 0.6} ${x - 2 + tuerce} ${y + largo} Q${x + 3} ${y + largo * 0.5} ${x + 6} ${y} Z`, i % 2 ? L.golilla : L.golillaLuz, 0.95);
  }).join('');
  const cara = curva([[cx - 14, cy - 2], [cx - 8, cy - 14], [cx + 6, cy - 16], [cx + 14, cy - 8], [cx + 14, cy + 6], [cx + 2, cy + 12], [cx - 10, cy + 8]]);
  const adentro =
    forma(pescuezo, L.base) + nube(16, -140, 10, 22, L.sombra, 'm', 0.8) + nube(38, -150, 6, 20, L.luz, 'm', 0.6) + golilla +
    nube(30, -130, 16, 6, L.sombra, 's', 0.6);
  const caraRoja =
    enmascarado(`m-gallos-cara-${g}`, cara,
      forma(cara, L.base) + nube(cx - 6, cy - 6, 10, 9, L.luz, 's', 0.6) +
      // La cara roja de gallo, colorada de sofocado, con el cachete prendido.
      nube(ox + 2, oy + 4, 12, 10, C.rojo, 'm', 0.95) + nube(ox + 8, oy + 8, 6, 5, C.rosaClara, 's', 0.7)) +
    // El lóbulo de la oreja.
    forma(elipse(cx - 5, cy + 9, 2.6, 3.4), C.rojoQuemado) + nube(cx - 5.6, cy + 8, 1, 1.4, C.rosaClara, 'xs', 0.8);
  // El ojo: el iris de oro, la pupila grande de borracho y una venita colorada.
  const ojo = forma(elipse(ox, oy, 5.2, 5.2), C.hondo) + forma(elipse(ox, oy, 4.4, 4.4), C.oro) + forma(elipse(ox + 0.6, oy + 0.4, 2.8, 2.8), C.hondo) + forma(elipse(ox - 1, oy - 1.2, 1, 1), C.brillo) + trazo(`M${ox - 4} ${oy + 1.8} l1.8 -0.7`, C.rojo, 0.7, 0.9);
  // El pico de arriba, y lo de adentro de la boca abierta, con la lengüita afuera de sofocado.
  const [px, py] = G.pico;
  const [kx, ky] = G.comisura;
  const boca = forma(poli([[kx - 2, ky - 2], [px - 6, py - 1], [px - 10, py + 6], [kx, ky + 8]]), C.hondo) + forma(curva([[kx + 2, ky + 1], [kx + 10, ky + 1], [kx + 14, ky + 4], [kx + 8, ky + 5]]), C.rosaClara);
  const picoArriba = forma(`M${kx - 2} ${ky - 8} Q${kx + 10} ${ky - 9} ${px + 1} ${py} Q${kx + 10} ${ky - 1} ${kx} ${ky + 1} Z`, C.oroHondo) + nube(kx + 8, ky - 5, 6, 1.4, C.oroClaro, 'xs', 0.9) + forma(elipse(kx + 4, ky - 4, 1.4, 0.8), C.hondo);
  // La serpentina del carnaval, enroscada en el pescuezo del del espolón, con la punta colgando.
  const serpentina = g === 'a'
    ? trazo('M8 -128 Q24 -120 40 -132', C.rosa, 3.6) + trazo('M10 -140 Q26 -132 42 -144', C.rosaClara, 3.6) +
      trazo('M40 -132 q5 -4 2 -12', C.rosa, 2.4) +
      trazo('M42 -144 C50 -140 50 -128 44 -122 C38 -116 48 -110 46 -102 C44 -96 52 -92 50 -86', C.rosaClara, 2.6) + trazo('M10 -140 Q26 -132 42 -144', C.brillo, 0.7, 0.5)
    : '';
  return conGrano(boca + enmascarado(`m-gallos-pescuezo-${g}`, pescuezo, adentro) + caraRoja + ojo + picoArriba + serpentina +
    picado(g === 'a' ? [[24, -144, 50], [40, -126, -10]] : [[30, -140, -50]]));
}

/** El párpado, del colorado de la cara: baja desde arriba del ojo. */
function parpado(g: Cual): string {
  const [ox, oy] = G.ojo;
  const d = elipse(ox, oy, 5.6, 5.6);
  return conGrano(enmascarado(`m-gallos-parpado-${g}`, d, forma(d, C.rojo) + nube(ox, oy - 4, 5, 2, C.rosaClara, 's', 0.8)) + trazo(`M${ox - 5} ${oy + 3} Q${ox} ${oy + 6} ${ox + 5} ${oy + 3}`, C.rojoQuemado, 1));
}

/** El pico de abajo, que se abre en la bisagra. */
function pico(): string {
  const [kx, ky] = G.comisura;
  const [px, py] = G.pico;
  return conGrano(forma(`M${kx} ${ky} Q${kx + 10} ${ky + 1} ${px - 3} ${py + 2} Q${kx + 10} ${ky + 7} ${kx - 1} ${ky + 6} Z`, C.oroHondo) + nube(kx + 6, ky + 4, 6, 1.4, C.rojoQuemado, 'xs', 0.6));
}

/** La barba, que cuelga y se hamaca. */
function barba(g: Cual): string {
  const [bx, by] = G.barba;
  const d = curva([[bx - 5, by - 2], [bx + 4, by - 3], [bx + 6, by + 10], [bx + 2, by + 20], [bx - 1, by + 12], [bx - 4, by + 18], [bx - 7, by + 8]]);
  return conGrano(enmascarado(`m-gallos-barba-${g}`, d, forma(d, C.rojo) + nube(bx + 2, by + 6, 3, 8, C.rosaClara, 's', 0.7) + nube(bx - 4, by + 14, 4, 6, C.rojoQuemado, 's', 0.9)));
}

/** La cresta, que se le cae sobre el ojo; el flaco lleva la flor chillona clavada atrás. */
function cresta(g: Cual): string {
  const [cx, cy] = G.cresta;
  const d = g === 'a'
    ? `M${cx - 12} ${cy + 4} Q${cx - 16} ${cy - 12} ${cx - 8} ${cy - 10} Q${cx - 8} ${cy - 22} ${cx} ${cy - 14} Q${cx + 2} ${cy - 26} ${cx + 8} ${cy - 14} Q${cx + 14} ${cy - 22} ${cx + 16} ${cy - 10} Q${cx + 24} ${cy - 12} ${cx + 18} ${cy + 2} Z`
    : `M${cx - 10} ${cy + 4} Q${cx - 14} ${cy - 10} ${cx - 6} ${cy - 8} Q${cx - 4} ${cy - 18} ${cx + 2} ${cy - 10} Q${cx + 8} ${cy - 18} ${cx + 12} ${cy - 6} Q${cx + 18} ${cy - 6} ${cx + 14} ${cy + 2} Z`;
  const flor = g === 'b'
    ? (() => {
      const [fx, fy] = [cx - 13, cy - 6];
      const petalos = Array.from({ length: 7 }, (_, i) => {
        const [px, py] = rot([fx + 7, fy], [fx, fy], (i * 360) / 7 + 10);
        return forma(elipse(px, py, 4.4, 3.4), i % 2 ? C.rosa : C.rosaClara, 0.95).replace('/>', ` transform="rotate(${(i * 360) / 7 + 10} ${px.toFixed(2)} ${py.toFixed(2)})"/>`);
      }).join('');
      return petalos + forma(elipse(fx, fy, 3, 3), C.oro) + nube(fx - 1, fy - 1, 1.4, 1.4, C.oroClaro, 'xs', 0.9) + trazo(`M${fx + 2} ${fy + 3} L${fx + 8} ${fy + 10}`, C.violeta, 1.2);
    })()
    : '';
  return conGrano(flor + enmascarado(`m-gallos-cresta-${g}`, d, forma(d, C.rojo) + nube(cx + 2, cy - 12, 10, 5, C.rosaClara, 's', 0.7) + nube(cx, cy + 2, 16, 4, C.rojoQuemado, 's', 0.9)));
}

/** El cacareo que se le ahoga: rayitas que le salen del pico. */
function cacareo(): string {
  const [px, py] = G.pico;
  return Array.from({ length: 6 }, (_, i) => {
    const a = ((-64 + i * 18) * Math.PI) / 180;
    const [r0, r1] = [8, 18 + (i % 2) * 6];
    return trazo(`M${px + Math.cos(a) * r0} ${py + Math.sin(a) * r0} L${px + Math.cos(a) * r1} ${py + Math.sin(a) * r1}`, i % 2 ? C.oroClaro : C.plataClara, 2.4, 0.9);
  }).join('');
}

/** El hipo del flaco: tres burbujas que le salen del pico, del licor. */
function hipo(): string {
  const [px, py] = G.pico;
  return [[px + 4, py - 10, 4.4], [px + 10, py - 19, 3], [px + 4, py - 26, 2]].map(([x, y, r]) =>
    trazo(`M${x! - r!} ${y} a${r} ${r} 0 1 0 ${r! * 2} 0 a${r} ${r} 0 1 0 ${-r! * 2} 0`, C.plataClara, 1.1, 0.9) + nube(x! - r! * 0.4, y! - r! * 0.4, r! * 0.3, r! * 0.3, C.brillo, 'xs', 0.9)).join('');
}

/** Las plumas que vuelan en la riña, en las coordenadas de la pareja. */
function plumas(): string {
  const pluma = (x: number, y: number, giro: number, color: string, luz: string): string =>
    `<g transform="rotate(${giro} ${x} ${y})">` + forma(`M${x} ${y - 9} Q${x + 4} ${y - 2} ${x} ${y + 9} Q${x - 4} ${y - 2} ${x} ${y - 9} Z`, color) + trazo(`M${x} ${y - 8} L${x} ${y + 10}`, luz, 0.7) + `</g>`;
  return conGrano(
    pluma(-46, -214, 30, C.violeta, C.violetaClara) + pluma(-10, -236, -50, C.plata, C.brillo) + pluma(22, -206, 70, C.cobre, C.oro) +
    pluma(52, -228, -20, C.plataClara, C.plata) + pluma(-70, -180, 110, C.hondo, C.plataHonda) + pluma(70, -170, 40, C.oroClaro, C.brillo) + pluma(4, -186, -100, C.violetaClara, C.mascara),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3;
const [KX, KY] = G.comisura;
const [BX, BY] = G.barba;
const [OX, OY] = G.ojo;
const [CX, CY] = G.cresta;
const [PX, PY] = G.pico;

const piezasDe = (g: Cual): Pieza[] => [
  { nombre: `gallos-${g}-pata-1`, caja: [-38, -80, 58, 90], dibujo: pata(g, 0), densidad: D },
  { nombre: `gallos-${g}-pata-2`, caja: [-30, -78, 66, 88], dibujo: pata(g, 1), densidad: D },
  { nombre: `gallos-${g}-cola`, caja: [-126, -228, 104, 140], dibujo: cola(g), densidad: D * 0.8 },
  { nombre: `gallos-${g}-cuerpo`, caja: [-62, -136, 110, 90], dibujo: cuerpo(g), densidad: D },
  g === 'a'
    ? { nombre: 'gallos-a-ala', caja: [-16, -128, 70, 66], dibujo: ala('a'), densidad: D }
    : { nombre: 'gallos-b-ala', caja: [-56, -128, 74, 56], dibujo: ala('b'), densidad: D },
  { nombre: `gallos-${g}-cabeza`, caja: [0, -208, 78, 108], dibujo: cabeza(g), densidad: D * 1.3 },
  { nombre: `gallos-${g}-parpado`, caja: [OX - 7, OY - 7, 14, 14], dibujo: parpado(g), densidad: D * 1.6 },
  { nombre: `gallos-${g}-pico`, caja: [KX - 4, KY - 4, 28, 16], dibujo: pico(), densidad: D * 1.6 },
  { nombre: `gallos-${g}-barba`, caja: [BX - 10, BY - 6, 20, 30], dibujo: barba(g), densidad: D * 1.6 },
  { nombre: `gallos-${g}-cresta`, caja: g === 'a' ? [CX - 16, CY - 28, 44, 36] : [CX - 26, CY - 22, 46, 30], dibujo: cresta(g), densidad: D * 1.6 },
];

export const PIEZAS_GALLOS: readonly Pieza[] = [
  ...piezasDe('b'),
  ...piezasDe('a'),
  { nombre: 'gallos-botella', caja: [28, -82, 46, 52], dibujo: botella(), densidad: D * 1.3 },
  { nombre: 'gallos-cacareo', caja: [PX - 2, PY - 30, 30, 50], dibujo: cacareo(), densidad: 1.6 },
  { nombre: 'gallos-hipo', caja: [PX - 4, PY - 32, 22, 36], dibujo: hipo(), densidad: D },
  { nombre: 'gallos-plumas', caja: [-86, -252, 172, 96], dibujo: plumas(), densidad: D * 0.8 },
];

const img = imagenesDe(PIEZAS_GALLOS);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Un gallo armado, en sus coordenadas: la pareja lo pone en su lugar con `gallo-<g>`. */
function gallo(g: Cual, t: Record<string, string>, o: Record<string, string>): string {
  const extra = g === 'a' ? parte('cacareo', img('gallos-cacareo'), '', o.cacareo) : parte('hipo', img('gallos-hipo'), t.hipo, o.hipo);
  return parte(`gallo-${g}`,
    parte(`pata-${g}-1`, img(`gallos-${g}-pata-1`), t[`pata-${g}-1`]) +
    parte(`pata-${g}-2`, img(`gallos-${g}-pata-2`), t[`pata-${g}-2`]) +
    parte(`infla-${g}`,
      parte(`cola-${g}`, img(`gallos-${g}-cola`), t[`cola-${g}`]) +
      img(`gallos-${g}-cuerpo`) +
      parte(`ala-${g}`, img(`gallos-${g}-ala`) + (g === 'a' ? img('gallos-botella') : ''), t[`ala-${g}`]),
      t[`infla-${g}`]) +
    parte(`cuello-${g}`,
      img(`gallos-${g}-cabeza`) +
      parte(`parpado-${g}`, img(`gallos-${g}-parpado`), t[`parpado-${g}`]) +
      parte(`pico-${g}`, img(`gallos-${g}-pico`), t[`pico-${g}`]) +
      parte(`barba-${g}`, img(`gallos-${g}-barba`), t[`barba-${g}`]) +
      parte(`cresta-${g}`, img(`gallos-${g}-cresta`), t[`cresta-${g}`]) +
      extra,
      t[`cuello-${g}`]),
    t[`gallo-${g}`]);
}

/** Los dos armados con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    `<ellipse cx="${PAREJA.a}" cy="2" rx="50" ry="6" class="bt-gallos-sombra"/><ellipse cx="${PAREJA.b}" cy="2" rx="44" ry="5" class="bt-gallos-sombra"/>` +
    parte('tambaleo', gallo('b', t, o) + gallo('a', t, o) + parte('plumas', img('gallos-plumas'), t.plumas, o.plumas), t.tambaleo)
  );
}

/** Los gallos en un momento, sin lo que los hace tocables: para el test, el retrato y para mirarlos. */
export function gallosEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: apoyados uno en el otro, sofocados. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--gallos" data-id="los-gallos-sofocados" role="button" tabindex="0" aria-label="${nombres.get('los-gallos-sofocados') ?? 'Los gallos sofocados'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: la riña de opereta, con las plumas en el aire, en el ala del templo. */
export const RETRATO = { caja: [GALLOS.x - 104, GALLOS.piso - 134, 200, 148] as const };
function retrato(): string {
  return `<image href="/bestiario/templo-lejos.webp" x="-300" y="0" width="1500" height="640" preserveAspectRatio="none"/>` + gallosEn(RINA);
}

export const GALLOS_PERSONAJE: Personaje = {
  id: 'los-gallos-sofocados',
  region: 'el-templo',
  ancla: GALLOS.x,
  piezas: PIEZAS_GALLOS,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
