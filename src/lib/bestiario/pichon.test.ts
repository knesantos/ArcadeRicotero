import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_PICHON, PICHON_PERSONAJE } from './arte-pichon.ts';
import { AGACHADO, HONDO, PICHON, PICHON_ARMADO, PLUMAS, QUIETO, TIROS, alRecinto, marcas, pluma, type Punto } from './rig-pichon.ts';
import { PRISION } from './rig.ts';
import { VECINOS_DE_LA_PRISION, escenaPrision } from './escenas.ts';
import { DURA, TOQUE_T, armarPichonCon, type Accion } from '../../scripts/bestiario/pichon.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El pichón (`D-73`, vigesimoquinta vuelta): que sea un títere entero a aerógrafo, parado en el alféizar de la
 * ventana enrejada de la prisión, detrás de los barrotes y sin tapar a los titanes; que viva solo como pichón de
 * cornisa, que tocado le tiren y zafe, que cada tiro deje un agujero y un palito en la pizarra, y que la pose de la
 * isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; verso: string[] }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-pichon';
const atras = capasDe('la-prision', 'atras', nombres, 1, ID);
const figura = capasDe('la-prision', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_PICHON.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
/** La caja de una pieza en el recinto. */
const enRecinto = (nombre: string): [number, number, number, number] => {
  const [x0, y0, w, h] = caja(nombre);
  const [a, b] = alRecinto([x0, y0]);
  return [a, b, w * PICHON.escala, h * PICHON.escala];
};
const nuevo = () => domDeJuguete([atras, figura], 'titere--pichon');
const V = PRISION.ventana;

test('el pichón es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(atras, /<g class="titere titere--pichon" data-id="el-pichon" role="button" tabindex="0" aria-label="El pichón">/);
  for (const p of ['entero', 'pichon', 'cuerpo', 'bulto', 'plumon', 'alas', 'ala', 'cola', 'cabeza', 'parpado', 'pata-1', 'pata-2', ...Array.from({ length: TIROS }, (_, i) => `rayita-${i + 1}`)]) {
    assert.ok(atras.includes(`data-parte="${p}"`), `al pichón le falta ${p}`);
  }
  for (const p of ['delante', 'esquirlas', 'fogonazo', ...PLUMAS.map((_, i) => `pluma-${i + 1}`), ...Array.from({ length: TIROS }, (_, i) => `agujero-${i + 1}`)]) {
    assert.ok(figura.includes(`data-parte="${p}"`), `a los tiros les falta ${p}`);
  }
  // Lo de delante de la reja no se toca: el toque es uno solo, el del pichón.
  assert.doesNotMatch(figura, /data-id=/);
  assert.match(figura, /pointer-events="none"/);
  const imagenes = new Set([...(atras + figura).matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_PICHON.map((p) => p.nombre).sort());
  const A = PICHON_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`pichon-pata-${n + 1}`, A.caderas[n]) && adentro('pichon-cuerpo', A.caderas[n]), `la pata ${n + 1} no sale de la cadera`);
    assert.ok(adentro(`pichon-pata-${n + 1}`, A.pies[n]), `el pie ${n + 1} se sale de su pata`);
  }
  assert.ok(adentro('pichon-cabeza', A.ojo) && adentro('pichon-parpado', A.ojo), 'el ojo no está en la cara');
  assert.ok(adentro('pichon-cabeza', A.cuello) && adentro('pichon-cuerpo', A.cuello), 'la cabeza no se apoya en el cuello');
  assert.ok(adentro('pichon-cabeza', A.pico) && adentro('pichon-cabeza', A.cabeza), 'el pico no está en la cabeza');
  assert.ok(adentro('pichon-ala', A.hombro) && adentro('pichon-alas', A.hombro) && adentro('pichon-cuerpo', A.hombro), 'las alas no salen del hombro');
  assert.ok(adentro('pichon-cola', A.cola) && adentro('pichon-cuerpo', A.cola), 'la cola no sale del cuerpo');
  assert.ok(adentro('pichon-cuerpo', A.panza) && adentro('pichon-plumon', A.panza), 'el plumón no está en el cuerpo');
  for (const [x, y] of A.rayitas) assert.ok(adentro('pichon-pizarra', [x, y]), 'un palito cae fuera de la pizarra');
  assert.ok(adentro('pichon-alfeizar', A.lata) && adentro('pichon-lata', [A.lata[0], -10]), 'la lata está en el aire');
  for (const p of PIEZAS_PICHON) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['pichon-cuerpo', 'pichon-cabeza', 'pichon-ala', 'pichon-alfeizar', 'pichon-canto', 'pichon-lata']) assert.match(PIEZAS_PICHON.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_PICHON.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del pichón están en su bloque de tokens.css, medidas en Oktubre, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el pichon⟩'), tokens.indexOf('⟨/el pichon⟩'));
  const usadas = new Set(PIEZAS_PICHON.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-pichon-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12 && usadas.size <= 20, `usa ${usadas.size} tintas`);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del pichón`);
  for (const archivo of ['oktubre-frontal.jpg', 'oktubre-trasera.jpg']) assert.ok(bloque.includes(archivo), `no dice que midió en ${archivo}`);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el pichon⟩ */'), sitio.indexOf('/* ⟨/el pichon⟩ */'));
  assert.match(suyo, /\.titere--pichon \{ cursor: pointer; \}/);
  assert.match(suyo, /\.pichon-tiros \{ pointer-events: none; \}/);
});

test('está en el alféizar de la ventana, con el ojo donde estaban sus ojos en lo oscuro', () => {
  assert.equal(PICHON_PERSONAJE.ancla, PICHON.x);
  const [ox, oy] = VECINOS_DE_LA_PRISION[ID]!;
  const [ex, ey] = alRecinto(PICHON_ARMADO.ojo);
  assert.ok(Math.hypot(ex - ox, ey - oy) < 6, `el ojo quedó en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  // Parado en el alféizar: los pies entre el hueco y el canto de la piedra.
  const [, piso] = alRecinto([0, 0]);
  assert.ok(piso >= V.abajo && piso <= V.abajo + 14, `pisa en ${piso}`);
  // Preso detrás de los barrotes: uno le pasa por delante del cuerpo, y el ojo queda entre dos.
  const barrotes = [0, 1, 2, 3, 4, 5, 6].map((i) => V.x0 + ((V.x1 - V.x0) * (i + 0.5)) / 7);
  const [c0] = alRecinto([caja('pichon-cuerpo')[0], 0]);
  const [c1] = alRecinto([caja('pichon-cuerpo')[0] + caja('pichon-cuerpo')[2], 0]);
  assert.ok(barrotes.some((b) => b > c0 && b < c1), 'ningún barrote le pasa por delante');
  assert.ok(barrotes.some((b, i) => i < 6 && ex > b + 3 + 4 * PICHON.escala && ex < barrotes[i + 1]! - 2.7 - 4 * PICHON.escala), 'un barrote le tapa el ojo');
  // Y es grande: se ve y se toca en un teléfono.
  const alto = -alRecinto([0, caja('pichon-cabeza')[1]])[1] + piso;
  assert.ok(alto >= 60 && alto <= 85, `mide ${alto.toFixed(0)} de alto`);
});

