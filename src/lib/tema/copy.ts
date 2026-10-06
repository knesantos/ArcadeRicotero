/**
 * El texto de "adiviná el tema" (`US-02`).
 *
 * Mismo criterio que `tapa/copy.ts` y `quiz/copy.ts`: lo visible vive en un módulo y no
 * desparramado en la pantalla. La voz es la de `CNT-02` y `D-17` — voseo en cada botón,
 * jerga en el tono y nunca en la barrera, sin una sola palabra en inglés.
 *
 * **Deuda declarada, igual que en `tapa/copy.ts`:** estas cadenas las puso el hilo
 * principal. Cuando `contenido` escriba la `CNT-XX` de este juego, este archivo se
 * transcribe de ahí y deja de ser criterio propio.
 *
 * Dos palabras que el juego de referencia usa y acá **no** se usan, por `D-17`:
 * "skip" es **pasar**, y el desplegable de sugerencias no es un "dropdown" ni un
 * "autocomplete": es **la lista**.
 */

export const PANTALLA_0 = {
  titulo: 'Adiviná el tema',
  subtitulo:
    'Con una décima te tiene que alcanzar. Si no, te damos más: medio segundo, dos, ' +
    'cuatro, ocho, diez. Cuanto antes la pegues, más vale.',
  /**
   * La tabla de lo que vale cada escalón, impresa en la portada.
   *
   * La bajada larga contaba la escalera en prosa —"medio segundo, dos, cuatro, ocho,
   * diez"— y el que llega de un enlace tenía que leer cuatro renglones para entender la
   * mecánica. La tabla lo dice de un vistazo, como la chapa de puntajes de un fichín: arriba
   * el audio, abajo lo que vale. Registro 3: nombra y se calla.
   */
  premios: {
    titulo: 'Cuánto vale cada paso',
    audio: 'Audio',
    vale: 'Vale',
  },
  /**
   * Lo que lee el que llega por el enlace de un amigo, en lugar de la bajada (`ADR-02`,
   * forma `marcador`). Mismo molde que el de "Sacalo por la letra": el puntaje es **lo que
   * dice** el otro, no un hecho — cualquiera edita la URL.
   */
  desafio: (puntos: number, maximo: number, nombre?: string) =>
    nombre
      ? `${nombre} dice que sacó ${puntos} de ${maximo} puntos. ¿Te da el oído?`
      : `Te desafiaron con ${puntos} de ${maximo} puntos. ¿Te da el oído?`,
  elegiPozo: '¿Con qué jugás?',
  todos: 'Todos los discos',
  /**
   * El disparador que abre los diez discos (`UX-24` §2, `T-221`).
   *
   * Voseo, tres palabras, y dice exactamente lo que hay adentro. Va plegado porque once
   * botones de 63 px eran 693 px —más de media pantalla— y dejaban el botón de empezar
   * abajo del pliegue. No se le niega nada a nadie: están a un toque.
   */
  elegiDisco: 'Elegí un disco',
  boton: 'Empezá',
  /** Cuántos temas hay para sortear en lo que el jugador eligió. */
  hay: (n: number) => (n === 1 ? '1 tema' : `${n} temas`),
  sinAudio: 'Sin audio todavía',
  /** El estado honesto cuando no hay ni un fragmento en disco. */
  faltaAudio:
    'Todavía no hay audio cargado, así que no hay con qué jugar. Los fragmentos se ' +
    'generan desde los discos que el usuario tiene en la máquina; el juego se prende ' +
    'solo en cuanto aparezca el primero.',
  faltaAudioComo: 'Se generan con: npm run generar-fragmentos -- <carpeta con los mp3>',
} as const;

export const PARTIDA = {
  progreso: (n: number, total: number) => `Tema ${n} de ${total}`,
  escuchar: 'Escuchá',
  parar: 'Pará',
  /** Lo que anuncia el lector de pantalla cuando cambia el paso. */
  pasoActual: (etiqueta: string) => `Tenés ${etiqueta} de audio`,
  buscar: 'Escribí el tema',
  /** El rótulo del botón de la cruz. Solo lo lee quien no ve la pantalla — y va en voseo
   *  igual: `D-17` no distingue entre texto a la vista y texto para el lector. */
  borrar: 'Borrá lo escrito',
  buscarAyuda:
    'Empezá a escribir y elegí de la lista. Sin tildes anda igual, y con el título por ' +
    'la mitad también.',
  sinResultados: 'Ningún tema de los Redondos se llama así.',
  arriesgar: 'Arriesgá',
  pasar: 'Pasá',
  /**
   * El botón de pasar dice cuánto audio compra (`extraAlPasar`), como el juego de
   * referencia. Pasar no es rendirse: es pedir más cinta, y el que llega sin idea tiene
   * que saber que ese botón le da algo antes de apretarlo.
   */
  pasarSuma: (extra: string) => `Pasá (+${extra})`,
  /** En el último intento no queda audio que comprar: pasar cierra el tema y lo muestra. */
  rendirse: 'Mirá cuál era',
  /** Lo que vale acertar en el paso en curso. Va al lado del audio que tenés. */
  vale: (puntos: number) => `Vale ${puntos}`,
  /**
   * El rótulo de una sugerencia que ya arriesgaste en este tema. No se puede volver a
   * elegir: gastar un intento en algo que ya sabés que no es no le sirve a nadie.
   */
  yaProbado: 'Ya lo probaste',
  pasado: 'Pasaste',
  /** El renglón de un intento fallado. El título es el que eligió el jugador. */
  fallado: (titulo: string) => titulo,
  ultimoIntento: 'Último intento',
  intentosRestantes: (n: number) => (n === 1 ? 'Te queda 1 intento' : `Te quedan ${n} intentos`),
  sinSonido:
    'Ojo: si no escuchás nada, fijate el volumen o poné auriculares. El juego es de oído ' +
    'y sin sonido no se puede jugar.',
} as const;

