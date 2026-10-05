/**
 * El texto de Skayboy y Poligirl (`US-09`).
 *
 * **Nada de esto lo escribió el hilo principal.** Las cadenas salen enteras de tres notas
 * de `contenido` y se copian acá sin retocar: `CNT-17` (el pie de homenaje), `CNT-18` (las
 * teclas, el rótulo de carga, la línea de vertical y el aviso) y `CNT-19` (el nombre y la
 * bajada del casete). `CNT-21` no trajo cadena nueva: fijó cuándo se muestra la línea de
 * vertical. `CNT-22` trajo las de la pantalla completa, la victoria y lo que junta cada uno. Si
 * alguna hay que cambiarla, se cambia allá primero.
 *
 * **Y acá es donde se auditan de verdad.** Mientras vivían en un `.md` no las miraba
 * ninguna máquina; desde que están en este archivo, `voz.test.ts` les pasa sus siete
 * reglas —anglicismos, fórmulas de folleto, botones en infinitivo, largo de título, la
 * primera frase de la bajada, "los fans", suspensivos en rótulos— igual que a los otros
 * ocho juegos.
 *
 * El pie es obligatorio: lo volvió obligatorio `D-42` cuando autorizó que los muñecos
 * tengan cara, y `BR-26` fija qué tiene que decir.
 */

/**
 * El casete del portal (`CNT-19`).
 *
 * La regla de las dos líneas, acá: **nombra el título** y **canta la primera frase de la
 * bajada**. Tapando "Agarrás tu lado del teléfono.", el que llega por un enlace todavía
 * sabe qué es esto — que es la prueba que pide `voz-ricotera.md` §5.
 *
 * **El nombre lo confirmó el usuario el 2026-09-20**, y `T-234` quedó cumplida. Estuvo
 * pendiente por algo que vale la pena recordar acá: se eligió cuando el par era fuego/agua
 * y hoy es cielo/infierno (`D-40`, `D-43`). Lo que lo sostuvo es el argumento de
 * `CNT-19 §1.1` — **el nombre promete una dupla, no un elemento**, y por eso el cambio de
 * par no lo tocó.
 */
export const CASETE = {
  titulo: 'Skayboy y Poligirl',
  baja:
    'Agarrás tu lado del teléfono. Cielo para uno, infierno para el otro: las dos ' +
    'puertas se abren juntas, o las cruzás solo, una por vez.',
} as const;

/**
 * Las seis teclas (`CNT-18`). Tres por columna, y **cada columna maneja siempre al mismo
 * personaje**: eso es `D-43`, que sacó el botón de cambio. El que no tiene un dedo encima
 * se queda quieto y a salvo.
 *
 * Son `aria-label`, no texto visible: en pantalla las teclas son formas. Van en registro 3
 * —dicen qué hacen y se callan— salvo el voseo, que no se negocia (`D-17`).
 */
export const TECLAS = {
  izquierda: 'Andá a la izquierda',
  derecha: 'Andá a la derecha',
  salto: 'Saltá',
  mandoIzquierdo: 'Mando izquierdo',
  mandoDerecho: 'Mando derecho',
  /**
   * En la computadora no hay botones en pantalla (`D-55`): cada columna dice de quién es y con
   * qué teclas se mueve. Registro 3 —qué hay y nada más—. Las teclas no se escriben acá: salen
   * del mapa de `teclado.ts`, que es el mismo que aprieta los botones (`D-53`).
   */
  quienIzquierda: 'Skayboy',
  quienDerecha: 'Poligirl',
  comoSeMueve: (quien: string, salto: string, izquierda: string, derecha: string) =>
    `${quien} salta con ${salto} y camina con ${izquierda} y ${derecha}.`,
} as const;

