/**
 * El jocker burlón (`D-73`, vigesimocuarta vuelta), colgado de un brazo de la rama baja del árbol del gran
 * bonete.
 *
 * *"Soy un jocker burlón / de la «Estrella del Sur»"* es de *El árbol del gran bonete*, en *Último bondi a
 * Finisterre* (1998). Jocker con ck, como en la letra. Es el comodín: puede ser cualquier carta. Por eso es
 * un bufón de baraja vieja, con la cara partida como las figuras de los naipes (media pintada de blanco,
 * media de piel, con un rombo de tinta bajo el ojo), el bonete de tres puntas con su cascabel en cada una,
 * la gorguera, el traje de rombos y las calzas de dos colores, una pierna de cada. En la mano libre lleva
 * los cuatro ases, como los del panel de la tapa, y del pecho le cuelga una estrella de lata, la Estrella
 * del Sur, de una cinta. Lo del dibujo: el remiendo en la rodilla, el diente que le falta, la verruga de
 * la pera, los zapatos de punta enrulada con su cascabel, y que cuando se da vuelta como un naipe cuelga
 * de la rama con una pinza de la ropa: de un lado el dorso con la estrella y la Cruz del Sur, del otro el
 * as de picas.
 *
 * Viste las dos caras de la tapa, medidas con sharp: el rojo del pañuelo y el amarillo de la campera del
 * frente, la piel del del medio, el blanco, el corazón y la pica de los naipes del interior, el cobre de
 * las letras, la lata del remache y la lente de la cámara en los ojos.
 *
 * Coordenadas: el (0, 0) es el puño en la rama, y lo positivo es para abajo (`rig-jocker.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { BURLON, CODO, JOCKER, JOCKER_ARMADO as A, MANO, NAIPES, QUIETO, marcas, type Momento } from './rig-jocker.ts';

/** Las tintas de *Último bondi a Finisterre* (`tokens.css`). */
const C = {
  rojo: 'var(--bestia-jocker-rojo)',
  rojoClaro: 'var(--bestia-jocker-rojo-claro)',
  rojoHondo: 'var(--bestia-jocker-rojo-hondo)',
  oro: 'var(--bestia-jocker-oro)',
  oroViejo: 'var(--bestia-jocker-oro-viejo)',
  piel: 'var(--bestia-jocker-piel)',
  pielClara: 'var(--bestia-jocker-piel-clara)',
  pielHonda: 'var(--bestia-jocker-piel-honda)',
  naipe: 'var(--bestia-jocker-naipe)',
  naipeHondo: 'var(--bestia-jocker-naipe-hondo)',
  pica: 'var(--bestia-jocker-pica)',
  cobre: 'var(--bestia-jocker-cobre)',
  cobreHondo: 'var(--bestia-jocker-cobre-hondo)',
  chapa: 'var(--bestia-jocker-chapa)',
  chapaClara: 'var(--bestia-jocker-chapa-clara)',
  chapaHonda: 'var(--bestia-jocker-chapa-honda)',
  lente: 'var(--bestia-jocker-lente)',
  lenteClara: 'var(--bestia-jocker-lente-clara)',
  negro: 'var(--bestia-jocker-negro)',
};

/* ------------------------------------------------------------------
   Los palos de la baraja, la estrella y los rombos del traje
   ------------------------------------------------------------------ */

const corazon = (x: number, y: number, s: number): string =>
  `M${f(x)} ${f(y + s * 0.9)} C${f(x - s * 1.25)} ${f(y + s * 0.1)} ${f(x - s * 0.95)} ${f(y - s * 0.95)} ${f(x)} ${f(y - s * 0.35)} C${f(x + s * 0.95)} ${f(y - s * 0.95)} ${f(x + s * 1.25)} ${f(y + s * 0.1)} ${f(x)} ${f(y + s * 0.9)} Z`;
const pica = (x: number, y: number, s: number): string =>
  `M${f(x)} ${f(y - s * 0.95)} C${f(x + s * 1.25)} ${f(y - s * 0.1)} ${f(x + s * 0.95)} ${f(y + s * 0.8)} ${f(x + s * 0.06)} ${f(y + s * 0.3)} L${f(x + s * 0.42)} ${f(y + s)} L${f(x - s * 0.42)} ${f(y + s)} L${f(x - s * 0.06)} ${f(y + s * 0.3)} C${f(x - s * 0.95)} ${f(y + s * 0.8)} ${f(x - s * 1.25)} ${f(y - s * 0.1)} ${f(x)} ${f(y - s * 0.95)} Z`;
const trebol = (x: number, y: number, s: number): string =>
  elipse(x, y - s * 0.45, s * 0.42, s * 0.42) + elipse(x - s * 0.46, y + s * 0.12, s * 0.42, s * 0.42) + elipse(x + s * 0.46, y + s * 0.12, s * 0.42, s * 0.42) +
  poli([[x - s * 0.08, y], [x + s * 0.08, y], [x + s * 0.4, y + s], [x - s * 0.4, y + s]]);
const diamante = (x: number, y: number, s: number): string => poli([[x, y - s], [x + s * 0.72, y], [x, y + s], [x - s * 0.72, y]]);
const PALO = { diamante, trebol, corazon, pica } as const;
const TINTA_DEL_PALO = { diamante: C.rojo, trebol: C.pica, corazon: C.rojo, pica: C.pica } as const;

/** Una estrella de `n` puntas. */
function estrella(x: number, y: number, r: number, ri: number, n = 5, giro = -90): string {
  const pts: P[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = ((giro + (i * 180) / n) * Math.PI) / 180;
    const rr = i % 2 ? ri : r;
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
  }
  return poli(pts);
}

/** Los rombos del arlequín, alternados, en una grilla que se recorta con la silueta de quien los lleva. */
function rombos(x0: number, y0: number, x1: number, y1: number, w: number, h: number, tintas: readonly [string, string], o = 1): string {
  let s = '';
  for (let j = 0, y = y0; y < y1 + h; j++, y += h / 2) {
    for (let i = 0, x = x0 + (j % 2) * (w / 2); x < x1 + w; i++, x += w) {
      s += forma(poli([[x, y - h / 2], [x + w / 2, y], [x, y + h / 2], [x - w / 2, y]]), tintas[(i + j) % 2]!, o);
    }
  }
  return s;
}

