/**
 * La tipa rapaz (`D-73`, vigesimocuarta vuelta), parada detrás de la mesa servida, entre las mantis y el verdugo.
 *
 * *"Una tipa rapaz / como te gusta a vos"* es de *Un poco de amor francés*, en *La mosca y la sopa* (1991).
 * En la letra no hay más que eso: una tipa que se queda con lo que hay. Acá es una señora de fiesta recortada
 * de una revista de sociales, como todo lo de la mesa es recorte del collage de la contratapa: lleva el canto
 * de papel donde pasó la tijera. Y es un ave de presa sin dejar de ser una persona: la nariz de pico, los
 * párpados pesados de quien mira desde arriba, el peinado batido que se le va para atrás como un copete, la
 * estola de plumas barradas que le hace de collar de buitre, y las uñas largas, pintadas, curvas como garras.
 *
 * Lo del dibujo, que no está en la letra: un anillo distinto en cada dedo y tres pulseras que no hacen juego
 * (ninguna se compró pensando en las otras), el carmín en el borde de la copa, la guinda pinchada en un
 * palillo, el broche de la estola, que es una garra agarrando una perla, y la billetera de cuero que alguien
 * se olvidó en el mantel, delante suyo.
 *
 * Viste la tapa de *La mosca y la sopa*, medida con sharp: el vestido es el negro del cartel del título y la
 * gente en la oscuridad, las lentejuelas son las luces del techo del estadio, la piel es el halo del seguidor,
 * el peinado es el amarillo de las letras, la estola es la gente donde le pega la luz, barrada con el rosado
 * del escenario, y las uñas, la boca y el cóctel son el rojo del fondo de la tapa.
 *
 * Coordenadas del títere: el (0, 0) es el canto de atrás del tablero, debajo de su cintura (`rig-rapaz.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { BRINDA, QUIETO, RAPAZ, RAPAZ_ARMADO as A, codoDibujado, marcas, munecaDibujada, type Momento } from './rig-rapaz.ts';

/** Las tintas de *La mosca y la sopa* (`tokens.css`), y el papel del collage de la mesa para el canto. */
const C = {
  negro: 'var(--bestia-rapaz-negro)',
  hondo: 'var(--bestia-rapaz-hondo)',
  pardo: 'var(--bestia-rapaz-pardo)',
  salmon: 'var(--bestia-rapaz-salmon)',
  rosa: 'var(--bestia-rapaz-rosa)',
  violeta: 'var(--bestia-rapaz-violeta)',
  rojo: 'var(--bestia-rapaz-rojo)',
  piel: 'var(--bestia-rapaz-piel)',
  pielClara: 'var(--bestia-rapaz-piel-clara)',
  luz: 'var(--bestia-rapaz-luz)',
  perla: 'var(--bestia-rapaz-perla)',
  amarillo: 'var(--bestia-rapaz-amarillo)',
  peloHondo: 'var(--bestia-rapaz-pelo-hondo)',
  canto: 'var(--entorno-mesa-papel)',
};

/** Un azar con semilla (mulberry32): las lentejuelas caen siempre en el mismo lugar. */
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

/** El canto del recorte: la silueta un poco más gorda, en el papel del collage, por debajo de todo. */
const canto = (d: string, ancho = 4): string =>
  `<path d="${d}" fill="${C.canto}" stroke="${C.canto}" stroke-width="${ancho}" stroke-linejoin="round"/>`;

/**
 * Una pluma de la estola, apuntando a `ang` grados: larga y blanda, soplada, con la barra en ángulo de las
 * plumas de un halcón y la punta clara. Nada de borde duro: es pluma, no caparazón.
 */
function pluma(x: number, y: number, ang: number, largo: number, ancho: number, k: number): string {
  const a = (ang * Math.PI) / 180;
  const [ux, uy] = [Math.cos(a), Math.sin(a)];
  const [vx, vy] = [-uy, ux];
  const en = (t: number, s: number): P => [x + ux * largo * t + vx * ancho * s, y + uy * largo * t + vy * ancho * s];
  const d = curva([en(0, 0), en(0.25, 0.8), en(0.65, 0.9), en(1, 0), en(0.65, -0.9), en(0.25, -0.8)]);
  const barra = (t: number): string => {
    const [p, q, r] = [en(t, -0.8), en(t + 0.12, 0), en(t, 0.8)];
    return trazo(`M${f(p[0])} ${f(p[1])} L${f(q[0])} ${f(q[1])} L${f(r[0])} ${f(r[1])}`, k % 4 === 1 ? C.rosa : C.salmon, ancho * 0.36, 0.7);
  };
  const [tx, ty] = en(0.9, 0);
  return (
    soplo(d, k % 3 === 2 ? C.violeta : C.pardo, 'xs') + barra(0.38) + barra(0.62) +
    nube(tx, ty, ancho * 0.7, ancho * 0.5, C.luz, 'xs', 0.6)
  );
}

/* ------------------------------------------------------------------
   El torso: el vestido negro de lentejuelas, el escote y las perlas
   ------------------------------------------------------------------ */

const TORSO: readonly P[] = [[-25, 8], [-27, -18], [-31, -46], [-35, -70], [-36, -92], [-29, -104], [-12, -110], [12, -110], [29, -104], [36, -92], [35, -70], [31, -46], [27, -18], [25, 8]];
/** La piel del escote, que asoma entre las dos puntas de la estola. */
const ESCOTE: readonly P[] = [[-14, -110], [14, -110], [12, -96], [6, -84], [2, -80], [-4, -84], [-10, -96]];

