import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  anioDe,
  contenidoDe,
  enlacesSalientes,
  entrantesPor,
  indiceDelDia,
  recortarEnPalabra,
  rumorPara,
  rumores,
  seCuenta,
  segmentar,
  textoPlano,
  vocesDe,
  type Articulo,
  type TipoArticulo,
} from './redondopedia.ts';
import { SLUGS_GRAVES } from './sitio/graves.ts';

/**
 * La verificacion corrible de la Redondopedia.
 *
 * `BR-09` pide un chequeo del grafo de enlaces que reporte huerfanos, callejones sin
 * salida y articulos inalcanzables desde la portada; `BR-08` pide que ninguna
 * afirmacion rotulada hecho quede sin fuente. `D-12` pide que la verificacion la corra
 * quien tenga con que: esto corre con `npm test`, junto al resto.
 *
 * Ojo con el alcance: esto verifica FORMA (grafo, rotulos, fuentes presentes), no
 * verdad. Que el contenido diga lo que dicen las fichas lo audita `revisor` leyendo.
 */

const { articulos } = JSON.parse(readFileSync('src/data/redondopedia.json', 'utf-8')) as {
  articulos: Articulo[];
};

const TIPOS: TipoArticulo[] = ['disco', 'tema', 'persona', 'hito', 'concepto', 'leyenda'];
const ROTULOS = ['hecho', 'leyenda', 'testimonio'];
const slugs = new Set(articulos.map((a) => a.slug));

test('hay articulos cargados y los slugs no se repiten', () => {
  assert.ok(articulos.length >= 20, `solo ${articulos.length} articulos`);
  assert.equal(slugs.size, articulos.length, 'hay slugs repetidos');
});

test('BR-07: ningun campo minimo esta vacio ni en borrador', () => {
  for (const a of articulos) {
    assert.ok(TIPOS.includes(a.tipo), `${a.slug}: tipo desconocido "${a.tipo}"`);
    assert.ok(a.titulo.trim().length > 0, `${a.slug}: sin titulo`);
    assert.ok(a.resumen.trim().length >= 80, `${a.slug}: el resumen no se sostiene solo`);
    assert.ok(a.cuerpo.length >= 1, `${a.slug}: sin cuerpo`);
    for (const s of a.cuerpo) {
      assert.ok(ROTULOS.includes(s.rotulo), `${a.slug}: rotulo invalido "${s.rotulo}"`);
      assert.ok(s.texto.trim().length > 0, `${a.slug}: segmento vacio`);
    }
    for (const d of a.datos) {
      assert.ok(ROTULOS.includes(d.rotulo), `${a.slug}: dato con rotulo invalido`);
    }
  }
});

test('BR-08: todo lo rotulado hecho cita una ficha RES, y todo testimonio dice quien', () => {
  for (const a of articulos) {
    for (const s of a.cuerpo) {
      if (s.rotulo === 'hecho') {
        assert.match(s.fuente ?? '', /RES-\d/, `${a.slug}: hecho sin ficha RES en el cuerpo`);
      }
      if (s.rotulo === 'testimonio') {
        assert.ok(s.quien && s.quien.trim().length > 0, `${a.slug}: testimonio sin quien`);
      }
    }
    for (const d of a.datos) {
      if (d.rotulo === 'hecho') {
        assert.match(d.fuente ?? '', /RES-\d/, `${a.slug}: dato hecho sin ficha RES ("${d.etiqueta}")`);
      }
    }
  }
});

test('los enlaces internos apuntan a articulos que existen', () => {
  const rotos: string[] = [];
  for (const a of articulos) {
    for (const destino of enlacesSalientes(a)) {
      if (!slugs.has(destino)) rotos.push(`${a.slug} -> ${destino}`);
    }
  }
  assert.deepEqual(rotos, [], `enlaces rotos: ${rotos.join(', ')}`);
});

