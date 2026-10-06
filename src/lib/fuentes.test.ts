/**
 * Las fuentes del sitio dibujan lo que el sitio escribe (`D-58`).
 *
 * Hasta el ciclo 18, `public/fuentes/archivo-black.woff2` era el subconjunto *latin-ext* de
 * Google Fonts: Ā, Ă, Ő… y **ni una letra de la A a la Z**. La fuente se bajaba, el navegador
 * decía "cargada", y cada título y cada botón caía letra por letra a la de repuesto: Arial
 * Black en una computadora con Windows o Mac, la sans del sistema en Android. Nadie lo vio
 * porque nada fallaba. Lo encontró el ciclo 18 mirando por qué el nombre del resultado salía
 * fino.
 *
 * Este test abre el archivo, lee su tabla `cmap` y exige que cubra lo que el sitio escribe
 * con esa letra. Sin dependencias: WOFF2 es Brotli, y `node:zlib` lo trae.
 *
 * **Desde `D-60` mira también la marca.** El sitio pasó de Arcade Ricotero a Fichín Ricotero,
 * y la marca va en Oktubre Calco, que es un calco de la tapa con once letras (`RES-43`):
 * FICHÍN pedía la F, la H, la N y la Í, que no estaban, y el navegador las habría tapado una
 * por una con la de repuesto. Se derivaron (`scripts/derivar-oktubre-calco.py`) y acá se
 * comprueba que toda forma de la marca —la de las páginas, la de los dos pinceles y la de
 * las tarjetas del taller— pida solo letras que el calco tiene. El calco es WOFF (zlib), no
 * WOFF2: por eso hay dos lectores y una sola lectura del `cmap`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { brotliDecompressSync, inflateSync } from 'node:zlib';
import { PORTAL } from './sitio/copy.ts';
import { RESULTADO, PANTALLA_0 as DOS_EJES } from './dos-ejes/copy.ts';
import { PANTALLA_0 as QUIZ, BOTON_COMPARTIR } from './quiz/copy.ts';
import { PANTALLA_0 as TEMA } from './tema/copy.ts';
import { PANTALLA_0 as TAPA } from './tapa/copy.ts';
import { PANTALLA_0 as POR_LA_LETRA } from './por-la-letra/copy.ts';
import { PANTALLA_0 as LETRA, SIN_BANCO } from './letra/copy.ts';
import { PANTALLA_0 as MAS_O_MENOS } from './mas-o-menos/copy.ts';
import { PANTALLA_0 as PONELOS } from './ponelos/copy.ts';

/** Las etiquetas de tabla que WOFF2 nombra por número (la tabla "known tags" del formato). */
const CONOCIDAS = [
  'cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf', 'loca', 'prep', 'CFF ', 'VORG', 'EBDT',
  'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC', 'JSTF', 'MATH',
  'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar', 'bdat', 'bloc', 'bsln', 'cvar', 'fdsc', 'feat', 'fmtx', 'fvar',
  'gvar', 'hsty', 'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat', 'Gloc', 'Feat', 'Sill',
];

/** Los puntos de código que trae una fuente WOFF2, leídos de su `cmap` (formatos 4 y 12). */
export function puntosDeCodigo(woff2: Buffer): Set<number> {
  assert.equal(woff2.toString('ascii', 0, 4), 'wOF2', 'no es WOFF2');
  const numTables = woff2.readUInt16BE(12);
  let p = 48;
  const base128 = (): number => {
    let v = 0;
    for (let i = 0; i < 5; i++) {
      const b = woff2[p++]!;
      v = v * 128 + (b & 0x7f);
      if (!(b & 0x80)) return v;
    }
    throw new Error('UIntBase128 roto');
  };
  const tablas: { tag: string; largo: number }[] = [];
  for (let i = 0; i < numTables; i++) {
    const flags = woff2[p++]!;
    const indice = flags & 0x3f;
    let tag = CONOCIDAS[indice];
    if (indice === 63) {
      tag = woff2.toString('ascii', p, p + 4);
      p += 4;
    }
    const version = (flags >> 6) & 3;
    const original = base128();
    // glyf y loca vienen transformadas salvo la versión 3; las demás, salvo la 0.
    const transformada = tag === 'glyf' || tag === 'loca' ? version !== 3 : version !== 0;
    const largo = transformada ? base128() : original;
    tablas.push({ tag: tag!, largo });
  }
  const datos = brotliDecompressSync(woff2.subarray(p));
  let desde = 0;
  let cmap: Buffer | undefined;
  for (const t of tablas) {
    if (t.tag === 'cmap') cmap = datos.subarray(desde, desde + t.largo);
    desde += t.largo;
  }
  assert.ok(cmap, 'la fuente no trae cmap');
  return puntosDelCmap(cmap);
}

