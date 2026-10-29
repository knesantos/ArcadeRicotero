import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { CIELO_PERSONAJE, PIEZAS_CIELO } from './arte-cielo.ts';
import { BRINDIS, CIELO, CIELO_ARMADO, COLGADO, COLGADO_CAE, QUIETO, alRecinto, contorno, giroDelVaso, manoDibujada, manoEn, marcas, pierna, type Momento, type Punto } from './rig-cielo.ts';
import { CHAPA, LIMON } from './rig.ts';
import { VECINOS_DEL_BALDIO, escenaBaldio } from './escenas.ts';
import { DICE, DURA, SOLAS, TOQUE_T, armarCieloCon, base, momentoDeAccion, momentoDelToque, type Accion } from '../../scripts/bestiario/cielo.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El que no se cayó del cielo (`D-73`, vigesimoquinta vuelta): que sea un títere entero a aerógrafo, sentado en
 * el filo de la chapa a la derecha de todo, sin salirse por el borde ni meterse en Limón, con los ojos donde
 * estaban; que viva solo sin un bucle, que tocado se caiga, quede colgado de una mano, se suba, brinde y diga
 * el verso, que el vaso no se vuelque nunca, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; tema?: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-que-no-se-cayo-del-cielo';
const figura = capasDe('los-techos', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_CIELO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--cielo');
const A = CIELO_ARMADO;

/** Lo que gira el vaso en el techo: la suma de los `rotate` de todo lo que tiene encima, y el suyo. */
const ARRIBA_DEL_VASO = ['caida', 'torso-brazos', 'hombro-2', 'codo-2', 'vaso'];
const girosDe = (t: string): number => [...t.matchAll(/rotate\(([-\d.]+)/g)].reduce((s, m) => s + Number(m[1]), 0);
const derecho = (giro: number): number => Math.abs(((((giro + 180) % 360) + 360) % 360) - 180);
const vasoEn = (m: Momento): number => derecho(ARRIBA_DEL_VASO.reduce((s, p) => s + girosDe(marcas(m).transform[p]!), 0));

/** Todas las poses que pone: las tres fijas, el toque entero y cada cosa que hace solo. */
const POSES: Momento[] = [QUIETO, COLGADO, BRINDIS];
for (let u = 0; u <= DURA.toque; u += 0.05) POSES.push(momentoDelToque(base(u * 1.7), u));
for (const a of SOLAS) for (let u = 0; u <= DURA[a]; u += 0.1) POSES.push(momentoDeAccion(base(u * 2.3), a, u));

test('el que no se cayó del cielo es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--cielo" data-id="el-que-no-se-cayo-del-cielo" role="button" tabindex="0" aria-label="El que no se cayó del cielo">/);
  const partes = ['entero', 'olor', 'botella', 'caida', 'torso', 'medalla', 'cabeza', 'pupilas', 'parpados', 'boca', 'asco', 'pelo', 'torso-brazos', 'vaso'];
  for (const n of [1, 2]) partes.push(`muslo-${n}`, `canilla-${n}`, `zapato-${n}`, `hombro-${n}`, `codo-${n}`);
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `le falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_CIELO.map((p) => p.nombre).sort());
  for (const p of PIEZAS_CIELO) assert.match(p.nombre, /^cielo-/);
  for (const n of [0, 1] as const) {
    const [sx, sy] = A.hombros[n];
    const [ix, iy] = A.ingles[n];
    assert.ok(adentro(`cielo-brazo-${n + 1}`, A.hombros[n]) && adentro('cielo-torso', A.hombros[n]), `el brazo ${n + 1} no sale del hombro`);
    assert.ok(adentro(`cielo-brazo-${n + 1}`, [sx, sy + A.brazo]) && adentro(`cielo-antebrazo-${n + 1}`, [sx, sy + A.brazo]), `el codo ${n + 1} no une el brazo`);
    assert.ok(adentro(`cielo-antebrazo-${n + 1}`, manoDibujada(n)), `la mano ${n + 1} se sale de su antebrazo`);
    assert.ok(adentro(`cielo-muslo-${n + 1}`, A.ingles[n]) && adentro('cielo-torso', A.ingles[n]), `la pierna ${n + 1} no sale de la cadera`);
    assert.ok(adentro(`cielo-muslo-${n + 1}`, [ix, iy + A.muslo]) && adentro(`cielo-canilla-${n + 1}`, [ix, iy + A.muslo]), `la rodilla ${n + 1} no une la pierna`);
    assert.ok(adentro(`cielo-canilla-${n + 1}`, [ix, iy + A.muslo + A.canilla]) && adentro(`cielo-zapato-${n + 1}`, [ix, iy + A.muslo + A.canilla]), `el zapato ${n + 1} no está en el pie`);
  }
  assert.ok(adentro('cielo-vaso', manoDibujada(1)), 'el vaso no está en la mano');
  for (const o of A.ojos) assert.ok(adentro('cielo-cabeza', o) && adentro('cielo-pupilas', o) && adentro('cielo-parpados', o), 'el ojo no está en la cara');
  assert.ok(adentro('cielo-hinchado', A.ojos[1]), 'el ojo hinchado no está en su ojo');
  assert.ok(adentro('cielo-cabeza', A.cuello) && adentro('cielo-torso', A.cuello), 'la cabeza no se apoya en el cogote');
  assert.ok(adentro('cielo-cabeza', A.nariz) && adentro('cielo-asco', A.nariz) && adentro('cielo-boca', A.boca), 'la nariz o la boca no están en la cara');
  assert.ok(adentro('cielo-pelo', A.coronilla) && adentro('cielo-medalla', A.medalla) && adentro('cielo-torso', A.medalla), 'el pelo o la medalla están en el aire');
  assert.ok(adentro('cielo-botella', A.botella), 'la botella no está en su caja');
  for (const p of PIEZAS_CIELO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['cielo-torso', 'cielo-cabeza', 'cielo-muslo-1', 'cielo-brazo-1', 'cielo-botella']) assert.match(PIEZAS_CIELO.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/, `${n} no tiene grano`);
  for (const n of ['cielo-torso', 'cielo-cabeza']) assert.match(PIEZAS_CIELO.find((p) => p.nombre === n)!.dibujo, /url\(#soplo-[ml]\)/, `${n} no está soplada`);
  const peso = PIEZAS_CIELO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas están en su bloque de tokens.css, medidas en Gulp!, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el que no se cayo del cielo⟩'), tokens.indexOf('⟨/el que no se cayo del cielo⟩'));
  const usadas = new Set(PIEZAS_CIELO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-cielo-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12 && usadas.size <= 20, `usa ${usadas.size} tintas`);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en su bloque`);
  for (const tapa of ['gulp-frontal.jpg', 'gulp-interior-frontal.jpg', 'gulp-trasera.jpg']) assert.ok(bloque.includes(tapa), `no dice que midió ${tapa}`);
  assert.equal(datos.bestias.find((b) => b.id === ID)!.tema, 'yo-no-me-cai-del-cielo');
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el que no se cayo del cielo⟩ */'), sitio.indexOf('/* ⟨/el que no se cayo del cielo⟩ */'));
  assert.match(suyo, /\.titere--cielo \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"olor"'), 'el olor a gato se puede tocar');
});

test('está sentado en el filo de la chapa, con los ojos donde estaban, y va en la figura después de la chapa', () => {
  assert.equal(CIELO.piso, CHAPA.piso);
  assert.equal(CIELO_PERSONAJE.ancla, CIELO.x);
  const [ox, oy] = VECINOS_DEL_BALDIO[ID]!;
  const [a, b] = A.ojos.map(alRecinto);
  const [ex, ey] = [(a![0] + b![0]) / 2, (a![1] + b![1]) / 2];
  assert.ok(Math.hypot(ex - ox, ey - oy) < 6, `los ojos quedaron en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  // Sentado: la cadera en el filo, las rodillas apenas abajo y los pies colgando por delante de la medianera.
  const [, cadera] = alRecinto([0, A.ingles[0][1]]);
  assert.ok(Math.abs(cadera - CHAPA.piso) < 5, 'no está sentado en la chapa');
  for (const n of [0, 1] as const) assert.ok(alRecinto(pierna(QUIETO, n).tobillo)[1] > CHAPA.abajo + 20, 'los pies no cuelgan');
  const escena = escenaBaldio(nombres);
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos en lo oscuro');
  assert.ok(escena.indexOf('/bestiario/baldio-chapa.webp') < escena.indexOf(`data-marco="${ID}"`), 'la chapa le tapa las piernas');
});

test('en ninguna pose se sale por la derecha, se mete en Limón ni le tapa los ojos a Susanita y a su gato', () => {
  let [x0, x1, y0, y1] = [Infinity, -Infinity, Infinity, -Infinity];
  for (const m of POSES) {
    for (const [x, y] of contorno(m)) {
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    }
  }
  assert.ok(x1 <= 1496, `llega hasta ${x1.toFixed(0)}`);
  // Limón corre por la chapa hasta su punta, y el cuerpo le da unos cuarenta más.
  assert.ok(x0 >= LIMON.hasta + 32, `se mete hasta ${x0.toFixed(0)}, donde corre Limón`);
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_BALDIO)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 - 10 && vx < x1 + 10 && vy > y0 - 10 && vy < y1 + 10), `${id} le queda adentro`);
  }
});

test('el vaso queda derecho en cualquier pose: gira al revés de todo lo que tiene encima', () => {
  for (const m of POSES) {
    assert.ok(vasoEn(m) < 0.05, `el vaso se ladea ${vasoEn(m).toFixed(2)}°`);
    assert.ok(Math.abs(girosDe(marcas(m).transform.vaso!) - giroDelVaso(m)) < 0.01);
  }
  // Colgado, el brazo del vaso está bien torcido, y el vaso igual derecho; la otra mano, en el filo.
  assert.ok(Math.abs(girosDe(marcas(COLGADO).transform.vaso!)) > 45, 'colgado, el vaso no tuvo que enderezarse');
  assert.ok(Math.hypot(...(manoEn(COLGADO, 0).map((v, i) => v - alRecinto(A.agarre)[i]!) as [number, number])) < 1, 'colgado, no se agarra del filo');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarCieloCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  const dom = nuevo();
  assert.equal(dom.de('caida', 'transform'), marcas(QUIETO).transform.caida);
  assert.deepEqual(trasladoDe(dom.de('caida', 'transform')), [0, 0]);
  assert.equal(dom.de('parpados', 'opacity'), '0');
});

test('vive solo: bebe, mira el cielo y niega, se tambalea, bosteza, huele el gato, cabecea, hamaca los pies, la botella rueda, y pestañea', () => {
  const hechas = Object.fromEntries(Object.keys(DURA).map((a) => [a, 0])) as Record<Accion, number>;
  let pestaneos = 0;
  const medallas = new Set<string>();
  let ladeo = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarCieloCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = Number(dom.de('parpados', 'opacity'));
      if (p > 0.9 && !cerrado) pestaneos++;
      cerrado = p > 0.9;
      if (i % 7 === 0) medallas.add(dom.de('medalla', 'transform'));
      if (i % 5 === 0) ladeo = Math.max(ladeo, derecho(ARRIBA_DEL_VASO.reduce((s, n) => s + girosDe(dom.de(n, 'transform')), 0)));
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of SOLAS) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque, 0, 'se cayó sin que lo toquen');
  assert.ok(pestaneos >= 10, `pestañeó ${pestaneos} veces`);
  assert.ok(medallas.size > 300, 'la medalla no se mece');
  assert.ok(ladeo < 0.05, `el vaso se ladeó ${ladeo.toFixed(2)}°`);
});

test('tocado se cae, queda colgado de una mano con el vaso derecho, patalea, se sube, brinda y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarCieloCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { hondo: 0, agarrado: Infinity, patadas: new Set<string>(), codo: 0, ladeo: 0, brinda: Infinity, accion: '', dijoAntes: false };
  const filo = alRecinto(A.agarre);
  for (let i = 1; i <= 60 * DURA.toque; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const m = vivo.estado().momento;
    const [, y] = trasladoDe(dom.de('caida', 'transform'));
    visto.hondo = Math.max(visto.hondo, y);
    visto.ladeo = Math.max(visto.ladeo, derecho(ARRIBA_DEL_VASO.reduce((s, n) => s + girosDe(dom.de(n, 'transform')), 0)));
    if (u > TOQUE_T.colgado[0] + 0.1 && u < TOQUE_T.colgado[1]) {
      visto.agarrado = Math.min(visto.agarrado, -Math.hypot(manoEn(m, 0)[0] - filo[0], manoEn(m, 0)[1] - filo[1]));
      visto.patadas.add(dom.de('muslo-1', 'transform'));
    }
    if (u > TOQUE_T.codo2[0] && u < TOQUE_T.codo2[1]) visto.codo = Math.max(visto.codo, y);
    if (u > TOQUE_T.brinda[0] + 0.5 && u < TOQUE_T.brinda[1] - 0.6) visto.brinda = Math.min(visto.brinda, manoEn(m, 1)[1]);
    if (i === 60 * 4) visto.accion = vivo.estado().accion ?? '';
    if (u < DICE - 0.05 && dichos.length) visto.dijoAntes = true;
  }
  assert.ok(visto.hondo >= COLGADO_CAE[1] * 0.98, `bajó ${visto.hondo.toFixed(0)}`);
  assert.ok(-visto.agarrado < 1.5, `colgado, la mano se le fue ${(-visto.agarrado).toFixed(1)} del filo`);
  assert.ok(visto.patadas.size > 40, 'no pataleó');
  assert.ok(visto.codo > 60 && visto.codo < COLGADO_CAE[1] - 40, `con los codos quedó a ${visto.codo.toFixed(0)}`);
  assert.ok(visto.ladeo < 0.05, `el vaso se ladeó ${visto.ladeo.toFixed(2)}°`);
  assert.ok(visto.brinda < alRecinto(A.ojos[0])[1], 'no levantó el vaso para brindar');
  assert.equal(visto.accion, 'toque');
  assert.ok(!visto.dijoAntes, 'dijo el verso antes de subirse');
  // Al final está sentado otra vez, como estaba.
  const [x, y] = trasladoDe(dom.de('caida', 'transform'));
  assert.ok(Math.abs(x) < 1 && Math.abs(y) < 1, `quedó en ${x}, ${y}`);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de sentado a colgado con el vaso derecho, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarCieloCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('caida', 'transform'), marcas(COLGADO).transform.caida);
  assert.equal(dom.de('vaso', 'transform'), marcas(COLGADO).transform.vaso);
  assert.ok(derecho(ARRIBA_DEL_VASO.reduce((s, n) => s + girosDe(dom.de(n, 'transform')), 0)) < 0.05, 'colgado, el vaso se ladea');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('caida', 'transform'), marcas(QUIETO).transform.caida);
  assert.equal(dichos.length, 2);
});
