/**
 * El copy de "Sacalo por la letra" (`US-07`).
 *
 * Escrito por el hilo principal siguiendo `voz-ricotera.md` y el molde del hermano de
 * audio (`src/lib/tema/copy.ts`); lo audita `voz.test.ts`. Queda pedido a `contenido`
 * el pase fino — `UX-08` dejó anotado que este juego no tiene `CNT-XX` propio todavía.
 *
 * La regla de las dos líneas: el título nombra ("Sacalo por la letra"), la bajada canta
 * (primera frase ≤ 8 palabras). Botones en voseo, sin excepción (`D-17`).
 *
 * ## Por qué este archivo creció en el ciclo estético (2026-08-27)
 *
 * Porque **cuatro cadenas visibles vivían escritas a mano adentro de la isla** —el
 * placeholder del buscador, su `aria-label`, el "no hay resultados" y el botón de
 * borrar— y `voz.test.ts` audita módulos de copy, no islas. Es exactamente la deuda que
 * el proyecto ya se comió una vez: `"Link copiado."` estuvo tres ciclos en producción con
 * un anglicismo que `D-17` veta, escondido del auditor por estar escrito en la isla.
 * `ESTADO.md` lo dejó anotado: *"una cadena visible fuera de un `copy.ts` es una cadena
 * que nadie audita"*. Acá se cierra esa puerta.
 */

export const PANTALLA_0 = {
  titulo: 'Sacalo por la letra',
  subtitulo: 'Un verso te tiene que alcanzar. Si no, te damos más: dos, cuatro, ocho. Cuanto antes lo saques, más vale.',
  boton: 'JUGÁ',
  /**
   * La chapa de lo que vale cada escalón, impresa en la portada. Mismo mecanismo que el
   * hermano: la bajada contaba la escalera en prosa —"dos, cuatro, ocho"— y la tabla lo dice
   * de un vistazo. Registro 3: nombra y se calla.
   */
  premios: {
    titulo: 'Cuánto vale cada paso',
    versos: 'Versos',
    vale: 'Vale',
  },
  hay: (n: number) => `${n} temas en el pozo`,
  /**
   * Lo que dice la portada cuando alguien llega por un desafío de otro.
   *
   * Tiene línea propia y no importa la del quiz, que habla de preguntas: acá lo que se
   * cuenta son temas sacados por la letra. `ADR-02` es claro con lo que se puede afirmar
   * — es **lo que dice tu amigo que hizo**, no un hecho que el sitio pueda verificar.
   */
  desafio: (puntos: number, maximo: number, nombre?: string) =>
    nombre
      ? `${nombre} dice que sacó ${puntos} de ${maximo}. Fijate vos.`
      : `Te desafiaron con ${puntos} de ${maximo}. Fijate vos.`,
} as const;

export const PARTIDA = {
  tema: (n: number, total: number) => `Tema ${n} de ${total}`,
  intentos: (n: number) => (n === 1 ? 'Te queda 1 intento' : `Te quedan ${n} intentos`),
  versos: (n: number) => (n === 1 ? 'Tenés 1 verso' : `Tenés ${n} versos`),
  /** El placeholder y el rótulo del buscador. Antes vivía suelto en la isla. */
  buscar: 'Escribí el tema',
  /** Lo que dice el botón de la cruz. Solo lo lee quien no ve la pantalla — y va en voseo igual. */
  borrar: 'Borrá lo escrito',
  /**
   * Cuando el buscador no encuentra nada.
   *
   * Se unifica con la del hermano, que decía lo mismo mejor: nombra a la banda en vez de
   * dejar un "así" colgado. Dos juegos con el mismo buscador no pueden contestar distinto
   * a la misma situación.
   */
  sinResultados: 'Ningún tema de los Redondos se llama así.',
  ayuda: 'Empezá a escribir y elegí de la lista. Sin tildes anda igual, y con el título por la mitad también.',
  arriesga: 'Arriesgá',
  pasa: 'Pasá',
  /** El botón de pasar dice cuánta letra compra (`extraDeVersos`), como el del hermano. */
  pasaSuma: (extra: string) => `Pasá (+${extra})`,
  /** En el último intento no queda letra que pedir: pasar cierra el tema y lo muestra. */
  rendirse: 'Mirá cuál era',
  /** Lo que vale acertar en el paso en curso. Va al lado de los versos que tenés. */
  vale: (puntos: number) => `Vale ${puntos}`,
  /** Una sugerencia que ya arriesgaste en este tema: queda tachada y no se puede elegir. */
  yaProbado: 'Ya lo probaste',
  /** El sello de lo que sumaste, al lado del "¡Lo sacaste!". El número entero lo lee `puntos`. */
  suma: (n: number) => `+${n}`,
  paso: 'pasaste',
  ok: '¡Lo sacaste!',
  /**
   * El desenlace cuando el tema no salió.
   *
   * Decía *"No era ese."*, y eso **presupone un acto que puede no haber ocurrido**: quien
   * toca `Pasá` las cuatro veces no arriesgó ningún "ese", y el sitio le contestaba por
   * algo que no hizo. Es justo el camino del que llega sin idea, o sea el que los
   * molinetes abiertos (`D-14`) existen para no dejar afuera. Esta aguanta los dos
   * caminos, y es la misma que ya usa el hermano.
   */
  no: 'Se te escapó.',
  era: (titulo: string) => `Era ${titulo}`,
  deDonde: (disco: string, anio: number) => `${disco} (${anio})`,
  puntos: (p: number, versos: number) =>
    p > 0 ? `${p} puntos · Con ${versos === 1 ? '1 verso' : `${versos} versos`}` : 'Esta vez no salió',
  verLetra: 'Mirá la letra y los acordes',
  seguir: 'Seguí',
  /** El último tema de la vuelta no sigue nada: entrega el resultado, y lo dice. */
  ultimo: 'Mirá cómo te fue',
  /** La fuente del verso, registro 3 — mismo mecanismo que `US-03` (`T-145`, `D-25`). */
  fuenteDe: (sitio: string) => `Letra transcripta por ${sitio}`,
} as const;

