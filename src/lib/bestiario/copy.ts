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
    `${cuantos} bichos y personajes de los diez discos, cada uno en su rincón del mundo redondo, al lado de los que se le parecen. Tocá una región para acercarte, y un bicho para ver su ficha.`,
  mapa: 'El mundo redondo, visto desde arriba',
  regiones: 'Las regiones',
  libreta: (anotados: number, total: number): string => `Anotaste ${anotados} de ${total}.`,
  libretaVacia: (total: number): string => `Son ${total}. Cada uno que abrís queda anotado en este teléfono.`,
  estasEn: 'Estás en',
  volverAlMapa: 'Volvé al mapa',
  alLado: 'Al lado',
  aca: 'Acá viven',
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
    bajada: 'La misma lista, para leer de corrido. Cada ficha se abre al tocarla.',
  },
  /** La puerta en la portada de la Redondopedia. */
  enLaPortada: {
    titulo: 'Bestiario redondo',
    resumen: 'Los bichos y la gente de las letras, cada uno en su rincón de un mapa que se recorre desde arriba.',
  },
  volverPortada: 'A LA REDONDOPEDIA',
} as const;
