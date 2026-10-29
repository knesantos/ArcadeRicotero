/**
 * El buen psicópata (`D-73`, decimosexta vuelta), en el baldío, mirando un cuadro.
 *
 * *"La parabellum del buen psicópata"* es de *Bang! Bang! Estás liquidado* (1989), y **el psicópata
 * está sacado de su tapa**: el hombre de gorra, barba y sobretodo, pintado a guache por Rocambole, que
 * mira de espaldas un fusilamiento colgado en un museo, con un perro atado a la correa al que la
 * pistola le crece en la cabeza. Acá el museo es el baldío: el cuadro está en un caballete en el medio
 * de la tierra, con una lamparita de museo arriba, y **el cuadro es el de la tapa de verdad**
 * (`tapa:bang-bang-estas-liquidado-frontal`), recortado, sin redibujar.
 *
 * El guache de la tapa: ocres que saltan al amarillo en el lomo de cada pliegue y se hunden en un
 * marrón casi negro en el fondo, pintado a pinceladas que se ven (`pincel.ts`, cargadas, sin la
 * fotocopia de *Gulp!*). La luz le viene de la izquierda, de la lamparita del cuadro: por eso el lado
 * que mira al cuadro es el que brilla, como en la tapa. Del lado de la noche le queda el violeta del
 * baldío.
 *
 * Coordenadas del títere: el (0, 0) es el piso entre los zapatos, arriba es negativo, y mira para la
 * izquierda (`PSICOPATA_ARMADO`). El perro, en las suyas (`PERRO_ARMADO`). El cuadro, en las del
 * recinto (`CUADRO`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { azar, pincelada, tinta, type P as PP } from './pincel.ts';
import {
  CUADRO, LUGAR, PERRO_ARMADO, PSICOPATA_ARMADO, QUIETA, SALUDA, alRecinto, marcas, type Momento, type Punto,
} from './rig-psicopata.ts';

type P = Punto;
const f = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Las tintas de la tapa (`tokens.css`), y las de la noche del baldío. */
const C = {
  ocre: 'var(--bestia-psicopata-ocre)',
  luz: 'var(--bestia-psicopata-ocre-luz)',
  amarillo: 'var(--bestia-psicopata-amarillo)',
  pliegue: 'var(--bestia-psicopata-pliegue)',
  gorra: 'var(--bestia-psicopata-gorra)',
  piel: 'var(--bestia-psicopata-piel)',
  barba: 'var(--bestia-psicopata-barba)',
  puntilla: 'var(--bestia-psicopata-puntilla)',
  zorro: 'var(--bestia-psicopata-zorro)',
  acero: 'var(--bestia-psicopata-acero)',
  pared: 'var(--bestia-psicopata-pared)',
  marco: 'var(--bestia-psicopata-marco)',
  violeta: 'var(--entorno-baion-violeta)',
  lila: 'var(--entorno-baion-lila)',
  noche: 'var(--entorno-baion-noche)',
  papel: 'var(--papel)',
  negro: 'var(--fondo)',
};

const A = PSICOPATA_ARMADO;
const PA = PERRO_ARMADO;

/* ------------------------------------------------------------------
   Herramientas
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

const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;

/** El contorno de un miembro que se afina, de `a` a `b`, con su ancho en cada punta. */
function miembro(a: P, b: P, anchoA: number, anchoB: number, panza = 0): P[] {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const l = Math.hypot(dx, dy) || 1;
  const [nx, ny] = [-dy / l, dx / l];
  const medio: P = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const am = (anchoA + anchoB) / 2 + panza;
  return [
    [a[0] - (dx / l) * anchoA * 0.25, a[1] - (dy / l) * anchoA * 0.25],
    [a[0] + (nx * anchoA) / 2, a[1] + (ny * anchoA) / 2],
    [medio[0] + (nx * am) / 2, medio[1] + (ny * am) / 2],
    [b[0] + (nx * anchoB) / 2, b[1] + (ny * anchoB) / 2],
    [b[0] + (dx / l) * anchoB * 0.3, b[1] + (dy / l) * anchoB * 0.3],
    [b[0] - (nx * anchoB) / 2, b[1] - (ny * anchoB) / 2],
    [medio[0] - (nx * am) / 2, medio[1] - (ny * am) / 2],
    [a[0] - (nx * anchoA) / 2, a[1] - (ny * anchoA) / 2],
  ];
}

/**
 * La pincelada de guache: cargada, que casi no se seca, y sin la fotocopia de *Gulp!*. Es lo que hace
 * que el sobretodo se vea pintado y no soplado.
 */
const guache = (recorridos: ReadonlyArray<readonly P[]>, color: string, ancho: number, semilla: number, seco = 0.12): string =>
  tinta(recorridos.map((r, i) => pincelada(r as readonly PP[], { ancho, seco, apoyo: [0.35, 0.5], tinta: color, grano: 22 }, semilla * 29 + i * 7)).join(''), false);

/**
 * Un brochazo de guache: un trazo lleno que entra fino, se abre y sale fino, con el borde nítido y
 * apenas tembloroso. Es la pincelada de luz y de sombra de los pliegues de la tapa, que no es un
 * soplo: se ve dónde apoyó el pincel. `pts` es el recorrido (se suaviza), `ancho` el más ancho.
 */
