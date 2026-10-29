import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { CABEZA, PIEZAS_CANIBAL, RETRATO, SERVILLETA, TORSO } from './arte-canibal.ts';
import {
  CANIBAL, CANIBAL_ARMADO as A, FILO, GESTOS, MANOS_AFILA, MANOS_QUIETAS, MOSCAS_QUIETAS, POSADAS, VERSO, alRecinto, brazos, codoDibujado,
  dondeVa, enLaCabeza, munecaDibujada, puntaDe, type Gesto, type Mano, type Punto,
} from './rig-canibal.ts';
import { COSAS_DE_LA_MESA, MESA, OJOS_DE_LA_MESA } from './rig-entornos.ts';
import { TIEMPOS, afilado, armarCanibalCon, golpe } from '../../scripts/bestiario/canibal.ts';

/**
 * El caníbal (`D-73`, decimoquinta vuelta): que sea un títere entero, que esté sentado detrás de la
 * mesa (lo de abajo lo tapa el canto del tablero; los codos, las manos y los cubiertos van arriba del
 * mantel), que mire la ventana, que las moscas se le posen a él, que afile el cuchillo contra el
 * tenedor de verdad, que no le tape la cara a nadie, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; cuenta?: Array<{ rotulo: string; fuente?: string; quien?: string }> }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const marcado = capasDe('la-mesa', 'figura', nombres, 1, 'el-canibal');
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_CANIBAL.find((p) => p.nombre === nombre)!.caja;
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
/** La distancia más corta entre dos segmentos (para ver si el cuchillo toca el tenedor). */
function entreSegmentos(a: Punto, b: Punto, c: Punto, d: Punto): number {
  const alPunto = (p: Punto, q: Punto, r: Punto): number => {
    const [dx, dy] = [r[0] - q[0], r[1] - q[1]];
    const k = Math.max(0, Math.min(1, ((p[0] - q[0]) * dx + (p[1] - q[1]) * dy) / (dx * dx + dy * dy || 1)));
    return Math.hypot(p[0] - q[0] - dx * k, p[1] - q[1] - dy * k);
  };
  const cruza = (p: Punto, q: Punto, r: Punto, s: Punto): boolean => {
    const o = (u: Punto, v: Punto, w: Punto): number => Math.sign((v[0] - u[0]) * (w[1] - u[1]) - (v[1] - u[1]) * (w[0] - u[0]));
    return o(p, q, r) !== o(p, q, s) && o(r, s, p) !== o(r, s, q);
  };
  if (cruza(a, b, c, d)) return 0;
  return Math.min(alPunto(a, c, d), alPunto(b, c, d), alPunto(c, a, b), alPunto(d, a, b));
}
/** La hoja de un cubierto: del tope del puño a la punta. */
const hoja = (m: Mano, n: 0 | 1): [Punto, Punto] => {
  const { puno, punta } = puntaDe(m, n);
  const [dx, dy] = [punta[0] - puno[0], punta[1] - puno[1]];
  const largo = Math.hypot(dx, dy);
  return [[puno[0] + (dx / largo) * 12, puno[1] + (dy / largo) * 12], punta];
};

