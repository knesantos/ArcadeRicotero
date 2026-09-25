/**
 * El número de "Más o menos" (`US-10`): **en cuántos temas del cancionero** aparece una
 * palabra.
 *
 * ## Por qué temas y no veces (`D-48`)
 *
 * El usuario pidió *"cuántas veces se dice en toda la discografía"*. Medido sobre el
 * cancionero el 2026-09-25, "veces" mide al que transcribió y no a la canción: *criminal*
 * suma 37 en un solo tema porque cifraclub escribió cada vuelta del estribillo, y otro
 * transcriptor lo habría escrito una vez con un `(x4)`. Un número que cambia según quién
 * tipeó la cifra es un rótulo que miente, y acá el número **es** la respuesta correcta
 * (`CLAUDE.md`: lo único estricto). "En cuántos temas" no depende de eso: la palabra está
 * en la letra o no está. Y se puede auditar — cada número viene con su lista de temas, y
 * cada tema tiene su letra en `/letras-y-acordes/`.
 *
 * ## Qué letra se cuenta
 *
 * **La misma que el cancionero del sitio muestra como letra** (`CTR-06`): las líneas
 * `t: "letra"` que no son anotación del transcriptor (`anotacion.ts`), con la marca de
 * tramo que a veces le cuelga al final recortada (`sinEtiquetaFinal`). No es el filtro
 * estricto de `versos.ts`: aquel descarta de más porque le cuesta poco, y acá descartar de
 * más le baja el número a una palabra que el jugador puede ir a buscar a la letra y
 * encontrar. Lo que el filtro laxo deja pasar —la jerga de guitarra— se ataja del otro
 * lado: ninguna palabra del juego puede ser de ese vocabulario (`conteo.test.ts`).
 *
 * ## Qué es "la palabra"
 *
 * Una lista de **formas escritas** que declara el dato, por palabra (`CTR-20`): *perro,
 * perros*. Coincide la forma exacta, en minúscula. No hay lematizador: uno automático se
 * equivoca en silencio, y la lista a la vista del jugador no se equivoca sin que se vea.
 * Las variantes de tilde que aparezcan en el corpus —*corazon* por *corazón*, pero también
 * *esta* contra *está*, que son dos palabras— tienen que estar declaradas de un lado o del
 * otro; `variantesSinDeclarar` es el que avisa.
 *
 * Sin `node:fs`: recibe el cancionero ya leído, así lo usan la página en build y el test.
 */

import { esAnotacion } from '../cancionero/anotacion.ts';
import { sinEtiquetaFinal } from '../cancionero/taller.ts';

/** Lo que este módulo lee de un tema del cancionero. */
export interface TemaContable {
  readonly slug: string;
  readonly titulo: string;
  readonly disco: string;
  readonly pista: number;
  readonly contenido: string;
  readonly secciones: readonly {
    readonly lineas: readonly { readonly t: string; readonly texto?: string }[];
  }[];
}

/** Una palabra del juego tal como la declara el dato. */
export interface PalabraDeclarada {
  readonly formas: readonly string[];
  readonly noCuentan?: readonly { readonly forma: string }[];
}

/** El tema, como lo necesita la pantalla que muestra en cuáles aparece. */
export interface TemaContado {
  readonly slug: string;
  readonly titulo: string;
  readonly disco: string;
}

/** Todo lo que el conteo sabe del corpus, armado una sola vez. */
export interface Corpus {
  /** Los temas que entraron a la cuenta, en el orden del cancionero. */
  readonly temas: readonly TemaContado[];
  /** Cada forma escrita (en minúscula) y los temas donde aparece, sin repetir. */
  readonly dondeAparece: ReadonlyMap<string, ReadonlySet<string>>;
}

/**
 * La forma con que se compara: minúscula y en NFC.
 *
 * NFC porque el mismo *é* puede venir compuesto o descompuesto según de qué página salió,
 * y dos bytes distintos para la misma letra harían dos palabras.
 */
export function formaDe(texto: string): string {
  return texto.normalize('NFC').toLocaleLowerCase('es');
}

