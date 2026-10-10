/**
 * El texto de "Ponelos en fila" (`US-08`).
 *
 * Todo lo que el jugador lee vive acá y en ningún otro lado, incluidos los nombres de los
 * conjuntos y los rótulos que solo escucha quien usa lector de pantalla. No es prolijidad:
 * **`voz.test.ts` audita los módulos de copy y no el código suelto**, y ya se llevó puestas
 * dos tandas de cadenas que vivían adentro de una isla — `"Link copiado."` estuvo tres
 * ciclos en producción con un anglicismo que `D-17` veta, escondido por vivir en el lugar
 * equivocado.
 *
 * ## Los tres registros, y dónde vive cada uno
 *
 * `.claude/rules/voz-ricotera.md` §5 reparte:
 *
 * - **Registro 1, el que canta**: el título del juego, la bajada de cada conjunto, el
 *   encabezado de la lámina. Ocho palabras como techo, segunda persona o imperativo, una
 *   imagen física.
 * - **Registro 2, el que cuenta**: nada. Este juego no cuenta nada — no hay explicación
 *   post-respuesta porque no hay respuesta.
 * - **Registro 3, el que rotula**: las cuatro filas, la bandeja, los avisos de la región
 *   viva, los nombres accesibles. Secos. **Acá el sitio se saca la voz**, y en este juego
 *   eso importa más que en ningún otro: una fila con onda es una fila que parece un
 *   premio, y `BR-22` dice que ninguna lo es.
 *
 * ## La regla que gobierna cada palabra de este archivo
 *
 * Ni un comparativo, ni un superlativo, ni un juicio. No hay "los mejores", no hay "tu
 * podio", no hay "acertaste". Las cuatro filas son **cuánto te mueve el cuerpo** (`D-52`), y
 * el texto tiene que sonar a alguien contando cómo se mueve la gente, no a alguien
 * corrigiendo una prueba.
 */

export const PANTALLA_0 = {
  /** Registro 1: tres palabras, imperativo voseado, y nombra la mecánica sin traducirla. */
  titulo: 'Ponelos en fila',
  /**
   * Registro 3. Dice el mecanismo y **avisa que no hay orden correcto**, que es lo único
   * que alguien podría entender mal antes de tocar: el que llega esperando un puntaje
   * tiene que enterarse acá y no al final.
   */
  subtitulo: 'Elegí qué repartir. Te toca una por vez, las filas las nombrás vos, y no hay orden correcto.',
  /** Registro 1: imperativo voseado, y dice lo primero que hay que hacer. */
  boton: 'Elegí qué repartir',
  volver: 'AL FICHÍN',
} as const;

export const ELECCION = {
  /** Registro 3: el encabezado de la lista de conjuntos. */
  titulo: 'Qué repartís',
  /** El renglón chico de cada conjunto. Se invoca con un número. */
  cuantas: (n: number) => `${n} fichas`,
  /**
   * La partida que quedó a medias (`D-69`). Con los ciento cinco temas, repartir de un saque
   * no es la regla: se sigue otro día, y la elección lo ofrece arriba de todo.
   */
  retomar: {
    /** Registro 3: el sello de la tarjeta. */
    rotulo: 'TE QUEDÓ A MEDIAS',
    /** Registro 1: imperativo voseado, y nombra qué se sigue. */
    boton: (conjunto: string) => `Seguí con ${conjunto}`,
    /** Registro 3: cuánto falta. Orientación, no medición (`BR-22`). */
    dato: (faltan: number, total: number) => `Faltan ${faltan} de ${total}`,
  },
} as const;

/**
 * Los conjuntos ordenables, con su nombre y su bajada.
 *
 * **Los nombres son descripciones, no promesas.** "Los diez discos" es verificable
 * mirando la estantería; "Los imprescindibles" sería una afirmación sobre la obra, que es
 * justo lo que `BR-22` prohíbe que el sitio haga.
 */
export const CONJUNTOS = {
  /**
   * Los dos conjuntos de discos tienen las mismas diez fichas y **son preguntas
   * distintas**: uno ordena el disco, el otro ordena el dibujo. Por eso uno se lee y el
   * otro se mira — servir los dos con la tapa los volvería la misma pantalla dos veces.
   */
  discos: {
    nombre: 'Los diez discos',
    bajada: 'Del ochenta y cinco al dos mil, sin tapas.',
  },
  tapas: {
    nombre: 'Las diez tapas',
    bajada: 'Rocambole dibujó; vos las ordenás.',
  },
  abren: {
    nombre: 'Los que abren',
    bajada: 'El primero de cada disco, uno al lado del otro.',
  },
  cierran: {
    nombre: 'Los que cierran',
    bajada: 'El último de cada disco, donde se apaga la púa.',
  },
  /**
   * Los 105 de un saque (`D-69`). El nombre es una descripción verificable, como el resto:
   * dice qué hay adentro y no promete nada sobre la obra.
   */
  todos: {
    nombre: 'Todos los temas',
    bajada: 'Los ciento cinco, cada uno con su disco.',
  },
  azar: {
    nombre: 'Doce al azar',
    bajada: 'Doce temas sorteados de los ciento cinco.',
  },
  /** Uno por disco. El nombre lo completa el título real, que sale de `FICHAS`. */
  temas: {
    nombre: (disco: string) => `Los temas de ${disco}`,
    bajada: (disco: string) => `El tracklist entero de ${disco}, para repartir.`,
  },
} as const;

