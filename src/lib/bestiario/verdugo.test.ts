import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_VERDUGO, RETRATO } from './arte-verdugo.ts';
import { A_LA_BOCA, GESTOS, MANOS_BRINDA, VERDUGO, VERDUGO_ARMADO, VERSO, alRecinto, brazos, puntaDe, type Punto } from './rig-verdugo.ts';
import { COSAS_DE_LA_MESA, MESA, OJOS_DE_LA_MESA } from './rig-entornos.ts';
import { DURA, armarVerdugoCon, type Accion } from '../../scripts/bestiario/verdugo.ts';

/**
 * El verdugo que cena distinguido (`D-73`, decimoctava vuelta): que sea un grabado recortado entero, que
 * se siente en su lugar de la mesa, que la mano llegue a la boca y al plato, que cene solo eligiendo qué
 * hacer, que tocado brinde, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; tema?: string; cuenta?: Array<{ rotulo: string; fuente?: string; quien?: string }> }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-verdugo-que-cena';
const marcado = capasDe('la-mesa', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_VERDUGO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto, margen = 0): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 - margen && x <= x0 + w + margen && y >= y0 - margen && y <= y0 + h + margen;
};

test('el verdugo es un grabado recortado entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(marcado, /<g class="titere titere--verdugo" data-id="el-verdugo-que-cena" role="button" tabindex="0" aria-label="El verdugo que cena distinguido">/);
  for (const p of ['entero', 'torso', 'cabeza', 'babero', 'brazo-1', 'antebrazo-1', 'mano-1', 'brazo-2', 'antebrazo-2', 'mano-2', 'vino', 'filo', 'ojo-1', 'ojo-2', 'risa', 'bocado-plato', 'bocado-tenedor']) {
    assert.ok(marcado.includes(`data-parte="${p}"`), `al verdugo le falta ${p}`);
  }
  const imagenes = new Set([...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_VERDUGO.map((p) => p.nombre).sort());
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`verdugo-brazo-${n + 1}`, VERDUGO_ARMADO.hombros[n]) && adentro('verdugo-cuerpo', VERDUGO_ARMADO.hombros[n]), `el brazo ${n + 1} no sale del hombro`);
  }
  assert.ok(adentro('verdugo-capucha', VERDUGO_ARMADO.cuello, 4) && adentro('verdugo-cuerpo', VERDUGO_ARMADO.cuello), 'la capucha no se apoya en el cuello');
  for (const { centro } of VERDUGO_ARMADO.ojos) assert.ok(adentro('verdugo-capucha', centro), 'un agujero se sale de la capucha');
  assert.ok(adentro('verdugo-pera', VERDUGO_ARMADO.boca) && adentro('verdugo-babero', VERDUGO_ARMADO.boca), 'la boca no está debajo del faldón');
  // Es un recorte del collage de la mesa: lo tallado lleva el canto de papel; y la talla, la plancha de Oktubre.
  for (const p of PIEZAS_VERDUGO.filter((q) => !['verdugo-vino', 'verdugo-filo', 'verdugo-pera'].includes(q.nombre))) {
    assert.ok(p.dibujo.includes('var(--entorno-mesa-papel)'), `${p.nombre} no tiene canto de papel`);
  }
  for (const n of ['verdugo-capucha', 'verdugo-cuerpo', 'verdugo-babero', 'verdugo-hacha']) assert.match(caja(n) && PIEZAS_VERDUGO.find((p) => p.nombre === n)!.dibujo, /url\(#gubia\)/, `${n} no está tallado`);
  for (const p of PIEZAS_VERDUGO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  // Nada baja del canto de la mesa, salvo la guinda del plato: lo de abajo lo tapa la mesa.
  for (const p of PIEZAS_VERDUGO.filter((q) => q.nombre !== 'verdugo-guinda')) {
    const [, y, , h] = p.caja;
    assert.ok(y + h <= 12, `${p.nombre} baja del canto de la mesa`);
  }
  const peso = PIEZAS_VERDUGO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del verdugo están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el verdugo⟩'), tokens.indexOf('⟨/el verdugo⟩'));
  const usadas = new Set(PIEZAS_VERDUGO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-verdugo-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 3);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del verdugo`);
  assert.match(bloque, /oktubre-frontal/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el verdugo⟩ */'), sitio.indexOf('/* ⟨/el verdugo⟩ */'));
  for (const clase of new Set([...marcado.matchAll(/class="(bt-verdugo-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('se sienta en su punta de la mesa, con el plato adelante, y no le tapa la cara a nadie', () => {
  assert.equal(VERDUGO.x, OJOS_DE_LA_MESA[ID]![0]);
  assert.equal(VERDUGO.mesa, MESA.tablero.atras);
  // El plato que pincha es el que le sirvió la mesa: debajo del canto, en el medio del verdugo.
  const [px, py] = alRecinto(VERDUGO_ARMADO.plato);
  assert.ok(Math.abs(px - VERDUGO.x) < 10 && py > MESA.tablero.atras && py < MESA.tablero.atras + 20);
  // Nadie de la mesa tiene la cara adentro del verdugo, ni con la copa en alto.
  const [x0, y0, w, h] = RETRATO.caja;
  for (const [id, [ox, oy]] of Object.entries({ ...OJOS_DE_LA_MESA, ...COSAS_DE_LA_MESA })) {
    if (id === ID) continue;
    assert.ok(!(ox > x0 + 6 && ox < x0 + w - 6 && oy > y0 + 6 && oy < y0 + h - 6), `${id} queda adentro del verdugo`);
  }
  // Y la copa en alto no se mete en la tipa rapaz.
  const copa = alRecinto(puntaDe(MANOS_BRINDA[0], 0));
  const tipa = OJOS_DE_LA_MESA['la-tipa-rapaz']!;
  assert.ok(Math.hypot(copa[0] - tipa[0], copa[1] - tipa[1]) > 44, 'la copa le pega a la tipa rapaz');
});

test('las manos llegan: el tenedor a la boca y al plato, la copa a la boca y bien alto para brindar', () => {
  const boca = VERDUGO_ARMADO.boca;
  const dist = (a: Punto, b: Punto): number => Math.hypot(a[0] - b[0], a[1] - b[1]);
  // La muñeca llega adonde se la manda (el brazo alcanza), y lo que tiene en la mano llega a la boca.
  for (const [n, m] of [[1, A_LA_BOCA.tenedor], [0, A_LA_BOCA.copa], [1, A_LA_BOCA.plato], [0, MANOS_BRINDA[0]]] as const) {
    const manos = n === 0 ? [m, GESTOS.quieto.manos[1]] as const : [GESTOS.quieto.manos[0], m] as const;
    const b = brazos(manos);
    assert.ok(dist(b[n].muneca, m.muneca) < 1, `la mano ${n + 1} no llega a ${m.muneca}`);
    // Con buenos modales: el codo nunca sube por arriba del hombro, ni toca la mesa.
    assert.ok(b[n].codo[1] < -8, `el codo ${n + 1} se apoya en la mesa`);
  }
  assert.ok(dist(puntaDe(A_LA_BOCA.tenedor, 1), boca) < 9, 'el tenedor no llega a la boca');
  assert.ok(dist(puntaDe(A_LA_BOCA.copa, 0), boca) < 10, 'la copa no llega a la boca');
  assert.ok(dist(puntaDe(A_LA_BOCA.plato, 1), VERDUGO_ARMADO.plato) < 10, 'el tenedor no llega al plato');
  assert.ok(puntaDe(MANOS_BRINDA[0], 0)[1] < VERDUGO_ARMADO.ojos[0].centro[1], 'brinda con la copa más abajo que los ojos');
});

/* ------------------------------------------------------------------
   La isla, contra un DOM de juguete
   ------------------------------------------------------------------ */

interface Juguete {
  dataset: Record<string, string>;
  atributos: Map<string, string>;
  setAttribute(n: string, v: string): void;
  getAttribute(n: string): string | null;
}

function domDeJuguete(html: string) {
  const partes: Juguete[] = [];
  for (const m of html.matchAll(/<g\b([^>]*\bdata-parte="([^"]+)"[^>]*)>/g)) {
    const atributos = new Map([...m[1]!.matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1]!, a[2]!] as const));
    partes.push({ dataset: { parte: m[2]! }, atributos, setAttribute(n, v) { this.atributos.set(n, v); }, getAttribute(n) { return this.atributos.get(n) ?? null; } });
  }
  const oyentes = new Map<string, (ev: unknown) => void>();
  const titere = { querySelectorAll: (sel: string) => (sel === '[data-parte]' ? partes : []), addEventListener: (tipo: string, fn: (ev: unknown) => void) => oyentes.set(tipo, fn) };
  const marco = { dataset: { dx: '0' }, querySelector: (sel: string) => (sel === '.titere--verdugo' ? titere : null) };
  const foto = (): Record<string, string> => Object.fromEntries(partes.map((p) => [p.dataset.parte!, `${p.getAttribute('transform') ?? ''}|${p.getAttribute('opacity') ?? ''}`]));
  const de = (nombre: string, at: string): string => partes.find((p) => p.dataset.parte === nombre)!.getAttribute(at) ?? '';
  return { marco: marco as unknown as SVGGElement, partes, oyentes, foto, de };
}

