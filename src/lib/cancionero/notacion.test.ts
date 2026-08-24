import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizarAcorde, normalizarAcordes } from './notacion.ts';

test('las siete raices latinas pasan a anglosajonas', () => {
  const esperado: Record<string, string> = {
    DO: 'C',
    RE: 'D',
    MI: 'E',
    FA: 'F',
    SOL: 'G',
    LA: 'A',
    SI: 'B',
  };
  for (const [latina, anglo] of Object.entries(esperado)) {
    assert.equal(normalizarAcorde(latina), anglo, `${latina} tendria que dar ${anglo}`);
  }
});

test('el sufijo del acorde se conserva entero', () => {
  // Los casos reales que trajo lacuerda.net con el cancionero del 2026-08-24.
  const casos: Record<string, string> = {
    LAm: 'Am',
    LA7: 'A7',
    LAm7: 'Am7',
    MIm: 'Em',
    MI7: 'E7',
    REb: 'Db',
    REm: 'Dm',
    RE7: 'D7',
    REsus: 'Dsus',
    SIb: 'Bb',
    SIm: 'Bm',
    SI7: 'B7',
    SOL7: 'G7',
  };
  for (const [latina, anglo] of Object.entries(casos)) {
    assert.equal(normalizarAcorde(latina), anglo);
  }
});

test('"Solo" NO es un acorde, aunque empiece con SOL', () => {
  // La trampa de todo esto: por prefijo daria "Go", que parece un acorde y no lo es.
  assert.equal(normalizarAcorde('Solo'), null);
  assert.equal(normalizarAcorde('Solo de saxo'), null);
  assert.equal(normalizarAcorde('Intro'), null);
  assert.equal(normalizarAcorde('Final'), null);
  assert.equal(normalizarAcorde('Estribillo'), null);
});

test('lo que ya viene en anglosajona no se toca', () => {
  for (const a of ['C', 'Am', 'F#m7', 'Bb', 'Am/G', 'C5', 'F#m7(5-)', 'G']) {
    assert.equal(normalizarAcorde(a), a);
  }
});

test('el bajo invertido sobrevive de los dos lados', () => {
  assert.equal(normalizarAcorde('LAm/SOL'), null, 'el bajo latino no esta soportado y se descarta antes que inventarlo');
  assert.equal(normalizarAcorde('LAm/G'), 'Am/G');
});

test('normalizarAcordes tira lo que no es acorde y no repite', () => {
  assert.deepEqual(normalizarAcordes(['LAm', 'Intro', 'SOL', 'Solo', 'LAm', 'G']), ['Am', 'G']);
  assert.deepEqual(normalizarAcordes([]), []);
  assert.deepEqual(normalizarAcordes([null, undefined, '', '   ']), []);
});

test('SOL se prueba antes que SI: si no, SOL nunca matchearia', () => {
  assert.equal(normalizarAcorde('SOL'), 'G');
  assert.equal(normalizarAcorde('SI'), 'B');
});
