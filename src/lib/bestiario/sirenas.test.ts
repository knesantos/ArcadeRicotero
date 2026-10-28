import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_SIRENAS } from './arte-sirenas.ts';
import { AGUA, CANTAN, HONDO, QUIETO, SIRENAS, SIRENA_ARMADO, alRecinto, type Punto } from './rig-sirenas.ts';
import { VECINOS_DEL_BAJO } from './escenas.ts';
import { BAJO } from './rig.ts';
import { DURA, CANTAN_T, armarSirenasCon, type Accion } from '../../scripts/bestiario/sirenas.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * Las sirenas (`D-73`, vigesimosegunda vuelta): que sean dos títeres enteros a aerógrafo, en el agua del bajo
 * sin taparle nada a nadie, que el agua las corte en la cintura, que tocadas canten, golpeen el agua con la
 * cola, se zambullan y salgan, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'las-sirenas';
const figura = capasDe('el-bajo', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_SIRENAS.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--sirenas');

test('las sirenas son dos títeres enteros: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--sirenas" data-id="las-sirenas" role="button" tabindex="0" aria-label="Las sirenas">/);
  for (const k of [1, 2]) for (const p of ['entera', 'cola', 'salpica', 'cuerpo', 'pelo', 'cabeza', 'boca', 'brazo', 'ondas']) assert.ok(figura.includes(`data-parte="${p}-${k}"`), `a la sirena ${k} le falta ${p}`);
  for (const p of ['radio', 'canto']) assert.ok(figura.includes(`data-parte="${p}"`), `les falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_SIRENAS.map((p) => p.nombre).sort());
  const A = SIRENA_ARMADO;
  for (const n of [0, 1] as const) {
    const k = n + 1;
    assert.ok(adentro(`sirena-${k}-brazo`, A.hombro[n]) && adentro(`sirena-${k}-cuerpo`, A.hombro[n]), `el brazo de la ${k} no sale del hombro`);
    assert.ok(adentro(`sirena-${k}-brazo`, A.mano[n]), `la mano de la ${k} se sale del brazo`);
    assert.ok(adentro(`sirena-${k}-cara`, A.boca[n]) && adentro(`sirena-${k}-boca`, A.boca[n]), `la boca de la ${k} no está en la cara`);
    assert.ok(adentro(`sirena-${k}-cara`, A.cuello[n]) && adentro(`sirena-${k}-cuerpo`, A.cuello[n]), `la cabeza de la ${k} no se apoya en el cuello`);
    assert.ok(adentro(`sirena-${k}-cola`, [A.cola[n][0], 0]) && adentro(`sirena-${k}-salpica`, [A.cola[n][0], 0]), `la cola de la ${k} no sale del agua donde salpica`);
  }
  assert.ok(adentro('sirena-1-prendedor', A.prendedor) && adentro('sirena-1-radio', A.prendedor) && adentro('sirena-1-cuerpo', A.prendedor), 'el prendedor no está en la camisa');
  assert.ok(adentro('sirena-2-botin', A.mano[1]), 'el botín no está en la mano de la llena');
  for (const p of PIEZAS_SIRENAS) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['sirena-1-cuerpo', 'sirena-2-cuerpo', 'sirena-1-cara', 'sirena-2-cara']) assert.match(PIEZAS_SIRENAS.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_SIRENAS.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de las sirenas están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨las sirenas⟩'), tokens.indexOf('⟨/las sirenas⟩'));
  const usadas = new Set(PIEZAS_SIRENAS.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-sirenas-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 10);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de las sirenas`);
  assert.match(bloque, /gulp\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  assert.ok(sitio.includes('/* ⟨las sirenas⟩ */') && sitio.includes('.titere--sirenas'));
});

test('flotan en el agua de la derecha, cortadas en la cintura, sin taparle nada a nadie', () => {
  for (const n of [0, 1] as const) {
    assert.ok(SIRENAS[n].agua > BAJO.fondo, `la ${n + 1} no está en el agua`);
    // Lo que se zambulle queda debajo del corte entero.
    const [, arriba] = alRecinto(n, [0, -110 - HONDO]);
    assert.ok(arriba > SIRENAS[n].agua + AGUA * SIRENAS[n].escala, `la ${n + 1} no se tapa al zambullirse`);
  }
  assert.match(figura, new RegExp(`<clipPath id="sirena-agua-1"><rect x="-120" y="-260" width="240" height="${260 + AGUA}"/></clipPath>`));
  for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_BAJO)) {
    if (id === ID) continue;
    for (const n of [0, 1] as const) {
      const [x0, y0] = alRecinto(n, [-60, -110]);
      const [x1, y1] = alRecinto(n, [60, 10]);
      assert.ok(!(ox > x0 - 8 && ox < x1 + 8 && oy > y0 - 8 && oy < y1 + 8), `${id} queda adentro de la sirena ${n + 1}`);
    }
  }
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarSirenasCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('flotan: tararean, la gata se lava, la llena sacude el botín y colean', () => {
  const hechas: Record<Accion, number> = { tararean: 0, lava: 0, botin: 0, colean: 0, cantan: 0 };
  const alturas = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarSirenasCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 40; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      alturas.add(dom.de('cuerpo-1', 'transform'));
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['tararean', 'lava', 'botin', 'colean'] as const) assert.ok(hechas[a] > 0, `nunca hicieron ${a}`);
  assert.equal(hechas.cantan, 0, 'cantaron sin que las toquen');
  assert.ok(alturas.size > 100, 'no flotan');
});

test('tocadas cantan, golpean el agua con la cola, se zambullen y vuelven, y dicen su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarSirenasCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  let canto = 0;
  let radio = 0;
  let salpica = 0;
  let hondo = 0;
  let colaAfuera = false;
  for (let i = 1; i <= 60 * DURA.cantan; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    canto = Math.max(canto, Number(dom.de('canto', 'opacity')));
    radio = Math.max(radio, Number(dom.de('radio', 'opacity')));
    salpica = Math.max(salpica, Number(dom.de('salpica-1', 'opacity')));
    hondo = Math.max(hondo, trasladoDe(dom.de('cuerpo-2', 'transform'))[1]);
    if (t - 1 > CANTAN_T.golpean[0] + 0.25 && t - 1 < CANTAN_T.golpean[1]) colaAfuera ||= trasladoDe(dom.de('cola-1', 'transform'))[1] < 20;
  }
  assert.ok(canto > 0.8, 'no cantaron');
  assert.ok(radio > 0.9, 'no se prendió el prendedor');
  assert.ok(colaAfuera, 'no sacaron la cola para golpear');
  assert.ok(salpica > 0.5, 'no salpicaron');
  assert.ok(hondo > -HONDO * 0.95, `se hundieron ${hondo.toFixed(0)}`);
  assert.ok(Math.abs(trasladoDe(dom.de('cuerpo-1', 'transform'))[1]) < 6, 'no volvieron a salir');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueven: tocarlas las pasa de asomadas a cantando y dicen su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarSirenasCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('boca-1', 'opacity'), String(CANTAN.boca[0]));
  assert.equal(dom.de('radio', 'opacity'), String(CANTAN.radio));
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('radio', 'opacity'), String(QUIETO.radio));
});
