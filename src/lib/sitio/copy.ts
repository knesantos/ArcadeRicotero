/**
 * El copy del portal, de las pantallas "en la cocina" y de la Redondopedia.
 *
 * Mismo criterio que `quiz/copy.ts`: el texto visible vive en un modulo, no
 * desparramado en los componentes. La voz es la de `CNT-02` (D-17): voseo en cada
 * boton, jerga en el tono y nunca en la barrera, sin anglicismos.
 *
 * Nota de propiedad: esto lo escribio el hilo principal para la primera version
 * navegable; queda una propuesta en Docs/SUGERENCIAS/ para que `contenido` lo
 * revise con su vara, como hizo con CNT-05.
 */

export const PORTAL = {
  titulo: 'ARCADE RICOTERO',
  bajada:
    'Juegos y enciclopedia sobre Patricio Rey y sus Redonditos de Ricota. ' +
    'Sin cuenta, sin pagar la entrada, sepas lo que sepas: los molinetes van abiertos.',
  ladoA: 'Lado A · Para jugar',
  ladoB: 'Lado B · Para leer',
  enLaCocina: 'En la cocina',
  volver: 'VOLVER',
  volverAlArcade: 'AL ARCADE',
  pie:
    'Sitio de fans, sin fines de lucro. El arte de las tapas es de Rocambole ' +
    '(Ricardo Cohen); la música, de Patricio Rey y sus Redonditos de Ricota. ' +
    'Si algo molesta a quien corresponde, se baja y listo.',
  /**
   * El crédito puntual de la pantalla: qué tapas se usaron acá.
   *
   * Es la condición 1 de `D-21`. El pie de arriba nombra a Rocambole, pero no dice de
   * qué discos salió lo que se está viendo, y un fondo no tiene dónde poner una firma
   * al lado. Esto lo resuelve por pantalla, sin cargarle un crédito a cada imagen.
   */
  creditoTapas: (discos: readonly string[]) =>
    `En esta pantalla, arte de ${discos.length === 1 ? 'la tapa de' : 'las tapas de'} ` +
    `${discos.length > 1 ? `${discos.slice(0, -1).join(', ')} y ${discos.at(-1)}` : discos[0]}, ` +
    'en baja resolución.',
} as const;

/** Los cinco casetes del portal. `viste` es la mezcla D-19: que disco viste cada uno. */
export interface Casete {
  readonly titulo: string;
  readonly baja: string;
  readonly viste: string;
  readonly variante: 'marca' | 'historia' | 'discos' | 'letras' | 'mitologia';
  readonly arte: string;
  readonly href?: string;
  readonly accion?: string;
}

export const JUEGOS: readonly Casete[] = [
  {
    titulo: 'Preguntas ricoteras',
    baja: 'Ocho preguntas de historia, discos, letras y mitología. Dos minutos y salís.',
    viste: 'Viste Oktubre',
    variante: 'marca',
    arte: '/arte/casete.svg',
    href: '/quiz/',
    accion: 'JUGÁ',
  },
  {
    titulo: 'Adiviná el tema',
    baja: 'Suena un pedacito desde una décima de segundo y vas pidiendo más. Cuanto antes la saques, más vale.',
    viste: 'Viste Lobo suelto',
    variante: 'mitologia',
    arte: '/arte/lobo.svg',
    href: '/juegos/adivinar-el-tema/',
  },
  {
    titulo: 'Completá la letra',
    baja: 'Falta un verso y lo tenés en la punta de la lengua.',
    viste: 'Viste La mosca y la sopa',
    variante: 'letras',
    arte: '/arte/mosca.svg',
    href: '/juegos/completar-la-letra/',
  },
  {
    titulo: 'Adiviná la tapa',
    // La bajada decia "de a pedacitos" cuando la pantalla era una promesa. El juego
    // muestra la tapa entera, asi que ahora dice lo que hace.
    baja: 'Te mostramos el arte de Rocambole y vos decís de qué disco es.',
    viste: 'Viste Último bondi',
    variante: 'discos',
    arte: '/arte/casete.svg',
    href: '/juegos/adivinar-la-tapa/',
    accion: 'JUGÁ',
  },
] as const;

