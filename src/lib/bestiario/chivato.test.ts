import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_CHIVATO } from './arte-chivato.ts';
import { A_LA_OREJA, CANTA, CHIVATO, CHIVATO_ARMADO, ESCRIBE, QUIETO, alRecinto, enVuelo, manoDelLapiz, type Punto } from './rig-chivato.ts';
import { BARBAZUL } from './rig.ts';
import { CELDAS_DE_LAS_ALAS } from './arte-prision.ts';
import { VECINOS_DE_LA_PRISION, escenaPrision } from './escenas.ts';
import { rot } from './trazos.ts';
import { CANTA_T, DURA, armarChivatoCon, type Accion } from '../../scripts/bestiario/chivato.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * El chivato (`D-73`, vigesimotercera vuelta): que sea un títere entero a aerógrafo, con la oreja pegada a la
 * reja de la celda del ala de la izquierda sin pisar a Barbazul ni a los ojos de los demás, que tocado cante,
 * se le vuele la hoja adentro de la celda y vuelva a espiar, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-chivato';
const figura = capasDe('la-prision', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_CHIVATO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--chivato');

test('el chivato es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--chivato" data-id="el-chivato" role="button" tabindex="0" aria-label="El chivato">/);
  for (const p of ['entero', 'agacha', 'faldones', 'pierna-1', 'pierna-2', 'torso', 'cabeza', 'oreja-1', 'oreja-2', 'lapiz-oreja', 'pupilas', 'cejas', 'parpado', 'boca', 'quijada', 'bocado', 'galera', 'gota', 'balido', 'brazo-1', 'brazo-2', 'lapiz-mano', 'hoja']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al chivato le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_CHIVATO.map((p) => p.nombre).sort());
  const A = CHIVATO_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`chivato-brazo-${n + 1}`, A.hombros[n]) && adentro('chivato-cuerpo', A.hombros[n]), `el brazo ${n + 1} no sale del hombro`);
    assert.ok(adentro(`chivato-brazo-${n + 1}`, A.manos[n]), `la mano ${n + 1} se sale de su brazo`);
    assert.ok(adentro(`chivato-pierna-${n + 1}`, A.caderas[n]) && adentro('chivato-cuerpo', A.caderas[n]), `la pierna ${n + 1} no sale de la cadera`);
    assert.ok(adentro(`chivato-pierna-${n + 1}`, A.pezunas[n]), `la pezuña ${n + 1} se sale de su pierna`);
    assert.ok(adentro(`chivato-oreja-${n + 1}`, A.orejas[n]) && adentro('chivato-cabeza', A.orejas[n]), `la oreja ${n + 1} no sale de la cabeza`);
    assert.ok(adentro('chivato-cabeza', A.ojos[n]) && adentro('chivato-pupilas', A.ojos[n]) && adentro('chivato-cejas', A.ojos[n]) && adentro('chivato-parpados', A.ojos[n]), `el ojo ${n + 1} no está en la cara`);
  }
  assert.ok(adentro('chivato-cabeza', A.cuello) && adentro('chivato-cuerpo', A.cuello), 'la cabeza no se apoya en el cogote');
  assert.ok(adentro('chivato-cuerpo', A.cintura) && adentro('chivato-faldones', A.faldones), 'el torso no se dobla en la cintura');
  assert.ok(adentro('chivato-brazo-1', A.libreta) && adentro('chivato-hoja', A.libreta), 'la libreta no está en la mano');
  assert.ok(adentro('chivato-oreja-2', A.lapiz) && adentro('chivato-lapiz-oreja', A.lapiz), 'el lápiz no está atrás de la oreja');
  assert.ok(adentro('chivato-lapiz-mano', A.manos[1]), 'el lápiz de escribir no está en la mano');
  assert.ok(adentro('chivato-boca', A.boca) && adentro('chivato-quijada', A.boca) && adentro('chivato-cabeza', A.boca), 'la boca no está en la cara');
  assert.ok(adentro('chivato-galera', A.galera) && adentro('chivato-cabeza', A.galera), 'la galera no apoya entre los cuernos');
  for (const p of PIEZAS_CHIVATO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['chivato-cuerpo', 'chivato-cabeza', 'chivato-galera', 'chivato-brazo-1']) assert.match(PIEZAS_CHIVATO.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_CHIVATO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del chivato están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el chivato⟩'), tokens.indexOf('⟨/el chivato⟩'));
  const usadas = new Set(PIEZAS_CHIVATO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-chivato-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 14);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del chivato`);
  assert.match(bloque, /momo-sampler/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el chivato⟩ */'), sitio.indexOf('/* ⟨/el chivato⟩ */'));
  assert.ok(suyo.includes('.titere--chivato { cursor: pointer; }'));
  for (const clase of new Set([...figura.matchAll(/class="(bt-chivato-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('pega la oreja a la reja de la celda del ala, a la izquierda de Barbazul, sin tapar los ojos de nadie', () => {
  const A = CHIVATO_ARMADO;
  // La punta de la oreja de la reja, en la pose quieta: cabeza y torso girados.
  const [ox, oy] = A.orejas[0];
  const punta = rot(rot(rot([ox - 34, oy + 1], A.orejas[0], QUIETO.orejas[0]), A.cuello, QUIETO.cabeza), A.cintura, QUIETO.inclina);
  const [px] = alRecinto(punta);
  const reja = [250 * CELDAS_DE_LAS_ALAS.u0, 250 * CELDAS_DE_LAS_ALAS.u1];
  assert.ok(px > reja[0]! && px < reja[1]! + 4, `la oreja queda en ${px.toFixed(0)}, lejos de la reja`);
  // Lo que ocupa, en el recinto.
  const [x0, y0] = alRecinto([-46, -250]);
  const [x1] = alRecinto([46, 0]);
  assert.ok(x1 < BARBAZUL.x - 90 * BARBAZUL.escala, 'el chivato se le mete a Barbazul');
  for (const [id, [ex, ey]] of Object.entries(VECINOS_DE_LA_PRISION)) {
    if (id === ID) continue;
    assert.ok(!(ex > x0 - 10 && ex < x1 + 10 && ey > y0 - 10 && ey < CHIVATO.piso + 4), `${id} queda adentro del chivato`);
  }
  // La hoja que se vuela cae adentro de la celda, arriba de la reja, y no se sale del recinto.
  const [hx, hy] = alRecinto([enVuelo(1).x, enVuelo(1).y]);
  assert.ok(hx > -250 && hx < reja[1]! && hy > 0 && hy < CHIVATO.piso, `la hoja cae en ${hx.toFixed(0)}, ${hy.toFixed(0)}`);
  // Va en la figura: delante de la reja y detrás de la columna de adelante.
  const escena = escenaPrision(nombres);
  assert.ok(escena.indexOf('/bestiario/prision-lejos.webp') < escena.indexOf(`data-marco="${ID}"`), 'la reja le tapa la oreja');
  assert.ok(escena.indexOf(`data-marco="${ID}"`) < escena.indexOf('/bestiario/prision-columna.webp'), 'la columna no le queda delante');
});

test('el lápiz llega de la oreja a la libreta', () => {
  const A = CHIVATO_ARMADO;
  const [ax, ay] = manoDelLapiz(A_LA_OREJA);
  assert.ok(Math.hypot(ax - A.lapiz[0], ay - A.lapiz[1]) < 18, `la mano queda a ${Math.hypot(ax - A.lapiz[0], ay - A.lapiz[1]).toFixed(0)} del lápiz`);
  const [bx, by] = manoDelLapiz(ESCRIBE);
  assert.ok(Math.hypot(bx - A.libreta[0], by - A.libreta[1]) < 16, `la mano queda a ${Math.hypot(bx - A.libreta[0], by - A.libreta[1]).toFixed(0)} de la libreta`);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarChivatoCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive buchoneando: escucha, anota, mastica la hoja, se hace el distraído y pestañea, sin repetir', () => {
  const hechas: Record<Accion, number> = { escucha: 0, anota: 0, mastica: 0, distraido: 0, canta: 0 };
  let pestaneos = 0;
  let lapices = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarChivatoCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    let antes: Accion | null = null;
    let enMano = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = Number(dom.de('parpado', 'opacity'));
      if (p > 0.9 && !cerrado) pestaneos++;
      cerrado = p > 0.9;
      const a = vivo.estado().accion;
      if (a && a !== antes) assert.notEqual(a, antes, 'repitió la misma acción');
      if (a) antes = a;
      const mano = dom.de('lapiz-mano', 'opacity') === '1';
      if (mano && !enMano) lapices++;
      enMano = mano;
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['escucha', 'anota', 'mastica', 'distraido'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.canta, 0, 'cantó sin que lo toquen');
  assert.ok(pestaneos >= 10, `pestañeó ${pestaneos} veces`);
  assert.ok(lapices > 0, 'nunca sacó el lápiz de la oreja');
});

test('tocado canta: bala con la boca abierta, se le vuela la hoja, se encoge, vuelve a la reja y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarChivatoCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  let balido = 0;
  let hoja = 0;
  let gota = 0;
  const hojas = new Set<string>();
  let encogido = 1;
  for (let i = 1; i <= 60 * DURA.canta; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    balido = Math.max(balido, Number(dom.de('balido', 'opacity')));
    hoja = Math.max(hoja, Number(dom.de('hoja', 'opacity')));
    gota = Math.max(gota, Number(dom.de('gota', 'opacity')));
    if (t - 1 > CANTA_T.vuela[0] && t - 1 < CANTA_T.vuela[1]) hojas.add(dom.de('hoja', 'transform'));
    const s = /scale\([-\d.]+ ([-\d.]+)\)/.exec(dom.de('agacha', 'transform'));
    if (s) encogido = Math.min(encogido, Number(s[1]));
  }
  assert.ok(balido > 0.9, 'no baló');
  assert.ok(hoja > 0.9 && hojas.size > 60, 'no se le voló la hoja');
  assert.ok(gota > 0.9, 'no sudó');
  assert.ok(encogido < 0.9, 'no se encogió');
  assert.equal(vivo.estado().accion, 'canta');
  // Al final la hoja ya no está y volvió a pegar la oreja.
  assert.equal(dom.de('hoja', 'opacity'), '0');
  const inclina = /rotate\(([-\d.]+)/.exec(dom.de('torso', 'transform'))!;
  assert.ok(Math.abs(Number(inclina[1]) - QUIETO.inclina) < 1.5, 'no volvió a la reja');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de espiar a cantar y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarChivatoCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('balido', 'opacity'), String(CANTA.balido));
  assert.equal(dom.de('hoja', 'opacity'), '1');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('balido', 'opacity'), String(QUIETO.balido));
  assert.deepEqual(dom.foto(), antes);
});
