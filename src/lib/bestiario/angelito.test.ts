import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { ANGELITO_PERSONAJE, PIEZAS_ANGELITO } from './arte-angelito.ts';
import { ANGELITO, ANGELITO_ARMADO as A, FRITO, QUIETO, alRecinto, marcas, type Punto } from './rig-angelito.ts';
import { OJOS_DEL_ARBOL, ARBOL } from './rig-entornos.ts';
import { escenaArbol } from './escenas-entornos.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS, K_ENTORNO } from './camino.ts';
import { DURA, SUBE_AUREOLA, armarAngelitoCon, momentoDelToque, base, type Accion } from '../../scripts/bestiario/angelito.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * El angelito frito (`D-73`, vigesimoctava vuelta): que sea un títere entero sentado en un cráter al pie del árbol, del lado del
 * galpón, que no esté más pintado en el piso, que tosa, se acomode la aureola, patee al brote y haga contacto por su cuenta, que
 * tocado lo cruce la corriente (huesos, pelo, aureola volando) y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-angelito-frito';
const figura = capasDe('el-arbol', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_ANGELITO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--angelito');
const primero = (re: RegExp, texto: string, otro = 0): number => Number(re.exec(texto)?.[1] ?? otro);

test('el angelito es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--angelito" data-id="el-angelito-frito" role="button" tabindex="0" aria-label="El angelito frito">/);
  for (const p of ['entero', 'cuerpo', 'torso', 'cabeza', 'pelo', 'pupilas', 'craneo', 'aureola', 'ala-1', 'ala-2', 'brasas', 'brasas-1', 'brasas-2', 'esqueleto', 'brazo', 'chispas', 'pie', 'brote', 'tos', 'humo-1', 'humo-2', 'humo-3']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al angelito le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_ANGELITO.map((p) => p.nombre).sort());
  for (const p of PIEZAS_ANGELITO) assert.match(p.nombre, /^angelito-/);
  for (const n of [0, 1] as const) assert.ok(adentro('angelito-cabeza', A.ojos[n]) && adentro('angelito-pupilas', A.ojos[n]) && adentro('angelito-craneo', A.ojos[n]), `el ojo ${n + 1} no está en la cara`);
  assert.ok(adentro('angelito-cabeza', A.cuello) && adentro('angelito-cuerpo', A.cuello), 'la cabeza no se apoya en el cogote');
  assert.ok(adentro('angelito-cabeza', A.boca), 'la boca no está en la cara');
  assert.ok(adentro('angelito-brazo', A.hombro) && adentro('angelito-cuerpo', A.hombro), 'el brazo no sale del hombro');
  assert.ok(adentro('angelito-brazo', A.enchufe) && adentro('angelito-chispas', A.enchufe), 'las chispas no salen del enchufe');
  assert.ok(adentro('angelito-pie', A.tobillo), 'el pie no sale del tobillo');
  assert.ok(adentro('angelito-brote', A.brote), 'el brote no sale de la tierra');
  assert.ok(adentro('angelito-ala-1', A.hombroAla) && adentro('angelito-ala-2', A.hombroAla), 'las alas no salen de la espalda');
  assert.ok(adentro('angelito-aureola', A.aureola), 'la aureola no está sobre la cabeza');
  assert.ok(A.aureola[1] < A.cabeza[1] - A.radio, 'la aureola le tapa la cara');
  for (const p of PIEZAS_ANGELITO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['angelito-cuerpo', 'angelito-cabeza', 'angelito-pelo', 'angelito-aureola']) assert.match(PIEZAS_ANGELITO.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_ANGELITO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 260, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del angelito están en su bloque de tokens.css, medidas en Último bondi, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el angelito frito⟩'), tokens.indexOf('⟨/el angelito frito⟩'));
  const usadas = new Set(PIEZAS_ANGELITO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-angelito-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del angelito`);
  assert.match(bloque, /public\/tapas\/ultimo-bondi-a-finisterre\.jpg/);
  assert.match(bloque, /no tiene verde/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el angelito frito⟩ */'), sitio.indexOf('/* ⟨/el angelito frito⟩ */'));
  assert.match(suyo, /\.titere--angelito \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"humo-1"') && suyo.includes('"chispas"'));
});

test('está caído al pie del árbol, del lado del galpón, donde estaban sus ojos, y ya no está pintado en el piso', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'el-arbol');
  assert.equal(ANGELITO_PERSONAJE.ancla, ANGELITO.x);
  const [ox, oy] = OJOS_DEL_ARBOL[ID]!;
  const [x0, y0] = alRecinto([-216, -170]);
  const [x1] = alRecinto([100, 0]);
  assert.ok(ox > x0 && ox < x1 && oy > y0 && oy < ANGELITO.piso + 20, 'no está donde lo miraban');
  // Entra en la pantalla y no pisa al tronco: queda a la izquierda de su base.
  assert.ok(x0 >= -40 && x1 < ARBOL.tronco.x - ARBOL.tronco.ancho, `ocupa de ${x0.toFixed(0)} a ${x1.toFixed(0)}`);
  // Y los demás ojos del árbol no quedan adentro de él.
  for (const [id, [vx, vy]] of Object.entries(OJOS_DEL_ARBOL)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 + 40 && vx < x1 && vy > oy - 40 && vy < ANGELITO.piso + 10), `${id} queda adentro del angelito`);
  }
  const escena = escenaArbol(nombres);
  assert.ok(escena.indexOf('/bestiario/arbol-piso.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso lo tapa');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8'), /at\('el-angelito-frito'\)/, 'sigue pintado en el piso del árbol');
  const piso = pisoDelCamino(CAMINOS['el-arbol']!, nombres);
  const m = /data-marco="el-angelito-frito" data-capa="figura" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no está en el árbol del camino');
  assert.equal(Number(m![1]), Math.round(ANGELITO.x * (K_ENTORNO - 1)));
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarAngelitoCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.equal(marcas(QUIETO).opacity.chispas, '0');
  assert.equal(marcas(QUIETO).opacity.esqueleto, '0');
});

test('por su cuenta tose, se acomoda la aureola, patea al brote, hace contacto y mira su ala, y siempre humea', () => {
  const hechas: Record<Accion, number> = { tos: 0, aureola: 0, patea: 0, contacto: 0, ala: 0, frito: 0 };
  const vistos = { tos: 0, chispa: 0, bajaAureola: 0, pie: 0, brote: 0, huesoSolo: 0, pelo: 1 };
  const humos = new Set<string>();
  const brasas = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarAngelitoCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 80; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      vistos.tos = Math.max(vistos.tos, Number(dom.de('tos', 'opacity')));
      vistos.chispa = Math.max(vistos.chispa, Number(dom.de('chispas', 'opacity')));
      vistos.bajaAureola = Math.max(vistos.bajaAureola, primero(/translate\(-?[\d.]+ (-?[\d.]+)\)/, dom.de('aureola', 'transform')));
      vistos.pie = Math.max(vistos.pie, primero(/rotate\((-?[\d.]+)/, dom.de('pie', 'transform')));
      vistos.brote = Math.max(vistos.brote, primero(/rotate\((-?[\d.]+)/, dom.de('brote', 'transform')));
      vistos.huesoSolo = Math.max(vistos.huesoSolo, Number(dom.de('esqueleto', 'opacity')));
      vistos.pelo = Math.max(vistos.pelo, primero(/scale\(-?[\d.]+ (-?[\d.]+)\)/, dom.de('pelo', 'transform'), 1));
      if (i % 4 === 0) {
        humos.add(dom.de('humo-1', 'transform'));
        brasas.add(dom.de('brasas', 'opacity'));
      }
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['tos', 'aureola', 'patea', 'contacto', 'ala'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.frito, 0, 'lo cruzó la corriente sin que lo toquen');
  assert.ok(vistos.tos > 0.5 && vistos.chispa > 0.5 && vistos.bajaAureola > 6 && vistos.pie > 15 && vistos.brote > 8, JSON.stringify(vistos));
  // Solo, el hueso es de un instante y de a medias; el pelo se le para un poco, no del todo.
  assert.ok(vistos.huesoSolo <= 0.51 && vistos.pelo < FRITO.pelo, 'se achicharró solo');
  assert.ok(humos.size > 50 && brasas.size > 30, `humo ${humos.size} brasas ${brasas.size}`);
});

test('tocado lo cruza la corriente: chispas, huesos tres veces, el pelo parado, la aureola vuela y vuelve torcida para el otro lado, y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarAngelitoCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  const antes = primero(/rotate\((-?[\d.]+)/, dom.de('aureola', 'transform'));
  dom.oyentes.get('click')!({});
  let huesos = 0;
  let hueso = false;
  let pelo = 1;
  let alto = 0;
  let chispas = 0;
  let alas = 0;
  for (let i = 1; i <= 60 * DURA.frito; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const e = Number(dom.de('esqueleto', 'opacity'));
    if (e > 0.9 && !hueso) {
      huesos++;
      hueso = true;
    }
    if (e < 0.3) hueso = false;
    pelo = Math.max(pelo, primero(/scale\(-?[\d.]+ (-?[\d.]+)\)/, dom.de('pelo', 'transform'), 1));
    alto = Math.max(alto, -primero(/translate\(-?[\d.]+ (-?[\d.]+)\)/, dom.de('aureola', 'transform')));
    chispas = Math.max(chispas, Number(dom.de('chispas', 'opacity')));
    alas = Math.max(alas, primero(/rotate\((-?[\d.]+)/, dom.de('ala-2', 'transform')));
  }
  assert.equal(huesos, 3, `se le vieron los huesos ${huesos} veces`);
  assert.ok(pelo > FRITO.pelo * 0.97 && alto > SUBE_AUREOLA * 0.9 && chispas > 0.9 && alas > FRITO.alas[1] * 0.9, `pelo ${pelo} aureola ${alto} chispas ${chispas} alas ${alas}`);
  assert.equal(vivo.estado().hechas.frito, 1);
  // Ya terminó: vuelve a la pose de base, con la aureola torcida para el otro lado.
  poner(1 + DURA.frito + 0.5);
  vivo.mover(1 + DURA.frito + 0.5, 1 / 60);
  const despues = primero(/rotate\((-?[\d.]+)/, dom.de('aureola', 'transform'));
  assert.ok(antes < -8 && despues > 8, `la aureola pasó de ${antes} a ${despues}`);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
  assert.ok(momentoDelToque(base(5), 0.01).temblor.length === 2);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de sentado a frito, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarAngelitoCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('esqueleto', 'opacity'), marcas(FRITO).opacity.esqueleto);
  assert.equal(dom.de('pelo', 'transform'), marcas(FRITO).transform.pelo);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('pelo', 'transform'), marcas(QUIETO).transform.pelo);
});
