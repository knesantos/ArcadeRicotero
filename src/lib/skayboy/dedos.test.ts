import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MARGEN_DEL_DEDO,
  SIN_TECLA,
  apoyarDedo,
  distanciaACaja,
  moverDedo,
  teclaBajoElDedo,
  teclasDelDedo,
  type CajasDelMando,
} from './dedos.ts';

/**
 * La columna del mueble a ×1 apilado, como la mide el navegador a 390 de ancho (`UX-28` §2.1): el
 * bloque de saltar arriba, 112 × 244; dieciséis de aire; y las dos flechas de 52 × 64 con ocho
 * entre ellas.
 */
const COLUMNA: CajasDelMando = {
  salto: { izquierda: 0, arriba: 0, ancho: 112, alto: 244 },
  izquierda: { izquierda: 0, arriba: 260, ancho: 52, alto: 64 },
  derecha: { izquierda: 60, arriba: 260, ancho: 52, alto: 64 },
};

test('la distancia a una caja es cero adentro y la del borde más cercano afuera', () => {
  const caja = { izquierda: 10, arriba: 10, ancho: 10, alto: 10 };
  assert.equal(distanciaACaja(caja, 15, 15), 0);
  assert.equal(distanciaACaja(caja, 10, 20), 0, 'el borde es adentro');
  assert.equal(distanciaACaja(caja, 25, 15), 5);
  assert.equal(distanciaACaja(caja, 23, 24), 5, 'en diagonal, la hipotenusa');
});

test('adentro de una tecla, esa tecla', () => {
  assert.equal(teclaBajoElDedo(COLUMNA, 56, 100), 'salto');
  assert.equal(teclaBajoElDedo(COLUMNA, 20, 290), 'izquierda');
  assert.equal(teclaBajoElDedo(COLUMNA, 90, 290), 'derecha');
});

test('en las franjas entre teclas no hay zona muerta: gana la más cercana', () => {
  // Los ocho de aire entre las flechas: el pulgar que cambia de dirección pasa por acá.
  assert.equal(teclaBajoElDedo(COLUMNA, 53, 290), 'izquierda');
  assert.equal(teclaBajoElDedo(COLUMNA, 59, 290), 'derecha');
  // Los dieciséis entre el piso y el bloque de saltar.
  assert.equal(teclaBajoElDedo(COLUMNA, 20, 247), 'salto');
  assert.equal(teclaBajoElDedo(COLUMNA, 20, 257), 'izquierda');
});

test('a igual distancia del salto y de una flecha, gana la flecha: saltar sin querer es peor', () => {
  assert.equal(teclaBajoElDedo(COLUMNA, 20, 252), 'izquierda');
  assert.equal(teclaBajoElDedo(COLUMNA, 90, 252), 'derecha');
});

test('un dedo que se corre un poco afuera de la columna sigue apretando; lejos, nada', () => {
  assert.equal(teclaBajoElDedo(COLUMNA, 112 + MARGEN_DEL_DEDO, 290), 'derecha');
  assert.equal(teclaBajoElDedo(COLUMNA, 112 + MARGEN_DEL_DEDO + 1, 290), null);
  assert.equal(teclaBajoElDedo(COLUMNA, 56, -MARGEN_DEL_DEDO - 1), null);
});

test('las teclas escondidas no cuentan (D-55: con mouse los botones miden cero)', () => {
  const escondidas: CajasDelMando = {
    salto: { izquierda: 0, arriba: 0, ancho: 0, alto: 0 },
    izquierda: { izquierda: 0, arriba: 0, ancho: 0, alto: 0 },
    derecha: { izquierda: 0, arriba: 0, ancho: 0, alto: 0 },
  };
  assert.equal(teclaBajoElDedo(escondidas, 0, 0), null);
  assert.equal(teclaBajoElDedo({}, 0, 0), null);
  // Y con solo el salto a la vista, lo que queda cerca del salto es salto: el piso escondido no
  // le roba el dedo.
  assert.equal(teclaBajoElDedo({ ...escondidas, salto: COLUMNA.salto }, 20, 270), 'salto');
});

test('el dedo que baja aprieta lo que tiene abajo: en saltar, salta parado', () => {
  assert.deepEqual(apoyarDedo('salto'), { tecla: 'salto', arrastre: null });
  assert.deepEqual(apoyarDedo('derecha'), { tecla: 'derecha', arrastre: null });
  assert.equal(apoyarDedo(null), SIN_TECLA);
});

test('el pulgar rueda de una flecha a la otra sin levantarse', () => {
  const izquierda = apoyarDedo('izquierda');
  assert.deepEqual(teclasDelDedo(moverDedo(izquierda, 'derecha')), ['derecha']);
});

test('de una flecha a saltar, la dirección viaja con el pulgar: corre saltando con un dedo', () => {
  const corriendo = apoyarDedo('derecha');
  const saltando = moverDedo(corriendo, 'salto');
  assert.deepEqual(saltando, { tecla: 'salto', arrastre: 'derecha' });
  assert.deepEqual(teclasDelDedo(saltando), ['salto', 'derecha']);
  // Y vuelve al piso: queda la flecha que pisa, nada más.
  assert.deepEqual(teclasDelDedo(moverDedo(saltando, 'izquierda')), ['izquierda']);
  assert.deepEqual(teclasDelDedo(moverDedo(saltando, 'derecha')), ['derecha']);
});

test('el que bajó en saltar no arrastra nada: saltar parado sigue siendo parado', () => {
  const parado = apoyarDedo('salto');
  assert.deepEqual(teclasDelDedo(parado), ['salto']);
  assert.equal(moverDedo(parado, 'salto'), parado, 'sin cambio, el mismo objeto');
});

test('si el dedo se va de la columna suelta todo, y si vuelve aprieta lo que encuentra', () => {
  const saltando = moverDedo(apoyarDedo('izquierda'), 'salto');
  const afuera = moverDedo(saltando, null);
  assert.equal(afuera, SIN_TECLA);
  assert.deepEqual(teclasDelDedo(afuera), []);
  assert.deepEqual(teclasDelDedo(moverDedo(afuera, 'salto')), ['salto'], 'vuelve como recién apoyado');
});

test('sin cambio, moverDedo devuelve el mismo objeto: la isla no toca el DOM de más', () => {
  const d = apoyarDedo('izquierda');
  assert.equal(moverDedo(d, 'izquierda'), d);
});
