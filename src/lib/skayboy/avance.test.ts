/**
 * El avance guardado (`CTR-16.11`), jugado en Node con un `localStorage` de mentira, como hace
 * `cinta.test.ts`. La tabla de `CTR-16.11.3` entera, y cada caso con el rojo que tiene que verse:
 *
 * | Caso | Rojo que se vio a mano |
 * |---|---|
 * | Valor roto | `JSON.parse` sin `try`: el test explota con `SyntaxError` en vez de dar sin avance |
 * | Entradas raras | sin el filtro de `ID_DE_NIVEL` y de repetidos: `["NIV-01","xx",3,"NIV-01"]` |
 * | Campo desconocido | `textoDeAvance()` que escribe solo `pasados`: se pierde `"otra":1` |
 * | Hueco en la fila | retomar después del último ganado: `NIV-04` en vez de `NIV-02` |
 * | Todos pasados | — |
 * | `localStorage` que tira | sin el `try` de `guardarPasado()`: el test tira `modo privado` |
 * | Dos pestañas | escribir la memoria sin leer antes: se pierde el `NIV-02` de la otra pestaña |
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  CLAVE_AVANCE,
  SIN_AVANCE,
  cargarAvance,
  conPasado,
  guardarPasado,
  hastaDonde,
  leerAvance,
  reiniciarAvanceParaPruebas,
  siguienteDeLaFila,
  textoDeAvance,
  unirAvances,
  type Almacen,
} from './avance.ts';
import type { Banco } from './niveles.ts';

const BANCO = JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as Banco;
const FILA = BANCO.niveles;
const ids = FILA.map((n) => n.id);

/** Un `localStorage` de mentira, que puede tirar al leer, al escribir o siempre. */
function almacen(inicial: string | null = null, tira: 'no' | 'leer' | 'escribir' | 'todo' = 'no') {
  const guardado = new Map<string, string>();
  if (inicial !== null) guardado.set(CLAVE_AVANCE, inicial);
  let escrituras = 0;
  const a: Almacen = {
    getItem(clave) {
      if (tira === 'leer' || tira === 'todo') throw new Error('modo privado');
      return guardado.get(clave) ?? null;
    },
    setItem(clave, valor) {
      if (tira === 'escribir' || tira === 'todo') throw new Error('modo privado');
      escrituras++;
      guardado.set(clave, valor);
    },
  };
  return { a, guardado, escrituras: () => escrituras };
}

test('la fila del banco tiene los seis niveles, en orden de id (CTR-16.11.2)', () => {
  assert.deepEqual(ids, ['NIV-01', 'NIV-02', 'NIV-03', 'NIV-04', 'NIV-05', 'NIV-06']);
});

test('la clave es literal: arcade.skayboy.avance (CTR-16.11.1)', () => {
  assert.equal(CLAVE_AVANCE, 'arcade.skayboy.avance');
});

test('🔴 valor roto: ausente, vacío, basura, pasados que no es arreglo, o un arreglo suelto, es sin avance', () => {
  for (const roto of [null, '', 'basura', '{"pasados":"NIV-01"}', '[]', '[["NIV-01"]]', 'null', '3', '{"pasado":["NIV-01"]}']) {
    assert.deepEqual(leerAvance(roto).pasados, [], `«${roto}» no es un avance`);
  }
});

test('🔴 valor roto: la próxima victoria lo pisa entero, y no se queda con los otros campos (CTR-16.11.1)', () => {
  // Un valor roto no es un avance a medias: no se le conserva nada. La verificación de `T-302`
  // encontró que devolver `{ pasados: [], resto }` para un `pasados` roto no hacía caer ningún test.
  for (const roto of ['{"pasados":"NIV-01","otra":1}', '{"pasado":["NIV-01"],"otra":1}', 'basura']) {
    assert.deepEqual(leerAvance(roto), SIN_AVANCE, `«${roto}» cuenta como sin avance, entero`);
    reiniciarAvanceParaPruebas();
    const { a, guardado } = almacen(roto);
    guardarPasado('NIV-03', a);
    assert.equal(guardado.get(CLAVE_AVANCE), '{"pasados":["NIV-03"]}', `sobre «${roto}», lo escrito es solo lo nuevo`);
  }
});

