/**
 * El esclavo encadenado (`D-73`, vigesimoprimera vuelta), arrodillado adelante de la celda de los reos
 * en la prisión de Barbazul, rompiendo las cadenas.
 *
 * Pedido del usuario, con la imagen: *"Diseña e implementa una bestia del bestiario redondo que sea
 * esta, usa la imagen de base, es uno de los de la tapa de oktubre, es importante."* Es la figura de
 * Rocambole que todo el mundo asocia con *Oktubre* —la misma que está en la portada del sitio
 * (`public/arte/oktubre-cadena.png`)—, así que **no se redibuja**: es el estarcido que trajo el
 * usuario, cortado en piezas como un títere de papel (`rig-encadenado.ts`). La imprenta mete el máster
 * preparado (`href="master:…"`, `scripts/preparar-encadenado.mjs`) adentro de cada pieza, la recorta
 * con su polígono y la tiñe: lo blanco en el papel de las caras talladas del frente
 * (`--bestia-dracula-papel`), lo negro en la tinta del fondo. Lo único dibujado acá es la chispa del
 * eslabón que salta, en el rojo de las banderas (`--disco-oktubre-tinta`).
 *
 * De qué disco sale **no se afirma** (`public/arte/README.md`, `INV-02`): la ficha lo cuenta como
 * leyenda. Vive en la prisión porque la prisión es de *Oktubre*, y porque el tema de su verso,
 * *"Preso en mi ciudad"*, es de ese disco.
 */

import { imagenesDe, type Pieza } from './aerografo.ts';
import { CORTES, ENCADENADO, HUECOS, MASTER, QUIETO, marcas, type Corte, type Momento, type Punto } from './rig-encadenado.ts';
import type { Personaje } from './elenco.ts';

const ID = 'el-esclavo-encadenado';

const puntos = (p: readonly Punto[]): string => p.map(([x, y]) => `${x},${y}`).join(' ');

/** La caja de un corte: lo que ocupa su polígono, con un poco de aire, adentro del máster. */
function cajaDe(p: readonly Punto[]): [number, number, number, number] {
  const xs = p.map(([x]) => x);
  const ys = p.map(([, y]) => y);
  const x0 = Math.max(0, Math.min(...xs) - 2);
  const y0 = Math.max(0, Math.min(...ys) - 2);
  const x1 = Math.min(MASTER.ancho, Math.max(...xs) + 2);
  const y1 = Math.min(MASTER.piso + 1, Math.max(...ys) + 2);
  return [x0, y0, x1 - x0, y1 - y0];
}

/**
 * El estarcido teñido: la luminosidad del máster dice dónde va el papel, y su alfa (la silueta maciza)
 * dónde va la tinta. Así el negro de adentro de la figura tapa lo de atrás.
 */
const TINTA =
  `<filter id="tinta-encadenado" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">` +
  `<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.299 0.587 0.114 0 0" result="luz"/>` +
  `<feComposite in="luz" in2="SourceAlpha" operator="in" result="lineas"/>` +
  `<feFlood flood-color="var(--bestia-dracula-papel)"/><feComposite in2="lineas" operator="in" result="papel"/>` +
  `<feFlood flood-color="var(--fondo)"/><feComposite in2="SourceAlpha" operator="in" result="tinta"/>` +
  `<feMerge><feMergeNode in="tinta"/><feMergeNode in="papel"/></feMerge></filter>`;

const ESTARCIDO = `<image href="master:esclavo-encadenado-silueta" x="0" y="0" width="${MASTER.ancho}" height="${MASTER.alto}" filter="url(#tinta-encadenado)"/>`;

/** Una pieza: el estarcido, recortado por su polígono. */
const recortada = (poli: readonly Punto[]): string =>
  `${TINTA}<clipPath id="corte"><polygon points="${puntos(poli)}"/></clipPath><g clip-path="url(#corte)">${ESTARCIDO}</g>`;

/** El cuerpo: el estarcido entero menos los huecos de las piezas que se mueven. */
const cuerpo = (): string =>
  `${TINTA}<mask id="sin-piezas" maskUnits="userSpaceOnUse" x="0" y="0" width="${MASTER.ancho}" height="${MASTER.alto}">` +
  `<rect width="${MASTER.ancho}" height="${MASTER.alto}" fill="white"/>` +
  HUECOS.map((h) => `<polygon points="${puntos(h)}" fill="black"/>`).join('') +
  `</mask><g mask="url(#sin-piezas)">${ESTARCIDO}</g>`;

/** El nombre de la imagen de cada corte. */
const nombre = (c: Corte | 'cuerpo'): string => `encadenado-${c}`;

/** Un píxel del máster, un píxel impreso: más fino no tiene de dónde sacar. */
const D = 1;

export const PIEZAS_ENCADENADO: readonly Pieza[] = [
  { nombre: nombre('cuerpo'), caja: [60, 100, 350, MASTER.piso + 1 - 100], dibujo: cuerpo(), densidad: D },
  ...(Object.keys(CORTES) as Corte[]).map((c) => ({ nombre: nombre(c), caja: cajaDe(CORTES[c]), dibujo: recortada(CORTES[c]), densidad: D })),
];

const img = imagenesDe(PIEZAS_ENCADENADO);

/** La chispa del eslabón que salta: rayas de papel y el rojo de las banderas en el medio. */
function chispa(): string {
  const rayos = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 + 0.3;
    const [r0, r1] = i % 2 ? [9, 30] : [7, 44];
    const p = (r: number): string => `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
    return `M${p(r0)} L${p(r1)}`;
  }).join(' ');
  return `<path d="${rayos}" class="bt-encadenado-rayo"/><path d="M0 -10 L4 -3 L11 0 L4 3 L0 10 L-4 3 L-11 0 L-4 -3 Z" class="bt-encadenado-chispa"/>`;
}

/** El esclavo armado en un momento, con todo lo de adentro en píxeles del máster. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const parte = (n: string, cuerpo: string): string =>
    `<g data-parte="${n}" transform="${t[n]}"${o[n] !== undefined ? ` opacity="${o[n]}"` : ''}>${cuerpo}</g>`;
  return parte(
    'torso',
    parte('cadena-baja', img(nombre('cadena-baja'))) +
      img(nombre('cuerpo')) +
      parte('puno', img(nombre('puno'))) +
      parte('cabeza', img(nombre('cabeza'))) +
      parte(
        'antebrazo',
        parte('cadena-alta', img(nombre('cadena-alta'))) +
          parte('cadena-punta', img(nombre('cadena-punta'))) +
          img(nombre('antebrazo')) +
          parte('chispa', chispa()),
      ),
  );
}

/** El esclavo en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function encadenadoEn(m: Momento = QUIETO): string {
  return armado(m);
}

/** La sombra en el piso, debajo de las rodillas. */
const SOMBRA = `<ellipse cx="${ENCADENADO.x}" cy="${ENCADENADO.piso + 2}" rx="${Math.round(170 * ENCADENADO.escala)}" ry="6" class="bt-encadenado-sombra" pointer-events="none"/>`;

/** El títere que se toca, en la pose del dibujo. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    SOMBRA +
    `<g class="titere titere--encadenado" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El esclavo encadenado'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: el dibujo entero, quieto, en píxeles del máster. */
export const RETRATO = { caja: [-4, -4, MASTER.ancho + 8, MASTER.piso + 8] as const };

export const ENCADENADO_PERSONAJE: Personaje = {
  id: ID,
  region: 'la-prision',
  ancla: ENCADENADO.x,
  piezas: PIEZAS_ENCADENADO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: () => encadenadoEn(QUIETO) },
};
