import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_ANIMAL, RETRATO } from './arte-animal.ts';
import { ANIMAL, ANIMAL_ARMADO, ESCALA, MUESTRA, QUIETO, VERSO, alRecinto, correa, type Punto } from './rig-animal.ts';
import { VECINOS_DEL_MONTE, escenaMonte } from './escena-monte.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { ACECHO, PALO, PASTURA } from './rig.ts';
import { DURA, ESCONDIDO, armarAnimalCon, type Accion } from '../../scripts/bestiario/animal.ts';

/**
 * Tu animal (`D-73`, decimoctava vuelta): que sea un títere entero, pintado con la brocha de *Gulp!*, que
 * esté entre las tiras del monte sin taparle los ojos a nadie, que se esconda y queden los ojos, que tocado
 * se muestre, que camine en el monte del camino donde estaban sus ojos, y que la pose de la isla sea la del
 * HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; tema?: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'tu-animal';
const marcado = capasDe('el-monte', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_ANIMAL.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};

test('tu animal es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(marcado, /<g class="titere titere--animal" data-id="tu-animal" role="button" tabindex="0" aria-label="Tu animal">/);
  for (const p of ['entero', 'sombra', 'correa', 'anda', 'cuerpo', 'cola', 'torso', 'cabeza', 'boca', 'quijada', 'ojos', 'pupila-1', 'pupila-2', 'parpado-1', 'parpado-2']) {
    assert.ok(marcado.includes(`data-parte="${p}"`), `a tu animal le falta ${p}`);
  }
  const imagenes = new Set([...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_ANIMAL.map((p) => p.nombre).sort());
  const A = ANIMAL_ARMADO;
  assert.ok(adentro('animal-cuerpo', A.cogote) && adentro('animal-cabeza', A.cogote), 'la cabeza no se apoya en el cogote');
  for (const { centro } of A.ojos) assert.ok(adentro('animal-cabeza', centro), 'un ojo se sale de la cabeza');
  assert.ok(adentro('animal-cabeza', A.hocico) && adentro('animal-quijada', A.quijada) && adentro('animal-boca', A.quijada), 'la quijada no gira de atrás de la boca');
  assert.ok(adentro('animal-cola', A.cola) && adentro('animal-cuerpo', A.cola), 'la cola no sale del anca');
  assert.ok(adentro('animal-cuerpo', A.argolla), 'la argolla no está en el collar');
  // Es pincel seco de *Gulp!*: las pasadas van con la fotocopia, y lo de color es el rojo y el amarillo corridos.
  for (const n of ['animal-cuerpo', 'animal-cabeza', 'animal-cola']) assert.match(PIEZAS_ANIMAL.find((p) => p.nombre === n)!.dibujo, /url\(#xerox\)/, `${n} no es pincel fotocopiado`);
  assert.match(PIEZAS_ANIMAL.find((p) => p.nombre === 'animal-cuerpo')!.dibujo, /url\(#xerox-fino\)/, 'el collar no es corrido');
  for (const p of PIEZAS_ANIMAL) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  const peso = PIEZAS_ANIMAL.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 10 && peso <= 160, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de tu animal están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨tu animal⟩'), tokens.indexOf('⟨/tu animal⟩'));
  const usadas = new Set([...PIEZAS_ANIMAL.map((p) => p.dibujo).join('').matchAll(/var\((--bestia-animal-[a-z-]+)\)/g)].map((m) => m[1]!));
  assert.ok(usadas.size >= 4);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de tu animal`);
  assert.match(bloque, /gulp-interior-frontal/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨tu animal⟩ */'), sitio.indexOf('/* ⟨/tu animal⟩ */'));
  for (const clase of new Set([...marcado.matchAll(/class="(bt-animal-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('está en el borde del fondo del monte: adentro de la escena, lejos del claro, sin taparle los ojos a nadie', () => {
  const escena = escenaMonte(nombres);
  assert.ok(escena.includes('data-marco="tu-animal"'));
  assert.ok(!escena.includes('bestia--ojos" data-id="tu-animal"'), 'sigue siendo ojos en lo oscuro');
  // Lo que ocupa, mostrándose y con el paso más largo: del hocico a la cola, de las orejas al piso.
  const [x0] = alRecinto([ANIMAL_ARMADO.hocico[0] + MUESTRA.paso - 16, 0]);
  const [x1] = alRecinto([150, 0]);
  const [, y0] = alRecinto([0, -180]);
  const y1 = ANIMAL.piso;
  assert.ok(x0 > 0 && x1 < 900 + 30, 'se sale de la escena');
  for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_MONTE)) {
    if (id === ID) continue;
    assert.ok(!(ox > x0 - 8 && ox < x1 + 8 && oy > y0 - 8 && oy < y1 + 8), `${id} queda adentro de tu animal`);
  }
  // Lejos de la pastura (el cordero y su soga) y de donde acecha el lobo.
  assert.ok(x0 > PALO.x + PASTURA.rx * 0.6, 'se mete en la pastura');
  assert.ok(x0 > ACECHO.hasta + 20 || y1 < ACECHO.piso, 'se le encima al lobo');
  // La correa se va para arriba y afuera del monte.
  const [cx, cy] = alRecinto(ANIMAL_ARMADO.correa);
  assert.ok(cx > 900 || cy < 0, 'la correa termina adentro del monte: se ve que nadie la tiene');
  assert.match(correa(QUIETO), /^M[-\d.]+ [-\d.]+ Q[-\d.]+ [-\d.]+ [-\d.]+ [-\d.]+$/);
});

