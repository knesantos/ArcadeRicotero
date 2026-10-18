import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BESTIA_POP, CHISPAS, CHISPAS_QUIETAS, PIEZAS_BESTIA_POP, RECORTES_BESTIA_POP, adentroDelTitere } from './arte-bestia-pop.ts';
import { POP, POP_ARMADO as A, SEGUIDOR, SILLA, enElAntebrazo, enElRecinto, manoCon, rotar, type Gesto, type P } from './rig-bestia-pop.ts';
import { GALPON } from './rig-entornos.ts';
import { escenaGalpon } from './escenas-entornos.ts';
import { DURA, armarBestiaPop, avance, escribir, poseQuieta, total } from '../../scripts/bestiario/bestia-pop.ts';

/**
 * La bestia pop (`D-73`, decimoquinta vuelta): el títere de papel del galpón, sus caras de la gente
 * y lo que hace cuando la tocan. Lo que la junta con el resto del elenco lo mira `elenco.test.ts`.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string; estampa: string; cuenta: Array<{ rotulo: string; fuente: string }> }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'la-bestia-pop';

function adentro([x, y]: P, pts: readonly P[]): boolean {
  let dentro = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]!;
    const [xj, yj] = pts[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}

const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_BESTIA_POP.find((p) => p.nombre === nombre)!.caja;

test('la bestia pop es un títere entero: cada parte que mueve la isla, con su imagen y su bisagra adentro', () => {
  const t = adentroDelTitere();
  const partes = ['halo', 'piernas', 'cuerpo', 'cabeza', 'brazo-1', 'antebrazo-1', 'brazo-2', 'antebrazo-2', ...Array.from({ length: A.caras }, (_, i) => `cara-${i + 1}`)];
  for (const p of partes) {
    assert.ok(t.includes(`data-parte="${p}"`), `falta la parte ${p}`);
    assert.ok(t.includes(`/bestiario/bestia-pop-${p}.webp`), `la parte ${p} no tiene su imagen`);
  }
  assert.ok(PIEZAS_BESTIA_POP.length >= 5 && PIEZAS_BESTIA_POP.length <= 14, `${PIEZAS_BESTIA_POP.length} piezas`);
  for (const p of PIEZAS_BESTIA_POP) assert.ok(p.nombre.startsWith('bestia-pop-'), `${p.nombre} no lleva el prefijo`);
  // Las bisagras, adentro del recorte de las dos piezas que unen.
  const R = RECORTES_BESTIA_POP;
  assert.ok(adentro(A.cadera, R.cuerpo!) && adentro(A.cadera, R.piernas!), 'la cadera no une el cuerpo con las piernas');
  assert.ok(adentro(A.cuello, R.cabeza!) && adentro(A.cuello, R.cuerpo!), 'el cuello no une la cabeza con el cuerpo');
  for (const n of [0, 1] as const) {
    assert.ok(adentro(A.hombros[n], R[`brazo-${n + 1}`]!) && adentro(A.hombros[n], R.cuerpo!), `el hombro ${n + 1} no está en el brazo y el cuerpo`);
    assert.ok(adentro(A.codos[n], R[`brazo-${n + 1}`]!) && adentro(A.codos[n], R[`antebrazo-${n + 1}`]!), `el codo ${n + 1} no une sus dos piezas`);
    assert.ok(adentro(A.manos[n], R[`antebrazo-${n + 1}`]!), `los nudillos ${n + 1} no están en su mano`);
  }
  // Cada destello cae sobre la pieza que lo lleva: no queda una estrella flotando al lado.
  for (const [parte, lista] of Object.entries(CHISPAS)) {
    for (const [x, y] of lista) assert.ok(adentro([x, y], R[parte]!), `el destello (${x}, ${y}) se sale de ${parte}`);
  }
  // La cara: el hueco está adentro de la cabeza, y cada cara entra en el hueco.
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) {
    assert.ok(adentro([A.cara.centro[0] + dx * A.cara.radio[0], A.cara.centro[1] + dy * A.cara.radio[1]], R.cabeza!), 'la cara se sale de la cabeza');
  }
});

test('pisa el tablado del galpón, con las plataformas y los nudillos, y entra entera en la escena', () => {
  const R = RECORTES_BESTIA_POP;
  const piso = Math.max(...R.piernas!.map((p) => p[1]));
  assert.ok(piso >= 0 && piso <= 3, `las plataformas quedan a ${piso} del tablado`);
  for (const n of [1, 2]) {
    const nudillos = Math.max(...R[`antebrazo-${n}`]!.map((p) => p[1]));
    assert.ok(nudillos >= -1 && nudillos <= 3, `los nudillos ${n} quedan a ${nudillos} del tablado`);
  }
  const [, piso0] = enElRecinto([0, 0]);
  assert.ok(piso0 > GALPON.tablado.fondo && piso0 < GALPON.tablado.borde, 'no está parada en el tablado');
  assert.equal(POP.x, GALPON.bestiaPop.x);
  // Mide lo que pide el galpón: de las plataformas a la coronilla, con el pelo parado de más.
  const coronilla = -Math.min(...R.cabeza!.map((p) => p[1])) * POP.escala;
  assert.ok(coronilla > GALPON.bestiaPop.alto && coronilla < GALPON.bestiaPop.alto + 18, `mide ${coronilla.toFixed(0)} y el galpón pide ${GALPON.bestiaPop.alto}`);
  for (const p of PIEZAS_BESTIA_POP) {
    const [x, y, w, h] = p.caja;
    const [x0, y0] = enElRecinto([x, y]);
    const [x1, y1] = enElRecinto([x + w, y + h]);
    assert.ok(x0 >= 0 && x1 <= 900 && y0 >= 0 && y1 <= 640, `${p.nombre} se sale de la escena`);
  }
});

/** Los puntos del recorte de un antebrazo con un gesto puesto, en el recinto. */
const antebrazoCon = (n: 0 | 1, g: Gesto): P[] => RECORTES_BESTIA_POP[`antebrazo-${n + 1}`]!.map((p) => enElRecinto(enElAntebrazo(n, p, g)));
const brazoCon = (n: 0 | 1, g: Gesto): P[] => RECORTES_BESTIA_POP[`brazo-${n + 1}`]!.map((p) => enElRecinto(rotar(p, A.hombros[n], g.brazo)));
const tapaLaSilla = ([x, y]: P): boolean => x > SILLA.x0 && x < SILLA.x1 && y > SILLA.arriba && y < SILLA.piso;

