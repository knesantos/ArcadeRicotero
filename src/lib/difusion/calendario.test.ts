import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import { largoEnX, validar, type Calendario, type Posteo } from './calendario.ts';

const RUTA = 'Docs/DIFUSION/calendario.json';
const cal = JSON.parse(readFileSync(RUTA, 'utf-8')) as Calendario;

test('D-81: el calendario de las redes valida', () => {
  assert.deepEqual(validar(cal), []);
});

test('D-81: lo aprobado o en cola tiene sus piezas impresas', () => {
  // Una pieza que falta es un posteo que la cola no puede subir: la imagen tiene que estar
  // publicada en el sitio para que la herramienta la baje por URL.
  const faltan = cal.posteos
    .filter((p) => p.estado === 'aprobado' || p.estado === 'en-cola')
    .flatMap((p) => (p.pieza.video ? [`public/${p.pieza.video}`] : p.redes.map((r) => `public/redes/${p.id}-${r}.jpg`)))
    .filter((f) => !existsSync(f));
  assert.deepEqual(faltan, []);
});

const base: Posteo = {
  id: 'DIF-99',
  fecha: '2026-10-27T19:00:00-03:00',
  redes: ['x', 'instagram'],
  estado: 'borrador',
  x: 'Te suena una décima de segundo. https://fichinricotero.com.ar/',
  instagram: 'Te suena una décima de segundo. El enlace está en la bio.',
  enlace: 'https://fichinricotero.com.ar/',
  pieza: { disco: 'oktubre', titulo: 'Te suena una décima', bajada: 'Adiviná el tema' },
  alt: 'Una cinta de casete.',
};

test('un posteo bien armado pasa', () => {
  assert.deepEqual(validar({ posteos: [base] }), []);
});

test('un reel vive en redes/<id>.mp4 y en ningún otro lado', () => {
  assert.deepEqual(validar({ posteos: [{ ...base, pieza: { ...base.pieza, video: 'redes/DIF-99.mp4' } }] }), []);
  const errores = validar({ posteos: [{ ...base, pieza: { ...base.pieza, video: 'reels/otro.mp4' } }] });
  assert.match(errores.join(' '), /redes\/DIF-99\.mp4/);
});

test('X cuenta el enlace como 23', () => {
  assert.equal(largoEnX('ab https://fichinricotero.com.ar/juegos/adivinar-el-tema/'), 3 + 23);
});

test('se frenan los vicios de siempre', () => {
  const malo: Posteo = {
    ...base,
    x: '¡Descubrí el juego! #ricoteros 🔥 https://fichinricotero.com.ar/',
    instagram: 'Mirá https://fichinricotero.com.ar #a #b #c #d',
    pieza: { ...base.pieza, titulo: 'uno dos tres cuatro cinco seis siete ocho nueve' },
  };
  const errores = validar({ posteos: [malo, malo] }).join('\n');
  for (const esperado of ['hashtags', 'emoji', 'exclamación', 'bio', 'tres hashtags', 'ocho palabras', 'repetido'])
    assert.match(errores, new RegExp(esperado));
});
