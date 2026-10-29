import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_PACMAN, RETRATO, celdas } from './arte-pacman.ts';
import { BOCAS, CELDA, FANTASMA, HAMBRE, MUERTE, PASILLO, PUNTOS, QUIETA, marcas, medida, pacman } from './rig-pacman.ts';
import { COSAS_DE_CYBERSIBERIA, CYBER, OJOS_DE_CYBERSIBERIA } from './rig-entornos.ts';
import { CASA, armarPacmanCon } from '../../scripts/bestiario/pacman.ts';

/**
 * El pac-man (`D-73`, decimoséptima vuelta): que sea pixel de verdad y en las tintas del fichín, que la
 * fila esté donde estaba la pintada, que no le tape la cara a nadie de Cybersiberia, que la partida se
 * juegue sola sin romperse, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-pac-man';
const marcado = capasDe('cybersiberia', 'figura', nombres, 1, ID);

test('el pac-man es un títere entero, de pixel: cada cuadro con sus celdas en la grilla', () => {
  assert.match(marcado, /<g class="titere titere--pacman" data-id="el-pac-man" role="button" tabindex="0" aria-label="El pac-man">/);
  const partes = ['pacman', 'boca-0', 'boca-1', 'boca-2', 'chispa', 'fantasma', 'fantasma-rojo-0', 'fantasma-azul-1', 'fantasma-blanco-0', 'ojos', 'pupilas', 'pastilla', 'puntaje', 'halo-fantasma'];
  for (const p of [...partes, ...MUERTE.map((_, i) => `muere-${i + 1}`), ...PUNTOS.map((_, i) => `punto-${i + 1}`)]) assert.ok(marcado.includes(`data-parte="${p}"`), `al pac-man le falta ${p}`);
  const imagenes = new Set([...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_PACMAN.map((p) => p.nombre).sort());
  // Pixel de verdad: cada celda es un cuadrado de `CELDA`, en la grilla, y no hay curvas.
  for (const d of [...marcado.matchAll(/<path d="([^"]+)" class="bt-pacman/g)].map((m) => m[1]!)) {
    assert.doesNotMatch(d, /[CQAaS]/, 'un pixel con curva');
    for (const celda of d.split('Z').filter(Boolean)) assert.match(celda, new RegExp(`^M-?[\\d.]+ -?[\\d.]+h${CELDA}v${CELDA}h-${CELDA}$`));
  }
  // Los cuadros tienen su medida: el pac-man de 13, el fantasma de 14, y la boca abre para la derecha.
  for (const c of [...BOCAS, ...MUERTE]) assert.deepEqual(medida(c), [13, 13]);
  for (const c of FANTASMA) assert.deepEqual(medida(c), [14, 14]);
  assert.equal(BOCAS[0]!.join('').split('#').length - 1 > BOCAS[2]!.join('').split('#').length - 1, true, 'la boca abierta no come celdas');
  assert.equal(pacman(52)[6]![12], '.', 'la boca no abre para adelante');
  assert.equal(pacman(52)[6]![0], '#', 'la nuca se abrió');
  assert.equal(celdas(['#'], [0, 0]), `M${-CELDA / 2} ${-CELDA / 2}h${CELDA}v${CELDA}h-${CELDA}Z`);
  for (const p of PIEZAS_PACMAN) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
});

test('las tintas del pac-man son las quince del fichín, en su bloque de sitio.css', () => {
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el pac-man⟩ */'), sitio.indexOf('/* ⟨/el pac-man⟩ */'));
  const clases = new Set([...marcado.matchAll(/class="(bt-pacman-[a-z-]+)"/g)].map((m) => m[1]!));
  assert.ok(clases.size >= 8);
  for (const clase of clases) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
  // Todo lo que pinta el pixel es una tinta del fichín; el toque no pinta nada.
  for (const [, regla] of suyo.matchAll(/\.bt-pacman-[a-z-]+ \{ fill: ([^;]+);/g)) assert.match(regla!, /^var\(--px-[a-z0-9-]+\)$|^transparent$/, regla);
  assert.match(suyo, /crispEdges/);
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  for (const [, t] of suyo.matchAll(/var\((--px-[a-z0-9-]+)\)/g)) assert.ok(tokens.includes(`${t}:`), `${t} no es del fichín`);
});

test('la fila está donde estaba la pintada, y el pac-man arranca donde estaba él', () => {
  assert.equal(PASILLO.y, CYBER.puntos.y);
  assert.ok(PUNTOS[0] === CYBER.puntos.desde && PUNTOS.at(-1)! <= CYBER.puntos.hasta && PUNTOS.length >= 15);
  assert.equal(QUIETA.pac.x, CYBER.pacman.x);
  assert.ok(PASILLO.pastilla < PUNTOS[0]!, 'la pastilla no está en la punta');
  // La pintada ya no está en el piso: el piso no dibuja la fila.
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8'), /CYBER\.pacman/);
});

