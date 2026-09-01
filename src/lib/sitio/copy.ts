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
  /** El logotipo, como se dibuja en pantalla. */
  titulo: 'ARCADE RICOTERO',
  /** El nombre, como se escribe cuando lo lee otro sistema: la pestaña, la tarjeta al
   *  compartir, el titulo de la pagina. La versacal es del logo, no del nombre. */
  nombre: 'Arcade Ricotero',
  bajada:
    'Entrá, que los molinetes van abiertos. ' +
    'Juegos y enciclopedia sobre Patricio Rey y sus Redonditos de Ricota: sin cuenta, ' +
    'sin pagar la entrada, sepas lo que sepas.',
  ladoA: 'Lado A · Para jugar',
  ladoB: 'Lado B · Para leer',
  enLaCocina: 'En la cocina',
  volver: 'VOLVÉ',
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
  /**
   * El texto alternativo de la tarjeta que se ve cuando alguien comparte el sitio.
   *
   * Hace dos trabajos en una linea, y por eso dice lo que dice: describe la imagen para
   * quien no la ve, y **carga el credito de `D-21`** — adentro del sitio el credito de
   * tapas va en el pie de cada pantalla, pero una tarjeta compartida no tiene pie.
   *
   * **Y hay un tercer trabajo, que es lo que NO dice.** No dice "de la tapa de Oktubre",
   * y no es un descuido: `INV-02` encontró que la figura encadenada **no estaba en el
   * arte del vinilo del 86** y se difundió con la reedición en CD, y ese hallazgo sigue
   * en "reportado, no verificado". Atribuirla al disco seria justo lo que el proyecto no
   * hace: una leyenda vestida de hecho. Da el credito a Rocambole, que si es seguro, y se
   * calla lo que todavia no tiene ficha. Ver
   * `Docs/SUGERENCIAS/HILO-para-investigador-figura-encadenada.md`.
   */
  altTarjeta:
    'Calco en línea blanca de la figura encadenada, del arte de Rocambole (Ricardo Cohen).',
  creditoTapas: (discos: readonly string[]) =>
    `En esta pantalla, arte de ${discos.length === 1 ? 'la tapa de' : 'las tapas de'} ` +
    `${discos.length > 1 ? `${discos.slice(0, -1).join(', ')} y ${discos.at(-1)}` : discos[0]}, ` +
    'en baja resolución.',
} as const;

/**
 * Los nombres del lugar (`CNT-13`, `T-184`/`T-188` del ciclo 11).
 *
 * Un renglón por lugar del sitio, y hace un trabajo que ningún degradado hace: **decir
 * dónde estás parado**. El título ya dice qué es la pantalla; esto dice en qué lugar te
 * deja. Es la línea que canta de la regla de las dos líneas
 * (`.claude/rules/voz-ricotera.md` §5), y por eso todos cumplen lo mismo: ocho palabras o
 * menos, segunda persona, una imagen física y barata —moneda, aguja, papel, diente,
 * tinta, guitarra, archivo, puerta— y ninguno explica lo que acaba de decir.
 *
 * **La prueba que los ocho tienen que pasar, y `CNT-13` §5 la corrió uno por uno:** tapá
 * el renglón. Si el que llegó por un enlace todavía sabe qué es esto y qué botón tocar,
 * está bien escrito. Ninguno de los ocho es la única fuente de nada: si se borraran todos,
 * el sitio seguiría siendo jugable y entendible. Eso es lo que los deja ser atmósfera.
 *
 * **`dos-ejes` no tiene renglón, y es a propósito:** todavía no tiene puerta en el portal.
 * Un lugar sin nombre es mejor que un nombre de relleno (`CNT-13` §1).
 */
export const LUGARES = {
  portal: 'Estás en la puerta, con las dos cintas.',
  quiz: 'Se te cae una moneda en la ranura.',
  tema: 'La aguja te tiembla sobre el surco.',
  porLaLetra: 'Un papel arrugado te pesa en el bolsillo.',
  letra: 'Te falta un diente en la sonrisa.',
  tapa: 'Tenés tinta fresca pegada en los dedos.',
  cancionero: 'Tenés la guitarra cruzada en las piernas.',
  redondopedia: 'Tenés todo el archivo tirado en el piso.',
} as const;