function torso(): string {
  const d = curva(TORSO);
  const r = azar(71);
  // Las lentejuelas: las luces del techo del estadio, desparramadas por el negro.
  let lentejuelas = '';
  for (let i = 0, puestas = 0; i < 400 && puestas < 70; i++) {
    const x = -34 + r() * 68;
    const y = -100 + r() * 106;
    if (!dentroDe(TORSO)(x, y)) continue;
    const brilla = r() < 0.18;
    lentejuelas += forma(elipse(x, y, brilla ? 1.1 : 0.7, brilla ? 1.1 : 0.7), brilla ? C.luz : C.rosa, brilla ? 0.95 : 0.55);
    if (brilla) lentejuelas += trazo(`M${f(x - 2.4)} ${f(y)} L${f(x + 2.4)} ${f(y)} M${f(x)} ${f(y - 2.4)} L${f(x)} ${f(y + 2.4)}`, C.perla, 0.4, 0.7);
    puestas++;
  }
  const escote = curva(ESCOTE);
  // El collar de perlas, que cae en el escote y se mete abajo de la estola.
  const perlas = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    const x = -11 + 22 * t;
    const y = -106 + 14 * Math.sin(Math.PI * t);
    return forma(elipse(x, y, 1.9, 1.9), C.perla) + forma(elipse(x - 0.6, y - 0.6, 0.6, 0.6), C.luz);
  }).join('');
  return conGrano(
    canto(d) +
    enmascarado('m-rapaz-torso', d,
      forma(d, C.negro) +
      // El brillo del satén: la luz del escenario de un lado, y la cintura honda.
      nube(-14, -64, 12, 30, C.violeta, 'm', 0.55) + nube(-18, -56, 4, 18, C.rosa, 's', 0.35) +
      nube(22, -40, 10, 40, C.hondo, 'm', 0.9) + nube(0, 4, 30, 10, C.hondo, 'm', 0.9) +
      trazo('M-10 -78 Q-14 -40 -10 6', C.hondo, 2, 0.7) + trazo('M12 -76 Q16 -36 12 6', C.hondo, 2, 0.6) +
      lentejuelas) +
    enmascarado('m-rapaz-escote', escote, forma(escote, C.piel) + nube(-2, -102, 10, 6, C.pielClara, 's', 0.9) + nube(4, -86, 5, 5, C.salmon, 's', 0.6)) +
    perlas,
  );
}

/* ------------------------------------------------------------------
   La estola de plumas: el collar de buitre, con el broche de la garra
   ------------------------------------------------------------------ */

const ESTOLA: readonly P[] = [
  [-12, -122], [4, -125], [20, -122], [36, -114], [50, -104], [56, -94], [50, -84], [34, -80], [20, -74], [12, -64], [6, -74], [4, -98],
  [0, -104], [-4, -96], [-6, -72], [-12, -62], [-20, -72], [-34, -80], [-50, -84], [-56, -94], [-50, -104], [-34, -114],
];

function estola(): string {
  const d = curva(ESTOLA);
  const r = azar(83);
  // Las plumas, encimadas de abajo para arriba: las de abajo, largas, caen por los hombros y las puntas; las
  // de arriba, cortas, le hacen el cuello de buitre. Cada una apunta para afuera desde el cuello.
  let plumas = '';
  let k = 0;
  for (let fila = 6; fila >= 0; fila--) {
    for (let i = 0; i < 18; i++) {
      const x = -56 + (112 * (i + (fila % 2) * 0.5)) / 17 + (r() - 0.5) * 4;
      const y = -120 + fila * 7 + Math.abs(x) * 0.14 + (r() - 0.5) * 3;
      if (!dentroDe(ESTOLA)(x, y + 3)) continue;
      const ang = 90 - Math.atan2(x, 40) * (180 / Math.PI) * 0.9 + (r() - 0.5) * 16;
      plumas += pluma(x, y, ang, 12 + fila * 1.4 + r() * 3, 3.2, k++);
    }
  }
  // El fleco: las puntas que se salen del contorno, por afuera.
  const fleco = ESTOLA.filter(([, y]) => y > -116).map(([x, y], i) => pluma(x * 0.92, y - 6, 90 - Math.atan2(x, 30) * (180 / Math.PI) * 0.9 + (i % 3) * 8 - 8, 13, 3, i + 1)).join('');
  // El broche: una garra de lata que agarra una perla, prendido en la punta de la estola.
  const [bx, by] = [-22, -86];
  const broche =
    forma(elipse(bx, by, 3.6, 3.6), C.perla) + nube(bx - 1, by - 1, 1.4, 1.2, C.luz, 'xs') + nube(bx + 1.6, by + 1.6, 1.6, 1.4, C.salmon, 'xs', 0.6) +
    [-1, 0, 1].map((i) => trazo(`M${f(bx + i * 2.6)} ${f(by - 6)} Q${f(bx + i * 3.6)} ${f(by - 2)} ${f(bx + i * 2.2)} ${f(by + 1.6)}`, C.amarillo, 1.1)).join('') +
    trazo(`M${f(bx - 2.6)} ${f(by - 6)} L${f(bx + 2.6)} ${f(by - 6)}`, C.peloHondo, 1.4);
  return conGrano(
    canto(d, 5) + fleco +
    enmascarado('m-rapaz-estola', d,
      forma(d, C.pardo) + nube(-26, -110, 24, 8, C.salmon, 'm', 0.5) + nube(30, -96, 20, 14, C.hondo, 'm', 0.5) +
      plumas +
      // La sombra que hace la cara sobre el cuello de la estola, y la luz del seguidor en el hombro.
      nube(6, -116, 16, 6, C.hondo, 's', 0.7) + nube(-44, -98, 8, 6, C.luz, 's', 0.45)) +
    broche,
  );
}

/** Las plumas sueltas que se le caen a la estola cuando se ríe o se la acomoda. */
function plumasSueltas(): string {
  return conGrano(pluma(-46, -92, 120, 10, 3, 1) + pluma(44, -86, 70, 9, 2.8, 2) + pluma(12, -70, 150, 8, 2.6, 4));
}

/* ------------------------------------------------------------------
   La cabeza: el cuello, el peinado batido, la cara de perfil de pico, los ojos y el aro
   ------------------------------------------------------------------ */

