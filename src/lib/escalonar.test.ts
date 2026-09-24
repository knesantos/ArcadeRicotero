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
import { readFileSync } from 'node:fs';
import { escalonar, hayEscalones, barajar, ORDEN_DIFICULTAD } from './escalonar.ts';
import { catalogo, pozo, type Manifiesto } from './tema/catalogo.ts';
import { armarVuelta, FACILES_POR_VUELTA, LARGO_VUELTA } from './tema/vuelta.ts';
import type { ConteoCitado } from './en-vivo.ts';

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
 * 🔴 Un pozo de un solo nivel, y por qué este test existe.
 *
 * `US-07` deriva su dificultad de las escuchas (`D-27`) y las vistas de YouTube no tienen
 * una sola medición: su pozo cae entero en `dificil`. Con un solo nivel, escalonar y
 * barajar dan lo mismo — y eso está bien mientras **se pueda decir**. (`US-02` salió de
 * ese estado en el ciclo 16: ver el test de abajo de todo.)
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

/**
 * `BR-01` en `US-02`, con los datos de verdad: **los 8 Fáciles existen y un test los cuenta**.
 *
 * Es la condición con que `D-45` (consecuencia 2) y `BR-18` apartado (h) abren la puerta de
 * `BR-28`: no alcanza con escribir la regla. El catálogo se arma igual que en la página
 * —manifiesto de audio real y conteo citado real— y se cuenta sobre el pozo con fragmento.
 */
test('US-02 tiene exactamente 8 Fáciles, todos con fragmento y todos en el conteo citado', () => {
  const manifiesto = JSON.parse(readFileSync('src/data/adivinar-tema.json', 'utf-8')) as Manifiesto;
  const { conteo } = JSON.parse(readFileSync('src/data/setlistfm.json', 'utf-8')) as { conteo: ConteoCitado };
  const cat = catalogo(manifiesto, [], conteo);

  const faciles = pozo(cat, null).filter((t) => t.dificultad === 'facil');
  assert.equal(
    faciles.length,
    8,
    `US-02 tiene ${faciles.length} Fáciles: ${faciles.map((t) => t.titulo).join(', ')}`,
  );
  assert.equal(cat.faciles, 8);
  assert.equal(cat.corteDeterminado, true, 'el corte en vivo no quedó determinado');

  const enElConteo = new Set(conteo.temas.map((l) => l.slug));
  for (const t of faciles) {
    assert.ok(t.jugable, `${t.titulo} es Fácil y no tiene fragmento`);
    assert.ok(enElConteo.has(t.slug), `${t.titulo} es Fácil y no figura en el conteo`);
  }
  // Ningún Fácil puede estar fuera del pozo: un Fácil que no suena no abre ninguna partida.
  assert.equal(cat.temas.filter((t) => t.dificultad === 'facil' && !t.jugable).length, 0);

  // Y la vuelta abre con uno de ellos, que es lo que `BR-01` punto 1 pedía.
  const ronda = armarVuelta(pozo(cat, null));
  assert.equal(ronda[0]!.dificultad, 'facil');
  assert.equal(hayEscalones(pozo(cat, null)), true);
});

// ------------------------------------------------ el cupo del nivel más bajo (CTR-19.14 p. 3)

