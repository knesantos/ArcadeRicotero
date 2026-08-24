import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { enlacesSalientes, segmentar, type Articulo, type TipoArticulo } from './redondopedia.ts';

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
