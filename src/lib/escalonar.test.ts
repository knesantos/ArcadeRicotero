/**
 * Verificación de `BR-01` puntos 1 y 2 para los juegos de pozo abierto.
 *
 * El test que más importa hoy es el último: describe el estado real del repo —un solo
 * nivel en los dos juegos— y afirma que en ese estado esto **es** un barajado. Que sea
 * declarado en vez de accidental es toda la diferencia con `FIND-29`, y una diferencia
 * que no se puede afirmar si nadie la escribe.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escalonar, hayEscalones, barajar, ORDEN_DIFICULTAD } from './escalonar.ts';

const item = (id: string, dificultad: string) => ({ id, dificultad });

/** Azar fijo: siempre devuelve el primero, para que el orden sea afirmable. */
const sinAzar = () => 0;

const MEZCLA = [
  item('d1', 'dificil'),
  item('f1', 'facil'),
  item('m1', 'media'),
  item('d2', 'dificil'),
  item('f2', 'facil'),
  item('m2', 'media'),
];

test('BR-01 punto 1: el primero sale del pozo mas facil que exista', () => {
  for (let i = 0; i < 30; i++) {
    const ronda = escalonar(MEZCLA, 4);
    assert.equal(ronda[0]!.dificultad, 'facil', 'la partida abrio con algo que no es facil');
  }
});

test('BR-01 punto 2: la dificultad no baja en toda la ronda', () => {
  for (let i = 0; i < 30; i++) {
    const ronda = escalonar(MEZCLA, 6);
    const niveles = ronda.map((r) => ORDEN_DIFICULTAD[r.dificultad]!);
    for (let j = 1; j < niveles.length; j++) {
      assert.ok(niveles[j]! >= niveles[j - 1]!, `bajo de nivel en la posicion ${j}`);
    }
  }
});

test('devuelve exactamente el largo pedido cuando el pozo alcanza', () => {
  assert.equal(escalonar(MEZCLA, 4).length, 4);
  assert.equal(escalonar(MEZCLA, 1).length, 1);
});

test('un pozo mas chico que el largo devuelve lo que hay, sin tirar', () => {
  const ronda = escalonar([item('f1', 'facil')], 5);
  assert.equal(ronda.length, 1);
});

test('un pozo vacio devuelve vacio: la pantalla sabe manejarlo, tirar la romperia', () => {
  assert.deepEqual(escalonar([], 4), []);
});

test('un nivel desconocido cae al fondo, nunca abre una partida', () => {
  const ronda = escalonar([item('x', 'imposible'), item('f', 'facil')], 2);
  assert.equal(ronda[0]!.dificultad, 'facil');
  assert.equal(ronda[1]!.dificultad, 'imposible');
});

test('sin-clasificar tambien va al fondo, detras de dificil', () => {
  const ronda = escalonar([item('s', 'sin-clasificar'), item('d', 'dificil')], 2);
  assert.equal(ronda[0]!.dificultad, 'dificil');
  assert.equal(ronda[1]!.dificultad, 'sin-clasificar');
});

test('adentro de un nivel baraja: dos rondas seguidas no son siempre iguales', () => {
  const pozo = Array.from({ length: 20 }, (_, i) => item(`f${i}`, 'facil'));
  const vistas = new Set<string>();
  for (let i = 0; i < 40; i++) vistas.add(escalonar(pozo, 5).map((r) => r.id).join(','));
  assert.ok(vistas.size > 1, 'el reparto salio identico 40 veces: no esta barajando');
});

test('el azar se puede inyectar, asi el test no depende de la suerte', () => {
  const pozo = [item('a', 'facil'), item('b', 'facil'), item('c', 'facil')];
  assert.deepEqual(escalonar(pozo, 3, sinAzar), escalonar(pozo, 3, sinAzar));
});

test('barajar no pierde ni duplica un solo item', () => {
  const xs = [1, 2, 3, 4, 5, 6, 7, 8];
  const b = barajar(xs);
  assert.equal(b.length, xs.length);
  assert.deepEqual([...b].sort((x, y) => x - y), xs);
});

/**
 * 🔴 El estado real del repo, y por qué este test existe.
 *
 * `US-02` y `US-07` derivan su dificultad de las escuchas (`D-27`) y `popularidad.json`
 * no tiene una sola medición: los dos pozos caen enteros en `dificil`. Con un solo nivel,
 * escalonar y barajar dan lo mismo — y eso está bien mientras **se pueda decir**.
 *
 * Si mañana alguien lee "ronda escalonada" y cree que el juego escalona, este test es el
 * que lo desmiente.
 */
test('🔴 con un solo nivel esto ES un barajado, y hayEscalones lo dice', () => {
  const pozo = Array.from({ length: 10 }, (_, i) => item(`d${i}`, 'dificil'));
  assert.equal(hayEscalones(pozo), false, 'un pozo de un solo nivel no tiene escalones');

  const ronda = escalonar(pozo, 4);
  assert.equal(ronda.length, 4);
  assert.ok(ronda.every((r) => r.dificultad === 'dificil'));
});

test('hayEscalones distingue el pozo repartido del pozo plano', () => {
  assert.equal(hayEscalones(MEZCLA), true);
  assert.equal(hayEscalones([item('a', 'facil')]), false);
  assert.equal(hayEscalones([]), false);
});
