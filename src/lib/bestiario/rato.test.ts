import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { CABEZA, CUERPO, MEDALLON, PIEZAS_RATO, RETRATO, TIRAS } from './arte-rato.ts';
import {
  BOTAS, BRAZOS, GESTOS, PORRON_EN_LA_MANGA, RATO, RATO_ARMADO, VERSO, VUELCO, alRecinto, anguloPorron, brazo, brazos, brindando, dibujado, enLaCabeza, entre, suelas, vuelco,
  type Gesto, type Punto,
} from './rig-rato.ts';
import { BAJO } from './rig.ts';
import { CHORRO, PIERRE, VECINOS_DEL_BAJO } from './escenas.ts';
import { armarRatoCon, TIEMPOS } from '../../scripts/bestiario/rato.ts';

/**
 * El rato molhado (`D-73`, decimoquinta vuelta): que sea un títere entero, que esté metido en el agua de
 * verdad (cortado en la línea del agua, con su reflejo), que las botas no se le mojen salvo cuando se le
 * cansa el brazo, que se seque la nariz con la manga, que no le tape la cara a nadie, y que la pose de
 * la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; cuenta?: Array<{ rotulo: string; fuente: string; texto: string }> }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const marcado = capasDe('el-bajo', 'figura', nombres);
const A = RATO_ARMADO;
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_RATO.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
/** La distancia de un punto a un tramo. */
function aTramo([px, py]: Punto, [ax, ay]: Punto, [bx, by]: Punto): number {
  const [dx, dy] = [bx - ax, by - ay];
  const k = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - ax - dx * k, py - ay - dy * k);
}

/** Las poses que hace, de punta a punta: nadando, brindando, secándose la nariz, cansado y vaciando las botas. */
const POSES: Readonly<Record<string, Gesto>> = {
  nada: GESTOS.nada,
  brinda: GESTOS.brinda,
  manga: { ...GESTOS.nada, brazo2: BRAZOS.manga, porron: PORRON_EN_LA_MANGA, cabeza: 4, corre: [1, 1] },
  cansado: { ...GESTOS.nada, brazo1: BRAZOS.cansado },
  vuelca: { ...GESTOS.nada, brazo1: BRAZOS.arriba, vuelca: 1 },
};

/** Los puntos que marcan hasta dónde llega, en el recinto: la cabeza, las orejas, los puños, las botas, el porrón y la cola. */
function puntos(g: Gesto): Punto[] {
  const [b1, b2] = brazos(g);
  const cabeza = [...CABEZA, [-33, -210] as Punto, [6, -226] as Punto].map((p) => alRecinto(enLaCabeza(p, g), g));
  const porron = anguloPorron(b2, g);
  const pico: Punto = [b2.puno[0] + Math.sin((porron * Math.PI) / 180) * 38, b2.puno[1] - Math.cos((porron * Math.PI) / 180) * 38];
  const suela = suelas(g);
  return [
    ...cabeza,
    ...[b1.codo, b1.puno, b2.codo, b2.puno, pico, suela, [suela[0] + 30, suela[1]] as Punto, [-158, -18] as Punto].map((p) => alRecinto(p, g)),
  ];
}

