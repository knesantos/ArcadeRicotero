import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import { hexDeRgb, paletaDelArea, resolverToken, leerDeclaraciones, TOPE_DE_TINTAS } from './tokens.ts';
import { ESTADOS_PERSONAJE, ESTADOS_PERSONAJE_V1, componerAtlas, estructura, jsonDelAtlas, leerDibujo } from './fuente.ts';
import { CHUNKS_PERMITIDOS, auditarJson, leerCabecera, quitarChunks } from './auditoria.ts';
import { diferenciasConLoPublicado, rutaPublicada } from './publicado.ts';

/**
 * La cadena del pixel, probada en rojo (`T-268`, ciclo 16; `D-44`, `UX-27 §3` y `§5.3`,
 * `CTR-15`).
 *
 * Dos mitades. La de arriba prueba los módulos puros: el formato de un dibujo y la
 * resolución de tintas contra la hoja. La de abajo **corre los dos scripts de verdad**
 * —`imprimir-pixel.mjs` y `auditar-paleta-pixel.mjs`— sobre un directorio temporal con su
 * propio `tokens.css` de fixture, y mira el código de salida. Nada de esto toca el repo:
 * cada caso arma su raíz en el temporal del sistema y la borra al terminar.
 *
 * **Ningún hex literal en este archivo.** Los auditores del repo prohíben un hex fuera de
 * `tokens.css` en las hojas y en las islas; los tests no los miran, pero la regla es la
 * misma y se respeta igual: los colores de fixture se arman con `hexDeRgb`.
 */

const REPO = resolve('.');
const IMPRENTA = join(REPO, 'scripts', 'imprimir-pixel.mjs');
const AUDITOR = join(REPO, 'scripts', 'auditar-paleta-pixel.mjs');

// ------------------------------------------------------------------------ fixtures

const FONDO = hexDeRgb(20, 16, 14);
const PAPEL = hexDeRgb(244, 239, 226);
const ROJO = hexDeRgb(223, 87, 68);
const CREMA = hexDeRgb(230, 228, 189);
/** La tinta diecisiete: no está en ninguna hoja de fixture. */
const INTRUSA = hexDeRgb(1, 2, 3);

/** Una hoja mínima con cuatro tintas, dos de ellas alias como manda `UX-27 §4`. */
function hojaDeFixture(extra = ''): string {
  return [
    ':root {',
    `  --fondo: ${FONDO};`,
    `  --papel: ${PAPEL};`,
    '  /* las fijas son alias, para no duplicar un hex */',
    '  --px-clave: var(--fondo);',
    '  --px-luz: var(--papel);',
    `  --px-infierno: ${ROJO};`,
    `  --px-cielo: ${CREMA};`,
    extra,
    '}',
    '',
  ].join('\n');
}

const LEYENDA = ['tinta: K --px-clave', 'tinta: L --px-luz', 'tinta: R --px-infierno', 'tinta: C --px-cielo'];

/** Una grilla de `alto` renglones de 16, con un borde de clave y el centro de `relleno`. */
function grilla(alto: number, relleno: string): string[] {
  return Array.from({ length: alto }, (_, y) =>
    y === 0 || y === alto - 1 ? 'K'.repeat(16) : 'K' + relleno.repeat(14) + 'K',
  );
}

function dibujoDeTiles(opciones: { version?: number; cuadrosCielo?: number } = {}): string {
  const cuadrosCielo = opciones.cuadrosCielo ?? 2;
  const partes = [
    '# sala de fixture',
    'tipo: tile',
    `version: ${opciones.version ?? 1}`,
    '',
    ...LEYENDA,
    '',
    'estado: infierno cuadros=1',
    `estado: cielo cuadros=${cuadrosCielo} porSegundo=4 repite=si`,
    '',
    'cuadro: infierno 0',
    ...grilla(16, 'R'),
    '',
  ];
  for (let k = 0; k < cuadrosCielo; k++) {
    partes.push(`cuadro: cielo ${k}`, ...grilla(16, k % 2 ? 'L' : 'C'), '');
  }
  return partes.join('\n');
}

function dibujoDePersonaje(): string {
  const partes = ['tipo: personaje', 'version: 1', '', ...LEYENDA, ''];
  for (const e of ESTADOS_PERSONAJE) partes.push(`estado: ${e} cuadros=1`);
  partes.push('');
  for (const e of ESTADOS_PERSONAJE) {
    // Una figura de 14 × 22 con aire alrededor: transparente afuera, alfa binario.
    const filas = Array.from({ length: 24 }, (_, y) =>
      y === 0 || y === 23 ? '.'.repeat(16) : '.' + (y < 12 ? 'L' : 'R').repeat(14) + '.',
    );
    partes.push(`cuadro: ${e} 0`, ...filas, '');
  }
  return partes.join('\n');
}

/** Una raíz de repo de mentira en el temporal del sistema. */
function raiz(hoja: string | null = hojaDeFixture()): string {
  const dir = mkdtempSync(join(tmpdir(), 'ricota-pixel-'));
  if (hoja !== null) {
    mkdirSync(join(dir, 'src', 'styles'), { recursive: true });
    writeFileSync(join(dir, 'src', 'styles', 'tokens.css'), hoja);
  }
  return dir;
}

function dibujar(dir: string, archivo: string, texto: string): void {
  mkdirSync(join(dir, 'src', 'arte', 'pixel'), { recursive: true });
  writeFileSync(join(dir, 'src', 'arte', 'pixel', archivo), texto);
}

function correr(script: string, cwd: string): { codigo: number; salida: string } {
  const r = spawnSync(process.execPath, [script], { cwd, encoding: 'utf-8' });
  return { codigo: r.status ?? -1, salida: `${r.stdout}${r.stderr}` };
}

/** Escribe un PNG-32 limpio a partir de RGBA crudo, como lo dejaría la imprenta. */
async function escribirPng(ruta: string, ancho: number, alto: number, rgba: Uint8Array, limpio = true) {
  const png = await sharp(Buffer.from(rgba), { raw: { width: ancho, height: alto, channels: 4 } })
    .png({ palette: false })
    .toBuffer();
  mkdirSync(join(ruta, '..'), { recursive: true });
  writeFileSync(ruta, limpio ? quitarChunks(png) : png);
}

/** Un sprite de 16 × 16 todo de una tinta, con su JSON declarando esa tinta. */
async function spriteDeFixture(dir: string, pintar?: (rgba: Uint8Array) => void, paleta = ['--px-infierno']) {
  const rgba = new Uint8Array(16 * 16 * 4);
  const [r, g, b] = [223, 87, 68];
  for (let i = 0; i < 256; i++) rgba.set([r, g, b, 255], i * 4);
  pintar?.(rgba);
  const sprites = join(dir, 'public', 'sprites');
  await escribirPng(join(sprites, 'prueba.v1.png'), 16, 16, rgba);
  writeFileSync(join(sprites, 'prueba.v1.json'), JSON.stringify(jsonDeFixture({ paleta })));
}

/**
 * El JSON de un atlas de tiles de 16 × 16 con una sola fila, como lo escribe la imprenta.
 * `cambios` pisa campos; un campo en `undefined` se saca.
 */