const CUELLO: readonly P[] = [[-7, -134], [12, -128], [13, -112], [10, -104], [-6, -104], [-9, -114]];
const CARA: readonly P[] = [
  [-12, -176], [6, -183], [20, -179], [27, -169], [28, -161], [32, -153], [36, -147], [34, -143], [29, -142], [27, -139], [27, -136],
  [25, -132], [21, -127], [12, -124], [2, -127], [-8, -133], [-15, -142], [-18, -156], [-17, -168],
];
const PELO: readonly P[] = [
  [-20, -146], [-26, -160], [-38, -172], [-54, -182], [-70, -190], [-56, -198], [-44, -212], [-26, -222], [-6, -226], [14, -222], [26, -212],
  [31, -198], [28, -184], [20, -180], [6, -184], [-10, -178], [-14, -164], [-14, -150],
];
/** El jopo de adelante, que cae sobre la frente. */
const JOPO: readonly P[] = [[-14, -184], [0, -196], [18, -200], [30, -196], [32, -186], [26, -178], [14, -182], [2, -180], [-10, -174]];
/** La forma de un ojo almendrado, con el rabillo para afuera. */
function almendra([x, y]: P, ancho: number, alto: number, afuera: number): readonly P[] {
  return [[x - ancho * afuera, y + 0.4], [x - ancho * 0.4 * afuera, y - alto * 0.9], [x + ancho * 0.5 * afuera, y - alto * 0.8], [x + ancho * afuera, y + 0.2], [x + ancho * 0.3 * afuera, y + alto * 0.7], [x - ancho * 0.5 * afuera, y + alto * 0.55]];
}
const OJOS = [almendra(A.ojos[0], A.anchoOjo[0], A.altoOjo, -1), almendra(A.ojos[1], A.anchoOjo[1], A.altoOjo * 0.9, 1)] as const;

function cabeza(): string {
  const cuello = curva(CUELLO);
  const cara = curva(CARA);
  const pelo = curva(PELO);
  const jopo = curva(JOPO);
  // Los rulos batidos: vueltas de luz y de sombra en el amarillo, y el copete que se va para atrás como el de un ave.
  const rulos = [[-28, -204, 9], [-10, -214, 9], [8, -210, 8], [20, -200, 6], [-42, -192, 6], [-22, -188, 7]].map(([x, y, r], i) =>
    trazo(`M${f(x! - r!)} ${f(y!)} A${r} ${f(r! * 0.8)} 0 1 1 ${f(x! + r! * 0.6)} ${f(y! + r! * 0.5)}`, i % 2 ? C.peloHondo : C.luz, 1.6, 0.75)).join('');
  // El copete de atrás: las mechas se juntan en una punta, como el de un ave de presa.
  const mechas = [0, 1, 2, 3].map((i) => trazo(`M${-22 - i * 5} ${-166 - i * 8} Q${-42 - i * 3} ${-178 - i * 5} ${-66 + i * 3} ${-190 - i * 1.6}`, i % 2 ? C.peloHondo : C.luz, 1.1, 0.7)).join('');
  const ojos = OJOS.map((o, i) => {
    const d = curva(o);
    const [x, y] = A.ojos[i as 0 | 1];
    return forma(d, C.perla) + nube(x, y + 1.6, A.anchoOjo[i as 0 | 1], 1.6, C.salmon, 'xs', 0.6) + trazo(curva(o.slice(3).concat([o[0]!]), false), C.violeta, 0.6, 0.7);
  }).join('');
  // La oreja, debajo del peinado, con el agujero del aro.
  const oreja = forma(curva([[-14, -156], [-19, -158], [-21, -150], [-17, -144], [-14, -146]]), C.piel) + trazo('M-16 -155 Q-19 -151 -16 -147', C.salmon, 0.9, 0.8);
  return conGrano(
    canto(pelo, 5) + canto(cuello, 4) + canto(cara, 4) +
    enmascarado('m-rapaz-pelo', pelo,
      forma(pelo, C.amarillo) + nube(-6, -222, 22, 10, C.luz, 'm', 0.8) + nube(-34, -184, 18, 12, C.peloHondo, 'm', 0.8) +
      nube(-20, -152, 8, 12, C.peloHondo, 'm', 0.9) + nube(22, -206, 6, 14, C.peloHondo, 's', 0.5) + rulos + mechas) +
    enmascarado('m-rapaz-cuello', cuello,
      forma(cuello, C.piel) + nube(6, -124, 8, 6, C.salmon, 's', 0.9) + nube(-2, -110, 6, 6, C.pielClara, 's', 0.7) +
      trazo('M-2 -116 Q4 -114 10 -117', C.salmon, 0.8, 0.7)) +
    enmascarado('m-rapaz-cara', cara,
      forma(cara, C.piel) +
      // La luz del seguidor le pega en la frente, el pómulo y el lomo del pico; la mandíbula se va a la sombra.
      nube(6, -168, 14, 8, C.pielClara, 'm', 0.95) + nube(22, -156, 4, 9, C.luz, 's', 0.9) + nube(8, -146, 7, 5, C.pielClara, 's', 0.8) +
      nube(-12, -140, 8, 14, C.salmon, 'm', 0.9) + nube(12, -126, 12, 4, C.salmon, 's', 0.8) +
      // El colorete y la sombra de ojos, que son el rosado de las luces del escenario.
      nube(6, -145, 6, 4, C.rosa, 's', 0.85) + nube(-1, -162, 8, 3.4, C.rosa, 's', 0.9) + nube(18, -162, 5, 2.6, C.rosa, 's', 0.8) +
      nube(-4, -164, 4, 2, C.violeta, 'xs', 0.5) +
      ojos +
      // El pico: el caballete con el hueso, la fosa y la sombra de la aleta.
      trazo('M27 -165 Q30 -158 35 -148', C.luz, 1.2, 0.9) + trazo('M29 -158 Q31 -156 30 -153', C.salmon, 1, 0.6) +
      forma(curva([[27, -144], [30, -145.5], [31, -143], [28, -142]]), C.violeta, 0.8) + nube(25, -146, 2.6, 2, C.salmon, 'xs', 0.9) +
      // El lunar, puesto a mano.
      forma(elipse(12, -138, 0.9, 0.9), C.hondo)) +
    oreja +
    enmascarado('m-rapaz-jopo', jopo, forma(jopo, C.amarillo) + nube(10, -196, 14, 3, C.luz, 's', 0.9) + nube(20, -182, 10, 3, C.peloHondo, 's', 0.8) + trazo('M-8 -180 Q8 -194 28 -190', C.peloHondo, 1, 0.55)) +
    // La horquilla que le sostiene el batido: roja como las uñas.
    trazo('M-34 -204 L-24 -210', C.rojo, 1.4) + trazo('M-33 -201 L-23 -207', C.rojo, 1.2, 0.8),
  );
}

