/**
 * Mister Ed y Huesito (`D-73`, vigesimoctava vuelta), haciendo su número en el templo de Momo.
 *
 * *"El Morta, Huesito y Mister Ed / van a saltar otra vez sin red"* es de *Lavi-rap*, en *Lobo suelto / Cordero atado*
 * (1993). Se toma al pie de la letra. **Mister Ed** es el caballo que hablaba en la tele: parado de manos, haciendo
 * equilibrio, con la boca moviéndose sin que salga nada. **Huesito** es el que salta con él, vestido de esqueleto, con
 * galera, parado en el lomo. **Otra vez**: el número ya les salió mal antes, y la red del piso tiene un agujero. **Sin
 * red**: exacto, la red está tirada en el piso, rota. Del mismo tema: *"se enrollan, se baten, se agitan y mojan"* (el
 * tambor sobre el que hace equilibrio es el de un lavarropas, visto de frente, con la ropa dando vueltas y el jabón),
 * *"al comprar el pajarito, debieron preguntar cuánto costaba la linda jaula"* (el caballo sostiene en la pezuña la
 * jaula, con el pajarito) y *"baño turco"* (la espuma y el vapor del piso). Y para que se note que son del mismo
 * número que el Morta, lleva el toallón atado a la cintura y la cadenita de oro, como él.
 *
 * De la letra son el caballo, el esqueleto, el salto, la red, el lavarropas, el jabón, la jaula y el pajarito. Del
 * dibujo son la galera, el moño, el agujero de la red y que Huesito se cae por ahí y vuelve a subir.
 *
 * Viste *Lobo suelto / Cordero atado*, medido con sharp: el pelo es el azul del plumaje del cordero, el tambor y el
 * moño son el naranja de su fondo, el hocico y la crin son el marrón de su cara, y los huesos y la espuma son el crema
 * de la tapa de *Lobo suelto*. El toallón y la cadenita son los del Morta (`arte-morta.ts`).
 *
 * Coordenadas: el (0, 0) es el piso debajo del medio del tambor, con el caballo mirando a la derecha (`rig-ed.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { ED, ED_ARMADO as A, QUIETO, SALTA, marcas, type Momento } from './rig-ed.ts';

const ID = 'mister-ed-y-huesito';

/** Las tintas de *Lobo suelto / Cordero atado* (`tokens.css`), y las del templo que comparte con el Morta. */
const C = {
  pelo: 'var(--bestia-ed-pelo)',
  peloClaro: 'var(--bestia-ed-pelo-claro)',
  peloHondo: 'var(--bestia-ed-pelo-hondo)',
  naranja: 'var(--bestia-ed-naranja)',
  naranjaClaro: 'var(--bestia-ed-naranja-claro)',
  naranjaHondo: 'var(--bestia-ed-naranja-hondo)',
  marron: 'var(--bestia-ed-marron)',
  marronHondo: 'var(--bestia-ed-marron-hondo)',
  hueso: 'var(--bestia-ed-hueso)',
  huesoHondo: 'var(--bestia-ed-hueso-hondo)',
  negro: 'var(--bestia-ed-negro)',
  espuma: 'var(--bestia-ed-espuma)',
  lata: 'var(--bestia-ed-lata)',
  oro: 'var(--acento-2)',
  ojo: 'var(--bestia-ojo-blanco)',
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

/** Un miembro que se afina: sigue la línea del medio, con el ancho de cada punto. */
function tubo(pts: readonly P[], w: readonly number[]): string {
  const izq: P[] = [];
  const der: P[] = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)]!;
    const b = pts[Math.min(pts.length - 1, i + 1)]!;
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const [nx, ny] = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
    const r = w[i]! / 2;
    izq.push([p[0] + nx * r, p[1] + ny * r]);
    der.push([p[0] - nx * r, p[1] - ny * r]);
  });
  return curva([...izq, ...der.reverse()]);
}

/* ------------------------------------------------------------------
   El piso: la red rota, con el jabón
   ------------------------------------------------------------------ */

