import { test } from 'node:test';
import assert from 'node:assert/strict';

import { FILAS, SIN_UBICAR, filaPorId, filaPorClave, MAX_FILAS_CODIFICABLES } from './filas.ts';
import {
  vacio,
  esValido,
  ubicar,
  vaciar,
  cuentas,
  restan,
  terminado,
  porFila,
  enLaBandeja,
  RepartoInvalido,
  type Conjunto,
} from './tablero.ts';

/** Un conjunto de mentira, con cinco fichas: alcanza para todo lo que hay que probar. */
const CONJUNTO: Conjunto = {
  id: 'prueba',
  nombre: 'Cinco de prueba',
  bajada: 'No sale a ninguna pantalla.',
  formato: 'titulo',
  fichas: [
    { slug: 'a', titulo: 'A', disco: 'gulp', pie: '1', imagen: null },
    { slug: 'b', titulo: 'B', disco: 'gulp', pie: '2', imagen: null },
    { slug: 'c', titulo: 'C', disco: 'oktubre', pie: '1', imagen: null },
    { slug: 'd', titulo: 'D', disco: 'oktubre', pie: '2', imagen: null },
    { slug: 'e', titulo: 'E', disco: 'luzbelito', pie: '1', imagen: null },
  ],
};

/* ==================================================================
   Las filas
   ================================================================== */

test('las cuatro filas entran en tres bits, con lugar de sobra', () => {
  // `ADR-06` empaqueta tres bits por ficha. Si algún día las filas fueran nueve, el
  // formato del link dejaría de alcanzar **en silencio**: entrarían los primeros siete
  // valores y el resto se leería mal.
  assert.ok(FILAS.length < MAX_FILAS_CODIFICABLES, 'las filas ya no entran en tres bits');
  for (const f of FILAS) assert.ok(f.id >= 1 && f.id <= MAX_FILAS_CODIFICABLES);
});

test('ninguna fila comparte número ni clave con otra', () => {
  // Un número repetido no rompe nada visible: reparte dos filas al mismo lugar del link.
  assert.equal(new Set(FILAS.map((f) => f.id)).size, FILAS.length);
  assert.equal(new Set(FILAS.map((f) => f.clave)).size, FILAS.length);
});

test('sin ubicar vale cero, y por eso una carga en blanco abre un tablero vacío', () => {
  assert.equal(SIN_UBICAR, 0);
  assert.equal(filaPorId(SIN_UBICAR), null);
});

test('ningún nombre de fila califica: son lugares, no notas', () => {
  // `BR-22` hecho test. La lista es el vocabulario que convierte una fila en un juicio;
  // si alguna vez aparece acá, el juego empezó a decir cuál es el bueno.
  const juicio = /\b(mejor|peor|top|bueno|malo|excelente|pésimo|nivel|puesto|primero|último)\b/i;
  for (const f of FILAS) {
    assert.doesNotMatch(f.nombre.normalize('NFC'), juicio, `"${f.nombre}" califica`);
  }
});

test('las filas se resuelven por número y por clave', () => {
  for (const f of FILAS) {
    assert.equal(filaPorId(f.id)?.clave, f.clave);
    assert.equal(filaPorClave(f.clave)?.id, f.id);
  }
  assert.equal(filaPorId(99), null);
  assert.equal(filaPorClave('escenario'), null);
});

/* ==================================================================
   El tablero
   ================================================================== */

test('un tablero nuevo tiene todo en la bandeja', () => {
  const r = vacio(5);
  assert.equal(r.length, 5);
  assert.equal(restan(r), 5);
  assert.equal(terminado(r), false);
  assert.deepEqual([...enLaBandeja(CONJUNTO, r)].map((f) => f.slug), ['a', 'b', 'c', 'd', 'e']);
});

test('ubicar devuelve un tablero nuevo y no toca el anterior', () => {
  // Si mutara, el tablero que ya se dibujó y el que se va a dibujar serían el mismo
  // objeto, y comparar "cambió algo" dejaría de ser posible.
  const antes = vacio(5);
  const despues = ubicar(antes, 2, 1);
  assert.equal(antes[2], SIN_UBICAR, 'ubicar mutó el tablero de entrada');
  assert.equal(despues[2], 1);
});

