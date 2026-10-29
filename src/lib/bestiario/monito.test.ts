import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { CULO_PIEL, LOMO, PIEZAS_MONITO, RETRATO } from './arte-monito.ts';
import {
  ARRIBA, CANTO, MIEMBROS, MONITO, MONITO_ARMADO, PARADAS, TRAMO, VERSO, agarre, alTitere, caderaEn, destape, pose,
  type Punto,
} from './rig-monito.ts';
import { ARBOL, COSAS_DEL_ARBOL, OJOS_DEL_ARBOL } from './rig-entornos.ts';
import { armarMonitoCon } from '../../scripts/bestiario/monito.ts';

/**
 * El monito que trepa (`D-73`, decimoquinta vuelta): que sea un títere entero, que trepe agarrado al
 * tronco de verdad, que cuanto más alto trepe más se le vea el culo, que no le tape la cara a nadie,
 * y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; cuenta?: Array<{ rotulo: string; fuente: string }> }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const marcado = capasDe('el-arbol', 'figura', nombres, 1, 'el-monito-que-trepa');
const A = MONITO_ARMADO;
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_MONITO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
/** Si un punto está adentro de un polígono (rayo a la derecha). */
function enPoligono(pts: readonly Punto[], [x, y]: Punto): boolean {
  let dentro = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]!;
    const [xj, yj] = pts[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}
/** Del títere al recinto, con la cadera en `cadera`. */
const alRecinto = ([x, y]: Punto, [cx, cy]: Punto): Punto => [cx + x * MONITO.escala, cy + y * MONITO.escala];
const rot = ([x, y]: Punto, [px, py]: Punto, grados: number): Punto => {
  const a = (grados * Math.PI) / 180;
  return [px + (x - px) * Math.cos(a) - (y - py) * Math.sin(a), py + (x - px) * Math.sin(a) + (y - py) * Math.cos(a)];
};
const muestras = Array.from({ length: 41 }, (_, i) => (TRAMO * i) / 40);

test('el monito es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(marcado, /<g class="titere titere--monito" data-id="el-monito-que-trepa" role="button" tabindex="0" aria-label="El monito que trepa">/);
  const partes = ['entero', 'pata-1', 'pie-1', 'pata-2', 'pie-2', 'brazo-1', 'mano-1', 'brazo-2', 'mano-2', 'culo', 'cola', 'rulo', 'cabeza', 'pupila-1', 'pupila-2', 'parpado-1', 'parpado-2', 'mueca'];
  for (const p of partes) assert.ok(marcado.includes(`data-parte="${p}"`), `al monito le falta ${p}`);
  const imagenes = [...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!);
  assert.deepEqual([...imagenes].sort(), PIEZAS_MONITO.map((p) => p.nombre).sort(), 'usa piezas que no se imprimen, o le sobra una');
  assert.ok(PIEZAS_MONITO.length >= 5 && PIEZAS_MONITO.length <= 14, `${PIEZAS_MONITO.length} piezas`);
  for (const n of [1, 2] as const) {
    const h = A.hombros[n - 1];
    const codo: Punto = [h[0], h[1] - A.largos.brazo];
    const c = A.caderas[n - 1];
    const rodilla: Punto = [c[0], c[1] + A.largos.muslo];
    assert.ok(adentro('monito-lomo', h) && adentro(`monito-brazo-${n}`, h), `el hombro ${n} no está en el hombro`);
    assert.ok(adentro(`monito-brazo-${n}`, codo) && adentro(`monito-antebrazo-${n}`, codo), `el codo ${n} no une las dos mitades`);
    assert.ok(adentro('monito-lomo', c) && adentro(`monito-muslo-${n}`, c), `la cadera ${n} no está en la cadera`);
    assert.ok(adentro(`monito-muslo-${n}`, rodilla) && adentro(`monito-pierna-${n}`, rodilla), `la rodilla ${n} no une las dos mitades`);
  }
  assert.ok(adentro('monito-lomo', A.cuello) && adentro('monito-cabeza', A.cuello), 'la cabeza gira en el aire');
  assert.ok(adentro('monito-lomo', A.cola) && adentro('monito-cola', A.cola), 'la cola no nace del lomo');
  assert.ok(adentro('monito-cola', A.rulo) && adentro('monito-rulo', A.rulo), 'el rulo no sigue a la cola');
  for (const o of A.ojos) assert.ok(adentro('monito-cabeza', o.centro), 'un ojo se salió de la cara');
  for (const m of marcado.matchAll(/data-parte="parpado-\d"[^>]*>/g)) assert.match(m[0], /data-pivote="-?[\d.]+ -?[\d.]+"/);
  // Ni un hex: las tintas son tokens de su bloque.
  for (const p of PIEZAS_MONITO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
});

