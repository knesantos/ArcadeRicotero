/**
 * Los tests de "completar la letra" (`US-03`, `CTR-04`).
 *
 * Desde `CTR-04` v3 (`T-287`, `T-288`, la precisión de `D-46`) suman cuatro reglas y el
 * schema, cada una con su caso en rojo al lado, sobre una copia del banco tocada en un campo:
 *
 * - **`n1`**: el banco es el que da la regla. El nivel de cada ítem es el de su tema, en los
 *   tercios de `repartirEnTercios()` (`src/lib/en-vivo.ts`, `CTR-19.15`) sobre los temas del
 *   archivo, con el conteo vigente de `setlistfm.json`. Un tema sin línea es `dificil` y
 *   `sin-conteo` (`D-27`).
 * - **`n2`**: el contexto sigue al nivel, exacto (`BR-03`, `BR-30`).
 * - **`n3`**: el contexto son los vecinos del verso **en su tema**, no en su estrofa.
 * - **`n4`**: `BR-01` con el banco real: la cuota de 4 Fáciles de `US-03`, y toda partida
 *   abre en Fácil y no baja.
 * - **`c0`..`c9`**: el schema v3 rechaza un banco de antes de `D-46`.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';

import {
  BancoInvalido,
  CONTEXTO_POR_NIVEL,
  aPayload,
  cargarBanco,
  verificarInvariantes,
  type BancoCrudo,
  type Item,
  type ItemCrudo,
} from './banco.ts';
import { DISCOS, indiceDeTemas, leerTemas, normalizar } from './temas.ts';
import { versosDelTema, vecinos, type TemaConSecciones } from './versos.ts';
import { repartirEnTercios, type ConteoCitado } from '../en-vivo.ts';
import { ORDEN_DIFICULTAD } from '../escalonar.ts';
import { armarRonda, RondaImposible, type Jugable } from '../quiz/ronda.ts';

const CRUDO = JSON.parse(readFileSync('src/data/letra.json', 'utf-8')) as BancoCrudo;
const TEMAS = leerTemas();
/** Fixtures de fuente de letra con la forma de CTR-04.6 v2. */
const FICHA_LETRAS = { ficha: 'RES-23', sitio: 'letras.com', url: 'https://www.letras.com/x', consultado: '2026-08-22' } as const;
const FICHA_CIFRA = { ficha: 'RES-49', sitio: 'cifraclub.com', url: 'https://www.cifraclub.com/x', consultado: '2026-08-24' } as const;

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
  dificultadSegun: 'en-vivo',
  fuentes: ['RES-20'],
  fuenteLetra: [FICHA_LETRAS],
  // Una sola ficha de letra, asi que este item jugable se sostiene por la puerta del
  // oido, declarada en `cotejo` (CTR-04.6 v2): alguien lo escuchó.
  cotejo: { regimen: 'oido' },
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

test('CTR-04.6 v2: `listo` sin cotejo no valida — la via se declara siempre', () => {
  // En v1 lo estricto era la verificacion; D-25 la aflojo, y lo que quedo estricto es
  // el RASTRO: por que via esta listo cada item. Un listo sin cotejo es indistinguible
  // de un bug, y por eso rompe el build.
  const sinCotejo = con({ cotejo: undefined });
  assert.throws(() => verificarInvariantes([sinCotejo], 'opciones', INDICE), BancoInvalido);
});

test('CTR-04.6 v2: cada regimen se verifica contra su evidencia', () => {
  // oido sin confirmacion
  assert.throws(
    () => verificarInvariantes([con({ cotejo: { regimen: 'oido' }, confirmadoDeOido: undefined })], 'opciones', INDICE),
    BancoInvalido,
  );
  // dos-fuentes con una sola ficha
  assert.throws(
    () => verificarInvariantes([con({ cotejo: { regimen: 'dos-fuentes' }, confirmadoDeOido: undefined })], 'opciones', INDICE),
    BancoInvalido,
  );
  // dos-fuentes con dos fichas: valida sin que nadie escuche
  assert.doesNotThrow(() =>
    verificarInvariantes(
      [con({ cotejo: { regimen: 'dos-fuentes' }, confirmadoDeOido: undefined, fuenteLetra: [FICHA_LETRAS, FICHA_CIFRA] })],
      'opciones',
      INDICE,
    ),
  );
});

