import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_RANA, RANA_PERSONAJE } from './arte-rana.ts';
import { CROA, FLOTA, INFLA, QUIETO, RANA, RANA_ARMADO, SUBE, alRecinto, marcas, puntaDeLaLengua, type Punto } from './rig-rana.ts';
import { LUGAR as PIBE } from './rig-pibe.ts';
import { ASTILLERO, OJOS_DE_LOS_ASTILLEROS } from './rig-entornos.ts';
import { escenaAstilleros } from './escenas-entornos.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS, K_ENTORNO } from './camino.ts';
import { CROADAS, DURA, SALTA, TOQUE_T, armarRanaCon, type Accion } from '../../scripts/bestiario/rana.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * La rana rubia (`D-73`, vigesimoséptima vuelta): que sea un títere entero a aerógrafo recostado en su reposera,
 * arriba de la pila de containers, al lado del pibe y sin pisarlo, que no esté más pintada en el piso, que haraganee,
 * que tocada se levante los anteojos, croe tres veces hasta levantarse de la reposera y se coma la mosca, y que la
 * pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'la-rana-rubia';
const figura = capasDe('los-astilleros', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_RANA.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--rana');
const escalaDe = (transform: string): number => Number(/scale\(([\d.]+)\)/.exec(transform)?.[1] ?? NaN);
/** Cuánto estiró la lengua: la `x` del `scale(x 1)`. */
const lenguaDe = (transform: string): number => Number(/scale\(([\d.]+) 1\)/.exec(transform)?.[1] ?? NaN);

test('la rana es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--rana" data-id="la-rana-rubia" role="button" tabindex="0" aria-label="La rana rubia">/);
  for (const p of ['entero', 'etiqueta', 'cuerpo', 'panza', 'pie', 'buche', 'cabeza', 'peluca', 'pupila-1', 'pupila-2', 'parpado-1', 'parpado-2', 'anteojos', 'lengua', 'brazo', 'mosca']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `a la rana le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_RANA.map((p) => p.nombre).sort());
  for (const p of PIEZAS_RANA) assert.match(p.nombre, /^rana-/);
  const A = RANA_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro('rana-cabeza', A.ojos[n]) && adentro(`rana-parpado-${n + 1}`, A.ojos[n]) && adentro(`rana-pupila-${n + 1}`, A.ojos[n]) && adentro('rana-anteojos', A.ojos[n]), `el ojo ${n + 1} no está en la cara`);
  }
  assert.ok(adentro('rana-cabeza', A.cuello) && adentro('rana-cuerpo', A.cuello), 'la cabeza no se apoya en el cogote');
  assert.ok(adentro('rana-buche', A.buche) && adentro('rana-cabeza', A.buche), 'el buche no cuelga del mentón');
  assert.ok(adentro('rana-cabeza', A.boca) && adentro('rana-lengua', A.boca), 'la lengua no sale de la boca');
  assert.ok(adentro('rana-brazo', A.hombro) && adentro('rana-cuerpo', A.hombro), 'el brazo no sale del hombro');
  assert.ok(adentro('rana-pie', A.tobillo) && adentro('rana-cuerpo', A.tobillo), 'el pie no sale del tobillo');
  assert.ok(adentro('rana-etiqueta', A.etiqueta) && adentro('rana-reposera', A.etiqueta), 'la etiqueta no cuelga de la reposera');
  assert.ok(adentro('rana-cuerpo', A.panza), 'la panza no está en el cuerpo');
  // La lengua estirada llega a la vuelta de la mosca: si no, no la podría agarrar nunca.
  const [lx, ly] = puntaDeLaLengua();
  const { centro: [cx, cy], radio: [rx] } = A.mosca;
  assert.ok(Math.hypot(lx - cx, ly - cy) < rx * 1.5, `la lengua llega a ${lx.toFixed(0)}, ${ly.toFixed(0)}`);
  // Los anteojos son dos lentes que no se tocan, cada uno con su marco claro: levantados no pueden ser una mata negra.
  assert.ok(A.ojos[0][0] - 9 > A.ojos[1][0] + 11 - 3, 'los lentes se pisan');
  assert.equal([...PIEZAS_RANA.find((p) => p.nombre === 'rana-anteojos')!.dibujo.matchAll(/stroke="var\(--bestia-rana-haz\)" stroke-width="1\.1"/g)].length, 2, 'los lentes no tienen marco');
  // Levantados quedan arriba de los ojos, sin taparlos.
  assert.ok(-SUBE[1] > A.radio * 2, 'los anteojos levantados le tapan los ojos');
  for (const p of PIEZAS_RANA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['rana-reposera', 'rana-cuerpo', 'rana-cabeza', 'rana-peluca']) assert.match(PIEZAS_RANA.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_RANA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de la rana están en su bloque de tokens.css, medidas en La mosca y la sopa, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨la rana rubia⟩'), tokens.indexOf('⟨/la rana rubia⟩'));
  const usadas = new Set(PIEZAS_RANA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-rana-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de la rana`);
  assert.match(bloque, /public\/tapas\/la-mosca-y-la-sopa\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨la rana rubia⟩ */'), sitio.indexOf('/* ⟨/la rana rubia⟩ */'));
  assert.match(suyo, /\.titere--rana \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"mosca"') && suyo.includes('"lengua"'), 'la mosca y la lengua se pueden tocar');
});

test('toma sol arriba de la pila, al lado del pibe y sin pisarlo, ya no está pintada en el piso, y en el camino queda arriba del container', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'los-astilleros');
  assert.equal(RANA_PERSONAJE.ancla, RANA.x);
  // La reposera pisa el techo de la pila, y entra entera en el container de arriba, que es más corto que la pila.
  assert.ok(Math.abs(RANA.piso - ASTILLERO.pila.arriba) <= 2);
  const [x0, y0] = alRecinto([-104, -128]);
  const [x1] = alRecinto([94, 0]);
  for (const k of [1, K_ENTORNO]) {
    const corre = RANA.x * (k - 1);
    assert.ok(x0 + corre > ASTILLERO.pila.x0 * k + 30 && x1 + corre < ASTILLERO.pila.x1 * k - 14 + 2, `con k ${k} se cae del container`);
    // El pibe está sentado a su izquierda: no lo pisa, ni con la guitarra.
    assert.ok(x0 + corre > PIBE.x * k + 20, `con k ${k} pisa al pibe`);
  }
  // Donde decían sus ojos (y adonde mira el pibe) está ella.
  const [ox, oy] = OJOS_DE_LOS_ASTILLEROS[ID]!;
  assert.ok(ox > x0 && ox < x1 && oy > y0 && oy < RANA.piso, 'no está donde la mira el pibe');
  for (const [id, [vx, vy]] of Object.entries(OJOS_DE_LOS_ASTILLEROS)) {
    if (id === ID || id === 'el-pibe-de-los-astilleros') continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > y0 && vy < RANA.piso), `${id} queda adentro de la rana`);
  }
  const escena = escenaAstilleros(nombres);
  assert.ok(escena.indexOf('/bestiario/astillero-piso.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso la tapa');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8'), /at\('la-rana-rubia'\)/, 'sigue pintada en el piso de los astilleros');
  const piso = pisoDelCamino(CAMINOS['los-astilleros']!, nombres);
  const m = /data-marco="la-rana-rubia" data-capa="figura" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no está en los astilleros del camino');
  assert.equal(Number(m![1]), Math.round(RANA.x * (K_ENTORNO - 1)));
  assert.ok(!piso.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos en el camino');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarRanaCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.deepEqual(trasladoDe(marcas(QUIETO).transform.anteojos!), [0, 0], 'quieta no tiene los anteojos puestos');
  assert.equal(marcas(QUIETO).opacity.lengua, '0');
});

