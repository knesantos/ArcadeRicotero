/**
 * Para mirar la tierra del plano mientras se pinta (`D-79`, `src/lib/bestiario/arte-mapa.ts`).
 *
 *   node --experimental-strip-types scripts/mirar-mapa.mjs <salida.png> [--zona <id>] [--limpio]
 *
 * Imprime `mapa-tierra` a un PNG y le pone encima lo que el plano dibuja arriba de la tierra: el borde
 * punteado de cada región, la caja de su rótulo y un aro donde cae cada bicho, que en la página es un
 * sello en tinta plana. Así se ve qué queda tapado. Con `--zona` recorta la región que se le pide,
 * más grande; con `--limpio` va sin lo de encima. No escribe nada en `public/`.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const importar = (ruta) => import(pathToFileURL(resolve(raiz, ruta)).href);

const { leerDeclaraciones, resolverToken } = await importar('src/lib/pixel/tokens.ts');
const { filtros } = await importar('src/lib/bestiario/aerografo.ts');
const { piezasDelPortal, tierrasDe } = await importar('src/lib/bestiario/arte-portal.ts');
const { camara, contorno, lugarDelRotulo, punto } = await importar('src/lib/bestiario/mapa.ts');

const datos = JSON.parse(readFileSync(resolve(raiz, 'src/data/bestiario.json'), 'utf-8'));
const { valores } = leerDeclaraciones(readFileSync(resolve(raiz, 'src/styles/tokens.css'), 'utf-8'));
const conTintas = (svg) =>
  svg.replace(/var\((--[a-z0-9-]+)\)/g, (_, token) => {
    const r = resolverToken(valores, token);
    if ('error' in r) throw new Error(r.error);
    return r.hex;
  });

const args = process.argv.slice(2);
const salida = args[0];
if (!salida) throw new Error('falta la salida: node --experimental-strip-types scripts/mirar-mapa.mjs <salida.png>');
const zona = args.includes('--zona') ? args[args.indexOf('--zona') + 1] : null;
const limpio = args.includes('--limpio');

const tierra = piezasDelPortal(tierrasDe(datos.regiones)).find((p) => p.nombre === 'mapa-tierra');

let encima = '';
if (!limpio) {
  for (const r of datos.regiones) {
    if (r.forma.tipo === 'anillo') continue;
    encima += `<path d="${contorno(r.forma)}" fill="none" stroke="#14100e" stroke-width="3" stroke-dasharray="1 7" stroke-linecap="round"/>`;
    const l = lugarDelRotulo(r, datos.regiones);
    const ancho = 14 + r.corto.length * 9;
    encima += `<rect x="${l.x * 10 - ancho / 2}" y="${l.y * 10 - 11}" width="${ancho}" height="22" fill="#ede4ce" stroke="#14100e" stroke-width="2"/>`;
  }
  for (const b of datos.bestias) {
    const p = punto(b.pos);
    encima += `<circle cx="${p.x}" cy="${p.y}" r="${b.tam * 0.55}" fill="none" stroke="#14100e" stroke-width="1.6" opacity="0.7"/>`;
  }
}

let caja = [0, 0, 1000, 1000];
if (zona) {
  const region = datos.regiones.find((r) => r.id === zona);
  if (!region) throw new Error(`no hay región "${zona}"`);
  const c = camara(region, datos.bestias);
  caja = [c.x, c.y, c.lado, c.lado];
}
const lado = zona ? 1000 : 1200;
const svg = conTintas(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}" viewBox="${caja.join(' ')}">` +
    `<rect x="-100" y="-100" width="1200" height="1200" fill="#14100e"/><defs>${filtros()}</defs>${tierra.dibujo}${encima}</svg>`,
);
await sharp(Buffer.from(svg), { density: 72 }).png().toFile(salida);
console.log(`${salida}  ${zona ?? 'el plano entero'}`);
