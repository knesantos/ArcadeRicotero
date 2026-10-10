import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  armarLink,
  leerDesafio,
  LARGO_MAX_NOMBRE,
  TOTAL_MAX,
  // `ADR-06`: la cuarta forma, la que viaja en el fragmento (`US-08`).
  leerReparto,
  empaquetarReparto,
  desempaquetarReparto,
  MAX_CASILLA,
  // `D-69`: las filas propias, que viajan en la versión 2.
  limpiarNombreFila,
  MAX_FILAS_REPARTO,
  MIN_FILAS_REPARTO,
  LARGO_MAX_NOMBRE_FILA,
} from './desafio.ts';

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

/* ==================================================================
   `ADR-06` — la cuarta forma: `reparto`, en el fragmento (`US-08`)

   Lo que estos casos protegen no es el empaquetado en sí: es que **una lista compartida se
   lea igual que como se armó**. Un bit corrido no rompe nada visible — devuelve una lista
   válida, distinta, y nadie se entera. Por eso casi todo es ida y vuelta con valores que
   ocupan los tres bits, y por eso los rechazos son tan puntillosos con el largo.
   ================================================================== */

/** El catálogo de mentira que `leerReparto` pide como tercer parámetro. */
const CUANTAS: Record<string, number> = { discos: 10, tapas: 10, t6: 13, 'az-a1b2c3': 12 };
const fichasDe = (id: string): number | null => CUANTAS[id] ?? null;

/** Un reparto de prueba del largo que se pida, con las cuatro filas usadas. */
const repartoDe = (n: number): number[] => Array.from({ length: n }, (_, i) => i % 5);

test('ADR-06: ida y vuelta con los cinco valores que el juego usa', () => {
  // Trece fichas: el conjunto más largo (los temas de Lobo suelto), y un número que NO es
  // múltiplo de ocho bits, que es donde se rompen los empaquetados escritos a ojo.
  const casillas = [0, 1, 2, 3, 4, 4, 3, 2, 1, 0, 1, 4, 2];
  const carga = empaquetarReparto(casillas);
  assert.deepEqual(desempaquetarReparto(carga, casillas.length), casillas);
});

test('ADR-06: los tres bits enteros van y vuelven, aunque el juego hoy escriba cinco', () => {
  // El transporte aguanta 5, 6 y 7 aunque `armarLink` no los escriba: si no los aguantara,
  // sumar una quinta fila algún día rompería el formato en vez de solo la versión.
  const valores = [7, 6, 5, 4, 3, 2, 1, 0];
  assert.deepEqual(desempaquetarReparto(empaquetarReparto(valores), 8), valores);
});

test('ADR-06: los tamaños son los que el formato promete', () => {
  // Las tres cuentas que hacen que esto entre en cualquier lado. Si alguna sube, el
  // formato cambió y hay que subir `VERSION_REPARTO`.
  const de = (n: number) => empaquetarReparto(new Array<number>(n).fill(MAX_CASILLA)).length;
  assert.equal(de(10), 6, 'los diez discos tienen que dar 6 caracteres');
  assert.equal(de(13), 7, 'el disco más largo tiene que dar 7 caracteres');
  assert.equal(de(105), 54, 'los 105 temas tienen que dar 54 caracteres');
});

test('ADR-06: un reparto vacío no se confunde con uno lleno', () => {
  // `SIN_UBICAR` vale 0 justamente para esto: la carga de un tablero recién abierto son
  // todos ceros, y tiene que volver como todos ceros.
  const vacio = new Array<number>(10).fill(0);
  assert.deepEqual(desempaquetarReparto(empaquetarReparto(vacio), 10), vacio);
});

test('ADR-06: una carga de otro conjunto se rechaza, no se completa con ceros', () => {
  // El caso que de verdad importa: completar sería inventarle al que compartió una lista
  // que no armó.
  const carga = empaquetarReparto(repartoDe(10));
  assert.equal(desempaquetarReparto(carga, 13), null, 'aceptó una carga corta');
  assert.equal(desempaquetarReparto(carga, 8), null, 'aceptó una carga larga');
  assert.equal(desempaquetarReparto(carga, 10)?.length, 10);
});

