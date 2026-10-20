/**
 * Los schemas de `src/data/_schema/` se corren de verdad contra los datos.
 *
 * **Por que existe este archivo.** Hasta el ciclo 7 ningun schema del proyecto se corria:
 * `banco.ts` decia en su encabezado que la validacion "ya la hace `jsonschema` en la
 * verificacion (`D-12`)", y no existia ningun comando que la hiciera. Es el mismo defecto
 * que el ciclo 6 ya habia encontrado una vez, con estas palabras: la regla de `CTR-04`
 * "vivia solo en `letra.schema.json`, que ningun test corria".
 *
 * Un contrato que nadie ejecuta no es un contrato: es una intencion. Y este proyecto tiene
 * una sola regla estricta —que la respuesta correcta sea correcta— que se defiende con
 * rotulos, y los rotulos los hace cumplir el schema.
 *
 * La primera corrida encontro `cancionero.json` invalido. Ver la excepcion documentada
 * mas abajo: no se tapa, se cuenta.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import { problemasDelBanco, type Banco } from './skayboy/niveles.ts';

/**
 * `strict: false` porque los schemas usan `comment` como texto para el que lee, y el modo
 * estricto de ajv lo rechaza por no ser palabra clave del vocabulario.
 */
function validador() {
  const Ctor = ((Ajv2020 as unknown as { default?: unknown }).default ??
    Ajv2020) as new (o: object) => {
    compile: (s: unknown) => ((d: unknown) => boolean) & {
      errors?: readonly { instancePath: string; message?: string }[] | null;
    };
  };
  return new Ctor({ allErrors: true, strict: false });
}

/**
 * Valida **cualquier objeto** contra un schema del repo, no solo el archivo que le
 * corresponde. Existe para los casos en rojo: un banco de verdad, tocado a propósito en un
 * solo campo, es la única manera de probar que una regla del schema corre de verdad. Una
 * guarda que nunca se vio en rojo no es una guarda.
 */
function erroresDeInstancia(instancia: unknown, esquema: string): readonly string[] {
  const s: unknown = JSON.parse(readFileSync(`src/data/_schema/${esquema}.schema.json`, 'utf-8'));
  const validar = validador().compile(s);
  if (validar(instancia)) return [];
  return (validar.errors ?? []).map((e) => `${e.instancePath} ${e.message ?? ''}`.trim());
}

function erroresDe(datos: string, esquema: string): readonly string[] {
  const d: unknown = JSON.parse(readFileSync(`src/data/${datos}.json`, 'utf-8'));
  return erroresDeInstancia(d, esquema);
}

// Un archivo entra a esta lista **cuando existen el schema y el dato**, no antes: sumarlo
// con el dato sin escribir pinta el build de rojo por un archivo que nadie cargó todavía,
// y eso es ruido, no una guarda. `popularidad` y `dos-ejes` entraron en el ciclo 8, cada
// uno el día que su JSON apareció.
for (const archivo of [
  'quiz',
  'letra',
  'tapa',
  'cancionero',
  'popularidad',
  'dos-ejes',
  'por-la-letra',
  'skayboy',
  'skayboy-soluciones',
  // `US-10` (`CTR-20`), el 2026-09-25: el banco de "Más o menos", con los datos a mano de la
  // banda y las palabras. Lo derivado no está en el archivo y el schema no lo deja entrar.
  'mas-o-menos',
  // `D-72`, el 2026-10-15: los lugares para soñar de "Armá tu recital".
  'lugares-recital',
  // `D-73`, el 2026-10-16: el bestiario redondo, sus regiones y sus bestias.
  'bestiario',
  // `D-78`, el 2026-10-20: el segundo del verso de cada bestia y su recorte.
  'bestiario-sincro',
] as const) {
  test(`${archivo}.json valida contra su schema`, () => {
    const errores = erroresDe(archivo, archivo);
    assert.deepEqual(errores, [], `${archivo}.json rompe su contrato:\n${errores.join('\n')}`);
  });
}

/**
 * **La excepcion que estuvo aca y ya no hace falta.**
 *
 * La primera corrida de este archivo, el 2026-08-24, encontro `cancionero.json` invalido:
 * dos temas traian una **secuencia** de acordes metida en un campo que el schema define
 * como *un* acorde. Se dejo medido con un test de caracterizacion que fallaba si el defecto
 * crecia **y tambien si se arreglaba**, con la instruccion de borrarlo en ese caso.
 *
 * Se arreglo el mismo dia: el cancionero se rehizo desde la fuente y la ingesta paso a
 * normalizar los acordes (`src/lib/cancionero/notacion.ts`), que de paso descarta lo que
 * nunca fue un acorde. `cancionero` esta arriba, con los otros tres.
 */

/**
 * ## Los niveles de Skayboy y Poligirl (`CTR-16`), y las reglas que hay que ver en rojo
 *
 * El archivo de arriba prueba que cada dato cumple su contrato. Eso alcanza mientras el
 * contrato sea una lista de tipos; `CTR-16` no lo es. Tiene **reglas que existen para que algo
 * no se pueda escribir**, y una regla así no se verifica mirando el dato bueno: se verifica
 * escribiendo el dato malo y confirmando que el schema lo rechaza.
 *
 * Las de acá, y de dónde salen:
 *
 * 1. **Un mecanismo que abre una compuerta que no existe** (`E3` de `CTR-16.10.10`). Reemplaza
 *    al caso de `CTR-16.6` —`sostenido: true` sin `alternativaSolo`—, que se fue con los dos
 *    campos: la placa lo dice la grilla (`=`), y la segunda solución ya no es prosa sino la
 *    traza de uno de `CTR-18`, que el build repite. Lo que queda por cazar es un `abre` que no
 *    abre nada: el schema mira la forma (`COM-NN`) y `niveles.ts` que la compuerta sea del nivel.
 * 2. **`estado: "listo"` sin `deDos`** (`CTR-16.7`, versión 2). `listo` cuesta dos pasadas: la
 *    de uno la da la traza grabada en cada build (`CTR-18`), y la de dos personas es este
 *    booleano, que no prueba que se jugó: prueba que alguien se hizo cargo de decir que sí. Y
 *    **`solo` no vuelve**: se retiró (`BR-29` punto 4), y `additionalProperties: false` es la
 *    guarda.
 * 3. **Un renglón corto** (`CTR-16.5`). Es la regla que más defectos caza y la más barata.
 * 4. **La leyenda de `CTR-16.10`**: el molinete de uno solo dice de qué elemento es, y ningún
 *    otro lo dice (`CTR-16.10.9`).
 * 5. **Un tesoro para cada uno** (`CTR-16.4` enmendado por `D-47`): el que servía para los dos no
 *    valida, y la leyenda trae exactamente uno de cada uno (`E9`, más abajo).
 *
 * Cada caso trae su control en verde al lado, y no es adorno: sin él, un test que solo mira
 * el rojo pasa igual con un schema que rechaza todo.
 */