test('el rato es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(marcado, /<g class="titere titere--rato" data-id="el-rato-molhado" role="button" tabindex="0" aria-label="El rato molhado">/);
  const partes = ['entero', 'flota', 'cola', 'punta', 'cabeza', 'oreja', 'bigotes', 'brillo', 'brazo-1', 'antebrazo-1', 'botas', 'brazo-2', 'antebrazo-2', 'porron', 'pupila-1', 'pupila-2', 'parpado-1', 'parpado-2', 'reflejo', 'chorro', 'gota-1', 'onda-atras-1', 'onda-adelante-3'];
  for (const p of partes) assert.ok(marcado.includes(`data-parte="${p}"`), `al rato le falta ${p}`);
  const imagenes = [...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!);
  assert.deepEqual([...new Set(imagenes)].sort(), PIEZAS_RATO.map((p) => p.nombre).sort(), 'usa piezas que no se imprimen, o le sobra una');
  assert.ok(PIEZAS_RATO.length >= 5 && PIEZAS_RATO.length <= 14, `${PIEZAS_RATO.length} piezas`);
  for (const n of [0, 1] as const) {
    const h = A.hombros[n];
    const { codo, puno } = dibujado(n);
    assert.ok(adentro('rato-cuerpo', h) && adentro(`rato-brazo-${n + 1}`, h), `el hombro ${n + 1} no está en el hombro`);
    assert.ok(adentro(`rato-brazo-${n + 1}`, codo) && adentro(`rato-antebrazo-${n + 1}`, codo), `el codo ${n + 1} no une las dos mitades`);
    assert.ok(adentro(`rato-antebrazo-${n + 1}`, puno), `el puño ${n + 1} se salió del antebrazo`);
  }
  assert.ok(adentro('rato-puno-1', dibujado(0).puno) && adentro('rato-botas', dibujado(0).puno), 'las botas no cuelgan del puño');
  assert.ok(adentro('rato-porron', dibujado(1).puno), 'el porrón no está en el puño');
  assert.ok(adentro('rato-cuerpo', A.cuello) && adentro('rato-cabeza', A.cuello), 'la cabeza gira en el aire');
  assert.ok(adentro('rato-cabeza', A.oreja) && adentro('rato-oreja', A.oreja), 'la oreja no nace de la cabeza');
  assert.ok(adentro('rato-cabeza', A.bigotes) && adentro('rato-bigotes', A.bigotes), 'los bigotes no nacen del hocico');
  assert.ok(adentro('rato-cuerpo', A.cola) && adentro('rato-cola', A.cola), 'la cola no nace del cuerpo');
  assert.ok(adentro('rato-cola', A.punta) && adentro('rato-punta', A.punta), 'la punta no sigue a la cola');
  for (const o of A.ojos) assert.ok(adentro('rato-cabeza', o.centro), 'un ojo se salió de la cara');
  assert.ok(adentro('rato-cabeza', A.dientes) && adentro('rato-cabeza', A.nariz), 'los dientes o la nariz se salieron de la cara');
  for (const m of marcado.matchAll(/data-parte="parpado-\d"[^>]*>/g)) assert.match(m[0], /data-pivote="-?[\d.]+ -?[\d.]+"/);
  // El medallón cuelga del pecho y es la tapa de verdad.
  assert.ok(adentro('rato-cuerpo', [MEDALLON.x, MEDALLON.y]));
  assert.ok(PIEZAS_RATO.find((p) => p.nombre === 'rato-cuerpo')!.dibujo.includes('href="tapa:momo-sampler-frontal"'), 'el medallón no sale de la tapa');
  for (const p of PIEZAS_RATO) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
});

test('las tintas del rato están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el rato molhado⟩'), tokens.indexOf('⟨/el rato molhado⟩'));
  const usadas = new Set(PIEZAS_RATO.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-rato-[a-z-]+)\)/g)].map((m) => m[1]!)));
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el rato molhado⟩ */'), sitio.indexOf('/* ⟨/el rato molhado⟩ */'));
  for (const t of [...suyo.matchAll(/var\((--bestia-rato-[a-z-]+)\)/g)].map((m) => m[1]!)) usadas.add(t);
  assert.ok(usadas.size >= 9);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del rato, o no dice de dónde salió`);
  for (const clase of new Set([...marcado.matchAll(/class="(bt-rato-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase} {`), `${clase} no está en su bloque de sitio.css`);
  // Ni un hex en su bloque de sitio.css: solo tokens.
  assert.doesNotMatch(suyo, /#[0-9a-fA-F]{3,6}\b/);
});

