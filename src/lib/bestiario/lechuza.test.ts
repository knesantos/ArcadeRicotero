import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_LECHUZA, LECHUZA_PERSONAJE } from './arte-lechuza.ts';
import { CIRCULA, LECHUZA, LECHUZA_ARMADO, QUIETO, VUELTA, alRecinto, caras, enLaVuelta, lejania, type Punto } from './rig-lechuza.ts';
import { ARBOL, OJOS_DEL_ARBOL, COSAS_DEL_ARBOL } from './rig-entornos.ts';
import { escenaArbol } from './escenas-entornos.ts';
import { DURA, TOQUE_T, armarLechuzaCon, type Accion } from '../../scripts/bestiario/lechuza.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * La lechuza que circula (`D-73`, vigesimotercera vuelta): que sea un títere entero a aerógrafo, parada en una
 * rama que sale de la copa sin taparle los ojos a nadie, que gire la cabeza de más, que tocada dé la vuelta al
 * árbol adentro del recinto y vuelva a su rama, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'la-lechuza-que-circula';
const figura = capasDe('el-arbol', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_LECHUZA.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--lechuza');
const escalaY = (t: string): number => Number(/scale\(1 ([-\d.]+)\)/.exec(t)?.[1] ?? NaN);

test('la lechuza es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--lechuza" data-id="la-lechuza-que-circula" role="button" tabindex="0" aria-label="La lechuza que circula">/);
  for (const p of ['entero', 'vuelo-atras', 'cola', 'boleto', 'vuelo', 'cuerpo', 'abiertas', 'abierta-1', 'abierta-2', 'plegadas', 'ala-1', 'ala-2', 'patas', 'cabeza', 'nuca', 'cara', 'parpado-1', 'parpado-2', 'pito', 'pitido']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `a la lechuza le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_LECHUZA.map((p) => p.nombre).sort());
  const A = LECHUZA_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`lechuza-ala-${n + 1}`, A.hombros[n]) && adentro(`lechuza-abierta-${n + 1}`, A.hombros[n]) && adentro('lechuza-cuerpo', A.hombros[n]), `el ala ${n + 1} no sale del hombro`);
    assert.ok(adentro('lechuza-cara', A.ojos[n]) && adentro(`lechuza-parpado-${n + 1}`, A.ojos[n]), `el ojo ${n + 1} no está en la cara`);
  }
  assert.ok(adentro('lechuza-craneo', A.cuello) && adentro('lechuza-cuerpo', A.cuello), 'la cabeza no se apoya en el cuello');
  assert.ok(adentro('lechuza-craneo', A.cabeza) && adentro('lechuza-cara', A.cabeza) && adentro('lechuza-nuca', A.cabeza), 'la cara no gira en la cabeza');
  assert.ok(adentro('lechuza-cara', A.pico) && adentro('lechuza-pito', A.pico) && adentro('lechuza-pito', A.pito) && adentro('lechuza-pitido', A.pito), 'el pito no está en el pico');
  assert.ok(adentro('lechuza-cola', A.cola) && adentro('lechuza-cuerpo', A.cola), 'la cola no sale del cuerpo');
  assert.ok(adentro('lechuza-boleto', A.boleto) && adentro('lechuza-rama', A.boleto), 'el boleto no está pinchado en la rama');
  assert.ok(adentro('lechuza-patas', [0, 0]) && adentro('lechuza-rama', [0, 0]), 'las garras no agarran la rama');
  for (const p of PIEZAS_LECHUZA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['lechuza-cuerpo', 'lechuza-cara', 'lechuza-abierta-1', 'lechuza-rama']) assert.match(PIEZAS_LECHUZA.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_LECHUZA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de la lechuza están en su bloque de tokens.css, y lo que no se toca en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨la lechuza que circula⟩'), tokens.indexOf('⟨/la lechuza que circula⟩'));
  const usadas = new Set(PIEZAS_LECHUZA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-lechuza-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de la lechuza`);
  assert.match(bloque, /luzbelito/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨la lechuza que circula⟩ */'), sitio.indexOf('/* ⟨/la lechuza que circula⟩ */'));
  assert.match(suyo, /\.titere--lechuza \{ cursor: pointer; \}/);
  for (const p of ['pitido', 'boleto']) assert.ok(suyo.includes(`"${p}"`), `${p} se puede tocar`);
});

test('se para en una rama que sale de la copa, contra el cielo, sin taparle los ojos a nadie', () => {
  // El ancla es el eje del tronco: en el camino la rama se corre con el árbol y sigue saliendo de la copa.
  assert.equal(LECHUZA_PERSONAJE.ancla, ARBOL.tronco.x);
  const [rx, ry] = alRecinto(LECHUZA_ARMADO.rama[0]!);
  assert.ok(Math.hypot(rx - 562, ry - 146) < 84, 'la rama no sale de la copa');
  // Lo que ocupa parada, de la cabeza a la punta de la cola, y la rama hasta la punta seca.
  const [x0, y0] = alRecinto([-48, -186]);
  const [x1, y1] = alRecinto([48, 24]);
  assert.ok(y0 > 0, 'la cabeza se sale del recinto');
  assert.ok(y1 < ARBOL.horizonte, 'baja hasta la llanura');
  const otros = [...Object.entries(OJOS_DEL_ARBOL).filter(([id]) => id !== ID).map(([id, [x, y]]) => [id, x, y] as const), ...Object.entries(COSAS_DEL_ARBOL).map(([id, [x, y]]) => [id, x, y] as const), ...ARBOL.nidos.map(([x, y], i) => [`nido ${i}`, x, y] as const), ['fruto', ARBOL.fruto.x, ARBOL.fruto.y] as const];
  for (const [id, ox, oy] of otros) assert.ok(!(ox > x0 - 12 && ox < x1 + 12 && oy > y0 - 12 && oy < y1 + 12), `${id} queda adentro de la lechuza`);
  // Va en la figura: delante del piso del árbol.
  const escena = escenaArbol(nombres);
  assert.ok(escena.indexOf('/bestiario/arbol-piso.webp') < escena.indexOf(`data-marco="${ID}"`), 'el árbol la tapa');
  // Y ya no está pintada en el piso del árbol: la silueta que daba vueltas por el cielo se sacó.
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8'), /at\('la-lechuza-que-circula'\)/, 'sigue pintada en el piso del árbol');
});

test('la vuelta al árbol queda adentro del recinto, sin bajar al pie del árbol, y vuelve a la rama', () => {
  assert.deepEqual(enLaVuelta(0), VUELTA[0]);
  assert.deepEqual(enLaVuelta(1), VUELTA[VUELTA.length - 1]);
  assert.deepEqual(VUELTA[0], alRecinto(LECHUZA_ARMADO.centro));
  assert.equal(lejania(VUELTA[0]![1]), 1);
  let izquierda = 900;
  let abajo = 0;
  for (let i = 0; i <= 200; i++) {
    const [x, y] = enLaVuelta(i / 200);
    const s = lejania(y) * LECHUZA.escala;
    // La envergadura entera y la cabeza, a la medida de esa altura.
    assert.ok(x - 186 * s > 0 && x + 186 * s < 900, `el ala se sale del recinto en ${x.toFixed(0)}`);
    assert.ok(y - 116 * s > 0, `la cabeza se sale por arriba en ${y.toFixed(0)}`);
    assert.ok(y + 100 * s < ARBOL.tronco.pie - 60, `baja hasta el pie del árbol en ${y.toFixed(0)}`);
    izquierda = Math.min(izquierda, x);
    abajo = Math.max(abajo, y);
  }
  // Da la vuelta de verdad: pasa del otro lado del tronco y por delante.
  assert.ok(izquierda < ARBOL.tronco.x - 200 && abajo > 300, 'no da la vuelta al árbol');
});

test('gira la cabeza de más: a 180 se le ve la nuca, y a 290 la cara se asoma por el otro costado', () => {
  const de = caras(0);
  assert.equal(de.cara, 1);
  assert.equal(de.nuca, 0);
  assert.ok(caras(180).nuca > 0.99 && caras(180).cara === 0);
  const pasada = caras(290);
  assert.ok(pasada.cara > 0.9 && pasada.corre < -20, 'a 290 no se asoma por el otro lado');
  assert.ok(caras(70).corre > 20, 'a 70 la cara no se va de costado');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarLechuzaCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vigila: gira la cabeza, se esponja, entorna un ojo, sigue algo, cabecea y pestañea poco', () => {
  const hechas: Record<Accion, number> = { gira: 0, esponja: 0, entorna: 0, sigue: 0, cabecea: 0, circula: 0 };
  let pestaneos = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarLechuzaCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = Math.min(escalaY(dom.de('parpado-1', 'transform')), escalaY(dom.de('parpado-2', 'transform')));
      if (p > 0.9 && !cerrado) pestaneos++;
      cerrado = p > 0.9;
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['gira', 'esponja', 'entorna', 'sigue', 'cabecea'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.circula, 0, 'circuló sin que la toquen');
  assert.ok(pestaneos >= 10 && pestaneos <= 40, `pestañeó ${pestaneos} veces`);
});

test('tocada circula: gira la cabeza hasta mirarte, pita, da la vuelta al árbol con las alas abiertas, vuelve a la rama y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarLechuzaCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  let nuca = 0;
  let pitido = 0;
  let abiertas = 0;
  let izquierda = 0;
  let pasaPorAbajo = 0;
  for (let i = 1; i < 60 * DURA.circula; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    if (t - 1 < TOQUE_T.mira[1]) nuca = Math.max(nuca, Number(dom.de('nuca', 'opacity')));
    pitido = Math.max(pitido, Number(dom.de('pitido', 'opacity')));
    abiertas = Math.max(abiertas, Number(dom.de('abiertas', 'opacity')));
    const [dx, dy] = trasladoDe(dom.de('vuelo', 'transform'));
    izquierda = Math.min(izquierda, dx);
    pasaPorAbajo = Math.max(pasaPorAbajo, dy);
  }
  assert.ok(nuca > 0.9, 'no giró la cabeza de más');
  assert.ok(pitido > 0.9, 'no sopló el pito');
  assert.ok(abiertas > 0.99, 'no abrió las alas');
  assert.ok(izquierda * LECHUZA.escala < -450, `no llegó al otro lado del árbol (${(izquierda * LECHUZA.escala).toFixed(0)})`);
  assert.ok(pasaPorAbajo * LECHUZA.escala > 200, 'no pasó por delante del tronco');
  assert.equal(vivo.estado().accion, 'circula');
  // Al final volvió a su rama, con las alas plegadas.
  const [fx, fy] = trasladoDe(dom.de('vuelo', 'transform'));
  assert.ok(Math.hypot(fx, fy) < 1, 'no volvió a la rama');
  assert.equal(dom.de('abiertas', 'opacity'), '0');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarla la pasa de la rama a las alas abiertas y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarLechuzaCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('abiertas', 'opacity'), String(CIRCULA.abiertas));
  assert.equal(dom.de('pitido', 'opacity'), String(CIRCULA.pitido));
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('abiertas', 'opacity'), String(QUIETO.abiertas));
});