/**
 * El casete del cancionero. Va en el lado B con la Redondopedia: no es una partida, es
 * lectura — se entra, se busca un tema y se sale, sin nada que cerrar.
 *
 * Viste La mosca y la sopa por la mezcla `D-19`, que le da ese disco a `letras`.
 */
export const CASETE_CANCIONERO: Casete = {
  titulo: 'Letras y acordes',
  baja: 'Los diez discos enteros, con los acordes arriba de cada verso. Y te armás tu propio cancionero.',
  viste: 'Viste La mosca y la sopa',
  variante: 'letras',
  arte: '/arte/mosca.svg',
  href: '/letras-y-acordes/',
  accion: 'TOCÁ',
} as const;

export const CASETE_REDONDOPEDIA: Casete = {
  titulo: 'La Redondopedia',
  baja: 'La historia entera, navegable: el hecho contado como hecho y la leyenda contada como leyenda.',
  viste: 'Viste Gulp!',
  variante: 'historia',
  arte: '/arte/perro.svg',
  href: '/redondopedia/',
  accion: 'LEÉ',
} as const;

/** Las tres pantallas "en la cocina". La promesa es honesta: BR-06 promete acceso
 *  al tema, no reproduccion completa — aca no se promete nada que no este cerrado. */
export interface EnLaCocina {
  readonly titulo: string;
  readonly variante: 'historia' | 'discos' | 'letras' | 'mitologia';
  readonly arte: string;
  readonly queVaASer: string;
  readonly estado: string;
}

export const COCINA: Record<string, EnLaCocina> = {
  'adivinar-el-tema': {
    titulo: 'ADIVINÁ EL TEMA',
    variante: 'mitologia',
    arte: '/arte/lobo.svg',
    queVaASer:
      'Va a sonar un fragmento cortito — arranca en una décima de segundo — y vas a poder ' +
      'pedir más: medio segundo, dos, cinco, diez. Cuanto menos necesites para sacarla, ' +
      'más vale el acierto. Al revelar, el tema queda a un toque en Spotify.',
    estado: 'Está en la cocina: falta recortar los fragmentos de audio.',
  },
  'completar-la-letra': {
    titulo: 'COMPLETÁ LA LETRA',
    variante: 'letras',
    arte: '/arte/mosca.svg',
    queVaASer:
      'Un verso con un hueco, cuatro maneras de cerrarlo. Una sola es la que canta el ' +
      'disco — las otras tres son para dudar un rato.',
    estado: 'Está en la cocina: los versos se están cargando disco por disco.',
  },
  // "Adiviná la tapa" salio de la cocina en el ciclo 4: el juego se juega en
  // `/juegos/adivinar-la-tapa/` y ya no necesita pantalla de promesa.
} as const;

export const COCINA_VOLVER = 'VOLVÉ AL ARCADE';

export const REDONDOPEDIA = {
  titulo: 'LA REDONDOPEDIA',
  bajada:
    'La enciclopedia ricotera. Se entra y se sale cuando quieras: acá no hay partida ' +
    'que cerrar ni resultado que compartir.',
  explicacionRotulos:
    'Todo lo que leas viene rotulado en el punto exacto donde aparece: lo verificado ' +
    'se cuenta como hecho y cita su ficha; lo que circula entre fans va marcado como ',
  palabraLeyenda: 'leyenda',
  explicacionMedio: ' — y vale igual, porque esta historia se transmitió así —; lo que contó ' +
    'alguien con nombre y apellido va como ',
  palabraTestimonio: 'testimonio',
  explicacionCierre: '.',
  secciones: {
    hito: 'La historia',
    persona: 'La banda y los suyos',
    disco: 'Los discos',
    tema: 'Los temas',
    concepto: 'La cultura ricotera',
    leyenda: 'Las leyendas',
  } as const,
  veaTambien: 'Seguí por acá',
  volverPortada: 'A LA REDONDOPEDIA',
} as const;
