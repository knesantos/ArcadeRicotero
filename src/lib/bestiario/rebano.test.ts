import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { REBANO_PERSONAJE, PIEZAS_REBANO } from './arte-rebano.ts';
import { BOLSA, VELETA, COPOS, ESPANTADO, OVEJA, OVEJAS, QUIETO, REBANO, VERSO, alRecinto, lugarDeOveja, marcas } from './rig-rebano.ts';
import { VECINOS_DEL_MONTE, escenaMonte } from './escena-monte.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { ACHATE, PALO, SOGA } from './rig.ts';
import { DURA, TOQUE_T, armarRebanoCon, type Accion } from '../../scripts/bestiario/rebano.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * El rebaño (`D-73`, vigesimoctava vuelta): tres ovejas a aerógrafo apretadas alrededor de una veleta, en la punta de
 * la pastura lejos del monte, que tienen miedo de todo lo que sopla; que la veleta mande, que tocadas se les suba el
 * miedo a todas juntas y se vuelvan a apretar, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-rebano';
const figura = capasDe('la-pastura', 'figura', nombres, 1, ID);
const nuevo = () => domDeJuguete([figura], 'titere--rebano');
const giro = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
const escalaX = (transform: string): number => Number(/scale\((-?[\d.]+) /.exec(transform)?.[1] ?? NaN);
const xDe = (transform: string): number => Number(/translate\((-?[\d.]+) /.exec(transform)?.[1] ?? NaN);
const yDe = (transform: string): number => Number(/translate\((?:-?[\d.]+) (-?[\d.]+)\)/.exec(transform)?.[1] ?? NaN);

test('el rebaño es un títere entero: tres ovejas con cada pieza que mueve la isla, la veleta, la bolsa y los copos', () => {
  assert.match(figura, /<g class="titere titere--rebano" data-id="el-rebano" role="button" tabindex="0" aria-label="El rebaño">/);
  const partes = ['entero', 'gallo', 'cinta', 'bolsa'];
  for (const n of [1, 2, 3]) partes.push(`oveja-${n}`, `cuerpo-${n}`, `cabeza-${n}`, `oreja-${n}`, `ojo-${n}`, `boca-${n}`);
  COPOS.forEach((_, i) => partes.push(`copo-${i + 1}`));
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `al rebaño le falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_REBANO.map((p) => p.nombre).sort());
  for (const p of PIEZAS_REBANO) assert.match(p.nombre, /^rebano-/);
  // Las tres son distintas: no hay dos con el mismo cuerpo y la misma cara.
  const combinacion = (i: number): string => {
    const cara = new RegExp(`data-parte="cabeza-${i}"[^]*?rebano-(cabeza-[ab])`).exec(figura)![1];
    const lana = new RegExp(`data-parte="cuerpo-${i}"[^]*?rebano-(cuerpo-[ab])`).exec(figura)![1];
    return `${cara}/${lana}`;
  };
  assert.equal(new Set([1, 2, 3].map(combinacion)).size, 3);
  // Miran para lados distintos: la de la izquierda mira para afuera de su punta.
  assert.deepEqual(OVEJAS.map((o) => o.mira), [-1, 1, 1]);
  // La veleta está en el medio del montón.
  const palo = PIEZAS_REBANO.find((p) => p.nombre === 'rebano-palo')!;
  assert.ok(palo.caja[0] < 0 && palo.caja[0] + palo.caja[2] > 0, 'el palo no está en el medio');
  for (const p of PIEZAS_REBANO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['rebano-cuerpo-a', 'rebano-cabeza-b', 'rebano-gallo']) assert.match(PIEZAS_REBANO.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  // El cogote queda adentro de la lana, y la lana se dibuja después de la cabeza: nunca un hueco en la nuca.
  const cuerpo = PIEZAS_REBANO.find((p) => p.nombre === 'rebano-cuerpo-a')!.caja;
  assert.ok(OVEJA.cuello[0] <= cuerpo[0] + cuerpo[2] && OVEJA.cuello[1] >= cuerpo[1], 'el cogote no está en el cuerpo');
  assert.ok(figura.indexOf('data-parte="cabeza-1"') < figura.indexOf('data-parte="cuerpo-1"'), 'la lana tapa el cogote');
  const peso = PIEZAS_REBANO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del rebaño están en su bloque de tokens.css, medidas en La mosca y la sopa, y su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el rebano⟩'), tokens.indexOf('⟨/el rebano⟩'));
  const usadas = new Set(PIEZAS_REBANO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-rebano-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 9);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del rebaño`);
  assert.match(bloque, /public\/tapas\/la-mosca-y-la-sopa\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  assert.match(sitio.slice(sitio.indexOf('/* ⟨el rebano⟩ */'), sitio.indexOf('/* ⟨/el rebano⟩ */')), /\.titere--rebano \{ cursor: pointer; \}/);
});

test('vive en la punta de la pastura, lejos del monte: afuera de la soga del cordero, sin pisar a nadie, en el recinto y en el camino', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'la-pastura');
  assert.equal(REBANO_PERSONAJE.ancla, REBANO.x);
  assert.ok(REBANO.x > PALO.x + 150, 'quedó cerca del palo');
  const [x0, y0] = alRecinto([-140, -190]);
  const [x1, y1] = alRecinto([150, 10]);
  for (const [x, y] of [[x0, y1], [x1, y1], [x0, y0], [x1, y0]] as const) {
    assert.ok(((x - PALO.x) / SOGA) ** 2 + ((y - PALO.y) / (SOGA * ACHATE)) ** 2 > 1, `la soga llega a ${x.toFixed(0)}, ${y.toFixed(0)}`);
  }
  assert.ok(x1 < 900 && y1 < 640 && x0 > 0, 'se sale del recinto');
  // La veleta no llega a las pezuñas de la vaca, que está arriba a la derecha con su sombra.
  const [, punta] = alRecinto([0, VELETA.punta - 26]);
  assert.ok(punta >= 477, `la veleta sube hasta ${punta.toFixed(0)}`);
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_MONTE)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > y0 && vy < y1), `${id} queda adentro del rebaño`);
  }
  assert.ok(VERSO[1] < REBANO.piso && VERSO[0] === REBANO.x);
  const escena = escenaMonte(nombres);
  assert.ok(escena.indexOf('/bestiario/monte-cerca.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso le queda delante');
  assert.ok(escena.indexOf(`data-marco="${ID}"`) < escena.indexOf('titere--cordero'), 'el cordero le queda detrás');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  const tramo = CAMINOS['la-pastura']!;
  const piso = pisoDelCamino(tramo, nombres);
  const m = /data-marco="el-rebano" data-capa="figura" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no está en la pastura del camino');
  assert.equal(Number(m![1]), tramo.claro!.dx);
  assert.ok(!piso.includes(`bestia--ojos" data-id="${ID}"`));
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarRebanoCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  // Los copos están escondidos y la bolsa enganchada en el palo.
  const t = marcas(QUIETO);
  assert.equal(t.opacity['copo-1'], '0');
  assert.match(t.transform.bolsa!, new RegExp(`^translate\\(${BOLSA.x} ${BOLSA.y}\\)`));
});

