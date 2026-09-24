/**
 * `CTR-19` pieza 1: el conteo que el sitio cita de setlist.fm, y las dos reglas de
 * dificultad que salen de él (`D-45` enmendada, `BR-18` apartado h, `D-46`, `BR-30`): el
 * corte de 8 Fáciles de `US-02` y los tercios de `US-07`.
 *
 * Son los t1 a t9, t13 y t15 de `CTR-19.13`, más la validación de `setlistfm.json` contra su
 * schema y los casos c1 a c13 y c28 a c32 del schema. **Esos últimos viven acá y no en
 * `esquemas.test.ts`** porque ese archivo lo toca otra tarea cada ráfaga; la línea
 * `'setlistfm'` de su lista se suma cuando se libere, y estos casos se pueden mudar con ella.
 * t14 —que el banco de `US-07` sea el que da la regla— vive con el banco, en
 * `src/lib/por-la-letra/banco.test.ts`.
 *
 * Todo lo que es una regla que existe para que algo **no** pase tiene su caso en rojo al
 * lado, armado sobre un dato inventado. Una guarda que nunca se vio en rojo no es una guarda.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import {
  repartirEnVivo,
  repartirEnTercios,
  problemasDelConteo,
  diasEntre,
  CUOTA_FACILES,
  type ConteoCitado,
  type LineaCitada,
} from './en-vivo.ts';
import { resolverTema } from './letra/temas.ts';
import { slugDeTitulo } from './texto.ts';

// ---------------------------------------------------------------- insumos

interface ArchivoCitado {
  conteo: ConteoCitado & { vigenciaDias: number; ficha: string; setlistsCargados: number };
  indice?: Record<string, unknown>[];
}

const leerJson = <T>(ruta: string): T => JSON.parse(readFileSync(ruta, 'utf-8')) as T;

const CITADO = leerJson<ArchivoCitado>('src/data/setlistfm.json');
const CONTEO = CITADO.conteo;

/** El pozo con fragmento de audio, que es sobre lo que se corta (`CTR-19.5`). */
const POZO: ReadonlySet<string> = new Set(
  leerJson<{ fragmentos: { slug: string }[] }>('src/data/adivinar-tema.json').fragmentos.map((f) => f.slug),
);

/** La puerta de `D-13`, en la forma que `problemasDelConteo` la pide. */
const resolver = (titulo: string): string | null => {
  const r = resolverTema(titulo);
  return r ? slugDeTitulo(r.titulo) : null;
};

/** Hoy, en la zona del proyecto. Se toma una vez para que dos tests no vean días distintos. */
const HOY = new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------- el schema (c1..c13)

function validador() {
  const Ctor = ((Ajv2020 as unknown as { default?: unknown }).default ?? Ajv2020) as new (o: object) => {
    compile: (s: unknown) => ((d: unknown) => boolean) & {
      errors?: readonly { instancePath: string; message?: string }[] | null;
    };
  };
  return new Ctor({ allErrors: true, strict: false });
}

const validarCitado = validador().compile(leerJson('src/data/_schema/setlistfm.schema.json'));

function errores(instancia: unknown): readonly string[] {
  if (validarCitado(instancia)) return [];
  return (validarCitado.errors ?? []).map((e) => `${e.instancePath} ${e.message ?? ''}`.trim());
}

/** Una copia profunda del archivo real, para tocarla en un solo campo. */
const copia = (): Record<string, any> => structuredClone(CITADO) as unknown as Record<string, any>;

test('setlistfm.json valida contra su schema (y c1: el ejemplo de CTR-19.12 valida)', () => {
  const e = errores(CITADO);
  assert.deepEqual(e, [], `setlistfm.json rompe su contrato:\n${e.join('\n')}`);
});

const CASOS_EN_ROJO: ReadonlyArray<readonly [string, (d: Record<string, any>) => void]> = [
  ['c2: línea sin veces', (d) => delete d.conteo.temas[0].veces],
  ['c3: veces 0', (d) => (d.conteo.temas[0].veces = 0)],
  ['c4: línea con slug y fuera a la vez', (d) => (d.conteo.temas[0].fuera = 'inedito')],
  ['c5: línea sin slug y sin fuera', (d) => delete d.conteo.temas[0].slug],
  ['c6: sin-identificar sin nota', (d) => (d.conteo.temas[3] = { titulo: 'X', veces: 80, fuera: 'sin-identificar' })],
  ['c7: línea con puesto (es un derivado)', (d) => (d.conteo.temas[0].puesto = 1)],
  ['c8: línea con vistas (es otra plataforma)', (d) => (d.conteo.temas[0].vistas = 1000)],
  ['c9: fuente youtube', (d) => (d.fuente = 'youtube')],
  ['c10: conteo sin consultado', (d) => delete d.conteo.consultado],
  ['c11: pagina que no es /stats/', (d) => (d.conteo.pagina = 'https://www.setlist.fm/setlists/x.html')],
  ['c12: enlace del índice con temas (la regla de la enmienda)', (d) => (d.indice[0].temas = ['Jijiji'])],
  ['c13: enlace con URL que no es de setlist.fm', (d) => (d.indice[0].url = 'https://example.org/setlist/a/1993/b.html')],
  // c29..c32: la grafía (`CTR-19.2`, enmienda del 2026-09-24). Se tocan sobre una línea
  // grafiaDe real del archivo, para que el control en verde (c28) sea el mismo dato sin tocar.
  ['c29: grafiaDe sin nota', (d) => delete grafiaReal(d).nota],
  ['c30: grafiaDe y slug a la vez', (d) => (grafiaReal(d).slug = 'mariposa-pontiac-rock-del-pais')],
  ['c31: grafiaDe y fuera a la vez', (d) => (grafiaReal(d).fuera = 'sin-identificar')],
  ['c32: grafiaDe que no tiene forma de slug', (d) => (grafiaReal(d).grafiaDe = 'Mariposa Pontiac')],
];

