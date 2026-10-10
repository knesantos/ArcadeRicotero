/**
 * La planta de la **lámina** de "Ponelos en fila" (`US-08`): la imagen que se lleva el
 * jugador cuando comparte una lista.
 *
 * ## Por qué es un módulo hermano de `plan.ts` y no una rama adentro
 *
 * `plan.ts` se declara "sin saber de qué juego es", y esa es su virtud: sirve a dos juegos
 * distintos porque los dos comparten **la misma maqueta** —un setlist de hasta seis filas
 * y un número grande abajo—. Esta pieza no comparte la maqueta: son bandas de altura
 * desigual y no hay número grande, porque no hay puntaje que poner (`BR-22`).
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
 * una fila puede tener una ficha y la de al lado cuarenta, y en partes iguales la de
 * cuarenta saldría apretada al lado de una banda casi vacía.
 *
 * Así que cada banda recibe **lo que pide más una parte proporcional del sobrante**, medido
 * por quien dibuja. Y ninguna baja de un renglón: una fila vacía sigue siendo una banda
 * visible, porque `LAMINA.vacia` dice "Nadie" y eso hay que poder leerlo. Una fila que
 * desaparece por estar vacía haría que la lámina mienta por omisión.
 *
 * ## Desde `D-69`: de dos a siete bandas, y una lámina que se estira
 *
 * Las filas las arma el jugador, así que las bandas son las que haya, no cuatro. Y con
 * "Todos los temas" una lámina puede tener que llevar ciento cinco títulos: en 1080 × 1350
 * no entran a un cuerpo que se lea. **Antes que cortar un tema, la lámina se estira**: primero
 * achica la letra hasta su piso (`elegirCuerpo`), y si ni así entra, crece de alto hasta
 * `ALTO_MAX`. Una imagen alta se comparte igual; una lista a la que le faltan temas es un
 * rótulo que miente sobre lo que hay adentro.
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

/** Los cuerpos de cada renglón, con su piso. Mismos criterios que los de `plan.ts`. */
export const CUERPOS_LAMINA = {
  marcaSitio: { base: 62, piso: 34 },
  tituloJuego: { base: 54, piso: 32 },
  conjunto: { base: 38, piso: 24 },
  rotuloFila: { base: 30, piso: 22 },
  ficha: { base: 34, piso: 22 },
  pie: { base: 22, piso: 16 },
} as const;

/** Cuántas bandas puede dibujar la lámina: las filas que puede tener un tablero (`D-69`). */
export const MIN_BANDAS = 2;
export const MAX_BANDAS = 7;

/**
 * El alto más grande al que se estira la lámina. Con los ciento cinco temas en una sola
 * fila —el peor caso de texto que existe— pide unos 1900 px al cuerpo más chico; esto deja
 * lugar y sigue siendo una imagen que un teléfono abre sin pensarlo.
 */
export const ALTO_MAX = 2700;

/** Lo que ocupa el rótulo de una banda, más el aire hasta la primera ficha. */
export const ROTULO_BANDA = Math.ceil(CUERPOS_LAMINA.rotuloFila.base * INTERLINEA) + 6;

/** El aire al pie de cada banda, donde va la raya que la cierra. */
export const PIE_BANDA = 12;

/**
 * El contenido mínimo de una banda: un renglón al cuerpo más chico. Es lo que ocupa
 * "Nadie" en una fila vacía, que se dice y no se esconde.
 */
export const MIN_CONTENIDO = Math.ceil(CUERPOS_LAMINA.ficha.piso * INTERLINEA);

