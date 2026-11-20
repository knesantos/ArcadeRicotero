/**
 * La guarda del rebote (`T-534`), probada sin navegador: un despacho de mentira que hace lo
 * que hace el DOM —primero la captura del contenedor, después el oyente del botón— y un
 * reloj que se mueve a mano.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { GRACIA_MS, esRebote, frenoDeRebote, type Toque } from './rebote.ts';

/** Una lista con un botón adentro, y un `click` que baja por captura como en el DOM. */
function escena(reloj = { ms: 1000 }) {
  const ahora = () => reloj.ms;
  const captura = frenoDeRebote(ahora);
  let respuestas = 0;
  // El oyente del botón es `{ once: true }`, como en las islas: si corre, se gasta.
  let oyenteDelBoton: (() => void) | null = () => {
    respuestas += 1;
  };
  function tocar(detail: number): void {
    let frenado = false;
    const ev: Toque = {
      detail,
      stopImmediatePropagation: () => {
        frenado = true;
      },
      preventDefault: () => {},
    };
    captura(ev);
    if (frenado) return;
    const o = oyenteDelBoton;
    oyenteDelBoton = null;
    o?.();
  }
  return {
    reloj,
    pasar: (ms: number) => {
      reloj.ms += ms;
    },
    tocar,
    respuestas: () => respuestas,
  };
}

test('el segundo toque de un doble toque no contesta la pregunta nueva', () => {
  const e = escena();
  e.pasar(150);
  e.tocar(1);
  assert.equal(e.respuestas(), 0);
});

test('el toque frenado no gasta el oyente: pasado el plazo, el mismo boton responde', () => {
  const e = escena();
  e.pasar(50);
  e.tocar(1);
  e.pasar(GRACIA_MS);
  e.tocar(1);
  assert.equal(e.respuestas(), 1);
});

test('el plazo es el declarado: un milisegundo antes frena, justo en el plazo deja pasar', () => {
  const antes = escena();
  antes.pasar(GRACIA_MS - 1);
  antes.tocar(1);
  assert.equal(antes.respuestas(), 0);

  const justo = escena();
  justo.pasar(GRACIA_MS);
  justo.tocar(1);
  assert.equal(justo.respuestas(), 1);
});

test('el teclado y el lector de pantalla pasan siempre, aun adentro del plazo', () => {
  const e = escena();
  e.pasar(10);
  e.tocar(0);
  assert.equal(e.respuestas(), 1);
});

test('el plazo corre desde que se arma cada lista, no desde la primera', () => {
  const primera = escena();
  primera.pasar(5000);
  // Pregunta nueva: lista nueva, guarda nueva, sobre el mismo reloj.
  const segunda = escena(primera.reloj);
  segunda.pasar(100);
  segunda.tocar(1);
  assert.equal(segunda.respuestas(), 0);
});

test('esRebote: la regla, sola', () => {
  assert.equal(esRebote(1, 0), true);
  assert.equal(esRebote(2, 399), true);
  assert.equal(esRebote(1, 400), false);
  assert.equal(esRebote(0, 0), false);
  assert.equal(esRebote(1, 100, 50), false);
});

test('el plazo cubre el doble toque y no llega a sentirse como un boton muerto', () => {
  assert.ok(GRACIA_MS >= 300, 'un doble toque llega hasta los 300 ms');
  assert.ok(GRACIA_MS <= 500, 'mas de medio segundo ya se siente como un boton muerto');
});

test('las dos islas con Seguí sobre la opcion D enganchan la guarda', () => {
  // Si una reescritura de la isla pierde el enganche, la guarda sigue verde y no protege nada.
  for (const isla of ['partida.ts', 'partida-tapa.ts']) {
    const fuente = readFileSync(`src/scripts/${isla}`, 'utf-8');
    assert.match(fuente, /protegerDeRebote\(/, `${isla} no llama a protegerDeRebote`);
  }
});
