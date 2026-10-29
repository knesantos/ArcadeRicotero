/**
 * La princesita sapito (`D-73`, vigesimocuarta vuelta), sentada en un trono de nieve de Cybersiberia.
 *
 * *"Su princesita, ay, se transformó en sapito"* es de *Las increíbles andanzas del Capitán Buscapina en
 * Cybersiberia*, en *Último bondi a Finisterre* (1998). El cuento al revés: el beso no la sacó de sapo, la
 * metió. Le quedó lo que no se cae con el hechizo. Una corona chica de lata, torcida, que no le entra en la
 * cabeza; un jirón de tul rosa atado a la cintura, roto; un zapatito de cristal que solo le calza en la punta
 * de los dedos, con el taco al aire; las pestañas postizas, el colorete en los cachetes y la boca pintada,
 * corrida. Lo demás es sapo: verrugas, las glándulas detrás de los ojos, la panza granulada, la garganta que
 * se infla. Se sentó en un trono que se hizo con la nieve apisonada, con dos bolitas de adorno y un corazón
 * tallado en el respaldo, que casi no se ve porque lo tapa ella.
 *
 * Viste el interior de *Último bondi*, medido con sharp: el cuero es el bronce verde de la chapa de
 * PSICONAUTAS, las verrugas la piedra del panel de los naipes, la boca, el colorete y el tul el corazón del
 * as, lo blanco el naipe, y el zapatito la lente de la cámara. La corona es el amarillo de la campera del de
 * la derecha, en el frente.
 *
 * Coordenadas: el (0, 0) es donde se sienta, y mira de frente (`rig-sapito.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { BESO, QUIETO, SAPITO, SAPITO_ARMADO as A, marcas, type Momento } from './rig-sapito.ts';

/** Las tintas de *Último bondi* (`tokens.css`). */
const C = {
  verde: 'var(--bestia-sapito-verde)',
  verdeHondo: 'var(--bestia-sapito-verde-hondo)',
  verdeClaro: 'var(--bestia-sapito-verde-claro)',
  piedra: 'var(--bestia-sapito-piedra)',
  oxido: 'var(--bestia-sapito-oxido)',
  oro: 'var(--bestia-sapito-oro)',
  oroClaro: 'var(--bestia-sapito-oro-claro)',
  rojo: 'var(--bestia-sapito-rojo)',
  tul: 'var(--bestia-sapito-tul)',
  tulClaro: 'var(--bestia-sapito-tul-claro)',
  naipe: 'var(--bestia-sapito-naipe)',
  lente: 'var(--bestia-sapito-lente)',
  lenteClaro: 'var(--bestia-sapito-lente-claro)',
  negro: 'var(--bestia-sapito-negro)',
};

/** Un azar con semilla (mulberry32): las verrugas caen siempre en el mismo lugar. */
function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const dentroDe = (pts: readonly P[]) => (x: number, y: number): boolean => {
  let adentro = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]!;
    const [xj, yj] = pts[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) adentro = !adentro;
  }
  return adentro;
};

/** Siembra `n` cosas adentro de una forma. */
const sembrar = (semilla: number, n: number, x0: number, y0: number, w: number, h: number, dentro: (x: number, y: number) => boolean, pinta: (x: number, y: number, r: () => number) => string): string => {
  const r = azar(semilla);
  let s = '';
  for (let i = 0, puestas = 0; i < n * 8 && puestas < n; i++) {
    const x = x0 + r() * w;
    const y = y0 + r() * h;
    if (!dentro(x, y)) continue;
    s += pinta(x, y, r);
    puestas++;
  }
  return s;
};

/** Una verruga: el grano con su luz arriba y su sombra abajo. */
const verruga = (x: number, y: number, s: number): string =>
  forma(elipse(x, y + s * 0.3, s, s * 0.8), C.verdeHondo, 0.7) + forma(elipse(x, y, s * 0.9, s * 0.75), C.piedra) + forma(elipse(x - s * 0.3, y - s * 0.3, s * 0.35, s * 0.28), C.verdeClaro, 0.8);

/** Una chispa de cuatro puntas, de bordes cóncavos. */
const estrella = (x: number, y: number, s: number): string =>
  `M${f(x)} ${f(y - s)} Q${f(x)} ${f(y)} ${f(x + s * 0.7)} ${f(y)} Q${f(x)} ${f(y)} ${f(x)} ${f(y + s)} Q${f(x)} ${f(y)} ${f(x - s * 0.7)} ${f(y)} Q${f(x)} ${f(y)} ${f(x)} ${f(y - s)} Z`;

const espejo = (pts: readonly P[]): P[] => pts.map(([x, y]) => [-x, y] as P);

/* ------------------------------------------------------------------
   El trono de nieve apisonada
   ------------------------------------------------------------------ */

const RESPALDO: readonly P[] = [[-64, 2], [-66, -40], [-64, -76], [-52, -98], [-28, -110], [0, -113], [28, -110], [52, -98], [64, -76], [66, -40], [64, 2]];

