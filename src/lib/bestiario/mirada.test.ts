import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { ATENCION, miradaDe, seguir } from '../../scripts/bestiario/mirada.ts';
import { MIRAR_CADA } from '../../scripts/bestiario/vivos.ts';
import { mirarVigias, vigia } from '../../scripts/bestiario/vigia.ts';

/**
 * La mirada y el descarte (`D-90`, cuarta ronda): los títeres más vistos saben dónde está el dedo, y
 * los que nadie ve no se mueven.
 */

test('sin puntero no hay mirada, y no se toca el DOM para averiguarlo', () => {
  let medido = 0;
  const el = { getScreenCTM: () => (medido++, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }) } as unknown as SVGGraphicsElement;
  assert.deepEqual(miradaDe(el, 10, 10), { dx: 0, dy: 0, cerca: 0 });
  assert.equal(medido, 0, 'midió la pantalla sin que nadie hubiera movido nada');
  assert.deepEqual(miradaDe(null, 0, 0), { dx: 0, dy: 0, cerca: 0 });
  assert.ok(ATENCION >= 1500 && ATENCION <= 4000, 'la atención dura lo que dura mirar');
});

test('la mirada llega tarde y con peso: se acerca, no salta', () => {
  let v = 0;
  for (let i = 0; i < 6; i++) v = seguir(v, 1, 1 / 60, 3);
  assert.ok(v > 0.2 && v < 0.5, `a la décima de segundo va por ${v}`);
  assert.equal(seguir(0, 1, 10, 3), 1, 'un cuadro eterno no se pasa de largo');
});

test('los cinco más vistos miran: el lobo, las lobas, Pierre, Momo y Luzbelito', () => {
  const recintos = readFileSync('src/scripts/bestiario/recintos.ts', 'utf-8');
  const camino = readFileSync('src/scripts/camino.ts', 'utf-8');
  const lobas = readFileSync('src/scripts/bestiario/lobas.ts', 'utf-8');
  assert.match(camino, /miradaDe\(g, AL\.cabeza\[0\], AL\.cabeza\[1\] - 60/, 'el lobo no mira');
  assert.match(lobas, /miradaDe\(titere, VERSO\[0\]/, 'las lobas no espían');
  // Eran tres; en la sexta ronda se sumó Limón, que mira al dedo cuando no corre.
  assert.equal((recintos.match(/miradaDe\(g, /g) ?? []).length, 4, 'Luzbelito, Momo, Pierre y Limón');
  // Y los dos de la prisión, que miran desde el cuerpo entero (el grupo que la isla mueve).
  assert.match(recintos, /miradaDe\(entero, AB\.cuello\[0\], AB\.cuello\[1\] - 80, 320\)/, 'Barbazul no mira');
  assert.match(recintos, /modo === 'para' \? miradaDe\(entera, cx, cy - 50, 340\)/, 'la drácula no mira');
  // Los tres respiran: crecen desde los pies, o se hinchan desde donde apoyan. Solo `transform`.
  assert.match(recintos, /scale\(\$\{escala\} \$\{\(escala \* \(1 \+ respira \* 0\.007\)\)\.toFixed\(4\)\}\)/);
  assert.match(recintos, /scale\(\$\{escala\} \$\{\(escala \* \(1 \+ respira \* 0\.006\)\)\.toFixed\(4\)\}\)/);
  assert.match(recintos, /const hincha = `translate\(0 \$\{base\}\) scale\(/);
  // Respiran con peso: se llenan despacio y se vacían más rápido (no es un seno parejo).
  for (const [quien, fuente] of [['el lobo', camino], ['las lobas', lobas], ['Pierre', recintos]] as const) {
    assert.match(fuente, /aire > 0 \? Math\.pow\(aire, 0\.7\) : -Math\.pow\(-aire, 1\.[56]\)/, `${quien} respira parejo`);
  }
  // Lo que cuelga llega después: la cabeza del lobo y el medallón van con resorte.
  assert.match(camino, /cuerpo\.v \+= \(\(quiere \+ empuje - cuerpo\.cabeza\) \* 42 - cuerpo\.v \* 7\.5\) \* dt;/);
  assert.match(recintos, /peso\.v \+= \(\(tira - peso\.a\) \* 14 - peso\.v \* 1\.6\) \* dt;/);
});

test('lo que no se ve no se mueve: el elenco se mira de a tandas, y los ojos por la vista', () => {
  const vivos = readFileSync('src/scripts/bestiario/vivos.ts', 'utf-8');
  assert.ok(MIRAR_CADA >= 10 && MIRAR_CADA <= 40, 'ni cada cuadro (caro) ni cada segundo (se nota)');
  // Se mide antes de mover a nadie, todos juntos: una sola medición por tanda.
  assert.match(vivos, /cuadros\+\+ % MIRAR_CADA === 0\) \{[\s\S]{0,160}ctx\.seVe!\(m\)[\s\S]{0,200}mirarVigias\(ctx\);\s*\}\s*vida\.mover\(t, dt\);/);
  // La pose quieta va para todos: con movimiento reducido nadie queda a medio armar.
  assert.match(vivos, /if \(dt === 0 \|\| aLaVista\[i\]\) vivos\[i\]!\.mover\(t, dt\);/);
  const recintos = readFileSync('src/scripts/bestiario/recintos.ts', 'utf-8');
  assert.match(recintos, /const vista = dt > 0 \? ctx\.vista\?\.\(\) : undefined;/);
  // Y el camino presta la vista con margen: lo que está por entrar ya se mueve.
  assert.match(readFileSync('src/scripts/camino.ts', 'utf-8'), /return \[desde - ancha \* 0\.5, desde \+ ancha \* 1\.5\];/);
});

test('los títeres grandes tienen vigía: se miran juntos, y sin quien mire se ven siempre', () => {
  const el = {} as Element;
  // El recinto de la página del bestiario no presta `seVe`: ahí se mueve todo.
  assert.equal(vigia({}, el)(), true);
  assert.equal(vigia({ seVe: () => false }, null)(), true);
  let visible = false;
  const ctx = { seVe: () => visible };
  const seVe = vigia(ctx, el);
  assert.equal(seVe(), true, 'hasta la primera tanda, se mueve');
  mirarVigias(ctx);
  assert.equal(seVe(), false);
  visible = true;
  assert.equal(seVe(), false, 'no mide por su cuenta: espera a la tanda');
  mirarVigias(ctx);
  assert.equal(seVe(), true);
  const recintos = readFileSync('src/scripts/bestiario/recintos.ts', 'utf-8');
  // Luzbelito, Momo, Pierre y Barbazul. La drácula no: anda por el pasillo, y quieta no volvería.
  assert.equal((recintos.match(/= vigia\(ctx, /g) ?? []).length, 4);
  assert.equal((recintos.match(/if \(dt === 0 \|\| (seVe|veBarbazul)\(\)\)/g) ?? []).length, 4);
  // El lobo de la pastura mira igual que el del monte.
  assert.match(readFileSync('src/scripts/bestiario/pastura.ts', 'utf-8'), /miradaDe\(gLobo, AL\.cabeza\[0\], AL\.cabeza\[1\] - 60/);
});
