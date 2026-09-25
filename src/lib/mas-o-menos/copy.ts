/**
 * El texto de "Más o menos" (`US-10`).
 *
 * Lo escribió `contenido` en `CNT-25` y el hilo principal lo transcribe acá. Lo audita
 * `voz.test.ts`, que entra con el juego y no después (la lección de `dos-ejes`: un módulo
 * que llega tarde al barrido pasa un tiempo pareciendo auditado sin estarlo).
 *
 * La mecánica: una pregunta con respuesta de número y una referencia de la misma unidad.
 * El jugador dice si la respuesta real es más o menos (para años: antes o después) que la
 * referencia. Se juega hasta el primer error (`D-48`).
 */

import type { Familia, Tramo } from './partida.ts';
import type { Plantillas } from './datos.ts';

export const PANTALLA_0 = {
  /** Fijo: es la mecánica dicha en rioplatense (`D-48`). */
  titulo: 'Más o menos',
  /**
   * Regla de las dos líneas: el título ya nombra el juego, así que el subtítulo es el que
   * canta. Primera frase, ocho palabras.
   */
  subtitulo:
    'Tirás una ficha y no sabés cuál sale. Un número contra otro: decís más o menos, ' +
    'y seguís hasta la primera que erres.',
  /** Registro 3: de dónde salen los números, seco y corto (`UX-34` §3.1). */
  fuentes: 'Los números salen de fichas de investigación, del cancionero del sitio y de setlist.fm.',
  boton: 'Jugá',
  /**
   * Lo que dice la entrada cuando alguien llega por el desafío de un amigo. La racha es
   * abierta: no hay un "de T" que leer, así que `total` queda en la firma y no se nombra.
   */
  desafio: (puntaje: number, _total: number, nombre?: string) =>
    nombre ? `${nombre} llegó a una racha de ${puntaje}. ¿La superás?` : `Te desafiaron con una racha de ${puntaje}. ¿La superás?`,
} as const;

export type RotuloBoton = 'Más' | 'Menos' | 'Antes' | 'Después';

export const PARTIDA = {
  mas: 'Más',
  menos: 'Menos',
  antes: 'Antes',
  despues: 'Después',
  /**
   * El nombre accesible del botón: "Más que 12 años", "Antes de 1990". `antes`/`después`
   * van con "de"; `más`/`menos`, con "que".
   */
  nombreBoton: (boton: RotuloBoton, referenciaTexto: string): string =>
    `${boton} ${boton === 'Antes' || boton === 'Después' ? 'de' : 'que'} ${referenciaTexto}`,
  /** La racha en curso, chica y siempre a la vista. */
  racha: (n: number) => `Racha: ${n}`,
  /** El único grito del sitio es el acierto (`D-33`). */
  acierto: '¡La diste!',
  /** No dice "mal" ni "perdiste": el texto acompaña, no marca. */
  error: 'Ahí se cortó la racha.',
  seguir: 'Seguí',
  /** Registro 3: la fuente de un dato. */
  fuente: (texto: string) => `Fuente: ${texto}`,
  /** Para `firmeza: "segun"`: "Según Clarín". */
  segun: (quien: string) => `Según ${quien}`,
} as const;

/** El nombre corto de cada familia: el sello neutro de la cabecera (`UX-34` §3.2). */
export const FAMILIAS: Readonly<Record<Familia, string>> = {
  'la-banda': 'LA BANDA',
  'la-gente': 'LA GENTE',
  'los-recitales': 'LOS RECITALES',
  'los-discos': 'LOS DISCOS',
  'lo-que-dura': 'LO QUE DURA',
  'en-vivo': 'EN VIVO',
  'las-palabras': 'LAS PALABRAS',
};

/** Los tres encabezados del resultado, según la racha (0–2, 3–7, 8+). Registro 1. */
export const TRAMOS: Readonly<Record<Tramo, string>> = {
  bajo: 'Tirás la carta y cruzás los dedos.',
  medio: 'Le vas agarrando la mano.',
  alto: 'Se lo cantás de memoria.',
};

export const RESULTADO = {
  rotulo: 'Se terminó.',
  /** El rótulo de la cifra grande del resultado. */
  rotuloRacha: 'Tu racha',
  /** `localStorage`, clave `arcade.mas-o-menos.mejor` (`D-48`). */
  mejor: (n: number) => `Tu mejor racha: ${n}`,
  /** El encabezado de la pregunta que cortó la racha. */
  teCorto: 'Te cortó acá',
  /** Cuando se acaban las preguntas del pozo sin errar ninguna. */
  victoria: 'Se acabaron las preguntas. No le erraste a ninguna.',
  compartir: 'Compartí',
  deNuevo: 'Jugá de nuevo',
  volver: 'Volvé al arcade',
  /** `ADR-02`, forma `marcador`: `p` la racha, `t` la cantidad de preguntas del pozo. */
  paraCompartir: (racha: number) =>
    `Llegué a una racha de ${racha} en Más o menos, en el arcade ricotero. ¿La superás?`,
  copiado: 'Se copió el enlace.',
  aManoTitulo: 'Copiá esto y mandalo',
} as const;

