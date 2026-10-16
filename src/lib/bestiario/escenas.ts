/**
 * Los recintos con protagonista de tapa (`D-73`, quinta vuelta): el baldío del perro de *Un
 * baión*, el infierno de Luzbelito y el templo del medallón de Momo.
 *
 * Mismo régimen que el monte (`escena-monte.ts`): el entorno es inventado en la estética del
 * disco y se imprime a aerógrafo (`arte.ts`); el protagonista es el recorte de su tapa
 * (`recortes.ts`) y lo mueve la isla; los demás bichos del recinto, de noche, son ojos que miran
 * desde lo oscuro. El fuego del infierno es la pincelada de la tapa de *Gulp!*, teñida.
 */

import { imagen } from './titeres.ts';
import { ARMADO } from './recortes.ts';

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

export type Tinta = 'oro' | 'papel' | 'rojo';

/** Un par de ojos que miran desde lo oscuro: tocables, y parpadean. */
export function ojos(id: string, nombre: string, x: number, y: number, tinta: Tinta): string {
  const clase = `ojos-${tinta}`;
  return (
    `<g class="bestia bestia--ojos" data-id="${id}" data-x="${x}" data-y="${y}" role="button" tabindex="0" aria-label="${nombre}">` +
    `<circle class="toque" cx="${x}" cy="${y}" r="26"/>` +
    `<g class="cuerpo"><ellipse cx="${x - 6}" cy="${y}" rx="3.2" ry="2.4" class="${clase}"/><ellipse cx="${x + 6}" cy="${y}" rx="3.2" ry="2.4" class="${clase}"/></g>` +
    `<g class="marca-anotada" transform="translate(${x + 14} ${y - 12})"><circle r="6" class="b-pp b-borde"/><path d="M-3 0 l2 2.5 l4 -5" class="b-tz" stroke-width="2"/></g>` +
    `</g>`
  );
}

const losOjos = (vecinos: Readonly<Record<string, readonly [number, number, Tinta]>>, nombres: ReadonlyMap<string, string>): string =>
  `<g class="ojos-del-recinto">${Object.entries(vecinos)
    .map(([id, [x, y, t]]) => ojos(id, nombres.get(id) ?? id, x, y, t))
    .join('')}</g>`;

const titere = (clase: string, id: string, nombre: string, cuerpo: string, transform: string): string =>
  `<g class="titere ${clase}" data-id="${id}" role="button" tabindex="0" aria-label="${nombre}" transform="${transform}">${cuerpo}</g>`;

const parte = (nombre: string, cuerpo: string): string => `<g data-parte="${nombre}">${cuerpo}</g>`;

/* ------------------------------------------------------------------
   El baldío: ese perro que sigue allí
   ------------------------------------------------------------------ */

/** Dónde entra el perro: por el borde izquierdo, como en la tapa. */
export const PERRO = { x: 0, y: 470, escala: 1.15 } as const;

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

/** Dónde está la piedra, y de qué tamaño va el busto. */
export const LUZBELITO = { x: 452, y: 418, escala: 0.95 } as const;

/** Dónde queda la llama en la escena, para el resplandor. */
export function llamaEnEscena(): { x: number; y: number } {
  const [px, py] = ARMADO.luzbelito.piso;
  const [lx, ly] = ARMADO.luzbelito.llama;
  return { x: LUZBELITO.x + (lx - px) * LUZBELITO.escala, y: LUZBELITO.y + (ly - py) * LUZBELITO.escala };
}

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

/** De dónde cuelga el cordón, dónde queda la argolla y de qué tamaño va el medallón. */
export const MOMO = { cuelga: { x: 450, y: -10 }, argolla: { x: 450, y: 212 }, escala: 0.62 } as const;

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
