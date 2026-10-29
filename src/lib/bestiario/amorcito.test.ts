import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_AMORCITO } from './arte-amorcito.ts';
import { AMORCITO, AMORCITO_ARMADO, NAM, QUIETO, VENTANA, alRecinto, type Punto } from './rig-amorcito.ts';
import { VECINOS_DEL_BAJO, escenaBajo } from './escenas.ts';
import { BAJO } from './rig.ts';
import { DURA, MUERDE_T, armarAmorcitoCon, type Accion } from '../../scripts/bestiario/amorcito.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * El amorcito que mordió el vidrio (`D-73`, vigesimosegunda vuelta): que sea un títere entero a aerógrafo,
 * colgada del marco de su ventana rota sin taparle nada a nadie, que tocada muerda el vidrio, que salte en
 * migas, que aparezca el ¡Ñam! y que cabalgue, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-amorcito-que-mordio-el-vidrio';
const atras = capasDe('el-bajo', 'atras', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_AMORCITO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([atras], 'titere--amorcito');

test('el amorcito es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(atras, /<g class="titere titere--amorcito" data-id="el-amorcito-que-mordio-el-vidrio" role="button" tabindex="0" aria-label="El amorcito que mordió el vidrio">/);
  for (const p of ['entero', 'torso', 'cabeza', 'colorado', 'parpado', 'boca', 'vidrio', 'migas', 'hipo', 'brazos', 'brazo-1', 'brazo-2', 'chorro', 'nam']) assert.ok(atras.includes(`data-parte="${p}"`), `al amorcito le falta ${p}`);
  const imagenes = new Set([...atras.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_AMORCITO.map((p) => p.nombre).sort());
  const A = AMORCITO_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`amorcito-brazo-${n + 1}`, A.hombros[n]) && adentro('amorcito-torso', A.hombros[n]), `el brazo ${n + 1} no sale del hombro`);
    assert.ok(adentro(`amorcito-brazo-${n + 1}`, A.codos[n]) && adentro('amorcito-marco', A.codos[n]), `el codo ${n + 1} no se apoya en el marco`);
    assert.ok(adentro(`amorcito-brazo-${n + 1}`, A.manos[n]), `la mano ${n + 1} se sale de su brazo`);
    assert.ok(adentro('amorcito-cara', A.ojos[n]) && adentro('amorcito-parpados', A.ojos[n]), `el ojo ${n + 1} no está en la cara`);
  }
  assert.ok(adentro('amorcito-sifon', A.manos[1]) && adentro('amorcito-sifon', A.pico) && adentro('amorcito-chorro', A.pico), 'el sifón no está en la mano');
  for (const p of ['amorcito-boca', 'amorcito-vidrio', 'amorcito-migas', 'amorcito-cara']) assert.ok(adentro(p, A.boca), `${p} no está en la boca`);
  assert.ok(adentro('amorcito-torso', A.cintura) && adentro('amorcito-marco', A.cintura), 'no se apoya en el marco');
  for (const p of PIEZAS_AMORCITO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['amorcito-torso', 'amorcito-cara', 'amorcito-pelo']) assert.match(PIEZAS_AMORCITO.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_AMORCITO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 15 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del amorcito están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el amorcito que mordio el vidrio⟩'), tokens.indexOf('⟨/el amorcito que mordio el vidrio⟩'));
  const usadas = new Set(PIEZAS_AMORCITO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-amorcito-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 10);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del amorcito`);
  assert.match(bloque, /gulp\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  assert.ok(sitio.includes('/* ⟨el amorcito que mordio el vidrio⟩ */') && sitio.includes('.titere--amorcito'));
});

test('se cuelga de su ventana rota, arriba del agua, sin taparle nada a nadie, y detrás de Pierre', () => {
  assert.equal(AMORCITO.alfeizar, VENTANA.abajo);
  assert.ok(AMORCITO.x > VENTANA.x0 && AMORCITO.x < VENTANA.x1, 'no está en la ventana');
  const [x0, y0] = alRecinto([-56, -150]);
  const [x1, y1] = alRecinto([56, 100]);
  assert.ok(y1 < BAJO.fondo, 'el sifón se mete en el agua');
  assert.ok(y0 > 0, 'la cabeza se sale por arriba');
  for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_BAJO)) {
    if (id === ID) continue;
    assert.ok(!(ox > x0 - 12 && ox < x1 + 12 && oy > y0 - 12 && oy < y1 + 12), `${id} queda adentro del amorcito`);
  }
  const escena = escenaBajo(nombres);
  assert.ok(escena.indexOf(`data-marco="${ID}"`) < escena.indexOf('data-id="el-gordo-pierre"'), 'le tapa algo a Pierre');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarAmorcitoCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive borracha: se mece, tiene hipo, se tira soda, dormita y saluda', () => {
  const hechas: Record<Accion, number> = { mece: 0, hipo: 0, soda: 0, dormita: 0, saluda: 0, muerde: 0 };
  let burbujas = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarAmorcitoCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      burbujas = Math.max(burbujas, Number(dom.de('hipo', 'opacity')));
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['mece', 'hipo', 'soda', 'dormita', 'saluda'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.muerde, 0, 'mordió sin que la toquen');
  assert.ok(burbujas > 0.9, 'el hipo no saca burbuja');
});

test('tocada muerde alocada: el vidrio en migas, el ¡Ñam!, cabalga con el chorro, y al final tiene otro vidrio', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarAmorcitoCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  let nam = 0;
  let migas = 0;
  let chorro = 0;
  let sinVidrio = false;
  const rebotes = new Set<string>();
  for (let i = 1; i <= 60 * DURA.muerde; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    nam = Math.max(nam, Number(dom.de('nam', 'opacity')));
    migas = Math.max(migas, Number(dom.de('migas', 'opacity')));
    chorro = Math.max(chorro, Number(dom.de('chorro', 'opacity')));
    if (t - 1 > MUERDE_T.cierra + 0.1 && t - 1 < MUERDE_T.vidrio[0]) sinVidrio ||= dom.de('vidrio', 'opacity') === '0';
    if (t - 1 > MUERDE_T.cabalga[0] + 0.3 && t - 1 < MUERDE_T.cabalga[1] - 0.4) rebotes.add(dom.de('torso', 'transform'));
  }
  assert.ok(nam > 0.95, 'no apareció el ¡Ñam!');
  assert.ok(migas > 0.3, 'el vidrio no saltó en migas');
  assert.ok(sinVidrio, 'el vidrio no se fue');
  assert.ok(chorro > 0.9, 'no revoleó el sifón');
  assert.ok(rebotes.size > 60, 'no cabalgó');
  assert.equal(dom.de('vidrio', 'opacity'), '1', 'al final no tiene otro vidrio');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarla la pasa de colgada al ¡Ñam! y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarAmorcitoCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('nam', 'opacity'), String(NAM.nam));
  assert.equal(dom.de('vidrio', 'opacity'), String(NAM.vidrio));
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('vidrio', 'opacity'), String(QUIETO.vidrio));
});