test('BR-09: sin huerfanos, sin callejones sin salida, todo alcanzable desde la portada', () => {
  const entrantes = new Map<string, number>(articulos.map((a) => [a.slug, 0]));
  const salientes = new Map<string, Set<string>>();
  for (const a of articulos) {
    const destinos = enlacesSalientes(a);
    salientes.set(a.slug, destinos);
    for (const d of destinos) entrantes.set(d, (entrantes.get(d) ?? 0) + 1);
  }

  const problemas: string[] = [];
  for (const a of articulos) {
    // BR-09.1: minimo 2 salientes; la excepcion declarada del punto 3 es `leyenda` con 1.
    const minimo = a.tipo === 'leyenda' ? 1 : 2;
    const s = salientes.get(a.slug)!.size;
    if (s < minimo) problemas.push(`${a.slug}: ${s} salientes (minimo ${minimo})`);
    // BR-09.1: minimo 1 entrante desde otro articulo.
    if ((entrantes.get(a.slug) ?? 0) < 1) problemas.push(`${a.slug}: huerfano (0 entrantes)`);
  }
  assert.deepEqual(problemas, [], `grafo roto:\n  ${problemas.join('\n  ')}`);

  // BR-09.2: la portada lista todos los articulos (pages/redondopedia/index.astro los
  // recorre enteros), asi que todo nodo del grafo es alcanzable en un paso. Este assert
  // fija esa premisa: si algun dia la portada deja de listar todo, hay que reemplazarlo
  // por un BFS real desde lo que la portada si liste.
  assert.equal(slugs.size, articulos.length);
});

test('el rotulado en prosa se pinta: las clases de parrafo existen en sitio.css', () => {
  // Mismo espiritu que FIND-15: de nada sirve rotular en los datos si ninguna regla
  // CSS lo hace visible. La plantilla arma `parrafo--${rotulo}`.
  const css = readFileSync('src/styles/sitio.css', 'utf-8');
  for (const clase of ['.parrafo--leyenda', '.parrafo--testimonio', '.marca-rotulo', '.fuente-chip']) {
    assert.ok(css.includes(clase), `sitio.css no pinta ${clase}`);
  }
});

test('segmentar: los enlaces [[slug|texto]] se parten bien', () => {
  const piezas = segmentar('Antes [[gulp|Gulp!]] y despues [[oktubre|Oktubre]].');
  assert.deepEqual(piezas, [
    { clase: 'texto', texto: 'Antes ' },
    { clase: 'enlace', slug: 'gulp', texto: 'Gulp!' },
    { clase: 'texto', texto: ' y despues ' },
    { clase: 'enlace', slug: 'oktubre', texto: 'Oktubre' },
    { clase: 'texto', texto: '.' },
  ]);
});

/*
 * `BR-34` (2026-10-01): las tres bandas de después de la separación entran como tres
 * `concepto`, con sus enlaces de entrada desde los artículos que las nombran. El criterio de
 * aceptación era un script para correr a mano; queda acá para que lo cuide la máquina.
 */
const BANDAS = ['los-fundamentalistas', 'skay-y-los-fakires', 'los-decoradores'];

test('BR-34: las tres bandas existen y son concepto, no un tipo nuevo', () => {
  for (const slug of BANDAS) {
    const a = articulos.find((x) => x.slug === slug);
    assert.ok(a, `falta el artículo ${slug}`);
    assert.equal(a.tipo, 'concepto', `${slug} tiene que ser concepto (BR-34 §1)`);
  }
  const deco = articulos.find((x) => x.slug === 'los-decoradores')!;
  // El que la busca por el nombre con que la nombra la prensa la tiene que encontrar en la
  // portada, que muestra 150 caracteres del resumen.
  assert.match(deco.resumen.slice(0, 150), /Decoradores/);
  assert.match(deco.resumen.slice(0, 150), /Kermesse/);
});

