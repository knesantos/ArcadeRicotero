import { test } from 'node:test';
import assert from 'node:assert/strict';
import { plantaDeLaHoja, cuerpoDelTitulo, ALTO_MINIMO, CUERPO_TEMA, FRANJA_HOJA, AIRE_HOJA } from './hoja.ts';
import { MAX_TEMAS_RECITAL, MAX_BISES_RECITAL, MIN_TEMAS_RECITAL } from './armado.ts';

/** Todas las listas que el juego deja cerrar. */
function* todasLasListas(): Generator<[number, number]> {
  for (let lista = MIN_TEMAS_RECITAL; lista <= MAX_TEMAS_RECITAL; lista++) {
    for (let bises = 0; bises <= MAX_BISES_RECITAL; bises++) yield [lista, bises];
  }
}

test('la hoja del recital: la letra nunca sale del piso ni del techo', () => {
  for (const [lista, bises] of todasLasListas()) {
    const p = plantaDeLaHoja(lista, bises);
    assert.ok(p.cuerpo >= CUERPO_TEMA.piso && p.cuerpo <= CUERPO_TEMA.techo, `${lista}+${bises}: cuerpo ${p.cuerpo}`);
  }
});

test('la hoja del recital: nada se pisa, y el pie queda adentro del papel', () => {
  for (const [lista, bises] of todasLasListas()) {
    const p = plantaDeLaHoja(lista, bises);
    const renglones = [...p.yLista, ...p.yBises];
    assert.equal(renglones.length, lista + bises);
    for (let k = 1; k < renglones.length; k++) {
      assert.ok(renglones[k]! - renglones[k - 1]! >= p.cuerpo, `${lista}+${bises}: el renglón ${k} pisa al anterior`);
    }
    const ultimo = renglones.at(-1)! + p.paso;
    assert.ok(ultimo <= p.yPie, `${lista}+${bises}: el último renglón (${ultimo}) pisa el pie (${p.yPie})`);
    assert.ok(p.yPie < p.alto - FRANJA_HOJA - AIRE_HOJA, `${lista}+${bises}: el pie se sale del papel`);
    assert.ok(p.alto >= ALTO_MINIMO);
    if (bises > 0) {
      assert.ok(p.yCorte !== null && p.yCorte >= p.yLista.at(-1)! + p.cuerpo && p.yCorte < p.yBises[0]!, `${lista}+${bises}: el corte no va entre la lista y los bises`);
    } else assert.equal(p.yCorte, null);
  }
});

test('la hoja del recital: la lista corta agranda la letra y la larga alarga la hoja', () => {
  const corta = plantaDeLaHoja(MIN_TEMAS_RECITAL, 0);
  const larga = plantaDeLaHoja(MAX_TEMAS_RECITAL, MAX_BISES_RECITAL);
  assert.equal(corta.alto, ALTO_MINIMO);
  assert.ok(corta.cuerpo > larga.cuerpo);
  assert.ok(larga.alto > ALTO_MINIMO);
  assert.equal(larga.cuerpo, CUERPO_TEMA.piso);
});

test('la hoja del recital: entre la lista y los bises no queda más aire que el corte', () => {
  // Es el defecto de la planta prestada de la lámina: media hoja en blanco antes de los bises.
  for (const [lista, bises] of todasLasListas()) {
    if (bises === 0) continue;
    const p = plantaDeLaHoja(lista, bises);
    const hueco = p.yBises[0]! - (p.yLista.at(-1)! + p.paso);
    assert.ok(hueco <= 100, `${lista}+${bises}: ${hueco} px entre la lista y los bises`);
  }
});

test('un título largo se achica hasta el piso y no más', () => {
  assert.equal(cuerpoDelTitulo(500, 800, 50), 50);
  assert.equal(cuerpoDelTitulo(1000, 800, 50), 40);
  assert.equal(cuerpoDelTitulo(4000, 800, 50), 31);
});
