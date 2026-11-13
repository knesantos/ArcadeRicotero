import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_POLIZON, POLIZON_PERSONAJE } from './arte-polizon.ts';
import { ABRE, ASOMA, POLIZON, POLIZON_ARMADO, QUIETO, RENDIJA, alRecinto, marcas, type Punto } from './rig-polizon.ts';
import { VECINOS_DEL_BAJO, escenaBajo } from './escenas.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { BAJO, PIERRE, marcoDelRecinto } from './rig.ts';
import { DURA, GOLPES, SOSTIENE, TOQUE_T, armarPolizonCon, type Accion } from '../../scripts/bestiario/polizon.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El polizón del remolque (`D-73`, vigesimoséptima vuelta): que sea un títere entero a aerógrafo abajo de su bote
 * dado vuelta, adelante en el bajo, donde estaba pintado el bote, que a oscuras no se le vea nada, que solo espíe,
 * saque el café y el salero, prenda un fósforo y golpee, que tocado lo destapen, resplandezca, pida silencio y se
 * vuelva a tapar, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-polizon-del-remolque';
const figura = capasDe('el-bajo', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_POLIZON.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--polizon');
const giro = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
/** Cuánto está abierto el bote, leído de lo que giró en la popa. */
const abierto = (transform: string): number => Math.abs(giro(transform) / ABRE);

test('el polizón es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--polizon" data-id="el-polizon-del-remolque" role="button" tabindex="0" aria-label="El polizón del remolque">/);
  for (const p of ['entero', 'ondas', 'adentro', 'polizon', 'resplandor', 'sombra', 'pupila-1', 'pupila-2', 'parpado-1', 'parpado-2', 'brazo', 'fosforo', 'cafe', 'salero', 'bote', 'corona']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al polizón le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_POLIZON.map((p) => p.nombre).sort());
  for (const p of PIEZAS_POLIZON) assert.match(p.nombre, /^polizon-/);
  const A = POLIZON_ARMADO;
  assert.ok(adentro('polizon-bote', A.popa) && adentro('polizon-bote', A.proa) && adentro('polizon-bote', A.quilla), 'el bote no va de popa a proa');
  assert.ok(adentro('polizon-adentro', A.popa), 'lo oscuro no sale de la popa');
  assert.ok(adentro('polizon-corona', A.corona) && adentro('polizon-bote', A.corona), 'la corona no se apoya en el bote');
  for (const n of [0, 1] as const) {
    assert.ok(adentro('polizon-cabeza', A.ojos[n]) && adentro(`polizon-parpado-${n + 1}`, A.ojos[n]) && adentro(`polizon-pupila-${n + 1}`, A.ojos[n]), `el ojo ${n + 1} no está en la cara`);
  }
  assert.ok(adentro('polizon-cabeza', A.cara) && adentro('polizon-resplandor', A.cara), 'la cara no está en el medio del resplandor');
  assert.ok(adentro('polizon-brazo', A.hombro) && adentro('polizon-cuerpo', A.hombro), 'el brazo no sale del hombro');
  assert.ok(adentro('polizon-cafe', A.cafe.adentro) && adentro('polizon-salero', A.salero.adentro) && adentro('polizon-fosforo', A.fosforo), 'el café, el salero o el fósforo no están donde los saca');
  // Con el bote cerrado no se le ve nada: agachado entra entero abajo del casco, y el café y el salero también.
  const [, by] = caja('polizon-bote');
  const [, cy] = caja('polizon-cabeza');
  assert.ok(cy + A.agachado > A.quilla[1] + 6 && cy + A.agachado > by, 'agachado le asoma la cabeza por arriba del bote');
  const [fx, , fw] = caja('polizon-cafe');
  const [sx] = caja('polizon-salero');
  assert.ok(fx + fw < A.proa[0] && sx > A.popa[0], 'el café o el salero asoman con el bote cerrado');
  assert.ok(fx + fw + A.cafe.afuera > A.proa[0] + 30 && sx + A.salero.afuera < A.popa[0] - 30, 'el café o el salero no llegan a salir');
  // En la rendija, los ojos quedan entre el agua y la borda levantada.
  const ojoY = A.ojos[1][1] + A.agachado * (1 - RENDIJA);
  const borda = -Math.tan((ABRE * RENDIJA * Math.PI) / 180) * (A.ojos[1][0] - A.popa[0]);
  assert.ok(ojoY < -2 && ojoY - A.radio[1] > borda - 2, `en la rendija los ojos quedan a ${ojoY.toFixed(0)} y la borda a ${borda.toFixed(0)}`);
  // A oscuras es una sombra con dos ojos: la sombra lo tapa entero, y los ojos van arriba de ella.
  assert.ok(adentro('polizon-sombra', A.cara) && adentro('polizon-sombra', A.hombro) && caja('polizon-sombra')[1] <= caja('polizon-cabeza')[1], 'la sombra no lo tapa');
  assert.ok(figura.indexOf('data-parte="sombra"') < figura.indexOf('polizon-ojos.webp') && figura.indexOf('polizon-cabeza.webp') < figura.indexOf('data-parte="sombra"'), 'los ojos no van arriba de la sombra');
  assert.equal(marcas(QUIETO).opacity.sombra, '1');
  assert.equal(marcas(ASOMA).opacity.sombra, '0');
  // Lo de abajo del bote no pasa del agua.
  assert.match(figura, /<clipPath id="polizon-seco"><rect x="-280" y="-300" width="600" height="302"\/><\/clipPath>/);
  for (const p of PIEZAS_POLIZON) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['polizon-bote', 'polizon-cabeza', 'polizon-corona', 'polizon-cuerpo']) assert.match(PIEZAS_POLIZON.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  // El resplandor y la luz del fósforo no son un degradado liso: van rociados.
  for (const n of ['polizon-resplandor', 'polizon-fosforo']) assert.match(PIEZAS_POLIZON.find((p) => p.nombre === n)!.dibujo, /url\(#rociado\)/);
  const peso = PIEZAS_POLIZON.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 30 && peso <= 240, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del polizón están en su bloque de tokens.css, medidas en La mosca y la sopa, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el polizon del remolque⟩'), tokens.indexOf('⟨/el polizon del remolque⟩'));
  const usadas = new Set(PIEZAS_POLIZON.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-polizon-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del polizón`);
  assert.match(bloque, /public\/tapas\/la-mosca-y-la-sopa\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el polizon del remolque⟩ */'), sitio.indexOf('/* ⟨/el polizon del remolque⟩ */'));
  assert.match(suyo, /\.titere--polizon \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"ondas"') && suyo.includes('"resplandor"'), 'las ondas o el resplandor se pueden tocar');
});

test('flota adelante en el bajo, donde estaba pintado el bote, que ya no se pinta en el frente, sin pisar a nadie; y va con el recinto al camino', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'el-bajo');
  assert.equal(POLIZON_PERSONAJE.ancla, POLIZON.x);
  // En el agua de adelante, más acá de donde el agua toca a Pierre, y adentro de la sala.
  const sala = marcoDelRecinto('el-bajo');
  const [x0, y0] = alRecinto([-266, -94 - 60]);
  const [x1, y1] = alRecinto([250, 24]);
  assert.ok(POLIZON.piso > PIERRE.agua + 60 && POLIZON.piso > BAJO.fondo && y1 < 640, 'no está en el agua de adelante');
  assert.ok(x0 > sala.x && x1 < PIERRE.x - 120, 'se sale de la sala o pisa a Pierre');
  // Sus ojos de antes están donde le asoman ahora: en la rendija, del lado de la proa.
  const [ox, oy] = VECINOS_DEL_BAJO[ID]!;
  const [ex, ey] = alRecinto([POLIZON_ARMADO.ojos[1][0], POLIZON_ARMADO.ojos[1][1] + POLIZON_ARMADO.agachado * (1 - RENDIJA)]);
  assert.ok(Math.hypot(ex - ox, ey - oy) < 12, `los ojos asoman en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_BAJO)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > y0 && vy < y1), `${id} queda adentro del bote`);
  }
  // Va en la figura: delante del agua, y detrás de lo que flota adelante.
  const escena = escenaBajo(nombres);
  assert.ok(escena.lastIndexOf('/bestiario/bajo-agua.webp') < escena.indexOf(`data-marco="${ID}"`), 'el agua lo tapa');
  assert.ok(escena.indexOf(`data-marco="${ID}"`) < escena.indexOf('/bestiario/bajo-frente.webp'), 'lo de adelante le queda atrás');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-bajo.ts', 'utf-8'), /const bote = |bf-bote/, 'el bote sigue pintado en el frente del bajo');
  const piso = pisoDelCamino(CAMINOS['el-bajo']!, nombres);
  assert.ok(piso.includes(`data-marco="${ID}"`) && !piso.includes(`bestia--ojos" data-id="${ID}"`), 'no está en el bajo del camino');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento, y a oscuras no se le ve nada', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarPolizonCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  const { transform, opacity } = marcas(QUIETO);
  assert.equal(abierto(transform.bote!), 0);
  for (const p of ['polizon', 'brazo', 'cafe', 'salero', 'resplandor', 'fosforo', 'ondas']) assert.equal(Number(opacity[p]), 0, `quieto se le ve ${p}`);
});

