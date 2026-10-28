import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_GALLOS } from './arte-gallos.ts';
import { GALLO, GALLOS, PAREJA, QUIETO, RINA, TRAGO, alRecinto, bocaYPico, cerradoDe, enLaPareja, type Punto } from './rig-gallos.ts';
import { SATURNO } from './rig-saturno.ts';
import { MOMO, marcoDelRecinto } from './rig.ts';
import { VECINOS_DEL_TEMPLO, escenaTemplo } from './escenas.ts';
import { DURA, RINA_T, armarGallosCon, type Accion } from '../../scripts/bestiario/gallos.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * Los gallos sofocados (`D-73`, vigesimotercera vuelta): que sean un títere entero a aerógrafo, apoyados uno
 * en el otro en el ala derecha del templo sin encimarse con nadie, que la botella le llegue al pico cuando
 * toma, que tocados armen la riña y terminen abrazados, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'los-gallos-sofocados';
const figura = capasDe('el-templo', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_GALLOS.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--gallos');

test('los gallos son un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--gallos" data-id="los-gallos-sofocados" role="button" tabindex="0" aria-label="Los gallos sofocados">/);
  const partes = ['entero', 'tambaleo', 'plumas', 'cacareo', 'hipo'];
  for (const g of ['a', 'b']) partes.push(...['gallo', 'pata-1', 'pata-2', 'infla', 'cola', 'ala', 'cuello', 'parpado', 'pico', 'barba', 'cresta'].map((p) => (p.startsWith('pata') ? `pata-${g}-${p.slice(5)}` : `${p}-${g}`)));
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `a los gallos les falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_GALLOS.map((p) => p.nombre).sort());
  for (const g of ['a', 'b']) {
    for (const n of [0, 1] as const) {
      assert.ok(adentro(`gallos-${g}-pata-${n + 1}`, GALLO.caderas[n]) && adentro(`gallos-${g}-cuerpo`, GALLO.caderas[n]), `la pata ${n + 1} de ${g} no sale de la cadera`);
      assert.ok(adentro(`gallos-${g}-pata-${n + 1}`, GALLO.pies[n]), `el pie ${n + 1} de ${g} se sale de su pata`);
    }
    assert.ok(adentro(`gallos-${g}-cola`, GALLO.rabadilla) && adentro(`gallos-${g}-cuerpo`, GALLO.rabadilla), `la cola de ${g} no sale de la rabadilla`);
    assert.ok(adentro(`gallos-${g}-ala`, GALLO.hombro) && adentro(`gallos-${g}-cuerpo`, GALLO.hombro), `el ala de ${g} no sale del hombro`);
    assert.ok(adentro(`gallos-${g}-cabeza`, GALLO.cuello) && adentro(`gallos-${g}-cuerpo`, GALLO.cuello), `el pescuezo de ${g} no se apoya en el cuerpo`);
    assert.ok(adentro(`gallos-${g}-cabeza`, GALLO.ojo) && adentro(`gallos-${g}-parpado`, GALLO.ojo), `el ojo de ${g} no está en la cara`);
    assert.ok(adentro(`gallos-${g}-cresta`, GALLO.cresta) && adentro(`gallos-${g}-cabeza`, GALLO.cresta), `la cresta de ${g} no está en la cabeza`);
    assert.ok(adentro(`gallos-${g}-pico`, GALLO.comisura) && adentro(`gallos-${g}-cabeza`, GALLO.comisura), `el pico de ${g} no se abre en la cara`);
    assert.ok(adentro(`gallos-${g}-barba`, GALLO.barba) && adentro(`gallos-${g}-cabeza`, GALLO.barba), `la barba de ${g} no cuelga de la cara`);
  }
  assert.ok(adentro('gallos-a-pata-2', GALLO.espolon), 'el espolón no está en la pata');
  assert.ok(adentro('gallos-a-ala', GALLO.punta) && adentro('gallos-botella', GALLO.punta) && adentro('gallos-botella', GALLO.boca), 'la botella no está en el ala');
  assert.ok(adentro('gallos-cacareo', GALLO.pico) && adentro('gallos-hipo', GALLO.pico), 'el cacareo y el hipo no salen del pico');
  for (const p of PIEZAS_GALLOS) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['gallos-a-cuerpo', 'gallos-b-cuerpo', 'gallos-a-cabeza', 'gallos-b-cabeza']) assert.match(PIEZAS_GALLOS.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_GALLOS.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de los gallos están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨los gallos sofocados⟩'), tokens.indexOf('⟨/los gallos sofocados⟩'));
  const usadas = new Set(PIEZAS_GALLOS.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-gallos-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de los gallos`);
  assert.match(bloque, /momo-sampler/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨los gallos sofocados⟩ */'), sitio.indexOf('/* ⟨/los gallos sofocados⟩ */'));
  assert.ok(suyo.includes('.titere--gallos'));
  for (const clase of new Set([...figura.matchAll(/class="(bt-gallos-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('se apoyan en el ala derecha del templo: adentro del marco, lejos del Dr. Saturno y de Momo, sin tapar ojos de nadie', () => {
  const marco = marcoDelRecinto('el-templo');
  // Lo que ocupan: de la punta de la cola del del espolón a la del flaco, y de las crestas al piso.
  const [x0] = alRecinto(enLaPareja(0, [-118, 0]));
  const [x1] = alRecinto(enLaPareja(1, [-118, 0]));
  const y0 = alRecinto([0, -230])[1];
  assert.ok(x0 > marco.x && x1 < marco.x + marco.ancho, 'se salen del templo');
  assert.ok(x0 - (SATURNO.x + 86) > 20, 'se le encima al Dr. Saturno');
  assert.ok(x0 - MOMO.argolla.x > 400, 'Momo les pega cuando se hamaca');
  for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_TEMPLO)) {
    if (id === ID) continue;
    assert.ok(!(ox > x0 - 12 && ox < x1 + 12 && oy > y0 - 12 && oy < GALLOS.piso + 12), `${id} queda adentro de los gallos`);
  }
  // Pisan el piso del templo, como el Morta y el santo, y van en la figura: delante del fondo.
  assert.ok(Math.abs(GALLOS.piso - SATURNO.piso) <= 6);
  const escena = escenaTemplo(nombres);
  assert.ok(escena.indexOf('/bestiario/templo-lejos.webp') < escena.indexOf(`data-marco="${ID}"`));
  // Se miran: el del espolón a la izquierda, el flaco a la derecha y espejado.
  assert.ok(PAREJA.a < 0 && PAREJA.b > 0);
});

test('cuando toma, la boca de la botella le llega al pico', () => {
  const { boca, pico } = bocaYPico(TRAGO.ala, TRAGO.cuello);
  assert.ok(Math.hypot(boca[0] - pico[0], boca[1] - pico[1]) < 8, `la botella queda a ${Math.hypot(boca[0] - pico[0], boca[1] - pico[1]).toFixed(0)} del pico`);
  // Quieta, cuelga para abajo y gotea.
  assert.ok(GALLO.boca[1] > GALLO.punta[1]);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarGallosCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('viven el fin de fiesta: cabecean, el flaco hipa, se acomodan las plumas, se pican, toman, y pestañean', () => {
  const hechas: Record<Accion, number> = { cabecean: 0, hipo: 0, plumas: 0, picotazo: 0, trago: 0, rina: 0 };
  let pestaneos = 0;
  let hipos = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarGallosCon(dom.marcos, esc, azar(semilla));
    const cerrado = [false, false];
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      (['a', 'b'] as const).forEach((g, n) => {
        const c = cerradoDe(dom.de(`parpado-${g}`, 'transform')) > 0.9;
        if (c && !cerrado[n]) pestaneos++;
        cerrado[n] = c;
      });
      if (Number(dom.de('hipo', 'opacity')) > 0.9) hipos++;
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['cabecean', 'hipo', 'plumas', 'picotazo', 'trago'] as const) assert.ok(hechas[a] > 0, `nunca hicieron ${a}`);
  assert.equal(hechas.rina, 0, 'se pelearon sin que los toquen');
  assert.ok(pestaneos >= 20, `pestañearon ${pestaneos} veces`);
  assert.ok(hipos > 0, 'el hipo no se vio');
});

test('tocados arman la riña: se inflan, el espolón patea, vuelan plumas, el cacareo se ahoga, terminan abrazados, vuelven y dicen su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarGallosCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  const quieta = dom.foto();
  dom.oyentes.get('click')!({});
  let salto = 0;
  let plumas = 0;
  let cacareo = 0;
  let hipo = 0;
  let patada = 0;
  let abrazo = 0;
  for (let i = 1; i <= 60 * DURA.rina; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    salto = Math.max(salto, -trasladoDe(dom.de('gallo-a', 'transform'))[1]);
    plumas = Math.max(plumas, Number(dom.de('plumas', 'opacity')));
    cacareo = Math.max(cacareo, Number(dom.de('cacareo', 'opacity')));
    hipo = Math.max(hipo, Number(dom.de('hipo', 'opacity')));
    const pat = /rotate\(([-\d.]+)/.exec(dom.de('pata-a-2', 'transform'));
    patada = Math.min(patada, Number(pat?.[1] ?? 0));
    const u = t - 1;
    if (u > RINA_T.abrazan[0] + 0.6 && u < RINA_T.abrazan[1]) {
      const ala = /rotate\(([-\d.]+)/.exec(dom.de('ala-a', 'transform'));
      abrazo = Math.min(abrazo, Number(ala?.[1] ?? 0));
    }
  }
  assert.ok(salto > 20, `el del espolón saltó ${salto.toFixed(0)}`);
  assert.ok(patada < -50, 'no pateó con el espolón');
  assert.ok(plumas > 0.9, 'no volaron plumas');
  assert.ok(cacareo > 0.6, 'no cacareó');
  assert.ok(hipo > 0.9, 'al flaco no le agarró el hipo');
  assert.ok(abrazo < -60, 'no terminaron abrazados');
  assert.equal(vivo.estado().accion, 'rina');
  // Al final volvieron a apoyarse: casi la pose de antes (lo que respira y se tambalea sigue).
  const despues = dom.foto();
  assert.ok(Math.abs(trasladoDe(despues['gallo-a']!.split('|')[0]!)[0] - trasladoDe(quieta['gallo-a']!.split('|')[0]!)[0]) < 2, 'no volvieron a su lugar');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueven: tocarlos los pasa de apoyados a la riña y dicen su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarGallosCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('cacareo', 'opacity'), String(RINA.cacareo));
  assert.equal(dom.de('plumas', 'opacity'), String(RINA.plumas));
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('plumas', 'opacity'), String(QUIETO.plumas));
});
