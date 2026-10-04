/**
 * La planta de la **lámina** de "Ponelos en fila" (`US-08`): la imagen que se lleva el
 * jugador cuando comparte una lista.
 *
 * ## Por qué es un módulo hermano de `plan.ts` y no una rama adentro
 *
 * `plan.ts` se declara "sin saber de qué juego es", y esa es su virtud: sirve a dos juegos
 * distintos porque los dos comparten **la misma maqueta** —un setlist de hasta seis filas
 * y un número grande abajo—. Esta pieza no comparte la maqueta: son cuatro bandas de
 * altura desigual y no hay número grande, porque no hay puntaje que poner (`BR-22`).
 *
 * Meterla allá adentro habría sido un `if` por juego en un módulo cuyo encabezado dice que
 * no tiene ninguno, y de paso habría que relajar `MAX_FILAS = 6` y `planificar()`, que
 * **tira `RangeError` con más filas de las que sabe dibujar**. Ese `RangeError` es una
 * guarda buena: lo que hay que hacer es no pisarla.
 *
 * Lo que sí se comparte —el lienzo, el margen, la franja, cómo se encoge un texto que no
 * entra, cómo se parte en renglones— se importa de allá. Duplicar esos números sería tener
 * dos tarjetas del mismo sitio con dos anchos de margen.
 *
 * ## Este archivo no dibuja: reparte alto
 *
 * Mismo reparto que `plan.ts`, y por el mismo motivo escrito allá: un canvas no existe en
 * Node, así que todo lo que viva del lado del dibujo es código que ningún test puede
 * mirar. De este lado queda lo único que se rompe de verdad —que una banda se caiga de la
 * lámina, o que dos se pisen— y eso sí se prueba.
 *
 * ## Las bandas no se reparten en partes iguales, y ahí está toda la gracia
 *
 * `plan.ts` reparte su banda en partes iguales porque sus filas son todas de un tema. Acá
 * una fila puede tener una ficha y la de al lado nueve, y en partes iguales la de nueve
 * saldría apretada al lado de una banda casi vacía.
 *
 * Así que cada banda recibe **un piso fijo más una parte proporcional a cuántos renglones
 * necesita**, medidos por quien dibuja. El piso existe para que una fila vacía siga siendo
 * una banda visible: `LAMINA.vacia` dice "Nadie" y eso hay que poder leerlo. Una fila que
 * desaparece por estar vacía haría que la lámina mienta por omisión — parecería que el
 * conjunto se repartió en tres lugares.
 */

import { LIENZO, MARGEN, ANCHO_UTIL, FRANJA, INTERLINEA, cuerpoQueEntra, partirEnLineas } from '../tarjeta/plan.ts';

export { LIENZO, MARGEN, ANCHO_UTIL, FRANJA, INTERLINEA, cuerpoQueEntra, partirEnLineas };

/** Un bloque ya ubicado. `y` es el borde de arriba. Misma forma que en `plan.ts`. */
export interface Bloque {
  readonly clave: string;
  readonly y: number;
  readonly alto: number;
}

/** El alto fijo de las piezas que no se reparten nada. */
export const ALTOS = {
  marca: 72,
  titulo: 66,
  conjunto: 44,
  /** Dos renglones chicos: el crédito de `D-21` no entra en uno. */
  credito: 56,
  sitio: 38,
} as const;

/** El aire entre piezas. */
export const AIRES = {
  trasMarca: 18,
  trasTitulo: 14,
  trasConjunto: 40,
  trasBandas: 40,
  trasCredito: 8,
} as const;

/**
 * El piso de una banda: lo que ocupa el rótulo de la fila más un renglón de contenido.
 *
 * Con cuatro filas son 400 px de los 786 de banda, así que siempre queda más de la mitad
 * para repartir. Si algún día las filas fueran seis, esta cuenta hay que rehacerla — y el
 * test de abajo la rehace sola.
 */
export const MIN_BANDA = 100;

/** Cuántas bandas dibuja esta lámina. Es `FILAS.length`, dicho donde el plan lo necesita. */
export const BANDAS = 4;

