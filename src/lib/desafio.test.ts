import { test } from 'node:test';
import assert from 'node:assert/strict';
import { armarLink, leerDesafio, LARGO_MAX_NOMBRE, TOTAL_MAX } from './desafio.ts';

const BASE = 'https://ricotaarcade.example/';

/**
 * `ADR-02` v2 le puso un segundo parametro obligatorio a `leerDesafio`. La bateria de XSS
 * y de nombre de abajo **tiene que seguir pasando con las mismas entradas** que antes de
 * la revision: si un ataque deja de estar cubierto, la revision salio mal. Por eso el
 * juego propio va por este atajo en vez de reescribir cada caso.
 */
const leerComoQuiz = (q: string) => leerDesafio(q, 'quiz');

test('ADR-02: arma el link con la forma acordada', () => {
  const url = armarLink(BASE, { forma: 'marcador', juego: 'quiz', puntaje: 7, total: 8, nombre: 'Santi' });
  const q = new URL(url).searchParams;
  assert.equal(q.get('g'), 'quiz');
  assert.equal(q.get('p'), '7');
  assert.equal(q.get('t'), '8');
  assert.equal(q.get('n'), 'Santi');
});

test('sin nombre no se agrega el parametro vacio', () => {
  assert.ok(!armarLink(BASE, { forma: 'marcador', juego: 'quiz', puntaje: 3, total: 8 }).includes('n='));
});

test('ida y vuelta: lo que se arma se lee igual', () => {
  const original = { forma: 'marcador', juego: 'quiz', puntaje: 5, total: 8, nombre: 'Pepa' } as const;
  assert.deepEqual(leerComoQuiz(new URL(armarLink(BASE, original)).search), original);
});

test('ida y vuelta: las tres formas sobreviven el viaje', () => {
  const casos = [
    { forma: 'marcador', juego: 'quiz', puntaje: 5, total: 8 },
    { forma: 'recorrido', juego: 'quiz', puntaje: 23, total: 40, desenlace: 'retirada' },
    { forma: 'recorrido', juego: 'quiz', puntaje: 40, total: 40, desenlace: 'victoria' },
    { forma: 'identidad', juego: 'quiz', identidad: 'CU-3' },
  ] as const;
  for (const c of casos) {
    assert.deepEqual(leerComoQuiz(new URL(armarLink(BASE, c)).search), c, `no volvio igual: ${c.forma}`);
  }
});

test('XSS: el nombre nunca vuelve con caracteres de etiqueta', () => {
  const ataques = [
    '<script>alert(1)</script>',
    '"><img src=x onerror=alert(1)>',
    "'><svg onload=alert(1)>",
    '<<>>&&""',
    'javascript:alert(1)',
    '\u001b[31m', // ANSI. El ESC va como escape, no literal: escrito literal no sobrevive a una reescritura del archivo, y el regex de abajo se vuelve otro sin que nadie lo note.
  ];
  for (const a of ataques) {
    const leido = leerComoQuiz(`?g=quiz&p=1&t=8&n=${encodeURIComponent(a)}`);
    const n = leido?.nombre ?? '';
    // El apostrofo NO esta en esta lista, y es a proposito: `ADR-02` pide dejarlo pasar
    // ("letras, numeros, espacios, guiones y apostrofos") porque hay apellidos reales
    // que lo llevan. Es seguro porque la misma regla de `ADR-02` obliga a pintar el
    // nombre con `textContent` y nunca con `innerHTML`: bajo `textContent` un apostrofo
    // es un caracter, no un delimitador. Lo que hace insegura una comilla es el contexto
    // de HTML, y ese contexto no existe aca. Ver `FIND-21`.
    for (const c of ['<', '>', '"', '`', '&', String.fromCharCode(92)]) {
      assert.ok(!n.includes(c), `sobrevivio ${c} en "${n}" con el ataque ${a}`);
    }
    // eslint-disable-next-line no-control-regex
    assert.ok(!/[\u0000-\u001f\u007f]/.test(n), `sobrevivio un caracter de control en "${n}"`);
  }
});