/**
 * Qué mirar cuando no se escucha nada. Registro 3: dice qué hay y se calla.
 *
 * **Por qué existe una pantalla entera para esto.** Un jugador no pudo escuchar ni un
 * tema, y después de arreglar dos defectos reales del motor resultó ser **la llave
 * lateral de silencio del iPhone**: apaga el audio del navegador aunque el volumen esté
 * alto, y no avisa. El juego entero es de oído — sin sonido no hay juego, y quien se
 * topa con esto no tiene forma de saber por qué.
 *
 * **Y no se puede detectar.** Ninguna API de la web dice si esa llave está puesta, así
 * que el aviso no puede aparecer solo cuando corresponde. Lo único honesto es decírselo
 * a quien tiene un iPhone —que es donde la trampa existe— y dejarle a todos una puerta
 * para cuando igual no se escuche.
 *
 * **Desde `D-66` la llave casi nunca manda**: el juego le pide al iPhone la sesión de la
 * música y la llave deja de apagarlo. `llaveIphone` queda para los que no tienen con qué
 * pedirla (tope iOS 15, o 16.3 y menos); en los demás diría algo que ya no es cierto.
 */
export const SIN_SONIDO = {
  /** El enlace que abre esto. Chico y siempre a mano, para cualquier aparato. */
  disparador: '¿No se escucha?',
  titulo: 'Si no se escucha',
  /** Solo en un iPhone o iPad donde la llave todavía manda (`D-66`). */
  llaveIphone:
    'En iPhone, la llave lateral de silencio apaga el sonido del navegador. Aunque el ' +
    'volumen esté alto, y sin avisar. Es lo primero que hay que mirar.',
  volumen:
    'El volumen de los videos es una perilla distinta de la del timbre. Las teclas del ' +
    'costado solo lo mueven mientras algo está sonando.',
  /** Cuando la página corre adentro de otra aplicación en vez del navegador. */
  incrustado: (donde: string) =>
    `Abriste esto adentro de ${donde}, no en el navegador del teléfono. Esas ventanas ` +
    `recortan el sonido: abrilo aparte y probá de nuevo.`,
  auriculares:
    'Con auriculares se escucha mejor: el primer paso dura una décima de segundo y por ' +
    'el parlante del teléfono puede pasar de largo.',
  verDiagnostico: 'Revisá el audio de este aparato',
  cerrar: 'Cerrá',
} as const;

export const REVELACION = {
  acerto: '¡La sacaste!',
  /**
   * `CNT-14` §2.1: la tapa que no sacaste se imprime en una sola tinta, y la línea lo
   * dice sin explicar el truco. Antes: "Se te escapó."
   */
  fallo: 'Se te escapó, en una tinta sola.',
  /**
   * El control que da vuelta la estampa (`CNT-14` §2.3). Nombres accesibles, y viven acá
   * y no en la isla porque `voz.test.ts` agarra todo `aria-label` escrito a mano.
   */
  girar: 'Dala vuelta',
  volverATapa: 'Volvé a la tapa',
  /** El sello de la trasera: la pista que sacaste (`CNT-14` §2.4). Misma palabra que `ficha`. */
  pista: (n: number) => `PISTA ${n}`,
  /**
   * La palabra pegada al casete mientras la cinta corre (`CNT-14` §2.5, `UX-22` §6). Esta
   * en los dos modos —con el carrete girando o quieto— y no esta el resto del tiempo: su
   * presencia es la senal. Registro 3, una palabra.
   */
  sonando: 'SONANDO',
  /** Lo que lee quien no ve la estampa. Nombra el disco: al revelar ya no es la respuesta. */
  altTapa: (disco: string) => `Tapa de ${disco}`,
  altTapaClave: (disco: string) => `Tapa de ${disco}, en una tinta`,
  altTrasera: (disco: string) => `Trasera de ${disco}`,
  eraEl: 'Era',
  /** Disco y año, para que el que no la sacó se lleve el dato. */
  ficha: (disco: string, anio: number, pista: number) => `${disco} (${anio}), pista ${pista}`,
  puntos: (n: number) => (n === 1 ? '1 punto' : `${n} puntos`),
  /**
   * El segundo sello del acierto: lo que sumaste, grande. Va aparte de `puntos` porque
   * este es un número que se estampa, no una frase que se lee — y el lector de pantalla
   * lo recibe entero por `puntos`, en el renglón de la ficha.
   */
  suma: (n: number) => `+${n}`,
  /**
   * Lo que costó el tema, en las dos monedas del juego: audio y reloj.
   *
   * El puntaje mide cuánto audio necesitaste; el reloj, cuánto tardaste en decidir. Son
   * dos cosas distintas y por eso van juntas y separadas por el punto medio, no sumadas
   * en un número solo.
   */
  costo: (audio: string, tiempo: string) => `Con ${audio} de audio · ${tiempo} de reloj`,
  /** Al que no la sacó también le corresponde su tiempo: jugó los seis intentos. */
  tardaste: (tiempo: string) => `${tiempo} de reloj`,
  escucharEntero: 'Escuchalo entero',
  verLetra: 'Mirá la letra y los acordes',
  seguir: 'Seguí',
  ultimo: 'Mirá cómo te fue',
} as const;

