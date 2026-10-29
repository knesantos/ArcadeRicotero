import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_REY, RETRATO, REY_PERSONAJE } from './arte-rey.ts';
import { ASOMA, QUIETO, REY, REY_ARMADO, RUEDA_LEJOS, SUBE, VERSO, alRecinto, cumbre, marcas, puntaDe, type Punto } from './rig-rey.ts';
import { VECINOS_DEL_MONTE, escenaMonte } from './escena-monte.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { DURA, TOQUE_T, armarReyCon, type Accion } from '../../scripts/bestiario/rey.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El rey de esta jungla (`D-73`, vigesimoquinta vuelta): que sea una tumba entera a aerógrafo en la ladera del
 * monte, arriba del borde del piso y sin taparle los ojos a nadie, con el león asomado hasta los ojos donde
 * estaban sus ojos en lo oscuro; que solo mire crecer las flores sin un bucle, que tocado asome, ruja, crezcan
 * las flores, ruede el patín y se vuelva a hundir, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; tema?: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-rey-de-esta-jungla';
const figura = capasDe('el-monte', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_REY.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--rey');
/** Lo que asoma la cabeza, leído de su `translate`: 0 enterrado, `SUBE` asomado del todo. */
const asoma = (dom: ReturnType<typeof nuevo>): number => 0 - trasladoDe(dom.de('cabeza', 'transform'))[1];
const escalaDe = (t: string): number => Number(/scale\(([-\d.]+)\)/.exec(t)?.[1] ?? NaN);

test('el rey es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--rey" data-id="el-rey-de-esta-jungla" role="button" tabindex="0" aria-label="El rey de esta jungla">/);
  const partes = ['entero', 'cruz', 'cabeza', 'boca', 'quijada', 'pupilas', 'parpado', 'tierra', 'grietas', 'bicho', 'terrones', 'petalo', 'corona', 'patin', 'rueda-1', 'rueda-2'];
  for (const n of [1, 2, 3, 4]) partes.push(`flor-${n}`, `capullo-${n}`, `corola-${n}`);
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `al rey le falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_REY.map((p) => p.nombre).sort());
  for (const p of PIEZAS_REY) assert.match(p.nombre, /^rey-/);
  const A = REY_ARMADO;
  for (const o of A.ojos) assert.ok(adentro('rey-cara', o) && adentro('rey-pupilas', o) && adentro('rey-parpado', o), 'el ojo no está en la cara');
  assert.ok(adentro('rey-melena', A.cabeza) && adentro('rey-cara', A.cabeza), 'la cabeza no gira de su medio');
  assert.ok(adentro('rey-quijada', A.quijada) && adentro('rey-boca', A.quijada) && adentro('rey-cara', A.quijada), 'la quijada no baja de la boca');
  assert.ok(adentro('rey-cruz', A.cruz) && adentro('rey-tierra', A.cruz), 'la cruz no está clavada en la tierra');
  assert.ok(adentro('rey-corona', A.corona) && adentro('rey-tierra', A.corona), 'la corona no está al pie de la cruz');
  for (const [n, f] of A.flores.entries()) {
    assert.ok(adentro(`rey-tallo-${n + 1}`, f.base) && adentro('rey-tierra', f.base), `la flor ${n + 1} no sale de la tierra`);
    for (const pz of ['tallo', 'capullo', 'corola']) assert.ok(adentro(`rey-${pz}-${n + 1}`, puntaDe(n)), `la ${pz} ${n + 1} no está en la punta del tallo`);
    assert.ok(Math.abs(f.base[1] - cumbre(f.base[0])) < 4, `la flor ${n + 1} no está en la loma`);
  }
  for (const [n, r] of A.ruedas.entries()) assert.ok(adentro(`rey-rueda-${n + 1}`, r) && adentro('rey-patin', r), `la rueda ${n + 1} no está en el patín`);
  assert.ok(adentro('rey-bicho', A.bicho) && adentro('rey-petalo', puntaDe(0)), 'el escarabajo o el pétalo están en el aire');
  // A ras de tierra quedan los ojos: la tierra tapa la nariz y no las pupilas.
  assert.ok(cumbre(0) > A.ojos[0][1] + 4 && cumbre(0) < -86, 'la tierra no le llega a los ojos');
  for (const p of PIEZAS_REY) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['rey-tierra', 'rey-melena', 'rey-cara', 'rey-cruz', 'rey-patin']) assert.match(PIEZAS_REY.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/, `${n} no tiene grano`);
  for (const n of ['rey-tierra', 'rey-melena', 'rey-cara']) assert.match(PIEZAS_REY.find((p) => p.nombre === n)!.dibujo, /url\(#soplo-[ml]\)/, `${n} no está soplada`);
  const peso = PIEZAS_REY.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del rey están en su bloque de tokens.css, medidas en Lobo suelto, cordero atado, y sus reglas en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el rey de esta jungla⟩'), tokens.indexOf('⟨/el rey de esta jungla⟩'));
  const usadas = new Set(PIEZAS_REY.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-rey-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12 && usadas.size <= 20, `usa ${usadas.size} tintas`);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del rey`);
  assert.match(bloque, /lobo-suelto-cordero-atado-cd2-frontal/);
  assert.equal(datos.bestias.find((b) => b.id === ID)!.tema, 'etiqueta-negra');
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el rey de esta jungla⟩ */'), sitio.indexOf('/* ⟨/el rey de esta jungla⟩ */'));
  assert.match(suyo, /\.titere--rey \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"terrones"') && suyo.includes('"petalo"'), 'los terrones o el pétalo se pueden tocar');
});

