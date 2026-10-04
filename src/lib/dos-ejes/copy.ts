/**
 * El texto de "¿Qué tipo de ricotero sos?" (`US-06`), la noche del ciclo 18 (`D-57`).
 *
 * **Lo que NO está acá, y es la mitad del juego:** los enunciados, las opciones, los cinco
 * momentos de la noche y las cuatro maneras. Todo eso lo escribió `contenido` en `CNT-30` y
 * vive en `src/data/dos-ejes.json`, porque es contenido y no cáscara. Acá está lo que rodea a
 * la partida: lo pasó el hilo principal de la tabla de cadenas de `CNT-30` y del contraste de
 * `CNT-29`.
 *
 * **Las audita `voz.test.ts`** junto con las cadenas del banco.
 */

/** Los números que el sitio escribe en letras. Hasta diez alcanza: la noche tiene cinco momentos. */
const LETRAS = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];

/**
 * Un número en letras, y si no está en la lista, en cifras.
 *
 * Existe para que la cantidad de preguntas **salga del dato** y no de un "Diez" escrito a mano
 * en tres lados (lo marcó el relevamiento del ciclo 18): si mañana cambia `preguntasPorEje`,
 * el texto cambia solo.
 */
export function enLetras(n: number): string {
  return LETRAS[n] ?? String(n);
}

export const PANTALLA_0 = {
  /** Registro 1: segunda persona, ocho palabras o menos. Es la puerta de `D-51` y no se toca. */
  titulo: '¿Qué tipo de ricotero sos?',
  /**
   * Registro 3, y también la `og:description`. Dice el mecanismo y lo que no se pide: es el
   * molinete más abierto del sitio y conviene decirlo, no solo que sea cierto (`UX-06` §2).
   */
  subtitulo: (momentos: number, preguntas: number) =>
    `Una noche de recital en ${enLetras(momentos)} momentos, ${enLetras(preguntas)} preguntas de cómo sos. No hace falta saber nada ni haber ido.`,
  /** El rótulo de la etiqueta de papel pegada en la tapa del libro: el índice de la noche. */
  indiceRotulo: 'Adentro del libro',
  /** Voseo (`D-17`). Le dice a quien llega que esto es una noche, no una ronda con puntaje. */
  boton: 'Empezá la noche',
  /**
   * Lo que lee el que llega por el enlace de un amigo sin pasar por la postal (`ADR-02`,
   * forma `identidad`). Dice qué le salió al otro **y qué quiere decir**, y nada que suene a
   * superarlo (`BR-17`).
   */
  desafio: (nombre: string, linea: string) => `A alguien le salió «${nombre}»: ${linea} ¿Y a vos?`,
} as const;

/**
 * Los cuatro polos en palabras de la gente (`CNT-30`). Son la línea que nombra del resultado:
 * hasta el ciclo 18 las puntas decían "Luz", "Oscuridad", "Orden" y "Caos" y nadie las
 * traducía, y "Oscuridad" se leía triste. El eje es del usuario y no se toca; lo que se
 * agrega es qué quiere decir.
 */
export const POLOS = {
  luz: 'Con la gente',
  oscuridad: 'Por tu cuenta',
  orden: 'con plan',
  caos: 'sobre la marcha',
} as const;

/** Los rótulos de los polos, tal como los eligió el usuario (`BR-17`). Registro 3. */
export const EJES = {
  luz: 'Luz',
  oscuridad: 'Oscuridad',
  orden: 'Orden',
  caos: 'Caos',
} as const;

type LO = 'luz' | 'oscuridad';
type OC = 'orden' | 'caos';

/** La línea que nombra: "Con la gente, con plan." Seca, igual de forma para las cuatro. */
export function lineaQueNombra(lo: LO, oc: OC): string {
  return `${POLOS[lo]}, ${POLOS[oc]}.`;
}

/** El sello de los dos polos: "LUZ · ORDEN". */
export function selloDePolos(lo: LO, oc: OC): string {
  return `${EJES[lo]} · ${EJES[oc]}`;
}