/** Los párpados, cerrados del todo: la isla los baja desde arriba de cada ojo. Son pesados y llevan las pestañas. */
function parpado(n: 0 | 1): string {
  const [x, y] = A.ojos[n];
  const ancho = A.anchoOjo[n] + 0.8;
  const top = y - A.altoOjo - 0.6;
  const fondo = y + A.altoOjo * 0.8;
  const s = n === 0 ? -1 : 1;
  const d = curva([[x - ancho, y + 0.4], [x - ancho * 0.4, top], [x + ancho * 0.5, top + 0.2], [x + ancho, y + 0.2], [x + ancho * 0.3, fondo], [x - ancho * 0.5, fondo - 0.2]]);
  // Las pestañas: cortas adentro y largas en el rabillo, que se doblan para afuera.
  const pestanas = [0, 1, 2, 3].map((i) => {
    const px = x + s * (ancho * (0.1 + i * 0.28));
    return trazo(`M${f(px)} ${f(fondo - 0.4)} q${f(s * (1.2 + i))} ${f(0.6 + i * 0.3)} ${f(s * (2 + i * 1.4))} ${f(-0.4 - i * 0.6)}`, C.hondo, 0.7);
  }).join('');
  return conGrano(
    enmascarado(`m-rapaz-parpado-${n + 1}`, d, forma(d, C.piel) + nube(x, top + 1.5, ancho, 2.4, C.rosa, 's', 0.95) + nube(x - s * 1.5, top + 0.8, ancho * 0.6, 1.4, C.violeta, 'xs', 0.6)) +
    trazo(`M${f(x - ancho)} ${f(fondo - 0.6)} Q${f(x)} ${f(fondo + 1.4)} ${f(x + ancho)} ${f(fondo - 0.6)}`, C.hondo, 1.1) +
    pestanas,
  );
}

/** Las cejas depiladas y dibujadas de nuevo, finas y altas. */
function cejas(): string {
  return trazo('M-9 -165 Q-3 -172 7 -168', C.peloHondo, 1.1) + trazo('M13 -167 Q19 -172 25 -166', C.peloHondo, 0.9) + trazo('M-9 -165 Q-3 -172 7 -168', C.hondo, 0.4, 0.6);
}

/** La boca pintada y cerrada, que sonríe para un costado: el rabillo de adentro se le levanta. */
function sonrisa(): string {
  const [x, y] = A.boca;
  const labios = curva([[x - 6, y - 0.6], [x - 2, y - 2.6], [x + 1, y - 1.8], [x + 4, y - 2.4], [x + 6, y - 0.4], [x + 3, y + 2.2], [x - 3, y + 1.6]]);
  return (
    forma(labios, C.rojo) + nube(x - 1, y + 1, 3, 1, C.rosa, 'xs', 0.7) +
    trazo(`M${x - 6} ${y - 0.6} Q${x} ${y + 0.4} ${x + 6} ${y - 0.4}`, C.violeta, 0.7) +
    trazo(`M${x - 6} ${y - 0.6} q-1.4 -0.6 -2.2 -2`, C.violeta, 0.7, 0.8)
  );
}

/** La risa de costado: la boca abierta, los dientes de arriba y la lengua. */
function risa(): string {
  const [x, y] = A.boca;
  const boca = curva([[x - 8, y - 2.6], [x - 3, y - 3.4], [x + 3, y - 3], [x + 6, y - 1.6], [x + 4, y + 4.4], [x - 2, y + 5.6], [x - 7, y + 2]]);
  const adentro = curva([[x - 6.4, y - 1.4], [x + 4.6, y - 1.2], [x + 3, y + 3.4], [x - 2, y + 4.2], [x - 5.6, y + 1.6]]);
  return (
    forma(boca, C.rojo) + forma(adentro, C.hondo) +
    forma(curva([[x - 5.6, y - 1.2], [x + 4, y - 1], [x + 3.4, y + 0.6], [x - 5, y + 0.6]]), C.perla) +
    nube(x - 1, y + 3.2, 3, 1.2, C.violeta, 'xs', 0.9)
  );
}

/** El aro: un gancho, una cuenta roja y una gota de perla larga, que se hamaca. */
function aro(): string {
  const [x, y] = A.aro;
  return conGrano(
    trazo(`M${x} ${y} q-1.2 2 0 4`, C.amarillo, 0.9) +
    forma(elipse(x, y + 6, 1.8, 1.8), C.rojo) + nube(x - 0.5, y + 5.4, 0.6, 0.5, C.luz, 'xs') +
    forma(curva([[x, y + 8], [x + 2.6, y + 14], [x + 2.2, y + 19], [x, y + 21], [x - 2.2, y + 19], [x - 2.6, y + 14]]), C.perla) +
    nube(x - 0.8, y + 14, 0.9, 3, C.luz, 'xs', 0.95) + nube(x + 1.2, y + 18, 1.2, 1.6, C.salmon, 'xs', 0.6),
  );
}

/* ------------------------------------------------------------------
   Los brazos, las pulseras, la mano de la copa y la garra
   ------------------------------------------------------------------ */

function contornoBrazo(n: 0 | 1): P[] {
  const [sx, sy] = A.hombros[n];
  const L = A.largos.brazo;
  return [[sx - 7.5, sy - 6], [sx + 7.5, sy - 6], [sx + 6.6, sy + L * 0.5], [sx + 5.2, sy + L + 2], [sx, sy + L + 5.2], [sx - 5.2, sy + L + 2], [sx - 6.6, sy + L * 0.5]];
}
function contornoAntebrazo(n: 0 | 1): P[] {
  const [ex, ey] = codoDibujado(n);
  const L = A.largos.antebrazo;
  return [[ex - 5.2, ey + 4], [ex - 5.4, ey - L * 0.5], [ex - 3.8, ey - L + 1], [ex + 3.8, ey - L + 1], [ex + 5.4, ey - L * 0.5], [ex + 5.2, ey + 4], [ex, ey + 5.4]];
}
const cajaDe = (pts: readonly P[], margen = 4): readonly [number, number, number, number] => {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, y0] = [Math.min(...xs) - margen, Math.min(...ys) - margen];
  return [x0, y0, Math.max(...xs) + margen - x0, Math.max(...ys) + margen - y0];
};