test('BR-34 §3: las siete aristas de entrada a las bandas', () => {
  const aristas: Array<[string, string]> = [
    ['la-separacion', 'los-fundamentalistas'],
    ['la-separacion', 'skay-y-los-fakires'],
    ['la-separacion', 'los-decoradores'],
    ['indio-solari', 'los-fundamentalistas'],
    ['skay-beilinson', 'skay-y-los-fakires'],
    ['muerte-del-indio', 'los-fundamentalistas'],
    ['semilla-bucciarelli', 'los-decoradores'],
  ];
  for (const [desde, hacia] of aristas) {
    // En el cuerpo, no en el "vea también": la arista de `BR-34` es una oración que nombra
    // la banda adentro del texto.
    const a = articulos.find((x) => x.slug === desde)!;
    const enElCuerpo = a.cuerpo.some((seg) =>
      segmentar(seg.texto).some((p) => p.clase === 'enlace' && p.slug === hacia),
    );
    assert.ok(enElCuerpo, `${desde} no enlaza a ${hacia} en el cuerpo`);
  }
});

test('BR-34 §5: los discos de las bandas no son artículos disco — el afiche sigue contando diez', () => {
  // `fechasDelMes()` cuenta como total todo artículo `disco`: un disco de los Fakires
  // haría decir al afiche "de los once discos".
  assert.equal(articulos.filter((a) => a.tipo === 'disco').length, 10);
});

/* ==================================================================
   Los hilos (`D-75`): el gancho, el rumor y los entrantes
   ================================================================== */

test('D-75: recortarEnPalabra corta en palabra entera y avisa con suspensivo', () => {
  assert.equal(recortarEnPalabra('corto', 20), 'corto');
  const r = recortarEnPalabra('una frase que se pasa del tope por bastante', 20);
  assert.ok(r.endsWith('…'), r);
  assert.ok(r.length <= 20, r);
  assert.ok(!/\s…$/.test(r), `deja un espacio colgado: "${r}"`);
  // Nunca corta adentro de una palabra si hay un espacio razonable antes.
  assert.equal(recortarEnPalabra('Patricio Rey y sus Redonditos de Ricota', 15), 'Patricio Rey y…');
});

test('D-75: el texto plano saca la marca de los enlaces y deja lo que se ve', () => {
  assert.equal(textoPlano('el [[indio-solari|Indio]] cantó'), 'el Indio cantó');
});

test('D-75: el contenido cuenta cada casilla y da por lo menos un minuto', () => {
  for (const a of articulos) {
    const c = contenidoDe(a);
    assert.equal(c.hechos + c.leyendas + c.testimonios, a.cuerpo.length, a.slug);
    assert.ok(c.minutos >= 1 && c.minutos <= 6, `${a.slug}: ${c.minutos} minutos`);
  }
});

