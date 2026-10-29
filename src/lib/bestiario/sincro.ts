/**
 * En qué segundo del tema dice su verso cada bestia (`D-78`), para que el "Escuchar" de la
 * ficha arranque justo ahí y no en un punto cualquiera del recorte de "adiviná el tema".
 *
 * ## De dónde sale el segundo
 *
 * De **LRCLIB** (lrclib.net), la base abierta de letras sincronizadas: por cada tema da una o
 * varias versiones con un tiempo por renglón (`[01:23.45]`). De ahí se toma **solo el número**
 * del renglón que coincide con el verso de `bestiario.json`; la letra de LRCLIB no se guarda en
 * ningún lado. La que se lee en el sitio sigue siendo la de `cancionero.json`.
 *
 * ## Por qué hay que cotejar la duración
 *
 * Un tiempo de LRCLIB vale para **una edición** del tema. Si la del máster dura distinto
 * (remasterizado, otra mezcla, un silencio más al principio), el segundo cae corrido. Por eso se
 * elige la versión de duración más parecida a la del máster, y si ni esa entra en
 * `TOLERANCIA_SEG`, el tema se deja sin sincronizar: preferible que suene como hasta hoy a que
 * arranque en la mitad de otra frase.
 *
 * Esto es lógica pura: no lee archivos ni sale a la red. Lo usa
 * `scripts/sincronizar-bestiario.mjs`, y el test lo prueba con letras inventadas.
 */

import { normalizar } from '../texto.ts';

/**
 * Las bestias que no suenan desde su verso sino **desde el arranque del tema**: el recorte empieza en
 * el segundo cero del máster, sin LRCLIB. El buen psicópata (`D-73`, decimosexta vuelta) es el primero,
 * a pedido del usuario: *"que suene el inicio del tema 'La parabellum del buen psicópata'"*, que
 * arranca con el riff de guitarra.
 */
export const DESDE_EL_ARRANQUE: ReadonlySet<string> = new Set(['el-buen-psicopata']);

/** Cuánto puede diferir la duración de la versión de LRCLIB de la del máster, en segundos. */
export const TOLERANCIA_SEG = 2;

/** Qué parte de las palabras del verso tiene que estar en el renglón para darlo por hallado. */
export const COINCIDENCIA_MINIMA = 0.75;

/** Lo que devuelve la búsqueda de LRCLIB, en lo que importa acá. */
export interface VersionLrclib {
  id: number;
  duration: number;
  syncedLyrics: string | null;
}

export interface Renglon {
  seg: number;
  texto: string;
}

/** Los renglones con tiempo de una letra LRC, ya normalizados. Los que no tienen tiempo, afuera. */
export function renglonesDe(lrc: string): Renglon[] {
  const out: Renglon[] = [];
  for (const linea of lrc.split(/\r?\n/)) {
    const m = linea.match(/^\[(\d+):(\d+(?:\.\d+)?)\](.*)$/);
    if (m) out.push({ seg: Number(m[1]) * 60 + Number(m[2]), texto: normalizar(m[3]!) });
  }
  return out;
}

/** La versión sincronizada de duración más parecida a la del máster, si entra en la tolerancia. */
export function elegirVersion(versiones: readonly VersionLrclib[], duracionMaster: number): VersionLrclib | null {
  const candidatas = versiones
    .filter((v) => v.syncedLyrics && Math.abs(v.duration - duracionMaster) <= TOLERANCIA_SEG)
    .sort((a, b) => Math.abs(a.duration - duracionMaster) - Math.abs(b.duration - duracionMaster));
  return candidatas[0] ?? null;
}

/** Qué parte de las palabras de `verso` aparece en `renglon`, de 0 a 1. */
function parecido(verso: string, renglon: string): number {
  const palabras = verso.split(' ').filter(Boolean);
  if (!palabras.length) return 0;
  const hay = new Set(renglon.split(' '));
  return palabras.filter((p) => hay.has(p)).length / palabras.length;
}

export interface Ubicacion {
  seg: number;
  coincidencia: number;
}

/**
 * El primer renglón donde aparece el verso. Si el verso sale más de una vez (un estribillo), se
 * queda con la primera: es la que se oye antes, y la que menos recorte necesita.
 */
export function ubicarVerso(lrc: string, verso: string): Ubicacion | null {
  const buscado = normalizar(verso);
  let mejor: Ubicacion | null = null;
  for (const r of renglonesDe(lrc)) {
    const c = parecido(buscado, r.texto);
    if (c >= COINCIDENCIA_MINIMA && (!mejor || c > mejor.coincidencia)) mejor = { seg: r.seg, coincidencia: c };
  }
  return mejor;
}
