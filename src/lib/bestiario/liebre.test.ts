import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { LIEBRE_PERSONAJE, PIEZAS_LIEBRE } from './arte-liebre.ts';
import { FLOJAS, LIEBRE, LIEBRE_ARMADO, QUIETO, TIESA, alRecinto, marcas, type Punto } from './rig-liebre.ts';
import { VECINOS_DEL_MONTE, escenaMonte } from './escena-monte.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { ACHATE, PALO, PASTURA, SOGA } from './rig.ts';
import { CUELGAN, DURA, LEVANTA, TOQUE_T, armarLiebreCon, type Accion } from '../../scripts/bestiario/liebre.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * La liebre muerta (`D-73`, vigesimoséptima vuelta): que sea un títere entero a aerógrafo tendido panza arriba en
 * su terciopelo, en el borde de abajo del claro, fuera de la soga del cordero, que se haga la muerta y le salga
 * mal, que tocada se ponga tiesa, espíe, se coma una guinda y se vuelva a tumbar, y que la pose de la isla sea la
 * del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'la-liebre-muerta';
const figura = capasDe('el-monte', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_LIEBRE.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--liebre');
const giro = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
const parpadoDe = (transform: string): number => Number(/scale\(1 ([\d.]+)\)/.exec(transform)?.[1] ?? NaN);

test('la liebre es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--liebre" data-id="la-liebre-muerta" role="button" tabindex="0" aria-label="La liebre muerta">/);
  for (const p of ['entero', 'cuerpo', 'cola', 'pata-tras-1', 'pata-tras-2', 'pata-del-1', 'pata-del-2', 'panza', 'cabeza', 'oreja-1', 'oreja-2', 'lengua', 'pupila', 'parpado', 'guinda', 'piedra']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `a la liebre le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_LIEBRE.map((p) => p.nombre).sort());
  for (const p of PIEZAS_LIEBRE) assert.match(p.nombre, /^liebre-/);
  const A = LIEBRE_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`liebre-pata-tras-${n + 1}`, A.caderas[n]) && adentro('liebre-cuerpo', A.caderas[n]), `la pata de atrás ${n + 1} no sale de la cadera`);
    assert.ok(adentro(`liebre-pata-del-${n + 1}`, A.hombros[n]) && adentro('liebre-cuerpo', A.hombros[n]), `la pata de adelante ${n + 1} no sale del hombro`);
    assert.ok(adentro(`liebre-oreja-${n + 1}`, A.orejas[n]) && adentro('liebre-cabeza', A.orejas[n]), `la oreja ${n + 1} no sale de la cabeza`);
  }
  assert.ok(adentro('liebre-cabeza', A.cuello) && adentro('liebre-cuerpo', A.cuello), 'la cabeza no se apoya en el cogote');
  assert.ok(adentro('liebre-cabeza', A.ojo.centro) && adentro('liebre-parpado', A.ojo.centro) && adentro('liebre-pupila', A.ojo.centro), 'el ojo no está en la cara');
  assert.ok(adentro('liebre-cabeza', A.boca) && adentro('liebre-lengua', A.boca), 'la lengua no sale de la boca');
  assert.ok(adentro('liebre-cola', A.cola) && adentro('liebre-cuerpo', [A.cola[0] + 8, A.cola[1]]), 'el pompón no sale del cuerpo');
  assert.ok(adentro('liebre-guinda', A.guinda) && adentro('liebre-terciopelo', A.guinda), 'la guinda no está en el terciopelo');
  for (const p of PIEZAS_LIEBRE) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['liebre-terciopelo', 'liebre-cuerpo', 'liebre-cabeza']) assert.match(PIEZAS_LIEBRE.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_LIEBRE.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de la liebre están en su bloque de tokens.css, medidas en Lobo suelto, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨la liebre muerta⟩'), tokens.indexOf('⟨/la liebre muerta⟩'));
  const usadas = new Set(PIEZAS_LIEBRE.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-liebre-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 10);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de la liebre`);
  assert.match(bloque, /public\/tapas\/lobo-suelto\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨la liebre muerta⟩ */'), sitio.indexOf('/* ⟨/la liebre muerta⟩ */'));
  assert.match(suyo, /\.titere--liebre \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"piedra"'), 'la piedra que rueda se puede tocar');
});

test('vive en el monte: tendida en el borde de abajo del claro, fuera de la soga del cordero, con el ojo donde dicen sus ojos, y en el camino donde la esperaban', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'el-monte');
  assert.equal(LIEBRE_PERSONAJE.ancla, LIEBRE.x);
  const [ox, oy] = VECINOS_DEL_MONTE[ID]!;
  const [ex, ey] = alRecinto(LIEBRE_ARMADO.ojo.centro);
  assert.ok(Math.hypot(ex - ox, ey - oy) < 6, `el ojo quedó en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  // El terciopelo entra en el recinto, y ni tiesa llega adonde llega el cordero con la soga tirante.
  const [tx0, ty0, tw, th] = caja('liebre-terciopelo');
  const [x0] = alRecinto([tx0, ty0]);
  const [x1, y1] = alRecinto([tx0 + tw, ty0 + th]);
  assert.ok(x0 > 0 && x1 < 900 && y1 < 640, 'el terciopelo se sale del recinto');
  const [, arriba] = alRecinto([0, -142]);
  assert.ok(arriba > PALO.y + SOGA * ACHATE, `las patas llegan a ${arriba.toFixed(0)}, adonde llega el cordero`);
  // Está en el claro («tendida en un claro»), y no le tapa los ojos a nadie.
  assert.ok(((LIEBRE.x - PALO.x) / PASTURA.rx) ** 2 + ((LIEBRE.piso - 20 - PALO.y) / PASTURA.ry) ** 2 < 1, 'quedó fuera del claro');
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_MONTE)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > arriba && vy < y1), `${id} queda adentro de la liebre`);
  }
  const escena = escenaMonte(nombres);
  assert.ok(escena.indexOf('/bestiario/monte-cerca.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso le queda delante');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  // En el camino va corrida entera adonde estaban sus ojos en el tramo del monte, y tampoco es ojos.
  const tramo = CAMINOS['el-monte']!;
  const piso = pisoDelCamino(tramo, nombres);
  const m = /data-marco="la-liebre-muerta" data-capa="figura" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no está en el monte del camino');
  assert.equal(Number(m![1]), tramo.ojos[ID]![0] - LIEBRE.x);
  assert.ok(!piso.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos en el camino');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarLiebreCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.equal(parpadoDe(marcas(QUIETO).transform.parpado), 1, 'quieta tiene el ojo abierto');
  assert.equal(giro(marcas(QUIETO).transform['pata-tras-1']!), FLOJAS.traseras[0]);
});

test('se hace la muerta y le sale mal: espía, se le va una oreja, patea, se relame, le pasa una piedra y suspira', () => {
  const hechas: Record<Accion, number> = { espia: 0, oreja: 0, patea: 0, relame: 0, piedra: 0, suspira: 0, tiesa: 0 };
  let espiadas = 0;
  let piedras = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarLiebreCon(dom.marcos, esc, azar(semilla));
    let abierto = false;
    let rodando = false;
    for (let i = 1; i <= 60 * 80; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const k = parpadoDe(dom.de('parpado', 'transform'));
      if (k < 0.6 && !abierto) espiadas++;
      abierto = k < 0.6;
      const r = Number(dom.de('piedra', 'opacity')) > 0.9;
      if (r && !rodando) piedras++;
      rodando = r;
      // Sin tocarla, no se pone tiesa del todo ni se come la guinda.
      assert.ok(giro(dom.de('pata-tras-1', 'transform')) < -8, 'se puso tiesa sin que la toquen');
      assert.equal(dom.de('guinda', 'opacity'), '1');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['espia', 'oreja', 'patea', 'relame', 'piedra', 'suspira'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.tiesa, 0, 'se puso tiesa sin que la toquen');
  assert.ok(espiadas >= hechas.espia && piedras === hechas.piedra, `espió ${espiadas} veces y pasaron ${piedras} piedras`);
});

test('tocada se muere más fuerte: se pone tiesa, tiembla, espía, levanta la cabeza, se come la guinda, se vuelve a tumbar y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarLiebreCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { tiesa: -Infinity, tiembla: 0, ojo: 1, cabeza: 0, guinda: 1, accion: '' };
  for (let i = 1; i <= 60 * DURA.tiesa; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    visto.tiesa = Math.max(visto.tiesa, giro(dom.de('pata-tras-1', 'transform')));
    visto.tiembla = Math.max(visto.tiembla, Math.abs(trasladoDe(dom.de('cuerpo', 'transform'))[0]));
    if (u > TOQUE_T.espia[0]) visto.ojo = Math.min(visto.ojo, parpadoDe(dom.de('parpado', 'transform')));
    visto.cabeza = Math.min(visto.cabeza, giro(dom.de('cabeza', 'transform')));
    visto.guinda = Math.min(visto.guinda, Number(dom.de('guinda', 'opacity')));
    // Con la cabeza levantada las orejas cuelgan para abajo: nunca apuntan para arriba, como un cuerno.
    if (u > TOQUE_T.levanta[1] + 0.3 && u < TOQUE_T.tumba[0]) for (const o of ['oreja-1', 'oreja-2']) assert.ok(giro(dom.de(o, 'transform')) + giro(dom.de('cabeza', 'transform')) > 10, `a los ${u.toFixed(2)} s la ${o} quedó parada`);
    if (i === 60 * 2) visto.accion = vivo.estado().accion ?? '';
    // Mientras aguanta, tiene el ojo cerrado.
    if (u > 1 && u < TOQUE_T.espia[0]) assert.ok(parpadoDe(dom.de('parpado', 'transform')) > 0.95, 'espió antes de tiempo');
  }
  assert.ok(visto.tiesa > 2, `las patas llegaron a ${visto.tiesa.toFixed(0)}`);
  assert.ok(visto.tiembla > 0.8, 'no tembló del esfuerzo');
  assert.ok(visto.ojo < 0.1 && visto.cabeza < -LEVANTA * 0.9 && CUELGAN[0] > LEVANTA + 20, 'no espió o no levantó la cabeza');
  assert.ok(visto.guinda < 0.05, 'no se comió la guinda');
  assert.equal(visto.accion, 'tiesa');
  // Al final está floja otra vez, con el ojo cerrado, y hay otra guinda en el montón.
  assert.ok(Math.abs(giro(dom.de('pata-tras-1', 'transform')) - FLOJAS.traseras[0]) < 1, 'quedó tiesa');
  assert.ok(parpadoDe(dom.de('parpado', 'transform')) > 0.95 && Number(dom.de('guinda', 'opacity')) > 0.95, 'quedó con el ojo abierto o sin guinda');
  assert.deepEqual(trasladoDe(dom.de('guinda', 'transform')), [0, 0]);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarla la pasa de floja a tiesa, con un ojo a medio abrir, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarLiebreCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('pata-tras-1', 'transform'), marcas(TIESA).transform['pata-tras-1']);
  assert.equal(parpadoDe(dom.de('parpado', 'transform')), TIESA.parpado);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('pata-tras-1', 'transform'), marcas(QUIETO).transform['pata-tras-1']);
});
