/**
 * La imprenta del bestiario (`D-73`, tercera vuelta): del aerógrafo en código a imágenes.
 *
 *   node --experimental-strip-types scripts/imprimir-bestiario.mjs [--hoja ruta.png] [--solo prefijo,...]
 *
 * Lee las piezas de `src/lib/bestiario/arte.ts` (que junta las de `arte-bajo.ts`), resuelve
 * cada `var(--token)` contra `src/styles/tokens.css` con el mismo resolvedor que la imprenta
 * del pixel, envuelve cada pieza en un `<svg>` con los filtros de `aerografo.ts`, y la imprime
 * con `sharp` a `public/bestiario/<pieza>.webp`.
 *
 * Una pieza puede pedir una tapa de verdad con `href="tapa:<archivo>"` (sin `.jpg`): la imprenta
 * la busca en `Docs/INVESTIGACION/TapasDiscos/` y la mete adentro del SVG. Así la pared del bajo es
 * el crayón de la contratapa de *Un baión* y la etiqueta de la botella de Pierre es el «gulp.» de
 * la contratapa de *Gulp!*, sin redibujarlos. Con `--solo` imprime nada más las piezas cuyo
 * nombre empieza con alguno de esos prefijos.
 *
 * El desenfoque y el grano se calculan acá, una vez, y no en el teléfono en cada cuadro.
 * Con `--hoja` escribe además una hoja de contacto con todas las piezas, para mirarlas.
 *
 * El guardián es `src/lib/bestiario/bestiario.test.ts`: falla si una pieza que pide la
 * página no tiene su imagen impresa.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const importar = (ruta) => import(pathToFileURL(resolve(raiz, ruta)).href);

const { leerDeclaraciones, resolverToken } = await importar('src/lib/pixel/tokens.ts');
const { filtros } = await importar('src/lib/bestiario/aerografo.ts');
const { PIEZAS } = await importar('src/lib/bestiario/arte.ts');
// La séptima vuelta: las tiras largas del camino con cruces, que se caminan de costado.
const { PIEZAS_CAMINO } = await importar('src/lib/bestiario/arte-camino.ts');

const { valores } = leerDeclaraciones(readFileSync(resolve(raiz, 'src/styles/tokens.css'), 'utf-8'));

/** Mete adentro del SVG cada tapa que pide una pieza (`href="tapa:<archivo>"`). */
const tapas = new Map();
function conTapas(svg) {
  return svg.replace(/href="tapa:([a-z0-9-]+)"/g, (_, nombre) => {
    if (!tapas.has(nombre)) {
      const jpg = readFileSync(resolve(raiz, `Docs/INVESTIGACION/TapasDiscos/${nombre}.jpg`));
      tapas.set(nombre, `data:image/jpeg;base64,${jpg.toString('base64')}`);
    }
    return `href="${tapas.get(nombre)}"`;
  });
}

/** Cambia cada `var(--x)` por su hex. Un token que no existe frena la imprenta. */
function conTintas(svg, nombre) {
  return svg.replace(/var\((--[a-z0-9-]+)\)/g, (_, token) => {
    const r = resolverToken(valores, token);
    if ('error' in r) throw new Error(`${nombre}: ${r.error}`);
    return r.hex;
  });
}

const salida = resolve(raiz, 'public/bestiario');
mkdirSync(salida, { recursive: true });

const hoja = process.argv.includes('--hoja') ? process.argv[process.argv.indexOf('--hoja') + 1] : null;
const solo = process.argv.includes('--solo') ? process.argv[process.argv.indexOf('--solo') + 1].split(',') : null;
const impresas = [];

for (const p of [...PIEZAS, ...PIEZAS_CAMINO]) {
  if (solo && !solo.some((prefijo) => p.nombre.startsWith(prefijo))) continue;
  const [x, y, ancho, alto] = p.caja;
  const densidad = p.densidad ?? 2.5;
  const svg = conTapas(
    conTintas(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(ancho * densidad)}" height="${Math.round(alto * densidad)}" viewBox="${x} ${y} ${ancho} ${alto}">` +
        `<defs>${filtros()}</defs>${p.dibujo}</svg>`,
      p.nombre,
    ),
  );
  const imagen = sharp(Buffer.from(svg), { density: 72 });
  const buffer = await imagen.webp({ quality: p.calidad ?? (p.opaca ? 82 : 86), alphaQuality: 90, effort: 5 }).toBuffer();
  writeFileSync(resolve(salida, `${p.nombre}.webp`), buffer);
  impresas.push({ nombre: p.nombre, svg, ancho: Math.round(ancho * densidad), alto: Math.round(alto * densidad), kb: Math.round(buffer.length / 1024) });
  console.log(`${p.nombre}.webp  ${Math.round(ancho * densidad)}×${Math.round(alto * densidad)}  ${Math.round(buffer.length / 1024)} kB`);
}

if (hoja) {
  // Una hoja de contacto: las piezas una al lado de la otra, sobre gris, para mirarlas juntas.
  const lado = 420;
  const columnas = 3;
  const filas = Math.ceil(impresas.length / columnas);
  const piezas = await Promise.all(
    impresas.map(async (p, i) => ({
      input: await sharp(Buffer.from(p.svg)).resize(lado, lado, { fit: 'contain', background: { r: 60, g: 56, b: 52, alpha: 1 } }).png().toBuffer(),
      left: (i % columnas) * lado,
      top: Math.floor(i / columnas) * lado,
    })),
  );
  await sharp({ create: { width: lado * columnas, height: lado * filas, channels: 4, background: { r: 60, g: 56, b: 52, alpha: 1 } } })
    .composite(piezas)
    .png()
    .toFile(hoja);
  console.log(`hoja de contacto: ${hoja}`);
}