/** La primera línea `grafiaDe` del archivo (hoy, *Rock del país*). */
function grafiaReal(d: Record<string, any>): Record<string, any> {
  const l = (d.conteo.temas as Record<string, any>[]).find((x) => x.grafiaDe !== undefined);
  assert.ok(l, 'setlistfm.json no tiene ninguna línea grafiaDe: c28 a c32 no prueban nada');
  return l;
}

test('c28: una línea grafiaDe con nota valida (el control en verde de c29 a c32)', () => {
  const d = copia();
  grafiaReal(d);
  assert.deepEqual(errores(d), []);
});

for (const [nombre, tocar] of CASOS_EN_ROJO) {
  test(`el schema de la pieza 1 rechaza ${nombre}`, () => {
    const d = copia();
    tocar(d);
    assert.notDeepEqual(errores(d), [], `${nombre}: el schema lo dejó pasar`);
  });
}

test('control de los casos en rojo: la copia sin tocar valida (si no, el rojo no prueba nada)', () => {
  assert.deepEqual(errores(copia()), []);
});

// ---------------------------------------------------------------- t1..t4, sobre el dato real

test('t1-t3: cada línea cruza por la puerta de D-13, sin desorden ni grafías sumadas', () => {
  const problemas = problemasDelConteo(CONTEO, resolver);
  assert.deepEqual(problemas, [], `el conteo citado tiene problemas:\n${problemas.join('\n')}`);
});

test('t1 en rojo: un título fuera de los 105 no suma al conteo, y el test lo nombra', () => {
  // Una demo de 1982 guardada con un slug como si fuera del catálogo.
  const malo: ConteoCitado = {
    ...CONTEO,
    temas: [...CONTEO.temas.slice(0, 3), { titulo: 'Un tal Brigitte Bardot', veces: 80, slug: 'un-tal-brigitte-bardot' }],
  };
  const problemas = problemasDelConteo(malo, resolver);
  assert.equal(problemas.length, 1, problemas.join('\n'));
  assert.match(problemas[0]!, /Un tal Brigitte Bardot/);
  assert.match(problemas[0]!, /no suma al conteo/);

  // Y en el corte no suma nada: su slug no es del pozo, así que no ocupa un lugar.
  const corte = repartirEnVivo(POZO, malo, 3);
  assert.equal(corte.porSlug.has('un-tal-brigitte-bardot'), false);
  assert.equal(corte.conConteo, 3);
});

test('t1 en rojo: una línea fuera que empezó a resolver también se nombra', () => {
  const malo: ConteoCitado = { ...CONTEO, temas: [{ titulo: 'Jijiji', veces: 101, fuera: 'sin-identificar' }] };
  assert.match(problemasDelConteo(malo, resolver).join('\n'), /«Jijiji» está marcado fuera/);
});

test('t1 en rojo: una grafía que la puerta de D-13 no manda a su tema se nombra', () => {
  // La puerta dice que «Rock del país» es Mariposa Pontiac; el dato dice que es otro tema.
  const malo: ConteoCitado = {
    ...CONTEO,
    temas: CONTEO.temas.map((l) => (l.titulo === 'Rock del país' ? { ...l, grafiaDe: 'jijiji' } : l)),
  };
  assert.match(
    problemasDelConteo(malo, resolver).join('\n'),
    /«Rock del país» es grafía de "jijiji" y la puerta de D-13 dice "mariposa-pontiac-rock-del-pais"/,
  );
});

test('t1 en rojo: una grafía de un tema sin línea propia, o con más veces que ella, se nombra', () => {
  const sinTema: ConteoCitado = {
    ...CONTEO,
    temas: CONTEO.temas.filter((l) => l.slug !== 'mariposa-pontiac-rock-del-pais'),
  };
  assert.match(problemasDelConteo(sinTema, resolver).join('\n'), /ninguna línea cuenta ese tema con su slug/);

  // La grafía que más figura tiene que ser la que lleva el slug: la suma sería un máximo.
  const alReves: ConteoCitado = sintetico([
    { titulo: 'Rock del país', veces: 50, grafiaDe: 'mariposa-pontiac-rock-del-pais', nota: 'grafía de prueba' },
    { titulo: 'Mariposa Pontiac', veces: 43, slug: 'mariposa-pontiac-rock-del-pais' },
  ]);
  assert.match(problemasDelConteo(alReves, resolver).join('\n'), /el slug va en la de más veces/);

  // El control: las tres formas reales, como están en el archivo, no dan ningún problema.
  const reales = CONTEO.temas.filter((l) => (l.slug ?? l.grafiaDe) === 'mariposa-pontiac-rock-del-pais');
  assert.equal(reales.length, 3, 'Mariposa Pontiac figura de tres formas (RES-91)');
  assert.deepEqual(problemasDelConteo(sintetico(reales), resolver), []);
});

