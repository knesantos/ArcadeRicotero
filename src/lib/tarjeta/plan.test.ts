import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  planificar,
  bandaDelSetlist,
  cuerpoQueEntra,
  partirEnLineas,
  LIENZO,
  MARGEN,
  ANCHO_UTIL,
  MAX_FILAS,
  LINEAS_MAX,
  CUERPOS,
  INTERLINEA,
  nombreArchivo,
} from './plan.ts';

/**
 * La tarjeta compartible que comparten `US-02` y `US-07`.
 *
 * Todo lo que se testea acá es lo que un canvas **no** puede decirte: que nada se caiga
 * del lienzo, que dos bloques no se pisen y que el titulo mas largo del cancionero entre.
 * Un desborde en una imagen generada no tira ningun error — sale la tarjeta con el ultimo
 * renglon cortado y se comparte igual.
 */

test('ningun bloque se cae de la tarjeta, con cualquier cantidad de temas', () => {
  for (let n = 1; n <= MAX_FILAS; n++) {
    for (const b of planificar(n)) {
      assert.ok(b.y >= MARGEN, `${n} filas: "${b.clave}" arranca arriba del margen (y=${b.y})`);
      assert.ok(
        b.y + b.alto <= LIENZO.alto - MARGEN,
        `${n} filas: "${b.clave}" se cae por abajo (termina en ${b.y + b.alto})`,
      );
    }
  }
});

test('ningun bloque se pisa con el siguiente', () => {
  for (let n = 1; n <= MAX_FILAS; n++) {
    const bloques = planificar(n);
    for (let i = 1; i < bloques.length; i++) {
      const previo = bloques[i - 1]!;
      const actual = bloques[i]!;
      assert.ok(
        actual.y >= previo.y + previo.alto,
        `${n} filas: "${actual.clave}" (y=${actual.y}) se monta sobre "${previo.clave}" ` +
          `(termina en ${previo.y + previo.alto})`,
      );
    }
  }
});

test('la vuelta de cuatro temas dibuja sus cuatro filas', () => {
  const claves = planificar(4).map((b) => b.clave);
  assert.deepEqual(
    claves.filter((c) => c.startsWith('fila-')),
    ['fila-0', 'fila-1', 'fila-2', 'fila-3'],
  );
});

test('el setlist llena la banda exacta, sin un pixel bailando', () => {
  // El reparto usa division entera: si la ultima fila no se come el resto, queda un hueco
  // de uno o dos pixeles antes del pie y la ultima raya del setlist no alinea.
  const banda = bandaDelSetlist();
  for (let n = 1; n <= MAX_FILAS; n++) {
    const filas = planificar(n).filter((b) => b.clave.startsWith('fila-'));
    const suma = filas.reduce((a, f) => a + f.alto, 0);
    assert.equal(suma, banda.alto, `${n} filas no llenan la banda`);
    assert.equal(filas[0]!.y, banda.y, `${n} filas: el setlist no arranca donde dice la banda`);
  }
});

test('el nombre del archivo lleva el juego adentro', () => {
  // Desde que la tarjeta es compartida, dos vueltas de dos juegos distintos caerian en la
  // misma carpeta de descargas con el mismo nombre.
  assert.equal(nombreArchivo('adivina-el-tema'), 'fichin-ricotero-adivina-el-tema.png');
  assert.notEqual(nombreArchivo('sacalo-por-la-letra'), nombreArchivo('adivina-el-tema'));
});

test('el pie queda anclado abajo y no colgando del ultimo tema', () => {
  // Es lo que hace que una vuelta de tres y una de cuatro se vean como la misma pieza.
  const sitio = (n: number) => planificar(n).find((b) => b.clave === 'sitio')!;
  assert.equal(sitio(2).y, sitio(4).y);
  assert.equal(sitio(4).y + sitio(4).alto, LIENZO.alto - MARGEN);
});

