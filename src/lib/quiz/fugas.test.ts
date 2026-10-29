/**
 * Las fugas del banco de preguntas, auditadas a maquina.
 *
 * **Por que existe este archivo.** El banco ya tenia un guardian de *forma* —el schema de
 * `CTR-02`, `esquemas.test.ts`— y uno de *cantidad* —`pisos.test.ts`—, pero ninguno de
 * *dificultad real*. Un item puede validar contra el schema, cumplir el piso, leerse
 * perfecto por separado, y aun asi regalar la respuesta. Eso no se ve leyendo un item: se
 * ve mirando el conjunto, que es exactamente lo que a un humano se le escapa.
 *
 * Ya paso una vez y esta escrito en `ronda.ts`: en **25 de 30 items la correcta era la
 * primera opcion**, y no lo agarro nadie —ni `contenido`, ni el schema, ni tres
 * revisiones—. Aquel se arreglo barajando. Estos cuatro no se arreglan barajando, porque
 * viven en el texto:
 *
 *  1. **Fuga entre items.** El texto de un item contesta la pregunta de otro. Como `BR-01`
 *     sirve facil -> media -> dificil, solo importa cuando el que regala puede salir
 *     primero.
 *  2. **Sesgo de largo.** Si la correcta es sistematicamente la opcion mas larga, el que no
 *     sabe nada la elige por reflejo de examen.
 *  3. **Una categoria sin faciles.** `BR-01` abre toda partida con un facil. Una categoria
 *     con cero faciles no abre nunca ninguna partida.
 *  4. **El molinete del libro.** *Recuerdos que mienten un poco* es fuente de primera, pero
 *     el que no lo leyo no puede ni razonar la respuesta. Un item de memoir en `facil` es
 *     un molinete cerrado en la primera pantalla, justo lo que `D-14` prohibe.
 *
 * Lo que este archivo **no** puede auditar es la fuga semantica dentro de un mismo item —
 * "de que provincia del norte" con una sola provincia del norte entre las opciones. Eso lo
 * agarra el ojo de quien revisa; la vara esta en la tabla de fugas del informe del ciclo 9.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

type Dificultad = 'facil' | 'media' | 'dificil';

interface Item {
  readonly id: string;
  readonly categoria: string;
  readonly dificultad: Dificultad;
  readonly enunciado: string;
  readonly opciones: readonly { readonly texto: string; readonly correcta: boolean }[];
  readonly explicacion: string;
  readonly rotuloLeyenda?: string;
  readonly testimonio?: { readonly obra: string };
  readonly estado: string;
}

const ORDEN: Record<Dificultad, number> = { facil: 0, media: 1, dificil: 2 };
const CATEGORIAS = ['historia', 'discos', 'letras', 'mitologia'] as const;

const items: readonly Item[] = (
  JSON.parse(readFileSync('src/data/quiz.json', 'utf-8')) as { items: readonly Item[] }
).items.filter((i) => i.estado === 'listo');

const correcta = (i: Item): string => i.opciones.find((o) => o.correcta)!.texto;
const visible = (i: Item): string =>
  `${i.enunciado} ${i.explicacion} ${i.rotuloLeyenda ?? ''}`
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/**
 * Nombrar un disco no es contestar por el.
 *
 * Cada par de aca se miro de a uno y **la mencion no alcanza para responder**: el item que
 * la trae nombra el disco por otro motivo —de que tapa habla, de que disco es un tema— y
 * la pregunta del otro es sobre el año, el sello o el orden, que sigue sin decirse.
 *
 * Un par nuevo no se agrega para que pase el test: se agrega despues de leer los dos items
 * y poder escribir por que la mencion no contesta. Si contesta, se arregla el texto.
 */
const MENCION_SIN_RESPUESTA: readonly (readonly [string, string, string])[] = [
  // Vacia desde el ciclo 20 (`REV-22`, `FIND-143`): el ultimo par, QZ-026 → QZ-005, no
  // alcanzaba como perdon —compartian respuesta y opciones— y se arreglo en el texto.
];

