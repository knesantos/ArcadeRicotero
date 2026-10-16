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

const M = {
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

function azar(semilla: number): () => number {
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

function filaDeTiras(arriba: number, abajo: number, cuerpo: string, luz: string, semilla: number, prefijo: string, desde = -20, hasta = ESCENA_ARTE.ancho + 20): string {
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
  const { x: px, y: py } = PALO_ARTE;
  const { rx, ry } = PASTURA_ARTE;
  return (
    `<g filter="url(#rociado)">` +
    soplo(`M-40 300 C200 286, 700 286, ${ancho + 40} 300 L${ancho + 40} ${alto + 40} L-40 ${alto + 40} Z`, M.oscuro, 'm') +
    soplo(`M-40 318 C200 306, 700 306, ${ancho + 40} 318 L${ancho + 40} ${alto + 40} L-40 ${alto + 40} Z`, M.oscuro, 's') +
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
      nube(px - 3, py - 26, 2, 24, M.claro, 's', 0.7) + nube(px + 4, py - 26, 2.5, 26, M.negro, 's', 0.9)) +
    `</g>`
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

export const PIEZAS: readonly Pieza[] = [
  { nombre: 'monte-lejos', caja: [0, 0, ESCENA_ARTE.ancho, ESCENA_ARTE.alto], dibujo: monteLejos(), opaca: true, densidad: 2 },
  { nombre: 'monte-cerca', caja: [0, 240, ESCENA_ARTE.ancho, ESCENA_ARTE.alto - 240], dibujo: monteCerca(), densidad: 2 },
  { nombre: 'monte-frente', caja: [0, 0, ESCENA_ARTE.ancho, ESCENA_ARTE.alto], dibujo: frenteMonte(), densidad: 2 },
  { nombre: 'cordero-lomo', caja: [-180, -220, 610, 540], dibujo: lomoCordero(), densidad: 0.55 },
];