function trono(): string {
  const d = curva(RESPALDO);
  // El corazón tallado en el respaldo: la nieve más honda adentro del surco.
  const corazon = `M0 -66 C-8 -74 -20 -78 -20 -90 C-20 -98 -8 -100 0 -92 C8 -100 20 -98 20 -90 C20 -78 8 -74 0 -66 Z`;
  const brazo = (s: 1 | -1): string => {
    const dd = curva([[s * 58, 2], [s * 60, -22], [s * 72, -32], [s * 86, -28], [s * 90, -12], [s * 86, 2]]);
    return enmascarado(`m-sapito-apoyabrazo-${s > 0 ? 2 : 1}`, dd, forma(dd, C.naipe) + nube(s * 74, -30, 14, 4, C.naipe, 's', 1) + nube(s * 84, -6, 10, 14, C.lenteClaro, 'm', 0.55) + nube(s * 66, 0, 16, 6, C.piedra, 's', 0.4));
  };
  const bolita = (x: number): string => {
    const dd = elipse(x, -104, 9, 8.5);
    return enmascarado(`m-sapito-bolita-${x > 0 ? 2 : 1}`, dd, forma(dd, C.naipe) + nube(x + 4, -100, 6, 6, C.lenteClaro, 's', 0.7) + nube(x - 3, -108, 3, 2, C.naipe, 'xs'));
  };
  // Los carámbanos que cuelgan del borde de los apoyabrazos.
  const caramb = [[-80, -4, 7], [-70, -2, 10], [70, -2, 9], [78, -4, 6], [86, -3, 8]].map(([x, y, l]) => forma(poli([[x! - 2, y!], [x! + 2, y!], [x!, y! + l!]]), C.lenteClaro, 0.85)).join('');
  // Lo que se le pegó a la nieve: puntitos de hollín de la tele, y el polvo de la apisonada.
  const hollin = sembrar(71, 26, -64, -110, 128, 112, dentroDe(RESPALDO), (x, y, r) => forma(elipse(x, y, 0.6 + r() * 0.8, 0.5 + r() * 0.6), C.piedra, 0.35 + r() * 0.3));
  return conGrano(
    // La sombra del trono en la nieve, hacia la derecha, que la luz viene de la tele.
    nube(18, 4, 104, 9, C.piedra, 'm', 0.6) +
    enmascarado('m-sapito-respaldo', d,
      forma(d, C.naipe) +
      // La luz fría de la pantalla le pega de la izquierda; la sombra azul es de la derecha y de abajo.
      nube(40, -50, 30, 60, C.lenteClaro, 'l', 0.6) + nube(0, -4, 70, 12, C.lente, 'm', 0.35) + nube(-30, -96, 26, 10, C.naipe, 'm') +
      // Las palas con que la apisonó: franjas apenas marcadas.
      [-80, -56, -32].map((y, i) => trazo(`M-60 ${y} Q0 ${y - 4 + i} 60 ${y}`, C.lenteClaro, 3, 0.25)).join('') +
      enmascarado('m-sapito-corazon', corazon, forma(corazon, C.lenteClaro, 0.6) + nube(6, -76, 10, 8, C.lente, 's', 0.5)) +
      trazo(corazon, C.lente, 1.2, 0.6) + hollin) +
    trazo(curva(RESPALDO.slice(3, 8), false), C.naipe, 1.4, 0.8) +
    brazo(-1) + brazo(1) + bolita(-58) + bolita(58) + caramb,
  );
}

/* ------------------------------------------------------------------
   Las patas de atrás: las canillas (cuando se para) y los pies
   ------------------------------------------------------------------ */

function canilla(n: 0 | 1): string {
  const [x] = A.tobillos[n];
  const d = curva([[x - 6, 0], [x + 6, 0], [x + 8, -26], [x + 9, -50], [x - 9, -50], [x - 8, -26]]);
  return conGrano(enmascarado(`m-sapito-canilla-${n + 1}`, d,
    forma(d, C.verde) + nube(x + 6, -24, 4, 24, C.verdeHondo, 's', 0.8) + nube(x - 4, -30, 2, 16, C.verdeClaro, 's', 0.6) +
    [-14, -30, -44].map((y) => trazo(`M${x - 9} ${y} Q${x} ${y + 3} ${x + 9} ${y}`, C.verdeHondo, 2.2, 0.75)).join('')));
}

/** Un pie palmeado, apuntando para afuera: cuatro dedos largos con la yema redonda, y la membrana. */
const PIE: readonly P[] = [[-46, -10], [-56, -12], [-66, -10], [-76, -12], [-88, -12], [-96, -8], [-90, -4], [-98, -1], [-92, 2], [-96, 6], [-86, 6], [-74, 5], [-60, 4], [-46, 3], [-42, -3]];

