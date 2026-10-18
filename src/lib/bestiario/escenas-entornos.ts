/**
 * Las escenas de los seis entornos de la décima vuelta (`D-73`): el galpón, el árbol del gran
 * bonete, Cybersiberia, los astilleros, la mesa servida y la ruta del último bondi.
 *
 * Mismo régimen que los recintos de noche (`escenas.ts`): el entorno es inventado en la estética de
 * su disco y se imprime a aerógrafo (`arte-entornos.ts`), en tres capas. Entre el piso y lo de
 * adelante viven los bichos: los que miran desde lo oscuro son ojos, y los que no tienen ojos —una
 * cosa, como la silla vacía o la tele, o uno que se ve de espaldas— se tocan donde están pintados.
 * En la ruta, además, los fierros pasan: son imágenes que la isla corre de costado
 * (`recintoDeRuta`), y lo que espera en la banquina se queda quieto.
 */

import { imagen } from './titeres.ts';
import { ojos } from './escenas.ts';
import { LUGAR_EN_EL_ELENCO, capasDe, fierroDe, sinTitere } from './elenco.ts';
import {
  COSAS_DE_CYBERSIBERIA, COSAS_DE_LA_MESA, COSAS_DE_LA_RUTA, COSAS_DE_LOS_ASTILLEROS, COSAS_DEL_ARBOL, COSAS_DEL_GALPON, FIERROS,
  OJOS_DE_CYBERSIBERIA, OJOS_DE_LA_MESA, OJOS_DE_LA_RUTA, OJOS_DE_LOS_ASTILLEROS, OJOS_DEL_ARBOL, OJOS_DEL_GALPON, RUTA,
  type Cosa, type Ojos,
} from './rig-entornos.ts';

type Nombres = ReadonlyMap<string, string>;

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

const marca = (x: number, y: number): string =>
  `<g class="marca-anotada" transform="translate(${f(x)} ${f(y)})"><circle r="6" class="b-pp b-borde"/><path d="M-3 0 l2 2.5 l4 -5" class="b-tz" stroke-width="2"/></g>`;

/**
 * Una cosa pintada que se toca: no tiene ojos porque es una cosa o porque se la ve de espaldas.
 * El dibujo está en el piso; acá va el lugar del toque y la marca de anotada. `quieta` la deja
 * fuera del tránsito de la ruta.
 */
export function cosa(id: string, nombre: string, [x, y, r]: Cosa, quieta = false): string {
  return (
    `<g class="bestia bestia--cosa" data-id="${id}" data-x="${x}" data-y="${y}"${quieta ? ' data-quieto=""' : ''} role="button" tabindex="0" aria-label="${nombre}">` +
    `<circle class="toque" cx="${x}" cy="${y}" r="${r}"/><g class="cuerpo"></g>` +
    marca(x + r * 0.7, y - r * 0.7) +
    `</g>`
  );
}

/**
 * Los de un recinto: los ojos y las cosas, en ese orden. Los del elenco de la decimoquinta vuelta que
 * ya tienen títere no van acá: los dibuja su capa (`elenco.ts`).
 */
function habitantes(vecinos: Readonly<Record<string, Ojos>>, cosas: Readonly<Record<string, Cosa>>, nombres: Nombres, quietos = false): string {
  const losOjos = Object.entries(sinTitere(vecinos))
    .map(([id, [x, y, tinta]]) => {
      const marcado = ojos(id, nombres.get(id) ?? id, x, y, tinta);
      return quietos ? marcado.replace('class="bestia bestia--ojos"', 'class="bestia bestia--ojos" data-quieto=""') : marcado;
    })
    .join('');
  const lasCosas = Object.entries(sinTitere(cosas)).map(([id, c]) => cosa(id, nombres.get(id) ?? id, c, quietos)).join('');
  return `<g class="ojos-del-recinto">${losOjos}${lasCosas}</g>`;
}

const frente = (nombre: string): string => `<g pointer-events="none">${imagen(nombre)}</g>`;

/**
 * Las capas de un entorno, con el elenco en su lugar: lo de atrás entre lo lejano y el piso, el
 * títere después de los ojos y antes de lo de adelante, y lo que va delante de todo al final.
 */
function capas(region: string, lejos: string, piso: string, medio: string, adelante: string, nombres: Nombres): string {
  return (
    imagen(lejos) +
    capasDe(region, 'atras', nombres) +
    imagen(piso) +
    medio +
    capasDe(region, 'figura', nombres) +
    frente(adelante) +
    capasDe(region, 'delante', nombres)
  );
}

export function escenaGalpon(nombres: Nombres): string {
  return capas('el-galpon', 'galpon-lejos', 'galpon-piso', habitantes(OJOS_DEL_GALPON, COSAS_DEL_GALPON, nombres), 'galpon-frente', nombres);
}

export function escenaArbol(nombres: Nombres): string {
  return capas('el-arbol', 'arbol-lejos', 'arbol-piso', habitantes(OJOS_DEL_ARBOL, COSAS_DEL_ARBOL, nombres), 'arbol-frente', nombres);
}