/** Azar con semilla (mulberry32): miles de vueltas sin depender de la suerte. */
function conSemilla(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MUCHOS_FACILES = [
  ...Array.from({ length: 8 }, (_, i) => item(`f${i}`, 'facil')),
  ...Array.from({ length: 3 }, (_, i) => item(`m${i}`, 'media')),
  ...Array.from({ length: 9 }, (_, i) => item(`d${i}`, 'dificil')),
];

test('sin cupo, un pozo con mas Faciles que el largo es una vidriera fija (lo que el cupo arregla)', () => {
  for (let i = 0; i < 50; i++) {
    const ronda = escalonar(MUCHOS_FACILES, 4);
    assert.equal(hayEscalones(ronda), false);
  }
});

test('con cupo 1: abre con un Facil, uno solo, y el orden no baja', () => {
  const azar = conSemilla(7);
  for (let i = 0; i < 500; i++) {
    const ronda = escalonar(MUCHOS_FACILES, 4, azar, { cupoPrimerNivel: 1 });
    assert.equal(ronda.length, 4);
    assert.equal(ronda[0]!.dificultad, 'facil');
    assert.equal(ronda.filter((r) => r.dificultad === 'facil').length, 1);
    const niveles = ronda.map((r) => ORDEN_DIFICULTAD[r.dificultad]!);
    for (let j = 1; j < niveles.length; j++) assert.ok(niveles[j]! >= niveles[j - 1]!);
  }
});

test('con cupo, todo el pozo puede sonar: ningun item queda afuera en 2000 vueltas', () => {
  const azar = conSemilla(11);
  const sonaron = new Set<string>();
  for (let i = 0; i < 2000; i++) {
    for (const r of escalonar(MUCHOS_FACILES, 4, azar, { cupoPrimerNivel: 1 })) sonaron.add(r.id);
  }
  const mudos = MUCHOS_FACILES.filter((it) => !sonaron.has(it.id)).map((it) => it.id);
  assert.deepEqual(mudos, []);
});

test('con cupo, si arriba no alcanza se completa con el nivel mas bajo, sin quedar corto', () => {
  const pozo = [item('f1', 'facil'), item('f2', 'facil'), item('f3', 'facil'), item('d1', 'dificil')];
  const ronda = escalonar(pozo, 4, sinAzar, { cupoPrimerNivel: 1 });
  assert.equal(ronda.length, 4);
  assert.deepEqual(ronda.map((r) => r.dificultad), ['facil', 'facil', 'facil', 'dificil']);
  // Un solo nivel: con cupo es el mismo barajado declarado de siempre.
  const plano = Array.from({ length: 6 }, (_, i) => item(`d${i}`, 'dificil'));
  assert.equal(escalonar(plano, 4, sinAzar, { cupoPrimerNivel: 1 }).length, 4);
  assert.deepEqual(escalonar([], 4, sinAzar, { cupoPrimerNivel: 1 }), []);
});

test('un cupo de 0 se lee como 1: la partida nunca abre con algo que no sea del nivel mas bajo', () => {
  const ronda = escalonar(MUCHOS_FACILES, 4, conSemilla(3), { cupoPrimerNivel: 0 });
  assert.equal(ronda[0]!.dificultad, 'facil');
});

/**
 * `BR-01` punto 3 en `US-02`, con los datos de verdad: la verificación de `T-279` simuló
 * 5000 vueltas de todos los discos y salieron 8 temas distintos, cero vueltas escalonadas.
 * Este es el test que faltaba: mira la **vuelta**, no el pozo.
 */
test('US-02 con todos los discos: cada vuelta escalona y todo el pozo con fragmento puede sonar', () => {
  const manifiesto = JSON.parse(readFileSync('src/data/adivinar-tema.json', 'utf-8')) as Manifiesto;
  const { conteo } = JSON.parse(readFileSync('src/data/setlistfm.json', 'utf-8')) as { conteo: ConteoCitado };
  const todos = pozo(catalogo(manifiesto, [], conteo), null);
  assert.ok(FACILES_POR_VUELTA < LARGO_VUELTA, 'con el cupo igual al largo vuelve la vidriera fija');

  const azar = conSemilla(2026);
  const sonaron = new Set<string>();
  const primeros = new Set<string>();
  for (let i = 0; i < 5000; i++) {
    const ronda = armarVuelta(todos, azar);
    assert.equal(ronda.length, LARGO_VUELTA);
    assert.equal(ronda[0]!.dificultad, 'facil', `la vuelta ${i} no abrio con un Facil`);
    assert.ok(hayEscalones(ronda), `la vuelta ${i} no escalona: ${ronda.map((r) => r.titulo).join(', ')}`);
    const niveles = ronda.map((r) => ORDEN_DIFICULTAD[r.dificultad]!);
    for (let j = 1; j < niveles.length; j++) {
      assert.ok(niveles[j]! >= niveles[j - 1]!, `la vuelta ${i} baja de nivel en la posicion ${j}`);
    }
    primeros.add(ronda[0]!.slug);
    for (const t of ronda) sonaron.add(t.slug);
  }
  const mudos = todos.filter((t) => !sonaron.has(t.slug)).map((t) => t.titulo);
  assert.deepEqual(mudos, [], `${mudos.length} temas del pozo no sonaron en 5000 vueltas`);
  assert.equal(primeros.size, 8, 'el primer tema no varia entre los 8 Faciles (BR-01 punto 3)');
});
