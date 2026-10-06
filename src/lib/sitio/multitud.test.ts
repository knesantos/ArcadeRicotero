/**
 * La multitud de *Oktubre* en el portal (`D-63` y su enmienda 1) es recorte en tintas del
 * sitio, no una foto.
 *
 * `scripts/generar-multitud.mjs` no corre en el build: los PNG viven en `public/` y se
 * regeneran a mano. Este archivo mira lo que prometen para poder ir sin velo, que es lo
 * único que los separa de una tapa de fondo:
 *
 * - la fila del pie: que el negro de la imagen se haya ido —arriba de la gente se ve
 *   `--fondo` y nada más—, que lo que queda sea `--papel`, el rojo de la bandera o la
 *   silueta en `--fondo`, que la silueta tape de verdad, y que el crédito vaya arriba;
 * - la multitud de lejos: que estén las tres máscaras, que el mosaico no tenga costura, y
 *   que la página las pida solo si están.
 *
 * Lo que pesa su tinta sobre el texto lo mide `contraste.test.ts`.
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
const FONDO = rgbDe('--fondo');
/** Lo que pesa hoy (64 KB) con aire. Lo paga el teléfono, aunque cargue al final. */
const TOPE_KB = 90;

/**
 * Cuánto se aleja un color del triángulo de las tres tintas —`--papel`, el rojo de la bandera
 * y `--fondo`—, en niveles de 0 a 255. Adentro del triángulo está toda mezcla posible de las
 * tres, que es lo único que puede haber: tinta pura, el borde entre dos tintas, o un trazo
 * que se apoya sobre la silueta.
 */
function distanciaAlTriangulo(c: [number, number, number]): number {
  const u = [PAPEL[0] - FONDO[0], PAPEL[1] - FONDO[1], PAPEL[2] - FONDO[2]];
  const v = [ROJO[0] - FONDO[0], ROJO[1] - FONDO[1], ROJO[2] - FONDO[2]];
  const w = [c[0] - FONDO[0], c[1] - FONDO[1], c[2] - FONDO[2]];
  const p = (a: number[], b: number[]) => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
  // Cuadrados mínimos para w = a·u + b·v, y después a y b se recortan al triángulo.
  const [uu, uv, vv, wu, wv] = [p(u, u), p(u, v), p(v, v), p(w, u), p(w, v)];
  const det = uu * vv - uv * uv;
  let a = Math.max(0, (wu * vv - wv * uv) / det);
  let b = Math.max(0, (wv * uu - wu * uv) / det);
  if (a + b > 1) [a, b] = [a / (a + b), b / (a + b)];
  return Math.hypot(w[0]! - a * u[0]! - b * v[0]!, w[1]! - a * u[1]! - b * v[1]!, w[2]! - a * u[2]! - b * v[2]!);
}

const ruta = multitudDeDisco('oktubre');

test('el portal tiene su multitud, y no pesa de más', () => {
  // Sin el archivo, `multitudDeDisco` devuelve null y el pie vuelve a la pasada sin avisar.
  assert.equal(ruta, '/arte/multitud-oktubre.png', 'falta el recorte: correr node scripts/generar-multitud.mjs');
  const kb = statSync(join('public', ruta!)).size / 1024;
  assert.ok(kb <= TOPE_KB, `multitud-oktubre.png pesa ${kb.toFixed(1)} KB, el tope es ${TOPE_KB}`);
});

test('el negro se fue: arriba no hay nada, y lo que hay son las tres tintas', async () => {
  const { data, info } = await sharp(join('public', ruta!)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  // El recorte arranca arriba del primer puño: si la primera fila tiene algo, quedó un
  // pedazo de wordmark, del rayo o del negro de la imagen.
  for (let x = 0; x < info.width; x++) {
    assert.equal(data[x * 4 + 3], 0, `la primera fila no es transparente en x=${x}`);
  }

  // Todo lo que se ve es una de las tres tintas o una mezcla de ellas. Un gris o un negro
  // que no sea `--fondo` sería el negro de la imagen, que no es el del sitio.
  let peor = 0;
  let donde = -1;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3]! < 64) continue;
    const d = distanciaAlTriangulo([data[i]!, data[i + 1]!, data[i + 2]!]);
    if (d > peor) [peor, donde] = [d, i / 4];
  }
  assert.ok(
    peor <= 6,
    `un píxel se aleja ${peor.toFixed(1)} niveles de las tres tintas (x=${donde % info.width}, y=${Math.floor(donde / info.width)})`,
  );
});