function brochazo(pts: readonly P[], ancho: number, color: string, o = 1, semilla = 1): string {
  const rnd = azar(semilla);
  const n = 18;
  const en = (t: number): P => {
    // Una Bézier cuadrática por los tres primeros puntos, o una recta.
    const [a, b, c] = [pts[0]!, pts[Math.min(1, pts.length - 1)]!, pts[pts.length - 1]!];
    const u = 1 - t;
    return [u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]];
  };
  const izq: P[] = [];
  const der: P[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const [x, y] = en(t);
    const [x2, y2] = en(Math.min(1, t + 0.01));
    const [x1, y1] = en(Math.max(0, t - 0.01));
    const l = Math.hypot(x2 - x1, y2 - y1) || 1;
    const [nx, ny] = [-(y2 - y1) / l, (x2 - x1) / l];
    // Entra más rápido de lo que sale: el pincel se apoya y se va arrastrando.
    const w = (ancho / 2) * Math.sin(Math.PI * Math.min(1, t * 1.25 + 0.02)) ** 0.7 * (0.9 + rnd() * 0.2);
    izq.push([x + nx * w, y + ny * w]);
    der.push([x - nx * w, y - ny * w]);
  }
  const d = `M${[...izq, ...der.reverse()].map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;
  return forma(d, color, o);
}

/** El grano del papel de la tapa impresa: todo lo que se imprime lo lleva. */
const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;

/* ------------------------------------------------------------------
   Las piernas: el pantalón oscuro y los zapatos, abajo del sobretodo
   ------------------------------------------------------------------ */

function piernas(): string {
  const pierna = (arriba: P, abajo: P, id: string, k: number): string => {
    const d = curva(miembro(arriba, abajo, 22, 17, 1));
    return enmascarado(id, d,
      forma(d, C.pliegue) +
      nube(arriba[0] - 6, (arriba[1] + abajo[1]) / 2, 5, 34, C.ocre, 'm', 0.55 * k) +
      nube(arriba[0] + 7, (arriba[1] + abajo[1]) / 2, 5, 34, C.negro, 'm', 0.6) +
      guache([[[arriba[0] - 6, arriba[1] + 6], [abajo[0] - 5, abajo[1] - 6]]], C.luz, 3, 31 + Math.round(k * 10), 0.3));
  };
  const zapato = (talon: P, punta: P, id: string, k: number): string => {
    const [tx, ty] = talon;
    const [px, py] = punta;
    const d = curva([[tx + 4, ty - 15], [tx - 8, ty - 16], [px + 6, py - 11], [px - 2, py - 6], [px, py], [tx + 5, ty], [tx + 7, ty - 6]]);
    return enmascarado(id, d,
      forma(d, C.negro) +
      nube(px + 10, py - 9, 9, 3, C.luz, 's', 0.5 * k) +
      nube(px + 4, py - 7, 3, 1.4, C.amarillo, 'xs', 0.6 * k));
  };
  return conGrano(
    pierna([14, -90], [4, -14], 'm-psi-pierna-2', 0.4) +
    zapato([12, 0], [-22, 0], 'm-psi-zapato-2', 0.5) +
    pierna([-16, -90], [-26, -14], 'm-psi-pierna-1', 1) +
    zapato([-14, 0], [-50, 0], 'm-psi-zapato-1', 1) +
    nube(-12, 2, 52, 4, C.negro, 's', 0.6),
  );
}

/* ------------------------------------------------------------------
   El sobretodo: de espaldas, con el cinturón y los pliegues de la tapa
   ------------------------------------------------------------------ */

/** El sobretodo, de los hombros al ruedo, sin el brazo de este lado ni el cuello levantado. */
export const SOBRETODO: readonly P[] = [
  [-28, -300], [-6, -312], [20, -315], [44, -309], [60, -294], [66, -268], [64, -232], [58, -204], [61, -170], [65, -128],
  [70, -80], [50, -74], [28, -79], [4, -75], [-20, -80], [-44, -74], [-54, -80], [-48, -126], [-42, -170], [-38, -204],
  [-42, -240], [-42, -276],
];

/**
 * Un pliegue de paño a guache: el valle, soplado y hondo, y al lado el lomo, más fino, que agarra la
 * luz de la izquierda. `largo` es lo que mide de punta a punta, `giro` cuánto se tuerce.
 */
function pliegue(x: number, y: number, largo: number, giro: number, k = 1, ancho = 5): string {
  // El eje del pliegue, de punta a punta, girado, con una panza para el lado de la luz.
  const a = ((giro + 90) * Math.PI) / 180;
  const [dx, dy] = [Math.cos(a) * largo * 0.48, Math.sin(a) * largo * 0.48];
  const eje = (corre: number, panza = -1.4): P[] => [[x - dx + corre, y - dy], [x + corre + panza, y], [x + dx + corre, y + dy]];
  const semilla = Math.round(Math.abs(x * 7 + y * 3)) + 1;
  return (
    // Abajo, el soplo: la sombra grande del valle.
    nube(x + ancho * 0.3, y, ancho * 1.3, largo / 2, C.pliegue, 'm', 0.6 * k, giro) +
    // Encima, el guache: el fondo del valle, el lomo de luz al lado y, arriba, el amarillo.
    brochazo(eje(ancho * 0.25), ancho * 0.9, C.pliegue, 0.95 * k, semilla) +
    brochazo(eje(ancho * 0.45, -0.4).slice(0), ancho * 0.32, C.negro, 0.55 * k, semilla + 1) +
    brochazo(eje(-ancho * 0.75), ancho * 0.55, C.luz, 0.9 * k, semilla + 2) +
    (k > 0.75 ? brochazo([eje(-ancho * 0.85)[0]!, eje(-ancho * 0.85)[1]!], ancho * 0.22, C.amarillo, 0.85, semilla + 3) : '')
  );
}

function sobretodo(): string {
  const d = curva(SOBRETODO);
  const rnd = azar(611);
  // La trama del guache: manchones anchos y suaves en el sentido del paño, que se ven de cerca.
  let pano = '';
  for (let i = 0; i < 22; i++) {
    const [x, y] = [-48 + rnd() * 116, -296 + rnd() * 214];
    const l = 14 + rnd() * 24;
    const color = x < -10 ? C.luz : x > 30 ? C.pliegue : rnd() < 0.5 ? C.ocre : C.luz;
    pano += brochazo([[x, y], [x + 1, y + l / 2], [x + (x - 4) * 0.03, y + l]], 6 + rnd() * 6, color, 0.22 + rnd() * 0.2, 700 + i);
  }
  return conGrano(
    enmascarado('m-psi-sobretodo', d,
      forma(d, C.ocre) +
      // El volumen grande: la espalda redonda prendida desde la izquierda, que se apaga a la derecha.
      nube(-26, -250, 30, 70, C.luz, 'l', 0.8) +
      nube(-34, -150, 22, 70, C.luz, 'l', 0.55) +
      nube(-44, -240, 6, 50, C.amarillo, 'm', 0.4) +
      nube(46, -220, 26, 110, C.pliegue, 'l', 0.9) +
      nube(64, -170, 8, 90, C.violeta, 'm', 0.55) +
      nube(6, -296, 34, 8, C.luz, 'm', 0.6) +
      nube(6, -84, 62, 14, C.pliegue, 'm', 0.7) +
      pano +
      // Los pliegues: los de la espalda bajan de los hombros al cinturón, los de abajo se abren en
      // abanico hasta el ruedo, y el último se pierde en lo oscuro.
      pliegue(4, -258, 70, -8, 0.85, 11) + pliegue(36, -254, 66, 6, 0.7, 12) +
      pliegue(-12, -138, 108, 8, 1, 13) + pliegue(18, -140, 114, -2, 0.9, 12) + pliegue(46, -134, 104, -10, 0.75, 13) + pliegue(-36, -128, 92, 14, 0.85, 10) +
      // El cinturón del sobretodo, flojo en la espalda, con la hebilla que cuelga de costado.
      forma('M-40 -210 Q10 -199 58 -212 L58 -194 Q10 -182 -40 -194 Z', C.ocre) +
      nube(-20, -204, 20, 5, C.luz, 's', 0.8) +
      nube(40, -200, 20, 6, C.pliegue, 's', 0.8) +
      nube(10, -188, 50, 3, C.negro, 's', 0.55) +
      guache([[[-38, -206], [10, -197], [56, -208]]], C.amarillo, 1.6, 721, 0.3) +
      forma('M-28 -209 L-16 -210 L-15 -191 L-27 -190 Z', C.pliegue, 0.95) +
      trazo('M-26 -207 L-17 -207.6 L-16.6 -193 L-25.6 -192.4 Z', C.amarillo, 1.2, 0.85) +
      // La abertura de atrás, abajo, que se abre con el paso.
      trazo('M26 -176 Q28 -130 30 -78', C.negro, 2.6, 0.75) + trazo('M24 -176 Q26 -130 27 -78', C.luz, 1.2, 0.5) +
      // El filo del hombro, de donde le pega la lamparita.
      guache([[[-22, -300], [0, -310], [22, -312]]], C.amarillo, 2.2, 731, 0.25)),
  );
}

/** El cuello levantado, que le tapa la quijada como en la tapa: el filo de arriba salta al amarillo. */
function solapa(): string {
  const d = curva([[-24, -306], [-28, -324], [-20, -336], [-2, -330], [16, -338], [34, -334], [42, -318], [36, -302], [12, -304], [-8, -300]]);
  return conGrano(
    enmascarado('m-psi-solapa', d,
      forma(d, C.ocre) +
      nube(-14, -318, 12, 10, C.luz, 'm', 0.85) +
      nube(30, -318, 10, 12, C.pliegue, 'm', 0.9) +
      guache([[[-24, -322], [-10, -332], [6, -328], [24, -336], [38, -330]]], C.amarillo, 2.6, 731, 0.15) +
      guache([[[-20, -308], [0, -312], [20, -314], [38, -310]]], C.pliegue, 4, 733, 0.2) +
      nube(40, -316, 3, 10, C.violeta, 's', 0.6)),
  );
}

/* ------------------------------------------------------------------
   El brazo de este lado: la manga con costillas, el puño de puntilla y la mano
   ------------------------------------------------------------------ */

const [HX, HY] = A.hombro;
const L = A.largos;

/**
 * La manga de arriba, colgando: el volumen del brazo prendido de la izquierda y, en el codo, los
 * pliegues apretados de la tapa, en abanico.
 */
function brazoDeArriba(): string {
  const sil = curva(miembro([HX, HY - 8], [HX, HY + L.brazo + 6], 34, 28, 2));
  return conGrano(
    enmascarado('m-psi-brazo', sil,
      forma(sil, C.ocre) +
      nube(HX - 10, HY + L.brazo / 2, 9, L.brazo * 0.55, C.luz, 'm', 0.95) +
      nube(HX - 14, HY + L.brazo / 2, 3, L.brazo * 0.4, C.amarillo, 's', 0.45) +
      nube(HX + 12, HY + L.brazo / 2, 9, L.brazo * 0.6, C.pliegue, 'm', 0.95) +
      nube(HX + 16, HY + L.brazo / 2, 3, L.brazo * 0.4, C.violeta, 's', 0.45) +
      pliegue(HX + 2, HY + L.brazo - 12, 26, 62, 0.9, 7) + pliegue(HX + 4, HY + L.brazo - 1, 22, 70, 0.8, 6) +
      pliegue(HX - 2, HY + 18, 30, 30, 0.6, 7)),
  );
}

/**
 * El antebrazo: la manga, el puño de puntilla que asoma (como el de la tapa, que tiene algo de dandy) y
 * la mano cerrada, que agarra la correa. Se dibuja colgando; la isla lo dobla en el codo.
 */
function antebrazo(): string {
  const codo: P = [HX, HY + L.brazo];
  const mano: P = [HX, codo[1] + L.antebrazo];
  const manga = curva(miembro([HX, codo[1] - 6], [HX, mano[1] - 14], 28, 24, 1));
  // La puntilla: un volado de picos que sale de la manga, en el ocre claro de la tapa.
  const rnd = azar(771);
  const picos: P[] = [];
  for (let i = 0; i <= 10; i++) {
    const a = Math.PI * (i / 10);
    const r = i % 2 ? 15 : 11 + rnd() * 2;
    picos.push([HX + Math.cos(a) * r, mano[1] - 16 + Math.sin(a) * r * 0.7 + 4]);
  }
  const volado = curva(picos);
  const puno = curva([[HX - 10, mano[1] - 8], [HX + 9, mano[1] - 9], [HX + 11, mano[1] + 2], [HX + 6, mano[1] + 10], [HX - 6, mano[1] + 10], [HX - 11, mano[1] + 1]]);
  return conGrano(
    enmascarado('m-psi-mano', puno,
      forma(puno, C.piel) +
      nube(HX - 5, mano[1] - 2, 5, 7, C.amarillo, 's', 0.7) +
      nube(HX + 6, mano[1] + 3, 5, 6, C.barba, 's', 0.6) +
      [-5, -1, 3, 7].map((dx) => trazo(`M${f(HX + dx)} ${f(mano[1] + 2)} L${f(HX + dx - 0.5)} ${f(mano[1] + 9)}`, C.barba, 0.9, 0.7)).join('')) +
    enmascarado('m-psi-volado', volado,
      forma(volado, C.puntilla) +
      guache([[[HX - 12, mano[1] - 13], [HX, mano[1] - 9], [HX + 12, mano[1] - 13]]], C.amarillo, 2, 781, 0.3) +
      nube(HX + 8, mano[1] - 8, 5, 4, C.ocre, 's', 0.7) +
      [-8, -3, 2, 7].map((dx) => trazo(`M${f(HX + dx)} ${f(mano[1] - 16)} L${f(HX + dx * 1.2)} ${f(mano[1] - 7)}`, C.ocre, 0.8, 0.7)).join('')) +
    enmascarado('m-psi-manga', manga,
      forma(manga, C.ocre) +
      nube(HX - 9, (codo[1] + mano[1]) / 2, 7, 22, C.luz, 'm', 0.85) +
      nube(HX + 10, (codo[1] + mano[1]) / 2, 7, 24, C.pliegue, 'm', 0.9) +
      pliegue(HX + 1, codo[1] + 8, 24, -64, 0.9, 6) + pliegue(HX + 2, codo[1] + 21, 22, -58, 0.75, 5.6) + pliegue(HX, codo[1] + 33, 20, -50, 0.6, 5)),
  );
}

/* ------------------------------------------------------------------
   La cabeza: de perfil perdido, mirando el cuadro; y vuelta, mirándote
   ------------------------------------------------------------------ */

/** La cabeza de perfil, mirando a la izquierda: la frente, la nariz, el bigote y la barba, y la nuca. */
export const NUCA: readonly P[] = [
  [-20, -356], [-24, -348], [-26, -342], [-31, -336], [-28, -332], [-27, -328], [-26, -320], [-20, -312], [-6, -308], [10, -310],
  [24, -318], [30, -332], [28, -350], [14, -360], [-4, -362],
];

function cabezaDePerfil(): string {
  const d = curva(NUCA);
  const rnd = azar(811);
  let pelos = '';
  for (let i = 0; i < 36; i++) {
    const [x, y] = [-22 + rnd() * 32, -334 + rnd() * 24];
    pelos += trazo(`M${f(x)} ${f(y)} l${f(-1 + rnd() * 2)} ${f(3 + rnd() * 3)}`, rnd() < 0.3 ? C.luz : C.negro, 0.9, 0.5);
  }
  return conGrano(
    enmascarado('m-psi-nuca', d,
      forma(d, C.barba) +
      // La cara de perfil, prendida por la lamparita: la frente, el pómulo, la nariz.
      forma(curva([[-22, -356], [-25, -346], [-27, -342], [-31, -336], [-27, -333], [-22, -332], [-14, -334], [-8, -342], [-8, -352], [-14, -358]]), C.piel) +
      nube(-22, -344, 5, 8, C.amarillo, 's', 0.7) +
      nube(-12, -340, 6, 6, C.ocre, 's', 0.7) +
      nube(-29, -336, 2, 2, C.papel, 'xs', 0.6) +
      // El ojo, chiquito y hundido bajo la visera: mira el cuadro.
      forma(elipse(-20, -344, 2.6, 1.3), C.negro) + nube(-21, -344.4, 0.8, 0.6, C.amarillo, 'xs', 0.9) +
      // La barba, el bigote y la patilla, en el marrón de la tapa, con pelos sueltos.
      forma(curva([[-27, -331], [-20, -332], [-12, -336], [-4, -344], [2, -346], [6, -330], [-2, -312], [-18, -312], [-26, -320]]), C.barba) +
      nube(-18, -326, 8, 8, C.negro, 's', 0.55) +
      pelos +
      guache([[[-26, -330], [-20, -322], [-12, -316]]], C.ocre, 1.6, 821, 0.4) +
      // La oreja: la C clara de la tapa, con su rulo.
      forma(elipse(10, -336, 6, 9), C.piel) + nube(12, -336, 4, 7, C.ocre, 's', 0.8) +
      trazo('M7 -343 Q15 -344 14 -336 Q13 -329 8 -330 Q11 -334 9 -337', C.amarillo, 1.6, 0.95) +
      trazo('M10 -339 Q12 -336 10 -333', C.barba, 1.2, 0.9) +
      // La nuca, en la sombra, con el violeta de la noche.
      nube(24, -330, 8, 16, C.negro, 'm', 0.6) + nube(28, -334, 3, 12, C.violeta, 's', 0.6)),
  );
}

/** La cabeza vuelta: te mira por encima del hombro, con la barba y la media sonrisa del buen psicópata. */
export const VUELTA_SIL: readonly P[] = [
  [-24, -358], [-28, -346], [-27, -334], [-24, -320], [-14, -308], [2, -306], [16, -314], [26, -328], [28, -346], [18, -360], [-4, -364],
];

function cabezaVuelta(): string {
  const d = curva(VUELTA_SIL);
  const [ox, oy] = A.ojo.centro;
  const [rx, ry] = A.ojo.radio;
  const rnd = azar(831);
  let pelos = '';
  for (let i = 0; i < 40; i++) {
    const [x, y] = [-24 + rnd() * 46, -332 + rnd() * 22];
    pelos += trazo(`M${f(x)} ${f(y)} l${f(-1 + rnd() * 2)} ${f(3 + rnd() * 3)}`, rnd() < 0.25 ? C.luz : C.negro, 0.9, 0.5);
  }
  return conGrano(
    enmascarado('m-psi-vuelta', d,
      forma(d, C.piel) +
      nube(-16, -340, 10, 14, C.amarillo, 'm', 0.55) +
      nube(14, -338, 10, 16, C.ocre, 'm', 0.85) +
      nube(22, -336, 4, 14, C.violeta, 's', 0.5) +
      // Los dos ojos, chicos, bajo la visera; el de acá con el brillo.
      nube(ox, oy, rx + 4, ry + 3, C.ocre, 's', 0.8) +
      forma(elipse(ox, oy, rx, ry), C.papel) + forma(elipse(ox + 0.6, oy, ry * 0.9, ry * 0.9), C.negro) +
      `<circle cx="${f(ox - 0.4)}" cy="${f(oy - 0.8)}" r="0.7" fill="${C.amarillo}"/>` +
      forma(elipse(ox + 18, oy + 1, rx * 0.8, ry * 0.8), C.papel, 0.8) + forma(elipse(ox + 18.4, oy + 1, ry * 0.7, ry * 0.7), C.negro) +
      trazo(`M${f(ox - 5)} ${f(oy - 4)} Q${f(ox)} ${f(oy - 6.4)} ${f(ox + 5)} ${f(oy - 4.6)}`, C.barba, 1.6, 0.95) +
      trazo(`M${f(ox + 13)} ${f(oy - 3)} Q${f(ox + 18)} ${f(oy - 5)} ${f(ox + 22)} ${f(oy - 3.4)}`, C.barba, 1.4, 0.9) +
      // La nariz, de tres cuartos.
      nube(ox + 8, oy + 6, 3, 6, C.ocre, 's', 0.8) + nube(ox + 6, oy + 4, 1.4, 5, C.amarillo, 'xs', 0.7) +
      // La barba entera, el bigote y, en el medio, la media sonrisa: los dientes apenas.
      forma(curva([[-24, -330], [-14, -326], [-2, -328], [10, -326], [22, -330], [26, -318], [14, -306], [-2, -302], [-16, -308], [-24, -318]]), C.barba) +
      pelos +
      forma('M-8 -321 Q2 -317 12 -322 Q2 -319.4 -8 -321 Z', C.papel, 0.9) +
      trazo('M-9 -321 Q2 -316 13 -322.6', C.negro, 1, 0.9) +
      guache([[[-22, -324], [-10, -314], [6, -310]]], C.ocre, 1.6, 841, 0.4)),
  );
}

/** La gorra de la tapa: la copa ancha que cae para adelante, la visera, y el filo amarillo de arriba. */
function gorra(): string {
  const copa = curva([[-40, -354], [-30, -366], [-12, -376], [10, -378], [28, -372], [36, -360], [30, -352], [10, -354], [-12, -352], [-30, -350]]);
  const visera = curva([[-44, -352], [-34, -356], [-18, -354], [-12, -350], [-24, -346], [-40, -346]]);
  return conGrano(
    enmascarado('m-psi-copa', copa,
      forma(copa, C.gorra) +
      nube(-10, -370, 22, 6, C.luz, 'm', 0.85) +
      nube(-20, -366, 10, 3, C.amarillo, 's', 0.7) +
      nube(26, -360, 12, 10, C.pliegue, 'm', 0.95) +
      nube(30, -362, 4, 8, C.violeta, 's', 0.55) +
      // La costura del medio de la gorra, y el botón de arriba.
      trazo('M-34 -360 Q-4 -372 30 -360', C.pliegue, 1.4, 0.8) +
      guache([[[-36, -360], [-14, -372], [10, -376], [26, -370]]], C.amarillo, 2, 851, 0.2) +
      forma(elipse(6, -377, 3, 1.6), C.pliegue)) +
    enmascarado('m-psi-visera', visera,
      forma(visera, C.gorra) + nube(-28, -352, 12, 2, C.amarillo, 's', 0.75) + nube(-24, -346, 14, 2, C.pliegue, 's', 0.8)) +
    // La sombra de la visera en la frente.
    nube(-18, -346, 12, 3, C.negro, 's', 0.45),
  );
}

/* ------------------------------------------------------------------
   El perro de la parabellum
   ------------------------------------------------------------------ */

/** El cuerpo sentado: el anca redonda, el pecho, las patas de adelante derechas. */
function perroCuerpo(): string {
  const d = curva([[-14, -50], [-4, -54], [14, -46], [28, -32], [32, -14], [26, -2], [14, 0], [4, -2], [-4, -2], [-8, 0], [-22, 0], [-20, -6], [-18, -24], [-20, -40]]);
  return conGrano(
    enmascarado('m-perro-cuerpo', d,
      forma(d, C.zorro) +
      nube(16, -20, 14, 14, C.pliegue, 'm', 0.75) +
      nube(-14, -30, 6, 14, C.puntilla, 'm', 0.85) +
      nube(-16, -28, 2, 10, C.amarillo, 's', 0.6) +
      nube(28, -18, 4, 14, C.violeta, 's', 0.55) +
      guache([[[0, -46], [14, -36], [24, -20]], [[-12, -40], [-12, -22], [-14, -6]]], C.pliegue, 3, 861, 0.25) +
      guache([[[-2, -48], [10, -42], [18, -34]]], C.luz, 2.2, 871, 0.3) +
      // La pata de atrás, doblada, y las dos de adelante, con los dedos oscuros.
      trazo('M6 -2 Q16 -8 18 -18', C.pliegue, 2.4, 0.8) +
      trazo('M-12 -4 L-12 -30', C.pliegue, 1.6, 0.6) +
      forma(elipse(-16, -1.6, 5, 2.4), C.pliegue) + forma(elipse(-4, -1.6, 4, 2), C.pliegue) + forma(elipse(16, -1.6, 6, 2.4), C.pliegue)) +
    nube(6, 1, 26, 3, C.negro, 's', 0.6),
  );
}

/** La cola de zorro, peluda, con la punta clara: la isla la barre. */
function perroCola(): string {
  const d = curva([[18, -12], [32, -16], [44, -28], [50, -42], [46, -50], [40, -40], [32, -28], [22, -20]]);
  return conGrano(
    enmascarado('m-perro-cola', d,
      forma(d, C.zorro) + nube(40, -30, 6, 10, C.pliegue, 's', 0.7) + nube(48, -46, 5, 6, C.puntilla, 's', 0.95) +
      guache([[[22, -16], [36, -26], [46, -44]]], C.luz, 2, 881, 0.3)),
  );
}

/**
 * La cabeza de zorro, con la parabellum: la culata se le mete en la cabeza entre las orejas, y el caño
 * apunta para adelante, como en la tapa. La pistola es una Luger, la parabellum de verdad: el caño
 * largo y fino, la rodillera de atrás y la culata tirada para atrás. El acero toma el violeta de la
 * pared del museo, como en la tapa.
 */
function perroCabeza(): string {
  const cabeza = curva([[-6, -50], [-8, -64], [-16, -76], [-28, -76], [-36, -68], [-46, -62], [-46, -58], [-36, -56], [-26, -52], [-14, -48]]);
  const oreja = (x: number, lado: number, id: string): string => {
    const o = curva([[x - 5, -74], [x + lado * 2, -94], [x + 6, -74]]);
    return enmascarado(id, o, forma(o, C.zorro) + forma(curva([[x - 2, -76], [x + lado * 1.6, -90], [x + 3, -76]]), C.negro, 0.85) + nube(x - 3, -84, 2, 6, C.amarillo, 's', 0.5));
  };
  // La Luger, a lo largo del eje x, con la boca del caño en la izquierda.
  const [bx, by] = PA.boca;
  const cano = `M${bx} ${by - 2} L${bx + 30} ${by - 2.6} L${bx + 30} ${by + 3} L${bx} ${by + 2.4} Z`;
  const cajon = `M${bx + 28} ${by - 4} L${bx + 54} ${by - 4} L${bx + 56} ${by + 5} L${bx + 28} ${by + 5} Z`;
  const rodillera = elipse(bx + 46, by - 6, 5, 3.4);
  const culata = `M${bx + 42} ${by + 4} L${bx + 54} ${by + 4} L${bx + 62} ${by + 26} L${bx + 50} ${by + 28} Z`;
  const guardamonte = `M${bx + 34} ${by + 5} Q${bx + 34} ${by + 14} ${bx + 44} ${by + 13}`;
  const pistola =
    enmascarado('m-perro-pistola', `${cano} ${cajon} ${rodillera} ${culata}`,
      forma(cano, C.acero) + forma(cajon, C.acero) + forma(rodillera, C.acero) + forma(culata, C.pliegue) +
      nube(bx + 28, by - 2.4, 30, 1.4, C.papel, 's', 0.85) +
      nube(bx + 44, by - 8, 4, 1.4, C.papel, 'xs', 0.9) +
      nube(bx + 28, by + 4, 30, 2, C.noche, 's', 0.7) +
      nube(bx + 56, by + 16, 4, 10, C.ocre, 's', 0.5)) +
    trazo(guardamonte, C.acero, 2, 1) +
    trazo(`M${bx + 38} ${by + 6} L${bx + 40} ${by + 11}`, C.papel, 1, 0.7);
  return conGrano(
    oreja(-28, -1, 'm-perro-oreja-2') +
    enmascarado('m-perro-cabeza', cabeza,
      forma(cabeza, C.zorro) +
      nube(-36, -58, 8, 4, C.puntilla, 's', 0.9) +
      nube(-16, -62, 8, 10, C.pliegue, 'm', 0.6) +
      nube(-28, -72, 8, 3, C.luz, 's', 0.7) +
      // El hocico, la trufa negra, la boca, y el ojo de persona.
      forma(elipse(-45, -60, 2.4, 2), C.negro) +
      trazo('M-44 -56.4 Q-38 -54.6 -32 -56', C.pliegue, 1.2, 0.9) +
      forma(elipse(PA.ojo.centro[0], PA.ojo.centro[1], PA.ojo.radio[0], PA.ojo.radio[1]), C.papel) +
      `<circle cx="${f(PA.ojo.centro[0] - 0.6)}" cy="${f(PA.ojo.centro[1])}" r="1.5" fill="${C.negro}"/>` +
      `<circle cx="${f(PA.ojo.centro[0] - 1)}" cy="${f(PA.ojo.centro[1] - 0.6)}" r="0.45" fill="${C.amarillo}"/>`) +
    // El collar, del papel de la tapa, con la argolla de la correa.
    forma(curva([[-6, -52], [-10, -48], [-22, -50], [-24, -55], [-12, -54]]), C.papel, 0.92) +
    forma(elipse(PA.collar[0], PA.collar[1], 2.2, 2.2), C.acero) +
    pistola,
  );
}

/** La oreja de acá: se para y se tuerce sola (la isla la mueve). */
function perroOreja(): string {
  const x = -16;
  const o = curva([[x - 5, -74], [x + 1, -95], [x + 6, -74]]);
  return conGrano(enmascarado('m-perro-oreja-1', o, forma(o, C.zorro) + forma(curva([[x - 2, -76], [x + 1, -91], [x + 3, -76]]), C.negro, 0.85) + nube(x + 3, -84, 2, 6, C.amarillo, 's', 0.6)));
}

/**
 * La banderita que sale del caño: un palito y, colgada, la tela violeta con *BANG* en las letras
 * amarillas, escritas a mano, de la contratapa del disco. Se dibuja desde la boca del caño, en el
 * (0, 0), para la izquierda: la isla la estira.
 */
function bandera(): string {
  const tela = 'M-14 -1 L-62 -2 L-60 20 L-15 21 Z';
  // Las cuatro letras, como las de la contratapa: palotes gruesos, un poco torcidos.
  const B = 'M-56 3 L-56 17 M-56 3 Q-49 3 -50 7 Q-50 10 -56 10 Q-48 10 -49 14 Q-50 17 -56 17';
  const A2 = 'M-45 17 L-41 3 L-37 17 M-43.4 11.6 L-38.6 11.4';
  const N = 'M-34 17 L-33 3 L-27 16 L-26 2';
  const G = 'M-17 6 Q-18 3 -21 3 Q-25 4 -25 10 Q-25 17 -21 17 Q-17 17 -17 12 L-20 12';
  return conGrano(
    trazo('M0 0 L-16 -1', C.acero, 2.2, 1) +
    enmascarado('m-perro-bandera', tela,
      forma(tela, C.pared) + nube(-38, 4, 22, 4, C.lila, 's', 0.35) + nube(-38, 18, 24, 3, C.noche, 's', 0.6)) +
    `<g fill="none" stroke="${C.amarillo}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
    [B, A2, N, G].map((d) => `<path d="${d}"/>`).join('') +
    `</g>`,
  );
}

