import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_DINAMITA, RETRATO } from './arte-dinamita.ts';
import { AULLA, DINAMITA_ARMADO as A, LUGAR, QUIETO, RANGO, VERSO, VUELO, alRecinto, enLaMecha, marcas, mechaHasta, pie, type Momento, type Punto } from './rig-dinamita.ts';
import { CHAPA } from './rig.ts';
import { VECINOS_DEL_BALDIO } from './escenas.ts';
import { LUGAR as PSICOPATA } from './rig-psicopata.ts';
import { BUM, DEMORA_FICHA, DURA, armarDinamitaCon, explosion } from '../../scripts/bestiario/dinamita.ts';

/**
 * Mi perro dinamita (`D-73`, decimonovena vuelta): que sea un títere entero, que pise la tierra del
 * baldío al trote, que la mecha salga del cartucho y se queme desde la punta, que la explosión estalle
 * cuando la chispa llega al atado y lo desarme, que se vuelva a armar entero, que no le tape la cara a
 * nadie, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const figura = capasDe('los-techos', 'figura', nombres, 1, 'mi-perro-dinamita');
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_DINAMITA.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const lejos = (a: Punto, b: Punto): number => Math.hypot(a[0] - b[0], a[1] - b[1]);
const conBum = (u: number): Momento => ({ ...QUIETO, ...Object.fromEntries(Object.entries(explosion(u)).filter(([, v]) => v !== undefined)) });

test('el perro es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--dinamita" data-id="mi-perro-dinamita" role="button" tabindex="0" aria-label="Mi perro dinamita">/);
  const partes = ['entero', 'perro', 'tronco', 'mecha', 'mecha-trenza', 'chispa', 'hollin-tronco', 'pata-del-cerca', 'pata-del-lejos', 'pata-tra-cerca', 'pata-tra-lejos',
    'cabeza', 'quijada', 'hollin-cabeza', 'pupila', 'parpado', 'fiebre', 'oreja', 'estallido', 'humo', 'esquirlas', 'fogonazo', 'estrella'];
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `al perro le falta ${p}`);
  const imagenes = [...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!);
  assert.deepEqual([...imagenes].sort(), PIEZAS_DINAMITA.map((p) => p.nombre).sort(), 'usa piezas que no se imprimen, o le sobra una');
  assert.ok(PIEZAS_DINAMITA.length <= 18, `${PIEZAS_DINAMITA.length} piezas`);
  // Cada bisagra cae adentro de las dos piezas que une.
  assert.ok(adentro('dinamita-tronco', A.pescuezo) && adentro('dinamita-cabeza', A.pescuezo), 'la cabeza gira en el aire');
  assert.ok(adentro('dinamita-cabeza', A.quijada) && adentro('dinamita-quijada', A.quijada), 'la quijada no cuelga de la cabeza');
  assert.ok(adentro('dinamita-cabeza', A.oreja) && adentro('dinamita-oreja', A.oreja), 'la oreja no sale de la cabeza');
  assert.ok(adentro('dinamita-cabeza', A.ojo.centro) && adentro('dinamita-cabeza', A.trufa) && adentro('dinamita-fiebre', A.trufa), 'el ojo o la trufa se salieron de la cabeza');
  for (const n of ['del-cerca', 'del-lejos'] as const) assert.ok(adentro('dinamita-tronco', A.hombro) && adentro(`dinamita-pata-${n}`, A.hombro), `la pata ${n} no cuelga del hombro`);
  for (const n of ['tra-cerca', 'tra-lejos'] as const) assert.ok(adentro('dinamita-tronco', A.cadera) && adentro(`dinamita-pata-${n}`, A.cadera), `la pata ${n} no cuelga de la cadera`);
  assert.ok(adentro('dinamita-tronco', A.centro), 'la explosión no sale del atado');
  // La mecha sale de la punta de atrás del cartucho del medio.
  assert.ok(Math.abs(enLaMecha(0)[0] - A.cartuchos.x1) < 1 && Math.abs(enLaMecha(0)[1] - A.cartuchos.y[1]!) < 2, 'la mecha no sale del cartucho');
  for (const n of ['chispa', 'fogonazo', 'estrella', 'esquirlas', 'humo']) assert.ok(adentro(`dinamita-${n}`, [0, 0]), `${n} no nace en su (0, 0)`);
  // Ni un hex: las tintas son tokens de su bloque.
  for (const p of PIEZAS_DINAMITA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  const peso = PIEZAS_DINAMITA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 60 && peso <= 260, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del perro están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨mi perro dinamita⟩'), tokens.indexOf('⟨/mi perro dinamita⟩'));
  const usadas = new Set(PIEZAS_DINAMITA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-dinamita-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 10);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del perro, o no dice de dónde salió`);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨mi perro dinamita⟩ */'), sitio.indexOf('/* ⟨/mi perro dinamita⟩ */'));
  const clases = new Set([...figura.matchAll(/class="(bt-dinamita-[a-z-]+)"/g)].map((m) => m[1]!));
  assert.ok(clases.size >= 5);
  for (const clase of clases) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
  for (const t of suyo.matchAll(/var\((--[a-z0-9-]+)\)/g)) assert.ok(tokens.includes(`${t[1]}:`), `${t[1]} no existe`);
});

