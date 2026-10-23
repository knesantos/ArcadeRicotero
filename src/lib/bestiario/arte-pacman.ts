/**
 * El pac-man (`D-73`, decimoséptima vuelta), comiendo puntos en la nieve de Cybersiberia.
 *
 * *"Nuestro pac-man no es de nadie, / y todo el hambre del nuevo pac-man"* es de *Un Pac-Man en el
 * Savoy*, de *¡Bang! ¡Bang! Estás liquidado* (1989). La estampa ya lo decía: es el único bicho del mapa
 * que nació en un fichín. Por eso **es el único del bestiario que no está soplado: es pixel**, en las
 * tintas del fichín (`--px-*`, la hoja 14 del lienzo), las mismas del mueble de Skayboy y Poligirl. Pixel
 * adentro, imprenta afuera (`D-41`): lo que le pasa alrededor sí es aerógrafo, el resplandor que larga en
 * la nieve, como larga luz la tele grande. Es el intruso de la escena, y está bien que se note.
 *
 * Viene con lo suyo: la fila de puntos, la pastilla de poder en la punta y un fantasma que lo persigue.
 * Cada cuadro de pixel es un camino de celdas (`CELDA`), con `shape-rendering: crispEdges`.
 *
 * Todo va en las coordenadas del recinto (`rig-pacman.ts`).
 */

import { forma, imagenesDe, nube, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import {
  ANCLA, BOCAS, CARA_ASUSTADA, CELDA, CHISPA, DOSCIENTOS, FANTASMA, HAMBRE, MUERTE, OJOS, PASILLO, PASTILLA, PUNTO, PUNTOS, PUPILAS, QUIETA,
  marcas, medida, type Cuadro, type Momento,
} from './rig-pacman.ts';

const f = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Las tintas del aerógrafo de alrededor: la luz del pac-man, y la de la tele que rebota en el fantasma. */
const C = {
  oro: 'var(--px-tesoro)',
  lente: 'var(--entorno-cyber-lente)',
  nieve: 'var(--entorno-cyber-nieve)',
};

/* ------------------------------------------------------------------
   El pixel: de un cuadro a un camino de celdas
   ------------------------------------------------------------------ */

/** El camino de las celdas prendidas de un cuadro, centrado en el (0, 0). */
export function celdas(c: Cuadro, [ox, oy]: readonly [number, number] = [0, 0]): string {
  const [w, h] = medida(c);
  let d = '';
  c.forEach((fila, j) => {
    for (let i = 0; i < fila.length; i++) {
      if (fila[i] !== '#') continue;
      d += `M${f((i - w / 2) * CELDA + ox)} ${f((j - h / 2) * CELDA + oy)}h${CELDA}v${CELDA}h-${CELDA}Z`;
    }
  });
  return d;
}

const pixel = (c: Cuadro, clase: string, desde: readonly [number, number] = [0, 0]): string => `<path d="${celdas(c, desde)}" class="${clase}"/>`;

/* ------------------------------------------------------------------
   Lo impreso: los resplandores en la nieve
   ------------------------------------------------------------------ */

/** El resplandor del pac-man en la nieve: oro soplado, más fuerte abajo, donde pega en el piso. */
function halo(): string {
  return nube(0, 0, 34, 26, C.oro, 'xl', 0.5) + nube(0, 18, 30, 6, C.oro, 'l', 0.55) + nube(0, 19, 16, 3, C.nieve, 'm', 0.35);
}

/** El del fantasma: la luz celeste de la tele, que lo recorta contra la nieve. */
function haloFantasma(): string {
  return nube(0, 0, 32, 28, C.lente, 'xl', 0.45) + nube(0, 20, 28, 5, C.lente, 'l', 0.5);
}

/** El brillo de cada punto: un soplo chico de oro, como los agujeros de la tapa que se prenden. */
function brillo(): string {
  return nube(0, 0, 7, 5, C.oro, 'm', 0.55) + forma(`M-1 0 a1 1 0 1 0 2 0 a1 1 0 1 0 -2 0 Z`, C.oro, 0.6);
}

export const PIEZAS_PACMAN: readonly Pieza[] = [
  { nombre: 'pacman-halo', caja: [-70, -60, 140, 110], dibujo: halo(), densidad: 1.2 },
  { nombre: 'pacman-halo-fantasma', caja: [-66, -60, 132, 110], dibujo: haloFantasma(), densidad: 1.2 },
  { nombre: 'pacman-brillo', caja: [-18, -14, 36, 28], dibujo: brillo(), densidad: 1.6 },
];

const img = imagenesDe(PIEZAS_PACMAN);

/* ------------------------------------------------------------------
   El títere
   ------------------------------------------------------------------ */

const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El pac-man, el fantasma, la fila de puntos y la pastilla, armados con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const y = PASILLO.y;
  const puntos = PUNTOS.map((x, i) =>
    parte(`punto-${i + 1}`, `<g transform="translate(${x} ${y})">${img('pacman-brillo')}${pixel(PUNTO, 'bt-pacman-punto')}</g>`, '', o[`punto-${i + 1}`]),
  ).join('');
  const pastilla = parte('pastilla', `<g transform="translate(${PASILLO.pastilla} ${y})"><g transform="scale(1.8)">${img('pacman-brillo')}</g>${pixel(PASTILLA, 'bt-pacman-punto')}</g>`, '', o.pastilla);
  // Las caras van en la grilla del fantasma (14 × 14), desde arriba.
  const enLaGrilla = (c: Cuadro): readonly [number, number] => [0, -((14 - c.length) * CELDA) / 2];
  const cara = pixel(CARA_ASUSTADA, 'bt-pacman-cara', enLaGrilla(CARA_ASUSTADA));
  const fantasma = parte('fantasma',
    parte('halo-fantasma', img('pacman-halo-fantasma'), '', o['halo-fantasma']) +
    ([0, 1] as const).map((n) =>
      parte(`fantasma-rojo-${n}`, pixel(FANTASMA[n], 'bt-pacman-rojo'), '', o[`fantasma-rojo-${n}`]) +
      parte(`fantasma-azul-${n}`, pixel(FANTASMA[n], 'bt-pacman-azul') + cara, '', o[`fantasma-azul-${n}`]) +
      parte(`fantasma-blanco-${n}`, pixel(FANTASMA[n], 'bt-pacman-blanco') + pixel(CARA_ASUSTADA, 'bt-pacman-cara-titila', enLaGrilla(CARA_ASUSTADA)), '', o[`fantasma-blanco-${n}`]),
    ).join('') +
    parte('ojos', pixel(OJOS, 'bt-pacman-ojo', enLaGrilla(OJOS)) + parte('pupilas', pixel(PUPILAS, 'bt-pacman-pupila', enLaGrilla(PUPILAS)), t.pupilas), '', o.ojos),
    t.fantasma, o.fantasma);
  const pacman = parte('pacman',
    img('pacman-halo') +
    BOCAS.map((c, i) => parte(`boca-${i}`, pixel(c, 'bt-pacman-amarillo'), '', o[`boca-${i}`])).join('') +
    MUERTE.map((c, i) => parte(`muere-${i + 1}`, pixel(c, 'bt-pacman-amarillo'), '', o[`muere-${i + 1}`])).join('') +
    parte('chispa', pixel(CHISPA, 'bt-pacman-amarillo'), '', o.chispa),
    t.pacman, o.pacman);
  const puntaje = parte('puntaje', pixel(DOSCIENTOS, 'bt-pacman-puntaje'), t.puntaje, o.puntaje);
  return puntos + pastilla + fantasma + pacman + puntaje;
}

