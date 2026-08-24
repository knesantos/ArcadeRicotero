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

test('las opciones se barajan: tocar siempre la primera no puede ganar', () => {
  // El defecto que aparecio al jugar la primera partida: 25 de 30 items tenian la
  // respuesta correcta en la posicion 1. Tocando siempre arriba se sacaba 83%.
  let aciertosTocandoLaPrimera = 0;
  const RONDAS = 500;
  for (let s = 0; s < RONDAS; s++) {
    const ronda = armarRonda(BANCO_REAL, 8, azarSemilla(s));
    const elegidas = ronda.map((i) => i.opciones[0]!.texto);
    aciertosTocandoLaPrimera += contarAciertos(ronda, elegidas);
  }
  const tasa = aciertosTocandoLaPrimera / (RONDAS * 8);
  // Con 4 opciones barajadas, tocar siempre la primera tiene que rendir ~25% (BR-04),
  // no 83%. Margen generoso para no volver el test fragil.
  assert.ok(tasa < 0.35, `tocando siempre la primera se saca ${(tasa * 100).toFixed(1)}%, deberia rondar 25%`);
  assert.ok(tasa > 0.15, `tasa sospechosamente baja: ${(tasa * 100).toFixed(1)}%`);
});

test('barajar no pierde ni duplica opciones, y deja exactamente una correcta', () => {
  for (let s = 0; s < 200; s++) {
    for (const it of armarRonda(BANCO_REAL, 8, azarSemilla(s))) {
      assert.equal(it.opciones.length, 4, 'BR-04: dejaron de ser 4 opciones');
      assert.equal(it.opciones.filter((o) => o.correcta).length, 1, 'no quedo exactamente una correcta');
      assert.equal(new Set(it.opciones.map((o) => o.texto)).size, 4, 'hay opciones duplicadas');
    }
  }
});

test('la correcta no cae siempre en la misma posicion', () => {
  const posiciones = new Set<number>();
  for (let s = 0; s < 200; s++) {
    for (const it of armarRonda(BANCO_REAL, 8, azarSemilla(s))) {
      posiciones.add(it.opciones.findIndex((o) => o.correcta));
    }
  }
  assert.deepEqual([...posiciones].sort(), [0, 1, 2, 3], 'la correcta no aparece en las 4 posiciones');
});

// ---------------------------------------------------------------------------
// El defecto del ciclo 7: la ronda se llenaba de faciles y el banco moria adentro.
// ---------------------------------------------------------------------------

test('la ronda no se llena de faciles: los tres niveles salen en la proporcion del piso', () => {
  // 8 preguntas repartidas como el piso de US-01 (10/15/15) => 2 faciles, 3 medias, 3 dificiles.
  const ronda = armarRonda(BANCO_REAL, 8, azarSemilla(7));
  const porNivel: Record<Dificultad, number> = { facil: 0, media: 0, dificil: 0 };
  for (const it of ronda) porNivel[it.dificultad]++;
  assert.deepEqual(porNivel, { facil: 2, media: 3, dificil: 3 });
});

test('sobre 300 rondas del banco real, ningun nivel y ninguna categoria queda en cero', () => {
  // La version vieja daba 2.400 faciles sobre 2.400 preguntas: `letras` no salia nunca.
  const porNivel: Record<string, number> = {};
  const porCategoria: Record<string, number> = {};
  for (let i = 0; i < 300; i++) {
    for (const it of armarRonda(BANCO_REAL, 8, azarSemilla(i))) {
      porNivel[it.dificultad] = (porNivel[it.dificultad] ?? 0) + 1;
      porCategoria[it.categoria] = (porCategoria[it.categoria] ?? 0) + 1;
    }
  }
  for (const nivel of ['facil', 'media', 'dificil']) {
    assert.ok((porNivel[nivel] ?? 0) > 0, `el nivel ${nivel} no salio nunca en 300 rondas`);
  }
  for (const categoria of ['historia', 'discos', 'letras', 'mitologia']) {
    assert.ok(
      (porCategoria[categoria] ?? 0) > 0,
      `la categoria ${categoria} no salio nunca en 300 rondas`,
    );
  }
});

test('US-01 criterio 1: toda ronda cubre al menos 2 de las 4 categorias', () => {
  for (let i = 0; i < 200; i++) {
    const cubiertas = new Set(armarRonda(BANCO_REAL, 8, azarSemilla(i)).map((it) => it.categoria));
    assert.ok(cubiertas.size >= 2, `la ronda ${i} cubre ${cubiertas.size} categoria(s)`);
  }
});

test('con un banco desparejo la ronda sigue teniendo el largo pedido', () => {
  // 6 faciles y 2 dificiles: el cupo de medias no existe y se lo reparten los otros dos.
  const desparejo = [
    ...['f1', 'f2', 'f3', 'f4', 'f5', 'f6'].map((id) => item(id, 'facil')),
    ...['d1', 'd2'].map((id) => item(id, 'dificil')),
  ];
  const ronda = armarRonda(desparejo, 8, azarSemilla(3));
  assert.equal(ronda.length, 8);
  assert.ok(cumpleBR01(ronda), 'una ronda de banco desparejo tiene que seguir cumpliendo BR-01');
});

test('una ronda de un solo item sigue arrancando facil', () => {
  const mezcla = [item('f1', 'facil'), item('m1', 'media'), item('d1', 'dificil')];
  assert.equal(armarRonda(mezcla, 1, azarSemilla(1))[0]!.dificultad, 'facil');
});
