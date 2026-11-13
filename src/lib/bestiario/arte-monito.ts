/**
 * El monito que trepa (`D-73`, decimoquinta vuelta), en el árbol del gran bonete.
 *
 * *"Cuanto más alto trepa el monito / el culo más se le ve"* es de *Juguetes perdidos*, que cierra
 * *Luzbelito* (1996). El monito no está en ninguna tapa: se inventa en la de su disco, que es la del
 * árbol (`D-19`, `T-440`). Adentro de esa tapa, en el marco de cobre, hay un busto modelado en barro
 * con una vela en la coronilla: arrugado, orejudo, con los dientes pelados y las cuencas hondas, y la
 * luz que le pega de arriba. Ya tiene algo de mono. **El monito está modelado en ese barro**: el pelo
 * son surcos de palillo, como el pelo de una figura de arcilla; la cara, las manos, los pies y el culo
 * son el barro liso y picado del busto, y las sombras se van al morado de sus cuencas. Las tintas se
 * midieron en el busto (`--bestia-monito-*`). Los ojos son de persona, como los animales de
 * Rocambole: el blanco impreso, la pupila y el párpado de la página, que la isla mueve.
 *
 * Trepa de espaldas, abrazado al tronco de mármol: los puños y los pies se agarran del canto y el
 * cuerpo sube entre ellos (`rig-monito.ts`). Abajo, a media altura, la cola le cuelga enrulada sobre
 * el culo y las rodillas lo encierran: tapado. Al trepar, la cola se levanta para el equilibrio y el
 * culo pelado asoma debajo del pelo, más cuanto más alto. Arriba de todo te mira por arriba del
 * hombro, y pela los dientes como el busto.
 *
 * Coordenadas del títere: el (0, 0) es la cadera, arriba es negativo (`MONITO_ARMADO`).
 */

import { forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { azar } from './pincel.ts';
import { ARRIBA, MONITO as M, MONITO_ARMADO, PIVOTES_PARPADO, TRAMO, pose, transformes, type Gesto, type Punto } from './rig-monito.ts';

type P = Punto;
const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** Las tintas del busto de *Luzbelito* (`tokens.css`), y la luz del cielo del árbol para el canto. */
const B = {
  luz: 'var(--bestia-monito-luz)',
  barro: 'var(--bestia-monito-barro)',
  ocre: 'var(--bestia-monito-ocre)',
  rojo: 'var(--bestia-monito-rojo)',
  rosa: 'var(--bestia-monito-rosa)',
  hondo: 'var(--bestia-monito-hondo)',
  cuenca: 'var(--bestia-monito-cuenca)',
  diente: 'var(--bestia-monito-diente)',
  blanco: 'var(--bestia-ojo-blanco)',
  cielo: 'var(--entorno-arbol-nube)',
  negro: 'var(--fondo)',
};

/* ------------------------------------------------------------------
   Herramientas: la curva, la máscara, el tubo y los surcos del pelo
   ------------------------------------------------------------------ */

/** Una curva suave que pasa por todos los puntos (Catmull-Rom llevada a Bézier). */
function curva(pts: readonly P[], cerrada = true): string {
  const n = pts.length;
  const en = (i: number): P => (cerrada ? pts[(i + n) % n]! : pts[Math.min(n - 1, Math.max(0, i))]!);
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  for (let i = 0; i < (cerrada ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [en(i - 1), en(i), en(i + 1), en(i + 2)];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return cerrada ? `${d} Z` : d;
}

const espejo = (pts: readonly P[]): P[] => pts.map(([x, y]) => [-x, y] as const).reverse();
const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;
const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;

/**
 * La máscara del aerógrafo, con varias siluetas que se suman: el puño y el pulgar, el pie y el dedo
 * gordo. Ojo: la imprenta junta los caminos del recorte en uno solo, así que todas tienen que girar
 * para el mismo lado (las de `elipse` giran al revés del reloj), o se restan donde se pisan.
 */
function enmascarado(id: string, siluetas: string | readonly string[], adentro: string): string {
  const todas = typeof siluetas === 'string' ? [siluetas] : siluetas;
  return `<clipPath id="${id}">${todas.map((d) => `<path d="${d}"/>`).join('')}</clipPath><g clip-path="url(#${id})">${adentro}</g>`;
}

/** Un punto de una línea quebrada, en `t` de 0 a 1 de su largo, con la dirección. */
function enLinea(pts: readonly P[], t: number): { p: P; dir: P } {
  const largos = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i]![0], p[1] - pts[i]![1]));
  const total = largos.reduce((s, l) => s + l, 0);
  let falta = t * total;
  for (let i = 0; i < largos.length; i++) {
    const l = largos[i]!;
    if (falta <= l || i === largos.length - 1) {
      const k = l ? Math.min(1, falta / l) : 0;
      const [a, b] = [pts[i]!, pts[i + 1]!];
      return { p: [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], dir: [(b[0] - a[0]) / (l || 1), (b[1] - a[1]) / (l || 1)] };
    }
    falta -= l;
  }
  return { p: pts[pts.length - 1]!, dir: [0, 1] };
}

interface Tubo {
  d: string;
  muestra: (t: number) => { p: P; dir: P; ancho: number };
}

/**
 * Un tubo que se afina: el contorno de un brazo, una pata, la cola. `anchos` va de punta a punta
 * repartido por el largo; las puntas se cierran redondas.
 */