function pie(n: 0 | 1): string {
  const pts = n === 0 ? PIE : espejo(PIE);
  const s = n === 0 ? 1 : -1;
  const X = (x: number): number => x * s;
  const d = curva(pts);
  const yemas = [[-96, -9], [-97, -2], [-96, 5]].map(([x, y]) => forma(elipse(X(x!), y!, 2.6, 2.2), C.verdeClaro) + forma(elipse(X(x!) + 0.6 * s, y! + 0.8, 1.4, 1), C.verdeHondo, 0.5)).join('');
  const dedos = [[-6], [-1], [4]].map(([y]) => trazo(`M${X(-60)} ${y! - 2} Q${X(-78)} ${y!} ${X(-92)} ${y! - 1}`, C.verdeHondo, 1.2, 0.6)).join('');
  let calzado = '';
  if (n === 1) {
    // El zapatito de cristal: le entra la punta de los dedos y nada más, y el taco queda al aire.
    const [zx, zy] = A.zapato;
    const capellada = curva([[zx - 12, zy - 6], [zx - 2, zy - 9], [zx + 10, zy - 6], [zx + 18, zy + 2], [zx + 14, zy + 8], [zx - 2, zy + 9], [zx - 14, zy + 6]]);
    const taco = poli([[zx - 12, zy - 5], [zx - 30, zy - 22], [zx - 31, zy - 18], [zx - 20, zy - 6], [zx - 14, zy + 2]]);
    const aguja = poli([[zx - 30, zy - 21], [zx - 26, zy - 22], [zx - 30, zy - 6], [zx - 31.5, zy - 6]]);
    calzado =
      enmascarado('m-sapito-taco', taco, forma(taco, C.lente, 0.85) + nube(zx - 22, zy - 15, 8, 2, C.lenteClaro, 's', 0.9)) +
      forma(aguja, C.lente) + trazo(`M${zx - 30} ${zy - 20} l-1 13`, C.lenteClaro, 0.7, 0.8) +
      enmascarado('m-sapito-capellada', capellada,
        forma(capellada, C.lente, 0.8) + nube(zx + 2, zy - 4, 12, 3, C.lenteClaro, 's', 0.95) + nube(zx + 6, zy + 6, 10, 3, C.negro, 's', 0.35) +
        // Los dedos se ven del otro lado del vidrio, apretados.
        trazo(`M${zx - 10} ${zy} Q${zx + 2} ${zy + 3} ${zx + 14} ${zy + 1}`, C.verdeHondo, 1, 0.6)) +
      trazo(capellada, C.lenteClaro, 0.8, 0.8) +
      forma(estrella(zx + 6, zy - 6, 3.4), C.naipe) + forma(elipse(zx - 6, zy - 4, 0.9, 0.9), C.naipe, 0.9);
  }
  return conGrano(
    nube(X(-70), 5, 26, 3, C.piedra, 's', 0.6) +
    enmascarado(`m-sapito-pie-${n + 1}`, d, forma(d, C.verde) + nube(X(-56), -8, 12, 5, C.verdeClaro, 's', 0.7) + nube(X(-80), 2, 18, 4, C.verdeHondo, 's', 0.6) + forma(curva([[X(-62), -3], [X(-90), -3], [X(-90), 3], [X(-62), 3]]), C.verdeClaro, 0.35) + dedos) +
    yemas + calzado,
  );
}

/* ------------------------------------------------------------------
   El cuerpo, el tul, la garganta y los brazos
   ------------------------------------------------------------------ */

const CUERPO: readonly P[] = [[0, -68], [46, -62], [58, -44], [70, -26], [74, -8], [62, 2], [30, 4], [0, 5], [-30, 4], [-62, 2], [-74, -8], [-70, -26], [-58, -44], [-46, -62]];

function cuerpo(): string {
  const d = curva(CUERPO);
  // La panza granulada del sapo: crema, con puntitos.
  const panza = curva([[0, -54], [26, -46], [34, -20], [26, 2], [0, 5], [-26, 2], [-34, -20], [-26, -46]]);
  const granos = sembrar(81, 60, -34, -54, 68, 58, dentroDe([[0, -54], [26, -46], [34, -20], [26, 2], [0, 5], [-26, 2], [-34, -20], [-26, -46]]), (x, y, r) => forma(elipse(x, y, 0.7 + r() * 0.6, 0.6 + r() * 0.5), C.piedra, 0.3 + r() * 0.25));
  // Los muslos doblados a los costados, con las bandas oscuras de las patas de sapo.
  const muslo = (s: 1 | -1): string => {
    const dd = elipse(s * 56, -18, 21, 17);
    return enmascarado(`m-sapito-muslo-${s > 0 ? 2 : 1}`, dd,
      forma(dd, C.verde) + nube(s * 52, -30, 14, 6, C.verdeClaro, 's', 0.8) + nube(s * 64, -6, 16, 8, C.verdeHondo, 'm', 0.8) +
      [-24, -12, 0].map((y, i) => trazo(`M${s * (40 + i * 2)} ${y - 6} Q${s * 56} ${y - 2} ${s * (72 - i)} ${y - 10}`, C.verdeHondo, 2.6, 0.7)).join('') +
      verruga(s * 48, -24, 2.4) + verruga(s * 62, -20, 2) + verruga(s * 58, -10, 1.8)) +
      trazo(`M${s * 38} -8 Q${s * 50} 0 ${s * 70} -6`, C.verdeHondo, 1.4, 0.7);
  };
  const verrugas = sembrar(83, 18, -72, -66, 144, 66, (x, y) => dentroDe(CUERPO)(x, y) && Math.abs(x) > 30, (x, y, r) => verruga(x, y, 1.4 + r() * 1.6));
  return conGrano(
    enmascarado('m-sapito-cuerpo', d,
      forma(d, C.verde) + nube(-30, -56, 30, 12, C.verdeClaro, 'm', 0.6) + nube(40, -20, 30, 40, C.verdeHondo, 'm', 0.7) + nube(0, 4, 80, 8, C.verdeHondo, 'm', 0.8) +
      verrugas +
      enmascarado('m-sapito-panza', panza, forma(panza, C.verdeClaro) + nube(-8, -30, 18, 22, C.naipe, 'm', 0.55) + nube(16, -6, 20, 14, C.oxido, 'm', 0.35) + granos)) +
    muslo(-1) + muslo(1),
  );
}