/**
 * La clave sin tildes, para encontrar variantes. **Conserva la ñ**: *año* y *ano* no son
 * una palabra escrita de dos maneras.
 */
export function claveSinTildes(forma: string): string {
  return formaDe(forma)
    .normalize('NFD')
    .replace(/(?!̃)[̀-ͯ]/g, '')
    .normalize('NFC');
}

/**
 * Las palabras de una línea: las corridas de letras, en minúscula.
 *
 * Todo lo que no es letra corta —espacio, guion, apóstrofo, número—. *Mam--bo* son dos
 * pedazos, y ninguno es una palabra del juego.
 */
export function palabrasDe(texto: string): string[] {
  return (formaDe(texto).match(/\p{L}+/gu) ?? []).slice();
}

/** Las líneas que el cancionero muestra como letra, ya sin la marca final. */
export function lineasCantadas(tema: TemaContable): string[] {
  const salida: string[] = [];
  for (const seccion of tema.secciones) {
    for (const linea of seccion.lineas) {
      if (linea.t !== 'letra' || typeof linea.texto !== 'string') continue;
      if (!linea.texto.trim() || esAnotacion(linea.texto)) continue;
      salida.push(sinEtiquetaFinal(linea.texto));
    }
  }
  return salida;
}

/**
 * Arma el corpus: qué temas entran y dónde aparece cada forma.
 *
 * Entran los temas con `contenido: "letra"`. Los instrumentales y los que la fuente dio
 * solo en tablatura no suman cero a nadie: no están, y el rótulo lo dice con el total.
 */
export function armarCorpus(temas: readonly TemaContable[]): Corpus {
  const contados: TemaContado[] = [];
  const dondeAparece = new Map<string, Set<string>>();
  for (const tema of temas) {
    if (tema.contenido !== 'letra') continue;
    contados.push({ slug: tema.slug, titulo: tema.titulo, disco: tema.disco });
    for (const linea of lineasCantadas(tema)) {
      for (const palabra of palabrasDe(linea)) {
        let slugs = dondeAparece.get(palabra);
        if (!slugs) dondeAparece.set(palabra, (slugs = new Set()));
        slugs.add(tema.slug);
      }
    }
  }
  return { temas: contados, dondeAparece };
}

/**
 * En qué temas aparece una palabra, en el orden del cancionero (disco y pista).
 *
 * El número del juego es el largo de esta lista, y nunca otra cosa: así la lista que se
 * muestra y el número que se juega no pueden contar cosas distintas.
 */
export function temasDe(palabra: PalabraDeclarada, corpus: Corpus): TemaContado[] {
  const slugs = new Set<string>();
  for (const forma of palabra.formas) {
    for (const slug of corpus.dondeAparece.get(formaDe(forma)) ?? []) slugs.add(slug);
  }
  return corpus.temas.filter((t) => slugs.has(t.slug));
}

/**
 * Las formas del corpus que se escriben igual sin tildes que alguna forma declarada, y que
 * el dato no puso ni de un lado ni del otro.
 *
 * Es la guarda de la regla de formas. *corazon* sin tilde es *corazón* mal tipeado y tiene
 * que contar; *esta* no es *está* y no tiene que contar. La máquina no sabe cuál es cuál,
 * así que no decide: obliga a que alguien lo haya decidido por escrito. Si una ingesta nueva
 * trae una variante que nadie vio, esto la devuelve y el test falla.
 */
export function variantesSinDeclarar(palabra: PalabraDeclarada, corpus: Corpus): string[] {
  const declaradas = new Set([
    ...palabra.formas.map(formaDe),
    ...(palabra.noCuentan ?? []).map((n) => formaDe(n.forma)),
  ]);
  const claves = new Set(palabra.formas.map(claveSinTildes));
  const sueltas: string[] = [];
  for (const forma of corpus.dondeAparece.keys()) {
    if (claves.has(claveSinTildes(forma)) && !declaradas.has(forma)) sueltas.push(forma);
  }
  return sueltas.sort();
}
