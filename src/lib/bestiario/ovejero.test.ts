import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { CAIDA, OVEJERO_PERSONAJE, PIEZAS_OVEJERO } from './arte-ovejero.ts';
import { CRUEL, OVEJERO, OVEJERO_ARMADO, QUIETO, alRecinto, marcas, type Punto } from './rig-ovejero.ts';
import { VECINOS_DEL_MONTE, escenaMonte } from './escena-monte.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { PALO, PASTURA } from './rig.ts';
import { DURA, TOQUE_T, armarOvejeroCon, type Accion } from '../../scripts/bestiario/ovejero.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El ovejero (`D-73`, vigesimosexta vuelta): que sea un títere entero a aerógrafo echado en un manto negro en el
 * borde de la pastura, donde estaban sus ojos, el primero del elenco que vive en la pastura (en el recinto del monte
 * y en el claro del camino), que cuide sin conformarse, que tocado se pare y se ponga cruel, y que la pose de la
 * isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-ovejero';
const figura = capasDe('la-pastura', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_OVEJERO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--ovejero');

test('el ovejero es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--ovejero" data-id="el-ovejero" role="button" tabindex="0" aria-label="El ovejero">/);
  for (const p of ['entero', 'plato', 'huesos', 'cuerpo', 'cola', 'pata-tras-1', 'pata-del-1', 'erizo', 'pata-tras-2', 'cabeza', 'oreja-1', 'quijada', 'lengua', 'belfo', 'pupila', 'parpado', 'oreja-2', 'pata-del-2']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al ovejero le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_OVEJERO.map((p) => p.nombre).sort());
  for (const p of PIEZAS_OVEJERO) assert.match(p.nombre, /^ovejero-/);
  const A = OVEJERO_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`ovejero-pata-del-${n + 1}`, A.hombros[n]) && adentro('ovejero-cuerpo', A.hombros[n]), `la pata de adelante ${n + 1} no sale del hombro`);
    assert.ok(adentro(`ovejero-pata-tras-${n + 1}`, A.caderas[n]) && adentro('ovejero-cuerpo', A.caderas[n]), `la pata de atrás ${n + 1} no sale de la cadera`);
    assert.ok(adentro(`ovejero-oreja-${n + 1}`, A.orejas[n]) && adentro('ovejero-cabeza', A.orejas[n]), `la oreja ${n + 1} no sale de la cabeza`);
  }
  assert.ok(adentro('ovejero-cabeza', A.cuello) && adentro('ovejero-cuerpo', A.cuello), 'la cabeza no se apoya en el cogote');
  assert.ok(adentro('ovejero-cabeza', A.ojo.centro) && adentro('ovejero-parpado', A.ojo.centro) && adentro('ovejero-pupila', A.ojo.centro), 'el ojo no está en la cara');
  assert.ok(adentro('ovejero-quijada', A.quijada) && adentro('ovejero-cabeza', A.quijada), 'la quijada no cuelga de la cabeza');
  assert.ok(adentro('ovejero-cabeza', A.hocico) && adentro('ovejero-lengua', A.hocico) && adentro('ovejero-belfo', A.hocico), 'el hocico no está en la cara');
  assert.ok(adentro('ovejero-cola', A.cola) && adentro('ovejero-cuerpo', A.cola), 'la cola no sale del cuerpo');
  assert.ok(adentro('ovejero-plato', A.plato) && adentro('ovejero-huesos', A.plato) && adentro('ovejero-manto', A.plato), 'el plato no está en el manto');
  assert.ok(adentro('ovejero-erizo', A.lomo) && adentro('ovejero-cuerpo', A.lomo), 'el erizo no sale del lomo');
  for (const p of PIEZAS_OVEJERO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['ovejero-manto', 'ovejero-cuerpo', 'ovejero-cabeza', 'ovejero-plato']) assert.match(PIEZAS_OVEJERO.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_OVEJERO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 240, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del ovejero están en su bloque de tokens.css, medidas en Un baión, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el ovejero⟩'), tokens.indexOf('⟨/el ovejero⟩'));
  const usadas = new Set(PIEZAS_OVEJERO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-ovejero-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 15);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del ovejero`);
  assert.match(bloque, /un-baion-para-el-ojo-idiota/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el ovejero⟩ */'), sitio.indexOf('/* ⟨/el ovejero⟩ */'));
  assert.match(suyo, /\.titere--ovejero \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"huesos"'), 'los huesos se pueden tocar');
});

test('vive en la pastura: echado en el borde del claro, con el ojo donde estaba, en el recinto del monte y en el claro del camino', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'la-pastura');
  assert.equal(OVEJERO_PERSONAJE.ancla, OVEJERO.x);
  const [ox, oy] = VECINOS_DEL_MONTE[ID]!;
  const [ex, ey] = alRecinto([OVEJERO_ARMADO.ojo.centro[0], OVEJERO_ARMADO.ojo.centro[1] + CAIDA]);
  assert.ok(Math.hypot(ex - ox, ey - oy) < 6, `el ojo quedó en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  // En el borde de la izquierda del claro, sin meterse adentro ni taparle los ojos a nadie.
  const [mx0, my0, mw, mh] = caja('ovejero-manto');
  const [x0, y0] = alRecinto([mx0, my0]);
  const [x1, y1] = alRecinto([mx0 + mw, my0 + mh]);
  assert.ok(x1 < PALO.x - 40, `el manto llega a ${x1.toFixed(0)}, cerca del palo`);
  assert.ok(x0 > 0 && y1 < 640, 'el manto se sale del recinto');
  const enElClaro = ((ex - PALO.x) / PASTURA.rx) ** 2 + ((ey - PALO.y) / PASTURA.ry) ** 2 < 1;
  assert.ok(!enElClaro, 'el perro se metió en el claro');
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_MONTE)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > alRecinto([0, -170])[1] && vy < y1), `${id} queda adentro del ovejero`);
  }
  // En el recinto del monte va en la figura, después del piso y antes del cordero.
  const escena = escenaMonte(nombres);
  assert.ok(escena.indexOf('/bestiario/monte-cerca.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso le queda delante');
  assert.ok(escena.indexOf(`data-marco="${ID}"`) < escena.indexOf('titere--cordero'), 'el cordero le queda detrás');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  // En el camino va con el claro, corrido entero, y tampoco es ojos.
  const tramo = CAMINOS['la-pastura']!;
  const piso = pisoDelCamino(tramo, nombres);
  const m = /data-marco="el-ovejero" data-capa="figura" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no está en la pastura del camino');
  assert.equal(Number(m![1]), tramo.claro!.dx);
  assert.ok(!piso.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos en el camino');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarOvejeroCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  const [, y] = trasladoDe(marcas(QUIETO).transform.cuerpo);
  assert.equal(y, CAIDA);
});