/** El humo del disparo: una bocanada de papel que se abre en la boca del caño. */
function humo(): string {
  return nube(-10, -2, 10, 7, C.papel, 'm', 0.85) + nube(-20, -6, 8, 6, C.lila, 'm', 0.7) + nube(-4, 2, 6, 5, C.papel, 's', 0.9) + nube(-26, 0, 6, 4, C.papel, 'm', 0.5);
}

/* ------------------------------------------------------------------
   El cuadro, el caballete y la lamparita
   ------------------------------------------------------------------ */

/**
 * El cuadro: el fusilamiento de la tapa de verdad, recortado de adentro de su marco (en la tapa de
 * 953 px va de x 58 a 835, pero de 690 para la derecha lo tapa el hombre de la gorra: se recorta de x 58
 * a 684 y de y 40 a 640), y el marco del color de la tapa, con su chanfle. Arriba, la lamparita de museo, de bronce.
 */
const TAPA_DEL_CUADRO = { x0: 58, x1: 684, y0: 40, y1: 640, lado: 953 } as const;

function cuadro(): string {
  const { x, y, ancho, alto, marco } = CUADRO;
  const [x0, y0] = [x - ancho / 2, y - alto / 2];
  const sx = ancho / (TAPA_DEL_CUADRO.x1 - TAPA_DEL_CUADRO.x0);
  const sy = alto / (TAPA_DEL_CUADRO.y1 - TAPA_DEL_CUADRO.y0);
  const lienzo = `M${f(x0)} ${f(y0)} h${ancho} v${alto} h${-ancho} Z`;
  const afuera = `M${f(x0 - marco)} ${f(y0 - marco)} h${ancho + marco * 2} v${alto + marco * 2} h${-(ancho + marco * 2)} Z`;
  return (
    // El marco: el canto de afuera prendido arriba y a la izquierda, el chanfle de adentro hondo.
    enmascarado('m-psi-marco', afuera,
      forma(afuera, C.marco) +
      nube(x0, y0, ancho * 0.6, 6, C.amarillo, 'm', 0.55) +
      nube(x0 + ancho, y0 + alto, ancho * 0.6, 8, C.pliegue, 'm', 0.6) +
      trazo(`M${f(x0 - marco + 1)} ${f(y0 + alto + marco - 1)} L${f(x0 - marco + 1)} ${f(y0 - marco + 1)} L${f(x0 + ancho + marco - 1)} ${f(y0 - marco + 1)}`, C.amarillo, 1, 0.6) +
      trazo(`M${f(x0 - 1)} ${f(y0 + alto + 1)} L${f(x0 + ancho + 1)} ${f(y0 + alto + 1)} L${f(x0 + ancho + 1)} ${f(y0 - 1)}`, C.pliegue, 1.4, 0.8)) +
    `<clipPath id="m-psi-lienzo"><path d="${lienzo}"/></clipPath>` +
    `<g clip-path="url(#m-psi-lienzo)">` +
    `<image href="tapa:bang-bang-estas-liquidado-frontal" x="${f(x0 - TAPA_DEL_CUADRO.x0 * sx)}" y="${f(y0 - TAPA_DEL_CUADRO.y0 * sy)}" width="${f(TAPA_DEL_CUADRO.lado * sx)}" height="${f(TAPA_DEL_CUADRO.lado * sy)}" preserveAspectRatio="none"/>` +
    // La lamparita le pega de arriba: el barniz brilla arriba y abajo se apaga.
    nube(x, y0, ancho * 0.5, 14, C.amarillo, 'l', 0.28) +
    nube(x, y0 + alto, ancho * 0.6, 12, C.negro, 'l', 0.45) +
    `</g>` +
    // La lamparita: el brazo de bronce y la pantalla, arriba del marco.
    trazo(`M${f(x - 10)} ${f(y0 - marco)} Q${f(x - 8)} ${f(y0 - marco - 14)} ${f(x)} ${f(y0 - marco - 14)} L${f(x + 6)} ${f(y0 - marco - 14)}`, C.gorra, 2, 1) +
    forma(`M${f(x - 18)} ${f(y0 - marco - 12)} L${f(x + 22)} ${f(y0 - marco - 12)} L${f(x + 16)} ${f(y0 - marco - 6)} L${f(x - 12)} ${f(y0 - marco - 6)} Z`, C.gorra) +
    trazo(`M${f(x - 17)} ${f(y0 - marco - 11.4)} L${f(x + 21)} ${f(y0 - marco - 11.4)}`, C.amarillo, 1, 0.8) +
    nube(x + 2, y0 - marco - 5, 14, 2, C.amarillo, 's', 0.9)
  );
}