test('todo lo suyo queda adentro del hueco de la ventana y arriba del alféizar, y no tapa a los titanes ni a nadie', () => {
  const delante = new Set(['pichon-jamba', 'pichon-agujero', 'pichon-esquirlas', 'pichon-fogonazo', 'pichon-pluma', 'pichon-copo']);
  for (const p of PIEZAS_PICHON.filter((q) => !delante.has(q.nombre) && q.nombre !== 'pichon-rayita')) {
    const [x, y, w, h] = enRecinto(p.nombre);
    assert.ok(x >= V.x0 - 0.01 && x + w <= V.x1 + 0.01, `${p.nombre} se sale del hueco: ${x.toFixed(0)} a ${(x + w).toFixed(0)}`);
    assert.ok(y >= V.clave && y + h <= V.abajo + 14.01, `${p.nombre} se sale por arriba o por abajo: ${y.toFixed(0)} a ${(y + h).toFixed(0)}`);
  }
  // Ni saltando con las alas abiertas se sale por arriba del hueco.
  assert.ok(alRecinto([0, caja('pichon-alas')[1] - 24])[1] > V.hombro, 'el salto se le sale del arco');
  // Lo de delante de la reja: la jamba es la piedra del marco, y los agujeros nuevos caen en ella o en el canto.
  const [jx, jy, jw, jh] = enRecinto('pichon-jamba');
  assert.ok(jx >= V.x1 && jx + jw <= V.x1 + 14 && jy + jh <= V.abajo + 14, 'la jamba no está en el marco');
  for (const p of PICHON_ARMADO.agujeros) {
    const [x, y] = alRecinto(p);
    const enJamba = x > V.x1 + 2 && x < V.x1 + 12;
    const enCanto = y > V.abajo + 2 && y < V.abajo + 14 && x > V.x0 && x < V.x1;
    assert.ok(enJamba || enCanto, `un agujero cae en ${x.toFixed(0)}, ${y.toFixed(0)}`);
  }
  // Los titanes miran desde la derecha de la ventana: ni las esquirlas, ni las plumas, ni el fogonazo les llegan.
  const [tx, ty] = VECINOS_DE_LA_PRISION['los-titanes-del-orden-viril']!;
  let derecha = 0;
  for (let i = 0; i < PLUMAS.length; i++) for (let k = 0; k <= 20; k++) derecha = Math.max(derecha, alRecinto([pluma(i, k / 20).x + 5, 0])[0]);
  for (const p of PICHON_ARMADO.agujeros) derecha = Math.max(derecha, alRecinto([p[0] + caja('pichon-esquirlas')[2] * 0.5, 0])[0]);
  const [fx, fy] = alRecinto(PICHON_ARMADO.fogonazo);
  derecha = Math.max(derecha, fx + caja('pichon-fogonazo')[2] * 0.6 * PICHON.escala);
  assert.ok(derecha < tx - 8, `lo de los tiros llega hasta ${derecha.toFixed(0)}`);
  // Los ojos de los demás no le quedan adentro.
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DE_LA_PRISION)) {
    if (id === ID) continue;
    assert.ok(!(vx > V.x0 && vx < V.x1 + 14 && vy > V.clave && vy < V.abajo + 14), `${id} queda adentro de la ventana`);
    assert.ok(Math.hypot(vx - fx, vy - fy) > 40 || id === 'los-titanes-del-orden-viril' && vx - fx > 40, `el fogonazo le tapa los ojos a ${id}`);
  }
  assert.ok(Math.hypot(tx - fx, ty - fy) > 60);
  // Tirado del lado de la calle no se le ve nada: el recorte del canto, y lo más alto de él baja más que eso.
  assert.match(atras, new RegExp(`<clipPath id="pichon-canto-recorte"><rect x="-120" y="-200" width="240" height="${200 + PICHON_ARMADO.canto}"/></clipPath>`));
  const arriba = Math.min(caja('pichon-cabeza')[1], caja('pichon-cuerpo')[1], caja('pichon-plumon')[1]);
  assert.ok(arriba + HONDO > PICHON_ARMADO.canto, `con ${HONDO} de hondo asoma hasta ${arriba + HONDO}`);
  assert.ok(!PICHON_PERSONAJE.retrato!.cuerpo().includes('id="pichon-canto-recorte"'), 'el retrato pisa el recorte del títere');
});

