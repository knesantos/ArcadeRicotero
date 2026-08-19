import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { armarRonda, cumpleBR01, contarAciertos, RondaImposible } from './ronda.ts';
import { cargarBanco, type BancoCrudo, type Dificultad, type Item } from './banco.ts';

/** Azar determinista, para que un fallo se pueda reproducir. */
function azarSemilla(semilla: number): () => number {
  let s = semilla >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function item(id: string, dificultad: Dificultad): Item {
  return {
    id,
    categoria: 'discos',
    dificultad,
    enunciado: `Enunciado ${id}`,
    opciones: [
      { texto: 'A', correcta: true },
      { texto: 'B', correcta: false },
      { texto: 'C', correcta: false },
      { texto: 'D', correcta: false },
    ],
    explicacion: 'Explicacion.',
    clase: 'hecho',
  };
}

const BANCO_REAL = cargarBanco(JSON.parse(readFileSync('src/data/quiz.json', 'utf-8')) as BancoCrudo);

test('BR-01 sobre el banco real: 1000 rondas y el primero siempre es facil', () => {
  for (let s = 0; s < 1000; s++) {
    const ronda = armarRonda(BANCO_REAL, 8, azarSemilla(s));
    assert.equal(ronda.length, 8, `semilla ${s}: la ronda no tiene 8`);
    assert.equal(ronda[0]!.dificultad, 'facil', `semilla ${s}: el primero no es facil`);
    assert.ok(cumpleBR01(ronda), `semilla ${s}: la dificultad baja en algun punto`);
  }
});

test('BR-01 punto 3: el primer item no es siempre el mismo', () => {
  const primeros = new Set<string>();
  for (let s = 0; s < 300; s++) primeros.add(armarRonda(BANCO_REAL, 8, azarSemilla(s))[0]!.id);
  // El banco tiene 10 faciles. Si saliera siempre el mismo, esto seria 1 y BR-01 punto 3
  // estaria incumplido: "no es escalonamiento, es una vidriera fija".
  assert.ok(primeros.size >= 5, `solo ${primeros.size} items distintos abrieron la partida`);
});

test('ninguna ronda repite un item', () => {
  for (let s = 0; s < 200; s++) {
    const ronda = armarRonda(BANCO_REAL, 8, azarSemilla(s));
    assert.equal(new Set(ronda.map((i) => i.id)).size, ronda.length, `semilla ${s}: item repetido`);
  }
});

test('dos rondas seguidas no son identicas', () => {
  const firmas = new Set<string>();
  for (let s = 0; s < 50; s++) firmas.add(armarRonda(BANCO_REAL, 8, azarSemilla(s)).map((i) => i.id).join());
  assert.ok(firmas.size > 40, `solo ${firmas.size} rondas distintas de 50`);
});

test('cumpleBR01 detecta una ronda que arranca dificil', () => {
  assert.equal(cumpleBR01([item('a', 'media'), item('b', 'dificil')]), false);
});

test('cumpleBR01 detecta que la dificultad baje', () => {
  assert.equal(cumpleBR01([item('a', 'facil'), item('b', 'dificil'), item('c', 'media')]), false);
  assert.equal(cumpleBR01([item('a', 'facil'), item('b', 'media'), item('c', 'dificil')]), true);
});

test('sin items faciles no se arma ronda: falla ruidoso, no sirve un muro', () => {
  const sinFaciles = [item('a', 'media'), item('b', 'media'), item('c', 'dificil')];
  assert.throws(() => armarRonda(sinFaciles, 2, azarSemilla(1)), RondaImposible);
});

test('un banco mas chico que la ronda falla en vez de servir menos preguntas', () => {
  assert.throws(() => armarRonda([item('a', 'facil')], 8, azarSemilla(1)), RondaImposible);
});

test('contarAciertos cuenta bien, incluida la respuesta en blanco', () => {
  const ronda = armarRonda(BANCO_REAL, 4, azarSemilla(7));
  const todasBien = ronda.map((i) => i.opciones.find((o) => o.correcta)!.texto);
  assert.equal(contarAciertos(ronda, todasBien), 4);
  assert.equal(contarAciertos(ronda, [null, null, null, null]), 0);
  assert.equal(contarAciertos(ronda, [todasBien[0]!, 'no existe', null, todasBien[3]!]), 2);
});
