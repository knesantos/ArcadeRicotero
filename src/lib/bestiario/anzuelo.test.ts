import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_ANZUELO } from './arte-anzuelo.ts';
import { AGUA, ANZUELO_ARMADO, HUNDE, PUNTA, QUIETO, TOCADO, VERSO, alRecinto, type Momento, type Punto } from './rig-anzuelo.ts';
import { ASTILLERO, COSAS_DE_LOS_ASTILLEROS, OJOS_DE_LOS_ASTILLEROS } from './rig-entornos.ts';
import { escenaAstilleros } from './escenas-entornos.ts';
import { DURA, TOQUE_T, armarAnzueloCon, momentoDelToque, type Accion } from '../../scripts/bestiario/anzuelo.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';
import { rot } from './trazos.ts';

/**
 * El que mordió el anzuelo (`D-73`, vigesimotercera vuelta): que sea un títere entero a aerógrafo, colgado de
 * la punta de la caña que pinta el piso sin taparle la cara a nadie de los astilleros, que tocado se zafe, se
 * hunda, salte y vuelva a morder, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-que-mordio-el-anzuelo';
const figura = capasDe('los-astilleros', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_ANZUELO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--anzuelo');

/** Las esquinas del pescado (cuerpo, cola y aletas) en el recinto, para un momento: la misma cuenta que `marcas`. */
function esquinas(m: Momento): Punto[] {
  const [, ly] = ANZUELO_ARMADO.labio;
  const ps: Punto[] = [];
  for (const n of ['anzuelo-cuerpo', 'anzuelo-cola', 'anzuelo-dorsal', 'anzuelo-pectoral']) {
    const [x, y, w, h] = caja(n);
    for (const [cx, cy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]] as const) {
      let q: Punto = [cx * m.vuelta, cy];
      q = rot(q, [0, ly], m.giro);
      q = [q[0] + m.pez[0], q[1] + m.pez[1]];
      q = rot(q, [0, 0], m.vaiven);
      ps.push(alRecinto([q[0], q[1] + m.tiron]));
    }
  }
  return ps;
}

