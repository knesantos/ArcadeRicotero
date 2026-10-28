import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_LOBAS, RETRATO } from './arte-lobas.ts';
import { AULLAN, CAIDA, ECHADAS, LOBAS, LOBA_ARMADO, QUIETO, VERSO, VUELTA, alRecinto, enLaVuelta, type Punto } from './rig-lobas.ts';
import { VECINOS_DEL_MONTE, escenaMonte } from './escena-monte.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { ACECHO } from './rig.ts';
import { DURA, REVIVE_T, armarLobasCon, type Accion } from '../../scripts/bestiario/lobas.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * Las antiguas lobas (`D-73`, vigesimotercera vuelta): que sean dos títeres enteros a aerógrafo, echadas al
 * pie de las tiras del monte sin taparle los ojos a nadie ni meterse donde asoma el lobo, que solas se hagan
 * las muertas sin un bucle, que tocadas revivan (se paran, se sacuden, aúllan, trotan de jóvenes y se vuelven
 * a echar), y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; tema?: string; cantidad?: number }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'las-antiguas-lobas';
const figura = capasDe('el-monte', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_LOBAS.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--lobas');
/** Lo que baja el cuerpo de una loba, leído de su `alza`: CAIDA es echada, 0 parada. */
const baja = (dom: ReturnType<typeof nuevo>, n: 1 | 2): number => trasladoDe(dom.de(`alza-${n}`, 'transform'))[1];

test('las lobas son dos títeres enteros: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--lobas" data-id="las-antiguas-lobas" role="button" tabindex="0" aria-label="Las antiguas lobas">/);
  const partes = ['loba', 'alza', 'torso', 'joven', 'cola', 'pata-dc', 'pata-dl', 'pata-tc', 'pata-tl', 'cabeza', 'boca', 'quijada', 'lengua', 'parpado', 'oreja', 'vaho', 'cruje', 'polvo'];
  for (const n of [1, 2]) for (const p of partes) assert.ok(figura.includes(`data-parte="${p}-${n}"`), `a la loba ${n} le falta ${p}`);
  assert.equal(datos.bestias.find((b) => b.id === ID)!.cantidad, 2);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_LOBAS.map((p) => p.nombre).sort());
  const A = LOBA_ARMADO;
  for (const n of [1, 2]) {
    const torso = `lobas-torso-${n}`;
    assert.ok(adentro(torso, A.hombro) && adentro('lobas-pata-del', A.hombro), 'la pata de adelante no sale del hombro');
    assert.ok(adentro(torso, A.hombroLejos) && adentro('lobas-pata-del-lejos', A.hombroLejos), 'la pata de lejos no sale del hombro');
    assert.ok(adentro(torso, A.cadera) && adentro('lobas-pata-tras', A.cadera), 'la pata de atrás no sale de la cadera');
    assert.ok(adentro(torso, A.caderaLejos) && adentro('lobas-pata-tras-lejos', A.caderaLejos), 'la pata de atrás de lejos no sale de la cadera');
    assert.ok(adentro(torso, A.cola) && adentro('lobas-cola', A.cola), 'la cola no sale del anca');
    assert.ok(adentro(torso, A.cuello) && adentro(`lobas-cabeza-${n}`, A.cuello), 'la cabeza no se apoya en el cogote');
    assert.ok(adentro(torso, A.lomo) && adentro('lobas-joven', A.lomo) && adentro('lobas-polvo', A.lomo), 'el lomo no está en el cuerpo');
    assert.ok(adentro(`lobas-cabeza-${n}`, A.quijada) && adentro(`lobas-quijada-${n}`, A.quijada) && adentro('lobas-boca', A.quijada), 'la quijada no gira de atrás de la boca');
    assert.ok(adentro(`lobas-cabeza-${n}`, A.ojo) && adentro(`lobas-parpado-${n}`, A.ojo), 'el ojo no está en la cara');
    assert.ok(adentro(`lobas-cabeza-${n}`, A.oreja) && adentro(`lobas-oreja-${n}`, A.oreja), 'la oreja no sale del cráneo');
    assert.ok(adentro(`lobas-cabeza-${n}`, A.hocico), 'el hocico se sale de la cabeza');
  }
  // Las patas paradas llegan al piso, y la de adelante no se descose del hombro cuando se dobla echada.
  assert.ok(caja('lobas-pata-del')[1] + caja('lobas-pata-del')[3] >= 0 && caja('lobas-pata-tras')[1] + caja('lobas-pata-tras')[3] >= 0);
  assert.ok(caja('lobas-vaho')[0] > A.hocico[0] - 8, 'el vaho no sale del hocico');
  for (const p of PIEZAS_LOBAS) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['lobas-torso-1', 'lobas-torso-2', 'lobas-cabeza-1', 'lobas-cabeza-2', 'lobas-joven', 'lobas-pata-del']) assert.match(PIEZAS_LOBAS.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/, `${n} no tiene grano`);
  for (const n of ['lobas-torso-1', 'lobas-cabeza-1']) assert.match(PIEZAS_LOBAS.find((p) => p.nombre === n)!.dibujo, /url\(#soplo-m\)/, `${n} no está soplada`);
  const peso = PIEZAS_LOBAS.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de las lobas están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨las antiguas lobas⟩'), tokens.indexOf('⟨/las antiguas lobas⟩'));
  const usadas = new Set(PIEZAS_LOBAS.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-lobas-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de las lobas`);
  assert.match(bloque, /gulp\.jpg/);
  assert.equal(datos.bestias.find((b) => b.id === ID)!.tema, 'barbazul-versus-el-amor-letal');
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨las antiguas lobas⟩ */'), sitio.indexOf('/* ⟨/las antiguas lobas⟩ */'));
  for (const clase of new Set([...figura.matchAll(/class="(bt-lobas-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('están echadas al pie de las tiras: entre la tira de adelante y el lobo, sin taparle los ojos a nadie, y en el camino van donde estaban sus ojos', () => {
  const escena = escenaMonte(nombres);
  assert.ok(escena.includes(`data-marco="${ID}"`));
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'siguen siendo ojos en lo oscuro');
  // Lo que ocupan echadas y en la vuelta trotando: de la cola de una al hocico de la otra.
  const extremos = (n: 0 | 1, dx: number): number[] => [-100, 130].map((x) => alRecinto(n, [x, 0])[0] + dx);
  const echadas = [...extremos(0, 0), ...extremos(1, 0)];
  const [x0, x1] = [Math.min(...echadas), Math.max(...echadas)];
  assert.ok(x0 > 86, `echadas se meten detrás de la tira de adelante (${x0.toFixed(0)})`);
  assert.ok(x1 < ACECHO.desde + 20, `echadas se meten donde asoma el lobo (${x1.toFixed(0)})`);
  const [, y0] = alRecinto(0, [0, -150]);
  for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_MONTE)) {
    if (id === ID) continue;
    assert.ok(!(ox > x0 - 8 && ox < x1 + 8 && oy > y0 - 8 && oy < LOBAS.piso + 14), `${id} queda adentro de las lobas`);
  }
  // En la vuelta, la de atrás va siempre más arriba que la de adelante (nunca se cruzan mal), y vuelven a su lugar.
  for (let a = 0; a <= 2 * Math.PI + 1e-9; a += 0.05) {
    const [u, v] = [enLaVuelta(0, a), enLaVuelta(1, a)];
    assert.ok(ECHADAS[0].y + u.y < ECHADAS[1].y + v.y, 'en la vuelta la de atrás pasa por delante');
    assert.ok(LOBAS.x + ECHADAS[0].x + u.x > 0 && LOBAS.x + ECHADAS[1].x + v.x < ACECHO.desde + 60, 'la vuelta se sale del monte');
  }
  for (const n of [0, 1] as const) {
    const fin = enLaVuelta(n, 2 * Math.PI);
    assert.ok(Math.abs(fin.x) < 1e-6 && Math.abs(fin.y) < 1e-6 && fin.mira === ECHADAS[n].mira, `la ${n + 1} no vuelve a su lugar`);
    assert.equal(enLaVuelta(n, 0).mira, ECHADAS[n].mira, `la ${n + 1} arranca mirando para atrás`);
  }
  assert.ok(VUELTA.rx > 20);
  // En el camino caminan en el monte, corridas enteras adonde estaban sus ojos.
  const tramo = CAMINOS['el-monte']!;
  const piso = pisoDelCamino(tramo, nombres);
  const m = new RegExp(`data-marco="${ID}" data-capa="figura" data-dx="(-?\\d+)"`).exec(piso);
  assert.ok(m, 'no están en el monte del camino');
  assert.equal(Number(m[1]), Math.round(tramo.ojos[ID]![0] - LOBAS.x));
  assert.ok(!piso.includes(`bestia--ojos" data-id="${ID}"`), 'siguen siendo ojos en el camino');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarLobasCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  // Echadas, con los ojos cerrados.
  const dom = nuevo();
  assert.equal(baja(dom, 1), CAIDA);
  assert.equal(dom.de('parpado-2', 'opacity'), '1');
});

test('solas se hacen las muertas: respiran, espían, paran la oreja, se lamen, sueñan y bostezan, sin pararse', () => {
  const hechas: Record<Accion, number> = { oreja: 0, lame: 0, suena: 0, bosteza: 0, revive: 0 };
  let espiadas = 0;
  let quienes = new Set<number>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarLobasCon(dom.marcos, esc, azar(semilla));
    const torsos = new Set<string>();
    let abierto = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      for (const n of [1, 2] as const) assert.equal(baja(dom, n), CAIDA, 'se paró sin que la toquen');
      torsos.add(dom.de('torso-1', 'transform'));
      const ojo = Math.min(Number(dom.de('parpado-1', 'opacity')), Number(dom.de('parpado-2', 'opacity')));
      if (ojo < 0.1 && !abierto) espiadas++;
      abierto = ojo < 0.1;
      if (vivo.estado().accion) quienes.add(vivo.estado().quien);
      if (i % 30 === 0) for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
    }
    assert.ok(torsos.size > 100, 'no respiran');
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['oreja', 'lame', 'suena', 'bosteza'] as const) assert.ok(hechas[a] > 0, `nunca hicieron ${a}`);
  assert.equal(hechas.revive, 0, 'revivieron sin que las toquen');
  assert.deepEqual([...quienes].sort(), [0, 1], 'siempre hace lo suyo la misma');
  assert.ok(espiadas >= 15, `espiaron ${espiadas} veces`);
});