test('en el camino camina en el monte, donde estaban sus ojos, y ya no es ojos', () => {
  const tramo = CAMINOS['el-monte']!;
  const piso = pisoDelCamino(tramo, nombres);
  const m = /data-marco="tu-animal" data-capa="figura" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no camina en el monte del camino');
  assert.equal(Number(m[1]), Math.round(tramo.ojos[ID]![0] - ANIMAL.x));
  assert.ok(!piso.includes('bestia--ojos" data-id="tu-animal"'), 'sigue siendo ojos en el camino');
  assert.ok(Number(m[1]) + ANIMAL.x < tramo.ancho, 'se sale del tramo');
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
  for (const m of html.matchAll(/<(?:g|path)\b([^>]*\bdata-parte="([^"]+)"[^>]*)>/g)) {
    const atributos = new Map([...m[1]!.matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1]!, a[2]!] as const));
    partes.push({ dataset: { parte: m[2]! }, atributos, setAttribute(n, v) { this.atributos.set(n, v); }, getAttribute(n) { return this.atributos.get(n) ?? null; } });
  }
  const oyentes = new Map<string, (ev: unknown) => void>();
  const titere = { querySelectorAll: (sel: string) => (sel === '[data-parte]' ? partes : []), addEventListener: (tipo: string, fn: (ev: unknown) => void) => oyentes.set(tipo, fn) };
  const marco = { dataset: { dx: '0' }, querySelector: (sel: string) => (sel === '.titere--animal' ? titere : null) };
  const foto = (): Record<string, string> => Object.fromEntries(partes.map((p) => [p.dataset.parte!, `${p.getAttribute('transform') ?? ''}|${p.getAttribute('opacity') ?? ''}|${p.getAttribute('d') ?? ''}`]));
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

