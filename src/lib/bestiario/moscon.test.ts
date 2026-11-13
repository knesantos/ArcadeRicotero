import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { MOSCON_PERSONAJE, PIEZAS_MOSCON } from './arte-moscon.ts';
import { GOLPEA, MOSCON, MOSCON_ARMADO, QUIETO, VASO, adentroDelVaso, alRecinto, marcas, type Punto } from './rig-moscon.ts';
import { COSAS_DE_LA_MESA, MESA, OJOS_DE_LA_MESA } from './rig-entornos.ts';
import { escenaMesa } from './escenas-entornos.ts';
import { DURA, TOQUE_T, armarMosconCon, type Accion } from '../../scripts/bestiario/moscon.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El moscón zumbón (`D-73`, vigesimosexta vuelta): que sea un títere entero a aerógrafo adentro de un vaso boca
 * abajo en la punta de la mesa, donde el piso pintaba el vaso, que no se salga nunca del vidrio, que tocado se
 * vuelva loco y le pegue al vaso, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-moscon-zumbon';
const figura = capasDe('la-mesa', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_MOSCON.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--moscon');

test('el moscón es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--moscon" data-id="el-moscon-zumbon" role="button" tabindex="0" aria-label="El moscón zumbón">/);
  for (const p of ['entero', 'vaso', 'mosca', 'patas-1', 'abdomen', 'alas', 'ala-1', 'ala-2', 'cabeza', 'patas-2', 'estrellas', 'vaho', 'rayones']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al moscón le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_MOSCON.map((p) => p.nombre).sort());
  // Ninguna pieza suya se confunde con las de la mosca de la mesa.
  for (const p of PIEZAS_MOSCON) assert.match(p.nombre, /^moscon-/);
  const A = MOSCON_ARMADO;
  assert.ok(adentro('moscon-ala-1', A.alas) && adentro('moscon-ala-2', A.alas) && adentro('moscon-torax', A.alas), 'las alas no salen del tórax');
  assert.ok(adentro('moscon-cabeza', A.cuello) && adentro('moscon-torax', A.cuello), 'la cabeza no se apoya en el cuello');
  for (const o of A.ojos) assert.ok(adentro('moscon-cabeza', o.centro), 'un ojo no está en la cabeza');
  assert.ok(adentro('moscon-cabeza', A.trompa), 'la trompa no está en la cabeza');
  assert.ok(adentro('moscon-patas-2', A.patasDel) && adentro('moscon-torax', A.patasDel), 'las patas de adelante no salen del tórax');
  assert.ok(adentro('moscon-abdomen', A.centro) && adentro('moscon-torax', A.centro), 'el centro no está en el cuerpo');
  // El vaso tapa al moscón entero: lo de adentro se recorta con el vidrio.
  assert.match(figura, /<clipPath id="moscon-vidrio"><path d="M/);
  assert.ok(!MOSCON_PERSONAJE.retrato!.cuerpo().includes('id="moscon-vidrio"'), 'el retrato repite el id del recorte');
  for (const p of PIEZAS_MOSCON) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['moscon-vaso', 'moscon-abdomen', 'moscon-torax', 'moscon-cabeza']) assert.match(PIEZAS_MOSCON.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_MOSCON.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 12 && peso <= 160, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del moscón están en su bloque de tokens.css, medidas en Luzbelito, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el moscon zumbon⟩'), tokens.indexOf('⟨/el moscon zumbon⟩'));
  const usadas = new Set(PIEZAS_MOSCON.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-moscon-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 14);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del moscón`);
  assert.match(bloque, /luzbelito-frontal/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el moscon zumbon⟩ */'), sitio.indexOf('/* ⟨/el moscon zumbon⟩ */'));
  assert.match(suyo, /\.titere--moscon \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"estrellas"'), 'las estrellitas se pueden tocar');
});

test('el vaso está donde el piso lo pintaba, en la punta de la mesa, y el moscón no se sale nunca del vidrio', () => {
  assert.equal(MOSCON_PERSONAJE.ancla, MOSCON.x);
  assert.deepEqual([MOSCON.x, MOSCON.piso], [MESA.vaso.x, MESA.vaso.piso]);
  const [cx, cy] = COSAS_DE_LA_MESA[ID]!;
  const [vx, vy] = alRecinto([0, -VASO.alto / 2]);
  assert.ok(Math.hypot(vx - cx, vy - cy) < 20, `el vaso quedó en ${vx.toFixed(0)}, ${vy.toFixed(0)}`);
  // Entra en la mesa: entre el mantel y el canto de adelante, sin pisar a las hormigas ni a la tipa rapaz.
  assert.ok(MOSCON.piso > MESA.tablero.atras && MOSCON.piso <= MESA.tablero.adelante, 'el vaso no está apoyado en la mesa');
  const [x0] = alRecinto([-VASO.boca, 0]);
  const [x1] = alRecinto([VASO.boca, 0]);
  const [hx, , hr] = COSAS_DE_LA_MESA['las-hormigas']!;
  assert.ok(hx + hr < x0, 'las hormigas quedan debajo del vaso');
  assert.ok(OJOS_DE_LA_MESA['la-tipa-rapaz']![1] < alRecinto([0, -VASO.alto])[1], 'la tipa queda detrás del vaso');
  assert.ok(x1 < MESA.tablero.der, 'el vaso se cae de la mesa');
  // Lo que se pase del vidrio se frena.
  const T = MOSCON_ARMADO.tope;
  assert.deepEqual(adentroDelVaso([0, 0]), [0, 0]);
  assert.deepEqual(adentroDelVaso([200, 10]), [T.x, 0]);
  const [, arriba] = adentroDelVaso([0, -500]);
  assert.equal(arriba, T.arriba);
  assert.ok(adentroDelVaso([200, T.arriba])[0] < T.x, 'arriba el vaso no se angosta');
  // El piso de la mesa ya no pinta el vaso: va en la figura, después del piso y antes de lo de adelante.
  const escena = escenaMesa(nombres);
  assert.ok(escena.indexOf('/bestiario/mesa-piso.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso le queda delante');
  assert.ok(!escena.includes(`bestia--cosa" data-id="${ID}"`), 'sigue siendo una cosa pintada');
  const piso = readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8');
  assert.ok(!/MESA\.vaso\.x\)/.test(piso), 'el piso de la mesa sigue pintando el vaso');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarMosconCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.equal(marcas(QUIETO).transform.vaso, 'translate(0 0)');
});