/** La red que no sirve: un óvalo de hilo tirado en el piso, con el borde de soga, estacas, y el agujero donde se cae. */
function red(): string {
  const [cx, cy, rx, ry] = [0, 7, 120, 17];
  const [hx, hy] = A.hueco;
  const dentro = ([x, y]: P): boolean => ((x - hx) / 27) ** 2 + ((y - hy) / 8.4) ** 2 < 1;
  const en = (r: number, g: number): P => [cx + r * rx * Math.cos(g), cy + r * ry * Math.sin(g)];
  let malla = '';
  // Los anillos y los rayos, y lo que cae adentro del agujero no se dibuja: ahí está cortada.
  for (const r of [0.28, 0.52, 0.76]) {
    let d = '';
    for (let i = 0; i < 56; i++) {
      const [a, b] = [en(r, (i / 56) * Math.PI * 2), en(r, ((i + 1) / 56) * Math.PI * 2)];
      if (!dentro(a) && !dentro(b)) d += `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
    }
    malla += trazo(d, C.huesoHondo, 1, 0.9);
  }
  for (let k = 0; k < 24; k++) {
    let d = '';
    const g = (k / 24) * Math.PI * 2;
    for (let i = 1; i < 10; i++) {
      const [a, b] = [en(0.08 + (i - 1) * 0.1, g), en(0.08 + i * 0.1, g)];
      if (!dentro(a) && !dentro(b)) d += `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
    }
    malla += trazo(d, C.huesoHondo, 0.9, 0.85);
  }
  // El borde de soga, con sus nudos, y las estacas.
  let soga = '';
  for (let i = 0; i < 64; i++) {
    const [a, b] = [en(1, (i / 64) * Math.PI * 2), en(1, ((i + 1) / 64) * Math.PI * 2)];
    soga += `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  }
  const estacas = [0.2, 0.9, 1.7, 2.4, 3.3, 4.1, 5.0, 5.7].map((g) => {
    const [x, y] = en(1.02, g);
    return forma(poli([[x - 2, y - 7], [x + 2, y - 7], [x + 2.4, y + 1], [x - 2.4, y + 1]]), C.marronHondo) + nube(x - 0.6, y - 5, 1, 2, C.marron, 'xs', 0.8);
  }).join('');
  // Los hilos cortados, que cuelgan del borde del agujero, y los que quedan hacia adentro.
  const rnd = azar(877);
  let hilachas = '';
  for (let i = 0; i < 16; i++) {
    const g = rnd() * Math.PI * 2;
    const [x, y] = [hx + Math.cos(g) * 27, hy + Math.sin(g) * 8.2];
    hilachas += trazo(`M${x.toFixed(1)} ${y.toFixed(1)} q${(-Math.cos(g) * (3 + rnd() * 6)).toFixed(1)} ${(rnd() * 3 - Math.sin(g) * 2).toFixed(1)} ${(-Math.cos(g) * (5 + rnd() * 6)).toFixed(1)} ${(rnd() * 3).toFixed(1)}`, C.espuma, 0.9, 0.9);
  }
  return conGrano(
    // El hueco, con el piso oscuro de abajo, y la sombra de toda la red.
    nube(0, 9, 122, 8, C.negro, 's', 0.8) +
    forma(elipse(hx, hy + 1, 26, 7.4), C.negro, 0.92) + nube(hx, hy + 2, 18, 3.6, C.marronHondo, 'xs', 0.7) + trazo(`M${hx - 27} ${hy + 1} Q${hx} ${hy - 9} ${hx + 27} ${hy + 1}`, C.espuma, 0.8, 0.5) +
    malla + trazo(soga, C.marron, 2.8) + trazo(soga, C.marronHondo, 1, 0.6) + hilachas + estacas +
    // El jabón: manchas de espuma sobre la red, en un rincón, y alrededor del tambor.
    [[-50, 4, 14, 4], [-18, 9, 10, 3], [30, 5, 8, 2.6], [94, 6, 8, 3], [-96, 5, 10, 3]].map(([x, y, rx2, ry2]) => nube(x!, y!, rx2!, ry2!, C.espuma, 'xs', 0.8)).join('') +
    [[-46, 2, 3], [-52, 5, 2.4], [-22, 8, 2.8], [34, 4, 2.2], [92, 5, 2.6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.espuma}" stroke-width="0.7" opacity="0.9"/>`).join(''),
  );
}

/* ------------------------------------------------------------------
   El tambor del lavarropas: el fondo, la ropa y el aro
   ------------------------------------------------------------------ */

const [TX, TY] = A.tambor.centro;
const R = A.tambor.radio;

/** El fondo del tambor: la oscuridad de adentro, con un reflejo de la luz del templo. */
function tamborFondo(): string {
  return conGrano(forma(elipse(TX, TY, R - 9, R - 9), C.negro) + nube(TX - 8, TY - 10, 14, 10, C.peloHondo, 's', 0.7) + nube(TX + 10, TY + 10, 14, 8, C.negro, 's', 0.9) + trazo(`M${TX - 26} ${TY - 6} q4 -16 18 -22`, C.espuma, 1.2, 0.4));
}

/** La ropa que da vueltas: una media a rayas, una toalla, una remera, una media azul, y el jabón. Gira aparte del aro. */
function ropa(): string {
  const media = curva([[-24, -8], [-16, -24], [-4, -30], [4, -22], [-8, -18], [-14, -6], [-20, 2]]);
  const toalla = curva([[6, 4], [20, -6], [26, -18], [14, -24], [2, -14]]);
  const remera = curva([[-10, 14], [-22, 6], [-14, 0], [-6, 6], [4, 4], [12, 12], [4, 20]]);
  const mediaAzul = curva([[8, -28], [20, -26], [26, -12], [20, -10], [14, -20], [6, -22]]);
  const c = (dx: number, dy: number): P => [TX + dx, TY + dy];
  const mover = (d: string, dx: number, dy: number): string => `<g transform="translate(${TX + dx} ${TY + dy})">${d}</g>`;
  return conGrano(
    mover(enmascarado('m-ed-media', media, forma(media, C.naranjaClaro) + trazo('M-22 -4 l12 -22 M-14 -6 l12 -22 M-6 -8 l10 -20', C.naranjaHondo, 3, 0.9) + nube(-8, -12, 6, 5, C.naranjaHondo, 'xs', 0.6)), 0, 0) +
    mover(enmascarado('m-ed-toalla', toalla, forma(toalla, C.espuma) + trazo('M4 -2 l18 -12 M8 4 l16 -12', C.marron, 2.2, 0.8) + nube(16, -8, 8, 8, C.huesoHondo, 'xs', 0.5)), 0, 0) +
    mover(enmascarado('m-ed-remera', remera, forma(remera, C.pelo) + nube(-4, 8, 10, 4, C.peloHondo, 'xs', 0.8) + nube(-12, 2, 4, 3, C.peloClaro, 'xs', 0.8)), 0, 0) +
    mover(enmascarado('m-ed-media-azul', mediaAzul, forma(mediaAzul, C.marron) + trazo('M10 -26 l12 14', C.marronHondo, 2.6, 0.9) + nube(16, -18, 4, 4, C.marronHondo, 'xs', 0.6)), 0, 0) +
    // La espuma que va y viene por la ropa.
    [c(-18, 10), c(14, 14), c(-6, -22), c(22, -2), c(-22, -14)].map(([x, y], i) => nube(x, y, 5 + (i % 2) * 2, 3.4, C.espuma, 'xs', 0.85)).join(''),
  );
}