test('no tapa la silla vacía, ni quieta ni con ningún gesto', () => {
  const quieto = { brazo: 0, antebrazo: 0 };
  for (const p of PIEZAS_BESTIA_POP) {
    if (p.nombre === 'bestia-pop-halo') continue;
    const [x, , w] = p.caja;
    assert.ok(enElRecinto([x + w, 0])[0] < SILLA.x0, `${p.nombre} llega a la silla`);
  }
  for (const [n, g] of [[1, quieto], [1, A.gestos.busca], [1, A.gestos.brilla[1]], [0, A.gestos.brilla[0]], [0, A.gestos.tapa]] as const) {
    const puntos = [...antebrazoCon(n, g), ...brazoCon(n, g)];
    assert.deepEqual(puntos.filter(tapaLaSilla), [], `el brazo ${n + 1} tapa la silla`);
  }
});

test('los gestos llegan adonde tienen que llegar: la mano a la cara, la otra al seguidor, y las dos arriba', () => {
  const [cx, cy] = A.cara.centro;
  const tapa = manoCon(0, A.gestos.tapa);
  assert.ok(Math.hypot(tapa[0] - cx, tapa[1] - cy) < 8, `la mano no le tapa la cara: queda en ${tapa}`);
  // La que busca la luz entra en el cono del seguidor y se queda a la izquierda de la silla.
  const [bx, by] = enElRecinto(manoCon(1, A.gestos.busca));
  const t = (by - SEGUIDOR.arriba) / (SEGUIDOR.piso - SEGUIDOR.arriba);
  const borde = SEGUIDOR.x - SEGUIDOR.abreArriba - (SEGUIDOR.abreAbajo - SEGUIDOR.abreArriba) * t;
  assert.ok(bx > borde && bx < SILLA.x0, `la mano que busca la luz queda en ${bx}, el cono empieza en ${borde.toFixed(1)}`);
  // Cuando brilla, las dos manos arriba de la melena y abiertas para los costados.
  const [m0, m1] = [manoCon(0, A.gestos.brilla[0]), manoCon(1, A.gestos.brilla[1])];
  assert.ok(m0[1] < -190 && m1[1] < -190, 'cuando brilla no levanta las manos');
  assert.ok(m0[0] < A.hombros[0][0] - 60 && m1[0] > A.hombros[1][0] + 60, 'cuando brilla no abre los brazos');
});

