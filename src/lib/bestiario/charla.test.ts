import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Charla, PROBABILIDAD, RESPIRO_MS } from './charla.ts';

/** Un azar que devuelve lo que se le pide, en orden. */
const dados = (...valores: number[]) => () => valores.shift() ?? 1;

test('habla la que gana el sorteo al aparecer, y la que pierde se calla', () => {
  const c = new Charla(dados(0.1, 0.9));
  assert.equal(c.mirar(['a', 'b'], 0, false), 'a');
  assert.equal(c.mirar(['a', 'b'], RESPIRO_MS, false), null);
});

test('tira una sola vez por aparición, y vuelve a tirar si sale y entra', () => {
  const tiros: number[] = [];
  const c = new Charla(() => (tiros.push(1), 1));
  c.mirar(['a'], 0, false);
  c.mirar(['a'], 100, false);
  assert.equal(tiros.length, 1);
  c.mirar([], 200, false);
  c.mirar(['a'], 300, false);
  assert.equal(tiros.length, 2);
});

test('de a una, con aire entre una y otra', () => {
  const c = new Charla(() => 0);
  assert.equal(c.mirar(['a', 'b'], 0, false), 'a');
  assert.equal(c.mirar(['a', 'b'], RESPIRO_MS - 1, false), null);
  assert.equal(c.mirar(['a', 'b'], RESPIRO_MS, false), 'b');
});

test('espera si hay algo encima, y la que se fue de la pantalla ya no habla', () => {
  const c = new Charla(() => 0);
  assert.equal(c.mirar(['a'], 0, true), null);
  assert.equal(c.mirar(['b'], 10, false), 'b');
  assert.equal(c.mirar(['b'], 10 + RESPIRO_MS, false), null);
});

test('una de cada cinco, más o menos', () => {
  let semilla = 7;
  const azar = () => ((semilla = (semilla * 16807) % 2147483647) - 1) / 2147483646;
  const c = new Charla(azar);
  let ganan = 0;
  const N = 5000;
  // Cada una aparece en una vuelta distinta y no queda nadie ocupando: cuenta los sorteos ganados.
  for (let i = 0; i < N; i++) if (c.mirar([`b${i}`], i * RESPIRO_MS, false)) ganan++;
  assert.ok(Math.abs(ganan / N - PROBABILIDAD) < 0.02, `ganaron ${ganan} de ${N}`);
});
