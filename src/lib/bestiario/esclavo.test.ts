import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_ESCLAVO, RETRATO, rejaDeLaCelda } from './arte-esclavo.ts';
import { PIEZAS_PRISION } from './arte-prision.ts';
import { VECINOS_DE_LA_PRISION, escenaPrision } from './escenas.ts';
import { DRACULA, PRISION } from './rig.ts';
import {
  BARROTE, BARROTES, CELDA, DURA, ESCLAVO, ESCLAVO_ARMADO, GESTOS, HUECO, LAGRIMA, TRAVESANIOS, VERSO, alRecinto, alcanzar, chillidoEn, manoDeAdelante,
  sollozoEn, transformes, travesanio, type Gesto, type Punto,
} from './rig-esclavo.ts';
import { armarEsclavoCon, xDeLaDracula } from '../../scripts/bestiario/esclavo.ts';

/**
 * El esclavo sensible y chillón (`D-73`, decimoquinta vuelta): que sea un títere entero, que esté preso
 * adentro de una celda de verdad (la reja de la escena, delante de él), que no le tape la cara a nadie,
 * que chille y se le corte, que la lágrima no caiga, y que la pose de la isla sea la del HTML.
 */

const ID = 'el-esclavo-sensible-y-chillon';
const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as {
  bestias: Array<{ id: string; nombre: string; estampa: string; dibujo: Record<string, unknown>; cuenta?: Array<{ rotulo: string; fuente: string; quien?: string }> }>;
};
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
// Solo el esclavo: desde la vigesimoquinta vuelta el pichón también va en la capa de atrás de la prisión.
const marcado = capasDe('la-prision', 'atras', nombres, 1, 'el-esclavo-sensible-y-chillon');
const A = ESCLAVO_ARMADO;
const K = A.agranda;
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_ESCLAVO.find((p) => p.nombre === nombre)!.caja;
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
const rot = ([x, y]: Punto, [px, py]: Punto, grados: number): Punto => {
  const a = (grados * Math.PI) / 180;
  return [px + (x - px) * Math.cos(a) - (y - py) * Math.sin(a), py + (x - px) * Math.sin(a) + (y - py) * Math.cos(a)];
};
/** Un punto de la cabeza (a la medida del títere, ya agrandado) movido como lo mueve un gesto. */
const deLaCabeza = (q: Punto, g: Gesto): Punto => {
  const [x, y] = rot(q, A.cuello, g.cabeza);
  return [x, y - g.alza + g.hombros];
};
/** Lo que se ve de él en un gesto, en el recinto: la cara, las rodillas, los pies y las dos manos. */
function puntos(g: Gesto): Record<string, Punto> {
  const r = alcanzar(A.hombros[0], A.codos[0], A.manos[0], manoDeAdelante(g.brazo, g.hombros), [-1, 0.25]);
  return {
    ojo1: alRecinto(deLaCabeza(A.ojos[0].centro, g)),
    ojo2: alRecinto(deLaCabeza(A.ojos[1].centro, g)),
    boca: alRecinto(deLaCabeza([A.cara[0], A.boca], g)),
    rodilla1: alRecinto([A.rodillas[0][0], A.rodillas[0][1] - 12]),
    rodilla2: alRecinto([A.rodillas[1][0], A.rodillas[1][1] - 12]),
    pie1: alRecinto([-26, 0]),
    pie2: alRecinto([24, 0]),
    mano1: alRecinto([r.punta[0], r.punta[1] + g.hombros]),
    mano2: alRecinto([A.manos[1][0], A.manos[1][1] + g.hombros]),
  };
}
const muestras = (dura: number): number[] => Array.from({ length: 59 }, (_, i) => (dura * (i + 0.5)) / 59);

