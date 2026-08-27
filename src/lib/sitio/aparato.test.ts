/**
 * Verificación de la detección de aparato.
 *
 * Existe por un caso concreto: un jugador no pudo escuchar ni un tema, y la causa
 * resultó ser **la llave lateral de silencio del iPhone**, que apaga el audio del
 * navegador sin avisar y que **ninguna API de la web puede detectar**.
 *
 * Como no se puede preguntar por la llave, lo único que queda es saber a quién avisarle.
 * Estas pruebas fijan a quién: si la detección se rompe, el aviso deja de aparecer
 * justo donde hace falta, y no hay forma de notarlo mirando la pantalla.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esIOS, esMovil, navegadorIncrustado } from './aparato.ts';

const IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const CHROME_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0 Mobile/15E148 Safari/604.1';
const ANDROID =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36';
const ESCRITORIO =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

test('el aviso de la llave llega a los iPhone, y a ninguno mas', () => {
  assert.equal(esIOS(IPHONE), true);
  assert.equal(esIOS(ANDROID), false);
  assert.equal(esIOS(ESCRITORIO), false);
});

test('Chrome en iPhone tambien es iPhone: por dentro es el mismo Safari', () => {
  // Apple obliga a usar WebKit, asi que Chrome y Firefox en iPhone comparten sus
  // politicas de audio al pie. Si esta deteccion fallara, quien usa Chrome en un iPhone
  // se quedaria sin el unico aviso que le sirve.
  assert.equal(esIOS(CHROME_IOS), true);
});

test('los navegadores incrustados se reconocen por lo que son', () => {
  assert.equal(navegadorIncrustado(`${IPHONE} Instagram 300.0`), 'Instagram');
  assert.equal(navegadorIncrustado(`${ANDROID} [FBAN/FB4A;FBAV/400.0]`), 'Facebook');
  assert.equal(navegadorIncrustado(`${ANDROID} WhatsApp/2.24`), 'WhatsApp');
  assert.equal(navegadorIncrustado('Mozilla/5.0 (Linux; Android 14; wv) Chrome/126.0'), 'otra aplicación');
});

test('un navegador de verdad no se marca como incrustado', () => {
  // El falso positivo seria peor que el falso negativo: mandaria a alguien a "abrirlo
  // aparte" cuando ya esta donde tiene que estar.
  assert.equal(navegadorIncrustado(IPHONE), null);
  assert.equal(navegadorIncrustado(ANDROID), null);
  assert.equal(navegadorIncrustado(ESCRITORIO), null);
  assert.equal(navegadorIncrustado(CHROME_IOS), null);
});

test('el aviso del volumen es para telefonos, donde el volumen es otra perilla', () => {
  assert.equal(esMovil(IPHONE), true);
  assert.equal(esMovil(ANDROID), true);
  assert.equal(esMovil(ESCRITORIO), false);
});