function jsonDeFixture(cambios: Record<string, unknown> = {}): Record<string, unknown> {
  const j: Record<string, unknown> = {
    contrato: 'CTR-15',
    contratoVersion: 1,
    pieza: 'prueba',
    celda: { ancho: 16, alto: 16 },
    paleta: ['--px-infierno'],
    animaciones: { infierno: { fila: 0, cuadros: 1, porSegundo: 0, repite: false } },
    ...cambios,
  };
  for (const k of Object.keys(j)) if (j[k] === undefined) delete j[k];
  return j;
}

/**
 * El JSON de un personaje de `CTR-15.7`: celda 16 × 24, caja 10 × 20 y las seis filas (eran cinco
 * hasta `D-47`; con `estados` se arma uno con otras, como el de un `v1`).
 */
function jsonDePersonaje(
  cambios: Record<string, unknown> = {},
  estados: readonly string[] = ESTADOS_PERSONAJE,
): Record<string, unknown> {
  const animaciones = Object.fromEntries(
    estados.map((e, fila) => [e, { fila, cuadros: 1, porSegundo: 0, repite: false }]),
  );
  return jsonDeFixture({ pieza: 'skayboy', celda: { ancho: 16, alto: 24 }, colision: { ancho: 10, alto: 20 }, animaciones, ...cambios });
}

/**
 * Audita un JSON contra un PNG de `ancho × alto` todo de infierno. `extra` agrega el nombre
 * del archivo (para cruzar `pieza`) y los píxeles (para mirar los huecos de un tile).
 */
function auditarFixture(
  j: Record<string, unknown>,
  ancho = 16,
  alto = 16,
  extra: { archivo?: string; rgba?: Uint8Array } = {},
): string[] {
  const { tintas } = paletaDelArea(hojaDeFixture());
  return auditarJson(JSON.stringify(j), tintas, { ancho, alto, ...extra }, new Map([[ROJO, [0, 0] as [number, number]]]));
}

/** RGBA de `ancho × alto` todo de infierno opaco. */
function rgbaDeInfierno(ancho: number, alto: number): Uint8Array {
  const rgba = new Uint8Array(ancho * alto * 4);
  for (let i = 0; i < ancho * alto; i++) rgba.set([223, 87, 68, 255], i * 4);
  return rgba;
}

const limpiar = (dir: string) => rmSync(dir, { recursive: true, force: true });

// ============================================================ el formato de un dibujo

test('un dibujo de tiles válido se lee, y el JSON sale con la forma de CTR-15.7', () => {
  const { dibujo, errores } = leerDibujo(dibujoDeTiles(), 'sala.txt');
  assert.deepEqual(errores, []);
  assert.ok(dibujo);
  assert.equal(dibujo.atlas, 'sala');
  const j = jsonDelAtlas(dibujo);
  assert.deepEqual(j.celda, { ancho: 16, alto: 16 });
  assert.equal(j.colision, undefined, 'un tile no tiene caja de colisión');
  // La paleta es la que el dibujo USA, en el orden de la leyenda; --px-luz está en el cielo 1.
  assert.deepEqual(j.paleta, ['--px-clave', '--px-luz', '--px-infierno', '--px-cielo']);
  assert.deepEqual(j.animaciones, {
    infierno: { fila: 0, cuadros: 1, porSegundo: 0, repite: false },
    cielo: { fila: 1, cuadros: 2, porSegundo: 4, repite: true },
  });
});

test('un personaje lleva celda 16 × 24, la caja de 10 × 20 y los seis estados', () => {
  const { dibujo, errores } = leerDibujo(dibujoDePersonaje(), 'skayboy.txt');
  assert.deepEqual(errores, []);
  const j = jsonDelAtlas(dibujo!);
  assert.deepEqual(j.celda, { ancho: 16, alto: 24 });
  assert.deepEqual(j.colision, { ancho: 10, alto: 20 });
  assert.deepEqual(Object.keys(j.animaciones), [...ESTADOS_PERSONAJE]);
  assert.deepEqual(j.paleta, ['--px-luz', '--px-infierno'], 'la clave no se usa en este fixture y no se declara');
});

test('🔴 un renglón corto da error con el archivo y el renglón', () => {
  const renglones = dibujoDeTiles().split('\n');
  // El tercer renglón de la grilla de "infierno": el encabezado está en la línea 10.
  const i = renglones.indexOf('cuadro: infierno 0') + 3;
  renglones[i] = renglones[i]!.slice(0, 15);
  const { dibujo, errores } = leerDibujo(renglones.join('\n'), 'sala.txt');
  assert.equal(dibujo, null);
  assert.equal(errores.length, 1, errores.join('\n'));
  assert.match(errores[0]!, new RegExp(`^sala\\.txt:${i + 1}: `));
  assert.match(errores[0]!, /tiene 15 caracteres y la grilla pide 16/);
});

test('🔴 un caracter que no está en la leyenda da error con renglón y columna', () => {
  const renglones = dibujoDeTiles().split('\n');
  const i = renglones.indexOf('cuadro: infierno 0') + 5;
  renglones[i] = 'K' + 'R'.repeat(6) + 'Z' + 'R'.repeat(7) + 'K';
  const { errores } = leerDibujo(renglones.join('\n'), 'sala.txt');
  assert.deepEqual(errores, [
    `sala.txt:${i + 1}: "Z" no está en la leyenda y aparece 1 vez: renglón ${i + 1} columna 8 (cuadro infierno 0)`,
  ]);
});

test('🔴 un cuadro que falta, uno de más y uno repetido se nombran por separado', () => {
  const sinUno = dibujoDeTiles({ cuadrosCielo: 2 }).replace('cuadros=2', 'cuadros=3');
  assert.match(leerDibujo(sinUno, 'sala.txt').errores.join('\n'), /falta el cuadro cielo 2: el estado declara 3/);

  const deMas = dibujoDeTiles({ cuadrosCielo: 2 }).replace('cuadros=2', 'cuadros=1');
  assert.match(leerDibujo(deMas, 'sala.txt').errores.join('\n'), /el cuadro cielo 1 se pasa/);

  const repetido = dibujoDeTiles({ cuadrosCielo: 2 }).replace('cuadro: cielo 1', 'cuadro: cielo 0');
  const e = leerDibujo(repetido, 'sala.txt').errores.join('\n');
  assert.match(e, /el cuadro cielo 0 ya estaba dibujado/);
  assert.match(e, /falta el cuadro cielo 1/);
});

test('🔴 una grilla a la que le faltan renglones enteros dice dónde se cortó', () => {
  const renglones = dibujoDeTiles().split('\n');
  const i = renglones.indexOf('cuadro: infierno 0');
  renglones.splice(i + 15, 1); // saca el renglón 15 de 16
  const e = leerDibujo(renglones.join('\n'), 'sala.txt').errores;
  // Se nombra el renglón donde tendría que seguir la grilla: el blanco que la cerró.
  assert.deepEqual(e, [
    `sala.txt:${i + 17}: al cuadro infierno 0 le faltan renglones: tiene 15 y un tile lleva 16 (CTR-15.3)`,
  ]);
});

test('🔴 a un personaje no le puede faltar ni sobrar un estado de CTR-15.7', () => {
  const sinPausa = dibujoDePersonaje()
    .replace('estado: enPausa cuadros=1\n', 'estado: muere cuadros=1\n')
    .replace('cuadro: enPausa 0', 'cuadro: muere 0');
  const e = leerDibujo(sinPausa, 'skayboy.txt').errores.join('\n');
  assert.match(e, /le faltan estados de CTR-15\.7: enPausa/);
  assert.match(e, /no hay séptima: muere/);
});

