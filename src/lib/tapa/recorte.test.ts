/**
 * Que el pedazo vuelva a SU lugar.
 *
 * `recorte.ts` repite la tabla de zooms de `scripts/generar-tapas.mjs` para que el navegador
 * sepa dónde cae cada recorte adentro de la tapa. Dos tablas son dos verdades: este archivo
 * lee el generador y falla si dejan de coincidir, que es lo que pasaría el día que alguien
 * mueva un centro y regenere los zooms.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CENTROS, LADO, recorteDe } from './recorte.ts';

const generador = readFileSync('scripts/generar-tapas.mjs', 'utf-8');

/** Las entradas de `ZOOMS` del generador, leídas del texto. */
const delGenerador = [
  ...generador.matchAll(
    /\{\s*slug:\s*'([^']+)',\s*master:\s*'([^']+)',\s*centro:\s*\[([\d.]+),\s*([\d.]+)\],\s*nivel:\s*'(\w+)'\s*\}/g,
  ),
].map((m) => ({ slug: m[1]!, master: m[2]!, centro: [Number(m[3]), Number(m[4])], nivel: m[5]! }));

/** De qué master sale la ficha de cada disco: `FICHAS` del generador. */
const fichas = new Map(
  [...(generador.match(/const FICHAS = \{([\s\S]*?)\};/)?.[1] ?? '').matchAll(/'?([\w-]+)'?:\s*'([^']+)'/g)].map(
    (m) => [m[1]!, m[2]!] as const,
  ),
);

test('el lector del generador encuentra los diez zooms y las diez fichas', () => {
  assert.equal(delGenerador.length, 10);
  assert.equal(fichas.size, 10);
});

test('el lado de cada nivel es el del generador', () => {
  const zoom = generador.match(/const ZOOM = \{\s*facil:\s*([\d.]+),\s*media:\s*([\d.]+),\s*dificil:\s*([\d.]+)\s*\}/);
  assert.ok(zoom, 'no encuentro `ZOOM` en el generador');
  assert.deepEqual({ ...LADO }, { facil: Number(zoom[1]), media: Number(zoom[2]), dificil: Number(zoom[3]) });
});

test('cada recorte que sale de la tapa de adelante está en la tabla, con el mismo centro', () => {
  for (const z of delGenerador) {
    const saleDeLaFicha = fichas.get(z.slug) === z.master;
    if (!saleDeLaFicha) {
      assert.equal(recorteDe(z.slug), null, `${z.slug}: el zoom sale de ${z.master}, que no es la tapa que se imprime`);
      continue;
    }
    const dato = CENTROS[z.slug];
    assert.ok(dato, `${z.slug}: falta en la tabla`);
    assert.deepEqual([...dato.centro], z.centro, `${z.slug}: el centro no es el del generador`);
    assert.equal(dato.nivel, z.nivel, `${z.slug}: el nivel no es el del generador`);
  }
  const deMas = Object.keys(CENTROS).filter((s) => !delGenerador.some((z) => z.slug === s));
  assert.deepEqual(deMas, [], 'la tabla nombra recortes que el generador no corta');
});

test('ningún recorte se sale de la tapa', () => {
  for (const slug of Object.keys(CENTROS)) {
    const r = recorteDe(slug)!;
    assert.ok(
      r.x >= 0 && r.y >= 0 && r.x + r.lado <= 1 + 1e-9 && r.y + r.lado <= 1 + 1e-9,
      `${slug}: ${JSON.stringify(r)}`,
    );
  }
  // Oktubre: el centro está tan abajo que el cuadrado se empuja hacia adentro.
  assert.ok(Math.abs(recorteDe('oktubre')!.y - 0.6) < 1e-9);
  assert.equal(recorteDe('no-existe'), null);
});