/** El jirón de tul rosa, atado a la cintura, roto y transparente: el tutú de la que fue. */
function tul(): string {
  const d = poli([
    [-50, -30], [-24, -34], [0, -35], [24, -34], [50, -30],
    [58, -16], [64, -8], [56, -10], [60, 0], [52, -4], [50, 8], [44, -2], [36, -6], [30, -2], [22, -8], [14, -4], [6, -9], [0, -4],
    [-8, -10], [-14, -5], [-20, -9], [-26, -4], [-34, -8], [-42, -2], [-50, -6], [-58, -4], [-62, -12], [-56, -18],
  ]);
  // La trama del tul: una red finita cruzada.
  let red = '';
  for (let i = -70; i <= 70; i += 5) red += `M${i} -36 l20 36 M${i} -36 l-20 36 `;
  const volados = [-40, -20, 0, 20, 40].map((x) => trazo(`M${x} -32 Q${x + 3} -18 ${x + 6} -6`, C.tulClaro, 1.6, 0.7)).join('');
  // El moño, atado a un costado, con una punta más larga que la otra.
  const mono = forma(`M-44 -30 Q-56 -40 -60 -30 Q-56 -22 -44 -28 Z M-44 -30 Q-32 -42 -28 -32 Q-32 -24 -44 -28 Z`, C.rojo) +
    forma(elipse(-44, -29, 3, 2.6), C.tul) + trazo('M-45 -27 Q-50 -16 -48 -8 M-43 -27 Q-40 -20 -38 -16', C.rojo, 1.6);
  return conGrano(
    enmascarado('m-sapito-tul', d, forma(d, C.tul, 0.72) + nube(-10, -26, 40, 6, C.tulClaro, 'm', 0.7) + nube(30, -6, 30, 8, C.rojo, 'm', 0.35) + trazo(red, C.tulClaro, 0.5, 0.45) + volados) +
    trazo('M-50 -31 Q0 -38 50 -31', C.rojo, 2, 0.85) + mono,
  );
}

/** El saco de la garganta, dibujado inflado del todo: la isla lo achica colgado del mentón. */
function garganta(): string {
  const [gx, gy] = A.garganta;
  const d = `M${gx - 28} ${gy + 2} C${gx - 36} ${gy + 26} ${gx - 18} ${gy + 44} ${gx} ${gy + 44} C${gx + 18} ${gy + 44} ${gx + 36} ${gy + 26} ${gx + 28} ${gy + 2} Q${gx} ${gy - 4} ${gx - 28} ${gy + 2} Z`;
  return conGrano(enmascarado('m-sapito-garganta', d,
    forma(d, C.verdeClaro) + nube(gx - 8, gy + 18, 12, 12, C.naipe, 'm', 0.8) + nube(gx + 14, gy + 30, 14, 12, C.oxido, 'm', 0.35) + nube(gx, gy + 2, 30, 4, C.verdeHondo, 's', 0.6) +
    // Las arrugas del pellejo estirado.
    [10, 20, 30].map((y) => trazo(`M${gx - 20 + y / 3} ${gy + y} Q${gx} ${gy + y + 4} ${gx + 20 - y / 3} ${gy + y}`, C.piedra, 0.8, 0.45)).join('')) +
    trazo(`M${gx - 28} ${gy + 2} C${gx - 36} ${gy + 26} ${gx - 18} ${gy + 44} ${gx} ${gy + 44} C${gx + 18} ${gy + 44} ${gx + 36} ${gy + 26} ${gx + 28} ${gy + 2}`, C.verdeHondo, 1.2, 0.6));
}

/** Un brazo, del hombro a la mano apoyada en la nieve. El 2 es el de la derecha. */
function brazo(n: 0 | 1): string {
  const s = n === 0 ? -1 : 1;
  const X = (x: number): number => x * s;
  const pts: P[] = [[X(26), -54], [X(40), -50], [X(46), -30], [X(48), -12], [X(46), -4], [X(38), -4], [X(36), -14], [X(32), -32]];
  const d = curva(pts);
  // La mano: cuatro dedos abiertos con la yema redonda, apoyados en la nieve.
  const dedos = [[-10, 2], [-4, 4], [3, 4], [9, 1]].map(([dx, dy]) => {
    const [x0, y0] = [X(42), -4];
    const [x1, y1] = [X(42 + dx!), dy!];
    return trazo(`M${x0} ${y0} L${x1} ${y1}`, C.verde, 3.4) + forma(elipse(x1, y1, 2.4, 2), C.verdeClaro) + forma(elipse(x1, y1 + 0.8, 1.2, 0.8), C.verdeHondo, 0.5);
  }).join('');
  return conGrano(
    enmascarado(`m-sapito-brazo-${n + 1}`, d,
      forma(d, C.verde) + nube(X(36), -40, 5, 14, C.verdeClaro, 's', 0.7) + nube(X(46), -20, 6, 18, C.verdeHondo, 's', 0.8) +
      [-40, -26, -14].map((y) => trazo(`M${X(32)} ${y} Q${X(40)} ${y + 3} ${X(48)} ${y - 1}`, C.verdeHondo, 2, 0.65)).join('') + verruga(X(38), -46, 1.6)) +
    dedos,
  );
}