test('t2 en rojo: la transcripción que desordena la página se nombra', () => {
  const [a, b] = CONTEO.temas as [LineaCitada, LineaCitada];
  const malo: ConteoCitado = { ...CONTEO, temas: [b, a] };
  assert.match(problemasDelConteo(malo, resolver).join('\n'), /desordenó la página/);
});

test('t3 en rojo: dos grafías del mismo tema no se suman, se nombran', () => {
  const malo: ConteoCitado = {
    ...CONTEO,
    temas: [
      { titulo: 'Jijiji', veces: 101, slug: 'jijiji' },
      { titulo: 'Ji ji ji', veces: 20, slug: 'jijiji' },
    ],
  };
  const dice = problemasDelConteo(malo, resolver).join('\n');
  assert.match(dice, /«Jijiji» y «Ji ji ji» son el mismo tema/);
  assert.match(dice, /La de menos veces pasa a grafiaDe con una nota/);
});

test('t4: el conteo no está vencido (CTR-19.6)', () => {
  const edad = diasEntre(CONTEO.consultado, HOY);
  assert.ok(edad >= 0, `la fecha de consulta ${CONTEO.consultado} está en el futuro`);
  assert.ok(
    edad <= CITADO.conteo.vigenciaDias,
    `el conteo tiene ${edad} días y vale ${CITADO.conteo.vigenciaDias}: ` +
      'hace falta una ficha RES nueva con la página releída, y reescribir el bloque entero',
  );
});

test('t4 sabe medir: 180 días exactos entre dos fechas conocidas', () => {
  assert.equal(diasEntre('2026-09-22', '2027-03-21'), 180);
  assert.equal(diasEntre('2026-09-22', '2026-09-22'), 0);
});

// ---------------------------------------------------------------- t5, el corte real

test('t5: con el pozo real, el corte queda determinado en 8 Fáciles (BR-18 h, abre BR-28)', () => {
  const corte = repartirEnVivo(POZO, CONTEO);
  assert.equal(corte.determinado, true, `el corte no quedó determinado: ${corte.motivo}`);
  assert.equal(corte.faciles, CUOTA_FACILES);
  const faciles = [...corte.porSlug].filter(([, n]) => n === 'facil').map(([s]) => s);
  assert.equal(faciles.length, 8);
  // Todos están en el pozo con fragmento y en el conteo.
  const conSlug = new Set(CONTEO.temas.map((l) => l.slug));
  for (const s of faciles) {
    assert.ok(POZO.has(s), `${s} es Fácil y no tiene fragmento`);
    assert.ok(conSlug.has(s), `${s} es Fácil y no figura en el conteo`);
  }
});

// ---------------------------------------------------------------- t6, t7, sintéticos

/** Un conteo inventado: una línea por slug, en el orden dado. */
function sintetico(lineas: readonly LineaCitada[], completo = true): ConteoCitado {
  return { pagina: 'https://www.setlist.fm/stats/prueba.html', consultado: '2026-09-22', completo, temas: lineas };
}
const L = (slug: string, veces: number): LineaCitada => ({ titulo: slug.toUpperCase(), veces, slug });
const DIEZ = Array.from({ length: 10 }, (_, i) => `t${i + 1}`);
const POZO_DIEZ = new Set(DIEZ);

test('t6: un empate en el borde 8/9 deja 7 Fáciles y el motivo nombra a los dos', () => {
  const veces = [100, 90, 80, 70, 60, 50, 40, 30, 30, 10];
  const corte = repartirEnVivo(POZO_DIEZ, sintetico(DIEZ.map((s, i) => L(s, veces[i]!))));
  assert.equal(corte.faciles, 7);
  assert.equal(corte.determinado, false);
  assert.match(corte.motivo!, /T8 \(30\) empata con T9 \(30\) en el puesto 8/);
  // El azar no decide: ninguno de los dos empatados es Fácil.
  assert.equal(corte.porSlug.get('t8'), 'media');
  assert.equal(corte.porSlug.get('t9'), 'media');
});

test('t6: con la página en top (completo false) y el octavo igual a la última línea, no queda determinado', () => {
  const lineas = [...DIEZ.slice(0, 8).map((s, i) => L(s, 100 - i * 5)), { titulo: 'Otro', veces: 65, fuera: 'inedito' }];
  // El octavo tiene 65 y la última línea publicada también: un tema que no figura podría tener 65.
  const corte = repartirEnVivo(POZO_DIEZ, sintetico(lineas, false));
  assert.equal(corte.determinado, false);
  assert.equal(corte.faciles, 7);
  assert.match(corte.motivo!, /no supera a la última línea publicada \(65\)/);
  // El control: la misma página declarada completa sí queda determinada.
  assert.equal(repartirEnVivo(POZO_DIEZ, sintetico(lineas, true)).determinado, true);
});

