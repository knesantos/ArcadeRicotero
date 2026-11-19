/**
 * La fiera más fiera (`D-73`, vigesimonovena vuelta), en su jaula de la prisión, adelante a la derecha.
 *
 * *"Preso como un animal, como un animal feroz. Así las cosas, la fiera más fiera ¿dónde está?"* es de
 * *Toxi-Taxi*, en *La mosca y la sopa* (1991). La jaula estuvo siempre vacía, y sigue: a la fiera no se la dibuja
 * nunca. Pero está. Adentro flota un collar de púas a la altura de un cogote que no se ve, con la chapita girando;
 * la cadena va de la argolla del piso al collar; el hueso tiene mordidas frescas, hay dos huellas en la paja y,
 * donde tendría la boca, se le ve el aliento. La pregunta de la letra queda sin contestar.
 *
 * De la letra son el preso, el animal feroz, la pregunta y el *"cada día veo menos… menos mal"* (por eso no se la
 * ve). Del dibujo, el collar, la chapita, la paja y el bebedero. La jaula, la cadena y el hueso ya estaban en el piso.
 *
 * Viste *La mosca y la sopa*, medida con sharp: el collar es el rojo de la tapa, las púas y la chapita el amarillo
 * del cartel, los barrotes y el hueso el haz del seguidor, y los tajos, el amarillo donde brilla. La jaula va
 * tallada a gubia, como el resto de la prisión.
 *
 * Coordenadas: el (0, 0) es el piso en el medio de la jaula (`rig-fiera.ts`).
 */

import { forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { trazo as talla } from './grabado.ts';
import { conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { ATACA, FIERA, FIERA_ARMADO as A, QUIETO, marcas, type Momento } from './rig-fiera.ts';

const ID = 'la-fiera-mas-fiera';

/** Las tintas de *La mosca y la sopa* (`tokens.css`). */
const C = {
  negro: 'var(--bestia-fiera-negro)',
  rojo: 'var(--bestia-fiera-rojo)',
  rojoHondo: 'var(--bestia-fiera-rojo-hondo)',
  brasa: 'var(--bestia-fiera-brasa)',
  amarillo: 'var(--bestia-fiera-amarillo)',
  amarilloHondo: 'var(--bestia-fiera-amarillo-hondo)',
  haz: 'var(--bestia-fiera-haz)',
  hazClaro: 'var(--bestia-fiera-haz-claro)',
  hazHondo: 'var(--bestia-fiera-haz-hondo)',
};

/* ------------------------------------------------------------------
   La jaula
   ------------------------------------------------------------------ */

const J = A.jaula;
const R = (J.x1 - J.x0) / 2;
/** Dónde arranca cada barrote, debajo de la cúpula. */
const tope = (t: number): number => J.arriba + R * 0.55 * (1 - Math.sin(Math.PI * t));

/** Un barrote, de la punta de la cúpula al piso; `empuje` lo comba a la altura de la boca. */
function barrote(i: number, empuje: number): readonly P[] {
  const t = i / J.barrotes;
  const x = J.x0 + (J.x1 - J.x0) * t;
  const y0 = tope(t) + 10;
  const pts: P[] = [];
  // La cúpula: de la punta al hombro.
  for (let k = 0; k <= 8; k++) {
    const u = k / 8;
    pts.push([x * u * (2 - u), J.arriba - 6 + (y0 - (J.arriba - 6)) * u * u]);
  }
  const { y, alto } = A.comba;
  for (let k = 1; k <= 30; k++) {
    const yy = y0 + ((0 - y0) * k) / 30;
    const d = (yy - y) / (alto / 2);
    pts.push([x + (Math.abs(d) < 1 ? empuje * Math.cos((d * Math.PI) / 2) ** 2 : 0), yy]);
  }
  return pts;
}

/** Los barrotes, los dos aros y la base. Combada, los de al lado de la boca se abren y el aro de arriba se parte. */
function jaula(comba: boolean): string {
  const [b0, b1] = A.comba.barrotes;
  let d = '';
  let filos = '';
  for (let i = 0; i <= J.barrotes; i++) {
    const empuje = !comba ? 0 : i === b0 ? -A.comba.abre : i === b1 ? A.comba.abre : i === b1 + 1 ? A.comba.abre * 0.35 : 0;
    // Los dos del hueco de la puerta llegan hasta el aro de arriba y ahí se cortan.
    const pts = J.hueco.includes(i) ? barrote(i, 0).filter(([, y]) => y <= tope(0) + 8) : barrote(i, empuje);
    d += talla(pts, 5, 430 + i, () => 1);
    if (!J.hueco.includes(i)) filos += talla(pts.slice(12).map(([x, y]): P => [x + 1.5, y]), 1.5, 440 + i);
  }
  const aro = (y: number, s: number): string => talla([[J.x0 - 4, y], [0, y + 1], [J.x1 + 4, y]], 5, s, () => 1);
  // Los dos aros: el de abajo cruza el umbral de la puerta, y se pisa.
  d += aro(-70, 451);
  d += aro(tope(0) + 6, 452);
  d += talla([[J.x0 - 10, 0], [0, 1], [J.x1 + 10, 0]], 12, 460, () => 1);
  const argolla: P[] = [];
  for (let k = 0; k <= 16; k++) argolla.push([Math.cos((k / 16) * Math.PI * 2) * 8, J.arriba - 14 + Math.sin((k / 16) * Math.PI * 2) * 8]);
  // Combada, saltan dos remaches y queda el polvo del golpe.
  const golpe = comba
    ? forma(elipse(-52, -196, 2.6, 2.6), C.haz) + forma(elipse(22, -108, 2.2, 2.2), C.haz) + trazo('M-46 -204 l-10 -12 M-52 -188 l-14 2 M20 -100 l12 8 M28 -112 l12 -6', C.haz, 1.4, 0.9)
    : '';
  return `<g filter="url(#gubia)"><path d="${d}" fill="${C.haz}"/><path d="${filos}" fill="${C.negro}"/><path d="${talla(argolla, 2.6, 461, () => 1)}" fill="${C.haz}"/></g>` + golpe;
}

/** La puerta, abierta para afuera: gira en su bisagra. */
function puerta(): string {
  const { x, arriba, abajo, ancho } = A.puerta;
  let d = '';
  for (let i = 0; i <= 3; i++) d += talla([[x - (ancho * i) / 3, arriba], [x - (ancho * i) / 3, abajo]], 4.4, 490 + i, () => 1);
  for (const y of [arriba, (arriba + abajo) / 2, abajo]) d += talla([[x + 2, y], [x - ancho - 2, y]], 4.4, 495 + y, () => 1);
  // El pasador, colgando: nadie la cerró.
  const pasador = talla([[x - ancho + 8, (arriba + abajo) / 2 + 8], [x - ancho + 10, (arriba + abajo) / 2 + 26]], 3, 500, () => 1);
  return `<g filter="url(#gubia)"><path d="${d + pasador}" fill="${C.haz}"/><path d="${talla([[x - ancho + 1.4, arriba + 6], [x - ancho + 1.6, abajo - 6]], 1.4, 499)}" fill="${C.negro}"/></g>`;
}

/* ------------------------------------------------------------------
   Lo que hay adentro
   ------------------------------------------------------------------ */

/** Una huella: la almohadilla y cuatro dedos con la uña marcada. Grande. */
function huella(x: number, y: number, giro: number): string {
  const dedos = [[-9, -6, -24], [-3.4, -9.4, -8], [3.4, -9.4, 8], [9, -6, 24]].map(([dx, dy, g]) =>
    `<g transform="rotate(${g} ${dx} ${dy})">${forma(elipse(dx!, dy!, 2.8, 3.8), C.hazHondo)}${trazo(`M${dx} ${dy! - 4.4} l0 -3.4`, C.haz, 0.9, 0.9)}</g>`).join('');
  return `<g transform="translate(${x} ${y}) scale(1.5 0.8) rotate(${giro})">${forma(curva([[-7, 4], [-6, -2], [0, -5], [6, -2], [7, 4], [0, 6]]), C.hazHondo)}${dedos}</g>`;
}

/** El piso de la jaula: la paja aplastada donde se echa, dos huellas, el bebedero y la argolla de la cadena. */
function piso(): string {
  const pajas = Array.from({ length: 46 }, (_, i) => {
    const x = -72 + ((i * 53) % 140);
    const y = -9 - ((i * 17) % 30);
    const a = ((i * 37) % 50) - 25;
    const l = 9 + ((i * 7) % 10);
    return `<path d="M${x} ${y} l${l} ${(a / 25) * 4}" fill="none" stroke="${i % 3 ? C.amarilloHondo : C.amarillo}" stroke-width="${i % 4 ? 1 : 1.6}" stroke-linecap="round" opacity="${i % 3 ? 0.75 : 0.95}"/>`;
  }).join('');
  const [ax, ay] = A.argolla;
  return conGrano(
    pajas +
    // El hueco donde se echa: la paja aplastada en redondo.
    nube(18, -22, 30, 8, C.negro, 's', 0.75) +
    huella(-50, -16, -24) + huella(-22, -34, -14) +
    // El bebedero de lata, lleno.
    forma(poli([[24, -30], [21, -46], [57, -46], [54, -30]]), C.hazHondo) + forma(elipse(39, -46, 18, 4.6), C.haz) + forma(elipse(39, -45.6, 15, 3.2), C.negro) +
    nube(35, -45.4, 7, 1.2, C.hazClaro, 'xs', 0.8) + trazo('M24 -37 l30 0', C.negro, 1, 0.6) +
    // La argolla clavada al piso.
    trazo(`M${ax - 6} ${ay + 4} a6 7 0 1 1 12 0`, C.haz, 2.6) + forma(elipse(ax, ay + 5, 9, 2), C.hazHondo),
  );
}

/** Un tramo de cadena, del largo de medio tirón: eslabones gordos, uno de frente y uno de canto. */
function eslabones(): string {
  const largo = A.cadena / 2;
  const n = 6;
  const paso = largo / n;
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = paso * (i + 0.5);
    s += i % 2
      ? trazo(`M${x - paso * 0.62} 0 L${x + paso * 0.62} 0`, C.haz, 3.2) + trazo(`M${x - paso * 0.5} -0.8 L${x + paso * 0.5} -0.8`, C.hazClaro, 0.8, 0.8)
      : `<ellipse cx="${x}" cy="0" rx="${paso * 0.62}" ry="4.2" fill="none" stroke="${C.haz}" stroke-width="2.6"/>` + trazo(`M${x - paso * 0.4} -4 l${paso * 0.5} -0.4`, C.hazClaro, 0.8, 0.8);
  }
  return conGrano(s);
}

/** El collar de púas, visto desde un poco arriba: adentro no hay nadie, y se ve el fondo. */
function collar(): string {
  const [rx, ry] = [27, 10];
  const puas = [-70, -45, -20, 5, 30, 55, 80].map((g) => {
    const a = ((g + 90) * Math.PI) / 180;
    const [x, y] = [Math.cos(a) * rx, Math.sin(a) * ry + 3];
    const [nx, ny] = [Math.cos(a) * 0.9, 0.9];
    return forma(poli([[x - 3.2, y - 1], [x + 3.2, y - 1], [x + nx * 5, y + ny * 9]]), C.amarillo) +
      forma(poli([[x + 0.4, y - 1], [x + 3.2, y - 1], [x + nx * 5, y + ny * 9]]), C.amarilloHondo) + forma(elipse(x, y - 1, 3.4, 1.6), C.haz);
  }).join('');
  return conGrano(
    // La mitad de atrás, por adentro: el cuero en la sombra.
    `<path d="M${-rx} 0 A${rx} ${ry} 0 0 1 ${rx} 0" fill="none" stroke="${C.rojoHondo}" stroke-width="7"/>` +
    trazo(`M${-rx + 5} -4 A${rx} ${ry} 0 0 1 ${rx - 5} -4`, C.negro, 1, 0.7) +
    // La mitad de adelante: el cuero rojo, con el filo de luz, las costuras y las púas.
    `<path d="M${-rx} 0 A${rx} ${ry} 0 0 0 ${rx} 0" fill="none" stroke="${C.rojo}" stroke-width="9"/>` +
    `<path d="M${-rx + 1} -2.6 A${rx} ${ry} 0 0 0 ${rx - 1} -2.6" fill="none" stroke="${C.brasa}" stroke-width="1.6" opacity="0.9"/>` +
    `<path d="M${-rx + 1} 3.4 A${rx} ${ry} 0 0 0 ${rx - 1} 3.4" fill="none" stroke="${C.rojoHondo}" stroke-width="1" stroke-dasharray="2 2.4"/>` +
    puas +
    // La hebilla y la argolla de la cadena.
    forma(poli([[-rx - 3, -5], [-rx + 5, -6], [-rx + 6, 5], [-rx - 2, 6]]), C.haz) + forma(poli([[-rx - 1, -3], [-rx + 3, -3.6], [-rx + 4, 3], [-rx, 3.6]]), C.negro) +
    `<ellipse cx="${A.enganche[0]}" cy="${A.enganche[1] + 3}" rx="3.6" ry="4.4" fill="none" stroke="${C.haz}" stroke-width="2"/>`,
  );
}

/** La chapita con forma de hueso, colgando de su aro: lo que diga, no se alcanza a leer. */
function chapita(): string {
  return conGrano(
    `<circle cx="0" cy="2.6" r="2.4" fill="none" stroke="${C.haz}" stroke-width="1.2"/>` +
    forma(curva([[-6, 6], [-3, 4.6], [3, 4.6], [6, 6], [6.4, 10], [3, 15], [0, 17], [-3, 15], [-6.4, 10]]), C.amarillo) +
    nube(-2, 8, 2.4, 2, C.hazClaro, 'xs', 0.8) + trazo('M-3 9.6 l6 0 M-2.4 12 l4.8 0', C.rojoHondo, 0.9, 0.9) + nube(3.4, 13, 2, 3, C.amarilloHondo, 'xs', 0.8),
  );
}

/** El hueso, con las mordidas frescas en una punta y la baba. */
function hueso(): string {
  const d = curva([[-20, -3], [-17, -8], [-12, -6], [-9, -3], [6, -3.4], [9, -5.4], [11, -3], [13, -5.6], [15, -3.2], [17, -6], [19, -2], [17, 1], [19, 4], [15, 5], [12, 3], [-9, 3], [-12, 6], [-17, 8], [-20, 3], [-17, 0]]);
  return conGrano(
    forma(d, C.haz) + nube(-4, -1.4, 10, 1.2, C.hazClaro, 'xs', 0.9) + nube(0, 2.4, 12, 1.2, C.hazHondo, 'xs', 0.8) +
    // Los dientes marcados y la médula.
    trazo('M8 -1.6 l1.4 3 M11.6 -1 l1.2 2.6 M4.6 -1.4 l1 2.4', C.hazHondo, 0.9, 0.9) + forma(elipse(16.4, -0.6, 1.6, 2), C.rojoHondo) +
    // La baba, que cuelga.
    trazo('M10 4 q0.6 5 -0.6 8', C.hazClaro, 1, 0.75) + forma(elipse(9.4, 12.6, 1.1, 1.5), C.hazClaro, 0.8),
  );
}

/** El aliento: tres rayas de vaho talladas a gubia, como el resto de la prisión. Nada soplado. */
function aliento(): string {
  const d = talla([[10, -5], [-4, -9], [-20, -7]], 3, 611) + talla([[12, 2], [-6, 1], [-26, 3]], 3.6, 612) + talla([[10, 9], [-2, 12], [-16, 11]], 2.6, 613);
  return `<rect x="-30" y="-22" width="60" height="44" fill="none"/><g filter="url(#gubia)"><path d="${d}" fill="${C.haz}"/></g>`;
}

/** Los cuatro tajos: la zarpa, tallada a gubia. Tinta plana, canto roto, y las astillas que saltan. */
function tajos(): string {
  const uno = (dx: number, largo: number, s: number, semilla: number): string => {
    const [x0, y0] = [30 + dx, -226 + s];
    const [x1, y1] = [x0 - largo * 0.62, y0 + largo];
    return talla([[x0, y0], [x0 - largo * 0.2 + 3, y0 + largo * 0.34], [x0 - largo * 0.44 + 2, y0 + largo * 0.7], [x1, y1]], 7, semilla);
  };
  const astillas = talla([[-70, -112], [-78, -100]], 2.6, 621) + talla([[-44, -96], [-48, -84]], 2.2, 622) + talla([[52, -214], [60, -224]], 2.4, 623) + talla([[-86, -128], [-94, -124]], 2, 624);
  return `<g filter="url(#gubia)"><path d="${uno(-44, 104, 12, 601) + uno(-18, 124, 0, 602) + uno(8, 124, 4, 603) + uno(34, 100, 18, 604)}" fill="${C.amarillo}"/><path d="${astillas}" fill="${C.haz}"/></g>`;
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const CAJA_JAULA = [J.x0 - 24, J.arriba - 28, J.x1 - J.x0 + 48, -J.arriba + 40] as const;
const PU = A.puerta;

export const PIEZAS_FIERA: readonly Pieza[] = [
  { nombre: 'fiera-piso', caja: [-84, -56, 168, 60], dibujo: piso(), densidad: 2.6 },
  { nombre: 'fiera-cadena', caja: [-4, -7, A.cadena / 2 + 8, 14], dibujo: eslabones(), densidad: 3 },
  { nombre: 'fiera-collar', caja: [-36, -16, 72, 40], dibujo: collar(), densidad: 4 },
  { nombre: 'fiera-chapita', caja: [-8, -1, 16, 20], dibujo: chapita(), densidad: 5 },
  { nombre: 'fiera-hueso', caja: [-23, -10, 46, 26], dibujo: hueso(), densidad: 5 },
  { nombre: 'fiera-aliento', caja: [-30, -22, 60, 44], dibujo: aliento(), densidad: 2 },
  { nombre: 'fiera-jaula', caja: CAJA_JAULA, dibujo: jaula(false), densidad: 2 },
  { nombre: 'fiera-combada', caja: CAJA_JAULA, dibujo: jaula(true), densidad: 2 },
  { nombre: 'fiera-puerta', caja: [PU.x - PU.ancho - 8, PU.arriba - 8, PU.ancho + 16, PU.abajo - PU.arriba + 16], dibujo: puerta(), densidad: 2 },
  { nombre: 'fiera-tajos', caja: [-100, -250, 170, 170], dibujo: tajos(), densidad: 2 },
];

const img = imagenesDe(PIEZAS_FIERA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** La jaula armada con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    parte('jaula',
      img('fiera-piso') +
      parte('cadena-1', img('fiera-cadena'), t['cadena-1']) +
      parte('cadena-2', img('fiera-cadena'), t['cadena-2']) +
      parte('hueso', img('fiera-hueso'), t.hueso) +
      parte('collar', img('fiera-collar') + parte('chapita', img('fiera-chapita'), t.chapita), t.collar) +
      parte('aliento', img('fiera-aliento'), t.aliento, o.aliento) +
      parte('barrotes', img('fiera-jaula'), '', o.barrotes) +
      parte('combada', img('fiera-combada'), '', o.combada) +
      parte('puerta', img('fiera-puerta'), t.puerta),
      t.jaula) +
    parte('tajos', img('fiera-tajos'), t.tajos, o.tajos)
  );
}

/** La jaula en un momento, sin lo que la hace tocable: para el test, el retrato y para mirarla. */
export function fieraEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** Un rectángulo sin tinta del tamaño de la jaula: se toca entera, también por entre los barrotes. */
const TOQUE = `<rect x="${J.x0 - 10}" y="${J.arriba - 20}" width="${J.x1 - J.x0 + 20}" height="${-J.arriba + 24}" fill="transparent"/>`;

function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--fiera" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'La fiera más fiera'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${TOQUE}${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: los barrotes combados, los tajos y el collar en la punta de la cadena. */
export const RETRATO = { caja: [FIERA.x - 150, FIERA.piso - 348, 260, 352] as const };
function retrato(): string {
  return `<image href="/bestiario/prision-lejos.webp" x="-250" y="0" width="1400" height="640" preserveAspectRatio="none"/>` + fieraEn(ATACA);
}

export const FIERA_PERSONAJE: Personaje = {
  id: ID,
  region: 'la-prision',
  ancla: FIERA.x,
  piezas: PIEZAS_FIERA,
  capas: { delante: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