test('cada fila entra comoda: dos renglones de titulo mas el pie', () => {
  // La banda se reparte, asi que la unica forma de que una fila quede corta es que la
  // vuelta traiga muchos temas. Se verifica el peor caso permitido.
  const alto = planificar(MAX_FILAS).find((b) => b.clave === 'fila-0')!.alto;
  const necesario =
    LINEAS_MAX * CUERPOS.tituloFila.piso * INTERLINEA + CUERPOS.pieFila.piso * INTERLINEA;
  assert.ok(alto >= necesario, `con ${MAX_FILAS} temas la fila mide ${alto} y necesita ${necesario}`);
});

test('una cantidad de temas que la tarjeta no sabe dibujar se rechaza, no se dibuja mal', () => {
  // Mismo criterio que `armarLink`: lo imposible tira, no sale a pantalla a medias.
  for (const malo of [0, -1, 1.5, MAX_FILAS + 1, NaN]) {
    assert.throws(() => planificar(malo), RangeError, `planificar(${malo}) no tiro`);
  }
});

test('un texto que ya entra no se encoge', () => {
  assert.equal(cuerpoQueEntra(400, ANCHO_UTIL, 42, 24), 42);
  assert.equal(cuerpoQueEntra(ANCHO_UTIL, ANCHO_UTIL, 42, 24), 42);
});

test('un texto que no entra se encoge lo justo para entrar', () => {
  assert.equal(cuerpoQueEntra(ANCHO_UTIL * 2, ANCHO_UTIL, 42, 20), 21);
});

test('encoger tiene piso: abajo de eso conviene partirlo en dos', () => {
  assert.equal(cuerpoQueEntra(ANCHO_UTIL * 10, ANCHO_UTIL, 42, 26), 26);
});

test('un ancho medido en cero no rompe la cuenta', () => {
  // Un canvas sin la fuente cargada puede medir raro. Que devuelva el cuerpo base es lo
  // correcto: no hay evidencia de que no entre.
  assert.equal(cuerpoQueEntra(0, ANCHO_UTIL, 42, 24), 42);
});

/** Una regla de mentira: cada caracter mide `porCaracter`. Alcanza para probar el corte. */
const regla = (porCaracter: number) => (s: string) => s.length * porCaracter;

test('un titulo corto no se parte', () => {
  assert.deepEqual(partirEnLineas('Ji Ji Ji', 400, regla(20)), ['Ji Ji Ji']);
});

test('el titulo mas largo del cancionero entra en dos renglones', () => {
  // 61 caracteres, el mas largo de los 105. A cuerpo 42 y ancho tipico de Archivo Black
  // (0,62 em) no entra en uno: 1588 px contra 904 disponibles.
  const titulo = 'Las increíbles andanzas del Capitán Buscapina en Cybersiberia';
  assert.equal(titulo.length, 61);
  const medir = regla(0.62 * CUERPOS.tituloFila.base);
  assert.ok(medir(titulo) > ANCHO_UTIL, 'el caso de prueba dejo de ser el caso dificil');

  const lineas = partirEnLineas(titulo, ANCHO_UTIL, medir);
  assert.equal(lineas.length, 2);
  assert.equal(lineas.join(' '), titulo, 'partir no puede perder ni agregar una palabra');
  for (const l of lineas) {
    assert.ok(medir(l) <= ANCHO_UTIL, `el renglon "${l}" sigue sin entrar`);
  }
});

test('nunca devuelve mas renglones que el maximo', () => {
  // Un titulo imposible junta la cola en el ultimo renglon: el cuerpo lo encoge despues.
  const largo = 'palabra '.repeat(40).trim();
  const lineas = partirEnLineas(largo, 100, regla(10));
  assert.equal(lineas.length, LINEAS_MAX);
  assert.equal(lineas.join(' '), largo);
});

test('partir no pierde ni duplica palabras', () => {
  for (const texto of [
    'Todo un palo',
    'Un poco de amor francés',
    'Ya nadie va a escuchar tu remera',
    'El infierno está encantador esta noche',
  ]) {
    assert.equal(partirEnLineas(texto, 200, regla(12)).join(' '), texto);
  }
});

test('una palabra sola mas ancha que el renglon sale igual, no se pierde', () => {
  // Ningun titulo de los 105 es asi, pero perder el dato seria peor que apretarlo.
  assert.deepEqual(partirEnLineas('Cybersiberia', 10, regla(30)), ['Cybersiberia']);
});