/** El caballete de madera: dos patas adelante, una atrás y el travesaño donde apoya el cuadro. */
function caballete(): string {
  const { x, y, alto, marco, piso } = CUADRO;
  const abajo = y + alto / 2 + marco;
  const pata = (a: P, b: P, ancho: number, k: number): string => {
    const d = curva(miembro(a, b, ancho, ancho * 0.8));
    return enmascarado(`m-psi-pata-${Math.round(a[0])}`, d, forma(d, C.pliegue) + nube(a[0] - 1, (a[1] + b[1]) / 2, 1.4, (b[1] - a[1]) * 0.45, C.ocre, 's', 0.8 * k) + guache([[a, b]], C.ocre, 1.6, 900 + Math.round(a[0]), 0.4));
  };
  return conGrano(
    // La de atrás, más oscura, y más corta porque está más lejos.
    pata([x + 2, y - 30], [x + 10, piso - 22], 4, 0.4) +
    pata([x - 34, y - 52], [x - 50, piso], 5, 1) +
    pata([x + 34, y - 52], [x + 50, piso], 5, 0.8) +
    // El travesaño, con el cuadro apoyado.
    forma(`M${f(x - 50)} ${f(abajo)} L${f(x + 50)} ${f(abajo)} L${f(x + 50)} ${f(abajo + 6)} L${f(x - 50)} ${f(abajo + 6)} Z`, C.pliegue) +
    trazo(`M${f(x - 50)} ${f(abajo + 0.6)} L${f(x + 50)} ${f(abajo + 0.6)}`, C.ocre, 1.2, 0.9) +
    // La sombra de las patas en la tierra.
    nube(x, piso + 2, 60, 4, C.negro, 's', 0.55),
  );
}