test('sacar una ficha de una fila la devuelve a la bandeja, no la borra', () => {
  // La regla del género, y la que hace que el conjunto sea fijo: una ficha nunca se pierde.
  const r = ubicar(ubicar(vacio(5), 0, 3), 0, SIN_UBICAR);
  assert.equal(restan(r), 5);
  assert.equal(r.length, 5);
});

test('ubicar rechaza una posición o una fila que no existen', () => {
  const r = vacio(5);
  assert.throws(() => ubicar(r, 5, 1), RepartoInvalido);
  assert.throws(() => ubicar(r, -1, 1), RepartoInvalido);
  assert.throws(() => ubicar(r, 0, 9), RepartoInvalido);
});

test('vaciar deja todo en la bandeja sin cambiar el largo', () => {
  const lleno = [1, 2, 3, 4, 1];
  assert.deepEqual(vaciar(lleno), [0, 0, 0, 0, 0]);
});

test('las cuentas son por fila y no comparan nada', () => {
  // `BR-22`: `cuentas` es orientación, como el "3 de 10" del test de dos ejes. Devuelve
  // cuántas hay en cada lugar y **no** cuál gana.
  const r = [1, 1, 3, 0, 4];
  const c = cuentas(r);
  assert.equal(c[1], 2);
  assert.equal(c[2], 0);
  assert.equal(c[3], 1);
  assert.equal(c[4], 1);
  assert.equal(c[SIN_UBICAR], 1);
});

test('terminado es exactamente "no queda nada en la bandeja"', () => {
  assert.equal(terminado([1, 2, 3, 4, 1]), true);
  assert.equal(terminado([1, 2, 3, 4, 0]), false);
});

test('un reparto de otro largo no es válido para este conjunto', () => {
  // La guarda de lo que entra por el link. Ver `desafio.ts`, forma `reparto`.
  assert.equal(esValido([1, 2, 3, 4], 5), false);
  assert.equal(esValido([1, 2, 3, 4, 1, 1], 5), false);
  assert.equal(esValido([1, 2, 3, 4, 9], 5), false);
  assert.equal(esValido([1, 2, 3, 4, 1.5], 5), false);
  assert.equal(esValido('no soy un reparto', 5), false);
  assert.equal(esValido([1, 2, 3, 4, 0], 5), true);
});

test('porFila devuelve siempre las cuatro, aunque alguna esté vacía', () => {
  // Una fila vacía se muestra vacía. Esconderla haría que el tablero cambie de forma
  // mientras se juega, y el destino se movería debajo del pulgar.
  const armadas = porFila(CONJUNTO, [1, 1, 0, 4, 0]);
  assert.equal(armadas.length, FILAS.length);
  assert.deepEqual(armadas.map((a) => a.fichas.length), [2, 0, 0, 1]);
});

test('dentro de una fila el orden es el del catálogo, no el de llegada', () => {
  // **La decisión que hace que un link compartido diga la verdad.** El link lleva en qué
  // fila está cada ficha y nada más; si la pantalla ordenara por llegada, el que recibe la
  // lista vería otro orden que el que la armó, sin que nada avise.
  const primeroLaE = ubicar(ubicar(vacio(5), 4, 1), 0, 1);
  assert.deepEqual(porFila(CONJUNTO, primeroLaE)[0]!.fichas.map((f) => f.slug), ['a', 'e']);
});

test('porFila rechaza un reparto que no es de este conjunto', () => {
  assert.throws(() => porFila(CONJUNTO, [1, 2, 3]), RepartoInvalido);
});

test('este motor no sabe calcular un puntaje: BR-22 desde el tipo', () => {
  // El mismo mecanismo de `dos-ejes/partida.ts`: lo que no está no se puede mostrar. Si
  // alguna vez aparece acá una función que compare filas, alguien tuvo que escribirla a
  // propósito, y esta línea le va a preguntar por qué.
  const exportado = Object.keys({
    vacio, esValido, ubicar, vaciar, cuentas, restan, terminado, porFila, enLaBandeja,
  });
  const sospechosas = exportado.filter((n) => /punt|score|gana|mejor|ranking|orden(ar)?$/i.test(n));
  assert.deepEqual(sospechosas, []);
});
