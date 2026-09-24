/**
 * El banco de "Sacalo por la letra" (`US-07`, `CTR-09` v2) contra la regla que le da la
 * dificultad (`D-46`, `BR-30`, `CTR-19.15`) y contra `BR-01`.
 *
 * - **t14** (`CTR-19.13`): el banco es el que da la regla. Su `conteo` es el de
 *   `setlistfm.json`, y cada nivel es el que da `repartirEnTercios()` sobre los slugs del
 *   banco. Si alguien refresca el conteo y no regenera, o toca un nivel a mano, se pone en
 *   rojo y dice qué correr.
 * - **p0 a p7** (`CTR-09.11`, enmendado): el schema v2 rechaza un banco de antes de `D-46`.
 *   Viven acá y no en `esquemas.test.ts` por lo mismo que los de `setlistfm` viven en
 *   `en-vivo.test.ts`: ese archivo lo toca otra tarea cada ráfaga. La validación del banco
 *   entero sigue estando allá, en su lista.
 * - **`BR-01`** con el banco real: el piso de 60, la cuota de 15 Fáciles, el primero Fácil,
 *   la dificultad que no baja y que ningún tema quede afuera de toda ronda.
 *
 * Cada regla tiene su caso en rojo al lado, sobre una copia del banco tocada en un campo.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import { repartirEnTercios, type ConteoCitado } from '../en-vivo.ts';
import { ORDEN_DIFICULTAD } from '../escalonar.ts';
import { armarRonda, FACILES_POR_RONDA, LARGO_RONDA } from './ronda.ts';

// ---------------------------------------------------------------- insumos

interface Item {
  slug: string;
  titulo: string;
  dificultad: string;
  dificultadSegun: string;
}
interface Banco {
  contratoVersion: number;
  conteo: { ficha: string; consultado: string };
  items: Item[];
}
type ConteoDelArchivo = ConteoCitado & { ficha: string };

const leerJson = <T>(ruta: string): T => JSON.parse(readFileSync(ruta, 'utf-8')) as T;

const BANCO = leerJson<Banco>('src/data/por-la-letra.json');
const CONTEO = leerJson<{ conteo: ConteoDelArchivo }>('src/data/setlistfm.json').conteo;

/** Una copia profunda del banco real, para tocarla en un solo campo. */
const copia = (): Banco => structuredClone(BANCO);

/** El piso de `US-07` y su cuota de Fáciles (`PRD-adivinar-por-la-letra.md`, `BR-30`). */
const PISO = 60;
const CUOTA_FACILES = 15;

// ---------------------------------------------------------------- t14

/**
 * Lo que distingue un banco al día de uno viejo o tocado a mano. Lista vacía = el banco es
 * exactamente lo que da la regla con el conteo vigente.
 */
function problemasDelBanco(banco: Banco, conteo: ConteoDelArchivo): string[] {
  const problemas: string[] = [];
  const correr = ' Corré `npm run generar-por-la-letra`.';

  if (banco.conteo?.ficha !== conteo.ficha || banco.conteo?.consultado !== conteo.consultado) {
    problemas.push(
      `el banco se calculó con el conteo ${banco.conteo?.ficha} del ${banco.conteo?.consultado}, ` +
        `y el vigente es ${conteo.ficha} del ${conteo.consultado}.${correr}`,
    );
  }

  const regla = repartirEnTercios(new Set(banco.items.map((i) => i.slug)), conteo);
  const sinConteo = new Set(regla.sinConteo);
  for (const i of banco.items) {
    const debe = regla.porSlug.get(i.slug);
    if (i.dificultad !== debe) {
      problemas.push(`«${i.titulo}» está en ${i.dificultad} y la regla de CTR-19.15 dice ${debe}.${correr}`);
    }
    const segun = sinConteo.has(i.slug) ? 'sin-conteo' : 'en-vivo';
    if (i.dificultadSegun !== segun) {
      problemas.push(`«${i.titulo}» dice ${i.dificultadSegun} y tendría que decir ${segun}.${correr}`);
    }
  }
  return problemas;
}

test('t14: el banco de US-07 es el que da la regla, con el conteo vigente', () => {
  const problemas = problemasDelBanco(BANCO, CONTEO);
  assert.deepEqual(problemas, [], problemas.join('\n'));
});

