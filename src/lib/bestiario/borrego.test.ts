import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { BORREGO_PERSONAJE, PIEZAS_BORREGO } from './arte-borrego.ts';
import { BORREGO, BORREGO_ARMADO, CAIDO, COGOTE, DESNUDO, QUIETO, alRecinto, marcas, type Punto } from './rig-borrego.ts';
import { VECINOS_DEL_MONTE, escenaMonte } from './escena-monte.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { ACHATE, PALO, PASTURA, SOGA } from './rig.ts';
import { BRINCO, DURA, TOQUE_T, armarBorregoCon, type Accion } from '../../scripts/bestiario/borrego.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El borrego (`D-73`, vigesimoséptima vuelta): que sea un títere entero a aerógrafo, suelto en la pastura cerca del
 * palo y afuera de la soga del cordero, que juegue al borrego, que tocado se le caiga el disfraz y quede pelado con
 * los cortes a la vista, que se lo vuelva a subir, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-borrego';
const figura = capasDe('la-pastura', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_BORREGO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--borrego');
const giro = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
/** Cuánto se le cayó el disfraz, leído de lo que se aplastó. */
const caido = (transform: string): number => (1 - Number(/scale\([\d.]+ ([\d.]+)\)/.exec(transform)?.[1] ?? NaN)) / (1 - CAIDO.alto);

test('el borrego es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--borrego" data-id="el-borrego" role="button" tabindex="0" aria-label="El borrego">/);
  for (const p of ['entero', 'cuerpo', 'cola', 'pata-tras-1', 'pata-tras-2', 'pata-del-1', 'pata-del-2', 'tronco', 'vellon', 'cuello', 'cabeza', 'oreja-1', 'oreja-2', 'quijada', 'pupila', 'parpado', 'panuelo']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al borrego le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_BORREGO.map((p) => p.nombre).sort());
  for (const p of PIEZAS_BORREGO) assert.match(p.nombre, /^borrego-/);
  const A = BORREGO_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`borrego-pata-del-${n + 1}`, A.hombros[n]) && adentro('borrego-cuerpo', A.hombros[n]), `la pata de adelante ${n + 1} no sale del hombro`);
    assert.ok(adentro(`borrego-pata-tras-${n + 1}`, A.caderas[n]) && adentro('borrego-cuerpo', A.caderas[n]), `la pata de atrás ${n + 1} no sale de la cadera`);
    assert.ok(adentro(`borrego-oreja-${n + 1}`, A.orejas[n]) && adentro('borrego-cabeza', A.orejas[n]), `la oreja ${n + 1} no sale de la cabeza`);
    // Las patas llegan al piso.
    const [, , , alto] = caja(`borrego-pata-del-${n + 1}`);
    assert.ok(caja(`borrego-pata-del-${n + 1}`)[1] + alto >= 0, 'la pata no llega al piso');
  }
  assert.ok(adentro('borrego-cabeza', A.cuello) && adentro('borrego-cuerpo', A.cuello) && adentro('borrego-panuelo', A.cuello), 'la cabeza o el pañuelo no salen del cogote');
  // El cogote une la cabeza con el cuerpo: sale del mismo punto, se mete en los dos, y va debajo de la cabeza.
  assert.ok(adentro('borrego-cuello', A.cuello) && adentro('borrego-cuello', [A.cuello[0] + 14, A.cuello[1] - 18]) && adentro('borrego-cuello', [A.cuello[0] - 8, A.cuello[1] + 10]), 'el cogote no une la cabeza con el cuerpo');
  assert.ok(figura.indexOf('data-parte="cuello"') < figura.indexOf('data-parte="cabeza"') && figura.indexOf('data-parte="vellon"') < figura.indexOf('data-parte="cuello"'));
  // El pañuelo va de dos tintas, con el canto oscuro: el rojo de Luzbelito es un naranja, y el pasto también.
  const panuelo = PIEZAS_BORREGO.find((p) => p.nombre === 'borrego-panuelo')!.dibujo;
  assert.ok(panuelo.includes('--bestia-borrego-rojo') && /stroke="var\(--bestia-borrego-sombra\)" stroke-width="3\.4"/.test(panuelo), 'el pañuelo no tiene canto');
  assert.ok(adentro('borrego-cabeza', A.ojo.centro) && adentro('borrego-parpado', A.ojo.centro) && adentro('borrego-pupila', A.ojo.centro), 'el ojo no está en la cara');
  assert.ok(adentro('borrego-quijada', A.quijada) && adentro('borrego-cabeza', A.quijada) && adentro('borrego-cabeza', A.hocico), 'la quijada no cuelga de la cabeza');
  assert.ok(adentro('borrego-cola', A.cola) && adentro('borrego-cuerpo', A.cola), 'la cola no sale del cuerpo');
  assert.ok(adentro('borrego-vellon', A.cierre) && adentro('borrego-vellon', A.lomo), 'el cierre no está en el disfraz');
  // El disfraz tapa al cuerpo pelado entero: puesto, no se le ve un corte.
  const [cx, cy, cw, ch] = caja('borrego-cuerpo');
  assert.ok(A.vellon.arriba <= cy && A.vellon.abajo >= cy + ch - 6 && adentro('borrego-vellon', [cx + 6, cy + ch / 2]) && adentro('borrego-vellon', [cx + cw - 6, cy + ch / 2]), 'el disfraz no tapa al cuerpo');
  assert.match(PIEZAS_BORREGO.find((p) => p.nombre === 'borrego-cuerpo')!.dibujo, /stroke-dasharray/, 'el cuerpo no tiene los cortes a línea de puntos');
  for (const p of PIEZAS_BORREGO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['borrego-vellon', 'borrego-cuerpo', 'borrego-cabeza']) assert.match(PIEZAS_BORREGO.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_BORREGO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del borrego están en su bloque de tokens.css, medidas en Luzbelito, y su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el borrego⟩'), tokens.indexOf('⟨/el borrego⟩'));
  const usadas = new Set(PIEZAS_BORREGO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-borrego-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del borrego`);
  assert.match(bloque, /public\/tapas\/luzbelito\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el borrego⟩ */'), sitio.indexOf('/* ⟨/el borrego⟩ */'));
  assert.match(suyo, /\.titere--borrego \{ cursor: pointer; \}/);
});

test('vive en la pastura: suelto, cerca del palo y afuera de la soga del cordero, en el recinto del monte y en el claro del camino', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'la-pastura');
  assert.equal(BORREGO_PERSONAJE.ancla, BORREGO.x);
  const [ox, oy] = VECINOS_DEL_MONTE[ID]!;
  const [ex, ey] = alRecinto(BORREGO_ARMADO.ojo.centro);
  assert.ok(Math.hypot(ex - ox, ey - oy) < 6, `el ojo quedó en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  // En el claro, cerca del palo…
  const enElClaro = ((BORREGO.x - PALO.x) / PASTURA.rx) ** 2 + ((BORREGO.piso - PALO.y) / PASTURA.ry) ** 2 < 1;
  assert.ok(enElClaro, 'el borrego no está en el claro');
  assert.ok(Math.hypot(BORREGO.x - PALO.x, BORREGO.piso - PALO.y) < 200, 'quedó lejos del palo');
  // …y afuera de donde llega el cordero con la soga tirante, ni brincando.
  const [x0, y0] = alRecinto([-78, -146]);
  const [x1, y1] = alRecinto([122, 12]);
  for (const [x, y] of [[x1, y0 - BRINCO * BORREGO.escala], [x1, y1], [x0, y0]] as const) {
    assert.ok(((x - PALO.x) / SOGA) ** 2 + ((y - PALO.y) / (SOGA * ACHATE)) ** 2 > 1, `la soga llega a ${x.toFixed(0)}, ${y.toFixed(0)}`);
  }
  assert.ok(x0 > 0 && y1 < 640, 'se sale del recinto');
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_MONTE)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > y0 && vy < y1), `${id} queda adentro del borrego`);
  }
  // En el recinto del monte va en la figura, después del piso y antes del cordero.
  const escena = escenaMonte(nombres);
  assert.ok(escena.indexOf('/bestiario/monte-cerca.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso le queda delante');
  assert.ok(escena.indexOf(`data-marco="${ID}"`) < escena.indexOf('titere--cordero'), 'el cordero le queda detrás');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  // En el camino va con el claro, corrido entero, y tampoco es ojos.
  const tramo = CAMINOS['la-pastura']!;
  const piso = pisoDelCamino(tramo, nombres);
  const m = /data-marco="el-borrego" data-capa="figura" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no está en la pastura del camino');
  assert.equal(Number(m![1]), tramo.claro!.dx);
  assert.ok(!piso.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos en el camino');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarBorregoCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.equal(caido(marcas(QUIETO).transform.vellon!), 0, 'quieto no tiene el disfraz puesto');
});

