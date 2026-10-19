import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { CAJA_FRENTE, PIEZAS_PIBE, RETRATO, STRATO } from './arte-pibe.ts';
import {
  ADENTRO_CAJA, AGARRE_CAJA, ALZADA, CAJA, CAJA_ARRIBA, CENIZA, LUGAR, PARADO, PIBE_ARMADO, QUIETA, RANA, VERSO, alRecinto, alTitere,
  caderaEn, cajaEnSuLugar, enLaCabeza, enLaCaja, manoQuieta, pose, puchoEn, rotar, type Momento, type Punto,
} from './rig-pibe.ts';
import { ASTILLERO, COSAS_DE_LOS_ASTILLEROS, OJOS_DE_LOS_ASTILLEROS } from './rig-entornos.ts';
import { DURA, armarPibeCon, cenizaTras, grito, rapina } from '../../scripts/bestiario/pibe.ts';

/**
 * El pibe de los astilleros (`D-73`, decimoquinta vuelta): que sea un títere entero, que esté sentado
 * de verdad en el canto de la pila y parado de verdad arriba del container, que la mano llegue adonde
 * va (la caja, el pucho, los cantos de la caja en alto), que no le tape la cara a nadie, que la ceniza
 * no se caiga nunca, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; cuenta?: Array<{ rotulo: string; fuente?: string; quien?: string }> }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const marcado = capasDe('los-astilleros', 'figura', nombres);
const A = PIBE_ARMADO;
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_PIBE.find((p) => p.nombre === nombre)!.caja;
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
const lejos = (a: Punto, b: Punto): number => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Los momentos que el pibe recorre: sentado, en cada paso de la rapiña y del grito. */
const momentos: Momento[] = [
  QUIETA,
  ALZADA,
  ...Array.from({ length: 30 }, (_, i) => {
    const r = rapina((DURA.rapina * i) / 29, cajaEnSuLugar(caderaEn(0)));
    return { ...QUIETA, inclina: r.inclina, manos: [r.mano, null] as const, botin: r.botin };
  }),
  ...Array.from({ length: 30 }, (_, i) => {
    const g = grito((DURA.grito * i) / 29, (k) => cajaEnSuLugar(caderaEn(k)));
    return { ...QUIETA, parado: g.parado, caja: g.caja, manos: g.manos ?? ([null, null] as const), grito: g.grito };
  }),
];

/** Los puntos del cuerpo y de la caja de un momento, en el recinto. */
function puntos(m: Momento): Punto[] {
  const p = pose(m);
  const out: Punto[] = [p.cadera, alRecinto(p.cuello, p.cadera), ...[[-2, -78], [16.4, -56], [-14, -62]].map((q) => alRecinto(enLaCabeza(q as unknown as Punto, m), p.cadera))];
  for (const n of [0, 1] as const) {
    out.push(alRecinto(p.hombros[n], p.cadera), alRecinto(p.brazos[n].punta, p.cadera), alRecinto(p.piernas[n].rodilla, p.cadera), alRecinto(p.piernas[n].suela, p.cadera));
  }
  for (const q of [[-CAJA.ancho / 2 - 10, -CAJA.alto - 11], [CAJA.ancho / 2 + 9, -CAJA.alto - 11], [0, 0]] as const) out.push(alRecinto(enLaCaja(q, p.caja), p.cadera));
  return out;
}

