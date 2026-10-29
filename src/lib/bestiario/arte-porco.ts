/**
 * Porco Rex (`D-73`, decimosexta vuelta), trotando solo en la nieve de Cybersiberia.
 *
 * *"Va Porco Rex a Porno Rock!"* es de *Alien Duce* (*Último bondi a Finisterre*, 1998). El Indio dice
 * que ahí asoma por primera vez: un rey arrastrado al barro, la porcarata de la banda (`RES-21`,
 * p. 397), y años después, que Porco Rex, o sea PR, es lo que quedó de Patricio Rey (p. 485). No está
 * en ninguna tapa. Se inventa en la de su disco: el interior de *Último bondi* firma *"Postales
 * virtuales: Rocambole"*, y las caras de la banda en el ojo de buey son eso, muñecos de computadora
 * de 1998, con la piel lisa y el brillo duro del render. **Porco es una postal virtual**: piel de
 * plástico rosa, un brillo blanco y duro arriba, el celeste de la tele en el borde (`--entorno-cyber-
 * lente`) y la nieve que rebota de abajo. Lleva una corona del acero remachado de la tapa, como el
 * ojo de buey, que le queda chica, y los anteojos negros de la banda. Y barro, porque es un rey
 * arrastrado al barro: en las patas, en la panza y en el cuellito de armiño.
 *
 * Coordenadas del títere: el (0, 0) es la nieve debajo de la panza, arriba es negativo, y mira para la
 * derecha, a la tele grande (`PORCO_ARMADO`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { azar } from './pincel.ts';
import { CHARCO, LUGAR, PORCO_ARMADO, QUIETA, ROCK, marcas, type Momento, type Punto } from './rig-porco.ts';

type P = Punto;
const f = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Las tintas del render (`tokens.css`) y las de la nieve de Cybersiberia. */
const C = {
  piel: 'var(--bestia-porco-piel)',
  luz: 'var(--bestia-porco-piel-luz)',
  honda: 'var(--bestia-porco-piel-honda)',
  rosa: 'var(--bestia-porco-rosa)',
  barro: 'var(--bestia-porco-barro)',
  hondo: 'var(--entorno-cyber-acero-hondo)',
  acero: 'var(--entorno-cyber-acero)',
  claro: 'var(--entorno-cyber-acero-claro)',
  nieve: 'var(--entorno-cyber-nieve)',
  lente: 'var(--entorno-cyber-lente)',
  oxido: 'var(--entorno-cyber-oxido)',
  negro: 'var(--fondo)',
};

const A = PORCO_ARMADO;

/* ------------------------------------------------------------------
   Herramientas: la curva y el render
   ------------------------------------------------------------------ */

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

/** El grano: el render de 1998 impreso en el cartón del disco. */
const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;

/**
 * El sombreado del render sobre una forma redonda: la luz de arriba y de la izquierda (el cielo de
 * acero), lo hondo abajo, el rebote de la nieve en la panza, el celeste de la tele en el borde de la
 * derecha y, arriba, el brillo duro, blanco, que es lo que delata a un muñeco de computadora.
 */
function render(c: P, r: P, { brillo = 1, borde = 1 }: { brillo?: number; borde?: number } = {}): string {
  const [x, y] = c;
  const [rx, ry] = r;
  return (
    nube(x - rx * 0.25, y - ry * 0.3, rx * 0.75, ry * 0.6, C.luz, 'm', 0.6) +
    nube(x + rx * 0.1, y + ry * 0.75, rx * 0.95, ry * 0.45, C.honda, 'm', 0.7) +
    nube(x, y + ry * 1.02, rx * 0.7, ry * 0.18, C.nieve, 's', 0.45) +
    nube(x + rx * 0.98, y - ry * 0.05, rx * 0.12, ry * 0.75, C.lente, 's', 0.75 * borde) +
    // El brillo duro: una elipse chica, casi sin soplar, y su corazón blanco.
    nube(x - rx * 0.3, y - ry * 0.6, rx * 0.26, ry * 0.12, C.nieve, 'xs', 0.85 * brillo, -12) +
    nube(x - rx * 0.32, y - ry * 0.62, rx * 0.1, ry * 0.05, C.nieve, 'xs', brillo, -12)
  );
}

