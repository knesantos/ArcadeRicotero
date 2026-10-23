import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_HIJA, RETRATO } from './arte-hija.ts';
import {
  CABLE, HIJA_ARMADA, LUGAR, QUIETA, TUBO, VERSO, VUELTA, alRecinto, alTitere, baseDelCable, brazo, cuantoAfuera, enElCable, enElTubo, enLaCabeza,
  salidaDelCable, tuboEn, type Momento, type Punto,
} from './rig-hija.ts';
import { ASTILLERO, COSAS_DE_LOS_ASTILLEROS, OJOS_DE_LOS_ASTILLEROS } from './rig-entornos.ts';
import { DURA, MIRA, armarHijaCon, descarga, mirada } from '../../scripts/bestiario/hija.ts';

/**
 * La hija del fletero (`D-73`, decimosexta vuelta): que sea un títere entero, que pise la cubierta del
 * ferry, que la mano lleve el tubo a la oreja y lo baje para mirarte, que el cable vaya por la baranda
 * al agua, que la descarga suba y baje por él, que no le tape la cara a nadie, y que la pose de la isla
 * sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; cuenta?: Array<{ rotulo: string; fuente?: string; quien?: string }> }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const marcado = capasDe('los-astilleros', 'figura', nombres, 1, 'la-hija-del-fletero');
const A = HIJA_ARMADA;
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_HIJA.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const lejos = (a: Punto, b: Punto): number => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Los momentos que recorre: quieta, mirándote, en cada paso de la mirada y de una descarga. */
const momentos: Momento[] = [
  QUIETA,
  VUELTA,
  ...Array.from({ length: 30 }, (_, i) => ({ ...QUIETA, ...mirada((DURA.mira * i) / 29) })),
  ...Array.from({ length: 30 }, (_, i) => ({ ...QUIETA, ...descarga(((DURA.sube + DURA.respingo) * i) / 29) })),
  { ...QUIETA, viento: 1, cabeza: 4, respira: 1 },
  { ...QUIETA, viento: 0, cabeza: -4, respira: -1 },
];

/** Los puntos del cuerpo de un momento, en el recinto: los zapatos, la pollera, la cabeza, el tubo y la mano. */
function puntos(m: Momento): Punto[] {
  const b = brazo(m);
  return [
    [-7, 0], [15, 0], [34, 0], [-25, -44], [18, -41], [-14, -118], [13, -120],
    enLaCabeza([3, -158], m), enLaCabeza([16, -142], m), enLaCabeza([-16, -150], m), enLaCabeza([-30, -146], m),
    b.codo, b.mano, enElTubo([-8, 0], m), enElTubo([8, 0], m),
  ].map((p) => alRecinto(p as Punto));
}

