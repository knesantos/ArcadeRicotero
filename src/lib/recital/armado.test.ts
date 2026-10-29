import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  VACIO,
  agregar,
  sacar,
  subir,
  bajar,
  cambiarDeTira,
  esPosible,
  tiraDe,
  sePuedeCerrar,
  sortear,
  enOrden,
  duracion,
  formatoDuracion,
  hayLugar,
  MIN_TEMAS_RECITAL,
  MAX_TEMAS_RECITAL,
  MAX_BISES_RECITAL,
  type Armado,
  type TemaDelCatalogo,
} from './armado.ts';

const con = (lista: number[], bises: number[] = []): Armado => ({ lista, bises });

test('agregar suma al final, no repite, y cuando la lista se llena manda a los bises', () => {
  assert.deepEqual(agregar(VACIO, 4), con([4]));
  assert.deepEqual(agregar(con([4]), 4), con([4]), 'un tema no suena dos veces');
  const llena = con(Array.from({ length: MAX_TEMAS_RECITAL }, (_, i) => i));
  assert.deepEqual(agregar(llena, 99).bises, [99]);
  const todo = con(llena.lista as number[], Array.from({ length: MAX_BISES_RECITAL }, (_, i) => 50 + i));
  assert.equal(hayLugar(todo), false);
  assert.equal(agregar(todo, 99), todo, 'sin lugar, la misma lista');
});

test('subir y bajar cruzan el borde entre la lista y los bises', () => {
  const a = con([1, 2, 3], [7]);
  assert.deepEqual(subir(a, 2), con([2, 1, 3], [7]));
  assert.deepEqual(bajar(a, 2), con([1, 3, 2], [7]));
  assert.deepEqual(bajar(a, 3), con([1, 2], [3, 7]), 'el último de la lista pasa al primer bis');
  assert.deepEqual(subir(a, 7), con([1, 2, 3, 7], []), 'el primer bis vuelve al final de la lista');
  assert.equal(subir(a, 1), a, 'el primero no sube');
  assert.equal(bajar(a, 7), a, 'el último bis no baja');
  assert.deepEqual(bajar(con([1]), 1), con([1]), 'el único de la lista no se va a los bises');
  assert.equal(subir(a, 42), a, 'un tema que no está no se mueve');
});

test('cambiar de tira respeta los techos y no deja la lista vacía', () => {
  assert.deepEqual(cambiarDeTira(con([1, 2], []), 1), con([2], [1]));
  assert.deepEqual(cambiarDeTira(con([1, 2], [5]), 5), con([1, 2, 5], []));
  assert.deepEqual(cambiarDeTira(con([1], []), 1), con([1]), 'sin lista no hay recital');
  const bisesLlenos = con([1, 2], Array.from({ length: MAX_BISES_RECITAL }, (_, i) => 50 + i));
  assert.equal(cambiarDeTira(bisesLlenos, 1), bisesLlenos);
});

test('sacar, tiraDe y enOrden', () => {
  const a = con([1, 2], [3]);
  assert.deepEqual(sacar(a, 2), con([1], [3]));
  assert.deepEqual(sacar(a, 3), con([1, 2], []));
  assert.equal(sacar(a, 9), a);
  assert.equal(tiraDe(a, 1), 'lista');
  assert.equal(tiraDe(a, 3), 'bises');
  assert.equal(tiraDe(a, 9), null);
  assert.deepEqual(enOrden(a), [1, 2, 3]);
});

test('se cierra con el mínimo de temas en la lista, sin contar los bises', () => {
  const casi = con(Array.from({ length: MIN_TEMAS_RECITAL - 1 }, (_, i) => i), [90]);
  assert.equal(sePuedeCerrar(casi), false);
  assert.equal(sePuedeCerrar(agregar(casi, 80)), true);
});

test('sortear elige entre los que faltan, con el azar que le pasen', () => {
  assert.equal(sortear(con([0, 1]), [0, 1, 2, 3], () => 0), 2);
  assert.equal(sortear(con([0, 1]), [0, 1, 2, 3], () => 0.999), 3);
  assert.equal(sortear(con([0, 1]), [0, 1], () => 0), null);
});

test('la duración suma lo medido y cuenta aparte lo que no', () => {
  const t = (segundos: number | null): TemaDelCatalogo => ({ slug: 'x', titulo: 'x', disco: 'gulp', pista: 1, segundos });
  const catalogo = [t(200), t(null), t(250)];
  assert.deepEqual(duracion(con([0, 1], [2]), catalogo), { segundos: 450, sinMedir: 1 });
  assert.equal(formatoDuracion(450), '8 min');
  assert.equal(formatoDuracion(3600), '1 h');
  assert.equal(formatoDuracion(5040), '1 h 24 min');
  assert.equal(formatoDuracion(0), '0 min');
});

test('esPosible acepta lo que el juego arma, incluida una lista vacía con bises, y rechaza lo demás', () => {
  assert.equal(esPosible(con([], [7, 8])), true, 'se llega con Sacala: no se rearma');
  assert.equal(esPosible(con([1, 2], [3])), true);
  assert.equal(esPosible(con([1, 1])), false);
  assert.equal(esPosible(con([1], [1])), false);
  assert.equal(esPosible(con([], Array.from({ length: MAX_BISES_RECITAL + 1 }, (_, i) => i))), false);
  assert.equal(esPosible(con(Array.from({ length: MAX_TEMAS_RECITAL + 1 }, (_, i) => i))), false);
});
