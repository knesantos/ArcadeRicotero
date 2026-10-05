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
    `Una noche de recital en ${enLetras(momentos)} momentos y ${enLetras(preguntas)} preguntas de cómo la pasás. No hace falta saber nada ni haber ido.`,
  /**
   * El rótulo de la etiqueta de papel pegada en la tapa del libro: el índice de la noche.
   * "Adentro del libro" chocaba con el sello del cuarto momento (hoy `Cuando suena`), que lista
   * (`CNT-30` §6.2).
   */
  indiceRotulo: 'Las hojas de la noche',
  /** Voseo (`D-17`). Le dice a quien llega que esto es una noche, no una ronda con puntaje. */
  boton: 'Empezá la noche',
  /**
   * Registro 3, seco: lo que dice la portada si el motor no puede armar la noche (una celda
   * del banco vacía, que `banco.test.ts` no deja pasar). Sin esta línea, "Empezá" no haría
   * nada, que es un molinete (`UX-36` §4.8). **Propuesta del hilo principal: la confirma
   * `contenido`.**
   *
   * La línea del enlace viejo que vivía acá (`desafio`) se fue en el ciclo 18: el que llega
   * por un `?g=dos-ejes&r=CU-n` ve la misma etiqueta del amigo que la postal (`UX-36` §3.3).
   */
  sinNoche: 'Esta noche no se pudo armar. Volvé a cargar la página.',
} as const;

/**
 * Los cuatro polos en palabras de la gente (`CNT-30` §6.1). Son la línea que nombra del
 * resultado: hasta el ciclo 18 las puntas decían "Luz", "Oscuridad", "Orden" y "Caos" y nadie
 * las traducía, y "Oscuridad" se leía triste. El eje es del usuario y no se toca; lo que se
 * agrega es qué quiere decir.
 *
 * **Sin persona, como los nombres.** `D-57` decía "Por tu cuenta", y se rompía justo donde la
 * línea viaja: en la tarjeta ("Me salió…: por tu cuenta") y en el desafío ("A alguien le
 * salió…: por tu cuenta", que se lee como un reproche). La primera vuelta de `CNT-30` lo
 * cambió por "por cuenta propia", y la lectura adversarial encontró ahí al cuentapropista:
 * una palabra de trámite al lado de "con la gente", que es como el sitio nombra a quien
 * juega. Queda **"con lo propio"**: misma forma que su par, sin persona y sin trámite
 * (`CNT-30` §6.1, `D-57` enmendada). Se guardan en minúscula: la mayúscula la pone
 * `lineaQueNombra`.
 */
