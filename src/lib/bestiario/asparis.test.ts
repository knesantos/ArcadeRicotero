import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { capasDe } from './elenco.ts';
import { ASPARIS_PERSONAJE, PIEZAS_ASPARIS } from './arte-asparis.ts';
import { ASPARIS, ASPARIS_ARMADO as A, CABE, QUIETO, alRecinto, anchoVisto, copete, dondeLaMoneda, enElNaipe, guanteDe, marcas, type Punto } from './rig-asparis.ts';
import { ASTILLERO, COSAS_DE_LOS_ASTILLEROS, OJOS_DE_LOS_ASTILLEROS } from './rig-entornos.ts';
import { ALMEJAS } from './rig-almejas.ts';
import { escenaAstilleros } from './escenas-entornos.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS, K_ENTORNO } from './camino.ts';
import { CANTO_T, DURA, TOQUE_T, armarAsparisCon, base, momentoDeAccion, momentoDelToque, type Accion } from '../../scripts/bestiario/asparis.ts';
import { azar, domDeJuguete, escenario, trasladoDe } from './juguete.ts';

/**
 * El as del Club París (`D-73`, vigesimonovena vuelta): que sea un títere entero, un naipe (el as de corazones) con
 * piernas, galera de cotillón y su valija, parado en el muelle de los astilleros, que no esté más pintado en el piso,
 * que revolee la moneda y se le escape, se ponga de canto hasta casi no estar y sople un matasuegras que se le cae,
 * que tocado se doble y quepa entero en la valija, y que la pose de la isla sea la del HTML.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string; estampa: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'el-as-del-club-paris';
const figura = capasDe('los-astilleros', 'figura', nombres, 1, ID);
const caja = (nombre: string): readonly [number, number, number, number] => PIEZAS_ASPARIS.find((p) => p.nombre === nombre)!.caja;
const adentro = (nombre: string, [x, y]: Punto): boolean => {
  const [x0, y0, w, h] = caja(nombre);
  return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
};
const nuevo = () => domDeJuguete([figura], 'titere--asparis');
const sinRitmos = (): number => -1;
/** Lo ancho que se ve el naipe: el primer número del `scale(…)` de su transformación. */
const anchoDe = (transform: string): number => Number(/scale\((-?[\d.]+) /.exec(transform)?.[1] ?? NaN);
const V = A.valija;

test('el as es un títere entero: cada parte que mueve la isla, con su imagen y su pivote adentro', () => {
  assert.match(figura, /<g class="titere titere--asparis" data-id="el-as-del-club-paris" role="button" tabindex="0" aria-label="El as del Club París">/);
  for (const p of ['entero', 'valija-fondo', 'tapa', 'piernas', 'naipe', 'vuelta', 'abajo', 'parpados', 'mata', 'bigote', 'dorso', 'brazos', 'brazo-i', 'brazo-d', 'moneda', 'valija-frente', 'cierre', 'guante', 'galera']) {
    assert.ok(figura.includes(`data-parte="${p}"`), `al as le falta ${p}`);
  }
  const imagenes = new Set([...figura.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_ASPARIS.map((p) => p.nombre).sort());
  for (const p of PIEZAS_ASPARIS) assert.match(p.nombre, /^asparis-/);
  // El naipe son dos mitades que cierran en el doblez, y el dorso las tapa enteras.
  assert.ok(adentro('asparis-arriba', [0, A.doblez]) && adentro('asparis-abajo', [0, A.doblez]), 'las dos mitades no cierran en el doblez');
  assert.ok(adentro('asparis-arriba', [0, A.copete]) && adentro('asparis-abajo', [0, A.pie]) && adentro('asparis-dorso', [A.ancho / 2, A.copete]) && adentro('asparis-dorso', [-A.ancho / 2, A.pie]), 'el naipe no mide lo que dice el rig');
  assert.equal(A.alto, A.pie - A.copete);
  // El doblez no está justo en el medio: la mitad de abajo es más larga, y doblada asoma por arriba de la cara mostrando el dorso.
  assert.ok(A.pie - A.doblez > A.doblez - A.copete + 8 && A.pie - A.doblez < A.doblez - A.copete + 24, 'la mitad de abajo no asoma, o asoma demasiado');
  assert.ok(adentro('asparis-vuelta', [0, A.doblez]) && adentro('asparis-vuelta', [0, A.pie]), 'la mitad dada vuelta no mide lo que la de frente');
  assert.match(PIEZAS_ASPARIS.find((p) => p.nombre === 'asparis-vuelta')!.dibujo, /var\(--bestia-asparis-dorso\)/);
  // La vuelta va detrás de la cara: no le tapa los ojos.
  assert.ok(figura.indexOf('data-parte="vuelta"') < figura.indexOf('asparis-arriba.webp'));
  // Es papel: esquinas de radio chico, y nada soplado grande encima del blanco.
  assert.doesNotMatch(PIEZAS_ASPARIS.find((p) => p.nombre === 'asparis-abajo')!.dibujo, /soplo-(m|l|xl)/);
  assert.ok(adentro('asparis-arriba', A.boca) && adentro('asparis-arriba', A.bigote), 'la boca y el bigote no están en la cara');
  for (const h of A.hombros) assert.ok(adentro('asparis-arriba', h), 'un brazo no sale del canto del naipe');
  assert.ok(adentro('asparis-brazo', [0, 0]) && adentro('asparis-brazo', [0, A.brazo]), 'el brazo dibujado no mide lo que dice el rig');
  assert.ok(adentro('asparis-piernas', [0, A.pie]) && adentro('asparis-piernas', [20, 0]), 'las piernas no van del naipe al muelle');
  // La valija: el frente y la tapa cierran en la bisagra, y es justo más ancha que el naipe doblado y achicado.
  assert.ok(adentro('asparis-valija-frente', [V.x, -V.alto]) && adentro('asparis-tapa', [V.x, -V.alto]) && adentro('asparis-cierre', [V.x, -V.alto]), 'la valija no cierra');
  assert.ok(A.ancho * A.justo < V.ancho && A.ancho > V.ancho, 'tiene que caber justo: entero no, achicado sí');
  for (const p of PIEZAS_ASPARIS) assert.doesNotMatch(p.dibujo, /#[0-9a-fA-F]{3,8}\b/, p.nombre);
  for (const n of ['asparis-arriba', 'asparis-abajo', 'asparis-dorso', 'asparis-galera', 'asparis-valija-frente']) assert.match(PIEZAS_ASPARIS.find((p) => p.nombre === n)!.dibujo, /url\(#grano\)/);
  // Es de corazones, en rojo: negro sobre la noche no se leía.
  assert.match(PIEZAS_ASPARIS.find((p) => p.nombre === 'asparis-abajo')!.dibujo, /var\(--bestia-asparis-rojo\)/);
  const peso = PIEZAS_ASPARIS.reduce((s, p) => s + readFileSync(`public/bestiario/${p.nombre}.webp`).length, 0) / 1024;
  assert.ok(peso >= 20 && peso <= 200, `las piezas pesan ${peso.toFixed(0)} kB`);
});

test('las tintas del as están en su bloque de tokens.css, medidas en La mosca y la sopa, y lo que no se toca en su bloque de sitio.css', () => {
  const tokens = readFileSync('src/styles/tokens.css', 'utf-8');
  const bloque = tokens.slice(tokens.indexOf('⟨el as del club paris⟩'), tokens.indexOf('⟨/el as del club paris⟩'));
  const usadas = new Set(PIEZAS_ASPARIS.flatMap((p) => [...p.dibujo.matchAll(/var\((--[a-z-]+)\)/g)].map((m) => m[1]!)));
  assert.ok(usadas.size >= 9);
  for (const t of usadas) assert.match(bloque, new RegExp(`${t}: #[0-9a-f]{6}; /\\* .+ \\*/`), `${t} no está en el bloque del as`);
  assert.match(bloque, /public\/tapas\/la-mosca-y-la-sopa\.jpg/);
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8');
  const suyo = sitio.slice(sitio.indexOf('/* ⟨el as del club paris⟩ */'), sitio.indexOf('/* ⟨/el as del club paris⟩ */'));
  assert.match(suyo, /\.titere--asparis \{ cursor: pointer; \}/);
  assert.ok(suyo.includes('"moneda"') && suyo.includes('"mata"'), 'la moneda y el matasuegras se pueden tocar');
  assert.doesNotMatch(suyo, /#[0-9a-fA-F]{3,8}\b|shadow/);
});

test('está parado en el muelle con la valija donde estaba la valija, sin pisar a las almejas ni a nadie, y ya no está pintado en el piso', () => {
  assert.equal(datos.bestias.find((b) => b.id === ID)!.region, 'los-astilleros');
  assert.equal(ASPARIS_PERSONAJE.ancla, ASPARIS.x);
  // La valija quedó donde estaba pintada, y él donde tenía los ojos (a un paso).
  assert.ok(Math.abs(alRecinto([V.x, 0])[0] - ASTILLERO.valija.x) < 0.5, 'la valija se corrió');
  assert.ok(Math.abs(ASPARIS.x - OJOS_DE_LOS_ASTILLEROS[ID]![0]) < 30, 'se fue lejos de sus ojos');
  // Apoya en los tablones, adelante de la pila, y todo lo suyo (de la moneda que rueda a la valija) queda a la izquierda del balde.
  assert.ok(ASPARIS.piso > ASTILLERO.pila.piso + 40 && ASPARIS.piso < 640, 'no apoya en el muelle');
  const derecha = alRecinto([V.x + V.ancho / 2 + 10, 0])[0];
  assert.ok(derecha < ALMEJAS.x - 110 * ALMEJAS.escala - 20, `la valija llega a ${derecha.toFixed(0)} y pisa lo de las almejas`);
  assert.ok(alRecinto([-A.ancho / 2 - 30, 0])[0] > 110, 'se sale por la izquierda');
  // La rana rubia está arriba de la pila: la galera no llega al techo de los containers.
  assert.ok(alRecinto([0, A.copete - 60])[1] > ASTILLERO.pila.arriba + 100, 'la galera se mete con los de arriba de la pila');
  const [x0, y0] = alRecinto([-A.ancho / 2 - 20, A.copete - 60]);
  const [x1, y1] = alRecinto([V.x + V.ancho / 2 + 10, 0]);
  for (const k of [1, K_ENTORNO]) {
    const corre = ASPARIS.x * (k - 1);
    for (const [id, [vx, vy]] of [...Object.entries(OJOS_DE_LOS_ASTILLEROS), ...Object.entries(COSAS_DE_LOS_ASTILLEROS)]) {
      if (id === ID) continue;
      assert.ok(!(vx * k > x0 + corre && vx * k < x1 + corre && vy > y0 && vy < y1), `con k ${k}, ${id} queda adentro del as`);
    }
  }
  const escena = escenaAstilleros(nombres);
  assert.ok(escena.indexOf('/bestiario/astillero-piso.webp') < escena.indexOf(`data-marco="${ID}"`), 'el piso lo tapa');
  assert.ok(!escena.includes(`bestia--ojos" data-id="${ID}"`), 'siguen sus ojos en lo oscuro');
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8'), /t-valija|at\('el-as-del-club-paris'\)/, 'sigue pintado en el piso de los astilleros');
  const piso = pisoDelCamino(CAMINOS['los-astilleros']!, nombres);
  const m = /data-marco="el-as-del-club-paris" data-capa="figura" data-dx="(-?\d+)"/.exec(piso);
  assert.ok(m, 'no está en los astilleros del camino');
  assert.equal(Number(m![1]), Math.round(ASPARIS.x * (K_ENTORNO - 1)));
});

test('la pose quieta de la isla es la del HTML, con y sin movimiento', () => {
  for (const quieto of [true, false]) {
    const dom = nuevo();
    const antes = dom.foto();
    const vivo = armarAsparisCon(dom.marcos, escenario(quieto).esc, azar(7));
    vivo.mover(0, 0);
    assert.deepEqual(dom.foto(), antes);
  }
  // Quieto: de frente, entero, con las piernas afuera, la valija cerrada, la moneda en el guante y la galera en el copete.
  const q = marcas(QUIETO);
  assert.ok(anchoDe(q.transform.naipe!) > 0.95);
  assert.equal(q.opacity.dorso, '0');
  assert.equal(q.opacity.abajo, '1');
  assert.equal(q.opacity.vuelta, '0');
  assert.equal(q.opacity.cierre, '1');
  assert.equal(q.opacity.tapa, '0');
  assert.equal(q.opacity.guante, '0');
  assert.deepEqual(dondeLaMoneda(QUIETO), guanteDe(QUIETO, 1));
  const [gx, gy] = trasladoDe(q.transform.galera!);
  assert.ok(Math.hypot(gx - copete(QUIETO)[0], gy - copete(QUIETO)[1]) < 0.5, 'la galera no está en el copete');
  // El guante con la moneda queda del lado de la valija, afuera del naipe, y sin taparle la cara.
  assert.ok(guanteDe(QUIETO, 1)[0] > A.ancho / 2 && guanteDe(QUIETO, 1)[1] > A.doblez - 30);
});

test('solo, revolea la moneda y se le va atrás de la valija, se pone de canto hasta casi no estar y muestra el dorso, y sopla el matasuegras', () => {
  const hechas: Record<Accion | 'toque', number> = { moneda: 0, canto: 0, matasuegras: 0, toque: 0 };
  const visto = { monedaAlta: 0, monedaLejos: 0, angosto: 1, dorso: 0, mata: 0, mataCae: 0 };
  for (const semilla of [1, 2, 3]) {
    const dom = nuevo();
    const { esc, poner } = escenario(false);
    const vivo = armarAsparisCon(dom.marcos, esc, azar(semilla));
    for (let i = 1; i <= 60 * 80; i++) {
      const t = i / 60;
      poner(t);
      vivo.mover(t, 1 / 60);
      const [mx, my] = trasladoDe(dom.de('moneda', 'transform'));
      if (dom.de('moneda', 'opacity') === '1') {
        visto.monedaAlta = Math.min(visto.monedaAlta, my);
        visto.monedaLejos = Math.max(visto.monedaLejos, mx);
      }
      visto.angosto = Math.min(visto.angosto, Math.abs(anchoDe(dom.de('naipe', 'transform'))));
      if (dom.de('dorso', 'opacity') === '1' && anchoDe(dom.de('naipe', 'transform')) < -0.95) visto.dorso++;
      if (dom.de('mata', 'opacity') === '1') {
        visto.mata = Math.max(visto.mata, Number(/scale\(([\d.]+) 1\)/.exec(dom.de('mata', 'transform'))?.[1] ?? 0));
        visto.mataCae = Math.min(visto.mataCae, Number(/rotate\((-?[\d.]+)\)/.exec(dom.de('mata', 'transform'))?.[1] ?? 0));
      }
      // Sin tocarlo, la valija no se abre y él no se dobla.
      assert.equal(dom.de('cierre', 'opacity'), '1');
      assert.equal(dom.de('abajo', 'opacity'), '1');
      assert.equal(dom.de('guante', 'opacity'), '0');
    }
    for (const [a, n] of Object.entries(vivo.estado().hechas)) hechas[a as Accion] += n;
  }
  for (const a of ['moneda', 'canto', 'matasuegras'] as const) assert.ok(hechas[a] > 0, `nunca hizo ${a}`);
  assert.equal(hechas.toque, 0);
  // La moneda sube más alto que la galera y termina atrás de la valija: no la ataja.
  assert.ok(visto.monedaAlta < A.copete - 30, `la moneda subió a ${visto.monedaAlta.toFixed(0)}`);
  assert.ok(visto.monedaLejos > V.x - V.ancho / 2 + 10, 'la moneda no se fue atrás de la valija');
  // De canto es una raya, y un rato largo: lo que dura menos que el hueco entre dos cuadros no existe.
  assert.ok(visto.angosto < 0.06, `de canto mide ${visto.angosto}`);
  assert.ok(CANTO_T.raya[1] - CANTO_T.raya[0] >= 0.5 && CANTO_T.espaldas[1] - CANTO_T.espaldas[0] >= 1.5);
  assert.ok(visto.dorso > 60, 'no se quedó de espaldas mostrando el dorso');
  assert.ok(visto.mata > 0.9, 'el matasuegras no se estiró nunca');
  assert.ok(visto.mataCae < -35, 'el matasuegras no se le cayó');
  // De canto, lo que queda es una raya con piernas: las piernas no se achican tanto.
  const raya = momentoDeAccion(base(10, sinRitmos), 'canto', 0.8);
  assert.ok(Math.abs(anchoVisto(raya)) < 0.05 && raya.piernas === 1);
});

test('tocado, cabe: abre la valija, se dobla al medio y se mete, se dobla otra vez, la tapa se cierra con la galera afuera; después sale, y dice su verso', () => {
  const dom = nuevo();
  const { esc, poner, dichos } = escenario(false);
  const vivo = armarAsparisCon(dom.marcos, esc, azar(3));
  poner(1);
  vivo.mover(1, 1 / 60);
  dom.oyentes.get('click')!({});
  const visto = { abierta: -1, doblado: -1, enCuatro: -1, cerradaConEl: 0, guante: 0, galeraAfuera: 0, sacude: 0, deCanto: 0, dorso: 0 };
  for (let i = 1; i <= 60 * DURA.toque; i++) {
    const t = 1 + i / 60;
    const u = i / 60;
    poner(t);
    vivo.mover(t, 1 / 60);
    if (visto.abierta < 0 && dom.de('tapa', 'opacity') === '1') visto.abierta = u;
    if (visto.doblado < 0 && dom.de('abajo', 'opacity') === '0') visto.doblado = u;
    // El pliegue es de verdad: la mitad de abajo se ve cada vez más de canto, y después asoma del dorso, dada vuelta.
    const plegando = Number(/scale\(1 (-?[\d.]+)\)/.exec(dom.de('abajo', 'transform'))?.[1] ?? 1);
    if (dom.de('abajo', 'opacity') === '1' && plegando < 0.5 && plegando > 0.02) visto.deCanto++;
    if (dom.de('vuelta', 'opacity') === '1' && dom.de('naipe', 'opacity') === '1' && /scale\(1 -(0\.9\d*|1)\)/.test(dom.de('vuelta', 'transform'))) visto.dorso++;
    assert.notEqual(dom.de('abajo', 'opacity'), dom.de('vuelta', 'opacity'), 'se ven las dos caras de la mitad de abajo, o ninguna');
    // Al salir, nunca flota: desde que salta tiene las dos piernas afuera, enteras, y el canto de abajo de lo que se ve
    // del naipe apoya en ellas.
    if (u > TOQUE_T.salta[0] + 0.15) {
      assert.equal(dom.de('piernas', 'opacity'), '1', `a los ${u.toFixed(2)} sale sin piernas`);
      assert.match(dom.de('piernas', 'transform'), / 1\) translate/, `a los ${u.toFixed(2)} las piernas no están enteras`);
      const m = momentoDelToque(base(t, sinRitmos), u);
      const canto = enElNaipe([0, m.dobla >= 0.5 ? A.doblez : A.doblez + (A.pie - A.doblez) * (1 - 2 * m.dobla)], m)[1];
      assert.ok(Math.abs(canto - (m.naipe[1] + A.pie)) < 3, `a los ${u.toFixed(2)} el naipe flota ${(m.naipe[1] + A.pie - canto).toFixed(1)} arriba de las piernas`);
    }
    // Las piernas no se despegan: cuando está parado afuera de la valija, entero, las tiene.
    if (dom.de('abajo', 'opacity') === '1' && plegando > 0.95 && dom.de('naipe', 'opacity') === '1') assert.equal(dom.de('piernas', 'opacity'), '1', `a los ${u.toFixed(2)} está desdoblado y sin piernas`);
    const ancho = Math.abs(anchoDe(dom.de('naipe', 'transform')));
    if (visto.enCuatro < 0 && ancho < 0.5) visto.enCuatro = u;
    if (dom.de('guante', 'opacity') === '1') visto.guante++;
    if (dom.de('cierre', 'opacity') === '1' && dom.de('naipe', 'opacity') === '0') {
      visto.cerradaConEl++;
      // La galera quedó afuera, arriba de la tapa.
      const [gx, gy] = trasladoDe(dom.de('galera', 'transform'));
      if (Math.abs(gx - V.x) < 8 && gy < -V.alto && gy > -V.alto - 16) visto.galeraAfuera++;
      visto.sacude = Math.max(visto.sacude, Math.abs(trasladoDe(dom.de('cierre', 'transform'))[0]));
    }
    // Nunca desaparece con la valija abierta: lo que se esconde, se esconde atrás de la tapa cerrada.
    if (dom.de('naipe', 'opacity') === '0') assert.equal(dom.de('cierre', 'opacity'), '1', `desapareció con la valija abierta a los ${u.toFixed(2)}`);
  }
  assert.ok(visto.abierta > 0 && visto.abierta < visto.doblado, 'se dobló antes de abrir la valija');
  assert.ok(visto.doblado < visto.enCuatro, 'se dobló en cuatro antes que al medio');
  assert.ok(visto.deCanto > 6, 'el pliegue no se ve: la mitad de abajo no pasa de canto');
  assert.ok(visto.dorso > 60, 'doblado, no se le ve el dorso de la mitad de abajo');
  assert.ok(visto.guante > 60, 'no se quedó medio adentro, agarrado del canto');
  assert.ok(visto.cerradaConEl > 30, 'la valija no se cerró con él adentro');
  assert.ok(visto.galeraAfuera > 20, 'la galera no quedó arriba de la valija');
  assert.ok(visto.sacude > 1.5, 'la valija no se sacudió');
  // Medio adentro: el doblez queda a la altura de la boca de la valija, y la cara entera arriba.
  const medio = momentoDelToque(base(4, sinRitmos), 2.6);
  assert.ok(Math.abs(enElNaipe([0, A.doblez], medio)[1] - -V.alto) < 12, 'el doblez no queda en la boca de la valija');
  assert.ok(enElNaipe(A.bigote, medio)[1] < -V.alto - 4, 'la valija le tapa el bigote');
  assert.ok(Math.abs(enElNaipe([A.ancho / 2, A.doblez], medio)[0] - V.x) < V.ancho / 2, 'el naipe se sale de la valija por el costado');
  // Adentro del todo: no asoma por abajo ni por arriba de la tapa cerrada.
  const adentroDelTodo = momentoDelToque(base(4, sinRitmos), TOQUE_T.cierra[1] - 0.02);
  assert.ok(enElNaipe([0, A.doblez], adentroDelTodo)[1] <= 0.5 && enElNaipe([0, A.copete], adentroDelTodo)[1] >= -V.alto - 9, 'no cabe');
  // Al final está como antes: parado, entero, la valija cerrada y la moneda de vuelta en el guante.
  assert.ok(anchoDe(dom.de('naipe', 'transform')) > 0.95 && Math.abs(trasladoDe(dom.de('naipe', 'transform'))[0]) < 0.5);
  assert.equal(dom.de('abajo', 'opacity'), '1');
  assert.equal(dom.de('cierre', 'opacity'), '1');
  const [mx, my] = trasladoDe(dom.de('moneda', 'transform'));
  assert.ok(Math.hypot(mx - guanteDe(QUIETO, 1)[0], my - guanteDe(QUIETO, 1)[1]) < 6, 'la moneda no volvió al guante');
  assert.ok(TOQUE_T.fin <= DURA.toque);
  assert.equal(dichos.length, 1);
  assert.equal(dichos[0]![0], ID);
});

test('con movimiento reducido no se mueve: tocarlo lo pasa de parado a medio adentro de la valija, y dice su verso', () => {
  const dom = nuevo();
  const { esc, dichos } = escenario(true);
  const vivo = armarAsparisCon(dom.marcos, esc, azar(5));
  vivo.mover(0, 0);
  const antes = dom.foto();
  vivo.mover(3, 1 / 60);
  assert.deepEqual(dom.foto(), antes);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('naipe', 'transform'), marcas(CABE).transform.naipe);
  assert.equal(dom.de('tapa', 'opacity'), '1');
  assert.equal(dom.de('guante', 'opacity'), '1');
  assert.equal(dom.de('abajo', 'opacity'), '0');
  assert.equal(dom.de('vuelta', 'opacity'), '1');
  assert.equal(dom.de('piernas', 'opacity'), '0');
  assert.equal(dichos.length, 1);
  dom.oyentes.get('click')!({});
  assert.equal(dom.de('naipe', 'transform'), marcas(QUIETO).transform.naipe);
  assert.equal(dom.de('cierre', 'opacity'), '1');
});