test('t6: un sin-identificar arriba del corte lo deja sin determinar', () => {
  const lineas: LineaCitada[] = [
    { titulo: 'Raro', veces: 70, fuera: 'sin-identificar' },
    ...DIEZ.map((s, i) => L(s, 100 - i * 5)),
  ];
  // Ordenado por veces, "Raro" (70) queda en el medio de la página. El octavo del pozo
  // tiene 65: "Raro" podría ser un tema del pozo publicado con otro nombre, arriba de él.
  lineas.sort((a, b) => b.veces - a.veces);
  const corte = repartirEnVivo(POZO_DIEZ, sintetico(lineas));
  assert.equal(corte.determinado, false);
  assert.equal(corte.faciles, 6, 'el sexto (75) es el último que supera a Raro (70)');
  assert.match(corte.motivo!, /«Raro» \(sin identificar\) figura 70 veces, arriba del corte/);
  // El control: el mismo "Raro" debajo del octavo no mueve nada.
  const abajo = lineas.map((l) => (l.titulo === 'Raro' ? { ...l, veces: 60 } : l)).sort((a, b) => b.veces - a.veces);
  assert.equal(repartirEnVivo(POZO_DIEZ, sintetico(abajo)).determinado, true);
});

test('t6: con menos temas del pozo que la cuota, lo dice con los dos números', () => {
  const corte = repartirEnVivo(POZO_DIEZ, sintetico(DIEZ.slice(0, 6).map((s, i) => L(s, 100 - i))));
  assert.equal(corte.faciles, 6);
  assert.equal(corte.motivo, 'hay 6 temas del pozo con conteo y la cuota es 8');
});

test('t7: lo de afuera no suma: un inédito con el conteo más alto no entra', () => {
  const lineas: LineaCitada[] = [
    { titulo: 'Un tal Brigitte Bardot', veces: 500, fuera: 'inedito' },
    ...DIEZ.map((s, i) => L(s, 100 - i * 5)),
  ];
  const corte = repartirEnVivo(POZO_DIEZ, sintetico(lineas));
  assert.equal(corte.determinado, true);
  assert.deepEqual(
    [...corte.porSlug].filter(([, n]) => n === 'facil').map(([s]) => s),
    DIEZ.slice(0, 8),
  );
});

test('t7: un slug del catálogo sin fragmento no ocupa un lugar de Fácil', () => {
  const lineas = [L('sin-audio', 999), ...DIEZ.map((s, i) => L(s, 100 - i * 5))];
  const corte = repartirEnVivo(POZO_DIEZ, sintetico(lineas));
  assert.equal(corte.porSlug.has('sin-audio'), false);
  assert.equal(corte.faciles, 8);
  assert.equal(corte.porSlug.get('t8'), 'facil');
  assert.equal(corte.porSlug.get('t9'), 'media');
});

test('sin conteo, todo el pozo es Difícil y lo dice', () => {
  const corte = repartirEnVivo(POZO_DIEZ, null);
  assert.equal(corte.faciles, 0);
  assert.equal(corte.motivo, 'sin conteo');
  assert.ok([...corte.porSlug.values()].every((n) => n === 'dificil'));
});

test('paso 1 de CTR-19.5: las líneas desordenadas dan el mismo corte que ordenadas', () => {
  const veces = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
  const ordenadas = DIEZ.map((s, i) => L(s, veces[i]!));
  // Al revés: el que figura 10 veces llega primero. Sin ordenar, entraría como Fácil.
  const desordenadas = [...ordenadas].reverse();
  const bien = repartirEnVivo(POZO_DIEZ, sintetico(ordenadas));
  const mal = repartirEnVivo(POZO_DIEZ, sintetico(desordenadas));
  assert.deepEqual([...mal.porSlug].sort(), [...bien.porSlug].sort());
  assert.equal(mal.porSlug.get('t10'), 'media');
  assert.equal(mal.porSlug.get('t1'), 'facil');
  assert.equal(mal.determinado, true);
});

// ---------------------------------------------------------------- t13, los tercios de US-07

/** Los niveles de un reparto en tercios, en el orden de los slugs dados. */
const nivelesDe = (t: ReturnType<typeof repartirEnTercios>, slugs: readonly string[]) =>
  slugs.map((s) => t.porSlug.get(s));
const SEIS = ['a', 'b', 'c', 'd', 'e', 'f'];

test('t13: seis temas con conteos distintos dan 2 / 2 / 2, el más tocado arriba', () => {
  const t = repartirEnTercios(new Set(SEIS), sintetico(SEIS.map((s, i) => L(s, 60 - i * 10))));
  assert.deepEqual(nivelesDe(t, SEIS), ['facil', 'facil', 'media', 'media', 'dificil', 'dificil']);
  assert.deepEqual(t.porNivel, { facil: 2, media: 2, dificil: 2 });
  assert.equal(t.conConteo, 6);
  assert.deepEqual(t.sinConteo, []);
});

