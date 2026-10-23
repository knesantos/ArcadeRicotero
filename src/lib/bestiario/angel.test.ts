import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_ANGEL, RETRATO } from './arte-angel.ts';
import {
  ABIERTO, ANGEL_ARMADO, ATAJADO, LUGAR, MANO_OREJA, NIDO, QUIETA, VERSO, alRecinto, alcanzar, cantoDeAla, manoEn, nidoEn, type Momento, type Punto,
} from './rig-angel.ts';
import { COSAS_DEL_ARBOL, OJOS_DEL_ARBOL } from './rig-entornos.ts';
import { ATAJE, DURA, armarAngelCon, ataje, huevoEn, toque } from '../../scripts/bestiario/angel.ts';

/**
 * El ángel de la soledad (`D-73`, decimoséptima vuelta): que sea un títere entero, que los brazos lleguen
 * adonde se los manda, que ataje el huevo en las manos y lo devuelva al nido, que no le tape la cara a nadie
 * del árbol, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; tema?: string; cuenta?: Array<{ rotulo: string; fuente?: string; quien?: string }> }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-angel-de-la-soledad';
const marcado = capasDe('el-arbol', 'figura', nombres, 1, ID);
const A = ANGEL_ARMADO;
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_ANGEL.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const cerca = (a: Punto, b: Punto, tol: number): boolean => Math.hypot(a[0] - b[0], a[1] - b[1]) <= tol;

/** Los momentos que recorre: quieto, abierto, el ataje entero y el toque entero. */
const momentos: Momento[] = [
  QUIETA,
  ABIERTO,
  ...Array.from({ length: 60 }, (_, i) => ({ ...QUIETA, ...ataje((DURA.ataja * i) / 59) })),
  ...Array.from({ length: 40 }, (_, i) => ({ ...QUIETA, ...toque((DURA.toque * i) / 39) })),
];

/** Los puntos del ángel en un momento, en el recinto: las dos alas enteras, las manos, la cabeza y los pies. */
function puntos(m: Momento): Punto[] {
  const enTitere: Punto[] = [...cantoDeAla(0, m), ...cantoDeAla(1, m), manoEn(0, m), manoEn(1, m), [0, -212], [-14, -190], [18, -186], [-33, 0], [33, 0]];
  return enTitere.map(alRecinto);
}

