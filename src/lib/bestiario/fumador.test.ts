import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe, retratoDe } from './elenco.ts';
import { PIEZAS_FUMADOR, RETRATO } from './arte-fumador.ts';
import { DESFILE, FUMADOR, FUMADOR_ARMADO, QUIETO, VERSO, alRecinto, brasaCon, type Punto } from './rig-fumador.ts';
import { VECINOS_DEL_TEMPLO } from './escenas.ts';
import { MOMO, marcoDelRecinto } from './rig.ts';
import { DURA, PITA, armarFumadorCon, type Accion } from '../../scripts/bestiario/fumador.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El santo fumador (`D-73`, vigésima vuelta): que sea un títere entero a aerógrafo con su anda, que duerma
 * en el ala izquierda del templo sin encimarse con nadie, que el pucho llegue a la boca, que los anillos
 * suban, que tocado desfile, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; tema?: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-santo-fumador';
const figura = capasDe('el-templo', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_FUMADOR.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--fumador');

test('el santo fumador es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--fumador" data-id="el-santo-fumador" role="button" tabindex="0" aria-label="El santo fumador de La Plata">/);
  const partes = ['entero', 'sombra', 'anda', 'santo', 'aureola', 'encandila', 'cabeza', 'ojos', 'parpado-1', 'parpado-2', 'brazo-1', 'brazo-2', 'ceniza', 'brasa', 'hilo', 'cae'];
  for (const n of [1, 2, 3, 4]) partes.push(`anillo-${n}`);
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `al santo le falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_FUMADOR.map((p) => p.nombre).sort());
  const A = FUMADOR_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`fumador-brazo-${n + 1}`, A.hombros[n]) && adentro('fumador-cuerpo', A.hombros[n]), `el brazo ${n + 1} no sale del hombro`);
    assert.ok(adentro(`fumador-brazo-${n + 1}`, A.manos[n]), `la mano ${n + 1} se sale de su brazo`);
    assert.ok(adentro(`fumador-parpado-${n + 1}`, A.ojos[n]) && adentro('fumador-ojos', A.ojos[n]) && adentro('fumador-cabeza', A.ojos[n]), `el ojo ${n + 1} no tiene párpado`);
  }
  assert.ok(adentro('fumador-flor', A.manos[0]), 'la flor no está en la mano');
  assert.ok(adentro('fumador-pucho', A.boquilla) && adentro('fumador-pucho', [A.brasa[0] - 2, A.brasa[1]]), 'el pucho no va de la boquilla a la brasa');
  assert.ok(adentro('fumador-brasa', A.brasa) && adentro('fumador-ceniza', [A.brasa[0] + 2, A.brasa[1]]) && adentro('fumador-hilo', A.brasa), 'la brasa, la ceniza o el humo no están en la punta');
  assert.ok(adentro('fumador-cabeza', A.cuello) && adentro('fumador-cuerpo', A.cuello), 'la cabeza no se apoya en el cuello');
  assert.ok(adentro('fumador-aureola', A.aureola.centro) && adentro('fumador-aureola', [A.aureola.centro[0], A.aureola.centro[1] - A.aureola.ry]), 'la aureola no rodea la cabeza');
  // La aureola es un tubo doblado en óvalo alrededor de la cabeza: el arco va por arriba.
  assert.match(PIEZAS_FUMADOR.find((p) => p.nombre === 'fumador-aureola')!.dibujo, / 0 1 0 /);
  assert.ok(adentro('fumador-anda', [0, A.anda.y]) && adentro('fumador-anda', [0, A.pedestal.y]), 'el pedestal no está en el anda');
  for (const p of PIEZAS_FUMADOR) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['fumador-cuerpo', 'fumador-cabeza', 'fumador-anda']) assert.match(PIEZAS_FUMADOR.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_FUMADOR.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 30 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del santo están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el santo fumador⟩'), tokens.indexOf('⟨/el santo fumador⟩'));
  const usadas = new Set(PIEZAS_FUMADOR.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-fumador-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del santo`);
  assert.match(bloque, /momo-sampler-frontal/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el santo fumador⟩ */'), sitio.indexOf('/* ⟨/el santo fumador⟩ */'));
  for (const clase of new Set([...figura.matchAll(/class="(bt-fumador-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('duerme en el ala izquierda del templo: adentro del marco, sin encimarse con nadie, lejos de Momo', () => {
  const marco = marcoDelRecinto('el-templo');
  const varas = FUMADOR_ARMADO.anda.varas + 4;
  const [x0, y0] = alRecinto([-varas, -300], DESFILE);
  const [x1, y1] = alRecinto([varas, 0]);
  assert.ok(x0 > marco.x && x1 < marco.x + marco.ancho, 'se sale del templo');
  for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_TEMPLO)) {
    if (id === ID) continue;
    assert.ok(!(ox > x0 - 12 && ox < x1 + 12 && oy > y0 - 12 && oy < y1 + 12), `${id} queda adentro del santo`);
  }
  assert.ok(MOMO.argolla.x - x1 > 300, 'Momo le pega cuando se hamaca');
  assert.ok(FUMADOR.techoDelHumo < y0, 'el humo se deshace antes de salir de la cabeza');
});

test('cuando pita, la boquilla del pucho llega a la boca', () => {
  const [bx, by] = brasaCon(PITA);
  const A = FUMADOR_ARMADO;
  // La boquilla está del otro lado del pucho: lo que gira la brasa, gira la boquilla.
  const dx = A.boquilla[0] - A.brasa[0];
  const dy = A.boquilla[1] - A.brasa[1];
  const a = (PITA * Math.PI) / 180;
  const [qx, qy] = [bx + dx * Math.cos(a) - dy * Math.sin(a), by + dx * Math.sin(a) + dy * Math.cos(a)];
  assert.ok(Math.hypot(qx - A.boca[0], qy - A.boca[1]) < 16, `la boquilla queda a ${Math.hypot(qx - A.boca[0], qy - A.boca[1]).toFixed(0)} de la boca`);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarFumadorCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive dormido: pita y larga anillos que suben, cabecea, le titila la aureola y se le cae la ceniza', () => {
  const hechas: Record<Accion, number> = { pita: 0, cabecea: 0, titila: 0, ceniza: 0, desfile: 0 };
  let anillos = 0;
  let suben = false;
  let apagada = false;
  let cae = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarFumadorCon(dom.marcos, esc, azar(semilla));
    let antes = NaN;
    for (let i = 1; i <= 60 * 80; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const y = trasladoDe(dom.de('anillo-1', 'transform'))[1];
      if (Number(dom.de('anillo-1', 'opacity')) > 0.1 && y < antes) suben = true;
      antes = y;
      if (Number(dom.de('aureola', 'opacity')) < 0.2) apagada = true;
      cae = Math.max(cae, Number(dom.de('cae', 'opacity')));
      // Dormido no se le abren los ojos más que un poquito, y el anda no se levanta.
      assert.equal(trasladoDe(dom.de('anda', 'transform'))[1], 0, 'lo cargaron sin que lo toquen');
      if (i % 30 === 0) for (const p of dom.partes) assert.doesNotMatch(`${p.getAttribute('transform')}${p.getAttribute('opacity')}`, /NaN|undefined|Infinity/, `${p.dataset.parte} se rompió`);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
    anillos += vivo.estado().anillos;
  }
  assert.equal(hechas.desfile, 0);
  for (const a of ['pita', 'cabecea', 'titila', 'ceniza'] as const) assert.ok(hechas[a] >= 2, `no ${a} (${hechas[a]})`);
  assert.ok(anillos >= 6, 'no larga anillos');
  assert.ok(suben, 'los anillos no suben');
  assert.ok(apagada, 'la aureola nunca titila');
  assert.ok(cae > 0.9, 'la ceniza no se cae');
});

test('tocado, sale del letargo y desfila: abre los ojos, encandila, lo cargan, se menea, larga un anillo grande; con movimiento reducido cambia de pose', () => {
  const dom = nuevo();
  const { esc, dichos, poner } = escenario(false);
  const vivo = armarFumadorCon(dom.marcos, esc, azar(5));
  poner(0.3);
  vivo.mover(0.3, 1 / 60);
  const antes = vivo.estado().anillos;
  dom.oyentes.get('click')!({});
  let alza = 0;
  let encandila = 0;
  let ojos = 0;
  const meneos = new Set<number>();
  for (let i = 1; i <= 60 * 5.2; i++) {
    const t = 0.3 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    alza = Math.max(alza, -trasladoDe(dom.de('anda', 'transform'))[1] * FUMADOR.escala);
    encandila = Math.max(encandila, Number(dom.de('encandila', 'opacity')));
    ojos = Math.max(ojos, Number(dom.de('ojos', 'opacity')));
    meneos.add(Math.sign(Math.round(Number(/rotate\(([-\d.]+)/.exec(dom.de('anda', 'transform'))![1]))));
  }
  assert.ok(alza > DESFILE.alza * 0.9, `no lo cargan (${alza.toFixed(0)})`);
  assert.ok(encandila > 0.6, 'la aureola no encandila');
  assert.equal(ojos, 1, 'no abre los ojos');
  assert.ok(meneos.has(1) && meneos.has(-1), 'no se menea para los dos lados');
  assert.ok(vivo.estado().anillos > antes, 'no larga el anillo');
  // Al final lo bajan y se vuelve a dormir.
  assert.equal(trasladoDe(dom.de('anda', 'transform'))[1], 0);
  assert.equal(dom.de('ojos', 'opacity'), '0');
  assert.equal(vivo.estado().hechas.desfile, 1);
  assert.deepEqual(dichos[0], [ID, VERSO[0], VERSO[1]]);
  assert.equal(vivo.reaccionar('otro', 0), false);
  assert.equal(vivo.reaccionar(ID, 20), true);
  assert.ok(DURA.desfile > 4);

  const q = nuevo();
  const quieto = escenario(true);
  const vq = armarFumadorCon(q.marcos, quieto.esc, azar(3));
  const foto = q.foto();
  q.oyentes.get('click')!({});
  const desfile = q.foto();
  assert.notDeepEqual(desfile, foto);
  assert.equal(q.de('ojos', 'opacity'), '1');
  vq.mover(5, 0);
  vq.mover(6, 1 / 60);
  assert.deepEqual(q.foto(), desfile, 'con movimiento reducido se movió solo');
  q.oyentes.get('keydown')!({ key: 'Enter', preventDefault: () => {} });
  assert.deepEqual(q.foto(), foto);
  assert.equal(QUIETO.parpados, 1);
});

test('la ficha: el retrato es el desfile en el templo; la estampa dice qué es del dibujo y qué de la letra', () => {
  const r = retratoDe(ID)!;
  assert.deepEqual(r.caja, RETRATO.caja);
  const svg = r.cuerpo();
  assert.ok(svg.includes('/bestiario/templo-lejos.webp') && svg.includes('/bestiario/fumador-cabeza.webp'));
  const [x0, y0, w, h] = r.caja;
  const A = FUMADOR_ARMADO;
  for (const p of [[-A.anda.varas, A.anda.y], [A.anda.varas, A.anda.y], [0, A.aureola.centro[1] - A.aureola.ry], [0, 0]] as const) {
    const [x, y] = alRecinto(p, DESFILE);
    assert.ok(x > x0 && x < x0 + w && y > y0 && y < y0 + h + DESFILE.alza, `${x.toFixed(0)}, ${y.toFixed(0)} se sale del retrato`);
  }
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.equal(b.tema, 'templo-de-momo');
  assert.match(b.estampa, /Momo sampler/);
  assert.match(b.estampa, /La Plata/);
  assert.match(b.estampa, /dibujo/);
  assert.match(b.estampa, /letra/);
});

test('la isla del santo se lleva números: no importa nada que dibuje', () => {
  const fuente = readFileSync('src/scripts/bestiario/fumador.ts', 'utf-8');
  const importa = [...fuente.matchAll(/from '([^']+)'/g)].map((m) => m[1]!);
  assert.deepEqual(importa.filter((r) => /arte|aerografo|titeres|escenas|elenco|trazos/.test(r)), []);
});