interface MecanismoDePrueba {
  id: string;
  en: [number, number];
  abre: string[];
  /** Solo para escribir el caso en rojo de que el campo retirado no vuelva. */
  sostenido?: boolean;
}

interface BancoDePrueba {
  ancho: number;
  leyenda: Record<string, { tipo: string; elemento?: string; devuelve?: string[] }>;
  niveles: {
    estado: string;
    grilla: string[];
    mecanismos: MecanismoDePrueba[];
    compuertas: { id: string; en: [number, number] }[];
    /** `solo` es opcional acá solo para poder escribir el caso en rojo de que no vuelva. */
    verificaciones: { deDos: boolean; solo?: boolean };
  }[];
}

/** Una copia fresca del banco de verdad. `JSON.parse` ya devuelve una nueva cada vez. */
function bancoSkayboy(): BancoDePrueba {
  return JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as BancoDePrueba;
}

function erroresSkayboy(banco: BancoDePrueba): readonly string[] {
  return erroresDeInstancia(banco, 'skayboy');
}

/**
 * El nivel 1 con una placa y una compuerta de tres celdas dibujadas, para que un mecanismo tenga
 * dónde estar: la placa en la columna 4 y la compuerta en la 8, colgada de un ladrillo. Es la
 * forma de `CTR-16.10.1`, y pasa las reglas de `niveles.ts`.
 */
function conPlacaYCompuerta(banco: BancoDePrueba, abre: string[]): BancoDePrueba {
  const n = banco.niveles[0];
  const cambia = (fila: number, columna: number, caracter: string): void => {
    n.grilla[fila] = n.grilla[fila].slice(0, columna) + caracter + n.grilla[fila].slice(columna + 1);
  };
  cambia(4, 8, '#');
  for (const fila of [5, 6, 7]) cambia(fila, 8, '|');
  // En la 4 y no en la 3, que es donde está la guitarra: pisarla deja el nivel con un cigarrillo y
  // ninguna guitarra, y eso es E10 (D-47), no lo que estos casos prueban.
  cambia(7, 4, '=');
  n.mecanismos.push({ id: 'MEC-01', en: [4, 7], abre });
  n.compuertas.push({ id: 'COM-01', en: [8, 5] });
  return banco;
}

test('CTR-16.10 (E3): un mecanismo que abre una compuerta que no existe no pasa', () => {
  const roto = conPlacaYCompuerta(bancoSkayboy(), ['COM-02']);
  assert.deepEqual(erroresSkayboy(roto), [], 'control: la forma es válida, y el schema no puede ver más que la forma');
  const problemas = problemasDelBanco(roto as unknown as Banco);
  assert.ok(
    problemas.some((p) => p.includes('MEC-01 abre COM-02') && p.includes('(E3)')),
    `El abre a una compuerta que no está tenía que caerse acá, nombrado:\n${problemas.join('\n')}`,
  );
  const sano = conPlacaYCompuerta(bancoSkayboy(), ['COM-01']);
  assert.deepEqual(problemasDelBanco(sano as unknown as Banco), [], 'Con el abre a la compuerta de verdad tenía que pasar');
  assert.deepEqual(erroresSkayboy(sano), []);
});

test('CTR-16.10.9: el prefijo viejo de `abre` y el `sostenido` retirado no validan', () => {
  const conPue = conPlacaYCompuerta(bancoSkayboy(), ['PUE-01']);
  assert.ok(
    erroresSkayboy(conPue).some((e) => e.startsWith('/niveles/0/mecanismos/0/abre/0 ')),
    `«PUE-01» no nombra ninguna pieza del juego y el schema tenía que rechazarlo:\n${erroresSkayboy(conPue).join('\n')}`,
  );
  const conSostenido = conPlacaYCompuerta(bancoSkayboy(), ['COM-01']);
  conSostenido.niveles[0].mecanismos[0].sostenido = true;
  assert.ok(
    erroresSkayboy(conSostenido).some((e) => e.startsWith('/niveles/0/mecanismos/0 ') && e.includes('additional properties')),
    `«sostenido» se fue con CTR-16.6 enmendado y no puede volver:\n${erroresSkayboy(conSostenido).join('\n')}`,
  );
});

test('CTR-16.10.9: el molinete de uno solo dice su elemento, y el de los dos no', () => {
  const sinElemento = bancoSkayboy();
  delete sinElemento.leyenda['C'].elemento;
  assert.ok(
    erroresSkayboy(sinElemento).some((e) => e.startsWith('/leyenda/C ')),
    `El cielo sin «elemento» tenía que caerse:\n${erroresSkayboy(sinElemento).join('\n')}`,
  );
  const alDeLosDos = bancoSkayboy();
  alDeLosDos.leyenda['X'].elemento = 'cielo';
  assert.ok(
    erroresSkayboy(alDeLosDos).some((e) => e.startsWith('/leyenda/X')),
    `El que devuelve a los dos no es de ningún elemento:\n${erroresSkayboy(alDeLosDos).join('\n')}`,
  );
  const aUnaPalanca = bancoSkayboy();
  aUnaPalanca.leyenda['/'].elemento = 'infierno';
  assert.ok(erroresSkayboy(aUnaPalanca).some((e) => e.startsWith('/leyenda/~1')), 'una palanca no es de ningún elemento');
  assert.deepEqual(erroresSkayboy(bancoSkayboy()), [], 'control: la leyenda de verdad valida');
});

test('CTR-16.7: un nivel `listo` con `deDos` en false no valida', () => {
  const roto = bancoSkayboy();
  roto.niveles[0].estado = 'listo';
  roto.niveles[0].verificaciones = { deDos: false };
  const errores = erroresSkayboy(roto);
  assert.ok(
    errores.some((e) => e.includes('/niveles/0/verificaciones/deDos')),
    `El schema tenía que pedir la pasada de dos personas y pidió otra cosa:\n${errores.join('\n')}`,
  );

  const sano = bancoSkayboy();
  sano.niveles[0].estado = 'listo';
  sano.niveles[0].verificaciones = { deDos: true };
  assert.deepEqual(erroresSkayboy(sano), [], 'Con la pasada de a dos anotada tenía que validar');
});

/**
 * La baja de `solo` (`BR-29` punto 4, `CTR-16.7` versión 2), vista en rojo: un `solo` que vuelve
 * por costumbre —copiado de un nivel viejo o de un ejemplo— no valida. `erroresDeInstancia()` no
 * imprime el nombre del campo sobrante, así que se mira el lugar y la queja, que es lo que
 * `CTR-16.7` pidió mirar.
 */
