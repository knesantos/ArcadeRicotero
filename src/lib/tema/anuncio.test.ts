import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anuncioErrado, anuncioRevelacion } from './anuncio.ts';
import { REVELACION } from './copy.ts';

test('el acierto dice el grito, el tema y los puntos, en ese orden', () => {
  assert.equal(anuncioRevelacion(true, 'Nueva Roma', 100), '¡La sacaste! Era Nueva Roma. 100 puntos.');
  assert.equal(anuncioRevelacion(true, 'Nueva Roma', 1), '¡La sacaste! Era Nueva Roma. 1 punto.');
});

test('cuando se escapa dice cual era, y no habla de puntos', () => {
  const dice = anuncioRevelacion(false, 'Nueva Roma', 0);
  assert.ok(dice.startsWith(REVELACION.fallo));
  assert.ok(dice.endsWith('Era Nueva Roma.'));
  assert.ok(!/punto/.test(dice));
});

test('lo que se escucha es lo que se lee: las palabras salen de copy.ts', () => {
  const dice = anuncioRevelacion(true, 'X', 50);
  for (const parte of [REVELACION.acerto, REVELACION.eraEl, REVELACION.puntos(50)]) {
    assert.ok(dice.includes(parte), `falta "${parte}"`);
  }
});

test('el intento errado nombra lo que se arriesgo', () => {
  assert.equal(anuncioErrado('Ji ji ji'), 'No era Ji ji ji.');
});

test('registro 3: el errado va sin suspensivos y sin exclamacion', () => {
  const dice = anuncioErrado('Motor psico');
  assert.ok(!/…|\.\.\./.test(dice));
  assert.ok(!/[¡!]/.test(dice));
});