test('el mismo ataque tampoco pasa al armar el link', () => {
  const url = armarLink(BASE, { forma: 'marcador', juego: 'quiz', puntaje: 1, total: 8, nombre: '<script>x</script>' });
  assert.ok(!decodeURIComponent(url).includes('<'), 'el link armado lleva un <');
});

test('el nombre se recorta al maximo de ADR-02', () => {
  const largo = 'a'.repeat(200);
  assert.equal(leerComoQuiz(`?g=quiz&p=1&t=8&n=${largo}`)!.nombre!.length, LARGO_MAX_NOMBRE);
});

test('tabla de query strings validas e invalidas', () => {
  const validas = [
    '?g=quiz&p=0&t=8',
    '?g=quiz&p=8&t=8',
    '?g=quiz&p=3&t=8&n=Ana',
    'g=quiz&p=3&t=8',
    '?g=quiz&p=23&t=40&d=retirada', // forma recorrido
    '?g=quiz&p=40&t=40&d=victoria',
    '?g=quiz&p=3&t=40&d=derrota',
    '?g=quiz&r=CU-3', // forma identidad
  ];
  for (const q of validas) assert.ok(leerComoQuiz(q) !== null, `deberia ser valida: ${q}`);

  const invalidas = [
    '', // entrada normal, sin desafio
    '?g=quiz', // sin puntaje ni total
    '?g=quiz&p=3', // sin total
    '?g=quiz&p=9&t=8', // puntaje mayor que el total
    '?g=quiz&p=-1&t=8', // negativo
    '?g=quiz&p=1.5&t=8', // no entero
    '?g=quiz&p=abc&t=8', // no numerico
    '?g=quiz&p=1&t=0', // total cero
    '?g=quiz&p=1&t=99999', // total absurdo
    '?g=<script>&p=1&t=8', // juego con etiqueta
    '?g=QUIZ&p=1&t=8', // juego fuera del patron
    '?p=1&t=8', // sin juego
  ];
  for (const q of invalidas) assert.equal(leerComoQuiz(q), null, `deberia ser invalida: ${q}`);
});

test('FIND-28: un desafio de otro juego devuelve null, no se pinta como propio', () => {
  // El defecto, reproducido en el navegador el 2026-08-25 con el sitio ya desplegado:
  // `/quiz/?g=tapa&p=10&t=10&n=Fulano` pintaba "Fulano saco 10/10" en el quiz.
  assert.equal(leerDesafio('?g=tapa&p=1&t=10', 'quiz'), null);
  assert.equal(leerDesafio('?g=tapa&p=10&t=10&n=Fulano', 'quiz'), null);
  assert.equal(leerDesafio('?g=dos-ejes&r=CU-3', 'quiz'), null);
  // Y el mismo link, leido por su propio juego, sigue siendo valido.
  assert.ok(leerDesafio('?g=tapa&p=1&t=10', 'tapa') !== null);
});

test('ADR-02 v2: un link de la v1 se lee como marcador y no rompe', () => {
  // Hay links circulando desde antes del ciclo 9: el sitio ya estaba desplegado.
  const leido = leerComoQuiz('?g=quiz&p=6&t=8&n=Santi');
  assert.ok(leido, 'un link viejo no puede devolver null');
  assert.equal(leido.forma, 'marcador');
  assert.equal(leido.nombre, 'Santi');
});

test('las combinaciones imposibles devuelven null en vez de interpretarse a medias', () => {
  assert.equal(leerComoQuiz('?g=quiz&r=CU-3&p=1&t=8'), null, 'r junto con p/t');
  assert.equal(leerComoQuiz('?g=quiz&r=CU-3&d=victoria'), null, 'r junto con d');
  assert.equal(leerComoQuiz('?g=quiz&d=victoria'), null, 'd sin p/t');
  assert.equal(leerComoQuiz('?g=quiz&p=1&t=8&d=gano'), null, 'desenlace fuera del enum');
  assert.equal(leerComoQuiz('?g=quiz&p=1&t=8&d=VICTORIA'), null, 'el enum es sensible a mayusculas');
  assert.equal(leerComoQuiz('?g=quiz&r=<script>'), null, 'identidad con etiqueta');
  assert.equal(leerComoQuiz('?g=quiz&r=' + 'a'.repeat(13)), null, 'identidad demasiado larga');
});

