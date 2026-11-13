import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import sharp from 'sharp';

import { rutaDePieza } from './aerografo.ts';
import {
  ACECHOS, AIRE, ALIVIO, LUCES, MIRADA, PASO_PLENO, VIDAS, aireDe, alfaDeAire, alivioDeEntrada, alivioTras, altoDeBaldosa, corridaDeAire, despejeDeLupa, estadoDeLuz, latido,
  parpadeo, pasoDeVida, resto,
} from './aire.ts';
import { PIEZAS_AIRE, PIEZAS_DE_LUZ, PIEZAS_DE_VIDA } from './arte-aire.ts';
import { PIEZAS_CAMINO } from './arte-camino.ts';
import { pisoDelCamino } from './escenas-camino.ts';
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
    // Cada capa es una superficie que el teléfono compone encima de la escena: tres, y ni una más. La
    // que ya existía y solo se mudó (la nevada de Cybersiberia, que salió de adentro del piso) no cuenta:
    // no es peso nuevo, es peso que bajó.
    const propias = lista.filter((c) => !c.ajena).length;
    assert.ok(propias >= 1 && propias <= 3, `${region}: ${propias} capas de aire`);
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
  for (const { c } of capas.filter((x) => !x.c.ajena)) {
    const p = piezas.get(c.pieza);
    assert.ok(p, `nadie pinta ${c.pieza}`);
    assert.deepEqual([...p.caja], [0, c.y, c.ancho, c.alto]);
    assert.ok(existsSync(`public${rutaDePieza(c.pieza)}`), `falta imprimir ${c.pieza}: npm run imprimir-bestiario -- --solo aire-`);
    // Nada de degradé, y cada una con la mano de su región: soplada con el aerógrafo, o rayada a
    // crayón (el bajo, los techos) o a gubia (la prisión), que son recintos de otro disco.
    assert.doesNotMatch(p.dibujo, /Gradient/i, `${c.pieza} trae un degradé`);
    // El hollín de los techos son rayitas de pastel sueltas, como las del cielo de su recinto: sin filtro.
    assert.ok(/filter="url\(#(soplo-|xerox-fino|gubia)/.test(p.dibujo) || c.pieza === 'aire-techos-hollin', `${c.pieza} no tiene mano`);
  }
  // Ninguna baldosa huérfana: lo que se imprime, alguien lo pide.
  const pedidas = new Set(capas.map(({ c }) => c.pieza));
  // La que es de otro (la nevada) está impresa por su dueño.
  for (const { c } of capas.filter((x) => x.c.ajena)) assert.ok(existsSync(`public${rutaDePieza(c.pieza)}`), `${c.pieza} no está impresa`);
  assert.deepEqual(PIEZAS_AIRE.map((p) => p.nombre).filter((n) => !pedidas.has(n)), []);
});