/**
 * El interruptor de la cinta (`UX-21`, `ADR-04`).
 *
 * Ocho cadenas: cuatro estampas, una línea de contexto y tres nombres accesibles. Viven
 * acá y no adentro de `sitio/cinta.ts` por un motivo con antecedentes: `voz.test.ts` audita
 * los módulos de copy y no el código suelto, y ya atrapó dos veces texto que se había
 * escrito a mano fuera de un `copy.ts`. Esta pieza tenía ocho oportunidades de repetirlo.
 *
 * **Las cuatro estampas van en registro 3** — seco, sin puntos suspensivos, sin
 * infinitivo. No es un botón que invita a algo: es un **rótulo de estado**, como `LEYENDA`
 * o `TESTIMONIO`. Un aparato de cinta real tampoco dice "presioná para grabar": dice `REC`.
 *
 * **El nombre accesible sí lleva verbo, y por eso va en voseo** (`D-17`): la estampa
 * nombra el estado, el `aria-label` nombra lo que hace el toque.
 */
export const CINTA = {
  apagada: 'CINTA APAGADA',
  sonando: 'CINTA SONANDO',
  callada: 'CINTA CALLADA',
  bloqueada: 'CINTA BLOQUEADA',
  /** `BLOQUEADA` sola no explica por qué, y sin una palabra más se lee como que el sitio
   *  se rompió. Nombra el hecho y se detiene: no culpa a nadie ni manda a probar otra cosa. */
  porQueBloqueada: 'El navegador no la deja sonar acá',
  prender: 'Prendé la cinta',
  apagar: 'Apagá la cinta',
} as const;

/**
 * Los cinco casetes del portal.
 *
 * **Habia un campo `viste`** que imprimia debajo de cada casete que disco lo vestia
 ("Viste Oktubre", "Viste Lobo suelto"). Lo saco el usuario el 2026-08-24: la mezcla
 * `D-19` se ve en el color, no hace falta anunciarla con letras. El mapa seccion->disco
 * sigue vivo donde tiene que estar, en `UX-04` y en los tokens.
 */
export interface Casete {
  readonly titulo: string;
  readonly baja: string;
  /** 'momo' la suma `US-07` (`UX-08`): Momo Sampler era la unica de las diez tapas sin
   *  tomar como identidad de seccion, y vestirlo como su hermano de audio haria que dos
   *  juegos casi gemelos se leyeran como el mismo con dos nombres. */
  readonly variante: 'marca' | 'historia' | 'discos' | 'letras' | 'mitologia' | 'momo';
  readonly arte: string;
  readonly href?: string;
  readonly accion?: string;
}

export const JUEGOS: readonly Casete[] = [
  {
    titulo: 'Preguntas ricoteras',
    baja: 'Ocho preguntas y ninguna piadosa. Historia, discos, letras y mitología, en dos minutos.',
    variante: 'marca',
    arte: '/arte/casete.svg',
    href: '/quiz/',
    accion: 'JUGÁ',
  },
  {
    titulo: 'Adiviná el tema',
    baja: 'Con una décima te tiene que alcanzar. Si no, te damos más, hasta diez segundos: cuanto antes la pegues, más vale.',
    variante: 'mitologia',
    arte: '/arte/lobo.svg',
    href: '/juegos/adivinar-el-tema/',
    accion: 'JUGÁ',
  },
  {
    titulo: 'Sacalo por la letra',
    baja: 'Un verso te tiene que alcanzar. Si no, te damos más: dos, cuatro, ocho.',
    // `UX-08`: viste Momo Sampler, la única de las diez tapas que no estaba tomada como
    // identidad de sección. Vestirlo igual que su hermano de audio haría que dos juegos
    // casi gemelos se leyeran como el mismo con dos nombres.
    variante: 'momo',
    arte: '/arte/casete.svg',
    href: '/juegos/adivinar-por-la-letra/',
    accion: 'JUGÁ',
  },
  {
    titulo: 'Completá la letra',
    baja: 'Lo tenés en la punta de la lengua. Falta una palabra del verso y hay cuatro para elegir.',
    variante: 'letras',
    arte: '/arte/mosca.svg',
    href: '/juegos/completar-la-letra/',
  },
  {
    titulo: 'Adiviná la tapa',
    // La bajada decia "de a pedacitos" cuando la pantalla era una promesa. El juego
    // muestra la tapa entera, asi que ahora dice lo que hace.
    baja: 'Rocambole dibujó; vos ponés el disco. La tapa entera en pantalla y cuatro discos para elegir.',
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
  baja: 'Los diez discos, con los dedos puestos. Acordes arriba de cada verso, transporte, y armás tu cancionero.',
  variante: 'letras',
  arte: '/arte/mosca.svg',
  href: '/letras-y-acordes/',
  accion: 'TOCÁ',
} as const;

export const CASETE_REDONDOPEDIA: Casete = {
  titulo: 'La Redondopedia',
  baja: 'El hecho como hecho, la leyenda como leyenda. La historia entera, navegable, con la ficha de dónde salió cada dato.',
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
  // "Adiviná el tema" salio de la cocina: el juego se juega en
  // `/juegos/adivinar-el-tema/` y ya no necesita pantalla de promesa.
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
