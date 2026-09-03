import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  cargar, porDisco, verificarInvariantes, contarVersos, tieneAcordes, seCanta,
  FICHAS, AVISO_SIN_LETRA, CancioneroInvalido, type Cancionero, type TemaCancionero,
} from './banco.ts';
import { DISCOS } from '../letra/temas.ts';

/**
 * Estos tests corren contra el dataset de verdad, no contra un fixture. Es a propósito:
 * el riesgo real no es que la función de agrupar tenga un bug, es que la ingesta traiga
 * material contaminado o incompleto y nadie se entere hasta verlo publicado.
 */
const CRUDO = JSON.parse(readFileSync('src/data/cancionero.json', 'utf-8')) as Cancionero;
const TEMAS = cargar(CRUDO);

test('el dataset declara el contrato CTR-06', () => {
  assert.equal(CRUDO.contrato, 'CTR-06');
  assert.equal(CRUDO.contratoVersion, 1);
});

test('entraron 104 de los 105 temas, y el que falta es el instrumental Sushi', () => {
  assert.equal(TEMAS.length, 104);
  const discos = porDisco(TEMAS);
  const huecos = discos.flatMap((d) => d.pistas.filter((p) => !p.tema).map((p) => `${d.slug}/${p.titulo}`));
  assert.deepEqual(huecos, ['lobo-suelto/Sushi']);
});

test('todo tema pertenece a uno de los diez discos', () => {
  for (const t of TEMAS) assert.ok(DISCOS.includes(t.disco), `${t.slug}: ${t.disco}`);
});

test('ningún slug se repite: dos temas con la misma URL sería un tema perdido', () => {
  assert.equal(new Set(TEMAS.map((t) => t.slug)).size, TEMAS.length);
});

test('todo tema con letra declara de dónde salió (D-14: el rótulo dice la verdad)', () => {
  const mudos = TEMAS.filter((t) => t.contenido !== 'instrumental' && !t.fuente.sitio);
  assert.deepEqual(mudos.map((t) => t.slug), []);
});

test('las diez fichas de disco cubren los diez slugs, sin sobrar ni faltar', () => {
  assert.deepEqual([...FICHAS.map((f) => f.slug)].sort(), [...DISCOS].sort());
});

test('cada sección del índice trae el tracklist entero del disco', () => {
  const esperado: Record<string, number> = {
    gulp: 12, oktubre: 9, 'un-baion-para-el-ojo-idiota': 8, 'bang-bang-estas-liquidado': 9,
    'la-mosca-y-la-sopa': 10, 'lobo-suelto': 13, 'cordero-atado': 12, luzbelito: 11,
    'ultimo-bondi-a-finisterre': 10, 'momo-sampler': 11,
  };
  for (const d of porDisco(TEMAS)) {
    assert.equal(d.pistas.length, esperado[d.slug], `${d.slug} muestra ${d.pistas.length} pistas`);
    // Y en orden de disco, que es como se escucha.
    assert.deepEqual(d.pistas.map((p) => p.pista), d.pistas.map((_, i) => i + 1), d.slug);
  }
});

test('un tema que dice tener letra trae versos de verdad', () => {
  const vacios = TEMAS.filter((t) => t.contenido === 'letra' && contarVersos(t) === 0);
  assert.deepEqual(vacios.map((t) => t.slug), []);
});

test('los tres estados de contenido están poblados y cada uno dice la verdad', () => {
  const porEstado = new Map<string, string[]>();
  for (const t of TEMAS) porEstado.set(t.contenido, [...(porEstado.get(t.contenido) ?? []), t.slug]);

  // Los dos instrumentales de verdad: no tienen letra porque no la tuvieron nunca.
  assert.deepEqual((porEstado.get('instrumental') ?? []).sort(), ['capricho-magyar', 'pianito-jam']);

  // Los que la fuente transcribió solo como tablatura. NO son instrumentales: tienen
  // letra, simplemente nadie la escribió en la página de la que salieron.
  //
  // **Este test ya cambió dos veces, y las dos era lo que tenía que pasar.** La primera
  // versión listaba seis. El 2026-08-24 el cancionero se rehizo sumando lacuerda.net como
  // fuente y **cinco de los seis aparecieron con letra**: `divina-tv-fuhrer`,
  // `etiqueta-negra`, `fuegos-de-octubre`, `san-telmo` y `scaramanzia`.
  //
  // **`san-telmo` volvió, y esta vez el rótulo se había equivocado.** Lo que lacuerda.net
  // transcribió ahí es pentagrama de punta a punta; lo único que la ingesta contaba como
  // verso eran cuatro renglones que no canta nadie — el título de la página (`SAN TELMO`),
  // `MELODIA.  (acordeon)`, un `FIN.` y la acotación del que lo subió. `taller.ts` los
  // despegó y el tema quedó donde siempre debió estar. Un tema sin letra no es un tema
  // roto: el índice tiene que decir cuál de los tres es, y ahora lo dice bien.
  assert.deepEqual((porEstado.get('solo-tablatura') ?? []).sort(), ['san-telmo', 'soga-de-cain']);

  assert.equal((porEstado.get('letra') ?? []).length, 100);
});

test('lo que no se canta trae su aviso escrito, no un hueco mudo', () => {
  for (const t of TEMAS) {
    if (seCanta(t)) continue;
    assert.ok(AVISO_SIN_LETRA[t.contenido as 'instrumental' | 'solo-tablatura'], t.slug);
  }
});

test('hay material suficiente para que la sección valga la pena', () => {
  const conAcordes = TEMAS.filter(tieneAcordes).length;
  assert.ok(conAcordes >= 70, `solo ${conAcordes} temas con acordes`);
  const versos = TEMAS.reduce((n, t) => n + contarVersos(t), 0);
  assert.ok(versos >= 2000, `solo ${versos} versos en todo el cancionero`);
  assert.ok(TEMAS.filter(seCanta).length >= 90, 'menos de 90 temas cantables');
});

test('un instrumental que traiga contenido es una contradicción y no pasa', () => {
  const conLetra = TEMAS.find((t) => t.contenido === 'letra')!;
  const falso = { ...conLetra, contenido: 'instrumental' } as TemaCancionero;
  assert.throws(() => verificarInvariantes([falso]), CancioneroInvalido);
});

test('declarar letra sin traer un verso no pasa: es el bug que encontró este test', () => {
  const tablatura = TEMAS.find((t) => t.contenido === 'solo-tablatura')!;
  const falso = { ...tablatura, contenido: 'letra' } as TemaCancionero;
  assert.throws(() => verificarInvariantes([falso]), CancioneroInvalido);
});

test('dos temas con el mismo slug no pasan', () => {
  assert.throws(() => verificarInvariantes([TEMAS[0]!, TEMAS[0]!]), CancioneroInvalido);
});

test('la cuarentena de D-13 quedó escrita y con motivo en cada apartado', () => {
  const q = JSON.parse(readFileSync('src/data/cancionero-cuarentena.json', 'utf-8'));
  assert.equal(q.regla, 'D-13');
  assert.ok(q.apartados.length > 0, 'la cuarentena no puede estar vacía: la fuente trae 149 entradas');
  for (const a of q.apartados) {
    assert.ok(a.motivo && a.titulo, `apartado sin motivo: ${JSON.stringify(a)}`);
  }
});