test('el tope de t sube a 9999, y 10000 sigue afuera', () => {
  // Sube por la escalera de US-02, que puntua sobre 400: con el tope viejo de 100 el
  // juego mandaba aciertos y el tuit decia otro numero que el propio link.
  assert.equal(TOTAL_MAX, 9999);
  assert.ok(leerComoQuiz(`?g=quiz&p=400&t=${TOTAL_MAX}`) !== null);
  assert.equal(leerComoQuiz('?g=quiz&p=1&t=10000'), null);
});

test('un link roto devuelve null y no rompe: nadie queda afuera por eso', () => {
  for (const q of ['?%', '?g=%E0%A4%A', '?'.repeat(50)]) {
    assert.doesNotThrow(() => leerComoQuiz(q), `tiro excepcion con ${q}`);
  }
});

test('armarLink rechaza puntajes imposibles en vez de generarlos', () => {
  assert.throws(() => armarLink(BASE, { forma: 'marcador', juego: 'quiz', puntaje: 9, total: 8 }), RangeError);
  assert.throws(() => armarLink(BASE, { forma: 'marcador', juego: 'quiz', puntaje: -1, total: 8 }), RangeError);
  assert.throws(() => armarLink(BASE, { forma: 'marcador', juego: 'quiz', puntaje: 1, total: 0 }), RangeError);
  assert.throws(() => armarLink(BASE, { forma: 'marcador', juego: 'quiz', puntaje: 1, total: 10000 }), RangeError);
  assert.throws(
    () => armarLink(BASE, { forma: 'recorrido', juego: 'quiz', puntaje: 1, total: 8, desenlace: 'gano' as never }),
    RangeError,
  );
  assert.throws(() => armarLink(BASE, { forma: 'identidad', juego: 'quiz', identidad: '<script>' }), RangeError);
});

test('FIND-21: el apostrofo y los acentos pasan, como pide ADR-02', () => {
  const casos: Array<[string, string]> = [
    ["O'Connor", "O'Connor"],
    ["D'Angelo", "D'Angelo"],
    ['Ines Nunez', 'Ines Nunez'],
    ['Maria Jose', 'Maria Jose'],
    ['Juan-Pablo', 'Juan-Pablo'],
  ];
  for (const [entra, sale] of casos) {
    const leido = leerComoQuiz(`?g=quiz&p=1&t=8&n=${encodeURIComponent(entra)}`);
    assert.equal(leido?.nombre, sale, `"${entra}" salio como "${leido?.nombre}"`);
  }
});

test('la lista blanca sigue dejando afuera todo lo que arma una etiqueta', () => {
  for (const c of ['<', '>', '"', '`', '&', String.fromCharCode(92), '/', '=', '(', ')', '{', '}', ';']) {
    const leido = leerComoQuiz(`?g=quiz&p=1&t=8&n=${encodeURIComponent('Ana' + c + 'x')}`);
    assert.equal(leido?.nombre, 'Anax', `sobrevivio ${c}`);
  }
});

test('el desafio de "sacalo por la letra" ida y vuelta', () => {
  // `US-07` empezo a mandar desafios en el ciclo estetico: hasta entonces compartia la
  // portada pelada. Los dos numeros de este juego —500 de maximo, y el nombre con guion—
  // tienen que pasar los validadores, y el nombre ademas cumple /^[a-z-]{1,20}$/.
  const url = armarLink('https://arcade.example/juegos/adivinar-por-la-letra/', {
    forma: 'marcador',
    juego: 'por-la-letra',
    puntaje: 320,
    total: 500,
  });
  const leido = leerDesafio(new URL(url).search, 'por-la-letra');
  assert.deepEqual(leido, { forma: 'marcador', juego: 'por-la-letra', puntaje: 320, total: 500 });
});

test('un desafio de otro juego no entra a "sacalo por la letra"', () => {
  // `FIND-28`: sin el segundo argumento, `?g=tapa&p=10&t=10` pintaba un puntaje ajeno.
  assert.equal(leerDesafio('?g=tapa&p=10&t=10', 'por-la-letra'), null);
  assert.equal(leerDesafio('?g=por-la-letra&p=10&t=10', 'tapa'), null);
});
