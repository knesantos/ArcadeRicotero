/**
 * `CTR-19` pieza 2: los recitales enteros, de fuentes cuya licencia deja guardarlos.
 *
 * Son los t10 a t12 de `CTR-19.13`, más la validación del archivo contra su schema y los
 * casos c14 a c27. **Viven acá y no en `esquemas.test.ts`** porque ese archivo lo estaba
 * tocando otra tarea en la misma ráfaga (`T-272`); la línea `'recitales'` de su lista se
 * suma cuando se libere.
 *
 * Lo que este archivo existe para impedir, en una línea: **que el sitio guarde un recital de
 * una fuente cuya licencia no lo deja**, o de la fuente que solo deja ver.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import {
  problemasDelArchivo,
  salidaMasAbierta,
  entraEn,
  URL_DE_SALIDA,
  type ArchivoDeRecitales,
  type Fuente,
  type LicenciaDeFuente,
} from './recitales.ts';
import { resolverTema } from './letra/temas.ts';
import { slugDeTitulo } from './texto.ts';

const ARCHIVO = JSON.parse(readFileSync('src/data/recitales.json', 'utf-8')) as ArchivoDeRecitales;
const HOY = new Date().toISOString().slice(0, 10);

const resolver = (titulo: string): string | null => {
  const r = resolverTema(titulo);
  return r ? slugDeTitulo(r.titulo) : null;
};

// ---------------------------------------------------------------- el schema

function validador() {
  const Ctor = ((Ajv2020 as unknown as { default?: unknown }).default ?? Ajv2020) as new (o: object) => {
    compile: (s: unknown) => ((d: unknown) => boolean) & {
      errors?: readonly { instancePath: string; message?: string }[] | null;
    };
  };
  return new Ctor({ allErrors: true, strict: false });
}

const validar = validador().compile(JSON.parse(readFileSync('src/data/_schema/recitales.schema.json', 'utf-8')));

function errores(instancia: unknown): readonly string[] {
  if (validar(instancia)) return [];
  return (validar.errors ?? []).map((e) => `${e.instancePath} ${e.message ?? ''}`.trim());
}

test('recitales.json valida contra su schema', () => {
  const e = errores(ARCHIVO);
  assert.deepEqual(e, [], `recitales.json rompe su contrato:\n${e.join('\n')}`);
});

/** c14: la pieza 2 mínima, con una fuente CC BY-SA 4.0 completa y un recital de un tema. */
const minimo = (): Record<string, any> => ({
  contrato: 'CTR-19',
  pieza: 'recitales',
  contratoVersion: 1,
  actualizado: '2026-09-24',
  licencia: { id: 'cc-by-sa-4.0', url: URL_DE_SALIDA['cc-by-sa-4.0'] },
  cambios: 'Los titulos se cruzaron contra los 105 temas y se les agrego el slug del catalogo.',
  fuentes: [
    {
      id: 'wiki-de-prueba',
      nombre: 'Una wiki de prueba',
      sitio: 'https://wiki.example.org/',
      licencia: {
        familia: 'cc-by-sa',
        version: '4.0',
        textual: 'Content is available under CC BY-SA 4.0 unless otherwise noted.',
        url: 'https://wiki.example.org/licencia',
        consultada: '2026-09-23',
      },
      ficha: 'RES-99',
    },
  ],
  recitales: [
    {
      fecha: '1993-11-19',
      lugar: 'Estadio Huracán',
      ciudad: 'Buenos Aires',
      fuente: 'wiki-de-prueba',
      url: 'https://wiki.example.org/huracan-1993',
      consultado: '2026-09-23',
      completitud: 'sin-declarar',
      temas: [{ titulo: 'Jijiji', slug: 'jijiji' }],
    },
  ],
});

test('c14: la pieza 2 mínima, con una fuente CC BY-SA 4.0 completa, valida', () => {
  assert.deepEqual(errores(minimo()), []);
});

const SETLISTFM = 'https://www.' + 'setlist.fm/setlist/x/1993/y.html';

