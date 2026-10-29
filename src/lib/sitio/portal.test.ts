/**
 * El portal y la página del juego cuentan lo mismo (`portal.ts`).
 *
 * El defecto que cierra: hasta el ciclo 16 el portal decía "en la cocina" de "Completá la
 * letra" mientras su página ya se jugaba con 19 versos listos. Se veía en producción, en
 * uno de los cuatro juegos de la v1. Cada caso tiene su rojo al lado.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import { JUEGOS, LADO_B, type Casete } from './copy.ts';
import { arteDeCasete, discoDeRecorte, materialDeCasete } from './arte.ts';
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

/*
 * `D-49`: cada casete del portal lleva una tapa entera, un detalle o un recorte de tapa, y
 * ninguno repite pieza. Lo pidió el usuario el 2026-10-01: *"que todas las entradas de
 * juegos del home tengan un detalle o un disco entero, no el svg del cassete, cada uno
 * diferente"*. Hasta ese día tres juegos llevaban el mismo casete dibujado y dos casetes la
 * misma mosca.
 */
const TODOS: readonly Casete[] = [...JUEGOS, ...LADO_B];

test('D-49: ningún casete lleva un dibujo genérico en vez de un pedazo de tapa', () => {
  // Lo que se resuelve en pantalla, no lo que dice la copia: `arteDeCasete` cae al casete
  // dibujado si falta el archivo, y eso también tiene que fallar acá.
  const dibujados = TODOS.filter((c) => /\/arte\/(casete|perro)\.svg$/.test(arteDeCasete(c.arte))).map((c) => c.titulo);
  assert.deepEqual(dibujados, []);
});

test('D-49: ninguna pieza se repite entre los casetes', () => {
  const vistas = new Map<string, string>();
  const repetidas: string[] = [];
  for (const c of TODOS) {
    const pieza = arteDeCasete(c.arte);
    const antes = vistas.get(pieza);
    if (antes) repetidas.push(`${c.titulo} repite la de ${antes}: ${pieza}`);
    vistas.set(pieza, c.titulo);
  }
  assert.deepEqual(repetidas, []);
});

test('D-21: cada pieza de casete nombra su disco en el pie, y el archivo existe', () => {
  const sinDisco = TODOS.filter((c) => discoDeRecorte(arteDeCasete(c.arte)) === null).map((c) => c.titulo);
  assert.deepEqual(sinDisco, [], 'una tapa que se ve y no se acredita incumple D-21 condición 1');
  for (const c of TODOS) {
    const pieza = arteDeCasete(c.arte);
    assert.ok(existsSync(`public${pieza}`), `${c.titulo}: no está ${pieza}`);
  }
});

test('el material sale de la carpeta: tapa entera, detalle o recorte', () => {
  assert.equal(materialDeCasete('/tapas/oktubre.jpg'), 'entera');
  assert.equal(materialDeCasete('/tapas/detalle/gulp-zoom.jpg'), 'detalle');
  assert.equal(materialDeCasete('/arte/lobo-recortado.png'), 'recorte');
  assert.equal(discoDeRecorte('/tapas/oktubre.jpg'), 'Oktubre');
  assert.equal(discoDeRecorte('/tapas/detalle/un-baion-para-el-ojo-idiota-zoom.jpg'), 'Un baión para el ojo idiota');
  // El casete dibujado no es de ningún disco: no acredita nada.
  assert.equal(discoDeRecorte('/arte/casete.svg'), null);
});
