import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_REO, PUNIOS_EN_EL_RECINTO, REO_PERSONAJE } from './arte-reo.ts';
import { BARROTES, CELDA, HUECO, LICUADO, QUIETO, REO, REO_ARMADO, alRecinto, marcas, type Punto } from './rig-reo.ts';
import { CELDAS_DE_LAS_ALAS } from './arte-prision.ts';
import { VECINOS_DE_LA_PRISION, escenaPrision } from './escenas.ts';
import { CHIVATO } from './rig-chivato.ts';
import { DURA, TOQUE_T, armarReoCon, type Accion } from '../../scripts/bestiario/reo.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El reo semental (`D-73`, vigesimosexta vuelta): que sea un títere entero a aerógrafo en la celda grande del ala
 * de la izquierda de la prisión, detrás de la reja, con los ojos donde estaban, que sude y se aguante, que tocado
 * se licúe entero y se vuelva a armar, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-reo-semental';
const atras = capasDe('la-prision', 'atras', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_REO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([atras], 'titere--reo');

test('el reo es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(atras, /<g class="titere titere--reo" data-id="el-reo-semental" role="button" tabindex="0" aria-label="El reo semental">/);
  for (const p of ['entero', 'charco', 'charco-ojos', 'figura', 'chorrea', 'torso', 'cabeza', 'pupila-1', 'pupila-2', 'parpado-1', 'parpado-2', 'ceja-1', 'ceja-2', 'boca', 'dientes', 'jopo', 'gotas', 'brazo-1', 'brazo-2']) {
    assert.ok(atras.includes(`data-parte="${p}"`), `al reo le falta ${p}`);
  }
  const imagenes = new Set([...atras.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_REO.map((p) => p.nombre).sort());
  for (const p of PIEZAS_REO) assert.match(p.nombre, /^reo-/);
  const A = REO_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`reo-brazo-${n + 1}`, A.hombros[n]) && adentro('reo-torso', A.hombros[n]), `el brazo ${n + 1} no sale del hombro`);
    assert.ok(adentro(`reo-brazo-${n + 1}`, A.punios[n]), `el puño ${n + 1} se sale de su brazo`);
    assert.ok(adentro('reo-cabeza', A.ojos[n].centro) && adentro(`reo-parpado-${n + 1}`, A.ojos[n].centro) && adentro(`reo-pupila-${n + 1}`, A.ojos[n].centro), `el ojo ${n + 1} no está en la cara`);
    assert.ok(adentro(`reo-ceja-${n + 1}`, A.cejas[n]) && adentro('reo-cabeza', A.cejas[n]), `la ceja ${n + 1} no está en la frente`);
  }
  assert.ok(adentro('reo-cabeza', A.cuello) && adentro('reo-torso', A.cuello), 'la cabeza no se apoya en el cogote');
  assert.ok(adentro('reo-jopo', A.jopo) && adentro('reo-cabeza', A.coronilla), 'el jopo no sale de la coronilla');
  assert.ok(adentro('reo-boca', A.boca) && adentro('reo-dientes', A.boca) && adentro('reo-cabeza', A.boca), 'la boca no está en la cara');
  assert.ok(adentro('reo-torso', A.pecho) && adentro('reo-torso', [0, A.ruedo]) && adentro('reo-chorreado', [0, A.ruedo]), 'el pecho o el ruedo quedan en el aire');
  assert.ok(adentro('reo-charco', [0, 0]) && adentro('reo-piernas', [0, -10]), 'el charco o las botas no están en el piso');
  for (const p of PIEZAS_REO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['reo-torso', 'reo-cabeza', 'reo-brazo-1', 'reo-charco']) assert.match(PIEZAS_REO.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_REO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 260, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del reo están en su bloque de tokens.css, medidas en Gulp!, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el reo semental⟩'), tokens.indexOf('⟨/el reo semental⟩'));
  const usadas = new Set(PIEZAS_REO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-reo-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del reo`);
  assert.match(bloque, /gulp-frontal/);
  // La reja de adelante es la de la prisión: el papel de la talla, y nada más.
  const reja = PIEZAS_REO.find((p) => p.nombre === 'reo-reja')!.dibujo;
  assert.deepEqual([...new Set([...reja.matchAll(/var\((--[a-z-]+)\)/g)].map((m) => m[1]))], ['--bestia-dracula-papel']);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el reo semental⟩ */'), sitio.indexOf('/* ⟨/el reo semental⟩ */'));
  assert.match(suyo, /\.titere--reo \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"charco"') && suyo.includes('"gotas"'), 'el charco y el sudor se pueden tocar');
});

test('está en la celda del ala de la izquierda, detrás de su reja, con los ojos donde estaban y los puños entre barrotes', () => {
  // La celda es la que talla `prisionLejos`: los números son los mismos.
  assert.deepEqual({ u0: CELDA.u0, u1: CELDA.u1, alto: CELDA.alto }, CELDAS_DE_LAS_ALAS);
  assert.equal(REO_PERSONAJE.ancla, REO.x);
  const [ox, oy] = VECINOS_DE_LA_PRISION[ID]!;
  const [e1, e2] = REO_ARMADO.ojos.map((o) => alRecinto(o.centro));
  const [ex, ey] = [(e1![0] + e2![0]) / 2, (e1![1] + e2![1]) / 2];
  assert.ok(Math.hypot(ex - ox, ey - oy) < 6, `los ojos quedaron en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  // Adentro del hueco de la celda: la cabeza debajo del dintel, los puños entre dos barrotes.
  const [x0, x1] = [HUECO[0]![0], HUECO[1]![0]];
  const [, arriba] = alRecinto(REO_ARMADO.coronilla);
  assert.ok(arriba > Math.max(HUECO[2]![1], HUECO[3]![1]) + 10, `la coronilla queda en ${arriba.toFixed(0)}, arriba del dintel`);
  for (const [px] of PUNIOS_EN_EL_RECINTO) {
    assert.ok(px > x0 + 10 && px < x1 - 10, `un puño queda fuera de la celda, en ${px.toFixed(0)}`);
    const cerca = Math.min(...BARROTES.map((b) => Math.abs(b.x - px)));
    assert.ok(cerca < 7, `el puño de ${px.toFixed(0)} no agarra ningún barrote`);
  }
  // El chivato pasta delante, en el piso: la celda queda arriba de su lomo.
  assert.ok(CHIVATO.piso > 600, 'el chivato ya no está en el piso de adelante');
  // Va detrás de la reja grande del pasillo (capa atrás), y su reja va delante de él.
  const escena = escenaPrision(nombres);
  const suyo = escena.indexOf(`data-marco="${ID}" data-capa="atras"`);
  assert.ok(suyo > 0 && suyo < escena.indexOf('/bestiario/prision-reja.webp'), 'no está detrás de la reja del pasillo');
  assert.ok(escena.indexOf('/bestiario/reo-reja.webp') > escena.indexOf('data-parte="brazo-2"'), 'su reja no le queda delante');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  // El retrato y el títere no comparten el id del recorte (el recorte es uno solo, en la capa).
  assert.equal((escena.match(/id="reo-hueco"/g) ?? []).length, 1);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarReoCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.equal(marcas(QUIETO).transform.figura, 'translate(0 0)');
});

