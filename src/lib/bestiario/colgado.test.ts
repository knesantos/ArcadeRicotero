import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_COLGADO, RETRATO } from './arte-colgado.ts';
import { COLGADO, COLGADO_ARMADO, LEVANTARSE, QUIETO, VERSO, alRecinto, enElSueno, type Punto } from './rig-colgado.ts';
import { ARBOL, OJOS_DEL_ARBOL } from './rig-entornos.ts';
import { DURA, RONDA, armarColgadoCon, type Accion } from '../../scripts/bestiario/colgado.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * El que duerme colgado (`D-73`, vigésima vuelta): que sea un títere entero a aerógrafo, que cuelgue de la
 * rama soldada donde estaba pintada su sombra (y la sombra ya no esté), que los angelitos jueguen adentro
 * del sueño, que tocado se despierte, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; tema?: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-que-duerme-colgado';
const figura = capasDe('el-arbol', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_COLGADO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--colgado');
const giroDe = (t: string): number => Number(/rotate\(([-\d.]+)/.exec(t)?.[1] ?? NaN);

test('el que duerme colgado es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--colgado" data-id="el-que-duerme-colgado" role="button" tabindex="0" aria-label="El que duerme colgado">/);
  for (const p of ['entero', 'hamaca', 'ala-1', 'ala-2', 'carozo', 'gota', 'cabeza', 'gorro', 'dormido', 'ojos', 'boca', 'sueno', 'angelito-1', 'angelito-2', 'tiro-1', 'tiro-2', 'pop']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al colgado le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_COLGADO.map((p) => p.nombre).sort());
  const A = COLGADO_ARMADO;
  assert.ok(adentro('colgado-piernas', A.rodillas) && adentro('colgado-cuerpo', A.rodillas), 'no se engancha de las rodillas');
  for (const n of [0, 1] as const) assert.ok(adentro(`colgado-ala-${n + 1}`, A.hombros[n]) && adentro('colgado-cuerpo', A.hombros[n]), `el ala ${n + 1} no sale del hombro`);
  assert.ok(adentro('colgado-cabeza', A.cuello) && adentro('colgado-cuerpo', A.cuello), 'la cabeza no cuelga del cuello');
  assert.ok(adentro('colgado-gorro', A.coronilla) && adentro('colgado-cabeza', A.coronilla), 'el gorro no cuelga de la coronilla');
  assert.ok(adentro('colgado-cuerpo', A.dedo) && adentro('colgado-carozo', A.carozo), 'el temor no está sentado en el dedo');
  assert.ok(A.carozo[1] < A.dedo[1], 'el temor no está arriba del dedo');
  assert.ok(adentro('colgado-sueno', A.sueno.centro), 'el sueño no está al lado de la cabeza');
  for (const p of PIEZAS_COLGADO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['colgado-cuerpo', 'colgado-cabeza', 'colgado-carozo']) assert.match(PIEZAS_COLGADO.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  // El sueño es tiza: rayas corridas como las de la contratapa.
  assert.match(PIEZAS_COLGADO.find((p) => p.nombre === 'colgado-sueno')!.dibujo, /url\(#xerox-fino\)/);
  const peso = PIEZAS_COLGADO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 30 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del colgado están en su bloque de tokens.css, y lo que no se toca en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el que duerme colgado⟩'), tokens.indexOf('⟨/el que duerme colgado⟩'));
  const usadas = new Set(PIEZAS_COLGADO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-colgado-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del colgado`);
  assert.match(bloque, /cordero-atado/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el que duerme colgado⟩ */'), sitio.indexOf('/* ⟨/el que duerme colgado⟩ */'));
  for (const p of ['sueno', 'pop', 'gota']) assert.ok(suyo.includes(`"${p}"`), `${p} se puede tocar`);
});

test('cuelga de la rama soldada, sin tocar la tierra, sin taparle los ojos a nadie, y su sombra pintada ya no está', () => {
  const { x0, y0, x1, y1 } = ARBOL.soldada;
  assert.ok(COLGADO.x > x0 + 20 && COLGADO.x < x1 - 20, 'no cuelga de la rama soldada');
  const enLaRama = y0 + ((y1 - y0) * (COLGADO.x - x0)) / (x1 - x0);
  assert.ok(Math.abs(COLGADO.rama - enLaRama) < 0.5);
  // Lo más bajo es el pompón del gorro, aun con la hamaca más grande: no llega a la tierra.
  for (const h of [-20, 0, 20]) assert.ok(alRecinto([0, COLGADO_ARMADO.coronilla[1] + 66], h)[1] < ARBOL.tronco.pie - 30, 'llega a la tierra del pie del árbol');
  const [sx0, sy0] = alRecinto([0, -60]);
  const [sx1, sy1] = alRecinto([COLGADO_ARMADO.sueno.centro[0] + COLGADO_ARMADO.sueno.rx, COLGADO_ARMADO.sueno.centro[1] + COLGADO_ARMADO.sueno.ry]);
  for (const [id, [ox, oy]] of Object.entries(OJOS_DEL_ARBOL)) {
    if (id === ID) continue;
    assert.ok(!(ox > alRecinto([-40, 0])[0] && ox < sx1 && oy > sy0 && oy < sy1), `${id} queda adentro del colgado`);
  }
  assert.ok(sx0 > ARBOL.tronco.x + ARBOL.tronco.ancho / 2, 'se mete en el tronco');
  const piso = readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8');
  assert.doesNotMatch(piso, /at\('el-que-duerme-colgado'\)/, 'sigue pintado en el piso del árbol');
});

test('los angelitos vuelan en ronda adentro del sueño, y van y vienen', () => {
  const { centro: [cx, cy], rx, ry } = COLGADO_ARMADO.sueno;
  const miran = new Set<number>();
  for (let i = 0; i < 40; i++) {
    for (const n of [0, 1]) {
      const { punto: [x, y], mira } = enElSueno(i * 0.3, n);
      assert.ok(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 0.5, 'un angelito se sale del sueño');
      miran.add(mira);
    }
  }
  assert.equal(miran.size, 2, 'los angelitos no van y vienen');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarColgadoCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive dormido: se hamaca, sueña fuerte con tiros, ronca, se le cae la gota al temor y se da vuelta', () => {
  const hechas: Record<Accion, number> = { suena: 0, ronca: 0, gota: 0, gira: 0, levantarse: 0 };
  let tiro = 0;
  let boca = 0;
  let gota = 0;
  const hamacas: number[] = [];
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarColgadoCon(dom.marcos, esc, azar(semilla));
    let antes = giroDe(dom.de('hamaca', 'transform'));
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const h = giroDe(dom.de('hamaca', 'transform'));
      assert.ok(Math.abs(h - antes) < 2, `a ${t.toFixed(2)} s salta`);
      antes = h;
      hamacas.push(h);
      tiro = Math.max(tiro, Number(dom.de('tiro-1', 'opacity')));
      boca = Math.max(boca, Number(dom.de('boca', 'opacity')));
      gota = Math.max(gota, Number(dom.de('gota', 'opacity')));
      assert.equal(dom.de('ojos', 'opacity'), '0', 'se despertó sin que lo toquen');
      if (i % 30 === 0) for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
    assert.ok(vivo.estado().ronda > RONDA.tranquila * 40, 'los angelitos no dan la vuelta');
  }
  assert.equal(hechas.levantarse, 0);
  for (const a of ['suena', 'ronca', 'gota', 'gira'] as const) assert.ok(hechas[a] >= 2, `no ${a} (${hechas[a]})`);
  assert.ok(Math.max(...hamacas) - Math.min(...hamacas) > 8, 'no se hamaca');
  assert.equal(tiro, 1, 'los angelitos no tiran');
  assert.ok(boca > 0.5, 'no ronca');
  assert.ok(gota > 0.9, 'no se le cae la gota');
});

test('tocado, es hora de levantarse: abre los ojos, abre el saco, revienta el sueño, el temor salta y vuelve; y se vuelve a dormir', () => {
  const dom = nuevo();
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarColgadoCon(dom.marcos, esc, azar(5));
  poner(0.3);
  vivo.mover(0.3, 1 / 60);
  dom.oyentes.get('click')!({});
  let ojos = 0;
  let alas = 0;
  let pop = 0;
  let salto = 0;
  let sinSueno = false;
  for (let i = 1; i <= 60 * 4.5; i++) {
    const t = 0.3 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    ojos = Math.max(ojos, Number(dom.de('ojos', 'opacity')));
    alas = Math.min(alas, giroDe(dom.de('ala-1', 'transform')));
    pop = Math.max(pop, Number(dom.de('pop', 'opacity')));
    salto = Math.min(salto, Number(/translate\([-\d.]+ ([-\d.]+)\)/.exec(dom.de('carozo', 'transform'))![1]));
    if (Number(dom.de('sueno', 'opacity')) < 0.05) sinSueno = true;
  }
  assert.equal(ojos, 1, 'no abre los ojos');
  assert.ok(alas < -50, 'no abre el saco');
  assert.ok(pop > 0.5, 'no revienta el sueño');
  assert.ok(sinSueno, 'el sueño no se va');
  assert.ok(salto < -40, 'el temor no salta');
  // Ya se durmió de nuevo: ojos cerrados, el temor en el dedo, el sueño de vuelta.
  assert.equal(dom.de('ojos', 'opacity'), '0');
  assert.ok(Number(dom.de('sueno', 'opacity')) > 0.9, 'el sueño no vuelve');
  assert.match(dom.de('carozo', 'transform'), /^translate\(-?0 -?0\)/);
  assert.equal(vivo.estado().hechas.levantarse, 1);
  assert.deepEqual(dichos[0], [ID, VERSO[0], VERSO[1]]);
  assert.equal(vivo.reaccionar('otro', 0), false);
  assert.equal(vivo.reaccionar(ID, 20), true);
  assert.ok(DURA.levantarse > 3.5);

  const q = nuevo();
  const quieto = escenario(true);
  const vq = armarColgadoCon(q.marcos, quieto.esc, azar(3));
  const antes = q.foto();
  q.oyentes.get('click')!({});
  const despierto = q.foto();
  assert.notDeepEqual(despierto, antes);
  assert.equal(q.de('ojos', 'opacity'), '1');
  assert.equal(q.de('sueno', 'opacity'), String(LEVANTARSE.sueno.o));
  vq.mover(5, 0);
  vq.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), despierto, 'con movimiento reducido se movió solo');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), antes);
  assert.equal(QUIETO.ojos, 0);
});

test('la ficha: el retrato es el despertar en el árbol; la estampa dice qué es del dibujo y qué de la letra', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/arbol-piso.webp') && svg.includes('/bestiario/colgado-cabeza.webp'));
  const [x0, y0, w, h] = r.caja;
  for (const p of [[0, -40], [0, COLGADO_ARMADO.coronilla[1] + 60], [-40, 160], [40, 160]] as const) {
    const [x, y] = alRecinto(p, LEVANTARSE.hamaca);
    assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  }
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.equal(b.tema, 'es-hora-de-levantarse-querido');
  assert.match(b.estampa, /Cordero atado/);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /letra/);
});

test('la isla del colgado se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/colgado.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco|trazos/.test(r)), []);
});