test('el esclavo es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(marcado, /<g class="titere titere--esclavo" data-id="el-esclavo-sensible-y-chillon" role="button" tabindex="0" aria-label="El esclavo sensible y chillón">/);
  const partes = ['entero', 'torso', 'cabeza', 'quijada', 'brazos', 'brazo-1', 'antebrazo-1', 'cadena', 'pupila-1', 'pupila-2', 'parpado-1', 'parpado-2', 'rojo', 'lagrima'];
  for (const p of partes) assert.ok(marcado.includes(`data-parte="${p}"`), `al esclavo le falta ${p}`);
  const imagenes = [...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!);
  assert.deepEqual([...new Set(imagenes)].sort(), PIEZAS_ESCLAVO.map((p) => p.nombre).sort(), 'usa piezas que no se imprimen, o le sobra una');
  assert.ok(PIEZAS_ESCLAVO.length >= 5 && PIEZAS_ESCLAVO.length <= 14, `${PIEZAS_ESCLAVO.length} piezas`);
  // Los pivotes: cada articulación cae adentro de las dos piezas que une.
  assert.ok(adentro('esclavo-cuerpo', A.cuello) && adentro('esclavo-cabeza', A.cuello), 'la cabeza gira en el aire');
  assert.ok(adentro('esclavo-cuerpo', A.hombros[0]) && adentro('esclavo-brazo-1', A.hombros[0]), 'el hombro de adelante no está en el hombro');
  assert.ok(adentro('esclavo-cuerpo', A.hombros[1]) && adentro('esclavo-brazo-2', A.hombros[1]), 'el hombro de atrás no está en el hombro');
  assert.ok(adentro('esclavo-brazo-1', A.codos[0]) && adentro('esclavo-antebrazo-1', A.codos[0]), 'el codo no une las dos mitades del brazo');
  assert.ok(adentro('esclavo-antebrazo-1', A.manos[0]), 'la mano no está en el antebrazo');
  assert.ok(adentro('esclavo-piernas', A.grillete) && adentro('esclavo-cadena', A.grillete), 'la cadena no sale del grillete');
  for (const o of A.ojos) assert.ok(adentro('esclavo-cabeza', o.centro), 'un ojo se salió de la cara');
  // La boca: la quijada baja desde abajo de la cara y deja ver lo de adentro.
  assert.ok(adentro('esclavo-boca', [A.cara[0], A.boca + 2]) && adentro('esclavo-quijada', [A.cara[0], A.boca + 4]), 'la boca no está donde abre la quijada');
  assert.ok(adentro('esclavo-boca', [A.cara[0] - 4, A.boca + A.abre]), 'abierta, la boca muestra lo que no está impreso');
  for (const m of marcado.matchAll(/data-parte="parpado-\d"[^>]*>/g)) assert.match(m[0], /data-pivote="-?[\d.]+ -?[\d.]+"/);
  for (const p of PIEZAS_ESCLAVO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  // Pesa lo que pide el brief: entre 80 y 250 kB todas juntas.
  const pesa = PIEZAS_ESCLAVO.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0);
  assert.ok(pesa > 80_000 && pesa < 250_000, `las piezas pesan ${(pesa / 1000).toFixed(0)} kB`);
});

