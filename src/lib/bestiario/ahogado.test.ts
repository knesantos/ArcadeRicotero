import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { AHOGADO_PERSONAJE, PIEZAS_AHOGADO } from './arte-ahogado.ts';
import { AGUA, AHOGADO, AHOGADO_ARMADO, BU, HONDO, QUIETO, ZAMBULLE, alRecinto, marcas, type Momento, type Punto } from './rig-ahogado.ts';
import { BAJO, PIERRE } from './rig.ts';
import { VECINOS_DEL_BAJO, escenaBajo } from './escenas.ts';
import { DURA, TOQUE_T, armarAhogadoCon, base, momentoDeAccion, momentoDelToque, type Accion } from '../../scripts/bestiario/ahogado.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El ahogado y su fiel fantasma (`D-73`, vigesimoquinta vuelta): que sean un títere entero a aerógrafo, en el
 * agua de la izquierda del bajo, entre la pared y el bote, con el agua cortándolos; que vivan solos (él a punto
 * de irse a pique, el fantasma flotando encima), que tocados se vayan a pique los dos, con el BU en el medio, y
 * vuelvan; y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-ahogado-y-su-fiel-fantasma';
const figura = capasDe('el-bajo', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_AHOGADO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--ahogado');

/* Las cuentas de las transformaciones, para saber dónde queda cada pieza en un momento. */
type M = [number, number, number, number, number, number];
const por = ([a, b, c, d, e, f]: M, [g, h, i, j, k, l]: M): M => [a * g + c * h, b * g + d * h, a * i + c * j, b * i + d * j, a * k + c * l + e, b * k + d * l + f];
function matriz(t: string): M {
  let m: M = [1, 0, 0, 1, 0, 0];
  for (const [, op, args] of t.matchAll(/(translate|rotate|scale|skewX)\(([^)]*)\)/g)) {
    const v = args!.trim().split(/[\s,]+/).map(Number);
    if (op === 'translate') m = por(m, [1, 0, 0, 1, v[0]!, v[1] ?? 0]);
    else if (op === 'scale') m = por(m, [v[0]!, 0, 0, v[1] ?? v[0]!, 0, 0]);
    else if (op === 'skewX') m = por(m, [1, 0, Math.tan((v[0]! * Math.PI) / 180), 1, 0, 0]);
    else {
      const r = (v[0]! * Math.PI) / 180;
      const [cx, cy] = [v[1] ?? 0, v[2] ?? 0];
      m = por(por(por(m, [1, 0, 0, 1, cx, cy]), [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0]), [1, 0, 0, 1, -cx, -cy]);
    }
  }
  return m;
}
/** Por qué grupos pasa cada pieza, de afuera para adentro (sin el `entero`). */
const CADENA: Record<string, readonly string[]> = {
  'ahogado-piolin': ['piolin'],
  'ahogado-sabana': ['fantasma'],
  'ahogado-espalda': ['fantasma'],
  'ahogado-agujeros': ['fantasma', 'agujeros'],
  'ahogado-boca-f': ['fantasma', 'boca-f'],
  'ahogado-ruedo': ['fantasma', 'ruedo'],
  'ahogado-gotas': ['fantasma', 'gotas'],
  'ahogado-brazo-2': ['ahogado', 'brazo-2'],
  'ahogado-cabeza': ['ahogado', 'cabeza'],
  'ahogado-pupilas': ['ahogado', 'cabeza', 'pupilas'],
  'ahogado-parpados': ['ahogado', 'cabeza', 'parpados'],
  'ahogado-boca': ['ahogado', 'cabeza', 'boca'],
  'ahogado-alga': ['ahogado', 'cabeza'],
  'ahogado-pescado': ['ahogado', 'cabeza', 'pescado'],
  'ahogado-brazo-1': ['ahogado', 'brazo-1'],
  'ahogado-manga-1': ['fantasma-delante', 'manga-1'],
  'ahogado-manga-2': ['fantasma-delante', 'manga-2'],
  'ahogado-sombrero': ['sombrero'],
  'ahogado-chorro': ['chorro'],
  'ahogado-burbujas-1': ['burbujas-1'],
  'ahogado-burbujas-2': ['burbujas-2'],
  'ahogado-burbujon': ['burbujon'],
  'ahogado-ondas': ['ondas'],
};
/** La caja de una pieza en un momento: en las coordenadas del ahogado (`recinto` falso) o en las del recinto. */
function donde(nombre: string, m: Momento, recinto = true): { x0: number; x1: number; y0: number; y1: number } {
  const { transform } = marcas(m);
  const mm = matriz((recinto ? transform.entero! : '') + ' ' + CADENA[nombre]!.map((n) => transform[n] ?? '').join(' '));
  const [x, y, w, h] = caja(nombre);
  const pts = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].map(([px, py]) => [mm[0] * px! + mm[2] * py! + mm[4], mm[1] * px! + mm[3] * py! + mm[5]] as const);
  return { x0: Math.min(...pts.map((p) => p[0])), x1: Math.max(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), y1: Math.max(...pts.map((p) => p[1])) };
}
const DEL_AHOGADO = Object.keys(CADENA).filter((n) => CADENA[n]![0] === 'ahogado');
const DEL_FANTASMA = Object.keys(CADENA).filter((n) => ['fantasma', 'fantasma-delante', 'piolin'].includes(CADENA[n]![0]!));

