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
 * la contratapa de *Gulp!*, sin redibujarlos. Igual con `href="master:<archivo>"` y un `.png` de
 * `Docs/UX/recortes-master/`: el esclavo encadenado. Con `--solo` imprime nada más las piezas cuyo
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
const { PIEZAS_CAMINO, piezasDeLosCruces } = await importar('src/lib/bestiario/arte-camino.ts');
// Y los cruces de `D-77`: necesitan saber quién es vecino de quién, que está en el JSON.
const { regiones } = JSON.parse(readFileSync(resolve(raiz, 'src/data/bestiario.json'), 'utf-8'));
const CRUCES = piezasDeLosCruces(regiones);
// La entrada (`D-79`): el portal, el cartel y la tierra del plano, que pinta cada región del JSON.
const { piezasDelPortal, tierrasDe } = await importar('src/lib/bestiario/arte-portal.ts');
const PORTAL = piezasDelPortal(tierrasDe(regiones));
// El aire (`D-90`): la bruma, la niebla rasante y lo pegado a la cámara, en baldosas que se repiten.
const { PIEZAS_AIRE, PIEZAS_DE_LUZ, PIEZAS_DE_VIDA, PIEZAS_DE_FILO } = await importar('src/lib/bestiario/arte-aire.ts');

const { valores } = leerDeclaraciones(readFileSync(resolve(raiz, 'src/styles/tokens.css'), 'utf-8'));

/**
 * Mete adentro del SVG cada tapa que pide una pieza (`href="tapa:<archivo>"`), y cada máster de
 * recorte (`href="master:<archivo>"`, un `.png` de `Docs/UX/recortes-master/`): así el esclavo
 * encadenado es el dibujo que trajo el usuario, cortado en piezas, y no un redibujo.
 */
const tapas = new Map();
function conTapas(svg) {
  return svg.replace(/href="(tapa|master):([a-z0-9-]+)"/g, (_, de, nombre) => {
    const clave = `${de}:${nombre}`;
    if (!tapas.has(clave)) {
      const [carpeta, ext, tipo] = de === 'tapa' ? ['Docs/INVESTIGACION/TapasDiscos', 'jpg', 'jpeg'] : ['Docs/UX/recortes-master', 'png', 'png'];
      const archivo = readFileSync(resolve(raiz, `${carpeta}/${nombre}.${ext}`));
      tapas.set(clave, `data:image/${tipo};base64,${archivo.toString('base64')}`);
    }
    return `href="${tapas.get(clave)}"`;
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

for (const p of [...PIEZAS, ...PIEZAS_CAMINO, ...CRUCES, ...PORTAL, ...PIEZAS_AIRE, ...PIEZAS_DE_LUZ, ...PIEZAS_DE_VIDA, ...PIEZAS_DE_FILO]) {
  if (solo && !solo.some((prefijo) => p.nombre.startsWith(prefijo))) continue;
  const [x, y, ancho, alto] = p.caja;
  const densidad = p.densidad ?? 2.5;
  // La sangría (`D-90`): una baldosa que se repite se imprime con un margen de más a cada lado y se
  // recorta. Sin él, el soplo de lo que cruza el borde se queda sin la mitad de afuera y la costura se ve.
  const sangria = p.sangria ?? 0;
  const svg = conTapas(
    conTintas(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round((ancho + 2 * sangria) * densidad)}" height="${Math.round(alto * densidad)}" viewBox="${x - sangria} ${y} ${ancho + 2 * sangria} ${alto}">` +
        `<defs>${filtros()}</defs>${p.dibujo}</svg>`,
      p.nombre,
    ),
  );
  const entera = sharp(Buffer.from(svg), { density: 72 });
  const imagen = sangria
    ? entera.extract({ left: Math.round(sangria * densidad), top: 0, width: Math.round(ancho * densidad), height: Math.round(alto * densidad) })
    : entera;
  const buffer = await imagen.webp({ quality: p.calidad ?? (p.opaca ? 82 : 86), alphaQuality: 90, effort: 5 }).toBuffer();
  writeFileSync(resolve(salida, `${p.nombre}.webp`), buffer);
  impresas.push({ nombre: p.nombre, svg, ancho: Math.round(ancho * densidad), alto: Math.round(alto * densidad), kb: Math.round(buffer.length / 1024) });
  console.log(`${p.nombre}.webp  ${Math.round(ancho * densidad)}×${Math.round(alto * densidad)}  ${Math.round(buffer.length / 1024)} kB`);
}

/**
 * El filo a medida (`D-90`, sexta ronda, `FILO_PROPIO` en `aire.ts`): de cada pieza de los títeres
 * que pasan bajo una luz se saca el canto que mira para arriba, en la tinta de esa luz. Es lo que está
 * en la pieza y no está unos píxeles más arriba: una resta de alfas, sin dibujar nada de nuevo. Se
 * lee la pieza ya impresa, así que se puede correr solo (`--solo filo-de-`).
 */
const { FILO_PROPIO, GROSOR_DEL_FILO, tieneFiloPropio } = await importar('src/lib/bestiario/aire.ts');
const { existsSync } = await import('node:fs');
for (const [region, de] of Object.entries(FILO_PROPIO)) {
  const r = resolverToken(valores, /var\((--[a-z0-9-]+)\)/.exec(de.tinta)[1]);
  if ('error' in r) throw new Error(`filo de ${region}: ${r.error}`);
  const [rojo, verde, azul] = [1, 3, 5].map((i) => parseInt(r.hex.slice(i, i + 2), 16));
  for (const pieza of PIEZAS) {
    if (!tieneFiloPropio(pieza.nombre, region)) continue;
    const nombre = `filo-de-${pieza.nombre}`;
    if (solo && !solo.some((prefijo) => nombre.startsWith(prefijo))) continue;
    const origen = resolve(salida, `${pieza.nombre}.webp`);
    if (!existsSync(origen)) continue;
    const { data, info } = await sharp(origen).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const filo = Buffer.alloc(info.width * info.height * 4);
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const i = (y * info.width + x) * 4;
        const arriba = y >= GROSOR_DEL_FILO ? data[((y - GROSOR_DEL_FILO) * info.width + x) * 4 + 3] : 0;
        const canto = Math.max(0, data[i + 3] - arriba);
        filo[i] = rojo;
        filo[i + 1] = verde;
        filo[i + 2] = azul;
        // Solo el canto franco: donde la pieza ya es un soplo que se pierde, no hay filo que prender.
        // Y franco de verdad: tinta llena, no la media tinta del borde suavizado (séptima ronda: no se veía).
        filo[i + 3] = canto > 110 ? 255 : 0;
      }
    }
    const buffer = await sharp(filo, { raw: { width: info.width, height: info.height, channels: 4 } }).webp({ quality: 70, alphaQuality: 80, effort: 5 }).toBuffer();
    writeFileSync(resolve(salida, `${nombre}.webp`), buffer);
    console.log(`${nombre}.webp  ${info.width}×${info.height}  ${Math.round(buffer.length / 1024)} kB`);
  }
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