test('está tallado con las tintas de la prisión, y lo único suyo es el rojo del ojo, medido en la tapa', () => {
  const tintas = new Set(PIEZAS_ESCLAVO.flatMap((p) => [...p.dibujo.matchAll(/var\((--[a-z0-9-]+)\)/g)].map((m) => m[1]!)));
  assert.deepEqual([...tintas].sort(), ['--bestia-dracula-papel', '--disco-oktubre-apoyo', '--fondo'], 'el grabado usa otra tinta que la de la prisión');
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el esclavo sensible y chillon⟩'), tokens.indexOf('⟨/el esclavo sensible y chillon⟩'));
  assert.match(bloque, /--bestia-esclavo-ojo: #[0-9a-f]{6}; \/\* .*Oktubre.* \*\//, 'el rojo del ojo no dice de dónde salió');
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el esclavo sensible y chillón⟩ */'), sitio.indexOf('/* ⟨/el esclavo sensible y chillón⟩ */'));
  const clases = new Set([...marcado.matchAll(/class="(bt-esclavo-[a-z]+)"/g)].map((m) => m[1]!));
  assert.ok(clases.size >= 5);
  for (const c of clases) assert.ok(suyo.includes(`.${c} {`), `${c} no está en su bloque de sitio.css`);
  assert.match(suyo, /\.bt-esclavo-rojo \{ fill: var\(--bestia-esclavo-ojo\); \}/);
});

test('está preso adentro de la celda del fondo a la derecha, con la reja de la escena delante', () => {
  // La reja de adelante es la misma que talla el fondo, barrote por barrote.
  const lejos = PIEZAS_PRISION.find((p) => p.nombre === 'prision-lejos')!.dibujo;
  assert.ok(lejos.includes(rejaDeLaCelda()), 'la reja que va delante no es la de la celda del fondo');
  assert.ok(lejos.includes(`fill="var(--disco-oktubre-apoyo)"`));
  // Va detrás de la reja de la ventana (se dibuja antes) y, en su capa, la reja de la celda le va delante.
  const escena = escenaPrision(nombres);
  assert.ok(escena.indexOf(`data-marco="${ID}"`) < escena.indexOf('prision-reja.webp'), 'no está en la capa de atrás');
  assert.ok(marcado.indexOf('titere--esclavo') < marcado.indexOf('esclavo-reja.webp'), 'la reja no le va delante');
  assert.match(marcado, /<g pointer-events="none"><image href="\/bestiario\/esclavo-reja\.webp"/, 'la reja se lleva los toques');
  // Lo de afuera del hueco es pared: está recortado por el hueco de la celda.
  assert.match(marcado, /<clipPath id="esclavo-hueco"><path d="M740 486\.4 L680 428\.8 L680 186\.4 L740 194\.9 Z"\/><\/clipPath><g clip-path="url\(#esclavo-hueco\)">/);
  assert.equal(CELDA.lado, 1);
  // Cada gesto, y cada instante del chillido y del sollozo: la cara, las rodillas, los pies y las manos
  // se ven por el hueco.
  const gestos: Gesto[] = [
    ...Object.values(GESTOS),
    ...muestras(DURA.chillido).map((u) => chillidoEn(u, GESTOS.calle)),
    ...muestras(DURA.sollozo).map((u) => sollozoEn(u, GESTOS.calle)),
  ];
  for (const g of gestos) {
    for (const [que, q] of Object.entries(puntos(g))) assert.ok(enPoligono(HUECO, q), `${que} queda en la pared (${q.map((v) => v.toFixed(0)).join(', ')})`);
  }
  // La cara, en el paño de arriba de la reja: los ojos y la boca arriba del travesaño.
  const [ojo, , boca] = Object.values(puntos(GESTOS.calle));
  assert.ok(ojo![1] < travesanio(ojo![0], TRAVESANIOS[1]) - 12 && boca![1] < travesanio(boca![0], TRAVESANIOS[1]), 'la reja le cruza la cara');
  // Sentado en el catre: el asiento es la tabla, que va arriba de los ojos de los reos que miran desde abajo.
  const reos = VECINOS_DE_LA_PRISION['los-reos-de-la-sociedad']!;
  assert.ok(ESCLAVO.asiento + 14 * ESCLAVO.escala < reos[1] - 6, 'el catre les tapa los ojos a los reos');
  // Es del tamaño de la gente de la prisión: sentado, de la cabeza al asiento, mide algo más de la mitad
  // de lo que mediría parado en ese fondo. La vara es la drácula: la coronilla en -573 de su títere, y
  // lo que ocupa del piso al techo donde camina.
  const delTecho = (u: number): number => 640 - 240 * u - 70 * u;
  const proporcion = (573 * DRACULA.escala) / delTecho((640 - DRACULA.piso) / 240);
  const parado = proporcion * delTecho((900 - ESCLAVO.x) / (900 - PRISION.fondo.x1));
  const sentado = 308 * ESCLAVO.escala;
  assert.ok(sentado > 0.5 * parado && sentado < 0.65 * parado, `sentado mide ${sentado.toFixed(0)} y parado mediría ${parado.toFixed(0)}`);
});

test('no le tapa la cara a nadie: los demás de la prisión siguen a la vista', () => {
  const [x0, x1] = [HUECO[1]![0], HUECO[0]![0]];
  const arriba = HUECO[3]![1] - 6;
  const abajo = ESCLAVO.asiento + 14 * ESCLAVO.escala;
  for (const [id, [x, y]] of Object.entries(VECINOS_DE_LA_PRISION)) {
    if (id === ID) continue;
    assert.ok(!(x > x0 - 8 && x < x1 + 8 && y > arriba && y < abajo), `le tapa los ojos a ${id}`);
  }
  // La cadena cuelga por el costado de la tabla, lejos de los ojos de los reos.
  const [cx0, , cw] = PIEZAS_ESCLAVO.find((p) => p.nombre === 'esclavo-cadena')!.caja;
  const reos = VECINOS_DE_LA_PRISION['los-reos-de-la-sociedad']!;
  assert.ok(alRecinto([cx0 + cw, 0])[0] < reos[0] - 6 - 4, 'la cadena les pasa por encima de los ojos a los reos');
  // Ni Barbazul ni la drácula pasan por su celda: la drácula camina por adelante, y no le tapa la cara
  // salvo cuando abre la capa, que tapa todo.
  assert.ok(DRACULA.hasta + 64 * DRACULA.escala < x0, 'la drácula, cerrada, le tapa la celda');
});

test('chilla: se agarra del barrote, abre la boca con los ojos apretados, y se le corta de golpe', () => {
  // El barrote que agarra es uno de la reja de verdad, del lado de la ventana.
  assert.ok(BARROTES.some((x) => Math.abs(alRecinto(BARROTE)[0] - x) < 0.01), 'agarra el aire');
  assert.ok(Math.abs(alRecinto(BARROTE)[0] - Math.min(...BARROTES)) < 0.01, 'no agarra el barrote del lado de la ventana');
  const pico = chillidoEn(0.8, GESTOS.calle);
  assert.ok(pico.quijada > 0.75 && pico.parpados.every((p) => p > 0.95) && pico.brazo > 0.99 && pico.rojo > 0.95, 'en el pico no chilla');
  const mano = puntos(pico).mano1;
  assert.ok(Math.hypot(mano[0] - alRecinto(BARROTE)[0], mano[1] - alRecinto(BARROTE)[1]) < 0.8, 'la mano no llega al barrote');
  // El puño no le tapa la cara: queda arriba de los ojos.
  assert.ok(mano[1] < puntos(pico).ojo1[1] - 3, 'el puño le tapa la cara');
  // El corte: en un décimo de segundo la boca se cierra, abre los ojos y te mira.
  assert.ok(chillidoEn(1.3, GESTOS.calle).quijada > 0.6);
  const corte = chillidoEn(1.5, GESTOS.calle);
  assert.ok(corte.quijada < 0.05 && corte.parpados.every((p) => p < 0.2), 'no se le corta');
  assert.ok(corte.mira[0] > -0.3, 'cuando se le corta no te mira');
  // Y vuelve: suelta el barrote, y la lágrima asoma de nuevo en el ojo.
  const fin = chillidoEn(DURA.chillido - 0.05, GESTOS.calle);
  assert.ok(fin.brazo < 0.02 && fin.quijada < 0.02 && fin.lagrima > 0.4, 'no vuelve a abrazarse las rodillas');
  assert.deepEqual(chillidoEn(DURA.chillido + 0.1, GESTOS.calle), GESTOS.calle);
});

test('casi llora: los hipos, el rojo, y la lágrima que baja y no cae', () => {
  const us = muestras(DURA.sollozo);
  const gs = us.map((u) => sollozoEn(u, GESTOS.calle));
  assert.ok(Math.min(...gs.map((g) => g.hombros)) < -2, 'no tiene hipos');
  assert.ok(Math.max(...gs.map((g) => g.rojo)) > 0.95, 'los ojos no se le ponen al rojo vivo');
  assert.ok(Math.max(...gs.map((g) => g.lagrima)) > 0.7, 'la lágrima no baja');
  // No cae: nunca pasa de tres cuartos, y queda arriba del pómulo.
  for (const g of [...gs, ...muestras(DURA.chillido).map((u) => chillidoEn(u, GESTOS.calle))]) assert.ok(g.lagrima <= 0.76, `la lágrima cae (${g.lagrima.toFixed(2)})`);
  const baja = (0.76 - 0.5) * 2 * LAGRIMA.baja;
  assert.ok(LAGRIMA.asoma[1] + baja < A.boca - 8, 'la lágrima llega a la boca');
  // La lágrima asoma del ojo de este lado, el de la mejilla en sombra, donde la gota blanca se ve.
  const [ox, oy] = A.ojos[1].centro;
  assert.ok(Math.abs(LAGRIMA.asoma[0] - ox) < A.ojos[1].radio[0] && LAGRIMA.asoma[1] > oy && LAGRIMA.asoma[1] - oy < A.ojos[1].radio[1] * 1.3);
  // En la pose quieta la lágrima está parada en el borde del ojo: ahora ya casi no llora.
  assert.equal(GESTOS.calle.lagrima, 0.5);
  assert.match(transformes('calle').lagrima!, /scale\(1\.000\)/);
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

function juguete(atributos: Map<string, string>, dataset: Record<string, string> = {}): Juguete {
  return {
    dataset,
    atributos,
    setAttribute(n, v) { this.atributos.set(n, v); },
    getAttribute(n) { return this.atributos.get(n) ?? null; },
  };
}

/** El marco con el títere, y una drácula de mentira que el test mueve. */
function domDeJuguete(html: string) {
  const partes: Juguete[] = [];
  for (const m of html.matchAll(/<(?:g|ellipse|path)\b([^>]*\bdata-parte="([^"]+)"[^>]*)>/g)) {
    const atributos = new Map([...m[1]!.matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1]!, a[2]!] as const));
    partes.push(juguete(atributos, { parte: m[2]!, ...(atributos.has('data-pivote') ? { pivote: atributos.get('data-pivote')! } : {}) }));
  }
  const oyentes = new Map<string, (ev: unknown) => void>();
  const titere = {
    querySelectorAll: (sel: string) => (sel === '[data-parte]' ? partes : []),
    addEventListener: (tipo: string, fn: (ev: unknown) => void) => oyentes.set(tipo, fn),
  };
  const dracula = juguete(new Map([['transform', `translate(${DRACULA.x} ${DRACULA.piso}) rotate(0) scale(${DRACULA.escala})`]]));
  const taco = juguete(new Map([['opacity', '0']]));
  const svg = { querySelector: (sel: string) => (sel === '#dracula-entera' ? dracula : sel === '[data-parte="taco"]' ? taco : null) };
  const marco = { querySelector: (sel: string) => (sel === '.titere--esclavo' ? titere : null), ownerSVGElement: svg };
  const parte = (n: string): Juguete => partes.find((p) => p.dataset.parte === n)!;
  const foto = (): Record<string, string> => Object.fromEntries(partes.map((p) => [p.dataset.parte!, p.getAttribute(p.dataset.parte === 'rojo' ? 'opacity' : 'transform') ?? '']));
  return { marco: marco as unknown as SVGGElement, partes, parte, oyentes, foto, dracula, taco };
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
    const vivo = armarEsclavoCon([dom.marco], esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes, quieto ? 'con movimiento reducido no queda como sin JavaScript' : 'al armarse se mueve');
  }
  assert.equal(xDeLaDracula('translate(412.5 624.00) rotate(1.40) scale(0.8)'), 412.5);
  assert.equal(xDeLaDracula(null), null);
});

