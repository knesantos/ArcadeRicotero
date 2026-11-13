/**
 * Los náufragos (`D-73`, vigesimoctava vuelta), asomando del agua del bajo inundado, agarrados de la mano.
 *
 * *"Ya no estás solo, estamos todos en naufragar"* es de *Canción para naufragios*, en *Oktubre* (1986). Se toma al
 * pie de la letra: son **dos** cabezas que asoman del agua, y **nadie está solo**: atrás, en lo oscuro, hay una multitud
 * de cabezas que casi no se ven (apenas los ojos y el filo de la luz), y cuando cae un rayo se alumbran todas, con los
 * brazos para arriba. Del mismo tema: *"son 6 minutos y nuestra mami va a contestar"* (el de la derecha tiene el
 * tubo de un teléfono pegado a la oreja, con el cable mojado colgando del agua, esperando, y un reloj en la muñeca
 * que marca seis y pico), *"mami elimina el error de que vos sos capaz"* (la cara de espanto), y *"bombas de aquí
 * para allá, rayos de aquí para allá, puede ser, es irreal"* (una bomba flota a un costado con la mecha encendida,
 * y es irreal: cuando la chispa llega, se desinfla como un globo; y el rayo cruza arriba). Se agarran de la mano
 * levantada en el medio, y de a ratos se les resbala y se vuelven a agarrar.
 *
 * De la letra son las dos cabezas, la multitud, el teléfono, los seis minutos, la bomba, el rayo y que se dan la
 * mano. Del dibujo son el salvavidas, el estornudo y que la bomba es un globo.
 *
 * Viste *Oktubre*, medido con sharp: la tapa es negro, blanco y el rojo de las banderas, a la gubia, y los dos
 * llevan eso: el pelo mojado es el negro, la remera de uno es el rojo, las caras son el blanco con rayitas de
 * grabado, y la multitud de atrás es el gris de la muchedumbre del fondo de la tapa.
 *
 * Coordenadas: el (0, 0) es la línea del agua entre los dos (`rig-nau.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { NAUF, NAUF_ARMADO as A, QUIETO, TODOS, marcas, type Momento } from './rig-nau.ts';

const ID = 'los-naufragos';

/** Las tintas de *Oktubre* (`tokens.css`). */
const C = {
  negro: 'var(--bestia-nau-negro)',
  rojo: 'var(--bestia-nau-rojo)',
  rojoVivo: 'var(--bestia-nau-rojo-vivo)',
  blanco: 'var(--bestia-nau-blanco)',
  gris: 'var(--bestia-nau-gris)',
  grisHondo: 'var(--bestia-nau-gris-hondo)',
  grisClaro: 'var(--bestia-nau-gris-claro)',
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

/** Las rayitas de la gubia: cortes cortos y paralelos, como los del grabado de la tapa. */
function gubia(x: number, y: number, n: number, largo: number, paso: number, giro: number, o = 0.85): string {
  let d = '';
  for (let i = 0; i < n; i++) d += `M${(x + i * paso).toFixed(1)} ${y.toFixed(1)} l${(Math.sin((giro * Math.PI) / 180) * largo).toFixed(1)} ${(Math.cos((giro * Math.PI) / 180) * largo).toFixed(1)}`;
  return trazo(d, C.negro, 0.9, o);
}

/* ------------------------------------------------------------------
   La multitud de atrás
   ------------------------------------------------------------------ */

/** Dónde asoman las cabezas de atrás: la `x`, la `y` del cogote, y lo grande que es cada una. Casi no se ven. */
const CABEZAS: ReadonlyArray<readonly [number, number, number]> = [
  [-236, -34, 0.9], [-208, -50, 1], [-182, -32, 0.85], [-156, -58, 1], [-132, -36, 0.9], [0, -64, 0.95], [102, -46, 0.9],
];

/** La multitud: cabezas y hombros negros con el filo de la luz de un lado y los dos ojos, que son lo único que se ve en lo oscuro. */
function multitud(): string {
  const rnd = azar(613);
  return conGrano(
    CABEZAS.map(([x, y, k], i) => {
      const r = 17 * k;
      const d = curva([[x - r, y - 2], [x - r * 0.9, y - r * 1.2], [x, y - r * 1.6], [x + r * 0.9, y - r * 1.2], [x + r, y - 2], [x + r * 0.6, y + r * 0.6], [x - r * 0.6, y + r * 0.6]]);
      const hombros = curva([[x - r * 2, 8], [x - r * 1.9, y + r * 0.9], [x - r * 0.9, y + r * 0.5], [x + r * 0.9, y + r * 0.5], [x + r * 1.9, y + r * 0.9], [x + r * 2, 8]]);
      const mira = i % 2 ? 1 : -1;
      return (
        forma(hombros, C.negro) + trazo(`M${x - r * 1.9} ${y + r * 0.9} Q${x - r * 1.4} ${y + r * 0.4} ${x - r * 0.9} ${y + r * 0.5}`, C.grisHondo, 1.2, 0.8) +
        forma(d, C.negro) + trazo(`M${x - r * 0.9 * mira} ${y - r * 1.2} Q${x - r * 0.2 * mira} ${y - r * 1.62} ${x + r * 0.7 * mira} ${y - r * 1.1}`, C.grisHondo, 1.4, 0.95) +
        forma(elipse(x - r * 0.34, y - r * 0.5, r * 0.2, r * 0.2), C.blanco) + forma(elipse(x + r * 0.34, y - r * 0.5, r * 0.2, r * 0.2), C.blanco) +
        forma(elipse(x - r * 0.34 + mira * 0.6, y - r * 0.46, r * 0.09, r * 0.1), C.negro) + forma(elipse(x + r * 0.34 + mira * 0.6, y - r * 0.46, r * 0.09, r * 0.1), C.negro) +
        nube(x, y - r * 0.4, r * 0.8, r * 0.7, C.grisHondo, 'xs', 0.28 + rnd() * 0.12)
      );
    }).join(''),
  );
}

/** Los brazos de la multitud, que se levantan cuando cae el rayo: con el codo doblado, el filo de luz, y la mano abierta. Salen de los hombros. */
function multitudBrazos(): string {
  return conGrano(
    CABEZAS.map(([x, y, k], i) => {
      const lado = i % 2 ? 1 : -1;
      const r = 17 * k;
      const alto = 54 + (i % 3) * 8;
      const pts: P[] = [[x + lado * r * 1.5, y + r * 0.8], [x + lado * r * 2.1, y - 8], [x + lado * r * 1.5, y - alto]];
      const d = tubo(pts, [8, 7, 6]);
      const [hx, hy] = pts[2]!;
      return (
        forma(d, C.negro) + trazo(`M${pts[0]![0] - lado * 2} ${pts[0]![1]} Q${pts[1]![0] - lado * 2} ${pts[1]![1]} ${hx - lado * 2} ${hy}`, C.grisHondo, 1, 0.9) +
        forma(elipse(hx, hy - 3, 4, 5), C.negro) + trazo(`M${hx - 3} ${hy - 6} l-2 -5 M${hx - 1} ${hy - 7} l-0.6 -6 M${hx + 1.4} ${hy - 7} l0.8 -6 M${hx + 3} ${hy - 5} l2 -5`, C.negro, 1.3) + trazo(`M${hx - 3.4} ${hy - 4} q-0.6 -3 0.6 -6`, C.grisHondo, 0.7, 0.9)
      );
    }).join(''),
  );
}

/* ------------------------------------------------------------------
   Los dos: cuerpo, cabeza, boca
   ------------------------------------------------------------------ */

/** El cuerpo del A, que asoma del agua: la remera roja mojada pegada, el cogote, y el salvavidas a la altura del agua. */
function cuerpoA(): string {
  const torso = curva([[-72, 6], [-70, -26], [-60, -40], [-46, -47], [-32, -40], [-22, -26], [-20, 6]]);
  const cuello = tubo([[-46, -46], [-46, -60]], [18, 17]);
  return conGrano(
    enmascarado('m-nau-cuello-a', cuello, forma(cuello, C.blanco) + nube(-40, -52, 6, 6, C.gris, 'xs', 0.8) + gubia(-52, -56, 5, 6, 2.6, 15)) +
    enmascarado('m-nau-torso-a', torso, forma(torso, C.rojo) + nube(-30, -22, 14, 24, C.negro, 's', 0.65) + nube(-62, -34, 10, 8, C.rojoVivo, 'xs', 0.6) +
      // Los pliegues de la remera mojada, pegada al cuerpo, y el cuello redondo.
      trazo('M-70 -20 Q-56 -26 -44 -20 M-60 -34 Q-48 -30 -34 -36 M-30 -22 Q-22 -18 -16 -10', C.negro, 1.3, 0.8) + trazo('M-58 -46 Q-46 -36 -34 -46', C.negro, 2.4) + gubia(-50, -40, 8, 8, 4, -20, 0.5)) +
    // El salvavidas: un aro rojo y blanco que flota a la altura del agua, con su soga.
    [0, 1, 2, 3, 4, 5].map((i) => {
      const g0 = (i / 6) * Math.PI * 2;
      const g1 = ((i + 1) / 6) * Math.PI * 2;
      const [rx, ry] = [40, 9];
      const [x0, y0, x1, y1] = [-46 + Math.cos(g0) * rx, -2 + Math.sin(g0) * ry, -46 + Math.cos(g1) * rx, -2 + Math.sin(g1) * ry];
      return trazo(`M${x0.toFixed(1)} ${y0.toFixed(1)} A${rx} ${ry} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`, i % 2 ? C.blanco : C.rojoVivo, 7);
    }).join('') + trazo('M-86 -2 A40 9 0 0 1 -6 -2', C.negro, 1, 0.6) + trazo('M-84 3 q-8 6 -4 14', C.negro, 1.2, 0.9),
  );
}

/** El cuerpo del B: la remera gris, mojada, con la franja negra, y el cogote. */
function cuerpoB(): string {
  const torso = curva([[18, 6], [20, -26], [32, -40], [46, -47], [60, -40], [72, -26], [74, 6]]);
  const cuello = tubo([[46, -46], [46, -60]], [18, 17]);
  return conGrano(
    enmascarado('m-nau-cuello-b', cuello, forma(cuello, C.blanco) + nube(52, -52, 6, 6, C.gris, 'xs', 0.8) + gubia(40, -56, 5, 6, 2.6, -15)) +
    enmascarado('m-nau-torso-b', torso, forma(torso, C.grisClaro) + nube(66, -22, 14, 26, C.gris, 's', 0.8) + nube(24, -34, 10, 8, C.blanco, 'xs', 0.8) +
      trazo('M20 -20 Q34 -26 48 -20 M30 -34 Q42 -30 56 -36 M62 -22 Q70 -18 76 -10', C.grisHondo, 1.3, 0.85) + trazo('M34 -46 Q46 -36 58 -46', C.negro, 2.4) +
      // La franja negra del pecho y el estampado: una estrella roja, medio lavada.
      forma(poli([[16, -24], [76, -24], [76, -16], [16, -16]]), C.negro, 0.85) + forma(poli([[46, -39], [49, -31], [57, -31], [51, -26], [53, -18], [46, -23], [39, -18], [41, -26], [35, -31], [43, -31]]), C.rojo, 0.75) + gubia(24, -44, 8, 8, 4, 20, 0.45)),
  );
}

/** La cara del A: pelado, de bigote, con la remera roja. Espantado. Dibujada con el (0, 0) en el agua. */
function cabezaA(): string {
  const d = curva([[-66, -80], [-64, -98], [-46, -106], [-28, -98], [-26, -80], [-32, -62], [-46, -54], [-60, -62]]);
  return conGrano(
    // Las orejas, y la cara con las rayitas de la gubia en las mejillas.
    forma(elipse(-66, -78, 4, 7), C.gris) + forma(elipse(-26, -78, 4, 7), C.grisHondo) +
    enmascarado('m-nau-cara-a', d, forma(d, C.blanco) + nube(-30, -76, 8, 20, C.gris, 's', 0.8) + nube(-56, -92, 8, 6, C.grisClaro, 'xs', 0.8) + nube(-46, -58, 14, 6, C.gris, 's', 0.7) +
      gubia(-62, -76, 5, 9, 2.4, -14) + gubia(-36, -74, 5, 9, 2.4, 14, 0.75) + gubia(-58, -62, 4, 5, 3, -20, 0.6)) +
    // El pelo mojado: lo poco que queda, pegado a los costados, con tres mechones cruzados arriba.
    forma(curva([[-68, -84], [-66, -100], [-52, -108], [-46, -106], [-60, -100], [-64, -88]]), C.negro) + forma(curva([[-24, -84], [-26, -100], [-38, -108], [-46, -106], [-32, -100], [-28, -88]]), C.negro) +
    trazo('M-58 -102 Q-46 -108 -36 -102 M-56 -98 Q-46 -104 -38 -98', C.negro, 1, 0.9) +
    // Los ojos de espanto: el blanco grande, la pupila chica, y las cejas para arriba.
    forma(elipse(-54, -82, 6.4, 7), C.negro) + forma(elipse(-54, -82, 5.2, 5.8), C.blanco) + forma(elipse(-53, -81, 2.2, 2.4), C.negro) +
    forma(elipse(-38, -82, 6.4, 7), C.negro) + forma(elipse(-38, -82, 5.2, 5.8), C.blanco) + forma(elipse(-37, -81, 2.2, 2.4), C.negro) +
    trazo('M-62 -92 Q-54 -98 -48 -90 M-44 -90 Q-38 -98 -30 -92', C.negro, 2.4) +
    // La nariz, y el bigote grueso.
    trazo('M-46 -80 q-4 8 1 12', C.negro, 1.4) + forma(curva([[-56, -70], [-46, -73], [-36, -70], [-40, -66], [-46, -68], [-52, -66]]), C.negro),
  );
}

/** La cara del B: de pelo largo, mojado, pegado a la cara. Con el tubo en la oreja. */
function cabezaB(): string {
  const d = curva([[26, -80], [28, -98], [46, -106], [64, -98], [66, -80], [60, -62], [46, -54], [32, -62]]);
  return conGrano(
    // El pelo de atrás, que cae por los hombros, y la cara.
    forma(curva([[24, -86], [22, -100], [46, -112], [70, -100], [70, -70], [74, -50], [60, -52], [58, -66], [34, -66], [32, -50], [20, -54], [22, -74]]), C.negro) +
    enmascarado('m-nau-cara-b', d, forma(d, C.blanco) + nube(32, -76, 8, 20, C.gris, 's', 0.8) + nube(54, -92, 8, 6, C.grisClaro, 'xs', 0.8) + nube(46, -58, 14, 6, C.gris, 's', 0.7) +
      gubia(30, -76, 5, 9, 2.4, -14, 0.75) + gubia(54, -74, 5, 9, 2.4, 14) + gubia(34, -62, 4, 5, 3, -20, 0.6)) +
    // El flequillo mojado, en rulos pegados a la frente.
    forma(curva([[26, -84], [28, -100], [46, -108], [64, -100], [66, -84], [58, -92], [50, -88], [44, -96], [36, -88], [30, -92]]), C.negro) + trazo('M36 -98 q6 6 10 0 M48 -98 q6 6 10 0', C.grisHondo, 0.9, 0.8) +
    // Los ojos, redondos, y las cejas.
    forma(elipse(38, -80, 6, 6.6), C.negro) + forma(elipse(38, -80, 4.8, 5.4), C.blanco) + forma(elipse(37, -79, 2, 2.2), C.negro) +
    forma(elipse(54, -80, 6, 6.6), C.negro) + forma(elipse(54, -80, 4.8, 5.4), C.blanco) + forma(elipse(53, -79, 2, 2.2), C.negro) +
    trazo('M31 -90 Q38 -95 44 -89 M48 -89 Q55 -95 62 -90', C.negro, 2.2) +
    // La nariz, y los labios pintados.
    trazo('M46 -78 q-4 8 1 12', C.negro, 1.4) + forma(poli([[40, -68], [46, -70], [52, -68], [46, -66]]), C.rojo, 0.9),
  );
}

/** La boca abierta de un grito: dentro de la cara, con los dientes de arriba y la lengua. El `scale(1 y)` la abre. Va dibujada abierta del todo. */
function bocaDe(i: 0 | 1): string {
  const [bx, by] = A.bocas[i];
  return conGrano(forma(elipse(bx, by, 9, 7.4), C.negro) + forma(poli([[bx - 7, by - 4.6], [bx + 7, by - 4.6], [bx + 5, by - 1.6], [bx - 5, by - 1.6]]), C.blanco) + forma(elipse(bx, by + 4, 5, 2.8), C.rojo) + trazo(`M${bx - 8} ${by - 6} Q${bx} ${by - 9} ${bx + 8} ${by - 6}`, C.negro, 1.2));
}

/* ------------------------------------------------------------------
   Los brazos
   ------------------------------------------------------------------ */

/**
 * El detalle de un brazo, como el resto del grabado: la rótula del codo, las líneas de la gubia siguiendo el músculo (una clara
 * y una oscura, paralelas a la línea del medio), y la muñeca con su puño. `pts` va del codo a la muñeca.
 */
function detalleBrazo(pts: readonly P[], w: readonly number[]): string {
  const paralela = (k: number): string =>
    curva(pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)]!;
      const b = pts[Math.min(pts.length - 1, i + 1)]!;
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      return [p[0] - ((b[1] - a[1]) / l) * w[i]! * k, p[1] + ((b[0] - a[0]) / l) * w[i]! * k] as P;
    }), false);
  const [ex, ey] = pts[0]!;
  const [wx, wy] = pts[pts.length - 1]!;
  const [vx, vy] = pts[pts.length - 2]!;
  const l = Math.hypot(wx - vx, wy - vy) || 1;
  const [ux, uy] = [(wx - vx) / l, (wy - vy) / l];
  const [mx, my] = [wx - ux * 5, wy - uy * 5];
  return (
    trazo(paralela(0.26), C.negro, 0.9, 0.7) + trazo(paralela(-0.28), C.grisHondo, 1.2, 0.7) + trazo(paralela(0.02), C.blanco, 0.8, 0.55) +
    // El codo: la rótula, con un par de cortes de gubia que la curvan.
    forma(elipse(ex, ey, 5.6, 5.2), C.blanco) + nube(ex + 1, ey + 2, 4, 2.4, C.gris, 'xs', 0.8) + trazo(`M${ex - 4} ${ey - 1} q4 -3 8 0 M${ex - 3.4} ${ey + 2} q3.6 -2.2 7 0`, C.negro, 0.8, 0.8) +
    // La muñeca: el hueso que sobresale y la raya del puño.
    trazo(`M${mx - uy * 4.6} ${my + ux * 4.6} L${mx + uy * 4.6} ${my - ux * 4.6}`, C.negro, 1.5, 0.85) + forma(elipse(mx + uy * 3.4, my - ux * 3.4, 1.8, 1.8), C.blanco)
  );
}