/** El aro del tambor: la chapa naranja, perforada, con las tres paletas de adentro y los remaches. Gira entero. */
function tambor(): string {
  const afuera = elipse(TX, TY, R, R);
  const adentro = `M${TX + R - 10} ${TY} a${R - 10} ${R - 10} 0 1 1 ${-(R - 10) * 2} 0 a${R - 10} ${R - 10} 0 1 1 ${(R - 10) * 2} 0 Z`;
  const aro = `${afuera} ${adentro}`;
  let perfora = '';
  for (let i = 0; i < 24; i++) {
    const g = (i / 24) * Math.PI * 2;
    perfora += forma(elipse(TX + Math.cos(g) * (R - 5), TY + Math.sin(g) * (R - 5), 1.7, 1.7), C.negro, 0.9);
  }
  let paletas = '';
  for (let k = 0; k < 3; k++) {
    const g = (k / 3) * 360 + 20;
    paletas += `<g transform="rotate(${g} ${TX} ${TY})">${forma(poli([[TX + R - 10, TY - 4], [TX + R - 21, TY - 2.4], [TX + R - 21, TY + 2.4], [TX + R - 10, TY + 4]]), C.naranjaHondo)}${trazo(`M${TX + R - 10} ${TY - 3.2} L${TX + R - 20} ${TY - 1.8}`, C.naranjaClaro, 0.8, 0.8)}</g>`;
  }
  let remaches = '';
  for (let i = 0; i < 8; i++) {
    const g = ((i + 0.5) / 8) * Math.PI * 2;
    remaches += forma(elipse(TX + Math.cos(g) * (R - 1.6), TY + Math.sin(g) * (R - 1.6), 1.3, 1.3), C.naranjaClaro);
  }
  const fondo = enmascarado('m-ed-aro', aro, forma(aro, C.naranja) + nube(TX - 24, TY - 22, 20, 10, C.naranjaClaro, 's', 0.8) + nube(TX + 26, TY + 24, 22, 12, C.naranjaHondo, 's', 0.9) + nube(TX, TY + R - 2, 30, 4, C.negro, 's', 0.5));
  return conGrano(fondo + perfora + remaches + trazo(elipse(TX, TY, R - 0.6, R - 0.6), C.naranjaClaro, 0.9, 0.7) + paletas);
}

/* ------------------------------------------------------------------
   Mister Ed: patas, cuerpo, cola, crin, brazos, jaula, cabeza
   ------------------------------------------------------------------ */

/** Las dos patas de atrás: la de lejos, más oscura, y la de cerca, con el corvejón para atrás. Acaban en pezuña. */
function patas(): string {
  const cerca = tubo([[-4, -132], [10, -112], [-4, -94], [-9, -84], [-9, -81]], [18, 15, 10, 7.5, 9]);
  const lejos = tubo([[8, -130], [22, -112], [10, -94], [5, -84], [5, -81]], [16, 13, 9, 7, 8.4]);
  const pezuna = (x: number): string => forma(poli([[x - 8.6, -83], [x + 5.4, -83], [x + 8, -79.4], [x - 11, -79.4]]), C.marronHondo) + trazo(`M${x - 8} ${-81.4} h13`, C.marron, 0.8, 0.8);
  return conGrano(
    pezuna(5) + enmascarado('m-ed-pata-lejos', lejos, forma(lejos, C.peloHondo) + nube(12, -100, 6, 22, C.negro, 's', 0.6)) +
    pezuna(-9) + enmascarado('m-ed-pata-cerca', cerca, forma(cerca, C.pelo) + nube(-8, -104, 5, 22, C.peloHondo, 's', 0.8) + nube(6, -118, 6, 10, C.peloClaro, 'xs', 0.8) + trazo('M2 -122 Q12 -108 0 -92', C.peloClaro, 0.9, 0.6)),
  );
}

