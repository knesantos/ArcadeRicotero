import { test } from 'node:test';
import assert from 'node:assert/strict';

import { armarMazo, sincronizar, primera, quedan, saltear, alFrente, mezclar } from './mazo.ts';
import { ubicar, vacio } from './tablero.ts';

/**
 * El mazo de `D-69` es el orden en que se reparte lo que falta. Lo que estos casos protegen
 * es que **nunca contradiga al tablero**: una ficha ubicada que sigue saliendo, o una que
 * volvió a la bandeja y no sale nunca más, son el mismo defecto con dos caras — el jugador
 * no puede terminar, o termina una lista que no es la que ve.
 */

/** Un azar determinista, para que mezclar se pueda afirmar. */
function azarFijo(): () => number {
  let n = 7;
  return () => (n = (n * 1103515245 + 12345) % 2147483648) / 2147483648;
}

test('el mazo de un tablero vacío son todas, en el orden del conjunto', () => {
  assert.deepEqual(armarMazo(vacio(5)), [0, 1, 2, 3, 4]);
  assert.equal(primera(armarMazo(vacio(5))), 0);
  assert.equal(quedan(armarMazo(vacio(5))), 5);
});

test('el mazo de un tablero lleno está vacío, y no tiene primera', () => {
  const lleno = [1, 2, 3, 4, 1];
  assert.deepEqual(armarMazo(lleno), []);
  assert.equal(primera(armarMazo(lleno)), null);
});

test('saltear pasa la primera al fondo, y no pierde ni duplica nada', () => {
  const m = saltear([0, 1, 2, 3], 0);
  assert.deepEqual(m, [1, 2, 3, 0]);
  assert.deepEqual(saltear([4], 4), [4], 'con una sola no cambia nada');
  assert.deepEqual(saltear([0, 1], 9), [0, 1], 'una que no está no se inventa');
});

test('elegir una del mazo la sube arriba y deja el resto como estaba', () => {
  assert.deepEqual(alFrente([0, 1, 2, 3], 2), [2, 0, 1, 3]);
  assert.deepEqual(alFrente([0, 1], 9), [0, 1]);
});

test('mezclar cambia el orden y no qué fichas hay', () => {
  const antes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const despues = mezclar(antes, azarFijo());
  assert.deepEqual([...despues].sort((a, b) => a - b), antes);
  assert.notDeepEqual(despues, antes, 'con este azar, mezclar tenía que mover algo');
  assert.deepEqual(antes, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 'mezclar mutó el mazo de entrada');
});

test('sincronizar saca las que se ubicaron y conserva el orden del resto', () => {
  let reparto = vacio(5);
  let mazo = saltear(armarMazo(reparto), 0); // [1, 2, 3, 4, 0]
  reparto = ubicar(reparto, 2, 1);
  mazo = sincronizar(mazo, reparto);
  assert.deepEqual(mazo, [1, 3, 4, 0]);
});

test('sincronizar manda al fondo las que volvieron a la bandeja', () => {
  // Una ficha sacada de una fila, o una jugada deshecha: vuelve, pero al fondo, para que el
  // que está repartiendo no la vea otra vez de golpe.
  const reparto = [0, 1, 0, 0, 2]; // la 1 sigue puesta; la 0, 2 y 3 están en la bandeja
  assert.deepEqual(sincronizar([2, 3], reparto), [2, 3, 0]);
});

test('sincronizar arregla un mazo que no se puede creer', () => {
  // Repetidas, ubicadas o que no existen: el mazo se rehace desde el tablero.
  const reparto = [0, 1, 0];
  assert.deepEqual(sincronizar([2, 2, 1, 9, 0], reparto), [2, 0]);
});

test('repartir de punta a punta con el mazo termina el tablero', () => {
  let reparto = vacio(13);
  let mazo = armarMazo(reparto);
  let vueltas = 0;
  while (primera(mazo) !== null && vueltas < 100) {
    const i = primera(mazo)!;
    reparto = ubicar(reparto, i, (i % 4) + 1);
    mazo = sincronizar(mazo, reparto);
    vueltas++;
  }
  assert.equal(vueltas, 13, 'hizo falta una vuelta por ficha, ni una más');
  assert.ok(reparto.every((v) => v > 0));
});
