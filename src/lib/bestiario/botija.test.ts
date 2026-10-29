import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { K_ENTORNO } from './camino.ts';
import { PIEZAS_BOTIJA, BOTIJA_PERSONAJE } from './arte-botija.ts';
import { BORDA, BORDA_RECINTO, BOTIJA, BOTIJA_ARMADO, CORRIDA, QUIETO, ZAFO, alRecinto, enLaPlanchada, marcas, pierna, type Punto } from './rig-botija.ts';
import { ASTILLERO, COSAS_DE_LOS_ASTILLEROS, OJOS_DE_LOS_ASTILLEROS } from './rig-entornos.ts';
import { escenaAstilleros } from './escenas-entornos.ts';
import { DURA, TOQUE_T, armarBotijaCon, momentoDelToque, type Accion } from '../../scripts/bestiario/botija.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';
import { LUGAR as HIJA } from './rig-hija.ts';

/**
 * El botija rapado (`D-73`, vigesimocuarta vuelta): que sea un títere entero a aerógrafo, parado en la
 * planchada sin pisar a los vecinos, que haga sus cosas solo, que tocado corra planchada arriba, caiga en la
 * borda del ferry y vuelva a su lugar, que en el camino la corrida se estire con la tabla, y que la pose de
 * la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-botija-rapado';
const figura = capasDe('los-astilleros', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_BOTIJA.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = (capa = figura) => domDeJuguete([capa], 'titere--botija');
const escalaY = (t: string): number => Number(/scale\(1 ([-\d.]+)\)/.exec(t)?.[1] ?? NaN);

test('el botija es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--botija" data-id="el-botija-rapado" role="button" tabindex="0" aria-label="El botija rapado">/);
  for (const p of ['entero', 'viaje', 'torso-atras', 'hombro-1', 'codo-1', 'muslo-1', 'canilla-1', 'zapatilla-1', 'muslo-2', 'canilla-2', 'zapatilla-2', 'torso', 'bolso', 'cabeza', 'cara', 'pupila', 'parpado', 'ceja', 'boca', 'boleto', 'gotas', 'hombro-2', 'codo-2']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al botija le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_BOTIJA.map((p) => p.nombre).sort());
  const A = BOTIJA_ARMADO;
  for (const n of [0, 1] as const) {
    const [ix, iy] = A.ingles[n];
    assert.ok(adentro(`botija-muslo-${n + 1}`, A.ingles[n]) && adentro('botija-torso', A.ingles[n]), `la pierna ${n + 1} no sale de la cadera`);
    assert.ok(adentro(`botija-muslo-${n + 1}`, [ix, iy + A.muslo]) && adentro(`botija-canilla-${n + 1}`, [ix, iy + A.muslo]), `la rodilla ${n + 1} no une el muslo con la canilla`);
    assert.ok(adentro(`botija-canilla-${n + 1}`, [ix, iy + A.muslo + A.canilla]) && adentro(`botija-zapatilla-${n + 1}`, [ix, iy + A.muslo + A.canilla]), `el tobillo ${n + 1} no une la canilla con la zapatilla`);
    const [sx, sy] = A.hombros[n];
    assert.ok(adentro(`botija-brazo-${n + 1}`, A.hombros[n]) && adentro('botija-torso', A.hombros[n]), `el brazo ${n + 1} no sale del hombro`);
    assert.ok(adentro(`botija-brazo-${n + 1}`, [sx, sy + A.brazo]) && adentro(`botija-antebrazo-${n + 1}`, [sx, sy + A.brazo]), `el codo ${n + 1} no une los dos tramos`);
  }
  assert.ok(adentro('botija-cabeza', A.cuello) && adentro('botija-torso', A.cuello), 'la cabeza no se apoya en el cogote');
  assert.ok(adentro('botija-cabeza', A.ojo) && adentro('botija-pupila', A.ojo) && adentro('botija-parpado', A.ojo), 'el ojo no está en la cara');
  assert.ok(adentro('botija-cabeza', A.boca) && adentro('botija-boca', A.boca) && adentro('botija-boleto', A.boca), 'el boleto no está en los dientes');
  assert.ok(adentro('botija-bolso', A.bolso) && adentro('botija-torso', A.bolso), 'el bolso no cuelga de la correa');
  for (const p of PIEZAS_BOTIJA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['botija-torso', 'botija-cabeza', 'botija-bolso', 'botija-boleto']) assert.match(PIEZAS_BOTIJA.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_BOTIJA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 15 && peso <= 160, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del botija están en su bloque de tokens.css, y lo que no se toca en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el botija rapado⟩'), tokens.indexOf('⟨/el botija rapado⟩'));
  const usadas = new Set(PIEZAS_BOTIJA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-botija-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del botija`);
  assert.match(bloque, /lobo-suelto-cordero-atado-cd2/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el botija rapado⟩ */'), sitio.indexOf('/* ⟨/el botija rapado⟩ */'));
  assert.match(suyo, /\.titere--botija \{ cursor: pointer; \}/);
  assert.match(suyo, /\.bt-botija-toque \{ fill: transparent; \}/);
  assert.ok(suyo.includes('"gotas"'), 'las gotas se pueden tocar');
});

