/**
 * El negro Atila (`D-73`, undécima vuelta), a aerógrafo, en la estética de *Lobo suelto*, su disco.
 *
 * *Rock para el negro Atila* es la pista 2 de *Lobo suelto* (1993), y el Atila no está en ninguna
 * tapa: se inventa en la de su disco (`T-440`). Esa tapa es el aerógrafo de Rocambole en sepia: la
 * cara del lobo partida en una mitad de luz y otra hundida en sombra, el ojo grande con ojera e iris
 * humano, el otro chico y amarillo perdido en lo oscuro, y el pecho a rayas. El Atila tiene todo eso:
 * la cara partida igual, los dos ojos de la tapa, y la bufanda acanalada como el pecho del lobo.
 *
 * Lo demás sale de la letra: *"hundido en tu gabán"* (el gabán con el cuello levantado hasta la
 * nariz), *"masticando el frío marginal"* (el vaho), *"apretar en tu bolsillo todo el metálico
 * brillo"* (el bolsillo que brilla) y *"oler como el ratón"* (la nariz, que olfatea). Y lo que el
 * dibujo agrega, y la ficha lo dice: adentro del gabán, lo que se fue llevando de los otros recintos.
 *
 * Coordenadas del títere: el (0, 0) es el piso entre los zapatos, arriba es negativo. Se dibuja al
 * doble y la escena lo achica (`ATILA.escala`). Lo imprime `scripts/imprimir-bestiario.mjs`.
 */

