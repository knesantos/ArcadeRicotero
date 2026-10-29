import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_CUERNOS, CUERNOS_PERSONAJE } from './arte-cuernos.ts';
import { CUENTA, CUERNOS, CUERNOS_ARMADO, DEDO_EN, CON_QUE_MANO, ORDEN, QUIETO, alRecinto, alcanzar, dedoCon, enLaCabeza, monoculoEn, type Punto } from './rig-cuernos.ts';
import { DIABLO } from './rig-diablo.ts';
import { LUZBELITO } from './rig.ts';
import { VECINOS_DEL_INFIERNO, escenaInfierno } from './escenas.ts';
import { CADA, DURA, TOQUE_T, armarCuernosCon, type Accion } from '../../scripts/bestiario/cuernos.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El diablo de muchos cuernos (`D-73`, vigesimocuarta vuelta): que sea un títere entero a aerógrafo, parado
 * en la puerta del salón sin taparle nada a nadie, que el dedo llegue a cada cuerno, que tocado cierre un ojo y
 * se los cuente de a uno hasta que le sale el de más, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-diablo-de-muchos-cuernos';
const figura = capasDe('el-infierno', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_CUERNOS.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--cuernos');
const escalaY = (t: string): number => Number(/scale\(1 ([-\d.]+)\)/.exec(t)?.[1] ?? NaN);
const giroDe = (t: string): number => Number(/rotate\(([-\d.]+)/.exec(t)?.[1] ?? NaN);

test('el diablo es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--cuernos" data-id="el-diablo-de-muchos-cuernos" role="button" tabindex="0" aria-label="El diablo de muchos cuernos">/);
  const partes = ['entero', 'cola', 'tronco', 'cuerpo', 'cabeza', 'brote', 'grito', 'pupila-1', 'pupila-2', 'parpado-1', 'parpado-2', 'ceja-1', 'ceja-2', 'cordon', 'monoculo', 'brazo-1', 'antebrazo-1', 'brazo-2', 'antebrazo-2', 'reloj', ...ORDEN.map((c) => `cuerno-${c}`)];
  for (const p of partes) assert.ok(figura.includes(`data-parte="${p}"`), `al diablo le falta ${p}`);
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_CUERNOS.map((p) => p.nombre).sort());
  const A = CUERNOS_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`cuernos-brazo-${n + 1}`, A.hombros[n]) && adentro('cuernos-cuerpo', A.hombros[n]), `el brazo ${n + 1} no sale del hombro`);
    assert.ok(adentro(`cuernos-brazo-${n + 1}`, A.codos[n]) && adentro(`cuernos-antebrazo-${n + 1}`, A.codos[n]), `el codo ${n + 1} no une los dos tramos`);
    assert.ok(adentro(`cuernos-antebrazo-${n + 1}`, A.dedos[n]), `el dedo ${n + 1} se sale del guante`);
    assert.ok(adentro('cuernos-cara', A.ojos[n]) && adentro(`cuernos-parpado-${n + 1}`, A.ojos[n]) && adentro(`cuernos-pupila-${n + 1}`, A.ojos[n]), `el ojo ${n + 1} no está en la cara`);
    assert.ok(adentro(`cuernos-ceja-${n + 1}`, A.cejas[n]), `la ceja ${n + 1} no está sobre el ojo`);
  }
  for (const c of ORDEN) assert.ok(adentro(`cuernos-cuerno-${c}`, A.cuernos[c].base) && adentro(`cuernos-cuerno-${c}`, A.cuernos[c].lomo) && adentro('cuernos-cara', A.cuernos[c].base), `el cuerno ${c} no nace de la cabeza`);
  assert.ok(adentro('cuernos-brote', A.brote) && adentro('cuernos-cara', A.brote), 'el brote no nace de la cabeza');
  assert.ok(adentro('cuernos-monoculo', A.ojos[1]) && adentro('cuernos-cuerpo', A.ojal), 'el monóculo no está en el ojo, o el cordón no sale del ojal');
  assert.ok(adentro('cuernos-cuerno-cabra', A.galera) && adentro('cuernos-cuerno-toro', A.ficha), 'la galera y la ficha no cuelgan de sus cuernos');
  assert.ok(adentro('cuernos-cara', A.cuello) && adentro('cuernos-cuerpo', A.cuello) && adentro('cuernos-cola', A.cadera) && adentro('cuernos-cuerpo', A.cintura));
  for (const p of PIEZAS_CUERNOS) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['cuernos-cuerpo', 'cuernos-cara', 'cuernos-cuerno-cabra', 'cuernos-piernas']) assert.match(PIEZAS_CUERNOS.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_CUERNOS.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 220, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del diablo están en su bloque de tokens.css, y sus clases en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el diablo de muchos cuernos⟩'), tokens.indexOf('⟨/el diablo de muchos cuernos⟩'));
  const usadas = new Set(PIEZAS_CUERNOS.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-cuernos-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 14);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del diablo`);
  assert.match(bloque, /gulp-frontal\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el diablo de muchos cuernos⟩ */'), sitio.indexOf('/* ⟨/el diablo de muchos cuernos⟩ */'));
  assert.match(suyo, /\.titere--cuernos \{ cursor: pointer; \}/);
  for (const clase of new Set([...figura.matchAll(/class="(bt-cuernos-[a-z-]+)"/g)].map((m) => m[1]!))) assert.ok(suyo.includes(`.${clase}`), `${clase} no está en su bloque de sitio.css`);
});

test('recibe a la izquierda de la puerta, sin taparle nada a nadie y sin salirse del recinto', () => {
  assert.equal(CUERNOS_PERSONAJE.ancla, CUERNOS.x);
  // Lo que ocupa: de la galera a la ficha, y de la punta del ciervo a las pezuñas.
  const [x0, y0] = alRecinto([-140, -390]);
  const [x1, y1] = alRecinto([116, 6]);
  assert.ok(x0 > 0 && y0 > 0, 'se sale del recinto');
  assert.ok(x1 < DIABLO.lugares[0]! - 40 * DIABLO.escala, 'se pisa con el diablo que mea');
  assert.ok(x1 < LUZBELITO.x - 100, 'se mete en la piedra de Luzbelito');
  // La puerta (140 a 220) le queda a la derecha: la tapa apenas con el borde.
  assert.ok(alRecinto([60, 0])[0] < 140 + 10, 'se para delante de la puerta');
  for (const [id, [ox, oy]] of Object.entries(VECINOS_DEL_INFIERNO)) {
    if (id === ID) continue;
    assert.ok(!(ox > x0 - 12 && ox < x1 + 12 && oy > y0 - 12 && oy < y1 + 12), `${id} queda adentro del diablo`);
  }
  // Va en la figura, detrás de lo de adelante.
  const escena = escenaInfierno(nombres);
  assert.ok(escena.indexOf(`data-marco="${ID}" data-capa="figura"`) < escena.indexOf('/bestiario/infierno-frente.webp'));
});

test('el dedo llega a cada cuerno, sin taparle los ojos; y el monóculo colgado cuelga del ojal', () => {
  const A = CUERNOS_ARMADO;
  for (const c of ORDEN) {
    const n = CON_QUE_MANO[c];
    const [b, k] = alcanzar(n, DEDO_EN[c]);
    const [x, y] = dedoCon(b, k, n);
    assert.ok(Math.hypot(x - DEDO_EN[c][0], y - DEDO_EN[c][1]) < 3, `el dedo no llega a contar ${c}`);
    const cerca = Math.min(Math.hypot(x - A.cuernos[c].lomo[0], y - A.cuernos[c].lomo[1]), Math.hypot(x - A.cuernos[c].base[0], y - A.cuernos[c].base[1]));
    assert.ok(cerca < 50, `el dedo queda lejos de ${c} (${cerca.toFixed(0)})`);
    for (const ojo of A.ojos) assert.ok(Math.hypot(x - ojo[0], y - ojo[1]) > 16, `la mano le tapa un ojo contando ${c}`);
  }
  // Sin llegar, el brazo queda colgando como estaba.
  const [b0, k0] = alcanzar(0, A.dedos[0]);
  assert.ok(Math.abs(b0) < 2 && Math.abs(k0) < 2, 'el brazo quieto no es el del dibujo');
  assert.deepEqual(monoculoEn(QUIETO).map(Math.round), enLaCabeza(QUIETO, A.ojos[1]).map(Math.round));
  const [mx, my] = monoculoEn({ ...QUIETO, caida: 1 });
  assert.ok(Math.abs(Math.hypot(mx - A.ojal[0], my - A.ojal[1]) - A.cordon) < 0.5 && my > A.ojal[1], 'colgado no cuelga del cordón');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarCuernosCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('espera en la puerta: convida, mira el reloj, se rasca, se le cae el monóculo, golpea la cola y pestañea', () => {
  const hechas: Record<Accion, number> = { convida: 0, reloj: 0, rasca: 0, monoculo: 0, cola: 0, cuenta: 0 };
  let pestaneos = 0;
  let reloj = 0;
  let caido = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarCuernosCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = Math.min(escalaY(dom.de('parpado-1', 'transform')), escalaY(dom.de('parpado-2', 'transform')));
      if (p > 0.9 && !cerrado) pestaneos++;
      cerrado = p > 0.9;
      reloj = Math.max(reloj, Number(dom.de('reloj', 'opacity')));
      caido = Math.max(caido, trasladoDe(dom.de('monoculo', 'transform'))[1]);
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['convida', 'reloj', 'rasca', 'monoculo', 'cola'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.cuenta, 0, 'se contó los cuernos sin que lo toquen');
  assert.ok(reloj > 0.99, 'nunca sacó el reloj');
  assert.ok(caido > 60, 'nunca se le cayó el monóculo');
  assert.ok(pestaneos >= 15 && pestaneos <= 70, `pestañeó ${pestaneos} veces`);
});

test('tocado cuenta: cierra un ojo, se cuenta los cuernos de a uno, le sale uno más, saluda y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarCuernosCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  let ojoCerrado = 1;
  const primero = new Map<string, number>();
  let brote = 0;
  let grito = 0;
  let caido = 0;
  for (let i = 1; i < 60 * DURA.cuenta; i++) {
    const u = i / 60;
    const t = 1 + u;
    poner(t);
    vivo.mover(t, 1 / 60);
    if (u > TOQUE_T.cierra[1] && u < TOQUE_T.cuenta[1]) ojoCerrado = Math.min(ojoCerrado, escalaY(dom.de('parpado-1', 'transform')));
    for (const c of ORDEN) if (!primero.has(c) && Math.abs(giroDe(dom.de(`cuerno-${c}`, 'transform'))) > 6) primero.set(c, u);
    brote = Math.max(brote, Number(dom.de('brote', 'opacity')));
    grito = Math.max(grito, Number(dom.de('grito', 'opacity')));
    caido = Math.max(caido, trasladoDe(dom.de('monoculo', 'transform'))[1]);
  }
  assert.ok(ojoCerrado > 0.95, 'no cerró el ojo para contar');
  // Cada cuerno se menea en su turno, en orden, de izquierda a derecha y el de la pera al final.
  ORDEN.forEach((c, i) => {
    const u = primero.get(c);
    assert.ok(u !== undefined, `no contó el cuerno ${c}`);
    const turno = TOQUE_T.cuenta[0] + i * CADA;
    assert.ok(u! >= turno && u! < turno + CADA, `contó ${c} fuera de su turno (${u!.toFixed(2)})`);
  });
  assert.ok(brote > 0.99, 'no le salió el de más');
  assert.ok(grito > 0.9, 'no se asustó');
  assert.ok(caido > 60, 'no se le cayó el monóculo');
  assert.equal(vivo.estado().accion, 'cuenta');
  // Al final está como estaba: el monóculo puesto y el brote adentro.
  poner(1 + DURA.cuenta + 0.01);
  vivo.mover(1 + DURA.cuenta + 0.01, 1 / 60);
  assert.ok(Math.abs(trasladoDe(dom.de('monoculo', 'transform'))[1]) < 3, 'no se puso el monóculo');
  assert.equal(dom.de('brote', 'opacity'), '0');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa a contarse los cuernos con un ojo y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarCuernosCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(escalaY(dom.de('parpado-1', 'transform')), CUENTA.parpados[0]);
  assert.equal(dom.de('brote', 'opacity'), '1');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.deepEqual(dom.foto(), antes);
});
