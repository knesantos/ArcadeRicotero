import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { NAUF_PERSONAJE, PIEZAS_NAUF } from './arte-nau.ts';
import { NAUF, NAUF_ARMADO, QUIETO, TODOS, alRecinto, marcas, type Punto } from './rig-nau.ts';
import { POLIZON } from './rig-polizon.ts';
import { VECINOS_DEL_BAJO, escenaBajo } from './escenas.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { DURA, HUNDE, TOQUE_T, armarNaufragosCon, type Accion } from '../../scripts/bestiario/nau.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * Los náufragos (`D-73`, vigesimoctava vuelta): que sean un títere entero a aerógrafo, dos cabezas que asoman del agua
 * del bajo agarradas de la mano con una multitud casi invisible atrás, entre el ahogado y el bote del polizón, que no
 * estén más como ojos, que busquen un barco, estornuden, se les resbale la mano, escuchen el teléfono y vean desinflarse
 * la bomba sin que nadie los toque, que tocados caiga el rayo, se alumbre la multitud, griten, y digan su verso, y que la
 * pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string; estampa: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'los-naufragos';
const figura = capasDe('el-bajo', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_NAUF.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--nau');
const giroDe = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
const escalaY = (transform: string): number => Number(/scale\((?:-?[\d.]+) ([\d.]+)\)/.exec(transform)?.[1] ?? NaN);
const A = NAUF_ARMADO;

test('los náufragos son un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--nau" data-id="los-naufragos" role="button" tabindex="0" aria-label="Los náufragos">/);
  for (const p of ['entero', 'multitud', 'multitud-brazos', 'bomba', 'mecha', 'chispa', 'humo', 'a', 'b', 'cabeza-a', 'cabeza-b', 'boca-a', 'boca-b', 'brazo-a', 'brazo-b', 'libre-a', 'tubo-b', 'ondas', 'gotas', 'burbuja', 'rayo']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `a los náufragos les falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_NAUF.map((p) => p.nombre).sort());
  for (const p of PIEZAS_NAUF) assert.match(p.nombre, /^nau-/);
  // Las cabezas se apoyan en el cogote, las bocas están en la cara, los hombros adentro del cuerpo.
  for (const [i, s] of (['a', 'b'] as const).entries()) {
    assert.ok(adentro(`nau-cabeza-${s}`, A.cuello[i]!) && adentro(`nau-cuerpo-${s}`, A.cuello[i]!), `la cabeza ${s} no se apoya en el cogote`);
    assert.ok(adentro(`nau-cabeza-${s}`, A.bocas[i]!) && adentro(`nau-boca-${s}`, A.bocas[i]!), `la boca ${s} no está en la cara`);
    assert.ok(adentro(`nau-brazo-${s}`, A.hombros[i]!) && adentro(`nau-cuerpo-${s}`, A.hombros[i]!), `el brazo ${s} no sale del hombro`);
    assert.ok(adentro(`nau-brazo-${s}`, A.manos), `el brazo ${s} no llega a las manos`);
  }
  assert.ok(adentro('nau-libre-a', A.libreA) && adentro('nau-cuerpo-a', A.libreA), 'el brazo libre no sale del hombro');
  assert.ok(adentro('nau-tubo-b', A.tuboB) && adentro('nau-cuerpo-b', A.tuboB), 'el brazo del tubo no sale del hombro');
  assert.ok(adentro('nau-bomba', A.bomba.centro) && adentro('nau-mecha', A.bomba.mecha) && adentro('nau-chispa', [A.bomba.mecha[0] + 4, A.bomba.mecha[1] - 29]), 'la bomba no está armada alrededor de su centro');
  assert.ok(adentro('nau-rayo', A.rayo), 'el rayo no cae donde dice el rig');
  for (const p of PIEZAS_NAUF) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['nau-multitud', 'nau-cuerpo-a', 'nau-cuerpo-b', 'nau-cabeza-a', 'nau-cabeza-b', 'nau-bomba']) assert.match(PIEZAS_NAUF.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_NAUF.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de los náufragos están en su bloque de tokens.css, medidas en Oktubre, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨los naufragos⟩'), tokens.indexOf('⟨/los naufragos⟩'));
  const usadas = new Set(PIEZAS_NAUF.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-nau-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 7);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de los náufragos`);
  assert.match(bloque, /public\/tapas\/oktubre\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨los naufragos⟩ */'), sitio.indexOf('/* ⟨/los naufragos⟩ */'));
  assert.match(suyo, /\.titere--nau \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"rayo"') && suyo.includes('"ondas"') && suyo.includes('"gotas"'), 'el rayo, las ondas y el estornudo se pueden tocar');
});

test('asoman del agua entre el ahogado y el bote del polizón, sin pisar a nadie, ya no son ojos, y en el camino están en el bajo', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'el-bajo');
  assert.equal(NAUF_PERSONAJE.ancla, NAUF.x);
  // Los dos de adelante, con las manos juntas, caben entre el ahogado y el bote del polizón.
  const [x0, y0] = alRecinto([-100, -140]);
  const [x1, y1] = alRecinto([96, 6]);
  const [botex] = [POLIZON.x - 180 * POLIZON.escala];
  assert.ok(x1 < botex, `los náufragos llegan a ${x1.toFixed(0)} y el bote empieza en ${botex.toFixed(0)}`);
  assert.ok(y1 <= 640 && y0 > 480, 'se salen del agua del bajo');
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_BAJO)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > y0 && vy < y1), `${id} queda adentro de los náufragos`);
  }
  const escena = escenaBajo(nombres);
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  assert.ok(escena.includes(`data-marco="${ID}"`));
  const piso = pisoDelCamino(CAMINOS['el-bajo']!, nombres);
  assert.ok(piso.includes(`data-marco="${ID}" data-capa="figura" data-dx="0"`), 'no están en el bajo del camino');
  const estampa = datos.bestias.find((b) => b.id === ID)!.estampa;
  assert.ok(estampa.length <= 320 && /rayo/.test(estampa) && /multitud/.test(estampa), estampa);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarNaufragosCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  // Quietos están agarrados de la mano, con la multitud apenas visible y sin rayo.
  assert.equal(marcas(QUIETO).opacity.rayo, '0');
  assert.ok(Number(marcas(QUIETO).opacity.multitud) > 0.2 && Number(marcas(QUIETO).opacity.multitud) < 0.5);
  assert.equal(giroDe(marcas(QUIETO).transform['brazo-a']!), 0);
});

