import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_ANGUILA, RETRATO } from './arte-anguila.ts';
import { ANGUILA, ANGUILA_ARMADO, CHARCO, LARGO, N, QUIETO, SALTO, SUPERFICIE, TOCADA, alRecinto, columna, grueso, type Momento, type Punto } from './rig-anguila.ts';
import { BAJO } from './rig.ts';
import { VECINOS_DEL_BAJO, escenaBajo } from './escenas.ts';
import { DURA, TOQUE, armarAnguilaCon, momentoDelToque, type Accion } from '../../scripts/bestiario/anguila.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * La anguila (`D-73`, vigesimotercera vuelta): que sea un títere entero a aerógrafo, medio hundida en el barro
 * del rincón del bajo sin taparle nada a nadie, que el cuerpo sea una cadena que ondula de verdad y no se
 * descose, que tocada salte en arco y el barro se la vuelva a tragar, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'la-anguila';
const figura = capasDe('el-bajo', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_ANGUILA.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--anguila');

test('la anguila es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--anguila" data-id="la-anguila" role="button" tabindex="0" aria-label="La anguila">/);
  const partes = ['entero', 'brasa', 'cabeza', 'quijada', 'agalla', 'aleta', 'pupila', 'pegote', 'globo', 'plop', 'salpica-1', 'salpica-2', ...Array.from({ length: N }, (_, i) => `seg-${i + 1}`), ...[1, 2, 3].flatMap((i) => [`burbuja-${i}`, `revienta-${i}`]), ...[1, 2, 3, 4, 5].map((i) => `gota-${i}`)];
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `a la anguila le falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_ANGUILA.map((p) => p.nombre).sort());
  const A = ANGUILA_ARMADO;
  // Cada segmento gira en su coyuntura, que está en su imagen, y su punta llega a la coyuntura del siguiente.
  for (let i = 0; i < N; i++) {
    assert.ok(adentro(`anguila-seg-${i + 1}`, [0, 0]) && adentro(`anguila-seg-${i + 1}`, [LARGO, 0]), `el segmento ${i + 1} no tiene sus dos coyunturas`);
    assert.ok(grueso(i) / 2 <= caja(`anguila-seg-${i + 1}`)[3] / 2, `el segmento ${i + 1} se sale de su caja`);
  }
  assert.ok(adentro('anguila-cabeza', [0, 0]), 'la cabeza no se apoya en la nuca');
  assert.ok(adentro('anguila-cabeza', A.ojo) && adentro('anguila-pupila', A.ojo), 'el ojo no está en la cara');
  assert.ok(adentro('anguila-quijada', A.bisagra) && adentro('anguila-cabeza', A.bisagra) && adentro('anguila-boca', A.boca), 'la quijada no cuelga de su bisagra');
  assert.ok(adentro('anguila-agalla', A.agalla) && adentro('anguila-aleta', A.aleta) && adentro('anguila-pegote', A.pegote), 'la agalla, la aleta o el pegote están fuera de su lugar');
  for (const p of PIEZAS_ANGUILA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['anguila-cabeza', 'anguila-seg-1', 'anguila-charco']) assert.match(PIEZAS_ANGUILA.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_ANGUILA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de la anguila están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨la anguila⟩'), tokens.indexOf('⟨/la anguila⟩'));
  const usadas = new Set(PIEZAS_ANGUILA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-anguila-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de la anguila`);
  assert.match(bloque, /luzbelito\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨la anguila⟩ */'), sitio.indexOf('/* ⟨/la anguila⟩ */'));
  assert.ok(suyo.includes('.titere--anguila { cursor: pointer; }'));
  assert.match(suyo, /\[data-parte="brasa"\] \{ mix-blend-mode: screen; pointer-events: none; \}/);
});

test('está en el barro del rincón de adelante, adentro del bajo y en el agua, sin taparle los ojos a nadie', () => {
  const [x0, y0] = alRecinto([CHARCO.x - CHARCO.rx, -120]);
  const [x1, y1] = alRecinto([CHARCO.x + CHARCO.rx, CHARCO.y + CHARCO.ry]);
  assert.ok(x0 > 880 && x1 <= 1200 && y1 < 640, `el charco va de ${x0.toFixed(0)} a ${x1.toFixed(0)}`);
  assert.ok(ANGUILA.piso > BAJO.fondo, 'el charco no está en el agua');
  // Donde vuelve a entrar del salto sigue siendo barro.
  const entra = ANGUILA_ARMADO.cuello[0] + SALTO.desde - SALTO.largo;
  assert.ok(entra > CHARCO.x - CHARCO.rx, 'el salto cae afuera del charco');
  for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_BAJO)) {
    if (id === ID) continue;
    assert.ok(!(ox > x0 - 8 && ox < x1 + 8 && oy > y0 - 8 && oy < y1 + 8), `${id} queda adentro de la anguila`);
  }
  // Va en la figura: delante del agua de adelante, y lo que flota adelante la tapa.
  const escena = escenaBajo(nombres);
  assert.ok(escena.indexOf(`data-marco="${ID}"`) > escena.indexOf('clip-path="url(#bajo-adelante)"') && escena.indexOf(`data-marco="${ID}"`) < escena.indexOf('/bestiario/bajo-frente.webp'));
  const [rx, ry, rw, rh] = RETRATO.caja;
  assert.ok(rw > 50 && rh > 50 && rx > 800 && ry + rh <= 640, 'el retrato no la encuadra');
});

