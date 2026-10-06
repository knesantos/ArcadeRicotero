/**
 * Las texturas de `tokens.css` son SVG sanos, y las de la almohadilla gastan lo que dicen
 * (`D-64`).
 *
 * Una textura que se usa de máscara y que no se puede dibujar no falla en ningún lado: cuenta
 * como transparente, y el título que enmascara **desaparece entero**. Un `%23` mal escapado,
 * un `id` que no coincide con su `url(#…)`, alcanza. Este archivo decodifica cada
 * `--textura-*`, mira que sea un SVG cerrado con sus referencias en orden, lo dibuja con sharp
 * y, para las tres de la almohadilla, mide cuánto gastan: la tinta tiene que faltar en puntos,
 * no aguarse ni desaparecer, y el papel tiene que verse tocado y no sucio.
 *
 * La costura de la tesela no se mide acá: librsvg (lo que usa sharp) no cose las teselas con
 * región o sin ella, y Chromium sí. Se controla con lo que la hace coser: la región del filtro
 * en 0/0/1/1 y `stitchTiles` en cada turbulencia.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const TOKENS = readFileSync('src/styles/tokens.css', 'utf-8');

/** Cada `--textura-*` con su SVG ya decodificado. */
const TEXTURAS = new Map(
  [...TOKENS.matchAll(/(--textura-[a-z-]+):\s*url\("data:image\/svg\+xml,([^"]+)"\);/g)].map((m) => [m[1]!, m[2]!]),
);

const ALMOHADILLA = ['--textura-tinta', '--textura-tinta-sal', '--textura-papel-viejo'];

test('están todas las texturas, y las tres de la almohadilla entre ellas', () => {
  for (const nombre of ['--textura-grano', '--textura-rodillo', ...ALMOHADILLA]) {
    assert.ok(TEXTURAS.has(nombre), `falta ${nombre} en tokens.css`);
  }
});

test('cada textura es un SVG cerrado, bien escapado y con sus referencias en orden', () => {
  for (const [nombre, crudo] of TEXTURAS) {
    assert.ok(!crudo.includes('#'), `${nombre}: un # crudo corta el data-URI ahí`);
    assert.ok(!/%(?![0-9A-Fa-f]{2})/.test(crudo), `${nombre}: un % que no escapa nada`);
    const svg = decodeURIComponent(crudo);
    assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'), `${nombre}: no es un SVG cerrado`);
    for (const ref of svg.matchAll(/url\(#([\w-]+)\)/g)) {
      assert.ok(svg.includes(`id='${ref[1]}'`), `${nombre}: pide #${ref[1]} y no hay nada con ese id`);
    }
    // Alfa sola: la textura no trae color, la tinta la pone el lugar donde se usa.
    assert.ok(!/fill=|rgb\(/.test(svg), `${nombre}: trae color propio`);
  }
});

test('las tres de la almohadilla cosen la tesela: región 0/0/1/1, stitchTiles y viewBox', () => {
  for (const nombre of ALMOHADILLA) {
    const svg = decodeURIComponent(TEXTURAS.get(nombre)!);
    assert.match(svg, /<filter [^>]*x='0' y='0' width='1' height='1'/, `${nombre}: el filtro sin región deja costura`);
    for (const t of svg.matchAll(/<feTurbulence [^>]*>/g)) assert.match(t[0], /stitchTiles='stitch'/, `${nombre}: una turbulencia no cose`);
    assert.match(svg, /<svg [^>]*viewBox=/, `${nombre}: sin viewBox la tesela no escala`);
  }
});

/** El alfa de una textura dibujada a 1 px = 1 px CSS, de 0 a 1. */
async function alfa(nombre: string): Promise<{ a: Float32Array; w: number; h: number }> {
  const svg = decodeURIComponent(TEXTURAS.get(nombre)!);
  const { data, info } = await sharp(Buffer.from(svg), { density: 72 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const a = new Float32Array(info.width * info.height);
  for (let i = 0; i < a.length; i++) a[i] = data[i * 4 + 3]! / 255;
  return { a, w: info.width, h: info.height };
}

test('toda textura se dibuja: ninguna sale vacía', async () => {
  for (const nombre of TEXTURAS.keys()) {
    const { a } = await alfa(nombre);
    assert.ok(a.some((v) => v > 0.02), `${nombre} se dibuja vacía: lo que enmascara desaparece`);
  }
});

test('la tinta gastada: falta en puntos, no se agua, y nunca se come un bloque entero', async () => {
  for (const nombre of ['--textura-tinta', '--textura-tinta-sal']) {
    const { a, w, h } = await alfa(nombre);
    const huecos = a.filter((v) => v < 0.5).length / a.length;
    assert.ok(huecos >= 0.02 && huecos <= 0.07, `${nombre}: ${(huecos * 100).toFixed(2)} % de huecos, la banda es 2-7 %`);
    // El peor bloque de 12×12 px: más que esto y una letra chica pierde un trazo entero.
    let peor = 0;
    for (let y = 0; y + 12 <= h; y += 6) {
      for (let x = 0; x + 12 <= w; x += 6) {
        let n = 0;
        for (let j = 0; j < 12; j++) for (let i = 0; i < 12; i++) if (a[(y + j) * w + x + i]! < 0.5) n++;
        peor = Math.max(peor, n / 144);
      }
    }
    assert.ok(peor <= 0.3, `${nombre}: un bloque de 12 px pierde el ${(peor * 100).toFixed(0)} % de la tinta`);
  }
  // La presión de la tinta tiene piso: puede faltar, nunca aguarse debajo de 0,8. La lee
  // `contraste.test.ts` para el par del título sobre el papel viejo.
  const tinta = decodeURIComponent(TEXTURAS.get('--textura-tinta')!);
  assert.match(tinta, /tableValues='0\.8 1'/, 'la presión de la tinta perdió su piso de 0,8');
});

test('el papel viejo: tocado y no sucio, y nunca más oscuro que su techo', async () => {
  const svg = decodeURIComponent(TEXTURAS.get('--textura-papel-viejo')!);
  const techo = Number(/tableValues='0 ([\d.]+)'\s*\/>\s*<\/feComponentTransfer>\s*<\/filter>/.exec(svg)?.[1]);
  assert.ok(techo > 0 && techo <= 0.19, `el techo del papel es ${techo}: más de 0,19 y la pista baja de AA`);
  const { a } = await alfa('--textura-papel-viejo');
  const maximo = Math.max(...a);
  assert.ok(maximo <= techo + 1 / 255 + 1e-6, `el papel llega a ${maximo.toFixed(3)}, su techo es ${techo}`);
  const tocado = a.filter((v) => v > 0.02).length / a.length;
  assert.ok(tocado >= 0.06 && tocado <= 0.3, `el papel está tocado en el ${(tocado * 100).toFixed(1)} %: la banda es 6-30 %`);
});
