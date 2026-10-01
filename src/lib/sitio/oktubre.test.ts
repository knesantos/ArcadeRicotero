/**
 * El afiche de octubre (`D-49`, `sitio/oktubre.ts`).
 *
 * El primer test corre contra las fichas reales, y es el que importa: el afiche afirma que
 * seis de los diez discos salieron en octubre, y eso tiene que seguir siendo lo que dicen
 * las fichas, no lo que alguien recuerda. Los demás prueban que la cuenta sabe dejar
 * afuera lo que no es un hecho.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { cumpleDelDia, discosDeOktubre, esOktubre, type FichaCruda } from './oktubre.ts';
import { OKTUBRE } from './copy.ts';

const fichas = (): FichaCruda[] =>
  (JSON.parse(readFileSync('src/data/redondopedia.json', 'utf-8')) as { articulos: FichaCruda[] }).articulos;

test('con las fichas de hoy: seis de los diez discos salieron en octubre, y son estos', () => {
  const { deOktubre, total } = discosDeOktubre(fichas());
  assert.equal(total, 10);
  assert.deepEqual(
    deOktubre.map((d) => `${d.dia}/${d.anio} ${d.slug}`),
    // Del más viejo al más nuevo. Los dos de 1993 salieron el mismo día y quedan en el orden
    // de las fichas: primero el vol. 1.
    [
      '4/1986 oktubre',
      '7/1989 bang-bang-estas-liquidado',
      '27/1991 la-mosca-y-la-sopa',
      '4/1993 lobo-suelto',
      '4/1993 cordero-atado',
      '7/1996 luzbelito',
    ],
  );
});

test('el afiche lo cuenta en letras', () => {
  const { deOktubre, total } = discosDeOktubre(fichas());
  assert.equal(OKTUBRE.cuenta(deOktubre.length, total), 'De los diez discos, seis salieron en octubre.');
});

const disco = (slug: string, valor: string, rotulo = 'hecho', etiqueta = 'Salida'): FichaCruda => ({
  slug,
  tipo: 'disco',
  titulo: slug,
  datos: [{ etiqueta, valor, rotulo }],
});

test('una fecha que no es un hecho no entra al afiche', () => {
  const { deOktubre } = discosDeOktubre([
    disco('firme', '4 de octubre de 1986'),
    disco('dudosa', '4 de octubre de 1986', 'leyenda'),
    disco('contada', '4 de octubre de 1986', 'testimonio'),
  ]);
  assert.deepEqual(deOktubre.map((d) => d.slug), ['firme']);
});

test('lee las dos etiquetas de salida, con la aclaración que traiga atrás', () => {
  const { deOktubre } = discosDeOktubre([
    disco('a', '4 de octubre de 1986, sin discrepancia entre fuentes', 'hecho', 'Fecha de salida'),
    disco('b', '7 de octubre de 1996', 'hecho', 'Salida'),
    disco('c', '18 de noviembre de 1998'),
    disco('d', '1985', 'hecho', 'Año'),
  ]);
  assert.deepEqual(deOktubre.map((d) => d.slug), ['a', 'b']);
});

test('una ficha que no es de disco no cuenta, ni para el total', () => {
  const { total } = discosDeOktubre([disco('x', '4 de octubre de 1986'), { slug: 'y', tipo: 'tema', titulo: 'y' }]);
  assert.equal(total, 1);
});

test('el mes: octubre es el 9 de JavaScript, y solo ese', () => {
  assert.equal(esOktubre(new Date(2026, 9, 1)), true);
  assert.equal(esOktubre(new Date(2026, 9, 31)), true);
  assert.equal(esOktubre(new Date(2026, 8, 30)), false);
  assert.equal(esOktubre(new Date(2026, 10, 1)), false);
});

test('la estampa del cumpleaños cambia el 4, y los años los cuenta la fecha', () => {
  const salida = { dia: 4, anio: 1986 };
  assert.equal(cumpleDelDia(new Date(2026, 9, 1), salida), 'EL 4 CUMPLE 40');
  assert.equal(cumpleDelDia(new Date(2026, 9, 4), salida), 'HOY CUMPLE 40');
  assert.equal(cumpleDelDia(new Date(2026, 9, 5), salida), 'CUMPLIÓ 40 EL 4');
  assert.equal(cumpleDelDia(new Date(2027, 9, 2), salida), 'EL 4 CUMPLE 41');
});