/** El brazo del A que se da la mano: la manga roja, el antebrazo, y el puño cerrado arriba. Los dos puños se pisan: es el apretón. */
function brazoA(): string {
  const [hx, hy] = A.hombros[0];
  const [mx, my] = A.manos;
  const manga = tubo([[hx, hy], [hx + 6, hy - 18]], [18, 14]);
  const ptsA: P[] = [[hx + 6, hy - 18], [mx - 12, my + 24], [mx - 2, my + 6]];
  const ante = tubo(ptsA, [12, 9.6, 8.6]);
  return conGrano(
    enmascarado('m-nau-ante-a', ante, forma(ante, C.blanco) + nube(mx - 10, my + 22, 4, 12, C.gris, 'xs', 0.8) + gubia(mx - 14, my + 14, 4, 6, 2.4, 20, 0.7)) +
    enmascarado('m-nau-manga-a', manga, forma(manga, C.rojo) + nube(hx + 8, hy - 8, 4, 10, C.negro, 'xs', 0.7) + trazo(`M${hx - 6} ${hy - 12} l12 4`, C.negro, 1.1, 0.8)) +
    detalleBrazo(ptsA, [12, 9.6, 8.6]) +
    // El puño: la mano cerrada con los nudillos, que aprieta la del otro.
    forma(elipse(mx - 3, my, 8, 7.6), C.negro) + forma(elipse(mx - 3, my, 7, 6.6), C.blanco) + nube(mx - 1, my + 3, 5, 3, C.gris, 'xs', 0.8) + trazo(`M${mx - 7} ${my - 3} l0 5 M${mx - 3} ${my - 4} l0 6 M${mx + 1} ${my - 3} l0 5`, C.negro, 0.9, 0.9),
  );
}

