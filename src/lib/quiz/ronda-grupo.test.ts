/**
 * `armarRonda()` con `grupo`: no dos ítems del mismo tema en una ronda (`T-532`).
 *
 * El defecto que cierra: "Completá la letra" tiene varios versos de la misma canción, cada
 * uno con sus vecinos a la vista. Con `CL-081` «Y se [ofreció]» y `CL-082` «Mejor que
 * [nunca]» en la misma ronda, el contexto del primero muestra «Mejor que nunca», que es la
 * respuesta del segundo. Sobre el banco de `7d0a22d`, sin `grupo`, la mayoría de las
 * rondas repetía tema: el último test lo mide para que el arreglo no sea una suposición.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { armarRonda, cumpleBR01, type Jugable } from './ronda.ts';
import type { Dificultad } from './banco.ts';

interface ConTema extends Jugable {
  readonly tema: { readonly slug: string };
}

function azarSemilla(semilla: number): () => number {
  let s = semilla >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function item(id: string, dificultad: Dificultad, slug: string): ConTema {
  return {
    id,
    dificultad,
    tema: { slug },
    opciones: [
      { texto: 'A', correcta: true },
      { texto: 'B', correcta: false },
      { texto: 'C', correcta: false },
      { texto: 'D', correcta: false },
    ],
  };
}

const porTema = { grupo: (i: ConTema) => i.tema.slug };
const temasRepetidos = (ronda: readonly ConTema[]): number => ronda.length - new Set(ronda.map((i) => i.tema.slug)).size;

const LETRA = (JSON.parse(readFileSync('src/data/letra.json', 'utf-8')) as { items: (ConTema & { estado: string })[] }).items
  .filter((i) => i.estado === 'listo');
const LARGO = Number(/const LARGO_RONDA = (\d+);/.exec(readFileSync('src/scripts/partida-letra.ts', 'utf-8'))?.[1]);

test('con grupo, mil rondas del banco real de letra y ninguna repite tema', () => {
  assert.equal(LARGO, 8, 'la isla cambió el largo de la partida: revisá este test');
  for (let s = 0; s < 1000; s++) {
    const ronda: readonly ConTema[] = armarRonda<ConTema>(LETRA, LARGO, azarSemilla(s), porTema);
    assert.equal(ronda.length, LARGO, `semilla ${s}: la ronda quedó corta`);
    assert.equal(temasRepetidos(ronda), 0, `semilla ${s}: ${ronda.map((i) => i.tema.slug).join(', ')}`);
    assert.ok(cumpleBR01(ronda), `semilla ${s}: no cumple BR-01`);
    assert.equal(new Set(ronda.map((i) => i.id)).size, LARGO, `semilla ${s}: repite un ítem`);
  }
});

test('con grupo, todo ítem jugable sigue pudiendo salir', () => {
  const vistos = new Set<string>();
  for (let s = 0; s < 3000; s++) for (const i of armarRonda(LETRA, LARGO, azarSemilla(s), porTema)) vistos.add(i.id);
  assert.deepEqual(LETRA.map((i) => i.id).filter((id) => !vistos.has(id)), [], 'ítems que el filtro por tema dejó sin salir nunca');
});

test('con grupo, los tres niveles siguen saliendo', () => {
  const cuenta: Record<string, number> = { facil: 0, media: 0, dificil: 0 };
  for (let s = 0; s < 300; s++) for (const i of armarRonda(LETRA, LARGO, azarSemilla(s), porTema)) cuenta[i.dificultad]!++;
  for (const nivel of ['facil', 'media', 'dificil']) assert.ok(cuenta[nivel]! > 0, `nunca salió un ${nivel}`);
});

test('si no hay temas distintos para completar, repite tema antes que servir una ronda corta', () => {
  const banco = [
    item('a1', 'facil', 'a'), item('a2', 'facil', 'a'), item('a3', 'media', 'a'),
    item('b1', 'media', 'b'), item('b2', 'dificil', 'b'),
  ];
  for (let s = 0; s < 200; s++) {
    const ronda = armarRonda(banco, 4, azarSemilla(s), porTema);
    assert.equal(ronda.length, 4, `semilla ${s}`);
    assert.ok(cumpleBR01(ronda), `semilla ${s}`);
    assert.equal(new Set(ronda.map((i) => i.id)).size, 4, `semilla ${s}: repite un ítem`);
    assert.equal(new Set(ronda.map((i) => i.tema.slug)).size, 2, `semilla ${s}: tienen que estar los dos temas`);
  }
});

test('si alcanza, no repite: cuatro temas y ronda de cuatro', () => {
  const banco = [
    item('a1', 'facil', 'a'), item('a2', 'facil', 'a'), item('b1', 'facil', 'b'), item('b2', 'media', 'b'),
    item('c1', 'media', 'c'), item('c2', 'dificil', 'c'), item('d1', 'dificil', 'd'), item('d2', 'dificil', 'd'),
  ];
  for (let s = 0; s < 300; s++) {
    assert.equal(temasRepetidos(armarRonda(banco, 4, azarSemilla(s), porTema)), 0, `semilla ${s}`);
  }
});

test('sin grupo, armarRonda hace lo de siempre: el quiz y las tapas no cambian', () => {
  const banco = [item('a1', 'facil', 'a'), item('a2', 'media', 'a'), item('a3', 'dificil', 'a')];
  const ronda = armarRonda(banco, 3, azarSemilla(1));
  assert.deepEqual(ronda.map((i) => i.id).sort(), ['a1', 'a2', 'a3']);
});

test('el rojo: sin grupo, el banco real de letra repite tema en la mayoría de las rondas', () => {
  let conRepetido = 0;
  for (let s = 0; s < 1000; s++) if (temasRepetidos(armarRonda(LETRA, LARGO, azarSemilla(s))) > 0) conRepetido++;
  assert.ok(conRepetido > 300, `sin grupo repitieron tema ${conRepetido} de 1000 rondas: si esto bajó, el banco cambió y el test de arriba mide otra cosa`);
});

test('la isla de letra pide un verso por tema', () => {
  const isla = readFileSync('src/scripts/partida-letra.ts', 'utf-8');
  assert.match(isla, /armarRonda\([^;]*grupo:\s*\(item\)\s*=>\s*item\.tema\.slug/s);
});
