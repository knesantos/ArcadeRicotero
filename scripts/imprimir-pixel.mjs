/**
 * La imprenta del pixel: de una grilla de texto a un atlas PNG con su JSON.
 *
 *   node scripts/imprimir-pixel.mjs
 *
 * Es la mitad de `T-268` (ciclo 16) que no depende de la paleta, y la pieza del medio de la
 * cadena que `D-44` decidió: **el pixel lo dibuja el hilo principal, como código**. Lee cada
 * `src/arte/pixel/<atlas>.txt`, resuelve cada tinta contra `src/styles/tokens.css` y escribe
 * `public/sprites/<atlas>.v<N>.png` y `.json` (`CTR-15.5`, `CTR-15.7`, `CTR-15.8`).
 * Su guardián es `scripts/auditar-paleta-pixel.mjs`, y el de los dos,
 * `src/lib/pixel/imprenta.test.ts`.
 *
 * ## El formato de un dibujo
 *
 * Una directiva por renglón, los renglones en blanco separan, y `#` abre un comentario
 * hasta el final del renglón: al principio, o después de un espacio (adentro de una grilla,
 * el que abre el renglón lleva un espacio después: `# así`). El nombre del archivo
 * es el del atlas. Un personaje, en corto:
 *
 *   tipo: personaje           # personaje = celda 16 × 24 · tile = 16 × 16 (CTR-15.3)
 *   version: 1                # va en el nombre del archivo (CTR-15.8)
 *
 *   tinta: K --px-clave       # un caracter por tinta; '.' es transparente (un tile no lo lleva)
 *   tinta: L --px-luz
 *
 *   estado: quieto   cuadros=1                              # una fila del atlas por estado,
 *   estado: corre    cuadros=4  porSegundo=10  repite=si    # en este orden
 *   estado: salta    cuadros=1
 *   estado: cae      cuadros=1
 *   estado: enPausa  cuadros=1    # los cinco de CTR-15.7, ni uno más ni uno menos
 *
 *   cuadro: quieto 0          # y abajo, 24 renglones de 16 caracteres exactos
 *   ......KKKK......
 *   .....KLLLLK.....
 *   (y así hasta completar los 24 renglones, y un cuadro por cada índice de cada estado)
 *
 * **El ejemplo que se copia y se imprime tal cual** —un tile entero— está en el encabezado
 * de `src/lib/pixel/fuente.ts`, que es quien lee el formato, junto con el detalle: qué
 * caracteres no pueden ser tinta, qué pasa con un comentario adentro de una grilla, los
 * valores por defecto. Todo error nombra archivo y renglón, y se juntan todos antes de salir.
 *
 * ## Lo que garantiza, y cómo
 *
 * - **Alfa binario** (`UX-27 §3`): cada píxel es una tinta con alfa 255 o un `.` con alfa 0,
 *   y un tile no lleva `.`: va opaco entero. No hay remuestreo, no hay suavizado: el PNG
 *   sale a ×1, del tamaño de la grilla.
 * - **Sin perfil ICC ni metadatos** (`UX-27 §3`): `sharp` no mete perfil pero sí un `pHYs`,
 *   y se saca después de codificar. El PNG queda con `IHDR`, `IDAT` e `IEND`.
 * - **Ningún hex en el camino**: la leyenda nombra `--px-*` y el hex se resuelve contra
 *   `tokens.css` al correr, siguiendo alias `var(--x)` (`UX-27 §4`: `--px-clave` es
 *   `var(--fondo)`). El JSON nombra las tintas por token (`CTR-15.4`).
 * - **Todo o nada**: si un dibujo tiene un error o nombra una tinta que la hoja no tiene,
 *   sale con 1 y **no escribe ningún archivo**, tampoco los de los dibujos sanos.
 * - **La versión cuida la caché** (`CTR-15.8`): si ya existe `<atlas>.v<N>.json` y el
 *   dibujo nuevo le cambia lo que el motor da por cierto —celda, colisión, filas o
 *   cuadros—, sale con 1 y pide subir la versión. Repintar una tinta la deja igual.
 *
 * Con `src/arte/pixel/` vacía o inexistente sale 0: no hay nada que imprimir, y es el
 * estado del repo hasta que `T-275` y `T-276` dibujen.
 *
 * Trabaja sobre el directorio actual (la raíz del repo), igual que los otros scripts.
 *
 * ## La prueba de imprenta, antes de que la paleta exista
 *
 * La paleta nace en el lienzo y baja a `tokens.css` recién cuando el usuario la aprueba
 * (`.claude/rules/diseno-marca.md`), y nada entra a `public/sprites/` sin la hoja de
 * contacto vista (`D-44`). Para poder dibujar mientras tanto, tres opciones:
 *
 *   --dibujos <dir>   lee los .txt de otra carpeta (para dibujar en borrador sin pisar a nadie)
 *   --tokens <ruta>   resuelve las tintas contra otra hoja (una copia con la paleta en borrador)
 *   --salida <dir>    escribe los atlas en otra carpeta, nunca en public/sprites/
 *   --contacto        además de cada atlas, escribe <atlas>.color-x6.png y <atlas>.gris-x6.png:
 *                     los cuadros a ×6 sobre el aire del área (--px-luz, UX-27 §1.1), en color
 *                     y en gris. Es la hoja que se mira para BR-23.3 y para aprobar.
 *
 * Ejemplo: node --experimental-strip-types scripts/imprimir-pixel.mjs --tokens <borrador.css> --salida <tmp> --contacto
 */

