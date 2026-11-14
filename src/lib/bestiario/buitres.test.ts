import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { BUITRES_PERSONAJE, PIEZAS_BUITRES } from './arte-buitres.ts';
import { BUITRE, BUITRES, CHOCAN, ENCIMA, LUGARES, QUIETO, alRecinto, marcas, type Punto } from './rig-buitres.ts';
import { CYBER } from './rig-entornos.ts';
import { escenaCybersiberia } from './escenas-entornos.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS, K_ENTORNO } from './camino.ts';
import { DURA, TOQUE_T, armarBuitresCon, base, type Accion } from '../../scripts/bestiario/buitres.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * Los buitres de la tele (`D-73`, vigesimoctava vuelta): dos buitres a aerógrafo parados en un travesaño atado a la
 * antena, con la servilleta en la gorguera y el tenedor y el cuchillo, esperando; que esperen, cuchicheen, se afilen los
 * cubiertos con chispa y se les suelte una servilleta, que tocados giren de golpe y levanten los cubiertos, y que la pose de
 * la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string; cantidad?: number }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'los-buitres-de-la-tele';
const figura = capasDe('cybersiberia', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_BUITRES.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--buitres');
const giro = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
const escalaY = (transform: string): number => Number(/scale\(1 (-?[\d.]+)\)/.exec(transform)?.[1] ?? NaN);

test('los buitres son un títere entero: dos, con cada pieza que mueve la isla y su imagen', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.cantidad, 2);
  assert.match(figura, /<g class="titere titere--buitres" data-id="los-buitres-de-la-tele" role="button" tabindex="0" aria-label="Los buitres de la tele">/);
  const partes = ['entero', 'chispa'];
  for (const n of [1, 2]) partes.push(`buitre-${n}`, `cuerpo-${n}`, `cuello-${n}`, `parpado-${n}`, `servilleta-${n}`, `cubierto-${n}`);
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `a los buitres les falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_BUITRES.map((p) => p.nombre).sort());
  for (const p of PIEZAS_BUITRES) assert.match(p.nombre, /^buitres-/);
  // Se miran: el de la derecha va espejado, y cada uno lleva su cubierto (tenedor y cuchillo).
  assert.deepEqual(LUGARES.map((l) => l.mira), [1, -1]);
  assert.ok(figura.includes('buitres-tenedor') && figura.includes('buitres-cuchillo'));
  const A = BUITRE;
  assert.ok(adentro('buitres-cuello-a', A.cuello) && adentro('buitres-cuerpo-a', A.cuello), 'el cuello no sale de la gorguera');
  assert.ok(figura.indexOf('data-parte="cuello-1"') < figura.indexOf('data-parte="cuerpo-1"'), 'la gorguera tapa la base del cuello');
  assert.ok(adentro('buitres-cuello-a', A.ojo.centro) && adentro('buitres-parpado', A.ojo.centro), 'el ojo no está en la cara');
  assert.ok(adentro('buitres-servilleta', A.servilleta) && adentro('buitres-cuerpo-a', A.servilleta), 'la servilleta no está en la gorguera');
  assert.ok(adentro('buitres-tenedor', A.mano) && adentro('buitres-cuchillo', A.mano) && adentro('buitres-cuerpo-a', A.mano), 'los cubiertos no salen de la mano');
  // Los dos se paran en el travesaño, y la chispa del choque cae en el medio.
  const [tx, , tw] = caja('buitres-travesano');
  for (const l of LUGARES) assert.ok(l.x - 70 > tx && l.x + 50 < tx + tw, 'un buitre se sale del travesaño');
  assert.ok(adentro('buitres-chispa', CHOCAN));
  // Ningún cubierto cruza una cara: con el giro más grande (el toque, el afilado con el golpe) las puntas quedan abajo del pico.
  for (const grados of [ENCIMA.cubierto[0], 24]) {
    const a = (grados * Math.PI) / 180;
    const [mx, my] = A.mano;
    for (const [dx, dy] of [[11, -34], [12, -24]] as const) {
      const y = my + dx * Math.sin(a) + dy * Math.cos(a);
      assert.ok(y > A.pico[1] + 20, `un cubierto llega a y = ${y.toFixed(0)} y el pico está en ${A.pico[1]}`);
    }
  }
  // El travesaño está atado a la antena: hay tirantes hasta la abrazadera.
  assert.ok(PIEZAS_BUITRES.find((p) => p.nombre === 'buitres-travesano')!.dibujo.includes('M-132 6 L30 56'), 'faltan los tirantes del travesaño');
  for (const p of PIEZAS_BUITRES) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['buitres-cuerpo-a', 'buitres-cuello-b', 'buitres-travesano']) assert.match(PIEZAS_BUITRES.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_BUITRES.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 30 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de los buitres están en su bloque de tokens.css, medidas en Último bondi, y su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨los buitres de la tele⟩'), tokens.indexOf('⟨/los buitres de la tele⟩'));
  const usadas = new Set(PIEZAS_BUITRES.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-buitres-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 9);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de los buitres`);
  assert.match(bloque, /public\/tapas\/ultimo-bondi-a-finisterre\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨los buitres de la tele⟩ */'), sitio.indexOf('/* ⟨/los buitres de la tele⟩ */'));
  assert.match(suyo, /\.titere--buitres \{ cursor: pointer; \}/);
  assert.match(suyo, /\[data-parte="chispa"\] \{ pointer-events: none; \}/);
});

