/**
 * Ningún ítem de "Completá la letra" se regala: ni un distractor que se delata por la forma
 * (`generar-letra.mjs`, `sirveDeDistractor()` y `formaDelDistractor()`), ni una respuesta
 * escrita en su propio contexto (`respuestaALaVista`).
 *
 * El defecto que cierra: hasta el ciclo 16, 11 de los 19 ítems jugables traían al menos una
 * opción que se descartaba sin saber nada del tema — "GUITARRA" (un rótulo de la tablatura),
 * "tiem" (de "tiem - po"), "Muchachitas" con mayúscula al lado de "educaditos". Una opción
 * así le regala el punto al que no se sabe el tema (`D-14`). Corre sobre el banco entero, no
 * solo sobre los `listo`: un borrador promovido mañana tiene que llegar limpio. El rojo es
 * el banco anterior (`git show b1a5bb4:src/data/letra.json`): falla los cuatro primeros.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

interface Opcion { texto: string; correcta: boolean }
interface ItemCrudo { id: string; opciones: Opcion[] }

const banco = JSON.parse(readFileSync('src/data/letra.json', 'utf8')) as { items: ItemCrudo[] };
const minuscula = (s: string) => s === s.toLocaleLowerCase('es');
const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function malos(regla: (d: string, respuesta: string) => boolean): string[] {
  const salida: string[] = [];
  for (const it of banco.items) {
    const respuesta = it.opciones.find((o) => o.correcta)!.texto;
    for (const o of it.opciones) if (!o.correcta && regla(o.texto, respuesta)) salida.push(`${it.id}: ${o.texto}`);
  }
  return salida;
}

test('ningún distractor va en mayúscula sostenida: eso es un rótulo de la tablatura', () => {
  assert.deepEqual(malos((d) => d.length > 1 && d === d.toLocaleUpperCase('es') && !minuscula(d)), []);
});

test('ningún distractor es una sílaba cortada', () => {
  assert.deepEqual(malos((d) => d.includes('-')), []);
});

test('con la respuesta en minúscula, las cuatro opciones van en minúscula', () => {
  assert.deepEqual(malos((d, r) => minuscula(r) && !minuscula(d)), []);
});

test('con la respuesta abriendo en mayúscula, las cuatro abren en mayúscula', () => {
  assert.deepEqual(malos((d, r) => !minuscula(r) && minuscula(d[0]!)), []);
});

test('ninguna respuesta está escrita en un verso de contexto de su propio ítem', () => {
  // La otra puerta por la que el ítem se regala: el estribillo que repite la palabra en el
  // renglón vecino. En el banco de `b1a5bb4` eran 80 ítems, cinco de ellos `listo`
  // («Rockeros bonitos, [educaditos]» debajo de otro «Rockeros bonitos, educaditos»).
  const palabras = (s: string) => sinTildes(s).split(/[^\p{L}\p{N}']+/u).filter(Boolean);
  const aLaVista = (banco.items as Array<ItemCrudo & { hueco: { respuesta: string }; contexto: { antes: string[]; despues: string[] } }>)
    .filter((it) => [...it.contexto.antes, ...it.contexto.despues].flatMap(palabras).includes(sinTildes(it.hueco.respuesta)))
    .map((it) => it.id);
  assert.deepEqual(aLaVista, []);
});

test('las cuatro opciones de cada ítem son distintas, sin contar mayúsculas ni tildes', () => {
  const repetidas = banco.items
    .filter((it) => new Set(it.opciones.map((o) => sinTildes(o.texto))).size !== it.opciones.length)
    .map((it) => it.id);
  assert.deepEqual(repetidas, []);
});
