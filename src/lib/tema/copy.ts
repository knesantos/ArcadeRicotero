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
  elegiPozo: '¿Con qué jugás?',
  todos: 'Todos los discos',
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
  buscarAyuda:
    'Empezá a escribir y elegí de la lista. Sin tildes anda igual, y con el título por ' +
    'la mitad también.',
  sinResultados: 'Ningún tema de los Redondos se llama así.',
  arriesgar: 'Arriesgá',
  pasar: 'Pasá',
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
 */
export const SIN_SONIDO = {
  /** El enlace que abre esto. Chico y siempre a mano, para cualquier aparato. */
  disparador: '¿No se escucha?',
  titulo: 'Si no se escucha',
  /** Solo en iPhone y iPad. Es la causa más común, y la más invisible de todas. */
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
  fallo: 'Se te escapó.',
  eraEl: 'Era',
  /** Disco y año, para que el que no la sacó se lleve el dato. */
  ficha: (disco: string, anio: number, pista: number) => `${disco} (${anio}), pista ${pista}`,
  puntos: (n: number) => (n === 1 ? '1 punto' : `${n} puntos`),
  enQuePaso: (etiqueta: string) => `Con ${etiqueta} de audio`,
  escucharEntero: 'Escuchalo entero',
  verLetra: 'Mirá la letra y los acordes',
  seguir: 'Seguí',
  ultimo: 'Mirá cómo te fue',
} as const;

export const RESULTADO = {
  titulo: 'Cómo te fue',
  de: (puntaje: number, maximo: number) => `${puntaje} de ${maximo}`,
  /** El detalle tema por tema, para volver a mirar qué se falló. */
  detalle: 'Los temas de esta vuelta',
  denuevo: 'Otra vuelta',
  volver: 'Volvé al arcade',
  compartir: 'Compartí',
  copiado: 'Copiado. Pegalo donde quieras.',
} as const;

/** Los tres tramos del resultado, con la voz del proyecto. Espeja `quiz/copy.ts`. */
export const TRAMOS = {
  bajo: 'Te falta escuchar disco.',
  medio: 'Los conocés, tardaste un poco.',
  alto: 'Los tenés de memoria.',
} as const;