test('CTR-16.7: un `solo` de más en `verificaciones` no valida, aunque `deDos` esté en true', () => {
  const roto = bancoSkayboy();
  roto.niveles[0].estado = 'listo';
  roto.niveles[0].verificaciones = { deDos: true, solo: true };
  const errores = erroresSkayboy(roto);
  assert.ok(
    errores.some((e) => e.startsWith('/niveles/0/verificaciones ') && e.includes('additional properties')),
    `El schema tenía que rechazar el booleano retirado y dijo otra cosa:\n${errores.join('\n')}`,
  );
  // Control: el mismo banco sin el campo de más valida.
  delete roto.niveles[0].verificaciones.solo;
  assert.deepEqual(erroresSkayboy(roto), []);
});

test('CTR-16.5: un renglón más corto que el ancho no valida', () => {
  const roto = bancoSkayboy();
  roto.niveles[0].grilla[1] = roto.niveles[0].grilla[1].slice(0, -1);
  const errores = erroresSkayboy(roto);
  assert.ok(
    errores.some((e) => e.includes('/niveles/0/grilla/1')),
    `El schema tenía que señalar el renglón corto y señaló otra cosa:\n${errores.join('\n')}`,
  );

  assert.deepEqual(erroresSkayboy(bancoSkayboy()), [], 'El banco sin tocar tenía que validar');
});

/**
 * La mitad que ningún schema puede hacer, y por eso vive en `niveles.ts`: que cada caracter
 * de la grilla esté declarado en la leyenda, y que los renglones se midan contra el `ancho`
 * del propio dato en vez de contra un número escrito en el código (`CTR-16.2`). JSON Schema
 * no sabe mirar un valor hermano; una función pura sí.
 */
test('CTR-16.5: la grilla se mide contra la leyenda y contra el `ancho` del dato', () => {
  const banco = JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as Banco;
  assert.deepEqual(problemasDelBanco(banco), []);

  const roto = bancoSkayboy();
  roto.niveles[0].grilla[4] = roto.niveles[0].grilla[4].replace('.', 'Z');
  const problemas = problemasDelBanco(roto as unknown as Banco);
  assert.ok(
    problemas.some((p) => p.includes('«Z»')),
    `Un caracter sin declarar tenía que caerse acá:\n${problemas.join('\n')}`,
  );
});

/**
 * ## Los tres molinetes (`CTR-16.4`), que es la regla que ningún schema sabe correr
 *
 * `FIND-58` dejó quién no pasa por dónde en un solo lugar —la leyenda— y de paso dejó una
 * regla que JSON Schema no puede expresar: **contar los molinetes por lo que devuelven.**
 * `CTR-16.4` pide exactamente tres, y no tres cualesquiera: uno que devuelva solo a
 * `skayboy`, uno solo a `poligirl`, y uno a los dos.
 *
 * Por qué no la hace el schema, que el contrato ya explica y conviene repetir acá: `contains`
 * con `minContains`/`maxContains` cuenta adentro de un arreglo, y `leyenda` es un mapa.
 * Pasarla a arreglo para poder contar traería un defecto peor —dos entradas para el mismo
 * caracter, y la segunda pisa a la primera sin que nadie lo vea—, así que la cuenta se paga
 * acá, que es donde se puede hacer de verdad.
 *
 * **Y no es contabilidad.** El molinete que devuelve a los dos es lo que obliga a que alguna
 * vez los dos se cuiden del mismo obstáculo (`RES-61.1`): sin él el par no coopera, se turna,
 * y el nivel queda siendo un pasillo con dos cuerpos adentro. Los otros dos son la paridad de
 * `D-38` — uno cada uno, y no el mismo.
 */

interface TerrenoDePrueba {
  tipo: string;
  devuelve?: string[];
  elemento?: string;
}

type LeyendaDePrueba = Record<string, TerrenoDePrueba>;

/** La leyenda del banco de verdad, fresca. Es del archivo entero, no de cada nivel. */
function leyendaSkayboy(): LeyendaDePrueba {
  const banco = JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as {
    leyenda: LeyendaDePrueba;
  };
  return banco.leyenda;
}

/** A quién devuelve un molinete, siempre en el mismo orden, para poder agrupar por eso. */
function firmaDe(terreno: TerrenoDePrueba): string {
  return ['skayboy', 'poligirl'].filter((q) => (terreno.devuelve ?? []).includes(q)).join('+');
}

/** Los tres que tienen que estar, en el orden en que los nombra el contrato. */
const LOS_TRES_MOLINETES = [
  { firma: 'skayboy', a: 'solo a skayboy' },
  { firma: 'poligirl', a: 'solo a poligirl' },
  { firma: 'skayboy+poligirl', a: 'a los dos' },
] as const;

/**
 * Agrupa los molinetes de la leyenda por lo que devuelven y reclama cada vez que una de las
 * tres firmas no aparece exactamente una vez. Una firma que no es ninguna de las tres también
 * se reclama: un molinete que no devuelve a nadie es un tile que no hace nada y que alguien
 * va a leer como si hiciera algo.
 */
function problemasDeMolinetes(leyenda: LeyendaDePrueba): readonly string[] {
  const porFirma = new Map<string, string[]>();
  for (const [caracter, terreno] of Object.entries(leyenda)) {
    if (terreno.tipo !== 'molinete') continue;
    const firma = firmaDe(terreno);
    porFirma.set(firma, [...(porFirma.get(firma) ?? []), caracter]);
  }

  const problemas: string[] = [];
  for (const { firma, a } of LOS_TRES_MOLINETES) {
    const caracteres = porFirma.get(firma) ?? [];
    if (caracteres.length === 1) continue;
    const cuales = `«${caracteres.join('», «')}»`;
    problemas.push(
      caracteres.length === 0
        ? `no hay ningún molinete que devuelva ${a}, y CTR-16.4 pide exactamente uno`
        : `hay ${caracteres.length} molinetes que devuelven ${a} (${cuales}),` +
          ' y CTR-16.4 pide exactamente uno',
    );
  }
  for (const [firma, caracteres] of porFirma) {
    if (LOS_TRES_MOLINETES.some((m) => m.firma === firma)) continue;
    problemas.push(`«${caracteres.join('», «')}»: un molinete que no devuelve a nadie`);
  }
  // E7 (CTR-16.10.10): los dos de uno solo son uno de cielo y uno de infierno, no dos de cielo.
  // Es la misma razón que la cuenta de arriba: el schema no cuenta por contenido en un mapa.
  const deUnoSolo = Object.entries(leyenda).filter(([, t]) => t.tipo === 'molinete' && (t.devuelve ?? []).length === 1);
  for (const elemento of ['cielo', 'infierno']) {
    const cuales = deUnoSolo.filter(([, t]) => t.elemento === elemento).map(([c]) => c);
    if (cuales.length !== 1) {
      problemas.push(
        `hay ${cuales.length} molinete(s) de uno solo de ${elemento}` +
          (cuales.length > 0 ? ` («${cuales.join('», «')}»)` : '') +
          ', y CTR-16.10 pide uno de cielo y uno de infierno (E7)',
      );
    }
  }
  return problemas;
}