/** Lo que la lámina necesita saber de una lista repartida. */
export interface DatosLamina {
  /** El nombre del juego, tal como lo escribe `copy.ts`. */
  readonly juego: string;
  /** El nombre del conjunto, tal como lo escribe `copy.ts`. */
  readonly conjunto: string;
  /**
   * Una banda por fila, en orden, con su rótulo y las fichas que le tocaron.
   *
   * `imagenes` viene solo en los conjuntos que se miran —los diez discos, las diez tapas—
   * y entonces la banda se dibuja con las tapas en vez de con los títulos. Una lista de
   * discos sin las tapas es la mitad de lo que el jugador ordenó.
   */
  readonly bandas: readonly {
    readonly nombre: string;
    readonly fichas: readonly string[];
    readonly imagenes?: readonly string[];
  }[];
  /** Cuántas se repartieron de cuántas. Registro 3, ya formateado por el juego. */
  readonly repartidas: string;
  /** El crédito de `D-21`, impreso adentro de la pieza porque la pieza sale del sitio. */
  readonly credito: string;
  /** Dónde se juega. Es la única forma de volver que tiene una imagen suelta. */
  readonly sitio: string;
}

export class LaminaImposible extends Error {}

/** Dónde empieza y cuánto mide la franja que se reparten las cuatro bandas. */
export function bandaDeLasFilas(): { readonly y: number; readonly alto: number } {
  const arriba =
    MARGEN +
    ALTOS.marca + AIRES.trasMarca +
    ALTOS.titulo + AIRES.trasTitulo +
    ALTOS.conjunto + AIRES.trasConjunto;
  const pie = ALTOS.credito + AIRES.trasCredito + ALTOS.sitio + MARGEN;
  return { y: arriba, alto: LIENZO.alto - pie - AIRES.trasBandas - arriba };
}

/**
 * Ubica cada bloque de la lámina y devuelve la lista en orden de dibujo.
 *
 * `renglones` es cuántas líneas de texto necesita cada banda, medidas por quien dibuja.
 * Se le pide al que mide porque medir necesita el canvas, y el canvas no existe acá.
 */
export function planificarLamina(renglones: readonly number[]): readonly Bloque[] {
  if (renglones.length !== BANDAS) {
    throw new LaminaImposible(`la lámina dibuja ${BANDAS} bandas y le pasaron ${renglones.length}`);
  }
  for (const r of renglones) {
    if (!Number.isInteger(r) || r < 1) {
      throw new LaminaImposible(`una banda no puede necesitar ${r} renglones`);
    }
  }

  const franja = bandaDeLasFilas();
  if (franja.alto < MIN_BANDA * BANDAS) {
    throw new LaminaImposible(
      `las ${BANDAS} bandas piden ${MIN_BANDA * BANDAS} px y la lámina tiene ${franja.alto}`,
    );
  }

  const bloques: Bloque[] = [];
  let y = MARGEN;
  const poner = (clave: string, alto: number, aire = 0): void => {
    bloques.push({ clave, y, alto });
    y += alto + aire;
  };

  poner('marca', ALTOS.marca, AIRES.trasMarca);
  poner('titulo', ALTOS.titulo, AIRES.trasTitulo);
  poner('conjunto', ALTOS.conjunto, AIRES.trasConjunto);

  // El sobrante se reparte proporcional a los renglones. La última banda se come el resto
  // de la division para que la suma sea EXACTAMENTE la franja y no quede un pixel bailando
  // — el mismo truco de `plan.ts`, y por el mismo motivo.
  const sobrante = franja.alto - MIN_BANDA * BANDAS;
  const total = renglones.reduce((a, b) => a + b, 0);
  let repartido = 0;
  renglones.forEach((r, i) => {
    const ultima = i === BANDAS - 1;
    const extra = ultima ? sobrante - repartido : Math.floor((sobrante * r) / total);
    repartido += extra;
    poner(`banda-${i}`, MIN_BANDA + extra);
  });

  y = LIENZO.alto - MARGEN - ALTOS.sitio - ALTOS.credito - AIRES.trasCredito;
  poner('credito', ALTOS.credito, AIRES.trasCredito);
  poner('sitio', ALTOS.sitio);

  return bloques;
}