test('🔴 entradas raras: lo que no es un id de nivel se descarta, y el repetido cuenta una vez', () => {
  assert.deepEqual(leerAvance('{"pasados":["NIV-01","xx",3,"NIV-01"]}').pasados, ['NIV-01']);
  assert.deepEqual(leerAvance('{"pasados":["niv-02","NIV-2","NIV-002",null,{},"NIV-03"]}').pasados, ['NIV-03']);
  // El orden es el de la primera vez que aparece.
  assert.deepEqual(leerAvance('{"pasados":["NIV-03","NIV-01","NIV-03"]}').pasados, ['NIV-03', 'NIV-01']);
});

test('🔴 campo desconocido: se conserva al escribir, y se ignora al leer', () => {
  reiniciarAvanceParaPruebas();
  const { a, guardado } = almacen('{"pasados":[],"otra":1}');
  guardarPasado('NIV-01', a);
  assert.deepEqual(JSON.parse(guardado.get(CLAVE_AVANCE)!), { otra: 1, pasados: ['NIV-01'] });
  // Y la forma de CTR-16.11.4, si algún día llega, pasa intacta.
  const futuro = leerAvance('{"pasados":["NIV-01"],"juntados":{"NIV-01":{"skayboy":1,"poligirl":1}}}');
  assert.deepEqual(JSON.parse(textoDeAvance(conPasado(futuro, 'NIV-02'))), {
    juntados: { 'NIV-01': { skayboy: 1, poligirl: 1 } },
    pasados: ['NIV-01', 'NIV-02'],
  });
});

test('🔴 hueco en la fila: se retoma en el hueco, y hasta dónde llegó cuenta sin saltear', () => {
  const avance = leerAvance('{"pasados":["NIV-01","NIV-03"]}');
  assert.equal(siguienteDeLaFila(FILA, avance)?.id, 'NIV-02');
  assert.equal(hastaDonde(FILA, avance), 1);
  // Ganados en otro orden cuentan igual: lo que manda es la fila, no el orden en que se pasaron.
  const desordenado = leerAvance('{"pasados":["NIV-02","NIV-01"]}');
  assert.equal(siguienteDeLaFila(FILA, desordenado)?.id, 'NIV-03');
  assert.equal(hastaDonde(FILA, desordenado), 2);
});

test('sin avance: se juega el primero de la fila, y llegó hasta el cero', () => {
  assert.equal(siguienteDeLaFila(FILA, SIN_AVANCE)?.id, 'NIV-01');
  assert.equal(hastaDonde(FILA, SIN_AVANCE), 0);
  assert.equal(siguienteDeLaFila([], SIN_AVANCE), null, 'sin fila no hay a dónde');
});

test('todos pasados: no queda ninguno, y llegó hasta el seis', () => {
  const todos = leerAvance(JSON.stringify({ pasados: ids }));
  assert.equal(siguienteDeLaFila(FILA, todos), null);
  assert.equal(hastaDonde(FILA, todos), 6);
});

test('los ids que la fila de hoy no tiene no cuentan al leer, y se conservan al escribir', () => {
  const avance = leerAvance('{"pasados":["NIV-09","NIV-01"]}');
  assert.equal(hastaDonde(FILA, avance), 1);
  assert.equal(siguienteDeLaFila(FILA, avance)?.id, 'NIV-02');
  reiniciarAvanceParaPruebas();
  const { a, guardado } = almacen('{"pasados":["NIV-09","NIV-01"]}');
  guardarPasado('NIV-02', a);
  assert.deepEqual(JSON.parse(guardado.get(CLAVE_AVANCE)!).pasados, ['NIV-09', 'NIV-01', 'NIV-02']);
  // En una fila de producción que solo sirve algunos, cuenta sobre esa fila.
  const listos = FILA.filter((n) => n.id !== 'NIV-02');
  assert.equal(siguienteDeLaFila(listos, leerAvance('{"pasados":["NIV-01"]}'))?.id, 'NIV-03');
});

test('ganar el mismo nivel dos veces no lo repite', () => {
  const una = conPasado(SIN_AVANCE, 'NIV-01');
  assert.equal(conPasado(una, 'NIV-01'), una);
  assert.deepEqual(conPasado(una, 'NIV-01').pasados, ['NIV-01']);
});