/* ------------------------------------------------------------------
   La cabeza: la cúpula con los ojos saltones, la boca pintada, el colorete
   ------------------------------------------------------------------ */

const CABEZA: readonly P[] = [[-56, -58], [-52, -74], [-44, -92], [-30, -104], [-16, -102], [-8, -96], [0, -95], [8, -96], [16, -102], [30, -104], [44, -92], [52, -74], [56, -58], [48, -46], [28, -40], [0, -38], [-28, -40], [-48, -46]];

function cabeza(): string {
  const d = curva(CABEZA);
  const r = A.radioOjo;
  const verrugas = sembrar(91, 16, -56, -106, 112, 70, (x, y) => dentroDe(CABEZA)(x, y) && y > -80 && Math.abs(x) > 14 && Math.abs(y + 62) > 5, (x, y, rr) => verruga(x, y, 1.1 + rr() * 1.3));
  // Las glándulas de veneno, detrás de los ojos: las dos verrugas grandes de los sapos.
  const glandula = (s: 1 | -1): string =>
    forma(elipse(s * 46, -78, 7, 11), C.piedra) + nube(s * 44, -82, 3, 5, C.verdeClaro, 's', 0.6) + sembrar(93 + s, 6, s * 46 - 6, -88, 12, 20, (x, y) => ((x - s * 46) ** 2) / 49 + ((y + 78) ** 2) / 121 < 0.8, (x, y) => forma(elipse(x, y, 0.8, 0.8), C.verdeHondo, 0.6));
  const ojo = ([x, y]: P): string =>
    nube(x, y - 4, r + 4, r + 2, C.verdeClaro, 'm', 0.6) +
    forma(elipse(x, y, r + 2.4, r + 2.2), C.verdeHondo) +
    forma(elipse(x, y, r, r), C.oro) +
    nube(x, y - r * 0.4, r * 0.8, r * 0.5, C.oroClaro, 's', 0.9) + nube(x + 3, y + r * 0.6, r * 0.8, r * 0.4, C.oxido, 's', 0.8) +
    // Las venitas negras del iris de sapo.
    Array.from({ length: 10 }, (_, k) => {
      const a = (k / 10) * Math.PI * 2 + 0.2;
      return trazo(`M${f(x + Math.cos(a) * (r - 6))} ${f(y + Math.sin(a) * (r - 6))} L${f(x + Math.cos(a) * (r - 1))} ${f(y + Math.sin(a) * (r - 1))}`, C.oxido, 0.8, 0.7);
    }).join('');
  // La boca de sapo, de oreja a oreja, y la pintura de princesa, corrida para un costado.
  const raya = 'M-54 -58 Q-30 -48 0 -51 Q30 -48 54 -58';
  const pintura = forma('M-14 -53 Q-6 -58 0 -55 Q6 -59 15 -53 Q8 -47 0 -48 Q-8 -46 -14 -53 Z', C.rojo, 0.9) + forma('M8 -52 Q18 -50 24 -46 Q16 -46 8 -49 Z', C.rojo, 0.55) + nube(-4, -54, 6, 1.5, C.tulClaro, 'xs', 0.8);
  return conGrano(
    enmascarado('m-sapito-cabeza', d,
      forma(d, C.verde) +
      nube(0, -86, 30, 12, C.verdeClaro, 'm', 0.75) + nube(-30, -60, 18, 12, C.verdeClaro, 'm', 0.35) + nube(34, -56, 20, 14, C.verdeHondo, 'm', 0.6) + nube(0, -40, 50, 6, C.verdeHondo, 'm', 0.6) +
      // Los cachetes con colorete, que en un sapo quedan donde quedan.
      nube(-34, -63, 10, 6, C.tul, 'm', 0.85) + nube(34, -63, 10, 6, C.tul, 'm', 0.85) +
      verrugas + glandula(-1) + glandula(1) +
      // Las narinas, chiquitas.
      forma(elipse(-6, -74, 1.6, 1.1), C.negro, 0.8) + forma(elipse(6, -74, 1.6, 1.1), C.negro, 0.8)) +
    A.ojos.map(ojo).join('') +
    trazo(raya, C.verdeHondo, 3) + trazo(raya, C.negro, 1, 0.8) + pintura,
  );
}

/** Una pupila de sapo: una barra negra acostada, con la luz de la tele en una punta. */
function pupila(n: 0 | 1): string {
  const [x, y] = A.ojos[n];
  return forma(`M${x - 7} ${y} Q${x - 7} ${y - 3.4} ${x} ${y - 3.6} Q${x + 7} ${y - 3.4} ${x + 7} ${y} Q${x + 7} ${y + 3.4} ${x} ${y + 3.6} Q${x - 7} ${y + 3.4} ${x - 7} ${y} Z`, C.negro) +
    forma(elipse(x - 3.4, y - 1.4, 1.6, 1.2), C.naipe, 0.95) + forma(elipse(x + 4, y + 1.6, 0.7, 0.5), C.naipe, 0.6);
}