/** El brazo del B que se da la mano: la manga gris, el antebrazo con el reloj de pulsera, y el puño cerrado. El reloj marca seis y pico. */
function brazoB(): string {
  const [hx, hy] = A.hombros[1];
  const [mx, my] = A.manos;
  const manga = tubo([[hx, hy], [hx - 6, hy - 18]], [18, 14]);
  const ptsB: P[] = [[hx - 6, hy - 18], [mx + 12, my + 24], [mx + 2, my + 6]];
  const ante = tubo(ptsB, [12, 9.6, 8.6]);
  const [rx, ry] = [mx + 8, my + 14];
  return conGrano(
    enmascarado('m-nau-ante-b', ante, forma(ante, C.blanco) + nube(mx + 10, my + 22, 4, 12, C.gris, 'xs', 0.8) + gubia(mx + 6, my + 14, 4, 6, 2.4, -20, 0.7)) +
    enmascarado('m-nau-manga-b', manga, forma(manga, C.grisClaro) + nube(hx - 8, hy - 8, 4, 10, C.gris, 'xs', 0.8) + trazo(`M${hx + 6} ${hy - 12} l-12 4`, C.grisHondo, 1.1, 0.8)) +
    detalleBrazo(ptsB, [12, 9.6, 8.6]) +
    // El reloj de pulsera, con la correa negra: seis minutos y pico.
    trazo(`M${rx - 6} ${ry - 3} l12 6`, C.negro, 4) + forma(elipse(rx, ry, 6.4, 6.4), C.negro) + forma(elipse(rx, ry, 5.2, 5.2), C.blanco) + trazo(`M${rx} ${ry} L${rx} ${ry - 4} M${rx} ${ry} L${rx + 1.2} ${ry + 3.6}`, C.negro, 0.9) + trazo(`M${rx} ${ry - 4.6} v1 M${rx + 4.6} ${ry} h-1 M${rx} ${ry + 4.6} v-1 M${rx - 4.6} ${ry} h1`, C.grisHondo, 0.6) +
    forma(elipse(mx + 3, my + 2, 8, 7.6), C.negro) + forma(elipse(mx + 3, my + 2, 7, 6.6), C.blanco) + nube(mx + 1, my + 5, 5, 3, C.gris, 'xs', 0.8) + trazo(`M${mx - 1} ${my - 1} l0 5 M${mx + 3} ${my - 2} l0 6 M${mx + 7} ${my - 1} l0 5`, C.negro, 0.9, 0.9) + forma(elipse(mx - 4, my + 4, 2.4, 3.4), C.blanco) + trazo(`M${mx - 6} ${my + 2} q-1 3 1 5`, C.negro, 0.8, 0.9),
  );
}

