import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ESCALERA_VERSOS, INTENTOS_VERSOS, extraDeVersos, pasoDeVersos, puntajeMaximoVersos } from './escalera.ts';

/**
 * La escalera de versos de `BR-20`, escrita a mano. Si esta tabla y `escalera.ts` dejan de
 * coincidir, cambió una decisión, no un detalle de código.
 */
test('los cuatro pasos son los de BR-20: 1, 2, 4 y 8 versos, de 100 a 40 puntos', () => {
  assert.deepEqual(
    ESCALERA_VERSOS.map((p) => [p.versos, p.puntos]),
    [
      [1, 100],
      [2, 80],
      [4, 60],
      [8, 40],
    ],
  );
  assert.equal(INTENTOS_VERSOS, 4);
  assert.equal(puntajeMaximoVersos(5), 500);
});

test('pasar compra exactamente los versos que hay entre un escalon y el siguiente', () => {
  assert.equal(extraDeVersos(1), '1 verso');
  assert.equal(extraDeVersos(2), '2 versos');
  assert.equal(extraDeVersos(3), '4 versos');
  // En el ultimo paso no queda letra que pedir: pasar cierra el tema.
  assert.equal(extraDeVersos(4), null);
});

test('lo que promete el boton es lo que despues se muestra', () => {
  // La promesa y el motor salen de la misma tabla: si pasar en el paso n dice "+k", el
  // paso siguiente muestra exactamente k versos mas.
  for (let n = 1; n < ESCALERA_VERSOS.length; n++) {
    const k = Number(extraDeVersos(n)!.split(' ')[0]);
    assert.equal(pasoDeVersos(n + 1).versos - pasoDeVersos(n).versos, k);
  }
});