test('🔴 la leyenda no acepta un hex, ni el punto, ni un caracter repetido', () => {
  const base = dibujoDeTiles();
  const conHex = base.replace('tinta: C --px-cielo', `tinta: C ${CREMA}`);
  assert.match(leerDibujo(conHex, 'sala.txt').errores.join('\n'), /nunca por hex/);
  const conPunto = base.replace('tinta: C --px-cielo', 'tinta: . --px-cielo');
  assert.match(leerDibujo(conPunto, 'sala.txt').errores.join('\n'), /es transparente/);
  const repetida = base.replace('tinta: C --px-cielo', 'tinta: R --px-cielo');
  assert.match(leerDibujo(repetida, 'sala.txt').errores.join('\n'), /"R" ya nombra --px-infierno/);
});

test('componer: alfa binario, una fila por estado y lo que sobra transparente', () => {
  const { dibujo } = leerDibujo(dibujoDeTiles(), 'sala.txt');
  const { tintas } = paletaDelArea(hojaDeFixture());
  const a = componerAtlas(dibujo!, tintas);
  assert.equal(a.ancho, 32, 'dos columnas: el estado más largo tiene dos cuadros');
  assert.equal(a.alto, 32, 'dos filas: dos estados');
  const alfas = new Set<number>();
  for (let i = 3; i < a.rgba.length; i += 4) alfas.add(a.rgba[i]!);
  assert.deepEqual([...alfas].sort((x, y) => x - y), [0, 255]);
  // La celda (fila 0, columna 1) no existe: infierno tiene un solo cuadro.
  const p = (5 * 32 + 20) * 4;
  assert.equal(a.rgba[p + 3], 0);
  // El centro de infierno 0 es el rojo de la hoja.
  const q = (5 * 32 + 5) * 4;
  assert.equal(hexDeRgb(a.rgba[q]!, a.rgba[q + 1]!, a.rgba[q + 2]!), ROJO);
});

/**
 * Lo publicado contra su fuente (`publicado.ts`, `T-300`): el auditor mira que las tintas sean de
 * la hoja, no que el dibujo sea el del `.txt`. Esto es lo que lo mira, probado con datos armados.
 */
test('🔴 lo publicado contra su fuente: un píxel distinto, el JSON distinto y otro tamaño se nombran; el alfa 0 no mira el color', () => {
  const { dibujo } = leerDibujo(dibujoDeTiles(), 'sala.txt');
  const d = dibujo!;
  const { tintas } = paletaDelArea(hojaDeFixture());
  const a = componerAtlas(d, tintas);
  const publicado = (cambios: { json?: unknown; rgba?: Uint8Array; ancho?: number } = {}) => ({
    json: cambios.json ?? structuredClone(a.json),
    ancho: cambios.ancho ?? a.ancho,
    alto: a.alto,
    rgba: cambios.rgba ?? a.rgba.slice(),
  });
  assert.equal(rutaPublicada(d), 'public/sprites/sala.v1');
  assert.deepEqual(diferenciasConLoPublicado(d, tintas, publicado()), [], 'lo recién impreso está en regla');
  // La celda (fila 0, columna 1) es transparente: el PNG puede guardar cualquier color debajo.
  const debajo = a.rgba.slice();
  const t = (5 * 32 + 20) * 4;
  debajo.set([1, 2, 3], t);
  assert.deepEqual(diferenciasConLoPublicado(d, tintas, publicado({ rgba: debajo })), [], 'el color bajo un alfa 0 no cuenta');
  const pintado = a.rgba.slice();
  const q = (5 * 32 + 5) * 4;
  pintado[q] = 1;
  const [pixel] = diferenciasConLoPublicado(d, tintas, publicado({ rgba: pintado }));
  assert.match(pixel ?? '', /1 píxel distinto, en \(5, 5\)$/);
  const json = structuredClone(a.json);
  json.animaciones.cielo!.cuadros = 1;
  assert.match(diferenciasConLoPublicado(d, tintas, publicado({ json }))[0] ?? '', /sala\.v1\.json no es el que imprime/);
  assert.match(diferenciasConLoPublicado(d, tintas, publicado({ ancho: 16 }))[0] ?? '', /mide 16 × 32 y sala\.txt imprime 32 × 32/);
});

// ======================================================================== la hoja

test('las tintas se resuelven siguiendo alias hasta el hex', () => {
  const { tintas, errores } = paletaDelArea(hojaDeFixture());
  assert.deepEqual(errores, []);
  assert.equal(tintas.get('--px-clave'), FONDO);
  assert.equal(tintas.get('--px-luz'), PAPEL);
  assert.equal(tintas.size, 4);
});

test('🔴 un alias que no llega a un hex se nombra, y uno que da la vuelta también', () => {
  const { valores } = leerDeclaraciones(':root { --a: var(--b); --b: var(--a); --c: var(--nada); --d: rgb(1, 2, 3); }');
  assert.match((resolverToken(valores, '--a') as { error: string }).error, /da una vuelta/);
  assert.match((resolverToken(valores, '--c') as { error: string }).error, /apunta a --nada, que no existe/);
  assert.match((resolverToken(valores, '--d') as { error: string }).error, /no es un hex de seis/);
  assert.match((resolverToken(valores, '--zz') as { error: string }).error, /no existe/);
});

test('🔴 la tinta de más no existe: una hoja con una --px-* por encima del tope es un error', () => {
  const diecisiete = Array.from({ length: TOPE_DE_TINTAS - 3 }, (_, i) => `  --px-extra-${i}: ${hexDeRgb(100, 100, i)};`).join('\n');
  const { tintas, errores } = paletaDelArea(hojaDeFixture(diecisiete));
  // El tope es de UX-27 §4 y se lee de TOPE_DE_TINTAS: bajó de 16 a 15 el 2026-09-23, y
  // el caso tiene que seguir cayendo en la de más, sea cual sea el número.
  assert.equal(tintas.size, TOPE_DE_TINTAS + 1);
  assert.match(
    errores.join('\n'),
    new RegExp(`declara ${TOPE_DE_TINTAS + 1} tintas --px-\\* y el tope es ${TOPE_DE_TINTAS}`),
  );
});

test('la hoja real resuelve todas sus --px-* sin error, y no pasa el tope', () => {
  const { tintas, errores } = paletaDelArea(readFileSync(join(REPO, 'src', 'styles', 'tokens.css'), 'utf-8'));
  assert.deepEqual(errores, []);
  assert.ok(tintas.size <= TOPE_DE_TINTAS);
});

// ============================================================ la cadena, de verdad

test('con la carpeta vacía o sin carpeta, los dos scripts salen 0', () => {
  const dir = raiz();
  try {
    const i = correr(IMPRENTA, dir);
    assert.equal(i.codigo, 0, i.salida);
    assert.match(i.salida, /No hay nada que imprimir/);
    const a = correr(AUDITOR, dir);
    assert.equal(a.codigo, 0, a.salida);
    assert.match(a.salida, /No hay sprites que auditar/);
    // Y con las carpetas creadas pero vacías, igual.
    mkdirSync(join(dir, 'src', 'arte', 'pixel'), { recursive: true });
    mkdirSync(join(dir, 'public', 'sprites'), { recursive: true });
    assert.equal(correr(IMPRENTA, dir).codigo, 0);
    assert.equal(correr(AUDITOR, dir).codigo, 0);
  } finally {
    limpiar(dir);
  }
});

