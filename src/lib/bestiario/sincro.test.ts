import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { COINCIDENCIA_MINIMA, TOLERANCIA_SEG, elegirVersion, renglonesDe, ubicarVerso } from './sincro.ts';
import { urlDeRecorteBestia } from '../audio/rutas-de-audio.ts';
import type { Bestiario } from './mapa.ts';

/**
 * El segundo de cada verso (`D-78`). Las letras de acá son inventadas: lo que se prueba es la
 * cuenta, no un tema.
 */

const LRC = ['[00:05.00]', '[00:12.50]El gato duerme sobre la radio', '[00:20.10]La radio canta sola', '[01:02.25]El gato duerme sobre la radio'].join('\n');

test('lee los renglones con tiempo y descarta los vacíos de tiempo', () => {
  const r = renglonesDe(`${LRC}\nsin tiempo`);
  assert.equal(r.length, 4);
  assert.equal(r[3]!.seg, 62.25);
  assert.equal(r[1]!.texto, 'el gato duerme sobre la radio');
});

test('ubica el verso en su primera aparición, sin importar tildes ni signos', () => {
  assert.deepEqual(ubicarVerso(LRC, '¡El gató duerme, sobre la radio!'), { seg: 12.5, coincidencia: 1 });
});

test('un verso que no está no se inventa un segundo', () => {
  assert.equal(ubicarVerso(LRC, 'Nada de esto suena en el tema'), null);
});

test('elige la versión de duración más parecida, y ninguna si todas se pasan de la tolerancia', () => {
  const v = (id: number, duration: number, syncedLyrics: string | null = LRC) => ({ id, duration, syncedLyrics });
  assert.equal(elegirVersion([v(1, 250), v(2, 240.4), v(3, 240.1, null)], 240)?.id, 2);
  assert.equal(elegirVersion([v(1, 240 + TOLERANCIA_SEG + 0.5)], 240), null);
});

// ---------------------------------------------------------------- el manifiesto

const leer = (ruta: string): unknown => JSON.parse(readFileSync(ruta, 'utf-8'));
const bestiario = leer('src/data/bestiario.json') as Bestiario;
const sincro = leer('src/data/bestiario-sincro.json') as {
  recortes: Array<{ id: string; tema: string; desdeSeg: number; coincidencia: number; difDuracionSeg: number }>;
};
const porId = new Map(bestiario.bestias.map((b) => [b.id, b]));

test('cada recorte sincronizado es de una bestia con verso, de su tema, y existe en disco', () => {
  for (const r of sincro.recortes) {
    const b = porId.get(r.id);
    assert.ok(b?.verso, `${r.id}: no es una bestia con verso`);
    assert.equal(r.tema, b.tema, `${r.id}: el recorte es de otro tema`);
    assert.ok(r.coincidencia >= COINCIDENCIA_MINIMA, `${r.id}: el verso no coincide lo suficiente`);
    assert.ok(Math.abs(r.difDuracionSeg) <= TOLERANCIA_SEG, `${r.id}: la versión de LRCLIB dura otra cosa`);
    assert.ok(existsSync(`public${urlDeRecorteBestia(r.id)}`), `${r.id}: falta el mp3`);
  }
});