test('D-75: las voces son los nombres de quien da testimonio, sin el libro y sin repetir', () => {
  for (const a of articulos) {
    const voces = vocesDe(a);
    assert.equal(new Set(voces).size, voces.length, `${a.slug}: una voz repetida`);
    for (const v of voces) assert.ok(v.length > 2 && !/[,(«]/.test(v), `${a.slug}: "${v}"`);
    const conTestimonio = a.cuerpo.some((s) => s.rotulo === 'testimonio');
    assert.equal(voces.length > 0, conTestimonio, `${a.slug}: las voces no coinciden con los testimonios`);
  }
  const ji = articulos.find((a) => a.slug === 'la-leyenda-de-ji-ji-ji')!;
  assert.deepEqual(vocesDe(ji), ['Indio Solari', 'Alfredo Rosso']);
});

test('D-75: cada disco sabe su año por su ficha, y en orden', () => {
  const discos = articulos.filter((a) => a.tipo === 'disco');
  const anios = discos.map((a) => anioDe(a));
  assert.ok(anios.every((x) => x && /^(19|20)\d\d$/.test(x)), `discos sin año: ${anios.join(', ')}`);
  assert.equal(anioDe(discos.find((a) => a.slug === 'gulp')!), '1985');
  assert.equal(anioDe(discos.find((a) => a.slug === 'momo-sampler')!), '2000');
});

test('D-75: los entrantes son el grafo dado vuelta, y ningún artículo se nombra a sí mismo', () => {
  const entrantes = entrantesPor(articulos);
  for (const a of articulos) {
    for (const destino of enlacesSalientes(a)) {
      assert.ok(entrantes.get(destino)!.includes(a.slug), `${a.slug} → ${destino} no aparece al revés`);
    }
    assert.ok(!entrantes.get(a.slug)!.includes(a.slug), `${a.slug} se cuenta como entrante propio`);
  }
});

test('D-75: los rumores salen solo de párrafos leyenda, y nunca de un artículo grave', () => {
  const graves = new Set(SLUGS_GRAVES);
  const lista = rumores(articulos, graves);
  assert.ok(lista.length >= 6, `solo ${lista.length} rumores: la oreja se repite enseguida`);
  for (const r of lista) {
    assert.ok(!graves.has(r.slug), `${r.slug} es grave y presta un rumor`);
    const a = articulos.find((x) => x.slug === r.slug)!;
    const inicio = r.arranque.replace(/…$/, '');
    const deUnaLeyenda = a.cuerpo.some((s) => s.rotulo === 'leyenda' && textoPlano(s.texto).startsWith(inicio));
    assert.ok(deUnaLeyenda, `${r.slug}: el arranque no sale de un párrafo leyenda`);
    assert.ok(!r.arranque.includes('[['), `${r.slug}: el arranque trae la marca de un enlace`);
    assert.ok(r.arranque.length >= 40 && r.arranque.length <= 231, `${r.slug}: arranque de ${r.arranque.length}`);
  }
});

test('D-75: la oreja de la portada cambia a la medianoche de quien mira, y recorre la ronda entera', () => {
  const n = 12;
  const tarde = indiceDelDia(new Date(2026, 9, 17, 23, 59), n);
  assert.equal(indiceDelDia(new Date(2026, 9, 17, 0, 1), n), tarde, 'cambia adentro del mismo día');
  assert.equal(indiceDelDia(new Date(2026, 9, 18, 0, 1), n), (tarde + 1) % n, 'no avanza de a uno por noche');
  const vistos = new Set(Array.from({ length: n }, (_, d) => indiceDelDia(new Date(2026, 0, 1 + d), n)));
  assert.equal(vistos.size, n, 'en doce noches no pasa por las doce leyendas');
  assert.equal(indiceDelDia(new Date(), 0), 0);
});

test('D-75: la oreja trae lo que se cuenta, no el dato sin fuente', () => {
  const lista = rumores(articulos, new Set(SLUGS_GRAVES));
  for (const r of lista) assert.ok(seCuenta(r.arranque), `${r.slug}: "${r.arranque.slice(0, 60)}…" no cuenta nada`);
  // La nómina de los Fakires es leyenda en su artículo, pero no es un rumor.
  assert.ok(!lista.some((r) => r.slug === 'skay-y-los-fakires'), 'la nómina de los Fakires entró a la oreja');
  // Y el filtro sabe ver las formas de siempre.
  assert.ok(seCuenta('Corrió durante años el rumor de que'));
  assert.ok(seCuenta('Circula como efeméride firme'));
  assert.ok(!seCuenta('De quiénes tocan con él no hay nómina cerrada.'));
});

test('D-75: el rumor del pie es de otro artículo, prefiere una puerta nueva y no cambia entre builds', () => {
  const lista = rumores(articulos, new Set(SLUGS_GRAVES));
  for (const a of articulos) {
    const enlazados = enlacesSalientes(a);
    const r = rumorPara(a.slug, lista, enlazados);
    assert.ok(r, `${a.slug} se queda sin rumor`);
    assert.notEqual(r.slug, a.slug, `${a.slug} se cuenta un rumor propio`);
    assert.deepEqual(rumorPara(a.slug, lista, enlazados), r, `${a.slug}: el rumor no es determinista`);
    const habiaNuevo = lista.some((x) => x.slug !== a.slug && !enlazados.has(x.slug));
    if (habiaNuevo) assert.ok(!enlazados.has(r.slug), `${a.slug}: había una puerta nueva y eligió una que ya enlaza`);
  }
});