/** El cuerpo: el torso parado, el cuello largo, el pecho claro, el toallón atado a la cintura y la cadenita. */
function cuerpo(): string {
  const torso = curva([[-40, -122], [-34, -150], [-14, -178], [8, -200], [26, -204], [40, -186], [42, -160], [30, -132], [12, -108], [-14, -102]]);
  const cuello = tubo([[14, -190], [18, -216], [30, -240], [46, -250]], [36, 28, 24, 24]);
  // El toallón, atado a la cintura, medio caído de un lado y con la franja marrón de los toallones de pileta.
  const toalla = curva([[-40, -118], [-34, -138], [-6, -128], [14, -112], [18, -92], [-2, -90], [-18, -86], [-38, -98]]);
  return conGrano(
    enmascarado('m-ed-torso', torso, forma(torso, C.pelo) + nube(-30, -140, 10, 26, C.peloHondo, 's', 0.9) + nube(34, -160, 8, 26, C.peloClaro, 's', 0.7) + nube(8, -178, 12, 8, C.peloClaro, 's', 0.7) + nube(26, -130, 12, 14, C.espuma, 's', 0.28) + nube(4, -112, 24, 6, C.negro, 's', 0.6)) +
    enmascarado('m-ed-cuello', cuello, forma(cuello, C.pelo) + nube(14, -226, 6, 22, C.peloHondo, 's', 0.85) + nube(34, -236, 5, 14, C.peloClaro, 's', 0.7) + nube(20, -200, 12, 8, C.peloHondo, 's', 0.5)) +
    // El pecho: el mechón claro, y el moño de circo, naranja, en el cuello.
    nube(38, -176, 5, 10, C.espuma, 'xs', 0.45) +
    // El toallón.
    enmascarado('m-ed-toalla-cuerpo', toalla, forma(toalla, C.espuma) + trazo('M-38 -100 L-6 -92 L18 -94 M-36 -112 L-6 -112 L14 -106', C.marron, 3.2, 0.85) + nube(-10, -116, 18, 8, C.huesoHondo, 's', 0.7) + nube(8, -94, 14, 5, C.huesoHondo, 's', 0.8) + trazo('M-24 -134 Q-18 -112 -22 -92 M-4 -128 Q4 -110 0 -90 M10 -116 Q16 -104 12 -92', C.huesoHondo, 1.3, 0.75) + trazo('M-38 -98 Q-26 -88 -2 -90 Q10 -88 18 -92', C.marron, 1.6, 0.9)) +
    trazo('M-34 -128 q14 -8 40 -4', C.huesoHondo, 1.2, 0.7) +
    // La cadenita de oro, como la del Morta, con el medallón.
    trazo('M22 -196 Q38 -170 30 -148', C.oro, 1.8, 0.95) + forma(elipse(30, -146, 4.6, 4.6), C.oro) + forma(elipse(30, -146, 2.2, 2.2), C.marronHondo) + nube(29, -147, 1.6, 1.4, C.espuma, 'xs', 0.8) +
    // El moño naranja.
    forma(poli([[30, -200], [18, -206], [18, -192]]), C.naranja) + forma(poli([[30, -200], [42, -206], [42, -192]]), C.naranja) + forma(elipse(30, -199, 3.4, 3.8), C.naranjaHondo) + nube(22, -202, 2, 2, C.naranjaClaro, 'xs', 0.8),
  );
}

/** La cola: crines largas que cuelgan de la raíz, de dos tonos. */
function cola(): string {
  const [kx, ky] = A.cola;
  const hebras = [
    { pts: [[kx, ky], [kx - 14, ky + 14], [kx - 28, ky + 40], [kx - 26, ky + 70]] as P[], w: [10, 14, 14, 5] },
    { pts: [[kx + 2, ky + 2], [kx - 8, ky + 22], [kx - 20, ky + 50], [kx - 14, ky + 76]] as P[], w: [8, 12, 12, 4] },
    { pts: [[kx - 2, ky - 2], [kx - 20, ky + 8], [kx - 40, ky + 30], [kx - 42, ky + 58]] as P[], w: [8, 12, 10, 4] },
  ];
  return conGrano(hebras.map((h, i) => {
    const d = tubo(h.pts, h.w);
    return enmascarado(`m-ed-cola-${i}`, d, forma(d, i === 1 ? C.marron : C.marronHondo) + nube(kx - 18 - i * 4, ky + 40, 5, 22, C.negro, 'xs', 0.6) + trazo(`M${kx - 2} ${ky + 4} Q${kx - 18} ${ky + 30} ${kx - 22 - i * 2} ${ky + 60}`, C.marron, 0.8, 0.8));
  }).join(''));
}

/** La crin, en la nuca del cuello: mechones que caen para el lado de atrás. */
function crin(): string {
  const [cx, cy] = A.crin;
  let m = '';
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    const [x, y] = [cx + 8 - t * 28, cy + 8 + t * 44];
    const d = tubo([[x, y], [x - 8, y + 6 + t * 3], [x - 16, y + 18 + t * 4]], [7, 8, 3]);
    m += forma(d, i % 2 ? C.marronHondo : C.marron) + trazo(`M${x} ${y + 1} q-6 4 -12 14`, C.marron, 0.7, 0.7);
  }
  return conGrano(m + nube(cx - 6, cy + 24, 14, 22, C.negro, 's', 0.28));
}

/** El brazo de lejos, oscuro, que sostiene la jaula con la pezuña: va hacia adelante, medio levantado. */
function brazoLejos(): string {
  const [hx, hy] = A.hombros[0];
  const d = tubo([[hx, hy], [hx + 22, hy - 4], [hx + 36, hy - 14], [A.jaula[0], A.jaula[1] + 2]], [15, 12, 9, 7.6]);
  return conGrano(
    enmascarado('m-ed-brazo-lejos', d, forma(d, C.peloHondo) + nube(hx + 22, hy - 4, 12, 3, C.negro, 'xs', 0.6)) +
    forma(poli([[A.jaula[0] - 5, A.jaula[1] - 4], [A.jaula[0] + 5, A.jaula[1] - 5], [A.jaula[0] + 5, A.jaula[1] + 5], [A.jaula[0] - 4, A.jaula[1] + 5]]), C.marronHondo) +
    `<circle cx="${A.jaula[0]}" cy="${A.jaula[1] + 1}" r="3.6" fill="none" stroke="${C.lata}" stroke-width="1.6"/>`,
  );
}

