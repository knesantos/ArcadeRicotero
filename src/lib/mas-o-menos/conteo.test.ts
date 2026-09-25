import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  armarCorpus,
  claveSinTildes,
  lineasCantadas,
  palabrasDe,
  temasDe,
  variantesSinDeclarar,
  type TemaContable,
} from './conteo.ts';

/**
 * El contador de la familia "las palabras" (`D-48` punto 4), sobre temas de juguete.
 *
 * Lo que se prueba es la regla que el jugador lee en el rótulo: **en cuántos temas**, no
 * cuántas veces; **las formas declaradas**, y ninguna otra; **la letra que el cancionero
 * muestra**, sin la anotación del que transcribió. El cruce con el cancionero real vive en
 * `pozo.test.ts`, junto con el banco.
 */

function tema(slug: string, lineas: readonly (readonly [string, string])[], contenido = 'letra'): TemaContable {
  return {
    slug,
    titulo: slug,
    disco: 'oktubre',
    pista: 1,
    contenido,
    secciones: [{ lineas: lineas.map(([t, texto]) => ({ t, texto })) }],
  };
}

const TEMAS = [
  // El estribillo escrito cuatro veces: suma un tema, no cuatro.
  tema('criminal', [
    ['letra', 'Es un criminal mambo'],
    ['letra', 'es un criminal mambo'],
    ['letra', 'es un criminal mambo'],
    ['letra', 'es un criminal mambo.'],
  ]),
  // La anotación del transcriptor no es letra, aunque esté tipada como letra.
  tema('con-taller', [
    ['anotacion', 'GUITARRA: Riff 2'],
    ['letra', 'INTRO: Am G'],
    ['letra', 'Mi perro dinamita'],
  ]),
  // Tilde perdida en la transcripción, y la otra palabra que se escribe igual sin tilde.
  tema('tildes', [
    ['letra', 'corazon de piedra'],
    ['letra', 'esta noche'],
  ]),
  tema('bien', [
    ['letra', 'el corazón en la mano'],
    ['letra', 'ya está'],
    ['letra', 'perros de la calle'],
  ]),
  // Sin letra: no suma, aunque la tablatura diga cualquier cosa.
  tema('instrumental', [['tab', 'perro corazón criminal']], 'instrumental'),
];

const CORPUS = armarCorpus(TEMAS);

test('se cuenta en cuántos temas, no cuántas veces: el estribillo escrito cuatro veces suma uno', () => {
  assert.deepEqual(
    temasDe({ formas: ['criminal'] }, CORPUS).map((t) => t.slug),
    ['criminal'],
  );
});

test('los temas sin letra no entran al corpus, y el total contado lo dice', () => {
  assert.deepEqual(
    CORPUS.temas.map((t) => t.slug),
    ['criminal', 'con-taller', 'tildes', 'bien'],
  );
});

test('la anotación del transcriptor no suma, aunque venga tipada como letra', () => {
  assert.deepEqual(temasDe({ formas: ['riff'] }, CORPUS), []);
  assert.deepEqual(temasDe({ formas: ['intro'] }, CORPUS), []);
  assert.equal(lineasCantadas(TEMAS[1]!).join('|'), 'Mi perro dinamita');
});

test('solo cuentan las formas declaradas: "perro" no cuenta "perros" si no se la declara', () => {
  assert.deepEqual(
    temasDe({ formas: ['perro'] }, CORPUS).map((t) => t.slug),
    ['con-taller'],
  );
  assert.deepEqual(
    temasDe({ formas: ['perro', 'perros'] }, CORPUS).map((t) => t.slug),
    ['con-taller', 'bien'],
  );
});

test('la lista sale en el orden del cancionero, sin repetir un tema', () => {
  const lista = temasDe({ formas: ['corazón', 'corazon'] }, CORPUS).map((t) => t.slug);
  assert.deepEqual(lista, ['tildes', 'bien']);
});

test('una variante de tilde sin clasificar se avisa; clasificada de cualquier lado, no', () => {
  assert.deepEqual(variantesSinDeclarar({ formas: ['corazón'] }, CORPUS), ['corazon']);
  assert.deepEqual(variantesSinDeclarar({ formas: ['corazón', 'corazon'] }, CORPUS), []);
  assert.deepEqual(variantesSinDeclarar({ formas: ['está'] }, CORPUS), ['esta']);
  assert.deepEqual(variantesSinDeclarar({ formas: ['está'], noCuentan: [{ forma: 'esta' }] }, CORPUS), []);
});

test('la clave sin tildes conserva la ñ: año y ano no son la misma palabra', () => {
  assert.equal(claveSinTildes('Corazón'), 'corazon');
  assert.equal(claveSinTildes('año'), 'año');
  assert.notEqual(claveSinTildes('año'), claveSinTildes('ano'));
});

test('las palabras se cortan en todo lo que no es letra: "mam--bo" son dos pedazos', () => {
  assert.deepEqual(palabrasDe('Criminal, criminal mam--bo'), ['criminal', 'criminal', 'mam', 'bo']);
  assert.deepEqual(palabrasDe('¡Ñam fri frufi!'), ['ñam', 'fri', 'frufi']);
});
