import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_SHERIFF, SHERIFF_PERSONAJE } from './arte-sheriff.ts';
import { ABURRIDO, A_LA_ESTRELLA, BRAZO_BAJO, EMPUJA, QUIETO, SHERIFF, SHERIFF_ARMADO, alRecinto, manoEn, marcas, pechoDe, type Punto } from './rig-sheriff.ts';
import { VECINOS_DEL_TEMPLO, escenaTemplo } from './escenas.ts';
import { AIRE_DEL_PARADO, ofrendasDelTemplo, paradosEnElTemplo } from './ofrendas.ts';
import { marcoDelRecinto } from './rig.ts';
import { DURA, TOQUE_T, armarSheriffCon, type Accion } from '../../scripts/bestiario/sheriff.ts';
import { azar, domDeJuguete, escenario } from './juguete.ts';

/**
 * El Sheriff (`D-73`, vigesimonovena vuelta, `T-529`): un puestito de tiro al blanco a aerógrafo en el ala del templo,
 * con el sheriff detrás del mostrador, cuatro ladroncitos de chapa y el lugar vacío de Alí Babá; que lustre la estrella,
 * que al enderezar uno se le caiga otro, que la moneda no se le despegue, que tocado salgan los tres tiros, el tercero
 * erre y él lo tumbe con el dedo sin mirar, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-sheriff';
const figura = capasDe('el-templo', 'figura', nombres, 1, ID);
const pieza = (nombre: string) => PIEZAS_SHERIFF.find((p) => p.nombre === nombre)!;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = pieza(nombre).caja;
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--sheriff');
const giro = (transform: string): number => Number(/rotate\((-?[\d.]+)/.exec(transform)?.[1] ?? NaN);
/** Cuánto está parado un ladroncito: la escala de alto de su transform, sobre la talla. */
const parado = (transform: string): number => Number(/scale\(-?[\d.]+ ([\d.]+)\)/.exec(transform)![1]) / SHERIFF_ARMADO.talla;
const parpadoDe = (transform: string): number => Number(/scale\(1 ([\d.]+)\)/.exec(transform)?.[1] ?? NaN);