/** Un cascabel: la bolita de bronce con su ranura, la luz arriba y la argolla. */
function cascabel(x: number, y: number, r: number): string {
  return (
    forma(elipse(x, y, r, r), C.oroViejo) +
    nube(x + r * 0.3, y + r * 0.4, r * 0.8, r * 0.6, C.cobre, 'xs', 0.8) +
    nube(x - r * 0.35, y - r * 0.4, r * 0.4, r * 0.3, C.oro, 'xs', 0.95) +
    forma(elipse(x - r * 0.4, y - r * 0.45, r * 0.18, r * 0.14), C.chapaClara, 0.9) +
    trazo(`M${f(x - r * 0.75)} ${f(y + r * 0.2)} Q${f(x)} ${f(y + r * 0.5)} ${f(x + r * 0.75)} ${f(y + r * 0.2)}`, C.cobreHondo, r * 0.22) +
    forma(elipse(x, y + r * 0.45, r * 0.18, r * 0.18), C.negro)
  );
}

/** Un puño de volados, el de las mangas: la puntilla blanca en zigzag. */
function volado(x: number, y: number, ancho: number, giro = 0): string {
  const pts: P[] = [];
  for (let i = 0; i <= 8; i++) pts.push([x - ancho / 2 + (ancho * i) / 8, y + (i % 2 ? 5 : 0)]);
  const d = `M${f(x - ancho / 2)} ${f(y - 4)} ${pts.map(([a, b]) => `L${f(a)} ${f(b)}`).join(' ')} L${f(x + ancho / 2)} ${f(y - 4)} Z`;
  return `<g transform="rotate(${f(giro)} ${f(x)} ${f(y)})">${forma(d, C.naipe)}${nube(x, y + 2, ancho / 2, 2, C.naipeHondo, 'xs', 0.9)}</g>`;
}

/* ------------------------------------------------------------------
   El puño en la rama y el brazo que cuelga
   ------------------------------------------------------------------ */

function puno(): string {
  const d = curva([[-10, -12], [4, -15], [13, -8], [12, 6], [4, 12], [-8, 11], [-13, 2]]);
  return conGrano(
    enmascarado('m-jocker-puno', d,
      forma(d, C.piel) + nube(6, 4, 8, 7, C.pielHonda, 's', 0.7) + nube(-4, -8, 7, 4, C.pielClara, 's', 0.9)) +
    // Los nudillos, por arriba de la rama, y el pulgar que la abraza de abajo.
    [-6, -1, 4, 9].map((x) => trazo(`M${x} -12 Q${x + 1.5} -7 ${x + 0.6} -2`, C.pielHonda, 1, 0.75)).join('') +
    trazo('M-10 6 Q-2 10 6 7', C.pielHonda, 1.3, 0.8) +
    volado(2, 13, 22, 4),
  );
}

function brazoColgado(): string {
  const d = curva([[-8, 14], [9, 13], [14, 34], [18, 58], [10, 72], [-6, 70], [-9, 46]]);
  return conGrano(
    enmascarado('m-jocker-brazo-colgado', d,
      forma(d, C.rojo) +
      // La manga a rayas largas: rojo y oro, como las calzas, y el abullonado del hombro.
      [-4, 4, 12].map((x, i) => forma(poli([[x, 10], [x + 4, 10], [x + 7 + i, 74], [x + 3 + i, 74]]), C.oro, 0.95)).join('') +
      nube(14, 40, 6, 30, C.rojoHondo, 'm', 0.75) + nube(-6, 36, 4, 22, C.rojoClaro, 's', 0.5) +
      nube(4, 64, 14, 8, C.negro, 'm', 0.5) + nube(2, 18, 10, 4, C.negro, 's', 0.45)) +
    trazo('M-2 30 Q4 33 12 30', C.cobreHondo, 0.8, 0.6),
  );
}

/* ------------------------------------------------------------------
   El cuerpo: el jubón de rombos, la gorguera, la estrella de lata
   ------------------------------------------------------------------ */

const CUERPO: readonly P[] = [[8, 58], [16, 82], [16, 112], [10, 140], [2, 158], [-16, 162], [-34, 158], [-44, 140], [-46, 110], [-44, 84], [-38, 64], [-16, 58]];

function cuerpo(): string {
  const d = curva(CUERPO);
  return conGrano(
    enmascarado('m-jocker-cuerpo', d,
      forma(d, C.oro) + rombos(-56, 54, 26, 168, 16, 22, [C.rojo, C.oro]) +
      // Las costuras de los rombos, cruzadas, y la panza redonda con la luz de arriba.
      Array.from({ length: 7 }, (_, i) => trazo(`M${-60 + i * 16} 54 l40 110 M${-20 + i * 16} 54 l-40 110`, C.negro, 0.7, 0.35)).join('') +
      nube(-14, 120, 22, 24, C.naipe, 'l', 0.22) + nube(10, 100, 8, 50, C.negro, 'm', 0.6) + nube(-44, 110, 8, 50, C.negro, 'm', 0.55) +
      nube(-16, 160, 34, 10, C.negro, 'm', 0.6) +
      // El cinto, flojo, con la hebilla de cobre.
      forma(`M-48 140 Q-16 150 18 136 L18 144 Q-16 158 -48 148 Z`, C.pica, 0.95) +
      forma(cajaRedonda(-22, 141, 12, 9, 2), C.oroViejo) + forma(cajaRedonda(-19, 143.5, 6, 4, 1), C.pica) +
      // Los tres pompones del medio.
      [76, 98, 120].map((y) => forma(elipse(-14, y, 3.6, 3.4), C.naipe) + nube(-13, y + 1, 2.6, 2.2, C.naipeHondo, 'xs', 0.9)).join('')),
  );
}