/**
 * El caracter del molinete que devuelve a esos y a nadie más. Se busca por lo que devuelve y
 * no por el caracter: qué letra le toca a cada uno es el reparto de `experiencia` con
 * `contenido`, y este test no tiene por qué enterarse cuando lo cambien.
 */
function molineteQueDevuelveA(leyenda: LeyendaDePrueba, ...quienes: string[]): string {
  const buscada = ['skayboy', 'poligirl'].filter((q) => quienes.includes(q)).join('+');
  const par = Object.entries(leyenda).find(
    ([, t]) => t.tipo === 'molinete' && firmaDe(t) === buscada,
  );
  if (par === undefined) throw new Error(`No hay molinete que devuelva a «${buscada}»`);
  return par[0];
}

test('CTR-16.4: la leyenda trae los tres molinetes, uno de cada uno', () => {
  const problemas = problemasDeMolinetes(leyendaSkayboy());
  assert.deepEqual(
    problemas,
    [],
    `La leyenda de verdad tenía que estar sana:\n${problemas.join('\n')}`,
  );
});

test('CTR-16.4: dos molinetes que devuelven a lo mismo no pasan', () => {
  const leyenda = leyendaSkayboy();
  const propio = molineteQueDevuelveA(leyenda, 'skayboy');
  const ajeno = molineteQueDevuelveA(leyenda, 'poligirl');
  leyenda[ajeno] = { tipo: 'molinete', devuelve: ['skayboy'] };

  const problemas = problemasDeMolinetes(leyenda);
  assert.ok(
    problemas.some((p) => p.includes('2 molinetes') && p.includes(propio) && p.includes(ajeno)),
    `Los dos que devuelven lo mismo tenían que caerse acá, nombrados:\n${problemas.join('\n')}`,
  );
  assert.ok(
    problemas.some((p) => p.includes('solo a poligirl')),
    `Y el que quedó sin el suyo también, que es la paridad de D-38:\n${problemas.join('\n')}`,
  );
});

test('CTR-16.4: sin el molinete que devuelve a los dos, el par se turna en vez de cooperar', () => {
  const leyenda = leyendaSkayboy();
  delete leyenda[molineteQueDevuelveA(leyenda, 'skayboy', 'poligirl')];

  const problemas = problemasDeMolinetes(leyenda);
  assert.ok(
    problemas.some((p) => p.includes('a los dos')),
    `El tercero no es opcional (RES-61.1) y tenía que reclamarse:\n${problemas.join('\n')}`,
  );
});
/**
 * El cuarto caso de la cuenta, que es el que faltaba. Probado el 2026-09-22: borrándole a
 * `problemasDeMolinetes` el reclamo de la firma que no es ninguna de las tres, los dieciocho
 * tests quedaban en verde. Esa rama estaba escrita y no la corría nadie, y una guarda que
 * nunca se vio en rojo no es una guarda.
 *
 * Lo que caza es un `devuelve` que no nombra a ninguno de los dos: una mayúscula de más, un
 * apodo, un `id` viejo de cuando el personaje se llamaba de otra manera. En el archivo de
 * disco lo caza también el `enum` del schema, y por eso parece de más; no lo es, porque esta
 * función mira la leyenda ya parseada y porque el defecto que deja pasar no es un caracter
 * mal escrito: es un tile dibujado en la grilla que no devuelve a nadie y que el que juega va
 * a leer como si devolviera. Un obstáculo que no obstaculiza es el pasillo de `RES-61.1` otra
 * vez, disfrazado.
 */
test('CTR-16.4: un molinete que no devuelve a ninguno de los dos tampoco pasa', () => {
  const leyenda = leyendaSkayboy();
  const compartido = molineteQueDevuelveA(leyenda, 'skayboy', 'poligirl');
  leyenda[compartido] = { tipo: 'molinete', devuelve: ['Poligirl'] };

  const problemas = problemasDeMolinetes(leyenda);
  assert.ok(
    problemas.some((p) => p.includes(compartido) && p.includes('no devuelve a nadie')),
    `El molinete mudo tenía que caerse acá, nombrado:\n${problemas.join('\n')}`,
  );
});

/**
 * **`E7` (`CTR-16.10.10`): los dos de uno solo son uno de cielo y uno de infierno.** Desde
 * `CTR-16.10`, `C` es cielo e `I` es infierno porque lo dice `elemento`, no la inicial; y el schema
 * obliga a cada uno a traerlo, pero no puede ver que no sean los dos del mismo. Se mira acá, en la
 * misma cuenta, porque es la misma razón: en un mapa no se cuenta por contenido.
 */
test('CTR-16.10 (E7): dos molinetes de uno solo del mismo elemento no pasan', () => {
  const leyenda = leyendaSkayboy();
  const infierno = molineteQueDevuelveA(leyenda, 'poligirl');
  leyenda[infierno] = { ...leyenda[infierno], elemento: 'cielo' };

  const problemas = problemasDeMolinetes(leyenda);
  assert.ok(
    problemas.some((p) => p.includes('2 molinete(s) de uno solo de cielo') && p.includes('(E7)')),
    `Dos de cielo tenían que caerse acá:\n${problemas.join('\n')}`,
  );
  assert.ok(problemas.some((p) => p.includes('0 molinete(s) de uno solo de infierno')), 'y el infierno que falta también');
  // Control: la leyenda de verdad tiene uno de cada uno.
  assert.deepEqual(problemasDeMolinetes(leyendaSkayboy()), []);
});

/**
 * ## Un tesoro para cada uno (`CTR-16.4` enmendado por `D-47`, `E9`)
 *
 * Skayboy junta guitarras y Poligirl cigarrillos, y el tesoro que servía para los dos se retiró.
 * Las dos mitades de la regla viven en dos lugares, por la misma razón que los molinetes:
 *
 * - **que un tesoro nombre a uno solo** lo hace el schema (`maxItems: 1` en la rama de `tesoro`);
 * - **que haya exactamente uno de cada uno en la leyenda** no lo puede hacer ningún schema, porque
 *   la leyenda es un mapa y en un mapa no se cuenta por contenido. Se cuenta acá.
 *
 * Qué objeto es cada uno no lo dice el dato (lo dibuja la sala, `tesoroSkayboy` y
 * `tesoroPoligirl`), así que esto busca por `para` y nunca por caracter.
 */
