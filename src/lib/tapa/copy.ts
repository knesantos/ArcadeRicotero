/**
 * El texto de "adivinar la tapa" (`US-04`).
 *
 * **Deuda declarada:** el quiz saca sus cadenas de `CNT-05`, escrita por `contenido`.
 * Para este juego todavía no existe la `CNT-XX` equivalente, así que estas cadenas las
 * puso el hilo principal siguiendo `CNT-02` (guía de tono) y `D-17` (voseo, sin
 * anglicismos). Cuando `contenido` escriba la suya, este archivo se transcribe de ahí y
 * deja de ser criterio propio. Está anotado en `Docs/SUGERENCIAS/`.
 */

export const PANTALLA_0 = {
  titulo: 'Adiviná la tapa',
  subtitulo:
    'Rocambole dibujó; vos ponés el disco. Arranca fácil y se pone bravo.',
  boton: 'Empezá',
  /**
   * Lo que lee el que llega por el enlace de un amigo, en lugar de la bajada (`ADR-02`,
   * forma `marcador`). El puntaje es lo que **dice** el otro: cualquiera edita la URL.
   */
  desafio: (aciertos: number, total: number, nombre?: string) =>
    nombre
      ? `${nombre} dice que adivinó ${aciertos} de ${total} tapas. Arranca fácil: a ver cuántas te salen.`
      : `Te desafiaron con ${aciertos} de ${total} tapas. Arranca fácil: a ver cuántas te salen.`,
} as const;

export const PARTIDA = {
  /** No nombra el disco: nombrarlo sería contar la respuesta. */
  altImagen: 'Arte de tapa sin identificar: es lo que hay que adivinar.',
  pregunta: '¿De qué disco es esta tapa?',
  preguntaDetalle: '¿De qué disco es este pedazo de tapa?',
  seguir: 'Seguí',
  ok: '¡La tenías!',
  no: 'No era esa.',
  eraLa: 'Era',
  /**
   * `CNT-14` §3: al fallar, la tapa entera se imprime en una sola tinta (`T-206`) y la
   * frase lo dice con las mismas palabras que "Adiviná el tema" — es el mismo efecto.
   * Se compone: `${no} ${eraLa} ${disco}, ${enClave}` → "No era esa. Era Oktubre, en una tinta."
   */
  enClave: 'en una tinta.',
  /**
   * Lo que lee quien no ve la tapa que se terminó de imprimir (`T-206`). Acá sí nombra el
   * disco: la respuesta ya se dio, y `altImagen` —la del recorte, que la calla— queda para
   * mientras se juega. La de la clave dice que llegó una sola tinta, que es la diferencia
   * que se ve.
   */
  altTapaEntera: (disco: string) => `Tapa de ${disco}`,
  altTapaClave: (disco: string) => `Tapa de ${disco}, en una tinta`,
  credito: (autor: string) => `Tapa: ${autor}, en baja resolución.`,

  edicion: (e: string) => `La imagen es de: ${e}.`,
  progreso: (n: number, total: number) => `${n} de ${total}`,
} as const;

/**
 * Lo que dice la mesa de imprenta (ronda de pulida, 2026-11-20). Las mismas palabras que la
 * cabecera de los otros juegos pulidos —"Llevás N", "N al hilo", los ruidos—, más lo propio:
 * la tirada colgada a secar. Para el visto de `contenido`.
 */
export const IMPRENTA = {
  /** El nombre del juego, para la tarjeta. Es el del casete del portal. */
  juego: 'Adiviná la tapa',
  /** Lo que llevás acertado, en la cabecera. Sube al acertar. */
  llevas: (n: number) => `Llevás ${n}`,
  /** Lo que suma un acierto: vuela de la ficha a la cuenta. */
  suma: '+1',
  /** La racha: dos o más seguidas. */
  racha: (n: number) => `${n} al hilo`,
  /** El paso al resultado, cuando la última tapa ya se respondió. */
  alResultado: 'Mirá cómo te fue',
  ruidosApagar: 'Apagá los ruidos',
  ruidosPrender: 'Prendé los ruidos',
  ruidosTecla: 'Ruidos',
  /** Abre la explicación cuando va plegada para que la tapa y "Seguí" entren juntas. */
  leerMas: 'Leé más',
  /** El cartel de la mesa de la portada: lo que hace el botón, dicho con el objeto. */
  pasala: 'Pasá la racleta',
  /** El rótulo de la soga del resultado. Registro 3. */
  tirada: 'La tirada',
  /** Lo que lee quien no ve la soga: cuántas salieron enteras y cuántas en una tinta. */
  tiradaLeida: (enteras: number, enUnaTinta: number) =>
    `${enteras} ${enteras === 1 ? 'tapa entera' : 'tapas enteras'}, ${enUnaTinta} en una tinta`,
  /** Cómo quedó cada hoja de la soga, para el lector. */
  hojaEntera: (disco: string) => `${disco}: la tenías`,
  hojaEnUnaTinta: (disco: string) => `${disco}: en una tinta`,
  /** La hazaña: las seis. */
  hazana: '¡Tirada entera!',
  /** El crédito que viaja en la tarjeta, que no tiene pie de imprenta (`D-21`). */
  creditoTarjeta: (autor: string) => `Tapas: ${autor}, en baja resolución.`,
} as const;

export const RESULTADO = {
  titulo: 'Cómo te fue',
  puntaje: (aciertos: number, total: number) => `${aciertos} de ${total}`,
  denuevo: 'Otra vuelta',
  volver: 'Volvé al fichín',
  /** Compartir (`CNT-26`): texto y enlace, sin tarjeta, como "Más o menos". */
  compartir: 'Compartí',
  paraCompartir: (aciertos: number, total: number) =>
    `Adiviné ${aciertos} de ${total} tapas en el fichín ricotero. ¿Vos cuántas adivinás?`,
  copiado: 'Se copió el enlace.',
  aManoTitulo: 'Copiá esto y mandalo',
} as const;