const CASOS_EN_ROJO: ReadonlyArray<readonly [string, (d: Record<string, any>) => void]> = [
  ['c15: recital sin fuente', (d) => delete d.recitales[0].fuente],
  ['c16: recital sin consultado', (d) => delete d.recitales[0].consultado],
  ['c17: recital con url de setlist.fm', (d) => (d.recitales[0].url = SETLISTFM)],
  ['c18: fuente con sitio de setlist.fm', (d) => (d.fuentes[0].sitio = SETLISTFM)],
  ['c19: licencia de fuente sin textual', (d) => delete d.fuentes[0].licencia.textual],
  ['c20: cc-by-sa sin version', (d) => delete d.fuentes[0].licencia.version],
  ['c21: permiso-escrito sin redistribuible', (d) => {
    d.fuentes[0].licencia.familia = 'permiso-escrito';
    delete d.fuentes[0].licencia.version;
  }],
  ['c22: familia todos-los-derechos', (d) => (d.fuentes[0].licencia.familia = 'todos-los-derechos')],
  ['c23: recital con temas vacío', (d) => (d.recitales[0].temas = [])],
  ['c24: tema con slug y fuera', (d) => (d.recitales[0].temas[0].fuera = 'cover')],
  ['c25: archivo sin licencia', (d) => delete d.licencia],
  ['c26: archivo sin cambios', (d) => delete d.cambios],
  ['c27: recital con un campo veces (la cuenta no se guarda acá)', (d) => (d.recitales[0].veces = 3)],
];

for (const [nombre, tocar] of CASOS_EN_ROJO) {
  test(`el schema de la pieza 2 rechaza ${nombre}`, () => {
    const d = minimo();
    tocar(d);
    assert.notDeepEqual(errores(d), [], `${nombre}: el schema lo dejó pasar`);
  });
}

test('control de c21: el mismo permiso-escrito con redistribuible sí valida', () => {
  const d = minimo();
  d.fuentes[0].licencia.familia = 'permiso-escrito';
  delete d.fuentes[0].licencia.version;
  d.fuentes[0].licencia.redistribuible = true;
  assert.deepEqual(errores(d), []);
});

// ---------------------------------------------------------------- t10..t12, sobre el dato real

test('t10-t12: el archivo real no tiene problemas (cruce, licencias, integridad)', () => {
  const p = problemasDelArchivo(ARCHIVO, resolver, HOY);
  assert.deepEqual(p, [], `recitales.json tiene problemas:\n${p.join('\n')}`);
});

test('ningún recital guardado viene de una fuente sin licencia que lo permita', () => {
  const declaradas = new Map(ARCHIVO.fuentes.map((f) => [f.id, f]));
  for (const r of ARCHIVO.recitales) {
    const f = declaradas.get(r.fuente);
    assert.ok(f, `el recital ${r.fecha} cita una fuente que no está declarada: ${r.fuente}`);
    assert.ok(entraEn(f.licencia, ARCHIVO.licencia.id), `el recital ${r.fecha} viene de ${f.id}, que no entra en ${ARCHIVO.licencia.id}`);
    assert.doesNotMatch(r.url, /setlist\.fm/, `el recital ${r.fecha} guarda una página de la fuente citada`);
  }
  // Y la salida es la más abierta posible: cerrar un molinete sin motivo tampoco va.
  assert.equal(ARCHIVO.licencia.id, salidaMasAbierta(ARCHIVO.fuentes));
});

test('el recuento por fuente es el de la ficha: MusicBrainz trae 2 recitales (RES-76) y el del 9/12/1995 tiene 25 temas (RES-77)', () => {
  const mb = ARCHIVO.recitales.filter((r) => r.fuente === 'musicbrainz');
  assert.deepEqual(mb.map((r) => r.fecha), ['1995-12-08', '1995-12-09']);
  assert.equal(mb.find((r) => r.fecha === '1995-12-09')!.temas.length, 25);
});

// ---------------------------------------------------------------- t10..t12 en rojo

const archivoCon = (cambio: (d: Record<string, any>) => void): ArchivoDeRecitales => {
  const d = structuredClone(ARCHIVO) as unknown as Record<string, any>;
  cambio(d);
  return d as unknown as ArchivoDeRecitales;
};

test('t10 en rojo: un título fuera de los 105 guardado con slug se nombra', () => {
  const malo = archivoCon((d) => (d.recitales[1].temas[0] = { titulo: 'Un tal Brigitte Bardot', slug: 'un-tal-brigitte-bardot' }));
  assert.match(problemasDelArchivo(malo, resolver, HOY).join('\n'), /«Un tal Brigitte Bardot» no es ninguno de los 105/);
});

