import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { corridaDe, transformDe } from './camara.ts';
import { ENTERA, LUPA, acotar, centrar, conLupa, enElMundo, enfocar, entreLentes } from './lupa.ts';

/**
 * La lupa (`D-90`): acercarse a mirar, en el plano y en los caminos. Lo que se cuida: que no se
 * salga del mundo, que lo que está debajo del dedo se quede debajo del dedo, y que no rompa ni el
 * caminar de costado (`D-77`) ni el toque que abre una ficha (`T-522`).
 */

const vista = { ancho: 430, alto: 860 };
const mundo = { ancho: 3225, alto: 860 };
const cerca = (a: number, b: number, e = 1e-6): boolean => Math.abs(a - b) < e;

test('la lupa tiene tope, y sin lupa no hay nada corrido', () => {
  assert.ok(LUPA.min === 1 && LUPA.max > 2 && LUPA.max <= 3, 'más de 3 y el aerógrafo impreso se empasta');
  assert.ok(LUPA.doble > 1.5 && LUPA.doble <= LUPA.max);
  assert.deepEqual(acotar({ z: 9, x: 0, y: 0 }, vista, mundo).z, LUPA.max);
  assert.deepEqual(acotar({ z: 0.2, x: -50, y: 99 }, vista, mundo), { z: 1, x: 0, y: 0 });
  assert.equal(conLupa(ENTERA), false);
  assert.equal(conLupa({ z: 1.3, x: 0, y: 0 }), true);
});

test('la lente no se sale del mundo: ni de costado ni para abajo', () => {
  for (const z of [1, 1.4, 2, LUPA.max]) {
    const l = acotar({ z, x: 1e6, y: 1e6 }, vista, mundo);
    assert.ok(cerca(l.x, mundo.ancho - vista.ancho / z), `z ${z}: x ${l.x}`);
    assert.ok(cerca(l.y, mundo.alto - vista.alto / z), `z ${z}: y ${l.y}`);
    const o = acotar({ z, x: -1e6, y: -1e6 }, vista, mundo);
    assert.deepEqual([o.x, o.y], [0, 0]);
  }
  // Un mundo más angosto que la vista (un recinto en una pantalla ancha) no se corre para atrás.
  assert.equal(acotar({ z: 1, x: 300, y: 0 }, { ancho: 1400, alto: 800 }, { ancho: 900, alto: 800 }).x, 0);
});

test('lo que está debajo del dedo se queda debajo del dedo', () => {
  let l = { z: 1, x: 800, y: 0 };
  const [fx, fy] = [300, 500];
  const antes = enElMundo(l, fx, fy);
  for (const z of [1.3, 1.9, 2.6, 1.5]) {
    l = enfocar(l, z, fx, fy, vista, mundo);
    const ahora = enElMundo(l, fx, fy);
    assert.ok(cerca(ahora.x, antes.x) && cerca(ahora.y, antes.y), `z ${z}: se corrió a ${ahora.x}, ${ahora.y}`);
  }
  // Y el doble toque deja al bicho en el medio.
  const c = centrar(LUPA.doble, 1500, 430, vista, mundo);
  const medio = enElMundo(c, vista.ancho / 2, vista.alto / 2);
  assert.ok(cerca(medio.x, 1500) && cerca(medio.y, 430));
});

test('el viaje de la lupa sale de donde estaba y llega a donde va', () => {
  const a = { z: 1, x: 100, y: 0 };
  const b = { z: 2, x: 400, y: 200 };
  assert.deepEqual(entreLentes(a, b, 0), a);
  const fin = entreLentes(a, b, 1);
  assert.ok(cerca(fin.z, 2) && cerca(fin.x, 400) && cerca(fin.y, 200));
  assert.deepEqual(entreLentes(a, b, 7), entreLentes(a, b, 1));
  const mitad = entreLentes(a, b, 0.5);
  assert.ok(mitad.z > 1 && mitad.z < 2 && mitad.x > 100 && mitad.x < 400);
});

test('la lupa va adentro del encuadre de la cámara, y sin lupa el transform es el de siempre', () => {
  const e = { x: 0, y: 0, giro: 0, escala: 1, ox: 100, oy: 50 };
  assert.equal(transformDe(e, 0, -30), transformDe(e, 0, -30, 1, 0));
  assert.match(transformDe(e, 0, -30), /translate3d\(-30\.0px, 0, 0\)$/);
  assert.match(transformDe(e, 0, -30, 2, -40), /scale\(2\.0000\) translate3d\(-30\.0px, -40\.0px, 0\)$/);
  assert.equal(corridaDe(12), 'translate3d(12.0px, 0, 0)');
  assert.equal(corridaDe(0, 1.5, -8), 'scale(1.5000) translate3d(0.0px, -8.0px, 0)');
});