test('las tintas del monito están en su bloque de tokens.css, y nada más las usa él', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el monito que trepa⟩'), tokens.indexOf('⟨/el monito que trepa⟩'));
  const usadas = new Set(PIEZAS_MONITO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-monito-[a-z]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 6);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del monito, o no dice de dónde salió`);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el monito que trepa⟩ */'), sitio.indexOf('/* ⟨/el monito que trepa⟩ */'));
  for (const clase of new Set([...marcado.matchAll(/class="(bt-monito-[a-z]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase} {`), `${clase} no está en su bloque de sitio.css`);
});

test('trepa agarrado al tronco de verdad: cada mano y cada pie llega a su agarre, en el canto', () => {
  const { tronco } = ARBOL;
  for (const s of muestras) {
    const p = pose(s);
    for (const m of MIEMBROS) {
      const { punto, suelto } = agarre(m, s);
      // Lo que alcanza la cuenta de los dos tramos es el agarre: ni corto ni largo.
      const llega = alRecinto(p.miembros[m.nombre].punta, p.cadera);
      assert.ok(Math.hypot(llega[0] - punto[0], llega[1] - punto[1]) < 0.6, `${m.nombre} no llega a su agarre a ${s.toFixed(1)}: le falta ${Math.hypot(llega[0] - punto[0], llega[1] - punto[1]).toFixed(1)}`);
      if (suelto) continue;
      assert.ok(Math.abs(punto[0] - tronco.x) <= CANTO, `${m.nombre} se agarra del aire`);
      assert.ok(punto[1] > tronco.horqueta + 20 && punto[1] < tronco.pie - 30, `${m.nombre} se agarra fuera del tronco (${punto[1].toFixed(0)})`);
    }
  }
  // Agarrado, el agarre no se mueve mientras el cuerpo sube: es la mano la que tira.
  for (const m of MIEMBROS) {
    const a = agarre(m, 3);
    const b = agarre(m, 4);
    if (!a.suelto && !b.suelto) assert.deepEqual(a.punto, b.punto, `${m.nombre} resbala`);
  }
  // Donde se para, los cuatro están agarrados.
  for (const s of PARADAS) for (const m of MIEMBROS) assert.equal(agarre(m, s).suelto, 0, `${m.nombre} queda en el aire a ${s.toFixed(1)}`);
  assert.equal(PARADAS.at(-1), TRAMO);
});

test('cuanto más alto trepa el monito, el culo más se le ve', () => {
  // Cuánto del culo pelado queda afuera del pelo del lomo, con la cola encima o no.
  const grilla: Punto[] = [];
  for (let x = -18; x <= 18; x += 1.5) for (let y = 4; y <= 28; y += 1.5) if (enPoligono(CULO_PIEL, [x, y])) grilla.push([x, y]);
  const seVe = (s: number): number => {
    const p = pose(s);
    const [cx, cy] = A.culo;
    return grilla.filter(([x, y]) => !enPoligono(LOMO, [cx + (x - cx) * p.culo.crece, cy + (y - cy) * p.culo.crece + p.culo.baja])).length / grilla.length;
  };
  assert.equal(seVe(0), 0, 'abajo, a media altura, el culo no está tapado');
  assert.ok(seVe(TRAMO) > 0.45, `arriba se le ve apenas el ${(seVe(TRAMO) * 100).toFixed(0)} %`);
  let antes = -1;
  for (const s of muestras) {
    const v = seVe(s);
    assert.ok(v >= antes, `a ${s.toFixed(1)} se le ve menos que más abajo`);
    antes = v;
  }
  // Abajo la cola le cuelga encima del culo; arriba está levantada, por encima de la cadera.
  const rulo = (s: number): Punto => rot(A.rulo, A.cola, pose(s).cola);
  assert.ok(rulo(0)[1] > A.culo[1] && Math.abs(rulo(0)[0]) < 6, 'abajo la cola no cuelga sobre el culo');
  assert.ok(rulo(TRAMO)[1] < A.cola[1] - 10 && rulo(TRAMO)[0] > 10, 'arriba la cola no está levantada');
  assert.ok(destape(TRAMO / 2) > destape(TRAMO / 4) && destape(TRAMO) === 1 && destape(0) === 0);
});

