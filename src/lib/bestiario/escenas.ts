/**
 * Los recintos con protagonista de tapa (`D-73`, quinta vuelta): el baldío del perro de *Un
 * baión*, el infierno de Luzbelito y el templo del medallón de Momo.
 *
 * Mismo régimen que el monte (`escena-monte.ts`): el entorno es inventado en la estética del
 * disco y se imprime a aerógrafo (`arte.ts`); el protagonista es el recorte de su tapa
 * (`recortes.ts`) y lo mueve la isla; los demás bichos del recinto, de noche, son ojos que miran
 * desde lo oscuro. El fuego del infierno es la pincelada de la tapa de *Gulp!*, teñida.
 */

import { imagen, pierre } from './titeres.ts';
import { ARMADO } from './recortes.ts';
import { BAJO, ESCENA, LUZBELITO, MOMO, PERRO, PIERRE, llamaEnEscena } from './rig.ts';
import { agujero } from './arte-bajo.ts';

export { LUZBELITO, MOMO, PERRO, PIERRE };

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

export type Tinta = 'oro' | 'papel' | 'rojo';

/**
 * Un par de ojos que miran desde lo oscuro: tocables, y parpadean. En el agua (`D-73`, sexta
 * vuelta) llevan su reflejo abajo, apagado y estirado, que parpadea con ellos.
 */
export function ojos(id: string, nombre: string, x: number, y: number, tinta: Tinta, enElAgua = false): string {
  const clase = `ojos-${tinta}`;
  const par = (dy: number, ry: number, extra = ''): string =>
    `<ellipse cx="${x - 6}" cy="${y + dy}" rx="3.2" ry="${ry}" class="${clase}${extra}"/><ellipse cx="${x + 6}" cy="${y + dy}" rx="3.2" ry="${ry}" class="${clase}${extra}"/>`;
  return (
    `<g class="bestia bestia--ojos" data-id="${id}" data-x="${x}" data-y="${y}" role="button" tabindex="0" aria-label="${nombre}">` +
    `<circle class="toque" cx="${x}" cy="${y}" r="26"/>` +
    `<g class="cuerpo">${par(0, 2.4)}${enElAgua ? par(9, 4, ' ojos-reflejo') : ''}</g>` +
    `<g class="marca-anotada" transform="translate(${x + 14} ${y - 12})"><circle r="6" class="b-pp b-borde"/><path d="M-3 0 l2 2.5 l4 -5" class="b-tz" stroke-width="2"/></g>` +
    `</g>`
  );
}

const losOjos = (vecinos: Readonly<Record<string, readonly [number, number, Tinta]>>, nombres: ReadonlyMap<string, string>, enElAgua?: (y: number) => boolean): string =>
  `<g class="ojos-del-recinto">${Object.entries(vecinos)
    .map(([id, [x, y, t]]) => ojos(id, nombres.get(id) ?? id, x, y, t, enElAgua?.(y) ?? false))
    .join('')}</g>`;

const titere = (clase: string, id: string, nombre: string, cuerpo: string, transform: string): string =>
  `<g class="titere ${clase}" data-id="${id}" role="button" tabindex="0" aria-label="${nombre}" transform="${transform}">${cuerpo}</g>`;

const parte = (nombre: string, cuerpo: string): string => `<g data-parte="${nombre}">${cuerpo}</g>`;

/* ------------------------------------------------------------------
   El baldío: ese perro que sigue allí
   ------------------------------------------------------------------ */

export const VECINOS_DEL_BALDIO: Readonly<Record<string, readonly [number, number, Tinta]>> = {
  'el-gato-maton': [300, 206, 'oro'],
  'el-raton': [344, 252, 'papel'],
  'el-gato-de-susanita': [476, 192, 'oro'],
  'susanita': [520, 238, 'papel'],
  'el-gato-que-llamas-con-silbidos': [762, 214, 'oro'],
  'el-negro-atila': [610, 168, 'papel'],
  'limon': [150, 196, 'papel'],
  'el-que-no-se-cayo-del-cielo': [862, 252, 'papel'],
  'mi-perro-dinamita': [626, 478, 'oro'],
  'los-perros-sin-folleto': [790, 560, 'oro'],
  'el-perro-manso': [470, 584, 'papel'],
  'el-perro-que-no-mira-el-cielo': [384, 468, 'papel'],
};

export function escenaBaldio(nombres: ReadonlyMap<string, string>): string {
  const [bx, by] = ARMADO.perro.borde;
  return (
    imagen('baldio-lejos') +
    losOjos(VECINOS_DEL_BALDIO, nombres) +
    titere(
      'titere--perro',
      'ese-perro-que-sigue-alli',
      nombres.get('ese-perro-que-sigue-alli') ?? '',
      parte('boca', imagen('perro-real-boca')) + parte('mandibula', imagen('perro-real-mandibula')) + parte('cabeza', imagen('perro-real-cabeza')),
      `translate(${PERRO.x} ${PERRO.y}) scale(${PERRO.escala}) translate(${-bx} ${-by})`,
    ) +
    `<g pointer-events="none">${imagen('baldio-frente')}</g>`
  );
}

