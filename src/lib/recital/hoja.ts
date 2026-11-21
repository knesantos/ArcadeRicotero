/**
 * La planta de la hoja que sale de "Armá tu recital" (`D-72`; ronda de pulida, 2026-11-21).
 *
 * Es la lista de la noche como hoja de papel: la marca, el título, el lugar, los temas
 * numerados, el corte, los bises y el pie. **Acá se decide dónde va cada cosa y cuánto mide;
 * `scripts/hoja-recital.ts` solo pinta.** Mismo reparto que `lib/ponelos/lamina.ts`: un canvas
 * no existe en Node, y lo que viva del lado del pincel no lo mira ningún test.
 *
 * Tiene planta propia y no la de la lámina de "Ponelos en fila" porque aquella reparte el alto
 * entre bandas parejas, y una lista de cinco temas con dos bises quedaba con media hoja en
 * blanco. Acá **la letra se agranda con una lista corta y la hoja se alarga con una larga**: no
 * queda aire entre la lista y los bises, y nunca se corta un tema.
 */

/** El ancho de la imagen. El mismo de la tarjeta y de la lámina. */
export const ANCHO_HOJA = 1080;
/** El alto mínimo: cuatro por cinco, que es lo que mejor se ve en un teléfono. */
export const ALTO_MINIMO = 1350;
/** La franja roja del pie, la que comparten las tres piezas que salen del sitio. */
export const FRANJA_HOJA = 14;
/** Cuánto piso se ve alrededor del papel. */
export const AIRE_HOJA = 34;
/** El margen de lo escrito, desde el borde de la imagen. */
export const MARGEN_HOJA = 96;
/** Entre qué cuerpos se mueve la letra de los temas. */
export const CUERPO_TEMA = { piso: 34, techo: 62 } as const;
/** Cuánto ocupa un renglón, en cuerpos: la letra y la raya de abajo. */
export const PASO_RENGLON = 1.5;

const CABEZA = 330; // de arriba del papel al primer renglón: marca, título y lugar
const CORTE = 96; // la raya de puntos con la palabra
const PIE = 170; // la cuenta, el crédito y la dirección
const COLCHON = 40; // entre el último renglón y el pie

export interface PlantaDeLaHoja {
  readonly ancho: number;
  readonly alto: number;
  /** El cuerpo de la letra de los temas. */
  readonly cuerpo: number;
  /** De un renglón al siguiente. */
  readonly paso: number;
  readonly yMarca: number;
  readonly yTitulo: number;
  readonly yLugar: number;
  /** Dónde arranca cada renglón de la lista, de arriba abajo. */
  readonly yLista: readonly number[];
  /** El corte de los bises, o `null` si no hay. */
  readonly yCorte: number | null;
  readonly yBises: readonly number[];
  readonly yPie: number;
}

/**
 * Planifica la hoja para `lista` temas y `bises` bises.
 *
 * Elige el cuerpo más grande con el que todo entra en el alto mínimo; si ni con el piso
 * entra, la hoja se alarga lo que haga falta.
 */
export function plantaDeLaHoja(lista: number, bises: number): PlantaDeLaHoja {
  const renglones = Math.max(0, lista) + Math.max(0, bises);
  const arriba = AIRE_HOJA + 56;
  const fijo = arriba + CABEZA + (bises > 0 ? CORTE : 0) + COLCHON + PIE + AIRE_HOJA + FRANJA_HOJA;
  const libre = ALTO_MINIMO - fijo;
  const cuerpo = Math.round(Math.min(CUERPO_TEMA.techo, Math.max(CUERPO_TEMA.piso, libre / (Math.max(renglones, 1) * PASO_RENGLON))));
  const paso = Math.round(cuerpo * PASO_RENGLON);
  const yPrimero = arriba + CABEZA;
  const yLista = Array.from({ length: Math.max(0, lista) }, (_, k) => yPrimero + k * paso);
  const finLista = yPrimero + Math.max(0, lista) * paso;
  const yCorte = bises > 0 ? finLista + 18 : null;
  const yPrimerBis = finLista + (bises > 0 ? CORTE : 0);
  const yBises = Array.from({ length: Math.max(0, bises) }, (_, k) => yPrimerBis + k * paso);
  const finRenglones = yPrimerBis + Math.max(0, bises) * paso;
  const alto = Math.max(ALTO_MINIMO, finRenglones + COLCHON + PIE + AIRE_HOJA + FRANJA_HOJA);
  // El pie va pegado abajo del papel: en una lista corta, el blanco queda abajo del último tema
  // y no entre la lista y los bises.
  const yPie = alto - FRANJA_HOJA - AIRE_HOJA - PIE;
  return { ancho: ANCHO_HOJA, alto, cuerpo, paso, yMarca: arriba, yTitulo: arriba + 86, yLugar: arriba + 236, yLista, yCorte, yBises, yPie };
}

/**
 * El cuerpo con el que un título entra en el ancho: el pedido si entra, y si no, lo justo
 * para que entre, hasta un piso. Debajo del piso se parte en dos renglones (lo decide el pincel).
 */
export function cuerpoDelTitulo(anchoMedido: number, anchoDisponible: number, cuerpo: number, piso = 0.62): number {
  if (anchoMedido <= anchoDisponible) return cuerpo;
  return Math.max(Math.floor((cuerpo * anchoDisponible) / anchoMedido), Math.floor(cuerpo * piso));
}