export const RESULTADO = {
  titulo: 'Cómo te fue',
  /**
   * La línea que canta del afiche (`CNT-14` §2.6): el resultado se pega en la pared como
   * un afiche de recital. `detalle` sigue siendo la que nombra la lista de abajo.
   */
  afiche: 'Tu vuelta quedó pegada en la pared.',
  puntos: (puntaje: number, maximo: number) => `${puntaje} de ${maximo} puntos`,
  /**
   * El rótulo del número grande del resultado, que desde hoy es **el tiempo** y no el
   * puntaje.
   *
   * Lo pidió el usuario con estas palabras: *"más que el puntaje es importante y
   * divertido saber en cuánto tiempo y qué temas adivinó"*. El puntaje no desaparece —
   * sigue abajo, en su renglón—, pero deja de ser lo primero que se lee.
   */
  rotuloTiempo: 'Tardaste',
  /** El detalle tema por tema, para volver a mirar qué se falló. */
  detalle: 'Los temas de esta vuelta',
  /** Cuántos sacaste, dicho al lado del puntaje: el número que se cuenta en la previa. */
  sacaste: (n: number, total: number) => `${n} de ${total} temas`,
  denuevo: 'Otra vuelta',
  volver: 'Volvé al fichín',
  compartir: 'Compartí',
  /** Mientras el canvas dibuja. Dura un parpadeo, pero un botón mudo se toca dos veces. */
  armando: 'Armando la tarjeta',
  /** La salida para el que quiere la imagen y no el menú de compartir del sistema. */
  bajarTarjeta: 'Bajá la tarjeta',
  copiado: 'Copiado. Pegalo donde quieras.',
  /** Cuando no hubo ni menú de compartir ni portapapeles: queda a la vista, seleccionable. */
  aManoTitulo: 'Copiá esto y mandalo',
} as const;

/**
 * Lo que se lee **adentro de la imagen** que se comparte (`tarjeta.ts`).
 *
 * Es casi todo registro 3, y a propósito: la tarjeta la mira alguien que no jugó, sin el
 * sitio alrededor que le explique nada. Un rótulo con onda adentro de una imagen suelta
 * no se entiende — dice qué hay adentro y se calla. La única línea que canta es el tramo,
 * que ya está escrito en `TRAMOS` y se reusa tal cual.
 *
 * **La dirección del sitio no se escribe acá**: la pone la isla desde `location`, porque
 * el sitio puede vivir en más de un lado y una dirección escrita a mano envejece sola.
 *
 * **Y la firma del sitio tampoco**: desde que la tarjeta la comparten los dos juegos
 * (`D-30`), "FICHÍN RICOTERO" vive en el pincel, que es lo que no cambia entre juegos. Lo
 * que queda acá es solo lo que este juego dice distinto del otro.
 */
export const TARJETA = {
  juego: 'Adiviná el tema',
  rotuloTiempo: 'Tiempo total',
  /** El renglón de un tema que salió: disco, cuánto audio hizo falta y cuánto tardó. */
  pieAcierto: (disco: string, audio: string, tiempo: string) =>
    `${disco} · ${audio} de audio · ${tiempo}`,
  /**
   * El de un tema que no salió. Lleva "no salió" escrito además de la cruz: en una
   * imagen que se mira chiquita, un símbolo solo no alcanza — es `UX-01` aplicado a algo
   * que ni siquiera es una pantalla.
   */
  pieFallo: (disco: string, tiempo: string) => `${disco} · no salió · ${tiempo}`,
} as const;

/** Los tres tramos del resultado, con la voz del proyecto. Espeja `quiz/copy.ts`. */
export const TRAMOS = {
  bajo: 'Te falta escuchar disco.',
  medio: 'Los conocés, tardaste un poco.',
  alto: 'Los tenés de memoria.',
} as const;