test('el pibe es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(marcado, /<g class="titere titere--pibe" data-id="el-pibe-de-los-astilleros" role="button" tabindex="0" aria-label="El pibe de los astilleros">/);
  const partes = ['entero', 'guitarra', 'pierna-1', 'pierna-2', 'muslo-1', 'muslo-2', 'torso', 'cabeza', 'pupila-1', 'pupila-2', 'parpado-1', 'parpado-2',
    'grito', 'pucho', 'ceniza', 'brasa', 'resplandor', 'brazo-1', 'mano-1', 'brazo-2', 'mano-2', 'botin', 'caja', 'humo'];
  for (const p of partes) assert.ok(marcado.includes(`data-parte="${p}"`), `al pibe le falta ${p}`);
  const imagenes = [...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!);
  assert.deepEqual([...imagenes].sort(), PIEZAS_PIBE.map((p) => p.nombre).sort(), 'usa piezas que no se imprimen, o le sobra una');
  assert.ok(PIEZAS_PIBE.length >= 5 && PIEZAS_PIBE.length <= 14, `${PIEZAS_PIBE.length} piezas`);
  for (const n of [1, 2] as const) {
    const h = A.hombros[n - 1];
    const codo: Punto = [h[0], h[1] + A.largos.brazo];
    const mano: Punto = [h[0], codo[1] + A.largos.antebrazo];
    const c = A.caderas[n - 1];
    const rodilla: Punto = [c[0], c[1] + A.largos.muslo];
    const suela: Punto = [c[0], rodilla[1] + A.largos.pierna];
    assert.ok(adentro('pibe-torso', h) && adentro(`pibe-brazo-${n}`, h), `el hombro ${n} no está en el hombro`);
    assert.ok(adentro(`pibe-brazo-${n}`, codo) && adentro(`pibe-antebrazo-${n}`, codo), `el codo ${n} no une las dos mitades`);
    assert.ok(adentro(`pibe-antebrazo-${n}`, mano), `la mano ${n} no está en su antebrazo`);
    assert.ok(adentro('pibe-torso', c) && adentro(`pibe-muslo-${n}`, c), `la cadera ${n} no está en la cadera`);
    assert.ok(adentro(`pibe-muslo-${n}`, rodilla) && adentro(`pibe-pierna-${n}`, rodilla), `la rodilla ${n} no une las dos mitades`);
    assert.ok(adentro(`pibe-pierna-${n}`, [suela[0], suela[1] - 0.5]), `la suela ${n} se sale de la pierna`);
  }
  assert.ok(adentro('pibe-torso', A.cuello) && adentro('pibe-cabeza', A.cuello), 'la cabeza gira en el aire');
  assert.ok(adentro('pibe-torso', A.correa) && adentro('pibe-guitarra', A.correa), 'la strato no cuelga de la correa');
  assert.ok(adentro('pibe-guitarra', STRATO.centro), 'el cuerpo de la strato se salió de su pieza');
  assert.ok(adentro('pibe-cabeza', A.labio) && adentro('pibe-cabeza', A.boca), 'el pucho cuelga del aire');
  assert.ok(adentro('pibe-torso', A.bolsillo), 'el bolsillo no está en el buzo');
  for (const o of A.ojos) assert.ok(adentro('pibe-cabeza', o.centro), 'un ojo se salió de la cara');
  for (const m of marcado.matchAll(/data-parte="parpado-\d"[^>]*>/g)) assert.match(m[0], /data-pivote="-?[\d.]+ -?[\d.]+"/);
  // Ni un hex: las tintas son tokens de su bloque.
  for (const p of PIEZAS_PIBE) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  // Pesa lo que pide el brief: entre 80 y 250 kB todas juntas.
  const peso = PIEZAS_PIBE.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 80 && peso <= 250, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del pibe están en su bloque de tokens.css, y nada más las usa él', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el pibe de los astilleros⟩'), tokens.indexOf('⟨/el pibe de los astilleros⟩'));
  const usadas = new Set(PIEZAS_PIBE.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-pibe-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 8);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del pibe, o no dice de dónde salió`);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el pibe de los astilleros⟩ */'), sitio.indexOf('/* ⟨/el pibe de los astilleros⟩ */'));
  for (const clase of new Set([...marcado.matchAll(/class="(bt-pibe-[a-z]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase} {`), `${clase} no está en su bloque de sitio.css`);
});

test('sentado en el canto de la pila: las manos apoyadas, las rodillas afuera y las zapatillas colgando', () => {
  const p = pose(QUIETA);
  const { piso } = LUGAR;
  assert.equal(p.cadera[1], piso - LUGAR.sentado, 'no está sentado en el canto');
  for (const n of [0, 1] as const) {
    const mano = alRecinto(p.brazos[n].punta, p.cadera);
    assert.ok(lejos(mano, alRecinto(manoQuieta(n), p.cadera)) < 0.6, `la mano ${n + 1} no llega al canto`);
    assert.ok(Math.abs(mano[1] - piso) < 1, `la mano ${n + 1} no se apoya en el canto`);
    const rodilla = alRecinto(p.piernas[n].rodilla, p.cadera);
    const suela = alRecinto(p.piernas[n].suela, p.cadera);
    assert.ok(rodilla[1] > piso - 1 && rodilla[1] < piso + 6, `la rodilla ${n + 1} no está en el canto`);
    // Las zapatillas cuelgan delante del container de arriba, sin llegar al de abajo.
    const altoFila = (ASTILLERO.pila.piso - ASTILLERO.pila.arriba) / 4;
    assert.ok(suela[1] > piso + 10 && suela[1] < piso + altoFila, `la zapatilla ${n + 1} no cuelga (${suela[1].toFixed(0)})`);
  }
  // Las rodillas abiertas y los pies juntos: así se sienta uno en el canto, y así se lee de frente.
  const [r1, r2] = p.piernas.map((q) => q.rodilla);
  const [s1, s2] = p.piernas.map((q) => q.suela);
  assert.ok(r2![0] - r1![0] > s2![0] - s1![0] + 8, 'las rodillas no se abren más que los pies');
});