function tubo(eje: readonly P[], anchos: readonly number[], pasos = 14): Tubo {
  const ancho = (t: number): number => {
    const x = t * (anchos.length - 1);
    const i = Math.min(anchos.length - 2, Math.floor(x));
    return anchos[i]! + (anchos[i + 1]! - anchos[i]!) * (x - i);
  };
  const izq: P[] = [];
  const der: P[] = [];
  for (let k = 0; k <= pasos; k++) {
    const t = k / pasos;
    const { p, dir } = enLinea(eje, t);
    const w = ancho(t) / 2;
    izq.push([p[0] + dir[1] * w, p[1] - dir[0] * w]);
    der.push([p[0] - dir[1] * w, p[1] + dir[0] * w]);
  }
  const a = enLinea(eje, 0);
  const b = enLinea(eje, 1);
  const puntaA: P = [a.p[0] - a.dir[0] * ancho(0) * 0.42, a.p[1] - a.dir[1] * ancho(0) * 0.42];
  const puntaB: P = [b.p[0] + b.dir[0] * ancho(1) * 0.42, b.p[1] + b.dir[1] * ancho(1) * 0.42];
  return {
    d: curva([puntaA, ...izq, puntaB, ...der.reverse()]),
    muestra: (t) => ({ ...enLinea(eje, t), ancho: ancho(t) }),
  };
}

/** Cuánta luz le toca a un punto del monito: viene de arriba a la izquierda, del cielo del árbol. */
const luzEn = ([x, y]: P, cx = 0, cy = -50): number => Math.max(0, Math.min(1, 0.5 - (x - cx) / 50 - (y - cy) / 160));

/**
 * Los surcos del pelo: cada uno es una raya honda, hecha con un palillo en el barro, y el filo que
 * levanta del lado de la luz (más donde la luz pega). Siguen la dirección de `peinado`.
 */
function surcos(rnd: () => number, n: number, lugar: () => P, peinado: (p: P) => number, largo: number, luz: (p: P) => number = () => 0.5): string {
  let hondo = '';
  let filo = '';
  for (let i = 0; i < n; i++) {
    const [x, y] = lugar();
    const a = peinado([x, y]) + (rnd() - 0.5) * 0.4;
    const l = largo * (0.55 + rnd() * 0.75);
    const [dx, dy] = [Math.cos(a) * l, Math.sin(a) * l];
    const curvo = (rnd() - 0.5) * 0.4;
    const d = `M${f(x)} ${f(y)} q${f(dx * 0.5 - dy * curvo)} ${f(dy * 0.5 + dx * curvo)} ${f(dx)} ${f(dy)}`;
    hondo += trazo(d, B.cuenca, 0.9 + rnd() * 0.6, 0.35 + rnd() * 0.3);
    const k = luz([x, y]);
    if (k > 0.08) filo += `<g transform="translate(-0.6 -0.7)">${trazo(d, B.barro, 0.55, (0.08 + rnd() * 0.18) * k * 1.6)}</g>`;
  }
  return hondo + filo;
}

/** Dentro de una elipse, al azar. */
const enElipse = (rnd: () => number, cx: number, cy: number, rx: number, ry: number) => (): P => {
  const a = rnd() * Math.PI * 2;
  const r = Math.sqrt(rnd());
  return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r];
};

/** Surcos a lo largo de un tubo, peinados hacia la punta. */
function pelaje(t: Tubo, rnd: () => number, n: number, largo: number, luz: (p: P) => number): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const { p, dir, ancho } = t.muestra(rnd());
    const lado = (rnd() - 0.5) * ancho * 0.9;
    const x = p[0] + dir[1] * lado;
    const y = p[1] - dir[0] * lado;
    s += surcos(rnd, 1, () => [x, y], () => Math.atan2(dir[1], dir[0]), largo, luz);
  }
  return s;
}

/**
 * Lo desparejo del aerógrafo y del barro: manchitas sopladas de más y de menos, que le sacan lo liso
 * de juguete de peluche. Más claras del lado de la luz.
 */
function manchas(rnd: () => number, n = 26): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const [x, y] = [(rnd() - 0.5) * 60, -92 + rnd() * 100];
    const k = luzEn([x, y]);
    s += nube(x, y, 2 + rnd() * 4, 2 + rnd() * 5, rnd() < k ? B.ocre : B.cuenca, 's', 0.2 + rnd() * 0.3);
  }
  return s;
}

/* ------------------------------------------------------------------
   El lomo, de espaldas, abrazado al tronco
   ------------------------------------------------------------------ */

const LOMO_IZQ: readonly P[] = [[-8, -95], [-21, -90], [-32, -81], [-34, -69], [-27, -53], [-22, -38], [-25, -22], [-29, -7], [-27, 5], [-17, 12.5], [-6, 12]];
/** La silueta del lomo: los hombros, la cintura, las nalgas de pelo, con la raya en el medio. */
export const LOMO: readonly P[] = [...LOMO_IZQ, [0, 9.5], ...espejo(LOMO_IZQ)];

