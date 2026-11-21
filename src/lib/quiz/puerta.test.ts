import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { puertaDelQuiz } from './puerta.ts';
import { puertaHacia, hrefDelDisco, HREF_TAPAS } from '../puerta.ts';
import { comenzar, responder, retirarse, type Partida } from './vidas.ts';
import { ACIERTOS, ERRORES } from './copy.ts';
import { cargarBanco, type BancoCrudo, type Item } from './banco.ts';
import { DISCOS } from '../letra/discos.ts';
import { JUEGOS, PUERTAS } from '../sitio/copy.ts';
import * as tema from '../tema/copy.ts';

const BANCO = cargarBanco(JSON.parse(readFileSync('src/data/quiz.json', 'utf-8')) as BancoCrudo);

function correcta(i: Item): string {
  return i.opciones.find((o) => o.correcta)!.texto;
}
function errada(i: Item): string {
  return i.opciones.find((o) => !o.correcta)!.texto;
}

/** Juega respondiendo bien salvo en las posiciones de `fallar`. */
function jugar(p: Partida<Item>, fallar: (item: Item, n: number) => boolean): Partida<Item> {
  for (let n = 0; p.desenlace === 'jugando'; n++) {
    const item = p.orden[p.indice]!;
    p = responder(p, fallar(item, n) ? errada(item) : correcta(item));
  }
  return p;
}

test('T-535: «Te falta escuchar disco.» no es una respuesta a un error suelto', () => {
  // Salía al azar tras cualquier error: en la primera pregunta del que llegó sin idea y en la
  // 40 del que llevaba 38 acertadas. Un veredicto necesita una partida, no una pregunta.
  const veredictos = Object.values(tema.TRAMOS) as string[];
  for (const linea of [...ERRORES, ...ACIERTOS]) {
    assert.ok(!veredictos.includes(linea), `«${linea}» es un veredicto y volvió a la rotación de la pregunta`);
    assert.ok(!/escuchar disco/i.test(linea), `«${linea}»`);
  }
  assert.ok(ERRORES.length >= 4, 'quedaron muy pocas variantes: se van a repetir');
});

test('cada disco tiene su artículo: la puerta al disco no puede dar un 404', () => {
  const slugs = new Set(
    (JSON.parse(readFileSync('src/data/redondopedia.json', 'utf-8')) as { articulos: { slug: string }[] }).articulos.map(
      (a) => a.slug,
    ),
  );
  for (const d of DISCOS) {
    assert.ok(slugs.has(d), `la Redondopedia no tiene artículo para ${d}`);
    assert.equal(puertaHacia(d).href, hrefDelDisco(d));
    assert.equal(puertaHacia(d).texto, PUERTAS.alDisco);
  }
});

test('sin disco, la puerta lleva al juego de las tapas, que existe en el portal', () => {
  for (const nada of [null, undefined, '', 'no-es-un-disco']) {
    assert.deepEqual(puertaHacia(nada), { texto: PUERTAS.aLasTapas, href: HREF_TAPAS });
  }
  assert.ok(JUEGOS.some((j) => j.href === HREF_TAPAS), 'el portal no tiene un juego en esa dirección');
});

test('las puertas hablan en registro 1: voseo y ocho palabras como techo', () => {
  for (const texto of Object.values(PUERTAS)) {
    assert.ok(texto.trim().split(/\s+/).length <= 8, `«${texto}» pasa de ocho palabras`);
    assert.match(texto, /^(Entrá|Probá) /, `«${texto}» no arranca con un imperativo voseado`);
    assert.ok(!/[.…!]$/.test(texto), `«${texto}»: un enlace no lleva punto`);
  }
});

