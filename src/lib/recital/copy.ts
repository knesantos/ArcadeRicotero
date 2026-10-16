/**
 * El texto de los recitales (`D-72`): el juego "Armá tu recital" y la página "En vivo" de la
 * Redondopedia. Todo lo que se lee de las dos vive acá, porque `voz.test.ts` audita los
 * módulos de copy y no el código suelto de una isla.
 *
 * ## Los registros (`voz-ricotera.md` §5)
 *
 * - **Registro 1, el que canta**: el título del juego, la bajada del casete, el encabezado de
 *   la lista armada. Ocho palabras de techo y un imperativo voseado.
 * - **Registro 2, el que cuenta**: la entrada de la página "En vivo". Corta, y declara la duda
 *   de frente: hay muy pocas listas enteras y muchas a medias.
 * - **Registro 3, el que rotula**: las fuentes, las licencias, cuánto dura, los nombres
 *   accesibles. Secos. Ningún "figura" se vuelve "se tocó" (`CTR-19.3`), y nada dice "el más
 *   popular" (`D-45` punto 3).
 *
 * ## La regla del juego, en cada palabra
 *
 * Como en "Ponelos en fila" (`BR-22`), no hay lista correcta: ni puntaje, ni "acertaste", ni
 * una lista de verdad contra la cual medirse. El juego deja mirar las de verdad, en la otra
 * página, y nunca las usa para corregir a nadie.
 */

export const PANTALLA_0 = {
  /** Registro 1: tres palabras, imperativo voseado. */
  titulo: 'Armá tu recital',
  /** Registro 3: el mecanismo entero, y que no hay lista correcta, antes de tocar nada. */
  /**
   * Registro 3: el mecanismo entero y lo que es. Desde la enmienda de `D-72` es una expresión
   * de deseo —el recital que te gustaría, hoy—, no una noche que pasó, y lo dice.
   */
  subtitulo:
    'El recital que te gustaría, esta noche. Elegí dónde —un estadio, un teatro, un descampado o donde digas—, ' +
    'poné los temas en orden y guardá algunos para los bises. Suena un pedazo de cada uno. No hay lista correcta.',
  boton: 'Elegí dónde',
} as const;

export const LUGAR = {
  /** Registro 3: el encabezado de la elección. */
  titulo: 'Dónde tocan',
  /**
   * Registro 3: qué es esta lista. Son lugares de verdad y **no dice que la banda haya tocado
   * en ellos**: es una expresión de deseo (`D-72`, enmienda del 2026-10-15).
   */
  fuente: 'Es una expresión de deseo: dónde te gustaría que fuera esta noche. Si no está, escribilo.',
  /** Las cuatro pestañas. */
  estadios: 'Estadios',
  teatros: 'Teatros',
  descampadoPestana: 'Un descampado',
  otro: 'Otro lugar',
  /** Cómo se nombra el descampado elegido, en la hoja y en el sello. */
  descampado: 'Un descampado',
  enDescampado: (localidad: string) => `Un descampado en ${localidad}`,
  /** Registro 1: la línea que canta del descampado. Una imagen física y nada más. */
  descampadoBajada: 'A cielo abierto, con barro y la gente llegando de todos lados.',
  localidad: 'La localidad',
  elegirDescampado: 'Elegí ese descampado',
  faltaLocalidad: 'Escribí la localidad.',
  /** Registro 3: el lugar que no está en la lista. */
  otroBajada: 'El que no está acá: una cancha, un club, la terraza de tu casa.',
  nombre: 'El lugar',
  ciudad: 'La ciudad, si querés',
  elegirOtro: 'Elegí ese lugar',
  faltaNombre: 'Escribí el lugar.',
} as const;