test('la hija es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(marcado, /<g class="titere titere--hija" data-id="la-hija-del-fletero" role="button" tabindex="0" aria-label="La hija del fletero">/);
  const partes = ['entero', 'hundido', 'ondas', 'cable', 'cable-luz', 'pollera', 'piernas', 'valija', 'torso', 'panuelo-1', 'panuelo-2', 'panuelo-3',
    'cabeza', 'pelo', 'erizo', 'perfil', 'parpado', 'vuelta', 'parpado-vuelta', 'resplandor', 'tubo', 'brazo', 'antebrazo', 'chispa'];
  for (const p of partes) assert.ok(marcado.includes(`data-parte="${p}"`), `a la hija le falta ${p}`);
  const imagenes = [...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!);
  assert.deepEqual([...imagenes].sort(), PIEZAS_HIJA.map((p) => p.nombre).sort(), 'usa piezas que no se imprimen, o le sobra una');
  assert.ok(PIEZAS_HIJA.length >= 5 && PIEZAS_HIJA.length <= 18, `${PIEZAS_HIJA.length} piezas`);
  // Las bisagras: cada una cae adentro de las dos piezas que une.
  const codo: Punto = [A.hombro[0], A.hombro[1] + A.largos.brazo];
  const mano: Punto = [A.hombro[0], codo[1] + A.largos.antebrazo];
  assert.ok(adentro('hija-torso', A.hombro) && adentro('hija-brazo', A.hombro), 'el hombro no está en el hombro');
  assert.ok(adentro('hija-brazo', codo) && adentro('hija-antebrazo', codo), 'el codo no une las dos mitades');
  assert.ok(adentro('hija-antebrazo', mano), 'la mano no está en su antebrazo');
  assert.ok(adentro('hija-torso', A.cuello) && adentro('hija-cabeza', A.cuello) && adentro('hija-cabeza-vuelta', A.cuello), 'la cabeza gira en el aire');
  assert.ok(adentro('hija-torso', A.talle) && adentro('hija-pollera', A.talle), 'la pollera no cuelga del talle');
  assert.ok(adentro('hija-melena', A.coronilla) && adentro('hija-erizo', A.coronilla), 'el pelo no sale de la cabeza');
  assert.ok(adentro('hija-torso', A.nudo), 'el pañuelo no está atado al cuello');
  assert.ok(adentro('hija-cabeza', A.ojo.centro) && adentro('hija-cabeza-vuelta', A.ojoVuelta.centro), 'un ojo se salió de su cara');
  assert.ok(adentro('hija-cabeza', TUBO.oreja) && adentro('hija-cabeza', TUBO.boca), 'el tubo no va de la oreja a la boca');
  // Ni un hex: las tintas son tokens de su bloque.
  for (const p of PIEZAS_HIJA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  const peso = PIEZAS_HIJA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 30 && peso <= 250, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de la hija están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨la hija del fletero⟩'), tokens.indexOf('⟨/la hija del fletero⟩'));
  const usadas = new Set(PIEZAS_HIJA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-hija-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 8);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de la hija, o no dice de dónde salió`);
  // Un solo color, el del tubo: lo demás es grisalla. Ningún otro bloque del elenco le presta tinta.
  assert.deepEqual([...usadas].filter((t) => /tubo/.test(t)).sort(), ['--bestia-hija-tubo', '--bestia-hija-tubo-hondo', '--bestia-hija-tubo-luz']);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨la hija del fletero⟩ */'), sitio.indexOf('/* ⟨/la hija del fletero⟩ */'));
  for (const clase of new Set([...marcado.matchAll(/class="(bt-hija-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('pisa la cubierta del ferry, en la popa, y el cable va por la baranda al agua', () => {
  assert.equal(LUGAR.piso, ASTILLERO.ferry.cubierta);
  assert.ok(LUGAR.x > ASTILLERO.planchada.cubierta[0] + 20 && LUGAR.x < ASTILLERO.ferry.x0 + 120, 'no está en la popa, entre la planchada y la cabina');
  for (const m of momentos) {
    const base = baseDelCable(m);
    assert.ok(lejos(base[0]!, salidaDelCable(m)) < 1e-9, 'el cable no sale del tubo');
    // Pasa por la baranda y se mete en el agua: de ahí en adelante, todo hundido.
    assert.ok(base.some((p) => lejos(p, CABLE.baranda) < 1.5), 'el cable no pasa por la baranda');
    const corte = cuantoAfuera(base);
    assert.ok(corte > 2 && corte < base.length, 'el cable no se mete en el agua');
    for (const p of base.slice(corte)) assert.ok(p[1] > CABLE.agua[1], 'lo hundido sale del agua');
    // Ningún punto del cable se va del recinto, ni cuelga por debajo del muelle.
    for (const p of base.map((q) => alRecinto(q))) assert.ok(p[0] > 0 && p[0] < 900 && p[1] > 0 && p[1] < ASTILLERO.muelle, `el cable se va a ${p[0].toFixed(0)}, ${p[1].toFixed(0)}`);
  }
  // La baranda es la de la popa del ferry, y el agua es la del ferry.
  const [bx, by] = alRecinto(CABLE.baranda);
  assert.ok(Math.abs(by - (ASTILLERO.ferry.cubierta - 3)) < 1e-6 && bx > ASTILLERO.ferry.x0);
  assert.ok(alRecinto(CABLE.agua)[1] > ASTILLERO.ferry.agua);
  assert.ok(lejos(alTitere(alRecinto([10, -20])), [10, -20]) < 1e-9);
});

test('la mano lleva el tubo: en la oreja cuando habla, bajado al pecho cuando te mira', () => {
  for (const m of momentos) {
    const b = brazo(m);
    const meta = enElTubo([0.4, 1.8], m);
    assert.ok(lejos(b.mano, meta) < 0.6, `la mano no llega al tubo (le falta ${lejos(b.mano, meta).toFixed(1)})`);
  }
  // Hablando, el auricular está en la oreja y el micrófono en la boca; mirándote, lo baja abajo de la pera.
  const l = (Math.hypot(TUBO.boca[0] - TUBO.oreja[0], TUBO.boca[1] - TUBO.oreja[1]) / 2) * A.agranda;
  const enLaOreja = enLaCabeza(TUBO.oreja, QUIETA);
  const auricular = enElTubo([-l / A.agranda, 0], QUIETA);
  assert.ok(lejos(auricular, enLaOreja) < 1, 'el tubo no está en la oreja');
  const pera = enLaCabeza([10, -131], VUELTA)[1];
  assert.ok(tuboEn(VUELTA).centro[1] > pera + 6, 'mirándote, no bajó el tubo');
});

test('la descarga sube por el cable y le da el respingo; la mirada la manda para el muelle', () => {
  // Sube: del agua (1) a la mano (0), sin volver para atrás.
  let antes = 2;
  for (let i = 0; i <= 50; i++) {
    const d = descarga((DURA.sube * i) / 50 - 1e-6);
    if (!d.chispa) continue;
    assert.ok(d.chispa.donde <= antes + 1e-9, 'la chispa baja mientras sube');
    antes = d.chispa.donde;
  }
  assert.ok(antes < 0.02, 'la chispa no llega a la mano');
  // Cuando llega: los hombros arriba y el pelo erizado, y después se le pasa.
  const respingo = Array.from({ length: 40 }, (_, i) => descarga(DURA.sube + (DURA.respingo * i) / 39));
  assert.ok(Math.max(...respingo.map((r) => r.hombros)) > 0.8 && Math.max(...respingo.map((r) => r.eriza)) > 0.8, 'no le da el respingo');
  assert.deepEqual(descarga(DURA.sube + DURA.respingo + 0.01), { chispa: null, hombros: 0, eriza: 0 });
  // La mirada: se da vuelta del todo, y la chispa va de la mano (0) al agua (1).
  const vistas = Array.from({ length: 80 }, (_, i) => mirada((DURA.mira * i) / 79));
  assert.ok(Math.max(...vistas.map((v) => v.vuelta)) > 0.99, 'no se da vuelta');
  assert.equal(mirada(DURA.mira).vuelta, 0);
  assert.equal(mirada(DURA.mira).baja, 0);
  const chispas = vistas.filter((v) => v.chispa).map((v) => v.chispa!.donde);
  assert.ok(chispas.length > 5 && chispas[0]! < 0.1 && chispas[chispas.length - 1]! > 0.9, 'la descarga no baja para el muelle');
  assert.ok(MIRA.descarga > MIRA.vuelta, 'la descarga sale antes de que te mire');
  // La chispa cae siempre sobre el cable.
  const base = baseDelCable(VUELTA);
  assert.ok(lejos(enElCable(base, 0), base[0]!) < 1e-9 && lejos(enElCable(base, 1), base[base.length - 1]!) < 1e-9);
});

test('se queda en la popa, adentro de la escena, y no le tapa la cara a nadie de los astilleros', () => {
  const otros: Array<[string, Punto]> = [
    ...Object.entries(OJOS_DE_LOS_ASTILLEROS).filter(([id]) => id !== 'la-hija-del-fletero').map(([id, [x, y]]) => [id, [x, y] as Punto] as [string, Punto]),
    ...Object.entries(COSAS_DE_LOS_ASTILLEROS).map(([id, [x, y]]) => [id, [x, y] as Punto] as [string, Punto]),
  ];
  for (const m of momentos) {
    const ps = puntos(m);
    const xs = ps.map((q) => q[0]);
    const ys = ps.map((q) => q[1]);
    const [a, b, c, d] = [Math.min(...xs) - 3, Math.max(...xs) + 3, Math.min(...ys) - 3, Math.max(...ys) + 3];
    assert.ok(a > ASTILLERO.ferry.x0 && b < ASTILLERO.ferry.x1 && c > 0 && d <= LUGAR.piso + 3, 'se sale del ferry');
    for (const [id, [ox, oy]] of otros) assert.ok(!(ox > a - 6 && ox < b + 6 && oy > c - 6 && oy < d + 6), `le tapa la cara a ${id}`);
    // El cable tampoco le pasa por encima de los ojos a nadie.
    for (const p of baseDelCable(m).map((q) => alRecinto(q))) for (const [id, o] of otros) assert.ok(lejos(p, o) > 8, `el cable le pasa por la cara a ${id}`);
  }
  // El verso, arriba de ella, sobre la cabina.
  assert.ok(VERSO[1] < LUGAR.piso - 60 && Math.abs(VERSO[0] - LUGAR.x) < 30);
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

const PARTE = /<(?:g|ellipse|circle|path)\b([^>]*\bdata-parte="([^"]+)"[^>]*)>/g;

function domDeJuguete(html: string) {
  const partes: Juguete[] = [];
  for (const m of html.matchAll(PARTE)) {
    const atributos = new Map([...m[1]!.matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1]!, a[2]!] as const));
    partes.push({
      dataset: { parte: m[2]! },
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
  const marco = { querySelector: (sel: string) => (sel === '.titere--hija' ? titere : null) };
  const foto = (): Record<string, string> =>
    Object.fromEntries(partes.map((p) => [p.dataset.parte!, `${p.getAttribute('transform') ?? ''}|${p.getAttribute('opacity') ?? ''}|${p.getAttribute('d') ?? ''}`]));
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
    const vivo = armarHijaCon([dom.marco], esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes, quieto ? 'con movimiento reducido no queda como sin JavaScript' : 'al armarse se mueve');
  }
});

test('vive: habla y asiente, el viento le mueve el pañuelo, y le llegan descargas; sola no se da vuelta', () => {
  const dom = domDeJuguete(marcado);
  const { esc, poner } = escenario(false);
  const vivo = armarHijaCon([dom.marco], esc, azar(11));
  const cabezas = new Set<string>();
  const panuelos = new Set<string>();
  const cables = new Set<string>();
  let erizo = 0;
  let chispa = 0;
  for (let i = 1; i <= 60 * 50; i++) {
    const t = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    assert.equal(vivo.estado().vuelta, 0, `a ${t.toFixed(1)} s se dio vuelta sin que la toquen`);
    erizo = Math.max(erizo, Number(dom.de('erizo', 'opacity')));
    chispa = Math.max(chispa, Number(dom.de('chispa', 'opacity')));
    if (i % 20 === 0) {
      cabezas.add(dom.de('cabeza', 'transform'));
      panuelos.add(dom.de('panuelo-3', 'transform'));
      cables.add(dom.de('cable', 'd'));
    }
    for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}${p.getAttribute('d')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
  }
  assert.ok(vivo.estado().descargas >= 2, `en 50 s le llegaron ${vivo.estado().descargas} descargas`);
  assert.ok(erizo > 0.9 && chispa > 0.9, 'la descarga no se ve');
  assert.ok(cabezas.size > 30, 'no asiente mientras habla');
  assert.ok(panuelos.size > 30, 'el viento no le mueve el pañuelo');
  assert.ok(cables.size > 10, 'el cable no se mueve con ella');
});

test('tocada, te mira y la descarga baja al muelle; dice su verso; con movimiento reducido cambia de pose quieta', () => {
  const dom = domDeJuguete(marcado);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarHijaCon([dom.marco], esc, azar(3));
  poner(0.5);
  vivo.mover(0.5, 1 / 60);
  dom.oyentes.get('click')!({});
  // La ficha espera al gesto: el verso se dice después.
  assert.equal(dichos.length, 0, 'abre la ficha antes de que se vea el gesto');
  let vuelta = 0;
  for (let i = 1; i <= 60 * 5; i++) {
    const t = 0.5 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    vuelta = Math.max(vuelta, Number(dom.de('vuelta', 'opacity')));
  }
  assert.deepEqual(dichos[0], ['la-hija-del-fletero', VERSO[0], VERSO[1], undefined]);
  assert.ok(vuelta > 0.99, 'no te mira');
  assert.equal(vivo.estado().vuelta, 0, 'no volvió a mirar el río');
  assert.equal(vivo.reaccionar('otro-bicho', 0), false);
  assert.equal(vivo.reaccionar('la-hija-del-fletero', 9), true);

  const q = domDeJuguete(marcado);
  const quieto = escenario(true);
  const vivoQuieto = armarHijaCon([q.marco], quieto.esc, azar(3));
  const deEspaldas = q.foto();
  q.oyentes.get('click')!({});
  const mirandote = q.foto();
  assert.notDeepEqual(mirandote, deEspaldas, 'tocada con movimiento reducido no cambia de pose');
  assert.equal(q.de('vuelta', 'opacity'), '1.00', 'la pose quieta de la mirada no te mira');
  vivoQuieto.mover(5, 0);
  vivoQuieto.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), mirandote, 'con movimiento reducido se movió sola');
  q.oyentes.get('keydown')!({ key: ' ', preventDefault: () => {} });
  assert.deepEqual(q.foto(), deEspaldas, 'tocada otra vez no se vuelve a dar vuelta');
});

test('la ficha: el retrato es ella mirándote en la popa, y lo que cuenta es testimonio fichado', () => {
  const r = retratoDe('la-hija-del-fletero')!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/astillero-piso.webp') && svg.includes('/bestiario/hija-cabeza-vuelta.webp'));
  const [x0, y0, w, h] = r.caja;
  for (const [x, y] of puntos(VUELTA)) assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  const b = datos.bestias.find((x) => x.id === 'la-hija-del-fletero')!;
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /letra/);
  assert.match(b.estampa, /Lobo suelto/);
  assert.ok(b.cuenta?.some((c) => c.rotulo === 'testimonio' && c.fuente === 'RES-21' && /p\. 327/.test(c.quien ?? '')), 'lo de la fotonovela no está como testimonio');
});

test('la isla de la hija se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/hija.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco/.test(r)), []);
});
