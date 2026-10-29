import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_SAPITO, SAPITO_PERSONAJE } from './arte-sapito.ts';
import { BESO, QUIETO, SAPITO, SAPITO_ARMADO, alRecinto, coronaEn, puntaDeLengua, type Punto } from './rig-sapito.ts';
import { CYBER, COSAS_DE_CYBERSIBERIA, OJOS_DE_CYBERSIBERIA } from './rig-entornos.ts';
import { escenaCybersiberia } from './escenas-entornos.ts';
import { AGARRA, CAZA, DURA, TOQUE_T, armarSapitoCon, momentoDeLaCaza, type Accion } from '../../scripts/bestiario/sapito.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * La princesita sapito (`D-73`, vigesimocuarta vuelta): que sea un títere entero a aerógrafo, sentada en un
 * trono de nieve sin taparle los ojos a nadie, que cace el copo con la lengua de verdad, que tocada intente
 * volver a princesa y no le salga, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'la-princesita-sapito';
const figura = capasDe('cybersiberia', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_SAPITO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--sapito');
const escalaY = (t: string): number => Number(/scale\(1 ([-\d.]+)\)/.exec(t)?.[1] ?? NaN);

test('la sapita es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--sapito" data-id="la-princesita-sapito" role="button" tabindex="0" aria-label="La princesita sapito">/);
  for (const p of ['entero', 'canillas', 'canilla-1', 'canilla-2', 'pie-2', 'sapo', 'tul', 'cabeza', 'garganta', 'pupila-1', 'pupila-2', 'parpado-1', 'parpado-2', 'pestanas-1', 'pestanas-2', 'corona', 'trompa', 'lengua', 'vaho', 'brazo-1', 'brazo-2', 'copo', 'chispas', 'puf']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `a la sapita le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_SAPITO.map((p) => p.nombre).sort());
  const A = SAPITO_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro('sapito-cabeza', A.ojos[n]) && adentro(`sapito-pupila-${n + 1}`, A.ojos[n]) && adentro(`sapito-parpado-${n + 1}`, A.ojos[n]), `el ojo ${n + 1} no está en la cabeza`);
    assert.ok(adentro(`sapito-brazo-${n + 1}`, A.hombros[n]) && adentro('sapito-cuerpo', A.hombros[n]) && adentro(`sapito-brazo-${n + 1}`, A.manos[n]), `el brazo ${n + 1} no va del hombro a la mano`);
    assert.ok(adentro(`sapito-canilla-${n + 1}`, A.tobillos[n]) && adentro(`sapito-pie-${n + 1}`, A.tobillos[n]), `la canilla ${n + 1} no sale del tobillo`);
  }
  assert.ok(adentro('sapito-pie-2', A.zapato), 'el zapatito no está en el pie');
  assert.ok(adentro('sapito-cabeza', A.cuello) && adentro('sapito-cuerpo', A.cuello), 'la cabeza no se apoya en el cuerpo');
  assert.ok(adentro('sapito-cabeza', A.boca) && adentro('sapito-trompa', A.boca) && adentro('sapito-lengua', A.boca), 'la boca no está donde sale la lengua');
  assert.ok(adentro('sapito-garganta', A.garganta) && adentro('sapito-cabeza', A.garganta), 'la garganta no cuelga del mentón');
  assert.ok(adentro('sapito-corona', A.corona) && adentro('sapito-cabeza', [A.corona[0], A.corona[1] + 4]), 'la corona no está en la cabeza');
  assert.ok(adentro('sapito-tul', A.cintura) && adentro('sapito-cuerpo', A.cintura), 'el tul no está en la cintura');
  assert.ok(adentro('sapito-chispas', A.hechizo) && adentro('sapito-puf', A.hechizo), 'el hechizo no está alrededor de ella');
  assert.ok(adentro('sapito-trono', [0, 0]), 'no está sentada en el trono');
  for (const p of PIEZAS_SAPITO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['sapito-cuerpo', 'sapito-cabeza', 'sapito-trono', 'sapito-corona']) assert.match(PIEZAS_SAPITO.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_SAPITO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de la sapita están en su bloque de tokens.css, y lo que no se toca en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨la princesita sapito⟩'), tokens.indexOf('⟨/la princesita sapito⟩'));
  const usadas = new Set(PIEZAS_SAPITO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-sapito-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de la sapita`);
  assert.match(bloque, /ultimo-bondi-a-finisterre-interior-frontal\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨la princesita sapito⟩ */'), sitio.indexOf('/* ⟨/la princesita sapito⟩ */'));
  assert.match(suyo, /\.titere--sapito \{ cursor: pointer; \}/);
  for (const p of ['chispas', 'puf', 'copo', 'vaho', 'lengua']) assert.ok(suyo.includes(`"${p}"`), `${p} se puede tocar`);
});

test('se sienta en la nieve de adelante, donde estaba la silueta, sin taparle los ojos a nadie', () => {
  assert.equal(SAPITO_PERSONAJE.ancla, SAPITO.x);
  assert.deepEqual([SAPITO.x, SAPITO.piso - 26], [OJOS_DE_CYBERSIBERIA[ID]![0], OJOS_DE_CYBERSIBERIA[ID]![1]]);
  assert.ok(SAPITO.piso > CYBER.horizonte && SAPITO.piso < CYBER.puntos.y - 20, 'no está en la nieve, arriba del pasillo del pac-man');
  // Lo que ocupa parada, con el trono y las chispas.
  const [x0, y0] = alRecinto([-100, -122 - SAPITO_ARMADO.alza]);
  const [x1, y1] = alRecinto([116, 14]);
  const otros = [
    ...Object.entries(OJOS_DE_CYBERSIBERIA).filter(([id]) => id !== ID).map(([id, [x, y]]) => [id, x, y] as const),
    ...Object.entries(COSAS_DE_CYBERSIBERIA).map(([id, [x, y]]) => [id, x, y] as const),
  ];
  for (const [id, ox, oy] of otros) assert.ok(!(ox > x0 - 8 && ox < x1 + 8 && oy > y0 - 8 && oy < y1 + 8), `${id} queda adentro de la sapita`);
  // Va en la figura, delante del piso de Cybersiberia.
  const escena = escenaCybersiberia(nombres);
  assert.ok(escena.indexOf('/bestiario/cyber-piso.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso la tapa');
  // El trono se sienta donde estaba la silueta pintada (el sapo negro con su corona).
  const [sx, sy] = OJOS_DE_CYBERSIBERIA[ID]!;
  const [tx0, ty0, tw, th] = caja('sapito-trono');
  const [ax, ay] = alRecinto([tx0 + 30, ty0 + 12]);
  const [bx, by] = alRecinto([tx0 + tw - 46, ty0 + th]);
  assert.ok(ax < sx - 22 && bx > sx + 22 && ay < sy - 16 && by > sy + 18, 'el trono no cae donde estaba la silueta');
  // Y la silueta ya no está pintada en el piso de Cybersiberia: se sacó.
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8'), /at\('la-princesita-sapito'\)/, 'sigue pintada en el piso de Cybersiberia');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarSapitoCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('es sapo con modales: croa, caza, se acomoda la corona, tirita y mira el zapatito; respira y pestañea', () => {
  const hechas: Record<Accion, number> = { croa: 0, caza: 0, corona: 0, tirita: 0, zapato: 0, princesa: 0 };
  let pestaneos = 0;
  const gargantas = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarSapitoCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      gargantas.add(dom.de('garganta', 'transform'));
      const p = Math.min(escalaY(dom.de('parpado-1', 'transform')), escalaY(dom.de('parpado-2', 'transform')));
      if (p > 0.9 && !cerrado) pestaneos++;
      cerrado = p > 0.9;
      assert.equal(dom.de('puf', 'opacity'), '0', 'hizo puf sin que la toquen');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['croa', 'caza', 'corona', 'tirita', 'zapato'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.princesa, 0, 'intentó volver sin que la toquen');
  assert.ok(pestaneos >= 20 && pestaneos <= 90, `pestañeó ${pestaneos} veces`);
  assert.ok(gargantas.size > 60, 'la garganta no le late');
});

test('caza de verdad: la lengua llega al copo justo cuando cae ahí, lo trae a la boca y traga con los ojos', () => {
  const llega = momentoDeLaCaza(QUIETO, CAZA.agarra - 0.001);
  const punta = puntaDeLengua(llega.lengua);
  assert.ok(Math.hypot(punta[0] - llega.copo[0], punta[1] - llega.copo[1]) < 4, 'la lengua no llega al copo');
  assert.ok(Math.hypot(llega.copo[0] - AGARRA[0], llega.copo[1] - AGARRA[1]) < 4);
  // El copo cae desde arriba, adentro del recinto.
  const arriba = momentoDeLaCaza(QUIETO, 0.4);
  assert.ok(arriba.copo[1] < AGARRA[1] && alRecinto(arriba.copo)[1] > 0);
  assert.equal(momentoDeLaCaza(QUIETO, 0.4).lengua[1], 0, 'saca la lengua antes de tiempo');
  // Lo trae pegado a la punta, y al final está en la boca.
  const trae = momentoDeLaCaza(QUIETO, (CAZA.agarra + CAZA.mete) / 2);
  assert.deepEqual(trae.copo, puntaDeLengua(trae.lengua));
  const traga = momentoDeLaCaza(QUIETO, 2.2);
  assert.equal(traga.copoSe, 0);
  assert.equal(traga.lengua[1], 0);
  assert.ok(traga.parpados[0] > 0.8 && traga.mira[1] > 2, 'no se le hunden los ojos para tragar');
});

test('tocada intenta volver: se endereza la corona, se para, pone la trompa entre chispas, puf, y sigue siendo sapo', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarSapitoCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  let [alza, trompa, chispas, puf, ojosCerrados] = [0, 0, 0, 0, 0];
  let derecha = false;
  let caida = false;
  for (let i = 1; i < 60 * DURA.princesa; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const u = t - 1;
    alza = Math.max(alza, -trasladoDe(dom.de('sapo', 'transform'))[1] / SAPITO_ARMADO.alza);
    trompa = Math.max(trompa, Number(dom.de('trompa', 'opacity')));
    chispas = Math.max(chispas, Number(dom.de('chispas', 'opacity')));
    puf = Math.max(puf, Number(dom.de('puf', 'opacity')));
    if (u > TOQUE_T.espera[0] && u < TOQUE_T.espera[1]) ojosCerrados = Math.max(ojosCerrados, escalaY(dom.de('parpado-1', 'transform')));
    if (u > 1 && u < 3 && /rotate\(0 /.test(dom.de('corona', 'transform'))) derecha = true;
    if (u > TOQUE_T.sigue[0] && u < TOQUE_T.sigue[1] && /rotate\(-44 /.test(dom.de('corona', 'transform'))) caida = true;
  }
  assert.ok(derecha, 'no se enderezó la corona');
  assert.ok(alza > 0.99, 'no se paró');
  assert.ok(ojosCerrados > 0.99, 'no cerró los ojos para el beso');
  assert.ok(trompa > 0.99 && chispas > 0.99, 'no puso la trompa entre las chispas');
  assert.ok(puf > 0.99, 'no hizo puf');
  assert.ok(caida, 'la corona no se le cayó sobre el ojo');
  assert.equal(vivo.estado().accion, 'princesa');
  // Al final está sentada otra vez, con la corona torcida de siempre: sigue siendo sapo.
  const fin = 1 + DURA.princesa - 0.01;
  poner(fin);
  vivo.mover(fin, 1 / 60);
  assert.ok(Math.abs(trasladoDe(dom.de('sapo', 'transform'))[1]) < 0.5, 'no se volvió a sentar');
  assert.equal(dom.de('puf', 'opacity'), '0');
  assert.equal(coronaEn(QUIETO).ang, QUIETO.corona);
  assert.match(dom.de('corona', 'transform'), new RegExp(`rotate\\(${QUIETO.corona} `));
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarla la pasa del trono a la pose del beso y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarSapitoCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('trompa', 'opacity'), String(BESO.trompa));
  assert.equal(dom.de('chispas', 'opacity'), String(BESO.chispas));
  assert.equal(dom.de('canillas', 'opacity'), '1');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('trompa', 'opacity'), String(QUIETO.trompa));
  assert.deepEqual(dom.foto(), antes);
});
