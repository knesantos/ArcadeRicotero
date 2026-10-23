/**
 * Dónde se abre la ficha (`D-80`): nunca encima del bicho que se está mirando.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lugarDeLaFicha, type Caja } from './hoja.ts';

const TELEFONO: Caja = { left: 0, top: 0, right: 375, bottom: 812 };
const COMPU: Caja = { left: 0, top: 0, right: 1280, bottom: 800 };
const caja = (left: number, top: number, ancho: number, alto: number): Caja => ({ left, top, right: left + ancho, bottom: top + alto });

test('en el teléfono, un bicho abajo deja la ficha arriba, y al revés', () => {
  assert.equal(lugarDeLaFicha(caja(100, 560, 120, 160), TELEFONO, false, 0, 60).lado, 'arriba');
  assert.equal(lugarDeLaFicha(caja(100, 120, 120, 160), TELEFONO, false, 0, 60).lado, 'abajo');
});

test('en el teléfono, la ficha se achica hasta no pisarlo', () => {
  const bicho = caja(100, 300, 120, 200);
  const l = lugarDeLaFicha(bicho, TELEFONO, false, 0, 60);
  assert.equal(l.lado, 'abajo');
  // Abajo de la ficha queda el borde; arriba de la ficha, el bicho, con aire.
  assert.ok(TELEFONO.bottom - l.alto! >= bicho.bottom, `${l.alto}`);
});

test('en el teléfono, aunque el bicho sea enorme, la ficha se puede leer', () => {
  const l = lugarDeLaFicha(caja(0, 80, 375, 700), TELEFONO, false, 0, 60);
  assert.ok(l.alto! >= 812 * 0.26 - 1);
});

test('en la compu, la ficha va del lado libre y no corre la escena si entra', () => {
  const izq = lugarDeLaFicha(caja(200, 300, 150, 200), COMPU, true, 480, 0);
  assert.deepEqual([izq.lado, izq.correr], ['derecha', 0]);
  const der = lugarDeLaFicha(caja(1000, 300, 150, 200), COMPU, true, 480, 0);
  assert.deepEqual([der.lado, der.correr], ['izquierda', 0]);
});

test('en la compu, si el bicho está en el medio, la escena se corre lo justo', () => {
  const bicho = caja(560, 300, 300, 200);
  const l = lugarDeLaFicha(bicho, COMPU, true, 480, 0);
  // Corrido, el bicho termina antes de que empiece la ficha.
  const derechaDelBicho = bicho.right - l.correr;
  if (l.lado === 'derecha') assert.ok(derechaDelBicho <= COMPU.right - 480);
  else assert.ok(bicho.left - l.correr >= 480);
});