/** El brazo libre del A: levantado, con la mano plana en la frente, para ver si hay un barco. Dibujado levantado; colgando se esconde en el agua. */
function libreA(): string {
  const [hx, hy] = A.libreA;
  const manga = tubo([[hx, hy], [hx - 14, hy - 8]], [18, 15]);
  const ptsL: P[] = [[hx - 14, hy - 8], [hx - 24, hy - 26], [hx - 10, hy - 50]];
  const ante = tubo(ptsL, [12, 10, 8.4]);
  return conGrano(
    enmascarado('m-nau-libre-ante', ante, forma(ante, C.blanco) + nube(hx - 22, hy - 24, 4, 12, C.gris, 'xs', 0.8) + gubia(hx - 28, hy - 30, 4, 6, 2.4, 20, 0.7)) +
    enmascarado('m-nau-libre-manga', manga, forma(manga, C.rojo) + nube(hx - 8, hy - 4, 4, 8, C.negro, 'xs', 0.7)) +
    detalleBrazo(ptsL, [12, 10, 8.4]) +
    // La mano plana, de canto, sobre las cejas.
    forma(curva([[hx - 20, hy - 50], [hx - 6, hy - 58], [hx + 10, hy - 56], [hx + 12, hy - 50], [hx - 4, hy - 46]]), C.blanco) + trazo(`M${hx - 18} ${hy - 50} Q${hx - 4} ${hy - 56} ${hx + 11} ${hy - 53}`, C.negro, 0.9, 0.9) + nube(hx - 2, hy - 48, 8, 2, C.gris, 'xs', 0.8) + gubia(hx - 14, hy - 53, 4, 3, 5, 8, 0.6),
  );
}