/** Todos los momentos que puede tener: quieto, el BU, cada acción sola y el toque, cuadro por cuadro. */
function todos(): Momento[] {
  const ms: Momento[] = [QUIETO, BU];
  for (let i = 0; i <= 80; i++) {
    const t = i * 0.37;
    for (const a of ['manotea', 'escupe', 'glu', 'infla', 'vuelta', 'asoma', 'sostiene', 'miran'] as const) ms.push(momentoDeAccion(base(t), a, (i / 80) * DURA[a]));
    ms.push(momentoDelToque(base(t), (i / 80) * DURA.pique));
  }
  return ms;
}

test('el ahogado y su fantasma son un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--ahogado" data-id="el-ahogado-y-su-fiel-fantasma" role="button" tabindex="0" aria-label="El ahogado y su fiel fantasma">/);
  for (const p of ['entero', 'piolin', 'fantasma', 'espalda', 'agujeros', 'boca-f', 'ruedo', 'gotas', 'ahogado', 'brazo-2', 'cabeza', 'pupilas', 'parpados', 'boca', 'alga', 'pescado', 'brazo-1', 'fantasma-delante', 'manga-1', 'manga-2', 'sombrero', 'ondas', 'chorro', 'burbujas-1', 'burbujas-2', 'burbujon']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_AHOGADO.map((p) => p.nombre).sort());
  assert.deepEqual(Object.keys(CADENA).sort(), PIEZAS_AHOGADO.map((p) => p.nombre).sort());
  for (const p of PIEZAS_AHOGADO) assert.match(p.nombre, /^ahogado-/);
  const A = AHOGADO_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`ahogado-brazo-${n + 1}`, A.hombros[n]) && adentro(`ahogado-brazo-${n + 1}`, A.manos[n]), `el brazo ${n + 1} no va del hombro a la mano`);
    assert.ok(adentro('ahogado-cabeza', A.ojos[n]) && adentro('ahogado-pupilas', A.ojos[n]) && adentro('ahogado-parpados', A.ojos[n]), `el ojo ${n + 1} no está en la cara`);
    assert.ok(adentro('ahogado-sabana', A.agujeros[n]) && adentro('ahogado-agujeros', A.agujeros[n]), `el agujero ${n + 1} no está en la sábana`);
    assert.ok(adentro(`ahogado-manga-${n + 1}`, A.mangas[n]) && adentro('ahogado-sabana', A.mangas[n]), `la manga ${n + 1} no sale del hombro de la sábana`);
  }
  assert.ok(adentro('ahogado-brazo-1', A.moneda), 'la moneda no está en la mano');
  assert.ok(adentro('ahogado-brazo-2', A.salvavidas), 'el salvavidas no está en la otra mano');
  assert.ok(adentro('ahogado-cabeza', A.nariz) && adentro('ahogado-cabeza', A.boca) && adentro('ahogado-boca', A.boca), 'la nariz o la boca no están en la cara');
  assert.ok(adentro('ahogado-pescado', A.pescado) && adentro('ahogado-alga', A.pescado) && adentro('ahogado-cabeza', A.pescado), 'el pescado no está en la cabeza');
  assert.ok(adentro('ahogado-sabana', A.bocaF) && adentro('ahogado-boca-f', A.bocaF), 'el BU no sale de la sábana');
  assert.ok(adentro('ahogado-ruedo', A.nudo) && adentro('ahogado-piolin', A.nudo), 'el piolín no está atado al ruedo');
  assert.ok(adentro('ahogado-sombrero', A.sombrero), 'el sombrero no está donde flota');
  // El piolín llega abajo del agua, al tobillo: no queda colgando en el aire.
  assert.ok(caja('ahogado-piolin')[1] + caja('ahogado-piolin')[3] > AGUA + 60, 'el piolín no llega al tobillo');
  for (const p of PIEZAS_AHOGADO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['ahogado-sabana', 'ahogado-cabeza', 'ahogado-brazo-1', 'ahogado-brazo-2', 'ahogado-ruedo']) assert.match(PIEZAS_AHOGADO.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  // Los agujeros son agujeros: la sábana se corta con la regla par-impar, no se pinta un ojo.
  assert.match(PIEZAS_AHOGADO.find((p) => p.nombre === 'ahogado-sabana')!.dibujo, /clip-rule="evenodd"/);
  const peso = PIEZAS_AHOGADO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas están en su bloque de tokens.css, medidas en Oktubre, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el ahogado y su fiel fantasma⟩'), tokens.indexOf('⟨/el ahogado y su fiel fantasma⟩'));
  const usadas = new Set(PIEZAS_AHOGADO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-ahogado-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12 && usadas.size <= 20, `usa ${usadas.size} tintas`);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del ahogado`);
  assert.match(bloque, /oktubre-frontal\.jpg/);
  assert.match(bloque, /oktubre-trasera\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el ahogado y su fiel fantasma⟩ */'), sitio.indexOf('/* ⟨/el ahogado y su fiel fantasma⟩ */'));
  assert.match(suyo, /\.titere--ahogado \{ cursor: pointer; \}/);
  for (const p of ['"ondas"', '"chorro"', '"burbujon"', '^="burbujas-"']) assert.ok(suyo.includes(p), `${p} se puede tocar`);
});

test('están en el agua de la izquierda, con los ojos donde estaban, entre la pared y el bote, sin taparle los ojos a nadie', () => {
  assert.equal(AHOGADO_PERSONAJE.ancla, AHOGADO.x);
  // El agua a su altura: más adelante que la de Pierre y que la de la pared, y antes del frente.
  assert.ok(AHOGADO.agua > PIERRE.agua && AHOGADO.agua > BAJO.fondo && AHOGADO.agua < 520, `el agua está en ${AHOGADO.agua}`);
  const [ox, oy] = VECINOS_DEL_BAJO[ID]!;
  const [ex, ey] = alRecinto(AHOGADO_ARMADO.ojo);
  assert.ok(Math.hypot(ex - ox, ey - oy) < 4, `los ojos quedaron en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  // Nada suyo pasa de la pared del recinto ni se mete en el bote (x 24 a 236), en ningún momento; las ondas
  // pueden llegar al bote, pero tampoco pasan de la pared.
  const ms = todos();
  for (const p of PIEZAS_AHOGADO) {
    for (const m of ms) {
      const { x0, x1 } = donde(p.nombre, m);
      assert.ok(x0 >= -250, `${p.nombre} pasa de la pared: ${x0.toFixed(0)}`);
      if (p.nombre !== 'ahogado-ondas') assert.ok(x1 < 20, `${p.nombre} se mete en el bote: ${x1.toFixed(0)}`);
    }
  }
  // Los ojos de los demás no le quedan adentro.
  const cajas = PIEZAS_AHOGADO.filter((p) => p.nombre !== 'ahogado-ondas' && p.nombre !== 'ahogado-piolin').map((p) => donde(p.nombre, QUIETO));
  const [X0, X1, Y0, Y1] = [Math.min(...cajas.map((c) => c.x0)), Math.max(...cajas.map((c) => c.x1)), Math.min(...cajas.map((c) => c.y0)), Math.max(...cajas.map((c) => c.y1))];
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_BAJO)) {
    if (id === ID) continue;
    assert.ok(!(vx > X0 && vx < X1 && vy > Y0 && vy < Y1), `${id} queda adentro del ahogado`);
  }
});