/** El brazo de cerca, hacia adelante y para abajo, con la pezuña abierta: lo mueve para hacer equilibrio. */
function brazoCerca(): string {
  const [hx, hy] = A.hombros[1];
  const d = tubo([[hx, hy], [hx + 14, hy + 14], [hx + 26, hy + 28], [hx + 36, hy + 36]], [17, 13, 10, 8.4]);
  return conGrano(
    enmascarado('m-ed-brazo-cerca', d, forma(d, C.pelo) + nube(hx + 14, hy + 20, 5, 18, C.peloHondo, 's', 0.8) + nube(hx + 8, hy + 8, 6, 8, C.peloClaro, 'xs', 0.8) + trazo(`M${hx + 4} ${hy - 4} Q${hx + 22} ${hy + 14} ${hx + 32} ${hy + 30}`, C.peloClaro, 0.8, 0.6)) +
    forma(poli([[hx + 31, hy + 34], [hx + 42, hy + 33], [hx + 45, hy + 41], [hx + 32, hy + 42]]), C.marronHondo) + trazo(`M${hx + 33} ${hy + 36} h9`, C.marron, 0.7, 0.8),
  );
}

/** La jaula del pajarito: un domo de alambre con la argolla, los barrotes, el posadero y el piso de chapa. Cuelga de la pezuña. */
function jaula(): string {
  const [jx, jy] = A.jaula;
  const [x0, x1, techo, piso] = [jx - 14, jx + 14, jy + 10, jy + 46];
  let barrotes = '';
  for (let i = 0; i <= 6; i++) {
    const x = x0 + (i / 6) * 28;
    barrotes += trazo(`M${(jx + (x - jx) * 0.5).toFixed(1)} ${techo - 6} L${x.toFixed(1)} ${piso}`, C.lata, 0.9, 0.95);
  }
  return conGrano(
    // El gancho y el aro de arriba.
    trazo(`M${jx} ${jy + 1} L${jx} ${jy + 6}`, C.lata, 1.4) + `<circle cx="${jx}" cy="${jy + 8}" r="2.6" fill="none" stroke="${C.lata}" stroke-width="1.2"/>` +
    // El domo, el piso, el posadero.
    trazo(`M${x0} ${techo} Q${x0 + 3} ${techo - 10} ${jx} ${techo - 12} Q${x1 - 3} ${techo - 10} ${x1} ${techo}`, C.lata, 1.5) +
    barrotes + trazo(`M${x0} ${techo} L${x1} ${techo}`, C.lata, 1.1, 0.9) +
    trazo(`M${x0 - 1} ${jy + 28} L${x1 + 1} ${jy + 28}`, C.marron, 1.6) +
    forma(poli([[x0 - 2, piso], [x1 + 2, piso], [x1, piso + 4], [x0, piso + 4]]), C.lata) + nube(jx, piso + 2, 12, 1.6, C.espuma, 'xs', 0.6) +
    // La puertita, con su pasador.
    `<rect x="${jx - 5}" y="${jy + 24}" width="10" height="16" fill="none" stroke="${C.lata}" stroke-width="0.8"/><circle cx="${jx + 4}" cy="${jy + 32}" r="0.9" fill="${C.naranjaClaro}"/>`,
  );
}

/** El pajarito: amarillo de tapa, o sea naranja claro, con el pico abierto. Salta adentro de la jaula. */
function canario(): string {
  const [jx, jy] = A.jaula;
  const [x, y] = [jx - 1, jy + 24];
  return conGrano(
    forma(poli([[x - 6, y - 1], [x - 14, y - 4], [x - 12, y + 2]]), C.naranjaHondo) +
    forma(elipse(x, y, 8, 5.6), C.naranjaClaro) + nube(x + 1, y + 2, 5, 2.6, C.naranja, 'xs', 0.8) + nube(x - 2, y - 2, 4, 1.8, C.espuma, 'xs', 0.5) +
    forma(elipse(x + 6, y - 5, 4.2, 4), C.naranjaClaro) + forma(elipse(x + 7.4, y - 5.6, 1.1, 1.1), C.negro) +
    forma(poli([[x + 9.6, y - 6], [x + 14, y - 4.6], [x + 9.8, y - 3.4]]), C.naranjaHondo) +
    trazo(`M${x - 6} ${y - 1} q4 4 10 2`, C.naranjaHondo, 0.7, 0.8) + trazo(`M${x - 1} ${y + 5} v4 M${x + 2} ${y + 5} v4`, C.marronHondo, 0.9),
  );
}