function lomo(): string {
  const d = curva(LOMO);
  const rnd = azar(311);
  // El pelo baja por el lomo y se abre para los costados; en los hombros, más.
  const peinado = ([x, y]: P): number => Math.PI / 2 + (x / 34) * 0.6 - (y < -70 ? (x / 34) * 0.5 : 0);
  const adentro =
    forma(d, B.hondo) +
    // La luz de arriba a la izquierda: el omóplato y el costado prendidos, la otra mitad se hunde.
    nube(-17, -60, 15, 34, B.ocre, 'l', 0.85) +
    nube(-21, -78, 9, 7, B.barro, 'm', 0.5) +
    nube(-27, -46, 3.5, 22, B.barro, 'm', 0.35) +
    nube(-12, -1, 11, 8, B.ocre, 'm', 0.55) +
    nube(18, -44, 16, 54, B.cuenca, 'l', 0.9) +
    nube(30, -40, 6, 46, B.negro, 'm', 0.45) +
    nube(11, -73, 9, 7, B.ocre, 'm', 0.3) +
    // Los omóplatos y los dorsales, modelados con el pulgar: el de la luz prendido, el otro apenas.
    nube(-15, -71, 9, 11, B.barro, 'm', 0.55, -20) +
    nube(13, -70, 8, 10, B.ocre, 'm', 0.4, 20) +
    nube(-8, -60, 4, 7, B.cuenca, 's', 0.5) +
    nube(-22, -52, 5, 14, B.ocre, 'm', 0.6, 25) +
    nube(19, -52, 5, 14, B.cuenca, 'm', 0.6, -25) +
    // La cintura, que se quiebra, y las ancas de abajo.
    nube(-23, -36, 4, 3, B.cuenca, 's', 0.7) +
    nube(23, -36, 4, 3, B.negro, 's', 0.6) +
    nube(-16, -16, 9, 10, B.ocre, 'm', 0.5) +
    manchas(azar(317)) +
    // La columna: un surco hondo hasta la cola, con el filo de la luz a su izquierda.
    nube(1, -48, 2.4, 40, B.cuenca, 's', 0.9) +
    nube(-3.5, -50, 1.6, 34, B.barro, 's', 0.22) +
    // Debajo de los hombros, donde se meten los brazos, y abajo de las nalgas.
    nube(-31, -66, 3.5, 8, B.cuenca, 's', 0.7) +
    nube(31, -66, 4, 9, B.cuenca, 's', 0.9) +
    nube(0, 13, 24, 4, B.cuenca, 's', 0.8) +
    surcos(rnd, 230, enElipse(rnd, 0, -42, 33, 54), peinado, 6, (p) => luzEn(p)) +
    // El canto frío del cielo, del lado de la luz: lo despega del mármol.
    nube(-33, -66, 1.6, 20, B.cielo, 's', 0.55) +
    nube(-22, -89, 7, 1.6, B.cielo, 's', 0.4);
  return conGrano(enmascarado('m-monito-lomo', d, adentro));
}

/* ------------------------------------------------------------------
   El culo pelado, como el de un macaco: piel roja y dos callos
   ------------------------------------------------------------------ */

/** El contorno del culo pelado, en el títere: la piel roja con las dos nalgas abajo. */
export const CULO_PIEL: readonly P[] = ([[-19, 4], [-15, -2], [-6, -4], [0, -1.5], [6, -4], [15, -2], [19, 4], [16, 13], [7, 18], [0, 16], [-7, 18], [-16, 13]] as const).map(
  ([x, y]) => [MONITO_ARMADO.culo[0] + x, MONITO_ARMADO.culo[1] + y] as const,
);

function culo(): string {
  const [cx, cy] = MONITO_ARMADO.culo;
  const piel = curva(CULO_PIEL);
  return conGrano(
    enmascarado('m-monito-culo', piel,
      forma(piel, B.rojo) +
      // Los dos callos, rosados, abultados apenas: el de la luz más claro.
      nube(cx - 8, cy + 5, 8.5, 7.5, B.rosa, 'm', 0.95) +
      nube(cx + 8, cy + 5, 8, 7, B.rosa, 'm', 0.45) +
      nube(cx - 10, cy + 2.5, 4.5, 3.5, B.luz, 's', 0.5) +
      // Lo que queda arriba, contra el pelo, y abajo, en sombra.
      nube(cx, cy - 4, 20, 3.5, B.hondo, 's', 0.85) +
      nube(cx + 12, cy + 8, 7, 9, B.hondo, 'm', 0.65) +
      nube(cx, cy + 17, 15, 3, B.cuenca, 's', 0.7) +
      // La raya del medio.
      soplo(`M${f(cx - 1.4)} ${f(cy - 3)} L${f(cx + 1.4)} ${f(cy - 3)} L${f(cx + 0.8)} ${f(cy + 16)} L${f(cx - 0.8)} ${f(cy + 16)} Z`, B.cuenca, 'xs', 0.85)),
  );
}

/* ------------------------------------------------------------------
   La cola: el tramo que nace del lomo, y el rulo que tapa
   ------------------------------------------------------------------ */

const [COLA_X, COLA_Y] = MONITO_ARMADO.cola;
const [RULO_X, RULO_Y] = MONITO_ARMADO.rulo;

/**
 * El eje del rulo: del nudo baja, dobla a la izquierda y sube, y la punta se enrosca para adentro. Es
 * un gancho abierto, no un anillo: colgado es una jota sobre el culo, levantado es un signo de
 * pregunta.
 */
export function ejeDelRulo(): P[] {
  const c: P = [RULO_X - 7, RULO_Y + 1];
  const a0 = Math.atan2(RULO_Y - c[1], RULO_X - c[0]);
  const r0 = Math.hypot(RULO_X - c[0], RULO_Y - c[1]);
  const pts: P[] = [];
  for (let k = 0; k <= 40; k++) {
    const t = k / 40;
    const a = a0 + t * Math.PI * 2 * 0.64;
    const r = r0 * (1 - 0.38 * t * t);
    pts.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]);
  }
  return [[RULO_X - 0.5, RULO_Y - 3], ...pts];
}

