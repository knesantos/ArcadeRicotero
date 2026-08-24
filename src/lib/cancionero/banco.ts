/**
 * El cancionero: tipos, carga y agrupado por disco.
 *
 * Implementa `CTR-06` (`src/data/_schema/cancionero.schema.json`). El dataset lo produce
 * `scripts/ingerir-cancionero.mjs` desde el material del usuario; este módulo lo lee y le
 * da la forma que las páginas necesitan.
 *
 * **La decisión que da forma a todo el archivo: la sección se ordena por disco.** No por
 * título ni por popularidad. Un tema de esta banda no es una unidad suelta — vive adentro
 * de un disco, con su tapa, su año y su paleta, y `D-19` ya había decidido que cada parte
 * del sitio viste la paleta real de un disco. Acá eso deja de ser decoración y pasa a ser
 * la estructura: **diez secciones, una por disco, cada una con su estética**.
 *
 * **Y cada disco muestra su tracklist entero, no solo lo que conseguimos.** Un índice que
 * lista 12 de 13 pistas sin decirlo miente por omisión. `pistasDelDisco()` cruza contra
 * los 105 de `RES-20` y marca el hueco: *Sushi* no está, y el sitio lo dice.
 */

import { leerTemas, normalizarDuro, type Disco, DISCOS } from '../letra/temas.ts';

export type TipoSeccion = 'desconocida' | 'intro' | 'verso' | 'estribillo' | 'puente' | 'solo' | 'final';
/**
 * `anotacion` es lo que escribio el que transcribio la cifra y no se canta: `GUITARRA:`,
 * `VERSO 1: (Riff 2) X7`, `(X4)`. Se separo de `tab` en el ciclo 7 porque **no es
 * tablatura**: llamarla asi seria otro rotulo que miente sobre lo que hay adentro. Y se
 * separo de `letra` porque cuando estaba ahi, el banco de `US-03` llego a producir un
 * item cuyo enunciado era `VERSO 1: [Riff] 2) X7`. Quien decide cual es cual:
 * `src/lib/cancionero/anotacion.ts`.
 */
export type TipoLinea = 'letra' | 'tab' | 'anotacion' | 'instrumental';

/**
 * Qué dio la fuente para este tema.
 *
 * **Tres estados y no un booleano**, porque `instrumental` solo no alcanzaba para decir
 * la verdad. *Capricho Magyar* no tiene letra porque no la tuvo nunca; *Etiqueta negra*
 * sí la tiene, pero la página que la transcribió puso solo la tablatura de guitarra.
 * Meterlos en la misma casilla le hace decir al sitio que seis temas de los Redondos son
 * instrumentales, y es falso — el mismo error de rótulo que `D-14` declara como lo único
 * que en este proyecto sigue siendo estricto.
 */
export type Contenido = 'letra' | 'instrumental' | 'solo-tablatura';

/** Un acorde y la columna de la letra sobre la que cae. */
export type Marca = readonly [string, number];

export interface Linea {
  readonly t: TipoLinea;
  readonly texto?: string;
  readonly acordes?: readonly Marca[];
}

export interface Seccion {
  readonly tipo: TipoSeccion;
  readonly etiqueta: string | null;
  readonly lineas: readonly Linea[];
}

export interface Fuente {
  readonly sitio: string | null;
  readonly url: string | null;
  readonly consultado: string | null;
}

export interface TemaCancionero {
  readonly slug: string;
  readonly titulo: string;
  readonly disco: Disco;
  readonly pista: number;
  readonly anio: number;
  readonly tono: string | null;
  readonly capo: number | null;
  readonly acordesUsados: readonly string[];
  readonly contenido: Contenido;
  readonly fuente: Fuente;
  readonly secciones: readonly Seccion[];
}

export interface Cancionero {
  readonly contrato: string;
  readonly contratoVersion: number;
  readonly actualizado: string;
  readonly origen: string;
  readonly temas: readonly TemaCancionero[];
}

export class CancioneroInvalido extends Error {}

/**
 * Los diez discos con lo que hace falta para vestirlos: título como se escribe, año, y
 * la clave de paleta que usan los tokens (`--disco-<clave>-*`) y la tapa de
 * `public/tapas/<clave>.jpg`.
 *
 * Los dos volúmenes de *Lobo suelto, cordero atado* son discos distintos acá porque
 * `RES-20` los lista separados y tienen tapas opuestas — la discrepancia 2 de `RES-02`
 * sobre si son nueve o diez discos sigue abierta y **no se usa como pregunta**, pero para
 * mostrar un tracklist hay que elegir una forma, y se eligió la que tiene tapa propia.
 */
export interface FichaDisco {
  readonly slug: Disco;
  readonly titulo: string;
  readonly anio: number;
}

export const FICHAS: readonly FichaDisco[] = [
  { slug: 'gulp', titulo: 'Gulp!', anio: 1985 },
  { slug: 'oktubre', titulo: 'Oktubre', anio: 1986 },
  { slug: 'un-baion-para-el-ojo-idiota', titulo: 'Un baión para el ojo idiota', anio: 1988 },
  { slug: 'bang-bang-estas-liquidado', titulo: '¡Bang! ¡Bang!… estás liquidado', anio: 1989 },
  { slug: 'la-mosca-y-la-sopa', titulo: 'La mosca y la sopa', anio: 1991 },
  { slug: 'lobo-suelto', titulo: 'Lobo suelto', anio: 1993 },
  { slug: 'cordero-atado', titulo: 'Cordero atado', anio: 1993 },
  { slug: 'luzbelito', titulo: 'Luzbelito', anio: 1996 },
  { slug: 'ultimo-bondi-a-finisterre', titulo: 'Último bondi a Finisterre', anio: 1998 },
  { slug: 'momo-sampler', titulo: 'Momo Sampler', anio: 2000 },
];