test('está en la ladera, entre las tiras, con los ojos donde estaban: nada baja del borde del piso ni tapa ojos ajenos', () => {
  assert.equal(REY_PERSONAJE.ancla, REY.x);
  // Los ojos del rey en lo oscuro eran estos: el títere los deja en el mismo lugar, en el medio de los dos.
  const [ox, oy] = VECINOS_DEL_MONTE[ID]!;
  const [a, b] = REY_ARMADO.ojos.map(alRecinto);
  const [ex, ey] = [(a![0] + b![0]) / 2, (a![1] + b![1]) / 2];
  assert.ok(Math.hypot(ex - ox, ey - oy) < 6, `los ojos quedaron en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  // Nada suyo baja del borde del piso: ninguna pieza, ni el patín cuando rueda.
  for (const p of PIEZAS_REY) {
    const [, y, , h] = p.caja;
    assert.ok(alRecinto([0, y + h])[1] <= 296, `${p.nombre} baja hasta ${alRecinto([0, y + h])[1].toFixed(0)}`);
  }
  // Lo que ocupa, de la punta de la cruz a la llave del patín rodando, y de lo más alto de la melena asomada al pie.
  const xs = PIEZAS_REY.flatMap((p) => [p.caja[0], p.caja[0] + p.caja[2] + (p.nombre.startsWith('rey-patin') || p.nombre.startsWith('rey-rueda') ? RUEDA_LEJOS : 0)]);
  const [x0] = alRecinto([Math.min(...xs), 0]);
  const [x1] = alRecinto([Math.max(...xs), 0]);
  const [, y0] = alRecinto([0, Math.min(...PIEZAS_REY.map((p) => p.caja[1])) - SUBE]);
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_MONTE)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 - 8 && vx < x1 + 8 && vy > y0 - 8 && vy < 300), `${id} queda adentro de la tumba`);
  }
  assert.ok(x0 > 0 && x1 < 900, 'la tumba se sale del monte');
});

test('en la escena va en la figura después del piso del monte, y en el camino va corrido adonde estaban sus ojos', () => {
  const escena = escenaMonte(nombres);
  assert.ok(escena.includes(`data-marco="${ID}"`));
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos en lo oscuro');
  assert.ok(escena.indexOf('/bestiario/monte-cerca.webp') < escena.indexOf(`data-marco="${ID}" data-capa="figura"`), 'el piso del monte le queda delante');
  const tramo = CAMINOS['el-monte']!;
  const piso = pisoDelCamino(tramo, nombres);
  const m = new RegExp(`data-marco="${ID}" data-capa="figura" data-dx="(-?\\d+)"`).exec(piso);
  assert.ok(m, 'no está en el monte del camino');
  assert.equal(Number(m[1]), Math.round(tramo.ojos[ID]![0] - REY.x));
  assert.ok(!piso.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos en el camino');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarReyCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  // Enterrado hasta los ojos, con los ojos abiertos, la corona al pie de la cruz y dos capullos.
  const dom = nuevo();
  assert.equal(asoma(dom), 0);
  assert.equal(dom.de('parpado', 'opacity'), '0');
  assert.equal(dom.de('corona', 'transform'), marcas(QUIETO).transform.corona);
  assert.deepEqual([1, 2, 3, 4].map((n) => dom.de(`capullo-${n}`, 'opacity')), ['0', '1', '0', '1']);
});

test('solo mira crecer las flores: mira, se abre una flor, gira la rueda, cae un pétalo, pasa un bicho, duerme y pestañea, sin asomar', () => {
  const hechas: Record<Accion, number> = { mira: 0, abre: 0, rueda: 0, petalo: 0, bicho: 0, duerme: 0, ruge: 0 };
  let pestaneos = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarReyCon(dom.marcos, esc, azar(semilla));
    const tierras = new Set<string>();
    let cerrado = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      assert.equal(asoma(dom), 0, 'asomó sin que lo toquen');
      tierras.add(dom.de('tierra', 'transform'));
      const p = Number(dom.de('parpado', 'opacity'));
      if (p > 0.9 && !cerrado) pestaneos++;
      cerrado = p > 0.9;
      if (i % 30 === 0) for (const q of dom.partes) assert.doesNotMatch(`${q.getAttribute('transform')}${q.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${q.dataset.parte} se rompió`);
    }
    assert.ok(tierras.size > 100, 'la tierra no respira');
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['mira', 'abre', 'rueda', 'petalo', 'bicho', 'duerme'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.ruge, 0, 'rugió sin que lo toquen');
  assert.ok(pestaneos >= 15, `pestañeó ${pestaneos} veces`);
});

test('tocado asoma, ruge con la corona puesta, crecen las flores, rueda el patín, se tambalea la cruz, se vuelve a hundir y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarReyCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { asoma: 0, boca: 0, flores: 0, patin: 0, cruz: 0, grieta: 0, corona: Infinity, abiertas: 0, rugeAsomado: true };
  for (let i = 1; i <= 60 * DURA.ruge; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    visto.asoma = Math.max(visto.asoma, asoma(dom));
    const boca = trasladoDe(dom.de('quijada', 'transform'))[1];
    visto.boca = Math.max(visto.boca, boca);
    if (boca > 10 && asoma(dom) < SUBE * 0.9) visto.rugeAsomado = false;
    visto.flores = Math.max(visto.flores, escalaDe(dom.de('flor-2', 'transform')));
    visto.patin = Math.max(visto.patin, trasladoDe(dom.de('patin', 'transform'))[0]);
    visto.cruz = Math.max(visto.cruz, Math.abs(Number(/rotate\(([-\d.]+)/.exec(dom.de('cruz', 'transform'))![1])));
    visto.grieta = Math.max(visto.grieta, Number(dom.de('grietas', 'opacity')));
    visto.corona = Math.min(visto.corona, trasladoDe(dom.de('corona', 'transform'))[1]);
    if (u > TOQUE_T.ruge[0] + 0.6 && u < TOQUE_T.ruge[1] - 0.4) visto.abiertas = Math.min(...[1, 2, 3, 4].map((n) => Number(dom.de(`corola-${n}`, 'opacity'))));
  }
  assert.ok(visto.asoma > SUBE - 0.5, `asomó ${visto.asoma.toFixed(0)}`);
  assert.ok(visto.boca > 25, 'no abrió la boca');
  assert.ok(visto.rugeAsomado, 'rugió enterrado');
  assert.ok(visto.flores > 1.5, 'las flores no crecieron');
  assert.equal(visto.abiertas, 1, 'no se abrieron todas');
  assert.ok(visto.patin > RUEDA_LEJOS - 1, 'el patín no salió rodando');
  assert.ok(visto.cruz > 4, 'la cruz no se tambaleó');
  assert.ok(visto.grieta > 0.9, 'la tierra no se partió');
  // La corona subió hasta la cabeza asomada.
  assert.ok(visto.corona < REY_ARMADO.coronilla[1] - REY_ARMADO.corona[1] - SUBE + 2, 'la corona no se la puso');
  // Al final está hundido otra vez hasta los ojos, con el patín y la corona en su lugar.
  assert.ok(asoma(dom) < 0.5, 'no se volvió a hundir');
  assert.ok(Math.abs(trasladoDe(dom.de('patin', 'transform'))[0]) < 0.5, 'el patín no volvió');
  assert.equal(dom.de('corona', 'transform'), marcas(QUIETO).transform.corona);
  assert.equal(vivo.estado().hechas.ruge, 1);
  assert.equal(dichos.length, 1);
  assert.deepEqual(dichos[0], [ID, VERSO[0], VERSO[1]]);
  assert.equal(vivo.reaccionar('otro', 0), false);
  assert.equal(vivo.reaccionar(ID, 20), true);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de enterrado a asomado, rugiendo, y de vuelta', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarReyCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(asoma(dom), SUBE);
  assert.equal(dom.de('quijada', 'transform'), marcas(ASOMA).transform.quijada);
  assert.equal(dom.de('corona', 'transform'), marcas(ASOMA).transform.corona);
  assert.equal(dichos.length, 1);
  vivo.mover(4, 1 / 60);
  assert.equal(asoma(dom), SUBE, 'se movió solo');
  dom.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(dom.foto(), antes);
});

test('la ficha: el retrato es la tumba con el león asomado, adentro de su caja; y la isla se lleva números', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/monte-lejos.webp') && svg.includes('/bestiario/rey-cara.webp') && svg.includes('/bestiario/rey-tierra.webp'));
  assert.ok(!svg.includes('data-id='), 'el retrato se puede tocar');
  const [x0, y0, w, h] = r.caja;
  for (const p of [[-140, 0], [210, 0], [-100, -240], [0, -104 - SUBE - 70]] as const) {
    const [x, y] = alRecinto(p);
    assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  }
  const fuente = readFileSync('src/scripts/bestiario/rey.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((x) => /arte|aerografo|titeres|escenas|elenco|trazos/.test(x)), []);
});
