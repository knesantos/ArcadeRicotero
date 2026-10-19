import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BUSCAPINA, FAJO_BUSCAPINA, PIEZAS_BUSCAPINA, RECORTES_BUSCAPINA, adentroDelTitere } from './arte-buscapina.ts';
import { BUSCA, BUSCA_ARMADO as A, SUELTA, enElAntebrazo, enElRecinto, manoCon, rotar, vuelo, type Gesto, type P } from './rig-buscapina.ts';
import { COSAS_DE_CYBERSIBERIA, CYBER, OJOS_DE_CYBERSIBERIA } from './rig-entornos.ts';
import { escenaCybersiberia } from './escenas-entornos.ts';
import { DURA, PAGA, armarBuscapina, avance, escribir, poseQuieta, titila, total } from '../../scripts/bestiario/buscapina.ts';

/**
 * El Capitán Buscapina (`D-73`, decimoquinta vuelta): el títere de papel de Cybersiberia, sentado en
 * la nieve frente a la tele, y lo que hace cuando lo tocan. Lo que lo junta con el resto del elenco lo
 * mira `elenco.test.ts`.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string; estampa: string; dibujo: { ropa?: string }; cuenta: Array<{ rotulo: string; fuente: string; quien?: string }> }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-capitan-buscapina';

function adentro([x, y]: P, pts: readonly P[]): boolean {
  let dentro = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i]!;
    const [xj, yj] = pts[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}

const R = RECORTES_BUSCAPINA;
const QUIETO: Gesto = { brazo: 0, antebrazo: 0 };

test('el capitán es un títere entero: cada parte que mueve la isla, con su imagen y su bisagra adentro', () => {
  const t = adentroDelTitere();
  const conImagen: Record<string, string> = {
    piernas: 'piernas', espalda: 'espalda', nieve: 'nieve', nuca: 'cabeza', vuelta: 'cabeza-vuelta', vaho: 'vaho', boleta: 'boleta',
    'brazo-1': 'brazo-1', 'antebrazo-1': 'antebrazo-1', 'brazo-2': 'brazo-2', 'antebrazo-2': 'antebrazo-2', luz: 'luz', 'luz-cancha': 'luz-cancha',
  };
  for (const [parte, pieza] of Object.entries(conImagen)) {
    assert.ok(t.includes(`data-parte="${parte}"`), `falta la parte ${parte}`);
    assert.ok(t.includes(`/bestiario/buscapina-${pieza}.webp`), `la parte ${parte} no tiene su imagen`);
  }
  assert.ok(t.includes('data-parte="cabeza"'), 'la cabeza no gira entera');
  assert.ok(PIEZAS_BUSCAPINA.length >= 5 && PIEZAS_BUSCAPINA.length <= 14, `${PIEZAS_BUSCAPINA.length} piezas`);
  for (const p of PIEZAS_BUSCAPINA) assert.ok(p.nombre.startsWith('buscapina-'), `${p.nombre} no lleva el prefijo`);
  // Las bisagras, adentro del recorte de las piezas que unen.
  assert.ok(adentro(A.asiento, R.espalda!) && adentro(A.asiento, R.monton!), 'el asiento no está en la espalda ni en el montón');
  assert.ok(adentro(A.cuello, R.espalda!) && adentro(A.cuello, R.cabeza!) && adentro(A.cuello, R['cabeza-vuelta']!), 'el cogote no une la cabeza con la espalda');
  for (const n of [0, 1] as const) {
    assert.ok(adentro(A.hombros[n], R[`brazo-${n + 1}`]!) && adentro(A.hombros[n], R.espalda!), `el hombro ${n + 1} no está en el brazo y la espalda`);
    assert.ok(adentro(A.codos[n], R[`brazo-${n + 1}`]!) && adentro(A.codos[n], R[`antebrazo-${n + 1}`]!), `el codo ${n + 1} no une sus dos piezas`);
    assert.ok(adentro(A.manos[n], R[`antebrazo-${n + 1}`]!), `la mano ${n + 1} no está en su antebrazo`);
  }
  // Las dos cabezas ocupan el mismo lugar: el ojo es de la vuelta, la boca está donde sale el vaho.
  assert.ok(adentro(A.ojo, R['cabeza-vuelta']!), 'el ojo se sale de la cabeza vuelta');
  assert.ok(adentro(A.craneo.centro, R.cabeza!) && adentro(A.craneo.centro, R['cabeza-vuelta']!), 'las dos cabezas no están en el mismo lugar');
});

test('está sentado en la nieve, delante de la tele, y entra entero en la escena', () => {
  // El asiento es la nieve: la capa y el montón bajan hasta ahí, y nada flota.
  const fondo = Math.max(...R.capa!.map((p) => p[1]));
  assert.ok(fondo > 0 && fondo < 40, `la capa llega a ${fondo.toFixed(0)}`);
  const [, piso] = enElRecinto([0, 0]);
  assert.ok(piso > CYBER.tele.piso + 60 && piso < CYBER.puntos.y - 30, 'no está sentado en la nieve de delante de la tele');
  assert.ok(Math.abs(BUSCA.x - CYBER.tele.x) < 30, 'no está frente a la tele');
  // Sentado, con la gorra, mide lo que una persona sentada al lado de los demás: entre 80 y 110.
  const gorra = -Math.min(...R.cabeza!.map((p) => p[1])) + 26;
  const alto = gorra * BUSCA.escala;
  assert.ok(alto > 80 && alto < 110, `sentado mide ${alto.toFixed(0)}`);
  for (const p of PIEZAS_BUSCAPINA) {
    const [x, y, w, h] = p.caja;
    if (p.nombre === 'buscapina-boleta' || p.nombre === 'buscapina-vaho') continue;
    const [x0, y0] = enElRecinto([x, y]);
    const [x1, y1] = enElRecinto([x + w, y + h]);
    assert.ok(x0 >= 0 && x1 <= 900 && y0 >= 0 && y1 <= 640, `${p.nombre} se sale de la escena`);
  }
});

/** Todos los puntos del capitán con una pose de brazos, en el recinto. */
function puntos(b0: Gesto, b1: Gesto, vuelta = false): P[] {
  const lista: P[] = [
    ...R.espalda!, ...R.monton!, ...R.rodilla!,
    ...(vuelta ? R['cabeza-vuelta']! : R.cabeza!),
    ...R['brazo-1']!.map((p) => rotar(p, A.hombros[0], b0.brazo)), ...R['antebrazo-1']!.map((p) => enElAntebrazo(0, p, b0)),
    ...R['brazo-2']!.map((p) => rotar(p, A.hombros[1], b1.brazo)), ...R['antebrazo-2']!.map((p) => enElAntebrazo(1, p, b1)),
  ];
  return lista.map(enElRecinto);
}

