/**
 * El almanaque del portal (`D-84`, `sitio/almanaque.ts`).
 *
 * Los primeros tests corren contra las fichas reales, y son los que importan: cada afiche
 * afirma fechas, y eso tiene que seguir siendo lo que dicen las fichas, no lo que alguien
 * recuerda. Los demás prueban que la cuenta sabe dejar afuera lo que no es un hecho, y que
 * una leyenda entra solo cuando el mes la declara.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { cumpleDelDia, cumpleDelMes, fechasDelMes, mesDe, MESES, type FichaCruda } from './almanaque.ts';
import { ALMANAQUE } from './copy.ts';

const fichas = (): FichaCruda[] =>
  (JSON.parse(readFileSync('src/data/redondopedia.json', 'utf-8')) as { articulos: FichaCruda[] }).articulos;

const resumen = (tacos: ReturnType<typeof fechasDelMes>['tacos']) =>
  tacos.map((t) => `${t.dia}/${t.anio} ${t.slug}${t.rotulo === 'leyenda' ? ' (leyenda)' : ''}`);

test('octubre, con las fichas de hoy: seis de los diez discos, leídos como almanaque (por día)', () => {
  const { tacos, discosDelMes, totalDiscos } = fechasDelMes(fichas(), 'octubre');
  assert.equal(totalDiscos, 10);
  assert.equal(discosDelMes, 6);
  // A igual día, el más viejo primero. Los dos de 1993 salieron el mismo día y quedan en el
  // orden de las fichas: primero el vol. 1.
  assert.deepEqual(resumen(tacos), [
    '4/1986 oktubre',
    '4/1993 lobo-suelto',
    '4/1993 cordero-atado',
    '7/1989 bang-bang-estas-liquidado',
    '7/1996 luzbelito',
    '27/1991 la-mosca-y-la-sopa',
  ]);
});

test('octubre lo cuenta en letras, como siempre', () => {
  const { discosDelMes, totalDiscos } = fechasDelMes(fichas(), 'octubre');
  const octubre = ALMANAQUE.find((a) => a.mes === 'octubre')!;
  assert.equal(octubre.cuenta({ discosDelMes, totalDiscos }), 'De los diez discos, seis salieron en octubre.');
});

test('noviembre, con las fichas de hoy: la separación, los dos discos, las dos noches de Huracán y el Lozanazo', () => {
  const { tacos, discosDelMes } = fechasDelMes(fichas(), 'noviembre');
  assert.equal(discosDelMes, 2);
  // El principio y el final del mismo mes: el nombre nació el 26 del 77 y la separación se
  // oficializó el 2 de 2001. Las dos son `hecho` y el almanaque no elige.
  assert.deepEqual(resumen(tacos), [
    '2/2001 la-separacion',
    '17/2000 momo-sampler',
    '18/1998 ultimo-bondi-a-finisterre',
    '19/1993 huracan-93-94',
    '20/1993 huracan-93-94',
    '26/1977 la-formacion',
  ]);
});

test('D-85: noviembre se sube al último bondi sin Huracán, y el resto del mes sigue arriba', () => {
  const noviembre = ALMANAQUE.find((a) => a.mes === 'noviembre')!;
  const { tacos, discosDelMes } = fechasDelMes(fichas(), 'noviembre', { fuera: noviembre.fuera });
  assert.equal(discosDelMes, 2);
  assert.deepEqual(resumen(tacos), [
    '2/2001 la-separacion',
    '17/2000 momo-sampler',
    '18/1998 ultimo-bondi-a-finisterre',
    '26/1977 la-formacion',
  ]);
  // Lo que queda afuera es lo que el mes nombra y nada más: diciembre conserva sus noches del 94.
  assert.deepEqual(noviembre.fuera, ['huracan-93-94']);
  const { tacos: deDiciembre } = fechasDelMes(fichas(), 'diciembre');
  assert.ok(deDiciembre.some((t) => t.slug === 'huracan-93-94'));
});

test('D-85: el cumpleaños de noviembre es la salida de Último bondi, y el botón lleva a sus temas', () => {
  const noviembre = ALMANAQUE.find((a) => a.mes === 'noviembre')!;
  assert.deepEqual(noviembre.cumple, { slug: 'ultimo-bondi-a-finisterre', rotulo: 'hecho' });
  const { tacos } = fechasDelMes(fichas(), 'noviembre', { fuera: noviembre.fuera });
  const cumple = cumpleDelMes(tacos, noviembre.cumple)!;
  assert.equal(cumpleDelDia(new Date(2026, 10, 2), cumple), 'EL 18 CUMPLE 28');
  // El juego elige el disco por su slug (`partida-tema.ts`); un slug que no existe no elige nada.
  assert.equal(new URL(noviembre.boton.href, 'https://x').searchParams.get('disco'), noviembre.cumple.slug);
});

test('diciembre, con las fichas de hoy: Obras, Huracán 94 y, solo si el mes la declara, la fundación', () => {
  const sinLeyenda = fechasDelMes(fichas(), 'diciembre');
  assert.deepEqual(resumen(sinLeyenda.tacos), ['2/1989 debut-en-obras', '16/1994 huracan-93-94', '17/1994 huracan-93-94']);
  const conLeyenda = fechasDelMes(fichas(), 'diciembre', { leyendas: ['la-formacion'] });
  assert.deepEqual(resumen(conLeyenda.tacos), [
    '2/1989 debut-en-obras',
    '16/1994 huracan-93-94',
    '17/1994 huracan-93-94',
    '28/1976 la-formacion (leyenda)',
  ]);
});

test('D-84, regla 3: cada mes del almanaque tiene su cumpleaños con el rótulo que declara', () => {
  // Si una ficha cambia de rótulo —la fundación pasa a hecho, una salida pasa a discutida—,
  // esto se pone en rojo antes de que el portal imprima un afiche con el rótulo equivocado.
  for (const a of ALMANAQUE) {
    const { tacos } = fechasDelMes(fichas(), a.mes, { leyendas: a.leyendas, fuera: a.fuera });
    const cumple = cumpleDelMes(tacos, a.cumple);
    assert.ok(cumple, `${a.mes}: la ficha ${a.cumple.slug} ya no tiene su fecha rotulada ${a.cumple.rotulo}`);
    assert.equal(MESES.includes(a.mes), true);
  }
});

test('la leyenda entra solo con el ◆: ningún mes declara una leyenda que no sea su cumpleaños', () => {
  // Lo que un mes deja entrar como leyenda es exactamente lo que festeja con el rótulo a la
  // vista. Una leyenda suelta en los tacos, sin ser el cumpleaños, sería un ◆ sin estampa.
  for (const a of ALMANAQUE) {
    for (const slug of a.leyendas ?? []) {
      assert.equal(a.cumple.rotulo, 'leyenda', `${a.mes} deja entrar la leyenda de ${slug} sin festejarla`);
      assert.equal(a.cumple.slug, slug);
    }
  }
});

test('un botón del almanaque que lleva a En vivo apunta a una lista que existe, por su fecha', () => {
  // Noviembre llevaba a la lista del 19-11-1993 hasta `D-85`; la guarda queda para el mes que
  // vuelva a mandar a una noche.
  const archivo = JSON.parse(readFileSync('src/data/recitales.json', 'utf-8')) as { recitales: Array<{ fecha: string }> };
  for (const a of ALMANAQUE) {
    const m = /\/en-vivo\/#lista-(\d{4}-\d{2}-\d{2})$/.exec(a.boton.href);
    if (!m) continue;
    assert.ok(archivo.recitales.some((r) => r.fecha === m[1]), `${a.mes}: no hay lista del ${m[1]} en recitales.json`);
  }
});

test('UX-40 §5: en el portal, el rótulo de leyenda va pegado a la estampa, adentro de la misma cabeza', () => {
  // Si alguien recorta la estampa sola, "EL 28 CUMPLE 50" quedaría vestido de hecho. El rótulo
  // se imprime en la cabeza del afiche, justo después de la estampa, y en ningún otro lugar.
  const portal = readFileSync('src/pages/index.astro', 'utf-8');
  const cabeza = /<div class="afiche-cabeza">([\s\S]*?)<\/div>/.exec(portal);
  assert.ok(cabeza, 'no está la cabeza del afiche');
  assert.match(cabeza![1]!, /afiche-cumple[\s\S]*afiche-rotulo es-leyenda/, 'el rótulo no sigue a la estampa');
  assert.equal(portal.match(/afiche-rotulo/g)?.length, 1);
});

const ficha = (
  slug: string,
  tipo: string,
  datos: Array<[string, string, string?]>,
): FichaCruda => ({
  slug,
  tipo,
  titulo: slug,
  datos: datos.map(([etiqueta, valor, rotulo = 'hecho']) => ({ etiqueta, valor, rotulo })),
});

test('una fecha que no es un hecho no entra, salvo la leyenda que el mes declara', () => {
  const dudosas = [
    ficha('firme', 'disco', [['Salida', '4 de octubre de 1986']]),
    ficha('dudosa', 'disco', [['Salida', '4 de octubre de 1986', 'leyenda']]),
    ficha('contada', 'hito', [['Fecha', '4 de octubre de 1986', 'testimonio']]),
    ficha('rumor', 'hito', [['Fecha que circula', '28 de octubre de 1976', 'leyenda']]),
  ];
  assert.deepEqual(resumen(fechasDelMes(dudosas, 'octubre').tacos), ['4/1986 firme']);
  assert.deepEqual(resumen(fechasDelMes(dudosas, 'octubre', { leyendas: ['rumor'] }).tacos), [
    '4/1986 firme',
    '28/1976 rumor (leyenda)',
  ]);
});

test('un disco entra solo por su salida: las tres versiones de Gulp! no cumplen años', () => {
  const { tacos, discosDelMes, totalDiscos } = fechasDelMes(
    [
      ficha('a', 'disco', [['Fecha de salida', '4 de octubre de 1986, sin discrepancia entre fuentes']]),
      ficha('b', 'disco', [['Salida', '7 de octubre de 1996']]),
      ficha('c', 'disco', [['Salida', '18 de noviembre de 1998']]),
      ficha('d', 'disco', [['Año', '1985']]),
      ficha('gulp', 'disco', [
        ['Fecha exacta (versión A)', '22 de octubre de 1985, según una cronología'],
        ['Fecha exacta (versión B)', '20 de octubre de 1985, según otra'],
      ]),
    ],
    'octubre',
  );
  assert.deepEqual(resumen(tacos), ['4/1986 a', '7/1996 b']);
  assert.equal(discosDelMes, 2);
  assert.equal(totalDiscos, 5);
});

test('un hito entra por cualquier dato que empiece con un día; el año puede venir en la etiqueta', () => {
  const { tacos, discosDelMes, totalDiscos } = fechasDelMes(
    [
      ficha('cancha', 'hito', [
        ['Estadio', 'Tomás A. Ducó'],
        ['Fechas 1993', '19 y 20 de noviembre'],
        ['Público 1993', 'Más de 70.000 personas'],
        ['Fechas 1994', '16 y 17 de diciembre'],
      ]),
      ficha('sin-anio', 'hito', [['Fechas', '19 y 20 de noviembre']]),
      ficha('mudanza', 'hito', [['Mudanza', '1982']]),
      ficha('estable', 'hito', [['Formación estable', 'Desde 1987: cinco']]),
      ficha('una', 'hito', [['Primera presentación oficial', '26 de noviembre de 1977, Teatro Lozano ("el Lozanazo")']]),
      ficha('tema', 'tema', [['Fecha', '1 de noviembre de 1990']]),
    ],
    'noviembre',
  );
  assert.deepEqual(resumen(tacos), ['19/1993 cancha', '20/1993 cancha', '26/1977 una']);
  assert.equal(discosDelMes, 0);
  assert.equal(totalDiscos, 0);
});

test('el cumpleaños del mes es el taco de la ficha pedida con el rótulo pedido, o nada', () => {
  const tacos = fechasDelMes(
    [
      ficha('cancha', 'hito', [['Fechas 1993', '19 y 20 de noviembre']]),
      ficha('rumor', 'hito', [['Fecha que circula', '28 de noviembre de 1976', 'leyenda']]),
    ],
    'noviembre',
    { leyendas: ['rumor'] },
  ).tacos;
  // El primero de los dos días: la estampa cuenta desde el 19.
  assert.equal(cumpleDelMes(tacos, { slug: 'cancha', rotulo: 'hecho' })?.dia, 19);
  assert.equal(cumpleDelMes(tacos, { slug: 'rumor', rotulo: 'leyenda' })?.dia, 28);
  assert.equal(cumpleDelMes(tacos, { slug: 'rumor', rotulo: 'hecho' }), null);
  assert.equal(cumpleDelMes(tacos, { slug: 'otra', rotulo: 'hecho' }), null);
});

test('el mes: el nombre que la cabeza del portal y la isla ponen en data-mes', () => {
  assert.equal(mesDe(new Date(2026, 9, 1)), 'octubre');
  assert.equal(mesDe(new Date(2026, 9, 31)), 'octubre');
  assert.equal(mesDe(new Date(2026, 10, 1)), 'noviembre');
  assert.equal(mesDe(new Date(2026, 11, 28)), 'diciembre');
  assert.equal(mesDe(new Date(2027, 0, 1)), 'enero');
  assert.equal(MESES.length, 12);
});

test('la estampa del cumpleaños cambia el día, y los años los cuenta la fecha', () => {
  const salida = { dia: 4, anio: 1986 };
  assert.equal(cumpleDelDia(new Date(2026, 9, 1), salida), 'EL 4 CUMPLE 40');
  assert.equal(cumpleDelDia(new Date(2026, 9, 4), salida), 'HOY CUMPLE 40');
  assert.equal(cumpleDelDia(new Date(2026, 9, 5), salida), 'CUMPLIÓ 40 EL 4');
  assert.equal(cumpleDelDia(new Date(2027, 9, 2), salida), 'EL 4 CUMPLE 41');
  // Huracán, el 19; la fundación, el 28, que en diciembre de 2026 son cincuenta.
  assert.equal(cumpleDelDia(new Date(2026, 10, 19), { dia: 19, anio: 1993 }), 'HOY CUMPLE 33');
  assert.equal(cumpleDelDia(new Date(2026, 11, 1), { dia: 28, anio: 1976 }), 'EL 28 CUMPLE 50');
});
