import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_PIBA, RETRATO } from './arte-piba.ts';
import { ESPANTA, FINGE, PIBA, PIBA_ARMADO, QUIETO, VERSO, alRecinto, manoCon, posaEn, type Punto } from './rig-piba.ts';
import { SENORA, alRecinto as senoraAlRecinto } from './rig-desencarnada.ts';
import { COSAS_DE_LA_RUTA, OJOS_DE_LA_RUTA, RUTA } from './rig-entornos.ts';
import { escenaRuta } from './escenas-entornos.ts';
import { DURA, FINGE_T, armarPibaCon, type Accion } from '../../scripts/bestiario/piba.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * La piba con la remera de Greenpeace (`D-73`, vigesimotercera vuelta): que sea un títere entero a aerógrafo,
 * dormida en la banquina de este lado sin pisar a la bella señora ni al taxi volcado, con los fierros pasando
 * por detrás, que viva sola sin bucle, que tocada finja que duerme y diga su verso, y que la pose de la isla
 * sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'la-piba-de-greenpeace';
const figura = capasDe('la-ruta', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_PIBA.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--piba');

test('la piba es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--piba" data-id="la-piba-de-greenpeace" role="button" tabindex="0" aria-label="La piba con la remera de Greenpeace">/);
  const partes = ['entero', 'cuerpo', 'torso', 'pierna', 'pantorrilla', 'brazo', 'antebrazo', 'cabeza', 'ojo-1', 'ojo-2', 'pupila-1', 'pupila-2', 'aprieta', 'cejas', 'boca', 'rubor', 'zeta-1', 'zeta-2', 'zeta-3', 'bicho'];
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `a la piba le falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_PIBA.map((p) => p.nombre).sort());
  const A = PIBA_ARMADO;
  assert.ok(adentro('piba-cabeza', A.cuello) && adentro('piba-torso', A.cuello), 'la cabeza no se apoya en el cuello');
  for (const n of [0, 1] as const) {
    assert.ok(adentro('piba-cabeza', A.ojos[n]) && adentro(`piba-ojo-${n + 1}`, A.ojos[n]) && adentro(`piba-pupila-${n + 1}`, A.ojos[n]), `el ojo ${n + 1} no está en la cara`);
    assert.ok(adentro('piba-aprieta', A.ojos[n]) && adentro('piba-cejas', [A.ojos[n][0], A.ojos[n][1] - 8]), `el ojo ${n + 1} no se aprieta en su lugar`);
  }
  assert.ok(adentro('piba-boca', A.boca) && adentro('piba-cabeza', A.boca), 'la boca no está en la cara');
  assert.ok(adentro('piba-brazo', A.hombro) && adentro('piba-torso', A.hombro), 'el brazo no sale del hombro');
  assert.ok(adentro('piba-brazo', A.codo) && adentro('piba-antebrazo', A.codo), 'el codo se descose');
  assert.ok(adentro('piba-antebrazo', A.mano) && adentro('piba-torso', A.mano), 'la mano no llega a la cadera');
  assert.ok(adentro('piba-muslo', A.muslo) && adentro('piba-torso', A.muslo), 'la pierna no sale de la cadera');
  assert.ok(adentro('piba-muslo', A.rodilla) && adentro('piba-pantorrilla', A.rodilla), 'la rodilla se descose');
  assert.ok(adentro('piba-pantorrilla', A.tobillo), 'el tobillo se sale de la pantorrilla');
  assert.ok(adentro('piba-mano-abajo', A.manoAbajo) && adentro('piba-almohadon', A.manoAbajo), 'la mano de abajo no está en el almohadón');
  // La cabeza acostada cae en el almohadón.
  const [px, py] = posaEn();
  assert.ok(px > caja('piba-almohadon')[0] && px < caja('piba-almohadon')[0] + caja('piba-almohadon')[2] && py > -100 && py < 0, 'la cabeza no está en el almohadón');
  for (const p of PIEZAS_PIBA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['piba-torso', 'piba-cabeza', 'piba-almohadon', 'piba-piernas']) assert.match(PIEZAS_PIBA.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_PIBA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
  // La remera no pinta el logo de la ONG: ni el nombre ni el arco iris, una ballena pintada a mano.
  assert.doesNotMatch(PIEZAS_PIBA.map((p) => p.dibujo).join(''), /greenpeace|<text/i);
});

test('las tintas de la piba están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨la piba de greenpeace⟩'), tokens.indexOf('⟨/la piba de greenpeace⟩'));
  const usadas = new Set(PIEZAS_PIBA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-piba-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de la piba`);
  assert.match(bloque, /momo-sampler/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨la piba de greenpeace⟩ */'), sitio.indexOf('/* ⟨/la piba de greenpeace⟩ */'));
  assert.match(suyo, /\.titere--piba \{ cursor: pointer; \}/);
  for (const clase of new Set([...figura.matchAll(/class="(bt-piba-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('duerme en la banquina de este lado, sin pisar a la bella señora ni al taxi, con los fierros por detrás', () => {
  assert.ok(PIBA.piso > RUTA.asfalto.abajo && PIBA.piso < 640, 'no está en la banquina de este lado');
  const [x0, y0] = alRecinto([-240, -130]);
  const [x1, y1] = alRecinto([170, 6]);
  assert.ok(x0 > 0 && y0 > RUTA.asfalto.abajo - 30 && y1 <= 640, 'se sale de la banquina');
  // La bella señora queda a la derecha, con aire.
  const [sx0] = senoraAlRecinto([-72, 0]);
  assert.ok(x1 + 10 < sx0, `se le mete a la bella señora (${x1.toFixed(0)} contra ${sx0.toFixed(0)})`);
  assert.ok(SENORA.x > PIBA.x);
  for (const [id, [ox, oy]] of Object.entries(OJOS_DE_LA_RUTA)) {
    if (id === ID) continue;
    assert.ok(!(ox > x0 - 12 && ox < x1 + 12 && oy > y0 - 12 && oy < y1 + 12), `${id} queda adentro de la piba`);
  }
  for (const [id, [cx, cy, r]] of Object.entries(COSAS_DE_LA_RUTA)) assert.ok(cx - r > x1 || cx + r < x0 || cy + r < y0, `${id} queda adentro de la piba`);
  // Los fierros van en la capa de antes: pasan por detrás de ella. Y los yuyos de adelante le tapan el borde.
  const escena = escenaRuta(nombres);
  assert.ok(escena.indexOf('class="fierros"') < escena.indexOf(`data-marco="${ID}"`), 'los fierros le pasan por delante');
  assert.ok(escena.indexOf(`data-marco="${ID}"`) < escena.indexOf('/bestiario/ruta-frente.webp'), 'los yuyos no le quedan delante');
  // Su retrato está encuadrado en la ruta.
  assert.ok(retratoDe(ID));
  assert.ok(RETRATO.caja[0] <= x0 + 10 && RETRATO.caja[0] + RETRATO.caja[2] >= x1 - 10, 'el retrato la corta');
  assert.ok(VERSO[1] < y0 && VERSO[1] > 0, 'dice el verso adentro de ella');
});

test('la mano llega arriba del aro para espantar al mosquito', () => {
  const [hx, hy] = manoCon(ESPANTA[0], ESPANTA[1]);
  const [ax, ay] = posaEn();
  assert.ok(Math.hypot(hx - ax, hy - ay) < 16, `la mano queda a ${Math.hypot(hx - ax, hy - ay).toFixed(0)} del aro`);
  assert.ok(hy < ay, 'la mano pega por debajo del mosquito');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarPibaCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive dormida, o haciéndose: mira un fierro, se rasca, espanta al mosquito, se acomoda, corre dormida y respira', () => {
  const hechas: Record<Accion, number> = { fierro: 0, rasca: 0, mosquito: 0, acomoda: 0, suena: 0, finge: 0 };
  let repetidas = 0;
  const respiros = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarPibaCon(dom.marcos, esc, azar(semilla));
    let antes: Accion | null = null;
    let ultima: Accion | null = null;
    for (let i = 1; i <= 60 * 60; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const a = vivo.estado().accion;
      if (a && a !== antes) {
        if (a === ultima) repetidas++;
        ultima = a;
      }
      antes = a;
      if (i % 30 === 0) respiros.add(dom.de('torso', 'transform'));
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['fierro', 'rasca', 'mosquito', 'acomoda', 'suena'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.finge, 0, 'fingió sin que la toquen');
  assert.equal(repetidas, 0, 'repitió lo mismo dos veces seguidas');
  assert.ok(respiros.size > 5, 'no respira');
});

test('tocada finge que duerme: aprieta los ojos, ronca con zzz, espía, la vieron, se vuelve a tirar y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarPibaCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { aprieta: 0, boca: 0, zetas: new Set<string>(), espia: 0, vieron: 0, rubor: 0 };
  for (let i = 1; i <= 60 * DURA.finge; i++) {
    const t = 1 + i / 60;
    const u = t - 1;
    poner(t);
    vivo.mover(t, 1 / 60);
    if (u < FINGE_T.ronca[1]) visto.aprieta = Math.max(visto.aprieta, Number(dom.de('aprieta', 'opacity')));
    if (u < FINGE_T.ronca[1]) visto.boca = Math.max(visto.boca, Number(dom.de('boca', 'opacity')));
    for (const z of ['zeta-1', 'zeta-2', 'zeta-3']) if (Number(dom.de(z, 'opacity')) > 0.5) visto.zetas.add(z);
    if (u > FINGE_T.espia[0] + 0.3 && u < FINGE_T.vieron[0]) visto.espia += dom.de('ojo-2', 'opacity') === '1' && dom.de('ojo-1', 'opacity') === '0' ? 1 : 0;
    if (u > FINGE_T.vieron[0] + 0.2 && u < FINGE_T.vuelve[0]) visto.vieron += dom.de('ojo-1', 'opacity') === '1' && dom.de('ojo-2', 'opacity') === '1' ? 1 : 0;
    visto.rubor = Math.max(visto.rubor, Number(dom.de('rubor', 'opacity')));
  }
  assert.ok(visto.aprieta > 0.9, 'no apretó los ojos');
  assert.equal(visto.boca, 1, 'no roncó');
  assert.equal(visto.zetas.size, 3, 'no salieron los tres zzz');
  assert.ok(visto.espia > 20, 'no espió con un ojo');
  assert.ok(visto.vieron > 20, 'no se dio cuenta de que la vieron');
  assert.ok(visto.rubor > 0.6, 'no se puso colorada');
  assert.equal(vivo.estado().accion, 'finge');
  // Al final volvió a hacerse la dormida: los ojos cerrados y la cabeza en el almohadón.
  assert.equal(dom.de('ojo-1', 'opacity'), '0');
  assert.equal(dom.de('ojo-2', 'opacity'), '0');
  assert.equal(dom.de('rubor', 'opacity'), '0');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarla la pasa de dormida a espiando y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarPibaCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('ojo-2', 'opacity'), FINGE.ojos[1] > 0.04 ? '1' : '0');
  assert.equal(dom.de('ojo-1', 'opacity'), '0');
  assert.notEqual(dom.de('rubor', 'opacity'), '0');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('ojo-2', 'opacity'), QUIETO.ojos[1] > 0.04 ? '1' : '0');
  assert.deepEqual(dom.foto(), antes);
});

test('la piba ya no está pintada en el piso de la ruta: es el títere', () => {
  const piso = readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8');
  assert.doesNotMatch(piso, /la-piba-de-greenpeace/, 'sigue pintada en la banquina');
});