export const PARTIDA = {
  /** La bandeja de lo que todavía no se ubicó. Registro 3. */
  bandeja: 'SIN UBICAR',
  /**
   * El rótulo de la ficha que está en la mano. **Es texto y no un color**, y por eso está
   * acá: `UX-01` pide que ningún estado se comunique solo con tinte, y en un tablero de
   * fichas chicas un borde dorado se pierde entre otros trece bordes.
   */
  enLaMano: 'EN LA MANO',
  /** Lo que dice la región viva al tomar una ficha. Seco. */
  tomaste: (titulo: string) => `${titulo}, en la mano.`,
  /** Al soltarla. Dice dónde quedó y cuántas faltan, y nada más. */
  ubicaste: (titulo: string, fila: string, restan: number) =>
    `${titulo}, ${fila}. Quedan ${restan} sin ubicar.`,
  /** Al sacarla de una fila: vuelve a la bandeja, nunca se borra. */
  sacaste: (titulo: string, restan: number) =>
    `${titulo}, de vuelta a la bandeja. Quedan ${restan} sin ubicar.`,
  /** Al soltar lo que tenías en la mano sin ubicarlo (la tecla de escape). */
  soltaste: (titulo: string) => `${titulo}, la soltaste.`,
  /** Cuando la bandeja queda vacía. No felicita: informa. */
  completa: 'No queda ninguna sin ubicar.',
  /**
   * El nombre accesible del botón de una fila. Dice el lugar y cuántas hay: quien no ve
   * la pantalla necesita las dos cosas para decidir.
   */
  ponerEn: (fila: string, cuantas: number) =>
    cuantas === 1 ? `${fila}, 1 puesta` : `${fila}, ${cuantas} puestas`,
  /** El nombre accesible de una ficha que está en una fila. */
  sacarDe: (titulo: string, fila: string) => `${titulo}, ${fila}`,
  /** El nombre accesible de una ficha que está en la bandeja. */
  tomar: (titulo: string) => `${titulo}, sin ubicar`,
  /** El renglón que aparece cuando la lista llegó por una dirección compartida. */
  llegoCompartida: 'Te compartieron esta lista',
  /** Borra todo y empieza de cero. */
  desarmar: 'Desarmala',
  /** Se puede compartir sin terminar; el botón lo dice y no lo esconde. */
  compartir: 'Compartí',
  /** Mientras se dibuja la lámina. Un botón mudo se toca dos veces. */
  armando: 'Armando la lámina',

  /* ---- El mazo (`D-69`): repartir de a una ---- */

  /** El sello de la ficha que te toca. Registro 3. */
  laQueSigue: 'LA QUE SIGUE',
  /** El sello cuando tomaste una que ya estaba puesta, para cambiarla de fila. */
  laEstasMoviendo: 'LA ESTÁS MOVIENDO',
  /** El sello del mazo vacío. Informa, no felicita (`BR-22`). */
  mazoVacio: 'SIN NADA EN EL MAZO',
  /** Cuántas quedan. Orientación, como el "3 de 10" de los dos ejes. */
  quedan: (n: number, total: number) => `Quedan ${n} de ${total}`,
  /** El nombre accesible de cada botón de fila del mazo: dice qué pasa al tocarlo. */
  mandarA: (fila: string, cuantas: number) =>
    cuantas === 1 ? `Mandala a ${fila}, que tiene 1` : `Mandala a ${fila}, que tiene ${cuantas}`,
  /**
   * Escuchar un pedazo del tema: los recortes de diez segundos de "Adiviná el tema". Suenan
   * solos al tocarte una ficha (pedido del usuario, `D-69`); el botón vuelve a pasarlo.
   */
  escuchala: 'Escuchala',
  /** En una ficha de disco suena un tema de ese disco; el botón pasa otro. */
  escuchaOtro: 'Escuchá otro',
  /** El mismo botón mientras suena. */
  parala: 'Pará',
  /** El renglón que dice qué tema de un disco está sonando. Registro 3. */
  suena: (tema: string) => `Suena ${tema}`,
  /** El sonido de todo el tablero, prendido o apagado. Se acuerda en este navegador. */
  apagaSonido: 'Apagá el sonido',
  prendeSonido: 'Prendé el sonido',
  /** Pasa la que sigue al fondo del mazo. */
  salteala: 'Salteala',
  /** Abre el mazo entero, para elegir cuál sigue. */
  elegiOtra: 'Elegí otra',
  /** Cierra el mazo abierto y vuelve a la que sigue. */
  volveALaQueSigue: 'Volvé a la que sigue',
  /** Mezcla el orden del mazo. No toca dónde está nada. */
  mezcla: 'Mezclá el mazo',
  /** Deshace la última jugada: una ficha ubicada, una fila sacada. */
  deshace: 'Deshacé',
  /** Con una ficha puesta en la mano: la manda de nuevo al mazo. */
  devolvela: 'Devolvela al mazo',
  /** Con una ficha puesta en la mano: la suelta sin moverla. */
  dejala: 'Dejala donde estaba',
  /** El filtro del mazo abierto que muestra todos los discos. */
  filtroTodos: 'Todos',
  /** El nombre accesible del filtro de un disco. */
  filtroDe: (disco: string) => `Solo los de ${disco}`,
  /** Cuando el filtro deja la lista vacía. */
  filtroVacio: 'De ese disco no queda ninguna.',
  /** Lo que dice la región viva al saltear, al mezclar y al deshacer. Seco. */
  salteaste: (titulo: string) => `${titulo}, al fondo del mazo.`,
  mezclaste: 'El mazo, mezclado.',
  deshiciste: 'La última jugada, deshecha.',
  /** El renglón chico de una ficha de tema en la carta: el disco y la pista. */
  pieDeTema: (disco: string, pista: string) => `${disco} · pista ${pista}`,

  /* ---- Las filas propias (`D-69`) ---- */

  /** Abre y cierra la edición de las filas. */
  cambiaFilas: 'Cambiá las filas',
  listoFilas: 'Listo',
  /** Registro 3: la instrucción de la edición. */
  ayudaFilas: 'Tocá un nombre para cambiarlo. Van de dos a siete filas.',
  sumaFila: 'Sumá una fila',
  sacala: 'Sacala',
  deSiempre: 'Volvé a las de siempre',
  /** El nombre de una fila recién sumada, hasta que el jugador le ponga otro. */
  filaNueva: (n: number) => `FILA ${n}`,
  /** Los nombres accesibles de la edición. */
  nombreAria: (n: number) => `Nombre de la fila ${n}`,
  sacarAria: (fila: string) => `Sacá la fila ${fila}`,
  /** Lo que dice la región viva en la edición. */
  sumaste: (fila: string) => `${fila}, sumada al final.`,
  sacasteFila: (fila: string, vuelven: number) =>
    vuelven === 0
      ? `${fila}, afuera.`
      : vuelven === 1
        ? `${fila}, afuera. Una ficha volvió al mazo.`
        : `${fila}, afuera. ${vuelven} fichas volvieron al mazo.`,
  renombraste: (fila: string) => `La fila ahora se llama ${fila}.`,
  volvisteASiempre: 'Las filas de siempre, de vuelta.',
} as const;

