/**
 * La gente mirando al pie del portal (`D-62`) es un recorte en dos tintas, no una foto.
 *
 * `scripts/generar-multitud.mjs` no corre en el build: el PNG vive en `public/` y se
 * regenera a mano. Este archivo mira lo que el recorte promete para poder ir sin velo y a
 * tinta plena, que es lo único que lo separa de una tapa de fondo:
 *
 * - que el negro de la imagen se haya ido de verdad: ni un gris, ni un rectángulo de otro
 *   negro alrededor de la gente — donde no hay gente tiene que verse `--fondo`;
 * - que lo que queda sea `--papel`, el rojo de la bandera o una mezcla de los dos;
 * - y que el crédito vaya arriba de la gente y no encima de una cara.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

import { multitudDeDisco } from './arte.ts';

const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
const rgbDe = (nombre: string): [number, number, number] => {
  const m = tokens.match(new RegExp(`${nombre}:\\s*#([0-9a-fA-F]{6})`));
  assert.ok(m, `falta ${nombre} en tokens.css`);
  return [0, 2, 4].map((i) => parseInt(m![1]!.slice(i, i + 2), 16)) as [number, number, number];
};

const PAPEL = rgbDe('--papel');
const ROJO = rgbDe('--disco-oktubre-tinta');
/** Lo que pesa hoy (64 KB) con aire. Lo paga el teléfono, aunque cargue al final. */
const TOPE_KB = 90;

/** Cuánto se aleja un color del tramo que va de `--papel` al rojo, en niveles de 0 a 255. */
function distanciaAlTramo([r, g, b]: [number, number, number]): number {
  const v = [ROJO[0] - PAPEL[0], ROJO[1] - PAPEL[1], ROJO[2] - PAPEL[2]];
  const w = [r - PAPEL[0], g - PAPEL[1], b - PAPEL[2]];
  const t = Math.min(1, Math.max(0, (v[0]! * w[0]! + v[1]! * w[1]! + v[2]! * w[2]!) / (v[0]! ** 2 + v[1]! ** 2 + v[2]! ** 2)));
  return Math.hypot(w[0]! - t * v[0]!, w[1]! - t * v[1]!, w[2]! - t * v[2]!);
}

const ruta = multitudDeDisco('oktubre');

test('el portal tiene su multitud, y no pesa de más', () => {
  // Sin el archivo, `multitudDeDisco` devuelve null y el pie vuelve a la pasada sin avisar.
  assert.equal(ruta, '/arte/multitud-oktubre.png', 'falta el recorte: correr node scripts/generar-multitud.mjs');
  const kb = statSync(join('public', ruta!)).size / 1024;
  assert.ok(kb <= TOPE_KB, `multitud-oktubre.png pesa ${kb.toFixed(1)} KB, el tope es ${TOPE_KB}`);
});

test('el negro se fue: arriba no hay nada, y lo que hay es papel o bandera', async () => {
  const { data, info } = await sharp(join('public', ruta!)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  // El recorte arranca arriba del primer puño: si la primera fila tiene algo, quedó un
  // pedazo de wordmark, del rayo o del negro de la imagen.
  for (let x = 0; x < info.width; x++) {
    assert.equal(data[x * 4 + 3], 0, `la primera fila no es transparente en x=${x}`);
  }

  // Todo lo que se ve es una de las dos tintas, o el borde donde se tocan. Un gris o un
  // negro opaco sería el negro de la imagen, que no es el del sitio.
  let peor = 0;
  let donde = -1;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3]! < 64) continue;
    const d = distanciaAlTramo([data[i]!, data[i + 1]!, data[i + 2]!]);
    if (d > peor) [peor, donde] = [d, i / 4];
  }
  assert.ok(
    peor <= 6,
    `un píxel se aleja ${peor.toFixed(1)} niveles de las dos tintas (x=${donde % info.width}, y=${Math.floor(donde / info.width)})`,
  );
});

test('el crédito va arriba de la gente, nunca encima de una cara', () => {
  // Es lo que deja ir al recorte sin velo (`D-21` vela una tapa porque tiene letra encima).
  const pie = readFileSync('src/components/PieImprenta.astro', 'utf-8');
  const credito = pie.indexOf('class="pie-sitio"');
  const gente = pie.indexOf('class="multitud-pie"');
  assert.ok(credito > 0 && gente > 0, 'cambió el marcado del pie: revisar este test');
  assert.ok(gente > credito, 'la multitud quedó antes que el crédito en el pie');
  assert.ok(existsSync('scripts/generar-multitud.mjs'), 'falta el script que produce el recorte');
});
