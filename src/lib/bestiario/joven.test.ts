import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { JOVEN_PERSONAJE, PIEZAS_JOVEN } from './arte-joven.ts';
import { ARDE, JOVEN, JOVEN_ARMADO, QUIETO, alRecinto, marcas, type Punto } from './rig-joven.ts';
import { VECINOS_DEL_MONTE, escenaMonte } from './escena-monte.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { DURA, TOQUE_T, armarJovenCon, type Accion } from '../../scripts/bestiario/joven.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * El joven lobo (`D-73`, vigesimosexta vuelta): que sea un títere entero a aerógrafo en la cima de un volcán
 * arriba a la derecha del monte, donde estaban sus ojos, que se queme de adentro, que tocado arda y aúlle, y
 * que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-joven-lobo';
const figura = capasDe('el-monte', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_JOVEN.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--joven');

test('el joven lobo es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--joven" data-id="el-joven-lobo" role="button" tabindex="0" aria-label="El joven lobo">/);
  for (const p of ['entero', 'humo', 'lava', 'chispas', 'cola', 'cola-humo', 'rasca', 'cuerpo', 'brasa', 'llamas', 'pata-1', 'cabeza', 'oreja-1', 'quijada', 'parpado', 'oreja-2', 'aullido', 'corazon', 'pata-2']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al lobo le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_JOVEN.map((p) => p.nombre).sort());
  // Ninguna pieza suya se confunde con las del lobo suelto ni con las lobas.
  for (const p of PIEZAS_JOVEN) assert.match(p.nombre, /^joven-/);
  const A = JOVEN_ARMADO;
  assert.ok(adentro('joven-cabeza', A.ojo.centro) && adentro('joven-parpado', A.ojo.centro), 'el ojo no está en la cara');
  assert.ok(adentro('joven-cabeza', A.cuello) && adentro('joven-cuerpo', A.cuello), 'la cabeza no se apoya en el cogote');
  assert.ok(adentro('joven-quijada', A.quijada) && adentro('joven-cabeza', A.quijada), 'la quijada no cuelga de la cabeza');
  assert.ok(adentro('joven-cabeza', A.hocico) && adentro('joven-aullido', A.hocico), 'el hocico no está en la cara');
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`joven-oreja-${n + 1}`, A.orejas[n]) && adentro('joven-cabeza', A.orejas[n]), `la oreja ${n + 1} no sale de la cabeza`);
    assert.ok(adentro(`joven-pata-${n + 1}`, A.hombros[n]) && adentro('joven-cuerpo', A.hombros[n]), `la pata ${n + 1} no sale del hombro`);
  }
  assert.ok(adentro('joven-cola', A.cola) && adentro('joven-anca', A.cola), 'la cola no sale del anca');
  assert.ok(adentro('joven-cola', A.puntaCola) && adentro('joven-cola-humo', A.puntaCola), 'la punta de la cola no humea');
  assert.ok(adentro('joven-brasa', A.brasa) && adentro('joven-cuerpo', A.brasa), 'la brasa no está en el pecho');
  assert.ok(adentro('joven-llamas', A.llamas) && adentro('joven-cuerpo', A.llamas), 'las llamas no salen del lomo');
  assert.ok(adentro('joven-rasca', A.cadera) && adentro('joven-anca', A.cadera), 'la pata que se rasca no sale de la cadera');
  assert.ok(adentro('joven-lava', A.crater) && adentro('joven-volcan', A.crater), 'la lava no está en el cráter');
  for (const p of PIEZAS_JOVEN) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['joven-volcan', 'joven-cuerpo', 'joven-cabeza', 'joven-anca']) assert.match(PIEZAS_JOVEN.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_JOVEN.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 240, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del lobo están en su bloque de tokens.css, medidas en Lobo suelto, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el joven lobo⟩'), tokens.indexOf('⟨/el joven lobo⟩'));
  const usadas = new Set(PIEZAS_JOVEN.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-joven-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 14);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del lobo`);
  assert.match(bloque, /lobo-suelto-cordero-atado-cd1/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el joven lobo⟩ */'), sitio.indexOf('/* ⟨/el joven lobo⟩ */'));
  assert.match(suyo, /\.titere--joven \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"humo"') && suyo.includes('"chispas"'), 'el humo y las chispas se pueden tocar');
});

test('está en la cima del volcán, arriba a la derecha del monte, con el ojo donde estaba, y en el camino baja hasta el piso', () => {
  assert.equal(JOVEN_PERSONAJE.ancla, JOVEN.x);
  const [ox, oy] = VECINOS_DEL_MONTE[ID]!;
  const [ex, ey] = alRecinto(JOVEN_ARMADO.ojo.centro);
  assert.ok(Math.hypot(ex - ox, ey - oy) < 6, `el ojo quedó en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  // El volcán entra en el recinto, y no le pisa los ojos a nadie.
  const [vx0, vy0, vw, vh] = caja('joven-volcan');
  const [x0, y0] = alRecinto([vx0, vy0]);
  const [x1, y1] = alRecinto([vx0 + vw, vy0 + vh]);
  assert.ok(x1 <= 900 && y1 < 330 && x0 > 700, `el volcán va de ${x0.toFixed(0)},${y0.toFixed(0)} a ${x1.toFixed(0)},${y1.toFixed(0)}`);
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_MONTE)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > alRecinto([0, -170])[1] && vy < y1), `${id} queda adentro del lobo`);
  }
  // Va en la figura del recinto, después del piso del monte.
  const escena = escenaMonte(nombres);
  assert.ok(escena.indexOf('/bestiario/monte-cerca.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso le queda delante');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  // En el camino va adonde estaban sus ojos, y baja lo que diga el tramo, que es lo que le falta para pisar el piso.
  const tramo = CAMINOS['el-monte']!;
  const piso = pisoDelCamino(tramo, nombres);
  const m = /data-marco="el-joven-lobo" data-capa="figura" data-dx="(-?\d+)" transform="translate\((-?\d+) (-?\d+)\)"/.exec(piso);
  assert.ok(m, 'no está en el monte del camino');
  const [cx, cy] = tramo.ojos[ID]!;
  assert.equal(Number(m![2]), cx - JOVEN.x);
  assert.equal(Number(m![3]), tramo.bajan![ID]);
  assert.ok(Math.abs(ey + tramo.bajan![ID]! - cy) < 6, 'en el camino el ojo no queda donde estaban sus ojos');
  assert.ok(!piso.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos en el camino');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarJovenCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.equal(marcas(QUIETO).transform.quijada, `rotate(${(28 * QUIETO.quijada).toFixed(2).replace(/\.?0+$/, '')} ${JOVEN_ARMADO.quijada[0]} ${JOVEN_ARMADO.quijada[1]})`);
});