interface TesoroDePrueba {
  tipo: string;
  para?: string[];
}

function problemasDeTesoros(leyenda: Record<string, TesoroDePrueba>): readonly string[] {
  const problemas: string[] = [];
  for (const quien of ['skayboy', 'poligirl']) {
    const suyos = Object.entries(leyenda)
      .filter(([, t]) => t.tipo === 'tesoro' && (t.para ?? []).length === 1 && t.para?.[0] === quien)
      .map(([c]) => c);
    if (suyos.length === 1) continue;
    problemas.push(
      suyos.length === 0
        ? `no hay ningún tesoro de ${quien} en la leyenda, y CTR-16.4 pide exactamente uno (E9)`
        : `hay ${suyos.length} tesoros de ${quien} («${suyos.join('», «')}»), y CTR-16.4 pide exactamente uno (E9)`,
    );
  }
  return problemas;
}

function leyendaConTesoros(): Record<string, TesoroDePrueba> {
  return (JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as { leyenda: Record<string, TesoroDePrueba> }).leyenda;
}

/** El caracter del tesoro de ese personaje, buscado por dueño. */
function tesoroDe(leyenda: Record<string, TesoroDePrueba>, quien: string): string {
  const par = Object.entries(leyenda).find(([, t]) => t.tipo === 'tesoro' && t.para?.[0] === quien);
  if (par === undefined) throw new Error(`No hay tesoro de «${quien}»`);
  return par[0];
}

test('CTR-16.4 (E9): la leyenda trae un tesoro de skayboy y uno de poligirl, y ninguno de los dos', () => {
  assert.deepEqual(problemasDeTesoros(leyendaConTesoros()), []);
});

test('CTR-16.4 (E9): sin el tesoro de poligirl no pasa, y el reclamo la nombra', () => {
  const leyenda = leyendaConTesoros();
  delete leyenda[tesoroDe(leyenda, 'poligirl')];
  assert.deepEqual(problemasDeTesoros(leyenda), [
    'no hay ningún tesoro de poligirl en la leyenda, y CTR-16.4 pide exactamente uno (E9)',
  ]);
});

test('CTR-16.4 (E9): dos tesoros de skayboy no pasan, y el reclamo nombra los dos caracteres', () => {
  const leyenda = leyendaConTesoros();
  const guitarra = tesoroDe(leyenda, 'skayboy');
  leyenda.h = { tipo: 'tesoro', para: ['skayboy'] };
  const problemas = problemasDeTesoros(leyenda);
  assert.equal(problemas.length, 1, problemas.join('\n'));
  assert.ok(
    problemas[0]!.startsWith('hay 2 tesoros de skayboy') && problemas[0]!.includes(`«${guitarra}»`) && problemas[0]!.includes('«h»'),
    problemas[0],
  );
});

test('CTR-16.4 (D-47): el tesoro para los dos no valida, en /leyenda/o/para', () => {
  const banco = bancoSkayboy() as unknown as { leyenda: Record<string, TesoroDePrueba> };
  banco.leyenda.o = { tipo: 'tesoro', para: ['skayboy', 'poligirl'] };
  const errores = erroresSkayboy(banco as unknown as BancoDePrueba);
  assert.ok(
    errores.some((e) => e.startsWith('/leyenda/o/para') && e.includes('must NOT have more than 1 items')),
    `El tesoro de los dos tenía que caerse en el schema:\n${errores.join('\n')}`,
  );
  // Control: con uno solo en `para`, la misma entrada valida.
  banco.leyenda.o = { tipo: 'tesoro', para: ['poligirl'] };
  assert.deepEqual(erroresSkayboy(banco as unknown as BancoDePrueba), []);
});

/**
 * ## El primer nivel no devuelve a nadie a la entrada (`US-09` criterio 4)
 *
 * Es lo único que quedó de ese criterio cuando `FIND-59` se cerró a favor del contrato: las
 * dos entradas y las dos puertas rigen desde el nivel 1 y las hace cumplir el schema en todos
 * los niveles (`CTR-16.5` reglas 1 y 2), así que **lo que distingue al primero es que no se
 * puede perder** — ni molinete propio, ni molinete compartido, ni mecanismo, ni caja. Lo pidió
 * `producto` en su traspaso (`Docs/SUGERENCIAS/PRD-para-arquitectura-find-59-cerrado-la-puerta-del-nivel-1.md`)
 * y es de la misma familia que los tres molinetes de arriba: una regla sobre el contenido del
 * dato, que ningún schema puede correr y que sin este archivo no la corre nadie.
 *
 * **Por qué no choca con `CTR-16.4`, que es la duda que da al leerlo:** la leyenda declara los
 * tres molinetes y es del archivo entero; la grilla es de cada nivel. Que el primero no use
 * ninguno no le saca al archivo ni uno. Nadie tiene que meterle un charco al nivel 1 para que
 * el schema valide.
 *
 * ### Cómo se identifica "el primero", que no es una elección de este test
 *
 * **Por `id`, y `escalon` no sirve.** El escalón Fácil tiene dos niveles —el 1 y el 2— y el 2
 * es justamente el que mete el primer molinete propio (`PRD-skayboy-y-poligirl.md`, "Qué
 * enseña cada escalón"). Un test que mirara `escalon === 1` prohibiría lo que el nivel 2 tiene
 * que traer. Los `id` en cambio son `NIV-` más dos dígitos, se asignan en orden y no se
 * reutilizan (`CTR-16.5`, `Docs/IDS.md`): el más chico es el primero.
 *
 * **Y el piso son los `listo`**, que es lo único que la página sirve (`CTR-16.8`). Mientras no
 * haya ninguno —hoy el banco trae un solo nivel y está en `borrador`— la guarda mira el de
 * `id` más chico del archivo, para no dormirse hasta que alguien promueva.
 */

interface NivelDePrueba {
  id: string;
  estado: string;
  grilla: string[];
  mecanismos: unknown[];
  compuertas: unknown[];
}

interface PisoDePrueba {
  leyenda: LeyendaDePrueba;
  niveles: NivelDePrueba[];
}

/** El banco de verdad leído por el lado que le importa a esta regla: leyenda y niveles. */
function pisoSkayboy(): PisoDePrueba {
  return JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as PisoDePrueba;
}

/**
 * Los tipos que el primer nivel no usa (`CTR-16.5`, con la lista que creció en `CTR-16.10`): el
 * molinete y las cuatro piezas. El resto del piso los usa todos.
 */
