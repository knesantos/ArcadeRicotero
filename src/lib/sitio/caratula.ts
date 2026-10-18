/**
 * La carátula del casete (`D-54`, `UX-35`): lo que cada juego muestra de sí mismo al costado
 * de la hoja en una pantalla ancha, y en la esquina de la cabecera en el teléfono.
 *
 * Es el casete que la persona tocó en el portal, ahora en la mano: **la misma pieza de tapa,
 * el mismo número de pista, el mismo disco**. Por eso no tiene datos propios — todo sale de
 * `JUEGOS` de `copy.ts`, que es lo mismo que lee el portal. Si mañana un casete cambia de
 * pieza o de lugar en el lado A, la carátula de su juego cambia sola, y no hay forma de que
 * el portal diga A3 y la página diga A4.
 *
 * Se resuelve en build (lee el archivo de la pieza para medirla, como el portal) y llega al
 * componente ya armada: `Caratula.astro` no decide nada.
 */
import { JUEGOS, LADO_B, type Casete } from './copy.ts';
import { arteDeCasete, discoDeRecorte, materialDeCasete, medidas, type MaterialDeCasete } from './arte.ts';

/**
 * La primera oración de una bajada: la que canta (`voz-ricotera.md` §5).
 *
 * Vivía en `index.astro` y se mudó acá cuando la carátula necesitó la misma regla. **Se corta
 * en el punto que el autor ya puso, no con `line-clamp`**: un recorte por altura mete puntos
 * suspensivos, y el suspensivo en este sitio es del Indio y de la Redondopedia (§3.7), no de
 * un casete.
 */
export function primeraOracion(texto: string): string {
  const corte = texto.indexOf('. ');
  return corte === -1 ? texto : texto.slice(0, corte + 1);
}

/**
 * Lo que queda de la bajada después de la primera oración, o `''` si era una sola.
 *
 * Es lo que el escritorio suma en el casete del portal (`UX-35` §2): en un teléfono la
 * casetera no tiene alto para la bajada entera (`UX-25` §2.4) y en un monitor sobra. Las dos
 * mitades juntas son, letra por letra, la cadena de `copy.ts` que audita `voz.test.ts`.
 */
export function restoDeLaBajada(texto: string): string {
  return texto.slice(primeraOracion(texto).length).trim();
}

/**
 * El número de pista de un casete: "A1", "B2". **Una sola cuenta para el portal y la carátula**
 * (`REV-18`, `FIND-107`): se calculaba en los dos lados, y que coincidieran dependía de que
 * nadie cambiara una de las dos. La posición es la del casete en su lado, contando todos.
 */
export function pistaDe(lado: 'A' | 'B', indice: number): string {
  return `${lado}${indice + 1}`;
}

/** Un renglón de la lista de temas de la carátula. */
export interface PistaDeLaLista {
  /** "A1", "B2": el número escrito a mano en la tapita, igual que en el portal. */
  readonly numero: string;
  readonly titulo: string;
  readonly href: string;
  /** El juego de esta página. Se marca con `aria-current`, borde y letra plena: nunca solo color. */
  readonly actual: boolean;
}

export interface Caratula {
  readonly casete: Casete;
  /** Lado y número, separados, porque la cabecera del teléfono usa solo el número. */
  readonly lado: 'A';
  readonly numero: number;
  readonly pista: string;
  readonly arte: string;
  readonly material: MaterialDeCasete;
  readonly medida: { ancho: number; alto: number } | null;
  /** El mismo criterio del portal: una pieza mucho más ancha que alta se pega entera. */
  readonly apaisada: boolean;
  /**
   * De qué disco es la pieza, para el crédito del pie (`D-21`, condición 1: la pantalla
   * nombra lo que usa). `null` si la pieza no es de ningún disco.
   */
  readonly disco: string | null;
  readonly ladoA: readonly PistaDeLaLista[];
  readonly ladoB: readonly PistaDeLaLista[];
}

// El número sale de la posición en el lado **antes** de filtrar: un casete sin enlace no corre
// la numeración de los de abajo, igual que en el portal, donde se ve aunque no tenga enlace.
const renglones = (lado: 'A' | 'B', casetes: readonly Casete[], actual: string): PistaDeLaLista[] =>
  casetes
    .map((c, i) => ({ c, numero: pistaDe(lado, i) }))
    .filter((r): r is { c: Casete & { href: string }; numero: string } => typeof r.c.href === 'string')
    .map(({ c, numero }) => ({ numero, titulo: c.titulo, href: c.href, actual: c.href === actual }));

/**
 * La carátula del juego que vive en `href`. Tira si el `href` no es de ningún casete del lado
 * A: una página de juego que no está en el portal es un juego que nadie puede encontrar, y eso
 * es justo lo que `D-51` vino a cerrar. Mejor que lo diga el build que la gente.
 */
export function caratulaDe(href: string): Caratula {
  const i = JUEGOS.findIndex((c) => c.href === href);
  if (i === -1) throw new Error(`La carátula de ${href}: ese juego no está en el lado A del portal`);
  const casete = JUEGOS[i]!;
  const arte = arteDeCasete(casete.arte);
  const medida = medidas(arte);
  return {
    casete,
    lado: 'A',
    numero: i + 1,
    pista: pistaDe('A', i),
    arte,
    material: materialDeCasete(arte),
    medida,
    apaisada: medida !== null && medida.ancho / medida.alto > 1.4,
    disco: discoDeRecorte(arte),
    ladoA: renglones('A', JUEGOS, href),
    ladoB: renglones('B', LADO_B, href),
  };
}

/**
 * Las tapas que acredita el pie de una página de juego: las que ya acreditaba más el disco de
 * la pieza de su carátula, sin repetir. La carátula se ve en el teléfono (la esquina de la
 * cabecera) y en la computadora (la columna), así que el crédito es cierto en los dos.
 */
export function tapasConCaratula(tapas: readonly string[], caratula: Caratula): readonly string[] {
  return caratula.disco && !tapas.includes(caratula.disco) ? [...tapas, caratula.disco] : tapas;
}