export const RESULTADO = {
  titulo: 'Cómo te fue',
  /**
   * El rótulo del número grande, que es **cuántos versos gastaste**.
   *
   * No es un reloj, y la diferencia con el hermano no es un olvido: es de qué está hecho
   * cada juego. Allá el número grande es el tiempo porque escuchar una décima de segundo
   * y decidir es una carrera. Acá leer ocho versos tarda lo que tarde cada uno, así que
   * cronometrar **castiga al lector lento sin medir nada del juego** — y eso sería cerrar
   * un molinete (`D-14`). La moneda de este juego es la de `BR-20`: 1, 2, 4, 8 versos.
   */
  rotuloVersos: 'Gastaste',
  versos: (n: number) => (n === 1 ? '1 verso' : `${n} versos`),
  de: (puntos: number, maximo: number) => `${puntos} de ${maximo} puntos`,
  /** Cuántos sacaste, dicho al lado del puntaje: el número que se cuenta en la previa. */
  sacaste: (n: number, total: number) => `${n} de ${total} temas`,
  /** El detalle tema por tema. Es la pieza central del resultado, no una nota al pie. */
  detalle: 'Los temas de esta vuelta',
  /** El renglón chico de un tema que salió. Registro 3. */
  pieAcierto: (disco: string, versos: string) => `${disco} · con ${versos}`,
  /** El de uno que no salió. Lleva "no salió" escrito además de la cruz (`UX-01`). */
  pieFallo: (disco: string) => `${disco} · no salió`,
  compartir: 'COMPARTÍ',
  deNuevo: 'JUGÁ DE NUEVO',
  /** Mientras el canvas dibuja. Un botón mudo se toca dos veces. */
  armando: 'Armando la tarjeta',
  bajarTarjeta: 'Bajá la tarjeta',
  copiado: 'Se copió el enlace.',
  aManoTitulo: 'Copiá esto y mandalo',
  paraCompartir: (puntos: number, maximo: number) =>
    `Saqué ${puntos} de ${maximo} sacando temas por la letra en el arcade ricotero. ¿Vos cuántos sacás?`,
} as const;

/**
 * Los tres tramos del resultado, con la voz de un juego que **se lee**.
 *
 * El hermano dice "Te falta escuchar disco" y acá esa línea no aplica: nadie escuchó
 * nada. Registro 1 — segunda persona, imagen física, ocho palabras como techo. La del
 * medio se apoya en el cuerpo (`voz-ricotera.md` 4.3: cuerpo y objeto, no colores), y la
 * de arriba le devuelve al jugador la promesa que el juego le hizo en la portada.
 */
export const TRAMOS = {
  bajo: 'No te suena ni el estribillo.',
  medio: 'Los tenés en la punta de la lengua.',
  alto: 'Con un renglón te alcanza.',
} as const;

/** Lo que se lee adentro de la imagen que se comparte. Registro 3, salvo el tramo. */
export const TARJETA = {
  juego: 'Sacalo por la letra',
  rotuloHero: 'Versos gastados',
} as const;