test('esperan arriba de la tele, en la punta izquierda de la antena: sobre su silueta de antes, sin pisar nada, en el recinto y en el camino', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'cybersiberia');
  assert.equal(BUITRES_PERSONAJE.ancla, BUITRES.x);
  // Arriba de la tele y cerca de la punta de la antena que usaban.
  assert.ok(Math.abs(BUITRES.x - CYBER.antena.izq[0]) < 40 && Math.abs(BUITRES.piso - CYBER.antena.izq[1]) < 40, 'se mudaron lejos de la antena');
  const [x0, y0] = alRecinto([-160, -112]);
  const [x1, y1] = alRecinto([160, 22]);
  assert.ok(y1 < CYBER.tele.piso - CYBER.tele.alto, `los buitres llegan hasta y = ${y1.toFixed(0)} y la tele empieza en ${CYBER.tele.piso - CYBER.tele.alto}`);
  assert.ok(x0 > 0 && y0 > 0 && x1 < CYBER.tele.x + CYBER.tele.ancho / 2, 'se salen de la escena o pisan la otra punta de la antena');
  const escena = escenaCybersiberia(nombres);
  assert.ok(escena.includes(`data-marco="${ID}"`));
  assert.ok(!escena.includes(`data-id="${ID}" class="bestia`), 'sigue siendo una cosa');
  const tramo = CAMINOS.cybersiberia!;
  const piso = pisoDelCamino(tramo, nombres);
  const m = new RegExp(`data-marco="${ID}" data-capa="figura" data-dx="(-?\\d+)"`).exec(piso);
  assert.ok(m, 'no están en Cybersiberia del camino');
  assert.equal(Number(m![1]), Math.round(BUITRES.x * (K_ENTORNO - 1)));
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarBuitresCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.equal(marcas(QUIETO).opacity.chispa, '0');
});