/** Cuánto abre la quijada, leyendo su giro. */
const abre = (dom: ReturnType<typeof domDeJuguete>): number => -Number(/rotate\(([-\d.]+)/.exec(dom.de('quijada', 'transform'))![1]);

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = domDeJuguete(marcado);
    const antes = dom.foto();
    const vivo = armarAnimalCon([dom.marco], escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive: se esconde y quedan los ojos, olfatea, mira, se acomoda y parpadea, sin pelar los dientes solo', () => {
  const hechas: Record<Accion, number> = { esconde: 0, olfatea: 0, mira: 0, paso: 0, muestra: 0 };
  let minimo = 1;
  let parpadeos = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = domDeJuguete(marcado);
    const { esc, poner } = escenario(false);
    const vivo = armarAnimalCon([dom.marco], esc, azar(semilla));
    let antes = vivo.estado().paso;
    for (let i = 1; i <= 60 * 60; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const ve = Number(dom.de('cuerpo', 'opacity'));
      minimo = Math.min(minimo, ve);
      // Los ojos no se esconden nunca: van aparte del cuerpo.
      assert.equal(dom.de('ojos', 'opacity'), '', 'se le apagan los ojos');
      assert.equal(dom.de('boca', 'opacity'), '0', 'pela los dientes sin que lo toquen');
      const paso = vivo.estado().paso;
      assert.ok(Math.abs(paso - antes) < 1.5, `a ${t.toFixed(2)} s salta`);
      antes = paso;
      if (i % 30 === 0) for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}${p.getAttribute('d')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
    parpadeos += vivo.estado().parpadeos;
  }
  assert.equal(hechas.muestra, 0);
  for (const a of ['esconde', 'olfatea', 'mira', 'paso'] as const) assert.ok(hechas[a] >= 2, `no ${a} (${hechas[a]})`);
  assert.ok(minimo < ESCONDIDO + 0.02, 'no se esconde del todo');
  assert.ok(parpadeos >= 15, 'no parpadea');
});

test('tocado, se muestra: sale entero, pela los dientes con la correa tensa y después baja la cabeza; dice su verso; con movimiento reducido cambia de pose', () => {
  const dom = domDeJuguete(marcado);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarAnimalCon([dom.marco], esc, azar(5));
  poner(0.3);
  vivo.mover(0.3, 1 / 60);
  dom.oyentes.get('click')!({});
  assert.equal(dichos.length, 0);
  let ve = 0;
  let maxAbre = 0;
  let bajo = -Infinity;
  const correas = new Set<string>();
  for (let i = 1; i <= 60 * 4.5; i++) {
    const t = 0.3 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    ve = Math.max(ve, Number(dom.de('cuerpo', 'opacity')));
    maxAbre = Math.max(maxAbre, abre(dom));
    bajo = Math.max(bajo, Number(/rotate\(([-\d.]+)/.exec(dom.de('cabeza', 'transform'))![1]));
    correas.add(dom.de('correa', 'd'));
  }
  assert.ok(ve > 0.95, 'no sale entero de lo oscuro');
  assert.ok(maxAbre > 20, 'no pela los dientes');
  assert.ok(bajo > 12, 'no baja la cabeza para que lo acaricien');
  assert.ok(correas.size > 20, 'la correa no se mueve');
  assert.equal(vivo.estado().hechas.muestra, 1);
  assert.deepEqual(dichos[0], [ID, VERSO[0], VERSO[1]]);
  assert.equal(vivo.reaccionar('otro', 0), false);
  assert.equal(vivo.reaccionar(ID, 9), true);
  assert.ok(DURA.muestra > 3);

  const q = domDeJuguete(marcado);
  const quieto = escenario(true);
  const vq = armarAnimalCon([q.marco], quieto.esc, azar(3));
  const antes = q.foto();
  q.oyentes.get('click')!({});
  const muestra = q.foto();
  assert.notDeepEqual(muestra, antes);
  assert.equal(q.de('boca', 'opacity'), '1');
  vq.mover(5, 0);
  vq.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), muestra, 'con movimiento reducido se movió solo');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), antes);
});

test('la ficha: el retrato es tu animal mostrándose; la estampa dice qué es del dibujo y qué de la letra', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/monte-lejos.webp') && svg.includes('/bestiario/animal-cabeza.webp'));
  const [x0, y0, w, h] = r.caja;
  for (const p of [[ANIMAL_ARMADO.hocico[0] + MUESTRA.paso, ANIMAL_ARMADO.hocico[1]], [-96, -172], [84, 0], [130, -50]] as const) {
    const [x, y] = alRecinto([p[0], p[1]]);
    assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  }
  assert.ok(ESCALA > 0.4 && ESCALA < 0.7);
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.equal(b.tema, 'unos-pocos-peligros-sensatos');
  assert.match(b.estampa, /Gulp!/);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /letra/);
});

test('la isla de tu animal se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/animal.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco|pincel/.test(r)), []);
});