/** El brazo del B con el tubo del teléfono: el tubo de baquelita en la oreja, la mano que lo agarra, y el cable en espiral que cuelga hasta el agua. */
function tuboB(): string {
  const [sx, sy] = A.tuboB;
  const codo: P = [sx + 26, sy - 6];
  const mano: P = [sx + 8, sy - 30];
  const manga = tubo([[sx, sy], codo], [18, 15]);
  const ptsT: P[] = [codo, [codo[0] - 2, codo[1] - 14], mano];
  const ante = tubo(ptsT, [12, 10, 8.4]);
  // El tubo de baquelita de los de antes: el mango curvo, el auricular arriba y el micrófono abajo, más anchos, con el canto claro de la gubia que lo separa de la cara.
  const mango = tubo([[sx + 14, sy - 44], [sx + 12, sy - 28], [sx + 4, sy - 14]], [9, 8, 9]);
  const copa = (cx: number, cy: number, rx: number, ry: number, giro: number, rejilla: boolean): string =>
    `<g transform="rotate(${giro} ${cx} ${cy})">${forma(elipse(cx, cy, rx + 1.6, ry + 1.6), C.blanco)}${forma(elipse(cx, cy, rx, ry), C.negro)}${trazo(`M${cx - rx + 1.6} ${cy - ry * 0.4} Q${cx} ${cy - ry - 0.6} ${cx + rx - 1.6} ${cy - ry * 0.4}`, C.grisClaro, 1, 0.9)}` +
    (rejilla ? [-4, 0, 4].flatMap((dx) => [-2, 2].map((dy) => forma(elipse(cx + dx, cy + dy, 0.9, 0.9), C.grisClaro))).join('') : trazo(`M${cx - rx * 0.6} ${cy + 1} h${rx * 1.2}`, C.grisClaro, 0.8, 0.8)) + `</g>`;
  // El cable: espiral mojada, que baja del micrófono por afuera del cuerpo y se mete en el agua.
  const pts: P[] = [];
  for (let i = 0; i <= 13; i++) {
    const k = i / 13;
    pts.push([sx - 2 + 30 * k + (i % 2 ? 6 : -6) * (1 - k * 0.3), sy - 8 + 52 * k]);
  }
  const cable = `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')}`;
  return conGrano(
    trazo(cable, C.negro, 1.8) + trazo(cable, C.grisClaro, 0.5, 0.6) +
    enmascarado('m-nau-tubo-manga', manga, forma(manga, C.grisClaro) + nube(sx + 10, sy - 8, 6, 6, C.gris, 'xs', 0.8) + trazo(`M${sx} ${sy - 6} l14 -6`, C.grisHondo, 1.1, 0.8)) +
    enmascarado('m-nau-tubo-ante', ante, forma(ante, C.blanco) + nube(codo[0] + 2, codo[1] - 8, 4, 10, C.gris, 'xs', 0.8) + gubia(codo[0] - 4, codo[1] - 4, 4, 6, 2.4, -20, 0.7)) +
    detalleBrazo(ptsT, [12, 10, 8.4]) +
    forma(tubo([[sx + 14, sy - 44], [sx + 12, sy - 28], [sx + 4, sy - 14]], [11, 10, 11]), C.blanco) + forma(mango, C.negro) + trazo(`M${sx + 11} ${sy - 42} Q${sx + 9} ${sy - 28} ${sx + 2} ${sy - 15}`, C.grisClaro, 0.9, 0.85) + gubia(sx + 8, sy - 40, 4, 4, 2, 40, 0.8) +
    copa(sx + 14, sy - 48, 10, 7, 10, true) + copa(sx + 2, sy - 11, 9.4, 6.6, 16, false) +
    forma(elipse(mano[0] + 4, mano[1] - 2, 6.6, 5.6), C.blanco) + trazo(`M${mano[0] - 6} ${mano[1] - 3} l-1 3 M${mano[0] - 6} ${mano[1]} l-1 3 M${mano[0] - 5} ${mano[1] + 3} l-1 2.6`, C.negro, 0.9, 0.9) +
    '',
  );
}

