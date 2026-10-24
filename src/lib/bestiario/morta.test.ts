import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { CABEZA, PESCUEZO, PIEZAS_MORTA, QUIJADA, RETRATO, TOALLON, TORSO } from './arte-morta.ts';
import {
  CABEZA_LOCAL as CL, CHORRO, MANCHA, MORTA, MORTA_ARMADO as A, POSES, QUIJADA_ABRE, VERSO, alRecinto, brazos, cabezaEnTitere, delPescuezo, delTorso, enElChorro,
  escorado, girado, goteraEn, type Pose, type Punto,
} from './rig-morta.ts';
import { MOMO } from './rig.ts';
import { ARMADO } from './recortes.ts';
import { VECINOS_DEL_TEMPLO } from './escenas.ts';
import { ESCORA, TIEMPOS, armarMortaCon, relincho } from '../../scripts/bestiario/morta.ts';

/**
 * El Morta (`D-73`, decimoquinta vuelta): que sea un títere entero, que pise el piso del templo, que gotee
 * en su mancha, que no le tape la cara a nadie ni se meta en el medallón, que la pose de la isla sea la
 * del HTML, y que tocado relinche de más: la boca abierta, el chorro de aceite, el brinco y la caída a
 * estribor.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as {
  bestias: Array<{ id: string; nombre: string; estampa: string; verso: string[]; cuenta?: Array<{ rotulo: string; texto: string; fuente?: string; quien?: string }> }>;
};
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const figura = capasDe('el-templo', 'figura', nombres, 1, 'el-morta');
const atras = capasDe('el-templo', 'atras', nombres, 1, 'el-morta');
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_MORTA.find((p) => p.nombre === nombre)!.caja;
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
/** La cáscara convexa de unos puntos (cadena monótona). */
function cascara(pts: readonly Punto[]): Punto[] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cruz = (o: Punto, a: Punto, b: Punto): number => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const abajo: Punto[] = [];
  for (const q of p) {
    while (abajo.length >= 2 && cruz(abajo[abajo.length - 2]!, abajo[abajo.length - 1]!, q) <= 0) abajo.pop();
    abajo.push(q);
  }
  const arriba: Punto[] = [];
  for (const q of p.reverse()) {
    while (arriba.length >= 2 && cruz(arriba[arriba.length - 2]!, arriba[arriba.length - 1]!, q) <= 0) arriba.pop();
    arriba.push(q);
  }
  return [...abajo.slice(0, -1), ...arriba.slice(0, -1)];
}

/** Los puntos del Morta en el recinto, en una pose: la cabeza, la quijada, las orejas, el cuerpo, las manos, las pezuñas, la cola y el chorro. */
function puntosDe(pose: Pose, chorro = 0): Punto[] {
  const enCabeza = (p: Punto): Punto => alRecinto(cabezaEnTitere(p, pose));
  const enTorso = (p: Punto): Punto => alRecinto(escorado(delTorso(p, pose), pose));
  const puntos: Punto[] = [
    ...CABEZA.map(enCabeza),
    ...QUIJADA.map((p) => enCabeza(girado(p, -pose.quijada * QUIJADA_ABRE, CL.atm))),
    // Las puntas de las orejas.
    ...([[18, -50], [0, -50]] as const).map((p) => enCabeza(girado(p, pose.orejas, CL.orejas))),
    ...TORSO.map(enTorso),
    ...PESCUEZO.map((p) => enTorso(delPescuezo(p, pose))),
    // La crin, que cae sobre el hombro.
    enTorso(delPescuezo([46, -250], pose)),
    ...TOALLON.map(([x, y]) => alRecinto(escorado([x, y + pose.toallon], pose))),
    // Las pezuñas y la cola.
    ...([[-38, 0], [38, 0], [-38, -16], [38, -16]] as const).map((p) => alRecinto(escorado(p, pose))),
    alRecinto(escorado(girado([A.cola[0] + 48, -8], pose.cola, A.cola), pose)),
  ];
  for (const b of brazos(pose)) puntos.push(enTorso(b.codo), enTorso(b.mano), enTorso([b.mano[0] - 12, b.mano[1] + 12]), enTorso([b.mano[0] + 12, b.mano[1] + 12]));
  if (chorro > 0) for (let t = 0; t <= 1; t += 0.1) puntos.push(alRecinto(escorado(enElChorro(t), pose)));
  return puntos;
}