test('t14 en rojo: un conteo refrescado sin regenerar el banco', () => {
  const nuevo = { ...CONTEO, ficha: 'RES-99', consultado: '2027-03-01' };
  const dice = problemasDelBanco(BANCO, nuevo).join('\n');
  assert.match(dice, /el vigente es RES-99 del 2027-03-01/);
  assert.match(dice, /npm run generar-por-la-letra/);
});

test('t14 en rojo: un nivel tocado a mano', () => {
  const b = copia();
  const tocado = b.items.find((i) => i.dificultad === 'dificil')!;
  tocado.dificultad = 'facil';
  const dice = problemasDelBanco(b, CONTEO);
  assert.equal(dice.length, 1, dice.join('\n'));
  assert.match(dice[0]!, new RegExp(`«${tocado.titulo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}» está en facil`));
});

test('t14 en rojo: un tema que perdió su línea en el conteo pasa a dificil y sin-conteo', () => {
  // Se saca del conteo la línea de un Fácil: la regla lo manda a Difícil y lo marca.
  const facil = BANCO.items.find((i) => i.dificultad === 'facil')!;
  const sinLinea = { ...CONTEO, temas: CONTEO.temas.filter((l) => l.slug !== facil.slug) };
  const dice = problemasDelBanco(BANCO, sinLinea).join('\n');
  assert.match(dice, new RegExp(`dice en-vivo y tendría que decir sin-conteo`));
  assert.equal(repartirEnTercios(new Set([facil.slug]), sinLinea).porSlug.get(facil.slug), 'dificil');
});

// ---------------------------------------------------------------- el schema v2 (p0..p7)

function validador() {
  const Ctor = ((Ajv2020 as unknown as { default?: unknown }).default ?? Ajv2020) as new (o: object) => {
    compile: (s: unknown) => ((d: unknown) => boolean) & {
      errors?: readonly { instancePath: string; message?: string }[] | null;
    };
  };
  return new Ctor({ allErrors: true, strict: false });
}

const validarBanco = validador().compile(leerJson('src/data/_schema/por-la-letra.schema.json'));

function errores(instancia: unknown): readonly string[] {
  if (validarBanco(instancia)) return [];
  return (validarBanco.errors ?? []).map((e) => `${e.instancePath} ${e.message ?? ''}`.trim());
}

test('p0: el banco regenerado valida contra el schema v2, tal cual', () => {
  const e = errores(BANCO);
  assert.deepEqual(e, [], `por-la-letra.json rompe su contrato:\n${e.join('\n')}`);
  assert.equal(BANCO.contratoVersion, 2);
});

const CASOS_EN_ROJO: ReadonlyArray<readonly [string, (b: Record<string, any>) => void]> = [
  ['p1: un ítem con dificultadSegun "youtube"', (b) => (b.items[0].dificultadSegun = 'youtube')],
  ['p2: un ítem con dificultadSegun "curaduria"', (b) => (b.items[0].dificultadSegun = 'curaduria')],
  ['p3: un ítem con dificultad "sin-clasificar"', (b) => (b.items[0].dificultad = 'sin-clasificar')],
  [
    'p4: sin-conteo con un nivel que no es dificil',
    (b) => Object.assign(b.items[0], { dificultadSegun: 'sin-conteo', dificultad: 'facil' }),
  ],
  ['p5: banco sin conteo', (b) => delete b.conteo],
  ['p6: contratoVersion 1', (b) => (b.contratoVersion = 1)],
  ['p7: conteo.ficha sin la forma RES-', (b) => (b.conteo.ficha = '74')],
];

for (const [nombre, tocar] of CASOS_EN_ROJO) {
  test(`el schema v2 rechaza ${nombre}`, () => {
    const b = copia() as unknown as Record<string, any>;
    tocar(b);
    assert.notDeepEqual(errores(b), [], `${nombre}: el schema lo dejó pasar`);
  });
}

test('control de p4: sin-conteo con dificil sí valida (si no, el rojo de p4 no prueba nada)', () => {
  const b = copia();
  Object.assign(b.items[0]!, { dificultadSegun: 'sin-conteo', dificultad: 'dificil' });
  assert.deepEqual(errores(b), []);
});

