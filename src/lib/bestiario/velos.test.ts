import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';

import { PIEZAS_DE_VELO } from './arte-velos.ts';
import { CON_CAMINO } from './camino.ts';
import { EL_PLANO, ESPERA, HOJA, SOBRA, VELOS, piezaDelVelo, rutaDelVelo } from './velos.ts';
import { ACECHOS, LUCES } from './aire.ts';
import { CAMINO } from './copy.ts';
import { destinoDe } from '../../scripts/bestiario/llegada.ts';

const sitio = readFileSync('src/styles/sitio.css', 'utf-8').replace(/\r\n/g, '\n');
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

test('el velo se va moviendo nada más que transform, y no frena a nadie', () => {
  const caja = /\.velo-de-llegada,\n\.velo-de-salida \{[^}]*\}/.exec(sitio)![0];
  assert.match(caja, /pointer-events: none;/, 'quien quiera caminar ya puede');
  const capas = /\.velo-de-llegada::before,\n\.velo-de-llegada::after \{[^}]*\}/.exec(sitio)![0];
  assert.match(capas, /animation-duration: var\(--duracion-velo\);/);
  assert.match(capas, /animation-fill-mode: both;/);
  const bloque = sitio.slice(sitio.indexOf('El velo de llegada del bestiario'), sitio.indexOf('⟨la liebre muerta⟩'));
  const sinComentarios = bloque.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(sinComentarios, /filter|shadow|gradient|blur/);
  for (const rumbo of ['sube', 'baja', 'corre']) {
    const cuadros = new RegExp(`@keyframes velo-${rumbo} \\{[\\s\\S]*?\\n\\}`).exec(sitio)![0];
    const propiedades = [...new Set([...cuadros.matchAll(/^\s+([a-z-]+):/gm)].map((m) => m[1]))].sort();
    assert.deepEqual(propiedades, ['transform', 'visibility'], `velo-${rumbo} mueve otra cosa`);
    for (const cual of ['llegada', 'salida']) {
      assert.match(sitio, new RegExp(`\\.velo-de-${cual}\\[data-rumbo='${rumbo}'\\]::after[^{}]*\\{[^}]*animation-name: velo-${rumbo};`));
    }
  }
  // Lo demás que se anima en el velo solo cambia `visibility` u `opacity`.
  for (const [nombre, deja] of [['velo-tinta', 'visibility'], ['velo-respaldo', 'visibility'], ['velo-asoma', 'opacity'], ['velo-gira', 'rotate'], ['velo-acerca', 'scale']] as const) {
    const cuadros = new RegExp(`@keyframes ${nombre} \\{[\\s\\S]*?\\n\\}`).exec(sitio)![0];
    assert.deepEqual([...new Set([...cuadros.matchAll(/^\s+([a-z-]+):/gm)].map((m) => m[1]))], [deja], `${nombre} mueve otra cosa`);
  }
  // Lo que tarda en irse: del orden de un segundo, y cero con movimiento reducido (un corte).
  const dura = Number(/--duracion-velo:\s*(\d+)ms/.exec(tokens)![1]);
  assert.ok(dura >= 600 && dura <= 1000, `dura ${dura} ms`);
  const corte = tokens.slice(tokens.lastIndexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(corte, /--duracion-velo:\s*0ms;/);
});

test('D-91: tapa con tinta sólida desde el primer cuadro, antes de que llegue la hoja impresa', () => {
  // La tinta va en una capa propia, debajo de la hoja, y no depende de ninguna imagen.
  const tinta = /\.velo-de-llegada::before,\n\.velo-de-salida::before \{[^}]*\}/.exec(sitio)![0];
  assert.match(tinta, /inset: 0;/);
  assert.match(tinta, /background: var\(--tinta-velo, var\(--fondo\)\);/);
  assert.doesNotMatch(tinta, /url\(|--velo\)/);
  // Y es la tinta con la que está pintado el cuerpo de la hoja: cuando la hoja llega, no se nota el cambio.
  const componente = readFileSync('src/components/bestiario/VeloDeLlegada.astro', 'utf-8');
  assert.match(componente, /--tinta-velo: \$\{velo\.tinta\}/);
  for (const p of PIEZAS_DE_VELO) {
    const region = Object.keys(VELOS).find((r) => piezaDelVelo(r) === p.nombre)!;
    const { tinta: t } = VELOS[region]!;
    const token = /^var\((--[a-z0-9-]+)\)$/.exec(t)?.[1];
    assert.ok(token, `${region}: la tinta no es un token`);
    assert.match(tokens, new RegExp(`^\\s*${token}:`, 'm'), `${region}: ${token} no está en tokens.css`);
    assert.ok(p.dibujo.includes(t), `${region}: la hoja no está pintada con ${t}`);
  }
});