const TIPOS_QUE_NO_ENTRAN: readonly string[] = ['molinete', 'palanca', 'placa', 'compuerta', 'caja'];

function primerNivelDelPiso(piso: PisoDePrueba): NivelDePrueba {
  const porId = [...piso.niveles].sort((a, b) => a.id.localeCompare(b.id));
  const primero = porId.find((n) => n.estado === 'listo') ?? porId[0];
  if (primero === undefined) throw new Error('El banco no trae ningún nivel');
  return primero;
}

/** El primer caracter de la leyenda que es de ese tipo. Para plantarlo en un caso en rojo. */
function caracterDeTipo(leyenda: LeyendaDePrueba, tipo: string): string {
  const par = Object.entries(leyenda).find(([, t]) => t.tipo === tipo);
  if (par === undefined) throw new Error(`La leyenda no declara ningún «${tipo}»`);
  return par[0];
}

/**
 * Lo que el primer nivel no puede traer, mirado en los dos lados donde puede aparecer.
 *
 * La grilla es el que pidió `producto`. Los arreglos `mecanismos` y `compuertas` van también
 * porque una pieza declarada y no dibujada esquivaría la regla por un costado, y el criterio dice
 * *"no hay **en él** ningún elemento que devuelva a nadie a la entrada"*, no "no se ve
 * ninguno". *(Decía `mecanismos` y `cajas`: el arreglo `cajas` se fue con `CTR-16.10.1` —una caja
 * se dibuja en la grilla y no conecta con nada—, y entró `compuertas`.)*
 */
function problemasDelPrimerNivel(piso: PisoDePrueba): readonly string[] {
  const primero = primerNivelDelPiso(piso);
  const problemas: string[] = [];

  primero.grilla.forEach((renglon, fila) => {
    for (const caracter of renglon) {
      const tipo = piso.leyenda[caracter]?.tipo;
      if (tipo === undefined || !TIPOS_QUE_NO_ENTRAN.includes(tipo)) continue;
      problemas.push(
        `${primero.id}, renglón ${fila}: «${caracter}» es ${tipo},` +
          ' y en el primer nivel no entra nada que devuelva a la entrada (US-09 criterio 4)',
      );
    }
  });

  for (const [campo, cuantos] of [
    ['mecanismos', primero.mecanismos.length],
    ['compuertas', primero.compuertas.length],
  ] as const) {
    if (cuantos === 0) continue;
    problemas.push(
      `${primero.id}: declara ${cuantos} en «${campo}»,` +
        ' y en el primer nivel no entra nada que devuelva a la entrada (US-09 criterio 4)',
    );
  }

  return problemas;
}

test('US-09 criterio 4: el primer nivel del piso no trae molinete, palanca, placa, compuerta ni caja', () => {
  const problemas = problemasDelPrimerNivel(pisoSkayboy());
  assert.deepEqual(
    problemas,
    [],
    `El primero se aprende moviendo y nada lo devuelve a la entrada:\n${problemas.join('\n')}`,
  );
});

/**
 * El caso en rojo nombra los cinco **con la mano**, y no recorre `TIPOS_QUE_NO_ENTRAN`. Probado
 * el 2026-09-20: recorriendo la constante, sacarle `molinete` a la guarda dejaba los dieciocho
 * tests en verde — el caso en rojo se achicaba junto con la regla y nadie se enteraba. Un test
 * que le pregunta al código qué tiene que prohibir no prueba nada. *(Eran tres —molinete,
 * mecanismo y caja— hasta `CTR-16.10`, que partió el mecanismo en palanca y placa y sumó la
 * compuerta.)*
 */
test('US-09 criterio 4: un molinete, una palanca, una placa, una compuerta o una caja en el primero no pasan', () => {
  for (const tipo of ['molinete', 'palanca', 'placa', 'compuerta', 'caja']) {
    const piso = pisoSkayboy();
    const primero = primerNivelDelPiso(piso);
    const caracter = caracterDeTipo(piso.leyenda, tipo);
    const fila = primero.grilla.findIndex((renglon) => renglon.includes('.'));
    assert.ok(fila >= 0, 'El primer nivel tenía que tener aire donde plantar el caracter');
    primero.grilla[fila] = primero.grilla[fila].replace('.', caracter);

    const problemas = problemasDelPrimerNivel(piso);
    assert.ok(
      problemas.some((p) => p.includes(`«${caracter}»`) && p.includes(tipo)),
      `Un ${tipo} en el primer nivel tenía que caerse acá, nombrado:\n${problemas.join('\n')}`,
    );
  }
});

test('US-09 criterio 4: un mecanismo declarado y no dibujado tampoco pasa', () => {
  const piso = pisoSkayboy();
  primerNivelDelPiso(piso).mecanismos.push({ id: 'MEC-01', en: [7, 7], abre: ['COM-01'] });

  const problemas = problemasDelPrimerNivel(piso);
  assert.ok(
    problemas.some((p) => p.includes('«mecanismos»')),
    `Por el costado del arreglo tampoco entra:\n${problemas.join('\n')}`,
  );
});

/**
 * Y el mismo costado por el lado de las compuertas. El caso que había acá era *"una caja
 * declarada y no dibujada"*, y se fue con el arreglo `cajas` (`CTR-16.10.1`: la grilla es el único
 * lugar de una caja). Lo que sí se declara aparte de la grilla es el nombre de una compuerta, y es
 * la mitad de la guarda que tiene que verse en rojo: probado el 2026-09-22 con la de `cajas`,
 * sacarle el renglón a `problemasDelPrimerNivel` dejaba todo en verde.
 */
test('US-09 criterio 4: una compuerta declarada y no dibujada tampoco pasa', () => {
  const piso = pisoSkayboy();
  primerNivelDelPiso(piso).compuertas.push({ id: 'COM-01', en: [7, 5] });

  const problemas = problemasDelPrimerNivel(piso);
  assert.ok(
    problemas.some((p) => p.includes('«compuertas»')),
    `Por el costado del arreglo tampoco entra:\n${problemas.join('\n')}`,
  );
});

/**
 * ## La solución grabada (`CTR-18`), y los cinco rojos de `CTR-18.10`
 *
 * `skayboy-soluciones.json` valida arriba, en la lista, contra su schema. Eso prueba que el dato
 * bueno pasa; lo que `CTR-18.10` le pide a `T-267` es ver el dato malo rechazado, uno por uno, y
 * el ejemplo del contrato aceptado tal como está escrito. **El renglón que nombra dos columnas es
 * el que importa**: es lo que hace de esta la traza de una persona sola (`BR-25` b), y el formato
 * lo hace imposible de escribir. `soluciones.test.ts` lo vuelve a mirar del lado del lector.
 *
 * Qué no hace este schema, y por eso no se prueba acá: jugar las trazas, cruzarlas con los
 * niveles, ver dos renglones seguidos iguales, medir la tolerancia y contar la paridad. Eso es
 * `soluciones.test.ts` (`CTR-18.6`).
 */

