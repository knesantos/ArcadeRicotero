import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { LOBOCAIDO_PERSONAJE, PIEZAS_LOBOCAIDO } from './arte-lobocaido.ts';
import { GRITA, LOBO, LOBO_ARMADO, QUIETO, alRecinto, marcas, type Punto } from './rig-lobocaido.ts';
import { VECINOS_DEL_MONTE, escenaMonte } from './escena-monte.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { CRUCE, DURA, TOQUE_T, armarLobocaidoCon, base, type Accion } from '../../scripts/bestiario/lobocaido.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * El lobo caído (`D-73`, vigesimoctava vuelta): un lobo viejo a aerógrafo, tirado entre las raíces del monte con una
 * trompetilla atada a la oreja, que no oye nada, ni al otro lobo que le pasa por detrás; que intente pararse y se
 * caiga, que marque tantos que nunca terminan, que tocado grite sin voz, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-lobo-caido';
const figura = capasDe('el-monte', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_LOBOCAIDO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--lobocaido');
const giro = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
const trasl = (transform: string): [number, number] => {
  const m = /translate\((-?[\d.]+) (-?[\d.]+)\)/.exec(transform);
  return m ? [Number(m[1]), Number(m[2])] : [NaN, NaN];
};

test('el lobo caído es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--lobocaido" data-id="el-lobo-caido" role="button" tabindex="0" aria-label="El lobo caído">/);
  for (const p of ['entero', 'cuerpo', 'cola', 'tronco', 'pata', 'cuello', 'cabeza', 'quijada', 'parpado', 'oreja-1', 'oreja-2', 'paso', 'paso-1', 'paso-2', 'tanto-1', 'tanto-2', 'tanto-3', 'tanto-4', 'tanto-5']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al lobo le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_LOBOCAIDO.map((p) => p.nombre).sort());
  for (const p of PIEZAS_LOBOCAIDO) assert.match(p.nombre, /^lobocaido-/);
  const A = LOBO_ARMADO;
  assert.ok(adentro('lobocaido-pata', A.hombro) && adentro('lobocaido-cuerpo', A.hombro), 'la pata no sale del hombro');
  assert.ok(adentro('lobocaido-cuello', A.cuello) && adentro('lobocaido-cabeza', A.cuello) && adentro('lobocaido-cuerpo', A.cuello), 'el cogote no une la cabeza con el cuerpo');
  assert.ok(figura.indexOf('data-parte="cuello"') < figura.indexOf('data-parte="cabeza"'));
  assert.ok(adentro('lobocaido-cabeza', A.ojo.centro) && adentro('lobocaido-parpado', A.ojo.centro), 'el ojo no está en la cara');
  assert.ok(adentro('lobocaido-quijada', A.quijada) && adentro('lobocaido-cabeza', A.quijada), 'la quijada no cuelga de la cabeza');
  assert.ok(adentro('lobocaido-oreja-1', A.orejas[0]) && adentro('lobocaido-cabeza', A.orejas[0]), 'la oreja de la trompetilla no sale de la cabeza');
  assert.ok(adentro('lobocaido-oreja-2', A.orejas[1]), 'la oreja de lejos no sale de la cabeza');
  assert.ok(adentro('lobocaido-cola', A.cola) && adentro('lobocaido-cuerpo', A.cola), 'la cola no sale del cuerpo');
  // La trompetilla y el piolín magenta van en la oreja.
  const oreja = PIEZAS_LOBOCAIDO.find((p) => p.nombre === 'lobocaido-oreja-1')!.dibujo;
  assert.ok(oreja.includes('--bestia-lobocaido-magenta') && oreja.includes('rotate(-150)'), 'falta la trompetilla con su piolín');
  // Los tantos caen sobre la rodilla de raíz.
  const [rx, rw] = [caja('lobocaido-rodilla')[0], caja('lobocaido-rodilla')[2]];
  for (const [x] of A.tantos) assert.ok(x > rx && x < rx + rw, 'un tanto cae afuera de la rodilla');
  for (const p of PIEZAS_LOBOCAIDO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['lobocaido-cuerpo', 'lobocaido-cabeza', 'lobocaido-raiz']) assert.match(PIEZAS_LOBOCAIDO.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_LOBOCAIDO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 30 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del lobo caído están en su bloque de tokens.css, medidas en Lobo suelto, y su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el lobo caido⟩'), tokens.indexOf('⟨/el lobo caido⟩'));
  const usadas = new Set(PIEZAS_LOBOCAIDO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-lobocaido-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 9);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del lobo caído`);
  assert.match(bloque, /public\/tapas\/lobo-suelto\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el lobo caido⟩ */'), sitio.indexOf('/* ⟨/el lobo caido⟩ */'));
  assert.match(suyo, /\.titere--lobocaido \{ cursor: pointer; \}/);
  assert.match(suyo, /\[data-parte="paso"\] \{ pointer-events: none; \}/);
});

test('vive en el borde de abajo del monte, entre las raíces: sin pisar a la liebre, al borrego ni al ovejero, en el recinto y en el camino', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'el-monte');
  assert.equal(LOBOCAIDO_PERSONAJE.ancla, LOBO.x);
  const [x0, y0] = alRecinto([-190, -150]);
  const [x1, y1] = alRecinto([234, 8]);
  // Entra en el recinto, a la izquierda del borrego (que mide hasta x = 261 con su pasto) y abajo del ovejero.
  assert.ok(x0 > 0 && y1 < 640, 'se sale del recinto');
  assert.ok(x1 < 300 - 40, `llega hasta x = ${x1.toFixed(0)}, el borrego está en 300`);
  // Y el piso del lobo queda abajo del piso del ovejero (el perro está en el borde de arriba).
  assert.ok(LOBO.piso > 438 + 40, 'pisa al ovejero');
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_MONTE)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > y0 && vy < y1), `${id} queda adentro del lobo`);
  }
  const escena = escenaMonte(nombres);
  assert.ok(escena.indexOf('/bestiario/monte-cerca.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso le queda delante');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  // En el camino va con sus ojos de antes: corrido entero.
  const tramo = CAMINOS['el-monte']!;
  const piso = pisoDelCamino(tramo, nombres);
  const m = /data-marco="el-lobo-caido" data-capa="figura" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no está en el monte del camino');
  assert.equal(Number(m![1]), Math.round(tramo.ojos[ID]![0] - LOBO.x));
  assert.ok(!piso.includes(`bestia--ojos" data-id="${ID}"`));
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarLobocaidoCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  // Tirado: con tres tantos y el otro lobo sin cruzar.
  const t = marcas(QUIETO);
  assert.equal(t.opacity['tanto-3'], '1');
  assert.equal(t.opacity['tanto-4'], '0');
  assert.equal(t.opacity['paso-1'], '0');
});

test('no oye: intenta pararse y se cae, marca tantos que no terminan, sueña, la oreja se le para para cualquier lado; cada tanto cruza el otro lobo y él ni se mueve', () => {
  const hechas: Record<string, number> = {};
  let alza = 0;
  let quintos = 0;
  let sueno = 0;
  let oreja = 0;
  let cruces = 0;
  let cruzo = false;
  let lobosEntreCruces = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarLobocaidoCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 120; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      alza = Math.max(alza, -trasl(dom.de('pata', 'transform'))[1]);
      quintos = Math.max(quintos, Number(dom.de('tanto-5', 'opacity')));
      sueno = Math.max(sueno, Math.abs(giro(dom.de('pata', 'transform'))));
      oreja = Math.max(oreja, giro(dom.de('oreja-2', 'transform')));
      const en = Number(dom.de('paso-1', 'opacity')) + Number(dom.de('paso-2', 'opacity')) > 0;
      if (en && !cruzo) cruces++;
      cruzo = en;
      if (en) lobosEntreCruces++;
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a] = (hechas[a] ?? 0) + n;
  }
  for (const a of ['oye', 'intenta', 'marca', 'sueña'] as Accion[]) assert.ok((hechas[a] ?? 0) > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque ?? 0, 0);
  assert.ok(alza > 18, `se alzó ${alza.toFixed(0)}`);
  assert.ok(quintos > 0 && quintos < 1, 'el quinto tanto o no se empezó o se terminó');
  assert.ok(sueno > 8 && oreja > 20, 'no soñó o no se le paró la oreja');
  assert.ok(cruces >= 2, `el otro lobo cruzó ${cruces} veces`);
  // Mientras el otro lobo cruza, a él no se le mueve ni una oreja: la base es la misma con y sin cruce.
  assert.ok(lobosEntreCruces > 0);
  for (const k of [0.1, 0.5, 0.9]) assert.deepEqual(base(9, (n) => (n === 'cruza' ? k : -1)).orejas, base(9, () => -1).orejas);
});