/** Las poses de la vida, para mirar dónde quedan las cosas en todas. */
const POSES_DE_LA_VIDA: Array<[Pose, number]> = [
  [POSES['de-pie'], 0],
  [POSES.relincha, 0.6],
  ...[ESCORA.min - 3, ESCORA.max].map((e): [Pose, number] => [{ ...POSES['de-pie'], escora: e, toallon: 7 }, 0]),
  ...[0.3, 0.8, 1.2, 1.8, 2.2].map((u): [Pose, number] => {
    const r = relincho(u);
    return [{ ...POSES.relincha, salto: r.salto * 10, escora: -12 }, r.chorro];
  }),
];

test('el Morta es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--morta" data-id="el-morta" role="button" tabindex="0" aria-label="El Morta">/);
  const partes = ['entero', 'cuerpo', 'cola', 'pata-1', 'pata-2', 'toallon', 'torso', 'brazo-1', 'antebrazo-1', 'brazo-2', 'antebrazo-2', 'pescuezo', 'cabeza', 'orejas', 'boca', 'quijada', 'pupila', 'parpado', 'chorro', 'chorro-brillo', 'gota'];
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `al Morta le falta ${p}`);
  assert.ok(atras.includes('data-parte="mancha"'), 'la mancha de aceite no está en el piso');
  const imagenes = new Set([...(figura + atras).matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_MORTA.map((p) => p.nombre).sort(), 'usa piezas que no se imprimen, o le sobra una');
  assert.ok(PIEZAS_MORTA.length >= 5 && PIEZAS_MORTA.length <= 14, `${PIEZAS_MORTA.length} piezas`);
  // Los hombros y los codos: cada uno en las dos piezas que une.
  for (const n of [0, 1] as const) {
    const [sx, sy] = A.hombros[n];
    const codo: Punto = [sx, sy + A.largos.brazo];
    assert.ok(adentro('morta-torso', A.hombros[n]) && adentro(`morta-brazo-${n + 1}`, A.hombros[n]) && enPoligono(TORSO, A.hombros[n]), `el hombro ${n + 1} se cuelga del aire`);
    assert.ok(adentro(`morta-brazo-${n + 1}`, codo) && adentro(`morta-antebrazo-${n + 1}`, codo), `el codo ${n + 1} no une las dos mitades`);
    // Las patas giran debajo del toallón: la costura no se ve.
    assert.ok(adentro(`morta-pata-${n + 1}`, A.caderas[n]) && enPoligono(TOALLON, A.caderas[n]), `la pata ${n + 1} no nace debajo del toallón`);
  }
  assert.ok(adentro('morta-cola', A.cola) && enPoligono(TOALLON, A.cola), 'la cola no nace debajo del toallón');
  assert.ok(adentro('morta-torso', A.cuello) && adentro('morta-pescuezo', A.cuello) && enPoligono(PESCUEZO, A.cuello), 'el pescuezo no nace de los hombros');
  assert.ok(adentro('morta-pescuezo', A.nuca) && enPoligono(PESCUEZO, A.nuca), 'la cabeza se cuelga del aire');
  assert.ok(adentro('morta-cabeza', [0, 0]) && enPoligono(CABEZA, [2, 0]), 'la nuca no está en la cabeza');
  assert.ok(adentro('morta-cabeza', CL.atm) && adentro('morta-quijada', CL.atm) && enPoligono(QUIJADA, CL.atm), 'la quijada gira en el aire');
  assert.ok(adentro('morta-orejas', CL.orejas), 'las orejas giran en el aire');
  assert.ok(enPoligono(CABEZA, CL.ojo.centro) && enPoligono(CABEZA, CL.hocico) && enPoligono(CABEZA, [CL.comisura[0], CL.comisura[1] - 1]), 'el ojo o el hocico se salieron de la cara');
  assert.ok(enPoligono(TOALLON, A.nudo), 'el nudo no está en el toallón');
  assert.match(figura, /data-parte="parpado" data-pivote="-?[\d.]+ -?[\d.]+"/);
  for (const p of PIEZAS_MORTA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  const kb = PIEZAS_MORTA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(kb >= 80 && kb <= 250, `las piezas pesan ${kb.toFixed(0)} kB`);
});