test('el cuerpo es una cadena que ondula: no se descose, la onda viaja de la cabeza a la cola, y el barro corta lo hundido', () => {
  const crestas: number[] = [];
  for (const onda of [0, 0.5, 1, 1.5]) {
    const m: Momento = { ...QUIETO, onda, amp: 24 };
    const { coyunturas } = columna(m);
    for (let i = 0; i < N; i++) {
      const [ax, ay] = coyunturas[i]!;
      const [bx, by] = coyunturas[i + 1]!;
      assert.ok(Math.abs(Math.hypot(bx - ax, by - ay) - LARGO) < 1e-6, `el segmento ${i + 1} cambió de largo`);
    }
    // La cresta: la coyuntura más alta del medio del cuerpo.
    const medio = coyunturas.slice(2, N - 1).map(([, y], i) => [y, i] as const);
    crestas.push(medio.reduce((a, b) => (b[0] < a[0] ? b : a))[1]);
  }
  assert.ok(crestas[crestas.length - 1]! > crestas[0]!, `la cresta no viajó para la cola: ${crestas.join(', ')}`);
  // Quieta, una parte asoma y otra está debajo de la superficie.
  const { coyunturas } = columna({ ...QUIETO, onda: 1 });
  assert.ok(coyunturas.some(([, y], i) => y - grueso(i) / 2 < SUPERFICIE) && coyunturas.some(([, y], i) => y - grueso(i) / 2 > SUPERFICIE), 'no está medio hundida');
  assert.match(figura, new RegExp(`<clipPath id="anguila-barro"><rect x="-600" y="-400" width="1200" height="${400 + SUPERFICIE}"/></clipPath>`));
  // En el salto, el cuerpo entero sale en arco: la nuca y el medio por arriba del barro.
  const arco = columna(TOCADA).coyunturas;
  assert.ok(arco[0]![1] < -30 && arco.slice(0, 5).every(([, y]) => y < SUPERFICIE), 'el salto no sale del barro');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarAnguilaCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive ahogándose: boquea, se retuerce, se hunde, se le pega el barro, nunca dos veces lo mismo seguido, y el barro burbujea', () => {
  const hechas: Record<Accion, number> = { boquea: 0, retuerce: 0, hunde: 0, pegote: 0, desespera: 0 };
  let reventones = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarAnguilaCon(dom.marcos, esc, azar(semilla));
    let antes: Accion | null = null;
    let previa: Accion | null = null;
    let reventando = false;
    const segs = new Set<string>();
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const a = vivo.estado().accion;
      if (a && a !== antes) {
        assert.notEqual(a, previa, `hizo ${a} dos veces seguidas`);
        previa = a;
      }
      antes = a;
      const r = Number(dom.de('revienta-2', 'opacity')) > 0;
      if (r && !reventando) reventones++;
      reventando = r;
      if (i % 30 === 0) segs.add(dom.de('seg-6', 'transform'));
    }
    assert.ok(segs.size > 50, 'el cuerpo no ondula');
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['boquea', 'retuerce', 'hunde', 'pegote'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.desespera, 0, 'se desesperó sin que la toquen');
  assert.ok(reventones >= 10, `reventaron ${reventones} burbujas`);
});

test('tocada se desespera: salta en arco chorreando, se le escapa la burbuja grande, el barro se la traga, vuelve y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarAnguilaCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  const quieta = dom.de('cabeza', 'transform');
  dom.oyentes.get('click')!({});
  let gotas = 0;
  let globo = 0;
  let plop = 0;
  let alto = 0;
  for (let i = 1; i < 60 * DURA.desespera - 1; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    gotas = Math.max(gotas, Number(dom.de('gota-3', 'opacity')));
    globo = Math.max(globo, Number(dom.de('globo', 'opacity')));
    plop = Math.max(plop, Number(dom.de('plop', 'opacity')));
    const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(dom.de('seg-4', 'transform'))!;
    alto = Math.min(alto, Number(m[2]));
  }
  assert.ok(alto < -40, `el lomo no salió del barro: llegó a ${alto}`);
  assert.ok(gotas > 0.5, 'no chorreó barro');
  assert.ok(globo === 1 && plop > 0.5, 'no se le escapó la burbuja grande');
  assert.equal(vivo.estado().accion, 'desespera');
  // En la mitad del toque, el barro la tapa entera; al final volvió a su lugar.
  const perdida = momentoDelToque((TOQUE.perdida[0] + TOQUE.perdida[1]) / 2);
  assert.ok(columna(perdida).coyunturas.every(([, y], i) => y - grueso(Math.min(i, N - 1)) / 2 > SUPERFICIE), 'no se perdió en el barro');
  const final = momentoDelToque(DURA.desespera);
  assert.ok(Math.abs(final.alto - QUIETO.alto) < 0.5 && final.salto === 0 && final.globo === 0, 'no volvió a la pose quieta');
  assert.ok(quieta.length > 0);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarla la pasa de quieta al salto y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarAnguilaCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.notDeepEqual(dom.foto(), antes);
  assert.equal(dom.de('salpica-1', 'opacity') !== '0', true);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.deepEqual(dom.foto(), antes);
});