export const ARMADO = {
  /** Registro 3: el sello de arriba de la hoja, con el lugar que se eligió. */
  sello: (lugar: string) => `Esta noche: ${lugar}`,
  cambiarLugar: 'Cambiá el lugar',
  /** En la puerta, si quedó una lista a medio armar en este navegador. */
  retomar: (lugar: string) => `Seguí con la lista de ${lugar}`,
  rotuloLista: 'LA LISTA',
  rotuloBises: 'BISES',
  /** Registro 3: la hoja en blanco dice qué hacer, sin chiste. */
  vacia: 'La lista está en blanco. Tocá un tema de abajo: se suma y suena.',
  sinBises: 'Sin bises. Bajá el último de la lista para que salga a pedido de la gente.',
  /** Registro 3: cuántos y cuánto dura, ya formateado. */
  cuenta: (n: number, dura: string) => `${n} ${n === 1 ? 'tema' : 'temas'} · ${dura}`,
  faltan: (n: number) => (n === 1 ? 'Falta uno para salir a tocar.' : `Faltan ${n} para salir a tocar.`),
  lleno: 'No entra otro. Sacá alguno para hacer lugar.',
  /** Las acciones del tema marcado. Imperativo voseado con el pronombre pegado. */
  subir: 'Subila',
  bajar: 'Bajala',
  alBis: 'Al bis',
  aLaLista: 'A la lista',
  escuchar: 'Escuchala',
  parar: 'Pará',
  sacar: 'Sacala',
  /** Nombres accesibles de cada renglón de la lista. */
  renglon: (n: number, titulo: string, bis: boolean) => `${bis ? 'Bis' : 'Tema'} ${n}: ${titulo}. Tocalo para moverlo.`,
  /** El cajón de temas. */
  cajon: 'Los temas',
  todos: 'Todos',
  /** El nombre del grupo de tapas que filtra el cajón (lector de pantalla). */
  discos: 'Los discos',
  /** La línea debajo de la tira de tapas: qué se está mirando. */
  discoElegido: (titulo: string, anio: number) => `${titulo} · ${anio}`,
  losCiento: 'Los ciento cinco, disco por disco',
  buscar: 'Buscá un tema',
  sinResultados: (q: string) => `Ningún tema dice «${q}».`,
  /** El sello de lo que suena, en el pie y en la hoja de la noche. Registro 3. */
  suenaSello: 'SUENA',
  yaEsta: 'EN LA LISTA',
  sinRecorte: 'Sin recorte',
  agregarAria: (titulo: string) => `Sumá ${titulo} a la lista`,
  sortear: 'Sorteá uno',
  silenciar: 'Silenciá',
  queSuene: 'Que suene',
  /** El botón que cierra la lista. Registro 1: un imperativo físico. */
  cerrar: 'SALÍ A TOCAR',
  /** La región viva: lo que pasa, dicho seco. Dice en qué tira quedó (`FIND-164`). */
  sumado: (titulo: string, n: number, bis: boolean) => (bis ? `${titulo}, bis ${n}.` : `${titulo}, el ${n} de la lista.`),
  movido: (titulo: string, n: number, bis: boolean) => `${titulo} queda ${bis ? 'de bis' : 'en la lista'}, el ${n}.`,
  sacado: (titulo: string) => `${titulo} sale de la lista.`,
} as const;

export const NOCHE = {
  /** Registro 1: el encabezado de la lista armada. Canta; el lugar lo nombra la línea de abajo. */
  titulo: 'La lista de esta noche',
  /** Registro 3: cuánto dura, y lo que no se pudo sumar. */
  dura: (dura: string, sinMedir: number) =>
    `Dura ${dura}, sumando lo que dura cada tema en su disco.` +
    (sinMedir === 0
      ? ''
      : sinMedir === 1
        ? ' Uno no tiene la duración medida y no se cuenta.'
        : ` ${sinMedir} no tienen la duración medida y no se cuentan.`),
  escuchar: 'ESCUCHÁ LA LISTA',
  parar: 'PARÁ',
  /** Registro 3: qué suena, para que nadie espere los temas enteros. */
  comoSuena: 'Suenan diez segundos de cada tema, en el orden de la lista, con los bises al final.',
  sonando: (n: number, total: number) => `Suena el ${n} de ${total}.`,
  /** Registro 3, seco: solo cuando sonó hasta el final (`FIND-165`). */
  termino: 'Terminó la lista.',
  compartir: 'Compartí',
  copiado: 'La dirección quedó copiada.',
  aManoTitulo: 'La dirección, para copiarla a mano:',
  bajar: 'Bajá la hoja',
  cambiar: 'Cambiá la lista',
  otra: 'Armá otra',
  volver: 'Volvé al fichín',
  deVerdad: 'Mirá listas de recitales de verdad',
  /** Cuando la lista llegó por un enlace. Registro 3. */
  ajena: 'TE PASARON ESTA LISTA',
  laTuya: 'Armá la tuya',
  paraCompartir: (lugar: string) => `Mi lista para ${lugar}.`,
  /** La lista que te pasaron, cuando la reenviás: no es tuya (`REV-23`, diferido). */
  paraReenviar: (lugar: string) => `Una lista para ${lugar}.`,
} as const;

/** Lo que se imprime adentro de la hoja que sale del sitio (`scripts/lamina.ts`). */
export const IMPRESO = {
  juego: 'Armá tu recital',
  lista: 'La lista',
  bises: 'Bises',
  sinBises: 'Sin bises',
  /** Registro 3: el renglón de la cuenta, en la hoja. */
  cuenta: (n: number, dura: string) => `${n} ${n === 1 ? 'tema' : 'temas'} · ${dura}`,
  credito: 'Patricio Rey y sus Redonditos de Ricota. Sitio de fans, sin fines de lucro.',
} as const;

/**
 * La página "En vivo" de la Redondopedia (`IDEA-15`, `D-72`).
 *
 * Los rótulos de las fuentes son los que `CTR-19.9` exige en el mismo bloque que el dato:
 * para el conteo, qué mide, de dónde sale y cuándo se consultó (`RNF-CTR-19-A`); para una
 * lista entera, la fuente con su enlace, su licencia, qué le cambió el sitio y bajo qué
 * licencia la ofrece (`RNF-CTR-19-B`).
 */