test('ida y vuelta: lo que la imprenta imprime, el auditor lo da por bueno', async () => {
  const dir = raiz();
  try {
    dibujar(dir, 'sala.txt', dibujoDeTiles());
    dibujar(dir, 'skayboy.txt', dibujoDePersonaje());
    const i = correr(IMPRENTA, dir);
    assert.equal(i.codigo, 0, i.salida);
    const sprites = join(dir, 'public', 'sprites');
    assert.deepEqual(readdirSync(sprites).sort(), ['sala.v1.json', 'sala.v1.png', 'skayboy.v1.json', 'skayboy.v1.png']);

    // El PNG: RGBA de 8 bits, sin un chunk de metadatos, y del tamaño exacto de la grilla.
    const bytes = readFileSync(join(sprites, 'skayboy.v1.png'));
    const c = leerCabecera(bytes);
    assert.deepEqual([c.ancho, c.alto, c.profundidad, c.tipoColor], [16, 144, 8, 6]);
    assert.deepEqual([...new Set(c.chunks)].filter((t) => !(CHUNKS_PERMITIDOS as readonly string[]).includes(t)), []);
    // Los píxeles son los de la hoja, byte por byte.
    const { data } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
    const p = (5 * 16 + 5) * 4;
    assert.equal(hexDeRgb(data[p]!, data[p + 1]!, data[p + 2]!), PAPEL);
    assert.equal(data[3], 0, 'la esquina es transparente');

    const json = JSON.parse(readFileSync(join(sprites, 'skayboy.v1.json'), 'utf-8'));
    assert.equal(json.contrato, 'CTR-15');
    assert.equal(json.pieza, 'skayboy');
    assert.deepEqual(json.paleta, ['--px-luz', '--px-infierno']);

    const a = correr(AUDITOR, dir);
    assert.equal(a.codigo, 0, a.salida);
    assert.match(a.salida, /Auditados 2 PNG contra 4 tintas/);

    // Repintar sin mover nada no pide versión nueva (CTR-15.8).
    dibujar(dir, 'sala.txt', dibujoDeTiles().replace('tinta: C --px-cielo', 'tinta: C --px-luz').replace('tinta: L --px-luz', 'tinta: L --px-cielo'));
    const otra = correr(IMPRENTA, dir);
    assert.equal(otra.codigo, 0, otra.salida);
  } finally {
    limpiar(dir);
  }
});

test('🔴 la tinta diecisiete en un PNG: el auditor sale distinto de 0 con archivo, coordenada y color', async () => {
  const dir = raiz();
  try {
    await spriteDeFixture(dir, (rgba) => rgba.set([1, 2, 3, 255], (7 * 16 + 9) * 4));
    const a = correr(AUDITOR, dir);
    assert.notEqual(a.codigo, 0, a.salida);
    assert.match(a.salida, /public\/sprites\/prueba\.v1\.png/);
    assert.ok(a.salida.includes(`(9, 7): ${INTRUSA} no es ninguna de las tintas --px-*`), a.salida);
  } finally {
    limpiar(dir);
  }
});

test('🔴 un píxel con alfa 128: el auditor sale distinto de 0', async () => {
  const dir = raiz();
  try {
    await spriteDeFixture(dir, (rgba) => rgba.set([223, 87, 68, 128], (0 * 16 + 3) * 4));
    const a = correr(AUDITOR, dir);
    assert.notEqual(a.codigo, 0, a.salida);
    assert.ok(a.salida.includes(`(3, 0): alfa 128 en ${ROJO}`), a.salida);
  } finally {
    limpiar(dir);
  }
});

test('🔴 un JSON que nombra un --px- inexistente: el auditor sale distinto de 0', async () => {
  const dir = raiz();
  try {
    await spriteDeFixture(dir, undefined, ['--px-infierno', '--px-no-existe']);
    const a = correr(AUDITOR, dir);
    assert.notEqual(a.codigo, 0, a.salida);
    assert.match(a.salida, /nombra --px-no-existe, que no existe en tokens\.css/);
  } finally {
    limpiar(dir);
  }
});

test('🔴 el PNG usa una tinta que su JSON no declara, o el JSON falta', async () => {
  const dir = raiz();
  try {
    await spriteDeFixture(dir, undefined, ['--px-cielo']);
    const a = correr(AUDITOR, dir);
    assert.notEqual(a.codigo, 0, a.salida);
    assert.match(a.salida, /usa --px-infierno .* y su JSON no la declara/);
    rmSync(join(dir, 'public', 'sprites', 'prueba.v1.json'));
    const b = correr(AUDITOR, dir);
    assert.notEqual(b.codigo, 0, b.salida);
    assert.match(b.salida, /no tiene su JSON al lado/);
  } finally {
    limpiar(dir);
  }
});

test('🔴 un PNG con metadatos (el pHYs que mete sharp): el auditor sale distinto de 0', async () => {
  const dir = raiz();
  try {
    await spriteDeFixture(dir);
    const ruta = join(dir, 'public', 'sprites', 'prueba.v1.png');
    const rgba = new Uint8Array(16 * 16 * 4);
    for (let i = 0; i < 256; i++) rgba.set([223, 87, 68, 255], i * 4);
    await escribirPng(ruta, 16, 16, rgba, false);
    const a = correr(AUDITOR, dir);
    assert.notEqual(a.codigo, 0, a.salida);
    assert.match(a.salida, /chunks de más \(pHYs\)/);
  } finally {
    limpiar(dir);
  }
});

test('🔴 la hoja con 17 --px-*: el auditor sale distinto de 0 aunque el PNG esté bien', async () => {
  const extra = Array.from({ length: 13 }, (_, i) => `  --px-extra-${i}: ${hexDeRgb(100, 100, i)};`).join('\n');
  const dir = raiz(hojaDeFixture(extra));
  try {
    await spriteDeFixture(dir);
    const a = correr(AUDITOR, dir);
    assert.notEqual(a.codigo, 0, a.salida);
    assert.match(a.salida, /una más no existe/);
  } finally {
    limpiar(dir);
  }
});

test('🔴 un renglón corto: la imprenta sale distinto de 0, nombra el renglón y no escribe nada', () => {
  const dir = raiz();
  try {
    const renglones = dibujoDeTiles().split('\n');
    const i = renglones.indexOf('cuadro: cielo 1') + 7;
    renglones[i] = renglones[i]!.slice(0, 12);
    dibujar(dir, 'sala.txt', renglones.join('\n'));
    dibujar(dir, 'skayboy.txt', dibujoDePersonaje()); // sano: tampoco se imprime
    const r = correr(IMPRENTA, dir);
    assert.notEqual(r.codigo, 0, r.salida);
    assert.ok(r.salida.includes(`sala.txt:${i + 1}: el renglón 7 del cuadro cielo 1 tiene 12 caracteres`), r.salida);
    assert.equal(existsSync(join(dir, 'public', 'sprites')), false, 'con un error no se escribe ningún archivo');
  } finally {
    limpiar(dir);
  }
});

test('🔴 una tinta que la hoja no tiene: la imprenta sale distinto de 0 y no escribe nada', () => {
  const dir = raiz();
  try {
    dibujar(dir, 'sala.txt', dibujoDeTiles().replace('tinta: C --px-cielo', 'tinta: C --px-pasto'));
    const r = correr(IMPRENTA, dir);
    assert.notEqual(r.codigo, 0, r.salida);
    assert.match(r.salida, /sala\.txt:\d+: --px-pasto no existe en tokens\.css \(hoy hay 4 tintas --px-\*\)/);
    assert.equal(existsSync(join(dir, 'public', 'sprites')), false);
  } finally {
    limpiar(dir);
  }
});