export const POLOS = {
  luz: 'con la gente',
  oscuridad: 'con lo propio',
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

/** Los dos polos en una frase, para adentro de otra oración: "con la gente, con plan". */
export function polosEnFrase(lo: LO, oc: OC): string {
  return `${POLOS[lo]}, ${POLOS[oc]}`;
}

/** La línea que nombra, sola debajo del nombre: "Con la gente, con plan." */
export function lineaQueNombra(lo: LO, oc: OC): string {
  const frase = polosEnFrase(lo, oc);
  return `${frase.charAt(0).toUpperCase()}${frase.slice(1)}.`;
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
  /**
   * La marca chica arriba de la hoja, para que la captura salga con nombre y apellido. Va en
   * dos renglones (`UX-36` §5.1): esta, en la calcada de la tapa de *Oktubre* —que solo tiene
   * mayúsculas, y de tildes solo la Í que se le derivó para FICHÍN (`D-60`)—, y debajo el
   * título del juego (`PANTALLA_0.titulo`). La misma cadena encabeza la tarjeta y la vista
   * previa.
   */
  marca: 'Fichín Ricotero',
  compartir: 'Compartí',
  denuevo: 'Empezá otra noche',
  bajar: 'Bajá la tarjeta',
  volver: 'Volvé al fichín',
  /** El título de la grilla de las cuatro maneras. */
  lasCuatro: 'Las cuatro maneras',
  /**
   * La línea que canta debajo: la paridad dicha con una imagen, sin sermón (`CNT-30`). Una
   * mesa le daba el único objeto de la grilla a «Mesa larga a las nueve», y la ponía a las
   * cuatro "con la gente"; la puerta de un recital es donde se pide la entrada, y "esquinas"
   * apuntaba a «Ronda en cualquier esquina». Las cuatro puntas de una hoja son iguales, y la
   * hoja es la del libro.
   */
  lasCuatroCanta: 'Cuatro puntas de la misma hoja.',
  /** El sello de la tuya en la grilla. */
  tuya: 'Esta noche',
  /** El sello de la de quien te mandó el enlace. */
  suya: 'Quien te lo mandó',
  /** El rótulo de la grilla para el lector de pantalla. */
  altGrilla: 'Las cuatro maneras, con la tuya primero.',
  /**
   * Lo que el plano de dos ejes le dice al lector de pantalla (`UX-38`, crítica 3): los dos
   * ejes y dónde cae la tuya, que la grilla no dice en palabras. Registro 3, seco. La propuso
   * el hilo principal; `contenido` la confirma o la cambia (`T-352`).
   */
  altPlano: (p: {
    readonly arriba: string;
    readonly abajo: string;
    readonly izquierda: string;
    readonly derecha: string;
    readonly tuya: { readonly nombre: string; readonly lugar: string };
    readonly suya?: { readonly nombre: string; readonly lugar: string } | 'misma';
  }) =>
    `Dos ejes en cruz. Arriba, ${p.arriba}; abajo, ${p.abajo}; a la izquierda, ${p.izquierda}; a la derecha, ${p.derecha}. ` +
    `La tuya, ${p.tuya.lugar}: ${p.tuya.nombre}.` +
    (p.suya === 'misma'
      ? ' La de quien te lo mandó es la misma.'
      : p.suya
        ? ` La de quien te lo mandó, ${p.suya.lugar}: ${p.suya.nombre}.`
        : ''),
  /** Los cuatro lugares del plano, en el orden de `planoFijo().celdas`. */
  lugares: ['arriba a la izquierda', 'arriba a la derecha', 'abajo a la izquierda', 'abajo a la derecha'],
  /** El texto que viaja con el enlace: nombra el test, la identidad, ningún número (`BR-17`). */
  paraCompartir: (nombre: string) => `Me salió «${nombre}». ¿Qué tipo de ricotero sos vos?`,
  copiado: 'Se copió el enlace.',
  aManoTitulo: 'Copiá esto y mandalo',
} as const;

/**
 * El contraste al volver (`CNT-29` §3, versión 2): el mismo molde en los cuatro casos —la
 * primera oración idéntica, la segunda con "comparte:" o "no comparte:"—, sin ganar ni perder
 * y sin género ("quien te lo mandó"). `lo` y `oc` son los polos de **tu** manera, en frase
 * (`POLOS`). Sin comillas en los polos: se leían como nombres, y la versión 1 juntaba tres
 * "con" seguidos ("comparte «con la gente»").
 */
export const CONTRASTE = {
  misma: (suyo: string, lo: string, oc: string) => `A quien te lo mandó le salió «${suyo}». Con la tuya comparte: ${lo}, ${oc}.`,
  'luz-oscuridad': (suyo: string, lo: string) => `A quien te lo mandó le salió «${suyo}». Con la tuya comparte: ${lo}.`,
  'orden-caos': (suyo: string, _lo: string, oc: string) => `A quien te lo mandó le salió «${suyo}». Con la tuya comparte: ${oc}.`,
  opuesta: (suyo: string, lo: string, oc: string) =>
    `A quien te lo mandó le salió «${suyo}». Con la tuya no comparte: ${lo} ni ${oc}.`,
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
  /**
   * Registro 3. Sin día ni mes: la fecha de salida de *Luzbelito* está en duda (`RES-167`).
   * Sin "en baja": es jerga de imprenta (baja resolución, `D-21`), y un rótulo dice qué hay
   * adentro con palabras de todos (lectura final de la vuelta 4 de `CNT-30`).
   */
  credito: 'Lomo, mármol y esquinero de la tapa de Luzbelito (Rocambole, 1996).',
  /** El texto alternativo de la vista previa de una postal. Lleva el crédito (`D-21`). */
  alt: (nombre: string, linea: string) =>
    `Tarjeta de Fichín Ricotero: me salió «${nombre}». ${linea} Lomo, mármol y esquinero de la tapa de Luzbelito (Rocambole).`,
  /** El de la vista previa de la portada del juego. */
  altJuego: 'Tarjeta de Fichín Ricotero: ¿Qué tipo de ricotero sos?, con las cuatro maneras. Lomo, mármol y esquinero de la tapa de Luzbelito (Rocambole).',
} as const;
