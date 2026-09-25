/**
 * El pozo de "Más o menos" (`US-10`): de dónde sale cada pregunta (`D-48` punto 4, `CTR-20`).
 *
 * Corre en build. Recibe todo ya leído —el banco del juego, la discografía de `RES-20`, el
 * conteo de setlist.fm, el cancionero— y devuelve la lista de `Dato` que viaja a la isla.
 * Sin `node:fs` acá adentro: la página lee los archivos y el test le pasa los mismos.
 *
 * ## Por qué casi nada de esto está escrito a mano
 *
 * `D-13`: un número que vive en dos lugares se desincroniza el primer día que alguien
 * corrige uno. El año de *Oktubre*, lo que dura *Jijiji* y en cuántos setlists figura ya
 * están en fichas del repo; acá se derivan. Lo único que el banco del juego carga a mano son
 * los números que no existen en ningún otro lado —los de la banda, de `INV-100`—, cada uno
 * con su ficha.
 *
 * ## Las dos trampas de `RES-20`, cerradas acá
 *
 * - **Cuántos temas tiene *Gulp!*: 11 o 12**, según cuente el track oculto. *Gulp!* no entra
 *   a "cuántos temas tiene".
 * - **Cuántos discos son: 9 o 10.** No hay ninguna pregunta que lo derive.
 */

import type { Dato, Familia, TemaDeLaLista } from './partida.ts';
import type { Escala } from './referencia.ts';
import { temasDe, type Corpus } from './conteo.ts';
import { slugDeTitulo } from '../texto.ts';

// ─── El banco del juego, como está en `src/data/mas-o-menos.json` ─────────────────────

export type Estado = 'listo' | 'borrador' | 'retirado';

/** Un dato cargado a mano (`CTR-20`): solo las tres familias de la banda. */
export interface DatoCrudo {
  readonly id: string;
  readonly familia: 'la-banda' | 'la-gente' | 'los-recitales';
  readonly medida: string;
  readonly pregunta: string;
  /** Lo que se nombra cuando va de referencia de un par. Obligatorio si la medida es compartida. */
  readonly sujeto?: string;
  readonly valor: number;
  readonly escala: Escala;
  readonly unidad?: readonly [string, string];
  readonly firmeza: 'hecho' | 'segun';
  readonly segun?: string;
  readonly fuente: string;
  readonly explicacion?: string;
  readonly estado: Estado;
  readonly notaInterna?: string;
}

export interface PalabraCruda {
  readonly id: string;
  readonly palabra: string;
  readonly formas: readonly string[];
  readonly noCuentan?: readonly { readonly forma: string; readonly porque: string }[];
  readonly estado: Estado;
  readonly notaInterna?: string;
}

export interface BancoCrudo {
  readonly contrato: string;
  readonly contratoVersion: number;
  readonly actualizado: string;
  readonly datos: readonly DatoCrudo[];
  readonly palabras: readonly PalabraCruda[];
}

// ─── Lo que llega de las otras fuentes ────────────────────────────────────────────────

export interface DiscoConAnio {
  readonly disco: string;
  readonly anio: number;
  readonly temas: number;
}

export interface TemaConSegundos {
  readonly titulo: string;
  readonly segundos: number | null;
}

export interface FilaDeSetlist {
  readonly titulo: string;
  readonly veces: number;
  readonly slug?: string;
  /** Otra grafía del mismo tema, que la gente cargó aparte (`CTR-19.2`). */
  readonly grafiaDe?: string;
}

/** El conteo de setlist.fm, lo que `datos.ts` necesita de él (`CTR-19`). */
export interface ConteoDeSetlist {
  readonly pagina: string;
  readonly consultado: string;
  readonly setlistsCargados: number;
  readonly temas: readonly FilaDeSetlist[];
}

/**
 * Lo que viaja a la isla (`CTR-20.8`): los datos, y una sola vez por familia lo que el
 * rótulo necesita — el enlace y la fecha de setlist.fm (`RNF-CTR-19-A`) y cuántos temas se
 * contaron para las palabras (`RNF-CTR-20-C`).
 */
export interface PozoDeLaIsla {
  readonly datos: readonly Dato[];
  readonly enVivo: { readonly pagina: string; readonly consultado: string; readonly setlistsCargados: number } | null;
  readonly palabras: { readonly contados: number; readonly total: number } | null;
}

/**
 * Los textos de las familias derivadas. Los escribe `contenido` (`CNT-25`) y viven en
 * `copy.ts`; acá solo se declara qué hace falta, para que `datos.ts` no tenga una sola
 * cadena visible adentro (`voz.test.ts` audita los `copy.ts`, no esto).
 */
