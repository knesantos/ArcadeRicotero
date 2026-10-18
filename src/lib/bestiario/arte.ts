/**
 * El arte inventado del recinto del monte y la pastura (`D-73`), a aerógrafo.
 *
 * El lobo y el cordero no se dibujan acá: son recortes de las tapas (`recortes.ts`). Acá vive
 * lo que las tapas no tienen y hay que inventar en su estética: el monte de noche (las tiras de
 * la contratapa de *Lobo suelto*), la pastura naranja de *Cordero atado*, y el lomo que completa
 * al cordero donde la tapa lo corta. `scripts/imprimir-bestiario.mjs` lo imprime a
 * `public/bestiario/`.
 */

import { enmascarado, forma, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { PIEZAS_BAJO } from './arte-bajo.ts';
import { PIEZAS_VACA } from './arte-vaca.ts';



/* ------------------------------------------------------------------
   El lomo del cordero: lo único inventado del cordero
   ------------------------------------------------------------------
   En la tapa, el cuerpo del cordero sigue más allá del canto, arriba y a la izquierda. Este lomo
   lo completa por debajo del recorte (`recortes.ts`), en los azules medidos de la tapa y con las
   escamas largas y puntiagudas que tiene el cuerpo en la tapa. Está en píxeles de la tapa.
*/

const AZ = {
  hondo: 'var(--bestia-cordero-azul-hondo)',
  medio: 'var(--bestia-cordero-azul)',
  escama: 'var(--bestia-cordero-escama)',
  negro: 'var(--fondo)',
};

const LOMO = 'M30 290 C-70 270, -120 130, -80 10 C-40 -110, 120 -140, 300 -90 C360 -70, 390 -30, 380 30 L300 60 L60 60 Z';

/** Una escama de las de la tapa: larga, en punta, que cae hacia atrás. */
function escamaLarga(x: number, y: number, largo: number, giro: number): string {
  const d = `M${x} ${y} C${x + largo * 0.18} ${y + largo * 0.25}, ${x + largo * 0.12} ${y + largo * 0.7}, ${x - largo * 0.05} ${y + largo} C${x - largo * 0.12} ${y + largo * 0.6}, ${x - largo * 0.2} ${y + largo * 0.25}, ${x} ${y} Z`;
  return `<path d="${d}" fill="${AZ.escama}" opacity="0.42" filter="url(#soplo-s)" transform="rotate(${giro} ${x} ${y})"/>`;
}

function lomoCordero(): string {
  let escamas = '';
  let fila = 0;
  for (let y = -200; y < 300; y += 46, fila++) {
    for (let x = -170 + (fila % 2) * 34; x < 420; x += 68) {
      const j = ((x * 13 + y * 7) % 11) - 5;
      escamas += escamaLarga(x + j, y + j * 0.6, 70 + (j % 3) * 6, 28 + j);
    }
  }
  const adentro =
    forma(LOMO, AZ.medio) +
    nube(110, 40, 230, 120, AZ.hondo, 'l', 0.9) +
    escamas +
    // El lomo está del lado de la sombra: se funde en lo oscuro hacia afuera.
    nube(60, -60, 260, 120, AZ.hondo, 'xl', 0.7) +
    nube(-60, 120, 110, 150, AZ.negro, 'l', 0.75);
  return `<g filter="url(#grano)">${enmascarado('m-lomo', LOMO, adentro)}</g>`;
}

/* ------------------------------------------------------------------
   La escena: el monte de noche y la pastura que brilla
   ------------------------------------------------------------------ */

export const ESCENA_ARTE = { ancho: 900, alto: 640 } as const;
export const PALO_ARTE = { x: 450, y: 418 } as const;
export const PASTURA_ARTE = { rx: 262, ry: 138 } as const;

export const M = {
  claro: 'var(--entorno-monte-claro)',
  medio: 'var(--entorno-monte-medio)',
  hondo: 'var(--entorno-monte-hondo)',
  sombra: 'var(--bestia-lobo-sombra)',
  oscuro: 'var(--bestia-lobo-oscuro)',
  negro: 'var(--fondo)',
  naranja: 'var(--entorno-pastura)',
  naranjaHonda: 'var(--entorno-pastura-honda)',
  azul: 'var(--bestia-cordero-lana-clara)',
  azulHondo: 'var(--bestia-cordero-lana)',
};

export function azar(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Una tira de papel rasgado, como las de la contratapa de *Lobo suelto*: sube del piso, se
 * inclina, termina en punta, y el canto derecho baja en dientes de sierra. De noche: el cuerpo
 * oscuro, el canto de los dientes encendido por la luz, y la sombra soplada contra el otro canto.
 */
function tira(x: number, arriba: number, abajo: number, ancho: number, cuerpo: string, luz: string, rnd: () => number, id: string): string {
  const inclinacion = (rnd() - 0.4) * 30;
  const punta = { x: x + ancho * 0.45 + inclinacion, y: arriba };
  const alto = abajo - arriba;
  const paso = 11 + rnd() * 7;
  const dientes: string[] = [];
  const canto: string[] = [];
  for (let y = arriba + paso; y < abajo - 4; y += paso) {
    const t = (y - arriba) / alto;
    const borde = punta.x + (x + ancho - punta.x) * Math.min(1, t * 1.5);
    const afuera = borde + 9 + rnd() * 5;
    dientes.push(`L${afuera.toFixed(1)} ${(y - paso * 0.15).toFixed(1)} L${borde.toFixed(1)} ${(y + paso * 0.35).toFixed(1)}`);
    canto.push(`M${borde.toFixed(1)} ${(y - paso * 0.5).toFixed(1)} L${afuera.toFixed(1)} ${(y - paso * 0.15).toFixed(1)} L${(borde - 3).toFixed(1)} ${(y + paso * 0.2).toFixed(1)} Z`);
  }
  const izquierda = `Q${(x + inclinacion * 0.3 - 4).toFixed(1)} ${(arriba + alto * 0.45).toFixed(1)} ${punta.x.toFixed(1)} ${punta.y.toFixed(1)}`;
  const d = `M${x.toFixed(1)} ${abajo} ${izquierda} ${dientes.join(' ')} L${(x + ancho).toFixed(1)} ${abajo} Z`;
  return enmascarado(id, d,
    forma(d, cuerpo) +
    canto.map((c) => soplo(c, luz, 's', 0.85)).join('') +
    soplo(`M${(x - 10).toFixed(1)} ${abajo} ${izquierda} L${(punta.x + 4).toFixed(1)} ${(punta.y + alto * 0.3).toFixed(1)} L${(x + ancho * 0.35).toFixed(1)} ${abajo} Z`, M.negro, 'm', 0.7) +
    nube(punta.x, abajo, ancho, alto * 0.25, M.negro, 'l', 0.8));
}

export function filaDeTiras(arriba: number, abajo: number, cuerpo: string, luz: string, semilla: number, prefijo: string, desde = -20, hasta = ESCENA_ARTE.ancho + 20): string {
  const rnd = azar(semilla);
  let s = '';
  let x = desde;
  let n = 0;
  while (x < hasta) {
    const ancho = 34 + rnd() * 40;
    s += tira(x, arriba + rnd() * 70, abajo, ancho, cuerpo, luz, rnd, `${prefijo}-${n++}`);
    x += ancho * (0.5 + rnd() * 0.25);
  }
  return s;
}

/** Los trazos de crayón y los espirales de la contratapa del disco 2, sobre la pastura. */
function crayon(): string {
  const rnd = azar(23);
  let s = '';
  for (let i = 0; i < 150; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd());
    const x = PALO_ARTE.x + Math.cos(a) * d * (PASTURA_ARTE.rx - 16);
    const y = PALO_ARTE.y + Math.sin(a) * d * (PASTURA_ARTE.ry - 10);
    if (Math.hypot(x - PALO_ARTE.x, (y - PALO_ARTE.y) / 0.55) < 96) continue;
    const largo = 7 + rnd() * 10;
    const color = rnd() < 0.6 ? M.azulHondo : M.oscuro;
    s += trazo(`M${x.toFixed(1)} ${y.toFixed(1)} l${(-3 + rnd() * 6).toFixed(1)} ${(-largo).toFixed(1)} M${(x + 3).toFixed(1)} ${y.toFixed(1)} l${(1 + rnd() * 4).toFixed(1)} ${(-largo * 0.7).toFixed(1)}`, color, 1.4, 0.75);
  }
  // Los espirales de la contratapa del disco 2: pocos, grandes, de trazo grueso.
  const espiral = (cx: number, cy: number, r: number): string => {
    let d = '';
    for (let k = 0; k <= 60; k++) {
      const a = (k / 60) * Math.PI * 5;
      const rr = (r * k) / 60;
      d += `${k ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr * 0.55).toFixed(1)} `;
    }
    return trazo(d, M.azulHondo, 3, 0.85);
  };
  s += espiral(250, 386, 34) + espiral(668, 452, 28) + espiral(560, 330, 18);
  return s;
}

/** Lo lejano: la noche y las tres filas de tiras del monte. */
function monteLejos(): string {
  const { ancho, alto } = ESCENA_ARTE;
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${M.negro}"/>` +
    // Un resplandor bajo detrás del monte: la noche no es negra pareja.
    nube(ancho * 0.38, 150, 380, 90, M.sombra, 'xl', 0.55) +
    nube(ancho * 0.7, 120, 200, 60, M.hondo, 'xl', 0.5) +
    filaDeTiras(-40, 300, M.oscuro, M.sombra, 3, 'fila-a') +
    filaDeTiras(30, 320, M.hondo, M.medio, 9, 'fila-b') +
    filaDeTiras(110, 335, M.sombra, M.claro, 17, 'fila-c') +
    `</g>`
  );
}