test('t10 en rojo: un tema marcado fuera que ahora resuelve se nombra', () => {
  const malo = archivoCon((d) => (d.recitales[0].temas[0] = { titulo: 'Jijiji', fuera: 'sin-identificar', nota: 'una nota larga' }));
  assert.match(problemasDelArchivo(malo, resolver, HOY).join('\n'), /«Jijiji» está marcado fuera/);
});

const licencia = (familia: LicenciaDeFuente['familia'], version?: string, redistribuible?: true): LicenciaDeFuente => ({
  familia,
  ...(version ? { version } : {}),
  ...(redistribuible ? { redistribuible } : {}),
  textual: 'texto de la licencia, copiado',
  url: 'https://example.org/licencia',
  consultada: '2026-09-23',
});

test('t11 en rojo: una fuente BY-SA dentro de un archivo que se declara CC0 se nombra', () => {
  const malo = archivoCon((d) => (d.fuentes[0].licencia = licencia('cc-by-sa', '4.0')));
  assert.match(problemasDelArchivo(malo, resolver, HOY).join('\n'), /la fuente musicbrainz \(cc-by-sa 4\.0\) no puede salir bajo cc0-1\.0/);
});

test('t11 en rojo: la URL de la licencia del archivo tiene que ser la de su salida', () => {
  const malo = archivoCon((d) => (d.licencia.url = URL_DE_SALIDA['cc-by-4.0']));
  assert.match(problemasDelArchivo(malo, resolver, HOY).join('\n'), /la licencia del archivo dice cc0-1\.0 y su URL es/);
});

test('t11: la tabla de CTR-19.8, fila por fila', () => {
  const casos: ReadonlyArray<readonly [LicenciaDeFuente, readonly string[]]> = [
    [licencia('cc0', '1.0'), ['cc0-1.0', 'cc-by-4.0', 'cc-by-sa-4.0', 'cc-by-nc-sa-4.0']],
    [licencia('dominio-publico'), ['cc0-1.0', 'cc-by-4.0', 'cc-by-sa-4.0', 'cc-by-nc-sa-4.0']],
    [licencia('cc-by', '2.0'), ['cc-by-4.0', 'cc-by-sa-4.0', 'cc-by-nc-sa-4.0']],
    [licencia('permiso-escrito', undefined, true), ['cc-by-4.0', 'cc-by-sa-4.0', 'cc-by-nc-sa-4.0']],
    [licencia('permiso-escrito'), []],
    [licencia('cc-by-sa', '3.0'), ['cc-by-sa-4.0']],
    [licencia('cc-by-sa', '2.5'), []],
    [licencia('cc-by-nc', '4.0'), ['cc-by-nc-sa-4.0']],
    [licencia('cc-by-nc-sa', '3.0'), ['cc-by-nc-sa-4.0']],
  ];
  for (const [l, esperadas] of casos) {
    const entra = (['cc0-1.0', 'cc-by-4.0', 'cc-by-sa-4.0', 'cc-by-nc-sa-4.0'] as const).filter((s) => entraEn(l, s));
    assert.deepEqual(entra, esperadas, `${l.familia} ${l.version ?? ''}`);
  }
});

test('salidaMasAbierta: BY-SA con NC-SA no tiene salida, y no se elige en silencio', () => {
  const f = (id: string, l: LicenciaDeFuente): Fuente => ({ id, nombre: id, sitio: 'https://example.org/', licencia: l, ficha: 'RES-99' });
  assert.equal(salidaMasAbierta([f('a', licencia('cc0', '1.0'))]), 'cc0-1.0');
  assert.equal(salidaMasAbierta([f('a', licencia('cc0', '1.0')), f('b', licencia('cc-by-sa', '4.0'))]), 'cc-by-sa-4.0');
  assert.equal(salidaMasAbierta([f('a', licencia('cc-by-sa', '4.0')), f('b', licencia('cc-by-nc-sa', '4.0'))]), null);
});

test('t12 en rojo: un recital con una fuente que no está declarada se nombra', () => {
  const malo = archivoCon((d) => (d.recitales[0].fuente = 'otra'));
  const p = problemasDelArchivo(malo, resolver, HOY).join('\n');
  assert.match(p, /la fuente otra no está declarada/);
});

test('t12 en rojo: una fuente declarada que nadie usa se nombra', () => {
  const malo = archivoCon((d) => d.fuentes.push({ ...d.fuentes[0], id: 'sobrante' }));
  assert.match(problemasDelArchivo(malo, resolver, HOY).join('\n'), /la fuente sobrante está declarada y ningún recital la usa/);
});

