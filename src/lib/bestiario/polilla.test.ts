import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { PIEZAS_POLILLA, POLILLA_PERSONAJE } from './arte-polilla.ts';
import { FOCO, INSISTE, MAREO, POLILLA, POLILLA_ARMADO, QUIETO, RONDA, TOQUE_T, alRecinto, enLaRonda, golpesDeLaRonda, type Punto } from './rig-polilla.ts';
import { FOCOS_TEMPLO } from './arte.ts';
import { ARMADO } from './recortes.ts';
import { MOMO } from './rig.ts';
import { VECINOS_DEL_TEMPLO, escenaTemplo } from './escenas.ts';
import { DURA, armarPolillaCon, dondeEnElToque, type Accion } from '../../scripts/bestiario/polilla.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * La polilla (`D-73`, vigesimocuarta vuelta): que sea un títere entero a aerógrafo, colgada del cable de la
 * guirnalda al lado de un foco de verdad, que le dé vueltas a la luz sin pisar a Momo ni a nadie, que se dé
 * los golpes contra el vidrio y no lo atraviese, que tocada insista y vuelva al cable, y que la pose de la
 * isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'la-polilla';
const figura = capasDe('el-templo', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_POLILLA.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--polilla');
const escalaY = (t: string): number => Number(/scale\(1 ([-\d.]+)\)/.exec(t)?.[1] ?? NaN);
const lejos = ([x, y]: Punto, [a, b]: Punto): number => Math.hypot(x - a, y - b);
/** El medallón de Momo en el recinto: el medio y el radio. */
const MEDALLON: Punto = [MOMO.argolla.x + (ARMADO.momo.centro[0] - ARMADO.momo.argolla[0]) * MOMO.escala, MOMO.argolla.y + (ARMADO.momo.centro[1] - ARMADO.momo.argolla[1]) * MOMO.escala];
const RADIO_MOMO = ARMADO.momo.radio * MOMO.escala;
/** Lo que mide de punta a punta de las alas, y de las antenas a la punta de la panza, en el recinto. */
const MEDIO_ANCHO = 121 * POLILLA.escala;

test('la polilla es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--polilla" data-id="la-polilla" role="button" tabindex="0" aria-label="La polilla">/);
  for (const p of ['entero', 'vuelo', 'trasera-1', 'trasera-2', 'ala-1', 'ala-2', 'patas', 'panza', 'pata-1', 'pata-2', 'cabeza', 'antena-1', 'antena-2', 'parpado-1', 'parpado-2', 'mareos', 'mareo-1', 'mareo-2', 'foco', 'halo', 'golpe', 'polvo-1', 'polvo-2', 'polvo-3', 'polvo-4']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `a la polilla le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_POLILLA.map((p) => p.nombre).sort());
  const A = POLILLA_ARMADO;
  for (const n of [0, 1] as const) {
    assert.ok(adentro(`polilla-ala-${n + 1}`, A.hombros[n]) && adentro('polilla-cuerpo', A.hombros[n]), `el ala ${n + 1} no sale del hombro`);
    assert.ok(adentro(`polilla-trasera-${n + 1}`, A.caderas[n]) && adentro('polilla-cuerpo', A.caderas[n]), `el ala de atrás ${n + 1} no sale del cuerpo`);
    assert.ok(adentro('polilla-cabeza', A.ojos[n]) && adentro(`polilla-parpado-${n + 1}`, A.ojos[n]), `el ojo ${n + 1} no está en la cabeza`);
    assert.ok(adentro(`polilla-antena-${n + 1}`, A.antenas[n]) && adentro('polilla-cabeza', A.antenas[n]), `la antena ${n + 1} no sale de la cabeza`);
    assert.ok(adentro(`polilla-pata-${n + 1}`, A.patas[n]) && adentro('polilla-cuerpo', A.patas[n]) && adentro(`polilla-pata-${n + 1}`, A.agarre[n]), `la pata ${n + 1} no va del pecho al cable`);
  }
  assert.ok(adentro('polilla-cabeza', A.cuello) && adentro('polilla-cuerpo', A.cuello), 'la cabeza no se apoya en el cuello');
  assert.ok(adentro('polilla-panza', A.cintura) && adentro('polilla-cuerpo', A.cintura), 'la panza no cuelga de la cintura');
  assert.ok(adentro('polilla-cuerpo', A.lentejuela) && adentro('polilla-cabeza', A.trompa), 'el lentejuelón o la trompa se salen');
  assert.ok(adentro('polilla-foco', FOCO.cuelga) && adentro('polilla-foco', FOCO.centro) && adentro('polilla-halo', FOCO.centro) && adentro('polilla-golpe', FOCO.centro), 'el foco no está donde se hamaca');
  for (const p of PIEZAS_POLILLA) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['polilla-ala-1', 'polilla-cuerpo', 'polilla-cabeza', 'polilla-foco']) assert.match(PIEZAS_POLILLA.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  const peso = PIEZAS_POLILLA.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 25 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas de la polilla están en su bloque de tokens.css, y lo que no se toca en el suyo de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨la polilla⟩'), tokens.indexOf('⟨/la polilla⟩'));
  const usadas = new Set(PIEZAS_POLILLA.flatMap((p) => [...p.dibujo.matchAll(/var\((--bestia-polilla-[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 12);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque de la polilla`);
  assert.match(bloque, /momo-sampler/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨la polilla⟩ */'), sitio.indexOf('/* ⟨/la polilla⟩ */'));
  assert.match(suyo, /\.titere--polilla \{ cursor: pointer; \}/);
  for (const p of ['golpe', 'halo', 'polvo-']) assert.ok(suyo.includes(`"${p}"`), `${p} se puede tocar`);
  // La luz no es una sombra ni un desenfoque del navegador: el halo está impreso.
  assert.doesNotMatch(suyo, /shadow|blur|gradient/);
});

test('cuelga del cable de la guirnalda, al lado de un foco pintado, sin pisar a nadie del templo', () => {
  assert.equal(POLILLA_PERSONAJE.ancla, POLILLA.x);
  // Su foco es uno de los de la guirnalda del fondo, y la lamparita queda encima del pintado.
  assert.ok(FOCOS_TEMPLO.some(([x, y]) => x === FOCO.cuelga[0] && Math.abs(y - FOCO.cuelga[1]) < 4), 'el foco no es uno de la guirnalda');
  // Las patas de adelante agarran el cable que cuelga entre 440 y 920.
  const cable = (x: number): number => 70 + 280 * ((x - 440) / 480) * (1 - (x - 440) / 480);
  for (const g of POLILLA_ARMADO.agarre) {
    const [x, y] = alRecinto(g);
    assert.ok(Math.abs(y - cable(x)) < 4, `la pata agarra el aire en ${x.toFixed(0)}, ${y.toFixed(0)}`);
  }
  // Colgada no toca el foco, y no tapa los ojos de nadie del templo.
  assert.ok(QUIETO.donde[0] - MEDIO_ANCHO > FOCO.centro[0] + FOCO.radio, 'colgada se le encima al foco');
  for (const [id, [x, y]] of Object.entries(VECINOS_DEL_TEMPLO)) {
    if (id === ID) continue;
    assert.ok(lejos([x, y], [POLILLA.x, POLILLA.y]) > 90, `${id} queda debajo de la polilla`);
  }
  // Va en la figura: delante del fondo del templo, y con Momo antes.
  const escena = escenaTemplo(nombres);
  assert.ok(escena.indexOf('/bestiario/templo-lejos.webp') < escena.indexOf(`data-marco="${ID}"`), 'el fondo la tapa');
});

test('la ronda da vueltas alrededor de la luz, se da los golpes contra el vidrio sin atravesarlo, no pisa a Momo y vuelve al cable', () => {
  for (const [lado, fase] of [[1, 0], [-1, 0.5], [1, 0.93], [-1, 0.21]] as const) {
    assert.ok(lejos(enLaRonda(0, lado, fase), [POLILLA.x, POLILLA.y]) < 0.5, 'no sale del cable');
    assert.ok(lejos(enLaRonda(RONDA.dura, lado, fase), [POLILLA.x, POLILLA.y]) < 0.5, 'no vuelve al cable');
    let cerca = Infinity;
    let vueltas = 0;
    let antes = Math.atan2(enLaRonda(0.6, lado, fase)[1] - FOCO.centro[1], enLaRonda(0.6, lado, fase)[0] - FOCO.centro[0]);
    for (let i = 0; i <= 640; i++) {
      const u = (i / 640) * RONDA.dura;
      const p = enLaRonda(u, lado, fase);
      cerca = Math.min(cerca, lejos(p, FOCO.centro));
      assert.ok(p[1] - 66 * POLILLA.escala > 0, `se sale por arriba en ${u.toFixed(2)}`);
      assert.ok(lejos(p, MEDALLON) > RADIO_MOMO + 40, `se le mete a Momo en ${u.toFixed(2)}`);
      assert.ok(p[1] < 300, `baja hasta el Morta en ${u.toFixed(2)}`);
      if (u > 0.6 && u < RONDA.dura - 1) {
        const a = Math.atan2(p[1] - FOCO.centro[1], p[0] - FOCO.centro[0]);
        let d = a - antes;
        if (d > Math.PI) d -= 2 * Math.PI;
        if (d < -Math.PI) d += 2 * Math.PI;
        vueltas += d / (2 * Math.PI);
        antes = a;
      }
    }
    assert.ok(cerca > FOCO.contacto - 6, `atraviesa el vidrio (${cerca.toFixed(1)})`);
    assert.ok(Math.abs(vueltas) > 1.5, `no le da la vuelta a la luz (${vueltas.toFixed(2)})`);
    for (const h of golpesDeLaRonda(fase)) assert.ok(lejos(enLaRonda(h, lado, fase), FOCO.centro) < FOCO.contacto + 3, `no se da el golpe en ${h.toFixed(2)}`);
  }
});

test('el toque va derecho a la luz dos veces, la tira lejos de Momo, y termina colgada', () => {
  const T = TOQUE_T;
  assert.ok(lejos(dondeEnElToque(T.golpe), FOCO.centro) < FOCO.contacto + 1, 'el primer golpe no llega al vidrio');
  assert.ok(lejos(dondeEnElToque(T.golpe2 - 0.001), FOCO.centro) < FOCO.contacto + 2, 'el segundo golpe no llega al vidrio');
  assert.ok(lejos(dondeEnElToque(3), FOCO.centro) > 50, 'mareada sigue pegada a la luz');
  assert.ok(lejos(MAREO, MEDALLON) > RADIO_MOMO + 40, 'mareada se le mete a Momo');
  for (let u = 0; u <= T.dura; u += 0.02) {
    const p = dondeEnElToque(u);
    assert.ok(lejos(p, FOCO.centro) > FOCO.contacto - 1, `atraviesa el vidrio en ${u.toFixed(2)}`);
    assert.ok(lejos(p, MEDALLON) > RADIO_MOMO + 40, `se le mete a Momo en ${u.toFixed(2)}`);
  }
  assert.ok(lejos(dondeEnElToque(T.posa[1]), [POLILLA.x, POLILLA.y]) < 0.5, 'no vuelve al cable');
  // La pose quieta del toque, pegada al vidrio.
  assert.ok(lejos(INSISTE.donde, FOCO.centro) < FOCO.contacto + 3);
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarPolillaCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
});

test('sola no puede con la luz: da la ronda, abre y cierra las alas, se limpia las antenas, tirita, mira la luz y pestañea', () => {
  const hechas: Record<Accion, number> = { ronda: 0, abre: 0, limpia: 0, tirita: 0, mira: 0, insiste: 0 };
  let pestaneos = 0;
  let golpes = 0;
  let polvo = 0;
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarPolillaCon(dom.marcos, esc, azar(semilla));
    let cerrado = false;
    let chispa = false;
    for (let i = 1; i <= 60 * 50; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const p = Math.min(escalaY(dom.de('parpado-1', 'transform')), escalaY(dom.de('parpado-2', 'transform')));
      if (p > 0.9 && !cerrado) pestaneos++;
      cerrado = p > 0.9;
      const g = Number(dom.de('golpe', 'opacity')) > 0.7;
      if (g && !chispa) golpes++;
      chispa = g;
      polvo = Math.max(polvo, Number(dom.de('polvo-1', 'opacity')));
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['ronda', 'abre', 'limpia', 'tirita', 'mira'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.insiste, 0, 'insistió sin que la toquen');
  assert.ok(golpes >= 3 * hechas.ronda, `en ${hechas.ronda} rondas se dio ${golpes} golpes`);
  assert.ok(polvo > 0.5, 'nunca se le cayó el polvo');
  assert.ok(pestaneos >= 15 && pestaneos <= 90, `pestañeó ${pestaneos} veces`);
});

test('tocada insiste: va a la luz, se da el golpe, queda mareada, sacude la cabeza, se da otro y vuelve a colgarse', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarPolillaCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  let golpes = 0;
  let chispa = false;
  let mareo = 0;
  let polvo = 0;
  let hamaca = 0;
  let titila = 1;
  for (let i = 1; i < 60 * DURA.insiste; i++) {
    const t = 1 + i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    const g = Number(dom.de('golpe', 'opacity')) > 0.7;
    if (g && !chispa) golpes++;
    chispa = g;
    mareo = Math.max(mareo, Number(dom.de('mareos', 'opacity')));
    polvo = Math.max(polvo, ...[1, 2, 3, 4].map((k) => Number(dom.de(`polvo-${k}`, 'opacity'))));
    hamaca = Math.max(hamaca, Math.abs(Number(/rotate\(([-\d.]+)/.exec(dom.de('foco', 'transform'))?.[1] ?? 0)));
    titila = Math.min(titila, Number(dom.de('halo', 'opacity')));
  }
  assert.equal(golpes, 2, `se dio ${golpes} golpes`);
  assert.ok(mareo > 0.95, 'no quedó mareada');
  assert.ok(polvo > 0.8, 'no le saltó el polvo');
  assert.ok(hamaca > 8, 'el foco no se hamacó');
  assert.ok(titila < 0.4, 'el foco no parpadeó');
  assert.equal(vivo.estado().accion, 'insiste');
  // Al final volvió al cable, con los ojos sanos.
  const [fx, fy] = trasladoDe(dom.de('vuelo', 'transform'));
  assert.ok(Math.hypot(fx, fy) < 1, 'no volvió al cable');
  assert.equal(dom.de('mareos', 'opacity'), '0');
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarla la pasa del cable al vidrio y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarPolillaCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('golpe', 'opacity'), String(INSISTE.golpe));
  assert.notDeepEqual(trasladoDe(dom.de('vuelo', 'transform')), [0, 0]);
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('golpe', 'opacity'), String(QUIETO.golpe));
});