/**
 * Lo cercano: el piso del monte, la pastura que brilla y el palo. Arriba es transparente y el
 * borde está soplado: detrás de ese borde se hunde el lobo cuando no asoma.
 */
function monteCerca(): string {
  const { ancho, alto } = ESCENA_ARTE;
  return (
    `<g filter="url(#rociado)">` +
    soplo(`M-40 300 C200 286, 700 286, ${ancho + 40} 300 L${ancho + 40} ${alto + 40} L-40 ${alto + 40} Z`, M.oscuro, 'm') +
    soplo(`M-40 318 C200 306, 700 306, ${ancho + 40} 318 L${ancho + 40} ${alto + 40} L-40 ${alto + 40} Z`, M.oscuro, 's') +
    claroDeLaPastura() +
    `</g>`
  );
}

/**
 * El claro, sin el piso del monte alrededor: la pastura, el círculo pelado y el palo. Aparte
 * para que el camino con cruces (`arte-camino.ts`) lo apoye sobre su piso largo sin arrastrar el
 * del recinto, que termina en los costados de la escena.
 */
export function claroDeLaPastura(): string {
  const { x: px, y: py } = PALO_ARTE;
  const { rx, ry } = PASTURA_ARTE;
  return (
    nube(px, py + 10, rx + 120, ry + 70, M.negro, 'xl', 0.4) +
    // La pastura: el naranja de la tapa, que brilla en el medio y se apaga en la orilla.
    `<ellipse cx="${px}" cy="${py}" rx="${rx}" ry="${ry}" fill="${M.naranjaHonda}" filter="url(#soplo-s)"/>` +
    nube(px, py - 6, rx * 0.86, ry * 0.8, M.naranja, 'l') +
    nube(px - 40, py - 20, rx * 0.5, ry * 0.4, 'var(--bestia-cordero-pezunia)', 'xl', 0.55) +
    `<ellipse cx="${px}" cy="${py}" rx="${rx + 18}" ry="${ry + 14}" fill="none" stroke="${M.negro}" stroke-width="44" filter="url(#soplo-l)" opacity="0.9"/>` +
    crayon() +
    // El círculo pelado que deja la soga: tierra más honda, pisada.
    nube(px, py + 4, 92, 50, M.naranjaHonda, 'm', 0.95) +
    nube(px, py + 8, 70, 34, M.oscuro, 'l', 0.35) +
    // El palo: madera, con la luz del lado izquierdo.
    nube(px + 4, py + 2, 14, 4, M.negro, 's', 0.8) +
    enmascarado('m-palo', `M${px - 4.5} ${py} L${px - 4} ${py - 50} L${px + 4} ${py - 53} L${px + 4.5} ${py} Z`,
      forma(`M${px - 4.5} ${py} L${px - 4} ${py - 50} L${px + 4} ${py - 53} L${px + 4.5} ${py} Z`, M.sombra) +
      nube(px - 3, py - 26, 2, 24, M.claro, 's', 0.7) + nube(px + 4, py - 26, 2.5, 26, M.negro, 's', 0.9))
  );
}

