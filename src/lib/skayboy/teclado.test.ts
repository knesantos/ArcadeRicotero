import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TECLAS_FISICAS, botonDelEvento, teclaDelBoton } from './teclado.ts';

test('D-53: W A D mueven a Skayboy (columna izquierda) y las flechas a Poligirl (derecha)', () => {
  // `D-43`: la columna izquierda es siempre de Skayboy. La mano izquierda va con ella.
  assert.deepEqual(botonDelEvento({ code: 'KeyA' }), TECLAS_FISICAS[0]);
  for (const [code, mando, tecla] of [
    ['KeyA', 'izquierda', 'izquierda'],
    ['KeyD', 'izquierda', 'derecha'],
    ['KeyW', 'izquierda', 'salto'],
    ['ArrowLeft', 'derecha', 'izquierda'],
    ['ArrowRight', 'derecha', 'derecha'],
    ['ArrowUp', 'derecha', 'salto'],
  ] as const) {
    const t = botonDelEvento({ code });
    assert.equal(t?.mando, mando, code);
    assert.equal(t?.tecla, tecla, code);
  }
});

test('las seis teclas del mando tienen una tecla física cada una, y ninguna se repite', () => {
  for (const mando of ['izquierda', 'derecha'] as const) {
    for (const tecla of ['izquierda', 'derecha', 'salto'] as const) {
      assert.ok(teclaDelBoton(mando, tecla), `${mando}/${tecla} no tiene tecla física`);
    }
  }
  assert.equal(new Set(TECLAS_FISICAS.map((t) => t.codigo)).size, TECLAS_FISICAS.length);
  assert.equal(new Set(TECLAS_FISICAS.map((t) => `${t.mando}/${t.tecla}`)).size, 6);
});

test('S, la flecha para abajo y cualquier otra tecla no aprietan nada', () => {
  for (const code of ['KeyS', 'ArrowDown', 'Space', 'Enter', 'KeyQ', 'Escape']) {
    assert.equal(botonDelEvento({ code }), null, code);
  }
});

test('con Ctrl, Alt o la tecla de sistema no se le roba el atajo al navegador', () => {
  assert.equal(botonDelEvento({ code: 'KeyD', ctrlKey: true }), null, 'Ctrl+D es favoritos');
  assert.equal(botonDelEvento({ code: 'ArrowLeft', altKey: true }), null, 'Alt+← es volver');
  assert.equal(botonDelEvento({ code: 'KeyW', metaKey: true }), null, 'Cmd+W cierra la pestaña');
  assert.ok(botonDelEvento({ code: 'KeyD', shiftKey: true } as never), 'Shift no es un atajo del navegador');
});

test('la isla escucha el teclado de la página con este mapa, y suelta todo si la ventana pierde el foco', () => {
  // Sin esto, la tabla podría estar bien y nadie leerla. Y una tecla que se suelta con la
  // ventana sin foco no llega: sin el `blur`, el personaje sigue caminando solo.
  const isla = readFileSync('src/scripts/partida-skayboy.ts', 'utf-8');
  assert.match(isla, /botonDelEvento\(/);
  assert.match(isla, /addEventListener\('blur', soltarTodas\)/);
});

test('la página declara cada atajo en su botón (aria-keyshortcuts)', () => {
  const pagina = readFileSync('src/pages/juegos/skayboy-y-poligirl.astro', 'utf-8');
  assert.match(pagina, /aria-keyshortcuts=/);
});
