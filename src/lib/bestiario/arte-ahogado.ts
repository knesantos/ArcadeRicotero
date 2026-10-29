/**
 * El ahogado y su fiel fantasma (`D-73`, vigesimoquinta vuelta), en el agua de la izquierda del bajo.
 *
 * *"Me estoy por ahogar, me voy a pique, glu glu, bu buuu"* es de *Divina TV Führer*, en *Oktubre* (1986). La
 * letra los pone juntos en un verso: uno que se va a pique y otro que hace bu. Acá son dos en un títere.
 *
 * **El ahogado**, con el agua a la boca: los ojos desorbitados, la nariz afuera, el pelo pegado a la frente y
 * el bigote chorreando. Levanta una mano, que es pedir auxilio, pero en la mano tiene una moneda: la del
 * barquero, por las dudas. Con la otra se agarra de un salvavidas que se desinfló y no flota, y su sombrero
 * se fue solo para el lado del bote.
 *
 * **Su fantasma**, arriba: una sábana de las de antes, con la marca de la planchada, un remiendo y la
 * etiqueta del lavadero en la espalda. Los dos agujeros son agujeros: por ahí se ve la noche del bajo. Está
 * atado con un piolín de la punta del ruedo al tobillo del ahogado, que está debajo del agua: si el otro se
 * va a pique, él va detrás.
 *
 * Viste las tapas de *Oktubre*, medidas con sharp: la tinta es el negro de la plancha, la piel del ahogado es
 * el verdín de las caras talladas del frente (el negro de esa tapa no es negro: tira a verde de agua), la
 * sábana es el papel crudo, el salvavidas es el rojo de las banderas y la moneda es el gris de la contratapa.
 * La técnica no es la gubia del disco: es el aerógrafo del bestiario.
 *
 * Coordenadas: el (0, 0) es donde el agua le toca la boca (`rig-ahogado.ts`).
 */

import { forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { AGUA, AHOGADO, AHOGADO_ARMADO as A, BU, QUIETO, marcas, type Momento } from './rig-ahogado.ts';

/** Las tintas de *Oktubre* (`tokens.css`). */
const C = {
  tinta: 'var(--bestia-ahogado-tinta)',
  hueco: 'var(--bestia-ahogado-hueco)',
  verdin: 'var(--bestia-ahogado-verdin)',
  verdinClaro: 'var(--bestia-ahogado-verdin-claro)',
  pielHonda: 'var(--bestia-ahogado-piel-honda)',
  piel: 'var(--bestia-ahogado-piel)',
  pielClara: 'var(--bestia-ahogado-piel-clara)',
  papel: 'var(--bestia-ahogado-papel)',
  papelClaro: 'var(--bestia-ahogado-papel-claro)',
  gris: 'var(--bestia-ahogado-gris)',
  grisClaro: 'var(--bestia-ahogado-gris-claro)',
  crudo: 'var(--bestia-ahogado-crudo)',
  rojo: 'var(--bestia-ahogado-rojo)',
  rojoHondo: 'var(--bestia-ahogado-rojo-hondo)',
  brasa: 'var(--bestia-ahogado-brasa)',
  quemado: 'var(--bestia-ahogado-quemado)',
  alga: 'var(--bestia-ahogado-alga)',
  noche: 'var(--bestia-ahogado-noche)',
  moneda: 'var(--bestia-ahogado-moneda)',
  monedaHonda: 'var(--bestia-ahogado-moneda-honda)',
};

/** La máscara con agujeros: lo de adentro de la silueta, menos los huecos (regla par-impar). */
const conHuecos = (id: string, silueta: string, adentro: string): string =>
  `<clipPath id="${id}"><path d="${silueta}" clip-rule="evenodd"/></clipPath><g clip-path="url(#${id})">${adentro}</g>`;

/** Un punto a lo largo de un segmento, y la normal: para los brazos y las mangas. */
const a = (p: P, q: P, t: number): P => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
const normal = (p: P, q: P): P => {
  const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
  return [-(q[1] - p[1]) / l, (q[0] - p[0]) / l];
};

/* ------------------------------------------------------------------
   El fantasma: la sábana con los agujeros, la espalda, el ruedo, las mangas
   ------------------------------------------------------------------ */

const [FX, FY] = A.fantasma;

/** La silueta de la sábana: la cabeza redonda, los hombros caídos y el ruedo derecho, que tapa el ruedo que flamea. */
const SABANA: readonly P[] = [
  [FX, -218], [FX - 17, -213], [FX - 29, -200], [FX - 35, -184], [FX - 41, -162], [FX - 47, -138], [FX - 53, -114], [FX - 56, -102],
  [FX - 28, -99], [FX + 2, -102], [FX + 28, -101], [FX + 52, -104],
  [FX + 48, -116], [FX + 42, -140], [FX + 36, -162], [FX + 31, -184], [FX + 25, -200], [FX + 14, -213],
];

/** Los agujeros: el de la izquierda un poco más grande, cortado a tijera por alguien apurado. */
const HUECOS: readonly [number, number][] = [[6.6, 8.8], [5.6, 8]];
const huecos = (mas = 0): string => A.agujeros.map(([x, y], i) => elipse(x, y, HUECOS[i]![0] + mas, HUECOS[i]![1] + mas)).join(' ');

/** Los pliegues de la sábana colgada: caen de la cabeza y se abren para el ruedo. */
function pliegues(espalda: boolean): string {
  const caidas: ReadonlyArray<readonly [number, number, number]> = espalda
    ? [[-20, -10, 0.7], [-6, 4, 0.6], [12, 22, 0.7], [26, 40, 0.5]]
    : [[-24, -36, 0.7], [-8, -10, 0.5], [10, 18, 0.6], [22, 38, 0.6]];
  return caidas.map(([x0, x1, o]) => {
    const d = `M${FX + x0 * 0.4} -196 Q${FX + x0} -150 ${FX + x1} -100`;
    return trazo(d, C.gris, 7, o * 0.5) + trazo(`M${FX + x0 * 0.4 + 3} -194 Q${FX + x0 + 3} -150 ${FX + x1 + 4} -100`, C.papelClaro, 2.4, o * 0.6);
  }).join('');
}

function sabana(): string {
  const d = curva(SABANA);
  // La marca de la planchada: la suela de la plancha, que se quedó un rato de más, con los agujeritos del vapor.
  const [px, py] = [FX - 22, -132];
  const plancha = curva([[px - 10, py + 8], [px + 10, py + 8], [px + 10, py], [px + 4, py - 9], [px, py - 14], [px - 4, py - 9], [px - 10, py]]);
  const vapor = [[px + 2, py - 4], [px + 6, py - 6], [px + 6, py], [px + 1, py + 2], [px - 3, py + 3]].map(([x, y]) => forma(elipse(x!, y!, 0.8, 0.7), C.quemado, 0.5)).join('');
  // El remiendo, cosido a mano con hilo negro, en punto cruz: un cuadrado de otra sábana, más cruda.
  const [rx, ry] = [FX + 30, -126];
  const remiendo = poli([[rx - 9, ry - 9], [rx + 10, ry - 10], [rx + 11, ry + 9], [rx - 8, ry + 10]]);
  const puntadas = [...Array(6)].map((_, i) => {
    const t = i / 5;
    const borde: [P, P][] = [[[rx - 10, ry - 10 + t * 20], [rx - 7, ry - 7 + t * 17]], [[rx + 9 - t * 18, ry - 11], [rx + 8 - t * 16, ry - 8]], [[rx + 12, ry - 9 + t * 19], [rx + 9, ry - 8 + t * 17]]];
    return borde.map(([[x0, y0], [x1, y1]]) => trazo(`M${x0} ${y0} L${x1} ${y1} M${x0} ${y1} L${x1} ${y0}`, C.tinta, 0.55, 0.8)).join('');
  }).join('');
  return conGrano(
    conHuecos('m-ahogado-sabana', `${d} ${huecos()}`,
      forma(d, C.papel) +
      // La luz le pega de arriba y de la izquierda; la sombra se junta a la derecha y abajo.
      nube(FX - 12, -196, 22, 16, C.papelClaro, 'm', 0.9) + nube(FX + 34, -140, 18, 46, C.gris, 'l', 0.7) +
      nube(FX - 50, -130, 8, 30, C.grisClaro, 'm', 0.6) + nube(FX, -104, 60, 8, C.gris, 'm', 0.55) +
      pliegues(false) +
      // Lo hondo: la sombra fría del bajo se le mete en los pliegues de abajo y debajo de la cabeza.
      nube(FX + 40, -118, 10, 22, C.verdinClaro, 'm', 0.45) + nube(FX - 44, -110, 8, 12, C.verdinClaro, 'm', 0.35) + nube(FX + 26, -178, 6, 14, C.gris, 'm', 0.6) + nube(FX - 30, -178, 5, 12, C.gris, 'm', 0.4) +
      // La tela se hunde alrededor de los agujeros: tiene el grosor de una sábana de verdad.
      A.agujeros.map(([x, y], i) => nube(x, y + 2, HUECOS[i]![0] + 5, HUECOS[i]![1] + 6, C.gris, 's', 0.9)).join('') +
      // La boca cerrada: un hundido nomás, donde la tela se mete para adentro.
      nube(A.bocaF[0], A.bocaF[1] + 1, 7, 4, C.gris, 's', 0.6) + nube(A.bocaF[0] - 1, A.bocaF[1] - 3, 6, 1.6, C.papelClaro, 'xs', 0.6) +
      `<g transform="rotate(-24 ${px} ${py})">${forma(plancha, C.quemado, 0.32)}${nube(px, py, 8, 5, C.quemado, 's', 0.25)}${vapor}</g>` +
      `<g>${forma(remiendo, C.crudo)}${nube(rx + 4, ry + 4, 8, 6, C.gris, 's', 0.6)}${trazo(`M${rx - 9} ${ry - 9} L${rx + 10} ${ry - 10}`, C.papelClaro, 0.8, 0.8)}${puntadas}</g>`) +
    // El borde de los agujeros: el corte de la tijera, deshilachado.
    A.agujeros.map(([x, y], i) => trazo(elipse(x, y, HUECOS[i]![0] + 0.4, HUECOS[i]![1] + 0.4), C.verdin, 1.1, 0.75) +
      [0, 1, 2, 3, 4].map((k) => {
        const g = (k / 5) * Math.PI * 2 + i;
        const [hx, hy] = [x + Math.cos(g) * (HUECOS[i]![0] + 0.6), y + Math.sin(g) * (HUECOS[i]![1] + 0.6)];
        return trazo(`M${f(hx)} ${f(hy)} l${f(-Math.cos(g) * 2)} ${f(-Math.sin(g) * 2)}`, C.papel, 0.6, 0.9);
      }).join('')).join(''),
  );
}

/** La espalda: la misma sábana sin agujeros, con la costura del medio y la etiqueta del lavadero. */
function espalda(): string {
  const d = curva(SABANA);
  const [tx, ty] = [FX - 4, -204];
  return conGrano(
    conHuecos('m-ahogado-espalda', d,
      forma(d, C.papel) + nube(FX + 14, -192, 22, 16, C.papelClaro, 'm', 0.85) + nube(FX - 36, -140, 18, 46, C.gris, 'l', 0.65) +
      nube(FX, -104, 60, 8, C.gris, 'm', 0.55) + pliegues(true) +
      // La costura de dos sábanas, que corre de arriba abajo.
      trazo(`M${FX + 2} -216 Q${FX + 6} -160 ${FX + 2} -100`, C.gris, 1.4, 0.7) + trazo(`M${FX + 4} -214 Q${FX + 8} -160 ${FX + 4} -100`, C.papelClaro, 0.6, 0.7) +
      // La etiqueta del lavadero, cosida torcida, con un número que ya no se lee.
      `<g transform="rotate(8 ${tx} ${ty})">${forma(cajaRedonda(tx - 6, ty - 3, 12, 7, 1), C.crudo)}${trazo(`M${tx - 4} ${ty - 0.5} h7 M${tx - 4} ${ty + 2} h5`, C.quemado, 0.7, 0.8)}${trazo(`M${tx - 6} ${ty - 3} h12`, C.gris, 0.6)}</g>` +
      // La marca de la planchada pasó para este lado, más clara.
      nube(FX + 22, -132, 9, 6, C.quemado, 's', 0.16)),
  );
}

/** Los agujeros que se achican: la tela que baja y los tapa, como un párpado. */
function parpadosFantasma(): string {
  const d = huecos(1.6);
  return conGrano(
    conHuecos('m-ahogado-agujeros', d, forma(d, C.papel) + nube(A.agujeros[0][0] + 12, A.agujeros[0][1] - 6, 18, 6, C.papelClaro, 's', 0.7) + nube(A.agujeros[0][0] + 12, A.agujeros[0][1] + 7, 20, 3, C.gris, 's', 0.8)) +
    A.agujeros.map(([x, y], i) => trazo(`M${x - HUECOS[i]![0] - 1} ${y + HUECOS[i]![1] - 1} Q${x} ${y + HUECOS[i]![1] + 2} ${x + HUECOS[i]![0] + 1} ${y + HUECOS[i]![1] - 1}`, C.verdin, 1, 0.7)).join(''),
  );
}

/** El ruedo, que flamea: las puntas de la sábana, desparejas, y el nudo del piolín en la de la izquierda. */
function ruedo(): string {
  const r = A.ruedo;
  const pts: P[] = [[FX - 56, r - 2], [FX - 28, r - 6], [FX + 2, r - 4], [FX + 28, r - 4], [FX + 54, r - 2], [FX + 56, r + 10],
    [FX + 52, r + 28], [FX + 42, r + 17], [FX + 31, r + 32], [FX + 18, r + 18], [FX + 6, r + 31], [FX - 8, r + 18], [FX - 20, r + 31], [FX - 32, r + 18],
    [FX - 46, r + 30], [FX - 52, r + 18], [FX - 58, r + 8]];
  const d = curva(pts);
  const [nx, ny] = A.nudo;
  const adentro = curva([[FX - 50, r + 12], [FX - 20, r + 6], [FX + 20, r + 6], [FX + 50, r + 12], [FX + 30, r + 26], [FX - 30, r + 26]]);
  return conGrano(
    // Lo de adentro de la sábana, que se ve entre las puntas: está vacía, es noche.
    forma(adentro, C.verdin) + nube(FX, r + 16, 40, 6, C.hueco, 's', 0.8) +
    conHuecos('m-ahogado-ruedo', d,
      forma(d, C.papel) + nube(FX, r + 2, 60, 5, C.gris, 'm', 0.5) + nube(FX - 10, r + 24, 60, 8, C.gris, 's', 0.7) +
      // Las puntas se doblan para adentro: lo hondo de cada pliegue.
      [FX + 42, FX + 18, FX - 8, FX - 32].map((x) => nube(x, r + 16, 4, 10, C.gris, 's', 0.8)).join('') +
      [FX + 31, FX + 6, FX - 20].map((x) => nube(x - 2, r + 20, 3, 8, C.papelClaro, 's', 0.7)).join('') +
      nube(FX + 50, r + 14, 6, 14, C.gris, 's', 0.7)) +
    // El nudo: la punta de la sábana fruncida, y el piolín dado vueltas.
    forma(elipse(nx, ny, 5, 4), C.grisClaro) + nube(nx + 1, ny + 1, 3, 2, C.gris, 'xs', 0.8) +
    trazo(`M${nx - 5} ${ny - 1} q5 3 10 0 M${nx - 5} ${ny + 2} q5 3 10 0`, C.crudo, 1.4) + trazo(`M${nx - 5} ${ny - 1} q5 3 10 0 M${nx - 5} ${ny + 2} q5 3 10 0`, C.quemado, 0.5, 0.7),
  );
}

/** Una manga: la sábana colgando del brazo, con la punta redonda donde iría la mano. */
function manga(n: 0 | 1): string {
  const [sx, sy] = A.mangas[n];
  const s = n ? 1 : -1;
  const d = curva([[sx - s * 2, sy - 6], [sx + s * 9, sy - 2], [sx + s * 15, sy + 14], [sx + s * 17, sy + 32], [sx + s * 13, sy + 40], [sx + s * 5, sy + 38], [sx + s * 1, sy + 24], [sx - s * 4, sy + 8]]);
  return conGrano(
    conHuecos(`m-ahogado-manga-${n}`, d,
      forma(d, C.papel) + nube(sx + s * 4, sy + 2, 8, 6, C.papelClaro, 's', 0.8) + nube(sx + s * 12, sy + 26, 6, 14, C.gris, 'm', 0.7) +
      nube(sx + s * 9, sy + 38, 7, 4, C.verdinClaro, 's', 0.5) + trazo(`M${sx + s * 3} ${sy + 4} Q${sx + s * 11} ${sy + 18} ${sx + s * 10} ${sy + 34}`, C.gris, 1.2, 0.5)),
  );
}

/** La boca del BU: la tela que se abre para adentro, honda, con la sombra de la sábana adentro. */
function bocaFantasma(): string {
  const [x, y] = A.bocaF;
  const d = curva([[x, y - 13], [x + 10, y - 7], [x + 11, y + 4], [x + 5, y + 13], [x - 5, y + 12], [x - 11, y + 3], [x - 9, y - 8]]);
  return conGrano(
    forma(curva([[x, y - 16], [x + 13, y - 8], [x + 14, y + 5], [x + 6, y + 16], [x - 6, y + 15], [x - 14, y + 4], [x - 12, y - 10]]), C.gris, 0.7) +
    conHuecos('m-ahogado-boca-f', d, forma(d, C.hueco) + nube(x + 3, y + 4, 6, 7, C.verdin, 's', 0.9) + nube(x - 4, y - 8, 7, 3, C.verdinClaro, 's', 0.6)) +
    trazo(`M${x - 9} ${y - 9} Q${x} ${y - 15} ${x + 10} ${y - 7}`, C.papelClaro, 1.1, 0.7),
  );
}

/** Lo que chorrea del ruedo cuando vuelven del agua. */
function gotas(): string {
  const r = A.ruedo;
  const gota = (x: number, y: number, k: number): string => {
    const d = `M${f(x)} ${f(y - 3.4 * k)} Q${f(x + 2.2 * k)} ${f(y)} ${f(x)} ${f(y + 1.8 * k)} Q${f(x - 2.2 * k)} ${f(y)} ${f(x)} ${f(y - 3.4 * k)} Z`;
    return forma(d, C.grisClaro, 0.85) + forma(elipse(x - 0.5 * k, y, 0.5 * k, 0.6 * k), C.papelClaro);
  };
  return [[FX + 52, r + 36, 1.2], [FX + 31, r + 40, 1], [FX + 6, r + 38, 1.3], [FX - 20, r + 40, 1], [FX - 46, r + 36, 1.2], [FX + 40, r + 50, 0.8], [FX - 8, r + 52, 0.9], [FX - 34, r + 48, 0.7], [FX + 18, r + 56, 0.8]]
    .map(([x, y, k]) => gota(x!, y!, k!)).join('');
}

/** El piolín, del nudo del ruedo al tobillo del ahogado, que está abajo del agua. */
function piolin(): string {
  const [nx, ny] = A.nudo;
  const d = `M${nx} ${ny + 2} C${nx - 6} ${ny + 26} ${nx - 14} ${ny + 56} ${nx - 16} ${ny + 92} S${nx - 22} ${ny + 150} ${nx - 26} ${ny + 190}`;
  return trazo(d, C.quemado, 2.2, 0.7) + trazo(d, C.crudo, 1.2) + trazo(d, C.papelClaro, 0.4, 0.6);
}

/* ------------------------------------------------------------------
   El ahogado: la cabeza, los ojos, la boca, los brazos
   ------------------------------------------------------------------ */

const CRANEO: readonly P[] = [[0, -55], [-16, -52], [-26, -43], [-29, -29], [-28, -15], [-24, -3], [-14, 6], [0, 9], [14, 6], [24, -3], [28, -15], [29, -29], [26, -43], [16, -52]];

function cabeza(): string {
  const d = curva(CRANEO);
  const [[ax, ay], [bx, by]] = A.ojos;
  const orejas = [-1, 1].map((s) => {
    const o = elipse(s * 28.5, -21, 5, 8);
    return `<clipPath id="m-ahogado-oreja-${s > 0 ? 'd' : 'i'}"><path d="${o}"/></clipPath><g clip-path="url(#m-ahogado-oreja-${s > 0 ? 'd' : 'i'})">${forma(o, C.piel)}${nube(s * 29, -21, 3, 5, C.pielHonda, 's', 0.9)}${nube(s * 30, -24, 1.4, 3, C.brasa, 'xs', 0.4)}</g>`;
  }).join('');
  // El pelo pegado: la mata de arriba, aplastada, y los mechones que bajan por la frente y por las sienes.
  const mata = curva([[0, -57], [-17, -54], [-27, -45], [-30, -33], [-27, -36], [-22, -43], [-12, -42], [-4, -46], [6, -41], [16, -43], [24, -40], [29, -32], [27, -45], [17, -54]]);
  const mechones = [
    `M-6 -46 Q-12 -38 -10 -33 Q-9 -36 -6 -38`, `M4 -45 Q2 -38 5 -34 Q5 -38 8 -40`, `M-20 -44 Q-26 -32 -24 -22`, `M22 -42 Q27 -32 25 -20`,
    `M-26 -38 Q-30 -26 -29 -12`, `M27 -36 Q31 -24 29 -10`, `M12 -44 Q17 -38 15 -33`,
  ];
  const ojo = (x: number, y: number, r: number): string =>
    forma(elipse(x, y, r, r - 0.4), C.papelClaro) + nube(x + 1, y + 2.4, r * 0.8, r * 0.5, C.grisClaro, 's', 0.8) + nube(x, y + r, r, 2, C.brasa, 's', 0.35) +
    trazo(`M${x - r} ${y - 1} Q${x} ${y - r - 1.6} ${x + r} ${y - 1}`, C.tinta, 0.9, 0.8) +
    // Las venitas de los ojos fuera de la órbita.
    trazo(`M${x - r} ${y + 1} q${r * 0.4} -1 ${r * 0.6} 0.6 M${x + r} ${y - 1} q${-r * 0.4} 1 ${-r * 0.6} 0 M${x + r * 0.2} ${y + r - 0.5} q0 -2 -1 -3`, C.brasa, 0.45, 0.7);
  return conGrano(
    orejas +
    `<clipPath id="m-ahogado-craneo"><path d="${d}"/></clipPath><g clip-path="url(#m-ahogado-craneo)">` +
    forma(d, C.piel) +
    // El verdín del ahogado: la cara se le pone del color del agua de abajo para arriba.
    nube(0, 6, 34, 12, C.verdinClaro, 'm', 0.75) + nube(0, -2, 30, 10, C.verdin, 'l', 0.55) + nube(-20, -14, 6, 8, C.verdin, 'm', 0.5) + nube(20, -14, 6, 8, C.verdin, 'm', 0.6) + nube(-18, -8, 8, 10, C.pielHonda, 'm', 0.8) + nube(18, -8, 8, 10, C.pielHonda, 'm', 0.8) +
    nube(-6, -42, 14, 6, C.pielClara, 'm', 0.85) + nube(22, -24, 6, 14, C.pielHonda, 'm', 0.7) + nube(-24, -24, 4, 12, C.pielClara, 's', 0.4) +
    // Las cuencas hundidas, y las ojeras de no dormir.
    nube(ax, ay + 1, 12, 11, C.verdin, 'm', 0.95) + nube(bx, by + 1, 12, 11, C.verdin, 'm', 0.95) + nube(ax, ay, 9, 9, C.hueco, 's', 0.6) + nube(bx, by, 8, 8, C.hueco, 's', 0.6) + nube(ax, ay + 10, 7, 2.6, C.brasa, 's', 0.3) + nube(bx, by + 10, 7, 2.6, C.brasa, 's', 0.3) +
    `</g>` +
    // Los ojos, redondos, afuera de la órbita: uno más grande que el otro.
    ojo(ax, ay, 8) + ojo(bx, by, 7.2) +
    // Las cejas, por el techo.
    trazo(`M${ax - 9} ${ay - 9} Q${ax - 2} ${ay - 17} ${ax + 7} ${ay - 12}`, C.tinta, 2.4) + trazo(`M${bx - 7} ${by - 12} Q${bx + 2} ${by - 18} ${bx + 9} ${by - 9}`, C.tinta, 2.2) +
    // El pelo, negro de tinta, pegado, con el brillo opaco del agua.
    `<clipPath id="m-ahogado-mata"><path d="${mata}"/></clipPath><g clip-path="url(#m-ahogado-mata)">${forma(mata, C.tinta)}${nube(-6, -52, 12, 3, C.verdinClaro, 's', 0.8)}${nube(10, -50, 6, 2, C.gris, 'xs', 0.5)}</g>` +
    mechones.map((m, i) => trazo(m, C.tinta, i < 2 ? 2.4 : 1.8) + trazo(m, C.verdinClaro, 0.6, 0.6)).join('') +
    // La nariz afuera del agua: grande, colorada de frío en la punta.
    forma(curva([[0, -24], [4, -16], [7, -10], [6, -5], [0, -4], [-6, -5], [-7, -10], [-4, -16]]), C.piel) +
    nube(1, -8, 6, 4, C.brasa, 'm', 0.3) + nube(-2, -17, 2, 4, C.pielClara, 's', 0.8) + nube(5, -10, 2, 4, C.pielHonda, 's', 0.7) +
    forma(elipse(-3, -5.6, 1.6, 1), C.hueco) + forma(elipse(3, -5.6, 1.6, 1), C.hueco) +
    // El bigote mojado, caído, que chorrea en el agua.
    forma(curva([[-12, 2], [-10, -3], [-4, -4], [0, -3], [4, -4], [10, -3], [12, 2], [8, -1], [3, -1], [0, 0], [-3, -1], [-8, -1]]), C.tinta) +
    trazo('M-11 1 l-1 4 M11 1 l1 5 M-6 0 l0 4', C.verdinClaro, 0.6, 0.7) +
    // Las gotas que le corren por la cara.
    [[-20, -12, 1.2], [14, -36, 0.9], [-8, -30, 0.8], [21, -6, 1]].map(([x, y, r]) => forma(elipse(x!, y!, r! * 0.8, r!), C.papelClaro, 0.85)).join(''),
  );
}

/** Las pupilas, chiquitas, en el medio del blanco: miran para donde miran. */
function pupilas(): string {
  const [[ax, ay], [bx, by]] = A.ojos;
  return [[ax, ay, 2.1], [bx, by, 1.8]].map(([x, y, r]) => forma(elipse(x!, y!, r!, r!), C.hueco) + forma(elipse(x! - 0.7, y! - 0.7, 0.6, 0.6), C.papelClaro)).join('');
}

/** Los párpados, de la misma piel verde: bajan para pestañear. */
function parpados(): string {
  const [[ax, ay], [bx, by]] = A.ojos;
  return conGrano([[ax, ay, 9.6], [bx, by, 8.8]].map(([x, y, r]) => {
    const d = elipse(x!, y!, r!, r!);
    return `<clipPath id="m-ahogado-parpado-${x! < 0 ? 'i' : 'd'}"><path d="${d}"/></clipPath><g clip-path="url(#m-ahogado-parpado-${x! < 0 ? 'i' : 'd'})">${forma(d, C.piel)}${nube(x!, y! - 4, r!, 4, C.pielClara, 's', 0.7)}${nube(x!, y! + 6, r!, 4, C.pielHonda, 's', 0.8)}</g>` +
      trazo(`M${x! - r!} ${y! + 1} Q${x!} ${y! + r! * 0.9} ${x! + r!} ${y! + 1}`, C.tinta, 1);
  }).join(''));
}

/** La boca a ras del agua: redonda, del glu glu. */
function boca(): string {
  const [x, y] = A.boca;
  return forma(elipse(x, y + 1, 6.4, 5.6), C.brasa) + forma(elipse(x, y + 1.4, 4.8, 4.2), C.hueco) + nube(x, y + 3, 3, 2, C.verdin, 'xs', 0.8);
}

/** Un brazo, del hombro (abajo del agua) a la muñeca: la manga del saco mojado y el puño de la camisa. */
function manga_saco(h: P, w: P, ancho: number): string {
  const [nx, ny] = normal(h, w);
  const d = poli([[h[0] + nx * ancho, h[1] + ny * ancho], [w[0] + nx * ancho * 0.8, w[1] + ny * ancho * 0.8], [w[0] - nx * ancho * 0.8, w[1] - ny * ancho * 0.8], [h[0] - nx * ancho, h[1] - ny * ancho]]);
  const [mx, my] = a(h, w, 0.6);
  const [px, py] = a(h, w, 0.97);
  return `<clipPath id="m-ahogado-saco-${Math.round(h[0])}"><path d="${d}"/></clipPath><g clip-path="url(#m-ahogado-saco-${Math.round(h[0])})">` +
    forma(d, C.tinta) + nube(mx + nx * ancho * 0.4, my + ny * ancho * 0.4, ancho * 0.4, 18, C.verdinClaro, 's', 0.9, Math.atan2(w[1] - h[1], w[0] - h[0]) * 57.3 + 90) +
    // Las arrugas del saco empapado.
    [0.45, 0.62, 0.78].map((t) => {
      const [x, y] = a(h, w, t);
      return trazo(`M${f(x - nx * ancho)} ${f(y - ny * ancho)} q${f(nx * ancho)} ${f(ny * ancho - 3)} ${f(nx * ancho * 1.8)} ${f(ny * ancho * 1.8)}`, C.gris, 0.8, 0.45);
    }).join('') + `</g>` +
    // El puño de la camisa, blanco, con el gemelo.
    forma(poli([[px + nx * ancho * 0.9, py + ny * ancho * 0.9], [w[0] + nx * ancho * 0.9 + (w[0] - h[0]) * 0.06, w[1] + ny * ancho * 0.9 + (w[1] - h[1]) * 0.06], [w[0] - nx * ancho * 0.9 + (w[0] - h[0]) * 0.06, w[1] - ny * ancho * 0.9 + (w[1] - h[1]) * 0.06], [px - nx * ancho * 0.9, py - ny * ancho * 0.9]]), C.papel) +
    forma(elipse(px + nx * ancho * 0.5, py + ny * ancho * 0.5, 1.2, 1.2), C.moneda);
}

/** El brazo que pide auxilio, con la mano abierta y la moneda para el barquero entre los dedos. */
function brazoAuxilio(): string {
  const h = A.hombros[0];
  const [hx, hy] = A.manos[0];
  const w: P = [hx - 5, hy + 18];
  const [mx, my] = A.moneda;
  // La mano abierta, la palma para el que mira: los dedos separados y el pulgar con el índice que agarran la moneda.
  const palma = curva([[hx - 8, hy + 12], [hx - 9, hy + 2], [hx - 6, hy - 5], [hx + 2, hy - 7], [hx + 8, hy - 2], [hx + 7, hy + 8], [hx + 2, hy + 14]]);
  const dedo = (x0: number, y0: number, x1: number, y1: number, g: number): string =>
    trazo(`M${x0} ${y0} Q${(x0 + x1) / 2 + g} ${(y0 + y1) / 2} ${x1} ${y1}`, C.pielHonda, 5.2) + trazo(`M${x0} ${y0} Q${(x0 + x1) / 2 + g} ${(y0 + y1) / 2} ${x1} ${y1}`, C.piel, 3.8) +
    forma(elipse(x1, y1, 1.4, 1.2), C.pielClara, 0.8);
  return conGrano(
    manga_saco(h, w, 8) +
    `<clipPath id="m-ahogado-palma"><path d="${palma}"/></clipPath><g clip-path="url(#m-ahogado-palma)">${forma(palma, C.piel)}${nube(hx - 2, hy + 2, 5, 6, C.pielClara, 's', 0.7)}${nube(hx + 6, hy + 6, 4, 7, C.pielHonda, 's', 0.8)}${trazo(`M${hx - 6} ${hy + 4} q5 -2 10 2`, C.pielHonda, 0.7, 0.8)}</g>` +
    // Los tres dedos de atrás, abiertos: el que pide auxilio no los puede juntar.
    dedo(hx - 7, hy - 3, hx - 16, hy - 16, -2) + dedo(hx - 3, hy - 6, hx - 7, hy - 22, -1) + dedo(hx + 1, hy - 7, hx + 1, hy - 23, 1) +
    // El índice y el pulgar, que tienen la moneda de canto.
    dedo(hx + 5, hy - 5, mx - 2, my + 4, 2) + dedo(hx + 7, hy + 3, mx + 5, my + 6, 3) +
    // La moneda: de las de antes, gastada, con la cara de alguien que ya nadie se acuerda.
    forma(elipse(mx, my, 6.4, 6.4), C.monedaHonda) + forma(elipse(mx - 0.4, my - 0.4, 5.4, 5.4), C.moneda) +
    trazo(elipse(mx - 0.4, my - 0.4, 4.2, 4.2), C.monedaHonda, 0.6, 0.8) +
    trazo(`M${mx - 1.6} ${my + 2.6} q-1 -3 0.4 -4.6 q1.4 -1 2.6 0.4 l0.4 1.4 l-0.6 0.2 q0.4 1.8 -1 2.6`, C.monedaHonda, 0.7) +
    forma(elipse(mx - 2.4, my - 2.6, 1.4, 0.9), C.papelClaro, 0.9),
  );
}

/** El brazo del salvavidas: la mano que no lo suelta, y el salvavidas desinflado, que no flota. */
function brazoSalvavidas(): string {
  const h = A.hombros[1];
  const [hx, hy] = A.manos[1];
  const [sx, sy] = A.salvavidas;
  const w: P = [hx + 6, hy + 4];
  // Desinflado, el salvavidas no es un aro: es una tripa chata, arrugada, que se hunde de un lado.
  const tripa = curva([[sx - 34, sy + 3], [sx - 30, sy - 6], [sx - 16, sy - 10], [sx, sy - 8], [sx + 18, sy - 11], [sx + 32, sy - 6], [sx + 36, sy + 1], [sx + 26, sy + 5], [sx + 8, sy + 4], [sx - 10, sy + 6], [sx - 26, sy + 6]]);
  // Las franjas: rojo de bandera y crudo, torcidas como se tuerce lo que se desinfla.
  const franjas = [-26, -6, 14, 30].map((x, i) => forma(poli([[sx + x - 6, sy - 14], [sx + x + 5, sy - 14], [sx + x + 8 - i, sy + 8], [sx + x - 3 - i, sy + 8]]), C.crudo)).join('');
  // El agujerito del medio, cerrado: ya no le entra nadie.
  const medio = curva([[sx - 12, sy - 2], [sx - 2, sy - 4], [sx + 10, sy - 3], [sx + 1, sy - 1]]);
  const pu = (x: number, y: number): string => forma(elipse(x, y, 3.6, 3), C.piel) + nube(x + 1, y + 1, 2, 1.6, C.pielHonda, 'xs', 0.8);
  return conGrano(
    `<clipPath id="m-ahogado-salvavidas"><path d="${tripa}"/></clipPath><g clip-path="url(#m-ahogado-salvavidas)">` +
    forma(tripa, C.rojo) + franjas + nube(sx, sy - 9, 36, 3, C.papelClaro, 's', 0.45) + nube(sx, sy + 5, 40, 4, C.rojoHondo, 's', 0.9) +
    // Las arrugas de lo que se desinfló.
    [[-20, -8, 14], [-2, -6, 10], [16, -9, 12], [-28, 0, 8], [24, 0, 10]].map(([x, y, l]) => trazo(`M${sx + x!} ${sy + y!} q${l! / 2} 4 ${l!} 0`, C.rojoHondo, 1.2, 0.7) + trazo(`M${sx + x!} ${sy + y! - 1.2} q${l! / 2} 4 ${l!} 0`, C.papelClaro, 0.5, 0.5)).join('') +
    forma(medio, C.hueco, 0.85) + `</g>` +
    // El pico para inflarlo, abierto, que fue por donde se le fue el aire.
    forma(cajaRedonda(sx + 18, sy - 17, 5, 7, 1.4), C.crudo) + forma(elipse(sx + 20.5, sy - 17, 2.6, 1.2), C.rojoHondo) + forma(elipse(sx + 20.5, sy - 17, 1.2, 0.6), C.hueco) +
    // La soga de alrededor, floja, con un nudo.
    trazo(`M${sx - 32} ${sy - 4} Q${sx - 20} ${sy - 16} ${sx - 6} ${sy - 10} Q${sx + 8} ${sy - 16} ${sx + 30} ${sy - 9}`, C.crudo, 1.4, 0.9) + trazo(`M${sx - 32} ${sy - 4} Q${sx - 20} ${sy - 16} ${sx - 6} ${sy - 10}`, C.quemado, 0.5, 0.6) +
    manga_saco(h, w, 6.4) +
    // El puño cerrado, agarrado del borde del salvavidas: los nudillos blancos.
    pu(hx - 2, hy - 2) + pu(hx + 3, hy - 3) + pu(hx + 7, hy - 1) + forma(elipse(hx + 2, hy + 1, 7, 4), C.piel) +
    [hx - 2, hx + 3, hx + 7].map((x) => forma(elipse(x, hy - 3.6, 1.2, 0.8), C.pielClara)).join('') +
    trazo(`M${hx - 5} ${hy + 1} q6 2 13 0`, C.pielHonda, 0.7),
  );
}

/** El sombrero, que flota solo: el de fieltro negro, con la cinta colorada y la copa hundida. */
function sombrero(): string {
  const [x, y] = A.sombrero;
  const ala = curva([[x - 26, y + 1], [x - 18, y - 5], [x, y - 7], [x + 18, y - 5], [x + 26, y + 1], [x + 14, y + 4], [x - 14, y + 4]]);
  const copa = curva([[x - 13, y - 4], [x - 13, y - 16], [x - 8, y - 22], [x - 1, y - 18], [x + 5, y - 23], [x + 12, y - 17], [x + 13, y - 4]]);
  return conGrano(
    `<clipPath id="m-ahogado-ala"><path d="${ala}"/></clipPath><g clip-path="url(#m-ahogado-ala)">${forma(ala, C.tinta)}${nube(x - 8, y - 4, 14, 2, C.verdinClaro, 's', 0.9)}${nube(x, y + 3, 26, 2, C.hueco, 's', 0.8)}</g>` +
    `<clipPath id="m-ahogado-copa"><path d="${copa}"/></clipPath><g clip-path="url(#m-ahogado-copa)">${forma(copa, C.tinta)}${nube(x - 7, y - 14, 4, 8, C.verdinClaro, 's', 0.9)}${nube(x + 9, y - 12, 4, 8, C.hueco, 's', 0.8)}` +
    forma(poli([[x - 14, y - 9], [x + 14, y - 9], [x + 14, y - 4], [x - 14, y - 4]]), C.rojoHondo) + nube(x - 5, y - 8, 6, 1.4, C.rojo, 'xs', 0.9) + `</g>` +
    // El moño de la cinta, y lo que el agua le dejó encima: una hoja.
    forma(elipse(x + 11, y - 6.4, 2.4, 2), C.rojoHondo) + trazo(`M${x - 4} ${y - 19} q4 -3 8 -1`, C.alga, 1.6, 0.8) +
    forma(elipse(x - 3, y - 21, 1, 0.8), C.papelClaro, 0.8),
  );
}

/** El chorrito que escupe: sube, se arquea y cae al agua, con las gotas sueltas. */
function chorro(): string {
  const d = 'M6 -1 C20 -8 40 -24 56 -22 S76 -8 82 -1';
  return trazo(d, C.gris, 3.2, 0.45) + trazo(d, C.papelClaro, 1.6, 0.9) +
    [[50, -30, 1.2], [66, -26, 1], [40, -30, 0.9], [78, -12, 1.1]].map(([x, y, r]) => forma(elipse(x!, y!, r!, r! * 1.2), C.papelClaro, 0.9)).join('') +
    trazo('M78 -2 l-3 -5 M82 -2 l0 -6 M86 -2 l3 -5', C.papelClaro, 0.8, 0.8);
}

/** Una burbuja: aire con borde, transparente, con el brillo de la luz. */
const burbuja = (x: number, y: number, r: number): string =>
  forma(elipse(x, y, r, r), C.pielClara, 0.14) + trazo(elipse(x, y, r, r), C.papelClaro, Math.max(0.5, r * 0.18), 0.8) +
  trazo(`M${f(x + r * 0.2)} ${f(y + r * 0.85)} A${f(r)} ${f(r)} 0 0 0 ${f(x + r * 0.9)} ${f(y + r * 0.1)}`, C.gris, Math.max(0.5, r * 0.2), 0.6) +
  forma(elipse(x - r * 0.4, y - r * 0.4, r * 0.28, r * 0.22), C.papelClaro);

/** Un racimo de burbujas del glu glu, que sale de la boca. */
function burbujas(n: 0 | 1): string {
  const r = n ? [[3, -10, 5], [-5, -18, 3], [6, -26, 3.6], [-2, -32, 2.4]] : [[-3, -9, 4], [5, -16, 3], [-4, -24, 5.4], [4, -34, 2.6]];
  return r.map(([x, y, k]) => burbuja(x!, y!, k!)).join('');
}

/** El glu glu grande: el agua que hierve donde se fue a pique, y las burbujas que suben de a montones. */
function burbujon(): string {
  const [x, y] = A.boca;
  const espuma = nube(x, y + 1, 40, 4, C.papel, 's', 0.5) + [-32, -18, -4, 10, 24, 36].map((dx, i) => trazo(`M${x + dx - 6} ${y + 1} q6 ${-4 - (i % 2) * 3} 12 0`, C.papelClaro, 1, 0.8)).join('');
  const sueltas = [[-26, -10, 6], [-12, -22, 8], [6, -14, 5], [20, -28, 7], [-4, -40, 6], [28, -8, 4], [-30, -34, 4], [12, -50, 5], [-16, -60, 4], [24, -64, 3.4], [0, -72, 3], [-36, -18, 3]];
  return espuma + sueltas.map(([dx, dy, r]) => burbuja(x + dx!, y + dy!, r!)).join('');
}

/** El alga que le queda colgando de la cabeza cuando vuelve, y adentro de ella el pescado. */
function alga(): string {
  const tiras = [
    'M-20 -48 Q-28 -40 -30 -26 Q-32 -16 -28 -8', 'M-12 -53 Q-20 -46 -22 -36', 'M0 -56 Q-4 -46 -2 -38', 'M14 -53 Q24 -46 28 -32 Q30 -22 27 -12', 'M22 -48 Q30 -40 33 -30',
  ];
  return conGrano(
    nube(0, -52, 22, 5, C.alga, 's', 0.8) +
    tiras.map((d, i) => trazo(d, C.verdin, 6.4, 0.7) + trazo(d, C.alga, i % 2 ? 3.8 : 4.8) + trazo(d, C.pielClara, 0.7, 0.45)).join('') +
    trazo('M-24 -50 Q0 -60 26 -50', C.alga, 4) + trazo('M-24 -51 Q0 -61 26 -51', C.pielClara, 0.7, 0.4),
  );
}

/** El pescado, acostado arriba de la cabeza, que coletea: plateado, con la boca abierta, como el ahogado. */
function pescado(): string {
  const [x, y] = A.pescado;
  const cuerpo = curva([[x - 15, y], [x - 8, y - 5], [x + 4, y - 5.4], [x + 12, y - 2], [x + 14, y + 1], [x + 4, y + 4.4], [x - 8, y + 4]]);
  return conGrano(
    `<clipPath id="m-ahogado-pescado"><path d="${cuerpo}"/></clipPath><g clip-path="url(#m-ahogado-pescado)">${forma(cuerpo, C.gris)}${nube(x, y + 3, 14, 2, C.papelClaro, 's', 0.9)}${nube(x - 2, y - 4, 12, 2, C.verdinClaro, 's', 0.8)}` +
    [-6, -2, 2, 6].map((dx) => trazo(`M${x + dx} ${y - 3} q2 2 0 4`, C.verdinClaro, 0.5, 0.6)).join('') + `</g>` +
    // La cola en horquilla, y la aleta.
    forma(poli([[x + 12, y - 1], [x + 22, y - 7], [x + 19, y], [x + 22, y + 6], [x + 12, y + 2]]), C.grisClaro) + trazo(`M${x + 14} ${y} l6 -4 M${x + 14} ${y + 1} l6 3`, C.gris, 0.5) +
    forma(poli([[x - 2, y - 5], [x + 4, y - 9], [x + 6, y - 5]]), C.grisClaro) +
    trazo(`M${x - 8} ${y - 3} q2 3 0 6`, C.rojoHondo, 0.9) +
    forma(elipse(x - 11, y - 1, 1.6, 1.6), C.papelClaro) + forma(elipse(x - 11, y - 1, 0.8, 0.8), C.hueco) +
    forma(elipse(x - 15, y + 0.6, 1.2, 1), C.brasa),
  );
}

/** Las ondas del agua alrededor de los dos, delante del cuerpo: tapan el corte y dicen que están adentro. */
function ondas(): string {
  const anillo = (cx: number, rx: number, o: number): string =>
    trazo(`M${cx - rx} ${AGUA - 3} Q${cx} ${AGUA + rx * 0.16} ${cx + rx} ${AGUA - 3}`, C.papelClaro, 1.4, o) +
    trazo(`M${cx - rx + 4} ${AGUA - 1} Q${cx} ${AGUA + rx * 0.16 + 2} ${cx + rx - 4} ${AGUA - 1}`, C.verdin, 1.6, o * 0.6);
  return nube(0, AGUA - 1, 44, 3, C.noche, 's', 0.6) +
    anillo(0, 34, 0.9) + anillo(0, 56, 0.6) + anillo(0, 84, 0.35) +
    anillo(A.salvavidas[0], 30, 0.5) + anillo(A.sombrero[0], 32, 0.6) + anillo(A.sombrero[0], 48, 0.3) +
    trazo(`M-30 ${AGUA - 3} q8 -2 16 0 M14 ${AGUA - 3} q8 -2 16 0`, C.papelClaro, 1.6, 0.9);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.4;
const [[O1x, O1y], [O2x, O2y]] = A.ojos;
const [[H1x, H1y], [H2x, H2y]] = A.agujeros;

export const PIEZAS_AHOGADO: readonly Pieza[] = [
  { nombre: 'ahogado-piolin', caja: [A.nudo[0] - 32, A.nudo[1] - 4, 40, 200], dibujo: piolin(), densidad: 1.6 },
  { nombre: 'ahogado-sabana', caja: [FX - 60, -222, 116, 126], dibujo: sabana(), densidad: 2.6 },
  { nombre: 'ahogado-espalda', caja: [FX - 60, -222, 116, 126], dibujo: espalda(), densidad: 2 },
  { nombre: 'ahogado-agujeros', caja: [H1x - 10, H1y - 12, H2x - H1x + 20, 24], dibujo: parpadosFantasma(), densidad: D },
  { nombre: 'ahogado-boca-f', caja: [A.bocaF[0] - 16, A.bocaF[1] - 18, 32, 36], dibujo: bocaFantasma(), densidad: D },
  { nombre: 'ahogado-ruedo', caja: [FX - 62, A.ruedo - 10, 124, 46], dibujo: ruedo(), densidad: 2.6 },
  { nombre: 'ahogado-gotas', caja: [FX - 52, A.ruedo + 30, 108, 32], dibujo: gotas(), densidad: 2.4 },
  { nombre: 'ahogado-brazo-2', caja: [-118, -26, 112, 46], dibujo: brazoSalvavidas(), densidad: D },
  { nombre: 'ahogado-cabeza', caja: [-36, -62, 72, 74], dibujo: cabeza(), densidad: D },
  { nombre: 'ahogado-pupilas', caja: [O1x - 6, O1y - 6, O2x - O1x + 12, 12], dibujo: pupilas(), densidad: D * 2 },
  { nombre: 'ahogado-parpados', caja: [O1x - 12, O1y - 12, O2x - O1x + 24, 24], dibujo: parpados(), densidad: D },
  { nombre: 'ahogado-boca', caja: [A.boca[0] - 8, A.boca[1] - 7, 16, 16], dibujo: boca(), densidad: D * 1.5 },
  { nombre: 'ahogado-alga', caja: [-36, -66, 74, 64], dibujo: alga(), densidad: D },
  { nombre: 'ahogado-pescado', caja: [A.pescado[0] - 18, A.pescado[1] - 12, 44, 22], dibujo: pescado(), densidad: D * 1.4 },
  { nombre: 'ahogado-brazo-1', caja: [8, -112, 72, 130], dibujo: brazoAuxilio(), densidad: D },
  { nombre: 'ahogado-manga-1', caja: [A.mangas[0][0] - 24, A.mangas[0][1] - 10, 32, 56], dibujo: manga(0), densidad: D },
  { nombre: 'ahogado-manga-2', caja: [A.mangas[1][0] - 8, A.mangas[1][1] - 10, 32, 56], dibujo: manga(1), densidad: D },
  { nombre: 'ahogado-sombrero', caja: [A.sombrero[0] - 30, A.sombrero[1] - 28, 60, 36], dibujo: sombrero(), densidad: D },
  { nombre: 'ahogado-chorro', caja: [-4, -38, 96, 42], dibujo: chorro(), densidad: 2.4 },
  { nombre: 'ahogado-burbujas-1', caja: [-14, -44, 28, 42], dibujo: burbujas(0), densidad: D },
  { nombre: 'ahogado-burbujas-2', caja: [-14, -44, 28, 42], dibujo: burbujas(1), densidad: D },
  { nombre: 'ahogado-burbujon', caja: [-48, -82, 96, 90], dibujo: burbujon(), densidad: 2.4 },
  { nombre: 'ahogado-ondas', caja: [-114, AGUA - 10, 290, 24], dibujo: ondas(), densidad: 2 },
];

const img = imagenesDe(PIEZAS_AHOGADO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/**
 * Los dos armados con las marcas de un momento. Lo que baja de la línea del agua no se ve: el recorte va
 * con un nombre propio por cada uso, para que el títere y el retrato no se pisen el id. Adentro del agua
 * quedan los dos; afuera, lo que flota y lo que es aire: el sombrero, las ondas, el chorro y las burbujas.
 */
function armado(m: Momento, recorte: string): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    `<clipPath id="${recorte}"><rect x="-400" y="-500" width="800" height="${500 + AGUA}"/></clipPath>` +
    `<g clip-path="url(#${recorte})">` +
    // El piolín va por detrás del ahogado; la sábana también, y las mangas por delante, todo con la misma cuenta.
    parte('piolin', img('ahogado-piolin'), t.piolin) +
    parte('fantasma',
      img('ahogado-sabana') +
      parte('espalda', img('ahogado-espalda'), '', o.espalda) +
      parte('agujeros', img('ahogado-agujeros'), t.agujeros) +
      parte('boca-f', img('ahogado-boca-f'), t['boca-f'], o['boca-f']) +
      parte('ruedo', img('ahogado-ruedo'), t.ruedo) +
      parte('gotas', img('ahogado-gotas'), t.gotas, o.gotas),
      t.fantasma) +
    parte('ahogado',
      parte('brazo-2', img('ahogado-brazo-2'), t['brazo-2']) +
      parte('cabeza',
        img('ahogado-cabeza') +
        parte('pupilas', img('ahogado-pupilas'), t.pupilas) +
        parte('parpados', img('ahogado-parpados'), t.parpados) +
        parte('boca', img('ahogado-boca'), t.boca) +
        parte('alga', img('ahogado-alga') + parte('pescado', img('ahogado-pescado'), t.pescado), '', o.alga),
        t.cabeza) +
      parte('brazo-1', img('ahogado-brazo-1'), t['brazo-1']),
      t.ahogado) +
    parte('fantasma-delante',
      parte('manga-1', img('ahogado-manga-1'), t['manga-1']) +
      parte('manga-2', img('ahogado-manga-2'), t['manga-2']),
      t['fantasma-delante']) +
    `</g>` +
    parte('sombrero', img('ahogado-sombrero'), t.sombrero) +
    parte('ondas', img('ahogado-ondas'), t.ondas, o.ondas) +
    parte('chorro', img('ahogado-chorro'), t.chorro, o.chorro) +
    parte('burbujas-1', img('ahogado-burbujas-1'), t['burbujas-1'], o['burbujas-1']) +
    parte('burbujas-2', img('ahogado-burbujas-2'), t['burbujas-2'], o['burbujas-2']) +
    parte('burbujon', img('ahogado-burbujon'), t.burbujon, o.burbujon)
  );
}

/** Los dos en un momento, sin lo que los hace tocables: para el test, el retrato y para mirarlos. */
export function ahogadoEn(m: Momento = QUIETO, recorte = 'm-ahogado-agua-mirar'): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m, recorte)}</g>`;
}

/** El títere que se toca, en la pose quieta: el agua a la boca, la moneda arriba y el fantasma encima. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--ahogado" data-id="el-ahogado-y-su-fiel-fantasma" role="button" tabindex="0" aria-label="${nombres.get('el-ahogado-y-su-fiel-fantasma') ?? 'El ahogado y su fiel fantasma'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO, 'm-ahogado-agua-titere')}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: el fantasma inflado haciendo BU, y el ahogado haciendo glu glu. */
export const RETRATO = { caja: [-250, 336, 226, 184] as const };
function retrato(): string {
  // La sala y el agua, en sus cajas de `arte-bajo.ts`.
  return `<image href="/bestiario/bajo-lejos.webp" x="-250" y="0" width="1450" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/bajo-agua.webp" x="-250" y="368" width="1450" height="272" preserveAspectRatio="none"/>` + ahogadoEn(BU, 'm-ahogado-agua-retrato');
}

export const AHOGADO_PERSONAJE: Personaje = {
  id: 'el-ahogado-y-su-fiel-fantasma',
  region: 'el-bajo',
  ancla: AHOGADO.x,
  piezas: PIEZAS_AHOGADO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};