/** Lo de adelante: tiras que tapan al lobo cuando pasa por abajo, y los costados. */
function frenteMonte(): string {
  const { ancho, alto } = ESCENA_ARTE;
  return (
    `<g filter="url(#rociado)">` +
    filaDeTiras(520, alto + 10, M.hondo, M.medio, 31, 'frente-a') +
    filaDeTiras(570, alto + 10, M.oscuro, M.sombra, 37, 'frente-b') +
    filaDeTiras(150, alto + 10, M.oscuro, M.sombra, 41, 'costado-izq', -40, 70) +
    filaDeTiras(170, alto + 10, M.oscuro, M.sombra, 43, 'costado-der', ancho - 70, ancho + 40) +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   El baldío de los techos, en el violeta rayado de *Un baión*
   ------------------------------------------------------------------
   El fondo de la tapa de *Un baión* es crayón: rayones cortos, azules, violetas y lila, que se
   aprietan alrededor de la luz. El baldío es eso de noche, con los techos de chapa recortados
   contra un farol, la medianera y los yuyos.
*/

const B = {
  noche: 'var(--entorno-baion-noche)',
  violeta: 'var(--entorno-baion-violeta)',
  lila: 'var(--entorno-baion-lila)',
  luz: 'var(--entorno-baion-luz)',
  azul: 'var(--entorno-baion-azul)',
  rosa: 'var(--entorno-baion-rosa)',
  negro: 'var(--fondo)',
};

/** Rayones de crayón: cortos, en tandas que apuntan para un mismo lado, como los de la tapa. */
function rayones(x0: number, y0: number, x1: number, y1: number, cuantos: number, colores: readonly string[], semilla: number, haciaX?: number, haciaY?: number): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < cuantos; i++) {
    const x = x0 + rnd() * (x1 - x0);
    const y = y0 + rnd() * (y1 - y0);
    let ang = (rnd() - 0.5) * 1.2 + 0.9;
    if (haciaX !== undefined && haciaY !== undefined) ang = Math.atan2(y - haciaY, x - haciaX) + (rnd() - 0.5) * 0.5;
    const largo = 8 + rnd() * 26;
    const color = colores[Math.floor(rnd() * colores.length)]!;
    s += trazo(`M${x.toFixed(1)} ${y.toFixed(1)} l${(Math.cos(ang) * largo).toFixed(1)} ${(Math.sin(ang) * largo).toFixed(1)}`, color, 2.2 + rnd() * 2.6, 0.5 + rnd() * 0.45);
  }
  return s;
}

