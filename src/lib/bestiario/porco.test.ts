import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_PORCO, RETRATO } from './arte-porco.ts';
import { LUGAR, PORCO_ARMADO, QUIETA, ROCK, VERSO, alRecinto, delCuerpo, pezuna, type Momento, type Punto } from './rig-porco.ts';
import { COSAS_DE_CYBERSIBERIA, OJOS_DE_CYBERSIBERIA } from './rig-entornos.ts';
import { DURA, armarPorcoCon, patasAlTrote, revuelco, rock } from '../../scripts/bestiario/porco.ts';

/**
 * Porco Rex (`D-73`, decimosexta vuelta): que sea un títere entero, que pise la nieve trotando, que se
 * pare en las ancas con las pezuñas arriba, que se eche en el barro sin hundirse, que no le tape la
 * cara a nadie de Cybersiberia, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; cuenta?: Array<{ rotulo: string; fuente?: string; quien?: string }> }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const marcado = capasDe('cybersiberia', 'figura', nombres, 1, 'porco-rex');
const A = PORCO_ARMADO;
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_PORCO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const PATAS = [0, 1, 2, 3] as const;

/** Los momentos que recorre: quieto, rockeando, al trote, revolcándose, en las dos puntas y mirando para los dos lados. */
const momentos: Momento[] = [
  QUIETA,
  ROCK,
  ...Array.from({ length: 24 }, (_, i) => ({ ...QUIETA, patas: patasAlTrote((i / 24) * Math.PI * 2), rebote: Math.abs(Math.sin((i / 24) * Math.PI * 2)) * 2.4 })),
  ...Array.from({ length: 30 }, (_, i) => ({ ...QUIETA, ...rock((DURA.rock * i) / 29) })),
  ...Array.from({ length: 30 }, (_, i) => ({ ...QUIETA, ...revuelco((DURA.revuelca * i) / 29) })),
  ...([-1, 1] as const).flatMap((mira) => ([-LUGAR.ida, LUGAR.ida] as const).map((x) => ({ ...QUIETA, x, mira }))),
  { ...ROCK, x: LUGAR.ida },
  { ...ROCK, x: -LUGAR.ida, mira: -1 as const },
];

/** Los puntos de Porco en un momento, en el recinto: las pezuñas, el lomo, la trompa, la corona y la cola. */
function puntos(m: Momento): Punto[] {
  const enLaCabeza = (p: Punto): Punto => {
    const [px, py] = A.pescuezo;
    const g = (m.cabeza * Math.PI) / 180;
    const [dx, dy] = [(p[0] - px) * A.agranda, (p[1] - py) * A.agranda];
    return delCuerpo([px + dx * Math.cos(g) - dy * Math.sin(g), py + dx * Math.sin(g) + dy * Math.cos(g)], m);
  };
  const enTitere: Punto[] = [
    ...PATAS.map((n) => pezuna(n, m)), delCuerpo([-50, -40], m), delCuerpo([0, -76], m), delCuerpo([-58, -60], m),
    enLaCabeza([88, -48]), enLaCabeza([A.corona[0], A.corona[1] - 14]), enLaCabeza([80, -88]),
  ];
  return enTitere.map(([x, y]) => [LUGAR.x + m.x + x * LUGAR.escala * m.mira, LUGAR.piso + y * LUGAR.escala] as Punto);
}

