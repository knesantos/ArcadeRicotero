import { test } from 'node:test';
import assert from 'node:assert/strict';

import { duracion, Cronometro, total, TOPE_MINUTOS } from './reloj.ts';

/**
 * El reloj de `US-02`. Se testea con una fuente de tiempo de mentira, así que ningún
 * test de acá espera un milisegundo real.
 */

test('abajo del minuto se escribe en segundos enteros', () => {
  assert.equal(duracion(0), '0 s');
  assert.equal(duracion(8_000), '8 s');
  assert.equal(duracion(59_400), '59 s');
});

test('los milisegundos se redondean, no se truncan', () => {
  // 8,6 s es "9 s" y no "8 s": truncar le regala medio segundo a todo el mundo.
  assert.equal(duracion(8_600), '9 s');
  assert.equal(duracion(8_400), '8 s');
});

test('arriba del minuto va con el cero adelante, para que la columna alinee', () => {
  assert.equal(duracion(60_000), '1 m 00 s');
  assert.equal(duracion(64_000), '1 m 04 s');
  assert.equal(duracion(125_000), '2 m 05 s');
});

test('un tiempo absurdo se topea en vez de imprimirse', () => {
  // Alguien dejo la pestania abierta y volvio al rato. No es un dato: es un accidente.
  assert.equal(duracion(200 * 60_000), `+${TOPE_MINUTOS} m`);
  // Justo abajo del tope todavia es un numero de verdad.
  assert.equal(duracion(TOPE_MINUTOS * 60_000), '99 m 00 s');
});

test('nunca escribe un tiempo negativo', () => {
  // No deberia llegar uno, pero si llega, la pantalla no puede decir "-3 s".
  assert.equal(duracion(-5_000), '0 s');
});

/** Una fuente de tiempo que avanza cuando el test lo dice. */
function relojFalso() {
  let t = 1000;
  return { ahora: () => t, avanzar: (ms: number) => { t += ms; } };
}

test('el cronometro cuenta lo que corrio', () => {
  const f = relojFalso();
  const c = new Cronometro(f.ahora);
  c.arrancar();
  f.avanzar(3_000);
  assert.equal(c.cerrar(), 3_000);
});

test('lo que pasa con la pestania escondida no se cobra', () => {
  // La regla 2 del modulo: atender el telefono no puede arruinar la vuelta.
  const f = relojFalso();
  const c = new Cronometro(f.ahora);
  c.arrancar();
  f.avanzar(2_000);
  c.pausar();
  f.avanzar(600_000); // diez minutos afuera
  c.reanudar();
  f.avanzar(1_000);
  assert.equal(c.cerrar(), 3_000);
});

test('pausar y reanudar de mas no cambian el total', () => {
  // El navegador dispara `visibilitychange` mas veces de las que uno espera.
  const f = relojFalso();
  const c = new Cronometro(f.ahora);
  c.arrancar();
  f.avanzar(1_000);
  c.pausar();
  c.pausar();
  f.avanzar(5_000);
  c.reanudar();
  c.reanudar();
  f.avanzar(1_000);
  assert.equal(c.cerrar(), 2_000);
});

test('un tema nuevo no hereda el tiempo del anterior', () => {
  const f = relojFalso();
  const c = new Cronometro(f.ahora);
  c.arrancar();
  f.avanzar(9_000);
  c.cerrar();
  c.arrancar();
  f.avanzar(2_000);
  assert.equal(c.cerrar(), 2_000);
});

test('leer no para el reloj', () => {
  const f = relojFalso();
  const c = new Cronometro(f.ahora);
  c.arrancar();
  f.avanzar(1_500);
  assert.equal(c.leer(), 1_500);
  f.avanzar(500);
  assert.equal(c.leer(), 2_000);
});

test('el total de la vuelta es la suma de los temas', () => {
  assert.equal(total([]), 0);
  assert.equal(total([6_000, 11_000, 4_000, 43_000]), 64_000);
  assert.equal(duracion(total([6_000, 11_000, 4_000, 43_000])), '1 m 04 s');
});