function baldioLejos(): string {
  const { ancho, alto } = ESCENA_ARTE;
  const farol = { x: 650, y: 130 };
  // Los techos: chapa a dos aguas y en diente de sierra, con antenas de tele.
  const rnd = azar(61);
  let techos = '';
  let x = -30;
  while (x < ancho + 30) {
    const w = 90 + rnd() * 110;
    const alto0 = 170 + rnd() * 70;
    if (rnd() < 0.5) techos += forma(`M${x} 330 L${x} ${alto0} L${x + w / 2} ${alto0 - 40 - rnd() * 30} L${x + w} ${alto0} L${x + w} 330 Z`, B.negro);
    else {
      let d = `M${x} 330 L${x} ${alto0}`;
      for (let k = 0; k < 4; k++) d += ` L${x + (w / 4) * (k + 0.8)} ${alto0 - 26} L${x + (w / 4) * (k + 1)} ${alto0}`;
      techos += forma(`${d} L${x + w} 330 Z`, B.negro);
    }
    if (rnd() < 0.5) techos += trazo(`M${x + w * 0.6} ${alto0 - 20} l0 -46 M${x + w * 0.6 - 14} ${alto0 - 58} l28 0 M${x + w * 0.6 - 9} ${alto0 - 48} l18 0`, B.negro, 2.2);
    if (rnd() < 0.4) techos += forma(`M${x + w * 0.2} ${alto0 - 8} l0 -34 l16 0 l0 30 Z`, B.negro);
    x += w * (0.85 + rnd() * 0.2);
  }
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${B.noche}"/>` +
    // El cielo rayado, y la luz del farol que aprieta los rayones alrededor.
    rayones(-20, -20, ancho + 20, 300, 900, [B.violeta, B.azul, B.violeta, B.noche, B.lila], 5) +
    nube(farol.x, farol.y, 120, 90, B.lila, 'xl', 0.5) +
    rayones(farol.x - 170, farol.y - 120, farol.x + 170, farol.y + 140, 260, [B.luz, B.lila, B.luz], 9, farol.x, farol.y) +
    nube(farol.x, farol.y, 22, 18, B.luz, 'm') +
    techos +
    // Los cantos de las chapas, tocados por la luz.
    rayones(-20, 180, ancho + 20, 260, 120, [B.lila, B.violeta], 13) +
    // La medianera, con los ladrillos rayados.
    forma(`M-10 300 L${ancho + 10} 300 L${ancho + 10} 392 L-10 392 Z`, B.violeta) +
    rayones(-10, 300, ancho + 10, 392, 260, [B.noche, B.rosa, B.lila], 17) +
    nube(farol.x, 360, 200, 40, B.lila, 'l', 0.35) +
    // El piso del baldío, oscuro, con la luz del farol que cae.
    forma(`M-10 386 L${ancho + 10} 386 L${ancho + 10} ${alto + 10} L-10 ${alto + 10} Z`, B.noche) +
    nube(farol.x - 20, 520, 220, 70, B.violeta, 'xl', 0.9) +
    nube(farol.x - 20, 520, 120, 36, B.lila, 'l', 0.35) +
    rayones(-10, 392, ancho + 10, alto, 700, [B.violeta, B.azul, B.noche, B.noche, B.lila], 21) +
    // Una goma tirada y unos yuyos.
    `<ellipse cx="340" cy="548" rx="34" ry="12" fill="none" stroke="${B.negro}" stroke-width="9"/>` +
    rayones(320, 470, 480, 520, 60, [B.azul, B.lila], 23, 400, 540) +
    `</g>`
  );
}