test('parado, pisa el container; y la caja en alto queda arriba de la cabeza, con las dos manos en sus cantos', () => {
  const p = pose(ALZADA);
  assert.ok(Math.abs(p.cadera[1] - (LUGAR.piso - PARADO)) < 1e-9);
  for (const n of [0, 1] as const) {
    const suela = alRecinto(p.piernas[n].suela, p.cadera);
    assert.ok(Math.abs(suela[1] - LUGAR.piso) < 1.2, `la zapatilla ${n + 1} no pisa el container (${suela[1].toFixed(1)})`);
    const meta = enLaCaja(AGARRE_CAJA[n], CAJA_ARRIBA);
    assert.ok(lejos(p.brazos[n].punta, meta) < 0.6, `la mano ${n + 1} no llega al canto de la caja`);
  }
  // La caja va arriba de la coronilla, con la cabeza echada para atrás.
  const fondoDeLaCaja = enLaCaja([0, 0], CAJA_ARRIBA)[1];
  const coronilla = Math.min(...[-2, 2, 6, 10].map((x) => enLaCabeza([x, -77], ALZADA)[1]));
  assert.ok(fondoDeLaCaja < coronilla, `la caja le pisa la cabeza (${fondoDeLaCaja.toFixed(1)} y ${coronilla.toFixed(1)})`);
  assert.equal(ALZADA.grito, 1);
});

test('la rapiña: la mano entra en la caja por detrás del frente, saca el pedal afuera y lo guarda en el canguro', () => {
  const lugar = cajaEnSuLugar(caderaEn(0));
  // Adentro de la caja, detrás del frente: la tapa el cartón.
  assert.ok(enPoligono(CAJA_FRENTE, ADENTRO_CAJA) && ADENTRO_CAJA[1] > -CAJA.alto, 'la mano no entra en la caja');
  let entro = false;
  let vioElBotin = false;
  for (let i = 0; i <= 200; i++) {
    const u = (DURA.rapina * i) / 200;
    const r = rapina(u, lugar);
    const m: Momento = { ...QUIETA, inclina: r.inclina, manos: [r.mano, null] };
    const p = pose(m);
    if (r.mano) assert.ok(lejos(p.brazos[0].punta, r.mano) < 0.6, `a ${u.toFixed(2)} s la mano no llega (le falta ${lejos(p.brazos[0].punta, r.mano).toFixed(1)})`);
    const enCaja: Punto = (() => {
      const [x, y] = p.brazos[0].punta;
      const [dx, dy] = [x - lugar.x, y - lugar.y];
      return [dx, dy];
    })();
    const tapada = enPoligono(CAJA_FRENTE, enCaja);
    if (tapada) entro = true;
    // Lo que sacó se ve solo afuera de la caja.
    if (r.botin > 0) {
      vioElBotin = true;
      assert.ok(!tapada, `a ${u.toFixed(2)} s el pedal se ve adentro de la caja`);
    }
  }
  assert.ok(entro && vioElBotin, 'no rapiñó nada');
  assert.equal(rapina(DURA.rapina, lugar).mano, null, 'la mano no vuelve al canto');
  assert.equal(rapina(DURA.rapina, lugar).botin, 0, 'no se guardó el pedal');
});

test('la ceniza no se cae nunca: crece con cada pitada hasta su largo, y ahí se queda', () => {
  let antes = 0;
  for (let n = 0; n < 40; n++) {
    const c = cenizaTras(n);
    assert.ok(c >= antes && c <= CENIZA.maxima, `después de ${n} pitadas la ceniza mide ${c}`);
    antes = c;
  }
  assert.equal(cenizaTras(0), QUIETA.ceniza);
  assert.equal(cenizaTras(1000), CENIZA.maxima);
});

