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
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { brotliDecompressSync } from 'node:zlib';

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