const perdonado = (a: string, b: string): boolean =>
  MENCION_SIN_RESPUESTA.some(([x, y]) => x === a && y === b);

test('la lista de perdonados no tiene muertos: cada par nombra dos items en juego', () => {
  // `REV-22`: con el banco del ciclo 20 quedaron siete pares que nombraban items retirados.
  // No rompian nada, pero un perdon muerto es uno que alguien puede revivir sin mirar.
  const vivos = new Set(items.map((i) => i.id));
  const muertos = MENCION_SIN_RESPUESTA.filter(([a, b]) => !vivos.has(a) || !vivos.has(b));
  assert.deepEqual(muertos.map(([a, b]) => `${a} → ${b}`), []);
});

test('fuga 1: ningun item regala la respuesta de otro que BR-01 pueda servir despues', () => {
  const fugas: string[] = [];
  for (const b of items) {
    const resp = correcta(b);
    // Un numero suelto ("10", "1994") aparece en cualquier lado; se compara desde 4
    // caracteres, que es donde la coincidencia deja de ser casualidad.
    if (resp.length < 4) continue;
    const buscado = resp.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    for (const a of items) {
      if (a.id === b.id) continue;
      if (ORDEN[a.dificultad] > ORDEN[b.dificultad]) continue; // BR-01 lo sirve despues
      if (!visible(a).includes(buscado)) continue;
      if (perdonado(a.id, b.id)) continue;
      fugas.push(`${a.id} (${a.dificultad}) le regala a ${b.id} (${b.dificultad}) la respuesta «${resp}»`);
    }
  }
  assert.deepEqual(fugas, [], `hay fugas entre items:\n  ${fugas.join('\n  ')}`);
});

test('fuga 2: la correcta no es la opcion mas larga mas seguido que el azar', () => {
  const masLarga = items.filter((i) => {
    const largos = i.opciones.map((o) => o.texto.length);
    const tope = Math.max(...largos);
    return correcta(i).length === tope && largos.filter((l) => l === tope).length === 1;
  });
  // Con 4 opciones, el azar la pone mas larga ~25% de las veces. El tope deja margen para
  // que un item suelto no rompa el build, y falla si el sesgo se vuelve sistematico.
  const tope = Math.ceil(items.length * 0.35);
  assert.ok(
    masLarga.length <= tope,
    `en ${masLarga.length} de ${items.length} items la correcta es la unica mas larga (tope ${tope}): ` +
      masLarga.map((i) => i.id).join(', '),
  );
});

test('fuga 3: dos opciones de un mismo item nunca dicen lo mismo', () => {
  for (const i of items) {
    const textos = new Set(i.opciones.map((o) => o.texto.trim().toLowerCase()));
    assert.equal(textos.size, i.opciones.length, `${i.id} repite una opcion`);
  }
});

test('BR-01: toda categoria puede abrir una partida — minimo dos faciles cada una', () => {
  for (const categoria of CATEGORIAS) {
    const faciles = items.filter((i) => i.categoria === categoria && i.dificultad === 'facil');
    assert.ok(
      faciles.length >= 2,
      `la categoria ${categoria} tiene ${faciles.length} faciles: BR-01 abre siempre con un facil, ` +
        `asi que una categoria sin faciles no abre ninguna partida`,
    );
  }
});

test('D-14: ningun item facil depende de haber leido el memoir', () => {
  const memoir = /recuerdos que mienten un poco|memorias del indio/i;
  for (const i of items) {
    if (i.dificultad !== 'facil') continue;
    const deLibro = i.testimonio?.obra === 'Recuerdos que mienten un poco' || memoir.test(i.rotuloLeyenda ?? '');
    assert.ok(
      !deLibro,
      `${i.id} es facil y sale del memoir: el que no lo leyo no puede ni razonarlo, y BR-01 lo pone primero`,
    );
  }
});