test('D-91: espera a la isla, y nunca deja a nadie adentro', () => {
  // Quieta hasta que la isla avisa…
  const capas = /\.velo-de-llegada::before,\n\.velo-de-llegada::after \{[^}]*\}/.exec(sitio)![0];
  assert.match(capas, /animation-play-state: paused;/);
  assert.match(sitio, /\.velo-de-llegada\[data-listo\]::before,\n\.velo-de-llegada\[data-listo\]::after \{\s*animation-play-state: running;/);
  // …con un respaldo de CSS que la corta sola si la isla no avisó nunca…
  assert.match(sitio, /\.velo-de-llegada \{\s*animation: velo-respaldo var\(--duracion-velo\) linear var\(--respaldo-velo\) both;/);
  const respaldo = Number(/--respaldo-velo:\s*(\d+)ms/.exec(tokens)![1]);
  const aviso = Number(/--aviso-velo:\s*(\d+)ms/.exec(tokens)![1]);
  assert.equal(respaldo, ESPERA.respaldo);
  assert.equal(aviso, ESPERA.aviso);
  // …más tarde que el tope de la isla, que con red mala la suelta con su barrida y no de un corte.
  assert.ok(ESPERA.tope >= 4000 && ESPERA.tope < ESPERA.respaldo && ESPERA.respaldo <= 8000);
  assert.ok(ESPERA.aviso >= 1000 && ESPERA.aviso < ESPERA.tope, 'una llegada rápida no lee el aviso');
  // …y sin JavaScript se va enseguida, como siempre (`ADR-03`, molinetes abiertos).
  const componente = readFileSync('src/components/bestiario/VeloDeLlegada.astro', 'utf-8');
  assert.match(componente, /<noscript>\s*<style is:inline>[\s\S]*\.velo-de-llegada::after \{\s*animation-play-state: running;/);
  // Con movimiento reducido espera igual y se va de un corte: una animación de duración cero ya nace
  // en su último cuadro (afuera), así que ahí la hoja no se anima y la saca `data-listo`.
  const quieto = sitio.slice(sitio.indexOf('.velo-de-llegada[data-listo] .velo-signo'), sitio.indexOf('@keyframes velo-asoma'));
  assert.match(quieto, /@media \(prefers-reduced-motion: reduce\) \{\s*\.velo-de-llegada\[data-rumbo\]::before,\s*\.velo-de-llegada\[data-rumbo\]::after \{\s*animation-name: none;/);
  assert.match(quieto, /\.velo-de-llegada\[data-listo\] \{\s*visibility: hidden;/);
  assert.match(componente, /@media \(prefers-reduced-motion: reduce\) \{\s*\.velo-de-llegada \{\s*display: none;/, 'sin JavaScript y con movimiento reducido, el velo se queda');
  // La isla lo suelta al final de su arranque, y un error de script también.
  const llegada = readFileSync('src/scripts/bestiario/llegada.ts', 'utf-8');
  assert.match(llegada, /Promise\.race\(\[[\s\S]*espera\(queda\)\]\)/, 'sin tope');
  assert.match(llegada, /\.decode\(\)/, 'no espera a que las imágenes estén decodificadas');
  assert.match(llegada, /addEventListener\('error'/, 'un error de la isla deja el velo puesto');
  for (const isla of ['src/scripts/camino.ts', 'src/scripts/bestiario.ts']) {
    assert.match(readFileSync(isla, 'utf-8').trimEnd(), /contestarAlIrse\(\);\r?\nvoid soltarElVelo\(\);$/, `${isla} no suelta el velo al terminar de arrancar`);
  }
});

test('D-91: el velo va en las trece regiones y en el plano, y se pide antes que nada', () => {
  const region = readFileSync('src/pages/redondopedia/bestiario/[region].astro', 'utf-8');
  const plano = readFileSync('src/pages/redondopedia/bestiario.astro', 'utf-8');
  // Una sola plantilla para las trece regiones (`getStaticPaths` sobre `CON_CAMINO`), y el plano.
  assert.match(region, /CON_CAMINO\.map\(\(region\) => \(\{ params: \{ region \} \}\)\)/);
  assert.match(region, /<VeloDeLlegada destino=\{id\} \/>/, 'la región: sin velo');
  assert.match(plano, /<VeloDeLlegada destino=\{EL_PLANO\} \/>/, 'el plano: sin velo');
  for (const [nombre, pagina] of [['la región', region], ['el plano', plano]] as const) {
    assert.match(pagina, /<link rel="preload" as="image" href=\{rutaDelVelo\([^)]+\)\} fetchpriority="high" \/>/, `${nombre}: no pide su velo de entrada`);
    assert.match(pagina, /<link rel="prefetch" as="image" href=\{rutaDelVelo\(/, `${nombre}: no pide de antemano los de adonde se puede ir`);
  }
  const componente = readFileSync('src/components/bestiario/VeloDeLlegada.astro', 'utf-8');
  assert.match(componente, /<div\s+class="velo-de-llegada"\s+aria-hidden="true"\s+data-rumbo=\{velo\.rumbo\}/);
  // El aviso es registro 3 (`voz-ricotera.md`): seco, sin suspensivos ni exclamación.
  assert.match(CAMINO.cargando, /^[A-ZÁÉÍÓÚÑ ]+\.$/);
});

test('D-91: al tocar un cartel o «Al plano», la hoja del destino entra en la página que se deja', () => {
  const aca = 'https://x.test/redondopedia/bestiario/el-monte/';
  assert.equal(destinoDe('/redondopedia/bestiario/la-pastura/#camino', aca), 'la-pastura');
  assert.equal(destinoDe('/redondopedia/bestiario/', aca), EL_PLANO);
  assert.equal(destinoDe('/redondopedia/bestiario/#plano', aca), EL_PLANO);
  assert.equal(destinoDe('/redondopedia/bestiario/el-monte/', 'https://x.test/redondopedia/bestiario/'), 'el-monte');
  // No es un paso entre pantallas: la misma página, otra parte del sitio, otro sitio.
  assert.equal(destinoDe('#b-el-lobo-suelto', aca), null);
  assert.equal(destinoDe('/redondopedia/bestiario/el-monte/#cruce', aca), null);
  assert.equal(destinoDe('/redondopedia/', aca), null);
  assert.equal(destinoDe('/redondopedia/bestiario/no-existe/', aca), null);
  assert.equal(destinoDe('https://otro.test/redondopedia/bestiario/', aca), null);
  for (const r of CON_CAMINO) assert.equal(destinoDe(`/redondopedia/bestiario/${r}/#camino`, 'https://x.test/redondopedia/bestiario/'), r);
  // No frena la navegación, y la hoja de salida no se queda si la página no llega o se vuelve con «atrás».
  const llegada = readFileSync('src/scripts/bestiario/llegada.ts', 'utf-8');
  assert.doesNotMatch(llegada, /preventDefault\(\)/, 'la hoja de salida frena el toque');
  assert.match(llegada, /setTimeout\(sacarLaSalida, ESPERA\.salida\)/);
  assert.match(llegada, /addEventListener\('pageshow'/);
  // Entra al revés de como se va, y la tinta de abajo aparece cuando la hoja ya tapó.
  assert.match(sitio, /\.velo-de-salida::after \{[^}]*animation-direction: reverse;/);
  assert.match(sitio, /\.velo-de-salida::before \{\s*animation: velo-tinta [^;]* reverse;/);
});

test('D-91, segunda vuelta: el signo de espera es de cada lugar, no un sistema con trece pieles', () => {
  const con = Object.entries(VELOS).filter(([, v]) => v.signo);
  // Los ojos son del monte y de nadie más: en todas las llegadas gastaban el misterio.
  assert.deepEqual(con.filter(([, v]) => v.signo === 'ojos').map(([r]) => r), ['el-monte']);
  assert.equal(VELOS['la-ruta']!.signo, 'faros');
  assert.equal(VELOS['la-pastura']!.signo, 'molino');
  // Ningún signo se repite, y las otras diez y el plano van con el aviso solo.
  assert.equal(new Set(con.map(([, v]) => v.signo)).size, con.length);
  assert.equal(con.length, 3);
  // Los que son imagen usan la pieza impresa de su escena: los ojos sin dueño y la rueda que gira.
  assert.ok(ACECHOS['el-monte'] && existsSync(`public/bestiario/${ACECHOS['el-monte']!.pieza}.webp`));
  assert.equal(LUCES['la-pastura']![0]!.pieza, 'luz-pastura-rueda');
  assert.ok(existsSync('public/bestiario/luz-pastura-rueda.webp'));
  // Los faros son dos discos de tinta plana: sin halo, sin sombra, sin degradé.
  const faros = /\.velo-signo--faros i \{[^}]*\}/.exec(sitio)![0];
  assert.match(faros, /background: var\(--papel\);/);
  assert.doesNotMatch(faros, /shadow|gradient|filter/);
  // La rueda gira en bucle y con movimiento reducido queda quieta y a la vista.
  assert.match(sitio, /\.velo-signo--molino \{\s*animation: none;\s*opacity: 1;/);
});

