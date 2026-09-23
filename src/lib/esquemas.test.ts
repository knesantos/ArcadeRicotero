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
 * ## Los niveles de Skayboy y Poligirl (`CTR-16`), y las tres reglas que hay que ver en rojo
 *
 * El archivo de arriba prueba que cada dato cumple su contrato. Eso alcanza mientras el
 * contrato sea una lista de tipos; `CTR-16` no lo es. Tiene **tres reglas que existen para
 * que algo no se pueda escribir**, y una regla así no se verifica mirando el dato bueno: se
 * verifica escribiendo el dato malo y confirmando que el schema lo rechaza.
 *
 * Las tres, y de dónde salen:
 *
 * 1. **`sostenido: true` sin `alternativaSolo`** (`CTR-16.6`, que es `D-40`/`D-43` hechos
 *    schema). Si un puzzle exige que dos cuerpos estén a la vez, tiene que existir escrita la
 *    segunda solución — si no, el que llega solo no juega, y eso es un molinete nuevo.
 * 2. **`estado: "listo"` sin las dos verificaciones** (`CTR-16.7`). `listo` cuesta dos
 *    pasadas, y el booleano no prueba que se jugó: prueba que alguien se hizo cargo de decir
 *    que sí.
 * 3. **Un renglón corto** (`CTR-16.5`). Es la regla que más defectos caza y la más barata.
 *
 * Cada caso trae su control en verde al lado, y no es adorno: sin él, un test que solo mira
 * el rojo pasa igual con un schema que rechaza todo.
 */

interface MecanismoDePrueba {
  id: string;
  en: [number, number];
  abre: string[];
  sostenido: boolean;
  alternativaSolo?: string;
}

interface BancoDePrueba {
  ancho: number;
  niveles: {
    estado: string;
    grilla: string[];
    mecanismos: MecanismoDePrueba[];
    verificaciones: { deDos: boolean; solo: boolean };
  }[];
}

/** Una copia fresca del banco de verdad. `JSON.parse` ya devuelve una nueva cada vez. */
function bancoSkayboy(): BancoDePrueba {
  return JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as BancoDePrueba;
}

function erroresSkayboy(banco: BancoDePrueba): readonly string[] {
  return erroresDeInstancia(banco, 'skayboy');
}

test('CTR-16.6: un mecanismo sostenido sin `alternativaSolo` no valida', () => {
  const mecanismo: MecanismoDePrueba = {
    id: 'MEC-01',
    en: [7, 7],
    abre: ['PUE-01'],
    sostenido: true,
  };

  const roto = bancoSkayboy();
  roto.niveles[0].mecanismos.push({ ...mecanismo });
  const errores = erroresSkayboy(roto);
  assert.ok(
    errores.some((e) => e.includes('alternativaSolo')),
    `El schema tenía que pedir la segunda solución y pidió otra cosa:\n${errores.join('\n')}`,
  );

  const sano = bancoSkayboy();
  sano.niveles[0].mecanismos.push({
    ...mecanismo,
    alternativaSolo: 'la caja de [7,9] tapa la placa y la deja abierta',
  });
  assert.deepEqual(erroresSkayboy(sano), [], 'Con la alternativa escrita tenía que validar');
});

test('CTR-16.7: un nivel `listo` sin las dos verificaciones no valida', () => {
  const roto = bancoSkayboy();
  roto.niveles[0].estado = 'listo';
  const errores = erroresSkayboy(roto);
  assert.ok(
    errores.some((e) => e.includes('/verificaciones/deDos')),
    `El schema tenía que pedir las dos pasadas y pidió otra cosa:\n${errores.join('\n')}`,
  );

  const sano = bancoSkayboy();
  sano.niveles[0].estado = 'listo';
  sano.niveles[0].verificaciones = { deDos: true, solo: true };
  assert.deepEqual(erroresSkayboy(sano), [], 'Con las dos jugadas anotadas tenía que validar');
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
  cajas: unknown[];
}

interface PisoDePrueba {
  leyenda: LeyendaDePrueba;
  niveles: NivelDePrueba[];
}

/** El banco de verdad leído por el lado que le importa a esta regla: leyenda y niveles. */
function pisoSkayboy(): PisoDePrueba {
  return JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as PisoDePrueba;
}

/** Los tres tipos que el primer nivel no usa. El resto del piso los usa todos. */
const TIPOS_QUE_NO_ENTRAN: readonly string[] = ['molinete', 'mecanismo', 'caja'];

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
 * La grilla es el que pidió `producto`. Los arreglos `mecanismos` y `cajas` van también porque
 * un mecanismo declarado y no dibujado esquivaría la regla por un costado, y el criterio dice
 * *"no hay **en él** ningún elemento que devuelva a nadie a la entrada"*, no "no se ve
 * ninguno".
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
    ['cajas', primero.cajas.length],
  ] as const) {
    if (cuantos === 0) continue;
    problemas.push(
      `${primero.id}: declara ${cuantos} en «${campo}»,` +
        ' y en el primer nivel no entra nada que devuelva a la entrada (US-09 criterio 4)',
    );
  }

  return problemas;
}

test('US-09 criterio 4: el primer nivel del piso no trae molinete, mecanismo ni caja', () => {
  const problemas = problemasDelPrimerNivel(pisoSkayboy());
  assert.deepEqual(
    problemas,
    [],
    `El primero se aprende moviendo y nada lo devuelve a la entrada:\n${problemas.join('\n')}`,
  );
});

/**
 * El caso en rojo nombra los tres **con la mano**, y no recorre `TIPOS_QUE_NO_ENTRAN`. Probado
 * el 2026-09-20: recorriendo la constante, sacarle `molinete` a la guarda dejaba los dieciocho
 * tests en verde — el caso en rojo se achicaba junto con la regla y nadie se enteraba. Un test
 * que le pregunta al código qué tiene que prohibir no prueba nada.
 */
test('US-09 criterio 4: un molinete, un mecanismo o una caja en el primero no pasan', () => {
  for (const tipo of ['molinete', 'mecanismo', 'caja']) {
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
  primerNivelDelPiso(piso).mecanismos.push({
    id: 'MEC-01',
    en: [7, 7],
    abre: ['PUE-01'],
    sostenido: false,
  });

  const problemas = problemasDelPrimerNivel(piso);
  assert.ok(
    problemas.some((p) => p.includes('mecanismos')),
    `Por el costado del arreglo tampoco entra:\n${problemas.join('\n')}`,
  );
});

/**
 * Y el mismo costado por el lado de las cajas, que es la mitad que faltaba. Probado el
 * 2026-09-22: sacándole a `problemasDelPrimerNivel` el renglón de `cajas`, los diecinueve
 * tests quedaban en verde. Esa mitad de la guarda estaba escrita y no la corría nadie, y una
 * guarda que nunca se vio en rojo no es una guarda.
 *
 * No es el caso de arriba con otro nombre: una caja empujable es un elemento propio —sirve de
 * escalón o de tapón (`RES-61.5`)— y se declara en su arreglo, aparte del mecanismo que abre.
 * El escalón Media es el que las trae. El nivel que se aprende moviendo no trae ninguna.
 */
test('US-09 criterio 4: una caja declarada y no dibujada tampoco pasa', () => {
  const piso = pisoSkayboy();
  primerNivelDelPiso(piso).cajas.push({ en: [7, 7] });

  const problemas = problemasDelPrimerNivel(piso);
  assert.ok(
    problemas.some((p) => p.includes('«cajas»')),
    `Por el costado del arreglo tampoco entra:\n${problemas.join('\n')}`,
  );
});