test('el rótulo dice DINAMITA y la estrella dice BUM, en el amarillo de las letras de la tapa', () => {
  const tronco = PIEZAS_DINAMITA.find((p) => p.nombre === 'dinamita-tronco')!.dibujo;
  assert.equal((tronco.match(/<path d="M[^"]*" transform="translate\([^)]+\) scale\([^)]+\)"\/>/g) ?? []).length, 'DINAMITA'.length);
  assert.match(tronco, /stroke="var\(--bestia-dinamita-amarillo\)"/);
  assert.match(PIEZAS_DINAMITA.find((p) => p.nombre === 'dinamita-estrella')!.dibujo, /fill="var\(--bestia-dinamita-amarillo\)"/);
});

test('pisa la tierra: parado y al trote, las cuatro patas en el piso o arriba, nunca abajo', () => {
  for (const n of ['pata-del-cerca', 'pata-del-lejos', 'pata-tra-cerca', 'pata-tra-lejos'] as const) {
    assert.ok(Math.abs(pie(n, QUIETO)[1]) < 1e-6, `${n} no pisa la tierra`);
    for (let i = 0; i <= 40; i++) {
      const y = pie(n, { ...QUIETO, anda: 1, paso: (i / 40) * Math.PI * 2 })[1];
      assert.ok(y <= 1e-6 && y > -8, `${n} se hunde o vuela al trote (${y.toFixed(1)})`);
    }
  }
  assert.ok(Math.abs(alRecinto([0, 0])[1] - LUGAR.piso) < 1e-9);
  assert.ok(LUGAR.piso > CHAPA.abajo + 200, 'no está en la tierra');
});

test('la mecha se quema desde la punta, y la explosión estalla cuando la chispa llega al atado', () => {
  // Entera, termina en la punta de la cola; quemada, cada vez más cerca del cartucho.
  assert.ok(lejos(mechaHasta(1).punta, A.mecha[2]!) < 1e-9);
  let antes = Infinity;
  for (let k = 1; k >= 0; k -= 0.1) {
    const l = lejos(mechaHasta(k).punta, A.mecha[0]!);
    assert.ok(l <= antes + 1e-9, 'la mecha crece mientras se quema');
    antes = l;
  }
  const pasos = Array.from({ length: 400 }, (_, i) => (DURA.bum * i) / 399).map((u) => [u, conBum(u)] as const);
  const antesDe = pasos.filter(([u]) => u < BUM.estalla);
  assert.ok(antesDe.every(([, m]) => m.fogonazo.o === 0 && m.estrella.o === 0 && m.desarme === 0), 'explota antes de que la chispa llegue');
  assert.ok(antesDe.every(([, m]) => m.chispa.o === 1), 'la mecha no está prendida mientras se quema');
  assert.ok(antesDe.at(-1)![1].mecha < 0.2, 'la chispa no llega al cartucho');
  assert.ok(Math.max(...antesDe.map(([, m]) => Math.hypot(...m.temblor))) > 1, 'no tiembla');
  const despues = pasos.filter(([u]) => u >= BUM.estalla);
  assert.ok(Math.max(...despues.map(([, m]) => m.estrella.o)) > 0.99, 'no se ve el BUM');
  assert.ok(Math.max(...despues.map(([, m]) => m.fogonazo.o)) > 0.99 && Math.max(...despues.map(([, m]) => m.humo.o)) > 0.9, 'no hay fogonazo o humo');
  assert.ok(Math.max(...despues.map(([, m]) => m.desarme)) > 0.99, 'no vuela en pedazos');
  assert.ok(Math.max(...despues.map(([, m]) => Math.abs(m.sacude))) > 4, 'no se sacude el hollín');
  assert.ok(Math.max(...despues.map(([, m]) => m.cabeza)) > 30, 'no aúlla');
  // Armado de vuelta antes de que se abra la ficha, tiznado, con la mecha corta que vuelve a crecer.
  const armado = conBum(BUM.estalla + BUM.armado + 0.01);
  assert.equal(armado.desarme, 0, 'no se vuelve a armar');
  assert.ok(armado.hollin > 0.9 && armado.mecha < 0.3);
  assert.ok(BUM.estalla + BUM.armado < DEMORA_FICHA, 'la ficha se abre con el perro en pedazos');
  const fin = conBum(DURA.bum - 0.001);
  assert.deepEqual([fin.fogonazo.o, fin.estrella.o, fin.esquirlas.o, fin.humo.o, fin.desarme], [0, 0, 0, 0, 0], 'la explosión no se apaga');
  assert.ok(fin.mecha > 0.99, 'la mecha no le vuelve a crecer');
  assert.deepEqual(explosion(DURA.bum), {});
});