function baldioFrente(): string {
  const { ancho, alto } = ESCENA_ARTE;
  const rnd = azar(29);
  let yuyos = '';
  for (let x = -10; x < ancho + 10; x += 14 + rnd() * 18) {
    const h = 30 + rnd() * 60;
    yuyos += trazo(`M${x.toFixed(1)} ${alto + 4} q${(rnd() * 10 - 5).toFixed(1)} ${(-h * 0.6).toFixed(1)} ${(rnd() * 18 - 9).toFixed(1)} ${(-h).toFixed(1)}`, rnd() < 0.7 ? B.negro : B.violeta, 2.5 + rnd() * 2.5);
  }
  // Sin grano: en una franja soplada no se ve, y no se deja comprimir.
  return `<g>${soplo(`M-10 ${alto - 30} L${ancho + 10} ${alto - 30} L${ancho + 10} ${alto + 10} L-10 ${alto + 10} Z`, B.negro, 'm', 0.8)}${yuyos}</g>`;
}

/* ------------------------------------------------------------------
   El infierno encantador, en las brasas de *Gulp!*
   ------------------------------------------------------------------ */

const F = {
  negro: 'var(--fondo)',
  brasa: 'var(--entorno-infierno-brasa)',
  rojo: 'var(--disco-gulp-tinta)',
  vivo: 'var(--marca-rojo)',
  fuego: 'var(--entorno-infierno-fuego)',
  oro: 'var(--acento-2)',
  sombra: 'var(--bestia-lobo-oscuro)',
  piedra: 'var(--bestia-lobo-sombra)',
};

