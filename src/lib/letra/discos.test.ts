/**
 * Los títulos de los discos que ve el navegador (`discos.ts`).
 *
 * El defecto que cierra: la cabecera de "Completá la letra" y el índice del cancionero
 * armado nombraban el disco desde el slug, y salía "ULTIMO BONDI A FINISTERRE" o "GULP" sin
 * signo. Cada caso tiene su rojo dicho al lado.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

import { DISCOS, TITULO_DEL_DISCO, tituloDelDisco } from './discos.ts';
import { TITULO_DE_DISCO } from '../sitio/arte.ts';
import { FICHAS } from '../cancionero/banco.ts';

test('cada uno de los diez discos tiene su título, y ninguno de más', () => {
  assert.deepEqual(Object.keys(TITULO_DEL_DISCO).sort(), [...DISCOS].sort());
});

test('el crédito del pie usa el mismo mapa, no una copia', () => {
  // Rojo: volver a escribir el mapa en `arte.ts`. Dos copias ya habían empezado a diferir
  // con `FICHAS` en una mayúscula.
  assert.equal(TITULO_DE_DISCO, TITULO_DEL_DISCO);
});

test('los títulos coinciden con los de las fichas del cancionero, letra por letra salvo mayúsculas', () => {
  // `FICHAS` escribe "estás liquidado" en minúscula y el resto del sitio "Estás": esa
  // diferencia es conocida y no la resuelve este test. Lo que sí caza es un título que
  // cambió de palabras o perdió una tilde en uno de los dos lados.
  for (const f of FICHAS) {
    assert.equal(TITULO_DEL_DISCO[f.slug].toLowerCase(), f.titulo.toLowerCase(), f.slug);
  }
});

test('ninguna isla arma el nombre de un disco desde su slug', () => {
  // Rojo: `item.tema.disco.replace(/-/g, ' ')` en `partida-letra.ts`, como estaba.
  const culpables = readdirSync('src/scripts')
    .filter((f) => f.endsWith('.ts'))
    .filter((f) => /disco\.replace\(\s*\/-\/g/.test(readFileSync(`src/scripts/${f}`, 'utf8')));
  assert.deepEqual(culpables, []);
});

test('un slug que no es de los diez se muestra como viene', () => {
  assert.equal(tituloDelDisco('ultimo-bondi-a-finisterre'), 'Último bondi a Finisterre');
  assert.equal(tituloDelDisco('gulp'), 'Gulp!');
  assert.equal(tituloDelDisco('disco-inventado'), 'disco-inventado');
});

test('discos.ts sigue sin importar nada: es lo que deja que lo use el navegador', () => {
  const fuente = readFileSync('src/lib/letra/discos.ts', 'utf8');
  assert.doesNotMatch(fuente, /^\s*import\s/m);
});
