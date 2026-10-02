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

import type { Disco } from '../letra/discos.ts';
import { CASETE as CASETE_SKAYBOY } from '../skayboy/copy.ts';

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
  /**
   * El pie, en 42 caracteres (`CNT-16`, `T-220`).
   *
   * Lo pidió el usuario textual: *"achicar el mensaje de abajo dejando 'sitio hecho por
   * ricoteros para ricoteros'"*. La coma la suma `contenido`: marca la vuelta de la frase
   * —quién lo hizo / para quién es— sin agregar una palabra.
   *
   * **Lo que decía antes no se borró, se mudó** al desplegable de acá abajo: sin fines de
   * lucro, el crédito a Rocambole y a la banda, y la postura de `D-14`. El mapa de `CNT-01`
   * sigue completo; lo que cambió es que está a un toque en vez de a la vista.
   *
   * Sobre `voz-ricotera.md` §3.8 ("la gente", no "los fans"): acá no hace falta la excepción
   * del pie, porque la frase no dice "fans" ni "usuarios". Dice **ricoteros**, y nombra con
   * la misma palabra al que lo hizo y al que lo juega, en el mismo gesto.
   */
  pie: 'Sitio hecho por ricoteros, para ricoteros.',
  /** El disparador del desplegable. Registro 1: es un control que se toca, en voseo. */
  creditosRotulo: 'Mirá los créditos',
  /**
   * El cuerpo del desplegable: el pie de antes, palabra por palabra, con un solo recorte.
   *
   * Sale "Sitio de fans, " del arranque, porque ese trabajo ya lo hace la frase corta de
   * afuera, y "sin fines de lucro" pasa de cierre de esa oración a apertura de esta. Nada del
   * crédito ni de la postura cambia una letra.
   */
  creditosCuerpo:
    'Sin fines de lucro: el arte de las tapas es de Rocambole ' +
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
 * **La prueba que los once tienen que pasar, y `CNT-13` §5 y §8 la corrieron uno por uno:**
 * tapá el renglón. Si el que llegó por un enlace todavía sabe qué es esto y qué botón tocar,
 * está bien escrito. Ninguno de los once es la única fuente de nada: si se borraran todos,
 * el sitio seguiría siendo jugable y entendible. Eso es lo que los deja ser atmósfera.
 *
 * **`dos-ejes` no tuvo renglón hasta el 2026-10-01, y fue a propósito:** no tenía puerta en
 * el portal, y un lugar sin nombre es mejor que un nombre de relleno (`CNT-13` §1). Ese día
 * consiguió casete y `contenido` le escribió el undécimo (`CNT-26`, `CNT-13` §8).
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
  /* `US-08`. **No nombra ninguna de las cuatro filas**, y es a proposito: nombrar una le
     daria a esa el lugar de la imagen, y las cuatro tienen que pesar lo mismo (`BR-22`).
     Lo que nombra es el desorden previo, que es de donde sale el impulso de ordenar. */
  ponelos: 'Se te desordenó la pila de discos.',
  /* `US-10` (`CNT-25` §3.1): el juego es decidir antes de dar vuelta algo. */
  masOMenos: 'Tenés una ficha boca abajo en la mano.',
  /* `US-06` (`CNT-26`, `CNT-13` §8): viste *Luzbelito*, la cabeza con la vela. Una vela que
     alumbra **media** cara: luz y oscuridad a la vez, sin decir cuál de las dos es la buena. */
  dosEjes: 'Una vela te alumbra media cara.',
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
  /** 'bang' la suma `US-08`: era uno de los tres discos que la mezcla `D-19` todavia no
   *  habia tomado, y el unico de los tres cuya tinta no duplica una ya usada ni pisa un
   *  rotulo reservado. *Cordero atado* comparte hex con *Lobo suelto* (`RES-37` los midio
   *  juntos) y *Un baion* choca con el celeste de `--rotulo-testimonio`, que no rota. */
  /** 'baion' la suma `US-10` (`UX-34` §1): era el único de los dos discos que quedaban sin
   *  tomar cuya tinta no duplica una ya usada — *Cordero atado* es el mismo disco que *Lobo
   *  suelto* (`RES-37` los midió juntos). El celeste de *Un baión* linda con
   *  `--rotulo-testimonio`, pero esa sección nunca muestra esa insignia: ahí no hay leyenda
   *  ni testimonio, solo hecho o "según" (`D-48` punto 6). */
  /** 'luzbelito' la suma `US-06` el 2026-10-01, cuando el test de dos ejes consiguió puerta:
   *  `UX-06` §5 ya lo vestía de *Luzbelito* (la dualidad luz-oscuridad), sin casete. */
  readonly variante: 'marca' | 'historia' | 'discos' | 'letras' | 'mitologia' | 'momo' | 'bang' | 'baion' | 'luzbelito';
  /**
   * Lo que va pegado en el casete: **una tapa entera, un detalle de tapa o un recorte de una
   * figura de tapa, y nunca el casete dibujado** (`D-49`). Lo pidió el usuario el
   * 2026-10-01: *"que todas las entradas de juegos del home tengan un detalle o un disco
   * entero, no el svg del cassete, cada uno diferente"*. Hasta ese día tres juegos llevaban
   * el mismo casete dibujado y dos casetes la misma mosca.
   *
   * Tres materiales, y el portal los reconoce por la carpeta: `/tapas/<disco>.jpg` es la
   * tapa entera, `/tapas/detalle/` es un pedazo de la foto, y `/arte/` es un recorte con
   * fondo transparente. Cada uno acredita su disco en el pie (`D-21`), y `portal.test.ts`
   * falla si dos casetes repiten pieza o si alguno no tiene disco que acreditar.
   */
  readonly arte: string;
  readonly href?: string;
  readonly accion?: string;
}