/** La gorguera: el cuello de volados de bufón, con un cascabelito en cada punta de adelante. */
function gorguera(): string {
  const [cx, cy] = [-18, 66];
  const pts: P[] = [];
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const r = i % 2 ? 0.62 : 1;
    pts.push([cx + Math.cos(a) * 28 * r, cy + Math.sin(a) * 10 * r]);
  }
  const d = poli(pts);
  const puntas = pts.filter((_, i) => i % 2 === 0 && Math.sin((i / 18) * Math.PI * 2) > 0.2);
  return conGrano(
    enmascarado('m-jocker-gorguera', d,
      forma(d, C.naipe) +
      pts.map(([x, y], i) => (i % 2 === 0 ? forma(poli([[cx, cy], [x, y], pts[(i + 1) % 18]!]), i % 4 ? C.rojo : C.naipe, 0.9) : '')).join('') +
      nube(cx, cy - 6, 26, 6, C.negro, 's', 0.45) + nube(cx + 10, cy + 6, 16, 4, C.naipeHondo, 's', 0.7)) +
    puntas.map(([x, y]) => cascabel(x, y + 2, 2.6)).join(''),
  );
}

function estrellaDeLata(): string {
  const [ax, ay] = A.alfiler;
  const [ex, ey] = [ax, ay + 15];
  const d = estrella(ex, ey, 11, 4.6);
  return conGrano(
    // La cinta, roja, prendida con el alfiler, y la lata abollada.
    forma(poli([[ax - 3, ay - 1], [ax + 3, ay - 1], [ax + 2.4, ey - 6], [ax - 2.4, ey - 6]]), C.rojo) +
    trazo(`M${ax} ${ay - 1} L${ax} ${ey - 6}`, C.rojoHondo, 0.8, 0.8) +
    forma(elipse(ax, ay - 1, 2, 2), C.chapa) +
    enmascarado('m-jocker-estrella', d,
      forma(d, C.chapa) + nube(ex - 3, ey - 4, 6, 4, C.chapaClara, 's', 0.9) + nube(ex + 4, ey + 4, 7, 5, C.chapaHonda, 's', 0.85) +
      trazo(`M${ex - 6} ${ey + 1} l4 2`, C.chapaHonda, 0.8, 0.8)) +
    trazo(d, C.chapaHonda, 0.7, 0.8) + forma(elipse(ex, ey, 1.6, 1.6), C.cobre),
  );
}

/** El brillo de la estrella: la cruz de luz de una lata que agarra la luna. */
function brillo(): string {
  const [ex, ey] = [A.alfiler[0] - 3, A.alfiler[1] + 11];
  return (
    nube(ex, ey, 8, 8, C.chapaClara, 'm', 0.6) +
    forma(`M${ex} ${ey - 15} L${ex + 1.2} ${ey - 1.2} L${ex + 15} ${ey} L${ex + 1.2} ${ey + 1.2} L${ex} ${ey + 15} L${ex - 1.2} ${ey + 1.2} L${ex - 15} ${ey} L${ex - 1.2} ${ey - 1.2} Z`, C.chapaClara, 0.95) +
    forma(`M${ex - 6} ${ey - 6} L${ex} ${ey - 0.8} L${ex + 6} ${ey - 6} L${ex + 0.8} ${ey} L${ex + 6} ${ey + 6} L${ex} ${ey + 0.8} L${ex - 6} ${ey + 6} L${ex - 0.8} ${ey} Z`, C.chapaClara, 0.6)
  );
}

/* ------------------------------------------------------------------
   Las piernas: calzas de dos colores, el remiendo, los zapatos enrulados
   ------------------------------------------------------------------ */

function muslo(n: 0 | 1): string {
  const [hx, hy] = A.caderas[n];
  const ky = A.rodillas[n][1];
  const d = curva([[hx - 9, hy - 6], [hx + 9, hy - 6], [hx + 7, ky - 6], [hx + 5, ky + 6], [hx - 5, ky + 6], [hx - 7, ky - 6]]);
  const [tinta, honda, clara] = n === 0 ? [C.rojo, C.rojoHondo, C.rojoClaro] : [C.oro, C.oroViejo, C.naipe];
  // El remiendo en la rodilla de la pierna de oro: un cuadrado de paño rojo, cosido a puntadas.
  const remiendo = n === 1 ? forma(poli([[hx - 6, ky - 8], [hx + 5, ky - 9], [hx + 6, ky + 1], [hx - 5, ky + 2]]), C.rojoHondo) + trazo(`M${hx - 6} ${ky - 9} l11 -1 M${hx - 5} ${ky + 3} l11 -1`, C.naipe, 0.6, 0.9) + [-4, -1, 2].map((x) => trazo(`M${hx + x} ${ky - 11} l0.6 3 M${hx + x} ${ky + 1} l0.6 3`, C.naipe, 0.5, 0.9)).join('') : '';
  return conGrano(enmascarado(`m-jocker-muslo-${n + 1}`, d, forma(d, tinta) + nube(hx + 6, (hy + ky) / 2, 4, 24, honda, 's', 0.9) + nube(hx - 4, (hy + ky) / 2, 2, 18, clara, 's', 0.45) + nube(hx, hy - 4, 10, 4, C.negro, 's', 0.55)) + remiendo);
}