test('se aguanta: suda, resopla, flexiona el brazo, se ablanda, mira, pestañea, y el sudor no para', () => {
  const hechas: Record<Accion, number> = { suda: 0, resopla: 0, flexiona: 0, ablanda: 0, mira: 0, licua: 0 };
  let pestaneos = 0;
  const gotas = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarReoCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = /scale\(1 ([\d.]+)\)/.exec(dom.de('parpado-1', 'transform'));
      const k = p ? Number(p[1]) : 0;
      if (k > 0.9 && !cerrado) pestaneos++;
      cerrado = k > 0.9;
      if (i % 7 === 0) gotas.add(dom.de('gotas', 'transform'));
      // Sin tocarlo, nunca baja más que un ablande.
      const [, y] = trasladoDe(dom.de('figura', 'transform'));
      assert.ok(y <= REO_ARMADO.hunde * 0.25 + 0.1, `bajó ${y.toFixed(0)} sin que lo toquen`);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['suda', 'resopla', 'flexiona', 'ablanda', 'mira'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.licua, 0, 'se licuó sin que lo toquen');
  assert.ok(pestaneos >= 10, `pestañeó ${pestaneos} veces`);
  assert.ok(gotas.size > 100, 'el sudor no baja');
});

test('tocado se licúa: se estira, baja entero con los puños en la reja, queda hecho un charco con los ojos flotando, se arma de nuevo y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarReoCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { hunde: 0, charco: 0, ojos: 0, chorrea: 0, brazoArriba: Infinity, accion: '' };
  for (let i = 1; i <= 60 * DURA.licua; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const [, y] = trasladoDe(dom.de('figura', 'transform'));
    visto.hunde = Math.max(visto.hunde, y);
    visto.charco = Math.max(visto.charco, Number(dom.de('charco', 'opacity')));
    visto.ojos = Math.max(visto.ojos, Number(dom.de('charco-ojos', 'opacity')));
    visto.chorrea = Math.max(visto.chorrea, Number(dom.de('chorrea', 'opacity')));
    // El brazo sube lo mismo que baja la figura: el puño se queda en el barrote.
    if (u > TOQUE_T.baja[0] && u < TOQUE_T.charco[1]) {
      const [, by] = trasladoDe(dom.de('brazo-1', 'transform'));
      assert.ok(Math.abs(by + y) < 0.02, `el puño se fue con el cuerpo: ${by} contra ${y}`);
    }
    if (i === 60 * 4) visto.accion = vivo.estado().accion ?? '';
  }
  assert.ok(visto.hunde >= REO_ARMADO.hunde * 0.98, `bajó ${visto.hunde.toFixed(0)}`);
  assert.ok(visto.charco > 0.95 && visto.ojos > 0.95, 'no quedó hecho un charco con los ojos');
  assert.ok(visto.chorrea > 0.5, 'las rayas no chorrearon');
  assert.equal(visto.accion, 'licua');
  // Al final volvió a estar entero, parado en su lugar.
  const [x, y] = trasladoDe(dom.de('figura', 'transform'));
  assert.ok(Math.abs(x) < 2 && Math.abs(y) < 2, `quedó en ${x}, ${y}`);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de entero a medio licuado, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarReoCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('figura', 'transform'), marcas(LICUADO).transform.figura);
  assert.equal(dom.de('chorrea', 'opacity'), '1');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('figura', 'transform'), marcas(QUIETO).transform.figura);
});
