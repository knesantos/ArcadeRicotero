import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  azarConSemilla,
  nuevaPartida,
  responder,
  siguientePaso,
  valorDeReferencia,
  type Dato,
  type Familia,
} from './partida.ts';

/**
 * La partida, sobre un pozo de juguete con la forma del de verdad: siete familias de
 * tamaños muy distintos (una de 40 duraciones contra una de 3 datos de la banda), que es
 * justo el caso en que un sorteo por dato taparía a la familia chica.
 */

function dato(id: string, familia: Familia, medida: string, valor: number, escala: Dato['escala'] = 'entero'): Dato {
  return { id, familia, medida, pregunta: `¿${id}?`, valor, escala, fuente: 'prueba' };
}

const POZO: readonly Dato[] = [
  dato('b1', 'la-banda', 'b1', 1976, 'anio'),
  dato('b2', 'la-banda', 'b2', 24),
  dato('b3', 'la-banda', 'b3', 2),
  dato('g1', 'la-gente', 'nacimiento', 1949, 'anio'),
  dato('g2', 'la-gente', 'nacimiento', 1952, 'anio'),
  dato('g3', 'la-gente', 'nacimiento', 1959, 'anio'),
  dato('r1', 'los-recitales', 'r1', 70000),
  dato('r2', 'los-recitales', 'r2', 21000),
  dato('d1', 'los-discos', 'anio-disco', 1985, 'anio'),
  dato('d2', 'los-discos', 'anio-disco', 1996, 'anio'),
  dato('d3', 'los-discos', 'anio-disco', 2000, 'anio'),
  ...Array.from({ length: 40 }, (_, i) => dato(`t${i}`, 'lo-que-dura', 'duracion', 60 + i * 9, 'segundos')),
  ...Array.from({ length: 20 }, (_, i) => dato(`v${i}`, 'en-vivo', 'en-vivo', 1 + i * 5)),
  ...Array.from({ length: 10 }, (_, i) => dato(`p${i}`, 'las-palabras', 'palabra', 2 + i * 3)),
];

/** Juega una partida entera acertando siempre, y devuelve los pasos. */
function jugarPerfecto(semilla: number): { pasos: ReturnType<typeof siguientePaso>[]; ganada: boolean } {
  const azar = azarConSemilla(semilla);
  const estado = nuevaPartida(POZO);
  const pasos = [];
  for (;;) {
    const paso = siguientePaso(estado, azar);
    if (!paso) break;
    pasos.push(paso);
    assert.equal(responder(estado, paso, paso.correcta), true);
  }
  return { pasos, ganada: estado.ganada };
}

test('ningún paso tiene empate, y "correcta" dice de verdad para qué lado está la respuesta', () => {
  for (const semilla of [1, 2, 3, 4, 5]) {
    for (const paso of jugarPerfecto(semilla).pasos) {
      const ref = valorDeReferencia(paso!.referencia);
      assert.notEqual(ref, paso!.dato.valor);
      assert.equal(paso!.correcta, paso!.dato.valor > ref ? 'mas' : 'menos');
    }
  }
});

test('dos pasos seguidos nunca son de la misma familia mientras haya otra', () => {
  const { pasos } = jugarPerfecto(8);
  for (let i = 1; i < pasos.length; i++) {
    const antes = pasos[i - 1]!.dato.familia;
    const ahora = pasos[i]!.dato.familia;
    if (antes !== ahora) continue;
    // Solo se permite repetir cuando la otra familia ya no tiene datos libres.
    const quedan = new Set(pasos.slice(i).map((p) => p!.dato.familia));
    assert.equal(quedan.size, 1, `paso ${i}: ${ahora} dos veces con otras familias vivas`);
  }
});

test('cada familia pesa lo mismo: en los primeros siete pasos salen las siete, una vez cada una', () => {
  // Con sorteo por dato, `lo-que-dura` (40 de 84) coparía los primeros pasos; con sorteo de
  // familia de a una, alguna quedaba sin salir (el primer intento, que este test cazó). Con
  // el mazo, cada vuelta pasa por todas.
  for (let semilla = 1; semilla <= 50; semilla++) {
    const primeros = jugarPerfecto(semilla).pasos.slice(0, 7);
    const distintas = new Set(primeros.map((p) => p!.dato.familia));
    assert.equal(distintas.size, 7, `semilla ${semilla}: ${[...distintas].join(', ')}`);
  }
});

test('un dato usado no vuelve, tampoco el que fue referencia de un par', () => {
  for (const semilla of [9, 10, 11]) {
    const vistos = new Set<string>();
    for (const paso of jugarPerfecto(semilla).pasos) {
      for (const id of [paso!.dato.id, ...(paso!.referencia.clase === 'par' ? [paso!.referencia.dato.id] : [])]) {
        assert.ok(!vistos.has(id), `${id} volvió`);
        vistos.add(id);
      }
    }
  }
});

test('el par enfrenta solo datos de la misma medida; una medida propia no va nunca en par', () => {
  let pares = 0;
  for (let semilla = 1; semilla <= 20; semilla++) {
    for (const paso of jugarPerfecto(semilla).pasos) {
      if (paso!.referencia.clase !== 'par') continue;
      pares++;
      assert.equal(paso!.referencia.dato.medida, paso!.dato.medida);
      assert.notEqual(paso!.dato.medida, paso!.dato.id, `${paso!.dato.id} tiene medida propia y fue en par`);
    }
  }
  assert.ok(pares > 0, 'con este pozo tiene que haber pares');
});

test('si se acaban las preguntas, ganaste: la partida perfecta termina ganada y usa el pozo entero', () => {
  const { pasos, ganada } = jugarPerfecto(12);
  assert.equal(ganada, true);
  const usados = pasos.reduce((n, p) => n + (p!.referencia.clase === 'par' ? 2 : 1), 0);
  assert.equal(usados, POZO.length);
});

test('un error corta, y la racha es lo que se acertó antes', () => {
  const azar = azarConSemilla(13);
  const estado = nuevaPartida(POZO);
  for (let i = 0; i < 4; i++) {
    const paso = siguientePaso(estado, azar)!;
    responder(estado, paso, paso.correcta);
  }
  const paso = siguientePaso(estado, azar)!;
  assert.equal(responder(estado, paso, paso.correcta === 'mas' ? 'menos' : 'mas'), false);
  assert.equal(estado.racha, 4);
  assert.equal(estado.terminada, true);
  assert.equal(estado.ganada, false);
  assert.equal(siguientePaso(estado, azar), null);
  assert.throws(() => responder(estado, paso, 'mas'));
});

test('la misma semilla da la misma partida', () => {
  const a = jugarPerfecto(42).pasos.map((p) => `${p!.dato.id}:${valorDeReferencia(p!.referencia)}`);
  const b = jugarPerfecto(42).pasos.map((p) => `${p!.dato.id}:${valorDeReferencia(p!.referencia)}`);
  assert.deepEqual(a, b);
});

test('un pozo con ids repetidos no arranca', () => {
  assert.throws(() => nuevaPartida([POZO[0]!, POZO[0]!]), /repetido/);
});
