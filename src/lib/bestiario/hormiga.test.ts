import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { HORMIGA_PERSONAJE, PIEZAS_HORMIGA } from './arte-hormiga.ts';
import { BAILA, CAE_GOTA, HORMIGA, HORMIGA_ARMADO as A, QUIETO, SILUETA_VIEJA, alRecinto, marcas, type Punto } from './rig-hormiga.ts';
import { COSAS_DE_LA_MESA, MESA, OJOS_DE_LA_MESA } from './rig-entornos.ts';
import { escenaMesa } from './escenas-entornos.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS, K_ENTORNO } from './camino.ts';
import { DURA, PATEA, VUELTAS, armarHormigaCon, base, momentoDeAccion, type Accion } from '../../scripts/bestiario/hormiga.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * La hormiga dormida (`D-73`, vigesimoctava vuelta): que sea un títere entero, tirada panza arriba en el borde del mantel con su
 * membrillo, su dedal y su camisa, que no esté más pintada en el piso de la mesa, que ronque, sueñe que baila, se despierte a
 * medias y se le duerma la pata por su cuenta, que tocada baile de espaldas dando vueltas y se vuelva a dormir, y que la pose de
 * la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'la-hormiga-dormida';
const figura = capasDe('la-mesa', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_HORMIGA.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--hormiga');
const primero = (re: RegExp, texto: string, otro = 0): number => Number(re.exec(texto)?.[1] ?? otro);

test('la hormiga es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--hormiga" data-id="la-hormiga-dormida" role="button" tabindex="0" aria-label="La hormiga dormida">/);
  for (const p of ['entero', 'cuerpo', 'tronco', 'cabeza', 'ojos', 'antena-1', 'antena-2', 'patas-1', 'patas-2', 'burbuja', 'zzz', 'gota', 'camisa']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `a la hormiga le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_HORMIGA.map((p) => p.nombre).sort());
  for (const p of PIEZAS_HORMIGA) assert.match(p.nombre, /^hormiga-/);
  for (const n of [0, 1] as const) assert.ok(adentro('hormiga-cabeza', A.ojos[n]) && adentro('hormiga-ojos', A.ojos[n]), `el ojo ${n + 1} no está en la cara`);
  assert.ok(adentro('hormiga-cabeza', A.cuello) && adentro('hormiga-cuerpo', [A.cuello[0] + 6, A.cuello[1]]), 'la cabeza no se apoya en el cogote');
  assert.ok(adentro('hormiga-cabeza', A.boca) && adentro('hormiga-burbuja', A.boca), 'la burbuja no sale de la boca');
  A.antenas.forEach((a, i) => assert.ok(adentro(`hormiga-antena-${i + 1}`, a) && adentro('hormiga-cabeza', a), `la antena ${i + 1} no sale de la cabeza`));
  assert.ok(adentro('hormiga-patas-1', A.patas) && adentro('hormiga-patas-2', [A.patas[0] - 4, A.patas[1]]) && adentro('hormiga-cuerpo', [A.patas[0], A.patas[1] + 4]), 'las patas no salen del tórax');
  assert.ok(adentro('hormiga-camisa', A.camisa), 'la camisa no cuelga del hilo');
  assert.ok(adentro('hormiga-zzz', A.zzz) && adentro('hormiga-gota', A.gota), 'las zetas o la gota están fuera de su pieza');
  // El membrillo, el dedal y el palillo viven en el fondo, a los lados del cuerpo; el hilo los junta.
  for (const p of [A.membrillo, A.dedal, A.palillo]) assert.ok(adentro('hormiga-fondo', p), 'algo del fondo no está en su pieza');
  assert.ok(A.membrillo[0] + 27 < A.centro[0] - 40 && A.palillo[0] > 60, 'el membrillo o el palillo pisan el cuerpo');
  for (const p of PIEZAS_HORMIGA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['hormiga-fondo', 'hormiga-cuerpo', 'hormiga-cabeza', 'hormiga-camisa']) assert.match(PIEZAS_HORMIGA.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_HORMIGA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de la hormiga están en su bloque de tokens.css, medidas en Lobo suelto, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨la hormiga dormida⟩'), tokens.indexOf('⟨/la hormiga dormida⟩'));
  const usadas = new Set(PIEZAS_HORMIGA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-hormiga-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de la hormiga`);
  assert.match(bloque, /public\/tapas\/cordero-atado\.jpg/);
  assert.match(bloque, /no tiene verde/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨la hormiga dormida⟩ */'), sitio.indexOf('/* ⟨/la hormiga dormida⟩ */'));
  assert.match(suyo, /\.titere--hormiga \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"zzz"') && suyo.includes('"burbuja"'));
});

test('duerme en el borde del mantel, al lado del membrillo y sin pisar a nadie, ya no está pintada en el piso, y en el camino queda en la mesa', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'la-mesa');
  assert.equal(HORMIGA_PERSONAJE.ancla, HORMIGA.x);
  const [x0, y0] = alRecinto([-134, -72]);
  const [x1, y1] = alRecinto([118, 8]);
  // Entra en el tablero, sobre el canto de adelante, y el membrillo queda donde estaba pintado.
  for (const k of [1, K_ENTORNO]) {
    const corre = HORMIGA.x * (k - 1);
    assert.ok(x0 + corre > MESA.tablero.izq * k && x1 + corre < MESA.tablero.der * k, `con k ${k} se cae de la mesa`);
  }
  assert.ok(y0 > MESA.tablero.atras && y1 <= MESA.tablero.adelante + 12, `ocupa de y ${y0.toFixed(0)} a ${y1.toFixed(0)}`);
  assert.ok(Math.abs(alRecinto(A.membrillo)[0] - MESA.membrillo.x) < 12, 'el membrillo se mudó');
  assert.ok(Math.abs(HORMIGA.piso - MESA.membrillo.piso) <= 2);
  // Donde estaba su silueta está ella, y los demás de la mesa no le quedan adentro.
  assert.ok(SILUETA_VIEJA[0] > x0 && SILUETA_VIEJA[0] < x1, 'no está donde la pintaban');
  for (const [id, [vx, vy]] of Object.entries({ ...OJOS_DE_LA_MESA, ...COSAS_DE_LA_MESA })) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > y0 && vy < y1), `${id} queda adentro de la hormiga`);
  }
  // El frasco de miel queda detrás (más arriba en el tablero) y el vaso del moscón a la derecha: no se pisan.
  assert.ok(MESA.vaso.x > x1 && MESA.miel.piso < alRecinto([0, -8])[1], 'pisa el frasco de miel o el vaso');
  const escena = escenaMesa(nombres);
  assert.ok(escena.indexOf('/bestiario/mesa-piso.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso la tapa');
  assert.ok(!escena.includes(`cosa" data-id="${ID}"`) && !escena.includes(`bestia--cosa" data-id="${ID}"`), 'sigue siendo una cosa');
  const piso = pisoDelCamino(CAMINOS['la-mesa']!, nombres);
  const m = /data-marco="la-hormiga-dormida" data-capa="figura" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no está en la mesa del camino');
  assert.equal(Number(m![1]), Math.round(HORMIGA.x * (K_ENTORNO - 1)));
  // La silueta y el membrillo ya no se dibujan en el piso de la mesa.
  const entornos = readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8');
  assert.doesNotMatch(entornos, /const dormida = /, 'sigue pintada en el piso de la mesa');
  assert.doesNotMatch(entornos, /const membrillo = /, 'el membrillo sigue pintado en el piso de la mesa');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarHormigaCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.equal(marcas(QUIETO).opacity.ojos, '0');
  assert.equal(marcas(QUIETO).opacity.gota, '0');
});