/**
 * Lo que la persona lee antes, durante y después de que algo pase (`CNT-18`).
 *
 * `rotuloCarga` no es decorativo y dejó de ser una precaución: `T-226` midió **114 ms
 * hasta jugable** en escritorio, así que en un teléfono esto es lo que se mira mientras el
 * motor arranca. Dice qué va a haber ahí y **no promete nada** (`ADR-08.2`).
 *
 * `avisoEntrada` es el fracaso, y está escrito como lo pide `UX-29`: **el fracaso no te
 * consume, te rechaza**. Te devuelve a la entrada, que es el molinete otra vez.
 *
 * El vocabulario que acá no entra está listado en `BR-24` y lo barre `UX-29 §9.1`. **No lo
 * copio en este comentario a propósito:** la barredora es un `rg` sobre `src/lib/skayboy/`,
 * y una cita —aunque sea para explicar la prohibición— la devuelve igual. Un barrido que
 * saca resultados correctos se termina apagando, y con él se apagan los que sí importan.
 */
export const PANTALLA = {
  /**
   * Sigue siendo la frase de `CNT-18`, sin tocar una letra, pero **dejó de ser
   * incondicional** (`CNT-21 §2`, `UX-28 §4.1`). A ×1 de costado la cabecera entra en la
   * columna del mueble (`UX-28 §2.3`), y un teléfono de 375 o 390 de ancho gira y sigue en
   * ×1: prometerle "el doble" sería mentirle a la mayoría. La hoja la muestra solo con
   * ancho de más de 400 **y** alto de 720 o más, a la vez; afuera, silencio y no una frase
   * de repuesto. Si esta cadena cambia, se cambia en `CNT-21` primero.
   */
  lineaVertical: 'De costado se ve el doble de grande.',
  rotuloCarga: 'Acá va el juego.',
  avisoEntrada: 'De vuelta en la entrada.',
  /**
   * La etiqueta del control para seguir al próximo nivel, una vez ganado (`UX-32 §5`). **No es
   * una cadena nueva**: es el verbo que el sitio ya usa para continuar después de revelar algo
   * (`letra`, `tapa`, `tema` y `por-la-letra` dicen lo mismo), y el traspaso a `contenido`
   * (`Docs/SUGERENCIAS/UX-para-contenido-lo-que-hay-que-escribir.md §6`) deja escrito que, si
   * alcanza con reutilizarlo tal cual, no hay redacción pendiente. Va de `aria-label`: el botón
   * se superpone al área y adentro del área no hay texto (`UX-27 §5.1`).
   */
  seguir: 'Seguí',
  /**
   * El par que le faltaba a `avisoEntrada` (`CNT-22 §2`): ganar, para el lector de pantalla.
   * Nombra el hecho de juego —las dos puertas quedaron abiertas— y no a las personas: cualquier
   * verbo sobre los dos juntos empieza a sonar a logro compartido (`BR-31`, `UX-33 §2.6`). No
   * nombra el baile, que es decorativo y no cambia nada de lo que se puede tocar.
   */
  avisoVictoria: 'Las dos puertas, abiertas.',
  /**
   * La línea del final del sexto nivel (`CNT-22 §3`), que dice que ahí el toque no lleva a un
   * séptimo sino a compartir. **Todavía no se muestra en ningún lado** (`T-302`): la pieza
   * compartible de `BR-27` no existe, y decir "ahora se comparte" sin nada que compartir sería
   * prometer lo que no hay (`ADR-08.2`). Queda acá, auditada por `voz.test.ts`, para el día que
   * exista.
   */
  avisoUltimoNivel: 'Último nivel. Ahora se comparte.',
  /**
   * **Lo que sí se dice hoy al ganar el sexto**, para el lector de pantalla, después de
   * `avisoVictoria`: la primera oración de `avisoUltimoNivel`, tal cual, sin la promesa. Mientras
   * no exista la pieza de `BR-27`, el toque del sexto vuelve al primero de la fila (`escena.ts`), y
   * quien no ve la pantalla tiene que saber por qué lo que sigue es el 1. Registro 3: el hecho y
   * nada más. **No es texto nuevo de `contenido`**, es un recorte del suyo; el traspaso
   * `HILO-para-producto-y-experiencia-la-victoria-y-la-fila.md` se lo pregunta igual.
   */
  avisoUltimo: 'Último nivel.',
} as const;