test('D-25: `fuente-unica` valida con una ficha y la referencia a la decision', () => {
  const promovido = con({
    cotejo: { regimen: 'fuente-unica', decision: 'D-25' },
    confirmadoDeOido: undefined,
    fuenteLetra: [FICHA_CIFRA],
  });
  assert.doesNotThrow(() => verificarInvariantes([promovido], 'opciones', INDICE));
});

test('D-25: `fuente-unica` sin la referencia, o con oido encima, no valida', () => {
  // Sin decision: el rastro quedaria mudo sobre por que se aflojo la regla.
  assert.throws(
    () =>
      verificarInvariantes(
        [con({ cotejo: { regimen: 'fuente-unica' }, confirmadoDeOido: undefined, fuenteLetra: [FICHA_CIFRA] })],
        'opciones',
        INDICE,
      ),
    BancoInvalido,
  );
  // Con confirmacion de oido le corresponde el regimen fuerte, no el debil.
  assert.throws(
    () =>
      verificarInvariantes(
        [con({ cotejo: { regimen: 'fuente-unica', decision: 'D-25' }, fuenteLetra: [FICHA_CIFRA] })],
        'opciones',
        INDICE,
      ),
    BancoInvalido,
  );
});

test('CTR-04: en `borrador` no se le pide respaldo a nadie', () => {
  // El banco candidato entero vive acá: 1.784 versos esperando.
  const borrador = con({ confirmadoDeOido: undefined, cotejo: undefined, estado: 'borrador' });
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
});

/**
 * `n2` (`CTR-04.14`): **el contexto sigue al nivel, exacto.** Hasta v2 este test afirmaba lo
 * contrario —que un Fácil con un verso de cada lado pasaba— porque el build medía un tope y
 * el schema, el número exacto. Con el acople de `BR-30` (*"no hay forma de que un ítem Fácil
 * muestre menos de 2+2 versos"*) esa diferencia deja de ser tolerable: el Fácil es la puerta
 * del que llega sin saber nada, y un Fácil flaco es un molinete a medio abrir.
 */
