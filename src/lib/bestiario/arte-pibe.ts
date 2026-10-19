/**
 * El pibe de los astilleros (`D-73`, decimoquinta vuelta), arriba de la pila de containers.
 *
 * *"El pibe de los astilleros nunca se rendía / Rapiñaba montado a los containers"* es de *La mosca y
 * la sopa* (1991). El pibe no está en ninguna tapa como personaje, pero la contratapa de ese disco
 * tiene a uno: un collage de fotos recortadas donde un chico de buzo rojo grita con una caja de cartón
 * en la cabeza. **El pibe está recortado de esa contratapa**: cada pieza es una foto pegada, con el
 * modelado blando de la foto adentro, el grano de la imprenta y el canto de papel rasgado que asoma
 * donde el papel se rompió (y no donde se cortó con tijera ni donde lo tapa otra pieza). Ese canto es
 * lo que lo despega de los containers de noche, sin contorno. Las tintas se midieron en la contratapa
 * (`--bestia-pibe-*`), y la strato es el rojo del frente del disco.
 *
 * La noche es la de los astilleros (*Cordero atado*, disco 2): la luz de sodio del farol le pega desde
 * la derecha y un poco de abajo, porque el farol está más bajo que la pila; del lado de la izquierda le
 * queda el frío de la tiza.
 *
 * Coordenadas del títere: el (0, 0) es la cadera, arriba es negativo (`PIBE_ARMADO`).
 */

import { forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { azar } from './pincel.ts';
import {
  ALZADA, CAJA, LUGAR, PIBE_ARMADO, PIVOTES_PARPADO, PUCHO, QUIETA, alRecinto, caderaEn, marcas,
  type Momento, type Punto,
} from './rig-pibe.ts';

type P = Punto;
const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** Las tintas de la contratapa (`tokens.css`), y las de la noche de los astilleros. */
const C = {
  buzo: 'var(--bestia-pibe-buzo)',
  buzoLuz: 'var(--bestia-pibe-buzo-luz)',
  buzoHondo: 'var(--bestia-pibe-buzo-hondo)',
  piel: 'var(--bestia-pibe-piel)',
  pielLuz: 'var(--bestia-pibe-piel-luz)',
  pielHonda: 'var(--bestia-pibe-piel-honda)',
  pelo: 'var(--bestia-pibe-pelo)',
  carton: 'var(--bestia-pibe-carton)',
  cartonHondo: 'var(--bestia-pibe-carton-hondo)',
  papel: 'var(--bestia-pibe-papel)',
  grafa: 'var(--bestia-pibe-grafa)',
  strato: 'var(--bestia-pibe-strato)',
  sodio: 'var(--disco-cordero-atado-tinta)',
  tiza: 'var(--entorno-astillero-tiza)',
  tizaClara: 'var(--entorno-astillero-tiza-clara)',
  noche: 'var(--entorno-astillero-noche)',
  negro: 'var(--fondo)',
  blanco: 'var(--bestia-ojo-blanco)',
};

/* ------------------------------------------------------------------
   Herramientas: la curva, la máscara, el tubo y el recorte con su canto
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

/** La misma curva, muestreada en puntos cada `paso`: para rasgar su canto. */
function muestrear(pts: readonly P[], paso = 1.4): P[] {
  const n = pts.length;
  const en = (i: number): P => pts[(i + n) % n]!;
  const salida: P[] = [];
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [en(i - 1), en(i), en(i + 1), en(i + 2)];
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    const largo = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const k = Math.max(2, Math.round(largo / paso));
    for (let j = 0; j < k; j++) {
      const t = j / k;
      const u = 1 - t;
      salida.push([
        u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0],
        u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1],
      ]);
    }
  }
  return salida;
}

const poli = (ps: readonly P[]): string => `M${ps.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;

/**
 * El grano de la foto impresa de la contratapa: más grueso y más sucio que el del aerógrafo, con
 * puntos que tiran al sepia. Va adentro de cada pieza que lo usa, porque el aerógrafo no lo trae.
 */
const filtroFoto = (): string =>
  `<defs><filter id="foto-pibe" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">` +
  `<feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="23" result="ruido"/>` +
  `<feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0.6  0 0 0 0 0.55  0 0 0 0 0.52  1.9 0 0 0 -0.66" result="puntos"/>` +
  `<feComposite in="puntos" in2="SourceGraphic" operator="in" result="adentro"/>` +
  `<feBlend in="SourceGraphic" in2="adentro" mode="multiply"/></filter></defs>`;
const conGrano = (s: string): string => `${filtroFoto()}<g filter="url(#foto-pibe)">${s}</g>`;
const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;
const caja = (x: number, y: number, w: number, h: number): string => `M${f(x)} ${f(y)} h${f(w)} v${f(h)} h${f(-w)} Z`;

/** La máscara: todo lo de adentro se sopla libre, pero no se sale de la silueta. */
function enmascarado(id: string, silueta: string, adentro: string): string {
  return `<clipPath id="${id}"><path d="${silueta}"/></clipPath><g clip-path="url(#${id})">${adentro}</g>`;
}

/**
 * El recorte pegado, que es el gesto del collage de la contratapa: la foto adentro de la silueta, y
 * afuera el canto de papel rasgado. El canto asoma más o menos según `rasgado` (de 0 a 1 en cada punto
 * de la silueta): nada donde va una bisagra y la tapa otra pieza, poco donde se cortó con tijera, y
 * desparejo donde se rompió. El papel toma la luz de la noche: frío de la tiza del lado de la
 * izquierda, el sodio del farol del lado de la derecha.
 */