/** El pac-man en cualquier momento, sin lo que lo hace tocable: para el test y para el retrato. */
export function pacmanEn(m: Momento = QUIETA): string {
  return armado(m);
}

/** El títere que se toca, en la pose quieta: con la fila entera para comer. Se toca todo el pasillo. */
function titere(nombres: ReadonlyMap<string, string>): string {
  const [x0, x1] = [PASILLO.desde - 22, PASILLO.hasta + 22];
  return (
    `<g class="titere titere--pacman" data-id="el-pac-man" role="button" tabindex="0" aria-label="${nombres.get('el-pac-man') ?? 'El pac-man'}">` +
    `<rect x="${x0}" y="${PASILLO.y - 28}" width="${x1 - x0}" height="56" class="bt-pacman-toque"/>` +
    armado(QUIETA) +
    `</g>`
  );
}

/** El retrato de la ficha: con todo el hambre, detrás del fantasma asustado, sobre su pedazo de nieve. */
export const RETRATO = { caja: [HAMBRE.pac.x - 54, PASILLO.y - 62, 172, 96] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('cyber-lejos') + fondo('cyber-piso') + `<g class="bt-pacman-retrato">${pacmanEn(HAMBRE)}</g>`;
}

export const PACMAN: Personaje = {
  id: 'el-pac-man',
  region: 'cybersiberia',
  ancla: ANCLA,
  piezas: PIEZAS_PACMAN,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
