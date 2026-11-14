import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { ALMEJAS_PERSONAJE, PIEZAS_ALMEJAS } from './arte-almejas.ts';
import { ALMEJAS, ALMEJAS_ARMADO, QUIETO, SOPA, alRecinto, cucharaA, marcas, puntaDeLaCuchara, type Punto } from './rig-almejas.ts';
import { ASTILLERO, COSAS_DE_LOS_ASTILLEROS, OJOS_DE_LOS_ASTILLEROS } from './rig-entornos.ts';
import { escenaAstilleros } from './escenas-entornos.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS, K_ENTORNO } from './camino.ts';
import { DURA, SALTA, TOQUE_T, armarAlmejasCon, type Accion } from '../../scripts/bestiario/almejas.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * Las almejas (`D-73`, vigesimoctava vuelta): que sean un títere entero a aerógrafo, un balde sobre el muelle de los
 * astilleros con el plato de sopa al lado, que no estén más pintadas en el piso, que hablen, se escapen, le muerdan la
 * cuchara y bostecen sin que nadie las toque, que tocadas se cierren de un golpe, abran, tiren tres chorros y escupan una
 * perla que cae en la sopa, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string; estampa: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'las-almejas';
const figura = capasDe('los-astilleros', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_ALMEJAS.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--almejas');
/** El giro de una valva: el primer número del `rotate(…)`. */
const giroDe = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
const A = ALMEJAS_ARMADO;

test('las almejas son un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--almejas" data-id="las-almejas" role="button" tabindex="0" aria-label="Las almejas">/);
  for (const p of ['entero', 'balde', 'almeja-1', 'almeja-2', 'almeja-3', 'tapa-1', 'tapa-2', 'tapa-3', 'chorro-1', 'chorro-2', 'chorro-3', 'fugi', 'fugi-cuerpo', 'fugi-tapa', 'fugi-pie', 'cuchara', 'vapor-1', 'vapor-2', 'perla']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `a las almejas les falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_ALMEJAS.map((p) => p.nombre).sort());
  for (const p of PIEZAS_ALMEJAS) assert.match(p.nombre, /^almejas-/);
  // Las tres almejas y la fugitiva apoyan donde dice el rig: la bisagra está adentro de la pieza de abajo y de la de arriba.
  assert.ok(adentro('almejas-base', A.bisagra) && adentro('almejas-tapa', A.bisagra), 'la bisagra no está en la almeja');
  for (const [x, y] of A.almejas) assert.ok(adentro('almejas-fondo', [x, y]), 'una almeja no está en la boca del balde');
  assert.ok(adentro('almejas-fondo', A.boca) && adentro('almejas-frente', [0, A.boca[1] + 4]), 'el frente del balde no cierra con el fondo');
  assert.ok(adentro('almejas-plato', A.plato) && adentro('almejas-cuchara', puntaDeLaCuchara(0, 0, 0)), 'la cuchara no está en el plato');
  assert.ok(adentro('almejas-cuchara', A.cuchara.pivote) || adentro('almejas-plato', A.cuchara.pivote), 'el cabo no se apoya en el plato');
  // La cuchara llega a la almeja de la derecha: si no, no la podría morder.
  const tope = cucharaA([A.almejas[2][0] - 2, A.almejas[2][1] - 6], -22);
  const [px, py] = puntaDeLaCuchara(...tope);
  assert.ok(Math.hypot(px - (A.almejas[2][0] - 2), py - (A.almejas[2][1] - 6)) < 0.5, 'la cuchara no llega a la almeja');
  for (const p of PIEZAS_ALMEJAS) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['almejas-suelo', 'almejas-fondo', 'almejas-frente', 'almejas-base', 'almejas-tapa', 'almejas-plato']) assert.match(PIEZAS_ALMEJAS.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_ALMEJAS.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de las almejas están en su bloque de tokens.css, medidas en Lobo suelto y Cordero atado, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨las almejas⟩'), tokens.indexOf('⟨/las almejas⟩'));
  const usadas = new Set(PIEZAS_ALMEJAS.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-almejas-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de las almejas`);
  assert.match(bloque, /public\/tapas\/lobo-suelto\.jpg/);
  assert.match(bloque, /public\/tapas\/cordero-atado\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨las almejas⟩ */'), sitio.indexOf('/* ⟨/las almejas⟩ */'));
  assert.match(suyo, /\.titere--almejas \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"chorro"') && suyo.includes('"vapor"') && suyo.includes('"perla"'), 'los chorros, el vapor y la perla se pueden tocar');
});

test('apoyan en el muelle al lado de la farola y del plato, sin pisar a nadie, ya no están pintadas en el piso, y en el camino quedan en la tabla', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'los-astilleros');
  assert.equal(ALMEJAS_PERSONAJE.ancla, ALMEJAS.x);
  assert.equal(ALMEJAS.piso, ASTILLERO.balde.piso);
  // Todo lo que apoya (el balde, las cartas, el plato) entra en el muelle y no pisa a los otros bichos.
  const [x0, y0] = alRecinto([-106, -150]);
  const [x1, y1] = alRecinto([150, 0]);
  assert.ok(y0 > ASTILLERO.muelle + 20 && y1 <= 640, 'se sale del muelle');
  for (const k of [1, K_ENTORNO]) {
    const corre = ALMEJAS.x * (k - 1);
    assert.ok(alRecinto([0, -90])[1] > ASTILLERO.farol.piso + 8, `con k ${k} el balde pisa la base de la farola`);
    for (const [id, [vx, vy]] of [...Object.entries(OJOS_DE_LOS_ASTILLEROS), ...Object.entries(COSAS_DE_LOS_ASTILLEROS)]) {
      if (id === ID) continue;
      assert.ok(!(vx * k > x0 + corre && vx * k < x1 + corre && vy > y0 && vy < y1), `con k ${k}, ${id} queda adentro de las almejas`);
    }
  }
  const escena = escenaAstilleros(nombres);
  assert.ok(escena.indexOf('/bestiario/astillero-piso.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso las tapa');
  assert.ok(!escena.includes(`class="bestia bestia--cosa" data-id="${ID}"`) && !escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo una cosa en el piso');
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8'), /t-balde/, 'sigue pintado el balde en el piso de los astilleros');
  const piso = pisoDelCamino(CAMINOS['los-astilleros']!, nombres);
  const m = /data-marco="las-almejas" data-capa="figura" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no están en los astilleros del camino');
  assert.equal(Number(m![1]), Math.round(ALMEJAS.x * (K_ENTORNO - 1)));
  // La estampa cuenta lo que el dibujo pone, y entra en el tope del schema.
  const estampa = datos.bestias.find((b) => b.id === ID)!.estampa;
  assert.ok(estampa.length <= 320 && /perla/.test(estampa) && /cuchara/.test(estampa), estampa);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarAlmejasCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  // Quietas están entreabiertas, para que se les vean los ojos, la cuchara está en el plato y no hay chorros ni perla.
  assert.ok(giroDe(marcas(QUIETO).transform['tapa-2']!) < -10);
  assert.equal(marcas(QUIETO).opacity['chorro-1'], '0');
  assert.equal(marcas(QUIETO).opacity.perla, '0');
});

test('hablan, una se escapa por la tabla, la cuchara baja a buscarlas y le muerden la punta, y una bosteza', () => {
  const hechas: Record<Accion, number> = { hablan: 0, fuga: 0, cuchara: 0, bostezo: 0, toque: 0 };
  const visto = { abrenPocoYMucho: new Set<number>(), fuga: 0, miraDos: new Set<string>(), cucharaArriba: 0, prendida: 0, bosteza: 0, pie: 0 };
  for (const semilla of [1, 2, 3, 4]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarAlmejasCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 90; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      visto.fuga = Math.max(visto.fuga, -(trasladoDe(dom.de('fugi', 'transform'))[0] - A.fugitiva.x));
      visto.miraDos.add(dom.de('fugi-cuerpo', 'transform'));
      visto.cucharaArriba = Math.max(visto.cucharaArriba, -trasladoDe(dom.de('cuchara', 'transform'))[1]);
      visto.bosteza = Math.max(visto.bosteza, -giroDe(dom.de('tapa-1', 'transform')));
      visto.pie = Math.max(visto.pie, Number(/scale\(([\d.]+) 1\)/.exec(dom.de('fugi-pie', 'transform'))?.[1] ?? 0));
      if (i % 4 === 0) visto.abrenPocoYMucho.add(Math.round(giroDe(dom.de('tapa-3', 'transform'))));
      // Sin tocarlas, no sale ni un chorro ni una perla.
      assert.equal(dom.de('chorro-2', 'opacity'), '0');
      assert.equal(dom.de('perla', 'opacity'), '0');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['hablan', 'fuga', 'cuchara', 'bostezo'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque, 0, 'tiraron los chorros sin que las toquen');
  assert.ok(visto.fuga > A.fugitiva.hasta * 0.9, `la fugitiva llegó a ${visto.fuga.toFixed(0)}`);
  assert.equal(visto.miraDos.size, 2, 'la fugitiva no se dio vuelta');
  assert.ok(visto.cucharaArriba > 30, 'la cuchara no subió al balde');
  assert.ok(visto.bosteza > A.abre * 0.9, 'ninguna bostezó a pleno');
  assert.ok(visto.pie > 0.9, 'la fugitiva no estiró el pie');
  assert.ok(visto.abrenPocoYMucho.size > 10, 'las valvas no se mueven');
});

test('la cuchara baja a la almeja de la derecha y se la muerde: se cierra de golpe, la cuelga de la punta y la suelta', () => {
  // Con la acción forzada: se mira el momento de la mordida, cuadro a cuadro.
  const dom = nuevo();
  const { esc, poner } = escenario(false);
  const vivo = armarAlmejasCon(dom.marcos, esc, () => 0.51);
  let cierra = Infinity;
  let cuelga = 0;
  let desde = -1;
  for (let i = 1; i <= 60 * 120 && desde < 0; i++) {
    poner(i / 60);
    vivo.mover(i / 60, 1 / 60);
    if (vivo.estado().accion === 'cuchara') desde = i / 60;
  }
  assert.ok(desde > 0, 'no hubo cuchara con ese azar');
  let anterior = -giroDe(dom.de('tapa-3', 'transform'));
  for (let i = 1; i <= 60 * DURA.cuchara; i++) {
    const t = desde + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const ahora = -giroDe(dom.de('tapa-3', 'transform'));
    // La mordida es un portazo: de abierta a cerrada en un par de cuadros.
    if (anterior > 25 && ahora < 3 && cierra === Infinity) cierra = t - desde;
    anterior = ahora;
    const [ax, ay] = trasladoDe(dom.de('almeja-3', 'transform'));
    const [hx, hy] = [A.almejas[2][0], A.almejas[2][1]];
    cuelga = Math.max(cuelga, Math.hypot(ax - hx, ay - hy));
  }
  assert.ok(cierra < DURA.cuchara * 0.6, `la almeja no mordió (cerró a los ${cierra})`);
  assert.ok(cuelga > 20, `la almeja no quedó colgada de la cuchara (${cuelga.toFixed(0)})`);
  // Al final la cuchara está en el plato y la almeja en su lugar.
  assert.ok(Math.hypot(...(trasladoDe(dom.de('almeja-3', 'transform')).map((v, i) => v - A.almejas[2][i]!) as [number, number])) < 1.5, 'la almeja no volvió al balde');
});

test('tocadas se cierran de un golpe, el balde salta, abren de par en par, tiran tres chorros, escupen una perla que cae en la sopa, y dicen su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarAlmejasCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { salto: 0, abre: [0, 0, 0], cierraAlPrincipio: 99, chorros: new Set<number>(), perla: 0, perlaFinal: [0, 0], cuchara: 0, simultaneos: 0 };
  for (let i = 1; i <= 60 * DURA.toque; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    visto.salto = Math.max(visto.salto, -trasladoDe(dom.de('balde', 'transform'))[1]);
    for (const k of [0, 1, 2]) visto.abre[k] = Math.max(visto.abre[k]!, -giroDe(dom.de(`tapa-${k + 1}`, 'transform')));
    if (u < 0.45) visto.cierraAlPrincipio = Math.min(visto.cierraAlPrincipio, -giroDe(dom.de('tapa-2', 'transform')));
    let vivos = 0;
    for (const k of [1, 2, 3]) {
      const c = Number(/scale\(1 ([\d.]+)\)/.exec(dom.de(`chorro-${k}`, 'transform'))?.[1] ?? 0);
      if (dom.de(`chorro-${k}`, 'opacity') === '1' && c > 0.9) visto.chorros.add(k);
      if (dom.de(`chorro-${k}`, 'opacity') === '1' && c > 0.3) vivos++;
    }
    visto.simultaneos = Math.max(visto.simultaneos, vivos);
    if (dom.de('perla', 'opacity') === '1') {
      const [px, py] = trasladoDe(dom.de('perla', 'transform'));
      visto.perla = Math.min(visto.perla, py);
      visto.perlaFinal = [px, py];
    }
    visto.cuchara = Math.max(visto.cuchara, giroDe(dom.de('cuchara', 'transform')));
  }
  assert.ok(visto.salto > SALTA * 0.95, `el balde saltó ${visto.salto.toFixed(1)}`);
  assert.ok(visto.cierraAlPrincipio < 3, 'no se cerraron de golpe');
  for (const k of [0, 1, 2]) assert.ok(visto.abre[k]! > A.abre * 0.8, `la almeja ${k + 1} no abrió de par en par`);
  assert.deepEqual([...visto.chorros].sort(), [1, 2, 3], 'faltó un chorro');
  assert.ok(visto.simultaneos <= 2, 'tiran los tres chorros a la vez: tiene que ser uno atrás del otro');
  assert.ok(visto.perla < -130, `la perla no hizo arco (llegó a ${visto.perla.toFixed(0)})`);
  // La perla aterriza en la sopa: el último lugar donde se la vio está arriba del plato.
  assert.ok(Math.abs(visto.perlaFinal[0] - A.plato[0]) < 12 && visto.perlaFinal[1] > A.plato[1] - 30, `la perla cayó en ${visto.perlaFinal.map((v) => v.toFixed(0))}`);
  assert.ok(visto.cuchara > 8, 'la sopa no recibió la perla con un golpe de cuchara');
  // Los tiempos que declara el toque son los que tiene la conducta.
  assert.ok(TOQUE_T.perla[1] <= TOQUE_T.cuchara[0] + 0.3 && TOQUE_T.fin <= DURA.toque);
  // Al final están como antes: abiertas de a poco, sin chorros ni perla, el balde apoyado.
  assert.equal(trasladoDe(dom.de('balde', 'transform'))[1], 0);
  assert.equal(dom.de('perla', 'opacity'), '0');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlas las pasa de entreabiertas a abiertas con la perla en el aire, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarAlmejasCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('tapa-1', 'transform'), marcas(SOPA).transform['tapa-1']);
  assert.equal(dom.de('chorro-2', 'opacity'), '1');
  assert.equal(dom.de('perla', 'opacity'), '1');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('tapa-1', 'transform'), marcas(QUIETO).transform['tapa-1']);
  assert.equal(dom.de('perla', 'opacity'), '0');
});