function recorte(id: string, silueta: readonly P[], foto: string, rasgado: (p: P) => number, semilla: number, ancho = 1.5): string {
  const borde = muestrear(silueta);
  const cx = borde.reduce((s, p) => s + p[0], 0) / borde.length;
  const cy = borde.reduce((s, p) => s + p[1], 0) / borde.length;
  const rnd = azar(semilla);
  let racha = 1;
  const afuera: P[] = borde.map((p, i) => {
    const a = borde[(i + borde.length - 1) % borde.length]!;
    const b = borde[(i + 1) % borde.length]!;
    let [nx, ny] = [b[1] - a[1], a[0] - b[0]];
    const l = Math.hypot(nx, ny) || 1;
    [nx, ny] = [nx / l, ny / l];
    if (nx * (p[0] - cx) + ny * (p[1] - cy) < 0) [nx, ny] = [-nx, -ny];
    // El papel se rompe a rachas: un tramo ancho, un tramo cortado con tijera, que no asoma.
    if (rnd() < 0.1) racha = rnd() < 0.35 ? 0 : 0.3 + rnd() * 1.2;
    const w = rasgado(p) * ancho * racha * (0.55 + rnd() * 0.7);
    return [p[0] + nx * w, p[1] + ny * w];
  });
  const papel = poli(afuera);
  const d = curva(silueta);
  const xs = borde.map((p) => p[0]);
  const ys = borde.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const [w, h] = [x1 - x0, y1 - y0];
  return (
    enmascarado(`${id}-papel`, papel,
      forma(papel, C.papel) +
      // La foto vieja amarillea y se ensucia en el canto; la luz de cada lado lo tiñe.
      nube(x0, (y0 + y1) / 2, w * 0.55, h * 0.8, C.tiza, 'm', 0.55) +
      nube(x1, (y0 + y1) / 2 + h * 0.1, w * 0.5, h * 0.8, C.sodio, 'm', 0.5) +
      nube((x0 + x1) / 2, y0, w * 0.6, h * 0.2, C.noche, 'm', 0.35)) +
    enmascarado(id, d, foto)
  );
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

/** El contorno de un tubo que se afina (una manga, una pierna): los puntos, de una punta a la otra. */
function tubo(eje: readonly P[], anchos: readonly number[], pasos = 10): P[] {
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
  const puntaA: P = [a.p[0] - a.dir[0] * ancho(0) * 0.35, a.p[1] - a.dir[1] * ancho(0) * 0.35];
  const puntaB: P = [b.p[0] + b.dir[0] * ancho(1) * 0.35, b.p[1] + b.dir[1] * ancho(1) * 0.35];
  return [puntaA, ...izq, puntaB, ...der.reverse()];
}

/** El rasgado que se apaga cerca de una bisagra: `lejos` es cuánto antes de llegar ya no asoma. */
const lejosDe = (bisagras: readonly P[], lejos: number) => (p: P): number =>
  Math.min(1, ...bisagras.map((b) => Math.max(0, Math.hypot(p[0] - b[0], p[1] - b[1]) - lejos * 0.4) / lejos));

/* ------------------------------------------------------------------
   El buzo: el torso, con la capucha, el canguro, el escudo y la correa
   ------------------------------------------------------------------ */

const A = PIBE_ARMADO;

/** La silueta del buzo, de la capucha al ruedo, sin las mangas (que van en los brazos). */
export const BUZO: readonly P[] = [
  [-6.5, -46.6], [-12, -45.4], [-17, -43], [-20, -38.4], [-20.6, -31], [-19.2, -22], [-17.8, -12], [-17.2, -2], [-17.6, 5], [-15.2, 8.2],
  [-6, 9.2], [0, 9.4], [6, 9.2], [15.2, 8.2], [17.6, 5], [17.2, -2], [17.8, -12], [19.2, -22], [20.6, -31], [20, -38.4], [17, -43], [12, -45.4],
  [6.5, -46.6], [2.6, -44.6], [-2.6, -44.6],
];

function torso(): string {
  const rnd = azar(501);
  // El cuello, de piel, y la capucha bajada que lo rodea por atrás.
  const capucha: P[] = [[-11.5, -44.6], [-10.6, -49.4], [-5, -52.8], [3, -53.4], [10.4, -51], [13.2, -46.4], [12, -44]];
  const cuello: P[] = [[-4.6, -52.6], [6.4, -52.8], [6.8, -45.6], [1.2, -43.8], [-4.4, -45.4]];
  const dCapucha = curva(capucha);
  const dCuello = curva(cuello);
  const atras =
    enmascarado('p-pibe-capucha', dCapucha,
      forma(dCapucha, C.buzoHondo) + nube(9, -48, 5, 4, C.buzo, 's', 0.9) + nube(11, -47, 2.4, 3, C.sodio, 's', 0.45) +
      nube(-8, -48, 4, 3.4, C.noche, 's', 0.5) + trazo('M-8 -48.6 Q0 -53 9 -49.6', C.buzoHondo, 1, 0.7)) +
    enmascarado('p-pibe-cuello', dCuello,
      forma(dCuello, C.piel) + nube(5.4, -49, 2.6, 4.4, C.pielLuz, 's', 0.85) + nube(-3, -49, 2.8, 4, C.pielHonda, 's', 0.9) +
      nube(1, -52.4, 6, 1.6, C.pielHonda, 's', 0.9));
  // Los pliegues del buzo, como en la foto: un surco hondo y, del lado del farol, el lomo que agarra la luz.
  const pliegue = (x: number, y: number, l: number, giro: number, o = 0.75, ancho = 1.3): string =>
    nube(x, y, ancho, l, C.buzoHondo, 'xs', o, giro) + nube(x - 0.4, y, ancho * 0.5, l * 0.7, C.negro, 'xs', o * 0.35, giro) +
    nube(x + ancho * 1.5, y - 0.3, ancho * 0.8, l * 0.75, C.buzoLuz, 's', o * 0.75, giro);
  let costilla = '';
  for (let x = -16; x <= 16; x += 1.6) costilla += trazo(`M${f(x)} ${f(5.4 + Math.abs(x) * 0.04)} L${f(x)} ${f(8.8 - Math.abs(x) * 0.02)}`, C.buzoHondo, 0.5, 0.35 + rnd() * 0.2);
  // La trama del tejido y lo desparejo de la foto: manchas de más y de menos.
  let manchas = '';
  for (let i = 0; i < 26; i++) {
    const [x, y] = [-18 + rnd() * 36, -44 + rnd() * 50];
    manchas += nube(x, y, 1.5 + rnd() * 3, 1.5 + rnd() * 4, x > 4 ? C.buzoLuz : C.buzoHondo, 's', 0.15 + rnd() * 0.25);
  }
  const canguro = `M-9.6 -15 L9.6 -15 L12.2 1.6 L-12.2 1.6 Z`;
  const foto =
    forma(curva(BUZO), C.buzo) +
    manchas +
    // La luz: el sodio desde la derecha, el frío de la tiza en la izquierda, y el pecho que se hunde.
    nube(14, -20, 6, 28, C.buzoLuz, 'm', 1) +
    nube(18.6, -18, 2.4, 24, C.sodio, 's', 0.5) +
    nube(-13.4, -18, 8, 30, C.buzoHondo, 'm', 0.95) +
    nube(-18, -20, 3, 26, C.negro, 's', 0.4) +
    nube(-19.8, -26, 1, 12, C.tizaClara, 's', 0.32) +
    nube(-7, -41.4, 8, 2, C.tizaClara, 's', 0.2) +
    // La sombra de la pera en el pecho, y la panza que se hunde entre los pliegues.
    nube(1, -40.6, 8, 3.4, C.buzoHondo, 's', 0.85) +
    nube(-2, -26, 10, 8, C.buzoHondo, 'l', 0.35) +
    pliegue(-12, -28, 8, 32, 0.85, 1.5) + pliegue(-8.6, -22, 6, 24, 0.7) + pliegue(10.4, -29, 7, -30, 0.7) +
    pliegue(-3, -19.4, 4.6, 10, 0.55, 1) + pliegue(5.4, -21, 4.4, -18, 0.5, 1) + pliegue(-14, -6, 5, -8, 0.6) + pliegue(14.4, -6, 4.6, 10, 0.45) +
    // El canguro: la costura de arriba, las bocas al costado, y el bulto de lo que tiene adentro.
    enmascarado('p-pibe-canguro', canguro,
      nube(0, -6, 11, 8, C.buzoHondo, 'm', 0.3) + nube(7, -6, 4, 6, C.buzoLuz, 'm', 0.6) + nube(-2, -4, 5, 4, C.buzoHondo, 's', 0.35)) +
    trazo('M-9.6 -15 L9.6 -15', C.buzoHondo, 0.9, 0.75) + trazo('M-9.4 -14.2 L9.4 -14.2', C.buzoLuz, 0.5, 0.5) +
    trazo('M-9.6 -15 Q-12.6 -7 -12.2 1.6', C.buzoHondo, 1.4, 0.8) + trazo('M9.6 -15 Q12.6 -7 12.2 1.6', C.buzoHondo, 1.3, 0.65) +
    nube(11.4, -6, 1, 7, C.sodio, 's', 0.3) +
    // El ruedo acanalado, más oscuro, que se le arruga en la cadera.
    nube(0, 7, 18, 2.6, C.buzoHondo, 's', 0.55) + costilla +
    // El escudo cosido en el pecho, como el de la contratapa: redondo, de papel, con una raya roja.
    forma(elipse(7.6, -31.4, 2.7, 2.7), C.papel) + forma(`M5.6 -33 L9.6 -29.8 L9 -29.2 L5 -32.4 Z`, C.buzoHondo, 0.8) +
    nube(6.4, -32.6, 1.4, 1.2, C.tizaClara, 'xs', 0.35) + nube(9.2, -30.4, 1.6, 1.6, C.sodio, 'xs', 0.35) +
    // El cuello acanalado.
    trazo('M-6.4 -46.4 Q0 -43 6.4 -46.4', C.buzoHondo, 1.6, 0.85) + trazo('M-6 -45.4 Q0 -42.2 6 -45.4', C.buzoLuz, 0.6, 0.5) +
    // La correa de la strato: le cruza el pecho del hombro derecho a la cadera izquierda.
    // La correa hunde el buzo: el pliegue de cada lado, y la sombra que tira para la izquierda.
    nube(-1.4, -21, 1.6, 26, C.buzoHondo, 's', 0.7, 35) +
    forma('M15.4 -44.4 L18.2 -42 L-12 2.2 L-14.8 0 Z', C.grafa) +
    nube(2, -21, 1.2, 24, C.negro, 'xs', 0.5, 35) +
    trazo('M17.9 -41.8 L-12.2 2', C.sodio, 0.55, 0.6) + trazo('M15.6 -44 L-14.6 0.2', C.tizaClara, 0.35, 0.25) +
    trazo('M16.6 -42.6 L-13.4 1', C.papel, 0.25, 0.3) +
    forma(caja(-4.6, -18.6, 3.4, 2.8), C.tizaClara, 0.5) + trazo('M-4 -17.6 L-1.8 -17.6', C.negro, 0.4, 0.6);
  return conGrano(atras + recorte('p-pibe-buzo', BUZO, foto, lejosDe([A.hombros[0], A.hombros[1], [0, -46]], 9), 503));
}

/* ------------------------------------------------------------------
   Los brazos: la manga en dos tramos, y la mano
   ------------------------------------------------------------------ */

const L = A.largos;

/** Una manga del buzo, colgando: la luz del lado de la derecha, los pliegues donde se dobla. */
function manga(silueta: readonly P[], arriba: number, abajo: number, x: number, n: 1 | 2, id: string, bisagras: readonly P[], semilla: number): string {
  const medio = (arriba + abajo) / 2;
  const largo = abajo - arriba;
  const k = n === 2 ? 1 : 0.6;
  const rnd = azar(semilla + 100);
  // Las arrugas de la manga, cruzadas, más juntas cerca de donde se dobla.
  let arrugas = '';
  for (let i = 0; i < 5; i++) {
    const y = arriba + largo * (0.2 + rnd() * 0.75);
    const g = (rnd() - 0.5) * 50;
    arrugas += nube(x - 0.5 + (rnd() - 0.5) * 2, y, 3.2, 0.55, C.buzoHondo, 'xs', 0.55 + rnd() * 0.3, g) + nube(x + 0.5, y - 0.9, 2.6, 0.45, C.buzoLuz, 'xs', 0.45 * k, g);
  }
  const foto =
    forma(curva(silueta), C.buzo) +
    nube(x + 3, medio, 2.2, largo * 0.5, C.buzoLuz, 'm', 0.9 * k + 0.1) +
    nube(x + 4.6, medio, 1, largo * 0.45, C.sodio, 's', 0.5 * k) +
    nube(x - 3.2, medio, 2.6, largo * 0.55, C.buzoHondo, 'm', 0.95) +
    nube(x - 4.4, medio, 1, largo * 0.45, C.negro, 's', 0.35) +
    nube(x - 4.9, medio, 0.6, largo * 0.35, C.tizaClara, 's', 0.28) +
    arrugas;
  return recorte(id, silueta, foto, lejosDe(bisagras, 8), semilla, 1.3);
}

/** El brazo de arriba, del hombro al codo. */
function brazo(n: 1 | 2): string {
  const [sx, sy] = A.hombros[n - 1];
  const fuera = n === 1 ? -1 : 1;
  const sil = tubo([[sx + fuera * 0.6, sy - 4.4], [sx + fuera * 0.4, sy + L.brazo * 0.5], [sx, sy + L.brazo + 3.4]], [11.4, 10.4, 9.4, 9]);
  return conGrano(manga(sil, sy - 4, sy + L.brazo + 3, sx, n, `p-pibe-brazo-${n}`, [[sx, sy - 4], [sx, sy + L.brazo + 3]], 511 + n));
}

/**
 * La mano: un puño flojo, los nudillos para adelante y el pulgar del lado de adentro. Le da la luz del
 * farol de costado; la otra mitad, en la sombra.
 */
function mano([x, y]: P, n: 1 | 2): string {
  const adentro = n === 1 ? 1 : -1;
  const puno: P[] = [[x - 3.6, y - 3.4], [x + 3.6, y - 3.4], [x + 4.2, y + 1], [x + 3.2, y + 4.6], [x, y + 5.6], [x - 3.2, y + 4.6], [x - 4.2, y + 1]];
  const pulgar = elipse(x + adentro * 3.8, y + 0.4, 1.7, 3);
  const d = curva(puno);
  const k = n === 2 ? 1 : 0.55;
  return enmascarado(`p-pibe-mano-${n}`, `${d} ${pulgar}`,
    forma(d, C.piel) + forma(pulgar, C.piel) +
    nube(x + 2.6, y, 2.2, 4.4, C.pielLuz, 's', 0.9 * k) +
    nube(x - 2.6, y + 1, 2.4, 4.4, C.pielHonda, 's', 0.85) +
    [-2, 0, 2].map((dx) => trazo(`M${f(x + dx)} ${f(y + 2.6)} L${f(x + dx * 1.1)} ${f(y + 5.2)}`, C.pielHonda, 0.6, 0.7)).join('') +
    nube(x + 1, y + 4.6, 3, 1, C.pielLuz, 'xs', 0.5 * k) +
    nube(x + adentro * 3.8, y - 1, 1, 1.8, adentro > 0 ? C.pielLuz : C.pielHonda, 'xs', 0.6));
}

/** El antebrazo: la manga hasta el puño acanalado, y la mano. */
function antebrazo(n: 1 | 2): string {
  const [sx, sy] = A.hombros[n - 1];
  const codo: P = [sx, sy + L.brazo];
  const fuera = n === 1 ? -1 : 1;
  const sil = tubo([[sx + fuera * 0.3, codo[1] - 3], [sx, codo[1] + 10], [sx, codo[1] + 20.4]], [9.6, 9, 8.2, 7.6]);
  let puno = '';
  for (let x = -3.2; x <= 3.2; x += 1.1) puno += trazo(`M${f(sx + x)} ${f(codo[1] + 17.2)} L${f(sx + x)} ${f(codo[1] + 21)}`, C.buzoHondo, 0.45, 0.5);
  return conGrano(
    mano([sx, codo[1] + L.antebrazo], n) +
    manga(sil, codo[1] - 3, codo[1] + 21, sx, n, `p-pibe-antebrazo-${n}`, [codo], 521 + n) +
    puno + nube(sx, codo[1] + 21, 4, 0.8, C.buzoHondo, 'xs', 0.55),
  );
}

/* ------------------------------------------------------------------
   Las piernas: el pantalón de grafa, las zapatillas
   ------------------------------------------------------------------ */

/** El pantalón: la luz del sodio de costado, y la rodilla gastada. */
function pantalon(silueta: readonly P[], x: number, arriba: number, abajo: number, n: 1 | 2, id: string, bisagras: readonly P[], semilla: number, extra = ''): string {
  const medio = (arriba + abajo) / 2;
  const largo = abajo - arriba;
  const k = n === 2 ? 1 : 0.65;
  const rnd = azar(semilla + 100);
  // La grafa se arruga de costado, con el filo que agarra el sodio.
  let arrugas = '';
  for (let i = 0; i < 6; i++) {
    const y = arriba + largo * (0.1 + rnd() * 0.85);
    const g = (rnd() - 0.5) * 60;
    arrugas += nube(x + (rnd() - 0.5) * 3, y, 3.6, 0.6, C.negro, 'xs', 0.4 + rnd() * 0.3, g) + nube(x + 1.4, y - 1, 2.4, 0.45, C.sodio, 'xs', 0.25 * k, g);
  }
  const foto =
    forma(curva(silueta), C.grafa) +
    nube(x + 3.4, medio, 2.6, largo * 0.5, C.sodio, 'm', 0.42 * k) +
    nube(x + 4.8, medio, 0.9, largo * 0.42, C.sodio, 's', 0.55 * k) +
    nube(x - 3.6, medio, 2.6, largo * 0.55, C.negro, 'm', 0.65) +
    nube(x - 5.2, medio, 0.7, largo * 0.4, C.tizaClara, 's', 0.3) +
    nube(x + 1, medio - largo * 0.15, 1.2, largo * 0.3, C.papel, 's', 0.08) +
    arrugas + extra;
  return recorte(id, silueta, foto, lejosDe(bisagras, 8), semilla, 1.3);
}

function muslo(n: 1 | 2): string {
  const [hx, hy] = A.caderas[n - 1];
  const sil = tubo([[hx, hy - 6], [hx, hy + L.muslo * 0.5], [hx, hy + L.muslo + 3]], [13.6, 12.8, 11.4, 10.6]);
  // La rodilla gastada: más clara en el medio, que es lo que se ve cuando se sienta de frente.
  const rodilla =
    nube(hx + 0.6, hy + L.muslo - 1.4, 4, 3.6, C.papel, 's', 0.2) + nube(hx + 3, hy + L.muslo - 1.6, 2.2, 3.2, C.sodio, 's', 0.45) +
    nube(hx, hy + L.muslo + 3.2, 5, 1.2, C.negro, 's', 0.6);
  return conGrano(pantalon(sil, hx, hy - 6, hy + L.muslo + 3, n, `p-pibe-muslo-${n}`, [[hx, hy - 6], [hx, hy + L.muslo + 3]], 531 + n, rodilla));
}

/** La zapatilla de lona, de frente: la puntera de goma, los cordones, la suela. */
function zapatilla([x, y]: P, n: 1 | 2): string {
  const fuera = n === 1 ? -1 : 1;
  // `y` es la suela; la punta mira un poco para afuera.
  const z: P[] = [[x - 5.6, y - 7.6], [x + 5.2, y - 7.8], [x + 6.6 + fuera * 0.6, y - 3], [x + 6 + fuera, y + 0.2], [x - 5.6 + fuera, y + 0.2], [x - 6.8 + fuera * 0.6, y - 3]];
  const d = curva(z);
  const k = n === 2 ? 1 : 0.6;
  return enmascarado(`p-pibe-zapa-${n}`, d,
    forma(d, C.papel) +
    nube(x + 4, y - 4, 3, 5, C.sodio, 's', 0.45 * k) +
    nube(x - 4.4, y - 4, 3.4, 5, C.tiza, 's', 0.5) +
    nube(x - 2, y - 6, 4, 2, C.noche, 's', 0.45) +
    // La lengüeta y los cordones, y la puntera de goma.
    forma(caja(x - 2.2, y - 9, 4.4, 4.4), C.papel) + nube(x, y - 7, 2.4, 2, C.noche, 's', 0.35) +
    [0, 1, 2].map((i) => trazo(`M${f(x - 2.4)} ${f(y - 7.6 + i * 1.5)} L${f(x + 2.4)} ${f(y - 7.2 + i * 1.5)}`, C.grafa, 0.55, 0.8)).join('') +
    forma(`M${f(x - 5.6 + fuera)} ${f(y - 2.6)} Q${f(x)} ${f(y - 4.4)} ${f(x + 6 + fuera)} ${f(y - 2.6)} L${f(x + 6 + fuera)} ${f(y + 0.2)} L${f(x - 5.6 + fuera)} ${f(y + 0.2)} Z`, C.tizaClara, 0.7) +
    trazo(`M${f(x - 6)} ${f(y - 0.6)} L${f(x + 6.4)} ${f(y - 0.6)}`, C.grafa, 0.8, 0.8) +
    // La mugre del puerto.
    nube(x + fuera * 3, y - 1.4, 2.4, 1.2, C.grafa, 's', 0.5));
}

function pierna(n: 1 | 2): string {
  const [hx, hy] = A.caderas[n - 1];
  const rodilla: P = [hx, hy + L.muslo];
  const suela = rodilla[1] + L.pierna;
  const sil = tubo([[hx, rodilla[1] - 3.4], [hx, rodilla[1] + 14], [hx, suela - 5]], [11.4, 10.6, 9.6, 9.6]);
  return conGrano(
    pantalon(sil, hx, rodilla[1] - 3.4, suela - 5, n, `p-pibe-pierna-${n}`, [rodilla], 541 + n) +
    // La botamanga, un poco gastada, sobre la zapatilla.
    zapatilla([hx, suela], n) +
    nube(hx, suela - 7.4, 5, 0.9, C.negro, 'xs', 0.6),
  );
}

/* ------------------------------------------------------------------
   La cabeza: de tres cuartos, mirando al muelle, con el pelo de la foto
   ------------------------------------------------------------------ */

/** La silueta de la cabeza, el pelo incluido: la nariz y la pera dan al farol. */
export const CABEZA: readonly P[] = [
  [-2.4, -76.8], [6, -76], [11.6, -72.6], [14.4, -67.4], [14.9, -63.4], [14.2, -60.8], [15.6, -57.6], [16.3, -56], [14.6, -54.9], [14, -53.4],
  [13.7, -51.6], [13.1, -49.8], [12.4, -48.2], [9.6, -46.4], [4.4, -46.4], [-1.6, -48.6], [-7.4, -52], [-10.8, -54.4], [-13.4, -59.6], [-13.6, -66.4],
  [-11.6, -72.4], [-7.6, -75.8],
];

/** El pelo: la mata de arriba y de atrás, con el flequillo desparejo sobre la frente. */
const PELO: readonly P[] = [
  [-2.4, -78], [6.6, -77.2], [12.4, -73.4], [15.4, -67.8], [14.6, -66], [12, -66.4], [10.6, -67.8], [8.6, -66.2], [5.6, -67.6], [3.4, -66.4],
  [0.4, -68], [-3, -66.6], [-6, -65.6], [-7.6, -63.4], [-8.4, -59.6], [-9.2, -55.4], [-8.6, -53], [-11.6, -54], [-14.4, -59.6], [-14.4, -67],
  [-12, -73.2], [-7.6, -77],
];

const [O1, O2] = A.ojos;

function cabeza(): string {
  const rnd = azar(551);
  const d = curva(CABEZA);
  const pelo = curva(PELO);
  const oreja = elipse(-9.8, -57.8, 2.5, 4);
  // El ojo: la cuenca honda, un blanco que apenas asoma (la pupila y el párpado son de la página), el
  // pliegue de arriba y la ojera.
  const ojo = (o: typeof O1, luz: number): string =>
    nube(o.centro[0], o.centro[1] - 0.2, o.radio[0] + 2.2, o.radio[1] + 2.2, C.pielHonda, 's', 0.95) +
    nube(o.centro[0], o.centro[1] - 0.6, o.radio[0] + 0.8, o.radio[1] + 0.6, C.pelo, 'xs', 0.35) +
    `<ellipse cx="${o.centro[0]}" cy="${o.centro[1]}" rx="${o.radio[0]}" ry="${o.radio[1]}" fill="${C.blanco}" opacity="${f(0.32 + luz * 0.22)}"/>` +
    trazo(`M${f(o.centro[0] - o.radio[0] - 0.4)} ${f(o.centro[1] - o.radio[1] * 0.2)} Q${f(o.centro[0])} ${f(o.centro[1] - o.radio[1] * 1.5)} ${f(o.centro[0] + o.radio[0] + 0.3)} ${f(o.centro[1] - o.radio[1] * 0.3)}`, C.pelo, 0.8, 0.9) +
    trazo(`M${f(o.centro[0] - o.radio[0] * 0.8)} ${f(o.centro[1] + o.radio[1] + 1)} Q${f(o.centro[0])} ${f(o.centro[1] + o.radio[1] + 1.9)} ${f(o.centro[0] + o.radio[0] * 0.9)} ${f(o.centro[1] + o.radio[1] + 0.8)}`, C.pielHonda, 0.6, 0.7) +
    nube(o.centro[0] + o.radio[0] * 0.5, o.centro[1] + o.radio[1] + 1.8, o.radio[0] * 0.7, 0.7, C.pielLuz, 'xs', 0.35 * luz);
  let poros = '';
  for (let i = 0; i < 18; i++) {
    const [x, y] = [-8 + rnd() * 21, -66 + rnd() * 18];
    poros += nube(x, y, 1 + rnd() * 1.6, 1 + rnd() * 1.6, x > 5 ? C.pielLuz : C.pielHonda, 's', 0.15 + rnd() * 0.2);
  }
  const cara =
    forma(d, C.piel) +
    poros +
    // El farol le pega desde la derecha y un poco de abajo: el pómulo, la nariz, la pera y abajo de la mandíbula.
    nube(10.8, -57.4, 4, 7, C.pielLuz, 'm', 1) +
    nube(13.6, -56, 1.4, 4.6, C.sodio, 's', 0.5) +
    nube(11, -49.2, 3, 2.4, C.pielLuz, 's', 0.9) +
    nube(7, -47.2, 5, 1.4, C.sodio, 's', 0.45) +
    // La mitad de la izquierda se hunde, con el frío de la noche en la sien.
    nube(-6.4, -57, 6, 11, C.pielHonda, 'm', 0.95) +
    nube(-8.6, -55, 3, 6, C.pelo, 's', 0.35) +
    nube(-10.6, -62, 1.6, 4, C.tizaClara, 's', 0.3) +
    nube(1.6, -55, 3.6, 6, C.pielHonda, 'm', 0.45) +
    // La frente, abajo del flequillo, en la sombra del pelo.
    nube(4, -65.4, 9, 2, C.pielHonda, 's', 0.7) +
    // La nariz: el tabique prendido, la sombra que tira para la izquierda, la ventana.
    nube(12.6, -58.6, 1, 3.4, C.pielLuz, 's', 0.9) +
    nube(13.6, -56.6, 0.9, 1, C.papel, 'xs', 0.4) +
    nube(9.4, -55.6, 2.2, 1.8, C.pielHonda, 's', 0.95) +
    nube(12.6, -55, 1, 0.6, C.pelo, 'xs', 0.7) +
    ojo(O1, 0.2) + ojo(O2, 0.8) +
    // Las cejas, bajas y espesas: el que vigila. En la foto son sombra, no raya.
    nube(-1.8, -64.9, 3.8, 1, C.pelo, 'xs', 0.95, -8) + nube(8.5, -65.1, 2.9, 0.85, C.pelo, 'xs', 0.9, 6) +
    trazo('M-5 -64.4 Q-1.6 -66 1.6 -64.8', C.pelo, 0.7, 0.55) + trazo('M6.2 -64.9 Q8.6 -65.8 10.8 -64.8', C.pelo, 0.6, 0.5) +
    // La boca cerrada, larga, con el pucho en la comisura de la derecha; el labio de abajo prendido.
    nube(6.6, -51.4, 4.4, 0.75, C.pielHonda, 'xs', 0.95, -2) +
    nube(6.8, -51.5, 3.4, 0.35, C.pelo, 'xs', 0.7, -2) +
    nube(7, -50, 3, 0.6, C.pielLuz, 'xs', 0.7) +
    nube(6.6, -48.6, 3.4, 1, C.pielHonda, 's', 0.6) +
    // La mandíbula de abajo, en la sombra, y la pelusa del bigote que recién le sale.
    nube(1, -47.6, 6, 1.6, C.pielHonda, 's', 0.7) +
    nube(8, -53, 3.4, 0.7, C.pelo, 'xs', 0.25) +
    // El pelo: la mata oscura, con mechones que agarran el sodio a la derecha y la tiza arriba.
    enmascarado('p-pibe-pelo', pelo,
      forma(pelo, C.pelo) +
      // El brillo del pelo: frío arriba, de la noche, y el sodio en la punta del flequillo.
      nube(-2, -75.4, 9, 2, C.tiza, 's', 0.4) +
      nube(-5, -74, 4, 1.2, C.tizaClara, 'xs', 0.25) +
      nube(12.4, -69.4, 2.4, 3.6, C.sodio, 's', 0.4) +
      nube(-12, -63, 2, 6, C.noche, 's', 0.55) +
      // Los mechones: salen de la coronilla y caen, desparejos, hacia la frente y la nuca.
      Array.from({ length: 70 }, () => {
        const a0 = -Math.PI * (0.05 + rnd() * 0.95);
        const r0 = 2 + rnd() * 8;
        const [x, y] = [-3 + Math.cos(a0) * r0 * 1.3, -73 + Math.sin(a0) * r0 * 0.4 + rnd() * 4];
        const a = Math.atan2(y + 73, x + 3) + (rnd() - 0.5) * 0.7 + 0.5;
        const l = 2.6 + rnd() * 4;
        const luz = x > 7 ? C.sodio : y < -74 ? C.tizaClara : C.noche;
        return trazo(`M${f(x)} ${f(y)} q${f(Math.cos(a) * l * 0.5)} ${f(Math.sin(a) * l * 0.5 + 0.5)} ${f(Math.cos(a) * l)} ${f(Math.sin(a) * l + 1)}`, luz, 0.32, luz === C.noche ? 0.4 : 0.2);
      }).join('') +
      // El volumen de la mata: más clara donde se abulta, hundida en la nuca.
      nube(3, -72, 7, 3.4, C.noche, 'm', 0.45) + nube(-10, -58, 3, 5, C.negro, 's', 0.5));
  const laOreja = enmascarado('p-pibe-oreja', oreja,
    forma(oreja, C.pielHonda) + nube(-9.4, -58.6, 1.4, 2.6, C.piel, 's', 0.7) + nube(-11.2, -57.6, 1, 3, C.tizaClara, 's', 0.25) + trazo('M-9 -60.4 Q-8 -58 -9.2 -55.6', C.pielHonda, 0.6, 0.8));
  return conGrano(recorte('p-pibe-cabeza', CABEZA, cara, lejosDe([[3, -46.6]], 6), 553, 1.7) + laOreja);
}

/**
 * La luz de la brasa en la cara, cuando le da una pitada: le prende la pera, la boca y la nariz desde
 * abajo. Es luz: la página la suma a lo de abajo (`bt-pibe-resplandor`), y la isla la prende.
 */
function resplandor(): string {
  return nube(10.4, -50.4, 6, 4.4, C.sodio, 'm', 0.75) + nube(10.8, -50.6, 2.6, 2, C.sodio, 's', 0.9) + nube(12, -56, 2.6, 2.6, C.sodio, 's', 0.35);
}

/* ------------------------------------------------------------------
   La strato roja, colgada a la espalda: se ve de atrás
   ------------------------------------------------------------------ */

/** Dónde está la guitarra: el medio del cuerpo, y para dónde va el mástil (grados). */
export const STRATO = { centro: [-5, -13] as P, giro: -54 } as const;

/**
 * La strato vista de atrás: el cuerpo de doble cuerno, el mástil de arce con la raya de nogal, la
 * placa de los cuatro tornillos, la tapa del trémolo y el clavijero con las seis clavijas. Se dibuja
 * a lo largo del eje `x` (el cuerpo en el 0, el clavijero en la punta) y se gira a su lugar.
 */
function guitarra(): string {
  const cuerpo: P[] = [
    [-21, 0], [-19.6, -9], [-14, -14.4], [-5, -14.6], [2, -11.4], [8, -12.2], [16, -15.4], [21, -14.2], [19, -9.6], [14, -6.4], [13, -2],
    [14.4, 4.8], [18.4, 9.8], [17.6, 13], [11, 11.8], [3, 12.6], [-6, 15.6], [-15, 14.4], [-20, 9],
  ];
  const mastil: P[] = [[16, -2.6], [60, -2.3], [60, 2.3], [16, 2.9]];
  // El clavijero de la strato, visto de atrás: el lado de las clavijas da para abajo.
  const pala: P[] = [[58.6, -2.8], [63, -3.6], [70, -3.4], [77.4, -1.2], [79.2, 2.4], [77, 5.4], [70, 6.6], [64, 6.4], [60.4, 3.4]];
  const dCuerpo = curva(cuerpo);
  const dMastil = poli(mastil);
  const dPala = curva(pala);
  const clavijas = [0, 1, 2, 3, 4, 5].map((i) => {
    const x = 62.4 + i * 2.8;
    return forma(elipse(x, 7.4, 1.1, 1.6), C.tizaClara, 0.85) + forma(elipse(x, 5.2, 0.9, 0.9), C.negro, 0.7);
  }).join('');
  const foto =
    enmascarado('p-pibe-strato-cuerpo', dCuerpo,
      forma(dCuerpo, C.strato) +
      nube(6, -10, 14, 5, C.sodio, 'm', 0.45) +
      nube(-2, 8, 18, 6, C.buzoHondo, 'l', 0.8) +
      nube(-14, -6, 6, 8, C.buzoLuz, 'm', 0.35) +
      // La tapa del trémolo, de plástico, con las seis ranuras, y la placa del mástil.
      forma(caja(-9, -5, 11, 8.6), C.papel, 0.8) + [0, 1, 2, 3, 4, 5].map((i) => trazo(`M${f(-7.6 + i * 1.6)} -3.4 L${f(-7.6 + i * 1.6)} 2`, C.negro, 0.5, 0.6)).join('') +
      forma(caja(12.6, -3.6, 5, 7.2), C.tizaClara, 0.75) + [[13.6, -2.6], [16.6, -2.6], [13.6, 2.6], [16.6, 2.6]].map(([x, y]) => forma(elipse(x!, y!, 0.45, 0.45), C.negro, 0.7)).join('') +
      // El canto del cuerpo, redondeado: la luz lo agarra en el borde de arriba.
      trazo(curva(cuerpo).replace(/ Z$/, ''), C.buzoLuz, 1.2, 0.35)) +
    enmascarado('p-pibe-strato-mastil', `${dMastil} ${dPala}`,
      forma(dMastil, C.carton) + forma(dPala, C.carton) +
      nube(38, -1.4, 22, 1.2, C.papel, 's', 0.35) +
      nube(38, 2.4, 22, 1.2, C.cartonHondo, 's', 0.7) +
      // La raya de nogal en la espalda del mástil.
      trazo('M18 0.2 L58 0', C.cartonHondo, 0.9, 0.8) +
      nube(70, 1, 9, 4, C.cartonHondo, 'm', 0.35) +
      nube(68, -2, 8, 1.4, C.sodio, 's', 0.4)) +
    clavijas;
  // El canto de papel va alrededor de todo el instrumento: es otro recorte, de una revista.
  const papel = (pts: readonly P[], semilla: number, ancho: number): string => {
    const rnd = azar(semilla);
    const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    const afuera = pts.map(([x, y]) => {
      const l = Math.hypot(x - cx, y - cy) || 1;
      const w = ancho * (0.4 + rnd() * 0.9);
      return [x + ((x - cx) / l) * w, y + ((y - cy) / l) * w] as P;
    });
    return forma(poli(afuera), C.papel, 0.9);
  };
  return conGrano(
    `<g transform="translate(${STRATO.centro[0]} ${STRATO.centro[1]}) rotate(${STRATO.giro})">` +
    papel(muestrear(cuerpo, 2), 561, 1.6) +
    papel([[15, -3.8], [60, -3.6], [60, 3.6], [15, 4]].flatMap(([x, y], i, arr) => {
      const [nx, ny] = arr[(i + 1) % arr.length]!;
      return Array.from({ length: 12 }, (_, k) => [x! + ((nx! - x!) * k) / 12, y! + ((ny! - y!) * k) / 12] as P);
    }), 563, 0.9) +
    papel(muestrear(pala, 1.5), 567, 1.2) +
    foto +
    `</g>`,
  );
}

/* ------------------------------------------------------------------
   La caja de cartón que se afanó
   ------------------------------------------------------------------ */

/** La caja, con el medio de abajo en el (0, 0): el frente y las dos solapas abiertas para los costados. */
export const CAJA_FRENTE: readonly P[] = [[-CAJA.ancho / 2, -CAJA.alto], [CAJA.ancho / 2, -CAJA.alto], [CAJA.ancho / 2 + 0.3, 0], [-CAJA.ancho / 2 - 0.3, 0]];

function cajaDeCarton(): string {
  const [a, h] = [CAJA.ancho / 2, CAJA.alto];
  const frente = poli(CAJA_FRENTE);
  const solapaI: P[] = [[-a, -h], [-a - 10, -h - 7], [-a - 8.6, -h - 10.6], [-a + 2.2, -h - 1.2]];
  const solapaD: P[] = [[a, -h], [a + 6.4, -h - 11], [a + 9.4, -h - 9], [a + 1.4, -h + 1.2]];
  // La solapa de adelante, doblada para abajo sobre el frente: se ve su lado de adentro, sin imprimir.
  const solapaF: P[] = [[-a + 0.4, -h], [a - 0.4, -h], [a - 1, -h + 8], [-a + 1.2, -h + 7.4]];
  const rnd = azar(571);
  let rayas = '';
  for (let i = 0; i < 7; i++) rayas += trazo(`M${f(-a + 1 + rnd() * 5)} ${f(-h + 9.4 + i * 1.9)} l${f(16 + rnd() * 12)} 0`, C.cartonHondo, 0.4, 0.22);
  // La flecha de "este lado arriba", impresa en el cartón.
  const flecha = (x: number): string => forma(`M${f(x)} -11.6 l2 2.8 l-1.1 0 l0 4 l-1.8 0 l0 -4 l-1.1 0 Z`, C.negro, 0.55);
  const solapa = (id: string, pts: readonly P[], adentro: string): string => enmascarado(id, poli(pts), forma(poli(pts), C.carton) + adentro);
  const foto =
    enmascarado('p-pibe-caja-frente', frente,
      forma(frente, C.carton) +
      nube(a - 3, -h / 2, 8, 16, C.sodio, 'm', 0.4) +
      nube(-a + 4, -h / 2, 9, 16, C.cartonHondo, 'm', 0.95) +
      nube(-a, -h / 2, 1.6, 14, C.tiza, 's', 0.4) +
      nube(0, -1.6, 20, 3.4, C.cartonHondo, 's', 0.6) +
      rayas + flecha(-5) + flecha(-0.6) +
      // La cinta de embalar, transparente y vieja, que alguien cortó.
      forma(caja(7, -h, 4, 12), C.papel, 0.3) + trazo(`M7 ${-h + 12} L8.8 ${-h + 10.6} L11 ${-h + 12}`, C.papel, 0.5, 0.45)) +
    solapa('p-pibe-caja-solapa-f', solapaF, nube(0, -h + 4, 16, 3, C.carton, 's', 0.5) + nube(-a + 3, -h + 4, 5, 5, C.negro, 's', 0.35) + nube(a - 3, -h + 3, 4, 4, C.sodio, 's', 0.35)) +
    trazo(`M${-a + 0.6} ${-h + 0.2} L${a - 0.6} ${-h + 0.2}`, C.carton, 0.8, 0.8) +
    solapa('p-pibe-caja-solapa-i', solapaI, nube(-a - 4, -h - 4, 5, 3, C.cartonHondo, 's', 0.8) + nube(-a - 8, -h - 9, 3, 1.4, C.tiza, 's', 0.4)) +
    solapa('p-pibe-caja-solapa-d', solapaD, nube(a + 6, -h - 6, 3, 5, C.sodio, 's', 0.6) + nube(a + 2, -h - 1, 2, 2, C.cartonHondo, 's', 0.6));
  // El canto de cartón cortado no se rasga: la caja es la caja, no un recorte.
  return conGrano(foto);
}

/* ------------------------------------------------------------------
   El humo que larga: se hace espiral de tiza, como el cielo de la contratapa de Cordero atado
   ------------------------------------------------------------------ */

/** La tiza: el trazo se corre con un ruido fino y se le comen pedazos (el mismo filtro del entorno). */
const filtroTiza = (): string =>
  `<defs><filter id="tiza-pibe" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">` +
  `<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" result="ruido"/>` +
  `<feDisplacementMap in="SourceGraphic" in2="ruido" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="corrido"/>` +
  `<feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.6 0 0 0 1.75" result="huecos"/>` +
  `<feComposite in="corrido" in2="huecos" operator="in"/></filter></defs>`;

function humo(): string {
  let d = 'M0 0 C-1.4 -3 1.6 -5 0.4 -8';
  const [cx, cy] = [0.6, -13];
  for (let i = 0; i <= 60; i++) {
    const a = Math.PI / 2 + (i / 60) * Math.PI * 2 * 1.6;
    const r = 5.6 * (1 - i / 60) + 0.4;
    d += ` L${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r * 0.9)}`;
  }
  return filtroTiza() + `<g filter="url(#tiza-pibe)">${trazo(d, C.tizaClara, 1.9, 0.95)}${trazo('M-2 -4 q-1.4 -2 0 -3.6', C.tizaClara, 1.1, 0.6)}</g>`;
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

/**
 * La densidad la pide la ficha: el retrato se ve a unos 1,4 px de pantalla por unidad del títere, y en
 * un teléfono de pantalla triple eso son más de cuatro píxeles. La calidad es alta porque el grano de
 * la foto, a la de siempre, se lava, y el recorte queda de plástico.
 */
const D = 4.4;
const Q = 92;

const [H1, H2] = A.hombros;
const [C1, C2] = A.caderas;

export const PIEZAS_PIBE: readonly Pieza[] = [
  { nombre: 'pibe-guitarra', caja: [-34, -86, 84, 100], dibujo: guitarra(), densidad: D, calidad: Q },
  { nombre: 'pibe-muslo-1', caja: [C1[0] - 10, C1[1] - 11, 20, L.muslo + 18], dibujo: muslo(1), densidad: D, calidad: Q },
  { nombre: 'pibe-muslo-2', caja: [C2[0] - 10, C2[1] - 11, 20, L.muslo + 18], dibujo: muslo(2), densidad: D, calidad: Q },
  { nombre: 'pibe-pierna-1', caja: [C1[0] - 11, C1[1] + L.muslo - 8, 22, L.pierna + 11], dibujo: pierna(1), densidad: D, calidad: Q },
  { nombre: 'pibe-pierna-2', caja: [C2[0] - 11, C2[1] + L.muslo - 8, 22, L.pierna + 11], dibujo: pierna(2), densidad: D, calidad: Q },
  { nombre: 'pibe-torso', caja: [-25, -57, 50, 70], dibujo: torso(), densidad: D, calidad: Q },
  { nombre: 'pibe-cabeza', caja: [-18, -82, 38, 40], dibujo: cabeza(), densidad: D * 1.3, calidad: Q },
  { nombre: 'pibe-resplandor', caja: [-2, -64, 26, 24], dibujo: resplandor(), densidad: 1.6 },
  { nombre: 'pibe-brazo-1', caja: [H1[0] - 9, H1[1] - 10, 18, L.brazo + 16], dibujo: brazo(1), densidad: D, calidad: Q },
  { nombre: 'pibe-brazo-2', caja: [H2[0] - 9, H2[1] - 10, 18, L.brazo + 16], dibujo: brazo(2), densidad: D, calidad: Q },
  { nombre: 'pibe-antebrazo-1', caja: [H1[0] - 9, H1[1] + L.brazo - 8, 18, L.antebrazo + 17], dibujo: antebrazo(1), densidad: D, calidad: Q },
  { nombre: 'pibe-antebrazo-2', caja: [H2[0] - 9, H2[1] + L.brazo - 8, 18, L.antebrazo + 17], dibujo: antebrazo(2), densidad: D, calidad: Q },
  { nombre: 'pibe-caja', caja: [-29, -38, 58, 39], dibujo: cajaDeCarton(), densidad: D, calidad: Q },
  { nombre: 'pibe-humo', caja: [-10, -24, 20, 27], dibujo: humo(), densidad: 3 },
];

const img = imagenesDe(PIEZAS_PIBE);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Los ojos de la página: la pupila que mira y el párpado que baja. */
function ojos(t: Readonly<Record<string, string>>): string {
  return A.ojos
    .map(({ centro: [cx, cy], radio: [rx, ry] }, i) => {
      const n = i + 1;
      const [px, py] = PIVOTES_PARPADO[i]!;
      return (
        `<g data-parte="pupila-${n}" transform="${t[`pupila-${n}`]}"><circle cx="${cx}" cy="${cy}" r="${f(ry * 0.92)}" class="bt-pibe-pupila"/></g>` +
        `<ellipse data-parte="parpado-${n}" data-pivote="${px} ${py}" cx="${cx}" cy="${f(cy - 0.1)}" rx="${f(rx + 0.6)}" ry="${f(ry + 0.6)}" class="bt-pibe-parpado" transform="${t[`parpado-${n}`]}"/>`
      );
    })
    .join('');
}

/**
 * El grito, como el del pibe de la caja de la contratapa: la boca abierta grande, con los dientes de
 * arriba. Es tinta de la página (`bt-pibe-boca`, `bt-pibe-dientes`), y la isla la prende.
 */
function grito(): string {
  const [bx, by] = A.boca;
  const boca = `M${f(bx - 3.6)} ${f(by - 0.8)} Q${f(bx + 0.4)} ${f(by - 2.6)} ${f(bx + 4.6)} ${f(by - 0.6)} Q${f(bx + 4.8)} ${f(by + 4.4)} ${f(bx + 0.6)} ${f(by + 5.4)} Q${f(bx - 3.4)} ${f(by + 4.4)} ${f(bx - 3.6)} ${f(by - 0.8)} Z`;
  const dientes = `M${f(bx - 2.6)} ${f(by - 0.8)} Q${f(bx + 0.4)} ${f(by - 2)} ${f(bx + 3.8)} ${f(by - 0.6)} L${f(bx + 3.4)} ${f(by + 0.6)} Q${f(bx + 0.4)} ${f(by - 0.4)} ${f(bx - 2.4)} ${f(by + 0.4)} Z`;
  return `<path d="${boca}" class="bt-pibe-boca"/><path d="${dientes}" class="bt-pibe-dientes"/>`;
}

/**
 * El pucho que le cuelga de la comisura: el papel, la brasa y la ceniza larga, que no se cae. Se dibuja
 * a lo largo del eje `x`, desde el labio, y la ceniza va de 0 a 10 en el suyo: la isla la estira.
 */
function pucho(t: Readonly<Record<string, string>>, o: Readonly<Record<string, string>>): string {
  return parte('pucho',
    `<path d="M0 0 L${PUCHO.largo} 0" class="bt-pibe-pucho"/>` +
    parte('ceniza', `<path d="M0 0 L10 0" class="bt-pibe-ceniza"/>`, t.ceniza) +
    `<circle data-parte="brasa" cx="${PUCHO.largo}" cy="0" r="1" class="bt-pibe-brasa" opacity="${o.brasa}"/>`,
    t.pucho);
}

/** Lo que se afanó de la caja: un pedal de guitarra, negro y con el cromo que agarra la luz. Va en la mano de la caja. */
function botin(o: Readonly<Record<string, string>>): string {
  const [sx, sy] = A.hombros[0];
  const [x, y] = [sx, sy + L.brazo + L.antebrazo + 3];
  return parte('botin',
    `<path d="M${f(x - 5)} ${f(y - 2)} L${f(x + 5)} ${f(y - 3.6)} L${f(x + 5.4)} ${f(y + 2.6)} L${f(x - 5)} ${f(y + 2.6)} Z" class="bt-pibe-botin"/>` +
    `<path d="M${f(x - 4.6)} ${f(y - 2.6)} L${f(x + 4.8)} ${f(y - 4.2)}" class="bt-pibe-cromo"/>`,
    '', o.botin);
}

/** El pibe armado con las marcas de un momento (`marcas`, `rig-pibe.ts`). */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const brazo = (n: 1 | 2, extra = ''): string =>
    parte(`brazo-${n}`, img(`pibe-brazo-${n}`) + parte(`mano-${n}`, img(`pibe-antebrazo-${n}`) + extra, t[`mano-${n}`]), t[`brazo-${n}`]);
  return (
    parte('guitarra', img('pibe-guitarra'), t.guitarra) +
    parte('pierna-1', img('pibe-pierna-1'), t['pierna-1']) +
    parte('pierna-2', img('pibe-pierna-2'), t['pierna-2']) +
    parte('muslo-1', img('pibe-muslo-1'), t['muslo-1']) +
    parte('muslo-2', img('pibe-muslo-2'), t['muslo-2']) +
    parte('torso', img('pibe-torso'), t.torso) +
    parte('cabeza',
      img('pibe-cabeza') + ojos(t) + parte('grito', grito(), '', o.grito) + pucho(t, o) +
      `<g data-parte="resplandor" class="bt-pibe-resplandor" opacity="${o.resplandor}">${img('pibe-resplandor')}</g>`,
      t.cabeza) +
    brazo(2) +
    brazo(1, botin(o)) +
    parte('caja', img('pibe-caja'), t.caja) +
    parte('humo', img('pibe-humo'), t.humo, o.humo)
  );
}

/** El pibe en cualquier momento, sin lo que lo hace tocable: para el test y para mirarlo. */
export function pibeEn(m: Momento = QUIETA): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: sentado en el canto, fumando, vigilando el muelle. */
function titere(nombres: ReadonlyMap<string, string>): string {
  const t = marcas(QUIETA).transform;
  return (
    `<g class="titere titere--pibe" data-id="el-pibe-de-los-astilleros" role="button" tabindex="0" aria-label="${nombres.get('el-pibe-de-los-astilleros') ?? 'El pibe de los astilleros'}">` +
    `<g data-parte="entero" transform="${t.entero}">${armado(QUIETA)}</g>` +
    `</g>`
  );
}

/**
 * El retrato de la ficha: parado arriba de los containers, con la caja que se afanó en alto, gritando
 * como el pibe de la contratapa. Va sobre su pedazo de pila y de noche (las capas del recinto, que la
 * página ya cargó).
 */
export const RETRATO = (() => {
  const [cx, cy] = caderaEn(1);
  const arriba = alRecinto([0, -132], [cx, cy])[1];
  const abajo = LUGAR.piso + 16;
  return { caja: [Math.round(cx - 46), Math.round(arriba), 92, Math.round(abajo - arriba)] as const };
})();
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('astillero-lejos') + fondo('astillero-piso') + pibeEn(ALZADA);
}

export const PIBE: Personaje = {
  id: 'el-pibe-de-los-astilleros',
  region: 'los-astilleros',
  ancla: LUGAR.x,
  piezas: PIEZAS_PIBE,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
