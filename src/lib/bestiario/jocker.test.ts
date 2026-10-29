import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_JOCKER, JOCKER_PERSONAJE } from './arte-jocker.ts';
import { BURLON, CODO, JOCKER, JOCKER_ARMADO, MANO, NAIPES, QUIETO, RAMA_BAJA, alRecinto, alcanza, bezier, brazoEn, caraDeLaVuelta, type Punto } from './rig-jocker.ts';
import { ARBOL, OJOS_DEL_ARBOL, COSAS_DEL_ARBOL } from './rig-entornos.ts';
import { escenaArbol } from './escenas-entornos.ts';
import { DURA, TOQUE_T, armarJockerCon, type Accion } from '../../scripts/bestiario/jocker.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * El jocker burlón (`D-73`, vigesimocuarta vuelta): que sea un títere entero a aerógrafo, colgado de un
 * brazo de la rama baja sin taparle los ojos a nadie, que el brazo libre alcance lo que quiere, que solo se
 * burle sin repetirse, que tocado dé el molinete y se dé vuelta como un naipe (el dorso, el as) y vuelva a
 * ser él, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-jocker-burlon';
const figura = capasDe('el-arbol', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_JOCKER.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--jocker');
const escalaY = (t: string): number => Number(/scale\(1 ([-\d.]+)\)/.exec(t)?.[1] ?? NaN);
const rotacion = (t: string): number => Number(/rotate\(([-\d.]+)/.exec(t)?.[1] ?? NaN);

test('el jocker es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--jocker" data-id="el-jocker-burlon" role="button" tabindex="0" aria-label="El jocker burlón">/);
  const partes = ['entero', 'hamaca', 'vuelta', 'jocker', 'dorso', 'as', 'pecho', 'estrella', 'brillo', 'cabeza', 'tilin', 'boca-cerrada', 'boca-abierta', 'brazo', 'antebrazo', 'mazo', 'oreja',
    ...[1, 2, 3].map((i) => `punta-${i}`), ...[1, 2].flatMap((n) => [`muslo-${n}`, `canilla-${n}`, `pupila-${n}`, `parpado-${n}`]), ...NAIPES.map((p) => `naipe-${p}`)];
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `al jocker le falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_JOCKER.map((p) => p.nombre).sort());
  const A = JOCKER_ARMADO;
  assert.ok(adentro('jocker-puno', A.puno) && adentro('jocker-brazo-colgado', A.hombros[0]) && adentro('jocker-cuerpo', A.hombros[0]), 'el brazo que cuelga no va del puño al hombro');
  assert.ok(adentro('jocker-brazo', A.hombros[1]) && adentro('jocker-brazo', CODO) && adentro('jocker-antebrazo', CODO) && adentro('jocker-antebrazo', MANO) && adentro('jocker-mano', MANO), 'el brazo libre no está armado');
  for (const p of NAIPES) assert.ok(adentro(`jocker-naipe-${p}`, MANO), `el ${p} no sale de la mano`);
  assert.ok(adentro('jocker-cuerpo', A.cuello) && adentro('jocker-cabeza', A.cuello) && adentro('jocker-gorguera', A.cuello), 'la cabeza gira en el aire');
  for (const n of [0, 1] as const) {
    assert.ok(adentro('jocker-cabeza', A.ojos[n]) && adentro(`jocker-pupila-${n + 1}`, A.ojos[n]) && adentro(`jocker-parpado-${n + 1}`, A.ojos[n]), `el ojo ${n + 1} no está en la cara`);
    assert.ok(adentro('jocker-cuerpo', A.caderas[n]) && adentro(`jocker-muslo-${n + 1}`, A.caderas[n]) && adentro(`jocker-muslo-${n + 1}`, A.rodillas[n]) && adentro(`jocker-canilla-${n + 1}`, A.rodillas[n]), `la pierna ${n + 1} no cuelga de su cadera`);
  }
  for (const i of [0, 1, 2] as const) assert.ok(adentro('jocker-bonete', A.puntas[i]) && adentro(`jocker-punta-${i + 1}`, A.puntas[i]) && adentro(`jocker-punta-${i + 1}`, A.cascabeles[i]) && adentro('jocker-tilin', A.cascabeles[i]), `la punta ${i + 1} no nace de la vincha`);
  assert.ok(adentro('jocker-cabeza', A.boca) && adentro('jocker-boca-cerrada', A.boca) && adentro('jocker-boca-abierta', A.boca) && adentro('jocker-cabeza', A.oreja), 'la boca o la oreja se salieron de la cara');
  assert.ok(adentro('jocker-cuerpo', A.alfiler) && adentro('jocker-estrella', A.alfiler) && adentro('jocker-brillo', A.alfiler), 'la estrella no cuelga del pecho');
  for (const n of ['jocker-dorso', 'jocker-as']) assert.ok(adentro(n, A.puno), `${n} no cuelga de la rama`);
  for (const p of PIEZAS_JOCKER) {
    assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
    assert.ok(!/NaN|undefined|Infinity/.test(p.dibujo), `${p.nombre} tiene un número roto`);
  }
  for (const n of ['jocker-cuerpo', 'jocker-cabeza', 'jocker-dorso', 'jocker-naipe-pica']) assert.match(PIEZAS_JOCKER.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_JOCKER.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del jocker están en su bloque de tokens.css, y lo que no se toca en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el jocker burlon⟩'), tokens.indexOf('⟨/el jocker burlon⟩'));
  const usadas = new Set(PIEZAS_JOCKER.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-jocker-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 15);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del jocker`);
  assert.match(bloque, /ultimo-bondi-a-finisterre/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el jocker burlon⟩ */'), sitio.indexOf('/* ⟨/el jocker burlon⟩ */'));
  assert.match(suyo, /\.titere--jocker \{ cursor: pointer; \}/);
  for (const p of ['tilin', 'brillo']) assert.ok(suyo.includes(`"${p}"`), `${p} se puede tocar`);
});

test('se agarra de la rama baja, debajo del marco y arriba del ángel, sin taparle los ojos a nadie', () => {
  assert.equal(JOCKER_PERSONAJE.ancla, ARBOL.tronco.x);
  // El puño está adentro de la rama baja: entre su borde de arriba y el de abajo.
  const enX = (borde: readonly Punto[]): number => {
    let [a, b] = [0, 1];
    const sube = bezier(borde, 1)[0] > bezier(borde, 0)[0];
    for (let i = 0; i < 40; i++) {
      const m = (a + b) / 2;
      if ((bezier(borde, m)[0] < JOCKER.x) === sube) a = m;
      else b = m;
    }
    return bezier(borde, (a + b) / 2)[1];
  };
  assert.ok(JOCKER.rama > enX(RAMA_BAJA.arriba) && JOCKER.rama < enX(RAMA_BAJA.abajo), 'el puño no agarra la rama');
  // Lo que ocupa colgado, del cascabel de afuera a las puntas de los zapatos, aun hamacándose.
  for (const h of [-16, 0, 16]) {
    const puntos = ([[-86, -24], [30, -24], [-86, 250], [30, 250]] as Punto[]).map((p) => alRecinto(p, h));
    const [x0, x1] = [Math.min(...puntos.map((p) => p[0])), Math.max(...puntos.map((p) => p[0]))];
    const [y0, y1] = [Math.min(...puntos.map((p) => p[1])), Math.max(...puntos.map((p) => p[1]))];
    const otros = [...Object.entries(OJOS_DEL_ARBOL).filter(([id]) => id !== ID).map(([id, [x, y]]) => [id, x, y] as const), ...Object.entries(COSAS_DEL_ARBOL).map(([id, [x, y]]) => [id, x, y] as const), ['fruto', ARBOL.fruto.x, ARBOL.fruto.y] as const];
    for (const [id, ox, oy] of otros) assert.ok(!(ox > x0 && ox < x1 && oy > y0 && oy < y1), `${id} queda adentro del jocker (hamaca ${h})`);
    assert.ok(y1 < ARBOL.tronco.pie - 50, 'llega hasta el pie del árbol');
  }
  // El molinete da la vuelta entera sin salirse del recinto.
  for (let g = 0; g <= 360; g += 10) {
    for (const p of [[-86, -24], [30, 250], [-86, 250]] as Punto[]) {
      const [x, y] = alRecinto(p, g);
      assert.ok(x > 0 && x < 900 && y > 0 && y < ARBOL.tronco.pie, `el molinete se sale del recinto a ${g}°`);
    }
  }
  // Va en la figura: delante del piso del árbol.
  const escena = escenaArbol(nombres);
  assert.ok(escena.indexOf('/bestiario/arbol-piso.webp') < escena.indexOf(`data-marco="${ID}"`), 'el árbol lo tapa');
  // Y ya no está pintado en el piso del árbol: la silueta con el bonete se sacó.
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8'), /at\('el-jocker-burlon'\)/, 'sigue pintado en el piso del árbol');
});

test('el brazo libre alcanza la oreja, el pecho y al de abajo, con el codo para afuera', () => {
  const A = JOCKER_ARMADO;
  for (const meta of [[A.oreja[0] - 8, A.oreja[1] + 6], [-70, 74], [-74, 60], [-20, 120]] as Punto[]) {
    const { brazo, antebrazo } = alcanza(meta);
    const { codo, mano } = brazoEn(brazo, antebrazo);
    assert.ok(Math.hypot(mano[0] - meta[0], mano[1] - meta[1]) < 0.5, `no llega a ${meta}`);
    assert.ok(codo[0] <= A.hombros[1][0] + 6, `el codo se mete adentro para llegar a ${meta}`);
  }
  // Y lo que no alcanza, lo señala con el brazo estirado.
  const { brazo, antebrazo } = alcanza([200, 300]);
  const { mano } = brazoEn(brazo, antebrazo);
  assert.ok(Math.hypot(mano[0] - A.hombros[1][0], mano[1] - A.hombros[1][1]) > A.brazo + A.antebrazo - 1, 'no se estira');
});

test('se da vuelta como un naipe: él, el dorso, el as, y él otra vez; de canto se angosta', () => {
  assert.deepEqual([0, 1, 2, 3].map((v) => caraDeLaVuelta(v).cual), ['jocker', 'dorso', 'as', 'jocker']);
  for (const v of [0, 1, 2, 3]) assert.equal(caraDeLaVuelta(v).ancho, 1);
  for (const v of [0.5, 1.5, 2.5]) assert.ok(caraDeLaVuelta(v).ancho < 0.05);
  assert.equal(caraDeLaVuelta(0.4).cual, 'jocker');
  assert.equal(caraDeLaVuelta(0.6).cual, 'dorso');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarJockerCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('se burla solo: se hamaca, abanica los naipes, hace sonar los cascabeles, se ríe del de abajo, saca un naipe de la oreja y pestañea', () => {
  const hechas: Record<Accion, number> = { hamaca: 0, abanica: 0, cascabelea: 0, burla: 0, oreja: 0, comodin: 0 };
  let pestaneos = 0;
  let oreja = 0;
  let boca = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarJockerCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = Math.min(escalaY(dom.de('parpado-1', 'transform')), escalaY(dom.de('parpado-2', 'transform')));
      if (p > 0.9 && !cerrado) pestaneos++;
      cerrado = p > 0.9;
      oreja = Math.max(oreja, Number(dom.de('oreja', 'opacity')));
      boca = Math.max(boca, Number(dom.de('boca-abierta', 'opacity')));
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['hamaca', 'abanica', 'cascabelea', 'burla', 'oreja'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.comodin, 0, 'hizo de comodín sin que lo toquen');
  assert.ok(oreja > 0.99, 'nunca sacó el naipe de la oreja');
  assert.equal(boca, 1, 'nunca se rió');
  assert.ok(pestaneos >= 20 && pestaneos <= 70, `pestañeó ${pestaneos} veces`);
});

test('tocado es el comodín: da el molinete, es el dorso, es el as, vuelve muerto de risa y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarJockerCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  let giro = 0;
  const visto = new Set<string>();
  let abanico = 0;
  let tilin = 0;
  let brillo = 0;
  for (let i = 1; i < 60 * DURA.comodin; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    if (t - 1 < TOQUE_T.rebote[0]) giro = Math.max(giro, rotacion(dom.de('hamaca', 'transform')));
    for (const c of ['jocker', 'dorso', 'as']) if (dom.de(c, 'opacity') === '1') visto.add(c);
    abanico = Math.max(abanico, Math.abs(rotacion(dom.de('naipe-pica', 'transform'))));
    tilin = Math.max(tilin, Number(dom.de('tilin', 'opacity')));
    brillo = Math.max(brillo, Number(dom.de('brillo', 'opacity')));
    assert.ok([...['jocker', 'dorso', 'as']].filter((c) => dom.de(c, 'opacity') === '1').length === 1, 'se ve más de una cara a la vez');
  }
  assert.ok(giro > 355, `no dio el molinete entero (${giro.toFixed(0)}°)`);
  assert.deepEqual([...visto].sort(), ['as', 'dorso', 'jocker']);
  assert.ok(abanico > 30, 'no abrió el abanico');
  assert.ok(tilin > 0.99 && brillo > 0.99, 'no sonaron los cascabeles o no brilló la estrella');
  assert.equal(vivo.estado().accion, 'comodin');
  // Al final es él otra vez, colgado derecho.
  assert.equal(dom.de('jocker', 'opacity'), '1');
  assert.ok(Math.abs(rotacion(dom.de('hamaca', 'transform'))) < 4, 'no volvió a colgar derecho');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa a la carcajada y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarJockerCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('boca-abierta', 'opacity'), '1');
  assert.equal(dom.de('tilin', 'opacity'), String(BURLON.tilin));
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('boca-abierta', 'opacity'), '0');
  assert.equal(dom.de('tilin', 'opacity'), String(QUIETO.tilin));
});