/** Una pista del tracklist: la trae el disco siempre, con letra o sin ella. */
export interface Pista {
  readonly pista: number;
  readonly titulo: string;
  /** El tema del cancionero, si lo tenemos. `null` es un hueco declarado, no un error. */
  readonly tema: TemaCancionero | null;
}

/** Un disco con su tracklist completo, listo para pintar una sección del índice. */
export interface DiscoConTemas extends FichaDisco {
  readonly pistas: readonly Pista[];
  readonly conLetra: number;
  readonly conAcordes: number;
}

/** Invariantes que el código necesita. Fallan en build, nunca en la cara del jugador. */
export function verificarInvariantes(temas: readonly TemaCancionero[]): void {
  const slugs = new Set<string>();
  for (const t of temas) {
    if (slugs.has(t.slug)) throw new CancioneroInvalido(`slug repetido: ${t.slug}`);
    slugs.add(t.slug);
    if (!DISCOS.includes(t.disco)) throw new CancioneroInvalido(`${t.slug}: disco desconocido "${t.disco}"`);
    if (t.contenido === 'instrumental' && t.secciones.length > 0) {
      throw new CancioneroInvalido(`${t.slug}: dice ser instrumental pero trae contenido`);
    }
    if (t.contenido !== 'instrumental' && t.secciones.length === 0) {
      throw new CancioneroInvalido(`${t.slug}: declara ${t.contenido} y no trae una sola línea`);
    }
    // Un tema declarado con letra tiene que traer un verso de verdad. Sin este chequeo,
    // los seis de solo-tablatura se colaban como si tuvieran letra y la página salía vacía.
    if (t.contenido === 'letra' && contarVersos(t) === 0) {
      throw new CancioneroInvalido(`${t.slug}: declara tener letra pero no trae un solo verso`);
    }
    // D-14: no se exige fuente oficial —no existe— pero de dónde salió se declara siempre.
    if (t.contenido !== 'instrumental' && !t.fuente.sitio) {
      throw new CancioneroInvalido(`${t.slug}: no declara de dónde salió la letra`);
    }
  }
}

/** Carga el cancionero verificando lo que el código da por sentado. */
export function cargar(crudo: Cancionero): readonly TemaCancionero[] {
  verificarInvariantes(crudo.temas);
  return crudo.temas;
}

/**
 * Los diez discos con su tracklist completo cruzado contra `RES-20`.
 *
 * Corre en build: lee la ficha del disco. Nunca en el navegador.
 */
export function porDisco(temas: readonly TemaCancionero[]): readonly DiscoConTemas[] {
  const catalogo = leerTemas();
  const porSlug = new Map(temas.map((t) => [normalizarDuro(t.titulo), t]));

  return FICHAS.map((ficha) => {
    const pistas: Pista[] = catalogo
      .filter((t) => t.disco === ficha.slug)
      .sort((a, b) => a.pista - b.pista)
      .map((t) => ({
        pista: t.pista,
        titulo: t.titulo,
        tema: porSlug.get(normalizarDuro(t.titulo)) ?? null,
      }));
    return {
      ...ficha,
      pistas,
      conLetra: pistas.filter((p) => p.tema?.contenido === 'letra').length,
      conAcordes: pistas.filter((p) => (p.tema?.acordesUsados.length ?? 0) > 0).length,
    };
  });
}

/** Cuántos versos tiene un tema. Sirve para el índice y para el generador de `US-03`. */
export function contarVersos(tema: TemaCancionero): number {
  let n = 0;
  for (const s of tema.secciones) for (const l of s.lineas) if (l.t === 'letra' && l.texto?.trim()) n++;
  return n;
}

/** ¿Este tema trae acordes cifrados, o es solo letra? */
export function tieneAcordes(tema: TemaCancionero): boolean {
  return tema.acordesUsados.length > 0;
}

/** ¿Se puede leer para cantarlo? Los otros dos estados se muestran, pero no se cantan. */
export function seCanta(tema: TemaCancionero): boolean {
  return tema.contenido === 'letra';
}

/** Lo que la ficha del tema dice cuando no hay letra que mostrar. */
export const AVISO_SIN_LETRA: Readonly<Record<Exclude<Contenido, 'letra'>, string>> = {
  instrumental: 'Es un instrumental: no tiene letra que completar.',
  'solo-tablatura':
    'De este tema conseguimos la tablatura, no la letra. Está transcripta para tocarla, no para cantarla.',
};

/**
 * El slug del cancionero para un título de tema, o `null` si no lo tenemos.
 *
 * Existe para que la Redondopedia pueda mandar a la letra desde el artículo de un tema.
 * **No compara slugs, compara títulos normalizados**, porque los dos slugs se derivaron
 * por caminos distintos y no siempre coinciden: la Redondopedia escribe `ji-ji-ji` y el
 * cancionero `jijiji`, del mismo tema. Cruzar por slug daría un enlace roto justo en el
 * tema más conocido de la banda.
 */
export function slugDeLetra(
  titulo: string,
  temas: readonly TemaCancionero[],
): string | null {
  const buscado = normalizarDuro(titulo);
  return temas.find((t) => normalizarDuro(t.titulo) === buscado)?.slug ?? null;
}