test('haraganea: le erra a la mosca, mueve el pie, acomoda el reflector, mira de reojo al pibe, croa bajito y se le corre la peluca', () => {
  const hechas: Record<Accion, number> = { lengua: 0, pie: 0, reflector: 0, reojo: 0, croaquito: 0, peluca: 0, croa: 0 };
  let lenguetazos = 0;
  const moscas = new Set<string>();
  const etiquetas = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarRanaCon(dom.marcos, esc, azar(semilla));
    let afuera = false;
    for (let i = 1; i <= 60 * 70; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const l = dom.de('lengua', 'opacity') === '1' && lenguaDe(dom.de('lengua', 'transform')) > 0.9;
      if (l && !afuera) lenguetazos++;
      afuera = l;
      // Sin tocarla, la mosca sigue viva, no se levanta de la reposera y no se saca los anteojos del todo.
      assert.equal(dom.de('mosca', 'opacity'), '1');
      assert.equal(trasladoDe(dom.de('cuerpo', 'transform'))[1], 0);
      assert.ok(-trasladoDe(dom.de('anteojos', 'transform'))[1] < -SUBE[1] * 0.5, 'se sacó los anteojos sola');
      if (i % 5 === 0) {
        moscas.add(dom.de('mosca', 'transform'));
        etiquetas.add(dom.de('etiqueta', 'transform'));
      }
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['lengua', 'pie', 'reflector', 'reojo', 'croaquito', 'peluca'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.croa, 0, 'croó en serio sin que la toquen');
  assert.equal(lenguetazos, hechas.lengua, `tiró ${lenguetazos} lengüetazos`);
  assert.ok(moscas.size > 500 && etiquetas.size > 300, 'la mosca no vuela o la etiqueta no se hamaca');
});

test('tocada croa en serio: le salta la peluca, se levanta los anteojos, croa tres veces, el buche la levanta, cae, se come la mosca, llega otra y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarRanaCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { peluca: 0, anteojos: 0, buche: 0, croadas: 0, flota: 0, lengua: 0, mosca: 1, accion: '' };
  let inflado = false;
  let subeEn = Infinity;
  for (let i = 1; i <= 60 * DURA.croa; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    visto.peluca = Math.max(visto.peluca, -trasladoDe(dom.de('peluca', 'transform'))[1]);
    visto.anteojos = Math.max(visto.anteojos, -trasladoDe(dom.de('anteojos', 'transform'))[1]);
    const b = escalaDe(dom.de('buche', 'transform'));
    visto.buche = Math.max(visto.buche, b);
    const lleno = b > INFLA * 0.9;
    if (lleno && !inflado) {
      visto.croadas++;
      inflado = true;
    }
    if (b < INFLA * 0.6) inflado = false;
    const sube = -trasladoDe(dom.de('cuerpo', 'transform'))[1];
    visto.flota = Math.max(visto.flota, sube);
    if (sube > 1 && subeEn === Infinity) subeEn = u;
    if (dom.de('lengua', 'opacity') === '1') visto.lengua = Math.max(visto.lengua, lenguaDe(dom.de('lengua', 'transform')));
    visto.mosca = Math.min(visto.mosca, Number(dom.de('mosca', 'opacity')));
    if (i === 60 * 2) visto.accion = vivo.estado().accion ?? '';
  }
  assert.ok(visto.peluca > SALTA * 0.9, `la peluca saltó ${visto.peluca.toFixed(0)}`);
  assert.ok(visto.anteojos > -SUBE[1] * 0.98, 'no se levantó los anteojos');
  assert.equal(visto.croadas, CROADAS, `croó ${visto.croadas} veces`);
  assert.ok(visto.buche > INFLA * 0.98 && visto.flota > FLOTA * 0.95, 'el buche no la levantó');
  // El cuerpo llega después que el buche: primero se infla y recién después la levanta.
  assert.ok(subeEn > TOQUE_T.croa[0] + 0.2, `subió a los ${subeEn.toFixed(2)} s, junto con el buche`);
  assert.ok(visto.lengua > 0.95 && visto.mosca < 0.02, 'no se comió la mosca');
  assert.equal(visto.accion, 'croa');
  // Al final está recostada otra vez, con los anteojos puestos, y hay otra mosca.
  assert.equal(trasladoDe(dom.de('cuerpo', 'transform'))[1], 0);
  assert.ok(-trasladoDe(dom.de('anteojos', 'transform'))[1] < 0.1 && Number(dom.de('mosca', 'opacity')) > 0.98, 'quedó sin anteojos o sin mosca');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarla la pasa de recostada a croando, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarRanaCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('buche', 'transform'), marcas(CROA).transform.buche);
  assert.equal(dom.de('anteojos', 'transform'), marcas(CROA).transform.anteojos);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('buche', 'transform'), marcas(QUIETO).transform.buche);
});
