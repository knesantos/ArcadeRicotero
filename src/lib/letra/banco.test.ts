import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  BancoInvalido,
  CONTEXTO_POR_NIVEL,
  aPayload,
  cargarBanco,
  verificarInvariantes,
  type BancoCrudo,
  type ItemCrudo,
} from './banco.ts';
import { DISCOS, indiceDeTemas, leerTemas, normalizar } from './temas.ts';

const CRUDO = JSON.parse(readFileSync('src/data/letra.json', 'utf-8')) as BancoCrudo;
const TEMAS = leerTemas();
const INDICE = indiceDeTemas(TEMAS);

/**
 * Un ítem de referencia. El texto del hueco y del contexto es **inventado a propósito**:
 * estos tests prueban la maquinaria, no el contenido, y el contenido real lo carga el
 * usuario. Un test que dependiera de un verso de verdad se rompería el día que se corrija
 * una transcripción, que es justo lo que `D-13` avisa que va a pasar.
 */
const base: ItemCrudo = {
  id: 'LT-999',
  us: ['US-03'],
  dificultad: 'dificil',
  tema: {
    slug: 'la-bestia-pop',
    titulo: 'La bestia pop',
    disco: 'gulp',
    pista: 2,
    anio: 1985,
  },
  hueco: { antes: 'primera parte', respuesta: 'palabra', despues: 'segunda parte' },
  contexto: { antes: [], despues: [] },
  opciones: [
    { texto: 'palabra', correcta: true },
    { texto: 'otra', correcta: false },
    { texto: 'tercera', correcta: false },
    { texto: 'cuarta', correcta: false },
  ],
  fuentes: ['RES-20'],
  fuenteLetra: ['pendiente de carga'],
  // Una sola ficha de letra, asi que este item jugable se sostiene por la otra puerta de
  // `CTR-04`: alguien lo escuchó. Es la forma que va a tener el banco de verdad.
  confirmadoDeOido: { quien: 'Santiago', fecha: '2026-08-23', donde: 'disco-fisico', minuto: '1:24' },
  sensibleA: ['letra'],
  estado: 'listo',
};

const con = (cambio: Partial<ItemCrudo>): ItemCrudo => ({ ...base, ...cambio });

// ---------------------------------------------------------------- los 105 de RES-20

test('RES-20: la ficha trae exactamente los 105 temas, reparidos por disco', () => {
  assert.equal(TEMAS.length, 105, `la ficha dio ${TEMAS.length} temas y RES-20 dice 105`);
  const porDisco = new Map<string, number>();
  for (const t of TEMAS) porDisco.set(t.disco, (porDisco.get(t.disco) ?? 0) + 1);
  assert.equal(porDisco.size, DISCOS.length, 'falta el tracklist de algún disco');
  for (const d of DISCOS) assert.ok((porDisco.get(d) ?? 0) > 0, `${d} quedó sin temas`);
});

test('la lista sale de la ficha y no de una copia', () => {
  // Si alguien copia los 105 a otro lado, esto deja de ser cierto y la copia puede
  // desincronizarse de RES-20 sin que nada avise.
  assert.throws(() => leerTemas('Docs/INVESTIGACION/no-existe.md'));
});

test('el cruce ignora tildes y puntuación', () => {
  assert.equal(normalizar('Canción para naufragios'), normalizar('cancion para naufragios'));
  assert.ok(INDICE.has(normalizar('Ji ji ji')) || INDICE.has(normalizar('Jijiji')));
});

// ---------------------------------------------------------------- D-13, el cruce

test('D-13: un tema que no está entre los 105 no entra al banco', () => {
  // Es la mitigacion central de D-13. El error demostrado de las fuentes de fans es
  // mezclar material del Indio solista y de Skay con el de la banda.
  const ajeno = con({ tema: { ...base.tema, titulo: 'Tema que no existe en ningun disco' } });
  assert.throws(() => verificarInvariantes([ajeno], 'opciones', INDICE), BancoInvalido);
});

test('D-13: un tema real sí entra, aunque venga con otra grafía', () => {
  const real = con({ tema: { ...base.tema, titulo: 'la  BESTIA   pop' } });
  assert.doesNotThrow(() => verificarInvariantes([real], 'opciones', INDICE));
});