export interface Plantillas {
  readonly anioDisco: {
    readonly pregunta: (disco: string) => string;
    readonly fuente: string;
  };
  readonly temasDisco: {
    readonly pregunta: (disco: string) => string;
    readonly fuente: string;
    readonly unidad: readonly [string, string];
  };
  readonly duracion: {
    readonly pregunta: (tema: string) => string;
    readonly fuente: string;
  };
  readonly enVivo: {
    readonly pregunta: (tema: string) => string;
    readonly fuente: (setlistsCargados: number) => string;
    readonly unidad: readonly [string, string];
  };
  readonly palabra: {
    readonly pregunta: (palabra: string) => string;
    readonly fuente: (contados: number, total: number) => string;
    readonly unidad: readonly [string, string];
  };
  /** La fuente de un dato a mano: "hecho" cita la ficha; "según" nombra a quien lo dijo. */
  readonly fuenteHecho: (ficha: string) => string;
  readonly fuenteSegun: (quien: string, ficha: string) => string;
}

export interface Fuentes {
  readonly banco: BancoCrudo;
  readonly discos: readonly DiscoConAnio[];
  readonly titulosDeDisco: Readonly<Record<string, string>>;
  readonly duraciones: readonly TemaConSegundos[];
  readonly setlist: ConteoDeSetlist;
  /** El título de cada tema de los 105 por su slug: el de `RES-20`, no el de la fuente. */
  readonly tituloDeSlug: ReadonlyMap<string, string>;
  readonly corpus: Corpus;
  /** Los temas de la discografía (105, `RES-20`), para decir cuántos se contaron de cuántos. */
  readonly totalDeTemas: number;
}

// ─── Las reglas de qué entra ──────────────────────────────────────────────────────────

/** `RES-20`, discrepancia 2: 11 o 12 según cuente el track oculto. No se pregunta. */
export const FUERA_DE_TEMAS_POR_DISCO: readonly string[] = ['gulp'];

/**
 * Los temas cuyo conteo de setlist.fm no es un número solo (`CTR-20.4`, regla y no lista).
 *
 * Queda afuera **todo slug al que apunte una línea `grafiaDe`**: la gente cargó el mismo tema
 * con otro nombre, y el número de su línea es un piso, no la cuenta (`CTR-19.2`). Hoy es uno
 * solo, *Mariposa Pontiac - Rock del país*: "Mariposa Pontiac" (43), "Rock del país" (37) y
 * "Mariposa Pontiac / Rock del país" (10). Sumarlas sería inventar; quedarse con una, mentir.
 * Si mañana aparece otra grafía, sale sola, sin que nadie se acuerde de sumarla a una lista.
 */
export function fueraDeEnVivo(temas: readonly FilaDeSetlist[]): ReadonlySet<string> {
  return new Set(temas.flatMap((t) => (t.grafiaDe ? [t.grafiaDe] : [])));
}

/**
 * El piso de setlists para preguntar por un tema en vivo.
 *
 * La cola del conteo (los que figuran en uno o dos setlists) es la parte que `RES-89` marca
 * como posiblemente incompleta (`completo: false`): ahí un número de 1 puede ser 2 mañana. De
 * tres para arriba el conteo está numerado en la página.
 */
export const MINIMO_EN_VIVO = 3;

/** Una palabra en un solo tema no tiene lado "menos" (`CTR-20.3`). */
export const MINIMO_DE_TEMAS_POR_PALABRA = 2;

/** Una medida `MM-NN` es la del propio dato; un nombre es compartida y va en par (`CTR-20.2`). */
export function esMedidaPropia(medida: string): boolean {
  return /^MM-\d{2,3}$/.test(medida);
}

function derivado(
  id: string,
  familia: Familia,
  medida: string,
  pregunta: string,
  sujeto: string,
  valor: number,
  escala: Escala,
  fuente: string,
  unidad?: readonly [string, string],
  techo?: number,
): Dato {
  return {
    id,
    familia,
    medida,
    pregunta,
    sujeto,
    valor,
    escala,
    fuente,
    ...(unidad ? { unidad } : {}),
    ...(techo !== undefined ? { techo } : {}),
  };
}

/**
 * El pozo entero: los datos `listo` a mano y los derivados.
 *
 * Tira si algo no cierra —un par sin sujeto, un "según" sin nombre, una palabra en menos de
 * dos temas—, porque un pozo roto tiene que romper el build, no la partida.
 */