test('el agua los corta: lo de abajo no se dibuja, y a pique no se les ve nada', () => {
  assert.match(figura, new RegExp(`<clipPath id="m-ahogado-agua-titere"><rect x="-400" y="-500" width="800" height="${500 + AGUA}"/></clipPath>`));
  // El retrato y el títere no comparten el id del recorte.
  const retrato = AHOGADO_PERSONAJE.retrato!.cuerpo();
  assert.ok(!retrato.includes('id="m-ahogado-agua-titere"') && retrato.includes('id="m-ahogado-agua-retrato"'));
  // En el silencio del toque, todo lo del ahogado y todo lo del fantasma queda debajo del agua.
  for (let u = TOQUE_T.silencio[0]; u <= TOQUE_T.silencio[1] - 0.05; u += 0.1) {
    const m = momentoDelToque(base(u), u);
    for (const n of [...DEL_AHOGADO, ...DEL_FANTASMA]) {
      const { y0 } = donde(n, m, false);
      assert.ok(y0 > AGUA, `a los ${u.toFixed(1)} s ${n} asoma hasta ${y0.toFixed(0)}`);
    }
  }
  // Y en la pose quieta se ven: la cabeza arriba del agua, la sábana en el aire.
  assert.ok(donde('ahogado-cabeza', QUIETO, false).y0 < -40 && donde('ahogado-sabana', QUIETO, false).y1 < -80);
});

