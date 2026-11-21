/** La región viva de `anunciar.ts` (`T-534`), sin navegador: un nodo de mentira que anota. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { REPETIDO, hacerRegion, type NodoDeAnuncio } from './anunciar.ts';

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

test('decir lo mismo dos, tres, cuatro veces: el texto de la region cambia cada vez', () => {
  // Una region viva anuncia cuando su texto CAMBIA. Si dos escrituras seguidas dejan el mismo
  // texto, la segunda no se escucha: aca ninguna escritura repite a la anterior.
  const d = nodoDeMentira();
  const decir = hacerRegion(d.nodo);
  for (let i = 0; i < 4; i += 1) decir('No era esa.');
  assert.equal(d.escrituras.length, 4, 'una escritura por anuncio, sin vaciar en el medio');
  for (let i = 1; i < d.escrituras.length; i += 1) {
    assert.notEqual(d.escrituras[i], d.escrituras[i - 1], `el anuncio ${i + 1} dejo el mismo texto`);
  }
});

test('el repetido se lee igual: lo unico que cambia es un espacio duro al final', () => {
  const d = nodoDeMentira();
  const decir = hacerRegion(d.nodo);
  decir('No era esa.');
  decir('No era esa.');
  assert.equal(d.nodo.textContent, `No era esa.${REPETIDO}`);
  assert.equal(REPETIDO.trim(), '', 'la marca tiene que ser solo espacio');
  decir('Era Nueva Roma.');
  assert.equal(d.nodo.textContent, 'Era Nueva Roma.', 'un texto nuevo va limpio');
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
