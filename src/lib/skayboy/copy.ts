/**
 * El texto de Skayboy y Poligirl (`US-09`).
 *
 * **Nada de esto lo escribió el hilo principal.** Las cadenas salen enteras de tres notas
 * de `contenido` y se copian acá sin retocar: `CNT-17` (el pie de homenaje), `CNT-18` (las
 * teclas, el rótulo de carga, la línea de vertical y el aviso) y `CNT-19` (el nombre y la
 * bajada del casete). `CNT-21` no trajo cadena nueva: fijó cuándo se muestra la línea de
 * vertical. Si alguna hay que cambiarla, se cambia allá primero.
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