test('la fila de adelante tapa a la de atrás: abajo de todo no hay un hueco', async () => {
  // Detrás de esta fila están los planos de la multitud que se acerca. Si la silueta no
  // llegara al piso en alguna columna, la gente de atrás se vería por adentro de una cara.
  const { data, info } = await sharp(join('public', ruta!)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const ultima = (info.height - 1) * info.width * 4;
  const huecos: number[] = [];
  for (let x = 0; x < info.width; x++) if (data[ultima + x * 4 + 3]! < 250) huecos.push(x);
  assert.deepEqual(huecos, [], `la última fila no es opaca en ${huecos.length} columnas`);
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

// ---------------------------------------------------------------- la multitud de lejos

const MASCARAS = ['clara', 'roja', 'silueta'] as const;
/** Lo que pesan hoy (61, 18 y 3 KB) con aire: es fondo, y carga en la portada. */
const TOPE_KB_MASCARAS = 110;

test('la multitud de lejos: están las tres máscaras, del mismo tamaño, y no pesan de más', async () => {
  let total = 0;
  const tamaños = new Set<string>();
  for (const m of MASCARAS) {
    const archivo = join('public', 'arte', `multitud-lejos-${m}.png`);
    assert.ok(existsSync(archivo), `falta ${archivo}: correr node scripts/generar-multitud.mjs`);
    total += statSync(archivo).size / 1024;
    const meta = await sharp(archivo).metadata();
    tamaños.add(`${meta.width}×${meta.height}`);
  }
  assert.equal(tamaños.size, 1, `las tres máscaras tienen que calzar una sobre otra: ${[...tamaños].join(', ')}`);
  assert.ok(total <= TOPE_KB_MASCARAS, `las máscaras pesan ${total.toFixed(1)} KB, el tope es ${TOPE_KB_MASCARAS}`);
});

test('la multitud de lejos: el mosaico no tiene costura, y la silueta llega al piso', async () => {
  for (const m of MASCARAS) {
    const { data, info } = await sharp(join('public', 'arte', `multitud-lejos-${m}.png`))
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    // Está en espejo: la última columna es la primera, y al repetirse se tocan iguales.
    let salto = 0;
    for (let y = 0; y < info.height; y++) {
      const a = data[y * info.width * 4 + 3]!;
      const b = data[(y * info.width + info.width - 1) * 4 + 3]!;
      salto = Math.max(salto, Math.abs(a - b));
    }
    assert.ok(salto <= 2, `${m}: el borde izquierdo y el derecho no calzan (salto de ${salto} en el alfa)`);
    if (m === 'silueta') {
      const ultima = (info.height - 1) * info.width * 4;
      for (let x = 0; x < info.width; x++) {
        assert.ok(data[ultima + x * 4 + 3]! >= 250, `la silueta no llega al piso en x=${x}`);
      }
    }
  }
});

test('la multitud de lejos: la hoja las pide por su nombre, y la página solo si están', () => {
  const css = readFileSync('src/styles/sitio.css', 'utf-8');
  for (const m of MASCARAS) {
    assert.ok(css.includes(`/arte/multitud-lejos-${m}.png`), `sitio.css no usa la máscara ${m}`);
  }
  const base = readFileSync('src/layouts/Base.astro', 'utf-8');
  assert.ok(base.includes('hayPlanos'), 'Base.astro pega los planos sin mirar si están las máscaras');
  assert.ok(base.includes("['clara', 'roja', 'silueta']"), 'Base.astro no revisa las tres máscaras');
});
