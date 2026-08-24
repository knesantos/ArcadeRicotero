/**
 * El catálogo de "adiviná el tema" (`US-02`), armado en build.
 *
 * **Corre en el frontmatter de Astro, nunca en el navegador**: lee la ficha `RES-20` del
 * disco. Lo que sí viaja al navegador es lo que devuelve `catalogo()`, que son ~105
 * entradas de texto corto — del orden de 12 KB, dos órdenes de magnitud debajo del techo
 * de `CTR-02.1`.
 *
 * ## Las dos listas, y por qué no son la misma
 *
 * - **El pozo**: los temas que pueden salir sorteados. Es el subconjunto que tiene
 *   fragmento de audio en disco, y hoy puede estar vacío (`D-23`: el audio se produce
 *   desde la máquina del usuario, no lo genera este repo).
 * - **El catálogo**: los 105 títulos de `RES-20`, tengan audio o no. Es lo que ofrece el
 *   buscador. Si solo ofreciera el pozo, el desplegable sería la respuesta.
 *
 * ## De dónde sale cada dato, sin una sola lista copiada a mano
 *
 * | Dato | Fuente |
 * |---|---|
 * | Los 105 títulos, con disco y pista | `leerTemas()`, que parsea `RES-20` (`D-13`) |
 * | Título y año de cada disco | `FICHAS`, de `cancionero/banco.ts` |
 * | Qué temas tienen audio | `src/data/adivinar-tema.json`, que escribe `scripts/generar-fragmentos.mjs` |
 * | El enlace a la letra | el cancionero, cruzado por título normalizado |
 *
 * El manifiesto de audio **no es una lista de temas**: es una lista de archivos que
 * existen. Cada entrada se cruza contra los 105 y si no resuelve, el build se cae. Es la
 * puerta de `D-13` aplicada al audio: un mp3 con un nombre que no es de esta banda no
 * puede entrar al sitio por descuido de tipeo.
 */

import { leerTemas, normalizarDuro, type Disco } from '../letra/temas.ts';
import { FICHAS } from '../cancionero/banco.ts';
import { slugDeTitulo } from '../texto.ts';
import type { TemaBuscable } from './buscador.ts';
import { DURACION_FRAGMENTO_SEG } from './escalera.ts';

export class CatalogoInvalido extends Error {}

/** Una entrada del manifiesto que escribe `scripts/generar-fragmentos.mjs`. */
export interface Fragmento {
  readonly slug: string;
  /** El título tal como lo escribe `RES-20`. Está para que el manifiesto se lea solo. */
  readonly titulo: string;
  readonly duracionSeg: number;
  /** ¿Existe además el tema entero (`D-23`, nivel 2)? */
  readonly entero: boolean;
}

export interface Manifiesto {
  readonly contrato: string;
  readonly contratoVersion: number;
  readonly actualizado: string;
  readonly fragmentos: readonly Fragmento[];
}

/** Un tema como lo ve el navegador. */
export interface TemaDelJuego extends TemaBuscable {
  readonly anio: number;
  /** Solo los jugables entran al sorteo. Los demás existen para el buscador. */
  readonly jugable: boolean;
  /** El tema entero, para el que ya lo adivinó (`D-22`). */
  readonly entero: boolean;
  /** Slug de la ficha de letra y acordes, si la tenemos. `null` es un hueco declarado. */
  readonly letra: string | null;
}

export interface DiscoDelJuego {
  readonly slug: Disco;
  readonly titulo: string;
  readonly anio: number;
  readonly total: number;
  readonly jugables: number;
}

export interface Catalogo {
  readonly temas: readonly TemaDelJuego[];
  readonly discos: readonly DiscoDelJuego[];
  /** Cuántos temas pueden salir sorteados en total. Cero = el juego no se puede jugar. */
  readonly jugables: number;
}

/** Lo mínimo que el catálogo necesita saber del cancionero, para no acoplarse a él. */
export interface TemaConLetra {
  readonly slug: string;
  readonly titulo: string;
}

/**
 * Verifica el manifiesto contra los 105 y devuelve el índice de fragmentos por slug.
 *
 * Falla ruidoso, en build, con el nombre del archivo culpable. Nunca en la cara de nadie.
 */
