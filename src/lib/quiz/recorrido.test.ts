/**
 * Lo que ya pasó en una partida: historial, racha, escalones y lo que se comparte (`D-71`).
 *
 * El riel del tablero, el sello de la racha y la planilla del resultado salen de acá. Si
 * esto miente, la pantalla le cuenta al jugador una partida que no jugó.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { comenzar, responder } from './vidas.ts';
import { escalones, historial, racha, respondidasPorEscalon } from './recorrido.ts';
import { planillaParaCompartir, RACHAS } from './copy.ts';
import type { Jugable } from './ronda.ts';
import type { Dificultad } from './banco.ts';

function bancoFalso(faciles: number, medias: number, dificiles: number): Jugable[] {
  const hacer = (d: Dificultad, n: number): Jugable[] =>
    Array.from({ length: n }, (_, i) => ({
      id: `${d}-${i}`,
      dificultad: d,
      opciones: [
        { texto: `bien-${d}-${i}`, correcta: true },
        { texto: `mal-${d}-${i}`, correcta: false },
        { texto: `otra-${d}-${i}`, correcta: false },
        { texto: `nada-${d}-${i}`, correcta: false },
      ],
    }));
  return [...hacer('facil', faciles), ...hacer('media', medias), ...hacer('dificil', dificiles)];
}

const azarFijo = () => 0.42;

/** Juega la partida con un plan de aciertos (true) y errores (false). */
function jugar(plan: readonly boolean[], banco = bancoFalso(3, 2, 2)) {
  let p = comenzar(banco, azarFijo);
  for (const acertar of plan) {
    const item = p.orden[p.indice]!;
    const opcion = item.opciones.find((o) => o.correcta === acertar)!;
    p = responder(p, opcion.texto);
  }
  return p;
}

test('el historial dice qué se acertó, en orden, y nada de lo que no se jugó', () => {
  assert.deepEqual(historial(jugar([])), []);
  assert.deepEqual(historial(jugar([true, false, true])), [true, false, true]);
});

test('la racha cuenta los aciertos del final, y un error la corta', () => {
  assert.equal(racha(jugar([])), 0);
  assert.equal(racha(jugar([true, true])), 2);
  assert.equal(racha(jugar([true, true, false])), 0);
  assert.equal(racha(jugar([true, false, true, true, true])), 3);
});

test('la racha que se estampa existe en el copy para 3, 5 y 10', () => {
  for (const n of [3, 5, 10]) assert.ok(RACHAS[n], `falta la racha de ${n}`);
});

test('los escalones salen del banco: su largo es el del pozo, en orden', () => {
  const p = jugar([], bancoFalso(3, 2, 4));
  const e = escalones(p);
  assert.deepEqual(e.map((g) => g.nivel), ['facil', 'media', 'dificil']);
  assert.deepEqual(e.map((g) => g.indices.length), [3, 2, 4]);
  assert.deepEqual(e.flatMap((g) => g.indices), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
});

test('lo respondido por escalón no inventa casillas para lo que no se jugó', () => {
  const p = jugar([true, false, true, true]);
  assert.deepEqual(respondidasPorEscalon(p), [[true, false, true], [true], []]);
});

test('la planilla compartida: un símbolo por respuesta, un espacio por escalón, sin vacíos', () => {
  assert.equal(planillaParaCompartir([[true, false, true], [true], []]), '◆✕◆ ◆');
  assert.equal(planillaParaCompartir([]), '');
  // Los dos símbolos son de texto, no emoji: ninguno lleva selector de presentación.
  assert.ok(!/[️]/.test(planillaParaCompartir([[true, false]])));
});