test('D-13: todo ítem declara de dónde salió la letra', () => {
  assert.throws(() => verificarInvariantes([con({ fuenteLetra: [] })], 'opciones', INDICE), BancoInvalido);
});

// ------------------------------------------------- CTR-04, las dos puertas hacia `listo`

test('CTR-04: sin oído y con una sola ficha de letra, no puede estar en `listo`', () => {
  // Es lo único estricto que le queda al proyecto: si la respuesta está mal, el juego le
  // marca error justo al que se sabe el tema. Hasta este test la regla vivía solo en
  // `letra.schema.json`, que no lo corre nadie.
  const sinRespaldo = con({ confirmadoDeOido: undefined, fuenteLetra: ['RES-23'] });
  assert.throws(() => verificarInvariantes([sinRespaldo], 'opciones', INDICE), BancoInvalido);
});

test('CTR-04: dos fichas de letra alcanzan, sin que nadie escuche', () => {
  const dosFichas = con({ confirmadoDeOido: undefined, fuenteLetra: ['RES-23', 'RES-99'] });
  assert.doesNotThrow(() => verificarInvariantes([dosFichas], 'opciones', INDICE));
});

test('CTR-04: en `borrador` no se le pide respaldo a nadie', () => {
  // El banco candidato entero vive acá: 313 versos esperando que alguien ponga el disco.
  const borrador = con({ confirmadoDeOido: undefined, fuenteLetra: ['RES-23'], estado: 'borrador' });
  assert.doesNotThrow(() => verificarInvariantes([borrador], 'opciones', INDICE));
});

test('CTR-04: una confirmación sin minuto no es una confirmación', () => {
  // `minuto` es el campo que separa el haber escuchado del haber puesto un tilde. Vacío,
  // "0:0", "un rato" o "sí" son todas la misma cosa: nadie escuchó nada.
  for (const minuto of ['', '0:0', 'un rato', '1:60', '124']) {
    const flojo = con({ confirmadoDeOido: { ...base.confirmadoDeOido!, minuto } });
    assert.throws(
      () => verificarInvariantes([flojo], 'opciones', INDICE),
      BancoInvalido,
      `"${minuto}" pasó como minuto y no debería`,
    );
  }
});

test('CTR-04: la confirmación dice quién, cuándo y dónde, o no vale', () => {
  const sinQuien = con({ confirmadoDeOido: { ...base.confirmadoDeOido!, quien: '' } });
  assert.throws(() => verificarInvariantes([sinQuien], 'opciones', INDICE), BancoInvalido);

  const fechaFloja = con({ confirmadoDeOido: { ...base.confirmadoDeOido!, fecha: 'ayer' } });
  assert.throws(() => verificarInvariantes([fechaFloja], 'opciones', INDICE), BancoInvalido);

  const dondeRaro = con({
    confirmadoDeOido: { ...base.confirmadoDeOido!, donde: 'de memoria' as never },
  });
  assert.throws(() => verificarInvariantes([dondeRaro], 'opciones', INDICE), BancoInvalido);
});

test('el banco real no tiene ningún `listo` sin respaldo', () => {
  // Este es el test que mira el archivo de verdad, no un ítem inventado. Mientras el
  // banco esté todo en borrador pasa trivialmente; el día que se confirmen versos, es lo
  // que impide que se cuele uno con el minuto en blanco.
  assert.doesNotThrow(() => cargarBanco(CRUDO, INDICE));
});

// ---------------------------------------------------------------- BR-03, el hueco

test('BR-03: el contexto no puede pasarse del que permite el nivel', () => {
  assert.equal(CONTEXTO_POR_NIVEL.facil, 2);
  assert.equal(CONTEXTO_POR_NIVEL.media, 1);
  assert.equal(CONTEXTO_POR_NIVEL.dificil, 0);

  const dificilConContexto = con({ contexto: { antes: ['uno'], despues: [] } });
  assert.throws(() => verificarInvariantes([dificilConContexto], 'opciones', INDICE), BancoInvalido);

  const facilConDos = con({ dificultad: 'facil', contexto: { antes: ['uno'], despues: ['dos'] } });
  assert.doesNotThrow(() => verificarInvariantes([facilConDos], 'opciones', INDICE));
});