function canilla(n: 0 | 1): string {
  const [kx, ky] = A.rodillas[n];
  const tobillo = ky + A.canilla;
  const d = curva([[kx - 6, ky - 4], [kx + 6, ky - 4], [kx + 4, tobillo - 4], [kx + 4, tobillo + 2], [kx - 4, tobillo + 2], [kx - 5, tobillo - 4]]);
  const [tinta, honda] = n === 0 ? [C.rojo, C.rojoHondo] : [C.oro, C.oroViejo];
  // El zapato de punta enrulada, para afuera, con su cascabel: el de la pierna 1 apunta al tronco.
  const s = n === 0 ? 1 : -1;
  const X = (x: number): number => kx + x * s;
  const zapato = `M${X(-6)} ${tobillo - 2} Q${X(-7)} ${tobillo + 8} ${X(2)} ${tobillo + 9} Q${X(18)} ${tobillo + 10} ${X(24)} ${tobillo + 4} Q${X(28)} ${tobillo - 2} ${X(24)} ${tobillo - 6} Q${X(21)} ${tobillo - 8} ${X(20)} ${tobillo - 4} Q${X(20)} ${tobillo + 1} ${X(14)} ${tobillo + 1} Q${X(6)} ${tobillo} ${X(5)} ${tobillo - 3} Z`;
  return conGrano(
    enmascarado(`m-jocker-canilla-${n + 1}`, d, forma(d, tinta) + nube(kx + 4, ky + 20, 3, 20, honda, 's', 0.9) + nube(kx - 3, ky + 16, 2, 14, C.naipe, 's', 0.3)) +
    enmascarado(`m-jocker-zapato-${n + 1}`, zapato, forma(zapato, C.pica) + nube(X(10), tobillo + 6, 10, 3, C.negro, 's', 0.8) + nube(X(4), tobillo - 1, 6, 2, C.lente, 's', 0.45)) +
    trazo(`M${X(-3)} ${tobillo} Q${X(6)} ${tobillo + 3} ${X(14)} ${tobillo + 1}`, C.cobre, 0.7, 0.7) +
    cascabel(X(21.5), tobillo - 7.5, 3),
  );
}

/* ------------------------------------------------------------------
   El brazo libre, la mano y los naipes
   ------------------------------------------------------------------ */

function brazoLibre(): string {
  const [sx, sy] = A.hombros[1];
  const [ex, ey] = CODO;
  const d = curva([[sx - 10, sy - 6], [sx + 9, sy - 6], [sx + 9, sy + 14], [ex + 7, ey - 2], [ex + 4, ey + 6], [ex - 6, ey + 6], [ex - 8, ey - 4], [sx - 11, sy + 14]]);
  return conGrano(
    enmascarado('m-jocker-brazo', d,
      forma(d, C.oro) + [-6, 2].map((x) => forma(poli([[sx + x, sy - 8], [sx + x + 4, sy - 8], [ex + x + 2, ey + 8], [ex + x - 2, ey + 8]]), C.rojo, 0.95)).join('') +
      nube(sx - 8, (sy + ey) / 2, 4, 22, C.negro, 's', 0.5) + nube(sx + 6, sy + 6, 6, 6, C.naipe, 's', 0.25)),
  );
}

function antebrazo(): string {
  const [ex, ey] = CODO;
  const [mx, my] = MANO;
  const d = curva([[ex - 7, ey - 4], [ex + 7, ey - 4], [mx + 5, my - 8], [mx - 5, my - 8]]);
  return conGrano(
    enmascarado('m-jocker-antebrazo', d, forma(d, C.rojo) + forma(poli([[ex - 1, ey - 6], [ex + 3, ey - 6], [mx + 2, my - 6], [mx - 1, my - 6]]), C.oro, 0.95) + nube(ex + 5, (ey + my) / 2, 3, 16, C.rojoHondo, 's', 0.9)) +
    volado(mx, my - 8, 18),
  );
}

/** La mano libre: el pulgar va adelante de los naipes, los dedos atrás. */
function manoLibre(): string {
  const [mx, my] = MANO;
  const palma = curva([[mx - 6, my - 4], [mx + 6, my - 4], [mx + 7, my + 4], [mx + 3, my + 9], [mx - 4, my + 8], [mx - 7, my + 3]]);
  return conGrano(
    enmascarado('m-jocker-mano', palma, forma(palma, C.piel) + nube(mx + 3, my + 4, 4, 4, C.pielHonda, 's', 0.8) + nube(mx - 3, my - 1, 3, 2, C.pielClara, 's', 0.9)) +
    // El pulgar, que aprieta el mazo.
    forma(curva([[mx - 5, my - 2], [mx - 7, my - 8], [mx - 4, my - 12], [mx - 1, my - 9], [mx - 1, my - 2]]), C.piel) +
    trazo(`M${mx - 5} ${my - 10} q2 -1 3 1`, C.pielHonda, 0.7, 0.8) +
    [0, 3].map((dx) => trazo(`M${mx + dx} ${my + 1} q1 3 0 6`, C.pielHonda, 0.7, 0.7)).join(''),
  );
}

/** Un as, chico, parado arriba de la mano: el palo en el medio y en las dos puntas, sin letras. */
const NAIPE = { ancho: 30, alto: 44 } as const;
function naipe(palo: keyof typeof PALO): string {
  const [mx, my] = MANO;
  const [x, y] = [mx - NAIPE.ancho / 2, my - NAIPE.alto - 2];
  const d = cajaRedonda(x, y, NAIPE.ancho, NAIPE.alto, 3);
  const tinta = TINTA_DEL_PALO[palo];
  const dib = PALO[palo];
  return conGrano(
    enmascarado(`m-jocker-naipe-${palo}`, d,
      forma(d, C.naipe) + nube(x + 22, y + 34, 12, 14, C.naipeHondo, 'm', 0.85) +
      forma(dib(mx, y + NAIPE.alto / 2, 8), tinta) + nube(mx - 2, y + NAIPE.alto / 2 - 3, 3, 3, C.naipe, 'xs', 0.35) +
      forma(dib(x + 5, y + 6, 2.6), tinta) + forma(dib(x + NAIPE.ancho - 5, y + NAIPE.alto - 6, 2.6), tinta) +
      trazo(cajaRedonda(x + 2.2, y + 2.2, NAIPE.ancho - 4.4, NAIPE.alto - 4.4, 2), C.naipeHondo, 0.6, 0.8)) +
    trazo(d, C.cobreHondo, 0.8, 0.7),
  );
}

/* ------------------------------------------------------------------
   La cabeza: la cara partida, los ojos, las bocas, el bonete
   ------------------------------------------------------------------ */