/**
 * La luz de la lamparita: un cono tibio que baja sobre el cuadro y se derrama en la tierra, hasta los
 * zapatos de él. Es luz: la página la suma a lo de abajo.
 */
function luz(): string {
  const { x, y, alto } = CUADRO;
  return nube(x, y, 54, 50, C.amarillo, 'xl', 0.32) + nube(x + 30, CUADRO.piso, 110, 24, C.luz, 'xl', 0.35) + nube(x, y - alto / 2, 40, 10, C.amarillo, 'l', 0.4);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

/**
 * La densidad: el psicópata va a 0,55 de su medida, y el retrato lo muestra a unos 2,6 px de pantalla
 * por unidad del recinto. Con 2,6 por unidad del títere el guache no se deshace en un teléfono de
 * pantalla doble; la cara, que es lo que se mira, va más fina.
 */
const D = 2.6;
const Q = 88;

export const PIEZAS_PSICOPATA: readonly Pieza[] = [
  { nombre: 'psicopata-caballete', caja: [CUADRO.x - 70, CUADRO.y - 60, 140, CUADRO.piso - CUADRO.y + 70], dibujo: caballete(), densidad: 3, calidad: Q },
  { nombre: 'psicopata-cuadro', caja: [CUADRO.x - 60, CUADRO.y - 72, 120, 124], dibujo: cuadro(), densidad: 4, calidad: Q },
  { nombre: 'psicopata-luz', caja: [CUADRO.x - 140, CUADRO.y - 110, 330, CUADRO.piso - CUADRO.y + 150], dibujo: luz(), densidad: 0.6 },
  { nombre: 'psicopata-piernas', caja: [-64, -112, 100, 118], dibujo: piernas(), densidad: D, calidad: Q },
  { nombre: 'psicopata-sobretodo', caja: [-62, -320, 140, 250], dibujo: sobretodo(), densidad: D, calidad: Q },
  { nombre: 'psicopata-nuca', caja: [-36, -368, 72, 64], dibujo: cabezaDePerfil(), densidad: D * 1.5, calidad: Q },
  { nombre: 'psicopata-cabeza-vuelta', caja: [-34, -370, 68, 72], dibujo: cabezaVuelta(), densidad: D * 1.5, calidad: Q },
  { nombre: 'psicopata-gorra', caja: [-50, -384, 92, 44], dibujo: gorra(), densidad: D * 1.5, calidad: Q },
  { nombre: 'psicopata-solapa', caja: [-34, -344, 82, 50], dibujo: solapa(), densidad: D, calidad: Q },
  { nombre: 'psicopata-brazo', caja: [HX - 24, HY - 16, 48, L.brazo + 28], dibujo: brazoDeArriba(), densidad: D, calidad: Q },
  { nombre: 'psicopata-antebrazo', caja: [HX - 22, HY + L.brazo - 12, 44, L.antebrazo + 26], dibujo: antebrazo(), densidad: D * 1.2, calidad: Q },
  { nombre: 'perro-cuerpo', caja: [-28, -60, 66, 66], dibujo: perroCuerpo(), densidad: D * 1.3, calidad: Q },
  { nombre: 'perro-cola', caja: [14, -56, 42, 48], dibujo: perroCola(), densidad: D * 1.3, calidad: Q },
  { nombre: 'perro-cabeza', caja: [-64, -110, 70, 64], dibujo: perroCabeza(), densidad: D * 1.6, calidad: Q },
  { nombre: 'perro-oreja', caja: [-24, -98, 16, 28], dibujo: perroOreja(), densidad: D * 1.6, calidad: Q },
  { nombre: 'perro-bandera', caja: [-66, -6, 70, 30], dibujo: bandera(), densidad: D * 1.6, calidad: Q },
  { nombre: 'perro-humo', caja: [-40, -18, 46, 32], dibujo: humo(), densidad: 1.6 },
];

const img = imagenesDe(PIEZAS_PSICOPATA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El párpado de cada ojo que parpadea: el de la cara vuelta y el del perro. */
function parpado(nombre: 'parpado' | 'perro-parpado', t: Readonly<Record<string, string>>): string {
  const { centro: [cx, cy], radio: [rx, ry] } = nombre === 'parpado' ? A.ojo : PA.ojo;
  return `<ellipse data-parte="${nombre}" cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx + 0.6)}" ry="${f(ry + 0.5)}" class="bt-psicopata-${nombre === 'parpado' ? 'parpado' : 'parpado-perro'}" transform="${t[nombre]}"/>`;
}

/** El psicópata y su perro armados con las marcas de un momento (`marcas`, `rig-psicopata.ts`). */
function armado(m: Momento): string {
  const { transform: t, opacity: o, d } = marcas(m);
  return (
    parte('perro',
      parte('perro-cola', img('perro-cola'), t['perro-cola']) +
      img('perro-cuerpo') +
      parte('perro-cabeza',
        img('perro-cabeza') + parpado('perro-parpado', t) +
        parte('perro-oreja', img('perro-oreja'), t['perro-oreja']) +
        parte('humo', img('perro-humo'), t.humo, o.humo) +
        parte('bandera', img('perro-bandera'), t.bandera, o.bandera),
        t['perro-cabeza']),
      t.perro) +
    parte('piernas', img('psicopata-piernas')) +
    parte('cuerpo', img('psicopata-sobretodo'), t.cuerpo) +
    parte('cabeza',
      parte('nuca', img('psicopata-nuca'), '', o.nuca) +
      parte('vuelta', img('psicopata-cabeza-vuelta') + parpado('parpado', t), '', o.vuelta) +
      parte('gorra', img('psicopata-gorra'), t.gorra),
      t.cabeza) +
    parte('solapa', img('psicopata-solapa'), t.cuerpo) +
    `<path data-parte="correa" d="${d.correa}" class="bt-psicopata-correa"/>` +
    parte('brazo', img('psicopata-brazo') + parte('antebrazo', img('psicopata-antebrazo'), t.antebrazo), t.brazo)
  );
}

/** El psicópata en cualquier momento, sin lo que lo hace tocable: para el test y para el retrato. */
export function psicopataEn(m: Momento = QUIETA): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El cuadro en su caballete, con la luz de la lamparita: va atrás de él, en el recinto. */
function museo(): string {
  return (
    `<g class="bt-psicopata-luz" aria-hidden="true">${img('psicopata-luz')}</g>` +
    `<g aria-hidden="true">${img('psicopata-caballete')}${img('psicopata-cuadro')}</g>`
  );
}

/** El títere que se toca, en la pose quieta: de espaldas, mirando el cuadro, con el perro sentado. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--psicopata" data-id="el-buen-psicopata" role="button" tabindex="0" aria-label="${nombres.get('el-buen-psicopata') ?? 'El buen psicópata'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETA).transform.entero}">${armado(QUIETA)}</g>` +
    `</g>`
  );
}

/**
 * El retrato de la ficha: el perro ya disparó la banderita y él te mira tocándose la gorra, con el
 * cuadro al lado. Va sobre su pedazo de baldío (las capas del recinto, que la página ya cargó).
 */
export const RETRATO = (() => {
  const [, y0] = alRecinto([0, -392]);
  const [x1] = alRecinto([72, 0]);
  const x0 = CUADRO.x - CUADRO.ancho / 2 - 16;
  const y1 = LUGAR.piso + 14;
  return { caja: [Math.round(x0), Math.round(y0), Math.round(x1 - x0), Math.round(y1 - y0)] as const };
})();
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('baldio-lejos') + museo() + psicopataEn(SALUDA);
}

export const PSICOPATA: Personaje = {
  id: 'el-buen-psicopata',
  region: 'los-techos',
  ancla: LUGAR.x,
  piezas: PIEZAS_PSICOPATA,
  capas: { atras: museo, figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