test('no le tapa el toque a nadie: ni a la tele, ni al Alien Duce, ni a los ojos de al lado', () => {
  const toques: Array<[string, P, number]> = [
    ['el-alien-duce', [COSAS_DE_CYBERSIBERIA['el-alien-duce']![0], COSAS_DE_CYBERSIBERIA['el-alien-duce']![1]], COSAS_DE_CYBERSIBERIA['el-alien-duce']![2]],
    ['la-divina-tv-fuhrer', [COSAS_DE_CYBERSIBERIA['la-divina-tv-fuhrer']![0], COSAS_DE_CYBERSIBERIA['la-divina-tv-fuhrer']![1]], COSAS_DE_CYBERSIBERIA['la-divina-tv-fuhrer']![2]],
    ...Object.entries(OJOS_DE_CYBERSIBERIA).map(([id, [x, y]]) => [id, [x, y], 26] as [string, P, number]),
  ];
  const poses: Array<[string, Gesto, Gesto, boolean]> = [
    ['quieto', QUIETO, QUIETO, false],
    ['paga', A.gestos.paga, QUIETO, true],
    ['suelta', SUELTA, QUIETO, true],
    ['canal', QUIETO, A.gestos.canal, false],
    ['costado', QUIETO, A.gestos.costado, false],
  ];
  for (const [nombre, b0, b1, vuelta] of poses) {
    for (const [id, [cx, cy], r] of toques) {
      const encima = puntos(b0, b1, vuelta).filter(([x, y]) => Math.hypot(x - cx, y - cy) < r);
      assert.deepEqual(encima, [], `${nombre}: se mete en el toque de ${id}`);
    }
  }
  // La boleta cae en la nieve, adentro de la escena y lejos de los toques de los demás.
  const cae = enElRecinto(vuelo(1).p);
  assert.ok(cae[0] > 0 && cae[1] < CYBER.puntos.y - 10, 'la boleta cae fuera de la nieve de adelante');
  for (const [id, [cx, cy], r] of toques) assert.ok(Math.hypot(cae[0] - cx, cae[1] - cy) > r + 6, `la boleta cae en el toque de ${id}`);
});