function brazo(n: 0 | 1): string {
  const pts = contornoBrazo(n);
  const d = curva(pts);
  const [sx, sy] = A.hombros[n];
  const s = n === 0 ? -1 : 1;
  return conGrano(
    canto(d, 3.6) +
    enmascarado(`m-rapaz-brazo-${n + 1}`, d,
      forma(d, C.piel) + nube(sx - s * 3, sy + 20, 3, 22, C.pielClara, 's', 0.9) + nube(sx + s * 4, sy + 24, 3, 26, C.salmon, 's', 0.8) +
      nube(sx, sy + 46, 6, 4, C.salmon, 's', 0.7)),
  );
}

function antebrazo(n: 0 | 1): string {
  const pts = contornoAntebrazo(n);
  const d = curva(pts);
  const [ex, ey] = codoDibujado(n);
  const [wx, wy] = munecaDibujada(n);
  // Las pulseras, en la de la garra: tres, que no hacen juego.
  const pulseras = n === 1
    ? [[C.amarillo, 4], [C.rojo, 7.4], [C.perla, 10.4]].map(([c, dy]) =>
      trazo(`M${f(wx - 5.4)} ${f(wy + (dy as number))} Q${wx} ${f(wy + (dy as number) + 2)} ${f(wx + 5.4)} ${f(wy + (dy as number))}`, c as string, 2.2) +
      trazo(`M${f(wx - 3)} ${f(wy + (dy as number) + 0.4)} Q${wx} ${f(wy + (dy as number) + 1.4)} ${f(wx + 2)} ${f(wy + (dy as number) + 0.6)}`, C.luz, 0.6, 0.7)).join('')
    : // En la de la copa, un reloj de oro chiquito, que nunca mira.
    trazo(`M${f(wx - 5.4)} ${f(wy + 5)} Q${wx} ${f(wy + 7)} ${f(wx + 5.4)} ${f(wy + 5)}`, C.amarillo, 1.4) + forma(elipse(wx, wy + 6.2, 2.2, 1.8), C.amarillo) + forma(elipse(wx, wy + 6.2, 1.3, 1), C.perla);
  return conGrano(
    canto(d, 3.4) +
    enmascarado(`m-rapaz-antebrazo-${n + 1}`, d,
      forma(d, C.piel) + nube(ex - 2, ey - 22, 2.4, 20, C.pielClara, 's', 0.9) + nube(ex + 3, ey - 18, 2.4, 22, C.salmon, 's', 0.7)) +
    pulseras,
  );
}

/** Una uña larga, roja, curva como la de un ave, desde la punta del dedo `(x, y)` para `ang` grados. */
function una(x: number, y: number, ang: number, largo: number, curvatura: number): string {
  const a = (ang * Math.PI) / 180;
  const [ux, uy] = [Math.cos(a), Math.sin(a)];
  const [vx, vy] = [-uy * curvatura, ux * curvatura];
  const punta: P = [x + ux * largo + vx * largo * 0.4, y + uy * largo + vy * largo * 0.4];
  const d = `M${f(x - vx * 1.4 / curvatura)} ${f(y - vy * 1.4 / curvatura)} Q${f(x + ux * largo * 0.6 - vx * 0.4)} ${f(y + uy * largo * 0.6 - vy * 0.4)} ${f(punta[0])} ${f(punta[1])} Q${f(x + ux * largo * 0.4 + vx * 1.2)} ${f(y + uy * largo * 0.4 + vy * 1.2)} ${f(x + vx * 1.4 / curvatura)} ${f(y + vy * 1.4 / curvatura)} Z`;
  return forma(d, C.rojo) + trazo(`M${f(x + ux * 1.4)} ${f(y + uy * 1.4)} L${f(x + ux * largo * 0.6)} ${f(y + uy * largo * 0.6)}`, C.luz, 0.5, 0.7);
}

/** La mano de la copa: el puño chico que agarra el tallo, con el meñique parado y su uña. */
function manoCopa(): string {
  const [wx, wy] = munecaDibujada(0);
  const y = wy - 4;
  const puno = curva([[wx - 5, y + 4], [wx - 6, y - 3], [wx - 4, y - 8], [wx + 4, y - 8], [wx + 6, y - 3], [wx + 5, y + 4]]);
  const menique = curva([[wx - 5, y - 1], [wx - 10, y - 4], [wx - 13, y - 9], [wx - 11.6, y - 10], [wx - 8, y - 6], [wx - 4.6, y - 4]]);
  const { tallo, caliz, radio } = A.copa;
  const base = y - 8;
  const boca = base - tallo - caliz;
  // La copa de cóctel: el pie, el tallo y el cono, de vidrio, con el carmín en el borde.
  const cono = `M${f(wx - radio)} ${f(boca)} L${f(wx + radio)} ${f(boca)} L${f(wx + 1)} ${f(base - tallo)} L${f(wx - 1)} ${f(base - tallo)} Z`;
  return conGrano(
    canto(puno, 3) + canto(menique, 2.6) + canto(cono, 2.2) +
    forma(cono, C.luz, 0.28) +
    trazo(`M${f(wx - radio)} ${f(boca)} L${f(wx - 1)} ${f(base - tallo)} M${f(wx + radio)} ${f(boca)} L${f(wx + 1)} ${f(base - tallo)}`, C.perla, 0.8, 0.9) +
    trazo(`M${f(wx - radio + 2)} ${f(boca + 1.4)} L${f(wx - 1.6)} ${f(base - tallo - 2)}`, C.perla, 1.2, 0.6) +
    trazo(`M${wx} ${f(base + 2)} L${wx} ${f(base - tallo)}`, C.perla, 1.6) +
    forma(elipse(wx, base + 3, 5.4, 1.4), C.perla, 0.9) +
    forma(elipse(wx, boca, radio, 1.6), C.perla, 0.55) +
    // El carmín: la media luna roja donde apoyó la boca.
    trazo(`M${f(wx + radio - 5)} ${f(boca + 0.6)} q2 1.4 4 0`, C.rojo, 1.4, 0.9) +
    forma(puno, C.piel) + forma(menique, C.piel) + nube(wx + 2, y - 5, 3, 2, C.pielClara, 'xs', 0.9) +
    trazo(`M${f(wx - 3)} ${f(y - 7.4)} l0.4 5 M${wx} ${f(y - 7.8)} l0.2 5 M${f(wx + 3)} ${f(y - 7.4)} l0 5`, C.salmon, 0.6, 0.8) +
    una(wx - 12.4, y - 9.6, -130, 6, 1) +
    // Un anillo de piedra roja.
    forma(elipse(wx + 4, y - 4, 2, 1.4), C.rojo) + nube(wx + 3.6, y - 4.4, 0.6, 0.5, C.luz, 'xs'),
  );
}