/** Una lengua de fuego soplada: rojo afuera, naranja adentro, oro en el corazón. */
function lengua(x: number, base: number, alto: number, ancho: number, rnd: () => number): string {
  const torcida = (rnd() - 0.5) * ancho;
  const d = `M${x - ancho / 2} ${base} Q${x - ancho * 0.6} ${base - alto * 0.5} ${x + torcida} ${base - alto} Q${x + ancho * 0.6} ${base - alto * 0.45} ${x + ancho / 2} ${base} Z`;
  const d2 = `M${x - ancho / 4} ${base} Q${x - ancho * 0.3} ${base - alto * 0.4} ${x + torcida * 0.7} ${base - alto * 0.7} Q${x + ancho * 0.3} ${base - alto * 0.35} ${x + ancho / 4} ${base} Z`;
  return soplo(d, F.vivo, 's', 0.9) + soplo(d2, F.fuego, 's', 0.9) + nube(x, base - alto * 0.15, ancho * 0.18, alto * 0.18, F.oro, 's', 0.8);
}

/**
 * Lo de atrás del infierno: la noche roja y el humo. El fuego no se dibuja acá: es la pincelada
 * de la tapa de *Gulp!* teñida (`recortes.ts`, `infierno-pincelada`), que la escena pone encima.
 */
function infiernoLejos(): string {
  const { ancho, alto } = ESCENA_ARTE;
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${F.negro}"/>` +
    nube(ancho / 2, 250, 520, 170, F.brasa, 'xl', 0.9) +
    [120, 330, 560, 780].map((x, i) => nube(x, 110, 50 + i * 6, 170, F.negro, 'xl', 0.85)).join('') +
    `</g>`
  );
}

/** Lo cercano del infierno: el piso negro, la puerta del salón y la piedra de Luzbelito. */
function infiernoCerca(): string {
  const { ancho, alto } = ESCENA_ARTE;
  return (
    `<g filter="url(#rociado)">` +
    soplo(`M-20 336 C300 322, 600 322, ${ancho + 20} 336 L${ancho + 20} ${alto + 20} L-20 ${alto + 20} Z`, F.negro, 's') +
    nube(ancho / 2, 350, 520, 22, F.brasa, 'l', 0.8) +
    nube(ancho / 2, 520, 300, 90, F.brasa, 'xl', 0.35) +
    // La puerta del salón, encendida por dentro.
    forma('M140 352 L140 262 Q180 214 220 262 L220 352 Z', F.negro) +
    soplo('M152 352 L152 270 Q180 234 208 270 L208 352 Z', F.brasa, 'xs', 0.95) +
    nube(180, 316, 18, 34, F.fuego, 'm', 0.5) +
    // La piedra de Luzbelito: oscura, con el canto rojo del fuego.
    enmascarado('m-piedra', 'M360 470 Q380 404 452 398 Q530 396 548 470 Z',
      forma('M360 470 Q380 404 452 398 Q530 396 548 470 Z', F.piedra) + nube(430, 408, 70, 12, F.rojo, 'm', 0.6) + nube(500, 460, 70, 30, F.negro, 'm', 0.85)) +
    `</g>`
  );
}