test('los gestos suben, se sostienen y vuelven a la pose quieta', () => {
  for (const d of Object.values(DURA)) {
    assert.equal(avance(0, d), 0);
    assert.equal(avance(d[0] + d[1] / 2, d), 1);
    assert.equal(avance(total(d) + 0.01, d), 0);
    assert.ok(avance(d[0] + d[1] / 2, d, 0.14) === 1 && avance(0.1, d, 0.14) === 0, 'el antebrazo no llega tarde');
  }
});

/* ------------------------------------------------------------------
   La isla, contra un DOM de juguete
   ------------------------------------------------------------------ */

interface Juguete {
  attrs: Map<string, string>;
  dataset: Record<string, string>;
  getAttribute(n: string): string | null;
  setAttribute(n: string, v: string): void;
}

/** Arma un DOM de juguete con las partes y los destellos del títere, leídos del marcado. */
function deJuguete(marcado: string) {
  const elementos: Juguete[] = [];
  for (const m of marcado.matchAll(/<(?:g|path) ([^>]*data-(?:parte|chispa)="[^"]+"[^>]*)>/g)) {
    const attrs = new Map<string, string>();
    for (const a of m[1]!.matchAll(/([a-z-]+)="([^"]*)"/g)) attrs.set(a[1]!, a[2]!);
    const dataset: Record<string, string> = {};
    for (const [k, v] of attrs) if (k.startsWith('data-')) dataset[k.slice(5).replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = v;
    elementos.push({ attrs, dataset, getAttribute: (n) => attrs.get(n) ?? null, setAttribute: (n, v) => void attrs.set(n, v) });
  }
  const oyentes = new Map<string, (ev: { key?: string; preventDefault(): void }) => void>();
  const titere = {
    querySelectorAll: (sel: string) => elementos.filter((e) => (sel === '[data-parte]' ? 'parte' in e.dataset : 'chispa' in e.dataset)),
    addEventListener: (tipo: string, fn: (ev: { key?: string; preventDefault(): void }) => void) => void oyentes.set(tipo, fn),
  };
  const marco = { querySelector: () => titere };
  const parte = (n: string): Juguete => elementos.find((e) => e.dataset.parte === n)!;
  return { marco, elementos, parte, tocar: () => oyentes.get('click')!({ preventDefault() {} }) };
}

function escenario(quieto: boolean) {
  const reloj = { t: 0 };
  const dichos: Array<[string, number, number]> = [];
  return {
    reloj,
    dichos,
    esc: { hablar: (id: string, x: number, y: number) => void dichos.push([id, x, y]), quieto: () => quieto, reloj: () => reloj.t },
  };
}

/** Lo que vale una transformación de rotar, o 0 si no rota. */
const giro = (tr: string | null): number => Number(/rotate\((-?[\d.]+)/.exec(tr ?? '')?.[1] ?? 0);

test('sin la isla y con movimiento reducido es la misma pose: encorvada, la primera cara, los mismos destellos', () => {
  const marcado = adentroDelTitere();
  const antes = deJuguete(marcado);
  const despues = deJuguete(marcado);
  const { esc } = escenario(true);
  const vivo = armarBestiaPop!([despues.marco as unknown as SVGGElement], esc);
  vivo.mover(3.7, 0);
  // Lo que la isla escribe en la pose quieta es lo de `poseQuieta`, y eso es no mover nada.
  const quieta = escribir(poseQuieta(0));
  for (const [nombre, a] of Object.entries(quieta)) {
    const el = despues.parte(nombre);
    if (a.transform) {
      assert.equal(giro(el.getAttribute('transform')), 0, `${nombre} gira en la pose quieta`);
      assert.ok(!/^translate\(0 -?[1-9]/.test(el.getAttribute('transform')!), `${nombre} se corre en la pose quieta`);
      assert.ok(!/scale\(1 1\.0*[1-9]/.test(el.getAttribute('transform')!), `${nombre} respira en la pose quieta`);
    }
    if (a.opacity) assert.equal(Number(el.getAttribute('opacity')), Number(antes.parte(nombre).getAttribute('opacity') ?? 1), `${nombre} no tiene la opacidad del HTML`);
  }
  // Los destellos: los mismos prendidos, del mismo tamaño.
  for (const [i, el] of despues.elementos.entries()) {
    if (!('chispa' in el.dataset)) continue;
    const escala = (tr: string | null): number => Number(/scale\(([\d.]+)\)/.exec(tr ?? '')![1]);
    assert.equal(escala(el.getAttribute('transform')), escala(antes.elementos[i]!.getAttribute('transform')), `el destello ${el.dataset.chispa} cambia sin la isla`);
  }
  assert.equal(CHISPAS_QUIETAS.size > 0, true);
});

test('quieta, tocarla le hace decir el verso y le cambia la cara, y nada se mueve', () => {
  const j = deJuguete(adentroDelTitere());
  const { esc, dichos, reloj } = escenario(true);
  armarBestiaPop!([j.marco as unknown as SVGGElement], esc);
  reloj.t = 2;
  j.tocar();
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
  assert.ok(Number(j.parte('cara-1').getAttribute('opacity')) === 0, 'tocada quieta, sigue con la misma cara');
  for (const p of ['brazo-1', 'brazo-2', 'antebrazo-1', 'antebrazo-2']) assert.equal(giro(j.parte(p).getAttribute('transform')), 0, `${p} se movió quieta`);
});

test('viva: se cambia la cara sola, se la tapa, busca la luz, y tocada brilla con los brazos arriba', (ctx) => {
  // El azar de la isla, con semilla: el minuto que se mira es siempre el mismo.
  let semilla = 7;
  ctx.mock.method(Math, 'random', () => ((semilla = (semilla * 16807) % 2147483647) - 1) / 2147483646);
  const j = deJuguete(adentroDelTitere());
  const { esc, dichos, reloj } = escenario(false);
  const vivo = armarBestiaPop!([j.marco as unknown as SVGGElement], esc);
  const visto = { caras: new Set<number>(), tapa: false, busca: false, mezcla: false };
  let puesta = 0;
  let desde = 0;
  for (let t = 0; t < 70; t += 1 / 30) {
    vivo.mover(t, 1 / 30);
    const ops = Array.from({ length: A.caras }, (_, i) => Number(j.parte(`cara-${i + 1}`).getAttribute('opacity')));
    ops.forEach((o, i) => o > 0.99 && visto.caras.add(i));
    // La que más se ve: si cambia, que no sea un parpadeo de un cuadro, que vuelve a la de antes.
    const ahora = ops.indexOf(Math.max(...ops));
    if (ahora !== puesta) {
      assert.ok(t - desde > 1, `en ${t.toFixed(2)} la cara cambió dos veces en un segundo`);
      puesta = ahora;
      desde = t;
    }
    if (ops.filter((o) => o > 0.05).length === 2) visto.mezcla = true;
    // Siempre hay una cara puesta: nunca queda el hueco vacío.
    assert.ok(ops.reduce((a, b) => a + b, 0) > 0.95, `en ${t.toFixed(2)} no tiene cara`);
    if (giro(j.parte('antebrazo-1').getAttribute('transform')) < A.gestos.tapa.antebrazo * 0.9) visto.tapa = true;
    if (giro(j.parte('antebrazo-2').getAttribute('transform')) < A.gestos.busca.antebrazo * 0.9) visto.busca = true;
  }
  assert.ok(visto.caras.size >= 3, `en un minuto se puso ${visto.caras.size} caras`);
  assert.ok(visto.tapa, 'en un minuto no se tapó la cara');
  assert.ok(visto.busca, 'en un minuto no buscó la luz del seguidor');
  assert.ok(visto.mezcla, 'ninguna cara se fundió en otra');

  // Tocada: dice el verso, y en el medio del gesto tiene los brazos arriba, el halo lleno y todo prendido.
  reloj.t = 80;
  vivo.mover(80, 1 / 30);
  j.tocar();
  assert.equal(dichos.at(-1)![0], ID);
  const [hx, hy] = dichos.at(-1)!.slice(1) as [number, number];
  assert.ok(hy < enElRecinto([0, -200])[1] && Math.abs(hx - POP.x) < 40, 'el bocadillo no sale arriba de la melena');
  const medio = 80 + DURA.brilla[0] + DURA.brilla[1] / 2;
  for (let t = 80; t <= medio; t += 1 / 30) vivo.mover(t, 1 / 30);
  assert.ok(giro(j.parte('brazo-1').getAttribute('transform')) > A.gestos.brilla[0].brazo * 0.95, 'no levanta el brazo de adelante');
  assert.ok(giro(j.parte('brazo-2').getAttribute('transform')) < A.gestos.brilla[1].brazo * 0.95, 'no levanta el brazo de atrás');
  assert.ok(Number(j.parte('halo').getAttribute('opacity')) > 0.95, 'el halo no crece');
  const prendidas = j.elementos.filter((e) => 'chispa' in e.dataset && Number(/scale\(([\d.]+)\)/.exec(e.getAttribute('transform')!)![1]) > 0.4);
  assert.equal(prendidas.length, Object.values(CHISPAS).flat().length, 'cuando brilla no se prenden todos los destellos');
  // Y después vuelve a encorvarse.
  for (let t = medio; t < 80 + total(DURA.brilla) + 0.5; t += 1 / 30) vivo.mover(t, 1 / 30);
  assert.ok(Math.abs(giro(j.parte('brazo-1').getAttribute('transform'))) < 4, 'no vuelve a encorvarse');
});

test('en el galpón es un títere que se toca, del lado izquierdo de la silla, y la isla no se lleva el pincel', () => {
  const escena = escenaGalpon(nombres);
  assert.ok(escena.includes(`<g class="titere titere--bestia-pop" data-id="${ID}" role="button" tabindex="0" aria-label="La bestia pop"`));
  // Va en la capa de la figura: antes que la gente de adelante, que la tapa hasta los pies.
  assert.ok(escena.indexOf('titere--bestia-pop') < escena.indexOf('galpon-frente'), 'la bestia va delante de la gente');
  assert.ok(escena.indexOf('galpon-piso') < escena.indexOf('titere--bestia-pop'), 'la bestia va detrás del tablado');
  assert.equal(BESTIA_POP!.ancla, GALPON.bestiaPop.x);
  assert.ok(BESTIA_POP!.ancla < GALPON.silla.x);
  // El galpón ya no la pinta: ni el bulto encorvado ni los ojos.
  assert.ok(!readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8').includes('function bestiaPop('), 'el galpón todavía pinta a la bestia');
  const isla = readFileSync('src/scripts/bestiario/bestia-pop.ts', 'utf-8');
  const imports = [...isla.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
  assert.deepEqual(imports.filter((i) => /arte|pincel|aerografo|escenas|titeres/.test(i!)), [], 'la isla se lleva el pincel');
});

test('la ficha dice qué es del dibujo, y lo que cuenta lleva rótulo y ficha', () => {
  const b = datos.bestias.find((x) => x.id === ID)!;
  const palabras = b.estampa.split(/\s+/).length;
  assert.ok(palabras >= 45 && palabras <= 80, `la estampa tiene ${palabras} palabras`);
  assert.ok(/Gulp!/.test(b.estampa) && /En directo/.test(b.estampa), 'la estampa no dice de qué tapas sale');
  assert.ok(/dibujo/.test(b.estampa), 'la estampa no dice qué es del dibujo');
  for (const c of b.cuenta) assert.ok(['hecho', 'leyenda', 'testimonio'].includes(c.rotulo) && /^RES-\d+$/.test(c.fuente), 'una cuenta sin rótulo o sin ficha');
});