/**
 * Salpicaduras de barro sobre una zona: manchones de borde desparejo, algunos con su chorreado para
 * abajo, y gotitas sueltas alrededor. Es un rey arrastrado al barro.
 */
function barro(x0: number, x1: number, y0: number, y1: number, cuantas: number, semilla: number): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < cuantas; i++) {
    const [x, y] = [x0 + rnd() * (x1 - x0), y0 + rnd() * (y1 - y0)];
    const r = 1.6 + rnd() * rnd() * 5;
    // El borde desparejo: seis puntos a distinto radio.
    const pts: P[] = Array.from({ length: 7 }, (_, k) => {
      const a = (k / 7) * Math.PI * 2;
      const rr = r * (0.6 + rnd() * 0.7);
      return [x + Math.cos(a) * rr * 1.3, y + Math.sin(a) * rr * 0.8];
    });
    s += forma(curva(pts), C.barro, 0.7 + rnd() * 0.3);
    if (rnd() < 0.45) s += forma(`M${f(x - r * 0.35)} ${f(y)} Q${f(x)} ${f(y + r * 3)} ${f(x + r * 0.1)} ${f(y + r * 3.4)} Q${f(x + r * 0.2)} ${f(y + r * 2)} ${f(x + r * 0.35)} ${f(y)} Z`, C.barro, 0.85);
    if (rnd() < 0.5) s += forma(elipse(x + (rnd() - 0.5) * r * 5, y + (rnd() - 0.5) * r * 3, 0.6, 0.5), C.barro, 0.9);
  }
  return s;
}

/* ------------------------------------------------------------------
   El cuerpo, las patas y la cola
   ------------------------------------------------------------------ */

const [CX, CY] = A.cuerpo.centro;
const [RX, RY] = A.cuerpo.radio;

/** El cuerpo de chancho: un barril con la panza caída, el lomo y el anca redonda. */
export const CUERPO: readonly P[] = [
  [-46, -50], [-38, -68], [-14, -76], [14, -76], [36, -70], [46, -58], [48, -40], [40, -24], [20, -18], [-4, -16], [-30, -20], [-46, -30], [-50, -40],
];

function cuerpo(): string {
  const d = curva(CUERPO);
  return conGrano(
    enmascarado('m-porco-cuerpo', d,
      forma(d, C.rosa) +
      nube(-10, -54, 30, 16, C.piel, 'l', 0.6) +
      render([CX, CY], [RX, RY]) +
      // El lomo y el anca: dos lomas redondas que el render separa con una sombra suave.
      nube(-34, -44, 14, 18, C.luz, 'm', 0.35) + nube(-18, -40, 4, 18, C.honda, 'm', 0.35) +
      // El barro, en la panza y en el costado de abajo.
      barro(-44, 36, -40, -18, 16, 1101) + nube(0, -19, 36, 3.4, C.barro, 's', 0.55)),
  );
}

/**
 * El cuellito de armiño de rey: una vuelta de piel blanca alrededor del pescuezo, con las colitas
 * negras, y embarrado.
 */