test('T-535: toda derrota del banco real sale con puerta, y apunta a algo que se erró', () => {
  for (let s = 0; s < 200; s++) {
    let semilla = s + 1;
    const azar = () => ((semilla = (semilla * 1664525 + 1013904223) >>> 0) / 4294967296);
    // Falla las tres primeras de cada cinco: pierde en el primer escalón, como el que llega sin idea.
    const p = jugar(comenzar(BANCO, azar), (_, n) => n % 5 < 3);
    assert.equal(p.desenlace, 'derrota');
    const puerta = puertaDelQuiz(p);
    assert.ok(puerta, `semilla ${s}: derrota sin puerta`);
    const erradas = p.orden.slice(0, p.elegidas.length).filter((it, i) => p.elegidas[i] !== correcta(it));
    const conDisco = erradas.filter((it) => it.disco);
    if (conDisco.length === 0) assert.equal(puerta.href, HREF_TAPAS, `semilla ${s}`);
    else assert.equal(puerta.href, hrefDelDisco(conDisco[conDisco.length - 1]!.disco!), `semilla ${s}`);
  }
});

test('la victoria y la retirada no llevan puerta', () => {
  assert.equal(puertaDelQuiz(jugar(comenzar(BANCO, () => 0.42), () => false)), null);
  assert.equal(puertaDelQuiz(retirarse(comenzar(BANCO, () => 0.42))), null);
  assert.equal(puertaDelQuiz(comenzar(BANCO, () => 0.42)), null);
});

/* ---- El arranque: las fáciles son fáciles de verdad (`REV-24` r0-afuera, C-4) ---- */

test('T-535: los pisos de US-01 siguen en pie después de mover dificultades', () => {
  const cuenta = (d: string) => BANCO.filter((i) => i.dificultad === d).length;
  assert.ok(BANCO.length >= 40, `el banco tiene ${BANCO.length}`);
  assert.ok(cuenta('facil') >= 10, `fáciles: ${cuenta('facil')}`);
  assert.ok(cuenta('media') >= 15, `medias: ${cuenta('media')}`);
  assert.ok(cuenta('dificil') >= 15, `difíciles: ${cuenta('dificil')}`);
  for (const c of ['historia', 'discos', 'letras', 'mitologia']) {
    assert.ok(BANCO.filter((i) => i.categoria === c).length >= 10, `categoría ${c}`);
  }
});

test('T-535: ninguna fácil pide ubicar un tema o un verso en la discografía', () => {
  // Las cuatro que tiraron al crítico de afuera en la pregunta 4 eran de esta forma: «¿de qué
  // tema es?» y «¿en qué disco salió?», con cuatro títulos de opción y nada con qué deducir.
  // Eso lo sabe el que tiene los discos, no el que escuchó «Ji ji ji» en una previa.
  const pideDiscografia = /¿de qué tema es\?|¿en qué disco salió\?/i;
  for (const i of BANCO) {
    if (i.dificultad !== 'facil') continue;
    assert.ok(!pideDiscografia.test(i.enunciado), `${i.id} es fácil y pregunta «${i.enunciado}»`);
  }
});

test('T-535: toda partida abre con el pozo fácil entero antes de la primera media', () => {
  const faciles = BANCO.filter((i) => i.dificultad === 'facil').length;
  for (let s = 0; s < 100; s++) {
    let semilla = s + 7;
    const azar = () => ((semilla = (semilla * 1664525 + 1013904223) >>> 0) / 4294967296);
    const orden = comenzar(BANCO, azar).orden;
    assert.ok(orden.slice(0, faciles).every((i) => i.dificultad === 'facil'), `semilla ${s}`);
    assert.equal(orden[faciles]!.dificultad, 'media', `semilla ${s}`);
  }
});

test('T-535: las ocho que cambiaron de nivel quedaron donde dice la nota', () => {
  const crudo = JSON.parse(readFileSync('src/data/quiz.json', 'utf-8')) as {
    items: { id: string; dificultad: string; notaInterna?: string }[];
  };
  const esperado: Record<string, string> = {
    'QZ-042': 'media', 'QZ-043': 'media', 'QZ-047': 'media', 'QZ-048': 'media', 'QZ-052': 'media',
    'QZ-060': 'facil', 'QZ-061': 'facil', 'QZ-062': 'facil',
  };
  for (const [id, nivel] of Object.entries(esperado)) {
    const item = crudo.items.find((i) => i.id === id)!;
    assert.equal(item.dificultad, nivel, id);
    assert.match(item.notaInterna ?? '', /T-535/, `${id} cambió de nivel sin decir por qué`);
  }
});