test('los gestos llegan adonde tienen que llegar', () => {
  // Paga: la mano de las boletas pasa por encima del hombro, del lado de afuera de la cabeza.
  const paga = manoCon(0, A.gestos.paga);
  assert.ok(paga[1] < A.hombros[0][1] - 20, `la mano no pasa por encima del hombro: queda en ${paga}`);
  assert.ok(paga[0] < A.craneo.centro[0] - A.craneo.radio[0], 'la mano se le mete en la cara');
  // De ahí sale la boleta, y cae de nuestro lado de la capa, en la nieve.
  const sale = vuelo(0).p;
  assert.ok(Math.hypot(sale[0] - manoCon(0, SUELTA)[0], sale[1] - manoCon(0, SUELTA)[1]) < 0.01, 'la boleta no sale de la mano');
  const capaDeAdelante = Math.max(...R.capa!.filter((p) => p[0] < -80).map((p) => p[1]));
  assert.ok(vuelo(1).p[1] > capaDeAdelante, 'la boleta cae arriba de la capa y no en la nieve');
  assert.ok(Math.min(...[0.2, 0.4, 0.6].map((k) => vuelo(k).p[1])) < sale[1], 'la boleta no sube antes de caer');
  // Canal: el control sube de la rodilla y apunta para arriba.
  const canal = manoCon(1, A.gestos.canal);
  assert.ok(canal[1] < A.rodilla[1] - 14, `el control no sube: queda en ${canal}`);
  // Costado: la mano se va debajo de las costillas, pegada al costado derecho.
  const costado = manoCon(1, A.gestos.costado);
  const derecha = Math.max(...R.espalda!.filter((p) => Math.abs(p[1] - costado[1]) < 12).map((p) => p[0]));
  assert.ok(Math.abs(costado[0] - derecha) < 10 && costado[1] < -50 && costado[1] > -90, `la mano no llega al costado: queda en ${costado}`);
  // Quieto: la izquierda tapa las boletas, y la derecha cuelga del otro lado de la rodilla.
  assert.ok(Math.hypot(A.manos[0][0] - FAJO_BUSCAPINA[0], A.manos[0][1] - FAJO_BUSCAPINA[1]) < 10, 'la mano no está sobre las boletas');
  assert.ok(A.manos[1][0] > A.rodilla[0] && Math.abs(A.manos[1][1] - A.rodilla[1]) < 14, 'el control no cuelga de la rodilla');
});