test('el sheriff es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--sheriff" data-id="el-sheriff" role="button" tabindex="0" aria-label="El Sheriff">/);
  for (const p of ['entero', 'cartel', 'blanco-1', 'blanco-2', 'blanco-3', 'blanco-4', 'agujero', 'fogonazo-1', 'fogonazo-2', 'fogonazo-3', 'sheriff', 'brazo-lejos', 'vaho', 'brillo', 'cabeza', 'pupilas', 'parpados', 'moneda', 'gota', 'hilo', 'antebrazo', 'pegada']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al sheriff le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_SHERIFF.map((p) => p.nombre).sort());
  for (const p of PIEZAS_SHERIFF) assert.match(p.nombre, /^sheriff-/);
  const A = SHERIFF_ARMADO;
  assert.ok(adentro('sheriff-cabeza', A.cuello) && adentro('sheriff-torso', A.cuello), 'la cabeza no se apoya en el cogote');
  for (const o of A.ojos) assert.ok(adentro('sheriff-cabeza', o) && adentro('sheriff-pupilas', o) && adentro('sheriff-parpados', o), 'los ojos no están en la cara');
  assert.ok(adentro('sheriff-torso', A.estrella) && adentro('sheriff-brillo', A.estrella) && adentro('sheriff-vaho', A.estrella), 'la estrella no está en el pecho');
  assert.ok(adentro('sheriff-antebrazo', A.codo) && adentro('sheriff-torso', A.codo) && adentro('sheriff-antebrazo', A.mano), 'el antebrazo no sale del codo');
  assert.ok(adentro('sheriff-brazo-lejos', A.hombro) && adentro('sheriff-torso', A.hombro), 'el brazo de lejos no sale del hombro');
  assert.ok(adentro('sheriff-frasco', A.frasco) && adentro('sheriff-agujero', A.yerro) && adentro('sheriff-cartel', A.cartel));
  // El brazo de lejos, estirado, llega con el dedo al pecho del tercer ladroncito; y la mano de cerca, a la estrella.
  const [bx, by] = pechoDe(A.blancos[2]!.x);
  assert.ok(Math.abs(Math.hypot(bx - A.hombro[0], by - A.hombro[1]) - A.largo) < 3, 'el dedo no llega al tercero');
  assert.ok(adentro('sheriff-brazo-lejos', [bx, by + 4]));
  const [mx, my] = manoEn(A_LA_ESTRELLA);
  assert.ok(Math.hypot(mx - A.estrella[0], my - A.estrella[1]) < 6, `la mano queda a ${Math.hypot(mx - A.estrella[0], my - A.estrella[1]).toFixed(1)} de la estrella`);
  // Cinco lugares en la repisa, cuatro ladroncitos: el del medio es el de Alí Babá, y está vacío.
  assert.equal(A.lugares.length, 5);
  assert.deepEqual(A.lugares.filter((x) => !A.blancos.some((b) => b.x === x)), [0]);
  const fondo = pieza('sheriff-fondo').dibujo;
  assert.ok(fondo.includes('stroke-dasharray') && fondo.includes(`translate(0 ${A.repisa})`), 'no quedó la marca del que se fue');
  // Los ladroncitos son chapa recortada, sin cara: ni un ojo, ni una boca, ni una letra.
  for (const n of ['sheriff-ladron-rojo', 'sheriff-ladron-cobre']) assert.ok(!pieza(n).dibujo.includes('--bestia-ojo-blanco') && !pieza(n).dibujo.includes('--bestia-sheriff-negro'), `${n} tiene cara`);
  for (const p of PIEZAS_SHERIFF) assert.ok(!p.dibujo.includes('<text'), `${p.nombre} trae letras`);
  // El orden: el sheriff detrás del mostrador, y el antebrazo, el frasco y el rifle por delante.
  assert.ok(figura.indexOf('data-parte="sheriff"') < figura.indexOf('sheriff-mostrador.webp') && figura.indexOf('sheriff-mostrador.webp') < figura.indexOf('data-parte="antebrazo"'));
  assert.ok(figura.indexOf('data-parte="brazo-lejos"') < figura.indexOf('sheriff-torso.webp'));
  for (const p of PIEZAS_SHERIFF) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['sheriff-fondo', 'sheriff-torso', 'sheriff-cabeza', 'sheriff-mostrador']) assert.match(pieza(n).dibujo, /url\(#grano\)/);
  const peso = PIEZAS_SHERIFF.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 40 && peso <= 240, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del sheriff están en su bloque de tokens.css, medidas en Momo sampler, y su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el sheriff⟩'), tokens.indexOf('⟨/el sheriff⟩'));
  const usadas = new Set(PIEZAS_SHERIFF.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-sheriff-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 14);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del sheriff`);
  assert.match(bloque, /public\/tapas\/momo-sampler\.jpg/);
  assert.match(bloque, /public\/tapas\/trasera\/momo-sampler\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el sheriff⟩ */'), sitio.indexOf('/* ⟨/el sheriff⟩ */'));
  assert.match(suyo, /\.titere--sheriff \{ cursor: pointer; \}/);
  for (const p of ['[data-parte^="fogonazo"]', '[data-parte="vaho"]', '[data-parte="gota"]', '[data-parte="brillo"]']) assert.ok(suyo.includes(p), `${p} se puede tocar`);
  assert.doesNotMatch(suyo, /#[0-9a-fA-F]{3,8}\b|shadow/);
});

test('vive en el ala izquierda del templo, contra la primera columna: entra en el recinto, no pisa el anda del santo fumador, y ninguna vela le cae encima', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'el-templo');
  assert.equal(SHERIFF_PERSONAJE.ancla, SHERIFF.x);
  const A = SHERIFF_ARMADO;
  const marco = marcoDelRecinto('el-templo');
  const [x0, y0] = alRecinto([A.mostrador.desde - 4, -300]);
  const [x1, y1] = alRecinto([A.mostrador.hasta + 4, 0]);
  assert.ok(x0 >= marco.x && y0 > 300 && y1 < 640, `el puestito va de x = ${x0.toFixed(0)}, y = ${y0.toFixed(0)}`);
  // El anda del santo fumador arranca en x ≈ -163 (la punta de la vara): el mostrador termina antes.
  assert.ok(x1 <= -163, `el mostrador llega a x = ${x1.toFixed(0)}`);
  // Sus ojos en la lista del templo están donde tiene los ojos.
  const [ox, oy] = VECINOS_DEL_TEMPLO[ID]!;
  const [ex, ey] = alRecinto([(A.ojos[0][0] + A.ojos[1][0]) / 2, A.ojos[0][1]]);
  assert.ok(Math.hypot(ex - ox, ey - oy) < 6, `los ojos quedaron en ${ex.toFixed(0)}, ${ey.toFixed(0)}`);
  for (const [id, [vx, vy]] of Object.entries(VECINOS_DEL_TEMPLO)) {
    if (id === ID) continue;
    assert.ok(!(vx > x0 && vx < x1 && vy > y0 && vy < y1), `${id} queda adentro del puestito`);
  }
  // Las ofrendas salen de los datos: él cuenta como parado, y ninguna tanda de velas cae en el ancho de su mostrador.
  const corre = -marco.x;
  assert.ok(paradosEnElTemplo().some(([x, aire]) => x === SHERIFF.x + corre && aire === AIRE_DEL_PARADO.titere), 'las ofrendas no lo cuentan');
  const { cerca, lejos } = ofrendasDelTemplo();
  for (const x of [...cerca.map((c) => c[0]), ...lejos]) assert.ok(x - corre < x0 - 4 || x - corre > x1 + 4, `hay velas en x = ${x - corre}, delante del mostrador`);
  const escena = escenaTemplo(nombres);
  assert.ok(escena.includes(`data-marco="${ID}" data-capa="figura"`) && escena.indexOf(`data-marco="${ID}"`) < escena.indexOf('/bestiario/templo-frente.webp'));
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'sigue siendo ojos');
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarSheriffCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  // Quieto: los cuatro parados, el brazo de lejos colgando detrás del mostrador, los párpados a media asta, y el lugar vacío se ve.
  const t = marcas(QUIETO);
  for (const n of [1, 2, 3, 4]) assert.equal(parado(t.transform[`blanco-${n}`]!), 1);
  assert.equal(giro(t.transform['brazo-lejos']!), BRAZO_BAJO);
  assert.equal(parpadoDe(t.transform.parpados!), ABURRIDO);
  assert.equal(t.opacity.agujero, '0');
  assert.equal(t.opacity.moneda, '0');
  // Colgando, la mano de lejos queda tapada por el mostrador.
  const a = (BRAZO_BAJO * Math.PI) / 180;
  const [hx, hy] = SHERIFF_ARMADO.hombro;
  const [bx, by] = pechoDe(SHERIFF_ARMADO.blancos[2]!.x);
  const manoY = hy + (bx - hx) * Math.sin(a) + (by - hy) * Math.cos(a);
  assert.ok(manoY > SHERIFF_ARMADO.mostrador.tapa + 6, `la mano de lejos queda en y = ${manoY.toFixed(0)}`);
});

test('cuida que todo esté en su sitio y no le sale: lustra la estrella, endereza uno y se le cae otro, y la moneda no se le despega', () => {
  const hechas: Record<string, number> = {};
  const visto = { frota: 0, vaho: 0, brillo: 0, brazo: BRAZO_BAJO, cuarto: 1, otros: 1, pegada: 0, hilo: 0, levanta: 0, pestañeo: 0, gota: 0, fogonazo: 0, agujero: 0, moneda: 0 };
  let pegadaAlBajar = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarSheriffCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 90; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const ante = giro(dom.de('antebrazo', 'transform'));
      visto.frota = Math.min(visto.frota, ante);
      visto.vaho = Math.max(visto.vaho, Number(dom.de('vaho', 'opacity')));
      visto.brillo = Math.max(visto.brillo, Number(dom.de('brillo', 'opacity')));
      visto.brazo = Math.min(visto.brazo, giro(dom.de('brazo-lejos', 'transform')));
      visto.cuarto = Math.min(visto.cuarto, parado(dom.de('blanco-4', 'transform')));
      for (const n of [1, 2, 3]) visto.otros = Math.min(visto.otros, parado(dom.de(`blanco-${n}`, 'transform')));
      const pegada = Number(dom.de('pegada', 'opacity'));
      visto.pegada = Math.max(visto.pegada, pegada);
      visto.hilo = Math.max(visto.hilo, Number(dom.de('hilo', 'opacity')));
      if (pegada > 0.9) visto.levanta = Math.min(visto.levanta, ante);
      // La moneda no se despega: mientras tiene la mano levantada, sigue pegada.
      if (vivo.estado().accion === 'despega' && ante < -20) pegadaAlBajar = Math.max(pegadaAlBajar, 1 - pegada);
      visto.pestañeo = Math.max(visto.pestañeo, parpadoDe(dom.de('parpados', 'transform')));
      visto.gota = Math.max(visto.gota, Number(dom.de('gota', 'opacity')));
      visto.fogonazo = Math.max(visto.fogonazo, Number(dom.de('fogonazo-1', 'opacity')), Number(dom.de('fogonazo-3', 'opacity')));
      visto.agujero = Math.max(visto.agujero, Number(dom.de('agujero', 'opacity')));
      visto.moneda = Math.max(visto.moneda, Number(dom.de('moneda', 'opacity')));
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a] = (hechas[a] ?? 0) + n;
    // Al final de cada tanda todo volvió a su sitio o está volviendo: nadie quedó tirado para siempre.
  }
  for (const a of ['lustra', 'endereza', 'despega'] as Accion[]) assert.ok((hechas[a] ?? 0) > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque ?? 0, 0);
  assert.ok(visto.frota < A_LA_ESTRELLA + 2 && visto.vaho > 0.95 && visto.brillo > 0.95, 'no lustró la estrella');
  assert.ok(visto.brazo < 2, `el brazo llegó a ${visto.brazo}`);
  // Endereza el tercero, y el que se cae es el cuarto. Los otros tres no se voltean sin que los toquen.
  assert.ok(visto.cuarto < 0.15 && visto.otros === 1, `el cuarto quedó en ${visto.cuarto} y los otros en ${visto.otros}`);
  assert.ok(visto.pegada === 1 && visto.hilo > 0.9 && visto.levanta < -40 && pegadaAlBajar < 0.01, 'la moneda no se le pegó, o se le despegó');
  assert.ok(visto.pestañeo > 0.95 && visto.gota === 1, 'no pestañea o no le cuelga la gota');
  // Sin tocarlo no hay tiros: ni fogonazo, ni agujero, ni moneda en el frasco.
  assert.equal(visto.fogonazo + visto.agujero + visto.moneda, 0);
});

test('tocado, son tres tiros a un peso: cae la moneda, dos tiros voltean, el tercero erra y él lo tumba con el dedo sin mirar; después tira del piolín y todo vuelve a su sitio', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarSheriffCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const T = TOQUE_T;
  const fogonazos = [0, 0, 0];
  const prendido = [false, false, false];
  const cayo: Array<number | null> = [null, null, null];
  const visto = { moneda: 0, agujero: 0, brazo: BRAZO_BAJO, mira: 0, parpado: 0 };
  for (let i = 1; i <= 60 * DURA.toque; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    visto.moneda = Math.max(visto.moneda, Number(dom.de('moneda', 'opacity')));
    for (const n of [0, 1, 2]) {
      const f = Number(dom.de(`fogonazo-${n + 1}`, 'opacity')) > 0.5;
      if (f && !prendido[n]) fogonazos[n]!++;
      prendido[n] = f;
      if (cayo[n] === null && parado(dom.de(`blanco-${n + 1}`, 'transform')) < 0.15) cayo[n] = u;
    }
    visto.agujero = Math.max(visto.agujero, Number(dom.de('agujero', 'opacity')));
    const brazo = giro(dom.de('brazo-lejos', 'transform'));
    visto.brazo = Math.min(visto.brazo, brazo);
    // El tercero sigue parado después del tiro que erra: no cae hasta que el dedo llega.
    if (u > T.tiros[2] && u < T.tumba[0]) assert.ok(parado(dom.de('blanco-3', 'transform')) > 0.99, `el tercero cayó solo a los ${u.toFixed(2)} s`);
    // Y mientras lo tumba, no mira: tiene la vista corrida para el otro lado y los ojos más cerrados que de costumbre.
    if (u > T.tumba[0] && u < T.tumba[1]) {
      visto.mira = Math.min(visto.mira, Number(/translate\((-?[\d.]+)/.exec(dom.de('pupilas', 'transform'))![1]));
      visto.parpado = Math.max(visto.parpado, parpadoDe(dom.de('parpados', 'transform')));
    }
    // El cuarto no se toca en todo el número.
    assert.equal(parado(dom.de('blanco-4', 'transform')), 1);
  }
  assert.equal(visto.moneda, 1, 'no cayó la moneda');
  assert.deepEqual(fogonazos, [1, 1, 1], 'no fueron tres tiros');
  // El primero y el segundo caen con su tiro; el tercero, recién con el dedo, cuando el brazo ya está arriba.
  assert.ok(cayo[0]! > T.tiros[0] && cayo[0]! < T.tiros[0] + 0.3 && cayo[1]! > T.tiros[1] && cayo[1]! < T.tiros[1] + 0.3, `cayeron a los ${cayo[0]} y ${cayo[1]} s`);
  assert.ok(cayo[2]! > T.tumba[0] && cayo[2]! <= T.tumba[1] + 0.05, `el tercero cayó a los ${cayo[2]} s`);
  assert.ok(visto.brazo < 0 && visto.agujero === 1, 'no levantó el brazo o el tiro errado no dejó marca');
  assert.ok(visto.mira < -1.5 && visto.parpado > ABURRIDO + 0.1, 'miró lo que hacía');
  // Sube despacio y empuja de golpe.
  assert.ok(T.sube[1] - T.sube[0] > 2 * (T.tumba[1] - T.tumba[0]));
  // Al final todo en su sitio: los cuatro parados, el agujero tapado, el brazo abajo.
  for (const n of [1, 2, 3, 4]) assert.ok(Math.abs(parado(dom.de(`blanco-${n}`, 'transform')) - 1) < 0.01, `el ${n} no se paró`);
  assert.equal(dom.de('agujero', 'opacity'), '0');
  assert.equal(giro(dom.de('brazo-lejos', 'transform')), BRAZO_BAJO);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de atendiendo a tumbar el tercero con el dedo, con el lugar de Alí Babá a la vista, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarSheriffCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  const t = marcas(EMPUJA);
  assert.equal(dom.de('brazo-lejos', 'transform'), t.transform['brazo-lejos']);
  assert.ok(parado(dom.de('blanco-1', 'transform')) < 0.15 && parado(dom.de('blanco-2', 'transform')) < 0.15);
  assert.ok(parado(dom.de('blanco-3', 'transform')) > 0.3 && parado(dom.de('blanco-3', 'transform')) < 0.9, 'el tercero no está a medio caer');
  assert.equal(dom.de('agujero', 'opacity'), '1');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.deepEqual(dom.foto(), antes);
});