/** La cabeza: dibujada con el (0, 0) en la nuca, el hocico a la derecha y para abajo, las orejas, el flequillo y la nariz. */
function cabeza(): string {
  const [nx, ny] = A.cuello;
  const d = curva([[-8, -4], [0, -12], [16, -6], [34, 8], [52, 26], [60, 38], [56, 48], [44, 44], [30, 38], [14, 34], [2, 24], [-8, 10]]);
  const oreja = (x: number, y: number, h: number, o: string): string => forma(poli([[x - 3, y], [x + 1, y - h], [x + 6, y]]), o);
  return `<g transform="translate(${nx} ${ny})">` + conGrano(
    oreja(-1, -9, 17, C.peloHondo) + oreja(4, -7, 18, C.pelo) + forma(poli([[2.5, -9], [4.5, -19], [6, -9]]), C.marron),
    ) + conGrano(
    enmascarado('m-ed-cabeza', d, forma(d, C.pelo) + nube(-2, 6, 8, 12, C.peloHondo, 's', 0.8) + nube(24, -2, 10, 6, C.peloClaro, 's', 0.8) +
      // El hocico, marrón, y la mejilla.
      nube(50, 36, 14, 12, C.marron, 's', 0.95) + nube(56, 40, 6, 6, C.marronHondo, 'xs', 0.7) + nube(14, 20, 6, 6, C.peloHondo, 'xs', 0.6)) +
    // El flequillo: tres mechones que le caen entre las orejas, y la estrella blanca de la frente.
    forma(curva([[6, -10], [14, -6], [20, 4], [14, 2], [8, -3]]), C.marronHondo) + forma(poli([[18, 2], [26, 10], [21, 12]]), C.espuma, 0.85) +
    // La nariz, la comisura de la boca, y los dientes de arriba.
    forma(elipse(54, 30, 2.6, 3.8), C.negro) + trazo('M60 40 Q44 44 30 38', C.marronHondo, 1.2, 0.9) + forma(poli([[44, 40.4], [54, 42], [54, 45], [44, 43.6]]), C.espuma) + trazo('M47 40.8 v3 M50 41.4 v3 M53 42 v3', C.huesoHondo, 0.5, 0.8) +
    // La cuenca del ojo y la ceja.
    forma(elipse(16, 4, A.radio + 1.6, A.radio + 1.4), C.peloHondo) + forma(elipse(16, 4, A.radio, A.radio * 0.92), C.ojo) + trazo('M6 -3 Q16 -8 25 -2', C.marronHondo, 1.4, 0.9),
  ) + `</g>`;
}

/** La mandíbula: de abajo, con los dientes y la lengua, que se abre de la bisagra. Está dibujada cerrada. */
function mandibula(): string {
  const [nx, ny] = A.cuello;
  const d = curva([[14, 30], [36, 40], [54, 48], [58, 54], [46, 58], [26, 52], [12, 42]]);
  return `<g transform="translate(${nx} ${ny})">` + conGrano(
    enmascarado('m-ed-mandibula', d, forma(d, C.pelo) + nube(46, 54, 12, 7, C.marron, 'xs', 0.95) + nube(24, 48, 12, 4, C.peloHondo, 'xs', 0.7)) +
    forma(poli([[22, 42], [44, 46], [54, 48], [52, 46], [44, 43.6], [22, 39.4]]), C.negro) + forma(poli([[44, 45.4], [54, 47.4], [54, 45], [44, 43.4]]), C.espuma) + forma(elipse(34, 44, 7, 1.9), C.naranjaHondo),
  ) + `</g>`;
}

/** El párpado: la piel que le tapa el ojo cuando lo cierra. Se achata desde arriba. */
function parpado(): string {
  const [ox, oy] = A.ojo;
  const r = A.radio;
  return conGrano(forma(elipse(ox, oy, r + 1.6, r + 1.4), C.pelo) + nube(ox, oy - 3, r - 2, 3, C.peloClaro, 'xs', 0.5) + trazo(`M${ox - r - 0.6} ${oy + 1.2} Q${ox} ${oy + r + 2} ${ox + r + 0.6} ${oy + 1.2}`, C.peloHondo, 1.2) +
    [-4, 0, 4].map((x) => trazo(`M${ox + x} ${oy + r + 0.6} l${x * 0.2 + 0.6} 3.4`, C.negro, 0.8, 0.9)).join(''));
}

function pupila(): string {
  const [ox, oy] = A.ojo;
  return forma(elipse(ox + 1.4, oy + 0.4, 3, 3.4), C.marronHondo) + forma(elipse(ox + 1.6, oy + 0.4, 1.8, 2.1), C.negro) + forma(elipse(ox + 0.6, oy - 0.8, 0.8, 0.8), C.espuma);
}

/* ------------------------------------------------------------------
   Huesito: el esqueleto de circo
   ------------------------------------------------------------------ */

/**
 * El cuerpo de Huesito: la malla negra con los huesos pintados en blanco, las costillas, la pelvis, las dos piernas y las
 * zapatillas de bailarín. Dibujado con los pies en el (0, 0) y las caderas en el (0, −40).
 */
