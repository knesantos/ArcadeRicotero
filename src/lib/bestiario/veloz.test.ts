import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_VELOZ, RETRATO } from './arte-veloz.ts';
import { CAJA, HASTA_LA_CAJA, PATADA, QUIETO, VELOZ, VELOZ_ARMADO, VERSO, alRecinto, bocaCon, manoDeLaFruta, type Punto } from './rig-veloz.ts';
import { LUZBELITO, VECINOS_DEL_INFIERNO } from './escenas.ts';
import { ARRASTRA, DURA, PARPADEO, armarVelozCon, type Accion } from '../../scripts/bestiario/veloz.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El diablo más veloz (`D-73`, vigésima vuelta): que sea un títere entero a aerógrafo, que arrastre los
 * pies por su lado del damero sin meterse en Luzbelito ni en los ojos de Mandinga, que la manzana suba a
 * la boca, que tocado llegue a la caja en un parpadeo y vuelva arrastrándose, y que la pose de la isla sea
 * la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; tema?: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-diablo-mas-veloz';
const figura = capasDe('el-infierno', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_VELOZ.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--veloz');
const dxDe = (dom: ReturnType<typeof nuevo>): number => trasladoDe(dom.de('anda', 'transform'))[0] * VELOZ.escala;

test('el diablo más veloz es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--veloz" data-id="el-diablo-mas-veloz" role="button" tabindex="0" aria-label="El diablo más veloz">/);
  for (const p of ['entero', 'anda', 'torso', 'cabeza', 'quijada', 'lengua', 'cola', 'fuego', 'reloj', 'fruta', 'entera', 'mordida', 'estela', 'chispas', 'pata-1', 'pata-2', 'brazo-1', 'brazo-2', 'caja', 'tapa', 'rayos']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al diablo le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_VELOZ.map((p) => p.nombre).sort());
  const A = VELOZ_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`veloz-pata-${n + 1}`, A.caderas[n]) && adentro('veloz-cuerpo', A.caderas[n]), `la pata ${n + 1} no sale de la cadera`);
    assert.ok(adentro(`veloz-brazo-${n + 1}`, A.hombros[n]) && adentro('veloz-cuerpo', A.hombros[n]), `el brazo ${n + 1} no sale del hombro`);
    assert.ok(adentro(`veloz-brazo-${n + 1}`, A.manos[n]), `la mano ${n + 1} se sale de su brazo`);
  }
  assert.ok(adentro('veloz-manzana', A.manos[0]) && adentro('veloz-mordida', A.manos[0]), 'la manzana no está en la mano');
  assert.ok(adentro('veloz-reloj', A.manos[1]), 'el reloj no cuelga de la mano');
  assert.ok(adentro('veloz-cabeza', A.cuello) && adentro('veloz-cuerpo', A.cuello), 'la cabeza no se apoya en el cuello');
  assert.ok(adentro('veloz-quijada', A.quijada) && adentro('veloz-cabeza', A.quijada), 'la quijada no cuelga de la cara');
  assert.ok(adentro('veloz-lengua', A.boca), 'la lengua no sale de la boca');
  assert.ok(adentro('veloz-fuego', A.bolsillo) && adentro('veloz-cuerpo', A.bolsillo), 'el fuego no está en el bolsillo');
  assert.ok(adentro('veloz-cola', A.cola), 'la cola no sale de atrás');
  assert.ok(adentro('veloz-caja', [0, 0]) && adentro('veloz-tapa', CAJA.bisagra), 'la tapa no está en la caja');
  for (const p of PIEZAS_VELOZ) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['veloz-cuerpo', 'veloz-cabeza', 'veloz-pata-1']) assert.match(PIEZAS_VELOZ.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_VELOZ.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 30 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del diablo más veloz están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el diablo mas veloz⟩'), tokens.indexOf('⟨/el diablo mas veloz⟩'));
  const usadas = new Set(PIEZAS_VELOZ.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-veloz-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 9);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del diablo más veloz`);
  assert.match(bloque, /luzbelito-trasera/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el diablo mas veloz⟩ */'), sitio.indexOf('/* ⟨/el diablo mas veloz⟩ */'));
  for (const clase of new Set([...figura.matchAll(/class="(bt-veloz-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('arrastra los pies por su lado del damero: no se mete en Luzbelito, ni en Zippo, ni en los ojos que quedan, y llega a la caja', () => {
  const ancho = 50 * VELOZ.escala;
  const [x0] = alRecinto([0, 0], -VELOZ.rango);
  const [x1] = alRecinto([0, 0], HASTA_LA_CAJA);
  assert.ok(x0 - ancho > 548 + 20, `se le encima a la piedra de Luzbelito (${(x0 - ancho).toFixed(0)})`);
  assert.ok(LUZBELITO.x < x0);
  const [, yCabeza] = alRecinto([0, -300]);
  for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_INFIERNO)) {
    if (id === ID || id === 'zippo') continue;
    assert.ok(!(ox > x0 - ancho && ox < x1 + ancho && oy > yCabeza && oy < VELOZ.piso + 10), `${id} queda adentro del diablo más veloz`);
  }
  // La caja: la pata de atrás, en la patada, llega a la tapa; y la caja entra en el recinto.
  assert.ok(VELOZ.caja.x + (CAJA.ancho / 2) * VELOZ.escala < 900, 'la caja se sale del recinto');
  assert.ok(x1 < VELOZ.caja.x - (CAJA.ancho / 2) * VELOZ.escala + 4, 'se le mete adentro a la caja');
  assert.ok(VELOZ.caja.x - x1 < 90, 'la patada no llega a la caja');
  // Es el que está más adelante en el damero: pisa más abajo que el diablo que mea.
  assert.ok(VELOZ.piso > 470 && VELOZ.piso < 520);
});

test('la manzana sube a la boca cuando la muerde', () => {
  const [hx, hy] = manoDeLaFruta(30);
  const [bx, by] = bocaCon(10);
  assert.ok(Math.hypot(bx - hx, by - hy) < 140, 'la boca queda demasiado lejos');
  assert.ok(by < hy, 'la boca queda debajo de la mano');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarVelozCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive: arrastra los pies despacito sacando chispas, mira el reloj, muerde la manzana en el aire y saca la lengua de oro', () => {
  const hechas: Record<Accion, number> = { arrastra: 0, reloj: 0, muerde: 0, lengua: 0, patada: 0 };
  let chispas = 0;
  let lengua = 0;
  let mordiscos = 0;
  let lejos = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarVelozCon(dom.marcos, esc, azar(semilla));
    let antes = dxDe(dom);
    for (let i = 1; i <= 60 * 70; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const dx = dxDe(dom);
      // El más veloz: nunca pasa de lo que arrastra.
      assert.ok(Math.abs(dx - antes) <= ARRASTRA / 60 + 0.01, `a ${t.toFixed(2)} s se apura`);
      assert.ok(Math.abs(dx) <= VELOZ.rango + 0.01, `se va de su lado (${dx.toFixed(1)})`);
      lejos = Math.max(lejos, Math.abs(dx));
      antes = dx;
      chispas = Math.max(chispas, Number(dom.de('chispas', 'opacity')));
      lengua = Math.max(lengua, Number(dom.de('lengua', 'opacity')));
      assert.equal(dom.de('rayos', 'opacity'), '0', 'pateó la caja sin que lo toquen');
      if (i % 30 === 0) for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
    mordiscos += vivo.estado().mordiscos;
  }
  assert.equal(hechas.patada, 0);
  for (const a of ['arrastra', 'reloj', 'muerde', 'lengua'] as const) assert.ok(hechas[a] >= 2, `no ${a} (${hechas[a]})`);
  assert.ok(chispas > 0.3, 'las pezuñas no sacan chispas');
  assert.ok(lengua > 0.5, 'no saca la lengua de oro');
  assert.ok(mordiscos >= 2, 'no muerde la manzana');
  assert.ok(lejos > VELOZ.rango * 0.5, 'no camina');
});

test('tocado, llega a la caja en un parpadeo, la patea, salen los truenos, sonríe, y vuelve arrastrándose; con movimiento reducido cambia de pose', () => {
  const dom = nuevo();
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarVelozCon(dom.marcos, esc, azar(5));
  poner(0.3);
  vivo.mover(0.3, 1 / 60);
  dom.oyentes.get('click')!({});
  let llega = Infinity;
  let rayos = 0;
  let tapa = 0;
  let lengua = 0;
  let estela = 0;
  for (let i = 1; i <= 60 * 9; i++) {
    const t = 0.3 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    if (llega === Infinity && Math.abs(dxDe(dom) - HASTA_LA_CAJA) < 1) llega = i / 60;
    rayos = Math.max(rayos, Number(dom.de('rayos', 'opacity')));
    tapa = Math.min(tapa, Number(/rotate\(([-\d.]+)/.exec(dom.de('tapa', 'transform'))![1]));
    lengua = Math.max(lengua, Number(dom.de('lengua', 'opacity')));
    estela = Math.max(estela, Number(dom.de('estela', 'opacity')));
  }
  assert.ok(llega <= PARPADEO + 0.05, `no llega en un parpadeo (${llega.toFixed(2)} s)`);
  assert.ok(estela > 0.8, 'no deja el borrón');
  assert.ok(rayos > 0.7, 'no salen los truenos');
  assert.ok(tapa < -90, 'no vuela la tapa');
  assert.ok(lengua > 0.5, 'no sonríe con la lengua de oro');
  // Ya volvió a su lado, arrastrando los pies.
  assert.ok(Math.abs(vivo.estado().dx) <= VELOZ.rango, 'no vuelve a su lugar');
  assert.equal(vivo.estado().hechas.patada, 1);
  assert.deepEqual(dichos[0], [ID, VERSO[0], VERSO[1]]);
  assert.equal(vivo.reaccionar('otro', 0), false);
  assert.equal(vivo.reaccionar(ID, 20), true);
  assert.ok(DURA.patada > 2);

  const q = nuevo();
  const quieto = escenario(true);
  const vq = armarVelozCon(q.marcos, quieto.esc, azar(3));
  const antes = q.foto();
  q.oyentes.get('click')!({});
  const patada = q.foto();
  assert.notDeepEqual(patada, antes);
  assert.equal(q.de('rayos', 'opacity'), String(PATADA.rayos));
  vq.mover(5, 0);
  vq.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), patada, 'con movimiento reducido se movió solo');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), antes);
  assert.equal(QUIETO.mordida, 0);
});

test('la ficha: el retrato es la patada; la estampa dice qué es del dibujo y qué de la letra', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/infierno-lejos.webp') && svg.includes('/bestiario/veloz-cabeza.webp') && svg.includes('/bestiario/veloz-rayos.webp'));
  const [x0, y0, w, h] = r.caja;
  for (const p of [alRecinto([30, -300], PATADA.dx), alRecinto([-40, 0], PATADA.dx), [VELOZ.caja.x + 20, VELOZ.caja.piso] as Punto]) {
    assert.ok(p[0] > x0 && p[0] < x0 + w && p[1] > y0 && p[1] < y0 + h, `${p[0].toFixed(0)}, ${p[1].toFixed(0)} se sale del retrato`);
  }
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.equal(b.tema, 'fanfarria-del-cabrio');
  assert.match(b.estampa, /Luzbelito/);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /letra/);
});

test('la isla del diablo más veloz se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/veloz.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco|trazos/.test(r)), []);
});