/* ------------------------------------------------------------------
   La bomba y sus cosas, el agua, el rayo
   ------------------------------------------------------------------ */

const [BX, BY] = A.bomba.centro;
const BR = A.bomba.radio;

/** La bomba: una esfera negra con el brillo y la tapa, medio hundida. Es un globo, por eso se desinfla. */
function bomba(): string {
  return conGrano(
    nube(BX + 2, BY + BR, BR + 4, 4, C.negro, 's', 0.7) +
    enmascarado('m-nau-bomba', elipse(BX, BY, BR, BR), forma(elipse(BX, BY, BR, BR), C.negro) + nube(BX - 6, BY - 7, 6, 5, C.grisClaro, 'xs', 0.85) + nube(BX + 8, BY + 8, 8, 6, C.grisHondo, 's', 0.8) + trazo(`M${BX - BR} ${BY + 2} Q${BX} ${BY + 6} ${BX + BR} ${BY + 2}`, C.rojo, 2.2, 0.9)) +
    // El cuello del globo, donde está atada la mecha, con el nudito.
    forma(poli([[BX - 4, BY - BR + 2], [BX + 4, BY - BR + 2], [BX + 3, BY - BR - 3], [BX - 3, BY - BR - 3]]), C.gris) + forma(elipse(A.bomba.mecha[0], A.bomba.mecha[1] + 1, 3, 2), C.grisHondo),
  );
}