test('está metido en el agua de verdad: cortado en la línea del agua, con medio cuerpo abajo y su reflejo', () => {
  // La línea del agua del rato está en el agua, más adelante que la pared y que Pierre.
  assert.ok(RATO.agua > BAJO.fondo + 60 && RATO.agua > PIERRE.agua && RATO.agua < 600);
  // Lo seco se corta en el agua, y el reflejo es él mismo dado vuelta en esa línea, cortado en tiras.
  assert.match(marcado, new RegExp(`<clipPath id="rato-seco"><rect x="-10" y="-10" width="920" height="${RATO.agua + 10}"/>`));
  assert.ok(marcado.includes(`<g transform="translate(0 ${RATO.agua * 2}) scale(1 -1)"><g data-parte="reflejo"><use href="#rato-entero"/>`));
  assert.ok(marcado.includes('id="rato-entero"') && marcado.includes('mask="url(#rato-tiras)"'));
  // Medio cuerpo adentro: el pecho con el medallón afuera, la camisa sigue debajo del agua.
  assert.ok(MEDALLON.y + MEDALLON.r < -20, 'el medallón quedó abajo del agua');
  assert.ok(Math.max(...CUERPO.map((p) => p[1])) > 25, 'el cuerpo no sigue debajo del agua');
  // Las tiras cubren el reflejo entero, nadando y brindando.
  for (const g of [GESTOS.nada, GESTOS.brinda]) {
    const xs = puntos(g).filter((p) => p[1] > RATO.agua - 120).map((p) => p[0]);
    assert.ok(Math.min(...xs) > TIRAS.x - 30 && Math.max(...xs) < TIRAS.x + TIRAS.ancho + 30, 'el reflejo se sale de las tiras');
  }
  // La cola flota detrás: no se refleja (va aparte del cuerpo) y queda arriba del agua.
  assert.ok(marcado.indexOf('data-parte="flota"') < marcado.indexOf('id="rato-entero"'));
  assert.ok([A.cola, A.punta, [-158, -18] as Punto].every(([, y]) => y < 0), 'la cola se hunde');
});

test('las botas no se mojan: en alto nadando y brindando, y solo tocan el agua cuando se le cansa el brazo', () => {
  assert.ok(suelas(GESTOS.nada)[1] < -40, `nadando las suelas están en ${suelas(GESTOS.nada)[1].toFixed(0)}`);
  assert.ok(suelas(GESTOS.brinda)[1] < -60, 'brindando no las levanta');
  const cansado = suelas(POSES.cansado!)[1];
  assert.ok(cansado > -3 && cansado < 4, `cansado las suelas quedan en ${cansado.toFixed(1)}, no tocan el agua`);
  // Dadas vuelta para sacarles el agua, la boca de la caña queda abajo y la suela arriba del puño.
  const b = brazo(0, BRAZOS.arriba);
  assert.ok(suelas(POSES.vuelca!)[1] < b.puno[1] - BOTAS.largo * 0.8, 'vaciándolas no las da vuelta');
  // Nadando cuelgan derecho, aunque el brazo esté doblado.
  assert.ok(Math.abs(suelas(GESTOS.nada)[0] - brazos(GESTOS.nada)[0].puno[0]) < 1);
});

test('se seca la nariz con la manga, y da vuelta el porrón para no pegarse en la cara', () => {
  const g = POSES.manga!;
  const b = brazo(1, g.brazo2);
  const nariz = enLaCabeza(A.bajoLaNariz, g);
  const d = aTramo(nariz, b.codo, b.puno);
  assert.ok(d < 8, `la manga pasa a ${d.toFixed(1)} de la nariz`);
  // El puño queda pasando la nariz, del lado de la cara, pero lejos de los ojos.
  assert.ok(b.puno[0] < nariz[0] - 10, 'la manga no llega a pasar por la nariz');
  for (const o of A.ojos) assert.ok(Math.hypot(b.puno[0] - o.centro[0], b.puno[1] - o.centro[1]) > 24, 'se mete el puño en el ojo');
  // Parado nadando; para abajo secándose (el pico no va a la cara); arriba brindando.
  assert.ok(Math.abs(anguloPorron(brazo(1, GESTOS.nada.brazo2), GESTOS.nada)) < 6, 'nadando el porrón no está parado');
  assert.ok(Math.abs(anguloPorron(b, g)) > 140, 'secándose la nariz el porrón le apunta a la cara');
  assert.ok(Math.abs(anguloPorron(brazo(1, GESTOS.brinda.brazo2), GESTOS.brinda)) < 30 && brazo(1, GESTOS.brinda.brazo2).puno[1] < -150, 'brindando no levanta el porrón');
});