export const PARTIDA = {
  /** El folio de la hoja. Orientación, no medición: no hay acierto que contar. */
  folio: (n: number, total: number) => `${n} de ${total}`,
  anterior: 'Volvé a la anterior',
  /** Solo con mouse (`D-53` y `D-55`): en el teléfono no hay teclas que nombrar. */
  teclas: 'Teclas 1 y 2 para elegir. Retroceso vuelve.',
  /** Para el lector de pantalla: el sello del momento y el folio, en una frase. */
  anuncio: (momento: string, n: number, total: number) => `${momento}. Pregunta ${n} de ${total}.`,
} as const;

export const RESULTADO = {
  /** Registro 3. "Esta noche", y no "Diste con esto": otra noche puede dar otra manera (`BR-37`). */
  rotulo: 'Esta noche te salió',
  /** La línea chica arriba de la hoja, para que la captura salga con nombre y apellido. */
  marca: 'Arcade Ricotero · ¿Qué tipo de ricotero sos?',
  compartir: 'Compartí',
  denuevo: 'Empezá otra noche',
  bajar: 'Bajá la tarjeta',
  volver: 'Volvé al arcade',
  /** El título de la grilla de las cuatro maneras. */
  lasCuatro: 'Las cuatro maneras',
  /** La línea que canta debajo: la paridad dicha con una imagen, sin sermón. */
  lasCuatroCanta: 'Cuatro sillas alrededor de la misma mesa.',
  /** El sello de la tuya en la grilla. */
  tuya: 'Esta noche',
  /** El sello de la de quien te mandó el enlace. */
  suya: 'Quien te lo mandó',
  /** El rótulo de la grilla para el lector de pantalla. */
  altGrilla: 'Las cuatro maneras, con la tuya primero.',
  /** El texto que viaja con el enlace: nombra el test, la identidad, ningún número (`BR-17`). */
  paraCompartir: (nombre: string) => `Me salió «${nombre}». ¿Qué tipo de ricotero sos vos?`,
  copiado: 'Se copió el enlace.',
  aManoTitulo: 'Copiá esto y mandalo',
} as const;

/**
 * El contraste al volver (`CNT-29`): misma forma en los cuatro casos, sin ganar ni perder, y
 * sin género ("quien te lo mandó").
 */
export const CONTRASTE = {
  misma: (suyo: string) => `A quien te lo mandó también le salió «${suyo}».`,
  'luz-oscuridad': (suyo: string) => `A quien te lo mandó le salió «${suyo}»: comparten la primera mitad.`,
  'orden-caos': (suyo: string) => `A quien te lo mandó le salió «${suyo}»: comparten la segunda mitad.`,
  opuesta: (suyo: string) => `A quien te lo mandó le salió «${suyo}»: la que queda enfrente.`,
} as const;

/** La postal de cada manera, `/juegos/dos-ejes/cu-n/` (`ADR-02` enmendado). */
export const POSTAL = {
  ogTitulo: (nombre: string) => `Me salió «${nombre}»`,
  ogDescripcion: (linea: string) => `${linea} ¿Qué tipo de ricotero sos vos? Una noche de recital, sin saber nada.`,
  rotulo: 'A quien te lo mandó le salió',
  boton: 'Empezá tu noche',
} as const;

/** Lo que dice la tarjeta de imagen que se comparte. La dibuja el taller, no la isla. */
export const TARJETA = {
  meSalio: 'Me salió',
  pregunta: '¿Y a vos cuál te sale?',
  /** Registro 3. Sin día ni mes: la fecha de salida de *Luzbelito* está en duda (`RES-167`). */
  credito: 'Lomo, mármol y esquinero: tapa de Luzbelito (Rocambole, 1996), en baja.',
  /** El texto alternativo de la vista previa de una postal. Lleva el crédito (`D-21`). */
  alt: (nombre: string, linea: string) =>
    `Tarjeta de Arcade Ricotero: me salió «${nombre}». ${linea} Lomo, mármol y esquinero de la tapa de Luzbelito (Rocambole), en baja.`,
  /** El de la vista previa de la portada del juego. */
  altJuego: 'Tarjeta de Arcade Ricotero: ¿Qué tipo de ricotero sos?, con las cuatro maneras. Lomo, mármol y esquinero de la tapa de Luzbelito (Rocambole), en baja.',
} as const;
