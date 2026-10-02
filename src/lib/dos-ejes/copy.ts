/**
 * El texto del test de dos ejes (`US-06`).
 *
 * **Lo que NO está acá, y es la mitad del juego:** los enunciados, las opciones y los
 * cuatro cuadrantes. Todo eso lo escribió `contenido` en `CNT-09` y vive en
 * `src/data/dos-ejes.json`, porque es contenido y no cáscara. Acá está solo lo que rodea
 * a la partida.
 *
 * Estas cadenas las puso el hilo principal siguiendo `UX-06` §2 y §4, `CNT-02` y `D-17`.
 * **Las audita `voz.test.ts`** junto con las 44 del banco, que hasta el ciclo 8 no miraba
 * nadie.
 */

export const PANTALLA_0 = {
  /** Registro 1: segunda persona, ocho palabras o menos. */
  titulo: '¿Qué tipo de ricotero sos?',
  /**
   * Registro 3, y dice el mecanismo sin vender nada. `UX-06` §2 pide que quede claro que
   * **no hace falta saber nada de la banda**: es el molinete más abierto de los cinco y
   * conviene decirlo, no solo que sea cierto.
   */
  subtitulo: 'Diez preguntas de cómo sos, no de cuánto sabés. Elegís y listo.',
  /**
   * `EMPEZÁ` y no `JUGÁ`, a propósito (`UX-06` §2): el que ya conoce el sitio nota, antes
   * de tocar, que esto no es una ronda con puntaje.
   */
  boton: 'Empezá',
  /**
   * Lo que lee el que llega por el enlace de un amigo (`ADR-02`, forma `identidad`). Dice
   * qué le salió al otro y **nada que suene a superarlo**: ningún cuadrante es mejor que
   * otro (`BR-17`), así que la invitación es a ver qué te sale a vos, no a ganarle.
   */
  desafio: (cuadrante: string, nombre?: string) =>
    `A ${nombre ?? 'alguien'} le salió «${cuadrante}». ¿Y a vos? Diez preguntas de cómo sos, no de cuánto sabés.`,
} as const;

export const PARTIDA = {
  /**
   * No hay acierto ni error, así que no hay refuerzo que dar. Lo único que se informa es
   * dónde está parado el jugador dentro de las diez.
   */
  progreso: (n: number, total: number) => `${n} de ${total}`,
} as const;

export const RESULTADO = {
  titulo: 'Diste con esto',
  /** Las cuatro puntas del rombo (`UX-06` §4). Son rótulos, registro 3. */
  ejes: {
    luz: 'Luz',
    oscuridad: 'Oscuridad',
    orden: 'Orden',
    caos: 'Caos',
  },
  /**
   * El plano se describe para quien no lo ve. **No dice dónde cayó el jugador dentro del
   * cuadrante** — eso filtraría el conteo por eje, que `BR-17` no deja mostrar.
   */
  altPlano: 'Los dos ejes cruzados, con tu resultado marcado en su cuadrante.',
  denuevo: 'Probá de nuevo',
  compartir: 'Compartí',
  volver: 'Volvé al arcade',
  /** El texto que acompaña al enlace. La identidad, nunca un número (`BR-17`, `CNT-26`). */
  paraCompartir: (cuadrante: string) => `Me salió «${cuadrante}» en el arcade ricotero. ¿Y a vos qué te sale?`,
  copiado: 'Se copió el enlace.',
  aManoTitulo: 'Copiá esto y mandalo',
} as const;
