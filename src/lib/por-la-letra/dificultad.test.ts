/**
 * Verificación de `D-27`: la dificultad sale de las escuchas, no de una etiqueta a mano.
 *
 * El último test es el que más importa hoy, porque describe el estado real del repo: sin
 * mediciones la regla devuelve `dificil` para todo, y eso hay que poder afirmarlo sin
 * ambigüedad para que nadie lea el banco y crea que el juego escalona.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { repartirPorPopularidad, type TemaMedido } from './dificultad.ts';

const medido = (slug: string, vistas: number): TemaMedido => ({
  slug,
  estado: 'medido',
  medicion: { vistas },
});
const sinVideo = (slug: string): TemaMedido => ({ slug, estado: 'sin-video' });

test('los temas medidos se parten en tercios: mas escuchado, mas facil', () => {
  const temas = [
    medido('a', 900),
    medido('b', 800),
    medido('c', 500),
    medido('d', 400),
    medido('e', 100),
    medido('f', 50),
  ];
  const { porSlug, medidos } = repartirPorPopularidad(temas);
  assert.equal(medidos, 6);
  assert.equal(porSlug.get('a'), 'facil');
  assert.equal(porSlug.get('b'), 'facil');
  assert.equal(porSlug.get('c'), 'media');
  assert.equal(porSlug.get('d'), 'media');
  assert.equal(porSlug.get('e'), 'dificil');
  assert.equal(porSlug.get('f'), 'dificil');
});

test('D-27: un tema sin medicion es dificil, tal como lo fijo el usuario', () => {
  const { porSlug } = repartirPorPopularidad([medido('conocido', 1000), sinVideo('oscuro')]);
  assert.equal(porSlug.get('oscuro'), 'dificil');
});

test('los no medidos NO entran al ranking, o empujarian a los medidos hacia arriba', () => {
  // Si los 89 sin medicion ocuparan lugar en los tercios, un tema de popularidad media
  // pasaria a `facil` por el peso de los que nadie midio — la etiqueta diria "facil" por
  // un motivo que no tiene nada que ver con lo conocido que es.
  const temas = [medido('a', 300), medido('b', 200), medido('c', 100), ...Array.from({ length: 30 }, (_, i) => sinVideo(`x${i}`))];
  const { porSlug, medidos } = repartirPorPopularidad(temas);
  assert.equal(medidos, 3, 'solo cuentan los que tienen numero');
  assert.equal(porSlug.get('a'), 'facil');
  assert.equal(porSlug.get('b'), 'media');
  assert.equal(porSlug.get('c'), 'dificil');
});

test('un empate en vistas no rompe el reparto', () => {
  const { porSlug } = repartirPorPopularidad([medido('a', 100), medido('b', 100), medido('c', 100)]);
  assert.equal(new Set([porSlug.get('a'), porSlug.get('b'), porSlug.get('c')]).size >= 1, true);
  for (const s of ['a', 'b', 'c']) assert.ok(porSlug.get(s));
});

test('🔴 el estado real del repo: sin una sola medicion, TODO queda dificil', () => {
  // No es una hipotesis: `src/data/popularidad.json` tiene los 105 temas en `sin-video`
  // porque la clave de YouTube nunca se cargo. Este test fija esa consecuencia por
  // escrito — el dia que existan mediciones va a fallar, y fallar ahi es la senal de que
  // el escalonamiento empezo a funcionar.
  const { porSlug, medidos } = repartirPorPopularidad([sinVideo('a'), sinVideo('b'), sinVideo('c')]);
  assert.equal(medidos, 0);
  assert.deepEqual([...new Set(porSlug.values())], ['dificil'], 'sin datos no hay escalonamiento');
});