/** La mecha: un cordel que sale del cuello de la bomba para arriba y se tuerce. Va dibujada entera. */
function mecha(): string {
  const [mx, my] = A.bomba.mecha;
  return trazo(`M${mx} ${my} Q${mx - 4} ${my - 12} ${mx + 4} ${my - 20} Q${mx + 8} ${my - 26} ${mx + 4} ${my - 28}`, C.grisClaro, 1.8) + trazo(`M${mx} ${my} Q${mx - 4} ${my - 12} ${mx + 4} ${my - 20} Q${mx + 8} ${my - 26} ${mx + 4} ${my - 28}`, C.negro, 0.6, 0.7);
}

/** La chispa: una estrellita de rayos rojos y blancos, con su halo. La isla la baja por la mecha. Va dibujada en la punta. */
function chispa(): string {
  const [mx, my] = A.bomba.mecha;
  const [cx, cy] = [mx + 4, my - 29];
  let rayos = '';
  for (let i = 0; i < 8; i++) {
    const g = (i / 8) * Math.PI * 2;
    rayos += trazo(`M${(cx + Math.cos(g) * 2).toFixed(1)} ${(cy + Math.sin(g) * 2).toFixed(1)} L${(cx + Math.cos(g) * (i % 2 ? 5 : 8)).toFixed(1)} ${(cy + Math.sin(g) * (i % 2 ? 5 : 8)).toFixed(1)}`, i % 2 ? C.rojoVivo : C.blanco, 1.2);
  }
  return nube(cx, cy, 8, 8, C.rojoVivo, 'xs', 0.6) + rayos + forma(elipse(cx, cy, 2.2, 2.2), C.blanco);
}

/** El humo del pedito del globo: tres jirones. */
function humo(): string {
  const [mx, my] = A.bomba.mecha;
  return nube(mx, my - 6, 10, 7, C.gris, 'm', 0.55) + nube(mx - 6, my - 14, 7, 5, C.grisClaro, 's', 0.5) + nube(mx + 7, my - 12, 6, 5, C.gris, 's', 0.45);
}

/** Las ondas del agua: anillos chatos alrededor de cada cuello y de la bomba. La isla los abre. */
function ondas(): string {
  const anillo = (x: number, rx: number, o: number): string => `<ellipse cx="${x}" cy="1" rx="${rx}" ry="5" fill="none" stroke="${C.grisClaro}" stroke-width="1.1" opacity="${o}"/>`;
  return anillo(-46, 56, 0.55) + anillo(46, 56, 0.55) + anillo(-46, 70, 0.3) + anillo(46, 70, 0.3) + anillo(BX, 26, 0.5) + anillo(BX, 36, 0.28);
}

/** El rayo: un zigzag que baja de arriba, con el borde rojo vivo y el centro blanco. Va dibujado hacia el lado de la derecha. */
function rayo(): string {
  const [rx, ry] = A.rayo;
  const d = `M${rx} ${ry - 70} L${rx + 10} ${ry - 38} L${rx + 2} ${ry - 34} L${rx + 14} ${ry - 4} L${rx + 5} ${ry} L${rx + 18} ${ry + 28}`;
  return nube(rx + 10, ry - 20, 18, 40, C.rojoVivo, 's', 0.35) + trazo(d, C.rojoVivo, 5, 0.85) + trazo(d, C.blanco, 2, 1);
}

/** El chorro del estornudo: una nube de gotas, con las más grandes adelante. Sale de la boca del A para la izquierda. */
function gotas(): string {
  const [bx, by] = A.bocas[0];
  const rnd = azar(641);
  let g = '';
  for (let i = 0; i < 14; i++) {
    const r = 0.8 + rnd() * 1.8;
    g += forma(elipse(bx - 14 - rnd() * 22, by + (rnd() - 0.5) * 16, r, r * 1.3), i % 3 ? C.grisClaro : C.blanco, 0.9);
  }
  return g;
}

