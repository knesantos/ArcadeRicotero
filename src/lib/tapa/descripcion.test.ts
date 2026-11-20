/**
 * "Adiviná la tapa" se puede jugar sin ver (`CTR-05` v2, `T-534`; `REV-24`, perfil C,
 * hallazgo 1).
 *
 * Cada recorte trae una descripción de lo que se ve, que es el `alt` de la imagen mientras se
 * juega. Dos cosas la pueden romper y las dos tienen que verse en rojo: que falte, y que
 * cuente la respuesta.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';

import {
  BancoInvalido,
  DESCRIPCION_MIN,
  TITULOS_DE_DISCO,
  cargarBanco,
  fugasDeDescripcion,
  verificarInvariantes,
  type BancoCrudo,
  type ItemCrudo,
} from './banco.ts';
import { PARTIDA } from './copy.ts';

const leer = (): BancoCrudo => JSON.parse(readFileSync('src/data/tapa.json', 'utf-8')) as BancoCrudo;
const CRUDO = leer();
const SCHEMA = JSON.parse(readFileSync('src/data/_schema/tapa.schema.json', 'utf-8')) as {
  $defs: { tituloDeDisco: { enum: string[] } };
};
const LISTOS = CRUDO.items.filter((i) => i.estado === 'listo');

function erroresDeSchema(instancia: unknown): readonly string[] {
  const Ctor = ((Ajv2020 as unknown as { default?: unknown }).default ?? Ajv2020) as new (o: object) => {
    compile: (s: unknown) => ((d: unknown) => boolean) & {
      errors?: readonly { instancePath: string; message?: string }[] | null;
    };
  };
  const validar = new Ctor({ allErrors: true, strict: false }).compile(SCHEMA);
  if (validar(instancia)) return [];
  return (validar.errors ?? []).map((e) => `${e.instancePath} ${e.message ?? ''}`.trim());
}

/** El banco real con un solo ítem tocado. */
function tocado(cambio: (item: { imagen: { descripcion?: string } }) => void): BancoCrudo {
  const b = leer();
  cambio(b.items[0] as unknown as { imagen: { descripcion?: string } });
  return b;
}

test('CTR-05 v2: el banco declara la version que trae la descripcion', () => {
  assert.equal(CRUDO.contratoVersion, 2);
});

test('todo item listo trae la descripcion de su recorte', () => {
  const sin = LISTOS.filter((i) => (i.imagen.descripcion?.trim().length ?? 0) < DESCRIPCION_MIN).map((i) => i.id);
  assert.deepEqual(sin, [], `sin descripcion: ${sin.join(', ')}`);
});

test('ninguna descripcion nombra el disco ni usa una palabra del titulo de una opcion', () => {
  const malas = LISTOS.flatMap((i) => {
    const fugas = fugasDeDescripcion(i.imagen.descripcion ?? '', i.opciones.map((o) => o.texto));
    return fugas.length ? [`${i.id}: ${fugas.join('; ')}`] : [];
  });
  assert.deepEqual(malas, []);
});

test('dos recortes no comparten descripcion: cada una describe el suyo', () => {
  const todas = LISTOS.map((i) => i.imagen.descripcion);
  assert.equal(new Set(todas).size, todas.length);
});

test('registro 3: las descripciones van sin exclamacion, sin suspensivos y sin pregunta', () => {
  const malas = LISTOS.filter((i) => /[¡!¿?…]|\.\.\./.test(i.imagen.descripcion ?? '')).map((i) => i.id);
  assert.deepEqual(malas, []);
});

test('la descripcion viaja al navegador, y el alt la usa sin nombrar el disco', () => {
  for (const item of cargarBanco(CRUDO)) {
    const alt = PARTIDA.altRecorte(item.imagen.descripcion);
    assert.ok(alt.includes(item.imagen.descripcion), `${item.id}: el alt no trae la descripcion`);
    assert.deepEqual(fugasDeDescripcion(alt, item.opciones.map((o) => o.texto)), [], `${item.id}: el alt regala`);
  }
});