import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { paletaDelArea } from '../src/lib/pixel/tokens.ts';
import { componerAtlas, contar, estructura, leerDibujo, sinBom } from '../src/lib/pixel/fuente.ts';
import { quitarChunks } from '../src/lib/pixel/auditoria.ts';

const argv = process.argv.slice(2);
const opcion = (nombre) => {
  const i = argv.indexOf(nombre);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : undefined;
};
const DIBUJOS = opcion('--dibujos') ?? join('src', 'arte', 'pixel');
const SALIDA = opcion('--salida') ?? join('public', 'sprites');
const TOKENS = opcion('--tokens') ?? join('src', 'styles', 'tokens.css');
const CONTACTO = argv.includes('--contacto');
for (const nombre of ['--dibujos', '--tokens', '--salida']) {
  if (argv.includes(nombre) && !opcion(nombre)) {
    console.error(`${nombre} necesita una ruta.`);
    process.exit(1);
  }
}

function salirCon(errores) {
  console.error(`La imprenta no imprimió nada: ${contar(errores.length, 'error', 'errores')}.`);
  for (const e of errores) console.error(`  ${e}`);
  process.exit(1);
}

const archivos = existsSync(DIBUJOS)
  ? readdirSync(DIBUJOS).filter((f) => f.endsWith('.txt')).sort()
  : [];
if (archivos.length === 0) {
  console.log(`No hay nada que imprimir: ${DIBUJOS.split('\\').join('/')}/ no tiene dibujos .txt.`);
  process.exit(0);
}

if (!existsSync(TOKENS)) salirCon([`no encuentro ${TOKENS}: sin la hoja no hay tintas`]);
const { tintas, errores: erroresDePaleta } = paletaDelArea(readFileSync(TOKENS, 'utf-8'));

const errores = [...erroresDePaleta.map((e) => `tokens.css: ${e}`)];
const dibujos = [];
for (const archivo of archivos) {
  const { dibujo, errores: propios } = leerDibujo(readFileSync(join(DIBUJOS, archivo), 'utf-8'), archivo);
  if (!dibujo) {
    errores.push(...propios);
    continue;
  }
  let sano = true;
  for (const [car, nombre] of dibujo.leyenda) {
    if (!tintas.has(nombre)) {
      errores.push(`${archivo}:${dibujo.renglonDeTinta.get(car)}: ${nombre} no existe en tokens.css (hoy hay ${contar(tintas.size, 'tinta', 'tintas')} --px-*)`);
      sano = false;
    }
  }
  if (sano) dibujos.push(dibujo);
}
if (errores.length) salirCon(errores);

// Todo en memoria primero: si algo falla acá, tampoco se escribe nada.
const salidas = [];
for (const d of dibujos) {
  const atlas = componerAtlas(d, tintas);
  const base = `${d.atlas}.v${d.version}`;
  const rutaJson = join(SALIDA, `${base}.json`);
  if (existsSync(rutaJson)) {
    let previa = null;
    try {
      previa = JSON.parse(sinBom(readFileSync(rutaJson, 'utf-8')));
    } catch {
      errores.push(`${rutaJson}: ya existe y no se puede leer; no lo piso a ciegas`);
    }
    if (previa && estructura(previa) !== estructura(atlas.json)) {
      errores.push(
        `${d.archivo}: cambió lo que el motor da por cierto y la versión sigue en ${d.version} — subila (CTR-15.8).\n` +
          `    antes: ${estructura(previa)}\n    ahora: ${estructura(atlas.json)}`,
      );
    }
  }
  const png = await sharp(Buffer.from(atlas.rgba), {
    raw: { width: atlas.ancho, height: atlas.alto, channels: 4 },
  })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
  salidas.push({
    base,
    png: quitarChunks(png),
    json: JSON.stringify(atlas.json, null, 2) + '\n',
    ancho: atlas.ancho,
    alto: atlas.alto,
    paleta: atlas.json.paleta.length,
  });
}
if (errores.length) salirCon(errores);

mkdirSync(SALIDA, { recursive: true });
const aire = tintas.get('--px-luz');
for (const s of salidas) {
  writeFileSync(join(SALIDA, `${s.base}.png`), s.png);
  writeFileSync(join(SALIDA, `${s.base}.json`), s.json);
  console.log(
    `  ${join(SALIDA, s.base).split('\\').join('/')}.png  ${s.ancho} × ${s.alto} nativos, ${contar(s.paleta, 'tinta', 'tintas')}, ${s.png.length} bytes`,
  );
  if (CONTACTO) {
    // A ×6 y con vecino más cercano: un píxel nativo es un cuadrado de 6, sin barro (D-41).
    const fondo = aire ?? '#ffffff';
    const escalado = sharp(s.png).resize(s.ancho * 6, s.alto * 6, { kernel: 'nearest' });
    const color = await escalado.clone().flatten({ background: fondo }).png().toBuffer();
    const gris = await sharp(color).grayscale().png().toBuffer();
    writeFileSync(join(SALIDA, `${s.base}.color-x6.png`), color);
    writeFileSync(join(SALIDA, `${s.base}.gris-x6.png`), gris);
    console.log(`    hoja de contacto: ${s.base}.color-x6.png y ${s.base}.gris-x6.png, sobre el aire ${fondo}`);
  }
}
console.log(
  salidas.length === 1
    ? 'Impreso 1 atlas. Controlalo con: node scripts/auditar-paleta-pixel.mjs'
    : `Impresos ${salidas.length} atlas. Controlalos con: node scripts/auditar-paleta-pixel.mjs`,
);