test('en la escena va detrás de la reja, después de las banderas de la calle, y los tiros delante', () => {
  const escena = escenaPrision(nombres);
  const suyo = escena.indexOf(`data-marco="${ID}" data-capa="atras"`);
  const tiros = escena.indexOf(`data-marco="${ID}" data-capa="figura"`);
  assert.ok(suyo > 0 && tiros > 0, 'no está en la escena');
  assert.ok(escena.indexOf('data-bandera="4"') < suyo, 'las banderas le quedan delante');
  assert.ok(suyo < escena.indexOf('/bestiario/prision-reja.webp'), 'la reja no le queda delante');
  assert.ok(escena.indexOf('/bestiario/prision-reja.webp') < tiros, 'la reja tapa los tiros');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarPichonCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  assert.equal(marcas(QUIETO).transform.pichon, 'translate(0 0)');
  assert.equal(marcas(QUIETO).opacity['agujero-1'], '0');
});

test('vive solo: picotea, se esponja, se sacude, se rasca, mira con un ojo y con el otro, duerme, pasea y pestañea', () => {
  const hechas: Record<Accion, number> = { picotea: 0, esponja: 0, sacude: 0, rasca: 0, mira: 0, duerme: 0, pasea: 0, tiro: 0 };
  let pestaneos = 0;
  let vueltas = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarPichonCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    let vuelto = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = Number(dom.de('parpado', 'opacity'));
      if (p > 0.9 && !cerrado) pestaneos++;
      cerrado = p > 0.9;
      const otro = /scale\(-/.test(dom.de('cabeza', 'transform'));
      if (otro && !vuelto) vueltas++;
      vuelto = otro;
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
    assert.equal(vivo.estado().tiros, 0);
  }
  for (const a of ['picotea', 'esponja', 'sacude', 'rasca', 'mira', 'duerme', 'pasea'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.tiro, 0, 'le tiraron sin que lo toquen');
  assert.ok(pestaneos >= 10, `pestañeó ${pestaneos} veces`);
  assert.ok(vueltas >= 3, `dio vuelta la cabeza ${vueltas} veces`);
});

test('tocado le tiran: fogonazo, salta con las alas abiertas, le vuelan las plumas, se tira, queda un agujero, asoma, hace el palito y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarPichonCon(dom.marcos, esc, azar(3));
  let t = 1;
  poner(t);
  vivo.mover(t, 1 / 60);
  const tirar = (): Record<string, number> => {
    dom.oyentes.get('click')!({});
    const visto = { fogonazo: 0, alas: 0, plumas: 0, esquirlas: 0, hondo: 0, asoma: Infinity, vuelta: 0, accion: 0 };
    const t0 = t;
    for (let i = 1; i <= 60 * DURA.tiro; i++) {
      t = t0 + i / 60;
      const u = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      visto.fogonazo = Math.max(visto.fogonazo, Number(dom.de('fogonazo', 'opacity')));
      visto.alas = Math.max(visto.alas, Number(dom.de('alas', 'opacity')));
      visto.plumas = Math.max(visto.plumas, ...PLUMAS.map((_, k) => Number(dom.de(`pluma-${k + 1}`, 'opacity'))));
      visto.esquirlas = Math.max(visto.esquirlas, Number(dom.de('esquirlas', 'opacity')));
      const [, y] = trasladoDe(dom.de('pichon', 'transform'));
      if (u > TOQUE_T.escondido[0] && u < TOQUE_T.escondido[1]) visto.hondo = Math.max(visto.hondo, y);
      if (u > TOQUE_T.asoma[1] && u < TOQUE_T.mira[1]) visto.asoma = Math.min(visto.asoma, y);
      if (u > TOQUE_T.mira[0] && u < TOQUE_T.mira[1] && /scale\(-/.test(dom.de('cabeza', 'transform'))) visto.vuelta = 1;
      if (i === 60 * 4 && vivo.estado().accion === 'tiro') visto.accion = 1;
    }
    // Un rato después, haciendo otra cosa, el agujero sigue ahí.
    for (let i = 1; i <= 60 * 6; i++) {
      t += 1 / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
    }
    return visto;
  };
  const visto = tirar();
  assert.ok(visto.fogonazo > 0.9, 'no hubo fogonazo');
  assert.ok(visto.alas > 0.9, 'no abrió las alas');
  assert.ok(visto.plumas > 0.9, 'no le volaron plumas');
  assert.ok(visto.esquirlas > 0.5, 'la bala no saltó la piedra');
  assert.ok(visto.hondo >= HONDO * 0.98, `se tiró ${visto.hondo.toFixed(0)}`);
  // Asomado se le ve la cabeza y nada más: el ojo arriba del canto, los pies abajo.
  const ojo = PICHON_ARMADO.ojo[1];
  assert.ok(visto.asoma + ojo < PICHON_ARMADO.canto - 4 && visto.asoma > -ojo * 0.4, `asomado quedó a ${visto.asoma.toFixed(0)}`);
  assert.equal(visto.vuelta, 1, 'no miró el agujero con el otro ojo');
  assert.equal(visto.accion, 1);
  // El agujero nuevo y el palito se quedan.
  assert.equal(dom.de('agujero-1', 'opacity'), '1');
  assert.equal(dom.de('rayita-1', 'opacity'), '1');
  assert.equal(dom.de('agujero-2', 'opacity'), '0');
  const [x, y] = trasladoDe(dom.de('pichon', 'transform'));
  assert.ok(Math.abs(x) < 13 && Math.abs(y) < 2, `quedó en ${x}, ${y}`);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
  // Cada tiro suma uno; al séptimo, la pared y la pizarra vuelven a empezar.
  for (let n = 2; n <= TIROS; n++) {
    tirar();
    assert.equal(dom.de(`agujero-${n}`, 'opacity'), '1');
    assert.equal(dom.de(`rayita-${n}`, 'opacity'), '1');
  }
  tirar();
  assert.equal(vivo.estado().tiros, 1);
  assert.equal(dom.de('agujero-1', 'opacity'), '1');
  assert.equal(dom.de('agujero-2', 'opacity'), '0');
  assert.equal(dichos.length, TIROS + 1);
  // Y dice el verso de la letra.
  assert.deepEqual(datos.bestias.find((b) => b.id === ID)!.verso, ['Practicamos tiro al pichón']);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de parado a agachado, con las plumas en el aire, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarPichonCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('cuerpo', 'transform'), marcas(AGACHADO).transform.cuerpo);
  assert.equal(dom.de('plumon', 'opacity'), '1');
  assert.ok(PLUMAS.some((_, i) => Number(dom.de(`pluma-${i + 1}`, 'opacity')) > 0.9), 'no hay plumas en el aire');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('cuerpo', 'transform'), marcas(QUIETO).transform.cuerpo);
  assert.equal(dom.de('pluma-1', 'opacity'), '0');
  assert.equal(dichos.length, 2);
});
