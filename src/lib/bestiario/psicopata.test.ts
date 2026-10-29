import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_PSICOPATA, RETRATO } from './arte-psicopata.ts';
import {
  CORREA, CUADRO, LUGAR, PERRO, PERRO_ARMADO, PERRO_QUIETO, PSICOPATA_ARMADO, QUIETA, SALUDA, SALUDO, VERSO, alRecinto, alTitere, brazo, correa, enElPerro,
  enLaCabezaDelPerro, type Momento, type Punto,
} from './rig-psicopata.ts';
import { CHAPA } from './rig.ts';
import { VECINOS_DEL_BALDIO } from './escenas.ts';
import { BANG, DURA, armarPsicopataCon, disparo, saltoMortal } from '../../scripts/bestiario/psicopata.ts';

/**
 * El buen psicópata (`D-73`, decimosexta vuelta): que él y su perro sean títeres enteros, que pisen la
 * tierra del baldío, que el cuadro de la tapa esté en su caballete y él lo mire, que la mano agarre la
 * correa y llegue a la gorra para saludar, que el perro caiga del salto mortal donde saltó, que la
 * banderita salga y vuelva a entrar, que no le tapen la cara a nadie, y que la pose de la isla sea la
 * del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; cuenta?: Array<{ rotulo: string; fuente?: string; quien?: string }> }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const figura = capasDe('los-techos', 'figura', nombres, 1, 'el-buen-psicopata');
const atras = capasDe('los-techos', 'atras', nombres, 1, 'el-buen-psicopata');
const A = PSICOPATA_ARMADO;
const PA = PERRO_ARMADO;
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_PSICOPATA.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const lejos = (a: Punto, b: Punto): number => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Los momentos que recorren: quietos, saludando, en cada paso del disparo y de un salto mortal. */
const momentos: Momento[] = [
  QUIETA,
  SALUDA,
  ...Array.from({ length: 40 }, (_, i) => {
    const d = disparo((DURA.bang * i) / 39);
    return {
      ...QUIETA, vuelta: d.vuelta, gorra: d.gorra, bandera: d.bandera, humo: d.humo,
      mano: d.saluda > 0.001 ? ([brazo(QUIETA).mano[0] + (SALUDO[0] - brazo(QUIETA).mano[0]) * d.saluda, brazo(QUIETA).mano[1] + (SALUDO[1] - brazo(QUIETA).mano[1]) * d.saluda] as Punto) : null,
      perro: { ...PERRO_QUIETO, ...d.salto, cabeza: d.cabezaPerro },
    };
  }),
  ...Array.from({ length: 30 }, (_, i) => ({ ...QUIETA, perro: { ...PERRO_QUIETO, ...saltoMortal((DURA.salto * i) / 29) } })),
  { ...QUIETA, inclina: -6, cabeza: 4 },
];

/** Los puntos de él y del perro en un momento, en el recinto. */
function puntos(m: Momento): Punto[] {
  const b = brazo(m);
  const q = m.perro;
  return [
    [-50, 0], [14, 0], [-54, -80], [70, -80], [-40, -300], [60, -294], [-44, -360], [30, -380], b.codo, b.mano,
    enElPerro([-22, 0], q), enElPerro([32, -14], q), enElPerro([48, -48], q), enLaCabezaDelPerro([-62, -100], q), enLaCabezaDelPerro([-18, -96], q),
  ].map((p) => alRecinto(p as Punto));
}