test('nada adentro de la escena y no le tapa la cara a nadie del bajo', () => {
  const otros = Object.entries(VECINOS_DEL_BAJO).filter(([id]) => id !== 'el-rato-molhado').map(([, [x, y]]) => [x, y] as Punto);
  // El chorro que cae del vidrio roto, de la puerta al agua: el rato no se mete abajo.
  const chorro = Math.min(...CHORRO.map(([dx0, , dx1]) => BAJO.agujero.x + Math.min(dx0, dx1)));
  const pierre = PIERRE.x - 240 * PIERRE.escala;
  // Los caminos que hace, de una pose a la otra, como los hace la isla.
  const caminos: Record<string, (k: number) => Gesto> = {
    brinda: brindando,
    manga: (k) => entre(GESTOS.nada, POSES.manga!, k),
    cansa: (k) => entre(GESTOS.nada, POSES.cansado!, k),
    vuelca: (k) => ({ ...GESTOS.nada, ...vuelco(k * VUELCO.fin, BRAZOS.cansado) }),
  };
  for (const [nombre, camino] of Object.entries(caminos)) {
    for (const k of Array.from({ length: 21 }, (_, i) => i / 20)) {
      const pts = puntos(camino(k));
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      const [x0, x1, y0, y1] = [Math.min(...xs) - 6, Math.max(...xs) + 6, Math.min(...ys) - 6, Math.max(...ys) + 6];
      assert.ok(x0 > 0 && x1 < 900 && y0 > 0 && y1 < 640, `${nombre} se sale de la escena`);
      for (const [ox, oy] of otros) assert.ok(!(ox > x0 - 12 && ox < x1 + 12 && oy > y0 - 12 && oy < y1 + 12), `${nombre} le tapa los ojos a alguien en ${ox}, ${oy}`);
      assert.ok(x1 < pierre, `${nombre} se le mete encima a Pierre`);
      assert.ok(pts.filter((p) => p[1] < BAJO.fondo + 4).every((p) => p[0] < chorro - 2), `${nombre} se mete en el chorro de la puerta`);
    }
  }
  // El verso se dice arriba de la cabeza, aun brindando.
  const cabeza = Math.min(...puntos(GESTOS.brinda).map((p) => p[1]));
  assert.ok(VERSO[1] < cabeza - 4 && VERSO[1] > 0, `el verso (${VERSO[1].toFixed(0)}) le tapa la cabeza (${cabeza.toFixed(0)})`);
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
  for (const m of html.matchAll(/<(?:g|ellipse|path|circle)\b([^>]*\bdata-parte="([^"]+)"[^>]*)>/g)) {
    const atributos = new Map([...m[1]!.matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1]!, a[2]!] as const));
    partes.push({
      dataset: { parte: m[2]!, ...(atributos.has('data-pivote') ? { pivote: atributos.get('data-pivote')! } : {}) },
      atributos,
      setAttribute(n, v) { this.atributos.set(n, v); },
      getAttribute(n) { return this.atributos.get(n) ?? null; },
    });
  }
  const oyentes = new Map<string, (ev: unknown) => void>();
  const titere = { addEventListener: (tipo: string, fn: (ev: unknown) => void) => oyentes.set(tipo, fn) };
  const marco = {
    querySelector: (sel: string) => (sel === '.titere--rato' ? titere : null),
    querySelectorAll: (sel: string) => (sel === '[data-parte]' ? partes : []),
  };
  const foto = (): Record<string, string> => Object.fromEntries(partes.map((p) => [p.dataset.parte!, [...p.atributos].map(([k, v]) => `${k}=${v}`).join(' ')]));
  const de = (nombre: string): Juguete => partes.find((p) => p.dataset.parte === nombre)!;
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
    const vivo = armarRatoCon([dom.marco], esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes, quieto ? 'con movimiento reducido no queda como sin JavaScript' : 'al armarse se mueve');
  }
  // Sin JavaScript no se ve nada de lo que mueve la isla: ni ondas, ni gotas, ni el chorro, ni el brillo.
  for (const m of marcado.matchAll(/data-parte="(onda-[a-z]+-\d|gota-\d|chorro|brillo)"[^>]*>/g)) assert.match(m[0], /opacity="0"/, `${m[1]} se ve sin la isla`);
});