export const LAMINA = {
  /** Registro 1: el encabezado de la lista terminada. Cinco palabras. */
  titulo: 'Así te quedó la fila',
  /** Registro 3 debajo del encabezado: qué conjunto es. */
  deQue: (conjunto: string) => `${conjunto}`,
  /** El renglón de una fila vacía en la lámina. Se dice, no se esconde. */
  vacia: 'Nadie',
  compartir: 'Compartí',
  denuevo: 'Armá otra',
  volver: 'Volvé al fichín',
  /** El respaldo de escritorio, cuando no hay menú del sistema. */
  copiado: 'La dirección quedó copiada.',
  aManoTitulo: 'La dirección, para copiarla a mano:',
  bajarLamina: 'Bajá la lámina',
  /** El texto que acompaña a la dirección al compartir. Registro 3. */
  paraCompartir: (conjunto: string) => `${conjunto}, repartidos a mano.`,
} as const;

/**
 * Lo que se imprime en la lámina PNG.
 *
 * Va aparte del resto porque la lámina **sale del sitio**: es la única pieza de este juego
 * que alguien puede ver sin haber entrado nunca, y por eso lleva encima el crédito de
 * `D-21` — adentro de la imagen, no en el pie de la pantalla, que no viaja con ella.
 */
export const IMPRESO = {
  juego: 'Ponelos en fila',
  /**
   * El crédito, impreso en la pieza (`D-21`, condición 1). **Son dos y no uno**, y la
   * diferencia importa: una lámina de discos lleva las diez tapas dibujadas adentro y
   * tiene que nombrar a Rocambole; una de temas es texto y nada más, y firmarle a él una
   * imagen donde no hay un trazo suyo sería un rótulo que miente sobre lo que hay adentro
   * — el mismo defecto que el proyecto persigue en las preguntas, del otro lado.
   */
  creditoConTapas: 'Arte de tapa: Rocambole (Ricardo Cohen). Sitio de fans, sin fines de lucro.',
  creditoSinTapas: 'Patricio Rey y sus Redonditos de Ricota. Sitio de fans, sin fines de lucro.',
  /** El rótulo del renglón chico: cuántas fichas se repartieron de cuántas. */
  rotuloCuantas: 'Fichas repartidas',
} as const;