export function armarPozo(f: Fuentes, p: Plantillas): Dato[] {
  const pozo: Dato[] = [];

  // La banda, a mano. La forma de la medida dice si va en par (`CTR-20.2`): `MM-NN` es la del
  // propio dato; un nombre la comparte, y el par necesita nombrar su referencia (`UX-34` §3.2).
  for (const d of f.banco.datos) {
    if (d.estado !== 'listo') continue;
    if (d.firmeza === 'segun' && !d.segun) throw new Error(`${d.id}: "según" sin nombre`);
    if (esMedidaPropia(d.medida)) {
      if (d.medida !== d.id) throw new Error(`${d.id}: la medida propia tiene que ser su id, y es ${d.medida}`);
      if (d.sujeto) throw new Error(`${d.id}: sujeto en una medida propia, que nunca va en par`);
    } else {
      if (!d.sujeto) throw new Error(`${d.id}: la medida ${d.medida} va en par y el dato no tiene sujeto`);
      if (d.firmeza === 'segun') throw new Error(`${d.id}: un "según" no puede ser referencia de un par`);
    }
    const fuente = d.firmeza === 'segun' ? p.fuenteSegun(d.segun!, d.fuente) : p.fuenteHecho(d.fuente);
    pozo.push({
      id: d.id,
      familia: d.familia,
      medida: d.medida,
      pregunta: d.pregunta,
      ...(d.sujeto ? { sujeto: d.sujeto } : {}),
      valor: d.valor,
      escala: d.escala,
      ...(d.unidad ? { unidad: d.unidad } : {}),
      fuente,
      ...(d.explicacion ? { explicacion: d.explicacion } : {}),
    });
  }

  // Los discos: el año de los diez, y cuántos temas tienen nueve (sin Gulp!).
  for (const disco of f.discos) {
    const titulo = f.titulosDeDisco[disco.disco] ?? disco.disco;
    pozo.push(
      derivado(`anio-${disco.disco}`, 'los-discos', 'anio-disco', p.anioDisco.pregunta(titulo), titulo, disco.anio, 'anio', p.anioDisco.fuente),
    );
    if (FUERA_DE_TEMAS_POR_DISCO.includes(disco.disco)) continue;
    pozo.push(
      derivado(
        `temas-${disco.disco}`,
        'los-discos',
        'temas-disco',
        p.temasDisco.pregunta(titulo),
        titulo,
        disco.temas,
        'entero',
        p.temasDisco.fuente,
        p.temasDisco.unidad,
      ),
    );
  }

  // Lo que dura un tema: solo los que `RES-20` midió.
  const vistos = new Set<string>();
  for (const t of f.duraciones) {
    if (t.segundos === null) continue;
    const id = `dura-${slugDeTitulo(t.titulo)}`;
    if (vistos.has(id)) throw new Error(`dos temas con el mismo slug de duración: ${id}`);
    vistos.add(id);
    pozo.push(derivado(id, 'lo-que-dura', 'duracion', p.duracion.pregunta(t.titulo), t.titulo, t.segundos, 'segundos', p.duracion.fuente));
  }

  // En vivo: los temas de los 105, con número inequívoco y del piso para arriba. El techo son
  // los setlists cargados: la referencia no puede pedir más de los que hay.
  const fuera = fueraDeEnVivo(f.setlist.temas);
  const fuenteEnVivo = p.enVivo.fuente(f.setlist.setlistsCargados);
  for (const fila of f.setlist.temas) {
    if (!fila.slug || fuera.has(fila.slug) || fila.veces < MINIMO_EN_VIVO) continue;
    const titulo = f.tituloDeSlug.get(fila.slug);
    if (!titulo) throw new Error(`setlist.fm: ${fila.slug} no es uno de los 105`);
    pozo.push(
      derivado(
        `vivo-${fila.slug}`,
        'en-vivo',
        'en-vivo',
        p.enVivo.pregunta(titulo),
        titulo,
        fila.veces,
        'entero',
        fuenteEnVivo,
        p.enVivo.unidad,
        f.setlist.setlistsCargados,
      ),
    );
  }

  // Las palabras: en cuántos temas del cancionero, con la lista para auditarlo. El techo son
  // los temas contados.
  const fuentePalabras = p.palabra.fuente(f.corpus.temas.length, f.totalDeTemas);
  for (const palabra of f.banco.palabras) {
    if (palabra.estado !== 'listo') continue;
    const temas: TemaDeLaLista[] = temasDe(palabra, f.corpus).map(({ slug, titulo }) => ({ slug, titulo }));
    if (temas.length < MINIMO_DE_TEMAS_POR_PALABRA) {
      throw new Error(`${palabra.id}: "${palabra.palabra}" aparece en ${temas.length} temas, y el piso es 2`);
    }
    pozo.push({
      ...derivado(
        `palabra-${palabra.id.toLowerCase()}`,
        'las-palabras',
        'palabra',
        p.palabra.pregunta(palabra.palabra),
        palabra.palabra,
        temas.length,
        'entero',
        fuentePalabras,
        p.palabra.unidad,
        f.corpus.temas.length,
      ),
      formas: palabra.formas,
      temas,
    });
  }

  return pozo;
}

/** El pozo tal como viaja a la isla (`CTR-20.8`). */
export function pozoDeLaIsla(f: Fuentes, p: Plantillas): PozoDeLaIsla {
  const datos = armarPozo(f, p);
  return {
    datos,
    enVivo: datos.some((d) => d.familia === 'en-vivo')
      ? { pagina: f.setlist.pagina, consultado: f.setlist.consultado, setlistsCargados: f.setlist.setlistsCargados }
      : null,
    palabras: datos.some((d) => d.familia === 'las-palabras')
      ? { contados: f.corpus.temas.length, total: f.totalDeTemas }
      : null,
  };
}