test('la isla usa la descripcion como alt del recorte', () => {
  const fuente = readFileSync('src/scripts/partida-tapa.ts', 'utf-8');
  assert.match(fuente, /\.alt = PARTIDA\.altRecorte\(item\.imagen\.descripcion\)/);
});

// ------------------------------------------------------------ las reglas, en rojo

test('en rojo: el titulo entero de un disco, aunque no sea opcion del item', () => {
  const fugas = fugasDeDescripcion('Un perro que parece de la tapa de Momo Sampler.', ['Gulp!', 'Oktubre']);
  assert.equal(fugas.length, 1);
  assert.match(fugas[0]!, /Momo Sampler/);
});

test('en rojo: una palabra con peso del titulo de una opcion, con o sin tilde y signos', () => {
  const opciones = ['Lobo suelto', 'Cordero atado', 'Un baión para el ojo idiota', '¡Bang! ¡Bang!... Estás liquidado'];
  assert.ok(fugasDeDescripcion('Un hocico de lobo con colmillos.', opciones).length > 0);
  assert.ok(fugasDeDescripcion('Un OJO verde entre pelaje.', opciones).length > 0);
  assert.ok(fugasDeDescripcion('Suena un baion de fondo.', opciones).length > 0);
  assert.ok(fugasDeDescripcion('Un cartel que dice bang.', opciones).length > 0);
});

test('en verde: articulos y preposiciones del titulo no cuentan, ni una palabra parecida', () => {
  const opciones = ['Un baión para el ojo idiota', 'La mosca y la sopa'];
  assert.deepEqual(fugasDeDescripcion('Un marco para la foto, y dos ojos redondos.', opciones), []);
});

test('en verde: la palabra de un disco que no es opcion del item no es fuga', () => {
  // "ojos"/"ojo" solo delata cuando el baion esta entre las cuatro.
  assert.deepEqual(fugasDeDescripcion('Un ojo verde entre pelaje.', ['Cordero atado', 'Lobo suelto']), []);
});

test('en rojo: el build se cae si un item listo no trae descripcion', () => {
  const base = LISTOS[0]!;
  const { descripcion: _fuera, ...imagen } = base.imagen;
  assert.throws(() => verificarInvariantes([{ ...base, imagen } as ItemCrudo]), BancoInvalido);
  assert.throws(
    () => verificarInvariantes([{ ...base, imagen: { ...base.imagen, descripcion: 'Una tapa.' } }]),
    BancoInvalido,
  );
});

test('en rojo: el build se cae si la descripcion regala la respuesta', () => {
  const base = LISTOS[0]!;
  const regala = { ...base.imagen, descripcion: `El pedazo de arriba de la tapa de ${base.imagen.disco}, con letras.` };
  assert.throws(() => verificarInvariantes([{ ...base, imagen: regala }]), /regala la respuesta/);
});

test('un borrador puede no tener descripcion todavia', () => {
  const base = LISTOS[0]!;
  const { descripcion: _fuera, ...imagen } = base.imagen;
  assert.doesNotThrow(() => verificarInvariantes([{ ...base, estado: 'borrador', imagen } as ItemCrudo]));
});

test('el schema, en verde con el banco real y en rojo sin descripcion, corta o con la version vieja', () => {
  assert.deepEqual(erroresDeSchema(CRUDO), []);
  assert.ok(erroresDeSchema(tocado((i) => delete i.imagen.descripcion)).length > 0, 'acepto un listo sin descripcion');
  assert.ok(erroresDeSchema(tocado((i) => (i.imagen.descripcion = 'Una tapa.'))).length > 0, 'acepto una de 9 letras');
  assert.ok(erroresDeSchema({ ...CRUDO, contratoVersion: 1 }).length > 0, 'acepto contratoVersion 1');
});

test('los diez titulos del codigo son los diez del schema', () => {
  // `fugasDeDescripcion` compara contra esta lista: si el contrato suma un disco y acá no,
  // la regla 1 deja de verlo.
  assert.deepEqual([...TITULOS_DE_DISCO].sort(), [...SCHEMA.$defs.tituloDeDisco.enum].sort());
});