/** El cóctel adentro de la copa, con la guinda pinchada en un palillo: lo que se ladea al girar la copa. */
function coctel(): string {
  const [wx, wy] = munecaDibujada(0);
  const base = wy - 12;
  const { tallo, caliz, radio } = A.copa;
  const boca = base - tallo - caliz;
  const nivel = boca + 4;
  const ancho = radio * (1 - 4 / caliz);
  const d = `M${f(wx - ancho)} ${f(nivel)} L${f(wx + ancho)} ${f(nivel)} L${f(wx + 0.8)} ${f(base - tallo - 0.6)} L${f(wx - 0.8)} ${f(base - tallo - 0.6)} Z`;
  return (
    forma(d, C.rojo, 0.9) + forma(elipse(wx, nivel, ancho, 1.2), C.rosa, 0.9) +
    trazo(`M${f(wx - 2)} ${f(nivel + 2)} L${f(wx - 0.6)} ${f(base - tallo - 3)}`, C.violeta, 1.2, 0.6) +
    // El palillo y la guinda.
    trazo(`M${f(wx + 3)} ${f(nivel + 4)} L${f(wx + 9)} ${f(boca - 8)}`, C.amarillo, 0.9) +
    forma(elipse(wx + 3.6, nivel + 2.4, 2.8, 2.6), C.rojo) + nube(wx + 2.6, nivel + 1.6, 0.8, 0.7, C.luz, 'xs')
  );
}

/** La garra abierta: la palma, cuatro dedos largos con anillos distintos y las uñas curvas. Dibujada para arriba. */
function garraAbierta(): string {
  const [wx, wy] = munecaDibujada(1);
  const palma = curva([[wx - 5, wy + 2], [wx - 6.4, wy - 6], [wx - 5.6, wy - 12], [wx + 5.6, wy - 12], [wx + 6.4, wy - 6], [wx + 5, wy + 2]]);
  // Cuatro dedos largos, abiertos en abanico: dónde nacen, cuánto miden y para dónde apuntan (grados desde arriba).
  const dedos = [[-4.6, 9, -12], [-1.6, 12, -4], [1.6, 11.4, 4], [4.6, 8, 12]] as const;
  const puntaDedo = ([dx, largo, ang]: readonly [number, number, number]): P => [wx + dx + Math.sin((ang * Math.PI) / 180) * largo, wy - 11 - Math.cos((ang * Math.PI) / 180) * largo];
  const dedo = (d: readonly [number, number, number]): string => {
    const [x0, y0] = [wx + d[0], wy - 11];
    const [x1, y1] = puntaDedo(d);
    return trazo(`M${f(x0)} ${f(y0)} L${f(x1)} ${f(y1)}`, C.piel, 2.6) + trazo(`M${f(x0 - 0.6)} ${f(y0)} L${f(x1 - 0.6)} ${f(y1)}`, C.pielClara, 0.7, 0.8) + una(x1, y1, d[2] - 90, 7.4, 1);
  };
  const pulgar = trazo(`M${f(wx + 5.6)} ${f(wy - 4)} Q${f(wx + 10)} ${f(wy - 8)} ${f(wx + 10.6)} ${f(wy - 12)}`, C.piel, 2.6) + una(wx + 10.6, wy - 12, -70, 5.4, 1);
  // Un anillo distinto en cada dedo: el de sello, el de piedra roja, el de perla y el de lata.
  const anillos = ([[-4.6, -14, C.amarillo], [-1.6, -15, C.rojo], [1.6, -15, C.perla], [4.6, -14, C.peloHondo]] as const)
    .map(([dx, dy, c]) => forma(elipse(wx + dx * 1.04, wy + dy, 1.8, 1.1), c) + nube(wx + dx - 0.5, wy + dy - 0.4, 0.5, 0.4, C.luz, 'xs', 0.9)).join('');
  return conGrano(
    canto(palma, 3) +
    dedos.map((d) => { const [x1, y1] = puntaDedo(d); return trazo(`M${f(wx + d[0])} ${f(wy - 11)} L${f(x1)} ${f(y1)}`, C.canto, 4.6); }).join('') +
    forma(palma, C.piel) + nube(wx - 1, wy - 6, 3, 4, C.pielClara, 's', 0.8) + nube(wx + 3, wy, 3, 3, C.salmon, 's', 0.7) +
    pulgar + dedos.map(dedo).join('') + anillos,
  );
}