/**
 * El pie de homenaje (`CNT-17`), obligatorio por `D-42` y especificado por `BR-26`.
 *
 * Registro 3 entero, y no por prolijidad: es el rótulo que sostiene que el sitio pueda
 * dibujar a dos personas reales con cara. Nombres completos, no apodos — el apodo es lo
 * que está en el título del juego; acá va quién es cada uno de verdad. Sin chiste, sin
 * imagen, sin suspensivos. Un rótulo con onda es un rótulo en el que no se puede confiar.
 */
export const PIE_HOMENAJE =
  'Homenaje de fans, no oficial: ni Eduardo Beilinson ni Carmen Castro tuvieron nada que ver.';

/**
 * El interruptor de pantalla completa (`CNT-22 §1`, enmendado por `CNT-40 §5`; `UX-33 §1.2` y
 * `§1.5`, enmendados por `UX-37` §8.6; `T-301`).
 *
 * **Desde `D-61` la estampa dice lo que hace el toque**, no el estado en que se está: decía
 * `PANTALLA NORMAL` afuera del modo y el usuario no encontró el botón. Ahora afuera dice
 * `PANTALLA COMPLETA` y adentro `SALÍ`, y cada una está contenida en su `aria-label` (el nombre
 * accesible contiene el texto visible, WCAG 2.5.3, que el sello viejo no cumplía). Un solo botón,
 * dado vuelta —más el del menú, que se pinta igual—. Las claves siguen nombrando el estado
 * (`ventana`, `completa`) y los valores el toque: cruce raro de leer, y queda escrito (`CNT-40`).
 *
 * `SALÍ` lleva tilde: va en `--fuente-rotulada`, que la tiene (la deuda de acentos de
 * `diseno-marca.md` es de las letras de disco). **Sin ícono**: las flechas en diagonal son el
 * ícono de librería que esa misma regla veta.
 *
 * No hay una cadena para "esto no es pantalla completa de verdad" en iPhone (`CNT-22 §6`,
 * `UX-33 §1.8`): el resultado es el mismo, y explicar el mecanismo no le sirve a nadie para jugar.
 */
export const PANTALLA_COMPLETA = {
  ventana: 'PANTALLA COMPLETA',
  entrar: 'Entrá a pantalla completa',
  completa: 'SALÍ',
  salir: 'Salí de pantalla completa',
} as const;

/**
 * Lo que junta cada uno (`CNT-22 §4` y `§5`, `D-47` punto 4, `UX-33 §2.5`): Skayboy, guitarras;
 * Poligirl, cigarrillos.
 *
 * **El contador** se arma con un número y la palabra que corresponda —`"1 guitarra"`,
 * `"3 cigarrillos"`— y se muestra **solo en la victoria**, uno junto a cada personaje, en registro
 * 3 y **sin comparación entre los dos**, nunca "3 contra 2" (`BR-27` punto 2). Lo compone
 * `textoDelContador()` en `escena.ts`; acá quedan las palabras sueltas, como las dejó `contenido`.
 *
 * **Los avisos** son para el lector de pantalla, al levantar uno: nombran el objeto y se callan.
 * Decir más —"conseguiste una guitarra"— narraría un logro (`BR-23`, `BR-31`).
 */
export const COLECCIONABLE = {
  guitarra: 'guitarra',
  guitarras: 'guitarras',
  cigarrillo: 'cigarrillo',
  cigarrillos: 'cigarrillos',
  avisoGuitarra: 'Guitarra.',
  avisoCigarrillo: 'Cigarrillo.',
} as const;

