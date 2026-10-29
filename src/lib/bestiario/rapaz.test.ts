import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_RAPAZ, RAPAZ_PERSONAJE, RETRATO } from './arte-rapaz.ts';
import { BRINDA, MANOS_BRINDA, QUIETO, RAPAZ, RAPAZ_ARMADO, alRecinto, brazos, munecaDibujada, puntaDe, type Punto } from './rig-rapaz.ts';
import { COSAS_DE_LA_MESA, MESA, OJOS_DE_LA_MESA } from './rig-entornos.ts';
import { escenaMesa } from './escenas-entornos.ts';
import { RETRATO as RETRATO_VERDUGO } from './arte-verdugo.ts';
import { DURA, TOQUE_T, armarRapazCon, momentoDeAccion, momentoDelToque, type Accion } from '../../scripts/bestiario/rapaz.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';
import { rot } from './trazos.ts';

/**
 * La tipa rapaz (`D-73`, vigesimocuarta vuelta): que sea un recorte entero a aerógrafo, parada detrás de la mesa
 * sin taparle la cara a nadie ni meterse en el verdugo, que la garra llegue a la billetera, que haga sola lo
 * suyo eligiendo qué, que tocada dé el zarpazo y brinde, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'la-tipa-rapaz';
const figura = capasDe('la-mesa', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_RAPAZ.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto, margen = 0): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 - margen && x <= x0 + w + margen && y >= y0 - margen && y <= y0 + h + margen;
};
const nuevo = () => domDeJuguete([figura], 'titere--rapaz');
const escalaY = (t: string): number => Number(/scale\(1 ([-\d.]+)\)/.exec(t)?.[1] ?? NaN);
const dist = (a: Punto, b: Punto): number => Math.hypot(a[0] - b[0], a[1] - b[1]);
/** La muñeca a la que llega el brazo n, llevada del marco del cuerpo inclinado al de la tipa. */
const llega = (m: Parameters<typeof brazos>[0], n: 0 | 1): Punto => rot(brazos(m)[n].muneca, RAPAZ_ARMADO.cintura, m.inclina);

