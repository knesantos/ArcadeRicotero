/** La región viva de `anunciar.ts` (`T-534`), sin navegador: un nodo de mentira que anota. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { hacerRegion, type NodoDeAnuncio } from './anunciar.ts';

function nodoDeMentira() {
  const atributos = new Map<string, string>();
  const escrituras: (string | null)[] = [];
  let texto: string | null = null;
  const nodo: NodoDeAnuncio = {
    className: '',
    get textContent() {
      return texto;
    },
    set textContent(t: string | null) {
      texto = t;
      escrituras.push(t);
    },
    setAttribute: (n, v) => void atributos.set(n, v),
  };
  return { nodo, atributos, escrituras };
}

test('la region nace vacia, viva y escondida de la vista', () => {
  const d = nodoDeMentira();
  hacerRegion(d.nodo);
  assert.equal(d.nodo.className, 'solo-lector');
  assert.equal(d.atributos.get('role'), 'status');
  assert.equal(d.atributos.get('aria-live'), 'polite');
  assert.equal(d.nodo.textContent, null);
});

test('decir escribe el texto en la region', () => {
  const d = nodoDeMentira();
  const decir = hacerRegion(d.nodo);
  decir('No era Ji ji ji.');
  decir('¡La sacaste! Era Nueva Roma. 100 puntos.');
  assert.equal(d.nodo.textContent, '¡La sacaste! Era Nueva Roma. 100 puntos.');
});

test('decir lo mismo dos veces lo vuelve a decir: el texto se vacia antes', () => {
  const d = nodoDeMentira();
  const decir = hacerRegion(d.nodo);
  decir('No era esa.');
  decir('No era esa.');
  assert.deepEqual(d.escrituras, ['', 'No era esa.', '', 'No era esa.']);
});

test('la clase que la esconde existe en la hoja de los juegos', () => {
  const css = readFileSync('src/styles/juego.css', 'utf-8');
  assert.match(css, /^\.solo-lector\s*\{/m);
});

test('"Adiviná el tema" anuncia la revelacion y el intento errado', () => {
  // Si una reescritura de la isla pierde el enganche, lo de arriba sigue verde y nadie escucha.
  const fuente = readFileSync('src/scripts/partida-tema.ts', 'utf-8');
  assert.match(fuente, /anunciador\(/);
  assert.match(fuente, /anuncioRevelacion\(/);
  assert.match(fuente, /anuncioErrado\(/);
});