function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function escenario(quieto: boolean) {
  const dichos: Array<[string, number, number]> = [];
  let reloj = 0;
  return { esc: { hablar: (id: string, x: number, y: number) => void dichos.push([id, x, y]), quieto: () => quieto, reloj: () => reloj }, dichos, poner: (t: number) => void (reloj = t) };
}

/** Cuánto se levanta el faldón, leyendo su escala. */
const faldon = (dom: ReturnType<typeof domDeJuguete>): number => (1 - Number(/scale\(1 ([\d.]+)\)/.exec(dom.de('babero', 'transform'))![1])) / 0.78;

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = domDeJuguete(marcado);
    const antes = dom.foto();
    const vivo = armarVerdugoCon([dom.marco], escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive: pincha, come, toma, mira y se ríe, eligiendo cada vez, sin romperse ni brindar solo', () => {
  const hechas: Record<Accion, number> = { pincha: 0, come: 0, bebe: 0, mira: 0, rie: 0, brinda: 0 };
  let faldonArriba = 0;
  let guindaEnElTenedor = false;
  let vinoMinimo = 1;
  for (const semilla of [1, 2, 3]) {
    const dom = domDeJuguete(marcado);
    const { esc, poner } = escenario(false);
    const vivo = armarVerdugoCon([dom.marco], esc, azar(semilla));
    const secuencia: Accion[] = [];
    for (let i = 1; i <= 60 * 90; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const e = vivo.estado();
      if (e.accion && secuencia.at(-1) !== e.accion) secuencia.push(e.accion);
      faldonArriba = Math.max(faldonArriba, faldon(dom));
      if (dom.de('bocado-tenedor', 'opacity') === '1') guindaEnElTenedor = true;
      vinoMinimo = Math.min(vinoMinimo, e.vino);
      // Una sola guinda: o está en el plato, o en el tenedor, o se la comió.
      assert.ok(!(dom.de('bocado-plato', 'opacity') === '1' && dom.de('bocado-tenedor', 'opacity') === '1'), `a ${t.toFixed(2)} s hay dos guindas`);
      if (i % 30 === 0) for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
    // No es un bucle: la secuencia no se repite igual de a tres.
    const tiras = new Set<string>();
    for (let i = 0; i + 3 <= secuencia.length; i++) tiras.add(secuencia.slice(i, i + 3).join(','));
    assert.ok(tiras.size >= 4, `hace siempre lo mismo: ${secuencia.join(' ')}`);
  }
  assert.equal(hechas.brinda, 0, 'brindó sin que lo toquen');
  for (const a of ['pincha', 'come', 'bebe', 'mira', 'rie'] as const) assert.ok(hechas[a] >= 2, `no ${a} (${hechas[a]})`);
  assert.ok(faldonArriba > 0.9, 'no se levanta el faldón para comer');
  assert.ok(guindaEnElTenedor, 'no pincha la guinda');
  assert.ok(vinoMinimo < 0.75, 'no toma');
});