test('buscan un barco, estornudan, se les resbala la mano, suena el tubo del teléfono y la bomba se desinfla, sin que nadie los toque', () => {
  const hechas: Record<Accion, number> = { busca: 0, estornuda: 0, resbala: 0, telefono: 0, bomba: 0, rayo: 0 };
  const visto = { libre: 72, gotas: 0, hundido: 0, burbuja: 0, suelta: 0, tubo: 0, mecha: 1, bomba: 1, bombaVuelve: false, cabezaA: 0, rayo: 0, multitud: 0 };
  for (const semilla of [1, 2, 3, 4]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarNaufragosCon(dom.marcos, esc, azar(semilla));
    let desinflada = false;
    for (let i = 1; i <= 60 * 120; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      visto.libre = Math.min(visto.libre, giroDe(dom.de('libre-a', 'transform')));
      visto.gotas = Math.max(visto.gotas, Number(dom.de('gotas', 'opacity')));
      visto.hundido = Math.max(visto.hundido, trasladoDe(dom.de('a', 'transform'))[1]);
      visto.burbuja = Math.max(visto.burbuja, Number(dom.de('burbuja', 'opacity')));
      visto.suelta = Math.max(visto.suelta, giroDe(dom.de('brazo-a', 'transform')));
      visto.tubo = Math.max(visto.tubo, Math.abs(giroDe(dom.de('tubo-b', 'transform'))));
      visto.mecha = Math.min(visto.mecha, escalaY(dom.de('mecha', 'transform')));
      const b = escalaY(dom.de('bomba', 'transform'));
      visto.bomba = Math.min(visto.bomba, b);
      if (b < 0.55) desinflada = true;
      if (desinflada && b > 0.95) visto.bombaVuelve = true;
      visto.cabezaA = Math.max(visto.cabezaA, Math.abs(giroDe(dom.de('cabeza-a', 'transform'))));
      visto.rayo = Math.max(visto.rayo, Number(dom.de('rayo', 'opacity')));
      visto.multitud = Math.max(visto.multitud, Number(dom.de('multitud', 'opacity')));
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['busca', 'estornuda', 'resbala', 'telefono', 'bomba'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.rayo, 0, 'cayó el rayo sin que los toquen');
  assert.ok(visto.libre < 10, 'no se puso la mano en la frente');
  assert.ok(visto.gotas > 0.9, 'el estornudo no largó el chorro');
  assert.ok(visto.hundido > HUNDE * 0.85 && visto.burbuja > 0.8, `el A se hundió ${visto.hundido.toFixed(0)}`);
  assert.ok(visto.suelta > 25, 'no se le resbaló la mano');
  assert.ok(visto.tubo > 5, 'el tubo no sonó');
  assert.ok(visto.mecha < 0.1, 'la mecha no se quemó');
  assert.ok(visto.bomba < 0.55 && visto.bombaVuelve, 'la bomba no se desinfló y se volvió a inflar');
  assert.ok(visto.cabezaA > 15, 'no giraron la cabeza');
  // Sin tocarlos, la multitud sigue siendo apenas una sospecha y no cae el rayo.
  assert.equal(visto.rayo, 0);
  assert.ok(visto.multitud < 0.5, `la multitud se vio a ${visto.multitud.toFixed(2)} sin rayo`);
});

test('tocados cae el rayo, dos veces: se alumbra la multitud de atrás con los brazos levantados, los dos gritan, y dicen su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarNaufragosCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { rayo: 0, lados: new Set<string>(), flashes: 0, multitud: 0, brazos: 0, bocas: [0, 0], libre: 72, antes: 0, durante: -1, sube: 0 };
  let prendido = false;
  for (let i = 1; i <= 60 * DURA.rayo; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const r = Number(dom.de('rayo', 'opacity'));
    visto.rayo = Math.max(visto.rayo, r);
    if (r > 0.5) {
      visto.lados.add(/scale\((-?1) 1\)/.exec(dom.de('rayo', 'transform'))?.[1] ?? '?');
      if (!prendido) visto.flashes++;
    }
    prendido = r > 0.5;
    visto.multitud = Math.max(visto.multitud, Number(dom.de('multitud', 'opacity')));
    visto.brazos = Math.max(visto.brazos, escalaY(dom.de('multitud-brazos', 'transform')));
    visto.sube = Math.max(visto.sube, -trasladoDe(dom.de('multitud', 'transform'))[1]);
    visto.bocas = [Math.max(visto.bocas[0]!, escalaY(dom.de('boca-a', 'transform'))), Math.max(visto.bocas[1]!, escalaY(dom.de('boca-b', 'transform')))];
    visto.libre = Math.min(visto.libre, giroDe(dom.de('libre-a', 'transform')));
    if (u > TOQUE_T.grito[0] + 0.3 && u < TOQUE_T.grito[1] - 0.3) visto.durante = Math.max(visto.durante, Number(dom.de('multitud', 'opacity')));
  }
  assert.ok(visto.rayo > 0.9, 'no cayó el rayo');
  assert.equal(visto.lados.size, 2, 'el rayo siempre cae del mismo lado');
  assert.ok(visto.flashes >= 2, `el rayo cayó ${visto.flashes} veces`);
  assert.ok(visto.multitud > 0.95 && visto.sube > 8, 'no se alumbró la multitud de atrás');
  assert.ok(visto.brazos > 0.9, 'la multitud no levantó los brazos');
  assert.ok(visto.bocas[0]! > 0.9 && visto.bocas[1]! > 0.9, 'no gritaron los dos');
  assert.ok(visto.libre < 0, 'el A no levantó el brazo libre');
  assert.ok(visto.durante > 0.95, 'la multitud no quedó a la vista mientras gritan');
  // Al final están como antes: la multitud otra vez en lo oscuro, sin rayo.
  assert.ok(Number(dom.de('multitud', 'opacity')) < 0.5);
  assert.equal(dom.de('rayo', 'opacity'), '0');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlos los pasa de aguantando a gritando con la multitud a la vista, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarNaufragosCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('multitud', 'opacity'), marcas(TODOS).opacity.multitud);
  assert.equal(dom.de('rayo', 'opacity'), marcas(TODOS).opacity.rayo);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('multitud', 'opacity'), marcas(QUIETO).opacity.multitud);
  assert.equal(dom.de('rayo', 'opacity'), '0');
});