const CABEZA: readonly P[] = [[-30, 14], [-12, 18], [-6, 32], [-8, 50], [-16, 64], [-26, 72], [-36, 70], [-46, 60], [-52, 44], [-50, 26], [-42, 16]];

function cabeza(): string {
  const d = curva(CABEZA);
  const [ox, oy] = A.oreja;
  const oreja = curva([[ox + 4, oy - 8], [ox - 5, oy - 9], [ox - 7, oy + 2], [ox - 2, oy + 9], [ox + 4, oy + 6]]);
  const [n1, n2] = A.ojos;
  const r = A.radioOjo;
  const blanco = (x: number, y: number): string => forma(elipse(x, y, r, r * 0.86), C.naipe) + nube(x + 1, y + 2, r * 0.8, r * 0.4, C.naipeHondo, 'xs', 0.8);
  // La nariz larga, de punta, que se le va para el costado de la pintura.
  const [nx, ny] = A.nariz;
  const nariz = curva([[nx + 4, ny - 8], [nx + 3, ny + 2], [nx - 6, ny + 10], [nx - 14, ny + 12], [nx - 10, ny + 6], [nx - 2, ny - 6]]);
  return conGrano(
    // La oreja de afuera, de donde salen los naipes, y el pelo de tinta que se escapa del bonete.
    enmascarado('m-jocker-oreja', oreja, forma(oreja, C.piel) + nube(ox - 1, oy + 1, 3, 5, C.pielHonda, 's', 0.9) + nube(ox - 4, oy - 4, 2, 3, C.rojoClaro, 'xs', 0.5)) +
    forma(`M${-50} 22 Q${-62} 26 ${-60} 38 Q${-56} 30 ${-48} 32 Z M-12 20 Q-2 24 -2 34 Q-6 28 -10 28 Z`, C.pica) +
    enmascarado('m-jocker-cabeza', d,
      forma(d, C.piel) +
      // La mitad de la izquierda, pintada de blanco, como la figura de un naipe; el borde, cortado derecho.
      forma(poli([[-70, 0], [-29, 0], [-27, 46], [-24, 90], [-70, 90]]), C.naipe) +
      nube(-42, 30, 8, 10, C.naipe, 's', 0.6) + nube(-14, 34, 8, 16, C.pielClara, 's', 0.7) +
      nube(-8, 52, 6, 16, C.pielHonda, 'm', 0.8) + nube(-30, 70, 16, 6, C.pielHonda, 'm', 0.7) +
      nube(-48, 52, 6, 14, C.naipeHondo, 'm', 0.8) +
      // El cachete colorado del lado de la piel, y el rombo de tinta bajo el ojo pintado.
      nube(-13, 52, 5, 4, C.rojoClaro, 's', 0.7) +
      forma(diamante(n1[0], n1[1] + 13, 4.6), C.pica) + nube(n1[0] - 1, n1[1] + 12, 1.2, 2, C.lente, 'xs', 0.6) +
      // Las cejas burlonas, una más alta que la otra, y las patas de gallo de reírse.
      trazo(`M${n1[0] - 8} ${n1[1] - 9} Q${n1[0] - 2} ${n1[1] - 14} ${n1[0] + 6} ${n1[1] - 10}`, C.pica, 2) +
      trazo(`M${n2[0] - 6} ${n2[1] - 11} Q${n2[0]} ${n2[1] - 18} ${n2[0] + 8} ${n2[1] - 12}`, C.pielHonda, 2.2) +
      trazo(`M${n2[0] + 8} ${n2[1] + 2} l4 -1 M${n2[0] + 8} ${n2[1] + 5} l4 1`, C.pielHonda, 0.7, 0.8) +
      // La pera, con la verruga.
      forma(elipse(-34, 68, 1.6, 1.4), C.pielHonda) + trazo('M-34 66.6 l-0.6 -2', C.pica, 0.4, 0.8) +
      blanco(n1[0], n1[1]) + blanco(n2[0], n2[1])) +
    enmascarado('m-jocker-nariz', nariz, forma(nariz, C.piel) + nube(nx - 8, ny + 8, 5, 3, C.rojoClaro, 's', 0.75) + nube(nx + 1, ny, 2, 6, C.pielClara, 'xs', 0.8) + nube(nx - 6, ny + 11, 6, 2, C.pielHonda, 's', 0.7)),
  );
}

function pupila(n: 0 | 1): string {
  const [x, y] = A.ojos[n];
  return forma(elipse(x, y, 3.6, 3.6), C.lente) + nube(x + 0.6, y + 1, 2.4, 2, C.lenteClara, 'xs', 0.7) + forma(elipse(x, y, 1.9, 1.9), C.pica) + forma(elipse(x - 1.2, y - 1.4, 0.8, 0.7), C.chapaClara);
}

/** El párpado entero, cerrado: la isla lo baja desde arriba del ojo. El del ojo pintado es blanco. */
function parpado(n: 0 | 1): string {
  const [x, y] = A.ojos[n];
  const r = A.radioOjo;
  const d = elipse(x, y, r + 1.2, r * 0.86 + 1.2);
  const [tinta, honda] = n === 0 ? [C.naipe, C.naipeHondo] : [C.piel, C.pielHonda];
  return conGrano(enmascarado(`m-jocker-parpado-${n + 1}`, d, forma(d, tinta) + nube(x, y - r, r, 3, honda, 's', 0.8)) + trazo(`M${x - r} ${y + r * 0.6} Q${x} ${y + r + 1.6} ${x + r} ${y + r * 0.6}`, C.pica, 1.2));
}

/** La sonrisa de costado: un tajo que sube para el lado de la piel, con el hoyuelo. */
function bocaCerrada(): string {
  const [bx, by] = A.boca;
  return (
    forma(`M${bx - 13} ${by + 2} Q${bx - 2} ${by + 7} ${bx + 12} ${by - 5} Q${bx + 2} ${by + 3} ${bx - 13} ${by + 2} Z`, C.rojoHondo) +
    trazo(`M${bx - 13} ${by + 2} Q${bx - 2} ${by + 6} ${bx + 12} ${by - 5}`, C.pica, 1.4) +
    trazo(`M${bx + 13} ${by - 7} q2 2 0 4`, C.pielHonda, 1, 0.8) + nube(bx - 1, by + 7, 7, 2, C.pielHonda, 's', 0.5)
  );
}