export function indexarFragmentos(
  manifiesto: Manifiesto,
  slugsValidos: ReadonlySet<string>,
): ReadonlyMap<string, Fragmento> {
  const indice = new Map<string, Fragmento>();

  for (const f of manifiesto.fragmentos) {
    if (!slugsValidos.has(f.slug)) {
      throw new CatalogoInvalido(
        `el fragmento "${f.slug}.mp3" no corresponde a ninguno de los 105 temas de RES-20 ` +
          `(D-13). Revisá el nombre del archivo o el alias en letra/temas.ts.`,
      );
    }
    if (indice.has(f.slug)) {
      throw new CatalogoInvalido(`el fragmento "${f.slug}" está dos veces en el manifiesto`);
    }
    // El último paso de la escalera reproduce hasta el segundo 15: un fragmento más
    // corto le devolvería silencio justo al jugador que pidió todo el audio.
    if (f.duracionSeg + 0.15 < DURACION_FRAGMENTO_SEG) {
      throw new CatalogoInvalido(
        `el fragmento "${f.slug}" dura ${f.duracionSeg} s y la escalera llega a ` +
          `${DURACION_FRAGMENTO_SEG} s: el último paso sonaría a silencio`,
      );
    }
    indice.set(f.slug, f);
  }

  return indice;
}

/**
 * Arma el catálogo entero.
 *
 * `temasConLetra` es opcional: sin él, el juego funciona igual y el reveal no ofrece el
 * enlace a la letra. Es el mismo criterio que `arte.ts` usa con los recortes — un
 * insumo que todavía no está no puede romper la pantalla.
 */
export function catalogo(
  manifiesto: Manifiesto,
  temasConLetra: readonly TemaConLetra[] = [],
): Catalogo {
  const delDisco = leerTemas();

  // Slugs primero, para poder validar el manifiesto contra ellos.
  const conSlug = delDisco.map((t) => ({ ...t, slug: slugDeTitulo(t.titulo) }));

  const vistos = new Map<string, string>();
  for (const t of conSlug) {
    const choque = vistos.get(t.slug);
    if (choque) {
      throw new CatalogoInvalido(
        `dos temas dan el mismo slug "${t.slug}": "${choque}" y "${t.titulo}". ` +
          `El slug nombra el archivo de audio (CTR-01.4), así que uno taparía al otro.`,
      );
    }
    vistos.set(t.slug, t.titulo);
  }

  const fragmentos = indexarFragmentos(manifiesto, new Set(conSlug.map((t) => t.slug)));

  const porFicha = new Map(FICHAS.map((f) => [f.slug, f]));
  const letraPorTitulo = new Map(temasConLetra.map((t) => [normalizarDuro(t.titulo), t.slug]));

  const temas: TemaDelJuego[] = conSlug.map((t) => {
    const ficha = porFicha.get(t.disco);
    if (!ficha) throw new CatalogoInvalido(`"${t.titulo}" declara un disco desconocido: ${t.disco}`);
    const frag = fragmentos.get(t.slug);
    return {
      slug: t.slug,
      titulo: t.titulo,
      disco: t.disco,
      discoTitulo: ficha.titulo,
      pista: t.pista,
      anio: ficha.anio,
      jugable: frag !== undefined,
      entero: frag?.entero ?? false,
      letra: letraPorTitulo.get(normalizarDuro(t.titulo)) ?? null,
    };
  });

  const discos: DiscoDelJuego[] = FICHAS.map((f) => {
    const suyos = temas.filter((t) => t.disco === f.slug);
    return {
      slug: f.slug,
      titulo: f.titulo,
      anio: f.anio,
      total: suyos.length,
      jugables: suyos.filter((t) => t.jugable).length,
    };
  });

  return { temas, discos, jugables: temas.filter((t) => t.jugable).length };
}

/**
 * El pozo del que se sortea, según lo que eligió el jugador.
 *
 * `disco` en `null` es "todos los temas". Devolver un pozo vacío es un estado válido y
 * la pantalla lo sabe manejar: significa "de este disco todavía no hay audio".
 */
export function pozo(cat: Catalogo, disco: string | null): readonly TemaDelJuego[] {
  return cat.temas.filter((t) => t.jugable && (disco === null || t.disco === disco));
}
