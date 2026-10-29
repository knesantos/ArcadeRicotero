import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_ENCADENADO, RETRATO } from './arte-encadenado.ts';
import { CORTES, ENCADENADO, ENCADENADO_ARMADO, HUECOS, MASTER, QUIETO, ROTA, VERSO, alRecinto, type Punto } from './rig-encadenado.ts';
import { PRISION, marcoDelRecinto } from './rig.ts';
import { VECINOS_DE_LA_PRISION } from './escenas.ts';
import { DURA, ROMPE, armarEncadenadoCon, rompeEn, type Accion } from '../../scripts/bestiario/encadenado.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El esclavo encadenado (`D-73`, vigesimoprimera vuelta): que sea el dibujo que trajo el usuario y no un
 * redibujo, cortado en piezas que giran desde donde se articulan; que se arrodille entre la jaula vacía
 * y la celda de los reos sin taparle los ojos a nadie; que tocado rompa la cadena y la cadena vuelva; y
 * que la ficha no afirme de qué disco sale.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as {
  bestias: Array<{ id: string; nombre: string; estampa: string; tema?: string; verso?: string[]; cuenta?: Array<{ rotulo: string; texto: string }> }>;
};
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-esclavo-encadenado';
const figura = capasDe('la-prision', 'figura', nombres, 1, ID);
const nuevo = () => domDeJuguete([figura], 'titere--encadenado');
const caja = (pieza: string): readonly [number, number, number, number] => PIEZAS_ENCADENADO.find((p) => p.nombre === `encadenado-${pieza}`)!.caja;
const adentro = (pieza: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(pieza);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const giroDe = (t: string): number => Number(/rotate\(([-\d.]+)/.exec(t)?.[1] ?? NaN);

test('el esclavo encadenado es el dibujo del usuario, cortado en piezas que giran desde donde se articulan', () => {
  assert.match(figura, /<g class="titere titere--encadenado" data-id="el-esclavo-encadenado" role="button" tabindex="0" aria-label="El esclavo encadenado">/);
  for (const p of ['entero', 'torso', 'cabeza', 'antebrazo', 'puno', 'cadena-alta', 'cadena-punta', 'cadena-baja', 'chispa']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_ENCADENADO.map((p) => p.nombre).sort());
  // Cada pieza es el máster preparado, recortado y teñido con tokens: ni un hex, ni un trazo redibujado.
  assert.ok(existsSync('Docs/UX/recortes-master/esclavo-encadenado.png') && existsSync('Docs/UX/recortes-master/esclavo-encadenado-silueta.png'));
  for (const p of PIEZAS_ENCADENADO) {
    assert.match(p.dibujo, /href="master:esclavo-encadenado-silueta"/, p.nombre);
    assert.match(p.dibujo, /var\(--bestia-dracula-papel\)/, p.nombre);
    assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
    const [x, y, w, h] = p.caja;
    assert.ok(x >= 0 && y >= 0 && x + w <= MASTER.ancho && y + h <= MASTER.piso + 1, `${p.nombre} se sale del máster o baja a la raya del piso`);
  }
  // Los pivotes, adentro de la pieza que gira y de la que la sostiene.
  const A = ENCADENADO_ARMADO;
  assert.ok(adentro('cabeza', A.cuello) && adentro('cuerpo', A.cuello), 'la cabeza no gira del cuello');
  assert.ok(adentro('antebrazo', A.agarre) && adentro('cadena-alta', A.agarre), 'la cadena no sale del puño');
  assert.ok(adentro('antebrazo', A.agarrePunta) && adentro('cadena-punta', A.agarrePunta), 'la punta no sale del puño');
  assert.ok(adentro('puno', A.muneca) && adentro('cuerpo', A.muneca), 'el puño no gira de la muñeca');
  assert.ok(adentro('cadena-baja', A.enganche) && adentro('cuerpo', A.enganche), 'la cadena de abajo no cuelga de la túnica');
  assert.ok(adentro('cadena-alta', A.eslabon), 'la chispa no está en el eslabón');
  // A cada pieza que se mueve se le saca su hueco al cuerpo, y las cadenas se sacan enteras.
  assert.equal(HUECOS.length, Object.keys(CORTES).length);
  const peso = PIEZAS_ENCADENADO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 30 && peso <= 160, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('se arrodilla entre la jaula vacía y la celda de los reos, sin salirse del recinto ni taparle los ojos a nadie', () => {
  const marco = marcoDelRecinto('la-prision');
  const [x0] = alRecinto([0, 0]);
  const [x1] = alRecinto([MASTER.ancho, 0]);
  assert.ok(x0 > marco.x && x1 < marco.x + marco.ancho, 'se sale del recinto');
  // El cuerpo arranca a la derecha de la jaula; la punta de la cadena alta, como mucho, le roza el borde.
  assert.ok(alRecinto([caja('cuerpo')[0], 0])[0] > PRISION.jaula.x1, 'se mete en la jaula de la fiera');
  assert.ok(x0 > PRISION.jaula.x1 - 40, 'la cadena cruza la jaula por el medio');
  assert.ok(ENCADENADO.piso <= 640 && ENCADENADO.piso > PRISION.jaula.piso - 10, 'no apoya las rodillas en el piso de adelante');
  // Ningún par de ojos de la prisión cae adentro de lo que ocupa (con un margen de un ojo).
  const piezas = PIEZAS_ENCADENADO.map((p) => {
    const [px, py, w, h] = p.caja;
    const [ax, ay] = alRecinto([px, py]);
    const [bx, by] = alRecinto([px + w, py + h]);
    return [ax - 8, ay - 8, bx + 8, by + 8] as const;
  });
  for (const [id, [x, y]] of Object.entries(VECINOS_DE_LA_PRISION)) {
    assert.ok(!piezas.some(([ax, ay, bx, by]) => x > ax && x < bx && y > ay && y < by), `le tapa los ojos a ${id}`);
  }
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarEncadenadoCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive: respira, tironea, ruge y aprieta el puño, sin saltos y sin romper la cadena si no lo tocan', () => {
  const hechas: Record<Accion, number> = { tironea: 0, ruge: 0, aprieta: 0, rompe: 0 };
  const cabezas: number[] = [];
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarEncadenadoCon(dom.marcos, esc, azar(semilla));
    let antes = giroDe(dom.de('antebrazo', 'transform'));
    for (let i = 1; i <= 60 * 40; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const a = giroDe(dom.de('antebrazo', 'transform'));
      assert.ok(Math.abs(a - antes) < 2.5, `a ${t.toFixed(2)} s el brazo salta`);
      antes = a;
      cabezas.push(giroDe(dom.de('cabeza', 'transform')));
      assert.equal(dom.de('cadena-alta', 'opacity'), '1', 'se le fue la cadena sin que lo toquen');
      if (i % 30 === 0) for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
    assert.equal(vivo.estado().rotas, 0);
  }
  assert.equal(hechas.rompe, 0);
  for (const a of ['tironea', 'ruge', 'aprieta'] as const) assert.ok(hechas[a] >= 2, `no ${a} (${hechas[a]})`);
  assert.ok(Math.min(...cabezas) < -6, 'no ruge para atrás');
});

test('tocado, rompe la cadena: carga, el eslabón salta con la chispa, la cadena se va al piso, ruge, y la cadena vuelve', () => {
  const dom = nuevo();
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarEncadenadoCon(dom.marcos, esc, azar(5));
  poner(0.3);
  vivo.mover(0.3, 1 / 60);
  dom.oyentes.get('click')!({});
  let chispa = 0;
  let bajo = 0;
  let apagada = false;
  let cabeza = 0;
  for (let i = 1; i <= 60 * (DURA.rompe + 0.2); i++) {
    const t = 0.3 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    chispa = Math.max(chispa, Number(dom.de('chispa', 'opacity')));
    bajo = Math.max(bajo, trasladoDe(dom.de('cadena-alta', 'transform'))[1]);
    if (Number(dom.de('cadena-alta', 'opacity')) < 0.02) apagada = true;
    cabeza = Math.min(cabeza, giroDe(dom.de('cabeza', 'transform')));
  }
  assert.equal(chispa, 1, 'el eslabón salta sin chispa');
  assert.ok(bajo > 200, 'la cadena no se va al piso');
  assert.ok(apagada, 'la cadena rota no se va');
  assert.ok(cabeza < -7, 'no ruge');
  // Atrapado en libertad: la cadena está otra vez en el puño, colgando como antes.
  assert.equal(dom.de('cadena-alta', 'opacity'), '1');
  assert.deepEqual(trasladoDe(dom.de('cadena-alta', 'transform')), [0, 0]);
  assert.equal(dom.de('chispa', 'opacity'), '0');
  assert.equal(vivo.estado().hechas.rompe, 1);
  assert.equal(vivo.estado().rotas, 1, 'el eslabón tiene que saltar una vez, y pegar en la cámara');
  assert.deepEqual(dichos[0], [ID, VERSO[0], VERSO[1]]);
  assert.equal(vivo.reaccionar('otro', 0), false);
  assert.equal(vivo.reaccionar(ID, 20), true);
  // Antes del tirón la cadena no se mueve de lugar; después sale despedida para la izquierda, lejos de
  // la cara, y no cuelga encima del cuerpo.
  assert.deepEqual([rompeEn(ROMPE.tiron - 0.01, QUIETO).alta.x, rompeEn(ROMPE.tiron - 0.01, QUIETO).alta.y], [0, 0]);
  for (const d of [0.3, 0.6, 0.9]) assert.ok(rompeEn(ROMPE.tiron + d, QUIETO).alta.x < -50 * d, `a ${d} s del tirón la cadena no se va para la izquierda`);

  // Con movimiento reducido no se mueve solo: el toque lo pasa a la cadena rota y de vuelta.
  const q = nuevo();
  const quieto = escenario(true);
  const vq = armarEncadenadoCon(q.marcos, quieto.esc, azar(3));
  const antes = q.foto();
  q.oyentes.get('click')!({});
  const rota = q.foto();
  assert.notDeepEqual(rota, antes);
  assert.equal(q.de('cadena-alta', 'opacity'), String(ROTA.alta.o));
  vq.mover(5, 0);
  vq.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), rota, 'con movimiento reducido se movió solo');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), antes);
});

test('la ficha: el retrato es el dibujo entero; el verso es de Preso en mi ciudad y el disco va rotulado como leyenda', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  assert.ok(r.cuerpo().includes('/bestiario/encadenado-cuerpo.webp'));
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.equal(b.tema, 'preso-en-mi-ciudad');
  assert.match(b.verso!.join(' '), /atrapado en libertad/);
  // Que sale de la tapa de Oktubre no está fichado (`INV-02`): se cuenta como leyenda, y la estampa no lo afirma.
  assert.ok(b.cuenta?.some((c) => c.rotulo === 'leyenda' && /Oktubre/.test(c.texto) && /CD/.test(c.texto)), 'el disco no está rotulado como leyenda');
  assert.doesNotMatch(b.estampa, /(es|sale) de la tapa de Oktubre/i);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /verso/);
});

test('la isla del esclavo encadenado se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/encadenado.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco|trazos/.test(r)), []);
});