test('los gestos suben, se sostienen y vuelven, y la tele titila sin apagarse', () => {
  for (const d of Object.values(DURA)) {
    assert.equal(avance(0, d), 0);
    assert.equal(avance(d[0] + d[1] / 2, d), 1);
    assert.equal(avance(total(d) + 0.01, d), 0);
  }
  let min = 1;
  let max = 0;
  for (let t = 0; t < 120; t += 0.05) {
    min = Math.min(min, 0.6 + titila(t));
    max = Math.max(max, 0.6 + titila(t));
  }
  assert.ok(min > 0.2 && max < 0.85 && max - min > 0.2, `la luz va de ${min.toFixed(2)} a ${max.toFixed(2)}`);
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

function deJuguete(marcado: string) {
  const elementos: Juguete[] = [];
  for (const m of marcado.matchAll(/<g ([^>]*data-parte="[^"]+"[^>]*)>/g)) {
    const attrs = new Map<string, string>();
    for (const a of m[1]!.matchAll(/([a-z-]+)="([^"]*)"/g)) attrs.set(a[1]!, a[2]!);
    const dataset: Record<string, string> = {};
    for (const [k, v] of attrs) if (k.startsWith('data-')) dataset[k.slice(5)] = v;
    elementos.push({ attrs, dataset, getAttribute: (n) => attrs.get(n) ?? null, setAttribute: (n, v) => void attrs.set(n, v) });
  }
  const oyentes = new Map<string, (ev: { key?: string; preventDefault(): void }) => void>();
  const titere = {
    querySelectorAll: () => elementos,
    addEventListener: (tipo: string, fn: (ev: { key?: string; preventDefault(): void }) => void) => void oyentes.set(tipo, fn),
  };
  const marco = { querySelector: () => titere };
  const parte = (n: string): Juguete => elementos.find((e) => e.dataset.parte === n)!;
  return { marco, elementos, parte, tocar: () => oyentes.get('click')!({ preventDefault() {} }) };
}

function escenario(quieto: boolean) {
  const reloj = { t: 0 };
  const dichos: Array<[string, number, number]> = [];
  return { reloj, dichos, esc: { hablar: (id: string, x: number, y: number) => void dichos.push([id, x, y]), quieto: () => quieto, reloj: () => reloj.t } };
}

const giro = (tr: string | null): number => Number(/rotate\((-?[\d.]+)/.exec(tr ?? '')?.[1] ?? 0);
const opacidad = (j: Juguete): number => Number(j.getAttribute('opacity') ?? 1);

test('sin la isla y con movimiento reducido es la misma pose: mirando la tele, sin boleta ni vaho', () => {
  const marcado = adentroDelTitere();
  const antes = deJuguete(marcado);
  const despues = deJuguete(marcado);
  const { esc } = escenario(true);
  const vivo = armarBuscapina!([despues.marco as unknown as SVGGElement], esc);
  vivo.mover(5.3, 0);
  const quieta = escribir(poseQuieta(0));
  for (const [nombre, a] of Object.entries(quieta)) {
    const el = despues.parte(nombre);
    assert.ok(el, `la isla escribe en ${nombre}, que no está en el títere`);
    if (a.transform && !['vaho', 'boleta'].includes(nombre)) assert.equal(giro(el.getAttribute('transform')), 0, `${nombre} gira en la pose quieta`);
    if (a.opacity) assert.equal(opacidad(el), opacidad(antes.parte(nombre)), `${nombre} no tiene la opacidad del HTML`);
  }
  // Sin JavaScript mira la tele: la cabeza vuelta, la boleta, el vaho y el partido, apagados.
  for (const p of ['vuelta', 'boleta', 'vaho', 'luz-cancha']) assert.equal(opacidad(antes.parte(p)), 0, `${p} se ve sin la isla`);
  assert.equal(opacidad(antes.parte('nuca')), 1);
});

test('quieto, tocarlo le hace decir el verso y lo deja mirándote, sin que nada se mueva', () => {
  const j = deJuguete(adentroDelTitere());
  const { esc, dichos, reloj } = escenario(true);
  armarBuscapina!([j.marco as unknown as SVGGElement], esc);
  reloj.t = 2;
  j.tocar();
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
  assert.equal(opacidad(j.parte('vuelta')), 1, 'tocado quieto, no te mira');
  assert.equal(opacidad(j.parte('boleta')), 0, 'quieto tiró la boleta');
  for (const p of ['brazo-1', 'brazo-2', 'antebrazo-1', 'antebrazo-2', 'espalda']) assert.equal(giro(j.parte(p).getAttribute('transform')), 0, `${p} se movió quieto`);
  reloj.t = 4;
  j.tocar();
  assert.equal(opacidad(j.parte('vuelta')), 0, 'tocado otra vez, no vuelve a la tele');
});

test('vivo: respira con vaho, cambia al partido, se agarra el costado, tirita, y tocado salda la deuda', (ctx) => {
  let semilla = 11;
  ctx.mock.method(Math, 'random', () => ((semilla = (semilla * 16807) % 2147483647) - 1) / 2147483646);
  const j = deJuguete(adentroDelTitere());
  const { esc, dichos, reloj } = escenario(false);
  const vivo = armarBuscapina!([j.marco as unknown as SVGGElement], esc);
  const visto = { vaho: 0, partido: false, tele: false, costado: false, tirita: false, luces: new Set<number>() };
  let nieveAntes = Number(j.parte('nieve').getAttribute('opacity'));
  for (let t = 1 / 30; t < 100; t += 1 / 30) {
    vivo.mover(t, 1 / 30);
    if (opacidad(j.parte('vaho')) > 0.4) visto.vaho++;
    if (opacidad(j.parte('luz-cancha')) > 0.5) visto.partido = true;
    if (visto.partido && opacidad(j.parte('luz-cancha')) === 0 && opacidad(j.parte('luz')) > 0.4) visto.tele = true;
    if (giro(j.parte('antebrazo-2').getAttribute('transform')) < A.gestos.costado.antebrazo * 0.9) visto.costado = true;
    const nieve = Number(j.parte('nieve').getAttribute('opacity'));
    if (nieve < nieveAntes - 0.05) visto.tirita = true;
    nieveAntes = nieve;
    visto.luces.add(Math.round(opacidad(j.parte('luz')) * 20));
    assert.equal(opacidad(j.parte('vuelta')), 0, `en ${t.toFixed(1)} se dio vuelta sin que lo toquen`);
  }
  assert.ok(visto.vaho > 60, 'no le sale vaho');
  assert.ok(visto.partido, 'en cien segundos no puso el partido');
  assert.ok(visto.tele, 'nunca volvió a la tele de siempre');
  assert.ok(visto.costado, 'en cien segundos no se agarró el costado');
  assert.ok(visto.tirita, 'en cien segundos no tiritó ni se sacudió la nieve');
  assert.ok(visto.luces.size > 5, 'la luz de la tele no titila');

  // Tocado: dice el verso con el bocadillo arriba de la gorra, se da vuelta, tira la boleta y vuelve.
  const t0 = 110;
  reloj.t = t0;
  vivo.mover(t0, 1 / 30);
  j.tocar();
  assert.equal(dichos.at(-1)![0], ID);
  const [, hx, hy] = dichos.at(-1)!;
  assert.ok(hy < enElRecinto([0, -195])[1] && Math.abs(hx - BUSCA.x) < 20, 'el bocadillo no sale arriba de la gorra');
  let arriba = false;
  let mira = false;
  let vuela = false;
  for (let t = t0; t < t0 + PAGA.suelta + PAGA.vuela + 0.2; t += 1 / 30) {
    vivo.mover(t, 1 / 30);
    if (opacidad(j.parte('vuelta')) > 0.95) mira = true;
    if (giro(j.parte('brazo-1').getAttribute('transform')) > A.gestos.paga.brazo * 0.9) arriba = true;
    const by = Number(/translate\(-?[\d.]+ (-?[\d.]+)\)/.exec(j.parte('boleta').getAttribute('transform')!)![1]);
    if (t > t0 + PAGA.suelta + 0.1 && opacidad(j.parte('boleta')) > 0.9 && by < A.hombros[0][1]) vuela = true;
    // Desde que la agarra hasta que cae, la boleta se ve siempre: en la mano o en el aire.
    if (t > t0 + PAGA.sube[0] + 0.05) assert.ok(opacidad(j.parte('boleta')) > 0, `en ${(t - t0).toFixed(2)} la boleta no está`);
  }
  assert.ok(mira, 'tocado, no se da vuelta a mirarte');
  assert.ok(arriba, 'tocado, no levanta la mano de las boletas');
  assert.ok(vuela, 'la boleta no vuela por encima del hombro');
  // La boleta queda en la nieve, de nuestro lado, y la nieve la va tapando.
  const caida = /translate\((-?[\d.]+) (-?[\d.]+)\)/.exec(j.parte('boleta').getAttribute('transform')!)!.slice(1).map(Number);
  assert.ok(Math.hypot(caida[0]! - A.boleta.cae[0], caida[1]! - A.boleta.cae[1]) < 1, `la boleta no cayó donde tenía que caer: ${caida}`);
  for (let t = t0 + PAGA.suelta + PAGA.vuela + 0.2; t < t0 + 20; t += 1 / 30) vivo.mover(t, 1 / 30);
  assert.equal(opacidad(j.parte('vuelta')), 0, 'no vuelve a mirar la tele');
  assert.ok(Math.abs(giro(j.parte('brazo-1').getAttribute('transform'))) < 2, 'no vuelve a apoyar la mano');
  assert.ok(opacidad(j.parte('boleta')) < 0.05, 'la nieve no tapa la boleta');
});

test('en Cybersiberia es un títere que se toca, delante de la tele, y ya no es una silueta pintada', () => {
  const escena = escenaCybersiberia(nombres);
  assert.ok(escena.includes(`<g class="titere titere--buscapina" data-id="${ID}" role="button" tabindex="0" aria-label="El Capitán Buscapina"`));
  assert.ok(escena.indexOf('cyber-piso') < escena.indexOf('titere--buscapina'), 'el capitán va detrás de la tele');
  assert.ok(escena.indexOf('titere--buscapina') < escena.indexOf('cyber-frente'), 'el capitán va delante de lo de adelante');
  assert.equal(BUSCAPINA!.ancla, BUSCA.x);
  // El piso ya no lo pinta, y la isla no se lleva el aerógrafo.
  assert.ok(!readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8').includes('const buscapina ='), 'Cybersiberia todavía pinta al capitán');
  const isla = readFileSync('src/scripts/bestiario/buscapina.ts', 'utf-8');
  const imports = [...isla.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
  assert.deepEqual(imports.filter((i) => /arte|pincel|aerografo|escenas|titeres/.test(i!)), [], 'la isla se lleva el aerógrafo');
});

test('las tintas son suyas y medidas, y la ficha dice qué es del dibujo', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = /⟨el Capitan Buscapina⟩([\s\S]*?)⟨\/el Capitan Buscapina⟩/.exec(tokens)![1]!;
  const arte = readFileSync('src/lib/bestiario/arte-buscapina.ts', 'utf-8');
  const usadas = new Set([...arte.matchAll(/var\((--bestia-buscapina-[a-z-]+)\)/g)].map((m) => m[1]!));
  assert.ok(usadas.size >= 5);
  for (const u of usadas) assert.match(bloque, new RegExp(`${u}: #[0-9a-f]{6}; /\\* [^*]+ \\*/`), `${u} no está en su bloque, con de dónde sale`);
  assert.ok(!/#[0-9a-fA-F]{3,8}\b/.test(arte), 'hay un hex en el dibujo');
  const b = datos.bestias.find((x) => x.id === ID)!;
  const palabras = b.estampa.split(/\s+/).length;
  assert.ok(palabras >= 45 && palabras <= 80, `la estampa tiene ${palabras} palabras`);
  assert.ok(/Último bondi/.test(b.estampa) && /del dibujo/.test(b.estampa) && /letra/.test(b.estampa), 'la estampa no dice qué es del dibujo y qué de la letra');
  assert.notEqual(b.dibujo.ropa, 'uniforme', 'el plano lo sigue vistiendo');
  const fichas = readFileSync('Docs/INVESTIGACION/INV-20-fuentes-primarias.md', 'utf-8');
  for (const c of b.cuenta) {
    assert.ok(['hecho', 'leyenda', 'testimonio'].includes(c.rotulo) && /^RES-\d+$/.test(c.fuente), 'una cuenta sin rótulo o sin ficha');
    assert.ok(fichas.includes(`## ${c.fuente} `), `${c.fuente} no está fichada`);
    if (c.rotulo === 'testimonio') assert.ok(c.quien, 'un testimonio sin quién lo contó');
  }
});
