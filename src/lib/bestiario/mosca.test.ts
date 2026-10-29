import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_MOSCA, RETRATO } from './arte-mosca.ts';
import { CERCA, ENCIMA, ESCALA, MOSCA_ARMADA, OCHO, OLLA, POSADAS, QUIETA, VERSO, enElOcho, rumboDe, type Punto } from './rig-mosca.ts';
import { COSAS_DE_LA_MESA, MESA, OJOS_DE_LA_MESA } from './rig-entornos.ts';
import { AFUERA, DURA, armarMoscaCon } from '../../scripts/bestiario/mosca.ts';

/**
 * La mosca (`D-73`, decimoséptima vuelta): que sea un recorte entero, que vuele sobre la olla y se pose
 * donde la olla está, que no le tape la cara a nadie de la mesa, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; cuenta?: Array<{ rotulo: string; fuente?: string; quien?: string }> }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'la-mosca';
const marcado = capasDe('la-mesa', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_MOSCA.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};

test('la mosca es un recorte entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(marcado, /<g class="titere titere--mosca" data-id="la-mosca" role="button" tabindex="0" aria-label="La mosca">/);
  for (const p of ['entero', 'ala-1', 'ala-2', 'pata-1', 'pata-2', 'zumbido', 'sombra', 'anillo']) assert.ok(marcado.includes(`data-parte="${p}"`), `a la mosca le falta ${p}`);
  const imagenes = new Set([...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_MOSCA.map((p) => p.nombre).sort());
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`mosca-ala-${n + 1}`, MOSCA_ARMADA.alas[n]) && adentro('mosca-cuerpo', MOSCA_ARMADA.alas[n]), `el ala ${n + 1} no sale del tórax`);
    assert.ok(adentro(`mosca-pata-${n + 1}`, MOSCA_ARMADA.patas[n]) && adentro('mosca-cuerpo', MOSCA_ARMADA.patas[n]), `la pata ${n + 1} no sale de abajo de la cabeza`);
  }
  // Es un recorte: todo lleva el canto de papel de la contratapa.
  for (const p of PIEZAS_MOSCA.filter((q) => q.nombre !== 'mosca-zumbido')) assert.ok(p.dibujo.includes('var(--entorno-mesa-papel)'), `${p.nombre} no tiene canto de papel`);
  for (const p of PIEZAS_MOSCA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  const peso = PIEZAS_MOSCA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 8 && peso <= 120, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de la mosca están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨la mosca⟩'), tokens.indexOf('⟨/la mosca⟩'));
  const usadas = new Set(PIEZAS_MOSCA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-mosca-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 5);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de la mosca`);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨la mosca⟩ */'), sitio.indexOf('/* ⟨/la mosca⟩ */'));
  for (const clase of new Set([...marcado.matchAll(/class="(bt-mosca-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('se posa donde está la olla: el borde, el cucharón y la sopa', () => {
  const { x, piso, ancho, alto } = MESA.olla;
  assert.equal(OLLA.x, x);
  for (const [nombre, { punto: [px, py] }] of Object.entries(POSADAS)) {
    assert.ok(px > x - ancho / 2 - 1 && px < x + ancho / 2 + 1, `${nombre} se sale de la olla`);
    assert.ok(py > piso - alto - 50 && py < piso - alto + 20, `${nombre} no está en la boca de la olla`);
  }
  // La sopa, adentro del borde; los bordes, en el borde.
  const sopa = POSADAS.sopa.punto;
  assert.ok(((sopa[0] - OLLA.x) / OLLA.rx) ** 2 + ((sopa[1] - OLLA.y) / OLLA.ry) ** 2 < 1);
  // El ocho, sobre la olla.
  for (let i = 0; i < 64; i++) {
    const [ox, oy] = enElOcho((i / 64) * Math.PI * 2);
    assert.ok(Math.abs(ox - OLLA.x) < OLLA.rx + 30 && oy < OLLA.y - 10 && oy > OLLA.y - 110, `el ocho se va de la olla (${ox.toFixed(0)}, ${oy.toFixed(0)})`);
  }
  assert.ok(Math.abs(rumboDe([0, 0], [0, -1])) < 1e-9 && Math.abs(rumboDe([0, 0], [1, 0]) - 90) < 1e-9);
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
  const marco = { dataset: { dx: '0' }, querySelector: (sel: string) => (sel === '.titere--mosca' ? titere : null) };
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

/** Dónde está la mosca en la página, y cuán grande, leyendo el `entero`. */
function dondeEsta(dom: ReturnType<typeof domDeJuguete>): { x: number; y: number; k: number } {
  const [, x, y, k] = /translate\(([-\d.]+) ([-\d.]+)\) rotate\([-\d.]+\) scale\(([\d.]+)\)/.exec(dom.de('entero', 'transform'))!;
  return { x: Number(x), y: Number(y), k: Number(k) };
}

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = domDeJuguete(marcado);
    const antes = dom.foto();
    const vivo = armarMoscaCon([dom.marco], escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive: vuela en ochos, se posa en distintos lados, se frota las patas, y no le tapa la cara a nadie', () => {
  const otros = Object.entries({ ...OJOS_DE_LA_MESA, ...COSAS_DE_LA_MESA }).filter(([id]) => id !== ID);
  const lugares = new Set<string>();
  let frotadas = 0;
  let anillo = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = domDeJuguete(marcado);
    const { esc, poner } = escenario(false);
    const vivo = armarMoscaCon([dom.marco], esc, azar(semilla));
    let antes = dondeEsta(dom);
    for (let i = 1; i <= 60 * 60; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const e = vivo.estado();
      assert.notEqual(e.modo, 'encima', 'se te vino encima sin que la toquen');
      if (e.posada) lugares.add(e.posada);
      anillo = Math.max(anillo, Number(dom.de('anillo', 'opacity')));
      const ahora = dondeEsta(dom);
      // Una mosca es rápida, pero no se teletransporta.
      assert.ok(Math.hypot(ahora.x - antes.x, ahora.y - antes.y) < 8, `a ${t.toFixed(2)} s salta`);
      antes = ahora;
      // Su lugar: la mosca entera, alas abiertas incluidas, no le tapa la cara a nadie.
      const r = 46 * ahora.k;
      for (const [id, [ox, oy]] of otros) assert.ok(Math.hypot(ox - ahora.x, oy - ahora.y) > r + 4, `a ${t.toFixed(2)} s le tapa la cara a ${id}`);
      if (i % 30 === 0) for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
    }
    frotadas += vivo.estado().frotadas;
  }
  assert.ok(lugares.size >= 3, `se posa siempre en el mismo lado (${[...lugares]})`);
  assert.ok(frotadas >= 3, 'no se frota las patas');
  assert.ok(anillo > 0.3, 'en la sopa no hace anillos');
});

test('tocada, se te viene encima y se va por detrás de la oreja; dice su verso; con movimiento reducido cambia de pose', () => {
  const dom = domDeJuguete(marcado);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarMoscaCon([dom.marco], esc, azar(5));
  poner(0.5);
  vivo.mover(0.5, 1 / 60);
  dom.oyentes.get('click')!({});
  assert.equal(dichos.length, 0);
  let grande = 0;
  let afuera = false;
  for (let i = 1; i <= 60 * 6; i++) {
    const t = 0.5 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    grande = Math.max(grande, dondeEsta(dom).k);
    if (dom.de('entero', 'opacity') === '0') afuera = true;
  }
  assert.ok(grande > ESCALA * (1 + (CERCA - 1) * 0.95), 'no se viene encima');
  assert.ok(afuera, 'no se va');
  assert.equal(vivo.estado().modo === 'encima' || vivo.estado().modo === 'afuera', false, 'no vuelve');
  assert.deepEqual(dichos[0], [ID, VERSO[0], VERSO[1]]);
  assert.ok(AFUERA[1] < 0, 'no se va por arriba');
  assert.equal(vivo.reaccionar('otro', 0), false);
  assert.equal(vivo.reaccionar(ID, 9), true);
  assert.ok(DURA.encima > 1.5);

  const q = domDeJuguete(marcado);
  const quieto = escenario(true);
  const vq = armarMoscaCon([q.marco], quieto.esc, azar(3));
  const antes = q.foto();
  q.oyentes.get('click')!({});
  const encima = q.foto();
  assert.notDeepEqual(encima, antes);
  vq.mover(5, 0);
  vq.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), encima, 'con movimiento reducido se movió sola');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), antes);
});

test('la ficha: el retrato es la mosca encima, sobre la olla; lo que cuenta es testimonio fichado', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/mesa-piso.webp') && svg.includes('/bestiario/mosca-cuerpo.webp'));
  const [x0, y0, w, h] = r.caja;
  const k = ESCALA * CERCA;
  for (const [dx, dy] of [[-46, -10], [46, -10], [0, -32], [0, 38]] as const) {
    const [x, y] = [ENCIMA.x + dx * k, ENCIMA.y - dy * k];
    assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  }
  assert.ok(Math.abs(ENCIMA.x - OCHO.x) < 1);
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.match(b.estampa, /rótulo/);
  assert.match(b.estampa, /recort/);
  assert.ok(b.cuenta?.some((c) => c.rotulo === 'testimonio' && c.fuente === 'RES-21' && /p\. 293/.test(c.quien ?? '')), 'lo del título no está como testimonio');
  assert.ok(QUIETA.sombra === 1 && QUIETA.alas === 0, 'quieta no está posada');
});

test('la isla de la mosca se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/mosca.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco/.test(r)), []);
});
