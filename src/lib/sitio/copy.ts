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
    baja: 'El arte de Rocambole, de a pedacitos y en baja.',
    viste: 'Viste Último bondi',
    variante: 'discos',
    arte: '/arte/casete.svg',
    href: '/juegos/adivinar-la-tapa/',
  },
] as const;

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
  'adivinar-la-tapa': {
    titulo: 'ADIVINÁ LA TAPA',
    variante: 'discos',
    arte: '/arte/casete.svg',
    queVaASer:
      'El arte de Rocambole aparece de a pedacitos, en baja resolución y con su crédito, ' +
      'y hay que decir qué disco es antes de que se vea entero.',
    estado: 'Está en la cocina: faltan las imágenes y su contrato.',
  },
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
    concepto: 'La cultura ricotera',
    leyenda: 'Las leyendas',
  } as const,
  veaTambien: 'Seguí por acá',
  volverPortada: 'A LA REDONDOPEDIA',
} as const;