/** El ejemplo de `CTR-18.9`, copiado del contrato sin tocar una coma. */
const EJEMPLO_CTR_18_9 = `{
  "contrato": "CTR-18",
  "contratoVersion": 1,
  "juego": "skayboy",
  "actualizado": "2026-09-22",
  "cuadrosPorSegundo": 60,
  "soluciones": {
    "NIV-01": {
      "deUno": [
        "s< 60",
        "p> 39"
      ]
    }
  }
}`;

interface SolucionesDePrueba {
  cuadrosPorSegundo: number;
  soluciones: Record<string, { deUno: string[] }>;
}

const ejemploDeSoluciones = (): SolucionesDePrueba => JSON.parse(EJEMPLO_CTR_18_9) as SolucionesDePrueba;

test('CTR-18.10: el ejemplo de CTR-18.9 valida tal como está', () => {
  assert.deepEqual(erroresDeInstancia(ejemploDeSoluciones(), 'skayboy-soluciones'), []);
});

for (const [caso, romper, lugar] of [
  [
    'un renglón que nombra dos columnas («s< p> 4»)',
    (s: SolucionesDePrueba) => (s.soluciones['NIV-01'].deUno[0] = 's< p> 4'),
    '/soluciones/NIV-01/deUno/0',
  ],
  ['un renglón con «<>» («s<> 4»)', (s: SolucionesDePrueba) => (s.soluciones['NIV-01'].deUno[0] = 's<> 4'), '/soluciones/NIV-01/deUno/0'],
  ['un renglón de cero cuadros («s< 0»)', (s: SolucionesDePrueba) => (s.soluciones['NIV-01'].deUno[0] = 's< 0'), '/soluciones/NIV-01/deUno/0'],
  [
    'una clave que no es NIV- y dos dígitos («NIV-1»)',
    (s: SolucionesDePrueba) => {
      s.soluciones['NIV-1'] = s.soluciones['NIV-01'];
      delete s.soluciones['NIV-01'];
    },
    '/soluciones',
  ],
  ['otra unidad (cuadrosPorSegundo: 50)', (s: SolucionesDePrueba) => (s.cuadrosPorSegundo = 50), '/cuadrosPorSegundo'],
] as const) {
  test(`CTR-18.10: ${caso} no valida`, () => {
    const roto = ejemploDeSoluciones();
    romper(roto);
    const errores = erroresDeInstancia(roto, 'skayboy-soluciones');
    assert.ok(
      errores.some((e) => e.startsWith(`${lugar} `)),
      `El schema tenía que señalar ${lugar} y señaló otra cosa:\n${errores.join('\n') || '(nada)'}`,
    );
  });
}

/* ==================================================================
   `CTR-20` ("Más o menos", `US-10`): los ejemplos del contrato y sus rojos

   `CTR-20.11` i1 pide que los cuatro ejemplos de `CTR-20.2` y `CTR-20.3` validen **copiados
   sin tocar una coma**. La manera de no tocar una coma es no copiarlos: el test los lee del
   documento. Si alguien cambia el ejemplo o el schema y dejan de coincidir, se entera acá.

   i2 son los rojos: cada caso sale de un ejemplo válido tocado en **un solo campo**, y el
   schema tiene que rechazarlo señalando ese lugar. Lo encontró `REV-16` (`FIND-83`): el
   archivo del juego se validaba, pero ningún rojo probaba que las reglas corrieran.
   ================================================================== */

/** Los bloques `json` de `CTR-20.2` y `CTR-20.3`, tal como están en el documento. */
function ejemplosDeCtr20(): { datos: Record<string, unknown>[]; palabras: Record<string, unknown>[] } {
  const doc = readFileSync('Docs/ARQ/ARQ-schema-mas-o-menos.md', 'utf-8').replace(/\r\n/g, '\n');
  const desde = doc.indexOf('### CTR-20.2');
  const hasta = doc.indexOf('### CTR-20.4');
  const bloques = [...doc.slice(desde, hasta).matchAll(/```json\n([\s\S]*?)\n```/g)].map(
    (m) => JSON.parse(m[1]!) as Record<string, unknown>,
  );
  return {
    datos: bloques.filter((b) => String(b.id).startsWith('MM-')),
    palabras: bloques.filter((b) => String(b.id).startsWith('MP-')),
  };
}

function bancoMasOMenos(datos: unknown[], palabras: unknown[] = []): unknown {
  return { contrato: 'CTR-20', contratoVersion: 1, actualizado: '2026-09-25', datos, palabras };
}

test('CTR-20 i1: los cuatro ejemplos del contrato validan, leídos del documento', () => {
  const { datos, palabras } = ejemplosDeCtr20();
  assert.deepEqual(
    [...datos, ...palabras].map((b) => b.id).sort(),
    ['MM-997', 'MM-998', 'MP-998', 'MP-999'],
    'el documento cambió de ejemplos: este test tiene que enterarse',
  );
  assert.deepEqual(erroresDeInstancia(bancoMasOMenos(datos, palabras), 'mas-o-menos'), []);
});