test('en el bajo van en la figura: después del agua de adelante y de los ojos, antes del frente', () => {
  const escena = escenaBajo(nombres);
  const suyo = escena.indexOf(`data-marco="${ID}" data-capa="figura"`);
  assert.ok(suyo > 0, 'no está en la figura');
  assert.ok(escena.indexOf('clip-path="url(#bajo-adelante)"') < suyo, 'el agua de adelante le queda encima');
  assert.ok(escena.indexOf('/bestiario/bajo-agua.webp') < suyo);
  assert.ok(suyo < escena.indexOf('/bestiario/bajo-frente.webp'), 'el frente le queda detrás');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarAhogadoCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.equal(marcas(QUIETO).transform.ahogado, 'translate(0 0)');
});

test('viven solos: manotea, escupe, hace glu glu, el fantasma se infla, se da vuelta, se asoma, lo sostiene, se miran y pestañean', () => {
  const hechas: Record<Accion, number> = { manotea: 0, escupe: 0, glu: 0, infla: 0, vuelta: 0, asoma: 0, sostiene: 0, miran: 0, pique: 0 };
  let pestaneos = 0;
  let achicados = 0;
  const ruedo = new Set<string>();
  const escala = (t: string): number => Number(/scale\(1 ([\d.]+)\)/.exec(t)?.[1] ?? 0);
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarAhogadoCon(dom.marcos, esc, azar(semilla));
    let [cerrado, tapado] = [false, false];
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = escala(dom.de('parpados', 'transform'));
      if (p > 0.9 && !cerrado) pestaneos++;
      cerrado = p > 0.9;
      const a = escala(dom.de('agujeros', 'transform'));
      if (a > 0.9 && !tapado) achicados++;
      tapado = a > 0.9;
      if (i % 7 === 0) ruedo.add(dom.de('ruedo', 'transform'));
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['manotea', 'escupe', 'glu', 'infla', 'vuelta', 'asoma', 'sostiene', 'miran'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.pique, 0, 'se fueron a pique sin que los toquen');
  assert.ok(pestaneos >= 10, `el ahogado pestañeó ${pestaneos} veces`);
  assert.ok(achicados >= 8, `el fantasma achicó los agujeros ${achicados} veces`);
  assert.ok(ruedo.size > 300, 'el ruedo no flamea');
});

