import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { GARUFA_PERSONAJE, PIEZAS_GARUFA } from './arte-garufa.ts';
import { GARUFA, GARUFA_ARMADO, OFRECE, QUIETO, VAGA, alRecinto, manosEn, marcas, type Punto } from './rig-garufa.ts';
import { OJOS_DE_CYBERSIBERIA, COSAS_DE_CYBERSIBERIA } from './rig-entornos.ts';
import { SAPITO } from './rig-sapito.ts';
import { escenaCybersiberia } from './escenas-entornos.ts';
import { DURA, TOQUE_T, armarGarufaCon, type Accion } from '../../scripts/bestiario/garufa.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El Rey Garufa (`D-73`, vigesimosexta vuelta): que sea un títere entero a aerógrafo en la nieve de
 * Cybersiberia, donde estaba su silueta pintada, que vague solo con el corazón entre las manos sin pisar a la
 * sapita ni a los ojos de Comboman, que tocado ofrezca el corazón, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-rey-garufa';
const figura = capasDe('cybersiberia', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_GARUFA.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--garufa');

test('el Rey Garufa es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--garufa" data-id="el-rey-garufa" role="button" tabindex="0" aria-label="El Rey Garufa">/);
  for (const p of ['entero', 'anda', 'lado', 'figura', 'capa', 'muslo-1', 'canilla-1', 'muslo-2', 'canilla-2', 'latido', 'brazo-1', 'antebrazo-1', 'cabeza', 'parpado-1', 'parpado-2', 'sonrisa', 'corona', 'vaho', 'serpentina', 'corazon', 'gotas', 'brazo-2', 'antebrazo-2', 'confeti']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al rey le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_GARUFA.map((p) => p.nombre).sort());
  for (const p of PIEZAS_GARUFA) assert.match(p.nombre, /^garufa-/);
  const A = GARUFA_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`garufa-muslo-${n + 1}`, A.caderas[n]) && adentro('garufa-cuerpo', A.caderas[n]), `el muslo ${n + 1} no sale de la cadera`);
    assert.ok(adentro(`garufa-canilla-${n + 1}`, A.rodillas[n]) && adentro(`garufa-muslo-${n + 1}`, A.rodillas[n]), `la canilla ${n + 1} no sale de la rodilla`);
    assert.ok(adentro(`garufa-brazo-${n + 1}`, A.hombros[n]) && adentro('garufa-cuerpo', A.hombros[n]), `el brazo ${n + 1} no sale del hombro`);
    assert.ok(adentro(`garufa-antebrazo-${n + 1}`, A.codos[n]) && adentro(`garufa-brazo-${n + 1}`, A.codos[n]), `el antebrazo ${n + 1} no sale del codo`);
    assert.ok(adentro(`garufa-antebrazo-${n + 1}`, A.manos[n]), `la mano ${n + 1} se sale del antebrazo`);
    assert.ok(adentro('garufa-cabeza', A.ojos[n].centro) && adentro(`garufa-parpado-${n + 1}`, A.ojos[n].centro), `el ojo ${n + 1} no está en la cara`);
  }
  assert.ok(adentro('garufa-cabeza', A.cuello) && adentro('garufa-cuerpo', A.cuello), 'la cabeza no se apoya en el cuello');
  assert.ok(adentro('garufa-corona', A.corona) && adentro('garufa-cabeza', A.corona), 'la corona no está en la cabeza');
  assert.ok(adentro('garufa-corazon', A.corazon) && adentro('garufa-cuerpo', A.hueco), 'el corazón o el hueco quedan en el aire');
  assert.ok(adentro('garufa-sonrisa', A.boca) && adentro('garufa-cabeza', A.boca), 'la boca no está en la cara');
  // El corazón queda entre las manos, quieto y ofrecido.
  for (const m of [QUIETO, OFRECE]) {
    const [[x1, y1], [x2, y2]] = manosEn(m);
    assert.ok(Math.hypot(x1 - x2, y1 - y2) < 40, 'las manos se separan más que el corazón');
    // El corazón se corre lo mismo que la mitad entre las manos.
    const [dx, dy] = trasladoDe(marcas(m).transform.corazon);
    const [[d1x, d1y], [d2x, d2y]] = A.manos;
    assert.ok(Math.hypot(dx - ((x1 + x2) / 2 - (d1x + d2x) / 2), dy - ((y1 + y2) / 2 - (d1y + d2y) / 2)) < 0.5, 'el corazón no va donde las manos');
  }
  for (const p of PIEZAS_GARUFA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['garufa-cuerpo', 'garufa-cabeza', 'garufa-corazon', 'garufa-corona']) assert.match(PIEZAS_GARUFA.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_GARUFA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 240, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del rey están en su bloque de tokens.css, medidas en Último bondi, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el rey garufa⟩'), tokens.indexOf('⟨/el rey garufa⟩'));
  const usadas = new Set(PIEZAS_GARUFA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-garufa-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 16);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del rey`);
  assert.match(bloque, /ultimo-bondi-a-finisterre/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el rey garufa⟩ */'), sitio.indexOf('/* ⟨/el rey garufa⟩ */'));
  assert.match(suyo, /\.titere--garufa \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"confeti"') && suyo.includes('"vaho"'), 'el confeti y el vaho se pueden tocar');
});

test('está parado en la nieve donde estaba su silueta, con los ojos donde estaban, y vaga sin pisar a nadie', () => {
  assert.equal(GARUFA_PERSONAJE.ancla, GARUFA.x);
  const [ox, oy] = OJOS_DE_CYBERSIBERIA[ID]!;
  const [e1, e2] = GARUFA_ARMADO.ojos.map((o) => alRecinto(o.centro));
  const [ex, ey] = [(e1![0] + e2![0]) / 2, (e1![1] + e2![1]) / 2];
  assert.ok(Math.hypot(ex - ox, ey - oy) < 6, `los ojos quedaron en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  // Vaga entre la sapita y los ojos de Comboman, y no se sale de la nieve.
  const [izq] = alRecinto([VAGA.desde - 44, 0]);
  const [der] = alRecinto([VAGA.hasta + 44, 0]);
  assert.ok(izq > SAPITO.x + 40, `a la izquierda llega a ${izq.toFixed(0)}, encima de la sapita`);
  assert.ok(der < OJOS_DE_CYBERSIBERIA['comboman']![0], `a la derecha llega a ${der.toFixed(0)}, encima de Comboman`);
  assert.ok(GARUFA.piso < 580 && GARUFA.piso > alRecinto([0, -262])[1], 'se sale de la nieve');
  for (const [id, [cx, cy, r]] of Object.entries(COSAS_DE_CYBERSIBERIA)) {
    if (id === 'el-pac-man') continue;
    assert.ok(cx + r < izq || cx - r > der || cy + r < alRecinto([0, -262])[1], `${id} le queda adentro`);
  }
  // Va en la figura: después del piso de la nieve (con las huellas) y antes de los montones de adelante.
  const escena = escenaCybersiberia(nombres);
  assert.ok(escena.indexOf('/bestiario/cyber-piso.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso le queda delante');
  assert.ok(escena.indexOf(`data-marco="${ID}"`) < escena.indexOf('/bestiario/cyber-frente.webp'), 'los montones de nieve le quedan detrás');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarGarufaCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.equal(marcas(QUIETO).transform.anda, 'translate(0 0)');
});