test('se mueve adentro de la escena y de su container, y no le tapa la cara a nadie de los astilleros', () => {
  const otros: Punto[] = [
    ...Object.entries(OJOS_DE_LOS_ASTILLEROS).filter(([id]) => id !== 'el-pibe-de-los-astilleros').map(([, [x, y]]) => [x, y] as Punto),
    ...Object.values(COSAS_DE_LOS_ASTILLEROS).map(([x, y]) => [x, y] as Punto),
  ];
  // El container de arriba de la pila (`astilleroPiso`): de él no se baja ni se cae.
  const [x0, x1] = [ASTILLERO.pila.x0 + 30, ASTILLERO.pila.x1 - 14];
  for (const m of momentos) {
    const ps = puntos(m);
    const xs = ps.map((q) => q[0]);
    const ys = ps.map((q) => q[1]);
    const [a, b, c, d] = [Math.min(...xs) - 6, Math.max(...xs) + 6, Math.min(...ys) - 6, Math.max(...ys) + 6];
    assert.ok(a > 0 && b < 900 && c > 0 && d < 640, 'se sale de la escena');
    assert.ok(a > x0 && b < x1, `se sale de su container: ${a.toFixed(0)} a ${b.toFixed(0)}`);
    for (const [ox, oy] of otros) assert.ok(!(ox > a - 8 && ox < b + 8 && oy > c - 8 && oy < d + 8), `le tapa los ojos a alguien en ${ox}, ${oy}`);
  }
  // La rana rubia queda a su derecha, en la misma pila, y la mira cuando quiere.
  assert.ok(RANA[0] > LUGAR.x + 60 && Math.abs(RANA[1] - LUGAR.piso) < 20);
  // El verso se dice abajo de él, sobre los containers.
  assert.ok(VERSO[1] > LUGAR.piso + 20 && VERSO[0] === LUGAR.x);
  // La caja está en el container, a su izquierda.
  assert.ok(CAJA.x < LUGAR.x && CAJA.x - 20 > x0);
  // Del recinto al títere y de vuelta, la misma cuenta.
  assert.ok(lejos(alTitere(alRecinto([10, -20], [450, 400]), [450, 400]), [10, -20]) < 1e-9);
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

const PARTE = /<(?:g|ellipse|circle)\b([^>]*\bdata-parte="([^"]+)"[^>]*)>/g;

function domDeJuguete(html: string) {
  const partes: Juguete[] = [];
  for (const m of html.matchAll(PARTE)) {
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
  const marco = { querySelector: (sel: string) => (sel === '.titere--pibe' ? titere : null) };
  const foto = (): Record<string, string> =>
    Object.fromEntries(partes.map((p) => [p.dataset.parte!, `${p.getAttribute('transform') ?? ''}|${p.getAttribute('opacity') ?? ''}`]));
  const de = (nombre: string, at: string): string => partes.find((p) => p.dataset.parte === nombre)!.getAttribute(at) ?? '';
  return { marco: marco as unknown as SVGGElement, partes, oyentes, foto, de };
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
    const vivo = armarPibeCon([dom.marco], esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes, quieto ? 'con movimiento reducido no queda como sin JavaScript' : 'al armarse se mueve');
  }
});

test('vive: fuma, larga humo, patea, vigila, rapiña la caja, y la ceniza no se le cae', () => {
  const dom = domDeJuguete(marcado);
  const { esc, poner } = escenario(false);
  const vivo = armarPibeCon([dom.marco], esc, azar(11));
  const vistos = new Set<string>();
  let ceniza = 0;
  let humo = 0;
  let botin = 0;
  let brasa = 0;
  const cabezas = new Set<string>();
  const piernas = new Set<string>();
  for (let i = 1; i <= 60 * 90; i++) {
    const t = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const e = vivo.estado();
    vistos.add(e.modo);
    assert.ok(e.ceniza >= ceniza, `a ${t.toFixed(1)} s se le cayó la ceniza`);
    ceniza = e.ceniza;
    humo = Math.max(humo, Number(dom.de('humo', 'opacity')));
    botin = Math.max(botin, Number(dom.de('botin', 'opacity')));
    brasa = Math.max(brasa, Number(dom.de('brasa', 'opacity')));
    if (i % 30 === 0) {
      cabezas.add(dom.de('cabeza', 'transform'));
      piernas.add(dom.de('pierna-1', 'transform'));
    }
    if (e.modo !== 'grito') assert.equal(e.grito, 0, 'grita sin que lo toquen');
    for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
  }
  for (const m of ['sentado', 'rapina']) assert.ok(vistos.has(m), `en un minuto y medio no hizo «${m}»`);
  assert.ok(!vistos.has('grito'), 'gritó sin que lo toquen');
  assert.ok(ceniza > QUIETA.ceniza, 'no fumó');
  assert.ok(brasa > 0.95, 'la brasa no se prende con la pitada');
  assert.ok(humo > 0.5, 'no larga humo');
  assert.ok(botin > 0.9, 'rapiñó y no sacó nada');
  assert.ok(cabezas.size > 20, 'no mira para ningún lado');
  assert.ok(piernas.size > 5, 'no patea el container');
});