function infiernoFrente(): string {
  const { ancho, alto } = ESCENA_ARTE;
  // Piedras negras de adelante, con el canto encendido.
  const rnd = azar(83);
  let piedras = '';
  for (let x = -40; x < ancho + 40; x += 90 + rnd() * 90) {
    const w = 80 + rnd() * 90;
    const h = 30 + rnd() * 50;
    const d = `M${x} ${alto + 10} Q${x + w * 0.2} ${alto - h} ${x + w / 2} ${alto - h - 6} Q${x + w * 0.8} ${alto - h} ${x + w} ${alto + 10} Z`;
    piedras += enmascarado(`m-piedra-frente-${Math.round(x)}`, d, forma(d, F.negro) + nube(x + w * 0.4, alto - h, w * 0.3, 6, F.rojo, 's', 0.6));
  }
  return `<g filter="url(#rociado)">${piedras}</g>`;
}

/** El resplandor de la vela de Luzbelito: se imprime aparte, y la isla lo hace titilar. */
function luzDeVela(): string {
  return `<g>${nube(0, 0, 60, 70, F.oro, 'xl', 0.55)}${nube(0, 0, 24, 30, F.fuego, 'l', 0.5)}</g>`;
}

/* ------------------------------------------------------------------
   El templo de Momo, en el negro y la plata de *Momo Sampler*
   ------------------------------------------------------------------ */

const P = {
  negro: 'var(--fondo)',
  plata: 'var(--disco-momo-sampler-tinta)',
  peltre: 'var(--disco-momo-sampler-apoyo)',
  foco: 'var(--entorno-templo-foco)',
  oro: 'var(--acento-2)',
};

/** Un espiral como los del lomo de la tapa de *Momo Sampler*. */
function espiralPlata(cx: number, cy: number, r: number): string {
  let d = '';
  for (let k = 0; k <= 50; k++) {
    const a = (k / 50) * Math.PI * 4.2;
    const rr = (r * k) / 50;
    d += `${k ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)} `;
  }
  return trazo(d, P.peltre, 3.2) + trazo(d, P.plata, 1.2, 0.8);
}

/** La guirnalda: un cable que cuelga de punta a punta, y los focos sobre el cable. */
export const FOCOS_TEMPLO: ReadonlyArray<readonly [number, number]> = (() => {
  const salida: Array<[number, number]> = [];
  for (const [x0, x1, y0, comba] of [[-20, 460, 70, 70], [440, 920, 70, 70], [100, 800, 150, 90]] as const) {
    for (let k = 1; k < 9; k++) {
      const t = k / 9;
      salida.push([x0 + (x1 - x0) * t, y0 + 4 * comba * t * (1 - t)]);
    }
  }
  return salida;
})();

function temploLejos(): string {
  const { ancho, alto } = ESCENA_ARTE;
  let cables = '';
  for (const [x0, x1, y0, comba] of [[-20, 460, 70, 70], [440, 920, 70, 70], [100, 800, 150, 90]] as const) {
    cables += trazo(`M${x0} ${y0} Q${(x0 + x1) / 2} ${y0 + 2 * comba} ${x1} ${y0}`, P.peltre, 1.6, 0.8);
  }
  const columna = (x: number): string =>
    enmascarado(`m-columna-${x}`, `M${x} -10 L${x + 70} -10 L${x + 70} ${alto + 10} L${x} ${alto + 10} Z`,
      forma(`M${x} -10 L${x + 70} -10 L${x + 70} ${alto + 10} L${x} ${alto + 10} Z`, P.negro) +
      nube(x + 20, alto / 2, 14, alto, P.peltre, 'm', 0.5) +
      [90, 200, 310, 420, 530].map((y) => espiralPlata(x + 35, y, 24)).join(''));
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${P.negro}"/>` +
    // El galpón de luz: la luz cálida de los focos contra el techo, y el piso que la devuelve.
    nube(ancho / 2, 120, 420, 120, P.foco, 'xl', 0.16) +
    nube(ancho / 2, 600, 380, 70, P.peltre, 'xl', 0.45) +
    nube(ancho / 2, 610, 160, 26, P.plata, 'l', 0.3) +
    columna(30) + columna(ancho - 100) +
    cables +
    FOCOS_TEMPLO.map(([x, y]) => trazo(`M${x.toFixed(1)} ${(y - 2).toFixed(1)} l0 8`, P.peltre, 2) + nube(x, y + 12, 26, 26, P.foco, 'l', 0.45) + nube(x, y + 12, 5, 6, P.foco, 'xs', 0.95) + nube(x, y + 11, 2, 2.5, 'var(--papel)', 'xs')).join('') +
    `</g>`
  );
}

