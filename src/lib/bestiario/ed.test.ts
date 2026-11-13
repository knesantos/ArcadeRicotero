import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { ED_PERSONAJE, PIEZAS_ED } from './arte-ed.ts';
import { ED, ED_ARMADO, QUIETO, RELINCHA, SALTA, alRecinto, marcas, type Punto } from './rig-ed.ts';
import { MOMO } from './rig.ts';
import { ARMADO } from './recortes.ts';
import { MORTA } from './rig-morta.ts';
import { VECINOS_DEL_TEMPLO, escenaTemplo } from './escenas.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { ALTURA, DURA, HONDO, MORTALES, TOQUE_T, armarEdCon, type Accion } from '../../scripts/bestiario/ed.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * Mister Ed y Huesito (`D-73`, vigesimoctava vuelta): que sean un títere entero a aerógrafo, un caballo parado de manos
 * sobre el tambor de un lavarropas con un esqueleto en el lomo y una red rota en el piso, entre el medallón y el Morta,
 * que no estén más como ojos, que hablen, rueden, se tambaleen y salten sin que nadie los toque, que tocados den dos
 * mortales, se caigan por el agujero de la red, vuelvan a subir y digan su verso, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string; estampa: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'mister-ed-y-huesito';
const figura = capasDe('el-templo', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_ED.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--ed');
const giroDe = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
const A = ED_ARMADO;

test('Mister Ed y Huesito son un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--ed" data-id="mister-ed-y-huesito" role="button" tabindex="0" aria-label="Mister Ed y Huesito">/);
  for (const p of ['entero', 'red', 'cabalgata', 'tambor', 'ropa', 'ed', 'cola', 'patas', 'cuerpo', 'crin', 'cabeza', 'mandibula', 'parpado', 'pupila', 'brazo-lejos', 'brazo-cerca', 'jaula', 'canario', 'huesito', 'hueso-brazos', 'hueso-craneo', 'burbuja-1', 'burbuja-2', 'burbuja-3']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al número le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_ED.map((p) => p.nombre).sort());
  for (const p of PIEZAS_ED) assert.match(p.nombre, /^ed-/);
  // El ojo, el cogote, la mandíbula, los hombros y la jaula están donde deben.
  assert.ok(adentro('ed-cabeza', A.ojo) && adentro('ed-parpado', A.ojo) && adentro('ed-pupila', A.ojo), 'el ojo no está en la cara');
  assert.ok(adentro('ed-cabeza', A.cuello) && adentro('ed-cuerpo', A.cuello), 'la cabeza no se apoya en el cogote');
  assert.ok(adentro('ed-mandibula', A.mandibula) && adentro('ed-cabeza', A.mandibula), 'la mandíbula no tiene bisagra');
  assert.ok(adentro('ed-brazo-lejos', A.hombros[0]) && adentro('ed-cuerpo', A.hombros[0]), 'el brazo de lejos no sale del hombro');
  assert.ok(adentro('ed-brazo-cerca', A.hombros[1]) && adentro('ed-cuerpo', A.hombros[1]), 'el brazo de cerca no sale del hombro');
  assert.ok(adentro('ed-brazo-lejos', A.jaula) && adentro('ed-jaula', A.jaula), 'la jaula no cuelga de la pezuña');
  assert.ok(adentro('ed-cuerpo', A.cadera) || adentro('ed-patas', A.cadera), 'las patas no salen de la cadera');
  assert.ok(adentro('ed-cola', A.cola) || adentro('ed-cuerpo', A.cola), 'la cola no sale de la cintura');
  assert.ok(adentro('ed-tambor', A.tambor.centro) && adentro('ed-ropa', A.tambor.centro) && adentro('ed-tambor-fondo', A.tambor.centro), 'el tambor no está armado alrededor del centro');
  assert.ok(adentro('ed-red', A.hueco), 'el agujero no está en la red');
  // Huesito apoya donde dice el rig: los pies, las manos y el cráneo caben en sus piezas.
  assert.ok(adentro('ed-hueso-cuerpo', [0, -2]) && adentro('ed-hueso-brazos', [0, -70]) && adentro('ed-hueso-craneo', [0, -88]), 'Huesito no está armado alrededor de los pies');
  for (const p of PIEZAS_ED) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['ed-red', 'ed-cuerpo', 'ed-cabeza', 'ed-tambor', 'ed-hueso-cuerpo', 'ed-hueso-craneo']) assert.match(PIEZAS_ED.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_ED.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de Mister Ed y Huesito están en su bloque de tokens.css, medidas en Lobo suelto y Cordero atado, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨mister ed y huesito⟩'), tokens.indexOf('⟨/mister ed y huesito⟩'));
  const usadas = new Set(PIEZAS_ED.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-ed-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de Mister Ed`);
  assert.match(bloque, /public\/tapas\/cordero-atado\.jpg/);
  assert.match(bloque, /public\/tapas\/lobo-suelto\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨mister ed y huesito⟩ */'), sitio.indexOf('/* ⟨/mister ed y huesito⟩ */'));
  assert.match(suyo, /\.titere--ed \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"burbuja"'), 'las burbujas se pueden tocar');
});

test('hacen el número entre el medallón de Momo y el Morta, sin pisar a nadie ni al medallón, ya no son ojos, y en el camino están en el templo', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'el-templo');
  assert.equal(ED_PERSONAJE.ancla, ED.x);
  const [x0, y0] = alRecinto([-134, -266]);
  const [x1, y1] = alRecinto([100, 30]);
  // El Morta queda a la derecha y no se tocan; los otros bichos del templo, ni en los ojos ni en los títeres.
  assert.ok(x1 < MORTA.x - 55 * 1.1, `la jaula llega a ${x1.toFixed(0)} y pisa al Morta`);
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_TEMPLO)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > y0 && vy < y1), `${id} queda adentro del número`);
  }
  // El medallón cuelga encima: la cabeza del caballo, lo más alto, tiene que estar abajo de donde él llega.
  // El medallón es un círculo que cuelga arriba: donde está la cabeza del caballo, el borde de abajo del medallón tiene que quedar más arriba.
  const [mcx, mcy] = ARMADO.momo.centro;
  const radio = ARMADO.momo.radio * MOMO.escala;
  const cy = MOMO.argolla.y + (mcy - ARMADO.momo.argolla[1]) * MOMO.escala;
  const [cabezaX, cabezaArriba] = alRecinto([A.cuello[0] + 20, -266]);
  const dx = Math.abs(cabezaX - MOMO.argolla.x);
  const abajoDelMedallon = dx < radio ? cy + Math.sqrt(radio ** 2 - dx ** 2) : -Infinity;
  assert.ok(cabezaArriba > abajoDelMedallon + 2, `la cabeza llega a ${cabezaArriba.toFixed(0)} y el medallón baja hasta ${abajoDelMedallon.toFixed(0)}`);
  const escena = escenaTemplo(nombres);
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  assert.ok(escena.includes(`data-marco="${ID}"`));
  const piso = pisoDelCamino(CAMINOS['el-templo']!, nombres);
  assert.ok(piso.includes(`data-marco="${ID}" data-capa="figura" data-dx="0"`), 'no está en el templo del camino');
  const estampa = datos.bestias.find((b) => b.id === ID)!.estampa;
  assert.ok(estampa.length <= 320 && /lavarropas/.test(estampa) && /red/.test(estampa), estampa);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarEdCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  // Quietos están en equilibrio: el caballo derecho, Huesito en el lomo, la boca cerrada.
  assert.equal(giroDe(marcas(QUIETO).transform.ed!), 0);
  assert.ok(marcas(QUIETO).transform.huesito!.startsWith('translate('));
});

test('hablan, ruedan el tambor, se tambalean, canta el pajarito y Huesito salta, sin que nadie los toque', () => {
  const hechas: Record<Accion, number> = { habla: 0, rueda: 0, tambalea: 0, canta: 0, salta: 0, salto: 0 };
  const visto = { boca: 0, tx: 0, incl: 0, cabeza: 0, salta: 0, pierde: 0, jaula: 0, hundido: -Infinity };
  for (const semilla of [1, 2, 3, 4]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarEdCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 100; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      visto.boca = Math.max(visto.boca, giroDe(dom.de('mandibula', 'transform')));
      visto.tx = Math.max(visto.tx, trasladoDe(dom.de('cabalgata', 'transform'))[0]);
      visto.incl = Math.max(visto.incl, Math.abs(giroDe(dom.de('ed', 'transform'))));
      visto.cabeza = Math.max(visto.cabeza, giroDe(dom.de('cabeza', 'transform')));
      visto.jaula = Math.max(visto.jaula, Math.abs(giroDe(dom.de('jaula', 'transform'))));
      const [hx, hy] = trasladoDe(dom.de('huesito', 'transform'));
      visto.salta = Math.max(visto.salta, ED_ARMADO.lomo[1] - hy);
      visto.hundido = Math.max(visto.hundido, hy - ED_ARMADO.hueco[1]);
      assert.ok(Math.abs(hx) < 140, 'Huesito se fue del número');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['habla', 'rueda', 'tambalea', 'canta', 'salta'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.salto, 0, 'saltaron sin red sin que los toquen');
  assert.ok(visto.boca > 8, `la mandíbula llegó a ${visto.boca.toFixed(0)}`);
  assert.ok(visto.tx > 20, 'el tambor no se fue para adelante');
  assert.ok(visto.incl > 10, `el caballo no se tambaleó (${visto.incl.toFixed(0)})`);
  assert.ok(visto.cabeza > 5, 'no bajó la cabeza a mirar al pajarito');
  assert.ok(visto.salta > 20, `Huesito saltó solo ${visto.salta.toFixed(0)}`);
  assert.ok(visto.jaula > 15, 'la jaula no se bambolea');
  // Sin tocarlos, Huesito no se cae por el agujero: nunca baja del piso.
  assert.ok(visto.hundido < 0, 'Huesito se cayó por el agujero sin que los toquen');
});

test('tocados saltan otra vez sin red: el caballo se para de manos y relincha, Huesito da dos mortales, cae de cabeza por el agujero, sale y vuelve al lomo, y dicen su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarEdCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { incl: 0, boca: 0, gira: 0, alto: 0, hondo: -Infinity, enElAire: new Set<number>(), tiembla: 0, cabezaBaja: 0, sale: false, sinVerlo: 0 };
  let girado = 0;
  let giroAnterior = 0;
  const lomo0 = trasladoDe(dom.de('huesito', 'transform'));
  let viendose = true;
  for (let i = 1; i <= 60 * DURA.salto; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    visto.incl = Math.min(visto.incl, giroDe(dom.de('ed', 'transform')));
    visto.boca = Math.max(visto.boca, giroDe(dom.de('mandibula', 'transform')));
    const [, hy] = trasladoDe(dom.de('huesito', 'transform'));
    visto.alto = Math.min(visto.alto, hy - lomo0[1]);
    visto.hondo = Math.max(visto.hondo, hy);
    // Cuántas vueltas dio: lo que se acumula del giro.
    const g = giroDe(dom.de('huesito', 'transform'));
    const d = g - giroAnterior;
    giroAnterior = g;
    if (Math.abs(d) < 200) girado += Math.abs(d);
    visto.cabezaBaja = Math.max(visto.cabezaBaja, giroDe(dom.de('cabeza', 'transform')));
    const rojo = /scale\(([\d.]+) ([\d.]+)\)/.exec(dom.de('red', 'transform'));
    if (rojo) visto.tiembla = Math.max(visto.tiembla, Math.abs(1 - Number(rojo[2])));
    // Escondido: abajo del piso, donde el corte de la red no lo muestra.
    if (hy > 6 + HONDO * 0.5) viendose = false;
    if (!viendose && hy < 6 - 40 && u > TOQUE_T.sale[1]) visto.sale = true;
  }
  assert.ok(visto.incl < SALTA.incl * 0.9, `el caballo se paró de manos hasta ${visto.incl.toFixed(1)}`);
  assert.ok(RELINCHA < 0 && visto.boca > 20, 'no relinchó con la boca abierta');
  assert.ok(visto.alto < -ALTURA * 0.7, `Huesito subió ${visto.alto.toFixed(0)}`);
  assert.ok(girado > 360 * MORTALES * 0.7, `Huesito giró ${girado.toFixed(0)} grados`);
  assert.ok(visto.hondo > A.hueco[1] + 60, 'Huesito no se cayó por el agujero');
  assert.ok(visto.sale, 'Huesito no volvió a salir');
  assert.ok(visto.tiembla > 0.01, 'la red no tembló');
  assert.ok(visto.cabezaBaja > 8, 'el caballo no miró para abajo');
  // Al final están como antes: el caballo derecho, Huesito en el lomo.
  const [fx, fy] = trasladoDe(dom.de('huesito', 'transform'));
  assert.ok(Math.hypot(fx - lomo0[0], fy - lomo0[1]) < 8, `Huesito terminó en ${fx.toFixed(0)}, ${fy.toFixed(0)}`);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlos los pasa de equilibrio a saltando, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarEdCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('ed', 'transform'), marcas(SALTA).transform.ed);
  assert.equal(dom.de('huesito', 'transform'), marcas(SALTA).transform.huesito);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('ed', 'transform'), marcas(QUIETO).transform.ed);
});