test('trepa adentro de la escena y no le tapa la cara a nadie del árbol', () => {
  const medios: number[] = [];
  const otros: Punto[] = [
    ...Object.entries(OJOS_DEL_ARBOL).filter(([id]) => id !== 'el-monito-que-trepa').map(([, [x, y]]) => [x, y] as Punto),
    ...Object.values(COSAS_DEL_ARBOL).map(([x, y]) => [x, y] as Punto),
  ];
  for (const s of muestras) {
    const p = pose(s);
    // Los puntos del cuerpo en el recinto: cadera, hombros, codos y rodillas, puños y pies, cabeza.
    const puntos: Punto[] = [p.cadera, alRecinto(A.cuello, p.cadera), alRecinto([1, -130], p.cadera), alRecinto([22, -110], p.cadera), alRecinto([-27, -100], p.cadera)];
    for (const m of MIEMBROS) puntos.push(alRecinto(p.miembros[m.nombre].punta, p.cadera));
    for (const n of [1, 2] as const) {
      puntos.push(alRecinto(rot([A.hombros[n - 1][0], A.hombros[n - 1][1] - A.largos.brazo], A.hombros[n - 1], p.miembros[`brazo-${n}`].arriba), p.cadera));
      puntos.push(alRecinto(rot([A.caderas[n - 1][0], A.caderas[n - 1][1] + A.largos.muslo], A.caderas[n - 1], p.miembros[`pata-${n}`].arriba), p.cadera));
    }
    const xs = puntos.map((q) => q[0]);
    const ys = puntos.map((q) => q[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs) - 8, Math.max(...xs) + 8, Math.min(...ys) - 8, Math.max(...ys) + 8];
    assert.ok(x0 > 0 && x1 < 900 && y0 > 0 && y1 < 640, 'se sale de la escena');
    for (const [ox, oy] of otros) assert.ok(!(ox > x0 - 12 && ox < x1 + 12 && oy > y0 - 12 && oy < y1 + 12), `a ${s.toFixed(1)} le tapa los ojos a alguien en ${ox}, ${oy}`);
    medios.push((y0 + y1) / 2);
  }
  // Abajo está a media altura del tronco que se ve (de donde termina la copa, 258, al pie); arriba
  // llega hasta donde se abren las ramas, sin meterse en la copa.
  const { pie, horqueta } = ARBOL.tronco;
  assert.ok(Math.abs(medios[0]! - (258 + pie) / 2) < 20, `abajo no está a media altura del tronco: el medio del monito está en ${medios[0]!.toFixed(0)}`);
  assert.ok(medios.at(-1)! < medios[0]! - TRAMO + 5, 'no trepó lo que dice que trepa');
  assert.ok(ARRIBA > horqueta + 60, 'arriba se mete en la copa');
  assert.equal(caderaEn(0)[1], MONITO.abajo);
  // El verso se dice arriba de donde termina de trepar, no encima de él.
  assert.ok(VERSO[1] < ARRIBA - 60 && VERSO[0] === MONITO.x);
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
  for (const m of html.matchAll(/<(?:g|ellipse)\b([^>]*\bdata-parte="([^"]+)"[^>]*)>/g)) {
    const atributos = new Map([...m[1]!.matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1]!, a[2]!] as const));
    partes.push({
      dataset: { parte: m[2]!, ...(atributos.has('data-pivote') ? { pivote: atributos.get('data-pivote')! } : {}) },
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
  const marco = { querySelector: (sel: string) => (sel === '.titere--monito' ? titere : null) };
  const foto = (): Record<string, string> => Object.fromEntries(partes.map((p) => [p.dataset.parte!, p.getAttribute(p.dataset.parte === 'mueca' ? 'opacity' : 'transform') ?? '']));
  return { marco: marco as unknown as SVGGElement, partes, oyentes, foto };
}

/** Un azar con semilla, para que la prueba sea siempre la misma. */
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
  return {
    esc: { hablar: (id: string, x: number, y: number) => void dichos.push([id, x, y]), quieto: () => quieto, reloj: () => reloj },
    dichos,
    poner: (t: number) => void (reloj = t),
  };
}

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = domDeJuguete(marcado);
    const antes = dom.foto();
    const { esc } = escenario(quieto);
    const vivo = armarMonitoCon([dom.marco], esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes, quieto ? 'con movimiento reducido no queda como sin JavaScript' : 'al armarse se mueve');
  }
});

