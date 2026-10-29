import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_RATON, RATON_PERSONAJE } from './arte-raton.ts';
import { HONDO, HUELE, QUIETO, RATON, RATON_ARMADO, alRecinto, marcas, type Punto } from './rig-raton.ts';
import { MATON, MATON_ARMADO, alRecinto as alRecintoDelGato } from './rig-maton.ts';
import { ATILA, CHAPA } from './rig.ts';
import { VECINOS_DEL_BALDIO, escenaBaldio } from './escenas.ts';
import { DURA, TOQUE_T, armarRatonCon, type Accion } from '../../scripts/bestiario/raton.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El ratón (`D-73`, vigesimocuarta vuelta): que sea un títere entero a aerógrafo, en la canaleta del canto
 * delante de la cara del gato matón y sin pisarle el camino al Atila, que viva de oler, que tocado huela al
 * gato, se congele, se meta en la canaleta y vuelva a asomar, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-raton';
const figura = capasDe('los-techos', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_RATON.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--raton');

test('el ratón es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--raton" data-id="el-raton" role="button" tabindex="0" aria-label="El ratón">/);
  for (const p of ['entero', 'olor', 'queso', 'huida', 'pose', 'cola', 'brazo-1', 'cuerpo', 'erizo', 'cabeza', 'parpado', 'espanto', 'oreja', 'hocico', 'dientes', 'bigotes-1', 'bigotes-2', 'brazo-2']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al ratón le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_RATON.map((p) => p.nombre).sort());
  // Ninguna pieza suya se confunde con las del rato molhado, que empiezan parecido.
  for (const p of PIEZAS_RATON) assert.match(p.nombre, /^raton-/);
  const A = RATON_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`raton-brazo-${n + 1}`, A.hombros[n]) && adentro('raton-cuerpo', A.hombros[n]), `el brazo ${n + 1} no sale del hombro`);
    assert.ok(adentro(`raton-brazo-${n + 1}`, A.manos[n]), `la mano ${n + 1} se sale de su brazo`);
  }
  assert.ok(adentro('raton-craneo', A.ojo) && adentro('raton-parpado', A.ojo) && adentro('raton-espanto', A.ojo), 'el ojo no está en la cara');
  assert.ok(adentro('raton-craneo', A.cuello) && adentro('raton-cuerpo', A.cuello), 'la cabeza no se apoya en el cuello');
  assert.ok(adentro('raton-oreja', A.oreja) && adentro('raton-craneo', A.oreja), 'la oreja no sale de la cabeza');
  assert.ok(adentro('raton-hocico', A.hocico) && adentro('raton-craneo', A.hocico) && adentro('raton-hocico', A.nariz), 'el hocico no sale de la cara');
  assert.ok(adentro('raton-bigotes-1', A.bigotes) && adentro('raton-bigotes-2', A.bigotes) && adentro('raton-hocico', A.bigotes), 'los bigotes no salen del hocico');
  assert.ok(adentro('raton-dientes', A.dientes) && adentro('raton-hocico', A.dientes), 'los dientes no están en la boca');
  assert.ok(adentro('raton-cola', A.cola) && adentro('raton-cuerpo', A.cola), 'la cola no sale del lomo');
  assert.ok(adentro('raton-cuerpo', A.talon) && adentro('raton-queso', A.queso), 'el talón o el queso quedan en el aire');
  for (const p of PIEZAS_RATON) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['raton-cuerpo', 'raton-craneo', 'raton-hocico', 'raton-labio']) assert.match(PIEZAS_RATON.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_RATON.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del ratón están en su bloque de tokens.css, medidas en Lobo suelto, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el raton⟩'), tokens.indexOf('⟨/el raton⟩'));
  const usadas = new Set(PIEZAS_RATON.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-raton-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 14);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del ratón`);
  assert.match(bloque, /lobo-suelto-cordero-atado-cd1/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el raton⟩ */'), sitio.indexOf('/* ⟨/el raton⟩ */'));
  assert.match(suyo, /\.titere--raton \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"olor"'), 'el olor se puede tocar');
});

test('está en la canaleta de la chapa, delante de la cara del gato, antes del Atila, con los ojos donde estaban', () => {
  assert.equal(RATON.piso, CHAPA.piso);
  assert.equal(RATON_PERSONAJE.ancla, RATON.x);
  // Los ojos del ratón en lo oscuro eran estos: el títere los deja en el mismo lugar.
  const [ox, oy] = VECINOS_DEL_BALDIO[ID]!;
  const [ex, ey] = alRecinto(RATON_ARMADO.ojo);
  assert.ok(Math.hypot(ex - ox, ey - oy) < 6, `el ojo quedó en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  // De la tapa de la canaleta (del lado del gato) a la punta de la cola: no llega al Atila.
  const [x0] = alRecinto([-112, 0]);
  const [x1] = alRecinto([130, 0]);
  assert.ok(x1 < ATILA.desde, `la canaleta llega a ${x1.toFixed(0)}, donde camina el Atila`);
  // El gato lo tiene encima: su cara queda a la izquierda, y no se pisan.
  const [carax] = alRecintoDelGato(MATON_ARMADO.cara);
  assert.ok(carax < ex, 'el ratón no está delante de la cara del gato');
  assert.ok(x0 > alRecintoDelGato([126, 0])[0], 'la canaleta se mete adentro del gato');
  assert.ok(MATON.piso === RATON.piso, 'no están en la misma chapa');
  // Los ojos de los demás no le quedan adentro.
  const [, y0] = alRecinto([0, -110]);
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_BALDIO)) {
    if (id === ID || id === 'el-gato-maton') continue;
    assert.ok(!(vx > x0 - 10 && vx < x1 + 10 && vy > y0 - 10 && vy < alRecinto([0, 64])[1]), `${id} queda adentro del ratón`);
  }
  // Va en la figura: delante de la chapa que pisa, y después del gato, que tiene encima.
  const escena = escenaBaldio(nombres);
  assert.ok(escena.indexOf('/bestiario/baldio-chapa.webp') < escena.indexOf(`data-marco="${ID}"`), 'la chapa le tapa la canaleta');
  assert.ok(escena.indexOf('data-marco="el-gato-maton"') < escena.indexOf(`data-marco="${ID}"`), 'el gato le queda delante');
});

