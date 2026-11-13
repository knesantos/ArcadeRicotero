import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

import { rutaDePieza } from './aerografo.ts';
import { AIRE, PASO_PLENO, aireDe, alfaDeAire, altoDeBaldosa, corridaDeAire, despejeDeLupa, resto } from './aire.ts';
import { PIEZAS_AIRE } from './arte-aire.ts';
import { ALTO, CAMINOS, VISTA_MAX } from './camino.ts';
import { LUPA } from './lupa.ts';

/**
 * El aire del camino (`D-90`): la bruma, la niebla rasante y lo pegado a la cámara. Lo que se
 * cuida acá es que sea barato (pocas capas, impresas, livianas, y que el teléfono solo las corra) y
 * que la baldosa nunca muestre el borde.
 */

const capas = Object.entries(AIRE).flatMap(([region, lista]) => lista.map((c) => ({ region, c })));

test('el aire es de regiones que se caminan, y pocas capas por región', () => {
  assert.ok(Object.keys(AIRE).length >= 4, 'el aire tiene que estar probado en varias regiones');
  for (const [region, lista] of Object.entries(AIRE)) {
    assert.ok(CAMINOS[region], `${region} no es un camino`);
    // Cada capa es una superficie que el teléfono compone encima de la escena: tres, y ni una más.
    assert.ok(lista.length >= 1 && lista.length <= 3, `${region}: ${lista.length} capas de aire`);
  }
});

test('cada capa de aire entra en la escena y su baldosa es más ancha que cualquier pantalla', () => {
  for (const { region, c } of capas) {
    assert.ok(c.y >= 0 && c.y + c.alto <= ALTO, `${c.pieza} (${region}) se sale de la escena`);
    // Más ancha que la vista más ancha partida en dos: nunca se ven tres repeticiones a la vez.
    assert.ok(c.ancho >= VISTA_MAX / 2, `${c.pieza}: la baldosa se repite demasiado`);
    assert.ok(c.f > 0 && c.f <= 2, `${c.pieza}: velocidad rara`);
    assert.ok(c.alfa > 0 && c.alfa <= 1 && c.late >= 0 && c.alfa + c.late <= 1.0001, `${c.pieza}: el alfa se pasa`);
    assert.ok(c.abre >= 0 && c.abre <= 1);
    // La que cae o sube ocupa la pantalla entera: su baldosa se repite para arriba con el alto de la escena.
    if (c.cae !== 0) assert.deepEqual([c.y, c.alto], [0, ALTO], `${c.pieza}: lo que cae va de pantalla entera`);
    // Lo de atrás va más despacio que el piso, y lo pegado a la cámara, más rápido que lo de adelante.
    if (c.plano === 'fondo') assert.ok(c.f < 1, `${c.pieza}: lo de atrás del piso no puede ir más rápido que el piso`);
    if (c.plano === 'cerca') assert.ok(c.f > (CAMINOS[region]!.velocidad.frente || 1), `${c.pieza}: lo pegado a la cámara pasa más rápido que lo de adelante`);
  }
});

