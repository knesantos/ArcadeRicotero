/**
 * La escalera de versos de "Sacalo por la letra" (`US-07`, `BR-20`).
 *
 * Cuatro pasos que duplican: 1 / 2 / 4 / 8 versos acumulados. Mismo mecanismo que la
 * escalera de audio del juego hermano (`D-24`): errar —o pasar— es lo que abre el
 * escalón siguiente, y con 105 títulos en el buscador el azar no paga, así que no hay
 * que castigarlo. Se acaban los cuatro y el tema se cierra en 0.
 *
 * ## Por qué cuatro pasos y no seis
 *
 * `BR-20` lo midió: sobre un promedio de ~29 versos por tema, un sexto paso que duplique
 * hasta 32 mostraría más de la mitad de la letra — a esa altura ya no es adivinar, es
 * leer. El puntaje son los cuatro primeros valores de `BR-02`, sin inventar moneda nueva.
 *
 * ## Este archivo es la única fuente de la escalera
 *
 * El JSON del banco guarda **ocho versos por ítem y ningún número de pasos** (`CTR-09.3`):
 * el motor corta `versos.slice(0, paso.versos)` sobre la ventana que ya tiene. Si `BR-20`
 * cambia, cambia acá — y el 8 del schema falla ruidoso, que es su trabajo.
 */

export interface PasoDeVersos {
  /** 1 a 4. */
  readonly n: number;
  /** Cuántos versos acumulados muestra este paso. */
  readonly versos: number;
  /** Lo que vale acertar acá. */
  readonly puntos: number;
  /** Cómo se anuncia en pantalla. */
  readonly etiqueta: string;
}

export const ESCALERA_VERSOS: readonly PasoDeVersos[] = [
  { n: 1, versos: 1, puntos: 100, etiqueta: '1 verso' },
  { n: 2, versos: 2, puntos: 80, etiqueta: '2 versos' },
  { n: 3, versos: 4, puntos: 60, etiqueta: '4 versos' },
  { n: 4, versos: 8, puntos: 40, etiqueta: '8 versos' },
];

/** Cuántos intentos hay por tema: uno por escalón, igual que el hermano de audio. */
export const INTENTOS_VERSOS = ESCALERA_VERSOS.length;

/** El paso número `n`. Fuera de rango, el último — nunca `undefined` en el motor. */
export function pasoDeVersos(n: number): PasoDeVersos {
  if (n <= 1) return ESCALERA_VERSOS[0]!;
  if (n >= ESCALERA_VERSOS.length) return ESCALERA_VERSOS[ESCALERA_VERSOS.length - 1]!;
  return ESCALERA_VERSOS[n - 1]!;
}

/** Los puntos de acertar en el paso `n`. Fallar los cuatro da 0, y 0 es solo eso. */
export function puntosDeVersos(n: number): number {
  return pasoDeVersos(n).puntos;
}

/** El puntaje máximo de una vuelta de `temas` temas: sirve para el "x de y". */
export function puntajeMaximoVersos(temas: number): number {
  return temas * ESCALERA_VERSOS[0]!.puntos;
}