function temploFrente(): string {
  const { ancho, alto } = ESCENA_ARTE;
  return `<g>${soplo(`M-10 ${alto - 40} C300 ${alto - 56}, 600 ${alto - 56}, ${ancho + 10} ${alto - 40} L${ancho + 10} ${alto + 10} L-10 ${alto + 10} Z`, P.negro, 'm', 0.9)}</g>`;
}

/** El brillo que le pasa por encima al medallón: una franja soplada, que la isla corre. */
function brilloMedallon(): string {
  return nube(0, 0, 26, 220, P.plata, 'l', 0.55, 20) + nube(0, 0, 8, 200, 'var(--papel)', 'm', 0.5, 20);
}

export const PIEZAS: readonly Pieza[] = [
  { nombre: 'monte-lejos', caja: [0, 0, ESCENA_ARTE.ancho, ESCENA_ARTE.alto], dibujo: monteLejos(), opaca: true, densidad: 2 },
  { nombre: 'monte-cerca', caja: [0, 240, ESCENA_ARTE.ancho, ESCENA_ARTE.alto - 240], dibujo: monteCerca(), densidad: 2 },
  { nombre: 'monte-frente', caja: [0, 0, ESCENA_ARTE.ancho, ESCENA_ARTE.alto], dibujo: frenteMonte(), densidad: 2 },
  { nombre: 'cordero-lomo', caja: [-180, -220, 610, 540], dibujo: lomoCordero(), densidad: 0.55 },
  { nombre: 'baldio-lejos', caja: [0, 0, ESCENA_ARTE.ancho, ESCENA_ARTE.alto], dibujo: baldioLejos(), opaca: true, densidad: 2 },
  { nombre: 'baldio-frente', caja: [0, 520, ESCENA_ARTE.ancho, ESCENA_ARTE.alto - 520], dibujo: baldioFrente(), densidad: 2 },
  { nombre: 'infierno-lejos', caja: [0, 0, ESCENA_ARTE.ancho, ESCENA_ARTE.alto], dibujo: infiernoLejos(), opaca: true, densidad: 2 },
  { nombre: 'infierno-cerca', caja: [0, 300, ESCENA_ARTE.ancho, ESCENA_ARTE.alto - 300], dibujo: infiernoCerca(), densidad: 2 },
  { nombre: 'infierno-frente', caja: [0, 520, ESCENA_ARTE.ancho, ESCENA_ARTE.alto - 520], dibujo: infiernoFrente(), densidad: 2 },
  { nombre: 'luzbelito-luz', caja: [-150, -170, 300, 340], dibujo: luzDeVela(), densidad: 1 },
  { nombre: 'templo-lejos', caja: [0, 0, ESCENA_ARTE.ancho, ESCENA_ARTE.alto], dibujo: temploLejos(), opaca: true, densidad: 2 },
  { nombre: 'templo-frente', caja: [0, 560, ESCENA_ARTE.ancho, ESCENA_ARTE.alto - 560], dibujo: temploFrente(), densidad: 2 },
  { nombre: 'momo-brillo', caja: [-120, -260, 240, 520], dibujo: brilloMedallon(), densidad: 1 },
  // La sexta vuelta: el bajo inundado y el gordo Pierre, pintado a pincel seco (`arte-bajo.ts`).
  ...PIEZAS_BAJO,
  // La vaca cubana, a plumín sobre aguada como el frente de *Un baión* (`arte-vaca.ts`).
  ...PIEZAS_VACA,
];