test('el caníbal es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(marcado, /<g class="titere titere--canibal" data-id="el-canibal" role="button" tabindex="0" aria-label="El caníbal">/);
  const partes = ['entero', 'cabeza', 'torso', 'brazo-1', 'antebrazo-1', 'mano-1', 'brazo-2', 'antebrazo-2', 'mano-2', 'pupila-1', 'pupila-2', 'parpado-1', 'parpado-2', 'mueca', 'relame', 'lengua', 'mosca-1', 'mosca-2', 'mosca-3'];
  for (const p of partes) assert.ok(marcado.includes(`data-parte="${p}"`), `al caníbal le falta ${p}`);
  const imagenes = new Set([...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_CANIBAL.map((p) => p.nombre).sort(), 'usa piezas que no se imprimen, o le sobra una');
  assert.ok(PIEZAS_CANIBAL.length >= 5 && PIEZAS_CANIBAL.length <= 14, `${PIEZAS_CANIBAL.length} piezas`);
  for (const n of [0, 1] as const) {
    const [s, e, w] = [A.hombros[n], codoDibujado(n), munecaDibujada(n)];
    assert.ok(adentro('canibal-cuerpo', s) && adentro(`canibal-brazo-${n + 1}`, s), `el hombro ${n + 1} no está en el hombro`);
    assert.ok(adentro(`canibal-brazo-${n + 1}`, e) && adentro(`canibal-antebrazo-${n + 1}`, e), `el codo ${n + 1} no une las dos mitades`);
    assert.ok(adentro(`canibal-antebrazo-${n + 1}`, w) && adentro(`canibal-mano-${n + 1}`, w), `la muñeca ${n + 1} no une el antebrazo con la mano`);
    assert.ok(enPoligono(TORSO, s), `el hombro ${n + 1} se cuelga del aire`);
  }
  assert.ok(adentro('canibal-cuerpo', A.cuello) && adentro('canibal-cabeza', A.cuello), 'la cabeza gira en el aire');
  assert.ok(enPoligono(CABEZA, A.cuello) && enPoligono(TORSO, [A.cuello[0], A.cuello[1] + 3]), 'el cuello no une la cabeza con el saco');
  for (const o of A.ojos) assert.ok(enPoligono(CABEZA, o.centro), 'un ojo se salió de la cara');
  assert.ok(enPoligono(CABEZA, A.boca) && enPoligono(CABEZA, [A.nariz[0] - 2, A.nariz[1]]), 'la boca o la nariz se salieron de la cara');
  for (const m of marcado.matchAll(/data-parte="parpado-\d"[^>]*>/g)) assert.match(m[0], /data-pivote="-?[\d.]+ -?[\d.]+"/);
  // Ni un hex: las tintas son tokens.
  for (const p of PIEZAS_CANIBAL) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  // Pesa lo que tiene que pesar.
  const kb = PIEZAS_CANIBAL.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(kb >= 80 && kb <= 250, `las piezas pesan ${kb.toFixed(0)} kB`);
});