test('el ángel es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(marcado, /<g class="titere titere--angel" data-id="el-angel-de-la-soledad" role="button" tabindex="0" aria-label="El ángel de la soledad">/);
  const partes = ['entero', 'cuerpo', 'ala-1', 'ala-2', 'brazo-1', 'brazo-2', 'antebrazo-1', 'antebrazo-2', 'cabeza', 'ceja', 'pupila-1', 'pupila-2', 'parpado-1', 'parpado-2', 'huevo'];
  for (const p of partes) assert.ok(marcado.includes(`data-parte="${p}"`), `al ángel le falta ${p}`);
  const imagenes = [...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!);
  assert.deepEqual([...new Set(imagenes)].sort(), PIEZAS_ANGEL.map((p) => p.nombre).sort(), 'usa piezas que no se imprimen, o le sobra una');
  assert.ok(PIEZAS_ANGEL.length <= 14, `${PIEZAS_ANGEL.length} piezas`);
  for (const n of [0, 1] as const) {
    assert.ok(adentro('angel-tunica', A.hombros[n]) && adentro(`angel-brazo-${n + 1}`, A.hombros[n]), `el brazo ${n + 1} no cuelga del hombro`);
    const codo: Punto = [A.hombros[n][0], A.hombros[n][1] + A.brazo];
    assert.ok(adentro(`angel-brazo-${n + 1}`, codo) && adentro(`angel-antebrazo-${n + 1}`, codo), `el codo ${n + 1} se sale de su brazo`);
    assert.ok(adentro(`angel-antebrazo-${n + 1}`, [codo[0], codo[1] + A.antebrazo]), `la mano ${n + 1} se sale de su antebrazo`);
    assert.ok(adentro(`angel-ala-${n + 1}`, A.alas[n]) && adentro('angel-tunica', A.alas[n]), `el ala ${n + 1} no sale del hombro`);
    const { centro } = A.ojos[n];
    assert.ok(adentro('angel-cabeza', centro), `el ojo ${n + 1} se salió de la cara`);
  }
  assert.ok(adentro('angel-cabeza', A.cuello) && adentro('angel-tunica', A.cuello), 'la cabeza gira en el aire');
  assert.ok(adentro('angel-cabeza', A.oreja), 'la oreja se salió de la cabeza');
  for (const p of PIEZAS_ANGEL) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  const peso = PIEZAS_ANGEL.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del ángel están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el angel de la soledad⟩'), tokens.indexOf('⟨/el angel de la soledad⟩'));
  const usadas = new Set(PIEZAS_ANGEL.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-angel-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 5);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del ángel, o no dice de dónde salió`);
  // La luz que le pega es la del árbol: la tierra roja de abajo y el cielo violeta de atrás.
  const delArbol = new Set(PIEZAS_ANGEL.flatMap((p) => [...p.dibujo.matchAll(/var\((--entorno-arbol-[a-z-]+)\)/g)].map((m) => m[1]!)));
  for (const t of ['--entorno-arbol-tierra-viva', '--entorno-arbol-nube']) assert.ok(delArbol.has(t), `no usa ${t}`);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el ángel de la soledad⟩ */'), sitio.indexOf('/* ⟨/el ángel de la soledad⟩ */'));
  for (const clase of new Set([...marcado.matchAll(/class="(bt-angel-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('los brazos llegan adonde se los manda, con el codo para afuera', () => {
  for (const n of [0, 1] as const) {
    const s = n === 0 ? 1 : -1;
    // La oreja es la del lado del tronco: ahí va la mano 1.
    for (const meta of [...[QUIETA, ABIERTO].map((m) => m.manos[n]), ...(n === 0 ? [MANO_OREJA] : []), [s * 10, -120] as Punto, [s * 40, -200] as Punto]) {
      const r = alcanzar(n, meta);
      assert.ok(cerca(r.mano, meta, 0.5), `la mano ${n + 1} no llega a ${meta.join(', ')}`);
      assert.ok(Math.abs(Math.hypot(r.codo[0] - A.hombros[n][0], r.codo[1] - A.hombros[n][1]) - A.brazo) < 1e-6, 'el brazo se estira');
      assert.ok(Math.abs(Math.hypot(r.mano[0] - r.codo[0], r.mano[1] - r.codo[1]) - A.antebrazo) < 1e-6 || !cerca(r.mano, meta, 0.01), 'el antebrazo se estira');
      // El codo, para afuera de la línea del hombro a la mano.
      const t = (r.codo[0] - A.hombros[n][0]) * s;
      assert.ok(t >= -1, `el codo ${n + 1} queda para adentro (${meta.join(', ')})`);
    }
  }
  // Quieto, las alas cerradas le tapan las manos: le envuelven los costados hasta abajo.
  for (const n of [0, 1] as const) {
    const [mx, my] = manoEn(n, QUIETA);
    const xs = cantoDeAla(n, QUIETA).map((q) => q[0]);
    assert.ok(Math.abs(mx) < Math.max(...xs.map(Math.abs)) && my > A.alas[n][1], `la mano ${n + 1} asoma con las alas cerradas`);
  }
});

test('ataja: el huevo cae del nido derecho a las manos, se queda en la mano y vuelve a meterse en el nido', () => {
  const nido = nidoEn();
  const conM = (u: number): Momento => ({ ...QUIETA, ...ataje(u), huevo: QUIETA.huevo });
  // Asoma en el nido.
  const asoma = huevoEn(0.2, nido, conM(0.2));
  assert.ok(cerca([asoma.x, asoma.y], nido, 0.01) && asoma.o > 0.9);
  // Cae: cada vez más rápido, y llega a las manos justo cuando las manos están arriba.
  let antes = huevoEn(ATAJE.suelta, nido, conM(ATAJE.suelta)).y;
  let paso = 0;
  for (let i = 1; i <= 30; i++) {
    const u = ATAJE.suelta + ((ATAJE.ataja - ATAJE.suelta) * i) / 30;
    const y = huevoEn(u, nido, conM(u)).y;
    assert.ok(y - antes >= paso - 1e-9, 'no acelera al caer');
    paso = y - antes;
    antes = y;
  }
  const atajado = huevoEn(ATAJE.ataja, nido, conM(ATAJE.ataja));
  assert.ok(cerca([atajado.x, atajado.y], ATAJADO, 0.01));
  for (const n of [0, 1] as const) assert.ok(cerca(manoEn(n, conM(ATAJE.ataja)), ATAJADO, 16), `la mano ${n + 1} no está donde cae el huevo`);
  // Sin saltos: el huevo no se teletransporta en ningún momento del ataje.
  let previo = huevoEn(0, nido, conM(0));
  for (let i = 1; i <= 600; i++) {
    const u = (ATAJE.llega * i) / 600;
    const h = huevoEn(u, nido, conM(u));
    if (previo.o > 0 && h.o > 0) assert.ok(cerca([h.x, h.y], [previo.x, previo.y], 30), `a ${u.toFixed(2)} s el huevo salta`);
    previo = h;
  }
  // Mientras lo escucha, el huevo está pegado a la oreja.
  const escucha = huevoEn(2.3, nido, conM(2.3));
  assert.ok(cerca([escucha.x, escucha.y], A.oreja, 26), 'no se lleva el huevo a la oreja');
  assert.ok(ataje(2.3).parpados > 0.9, 'no cierra los ojos para escuchar');
  assert.ok(ataje(3.0).ceja > 0.9, 'no levanta la ceja de no creer');
  // Lo tira para arriba y cae en el nido, donde desaparece.
  const llega = huevoEn(ATAJE.llega - 1e-6, nido, conM(ATAJE.llega - 1e-6));
  assert.ok(cerca([llega.x, llega.y], nido, 2) && llega.o < 0.05, 'no vuelve al nido');
  assert.equal(huevoEn(ATAJE.llega + 0.1, nido, conM(5)).o, 0);
  assert.equal(ataje(DURA.ataja).alas, 0, 'no cierra las alas al final');
  // En el camino el nido queda más lejos, con la copa: la caída sale de ahí.
  assert.ok(nidoEn(2)[0] < nidoEn(1)[0] && Math.abs(alRecinto(nidoEn(1))[0] - NIDO[0]) < 1e-9);
});

test('al pie del árbol sin taparle la cara a nadie, ni abriendo las alas', () => {
  const otros = Object.entries({ ...OJOS_DEL_ARBOL, ...COSAS_DEL_ARBOL }).filter(([id]) => id !== ID);
  for (const m of momentos) {
    const ps = puntos(m);
    const xs = ps.map((q) => q[0]);
    const ys = ps.map((q) => q[1]);
    const [a, b, c, d] = [Math.min(...xs) - 3, Math.max(...xs) + 3, Math.min(...ys) - 3, Math.max(...ys) + 3];
    assert.ok(a > 0 && b < 900 && c > 0 && d < 640, 'se sale de la escena');
    for (const [id, [ox, oy]] of otros) assert.ok(!(ox > a - 6 && ox < b + 6 && oy > c - 6 && oy < d + 6), `le tapa la cara a ${id} (${a.toFixed(0)}-${b.toFixed(0)}, ${c.toFixed(0)}-${d.toFixed(0)})`);
  }
  assert.ok(VERSO[1] < LUGAR.piso - 110);
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

const PARTE = /<(?:g|ellipse|circle|path)\b([^>]*\bdata-parte="([^"]+)"[^>]*)>/g;

function domDeJuguete(html: string) {
  const partes: Juguete[] = [];
  for (const m of html.matchAll(PARTE)) {
    const atributos = new Map([...m[1]!.matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1]!, a[2]!] as const));
    partes.push({
      dataset: { parte: m[2]! },
      atributos,
      setAttribute(n, v) { this.atributos.set(n, v); },
      getAttribute(n) { return this.atributos.get(n) ?? null; },
    });
  }
  const oyentes = new Map<string, (ev: unknown) => void>();
  const titere = {
    querySelectorAll: (sel: string) => (sel === '[data-parte]' ? partes : []),
    addEventListener: (tipo: string, fn: (ev: unknown) => void) => oyentes.set(tipo, fn),
  };
  const marco = { dataset: { dx: '0' }, querySelector: (sel: string) => (sel === '.titere--angel' ? titere : null) };
  const foto = (): Record<string, string> =>
    Object.fromEntries(partes.map((p) => [p.dataset.parte!, `${p.getAttribute('transform') ?? ''}|${p.getAttribute('opacity') ?? ''}`]));
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
  const dichos: Array<[string, number, number, boolean | undefined]> = [];
  let reloj = 0;
  return {
    esc: { hablar: (id: string, x: number, y: number, abajo?: boolean) => void dichos.push([id, x, y, abajo]), quieto: () => quieto, reloj: () => reloj },
    dichos,
    poner: (t: number) => void (reloj = t),
  };
}

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = domDeJuguete(marcado);
    const antes = dom.foto();
    const { esc } = escenario(quieto);
    const vivo = armarAngelCon([dom.marco], esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes, quieto ? 'con movimiento reducido no queda como sin JavaScript' : 'al armarse se mueve');
  }
});

test('vive: respira, mira de reojo y ataja más de un huevo; solo no abre las alas del todo', () => {
  const dom = domDeJuguete(marcado);
  const { esc, poner } = escenario(false);
  const vivo = armarAngelCon([dom.marco], esc, azar(11));
  const miradas = new Set<string>();
  let huevo = 0;
  for (let i = 1; i <= 60 * 60; i++) {
    const t = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const e = vivo.estado();
    assert.equal(e.tocado, false, `a ${t.toFixed(1)} s hizo el gesto sin que lo toquen`);
    miradas.add(e.mirada);
    huevo = Math.max(huevo, Number(dom.de('huevo', 'opacity')));
    for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
    // Solo, las alas no se abren más que para atajar.
    const giro = Number(/rotate\((-?[\d.]+)/.exec(dom.de('ala-1', 'transform'))![1]);
    assert.ok(giro > -A.abre * 0.5, `a ${t.toFixed(1)} s abre las alas sin que lo toquen`);
  }
  assert.ok(vivo.estado().atajes >= 2, 'no ataja');
  assert.ok(huevo > 0.99, 'el huevo no se ve');
  assert.ok(miradas.size >= 3, 'no mira para ningún lado');
});

test('tocado, abre las alas para recibirte y las cierra; dice su verso; con movimiento reducido cambia de pose quieta', () => {
  const dom = domDeJuguete(marcado);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarAngelCon([dom.marco], esc, azar(3));
  poner(0.5);
  vivo.mover(0.5, 1 / 60);
  dom.oyentes.get('click')!({});
  assert.equal(dichos.length, 0, 'abre la ficha antes de que se vea el gesto');
  let abre = 0;
  for (let i = 1; i <= 60 * 4; i++) {
    const t = 0.5 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    abre = Math.max(abre, -Number(/rotate\((-?[\d.]+)/.exec(dom.de('ala-1', 'transform'))![1]));
  }
  assert.deepEqual(dichos[0]!.slice(0, 3), [ID, VERSO[0], VERSO[1]]);
  assert.ok(abre > A.abre * 0.95, 'no abre las alas del todo');
  assert.equal(vivo.estado().tocado, false, 'no vuelve a cerrarlas');
  assert.equal(vivo.reaccionar('otro-bicho', 0), false);
  assert.equal(vivo.reaccionar(ID, 9), true);

  // Tocado mientras ataja, primero termina: no suelta el huevo.
  const d2 = domDeJuguete(marcado);
  const e2 = escenario(false);
  const v2 = armarAngelCon([d2.marco], e2.esc, () => 0);
  for (let i = 1; i <= 60 * 6; i++) {
    const t = i / 60;
    e2.poner(t);
    v2.mover(t, 1 / 60);
    if (v2.estado().atajando && Number(d2.de('huevo', 'opacity')) > 0.9 && !v2.estado().tocado) d2.oyentes.get('click')!({});
  }
  assert.ok(v2.estado().atajes >= 1);

  const q = domDeJuguete(marcado);
  const quieto = escenario(true);
  const vivoQuieto = armarAngelCon([q.marco], quieto.esc, azar(3));
  const cerradas = q.foto();
  q.oyentes.get('click')!({});
  const abiertas = q.foto();
  assert.notDeepEqual(abiertas, cerradas, 'tocado con movimiento reducido no cambia de pose');
  vivoQuieto.mover(5, 0);
  vivoQuieto.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), abiertas, 'con movimiento reducido se movió solo');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), cerradas, 'tocado otra vez no vuelve a cerrar las alas');
});

test('la ficha: el retrato son las alas abiertas en su llanura, y la estampa dice de dónde sale', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/arbol-piso.webp') && svg.includes('/bestiario/angel-ala-1.webp'));
  const [x0, y0, w, h] = r.caja;
  for (const [x, y] of puntos(ABIERTO)) assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.match(b.estampa, /Lobo suelto/);
  assert.match(b.estampa, /no les cree/);
});

test('la isla del ángel se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/angel.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco/.test(r)), []);
});