test('cada baldosa del aire está pintada e impresa, con la caja de su receta', () => {
  const piezas = new Map(PIEZAS_AIRE.map((p) => [p.nombre, p]));
  for (const { c } of capas) {
    const p = piezas.get(c.pieza);
    assert.ok(p, `nadie pinta ${c.pieza}`);
    assert.deepEqual([...p.caja], [0, c.y, c.ancho, c.alto]);
    assert.ok(existsSync(`public${rutaDePieza(c.pieza)}`), `falta imprimir ${c.pieza}: npm run imprimir-bestiario -- --solo aire-`);
    // Soplada y con grano, como todo el bestiario: nada de degradé.
    assert.doesNotMatch(p.dibujo, /Gradient/i, `${c.pieza} trae un degradé`);
    assert.match(p.dibujo, /filter="url\(#soplo-/, `${c.pieza} no está soplada`);
  }
  // Ninguna baldosa huérfana: lo que se imprime, alguien lo pide.
  const pedidas = new Set(capas.map(({ c }) => c.pieza));
  assert.deepEqual(PIEZAS_AIRE.map((p) => p.nombre).filter((n) => !pedidas.has(n)), []);
});

test('el aire de una región pesa poco: se baja entero antes de dar dos pasos', () => {
  for (const [region, lista] of Object.entries(AIRE)) {
    const kb = lista.reduce((s, c) => s + statSync(`public${rutaDePieza(c.pieza)}`).size, 0) / 1024;
    assert.ok(kb < 520, `${region}: el aire pesa ${Math.round(kb)} kB`);
  }
});

test('la baldosa nunca muestra el borde: se corre menos que su ancho, para el lado que sea', () => {
  for (const { c } of capas) {
    for (const suelta of [true, false]) {
      for (let cam = 0; cam <= 2840; cam += 71) {
        for (const t of [0, 0.7, 13.3, 512.9, 9000.1]) {
          const k = corridaDeAire(c, cam, t, suelta);
          assert.ok(k.x <= 0 && k.x > -c.ancho, `${c.pieza}: se corrió ${k.x} con una baldosa de ${c.ancho}`);
          const alto = altoDeBaldosa(c);
          assert.ok(alto ? k.y >= 0 && k.y < alto : k.y === 0, `${c.pieza}: bajó ${k.y}`);
        }
      }
    }
  }
  assert.equal(resto(-1, 10), 9);
  assert.equal(resto(21, 10), 1);
});

test('el paralaje del aire: suelta en la vista corre f·cam; con la tira, solo la diferencia', () => {
  const c = { ...AIRE['el-monte']![0]!, deriva: 0, ancho: 100000 };
  assert.equal(corridaDeAire(c, 1000, 5, true).x, -c.f * 1000);
  assert.ok(Math.abs(corridaDeAire(c, 1000, 5, false).x - -resto((c.f - 1) * 1000, c.ancho)) < 1e-9);
  // Quieta la cámara, lo único que la mueve es el viento.
  const v = { ...c, deriva: -10 };
  assert.ok(Math.abs(corridaDeAire(v, 0, 3, true).x - -30) < 1e-9);
});

test('la niebla se abre al paso y se queda en sus topes', () => {
  for (const { c } of capas) {
    for (const t of [0, 1.1, 37, 1000]) {
      for (const anda of [0, 0.3, 1, 4]) {
        const a = alfaDeAire(c, t, anda);
        assert.ok(a >= 0 && a <= 1, `${c.pieza}: alfa ${a}`);
      }
      if (c.abre > 0) assert.ok(alfaDeAire(c, t, 1) < alfaDeAire(c, t, 0), `${c.pieza} no se abre caminando`);
    }
  }
  // La rasante del monte es la que se abre: es lo que pidió el usuario.
  assert.ok(aireDe('el-monte', 'medio')[0]!.abre >= 0.5);
  assert.ok(PASO_PLENO > 100);
});

test('con la lupa, lo pegado a la cámara se corre del medio y lo de atrás queda', () => {
  assert.equal(despejeDeLupa('cerca', false, 1), 1);
  assert.equal(despejeDeLupa('cerca', false, LUPA.doble), 0);
  assert.equal(despejeDeLupa('fondo', false, LUPA.max), 1);
  // La ceniza cae en toda la pantalla: no es una mata que tape, y se queda.
  assert.equal(despejeDeLupa('cerca', true, LUPA.max), 1);
  const medio = despejeDeLupa('medio', false, LUPA.max);
  assert.ok(medio > 0.4 && medio < 1);
});

test('el teléfono solo corre el aire: ni filtros en vivo, ni degradé, ni un segundo reloj', () => {
  const css = readFileSync('src/styles/camino.css', 'utf-8');
  const regla = /\.camino \.aire \{([^}]*)\}/.exec(css)?.[1] ?? '';
  assert.match(regla, /background-image: var\(--baldosa\)/);
  assert.match(regla, /pointer-events: none/, 'el aire no puede robarle el toque a un bicho');
  assert.doesNotMatch(css, /\.aire[^{]*\{[^}]*(filter|gradient|mask)/);
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  // Lo único que la isla le escribe a una capa de aire es el transform y la opacidad.
  const escrituras = [...isla.matchAll(/a\.el\.style\.(\w+)/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(escrituras)].sort(), ['opacity', 'removeProperty', 'transform']);
  // Y en el mismo cuadro de siempre: el reloj del camino es uno solo.
  assert.equal(isla.match(/requestAnimationFrame\(cuadro\)/g)?.length, 2, 'el camino tiene un solo reloj: el que arranca y el que sigue');
  for (const modulo of ['src/lib/bestiario/aire.ts', 'src/scripts/bestiario/pellizco.ts']) {
    assert.doesNotMatch(readFileSync(modulo, 'utf-8'), /requestAnimationFrame|setInterval/);
  }
});

test('con movimiento reducido el aire queda quieto en su lugar, con su alfa', () => {
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  assert.match(isla, /const t = quieto\(\) \? 0 : reloj;/);
  assert.match(isla, /const x = quieto\(\) \? 0 : k\.x \* escala;/);
  assert.match(isla, /quieto\(\) \? a\.c\.alfa : alfaDeAire/);
  // Y sin isla también está: la página pone la capa con su alfa.
  assert.match(readFileSync('src/pages/redondopedia/bestiario/[region].astro', 'utf-8'), /--alfa: \$\{c\.alfa\}/);
});