test('tiene miedo de lo que sopla: la veleta se da vuelta, la bolsa se suelta, una asoma, aprietan y una se esconde; siempre tiemblan', () => {
  const hechas: Record<string, number> = {};
  let viento = 1;
  let bolsa = 0;
  let abre = 0;
  let cabezas = 0;
  let apreta = 1e9;
  const temblores = new Set<string>();
  for (const semilla of [1, 2, 3, 4]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarRebanoCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 70; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      viento = Math.min(viento, escalaX(dom.de('gallo', 'transform')));
      bolsa = Math.max(bolsa, Math.abs(xDe(dom.de('bolsa', 'transform')) - BOLSA.x));
      abre = Math.max(abre, Math.abs(xDe(dom.de('oveja-1', 'transform')) - lugarDeOveja(0, QUIETO).x));
      apreta = Math.min(apreta, xDe(dom.de('oveja-3', 'transform')));
      cabezas = Math.max(cabezas, Math.abs(giro(dom.de('cabeza-2', 'transform'))));
      if (i % 7 === 0) temblores.add(dom.de('oveja-2', 'transform'));
      // Sin tocarlas no salen los copos.
      assert.equal(dom.de('copo-1', 'opacity'), '0');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a] = (hechas[a] ?? 0) + n;
  }
  for (const a of ['sopla', 'bolsa', 'asoma', 'aprieta', 'esconde'] as Accion[]) assert.ok((hechas[a] ?? 0) > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque ?? 0, 0);
  assert.ok(viento < -0.9, 'la veleta no se dio vuelta');
  assert.ok(bolsa > 100, `la bolsa voló ${bolsa.toFixed(0)}`);
  assert.ok(abre > 10 && apreta < lugarDeOveja(2, QUIETO).x - 2, 'no se abrió ni se apretó');
  assert.ok(cabezas > 40, `la del medio giró la cabeza ${cabezas.toFixed(0)}`);
  assert.ok(temblores.size > 30, 'no tiembla');
});

