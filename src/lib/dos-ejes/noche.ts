/**
 * El camino de la noche de «¿Qué tipo de ricotero sos?» (ronda de pulida de los juegos,
 * 2026-11-18): las medidas de la tira dibujada y dónde se para la mirada en cada hoja.
 *
 * La partida es una noche en cinco momentos, y hasta esta ronda la noche no se veía: la hoja
 * flotaba en negro. Ahora arriba de la hoja hay **un lugar**, y el lugar es una tira larga
 * —el barrio, la ruta, el paredón, el escenario, el barrio otra vez— por la que se camina:
 * cada respuesta corre la mirada un tramo, y cada momento, un lugar entero. La luna cruza el
 * cielo de punta a punta en las diez hojas.
 *
 * **Módulo hoja: no importa nada.** Lo leen el dibujo (`scripts/generar-noche-dos-ejes.mjs`),
 * la isla (`partida-dos-ejes.ts`) y su test. Las medidas viven una sola vez: una tira que
 * dibuja con un ancho de lugar y una isla que camina con otro se desfasan sin que nada falle.
 *
 * **Nada de acá mide a quien juega** (`BR-17`): la mirada avanza por hoja contestada, igual
 * para cualquier respuesta. Es el folio, dibujado.
 */

/** La tira, en unidades de dibujo. El alto es la vara: en pantalla, 240 unidades son el alto del suelo. */
export const TIRA = {
  ancho: 3800,
  alto: 240,
  /** Dónde pisa todo: la línea del suelo. */
  piso: 214,
  /** Lo que mide cada lugar, y lo que sobra de barrio a cada punta para que nunca se vea el borde. */
  lugar: 600,
  margen: 400,
  /** Cuánto se corre la mirada entre las dos hojas de un mismo momento, a cada lado del medio. */
  paso: 80,
} as const;

/** Los archivos, tal como quedan servidos. */
export const CARPETA_NOCHE = '/arte/dos-ejes';
export const PIEZAS_DE_LA_NOCHE = [
  'noche-cerca.svg',
  'noche-luz.svg',
  'noche-lejos.svg',
  'noche-postes.svg',
  'noche-micro.svg',
  'noche-estrellas.svg',
  'noche-fuego.svg',
] as const;

/** Dónde empieza un lugar de la tira, en unidades. El 0 es la previa. */
export function inicioDelLugar(lugar: number): number {
  return TIRA.margen + TIRA.lugar * lugar;
}

/**
 * Dónde queda el medio de la mirada en la hoja `paso` (desde 0), en unidades de la tira.
 *
 * Dos hojas por momento: la primera mira un poco a la izquierda del medio del lugar y la
 * segunda un poco a la derecha. Así el pase entre dos hojas del mismo momento es un paso corto
 * y el pase de momento, una caminata.
 */
export function paradaDe(paso: number, hojasPorMomento = 2): number {
  const lugar = Math.floor(paso / hojasPorMomento);
  const adentro = paso % hojasPorMomento;
  const tramo = hojasPorMomento > 1 ? (adentro / (hojasPorMomento - 1)) * 2 - 1 : 0;
  return inicioDelLugar(lugar) + TIRA.lugar / 2 + tramo * TIRA.paso;
}

/**
 * Dónde está la luna en la hoja `paso` de `total`, en porcentaje de su cielo: sale abajo a la
 * izquierda, pasa por arriba y baja a la derecha. `x` y `y` van de 0 a 100.
 */
export function lunaDe(paso: number, total: number): { readonly x: number; readonly y: number } {
  const t = total > 1 ? Math.min(1, Math.max(0, paso / (total - 1))) : 0;
  const arco = Math.sin(Math.PI * (0.14 + 0.72 * t));
  return { x: Math.round(t * 1000) / 10, y: Math.round((1 - arco) * 1000) / 10 };
}