/** El párpado de arriba, cerrado del todo: la isla lo baja desde arriba del ojo. */
function parpado(n: 0 | 1): string {
  const [x, y] = A.ojos[n];
  const r = A.radioOjo;
  const d = elipse(x, y, r + 2.6, r + 2.4);
  return conGrano(enmascarado(`m-sapito-parpado-${n + 1}`, d, forma(d, C.verde) + nube(x, y - r, r + 2, 7, C.verdeClaro, 's', 0.8) + nube(x, y + r - 2, r + 2, 4, C.verdeHondo, 's', 0.8) + verruga(x + (n ? 5 : -5), y - 6, 1.4) +
    // La sombra de ojos celeste, de fiesta, que le quedó.
    nube(x, y + r - 6, r, 3, C.lenteClaro, 's', 0.55)) +
    trazo(`M${x - r - 2} ${y + 1} Q${x} ${y + r + 4} ${x + r + 2} ${y + 1}`, C.verdeHondo, 1.4, 0.9));
}

/** Las pestañas postizas: tres curvas negras al costado de afuera, que bajan con el borde del párpado. */
function pestanas(n: 0 | 1): string {
  const [x, y] = A.ojos[n];
  const top = y - A.radioOjo - 1;
  const s = n === 0 ? -1 : 1;
  return [0, 1, 2, 3].map((i) => {
    const x0 = x + s * (4 + i * 3.4);
    const y0 = top + 1 + i * 0.6;
    return trazo(`M${f(x0)} ${f(y0)} Q${f(x0 + s * (3 + i))} ${f(y0 - 4 - i * 0.4)} ${f(x0 + s * (6 + i * 1.6))} ${f(y0 - 4 + i * 0.8)}`, C.negro, 1.3 - i * 0.12);
  }).join('');
}

/** La corona chica de lata, abollada, con un corazón de vidrio rojo en la frente. */
function corona(): string {
  const [x, y] = A.corona;
  const d = poli([[x - 14, y], [x - 14, y - 6], [x - 16, y - 18], [x - 8, y - 9], [x - 2, y - 21], [x + 3, y - 9], [x + 10, y - 17], [x + 12, y - 8], [x + 17, y - 19], [x + 14, y - 6], [x + 14, y]]);
  return conGrano(
    enmascarado('m-sapito-corona', d,
      forma(d, C.oro) + nube(x - 6, y - 10, 6, 8, C.oroClaro, 's', 0.9) + nube(x + 10, y - 4, 8, 6, C.oxido, 's', 0.8) +
      // La abolladura de la punta del medio, y la banda de abajo con sus remaches.
      trazo(`M${x - 2} ${y - 20} L${x + 1} ${y - 12}`, C.oxido, 1, 0.8) + forma(poli([[x - 14, y], [x - 14, y - 5], [x + 14, y - 5], [x + 14, y]]), C.oxido, 0.55) +
      [-10, -4, 4, 10].map((dx) => forma(elipse(x + dx, y - 2.5, 0.9, 0.9), C.oroClaro)).join('')) +
    // Las bolitas de las puntas; a la de la derecha se le cayó la suya.
    forma(elipse(x - 16, y - 19.6, 2, 2), C.oroClaro) + forma(elipse(x - 2, y - 22.6, 2.2, 2.2), C.oroClaro) + forma(elipse(x + 10, y - 18.4, 1.8, 1.8), C.oro) +
    // El corazón de vidrio.
    forma(`M${x} ${y - 4} C${x - 2} ${y - 6} ${x - 5} ${y - 7} ${x - 5} ${y - 9} C${x - 5} ${y - 11} ${x - 2} ${y - 11} ${x} ${y - 9} C${x + 2} ${y - 11} ${x + 5} ${y - 11} ${x + 5} ${y - 9} C${x + 5} ${y - 7} ${x + 2} ${y - 6} ${x} ${y - 4} Z`, C.rojo) +
    forma(elipse(x - 2, y - 9, 1, 0.8), C.tulClaro),
  );
}

/** La trompa del beso: los labios pintados, fruncidos, para afuera. */
function trompa(): string {
  const [x, y] = A.boca;
  return conGrano(
    forma(elipse(x, y, 10, 7.6), C.rojo) + nube(x - 3, y - 3, 5, 2, C.tulClaro, 's', 0.9) + nube(x + 3, y + 4, 6, 2, C.oxido, 's', 0.5) +
    forma(elipse(x, y + 0.6, 3, 2.2), C.negro, 0.8) +
    [-1, 1].map((s) => trazo(`M${x + s * 4} ${y - 6} Q${x + s * 5} ${y} ${x + s * 4} ${y + 6}`, C.oxido, 0.8, 0.6)).join('') +
    trazo(`M${x - 2} ${y - 7} l0 2 M${x + 2} ${y - 7} l0 2 M${x} ${y + 6} l0 2`, C.oxido, 0.7, 0.6),
  );
}

/** La lengua, estirada para arriba desde la boca, con la punta pegajosa. */
function lengua(): string {
  const [x, y] = A.boca;
  const L = A.lengua;
  const d = `M${x - 3.6} ${y} L${x - 2.6} ${y - L + 6} L${x + 2.6} ${y - L + 6} L${x + 3.6} ${y} Z`;
  return conGrano(
    forma(d, C.tul) + trazo(`M${x} ${y - 4} L${x} ${y - L + 8}`, C.rojo, 1, 0.6) + trazo(`M${x - 2} ${y - 6} L${x - 1.6} ${y - L + 10}`, C.tulClaro, 0.8, 0.7) +
    forma(elipse(x, y - L + 2, 6, 5.4), C.tul) + nube(x - 2, y - L, 2.4, 2, C.naipe, 'xs', 0.9) + forma(elipse(x + 1.6, y - L + 4, 2, 1.4), C.rojo, 0.6),
  );
}