test('el aire de una región pesa poco: se baja entero antes de dar dos pasos', () => {
  for (const [region, lista] of Object.entries(AIRE)) {
    const kb = lista.reduce((s, c) => s + statSync(`public${rutaDePieza(c.pieza)}`).size, 0) / 1024;
    assert.ok(kb < 560, `${region}: el aire pesa ${Math.round(kb)} kB`);
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

/* ------------------------------------------------------------------
   Segunda ronda: la niebla rasgada, el piso, la luz y los ojos sin dueño
   ------------------------------------------------------------------ */

test('la niebla rasante es de jirones rasgados, y ninguno cruza una pantalla de teléfono', () => {
  const fuente = readFileSync('src/lib/bestiario/arte-aire.ts', 'utf-8');
  // El jirón más largo que se siembra, bien por debajo de las 320 unidades de un teléfono parado.
  const m = /const largo = (\d+) \+ hondura \* (\d+) \+ rnd\(\) \* (\d+);/.exec(fuente);
  assert.ok(m, 'no encuentro el largo de los jirones');
  assert.ok(Number(m[1]) + Number(m[2]) + Number(m[3]) <= 280, 'un jirón ya mide casi una pantalla: vuelve la franja');
  // Y las manchas de la bruma tampoco: su radio tiene tope.
  assert.match(fuente, /ancha: readonly \[number, number\] = \[70, 150\]/);
  // Ya no hay lenguas de canto liso.
  assert.doesNotMatch(fuente, /function lengua\(/);
  for (const pieza of ['aire-monte-rasante', 'aire-astillero-vaho', 'aire-infierno-humo']) {
    const p = PIEZAS_AIRE.find((q) => q.nombre === pieza)!;
    assert.ok((p.dibujo.match(/<clipPath/g) ?? []).length >= 10, `${pieza}: pocos jirones`);
    // El canto rasgado es una máscara de tramos rectos, no una curva.
    assert.doesNotMatch(p.dibujo, /<clipPath id="[a-z]+-\d+-\d"><path d="M[^"]*Q/, `${pieza}: un canto liso`);
  }
});

test('el piso de las regiones con aire ya no es liso: charcos, piedras y lo que dejó cada lugar', () => {
  for (const [pieza, marca] of [['camino-monte-piso', 'sm-ch-'], ['camino-pastura-piso', 'sm-ch-'], ['camino-cyber-piso', 'sc-ch-'], ['camino-astillero-piso', 'sa-ch-']] as const) {
    const p = PIEZAS_CAMINO.find((q) => q.nombre === pieza)!;
    const charcos = (p.dibujo.match(new RegExp(`<clipPath id="${marca}`, 'g')) ?? []).length;
    assert.ok(charcos >= 5, `${pieza}: ${charcos} charcos`);
    assert.doesNotMatch(p.dibujo, /Gradient/i);
  }
});

test('las luces: una por región, impresas, clavadas en la escena y sin salirse de sus topes', () => {
  const piezas = new Map(PIEZAS_DE_LUZ.map((p) => [p.nombre, p]));
  assert.ok(Object.keys(LUCES).length >= 7);
  for (const [region, lista] of Object.entries(LUCES)) {
    assert.ok(CAMINOS[region], `${region} no es un camino`);
    assert.equal(lista.length, 1, `${region}: más de una luz es otra superficie más para el teléfono`);
    for (const l of lista) {
      const p = piezas.get(l.pieza);
      assert.ok(p, `nadie pinta ${l.pieza}`);
      assert.deepEqual([...p.caja], [...l.caja]);
      assert.ok(existsSync(`public${rutaDePieza(l.pieza)}`), `falta imprimir ${l.pieza}`);
      // Con el grano del aerógrafo, o con la mano del recinto: crayón en el bajo, gubia en la prisión.
      assert.match(p.dibujo, /filter="url\(#(rociado|xerox-fino|gubia)\)"/, `${l.pieza} no tiene mano`);
      assert.doesNotMatch(p.dibujo, /Gradient/i);
      assert.ok(l.x > 0 && l.x < CAMINOS[region]!.escena, `${l.pieza} cae afuera de la escena`);
      // La que va colgada de un bicho, que el bicho exista en ese camino.
      if (l.sigue) assert.match(pisoDelCamino(CAMINOS[region]!, new Map()), new RegExp(`class="bestia[^"]*" data-id="${l.sigue}"`), `${l.pieza}: no está ${l.sigue}`);
      for (let t = 0; t < 40; t += 0.37) {
        const e = estadoDeLuz(l, t);
        assert.ok(e.alfa >= 0 && e.alfa <= 1 && Math.abs(e.giro) <= l.vaiven * 1.13 + 1e-9 && e.escala >= 1 && e.escala <= 1 + l.crece * 1.5 + 1e-9, `${l.pieza} en ${t}`);
      }
    }
  }
  // El latido son dos golpes y una pausa.
  assert.ok(latido(0.12) > 0.9 && latido(0.36) > 0.6 && latido(0.75) < 0.05);
});

test('los ojos sin dueño: una receta por región con aire, en lo oscuro, y se apagan si los mirás', () => {
  const piezas = new Map(PIEZAS_DE_LUZ.map((p) => [p.nombre, p]));
  // Es un sistema: cada región con aire tiene los suyos.
  assert.deepEqual(Object.keys(ACECHOS).sort(), Object.keys(AIRE).sort());
  for (const [region, a] of Object.entries(ACECHOS)) {
    assert.ok(piezas.get(a.pieza) && existsSync(`public${rutaDePieza(a.pieza)}`), `${region}: faltan los ojos impresos`);
    assert.ok(a.lugares.length >= 3, `${region}: con menos de tres lugares siempre salen en el mismo`);
    for (const [fx, y, tam] of a.lugares) assert.ok(fx > 0.05 && fx < 0.95 && y > 120 && y < ALTO - 16 && tam > 0.3 && tam <= 1.3, `${region}: un lugar raro`);
    // Hay que quedarse quieto de verdad: cinco o seis segundos.
    assert.ok(a.espera[0] >= 5 && a.espera[1] <= 7 && a.dura[0] >= 4);
  }
  assert.ok(MIRADA >= 48, 'el dedo tiene que alcanzar a mirarlos');
  // El parpadeo es corto, y casi siempre están abiertos.
  let abiertos = 0;
  for (let t = 0; t < 30; t += 0.01) if (parpadeo(t, 5) === 1) abiertos++;
  assert.ok(abiertos / 3000 > 0.9);
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  // Caminar, la lupa o una ficha abierta los cierran; mirarlos, también.
  assert.match(isla, /const molesto = seMueve \|\| conLupa\(lente\) \|\| !hoja\.hidden/);
  assert.match(isla, /< MIRADA\) cerrarLosOjos\(/);
  // No son un bicho: no se tocan ni tienen ficha.
  assert.match(readFileSync('src/styles/camino.css', 'utf-8'), /\.camino \.luz,\s*\.camino \.vida,\s*\.camino \.acecho-ojos \{[^}]*pointer-events: none;/);
  assert.doesNotMatch(readFileSync('src/pages/redondopedia/bestiario/[region].astro', 'utf-8'), /class="acecho-ojos"[^>]*(data-id|role=)/);
  // Con movimiento reducido no están: su reloj corre solo donde corre el del camino.
  assert.match(isla, /if \(!quieto\(\)\) \{[\s\S]*?moverAcecho\(dt, /);
});

test('la luz y los ojos son imágenes que la isla solo mueve: transform y opacity, sin resplandor de CSS', () => {
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  const escrituras = [...isla.matchAll(/(?:l\.el|acechoEl)\.style\.(\w+)/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(escrituras)].sort(), ['opacity', 'transform']);
  const css = readFileSync('src/styles/camino.css', 'utf-8');
  assert.doesNotMatch(css, /\.(luz|acecho-ojos)[^{]*\{[^}]*(filter|gradient|mix-blend|box-shadow|text-shadow)/);
});

/* ------------------------------------------------------------------
   Tercera ronda: cuatro regiones más, lo que cruza lejos, y el alivio
   ------------------------------------------------------------------ */

test('la ruta, el bajo, los techos y la prisión tienen el paquete entero: aire, luz y ojos', () => {
  for (const region of ['la-ruta', 'el-bajo', 'los-techos', 'la-prision']) {
    assert.ok(AIRE[region]?.length, `${region}: sin aire`);
    assert.ok(LUCES[region]?.length, `${region}: sin luz`);
    assert.ok(ACECHOS[region], `${region}: sin ojos`);
    assert.ok(VIDAS[region], `${region}: nada cruza lejos`);
    // Lo pegado a la cámara está: es lo que llena el borde de abajo. Los techos no lo llevan: abajo
    // tienen los yuyos de su baldío, y su ropa tendida cruza arriba y lejos.
    assert.equal(aireDe(region, 'cerca').length, region === 'los-techos' ? 0 : 1, `${region}: el primer plano`);
  }
  // Los recintos son una sola capa: lo de atrás del piso no se vería, así que no lo llevan.
  for (const region of ['el-bajo', 'los-techos', 'la-prision', 'el-infierno']) assert.equal(aireDe(region, 'fondo').length, 0, `${region}: una bruma que nadie ve`);
  // Y cada recinto con su mano: en la prisión, ni un soplo.
  for (const pieza of ['aire-prision-frio', 'aire-prision-rejas']) assert.doesNotMatch(PIEZAS_AIRE.find((p) => p.nombre === pieza)!.dibujo, /soplo-|rociado/, `${pieza}: aerógrafo en la madera tallada`);
  assert.match(PIEZAS_AIRE.find((p) => p.nombre === 'aire-bajo-vaho')!.dibujo, /xerox-fino/);
  // El piso de la ruta también tiene lo suyo, en la banquina.
  assert.ok((PIEZAS_CAMINO.find((q) => q.nombre === 'camino-ruta-piso')!.dibujo.match(/<clipPath id="sr-ch-/g) ?? []).length >= 4);
});

/**
 * Cuánto tapa una pieza impresa, medido en la imagen: en cada ventana de 24 unidades de ancho (lo
 * que mide un dedo en un teléfono parado), el alto medio de lo opaco. Así una hoja de pasto fina y
 * alta no cuenta como losa, y una tira ancha sí.
 */
async function loQueTapa(pieza: string, densidad: number): Promise<number> {
  const { data, info } = await sharp(`public${rutaDePieza(pieza)}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const ventana = Math.round(24 * densidad);
  const columna = new Float32Array(info.width);
  for (let x = 0; x < info.width; x++) {
    let n = 0;
    for (let y = 0; y < info.height; y++) if (data[(y * info.width + x) * 4 + 3]! > 128) n++;
    columna[x] = n / densidad;
  }
  let peor = 0;
  let suma = 0;
  for (let x = 0; x < info.width; x++) {
    suma += columna[x]!;
    if (x >= ventana) suma -= columna[x - ventana]!;
    if (x >= ventana - 1) peor = Math.max(peor, suma / ventana);
  }
  return peor / ALTO;
}

test('nada de lo de adelante ni de lo pegado a la cámara tapa más de un quinto del alto, en ninguna región', async () => {
  // El tope de la auditoría: ~20 % del alto visible en un teléfono parado. La escena se escala al alto
  // de la pantalla, así que el alto de la escena es el alto visible.
  const TOPE = 0.22;
  /**
   * La única que pasa, y por qué: en el galpón lo de adelante es la gente del recital, de espaldas, y
   * de ahí sale un brazo con la bengala, que es la luz de la escena. Es una, es fina, y es el dibujo.
   */
  const EXCEPCIONES: Readonly<Record<string, number>> = { 'camino-galpon-frente': 0.42 };
  const piezas: { nombre: string; densidad: number }[] = [];
  for (const t of Object.values(CAMINOS)) if (t.piezas.frente) piezas.push({ nombre: t.piezas.frente, densidad: PIEZAS_CAMINO.find((p) => p.nombre === t.piezas.frente)!.densidad ?? 2.5 });
  for (const p of PIEZAS_AIRE) if (capas.some(({ c }) => c.pieza === p.nombre && c.plano === 'cerca' && !c.cae)) piezas.push({ nombre: p.nombre, densidad: p.densidad ?? 2.5 });
  const vistas = new Set<string>();
  for (const { nombre, densidad } of piezas) {
    if (vistas.has(nombre)) continue;
    vistas.add(nombre);
    const tapa = await loQueTapa(nombre, densidad);
    assert.ok(tapa <= (EXCEPCIONES[nombre] ?? TOPE), `${nombre} tapa el ${Math.round(tapa * 100)} % del alto: es una losa en un teléfono parado`);
  }
  // Recorre todas: las trece regiones tienen su `frente` o no lo tienen, y cada `cerca` del aire está.
  assert.ok(vistas.size >= 12, `solo se midieron ${vistas.size} piezas`);
  // Los barrotes de la prisión dejan libre el medio: nunca cruzan la cara de nadie.
  const rejas = PIEZAS_AIRE.find((p) => p.nombre === 'aire-prision-rejas')!.dibujo;
  assert.doesNotMatch(rejas, /L[\d.]+ -20 L[\d.]+ 660 L/, 'un barrote entero, de arriba abajo');
});

test('lo que cruza lejos: de a uno, espaciado, impreso, y sin salirse de la cuenta', () => {
  const piezas = new Map(PIEZAS_DE_VIDA.map((p) => [p.nombre, p]));
  assert.ok(Object.keys(VIDAS).length >= 6);
  for (const [region, v] of Object.entries(VIDAS)) {
    assert.ok(CAMINOS[region], `${region} no es un camino`);
    assert.ok(piezas.get(v.pieza) && existsSync(`public${rutaDePieza(v.pieza)}`), `${region}: falta imprimir ${v.pieza}`);
    // Muy cada tanto: es un premio, no un salvapantallas.
    assert.ok(v.espera[0] >= 12, `${region}: pasa demasiado seguido`);
    for (const alReves of [false, true]) {
      const a = pasoDeVida(v, 0, 3, alReves);
      const z = pasoDeVida(v, 1, 9, alReves);
      // Entra y sale por afuera de la pantalla.
      assert.ok((a.fx < 0 && z.fx > 1) || (a.fx > 1 && z.fx < 0), `${region}: no cruza entera`);
      for (let u = 0; u <= 1; u += 0.05) {
        const p = pasoDeVida(v, u, u * 10, alReves);
        assert.ok(p.y > 0 && p.y < ALTO && p.aleteo > 0 && p.aleteo <= 1 && Math.abs(p.giro) <= v.bamboleo + 1e-9);
      }
    }
  }
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  assert.deepEqual([...new Set([...isla.matchAll(/vidaEl\.style\.(\w+)/g)].map((m) => m[1]))].sort(), ['opacity', 'transform']);
  // No pasa con movimiento reducido, ni con la lupa, ni cuando el teléfono no da.
  assert.match(isla, /if \(reloj < pasa\.proxima \|\| conLupa\(lente\) \|\| quieto\(\) \|\| alivio >= 2\) return;/);
  assert.match(readFileSync('src/styles/camino.css', 'utf-8'), /\.camino \.vida,\s*\.camino \.acecho-ojos \{[^}]*opacity: 0;/);
});

test('el alivio: sube de a un escalón si los cuadros vienen lentos, y saca primero lo de atrás', () => {
  assert.equal(alivioTras(0, 16.7), 0);
  assert.equal(alivioTras(0, ALIVIO.lento + 5), 1);
  assert.equal(alivioTras(1, 60), 2);
  assert.equal(alivioTras(2, 200), 2, 'no hay un tercer escalón: la niebla del medio y lo de cerca se quedan');
  assert.equal(alivioDeEntrada(8, 8), 0);
  assert.equal(alivioDeEntrada(2, 4), 1);
  assert.equal(alivioDeEntrada(8, 1), 1);
  assert.equal(alivioDeEntrada(undefined, undefined), 0, 'el que no dice nada arranca con todo');
  const css = readFileSync('src/styles/camino.css', 'utf-8');
  assert.match(css, /\.camino--liviano \.aire--fondo,\s*\.camino--muy-liviano \.luz,\s*\.camino--muy-liviano \.vida \{ display: none; \}/);
  // Lo que hace la escena no se apaga nunca.
  assert.doesNotMatch(css, /liviano \.aire--(medio|cerca)/);
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  assert.match(isla, /medirAlivio\(ahora - antes\);/);
});

test('la nevada de Cybersiberia es una capa de aire, no una animación adentro del piso', () => {
  // Adentro del dibujo, cada cuadro obligaba a repintar el piso entero: 12 cuadros por segundo con la
  // CPU estrangulada ×4, contra 54 como capa (medido en `D-90`, tercera ronda).
  assert.doesNotMatch(pisoDelCamino(CAMINOS.cybersiberia!, new Map()), /cyber-nevada/);
  const nevada = AIRE.cybersiberia!.find((c) => c.pieza === 'cyber-nieve');
  assert.ok(nevada?.ajena && nevada.cae === 40 && nevada.ancho === 900, 'la nevada cae lo mismo que caía: 640 unidades en 16 s');
});

test('las capas se pintan una vez por cuadro, no dos', () => {
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  assert.match(isla, /function encuadrar\(pintar = true\): void \{/);
  assert.match(isla, /encuadrar\(quieto\(\)\);/);
});

/* ------------------------------------------------------------------
   Cuarta ronda: el asiento del piso, lo lejano del monte, y el alivio forzado
   ------------------------------------------------------------------ */

test('lo tirado en el piso apoya: su mancha, la tierra que lo tapa, y más apagado cuanto más lejos', () => {
  const fuente = readFileSync('src/lib/bestiario/arte-suelo.ts', 'utf-8');
  assert.match(fuente, /function asentar\(/);
  // Todo lo que no es un charco pasa por el asiento, en las cuatro regiones con piso nuevo.
  assert.ok((fuente.match(/asentar\(|apoya\(/g) ?? []).length >= 14);
  // Y lo que está tirado va en escorzo, no de frente.
  assert.match(fuente, /acostado\(hojaCaida\(/);
  const piso = PIEZAS_CAMINO.find((q) => q.nombre === 'camino-monte-piso')!.dibujo;
  // La distancia apaga: hay objetos a media tinta, no todos al mismo valor.
  const apagados = new Set([...piso.matchAll(/<g opacity="(0\.\d+)">/g)].map((m) => m[1]));
  assert.ok(apagados.size >= 4, `el piso del monte tiene ${apagados.size} valores de distancia`);
});

test('lo lejano del monte no es una cinta: tramos a distinta altura, huecos, alguno vencido y bruma entre las filas', () => {
  const lejos = PIEZAS_CAMINO.find((q) => q.nombre === 'camino-monte-lejos')!.dibujo;
  // Algún tramo caído de costado.
  assert.ok((lejos.match(/<g transform="rotate\(-?\d/g) ?? []).length >= 3, 'ningún tramo vencido');
  // Bruma soplada entre las tres filas y al pie.
  assert.ok((lejos.match(/filter="url\(#soplo-xl\)"/g) ?? []).length >= 30, 'poca bruma entre las filas');
  // El canto del piso va bien soplado: no arranca con una raya.
  assert.match(readFileSync('src/lib/bestiario/arte-camino.ts', 'utf-8'), /soplo\(borde\(300\), M\.oscuro, 'l'\)/);
});

test('el alivio se puede forzar para mirarlo, y entonces no se mide', () => {
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  assert.match(isla, /new URLSearchParams\(location\.search\)\.get\('liviano'\)/);
  assert.match(isla, /if \(forzado !== undefined \|\| alivio >= ALIVIO\.niveles/);
});