test('las tintas del Morta están en su bloque de tokens.css, y su tinta de la página en el de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el Morta⟩'), tokens.indexOf('⟨/el Morta⟩'));
  const usadas = new Set(PIEZAS_MORTA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-morta-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 8, `usa ${usadas.size} tintas suyas`);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del Morta, o no dice de dónde salió`);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el Morta⟩ */'), sitio.indexOf('/* ⟨/el Morta⟩ */'));
  const clases = new Set([...figura.matchAll(/class="(bt-morta-[a-z-]+)"/g)].map((m) => m[1]!));
  assert.ok(clases.size >= 8);
  for (const clase of clases) assert.ok(suyo.includes(`.${clase} {`), `${clase} no está en su bloque de sitio.css`);
  for (const m of suyo.matchAll(/var\((--[a-z0-9-]+)\)/g)) assert.ok(tokens.includes(`${m[1]}:`), `${m[1]} no es un token`);
});

test('pisa el piso del templo, gotea en su mancha y el chorro cae adentro de ella', () => {
  // Las pezuñas tocan el piso, que en el templo es donde cae el papel picado.
  assert.ok(MORTA.piso > 550 && MORTA.piso < 600);
  const [cx] = MANCHA.centro;
  for (const [pose] of POSES_DE_LA_VIDA.slice(0, 4)) {
    const [gx] = goteraEn(pose);
    assert.ok(Math.abs(gx - cx) < MANCHA.ancho / 2 - 6, `la gota cae afuera de la mancha (${gx.toFixed(1)})`);
  }
  const [lx, ly] = enElChorro(1);
  assert.ok(Math.abs(lx - cx) < MANCHA.ancho / 2 && Math.abs(ly) < 4, 'el chorro cae afuera de la mancha');
  assert.deepEqual(enElChorro(0), CHORRO.sale);
  // El chorro sale de debajo del toallón, entre las patas.
  assert.ok(CHORRO.sale[1] > A.ruedo - 6 && CHORRO.sale[1] < A.ruedo + 2 && Math.abs(CHORRO.sale[0]) < 20);
});

test('no le tapa la cara a nadie del templo, ni se mete en el medallón de Momo', () => {
  const [ax, ay] = ARMADO.momo.argolla;
  const [mx, my] = ARMADO.momo.centro;
  const r = ARMADO.momo.radio * MOMO.escala;
  // El centro del medallón, colgado de su cordón, cuando se mece quieto (±4°) y cuando lo empujan un poco.
  const medallon = (g: number): Punto => {
    const d = Math.hypot(MOMO.argolla.x - MOMO.cuelga.x, MOMO.argolla.y - MOMO.cuelga.y) + (my - ay) * MOMO.escala;
    return [MOMO.cuelga.x + Math.sin((g * Math.PI) / 180) * d + (mx - ax) * MOMO.escala, MOMO.cuelga.y + Math.cos((g * Math.PI) / 180) * d];
  };
  const otros = Object.entries(VECINOS_DEL_TEMPLO).filter(([id]) => id !== 'el-morta');
  for (const [pose, chorro] of POSES_DE_LA_VIDA) {
    const puntos = puntosDe(pose, chorro);
    for (const [x, y] of puntos) assert.ok(x > 0 && x < 900 && y > 0 && y < 640, 'se sale de la escena');
    const casco = cascara(puntos);
    for (const [id, [ox, oy]] of otros) {
      assert.ok(!enPoligono(casco, [ox, oy]), `le tapa los ojos a ${id}`);
      const cerca = Math.min(...puntos.map(([x, y]) => Math.hypot(x - ox, y - oy)));
      assert.ok(cerca > 14, `se le pega a ${id} (${cerca.toFixed(0)})`);
    }
    for (const g of [-4, 0, 4, 8]) {
      const [cx, cy] = medallon(g);
      const cerca = Math.min(...puntos.map(([x, y]) => Math.hypot(x - cx, y - cy)));
      assert.ok(cerca > r + 6, `se mete en el medallón meciéndose a ${g}° (${(cerca - r).toFixed(0)})`);
    }
  }
  // El verso se dice arriba de las orejas, no encima de la cara.
  const oreja = alRecinto(cabezaEnTitere([16, -50], POSES['de-pie']));
  assert.ok(VERSO[1] < oreja[1] && Math.abs(VERSO[0] - oreja[0]) < 20);
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

function partesDe(html: string): Juguete[] {
  const partes: Juguete[] = [];
  for (const m of html.matchAll(/<(?:g|path|ellipse)\b([^>]*\bdata-parte="([^"]+)"[^>]*)>/g)) {
    const atributos = new Map([...m[1]!.matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1]!, a[2]!] as const));
    partes.push({
      dataset: { parte: m[2]!, ...(atributos.has('data-pivote') ? { pivote: atributos.get('data-pivote')! } : {}) },
      atributos,
      setAttribute(n, v) { this.atributos.set(n, v); },
      getAttribute(n) { return this.atributos.get(n) ?? null; },
    });
  }
  return partes;
}

function domDeJuguete() {
  const deFigura = partesDe(figura);
  const deAtras = partesDe(atras);
  const oyentes = new Map<string, (ev: unknown) => void>();
  const titere = { addEventListener: (tipo: string, fn: (ev: unknown) => void) => oyentes.set(tipo, fn) };
  const marco = (partes: Juguete[], conTitere: boolean) => ({
    querySelector: (sel: string) => (sel === '.titere--morta' && conTitere ? titere : null),
    querySelectorAll: (sel: string) => (sel === '[data-parte]' ? partes : []),
  });
  const todas = [...deAtras, ...deFigura];
  const foto = (): Record<string, string> => Object.fromEntries(todas.map((p) => [p.dataset.parte!, `${p.getAttribute('transform')}|${p.getAttribute('d')}|${p.getAttribute('opacity')}`]));
  const parte = (nombre: string): Juguete => todas.find((p) => p.dataset.parte === nombre)!;
  return { marcos: [marco(deAtras, false), marco(deFigura, true)] as unknown as SVGGElement[], oyentes, foto, parte };
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

const giro = (transform: string | null): number => Number(/rotate\((-?[\d.]+)/.exec(transform ?? '')?.[1] ?? NaN);
const corrido = (transform: string | null): number => Number(/translate\(0 (-?[\d.]+)\)/.exec(transform ?? '')?.[1] ?? NaN);

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = domDeJuguete();
    const antes = dom.foto();
    const { esc } = escenario(quieto);
    const vivo = armarMortaCon(dom.marcos, esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes, quieto ? 'con movimiento reducido no queda como sin JavaScript' : 'al armarse se mueve');
  }
});

test('vive: se bambolea a estribor, gotea, tartamudea, se sube el toallón y mira para todos lados', () => {
  const dom = domDeJuguete();
  const { esc, poner } = escenario(false);
  const vivo = armarMortaCon(dom.marcos, esc, azar(11));
  const miradas = new Set<string>();
  let [emin, emax] = [0, -20];
  let quijada = 0;
  let resbalo = 0;
  for (let i = 1; i <= 60 * 90; i++) {
    const t = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const e = vivo.estado();
    miradas.add(e.mirada);
    emin = Math.min(emin, e.escora);
    emax = Math.max(emax, e.escora);
    resbalo = Math.max(resbalo, e.toallon);
    quijada = Math.max(quijada, -giro(dom.parte('quijada').getAttribute('transform')));
    for (const nombre of ['cuerpo', 'torso', 'cabeza', 'quijada', 'brazo-1', 'antebrazo-2', 'gota', 'mancha', 'pupila']) {
      assert.doesNotMatch(dom.parte(nombre).getAttribute('transform') ?? '', /NaN|undefined|Infinity/, `${nombre} se rompió`);
    }
  }
  const e = vivo.estado();
  assert.ok(emin < -6 && emax < 0 && emax > -4, `no se bambolea a estribor (${emin.toFixed(1)} a ${emax.toFixed(1)})`);
  assert.ok(emin > -14, 'se cae');
  assert.ok(e.gotas >= 15, `en un minuto y medio gotea ${e.gotas} veces`);
  assert.ok(e.mancha > 1, 'la mancha no crece con lo que gotea');
  assert.ok(e.tartamudeos >= 4, `tartamudea ${e.tartamudeos} veces`);
  assert.ok(quijada > 3 && quijada < QUIJADA_ABRE * 0.4, 'tartamudeando, la quijada no tiembla, o se abre como si relinchara');
  assert.ok(e.subidas >= 2 && resbalo > 4, 'no se sube el toallón que se le resbala');
  assert.ok(miradas.size >= 4, `mira para ${miradas.size} lados`);
});

test('tocado, relincha de más: la boca abierta, el chorro de aceite, el brinco y la caída a estribor', () => {
  const dom = domDeJuguete();
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarMortaCon(dom.marcos, esc, azar(3));
  poner(0);
  dom.oyentes.get('click')!({});
  assert.deepEqual(dichos[0], ['el-morta', VERSO[0], VERSO[1]]);
  assert.equal(vivo.estado().modo, 'relincha');
  const mancha0 = vivo.estado().mancha;
  let boca = 0;
  let chorro = false;
  let salto = 0;
  let escoraCae = 0;
  let cabeza = -90;
  for (let i = 1; i <= 60 * 4; i++) {
    const t = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    boca = Math.max(boca, -giro(dom.parte('quijada').getAttribute('transform')));
    if (dom.parte('chorro').getAttribute('opacity') === '1' && dom.parte('chorro').getAttribute('d')!.includes('L')) chorro = true;
    salto = Math.max(salto, -corrido(dom.parte('cuerpo').getAttribute('transform')));
    cabeza = Math.max(cabeza, giro(dom.parte('cabeza').getAttribute('transform')));
    if (t > 2.1 && t < 2.3) escoraCae = Math.min(escoraCae, vivo.estado().escora);
  }
  assert.ok(boca > QUIJADA_ABRE * 0.8, 'relinchando no abre la boca');
  assert.ok(cabeza > A.cabeza + 25, 'relinchando no tira la cabeza para arriba');
  assert.ok(chorro, 'no se le escapa el chorro de aceite');
  assert.ok(salto > 7, 'no brinca');
  assert.ok(escoraCae < -9, `no cae a estribor (${escoraCae.toFixed(1)})`);
  assert.ok(vivo.estado().mancha > mancha0 + 0.1, 'el chorro no agranda la mancha');
  assert.equal(vivo.estado().modo, 'quieto', 'no vuelve a quedarse parado');
  assert.ok(TIEMPOS.relincha < 4);
  assert.equal(vivo.reaccionar('otro-bicho', 5), false);
  assert.equal(vivo.reaccionar('el-morta', 5), true);
  assert.equal(vivo.estado().modo, 'relincha');

  // Con movimiento reducido: tocarlo lo pasa a la pose de relinchar, quieta, y no se mueve solo.
  const q = domDeJuguete();
  const quieto = escenario(true);
  const vivoQuieto = armarMortaCon(q.marcos, quieto.esc, azar(3));
  const dePie = q.foto();
  q.oyentes.get('click')!({});
  const relincha = q.foto();
  assert.notDeepEqual(relincha, dePie, 'tocado con movimiento reducido no cambia de pose');
  assert.ok(-giro(q.parte('quijada').getAttribute('transform')) >= QUIJADA_ABRE - 0.01, 'la pose quieta de relinchar tiene la boca cerrada');
  assert.equal(q.parte('chorro').getAttribute('opacity'), '1', 'la pose quieta de relinchar no pierde aceite');
  assert.equal(quieto.dichos.length, 1);
  vivoQuieto.mover(5, 0.016);
  assert.deepEqual(q.foto(), relincha, 'con movimiento reducido se movió solo');
  q.oyentes.get('click')!({});
  assert.deepEqual(q.foto(), dePie, 'tocado otra vez no vuelve a la pose de pie');
});

test('la ficha: el retrato es el títere relinchando, y la estampa dice qué es del dibujo y qué de la letra', () => {
  const r = retratoDe('el-morta')!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/templo-lejos.webp') && svg.includes('/bestiario/morta-cabeza.webp') && svg.includes('/bestiario/morta-mancha.webp'));
  const [x0, y0, w, h] = r.caja;
  for (const [x, y] of puntosDe(POSES.relincha, 0.45)) assert.ok(x > x0 + 2 && x < x0 + w - 2 && y > y0 + 2 && y < y0 + h - 2, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  const b = datos.bestias.find((x) => x.id === 'el-morta')!;
  assert.match(b.estampa, /letra/);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /toallón/);
  assert.ok(b.cuenta && b.cuenta.length > 0);
  for (const c of b.cuenta) {
    assert.match(c.fuente ?? '', /^RES-\d+$/);
    if (c.rotulo === 'testimonio') assert.ok(c.quien);
  }
});

test('la isla del Morta se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/morta.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco/.test(r)), []);
});
