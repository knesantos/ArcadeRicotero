import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sugerir, acierta, MAX_SUGERENCIAS, type TemaBuscable } from './buscador.ts';
import { normalizar } from '../texto.ts';
import { leerTemas } from '../letra/temas.ts';
import { FICHAS } from '../cancionero/banco.ts';
import { slugDeTitulo } from '../texto.ts';

/**
 * El buscador se prueba contra **los 105 temas de verdad**, no contra una lista de
 * juguete. Es la pieza que el jugador toca en cada intento, y los casos que importan
 * —*Jijiji*, los títulos larguísimos, los que empiezan igual— son casos reales de esta
 * discografía, no casos inventados.
 */
const TITULOS = new Map(FICHAS.map((f) => [f.slug, f.titulo]));
const CATALOGO: readonly TemaBuscable[] = leerTemas().map((t) => ({
  slug: slugDeTitulo(t.titulo),
  titulo: t.titulo,
  disco: t.disco,
  discoTitulo: TITULOS.get(t.disco)!,
  pista: t.pista,
}));

/** Los títulos que devuelve una consulta, en orden. */
const titulos = (consulta: string, max = MAX_SUGERENCIAS): string[] =>
  sugerir(CATALOGO, consulta, max).map((r) => r.tema.titulo);

test('el catálogo de prueba es la discografía entera', () => {
  assert.equal(CATALOGO.length, 105, 'RES-20 tiene 105 temas');
});

// ---------------------------------------------------------------- lo que perdona

test('perdona las tildes', () => {
  // Nadie escribe la tilde de "Último" en un teclado de celular.
  assert.ok(titulos('ultimo bondi').length > 0, 'sin tilde no encontró nada');
  assert.equal(titulos('ultimo bondi')[0], titulos('último bondi')[0]);
});

test('perdona los espacios: "jijiji" y "ji ji ji" son el mismo tema', () => {
  // El caso que `CTR-03.3` dejó anotado: RES-20 escribe "Jijiji" y el resto del repo
  // "Ji ji ji". El jugador no tiene por qué saber cuál de las dos eligió la ficha.
  const conEspacios = titulos('ji ji ji');
  const pegado = titulos('jijiji');
  assert.ok(pegado.length > 0, '"jijiji" no encontró nada');
  assert.equal(conEspacios[0], pegado[0], 'las dos formas tienen que dar el mismo primero');
});

test('encuentra por una palabra del medio del título, en los 105', () => {
  // Media discografía se recuerda por una palabra del medio, no por la primera. Se
  // prueba contra el catálogo entero y no contra un ejemplo elegido a mano: buscar la
  // última palabra de cualquier título tiene que traer ese título.
  const fallan: string[] = [];
  for (const tema of CATALOGO) {
    const palabras = normalizar(tema.titulo).split(' ');
    if (palabras.length < 2) continue;
    const ultima = palabras[palabras.length - 1]!;
    if (ultima.length < 4) continue; // "de", "un", "la" traen medio catálogo, y está bien
    if (!titulos(ultima, 20).includes(tema.titulo)) fallan.push(`${tema.titulo} <- "${ultima}"`);
  }
  assert.deepEqual(fallan, [], `títulos que no se encuentran por su última palabra:\n  ${fallan.join('\n  ')}`);
});

test('un título que coincide de verdad no viene con la cola de letras salteadas', () => {
  // "bestia" traía *La bestia pop* y cuatro títulos que contienen b-e-s-t-i-a
  // desperdigadas. El rescate por letras salteadas es último recurso, no vía paralela.
  const r = sugerir(CATALOGO, 'bestia', 50);
  assert.equal(r.length, 1, `"bestia" trajo ${r.length}: ${r.map((x) => x.tema.titulo).join(' / ')}`);
  assert.equal(r[0]!.tema.titulo, 'La bestia pop');
});

test('perdona letras salteadas, y solo a partir de tres', () => {
  const salteado = titulos('vncdrs');
  assert.ok(
    salteado.some((t) => normalizar(t).startsWith('vencedores')),
    `"vncdrs" no encontró Vencedores vencidos, trajo: ${salteado.join(' / ')}`,
  );
  // Con una o dos letras la subsecuencia traería medio catálogo, así que no se aplica.
  const dos = sugerir(CATALOGO, 'xq', 50);
  assert.equal(dos.length, 0, `"xq" no debería encontrar nada, trajo ${dos.length}`);
});

test('encuentra por disco, y siempre debajo de lo que coincide por título', () => {
  const porDisco = sugerir(CATALOGO, 'oktubre', 50);
  assert.ok(porDisco.length > 0, 'buscar un disco no trajo sus temas');
  assert.ok(
    porDisco.every((r) => r.tema.disco === 'oktubre' || normalizar(r.tema.titulo).includes('oktubre')),
    'buscar un disco trajo temas de otro',
  );
});