/** La carcajada: la boca de par en par, los dientes con uno que falta, y la lengua afuera. */
function bocaAbierta(): string {
  const [bx, by] = A.boca;
  const d = `M${bx - 13} ${by - 4} Q${bx} ${by - 1} ${bx + 12} ${by - 8} Q${bx + 10} ${by + 12} ${bx - 2} ${by + 14} Q${bx - 12} ${by + 12} ${bx - 13} ${by - 4} Z`;
  const dientes = [0, 1, 2, 3, 4].filter((i) => i !== 2).map((i) => forma(cajaRedonda(bx - 10 + i * 4.6, by - 4.4 - i * 0.7, 3.8, 3.6, 0.8), C.naipe)).join('');
  const lengua = `M${bx - 9} ${by + 6} Q${bx - 2} ${by + 3} ${bx + 3} ${by + 7} Q${bx + 2} ${by + 20} ${bx - 6} ${by + 21} Q${bx - 11} ${by + 18} ${bx - 9} ${by + 6} Z`;
  return conGrano(
    enmascarado('m-jocker-boca', d, forma(d, C.pica) + nube(bx, by + 6, 8, 4, C.rojoHondo, 's', 0.8) + dientes) +
    trazo(d, C.rojoHondo, 1.2) +
    enmascarado('m-jocker-lengua', lengua, forma(lengua, C.rojo) + nube(bx - 4, by + 10, 3, 6, C.rojoClaro, 's', 0.8) + trazo(`M${bx - 3} ${by + 7} l-1 10`, C.rojoHondo, 0.8, 0.8)),
  );
}

/** La vincha del bonete, de rombos con remaches, y el casquete que tapa la cabeza. */
function bonete(): string {
  const d = `M-56 30 Q-52 4 -30 4 Q-8 4 -4 26 Q-8 32 -14 28 Q-30 20 -48 30 Q-52 34 -56 30 Z`;
  const vincha = `M-56 28 Q-30 14 -4 24 L-6 32 Q-30 22 -54 36 Z`;
  return conGrano(
    enmascarado('m-jocker-casquete', d, forma(d, C.rojo) + forma(poli([[-30, 0], [-4, 0], [-4, 34], [-30, 34]]), C.pica, 0.95) + nube(-40, 12, 10, 6, C.rojoClaro, 's', 0.5) + nube(-14, 16, 6, 8, C.negro, 's', 0.5)) +
    enmascarado('m-jocker-vincha', vincha, forma(vincha, C.oro) + rombos(-60, 14, -2, 38, 8, 10, [C.oro, C.rojo]) + nube(-30, 30, 26, 3, C.negro, 's', 0.5)) +
    [-50, -38, -26, -14].map((x, i) => forma(elipse(x, 30 - i * 2 + (i === 3 ? 0 : 0), 1.4, 1.4), C.cobre) + forma(elipse(x - 0.4, 29.4 - i * 2, 0.5, 0.5), C.oro)).join(''),
  );
}

/** Una punta del bonete, blanda, de su base en la vincha a su cascabel. */
function punta(i: 0 | 1 | 2): string {
  const [bx, by] = A.puntas[i];
  const [cx, cy] = A.cascabeles[i];
  const tinta = [C.rojo, C.pica, C.oro][i]!;
  const honda = [C.rojoHondo, C.negro, C.oroViejo][i]!;
  const clara = [C.rojoClaro, C.lente, C.naipe][i]!;
  // La curva de la punta: sale ancha de la vincha y se dobla flojita hasta el cascabel.
  const [mx, my] = [(bx + cx) / 2 + (i === 0 ? 2 : i === 1 ? -10 : 8), (by + cy) / 2 + (i === 0 ? -14 : -4)];
  const nx = -(cy - by);
  const ny = cx - bx;
  const l = Math.hypot(nx, ny);
  const a = 9;
  const d = `M${f(bx + (nx / l) * a)} ${f(by + (ny / l) * a)} Q${f(mx + (nx / l) * 5)} ${f(my + (ny / l) * 5)} ${f(cx)} ${f(cy)} Q${f(mx - (nx / l) * 5)} ${f(my - (ny / l) * 5)} ${f(bx - (nx / l) * a)} ${f(by - (ny / l) * a)} Z`;
  return conGrano(
    enmascarado(`m-jocker-punta-${i + 1}`, d, forma(d, tinta) + nube(mx + (nx / l) * 4, my + (ny / l) * 4, 6, 6, honda, 's', 0.9) + nube(mx - (nx / l) * 3, my - (ny / l) * 3, 4, 4, clara, 's', 0.55)) +
    trazo(`M${f(bx)} ${f(by)} Q${f(mx)} ${f(my)} ${f(cx)} ${f(cy)}`, honda, 0.8, 0.6) +
    cascabel(cx, cy, 5.2),
  );
}

/** El tilín: las rayitas que saltan de cada cascabel cuando suena. */
function tilin(): string {
  return A.cascabeles.map(([x, y], j) => Array.from({ length: 5 }, (_, i) => {
    const a = -Math.PI * 0.9 + (i / 4) * Math.PI * 0.8 + j * 0.3;
    const [r0, r1] = [9, 14 + (i % 2) * 4];
    return trazo(`M${f(x + Math.cos(a) * r0)} ${f(y + Math.sin(a) * r0)} L${f(x + Math.cos(a) * r1)} ${f(y + Math.sin(a) * r1)}`, i % 2 ? C.oro : C.naipe, 1.6, 0.9);
  }).join('')).join('');
}

/* ------------------------------------------------------------------
   Los naipes grandes: cuando se da vuelta, cuelga de la rama con una pinza
   ------------------------------------------------------------------ */