test('el hueco no puede comerse el verso entero', () => {
  // CTR-04 parte el verso en tres justamente para que no exista una version armada.
  // Un hueco sin nada alrededor es esa version armada con otro nombre.
  const todo = con({ hueco: { antes: '', respuesta: 'algo', despues: '' } });
  assert.throws(() => verificarInvariantes([todo], 'opciones', INDICE), BancoInvalido);
});

test('el hueco tiene que tener respuesta', () => {
  const vacio = con({ hueco: { ...base.hueco, respuesta: '   ' } });
  assert.throws(() => verificarInvariantes([vacio], 'opciones', INDICE), BancoInvalido);
});

// ---------------------------------------------------------------- BR-04, las opciones

test('BR-04: cuatro opciones y una sola correcta', () => {
  assert.throws(
    () => verificarInvariantes([con({ opciones: base.opciones!.slice(0, 3) })], 'opciones', INDICE),
    BancoInvalido,
  );
  const dos = base.opciones!.map((o, i) => ({ ...o, correcta: i < 2 }));
  assert.throws(() => verificarInvariantes([con({ opciones: dos })], 'opciones', INDICE), BancoInvalido);
});

test('la opción correcta tiene que ser la respuesta del hueco', () => {
  // Dos fuentes para el mismo dato es como se desincronizan: el schema no puede
  // atajarlo y el jugador veria una correcta que no completa el verso.
  const desalineado = con({
    opciones: base.opciones!.map((o) => (o.correcta ? { ...o, texto: 'otra cosa' } : o)),
  });
  assert.throws(() => verificarInvariantes([desalineado], 'opciones', INDICE), BancoInvalido);
});

// ---------------------------------------------------------------- payload

test('el payload no le manda al navegador las notas internas', () => {
  const conNotas = con({
    notaInterna: 'ojo con la transcripcion de este',
    opciones: base.opciones!.map((o) => ({ ...o, nota: 'por que es falso' })),
  });
  const serializado = JSON.stringify(aPayload(conNotas));
  assert.ok(!serializado.includes('ojo con la transcripcion'), 'la nota interna llegó al cliente');
  assert.ok(!serializado.includes('por que es falso'), 'la nota del distractor llegó al cliente');
});

test('el payload manda el verso partido, nunca armado', () => {
  // CTR-04.3: no tiene que existir una version completa del verso esperando a que
  // alguien abra la pestaña de red.
  const p = aPayload(base);
  const serializado = JSON.stringify(p);
  const armado = `${base.hueco.antes} ${base.hueco.respuesta} ${base.hueco.despues}`;
  assert.ok(!serializado.includes(armado), 'el verso viaja armado');
  assert.equal(p.hueco.antes, base.hueco.antes);
  assert.equal(p.hueco.despues, base.hueco.despues);
});

// ---------------------------------------------------------------- el banco real

test('US-03: el banco arranca vacío y eso no rompe nada', () => {
  // El texto de los versos es material de origen y entra por la mano del usuario, igual
  // que los recortes de audio de US-02. Hasta entonces el juego se muestra en la cocina.
  const items = cargarBanco(CRUDO, INDICE);
  assert.deepEqual(items, []);
  assert.equal(CRUDO.modoRespuesta, 'opciones');
  assert.equal(CRUDO.contrato, 'CTR-04');
});

test('los borradores y los retirados no llegan al jugador', () => {
  const banco: BancoCrudo = {
    ...CRUDO,
    items: [base, con({ id: 'LT-998', estado: 'borrador' }), con({ id: 'LT-997', estado: 'retirado' })],
  };
  assert.deepEqual(
    cargarBanco(banco, INDICE).map((i) => i.id),
    ['LT-999'],
  );
});

test('no se repiten los ids', () => {
  assert.throws(() => verificarInvariantes([base, con({})], 'opciones', INDICE), BancoInvalido);
});