test('la tipa es un recorte entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--rapaz" data-id="la-tipa-rapaz" role="button" tabindex="0" aria-label="La tipa rapaz">/);
  for (const p of ['entero', 'billetera-mesa', 'cuerpo', 'torso', 'brazo-1', 'antebrazo-1', 'mano-1', 'vino', 'brazo-2', 'antebrazo-2', 'mano-2', 'billetera-mano', 'billetera-cerrada', 'billetera-abierta', 'billete', 'garra-abierta', 'garra-cerrada', 'estola', 'hombrera', 'plumas', 'cabeza', 'pupilas', 'parpado-1', 'parpado-2', 'ceja', 'sonrisa', 'risa', 'aro']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `a la tipa le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_RAPAZ.map((p) => p.nombre).sort());
  const A = RAPAZ_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`rapaz-brazo-${n + 1}`, A.hombros[n]) && adentro('rapaz-torso', A.hombros[n]) && adentro('rapaz-estola', A.hombros[n]), `el brazo ${n + 1} no sale del hombro debajo de la estola`);
    assert.ok(adentro('rapaz-cabeza', A.ojos[n]) && adentro(`rapaz-parpado-${n + 1}`, A.ojos[n]), `el ojo ${n + 1} no está en la cara`);
    assert.ok(adentro(`rapaz-antebrazo-${n + 1}`, munecaDibujada(n)), `la muñeca ${n + 1} no está en el antebrazo`);
  }
  assert.ok(adentro('rapaz-hombrera', A.hombros[0]), 'la estola no tapa el hombro de la copa');
  assert.ok(adentro('rapaz-mano-1', munecaDibujada(0)) && adentro('rapaz-garra-abierta', munecaDibujada(1)) && adentro('rapaz-garra-cerrada', munecaDibujada(1)), 'las manos no salen de la muñeca');
  assert.ok(adentro('rapaz-cabeza', A.cuello) && adentro('rapaz-torso', A.cuello, 4), 'la cabeza no se apoya en el cuello');
  assert.ok(adentro('rapaz-cabeza', A.boca) && adentro('rapaz-sonrisa', A.boca) && adentro('rapaz-risa', A.boca) && adentro('rapaz-cabeza', A.nariz), 'la boca no está debajo del pico');
  assert.ok(adentro('rapaz-aro', A.aro) && adentro('rapaz-cabeza', A.aro), 'el aro no cuelga de la oreja');
  assert.ok(adentro('rapaz-estola', A.escote) && adentro('rapaz-torso', A.escote), 'el escote no está entre las puntas de la estola');
  // Es un recorte del collage de la mesa: lo grande lleva el canto de papel; todo, el grano; ningún hex.
  for (const n of ['rapaz-torso', 'rapaz-estola', 'rapaz-cabeza', 'rapaz-brazo-1', 'rapaz-antebrazo-2', 'rapaz-mano-1', 'rapaz-garra-abierta', 'rapaz-billetera']) {
    const dibujo = PIEZAS_RAPAZ.find((p) => p.nombre === n)!.dibujo;
    assert.ok(dibujo.includes('var(--entorno-mesa-papel)'), `${n} no tiene canto de papel`);
    assert.match(dibujo, /url\(#grano\)/, `${n} no tiene grano`);
  }
  for (const p of PIEZAS_RAPAZ) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  // Nada baja del canto de la mesa más que la garra en el mantel y la billetera.
  for (const p of PIEZAS_RAPAZ.filter((q) => !q.nombre.startsWith('rapaz-billete') && !q.nombre.startsWith('rapaz-garra'))) {
    const [, y, , h] = p.caja;
    assert.ok(y + h <= 14, `${p.nombre} baja del canto de la mesa`);
  }
  const peso = PIEZAS_RAPAZ.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de la tipa están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨la tipa rapaz⟩'), tokens.indexOf('⟨/la tipa rapaz⟩'));
  const usadas = new Set(PIEZAS_RAPAZ.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-rapaz-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de la tipa`);
  assert.match(bloque, /la-mosca-y-la-sopa/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨la tipa rapaz⟩ */'), sitio.indexOf('/* ⟨/la tipa rapaz⟩ */'));
  assert.match(suyo, /\.titere--rapaz \{ cursor: pointer; \}/);
  for (const clase of new Set([...figura.matchAll(/class="(bt-rapaz-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
  for (const p of ['billetera-mesa', 'billete', 'plumas']) assert.ok(suyo.includes(`"${p}"`), `${p} se puede tocar`);
});

test('se para detrás de la mesa, donde miraban sus ojos, sin taparle la cara a nadie ni meterse en el verdugo', () => {
  assert.equal(RAPAZ.x, OJOS_DE_LA_MESA[ID]![0]);
  assert.equal(RAPAZ.mesa, MESA.tablero.atras);
  assert.equal(RAPAZ_PERSONAJE.ancla, RAPAZ.x);
  // La billetera está arriba del mantel, delante suyo, y no encima de las hormigas ni del vaso.
  const [bx, by] = alRecinto(RAPAZ_ARMADO.billetera);
  assert.ok(by > MESA.tablero.atras && by < MESA.tablero.adelante && Math.abs(bx - RAPAZ.x) < 20);
  // Lo que ocupa, con la copa en alto y con la garra a la altura de la cara.
  const [x0, y0, w, h] = RETRATO.caja;
  for (const [id, [ox, oy]] of Object.entries({ ...OJOS_DE_LA_MESA, ...COSAS_DE_LA_MESA })) {
    if (id === ID) continue;
    assert.ok(!(ox > x0 + 4 && ox < x0 + w - 4 && oy > y0 + 4 && oy < y0 + h - 4), `${id} queda adentro de la tipa`);
  }
  const lejos = [puntaDe(MANOS_BRINDA[0], 60), puntaDe({ muneca: [58, -116], giro: -26 }), [36, -146] as Punto].map(alRecinto);
  for (const [x, y] of lejos) {
    assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `(${x.toFixed(0)}, ${y.toFixed(0)}) se sale de su caja`);
    assert.ok(x < RETRATO_VERDUGO.caja[0] - 4, `(${x.toFixed(0)}, ${y.toFixed(0)}) se mete en el verdugo`);
  }
  // Va en la figura: delante del piso de la mesa y detrás de lo de adelante.
  const escena = escenaMesa(nombres);
  const marco = escena.indexOf(`data-marco="${ID}"`);
  assert.ok(escena.indexOf('/bestiario/mesa-piso.webp') < marco && marco < escena.indexOf('/bestiario/mesa-frente.webp'), 'la mesa la tapa o ella tapa lo de adelante');
  // Y ya no está pintada en el piso de la mesa: la silueta con la copa se sacó.
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8'), /at\('la-tipa-rapaz'\)/, 'sigue pintada en el piso de la mesa');
});

test('los brazos llegan: la garra a la billetera del mantel y al escote, la copa bien alto para brindar', () => {
  for (const n of [0, 1] as const) assert.ok(dist(llega(QUIETO, n), QUIETO.manos[n].muneca) < 1, `la mano ${n + 1} quieta no llega`);
  // El zarpazo: con el cuerpo agachado, la punta de las uñas cae sobre la billetera.
  const zarpa = momentoDelToque(QUIETO, 1.0);
  assert.ok(dist(llega(zarpa, 1), zarpa.manos[1].muneca) < 2, 'la garra no llega adonde la mandan en el zarpazo');
  assert.ok(dist(puntaDe(zarpa.manos[1], 22), RAPAZ_ARMADO.billetera) < 10, 'las uñas no caen sobre la billetera');
  const escote = momentoDelToque(QUIETO, 3.1);
  assert.ok(dist(llega(escote, 1), escote.manos[1].muneca) < 1 && dist(escote.manos[1].muneca, RAPAZ_ARMADO.escote) < 16, 'la garra no llega al escote');
  assert.ok(dist(llega(BRINDA, 0), MANOS_BRINDA[0].muneca) < 1, 'la copa no llega arriba');
  assert.ok(puntaDe(MANOS_BRINDA[0], 44)[1] < RAPAZ_ARMADO.ojos[0][1], 'brinda con la copa más abajo que los ojos');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarRapazCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('sola gira la copa, ojea los platos, se ríe, se acomoda la estola, tamborilea y se mira las uñas, y pestañea despacio', () => {
  const hechas: Record<Accion, number> = { gira: 0, ojea: 0, rie: 0, estola: 0, tamborilea: 0, unas: 0, zarpa: 0 };
  let pestaneos = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarRapazCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = Math.min(escalaY(dom.de('parpado-1', 'transform')), escalaY(dom.de('parpado-2', 'transform')));
      if (p > 0.9 && !cerrado) pestaneos++;
      cerrado = p > 0.9;
      // La billetera nunca se mueve si no la tocan.
      assert.equal(dom.de('billetera-mesa', 'opacity'), '1');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['gira', 'ojea', 'rie', 'estola', 'tamborilea', 'unas'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.zarpa, 0, 'dio el zarpazo sin que la toquen');
  assert.ok(pestaneos >= 15 && pestaneos <= 70, `pestañeó ${pestaneos} veces`);
  // Cada cosa vuelve a la pose quieta cuando termina.
  for (const a of ['gira', 'ojea', 'rie', 'estola', 'tamborilea', 'unas'] as const) {
    const fin = momentoDeAccion(QUIETO, a, DURA[a], 1);
    assert.deepEqual(brazos(fin).map((x) => x.muneca.map((v) => Math.round(v))), brazos(QUIETO).map((x) => x.muneca.map((v) => Math.round(v))), `${a} no vuelve a las manos quietas`);
  }
});

test('tocada da el zarpazo: agarra la billetera, se lleva el billete, la devuelve, brinda, se ríe y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarRapazCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  let enMano = 0;
  let abierta = 0;
  let billete = 0;
  let cerrada = 0;
  let risa = 0;
  let brinda = 0;
  let devuelta = false;
  for (let i = 1; i < 60 * DURA.zarpa; i++) {
    const t = 1 + i / 60;
    const u = t - 1;
    poner(t);
    vivo.mover(t, 1 / 60);
    if (dom.de('billetera-mano', 'opacity') === '1') enMano = Math.max(enMano, u);
    abierta = Math.max(abierta, Number(dom.de('billetera-abierta', 'opacity')));
    billete = Math.max(billete, Number(dom.de('billete', 'opacity')));
    cerrada = Math.max(cerrada, Number(dom.de('garra-cerrada', 'opacity')));
    risa = Math.max(risa, Number(dom.de('risa', 'opacity')));
    // La copa en alto: el brazo de la copa sube del hombro.
    const giro = Number(/rotate\(([-\d.]+)/.exec(dom.de('brazo-1', 'transform'))?.[1] ?? 0);
    if (u > TOQUE_T.brinda[0] && u < TOQUE_T.brinda[1]) brinda = Math.max(brinda, giro);
    if (u > TOQUE_T.devuelve[1] && dom.de('billetera-mesa', 'opacity') === '1') devuelta = true;
  }
  assert.ok(enMano > 2.5, 'no se quedó con la billetera');
  assert.ok(cerrada > 0.99, 'no cerró la garra');
  assert.ok(abierta > 0.99, 'no abrió la billetera');
  assert.ok(billete > 0.99, 'no sacó el billete');
  assert.ok(devuelta, 'no devolvió la billetera');
  assert.ok(brinda > 60, `no levantó la copa (${brinda.toFixed(0)})`);
  assert.ok(risa > 0.99, 'no se rió');
  assert.equal(vivo.estado().accion, 'zarpa');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
  // Al final la garra vuelve al mantel y la billetera a su lugar.
  poner(1 + DURA.zarpa + 0.01);
  vivo.mover(1 + DURA.zarpa + 0.01, 1 / 60);
  assert.equal(dom.de('billetera-mesa', 'opacity'), '1');
  assert.equal(dom.de('garra-abierta', 'opacity'), '1');
});

test('con movimiento reducido no se mueve: tocarla la pasa al brindis con la billetera en la garra y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarRapazCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('billetera-mano', 'opacity'), '1');
  assert.equal(dom.de('garra-cerrada', 'opacity'), String(BRINDA.garra));
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.deepEqual(dom.foto(), antes);
});
