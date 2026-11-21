/**
 * La palabra errada de "Completá la letra" tiene que sonar a la correcta (`T-532`).
 *
 * El defecto que cierra: hasta `T-532`, 44 de los 72 ítems jugables no tenían ni un
 * distractor que compitiera. «Y se [___]» ofrecía música / rockeros / cristal donde va un
 * verbo; «se cargan los [___]», carozo / caníbal / ciudad donde va un plural. Se acertaba
 * por gramática, sin saberse el tema. El rojo es el banco anterior
 * (`git show 7d0a22d:src/data/letra.json`): los cuatro ejemplos de abajo salen de ahí.
 *
 * Qué mira, sobre los ítems `listo`:
 *  · cada uno tiene su entrada en `letra-distractores.json`, y lo que está en `letra.json`
 *    es lo que esa entrada dice: una corrida del generador no pisó la curaduría;
 *  · ningún distractor es de otra clase, de otro número o de otro género que el hueco;
 *  · ninguno se pasa de una sílaba de diferencia con la respuesta;
 *  · ninguno está escrito en el verso ni en el contexto que el jugador ve;
 *  · un verso dado de baja no se juega.
 *
 * Lo que **no** puede mirar: que un distractor no sea también correcto, y que tenga
 * sentido en el verso. Eso lo mira quien cura y quien revisa.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  acento, clave, generoPorTerminacion, moldeVerbal, motivoDeRechazo, pareceGerundio, pareceInfinitivo,
  parecePlural, rimaAsonante, rimaConsonante, silabas,
} from './morfologia.ts';
import {
  indiceDeCuraduria, llaveDe, problemasDe, renglonDe, vocabularioDelCancionero,
  type EntradaCurada, type ItemCurable,
} from './curaduria.ts';

interface ItemCrudo extends ItemCurable {
  readonly id: string;
  readonly estado: string;
  readonly opciones: readonly { readonly texto: string; readonly correcta: boolean }[];
}

const leer = <T>(ruta: string): T => JSON.parse(readFileSync(ruta, 'utf8')) as T;
const banco = leer<{ items: ItemCrudo[] }>('src/data/letra.json');
const curaduria = leer<{ items: EntradaCurada[] }>('src/data/letra-distractores.json');
const cancionero = leer<{ temas: Parameters<typeof vocabularioDelCancionero>[0] }>('src/data/cancionero.json');

const LISTOS = banco.items.filter((i) => i.estado === 'listo');
const INDICE = indiceDeCuraduria(curaduria.items);
const CANTADO = vocabularioDelCancionero(cancionero.temas);
const entradaDe = (it: ItemCrudo): EntradaCurada | undefined => INDICE.get(llaveDe(it.tema.slug, renglonDe(it)));

// ───────────────────────────────────────────────────────────── la morfología

test('sílabas: diptongos, hiatos, la u muda y la y final', () => {
  const casos: Record<string, number> = {
    días: 2, peor: 2, roll: 1, fuego: 2, ciudad: 2, católica: 4, infidelidad: 5, anochezca: 4,
    arrepentís: 4, guita: 2, queso: 2, whisky: 2, rey: 1, prohibición: 4, toalla: 3, cuidado: 3,
  };
  for (const [palabra, n] of Object.entries(casos)) assert.equal(silabas(palabra), n, palabra);
});

test('acento y rima: lo que hace que dos palabras caigan igual en el verso', () => {
  assert.equal(acento('llegó'), 'aguda');
  assert.equal(acento('corazón'), 'aguda');
  assert.equal(acento('favor'), 'aguda');
  assert.equal(acento('bolsillos'), 'llana');
  assert.equal(acento('católica'), 'esdrujula');
  assert.equal(rimaAsonante('fuego'), rimaAsonante('miedo'));
  assert.equal(rimaConsonante('turno'), rimaConsonante('saturno'));
  assert.notEqual(rimaAsonante('fuego'), rimaAsonante('racha'));
});

test('plural: termina en s, salvo las que no', () => {
  for (const p of ['bolsillos', 'hormigas', 'fatales', 'días', 'grises', 'huevos']) assert.equal(parecePlural(p), true, p);
  for (const p of ['francés', 'después', 'menos', 'lejos', 'jamás', 'carozo', 'ciudad', 'arrepentís']) {
    assert.equal(parecePlural(p), false, p);
  }
});

test('género por terminación, con las que engañan', () => {
  assert.equal(generoPorTerminacion('muerto'), 'm');
  assert.equal(generoPorTerminacion('corta'), 'f');
  assert.equal(generoPorTerminacion('llamas'), 'f');
  assert.equal(generoPorTerminacion('mano'), 'f');
  assert.equal(generoPorTerminacion('día'), 'm');
  assert.equal(generoPorTerminacion('prohibición'), 'f');
  assert.equal(generoPorTerminacion('libre'), null);
  assert.equal(generoPorTerminacion('corazón'), null);
});

test('molde verbal: dos formas con el mismo molde caben en el mismo hueco', () => {
  assert.equal(moldeVerbal('ofreció'), moldeVerbal('despertó'));
  assert.equal(moldeVerbal('duelen'), moldeVerbal('mienten'));
  assert.equal(moldeVerbal('cambiará'), moldeVerbal('pasará'));
  assert.equal(moldeVerbal('vemos'), moldeVerbal('tenemos'));
  assert.equal(moldeVerbal('arrepentís'), moldeVerbal('escapás'));
  assert.equal(moldeVerbal('pierde'), moldeVerbal('duerme'));
  assert.notEqual(moldeVerbal('pierde'), moldeVerbal('acabo'));
  assert.notEqual(moldeVerbal('llegó'), moldeVerbal('condena'));
  assert.equal(pareceInfinitivo('hablar'), true);
  assert.equal(pareceInfinitivo('verte'), true);
  assert.equal(pareceInfinitivo('lechuza'), false);
  assert.equal(pareceGerundio('acechándome'), true);
  assert.equal(pareceGerundio('aconsejar'), false);
});

test('el defecto, tal como estaba: los distractores viejos de los cuatro ejemplos no pasan', () => {
  // Los cuatro que nombró el pedido, con las opciones del banco de `7d0a22d`.
  const viejos: [string, Parameters<typeof motivoDeRechazo>[2], string[]][] = [
    ['ofreció', { clase: 'verbo' }, ['música', 'rockeros', 'cristal']],
    ['duelen', { clase: 'verbo' }, ['lujo', 'lengua', 'mejillas']],
    ['llegó', { clase: 'verbo' }, ['condena', 'botones', 'nueve']],
    ['bolsillos', { clase: 'sustantivo', numero: 'pl', genero: 'm' }, ['carozo', 'caníbal', 'ciudad']],
  ];
  for (const [respuesta, hueco, distractores] of viejos) {
    for (const d of distractores) {
      assert.notEqual(motivoDeRechazo(d, respuesta, hueco), null, `«${d}» pasó como distractor de «${respuesta}»`);
    }
  }
  // Y lo demás que relevó el crítico: infinitivo, género, sílabas.
  assert.notEqual(motivoDeRechazo('lechuza', 'soportar', { clase: 'infinitivo' }), null);
  assert.notEqual(motivoDeRechazo('negro', 'actual', { clase: 'adjetivo', numero: 'sg', genero: 'f' }), null);
  assert.notEqual(motivoDeRechazo('iluminados', 'esponja', { clase: 'sustantivo', numero: 'sg', genero: 'f' }), null);
  assert.notEqual(motivoDeRechazo('viejas', 'peligro', { clase: 'sustantivo', numero: 'sg', genero: 'm' }), null);
});

test('y los que sí suenan a la correcta pasan', () => {
  assert.equal(motivoDeRechazo('despertó', 'ofreció', { clase: 'verbo' }), null);
  assert.equal(motivoDeRechazo('gatillos', 'bolsillos', { clase: 'sustantivo', numero: 'pl', genero: 'm' }), null);
  assert.equal(motivoDeRechazo('olvidar', 'explicar', { clase: 'infinitivo' }), null);
  assert.equal(motivoDeRechazo('final', 'actual', { clase: 'adjetivo', numero: 'sg', genero: 'f' }), null);
});

// ───────────────────────────────────────────────────────────── el banco jugable

test('todo ítem listo tiene sus distractores elegidos por una persona', () => {
  const sinCurar = LISTOS.filter((it) => !entradaDe(it)?.distractores).map((it) => `${it.id} «${renglonDe(it)}»`);
  assert.deepEqual(
    sinCurar,
    [],
    'Estos versos se juegan con distractores sorteados. Sumales una entrada en src/data/letra-distractores.json ' +
      'y corré npm run generar-letra (T-532).',
  );
});

test('lo que se juega es lo que dice la curaduría: el generador no la pisó', () => {
  const distintos: string[] = [];
  for (const it of LISTOS) {
    const entrada = entradaDe(it);
    if (!entrada?.distractores) continue;
    const enElBanco = it.opciones.filter((o) => !o.correcta).map((o) => clave(o.texto)).sort();
    const curados = entrada.distractores.map(clave).sort();
    if (enElBanco.join('|') !== curados.join('|')) distintos.push(`${it.id}: banco ${enElBanco} / curaduría ${curados}`);
  }
  assert.deepEqual(distintos, []);
});

test('ningún distractor jugable es de otra clase, otro número, otro largo, ni está a la vista', () => {
  const problemas: string[] = [];
  for (const it of LISTOS) {
    const entrada = entradaDe(it);
    if (!entrada) continue;
    // Se mide lo que está en letra.json, no lo que dice la curaduría: es lo que el jugador ve.
    const servida: EntradaCurada = { ...entrada, distractores: it.opciones.filter((o) => !o.correcta).map((o) => o.texto.toLocaleLowerCase('es')) };
    for (const p of problemasDe(servida, it, CANTADO)) problemas.push(`${it.id} «${renglonDe(it)}»: ${p}`);
  }
  assert.deepEqual(problemas, []);
});

test('la respuesta de cada ítem listo es exactamente una, y las cuatro opciones son distintas', () => {
  for (const it of LISTOS) {
    assert.equal(it.opciones.length, 4, it.id);
    assert.equal(it.opciones.filter((o) => o.correcta).length, 1, it.id);
    assert.equal(new Set(it.opciones.map((o) => clave(o.texto))).size, 4, it.id);
  }
});

test('un verso dado de baja no se juega', () => {
  const bajas = new Set(curaduria.items.filter((e) => e.baja).map((e) => llaveDe(e.tema, e.verso)));
  const jugados = LISTOS.filter((it) => bajas.has(llaveDe(it.tema.slug, renglonDe(it)))).map((it) => it.id);
  assert.deepEqual(jugados, []);
  for (const e of curaduria.items) {
    assert.ok(Boolean(e.baja) !== Boolean(e.distractores), `«${e.verso}»: una entrada trae distractores o trae baja, no las dos ni ninguna`);
  }
});

test('ninguna entrada de la curaduría quedó huérfana ni repetida', () => {
  const llaves = curaduria.items.map((e) => llaveDe(e.tema, e.verso));
  assert.equal(new Set(llaves).size, llaves.length, 'hay dos entradas para el mismo verso');
  const enElBanco = new Set(banco.items.map((it) => llaveDe(it.tema.slug, renglonDe(it))));
  assert.deepEqual(llaves.filter((l) => !enElBanco.has(l)), [], 'entradas cuyo verso ya no da ítem');
});