test('las tintas del caníbal están en su bloque de tokens.css, y su tinta de la página en el de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el canibal⟩'), tokens.indexOf('⟨/el canibal⟩'));
  const usadas = new Set(PIEZAS_CANIBAL.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-canibal-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 8, `usa ${usadas.size} tintas suyas`);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del caníbal, o no dice de dónde salió`);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el caníbal⟩ */'), sitio.indexOf('/* ⟨/el caníbal⟩ */'));
  const clases = new Set([...marcado.matchAll(/class="(bt-canibal-[a-z]+)"/g)].map((m) => m[1]!));
  assert.ok(clases.size >= 6);
  for (const clase of clases) assert.ok(suyo.includes(`.${clase} {`), `${clase} no está en su bloque de sitio.css`);
  for (const m of suyo.matchAll(/var\((--[a-z0-9-]+)\)/g)) assert.ok(tokens.includes(`${m[1]}:`), `${m[1]} no es un token`);
});

/** Los gestos que hace, para mirar dónde quedan las cosas en todos. */
const GESTOS_DE_LA_VIDA: Gesto[] = [
  GESTOS.ventana,
  GESTOS.afila,
  ...[0.3, 0.6, 0.9, 1.2].map((u): Gesto => ({ ...GESTOS.ventana, manos: [MANOS_QUIETAS[0], { muneca: [MANOS_QUIETAS[1].muneca[0], MANOS_QUIETAS[1].muneca[1] + golpe(0.5 + u)], giro: MANOS_QUIETAS[1].giro }] })),
  ...[0.2, 0.6, 1.0, 1.6, 2.2, 2.6, 3.1].map((u): Gesto => {
    const a = afilado(u);
    const k = a.manos;
    const manos = [0, 1].map((i) => ({
      muneca: [MANOS_QUIETAS[i]!.muneca[0] + (MANOS_AFILA[i]!.muneca[0] - MANOS_QUIETAS[i]!.muneca[0]) * k, MANOS_QUIETAS[i]!.muneca[1] + (MANOS_AFILA[i]!.muneca[1] - MANOS_QUIETAS[i]!.muneca[1]) * k],
      giro: MANOS_QUIETAS[i]!.giro + (MANOS_AFILA[i]!.giro - MANOS_QUIETAS[i]!.giro) * k,
    })) as unknown as [Mano, Mano];
    return { ...GESTOS.ventana, cabeza: -12 * a.huele, respira: 0.032 * a.huele, mueca: a.sonrie, manos };
  }),
];

test('está sentado detrás de la mesa: el saco termina en el canto del tablero y los codos se apoyan en el mantel', () => {
  const { atras, izq, der } = MESA.tablero;
  // El saco y la servilleta se cortan derechos en el canto: nada de ellos baja al mantel.
  const fondo = (pts: readonly Punto[]): number => Math.max(...pts.map((p) => p[1]));
  assert.ok(fondo(TORSO) >= 0 && fondo(TORSO) <= 1, 'el saco no termina en el canto de la mesa');
  assert.ok(fondo(SERVILLETA) >= 0 && fondo(SERVILLETA) <= 1, 'la servilleta no termina en el canto de la mesa');
  for (const p of TORSO.filter((q) => q[1] >= 0)) {
    const [x, y] = alRecinto(p);
    assert.ok(Math.abs(y - atras) < 1 && x >= izq && x <= der, `el saco se pasa de la mesa en ${x.toFixed(1)}`);
  }
  // Los codos, en todos los gestos, sobre el mantel: un poco más acá del canto y adentro del tablero.
  for (const g of GESTOS_DE_LA_VIDA) {
    for (const [n, b] of brazos(g.manos, g.respira).entries()) {
      const [x, y] = alRecinto(b.codo);
      const borde = izq - ((y - atras) * 30) / (MESA.tablero.adelante - atras);
      assert.ok(y >= atras && y <= atras + 12, `el codo ${n + 1} no se apoya en el mantel (${y.toFixed(1)})`);
      assert.ok(x >= borde + 1 && x <= der, `el codo ${n + 1} se cae de la mesa (${x.toFixed(1)})`);
      // La cuenta del brazo llega adonde la mandan.
      const m = g.manos[n]!;
      assert.ok(Math.hypot(b.muneca[0] - m.muneca[0], b.muneca[1] - (m.muneca[1] - b.alza)) < 0.6, `la mano ${n + 1} no llega a su lugar`);
    }
  }
  // El plato que le sirvió la mesa es el suyo: el del lugar donde se sienta.
  assert.equal(CANIBAL.x, OJOS_DE_LA_MESA['el-canibal']![0]);
  assert.equal(CANIBAL.mesa, atras);
});

test('mira por la ventana para el lado de la pastura', () => {
  const g = GESTOS.ventana;
  const ojo = alRecinto(enLaCabeza(A.ojos[0].centro, g));
  const [vx, vy] = [(MESA.ventana.x0 + MESA.ventana.x1) / 2 - ojo[0], (MESA.ventana.arriba + MESA.ventana.abajo) / 2 - ojo[1]];
  // Las pupilas se corren para el lado de la ventana, y la cabeza se levanta hacia allá.
  const coseno = (g.mira[0] * vx + g.mira[1] * vy) / (Math.hypot(...g.mira) * Math.hypot(vx, vy));
  assert.ok(coseno > 0.8, `no mira la ventana (coseno ${coseno.toFixed(2)})`);
  assert.ok(g.cabeza < 0, 'no levanta la cabeza hacia la ventana');
  assert.ok(g.parpados[0] > 0.2 && g.parpados[0] < 0.6, 'los párpados no van a media asta');
});

test('las moscas lo prefieren a él: se le posan en la pelada, en la salsa de la servilleta y en la oreja', () => {
  for (const p of POSADAS) {
    if (p.en === 'cabeza') assert.ok(enPoligono(CABEZA, p.punto), `una mosca se posa fuera de la cabeza (${p.punto})`);
    if (p.en === 'pecho') assert.ok(enPoligono(SERVILLETA, p.punto), `una mosca se posa fuera de la servilleta (${p.punto})`);
  }
  assert.deepEqual(MOSCAS_QUIETAS[0]!.punto, A.pelada);
  assert.deepEqual(MOSCAS_QUIETAS[1]!.punto, A.mancha);
  assert.equal(MOSCAS_QUIETAS[2]!.en, 'aire');
  // La mancha de salsa está en la servilleta, que es donde se para la mosca.
  assert.ok(enPoligono(SERVILLETA, A.mancha));
});

test('afila el cuchillo contra el tenedor: la hoja cruza los dientes, y en la pose quieta no se tocan', () => {
  const lejos = entreSegmentos(...hoja(MANOS_QUIETAS[0], 0), ...hoja(MANOS_QUIETAS[1], 1));
  assert.ok(lejos > 40, 'quieto, el cuchillo y el tenedor se tocan');
  let toca = 0;
  for (let u = 1.4; u < 2.95; u += 0.05) {
    const a = afilado(u);
    const cuchillo: Mano = { muneca: [MANOS_AFILA[0].muneca[0] + FILO[0] * 7 * a.pasada, MANOS_AFILA[0].muneca[1] + FILO[1] * 7 * a.pasada], giro: MANOS_AFILA[0].giro };
    if (entreSegmentos(...hoja(cuchillo, 0), ...hoja(MANOS_AFILA[1], 1)) < 1.5) toca++;
  }
  assert.ok(toca > 20, `afilando, el cuchillo toca el tenedor en ${toca} cuadros`);
  // Y la sonrisa de la contratapa está puesta mientras afila.
  assert.equal(afilado(2).sonrie, 1);
  assert.equal(afilado(0).sonrie, 0);
});

test('se queda en su cabecera y no le tapa la cara a nadie de la mesa', () => {
  const otros: Punto[] = [
    ...Object.entries(OJOS_DE_LA_MESA).filter(([id]) => id !== 'el-canibal').map(([, [x, y]]) => [x, y] as Punto),
    ...Object.values(COSAS_DE_LA_MESA).map(([x, y]) => [x, y] as Punto),
  ];
  for (const g of GESTOS_DE_LA_VIDA) {
    const puntos: Punto[] = [
      ...CABEZA.map((p) => alRecinto(enLaCabeza(p, g))),
      ...TORSO.map((p) => alRecinto(p)),
      alRecinto([-72, -175]), alRecinto([72, -175]),
    ];
    for (const [n, b] of brazos(g.manos, g.respira).entries()) {
      const { puno, punta } = puntaDe(g.manos[n]!, n as 0 | 1);
      puntos.push(alRecinto(b.codo), alRecinto(puno), alRecinto(punta));
    }
    // Las moscas: posadas, y dando vueltas alrededor de la cabeza (34 × 20 de la cuenta de la isla).
    for (const p of POSADAS) puntos.push(alRecinto(dondeVa(p, g)));
    const [ox, oy] = enLaCabeza([10, -106], g);
    puntos.push(alRecinto([ox - 36, oy - 28]), alRecinto([ox + 36, oy + 16]));
    const xs = puntos.map((q) => q[0]);
    const ys = puntos.map((q) => q[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    assert.ok(x0 > 0 && x1 < 900 && y0 > 0 && y1 < 640, 'se sale de la escena');
    for (const [qx, qy] of otros) assert.ok(!(qx > x0 - 12 && qx < x1 + 12 && qy > y0 - 12 && qy < y1 + 12), `le tapa los ojos a alguien en ${qx}, ${qy}`);
    // No se mete en los recortes de la pared: la silla y la pelada quedan debajo de las columnas.
    assert.ok(y0 > 236, `se mete en el recorte de las columnas (${y0.toFixed(0)})`);
  }
  // El verso se dice arriba de la pelada, no encima de la cara.
  const pelada = alRecinto(enLaCabeza(A.pelada, GESTOS.ventana));
  assert.ok(VERSO[1] < pelada[1] - 20 && Math.abs(VERSO[0] - pelada[0]) < 20);
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
  const marco = { querySelector: (sel: string) => (sel === '.titere--canibal' ? titere : null) };
  const leer = (p: Juguete): string => p.getAttribute(p.dataset.parte === 'mueca' || p.dataset.parte === 'relame' ? 'opacity' : 'transform') ?? '';
  const foto = (): Record<string, string> => Object.fromEntries(partes.map((p) => [p.dataset.parte!, leer(p)]));
  const parte = (nombre: string): Juguete => partes.find((p) => p.dataset.parte === nombre)!;
  return { marco: marco as unknown as SVGGElement, partes, oyentes, foto, parte };
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

const moscaEnElRecinto = (transform: string): Punto => {
  const [, x, y] = /translate\((-?[\d.]+) (-?[\d.]+)\)/.exec(transform)!;
  return alRecinto([Number(x), Number(y)]);
};

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = domDeJuguete(marcado);
    const antes = dom.foto();
    const { esc } = escenario(quieto);
    const vivo = armarCanibalCon([dom.marco], esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes, quieto ? 'con movimiento reducido no queda como sin JavaScript' : 'al armarse se mueve');
  }
});

test('vive: olfatea, se relame, golpea la mesa con el tenedor, y las moscas se le posan y le dan vueltas', () => {
  const dom = domDeJuguete(marcado);
  const { esc, poner } = escenario(false);
  const vivo = armarCanibalCon([dom.marco], esc, azar(11));
  const vistos = new Set<string>();
  const vuelos = new Set<string>();
  let lengua = 0;
  for (let i = 1; i <= 60 * 90; i++) {
    const t = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const e = vivo.estado();
    vistos.add(e.modo);
    for (const [k, m] of e.moscas.entries()) vuelos.add(`${k}-${m.modo}`);
    if (e.modo === 'relame') lengua = Math.max(lengua, Number(dom.parte('relame').getAttribute('opacity')));
    for (const p of dom.partes) assert.doesNotMatch(p.getAttribute('transform') ?? p.getAttribute('opacity') ?? '', /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
    // Las moscas no se le van a la cara de los vecinos.
    for (const n of [1, 2, 3]) assert.ok(moscaEnElRecinto(dom.parte(`mosca-${n}`).getAttribute('transform')!)[0] < 150, `la mosca ${n} se fue de él`);
  }
  for (const m of ['mira', 'olfatea', 'relame', 'tamborilea']) assert.ok(vistos.has(m), `en un minuto y medio no hizo «${m}»`);
  assert.ok(lengua > 0.9, 'no se relamió');
  for (const k of [0, 1, 2]) assert.ok(vuelos.has(`${k}-posada`) && vuelos.has(`${k}-orbita`), `la mosca ${k + 1} no se posó y voló`);
});

test('tocado, olfatea, te pela los dientes y afila; con movimiento reducido cambia de pose quieta', () => {
  const dom = domDeJuguete(marcado);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarCanibalCon([dom.marco], esc, azar(3));
  dom.oyentes.get('click')!({});
  assert.deepEqual(dichos[0], ['el-canibal', VERSO[0], VERSO[1]]);
  assert.equal(vivo.estado().modo, 'afila');
  let sonrisa = 0;
  let volaron = false;
  for (let i = 1; i <= 60 * 5; i++) {
    poner(i / 60);
    vivo.mover(i / 60, 1 / 60);
    sonrisa = Math.max(sonrisa, Number(dom.parte('mueca').getAttribute('opacity')));
    if (i / 60 < 0.5 && vivo.estado().moscas.every((m) => m.modo === 'orbita')) volaron = true;
  }
  assert.ok(sonrisa > 0.95, 'afilando no pela los dientes');
  assert.ok(volaron, 'cuando olfatea fuerte las moscas no se le vuelan');
  assert.equal(vivo.estado().modo, 'mira', 'no vuelve a mirar la ventana');
  assert.ok(TIEMPOS.afila < 5);
  assert.equal(vivo.reaccionar('otro-bicho', 0), false);
  assert.equal(vivo.reaccionar('el-canibal', 6), true);

  // Con movimiento reducido: tocarlo lo pasa a la pose de afilar, quieta, y no se mueve solo.
  const q = domDeJuguete(marcado);
  const quieto = escenario(true);
  const vivoQuieto = armarCanibalCon([q.marco], quieto.esc, azar(3));
  const ventana = q.foto();
  q.oyentes.get('click')!({});
  const afila = q.foto();
  assert.notDeepEqual(afila, ventana, 'tocado con movimiento reducido no cambia de pose');
  assert.equal(afila.mueca, '1.00', 'la pose quieta de afilar no sonríe');
  assert.equal(quieto.dichos.length, 1);
  vivoQuieto.mover(5, 0);
  assert.deepEqual(q.foto(), afila, 'con movimiento reducido se movió solo');
  q.oyentes.get('click')!({});
  assert.deepEqual(q.foto(), ventana, 'tocado otra vez no vuelve a mirar la ventana');
});

test('la ficha: el retrato es el títere en su cabecera, y la estampa dice qué es del dibujo y qué de la letra', () => {
  const r = retratoDe('el-canibal')!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/mesa-piso.webp') && svg.includes('/bestiario/canibal-cabeza.webp'));
  // Entra entero en la caja: la silla, la pelada, los codos y las puntas de los cubiertos.
  const [x0, y0, w, h] = r.caja;
  const g = GESTOS.ventana;
  const puntos: Punto[] = [alRecinto([-72, -175]), alRecinto([72, -175]), alRecinto(enLaCabeza(A.pelada, g))];
  for (const [n, b] of brazos(g.manos).entries()) puntos.push(alRecinto(b.codo), alRecinto(puntaDe(g.manos[n]!, n as 0 | 1).punta));
  for (const [x, y] of puntos) assert.ok(x > x0 + 2 && x < x0 + w - 2 && y > y0 + 2 && y < y0 + h - 2, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  const b = datos.bestias.find((x) => x.id === 'el-canibal')!;
  assert.match(b.estampa, /letra/);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /pastura/);
  assert.ok(b.cuenta && b.cuenta.length > 0);
  for (const c of b.cuenta) {
    assert.match(c.fuente ?? '', /^RES-\d+$/);
    if (c.rotulo === 'testimonio') assert.ok(c.quien);
  }
});

test('la isla del caníbal se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/canibal.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco/.test(r)), []);
});
