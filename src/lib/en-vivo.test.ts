/**
 * `CTR-19` pieza 1: el conteo que el sitio cita de setlist.fm, y el corte de Fáciles de
 * `US-02` que sale de él (`D-45` enmendada, `BR-18` apartado h).
 *
 * Son los t1 a t9 de `CTR-19.13`, más la validación de `setlistfm.json` contra su schema y
 * los casos c1 a c13 del schema. **Esos últimos viven acá y no en `esquemas.test.ts`**
 * porque ese archivo lo estaba tocando otra tarea en la misma ráfaga (`T-272`); la línea
 * `'setlistfm'` de su lista se suma cuando se libere, y estos casos se pueden mudar con ella.
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
];

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
  assert.match(problemasDelConteo(malo, resolver).join('\n'), /«Jijiji» y «Ji ji ji» son el mismo tema/);
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

// ---------------------------------------------------------------- el archivo contra la ficha

/**
 * `CTR-19.13` chequeo 8, puesto en un test: los números del conteo son los de `RES-74`,
 * título por título, y el índice es el del anexo de `INV-73`, fila por fila. La ficha es de
 * `investigador` y se lee, no se toca. Si la ficha cambia, el archivo se reescribe entero
 * desde ella (`CTR-19.6`); si cambia el archivo sin ficha, esto se pone en rojo.
 */
const INV_73 = 'Docs/INVESTIGACION/INV-73-recitales-setlistfm.md';

/** Las 25 líneas del top de `RES-74`, en el orden de la ficha: «Título N · Título N · …». */
function topDeLaFicha(md: string): { titulo: string; veces: number }[] {
  const desde = md.indexOf('**El top más tocado**');
  const hasta = md.indexOf('- **Salvedad de método', desde);
  if (desde < 0 || hasta < 0) return [];
  const bloque = md.slice(desde, hasta);
  const cuerpo = bloque.slice(bloque.indexOf('):') + 2).replace(/\s+/g, ' ').trim().replace(/\.$/, '');
  return cuerpo.split(' · ').map((pedazo) => {
    const m = /^(.*\S)\s+(\d+)$/.exec(pedazo.trim());
    return m ? { titulo: m[1]!, veces: Number(m[2]) } : { titulo: pedazo, veces: NaN };
  });
}

/** Las filas del anexo: `| fecha | lugar | ciudad | temas | url |`. */
function indiceDeLaFicha(md: string): { fecha: string; lugar: string; ciudad: string; url: string }[] {
  const filas: { fecha: string; lugar: string; ciudad: string; url: string }[] = [];
  for (const linea of md.split(/\r?\n/)) {
    const m = /^\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*\d+\s*\|\s*(\S+)\s*\|$/.exec(linea);
    if (m) filas.push({ fecha: m[1]!, lugar: m[2]!, ciudad: m[3]!, url: m[4]! });
  }
  return filas;
}

test('los 25 números del conteo son los de RES-74, título por título (chequeo 8 de CTR-19.13)', () => {
  const ficha = topDeLaFicha(leer(INV_73));
  assert.equal(ficha.length, 25, `la ficha no se pudo leer: salieron ${ficha.length} líneas`);
  const archivo = CONTEO.temas.map((l) => ({ titulo: l.titulo, veces: l.veces }));
  assert.deepEqual(archivo, ficha);
});

test('el índice es el anexo de INV-73, fila por fila', () => {
  const ficha = indiceDeLaFicha(leer(INV_73));
  assert.equal(ficha.length, 40, `el anexo no se pudo leer: salieron ${ficha.length} filas`);
  const clave = (r: { fecha: string; lugar: string; ciudad: string; url: string }) =>
    [r.fecha, r.lugar, r.ciudad, r.url].join(' | ');
  const archivo = (CITADO as unknown as { indice: { fecha: string; lugar: string; ciudad: string; url: string }[] }).indice;
  assert.deepEqual(archivo.map(clave).sort(), ficha.map(clave).sort());
});

test('la lectura de la ficha sabe encontrar: un número cambiado se ve', () => {
  const md = '- **El top más tocado** (top-2): Jijiji 101 · Semen Up\n  41.\n- **Salvedad de método';
  assert.deepEqual(topDeLaFicha(md), [
    { titulo: 'Jijiji', veces: 101 },
    { titulo: 'Semen Up', veces: 41 },
  ]);
  assert.notDeepEqual(topDeLaFicha(md.replace('101', '100')), topDeLaFicha(md));
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