function armino(): string {
  const d = curva([[30, -66], [36, -76], [44, -78], [48, -70], [50, -56], [50, -42], [46, -32], [38, -30], [36, -40], [38, -54], [36, -64]]);
  const rnd = azar(1111);
  let colitas = '';
  for (let i = 0; i < 7; i++) {
    const [x, y] = [40 + rnd() * 8, -72 + i * 6];
    colitas += forma(`M${f(x)} ${f(y)} q1.2 2 0.4 4.2 q-1 -2 -0.4 -4.2 Z`, C.negro, 0.9);
  }
  // Los pelos del borde: el armiño no tiene canto liso.
  let pelos = '';
  for (let i = 0; i < 22; i++) {
    const t = i / 21;
    const [x, y] = [50 - Math.abs(t - 0.5) * 6, -76 + t * 46];
    pelos += trazo(`M${f(x)} ${f(y)} l${f(1.6 + rnd())} ${f(rnd() - 0.5)}`, C.nieve, 0.8, 0.8);
  }
  return conGrano(
    enmascarado('m-porco-armino', d,
      forma(d, C.nieve) + nube(40, -54, 5, 20, C.claro, 'm', 0.65) + nube(49, -56, 2, 18, C.lente, 's', 0.7) +
      nube(44, -74, 4, 2, C.nieve, 'xs', 0.9) + colitas + barro(36, 50, -44, -32, 7, 1113)) +
    pelos,
  );
}

/** Una pata, colgando de su cadera: la pierna redonda y la pezuña partida, que de punta son dos cuernos. */
function pata(n: 0 | 1 | 2 | 3): string {
  const [hx, hy] = A.patas[n];
  const l = A.pata;
  const lejos = n === 1 || n === 3;
  const pierna = curva([[hx - 9, hy - 8], [hx + 9, hy - 8], [hx + 8, hy + l * 0.5], [hx + 5.6, hy + l - 5], [hx - 5.6, hy + l - 5], [hx - 8, hy + l * 0.5]]);
  // La pezuña, partida en dos: de punta, con la pata para arriba, son los cuernos del rock.
  const pezuna =
    forma(`M${f(hx - 5)} ${f(hy + l - 6)} L${f(hx - 0.6)} ${f(hy + l - 6)} L${f(hx - 1.2)} ${f(hy + l + 0.6)} L${f(hx - 5.4)} ${f(hy + l)} Z`, C.hondo) +
    forma(`M${f(hx + 0.6)} ${f(hy + l - 6)} L${f(hx + 5)} ${f(hy + l - 6)} L${f(hx + 5.4)} ${f(hy + l)} L${f(hx + 1.2)} ${f(hy + l + 0.6)} Z`, C.hondo) +
    nube(hx - 3, hy + l - 4, 1.2, 1.6, C.claro, 'xs', 0.8) + nube(hx + 3, hy + l - 4, 1.2, 1.6, C.claro, 'xs', 0.8);
  return conGrano(
    enmascarado(`m-porco-pata-${n + 1}`, pierna,
      forma(pierna, C.rosa) +
      nube(hx - 3, hy + l * 0.3, 3, l * 0.35, C.luz, 's', lejos ? 0.25 : 0.6) +
      nube(hx + 4, hy + l * 0.4, 3, l * 0.4, C.honda, 's', 0.7) +
      nube(hx + 6, hy + l * 0.3, 1, l * 0.3, C.lente, 'xs', lejos ? 0.2 : 0.6) +
      (lejos ? nube(hx, hy + l * 0.4, 8, l * 0.5, C.honda, 'm', 0.45) : '') +
      // El barro, que le sube por la pata hasta media caña.
      forma(`M${f(hx - 8)} ${f(hy + l * 0.55)} Q${f(hx)} ${f(hy + l * 0.45)} ${f(hx + 8)} ${f(hy + l * 0.6)} L${f(hx + 8)} ${f(hy + l)} L${f(hx - 8)} ${f(hy + l)} Z`, C.barro, 0.9) +
      barro(hx - 6, hx + 6, hy + l * 0.35, hy + l * 0.55, 4, 1121 + n)) +
    pezuna,
  );
}