// ---------------------------------------------------------------- BR-01 con el banco real

test('BR-01 punto 3: el banco pasa el piso de 60 y la cuota de 15 Fáciles', () => {
  const faciles = BANCO.items.filter((i) => i.dificultad === 'facil');
  assert.ok(BANCO.items.length >= PISO, `el banco tiene ${BANCO.items.length} ítems y el piso es ${PISO}`);
  assert.ok(
    faciles.length >= CUOTA_FACILES,
    `hay ${faciles.length} Fáciles y la cuota de US-07 es ${CUOTA_FACILES}: ${faciles.map((i) => i.titulo).join(', ')}`,
  );
  // Y los tres niveles existen: con uno solo, "escalonar" sería un barajado con otro nombre.
  for (const nivel of ['facil', 'media', 'dificil']) {
    assert.ok(BANCO.items.some((i) => i.dificultad === nivel), `ningún ítem quedó en ${nivel}`);
  }
});

/** Azar con semilla (mulberry32): miles de rondas sin depender de la suerte. */
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

/** Lo que `BR-01` le pide a una ronda: abre con Fácil, no baja, y respeta el cupo. */
function problemasDeLaRonda(ronda: readonly Item[]): string[] {
  const p: string[] = [];
  if (ronda[0]?.dificultad !== 'facil') p.push(`abrió con ${ronda[0]?.dificultad}`);
  for (let k = 1; k < ronda.length; k++) {
    if (ORDEN_DIFICULTAD[ronda[k]!.dificultad]! < ORDEN_DIFICULTAD[ronda[k - 1]!.dificultad]!) {
      p.push(`bajó de ${ronda[k - 1]!.dificultad} a ${ronda[k]!.dificultad} en el puesto ${k + 1}`);
    }
  }
  const faciles = ronda.filter((r) => r.dificultad === 'facil').length;
  if (faciles > FACILES_POR_RONDA) p.push(`trajo ${faciles} Fáciles y el cupo es ${FACILES_POR_RONDA}`);
  return p;
}

test('BR-01 puntos 1 y 2: dos mil rondas con el banco real abren con Fácil, no bajan y respetan el cupo', () => {
  const azar = conSemilla(285);
  for (let i = 0; i < 2000; i++) {
    const ronda = armarRonda(BANCO.items, azar);
    assert.equal(ronda.length, LARGO_RONDA);
    assert.deepEqual(problemasDeLaRonda(ronda), [], `la ronda ${i}: ${ronda.map((r) => r.dificultad).join(' ')}`);
  }
});

test('BR-01 en rojo: la ronda que abre con Media, que baja o que se pasa del cupo se nombra', () => {
  const it = (dificultad: string): Item => ({ slug: dificultad, titulo: dificultad, dificultad, dificultadSegun: 'en-vivo' });
  assert.match(problemasDeLaRonda([it('media'), it('media')]).join('\n'), /abrió con media/);
  assert.match(problemasDeLaRonda([it('facil'), it('dificil'), it('media')]).join('\n'), /bajó de dificil a media/);
  assert.match(problemasDeLaRonda([it('facil'), it('facil'), it('facil')]).join('\n'), /trajo 3 Fáciles/);
  assert.deepEqual(problemasDeLaRonda([it('facil'), it('media'), it('dificil')]), []);
});

test('BR-01 punto 3, la vidriera: en dos mil rondas sale cada tema del banco, no solo los Fáciles', () => {
  const azar = conSemilla(1993);
  const salieron = new Set<string>();
  const primeros = new Set<string>();
  for (let i = 0; i < 2000; i++) {
    const ronda = armarRonda(BANCO.items, azar);
    ronda.forEach((r) => salieron.add(r.slug));
    primeros.add(ronda[0]!.slug);
  }
  const nunca = BANCO.items.filter((i) => !salieron.has(i.slug)).map((i) => i.titulo);
  assert.deepEqual(nunca, [], `estos temas no salen en ninguna ronda: ${nunca.join(', ')}`);
  // Y el primero varía entre todos los Fáciles, no entre uno o dos.
  assert.equal(primeros.size, BANCO.items.filter((i) => i.dificultad === 'facil').length);
});
