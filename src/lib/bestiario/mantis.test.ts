import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { MANTIS_PERSONAJE, PIEZAS_MANTIS, RETRATO, mantisEn } from './arte-mantis.ts';
import { ARMADA, CLUB, FUENTE, MACHO, MACHO_ARMADO, PLATO, PUNTA, QUIETO, SILLAS, SOLA, VERSO, alClub, alRecinto, marcas, type Momento, type Punto } from './rig-mantis.ts';
import { COSAS_DE_LA_MESA, MESA, OJOS_DE_LA_MESA } from './rig-entornos.ts';
import { rapazEn } from './arte-rapaz.ts';
import { escenaMesa } from './escenas-entornos.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS, K_ENTORNO } from './camino.ts';
import { DURA, TOQUE_T, armarMantisCon, momentoDelToque, base, type Accion } from '../../scripts/bestiario/mantis.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * El club de mantis (`D-73`, vigesimoquinta vuelta): que sean tres recortes enteros a aerógrafo sentados a la
 * mesa, con los ojos de la del medio donde estaban sus ojos en lo oscuro, sin bajar del canto más que las pinzas
 * y lo del mantel, sin taparle nada al moscardón ni a la tipa rapaz; que solas no paren nunca y sin bucle, que
 * tocadas se coman al macho y digan su verso, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; verso: string[] }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-club-de-mantis';
const figura = capasDe('la-mesa', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_MANTIS.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--mantis');

/* Lo que ocupa cada imagen en el recinto: se siguen las transformaciones anidadas del marcado, como el navegador. */
type Matriz = readonly [number, number, number, number, number, number];
const por = ([a, b, c, d, e, f]: Matriz, [g, h, i, j, k, l]: Matriz): Matriz => [a * g + c * h, b * g + d * h, a * i + c * j, b * i + d * j, a * k + c * l + e, b * k + d * l + f];
function matrizDe(t: string): Matriz {
  let m: Matriz = [1, 0, 0, 1, 0, 0];
  for (const [, op, args] of t.matchAll(/(translate|scale|rotate)\(([^)]*)\)/g)) {
    const v = args!.trim().split(/[\s,]+/).map(Number);
    if (op === 'translate') m = por(m, [1, 0, 0, 1, v[0]!, v[1] ?? 0]);
    else if (op === 'scale') m = por(m, [v[0]!, 0, 0, v[1] ?? v[0]!, 0, 0]);
    else {
      const a = (v[0]! * Math.PI) / 180;
      const [cx, cy] = [v[1] ?? 0, v[2] ?? 0];
      m = por(por(por(m, [1, 0, 0, 1, cx, cy]), [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]), [1, 0, 0, 1, -cx, -cy]);
    }
  }
  return m;
}
/** Las cajas de cada imagen del marcado, en el recinto, con la parte que la contiene más cercana; las que no se ven quedan afuera. */
function cajasDe(svg: string): Array<{ pieza: string; parte: string; x0: number; y0: number; x1: number; y1: number }> {
  const pila: Array<{ m: Matriz; parte: string; ve: boolean }> = [{ m: [1, 0, 0, 1, 0, 0], parte: '', ve: true }];
  const salida = [];
  for (const [etiqueta] of svg.matchAll(/<g\b[^>]*>|<\/g>|<image\b[^>]*>/g)) {
    const arriba = pila[pila.length - 1]!;
    if (etiqueta.startsWith('</g')) pila.pop();
    else if (etiqueta.startsWith('<g')) {
      const t = /transform="([^"]*)"/.exec(etiqueta)?.[1] ?? '';
      const parte = /data-parte="([^"]*)"/.exec(etiqueta)?.[1] ?? arriba.parte;
      const o = /opacity="([^"]*)"/.exec(etiqueta)?.[1];
      pila.push({ m: por(arriba.m, matrizDe(t)), parte, ve: arriba.ve && (o === undefined || Number(o) > 0) });
    } else if (arriba.ve) {
      const n = (k: string): number => Number(new RegExp(`\\b${k}="([^"]*)"`).exec(etiqueta)![1]);
      const [x, y, w, h] = [n('x'), n('y'), n('width'), n('height')];
      const [a, b, c, d, e, f] = arriba.m;
      const pts = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].map(([px, py]) => [a * px! + c * py! + e, b * px! + d * py! + f] as const);
      salida.push({ pieza: /\/bestiario\/([a-z0-9-]+)\.webp/.exec(etiqueta)![1]!, parte: arriba.parte, x0: Math.min(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), x1: Math.max(...pts.map((p) => p[0])), y1: Math.max(...pts.map((p) => p[1])) });
    }
  }
  return salida;
}
const delMacho = (pieza: string): boolean => pieza.startsWith('mantis-macho') || pieza.startsWith('mantis-patas');
const delMantel = (pieza: string): boolean => ['mantis-brazo', 'mantis-pinza', 'mantis-fuente', 'mantis-flor', 'mantis-antena-suelta'].includes(pieza) || delMacho(pieza);