/** La cola enrulada, que da vueltas como un tirabuzón. */
function cola(): string {
  const [x, y] = A.cola;
  let d = `M${x + 3} ${y}`;
  for (let i = 0; i <= 26; i++) {
    const a = Math.PI + (i / 26) * Math.PI * 3.2;
    const r = 6.4 - i * 0.16;
    d += ` L${f(x - 8 + Math.cos(a) * r)} ${f(y - 4 + Math.sin(a) * r)}`;
  }
  return conGrano(trazo(d, C.rosa, 3, 1) + trazo(d, C.luz, 1, 0.6) + `<g transform="translate(0.8 0.8)">${trazo(d, C.honda, 1, 0.35)}</g>`);
}

/* ------------------------------------------------------------------
   La cabeza: la trompa, las orejas, los anteojos, la boca que chilla
   ------------------------------------------------------------------ */

function cabeza(): string {
  const [hx, hy] = A.cabeza;
  const d = curva([[40, -60], [44, -72], [56, -78], [68, -74], [76, -64], [84, -56], [86, -46], [80, -40], [70, -38], [54, -38], [42, -44]]);
  const [tx, ty] = A.trompa;
  const trompa = elipse(tx + 2, ty - 1, 5, 7.4);
  return conGrano(
    enmascarado('m-porco-cabeza', d,
      forma(d, C.rosa) +
      render([hx + 4, hy + 2], [24, 16], { brillo: 0.9 }) +
      // Los cachetes, gordos, que el render redondea.
      nube(64, -44, 10, 6, C.piel, 's', 0.6) +
      nube(56, -40, 12, 3, C.honda, 's', 0.6)) +
    // La trompa: el disco de frente, de un rosa más claro, con los dos agujeros.
    enmascarado('m-porco-trompa', trompa,
      forma(trompa, C.piel) + nube(tx + 1, ty - 4, 3, 2.6, C.luz, 's', 0.9) + nube(tx + 4, ty + 3, 3, 3, C.honda, 's', 0.6) +
      nube(tx + 6, ty - 1, 1, 5, C.lente, 'xs', 0.7) +
      forma(elipse(tx + 1, ty - 2.6, 1, 1.6), C.honda) + forma(elipse(tx + 3.4, ty + 1.6, 1, 1.6), C.honda)) +
    // Los anteojos negros de la banda, redondos, con la tele que se refleja en el vidrio.
    `<g>` +
    forma(elipse(A.anteojos[0], A.anteojos[1], 6.4, 5.6), C.negro) +
    forma(elipse(A.anteojos[0] + 9.6, A.anteojos[1] + 1.4, 4.4, 5), C.negro) +
    trazo(`M${A.anteojos[0] + 6.2} ${A.anteojos[1] - 0.4} Q${A.anteojos[0] + 7.8} ${A.anteojos[1] - 2} ${A.anteojos[0] + 5.6 + 4} ${A.anteojos[1] - 0.6}`, C.hondo, 1.2, 1) +
    trazo(`M${A.anteojos[0] - 6.2} ${A.anteojos[1] - 1} L${A.anteojos[0] - 18} ${A.anteojos[1] + 2}`, C.hondo, 1.2, 1) +
    nube(A.anteojos[0] - 1, A.anteojos[1] - 2, 3.4, 1.4, C.lente, 'xs', 0.7, -18) +
    nube(A.anteojos[0] + 9, A.anteojos[1] - 1, 2, 1, C.lente, 'xs', 0.55, -18) +
    `</g>`,
  );
}

/** La quijada de abajo, con lo rosa oscuro de adentro: la isla la abre para el chillido. */
function quijada(): string {
  const d = curva([[56, -42], [70, -42], [80, -42], [78, -37], [66, -34], [56, -37]]);
  return conGrano(
    forma(curva([[58, -44], [78, -44], [76, -40], [60, -39]]), C.honda) +
    enmascarado('m-porco-quijada', d, forma(d, C.rosa) + nube(68, -36, 10, 3, C.honda, 's', 0.7) + nube(70, -41, 8, 1.4, C.luz, 'xs', 0.5)),
  );
}