/** La cola cuelga derecha del lomo, con una curva apenas, hasta el nudo donde empieza el rulo. */
const EJE_COLA: readonly P[] = [[COLA_X, COLA_Y - 5], [COLA_X + 1.4, COLA_Y + 9], [COLA_X - 0.4, COLA_Y + 19], [RULO_X, RULO_Y + 2]];

function cola(): string {
  const t = tubo(EJE_COLA, [9, 8, 7.5, 7.5], 18);
  const rnd = azar(331);
  return conGrano(
    enmascarado('m-monito-cola', t.d,
      forma(t.d, B.hondo) + nube(COLA_X - 2.2, (COLA_Y + RULO_Y) / 2, 2.2, 15, B.ocre, 's', 0.85) + pelaje(t, rnd, 20, 4.5, () => 0.6)),
  );
}

/** La caja de un juego de puntos, con aire. */
const cajaDe = (pts: readonly P[], aire: number): readonly [number, number, number, number] => {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, y0] = [Math.floor(Math.min(...xs) - aire), Math.floor(Math.min(...ys) - aire)];
  return [x0, y0, Math.ceil(Math.max(...xs) + aire) - x0, Math.ceil(Math.max(...ys) + aire) - y0];
};

function rulo(): string {
  const t = tubo(ejeDelRulo(), [7.5, 7, 6.2, 5.4, 4.6, 3.9, 3.2], 60);
  const rnd = azar(337);
  // El lomo de cada vuelta, del lado de la luz.
  let luz = '';
  for (let k = 0; k < 44; k++) {
    const { p, ancho } = t.muestra(k / 44);
    luz += nube(p[0] - ancho * 0.16, p[1] - ancho * 0.2, ancho * 0.26, ancho * 0.24, B.ocre, 'xs', 0.6 * luzEn(p, -6, 12) + 0.15);
  }
  return conGrano(enmascarado('m-monito-rulo', t.d, forma(t.d, B.hondo) + luz + pelaje(t, rnd, 26, 3.4, () => 0.5)));
}

/* ------------------------------------------------------------------
   Los brazos y las patas: cada uno en dos tramos, dibujados derechos
   ------------------------------------------------------------------
   Los brazos se dibujan para arriba y las patas para abajo, desde su articulación; la isla los gira
   (`alcanzar`, en `rig-monito.ts`) para que el puño y el pie caigan en el canto del tronco.
*/

const L = MONITO_ARMADO.largos;

/**
 * La mano doblada en la muñeca, sobre la corteza: el antebrazo sube por el canto del tronco y la mano
 * se acuesta para adentro, hacia el eje, y se agarra. Se dibuja derecha y se dobla con `doblada`.
 */
const DOBLA_MUNECA = 78;
const DOBLA_TOBILLO = 52;
/** `haciaArriba`: la mano sigue al antebrazo para arriba; el pie, a la pierna para abajo. */
const doblada = (muneca: P, lado: 1 | -1, cuanto: number, haciaArriba: boolean, dibujo: (centro: P) => string, largo: number, escala = 1.2): string => {
  const [cx, cy] = [muneca[0], muneca[1] + (haciaArriba ? -largo : largo)];
  return (
    `<g transform="rotate(${f((haciaArriba ? -lado : lado) * cuanto)} ${f(muneca[0])} ${f(muneca[1])})">` +
    `<g transform="translate(${f(cx)} ${f(cy)}) scale(${escala}) translate(${f(-cx)} ${f(-cy)})">${dibujo([cx, cy])}</g></g>`
  );
};

/**
 * El puño agarrado a la corteza: los dedos se clavan para adentro, donde no se ven; quedan los
 * nudillos, los pliegues de los dedos doblados y el pulgar de este lado. `lado` -1 es la izquierda.
 */
function puno([x, y]: P, lado: 1 | -1, id: string): string {
  // Al revés del reloj, como la elipse del pulgar: van en la misma máscara.
  const contorno: P[] = [[x - 5, y + 5], [x - 6, y - 1], [x - 4.5, y - 6], [x, y - 7.5], [x + 4.5, y - 6], [x + 6, y - 1], [x + 5, y + 5], [x, y + 6.5]];
  const dorso = curva(contorno.reverse());
  const pulgar = elipse(x - lado * 4.6, y + 1.8, 2.6, 4.2);
  const k = lado < 0 ? 1 : 0.45;
  return enmascarado(id, [dorso, pulgar],
    forma(dorso, B.hondo) + forma(pulgar, B.hondo) +
    nube(x - 1.5, y - 1.5, 5.5, 5.5, B.ocre, 's', 0.9) +
    nube(x - 2, y - 2.5, 3.6, 3.2, B.barro, 's', 0.8 * k) +
    nube(x + 3.5, y + 3, 4, 4, B.cuenca, 's', 0.7) +
    // Los nudillos, prendidos, y los pliegues de los dedos que se doblan para atrás.
    [-3.6, -1.2, 1.2, 3.6].map((dx) => nube(x + dx - 0.3, y - 5.4, 1.2, 1, B.luz, 'xs', 0.55 * k)).join('') +
    [-2.4, 0, 2.4].map((dx) => trazo(`M${f(x + dx)} ${f(y - 6.5)} L${f(x + dx * 1.1)} ${f(y - 1)}`, B.cuenca, 0.8, 0.75)).join('') +
    trazo(`M${f(x - 4.5)} ${f(y - 0.5)} q4.5 1.4 9 0`, B.hondo, 0.7, 0.55) +
    nube(x - lado * 4.6, y + 0.5, 1.4, 2.4, lado < 0 ? B.barro : B.ocre, 'xs', 0.7) +
    nube(x - lado * 4, y + 5, 2.2, 1.4, B.cuenca, 'xs', 0.6));
}