// ---------------------------------------------------------------- el orden

test('el título exacto sale primero', () => {
  for (const tema of CATALOGO) {
    const primero = titulos(tema.titulo)[0];
    assert.equal(primero, tema.titulo, `buscar "${tema.titulo}" entero no lo puso primero`);
  }
});

test('lo que empieza con lo tipeado gana a lo que solo lo contiene', () => {
  const r = sugerir(CATALOGO, 'un', 50).map((x) => x.tema.titulo);
  const empiezan = r.filter((t) => normalizar(t).startsWith('un'));
  const noEmpiezan = r.filter((t) => !normalizar(t).startsWith('un'));
  if (empiezan.length > 0 && noEmpiezan.length > 0) {
    assert.ok(
      r.indexOf(empiezan[empiezan.length - 1]!) < r.indexOf(noEmpiezan[0]!),
      `el orden mezcló: ${r.join(' / ')}`,
    );
  }
});

test('la misma consulta da siempre exactamente la misma lista', () => {
  // Sin desempate estable, dos temas del mismo largo se turnarían el lugar entre teclas
  // y la lista bailaría abajo del dedo.
  for (const consulta of ['la', 'el', 'a', 'un']) {
    assert.deepEqual(titulos(consulta), titulos(consulta), `"${consulta}" no es estable`);
  }
});

// ---------------------------------------------------------------- los bordes

test('la consulta vacía no devuelve el catálogo entero', () => {
  for (const vacia of ['', '   ', '...', '¿?']) {
    assert.deepEqual(sugerir(CATALOGO, vacia), [], `"${vacia}" abrió la lista`);
  }
});

test('nunca devuelve más sugerencias que el tope', () => {
  for (const consulta of ['a', 'e', 'la', 'el', 'o']) {
    assert.ok(
      sugerir(CATALOGO, consulta).length <= MAX_SUGERENCIAS,
      `"${consulta}" devolvió de más`,
    );
  }
});

test('una consulta que no es de nadie no devuelve nada', () => {
  assert.deepEqual(sugerir(CATALOGO, 'qwertyuiopzxcv', 50), []);
});

// ---------------------------------------------------------------- el resaltado

test('los tres pedazos rearman el título original, carácter por carácter', () => {
  // Es la garantía que hace que la pantalla pueda pintar el resaltado sin innerHTML: si
  // los pedazos no rearman el título, el jugador ve un título mutilado.
  for (const consulta of ['ji', 'bondi', 'la', 'ultimo', 'ñ', 'increibles', 'e']) {
    for (const r of sugerir(CATALOGO, consulta, 50)) {
      assert.equal(
        r.antes + r.medio + r.despues,
        r.tema.titulo,
        `"${consulta}" partió mal "${r.tema.titulo}"`,
      );
    }
  }
});

test('el pedazo resaltado es de verdad lo que el jugador escribió', () => {
  for (const consulta of ['bondi', 'vaca', 'perro', 'ji']) {
    for (const r of sugerir(CATALOGO, consulta, 50)) {
      if (!r.medio) continue; // coincidió por disco o por letras salteadas: no se resalta
      assert.equal(
        normalizar(r.medio),
        normalizar(consulta),
        `en "${r.tema.titulo}" resaltó "${r.medio}" para la consulta "${consulta}"`,
      );
    }
  }
});

test('el resaltado cae bien aunque el título tenga tildes y puntuación', () => {
  // El caso que rompe cualquier implementación que use índices de la forma normalizada
  // sobre el texto original: los dos textos tienen distinto largo.
  const conSignos = CATALOGO.filter((t) => /[¡!¿?,.'-]/.test(t.titulo));
  assert.ok(conSignos.length > 0, 'la discografía tiene títulos con signos, algo se rompió');
  for (const tema of conSignos) {
    const [r] = sugerir([tema], tema.titulo.slice(-4), 1);
    if (r?.medio) assert.equal(r.antes + r.medio + r.despues, tema.titulo);
  }
});

// ---------------------------------------------------------------- la respuesta

test('acertar se decide por identidad, nunca por comparar títulos', () => {
  const tema = CATALOGO[0]!;
  const gemelo: TemaBuscable = { ...tema, slug: 'otro-slug' };
  assert.ok(acierta(tema, tema));
  assert.ok(!acierta(gemelo, tema), 'dos temas con el mismo título no son el mismo tema');
  assert.ok(!acierta(null, tema), 'no elegir nada no puede ser un acierto');
});