test('por su cuenta ronca hasta reventar la burbuja, sueña que baila, se despierta a medias y se le duerme la pata, sin levantarse', () => {
  const hechas: Record<Accion, number> = { ronca: 0, suena: 0, medias: 0, pata: 0, baila: 0 };
  const vistos = { burbuja: 0, revento: 0, tum: 0, ojo: 0, gota: 0, hormigueo: 0, vuelta: 1 };
  const camisas = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarHormigaCon(dom.marcos, esc, azar(semilla));
    let antes = 0;
    for (let i = 1; i <= 60 * 80; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const b = primero(/scale\((-?[\d.]+)\)/, dom.de('burbuja', 'transform'));
      vistos.burbuja = Math.max(vistos.burbuja, b);
      if (antes > 0.8 && Number(dom.de('burbuja', 'opacity')) === 0) vistos.revento++;
      antes = Number(dom.de('burbuja', 'opacity')) === 0 ? 0 : b;
      vistos.tum = Math.max(vistos.tum, Math.abs(primero(/rotate\((-?[\d.]+)/, dom.de('patas-2', 'transform'))));
      vistos.ojo = Math.max(vistos.ojo, Number(dom.de('ojos', 'opacity')));
      vistos.gota = Math.max(vistos.gota, Number(dom.de('gota', 'opacity')));
      vistos.hormigueo = Math.max(vistos.hormigueo, Math.abs(primero(/rotate\((-?[\d.]+)/, dom.de('patas-1', 'transform'))));
      vistos.vuelta = Math.min(vistos.vuelta, primero(/scale\((-?[\d.]+) 1\)/, dom.de('cuerpo', 'transform'), 1));
      assert.equal(primero(/translate\(0 (-?[\d.]+)\)/, dom.de('cuerpo', 'transform')) < 4, true, 'se levantó del mantel sin que la toquen');
      if (i % 5 === 0) camisas.add(dom.de('camisa', 'transform'));
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['ronca', 'suena', 'medias', 'pata'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.baila, 0, 'bailó sin que la toquen');
  assert.ok(vistos.burbuja > 0.95 && vistos.revento > 0, `la burbuja llegó a ${vistos.burbuja} y reventó ${vistos.revento}`);
  assert.ok(vistos.tum > 10 && vistos.ojo > 0.4 && vistos.ojo < 0.7 && vistos.gota > 0.5 && vistos.hormigueo > 10, JSON.stringify(vistos));
  // Sin que la toquen no se da vuelta, y la camisa se seca al viento.
  assert.ok(vistos.vuelta > 0.99 && camisas.size > 300, `vuelta ${vistos.vuelta}`);
});

test('tocada se despierta de golpe y baila de espaldas: da dos vueltas pateando, la gota le baja, y se vuelve a dormir con la pata en otro lugar', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarHormigaCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  const pata0 = primero(/rotate\((-?[\d.]+)/, dom.de('patas-1', 'transform'));
  dom.oyentes.get('click')!({});
  let ojos = 0;
  let patea = 0;
  let salto = 0;
  let gota = 0;
  let vueltas = 0;
  let boca = 1;
  let dado = false;
  for (let i = 1; i <= 60 * DURA.baila; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    ojos = Math.max(ojos, Number(dom.de('ojos', 'opacity')));
    patea = Math.max(patea, Math.abs(primero(/rotate\((-?[\d.]+)/, dom.de('patas-2', 'transform'))));
    salto = Math.max(salto, -primero(/translate\(0 (-?[\d.]+)\)/, dom.de('cuerpo', 'transform')));
    gota = Math.max(gota, Number(dom.de('gota', 'opacity')));
    const flip = primero(/scale\((-?[\d.]+) 1\)/, dom.de('cuerpo', 'transform'), 1);
    if (flip < -0.9 && !dado) {
      vueltas++;
      dado = true;
    }
    if (flip > 0.9) dado = false;
    boca = Math.min(boca, flip);
  }
  assert.equal(vueltas, VUELTAS, `dio ${vueltas} vueltas`);
  assert.ok(ojos > 0.98 && patea > PATEA * 0.9 && salto > 8 && gota > 0.5 && boca < -0.9, `ojos ${ojos} patea ${patea} salto ${salto} gota ${gota}`);
  assert.ok(CAE_GOTA > 10);
  assert.equal(vivo.estado().hechas.baila, 1);
  // Cuando se vuelve a dormir: los ojos cerrados, el cuerpo en el mantel, y la pata en otro lugar.
  poner(1 + DURA.baila + 0.6);
  vivo.mover(1 + DURA.baila + 0.6, 1 / 60);
  assert.ok(Number(dom.de('ojos', 'opacity')) < 0.05, 'quedó con los ojos abiertos');
  assert.equal(primero(/translate\(0 (-?[\d.]+)\)/, dom.de('cuerpo', 'transform')), 0);
  const pata1 = primero(/rotate\((-?[\d.]+)/, dom.de('patas-1', 'transform'));
  assert.ok(Math.abs(pata1 - pata0) > 6, `la pata quedó en ${pata1} y estaba en ${pata0}`);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
  assert.ok(momentoDeAccion(base(3), 'ronca', 2.9).antenas[0] < base(3).antenas[0] - 10, 'no se le paró la antena al reventar la burbuja');
});

test('con movimiento reducido no se mueve: tocarla la pasa de dormida a bailando, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarHormigaCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('ojos', 'opacity'), marcas(BAILA).opacity.ojos);
  assert.equal(dom.de('patas-1', 'transform'), marcas(BAILA).transform['patas-1']);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('patas-1', 'transform'), marcas(QUIETO).transform['patas-1']);
});
