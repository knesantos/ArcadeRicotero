import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fechaLarga, fechaDeConsulta, bisDeLaNota, porAnio, nombreDeLicencia } from './listas.ts';

test('las fechas se escriben con lo que la fuente dio, ni más ni menos', () => {
  assert.equal(fechaLarga('1995-12-08'), '8 de diciembre de 1995');
  assert.equal(fechaLarga('1985-04'), 'abril de 1985');
  assert.equal(fechaLarga('1985'), '1985');
  assert.equal(fechaDeConsulta('2026-09-24'), '24-09-2026');
});

test('el bis sale de la nota de la fuente', () => {
  assert.equal(bisDeLaNota('En la fuente, seccion «Encore».'), 1);
  assert.equal(bisDeLaNota('Demo de RCA. En la fuente, seccion «Encore 2».'), 2);
  assert.equal(bisDeLaNota('Comentario de la fuente: «played with the crowd».'), null);
  assert.equal(bisDeLaNota(undefined), null);
});

test('el nombre de la licencia, como va en el rótulo', () => {
  assert.equal(nombreDeLicencia('cc0-1.0'), 'CC0 1.0');
  assert.equal(nombreDeLicencia('cc0', '1.0'), 'CC0 1.0');
  assert.equal(nombreDeLicencia('cc-by-sa-4.0'), 'CC BY-SA 4.0');
  assert.equal(nombreDeLicencia('cc-by-nc-sa', '3.0'), 'CC BY-NC-SA 3.0');
  assert.equal(nombreDeLicencia('dominio-publico'), 'DOMINIO-PUBLICO');
});

test('porAnio ordena y agrupa', () => {
  const g = porAnio([{ fecha: '1993-11-20' }, { fecha: '1992-07-18' }, { fecha: '1993-11-19' }]);
  assert.deepEqual([...g.keys()], ['1992', '1993']);
  assert.deepEqual(g.get('1993')!.map((n) => n.fecha), ['1993-11-19', '1993-11-20']);
});