test('el que mordió el anzuelo es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--anzuelo" data-id="el-que-mordio-el-anzuelo" role="button" tabindex="0" aria-label="El que mordió el anzuelo">/);
  for (const p of ['entero', 'colgado', 'pez', 'dorsal', 'cola', 'pectoral', 'pupila', 'ensueno', 'parpado', 'rubor', 'boca', 'estrella', 'brillo', 'salpica', 'ondas', 'gota-1', 'gota-2', 'gota-3']) assert.ok(figura.includes(`data-parte="${p}"`), `le falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_ANZUELO.map((p) => p.nombre).sort());
  const A = ANZUELO_ARMADO;
  assert.ok(adentro('anzuelo-cuerpo', A.labio) && adentro('anzuelo-anzuelo', A.labio), 'no está clavado del labio');
  assert.ok(adentro('anzuelo-anzuelo', A.ojal), 'el anzuelo no se ata a la línea');
  assert.ok(adentro('anzuelo-estrella', A.estrella) && adentro('anzuelo-brillo', A.estrella), 'la estrella no está en la línea');
  for (const n of ['anzuelo-pupila', 'anzuelo-parpado', 'anzuelo-ensueno', 'anzuelo-cuerpo']) assert.ok(adentro(n, A.ojo), `el ojo no está en ${n}`);
  assert.ok(adentro('anzuelo-boca', A.boca) && adentro('anzuelo-cuerpo', A.boca), 'la boca no está en la cara');
  assert.ok(adentro('anzuelo-dorsal', A.dorsal) && adentro('anzuelo-cuerpo', A.dorsal), 'la aleta del lomo no sale del lomo');
  assert.ok(adentro('anzuelo-pectoral', A.pectoral) && adentro('anzuelo-cuerpo', A.pectoral), 'la aleta del pecho no sale del pecho');
  assert.ok(adentro('anzuelo-cola', A.cola) && adentro('anzuelo-cuerpo', A.cola), 'la cola no sale del cuerpo');
  assert.ok(adentro('anzuelo-cola', A.punta), 'la cola no llega a la punta');
  for (const p of PIEZAS_ANZUELO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['anzuelo-cuerpo', 'anzuelo-cola', 'anzuelo-anzuelo']) assert.match(PIEZAS_ANZUELO.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_ANZUELO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del pescado están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el que mordio el anzuelo⟩'), tokens.indexOf('⟨/el que mordio el anzuelo⟩'));
  const usadas = new Set(PIEZAS_ANZUELO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-anzuelo-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del pescado`);
  assert.match(bloque, /bang-bang-estas-liquidado\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el que mordio el anzuelo⟩ */'), sitio.indexOf('/* ⟨/el que mordio el anzuelo⟩ */'));
  for (const clase of new Set([...figura.matchAll(/class="(bt-anzuelo-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
  // Las clases de la línea y del toque usan tintas del bloque.
  for (const t of suyo.matchAll(/var\((--bestia-anzuelo-[a-z-]+)\)/g)) assert.ok(bloque.includes(`${t[1]}:`), `${t[1]} no está en tokens.css`);
});

test('cuelga de la punta de la caña, sobre el agua y entre el ferry y el lanchón, sin taparle la cara a nadie', () => {
  assert.deepEqual([...PUNTA], [...ASTILLERO.cania.punta]);
  const otros: Array<[string, Punto]> = [
    ...Object.entries(OJOS_DE_LOS_ASTILLEROS).map(([id, [x, y]]) => [id, [x, y] as Punto] as [string, Punto]),
    ...Object.entries(COSAS_DE_LOS_ASTILLEROS).filter(([id]) => id !== ID).map(([id, [x, y]]) => [id, [x, y] as Punto] as [string, Punto]),
  ];
  // Quieto, entero arriba del canto del muelle: nada se hunde sin que lo toquen.
  for (const [, y] of esquinas(QUIETO)) assert.ok(y <= ASTILLERO.muelle + 2, 'quieto, ya se está hundiendo');
  const momentos = [QUIETO, TOCADO, ...Array.from({ length: 75 }, (_, i) => momentoDelToque((i / 75) * DURA.toque))];
  for (const m of momentos) {
    const ps = esquinas(m).filter(([, y]) => y < ASTILLERO.muelle + 2);
    if (!ps.length) continue;
    const xs = ps.map((q) => q[0]);
    const ys = ps.map((q) => q[1]);
    const [a, b, c, d] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    assert.ok(a > 700 && b < ASTILLERO.lanchon.x0 + 28 && c > PUNTA[1], `se sale de entre el ferry y el lanchón: ${[a, b, c, d].map((v) => v.toFixed(0))}`);
    for (const [id, [ox, oy]] of otros) assert.ok(!(ox > a - 6 && ox < b + 6 && oy > c - 6 && oy < d + 6), `le tapa la cara a ${id}`);
  }
  // El verso arriba de la punta de la caña, y el títere en la figura, delante del piso que pinta la caña.
  assert.ok(VERSO[1] < PUNTA[1] && Math.abs(VERSO[0] - PUNTA[0]) < 50);
  const escena = escenaAstilleros(nombres);
  assert.ok(escena.indexOf('/bestiario/astillero-piso.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso le tapa la línea');
});

test('cuando se zafa se hunde entero detrás del canto, y cuando muerde vuelve a quedar clavado del labio', () => {
  const hondo = momentoDelToque(TOQUE_T.cae[1] + 0.5);
  const [, ly] = ANZUELO_ARMADO.labio;
  assert.ok(hondo.pez[1] === HUNDE && ly - 1 + hondo.pez[1] > AGUA + 2, 'la nariz queda afuera del agua');
  const mordido = momentoDelToque(TOQUE_T.muerde[1] + 0.2);
  assert.deepEqual([...mordido.pez], [0, 0]);
  assert.ok(mordido.rubor > 0.9 && mordido.ensueno > 0.6, 'muerde sin cara de iluso');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarAnzueloCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive colgado: se hamaca, da la vuelta, mira la estrella, boquea, se sacude y pestañea, sin repetirse', () => {
  const hechas: Record<Accion, number> = { hamaca: 0, vuelta: 0, mira: 0, boquea: 0, sacude: 0, toque: 0 };
  let pestaneos = 0;
  let gotas = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarAnzueloCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    let antes: Accion | null = null;
    let ultima: Accion | null = null;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = Number(dom.de('parpado', 'opacity'));
      if (p > 0.9 && !cerrado) pestaneos++;
      cerrado = p > 0.9;
      gotas.add(dom.de('gota-1', 'transform'));
      const a = vivo.estado().accion;
      if (a && a !== antes) {
        assert.notEqual(a, ultima, `repitió ${a}`);
        ultima = a;
      }
      antes = a;
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['hamaca', 'vuelta', 'mira', 'boquea', 'sacude'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque, 0, 'se zafó sin que lo toquen');
  assert.ok(pestaneos >= 10, `pestañeó ${pestaneos} veces`);
  assert.ok(gotas.size > 100, 'no le chorrea el agua');
});

test('tocado: tirón, se zafa, chapuzón, la estrella brilla sola, salta, muerde, da la vuelta, vuelve y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarAnzueloCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  let hondo = 0;
  let salpica = 0;
  let brillo = 0;
  let delOtroLado = false;
  let dijoAntesDeMorder = false;
  for (let i = 1; i < 60 * DURA.toque - 1; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    hondo = Math.max(hondo, trasladoDe(dom.de('pez', 'transform'))[1]);
    salpica = Math.max(salpica, Number(dom.de('salpica', 'opacity')));
    if (t - 1 > 1.6 && t - 1 < 3.4) brillo = Math.max(brillo, Number(dom.de('brillo', 'opacity')));
    const escala = /scale\(([-\d.]+) 1\)/.exec(dom.de('pez', 'transform'));
    if (escala && Number(escala[1]) < -0.9) delOtroLado = true;
    if (t - 1 < TOQUE_T.muerde[0] && dichos.length) dijoAntesDeMorder = true;
  }
  assert.ok(hondo >= HUNDE - 0.5, `se hundió ${hondo.toFixed(0)}`);
  assert.ok(salpica > 0.9, 'no hubo chapuzón');
  assert.ok(brillo > 0.7, 'la estrella no brilló sola');
  assert.ok(delOtroLado, 'no dio la vuelta');
  assert.equal(vivo.estado().accion, 'toque');
  // Al final volvió a quedar colgado, como estaba.
  const [dx, dy] = trasladoDe(dom.de('pez', 'transform'));
  assert.ok(Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5, 'no volvió a colgar del labio');
  assert.ok(!dijoAntesDeMorder, 'dijo el verso antes de volver a morder');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
  // Tocarlo de nuevo en el medio no lo arranca otra vez.
  assert.equal(vivo.reaccionar(ID, 9), true);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de colgado a recién mordido y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarAnzueloCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('rubor', 'opacity'), String(TOCADO.rubor));
  assert.equal(dom.de('brillo', 'opacity'), String(TOCADO.brillo));
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('rubor', 'opacity'), String(QUIETO.rubor));
  assert.deepEqual(dom.foto(), antes);
});

test('el pescado ya no está pintado en el piso de los astilleros: de la caña cuelga el títere', () => {
  const piso = readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8');
  assert.doesNotMatch(piso, /t-pez|pescado\./, 'sigue pintado colgando de la caña');
});