test('el psicópata y su perro son un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--psicopata" data-id="el-buen-psicopata" role="button" tabindex="0" aria-label="El buen psicópata">/);
  const partes = ['entero', 'perro', 'perro-cola', 'perro-cabeza', 'perro-parpado', 'perro-oreja', 'humo', 'bandera', 'piernas', 'cuerpo', 'cabeza', 'nuca',
    'vuelta', 'parpado', 'gorra', 'solapa', 'correa', 'brazo', 'antebrazo'];
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `al psicópata le falta ${p}`);
  const imagenes = [...(figura + atras).matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!);
  assert.deepEqual([...imagenes].sort(), PIEZAS_PSICOPATA.map((p) => p.nombre).sort(), 'usa piezas que no se imprimen, o le sobra una');
  assert.ok(PIEZAS_PSICOPATA.length <= 18, `${PIEZAS_PSICOPATA.length} piezas`);
  // Él: cada bisagra cae adentro de las dos piezas que une.
  const codo: Punto = [A.hombro[0], A.hombro[1] + A.largos.brazo];
  const mano: Punto = [A.hombro[0], codo[1] + A.largos.antebrazo];
  assert.ok(adentro('psicopata-sobretodo', A.hombro) && adentro('psicopata-brazo', A.hombro), 'el hombro no está en el hombro');
  assert.ok(adentro('psicopata-brazo', codo) && adentro('psicopata-antebrazo', codo), 'el codo no une las dos mitades');
  assert.ok(adentro('psicopata-antebrazo', mano), 'la mano no está en su antebrazo');
  assert.ok(adentro('psicopata-solapa', A.cuello) && adentro('psicopata-nuca', A.cuello) && adentro('psicopata-cabeza-vuelta', A.cuello), 'la cabeza gira en el aire');
  assert.ok(adentro('psicopata-gorra', A.visera) && adentro('psicopata-gorra', A.nuca), 'la gorra no se levanta de su nuca');
  assert.ok(adentro('psicopata-cabeza-vuelta', A.ojo.centro), 'el ojo se salió de la cara');
  assert.ok(adentro('psicopata-sobretodo', A.cadera), 'se inclina desde afuera del cuerpo');
  // El perro.
  assert.ok(adentro('perro-cuerpo', PA.pescuezo) && adentro('perro-cabeza', PA.pescuezo), 'la cabeza del perro gira en el aire');
  assert.ok(adentro('perro-cuerpo', PA.cola) && adentro('perro-cola', PA.cola), 'la cola no sale del perro');
  assert.ok(adentro('perro-cabeza', PA.collar) && adentro('perro-cabeza', PA.ojo.centro), 'el collar o el ojo se salieron de la cabeza');
  assert.ok(adentro('perro-cabeza', [PA.boca[0] + 1, PA.boca[1]]), 'la boca del caño no está en la pistola');
  assert.ok(adentro('perro-cuerpo', PA.centro), 'el salto mortal no da la vuelta en el perro');
  // La banderita y el humo salen de la boca del caño, que es su (0, 0).
  assert.ok(adentro('perro-bandera', [0, 0]) && adentro('perro-humo', [0, 0]));
  // Ni un hex: las tintas son tokens de su bloque.
  for (const p of PIEZAS_PSICOPATA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  const peso = PIEZAS_PSICOPATA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 80 && peso <= 320, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del psicópata están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el buen psicopata⟩'), tokens.indexOf('⟨/el buen psicopata⟩'));
  const usadas = new Set(PIEZAS_PSICOPATA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-psicopata-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 10);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del psicópata, o no dice de dónde salió`);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el buen psicópata⟩ */'), sitio.indexOf('/* ⟨/el buen psicópata⟩ */'));
  for (const clase of new Set([...(figura + atras).matchAll(/class="(bt-psicopata-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('el cuadro es la tapa de verdad, en su caballete en la tierra, abajo de la chapa y a la izquierda de él', () => {
  const cuadro = PIEZAS_PSICOPATA.find((p) => p.nombre === 'psicopata-cuadro')!.dibujo;
  assert.match(cuadro, /href="tapa:bang-bang-estas-liquidado-frontal"/);
  readFileSync('Docs/INVESTIGACION/TapasDiscos/bang-bang-estas-liquidado-frontal.jpg');
  const arriba = CUADRO.y - CUADRO.alto / 2 - CUADRO.marco;
  assert.ok(arriba - 24 > CHAPA.abajo, 'el cuadro, con su lamparita, se mete en la chapa de la medianera');
  assert.ok(CUADRO.piso > CUADRO.y + CUADRO.alto / 2 && CUADRO.piso <= LUGAR.piso, 'el caballete no apoya en la tierra');
  // Él está a la derecha del cuadro y lo mira: la cara, a la altura del cuadro.
  const derecha = CUADRO.x + CUADRO.ancho / 2 + CUADRO.marco;
  // De él, no del perro: el caño del perro puede asomar delante de las patas del caballete.
  for (const m of [QUIETA, SALUDA]) assert.ok(Math.min(...puntos(m).slice(0, 10).map((p) => p[0])) > derecha + 20, 'se mete adelante del cuadro');
  const cara = alRecinto([-24, -342])[1];
  assert.ok(cara > arriba - 20 && cara < CUADRO.y + CUADRO.alto / 2, `la cara (${cara.toFixed(0)}) no está a la altura del cuadro`);
});

test('pisan la tierra: los zapatos de él y las patas del perro, que cae del salto mortal donde saltó', () => {
  assert.ok(Math.abs(alRecinto([0, 0])[1] - LUGAR.piso) < 1e-9);
  // Las patas del perro en el piso, quieto; en el aire, nunca abajo de la tierra.
  for (const p of [[-16, 0], [-4, 0], [16, 0]] as const) assert.ok(Math.abs(enElPerro(p, PERRO_QUIETO)[1]) < 1e-6, 'el perro no está sentado en la tierra');
  for (let i = 0; i <= 60; i++) {
    const s = saltoMortal((DURA.salto * i) / 60);
    const q = { ...PERRO_QUIETO, ...s };
    for (const p of [[-16, 0], [16, 0], [-20, -76], [-58, -100]] as const) assert.ok(enElPerro(p, q)[1] < 0.5 + 1e-6, `el perro se hunde en la tierra a ${((DURA.salto * i) / 60).toFixed(2)} s`);
  }
  // Da la vuelta entera, en el aire, y cae donde estaba.
  const vueltas = Array.from({ length: 80 }, (_, i) => saltoMortal((DURA.salto * i) / 79));
  assert.ok(Math.max(...vueltas.map((v) => v.giro)) > 300, 'no da la vuelta entera');
  assert.ok(Math.min(...vueltas.map((v) => v.y)) < -60, 'no salta');
  assert.deepEqual(saltoMortal(DURA.salto), { x: 0, y: 0, giro: 0, agacha: 0 });
  assert.deepEqual(saltoMortal(0), { x: 0, y: 0, giro: 0, agacha: 0 });
  assert.ok(PERRO.x < 0, 'el perro no está entre él y el cuadro');
});

test('la mano agarra la correa y llega a la visera para saludar; la correa nunca se estira de más', () => {
  for (const m of momentos) {
    const b = brazo(m);
    if (m.mano) assert.ok(lejos(b.mano, m.mano) < 0.8, `la mano no llega (le falta ${lejos(b.mano, m.mano).toFixed(1)})`);
    const c = correa(m);
    assert.ok(lejos(c.desde, b.mano) < 1e-9, 'la correa no sale de la mano');
    assert.ok(lejos(c.hasta, enLaCabezaDelPerro(PA.collar, m.perro)) < 1e-9, 'la correa no llega al collar');
    // Floja, cuelga sin meterse en la tierra; tirante, no se pasa de su largo.
    assert.ok(lejos(c.desde, c.hasta) <= CORREA + 1, `la correa se estira (${lejos(c.desde, c.hasta).toFixed(0)})`);
    assert.ok(c.panza[1] <= -4, 'la correa se mete en la tierra');
  }
  // Saludando, la mano está en la visera, y la visera, levantada.
  assert.ok(lejos(brazo(SALUDA).mano, SALUDO) < 0.8);
  assert.ok(SALUDA.gorra === 1 && SALUDA.bandera === 1 && SALUDA.vuelta === 1);
});

test('el disparo: el caño sube, sale la banderita con el humo, el perro da el salto, él saluda, y todo vuelve', () => {
  const pasos = Array.from({ length: 200 }, (_, i) => disparo((DURA.bang * i) / 199));
  assert.ok(pasos.slice(0, Math.floor((BANG.tiro / DURA.bang) * 199)).every((d) => d.bandera === 0), 'la banderita sale antes del tiro');
  assert.ok(Math.max(...pasos.map((d) => d.bandera)) > 0.99, 'la banderita no sale entera');
  assert.ok(Math.max(...pasos.map((d) => d.humo.o)) > 0.5, 'no hay humo');
  assert.ok(Math.max(...pasos.map((d) => d.salto.giro)) > 300, 'el culatazo no lo tira en un salto mortal');
  assert.ok(Math.max(...pasos.map((d) => d.saluda)) > 0.99 && Math.max(...pasos.map((d) => d.gorra)) > 0.99, 'no saluda con la gorra');
  assert.ok(Math.min(...pasos.map((d) => d.cabezaPerro)) < -10, 'no levanta el caño');
  const fin = disparo(DURA.bang);
  assert.deepEqual([fin.bandera, fin.vuelta, fin.saluda, fin.gorra, fin.cabezaPerro, fin.humo.o], [0, 0, 0, 0, 0, 0], 'no vuelve todo a su lugar');
});

test('no les tapan la cara a los del baldío, y se quedan en la escena', () => {
  for (const m of momentos) {
    const ps = puntos(m);
    const xs = ps.map((q) => q[0]);
    const ys = ps.map((q) => q[1]);
    const [a, b, c, d] = [Math.min(...xs) - 4, Math.max(...xs) + 4, Math.min(...ys) - 4, Math.max(...ys) + 4];
    assert.ok(a > 0 && b < 900 && c > 0 && d < 640, 'se sale de la escena');
    for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_BALDIO)) assert.ok(!(ox > a - 8 && ox < b + 8 && oy > c - 8 && oy < d + 8), `le tapa la cara a ${id}`);
  }
  // Tampoco el cuadro con su caballete.
  const [cx0, cy0, cw, ch] = caja('psicopata-caballete');
  for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_BALDIO)) assert.ok(!(ox > cx0 && ox < cx0 + cw && oy > cy0 && oy < cy0 + ch), `el caballete le tapa la cara a ${id}`);
  assert.ok(VERSO[1] < CUADRO.y - CUADRO.alto / 2 && VERSO[1] > CHAPA.abajo);
  assert.ok(lejos(alTitere(alRecinto([10, -20])), [10, -20]) < 1e-9);
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
  const marco = { querySelector: (sel: string) => (sel === '.titere--psicopata' ? titere : null) };
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
    const dom = domDeJuguete(figura);
    const antes = dom.foto();
    const { esc } = escenario(quieto);
    const vivo = armarPsicopataCon([dom.marco], esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes, quieto ? 'con movimiento reducido no queda como sin JavaScript' : 'al armarse se mueve');
  }
});

test('viven: él mira el cuadro y de reojo, el perro tira saltos mortales; solo no dispara', () => {
  const dom = domDeJuguete(figura);
  const { esc, poner } = escenario(false);
  const vivo = armarPsicopataCon([dom.marco], esc, azar(11));
  const cuerpos = new Set<string>();
  const colas = new Set<string>();
  let vuelta = 0;
  for (let i = 1; i <= 60 * 50; i++) {
    const t = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    assert.equal(vivo.estado().bandera, 0, `a ${t.toFixed(1)} s disparó sin que lo toquen`);
    vuelta = Math.max(vuelta, vivo.estado().vuelta);
    if (i % 20 === 0) {
      cuerpos.add(dom.de('cuerpo', 'transform'));
      colas.add(dom.de('perro-cola', 'transform'));
    }
    for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}${p.getAttribute('d')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
  }
  assert.ok(vivo.estado().saltos >= 2, `en 50 s el perro tiró ${vivo.estado().saltos} saltos mortales`);
  assert.ok(vuelta > 0.8, 'no te mira nunca de reojo');
  assert.ok(cuerpos.size > 20, 'no respira ni se acerca al cuadro');
  assert.ok(colas.size > 20, 'el perro no mueve la cola');
});

test('tocado, el perro dispara la banderita y él saluda; dice su verso; con movimiento reducido cambia de pose quieta', () => {
  const dom = domDeJuguete(figura);
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarPsicopataCon([dom.marco], esc, azar(3));
  poner(0.5);
  vivo.mover(0.5, 1 / 60);
  dom.oyentes.get('click')!({});
  // La ficha espera al gesto: el verso se dice después.
  assert.equal(dichos.length, 0, 'abre la ficha antes de que se vea el gesto');
  let bandera = 0;
  let vuelta = 0;
  for (let i = 1; i <= 60 * 5; i++) {
    const t = 0.5 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    bandera = Math.max(bandera, vivo.estado().bandera);
    vuelta = Math.max(vuelta, Number(dom.de('vuelta', 'opacity')));
  }
  assert.deepEqual(dichos[0], ['el-buen-psicopata', VERSO[0], VERSO[1], undefined]);
  assert.ok(bandera > 0.99, 'no salió la banderita');
  assert.ok(vuelta > 0.99, 'no te mira para saludar');
  assert.equal(vivo.estado().bandera, 0, 'la banderita no volvió al caño');
  assert.equal(vivo.reaccionar('otro-bicho', 0), false);
  assert.equal(vivo.reaccionar('el-buen-psicopata', 9), true);

  const q = domDeJuguete(figura);
  const quieto = escenario(true);
  const vivoQuieto = armarPsicopataCon([q.marco], quieto.esc, azar(3));
  const mirando = q.foto();
  q.oyentes.get('click')!({});
  const saludando = q.foto();
  assert.notDeepEqual(saludando, mirando, 'tocado con movimiento reducido no cambia de pose');
  assert.equal(q.de('bandera', 'opacity'), '1.00', 'la pose quieta del saludo no tiene la banderita');
  vivoQuieto.mover(5, 0);
  vivoQuieto.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), saludando, 'con movimiento reducido se movió solo');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), mirando, 'tocado otra vez no vuelve a mirar el cuadro');
});

test('la ficha: el retrato es el saludo al lado del cuadro, y lo que cuenta es testimonio fichado', () => {
  const r = retratoDe('el-buen-psicopata')!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/baldio-lejos.webp') && svg.includes('/bestiario/psicopata-cuadro.webp') && svg.includes('/bestiario/perro-bandera.webp'));
  const [x0, y0, w, h] = r.caja;
  for (const [x, y] of puntos(SALUDA)) assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  assert.ok(x0 < CUADRO.x - CUADRO.ancho / 2, 'el cuadro no entra en el retrato');
  const b = datos.bestias.find((x) => x.id === 'el-buen-psicopata')!;
  assert.match(b.estampa, /Bang! Bang!/);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /letra/);
  assert.ok(b.cuenta?.some((c) => c.rotulo === 'testimonio' && c.fuente === 'RES-21' && /pp\. 253-254/.test(c.quien ?? '')), 'lo del buen samaritano no está como testimonio');
});

test('la isla del psicópata se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/psicopata.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco/.test(r)), []);
});