test('vaga: camina de ida y de vuelta sin salirse de su nieve, mira el corazón, tirita, baila un pasito, suspira, pestañea y late', () => {
  const hechas: Record<Accion, number> = { camina: 0, mira: 0, tirita: 0, pasito: 0, suspira: 0, ofrece: 0 };
  let pestaneos = 0;
  const lados = new Set<number>();
  const latidos = new Set<string>();
  let andaMin = Infinity;
  let andaMax = -Infinity;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarGarufaCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    for (let i = 1; i <= 60 * 60; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = /scale\(1 ([\d.]+)\)/.exec(dom.de('parpado-1', 'transform'));
      const k = p ? Number(p[1]) : 0;
      if (k > 0.9 && !cerrado) pestaneos++;
      cerrado = k > 0.9;
      if (i % 5 === 0) latidos.add(dom.de('latido', 'opacity'));
      const { anda, lado } = vivo.estado();
      lados.add(lado);
      andaMin = Math.min(andaMin, anda);
      andaMax = Math.max(andaMax, anda);
      assert.equal(dom.de('lado', 'transform'), `scale(${lado} 1)`);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['camina', 'mira', 'tirita', 'pasito', 'suspira'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.ofrece, 0, 'ofreció el corazón sin que lo toquen');
  assert.ok(pestaneos >= 10, `pestañeó ${pestaneos} veces`);
  assert.ok(latidos.size > 20, 'el hueco no late');
  assert.ok(andaMax - andaMin > 40, `caminó ${(andaMax - andaMin).toFixed(0)}: casi nada`);
  assert.ok(andaMin >= VAGA.desde && andaMax <= VAGA.hasta, `se salió de su nieve: ${andaMin.toFixed(0)} a ${andaMax.toFixed(0)}`);
  assert.equal(lados.size, 2, 'nunca se dio vuelta');
});

test('tocado ofrece el corazón: estira los brazos, late fuerte, gotea, sonríe, se le cae el confeti, lo guarda y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarGarufaCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { brazo: 0, latido: 0, gotas: 0, sonrisa: 0, confeti: 0, late: 0, accion: '' };
  for (let i = 1; i <= 60 * DURA.ofrece; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const b = /rotate\((-?[\d.]+)/.exec(dom.de('brazo-2', 'transform'));
    if (u > TOQUE_T.late[0] && u < TOQUE_T.late[1]) {
      visto.brazo = Math.min(visto.brazo, b ? Number(b[1]) : 0);
      const l = /scale\(([\d.]+)\)/.exec(dom.de('corazon', 'transform'));
      visto.late = Math.max(visto.late, l ? Number(l[1]) : 1);
    }
    visto.latido = Math.max(visto.latido, Number(dom.de('latido', 'opacity')));
    visto.gotas = Math.max(visto.gotas, Number(dom.de('gotas', 'opacity')));
    visto.sonrisa = Math.max(visto.sonrisa, Number(dom.de('sonrisa', 'opacity')));
    visto.confeti = Math.max(visto.confeti, Number(dom.de('confeti', 'opacity')));
    if (i === 60 * 3) visto.accion = vivo.estado().accion ?? '';
  }
  assert.ok(visto.brazo <= OFRECE.brazos[1] + 1, `el brazo giró ${visto.brazo.toFixed(0)}: no lo ofreció`);
  assert.ok(visto.late > 1.1, 'el corazón no late fuerte');
  assert.ok(visto.latido > 0.9 && visto.gotas > 0.9, 'el hueco no brilló o no goteó');
  assert.ok(visto.sonrisa > 0.9 && visto.confeti > 0.9, 'no sonrió o no se le cayó el confeti');
  assert.equal(visto.accion, 'ofrece');
  // Al final guardó el corazón contra el pecho.
  const b = /rotate\((-?[\d.]+)/.exec(dom.de('brazo-2', 'transform'));
  assert.ok(Math.abs(Number(b![1])) < 1, `quedó con el brazo en ${b![1]}`);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de parado a ofreciendo el corazón, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarGarufaCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('brazo-2', 'transform'), marcas(OFRECE).transform['brazo-2']);
  assert.equal(dom.de('sonrisa', 'opacity'), '1');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('brazo-2', 'transform'), marcas(QUIETO).transform['brazo-2']);
});