/** Los puntos de código que trae una fuente WOFF (la primera versión, comprimida con zlib). */
export function puntosDeCodigoWoff(woff: Buffer): Set<number> {
  assert.equal(woff.toString('ascii', 0, 4), 'wOFF', 'no es WOFF');
  const numTables = woff.readUInt16BE(12);
  for (let i = 0; i < numTables; i++) {
    const e = 44 + i * 20;
    if (woff.toString('ascii', e, e + 4) !== 'cmap') continue;
    const desde = woff.readUInt32BE(e + 4);
    const comprimido = woff.readUInt32BE(e + 8);
    const original = woff.readUInt32BE(e + 12);
    const datos = woff.subarray(desde, desde + comprimido);
    return puntosDelCmap(comprimido < original ? inflateSync(datos) : datos);
  }
  throw new Error('la fuente no trae cmap');
}

/** Lee una tabla `cmap` ya descomprimida (subtablas de formato 4 y 12). */
function puntosDelCmap(cmap: Buffer): Set<number> {
  const puntos = new Set<number>();
  const subtablas = cmap.readUInt16BE(2);
  for (let i = 0; i < subtablas; i++) {
    const offset = cmap.readUInt32BE(4 + i * 8 + 4);
    const formato = cmap.readUInt16BE(offset);
    if (formato === 4) {
      const segX2 = cmap.readUInt16BE(offset + 6);
      const finales = offset + 14;
      const iniciales = finales + segX2 + 2;
      for (let s = 0; s < segX2 / 2; s++) {
        const fin = cmap.readUInt16BE(finales + s * 2);
        const ini = cmap.readUInt16BE(iniciales + s * 2);
        for (let c = ini; c <= fin && c !== 0xffff; c++) puntos.add(c);
      }
    } else if (formato === 12) {
      const grupos = cmap.readUInt32BE(offset + 12);
      for (let g = 0; g < grupos; g++) {
        const ini = cmap.readUInt32BE(offset + 16 + g * 12);
        const fin = cmap.readUInt32BE(offset + 20 + g * 12);
        for (let c = ini; c <= fin; c++) puntos.add(c);
      }
    }
  }
  return puntos;
}

/** Lo que el sitio escribe en rotulada: títulos, botones, sellos, rótulos. */
const LO_QUE_SE_ESCRIBE =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ÁÉÍÓÚÜÑáéíóúüñ¿?¡!«»·—–-,.;:…()/×';

test('la rotulada dibuja lo que el sitio escribe con ella (D-58)', () => {
  const puntos = puntosDeCodigo(readFileSync('public/fuentes/archivo-black.woff2'));
  const faltan = [...LO_QUE_SE_ESCRIBE].filter((c) => !puntos.has(c.codePointAt(0)!));
  assert.deepEqual(faltan, [], `la fuente no trae: ${faltan.join(' ')} — esas letras caen a la de repuesto`);
});

test('la guarda sabe ver: el subconjunto viejo, sin la A-Z, no pasaría', () => {
  // Un test que solo verifica presencias no demuestra que sepa leer el archivo: la fuente
  // completa tiene que traer la A y no traer, por ejemplo, ideogramas.
  const puntos = puntosDeCodigo(readFileSync('public/fuentes/archivo-black.woff2'));
  assert.ok(puntos.has(0x41) && puntos.has(0x100));
  assert.ok(!puntos.has(0x4e00));
});

const CALCO = puntosDeCodigoWoff(readFileSync('public/fuentes/oktubre-calco.woff'));

/** Las letras de `texto` que el calco no tiene (los espacios no cuentan). */
const faltanEnElCalco = (texto: string): string[] =>
  [...new Set([...texto.replace(/\s/g, '')].filter((c) => !CALCO.has(c.codePointAt(0)!)))];

test('la marca del sitio entra entera en Oktubre Calco (D-60)', () => {
  assert.ok(CALCO.has(0x4f) && !CALCO.has(0x53), 'el lector del calco no ve la O de la tapa, o ve una S que no tiene');
  assert.deepEqual(faltanEnElCalco(PORTAL.titulo), [], `a "${PORTAL.titulo}" le faltan letras en el calco`);
});

test('los dos pinceles y el taller dibujan la misma marca que la pantalla', () => {
  for (const ruta of ['src/scripts/tarjeta.ts', 'src/scripts/lamina.ts']) {
    const marca = /const MARCA = '([^']+)'/.exec(readFileSync(ruta, 'utf-8'))?.[1];
    assert.equal(marca, PORTAL.titulo, `${ruta}: la firma del pincel no es la del sitio`);
  }
  // `generar-dos-ejes.mjs` la escribe en mayúscula con el calco, en las tarjetas PNG.
  assert.equal(RESULTADO.marca.toUpperCase(), PORTAL.titulo);
  assert.deepEqual(faltanEnElCalco(RESULTADO.marca.toUpperCase()), []);
});