test('🔴 con 0 tintas en la hoja, un dibujo no se imprime (es el estado de hoy)', () => {
  const dir = raiz(`:root {\n  --fondo: ${FONDO};\n}\n`);
  try {
    dibujar(dir, 'sala.txt', dibujoDeTiles());
    const r = correr(IMPRENTA, dir);
    assert.notEqual(r.codigo, 0, r.salida);
    assert.match(r.salida, /--px-clave no existe en tokens\.css \(hoy hay 0 tintas/);
  } finally {
    limpiar(dir);
  }
});

test('🔴 cambiar la estructura sin subir la versión: la imprenta lo frena (CTR-15.8)', () => {
  const dir = raiz();
  try {
    dibujar(dir, 'sala.txt', dibujoDeTiles({ cuadrosCielo: 2 }));
    assert.equal(correr(IMPRENTA, dir).codigo, 0);
    dibujar(dir, 'sala.txt', dibujoDeTiles({ cuadrosCielo: 3 }));
    const r = correr(IMPRENTA, dir);
    assert.notEqual(r.codigo, 0, r.salida);
    assert.match(r.salida, /cambió lo que el motor da por cierto y la versión sigue en 1/);
    // Con la versión subida, imprime y deja la vieja donde estaba.
    dibujar(dir, 'sala.txt', dibujoDeTiles({ cuadrosCielo: 3, version: 2 }));
    assert.equal(correr(IMPRENTA, dir).codigo, 0);
    const hay = readdirSync(join(dir, 'public', 'sprites')).sort();
    assert.deepEqual(hay, ['sala.v1.json', 'sala.v1.png', 'sala.v2.json', 'sala.v2.png']);
  } finally {
    limpiar(dir);
  }
});

test('estructura: repintar no la cambia, sumar un cuadro sí', () => {
  const a = jsonDelAtlas(leerDibujo(dibujoDeTiles(), 'sala.txt').dibujo!);
  const b = jsonDelAtlas(leerDibujo(dibujoDeTiles().replace('tinta: R --px-infierno', 'tinta: R --px-luz').replace('tinta: L --px-luz', 'tinta: L --px-infierno'), 'sala.txt').dibujo!);
  const c = jsonDelAtlas(leerDibujo(dibujoDeTiles({ cuadrosCielo: 3 }), 'sala.txt').dibujo!);
  assert.equal(estructura(a), estructura(b));
  assert.notEqual(estructura(a), estructura(c));
});

// ================================== los siete hallazgos BAJA de la verificación de T-268
//
// `T-275` y `T-276` van a escribir los `.txt` a mano, con el encabezado de `fuente.ts`
// abierto al lado. Cada caso de acá se vio en rojo antes de su arreglo.

/** El bloque de ejemplo del encabezado de `fuente.ts`, tal como se lo copia. */
function ejemploDelEncabezado(): string {
  const fuente = readFileSync(join(REPO, 'src', 'lib', 'pixel', 'fuente.ts'), 'utf-8');
  const encabezado = fuente.slice(0, fuente.indexOf('*/'));
  const renglones = encabezado.split(/\r?\n/).map((l) => l.replace(/^\s*\*( |$)/, ''));
  const desde = renglones.indexOf('```');
  const hasta = renglones.indexOf('```', desde + 1);
  assert.ok(desde >= 0 && hasta > desde, 'el encabezado de fuente.ts tiene un bloque ``` de ejemplo');
  return renglones.slice(desde + 1, hasta).join('\n') + '\n';
}

test('🔴 1. el ejemplo del encabezado de fuente.ts se copia, se pega y se lee sin un error', () => {
  const { dibujo, errores } = leerDibujo(ejemploDelEncabezado(), 'ejemplo.txt');
  assert.deepEqual(errores, []);
  assert.ok(dibujo);
});

test('🔴 1. y la imprenta lo imprime, y el auditor lo da por bueno', () => {
  const dir = raiz();
  try {
    dibujar(dir, 'ejemplo.txt', ejemploDelEncabezado());
    const i = correr(IMPRENTA, dir);
    assert.equal(i.codigo, 0, i.salida);
    const a = correr(AUDITOR, dir);
    assert.equal(a.codigo, 0, a.salida);
  } finally {
    limpiar(dir);
  }
});

test('🔴 1. un comentario al final de una directiva o de una fila no rompe nada', () => {
  const texto = dibujoDeTiles()
    .replace('tipo: tile', 'tipo: tile   # tile = 16 × 16')
    .replace('version: 1', 'version: 1\t# CTR-15.8')
    .replace('tinta: K --px-clave', 'tinta: K --px-clave   # la clave, alias de --fondo')
    .replace('estado: infierno cuadros=1', 'estado: infierno cuadros=1  # quieto')
    .replace('cuadro: infierno 0', 'cuadro: infierno 0   # el único')
    .replace(/\nK{16}\n/, '\n' + 'K'.repeat(16) + '   # el borde de arriba\n');
  const { dibujo, errores } = leerDibujo(texto, 'sala.txt');
  assert.deepEqual(errores, []);
  // Y lo que se lee es lo mismo que sin comentarios.
  assert.deepEqual(jsonDelAtlas(dibujo!), jsonDelAtlas(leerDibujo(dibujoDeTiles(), 'sala.txt').dibujo!));
  // Un "#" pegado a la grilla sigue siendo un caracter, y no está en la leyenda.
  const pegado = dibujoDeTiles().replace(/\nK{16}\n/, '\n' + 'K'.repeat(15) + '#\n');
  assert.match(leerDibujo(pegado, 'sala.txt').errores.join('\n'), /"#" no está en la leyenda/);
});

test('🔴 2. una tinta mal declarada da un error por tinta, no uno por celda', () => {
  const conHex = dibujoDeTiles().replace('tinta: C --px-cielo', `tinta: C ${CREMA}`);
  const { errores } = leerDibujo(conHex, 'sala.txt');
  assert.equal(errores.length, 2, errores.slice(0, 5).join('\n'));
  assert.match(errores[0]!, /nunca por hex/);
  // El cielo 0 es de C: 14 × 14 celdas adentro del borde.
  assert.match(errores[1]!, /"C" no está en la leyenda y aparece 196 veces: renglón \d+ columna 2 \(cuadro cielo 0\), /);
  assert.match(errores[1]!, /y 191 más/);
  assert.match(errores[1]!, /el renglón 8 intentó declararlo y no pudo/i, 'y señala la tinta que falló');
});

test('🔴 3. el auditor pide contratoVersion, animaciones y la caja del personaje (CTR-15.7)', () => {
  assert.deepEqual(auditarFixture(jsonDeFixture()), [], 'el fixture de tiles es sano');
  assert.deepEqual(auditarFixture(jsonDePersonaje(), 16, 144), [], 'el fixture de personaje es sano');

  assert.match(auditarFixture(jsonDeFixture({ contratoVersion: undefined })).join('\n'), /contratoVersion/);
  assert.match(auditarFixture(jsonDeFixture({ contratoVersion: '1' })).join('\n'), /contratoVersion/);
  assert.match(auditarFixture(jsonDeFixture({ animaciones: undefined })).join('\n'), /no declara las animaciones/);
  assert.match(auditarFixture(jsonDeFixture({ animaciones: {} })).join('\n'), /no declara las animaciones/);
  assert.match(auditarFixture(jsonDePersonaje({ colision: undefined }), 16, 144).join('\n'), /caja de colisión/);
  assert.match(
    auditarFixture(jsonDePersonaje({ colision: { ancho: 12, alto: 20 } }), 16, 144).join('\n'),
    /10 × 20/,
    'la caja es la misma para los dos: es paridad mecánica (CTR-15.3)',
  );
  const sinPausa = jsonDePersonaje();
  delete (sinPausa.animaciones as Record<string, unknown>).enPausa;
  assert.match(auditarFixture(sinPausa, 16, 144).join('\n'), /enPausa/);
  const sinBaile = jsonDePersonaje();
  delete (sinBaile.animaciones as Record<string, unknown>).baila;
  assert.match(auditarFixture(sinBaile, 16, 120).join('\n'), /le faltan animaciones de CTR-15\.7: baila/, 'desde D-47 son seis');
  const campoSuelto = jsonDeFixture({ animaciones: { infierno: { fila: 0, cuadros: 1, repite: false } } });
  assert.match(auditarFixture(campoSuelto).join('\n'), /infierno.*porSegundo/);
});

/**
 * `CTR-15.8`: *"la versión vieja no se borra en el mismo cambio"*. El `skayboy.v1.png` se imprimió
 * con los cinco estados de antes de `D-47` y se queda en `public/sprites/` hasta que nada lo pida;
 * el auditor lo deja pasar con esos cinco. Solo a un `v1`: desde la `v2`, un personaje sin `baila`
 * es un atlas al que le falta el baile.
 */
test('🔴 3. un personaje v1 pasa con los cinco justos de antes de D-47; desde la v2, sin baila no pasa (CTR-15.8)', () => {
  const v1 = jsonDePersonaje({}, ESTADOS_PERSONAJE_V1);
  assert.deepEqual(auditarFixture(v1, 16, 120, { archivo: 'skayboy.v1.png' }), [], 'el v1 impreso antes de D-47 se queda');
  assert.match(
    auditarFixture(v1, 16, 120, { archivo: 'skayboy.v2.png' }).join('\n'),
    /le faltan animaciones de CTR-15\.7: baila/,
    'una v2 sin baila',
  );
  assert.match(auditarFixture(v1, 16, 120).join('\n'), /baila/, 'sin nombre de archivo manda el contrato de hoy');
  assert.deepEqual(auditarFixture(jsonDePersonaje(), 16, 144, { archivo: 'skayboy.v2.png' }), [], 'la v2 con los seis');
  assert.deepEqual(
    auditarFixture(jsonDePersonaje(), 16, 144, { archivo: 'skayboy.v1.png' }),
    [],
    'un v1 impreso hoy trae los seis, y está bien: la excepción es para el de antes, no una regla del v1',
  );
  const sinPausaV1 = jsonDePersonaje({}, ESTADOS_PERSONAJE_V1);
  delete (sinPausaV1.animaciones as Record<string, unknown>).enPausa;
  assert.match(
    auditarFixture(sinPausaV1, 16, 96, { archivo: 'skayboy.v1.png' }).join('\n'),
    /le faltan animaciones de CTR-15\.7: enPausa, baila/,
    'la excepción es la lista justa de antes: un v1 con cuatro no es el de antes',
  );
});

test('🔴 3. el auditor rechaza un JSON que declara más filas o más cuadros que los del PNG', () => {
  const dosFilas = jsonDeFixture({
    animaciones: {
      infierno: { fila: 0, cuadros: 1, porSegundo: 0, repite: false },
      cielo: { fila: 1, cuadros: 1, porSegundo: 0, repite: false },
    },
  });
  assert.match(auditarFixture(dosFilas).join('\n'), /cielo va en la fila 1 y el PNG tiene 1 fila/);
  const tresCuadros = jsonDeFixture({ animaciones: { infierno: { fila: 0, cuadros: 3, porSegundo: 4, repite: true } } });
  assert.match(auditarFixture(tresCuadros).join('\n'), /infierno declara 3 cuadros y el PNG tiene lugar para 1/);
  const mismaFila = jsonDeFixture({
    animaciones: {
      infierno: { fila: 0, cuadros: 1, porSegundo: 0, repite: false },
      cielo: { fila: 0, cuadros: 1, porSegundo: 0, repite: false },
    },
  });
  assert.match(auditarFixture(mismaFila).join('\n'), /infierno y cielo usan la misma fila 0/);
});

test('🔴 3. y lo rechaza corriendo el script de verdad', async () => {
  const dir = raiz();
  try {
    await spriteDeFixture(dir);
    writeFileSync(join(dir, 'public', 'sprites', 'prueba.v1.json'), JSON.stringify(jsonDeFixture({ animaciones: undefined })));
    const a = correr(AUDITOR, dir);
    assert.notEqual(a.codigo, 0, a.salida);
    assert.match(a.salida, /no declara las animaciones/);
  } finally {
    limpiar(dir);
  }
});

test('🔴 4. una variable que alimenta a una --px-* y está declarada dos veces se avisa', () => {
  const hoja = hojaDeFixture() + `@media (prefers-color-scheme: light) {\n  :root { --fondo: ${PAPEL}; }\n}\n`;
  const { errores } = paletaDelArea(hoja);
  assert.equal(errores.length, 1, errores.join('\n'));
  assert.match(errores[0]!, /--px-clave pasa por --fondo, que está declarada dos veces con valores distintos/);
  // Una variable repetida que no alimenta a ninguna tinta del pixel no es asunto de esta hoja.
  const ajena = hojaDeFixture() + '@media (prefers-reduced-motion: reduce) {\n  :root { --duracion: 0s; }\n}\n:root { --duracion: 1s; }\n';
  assert.deepEqual(paletaDelArea(ajena).errores, []);
});

test('🔴 5. un .txt guardado con BOM (el Bloc de notas) se lee igual, y el JSON también', () => {
  const sinComentario = dibujoDeTiles().replace('# sala de fixture\n', '');
  const { dibujo, errores } = leerDibujo('\uFEFF' + sinComentario, 'sala.txt');
  assert.deepEqual(errores, []);
  assert.equal(dibujo!.tipo, 'tile');
  const { tintas } = paletaDelArea(hojaDeFixture());
  const conBom = '\uFEFF' + JSON.stringify(jsonDeFixture());
  assert.deepEqual(auditarJson(conBom, tintas, { ancho: 16, alto: 16 }, new Map([[ROJO, [0, 0]]])), []);
});

test('🔴 6. un estado de varios cuadros sin velocidad es un error, no un cuadro fijo mudo', () => {
  const sinVelocidad = dibujoDeTiles().replace('cuadros=2 porSegundo=4 repite=si', 'cuadros=2 repite=si');
  assert.match(
    leerDibujo(sinVelocidad, 'sala.txt').errores.join('\n'),
    /sala\.txt:\d+: el estado cielo tiene 2 cuadros y porSegundo 0/,
  );
  const enCero = dibujoDeTiles().replace('porSegundo=4', 'porSegundo=0');
  assert.match(leerDibujo(enCero, 'sala.txt').errores.join('\n'), /el estado cielo tiene 2 cuadros y porSegundo 0/);
  // Un cuadro solo con porSegundo 0 es exactamente el cuadro fijo de CTR-15.7.
  assert.deepEqual(leerDibujo(dibujoDeTiles({ cuadrosCielo: 1 }), 'sala.txt').errores, []);
  // Y el auditor mira lo mismo en el JSON.
  const quieto = jsonDeFixture({ animaciones: { infierno: { fila: 0, cuadros: 2, porSegundo: 0, repite: true } } });
  assert.match(auditarFixture(quieto, 32, 16).join('\n'), /infierno tiene 2 cuadros y porSegundo 0/);
});

test('🔴 7. el auditor cuenta en castellano: 1 violación, 2 violaciones', async () => {
  const dir = raiz();
  try {
    await spriteDeFixture(dir, undefined, ['--px-cielo']);
    const uno = correr(AUDITOR, dir);
    assert.match(uno.salida, /rechaza: 1 violación en 1 archivo /);
    await spriteDeFixture(dir, undefined, ['--px-cielo', '--px-no-existe']);
    const dos = correr(AUDITOR, dir);
    assert.match(dos.salida, /rechaza: 2 violaciones en 1 archivo /);
    assert.doesNotMatch(`${uno.salida}${dos.salida}`, /violaciónes/);
  } finally {
    limpiar(dir);
  }
});

// ================================ lo que encontró la verificación de ese arreglo
//
// Uno MEDIA —el encabezado prometía que los tiles van opacos enteros y nadie lo controlaba,
// ni la imprenta ni el auditor— y seis BAJA. Cada caso se vio en rojo antes de su arreglo.

test('🔴 V1. un tile con "." da un error: los tiles van opacos enteros (UX-27 §3)', () => {
  const renglones = dibujoDeTiles().split('\n');
  const i = renglones.indexOf('cuadro: infierno 0') + 3;
  renglones[i] = 'K' + 'R'.repeat(4) + '...' + 'R'.repeat(7) + 'K';
  const { dibujo, errores } = leerDibujo(renglones.join('\n'), 'sala.txt');
  assert.equal(dibujo, null);
  assert.equal(errores.length, 1, errores.join('\n'));
  assert.match(errores[0]!, new RegExp(`^sala\\.txt:${i + 1}: `));
  assert.match(errores[0]!, /un tile va opaco entero \(UX-27 §3\)/);
  assert.match(errores[0]!, /aparece 3 veces: renglón \d+ columna 6 \(cuadro infierno 0\)/);
  // Un personaje sí lleva transparentes: de ahí sale su alfa.
  assert.deepEqual(leerDibujo(dibujoDePersonaje(), 'skayboy.txt').errores, []);
});

test('🔴 V1. la imprenta no imprime un tile con huecos, y el auditor no deja pasar uno hecho a mano', async () => {
  const dir = raiz();
  try {
    dibujar(dir, 'sala.txt', dibujoDeTiles().replace(/\nK{16}\n/, '\n' + 'K'.repeat(8) + '.'.repeat(8) + '\n'));
    const i = correr(IMPRENTA, dir);
    assert.notEqual(i.codigo, 0, i.salida);
    assert.match(i.salida, /un tile va opaco entero/);
    assert.equal(existsSync(join(dir, 'public', 'sprites')), false);

    await spriteDeFixture(dir, (rgba) => rgba.set([0, 0, 0, 0], (5 * 16 + 4) * 4));
    const a = correr(AUDITOR, dir);
    assert.notEqual(a.codigo, 0, a.salida);
    assert.match(a.salida, /infierno, cuadro 0, tiene 1 píxel transparente \(el primero en \(4, 5\)\)/);
  } finally {
    limpiar(dir);
  }
});

test('🔴 V1. el auditor: un hueco adentro de un cuadro de tile es violación; la celda que sobra, no', () => {
  const hueco = rgbaDeInfierno(16, 16);
  hueco[(5 * 16 + 4) * 4 + 3] = 0;
  hueco[(9 * 16 + 2) * 4 + 3] = 0;
  const v = auditarFixture(jsonDeFixture(), 16, 16, { rgba: hueco });
  assert.equal(v.length, 1, v.join('\n'));
  assert.match(v[0]!, /infierno, cuadro 0, tiene 2 píxeles transparentes \(el primero en \(4, 5\)\): los tiles van opacos enteros/);
  // Dos filas, la de arriba con un cuadro solo: la celda (fila 0, columna 1) no es de nadie.
  const conSobra = rgbaDeInfierno(32, 32);
  for (let y = 0; y < 16; y++) for (let x = 16; x < 32; x++) conSobra[(y * 32 + x) * 4 + 3] = 0;
  const dos = jsonDeFixture({
    animaciones: {
      infierno: { fila: 0, cuadros: 1, porSegundo: 0, repite: false },
      cielo: { fila: 1, cuadros: 2, porSegundo: 4, repite: true },
    },
  });
  assert.deepEqual(auditarFixture(dos, 32, 32, { rgba: conSobra }), []);
  // Un personaje lleva transparentes, y no se miran.
  const figura = rgbaDeInfierno(16, 144);
  figura[3] = 0;
  assert.deepEqual(auditarFixture(jsonDePersonaje(), 16, 144, { rgba: figura }), []);
});

test('🔴 V2. un "#" en la columna 1 de una grilla es un caracter, no un comentario que se come la fila', () => {
  const renglones = dibujoDeTiles().split('\n');
  const i = renglones.indexOf('cuadro: infierno 0') + 1;
  renglones[i] = '#' + 'K'.repeat(15);
  const e = leerDibujo(renglones.join('\n'), 'sala.txt').errores;
  assert.equal(e.length, 1, e.join('\n'));
  assert.match(e[0]!, new RegExp(`^sala\\.txt:${i + 1}: "#" no está en la leyenda y aparece 1 vez: renglón ${i + 1} columna 1 `));
  assert.match(e[0]!, /si era un comentario: adentro de una grilla, el "#" lleva un espacio después/i);
  // Un renglón 17 que empieza con "#" tampoco desaparece sin aviso.
  const diecisiete = dibujoDeTiles().split('\n');
  diecisiete.splice(diecisiete.indexOf('cuadro: infierno 0') + 17, 0, '#' + 'K'.repeat(15));
  assert.match(leerDibujo(diecisiete.join('\n'), 'sala.txt').errores.join('\n'), /le sobran renglones: tiene 17/);
  // Y un comentario de verdad adentro de la grilla, con su espacio, no cuenta.
  const comentada = dibujoDeTiles().split('\n');
  comentada.splice(comentada.indexOf('cuadro: infierno 0') + 5, 0, '# acá empieza la segunda hilada', '#');
  assert.deepEqual(leerDibujo(comentada.join('\n'), 'sala.txt').errores, []);
});

test('🔴 V3. un estado mal escrito da un error, no uno por cada cuadro; y "sí" con tilde vale', () => {
  const conTilde = dibujoDeTiles().replace('repite=si', 'repite=sí');
  const leido = leerDibujo(conTilde, 'sala.txt');
  assert.deepEqual(leido.errores, []);
  assert.equal(jsonDelAtlas(leido.dibujo!).animaciones.cielo!.repite, true);

  for (const [mal, motivo] of [
    ['cuadros=2 porSegundo=4 repite=quizas', /repite=quizas: va si o no/],
    ['cuadros=2 porSegundo=rapido repite=si', /porSegundo=rapido/],
    ['cuadros=2 porSegundo=4 repite=si velocidad=4', /"velocidad=4" no se entiende/],
  ] as const) {
    const texto = dibujoDeTiles().replace('cuadros=2 porSegundo=4 repite=si', mal);
    const e = leerDibujo(texto, 'sala.txt').errores;
    assert.equal(e.length, 1, `${mal}:\n${e.join('\n')}`);
    assert.match(e[0]!, motivo);
  }

  // Si lo que falla es cuadros, el estado no existe: sus cuadros dan un error juntos, y
  // ese error manda a arreglar el renglón del estado.
  const sinCuadros = dibujoDeTiles().replace('cuadros=2 porSegundo=4', 'cuadros=dos porSegundo=4');
  const e = leerDibujo(sinCuadros, 'sala.txt').errores;
  assert.equal(e.length, 2, e.join('\n'));
  assert.match(e[0]!, /el estado cielo necesita cuadros=N/);
  assert.match(e[1]!, /el estado cielo no se declaró y tiene 2 cuadros dibujados/);
  assert.match(e[1]!, /el renglón 11 intentó declararlo y no pudo/i);
});

test('🔴 V3. un estado que no pudo declarar sus cuadros no cuenta además como faltante', () => {
  const personaje = dibujoDePersonaje().replace('estado: corre cuadros=1', 'estado: corre cuadros=uno');
  const e = leerDibujo(personaje, 'skayboy.txt').errores;
  assert.equal(e.length, 2, e.join('\n'));
  assert.match(e[0]!, /el estado corre necesita cuadros=N/);
  assert.match(e[1]!, /el estado corre no se declaró y tiene 1 cuadro dibujado \(renglón \d+\)\. El renglón \d+ intentó declararlo/);
  const solo = ['tipo: tile', 'version: 1', 'tinta: K --px-clave', 'estado: a cuadros=x', '', 'cuadro: a 0', ...Array(16).fill('K'.repeat(16)), ''];
  const f = leerDibujo(solo.join('\n'), 'sala.txt').errores;
  assert.equal(f.length, 2, f.join('\n'));
  assert.doesNotMatch(f.join('\n'), /no declara ningún estado/);
});

test('🔴 V3. un tipo o una versión mal escritos dan su error, no además un "falta"', () => {
  const version = leerDibujo(dibujoDeTiles().replace('version: 1', 'version: 0'), 'sala.txt').errores;
  assert.deepEqual(version, ['sala.txt:3: versión "0": va un entero desde 1 (CTR-15.8)']);
  const tipo = leerDibujo(dibujoDeTiles().replace('tipo: tile', 'tipo: baldosa'), 'sala.txt').errores;
  assert.equal(tipo.length, 1, tipo.join('\n'));
  assert.match(tipo[0]!, /^sala\.txt:2: tipo "baldosa" no existe/);
  // Sin el renglón, el "falta" sigue: es el único aviso.
  assert.match(leerDibujo(dibujoDeTiles().replace('version: 1\n', ''), 'sala.txt').errores.join('\n'), /falta "version: N"/);
});

test('🔴 V3. un "cuadro:" mal escrito no deja sus 16 filas sueltas, cada una con su error', () => {
  const texto = dibujoDeTiles().replace('cuadro: cielo 1', 'cuadro: cielo uno');
  const e = leerDibujo(texto, 'sala.txt').errores;
  assert.equal(e.length, 2, e.join('\n'));
  assert.match(e[0]!, /el cuadro se abre con "cuadro: <estado> <índice>" y dice "cielo uno"/);
  assert.match(e[1]!, /falta el cuadro cielo 1/);
});

test('🔴 V4. el plural del cuadro fijo: "el otro" con dos cuadros, "los otros 2" con tres', () => {
  const dos = leerDibujo(dibujoDeTiles().replace('porSegundo=4', 'porSegundo=0'), 'sala.txt').errores.join('\n');
  assert.match(dos, /y el otro no se vería nunca/);
  assert.doesNotMatch(dos, /los otros 1/);
  const tres = dibujoDeTiles({ cuadrosCielo: 3 }).replace('porSegundo=4', 'porSegundo=0');
  assert.match(leerDibujo(tres, 'sala.txt').errores.join('\n'), /y los otros 2 no se verían nunca/);
  const quieto = (cuadros: number) =>
    jsonDeFixture({ animaciones: { infierno: { fila: 0, cuadros, porSegundo: 0, repite: true } } });
  assert.match(auditarFixture(quieto(2), 32, 16).join('\n'), /y el otro no se vería nunca/);
  assert.match(auditarFixture(quieto(3), 48, 16).join('\n'), /y los otros 2 no se verían nunca/);
});

test('🔴 V5. ningún archivo de la cadena lleva un BOM literal: va escrito con su escape', () => {
  const BOM = String.fromCharCode(0xfeff);
  const carpeta = join(REPO, 'src', 'lib', 'pixel');
  const archivos = [...readdirSync(carpeta).filter((f) => f.endsWith('.ts')).map((f) => join(carpeta, f)), IMPRENTA, AUDITOR];
  assert.deepEqual(
    archivos.filter((f) => readFileSync(f, 'utf-8').includes(BOM)),
    [],
    'un U+FEFF literal es invisible: un editor lo normaliza y el arreglo del BOM se pierde sin que ningún test lo note',
  );
});

test('🔴 V6. el auditor pide pieza, y que sea el nombre del PNG sin la versión (CTR-15.7, CTR-15.8)', async () => {
  assert.deepEqual(auditarFixture(jsonDeFixture(), 16, 16, { archivo: 'prueba.v1.png' }), []);
  assert.match(auditarFixture(jsonDeFixture({ pieza: undefined })).join('\n'), /no dice pieza/);
  assert.match(auditarFixture(jsonDeFixture({ pieza: 3 })).join('\n'), /pieza/);
  assert.match(
    auditarFixture(jsonDeFixture({ pieza: 'otra' }), 16, 16, { archivo: 'prueba.v1.png' }).join('\n'),
    /dice pieza "otra" y el archivo es de prueba/,
  );
  assert.match(auditarFixture(jsonDeFixture(), 16, 16, { archivo: 'prueba.png' }).join('\n'), /<pieza>\.v<N>\.png/);
  const dir = raiz();
  try {
    await spriteDeFixture(dir);
    writeFileSync(join(dir, 'public', 'sprites', 'prueba.v1.json'), JSON.stringify(jsonDeFixture({ pieza: 'otra' })));
    const a = correr(AUDITOR, dir);
    assert.notEqual(a.codigo, 0, a.salida);
    assert.match(a.salida, /dice pieza "otra"/);
  } finally {
    limpiar(dir);
  }
});

test('🔴 V7. una redefinición sin ";" al final (la última de su bloque) también se ve', () => {
  const hoja = hojaDeFixture() + `@media (prefers-color-scheme: light) { :root { --fondo: ${PAPEL} } }\n`;
  const { errores } = paletaDelArea(hoja);
  assert.equal(errores.length, 1, errores.join('\n'));
  assert.match(errores[0]!, /--px-clave pasa por --fondo, que está declarada dos veces/);
  // Y una tinta declarada así, última de su bloque y sin ";", se lee.
  const alFinal = `:root {\n  --fondo: ${FONDO};\n  --px-clave: var(--fondo)\n}\n`;
  assert.equal(paletaDelArea(alFinal).tintas.get('--px-clave'), FONDO);
});