/** La garra cerrada: el puño apretado, con las uñas que se clavan para adentro. */
function garraCerrada(): string {
  const [wx, wy] = munecaDibujada(1);
  const puno = curva([[wx - 5.6, wy + 2], [wx - 7, wy - 8], [wx - 6, wy - 16], [wx + 6, wy - 16], [wx + 7.6, wy - 8], [wx + 5.6, wy + 2]]);
  const nudillos = [-4, -1.2, 1.6, 4.4].map((dx) => trazo(`M${f(wx + dx)} ${f(wy - 15.4)} q0.6 3 0 5`, C.salmon, 0.7, 0.8)).join('');
  const unas = [-4.2, -1.4, 1.4, 4.2].map((dx, i) => una(wx + dx, wy - 10.6, 90 + (i - 1.5) * 8, 5.4, -1)).join('');
  const anillos = ([[-4.2, -12, C.amarillo], [-1.4, -12.6, C.rojo], [1.4, -12.6, C.perla], [4.2, -12, C.peloHondo]] as const)
    .map(([dx, dy, c]) => forma(elipse(wx + dx, wy + dy, 1.5, 1.1), c)).join('');
  return conGrano(
    canto(puno, 3) + forma(puno, C.piel) + nube(wx - 2, wy - 12, 4, 3, C.pielClara, 's', 0.9) + nube(wx + 4, wy - 2, 3, 6, C.salmon, 's', 0.7) +
    nudillos + anillos + unas +
    trazo(`M${f(wx + 7)} ${f(wy - 6)} Q${f(wx + 3)} ${f(wy - 9)} ${f(wx - 1)} ${f(wy - 9)}`, C.piel, 2.6) + una(wx - 1, wy - 9, 180, 4.6, 1),
  );
}

/* ------------------------------------------------------------------
   Lo ajeno: la billetera de cuero, abierta y cerrada, y el billete
   ------------------------------------------------------------------ */

const BILLETERA: readonly P[] = [[-12, -7], [12, -7], [12.6, 7], [-12.6, 7]];

function billetera(): string {
  const d = curva(BILLETERA.flatMap(([x, y], i) => [[x, y] as P, [(x + BILLETERA[(i + 1) % 4]![0]) / 2, (y + BILLETERA[(i + 1) % 4]![1]) / 2] as P]));
  return conGrano(
    canto(d, 3) +
    enmascarado('m-rapaz-billetera', d,
      forma(d, C.pardo) + nube(-4, -4, 10, 3, C.salmon, 's', 0.5) + nube(6, 5, 8, 3, C.hondo, 's', 0.8) +
      trazo('M-10.4 -5.4 L10.4 -5.4 L10.8 5.4 L-10.8 5.4 Z', C.salmon, 0.5, 0.7)) +
    // La punta del billete que asoma, y el broche de lata.
    forma(poli([[2, -7], [10, -7], [9.6, -9.6], [2.4, -9.2]]), C.luz) + trazo('M3.4 -8.4 L8.6 -8.6', C.violeta, 0.5, 0.7) +
    forma(elipse(-8, 0, 1.8, 1.8), C.amarillo) + nube(-8.4, -0.4, 0.6, 0.6, C.perla, 'xs'),
  );
}

function billeteraAbierta(): string {
  const izq = poli([[-20, -7], [-1, -6], [-1, 7], [-19, 8]]);
  const der = poli([[1, -6], [20, -7], [19, 8], [1, 7]]);
  return conGrano(
    canto(izq, 3) + canto(der, 3) +
    // Los billetes en abanico, adentro: el que se va a llevar es el de adelante.
    [-1, 0, 1].map((i) => forma(poli([[-12 + i * 3, -6 - i], [10 + i * 3, -8 - i * 1.6], [10.4 + i * 3, -1], [-12 + i * 3, 0]]), i ? C.luz : C.pielClara)).join('') +
    forma(izq, C.pardo) + forma(der, C.pardo) + nube(-10, 4, 8, 3, C.hondo, 's', 0.8) + nube(10, -3, 8, 3, C.salmon, 's', 0.5) +
    trazo('M0 -6 L0 7', C.hondo, 1.2) +
    // La foto carnet del dueño, que mira para otro lado.
    forma(poli([[-15, -3.6], [-7, -3.6], [-7, 4], [-15, 4]]), C.luz) + forma(elipse(-11, -0.4, 2, 2.4), C.violeta, 0.7) + forma(poli([[-14, 4], [-8, 4], [-9, 1.6], [-13, 1.6]]), C.violeta, 0.7),
  );
}