/** Una oreja de chancho, grande, triangular y caída para adelante, que rebota con el trote. */
function oreja(n: 0 | 1): string {
  const [x, y] = A.orejas[n];
  // Sale de arriba de la cabeza, sube en punta y la punta se cae para adelante, sobre los anteojos.
  const d = curva([[x - 5, y + 3], [x - 1, y - 10], [x + 8, y - 17], [x + 16, y - 12], [x + 13, y - 6], [x + 6, y + 3]]);
  return conGrano(
    enmascarado(`m-porco-oreja-${n + 1}`, d,
      forma(d, C.rosa) +
      nube(x + 6, y - 6, 4, 7, n ? C.honda : C.piel, 's', 0.85, 30) +
      nube(x + 12, y - 10, 3, 3, C.honda, 's', 0.6) +
      nube(x + 15, y - 11, 1.2, 4, C.lente, 'xs', 0.75) +
      nube(x + 1, y - 9, 2.6, 1.2, C.nieve, 'xs', 0.75, -50)),
  );
}

/**
 * La corona, del acero remachado de la tapa: un aro con las puntas, los remaches del ojo de buey y,
 * de adorno, las pistas de circuito que la tapa tiene alrededor. Le queda chica y está torcida.
 */
function corona(): string {
  const [x, y] = A.corona;
  const d = `M${x - 13} ${y + 6} L${x - 14} ${y - 6} L${x - 8} ${y - 1} L${x - 4} ${y - 12} L${x} ${y - 2} L${x + 5} ${y - 12} L${x + 8} ${y - 1} L${x + 14} ${y - 7} L${x + 13} ${y + 6} Z`;
  const remaches = [-9, -3, 3, 9].map((dx) => forma(elipse(x + dx, y + 2.6, 1.3, 1.1), C.claro) + nube(x + dx - 0.4, y + 2.2, 0.5, 0.4, C.nieve, 'xs', 0.9)).join('');
  return conGrano(
    enmascarado('m-porco-corona', d,
      forma(d, C.acero) +
      nube(x - 4, y - 2, 8, 6, C.claro, 'm', 0.8) +
      nube(x + 10, y, 3, 7, C.lente, 's', 0.7) +
      nube(x, y + 6, 14, 2, C.hondo, 's', 0.8) +
      trazo(`M${x - 13} ${y} L${x + 13} ${y}`, C.hondo, 0.8, 0.9) +
      trazo(`M${x - 10} ${y - 3} L${x - 6} ${y - 3} L${x - 6} ${y - 6}`, C.claro, 0.6, 0.8) +
      trazo(`M${x + 6} ${y - 3} L${x + 10} ${y - 3}`, C.claro, 0.6, 0.8) +
      nube(x - 5, y - 9, 1.6, 0.8, C.nieve, 'xs', 0.95)) +
    remaches +
    [-4, 5].map((dx) => forma(elipse(x + dx, y - 12, 1.4, 1.4), C.claro) + nube(x + dx - 0.4, y - 12.6, 0.5, 0.4, C.nieve, 'xs', 0.9)).join(''),
  );
}

/** El brillo de la tele en los anteojos: un destello que la isla prende cuando la mira o cuando rockea. */
function brillo(): string {
  const [x, y] = A.anteojos;
  const rayo = (g: number, l: number): string => `<g transform="rotate(${g} ${x - 2} ${y - 2})"><path d="M${x - 2} ${y - 2 - l} L${x - 1.4} ${y - 2} L${x - 2} ${y - 2 + l} L${x - 2.6} ${y - 2} Z" fill="${C.nieve}"/></g>`;
  return nube(x - 2, y - 2, 4, 4, C.lente, 's', 0.8) + rayo(0, 6) + rayo(90, 6) + rayo(45, 3) + rayo(-45, 3);
}