test('t13: un tema sin línea es dificil y no ocupa lugar en los tercios', () => {
  // Siete en el pozo, seis con línea: t sigue siendo 2. Si «g» contara, t sería 3 y «c» subiría.
  const t = repartirEnTercios(new Set([...SEIS, 'g']), sintetico(SEIS.map((s, i) => L(s, 60 - i * 10))));
  assert.equal(t.porSlug.get('g'), 'dificil');
  assert.deepEqual(t.sinConteo, ['g']);
  assert.equal(t.porSlug.get('c'), 'media');
  assert.deepEqual(t.porNivel, { facil: 2, media: 2, dificil: 3 });
});

test('t13: un empate en el borde baja entero, y no depende del orden del arreglo', () => {
  // b y c empatan en el borde del primer tercio (t = 2): ninguno de los dos es Fácil.
  const lineas = [L('a', 10), L('b', 9), L('c', 9), L('d', 8), L('e', 7), L('f', 6)];
  const t = repartirEnTercios(new Set(SEIS), sintetico(lineas));
  assert.deepEqual(nivelesDe(t, SEIS), ['facil', 'media', 'media', 'media', 'dificil', 'dificil']);
  // El mismo conteo con el empate al revés en el arreglo (el abecedario no mide nada).
  const alReves = repartirEnTercios(new Set(SEIS), sintetico([lineas[0]!, lineas[2]!, lineas[1]!, ...lineas.slice(3)]));
  assert.deepEqual(nivelesDe(alReves, SEIS), nivelesDe(t, SEIS));
  // El control: sin el empate, el segundo sí es Fácil.
  const sinEmpate = repartirEnTercios(new Set(SEIS), sintetico(SEIS.map((s, i) => L(s, 10 - i))));
  assert.equal(sinEmpate.porSlug.get('b'), 'facil');
});

test('t13: todo empatado es todo dificil (ningún tema se tocó más que otro)', () => {
  const t = repartirEnTercios(new Set(SEIS), sintetico(SEIS.map((s) => L(s, 10))));
  assert.deepEqual(t.porNivel, { facil: 0, media: 0, dificil: 6 });
});

test('t13: las líneas grafiaDe, fuera y sin-identificar no entran a los tercios', () => {
  const lineas: LineaCitada[] = [
    { titulo: 'Inédito', veces: 500, fuera: 'inedito' },
    { titulo: 'Raro', veces: 400, fuera: 'sin-identificar', nota: 'de prueba' },
    { titulo: 'A de nuevo', veces: 300, grafiaDe: 'a', nota: 'de prueba' },
    ...SEIS.map((s, i) => L(s, 60 - i * 10)),
  ];
  const t = repartirEnTercios(new Set(SEIS), sintetico(lineas));
  assert.equal(t.conConteo, 6);
  assert.deepEqual(nivelesDe(t, SEIS), ['facil', 'facil', 'media', 'media', 'dificil', 'dificil']);
  assert.equal(t.porSlug.size, 6, 'lo de afuera no entra al pozo');
  // Y un slug del catálogo que no es del pozo tampoco ocupa lugar.
  const conAjeno = repartirEnTercios(new Set(SEIS), sintetico([L('ajeno', 999), ...SEIS.map((s, i) => L(s, 60 - i * 10))]));
  assert.deepEqual(nivelesDe(conAjeno, SEIS), nivelesDe(t, SEIS));
});

test('t13: con la página incompleta, un tema con la cifra de la última línea no queda arriba de uno sin línea', () => {
  // Cuatro con línea (t = 2) y «x» sin línea. «d» figura 5, lo mismo que la última línea
  // publicada: «x» puede tener hasta 5, así que «d» no le puede quedar arriba.
  const pozo = new Set(['a', 'b', 'c', 'd', 'x']);
  const lineas: LineaCitada[] = [L('a', 50), L('b', 40), L('c', 30), L('d', 5), { titulo: 'Otro', veces: 5, fuera: 'cover' }];
  const incompleta = repartirEnTercios(pozo, sintetico(lineas, false));
  assert.equal(incompleta.porSlug.get('d'), 'dificil');
  assert.equal(incompleta.porSlug.get('x'), 'dificil');
  // El control: la misma página declarada completa deja a «d» en Media, arriba de «x».
  assert.equal(repartirEnTercios(pozo, sintetico(lineas, true)).porSlug.get('d'), 'media');
  // Y una línea que supera a la última publicada no se ve afectada.
  assert.equal(incompleta.porSlug.get('c'), 'media');
});

test('t13: sin conteo, todo el pozo es dificil y todos se nombran como sin conteo', () => {
  const t = repartirEnTercios(new Set(SEIS), null);
  assert.deepEqual(t.porNivel, { facil: 0, media: 0, dificil: 6 });
  assert.deepEqual([...t.sinConteo].sort(), SEIS);
  assert.equal(t.conConteo, 0);
});

// ---------------------------------------------------------------- el archivo contra la ficha

