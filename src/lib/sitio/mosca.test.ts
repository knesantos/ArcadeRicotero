/**
 * La física de la mosca (`D-49`, `sitio/mosca.ts`).
 *
 * Lo que se prueba es lo que, si está mal, se ve: que revolotee **alrededor** del mouse y no
 * encima ni lejos, que no cruce la pantalla de un salto, que no se escape de la ventana, y
 * que la vuelta a casa termine — si no termina, el recorrido de siempre no vuelve nunca.
 * Si revolotea *como una mosca* no lo puede decir un test: eso se mira en la vista previa.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  RADIO_MAX,
  RADIO_MIN,
  VELOCIDAD_MAX,
  despegar,
  diferenciaAngular,
  llegoACasa,
  sortearDesvio,
  volar,
  type Rumbo,
  type Vuelo,
} from './mosca.ts';

/** Azar sembrado: el mismo vuelo cada vez que corre el test. */
function sembrado(semilla: number): () => number {
  let s = semilla >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

const VENTANA = { ancho: 1280, alto: 800 };
const CUADRO = 1 / 60;

/** Vuela `segundos` y devuelve cada cuadro. */
function simular(inicio: Vuelo, rumbo: (t: number) => Rumbo, segundos: number, semilla = 7): Vuelo[] {
  const azar = sembrado(semilla);
  const cuadros: Vuelo[] = [];
  let v = inicio;
  for (let t = 0; t < segundos; t += CUADRO) {
    v = volar(v, rumbo(t), VENTANA, CUADRO, azar);
    cuadros.push(v);
  }
  return cuadros;
}

test('revolotea alrededor del ancla: después de llegar, no se aleja más de lo que sortea', () => {
  const ancla = { x: 640, y: 400 };
  for (const semilla of [1, 2, 3, 4, 5]) {
    const cuadros = simular(despegar({ x: 40, y: 40 }, 12), () => ({ tipo: 'alrededor', ancla }), 12, semilla);
    // Los primeros dos segundos son el viaje desde la esquina; de ahí en más, cerca.
    const lejanias = cuadros.slice(120).map((v) => Math.hypot(v.x - ancla.x, v.y - ancla.y));
    assert.ok(Math.max(...lejanias) < RADIO_MAX + 60, `semilla ${semilla}: se fue a ${Math.max(...lejanias).toFixed(0)} px`);
  }
});

test('y no se le sienta encima: pasa la mayor parte del tiempo fuera del radio mínimo', () => {
  const ancla = { x: 640, y: 400 };
  const cuadros = simular(despegar({ x: 600, y: 380 }, 0), () => ({ tipo: 'alrededor', ancla }), 12);
  const encima = cuadros.filter((v) => Math.hypot(v.x - ancla.x, v.y - ancla.y) < RADIO_MIN / 2).length;
  assert.ok(encima / cuadros.length < 0.15, `pasó el ${((100 * encima) / cuadros.length).toFixed(0)} % encima del mouse`);
});

test('se mueve: no se queda quieta más de un segundo seguido', () => {
  const ancla = { x: 640, y: 400 };
  const cuadros = simular(despegar(ancla, 0), () => ({ tipo: 'alrededor', ancla }), 20);
  let quietos = 0;
  let peor = 0;
  for (const v of cuadros) {
    quietos = Math.hypot(v.vx, v.vy) < 15 ? quietos + 1 : 0;
    peor = Math.max(peor, quietos);
  }
  assert.ok(peor * CUADRO < 1, `estuvo ${(peor * CUADRO).toFixed(2)} s quieta`);
});

test('nunca pasa la velocidad máxima, ni persiguiendo un mouse que salta de punta a punta', () => {
  const cuadros = simular(
    despegar({ x: 20, y: 20 }, 0),
    (t) => ({ tipo: 'alrededor', ancla: Math.floor(t) % 2 === 0 ? { x: 20, y: 20 } : { x: 1260, y: 780 } }),
    10,
  );
  for (const v of cuadros) assert.ok(Math.hypot(v.vx, v.vy) <= VELOCIDAD_MAX + 1e-6);
});

test('los destinos sorteados quedan adentro de la ventana, aunque el ancla esté en un borde', () => {
  const azar = sembrado(11);
  for (const ancla of [{ x: 0, y: 0 }, { x: 1280, y: 800 }, { x: 0, y: 800 }, { x: 640, y: 0 }]) {
    for (let i = 0; i < 200; i++) {
      const d = sortearDesvio(ancla, VENTANA, azar);
      const x = ancla.x + d.x;
      const y = ancla.y + d.y;
      assert.ok(x >= 0 && x <= VENTANA.ancho && y >= 0 && y <= VENTANA.alto, `destino fuera: ${x}, ${y}`);
    }
  }
});

test('lejos del borde, el destino cae entre el radio mínimo y el máximo', () => {
  const azar = sembrado(3);
  const ancla = { x: 640, y: 400 };
  for (let i = 0; i < 500; i++) {
    const d = Math.hypot(...Object.values(sortearDesvio(ancla, VENTANA, azar)) as [number, number]);
    assert.ok(d >= RADIO_MIN - 1e-9 && d <= RADIO_MAX + 1e-9, `desvío de ${d}`);
  }
});

test('la vuelta a casa termina, y termina con la cara del primer cuadro del recorrido', () => {
  const casa = { x: 47, y: 56 };
  for (const desde of [{ x: 1200, y: 760 }, { x: 640, y: 400 }, { x: 60, y: 700 }]) {
    const cuadros = simular(despegar(desde, -150), () => ({ tipo: 'a-casa', casa, angulo: 12 }), 8);
    const llego = cuadros.findIndex((v) => llegoACasa(v, casa, 12));
    assert.ok(llego >= 0, `desde ${desde.x},${desde.y} no llegó nunca`);
    assert.ok(llego * CUADRO < 6, `desde ${desde.x},${desde.y} tardó ${(llego * CUADRO).toFixed(1)} s`);
  }
});

test('llegar no alcanza si todavía viene rápido o mirando para otro lado', () => {
  const casa = { x: 50, y: 50 };
  const base = { ...despegar(casa, 12) };
  assert.equal(llegoACasa(base, casa, 12), true);
  assert.equal(llegoACasa({ ...base, vx: 300 }, casa, 12), false);
  assert.equal(llegoACasa({ ...base, angulo: 90 }, casa, 12), false);
  assert.equal(llegoACasa({ ...base, x: 80 }, casa, 12), false);
});

test('una pestaña que vuelve de dormir no hace cruzar la pantalla en un cuadro', () => {
  const v = volar(despegar({ x: 0, y: 0 }, 0), { tipo: 'alrededor', ancla: { x: 1200, y: 700 } }, VENTANA, 3, sembrado(1));
  assert.ok(Math.hypot(v.x, v.y) <= VELOCIDAD_MAX * 0.1 + 1e-6);
});

test('el giro de la cara toma siempre el camino corto', () => {
  assert.equal(diferenciaAngular(170, -170), 20);
  assert.equal(diferenciaAngular(-170, 170), -20);
  assert.equal(diferenciaAngular(0, 90), 90);
  assert.equal(diferenciaAngular(720, 10), 10);
});