function huesoCuerpo(): string {
  const pierna = (x: number, g: number): string => {
    const d = tubo([[x, -42], [x + g, -22], [x + g * 1.4, -5]], [11, 8, 7]);
    return enmascarado(`m-ed-hueso-pierna-${x}`, d, forma(d, C.negro) + trazo(`M${x} -40 L${x + g} -22 L${x + g * 1.4} -6`, C.hueso, 2) + forma(elipse(x + g, -22, 2.4, 2.4), C.hueso)) +
      // La zapatilla, naranja, con la cinta.
      forma(poli([[x + g * 1.4 - 4.4, -6], [x + g * 1.4 + 4.4, -6], [x + g * 1.4 + 7.4, -1.2], [x + g * 1.4 - 5, -1.2]]), C.naranja) + trazo(`M${x + g * 1.4 - 3} -5 l6 3`, C.naranjaClaro, 0.8, 0.8);
  };
  const torso = curva([[-10, -68], [-12, -54], [-9, -42], [0, -38], [9, -42], [12, -54], [10, -68], [0, -73]]);
  let costillas = '';
  for (let i = 0; i < 5; i++) costillas += trazo(`M0 ${-66 + i * 5.4} q-8 -1 -10 ${3 + (i > 3 ? -1 : 0)} M0 ${-66 + i * 5.4} q8 -1 10 ${3 + (i > 3 ? -1 : 0)}`, C.hueso, 1.3, 0.95);
  return conGrano(
    pierna(-4.4, -2) + pierna(4.4, 2) +
    enmascarado('m-ed-hueso-torso', torso, forma(torso, C.negro) + trazo('M0 -72 L0 -41', C.hueso, 1.6) + costillas + forma(poli([[-6, -42], [0, -37], [6, -42], [3, -45], [-3, -45]]), C.hueso) + nube(6, -54, 5, 14, C.peloHondo, 'xs', 0.7)) +
    // El cuello de payaso: la gola, que le tapa la unión con el cráneo.
    [[-9, -73], [-4, -71], [2, -71], [8, -73]].map(([x, y]) => forma(elipse(x!, y!, 5.4, 3.6), C.espuma)).join('') + trazo('M-12 -72 q12 5 24 0', C.huesoHondo, 0.8, 0.6),
  );
}

/** Los brazos abiertos en V, con la manga negra, los huesos pintados y las manos de hueso: sirven para hacer equilibrio. */
function huesoBrazos(): string {
  const brazo = (s: number): string => {
    const d = tubo([[s * 4, -69], [s * 14, -82], [s * 24, -96]], [8, 6.6, 5.6]);
    return enmascarado(`m-ed-hueso-brazo-${s}`, d, forma(d, C.negro) + trazo(`M${s * 4} -69 L${s * 14} -82 L${s * 23} -95`, C.hueso, 1.6) + forma(elipse(s * 14, -82, 2.2, 2.2), C.hueso)) +
      // La mano: la palma y los dedos abiertos.
      forma(elipse(s * 26, -99, 4, 3.6), C.hueso) + [-0.5, 0, 0.5].map((g) => trazo(`M${s * 26} -99 l${s * (3 + g * 2)} ${-5 - g * 2}`, C.hueso, 1.3)).join('');
  };
  return conGrano(brazo(-1) + brazo(1));
}

/** El cráneo: blanco, con las cuencas, la nariz, los dientes y la galera de ringmaster. */
function huesoCraneo(): string {
  const d = curva([[-11, -92], [-10, -102], [0, -105], [10, -102], [11, -92], [9, -84], [4, -80], [-4, -80], [-9, -84]]);
  return conGrano(
    enmascarado('m-ed-craneo', d, forma(d, C.hueso) + nube(-5, -98, 6, 6, C.espuma, 'xs', 0.9) + nube(7, -86, 5, 8, C.huesoHondo, 'xs', 0.8) + nube(0, -81, 10, 2, C.huesoHondo, 'xs', 0.6)) +
    // Las cuencas, la nariz, y los dientes con sus rayitas.
    forma(elipse(-4.6, -93, 3.6, 4), C.negro) + forma(elipse(4.6, -93, 3.6, 4), C.negro) + forma(elipse(-4, -93.4, 1.1, 1.2), C.espuma) + forma(elipse(5.2, -93.4, 1.1, 1.2), C.espuma) + forma(poli([[0, -89], [-1.6, -85.6], [1.6, -85.6]]), C.negro) +
    forma(poli([[-5, -83], [5, -83], [4, -80.2], [-4, -80.2]]), C.espuma) + trazo('M-2.4 -83 v2.8 M0 -83 v2.8 M2.4 -83 v2.8', C.huesoHondo, 0.5, 0.9) +
    // La galera: chica, torcida, con la cinta naranja.
    `<g transform="rotate(-9 0 -104)">` + forma(poli([[-11, -104], [11, -104], [8, -104], [7, -122], [-7, -122]]), C.negro) + forma(elipse(0, -104, 14, 2.4), C.negro) + forma(poli([[-7.6, -108.4], [7.6, -108.4], [7.2, -105], [-8, -105]]), C.naranja) + nube(-3, -115, 2, 5, C.peloHondo, 'xs', 0.9) + `</g>`,
  );
}