/** El copo de nieve que cae, de seis brazos con ramitas. */
function copo(): string {
  let d = '';
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    d += `M0 0 L${f(c * 7)} ${f(s * 7)} `;
    const [mx, my] = [c * 4, s * 4];
    for (const g of [0.6, -0.6]) d += `M${f(mx)} ${f(my)} L${f(mx + Math.cos(a + g) * 2.6)} ${f(my + Math.sin(a + g) * 2.6)} `;
  }
  return nube(0, 0, 6, 6, C.lenteClaro, 's', 0.5) + trazo(d, C.naipe, 1.2) + forma(elipse(0, 0, 1.4, 1.4), C.naipe);
}

/** El vaho del frío: tres bocanadas que salen por la comisura. */
function vaho(): string {
  const [x, y] = A.boca;
  return nube(x + 18, y - 4, 7, 5, C.naipe, 's', 0.85) + nube(x + 26, y - 9, 6, 5, C.naipe, 's', 0.7) + nube(x + 22, y - 14, 4, 3, C.naipe, 'xs', 0.6);
}

/** Las chispas del encantamiento, alrededor de ella: el oro de la corona y el blanco del naipe. */
function chispas(): string {
  const [hx, hy] = A.hechizo;
  const puestas: Array<[number, number, number]> = [[-74, -40, 11], [70, -50, 9], [-52, -88, 7], [58, 6, 8], [-66, 28, 6], [10, -98, 8], [80, -6, 5], [-84, -6, 5], [40, -84, 5]];
  return puestas.map(([dx, dy, s], i) => {
    const [x, y] = [hx + dx, hy + dy];
    return nube(x, y, s * 1.1, s * 1.1, i % 2 ? C.naipe : C.oroClaro, 'm', 0.55) + forma(estrella(x, y, s), i % 2 ? C.naipe : C.oroClaro) + forma(estrella(x, y, s * 0.45), C.naipe);
  }).join('') + [[-30, -70], [36, -66], [-80, 18], [70, 24], [-20, 40]].map(([dx, dy]) => forma(elipse(hx + dx!, hy + dy!, 1.4, 1.4), C.oroClaro, 0.9)).join('');
}

