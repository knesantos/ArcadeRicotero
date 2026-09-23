/**
 * La puerta doble y el fin del nivel 1 (`T-248`), con los tres casos que el plan del ciclo
 * 15 le declaró: **falla** si se gana con uno solo en la puerta, **pasa** con los dos, y el
 * que llegó primero no paga nada mientras espera.
 *
 * La regla no se escribe acá: se escribe una sola vez, en `paso()` de `mundo.ts` (`T-254`),
 * y acá se la prueba contra **el nivel 1 de verdad**, el de `src/data/skayboy.json`. Si
 * alguien redibuja ese nivel y rompe la puerta doble, se entera por este archivo.
 *
 * Y se juega como lo juega el que llega solo (`D-43`): una columna, después la otra. Si el
 * nivel 1 no se pasa así, está mal (`BR-25` fila b).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Banco, IdPersonaje } from './niveles.ts';
import { QUIETO, crearMundo, paso, type Mando, type Mandos, type Mundo, type Suceso } from './mundo.ts';

const CUADRO = 1 / 60;
const BANCO = JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as Banco;
const NIVEL_1 = BANCO.niveles[0];

function mandos(parcial: Partial<Record<IdPersonaje, Partial<Mando>>> = {}): Mandos {
  return {
    skayboy: { ...QUIETO, ...parcial.skayboy },
    poligirl: { ...QUIETO, ...parcial.poligirl },
  };
}

function correr(mundo: Mundo, m: Mandos, segundos: number): Suceso[] {
  const sucesos: Suceso[] = [];
  for (let i = 0; i < Math.round(segundos / CUADRO); i++) sucesos.push(...paso(mundo, m, CUADRO));
  return sucesos;
}

/** En el nivel 1, la puerta de cada uno queda hacia afuera de su entrada. */
const HACIA_SU_PUERTA: Readonly<Record<IdPersonaje, Partial<Mando>>> = {
  skayboy: { izquierda: true },
  poligirl: { derecha: true },
};

test('el nivel 1 es el que dice el contrato: dos entradas, dos puertas, nada que devuelva', () => {
  // Si esto falla, los tres casos de abajo están probando otro nivel.
  const caracteres = new Set(NIVEL_1.grilla.join(''));
  for (const c of caracteres) {
    const t = BANCO.leyenda[c];
    assert.ok(t !== undefined, `«${c}» no está en la leyenda`);
    assert.ok(!['molinete', 'mecanismo', 'caja'].includes(t.tipo), `el nivel 1 trae un ${t.tipo}`);
  }
});

test('🔴 T-248: uno solo en su puerta no gana, aunque se quede ahí todo lo que quiera', () => {
  const mundo = crearMundo(BANCO, NIVEL_1);
  const sucesos = correr(mundo, mandos({ skayboy: HACIA_SU_PUERTA.skayboy }), 8);
  assert.ok(mundo.cuerpos.skayboy.enPuerta, 'control: skayboy sí llegó a su puerta');
  assert.ok(!mundo.cuerpos.poligirl.enPuerta);
  assert.ok(!mundo.terminado, 'con uno solo en la puerta el nivel sigue abierto');
  assert.ok(!sucesos.some((s) => s.tipo === 'puerta'), 'y la puerta no suena');
});

test('T-248: con los dos en su puerta se gana, de a dos y con las dos columnas a la vez', () => {
  const mundo = crearMundo(BANCO, NIVEL_1);
  const sucesos = correr(mundo, mandos(HACIA_SU_PUERTA), 3);
  assert.ok(mundo.terminado);
  assert.deepEqual(sucesos.filter((s) => s.tipo === 'puerta'), [{ tipo: 'puerta' }], 'la puerta suena una vez');
});

test('T-248: se gana solo, una columna y después la otra, sin ningún botón que aprender (D-43)', () => {
  const mundo = crearMundo(BANCO, NIVEL_1);
  correr(mundo, mandos({ skayboy: HACIA_SU_PUERTA.skayboy }), 3);
  assert.ok(!mundo.terminado);
  correr(mundo, mandos({ poligirl: HACIA_SU_PUERTA.poligirl }), 3);
  assert.ok(mundo.terminado, 'el que llega solo pasa el nivel 1 igual (BR-25 b)');
});

test('🔴 T-248: el que llegó primero espera gratis — no se mueve, no vuelve, y el reloj es el mismo para los dos', () => {
  const mundo = crearMundo(BANCO, NIVEL_1);
  correr(mundo, mandos({ skayboy: HACIA_SU_PUERTA.skayboy }), 3);
  const quieto = { x: mundo.cuerpos.skayboy.x, y: mundo.cuerpos.skayboy.y };

  // Diez segundos esperando mientras la otra columna ni se toca, y después ella llega.
  const esperando = correr(mundo, mandos(), 10);
  assert.deepEqual({ x: mundo.cuerpos.skayboy.x, y: mundo.cuerpos.skayboy.y }, quieto);
  assert.ok(mundo.cuerpos.skayboy.enPuerta, 'sigue en su puerta');
  assert.deepEqual(esperando, [], 'esperar no produce nada: ni una vuelta, ni un sonido');

  const tiempoAntes = mundo.tiempo;
  correr(mundo, mandos({ poligirl: HACIA_SU_PUERTA.poligirl }), 3);
  assert.ok(mundo.terminado);
  // El único costo de esperar es el reloj, y es el mismo reloj que corre para la que viene.
  assert.ok(mundo.tiempo > tiempoAntes);
  assert.ok(!Object.keys(mundo.cuerpos.skayboy).some((k) => /espera|castigo|costo/i.test(k)));
});

test('🔴 después de ganar el mundo se congela: el reloj no corre y nadie se mueve', () => {
  const mundo = crearMundo(BANCO, NIVEL_1);
  correr(mundo, mandos(HACIA_SU_PUERTA), 3);
  const t = mundo.tiempo;
  const x = mundo.cuerpos.skayboy.x;
  const despues = correr(mundo, mandos({ skayboy: { derecha: true, saltar: true } }), 2);
  assert.equal(mundo.tiempo, t);
  assert.equal(mundo.cuerpos.skayboy.x, x);
  assert.deepEqual(despues, []);
});