/** El pie: otro puño, más largo, con el dedo gordo que agarra de este lado del canto. */
function pie([x, y]: P, lado: 1 | -1, id: string): string {
  const planta = curva([[x - 5, y - 8], [x - 6, y], [x - 5, y + 6], [x, y + 8], [x + 5, y + 6], [x + 6, y], [x + 5, y - 8], [x, y - 9.5]]);
  const gordo = elipse(x - lado * 5, y - 0.5, 2.8, 4.8);
  const k = lado < 0 ? 1 : 0.45;
  return enmascarado(id, [planta, gordo],
    forma(planta, B.hondo) + forma(gordo, B.hondo) +
    nube(x - 1.5, y - 1, 5.5, 7, B.ocre, 's', 0.9) +
    nube(x - 2, y - 2, 3.6, 4.5, B.barro, 's', 0.75 * k) +
    nube(x + 3.5, y + 3, 4, 5, B.cuenca, 's', 0.7) +
    [-3.4, -1.1, 1.1, 3.4].map((dx) => nube(x + dx - 0.3, y + 6, 1.1, 0.9, B.barro, 'xs', 0.5 * k)).join('') +
    [-2.3, 0, 2.3].map((dx) => trazo(`M${f(x + dx)} ${f(y + 7.5)} L${f(x + dx * 1.1)} ${f(y + 2.5)}`, B.cuenca, 0.8, 0.75)).join('') +
    nube(x - lado * 5, y - 2, 1.4, 2.6, lado < 0 ? B.barro : B.ocre, 'xs', 0.6));
}

/** Un tramo peludo, de la articulación para arriba o para abajo, con la luz del lado de afuera o de adentro. */
function tramo(eje: readonly P[], anchos: readonly number[], luzALaIzquierda: boolean, semilla: number, id: string): string {
  const t = tubo(eje, anchos);
  const rnd = azar(semilla);
  const [a, b] = [eje[0]!, eje[eje.length - 1]!];
  const [mx, my] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const largo = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const lado = luzALaIzquierda ? -1 : 1;
  const ancho = Math.max(...anchos);
  return enmascarado(id, t.d,
    forma(t.d, B.hondo) +
    nube(mx + lado * ancho * 0.22, my, ancho * 0.26, largo * 0.46, B.ocre, 'm', luzALaIzquierda ? 0.9 : 0.3) +
    (luzALaIzquierda ? '' : nube(mx + ancho * 0.3, my, ancho * 0.2, largo * 0.46, B.negro, 's', 0.35)) +
    (luzALaIzquierda ? nube(mx - ancho * 0.3, my - largo * 0.1, ancho * 0.1, largo * 0.3, B.barro, 's', 0.35) : '') +
    nube(mx - lado * ancho * 0.34, my, ancho * 0.16, largo * 0.48, B.cuenca, 's', 0.8) +
    // El músculo cerca de la articulación de arriba, y el pliegue donde se dobla.
    nube(mx + lado * ancho * 0.18, a[1] + (b[1] - a[1]) * 0.3, ancho * 0.3, largo * 0.16, luzALaIzquierda ? B.barro : B.ocre, 'm', luzALaIzquierda ? 0.4 : 0.25) +
    nube(a[0], a[1] + Math.sign(b[1] - a[1]) * 3, ancho * 0.5, 2.4, B.cuenca, 's', 0.55) +
    pelaje(t, rnd, Math.round(largo * 1.1), 4.5, () => (luzALaIzquierda ? 0.7 : 0.25)) +
    (luzALaIzquierda ? nube(mx - ancho * 0.46, my, 1.2, largo * 0.36, B.cielo, 's', 0.4) : ''));
}

const [H1, H2] = MONITO_ARMADO.hombros;
const [C1, C2] = MONITO_ARMADO.caderas;

/** El brazo de arriba, del hombro al codo. */
const brazo = (s: P, n: 1 | 2): string =>
  conGrano(tramo([[s[0], s[1] + 5], [s[0], s[1] - L.brazo * 0.5], [s[0], s[1] - L.brazo - 3]], [15, 13.5, 10.5, 9.5], n === 1, 401 + n, `m-monito-brazo-${n}`));

/** El antebrazo con el puño, del codo al canto del tronco. */
function antebrazo(s: P, n: 1 | 2): string {
  const codo: P = [s[0], s[1] - L.brazo];
  const agarre: P = [codo[0], codo[1] - L.antebrazo];
  const lado = n === 1 ? -1 : 1;
  return conGrano(
    tramo([[codo[0], codo[1] + 4], [codo[0], codo[1] - L.antebrazo * 0.45], [agarre[0], agarre[1] - 2]], [10.5, 10.5, 8.5, 7], n === 1, 411 + n, `m-monito-antebrazo-${n}`) +
    doblada(agarre, lado, DOBLA_MUNECA, true, (c) => puno(c, lado, `m-monito-puno-${n}`), 5.5),
  );
}

/** El muslo, de la cadera a la rodilla. */
const muslo = (c: P, n: 1 | 2): string =>
  conGrano(tramo([[c[0], c[1] - 6], [c[0], c[1] + L.muslo * 0.5], [c[0], c[1] + L.muslo + 3]], [18, 16.5, 12.5, 10.5], n === 1, 421 + n, `m-monito-muslo-${n}`));