/**
 * `CTR-19.13` chequeo 8, puesto en un test: los números del conteo son los del anexo de
 * `RES-90` (`INV-89`), título por título y en su orden, y el índice es el del anexo de
 * `INV-73`, fila por fila. Las fichas son de `investigador` y se leen, no se tocan. Si la
 * ficha cambia, el archivo se reescribe entero desde ella (`CTR-19.6`); si cambia el archivo
 * sin ficha, esto se pone en rojo.
 *
 * *Enmendado el 2026-09-24 (`T-285`): comparaba las 25 líneas del top de `RES-74`.*
 */
const INV_73 = 'Docs/INVESTIGACION/INV-73-recitales-setlistfm.md';
const INV_89 = 'Docs/INVESTIGACION/INV-89-conteo-completo.md';

/**
 * El anexo de `RES-90`: los puestos numerados (`N. Título — veces`, separados por ` · `) y
 * después la cola, que la página publica en 1 sin número (`Título · Título · …`). Devuelve
 * el texto de cada título tal como está en la ficha, aclaración incluida.
 */
function anexoDeLaFicha(md: string): { titulo: string; veces: number }[] {
  const iNum = md.indexOf('**Puestos 1-147');
  const iCola = md.indexOf('**Cola de 1 reproducción');
  const iTitulos = md.indexOf('títulos:**', iCola);
  if (iNum < 0 || iCola < 0 || iTitulos < 0) return [];
  const plano = (t: string) => t.replace(/\s+/g, ' ').trim();
  const numerado = plano(md.slice(md.indexOf('\n', iNum), iCola));
  const cola = plano(md.slice(iTitulos + 'títulos:**'.length)).replace(/\.$/, '');
  const salida = numerado.split(' · ').map((pedazo) => {
    const m = /^\d+\.\s+(.*\S)\s+—\s+(\d+)\.?$/.exec(pedazo.trim());
    return m ? { titulo: m[1]!, veces: Number(m[2]) } : { titulo: pedazo, veces: NaN };
  });
  for (const pedazo of cola.split(' · ')) salida.push({ titulo: pedazo.trim(), veces: 1 });
  return salida;
}

/**
 * Cómo aparece una línea del archivo en la ficha. Dos títulos de la cola traen pegada una
 * aclaración de `investigador`; el archivo guarda el nombre en `titulo` y la aclaración en
 * `nota` (`CTR-19.3` punto 3). Esas dos se comparan como `titulo (aclaración)`, con la
 * aclaración sacada de la nota: si alguien cambia una de las dos cosas, deja de coincidir.
 */
function comoEnLaFicha(l: LineaCitada & { nota?: string }): string {
  const aclaracion = /^La ficha(?: \([^)]*\))? aclara: (.*)\.$/.exec(l.nota ?? '')?.[1];
  return aclaracion === undefined ? l.titulo : `${l.titulo} (${aclaracion})`;
}