/** Cybersiberia, con la nieve que cae: dos copias de la misma capa, una arriba de la otra, que la página corre. */
export function escenaCybersiberia(nombres: Nombres): string {
  const nevada =
    `<g class="cyber-nevada" pointer-events="none"><g class="cyber-nevada-copos">` +
    imagen('cyber-nieve') +
    `<g transform="translate(0 -640)">${imagen('cyber-nieve')}</g>` +
    `</g></g>`;
  return capas('cybersiberia', 'cyber-lejos', 'cyber-piso', habitantes(OJOS_DE_CYBERSIBERIA, COSAS_DE_CYBERSIBERIA, nombres) + nevada, 'cyber-frente', nombres);
}

export function escenaAstilleros(nombres: Nombres): string {
  return capas('los-astilleros', 'astillero-lejos', 'astillero-piso', habitantes(OJOS_DE_LOS_ASTILLEROS, COSAS_DE_LOS_ASTILLEROS, nombres), 'astillero-frente', nombres);
}

export function escenaMesa(nombres: Nombres): string {
  return capas('la-mesa', 'mesa-lejos', 'mesa-piso', habitantes(OJOS_DE_LA_MESA, COSAS_DE_LA_MESA, nombres), 'mesa-frente', nombres);
}

/**
 * Un fierro que pasa: la imagen, el toque y la marca van adentro de `.cuerpo`, así viajan juntos
 * cuando la isla lo corre. Cada carril va a su velocidad, la misma para todos los de ese carril,
 * para que no se pasen por encima.
 */
export const VELOCIDAD_DE_CARRIL = [30, 46] as const;

function fierro(id: string, nombre: string): string {
  const { pieza, carril, caja, x } = FIERROS[id as keyof typeof FIERROS];
  const y = RUTA.carriles[carril];
  const [, cy, , alto] = caja;
  const arriba = y + cy + alto * 0.35;
  return (
    `<g class="bestia bestia--fierro" data-id="${id}" data-x="${x}" data-y="${f(arriba)}" data-velocidad="${VELOCIDAD_DE_CARRIL[carril]}" role="button" tabindex="0" aria-label="${nombre}">` +
    `<g class="cuerpo">` +
    `<circle class="toque" cx="${x}" cy="${f(y - 40)}" r="56"/>` +
    // Si el fierro ya es un títere del elenco (la Mariposa Pontiac), viaja él en lugar de la imagen.
    `<g transform="translate(${x} ${y})">${fierroDe(id) ?? imagen(pieza)}</g>` +
    marca(x + 40, arriba - 10) +
    `</g></g>`
  );
}

/**
 * La ruta: lo lejano, el piso, lo que espera en la banquina (quieto), los fierros del carril de
 * atrás y después los del de adelante, y los yuyos.
 */
export function escenaRuta(nombres: Nombres): string {
  const porCarril = (c: number): string =>
    Object.keys(FIERROS)
      .filter((id) => FIERROS[id as keyof typeof FIERROS].carril === c)
      .map((id) => fierro(id, nombres.get(id) ?? id))
      .join('');
  return capas(
    'la-ruta',
    'ruta-lejos',
    'ruta-piso',
    habitantes(OJOS_DE_LA_RUTA, COSAS_DE_LA_RUTA, nombres, true) + `<g class="fierros">${porCarril(0)}${porCarril(1)}</g>`,
    'ruta-frente',
    nombres,
  );
}

/** Los seis recintos, con la escena y dónde arranca mirando cuando no entra entera. */
export const ENTORNOS_DE_NOCHE: Readonly<Record<string, { escena: (n: Nombres) => string; foco: number }>> = {
  'el-galpon': { escena: escenaGalpon, foco: 450 },
  'el-arbol': { escena: escenaArbol, foco: 450 },
  cybersiberia: { escena: escenaCybersiberia, foco: 450 },
  'los-astilleros': { escena: escenaAstilleros, foco: 300 },
  'la-mesa': { escena: escenaMesa, foco: 450 },
  'la-ruta': { escena: escenaRuta, foco: FIERROS['el-zumba'].x },
};

/**
 * Todos los que viven en cada uno de los seis: lo usa el test para que nadie falte ni sobre. Los del
 * elenco cuentan una sola vez, aunque sigan anotados como ojos o como cosa en `rig-entornos.ts`.
 */
const conElElenco = (region: string, ids: readonly string[]): readonly string[] => [
  ...new Set([...ids, ...Object.entries(LUGAR_EN_EL_ELENCO).filter(([, r]) => r === region).map(([id]) => id)]),
];
export const QUIENES: Readonly<Record<string, readonly string[]>> = {
  'el-galpon': conElElenco('el-galpon', [...Object.keys(OJOS_DEL_GALPON), ...Object.keys(COSAS_DEL_GALPON)]),
  'el-arbol': conElElenco('el-arbol', [...Object.keys(OJOS_DEL_ARBOL), ...Object.keys(COSAS_DEL_ARBOL)]),
  cybersiberia: conElElenco('cybersiberia', [...Object.keys(OJOS_DE_CYBERSIBERIA), ...Object.keys(COSAS_DE_CYBERSIBERIA)]),
  'los-astilleros': conElElenco('los-astilleros', [...Object.keys(OJOS_DE_LOS_ASTILLEROS), ...Object.keys(COSAS_DE_LOS_ASTILLEROS)]),
  'la-mesa': conElElenco('la-mesa', [...Object.keys(OJOS_DE_LA_MESA), ...Object.keys(COSAS_DE_LA_MESA)]),
  'la-ruta': conElElenco('la-ruta', [...Object.keys(OJOS_DE_LA_RUTA), ...Object.keys(COSAS_DE_LA_RUTA), ...Object.keys(FIERROS)]),
};