test('tocados se van a pique: él se hunde del todo, el fantasma hace BU y se zambulle, vuelven chorreando y dicen el verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarAhogadoCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { hondo: 0, bu: 0, inflado: 0, zambulle: 0, burbujon: 0, alga: 0, gotas: 0, accion: '', dicho: Infinity };
  for (let i = 1; i <= 60 * DURA.pique; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const [, ya] = trasladoDe(dom.de('ahogado', 'transform'));
    const [, yf] = trasladoDe(dom.de('fantasma', 'transform'));
    if (u > TOQUE_T.hunde[1] && u < TOQUE_T.salen[0]) visto.hondo = Math.max(visto.hondo, ya);
    if (u > TOQUE_T.bu[0] && u < TOQUE_T.bu[1]) {
      visto.bu = Math.max(visto.bu, Number(dom.de('boca-f', 'opacity')));
      visto.inflado = Math.max(visto.inflado, Number(/scale\(([\d.]+) /.exec(dom.de('fantasma', 'transform'))![1]));
    }
    if (u > TOQUE_T.silencio[0] && u < TOQUE_T.silencio[1]) visto.zambulle = Math.max(visto.zambulle, yf);
    visto.burbujon = Math.max(visto.burbujon, Number(dom.de('burbujon', 'opacity')));
    if (u > TOQUE_T.chorrean[0]) {
      visto.alga = Math.max(visto.alga, Number(dom.de('alga', 'opacity')));
      visto.gotas = Math.max(visto.gotas, Number(dom.de('gotas', 'opacity')));
    }
    if (i === 60 * 4) visto.accion = vivo.estado().accion ?? '';
    if (dichos.length && visto.dicho === Infinity) visto.dicho = u;
  }
  assert.ok(visto.hondo >= HONDO * 0.98, `se hundió ${visto.hondo.toFixed(0)}`);
  assert.ok(visto.bu > 0.9 && visto.inflado > 1.3, 'el fantasma no hizo BU');
  assert.ok(visto.zambulle >= ZAMBULLE * 0.98, `el fantasma se zambulló ${visto.zambulle.toFixed(0)}`);
  assert.ok(visto.burbujon > 0.9, 'no hizo el glu glu grande');
  assert.ok(visto.alga > 0.9 && visto.gotas > 0.5, 'no volvieron chorreando, con el alga');
  assert.equal(visto.accion, 'pique');
  assert.ok(visto.dicho > TOQUE_T.bu[0] - 0.1 && visto.dicho < TOQUE_T.bu[1], `dijo el verso a los ${visto.dicho.toFixed(1)} s, no con el BU`);
  // Al final volvieron los dos a su lugar.
  const [, ya] = trasladoDe(dom.de('ahogado', 'transform'));
  const [fx, fy] = trasladoDe(dom.de('fantasma', 'transform'));
  assert.ok(Math.abs(ya) < 6 && Math.abs(fx) < 8 && Math.abs(fy) < 8, `quedaron en ${ya}, y el fantasma en ${fx}, ${fy}`);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueven: tocarlos los pasa de flotando al BU, y dicen el verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarAhogadoCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('fantasma', 'transform'), marcas(BU).transform.fantasma);
  assert.equal(dom.de('boca-f', 'opacity'), '1');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('fantasma', 'transform'), marcas(QUIETO).transform.fantasma);
  assert.equal(dom.de('boca-f', 'opacity'), '0');
});