test('juega en su fila sin taparle la cara a nadie de Cybersiberia', () => {
  const otros = Object.entries({ ...OJOS_DE_CYBERSIBERIA, ...COSAS_DE_CYBERSIBERIA }).filter(([id]) => id !== ID);
  // Lo que ocupa: el pasillo entero, del alto del fantasma, más el 200 que sale arriba.
  const [a, b] = [PASILLO.desde - 10 - 7 * CELDA, CASA + 7 * CELDA];
  const [c, d] = [PASILLO.y - 30 - 3 * CELDA, PASILLO.y + 7 * CELDA];
  assert.ok(a > 0 && b < 900 && c > 0 && d < 640);
  for (const [id, [ox, oy]] of otros) assert.ok(!(ox > a - 6 && ox < b + 6 && oy > c - 6 && oy < d + 6), `le tapa la cara a ${id}`);
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
  const marco = { dataset: { dx: '0' }, querySelector: (sel: string) => (sel === '.titere--pacman' ? titere : null) };
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

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = domDeJuguete(marcado);
    const antes = dom.foto();
    const vivo = armarPacmanCon([dom.marco], escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('la partida se juega sola: come la fila, la repone, lo persigue el fantasma, se muere y se lo come', () => {
  let [comidos, niveles, fantasmas, muertes] = [0, 0, 0, 0];
  for (const semilla of [1, 2, 3, 4, 5]) {
    const dom = domDeJuguete(marcado);
    const { esc, poner } = escenario(false);
    const vivo = armarPacmanCon([dom.marco], esc, azar(semilla));
    const modos = new Set<string>();
    for (let i = 1; i <= 60 * 90; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const e = vivo.estado();
      modos.add(e.modo);
      assert.ok(e.x >= PASILLO.desde - 1e-9 && e.x <= PASILLO.hasta + 1e-9, `se fue del pasillo (${e.x})`);
      if (i % 30 === 0) {
        for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
        // Nunca hay dos bocas a la vez, ni dos fantasmas.
        const bocas = ['boca-0', 'boca-1', 'boca-2', 'chispa', ...MUERTE.map((_, k) => `muere-${k + 1}`)].filter((n) => dom.de(n, 'opacity') === '1');
        assert.ok(bocas.length <= 1, `dos bocas: ${bocas}`);
        const cuerpos = dom.partes.filter((p) => /^fantasma-(rojo|azul|blanco)/.test(p.dataset.parte!) && p.getAttribute('opacity') === '1');
        assert.ok(cuerpos.length <= 1, 'dos fantasmas');
      }
    }
    const e = vivo.estado();
    [comidos, niveles, fantasmas, muertes] = [comidos + e.comidos, niveles + e.niveles, fantasmas + e.fantasmas, muertes + e.muertes];
    assert.ok(modos.has('persigue'), 'el fantasma nunca persigue');
  }
  assert.ok(comidos > PUNTOS.length * 5, 'no come');
  assert.ok(niveles >= 2, 'nunca deja la fila limpia');
  assert.ok(fantasmas >= 1, 'nunca se come al fantasma');
  assert.ok(muertes >= 1, 'nunca se muere');
});

test('tocado, le da el hambre: el fantasma aparece azul y se lo come; dice su verso; con movimiento reducido cambia de pose', () => {
  const dom = domDeJuguete(marcado);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarPacmanCon([dom.marco], esc, azar(9));
  poner(0.5);
  vivo.mover(0.5, 1 / 60);
  dom.oyentes.get('click')!({});
  assert.ok(vivo.estado().poder && vivo.estado().modo === 'asustado', 'no le da el hambre');
  assert.equal(dichos.length, 0);
  for (let i = 1; i <= 60 * 8; i++) {
    const t = 0.5 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
  }
  assert.equal(dichos[0]![0], ID);
  assert.equal(vivo.estado().fantasmas, 1, 'no se come al fantasma');
  assert.equal(vivo.reaccionar('otro', 0), false);
  assert.equal(vivo.reaccionar(ID, 9), true);

  const q = domDeJuguete(marcado);
  const quieto = escenario(true);
  const vq = armarPacmanCon([q.marco], quieto.esc, azar(3));
  const antes = q.foto();
  q.oyentes.get('click')!({});
  const hambre = q.foto();
  assert.notDeepEqual(hambre, antes);
  const { opacity } = marcas(HAMBRE);
  assert.equal(q.de('fantasma-azul-0', 'opacity'), opacity['fantasma-azul-0']);
  vq.mover(5, 0);
  vq.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), hambre, 'con movimiento reducido se movió solo');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), antes);
});

test('la ficha: el retrato es el hambre detrás del fantasma azul, y la estampa dice que es pixel', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/cyber-piso.webp') && svg.includes('bt-pacman-azul'));
  const [x0, y0, w, h] = r.caja;
  for (const x of [HAMBRE.pac.x - 20, HAMBRE.fantasma.x + 21]) assert.ok(x > x0 && x < x0 + w);
  for (const y of [PASILLO.y - 21, PASILLO.y + 21]) assert.ok(y > y0 && y < y0 + h);
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.match(b.estampa, /pixel/);
  assert.match(b.estampa, /fichín/);
});

test('la isla del pac-man se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/pacman.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco/.test(r)), []);
});
