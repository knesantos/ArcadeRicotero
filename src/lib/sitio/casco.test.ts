/**
 * El casco del último bondi (`D-85`, `sitio/casco.ts`): la baldosa se repite sin corte, y es
 * máscara de verdad (trazo blanco sobre nada, sin color propio).
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { cascoSvg, LADO_CASCO, MARGEN_CASCO, piezasDelCasco } from './casco.ts';

test('nada salvo las costuras toca el borde de la baldosa: el mosaico no tiene corte', () => {
  const afuera = piezasDelCasco().puntos.filter(
    ([x, y]) => x < MARGEN_CASCO || y < MARGEN_CASCO || x > LADO_CASCO - MARGEN_CASCO || y > LADO_CASCO - MARGEN_CASCO,
  );
  assert.deepEqual(afuera, []);
});

test("la baldosa es una máscara: solo blanco y negro, y del lado que dice el portal", async () => {
  const svg = cascoSvg();
  assert.match(svg, new RegExp(`width="${LADO_CASCO}" height="${LADO_CASCO}"`));
  const colores = new Set([...svg.matchAll(/(?:fill|stroke)="(#[0-9a-f]+)"/gi)].map((m) => m[1]!.toLowerCase()));
  assert.deepEqual([...colores].sort(), ['#000', '#fff']);
  // El portal la pide con este lado: si cambia uno, el mosaico se estira.
  const { readFileSync } = await import('node:fs');
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  assert.match(sitio, new RegExp(`mask-size: ${LADO_CASCO}px ${LADO_CASCO}px`));
});
