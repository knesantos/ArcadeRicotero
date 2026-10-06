/**
 * Verificación del pedido de sesión de sonido (`D-66`): que la llave de silencio del iPhone no
 * apague "Adiviná el tema".
 *
 * Lo que se prueba no es que suene —eso solo lo dice un iPhone con la llave puesta—: es que el
 * pedido salga, que salga **antes** de despertar el motor, que no rompa a los navegadores que
 * no tienen con qué pedirlo, y que el aviso de la llave se calle solo cuando es verdad que la
 * llave dejó de mandar.
 *
 * El navegador se le pasa a cada función: en Node `navigator` existe y no se puede pisar.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { sonarAunqueEsteEnSilencio, laLlaveManda } from './sesion.ts';

/** Un navegador con la Audio Session API, como Safari desde que la trae. */
function conSesion(tipo = 'auto') {
  return { audioSession: { type: tipo } };
}

test('con la API, pide la sesión de la música y la deja puesta', () => {
  const nav = conSesion();
  assert.equal(sonarAunqueEsteEnSilencio(nav), true);
  assert.equal(nav.audioSession.type, 'playback', 'la sesión de la música es la que no respeta la llave');
});

test('pedirla dos veces no cambia nada: el segundo toque de "Empezá" no rompe', () => {
  const nav = conSesion();
  sonarAunqueEsteEnSilencio(nav);
  assert.equal(sonarAunqueEsteEnSilencio(nav), true);
  assert.equal(nav.audioSession.type, 'playback');
});

test('sin la API (Chrome en Android, Firefox, un iPhone viejo) no hace nada y no rompe', () => {
  assert.equal(sonarAunqueEsteEnSilencio({}), false);
  assert.equal(sonarAunqueEsteEnSilencio(null), false);
  assert.equal(sonarAunqueEsteEnSilencio({ audioSession: undefined }), false);
  assert.equal(sonarAunqueEsteEnSilencio({ audioSession: 'raro' }), false);
});

test('un navegador que rechaza el valor queda como estaba y lo dice', () => {
  const rechaza = {
    audioSession: {
      get type() {
        return 'auto';
      },
      set type(_v: string) {
        throw new TypeError('no');
      },
    },
  };
  assert.equal(sonarAunqueEsteEnSilencio(rechaza), false);

  // Y el que lo traga sin quejarse pero no lo guarda, también: lo que manda es lo que quedó.
  const ignora = {
    audioSession: {
      get type() {
        return 'auto';
      },
      set type(_v: string) {},
    },
  };
  assert.equal(sonarAunqueEsteEnSilencio(ignora), false);
});

test('el aviso de la llave se calla solo donde hay con qué saltarla', () => {
  assert.equal(laLlaveManda(conSesion()), false, 'con la API, el aviso diría algo que ya no es cierto');
  assert.equal(laLlaveManda({}), true, 'sin la API, la llave sigue mandando y el aviso es la verdad');
  assert.equal(laLlaveManda(null), true);
});

test('mirar si la llave manda no pide nada: el aviso se pinta al cargar, fuera de un gesto', () => {
  const nav = conSesion();
  laLlaveManda(nav);
  assert.equal(nav.audioSession.type, 'auto', 'pedir la sesión al cargar cortaría la música de la persona sin que toque nada');
});

// ---------------------------------------------------------------------------------------
// Lo que se audita leyendo los archivos, porque no se puede probar corriéndolo
// ---------------------------------------------------------------------------------------

/** Solo el código: los comentarios nombran lo prohibido a propósito, para que se sepa. */
function codigo(ruta: URL): string {
  return readFileSync(ruta, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

test('🔴 "Adiviná el tema" pide la sesión en el toque de "Empezá", antes de despertar el motor', () => {
  const isla = codigo(new URL('../../scripts/partida-tema.ts', import.meta.url));
  const inicio = isla.indexOf("$('jugar').addEventListener('click'");
  assert.ok(inicio >= 0, 'no encontré el toque de "Empezá" en partida-tema.ts');
  const manejador = isla.slice(inicio, isla.indexOf('});', inicio));
  const pedido = manejador.indexOf('sonarAunqueEsteEnSilencio(');
  const despertar = manejador.indexOf('reproductor.despertar(');
  assert.ok(pedido >= 0, 'el toque de "Empezá" no pide la sesión: con la llave puesta el juego no suena');
  assert.ok(despertar >= 0, 'el toque de "Empezá" dejó de despertar el motor');
  assert.ok(pedido < despertar, 'la sesión se pide antes de despertar: después, el primer fragmento sale por la vieja');
});

test('🔴 Skayboy no la pide: sus efectos se mezclan con la música de la persona y respetan la llave', () => {
  const carpeta = new URL('../skayboy/', import.meta.url);
  const archivos = readdirSync(carpeta)
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
    .map((f) => new URL(f, carpeta));
  archivos.push(new URL('../../scripts/partida-skayboy.ts', import.meta.url));
  for (const ruta of archivos) {
    const fuente = codigo(ruta);
    assert.ok(!fuente.includes('audio/sesion'), `${ruta.pathname} importa la sesión de la música`);
    assert.ok(!fuente.includes('audioSession'), `${ruta.pathname} toca la sesión de sonido`);
  }
});

test('🔴 sesion.ts no importa nada (`D-29`): una hoja no arrastra nada al navegador', () => {
  const fuente = codigo(new URL('./sesion.ts', import.meta.url));
  assert.ok(!/^\s*import\s/m.test(fuente), 'sesion.ts tiene que seguir siendo una hoja');
});