/** Lo que la lámina necesita saber de una lista repartida. */
export interface DatosLamina {
  /** El nombre del juego, tal como lo escribe `copy.ts`. */
  readonly juego: string;
  /** El nombre del conjunto, tal como lo escribe `copy.ts`. */
  readonly conjunto: string;
  /**
   * Una banda por fila, en orden, con su rótulo y las fichas que le tocaron.
   *
   * `imagenes` viene solo en los conjuntos que se miran —las diez tapas— y entonces la
   * banda se dibuja con las tapas en vez de con los títulos. Una lista de tapas sin las
   * tapas es la mitad de lo que el jugador ordenó.
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

/** Dónde empieza y cuánto mide la franja que se reparten las bandas, en un lienzo de `alto`. */
export function bandaDeLasFilas(alto: number = LIENZO.alto): { readonly y: number; readonly alto: number } {
  const arriba =
    MARGEN +
    ALTOS.marca + AIRES.trasMarca +
    ALTOS.titulo + AIRES.trasTitulo +
    ALTOS.conjunto + AIRES.trasConjunto;
  const pie = ALTOS.credito + AIRES.trasCredito + ALTOS.sitio + MARGEN;
  return { y: arriba, alto: alto - pie - AIRES.trasBandas - arriba };
}

/** Lo que pide una banda entera —rótulo, contenido y pie— para un contenido de `pedido` px. */
function altoDeBanda(pedido: number): number {
  return ROTULO_BANDA + Math.max(MIN_CONTENIDO, Math.ceil(pedido)) + PIE_BANDA;
}

/** Lo que piden todas las bandas juntas. */
export function altoNecesario(pedidos: readonly number[]): number {
  return pedidos.reduce((suma, p) => suma + altoDeBanda(p), 0);
}

/** El alto del lienzo para esas bandas: el de siempre, o más, hasta `ALTO_MAX`. */
export function altoDeLienzo(pedidos: readonly number[]): number {
  const falta = altoNecesario(pedidos) - bandaDeLasFilas(LIENZO.alto).alto;
  return Math.min(ALTO_MAX, LIENZO.alto + Math.max(0, falta));
}

/**
 * El cuerpo de las fichas: el más grande con el que todas las bandas entran en la lámina
 * de siempre, o el piso si ni así.
 *
 * `pide` devuelve, para un cuerpo, cuánto contenido pide cada banda —lo mide quien dibuja,
 * porque medir necesita el canvas—. Se baja de a dos píxeles: es la misma escalera con la
 * que `cuerpoQueEntra` encoge una línea que no entra de ancho.
 */
export function elegirCuerpo(pide: (cuerpo: number) => readonly number[]): number {
  const { base, piso } = CUERPOS_LAMINA.ficha;
  const franja = bandaDeLasFilas(LIENZO.alto).alto;
  for (let cuerpo: number = base; cuerpo >= piso; cuerpo -= 2) {
    if (altoNecesario(pide(cuerpo)) <= franja) return cuerpo;
  }
  return piso;
}

/** Una lámina ya planificada: cuánto mide y dónde va cada bloque. */
export interface PlanLamina {
  readonly alto: number;
  readonly bloques: readonly Bloque[];
}

/**
 * Ubica cada bloque de la lámina y devuelve la lista en orden de dibujo, con el alto del
 * lienzo.
 *
 * `pedidos` es cuánto contenido pide cada banda, en píxeles, medido por quien dibuja. Cada
 * banda recibe lo suyo y el sobrante se reparte en proporción; si no entra ni estirando
 * hasta `ALTO_MAX`, se reparte en proporción lo que hay.
 */
export function planificarLamina(pedidos: readonly number[]): PlanLamina {
  if (pedidos.length < MIN_BANDAS || pedidos.length > MAX_BANDAS) {
    throw new LaminaImposible(
      `la lámina dibuja de ${MIN_BANDAS} a ${MAX_BANDAS} bandas y le pasaron ${pedidos.length}`,
    );
  }
  for (const p of pedidos) {
    if (!Number.isFinite(p) || p < 0) {
      throw new LaminaImposible(`una banda no puede pedir ${p} px`);
    }
  }

  const alto = altoDeLienzo(pedidos);
  const franja = bandaDeLasFilas(alto);
  const necesarios = pedidos.map(altoDeBanda);
  const necesario = necesarios.reduce((a, b) => a + b, 0);

  const bloques: Bloque[] = [];
  let y = MARGEN;
  const poner = (clave: string, altoBloque: number, aire = 0): void => {
    bloques.push({ clave, y, alto: altoBloque });
    y += altoBloque + aire;
  };

  poner('marca', ALTOS.marca, AIRES.trasMarca);
  poner('titulo', ALTOS.titulo, AIRES.trasTitulo);
  poner('conjunto', ALTOS.conjunto, AIRES.trasConjunto);

  // Si entra, cada banda recibe lo que pide más su parte del sobrante. Si no, su parte de lo
  // que hay. La última se come el resto de la división para que la suma sea EXACTAMENTE la
  // franja y no quede un píxel bailando — el mismo truco de `plan.ts`.
  const entra = necesario <= franja.alto;
  const sobrante = franja.alto - necesario;
  let repartido = 0;
  necesarios.forEach((n, i) => {
    const ultima = i === necesarios.length - 1;
    const propio = entra
      ? n + Math.floor((sobrante * n) / necesario)
      : Math.floor((franja.alto * n) / necesario);
    const altoBanda = ultima ? franja.alto - repartido : propio;
    repartido += altoBanda;
    poner(`banda-${i}`, altoBanda);
  });

  y = alto - MARGEN - ALTOS.sitio - ALTOS.credito - AIRES.trasCredito;
  poner('credito', ALTOS.credito, AIRES.trasCredito);
  poner('sitio', ALTOS.sitio);

  return { alto, bloques };
}

/** El contenido que le queda a una banda de ese alto, sacando el rótulo y el pie. */
export function contenidoDeBanda(altoBanda: number): number {
  return altoBanda - ROTULO_BANDA - PIE_BANDA;
}

/** Cuántos renglones de fichas entran en ese contenido, a ese cuerpo. */
export function renglonesQueEntran(contenido: number, cuerpo: number): number {
  return Math.max(1, Math.floor(contenido / (cuerpo * INTERLINEA)));
}

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
 * Lo que pide de contenido una banda de `cuantas` tapas, a tamaño completo.
 *
 * Es una conversión, no una estimación: el alto de las filas de tapas que entran de ancho.
 * Con siete bandas y diez tapas en una sola, la lámina se estira en vez de achicarlas.
 */
export function pedidoDeTapas(cuantas: number, ancho: number): number {
  if (cuantas <= 0) return 0;
  const filas = Math.ceil(cuantas / tapasPorRenglon(ancho));
  return filas * (TAPA_LAMINA.lado + TAPA_LAMINA.aire) - TAPA_LAMINA.aire;
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