test('no le tapa la cara a nadie del baldío, ni al psicópata, y se queda en la escena, también volando', () => {
  const vecinos = Object.entries(VECINOS_DEL_BALDIO).filter(([id]) => id !== 'mi-perro-dinamita');
  const cuerpo: Punto[] = [[-108, -100], [-56, -150], [-34, -100], [46, -90], [82, -84], [70, -132], [-28, 0], [30, 0]];
  for (const x of [-RANGO, 0, RANGO]) {
    for (const mira of [1, -1]) {
      const ps = cuerpo.map(([px, py]) => alRecinto([x + px * mira, py]));
      const xs = ps.map((q) => q[0]);
      const ys = ps.map((q) => q[1]);
      const [a, b, c, d] = [Math.min(...xs) - 4, Math.max(...xs) + 4, Math.min(...ys) - 4, Math.max(...ys) + 4];
      for (const [id, [ox, oy]] of vecinos) assert.ok(!(ox > a - 8 && ox < b + 8 && oy > c - 8 && oy < d + 8), `le tapa la cara a ${id} en ${x}`);
      // Lejos del buen psicópata y su perro, que están a la izquierda.
      assert.ok(a > PSICOPATA.x + 50, `se mete en el psicópata (${a.toFixed(0)})`);
    }
  }
  // Las piezas que vuelan no se van del recinto ni se meten en la chapa.
  for (const [nombre, v] of Object.entries(VUELO)) {
    for (const x of [-RANGO, RANGO]) {
      const [px, py] = alRecinto([x + v.eje[0] + v.v[0], v.eje[1] + v.v[1]]);
      assert.ok(px > 0 && px < 1500 && py > CHAPA.abajo, `${nombre} vuela afuera`);
    }
  }
  assert.ok(VERSO[1] > CHAPA.abajo && VERSO[1] < LUGAR.piso - 100);
});

test('el retrato: aullando, tiznado y con la mecha otra vez prendida, sobre su pedazo de baldío', () => {
  const r = retratoDe('mi-perro-dinamita')!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const cuerpo = r.cuerpo();
  assert.match(cuerpo, /href="\/bestiario\/baldio-lejos\.webp"/);
  assert.ok(AULLA.hollin > 0 && AULLA.cabeza > 20 && AULLA.mecha < 1);
  const [x, y, w, h] = r.caja;
  assert.ok(x < LUGAR.x - 60 && x + w > LUGAR.x + 40 && y + h > LUGAR.piso && y < LUGAR.piso - 100);
  const estampa = datos.bestias.find((b) => b.id === 'mi-perro-dinamita')!.estampa;
  assert.match(estampa, /La mosca y la sopa/);
  assert.match(estampa, /Tocalo/);
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
  const nuevo = (m: RegExpMatchArray, parte?: string): Juguete => ({
    dataset: parte ? { parte } : {},
    atributos: new Map([...m[1]!.matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1]!, a[2]!] as const)),
    setAttribute(n, v) { this.atributos.set(n, v); },
    getAttribute(n) { return this.atributos.get(n) ?? null; },
  });
  for (const m of html.matchAll(PARTE)) partes.push(nuevo(m, m[2]!));
  const toque = nuevo(html.match(/<rect\b([^>]*class="bt-dinamita-toque"[^>]*)>/)!);
  const oyentes = new Map<string, (ev: unknown) => void>();
  const titere = {
    querySelectorAll: (sel: string) => (sel === '[data-parte]' ? partes : []),
    querySelector: (sel: string) => (sel === '.bt-dinamita-toque' ? toque : null),
    addEventListener: (tipo: string, fn: (ev: unknown) => void) => oyentes.set(tipo, fn),
  };
  const marco = { querySelector: (sel: string) => (sel === '.titere--dinamita' ? titere : null) };
  const foto = (): Record<string, string> =>
    Object.fromEntries(partes.map((p) => [p.dataset.parte!, `${p.getAttribute('transform') ?? ''}|${p.getAttribute('opacity') ?? ''}|${p.getAttribute('d') ?? ''}`]));
  const de = (nombre: string, at: string): string => partes.find((p) => p.dataset.parte === nombre)!.getAttribute(at) ?? '';
  return { marco: marco as unknown as SVGGElement, partes, oyentes, foto, de, toque };
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
    const dom = domDeJuguete(figura);
    const antes = dom.foto();
    const { esc } = escenario(quieto);
    const vivo = armarDinamitaCon([dom.marco], esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes, quieto ? 'con movimiento reducido no queda como sin JavaScript' : 'al armarse se mueve');
  }
  // Y lo que escribe el HTML es la cuenta de `marcas`.
  assert.ok(figura.includes(`transform="${marcas(QUIETO).transform.perro}"`));
});

