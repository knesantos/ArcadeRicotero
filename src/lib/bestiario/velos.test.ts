import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';

import { PIEZAS_DE_VELO } from './arte-velos.ts';
import { CON_CAMINO } from './camino.ts';
import { EL_PLANO, HOJA, SOBRA, VELOS, piezaDelVelo, rutaDelVelo } from './velos.ts';

const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
const tokens = readFileSync('src/styles/tokens.css', 'utf-8');

test('cada región que se camina tiene su velo de llegada, y el plano el suyo', () => {
  assert.deepEqual(Object.keys(VELOS).sort(), [...CON_CAMINO, EL_PLANO].sort());
  for (const [region, v] of Object.entries(VELOS)) {
    assert.ok(v.firma.length > 12, `${region}: sin firma`);
    assert.ok(existsSync(`public${rutaDelVelo(region)}`), `${region}: falta imprimir su velo (--solo velo-)`);
  }
  // Ninguna firma se repite: es una por destino.
  assert.equal(new Set(Object.values(VELOS).map((v) => v.firma)).size, Object.keys(VELOS).length);
});

test('los velos están impresos con la mano de su tapa, y pesan poco', () => {
  let total = 0;
  for (const p of PIEZAS_DE_VELO) {
    const region = Object.keys(VELOS).find((r) => piezaDelVelo(r) === p.nombre)!;
    const { mano, rumbo } = VELOS[region]!;
    assert.doesNotMatch(p.dibujo, /Gradient/i, `${p.nombre}: un degradado`);
    if (mano === 'soplada') assert.match(p.dibujo, /^<g filter="url\(#rociado\)">/, `${p.nombre}: lo soplado va con grano`);
    else {
      assert.match(p.dibujo, new RegExp(`^<g filter="url\\(#${mano === 'crayon' ? 'xerox-fino' : mano === 'gubia' ? 'gubia' : 'grano'}\\)">`), `${p.nombre}: no es la mano de su tapa`);
      assert.doesNotMatch(p.dibujo, /soplo-/, `${p.nombre}: un soplo en una tapa de canto duro`);
    }
    // La hoja se acuesta si corre y se para si sube o baja; siempre sobra un canto para arrastrar.
    const [, , ancho, alto] = p.caja;
    assert.equal(rumbo === 'corre' ? ancho : alto, HOJA.largo);
    const peso = statSync(`public/bestiario/${p.nombre}.webp`).size;
    assert.ok(peso < 60_000, `${p.nombre} pesa ${Math.round(peso / 1024)} kB`);
    total += peso;
  }
  assert.ok(total < 520_000, `los velos pesan ${Math.round(total / 1024)} kB entre todos`);
  assert.ok(SOBRA >= 130 && SOBRA <= 150);
  // No queda impreso ningún velo que ya no sea de nadie.
  const impresos = readdirSync('public/bestiario').filter((n) => n.startsWith('velo-')).sort();
  assert.deepEqual(impresos, PIEZAS_DE_VELO.map((p) => `${p.nombre}.webp`).sort());
});

test('el velo se va solo, moviendo nada más que transform, y no frena a nadie', () => {
  const regla = /\.velo-de-llegada \{[^}]*\}/.exec(sitio)![0];
  assert.match(regla, /pointer-events: none;/, 'quien quiera caminar ya puede');
  assert.match(regla, /animation-duration: var\(--duracion-velo\);/);
  assert.match(regla, /animation-fill-mode: both;/);
  assert.doesNotMatch(regla, /filter|shadow|gradient|blur/);
  for (const rumbo of ['sube', 'baja', 'corre']) {
    const cuadros = new RegExp(`@keyframes velo-${rumbo} \\{[\\s\\S]*?\\n\\}`).exec(sitio)![0];
    const propiedades = [...new Set([...cuadros.matchAll(/^\s+([a-z-]+):/gm)].map((m) => m[1]))].sort();
    assert.deepEqual(propiedades, ['transform', 'visibility'], `velo-${rumbo} mueve otra cosa`);
    assert.match(sitio, new RegExp(`\\.velo-de-llegada\\[data-rumbo='${rumbo}'\\] \\{[^}]*animation-name: velo-${rumbo};`));
  }
  // El tope: del orden de un segundo, y cero con movimiento reducido (un corte).
  const dura = Number(/--duracion-velo:\s*(\d+)ms/.exec(tokens)![1]);
  assert.ok(dura >= 600 && dura <= 1000, `dura ${dura} ms`);
  const corte = tokens.slice(tokens.lastIndexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(corte, /--duracion-velo:\s*0ms;/);
});

test('el velo es de la página a la que se llega, sin JavaScript, y se pide antes que nada', () => {
  const region = readFileSync('src/pages/redondopedia/bestiario/[region].astro', 'utf-8');
  const plano = readFileSync('src/pages/redondopedia/bestiario.astro', 'utf-8');
  for (const [nombre, pagina] of [['la región', region], ['el plano', plano]] as const) {
    assert.match(pagina, /<div class="velo-de-llegada" aria-hidden="true" data-rumbo=\{VELOS\[/, `${nombre}: sin velo`);
    assert.match(pagina, /<link rel="preload" as="image" href=\{rutaDelVelo\([^)]+\)\} fetchpriority="high" \/>/, `${nombre}: no pide su velo de entrada`);
    assert.match(pagina, /<link rel="prefetch" as="image" href=\{rutaDelVelo\(/, `${nombre}: no pide de antemano los de adonde se puede ir`);
  }
  // `ADR-03`: el paso entre pantallas no tiene JavaScript. Si la isla falla, el velo se va igual.
  for (const isla of ['src/scripts/camino.ts', 'src/scripts/bestiario.ts']) {
    if (existsSync(isla)) assert.doesNotMatch(readFileSync(isla, 'utf-8'), /velo-de-llegada/, `${isla} toca el velo`);
  }
});
