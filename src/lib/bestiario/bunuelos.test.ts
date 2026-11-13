import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { BUNUELOS_PERSONAJE, PIEZAS_BUNUELOS } from './arte-bunuelos.ts';
import { FUENTE, FUENTE_ARMADA, LINEA, OFRECE, QUIETO, alRecinto, marcas } from './rig-bunuelos.ts';
import { GALPON } from './rig-entornos.ts';
import { escenaGalpon } from './escenas-entornos.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS, K_ENTORNO } from './camino.ts';
import { DURA, RUEDA, TOQUE_T, armarBunuelosCon, type Accion } from '../../scripts/bestiario/bunuelos.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * Los redonditos de ricota (`D-73`, vigesimoctava vuelta): la fuente de buñuelos de la mesita del galpón, hecha títere a
 * aerógrafo, al lado de la silla de Patricio Rey (que no se toca): humea, el de arriba rueda hasta el borde y no se
 * cae, las pinzas le erran, y tocada ofrece uno, grande, en las pinzas; y la pose de la isla es la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'redonditos-de-ricota';
const figura = capasDe('el-galpon', 'figura', nombres, 1, ID);
const nuevo = () => domDeJuguete([figura], 'titere--bunuelos');
const giro = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
const escala = (transform: string): number => Number(/scale\((-?[\d.]+)\)/.exec(transform)?.[1] ?? NaN);

test('la fuente es un títere entero: la pila, el de arriba, el vapor, las pinzas y el azúcar, cada uno con su imagen', () => {
  assert.match(figura, /<g class="titere titere--bunuelos" data-id="redonditos-de-ricota" role="button" tabindex="0" aria-label="Los redonditos de ricota"/);
  for (const p of ['entero', 'pila', 'tope', 'vapor-1', 'vapor-2', 'pinza', 'pinza-1', 'pinza-2', 'azucar']) assert.ok(figura.includes(`data-parte="${p}"`), `a la fuente le falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_BUNUELOS.map((p) => p.nombre).sort());
  for (const p of PIEZAS_BUNUELOS) assert.match(p.nombre, /^bunuelos-/);
  for (const p of PIEZAS_BUNUELOS) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['bunuelos-pila', 'bunuelos-tope']) assert.match(PIEZAS_BUNUELOS.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  // La pila lleva la receta de Patricia (hecho de la ficha, `RES-05`) y el buñuelo que se salió.
  const pila = PIEZAS_BUNUELOS.find((p) => p.nombre === 'bunuelos-pila')!.dibujo;
  assert.ok(pila.includes('m-bunuelos-suelto') && pila.includes('rotate(-9'), 'faltan el buñuelo suelto o la receta');
  // El de arriba está arriba de la pila y las pinzas apoyan sobre el plato.
  assert.ok(FUENTE_ARMADA.tope[1] < FUENTE_ARMADA.plato.y - 60);
  const peso = PIEZAS_BUNUELOS.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
  // La línea del toque: registro 1 (ocho palabras o menos, voseo, sin muletillas).
  assert.ok(LINEA.split(/\s+/).length <= 8 && /^Agarrá/.test(LINEA) && !/\b(che|viste|posta)\b/i.test(LINEA));
  assert.ok(figura.includes(`aria-description="${LINEA}"`));
});

test('las tintas de la fuente están en su bloque de tokens.css, medidas en En directo, y su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨los redonditos de ricota⟩'), tokens.indexOf('⟨/los redonditos de ricota⟩'));
  const usadas = new Set(PIEZAS_BUNUELOS.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-bunuelos-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 8);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de la fuente`);
  assert.match(bloque, /en-directo-interior-frontal\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  assert.match(sitio.slice(sitio.indexOf('/* ⟨los redonditos de ricota⟩ */'), sitio.indexOf('/* ⟨/los redonditos de ricota⟩ */')), /\.titere--bunuelos \{ cursor: pointer; \}/);
});

test('vive en la mesita de al lado de la silla: sobre su tapa, sin pisar a Patricio Rey, en el recinto y en el camino', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'el-galpon');
  assert.equal(BUNUELOS_PERSONAJE.ancla, FUENTE.x);
  // Apoya en la tapa de la mesita que pinta el galpón (40 arriba del pie).
  assert.equal(FUENTE.x, GALPON.fuente.x);
  assert.equal(FUENTE.piso, GALPON.fuente.piso - 40);
  // La silla vacía queda a la izquierda: su cosa (el toque de Patricio Rey) no se pisa con la fuente.
  const [x0] = alRecinto([-100, 0]);
  const [x1] = alRecinto([140, 0]);
  assert.ok(x0 > GALPON.silla.x + 50 + 4, `la fuente empieza en ${x0.toFixed(0)}, pisa la silla`);
  assert.ok(x1 < 900);
  const escena = escenaGalpon(nombres);
  assert.ok(escena.includes('data-id="patricio-rey"'), 'se perdió la silla de Patricio Rey');
  assert.ok(!escena.includes('data-id="redonditos-de-ricota" class="bestia'), 'sigue siendo una cosa');
  assert.ok(escena.includes(`data-marco="${ID}"`));
  // En el camino la fuente va con el galpón estirado.
  const tramo = CAMINOS['el-galpon']!;
  const piso = pisoDelCamino(tramo, nombres);
  const m = /data-marco="redonditos-de-ricota" data-capa="figura" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no está en el galpón del camino');
  assert.equal(Number(m![1]), Math.round(FUENTE.x * (K_ENTORNO - 1)));
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarBunuelosCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.equal(marcas(QUIETO).transform.azucar, 'translate(0 -10)');
  assert.equal(marcas(QUIETO).opacity.azucar, '0');
});