test('t12 en rojo: el mismo (fecha, orden, fuente) dos veces se nombra', () => {
  const malo = archivoCon((d) => (d.recitales[1].fecha = d.recitales[0].fecha));
  assert.match(problemasDelArchivo(malo, resolver, HOY).join('\n'), /está 2 veces/);
});

test('t12 en rojo: pegadoAlAnterior en el primer tema, y consultas en el futuro, se nombran', () => {
  const malo = archivoCon((d) => {
    d.recitales[0].temas[0].pegadoAlAnterior = true;
    d.recitales[1].consultado = '2999-01-01';
    d.fuentes[0].licencia.consultada = '2999-01-01';
  });
  const p = problemasDelArchivo(malo, resolver, HOY).join('\n');
  assert.match(p, /el primer tema no puede ir pegado al anterior/);
  assert.match(p, /consultado el 2999-01-01, que está en el futuro/);
  assert.match(p, /la licencia de musicbrainz dice consultada el 2999-01-01/);
});

test('t12 en rojo: un recital posterior a su consulta se nombra', () => {
  const malo = archivoCon((d) => (d.recitales[0].fecha = '2027-01-01'));
  assert.match(problemasDelArchivo(malo, resolver, HOY).join('\n'), /la fecha del recital es posterior a su consulta/);
});

// ------------------------------------------ las reglas de MusicBrainz, en el texto del script

/**
 * `RES-79`: la API de MusicBrainz pide **como mucho un pedido por segundo** y un
 * **User-Agent propio con contacto**. El script no corre en `npm test` (sale a la red), así
 * que se lee su texto: la pausa es un número de 1000 ms o más, se usa antes de cada pedido,
 * y cada `fetch` lleva el User-Agent, que nombra un contacto entre paréntesis.
 */
function problemasDelScript(texto: string): string[] {
  const problemas: string[] = [];
  const pausa = /const PAUSA_MS = (\d+);/.exec(texto);
  if (!pausa) problemas.push('no declara PAUSA_MS como un número');
  else if (Number(pausa[1]) < 1000) problemas.push(`PAUSA_MS es ${pausa[1]}: MusicBrainz pide 1 pedido por segundo como mucho`);
  if (!/ultimoPedido \+ PAUSA_MS/.test(texto)) problemas.push('la pausa no se usa antes de cada pedido');
  const agente = /const USER_AGENT = `([^`]*)`/.exec(texto);
  if (!agente) problemas.push('no declara USER_AGENT');
  else if (!/^\S+\/\S+ \( \S+ \)$/.test(agente[1]!)) problemas.push(`el User-Agent «${agente[1]}» no nombra un contacto`);
  const pedidos = texto.match(/\bfetch\(/g)?.length ?? 0;
  const conAgente = texto.match(/'User-Agent': USER_AGENT/g)?.length ?? 0;
  if (pedidos === 0) problemas.push('no hace ningún fetch: ¿cambió la forma del script?');
  if (conAgente < pedidos) problemas.push(`hay ${pedidos} fetch y solo ${conAgente} llevan el User-Agent`);
  return problemas;
}

const SCRIPT = readFileSync('scripts/ingerir-recitales.mjs', 'utf-8');

test('el script respeta las reglas de MusicBrainz: ≤ 1 pedido por segundo y User-Agent con contacto (RES-79)', () => {
  assert.deepEqual(problemasDelScript(SCRIPT), []);
});

test('las reglas del script en rojo: pausa corta, sin User-Agent, fetch suelto', () => {
  assert.match(problemasDelScript(SCRIPT.replace(/const PAUSA_MS = \d+;/, 'const PAUSA_MS = 100;')).join('\n'), /PAUSA_MS es 100/);
  assert.match(
    problemasDelScript(SCRIPT.replace("'User-Agent': USER_AGENT, ", '')).join('\n'),
    /solo 0 llevan el User-Agent/,
  );
  assert.match(
    problemasDelScript(SCRIPT.replace(/const USER_AGENT = `[^`]*`/, 'const USER_AGENT = `ArcadeRicotero/1.0`')).join('\n'),
    /no nombra un contacto/,
  );
  assert.match(problemasDelScript(SCRIPT + '\nawait fetch(otra);\n').join('\n'), /hay 2 fetch y solo 1/);
});