/** La pierna con el pie, de la rodilla al canto. */
function pierna(c: P, n: 1 | 2): string {
  const rodilla: P = [c[0], c[1] + L.muslo];
  const agarre: P = [rodilla[0], rodilla[1] + L.pata];
  const lado = n === 1 ? -1 : 1;
  return conGrano(
    tramo([[rodilla[0], rodilla[1] - 4], [rodilla[0], rodilla[1] + L.pata * 0.45], [agarre[0], agarre[1] + 2]], [11.5, 11, 8.5, 7], n === 1, 431 + n, `m-monito-pierna-${n}`) +
    doblada(agarre, lado, DOBLA_TOBILLO, false, (c) => pie(c, lado, `m-monito-pie-${n}`), 7),
  );
}

/* ------------------------------------------------------------------
   La cabeza: de espaldas, dada vuelta por arriba del hombro
   ------------------------------------------------------------------ */

const [O1, O2] = MONITO_ARMADO.ojos;

/** La cara pelada: más ancha en la frente, con el hocico que sale abajo, a la izquierda. */
const CARA: readonly P[] = [[-24, -116], [-20, -124], [-11, -127], [-1, -124], [3, -115], [2, -103], [-2, -92], [-11, -87.5], [-20, -90], [-25, -100]];

function cabeza(): string {
  const rnd = azar(353);
  const craneo = elipse(1, -110, 19.5, 19);
  const oreja = elipse(19, -108, 6.5, 9);
  // La cara gira para el mismo lado que la elipse del cráneo: van juntas en una sola máscara.
  const cara = curva([...CARA].reverse());
  // Adentro de la cara no hay pelo: el pelo se peina desde afuera de este óvalo.
  const enLaCara = ([x, y]: P): boolean => ((x + 11) / 13.5) ** 2 + ((y + 107) / 19.5) ** 2 < 1;
  const peinadoCraneo = ([x, y]: P): number => Math.atan2(y + 110, x + 4) * 0.5 + 0.5;
  const lugarDelPelo = (): P => {
    const en = enElipse(rnd, 3, -111, 19, 18);
    for (let k = 0; k < 12; k++) {
      const p = en();
      if (!enLaCara(p)) return p;
    }
    return [12, -112];
  };
  const pelo =
    nube(-6, -121, 14, 9, B.ocre, 'm', 0.75) +
    nube(13, -104, 9, 15, B.cuenca, 'm', 0.85) +
    surcos(rnd, 80, lugarDelPelo, peinadoCraneo, 4.5, (p) => luzEn(p, -6, -112) * 0.8) +
    nube(-14, -126, 6, 1.6, B.cielo, 's', 0.45);
  const orejaD = enmascarado('m-monito-oreja', oreja,
    forma(oreja, B.hondo) + nube(17, -111, 4, 6, B.ocre, 'm', 0.6) + nube(20, -106, 3, 5.5, B.cuenca, 's', 0.95) + trazo('M14 -114 Q18 -119.5 23 -114', B.barro, 0.7, 0.35));
  // El ojo: la cuenca honda, el blanco chico, y la sombra del ceño que le cae arriba.
  const ojo = (o: typeof O1): string =>
    nube(o.centro[0], o.centro[1] + 0.3, o.radio[0] + 3.2, o.radio[1] + 3, B.cuenca, 's', 0.95) +
    `<ellipse cx="${o.centro[0]}" cy="${o.centro[1]}" rx="${o.radio[0]}" ry="${o.radio[1]}" fill="${B.blanco}"/>` +
    nube(o.centro[0], o.centro[1] - o.radio[1] * 0.6, o.radio[0] * 1.1, o.radio[1] * 0.55, B.cuenca, 'xs', 0.65) +
    // La bolsa de abajo, arrugada como la del busto.
    trazo(`M${f(o.centro[0] - o.radio[0])} ${f(o.centro[1] + o.radio[1] + 1.4)} Q${f(o.centro[0])} ${f(o.centro[1] + o.radio[1] + 3.2)} ${f(o.centro[0] + o.radio[0])} ${f(o.centro[1] + o.radio[1] + 1.2)}`, B.hondo, 0.7, 0.6);
  // La piel de la cara va soplada adentro de la cabeza: contra el pelo se funde, y donde la cara es el
  // borde de la cabeza (la frente, el hocico) la corta la máscara.
  const facciones =
    nube(-11, -108, 12, 17, B.ocre, 'm', 0.95) +
    nube(-13, -96, 10, 7, B.ocre, 's', 0.9) +
    nube(-12, -121, 10, 5, B.ocre, 's', 0.85) +
    // La luz de arriba a la izquierda: la frente, el ceño, el pómulo y el hocico; el otro lado se hunde.
    nube(-14, -122, 9, 4.5, B.barro, 'm', 0.9) +
    nube(-21, -102, 4.5, 7, B.barro, 'm', 0.75) +
    nube(-13, -96, 8, 5, B.barro, 'm', 0.8) +
    nube(-16, -97.5, 2.6, 1.8, B.luz, 's', 0.6) +
    nube(1, -106, 5, 15, B.hondo, 'm', 0.85) +
    // La frente arrugada del busto: dos surcos y su filo.
    [0, 1].map((i) => {
      const d = `M${f(-21 + i)} ${f(-120.5 - i * 2.8)} Q-11 ${f(-123.5 - i * 2.8)} ${f(-1 - i)} ${f(-121 - i * 2.6)}`;
      return trazo(d, B.hondo, 0.85, 0.65) + `<g transform="translate(-0.3 -0.8)">${trazo(d, B.luz, 0.55, 0.3)}</g>`;
    }).join('') +
    // El ceño: el hueso que sobresale arriba de los ojos y los deja en la sombra.
    nube(-10, -116, 12, 2.2, B.luz, 's', 0.55) +
    ojo(O1) +
    ojo(O2) +
    // La nariz chata, con el puente prendido entre los ojos, y las dos ventanas.
    nube(-8.8, -108, 1.4, 3.6, B.barro, 's', 0.6) +
    nube(-10, -102, 1.4, 0.95, B.cuenca, 'xs', 0.95) +
    nube(-6.2, -102.3, 1.3, 0.95, B.cuenca, 'xs', 0.95) +
    // La boca cerrada, larga, con el labio de arriba que sobresale, y los pliegues que bajan de la nariz.
    trazo('M-20 -95 Q-11 -92.8 -2.8 -95', B.cuenca, 1.3, 0.9) +
    trazo('M-18.5 -96.2 Q-11 -94.4 -4 -96.2', B.luz, 0.5, 0.35) +
    nube(-10, -89.5, 6.5, 2.4, B.hondo, 's', 0.7) +
    trazo('M-16 -101 Q-19 -98 -19.5 -95.5', B.hondo, 0.75, 0.6) +
    trazo('M-3.5 -101.5 Q-1.5 -98.5 -2.5 -96', B.hondo, 0.75, 0.5);
  return conGrano(orejaD + enmascarado('m-monito-cabeza', [craneo, cara], forma(craneo, B.hondo) + forma(cara, B.hondo) + pelo + facciones));
}

