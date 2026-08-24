import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { catalogo, pozo, indexarFragmentos, CatalogoInvalido, type Manifiesto } from './catalogo.ts';
import { DURACION_FRAGMENTO_SEG } from './escalera.ts';
import { FICHAS } from '../cancionero/banco.ts';

const VACIO: Manifiesto = {
  contrato: 'CTR-03',
  contratoVersion: 2,
  actualizado: '2026-08-23',
  fragmentos: [],
};

const conFragmentos = (slugs: readonly string[]): Manifiesto => ({
  ...VACIO,
  fragmentos: slugs.map((slug) => ({
    slug,
    titulo: slug,
    duracionSeg: DURACION_FRAGMENTO_SEG,
    entero: false,
  })),
});

test('el catálogo son los 105 de RES-20, tengan audio o no', () => {
  // Los que no tienen audio están igual: son los que el buscador ofrece. Si el
  // desplegable listara solo los jugables, sería la respuesta.
  const cat = catalogo(VACIO);
  assert.equal(cat.temas.length, 105);
  assert.equal(cat.discos.length, FICHAS.length);
});

test('sin un solo fragmento, el catálogo carga igual y declara que no hay con qué jugar', () => {
  // Es el estado real de hoy (`D-23`: el audio sale de la máquina del usuario). Tiene
  // que ser un estado, no una excepción: la pantalla lo dice y no se rompe.
  const cat = catalogo(VACIO);
  assert.equal(cat.jugables, 0);
  assert.deepEqual(pozo(cat, null), []);
  assert.ok(cat.temas.every((t) => !t.jugable));
});

test('cada disco declara cuántos temas suyos se pueden jugar', () => {
  const cat = catalogo(VACIO);
  const total = cat.discos.reduce((n, d) => n + d.total, 0);
  assert.equal(total, 105, 'entre los diez discos tienen que estar los 105 temas');
  assert.ok(cat.discos.every((d) => d.jugables === 0));
});

test('un fragmento marca jugable solo a su tema, y el pozo lo respeta', () => {
  const alguno = catalogo(VACIO).temas[0]!;
  const cat = catalogo(conFragmentos([alguno.slug]));
  assert.equal(cat.jugables, 1);
  assert.deepEqual(
    pozo(cat, null).map((t) => t.slug),
    [alguno.slug],
  );
  // Elegir otro disco no puede devolver un tema que no es de ese disco.
  const otroDisco = FICHAS.find((f) => f.slug !== alguno.disco)!;
  assert.deepEqual(pozo(cat, otroDisco.slug), []);
  assert.deepEqual(
    pozo(cat, alguno.disco).map((t) => t.slug),
    [alguno.slug],
  );
});

// ---------------------------------------------------------------- la puerta de D-13

test('un mp3 con un nombre que no es de esta banda rompe el build, no entra al sitio', () => {
  // `D-13` en su forma más concreta: lo que no resuelve contra los 105 no entra. Un
  // archivo suelto en la carpeta de audio no puede volverse una respuesta del juego por
  // descuido de tipeo.
  assert.throws(
    () => catalogo(conFragmentos(['un-tema-del-indio-solista'])),
    CatalogoInvalido,
  );
});

test('un fragmento más corto que el último paso rompe el build', () => {
  // Si el archivo dura menos que el escalón más caro, el jugador que llegó hasta ahí
  // recibe silencio. Es peor que no tener el tema: parece que el juego se colgó.
  const alguno = catalogo(VACIO).temas[0]!;
  const corto: Manifiesto = {
    ...VACIO,
    fragmentos: [{ slug: alguno.slug, titulo: alguno.titulo, duracionSeg: 8, entero: false }],
  };
  assert.throws(() => catalogo(corto), CatalogoInvalido);
});

test('el mismo fragmento dos veces rompe el build', () => {
  const alguno = catalogo(VACIO).temas[0]!;
  assert.throws(() => catalogo(conFragmentos([alguno.slug, alguno.slug])), CatalogoInvalido);
});

test('indexarFragmentos acepta un manifiesto limpio', () => {
  const indice = indexarFragmentos(conFragmentos(['a', 'b']), new Set(['a', 'b', 'c']));
  assert.equal(indice.size, 2);
});

// ---------------------------------------------------------------- los slugs

test('los 105 títulos dan 105 slugs distintos', () => {
  // El slug nombra el archivo de audio (`CTR-01.4`). Dos temas con el mismo slug serían
  // dos temas compartiendo un mp3, y el juego revelaría el título equivocado.
  const cat = catalogo(VACIO);
  const slugs = new Set(cat.temas.map((t) => t.slug));
  assert.equal(slugs.size, 105);
});

test('ningún slug tiene tildes, mayúsculas ni espacios: es un nombre de archivo', () => {
  for (const t of catalogo(VACIO).temas) {
    assert.match(t.slug, /^[a-z0-9-]+$/, `"${t.titulo}" da el slug "${t.slug}"`);
  }
});

// ---------------------------------------------------------------- el enlace a la letra

test('el enlace a la letra cruza por título normalizado, no por slug', () => {
  // Los dos slugs se derivaron por caminos distintos: la Redondopedia escribe
  // "ji-ji-ji" y el cancionero "jijiji". Cruzar por slug daría un enlace roto justo en
  // el tema más conocido de la banda.
  const cat = catalogo(VACIO, [{ slug: 'jijiji', titulo: 'Ji ji ji' }]);
  const tema = cat.temas.find((t) => t.slug === 'jijiji');
  assert.ok(tema, 'RES-20 escribe el título pegado: el catálogo tendría que tener ese slug');
  assert.equal(tema!.letra, 'jijiji');
});

test('un tema sin letra en el cancionero declara el hueco, no inventa un enlace', () => {
  const cat = catalogo(VACIO, []);
  assert.ok(cat.temas.every((t) => t.letra === null));
});

// ---------------------------------------------------------------- el manifiesto real

test('el manifiesto que está en el repo es válido', () => {
  // El archivo real, con lo que tenga hoy. Es el mismo camino que corre el build de la
  // página: si esto pasa, la página compila.
  const real = JSON.parse(readFileSync('src/data/adivinar-tema.json', 'utf-8')) as Manifiesto;
  const cat = catalogo(real);
  assert.equal(cat.temas.length, 105);
  assert.equal(cat.jugables, real.fragmentos.length);
});