test('vive solo: trota por el baldío dándose vuelta, aúlla y jadea, sin salirse; solo no explota', () => {
  const dom = domDeJuguete(figura);
  const { esc, poner } = escenario(false);
  const vivo = armarDinamitaCon([dom.marco], esc, azar(11));
  const xs = new Set<number>();
  const miras = new Set<number>();
  const cabezas = new Set<string>();
  const chispas: number[] = [];
  for (let i = 1; i <= 60 * 60; i++) {
    const t = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const e = vivo.estado();
    assert.ok(!e.explotando && e.estallidos === 0, `a ${t.toFixed(1)} s explotó sin que lo toquen`);
    assert.ok(Math.abs(e.x) <= RANGO + 1e-6, 'se va del baldío');
    xs.add(Math.round(e.x));
    miras.add(Math.sign(Math.round(e.mira)));
    cabezas.add(dom.de('cabeza', 'transform'));
    chispas.push(Number(dom.de('chispa', 'opacity')));
  }
  assert.ok(xs.size > 40, 'no camina');
  assert.ok(miras.has(1) && miras.has(-1), 'no se da vuelta');
  assert.ok(cabezas.size > 100, 'la cabeza no se mueve');
  assert.ok(chispas.some((o) => o > 0.5), 'la mecha nunca chisporrotea sola');
  // El rectángulo que se toca anda con él.
  assert.notEqual(dom.toque.getAttribute('x'), null);
});

test('tocado: se prende, estalla una vez, sacude la cámara, se rearma y dice su verso; con movimiento reducido, aúlla tiznado', () => {
  const dom = domDeJuguete(figura);
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarDinamitaCon([dom.marco], esc, azar(3));
  const sacudones: number[] = [];
  const doc = { dispatchEvent: (ev: { detail: number }) => void sacudones.push(ev.detail) };
  (globalThis as { document?: unknown }).document = doc;
  (globalThis as { CustomEvent?: unknown }).CustomEvent = class { detail: number; constructor(_: string, o: { detail: number }) { this.detail = o.detail; } };
  try {
    poner(2);
    vivo.mover(2, 1 / 60);
    dom.oyentes.get('click')!({});
    let maxEstrella = 0;
    for (let i = 1; i <= 60 * 8; i++) {
      const t = 2 + i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      maxEstrella = Math.max(maxEstrella, Number(dom.de('estrella', 'opacity')));
      // Tocarlo de nuevo mientras explota no lo vuelve a prender.
      if (i === 60) dom.oyentes.get('click')!({});
    }
    assert.equal(vivo.estado().estallidos, 1);
    assert.ok(maxEstrella > 0.99, 'no se vio el BUM');
    assert.deepEqual(sacudones.length, 1, 'la cámara no se sacude, o se sacude de más');
    assert.equal(dichos.length, 1, 'no dice su verso');
    assert.equal(dichos[0]![0], 'mi-perro-dinamita');
    assert.match(dom.de('perro', 'transform'), /^translate/);
  } finally {
    delete (globalThis as { document?: unknown }).document;
    delete (globalThis as { CustomEvent?: unknown }).CustomEvent;
  }
  // Con movimiento reducido no se mueve nada: tocarlo lo pasa a la pose del aullido, y vuelta.
  const quieto = domDeJuguete(figura);
  const q = escenario(true);
  armarDinamitaCon([quieto.marco], q.esc, azar(5));
  quieto.oyentes.get('click')!({});
  assert.equal(quieto.de('cabeza', 'transform'), marcas(AULLA).transform.cabeza);
  assert.equal(quieto.de('estrella', 'opacity'), '0.00', 'con movimiento reducido explota');
  assert.equal(q.dichos.length, 1);
  quieto.oyentes.get('click')!({});
  assert.equal(quieto.de('cabeza', 'transform'), marcas(QUIETO).transform.cabeza);
});
