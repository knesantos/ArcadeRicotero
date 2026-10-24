import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_SATURNO, RETRATO } from './arte-saturno.ts';
import { QUIETO, SATURNO, SATURNO_ARMADO, TURNO, VERSO, alRecinto, enElAnillo, type Punto } from './rig-saturno.ts';
import { VECINOS_DEL_TEMPLO } from './escenas.ts';
import { MORTA } from './rig-morta.ts';
import { MOMO } from './rig.ts';
import { CAE, DURA, armarSaturnoCon, lunasAdelante, type Accion } from '../../scripts/bestiario/saturno.ts';

/**
 * El Dr. Saturno (`D-73`, decimoctava vuelta): que sea un títere entero a aerógrafo, que atienda en su
 * rincón del templo sin encimarse con nadie, que flote sin pisar, que las lunitas le den la vuelta por
 * delante y por detrás, que tocado dé un turno, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; tema?: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-doctor-saturno';
const marcado = capasDe('el-templo', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_SATURNO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};

test('el Dr. Saturno es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(marcado, /<g class="titere titere--saturno" data-id="el-doctor-saturno" role="button" tabindex="0" aria-label="El Dr. Saturno">/);
  const partes = ['entero', 'sombra', 'flota', 'halo', 'cabeza', 'anillo-atras', 'anillo-delante', 'espejo', 'brazo-1', 'brazo-2', 'boleto'];
  for (const n of [1, 2, 3]) partes.push(`luna-atras-${n}`, `luna-delante-${n}`);
  for (const p of partes) assert.ok(marcado.includes(`data-parte="${p}"`), `al Dr. Saturno le falta ${p}`);
  const imagenes = new Set([...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_SATURNO.map((p) => p.nombre).sort());
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`saturno-brazo-${n + 1}`, SATURNO_ARMADO.hombros[n]) && adentro('saturno-cuerpo', SATURNO_ARMADO.hombros[n]), `el brazo ${n + 1} no sale del hombro`);
    assert.ok(adentro(`saturno-brazo-${n + 1}`, SATURNO_ARMADO.manos[n]), `la mano ${n + 1} se sale de su brazo`);
  }
  assert.ok(adentro('saturno-brazo-1', SATURNO_ARMADO.turnero), 'el turnero se sale del brazo');
  assert.ok(adentro('saturno-cara', SATURNO_ARMADO.cara) && adentro('saturno-cuerpo', SATURNO_ARMADO.cuello), 'la cabeza no se apoya en el cuello');
  // El anillo entero entra entre sus dos mitades, y la cara queda en el medio del anillo.
  const { centro, rx } = SATURNO_ARMADO.anillo;
  for (const lado of ['atras', 'delante']) assert.ok(adentro(`saturno-anillo-${lado}`, [centro[0] - rx, centro[1]]) && adentro(`saturno-anillo-${lado}`, [centro[0] + rx, centro[1]]), `la mitad ${lado} no llega a las puntas`);
  assert.ok(Math.abs(centro[0] - SATURNO_ARMADO.cara[0]) < 4 && Math.abs(centro[1] - SATURNO_ARMADO.cara[1]) < 8, 'el anillo no rodea la cabeza');
  for (const p of PIEZAS_SATURNO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  // Es aerógrafo, como *Momo sampler*: soplado y con grano.
  for (const n of ['saturno-cuerpo', 'saturno-cara', 'saturno-anillo-delante']) assert.match(PIEZAS_SATURNO.find((p) => p.nombre === n)!.dibujo, /url\(#soplo-[a-z]+\)[\s\S]*|url\(#grano\)/);
  const peso = PIEZAS_SATURNO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 15 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del Dr. Saturno están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el dr. saturno⟩'), tokens.indexOf('⟨/el dr. saturno⟩'));
  const usadas = new Set(PIEZAS_SATURNO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-saturno-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 8);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del Dr. Saturno`);
  assert.match(bloque, /momo-sampler-trasera/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el dr. saturno⟩ */'), sitio.indexOf('/* ⟨/el dr. saturno⟩ */'));
  for (const clase of new Set([...marcado.matchAll(/class="(bt-saturno-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

/** Lo que ocupa en el recinto, flotando como flote: del anillo a los jirones, de manga a manga. */
function ocupa(flota: number): readonly [number, number, number, number] {
  const [x0] = alRecinto([-SATURNO_ARMADO.anillo.rx - 6, 0], flota);
  const [x1] = alRecinto([SATURNO_ARMADO.anillo.rx + 6, 0], flota);
  const [, y0] = alRecinto([0, SATURNO_ARMADO.anillo.centro[1] - 52], flota);
  const [, y1] = alRecinto([0, SATURNO_ARMADO.ruedo], flota);
  return [x0, y0, x1, y1];
}

test('atiende en su rincón del templo: delante de la columna, sin encimarse con nadie, y flota sin pisar', () => {
  const [x0, y0, x1, y1] = ocupa(QUIETO.flota + 8);
  for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_TEMPLO)) {
    if (id === ID) continue;
    assert.ok(!(ox > x0 - 12 && ox < x1 + 12 && oy > y0 - 12 && oy < y1 + 12), `${id} queda adentro del Dr. Saturno`);
  }
  // El Morta y lo que se hamaca Momo quedan lejos.
  assert.ok(x0 - (MORTA.x + 60) > 30, 'se le encima al Morta');
  assert.ok(x0 - MOMO.argolla.x > 250, 'Momo le pega cuando se hamaca');
  // Flota: el ruedo nunca toca el piso, ni en lo más bajo.
  assert.ok(alRecinto([0, SATURNO_ARMADO.ruedo], QUIETO.flota - 8)[1] < SATURNO.piso - 4, 'pisa el piso');
  assert.ok(SATURNO.x >= 0 && SATURNO.x <= 900);
});

test('las lunitas van por el anillo: por delante de la cabeza en la mitad de abajo, por detrás en la de arriba', () => {
  for (let i = 0; i < 24; i++) {
    const v = ((i + 0.3) / 24) * Math.PI * 2;
    const { punto: [x, y], adelante } = enElAnillo(v);
    const { centro: [cx, cy], rx, ry, ladeo } = SATURNO_ARMADO.anillo;
    // El punto, desladeado, cae sobre la elipse del anillo, en la banda.
    const a = (-ladeo * Math.PI) / 180;
    const [dx, dy] = [(x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)];
    const r = Math.hypot(dx / rx, dy / ry);
    assert.ok(r > 0.82 && r < 1, `la lunita se sale de la banda (${r.toFixed(2)})`);
    assert.equal(adelante, dy > 0);
  }
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
  const marco = { dataset: { dx: '0' }, querySelector: (sel: string) => (sel === '.titere--saturno' ? titere : null) };
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

/** Lo que flota, leyendo la parte `flota`. */
const flotaDe = (dom: ReturnType<typeof domDeJuguete>): number => -Number(/translate\(0 ([-\d.]+)\)/.exec(dom.de('flota', 'transform'))![1]);

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = domDeJuguete(marcado);
    const antes = dom.foto();
    const vivo = armarSaturnoCon([dom.marco], escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive: flota, las lunitas le dan la vuelta, y ausculta, se prende el espejo, llama y hace bailar el anillo', () => {
  const hechas: Record<Accion, number> = { ausculta: 0, espejo: 0, llama: 0, gira: 0, turno: 0 };
  const flotas: number[] = [];
  const lados = new Set<string>();
  let espejo = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = domDeJuguete(marcado);
    const { esc, poner } = escenario(false);
    const vivo = armarSaturnoCon([dom.marco], esc, azar(semilla));
    let antes = flotaDe(dom);
    for (let i = 1; i <= 60 * 60; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const f = flotaDe(dom);
      assert.ok(Math.abs(f - antes) < 2, `a ${t.toFixed(2)} s salta`);
      antes = f;
      flotas.push(f);
      // Cada lunita se ve una sola vez: o adelante o atrás.
      for (const n of [1, 2, 3]) assert.notEqual(dom.de(`luna-atras-${n}`, 'opacity'), dom.de(`luna-delante-${n}`, 'opacity'), `la lunita ${n} está en los dos lados`);
      for (const n of [1, 2, 3]) lados.add(`${n}${dom.de(`luna-delante-${n}`, 'opacity')}`);
      espejo = Math.max(espejo, Number(dom.de('espejo', 'opacity')));
      assert.equal(dom.de('boleto', 'opacity'), '0', 'dio un turno sin que lo toquen');
      if (i % 30 === 0) for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
    assert.ok(vivo.estado().lunas > 20, 'las lunitas no dan la vuelta');
  }
  assert.equal(hechas.turno, 0);
  for (const a of ['ausculta', 'espejo', 'llama', 'gira'] as const) assert.ok(hechas[a] >= 2, `no ${a} (${hechas[a]})`);
  assert.ok(Math.max(...flotas) - Math.min(...flotas) > 6, 'no sube y baja');
  assert.ok(Math.min(...flotas) > 12, 'baja hasta el piso');
  assert.equal(lados.size, 6, 'alguna lunita no pasa por delante y por detrás');
  assert.ok(espejo > 0.9, 'no se prende el espejo');
  assert.ok(lunasAdelante(TURNO) >= 0 && lunasAdelante(TURNO) <= 3);
});

test('tocado, da un turno: el boleto sale del turnero y cae al piso del templo; dice su verso; con movimiento reducido cambia de pose', () => {
  const dom = domDeJuguete(marcado);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarSaturnoCon([dom.marco], esc, azar(5));
  poner(0.3);
  vivo.mover(0.3, 1 / 60);
  dom.oyentes.get('click')!({});
  assert.equal(dichos.length, 0);
  let visto = false;
  let halo = 0;
  let masBajo = -Infinity;
  for (let i = 1; i <= 60 * 4.2; i++) {
    const t = 0.3 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    if (Number(dom.de('boleto', 'opacity')) > 0.5) {
      visto = true;
      masBajo = Math.max(masBajo, Number(/translate\([-\d.]+ ([-\d.]+)\)/.exec(dom.de('boleto', 'transform'))![1]));
    }
    halo = Math.max(halo, Number(dom.de('halo', 'opacity')));
  }
  assert.ok(visto, 'no sale el boleto');
  assert.ok(masBajo > CAE[1] - 20, `el boleto no llega al piso (${masBajo.toFixed(0)})`);
  assert.equal(dom.de('boleto', 'opacity'), '0', 'el boleto no se va');
  assert.ok(halo > 0.9, 'no se le prende el halo');
  assert.equal(vivo.estado().hechas.turno, 1);
  assert.deepEqual(dichos[0], [ID, VERSO[0], VERSO[1]]);
  assert.equal(vivo.reaccionar('otro', 0), false);
  assert.equal(vivo.reaccionar(ID, 9), true);
  assert.ok(DURA.turno > 3);

  const q = domDeJuguete(marcado);
  const quieto = escenario(true);
  const vq = armarSaturnoCon([q.marco], quieto.esc, azar(3));
  const antes = q.foto();
  q.oyentes.get('click')!({});
  const turno = q.foto();
  assert.notDeepEqual(turno, antes);
  assert.equal(q.de('boleto', 'opacity'), '1');
  vq.mover(5, 0);
  vq.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), turno, 'con movimiento reducido se movió solo');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), antes);
});

test('la ficha: el retrato es el turno en su rincón del templo; la estampa dice qué es del dibujo y qué de la letra', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/templo-lejos.webp') && svg.includes('/bestiario/saturno-cara.webp'));
  const [x0, y0, w, h] = r.caja;
  const { centro, rx } = SATURNO_ARMADO.anillo;
  for (const p of [[centro[0] - rx, centro[1]], [centro[0] + rx, centro[1]], [0, SATURNO_ARMADO.ruedo], [TURNO.boleto.x, TURNO.boleto.y + TURNO.flota]] as const) {
    const [x, y] = alRecinto(p, TURNO.flota);
    assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  }
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.equal(b.tema, 'dr-saturno');
  assert.match(b.estampa, /Momo sampler/);
  assert.match(b.estampa, /saturnales/);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /letra/);
});

test('la isla del Dr. Saturno se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/saturno.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco/.test(r)), []);
});