function pinza(): string {
  const d = poli([[-6, -14], [6, -14], [5, 24], [-5, 24]]);
  return conGrano(
    enmascarado('m-jocker-pinza', d, forma(d, C.oroViejo) + nube(3, 6, 3, 18, C.cobre, 's', 0.9) + nube(-3, 0, 1.6, 12, C.naipe, 's', 0.4)) +
    trazo('M0 -14 L0 24', C.cobreHondo, 0.8, 0.8) +
    // El resorte de alambre.
    `<ellipse cx="0" cy="6" rx="7" ry="3" fill="none" stroke="${C.chapa}" stroke-width="1.4"/>` + forma(elipse(-6.4, 6, 1.2, 1.2), C.chapaHonda),
  );
}

function naipeGrande(cual: 'dorso' | 'as'): string {
  const [x, y, w, h] = A.naipe;
  const d = cajaRedonda(x, y, w, h, 7);
  const [cx, cy] = [x + w / 2, y + h / 2];
  const adentro =
    cual === 'dorso'
      ? // El dorso: el campo rojo con la reja de rombos de oro, la estrella de lata en el medio y la Cruz del Sur.
        forma(cajaRedonda(x + 7, y + 7, w - 14, h - 14, 4), C.rojo) +
        rombos(x, y, x + w, y + h, 14, 18, [C.rojo, C.rojoHondo], 0.9) +
        Array.from({ length: 12 }, (_, i) => trazo(`M${x - 40 + i * 14} ${y} l${h * 0.39} ${h} M${x + 40 + i * 14 - 40} ${y} l${-h * 0.39} ${h}`, C.oro, 0.8, 0.6)).join('') +
        nube(cx, cy, 30, 30, C.pica, 'm', 0.55) +
        enmascarado('m-jocker-dorso-estrella', estrella(cx, cy - 4, 26, 11),
          forma(estrella(cx, cy - 4, 26, 11), C.chapa) + nube(cx - 8, cy - 14, 12, 10, C.chapaClara, 'm', 0.85) + nube(cx + 10, cy + 8, 14, 10, C.chapaHonda, 'm', 0.85)) +
        trazo(estrella(cx, cy - 4, 26, 11), C.chapaHonda, 1, 0.8) + forma(elipse(cx, cy - 4, 3, 3), C.cobre) +
        [[cx + 22, cy + 34, 3.4], [cx + 30, cy + 46, 2.8], [cx + 14, cy + 48, 3], [cx + 24, cy + 58, 3.6], [cx + 32, cy + 56, 1.6]].map(([sx, sy, r]) => forma(estrella(sx!, sy!, r!, r! * 0.42), C.naipe)).join('') +
        trazo(cajaRedonda(x + 7, y + 7, w - 14, h - 14, 4), C.oro, 2)
      : // El as de picas: la pica grande con el anillo de oro, y las dos chicas en las puntas.
        nube(cx + 20, cy + 30, 40, 50, C.naipeHondo, 'l', 0.8) +
        `<ellipse cx="${cx}" cy="${cy}" rx="34" ry="34" fill="none" stroke="${C.oroViejo}" stroke-width="2.4"/>` +
        `<ellipse cx="${cx}" cy="${cy}" rx="29" ry="29" fill="none" stroke="${C.rojo}" stroke-width="0.8" opacity="0.8"/>` +
        enmascarado('m-jocker-as-pica', pica(cx, cy, 24), forma(pica(cx, cy, 24), C.pica) + nube(cx - 8, cy - 8, 6, 8, C.lente, 's', 0.5)) +
        forma(estrella(cx, cy - 2, 7, 3), C.oro) +
        forma(pica(x + 11, y + 15, 6), C.pica) + forma(pica(x + w - 11, y + h - 15, 6), C.pica);
  return conGrano(
    enmascarado(`m-jocker-${cual}`, d, forma(d, C.naipe) + adentro + nube(x + w - 6, cy, 6, h / 2, C.naipeHondo, 'm', 0.7)) +
    trazo(d, C.cobreHondo, 1.2, 0.8) +
    pinza(),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;
const [SX, SY] = A.hombros[1];
const [EX, EY] = CODO;
const [MX, MY] = MANO;

export const PIEZAS_JOCKER: readonly Pieza[] = [
  { nombre: 'jocker-muslo-1', caja: [A.caderas[0][0] - 12, A.caderas[0][1] - 10, 24, 62], dibujo: muslo(0), densidad: D },
  { nombre: 'jocker-muslo-2', caja: [A.caderas[1][0] - 12, A.caderas[1][1] - 10, 24, 62], dibujo: muslo(1), densidad: D },
  { nombre: 'jocker-canilla-1', caja: [A.rodillas[0][0] - 12, A.rodillas[0][1] - 8, 44, 62], dibujo: canilla(0), densidad: D },
  { nombre: 'jocker-canilla-2', caja: [A.rodillas[1][0] - 32, A.rodillas[1][1] - 8, 44, 62], dibujo: canilla(1), densidad: D },
  { nombre: 'jocker-brazo-colgado', caja: [-14, 6, 36, 72], dibujo: brazoColgado(), densidad: D },
  { nombre: 'jocker-cuerpo', caja: [-50, 54, 70, 112], dibujo: cuerpo(), densidad: D },
  { nombre: 'jocker-gorguera', caja: [-54, 50, 76, 32], dibujo: gorguera(), densidad: D },
  { nombre: 'jocker-estrella', caja: [A.alfiler[0] - 14, A.alfiler[1] - 5, 28, 34], dibujo: estrellaDeLata(), densidad: D * 1.4 },
  { nombre: 'jocker-brillo', caja: [A.alfiler[0] - 20, A.alfiler[1] - 6, 34, 34], dibujo: brillo(), densidad: 1.6 },
  { nombre: 'jocker-brazo', caja: [SX - 14, SY - 10, 28, EY - SY + 20], dibujo: brazoLibre(), densidad: D },
  { nombre: 'jocker-antebrazo', caja: [EX - 12, EY - 8, 24, MY - EY + 10], dibujo: antebrazo(), densidad: D },
  ...NAIPES.map((palo) => ({ nombre: `jocker-naipe-${palo}`, caja: [MX - 17, MY - 48, 34, 48] as const, dibujo: naipe(palo), densidad: D * 1.4 })),
  { nombre: 'jocker-mano', caja: [MX - 10, MY - 14, 20, 26], dibujo: manoLibre(), densidad: D * 1.4 },
  ...([0, 1, 2] as const).map((i) => {
    const [bx, by] = A.puntas[i];
    const [cx, cy] = A.cascabeles[i];
    const [x0, y0] = [Math.min(bx, cx) - 14, Math.min(by, cy) - 22];
    return { nombre: `jocker-punta-${i + 1}`, caja: [x0, y0, Math.max(bx, cx) + 14 - x0, Math.max(by, cy) + 14 - y0] as const, dibujo: punta(i), densidad: D };
  }),
  { nombre: 'jocker-cabeza', caja: [-64, 8, 62, 68], dibujo: cabeza(), densidad: D * 1.3 },
  ...([0, 1] as const).flatMap((n) => [
    { nombre: `jocker-pupila-${n + 1}`, caja: [A.ojos[n][0] - 5, A.ojos[n][1] - 5, 10, 10] as const, dibujo: pupila(n), densidad: D * 1.6 },
    { nombre: `jocker-parpado-${n + 1}`, caja: [A.ojos[n][0] - 9, A.ojos[n][1] - 9, 18, 18] as const, dibujo: parpado(n), densidad: D * 1.4 },
  ]),
  { nombre: 'jocker-boca-cerrada', caja: [A.boca[0] - 16, A.boca[1] - 10, 32, 20], dibujo: bocaCerrada(), densidad: D * 1.4 },
  { nombre: 'jocker-boca-abierta', caja: [A.boca[0] - 16, A.boca[1] - 12, 32, 36], dibujo: bocaAbierta(), densidad: D * 1.4 },
  { nombre: 'jocker-bonete', caja: [-60, 0, 60, 40], dibujo: bonete(), densidad: D },
  { nombre: 'jocker-tilin', caja: [-102, -42, 122, 90], dibujo: tilin(), densidad: 1.4 },
  { nombre: 'jocker-puno', caja: [-16, -18, 32, 38], dibujo: puno(), densidad: D * 1.4 },
  { nombre: 'jocker-dorso', caja: [A.naipe[0] - 4, -16, A.naipe[2] + 8, A.naipe[1] + A.naipe[3] + 20], dibujo: naipeGrande('dorso'), densidad: 1.8 },
  { nombre: 'jocker-as', caja: [A.naipe[0] - 4, -16, A.naipe[2] + 8, A.naipe[1] + A.naipe[3] + 20], dibujo: naipeGrande('as'), densidad: 1.8 },
];

const img = imagenesDe(PIEZAS_JOCKER);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El jocker armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const pierna = (n: 1 | 2): string => parte(`muslo-${n}`, img(`jocker-muslo-${n}`) + parte(`canilla-${n}`, img(`jocker-canilla-${n}`), t[`canilla-${n}`]), t[`muslo-${n}`]);
  return parte('hamaca',
    parte('vuelta',
      parte('jocker',
        pierna(2) +
        img('jocker-brazo-colgado') +
        parte('pecho', img('jocker-cuerpo') + img('jocker-gorguera') + parte('estrella', img('jocker-estrella') + parte('brillo', img('jocker-brillo'), '', o.brillo), t.estrella), t.pecho) +
        pierna(1) +
        parte('cabeza',
          parte('punta-3', img('jocker-punta-3'), t['punta-3']) +
          parte('punta-1', img('jocker-punta-1'), t['punta-1']) +
          parte('punta-2', img('jocker-punta-2'), t['punta-2']) +
          img('jocker-cabeza') +
          parte('pupila-1', img('jocker-pupila-1'), t['pupila-1']) +
          parte('pupila-2', img('jocker-pupila-2'), t['pupila-2']) +
          parte('parpado-1', img('jocker-parpado-1'), t['parpado-1']) +
          parte('parpado-2', img('jocker-parpado-2'), t['parpado-2']) +
          parte('boca-cerrada', img('jocker-boca-cerrada'), '', o['boca-cerrada']) +
          parte('boca-abierta', img('jocker-boca-abierta'), t['boca-abierta'], o['boca-abierta']) +
          img('jocker-bonete') +
          parte('tilin', img('jocker-tilin'), '', o.tilin),
          t.cabeza) +
        parte('brazo',
          img('jocker-brazo') +
          parte('antebrazo',
            img('jocker-antebrazo') +
            parte('mazo', NAIPES.map((palo) => parte(`naipe-${palo}`, img(`jocker-naipe-${palo}`), t[`naipe-${palo}`])).join(''), t.mazo) +
            parte('oreja', img('jocker-naipe-pica'), t.oreja, o.oreja) +
            img('jocker-mano'),
            t.antebrazo),
          t.brazo) +
        img('jocker-puno'),
        '', o.jocker) +
      parte('dorso', img('jocker-dorso'), '', o.dorso) +
      parte('as', img('jocker-as'), '', o.as),
      t.vuelta),
    t.hamaca);
}

/** El jocker en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function jockerEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: colgado de un brazo, con el mazo cerrado y la sonrisa de costado. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--jocker" data-id="el-jocker-burlon" role="button" tabindex="0" aria-label="${nombres.get('el-jocker-burlon') ?? 'El jocker burlón'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: la carcajada, el abanico abierto y la estrella brillando. */
export const RETRATO = { caja: [JOCKER.x - 76, JOCKER.rama - 34, 130, 160] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('arbol-lejos') + fondo('arbol-piso') + jockerEn(BURLON);
}

export const JOCKER_PERSONAJE: Personaje = {
  id: 'el-jocker-burlon',
  region: 'el-arbol',
  ancla: JOCKER.ancla,
  piezas: PIEZAS_JOCKER,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