test('Porco es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(marcado, /<g class="titere titere--porco" data-id="porco-rex" role="button" tabindex="0" aria-label="Porco Rex">/);
  const partes = ['entero', 'salpica', 'cuerpo', 'pata-1', 'pata-2', 'pata-3', 'pata-4', 'cola', 'cabeza', 'oreja-1', 'oreja-2', 'boca', 'adentro', 'ceja', 'corona', 'brillo', 'vaho'];
  for (const p of partes) assert.ok(marcado.includes(`data-parte="${p}"`), `a Porco le falta ${p}`);
  const imagenes = [...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!);
  assert.deepEqual([...imagenes].sort(), PIEZAS_PORCO.map((p) => p.nombre).sort(), 'usa piezas que no se imprimen, o le sobra una');
  assert.ok(PIEZAS_PORCO.length <= 18, `${PIEZAS_PORCO.length} piezas`);
  for (const n of PATAS) {
    assert.ok(adentro('porco-cuerpo', A.patas[n]) && adentro(`porco-pata-${n + 1}`, A.patas[n]), `la pata ${n + 1} no cuelga del cuerpo`);
    assert.ok(adentro(`porco-pata-${n + 1}`, [A.patas[n][0], A.patas[n][1] + A.pata]), `la pezuña ${n + 1} se sale de su pata`);
  }
  assert.ok(adentro('porco-cuerpo', A.cola) && adentro('porco-cola', A.cola), 'la cola no sale del anca');
  assert.ok(adentro('porco-cuerpo', A.pescuezo) && adentro('porco-cabeza', A.pescuezo) && adentro('porco-armino', A.pescuezo), 'la cabeza gira en el aire');
  assert.ok(adentro('porco-cuerpo', A.ancas), 'se para desde afuera del cuerpo');
  for (const n of [0, 1] as const) assert.ok(adentro(`porco-oreja-${n + 1}`, A.orejas[n]) && adentro('porco-cabeza', A.orejas[n]), `la oreja ${n + 1} no sale de la cabeza`);
  assert.ok(adentro('porco-corona', A.corona) && adentro('porco-cabeza', [A.corona[0], A.corona[1] + 4]), 'la corona no está en la cabeza');
  assert.ok(adentro('porco-cabeza', A.anteojos) && adentro('porco-brillo', A.anteojos), 'los anteojos se salieron de la cara');
  assert.ok(adentro('porco-cabeza', A.trompa), 'la trompa se salió de la cara');
  for (const p of PIEZAS_PORCO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  const peso = PIEZAS_PORCO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de Porco están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨Porco Rex⟩'), tokens.indexOf('⟨/Porco Rex⟩'));
  const usadas = new Set(PIEZAS_PORCO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-porco-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 4);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de Porco, o no dice de dónde salió`);
  // Lo demás es de la tapa de su disco: el acero, la nieve y la lente de Cybersiberia.
  const deLaTapa = new Set(PIEZAS_PORCO.flatMap((p) => [...p.dibujo.matchAll(/var\((--entorno-cyber-[a-z-]+)\)/g)].map((m) => m[1]!)));
  for (const t of ['--entorno-cyber-acero', '--entorno-cyber-nieve', '--entorno-cyber-lente']) assert.ok(deLaTapa.has(t), `no usa ${t}`);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨Porco Rex⟩ */'), sitio.indexOf('/* ⟨/Porco Rex⟩ */'));
  for (const clase of new Set([...marcado.matchAll(/class="(bt-porco-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('pisa la nieve: al trote levanta las pezuñas, pero ninguna se hunde', () => {
  for (const n of PATAS) assert.ok(Math.abs(pezuna(n, QUIETA)[1]) < 1e-6, `la pezuña ${n + 1} no está en la nieve`);
  for (let i = 0; i < 48; i++) {
    const fase = (i / 48) * Math.PI * 2;
    const m = { ...QUIETA, patas: patasAlTrote(fase), rebote: Math.abs(Math.sin(fase)) * 2.4 };
    const ys = PATAS.map((n) => pezuna(n, m)[1]);
    for (const y of ys) assert.ok(y < 0.5 && y > -9, `al trote una pezuña queda a ${y.toFixed(1)}`);
    // El trote es cruzado: la de adelante de acá va con la de atrás de allá.
    assert.equal(m.patas[0], m.patas[3]);
    assert.equal(m.patas[1], m.patas[2]);
  }
});

test('parado en dos patas: las de atrás en la nieve y las de adelante arriba, haciendo los cuernos', () => {
  // Se apoya en las ancas, que giran en el medio de las dos caderas: una pata queda en puntas de pie y la
  // otra apenas se hunde, lo que en el recinto es un píxel o dos.
  for (const n of [2, 3] as const) assert.ok(pezuna(n, ROCK)[1] > -6 && pezuna(n, ROCK)[1] < 3, `parado, la pata ${n + 1} no pisa (${pezuna(n, ROCK)[1].toFixed(1)})`);
  const pecho = delCuerpo([46, -58], ROCK)[1];
  for (const n of [0, 1] as const) {
    const p = pezuna(n, ROCK);
    assert.ok(p[1] < -70, `la pezuña ${n + 1} no sube (${p[1].toFixed(0)})`);
    // Arriba de la cadera de la que cuelga: la pata apunta para arriba.
    assert.ok(p[1] < delCuerpo(A.patas[n], ROCK)[1] - 10, `la pata ${n + 1} no apunta para arriba`);
  }
  assert.ok(pecho < -100, 'parado, el cuerpo no se endereza');
});

test('se echa en el barro sin hundirse, y se levanta', () => {
  for (let i = 0; i <= 60; i++) {
    const u = (DURA.revuelca * i) / 60;
    const m = { ...QUIETA, ...revuelco(u) };
    for (const n of PATAS) assert.ok(pezuna(n, m)[1] < 1.5, `a ${u.toFixed(2)} s la pezuña ${n + 1} se hunde (${pezuna(n, m)[1].toFixed(1)})`);
    assert.ok(delCuerpo([0, -18], m)[1] < 3, `a ${u.toFixed(2)} s la panza se hunde en la nieve`);
  }
  const echado = Math.max(...Array.from({ length: 60 }, (_, i) => revuelco((DURA.revuelca * i) / 59).echado));
  assert.ok(echado > 0.99, 'no se echa');
  assert.equal(revuelco(DURA.revuelca).echado, 0, 'no se levanta');
});

test('trota en su campo sin taparle la cara a nadie de Cybersiberia', () => {
  const otros: Array<[string, Punto]> = [
    ...Object.entries(OJOS_DE_CYBERSIBERIA).filter(([id]) => id !== 'porco-rex').map(([id, [x, y]]) => [id, [x, y] as Punto] as [string, Punto]),
    ...Object.entries(COSAS_DE_CYBERSIBERIA).map(([id, [x, y]]) => [id, [x, y] as Punto] as [string, Punto]),
  ];
  for (const m of momentos) {
    const ps = puntos(m);
    const xs = ps.map((q) => q[0]);
    const ys = ps.map((q) => q[1]);
    const [a, b, c, d] = [Math.min(...xs) - 3, Math.max(...xs) + 3, Math.min(...ys) - 3, Math.max(...ys) + 3];
    assert.ok(a > 0 && b < 900 && c > 0 && d < 640, 'se sale de la escena');
    for (const [id, [ox, oy]] of otros) assert.ok(!(ox > a - 6 && ox < b + 6 && oy > c - 6 && oy < d + 6), `le tapa la cara a ${id} (${a.toFixed(0)}-${b.toFixed(0)}, ${c.toFixed(0)}-${d.toFixed(0)})`);
  }
  assert.ok(VERSO[1] < LUGAR.piso - 50);
  assert.ok(Math.abs(alRecinto([10, -20])[0] - (LUGAR.x + 10 * LUGAR.escala)) < 1e-9);
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
  const marco = { querySelector: (sel: string) => (sel === '.titere--porco' ? titere : null) };
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
    const vivo = armarPorcoCon([dom.marco], esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes, quieto ? 'con movimiento reducido no queda como sin JavaScript' : 'al armarse se mueve');
  }
});

test('vive: trota de punta a punta, pega la vuelta, se revuelca en el barro; solo no rockea', () => {
  const dom = domDeJuguete(marcado);
  const { esc, poner } = escenario(false);
  const vivo = armarPorcoCon([dom.marco], esc, azar(11));
  let [min, max] = [0, 0];
  let revolco = false;
  let vaho = 0;
  for (let i = 1; i <= 60 * 45; i++) {
    const t = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const e = vivo.estado();
    assert.equal(e.rockeando, false, `a ${t.toFixed(1)} s rockeó sin que lo toquen`);
    assert.ok(Math.abs(e.x) <= LUGAR.ida + 1e-6, `se fue de su campo (${e.x.toFixed(1)})`);
    min = Math.min(min, e.x);
    max = Math.max(max, e.x);
    if (e.revolcandose) revolco = true;
    vaho = Math.max(vaho, Number(dom.de('vaho', 'opacity')));
    for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
  }
  assert.ok(min < -LUGAR.ida + 1 && max > LUGAR.ida - 1, `no llega a las puntas (${min.toFixed(0)} a ${max.toFixed(0)})`);
  assert.ok(vivo.estado().vueltas >= 3, 'no pega la vuelta');
  assert.ok(revolco, 'no se revuelca en el barro');
  assert.ok(vaho > 0.5, 'no larga vaho');
});

test('tocado, se para y rockea, y vuelve a trotar; dice su verso; con movimiento reducido cambia de pose quieta', () => {
  const dom = domDeJuguete(marcado);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarPorcoCon([dom.marco], esc, azar(3));
  poner(0.5);
  vivo.mover(0.5, 1 / 60);
  dom.oyentes.get('click')!({});
  // La ficha espera al gesto: el verso se dice después.
  assert.equal(dichos.length, 0, 'abre la ficha antes de que se vea el gesto');
  let rockeo = false;
  let boca = 0;
  for (let i = 1; i <= 60 * 4; i++) {
    const t = 0.5 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    if (vivo.estado().rockeando) rockeo = true;
    boca = Math.max(boca, Number(dom.de('adentro', 'opacity')));
  }
  assert.equal(dichos[0]![0], 'porco-rex');
  // Lo dice arriba de donde está trotando.
  assert.ok(Math.abs(dichos[0]![1] - VERSO[0]) <= LUGAR.ida + 1e-9 && dichos[0]![2] === VERSO[1]);
  assert.ok(rockeo && boca > 0.99, 'no rockea ni chilla');
  assert.equal(vivo.estado().rockeando, false, 'no vuelve a las cuatro patas');
  assert.equal(vivo.reaccionar('otro-bicho', 0), false);
  assert.equal(vivo.reaccionar('porco-rex', 9), true);

  const q = domDeJuguete(marcado);
  const quieto = escenario(true);
  const vivoQuieto = armarPorcoCon([q.marco], quieto.esc, azar(3));
  const cuatro = q.foto();
  q.oyentes.get('click')!({});
  const dos = q.foto();
  assert.notDeepEqual(dos, cuatro, 'tocado con movimiento reducido no cambia de pose');
  vivoQuieto.mover(5, 0);
  vivoQuieto.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), dos, 'con movimiento reducido se movió solo');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), cuatro, 'tocado otra vez no vuelve a las cuatro patas');
});

test('la ficha: el retrato es el rock en su charco, y lo que cuenta es testimonio fichado', () => {
  const r = retratoDe('porco-rex')!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/cyber-piso.webp') && svg.includes('/bestiario/porco-corona.webp') && svg.includes('/bestiario/porco-charco.webp'));
  const [x0, y0, w, h] = r.caja;
  for (const [x, y] of puntos(ROCK)) assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  const b = datos.bestias.find((x) => x.id === 'porco-rex')!;
  assert.match(b.estampa, /Último bondi/);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /letra/);
  assert.ok(b.cuenta?.some((c) => c.rotulo === 'testimonio' && c.fuente === 'RES-21' && /p\. 397/.test(c.quien ?? '')), 'lo del rey arrastrado al barro no está como testimonio');
});

test('la isla de Porco se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/porco.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco/.test(r)), []);
});
