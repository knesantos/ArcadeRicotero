import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  aPayload,
  cargarBanco,
  claseDeFuente,
  verificarInvariantes,
  BancoInvalido,
  type BancoCrudo,
  type ItemCrudo,
} from './banco.ts';

const base: ItemCrudo = {
  id: 'QZ-001',
  us: ['US-01'],
  categoria: 'discos',
  dificultad: 'facil',
  enunciado: 'Enunciado de prueba, suficientemente largo.',
  opciones: [
    { texto: 'A', correcta: true },
    { texto: 'B', correcta: false, nota: 'por que B es falsa' },
    { texto: 'C', correcta: false },
    { texto: 'D', correcta: false },
  ],
  explicacion: 'Explicacion de prueba con largo suficiente.',
  fuentes: ['RES-02'],
  esLeyenda: false,
  sensibleA: [],
  estado: 'listo',
  notaInterna: 'esto no puede llegar al navegador',
};

test('claseDeFuente distingue las tres casillas de CTR-02.4', () => {
  assert.equal(claseDeFuente(base), 'hecho');
  assert.equal(claseDeFuente({ ...base, esLeyenda: true, rotuloLeyenda: 'x'.repeat(12) }), 'leyenda');
  assert.equal(
    claseDeFuente({
      ...base,
      testimonio: { quien: 'Indio Solari', obra: 'Recuerdos', ubicacion: 'p. 10', afirmacion: 'Cuenta que...' },
    }),
    'testimonio',
  );
});

test('aPayload no deja pasar notaInterna ni las notas de los distractores', () => {
  const p = aPayload(base);
  const json = JSON.stringify(p);
  assert.ok(!json.includes('notaInterna'), 'notaInterna llego al payload');
  assert.ok(!json.includes('no puede llegar'), 'el texto de notaInterna llego al payload');
  assert.ok(!json.includes('por que B es falsa'), 'la nota de un distractor llego al payload');
  assert.ok(!('nota' in p.opciones[1]!), 'opcion.nota sobrevivio');
});

test('aPayload conserva el rotulo de leyenda y el testimonio', () => {
  const leyenda = aPayload({ ...base, esLeyenda: true, rotuloLeyenda: 'Esto lo cuentan, nadie lo confirmo' });
  assert.equal(leyenda.clase, 'leyenda');
  assert.equal(leyenda.rotuloLeyenda, 'Esto lo cuentan, nadie lo confirmo');

  // FIND-16: al jugador solo le llegan `quien` y `obra`. `ubicacion` y `afirmacion` son
  // insumo de auditoria de `revisor`, y `UX-01` v2 decidio que no se muestran.
  const t = { quien: 'Rocambole', obra: 'Recuerdos', ubicacion: 'p. 233', afirmacion: 'Cuenta que...' };
  const testi = aPayload({ ...base, testimonio: t });
  assert.equal(testi.clase, 'testimonio');
  assert.deepEqual(testi.testimonio, { quien: 'Rocambole', obra: 'Recuerdos' });

  const json = JSON.stringify(testi);
  assert.ok(!json.includes('p. 233'), 'la ubicacion del testimonio viajo al cliente');
  assert.ok(!json.includes('Cuenta que'), 'la afirmacion del testimonio viajo al cliente');
});

test('FIND-16: ni una ubicacion ni una afirmacion salen en el banco real', () => {
  const crudo = JSON.parse(readFileSync('src/data/quiz.json', 'utf-8')) as BancoCrudo;
  const json = JSON.stringify(cargarBanco(crudo));
  for (const it of crudo.items) {
    if (!it.testimonio) continue;
    assert.ok(!json.includes(it.testimonio.ubicacion), `${it.id}: la ubicacion viajo al cliente`);
    assert.ok(!json.includes(it.testimonio.afirmacion), `${it.id}: la afirmacion viajo al cliente`);
  }
});

test('un hecho no arrastra rotuloLeyenda aunque el JSON lo traiga', () => {
  const p = aPayload({ ...base, rotuloLeyenda: 'no corresponde' });
  assert.equal(p.clase, 'hecho');
  assert.equal(p.rotuloLeyenda, undefined);
});

test('verificarInvariantes rechaza lo que romperia el juego', () => {
  const casos: Array<[string, ItemCrudo]> = [
    ['sin opcion correcta', { ...base, opciones: base.opciones.map((o) => ({ ...o, correcta: false })) }],
    ['dos opciones correctas', { ...base, opciones: base.opciones.map((o) => ({ ...o, correcta: true })) }],
    ['tres opciones (viola BR-04)', { ...base, opciones: base.opciones.slice(0, 3) }],
    ['hecho sin fuentes', { ...base, fuentes: [] }],
    ['leyenda sin rotulo', { ...base, esLeyenda: true }],
  ];
  for (const [nombre, item] of casos) {
    assert.throws(() => verificarInvariantes([item]), BancoInvalido, `no rechazo: ${nombre}`);
  }
  assert.throws(() => verificarInvariantes([base, base]), BancoInvalido, 'no rechazo id repetido');
  assert.doesNotThrow(() => verificarInvariantes([base]));
});

test('cargarBanco deja afuera borrador y retirado', () => {
  const crudo: BancoCrudo = {
    contrato: 'CTR-02',
    contratoVersion: 1,
    juego: 'quiz',
    actualizado: '2026-08-19',
    items: [
      base,
      { ...base, id: 'QZ-002', estado: 'borrador' },
      { ...base, id: 'QZ-003', estado: 'retirado' },
    ],
  };
  const items = cargarBanco(crudo);
  assert.equal(items.length, 1);
  assert.equal(items[0]!.id, 'QZ-001');
});

test('el banco real de src/data/quiz.json cumple los invariantes', () => {
  const crudo = JSON.parse(readFileSync('src/data/quiz.json', 'utf-8')) as BancoCrudo;
  assert.doesNotThrow(() => verificarInvariantes(crudo.items));
  const items = cargarBanco(crudo);
  assert.ok(items.length >= 20, `solo ${items.length} items jugables`);

  // Ningun campo interno sobrevive al payload del banco entero.
  const json = JSON.stringify(items);
  assert.ok(!json.includes('notaInterna'), 'notaInterna en el payload real');
  assert.ok(!json.includes('"nota"'), 'nota de distractor en el payload real');

  // Las tres casillas estan representadas: si esto se rompe, el rotulado se perdio.
  const clases = new Set(items.map((i) => i.clase));
  assert.ok(clases.has('leyenda'), 'no hay leyendas en el banco real');
  assert.ok(clases.has('testimonio'), 'no hay testimonios en el banco real');
});
