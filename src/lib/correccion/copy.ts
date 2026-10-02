/**
 * El copy del botón de corrección. Transcribe `CNT-12`
 * (`Docs/CONTENIDO/CNT-12-copy-correccion.md`), con sus identificadores.
 *
 * **Todo es registro 3**, el que rotula: seco, sin imagen, sin chiste, sin suspensivos.
 * `voz-ricotera.md` sección 5 es explícita — *"el registro 3 es el más importante y el
 * que más tienta decorar. No se decora."*
 *
 * Y la razón por la que acá no se decora no es de estilo: `BR-21` fija que el sitio
 * promete **solo lo que puede verificar con un comando**. Un "¡Gracias por ayudarnos a
 * mejorar!" promete una conversación que no hay quién sostenga, y eso es un rótulo que
 * miente sobre lo que hay adentro — el único daño que este proyecto declara estricto.
 */

import type { Via } from './transporte.ts';

export const CORRECCION = {
  /** T1 — el disparador. Deíctico: sirve a los tres juegos sin bifurcarse. */
  disparador: 'Corregí esto',
  /** P1, P2 — el panel. */
  titulo: 'Corregí este ítem',
  instruccion:
    'Contanos qué está mal, qué falta o qué rótulo no corresponde. No hace falta que sepas cuál de las tres es.',
  /**
   * El selector de partes de la Redondopedia (`CTR-10` §2.1, `FIND-87`): un artículo tiene
   * muchos párrafos y datos, y la corrección tiene que decir de cuál habla. Registro 3.
   */
  etiquetaParte: 'Qué parte',
  /** C1, C2 — el campo. Es lo único que se le pide a la persona. */
  etiquetaCampo: 'Corrección',
  ejemplo: 'Por ejemplo: la fecha es otra, falta la fuente, esto es leyenda y no hecho.',
  /** B3 — cerrar sin mandar. */
  cerrar: 'Cerrá sin mandar',
  /** F3 — cerrar cuando no hubo ninguna vía. */
  cerrarSolo: 'Cerrá',
  /**
   * D1 — la línea de no-promesa.
   *
   * `CNT-12` decidió **escribirla**, y el fundamento es el mismo mecanismo que la
   * Redondopedia ya usa: declarar la duda en voz alta (`voz-ricotera.md` 3.3). No es un
   * descargo legal — es que el silencio protege lo que pasa **después** de tocar el
   * botón, no la expectativa que alguien trae de antes.
   */
  noPromesa: 'No hay manera de saber si esto se lee o se corrige.',
  /** F1, F2 — cuando no hay ninguna vía disponible. El molinete no se cierra (`D-14`). */
  sinVias: 'No hay mail ni portapapeles en este dispositivo.',
  sinViasComo: 'Copiá el texto de abajo y llevalo adonde quieras mandarlo.',
} as const;

/**
 * B1, B2 — la etiqueta de cada salida, **indexada por `via`**.
 *
 * `CTR-10` apartado 4: el componente nunca nombra un transporte, pide `disponibles()` y
 * busca acá. `via` es una clave, no texto de pantalla — por eso el día que entre Supabase
 * se agrega una fila y no se toca la pantalla.
 *
 * El de mail dice **que se abre el correo de uno**, y no es cortesía: `CTR-10` apartado 3
 * dejó anotado que el mensaje sale desde la casilla de esa persona, y que si el botón no
 * lo dice, se entera después — un rótulo que no dice la verdad sobre lo que hay adentro.
 */
export const SALIDA: Record<Via, string> = {
  mail: 'Mandá por mail',
  portapapeles: 'Copiá el texto',
  'a-la-vista': 'Mostrá el texto',
};

/**
 * K1, K2 — las confirmaciones, **estrictamente mecánicas**.
 *
 * `BR-21` apartado 2: *"puede confirmar únicamente el hecho mecánico —'se armó', 'se
 * copió', 'se abrió el mail'— nunca un estado de revisión que el sitio no tiene cómo
 * sostener."* Por eso el de mail dice **abrió**, no **mandó**: un `mailto:` no devuelve
 * nada y no hay forma de saber si la persona llegó a enviarlo.
 */
export const CONFIRMACION: Record<string, string> = {
  copiado: 'Se copió el texto.',
  abierto: 'Se abrió el mail, con el texto ya puesto.',
  'a-la-vista': CORRECCION.sinViasComo,
  'no-pudo': CORRECCION.sinVias,
};

/** El aviso de que el mensaje salió recortado. Un incompleto que no avisa, miente. */
export const RECORTADO = 'El mensaje salió recortado por largo.';