function billete(): string {
  const d = poli([[-9, -5], [9, -5.6], [9.4, 4.6], [-9, 5]]);
  return conGrano(
    canto(d, 2.4) + forma(d, C.luz) + nube(3, 1, 6, 3, C.pielClara, 's', 0.8) +
    trazo('M-7 -3 L7 -3.4 M-7 3 L7 2.6', C.violeta, 0.5, 0.7) + forma(elipse(0, 0, 2.6, 2.6), C.salmon, 0.6) + trazo('M-6 -1 L-4 -1', C.violeta, 0.6),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;
const [W1x, W1y] = munecaDibujada(0);
const [W2x, W2y] = munecaDibujada(1);
const cajaMano1 = (): readonly [number, number, number, number] => [W1x - 20, W1y - 12 - A.copa.tallo - A.copa.caliz - 12, 40, A.copa.tallo + A.copa.caliz + 30];

export const PIEZAS_RAPAZ: readonly Pieza[] = [
  { nombre: 'rapaz-billetera', caja: [-17, -14, 34, 26], dibujo: billetera(), densidad: D * 1.4 },
  { nombre: 'rapaz-billetera-abierta', caja: [-24, -14, 48, 26], dibujo: billeteraAbierta(), densidad: D * 1.4 },
  { nombre: 'rapaz-billete', caja: [-13, -9, 26, 18], dibujo: billete(), densidad: D * 1.4 },
  { nombre: 'rapaz-torso', caja: cajaDe(TORSO, 5), dibujo: torso(), densidad: D },
  { nombre: 'rapaz-brazo-1', caja: cajaDe(contornoBrazo(0)), dibujo: brazo(0), densidad: D },
  { nombre: 'rapaz-antebrazo-1', caja: cajaDe(contornoAntebrazo(0), 6), dibujo: antebrazo(0), densidad: D },
  { nombre: 'rapaz-mano-1', caja: cajaMano1(), dibujo: manoCopa(), densidad: D * 1.4 },
  { nombre: 'rapaz-coctel', caja: cajaMano1(), dibujo: coctel(), densidad: D * 1.4 },
  { nombre: 'rapaz-brazo-2', caja: cajaDe(contornoBrazo(1)), dibujo: brazo(1), densidad: D },
  { nombre: 'rapaz-antebrazo-2', caja: cajaDe(contornoAntebrazo(1), 6), dibujo: antebrazo(1), densidad: D },
  { nombre: 'rapaz-garra-abierta', caja: [W2x - 22, W2y - 42, 44, 50], dibujo: garraAbierta(), densidad: D * 1.4 },
  { nombre: 'rapaz-garra-cerrada', caja: [W2x - 14, W2y - 26, 28, 32], dibujo: garraCerrada(), densidad: D * 1.4 },
  { nombre: 'rapaz-estola', caja: [-68, -136, 136, 84], dibujo: estola(), densidad: D },
  // El hombro de la estola del lado de la copa: la misma estola, recortada arriba del hombro, que va encima del
  // brazo que levanta la copa (el brazo va encima de la estola y de la cabeza, y la estola encima de su hombro).
  { nombre: 'rapaz-hombrera', caja: [-68, -136, 52, 40], dibujo: enmascarado('m-rapaz-hombrera', 'M-68 -136 H-18 L-18 -100 L-68 -100 Z', estola()), densidad: D },
  { nombre: 'rapaz-plumas', caja: [-62, -106, 124, 52], dibujo: plumasSueltas(), densidad: D },
  { nombre: 'rapaz-cabeza', caja: [-76, -234, 118, 136], dibujo: cabeza(), densidad: D * 1.2 },
  { nombre: 'rapaz-parpado-1', caja: [A.ojos[0][0] - 14, A.ojos[0][1] - 9, 28, 16], dibujo: parpado(0), densidad: D * 2 },
  { nombre: 'rapaz-parpado-2', caja: [A.ojos[1][0] - 12, A.ojos[1][1] - 9, 26, 16], dibujo: parpado(1), densidad: D * 2 },
  { nombre: 'rapaz-cejas', caja: [-14, -178, 44, 16], dibujo: cejas(), densidad: D * 2 },
  { nombre: 'rapaz-sonrisa', caja: [A.boca[0] - 12, A.boca[1] - 8, 22, 14], dibujo: sonrisa(), densidad: D * 2 },
  { nombre: 'rapaz-risa', caja: [A.boca[0] - 12, A.boca[1] - 8, 22, 16], dibujo: risa(), densidad: D * 2 },
  { nombre: 'rapaz-aro', caja: [A.aro[0] - 6, A.aro[1] - 3, 12, 28], dibujo: aro(), densidad: D * 2 },
];

const img = imagenesDe(PIEZAS_RAPAZ);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Las niñas de los ojos, que miran de reojo: son tinta de la página, para que se corran sin imprimir nada. */
function pupilas(t: Readonly<Record<string, string>>): string {
  const ojos = A.ojos.map(([x, y], i) => {
    const r = i === 0 ? 2.5 : 2;
    return `<circle cx="${x}" cy="${y}" r="${r}" class="bt-rapaz-iris"/><circle cx="${f(x - r * 0.4)}" cy="${f(y - r * 0.4)}" r="${f(r * 0.32)}" class="bt-rapaz-brillo"/>`;
  }).join('');
  return parte('pupilas', ojos, t.pupilas);
}

/** La tipa armada con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const brazoCon = (n: 0 | 1, mano: string): string =>
    parte(`brazo-${n + 1}`, img(`rapaz-brazo-${n + 1}`) + parte(`antebrazo-${n + 1}`, img(`rapaz-antebrazo-${n + 1}`) + parte(`mano-${n + 1}`, mano, t[`mano-${n + 1}`]), t[`antebrazo-${n + 1}`]), t[`brazo-${n + 1}`]);
  const enLaMano =
    parte('billetera-mano',
      `<g transform="translate(${W2x} ${W2y - 20})">` + parte('billetera-cerrada', img('rapaz-billetera'), '', o['billetera-cerrada']) + parte('billetera-abierta', img('rapaz-billetera-abierta'), '', o['billetera-abierta']) + `</g>`,
      '', o['billetera-mano']) +
    parte('billete', `<g transform="translate(${W2x + 5} ${W2y - 31}) rotate(-20)">${img('rapaz-billete')}</g>`, '', o.billete) +
    parte('garra-abierta', img('rapaz-garra-abierta'), '', o['garra-abierta']) +
    parte('garra-cerrada', img('rapaz-garra-cerrada'), '', o['garra-cerrada']);
  return (
    parte('billetera-mesa', img('rapaz-billetera'), t['billetera-mesa'], o['billetera-mesa']) +
    parte('cuerpo',
      parte('torso', img('rapaz-torso'), t.torso) +
      brazoCon(1, enLaMano) +
      parte('estola', img('rapaz-estola'), t.estola) +
      parte('plumas', img('rapaz-plumas'), t.plumas, o.plumas) +
      parte('cabeza',
        img('rapaz-cabeza') + pupilas(t) +
        parte('parpado-1', img('rapaz-parpado-1'), t['parpado-1']) +
        parte('parpado-2', img('rapaz-parpado-2'), t['parpado-2']) +
        parte('ceja', img('rapaz-cejas'), t.ceja) +
        parte('sonrisa', img('rapaz-sonrisa'), '', o.sonrisa) +
        parte('risa', img('rapaz-risa'), '', o.risa) +
        parte('aro', img('rapaz-aro'), t.aro),
        t.cabeza) +
      brazoCon(0, img('rapaz-mano-1') + parte('vino', img('rapaz-coctel'), t.vino)) +
      parte('hombrera', img('rapaz-hombrera'), t.hombrera),
      t.cuerpo)
  );
}

/** La tipa en un momento, sin lo que la hace tocable: para el test, el retrato y para mirarla. */
export function rapazEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: la copa en la mano, la garra en el mantel, mirando de reojo. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--rapaz" data-id="la-tipa-rapaz" role="button" tabindex="0" aria-label="${nombres.get('la-tipa-rapaz') ?? 'La tipa rapaz'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: brindando con la copa en alto, y lo ajeno apretado en la garra. */
export const RETRATO = { caja: [RAPAZ.x - 52, RAPAZ.mesa - 128, 96, 138] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('mesa-lejos') + fondo('mesa-piso') + rapazEn(BRINDA);
}

export const RAPAZ_PERSONAJE: Personaje = {
  id: 'la-tipa-rapaz',
  region: 'la-mesa',
  ancla: RAPAZ.x,
  piezas: PIEZAS_RAPAZ,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