test('el club es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--mantis" data-id="el-club-de-mantis" role="button" tabindex="0" aria-label="El club de mantis">/);
  const partes = ['entero', 'abanico', 'pata', 'bocado', 'fuente', 'flor', 'antena-suelta', 'macho', 'macho-cuerpo', 'macho-brazo', 'patas-1', 'patas-2'];
  for (const n of [1, 2, 3]) {
    partes.push(`mantis-${n}`, `servilleta-${n}`, `cabeza-${n}`, `pupilas-${n}`, `mandibulas-${n}`);
    for (const l of ['a', 'b']) partes.push(`antena-${n}-${l}`, `brazo-${n}-${l}`, `pinza-${n}-${l}`);
  }
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `al club le falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_MANTIS.map((p) => p.nombre).sort());
  for (const p of PIEZAS_MANTIS) assert.match(p.nombre, /^mantis-/);
  const A = ARMADA;
  for (const n of [1, 2, 3]) {
    for (const o of A.ojos) assert.ok(adentro(`mantis-cabeza-${n}`, o) && adentro('mantis-pupilas', o), `el ojo de la ${n} no está en la cara`);
    assert.ok(adentro(`mantis-cabeza-${n}`, A.cuello) && adentro(`mantis-cuerpo-${n}`, A.cuello), `la cabeza de la ${n} no se apoya en el cogote`);
    assert.ok(adentro(`mantis-cabeza-${n}`, A.boca) && adentro(`mantis-cabeza-${n}`, A.antena), `la boca o las antenas de la ${n} no están en la cara`);
    assert.ok(adentro(`mantis-servilleta-${n}`, A.nudo) && adentro(`mantis-cuerpo-${n}`, A.nudo) && adentro(`mantis-cuerpo-${n}`, A.hombro), `la servilleta de la ${n} no está atada al cogote`);
  }
  assert.ok(adentro('mantis-mandibulas', A.boca) && adentro('mantis-pata', A.boca) && adentro('mantis-antena', A.antena), 'la boca o la antena están en el aire');
  assert.ok(adentro('mantis-brazo', A.hombro) && adentro('mantis-brazo', A.codo) && adentro('mantis-pinza', A.codo) && adentro('mantis-pinza', PUNTA), 'la pata no sale del hombro o la pinza del codo');
  assert.ok(adentro('mantis-abanico', PUNTA), 'el abanico no está en la pinza');
  assert.ok(adentro('mantis-bocado', [0, -71]), 'el bocado no está en el cogote');
  assert.ok(adentro('mantis-fuente', FUENTE) && adentro('mantis-flor', [PLATO[0] + 14, PLATO[1] - 4]), 'la fuente o la flor no están en el mantel');
  const H = MACHO_ARMADO;
  assert.ok(adentro('mantis-macho', H.hombro) && adentro('mantis-macho-brazo', H.hombro) && adentro('mantis-macho-brazo', H.flor), 'el clavel no está en la pata del macho');
  assert.ok(adentro('mantis-macho', H.cadera) && adentro('mantis-macho', H.ojo) && adentro('mantis-patas-1', [0, 0]) && adentro('mantis-patas-2', [0, 0]), 'el macho no está parado');
  // A aerógrafo: lo grande con grano y soplado, y ningún hex.
  for (const p of PIEZAS_MANTIS) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['mantis-cuerpo-1', 'mantis-cuerpo-2', 'mantis-cuerpo-3', 'mantis-cabeza-2', 'mantis-servilleta-3', 'mantis-brazo', 'mantis-macho']) {
    const dibujo = PIEZAS_MANTIS.find((p) => p.nombre === n)!.dibujo;
    assert.match(dibujo, /url\(#grano\)/, `${n} no tiene grano`);
    assert.match(dibujo, /url\(#soplo-[sm]\)/, `${n} no está soplado`);
  }
  // Los recortes llevan nombre propio, para no pisar los de otro títere.
  for (const p of PIEZAS_MANTIS) for (const [, id] of p.dibujo.matchAll(/clipPath id="([^"]+)"/g)) assert.match(id!, /^m-mantis-/, `${p.nombre}: ${id}`);
  const peso = PIEZAS_MANTIS.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del club están en su bloque de tokens.css, medidas en Gulp!, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el club de mantis⟩'), tokens.indexOf('⟨/el club de mantis⟩'));
  const usadas = new Set(PIEZAS_MANTIS.flatMap((p) => [...p.dibujo.matchAll(/var\((--[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12 && usadas.size <= 20, `usa ${usadas.size} tintas`);
  for (const t of usadas) {
    assert.match(t, /^--bestia-mantis-/, `${t} es de otro`);
    assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del club`);
  }
  for (const tapa of ['gulp-frontal.jpg', 'gulp-interior-frontal.jpg', 'gulp-trasera.jpg']) assert.ok(bloque.includes(tapa), `no se midió en ${tapa}`);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el club de mantis⟩ */'), sitio.indexOf('/* ⟨/el club de mantis⟩ */'));
  assert.match(suyo, /\.titere--mantis \{ cursor: pointer; \}/);
  for (const p of ['flor', 'antena-suelta', 'fuente']) assert.ok(suyo.includes(`"${p}"`), `${p} se puede tocar`);
});