/** Los cuerpos de cada renglón, con su piso. Mismos criterios que los de `plan.ts`. */
export const CUERPOS_LAMINA = {
  marcaSitio: { base: 62, piso: 34 },
  tituloJuego: { base: 54, piso: 32 },
  conjunto: { base: 38, piso: 24 },
  rotuloFila: { base: 30, piso: 22 },
  ficha: { base: 34, piso: 22 },
  pie: { base: 22, piso: 16 },
} as const;

/**
 * El lado de una tapa en la lámina —el más grande que se dibuja— y el aire entre dos.
 *
 * `min` existe porque una banda puede tener que meter diez tapas en el alto que le tocó, y
 * a partir de cierto tamaño una tapa deja de reconocerse. Si ni al mínimo entran, la banda
 * dibuja las que puede: es preferible una fila incompleta a una lámina con las tapas
 * pisando la banda de abajo.
 */
export const TAPA_LAMINA = { lado: 168, min: 84, aire: 14 } as const;

/** Cuántas tapas de `lado` entran de ancho. */
export function tapasPorRenglon(ancho: number, lado: number = TAPA_LAMINA.lado): number {
  return Math.max(1, Math.floor((ancho + TAPA_LAMINA.aire) / (lado + TAPA_LAMINA.aire)));
}

/**
 * El lado más grande con el que `cuantas` tapas entran en una caja de `ancho` por `alto`.
 *
 * **Existe para que la lámina no pueda desbordar por abajo.** El reparto de alto de
 * `planificarLamina` es proporcional, así que una banda con diez tapas puede recibir menos
 * alto del que esas diez piden a tamaño completo. Sin esta cuenta, las tapas se dibujarían
 * igual y se meterían adentro de la banda siguiente — sin error, sin aviso, y la imagen se
 * comparte lo mismo. Es exactamente el defecto que `plan.ts` ya tuvo una vez con el
 * setlist, y por eso esto vive de este lado, donde un test lo puede mirar.
 */
export function ladoDeTapa(cuantas: number, ancho: number, alto: number): number {
  for (let lado = TAPA_LAMINA.lado; lado >= TAPA_LAMINA.min; lado -= 4) {
    const filas = Math.ceil(cuantas / tapasPorRenglon(ancho, lado));
    if (filas * (lado + TAPA_LAMINA.aire) - TAPA_LAMINA.aire <= alto) return lado;
  }
  return TAPA_LAMINA.min;
}

/**
 * Cuántos renglones de texto **equivale** una banda de tapas.
 *
 * El reparto de alto de `planificarLamina` cuenta en renglones de texto, así que una banda
 * de tapas tiene que traducirse a esa misma unidad o pediría de menos y saldría con las
 * tapas cortadas. Es una conversión, no una estimación: alto de las tapas dividido el alto
 * de un renglón.
 */
export function renglonesDeTapas(cuantas: number, ancho: number, cuerpo: number): number {
  const filas = Math.ceil(cuantas / tapasPorRenglon(ancho));
  return Math.max(1, Math.ceil((filas * (TAPA_LAMINA.lado + TAPA_LAMINA.aire)) / (cuerpo * INTERLINEA)));
}

/** Cuántos renglones de fichas entran en una banda de ese alto, al cuerpo de referencia. */
export function renglonesQueEntran(alto: number, cuerpo: number): number {
  const paraFichas = alto - CUERPOS_LAMINA.rotuloFila.base * INTERLINEA - 12;
  return Math.max(1, Math.floor(paraFichas / (cuerpo * INTERLINEA)));
}

/** El nombre del archivo que se baja. Sin espacios ni acentos: viaja por todos lados. */
export function nombreArchivoLamina(conjunto: string): string {
  const limpio = conjunto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return `fichin-ricotero-ponelos-en-fila-${limpio || 'lista'}.png`;
}