export const EN_VIVO = {
  /** Registro 1: el título de la página. */
  titulo: 'En vivo',
  /** Registro 2: la entrada. Declara la duda (§3.3): casi todo lo que hay es a medias. */
  bajada:
    'Lo que tocaron, noche por noche, según lo que la gente anotó. ' +
    'Las listas que el sitio puede copiar van acá, tema por tema: casi todas las pasó alguien de un casete pirata, ' +
    'y nadie las revisó. De las demás noches, lo que más aparece y dónde mirarlas.',
  /** Registro 3: el renglón de lugar de la Redondopedia (`CNT-13`). */
  dondeEstas: 'Tenés una entrada vieja en la billetera.',

  enteras: {
    /**
     * Sin número y sin "enteras" (`REV-23`, `FIND-160`): ninguna fuente dice que estén completas,
     * y cada lista que entre aparece sola, sin tocar este texto.
     */
    titulo: 'Noche por noche, tema por tema',
    /**
     * Registro 3: qué suena cuando se escucha una de estas listas (`FIND-159`). No es el audio de
     * esa noche, y lo dice.
     */
    comoSuena:
      'Suenan diez segundos de cada tema, de la versión del disco: no es el audio de esa noche. ' +
      'Los que no tienen recorte se saltean.',
    /** Registro 3: la fecha y el lugar de una lista. */
    /** Cuando la fuente solo nombra la ciudad, el lugar es la ciudad y no se repite. */
    encabezado: (fecha: string, lugar: string, ciudad: string) =>
      lugar === ciudad ? `${fecha} · ${ciudad}` : `${fecha} · ${lugar}, ${ciudad}`,
    temas: (n: number) => (n === 1 ? '1 tema' : `${n} temas`),
    /**
     * `D-72`, pedido del usuario: las listas de Discogs van rotuladas como cargadas por la gente
     * y sin revisar. El sello en el resumen y el texto entero en el rótulo. Registro 3.
     */
    selloSinRevisar: 'SIN REVISAR',
    revision: 'Revisión:',
    textoSinRevisar:
      'La cargó la gente y nadie la revisó. Puede faltar algún tema, y la fecha o algún título pueden estar mal.',
    aviso: 'Aviso:',
    escuchar: 'Escuchá la lista',
    /** El botón de cada tema: una palabra, para que entre al lado del título en 375 px. */
    corto: 'Escuchá',
    parar: 'Pará',
    bis: (n: number) => (n === 1 ? 'Bis' : n === 2 ? 'Segundo bis' : n === 3 ? 'Tercer bis' : `Bis ${n}`),
    /** Registro 3: un título que no es de los diez discos. */
    fuera: {
      inedito: 'Inédito: no está en los diez discos.',
      cover: 'De otro autor.',
      intro: 'Una introducción, no un tema.',
      cantico: 'Lo canta la gente.',
      'sin-identificar': 'Sin identificar.',
    } as Readonly<Record<string, string>>,
    sinRecorte: 'Sin recorte',
    /** `RNF-CTR-19-B`, en piezas. */
    fuente: 'Fuente:',
    paginaDelRecital: 'la página de este recital',
    licenciaDeLaFuente: 'Licencia de la fuente:',
    cambios: 'Qué le hizo el sitio:',
    ofrecida: 'Licencia de esta lista en el sitio:',
    completitud: {
      completa: 'La fuente dice que la lista está completa.',
      parcial: 'La fuente dice que la lista está incompleta.',
      'sin-declarar': 'La fuente no dice si la lista está completa.',
    } as Readonly<Record<string, string>>,
  },

  mas: {
    titulo: 'Lo que más aparece en las listas',
    /**
     * `RNF-CTR-19-A`: qué mide, de dónde sale y cuándo. Dice "figura", nunca "se tocó", y no
     * dice "el más popular".
     */
    rotulo: (setlists: number, fecha: string) =>
      `Cuántas veces figura cada tema en las ${setlists} listas que cargó la gente en setlist.fm. ` +
      `No es cuántas veces lo tocaron. Consultado el ${fecha}.`,
    enlace: 'Mirá el conteo en setlist.fm',
    veces: (n: number) => (n === 1 ? 'figura 1 vez' : `figura ${n} veces`),
    losDemas: (n: number) => `Los otros ${n}`,
  },

  indice: {
    titulo: 'Más noches, en setlist.fm',
    /** Registro 3: por qué acá va el enlace y no la lista (`CTR-19.1`). */
    rotulo:
      'Estas listas no se copian acá: setlist.fm deja mirarlas, no copiarlas. Va la fecha, el lugar y el enlace. ' +
      'No están todas las noches: son las que el sitio anotó.',
    enlace: 'Mirá la lista',
  },

  armala: 'Armá tu recital',
  /** El nombre de los saltos de arriba (lector de pantalla). */
  saltos: 'En esta página',
  /** El enlace desde la portada de la Redondopedia. */
  enLaPortada: {
    titulo: 'En vivo',
    resumen: 'Las listas de los recitales: las que el sitio puede copiar, lo que más aparece en las demás y dónde mirarlas.',
  },
} as const;