/* ------------------------------------------------------------------
   El infierno: Luzbelito y su vela
   ------------------------------------------------------------------ */

export const VECINOS_DEL_INFIERNO: Readonly<Record<string, readonly [number, number, Tinta]>> = {
  'el-diablo-mas-veloz': [706, 292, 'rojo'],
  'zippo': [826, 392, 'oro'],
  'el-diablo-que-mea-en-todas-partes': [268, 300, 'rojo'],
  'el-diablo-de-muchos-cuernos': [180, 290, 'oro'],
  'mandinga': [612, 540, 'rojo'],
};

export function escenaInfierno(nombres: ReadonlyMap<string, string>): string {
  const [px, py] = ARMADO.luzbelito.piso;
  const luz = llamaEnEscena();
  return (
    imagen('infierno-lejos') +
    // El fuego: la pincelada de *Gulp!*, teñida, que se suma a lo oscuro como luz.
    `<g class="infierno-fuego" transform="translate(-30 -330) scale(1)">${imagen('infierno-pincelada')}</g>` +
    imagen('infierno-cerca') +
    `<g class="luz-de-vela" data-x="${f(luz.x)}" data-y="${f(luz.y)}" transform="translate(${f(luz.x)} ${f(luz.y)})">${imagen('luzbelito-luz')}</g>` +
    losOjos(VECINOS_DEL_INFIERNO, nombres) +
    titere(
      'titere--luzbelito',
      'luzbelito',
      nombres.get('luzbelito') ?? '',
      parte('busto', imagen('luzbelito-real-busto') + parte('llama', imagen('luzbelito-real-llama'))),
      `translate(${LUZBELITO.x} ${LUZBELITO.y}) scale(${LUZBELITO.escala}) translate(${-px} ${-py})`,
    ) +
    `<g pointer-events="none">${imagen('infierno-frente')}</g>`
  );
}

/* ------------------------------------------------------------------
   El templo: el medallón de Momo
   ------------------------------------------------------------------ */

export const VECINOS_DEL_TEMPLO: Readonly<Record<string, readonly [number, number, Tinta]>> = {
  'el-santo-fumador': [164, 300, 'papel'],
  'los-gallos-sofocados': [742, 520, 'oro'],
  'marita-la-virgencita': [300, 470, 'papel'],
  'la-polilla': [604, 150, 'papel'],
  'la-murga-de-los-renegados': [212, 560, 'papel'],
  'el-morta': [652, 440, 'oro'],
  'mister-ed-y-huesito': [562, 560, 'papel'],
  'el-doctor-saturno': [796, 300, 'papel'],
  'el-sheriff': [124, 520, 'oro'],
  'la-bailarina': [384, 562, 'papel'],
};

export function escenaTemplo(nombres: ReadonlyMap<string, string>): string {
  const [ax, ay] = ARMADO.momo.argolla;
  const [cx, cy] = ARMADO.momo.centro;
  const r = ARMADO.momo.radio;
  const medallon =
    `<clipPath id="corte-medallon"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>` +
    parte('medallon', imagen('momo-real-medallon') + `<g clip-path="url(#corte-medallon)"><g data-parte="brillo" transform="translate(${cx - 400} ${cy}) scale(1.6)">${imagen('momo-brillo')}</g></g>`);
  return (
    imagen('templo-lejos') +
    losOjos(VECINOS_DEL_TEMPLO, nombres) +
    `<g class="titere titere--momo" data-id="momo" role="button" tabindex="0" aria-label="${nombres.get('momo') ?? ''}">` +
    `<g data-parte="pendulo">` +
    `<path d="M${MOMO.cuelga.x} ${MOMO.cuelga.y} L${MOMO.argolla.x} ${MOMO.argolla.y}" class="bt-trazo-cordon" stroke-width="2.4"/>` +
    `<g transform="translate(${MOMO.argolla.x} ${MOMO.argolla.y}) scale(${MOMO.escala}) translate(${-ax} ${-ay})">${medallon}</g>` +
    `</g></g>` +
    `<g pointer-events="none">${imagen('templo-frente')}</g>`
  );
}

/* ------------------------------------------------------------------
   El bajo inundado: el gordo Pierre (sexta vuelta)
   ------------------------------------------------------------------
   Pierre no es de tapa: está pintado a pincel seco en la estética de *Gulp!* (`arte-bajo.ts`).
   Capas, de atrás para adelante: la sala (`bajo-lejos`), el agua (`bajo-agua`), el chorro que
   entra por el vidrio roto y la lluvia de la calle (vivos, en la isla), Pierre, otra vez el agua
   pero cortada donde lo toca —le tapa la panza de abajo—, su reflejo dado vuelta en tiras, las
   ondas, los ojos de los demás y lo que flota adelante (`bajo-frente`).
*/