{
  const { datos, palabras } = ejemplosDeCtr20();
  const hecho = datos.find((d) => d.id === 'MM-998')!; // la-gente, medida compartida, hecho, año
  const segun = datos.find((d) => d.id === 'MM-997')!; // los-recitales, medida propia, "según", entero
  const palabra = palabras.find((p) => p.id === 'MP-999')!;

  const sin = (o: Record<string, unknown>, campo: string): Record<string, unknown> => {
    const { [campo]: _fuera, ...resto } = o;
    return resto;
  };

  const rojos: ReadonlyArray<readonly [string, unknown, string]> = [
    ['r1 una familia derivada, a mano', bancoMasOMenos([{ ...hecho, familia: 'los-discos' }]), '/datos/0/familia'],
    ['r2 una medida reservada', bancoMasOMenos([{ ...hecho, medida: 'duracion' }]), '/datos/0/medida'],
    ['r3 un "según" sin nombre', bancoMasOMenos([sin(segun, 'segun')]), '/datos/0'],
    ['r4 un hecho con "según"', bancoMasOMenos([{ ...hecho, segun: 'Clarín' }]), '/datos/0'],
    ['r5 un "según" en medida compartida', bancoMasOMenos([{ ...segun, medida: 'asistentes-recital', sujeto: 'el último' }]), '/datos/0'],
    ['r6 medida compartida sin sujeto', bancoMasOMenos([sin(hecho, 'sujeto')]), '/datos/0'],
    ['r7 medida propia con sujeto', bancoMasOMenos([{ ...hecho, medida: 'MM-998' }]), '/datos/0'],
    ['r8 un año con unidad', bancoMasOMenos([{ ...hecho, unidad: ['año', 'años'] }]), '/datos/0'],
    ['r9 una cantidad sin unidad', bancoMasOMenos([sin(segun, 'unidad')]), '/datos/0'],
    ['r10 un número que se deriva, copiado', bancoMasOMenos([{ ...hecho, fuente: 'RES-20' }]), '/datos/0/fuente'],
    ['r11 un año futuro', bancoMasOMenos([{ ...hecho, valor: 2027 }]), '/datos/0/valor'],
    ['r12 una palabra con su número escrito', bancoMasOMenos([], [{ ...palabra, temas: 7 }]), '/palabras/0'],
    ['r13 una forma con mayúscula', bancoMasOMenos([], [{ ...palabra, formas: ['Perro'] }]), '/palabras/0/formas/0'],
    ['r14 la oración de referencia que se retiró', bancoMasOMenos([{ ...hecho, comoReferencia: 'Skay nació en {n}.' }]), '/datos/0'],
  ];

  for (const [nombre, banco, lugar] of rojos) {
    test(`CTR-20 i2 🔴 ${nombre}: el schema lo rechaza en ${lugar}`, () => {
      const errores = erroresDeInstancia(banco, 'mas-o-menos');
      assert.ok(
        errores.some((e) => e === lugar || e.startsWith(`${lugar} `) || e.startsWith(`${lugar}/`)),
        `El schema tenía que señalar ${lugar} y señaló otra cosa:\n${errores.join('\n') || '(nada)'}`,
      );
    });
  }

  test('CTR-20 i2, el control: el mismo banco sin tocar valida', () => {
    assert.deepEqual(erroresDeInstancia(bancoMasOMenos([hecho, segun], [palabra]), 'mas-o-menos'), []);
  });
}

/**
 * ## "¿Qué tipo de ricotero sos?" (`CTR-08` v2.9): los rojos que el schema nunca había visto
 *
 * El schema de este juego entró en el ciclo 8 sin un solo caso en rojo, y la v2 le sumó la
 * noche en cinco momentos. Cada caso sale **del banco de verdad tocado en un solo campo** y
 * tiene que caer en el lugar que dice la tabla de `CTR-08` v2.9; el control en verde va al
 * final, con los dos ítems que pueden no tener momento (un `retirado` y un `borrador`).
 */
{
  interface ItemDePrueba {
    estado: string;
    eje: string;
    momento?: string;
    opciones: Record<string, unknown>[];
  }
  interface BancoDosEjes {
    contratoVersion: number;
    preguntasPorEje: number;
    momentos: Record<string, unknown>[];
    cuadrantes: Record<string, unknown>[];
    items: ItemDePrueba[];
  }
  const bancoDosEjes = (): BancoDosEjes => JSON.parse(readFileSync('src/data/dos-ejes.json', 'utf-8')) as BancoDosEjes;
  const primerListo = (b: BancoDosEjes, eje?: string): number => b.items.findIndex((i) => i.estado === 'listo' && (!eje || i.eje === eje));
  const tocado = (cambio: (b: BancoDosEjes) => string): [BancoDosEjes, string] => {
    const b = bancoDosEjes();
    return [b, cambio(b)];
  };

  const rojos: ReadonlyArray<readonly [string, () => [BancoDosEjes, string]]> = [
    ['e1 un ítem listo sin momento', () => tocado((b) => { const n = primerListo(b); delete b.items[n]!.momento; return `/items/${n}`; })],
    ['e2 un momento que la noche no tiene', () => tocado((b) => { const n = primerListo(b); b.items[n]!.momento = 'viaje'; return `/items/${n}/momento`; })],
    ['e3 cuatro momentos', () => tocado((b) => { b.momentos.pop(); return '/momentos'; })],
    ['e4 la ida antes que la previa', () => tocado((b) => { [b.momentos[0], b.momentos[1]] = [b.momentos[1]!, b.momentos[0]!]; return '/momentos/0/id'; })],
    ['e5 un momento con una clave de más', () => tocado((b) => { b.momentos[2]!['icono'] = 'vela'; return '/momentos/2'; })],
    ['e6 un nombre de cuadrante de 27 caracteres', () => tocado((b) => { b.cuadrantes[1]!['nombre'] = 'x'.repeat(27); return '/cuadrantes/1/nombre'; })],
    ['e7 una bajada de 241 caracteres', () => tocado((b) => { b.cuadrantes[2]!['bajada'] = 'x'.repeat(241); return '/cuadrantes/2/bajada'; })],
    ['e8 contratoVersion 1', () => tocado((b) => { b.contratoVersion = 1; return '/contratoVersion'; })],
    ['e9 un ítem de luz-oscuridad con una opción caos', () => tocado((b) => { const n = primerListo(b, 'luz-oscuridad'); b.items[n]!.opciones[1]!['polo'] = 'caos'; return `/items/${n}/opciones`; })],
    ['e10 una opción marcada correcta', () => tocado((b) => { const n = primerListo(b); b.items[n]!.opciones[0]!['correcta'] = true; return `/items/${n}/opciones/0`; })],
    ['e11 preguntasPorEje par', () => tocado((b) => { b.preguntasPorEje = 6; return '/preguntasPorEje'; })],
  ];

  for (const [nombre, armar] of rojos) {
    test(`CTR-08 v2.9 🔴 ${nombre}: el schema lo rechaza en su lugar`, () => {
      const [banco, lugar] = armar();
      const errores = erroresDeInstancia(banco, 'dos-ejes');
      assert.ok(
        errores.some((e) => e === lugar || e.startsWith(`${lugar} `) || e.startsWith(`${lugar}/`)),
        `El schema tenía que señalar ${lugar} y señaló otra cosa:\n${errores.join('\n') || '(nada)'}`,
      );
    });
  }

  test('CTR-08 v2.9, el control: un retirado y un borrador sin momento validan', () => {
    const b = bancoDosEjes();
    const retirado = b.items.findIndex((i) => i.estado === 'retirado');
    assert.ok(retirado >= 0, 'el banco ya no tiene retirados: este control tiene que enterarse');
    delete b.items[retirado]!.momento;
    const n = primerListo(b);
    b.items[n]!.estado = 'borrador';
    delete b.items[n]!.momento;
    assert.deepEqual(erroresDeInstancia(b, 'dos-ejes'), []);
  });
}