/**
 * La mueca del busto: los dientes pelados, arriba, cuando te mira desde lo alto con el culo al aire.
 * Es tinta de la página (`bt-monito-boca`, `bt-monito-dientes`): en el teléfono son tres píxeles, y la
 * isla la prende y la apaga.
 */
function mueca(): string {
  const [bx, by] = MONITO_ARMADO.boca;
  const boca = `M${f(bx - 8.5)} ${f(by - 0.6)} Q${f(bx)} ${f(by - 3.4)} ${f(bx + 8)} ${f(by - 0.9)} Q${f(bx + 4.6)} ${f(by + 4.6)} ${f(bx)} ${f(by + 5)} Q${f(bx - 4.8)} ${f(by + 4.6)} ${f(bx - 8.5)} ${f(by - 0.6)} Z`;
  // Los dientes del busto: desparejos, uno más largo, con lo negro entre ellos.
  const dientes = [[-5.6, 0.1, 1.1, 1.4], [-3.2, -0.3, 1.15, 1.8], [-0.8, -0.6, 1.2, 1.9], [1.7, -0.5, 1.1, 1.7], [4, 0, 1, 1.3], [-2.2, 3, 1, 1], [0.4, 3.2, 1, 1]]
    .map(([dx, dy, rx, ry]) => elipse(bx + dx!, by + dy!, rx!, ry!)).join(' ');
  return `<path d="${boca}" class="bt-monito-boca"/><path d="${dientes}" class="bt-monito-dientes"/>`;
}

/**
 * La sombra que el monito tira en el mármol: el lomo y la cabeza, soplados, corridos para abajo a la
 * derecha porque la luz viene de arriba a la izquierda. Va debajo de todo, y lo pega al tronco.
 */
