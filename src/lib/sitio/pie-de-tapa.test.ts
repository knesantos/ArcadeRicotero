/**
 * El pie de la tapa en la ficha de disco de la Redondopedia dice la verdad (`CNT-24`,
 * `PIE_DE_TAPA` en `copy.ts`).
 *
 * El defecto que cierra: la página escribía "Tapa: Rocambole (Ricardo Cohen)" fijo en los diez
 * discos. Para *Lobo suelto* y *Cordero atado* era más angosto que la ficha (`RES-40`), y para
 * *La mosca y la sopa* era una atribución que el proyecto todavía no puede sostener (`RES-44`).
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { PIE_DE_TAPA } from './copy.ts';
import { DISCOS, TITULO_DEL_DISCO } from '../letra/discos.ts';

interface ItemTapa { id: string; imagen: { disco: string; edicion: string; credito: { autor: string } } }
const tapas = (JSON.parse(readFileSync('src/data/tapa.json', 'utf8')) as { items: ItemTapa[] }).items;
/** "¡Bang! ¡Bang!... Estás" y "¡Bang! ¡Bang!… Estás" son el mismo disco: se comparan las letras. */
const letras = (s: string) => s.normalize('NFD').replace(/[^\p{L}]/gu, '').toLowerCase();

test('cada uno de los diez discos tiene su pie, y ninguno de más', () => {
  assert.deepEqual(Object.keys(PIE_DE_TAPA).sort(), [...DISCOS].sort());
});

test('el pie de la Redondopedia nombra al mismo autor que el crédito del juego de tapas', () => {
  // Rojo: el pie fijo de antes, o un `tapa.json` que vuelva a firmar el doble solo a Rocambole.
  // Solo compara frontales: `TP-010` es un recorte de la contratapa de *La mosca y la sopa*,
  // que sí es de Rocambole, y la Redondopedia muestra el frontal, que es el que está en duda.
  const frontales = tapas.filter((it) => !/contratapa/i.test(it.imagen.edicion));
  assert.equal(frontales.length, tapas.length - 1, 'cambió qué ítems son contratapa: revisar este test');
  for (const it of frontales) {
    const slug = DISCOS.find((d) => letras(TITULO_DEL_DISCO[d]) === letras(it.imagen.disco));
    assert.ok(slug, `${it.imagen.disco} no es uno de los diez`);
    assert.ok(
      PIE_DE_TAPA[slug].includes(it.imagen.credito.autor),
      `${slug}: el pie dice «${PIE_DE_TAPA[slug]}» y tapa.json acredita a «${it.imagen.credito.autor}»`,
    );
  }
});

test('la tapa de La mosca y la sopa no se le acredita a nadie mientras RES-44 siga abierta', () => {
  assert.doesNotMatch(PIE_DE_TAPA['la-mosca-y-la-sopa'], /Rocambole|Cohen/);
});

test('la ficha de disco toma el pie del mapa y no lo escribe a mano', () => {
  const pagina = readFileSync('src/pages/redondopedia/[slug].astro', 'utf8');
  assert.match(pagina, /PIE_DE_TAPA\[/);
  assert.doesNotMatch(pagina, /Tapa: Rocambole/);
});