/**
 * El detalle auditable de una palabra (`UX-34` §3.4): en el revelado de cada paso y en el
 * panel de lo que te cortó. No empieza con "Ver": `voz.test.ts` lo lee como infinitivo.
 */
export const DETALLE_PALABRA = {
  formasContadas: (formas: readonly string[]) => `Formas contadas: ${formas.join(', ')}.`,
  verEnCuales: 'EN CUÁLES TEMAS',
} as const;

/**
 * El bloque de setlist.fm al revelar un dato de `en-vivo` (`RNF-CTR-19-A`, `RNF-CTR-20-B`):
 * qué mide ya lo dice la pregunta y la fuente; esto suma el enlace a la página y la fecha,
 * en el mismo bloque. La enmienda de `BR-18` (b) para `US-10` deja el número grande porque
 * es la respuesta, a condición de que estas dos piezas estén al lado.
 */
export const EN_VIVO = {
  /**
   * La línea chica de la caja de referencia cuando la referencia es un dato de setlist.fm.
   * Sin enlace, a propósito: la página de estadísticas lista todos los conteos, y un enlace
   * antes de responder le regalaría la respuesta al que lo toca (`REV-16`, `FIND-84`; la
   * enmienda de `BR-18` (b) en `PRD-mas-o-menos.md`).
   */
  enCaja: (fecha: string) => `Según setlist.fm, consultado el ${fecha}.`,
  enlace: 'Mirá el conteo en setlist.fm',
  /** `fecha` ya viene como día-mes-año. */
  consultado: (fecha: string) => `Consultado el ${fecha}.`,
} as const;

/** Cómo se dice el número con su unidad, cuidando el singular (`CNT-25`). */
export const UNIDADES = {
  temas: ['tema', 'temas'],
  setlists: ['setlist', 'setlists'],
} as const satisfies Record<string, readonly [string, string]>;

/** Las líneas de fuente (registro 3) de las familias derivadas. */
export const FUENTES = {
  discos: 'RES-20, los tracklists de cada disco.',
  duracion: 'RES-20, la duración de cada tema en el disco.',
  /** El total real cargado en setlist.fm, no un número fijo (256 hoy, `RES-90`). */
  enVivo: (totalSetlists: number) => `Según setlist.fm, sobre ${totalSetlists} setlists cargados.`,
  /** Cuántos de los 105 tienen letra en el cancionero (hoy, 100). */
  palabra: (temasContados: number, total: number) =>
    `Del cancionero del sitio, sobre ${temasContados} de los ${total} temas.`,
  /** Un dato con ficha: "Fuente: RES-100." */
  hecho: (ficha: string) => `${PARTIDA.fuente(ficha)}.`,
  /** Un dato `segun`: nombra a quien lo dijo, y la ficha. */
  segun: (quien: string, ficha: string) => `${PARTIDA.segun(quien)} (${ficha}).`,
} as const;

/**
 * Las plantillas de las familias derivadas, en la forma que pide `datos.ts`.
 *
 * El nombre del disco, del tema o de la palabra va entre comillas latinas, como en el resto
 * del sitio: «Jijiji».
 */
export const PLANTILLAS: Plantillas = {
  anioDisco: {
    pregunta: (disco) => `¿En qué año salió «${disco}»?`,
    fuente: FUENTES.hecho(FUENTES.discos.replace(/\.$/, '')),
  },
  temasDisco: {
    pregunta: (disco) => `¿Cuántos temas tiene «${disco}»?`,
    fuente: FUENTES.hecho(FUENTES.discos.replace(/\.$/, '')),
    unidad: UNIDADES.temas,
  },
  duracion: {
    pregunta: (tema) => `¿Cuánto dura «${tema}»?`,
    fuente: FUENTES.hecho(FUENTES.duracion.replace(/\.$/, '')),
  },
  enVivo: {
    /** "Figura en" y no "se tocó": son setlists que carga la gente (`D-48`, `RES-90`). */
    pregunta: (tema) => `¿En cuántos setlists de setlist.fm figura «${tema}»?`,
    fuente: FUENTES.enVivo,
    unidad: UNIDADES.setlists,
  },
  palabra: {
    pregunta: (palabra) => `¿En cuántos temas aparece «${palabra}»?`,
    fuente: FUENTES.palabra,
    unidad: UNIDADES.temas,
  },
  fuenteHecho: FUENTES.hecho,
  fuenteSegun: FUENTES.segun,
};