test('caminar sigue siendo del navegador: con la lupa, un píxel de deslizar es un píxel de pantalla', () => {
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  // La tira mide z veces su ancho, así el scroll nativo no se entera de la lupa (`D-77`).
  assert.match(isla, /tira\.style\.width = `\$\{Math\.round\(anchoPx \* lente\.z\)\}px`/);
  assert.match(isla, /cam = escenario\.scrollLeft \/ lente\.z;/);
  assert.match(isla, /const recorrido = \(\): number => Math\.max\(0, anchoPx \* lente\.z - vistaPx\);/);
  // Nadie le saca el dedo al navegador: de costado se camina siempre.
  const css = readFileSync('src/styles/camino.css', 'utf-8');
  assert.match(css, /\.camino--andando \.camino-escenario \{[^}]*touch-action: pan-x pinch-zoom;/);
  assert.match(css, /\.camino--lupa \.camino-escenario \{ touch-action: pan-x; \}/);
  assert.doesNotMatch(css, /camino[^{]*\{[^}]*touch-action: none/);
});

test('el pellizco no le pelea al navegador ni se come los toques', () => {
  const gestos = readFileSync('src/scripts/bestiario/pellizco.ts', 'utf-8');
  // Si el navegador ya se llevó el gesto, se lo deja.
  assert.match(gestos, /if \(!ev\.cancelable\) \{/);
  // Solo se frena el gesto de dos dedos: uno solo camina.
  assert.match(gestos, /if \(abierto === null \|\| ev\.touches\.length !== 2\) return;\s*\/\/[^\n]*\n\s*if \(!ev\.cancelable\)/);
  // El toque que la isla le pasa a un títere no es de un dedo: no cuenta para el doble toque (`T-522`).
  assert.match(gestos, /if \(!ev\.isTrusted\) return;/);
  // Los enlaces y los botones no esperan un segundo toque.
  assert.match(gestos, /const DE_TOCAR = 'a, button/);
});

test('con movimiento reducido la lupa llega de una, y hay una vuelta a la vista', () => {
  for (const archivo of ['src/scripts/camino.ts', 'src/scripts/bestiario/lupa-plano.ts']) {
    const isla = readFileSync(archivo, 'utf-8');
    assert.match(isla, /function viajar\(hasta: Lente\): void \{[\s\S]{0,160}if \(quieto\(\)\) \{\s*viaje = null;\s*(ponerLente|poner)\(hasta\);/, `${archivo}: la lupa viaja aunque se pidió quietud`);
    assert.match(isla, /todo\.hidden = !puesta|lupaTodo\.hidden = !puesta/);
  }
  // El botón de la vuelta está en las dos páginas, y los signos tienen nombre para el lector de pantalla.
  for (const pagina of ['src/pages/redondopedia/bestiario.astro', 'src/pages/redondopedia/bestiario/[region].astro']) {
    const html = readFileSync(pagina, 'utf-8');
    assert.match(html, /id="lupa-todo" hidden>\{BESTIARIO\.lupa\.todo\}/);
    assert.match(html, /id="lupa-mas" aria-label=\{BESTIARIO\.lupa\.acercar\}/);
    assert.match(html, /id="lupa-menos" aria-label=\{BESTIARIO\.lupa\.alejar\}/);
  }
  // El teclado también: más, menos y cero.
  assert.match(readFileSync('src/scripts/camino.ts', 'utf-8'), /'\+': \(\) => pasoDeLupa\(LUPA\.paso\)/);
});

test('la lupa del plano agranda la lente y nada más: solo transform', () => {
  const isla = readFileSync('src/scripts/bestiario/lupa-plano.ts', 'utf-8');
  assert.deepEqual([...new Set([...isla.matchAll(/\.style\.(\w+)/g)].map((m) => m[1]))], ['transform']);
  const css = readFileSync('src/styles/sitio.css', 'utf-8');
  assert.match(css, /\.bestiario-lente \{[^}]*transform-origin: 0 0;/);
  // Con la lupa puesta el dedo lleva el plano; sin ella, la página baja como siempre.
  assert.match(css, /\.bestiario-marco--lupa \{[^}]*touch-action: none;/);
  assert.doesNotMatch(css, /\.bestiario-marco \{[^}]*touch-action/);
});

test('el doble toque tiene margen: medio segundo y 44 px, contados desde que se apoya el dedo', () => {
  // Con 350 ms y 28 px fallaba con el teléfono cargado (`D-90`, sexta ronda).
  assert.ok(LUPA.doblePausa >= 500 && LUPA.doblePausa <= 600);
  assert.ok(LUPA.dobleRadio >= 40 && LUPA.dobleRadio <= 48, 'un dedo, no media pantalla');
  const gesto = readFileSync('src/scripts/bestiario/pellizco.ts', 'utf-8');
  assert.match(gesto, /addEventListener\('pointerdown', \(ev\) => \(apoyado = ev\.timeStamp \|\| performance\.now\(\)\), \{ passive: true, capture: true \}\)/);
  assert.match(gesto, /const ahora = apoyado \|\| performance\.now\(\);/);
});
