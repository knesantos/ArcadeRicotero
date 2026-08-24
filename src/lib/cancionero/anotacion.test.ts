import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { esAnotacion, motivoAnotacion, sirveComoVerso } from './anotacion.ts';

test('la tablatura dibujada no es letra', () => {
  for (const x of [
    '--!---------2--!-------3--!------2--!------',
    'e|---3---5---7---|',
    '________X3________',
    '*********',
    '   ---   ',
  ]) {
    assert.ok(esAnotacion(x), `deberia ser anotacion: ${JSON.stringify(x)}`);
  }
});

test('las marcas de repeticion no son letra', () => {
  for (const x of ['(X4)', 'x2', '  X3  ', '(bis)', 'Repetir hasta el final']) {
    assert.ok(esAnotacion(x), `deberia ser anotacion: ${JSON.stringify(x)}`);
  }
});

test('los encabezados de tramo no son letra', () => {
  for (const x of ['GUITARRA:', 'Intro', 'ESTRIBILLO FINAL:', 'VERSO 2', 'BAJO:', 'Solo']) {
    assert.ok(esAnotacion(x), `deberia ser anotacion: ${JSON.stringify(x)}`);
  }
});

test('la jerga de guitarra con puntuacion de anotacion no es letra', () => {
  for (const x of ['VERSO 1: (Riff 2) X7', 'PUENTE (Riff 2)X1', 'y sigue asi...   RIFF 2']) {
    assert.ok(esAnotacion(x), `deberia ser anotacion: ${JSON.stringify(x)}`);
  }
});

test('ante la duda es letra: un verso no se borra por parecer raro', () => {
  // El criterio del modulo: perder un verso real es peor que dejar pasar una anotacion,
  // porque la anotacion se ve en pantalla y el verso perdido no se ve nunca.
  const versos = [
    'Final de la noche y nadie se quiere ir',
    'Le pidio un acorde prestado al viento',
    'Toca la guitarra como si fuera la ultima',
    'Un solo dia mas',
    'Base de todo lo que vino despues',
    'Parte de mi se queda',
  ];
  for (const v of versos) {
    assert.equal(motivoAnotacion(v), null, `NO deberia ser anotacion: ${JSON.stringify(v)}`);
  }
});

test('el renglon en blanco separa estrofas y se queda', () => {
  assert.equal(motivoAnotacion(''), null);
  assert.equal(motivoAnotacion('   '), null);
});

test('el cancionero del repo no tiene ni una anotacion tipada como letra', () => {
  // Esta es la guarda que importa: la ingesta ya la aplica, asi que si alguien cambia el
  // detector o vuelve a ingerir con una fuente nueva, el defecto reaparece aca.
  interface Tema {
    readonly slug: string;
    readonly secciones: readonly { readonly lineas: readonly { readonly t: string; readonly texto?: string }[] }[];
  }
  const { temas } = JSON.parse(readFileSync('src/data/cancionero.json', 'utf-8')) as {
    temas: readonly Tema[];
  };

  const sucias: string[] = [];
  for (const t of temas) {
    for (const s of t.secciones) {
      for (const l of s.lineas) {
        if (l.t !== 'letra') continue;
        const motivo = motivoAnotacion(l.texto);
        if (motivo) sucias.push(`${t.slug} [${motivo}] ${JSON.stringify(l.texto)}`);
      }
    }
  }
  assert.deepEqual(sucias, [], `hay ${sucias.length} lineas de anotacion tipadas como letra`);
});

test('un verso jugable no lleva < ni >, que es lo que pide CTR-04', () => {
  // Los dos casos reales del cancionero: los dos son taller de guitarra, no letra.
  assert.equal(sirveComoVerso('Solo de Saxo <Igual que en el intro, G5 - A5 (4v>'), false);
  assert.equal(sirveComoVerso('<>= Armonicos                 / = Arrastres'), false);
  assert.equal(sirveComoVerso('Una linea cantada cualquiera'), true);
});