export const JUEGOS: readonly Casete[] = [
  {
    titulo: 'Preguntas ricoteras',
    baja: 'Ocho preguntas y ninguna piadosa. Historia, discos, letras y mitología, en dos minutos.',
    variante: 'marca',
    // *Oktubre* entero: es el disco que viste la portada y la sección de marca (`D-19`), y el
    // del mes en que se cambió (`D-49`).
    arte: '/tapas/oktubre.jpg',
    href: '/quiz/',
    accion: 'JUGÁ',
  },
  {
    // `US-06`. Terminado y revisado desde el ciclo 8 y **sin un solo enlace** hasta el
    // 2026-10-01: nadie lo había dejado afuera, fue un olvido (`D-51`). Va segundo porque es
    // el molinete más abierto del sitio —no pide saber nada de la banda (`UX-06` §0)—, y el
    // que llega sin idea tiene que encontrarlo antes que los juegos que sí piden.
    titulo: '¿Qué tipo de ricotero sos?',
    baja: 'Nadie te toma examen. Diez preguntas sobre vos, sin puntaje y sin saber nada de la banda.',
    variante: 'luzbelito',
    // La cabeza con la vela de *Luzbelito*, recortada a mano: luz y oscuridad en una pieza.
    arte: '/arte/luzbelito-vela.png',
    href: '/juegos/dos-ejes/',
    accion: 'EMPEZÁ',
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
    // El medallón de la tapa del disco que viste este juego (`UX-08`), recortado a mano. Era
    // el casete dibujado, repetido en cuatro de los seis juegos: el portal se leía como una
    // lista de íconos iguales en vez de un collage.
    arte: '/arte/momo-medallon.png',
    href: '/juegos/adivinar-por-la-letra/',
    accion: 'JUGÁ',
  },
  {
    titulo: 'Completá la letra',
    baja: 'Lo tenés en la punta de la lengua. Falta una palabra del verso y hay cuatro para elegir.',
    variante: 'letras',
    // La olla de *La mosca y la sopa*. Era la mosca recortada, que en el portal ya vuela
    // suelta por la pantalla: la misma pieza dos veces en la misma vista (`D-49`).
    arte: '/tapas/detalle/mosca-olla.jpg',
    href: '/juegos/completar-la-letra/',
    // La acción está, pero el portal la muestra solo si el banco tiene versos listos: lo
    // decide `segunLaPartida()` (`portal.ts`) con el mismo `cargarBanco()` que la página.
    // Hasta el ciclo 16 este casete no tenía acción y el portal decía "en la cocina" de un
    // juego que ya se jugaba.
    accion: 'JUGÁ',
  },
  {
    titulo: 'Ponelos en fila',
    // La primera oración canta las filas (`D-52`): del pogo a quietito, sin decir cuál es mejor.
    baja: 'Unos te tiran al pogo; otros, quietito. Los diez discos, las tapas, o los temas de un disco: el orden lo armás vos.',
    variante: 'bang',
    // *¡Bang! ¡Bang!… Estás liquidado* entero: un juego de poner discos en fila lleva un disco.
    arte: '/tapas/bang-bang-estas-liquidado.jpg',
    href: '/juegos/ponelos-en-fila/',
    accion: 'ARMÁ',
  },
  {
    titulo: 'Adiviná la tapa',
    // La bajada decia "de a pedacitos" cuando la pantalla era una promesa. El juego
    // muestra la tapa entera, asi que ahora dice lo que hace.
    baja: 'Rocambole dibujó; vos ponés el disco. La tapa entera en pantalla y cuatro discos para elegir.',
    variante: 'discos',
    // El bondi interplanetario de *Último bondi a Finisterre*, que es el disco que viste la
    // sección discos (`D-19`): un juego de tapas lleva un pedazo de tapa, no un casete.
    arte: '/arte/bondi-interplanetario.png',
    href: '/juegos/adivinar-la-tapa/',
    accion: 'JUGÁ',
  },
  {
    // `US-10` (`D-48`, `CNT-25`, `UX-34`). Viste *Un baión para el ojo idiota*.
    titulo: 'Más o menos',
    baja:
      'Elegís más o menos, sin red. Preguntas de número sobre la banda: cuántos años, ' +
      'cuántos temas, cuánto dura. Hasta que le erres una.',
    variante: 'baion',
    // El antifaz del muñeco de *Un baión*, el disco que viste este juego (`UX-34`).
    arte: '/tapas/detalle/un-baion-para-el-ojo-idiota-zoom.jpg',
    href: '/juegos/mas-o-menos/',
    accion: 'JUGÁ',
  },
  {
    // `US-09`. Publicado el 2026-10-01 por decisión del usuario (`D-51`). La copia es la de
    // `CNT-19`, ya aprobada, y vive en `skayboy/copy.ts`: acá se reusa, no se reescribe.
    titulo: CASETE_SKAYBOY.titulo,
    baja: CASETE_SKAYBOY.baja,
    // Viste *Gulp!* por herencia del contenido (`UX-30` §2): los dos temas que le dan su par
    // elemental son de ese disco. La variante `historia` es esa tinta (`--cat-historia`).
    variante: 'historia',
    // El "Gulp." rojo del sobre: la otra pieza de *Gulp!* en el portal es el "Patricio Rey"
    // verde de la Redondopedia, y `D-49` no deja repetir.
    arte: '/tapas/detalle/gulp-logo.jpg',
    href: '/juegos/skayboy-y-poligirl/',
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
  // *La mosca y la sopa* entero: el escenario con las luces prendidas, que es lo más cerca
  // que tiene una tapa de un tema sonando. La mosca suelta ya vuela por el portal (`D-49`).
  arte: '/tapas/la-mosca-y-la-sopa.jpg',
  href: '/letras-y-acordes/',
  accion: 'TOCÁ',
} as const;

export const CASETE_REDONDOPEDIA: Casete = {
  titulo: 'La Redondopedia',
  baja: 'El hecho como hecho, la leyenda como leyenda. La historia entera, navegable, con la ficha de dónde salió cada dato.',
  variante: 'historia',
  // El "Patricio Rey" pintado a mano de *Gulp!*, el primer disco: la historia arranca ahí, y
  // `historia` viste Gulp! (`D-19`). Era el perro dibujado, que no es de ninguna tapa.
  arte: '/tapas/detalle/gulp-zoom.jpg',
  href: '/redondopedia/',
  accion: 'LEÉ',
} as const;

/** Los números chicos en letra: en una frase que se lee, "seis" y no "6". */
const EN_LETRAS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
const enLetras = (n: number): string => EN_LETRAS[n] ?? String(n);

/**
 * El afiche de octubre del portal (`D-49`).
 *
 * Lo pidió el usuario el 2026-10-01: *"entramos en OKTUBRE, el mes del disco, hagamos que
 * la página refleje esto"*. Se muestra solo en octubre, y lo decide el teléfono de quien
 * mira, no el día del build (`index.astro`).
 *
 * **Lo que cuenta es un hecho, y sale del JSON**: de los diez discos, seis salieron en
 * octubre —*Oktubre* el 4 de 1986, *¡Bang! ¡Bang!* el 7 de 1989, *La mosca y la sopa* el 27
 * de 1991, *Lobo suelto* y *Cordero atado* el 4 de 1993, *Luzbelito* el 7 de 1996—, todos
 * rotulados `hecho` en la Redondopedia y sin discrepancia entre fuentes (`RES-02`, `RES-20`).
 * La cuenta no está escrita acá: la hace `discosDeOktubre()` con las fichas, así que si una
 * fecha se corrige, el afiche se corrige solo.
 *
 * Las dos líneas de `voz-ricotera.md` §5: nombra el sello (*OKTUBRE*, en la letra calcada de
 * la tapa, que tiene las siete letras) con la estampa del cumpleaños; canta la línea del
 * sobre. Tapada la que canta, el afiche sigue diciendo qué es y qué botón tocar.
 */
export const OKTUBRE = {
  /** El sello grande. Va en `--fuente-titular`: O, K, T, U, B, R y E existen en el calco. */
  sello: 'OKTUBRE',
  /** La estampa del cumpleaños, según el día. Registro 3: dice qué pasa y se calla. */
  cumpleAntes: (dia: number, anios: number) => `EL ${dia} CUMPLE ${anios}`,
  cumpleHoy: (_dia: number, anios: number) => `HOY CUMPLE ${anios}`,
  cumplio: (dia: number, anios: number) => `CUMPLIÓ ${anios} EL ${dia}`,
  /** La que canta (registro 1): un objeto de la casa, un gesto, y nada que explicar. */
  canta: 'Sacá el disco del sobre, soplale el polvo.',
  /** La que cuenta (registro 2), con los números de las fichas. */
  cuenta: (deOktubre: number, total: number) =>
    `De los ${enLetras(total)} discos, ${enLetras(deOktubre)} salieron en octubre.`,
  /** El nombre de la lista de fechas, para quien no ve la grilla. */
  calendario: 'Los discos que salieron en octubre',
  /** El botón: el juego de adivinar el tema, con el disco ya elegido. */
  jugar: 'ADIVINÁ TEMAS DE OKTUBRE',
} as const;

/**
 * La carátula de cada juego (`D-54`, `UX-35`). Todo registro 3: dice qué hay y se calla.
 *
 * El nombre del juego y la lista de temas no se escriben acá: salen de `JUEGOS`, igual que
 * en el portal. Lo único propio de la carátula es cómo se nombra a sí misma para el lector de
 * pantalla, y el renglón de la pista — que en la tapita de un casete grabado en casa se
 * escribe así, con el lado primero.
 */
export const CARATULA = {
  rotulo: (titulo: string) => `Carátula de ${titulo}`,
  pista: (lado: string, numero: number) => `Lado ${lado} · pista ${numero}`,
  /* "Los otros casetes" decía algo falso: la lista trae también el de la página, marcado
     (`UX-35` §6.5). */
  lista: 'Los casetes',
} as const;

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

/**
 * El pie de la tapa entera en la ficha de cada disco de la Redondopedia (`CNT-24`).
 *
 * Registro 3: dice de quién es la imagen y se calla. Hasta el ciclo 16 la página escribía
 * "Tapa: Rocambole (Ricardo Cohen)" fijo en los diez, y en tres era falso o más angosto que la
 * ficha: *Lobo suelto* y *Cordero atado* se firman conjuntos (`RES-40`, el mismo crédito que
 * `TP-007`/`TP-008` de `tapa.json`), y la imagen de *La mosca y la sopa* no se le acredita a
 * Rocambole mientras `RES-44` siga abierta (`scripts/generar-tapas.mjs`, sobre `FICHAS`).
 */
export const PIE_DE_TAPA: Readonly<Record<Disco, string>> = {
  gulp: 'Tapa: Rocambole (Ricardo Cohen), en baja resolución.',
  oktubre: 'Tapa: Rocambole (Ricardo Cohen), en baja resolución.',
  'un-baion-para-el-ojo-idiota': 'Tapa: Rocambole (Ricardo Cohen), en baja resolución.',
  'bang-bang-estas-liquidado': 'Tapa: Rocambole (Ricardo Cohen), en baja resolución.',
  'la-mosca-y-la-sopa': 'Tapa: autoría sin confirmar, en baja resolución.',
  'lobo-suelto': 'Tapa: Rocambole, Semilla y Meroyuela, en baja resolución.',
  'cordero-atado': 'Tapa: Rocambole, Semilla y Meroyuela, en baja resolución.',
  luzbelito: 'Tapa: Rocambole (Ricardo Cohen), en baja resolución.',
  'ultimo-bondi-a-finisterre': 'Tapa: Rocambole (Ricardo Cohen), en baja resolución.',
  'momo-sampler': 'Tapa: Rocambole (Ricardo Cohen), en baja resolución.',
};