/**
 * El menú del juego (`D-61` punto 1). **Los textos son de `CNT-40` §1**, copiados sin retocar; si
 * alguno cambia, cambia allá primero.
 *
 * El botón grande dice `jugar` al entrar y al abrirlo con el nivel ganado, y `seguirJugando` con
 * una partida en pausa; debajo, un renglón seco dice qué nivel juega (`cualToca`). Las fichas
 * llevan el número y el nombre de `CNT-21`, y un sello en registro 3 si están pasadas o si son la
 * del nivel armado. El título de la lista es la única línea que dice en pantalla lo que decidieron
 * `D-61` punto 2 y `BR-40`: **si un nivel vuelve a trabarse, esa línea miente y se cambia en el
 * mismo commit**.
 */
export const MENU = {
  sello: 'MENÚ',
  abrir: 'Abrí el menú',
  jugar: 'Jugá',
  seguirJugando: 'Seguí jugando',
  repetir: 'Empezá el nivel de nuevo',
  cualToca: (numero: number, nombre: string) => (nombre === '' ? `Nivel ${numero}` : `Nivel ${numero}: ${nombre}`),
  niveles: 'Los niveles, todos abiertos',
  numero: (numero: number) => `Nivel ${numero}`,
  pasado: 'PASADO',
  estasAca: 'ACÁ ESTÁS',
  /**
   * El `aria-label` de cada ficha (`CNT-40` §1.1): `Nivel {n}, {nombre}. {estado}.`, donde el estado
   * es lo que dicen los sellos de esa ficha —`Pasado`, `Acá estás` o `Pasado, acá estás`—, y sin
   * estado, sin el segundo tramo. El lector dice lo mismo que el sello, no una paráfrasis.
   */
  etiqueta: (numero: number, nombre: string, pasado: boolean, actual: boolean) => {
    const cabeza = nombre === '' ? `Nivel ${numero}.` : `Nivel ${numero}, ${nombre}.`;
    const estado = [pasado ? 'pasado' : '', actual ? 'acá estás' : ''].filter((p) => p !== '').join(', ');
    return estado === '' ? cabeza : `${cabeza} ${estado.charAt(0).toUpperCase()}${estado.slice(1)}.`;
  },
} as const;

/**
 * La tarjeta de fin de nivel (`D-61` punto 3, `CNT-40` §2): aparece en el mismo cuadro en que se
 * gana, arriba del área (`UX-37` §4.3). **Nombra el hecho de juego y se calla** (`BR-31`): el nivel
 * pasado, el que sigue y tres botones. Nada de "ganaron". `sigue` dice `Siguiente` y no `Sigue`:
 * pegado al botón `Seguí` era el mismo verbo en dos personas a un dedo de distancia (`CNT-40`).
 *
 * En el sexto, el renglón del que sigue lo ocupa `ultimo` —el recorte de `avisoUltimoNivel` que ya
 * se le dice al lector de pantalla— y el botón principal dice `volverAlPrimero`: es el parche de
 * `BR-40` punto 7 mientras no exista la pieza compartible de `BR-27` (`T-302`). Ese día se borra.
 */
export const FIN_DE_NIVEL = {
  rotulo: (numero: number, total: number) => `NIVEL ${numero} DE ${total} · PASADO`,
  sigue: (nombre: string) => `Siguiente: ${nombre}`,
  volverAlPrimero: 'Volvé al primero',
  repetir: 'Repetí',
  menu: 'Elegí otro',
  ultimo: 'Último nivel.',
} as const;

/**
 * El rótulo de entrada de cada nivel (`D-61` punto 3, `CNT-40` §3): número arriba, que nombra, y el
 * nombre de `CNT-21` abajo, que canta. La regla de las dos líneas más limpia del juego.
 */
export const ENTRADA = {
  rotulo: (numero: number, total: number) => `NIVEL ${numero} DE ${total}`,
} as const;
