import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { CARA, CUERNOS_CARA, CUERNOS_NUCA, FRAC, PIEZAS_DIABLO, PUNTA_DE_LA_FLECHA, RETRATO } from './arte-diablo.ts';
import {
  DIABLO, DIABLO_ARMADO as A, GESTOS, PALPA, VERSO, alcanzar, brazoAlzado, chorro, enElRecinto, manoALaVista, palma, palpa, palpaEn, poseQuieta, rotar, transformes, vapor,
  type P, type Pose,
} from './rig-diablo.ts';
import { VECINOS_DEL_INFIERNO } from './escenas.ts';
import { armarDiabloCon, barridoMaximo } from '../../scripts/bestiario/diablo.ts';

/**
 * El diablo que mea en todas partes (`D-73`, decimoquinta vuelta): que sea un títere entero, que pise
 * el damero, que el chorro caiga en el piso y no deje nada, que no le tape la cara a nadie del infierno,
 * que se palpe la pelada de verdad, y que la pose de la isla sea la del HTML.
 */

const ID = 'el-diablo-que-mea-en-todas-partes';
const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; cuenta?: Array<{ rotulo: string; fuente: string }> }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const figura = capasDe('el-infierno', 'figura', nombres);
const atras = capasDe('el-infierno', 'atras', nombres);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_DIABLO.find((p) => p.nombre === `diablo-${nombre}`)!.caja;
const adentro = (nombre: string, [x, y]: P): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const roto = /NaN|undefined|Infinity/;

/* ------------------------------------------------------------------
   La geometría de una pose, llevada al recinto, para medir
   ------------------------------------------------------------------ */

/** Los puntos de más afuera del diablo en una pose, en el recinto: los cuernos, el frac, el brazo, la cola, las pezuñas. */
function puntos(p: Pose): P[] {
  const [cx, cy] = A.cadera;
  const cuerpo = (q: P): P => rotar([q[0], q[1] + p.bob], [cx, cy + p.bob], p.inclina);
  const out: P[] = [];
  // La cabeza: la nuca o la cara vuelta, con sus cuernos.
  const cabeza = p.vuelta > 0.5 ? [...CARA.map(([x, y]) => [x, y] as P), ...CUERNOS_CARA.map((c) => c[c.length - 1]!)] : [...CUERNOS_NUCA.map((c) => c[c.length - 1]!), [-17.6, -206] as P, [23.6, -219.4] as P];
  for (const q of cabeza) out.push(cuerpo(rotar(q, A.cuello, p.vuelta > 0.5 ? 0 : p.cabeza)));
  for (const [x, y] of FRAC) out.push(cuerpo([x, y]));
  // El brazo derecho: el codo y la palma.
  const s = A.hombros[1];
  const codo = rotar([s[0], s[1] + A.largos.brazo], s, p.brazo.arriba);
  out.push(cuerpo(codo), cuerpo(palma(p.brazo.arriba, p.brazo.abajo)));
  // El izquierdo, colgando del otro lado.
  const i = A.hombros[0];
  out.push(cuerpo(rotar([i[0] - 7, i[1] + 98], i, p.izq)));
  // La punta de la flecha de la cola.
  out.push(cuerpo(rotar(rotar(PUNTA_DE_LA_FLECHA, A.codoDeLaCola, p.punta), A.cola, p.cola)));
  // Las pezuñas.
  A.caderas.forEach((c, n) => out.push(rotar([c[0], c[1] + A.pierna], c, p.piernas[n]!)));
  return out.map((q) => enElRecinto(q, p.x));
}

const ESPERA = (x: number, cola: number = GESTOS.espera.cola, punta: number = GESTOS.espera.punta): Pose => ({
  ...poseQuieta(),
  x,
  piernas: GESTOS.espera.piernas,
  brazo: { ...GESTOS.espera.brazo, ve: 1 },
  izq: GESTOS.espera.izq,
  cabeza: 0,
  cola,
  punta,
});

