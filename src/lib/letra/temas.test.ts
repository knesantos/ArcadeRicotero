import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerTemas, normalizarDuro, resolverTema, indiceDuro, ALIAS, DISCOS } from './temas.ts';

/**
 * El cruce de `D-13` es la única defensa del sitio contra el error demostrado de las
 * fuentes de fans: mezclar material del Indio solista y de Skay con el de la banda.
 * Si este archivo pasa, esa puerta cierra. Si falla, entra cualquier cosa.
 */

const TEMAS = leerTemas();

test('RES-20 da exactamente 105 temas', () => {
  assert.equal(TEMAS.length, 105);
});

test('ningún título arrastra la prosa de la ficha', () => {
  // El defecto que este archivo nació para atajar: la nota que sigue al tracklist se
  // pegaba al último título del bloque y lo volvía irreconocible.
  const sucios = TEMAS.filter(
    (t) => /[>*]|\d+:\d{2}|conseguí|Resuelve|volúmenes/.test(t.titulo) || t.titulo.length > 70,
  );
  assert.deepEqual(
    sucios.map((t) => `${t.disco}/${t.pista}: ${t.titulo}`),
    [],
    'hay títulos contaminados con texto que no es el nombre del tema',
  );
});

test('los diez discos están completos y con la cantidad de pistas que declara el schema', () => {
  const porDisco = new Map<string, number>();
  for (const t of TEMAS) porDisco.set(t.disco, (porDisco.get(t.disco) ?? 0) + 1);
  assert.deepEqual([...porDisco.keys()].sort(), [...DISCOS].sort());
  // Los máximos son los mismos que hace cumplir `letra.schema.json`.
  const esperado: Record<string, number> = {
    gulp: 12,
    oktubre: 9,
    'un-baion-para-el-ojo-idiota': 8,
    'bang-bang-estas-liquidado': 9,
    'la-mosca-y-la-sopa': 10,
    'lobo-suelto': 13,
    'cordero-atado': 12,
    luzbelito: 11,
    'ultimo-bondi-a-finisterre': 10,
    'momo-sampler': 11,
  };
  for (const [disco, n] of porDisco) assert.equal(n, esperado[disco], `${disco} trae ${n} pistas`);
});

test('las pistas de cada disco van de 1 a N sin huecos ni repetidos', () => {
  for (const disco of DISCOS) {
    const pistas = TEMAS.filter((t) => t.disco === disco)
      .map((t) => t.pista)
      .sort((a, b) => a - b);
    assert.deepEqual(pistas, [...pistas.keys()].map((i) => i + 1), `${disco} tiene pistas salteadas`);
  }
});

test('la normalización dura junta lo que la fuente parte', () => {
  assert.equal(normalizarDuro('Ji JiJi'), normalizarDuro('Jijiji'));
  assert.equal(normalizarDuro('Todo UnPalo'), normalizarDuro('Todo un palo'));
  assert.equal(normalizarDuro('JuguetesPerdidos'), normalizarDuro('Juguetes perdidos'));
  assert.equal(normalizarDuro('Divina TV Fuhrer'), normalizarDuro('Divina TV. Führer'));
});

test('cada alias apunta a un tema que existe entre los 105', () => {
  const indice = indiceDuro(TEMAS);
  for (const [fuente, canonico] of Object.entries(ALIAS)) {
    assert.ok(
      indice.has(normalizarDuro(canonico)),
      `el alias "${fuente}" apunta a "${canonico}", que no está en RES-20`,
    );
  }
});

test('ningún alias sobra: todos resuelven algo que la normalización sola no resuelve', () => {
  const indice = indiceDuro(TEMAS);
  const sobrantes = Object.keys(ALIAS).filter((f) => indice.has(normalizarDuro(f)));
  assert.deepEqual(sobrantes, [], 'estos alias son redundantes y confunden más de lo que ayudan');
});

test('resolverTema deja pasar lo de la banda y frena lo que no', () => {
  assert.equal(resolverTema('La bestia pop')?.disco, 'gulp');
  assert.equal(resolverTema('Ji JiJi')?.pista, 7);
  assert.equal(resolverTema('Capitán Buscapina')?.disco, 'ultimo-bondi-a-finisterre');
  // Lo que D-13 manda frenar: material que no es de los diez discos.
  assert.equal(resolverTema('Nene Nena'), null);
  assert.equal(resolverTema('Mejor No Hablar de Ciertas Cosas'), null);
  assert.equal(resolverTema(''), null);
});