test('cuida que lo sigan dando por muerto: espía por la rendija, saca el café, sala el agua, prende un fósforo y golpea; el bote se mece', () => {
  const hechas: Record<Accion, number> = { espia: 0, cafe: 0, sal: 0, fosforo: 0, golpea: 0, asoma: 0 };
  const visto = { rendija: 0, cafe: 0, salero: 0, fosforo: 0, golpes: 0 };
  const meces = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarPolizonCon(dom.marcos, esc, azar(semilla));
    let golpeando = false;
    for (let i = 1; i <= 60 * 80; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const a = abierto(dom.de('bote', 'transform'));
      visto.rendija = Math.max(visto.rendija, a);
      // Solo, nunca se destapa: a lo sumo una rendija. Y no resplandece ni pide silencio.
      assert.ok(a < RENDIJA + 0.05, `se destapó solo: ${a.toFixed(2)}`);
      assert.equal(Number(dom.de('resplandor', 'opacity')), 0);
      assert.equal(dom.de('brazo', 'opacity'), '0');
      // A oscuras es una sombra: solo el fósforo le alumbra la cara, y a medias.
      if (Number(dom.de('fosforo', 'opacity')) < 0.01) assert.equal(Number(dom.de('sombra', 'opacity')), 1, 'se le ve la cara a oscuras');
      assert.ok(Number(dom.de('sombra', 'opacity')) > 0.25, 'el fósforo lo alumbra como si lo hubieran destapado');
      // Si se le ve algo, es porque hay rendija.
      if (a < 0.01) assert.equal(dom.de('polizon', 'opacity'), '0', 'se le ve algo con el bote cerrado');
      if (dom.de('cafe', 'opacity') === '1') visto.cafe = Math.max(visto.cafe, trasladoDe(dom.de('cafe', 'transform'))[0]);
      if (dom.de('salero', 'opacity') === '1') visto.salero = Math.min(visto.salero, trasladoDe(dom.de('salero', 'transform'))[0]);
      visto.fosforo = Math.max(visto.fosforo, Number(dom.de('fosforo', 'opacity')));
      const g = Math.abs(trasladoDe(dom.de('bote', 'transform'))[0]) > 1;
      if (g && !golpeando) visto.golpes++;
      if (g) golpeando = true;
      if (Math.abs(trasladoDe(dom.de('bote', 'transform'))[0]) < 0.05) golpeando = false;
      if (i % 5 === 0) meces.add(dom.de('bote', 'transform'));
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['espia', 'cafe', 'sal', 'fosforo', 'golpea'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.asoma, 0, 'se destapó sin que lo toquen');
  assert.ok(visto.rendija > RENDIJA * 0.95, 'nunca levantó la rendija');
  assert.ok(visto.cafe > POLIZON_ARMADO.cafe.afuera * 0.98 && visto.salero < POLIZON_ARMADO.salero.afuera * 0.98, 'no sacó el café o el salero');
  assert.ok(visto.fosforo > 0.9, 'no prendió el fósforo');
  assert.ok(visto.golpes >= hechas.golpea * GOLPES * 0.6, `golpeó ${visto.golpes} veces en ${hechas.golpea} tandas`);
  assert.ok(meces.size > 500, 'el bote no se mece');
});

test('tocado lo destapan: el bote se levanta, la corona se cae después, resplandece, pide silencio, baja despacio, suelta el bote, abre ondas, endereza la corona y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarPolizonCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { abre: 0, corona: 0, resplandor: 0, chist: Infinity, ondas: 0, encandila: 0, accion: '' };
  let coronaEn = Infinity;
  let boteEn = Infinity;
  let antes = 0;
  let masRapido = 0;
  let masLento = Infinity;
  for (let i = 1; i <= 60 * DURA.asoma; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const a = abierto(dom.de('bote', 'transform'));
    visto.abre = Math.max(visto.abre, a);
    if (a > 0.5 && boteEn === Infinity) boteEn = u;
    const c = giro(dom.de('corona', 'transform'));
    visto.corona = Math.max(visto.corona, c);
    if (c > ASOMA.corona * 0.5 && coronaEn === Infinity) coronaEn = u;
    visto.resplandor = Math.max(visto.resplandor, Number(dom.de('resplandor', 'opacity')));
    if (dom.de('brazo', 'opacity') === '1') visto.chist = Math.min(visto.chist, giro(dom.de('brazo', 'transform')));
    visto.ondas = Math.max(visto.ondas, Number(dom.de('ondas', 'opacity')));
    if (u < TOQUE_T.resplandece[1]) visto.encandila = Math.max(visto.encandila, Number(/scale\(1 ([\d.]+)\)/.exec(dom.de('parpado-1', 'transform'))?.[1] ?? 0));
    // Lo baja despacio mientras lo sostiene, y lo suelta al final: la caída es mucho más rápida.
    const baja = (antes - a) * 60;
    if (u > TOQUE_T.baja[0] + 0.3 && u < TOQUE_T.baja[1] - 0.3) masLento = Math.min(masLento, baja);
    if (u > TOQUE_T.cae[0] && u <= TOQUE_T.cae[1] + 0.02) masRapido = Math.max(masRapido, baja);
    antes = a;
    // Cuando el bote baja de la mitad, ya es una sombra con dos ojos: nunca una cabeza pegada al agua.
    if (u > TOQUE_T.abre[1] && a < 0.5) assert.ok(Number(dom.de('sombra', 'opacity')) > 0.9, `a los ${u.toFixed(2)} s el bote está a ${a.toFixed(2)} y se le ve la cara`);
    if (u > TOQUE_T.chist[0] && u < TOQUE_T.chist[1]) assert.equal(Number(dom.de('sombra', 'opacity')), 0, 'pidió silencio a oscuras');
    // Mientras pide silencio, está destapado del todo y a la vista.
    if (u > TOQUE_T.chist[0] + 0.5 && u < TOQUE_T.chist[1] - 0.4) assert.ok(a > 0.99 && dom.de('polizon', 'opacity') === '1' && trasladoDe(dom.de('polizon', 'transform'))[1] < 0.5, 'pidió silencio tapado');
    if (i === 60 * 3) visto.accion = vivo.estado().accion ?? '';
  }
  assert.ok(visto.abre > 0.99, 'el bote no se levantó del todo');
  assert.ok(visto.corona > ASOMA.corona * 0.95 && coronaEn > boteEn + 0.3, `la corona se cayó a los ${coronaEn.toFixed(2)} s y el bote se abrió a los ${boteEn.toFixed(2)} s`);
  assert.ok(visto.encandila > 0.6, 'no se encandiló');
  assert.ok(visto.resplandor > 0.95, 'no resplandeció');
  assert.ok(visto.chist < 1, 'no pidió silencio');
  assert.ok(masLento > 0 && masRapido > masLento * 2 && SOSTIENE < 1, `bajó a ${masLento.toFixed(2)} y cayó a ${masRapido.toFixed(2)} por segundo`);
  assert.ok(visto.ondas > 0.7, 'el bote no abrió ondas');
  assert.equal(visto.accion, 'asoma');
  // Al final está tapado, a oscuras, con la corona derecha (apenas mecida).
  assert.ok(abierto(dom.de('bote', 'transform')) < 0.01 && dom.de('polizon', 'opacity') === '0', 'quedó destapado');
  assert.ok(Math.abs(giro(dom.de('corona', 'transform'))) < 2, 'la corona quedó torcida');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de tapado a destapado, resplandeciendo, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarPolizonCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('bote', 'transform'), marcas(ASOMA).transform.bote);
  assert.equal(dom.de('polizon', 'opacity'), '1');
  assert.equal(Number(dom.de('resplandor', 'opacity')), 1);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('bote', 'transform'), marcas(QUIETO).transform.bote);
});