test('arde despacio: aúlla, se rasca, se mira la cola, mira el cráter, se sacude, pestañea, y la brasa late y el humo sube', () => {
  const hechas: Record<Accion, number> = { aulla: 0, rasca: 0, cola: 0, crater: 0, sacude: 0, arde: 0 };
  let pestaneos = 0;
  const brasas = new Set<string>();
  const humos = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarJovenCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = /scale\(1 ([\d.]+)\)/.exec(dom.de('parpado', 'transform'));
      const k = p ? Number(p[1]) : 0;
      if (k > 0.9 && !cerrado) pestaneos++;
      cerrado = k > 0.9;
      if (i % 7 === 0) {
        brasas.add(dom.de('brasa', 'opacity'));
        humos.add(dom.de('humo', 'transform'));
      }
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['aulla', 'rasca', 'cola', 'crater', 'sacude'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.arde, 0, 'ardió sin que lo toquen');
  assert.ok(pestaneos >= 10, `pestañeó ${pestaneos} veces`);
  assert.ok(brasas.size > 30 && humos.size > 100, 'la brasa no late o el humo no sube');
});

test('tocado arde: se yergue, aúlla con la quijada abierta, la brasa al rojo, las llamas altas, el volcán hace erupción, sube el corazón de humo, jadea y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarJovenCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { quijada: 0, brasa: 0, llamas: 0, lava: 0, chispas: 0, corazon: 0, cabeza: 0, accion: '' };
  for (let i = 1; i <= 60 * DURA.arde; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const q = /rotate\((-?[\d.]+)/.exec(dom.de('quijada', 'transform'));
    const c = /rotate\((-?[\d.]+)/.exec(dom.de('cabeza', 'transform'));
    if (u > TOQUE_T.aulla[0] + 0.5 && u < TOQUE_T.aulla[1]) {
      visto.quijada = Math.max(visto.quijada, q ? Number(q[1]) : 0);
      visto.cabeza = Math.min(visto.cabeza, c ? Number(c[1]) : 0);
    }
    visto.brasa = Math.max(visto.brasa, Number(dom.de('brasa', 'opacity')));
    visto.lava = Math.max(visto.lava, Number(dom.de('lava', 'opacity')));
    visto.chispas = Math.max(visto.chispas, Number(dom.de('chispas', 'opacity')));
    visto.corazon = Math.max(visto.corazon, Number(dom.de('corazon', 'opacity')));
    const l = /scale\(([\d.]+) ([\d.]+)\)/.exec(dom.de('llamas', 'transform'));
    visto.llamas = Math.max(visto.llamas, l ? Number(l[2]) : 0);
    if (i === 60 * 3) visto.accion = vivo.estado().accion ?? '';
  }
  assert.ok(visto.quijada > 24, `la quijada abrió ${visto.quijada.toFixed(0)}`);
  assert.ok(visto.cabeza < -28, `la cabeza llegó a ${visto.cabeza.toFixed(0)}: no miró al cielo`);
  assert.ok(visto.brasa > 0.95 && visto.llamas > 1.3, 'no se quemó de adentro');
  assert.ok(visto.lava > 0.95 && visto.chispas > 0.9, 'el volcán no hizo erupción');
  assert.ok(visto.corazon > 0.9, 'no subió el corazón de humo');
  assert.equal(visto.accion, 'arde');
  // Al final se volvió a sentar.
  const y = /rotate\((-?[\d.]+)/.exec(dom.de('cuerpo', 'transform'));
  assert.ok(Math.abs(Number(y![1])) < 1, `quedó erguido ${y![1]}`);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de sentado a ardiendo, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarJovenCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('cabeza', 'transform'), marcas(ARDE).transform.cabeza);
  assert.equal(dom.de('brasa', 'opacity'), '1');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('cabeza', 'transform'), marcas(QUIETO).transform.cabeza);
});