/** Una burbuja de jabón: el aro, el reflejo. Las mueve la isla. */
function burbuja(): string {
  return `<circle cx="0" cy="0" r="5.2" fill="none" stroke="${C.espuma}" stroke-width="0.9" opacity="0.9"/>` + trazo('M-3 -1.6 q1 -2.4 3.4 -3', C.espuma, 1.1, 0.95) + nube(2, 2, 2, 1.4, C.espuma, 'xs', 0.4);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;
const cajaOjo = ([x, y]: readonly [number, number], r: number): readonly [number, number, number, number] => [x - r, y - r, r * 2, r * 2];

export const PIEZAS_ED: readonly Pieza[] = [
  { nombre: 'ed-red', caja: [-134, -16, 268, 52], dibujo: red(), densidad: 1.8 },
  { nombre: 'ed-tambor-fondo', caja: [TX - 34, TY - 34, 68, 68], dibujo: tamborFondo(), densidad: D },
  { nombre: 'ed-ropa', caja: [TX - 31, TY - 31, 62, 62], dibujo: ropa(), densidad: D * 1.4 },
  { nombre: 'ed-tambor', caja: [TX - 44, TY - 44, 88, 88], dibujo: tambor(), densidad: D * 1.4 },
  { nombre: 'ed-patas', caja: [-30, -136, 60, 60], dibujo: patas(), densidad: D * 1.4 },
  { nombre: 'ed-cuerpo', caja: [-50, -258, 110, 160], dibujo: cuerpo(), densidad: D },
  { nombre: 'ed-cola', caja: [-86, -140, 52, 96], dibujo: cola(), densidad: D },
  { nombre: 'ed-crin', caja: [-10, -266, 58, 76], dibujo: crin(), densidad: D },
  { nombre: 'ed-brazo-lejos', caja: [22, -204, 64, 52], dibujo: brazoLejos(), densidad: D * 1.4 },
  { nombre: 'ed-brazo-cerca', caja: [18, -176, 60, 62], dibujo: brazoCerca(), densidad: D * 1.4 },
  { nombre: 'ed-jaula', caja: [56, -204, 40, 66], dibujo: jaula(), densidad: D * 2 },
  { nombre: 'ed-canario', caja: [A.jaula[0] - 16, A.jaula[1] + 14, 32, 22], dibujo: canario(), densidad: D * 2.6 },
  { nombre: 'ed-cabeza', caja: [A.cuello[0] - 14, A.cuello[1] - 28, 92, 86], dibujo: cabeza(), densidad: D * 1.6 },
  { nombre: 'ed-mandibula', caja: [A.cuello[0] + 8, A.cuello[1] + 24, 56, 38], dibujo: mandibula(), densidad: D * 2 },
  { nombre: 'ed-parpado', caja: [A.ojo[0] - 11, A.ojo[1] - 11, 22, 24], dibujo: parpado(), densidad: D * 3 },
  { nombre: 'ed-pupila', caja: cajaOjo(A.ojo, 7), dibujo: pupila(), densidad: D * 3 },
  { nombre: 'ed-hueso-cuerpo', caja: [-22, -80, 44, 84], dibujo: huesoCuerpo(), densidad: D * 2 },
  { nombre: 'ed-hueso-brazos', caja: [-36, -110, 72, 46], dibujo: huesoBrazos(), densidad: D * 2 },
  { nombre: 'ed-hueso-craneo', caja: [-18, -126, 36, 52], dibujo: huesoCraneo(), densidad: D * 2.6 },
  { nombre: 'ed-burbuja', caja: [-8, -8, 16, 16], dibujo: burbuja(), densidad: D * 3 },
];

const img = imagenesDe(PIEZAS_ED);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El número armado con las marcas de un momento. */
function armado(m: Momento, seco: string): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    parte('red', img('ed-red'), t.red) +
    parte('cabalgata',
      img('ed-tambor-fondo') + parte('ropa', img('ed-ropa'), t.ropa) + parte('tambor', img('ed-tambor'), t.tambor) +
      parte('ed',
        parte('brazo-lejos', img('ed-brazo-lejos') + parte('jaula', parte('canario', img('ed-canario'), t.canario) + img('ed-jaula'), t.jaula), t['brazo-lejos']) +
        parte('cola', img('ed-cola'), t.cola) +
        parte('patas', img('ed-patas'), t.patas) +
        parte('cuerpo', img('ed-cuerpo'), t.cuerpo) +
        parte('crin', img('ed-crin'), t.crin) +
        parte('cabeza',
          img('ed-cabeza') + parte('pupila', img('ed-pupila'), t.pupila) + parte('parpado', img('ed-parpado'), t.parpado) + parte('mandibula', img('ed-mandibula'), t.mandibula),
          t.cabeza) +
        parte('brazo-cerca', img('ed-brazo-cerca'), t['brazo-cerca']),
        t.ed),
      t.cabalgata) +
    // Huesito no pasa del piso: cuando se cae por el agujero de la red, lo que queda abajo no se ve.
    `<clipPath id="${seco}"><rect x="-400" y="-700" width="800" height="706"/></clipPath>` +
    `<g clip-path="url(#${seco})">` +
    parte('huesito',
      img('ed-hueso-cuerpo') + parte('hueso-brazos', img('ed-hueso-brazos'), t['hueso-brazos']) + parte('hueso-craneo', img('ed-hueso-craneo'), t['hueso-craneo']),
      t.huesito) +
    `</g>` +
    ([1, 2, 3] as const).map((i) => parte(`burbuja-${i}`, img('ed-burbuja'), t[`burbuja-${i}`], o[`burbuja-${i}`])).join('')
  );
}

/** El número en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function edEn(m: Momento = QUIETO, seco = 'ed-seco'): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m, seco)}</g>`;
}

/** El títere que se toca, en la pose quieta: en equilibrio sobre el tambor, Huesito en el lomo, la red rota en el piso. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--ed" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'Mister Ed y Huesito'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO, 'ed-seco')}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: el salto, el caballo parado de manos relinchando, Huesito patas para arriba, y la red con su agujero. */
export const RETRATO = { caja: [ED.x - 104, ED.piso - 190, 224, 204] as const };
function retrato(): string {
  return `<image href="/bestiario/templo-lejos.webp" x="-300" y="0" width="1500" height="640" preserveAspectRatio="none"/>` + edEn(SALTA, 'ed-seco-retrato');
}

export const ED_PERSONAJE: Personaje = {
  id: ID,
  region: 'el-templo',
  ancla: ED.x,
  piezas: PIEZAS_ED,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
