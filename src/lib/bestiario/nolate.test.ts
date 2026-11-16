import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { NOLATE_PERSONAJE, PIEZAS_NOLATE } from './arte-nolate.ts';
import { ASOMA, ENTORNADA, NOLATE, NOLATE_ARMADO, QUIETO, SUENA, alRecinto, marcas, ojoEn, type Punto } from './rig-nolate.ts';
import { VECINOS_DEL_MONTE, escenaMonte } from './escena-monte.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { ACHATE, PALO, SOGA } from './rig.ts';
import { COMPAS, DURA, GOLPES, TOQUE_T, armarNolateCon, base, golpe, type Accion } from '../../scripts/bestiario/nolate.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El animal que no late (`D-73`, vigesimonovena vuelta, `T-529`): un bicho embalsamado a aerógrafo, montado en su peana
 * entre las tiras del monte, con su nube que le llueve a él solo y una radio donde iba el corazón; que no respire, que
 * se le caiga un ojo y vuelva, que la nube amague un rayo que no sale, que tocado suene la radio y baile tieso, y que
 * la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-animal-que-no-late';
const atras = capasDe('el-monte', 'atras', nombres, 1, ID);
const figura = capasDe('el-monte', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_NOLATE.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([atras, figura], 'titere--nolate');
const giro = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
const escalaX = (transform: string): number => Number(/scale\((-?[\d.]+) 1\)/.exec(transform)?.[1] ?? NaN);
/** Cuánto suena la radio, leído de lo que se hincha en su hueco. */
const suenaDe = (transform: string): number => Math.round(((Number(/scale\(([\d.]+)\)/.exec(transform)?.[1] ?? 1) - 1) / 0.08) * 1000) / 1000;
const escalaY = (transform: string): number => Number(/scale\(1 (-?[\d.]+)\)/.exec(transform)?.[1] ?? NaN);

test('el animal que no late es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--nolate" data-id="el-animal-que-no-late" role="button" tabindex="0" aria-label="El animal que no late">/);
  for (const p of ['entero', 'lluvia', 'chispa', 'carro', 'rueda-1', 'rueda-2', 'bicho', 'cola', 'pata', 'puerta', 'reves', 'paja', 'antena', 'etiqueta', 'ojo', 'flequillo', 'rayo', 'radio', 'patas']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al animal le falta ${p}`);
  }
  // La nube va atrás, en su capa, y no se toca.
  assert.ok(atras.includes('data-parte="nube"') && atras.includes('pointer-events="none"') && !atras.includes('role="button"'));
  const imagenes = new Set([...(atras + figura).matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_NOLATE.map((p) => p.nombre).sort());
  for (const p of PIEZAS_NOLATE) assert.match(p.nombre, /^nolate-/);
  const A = NOLATE_ARMADO;
  assert.ok(adentro('nolate-pata', A.hombro) && adentro('nolate-cuerpo', A.hombro), 'la pata en alto no sale del hombro');
  assert.ok(adentro('nolate-cola', A.cola) && adentro('nolate-cuerpo', [A.cola[0] + 6, A.cola[1]]), 'la cola no sale del cuerpo');
  assert.ok(adentro('nolate-paja', A.cintura) && adentro('nolate-cuerpo', A.cintura), 'la paja no sale de la cintura');
  assert.ok(adentro('nolate-cabeza', A.ojo.centro) && adentro('nolate-ojo', A.ojo.centro), 'el ojo de vidrio no está en la cara');
  assert.ok(adentro('nolate-flequillo', A.flequillo) && adentro('nolate-cabeza', A.flequillo), 'el flequillo no sale de la cabeza');
  assert.ok(adentro('nolate-etiqueta', A.etiqueta) && adentro('nolate-cabeza', A.etiqueta), 'la etiqueta no cuelga de la oreja');
  assert.ok(adentro('nolate-antena', A.antena.base) && adentro('nolate-cuerpo', A.antena.base), 'la antena no sale del lomo');
  // La puertita tapa el hueco del pecho, y su revés está del otro lado de la bisagra.
  const [px, py, pw, ph] = A.puerta;
  assert.ok(adentro('nolate-puerta', [px, py]) && adentro('nolate-puerta', [px + pw, py + ph]) && adentro('nolate-cuerpo', [px + pw, py + ph]));
  assert.ok(adentro('nolate-reves', [px - pw, py]) && adentro('nolate-reves', [px, py + ph]));
  // La radio está en el cuerpo, debajo de la puertita, y la varilla en la peana.
  const radio = PIEZAS_NOLATE.find((p) => p.nombre === 'nolate-radio')!.dibujo;
  assert.ok(radio.includes('--bestia-nolate-naranja') && figura.indexOf('nolate-cuerpo.webp') < figura.indexOf('data-parte="radio"') && figura.indexOf('data-parte="radio"') < figura.indexOf('data-parte="puerta"'), 'la radio no queda detrás de la puertita');
  // El sonido no se dibuja: no hay ondas, ni halos. El rayo, la chispa y la radio son tinta plana, sin nada soplado.
  assert.ok(!PIEZAS_NOLATE.some((p) => p.nombre === 'nolate-ondas'), 'volvieron las ondas');
  for (const n of ['nolate-rayo', 'nolate-chispa', 'nolate-radio', 'nolate-ojo']) assert.ok(!PIEZAS_NOLATE.find((p) => p.nombre === n)!.dibujo.includes('url(#soplo'), `${n} tiene halo`);
  // Los dos ojos son desparejos: el de vidrio verde, que se cae, y el ámbar, más chico y mal puesto, cosido en la cabeza.
  const cabeza = PIEZAS_NOLATE.find((p) => p.nombre === 'nolate-cabeza')!.dibujo;
  assert.ok(cabeza.includes('--bestia-nolate-paja-honda') && !PIEZAS_NOLATE.find((p) => p.nombre === 'nolate-ojo')!.dibujo.includes('--bestia-nolate-paja-honda') && A.ojo.radio < 5, 'los ojos quedaron parejos');
  assert.ok(adentro('nolate-peana', A.varilla));
  // El rayo llega de la panza de la nube a la punta de la antena estirada.
  assert.ok(adentro('nolate-rayo', [A.antena.base[0], A.antena.base[1] - A.antena.largo]) && adentro('nolate-rayo', [A.nube.centro[0] + 10, A.nube.panza + 2]));
  // La etiqueta trae un signo de pregunta y ninguna palabra; la boca va cosida.
  for (const p of PIEZAS_NOLATE) assert.ok(!p.dibujo.includes('<text'), `${p.nombre} trae letras`);
  for (const p of PIEZAS_NOLATE) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['nolate-cuerpo', 'nolate-cabeza', 'nolate-peana', 'nolate-nube']) assert.match(PIEZAS_NOLATE.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_NOLATE.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 40 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del animal que no late están en su bloque de tokens.css, medidas en Cordero atado, y su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el animal que no late⟩'), tokens.indexOf('⟨/el animal que no late⟩'));
  const usadas = new Set(PIEZAS_NOLATE.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-nolate-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 14);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del animal`);
  // Ninguna tinta de otro bicho.
  for (const p of PIEZAS_NOLATE) for (const m of p.dibujo.matchAll(/var\((--[a-z-]+)\)/g)) assert.ok(m[1]!.startsWith('--bestia-nolate-'), `${p.nombre} usa ${m[1]}`);
  assert.match(bloque, /public\/tapas\/cordero-atado\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el animal que no late⟩ */'), sitio.indexOf('/* ⟨/el animal que no late⟩ */'));
  assert.match(suyo, /\.titere--nolate \{ cursor: pointer; \}/);
  for (const p of ['lluvia', 'rayo', 'chispa']) assert.ok(suyo.includes(`[data-parte="${p}"]`), `${p} se puede tocar`);
  assert.doesNotMatch(suyo, /#[0-9a-fA-F]{3,8}\b|shadow/);
});

test('vive en el monte, entre las tiras de arriba: sin pisar a las lobas ni al rey, fuera de la soga del cordero, con el ojo donde dicen sus ojos, y en el camino baja a pisar el borde', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'el-monte');
  assert.equal(NOLATE_PERSONAJE.ancla, NOLATE.x);
  const [ox, oy] = VECINOS_DEL_MONTE[ID]!;
  const [ex, ey] = alRecinto(NOLATE_ARMADO.ojo.centro);
  assert.ok(Math.hypot(ex - ox, ey - oy) < 6, `el ojo quedó en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  // La mancha del piso y la nube entran en el recinto, y no encierran los ojos de nadie.
  const [x0] = alRecinto([-118, 0]);
  const [x1, y1] = alRecinto([120, 15]);
  const [, y0] = alRecinto([0, NOLATE_ARMADO.nube.centro[1] - NOLATE_ARMADO.nube.alto / 2]);
  assert.ok(x0 > 0 && x1 < 900 && y0 > 0 && y1 < 640, 'se sale del recinto');
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_MONTE)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > y0 && vy < y1), `${id} queda adentro del animal`);
  }
  // Las lobas están echadas a la izquierda (su hueco llega a x ≈ 218) y el montículo del rey empieza en x ≈ 495.
  assert.ok(x0 > 218 && x1 < 495, `va de ${x0.toFixed(0)} a ${x1.toFixed(0)}`);
  // El cordero, con la soga tirante, no le llega a la peana: ni de costado ni para arriba (mide unas 90 de alto).
  assert.ok(x1 < PALO.x - SOGA + 4 || NOLATE.piso < PALO.y - SOGA * ACHATE - 90, 'el cordero le pisa la peana');
  // Rodando en el toque (9 unidades para cada lado) tampoco se sale de su mancha.
  assert.ok(NOLATE_ARMADO.peana.hasta + 9 < 120);
  const escena = escenaMonte(nombres);
  assert.ok(escena.indexOf(`data-marco="${ID}" data-capa="atras"`) < escena.indexOf('/bestiario/monte-cerca.webp'), 'la nube no va atrás');
  assert.ok(escena.indexOf('/bestiario/monte-cerca.webp') < escena.indexOf(`data-marco="${ID}" data-capa="figura"`), 'el piso le queda delante');
  // La nube queda arriba de donde empieza `monte-cerca` (y = 240): nada la tapa.
  assert.ok(alRecinto([0, NOLATE_ARMADO.nube.panza])[1] < 240);
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  // En el camino va corrido entero adonde estaban sus ojos, y baja lo que falta para pisar el borde del piso (y ≈ 305).
  const tramo = CAMINOS['el-monte']!;
  const piso = pisoDelCamino(tramo, nombres);
  const m = /data-marco="el-animal-que-no-late" data-capa="figura" data-dx="(-?\d+)" transform="translate\((-?[\d.]+) (-?[\d.]+)\)"/.exec(piso);
  assert.ok(m, 'no está en el monte del camino');
  assert.equal(Number(m![1]), tramo.ojos[ID]![0] - NOLATE.x);
  const pisa = NOLATE.piso + Number(m![3]);
  assert.ok(pisa >= 305 && pisa <= 325, `en el camino pisa en y = ${pisa}`);
  assert.ok(!piso.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos en el camino');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarNolateCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  // Quieto: la puertita entornada (se ve una rendija del dial), la antena apenas asomada, el ojo en la cuenca.
  const t = marcas(QUIETO);
  assert.ok(escalaX(t.transform.puerta!) < 1 && escalaX(t.transform.puerta!) > 0.6 && t.opacity.puerta === '1' && t.opacity.reves === '0');
  assert.equal(escalaY(t.transform.antena!), ASOMA);
  assert.deepEqual(trasladoDe(t.transform.ojo!), [0, 0]);
  assert.equal(t.opacity.rayo, '0');
  assert.equal(suenaDe(t.transform.radio!), 0);
});

test('no late: no respira nunca; le llueve, sopla el viento, se le cae un ojo y vuelve, la nube amaga un rayo que no sale, y sintoniza a medias', () => {
  const hechas: Record<string, number> = {};
  const visto = { flequillo: 0, ojoBaja: 0, ojoRueda: 0, chispa: 0, rayo: 0, hincha: 1, puerta: 1, reves: 0, ondas: 0, lluvias: new Set<string>() };
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarNolateCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 90; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      visto.flequillo = Math.max(visto.flequillo, -giro(dom.de('flequillo', 'transform')));
      const [dx, dy] = trasladoDe(dom.de('ojo', 'transform'));
      visto.ojoBaja = Math.max(visto.ojoBaja, dy);
      visto.ojoRueda = Math.min(visto.ojoRueda, dx);
      visto.chispa = Math.max(visto.chispa, Number(dom.de('chispa', 'opacity')));
      visto.rayo = Math.max(visto.rayo, Number(dom.de('rayo', 'opacity')));
      visto.hincha = Math.max(visto.hincha, Number(/scale\(([\d.]+) /.exec(dom.de('nube', 'transform'))![1]));
      visto.puerta = Math.min(visto.puerta, escalaX(dom.de('puerta', 'transform')));
      visto.reves = Math.max(visto.reves, Number(dom.de('reves', 'opacity')));
      visto.ondas = Math.max(visto.ondas, suenaDe(dom.de('radio', 'transform')));
      if (i % 7 === 0) visto.lluvias.add(dom.de('lluvia', 'transform'));
      // No hay ninguna parte que respire: el bicho no se hincha ni se achica, y sin tocarlo casi no se bambolea.
      assert.ok(Math.abs(giro(dom.de('bicho', 'transform'))) < 2, 'bailó sin que lo toquen');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a] = (hechas[a] ?? 0) + n;
  }
  for (const a of ['sopla', 'ojo', 'amaga', 'sintoniza'] as Accion[]) assert.ok((hechas[a] ?? 0) > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque ?? 0, 0);
  assert.ok(!Object.keys(marcas(QUIETO).transform).some((p) => /respira|panza|pecho/.test(p)), 'tiene una parte que respira');
  assert.ok(visto.flequillo > 35, `el flequillo se levantó ${visto.flequillo.toFixed(0)}`);
  // El ojo llega a la peana, rueda para atrás casi hasta el canto, y no se cae de ella.
  const A = NOLATE_ARMADO;
  assert.ok(Math.abs(visto.ojoBaja - A.caida.baja) < 2 && A.ojo.centro[1] + A.caida.baja + A.ojo.radio <= A.peana.lomo + 1, `el ojo bajó ${visto.ojoBaja.toFixed(0)}`);
  assert.ok(visto.ojoRueda < A.caida.rueda + 6 && A.ojo.centro[0] + A.caida.rueda > A.peana.desde, `rodó ${visto.ojoRueda.toFixed(0)}`);
  assert.deepEqual([ojoEn(0), ojoEn(1)], [{ dx: 0, dy: 0, giro: 0 }, { dx: 0, dy: 0, giro: 0 }]);
  // La nube se hincha y chisporrotea, pero el rayo no sale; la puertita se abre a medias, sin mostrar el revés.
  assert.ok(visto.hincha > 1.08 && visto.chispa === 1 && visto.rayo === 0, 'amagó mal');
  assert.ok(visto.puerta < 0.25 && visto.puerta > 0 && visto.reves === 0 && visto.ondas > 0.3 && visto.ondas < 0.7, `la puertita llegó a ${visto.puerta}`);
  assert.ok(visto.lluvias.size > 20, 'no llueve');
  // Y la base es la misma en dos momentos del aliento de cualquier otro: nada sube y baja con un período.
  assert.equal(base(3).baila, 0);
  assert.equal(base(5.3).rueda, 0);
});

test('tocado, la nube le tira el rayo a la antena: la puertita se abre de par en par, la radio suena tres golpes por compás, baila tieso rodando en la peana, y queda como estaba', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarNolateCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { rayo: 0, antena: 0, reves: 0, baila: [0, 0], rueda: [0, 0], pata: 0, golpes: 0, vibra: 0, patas: 0 };
  let sonaba = false;
  for (let i = 1; i <= 60 * DURA.toque; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    visto.rayo = Math.max(visto.rayo, Number(dom.de('rayo', 'opacity')));
    visto.antena = Math.max(visto.antena, escalaY(dom.de('antena', 'transform')));
    if (dom.de('reves', 'opacity') === '1') visto.reves = Math.max(visto.reves, escalaX(dom.de('reves', 'transform')));
    const b = giro(dom.de('bicho', 'transform'));
    visto.baila = [Math.min(visto.baila[0]!, b), Math.max(visto.baila[1]!, b)];
    const r = trasladoDe(dom.de('carro', 'transform'))[0];
    visto.rueda = [Math.min(visto.rueda[0]!, r), Math.max(visto.rueda[1]!, r)];
    visto.pata = Math.min(visto.pata, giro(dom.de('pata', 'transform')));
    const suena = suenaDe(dom.de('radio', 'transform')) > 0.85;
    // Cuando suena, se ve en lo que sacude: la paja salta y la antena vibra con la radio.
    if (suena) assert.ok(/scale\(1\.1[0-9]\)/.test(dom.de('paja', 'transform')), 'la paja no saltó con el golpe');
    visto.vibra = Math.max(visto.vibra, Math.abs(giro(dom.de('antena', 'transform'))), 0);
    visto.patas = Math.max(visto.patas, Math.abs(trasladoDe(dom.de('patas', 'transform'))[0]));
    if (suena && !sonaba) visto.golpes++;
    sonaba = suena;
    // El rayo cae antes de que suene, y la antena ya está arriba cuando cae.
    if (Number(dom.de('rayo', 'opacity')) > 0.5) assert.ok(u < TOQUE_T.suena[0] && escalaY(dom.de('antena', 'transform')) > 0.5, `rayo a destiempo, a los ${u.toFixed(2)} s`);
    // Las rueditas giran lo que rueda la peana.
    assert.ok(Math.abs(giro(dom.de('rueda-1', 'transform')) - (r / 6) * (180 / Math.PI)) < 0.6);
    // La puerta y su revés nunca se ven a la vez.
    assert.notEqual(dom.de('puerta', 'opacity'), dom.de('reves', 'opacity'));
  }
  assert.equal(visto.rayo, 1, 'no cayó el rayo');
  assert.ok(visto.antena > 0.98 && visto.reves > 0.7, 'no estiró la antena o no abrió la puertita');
  const compases = Math.floor((TOQUE_T.suena[1] - TOQUE_T.suena[0]) / COMPAS);
  assert.equal(compases, 3);
  assert.equal(visto.golpes, compases * GOLPES.length, `sonaron ${visto.golpes} golpes`);
  assert.ok(golpe(0) === 1 && golpe(COMPAS * 0.9) === 0, 'el compás no tiene silencio');
  assert.ok(visto.baila[0]! < -3 && visto.baila[1]! > 2, `se bamboleó de ${visto.baila[0]} a ${visto.baila[1]}`);
  assert.ok(visto.rueda[0]! < -6 && visto.rueda[1]! > 6, 'la peana no rodó para los dos lados');
  assert.ok(visto.pata < -30, 'no levantó la pata');
  assert.ok(visto.vibra > 3 && visto.patas > 0.8, 'la antena no vibró o las patas no repiquetearon');
  // Al final queda como estaba: tieso, la puertita entornada, la antena guardada, sin sonar.
  const fin = marcas(base(1 + DURA.toque));
  assert.ok(Math.abs(giro(dom.de('bicho', 'transform'))) < 0.2 && Math.abs(trasladoDe(dom.de('carro', 'transform'))[0]) < 0.2);
  assert.equal(dom.de('puerta', 'transform'), fin.transform.puerta);
  assert.equal(escalaY(dom.de('antena', 'transform')), ASOMA);
  assert.equal(suenaDe(dom.de('radio', 'transform')), 0);
  assert.ok(ENTORNADA > 0.05);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de tieso a sonando, con la radio a la vista, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarNolateCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('bicho', 'transform'), marcas(SUENA).transform.bicho);
  assert.equal(dom.de('reves', 'opacity'), '1');
  assert.equal(suenaDe(dom.de('radio', 'transform')), 1);
  assert.equal(escalaY(dom.de('antena', 'transform')), 1);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.deepEqual(dom.foto(), antes);
});