test('ADR-06: una carga con un carácter que no es del alfabeto no abre', () => {
  assert.equal(desempaquetarReparto('*' + empaquetarReparto(repartoDe(10)).slice(1), 10), null);
});

test('ADR-06: no se genera un link inválido', () => {
  // Mismo criterio que las otras tres formas: se rompe el test, no la pantalla de la gente.
  const link = (conjunto: string, casillas: number[]) =>
    armarLink(BASE, { forma: 'reparto', juego: 'ponelos', conjunto, casillas });
  assert.throws(() => link('discos', []), RangeError);
  assert.throws(() => link('discos', [5]), RangeError, 'escribió una casilla reservada');
  assert.throws(() => link('discos', [-1]), RangeError);
  assert.throws(() => link('discos', [1.5]), RangeError);
  assert.throws(() => link('Discos Con Mayúsculas', [1]), RangeError);
  assert.throws(() => link('discos', new Array<number>(121).fill(1)), RangeError);
});

test('ADR-06: el reparto viaja en el fragmento, y el juego se queda en la query', () => {
  // La razón entera de esta forma, y la que la protege de `FIND-28`. Si algún día alguien
  // mueve el reparto a la query, o saca la `g`, esto falla.
  const url = new URL(
    armarLink(BASE, { forma: 'reparto', juego: 'ponelos', conjunto: 'discos', casillas: repartoDe(10) }),
  );
  assert.equal(url.searchParams.get('g'), 'ponelos');
  assert.equal(url.searchParams.get('o'), null, 'el reparto se filtró a la query');
  assert.match(url.hash, /^#o=1\.discos\./);
  assert.equal(url.searchParams.get('n'), null, 'la forma reparto no lleva nombre');
});

test('ADR-06: ida y vuelta por la dirección entera', () => {
  const casillas = repartoDe(10);
  const url = armarLink(BASE, { forma: 'reparto', juego: 'ponelos', conjunto: 'tapas', casillas });
  assert.deepEqual(leerReparto(url, 'ponelos', fichasDe), {
    forma: 'reparto',
    juego: 'ponelos',
    conjunto: 'tapas',
    casillas,
  });
});

test('ADR-06: FIND-28 tampoco pasa por el fragmento', () => {
  // El reparto de otro juego no se pinta como propio, igual que en la query.
  const url = armarLink(BASE, { forma: 'reparto', juego: 'ponelos', conjunto: 'discos', casillas: repartoDe(10) });
  assert.equal(leerReparto(url, 'quiz', fichasDe), null);
});

test('ADR-06: los siete pasos de la validación, uno por uno', () => {
  // `null` significa "entraste normal", no "hubo un error" (`D-14`): el juego abre con el
  // tablero vacío en los siete casos.
  const casos: Array<[string, string]> = [
    ['no soy una dirección', 'la dirección no parsea'],
    [`${BASE}#o=1.discos.iSZiCg`, 'sin g en la query'],
    [`${BASE}?g=ponelos`, 'sin fragmento'],
    [`${BASE}?g=ponelos#seccion-cualquiera`, 'un fragmento que no es un reparto'],
    [`${BASE}?g=ponelos#o=1.discos`, 'le falta una parte'],
    [`${BASE}?g=ponelos#o=1.discos.iSZiCg.iSZiCg`, 'le sobra una parte'],
    [`${BASE}?g=ponelos#o=2.discos.iSZiCg`, 'otra versión del empaquetado'],
    [`${BASE}?g=ponelos#o=1.DISCOS.iSZiCg`, 'el conjunto tiene alfabeto cerrado'],
    [`${BASE}?g=ponelos#o=1.-discos.iSZiCg`, 'el conjunto no puede arrancar con guion'],
    [`${BASE}?g=ponelos#o=1.inventado.iSZiCg`, 'un conjunto que no existe'],
    [`${BASE}?g=ponelos#o=1.discos.no+es+base64url`, 'la carga no es del alfabeto'],
    [`${BASE}?g=ponelos#o=1.t6.iSZiCg`, 'la carga es de un conjunto de otro largo'],
  ];
  for (const [direccion, por] of casos) {
    assert.equal(leerReparto(direccion, 'ponelos', fichasDe), null, `abrió ${por}`);
  }
});

test('ADR-06: una casilla reservada descarta el reparto entero, no la ficha suelta', () => {
  // Media lista ajena es una lista inventada. Se llega a este caso por un link de una
  // versión futura, o por alguien editando el fragmento a mano.
  const carga = empaquetarReparto([1, 2, 3, 4, 7, 1, 2, 3, 4, 1]);
  assert.equal(leerReparto(`${BASE}?g=ponelos#o=1.discos.${carga}`, 'ponelos', fichasDe), null);
});

test('ADR-06: ningún campo del fragmento es texto', () => {
  // La regla 4 de `ADR-02`, y esta forma es la única de las cuatro que la cumple entera:
  // lo que entra son un slug de alfabeto cerrado y una tira de enteros. Nada que alguien
  // pueda escribir llega a la pantalla.
  const url = armarLink(BASE, { forma: 'reparto', juego: 'ponelos', conjunto: 'discos', casillas: repartoDe(10) });
  const leido = leerReparto(url, 'ponelos', fichasDe)!;
  assert.ok(leido);
  assert.match(leido.conjunto, /^[a-z0-9-]+$/);
  for (const c of leido.casillas) assert.equal(typeof c, 'number');
  assert.equal(Object.keys(leido).includes('nombre'), false);
});

test('ADR-06: el reparto y las tres formas de la query no se mezclan', () => {
  // Son dos canales distintos. Un desafío no puede colarse como reparto ni al revés.
  assert.equal(leerDesafio('?g=ponelos', 'ponelos'), null);
  assert.equal(leerReparto(`${BASE}?g=quiz&p=1&t=8`, 'quiz', fichasDe), null);
});

/* ==================================================================
   `D-69` — las filas propias viajan en el link, en la versión 2
   ================================================================== */

const MIAS = ['La de la previa', 'Ni a palos', '¡Bis!'];

test('D-69: con filas propias el link es de la versión 2 y las nombra en orden', () => {
  const casillas = [1, 2, 3, 0, 1, 2, 3, 0, 1, 2];
  const url = armarLink(BASE, { forma: 'reparto', juego: 'ponelos', conjunto: 'discos', casillas, filas: MIAS });
  const fragmento = new URLSearchParams(new URL(url).hash.slice(1));
  assert.match(fragmento.get('o') ?? '', /^2\.discos\./);
  assert.deepEqual(fragmento.getAll('f'), MIAS);
  // Y el juego se sigue quedando en la query, igual que en la versión 1.
  assert.equal(new URL(url).searchParams.get('g'), 'ponelos');
});

test('D-69: ida y vuelta con filas propias, nombres y casillas idénticos', () => {
  const casillas = [1, 2, 3, 0, 1, 2, 3, 0, 1, 2];
  const url = armarLink(BASE, { forma: 'reparto', juego: 'ponelos', conjunto: 'tapas', casillas, filas: MIAS });
  assert.deepEqual(leerReparto(url, 'ponelos', fichasDe), {
    forma: 'reparto',
    juego: 'ponelos',
    conjunto: 'tapas',
    casillas,
    filas: MIAS,
  });
});

test('D-69: sin filas propias el link sigue siendo el de siempre', () => {
  // Los links viejos y los nuevos sin filas propias son el mismo link: nadie tiene que
  // volver a compartir nada.
  const url = armarLink(BASE, { forma: 'reparto', juego: 'ponelos', conjunto: 'discos', casillas: repartoDe(10) });
  assert.match(new URL(url).hash, /^#o=1\.discos\.[A-Za-z0-9_-]+$/);
  assert.equal(Object.keys(leerReparto(url, 'ponelos', fichasDe)!).includes('filas'), false);
});

test('D-69: con siete filas entra la séptima, y la versión 1 sigue sin aceptar la quinta', () => {
  const siete = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const casillas = [7, 6, 5, 4, 3, 2, 1, 0, 7, 6];
  const url = armarLink(BASE, { forma: 'reparto', juego: 'ponelos', conjunto: 'discos', casillas, filas: siete });
  assert.deepEqual(leerReparto(url, 'ponelos', fichasDe)?.casillas, casillas);
  assert.throws(() => armarLink(BASE, { forma: 'reparto', juego: 'ponelos', conjunto: 'discos', casillas }), RangeError);
});

test('D-69: no se genera un link con filas imposibles', () => {
  const link = (filas: string[], casillas = repartoDe(10).map((c) => Math.min(c, filas.length))) =>
    armarLink(BASE, { forma: 'reparto', juego: 'ponelos', conjunto: 'discos', casillas, filas });
  assert.throws(() => link(['Sola']), RangeError, 'una fila sola no reparte nada');
  assert.throws(() => link(['1', '2', '3', '4', '5', '6', '7', '8']), RangeError, 'ocho filas no entran en tres bits');
  assert.throws(() => link(['Bien', '']), RangeError, 'un nombre vacío');
  assert.throws(() => link(['Bien', '<b>mal</b>']), RangeError, 'un nombre sin limpiar se rechaza, no se limpia callado');
  assert.throws(() => link(['A', 'B'], [3, 0, 0, 0, 0, 0, 0, 0, 0, 0]), RangeError, 'una casilla más allá de la última fila');
});

test('D-69: la lista blanca deja hablar a una fila y no deja armar una etiqueta', () => {
  assert.equal(limpiarNombreFila('  ¡La   de la previa!  '), '¡La de la previa!');
  assert.equal(limpiarNombreFila("D'Angelo, 11 y 12. ¿Sí?"), "D'Angelo, 11 y 12. ¿Sí?");
  assert.equal(limpiarNombreFila('<img src=x onerror=alert(1)>'), 'img srcx onerroralert1');
  assert.equal(limpiarNombreFila('"comillas" & <b>'), 'comillas b');
  assert.equal(limpiarNombreFila('a'.repeat(40)).length, LARGO_MAX_NOMBRE_FILA);
  // Una letra de fuera del plano básico en el borde no queda cortada al medio, y limpiar dos
  // veces da lo mismo que una: si no, el link rechazaba el nombre y compartir no andaba.
  const astral = 'a'.repeat(23) + '\u{1D400}b';
  assert.equal(limpiarNombreFila(astral), 'a'.repeat(23) + '\u{1D400}');
  assert.equal(limpiarNombreFila(limpiarNombreFila(astral)), limpiarNombreFila(astral));
  // Los de control y los invisibles no son letras: un nombre hecho solo de eso queda vacío.
  assert.equal(limpiarNombreFila('\u0000\u200b\n\t'), '');
});

test('D-69: un fragmento con filas raras no abre, y el juego abre vacío', () => {
  const carga = empaquetarReparto([1, 2, 0, 0, 0, 0, 0, 0, 0, 0]);
  const con = (resto: string) => `${BASE}?g=ponelos#o=2.discos.${carga}${resto}`;
  const casos: Array<[string, string]> = [
    [con(''), 'versión 2 sin ningún nombre'],
    [con('&f=Sola'), 'una fila sola'],
    [con('&f=A&f=B&f=C&f=D&f=E&f=F&f=G&f=H'), 'ocho filas'],
    [con('&f=A&f=%3C%3E'), 'un nombre que la limpieza deja vacío'],
    [`${BASE}?g=ponelos#o=2.discos.${empaquetarReparto([3, 0, 0, 0, 0, 0, 0, 0, 0, 0])}&f=A&f=B`, 'una casilla más allá de la última fila'],
  ];
  for (const [direccion, por] of casos) {
    assert.equal(leerReparto(direccion, 'ponelos', fichasDe), null, `abrió ${por}`);
  }
});

test('D-69: lo que entra por el fragmento sale limpio, aunque lo hayan escrito a mano', () => {
  const carga = empaquetarReparto([1, 2, 0, 0, 0, 0, 0, 0, 0, 0]);
  const leido = leerReparto(
    `${BASE}?g=ponelos#o=2.discos.${carga}&f=%3Cscript%3EPogo&f=${'x'.repeat(60)}`,
    'ponelos',
    fichasDe,
  );
  assert.ok(leido);
  assert.deepEqual(leido!.filas, ['scriptPogo', 'x'.repeat(LARGO_MAX_NOMBRE_FILA)]);
});

test('D-69: el techo de filas es el de los tres bits', () => {
  // Cero es "sin ubicar"; del uno al siete, una fila cada uno.
  assert.equal(MAX_FILAS_REPARTO, 2 ** 3 - 1);
  assert.equal(MIN_FILAS_REPARTO, 2);
});