test('n2: BR-03 pide exactamente los versos de su nivel, ni uno menos', () => {
  const facilConUnoYUno = con({ dificultad: 'facil', contexto: { antes: ['uno'], despues: ['dos'] } });
  assert.throws(() => verificarInvariantes([facilConUnoYUno], 'opciones', INDICE), /BR-03 pide exactamente 2/);

  const mediaConCeroYUno = con({ dificultad: 'media', contexto: { antes: [], despues: ['uno'] } });
  assert.throws(() => verificarInvariantes([mediaConCeroYUno], 'opciones', INDICE), /BR-03 pide exactamente 1/);

  // Los controles: sin ellos, el rojo de arriba podría ser cualquier otra regla.
  const facilCompleto = con({ dificultad: 'facil', contexto: { antes: ['a', 'b'], despues: ['c', 'd'] } });
  assert.doesNotThrow(() => verificarInvariantes([facilCompleto], 'opciones', INDICE));
  const mediaCompleta = con({ dificultad: 'media', contexto: { antes: ['a'], despues: ['b'] } });
  assert.doesNotThrow(() => verificarInvariantes([mediaCompleta], 'opciones', INDICE));
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

test('CTR-04.14: de dónde salió el nivel no viaja al cliente, igual que en US-07', () => {
  // `dificultadSegun` y el `conteo` del envoltorio son de generación. Si una pantalla un día
  // muestra el nivel, lo decide `experiencia` y este test se cambia a propósito, no de rebote.
  const payload = aPayload(con({ dificultadSegun: 'sin-conteo' })) as unknown as Record<string, unknown>;
  assert.equal('dificultadSegun' in payload, false, 'dificultadSegun llegó al cliente');
  assert.ok(!JSON.stringify(payload).includes('sin-conteo'));
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

test('US-03: el banco real cumple su piso, y cada jugable declara su vía', () => {
  // Hasta el ciclo 9 este test afirmaba que el banco cargaba vacío — era la época en que
  // ningún verso podía llegar a `listo`. `D-25` abrió la tercera vía y `T-138` eligió los
  // versos; lo que ahora protege este test es el piso de `US-03` (15) y el RASTRO: que
  // ningún ítem llegue al jugador sin decir por qué vía está listo, ni sin su fuente.
  const items = cargarBanco(CRUDO, INDICE);
  assert.ok(items.length >= 15, `el piso de US-03 es 15 y el banco jugable tiene ${items.length}`);
  for (const it of items) {
    assert.ok(it.fuenteLetra.length >= 1, `${it.id}: viaja sin fuente de letra`);
    assert.ok(it.cotejoRegimen, `${it.id}: viaja sin regimen de cotejo`);
  }
  assert.equal(CRUDO.modoRespuesta, 'opciones');
  assert.equal(CRUDO.contrato, 'CTR-04');
  assert.equal(CRUDO.contratoVersion, 3);
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

// ================================================================ CTR-04 v3 (T-288, D-46)

type ConteoDelArchivo = ConteoCitado & { readonly ficha: string };
/** El banco v3: `conteo` es obligatorio en el tipo, pero un caso en rojo lo puede borrar. */
type BancoV3 = BancoCrudo;

const CONTEO = (JSON.parse(readFileSync('src/data/setlistfm.json', 'utf-8')) as { conteo: ConteoDelArchivo }).conteo;
const CANCIONERO = JSON.parse(readFileSync('src/data/cancionero.json', 'utf-8')) as {
  temas: (TemaConSecciones & { slug: string })[];
};
const BANCO = CRUDO as BancoV3;

/** Una copia que se puede tocar sin ensuciar la de los demás tests. */
const copia = (): BancoV3 => structuredClone(BANCO);
/** Para los casos en rojo, que escriben campos que el tipo declara de solo lectura. */
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
const tocable = (it: ItemCrudo): Mutable<ItemCrudo> => it as Mutable<ItemCrudo>;

// ---------------------------------------------------------------- n1

/**
 * Lo que distingue un banco al día de uno viejo o tocado a mano. Lista vacía = el banco es
 * exactamente lo que da la regla con el conteo vigente. Es la misma forma que `t14` de
 * `US-07` (`CTR-19.13`): la regla no se reescribe acá, se **llama**.
 */
function problemasDelBanco(banco: BancoV3, conteo: ConteoDelArchivo): string[] {
  const problemas: string[] = [];
  const correr = ' Corré `npm run generar-letra`.';

  if (banco.conteo?.ficha !== conteo.ficha || banco.conteo?.consultado !== conteo.consultado) {
    problemas.push(
      `el banco se calculó con el conteo ${banco.conteo?.ficha} del ${banco.conteo?.consultado}, ` +
        `y el vigente es ${conteo.ficha} del ${conteo.consultado}.${correr}`,
    );
  }

  const vivos = banco.items.filter((i) => i.estado !== 'retirado');
  const regla = repartirEnTercios(new Set(vivos.map((i) => i.tema.slug)), conteo);
  const sinConteo = new Set(regla.sinConteo);
  for (const i of vivos) {
    const debe = regla.porSlug.get(i.tema.slug);
    if (i.dificultad !== debe) {
      problemas.push(`${i.id} («${i.tema.titulo}») está en ${i.dificultad} y la regla de CTR-19.15 dice ${debe}.${correr}`);
    }
    const segun = sinConteo.has(i.tema.slug) ? 'sin-conteo' : 'en-vivo';
    if (i.dificultadSegun !== segun) {
      problemas.push(`${i.id} («${i.tema.titulo}») dice ${i.dificultadSegun} y tendría que decir ${segun}.${correr}`);
    }
  }
  return problemas;
}

test('n1: el nivel de cada ítem es el de su tema, con el conteo vigente', () => {
  const problemas = problemasDelBanco(BANCO, CONTEO);
  assert.deepEqual(problemas.slice(0, 10), [], `${problemas.length} problema(s):\n${problemas.slice(0, 10).join('\n')}`);
});

test('n1: todos los ítems de un mismo tema tienen el mismo nivel', () => {
  // Es consecuencia de la regla, pero dicho aparte se lee sin saber qué hace repartirEnTercios.
  const porTema = new Map<string, Set<string>>();
  for (const i of BANCO.items) {
    const s = porTema.get(i.tema.slug) ?? new Set<string>();
    s.add(i.dificultad);
    porTema.set(i.tema.slug, s);
  }
  const mezclados = [...porTema].filter(([, s]) => s.size > 1).map(([slug, s]) => `${slug}: ${[...s].join('/')}`);
  assert.deepEqual(mezclados, []);
});

test('n1 en rojo (a): un conteo refrescado sin regenerar el banco', () => {
  const nuevo = { ...CONTEO, ficha: 'RES-99', consultado: '2027-03-24' };
  const dice = problemasDelBanco(BANCO, nuevo).join('\n');
  assert.match(dice, /el vigente es RES-99 del 2027-03-24/);
  assert.match(dice, /npm run generar-letra/);
});

test('n1 en rojo (b): un nivel tocado a mano en un solo ítem da un problema, y lo nombra', () => {
  const b = copia();
  const tocado = tocable(b.items.find((i) => i.dificultad === 'dificil')!);
  tocado.dificultad = 'facil';
  const dice = problemasDelBanco(b, CONTEO);
  assert.equal(dice.length, 1, dice.join('\n'));
  assert.match(dice[0]!, new RegExp(`^${tocado.id} .* está en facil`));
});

test('n1 en rojo (c): un tema Fácil que pierde su línea en el conteo pasa a dificil y sin-conteo', () => {
  const facil = BANCO.items.find((i) => i.dificultad === 'facil')!;
  const sinLinea = { ...CONTEO, temas: CONTEO.temas.filter((l) => l.slug !== facil.tema.slug) };
  const dice = problemasDelBanco(BANCO, sinLinea).join('\n');
  assert.match(dice, new RegExp(`${facil.id} .* está en facil y la regla de CTR-19.15 dice dificil`));
  assert.match(dice, new RegExp(`${facil.id} .* dice en-vivo y tendría que decir sin-conteo`));
});

// ---------------------------------------------------------------- n3

/** Los versos de cada tema del cancionero, con la misma función que usa el generador. */
const VERSOS = new Map(CANCIONERO.temas.map((t) => [t.slug, versosDelTema(t)]));
const sinEspacios = (s: string): string => s.replace(/\s+/g, '');

/**
 * `n3`: el contexto de cada ítem son los vecinos de su verso en la lista del tema. Busca una
 * posición donde los N anteriores sean `contexto.antes`, el verso sea el del hueco y los N
 * posteriores sean `contexto.despues`. El verso se compara sin espacios: la puntuación que
 * colgaba de la respuesta pasó a `despues` con un espacio que el verso no tenía.
 */
function problemasDeVecinos(items: readonly ItemCrudo[]): string[] {
  const problemas: string[] = [];
  for (const it of items) {
    const n = CONTEXTO_POR_NIVEL[it.dificultad];
    if (n === 0) continue;
    const versos = VERSOS.get(it.tema.slug);
    if (!versos) {
      problemas.push(`${it.id}: el tema ${it.tema.slug} no está en el cancionero`);
      continue;
    }
    const verso = sinEspacios(`${it.hueco.antes}${it.hueco.respuesta}${it.hueco.despues}`);
    const esta = versos.some((v, p) => {
      if (sinEspacios(v) !== verso) return false;
      const ctx = vecinos(versos, p, n);
      return (
        ctx !== null &&
        JSON.stringify(ctx.antes) === JSON.stringify(it.contexto.antes) &&
        JSON.stringify(ctx.despues) === JSON.stringify(it.contexto.despues)
      );
    });
    if (!esta) {
      problemas.push(`${it.id} (${it.dificultad}, ${it.tema.slug}): su contexto no son los ${n} vecinos del verso en el tema`);
    }
  }
  return problemas;
}

test('n3: el contexto de cada jugable son los vecinos de su verso en el tema', () => {
  const listos = BANCO.items.filter((i) => i.estado === 'listo');
  assert.ok(listos.some((i) => i.dificultad !== 'dificil'), 'sin un solo jugable con contexto, n3 no prueba nada');
  assert.deepEqual(problemasDeVecinos(listos), []);
});

test('n3: y los de todo el banco, borradores incluidos', () => {
  // Los borradores son los que `contenido` va a promover: si salen mal cortados, el día que
  // se elijan llegan mal cortados a la pantalla.
  const problemas = problemasDeVecinos(BANCO.items);
  assert.deepEqual(problemas.slice(0, 10), [], `${problemas.length} problema(s)`);
});

test('n3 en rojo: un jugable con un verso de contexto cambiado por otro del mismo tema', () => {
  const b = copia();
  const it = tocable(b.items.find((i) => i.estado === 'listo' && i.dificultad !== 'dificil')!);
  const versos = VERSOS.get(it.tema.slug)!;
  const otro = versos.find((v) => !it.contexto.antes.includes(v) && !it.contexto.despues.includes(v))!;
  it.contexto = { antes: [otro, ...it.contexto.antes.slice(1)], despues: it.contexto.despues };
  assert.equal(problemasDeVecinos([it]).length, 1);
});

test('vecinos: sin N de cada lado no hay ítem, ni se baja de nivel ni se rellena', () => {
  const v = ['a', 'b', 'c', 'd', 'e'];
  assert.deepEqual(vecinos(v, 2, 2), { antes: ['a', 'b'], despues: ['d', 'e'] });
  assert.equal(vecinos(v, 1, 2), null);
  assert.equal(vecinos(v, 3, 2), null);
  assert.deepEqual(vecinos(v, 0, 0), { antes: [], despues: [] });
});

// ---------------------------------------------------------------- n4

/** El largo de la partida de `US-03`, leído de la isla para no tener dos números. */
const LARGO_RONDA = Number(/const LARGO_RONDA = (\d+);/.exec(readFileSync('src/scripts/partida-letra.ts', 'utf-8'))?.[1]);
/** La cuota de Fáciles de `US-03` (`PRD-alcance-v1.md`, "Piso de ítems"). */
const CUOTA_FACILES = 4;

/** Azar con semilla (mulberry32): cientos de partidas sin depender de la suerte. */
function conSemilla(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Lo que `BR-01` le pide a una partida: abre con Fácil y no baja. */
function problemasDeLaRonda(ronda: readonly { dificultad: string }[]): string[] {
  const p: string[] = [];
  if (ronda[0]?.dificultad !== 'facil') p.push(`abrió con ${ronda[0]?.dificultad}`);
  for (let k = 1; k < ronda.length; k++) {
    if (ORDEN_DIFICULTAD[ronda[k]!.dificultad]! < ORDEN_DIFICULTAD[ronda[k - 1]!.dificultad]!) {
      p.push(`bajó de ${ronda[k - 1]!.dificultad} a ${ronda[k]!.dificultad} en el puesto ${k + 1}`);
    }
  }
  return p;
}

const jugables = (items: readonly Item[]): readonly (Item & Jugable)[] => items as readonly (Item & Jugable)[];

test('n4: BR-01 punto 3, hay al menos 4 Fáciles jugables (la cuota de US-03)', () => {
  const faciles = cargarBanco(CRUDO, INDICE).filter((i) => i.dificultad === 'facil');
  assert.ok(
    faciles.length >= CUOTA_FACILES,
    `hay ${faciles.length} Fáciles jugables y la cuota de US-03 es ${CUOTA_FACILES}. El banco no está roto, está ` +
      'incompleto: es trabajo de contenido cargar huecos de temas del tercio de arriba (BR-30).',
  );
});

test('n4: BR-01 puntos 1 y 2, quinientas partidas con el banco real abren en Fácil y no bajan', () => {
  assert.equal(LARGO_RONDA, 8, 'la isla cambió el largo de la partida: revisá este test');
  const banco = jugables(cargarBanco(CRUDO, INDICE));
  const azar = conSemilla(288);
  for (let i = 0; i < 500; i++) {
    const ronda: readonly (Item & Jugable)[] = armarRonda(banco, Math.min(LARGO_RONDA, banco.length), azar);
    assert.deepEqual(problemasDeLaRonda(ronda), [], `la partida ${i}: ${ronda.map((r) => r.dificultad).join(' ')}`);
  }
});

test('n4 en rojo: un banco sin ningún Fácil jugable no abre la partida', () => {
  const b = copia();
  for (const it of b.items) {
    if (it.estado === 'listo' && it.dificultad === 'facil') {
      Object.assign(tocable(it), {
        dificultad: 'media',
        contexto: { antes: it.contexto.antes.slice(-1), despues: it.contexto.despues.slice(0, 1) },
      });
    }
  }
  const banco = jugables(cargarBanco(b, INDICE));
  assert.throws(() => armarRonda(banco, Math.min(LARGO_RONDA, banco.length), conSemilla(1)), RondaImposible);
  // Y la vara de la partida nombra lo que está mal cuando abre en otra cosa o baja.
  assert.match(problemasDeLaRonda([{ dificultad: 'media' }]).join('\n'), /abrió con media/);
  assert.match(
    problemasDeLaRonda([{ dificultad: 'facil' }, { dificultad: 'dificil' }, { dificultad: 'media' }]).join('\n'),
    /bajó de dificil a media/,
  );
});

// ---------------------------------------------------------------- el schema v3 (c0..c9)

function validador() {
  const Ctor = ((Ajv2020 as unknown as { default?: unknown }).default ?? Ajv2020) as new (o: object) => {
    compile: (s: unknown) => ((d: unknown) => boolean) & {
      errors?: readonly { instancePath: string; message?: string }[] | null;
    };
  };
  return new Ctor({ allErrors: true, strict: false });
}

const validarBanco = validador().compile(JSON.parse(readFileSync('src/data/_schema/letra.schema.json', 'utf-8')));

function errores(instancia: unknown): readonly string[] {
  if (validarBanco(instancia)) return [];
  return (validarBanco.errors ?? []).map((e) => `${e.instancePath} ${e.message ?? ''}`.trim());
}

type Crudo = Record<string, any>;
const v3 = (): Crudo => copia() as unknown as Crudo;
const v2 = (): Crudo => {
  const b = v3();
  b.contratoVersion = 2;
  delete b.conteo;
  for (const it of b.items) delete it.dificultadSegun;
  return b;
};
const de = (b: Crudo, nivel: string): Crudo => b.items.find((x: Crudo) => x.dificultad === nivel);
const con3 = (tocar: (b: Crudo) => void) => (): Crudo => {
  const b = v3();
  tocar(b);
  return b;
};

/** Los diez casos de `CTR-04.14`, "El schema de v2 a v3". `true` = tiene que validar. */
const CASOS: ReadonlyArray<readonly [string, () => Crudo, boolean]> = [
  ['c0 un banco v2, sin conteo ni dificultadSegun', v2, false],
  ['c1 control: el mismo banco en v3', v3, true],
  ['c2 sin-conteo con facil', con3((b) => (de(b, 'facil').dificultadSegun = 'sin-conteo')), false],
  ['c3 control: sin-conteo con dificil', con3((b) => (de(b, 'dificil').dificultadSegun = 'sin-conteo')), true],
  ['c4 v3 sin conteo', con3((b) => delete b.conteo), false],
  ['c5 conteo.ficha sin la forma RES-', con3((b) => (b.conteo.ficha = '90')), false],
  ['c6 un ítem sin dificultadSegun', con3((b) => delete b.items[0].dificultadSegun), false],
  ['c7 dificultadSegun curaduria', con3((b) => (b.items[0].dificultadSegun = 'curaduria')), false],
  ['c8 contratoVersion 2 con todo lo demás de v3', con3((b) => (b.contratoVersion = 2)), false],
  [
    'c9 facil con un verso de contexto de cada lado',
    con3((b) => {
      const f = de(b, 'facil');
      f.contexto = { antes: f.contexto.antes.slice(-1), despues: f.contexto.despues.slice(0, 1) };
    }),
    false,
  ],
];

for (const [nombre, armar, valida] of CASOS) {
  test(`schema v3: ${nombre} ${valida ? 'valida' : 'no valida'}`, () => {
    const e = errores(armar());
    if (valida) assert.deepEqual(e, [], e.join('\n'));
    else assert.notDeepEqual(e, [], `${nombre}: el schema lo dejó pasar`);
  });
}