test('no se rinde: camina, trepa, zumba y se da contra el vaso, se frota las patas, y nunca sale del vidrio', () => {
  const hechas: Record<Accion, number> = { camina: 0, trepa: 0, golpea: 0, frota: 0, loco: 0 };
  const T = MOSCON_ARMADO.tope;
  let golpes = 0;
  const alas = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarMosconCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const [x, y] = trasladoDe(dom.de('mosca', 'transform'));
      assert.ok(Math.abs(x) <= T.x + 0.01 && y <= 0.01 && y >= T.arriba - 0.01, `se salió del vaso: ${x.toFixed(0)}, ${y.toFixed(0)}`);
      const [tx] = trasladoDe(dom.de('vaso', 'transform'));
      if (Math.abs(tx) > 1.5) golpes++;
      if (i % 5 === 0) alas.add(dom.de('ala-1', 'transform'));
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['camina', 'trepa', 'golpea', 'frota'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.loco, 0, 'se volvió loco sin que lo toquen');
  assert.ok(golpes > 10, 'el vaso nunca tembló');
  assert.ok(alas.size > 60, 'las alas se quedan quietas');
});

test('tocado se vuelve loco: zumba en redondo, le pega al vaso, el vidrio se empaña, cae de espaldas, patalea, se da vuelta y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarMosconCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const T = MOSCON_ARMADO.tope;
  const visto = { alto: 0, lados: 0, tiembla: 0, corre: 0, vaho: 0, panza: 0, patalea: 0, accion: '' };
  let ladoAnterior = 0;
  for (let i = 1; i <= 60 * DURA.loco; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const [x, y] = trasladoDe(dom.de('mosca', 'transform'));
    assert.ok(Math.abs(x) <= T.x + 0.01 && y <= 0.01 && y >= T.arriba - 0.01, `se salió del vaso: ${x.toFixed(0)}, ${y.toFixed(0)}`);
    visto.alto = Math.min(visto.alto, y);
    if (u > TOQUE_T.vuela[0] && u < TOQUE_T.vuela[1]) {
      const lado = Math.sign(x);
      if (lado && lado !== ladoAnterior) visto.lados++;
      ladoAnterior = lado;
    }
    const [tx] = trasladoDe(dom.de('vaso', 'transform'));
    visto.tiembla = Math.max(visto.tiembla, Math.abs(tx));
    visto.vaho = Math.max(visto.vaho, Number(dom.de('vaho', 'opacity')));
    const p = /rotate\(([\d.]+) /.exec(dom.de('mosca', 'transform').split('scale')[1] ?? '');
    if (p) visto.panza = Math.max(visto.panza, Number(p[1]));
    if (u > TOQUE_T.patalea[0] && u < TOQUE_T.patalea[1]) {
      const r = /rotate\((-?[\d.]+)/.exec(dom.de('patas-2', 'transform'));
      visto.patalea = Math.max(visto.patalea, r ? Math.abs(Number(r[1])) : 0);
    }
    if (i === 60 * 3) visto.accion = vivo.estado().accion ?? '';
  }
  assert.ok(visto.alto < T.arriba * 0.8, `no subió más que ${visto.alto.toFixed(0)}`);
  assert.ok(visto.lados >= 6, `cruzó el vaso ${visto.lados} veces`);
  assert.ok(visto.tiembla > 3, 'el vaso no tembló');
  assert.ok(visto.vaho > 0.85, 'el vidrio no se empañó');
  assert.ok(visto.panza > 170, 'no cayó de espaldas');
  assert.ok(visto.patalea > 10, 'no pataleó');
  assert.equal(visto.accion, 'loco');
  // Al final está parado otra vez en el mantel.
  const [, y] = trasladoDe(dom.de('mosca', 'transform'));
  assert.ok(Math.abs(y) < 1, `quedó a ${y.toFixed(0)} del mantel`);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa del mantel al culo del vaso, zumbando, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarMosconCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('mosca', 'transform'), marcas(GOLPEA).transform.mosca);
  assert.equal(dom.de('vaho', 'opacity'), '0.9');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('mosca', 'transform'), marcas(QUIETO).transform.mosca);
});