/** Las poses que puede tomar, en cada pared: quieto, meando, pescado, palpándose la nuca, con la cola en los extremos. */
function todasLasPoses(): Pose[] {
  const poses: Pose[] = [];
  for (const x of DIABLO.lugares) {
    for (const pescado of [false, true]) poses.push({ ...poseQuieta(pescado), x });
    poses.push({ ...ESPERA(x), brazo: { ...brazoAlzado(GESTOS.espera.brazo, palpaEn(0, 3), 1), ve: 1 } });
    for (let k = 0.1; k < 1; k += 0.1) {
      poses.push({ ...ESPERA(x), brazo: { ...brazoAlzado(GESTOS.mea.brazo, palpaEn(1), k), ve: 1 } });
      poses.push({ ...ESPERA(x), brazo: { ...brazoAlzado(GESTOS.espera.brazo, palpaEn(0, 3), k), ve: 1 } });
    }
    for (const s of [-1, 1]) {
      poses.push(ESPERA(x, GESTOS.espera.cola + 5 * s, GESTOS.espera.punta + 9 * s));
      poses.push({ ...poseQuieta(), x, cola: GESTOS.mea.cola + 5 * s, punta: GESTOS.mea.punta + 9 * s + (s > 0 ? 6 : 0) });
      poses.push({ ...poseQuieta(true), x, cola: 4, punta: 18 + 14 * s });
    }
  }
  return poses;
}