export const VECINOS_DEL_BAJO: Readonly<Record<string, readonly [number, number, Tinta]>> = {
  'el-amorcito-que-mordio-el-vidrio': [646, 182, 'papel'],
  'el-ahogado-y-su-fiel-fantasma': [330, 506, 'papel'],
  'los-nenes-de-oro': [722, 462, 'oro'],
  'el-polizon-del-remolque': [252, 604, 'papel'],
  'el-rato-molhado': [92, 452, 'oro'],
  'los-naufragos': [596, 560, 'papel'],
  'las-sirenas': [862, 420, 'oro'],
  'la-anguila': [826, 598, 'rojo'],
};

/**
 * Por dónde cae el agua que entra por el agujero: cada hilo sale del canto de abajo del vidrio
 * roto (corrido del centro del agujero) y cae por la puerta hasta el agua, abriéndose un poco.
 */
export const CHORRO: ReadonlyArray<readonly [number, number, number]> = [
  [-14, 30, -8],
  [-6, 34, 2],
  [2, 36, 12],
  [10, 32, 22],
  [18, 26, 30],
];

export function escenaBajo(nombres: ReadonlyMap<string, string>): string {
  const { x: hx, y: hy } = BAJO.agujero;
  const hueco = agujero();
  const huecoD = `M${hueco.map(([x, y]) => `${x} ${y}`).join(' L')} Z`;
  const chorro = CHORRO.map(([dx0, dy0, dx1], i) => {
    const x0 = hx + dx0;
    const y0 = hy + dy0;
    const x1 = hx + dx1;
    return `<path class="bajo-chorro" data-hilo="${i}" d="M${x0} ${y0} C${x0 + 6} ${y0 + 40} ${x1} ${BAJO.fondo - 90} ${x1} ${BAJO.fondo + 2}"/>`;
  }).join('');
  // La lluvia de la calle, que se ve por el agujero: rayas que bajan en diagonal.
  // Se dibuja dos veces, una arriba de la otra: la isla la corre un período y vuelve, sin salto.
  let lluvia = '';
  for (let i = 0; i < 12; i++) {
    const x = hx - 50 + ((i * 37) % 130);
    const y = hy - 60 + ((i * 23) % 70);
    for (const dy of [-70, 0, 70]) lluvia += `<path class="bajo-lluvia" d="M${x} ${y + dy} l-5 14"/>`;
  }
  const { x: px, agua, escala } = PIERRE;
  const debajoDelAgua = (id: string, y: number): string => `<clipPath id="${id}"><rect x="-10" y="${y}" width="920" height="${ESCENA.alto - y + 10}"/></clipPath>`;
  return (
    imagen('bajo-lejos') +
    imagen('bajo-agua') +
    // Lo que entra por el vidrio roto: la lluvia de afuera, y el agua que cae por la puerta.
    `<clipPath id="bajo-agujero"><path d="${huecoD}"/></clipPath>` +
    `<g class="bajo-lluvia-afuera" clip-path="url(#bajo-agujero)" pointer-events="none"><g data-parte="lluvia">${lluvia}</g></g>` +
    `<g class="bajo-chorros" pointer-events="none">${chorro}</g>` +
    `<g class="bajo-ondas-vivas" pointer-events="none" data-onda="puerta"></g>` +
    `<g class="bajo-ondas-vivas" pointer-events="none" data-onda="pierre-atras"></g>` +
    // Pierre: el títere va adentro de un grupo con id, que el reflejo copia con <use>.
    `<g class="titere titere--pierre" data-id="el-gordo-pierre" role="button" tabindex="0" aria-label="${nombres.get('el-gordo-pierre') ?? ''}">` +
    `<g id="pierre-entero" transform="translate(${px} ${agua}) scale(${escala})">${pierre()}</g></g>` +
    // El agua de adelante: la misma imagen, cortada justo donde toca a Pierre.
    debajoDelAgua('bajo-adelante', agua) +
    `<g clip-path="url(#bajo-adelante)" pointer-events="none">${imagen('bajo-agua')}</g>` +
    // El reflejo: Pierre dado vuelta en el agua, cortado en las tiras de `bajo-ondas`, apagado.
    `<mask id="bajo-tiras" maskUnits="userSpaceOnUse" x="0" y="${BAJO.fondo}" width="${ESCENA.ancho}" height="${ESCENA.alto - BAJO.fondo}">${imagen('bajo-ondas')}</mask>` +
    `<g class="bajo-reflejo" aria-hidden="true" pointer-events="none" clip-path="url(#bajo-adelante)" mask="url(#bajo-tiras)">` +
    `<g transform="translate(0 ${agua * 2}) scale(1 -1)"><g data-parte="reflejo"><use href="#pierre-entero"/></g></g></g>` +
    `<g class="bajo-ondas-vivas" pointer-events="none" clip-path="url(#bajo-adelante)" data-onda="pierre"></g>` +
    losOjos(VECINOS_DEL_BAJO, nombres, (y) => y > BAJO.fondo) +
    `<g pointer-events="none">${imagen('bajo-frente')}</g>`
  );
}