test('tocadas reviven: se paran, se sacuden el polvo, aúllan con vaho, trotan una vuelta de jóvenes, se vuelven a echar y dicen su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarLobasCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const maximo: Record<string, number> = {};
  const anotar = (k: string, v: number): void => void (maximo[k] = Math.max(maximo[k] ?? -Infinity, v));
  let paradaAntesDeAullar = true;
  for (let i = 1; i <= 60 * DURA.revive; i++) {
    const t = 1 + i / 60;
    const u = t - 1;
    poner(t);
    vivo.mover(t, 1 / 60);
    for (const n of [1, 2] as const) {
      anotar(`parada-${n}`, CAIDA - baja(dom, n));
      anotar(`polvo-${n}`, Number(dom.de(`polvo-${n}`, 'opacity')));
      anotar(`vaho-${n}`, Number(dom.de(`vaho-${n}`, 'opacity')));
      anotar(`joven-${n}`, Number(dom.de(`joven-${n}`, 'opacity')));
      anotar(`cruje-${n}`, Number(dom.de(`cruje-${n}`, 'opacity')));
      anotar(`corre-${n}`, Math.abs(trasladoDe(dom.de(`loba-${n}`, 'transform'))[0] - ECHADAS[n - 1].x));
      if (u > REVIVE_T.aullan[0] + 0.5 && u < REVIVE_T.aullan[1] - 0.4 && baja(dom, n) > 0.5) paradaAntesDeAullar = false;
      if (u > REVIVE_T.aullan[0] + 0.6 && u < REVIVE_T.aullan[1] - 0.5) {
        const giro = Number(/rotate\(([-\d.]+)/.exec(dom.de(`cabeza-${n}`, 'transform'))![1]);
        assert.ok(giro < -35, `la ${n} no aúlla al cielo (${giro})`);
      }
    }
  }
  for (const n of [1, 2]) {
    assert.ok(maximo[`parada-${n}`]! > CAIDA - 0.5, `la ${n} no se paró`);
    assert.ok(maximo[`cruje-${n}`]! > 0.8, `a la ${n} no le crujieron los huesos`);
    assert.ok(maximo[`polvo-${n}`]! > 0.9, `la ${n} no se sacudió el polvo`);
    assert.ok(maximo[`vaho-${n}`]! > 0.9, `a la ${n} no se le vio el vaho`);
    assert.ok(maximo[`joven-${n}`]! > 0.95, `a la ${n} no le volvió el pelo`);
    assert.ok(maximo[`corre-${n}`]! > VUELTA.rx, `la ${n} no trotó la vuelta`);
  }
  assert.ok(paradaAntesDeAullar, 'aúllan echadas');
  // Al final están echadas otra vez, donde estaban, viejas y con los ojos cerrados.
  for (const n of [1, 2] as const) {
    assert.ok(baja(dom, n) > CAIDA - 2, `la ${n} no se volvió a echar`);
    assert.ok(Math.abs(trasladoDe(dom.de(`loba-${n}`, 'transform'))[0] - ECHADAS[n - 1].x) < 0.5, `la ${n} no volvió a su lugar`);
    assert.ok(Number(dom.de(`joven-${n}`, 'opacity')) < 0.05, `la ${n} quedó joven`);
  }
  assert.equal(vivo.estado().hechas.revive, 1);
  assert.equal(dichos.length, 1);
  assert.deepEqual(dichos[0], [ID, VERSO[0], VERSO[1]]);
  assert.equal(vivo.reaccionar('otro', 0), false);
  assert.equal(vivo.reaccionar(ID, 20), true);
});

test('con movimiento reducido no se mueven: tocarlas las pasa de echadas a aullando, y de vuelta', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarLobasCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(baja(dom, 1), 0);
  assert.equal(dom.de('vaho-2', 'opacity'), String(Math.round(Math.sin(Math.PI * AULLAN.lobas[1].vaho) * 100) / 100));
  assert.equal(dichos.length, 1);
  vivo.mover(4, 1 / 60);
  assert.equal(baja(dom, 2), 0, 'se movió sola');
  dom.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(dom.foto(), antes);
  assert.equal(QUIETO.lobas[0].alza, 0);
});

test('la ficha: el retrato son las dos aullando, adentro de su caja; y la isla se lleva números', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/monte-lejos.webp') && svg.includes('/bestiario/lobas-cabeza-1.webp') && svg.includes('/bestiario/lobas-cabeza-2.webp'));
  const [x0, y0, w, h] = r.caja;
  for (const n of [0, 1] as const) {
    for (const p of [[-96, 0], [126, 0], [0, -110]] as const) {
      const [x, y] = alRecinto(n, p);
      assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
    }
  }
  const fuente = readFileSync('src/scripts/bestiario/lobas.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((x) => /arte|aerografo|titeres|escenas|elenco|trazos/.test(x)), []);
});
