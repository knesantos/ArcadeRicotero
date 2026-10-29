import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_MANDINGA } from './arte-mandinga.ts';
import { GENTIL, MANDINGA, MANDINGA_ARMADO, MANGA, QUIETO, SOMBRA, alRecinto, manoCon, type Punto } from './rig-mandinga.ts';
import { LUZBELITO } from './rig.ts';
import { VECINOS_DEL_INFIERNO, escenaInfierno } from './escenas.ts';
import { DURA, ENCANDILA_T, armarMandingaCon, type Accion } from '../../scripts/bestiario/mandinga.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * Mandinga (`D-73`, vigesimosegunda vuelta): que sea un títere de sombra entero, sostenido con varillas, en el
 * damero del infierno sin taparle nada a nadie, con su sombra chinesca en la pared del fondo, que la mano
 * llegue al sombrero y la manga a la nariz, que tocado encandile y se vaya de canto, y que la pose de la isla
 * sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'mandinga';
const atras = capasDe('el-infierno', 'atras', nombres, 1, ID);
const figura = capasDe('el-infierno', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_MANDINGA.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([atras, figura], 'titere--mandinga');
const escalaX = (t: string): number => Number(/scale\(([-\d.]+) 1\)/.exec(t)![1]);

test('Mandinga es un títere de sombra entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--mandinga" data-id="mandinga" role="button" tabindex="0" aria-label="Mandinga">/);
  for (const p of ['entero', 'recorte', 'cuerpo', 'cabeza', 'sombrero', 'cascabel', 'brazo-1', 'antebrazo-1', 'varilla-1', 'brazo-2', 'antebrazo-2', 'varilla-2', 'llama', 'resplandor', 'destello']) assert.ok(figura.includes(`data-parte="${p}"`), `a Mandinga le falta ${p}`);
  assert.ok(atras.includes('data-parte="sombra"') && !atras.includes('class="titere'), 'la sombra de la pared no está, o se puede tocar');
  const imagenes = new Set([...(atras + figura).matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_MANDINGA.map((p) => p.nombre).sort());
  const A = MANDINGA_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`mandinga-brazo-${n + 1}`, A.hombros[n]) && adentro('mandinga-cuerpo', A.hombros[n]), `el brazo ${n + 1} no sale del hombro`);
    assert.ok(adentro(`mandinga-brazo-${n + 1}`, A.codos[n]) && adentro(`mandinga-antebrazo-${n + 1}`, A.codos[n]), `el codo ${n + 1} no une los dos tramos`);
    assert.ok(adentro(`mandinga-antebrazo-${n + 1}`, A.manos[n]), `la mano ${n + 1} se sale de su antebrazo`);
  }
  assert.ok(adentro('mandinga-cabeza', A.cuello) && adentro('mandinga-cuerpo', A.cuello), 'la cabeza no se apoya en el cuello');
  assert.ok(adentro('mandinga-cabeza', A.nariz) && adentro('mandinga-cabeza', A.cara), 'la cara no está en la cabeza');
  assert.ok(adentro('mandinga-sombrero', A.copa) && adentro('mandinga-sombrero', A.cascabel) && adentro('mandinga-cascabel', A.cascabel), 'el cascabel no cuelga del ala');
  assert.ok(adentro('mandinga-candil', A.candil) && adentro('mandinga-llama', A.llama) && adentro('mandinga-resplandor', A.llama) && adentro('mandinga-destello', A.llama), 'la llama no está en el candil');
  assert.ok(adentro('mandinga-cuerpo', A.varilla), 'la varilla no lo sostiene');
  for (const p of PIEZAS_MANDINGA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['mandinga-cuerpo', 'mandinga-cabeza', 'mandinga-botas']) assert.match(PIEZAS_MANDINGA.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_MANDINGA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de Mandinga están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨mandinga⟩'), tokens.indexOf('⟨/mandinga⟩'));
  const usadas = new Set(PIEZAS_MANDINGA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-mandinga-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 7);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de Mandinga`);
  assert.match(bloque, /momo-sampler\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨mandinga⟩ */'), sitio.indexOf('/* ⟨/mandinga⟩ */'));
  for (const clase of new Set([...figura.matchAll(/class="(bt-mandinga-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('se para adelante en el damero sin taparle nada a nadie, y la sombra va en la pared, detrás de Luzbelito', () => {
  const [x0, y0] = alRecinto([-60, -300]);
  const [x1] = alRecinto([90, 0]);
  assert.ok(x0 > 0 && x1 < 900 && MANDINGA.piso < 640);
  for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_INFIERNO)) {
    if (id === ID) continue;
    assert.ok(!(ox > x0 - 12 && ox < x1 + 12 && oy > y0 - 12 && oy < MANDINGA.piso), `${id} queda adentro de Mandinga`);
  }
  assert.ok(x0 > LUZBELITO.x, 'se para encima de Luzbelito');
  // La sombra pisa donde la pared se junta con el piso.
  assert.ok(SOMBRA.piso > 300 && SOMBRA.piso < 360, 'la sombra no pisa la pared');
  const escena = escenaInfierno(nombres);
  assert.ok(escena.indexOf(`data-marco="${ID}" data-capa="atras"`) < escena.indexOf('data-id="luzbelito"'), 'la sombra va delante de Luzbelito');
  assert.ok(escena.indexOf('data-id="luzbelito"') < escena.indexOf(`data-marco="${ID}" data-capa="figura"`), 'Luzbelito le tapa el títere');
});

test('la mano alcanza el sombrero para el saludo, y la manga llega a la nariz', () => {
  const [hx, hy] = manoCon(GENTIL.brazos[0], GENTIL.codos[0]);
  const [kx, ky] = MANDINGA_ARMADO.copa;
  assert.ok(Math.hypot(hx - (kx - 18), hy - (ky - 26)) < 28, `la mano queda a ${Math.hypot(hx - (kx - 18), hy - (ky - 26)).toFixed(0)} del sombrero`);
  const [mx, my] = manoCon(MANGA.brazo, MANGA.codo);
  const [nx, ny] = MANDINGA_ARMADO.nariz;
  assert.ok(Math.hypot(mx - nx, my - ny) < 16, `la manga queda a ${Math.hypot(mx - nx, my - ny).toFixed(0)} de la nariz`);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarMandingaCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('vive gentil: saluda, se seca la nariz, baila la conga, se ríe y mira a Luzbelito; la llama tiembla siempre', () => {
  const hechas: Record<Accion, number> = { saluda: 0, manga: 0, conga: 0, risa: 0, mira: 0, encandila: 0 };
  const llamas = new Set<string>();
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarMandingaCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      llamas.add(dom.de('llama', 'transform'));
      assert.equal(escalaX(dom.de('recorte', 'transform')), 1, 'se puso de canto sin que lo toquen');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['saluda', 'manga', 'conga', 'risa', 'mira'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.encandila, 0);
  assert.ok(llamas.size > 40, `la llama no tiembla (${llamas.size})`);
});

test('tocado encandila y se va: la sombra crece en la pared, el fogonazo, se pone de canto, y vuelve', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarMandingaCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  let sombra = 0;
  let destello = 0;
  let deCanto = 1;
  let sinSombrero = false;
  for (let i = 1; i <= 60 * DURA.encandila; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    sombra = Math.max(sombra, Number(dom.de('sombra', 'opacity')));
    destello = Math.max(destello, Number(dom.de('destello', 'opacity')));
    const u = t - 1;
    if (u > ENCANDILA_T.se_va[1] && u < ENCANDILA_T.vuelve[0]) deCanto = Math.min(deCanto, escalaX(dom.de('recorte', 'transform')));
    if (u > ENCANDILA_T.saluda[1] && u < ENCANDILA_T.se_va[0]) sinSombrero ||= dom.de('sombrero', 'transform') !== 'translate(0 0) rotate(0 -4 -252)';
  }
  assert.ok(sinSombrero, 'no se sacó el sombrero');
  assert.ok(sombra > 0.7, 'la sombra no se puso negra');
  assert.ok(destello > 0.95, 'no hubo fogonazo');
  assert.ok(deCanto < 0.01, 'no se fue');
  assert.equal(escalaX(dom.de('recorte', 'transform')), 1, 'no volvió');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de quieto al saludo y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarMandingaCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('sombra', 'opacity'), String(GENTIL.sombra));
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('sombra', 'opacity'), String(QUIETO.sombra));
});
