/**
 * Las tintas del pixel, leídas de `tokens.css` y no copiadas (`T-268`, ciclo 16).
 *
 * `UX-27 §4` fija que las 16 tintas del área viven en `src/styles/tokens.css` con prefijo
 * `--px-`, y que las dos fijas son alias (`--px-clave: var(--fondo)`) para no duplicar un
 * hex. `CTR-15.4` agrega que el JSON del atlas las nombra por token y nunca por hex. Las dos
 * reglas juntas dicen lo mismo: **el hex se resuelve al correr, contra la hoja**, y este
 * módulo es el único lugar de la cadena del pixel que sabe hacerlo.
 *
 * Es puro a propósito —texto entra, mapa sale, sin `node:fs`— para que lo usen igual la
 * imprenta, el auditor y los tests, y para que un test pueda darle una hoja de fixture.
 *
 * **Ningún hex vive en este archivo.** Los que aparecen en un mensaje se arman al correr.
 */

/**
 * Tope de `CTR-15.4` y `UX-27 §4`: quince para toda el área, y una más no existe. Eran
 * dieciséis hasta el 2026-09-23, cuando `UX-27 §4.1.2` le sacó la tinta a la puerta.
 */
export const TOPE_DE_TINTAS = 15;

/** Prefijo de las tintas del área de juego (`UX-27 §4`). */
export const PREFIJO_PIXEL = '--px-';

/** Cómo se escribe un nombre de tinta válido. */
export const NOMBRE_DE_TINTA = /^--px-[a-z0-9]+(?:-[a-z0-9]+)*$/;

const HEX_SEIS = /^#[0-9a-fA-F]{6}$/;
const ALIAS = /^var\(\s*(--[a-zA-Z0-9-]+)\s*\)$/;

/**
 * Todas las declaraciones de custom properties de la hoja, en orden, sin comentarios.
 * Si un nombre aparece dos veces con valores distintos se queda con la primera y lo anota
 * en `repetidas`: la hoja real repite algunas duraciones adentro de un `@media`, y eso no
 * es asunto del pixel; pero si mañana una `@media` redefine una tinta del pixel, **o una
 * variable por la que pasa su alias** (`--px-clave: var(--fondo)` y un `--fondo` de tema
 * claro), la imprenta no puede adivinar cuál manda. `paletaDelArea` separa un caso del otro.
 */
export function leerDeclaraciones(css: string): {
  valores: Map<string, string>;
  repetidas: string[];
} {
  const limpio = css.replace(/\/\*[\s\S]*?\*\//g, ' ');
  const valores = new Map<string, string>();
  const repetidas: string[] = [];
  // Una declaración termina en ";" o, si es la última de su bloque, en "}" sin ";": las dos
  // son CSS válido, y una redefinición escrita de la segunda forma no puede pasar sin verse.
  for (const m of limpio.matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*([^;{}]+)(?=[;}])/g)) {
    const nombre = m[1]!;
    const valor = m[2]!.trim();
    if (valores.has(nombre)) {
      if (valores.get(nombre) !== valor) repetidas.push(nombre);
      continue;
    }
    valores.set(nombre, valor);
  }
  return { valores, repetidas };
}

/** `camino` es la cadena de alias que se siguió, empezando por el nombre pedido. */
export type Resolucion = { hex: string; camino: string[] } | { error: string };

/**
 * Sigue los alias `var(--x)` hasta llegar a un hex de seis dígitos. Devuelve el hex en
 * minúscula, o el motivo por el que no se pudo: el token no existe, el alias da una vuelta,
 * o el valor final no es un hex de seis (un `rgb()` o un hex de tres no se aceptan: la
 * imprenta y el auditor comparan bytes, y un formato más es un lugar más donde equivocarse).
 */
export function resolverToken(valores: ReadonlyMap<string, string>, nombre: string): Resolucion {
  const camino: string[] = [];
  let actual = nombre;
  for (;;) {
    if (camino.includes(actual)) {
      return { error: `${nombre}: el alias da una vuelta (${[...camino, actual].join(' -> ')})` };
    }
    camino.push(actual);
    const valor = valores.get(actual);
    if (valor === undefined) {
      return camino.length === 1
        ? { error: `${nombre} no existe en tokens.css` }
        : { error: `${nombre} apunta a ${actual}, que no existe en tokens.css` };
    }
    if (HEX_SEIS.test(valor)) return { hex: valor.toLowerCase(), camino };
    const alias = valor.match(ALIAS);
    if (!alias) {
      return { error: `${nombre} vale "${valor}", que no es un hex de seis dígitos ni un alias var(--x)` };
    }
    actual = alias[1]!;
  }
}

export interface PaletaDelArea {
  /** Nombre `--px-*` → hex en minúscula, en el orden de la hoja. */
  tintas: Map<string, string>;
  /** Todo lo que impide confiar en la paleta: tokens que no resuelven, repetidos, el 17. */
  errores: string[];
}

/**
 * Las tintas `--px-*` que declara la hoja, resueltas. Con cero tintas devuelve un mapa
 * vacío y ningún error: es el estado de hoy, y la cadena tiene que andar igual.
 */
export function paletaDelArea(css: string): PaletaDelArea {
  const { valores, repetidas } = leerDeclaraciones(css);
  const repetida = new Set(repetidas);
  const tintas = new Map<string, string>();
  const errores: string[] = [];
  for (const nombre of repetida) {
    if (nombre.startsWith(PREFIJO_PIXEL)) {
      errores.push(`${nombre} está declarada dos veces con valores distintos en tokens.css`);
    }
  }
  for (const nombre of valores.keys()) {
    if (!nombre.startsWith(PREFIJO_PIXEL)) continue;
    if (!NOMBRE_DE_TINTA.test(nombre)) {
      errores.push(`${nombre}: nombre de tinta mal formado (va en minúscula, letras, números y guiones)`);
      continue;
    }
    const r = resolverToken(valores, nombre);
    if ('error' in r) {
      errores.push(r.error);
      continue;
    }
    tintas.set(nombre, r.hex);
    // La tinta repetida ya se nombró arriba; acá van las variables por las que pasa su alias.
    for (const paso of r.camino.slice(1)) {
      if (repetida.has(paso)) {
        errores.push(
          `${nombre} pasa por ${paso}, que está declarada dos veces con valores distintos en tokens.css ` +
            '(¿una @media la redefine?): la imprenta no puede saber cuál manda',
        );
      }
    }
  }
  const declaradas = [...valores.keys()].filter((n) => n.startsWith(PREFIJO_PIXEL)).length;
  if (declaradas > TOPE_DE_TINTAS) {
    errores.push(
      `tokens.css declara ${declaradas} tintas --px-* y el tope es ${TOPE_DE_TINTAS} para toda el área (CTR-15.4, UX-27 §4): una más no existe`,
    );
  }
  return { tintas, errores };
}

/** `[r, g, b]` de un hex de seis dígitos ya validado. */
export function rgbDeHex(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

/** El hex en minúscula de tres canales. Se arma al correr: acá no hay ningún literal. */
export function hexDeRgb(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}
