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

function erroresDe(datos: string, esquema: string): readonly string[] {
  const s: unknown = JSON.parse(readFileSync(`src/data/_schema/${esquema}.schema.json`, 'utf-8'));
  const d: unknown = JSON.parse(readFileSync(`src/data/${datos}.json`, 'utf-8'));
  const validar = validador().compile(s);
  if (validar(d)) return [];
  return (validar.errors ?? []).map((e) => `${e.instancePath} ${e.message ?? ''}`.trim());
}

// Un archivo entra a esta lista **cuando existen el schema y el dato**, no antes: sumarlo
// con el dato sin escribir pinta el build de rojo por un archivo que nadie cargó todavía,
// y eso es ruido, no una guarda. `popularidad` y `dos-ejes` entraron en el ciclo 8, cada
// uno el día que su JSON apareció.
for (const archivo of ['quiz', 'letra', 'tapa', 'cancionero', 'popularidad', 'dos-ejes', 'por-la-letra'] as const) {
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