test('tocadas: saltan juntas, sueltan lana, la veleta da vueltas, se abren, miran para arriba, se vuelven a apretar y dicen su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarRebanoCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { alto: 0, copos: 0, vueltas: 0, abre: 0, cabeza: 0, cierra: 1e9 };
  let signo = 1;
  const antes = lugarDeOveja(0, QUIETO).x;
  for (let i = 1; i <= 60 * DURA.toque; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    visto.alto = Math.max(visto.alto, -(yDe(dom.de('oveja-2', 'transform')) - OVEJAS[1].y));
    visto.copos = Math.max(visto.copos, Number(dom.de('copo-3', 'opacity')));
    const g = escalaX(dom.de('gallo', 'transform'));
    if (g * signo < 0 && u < TOQUE_T.gira[1] + 0.2) {
      visto.vueltas++;
      signo = -signo;
    }
    visto.abre = Math.max(visto.abre, Math.abs(xDe(dom.de('oveja-1', 'transform')) - antes));
    visto.cabeza = Math.max(visto.cabeza, -giro(dom.de('cabeza-2', 'transform')));
    if (u > TOQUE_T.cierra[1]) visto.cierra = Math.min(visto.cierra, xDe(dom.de('oveja-3', 'transform')));
  }
  assert.ok(visto.alto > 20, `saltó ${visto.alto.toFixed(0)}`);
  assert.ok(visto.copos > 0.5, 'no soltó lana');
  assert.ok(visto.vueltas >= 4, `la veleta dio ${visto.vueltas} medias vueltas`);
  assert.ok(visto.abre > 40, 'no se abrieron');
  assert.ok(visto.cabeza > 15, 'no miró para arriba');
  assert.ok(visto.cierra < lugarDeOveja(2, QUIETO).x, 'no quedaron más apretadas que antes');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
  assert.equal(escalaX(dom.de('gallo', 'transform')), 1, 'la veleta no volvió a su lugar');
  assert.equal(dom.de('copo-3', 'opacity'), '0', 'quedó lana en el aire');
});

test('con movimiento reducido no se mueve: tocarlas las pasa de apretadas a espantadas, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarRebanoCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('gallo', 'transform'), marcas(ESPANTADO).transform.gallo);
  assert.equal(dom.de('copo-2', 'opacity'), marcas(ESPANTADO).opacity['copo-2']);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('gallo', 'transform'), marcas(QUIETO).transform.gallo);
});