test('se sientan a la mesa con los ojos de la del medio donde estaban, y nada baja del canto más que las pinzas y lo del mantel', () => {
  assert.equal(CLUB.x, OJOS_DE_LA_MESA[ID]![0]);
  assert.equal(CLUB.mesa, MESA.tablero.atras);
  assert.equal(MANTIS_PERSONAJE.ancla, CLUB.x);
  // Los ojos de la del medio en lo oscuro eran estos: el títere los deja en el mismo lugar.
  const [ox, oy] = OJOS_DE_LA_MESA[ID]!;
  const [a, b] = ARMADA.ojos.map((o) => alRecinto(alClub(1, o)));
  const [ex, ey] = [(a![0] + b![0]) / 2, (a![1] + b![1]) / 2];
  assert.ok(Math.hypot(ex - ox, ey - oy) < 3, `los ojos quedaron en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  // El plato de la del medio es el que pinta el piso de la mesa.
  assert.deepEqual(alRecinto(PLATO), [ox, MESA.tablero.atras + 12]);
  // Lo de cada mantis, dibujado derecho, no baja del canto.
  for (const n of ['cuerpo-1', 'cuerpo-2', 'cuerpo-3', 'servilleta-1', 'servilleta-2', 'servilleta-3', 'cabeza-1', 'cabeza-2', 'cabeza-3', 'pupilas', 'mandibulas', 'antena', 'pata', 'bocado']) {
    const [, y, , h] = caja(`mantis-${n}`);
    assert.ok(y + h <= 4, `mantis-${n} baja del canto`);
  }
  // Y armadas, en la pose quieta y comiéndose al macho, tampoco: lo que baja es pinza o es del mantel.
  for (const m of [QUIETO, SOLA, momentoDelToque(base(1), TOQUE_T.rodean[1]), momentoDelToque(base(1), TOQUE_T.nac + 0.05), momentoDelToque(base(1), 5)]) {
    for (const c of cajasDe(mantisEn(m))) {
      if (delMantel(c.pieza)) continue;
      assert.ok(c.y1 <= MESA.tablero.atras + 3, `${c.pieza} (${c.parte}) baja hasta ${c.y1.toFixed(0)}`);
    }
  }
  // Lo del mantel queda arriba del tablero, sin colgar del mantel.
  for (const c of cajasDe(mantisEn(QUIETO))) if (delMantel(c.pieza)) assert.ok(c.y1 < MESA.tablero.adelante - 30, `${c.pieza} baja hasta ${c.y1.toFixed(0)}`);
});

test('no le tapan nada al moscardón, ni a la tipa rapaz, ni a las cosas de la mesa', () => {
  const [mx, my, mr] = COSAS_DE_LA_MESA['el-moscardon-imaginario']!;
  const rapaz = cajasDe(rapazEn());
  const quietas = cajasDe(mantisEn(QUIETO));
  // Lo que ocupan, de la punta del abanico al macho que llega: entre el moscardón y la tipa.
  const x0 = Math.min(...quietas.map((c) => c.x0));
  const x1 = Math.max(...quietas.map((c) => c.x1));
  assert.ok(x0 > 515 && x1 < Math.min(...rapaz.map((c) => c.x0)) + 30, `el club va de ${x0.toFixed(0)} a ${x1.toFixed(0)}`);
  const momentos: Momento[] = [QUIETO, SOLA, ...Array.from({ length: 36 }, (_, i) => momentoDelToque(base(1), (i / 36) * DURA.devora))];
  for (const m of momentos) {
    for (const c of cajasDe(mantisEn(m))) {
      assert.ok(!(c.x1 > mx - mr && c.x0 < mx + mr && c.y1 > my - mr && c.y0 < my + mr), `${c.pieza} le tapa al moscardón`);
      for (const r of rapaz) {
        if (r.pieza.startsWith('rapaz-billete') || r.pieza === 'rapaz-garra-abierta') continue;
        assert.ok(!(c.x1 > r.x0 + 4 && c.x0 < r.x1 - 4 && c.y1 > r.y0 + 4 && c.y0 < r.y1 - 4), `${c.pieza} se mete en ${r.pieza} de la tipa`);
      }
    }
  }
  // Los ojos de los demás y las cosas de la mesa (la mosca, el membrillo, las hormigas) no les quedan adentro.
  for (const [id, [ox, oy]] of Object.entries({ ...OJOS_DE_LA_MESA, ...COSAS_DE_LA_MESA })) {
    if (id === ID) continue;
    for (const c of quietas) assert.ok(!(ox > c.x0 && ox < c.x1 && oy > c.y0 && oy < c.y1), `${id} queda adentro de ${c.pieza}`);
  }
});

test('en la escena va en la figura después del piso de la mesa, el piso ya no las pinta, en el camino se corre con la mesa, y tiene su retrato', () => {
  const escena = escenaMesa(nombres);
  const marco = escena.indexOf(`data-marco="${ID}" data-capa="figura"`);
  assert.ok(marco > 0, 'no está en la mesa');
  assert.ok(escena.indexOf('/bestiario/mesa-piso.webp') < marco && marco < escena.indexOf('/bestiario/mesa-frente.webp'), 'la mesa las tapa o ellas tapan lo de adelante');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'siguen siendo ojos en lo oscuro');
  // Las tres mantis negras que pintaba el piso de la mesa se sacaron: queda el plato.
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8'), /at\('el-club-de-mantis'\)/, 'siguen pintadas en el piso de la mesa');
  const piso = pisoDelCamino(CAMINOS['la-mesa']!, nombres);
  const m = new RegExp(`data-marco="${ID}" data-capa="figura" data-dx="(-?\\d+)"`).exec(piso);
  assert.ok(m, 'no está en la mesa del camino');
  assert.equal(Number(m[1]), Math.round(CLUB.x * (K_ENTORNO - 1)));
  assert.ok(!piso.includes(`bestia--ojos" data-id="${ID}"`), 'siguen siendo ojos en el camino');
  // La ficha: el retrato es el club a la mesa con el macho llegando, adentro de su caja; y la isla se lleva números.
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/mesa-piso.webp') && svg.includes('/bestiario/mantis-cabeza-2.webp') && svg.includes('/bestiario/mantis-macho.webp'));
  assert.ok(!svg.includes('data-id='), 'el retrato se puede tocar');
  const [x0, y0, w, h] = r.caja;
  for (const c of cajasDe(mantisEn(QUIETO))) assert.ok(c.x0 >= x0 && c.x1 <= x0 + w && c.y0 >= y0 && c.y1 <= y0 + h, `${c.pieza} se sale del retrato`);
  const verso = datos.bestias.find((b) => b.id === ID)!.verso;
  assert.deepEqual(verso, ['El club de mantis muy nervioso está.', 'Sin descanso van a devorar.']);
  assert.ok(SILLAS.every((s, i) => i === 0 || s.x > SILLAS[i - 1]!.x), 'las sillas no van de izquierda a derecha');
  const fuente = readFileSync('src/scripts/bestiario/mantis.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((x) => /arte|aerografo|titeres|escenas|elenco|trazos/.test(x)), []);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarMantisCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  // El macho ya está llegando, la flor no está en el plato y a la que mastica le asoma la pata.
  const dom = nuevo();
  assert.equal(dom.de('macho', 'opacity'), '1');
  assert.equal(dom.de('flor', 'opacity'), '0');
  assert.equal(dom.de('pata', 'opacity'), '1');
  assert.equal(dom.de('macho', 'transform'), marcas(QUIETO).transform.macho);
});

test('solas no paran: se hamacan, giran la cabeza, se limpian las antenas, abanican, mastican, chasquean, se pasan la fuente y se miran', () => {
  const hechas: Record<Accion, number> = { giran: 0, antenas: 0, abanica: 0, mastica: 0, chasquean: 0, pasan: 0, miran: 0, devora: 0 };
  let tirones = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarMantisCon(dom.marcos, esc, azar(semilla));
    const hamacas = new Set<string>();
    const pupilas = new Set<string>();
    let antes = [0, 0, 0];
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      // El macho espera: no se lo comen si no las tocan.
      assert.equal(dom.de('macho', 'opacity'), '1', 'se comieron al macho sin que las toquen');
      if (i % 5 === 0) {
        hamacas.add(dom.de('mantis-1', 'transform') + dom.de('mantis-2', 'transform') + dom.de('mantis-3', 'transform'));
        pupilas.add(dom.de('pupilas-2', 'transform'));
      }
      // Un tirón de cabeza es un salto de más de cinco grados en un cuadro.
      const ahora = [1, 2, 3].map((n) => Number(/rotate\(([-\d.]+)/.exec(dom.de(`cabeza-${n}`, 'transform'))![1]));
      if (ahora.some((v, k) => Math.abs(v - antes[k]!) > 5)) tirones++;
      antes = ahora;
      if (i % 30 === 0) for (const q of dom.partes) assert.doesNotMatch(`${q.getAttribute('transform')}${q.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${q.dataset.parte} se rompió`);
    }
    assert.ok(hamacas.size > 500, 'no se hamacan');
    assert.ok(pupilas.size > 200, 'las pseudopupilas no se mueven');
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['giran', 'antenas', 'abanica', 'mastica', 'chasquean', 'pasan', 'miran'] as const) assert.ok(hechas[a] > 0, `nunca hicieron ${a}`);
  assert.equal(hechas.devora, 0, 'devoraron sin que las toquen');
  assert.ok(tirones >= 20, `giraron la cabeza de golpe ${tirones} veces`);
});

test('tocadas se quedan quietas, lo siguen con los ojos, lo rodean, se lo comen en un cuadro, se limpian y dicen su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarMantisCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { llega: Infinity, mira: -Infinity, quietas: true, comido: 0, flor: 0, servilleta: 0, vuelto: false, cuadros: 0 };
  let antes = 1;
  for (let i = 1; i <= 60 * DURA.devora; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const [mx] = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(dom.de('macho', 'transform'))!.slice(1).map(Number);
    const ve = Number(dom.de('macho', 'opacity'));
    if (u < TOQUE_T.nac) visto.llega = Math.min(visto.llega, mx!);
    // Mientras llega, la del medio lo mira para la derecha con las pseudopupilas.
    if (u > 0.4 && u < 1) visto.mira = Math.max(visto.mira, Number(/translate\(([-\d.]+)/.exec(dom.de('pupilas-2', 'transform'))![1]));
    // Quietas de golpe: la del medio no se hamaca mientras lo rodean.
    if (u > 0.3 && u < TOQUE_T.rodean[0] && Math.abs(Number(/rotate\(([-\d.]+)\)/.exec(dom.de('mantis-2', 'transform'))![1])) > 0.5) visto.quietas = false;
    // ÑAC: de verse a no verse en un cuadro, y la flor en el plato.
    if (antes === 1 && ve === 0) visto.comido = u;
    if (ve > 0 && ve < 1 && u < TOQUE_T.vuelve[0]) visto.cuadros++;
    antes = ve;
    if (u > TOQUE_T.nac && u < TOQUE_T.vuelve[0]) visto.flor = Math.max(visto.flor, Number(dom.de('flor', 'opacity')));
    visto.servilleta = Math.max(visto.servilleta, Math.abs(Number(/translate\(0 ([-\d.]+)\)/.exec(dom.de('servilleta-2', 'transform'))![1])));
    if (u > TOQUE_T.vuelve[1] - 0.05 && ve === 1) visto.vuelto = true;
  }
  assert.ok(visto.llega < MACHO.plato[0] + 4, `el macho no llegó al plato (${visto.llega.toFixed(0)})`);
  assert.ok(visto.mira > 0.5 * ARMADA.corrida[0], 'no lo siguieron con las pseudopupilas');
  assert.ok(visto.quietas, 'no se quedaron quietas');
  assert.ok(Math.abs(visto.comido - TOQUE_T.nac) < 0.05, `se lo comieron a los ${visto.comido.toFixed(2)}`);
  assert.equal(visto.cuadros, 0, 'el macho se desvaneció en vez de desaparecer');
  assert.equal(visto.flor, 1, 'no quedó la flor en el plato');
  assert.ok(visto.servilleta > 2, 'no se limpiaron con la servilleta');
  assert.ok(visto.vuelto, 'el macho no volvió a llegar');
  // Al final está como al principio: el macho llegando y el plato vacío.
  assert.equal(dom.de('flor', 'opacity'), '0');
  assert.equal(vivo.estado().hechas.devora, 1);
  assert.equal(dichos.length, 1);
  assert.deepEqual(dichos[0], [ID, VERSO[0], VERSO[1]]);
  assert.equal(vivo.reaccionar('otro', 0), false);
  assert.equal(vivo.reaccionar(ID, 20), true);
});

test('con movimiento reducido no se mueven: tocarlas pasa del macho llegando a la flor sola en el plato, y de vuelta', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarMantisCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('macho', 'opacity'), '0');
  assert.equal(dom.de('flor', 'opacity'), '1');
  assert.equal(dom.de('antena-suelta', 'opacity'), '1');
  assert.equal(dichos.length, 1);
  vivo.mover(4, 1 / 60);
  assert.equal(dom.de('flor', 'opacity'), '1', 'se movió solo');
  dom.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(dom.foto(), antes);
  assert.equal(dichos.length, 2);
});