import { enmascarado, forma, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';
import { ATILA_ARMADO } from './rig.ts';

type P = readonly [number, number];

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** Las tintas de la tapa de *Lobo suelto* (`RES-37`), y la luz lila del farol del baldío. */
const L = {
  claro: 'var(--bestia-lobo-claro)',
  crema: 'var(--bestia-lobo-crema)',
  ocre: 'var(--bestia-lobo-ocre)',
  sombra: 'var(--bestia-lobo-sombra)',
  oscuro: 'var(--bestia-lobo-oscuro)',
  gris: 'var(--bestia-lobo-gris)',
  forro: 'var(--bestia-lobo-boca)',
  negro: 'var(--fondo)',
  rojo: 'var(--marca-rojo)',
  oro: 'var(--acento-2)',
  farol: 'var(--entorno-baion-lila)',
  farolVivo: 'var(--entorno-baion-luz)',
  noche: 'var(--entorno-baion-noche)',
  violeta: 'var(--entorno-baion-violeta)',
};

/* ------------------------------------------------------------------
   Herramientas: la curva, el canto rasgado y el espejo
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

/** Un tramo recto partido en dientes chicos: el papel cortado a mano, como el canto de la tapa. */
function rasgado(a: P, b: P, amp: number, paso: number, semilla: number): P[] {
  const rnd = azar(semilla);
  const largo = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const k = Math.max(1, Math.round(largo / paso));
  const [nx, ny] = [-(b[1] - a[1]) / largo, (b[0] - a[0]) / largo];
  const salida: P[] = [];
  for (let j = 0; j <= k; j++) {
    const t = j / k;
    const tiembla = j === 0 || j === k ? 0 : (rnd() - 0.5) * 2 * amp;
    salida.push([a[0] + (b[0] - a[0]) * t + nx * tiembla, a[1] + (b[1] - a[1]) * t + ny * tiembla]);
  }
  return salida;
}

const linea = (pts: readonly P[]): string => pts.map(([x, y]) => `L${f(x)} ${f(y)}`).join(' ');
const espejo = (pts: readonly P[], eje = 0): P[] => pts.map(([x, y]) => [2 * eje - x, y] as const).reverse();
const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;

/* ------------------------------------------------------------------
   El gabán: la espalda, adentro, y las dos hojas de adelante
   ------------------------------------------------------------------
   Visto de frente, con los hombros subidos hasta las orejas de frío. Se abre en dos hojas que giran
   sobre la costura del costado (`ATILA_ARMADO.bisagras`), como la capa de la drácula: cerrado no se
   ve lo de adentro; abierto, el forro con todo lo que lleva colgado.
*/

/** El costado del gabán, del ruedo hasta el cuello: la mitad izquierda; la otra es su espejo. */
const COSTADO: readonly P[] = [[-96, -66], [-92, -150], [-86, -232], [-80, -284], [-66, -310], [-44, -324], [-26, -328]];
const RUEDO = (semilla: number): P[] => rasgado([96, -66], [-96, -66], 2.6, 9, semilla);

/** La silueta entera: los dos costados en curva y el ruedo rasgado. */
const SILUETA = `${curva([...COSTADO, ...espejo(COSTADO)], false)} ${linea(RUEDO(3))} Z`;

/** El torso flaco de adentro: debajo de semejante gabán no hay casi nada. */
const TORSO: readonly P[] = [[-30, -318], [-36, -280], [-33, -214], [-29, -150], [-26, -112], [26, -112], [29, -150], [33, -214], [36, -280], [30, -318]];

function cuerpo(): string {
  // La camiseta de frisa, acanalada como el pecho del lobo de la tapa.
  let costillas = '';
  for (let y = -306; y < -118; y += 17) costillas += nube(0, y, 40, 3.6, L.sombra, 's', 0.75);
  const adentro =
    forma(SILUETA, L.oscuro) +
    // La espalda por dentro: el forro asoma en los costados, lo demás es la sombra del gabán.
    nube(-74, -200, 14, 110, L.forro, 'l', 0.8) +
    nube(76, -200, 14, 110, L.forro, 'l', 0.6) +
    nube(0, -150, 70, 60, L.negro, 'xl', 0.6) +
    enmascarado('m-atila-torso', curva(TORSO),
      forma(curva(TORSO), L.crema) +
      nube(-14, -250, 18, 60, L.claro, 'l', 0.7) +
      costillas +
      nube(24, -220, 22, 120, L.oscuro, 'l', 0.85) +
      // El pantalón, que arranca abajo, y el cinturón con la hebilla que no brilla: lo que brilla va en el bolsillo.
      forma('M-34 -128 L34 -128 L34 -100 L-34 -100 Z', L.oscuro) +
      forma('M-34 -134 L34 -134 L34 -126 L-34 -126 Z', L.sombra) +
      nube(-4, -130, 5, 4, L.ocre, 'xs'));
  return conGrano(enmascarado('m-atila-espalda', SILUETA, adentro));
}

/** La hoja izquierda, cerrada: del costado hasta la solapa, que cruza el medio. */
const HOJA_1: readonly P[] = [[-96, -66], [-92, -150], [-86, -232], [-80, -284], [-66, -310], [-44, -324], [-26, -328], [-18, -314], [-6, -286], [6, -256], [9, -210], [9, -66]];
/** La hoja derecha, que va encima: la del lado de la sombra. */
const HOJA_2: readonly P[] = HOJA_1.map(([x, y]) => [-x, y] as const);

const hojaD = (hoja: readonly P[], semilla: number): string => {
  // El costado y el hombro en curva, la solapa en recta (está planchada), y el ruedo rasgado.
  const [costado, solapa] = [hoja.slice(0, 7), hoja.slice(6)];
  const ruedo = rasgado(hoja[hoja.length - 1]!, hoja[0]!, 2.6, 9, semilla);
  return `${curva(costado, false)} ${linea(solapa.slice(1))} ${linea(ruedo.slice(1))} Z`;
};

function hojaIzquierda(): string {
  const d = hojaD(HOJA_1, 5);
  const adentro =
    forma(d, L.sombra) +
    // La luz de la izquierda, soplada en una franja que baja por el costado.
    nube(-66, -230, 20, 120, L.ocre, 'l', 0.9) +
    nube(-62, -300, 22, 12, L.crema, 'm', 0.8) +
    nube(-72, -220, 7, 80, L.crema, 'm', 0.35) +
    // Los pliegues: el gabán le queda grande y cae en caños.
    nube(-44, -190, 7, 90, L.oscuro, 'm', 0.75) +
    nube(-18, -170, 6, 70, L.oscuro, 'm', 0.6) +
    nube(-30, -230, 5, 40, L.ocre, 'm', 0.5) +
    // La solapa, doblada: la sombra que proyecta sobre el pecho.
    soplo('M-26 -327 L-18 -314 L-6 -286 L6 -256 L0 -250 L-12 -282 L-24 -312 Z', L.oscuro, 's', 0.9) +
    // El bolsillo, con la tapa torcida.
    forma('M-82 -176 L-44 -168 L-45 -160 L-83 -168 Z', L.oscuro, 0.85) +
    trazo('M-82 -168 L-45 -160', L.crema, 1.2, 0.5) +
    // El ruedo, más oscuro, y gastado.
    nube(-44, -96, 70, 46, L.oscuro, 'xl', 0.85) +
    nube(-44, -72, 70, 10, L.negro, 'm', 0.7);
  return conGrano(enmascarado('m-atila-hoja-1', d, adentro));
}

function hojaDerecha(): string {
  const d = hojaD(HOJA_2, 7);
  const adentro =
    forma(d, L.oscuro) +
    nube(40, -230, 30, 120, L.sombra, 'l', 0.9) +
    // El canto de afuera, tocado por la luz lila del farol.
    nube(95, -200, 4, 120, L.farol, 'm', 0.75) +
    nube(74, -302, 10, 6, L.farol, 'm', 0.5) +
    nube(30, -180, 6, 80, L.negro, 'm', 0.7) +
    nube(64, -150, 6, 60, L.negro, 'm', 0.5) +
    soplo('M26 -327 L18 -314 L6 -286 L-6 -256 L0 -250 L12 -282 L24 -312 Z', L.negro, 's', 0.6) +
    // Los botones de hueso: el del medio cuelga de un hilo.
    [[3, -268], [6, -150]].map(([x, y]) => nube(x!, y!, 5.5, 5.5, L.crema, 'xs') + nube(x! + 1, y! + 1, 1.6, 1.6, L.oscuro, 'xs')).join('') +
    trazo('M2 -214 q2 8 1 16', L.crema, 0.8, 0.8) +
    nube(4, -194, 5, 5, L.crema, 'xs') +
    nube(5, -193, 1.5, 1.5, L.oscuro, 'xs') +
    // El bolsillo del metálico brillo: abultado, y una cadenita que cuelga afuera.
    forma('M36 -168 L74 -176 L75 -168 L37 -160 Z', L.negro, 0.9) +
    nube(56, -158, 20, 12, L.sombra, 'm', 0.7) +
    trazo('M44 -164 q6 16 16 10 q6 -4 4 -10', L.crema, 1.2, 0.85) +
    nube(44, -92, 70, 40, L.negro, 'xl', 0.8) +
    nube(44, -70, 70, 10, L.negro, 'm', 0.7);
  return conGrano(enmascarado('m-atila-hoja-2', d, adentro));
}

/* ------------------------------------------------------------------
   El forro, abierto: lo que se fue llevando de los otros recintos
   ------------------------------------------------------------------
   Se dibuja ya abierto, del otro lado de la bisagra: la isla lo despliega desde la costura.
*/

const FORRO_1 = espejo(HOJA_1, ATILA_ARMADO.bisagras[0][0]);
const FORRO_2 = espejo(HOJA_2, ATILA_ARMADO.bisagras[1][0]);
/** Lo colgado se dibujó para un gabán más ancho: se corre hacia la bisagra lo que se angostó. */
export const CORRE = 14;

/** El raso del forro: tela que brilla en una franja y se arruga en pliegues. */
function raso(d: string, cx: number, rnd: () => number): string {
  let pliegues = '';
  for (let k = 0; k < 5; k++) pliegues += nube(cx + (rnd() - 0.5) * 80, -200 + (rnd() - 0.5) * 120, 4, 50 + rnd() * 40, L.negro, 'm', 0.4);
  return forma(d, L.forro) + nube(cx - 14, -230, 16, 110, L.crema, 'l', 0.22) + pliegues + nube(cx, -86, 60, 34, L.negro, 'xl', 0.75);
}

/** Un reloj de bolsillo, colgado de su cadena. */
const relojDeBolsillo = (x: number, desde: number, y: number, r: number): string =>
  trazo(`M${x} ${desde} L${x} ${y - r}`, L.crema, 1, 0.9) +
  nube(x, y, r, r, L.crema, 'xs') +
  `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${L.claro}" stroke-width="1.6"/>` +
  trazo(`M${x} ${y} l0 -${f(r * 0.6)} M${x} ${y} l${f(r * 0.45)} ${f(r * 0.2)}`, L.oscuro, 1) +
  nube(x, y - r - 1.5, 1.6, 1.6, L.claro, 'xs');

/** Una mano que agarra el canto del forro para mostrar: los nudillos de la luz. */
const manoQueMuestra = (x: number, y: number, lado: 1 | -1): string =>
  enmascarado(`m-atila-agarra-${lado}`, curva([[x - 9 * lado, y - 14], [x + 6 * lado, y - 16], [x + 11 * lado, y - 2], [x + 8 * lado, y + 14], [x - 6 * lado, y + 16], [x - 11 * lado, y + 2]]),
    forma(curva([[x - 9 * lado, y - 14], [x + 6 * lado, y - 16], [x + 11 * lado, y - 2], [x + 8 * lado, y + 14], [x - 6 * lado, y + 16], [x - 11 * lado, y + 2]]), L.sombra) +
    nube(x - 4, y - 4, 6, 9, L.ocre, 's') +
    [-8, -2, 4, 10].map((dy) => nube(x + 7 * lado, y + dy, 2.4, 1.6, L.crema, 'xs', 0.8)).join(''));

function forroIzquierdo(): string {
  const d = curva(FORRO_1);
  const rnd = azar(41);
  // La cuerda cosida de punta a punta, de la que cuelgan los relojes.
  const cuerda = trazo('M-178 -300 Q-140 -290 -100 -298', L.crema, 1.2, 0.8);
  const relojes = relojDeBolsillo(-134, -293, -268, 8) + relojDeBolsillo(-116, -294, -262, 7) + relojDeBolsillo(-100, -297, -272, 6.5);
  // La sirena de la cana: el domo rojo con su base. Es lo que hizo comprar matraca nueva, de ocasión.
  const sirena =
    forma('M-178 -244 L-142 -244 L-144 -236 L-176 -236 Z', L.negro) +
    forma('M-175 -244 A15 19 0 0 1 -145 -244 Z', L.rojo) +
    nube(-166, -254, 4, 7, L.claro, 's', 0.8) +
    nube(-150, -250, 5, 8, L.negro, 's', 0.45) +
    trazo('M-171 -244 L-149 -244', L.oscuro, 1.2, 0.8);
  // Las cucharitas de algún bar, colgadas del mango.
  const cucharitas = [-176, -162, -148, -134].map((x, i) =>
    trazo(`M${x} -214 L${x + (i % 2 ? 1 : -1)} -184`, L.claro, 2) + nube(x + (i % 2 ? 1 : -1), -179, 4.2, 6.4, L.claro, 'xs') + nube(x + 1, -177, 2, 3, L.gris, 'xs', 0.8)).join('');
  // Una llave de las grandes, de puerta de pensión.
  const llave =
    `<circle cx="-112" cy="-206" r="6" fill="none" stroke="${L.ocre}" stroke-width="2.6"/>` +
    trazo('M-112 -200 L-112 -168 M-112 -176 l6 0 M-112 -170 l5 0', L.ocre, 2.6);
  return conGrano(enmascarado('m-atila-forro-1', d, raso(d, -122, rnd) + `<g transform="translate(${CORRE} 0)">${cuerda + relojes + sirena + cucharitas + llave + manoQueMuestra(-186, -250, -1)}</g>`));
}

function forroDerecho(): string {
  const d = curva(FORRO_2);
  const rnd = azar(43);
  // Una fila de relojes pulsera, enganchados de la malla en una tira.
  const tira = trazo('M100 -286 L182 -290', L.oscuro, 4);
  const pulseras = [108, 128, 148, 168].map((x, i) =>
    trazo(`M${x} -288 L${x + (i % 2)} -256`, L.oscuro, 3.4) +
    nube(x, -272, 7, 7, L.crema, 'xs') +
    `<circle cx="${x}" cy="-272" r="7" fill="none" stroke="${L.claro}" stroke-width="1.4"/>` +
    trazo(`M${x} -272 l0 -4.5 M${x} -272 l3 1.5`, L.oscuro, 0.9)).join('');
  // Un eslabón de la cadena del lobo: el papel recortado con el rayo, como en la tapa. Por algo anda suelto.
  const eslabon = `<g transform="rotate(-14 140 -214)">` +
    forma('M118 -228 L162 -230 L164 -198 L120 -196 Z', L.claro) +
    forma('M126 -222 L156 -223 L157 -204 L127 -203 Z', L.forro) +
    forma('M146 -222 L134 -212 L142 -212 L132 -203 L150 -215 L142 -215 Z', L.negro) +
    nube(158, -212, 6, 16, L.sombra, 's', 0.5) +
    `</g>`;
  // La dentadura del caníbal desdentado: por eso enseña a masticar sin dientes.
  const encia = (y: number, sentido: 1 | -1): string =>
    forma(`M114 ${y} Q138 ${y - 16 * sentido} 162 ${y} L160 ${y + 6 * sentido} Q138 ${y - 8 * sentido} 116 ${y + 6 * sentido} Z`, L.rojo, 0.75) +
    [0, 1, 2, 3, 4, 5].map((k) => {
      const x = 120 + k * 7.4;
      const arco = -Math.sin((k / 5) * Math.PI) * 9 * sentido;
      return nube(x, y + arco + 4 * sentido, 3.2, 4.2, L.claro, 'xs');
    }).join('');
  const dentadura = encia(-156, 1) + encia(-134, -1) + nube(138, -146, 26, 6, L.negro, 's', 0.5);
  return conGrano(enmascarado('m-atila-forro-2', d, raso(d, 124, rnd) + `<g transform="translate(${-CORRE} 0)">${tira + pulseras + eslabon + dentadura + manoQueMuestra(186, -250, 1)}</g>`));
}

/* ------------------------------------------------------------------
   La cabeza: el funyi, la cara partida como la del lobo, la nariz que olfatea
   ------------------------------------------------------------------ */

const CARA: readonly P[] = [[-30, -446], [-33, -420], [-31, -392], [-27, -366], [-18, -344], [0, -336], [18, -344], [27, -366], [31, -392], [33, -420], [30, -446]];
/** Donde la luz corta la cara: casi derecho, quebrado en la nariz, como en la tapa. */
const CORTE: readonly P[] = [[2, -470], [-1, -420], [5, -394], [7, -376], [1, -330]];
const NARIZ: readonly P[] = [[-4, -424], [-8, -400], [-15, -384], [-12, -373], [-4, -375], [0, -371], [4, -375], [12, -373], [15, -384], [8, -400], [4, -424]];

function cabeza(): string {
  const [o1, o2] = ATILA_ARMADO.ojos;
  const luz = `M-60 -520 ${linea(CORTE)} L-60 -320 Z`;
  const cara =
    forma(curva(CARA), L.oscuro) +
    // La mitad de la luz.
    enmascarado('m-atila-luz', luz,
      forma(curva(CARA), L.sombra) +
      nube(-16, -396, 16, 30, L.ocre, 'l', 0.95) +
      nube(-20, -394, 7, 12, L.crema, 'm', 0.75) +
      nube(-12, -432, 14, 8, L.ocre, 'm', 0.8)) +
    // La otra mitad, hundida: apenas el pómulo.
    nube(22, -392, 8, 14, L.sombra, 'm', 0.6) +
    // La sombra del ala del sombrero sobre la frente.
    nube(0, -442, 40, 9, L.negro, 'm', 0.85) +
    // Las ojeras hondas de la tapa, y el ceño que baja.
    nube(o1.centro[0], o1.centro[1] + 1, 16, 14, L.negro, 's', 0.8) +
    nube(o2.centro[0], o2.centro[1], 13, 12, L.negro, 's', 0.9) +
    soplo(`M-28 -428 Q-16 -432 -4 -424 L-6 -420 Q-16 -426 -27 -423 Z`, L.negro, 'xs', 0.9) +
    soplo(`M28 -428 Q16 -432 6 -424 L8 -420 Q16 -426 27 -423 Z`, L.negro, 'xs', 0.9) +
    // Los blancos: el grande, de la luz; el chico, perdido en lo oscuro, amarillento.
    `<ellipse cx="${o1.centro[0]}" cy="${o1.centro[1]}" rx="${o1.radio[0]}" ry="${o1.radio[1]}" fill="${L.claro}"/>` +
    nube(o1.centro[0] + 3, o1.centro[1] + 3, 6, 4, L.gris, 's', 0.6) +
    `<ellipse cx="${o2.centro[0]}" cy="${o2.centro[1]}" rx="${o2.radio[0]}" ry="${o2.radio[1]}" fill="${L.crema}" opacity="0.92"/>` +
    // La nariz larga, con las almohadillas grises del hocico del lobo en la punta.
    enmascarado('m-atila-nariz', curva(NARIZ),
      forma(curva(NARIZ), L.oscuro) +
      enmascarado('m-atila-nariz-luz', luz, forma(curva(NARIZ), L.ocre) + nube(-6, -398, 4, 14, L.crema, 's', 0.8)) +
      nube(-6, -378, 5, 4, L.gris, 's', 0.8) + nube(6, -378, 5, 4, L.gris, 's', 0.45) +
      nube(-7, -375, 2.6, 1.6, L.negro, 'xs') + nube(7, -375, 2.6, 1.6, L.negro, 'xs') +
      nube(-8, -382, 1.6, 1.6, L.claro, 'xs', 0.9)) +
    // El surco de la cara, que baja de la nariz.
    trazo('M-16 -380 Q-22 -366 -20 -352', L.oscuro, 1.6, 0.6);
  // El funyi: el ala torcida, la copa hundida, la cinta.
  const COPA: readonly P[] = [[-34, -450], [-36, -478], [-30, -500], [-12, -497], [0, -491], [12, -497], [30, -500], [36, -478], [34, -450]];
  const funyi =
    enmascarado('m-atila-copa', curva(COPA),
      forma(curva(COPA), L.oscuro) +
      nube(-18, -478, 12, 22, L.sombra, 'm', 0.9) +
      nube(-20, -486, 5, 8, L.ocre, 's', 0.6) +
      nube(30, -476, 4, 18, L.farol, 's', 0.4) +
      forma('M-36 -466 L36 -466 L35 -452 L-35 -452 Z', L.negro) +
      nube(-20, -459, 10, 3, L.sombra, 's', 0.8)) +
    `<g transform="rotate(-3 0 -448)">` +
    enmascarado('m-atila-ala', 'M-68 -448 Q-64 -459 0 -459 Q64 -459 68 -446 Q64 -435 0 -437 Q-62 -437 -68 -448 Z',
      forma('M-68 -448 Q-64 -459 0 -459 Q64 -459 68 -446 Q64 -435 0 -437 Q-62 -437 -68 -448 Z', L.oscuro) +
      nube(-36, -450, 22, 4, L.sombra, 's', 0.9) +
      nube(56, -448, 6, 4, L.farol, 's', 0.6)) +
    `</g>`;
  return conGrano(cara + funyi);
}

/* ------------------------------------------------------------------
   El cuello levantado y la bufanda, que tapan la boca: ahí se hunde
   ------------------------------------------------------------------ */

/** Un ala del cuello levantado: planchada, en punta, abierta hacia afuera como la oreja del lobo. */
const ALA_CUELLO: readonly P[] = [[-28, -328], [-62, -326], [-74, -346], [-80, -398], [-62, -386], [-46, -372], [-38, -352], [-30, -340]];
const BUFANDA: readonly P[] = [[-44, -326], [-46, -350], [-40, -374], [0, -380], [40, -374], [46, -350], [44, -326], [0, -320]];
const PUNTA: readonly P[] = [[16, -332], [36, -334], [40, -306], [38, -282], [19, -280], [17, -306]];

function cuello(): string {
  // El cuello va en recta: es tela planchada y dura, no una oreja.
  const alaIzq = `M${ALA_CUELLO.map(([x, y]) => `${x} ${y}`).join(' L')} Z`;
  const alaDer = `M${espejo(ALA_CUELLO).map(([x, y]) => `${x} ${y}`).join(' L')} Z`;
  const costillas = (x: number, ancho: number, y0: number, y1: number): string => {
    let s = '';
    for (let y = y0; y < y1; y += 11) s += nube(x, y, ancho, 2.6, L.sombra, 's', 0.9);
    return s;
  };
  let flecos = '';
  for (let k = 0; k < 6; k++) flecos += trazo(`M${20 + k * 3.4} -282 l${(k % 2) - 0.5} 9`, L.crema, 1.6, 0.85);
  return conGrano(
    enmascarado('m-atila-cuello-1', alaIzq, forma(alaIzq, L.sombra) + nube(-66, -364, 8, 30, L.ocre, 'm', 0.9) + nube(-74, -390, 3, 10, L.crema, 's', 0.6) + nube(-44, -366, 5, 22, L.forro, 'm', 0.8) + nube(-52, -332, 24, 7, L.oscuro, 'm', 0.8)) +
    enmascarado('m-atila-cuello-2', alaDer, forma(alaDer, L.oscuro) + nube(76, -372, 3, 28, L.farol, 'm', 0.6) + nube(44, -366, 5, 22, L.forro, 'm', 0.5)) +
    // La bufanda: acanalada como el pecho del lobo, con su mitad de sombra.
    enmascarado('m-atila-bufanda', curva(BUFANDA),
      forma(curva(BUFANDA), L.crema) + nube(-20, -352, 18, 22, L.claro, 'm', 0.6) + costillas(0, 46, -372, -322) + nube(30, -350, 20, 34, L.oscuro, 'l', 0.85)) +
    enmascarado('m-atila-punta', curva(PUNTA),
      forma(curva(PUNTA), L.ocre) + costillas(28, 14, -326, -284) + nube(38, -306, 6, 30, L.oscuro, 'm', 0.8)) +
    flecos,
  );
}

/** Las dos manos que sostienen el gabán cerrado contra el pecho, del frío. */
function manos(): string {
  const PUNO_1: readonly P[] = [[-24, -252], [-8, -256], [2, -244], [0, -226], [-14, -220], [-26, -230]];
  const PUNO_2: readonly P[] = [[-4, -238], [12, -244], [22, -232], [20, -214], [6, -208], [-6, -218]];
  const puno = (pts: readonly P[], id: string, luz: string): string => {
    const d = curva(pts);
    const [cx, cy] = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
    return enmascarado(id, d,
      forma(d, L.sombra) + nube(cx - 4, cy - 2, 8, 10, luz, 's', 0.95) +
      [-8, -3, 2, 7].map((dy) => nube(cx + 9, cy + dy, 2.4, 1.6, L.crema, 'xs', 0.7)).join('') +
      nube(cx + 6, cy + 6, 8, 6, L.oscuro, 's', 0.5));
  };
  return conGrano(puno(PUNO_2, 'm-atila-puno-2', L.sombra) + puno(PUNO_1, 'm-atila-puno-1', L.ocre));
}

/** Una pierna: el pantalón que asoma abajo del gabán y el zapato gastado. `lado` 1 es la derecha. */
function pierna(lado: 1 | -1): string {
  const x = (v: number): number => v * lado;
  const pantalon = `M${x(30)} -176 L${x(6)} -176 L${x(6)} -26 L${x(10)} -18 L${x(32)} -18 L${x(34)} -70 Z`;
  const ZAPATO: readonly P[] = [[x(44), -2], [x(48), -12], [x(36), -21], [x(8), -21], [x(2), -10], [x(4), 0]];
  const zapato = curva(ZAPATO);
  return conGrano(
    enmascarado(`m-atila-pantalon-${lado}`, pantalon,
      forma(pantalon, lado < 0 ? L.sombra : L.oscuro) +
      nube(x(24), -70, 6, 60, lado < 0 ? L.ocre : L.sombra, 'm', 0.8) +
      trazo(`M${x(19)} -100 L${x(20)} -24`, L.negro, 1.4, 0.5)) +
    enmascarado(`m-atila-zapato-${lado}`, zapato,
      forma(zapato, L.negro) + nube(x(32), -14, 8, 4, lado < 0 ? L.sombra : L.oscuro, 's') + nube(x(36), -15, 2.4, 1.6, L.claro, 'xs', 0.7)),
  );
}

/* ------------------------------------------------------------------
   Los ojos que se mueven, el brillo del bolsillo, el vaho y la sirena
   ------------------------------------------------------------------ */

/** El iris del ojo grande: gris, humano, como el del lobo. */
const iris1 = (): string =>
  nube(0, 0, 5.4, 5.4, L.gris, 'xs') + `<circle cx="0" cy="0" r="5.4" fill="none" stroke="${L.oscuro}" stroke-width="1.2"/>` +
  `<circle cx="0" cy="0" r="2.5" fill="${L.negro}"/>` + `<circle cx="-1.7" cy="-1.8" r="1.1" fill="${L.claro}"/>`;
/** El del ojo chico de la sombra: amarillento, como el ojo oscuro de la tapa. */
const iris2 = (): string =>
  nube(0, 0, 4, 4, L.ocre, 'xs') + nube(-0.8, -0.8, 2.6, 2.6, L.oro, 'xs', 0.6) +
  `<circle cx="0" cy="0" r="1.9" fill="${L.negro}"/>` + `<circle cx="-1.2" cy="-1.3" r="0.8" fill="${L.claro}"/>`;

/** El brillo que se escapa del bolsillo: cuatro rayos y el oro adentro. */
const brillo = (): string =>
  nube(0, 0, 7, 7, L.oro, 's', 0.7) +
  forma('M0 -13 L1.6 -1.6 L13 0 L1.6 1.6 L0 13 L-1.6 1.6 L-13 0 L-1.6 -1.6 Z', L.claro) +
  nube(0, 0, 2.4, 2.4, L.claro, 'xs');

/** Una bocanada de vaho: el frío marginal, masticado. */
const vaho = (): string => nube(0, 0, 15, 9, L.claro, 'l', 0.55) + nube(-4, 1, 7, 5, L.claro, 'm', 0.5);

/** La lucecita de la sirena del forro, que se prende y se apaga. */
const sirenaChica = (): string => nube(0, 0, 24, 24, L.rojo, 'l', 0.75) + nube(0, 0, 6, 7, L.claro, 's', 0.8);

/** La luz de la sirena de la cana que barre los techos: roja, soplada, con el centro más vivo. */
const sirena = (): string => nube(0, 0, 190, 110, L.rojo, 'xl', 0.55) + nube(0, 0, 90, 56, L.rojo, 'xl', 0.6) + nube(0, 0, 30, 20, L.farolVivo, 'l', 0.5);

/* ------------------------------------------------------------------
   El tanque de agua, en los techos de la derecha
   ------------------------------------------------------------------
   En la escena, no en el títere. Del baldío de *Un baión*: negro contra la noche, con el canto de
   crayón lila del lado del farol. Los gatos andan por arriba.
*/

function tanque(): string {
  const rnd = azar(71);
  let rayas = '';
  for (let i = 0; i < 70; i++) {
    const y = 132 + rnd() * 160;
    const x = 748 + rnd() * 10 - (y > 206 ? -24 : 0);
    rayas += trazo(`M${f(x)} ${f(y)} l${f(-4 - rnd() * 8)} ${f(-3 - rnd() * 6)}`, rnd() < 0.6 ? L.farol : L.farolVivo, 1.8 + rnd() * 1.6, 0.4 + rnd() * 0.4);
  }
  return (
    `<g filter="url(#rociado)">` +
    // La torre de ladrillo y la escalera de hierro.
    forma('M774 300 L774 206 L828 206 L828 300 Z', L.negro) +
    trazo('M786 300 L786 212 M800 300 L800 212 M786 286 L800 286 M786 270 L800 270 M786 254 L800 254 M786 238 L800 238 M786 222 L800 222', L.violeta, 2.2, 0.9) +
    // El tanque de fibrocemento, con sus fajas y la tapa.
    forma('M746 206 L746 146 Q746 138 754 138 L848 138 Q856 138 856 146 L856 206 Z', L.negro) +
    trazo('M746 162 L856 162 M746 186 L856 186', L.noche, 3) +
    forma('M770 138 L774 128 L828 128 L832 138 Z', L.negro) +
    nube(750, 172, 6, 34, L.farol, 'm', 0.65) +
    nube(778, 232, 4, 30, L.farol, 'm', 0.4) +
    rayas +
    // El caño que baja, y una antena torcida.
    trazo('M842 206 L842 300', L.negro, 4) +
    trazo('M812 128 L820 70 M806 84 L834 90 M810 76 L828 80', L.negro, 2.4) +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   Las piezas que se imprimen
   ------------------------------------------------------------------ */

const cajaDe = (pts: readonly P[], aire = 6): readonly [number, number, number, number] => {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.floor(Math.min(...xs) - aire);
  const y0 = Math.floor(Math.min(...ys) - aire);
  return [x0, y0, Math.ceil(Math.max(...xs) + aire) - x0, Math.ceil(Math.max(...ys) + aire) - y0];
};

const D = 1.5;

export const PIEZAS_ATILA: readonly Pieza[] = [
  { nombre: 'atila-pierna-1', caja: [-56, -182, 62, 188], dibujo: pierna(-1), densidad: D },
  { nombre: 'atila-pierna-2', caja: [-6, -182, 62, 188], dibujo: pierna(1), densidad: D },
  { nombre: 'atila-cuerpo', caja: cajaDe([...COSTADO, ...espejo(COSTADO)], 10), dibujo: cuerpo(), densidad: D },
  { nombre: 'atila-cabeza', caja: [-72, -508, 144, 176], dibujo: cabeza(), densidad: D * 1.4 },
  { nombre: 'atila-forro-1', caja: cajaDe(FORRO_1, 10), dibujo: forroIzquierdo(), densidad: D },
  { nombre: 'atila-forro-2', caja: cajaDe(FORRO_2, 10), dibujo: forroDerecho(), densidad: D },
  { nombre: 'atila-hoja-1', caja: cajaDe(HOJA_1, 10), dibujo: hojaIzquierda(), densidad: D },
  { nombre: 'atila-hoja-2', caja: cajaDe(HOJA_2, 10), dibujo: hojaDerecha(), densidad: D },
  { nombre: 'atila-cuello', caja: [-88, -406, 176, 128], dibujo: cuello(), densidad: D },
  { nombre: 'atila-manos', caja: [-32, -262, 60, 60], dibujo: manos(), densidad: D },
  { nombre: 'atila-iris-1', caja: [-8, -8, 16, 16], dibujo: iris1(), densidad: 6 },
  { nombre: 'atila-iris-2', caja: [-6, -6, 12, 12], dibujo: iris2(), densidad: 6 },
  { nombre: 'atila-brillo', caja: [-24, -24, 48, 48], dibujo: brillo(), densidad: 2 },
  { nombre: 'atila-vaho', caja: [-40, -30, 80, 60], dibujo: vaho(), densidad: 1.2 },
  { nombre: 'atila-sirena-chica', caja: [-50, -50, 100, 100], dibujo: sirenaChica(), densidad: 1 },
  { nombre: 'atila-sirena', caja: [-300, -200, 600, 400], dibujo: sirena(), densidad: 0.5 },
  { nombre: 'atila-tanque', caja: [730, 60, 140, 244], dibujo: tanque(), densidad: 2 },
];