/** El vaho que larga por la trompa en el frío. */
function vaho(): string {
  return nube(4, -2, 7, 4, C.nieve, 'm', 0.75) + nube(10, -5, 6, 4, C.nieve, 'm', 0.55) + nube(16, -8, 5, 3, C.claro, 'm', 0.4);
}

/** El barro que salpica cuando se revuelca: gotas que saltan para los costados. */
function salpica(): string {
  const rnd = azar(1131);
  let s = '';
  for (let i = 0; i < 18; i++) {
    const lado = i % 2 ? 1 : -1;
    const [x, y] = [lado * (30 + rnd() * 40), -6 - rnd() * 26];
    s += forma(elipse(x, y, 1.4 + rnd() * 2, 1.2 + rnd() * 1.6), C.barro, 0.9);
  }
  return s;
}

/* ------------------------------------------------------------------
   El charco de barro, en la nieve
   ------------------------------------------------------------------ */

/** El charco de su campo de juego, en el recinto: barro y nieve pisada. Va atrás de él. */
function charco(): string {
  const [x, y] = [LUGAR.x + CHARCO.x * LUGAR.escala, LUGAR.piso + 2];
  const rnd = azar(1141);
  let huellas = '';
  for (let i = 0; i < 16; i++) {
    const hx = x - 80 + rnd() * 160;
    const hy = y - 4 + rnd() * 12;
    huellas += forma(elipse(hx, hy, 2.2, 1.2), C.barro, 0.5) + forma(elipse(hx + 3, hy, 2.2, 1.2), C.barro, 0.5);
  }
  return conGrano(
    nube(x, y, CHARCO.rx * 1.2, CHARCO.ry * 1.6, C.acero, 'm', 0.5) +
    forma(curva([[x - CHARCO.rx, y], [x - CHARCO.rx * 0.6, y - CHARCO.ry], [x + CHARCO.rx * 0.2, y - CHARCO.ry * 1.1], [x + CHARCO.rx, y - 1], [x + CHARCO.rx * 0.5, y + CHARCO.ry], [x - CHARCO.rx * 0.4, y + CHARCO.ry * 0.9]]), C.barro) +
    nube(x - 10, y - 2, CHARCO.rx * 0.5, 2, C.lente, 's', 0.35) +
    nube(x + 20, y + 2, 10, 2, C.oxido, 's', 0.6) +
    huellas,
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

/** La densidad: Porco va a 0,6 de su medida y el retrato lo agranda; el render liso pide pocos píxeles. */
const D = 4;
const Q = 90;

export const PIEZAS_PORCO: readonly Pieza[] = [
  { nombre: 'porco-charco', caja: [LUGAR.x - 110, LUGAR.piso - 20, 220, 40], dibujo: charco(), densidad: 2.4 },
  { nombre: 'porco-cuerpo', caja: [-56, -82, 110, 70], dibujo: cuerpo(), densidad: D, calidad: Q },
  { nombre: 'porco-armino', caja: [26, -82, 28, 52], dibujo: armino(), densidad: D, calidad: Q },
  ...([0, 1, 2, 3] as const).map((n) => ({ nombre: `porco-pata-${n + 1}`, caja: [A.patas[n][0] - 12, A.patas[n][1] - 11, 24, A.pata + 14] as const, dibujo: pata(n), densidad: D, calidad: Q })),
  { nombre: 'porco-cola', caja: [-66, -66, 24, 22], dibujo: cola(), densidad: D },
  { nombre: 'porco-cabeza', caja: [36, -82, 56, 48], dibujo: cabeza(), densidad: D * 1.3, calidad: Q },
  { nombre: 'porco-quijada', caja: [52, -48, 32, 16], dibujo: quijada(), densidad: D * 1.3 },
  { nombre: 'porco-oreja-1', caja: [48, -96, 28, 26], dibujo: oreja(0), densidad: D },
  { nombre: 'porco-oreja-2', caja: [56, -98, 28, 26], dibujo: oreja(1), densidad: D },
  { nombre: 'porco-corona', caja: [A.corona[0] - 18, A.corona[1] - 18, 36, 30], dibujo: corona(), densidad: D * 1.3, calidad: Q },
  { nombre: 'porco-brillo', caja: [A.anteojos[0] - 12, A.anteojos[1] - 12, 20, 20], dibujo: brillo(), densidad: 2.4 },
  { nombre: 'porco-vaho', caja: [-12, -18, 36, 24], dibujo: vaho(), densidad: 1.6 },
  { nombre: 'porco-salpica', caja: [-80, -40, 160, 42], dibujo: salpica(), densidad: 2.4 },
];

const img = imagenesDe(PIEZAS_PORCO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Porco armado con las marcas de un momento (`marcas`, `rig-porco.ts`). */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    // La sombra en la nieve, que no se da vuelta ni se para con él.
    `<ellipse cx="0" cy="1" rx="46" ry="5" class="bt-porco-sombra"/>` +
    parte('salpica', img('porco-salpica'), '', o.salpica) +
    parte('cuerpo',
      parte('pata-2', img('porco-pata-2'), t['pata-2']) +
      parte('pata-4', img('porco-pata-4'), t['pata-4']) +
      parte('cola', img('porco-cola'), t.cola) +
      img('porco-cuerpo') +
      parte('pata-3', img('porco-pata-3'), t['pata-3']) +
      parte('cabeza',
        parte('oreja-2', img('porco-oreja-2'), t['oreja-2']) +
        parte('boca', `<g data-parte="adentro" opacity="${o.adentro}"><path d="M58 -44 Q70 -46 80 -44 L76 -36 Q66 -33 58 -38 Z" class="bt-porco-adentro"/></g>` + img('porco-quijada'), t.boca) +
        img('porco-cabeza') +
        `<path data-parte="ceja" d="M58 -66.4 Q65 -69.6 72 -67" class="bt-porco-ceja" transform="${t.ceja}"/>` +
        parte('oreja-1', img('porco-oreja-1'), t['oreja-1']) +
        parte('corona', img('porco-corona'), t.corona) +
        parte('brillo', img('porco-brillo'), '', o.brillo) +
        parte('vaho', img('porco-vaho'), t.vaho, o.vaho),
        t.cabeza) +
      img('porco-armino') +
      parte('pata-1', img('porco-pata-1'), t['pata-1']),
      t.cuerpo)
  );
}

/** Porco en cualquier momento, sin lo que lo hace tocable: para el test y para el retrato. */
export function porcoEn(m: Momento = QUIETA): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: en sus cuatro patas en el medio del campo, mirando la tele. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--porco" data-id="porco-rex" role="button" tabindex="0" aria-label="${nombres.get('porco-rex') ?? 'Porco Rex'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETA).transform.entero}">${armado(QUIETA)}</g>` +
    `</g>`
  );
}

/** El charco de su campo de juego, debajo de él: no se toca. */
const elCharco = (): string => `<g aria-hidden="true" pointer-events="none">${img('porco-charco')}</g>`;

/**
 * El retrato de la ficha: parado en dos patas en su charco, con las pezuñas haciendo los cuernos del
 * rock y la corona en el aire. Va sobre su pedazo de nieve (las capas del recinto).
 */
export const RETRATO = (() => {
  const x0 = LUGAR.x - 44;
  const y0 = LUGAR.piso - 118;
  return { caja: [Math.round(x0), Math.round(y0), 100, 132] as const };
})();
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('cyber-lejos') + fondo('cyber-piso') + elCharco() + porcoEn(ROCK);
}

export const PORCO: Personaje = {
  id: 'porco-rex',
  region: 'cybersiberia',
  ancla: LUGAR.x,
  piezas: PIEZAS_PORCO,
  capas: { figura: (nombres) => elCharco() + titere(nombres) },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