test('tocado, brinda por tu suerte: la copa en alto, el filo prendido y la risa; dice su verso; con movimiento reducido cambia de pose', () => {
  const dom = domDeJuguete(marcado);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarVerdugoCon([dom.marco], esc, azar(5));
  poner(0.3);
  vivo.mover(0.3, 1 / 60);
  dom.oyentes.get('click')!({});
  assert.equal(dichos.length, 0);
  let filo = 0;
  let risa = 0;
  for (let i = 1; i <= 60 * 4; i++) {
    const t = 0.3 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    filo = Math.max(filo, Number(dom.de('filo', 'opacity')));
    risa = Math.max(risa, Number(dom.de('risa', 'opacity')));
  }
  assert.equal(vivo.estado().hechas.brinda, 1);
  assert.ok(filo > 0.9, 'no le brilla el filo');
  assert.ok(risa > 0.8, 'no se ríe');
  assert.deepEqual(dichos[0], [ID, VERSO[0], VERSO[1]]);
  assert.equal(vivo.reaccionar('otro', 0), false);
  assert.equal(vivo.reaccionar(ID, 9), true);
  assert.ok(DURA.brinda > 2.5);

  const q = domDeJuguete(marcado);
  const quieto = escenario(true);
  const vq = armarVerdugoCon([q.marco], quieto.esc, azar(3));
  const antes = q.foto();
  q.oyentes.get('click')!({});
  const enAlto = q.foto();
  assert.notDeepEqual(enAlto, antes);
  vq.mover(5, 0);
  vq.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), enAlto, 'con movimiento reducido se movió solo');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), antes);
});

test('la ficha: el retrato es el brindis sobre la mesa; la estampa dice qué es del dibujo y qué de la letra', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/mesa-piso.webp') && svg.includes('/bestiario/verdugo-capucha.webp'));
  const [x0, y0, w, h] = r.caja;
  // Entra entero: la punta de la capucha, la copa en alto, el hacha y el plato.
  for (const p of [[16, -232], puntaDe(MANOS_BRINDA[0], 0), [112, -150], VERDUGO_ARMADO.plato] as const) {
    const [x, y] = alRecinto(p);
    assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  }
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.equal(b.tema, 'jijiji');
  assert.match(b.estampa, /Oktubre/);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /letra/);
});

test('la isla del verdugo se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/verdugo.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco|grabado/.test(r)), []);
});