function sombra(): string {
  const corre = (pts: readonly P[]): P[] => pts.map(([x, y]) => [x + 9, y + 6] as const);
  return (
    soplo(curva(corre(LOMO)), B.negro, 'm', 0.5) +
    nube(1 + 9, -110 + 6, 18, 17, B.negro, 'm', 0.45)
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

/**
 * La densidad la pide la ficha: el retrato se ve a unos 1,5 px de pantalla por unidad del títere, y en
 * un teléfono de pantalla triple eso son 4,4 píxeles. En la escena sobra.
 */
const D = 4.4;
/**
 * La calidad del webp: el picado del barro (`grano`) es un ruido fino que a la calidad de siempre se
 * lava, y el monito queda de goma. Más arriba se conserva.
 */
const Q = 95;

export const PIEZAS_MONITO: readonly Pieza[] = [
  { nombre: 'monito-muslo-1', caja: [C1[0] - 12, C1[1] - 12, 24, L.muslo + 18], dibujo: muslo(C1, 1), densidad: D, calidad: Q },
  { nombre: 'monito-muslo-2', caja: [C2[0] - 12, C2[1] - 12, 24, L.muslo + 18], dibujo: muslo(C2, 2), densidad: D, calidad: Q },
  // La pierna y el antebrazo llevan el pie y la mano doblados hacia el eje: la caja se abre para ese lado.
  { nombre: 'monito-pierna-1', caja: [C1[0] - 13, C1[1] + L.muslo - 9, 31, L.pata + 26], dibujo: pierna(C1, 1), densidad: D, calidad: Q },
  { nombre: 'monito-pierna-2', caja: [C2[0] - 18, C2[1] + L.muslo - 9, 31, L.pata + 26], dibujo: pierna(C2, 2), densidad: D, calidad: Q },
  { nombre: 'monito-brazo-1', caja: [H1[0] - 10, H1[1] - L.brazo - 10, 20, L.brazo + 20], dibujo: brazo(H1, 1), densidad: D, calidad: Q },
  { nombre: 'monito-brazo-2', caja: [H2[0] - 10, H2[1] - L.brazo - 10, 20, L.brazo + 20], dibujo: brazo(H2, 2), densidad: D, calidad: Q },
  { nombre: 'monito-antebrazo-1', caja: [H1[0] - 11, H1[1] - L.brazo - L.antebrazo - 15, 30, L.antebrazo + 24], dibujo: antebrazo(H1, 1), densidad: D, calidad: Q },
  { nombre: 'monito-antebrazo-2', caja: [H2[0] - 19, H2[1] - L.brazo - L.antebrazo - 15, 30, L.antebrazo + 24], dibujo: antebrazo(H2, 2), densidad: D, calidad: Q },
  { nombre: 'monito-culo', caja: [-22, 2, 44, 28], dibujo: culo(), densidad: D, calidad: Q },
  { nombre: 'monito-lomo', caja: [-38, -100, 76, 116], dibujo: lomo(), densidad: D, calidad: Q },
  { nombre: 'monito-cola', caja: cajaDe(EJE_COLA, 7), dibujo: cola(), densidad: D, calidad: Q },
  { nombre: 'monito-rulo', caja: cajaDe(ejeDelRulo(), 6), dibujo: rulo(), densidad: D, calidad: Q },
  { nombre: 'monito-cabeza', caja: [-29, -133, 56, 50], dibujo: cabeza(), densidad: D * 1.3, calidad: Q },
  { nombre: 'monito-sombra', caja: [-40, -140, 96, 172], dibujo: sombra(), densidad: 0.8 },
];

const img = imagenesDe(PIEZAS_MONITO);
const parte = (nombre: string, cuerpo: string, transform = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}>${cuerpo}</g>`;

/** Los ojos de la página: la pupila que mira y el párpado que baja. Van adentro de la cabeza. */
function ojos(t: Readonly<Record<string, string>>): string {
  return MONITO_ARMADO.ojos
    .map(({ centro: [cx, cy], radio: [rx, ry] }, i) => {
      const n = i + 1;
      const [px, py] = PIVOTES_PARPADO[i]!;
      return (
        `<g data-parte="pupila-${n}" transform="${t[`pupila-${n}`]}">` +
        `<circle cx="${cx}" cy="${cy}" r="${f(ry * 0.9)}" class="bt-monito-iris"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${f(ry * 0.46)}" class="bt-monito-pupila"/>` +
        `<circle cx="${f(cx - ry * 0.32)}" cy="${f(cy - ry * 0.34)}" r="${f(ry * 0.2)}" class="bt-monito-brillo"/></g>` +
        `<ellipse data-parte="parpado-${n}" data-pivote="${px} ${py}" cx="${cx}" cy="${f(cy - 0.2)}" rx="${f(rx + 1)}" ry="${f(ry + 0.8)}" class="bt-monito-parpado" transform="${t[`parpado-${n}`]}"/>`
      );
    })
    .join('');
}

/** El monito armado con las transformaciones de una pose (`transformes`, `rig-monito.ts`). */
function armado(t: Readonly<Record<string, string>>): string {
  const miembro = (arriba: string, abajo: string, pArriba: string, pAbajo: string): string =>
    parte(arriba, img(pArriba) + parte(abajo, img(pAbajo), t[abajo]), t[arriba]);
  return (
    img('monito-sombra') +
    miembro('pata-1', 'pie-1', 'monito-muslo-1', 'monito-pierna-1') +
    miembro('pata-2', 'pie-2', 'monito-muslo-2', 'monito-pierna-2') +
    miembro('brazo-1', 'mano-1', 'monito-brazo-1', 'monito-antebrazo-1') +
    miembro('brazo-2', 'mano-2', 'monito-brazo-2', 'monito-antebrazo-2') +
    parte('culo', img('monito-culo'), t.culo) +
    // La cola va entre el culo y el lomo: tapa el culo, y nace debajo del pelo de la espalda. Encima
    // del lomo, al levantarla para trepar, su raíz quedaba como un cabo suelto pegado a la espalda.
    parte('cola', img('monito-cola') + parte('rulo', img('monito-rulo'), t.rulo), t.cola) +
    img('monito-lomo') +
    parte('cabeza', img('monito-cabeza') + ojos(t) + `<g data-parte="mueca" opacity="${t.mueca}">${mueca()}</g>`, t.cabeza)
  );
}

/** El monito en cualquier punto de la trepada, sin lo que lo hace tocable: para el test y para mirarlo. */
export function monitoEn(subido: number, gesto: Gesto | 'vos' | 'abajo' = 'vos'): string {
  const t = transformes(pose(subido), gesto);
  return `<g transform="${t.entero}">${armado(t)}</g>`;
}

/** El títere que se toca, en la pose quieta: a media altura, tapado, mirándote de reojo. */
function titere(nombres: ReadonlyMap<string, string>): string {
  const t = transformes(pose(0), 'vos');
  return (
    `<g class="titere titere--monito" data-id="el-monito-que-trepa" role="button" tabindex="0" aria-label="${nombres.get('el-monito-que-trepa') ?? 'El monito que trepa'}">` +
    `<g data-parte="entero" transform="${t.entero}">${armado(t)}</g>` +
    `</g>`
  );
}

/**
 * El retrato de la ficha: arriba de todo, con el culo al aire, mirándote por arriba del hombro y
 * pelando los dientes. Va sobre su pedazo de tronco, que es el del árbol (las dos capas del recinto,
 * que la página ya cargó), así no queda abrazado al aire.
 */
export const RETRATO = { caja: [M.x - 46, ARRIBA - 80, 92, 118] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('arbol-lejos') + fondo('arbol-piso') + monitoEn(TRAMO, 'abajo');
}

export const MONITO: Personaje = {
  id: 'el-monito-que-trepa',
  region: 'el-arbol',
  ancla: M.x,
  piezas: PIEZAS_MONITO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