test('vive: huele, se seca la nariz, se le cansa el brazo, vacía las botas, y el agua se mueve', () => {
  const dom = domDeJuguete(marcado);
  const { esc, poner } = escenario(false);
  const vivo = armarRatoCon([dom.marco], esc, azar(11));
  const vistos = new Set<string>();
  let chorreo = 0;
  let ondas = 0;
  let gotas = 0;
  let masBajo = -Infinity;
  for (let i = 1; i <= 60 * 120; i++) {
    const t = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const e = vivo.estado();
    vistos.add(e.modo);
    if (e.chorrea) chorreo++;
    masBajo = Math.max(masBajo, suelas(e.gesto)[1]);
    if (Number(dom.de('onda-adelante-1').getAttribute('opacity')) > 0) ondas++;
    if (Number(dom.de('gota-1').getAttribute('opacity')) > 0) gotas++;
    if (i % 30 === 0) for (const p of dom.partes) for (const [, v] of p.atributos) assert.doesNotMatch(v, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
  }
  for (const m of ['nada', 'huele', 'manga', 'cansa', 'vuelca']) assert.ok(vistos.has(m), `en dos minutos no hizo «${m}»`);
  assert.ok(chorreo > 30, 'nunca le salió el agua de las botas');
  assert.ok(ondas > 60 && gotas > 10, 'el agua no se mueve');
  // Las botas tocan el agua y nada más: nunca se hunden.
  assert.ok(masBajo > -4 && masBajo < 4, `las suelas llegaron a ${masBajo.toFixed(1)}`);
  assert.ok(VUELCO.sacude < TIEMPOS.vuelca && VUELCO.chorro < VUELCO.sacude);
});

test('tocado, brinda: sale del agua, levanta el porrón, le brillan los dientes y dice su verso', () => {
  const dom = domDeJuguete(marcado);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarRatoCon([dom.marco], esc, azar(3));
  poner(0.5);
  vivo.mover(0.5, 1 / 60);
  dom.oyentes.get('click')!({});
  assert.deepEqual(dichos[0], ['el-rato-molhado', VERSO[0], VERSO[1]]);
  let sube = 0;
  let brillo = 0;
  let volvio = false;
  for (let i = 1; i <= 60 * 5; i++) {
    const t = 0.5 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const e = vivo.estado();
    if (e.modo === 'brinda') {
      sube = Math.max(sube, e.gesto.sube);
      brillo = Math.max(brillo, Number(dom.de('brillo').getAttribute('opacity')));
    } else if (sube > 0) volvio = true;
  }
  assert.ok(sube > 20, 'no sale del agua');
  assert.ok(brillo > 0.5, 'no le brillan los dientes');
  assert.ok(volvio, 'no vuelve a nadar');
  assert.equal(vivo.reaccionar('otro-bicho', 0), false);
  assert.equal(vivo.reaccionar('el-rato-molhado', 6), true);

  // Con movimiento reducido: tocarlo lo pasa a la pose de brindar, quieta, y no se mueve solo.
  const q = domDeJuguete(marcado);
  const quieto = escenario(true);
  const vivoQuieto = armarRatoCon([q.marco], quieto.esc, azar(3));
  const nadando = q.foto();
  q.oyentes.get('click')!({});
  const brindando = q.foto();
  assert.notDeepEqual(brindando, nadando, 'tocado con movimiento reducido no cambia de pose');
  assert.equal(quieto.dichos.length, 1);
  vivoQuieto.mover(5, 0);
  assert.deepEqual(q.foto(), brindando, 'con movimiento reducido se movió solo');
});

test('la ficha: el retrato es el títere brindando, sobre su pedazo del bajo, y la estampa dice qué es del dibujo', () => {
  const r = retratoDe('el-rato-molhado')!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/bajo-lejos.webp') && svg.includes('/bestiario/bajo-agua.webp') && svg.includes('/bestiario/rato-botas.webp'));
  // Los ids del retrato no pisan los de la escena: la ficha y el bajo pueden estar en la misma página.
  assert.ok(!svg.includes('id="rato-entero"') && svg.includes('href="#rato-ficha-entero"'));
  const [x0, y0, w, h] = r.caja;
  for (const [x, y] of puntos(GESTOS.brinda).filter(([px]) => px > 30)) assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `(${x.toFixed(0)}, ${y.toFixed(0)}) se sale del retrato`);
  const b = datos.bestias.find((x) => x.id === 'el-rato-molhado')!;
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /letra/);
  const palabras = b.estampa.split(/\s+/).length;
  assert.ok(palabras >= 45 && palabras <= 75, `la estampa tiene ${palabras} palabras`);
  assert.ok((b.cuenta ?? []).length > 0);
  for (const c of b.cuenta ?? []) {
    assert.match(c.fuente, /^RES-\d+$/);
    assert.ok(['hecho', 'leyenda', 'testimonio'].includes(c.rotulo));
  }
});

test('la isla del rato se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/rato.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco/.test(r)), []);
});
