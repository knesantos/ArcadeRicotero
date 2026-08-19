/**
 * Los tres tramos de resultado. Implementa `BR-05` (Docs/PRODUCTO/PRD-alcance-v1.md).
 *
 * Cortes en **30% y 70%** de aciertos: bajo 0-29, medio 30-69, alto 70-100.
 *
 * El corte de abajo esta separado a proposito del 25% que rinde el azar puro con las 4
 * opciones de `BR-04`. Si "medio" empezara en 25, se llenaria de partidas respondidas al
 * voleo y el tramo dejaria de significar algo.
 */

export type Tramo = 'bajo' | 'medio' | 'alto';

export const CORTE_MEDIO = 30;
export const CORTE_ALTO = 70;

/**
 * En que tramo cae un resultado.
 *
 * @param aciertos cuantas respondio bien
 * @param total cuantas tenia la ronda
 */
export function tramo(aciertos: number, total: number): Tramo {
  if (!Number.isInteger(aciertos) || !Number.isInteger(total)) {
    throw new RangeError('aciertos y total tienen que ser enteros');
  }
  if (total <= 0) throw new RangeError('la ronda no puede tener 0 preguntas');
  if (aciertos < 0 || aciertos > total) {
    throw new RangeError(`aciertos fuera de rango: ${aciertos} de ${total}`);
  }
  const pct = (aciertos / total) * 100;
  if (pct < CORTE_MEDIO) return 'bajo';
  if (pct < CORTE_ALTO) return 'medio';
  return 'alto';
}