/** La ficha escribe la aclaración con código y guion largo; se compara sin esos adornos. */
const sinAdornos = (t: string): string => t.replace(/`/g, '').replace(/ — /g, ', ');

/** Las filas del anexo: `| fecha | lugar | ciudad | temas | url |`. */
function indiceDeLaFicha(md: string): { fecha: string; lugar: string; ciudad: string; url: string }[] {
  const filas: { fecha: string; lugar: string; ciudad: string; url: string }[] = [];
  for (const linea of md.split(/\r?\n/)) {
    const m = /^\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*\d+\s*\|\s*(\S+)\s*\|$/.exec(linea);
    if (m) filas.push({ fecha: m[1]!, lugar: m[2]!, ciudad: m[3]!, url: m[4]! });
  }
  return filas;
}

test('los 198 números del conteo son los del anexo de RES-90, título por título (chequeo 8 de CTR-19.13)', () => {
  const ficha = anexoDeLaFicha(leer(INV_89)).map((f) => ({ titulo: sinAdornos(f.titulo), veces: f.veces }));
  assert.equal(ficha.length, 198, `la ficha no se pudo leer: salieron ${ficha.length} líneas`);
  assert.equal(CONTEO.ficha, 'RES-90');
  const archivo = CONTEO.temas.map((l) => ({ titulo: sinAdornos(comoEnLaFicha(l)), veces: l.veces }));
  assert.deepEqual(archivo, ficha);
});

test('los 25 primeros siguen siendo los de RES-74 (RES-89.2, el cruce que pedía T-282)', () => {
  // La página no cambió entre el 22 y el 24: los 25 primeros del conteo completo son el top
  // que ya estaba fichado. Si no, uno de los dos se leyó mal.
  const md = leer(INV_73);
  const desde = md.indexOf('**El top más tocado**');
  const bloque = md.slice(desde, md.indexOf('- **Salvedad de método', desde));
  const top = bloque
    .slice(bloque.indexOf('):') + 2)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.$/, '')
    .split(' · ')
    .map((p) => {
      const m = /^(.*\S)\s+(\d+)$/.exec(p.trim());
      return { titulo: m?.[1] ?? p, veces: Number(m?.[2]) };
    });
  assert.equal(top.length, 25, `el top de RES-74 no se pudo leer: salieron ${top.length}`);
  assert.deepEqual(CONTEO.temas.slice(0, 25).map((l) => ({ titulo: l.titulo, veces: l.veces })), top);
});

test('el índice es el anexo de INV-73, fila por fila', () => {
  const ficha = indiceDeLaFicha(leer(INV_73));
  assert.equal(ficha.length, 40, `el anexo no se pudo leer: salieron ${ficha.length} filas`);
  const clave = (r: { fecha: string; lugar: string; ciudad: string; url: string }) =>
    [r.fecha, r.lugar, r.ciudad, r.url].join(' | ');
  const archivo = (CITADO as unknown as { indice: { fecha: string; lugar: string; ciudad: string; url: string }[] }).indice;
  assert.deepEqual(archivo.map(clave).sort(), ficha.map(clave).sort());
});

test('la lectura de la ficha sabe encontrar: un número cambiado se ve, y la cola entra en 1', () => {
  const md =
    '**Puestos 1-147, ranking:**\n\n1. Jijiji — 101 · 2. Semen\nUp — 41.\n\n' +
    '**Cola de 1 reproducción, 2 títulos:**\nAurora · Hercules mío (cover de Vivi Tellas).';
  assert.deepEqual(anexoDeLaFicha(md), [
    { titulo: 'Jijiji', veces: 101 },
    { titulo: 'Semen Up', veces: 41 },
    { titulo: 'Aurora', veces: 1 },
    { titulo: 'Hercules mío (cover de Vivi Tellas)', veces: 1 },
  ]);
  assert.notDeepEqual(anexoDeLaFicha(md.replace('101', '100')), anexoDeLaFicha(md));
  // La aclaración se compara desde la nota: tocar la nota rompe la coincidencia.
  const hercules = { titulo: 'Hercules mío', veces: 1, fuera: 'cover', nota: 'La ficha aclara: cover de Vivi Tellas.' };
  assert.equal(comoEnLaFicha(hercules), 'Hercules mío (cover de Vivi Tellas)');
  assert.notEqual(comoEnLaFicha({ ...hercules, nota: 'La ficha aclara: cover de otro.' }), 'Hercules mío (cover de Vivi Tellas)');
});

// ---------------------------------------------------------------- t8, t9: aislamiento

/** Todos los archivos de código de una carpeta, recursivo. */
function codigo(dir: string, extensiones: readonly string[]): string[] {
  const salida: string[] = [];
  for (const nombre of readdirSync(dir)) {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) salida.push(...codigo(ruta, extensiones));
    else if (extensiones.some((e) => nombre.endsWith(e)) && !/\.test\.ts$/.test(nombre)) salida.push(ruta);
  }
  return salida;
}

const leer = (ruta: string): string => readFileSync(ruta, 'utf-8');

/** Lo que t8 prohíbe nombrar en los tres archivos del corte. Se arma por partes a propósito. */
const PROHIBIDOS_EN_EL_CORTE = ['popularidad' + '.json', 'repartirPor' + 'Popularidad', 'recitales' + '.json'];

function nombraProhibido(texto: string): string[] {
  return PROHIBIDOS_EN_EL_CORTE.filter((p) => texto.includes(p));
}

test('t8: el corte no nombra las vistas de YouTube ni la pieza 2', () => {
  const culpables: string[] = [];
  for (const ruta of ['src/lib/tema/catalogo.ts', 'src/lib/en-vivo.ts', 'src/pages/juegos/adivinar-el-tema.astro']) {
    for (const p of nombraProhibido(leer(ruta))) culpables.push(`${ruta} nombra ${p}`);
  }
  assert.deepEqual(culpables, [], culpables.join('\n'));
});

test('t8: fuera de los tests, nada de src/ nombra la pieza 2 ni importa recitales.ts', () => {
  const culpables: string[] = [];
  for (const ruta of codigo('src', ['.ts', '.astro'])) {
    const t = leer(ruta);
    if (t.includes('recitales' + '.json')) culpables.push(`${ruta} nombra la pieza 2`);
    if (/from\s+['"][^'"]*\/recitales\.ts['"]/.test(t)) culpables.push(`${ruta} importa recitales.ts`);
  }
  assert.deepEqual(culpables, [], culpables.join('\n'));
});

test('t8 sabe encontrar: se prueba contra textos inventados', () => {
  assert.deepEqual(nombraProhibido(`import p from '../../data/popularidad.json';`), ['popularidad.json']);
  assert.deepEqual(nombraProhibido(`repartirPorPopularidad(x)`), ['repartirPorPopularidad']);
  assert.deepEqual(nombraProhibido(`import '../popularidad.ts'`), []);
});

/**
 * t15 (`CTR-19.13`, `D-46` consecuencia 3): la dificultad no vuelve a salir de las vistas de
 * YouTube. La regla que lo hacía se retiró con su módulo; esto vigila que nadie la reponga ni
 * que el generador de `US-07` vuelva a leer el archivo de las vistas.
 */
const REGLA_DE_LAS_VISTAS = 'repartirPor' + 'Popularidad';
const ARCHIVO_DE_LAS_VISTAS = 'popularidad' + '.json';
const GENERADOR_US07 = 'scripts/generar-por-la-letra.mjs';

function culpablesT15(archivos: ReadonlyMap<string, string>): string[] {
  const culpables: string[] = [];
  for (const [ruta, texto] of archivos) {
    if (texto.includes(REGLA_DE_LAS_VISTAS)) culpables.push(`${ruta} nombra ${REGLA_DE_LAS_VISTAS}`);
  }
  const generador = archivos.get(GENERADOR_US07);
  if (generador === undefined) culpables.push(`no se encontró ${GENERADOR_US07}`);
  else if (generador.includes(ARCHIVO_DE_LAS_VISTAS)) culpables.push(`${GENERADOR_US07} nombra ${ARCHIVO_DE_LAS_VISTAS}`);
  return culpables;
}

test('t15: ninguna regla de dificultad sale de las vistas de YouTube (D-46, CTR-07.7)', () => {
  const archivos = new Map(
    [...codigo('src', ['.ts', '.mjs', '.astro']), ...codigo('scripts', ['.ts', '.mjs', '.astro'])].map(
      (ruta) => [ruta.replace(/\\/g, '/'), leer(ruta)] as const,
    ),
  );
  const culpables = culpablesT15(archivos);
  assert.deepEqual(culpables, [], culpables.join('\n'));
});

test('t15 sabe encontrar: se prueba contra archivos inventados', () => {
  const limpio = new Map([[GENERADOR_US07, `import { repartirEnTercios } from '../src/lib/en-vivo.ts';`]]);
  assert.deepEqual(culpablesT15(limpio), []);
  const conRegla = new Map([...limpio, ['src/lib/x.ts', `export function ${REGLA_DE_LAS_VISTAS}() {}`]]);
  assert.deepEqual(culpablesT15(conRegla), [`src/lib/x.ts nombra ${REGLA_DE_LAS_VISTAS}`]);
  const leeVistas = new Map([[GENERADOR_US07, `const P = join('src', 'data', '${ARCHIVO_DE_LAS_VISTAS}');`]]);
  assert.deepEqual(culpablesT15(leeVistas), [`${GENERADOR_US07} nombra ${ARCHIVO_DE_LAS_VISTAS}`]);
});

/**
 * Una URL de setlist.fm (`CTR-19.13`, t9). Antes de buscar se sacan comillas, `+` y
 * espacios, para que una URL armada por partes (`'https://api.' + 'setlist' + '.fm'`) no
 * se escape por no estar escrita de corrido.
 */
const URL_SETLISTFM_CORRIDA = /https?:\/\/[a-z.]*setlist\.fm/;
const URL_SETLISTFM = {
  test: (texto: string): boolean => URL_SETLISTFM_CORRIDA.test(texto.replace(/['"`+\s]/g, '')),
};

