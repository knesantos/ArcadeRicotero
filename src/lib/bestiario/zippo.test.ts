import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_ZIPPO, RETRATO } from './arte-zippo.ts';
import { ABRE, PICADA, QUIETO, VERSO, ZIPPO, ZIPPO_ARMADO, alRecinto, type Punto } from './rig-zippo.ts';
import { LUZBELITO, VECINOS_DEL_INFIERNO } from './escenas.ts';
import { DURA, PISO_FICHAS, RADIO_PICADA, armarZippoCon, type Accion } from '../../scripts/bestiario/zippo.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * Zippo (`D-73`, vigésima vuelta): que sea un títere entero a aerógrafo con su avioneta, que vuele en su
 * rincón del infierno sin encimarse con Luzbelito, que la picada sea un rizo cabeza abajo que no toca el
 * damero, que se le caigan las fichas, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; tema?: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'zippo';
const atras = capasDe('el-infierno', 'atras', nombres, 1, ID);
const figura = capasDe('el-infierno', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_ZIPPO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([atras, figura], 'titere--zippo');

test('Zippo es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--zippo" data-id="zippo" role="button" tabindex="0" aria-label="Zippo">/);
  const partes = ['entero', 'vuelo', 'nubarron', 'bufanda', 'borron', 'helice', 'cabeza', 'risa', 'llama', 'tapa', 'azufre', 'brazo'];
  for (const n of [1, 2, 3, 4, 5]) partes.push(`humo-${n}`);
  for (const n of [1, 2]) partes.push(`ficha-${n}`);
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `a Zippo le falta ${p}`);
  assert.ok(atras.includes('data-parte="sombra"'), 'no tiene su mala sombra en el damero');
  const imagenes = new Set([...(atras + figura).matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_ZIPPO.map((p) => p.nombre).sort());
  const A = ZIPPO_ARMADO;
  assert.ok(adentro('zippo-brazo', A.hombro) && adentro('zippo-cuerpo', A.hombro), 'el brazo no sale del hombro');
  assert.ok(adentro('zippo-brazo', A.mano), 'la mano se sale de su brazo');
  assert.ok(adentro('zippo-cabeza', A.cuello) && adentro('zippo-cuerpo', A.cuello), 'la cabeza no se enrosca en el cuello');
  assert.ok(adentro('zippo-cabeza', A.bisagra) && adentro('zippo-tapa', A.bisagra), 'la tapa no cuelga de la bisagra');
  assert.ok(adentro('zippo-llama', A.chimenea) && adentro('zippo-cabeza', A.chimenea), 'la llama no nace en la chimenea');
  assert.ok(adentro('zippo-helice', A.helice) && adentro('zippo-avion', A.helice), 'la hélice no está en la trompa');
  assert.ok(adentro('zippo-risa', A.boca) && adentro('zippo-cabeza', A.boca), 'la risa no está en la cara');
  assert.ok(adentro('zippo-avion', A.asientoVacio) && adentro('zippo-avion', A.escape), 'falta el asiento vacío o el escape');
  assert.ok(ABRE > 90, 'la tapa no se abre del todo');
  for (const p of PIEZAS_ZIPPO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  // Es aerógrafo, como la galleta de *Luzbelito*: soplado y con grano.
  for (const n of ['zippo-avion', 'zippo-cabeza', 'zippo-cuerpo']) assert.match(PIEZAS_ZIPPO.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  assert.match(PIEZAS_ZIPPO.find((p) => p.nombre === 'zippo-llama')!.dibujo, /url\(#soplo-[a-z]+\)/);
  const peso = PIEZAS_ZIPPO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 30 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de Zippo están en su bloque de tokens.css, y sus partes que no se tocan en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨zippo⟩'), tokens.indexOf('⟨/zippo⟩'));
  const usadas = new Set(PIEZAS_ZIPPO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-zippo-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 10);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de Zippo`);
  assert.match(bloque, /luzbelito-cd/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨zippo⟩ */'), sitio.indexOf('/* ⟨/zippo⟩ */'));
  for (const p of ['llama', 'azufre', 'humo-', 'ficha-', 'nubarron', 'sombra']) assert.ok(suyo.includes(`"${p}`), `${p} se puede tocar`);
});

/** Lo que ocupa la avioneta en el recinto con un momento: de la hélice a la cola, de la llama al tren. */
function ocupa(m: typeof QUIETO): readonly [number, number, number, number] {
  const esquinas: Punto[] = [[-132, -206], [168, -206], [-132, 84], [168, 84]];
  const pts = esquinas.map((p) => alRecinto(p, m));
  return [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))];
}

test('vuela en su rincón del infierno: lejos de Luzbelito y de los ojos que quedan, y la picada no toca el damero', () => {
  const [x0, y0, x1, y1] = ocupa(QUIETO);
  assert.ok(x0 > 0 && x1 < 900 && y0 > 0, 'se sale del recinto');
  // La piedra de Luzbelito llega hasta 548.
  assert.ok(x0 > 548, `se le encima a Luzbelito (${x0.toFixed(0)})`);
  assert.ok(LUZBELITO.x < x0);
  for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_INFIERNO)) {
    if (id === ID || id === 'el-diablo-mas-veloz') continue;
    assert.ok(!(ox > x0 && ox < x1 && oy > y0 && oy < y1), `${id} queda adentro de Zippo`);
  }
  // En lo más hondo del rizo va cabeza abajo: lo más bajo es la llama, que no llega al damero.
  const fondo = { dx: 0, dy: RADIO_PICADA * 2, cabecea: 180 };
  const llamaAbajo = alRecinto([ZIPPO_ARMADO.chimenea[0], ZIPPO_ARMADO.chimenea[1] - 60], fondo);
  assert.ok(llamaAbajo[1] < ZIPPO.pisoSombra, `la llama toca el damero (${llamaAbajo[1].toFixed(0)})`);
  assert.ok(ocupa({ ...QUIETO, ...fondo })[0] > 520, 'en la picada se mete en Luzbelito');
  assert.ok(PISO_FICHAS > ZIPPO.pisoSombra - 1 && PISO_FICHAS < 640);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarZippoCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive: vuela, la hélice gira, deja humo, y chista a su sombra, hace clac, tose, hace un rizo y pierde fichas', () => {
  const hechas: Record<Accion, number> = { chista: 0, clac: 0, tose: 0, rizo: 0, ficha: 0, picada: 0 };
  let humo = 0;
  let sombraSeVa = 0;
  let tapaCerrada = false;
  const helices = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarZippoCon(dom.marcos, esc, azar(semilla));
    let antes = trasladoDe(dom.de('vuelo', 'transform'));
    for (let i = 1; i <= 60 * 60; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const ahora = trasladoDe(dom.de('vuelo', 'transform'));
      assert.ok(Math.hypot(ahora[0] - antes[0], ahora[1] - antes[1]) < 12, `a ${t.toFixed(2)} s salta`);
      antes = ahora;
      if (i % 7 === 0) helices.add(dom.de('helice', 'transform'));
      humo = Math.max(humo, Number(dom.de('humo-3', 'opacity')));
      sombraSeVa = Math.max(sombraSeVa, Math.abs(trasladoDe(dom.de('sombra', 'transform'))[0] - ZIPPO.x - (ahora[0] * ZIPPO.escala)));
      if (/rotate\(0 /.test(dom.de('tapa', 'transform'))) tapaCerrada = true;
      if (i % 30 === 0) for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  assert.equal(hechas.picada, 0, 'se tiró en picada sin que lo toquen');
  for (const a of ['chista', 'clac', 'tose', 'rizo', 'ficha'] as const) assert.ok(hechas[a] >= 2, `no ${a} (${hechas[a]})`);
  assert.ok(helices.size > 20, 'la hélice no gira');
  assert.ok(humo > 0.3, 'no deja humo');
  assert.ok(sombraSeVa > 30, 'la sombra no se le va');
  assert.ok(tapaCerrada, 'nunca hace clac');
});

test('tocado, se manda en picada: rizo cabeza abajo, risa de mil dientes, dos fichas al damero; dice su verso; con movimiento reducido cambia de pose', () => {
  const dom = nuevo();
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarZippoCon(dom.marcos, esc, azar(5));
  poner(0.3);
  vivo.mover(0.3, 1 / 60);
  dom.oyentes.get('click')!({});
  assert.equal(dichos.length, 0);
  let hondo = 0;
  let risa = 0;
  let cabezaAbajo = false;
  const caidasAntes = vivo.estado().caidas;
  let fichaEnElPiso = 0;
  for (let i = 1; i <= 60 * 4.3; i++) {
    const t = 0.3 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const vuelo = dom.de('vuelo', 'transform');
    hondo = Math.max(hondo, trasladoDe(vuelo)[1] * ZIPPO.escala);
    const giro = Number(/rotate\(([-\d.]+)\)/.exec(vuelo)![1]);
    if (giro < -150 && giro > -210) cabezaAbajo = true;
    risa = Math.max(risa, Number(dom.de('risa', 'opacity')));
    for (const n of [1, 2]) if (Number(dom.de(`ficha-${n}`, 'opacity')) > 0.5) fichaEnElPiso = Math.max(fichaEnElPiso, trasladoDe(dom.de(`ficha-${n}`, 'transform'))[1]);
  }
  assert.ok(hondo > RADIO_PICADA * 1.8, `no baja en picada (${hondo.toFixed(0)})`);
  assert.ok(cabezaAbajo, 'no pasa cabeza abajo');
  assert.ok(risa > 0.9, 'no se ríe');
  assert.equal(vivo.estado().caidas - caidasAntes, 2, 'no se le caen las dos fichas');
  assert.ok(Math.abs(fichaEnElPiso - PISO_FICHAS) < 1, 'las fichas no llegan al damero');
  assert.equal(vivo.estado().hechas.picada, 1);
  assert.deepEqual(dichos[0], [ID, VERSO[0], VERSO[1]]);
  assert.equal(vivo.reaccionar('otro', 0), false);
  assert.equal(vivo.reaccionar(ID, 9), true);
  assert.ok(DURA.picada > 3);

  const q = nuevo();
  const quieto = escenario(true);
  const vq = armarZippoCon(q.marcos, quieto.esc, azar(3));
  const antes = q.foto();
  q.oyentes.get('click')!({});
  const picada = q.foto();
  assert.notDeepEqual(picada, antes);
  assert.equal(q.de('risa', 'opacity'), String(PICADA.risa));
  vq.mover(5, 0);
  vq.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), picada, 'con movimiento reducido se movió solo');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), antes);
});

test('la ficha: el retrato es la picada en el infierno; la estampa dice qué es del dibujo y qué de la letra', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/infierno-lejos.webp') && svg.includes('/bestiario/zippo-cabeza.webp'));
  const [x0, y0, w, h] = r.caja;
  for (const p of [[-120, 6], [160, -10], [ZIPPO_ARMADO.caja.x, ZIPPO_ARMADO.caja.y - 30]] as const) {
    const [x, y] = alRecinto(p, { dx: 0, dy: 0, cabecea: PICADA.cabecea });
    assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  }
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.equal(b.tema, 'cruz-diablo');
  assert.match(b.estampa, /Luzbelito/);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /letra/);
});

test('la isla de Zippo se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/zippo.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco|trazos/.test(r)), []);
});
