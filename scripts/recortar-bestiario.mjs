/**
 * Recorta el lobo y el cordero de las tapas del disco doble (`D-73`, cuarta vuelta).
 *
 *   node --experimental-strip-types scripts/recortar-bestiario.mjs [--prueba carpeta]
 *
 * Lee `src/lib/bestiario/recortes.ts`: cada pieza dice de qué frente sale y con qué polígono
 * se corta. Arma la máscara —el polígono, soplado en el borde; cruzado con la silueta del
 * cordero si hace falta; con los cantos de la tapa fundidos si la figura sigue más allá—, la
 * aplica sobre el frente, recorta la caja y la achica, y escribe `public/bestiario/<pieza>.webp`.
 *
 * Con `--prueba carpeta` escribe además cada frente con los polígonos dibujados encima, para
 * corregirlos a ojo.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { RECORTES, FUENTES, LADO_TAPA, REDUCCION, cajaDeRecorte } = await import(
  pathToFileURL(resolve(raiz, 'src/lib/bestiario/recortes.ts')).href
);

const L = LADO_TAPA;
const salida = resolve(raiz, 'public/bestiario');
mkdirSync(salida, { recursive: true });

/** Una imagen gris de L × L a partir de un SVG. */
async function gris(svg) {
  return sharp(Buffer.from(svg)).resize(L, L).extractChannel(0).raw().toBuffer();
}

const fuentes = {};
for (const [clave, ruta] of Object.entries(FUENTES)) {
  fuentes[clave] = await sharp(resolve(raiz, ruta)).resize(L, L).removeAlpha().raw().toBuffer();
}

// La silueta del cordero: el recorte del repo (el frente entero achicado y sin fondo), al tamaño grande.
const silueta = await sharp(resolve(raiz, 'public/arte/cordero-rulo.png'))
  .ensureAlpha()
  .extractChannel(3)
  .resize(L, L, { kernel: 'cubic' })
  .blur(1.2)
  .raw()
  .toBuffer();

const puntos = (poligono) => poligono.map(([x, y]) => `${x},${y}`).join(' ');

for (const r of RECORTES) {
  const mascara = await gris(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${L}" viewBox="0 0 ${L} ${L}">` +
      `<defs><filter id="p" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${r.plumado}"/></filter></defs>` +
      `<rect width="${L}" height="${L}" fill="#000"/><polygon points="${puntos(r.poligono)}" fill="#fff" filter="url(#p)"/></svg>`,
  );
  const rgb = fuentes[r.fuente];
  const rgba = Buffer.alloc(L * L * 4);
  for (let i = 0; i < L * L; i++) {
    let a = mascara[i] / 255;
    if (r.conSilueta) a *= silueta[i] / 255;
    if (r.fundirBordes) {
      // El canto de la tapa: la figura sigue más allá, así que se funde en 70 píxeles.
      const x = i % L;
      const y = Math.floor(i / L);
      a *= Math.min(1, x / 70) * Math.min(1, y / 70);
    }
    rgba[i * 4] = rgb[i * 3];
    rgba[i * 4 + 1] = rgb[i * 3 + 1];
    rgba[i * 4 + 2] = rgb[i * 3 + 2];
    rgba[i * 4 + 3] = Math.round(a * 255);
  }
  const [x, y, ancho, alto] = cajaDeRecorte(r);
  const buffer = await sharp(rgba, { raw: { width: L, height: L, channels: 4 } })
    .extract({ left: x, top: y, width: ancho, height: alto })
    .resize(Math.round(ancho * REDUCCION), Math.round(alto * REDUCCION))
    .webp({ quality: 86, alphaQuality: 90, effort: 5 })
    .toBuffer();
  writeFileSync(resolve(salida, `${r.nombre}.webp`), buffer);
  console.log(`${r.nombre}.webp  ${Math.round(ancho * REDUCCION)}×${Math.round(alto * REDUCCION)}  ${Math.round(buffer.length / 1024)} kB`);
}

const i = process.argv.indexOf('--prueba');
if (i > 0) {
  const carpeta = process.argv[i + 1];
  for (const fuente of Object.keys(FUENTES)) {
    const poligonos = RECORTES.filter((r) => r.fuente === fuente)
      .map((r, n) => `<polygon points="${puntos(r.poligono)}" fill="none" stroke="${['#ff2222', '#22ff66', '#ffcc00', '#22ccff'][n % 4]}" stroke-width="3"/>`)
      .join('');
    await sharp(resolve(raiz, FUENTES[fuente]))
      .resize(L, L)
      .composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${L}">${poligonos}</svg>`) }])
      .png()
      .toFile(resolve(carpeta, `prueba-${fuente}.png`));
  }
  console.log(`pruebas en ${carpeta}`);
}