test('tocado no se entera: pasa un rato, levanta la cabeza, para la trompetilla y grita sin voz tres veces, un tanto por grito; se cae y los tantos vuelven a tres', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarLobocaidoCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  const antes = dom.foto();
  dom.oyentes.get('click')!({});
  const visto = { sordo: 0, cabeza: 0, trompeta: 0, bocas: 0, tantos: 0 };
  let abierta = false;
  for (let i = 1; i <= 60 * DURA.toque; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    if (u < TOQUE_T.sordo[1]) {
      // Sordo: ni la cabeza ni la quijada ni la trompetilla se mueven.
      visto.sordo = Math.max(visto.sordo, Math.abs(giro(dom.de('cabeza', 'transform'))), Math.abs(giro(dom.de('quijada', 'transform'))));
    }
    visto.cabeza = Math.max(visto.cabeza, -giro(dom.de('cabeza', 'transform')));
    visto.trompeta = Math.max(visto.trompeta, -giro(dom.de('oreja-1', 'transform')));
    const boca = giro(dom.de('quijada', 'transform')) > 15;
    if (boca && !abierta) visto.bocas++;
    abierta = boca;
    visto.tantos = Math.max(visto.tantos, Number(dom.de('tanto-5', 'opacity')));
    // La cabeza del lobo sigue al cogote en cada cuadro: nunca un hueco.
    assert.ok(Math.abs(giro(dom.de('cuello', 'transform')) - giro(dom.de('cabeza', 'transform')) * 0.5) < 0.02, 'el cogote no siguió a la cabeza');
  }
  assert.ok(visto.sordo < 4, `se movió ${visto.sordo.toFixed(1)} antes de enterarse`);
  assert.ok(visto.cabeza > 20 && visto.trompeta > 18, 'no levantó la cabeza o no paró la trompetilla');
  assert.equal(visto.bocas, 3, `gritó ${visto.bocas} veces`);
  assert.equal(visto.tantos, 1, 'no llegó al quinto tanto');
  assert.equal(dom.de('tanto-4', 'opacity'), '0', 'los tantos no volvieron a tres');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
  assert.ok(antes['tanto-3']);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de tirado a gritando, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarLobocaidoCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('cabeza', 'transform'), marcas(GRITA).transform.cabeza);
  assert.equal(dom.de('tanto-5', 'opacity'), '1');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('cabeza', 'transform'), marcas(QUIETO).transform.cabeza);
  assert.ok(CRUCE > 0);
});