test('está parado en la planchada, sin pisarle el lugar a nadie, y el ancla lo deja en la tabla con cualquier k', () => {
  // Los pies, en el medio de la tabla, a la altura del ojo que tenía.
  const [px, py] = enLaPlanchada(0.3);
  assert.deepEqual([BOTIJA.x, BOTIJA.piso], [px, py]);
  assert.ok(py > ASTILLERO.planchada.cubierta[1] && py < ASTILLERO.planchada.muelle[1]);
  // En el camino la tabla se estira con k: a la altura de sus pies, su canto queda donde lo corre el marco.
  const canto = (k: number): number => ASTILLERO.planchada.muelle[0] * k + (ASTILLERO.planchada.cubierta[0] - ASTILLERO.planchada.muelle[0]) * k * 0.3;
  assert.ok(Math.abs(canto(K_ENTORNO) - (BOTIJA.ancla + BOTIJA.ancla * (K_ENTORNO - 1))) < 0.5, 'en el camino queda fuera de la tabla');
  assert.equal(BOTIJA_PERSONAJE.ancla, BOTIJA.ancla);
  // Lo que ocupa parado, de la coronilla a las zapatillas, con el bolso y el boleto.
  const [x0, y0] = alRecinto([-42, -156]);
  const [x1, y1] = alRecinto([38, 8]);
  const otros = [...Object.entries(OJOS_DE_LOS_ASTILLEROS).filter(([id]) => id !== ID).map(([id, [x, y]]) => [id, x, y] as const), ...Object.entries(COSAS_DE_LOS_ASTILLEROS).map(([id, [x, y]]) => [id, x, y] as const), ['el farol', ASTILLERO.farol.x, ASTILLERO.farol.piso - 80] as const];
  for (const [id, ox, oy] of otros) assert.ok(!(ox > x0 - 8 && ox < x1 + 8 && oy > y0 - 8 && oy < y1 + 8), `${id} queda adentro del botija`);
  assert.ok(x1 < HIJA.x - 40, 'se pisa con la hija del fletero');
  // Va en la figura: delante del piso de los astilleros.
  const escena = escenaAstilleros(nombres);
  assert.ok(escena.indexOf('/bestiario/astillero-piso.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso lo tapa');
  // Y ya no está pintado en el piso de los astilleros: la silueta de la planchada se sacó.
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8'), /at\('el-botija-rapado'\)/, 'sigue pintado en el piso de los astilleros');
});

test('las piernas llegan a los pies: parado, corriendo y en la borda, la rodilla dobla para adelante', () => {
  const A = BOTIJA_ARMADO;
  for (const m of [QUIETO, ZAFO, momentoDelToque(QUIETO, 2), momentoDelToque(QUIETO, 3.8), momentoDelToque(QUIETO, 6.6)]) {
    for (const n of [0, 1] as const) {
      const ingle: Punto = [A.ingles[n][0] + m.cadera[0] - A.cadera[0], A.ingles[n][1] + m.cadera[1] - A.cadera[1]];
      const { rodilla, pie } = pierna(ingle, m.pies[n]);
      assert.ok(Math.hypot(pie[0] - m.pies[n][0], pie[1] - m.pies[n][1]) < 4, `la pierna ${n + 1} no llega al pie`);
      assert.ok(rodilla[0] >= Math.min(ingle[0], pie[0]) - 0.5, `la rodilla ${n + 1} dobla para atrás`);
    }
  }
  // Parado, las suelas pisan la tabla: la de allá más arriba, porque la tabla sube.
  assert.ok(QUIETO.pies[0][1] < QUIETO.pies[1][1] && QUIETO.pies[0][0] > QUIETO.pies[1][0]);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarBotijaCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('espera con apuro: tararea, mira el reloj, mira para atrás, se rasca la cabeza, se acomoda el bolso, zapatea y pestañea', () => {
  const hechas: Record<Accion, number> = { tararea: 0, reloj: 0, atras: 0, rasca: 0, bolso: 0, zapatea: 0, zafa: 0 };
  let pestaneos = 0;
  let deEspaldas = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarBotijaCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = escalaY(dom.de('parpado', 'transform'));
      if (p > 0.95 && !cerrado) pestaneos++;
      cerrado = p > 0.95;
      if (/scale\(-/.test(dom.de('cara', 'transform'))) deEspaldas++;
      // Solo, no se va de la tabla.
      assert.deepEqual(trasladoDe(dom.de('viaje', 'transform')), [0, 0]);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['tararea', 'reloj', 'atras', 'rasca', 'bolso', 'zapatea'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.zafa, 0, 'zafó sin que lo toquen');
  assert.ok(deEspaldas > 0, 'nunca miró para atrás');
  assert.ok(pestaneos >= 20 && pestaneos <= 70, `pestañeó ${pestaneos} veces`);
});

test('tocado zafa: mira para atrás, corre planchada arriba, cae en la borda, grita con el boleto en el aire y vuelve a su lugar', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarBotijaCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  let atras = false;
  let boca = 0;
  let boletoAlto = 0;
  let enLaBorda = false;
  for (let i = 1; i < 60 * DURA.zafa; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const u = t - 1;
    if (u < TOQUE_T.mira[1] && /scale\(-/.test(dom.de('cara', 'transform'))) atras = true;
    boca = Math.max(boca, Number(dom.de('boca', 'opacity')));
    boletoAlto = Math.min(boletoAlto, trasladoDe(dom.de('boleto', 'transform'))[1]);
    const [vx, vy] = trasladoDe(dom.de('viaje', 'transform'));
    if (u > TOQUE_T.tambalea[0] && u < TOQUE_T.baja[0] && Math.hypot(vx - BORDA[0], vy - BORDA[1]) < 8) enLaBorda = true;
    if (Math.abs(u - TOQUE_T.corre[1]) < 0.01) assert.ok(Math.hypot(vx - CORRIDA[0], vy - CORRIDA[1]) < 4, 'no subió la planchada');
  }
  assert.ok(atras, 'no miró para atrás');
  assert.ok(enLaBorda, 'no llegó a la borda');
  assert.ok(boca > 0.99, 'no gritó');
  assert.ok(boletoAlto < -30, 'el boleto no saltó');
  // La borda es la del ferry, sobre la cubierta, y del lado de la planchada.
  assert.ok(BORDA_RECINTO[0] > ASTILLERO.ferry.x0 && BORDA_RECINTO[0] < HIJA.x - 30 && BORDA_RECINTO[1] <= ASTILLERO.ferry.cubierta);
  assert.equal(vivo.estado().accion, 'zafa');
  // Al final volvió a su lugar, con el boleto en los dientes.
  assert.deepEqual(trasladoDe(dom.de('viaje', 'transform')), [0, 0]);
  assert.deepEqual(trasladoDe(dom.de('boleto', 'transform')), [0, 0]);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('en el camino la corrida se estira con la planchada, y cae en la misma borda', () => {
  const k = K_ENTORNO;
  const capa = capasDe('los-astilleros', 'figura', nombres, k, ID);
  const dx = Number(/data-dx="(\d+)"/.exec(capa)![1]);
  const dom = nuevo(capa);
  // El marco de juguete no lee el corrimiento del marcado: se lo pone a mano, como lo tiene el de verdad.
  (dom.marcos[0] as unknown as { dataset: Record<string, string> }).dataset.dx = String(dx);
  const { esc, poner } = escenario(false);
  const vivo = armarBotijaCon(dom.marcos, esc, azar(4));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const t = 1 + (TOQUE_T.tambalea[0] + TOQUE_T.tambalea[1]) / 2;
  poner(t);
  vivo.mover(t, 1 / 60);
  const [vx] = trasladoDe(dom.de('viaje', 'transform'));
  // Donde cae, en el piso largo: sobre la cubierta del ferry estirado, entre la proa y el tope de la planchada.
  const cae = dx + BOTIJA.x + vx * BOTIJA.escala;
  assert.ok(cae > ASTILLERO.ferry.x0 * k && cae < ASTILLERO.planchada.cubierta[0] * k, `en el camino cae en ${cae.toFixed(0)}, fuera de la cubierta`);
  assert.ok(Math.abs(cae - BORDA_RECINTO[0] * k) < 30, `en el camino cae lejos de la borda (${cae.toFixed(0)})`);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa a los brazos arriba con el grito y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarBotijaCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('boca', 'opacity'), String(ZAFO.boca));
  assert.equal(dom.de('hombro-2', 'transform'), marcas(ZAFO).transform['hombro-2']);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('boca', 'opacity'), String(QUIETO.boca));
});