test('metido en la canaleta no se le ve nada, y asomado se le ve el hocico', () => {
  // El recorte del labio: lo que baja de acá no se dibuja, y el labio tapa lo que queda arriba.
  assert.match(figura, new RegExp(`<clipPath id="raton-canaleta-recorte"><rect x="-200" y="-200" width="400" height="${200 + RATON_ARMADO.labio}"/></clipPath>`));
  const [, , , altoDelLabio] = caja('raton-labio');
  assert.ok(caja('raton-labio')[1] + altoDelLabio >= RATON_ARMADO.labio, 'el labio no tapa hasta el recorte');
  // Lo más alto del ratón agachado (la punta de la oreja) queda por debajo del borde del labio.
  const arriba = Math.min(caja('raton-oreja')[1], caja('raton-craneo')[1], caja('raton-cuerpo')[1]);
  assert.ok(arriba + HONDO > -6, `con ${HONDO} de hondo asoma hasta ${arriba + HONDO}`);
  // El retrato y el títere no comparten el id del recorte.
  assert.ok(!RATON_PERSONAJE.retrato!.cuerpo().includes('id="raton-canaleta-recorte"'));
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarRatonCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.deepEqual(marcas(QUIETO).transform.huida, 'translate(0 0)');
});

test('vive de oler: olfatea, se lava la cara, se para, se esconde, roe, pestañea y los bigotes no paran', () => {
  const hechas: Record<Accion, number> = { olfatea: 0, lava: 0, parado: 0, esconde: 0, roe: 0, huele: 0 };
  let pestaneos = 0;
  const bigotes = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarRatonCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = Number(dom.de('parpado', 'opacity'));
      if (p > 0.9 && !cerrado) pestaneos++;
      cerrado = p > 0.9;
      if (i % 7 === 0) bigotes.add(`${dom.de('bigotes-1', 'transform')}|${dom.de('bigotes-2', 'transform')}`);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['olfatea', 'lava', 'parado', 'esconde', 'roe'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.huele, 0, 'olió al gato sin que lo toquen');
  assert.ok(pestaneos >= 10, `pestañeó ${pestaneos} veces`);
  assert.ok(bigotes.size > 500, 'los bigotes se quedan quietos');
});

test('tocado huele al gato, se congela, se mete en la canaleta, asoma el hocico, sale y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarRatonCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { olor: 0, espanto: 0, erizo: 0, hondo: 0, asoma: Infinity, accion: '' };
  for (let i = 1; i <= 60 * DURA.huele; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    visto.olor = Math.max(visto.olor, Number(dom.de('olor', 'opacity')));
    visto.espanto = Math.max(visto.espanto, Number(dom.de('espanto', 'opacity')));
    visto.erizo = Math.max(visto.erizo, Number(dom.de('erizo', 'opacity')));
    const [, y] = trasladoDe(dom.de('huida', 'transform'));
    if (u > TOQUE_T.escondido[0] && u < TOQUE_T.escondido[1]) visto.hondo = Math.max(visto.hondo, y);
    if (u > TOQUE_T.asoma[0] + 0.5 && u < TOQUE_T.vuelve[0]) visto.asoma = Math.min(visto.asoma, y);
    if (i === 60 * 4) visto.accion = vivo.estado().accion ?? '';
  }
  assert.ok(visto.olor > 0.9, 'no le llegó el olor');
  assert.ok(visto.espanto > 0.9 && visto.erizo > 0.9, 'no se espantó');
  assert.ok(visto.hondo >= HONDO * 0.98, `se metió ${visto.hondo.toFixed(0)}`);
  assert.ok(visto.asoma > 20 && visto.asoma < HONDO - 20, `asomado quedó a ${visto.asoma.toFixed(0)}`);
  assert.equal(visto.accion, 'huele');
  // Al final salió de la canaleta y está en su lugar.
  const [x, y] = trasladoDe(dom.de('huida', 'transform'));
  assert.ok(Math.abs(x) < 2 && Math.abs(y) < 2, `quedó en ${x}, ${y}`);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de las cuatro patas a parado, oliendo, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarRatonCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('pose', 'transform'), marcas(HUELE).transform.pose);
  assert.equal(dom.de('erizo', 'opacity'), '1');
  assert.equal(dom.de('olor', 'opacity'), '1');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('pose', 'transform'), marcas(QUIETO).transform.pose);
});