test('vive: mira la calle, casi llora, se esconde en las rodillas, y sigue a la drácula cuando taconea cerca', () => {
  const dom = domDeJuguete(marcado);
  const { esc, poner } = escenario(false);
  const vivo = armarEsclavoCon([dom.marco], esc, azar(11));
  const vistos = new Set<string>();
  let lagrimaMax = 0;
  let miraElla = 0;
  let cadenaMax = 0;
  for (let i = 1; i <= 60 * 150; i++) {
    const t = i / 60;
    poner(t);
    // Entre el minuto y el minuto y medio, la drácula taconea hacia su lado y vuelve.
    if (t > 60 && t < 90) {
      const x = 440 + 140 * Math.sin(((t - 60) / 30) * Math.PI);
      dom.dracula.setAttribute('transform', `translate(${x.toFixed(1)} ${DRACULA.piso}) rotate(0) scale(${DRACULA.escala})`);
      const golpe = 1 - ((t * 2.2) % 1) / 0.22;
      dom.taco.setAttribute('opacity', golpe > 0 ? golpe.toFixed(2) : '0');
    } else dom.taco.setAttribute('opacity', '0');
    vivo.mover(t, 1 / 60);
    const e = vivo.estado();
    vistos.add(e.modo);
    lagrimaMax = Math.max(lagrimaMax, e.lagrima);
    if (t > 61 && t < 89 && e.mira[0] < -0.3 && e.mira[1] > 0 && e.mira[1] < 0.5) miraElla++;
    cadenaMax = Math.max(cadenaMax, Math.abs(Number(/rotate\((-?[\d.]+)/.exec(dom.parte('cadena').getAttribute('transform')!)![1])));
    for (const p of dom.partes) assert.doesNotMatch(p.getAttribute('transform') ?? p.getAttribute('opacity') ?? '', /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
  }
  for (const m of ['quieto', 'sollozo', 'rodillas']) assert.ok(vistos.has(m), `en dos minutos y medio no hizo «${m}»`);
  assert.ok(lagrimaMax > 0.7 && lagrimaMax <= 0.76, `la lágrima llegó a ${lagrimaMax.toFixed(2)}`);
  assert.ok(miraElla > 60 * 4, 'no sigue a la drácula con los ojos');
  assert.ok(vivo.estado().respingos > 10, `pegó ${vivo.estado().respingos} respingos con los tacos`);
  assert.ok(cadenaMax > 0.5 && cadenaMax <= 9, `la cadena se mece ${cadenaMax.toFixed(1)}°`);
});

test('tocado, chilla y dice su verso arriba de la celda; con movimiento reducido cambia de pose quieta', () => {
  const dom = domDeJuguete(marcado);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarEsclavoCon([dom.marco], esc, azar(3));
  poner(1);
  dom.oyentes.get('click')!({});
  assert.deepEqual(dichos[0], [ID, VERSO[0], VERSO[1]]);
  assert.ok(VERSO[1] < HUECO[3]![1] && VERSO[0] === ESCLAVO.x, 'el bocadillo le tapa la cara');
  let boca = 0;
  for (let i = 61; i <= 60 * 5; i++) {
    poner(i / 60);
    vivo.mover(i / 60, 1 / 60);
    if (i / 60 < 1 + DURA.chillido) assert.equal(vivo.estado().modo, 'chillido');
    boca = Math.max(boca, Number(/translate\(0 (-?[\d.]+)\)/.exec(dom.parte('quijada').getAttribute('transform')!)![1]));
  }
  assert.ok(boca > A.abre * 0.8, 'tocado no abre la boca');
  assert.equal(vivo.estado().modo, 'quieto');
  assert.equal(vivo.reaccionar('otro-bicho', 0), false);
  assert.equal(vivo.reaccionar(ID, 6), true);

  // Con movimiento reducido: tocarlo lo pasa al chillido, quieto, y no se mueve solo.
  const q = domDeJuguete(marcado);
  const quieto = escenario(true);
  const vivoQuieto = armarEsclavoCon([q.marco], quieto.esc, azar(3));
  const calle = q.foto();
  q.oyentes.get('click')!({});
  const chilla = q.foto();
  assert.notDeepEqual(chilla, calle, 'tocado con movimiento reducido no cambia de pose');
  assert.deepEqual(chilla, transformesDeLaFoto(transformes('chillido'), chilla));
  assert.equal(quieto.dichos.length, 1);
  vivoQuieto.mover(5, 0.016);
  assert.deepEqual(q.foto(), chilla, 'con movimiento reducido se movió solo');
});

/** Las transformaciones de un gesto, con la forma de la foto del DOM de juguete. */
function transformesDeLaFoto(t: Record<string, string>, foto: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.keys(foto).map((k) => [k, t[k] ?? foto[k]!]));
}

test('la ficha: el retrato es él en su celda, y la estampa dice qué es del dibujo y qué de la letra', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/prision-lejos.webp') && svg.includes('/bestiario/esclavo-cabeza.webp') && svg.includes('/bestiario/esclavo-reja.webp'));
  const [x0, y0, w, h] = r.caja;
  for (const [que, [x, y]] of Object.entries(puntos(GESTOS.calle))) assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `${que} se sale del retrato`);
  for (const q of HUECO) assert.ok(q[0] >= x0 && q[0] <= x0 + w, 'la celda no entra de ancho en el retrato');
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.match(b.estampa, /Oktubre/);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /letra/);
  const palabras = b.estampa.split(/\s+/).length;
  assert.ok(palabras >= 50 && palabras <= 70, `la estampa tiene ${palabras} palabras`);
  assert.deepEqual(b.dibujo, { f: 'persona', con: ['cadena'], ropa: 'remera' });
  for (const c of b.cuenta ?? []) {
    assert.match(c.fuente, /^RES-\d+$/);
    assert.equal(c.rotulo, 'testimonio', 'lo que cuenta el Indio de su libro es testimonio, no hecho');
  }
});

test('la isla del esclavo se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/esclavo.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|grabado|titeres|escenas|elenco/.test(r)), []);
  const rig = readFileSync('src/lib/bestiario/rig-esclavo.ts', 'utf-8');
  assert.deepEqual([...rig.matchAll(/from '([^']+)'/g)].map((m) => m[1]!), ['./rig.ts']);
  // La cuenta va y vuelve: del recinto al títere y al revés.
  assert.ok(Math.abs(alRecinto([10, -20])[0] - (ESCLAVO.x + 10 * ESCLAVO.escala)) < 1e-9);
  assert.equal(K, 1.2);
});
