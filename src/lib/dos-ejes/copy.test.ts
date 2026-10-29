/**
 * El texto que oye el lector de pantalla en el plano de dos ejes (`RESULTADO.altPlano`,
 * `T-352`, `CNT-31` §13).
 *
 * `voz.test.ts` barre las funciones del copy llamándolas con comodines, y `altPlano` recibe un
 * objeto: con un comodín revienta, el `catch` se la traga y la cadena queda fuera del barrido.
 * Es la cadena más larga del resultado y la única que solo oye quien usa lector, así que acá se
 * la llama con los datos de verdad: cada una de las cuatro maneras como la tuya, sin enlace, con
 * la misma y con cada una de las otras tres (veinte llamadas, ninguna depende del azar).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { RESULTADO, EJES, POLOS, textoDelPlano } from './copy.ts';
import { planoFijo, type Banco } from './partida.ts';

const BANCO = JSON.parse(readFileSync('src/data/dos-ejes.json', 'utf-8')) as Banco;

const plano = (t: string): string =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');

/** El texto de la tuya en el lugar `k` y el enlace en `j`, con la misma función que usa la isla. */
function lo(k: number, j: number | null): { texto: string; tuya: string; suya: string | null } {
  const { celdas } = planoFijo(BANCO);
  const texto = textoDelPlano(BANCO, celdas[k]!.id, j === null ? undefined : celdas[j]!.id);
  return { texto, tuya: celdas[k]!.nombre, suya: j === null || j === k ? null : celdas[j]!.nombre };
}

const CASOS = [0, 1, 2, 3].flatMap((k) => [null, 0, 1, 2, 3].map((j) => ({ k, j, ...lo(k, j) })));

test('el texto del plano se arma en los veinte casos', () => {
  assert.equal(CASOS.length, 20);
});

test('sin números ni comparaciones: el plano no mide (US-06 criterio 9, BR-17)', () => {
  for (const { texto } of CASOS) {
    assert.ok(!/\d/.test(texto), texto);
    assert.ok(!/\b(mejor|peor|primera|ultima|mas)\b/.test(plano(texto)), texto);
  }
});

test('registro 3: seco, sin suspensivos ni gritos, y bien puntuado', () => {
  for (const { texto } of CASOS) {
    assert.ok(!/…|\.\.\.|[!¡;]/.test(texto), texto);
    assert.ok(!/\.\.|,,|:\.|  /.test(texto), texto);
    assert.ok(texto.endsWith('.'), texto);
  }
});

test('dice los dos ejes enteros y el nombre de la tuya', () => {
  for (const { texto, tuya } of CASOS) {
    for (const p of ['luz', 'oscuridad', 'orden', 'caos'] as const) {
      assert.ok(texto.includes(`${EJES[p]}, ${POLOS[p]}`), `${p} en: ${texto}`);
    }
    assert.ok(texto.includes(tuya), texto);
  }
});

test('la del enlace: la misma no repite el nombre; otra dice el suyo', () => {
  for (const { texto, k, j, suya } of CASOS) {
    if (j === null) assert.ok(!/quien te lo mand/.test(texto), texto);
    else if (j === k) {
      assert.ok(texto.endsWith('La de quien te lo mandó es la misma.'), texto);
    } else {
      assert.ok(texto.includes(suya!), texto);
      assert.ok(!/es la misma/.test(texto), texto);
    }
  }
});

test('sin anglicismos ni folleto, y la gente no es "los fans" (D-17, voz-ricotera §7)', () => {
  const glosario = /\b(feedback|reveal|display|quiz|link|score|player|gaming|ranking|challenge|share|tips?|loading|hint|combo|streak|highscore|tier|list|top)\b/;
  const gente = /\b(los fans|las? usuarios?|los? usuarios?|nuestra comunidad)\b/;
  for (const { texto } of CASOS) {
    assert.ok(!glosario.test(plano(texto)), texto);
    assert.ok(!gente.test(plano(texto)), texto);
  }
});

test('cada lugar dice el rincón donde planoFijo pone la celda (CTR-08 E2.4 b)', () => {
  // Si alguien cruza dos cadenas de `RESULTADO.lugares`, el lector dice un rincón equivocado y
  // ningún otro test se pone en rojo: el texto sigue siendo seco, sin números y bien puntuado.
  const { celdas, renglones, columnas } = planoFijo(BANCO);
  celdas.forEach((c, k) => {
    const vertical = c.luzOscuridad === renglones[0] ? 'arriba' : 'abajo';
    const horizontal = c.ordenCaos === columnas[0] ? 'izquierda' : 'derecha';
    assert.equal(RESULTADO.lugares[k], `${vertical} a la ${horizontal}`, c.id);
  });
});

test('una manera que no está en el plano no se dice: falla fuerte', () => {
  assert.throws(() => textoDelPlano(BANCO, 'CU-9'));
});
