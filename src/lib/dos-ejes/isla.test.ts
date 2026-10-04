/**
 * Lo que la isla de "¿Qué tipo de ricotero sos?" tiene que seguir haciendo (`D-57` puntos 12 y
 * 13), mirado sobre su fuente.
 *
 * Una isla no corre en Node, así que esto no la ejecuta: lee el archivo y exige las piezas que
 * cerraron los dos defectos más graves del relevamiento del ciclo 18 —el doble toque que
 * contestaba la pregunta siguiente, y el foco que caía al `<body>` en cada hoja—. Si alguien
 * las saca, el build se cae acá con el motivo, no en el teléfono de nadie.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ISLA = readFileSync('src/scripts/partida-dos-ejes.ts', 'utf-8');
const TOKENS = readFileSync('src/styles/tokens.css', 'utf-8');

test('el toque bloquea las dos opciones y espera el token de la pausa', () => {
  assert.match(ISLA, /if \(bloqueado\) return;/, 'elegir() no se protege del segundo toque');
  assert.match(ISLA, /b\.disabled = true/, 'las opciones no quedan inertes durante la pausa');
  assert.match(ISLA, /--pausa-eleccion/, 'la pausa no sale del token');
  assert.ok(!/setTimeout\([^,]+,\s*\d/.test(ISLA), 'hay una pausa escrita a mano en milisegundos');
});

test('la pausa es información: el corte de movimiento reducido no la toca', () => {
  assert.match(TOKENS, /--pausa-eleccion:\s*\d+ms;/);
  const corte = TOKENS.slice(TOKENS.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.ok(!/--pausa-eleccion/.test(corte), 'con la pausa en cero vuelve el doble toque');
});

test('el foco va al enunciado de cada hoja y al nombre del resultado', () => {
  assert.match(ISLA, /enfocar\(enunciado\)/, 'la hoja nueva no se lleva el foco');
  assert.match(ISLA, /enfocar\(nombre\)/, 'el resultado no se lleva el foco');
  assert.match(ISLA, /setAttribute\('role', 'group'\)/, 'las opciones no van agrupadas');
  assert.match(ISLA, /setAttribute\('aria-labelledby', enunciado\.id\)/, 'el grupo no se nombra con el enunciado');
  assert.match(ISLA, /setAttribute\('role', 'status'\)/, 'el avance no se anuncia');
});

test('volver a la anterior no toca el historial: la analítica no cuenta hojas (D-56)', () => {
  assert.match(ISLA, /function volverAnterior/);
  assert.ok(!/history\.(pushState|replaceState)/.test(ISLA));
});

test('el resultado no muestra ningún número: no hay de dónde sacarlo', () => {
  // `resolverCuadrante` no devuelve números (`partida.test.ts`); acá se vigila que la isla no
  // cuente por su cuenta los polos elegidos para pintarlos.
  assert.ok(!/elegidos\.filter\(/.test(ISLA), 'la isla cuenta polos');
  assert.ok(!/elegidos\.length\s*[^=]/.test(ISLA.replace(/elegidos\.length = 0/g, '')), 'la isla mira cuántos eligió');
});

test('compartir lleva la tarjeta ya bajada, y el enlace es la postal de la identidad', () => {
  assert.match(ISLA, /fetch\(rutaDeTarjeta\(r\.id\)\)/, 'la tarjeta no se baja al pintar el resultado');
  assert.match(ISLA, /archivo: tarjeta/);
  assert.match(ISLA, /\/juegos\/\$\{JUEGO\}\/\$\{slugDe\(r\.id\)\}\//, 'el enlace no es la postal');
});