test('juega al borrego: brinca, pasta, mira al atado, tira una patada, se rasca y se le baja el cierre; pestañea y colea', () => {
  const hechas: Record<Accion, number> = { brinca: 0, pasta: 0, mira: 0, patea: 0, rasca: 0, cierre: 0, desnudo: 0 };
  let pestaneos = 0;
  let alto = 0;
  let resbalo = 0;
  const colas = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarBorregoCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    for (let i = 1; i <= 60 * 60; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const k = Number(/scale\(1 ([\d.]+)\)/.exec(dom.de('parpado', 'transform'))?.[1] ?? 0);
      if (k > 0.9 && !cerrado) pestaneos++;
      cerrado = k > 0.9;
      alto = Math.max(alto, -trasladoDe(dom.de('cuerpo', 'transform'))[1]);
      const c = caido(dom.de('vellon', 'transform'));
      resbalo = Math.max(resbalo, c);
      // Sin tocarlo, el disfraz no se le cae: a lo sumo se le resbala.
      assert.ok(c < 0.35, `se le cayó el disfraz sin que lo toquen: ${c}`);
      if (i % 5 === 0) colas.add(dom.de('cola', 'transform'));
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['brinca', 'pasta', 'mira', 'patea', 'rasca', 'cierre'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.desnudo, 0, 'quedó pelado sin que lo toquen');
  assert.ok(alto > BRINCO * 0.95, `brincó ${alto.toFixed(0)}`);
  assert.ok(resbalo > 0.25, 'nunca se le resbaló el disfraz');
  assert.ok(pestaneos >= 10 && colas.size > 60, `pestañeó ${pestaneos} veces`);
});

test('tocado se le cae el disfraz: brinca, el vellón queda en el piso, tiembla pelado, bala, se lo sube a los tirones, se sacude y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarBorregoCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { alto: 0, caido: 0, tiembla: 0, bala: 0, agacha: 0, sacude: 0, accion: '' };
  const escalones = new Set<number>();
  for (let i = 1; i <= 60 * DURA.desnudo; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const [tx, ty] = trasladoDe(dom.de('cuerpo', 'transform'));
    visto.alto = Math.max(visto.alto, -ty);
    const c = caido(dom.de('vellon', 'transform'));
    visto.caido = Math.max(visto.caido, c);
    if (u > TOQUE_T.tiembla[0] && u < TOQUE_T.tiembla[1]) {
      visto.tiembla = Math.max(visto.tiembla, Math.abs(tx));
      // Mientras tiembla, el disfraz está en el piso.
      assert.ok(c > 0.99, `el disfraz subió solo: ${c}`);
    }
    visto.bala = Math.max(visto.bala, giro(dom.de('quijada', 'transform')));
    visto.agacha = Math.max(visto.agacha, giro(dom.de('cabeza', 'transform')));
    // El cogote sigue a la cabeza en cada cuadro: nunca queda el hueco.
    assert.ok(Math.abs(giro(dom.de('cuello', 'transform')) - giro(dom.de('cabeza', 'transform')) * COGOTE) < 0.02, 'el cogote no siguió a la cabeza');
    if (u > TOQUE_T.sube[0] && u < TOQUE_T.sube[1]) escalones.add(Math.round(c * 3));
    if (u > TOQUE_T.sacude[0]) visto.sacude = Math.max(visto.sacude, Math.abs(giro(dom.de('cuerpo', 'transform'))));
    if (i === 60 * 2) visto.accion = vivo.estado().accion ?? '';
  }
  assert.ok(visto.alto > BRINCO, `brincó ${visto.alto.toFixed(0)}`);
  assert.ok(visto.caido > 0.99 && visto.tiembla > 1, 'no se le cayó el disfraz o no tembló');
  assert.ok(visto.bala > 20 && visto.agacha > 44, 'no baló o no agachó la cabeza al disfraz');
  assert.ok(escalones.size >= 3, 'no se lo subió a los tirones');
  assert.ok(visto.sacude > 3, 'no se sacudió');
  assert.equal(visto.accion, 'desnudo');
  // Al final tiene el disfraz puesto otra vez.
  assert.ok(caido(dom.de('vellon', 'transform')) < 0.01, 'quedó pelado');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de disfrazado a pelado, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarBorregoCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('vellon', 'transform'), marcas(DESNUDO).transform.vellon);
  assert.equal(caido(dom.de('vellon', 'transform')), 1);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('vellon', 'transform'), marcas(QUIETO).transform.vellon);
});