test('el diablo es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--diablo" data-id="el-diablo-que-mea-en-todas-partes" role="button" tabindex="0" aria-label="El diablo que mea en todas partes">/);
  for (const p of ['entero', 'cuerpo', 'pierna-1', 'pierna-2', 'brazo', 'antebrazo', 'brazo-izq', 'nuca', 'vuelta', 'pupila', 'parpado', 'cola', 'punta']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al diablo le falta ${p}`);
  }
  // Lo de atrás: el piso, el chorro, el brillo donde cae, el vapor y las chispas. No se toca.
  for (const p of ['suelo', 'chorro', 'chorro-halo', 'charco', 'vapor-1', 'vapor-2', 'vapor-3', 'chispa-1', 'chispa-2', 'chispa-3']) {
    assert.ok(atras.includes(`data-parte="${p}"`), `al piso del diablo le falta ${p}`);
  }
  assert.doesNotMatch(atras, /data-id=/, 'lo de atrás se puede tocar');
  assert.match(atras, /pointer-events="none"/);
  const imagenes = new Set([...(figura + atras).matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_DIABLO.map((p) => p.nombre).sort(), 'usa piezas que no se imprimen, o le sobra una');
  assert.ok(PIEZAS_DIABLO.length >= 5 && PIEZAS_DIABLO.length <= 14, `${PIEZAS_DIABLO.length} piezas`);
  // Las bisagras: cada pivote cae adentro de las dos piezas que une.
  const [h1, h2] = A.hombros;
  assert.ok(adentro('frac', h2) && adentro('brazo', h2), 'el hombro derecho no está en el hombro');
  assert.ok(adentro('frac', h1) && adentro('brazo-izq', h1), 'el hombro izquierdo no está en el hombro');
  const codo: P = [h2[0], h2[1] + A.largos.brazo];
  assert.ok(adentro('brazo', codo) && adentro('antebrazo', codo), 'el codo no une las dos mitades del brazo');
  for (const n of [1, 2] as const) assert.ok(adentro('frac', A.caderas[n - 1]) && adentro(`pierna-${n}`, A.caderas[n - 1]), `la cadera ${n} no está debajo del frac`);
  assert.ok(adentro('frac', A.cuello) && adentro('nuca', A.cuello) && adentro('vuelta', A.cuello), 'la cabeza gira en el aire');
  assert.ok(adentro('frac', A.cola) && adentro('cola', A.cola), 'la cola no sale de la abertura del frac');
  assert.ok(adentro('cola', A.codoDeLaCola) && adentro('punta', A.codoDeLaCola), 'la punta no sigue a la cola');
  assert.ok(adentro('punta', PUNTA_DE_LA_FLECHA), 'la flecha se sale de su pieza');
  assert.ok(adentro('vuelta', A.ojo.centro), 'el ojo se salió de la cara');
  assert.ok(adentro('nuca', A.pelada) && adentro('nuca', PALPA.nuca) && adentro('vuelta', PALPA.vuelta), 'la pelada no está en la cabeza');
  assert.ok(adentro('antebrazo', palma(0, 0)), 'la palma no está en la mano');
  for (const p of PIEZAS_DIABLO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  assert.doesNotMatch(figura + atras, roto);
});

test('las tintas del diablo están en su bloque de tokens.css, y lo que dibuja la página, en el de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el diablo que mea⟩'), tokens.indexOf('⟨/el diablo que mea⟩'));
  const usadas = new Set(PIEZAS_DIABLO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-diablo-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 10, `usa ${usadas.size} tintas suyas`);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del diablo, o no dice de dónde salió`);
  // Ninguna tinta de otro personaje del elenco.
  for (const p of PIEZAS_DIABLO) assert.doesNotMatch(p.dibujo, /--bestia-(?!diablo-|ojo-blanco)[a-z]+-/, `${p.nombre} usa una tinta de otro`);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el diablo que mea⟩ */'), sitio.indexOf('/* ⟨/el diablo que mea⟩ */'));
  for (const clase of new Set([...(figura + atras).matchAll(/class="(bt-diablo-[a-z]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase} {`), `${clase} no está en su bloque de sitio.css`);
  assert.doesNotMatch(suyo, /#[0-9a-fA-F]{3,8}\b/, 'un hex en el bloque de sitio.css');
});

test('pisa el damero, contra la pared de fuego, del tamaño de la puerta del salón', () => {
  for (const p of [poseQuieta(), poseQuieta(true), ESPERA(DIABLO.x)]) {
    A.caderas.forEach((c, n) => {
      const [, y] = rotar([c[0], c[1] + A.pierna], c, p.piernas[n]!);
      assert.ok(y > -0.6 && y < 0.2, `la pezuña ${n + 1} no pisa: queda en ${y.toFixed(2)}`);
    });
  }
  // El piso: delante de la pared (la base del fuego va por 340) y detrás de la piedra de Luzbelito (418).
  assert.ok(DIABLO.piso > 352 && DIABLO.piso < 418);
  // De las pezuñas a la pelada mide lo que la puerta del salón (114), un poco más porque está más adelante.
  const alto = -A.pelada[1] * DIABLO.escala;
  assert.ok(alto > 114 && alto < 150, `mide ${alto.toFixed(0)}`);
});

test('el chorro sale de delante de él, cae en el damero delante de la pared, y nunca en el busto de Luzbelito', () => {
  for (const x of DIABLO.lugares) {
    const tope = barridoMaximo(x);
    for (let k = 0.05; k <= 1.001; k += 0.05) {
      for (let b = 0; b <= tope + 1e-9; b += Math.max(0.05, tope / 10)) {
        const { sale, cae } = chorro(k, b);
        const [rx, ry] = enElRecinto(cae, x);
        assert.ok(rx <= DIABLO.hastaX + 0.01, `en ${x} el chorro cae en ${rx.toFixed(0)}, en el busto`);
        assert.ok(ry > 340 && ry < DIABLO.piso, `en ${x} el chorro cae fuera del piso (${ry.toFixed(0)})`);
        // Cae del lado del chorro, nunca encima de las pezuñas.
        const pezuna = A.caderas[1][0] + 8;
        assert.ok(cae[0] > pezuna + 4, `el chorro le cae en la pezuña (${cae[0].toFixed(0)})`);
        assert.ok(cae[1] <= sale[1] + 100 && cae[1] < 0, 'el chorro cae debajo del piso');
      }
    }
  }
  // Cuanta más fuerza, más lejos (más arriba en la pantalla): con la que se acaba, cae cerca.
  assert.ok(chorro(1, 0.5).cae[1] < chorro(0.3, 0.5).cae[1]);
  assert.ok(chorro(1, 1).cae[0] > chorro(1, 0).cae[0], 'el barrido no lo pasea');
  // El vapor sube y se va del todo: ni espuma ni nada que dure.
  const de: P = [100, -40];
  assert.equal(vapor(de, 1, 0).o, 0);
  assert.equal(vapor(de, 0, 0).o, 0);
  assert.ok(vapor(de, 0.5, 0).y < de[1] - 20 && vapor(de, 0.3, 0).o > 0.4);
});

test('no le tapa la cara a nadie del infierno, y entra en la escena, en cualquier pared y en cualquier gesto', () => {
  const otros = Object.entries(VECINOS_DEL_INFIERNO).filter(([id]) => id !== ID).map(([, [x, y]]) => [x, y] as P);
  for (const p of todasLasPoses()) {
    const ps = puntos(p);
    const xs = ps.map((q) => q[0]);
    const ys = ps.map((q) => q[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    assert.ok(x0 > 0 && x1 < 900 && y0 > 0 && y1 < 640, 'se sale de la escena');
    for (const [ox, oy] of otros) assert.ok(!(ox > x0 - 26 && ox < x1 + 26 && oy > y0 - 26 && oy < y1 + 26), `en ${p.x} tapa a los ojos de ${ox}, ${oy}`);
    // El busto de Luzbelito, lo que se ve, empieza en 400: ni el codo ni la cola se meten.
    assert.ok(x1 < 400, `en ${p.x} se mete en Luzbelito (${x1.toFixed(0)})`);
  }
  // El verso se dice arriba de los cuernos.
  const [vx, vy] = VERSO(DIABLO.x);
  const cuernos = Math.min(...puntos(poseQuieta()).map((q) => q[1]));
  assert.ok(vx === DIABLO.x && vy < cuernos + 4, 'el bocadillo le tapa los cuernos');
});

test('se palpa la pelada de verdad: la palma llega, de espaldas y vuelto, y el brazo no pasa por otra pose', () => {
  for (const v of [0, 1]) {
    const brazo = brazoAlzado(GESTOS.mea.brazo, palpaEn(v), 1);
    const llega = palma(brazo.arriba, brazo.abajo);
    const meta = palpaEn(v);
    assert.ok(Math.hypot(llega[0] - meta[0], llega[1] - meta[1]) < 0.6, `no llega a la pelada (vuelta ${v})`);
  }
  assert.deepEqual(palpa(1), brazoAlzado(GESTOS.espera.brazo, palpaEn(1), 1), 'arriba, el brazo no depende de dónde salió');
  // En el camino: el codo sube por afuera, sin saltos y sin pasar por encima de la cabeza, y la mano
  // no se va lejos del cuerpo (el brazo estirado es otro gesto, y se le metería a Luzbelito).
  for (const reposo of [GESTOS.mea.brazo, GESTOS.espera.brazo]) {
    for (const v of [0, 1]) {
      let antes: P | null = null;
      for (let k = 0.02; k <= 1.0001; k += 0.02) {
        const b = brazoAlzado(reposo, palpaEn(v), k);
        const codo = rotar([A.hombros[1][0], A.hombros[1][1] + A.largos.brazo], A.hombros[1], b.arriba);
        assert.ok(codo[0] > A.hombros[1][0] - 2, `a ${k.toFixed(2)} el codo se mete adentro`);
        assert.ok(codo[1] > A.pelada[1], `a ${k.toFixed(2)} el codo pasa por arriba de la cabeza`);
        if (antes) assert.ok(Math.hypot(codo[0] - antes[0], codo[1] - antes[1]) < 6, `a ${k.toFixed(2)} el codo salta`);
        antes = codo;
        assert.ok(palma(b.arriba, b.abajo)[0] < 66, `a ${k.toFixed(2)} la mano se va lejos del cuerpo`);
      }
    }
  }
  // La mano asoma recién cuando pasa por encima del hombro: antes está delante del pecho.
  assert.equal(manoALaVista(GESTOS.mea.brazo.arriba, GESTOS.mea.brazo.abajo), false);
  assert.equal(manoALaVista(palpa(1).arriba, palpa(1).abajo), true);
  // Sin alzar, es el reposo tal cual: la pose de mear no se mueve.
  assert.deepEqual(brazoAlzado(GESTOS.mea.brazo, palpaEn(0), 0), GESTOS.mea.brazo);
  const r = alcanzar([0, 0], 10, 10, [0, 30], [1, 0]);
  assert.ok(Math.abs(r.punta[1] - 19.5) < 0.6, 'la cuenta de los dos tramos estira de más');
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

function domDeJuguete(capas: readonly string[]) {
  const oyentes = new Map<string, (ev: unknown) => void>();
  const titere = { addEventListener: (tipo: string, fn: (ev: unknown) => void) => oyentes.set(tipo, fn) };
  const todas: Juguete[] = [];
  const marcos = capas.map((html) => {
    const partes: Juguete[] = [];
    for (const m of html.matchAll(/<(?:g|path|ellipse|circle)\b([^>]*\bdata-parte="([^"]+)"[^>]*)>/g)) {
      const atributos = new Map([...m[1]!.matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1]!, a[2]!] as const));
      partes.push({
        dataset: { parte: m[2]! },
        atributos,
        setAttribute(n, v) { this.atributos.set(n, v); },
        getAttribute(n) { return this.atributos.get(n) ?? null; },
      });
    }
    todas.push(...partes);
    return {
      querySelector: (sel: string) => (sel === '.titere--diablo' && html.includes('titere--diablo') ? titere : null),
      querySelectorAll: (sel: string) => (sel === '[data-parte]' ? partes : []),
    } as unknown as SVGGElement;
  });
  const foto = (): Record<string, string> => Object.fromEntries(todas.map((p) => [p.dataset.parte!, [...p.atributos].filter(([k]) => k !== 'data-parte').map(([k, v]) => `${k}=${v}`).join(' ')]));
  const parte = (n: string): Juguete => todas.find((p) => p.dataset.parte === n)!;
  return { marcos, oyentes, foto, parte };
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

const opacidad = (j: Juguete): number => Number(j.getAttribute('opacity') ?? 1);

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = domDeJuguete([atras, figura]);
    const antes = dom.foto();
    const { esc } = escenario(quieto);
    const vivo = armarDiabloCon(dom.marcos, esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes, quieto ? 'con movimiento reducido no queda como sin JavaScript' : 'al armarse se mueve');
  }
  // Y el HTML es la pose quieta del rig: meando, de espaldas, con el vapor subiendo.
  const t = transformes(poseQuieta());
  assert.ok(figura.includes(`transform="${t.entero!.transform}"`) && atras.includes(`d="${t.chorro!.d}"`));
  assert.ok(Number(t.chorro!.opacity) > 0.9 && Number(t['vapor-1']!.opacity) > 0.3 && Number(t.vuelta!.opacity) === 0);
});

test('vive: mea en una pared, se sacude, se palpa la pelada, se corre a otra, y lo que cae no dura', () => {
  const dom = domDeJuguete([atras, figura]);
  const { esc, poner } = escenario(false);
  const vivo = armarDiabloCon(dom.marcos, esc, azar(11));
  const modos = new Set<string>();
  const gestos = new Set<string>();
  const paredes = new Set<number>();
  let secoDesde = -1;
  let charcoSeco = false;
  for (let i = 1; i <= 60 * 100; i++) {
    const t = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const e = vivo.estado();
    modos.add(e.modo);
    gestos.add(e.gesto);
    if (e.modo === 'mea') paredes.add(Math.round(e.x));
    assert.ok(e.x >= DIABLO.lugares[0]! - 0.01 && e.x <= DIABLO.lugares.at(-1)! + 0.01, `se fue de la pared: ${e.x}`);
    // Un segundo después de dejar de mear, no queda ni el brillo ni el vapor.
    if (e.fuerza === 0 && secoDesde < 0) secoDesde = t;
    if (e.fuerza > 0) secoDesde = -1;
    if (secoDesde > 0 && t - secoDesde > 1.6) {
      charcoSeco = true;
      assert.equal(opacidad(dom.parte('charco')), 0, 'el charco dura');
      for (const n of [1, 2, 3]) assert.equal(opacidad(dom.parte(`vapor-${n}`)), 0, 'el vapor dura');
    }
    if (i % 30 === 0) for (const p of Object.values(dom.foto())) assert.doesNotMatch(p, roto);
  }
  for (const m of ['mea', 'sacude', 'espera', 'camina']) assert.ok(modos.has(m), `en cien segundos no hizo «${m}»`);
  assert.ok(gestos.has('gorro'), 'nunca se palpó la pelada');
  assert.ok(paredes.size >= 2, 'marca siempre la misma pared');
  assert.ok(charcoSeco, 'nunca dejó de mear el tiempo suficiente para ver que no queda nada');
});

test('tocado, lo pescaste: se da vuelta por encima del hombro, se palpa la pelada y dice su verso', () => {
  const dom = domDeJuguete([atras, figura]);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarDiabloCon(dom.marcos, esc, azar(3));
  for (let i = 1; i <= 30; i++) {
    poner(i / 60);
    vivo.mover(i / 60, 1 / 60);
  }
  dom.oyentes.get('click')!({});
  assert.deepEqual(dichos[0], [ID, ...VERSO(DIABLO.x)]);
  assert.equal(vivo.estado().gesto, 'pescado');
  let vuelto = 0;
  let mano = 0;
  for (let i = 31; i <= 30 + 60 * 2; i++) {
    poner(i / 60);
    vivo.mover(i / 60, 1 / 60);
    vuelto = Math.max(vuelto, opacidad(dom.parte('vuelta')));
    mano = Math.max(mano, opacidad(dom.parte('antebrazo')));
  }
  assert.ok(vuelto > 0.95, 'no se dio vuelta');
  assert.ok(mano > 0.95, 'no levantó la mano');
  // Estaba meando, y sigue: es el diablo.
  assert.ok(vivo.estado().fuerza > 0.5, 'dejó de mear porque lo miraron');
  assert.equal(vivo.reaccionar('otro-bicho', 1), false);
  assert.equal(vivo.reaccionar('el-diablo-de-muchos-cuernos', 1), false, 'se queda con el toque del de la puerta');

  // Con movimiento reducido: tocarlo lo pasa a la pose de mirarte, quieta, y no se mueve solo.
  const q = domDeJuguete([atras, figura]);
  const quieto = escenario(true);
  const vivoQuieto = armarDiabloCon(q.marcos, quieto.esc, azar(3));
  const deEspaldas = q.foto();
  q.oyentes.get('click')!({});
  const mirando = q.foto();
  assert.notDeepEqual(mirando, deEspaldas, 'tocado con movimiento reducido no cambia de pose');
  assert.equal(opacidad(q.parte('vuelta')), 1);
  assert.equal(quieto.dichos.length, 1);
  vivoQuieto.mover(5, 0);
  assert.deepEqual(q.foto(), mirando, 'con movimiento reducido se movió solo');
  q.oyentes.get('click')!({});
  assert.deepEqual(q.foto(), deEspaldas, 'tocado otra vez no vuelve a la pose de espaldas');
});

test('la ficha: el retrato es él pescado, entero en su caja, y la estampa dice qué es del dibujo', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/infierno-cerca.webp') && svg.includes('/bestiario/diablo-vuelta.webp') && svg.includes('class="infierno-fuego"'));
  assert.doesNotMatch(svg, /data-id=/, 'el retrato se puede tocar');
  // El recorte del ojo tiene otro nombre que el de la escena: van en la misma página.
  assert.ok(svg.includes('id="diablo-ojo-retrato"') && figura.includes('id="diablo-ojo-escena"'));
  const [x0, y0, w, h] = r.caja;
  for (const [x, y] of puntos(poseQuieta(true))) assert.ok(x > x0 + 2 && x < x0 + w - 2 && y > y0 + 2 && y < y0 + h - 2, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /gorro/);
  for (const c of b.cuenta ?? []) {
    assert.match(c.fuente, /^RES-\d+$/);
    assert.ok(['hecho', 'leyenda', 'testimonio'].includes(c.rotulo));
  }
});

test('la isla del diablo se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/diablo.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|pincel|titeres|escenas|elenco/.test(r)), []);
  const rig = readFileSync('src/lib/bestiario/rig-diablo.ts', 'utf-8');
  assert.deepEqual([...rig.matchAll(/from '([^']+)'/g)].map((m) => m[1]!), [], 'el rig importa algo');
});