test('t9: ningún script ni módulo del sitio lleva una URL de setlist.fm (RES-73.1: nada de bots)', () => {
  const culpables = [...codigo('scripts', ['.ts', '.mjs', '.astro']), ...codigo('src', ['.ts', '.mjs', '.astro'])].filter(
    (ruta) => URL_SETLISTFM.test(leer(ruta)),
  );
  assert.deepEqual(culpables, [], `estos archivos llevan una URL de setlist.fm:\n${culpables.join('\n')}`);
});

test('t9 sabe encontrar: se prueba contra textos inventados', () => {
  assert.ok(URL_SETLISTFM.test(`await fetch('https://api.setlist.fm/rest/1.0/x')`));
  assert.ok(URL_SETLISTFM.test(`https://www.setlist.fm/stats/x.html`));
  assert.ok(!URL_SETLISTFM.test(`// lo que publica setlist.fm`));
  assert.ok(URL_SETLISTFM.test(`fetch('https://api.' + 'setlist' + '.fm/rest/1.0/x')`));
  assert.ok(URL_SETLISTFM.test(`const u = "https://www." +\n  "setlist.fm/stats";`));
});

// ---------------------------------------------------------------- ninguna lista de setlist.fm

test('ninguna lista de temas de setlist.fm quedó guardada: el índice solo tiene fecha, lugar y página', () => {
  const permitidos = new Set(['fecha', 'orden', 'lugar', 'ciudad', 'url', 'ficha']);
  for (const e of CITADO.indice ?? []) {
    const sobran = Object.keys(e).filter((k) => !permitidos.has(k));
    assert.deepEqual(sobran, [], `el enlace del ${String(e.fecha)} guarda de más: ${sobran.join(', ')}`);
  }
});

test('ningún otro dato del sitio nombra setlist.fm: lo citado vive en un solo archivo', () => {
  const culpables = readdirSync('src/data')
    .filter((n) => n.endsWith('.json') && n !== 'setlistfm.json')
    .filter((n) => leer(join('src/data', n)).includes('setlist.fm'));
  assert.deepEqual(culpables, [], `estos datos mencionan setlist.fm: ${culpables.join(', ')}`);
});