test('tocado, se para con la caja en alto, grita, y dice su verso abajo; con movimiento reducido cambia de pose quieta', () => {
  const dom = domDeJuguete(marcado);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarPibeCon([dom.marco], esc, azar(3));
  poner(0.5);
  vivo.mover(0.5, 1 / 60);
  dom.oyentes.get('click')!({});
  assert.deepEqual(dichos[0], ['el-pibe-de-los-astilleros', VERSO[0], VERSO[1], true]);
  let parado = 0;
  let grita = 0;
  let cajaArriba = false;
  for (let i = 1; i <= 60 * 7; i++) {
    const t = 0.5 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const e = vivo.estado();
    parado = Math.max(parado, e.parado);
    grita = Math.max(grita, e.grito);
    const caja = /translate\((-?[\d.]+) (-?[\d.]+)\)/.exec(dom.de('caja', 'transform'))!;
    if (Number(caja[2]) < -80) cajaArriba = true;
  }
  assert.ok(parado > 0.99, 'no se paró');
  assert.ok(grita > 0.99, 'no gritó');
  assert.ok(cajaArriba, 'no alzó la caja');
  assert.equal(vivo.estado().modo, 'sentado', 'no se volvió a sentar');
  assert.equal(vivo.estado().parado, 0);
  assert.equal(vivo.reaccionar('otro-bicho', 0), false);
  assert.equal(vivo.reaccionar('el-pibe-de-los-astilleros', 9), true);

  // Con movimiento reducido: tocarlo lo pasa a la pose del grito, quieta, y no se mueve solo.
  const q = domDeJuguete(marcado);
  const quieto = escenario(true);
  const vivoQuieto = armarPibeCon([q.marco], quieto.esc, azar(3));
  const sentado = q.foto();
  q.oyentes.get('click')!({});
  const arriba = q.foto();
  assert.notDeepEqual(arriba, sentado, 'tocado con movimiento reducido no cambia de pose');
  assert.equal(quieto.dichos.length, 1);
  vivoQuieto.mover(5, 0);
  vivoQuieto.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), arriba, 'con movimiento reducido se movió solo');
  assert.equal(q.de('grito', 'opacity'), '1.00', 'la pose quieta del grito no grita');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), sentado, 'tocado otra vez no vuelve a sentarse');
});

test('el golpecito al pucho: la mano llega a la boca con el codo abajo, sin saludar', () => {
  const m: Momento = { ...QUIETA, manos: [null, [puchoEn(QUIETA)[0] + 4.6, puchoEn(QUIETA)[1] + 4.4]] };
  const p = pose(m);
  assert.ok(lejos(p.brazos[1].punta, m.manos[1]!) < 0.6, 'la mano no llega al pucho');
  // El codo baja, pegado al cuerpo: no saluda. Y la cuenta del escorzo es la misma que la del dibujo.
  const { codo, acorte } = p.brazos[1];
  assert.ok(codo[1] > A.hombros[1][1] + 6, `el codo queda a la altura del hombro (${codo[1].toFixed(1)})`);
  assert.ok(acorte < 0.95, 'el brazo de arriba no se acorta al ir a la cara');
  const dibujado = rotar([A.hombros[1][0], A.hombros[1][1] + A.largos.brazo * acorte], A.hombros[1], p.brazos[1].arriba);
  assert.ok(lejos(dibujado, codo) < 1e-6, 'el codo dibujado no es el de la cuenta');
  // Apoyado en el canto, el brazo es entero.
  assert.equal(pose(QUIETA).brazos[1].acorte, 1);
});

test('la ficha: el retrato es el grito, parado arriba de su pedazo de pila, y la estampa dice qué es del dibujo', () => {
  const r = retratoDe('el-pibe-de-los-astilleros')!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/astillero-piso.webp') && svg.includes('/bestiario/pibe-caja.webp'));
  const [x0, y0, w, h] = r.caja;
  for (const [x, y] of puntos(ALZADA)) assert.ok(x > x0 + 2 && x < x0 + w - 2 && y > y0 + 2 && y < y0 + h - 2, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  const b = datos.bestias.find((x) => x.id === 'el-pibe-de-los-astilleros')!;
  assert.match(b.estampa, /contratapa/);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /letra/);
  assert.ok(b.cuenta?.some((c) => c.rotulo === 'testimonio' && c.fuente === 'RES-21' && /p\. 303/.test(c.quien ?? '')), 'lo que contó el Indio no está como testimonio');
  for (const c of b.cuenta ?? []) assert.match(c.fuente ?? '', /^RES-\d+$/);
});

test('la isla del pibe se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/pibe.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco/.test(r)), []);
});