/** El puf: una nube de nieve y humo que la tapa entera, el momento en que tendría que haber vuelto. */
function puf(): string {
  const [hx, hy] = A.hechizo;
  const bollos: Array<[number, number, number]> = [[0, 0, 44], [-46, 10, 32], [44, 12, 34], [-28, -40, 30], [30, -38, 32], [0, -58, 26], [-62, -18, 22], [64, -14, 24], [-20, 44, 28], [24, 46, 26]];
  const d = bollos.map(([dx, dy, r]) => elipse(hx + dx, hy + dy, r, r * 0.9)).join(' ');
  return conGrano(
    bollos.map(([dx, dy, r]) => nube(hx + dx, hy + dy, r + 6, r + 4, C.naipe, 'm', 0.5)).join('') +
    enmascarado('m-sapito-puf', d,
      forma(d, C.naipe) + nube(hx + 30, hy + 30, 50, 36, C.lenteClaro, 'l', 0.6) + nube(hx - 20, hy - 30, 40, 20, C.naipe, 'm') + nube(hx, hy + 54, 70, 12, C.piedra, 'm', 0.35) +
      bollos.map(([dx, dy, r]) => trazo(`M${f(hx + dx - r * 0.6)} ${f(hy + dy + r * 0.5)} Q${f(hx + dx)} ${f(hy + dy + r * 0.9)} ${f(hx + dx + r * 0.6)} ${f(hy + dy + r * 0.5)}`, C.lenteClaro, 2, 0.4)).join('')) +
    // Y adentro del puf, alguna chispa que se quedó sin hacer nada.
    forma(estrella(hx - 30, hy - 6, 6), C.oroClaro, 0.9) + forma(estrella(hx + 36, hy - 20, 4), C.oroClaro, 0.8),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;
const [ZX, ZY] = A.zapato;
const [KX, KY] = A.corona;
const [BX, BY] = A.boca;
const [HX, HY] = A.hechizo;
const ojoCaja = (n: 0 | 1, m: number): [number, number, number, number] => [A.ojos[n][0] - m, A.ojos[n][1] - m, m * 2, m * 2];

export const PIEZAS_SAPITO: readonly Pieza[] = [
  { nombre: 'sapito-trono', caja: [-100, -122, 216, 136], dibujo: trono(), densidad: 1.8 },
  { nombre: 'sapito-canilla-1', caja: [A.tobillos[0][0] - 12, -54, 24, 58], dibujo: canilla(0), densidad: D },
  { nombre: 'sapito-canilla-2', caja: [A.tobillos[1][0] - 12, -54, 24, 58], dibujo: canilla(1), densidad: D },
  { nombre: 'sapito-pie-1', caja: [-104, -18, 66, 28], dibujo: pie(0), densidad: D * 1.3 },
  { nombre: 'sapito-pie-2', caja: [38, ZY - 26, 66, 40], dibujo: pie(1), densidad: D * 1.3 },
  { nombre: 'sapito-cuerpo', caja: [-80, -74, 160, 84], dibujo: cuerpo(), densidad: D },
  { nombre: 'sapito-tul', caja: [-66, -44, 134, 56], dibujo: tul(), densidad: D },
  { nombre: 'sapito-cabeza', caja: [-62, -112, 124, 78], dibujo: cabeza(), densidad: D * 1.2 },
  { nombre: 'sapito-garganta', caja: [-36, -52, 72, 50], dibujo: garganta(), densidad: D },
  { nombre: 'sapito-pupila-1', caja: [...ojoCaja(0, 10)], dibujo: pupila(0), densidad: D * 1.6 },
  { nombre: 'sapito-pupila-2', caja: [...ojoCaja(1, 10)], dibujo: pupila(1), densidad: D * 1.6 },
  { nombre: 'sapito-parpado-1', caja: [...ojoCaja(0, 18)], dibujo: parpado(0), densidad: D * 1.4 },
  { nombre: 'sapito-parpado-2', caja: [...ojoCaja(1, 18)], dibujo: parpado(1), densidad: D * 1.4 },
  { nombre: 'sapito-pestanas-1', caja: [A.ojos[0][0] - 26, A.ojos[0][1] - A.radioOjo - 10, 26, 14], dibujo: pestanas(0), densidad: D * 1.6 },
  { nombre: 'sapito-pestanas-2', caja: [A.ojos[1][0], A.ojos[1][1] - A.radioOjo - 10, 26, 14], dibujo: pestanas(1), densidad: D * 1.6 },
  { nombre: 'sapito-corona', caja: [KX - 20, KY - 26, 40, 30], dibujo: corona(), densidad: D * 1.6 },
  { nombre: 'sapito-trompa', caja: [BX - 13, BY - 11, 26, 22], dibujo: trompa(), densidad: D * 1.4 },
  { nombre: 'sapito-lengua', caja: [BX - 8, BY - A.lengua - 6, 16, A.lengua + 10], dibujo: lengua(), densidad: D },
  { nombre: 'sapito-brazo-1', caja: [-62, -58, 40, 66], dibujo: brazo(0), densidad: D },
  { nombre: 'sapito-brazo-2', caja: [22, -58, 40, 66], dibujo: brazo(1), densidad: D },
  { nombre: 'sapito-copo', caja: [-10, -10, 20, 20], dibujo: copo(), densidad: D * 1.6 },
  { nombre: 'sapito-vaho', caja: [BX + 6, BY - 24, 30, 30], dibujo: vaho(), densidad: 1.6 },
  { nombre: 'sapito-chispas', caja: [HX - 100, HY - 112, 200, 160], dibujo: chispas(), densidad: 1.6 },
  { nombre: 'sapito-puf', caja: [HX - 100, HY - 96, 200, 184], dibujo: puf(), densidad: 1.5 },
];

const img = imagenesDe(PIEZAS_SAPITO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** La sapita armada con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const ojo = (n: 1 | 2): string =>
    parte(`pupila-${n}`, img(`sapito-pupila-${n}`), t[`pupila-${n}`]) +
    parte(`parpado-${n}`, img(`sapito-parpado-${n}`), t[`parpado-${n}`]) +
    parte(`pestanas-${n}`, img(`sapito-pestanas-${n}`), t[`pestanas-${n}`]);
  return (
    img('sapito-trono') +
    parte('canillas', parte('canilla-1', img('sapito-canilla-1'), t['canilla-1']) + parte('canilla-2', img('sapito-canilla-2'), t['canilla-2']), '', o.canillas) +
    img('sapito-pie-1') +
    parte('pie-2', img('sapito-pie-2'), t['pie-2']) +
    parte('sapo',
      img('sapito-cuerpo') +
      parte('tul', img('sapito-tul'), t.tul) +
      parte('cabeza',
        img('sapito-cabeza') +
        parte('garganta', img('sapito-garganta'), t.garganta) +
        ojo(1) + ojo(2) +
        parte('corona', img('sapito-corona'), t.corona) +
        parte('trompa', img('sapito-trompa'), '', o.trompa) +
        parte('lengua', img('sapito-lengua'), t.lengua, o.lengua) +
        parte('vaho', img('sapito-vaho'), t.vaho, o.vaho),
        t.cabeza) +
      parte('brazo-1', img('sapito-brazo-1'), t['brazo-1']) +
      parte('brazo-2', img('sapito-brazo-2'), t['brazo-2']) +
      parte('copo', img('sapito-copo'), t.copo, o.copo),
      t.sapo) +
    parte('chispas', img('sapito-chispas'), t.chispas, o.chispas) +
    parte('puf', img('sapito-puf'), t.puf, o.puf)
  );
}

/** La sapita en un momento, sin lo que la hace tocable: para el test, el retrato y para mirarla. */
export function sapitoEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: sentada en el trono, la corona torcida, los ojos a media asta. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--sapito" data-id="la-princesita-sapito" role="button" tabindex="0" aria-label="${nombres.get('la-princesita-sapito') ?? 'La princesita sapito'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: parada en las patas de atrás, la trompa pintada, esperando el beso entre chispas. */
export const RETRATO = { caja: [SAPITO.x - 62, SAPITO.piso - 104, 124, 116] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('cyber-lejos') + fondo('cyber-piso') + sapitoEn(BESO);
}

export const SAPITO_PERSONAJE: Personaje = {
  id: 'la-princesita-sapito',
  region: 'cybersiberia',
  ancla: SAPITO.x,
  piezas: PIEZAS_SAPITO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};