test('está servida: humea siempre; el de arriba rueda hasta el borde y no se cae, cae azúcar, las pinzas le erran y la pila se asienta', () => {
  const hechas: Record<string, number> = {};
  let rueda = 0;
  let alto = 0;
  let azucar = 0;
  let pinza = 0;
  let asienta = 0;
  let cerro = 0;
  const vapor = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarBunuelosCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 70; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const [x, y] = trasladoDe(dom.de('tope', 'transform'));
      rueda = Math.max(rueda, x - FUENTE_ARMADA.tope[0]);
      alto = Math.max(alto, y - FUENTE_ARMADA.tope[1]);
      azucar = Math.max(azucar, Number(dom.de('azucar', 'opacity')));
      pinza = Math.max(pinza, giro(dom.de('pinza', 'transform')));
      asienta = Math.max(asienta, 1 - Number(/scale\([\d.]+ ([\d.]+)\)/.exec(dom.de('pila', 'transform'))?.[1]));
      cerro = Math.max(cerro, giro(dom.de('pinza-1', 'transform')) * -1);
      if (i % 11 === 0) vapor.add(dom.de('vapor-1', 'transform'));
      // El de arriba no se cae nunca: no pasa del borde de la mesa.
      assert.ok(x - FUENTE_ARMADA.tope[0] < RUEDA.x + 12 && y - FUENTE_ARMADA.tope[1] < RUEDA.y + 8, 'se cayó de la mesa');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a] = (hechas[a] ?? 0) + n;
  }
  for (const a of ['rueda', 'espolvorea', 'agarra', 'asienta'] as Accion[]) assert.ok((hechas[a] ?? 0) > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque ?? 0, 0);
  assert.ok(rueda > RUEDA.x * 0.9 && alto > RUEDA.y * 0.9, 'no rodó hasta el borde');
  assert.ok(azucar > 0.5 && pinza > 20 && asienta > 0.03 && cerro > 5, 'no cayó azúcar, no se alzaron las pinzas o no se asentó');
  assert.ok(vapor.size > 40, 'no humea');
});

test('tocada ofrece uno: el de arriba sale grande hacia quien mira, sostenido en las pinzas, con el azúcar cayendo, se queda, vuelve a su lugar y dice su línea', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarBunuelosCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { escala: 0, avance: 0, alto: 0, pinza: 0, azucar: 0 };
  for (let i = 1; i <= 60 * DURA.toque; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const [x, y] = trasladoDe(dom.de('tope', 'transform'));
    visto.escala = Math.max(visto.escala, escala(dom.de('tope', 'transform')));
    visto.avance = Math.max(visto.avance, x - FUENTE_ARMADA.tope[0]);
    visto.alto = Math.max(visto.alto, FUENTE_ARMADA.tope[1] - y);
    visto.pinza = Math.max(visto.pinza, giro(dom.de('pinza', 'transform')));
    visto.azucar = Math.max(visto.azucar, Number(dom.de('azucar', 'opacity')));
    // Las pinzas siguen al de arriba: nunca quedan lejos de él mientras lo ofrece.
    if (i / 60 > TOQUE_T.ofrece[0] + 0.3 && i / 60 < TOQUE_T.ofrece[1] - 0.3) assert.ok(giro(dom.de('pinza', 'transform')) > 20, 'las pinzas soltaron al de arriba');
  }
  assert.ok(visto.escala > OFRECE.tope[3] * 0.95, `el de arriba creció ${visto.escala.toFixed(2)}`);
  assert.ok(visto.avance > OFRECE.tope[0] * 0.9, 'no salió hacia quien mira');
  assert.ok(visto.alto > 6, 'no saltó antes de salir');
  assert.ok(visto.pinza > 20 && visto.azucar > 0.5, 'las pinzas no lo agarraron o no cayó azúcar');
  // Vuelve a su lugar.
  const [x, y] = trasladoDe(dom.de('tope', 'transform'));
  assert.ok(Math.abs(x - FUENTE_ARMADA.tope[0]) < 2 && Math.abs(y - FUENTE_ARMADA.tope[1]) < 2, 'no volvió a la pila');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarla pasa de la fuente servida a la que ofrece, y dice su línea', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarBunuelosCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('tope', 'transform'), marcas(OFRECE).transform.tope);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('tope', 'transform'), marcas(QUIETO).transform.tope);
});