test('esperan: miran la tele y tamborilean, cuchichean, se afilan con chispa, a uno se le suelta la servilleta; el segundo pestañea después del primero', () => {
  const hechas: Record<string, number> = {};
  let tambor = 0;
  let chispa = 0;
  let servilleta = 0;
  let cuello = 0;
  let pestaneos1 = 0;
  let pestaneos2 = 0;
  let cerrado1 = false;
  let cerrado2 = false;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarBuitresCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 80; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      tambor = Math.max(tambor, Math.abs(giro(dom.de('cubierto-1', 'transform')) - QUIETO.cubierto[0]) > 6 ? 1 : 0, 0);
      chispa = Math.max(chispa, Number(dom.de('chispa', 'opacity')));
      servilleta = Math.max(servilleta, giro(dom.de('servilleta-1', 'transform')));
      cuello = Math.max(cuello, giro(dom.de('cuello-2', 'transform')));
      const c1 = escalaY(dom.de('parpado-1', 'transform')) > 0.9;
      const c2 = escalaY(dom.de('parpado-2', 'transform')) > 0.9;
      if (c1 && !cerrado1) pestaneos1++;
      if (c2 && !cerrado2) pestaneos2++;
      cerrado1 = c1;
      cerrado2 = c2;
      assert.ok(Number(dom.de('chispa', 'opacity')) <= 1);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a] = (hechas[a] ?? 0) + n;
  }
  for (const a of ['espera', 'cuchichea', 'afila', 'servilleta'] as Accion[]) assert.ok((hechas[a] ?? 0) > 0, `nunca hicieron ${a}`);
  assert.equal(hechas.toque ?? 0, 0);
  assert.equal(tambor, 1, 'no tamborilearon');
  assert.ok(chispa > 0.8, `la chispa llegó a ${chispa}`);
  assert.ok(servilleta > 40, `la servilleta se levantó ${servilleta.toFixed(0)}°`);
  assert.ok(cuello > 15, 'no bajaron la vista');
  assert.ok(pestaneos1 >= 8 && pestaneos2 >= 8, `pestañearon ${pestaneos1} y ${pestaneos2} veces`);
  // Lo que cuelga llega después: en la base la servilleta de uno y otro no van parejas.
  assert.notEqual(base(3, () => -1).servilleta[0], -base(3, () => -1).servilleta[1]);
});

test('tocados giran de golpe, estiran el cogote, abren los ojos, levantan los cubiertos, asienten tres veces y se hacen los distraídos; dicen su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarBuitresCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { rapido: 0, estira: 0, abiertos: 1, cubierto: 0, asienten: 0, distraidos: 0, ojos: 0 };
  let sube = false;
  let previo = -1e9;
  for (let i = 1; i <= 60 * DURA.toque; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const c = giro(dom.de('cuello-1', 'transform'));
    if (u < 0.5) visto.rapido = Math.max(visto.rapido, previo === -1e9 ? 0 : Math.abs(c - previo));
    previo = c;
    visto.estira = Math.max(visto.estira, escalaY(dom.de('cuello-1', 'transform')) ? Number(/scale\(1 ([\d.]+)\)/.exec(dom.de('cuello-1', 'transform'))?.[1]) : 0);
    visto.abiertos = Math.min(visto.abiertos, escalaY(dom.de('parpado-1', 'transform')));
    visto.cubierto = Math.max(visto.cubierto, giro(dom.de('cubierto-1', 'transform')));
    if (u > 0.8 && u < 2.1) {
      const sube2 = c > ENCIMA.cuello[0] + 4;
      if (sube2 && !sube) visto.asienten++;
      sube = sube2;
    }
    if (u > TOQUE_T.disimula[0] + 0.7 && u < TOQUE_T.disimula[1]) {
      visto.distraidos = Math.max(visto.distraidos, -giro(dom.de('cuello-1', 'transform')));
      visto.ojos = Math.max(visto.ojos, escalaY(dom.de('parpado-1', 'transform')));
    }
  }
  assert.ok(visto.rapido > 0.5, `no giraron de golpe (${visto.rapido.toFixed(2)}° por cuadro)`);
  assert.ok(visto.estira > 1.12 && visto.abiertos < 0.1, 'no estiraron el cogote o no abrieron los ojos');
  assert.ok(visto.cubierto > 7, 'no levantaron los cubiertos');
  assert.ok(visto.asienten >= 3, `asintieron ${visto.asienten} veces`);
  assert.ok(visto.distraidos > 15 && visto.ojos > 0.5, 'no se hicieron los distraídos');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlos los pasa de esperar a estar encima, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarBuitresCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('cuello-1', 'transform'), marcas(ENCIMA).transform['cuello-1']);
  assert.equal(dom.de('chispa', 'opacity'), marcas(ENCIMA).opacity.chispa);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('cuello-1', 'transform'), marcas(QUIETO).transform['cuello-1']);
});
