import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parsear, escribir, transportar, transportarTono, renglonDeAcordes, acordesDelTema,
} from './acordes.ts';

test('parsea las formas que trae la fuente', () => {
  assert.deepEqual(parsear('G'), { raiz: 'G', resto: '', bajo: null });
  assert.deepEqual(parsear('Am7'), { raiz: 'A', resto: 'm7', bajo: null });
  assert.deepEqual(parsear('Bb'), { raiz: 'Bb', resto: '', bajo: null });
  assert.deepEqual(parsear('C#m'), { raiz: 'C#', resto: 'm', bajo: null });
  assert.deepEqual(parsear('G#9/C'), { raiz: 'G#', resto: '9', bajo: 'C' });
  assert.deepEqual(parsear('D/F#'), { raiz: 'D', resto: '', bajo: 'F#' });
});

test('lo que no es un acorde no se inventa', () => {
  assert.equal(parsear('Solo'), null);
  assert.equal(parsear(''), null);
  assert.equal(parsear('x2'), null);
});

test('escribir deshace parsear', () => {
  for (const a of ['G', 'Am7', 'Bb', 'C#m', 'G#9/C', 'D/F#', 'F#m7b5']) {
    assert.equal(escribir(parsear(a)!), a, a);
  }
});

test('transportar mueve raiz y bajo el mismo intervalo', () => {
  assert.equal(transportar('C', 2), 'D');
  assert.equal(transportar('Am7', 3), 'Cm7');
  assert.equal(transportar('D/F#', 2), 'E/G#');
  assert.equal(transportar('B', 1), 'C');
  // Hacia abajo y dando la vuelta.
  assert.equal(transportar('C', -1), 'B');
  assert.equal(transportar('C', -13), 'B');
});

test('cero semitonos no toca nada', () => {
  assert.equal(transportar('G#9/C', 0), 'G#9/C');
});

test('un tono con bemol se escribe con bemol', () => {
  // Subir un semitono desde Mi da Fa: en Fa la cuarta es Sib, no La#.
  assert.equal(transportar('A#', 0, 'F'), 'A#');
  assert.equal(transportar('A', 1, 'F'), 'Bb');
  assert.equal(transportar('A', 1, 'G'), 'A#');
});

test('el tono del tema conserva el modo menor', () => {
  assert.equal(transportarTono('Em', 2), 'F#m');
  assert.equal(transportarTono('C', 5), 'F');
  assert.equal(transportarTono('Am', 3), 'Cm');
  assert.equal(transportarTono(null, 3), null);
  assert.equal(transportarTono('Em', 0), 'Em');
});

test('un acorde que no se puede leer se devuelve intacto, no se pierde', () => {
  assert.equal(transportar('N.C.', 2), 'N.C.');
});

test('el renglon de acordes respeta la columna de cada uno', () => {
  const r = renglonDeAcordes([['C', 0], ['G', 10]]);
  assert.deepEqual(r, [{ hueco: 0, acorde: 'C' }, { hueco: 9, acorde: 'G' }]);
  // La columna 10 se alcanza: 0 + largo('C') + 9 = 10.
  assert.equal(0 + 'C'.length + 9, 10);
});

test('dos acordes encimados se separan en vez de pisarse', () => {
  const r = renglonDeAcordes([['Am7', 0], ['G', 1]]);
  assert.ok(r[1]!.hueco >= 1, 'siempre queda al menos un espacio entre acordes');
});

test('el renglon ordena por columna aunque la fuente venga desordenada', () => {
  const r = renglonDeAcordes([['G', 10], ['C', 0]]);
  assert.deepEqual(r.map((c) => c.acorde), ['C', 'G']);
});

test('la lista de acordes del tema no repite', () => {
  assert.deepEqual(acordesDelTema(['C', 'G', 'C', 'Am'], 0), ['C', 'G', 'Am']);
  assert.deepEqual(acordesDelTema(['C', 'D'], 2), ['D', 'E']);
});
