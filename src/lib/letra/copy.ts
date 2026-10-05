/**
 * El texto de "completar la letra" (`US-03`).
 *
 * **Deuda declarada**, la misma que arrastra `tapa/copy.ts`: la `CNT-XX` de este juego
 * todavía no existe. Estas cadenas las puso el hilo principal siguiendo `CNT-02` (guía
 * de tono) y `D-17` (voseo, sin anglicismos). Cuando `contenido` escriba la suya, este
 * archivo se transcribe de ahí y deja de ser criterio propio.
 */

export const PANTALLA_0 = {
  titulo: 'Completá la letra',
  subtitulo:
    'Lo tenés en la punta de la lengua. Falta una palabra del verso, y cuanto más ' +
    'difícil, menos letra ves alrededor.',
  boton: 'Empezá',
  /** El que llega por el enlace de un amigo (`ADR-02`, forma `marcador`). */
  desafio: (aciertos: number, total: number, nombre?: string) =>
    nombre
      ? `${nombre} dice que completó ${aciertos} de ${total} versos. ¿Te los sabés?`
      : `Te desafiaron con ${aciertos} de ${total} versos. ¿Te los sabés?`,
} as const;

export const PARTIDA = {
  pregunta: '¿Qué falta acá?',
  seguir: 'Seguí',
  ok: '¡Esa era!',
  no: 'No era esa.',
  eraLa: 'Era',
  /** El disco se nombra solo en fácil y media: en difícil es una pista de más (`BR-03`). */
  deQueTema: (titulo: string) => `De "${titulo}"`,
  deQueDisco: (titulo: string, disco: string) => `De "${titulo}", en ${disco}`,
  progreso: (n: number, total: number) => `${n} de ${total}`,
  hueco: '________',
  /**
   * La fuente del verso, a la vista (`T-145`, `D-25`). Registro 3: rotulo seco, sin
   * decorar. Es el mecanismo de "lo veo jugando" — quien se tope con un verso dudoso ve
   * en un toque de donde salio, y un error con la fuente a la vista se lee como una
   * transcripcion floja, no como que el sitio no sabe.
   */
  fuenteDe: (sitio: string) => `Letra transcripta por ${sitio}`,
} as const;

export const RESULTADO = {
  titulo: 'Cómo te fue',
  puntaje: (aciertos: number, total: number) => `${aciertos} de ${total}`,
  denuevo: 'Otra vuelta',
  volver: 'Volvé al fichín',
  alCancionero: 'Mirá las letras enteras',
  /** Compartir (`CNT-26`): texto y enlace, sin tarjeta, como "Más o menos". */
  compartir: 'Compartí',
  paraCompartir: (aciertos: number, total: number) =>
    `Completé ${aciertos} de ${total} versos en el fichín ricotero. ¿Vos cuántos completás?`,
  copiado: 'Se copió el enlace.',
  aManoTitulo: 'Copiá esto y mandalo',
} as const;

/**
 * Lo que dice la pantalla mientras el banco no tenga un solo ítem jugable.
 *
 * **No es un "próximamente".** Es el estado real y conviene que se lea como tal: hay 313
 * versos candidatos generados y esperando que alguien los confirme de oído contra el
 * disco, porque `CTR-04` no deja jugar un verso que nadie escuchó. Si la respuesta está
 * mal, el juego le marca error justo al que se sabe el tema.
 */
export const SIN_BANCO = {
  titulo: 'Todavía no',
  explica:
    'Los versos ya están cargados, pero ninguno se confirmó todavía escuchando el disco. ' +
    'Hasta que eso pase el juego no abre: una respuesta mal transcripta le marcaría error ' +
    'justo al que se sabe el tema, y es lo único que acá no se negocia.',
  mientras: 'Mientras tanto, las letras enteras con sus acordes ya están.',
  boton: 'Andá a letras y acordes',
} as const;
