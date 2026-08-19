import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tramo, CORTE_MEDIO, CORTE_ALTO, type Tramo } from './tramo.ts';

/**
 * La tabla que `BR-05` verifico a mano: los 9 resultados posibles de una ronda de 8.
 * Si esta tabla cambia, cambio la regla — y entonces el que cambia es `producto`, no
 * este archivo.
 */
const RONDA_DE_8: Array<[number, Tramo]> = [
  [0, 'bajo'], // 0%
  [1, 'bajo'], // 12,5%
  [2, 'bajo'], // 25%   <- el que responde todo al azar cae aca, y es el punto de BR-05
  [3, 'medio'], // 37,5%
  [4, 'medio'], // 50%
  [5, 'medio'], // 62,5%
  [6, 'alto'], // 75%
  [7, 'alto'], // 87,5%
  [8, 'alto'], // 100%
];

test('BR-05: las 9 filas exactas de una ronda de 8', () => {
  for (const [aciertos, esperado] of RONDA_DE_8) {
    assert.equal(tramo(aciertos, 8), esperado, `${aciertos}/8 deberia ser ${esperado}`);
  }
});

test('BR-05: los tres tramos reciben al menos un resultado posible', () => {
  const alcanzados = new Set(RONDA_DE_8.map(([a]) => tramo(a, 8)));
  assert.deepEqual([...alcanzados].sort(), ['alto', 'bajo', 'medio']);
});

test('BR-05: 0/8 y 8/8 caen en un tramo definido', () => {
  assert.equal(tramo(0, 8), 'bajo');
  assert.equal(tramo(8, 8), 'alto');
});

test('el jugador que tira al azar con 4 opciones no llega a medio', () => {
  // BR-04 fija 4 opciones, asi que el azar rinde 25%. El corte de abajo esta en 30
  // justamente para que 2/8 no entre en "medio".
  assert.equal(tramo(2, 8), 'bajo');
  assert.ok(25 < CORTE_MEDIO, 'el corte de abajo dejo de proteger contra el azar');
});

test('los cortes son exactamente 30 y 70, y son inclusivos hacia arriba', () => {
  assert.equal(CORTE_MEDIO, 30);
  assert.equal(CORTE_ALTO, 70);
  // Rondas de 10 dan los porcentajes justos y prueban el borde.
  assert.equal(tramo(2, 10), 'bajo'); // 20
  assert.equal(tramo(3, 10), 'medio'); // 30 exacto -> medio
  assert.equal(tramo(6, 10), 'medio'); // 60
  assert.equal(tramo(7, 10), 'alto'); // 70 exacto -> alto
});

test('no hay huecos: toda ronda de 1 a 20 cae siempre en un tramo', () => {
  for (let total = 1; total <= 20; total++) {
    for (let a = 0; a <= total; a++) {
      const t = tramo(a, total);
      assert.ok(t === 'bajo' || t === 'medio' || t === 'alto', `${a}/${total} no cayo en ningun tramo`);
    }
  }
});

test('rechaza entradas imposibles en vez de devolver cualquier cosa', () => {
  assert.throws(() => tramo(0, 0), RangeError);
  assert.throws(() => tramo(-1, 8), RangeError);
  assert.throws(() => tramo(9, 8), RangeError);
  assert.throws(() => tramo(1.5, 8), RangeError);
});