test('vive: se acomoda, trepa hasta arriba, te mira con los dientes pelados y baja a taparse', () => {
  const dom = domDeJuguete(marcado);
  const { esc, poner } = escenario(false);
  const vivo = armarMonitoCon([dom.marco], esc, azar(11));
  const vistos = new Set<string>();
  let mueca = 0;
  let maximo = 0;
  for (let i = 1; i <= 60 * 90; i++) {
    const t = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const e = vivo.estado();
    vistos.add(e.modo);
    maximo = Math.max(maximo, e.subido);
    assert.ok(e.subido >= 0 && e.subido <= TRAMO + 1e-9, 'trepa más de lo que hay');
    if (e.modo === 'arriba') mueca = Math.max(mueca, Number(dom.partes.find((p) => p.dataset.parte === 'mueca')!.getAttribute('opacity')));
    for (const p of dom.partes) assert.doesNotMatch(p.getAttribute('transform') ?? p.getAttribute('opacity') ?? '', /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
  }
  for (const m of ['quieto', 'antojo', 'sube', 'baja']) assert.ok(vistos.has(m), `en un minuto y medio no hizo «${m}»`);
  assert.ok(vistos.has('arriba') || vistos.has('duda'), 'nunca se paró a mirarte');
  assert.ok(maximo > 0, 'no trepó');
  if (vistos.has('arriba')) assert.ok(mueca > 0.9, 'arriba no pela los dientes');
});

test('tocado, trepa hasta arriba de una y dice su verso; con movimiento reducido cambia de pose quieta', () => {
  const dom = domDeJuguete(marcado);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarMonitoCon([dom.marco], esc, azar(3));
  dom.oyentes.get('click')!({});
  assert.deepEqual(dichos[0], ['el-monito-que-trepa', VERSO[0], VERSO[1]]);
  let llego = Number.POSITIVE_INFINITY;
  for (let i = 1; i <= 60 * 10; i++) {
    poner(i / 60);
    vivo.mover(i / 60, 1 / 60);
    if (vivo.estado().subido >= TRAMO && llego === Number.POSITIVE_INFINITY) llego = i / 60;
  }
  assert.ok(llego < TRAMO / MONITO.sube + 2, `tardó ${llego.toFixed(1)} s en llegar arriba`);
  assert.equal(vivo.reaccionar('otro-bicho', 0), false);

  // Con movimiento reducido: tocarlo lo pasa a la pose de arriba, quieta, y no se mueve solo.
  const q = domDeJuguete(marcado);
  const quieto = escenario(true);
  const vivoQuieto = armarMonitoCon([q.marco], quieto.esc, azar(3));
  const abajo = q.foto();
  q.oyentes.get('click')!({});
  const arriba = q.foto();
  assert.notDeepEqual(arriba, abajo, 'tocado con movimiento reducido no cambia de pose');
  assert.equal(quieto.dichos.length, 1);
  vivoQuieto.mover(5, 0);
  assert.deepEqual(q.foto(), arriba, 'con movimiento reducido se movió solo');
  const entero = (f: Record<string, string>): number => Number(/translate\([\d.]+ ([\d.]+)\)/.exec(f.entero!)![1]);
  assert.ok(entero(arriba) < entero(abajo) - TRAMO + 1, 'la pose de arriba no está arriba');
});

test('la ficha: el retrato es el títere arriba de todo, sobre su pedazo de tronco, y la estampa dice qué es del dibujo', () => {
  const r = retratoDe('el-monito-que-trepa')!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/arbol-piso.webp') && svg.includes('/bestiario/monito-culo.webp'));
  // Entra entero en la caja: la cadera arriba, los puños y los pies.
  const [x0, y0, w, h] = r.caja;
  const p = pose(TRAMO);
  for (const m of MIEMBROS) {
    const [x, y] = alRecinto(p.miembros[m.nombre].punta, p.cadera);
    assert.ok(x > x0 + 4 && x < x0 + w - 4 && y > y0 + 4 && y < y0 + h - 4, `${m.nombre} se sale del retrato`);
  }
  assert.ok(alRecinto([1, -130], p.cadera)[1] > y0 + 2, 'la cabeza se sale del retrato');
  const b = datos.bestias.find((x) => x.id === 'el-monito-que-trepa')!;
  assert.match(b.estampa, /busto/);
  assert.match(b.estampa, /dibujo/);
  for (const c of b.cuenta ?? []) assert.match(c.fuente, /^RES-\d+$/);
});

test('la isla del monito se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/monito.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco/.test(r)), []);
  // Y la cuenta del rig no dibuja: la pose sale de los mismos números en las dos puntas.
  assert.ok(Math.abs(alTitere(alRecinto([10, -20], [450, 400]), [450, 400])[0] - 10) < 1e-9);
});