test('ninguna marca escrita en una página pide una letra que el calco no tiene', () => {
  const archivos: string[] = [];
  const recorrer = (dir: string): void => {
    for (const n of readdirSync(dir)) {
      const ruta = join(dir, n);
      if (statSync(ruta).isDirectory()) recorrer(ruta);
      else if (ruta.endsWith('.astro')) archivos.push(ruta);
    }
  };
  ['src/pages', 'src/components', 'src/layouts'].forEach(recorrer);

  const FORMAS = ['marca', 'marca-grande', 'marca-chica', 'caratula-marca'] as const;
  const vistas = new Map<string, number>(FORMAS.map((f) => [f, 0]));
  // La clase puede venir acompañada de otras; el texto se toma entero hasta el cierre de la
  // etiqueta, así una marca armada con `{...}` o con otra etiqueta adentro no pasa sin mirarse.
  const patron = /<(\w+)\s[^>]*class="(?:[^"]*\s)?(marca|marca-grande|marca-chica|caratula-marca)(?:\s[^"]*)?"[^>]*>([\s\S]*?)<\/\1>/g;
  for (const ruta of archivos) {
    const fuente = readFileSync(ruta, 'utf-8');
    for (const m of fuente.matchAll(patron)) {
      const [, , forma, texto] = m;
      vistas.set(forma!, vistas.get(forma!)! + 1);
      assert.ok(!/[{<]/.test(texto!), `${ruta}: la marca .${forma} no es texto fijo ("${texto!.trim()}"); este caso no la puede mirar`);
      assert.deepEqual(faltanEnElCalco(texto!), [], `${ruta}: "${texto!.trim()}"`);
    }
  }
  // Las cuatro formas de la marca existen en el árbol: si el patrón deja de ver alguna, el
  // caso de arriba pasa sin mirarla.
  for (const forma of FORMAS) assert.ok(vistas.get(forma)! >= 1, `no se encontró ninguna marca .${forma} escrita`);
});

/* ==================================================================
   La letra de la banda (`D-65`)

   Desde el 2026-10-05 Patricio Rey Fan escribe el título de cada juego y el botón de
   compartir. La digitalización (`RES-42`) traía A-Z y 0-9 y ni una tilde: COMPARTÍ y
   ADIVINÁ caían al repuesto a mitad de palabra. `scripts/derivar-patricio-rey.py` le dio las
   tildes y los signos con material de la propia letra, y acá se comprueba que todo lo que el
   sitio escribe con ella esté adentro. Un título nuevo con una letra que no tiene —una Ñ, unos
   dos puntos— hace fallar esto en vez de partirse en pantalla.
   ================================================================== */

const FIRMA = puntosDeCodigoWoff(readFileSync('public/fuentes/patricio-rey.woff'));

/** Las letras de `texto` que la firma no tiene, en mayúscula como la escribe el CSS. */
const faltanEnLaFirma = (texto: string): string[] =>
  [...new Set([...texto.toUpperCase().replace(/\s/g, '')].filter((c) => !FIRMA.has(c.codePointAt(0)!)))];

test('la firma tiene lo que se derivó: las cinco vocales con tilde y los signos de la imprenta', () => {
  assert.deepEqual(faltanEnLaFirma('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ÁÉÍÓÚ ¿?¡!.,'), []);
  // Y la guarda sabe ver: lo que no se derivó no está.
  assert.ok(!FIRMA.has('Ñ'.codePointAt(0)!) && !FIRMA.has(':'.codePointAt(0)!), 'el lector de la firma ve letras que no tiene');
});

test('el título de cada juego y el botón de compartir entran enteros en la firma (D-65)', () => {
  const TEXTOS = {
    quiz: QUIZ.titulo,
    tema: TEMA.titulo,
    tapa: TAPA.titulo,
    'por la letra': POR_LA_LETRA.titulo,
    letra: LETRA.titulo,
    'letra sin banco': SIN_BANCO.titulo,
    'dos ejes': DOS_EJES.titulo,
    'más o menos': MAS_O_MENOS.titulo,
    ponelos: PONELOS.titulo,
    'compartir del quiz': BOTON_COMPARTIR,
    'compartir de dos ejes': RESULTADO.compartir,
  };
  const fallas = Object.entries(TEXTOS)
    .map(([donde, texto]) => [donde, texto, faltanEnLaFirma(texto)] as const)
    .filter(([, , faltan]) => faltan.length > 0)
    .map(([donde, texto, faltan]) => `${donde}: "${texto}" pide ${faltan.join(' ')}`);
  assert.deepEqual(fallas, [], `la firma no tiene estas letras:\n  ${fallas.join('\n  ')}`);
});

test('ninguna página escribe a mano un título de juego que la firma no tiene', () => {
  // Los títulos escritos fijos en un `<h1>` de las páginas de juego, que no pasan por un copy.
  const archivos = ['src/pages/diagnostico-audio.astro', ...readdirSync('src/pages/juegos').filter((n) => n.endsWith('.astro')).map((n) => `src/pages/juegos/${n}`)];
  for (const ruta of archivos) {
    for (const m of readFileSync(ruta, 'utf-8').matchAll(/<h1[^>]*>([^<{]+)<\/h1>/g)) {
      assert.deepEqual(faltanEnLaFirma(m[1]!), [], `${ruta}: "${m[1]!.trim()}"`);
    }
  }
});