test('🔴 localStorage que tira: guardar no tira, y el avance en memoria incluye el nivel', () => {
  for (const tira of ['leer', 'escribir', 'todo'] as const) {
    reiniciarAvanceParaPruebas();
    const { a } = almacen('{"pasados":["NIV-01"]}', tira);
    let avance = SIN_AVANCE;
    assert.doesNotThrow(() => {
      avance = guardarPasado('NIV-02', a);
    }, `con un almacén que tira al ${tira}, ganar rompió el juego`);
    assert.ok(avance.pasados.includes('NIV-02'), `con un almacén que tira al ${tira}, el nivel no quedó en memoria`);
    // Y mientras dure la página, el que se retome es el siguiente: la memoria manda.
    assert.doesNotThrow(() => cargarAvance(a));
    assert.ok(cargarAvance(a).pasados.includes('NIV-02'));
  }
  // Un almacén que tira al leer, al arrancar: sin avance, y no tira.
  reiniciarAvanceParaPruebas();
  assert.deepEqual(cargarAvance(almacen('{"pasados":["NIV-01"]}', 'leer').a).pasados, []);
});

test('lo ganado cuando no se pudo escribir no se pierde en la próxima escritura que sí funciona', () => {
  reiniciarAvanceParaPruebas();
  const lleno = almacen(null, 'escribir');
  guardarPasado('NIV-01', lleno.a);
  const sano = almacen(null);
  guardarPasado('NIV-02', sano.a);
  assert.deepEqual(JSON.parse(sano.guardado.get(CLAVE_AVANCE)!).pasados, ['NIV-01', 'NIV-02']);
});

test('🔴 dos pestañas: lo guardado tiene NIV-02, esta gana NIV-03, y quedan los dos', () => {
  reiniciarAvanceParaPruebas();
  const { a, guardado } = almacen(null);
  // Esta pestaña arrancó sin avance...
  assert.deepEqual(cargarAvance(a).pasados, []);
  // ...la otra ganó NIV-02 mientras tanto...
  guardado.set(CLAVE_AVANCE, '{"pasados":["NIV-02"]}');
  // ...y esta gana NIV-03.
  guardarPasado('NIV-03', a);
  assert.deepEqual(JSON.parse(guardado.get(CLAVE_AVANCE)!).pasados, ['NIV-02', 'NIV-03']);
});

test('no se escribe nada hasta la primera victoria: leer no escribe', () => {
  reiniciarAvanceParaPruebas();
  const { a, guardado, escrituras } = almacen(null);
  cargarAvance(a);
  cargarAvance(a);
  assert.equal(escrituras(), 0);
  assert.equal(guardado.has(CLAVE_AVANCE), false);
  guardarPasado('NIV-01', a);
  assert.equal(escrituras(), 1);
  assert.equal(guardado.get(CLAVE_AVANCE), '{"pasados":["NIV-01"]}', 'el valor, tal cual lo fija CTR-16.11.1');
});

test('sin localStorage en la página (Node), las dos del aparato no tiran y usan la memoria', () => {
  reiniciarAvanceParaPruebas();
  assert.equal(typeof (globalThis as Record<string, unknown>).localStorage, 'undefined');
  assert.deepEqual(cargarAvance().pasados, []);
  assert.deepEqual(guardarPasado('NIV-01').pasados, ['NIV-01']);
  assert.deepEqual(cargarAvance().pasados, ['NIV-01']);
});

test('la unión: primero lo de uno, después lo que el otro traía de más; el resto del primero manda', () => {
  const a = leerAvance('{"pasados":["NIV-02"],"x":1}');
  const b = leerAvance('{"pasados":["NIV-01","NIV-02"],"x":2,"y":3}');
  assert.deepEqual(unirAvances(a, b), { pasados: ['NIV-02', 'NIV-01'], resto: { x: 1, y: 3 } });
});

test('avance.ts no importa el motor, el DOM ni node:* (CTR-16.8)', () => {
  const fuente = readFileSync('src/lib/skayboy/avance.ts', 'utf-8');
  const imports = [...fuente.matchAll(/^import\s[^;]*from\s+'([^']+)'/gm)].map((m) => m[1]);
  assert.deepEqual(imports, ['./niveles.ts']);
  assert.match(fuente, /^import type \{ Nivel \} from '\.\/niveles\.ts';$/m, 'de niveles.ts, solo el tipo');
  assert.doesNotMatch(fuente, /\b(document|window)\s*\./, 'avance.ts toca el DOM');
});