/** Las burbujas del que se hunde: un racimo, que sube. */
function burbujas(): string {
  return [[-46, -6, 3.4], [-40, -14, 2.4], [-52, -18, 2.8], [-44, -26, 1.8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.blanco}" stroke-width="0.9" opacity="0.9"/>`).join('');
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.2;

export const PIEZAS_NAUF: readonly Pieza[] = [
  { nombre: 'nau-multitud', caja: [-262, -92, 394, 98], dibujo: multitud(), densidad: D },
  { nombre: 'nau-multitud-brazos', caja: [-262, -130, 394, 134], dibujo: multitudBrazos(), densidad: D },
  { nombre: 'nau-cuerpo-a', caja: [-98, -64, 100, 80], dibujo: cuerpoA(), densidad: D },
  { nombre: 'nau-cuerpo-b', caja: [-2, -64, 98, 72], dibujo: cuerpoB(), densidad: D },
  { nombre: 'nau-cabeza-a', caja: [-74, -114, 54, 66], dibujo: cabezaA(), densidad: D * 1.8 },
  { nombre: 'nau-cabeza-b', caja: [18, -118, 58, 70], dibujo: cabezaB(), densidad: D * 1.8 },
  { nombre: 'nau-boca-a', caja: [A.bocas[0][0] - 12, A.bocas[0][1] - 12, 24, 22], dibujo: bocaDe(0), densidad: D * 3 },
  { nombre: 'nau-boca-b', caja: [A.bocas[1][0] - 12, A.bocas[1][1] - 12, 24, 22], dibujo: bocaDe(1), densidad: D * 3 },
  { nombre: 'nau-brazo-a', caja: [-48, -138, 56, 112], dibujo: brazoA(), densidad: D * 1.8 },
  { nombre: 'nau-brazo-b', caja: [-8, -138, 56, 112], dibujo: brazoB(), densidad: D * 1.8 },
  { nombre: 'nau-libre-a', caja: [A.libreA[0] - 40, A.libreA[1] - 70, 62, 82], dibujo: libreA(), densidad: D * 1.8 },
  { nombre: 'nau-tubo-b', caja: [A.tuboB[0] - 14, A.tuboB[1] - 56, 58, 112], dibujo: tuboB(), densidad: D * 1.8 },
  { nombre: 'nau-bomba', caja: [BX - BR - 8, BY - BR - 18, BR * 2 + 16, BR * 2 + 34], dibujo: bomba(), densidad: D * 2 },
  { nombre: 'nau-mecha', caja: [A.bomba.mecha[0] - 8, A.bomba.mecha[1] - 34, 24, 38], dibujo: mecha(), densidad: D * 2.4 },
  { nombre: 'nau-chispa', caja: [A.bomba.mecha[0] - 10, A.bomba.mecha[1] - 42, 28, 26], dibujo: chispa(), densidad: D * 2.6 },
  { nombre: 'nau-humo', caja: [A.bomba.mecha[0] - 22, A.bomba.mecha[1] - 28, 44, 44], dibujo: humo(), densidad: 1.4 },
  { nombre: 'nau-ondas', caja: [-124, -6, 248, 14], dibujo: ondas(), densidad: 1.8 },
  { nombre: 'nau-rayo', caja: [A.rayo[0] - 30, A.rayo[1] - 110, 70, 150], dibujo: rayo(), densidad: D },
  { nombre: 'nau-gotas', caja: [A.bocas[0][0] - 44, A.bocas[0][1] - 12, 44, 26], dibujo: gotas(), densidad: D * 3 },
  { nombre: 'nau-burbuja', caja: [-60, -32, 28, 32], dibujo: burbujas(), densidad: D * 3 },
];

const img = imagenesDe(PIEZAS_NAUF);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Los náufragos armados con las marcas de un momento. */
function armado(m: Momento, seco: string): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    // Todo lo que está en el agua se corta en la línea del agua: lo que se hunde no se ve.
    `<clipPath id="${seco}"><rect x="-400" y="-400" width="800" height="${402}"/></clipPath>` +
    `<g clip-path="url(#${seco})">` +
    parte('multitud', img('nau-multitud'), t.multitud, o.multitud) +
    parte('multitud-brazos', img('nau-multitud-brazos'), t['multitud-brazos'], o['multitud-brazos']) +
    parte('bomba', img('nau-bomba'), t.bomba) +
    parte('mecha', img('nau-mecha'), t.mecha) +
    parte('chispa', img('nau-chispa'), t.chispa, o.chispa) +
    parte('humo', img('nau-humo'), t.humo, o.humo) +
    parte('a',
      parte('libre-a', img('nau-libre-a'), t['libre-a']) +
      img('nau-cuerpo-a') +
      parte('cabeza-a', img('nau-cabeza-a') + parte('boca-a', img('nau-boca-a'), t['boca-a']), t['cabeza-a']) +
      parte('brazo-a', img('nau-brazo-a'), t['brazo-a']),
      t.a) +
    parte('b',
      img('nau-cuerpo-b') +
      parte('cabeza-b', img('nau-cabeza-b') + parte('boca-b', img('nau-boca-b'), t['boca-b']), t['cabeza-b']) +
      parte('tubo-b', img('nau-tubo-b'), t['tubo-b']) +
      parte('brazo-b', img('nau-brazo-b'), t['brazo-b']),
      t.b) +
    `</g>` +
    parte('ondas', img('nau-ondas'), t.ondas, o.ondas) +
    parte('gotas', img('nau-gotas'), t.gotas, o.gotas) +
    parte('burbuja', img('nau-burbuja'), t.burbuja, o.burbuja) +
    parte('rayo', img('nau-rayo'), t.rayo, o.rayo)
  );
}

/** Los náufragos en un momento, sin lo que los hace tocables: para el test, el retrato y para mirarlos. */
export function naufragosEn(m: Momento = QUIETO, seco = 'nau-seco'): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m, seco)}</g>`;
}

/** El títere que se toca, en la pose quieta: dos cabezas agarradas de la mano, la multitud apenas visible atrás. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--nau" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'Los náufragos'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO, 'nau-seco')}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: el rayo, la multitud con los brazos levantados, y los dos gritando de la mano. */
export const RETRATO = { caja: [NAUF.x - 190, NAUF.piso - 140, 270, 156] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/bajo-lejos.webp" x="-250" y="0" width="1450" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/bajo-agua.webp" x="-250" y="368" width="1450" height="272" preserveAspectRatio="none"/>` +
    naufragosEn(TODOS, 'nau-seco-retrato')
  );
}

export const NAUF_PERSONAJE: Personaje = {
  id: ID,
  region: 'el-bajo',
  ancla: NAUF.x,
  piezas: PIEZAS_NAUF,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
