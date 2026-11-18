import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { EFECTOS, GANANCIA_EFECTOS, TOPE_EFECTO_SEG, largoDe, sonarEfecto } from './efectos.ts';

test('ningún efecto de interfaz dura más que el tope', () => {
  for (const [nombre, ficha] of Object.entries(EFECTOS)) {
    assert.ok(largoDe(ficha) > 0, `${nombre} no suena nada`);
    assert.ok(largoDe(ficha) <= TOPE_EFECTO_SEG, `${nombre} dura ${largoDe(ficha)} s, más que el tope`);
  }
});

test('los efectos van bajos: muy por debajo de la música, que sale a ganancia 1', () => {
  assert.ok(GANANCIA_EFECTOS <= 0.2, 'la perilla de los efectos subió de 0,2');
  for (const [nombre, ficha] of Object.entries(EFECTOS)) {
    for (const parte of [...ficha.soplidos, ...ficha.caidas]) {
      assert.ok(parte.nivel > 0 && parte.nivel <= 1, `${nombre}: un nivel fuera de 0 a 1`);
    }
  }
});

test('sin el audio del sitio despierto no suena nada, y no rompe', () => {
  // En Node no hay `window`: es el mismo caso que una página donde nadie tocó "Empezá".
  assert.equal(sonarEfecto('tecla'), false);
});

test('no trae archivos ni crea un contexto propio: usa el del sitio, ya despierto', () => {
  const fuente = readFileSync(new URL('./efectos.ts', import.meta.url), 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.ok(!/\.mp3|\.ogg|\.wav|fetch\(/.test(fuente), 'los efectos de interfaz no bajan archivos');
  assert.ok(!/new\s+\w*AudioContext|contextoDeAudio\(/.test(fuente), 'efectos.ts no crea ni despierta el contexto');
  assert.ok(fuente.includes('contextoVivo()'), 'efectos.ts dejó de usar el contexto del sitio');
});
