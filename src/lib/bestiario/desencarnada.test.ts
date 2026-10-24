import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_DESENCARNADA, RETRATO } from './arte-desencarnada.ts';
import { ALZA, EL_DIA, QUIETO, SENORA, SENORA_ARMADO, VERSO, alRecinto, manoDelVelo, type Punto } from './rig-desencarnada.ts';
import { COSAS_DE_LA_RUTA, OJOS_DE_LA_RUTA, RUTA } from './rig-entornos.ts';
import { escenaRuta } from './escenas-entornos.ts';
import { DURA, armarDesencarnadaCon, latido, type Accion } from '../../scripts/bestiario/desencarnada.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * La bella señora desencarnada (`D-73`, vigésima vuelta): que sea un títere entero a aerógrafo, que espere
 * en la banquina de este lado sin taparle nada a nadie, con los fierros pasando por detrás, que el corazón
 * le lata, que tocada se levante el velo y se le venga el día, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; tema?: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'la-bella-senora-desencarnada';
const figura = capasDe('la-ruta', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_DESENCARNADA.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--desencarnada');
const escalaYDelVelo = (t: string): number => Number(/scale\(1 ([-\d.]+)\)/.exec(t)![1]);

test('la bella señora es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--desencarnada" data-id="la-bella-senora-desencarnada" role="button" tabindex="0" aria-label="La bella señora desencarnada">/);
  for (const p of ['entero', 'pollera', 'torso', 'panuelo', 'cabeza', 'cuencas', 'velo', 'dia', 'brazo-1', 'brazo-2']) assert.ok(figura.includes(`data-parte="${p}"`), `a la señora le falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_DESENCARNADA.map((p) => p.nombre).sort());
  const A = SENORA_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`desencarnada-brazo-${n + 1}`, A.hombros[n]) && adentro('desencarnada-torso', A.hombros[n]), `el brazo ${n + 1} no sale del hombro`);
    assert.ok(adentro(`desencarnada-brazo-${n + 1}`, A.manos[n]), `la mano ${n + 1} se sale de su brazo`);
    assert.ok(adentro('desencarnada-calavera', A.cuencas[n]) && adentro('desencarnada-cuencas', A.cuencas[n]), `la cuenca ${n + 1} no está en la calavera`);
  }
  assert.ok(adentro('desencarnada-cartera', [A.manos[0][0], A.manos[0][1] + 8]), 'la cartera no cuelga de la mano');
  assert.ok(adentro('desencarnada-calavera', A.cuello) && adentro('desencarnada-torso', A.cuello), 'la calavera no se apoya en el cuello');
  assert.ok(adentro('desencarnada-velo', A.coronilla) && adentro('desencarnada-peineta', A.coronilla), 'el velo no cuelga de la peineta');
  assert.ok(adentro('desencarnada-velo', A.cara), 'el velo no le tapa la cara');
  assert.ok(adentro('desencarnada-dia', A.corazon) && adentro('desencarnada-torso', A.corazon), 'el día no sale del corazón');
  assert.ok(adentro('desencarnada-panuelo', A.nudo), 'el pañuelo no está anudado al cuello');
  assert.ok(adentro('desencarnada-pollera', A.cintura) && adentro('desencarnada-torso', A.cintura), 'la pollera no sale de la cintura');
  for (const p of PIEZAS_DESENCARNADA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['desencarnada-pollera', 'desencarnada-calavera', 'desencarnada-torso']) assert.match(PIEZAS_DESENCARNADA.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_DESENCARNADA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de la señora están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨la bella senora desencarnada⟩'), tokens.indexOf('⟨/la bella senora desencarnada⟩'));
  const usadas = new Set(PIEZAS_DESENCARNADA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-desencarnada-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de la señora`);
  assert.match(bloque, /luzbelito-interior-frontal/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨la bella senora desencarnada⟩ */'), sitio.indexOf('/* ⟨/la bella senora desencarnada⟩ */'));
  for (const clase of new Set([...figura.matchAll(/class="(bt-desencarnada-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('espera en la banquina de este lado: delante de los fierros, sin taparle nada a nadie', () => {
  // Está parada abajo del asfalto, en la banquina de este lado.
  assert.ok(SENORA.piso > RUTA.asfalto.abajo && SENORA.piso < 640);
  const [x0, y0] = alRecinto([-64, -320]);
  const [x1, y1] = alRecinto([64, 0]);
  assert.ok(x0 > 0 && x1 < 900 && y0 > RUTA.horizonte, 'se sale de la ruta');
  for (const [id, [ox, oy]] of Object.entries(OJOS_DE_LA_RUTA)) {
    if (id === ID) continue;
    assert.ok(!(ox > x0 - 12 && ox < x1 + 12 && oy > y0 - 12 && oy < y1 + 12), `${id} queda adentro de la señora`);
  }
  for (const [id, [cx, cy, r]] of Object.entries(COSAS_DE_LA_RUTA)) assert.ok(cx - r > x1 || cx + r < x0 || cy + r < y0, `${id} queda adentro de la señora`);
  // Los fierros van en la capa de antes: pasan por detrás de ella. Y los yuyos de adelante le tapan los pies.
  const escena = escenaRuta(nombres);
  assert.ok(escena.indexOf('class="fierros"') < escena.indexOf(`data-marco="${ID}"`), 'los fierros le pasan por delante');
  assert.ok(escena.indexOf(`data-marco="${ID}"`) < escena.indexOf('/bestiario/ruta-frente.webp'), 'los yuyos no le tapan los pies');
});

test('la mano del guante llega al velo para levantarlo, y el corazón late doble', () => {
  const [hx, hy] = manoDelVelo(ALZA);
  const [kx, ky] = SENORA_ARMADO.coronilla;
  assert.ok(Math.hypot(hx - kx, hy - ky) < 48, `la mano queda a ${Math.hypot(hx - kx, hy - ky).toFixed(0)} de la peineta`);
  const golpes: number[] = [];
  let antes = 0;
  for (let i = 0; i < 200; i++) {
    const v = latido(i / 200 / 1.05);
    if (v > 0.5 && antes <= 0.5) golpes.push(i);
    antes = v;
  }
  assert.equal(golpes.length, 2, 'no late doble');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarDesencarnadaCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive esperando: le late el corazón, mira la ruta, la despeina el viento, se acomoda la mantilla y suspira', () => {
  const hechas: Record<Accion, number> = { mira: 0, viento: 0, acomoda: 0, suspira: 0, dia: 0 };
  const latidos = new Set<string>();
  let panuelo = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarDesencarnadaCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      latidos.add(dom.de('dia', 'opacity'));
      panuelo = Math.max(panuelo, Math.abs(Number(/rotate\(([-\d.]+)/.exec(dom.de('panuelo', 'transform'))![1])));
      assert.equal(escalaYDelVelo(dom.de('velo', 'transform')), 1, 'se levantó el velo sin que la toquen');
      assert.equal(dom.de('cuencas', 'opacity'), '0');
      if (i % 30 === 0) for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  assert.equal(hechas.dia, 0);
  for (const a of ['mira', 'viento', 'acomoda', 'suspira'] as const) assert.ok(hechas[a] >= 2, `no ${a} (${hechas[a]})`);
  assert.ok(latidos.size > 10, 'el corazón no late');
  assert.ok(panuelo > 30, 'el viento no le vuela el pañuelo');
});

test('tocada, se le viene el día: se levanta el velo, se prenden las cuencas, el día crece en el pecho; y vuelve a esperar', () => {
  const dom = nuevo();
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarDesencarnadaCon(dom.marcos, esc, azar(5));
  poner(0.3);
  vivo.mover(0.3, 1 / 60);
  dom.oyentes.get('click')!({});
  let velo = 1;
  let cuencas = 0;
  let dia = 0;
  for (let i = 1; i <= 60 * 4.8; i++) {
    const t = 0.3 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    velo = Math.min(velo, escalaYDelVelo(dom.de('velo', 'transform')));
    cuencas = Math.max(cuencas, Number(dom.de('cuencas', 'opacity')));
    dia = Math.max(dia, Number(dom.de('dia', 'opacity')));
  }
  assert.ok(velo < 0.25, 'no se levanta el velo');
  assert.ok(cuencas > 0.9, 'no se le prenden las cuencas');
  assert.ok(dia > 0.9, 'no se le viene el día');
  assert.equal(escalaYDelVelo(dom.de('velo', 'transform')), 1, 'no baja el velo');
  assert.equal(vivo.estado().hechas.dia, 1);
  assert.deepEqual(dichos[0], [ID, VERSO[0], VERSO[1]]);
  assert.equal(vivo.reaccionar('otro', 0), false);
  assert.equal(vivo.reaccionar(ID, 20), true);
  assert.ok(DURA.dia > 4);

  const q = nuevo();
  const quieto = escenario(true);
  const vq = armarDesencarnadaCon(q.marcos, quieto.esc, azar(3));
  const antes = q.foto();
  q.oyentes.get('click')!({});
  const elDia = q.foto();
  assert.notDeepEqual(elDia, antes);
  assert.equal(q.de('dia', 'opacity'), String(EL_DIA.dia));
  vq.mover(5, 0);
  vq.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), elDia, 'con movimiento reducido se movió sola');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), antes);
  assert.equal(QUIETO.velo, 0);
});

test('la ficha: el retrato es el día, al costado de la ruta; la estampa dice qué es del dibujo y qué de la letra', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/ruta-lejos.webp') && svg.includes('/bestiario/desencarnada-calavera.webp'));
  const [x0, y0, w, h] = r.caja;
  for (const p of [[-60, -6], [60, -6], [0, -320], manoDelVelo(ALZA)] as const) {
    const [x, y] = alRecinto(p);
    assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  }
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.equal(b.tema, 'juguetes-perdidos');
  assert.match(b.estampa, /Luzbelito/);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /letra/);
});

test('la isla de la señora se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/desencarnada.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco|trazos/.test(r)), []);
});