test('cuida sin conformarse: mira al cordero, bosteza, se lame, aparta el plato, se rasca, gruñe, pestañea y colea', () => {
  const hechas: Record<Accion, number> = { mira: 0, bosteza: 0, lame: 0, aparta: 0, rasca: 0, grune: 0, cruel: 0 };
  let pestaneos = 0;
  const colas = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarOvejeroCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    for (let i = 1; i <= 60 * 60; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = /scale\(1 ([\d.]+)\)/.exec(dom.de('parpado', 'transform'));
      const k = p ? Number(p[1]) : 0;
      if (k > 0.9 && !cerrado) pestaneos++;
      cerrado = k > 0.9;
      if (i % 5 === 0) colas.add(dom.de('cola', 'transform'));
      // Sin tocarlo, no se para nunca.
      const [, y] = trasladoDe(dom.de('cuerpo', 'transform'));
      assert.ok(y > CAIDA - 0.1, `se paró sin que lo toquen: ${y}`);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['mira', 'bosteza', 'lame', 'aparta', 'rasca', 'grune'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.cruel, 0, 'se puso cruel sin que lo toquen');
  assert.ok(pestaneos >= 10, `pestañeó ${pestaneos} veces`);
  assert.ok(colas.size > 60, 'la cola no golpea el manto');
});

test('tocado se pone cruel: se para, se eriza, muestra los dientes, ladra tres veces, patea el plato, se vuelve a echar y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarOvejeroCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { parado: Infinity, erizo: 0, belfo: 0, ladridos: 0, plato: 0, huesos: 0, accion: '' };
  let abierta = false;
  for (let i = 1; i <= 60 * DURA.cruel; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const [, y] = trasladoDe(dom.de('cuerpo', 'transform'));
    visto.parado = Math.min(visto.parado, y);
    visto.erizo = Math.max(visto.erizo, Number(dom.de('erizo', 'opacity')));
    visto.belfo = Math.max(visto.belfo, Number(dom.de('belfo', 'opacity')));
    if (u > TOQUE_T.ladra[0] && u < TOQUE_T.ladra[1] + 0.3) {
      const q = /rotate\((-?[\d.]+)/.exec(dom.de('quijada', 'transform'));
      const ab = q ? Number(q[1]) > 24 : false;
      if (ab && !abierta) visto.ladridos++;
      abierta = ab;
    }
    const [px] = trasladoDe(dom.de('plato', 'transform'));
    visto.plato = Math.max(visto.plato, px);
    visto.huesos = Math.max(visto.huesos, Number(dom.de('huesos', 'opacity')));
    if (i === 60 * 3) visto.accion = vivo.estado().accion ?? '';
  }
  assert.ok(visto.parado < 1, `se paró hasta ${visto.parado.toFixed(0)}`);
  assert.ok(visto.erizo > 0.95 && visto.belfo > 0.95, 'no se erizó o no mostró los dientes');
  assert.equal(visto.ladridos, 3, `ladró ${visto.ladridos} veces`);
  assert.ok(visto.plato >= CRUEL.plato[0] * 0.98 && visto.huesos > 0.9, 'no pateó el plato');
  assert.equal(visto.accion, 'cruel');
  // Al final está echado otra vez.
  const [, y] = trasladoDe(dom.de('cuerpo', 'transform'));
  assert.ok(y > CAIDA - 0.5, `quedó parado: ${y}`);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de echado a parado, gruñendo, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarOvejeroCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('cuerpo', 'transform'), marcas(CRUEL).transform.cuerpo);
  assert.equal(dom.de('belfo', 'opacity'), '1');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('cuerpo', 'transform'), marcas(QUIETO).transform.cuerpo);
});
