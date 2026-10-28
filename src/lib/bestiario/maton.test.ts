import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_MATON } from './arte-maton.ts';
import { LAME, MATON, MATON_ARMADO, OPERATIVO, QUIETO, RATON, SALTO, alRecinto, manoQueLame, type Punto } from './rig-maton.ts';
import { ATILA, CHAPA } from './rig.ts';
import { VECINOS_DEL_BALDIO, escenaBaldio } from './escenas.ts';
import { DURA, OPERATIVO_T, armarMatonCon, type Accion } from '../../scripts/bestiario/maton.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El gato matón (`D-73`, vigesimosegunda vuelta): que sea un títere entero a aerógrafo, agazapado en la chapa
 * del canto sin pisarle el camino al Atila, que el ratón quede delante de su cara, que tocado salga de
 * operativo con la sirena y la matraca y salte adonde estaba el ratón, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-gato-maton';
const figura = capasDe('los-techos', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_MATON.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--maton');

test('el gato matón es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--maton" data-id="el-gato-maton" role="button" tabindex="0" aria-label="El gato matón">/);
  for (const p of ['entero', 'salto', 'cola', 'pata-1', 'cuerpo', 'cabeza', 'haz', 'parpado', 'boca', 'lengua', 'luz', 'pata-2', 'paleta', 'ratata']) assert.ok(figura.includes(`data-parte="${p}"`), `al gato le falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_MATON.map((p) => p.nombre).sort());
  const A = MATON_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`maton-pata-${n + 1}`, A.hombros[n]) && adentro('maton-cuerpo', A.hombros[n]), `la pata ${n + 1} no sale del hombro`);
    assert.ok(adentro(`maton-pata-${n + 1}`, A.manos[n]), `la mano ${n + 1} se sale de su pata`);
    assert.ok(adentro('maton-cabeza', A.ojos[n]) && adentro('maton-parpados', A.ojos[n]), `el ojo ${n + 1} no está en la cara`);
  }
  assert.ok(adentro('maton-cabeza', A.cuello) && adentro('maton-cuerpo', A.cuello), 'la cabeza no se apoya en el cuello');
  assert.ok(adentro('maton-cola', A.cola) && adentro('maton-cuerpo', A.cola), 'la cola no sale del lomo');
  assert.ok(adentro('maton-gorra', A.sirena) && adentro('maton-sirena', A.sirena) && adentro('maton-luz', A.sirena) && adentro('maton-haz', A.sirena), 'la sirena no está en la gorra');
  assert.ok(adentro('maton-mango', A.matraca) && adentro('maton-paleta', A.matraca) && adentro('maton-ratata', A.matraca), 'la matraca no gira en el mango');
  assert.ok(Math.hypot(A.matraca[0] - A.manos[1][0], A.matraca[1] - A.manos[1][1]) < 20, 'la matraca no está en la mano');
  assert.ok(adentro('maton-boca', A.boca) && adentro('maton-lengua', A.boca) && adentro('maton-cabeza', A.boca), 'la boca no está en la cara');
  for (const p of PIEZAS_MATON) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['maton-cuerpo', 'maton-cabeza', 'maton-gorra']) assert.match(PIEZAS_MATON.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_MATON.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del gato están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el gato maton⟩'), tokens.indexOf('⟨/el gato maton⟩'));
  const usadas = new Set(PIEZAS_MATON.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-maton-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del gato`);
  assert.match(bloque, /lobo-suelto\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el gato maton⟩ */'), sitio.indexOf('/* ⟨/el gato maton⟩ */'));
  for (const clase of new Set([...figura.matchAll(/class="(bt-maton-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('se agazapa en la chapa, a la izquierda del Atila, con el ratón delante de la cara, y el salto no llega al Atila', () => {
  assert.equal(MATON.piso, CHAPA.piso);
  const [x0] = alRecinto([-110, 0]);
  const [x1] = alRecinto([126, 0]);
  assert.ok(x0 > 0 && x1 < ATILA.desde, 'el gato se mete donde camina el Atila');
  // El salto cae donde está el ratón, y no más allá del Atila.
  const [caeX] = alRecinto([SALTO.largo + 60, 0]);
  assert.ok(caeX < ATILA.desde, `el salto llega a ${caeX.toFixed(0)}`);
  assert.deepEqual(VECINOS_DEL_BALDIO['el-raton']?.slice(0, 2), [...RATON]);
  const [carax] = alRecinto(MATON_ARMADO.cara);
  assert.ok(RATON[0] > carax && RATON[0] < alRecinto([SALTO.largo + 110, 0])[0], 'el ratón no está delante de su cara');
  // Los ojos de los demás no le quedan adentro.
  const [y0] = [alRecinto([0, -140])[1]];
  for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_BALDIO)) {
    if (id === ID || id === 'el-raton') continue;
    assert.ok(!(ox > x0 - 10 && ox < x1 + 10 && oy > y0 - 10 && oy < MATON.piso + 4), `${id} queda adentro del gato`);
  }
  // Va en la figura: delante de la chapa que pisa.
  const escena = escenaBaldio(nombres);
  assert.ok(escena.indexOf('/bestiario/baldio-chapa.webp') < escena.indexOf(`data-marco="${ID}"`), 'la chapa le tapa las patas');
});

test('la lengua llega a la mano de la matraca cuando se lame', () => {
  const [hx, hy] = manoQueLame(LAME);
  const [bx, by] = MATON_ARMADO.boca;
  // La cabeza baja diez grados al lamerse: la distancia a la boca, con un poco de holgura.
  assert.ok(Math.hypot(hx - bx, hy - by) < 34, `la mano queda a ${Math.hypot(hx - bx, hy - by).toFixed(0)} de la boca`);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarMatonCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive esperando al ratón: acecha, barre con la cola, se lame, bosteza y pestañea', () => {
  const hechas: Record<Accion, number> = { acecha: 0, cola: 0, lame: 0, bosteza: 0, operativo: 0 };
  let pestaneos = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarMatonCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = Number(dom.de('parpado', 'opacity'));
      if (p > 0.9 && !cerrado) pestaneos++;
      cerrado = p > 0.9;
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['acecha', 'cola', 'lame', 'bosteza'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.operativo, 0, 'salió de operativo sin que lo toquen');
  assert.ok(pestaneos >= 10, `pestañeó ${pestaneos} veces`);
});

test('tocado sale de operativo: prende la sirena, gira la matraca, salta adonde estaba el ratón, vuelve y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarMatonCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  let sirena = 0;
  let paletas = new Set<string>();
  let lejos = 0;
  for (let i = 1; i <= 60 * DURA.operativo; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    sirena = Math.max(sirena, Number(dom.de('luz', 'opacity')));
    if (t - 1 < OPERATIVO_T.matraca[1]) paletas.add(dom.de('paleta', 'transform'));
    lejos = Math.max(lejos, trasladoDe(dom.de('salto', 'transform'))[0]);
  }
  assert.ok(sirena > 0.9, 'no se prendió la sirena');
  assert.ok(paletas.size > 40, 'la matraca no giró');
  assert.ok(lejos > SALTO.largo * 0.95, `saltó ${lejos.toFixed(0)}`);
  assert.equal(vivo.estado().accion, 'operativo');
  // Al final volvió a su lugar.
  assert.ok(Math.abs(trasladoDe(dom.de('salto', 'transform'))[0]) < 4, 'no volvió a su lugar');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de agazapado al operativo y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarMatonCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('luz', 'opacity'), '1');
  assert.equal(dom.de('ratata', 'opacity'), String(OPERATIVO.ratata));
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('ratata', 'opacity'), String(QUIETO.ratata));
});
