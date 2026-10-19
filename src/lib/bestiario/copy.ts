/**
 * Lo que se lee en el bestiario redondo (`D-73`). Lo audita `voz.test.ts`.
 *
 * Registro 1 en el título, el renglón del lugar y las acotaciones de cada región (que viven
 * en el JSON, `canta`). Registro 2 en la bajada y en las estampas. Registro 3, seco, en los
 * sellos de clase, en los rótulos y en los botones.
 */

export const BESTIARIO = {
  titulo: 'BESTIARIO REDONDO',
  /** El renglón del lugar: canta, ocho palabras como mucho. */
  dondeEstas: 'Los bichos que viven en las letras.',
  bajada: (cuantos: number): string =>
    `${cuantos} bichos y personajes de los diez discos, cada uno en su recinto, al lado de los que se le parecen. Tocá un bicho y te dice su verso; tocalo de nuevo y abrís su ficha.`,
  mapa: 'El mundo redondo, visto desde arriba',
  plano: 'El plano del recorrido',
  alPlano: 'Tocá una región del plano y entrás caminando. Abajo están los recintos, uno detrás del otro.',
  recinto: (n: number): string => `RECINTO ${n}`,
  recintoMonte: 'El monte del lobo y la pastura',
  abrirFicha: 'Abrí la ficha',
  regiones: 'Las regiones',
  libreta: (anotados: number, total: number): string => `Anotaste ${anotados} de ${total}.`,
  libretaVacia: (total: number): string => `Son ${total}. Cada uno que abrís queda anotado en este teléfono.`,
  aca: 'Acá viven',
  /** Abajo de una escena más ancha que la pantalla; se va cuando la gente la corre. */
  deslizar: 'Deslizá de costado para ver el resto.',
  volverAlPlano: 'Volvé al plano',
  cerrar: 'Cerrá la ficha',
  anotada: 'Anotado',
  clases: {
    bestia: 'BESTIA',
    criatura: 'CRIATURA',
    personaje: 'PERSONAJE',
    fierro: 'FIERRO',
  } as Record<string, string>,
  saleEn: 'Sale en',
  tambienEn: 'También en',
  sinTema: 'No sale en ninguna letra: es del mito.',
  laEstampa: 'La estampa',
  seCuenta: 'Lo que se cuenta',
  andaCerca: 'Anda cerca',
  escuchar: '▶ Escuchá diez segundos',
  sonando: '■ Pará',
  leerLetra: 'Leé la letra',
  leerArticulo: 'Leé el artículo',
  verEnElMapa: 'Buscala en el mapa',
  ficha: 'Ficha',
  indice: {
    titulo: 'Todos, región por región',
    bajada: 'La misma lista, en el orden del recorrido. Cada ficha se abre al tocarla.',
  },
  /** La puerta en la portada de la Redondopedia. */
  enLaPortada: {
    titulo: 'Bestiario redondo',
    resumen: 'Los bichos y la gente de las letras, cada uno en su rincón de un mundo redondo que se camina.',
  },
  volverPortada: 'A LA REDONDOPEDIA',
  /** La puerta de un recinto que ya tiene su camino (`D-73`, séptima vuelta). */
  entrarCaminando: 'Entrá caminando',
} as const;

/**
 * El camino con cruces (`D-73`, séptima vuelta): cada región es una página que se camina de
 * costado. Registro 1 en el nombre y la acotación de la región (del JSON) y en el cartel del
 * cruce; registro 3, seco, en la instrucción y en los sellos.
 */
export const CAMINO = {
  /** La salida del camino (`D-76`): al plano redondo, con los trece recintos uno detrás del otro. */
  volver: 'AL PLANO',
  sello: 'CAMINO DEL BESTIARIO',
  /** La instrucción, abajo del nombre: la línea que nombra lo que hay que hacer (`D-77`: de costado). */
  bajada: 'Deslizá de costado para caminar. Al final hay un cruce y elegís para dónde seguir.',
  /** Sin movimiento, la escena se corre con el dedo, como los recintos de noche. */
  deslizar: 'Deslizá de costado para caminar.',
  escena: 'El camino, visto de costado',
  saltar: 'Saltá al cruce',
  cruce: {
    titulo: 'Elegí para dónde seguir.',
    etiqueta: 'El cruce',
    /** En el cartel de una región que todavía no se camina: lleva a su recinto. */
    enElPlano: 'EN EL PLANO',
  },
  dePaso: 'DE PASO',
  aca: 'Los que andan por acá',
  /** Con la pantalla entera (`D-76`), la lista de fichas se abre con un toque. */
  lista: 'Mirá la lista',
  cerrarLista: 'Cerrá la lista',
  /** El recital de lejos (`D-76`). Registro 3: dice qué suena, y que es de lejos. */
  lejos: {
    prender: '▶ Escuchá de lejos',
    apagar: '■ Pará',
    suena: (disco: string): string => `De lejos suena ${disco}.`,
  },
  /** La puerta: el toque que deja sonar (el navegador no deja antes), como el "Jugá" de los juegos. */
  puerta: {
    entra: 'Tocá y entrá con sonido',
    callado: 'Entrá sin sonido',
  },
  /** El nombre de la región es el botón que despliega lo demás: se lee cuando uno quiere. */
  desplegar: 'Mirá qué hay acá',
} as const;
