/**
 * El portal y la página del juego cuentan lo mismo (`portal.ts`).
 *
 * El defecto que cierra: hasta el ciclo 16 el portal decía "en la cocina" de "Completá la
 * letra" mientras su página ya se jugaba con 19 versos listos. Se veía en producción, en
 * uno de los cuatro juegos de la v1. Cada caso tiene su rojo al lado.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { JUEGOS, type Casete } from './copy.ts';
import { segunLaPartida } from './portal.ts';
import { cargarBanco, type BancoCrudo } from '../letra/banco.ts';

const LETRA = '/juegos/completar-la-letra/';
const leerBanco = (): BancoCrudo =>
  JSON.parse(readFileSync('src/data/letra.json', 'utf8')) as BancoCrudo;
const casete = (href: string): Casete => {
  const c = JUEGOS.find((j) => j.href === href);
  assert.ok(c, `no hay casete para ${href}`);
  return c;
};

test('con versos listos, el portal dice "Jugá" en "Completá la letra", igual que su página', () => {
  const hayPartida = cargarBanco(leerBanco()).length > 0;
  assert.ok(hayPartida, 'el banco de hoy tiene versos listos: si esto falla, cambió el banco, no el portal');
  assert.equal(segunLaPartida(casete(LETRA), hayPartida).accion, 'JUGÁ');
});

test('con el banco sin versos listos, el mismo casete sale "en la cocina"', () => {
  const vacio = { ...leerBanco(), items: [] } as BancoCrudo;
  const hayPartida = cargarBanco(vacio).length > 0;
  assert.equal(hayPartida, false);
  assert.equal(segunLaPartida(casete(LETRA), hayPartida).accion, undefined);
});

test('todo casete del lado A tiene acción en la copia: "en la cocina" solo lo decide un banco vacío', () => {
  const sinAccion = JUEGOS.filter((j) => j.accion === undefined).map((j) => j.titulo);
  assert.deepEqual(sinAccion, []);
});

test('un casete sin acción en la copia no gana una por tener partida', () => {
  const { accion: _sacada, ...sinAccion } = casete(LETRA);
  assert.equal(segunLaPartida(sinAccion, true).accion, undefined);
});

test('el portal le pregunta al banco de la letra con la misma función que la página', () => {
  // Chequeo de fuente, como los de `motor.test.ts`: si alguien vuelve a decidir el casete
  // en la copia y saca la pregunta al banco, las dos pantallas pueden volver a divergir.
  const portal = readFileSync('src/pages/index.astro', 'utf8');
  const pagina = readFileSync('src/pages/juegos/completar-la-letra.astro', 'utf8');
  assert.match(portal, /'\/juegos\/completar-la-letra\/':\s*cargarBanco\(/);
  assert.match(portal, /segunLaPartida\(/);
  assert.match(pagina, /cargarBanco\(/);
});
