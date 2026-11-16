import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import sharp from 'sharp';

import { rutaDePieza } from './aerografo.ts';
import {
  ACECHOS, AIRE, ALIVIO, ALIVIO_DE_LA_REGION, FILO_PROPIO, LUCES, MIRADA, PASO_PLENO, VIDAS, aireDe, alfaDeAire, GROSOR_DEL_FILO, alivioDeEntrada, alivioTras, altoDeBaldosa, rutaDelFilo, tieneFiloPropio, corridaDeAire, despejeDeLupa, estadoDeLuz, latido,
  parpadeo, pasoDeVida, resto, tocaLaLuz,
} from './aire.ts';
import { PIEZAS_AIRE, PIEZAS_DE_FILO, PIEZAS_DE_LUZ, PIEZAS_DE_VIDA } from './arte-aire.ts';
import { FINAS_DE, PELADO, PIEZAS_CAMINO, PIEZAS_FINAS } from './arte-camino.ts';
import { camConLupa, LUPA_ANCLA } from './lupa.ts';
import { EJE_DEL_MOLINO, LUNA } from './arte-arboles.ts';
import { PIEZAS } from './arte.ts';
import { PIEZAS_ENTORNOS } from './arte-entornos.ts';
import { GIGANTE, LENGUAS, PIEZAS_DEL_SALON, SALON } from './arte-salon.ts';
import { CUEVA, PUERTA } from './arte-sobremesa.ts';
import { escenaInfierno } from './escenas.ts';
import { GALPON, MESA } from './rig-entornos.ts';
import { FRENTE_QUE_SE_CORRE, HUIDIZOS, VISITAS, dondeCaeElHaz, saltoDeAire, tocaLaZona } from './aire.ts';
import { MONTONES } from './arte-recital.ts';
import { ADORNOS_DEL_CRUCE, ANCHO_DEL_ADORNO } from './arte-cruces.ts';
import { destinosDelCruce, piezaDelCruce } from './arte-camino.ts';
import { ACECHO, PALO } from './rig.ts';
import { OJOS_DE_LA_RUTA, RUTA } from './rig-entornos.ts';
import { ofrendasDelTemplo, paradosEnElTemplo } from './ofrendas.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { ALTO, CAMINOS, VISTA_MAX } from './camino.ts';
import { ENTORNOS } from './arte-entornos.ts';
import { CARGUERO, GATO } from './arte-puerto.ts';
import { COLGANTES } from './arte-bonete.ts';
import { PLANOS } from './aire.ts';
import { COLOSO } from './arte-tundra.ts';
import { FAROL, OJO } from './arte-bonete.ts';
import { ARBOL, ASTILLERO, CYBER } from './rig-entornos.ts';
import { VISTA_MIN, corrimiento } from './camino.ts';
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
    // O tinta plana con el grano encima, donde la tapa es un afiche (la mesa) o son hojas sueltas (el árbol).
    assert.match(p.dibujo, /filter="url\(#(soplo-|xerox-fino|gubia|grano|rociado)/, `${c.pieza} no tiene mano`);
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
  for (const [pieza, marca] of [['camino-monte-piso', 'sm-ch-'], ['camino-pastura-piso', 'sp-'], ['camino-cyber-piso', 'sc-ch-'], ['camino-astillero-piso', 'sa-ch-']] as const) {
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
      // O el grano fino sobre tinta plana, en la mesa, que es un afiche (`D-91`, tanda 2).
      assert.match(p.dibujo, /filter="url\(#(rociado|xerox-fino|gubia|grano)\)"/, `${l.pieza} no tiene mano`);
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
  assert.match(readFileSync('src/styles/camino.css', 'utf-8'), /\.camino \.luz,\s*\.camino \.filo,\s*\.camino \.vida,\s*\.camino \.acecho-ojos \{[^}]*pointer-events: none;/);
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
  // Segunda vuelta de la tanda 2 de `D-91`: con la gente rehecha (cada uno con su canto, sin la trama a
  // campo lleno) el tope bajó de 0,42 a 0,34, y la pieza mide 0,31: ya no pasa raspando.
  const EXCEPCIONES: Readonly<Record<string, number>> = { 'camino-galpon-frente': 0.34 };
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
  assert.match(readFileSync('src/styles/camino.css', 'utf-8'), /\.camino \.filo,\s*\.camino \.vida,\s*\.camino \.acecho-ojos \{[^}]*opacity: 0;/);
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
  assert.match(css, /\.camino--liviano \.aire--fondo:not\(\.aire--firme\),\s*\.camino--muy-liviano \.luz,\s*\.camino--muy-liviano \.filo,\s*\.camino--muy-liviano \.vida \{ display: none; \}/);
  // Lo que hace la escena no se apaga nunca.
  assert.doesNotMatch(css, /liviano \.aire--(medio|cerca)/);
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  assert.match(isla, /medirAlivio\(ahora - antes\);/);
});

test('la nevada de Cybersiberia es una capa de aire, no una animación adentro del piso', () => {
  // Adentro del dibujo, cada cuadro obligaba a repintar el piso entero: 12 cuadros por segundo con la
  // CPU estrangulada ×4, contra 54 como capa (medido en `D-90`, tercera ronda).
  assert.doesNotMatch(pisoDelCamino(CAMINOS.cybersiberia!, new Map()), /cyber-nevada/);
  // Sexta ronda: la nevada y la ventisca son una sola capa, la nevisca, que cae al sesgo. Antes este
  // test pedía la capa `cyber-nieve` aparte; lo que protege es lo mismo (que la nieve no vuelva al
  // piso) más lo nuevo: que sea una sola superficie de pantalla entera, no dos.
  const enteras = AIRE.cybersiberia!.filter((c) => c.alto === ALTO);
  assert.deepEqual(enteras.map((c) => c.pieza), ['aire-cyber-nevisca']);
  const nevisca = enteras[0]!;
  assert.ok(nevisca.cae > 0 && nevisca.deriva < 0 && nevisca.suena === 'viento', 'cae y el viento la lleva');
  assert.ok(!existsSync('public/bestiario/aire-cyber-ventisca.webp'), 'la ventisca vieja no queda impresa');
});

test('Cybersiberia arranca aliviada en cualquier teléfono; las demás, solo en uno flojo', () => {
  assert.deepEqual(ALIVIO_DE_LA_REGION, { cybersiberia: 1 });
  assert.equal(alivioDeEntrada(8, 8, 'cybersiberia'), 1);
  assert.equal(alivioDeEntrada(8, 8, 'el-monte'), 0);
  assert.equal(alivioDeEntrada(2, 4, 'el-monte'), 1);
  assert.match(readFileSync('src/scripts/camino.ts', 'utf-8'), /alivioDeEntrada\(navigator\.hardwareConcurrency, delNavegador\.deviceMemory, datos\.region\)/);
});

test('el filo a medida: cada pieza de los títeres que pasan bajo una luz tiene su canto impreso', () => {
  assert.deepEqual(Object.keys(FILO_PROPIO).sort(), ['la-prision', 'la-ruta', 'los-astilleros', 'los-techos']);
  // Lo que no es cuerpo no lleva canto: ni el humo, ni los ojos, ni los muebles de la celda.
  assert.ok(tieneFiloPropio('dracula-cuerpo', 'la-prision') && !tieneFiloPropio('dracula-cuerpo', 'el-monte'));
  assert.ok(!tieneFiloPropio('atila-vaho', 'los-techos') || existsSync(`public${rutaDelFilo('atila-vaho')}`));
  assert.ok(!tieneFiloPropio('esclavo-pupila', 'la-prision'));
  let cuantos = 0;
  let peso = 0;
  for (const region of Object.keys(FILO_PROPIO)) {
    for (const p of [...PIEZAS_CAMINO.map((q) => q.nombre), ...readdirSync('public/bestiario').map((n) => n.replace('.webp', ''))]) {
      if (p.startsWith('filo-de-') || !tieneFiloPropio(p, region) || !existsSync(`public/bestiario/${p}.webp`)) continue;
      assert.ok(existsSync(`public${rutaDelFilo(p)}`), `${p}: falta imprimir su filo (--solo filo-de-)`);
      cuantos++;
    }
  }
  for (const n of readdirSync('public/bestiario')) if (n.startsWith('filo-de-')) peso += statSync(`public/bestiario/${n}`).size;
  assert.ok(cuantos >= 60, `hay ${cuantos} cantos`);
  assert.ok(peso < 400_000, `los cantos pesan ${Math.round(peso / 1024)} kB`);
  // La isla solo les mueve la opacidad, por una variable en la raíz del títere: ni un `filter`.
  const css = readFileSync('src/styles/camino.css', 'utf-8');
  // Séptima ronda: al doble, para que con medio haz encima ya esté prendido del todo. Sigue siendo
  // una sola propiedad, `opacity`.
  assert.match(css, /\.camino \.filo-propio \{[^}]*opacity: calc\(var\(--filo, 0\) \* 2\);\s*pointer-events: none;\s*\}/);
  assert.doesNotMatch(/\.camino \.filo-propio \{[^}]*\}/.exec(css)![0], /filter|shadow/);
  assert.match(css, /\.camino--muy-liviano \.filo-propio \{ display: none; \}/);
});

test('el haz no tiene canto de regla ni plano parejo, y el templo tiene sus ofrendas en el piso', () => {
  const foco = PIEZAS_DE_LUZ.find((p) => p.nombre === 'luz-templo-foco')!.dibujo;
  const silueta = /<mask id="lz-m"><path d="([^"]+)"/.exec(foco)![1]!;
  assert.ok(silueta.split('L').length > 24, 'el canto baja en tramos desparejos, no en dos rectas');
  assert.ok((foco.match(/fill="black"/g) ?? []).length >= 20, 'la máscara se cruza con vetas y motas');
  assert.doesNotMatch(foco, /Gradient/i);
  const ofrendas = AIRE['el-templo']!.find((c) => c.pieza === 'aire-templo-ofrendas')!;
  assert.ok(ofrendas.f === 1 && !ofrendas.deriva && !ofrendas.cae, 'van con el piso');
  // Séptima ronda: no es una baldosa que se repite (caía encima de los bichos), es el templo entero.
  assert.equal(ofrendas.ancho, 1940);
  assert.ok(ofrendas.y <= 450 && ofrendas.y + ofrendas.alto >= 620, 'llenan de abajo del medallón al papel picado');
  assert.ok(existsSync('public/bestiario/aire-templo-ofrendas.webp'));
});

test('el árbol, la mesa y el galpón tienen cosas en el piso, cada uno en la mano de su tapa', () => {
  const piso = (n: string): string => PIEZAS_CAMINO.find((q) => q.nombre === n)!.dibujo;
  // El árbol, aerógrafo: sus hojas van adentro del rociado. La mesa y el galpón, tinta plana con grano.
  assert.match(piso('camino-arbol-piso'), /entorno-arbol-cobre/);
  const fuente = readFileSync('src/lib/bestiario/arte-suelo.ts', 'utf-8');
  for (const [desde, hasta] of [['export function sueloDeLaMesa', 'const GA = '], ['export function sueloDelGalpon', '\n}\n']] as const) {
    const a = fuente.indexOf(desde);
    const tramo = fuente.slice(a, fuente.indexOf(hasta, a));
    assert.ok(tramo.length > 400);
    assert.doesNotMatch(tramo, /nube\(|soplo-/, `${desde}: es tinta plana, sin un soplo`);
  }
  const armado = readFileSync('src/lib/bestiario/arte-camino.ts', 'utf-8');
  assert.match(armado, /`<g filter="url\(#grano\)">\$\{sueloDeLaMesa\(/);
  assert.match(armado, /`<g filter="url\(#grano\)">\$\{sueloDelGalpon\(/);
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

test('D-91: lo lejano del monte son árboles en planos, no una fila de tiras', () => {
  const lejos = PIEZAS_CAMINO.find((q) => q.nombre === 'camino-monte-lejos')!.dibujo;
  // Ya no hay ni una tira de las de `filaDeTiras` (cada una era una máscara `cl-…`): era el serrucho.
  assert.doesNotMatch(lejos, /<clipPath id="cl-/);
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-camino.ts', 'utf-8').split('function pisoDelMonte')[0]!, /filaDeTiras\(/);
  // Bruma soplada entre los planos y al pie, y el frío de lo lejano: el petróleo de *Lobo suelto*.
  assert.ok((lejos.match(/filter="url\(#soplo-xl\)"/g) ?? []).length >= 30, 'poca bruma entre los planos');
  assert.match(lejos, /var\(--disco-lobo-suelto-apoyo\)/);
  // Lo de atrás va a media tinta (cada árbol con su opacidad); lo del medio, lleno y con su canto prendido.
  const tintas = new Set([...lejos.matchAll(/<g opacity="(0\.\d+)"><path/g)].map((m) => m[1]));
  assert.ok(tintas.size >= 3, `los árboles de atrás tienen ${tintas.size} valores`);
  // El canto del piso va bien soplado: no arranca con una raya.
  assert.match(readFileSync('src/lib/bestiario/arte-camino.ts', 'utf-8'), /soplo\(borde\(300\), M\.oscuro, 'l'\)/);
});

test('D-91: los troncos de adelante van aparte y cada uno es alguien', () => {
  const capa = AIRE['el-monte']!.find((c) => c.pieza === 'aire-monte-troncos')!;
  // Entre lo lejano y el piso, a una velocidad del medio, quietos (no son niebla: ni derivan ni laten).
  assert.equal(capa.plano, 'fondo');
  assert.ok(capa.f > CAMINOS['el-monte']!.velocidad.lejos && capa.f < 1);
  assert.deepEqual([capa.deriva, capa.late, capa.abre, capa.alfa], [0, 0, 0, 1]);
  const p = PIEZAS_AIRE.find((q) => q.nombre === 'aire-monte-troncos')!;
  const troncos = [...p.dibujo.matchAll(/data-tronco="tr-(\d)"/g)].map((m) => m[1]);
  // La baldosa cierra: los que caen cerca del borde se repiten del otro lado, así que hay más grupos que troncos.
  assert.ok(new Set(troncos).size >= 6, `${new Set(troncos).size} troncos`);
  // La cara (dos nudos con algo adentro que devuelve la luz) y lo tallado, que son para la lupa.
  assert.ok((p.dibujo.match(/<ellipse [^>]*transform="rotate\(-?\d+ /g) ?? []).length >= 2, 'falta la cara');
  assert.match(p.dibujo, /var\(--bestia-lobo-crema\)/, 'falta lo tallado');
  // Y se imprime fina, porque tiene canto duro y se mira de cerca.
  assert.ok((p.densidad ?? 0) >= 1.6 && (p.calidad ?? 0) >= 70);
  assert.ok(statSync('public/bestiario/aire-monte-troncos.webp').size < 330_000);
});

test('D-91: la pastura tiene lo suyo: su cielo, su piso, su alambrado y su aire', () => {
  const t = CAMINOS['la-pastura']!;
  const m = CAMINOS['el-monte']!;
  assert.notEqual(t.piezas.lejos, m.piezas.lejos);
  assert.notEqual(t.piezas.frente, m.piezas.frente);
  assert.ok(AIRE['la-pastura']!.every((c) => c.pieza.startsWith('aire-pastura-')), 'la pastura respira el aire del monte');
  const lejos = PIEZAS_CAMINO.find((q) => q.nombre === t.piezas.lejos)!.dibujo;
  const piso = PIEZAS_CAMINO.find((q) => q.nombre === t.piezas.piso)!.dibujo;
  // El cielo y el campo van en los azules del cordero, con la luna en el naranja de su tapa; el barro del monte no está.
  assert.match(lejos, /var\(--bestia-cordero-lana-oscura\)/);
  assert.match(lejos, new RegExp(`<circle cx="${LUNA.x}" cy="${LUNA.y}" r="${LUNA.r}" fill="var\\(--entorno-pastura\\)"`));
  assert.match(piso, /var\(--bestia-cordero-lana\)/);
  assert.doesNotMatch(piso, /sm-ch-/, 'el piso de la pastura sigue sembrado con lo del monte');
  // El viento pasa por el pasto: una capa que corre rápido, late y suena.
  const ola = AIRE['la-pastura']!.find((c) => c.pieza === 'aire-pastura-ola')!;
  assert.ok(Math.abs(ola.deriva) >= 40 && ola.late >= 0.2 && ola.suena === 'viento');
  // La niebla baja se abre al caminar, como pidió el usuario para el monte.
  assert.ok(AIRE['la-pastura']!.find((c) => c.pieza === 'aire-pastura-rasante')!.abre >= 0.5);
  // El alambrado se corta en el claro: ahí asoma el lobo y están los bichos, y nada fijo les cruza la cara.
  const fuente = readFileSync('src/lib/bestiario/arte-camino.ts', 'utf-8');
  assert.match(fuente, /alambrado\(desde - 10, claro\[0\] \+ 30,/);
  assert.match(fuente, /alambrado\(claro\[1\] - 30, hasta - 190,/);
  const dx = t.claro!.dx;
  assert.ok(dx + PALO.x - 320 + 30 <= dx + ACECHO.desde, 'el alambrado pasa por donde asoma el lobo');
  assert.ok(dx + PALO.x + 320 - 30 >= dx + ACECHO.hasta, 'el alambrado pasa por donde asoma el lobo');
});

test('D-91: la ruta larga tiene fondo, y el recinto de 900 queda como estaba', () => {
  const largo = PIEZAS_CAMINO.find((q) => q.nombre === 'camino-ruta-lejos')!.dibujo;
  const recinto = PIEZAS_ENTORNOS.find((q) => q.nombre === 'ruta-lejos')!.dibujo;
  // Los caminos que se van al horizonte con sus postes cada vez más chicos, y las sierras: solo a lo largo.
  assert.match(largo, /var\(--entorno-astillero-azul\)/);
  assert.doesNotMatch(recinto, /var\(--entorno-astillero-azul\)/);
  const fuente = readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8');
  assert.match(fuente, /const u = 1 - 0\.72 \*\* k;/, 'los postes del camino que se va no están en perspectiva');
  // La segunda fila de postes del piso no le echa niebla a la bella señora.
  assert.match(fuente, /const libre = Math\.abs\(x - X\(520\)\) > 150;/);
  assert.equal(OJOS_DE_LA_RUTA['la-bella-senora-desencarnada']![0], 520);
  // Los faros que no llegan nunca van con la bruma, que deriva despacio y late.
  const bruma = AIRE['la-ruta']!.find((c) => c.pieza === 'aire-ruta-bruma')!;
  assert.ok(bruma.deriva > 0 && bruma.deriva < 10 && bruma.late > 0);
  assert.match(PIEZAS_AIRE.find((q) => q.nombre === 'aire-ruta-bruma')!.dibujo, /var\(--entorno-templo-foco\)/);
});

test('el alivio se puede forzar para mirarlo, y entonces no se mide', () => {
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  assert.match(isla, /new URLSearchParams\(location\.search\)\.get\('liviano'\)/);
  assert.match(isla, /if \(forzado !== undefined \|\| alivio >= ALIVIO\.niveles/);
});

/* ------------------------------------------------------------------
   Quinta ronda: las trece, el charco roto, la luz que toca, lo que suena y la tiza
   ------------------------------------------------------------------ */

test('las trece regiones tienen aire y ojos sin dueño, y las cuatro últimas, su mano', () => {
  assert.deepEqual(Object.keys(AIRE).sort(), Object.keys(CAMINOS).sort());
  assert.deepEqual(Object.keys(ACECHOS).sort(), Object.keys(CAMINOS).sort());
  const dibujo = (pieza: string): string => PIEZAS_AIRE.find((p) => p.nombre === pieza)!.dibujo;
  // La mesa es un afiche: tinta plana con grano, ni un soplo.
  assert.match(dibujo('aire-mesa-humo'), /filter="url\(#grano\)"/);
  assert.doesNotMatch(dibujo('aire-mesa-humo'), /soplo-/);
  // El incienso del templo sí va soplado; las hojas del árbol caen y cierran para los dos lados.
  assert.match(dibujo('aire-templo-incienso'), /soplo-s/);
  assert.ok(AIRE['el-arbol']!.some((c) => c.cae > 0) && AIRE['el-arbol']!.some((c) => c.suena === 'viento'));
  assert.ok(AIRE['la-mesa']![0]!.cae < 0 && AIRE['el-templo']!.find((c) => c.pieza === 'aire-templo-incienso')!.cae < 0, 'el humo y el incienso suben');
  // Y el galpón tiene su seguidor, con el polvo adelante. Desde la tanda 2 de `D-91` el polvo va adentro
  // del humo del escenario, que es la primera capa (cambiado a propósito: antes era `aire-galpon-polvo`).
  assert.ok(LUCES['el-galpon'] && LUCES['el-templo'] && AIRE['el-galpon']![0]!.pieza === 'aire-galpon-humo');
  assert.match(readFileSync('src/lib/bestiario/arte-recital.ts', 'utf-8'), /El polvo que ya estaba/);
});

test('el charco del monte refleja roto: manchas acostadas, nunca una guirnalda de triángulos', () => {
  const fuente = readFileSync('src/lib/bestiario/arte-suelo.ts', 'utf-8');
  // El triángulo de punta abajo, que en fila era una guirnalda, ya no se pinta.
  assert.doesNotMatch(fuente, /L\$\{f\(lx \+ ancho\)\} \$\{f\(y - ry \* 1\.2\)\} L\$\{f\(lx \+ corre\)\}/);
  assert.match(fuente, /const pedazos = 3 \+ Math\.floor\(rnd\(\) \* 2\);/);
  for (const pieza of ['camino-monte-piso', 'camino-pastura-piso']) {
    const p = PIEZAS_CAMINO.find((q) => q.nombre === pieza)!.dibujo;
    // Adentro de un charco no hay ningún triángulo soplado.
    assert.doesNotMatch(p, /<clipPath id="sm-c[hl]-[^"]*">[\s\S]{0,400}?<path d="M[\d.-]+ [\d.-]+ L[\d.-]+ [\d.-]+ L[\d.-]+ [\d.-]+ Z" fill="[^"]+" filter="url\(#soplo-xs\)"/, `${pieza}: un reflejo en triángulo`);
  }
});

test('la luz toca a los bichos: un filo impreso, que se prende con el haz encima y no si el haz está lejos', () => {
  assert.equal(tocaLaLuz(0, 20), 1);
  assert.equal(tocaLaLuz(20, 20), 0);
  assert.equal(tocaLaLuz(-35, 20), 0);
  assert.ok(tocaLaLuz(8, 20) > tocaLaLuz(14, 20) && tocaLaLuz(14, 20) > 0);
  const conFilo = Object.entries(LUCES).filter(([, l]) => l[0]!.filo);
  assert.deepEqual(conFilo.map(([r]) => r).sort(), ['la-prision', 'la-ruta', 'los-astilleros', 'los-techos']);
  for (const [region, [l]] of conFilo) {
    const p = PIEZAS_DE_FILO.find((q) => q.nombre === l!.filo!.pieza);
    assert.ok(p && existsSync(`public${rutaDePieza(p.nombre)}`), `${region}: falta imprimir el filo`);
    // Eran hasta 3; desde la sexta ronda, 4: con el canto a medida la medialuna genérica casi no se
    // prende (queda para los bichos pintados en el piso), y hace falta lugar para los dos que conviven.
    assert.ok(l!.filo!.cuantos >= 1 && l!.filo!.cuantos <= 4, 'cada filo es una superficie más');
    assert.doesNotMatch(p.dibujo, /Gradient/i);
  }
  // Cada uno con la mano de su región: aerógrafo con grano en los astilleros, gubia en la prisión.
  assert.match(PIEZAS_DE_FILO.find((q) => q.nombre === 'filo-sodio')!.dibujo, /filter="url\(#grano\)"/);
  assert.match(PIEZAS_DE_FILO.find((q) => q.nombre === 'filo-papel')!.dibujo, /filter="url\(#gubia\)"/);
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  assert.deepEqual([...new Set([...isla.matchAll(/fl\.el\.style\.(\w+)/g)].map((m) => m[1]))].sort(), ['opacity', 'transform']);
  // A quién le toca se mide cada tanto y antes de mover nada, no por cuadro.
  assert.match(isla, /if \(filos\.length && cuadros % 30 === 0\) medirFilos\(\);/);
  // Los fierros que pasan no llevan filo: se le escaparían.
  assert.match(isla, /if \(g\.dataset\.velocidad\) continue;/);
});

test('el aire suena por el motor del camino, bajito, y solo lo que se ve', () => {
  const motor = readFileSync('src/scripts/bestiario/entorno.ts', 'utf-8');
  const topes = /const TOPE_DEL_AIRE = \{ viento: ([\d.]+), zumbido: ([\d.]+), chispa: ([\d.]+) \}/.exec(motor);
  assert.ok(topes, 'no encuentro los topes del aire');
  for (const t of topes.slice(1)) assert.ok(Number(t) > 0 && Number(t) <= 0.06, `un tope de ${t}: el aire acompaña, no tapa`);
  // Apagado no hace nada: sale por la misma salida que se prende y se apaga con el botón.
  assert.match(motor, /function soplo\(cual: 'viento' \| 'zumbido'\): GainNode \| null \{\s*if \(!prendido \|\| !ctx \|\| !ruido\) return null;/);
  assert.match(motor, /chispear\(fuerza\) \{\s*if \(!prendido \|\| !ctx \|\| !ruido \|\| !ocupar\(0\.3\)\) return;/);
  // Y se apaga con todo lo demás.
  assert.match(motor, /camas\.push\(\(\) => \{\s*soplos\.delete\(cual\);/);
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  // La isla no arma audio: le pide al motor, y solo con movimiento (no hay viento en una foto).
  assert.doesNotMatch(isla, /createOscillator|createBufferSource|new Audio\(/);
  assert.match(isla, /if \(l\.r\.suena && !quieto\(\)\) \{/);
  assert.equal((isla.match(/entorno\?\.(aire|chispear)\(/g) ?? []).length, 3);
  // Cada cosa que suena está atada a algo que se ve: la ventisca, la racha, un farol que titila, la brasa.
  assert.ok(AIRE.cybersiberia!.some((c) => c.suena === 'viento'));
  assert.equal(LUCES['el-infierno']![0]!.suena, 'chispa');
  for (const [region, [l]] of Object.entries(LUCES)) if (l!.suena === 'zumbido') assert.equal(l!.pulso, 'titila', `${region}: zumba algo que no titila`);
});

test('el redondel del bicho que habla es de tiza, y el foco del teclado sigue a la vista', () => {
  const css = readFileSync('src/styles/sitio.css', 'utf-8');
  // Ni el aro punteado parejo, ni la raya punteada fina del foco de los títeres.
  assert.doesNotMatch(css, /stroke-dasharray: 6 4;/);
  assert.doesNotMatch(css, /\.titere:focus-visible \{ outline: 2px dashed/);
  const regla = /\.bestiario-svg \.bestia:focus-visible \.toque,\s*\.bestiario-svg \.bestia--elegida \.toque \{([^}]*)\}/.exec(css)?.[1] ?? '';
  assert.match(regla, /stroke: var\(--papel\);/);
  assert.match(regla, /stroke-linecap: round;/);
  // Roto e irregular: muchos tramos, y ninguno igual al de al lado.
  const tramos = (/stroke-dasharray: ([\d ]+);/.exec(regla)?.[1] ?? '').split(' ').map(Number);
  assert.ok(tramos.length >= 8 && new Set(tramos).size >= 7, `la tiza tiene ${tramos.length} tramos`);
  // Sigue siendo una forma, no solo un color (`diseno-marca.md`), y no es un filtro ni una sombra.
  assert.doesNotMatch(regla, /filter|shadow/);
  // El foco: el oro del foco de todo el sitio, más grueso que la tiza.
  const foco = /\.bestiario-svg \.bestia:focus-visible \.toque \{([^}]*)\}/.exec(css)?.[1] ?? '';
  assert.match(foco, /stroke: var\(--acento-2\);/);
  assert.ok(Number(/stroke-width: ([\d.]+);/.exec(foco)?.[1]) > Number(/stroke-width: ([\d.]+);/.exec(regla)?.[1]));
  assert.match(css, /\.titere:focus-visible \{\s*outline: 3px solid var\(--acento-2\);/);
});

test('los techos no están ahogados: el crayón queda donde hay luz, no parejo de punta a punta', () => {
  // La pieza es previa a `D-90` (`baldio-lejos`, de `D-73`/`D-80`): 900 rayones en el cielo y 700 en el
  // piso se leían como ruido de televisor. Se bajaron en la séptima ronda; los de los faroles, no.
  const arte = readFileSync('src/lib/bestiario/arte.ts', 'utf-8');
  const cuenta = (re: RegExp): number => Number(re.exec(arte)![1]);
  assert.ok(cuenta(/rayones\(-20, -20, 920, 300, (\d+), /) <= 400, 'el cielo');
  assert.ok(cuenta(/rayones\(-10, 392, 910, alto, (\d+), /) <= 250, 'el piso, donde andan los bichos');
  assert.doesNotMatch(/rayones\(-10, 392, 910, alto, [^)]*\)/.exec(arte)![0], /B\.lila|B\.luz/, 'sin el lila, que saltaba delante de ellos');
  assert.ok(cuenta(/rayones\(farol\.x - 170, farol\.y - 120, farol\.x \+ 170, farol\.y \+ 140, (\d+), /) >= 260, 'el farol sigue apretado de rayones');
  assert.match(readFileSync('src/lib/bestiario/arte-baldio.ts', 'utf-8'), /for \(let i = 0; i < 40; i\+\+\) \{\s*const x = 60 \+ rnd\(\) \* \(largo - 80\);/);
});

test('el canto a medida se ve: grueso, de tinta llena y nunca blanco sobre blanco', () => {
  assert.ok(GROSOR_DEL_FILO >= 10);
  assert.equal(FILO_PROPIO['la-prision']!.tinta, 'var(--disco-oktubre-tinta)');
  // Y el botija, moreno bajo una luz naranja, en la tiza clara del muelle (octava ronda).
  assert.equal(FILO_PROPIO['los-astilleros']!.tinta, 'var(--entorno-astillero-tiza-clara)');
  assert.notEqual(FILO_PROPIO['la-prision']!.tinta, 'var(--bestia-dracula-papel)');
  assert.match(readFileSync('scripts/imprimir-bestiario.mjs', 'utf-8'), /filo\[i \+ 3\] = canto > 110 \? 255 : 0;/);
  // A quién le pega se mide al medio del cuerpo, no en la coronilla: a los altos no les tocaba nunca.
  assert.match(readFileSync('src/scripts/camino.ts', 'utf-8'), /Math\.atan2\(-\(b\.x - ancla\), b\.cy - l\.r\.y\)/);
});

test('las ofrendas del templo salen de los datos de la escena y no caen encima de nadie', () => {
  // Octava ronda. Antes los lugares estaban escritos a mano; ahora salen del ancla de cada títere y del
  // lugar de cada vecino (`ofrendas.ts`). Y el humo que bajaba se sacó: era la segunda capa de pantalla
  // entera del templo, y costaba entre 2 y 5 ms por cuadro con la CPU ×4.
  assert.equal(AIRE['el-templo']!.filter((c) => c.alto === ALTO).length, 1, 'una sola capa de pantalla entera');
  assert.ok(!existsSync('public/bestiario/aire-templo-humo-baja.webp'));
  const parados = paradosEnElTemplo();
  assert.ok(parados.length >= 7, 'los del elenco y los vecinos que pisan el piso');
  const { cerca, lejos } = ofrendasDelTemplo();
  assert.ok(cerca.length >= 1 && lejos.length >= 2, 'dos filas');
  for (const [x, cuantas] of cerca) for (const [bx, medio] of parados) assert.ok(Math.abs(x - bx) >= medio + cuantas * 13, `la tanda de ${x} cae encima del que está en ${bx}`);
  for (const x of lejos) for (const [bx, medio] of parados) assert.ok(Math.abs(x - bx) >= medio + 20, `la fila de atrás, en ${x}, cae encima del que está en ${bx}`);
  // Y un control que no sale de los mismos datos: dónde se los midió en la página el 2026-11-13 (medio y medio ancho).
  const medidos: readonly (readonly [number, number])[] = [[63, 28], [194, 68], [328, 28], [589, 28], [979, 85], [1240, 86], [1347, 28], [1468, 115]];
  for (const [x, cuantas] of cerca) for (const [bx, medio] of medidos) assert.ok(Math.abs(x - bx) > medio + cuantas * 13, `medido: la tanda de ${x} pisa al de ${bx}`);
  // Ninguna vela en el cruce, donde están los carteles.
  assert.ok([...cerca.map((c) => c[0] + c[1] * 14 + 30), ...lejos].every((x) => x < 1500));
  // Si alguien se muda, las velas se corren: el arte no guarda ningún lugar a mano.
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-aire.ts', 'utf-8'), /const OFRENDAS = \{/);
});

test('con movimiento reducido la linterna de los techos no queda prendida del todo', () => {
  const isla = readFileSync('src/scripts/bestiario/recintos.ts', 'utf-8');
  assert.match(isla, /const fuerza = \(\): number => \(ctx\.quieto\(\) \? 0\.28 : 0\.85\);/);
  assert.match(isla, /const brillo = \{ der: fuerza\(\), izq: 0 \};/);
});

/* ------------------------------------------------------------------
   `D-91`, segunda vuelta: lo que se vio mal en la primera
   ------------------------------------------------------------------ */

test('D-91/2: los troncos gordos del monte no se apagan en liviano; la bruma de las demás, sí', () => {
  const firmes = Object.entries(AIRE).flatMap(([r, cs]) => cs.filter((c) => c.firme).map((c) => `${r}:${c.pieza}`));
  // (En la segunda vuelta de la tanda 3 lo que cuelga del árbol fue una capa firme; en la tercera pasó a ser piezas del piso.)
  assert.deepEqual([...new Set(firmes)].sort(), ['el-monte:aire-monte-troncos']);
  const pagina = readFileSync('src/pages/redondopedia/bestiario/[region].astro', 'utf-8');
  assert.match(pagina, /'aire--firme': a\.firme/);
});

test('D-91/3: el círculo pelado es tierra gastada y pisada en redondo, no un disco naranja', () => {
  const piso = PIEZAS_CAMINO.find((q) => q.nombre === 'camino-pastura-piso')!.dibujo;
  const fuente = readFileSync('src/lib/bestiario/arte-camino.ts', 'utf-8');
  // El camino ya no usa el claro del recinto (el óvalo naranja de canto liso con su aro negro): pinta el suyo.
  assert.doesNotMatch(fuente, /claroDeLaPastura/);
  assert.match(fuente, /\$\{circuloPelado\(\)\}\$\{paloDeLaPastura\(\)\}/);
  assert.doesNotMatch(piso, /<ellipse [^>]*fill="var\(--entorno-pastura-honda\)" filter="url\(#soplo-s\)"/, 'sigue el óvalo naranja');
  assert.doesNotMatch(piso, /stroke-width="44"/, 'sigue el aro negro');
  // El pardo del lobo manda sobre el naranja de la tapa, que queda de veladura.
  const pelado = fuente.slice(fuente.indexOf('function circuloPelado'), fuente.indexOf('function pisoPastura'));
  // Cuarta vuelta: no tiene canto. Ni silueta, ni recorte de caja, ni fila de manchas en el borde del
  // piso: son manchas sopladas que se ralean hacia afuera. Y entra entero adentro del piso.
  assert.doesNotMatch(pelado, /clipPath|canto\(|forma\(fuera/);
  assert.match(pelado, /const afuera = Math\.max\(0, d - 0\.72\) \/ 0\.44;/);
  assert.ok(PALO.y + PELADO.dy - PELADO.ry * 1.16 >= 322, 'el redondel sube hasta el borde del piso');
  // El pasto llega hasta el redondel, no hasta una caja alrededor.
  assert.match(fuente, /if \(enLoPelado\(x, y\)\) continue;/);
  assert.doesNotMatch(fuente, /enElClaro\(x\) && y > 350/);
  const naranjas = [...pelado.matchAll(/M\.naranja(Honda)?, '[a-z]+', (0\.\d+)/g)].map((m) => Number(m[2]));
  assert.ok(naranjas.length >= 1 && naranjas.every((o) => o <= 0.15), `el naranja vuelve a mandar: ${naranjas}`);
  // La huella en redondo, con pezuñas.
  assert.match(pelado, /pisadas \+=/);
  assert.doesNotMatch(piso, /cp-claro/);
  // El palo está donde siempre, y el recinto sigue con su claro de siempre.
  assert.match(piso, /<clipPath id="m-palo">/);
  assert.match(PIEZAS.find((q) => q.nombre === 'monte-cerca')!.dibujo, /stroke-width="44"/);
  // Los charcos devuelven la luna rota, no rayas parejas.
  assert.doesNotMatch(readFileSync('src/lib/bestiario/arte-suelo.ts', 'utf-8').split('export function sueloDeLaPastura')[1]!.split('/* ----')[0]!, /'rayas'/);
  // El campo se compone en manchones, con la huella entre ellos, y algo que pesa a la entrada y a la salida.
  assert.match(fuente, /const tupido = \(x: number, y: number\): number =>/);
  assert.match(fuente, /calaveraDeVaca\(/);
  assert.match(fuente, /arado\(hasta - 330,[^\n]*\n\s*carroVolcado\(hasta - 196,/);
});

test('D-91/2: el molino gira, clavado en lo lejano, y su rueda no está impresa dos veces', () => {
  const [rueda] = LUCES['la-pastura']!;
  assert.equal(rueda!.f, CAMINOS['la-pastura']!.velocidad.lejos);
  assert.deepEqual([rueda!.x, rueda!.y], [EJE_DEL_MOLINO.x, EJE_DEL_MOLINO.y]);
  // Una vuelta tras otra: en veinte segundos no cambia de mano.
  const giros = Array.from({ length: 20 }, (_, i) => estadoDeLuz(rueda!, i).giro);
  assert.ok(giros.every((g, i) => i === 0 || g > giros[i - 1]!), 'la rueda va y viene en vez de girar');
  assert.ok(giros[19]! - giros[0]! > 360, 'no da ni una vuelta en veinte segundos');
  assert.match(readFileSync('src/lib/bestiario/arte-arboles.ts', 'utf-8'), /molino\(MOLINO\.x, MOLINO\.pie, MOLINO\.alto, true\)/);
});

test('D-91/2: la ruta larga tiene punto de fuga y cielo de chapa; el polvo no tapa lo lejano', () => {
  const largo = PIEZAS_CAMINO.find((q) => q.nombre === 'camino-ruta-lejos')!.dibujo;
  const recinto = PIEZAS_ENTORNOS.find((q) => q.nombre === 'ruta-lejos')!.dibujo;
  // La plata vieja de *Último bondi* en las planchas del cielo y el ojo de buey: solo a lo largo.
  assert.match(largo, /var\(--disco-ultimo-bondi-a-finisterre-tinta\)/);
  assert.doesNotMatch(recinto, /var\(--disco-ultimo-bondi-a-finisterre-tinta\)/);
  const fuente = readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8');
  // Las torres se achican en perspectiva hasta el horizonte, y la bruma se las va tragando.
  assert.match(fuente, /const u = 1 - 0\.64 \*\* k;/);
  assert.match(fuente, /const traga = Math\.min\(0\.92, t\.u \* 1\.25\);/);
  // El polvo va sobre el asfalto: no sube al horizonte.
  const polvo = AIRE['la-ruta']!.find((c) => c.pieza === 'aire-ruta-polvo')!;
  assert.ok(polvo.y >= RUTA.asfalto.arriba - 30, 'el polvo tapa lo lejano');
});

test('D-91/2: los faros del bondi tocan a los de la banquina, y llevan polillas', () => {
  const [faros] = LUCES['la-ruta']!;
  assert.ok(faros!.filo && faros!.sigue === 'el-zumba' && faros!.rumbo === -90);
  for (const p of ['taxi-carroceria', 'desencarnada-torso', 'piba-torso']) {
    assert.ok(tieneFiloPropio(p, 'la-ruta'), `${p}: sin filo`);
    assert.ok(existsSync(`public${rutaDelFilo(p)}`), `${p}: falta imprimir su filo`);
  }
  // Lo que no es cuerpo no se prende: el haz del taxi, las matas de su banquina, la zeta del sueño.
  for (const p of ['taxi-haz', 'taxi-banquina', 'piba-zeta']) assert.ok(!tieneFiloPropio(p, 'la-ruta'), `${p}: con filo`);
  // La isla mide desde donde está el bondi ahora, y a lo largo del haz.
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  assert.match(isla, /const anclaX = l\.r\.x \+ Number\(colgada\?\.dataset\.ahora/);
  assert.match(isla, /const deCostado = Math\.abs\(l\.r\.rumbo \?\? 0\) > 45;/);
  assert.match(PIEZAS_DE_LUZ.find((q) => q.nombre === 'luz-ruta-faros')!.dibujo, /rotate\(/, 'sin polillas');
});

/* ------------------------------------------------------------------
   `D-91`, tercera vuelta
   ------------------------------------------------------------------ */

test('D-91/3: el piso del monte deja de ser un plano marrón: sendero en escorzo, matas con peso, hojarasca, musgo', () => {
  const fuente = readFileSync('src/lib/bestiario/arte-camino.ts', 'utf-8');
  const piso = PIEZAS_CAMINO.find((q) => q.nombre === 'camino-monte-piso')!.dibujo;
  // El sendero se angosta con la distancia (no sube derecho como un haz) y lleva surcos y matas en el canto.
  assert.match(fuente, /const hondo = 1 - \(1 - u\) \*\* 2\.2;/);
  assert.match(fuente, /ps\.push\(\[px, y, 108 \* lejos \*\* 1\.7 \+ 3\.5\]\);/);
  // Los pastos son matas juntas, pocas: una cada 150 a 320 unidades, no una lluvia pareja.
  assert.match(fuente, /cx \+= 150 \+ rnd\(\) \* 170\)/);
  // Hojarasca, barro mojado y piedras con musgo (el verde del ojo del cordero, el único de las dos tapas).
  assert.ok((fuente.match(/^\s+hojarasca\(/gm) ?? []).length >= 4);
  assert.ok((fuente.match(/^\s+barroMojado\(/gm) ?? []).length >= 3);
  assert.ok((piso.match(/<clipPath id="pm-/g) ?? []).length >= 4);
  assert.match(piso, /var\(--bestia-cordero-ojo\)/);
  // Nada de lo nuevo cae en la zona del bicho de `T-529`, (660, 262): todo está de y = 350 para abajo.
  for (const m of fuente.matchAll(/^\s+(?:hojarasca|barroMojado|piedraConMusgo)\((\d+), (\d+),/gm)) assert.ok(Number(m[2]) >= 350, `algo en (${m[1]}, ${m[2]})`);
  // Los troncos gordos pisan en el borde del piso: las raíces asoman.
  assert.match(readFileSync('src/lib/bestiario/arte-aire.ts', 'utf-8'), /troncosCercanos\(troncos, 302, 4101, 'tr'\)/);
});

test('D-91/3: el asfalto de la ruta se abre: paso a nivel, guardarraíl roto y un charco con una torre', () => {
  const largo = PIEZAS_CAMINO.find((q) => q.nombre === 'camino-ruta-piso')!.dibujo;
  const recinto = PIEZAS_ENTORNOS.find((q) => q.nombre === 'ruta-piso')!.dibujo;
  assert.match(largo, /<clipPath id="r-torre">/);
  assert.doesNotMatch(recinto, /<clipPath id="r-torre">/, 'el recinto de 900 cambió');
  const fuente = readFileSync('src/lib/bestiario/arte-entornos.ts', 'utf-8');
  // La vía se va al horizonte con los durmientes cada vez más juntos, y no pisa a nadie de la banquina.
  assert.match(fuente, /const u = 1 - 0\.9 \*\* k;/);
  const [, via, riel] = /pasoANivel\((\d+), alto, RUTA\.horizonte\) \+ guardarrail\((\d+),/.exec(fuente)!;
  const k = 2400 / 900;
  for (const [x] of Object.values(OJOS_DE_LA_RUTA)) {
    assert.ok(Math.abs(x * k - Number(via)) > 200, 'la vía pasa por un bicho');
    assert.ok(x * k < Number(riel) - 40 || x * k > Number(riel) + 230, 'el guardarraíl pasa por un bicho');
  }
  // Lo lejano de las dos de aerógrafo se imprime más fino, para la lupa, sin pasar los 4096 px de ancho.
  for (const n of ['camino-monte-lejos', 'camino-pastura-lejos']) {
    const p = PIEZAS_CAMINO.find((q) => q.nombre === n)!;
    assert.ok((p.densidad ?? 0) >= 1.6 && p.caja[2] * (p.densidad ?? 0) <= 4096, `${n}: ${p.caja[2] * (p.densidad ?? 0)} px`);
  }
});

/* ------------------------------------------------------------------
   `D-91`, cuarta vuelta
   ------------------------------------------------------------------ */

test('D-91/4: con la lupa el paralaje se ancla: lo que se apunta en una capa de atrás queda donde se apunta', () => {
  // Sin lupa, la cámara de siempre, para cualquier capa.
  for (const f of [0.45, 0.72, 1, 1.3, 1.75]) assert.equal(camConLupa(f, 800, 500, 1), 800);
  // El piso no se entera nunca.
  assert.equal(camConLupa(1, 800, 500, 2.6), 800);
  // Con la lupa del todo puesta, una capa de velocidad f se corrió f·camSinLupa + lo que se corrió el piso desde ahí.
  for (const f of [0.45, 0.72, 1.3, 1.75]) {
    const corrida = f * camConLupa(f, 800, 500, 1 + LUPA_ANCLA);
    assert.ok(Math.abs(corrida - (f * 500 + (800 - 500))) < 1e-9, `f = ${f}`);
    // Lo mismo para la capa que viaja con la tira, a la que solo le falta la diferencia.
    const conLaTira = (f - 1) * camConLupa(f, 800, 500, 2, false);
    assert.ok(Math.abs(conLaTira - (f - 1) * 500) < 1e-9, `f = ${f}, con la tira`);
  }
  // Entra de a poco: a medio camino está entre las dos, y es continua al sacar y al poner la lupa.
  const medio = camConLupa(0.72, 800, 500, 1 + LUPA_ANCLA / 2);
  assert.ok(medio > 800 && medio < camConLupa(0.72, 800, 500, 2));
  assert.ok(Math.abs(camConLupa(0.72, 800, 500, 1.0001) - 800) < 0.2);
  // La isla la usa en las tres cuentas con paralaje: las capas, el aire y las luces.
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  assert.match(isla, /corrimiento\(c\.f, camDe\(c\.f\), focoPx, vistaPx\)/);
  assert.match(isla, /corridaDeAire\(a\.c, camDe\(a\.c\.f, paralaje\) \/ escala, t, paralaje\)/);
  assert.match(isla, /corrimiento\(l\.r\.f, camDe\(l\.r\.f\), datos\.foco \* escala, vistaPx\)/);
  assert.match(isla, /if \(lente\.z <= 1\) camSinLupa = cam;/);
});

test('D-91/4: lo que premia a la lupa va otra vez, fino, encima del piso y en su mismo lugar', () => {
  // La mesa se sumó en la tanda 2 (la cueva del ratón, debajo del mantel).
  // Y en la tanda 3, las tres de esa tanda: la rayuela del muelle, el hielo con el casete y la jaula del árbol.
  assert.deepEqual(Object.keys(FINAS_DE).sort(), ['cybersiberia', 'el-arbol', 'el-monte', 'la-mesa', 'la-pastura', 'la-ruta', 'los-astilleros']);
  let peso = 0;
  for (const [region, nombres] of Object.entries(FINAS_DE)) {
    const piso = pisoDelCamino(CAMINOS[region]!, new Map());
    for (const n of nombres) {
      const p = PIEZAS_FINAS.find((q) => q.nombre === n)!;
      assert.ok(p && (p.densidad ?? 0) >= 3, `${n}: no es fina`);
      assert.ok(existsSync(`public${rutaDePieza(n)}`), `${n}: falta imprimirla`);
      peso += statSync(`public${rutaDePieza(n)}`).size;
      // Va en el piso, después del piso impreso (encima), en la caja que dice la pieza.
      const dePiso = piso.indexOf(rutaDePieza(CAMINOS[region]!.piezas.piso!));
      const deFina = piso.indexOf(rutaDePieza(n));
      assert.ok(dePiso >= 0 && deFina > dePiso, `${n}: no está encima del piso`);
      assert.match(piso, new RegExp(`href="${rutaDePieza(n).replace(/[.]/g, '\\.')}" x="${p.caja[0]}" y="${p.caja[1]}"`));
    }
  }
  // (Segunda vuelta de la tanda 3: son diez, con un segundo premio en cada una de las tres; el tope pasa a 300 kB.)
  // Siete piezas chicas pesan menos que subirle la densidad a un solo piso (el tope era 120 kB con cuatro; cambia con la tanda 3).
  assert.ok(peso < 300_000, `las finas pesan ${Math.round(peso / 1024)} kB`);
});

test('D-91/4: lo que se mueve raro: el tren del horizonte, el vellón con el viento, y el charco de la luna', () => {
  const tren = VIDAS['la-ruta']!;
  assert.equal(tren.pieza, 'vida-tren');
  // Lejos y despacio: tarda casi medio minuto, y pasa uno cada 44 segundos o más. No aletea ni sube ni baja.
  assert.ok(tren.dura[0] >= 20 && tren.espera[0] >= 40 && tren.aletea === 0 && tren.y[0] === tren.y[1]);
  assert.ok(tren.y[0] < RUTA.horizonte, 'el tren no va por el horizonte');
  const vellon = VIDAS['la-pastura']!;
  // Va para donde sopla el viento de la ola, que es para la izquierda, y rodando.
  assert.ok(vellon.alReves === true && AIRE['la-pastura']!.find((c) => c.pieza === 'aire-pastura-ola')!.deriva < 0 && vellon.bamboleo > 20);
  assert.ok(vellon.espera[0] >= 14, 'si se ve siempre, deja de ser misterio');
  assert.match(readFileSync('src/scripts/camino.ts', 'utf-8'), /pasa\.alReves = loQuePasa\.alReves \?\? \(/);
  for (const v of [tren, vellon]) assert.ok(existsSync(`public${rutaDePieza(v.pieza)}`), `falta imprimir ${v.pieza}`);
  assert.ok(!existsSync('public/bestiario/vida-fugaz.webp'), 'quedó impresa la estrella que ya no cruza');
  // El charco grande del monte, en el tercio de abajo, devuelve la luna en tajadas.
  const piso = PIEZAS_CAMINO.find((q) => q.nombre === 'camino-monte-piso')!.dibujo;
  assert.match(piso, /<clipPath id="ch-luna">/);
  assert.match(readFileSync('src/lib/bestiario/arte-camino.ts', 'utf-8'), /charcoDeLaLuna\(1500, 560,/);
  // Y pegado a la cámara hay helechos, además de matas.
  assert.match(readFileSync('src/lib/bestiario/arte-aire.ts', 'utf-8'), /function helecho\(/);
});

/* ------------------------------------------------------------------
   `D-91`, tanda 2: el galpón, el infierno y la mesa
   ------------------------------------------------------------------ */

test('D-91/t2: la gente del galpón va en planos, y el pogo son dos capas que saltan a contratiempo', () => {
  const aire = AIRE['el-galpon']!;
  const [pogo, otra] = [aire.find((c) => c.pieza === 'aire-galpon-pogo')!, aire.find((c) => c.pieza === 'aire-galpon-pogo-b')!];
  assert.ok(pogo.salta > 0 && otra.salta > 0 && Math.abs(pogo.faseSalta - otra.faseSalta) > 0.8, 'las dos capas del pogo saltan, y no juntas');
  assert.ok(pogo.plano === 'medio' && otra.plano === 'medio' && otra.f < CAMINOS['el-galpon']!.velocidad.frente && pogo.f < otra.f, 'el pogo va detrás de la fila grande');
  // Segunda vuelta: ya no hay nada pegado a la cámara (eran bultos negros), y siguen siendo tres capas.
  assert.equal(aire.length, 3);
  assert.equal(aireDe('el-galpon', 'cerca').length, 0);
  assert.ok(!existsSync('public/bestiario/aire-galpon-cerca.webp'), 'quedó impresa la capa que se fue');
  // El salto baja y vuelve, nunca sube por encima de donde está impresa la capa ni pasa de lo que dice la receta.
  for (const c of [pogo, otra]) {
    let [min, max] = [Infinity, -Infinity];
    for (let t = 0; t < 60; t += 0.037) {
      const y = saltoDeAire(c, t);
      min = Math.min(min, y);
      max = Math.max(max, y);
    }
    assert.ok(min >= 0 && max <= c.salta + 1e-9 && max - min > c.salta * 0.5, `${c.pieza}: salta de ${min} a ${max}`);
    // Tercera vuelta: la capa ya no llega al fondo de la pantalla (se achicó por la cuenta). Termina detrás de
    // la fila grande, que arranca en `GALPON.gente`, y su pie se deshace soplado en vez de cortarse.
    assert.ok(c.y + c.alto < ALTO && c.y + c.alto > GALPON.gente + 60);
    assert.match(PIEZAS_AIRE.find((q) => q.nombre === c.pieza)!.dibujo, /<mask id="gl-pie-\d"/);
  }
  assert.ok([0.3, 1.1, 2.7].some((t) => Math.abs(saltoDeAire(pogo, t) - saltoDeAire(otra, t)) > 3), 'las dos capas van al mismo compás');
  // Las que no saltan, cero: el aire de las otras doce regiones no se entera.
  for (const { c } of capas.filter((x) => !x.c.salta)) assert.equal(saltoDeAire(c, 7.3), 0);
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  assert.match(isla, /\(quieto\(\) \? 0 : saltoDeAire\(a\.c, t\)\)/, 'con movimiento reducido nadie salta');
  // Montón por medio: una capa pinta los pares y la otra los impares, así el vecino siempre es de la otra.
  const [a, b] = ['aire-galpon-pogo', 'aire-galpon-pogo-b'].map((n) => PIEZAS_AIRE.find((q) => q.nombre === n)!.dibujo);
  assert.ok(a !== b && /gl-p0-\d+/.test(a!) && /gl-p1-\d+/.test(b!) && !/gl-p1-/.test(a!));
  assert.equal(MONTONES % 2, 0);
  // Los gajos (una sola capa partida en ocho, cada una con su salto) se probaron y se sacaron: duplicaban el cuadro.
  assert.doesNotMatch(isla + readFileSync('src/styles/camino.css', 'utf-8'), /gajo/);
  // El camino pinta su gente: el piso con las filas del fondo y lo de adelante con banderas y bengalas.
  // El recinto de 900 sigue con la fila de siempre.
  const [piso, frente] = ['camino-galpon-piso', 'camino-galpon-frente'].map((n) => PIEZAS_CAMINO.find((q) => q.nombre === n)!.dibujo);
  assert.equal((piso.match(/<pattern id="gl-trama-fondo-/g) ?? []).length, 3, 'tres filas de gente contra el tablado');
  // Segunda vuelta: cada uno es una figura con su canto (su silueta, y la misma corrida encima), no una máscara para toda la fila.
  assert.ok((frente.match(/<clipPath id="gl-bandera-/g) ?? []).length >= 3 && (frente.match(/<clipPath id="gl-g-\d+">/g) ?? []).length > 60);
  assert.ok((piso.match(/<clipPath id="gl-f\d-\d+">/g) ?? []).length > 300);
  for (const n of ['galpon-piso', 'galpon-frente', 'galpon-lejos']) assert.doesNotMatch(PIEZAS_ENTORNOS.find((q) => q.nombre === n)!.dibujo, /gl-(trama|f\d|g-|bandera)|Un tacho/, `${n}: el recinto no lleva lo del camino`);
  // La gente no son globos: la cabeza se arma con pelo, gorra, capucha, cresta o perfil, y lleva cuello y hombros.
  const recital = readFileSync('src/lib/bestiario/arte-recital.ts', 'utf-8');
  for (const marca of ['// Pelo largo', '// Rulos', '// Gorra', '// Capucha', '// De perfil', '// Cresta', '// El cuello.', 'function enAndas(']) assert.ok(recital.includes(marca), `falta ${marca}`);
  assert.doesNotMatch(recital, /luzDeCabezas/, 'volvió la luz en disco, que hacía de cada cabeza un globo');
  // Tercera vuelta: el seguidor le prende el canto a la fila grande, por zonas. Cada zona es una pieza chica que va
  // con la capa de adelante, apagada hasta que el haz le apunta; con movimiento reducido no se prenden.
  const zonas = LUCES['el-galpon']![0]!.cantos!;
  assert.equal(zonas.length, 3);
  for (const [i, z] of zonas.entries()) {
    assert.equal(z.f, CAMINOS['el-galpon']!.velocidad.frente);
    assert.ok(existsSync(`public${rutaDePieza(z.pieza)}`), `falta imprimir ${z.pieza}`);
    assert.ok(statSync(`public${rutaDePieza(z.pieza)}`).size < 40_000);
    // De izquierda a derecha, y se pisan un poco.
    if (i) assert.ok(z.caja[0] < zonas[i - 1]!.caja[0] + zonas[i - 1]!.caja[2] && z.caja[0] > zonas[i - 1]!.caja[0]);
    const d = PIEZAS_CAMINO.find((q) => q.nombre === z.pieza)!.dibujo;
    assert.match(d, /<mask id="gl-canto"[^>]*>/);
    assert.match(d, /filter="url\(#soplo-l\)" fill="black"/, 'la zona termina a cuchillo');
  }
  assert.match(isla, /if \(l\.cantos\.length && l\.r\.cantos && !quieto\(\)\) \{/);
  // Cuarta vuelta: la zona cae bajo el haz. El seguidor va con el piso y la gente con la capa de adelante, así
  // que se calcula con el corrimiento de las dos; y las zonas cubren todo lo que el haz puede barrer.
  const seguidor = LUCES['el-galpon']![0]!;
  const en = seguidor.cantosEn!;
  assert.ok(en > GALPON.gente && en < ALTO);
  assert.equal(dondeCaeElHaz(100, 0, 0, 500, 1.3, 0), 100, 'derecho para abajo y sin caminar, cae donde está');
  assert.ok(dondeCaeElHaz(100, 0, 20, 500, 1, 0) < 100, 'con el ángulo positivo el haz va para la izquierda');
  assert.ok(Math.abs(dondeCaeElHaz(100, 0, 0, 500, 1.3, 1000) - 400) < 1e-9, 'con la cámara corrida, la capa de adelante se adelanta');
  for (const vista of [300, 1024]) {
    for (let t = 0; t < 30; t += 0.21) {
      const apunta = (seguidor.rumbo ?? 0) + estadoDeLuz(seguidor, t).giro;
      const enElPiso = dondeCaeElHaz(seguidor.x, seguidor.y, apunta, en, 1, 0);
      // Con lo que cae bajo el haz en cualquier lugar de la pantalla, alguna zona se prende.
      for (const u of [0.15, 0.5, 0.85]) {
        const cam = enElPiso - vista * u;
        const xf = dondeCaeElHaz(seguidor.x, seguidor.y, apunta, en, 1.3, cam);
        assert.ok(Math.max(...zonas.map((z) => tocaLaZona(xf, z.caja))) > 0.3, `nadie se prende con el haz en ${Math.round(xf)} (vista de ${vista})`);
      }
    }
  }
  assert.equal(tocaLaZona(zonas[1]!.caja[0] + zonas[1]!.caja[2] / 2, zonas[1]!.caja), 1);
  assert.match(isla, /const xf = dondeCaeElHaz\(ancla, l\.r\.y, apunta, l\.r\.cantosEn \?\? ALTO, z\.f, camDe\(z\.f\) \/ escala\);/);
  // Tinta caliente (el oro con el punto de papel), y fino: solo la coronilla y los hombros.
  assert.match(recital, /patron\('gl-trama-luz', 3\.2, G\.oro, G\.papel, 1\.1\)/);
  // Quinta vuelta: un solo trazo por persona (de hombro a hombro por la coronilla), no el canto de toda la silueta.
  const unaZona = PIEZAS_CAMINO.find((q) => q.nombre === zonas[0]!.pieza)!.dibujo;
  const trazos = (unaZona.match(/fill="none" stroke="white"/g) ?? []).length;
  const cuerpos = (unaZona.match(/<path d="[^"]+" fill="black"\/>/g) ?? []).length;
  assert.ok(trazos > 60 && trazos <= cuerpos, `${trazos} trazos para ${cuerpos} cuerpos`);
  assert.doesNotMatch(unaZona, /gl-c-\d+/, 'volvió el canto de la silueta entera');
  assert.match(readFileSync('src/pages/redondopedia/bestiario/[region].astro', 'utf-8'), /class="capa canto-de-luz" data-f=\{c\.f\}/);
  // El techo: la parrilla y los bafles van en lo lejano del camino, por arriba de los trapos.
  const lejos = PIEZAS_CAMINO.find((q) => q.nombre === 'camino-galpon-lejos')!.dibujo;
  assert.notEqual(lejos, PIEZAS_ENTORNOS.find((q) => q.nombre === 'galpon-lejos')!.dibujo);
  assert.match(recital, /colgados\(820, 96, 1\) \+\s*colgados\(1592, 96, -1\)/);
  // Las banderas no le cruzan la cara a los que están en el tablado: la punta del palo no pasa del borde.
  assert.match(readFileSync('src/lib/bestiario/arte-recital.ts', 'utf-8'), /const punta = GALPON\.tablado\.borde \+ 2 \+ rnd\(\) \* 26;/);
  assert.ok(GALPON.tablado.borde < GALPON.gente);
});

test('D-91/t2: la zapatilla vuela en arco, y el tren de la ruta pasa por detrás de los postes', () => {
  const z = VIDAS['el-galpon']!;
  assert.equal(z.pieza, 'vida-zapatilla');
  assert.ok((z.arco ?? 0) > 60 && z.dura[1] < 5 && z.espera[0] >= 20);
  const [a, m, b] = [0, 0.5, 1].map((u) => pasoDeVida(z, u, 1, false).y);
  assert.ok(m! < a! - 60 && m! < b! - 60 && m! > 240, 'sube en el medio, y no llega a la cara de los del tablado');
  // El que no tiene arco cruza como antes.
  assert.equal(pasoDeVida(VIDAS['la-ruta']!, 0.5, 1, false).y, VIDAS['la-ruta']!.y[0]);
  assert.equal(VIDAS['la-ruta']!.atras, true);
  const pagina = readFileSync('src/pages/redondopedia/bestiario/[region].astro', 'utf-8');
  const [atras, piso, adelante] = [pagina.indexOf('{vida?.atras && ('), pagina.indexOf('class="capa capa--piso bestiario-svg"'), pagina.indexOf('{vida && !vida.atras && (')];
  assert.ok(atras > 0 && atras < piso && piso < adelante, 'lo que cruza por detrás va antes del piso en la página');
});

test('D-91/t2: la mesa tiene fondo sin perder la tinta plana: la puerta, la lámpara, las moscas y lo de abajo del mantel', () => {
  const lejos = PIEZAS_CAMINO.find((q) => q.nombre === 'camino-mesa-lejos')!.dibujo;
  // La puerta del fondo, los retratos y la ventana van encima de la pared de siempre, con el grano y sin un soplo nuevo.
  const sumado = lejos.slice(lejos.lastIndexOf('<g filter="url(#grano)">'));
  assert.match(sumado, /<clipPath id="ms-puerta">/);
  assert.ok((sumado.match(/<clipPath id="ms-r\d">/g) ?? []).length >= 5 && /<clipPath id="ms-vidrio">/.test(sumado));
  assert.doesNotMatch(sumado, /soplo-|Gradient/i, 'lo sumado a la pared es tinta plana');
  assert.doesNotMatch(PIEZAS_ENTORNOS.find((q) => q.nombre === 'mesa-lejos')!.dibujo, /ms-puerta/, 'el recinto de 900 queda como estaba');
  // La puerta termina en la línea de la mesa y su punto de fuga queda adentro del vano.
  assert.ok(PUERTA.fuga.x > PUERTA.x && PUERTA.fuga.x < PUERTA.x + PUERTA.ancho && PUERTA.fuga.y > PUERTA.arriba && PUERTA.fuga.y < MESA.tablero.atras);
  // La lámpara: una luz de papel, que se hamaca. Segunda vuelta: clavada en la pared (va con lo lejano), en
  // el paño libre entre la puerta del fondo y la ventana, y el cono termina en la línea de la mesa. Así no le
  // cruza por delante a la ventana ni a un retrato en ninguna pantalla (antes iba con el piso y a 1280 los cruzaba).
  const lampara = LUCES['la-mesa']![0]!;
  assert.ok(lampara.vaiven > 0 && lampara.pulso === 'barre' && lampara.y < 0);
  assert.equal(lampara.f, CAMINOS['la-mesa']!.velocidad.lejos);
  const k = CAMINOS['la-mesa']!.escena / 900;
  assert.ok(lampara.x - 40 > PUERTA.x + PUERTA.ancho + 12 && lampara.x + 40 < MESA.ventana.x0 * k - 30, 'la pantalla de la lámpara pisa la puerta o la cortina');
  assert.ok(lampara.y + lampara.caja[1] + lampara.caja[3] <= MESA.tablero.atras + 6, 'el cono baja de la línea de la mesa');
  const fuenteMesa = readFileSync('src/lib/bestiario/arte-sobremesa.ts', 'utf-8');
  for (const m of fuenteMesa.matchAll(/retrato\('ms-r\d', (\d+), \d+, (\d+),/g)) assert.ok(Number(m[1]) + Number(m[2]) < lampara.x - 60 || Number(m[1]) > lampara.x + 60, `un retrato en ${m[1]} queda detrás de la lámpara`);
  // Cuarta vuelta: los ojos de la ventana son una pieza aparte, a la vista, que se va si se saca la lupa.
  const ojos = HUIDIZOS['la-mesa']!;
  assert.ok(ojos.caja[0] > MESA.ventana.x0 * k && ojos.caja[0] + ojos.caja[2] < MESA.ventana.x1 * k && ojos.caja[1] + ojos.caja[3] < MESA.ventana.abajo);
  assert.ok(existsSync(`public${rutaDePieza(ojos.pieza)}`));
  assert.doesNotMatch(sumado, /Los ojos: alguien mira/);
  assert.match(readFileSync('src/scripts/camino.ts', 'utf-8'), /h\.alfa \+ dt \* \(conLupa\(lente\) \? -3 : 0\.25\)/);
  assert.match(readFileSync('src/pages/redondopedia/bestiario/[region].astro', 'utf-8'), /class="capa huye"[^>]*style=\{enSuLugar\(huidizo\.caja, 1\)\}/);
  // Quinta vuelta: con la lupa, lo de adelante de la mesa (los respaldos) y del galpón (la fila grande) se corre,
  // como ya hacía el aire pegado a la cámara. Solo en esas dos: las demás no cambian.
  // Las tres de la tanda 3 se sumaron en su segunda vuelta.
  assert.deepEqual([...FRENTE_QUE_SE_CORRE].sort(), ['cybersiberia', 'el-arbol', 'el-galpon', 'la-mesa', 'los-astilleros']);
  assert.match(readFileSync('src/scripts/camino.ts', 'utf-8'), /if \(frenteQueSeCorre\.el\) \{\s*const alfa = despejeDeLupa\('cerca', false, z\);/);
  assert.equal(despejeDeLupa('cerca', false, 1), 1);
  // Tercera vuelta: el seguidor nace de la foto (antes salía de la pared pelada), y en el paño de su derecha hay un reloj de pie.
  assert.match(fuenteMesa, /mesaLejos\(ancho, alto, \[586 \* k \+ 280 \* 0\.97, 32 \+ 168 \* 0\.05\]\)/);
  assert.match(fuenteMesa, /relojDePie\(2112, piso\)/);
  // El vapor de la olla respira (la isla lo estira desde la boca), y en la puerta del fondo se para alguien si te quedás quieto.
  const pisoDeLaMesa = pisoDelCamino(CAMINOS['la-mesa']!, new Map());
  assert.match(pisoDeLaMesa, /<g class="respira" data-base="290" data-fase="1\.3" pointer-events="none"><image href="\/bestiario\/camino-mesa-vapor\.webp"/);
  const visita = VISITAS['la-mesa']!;
  assert.ok(visita.f === lampara.f && visita.caja[0] >= PUERTA.x && visita.caja[0] + visita.caja[2] <= PUERTA.x + PUERTA.ancho && visita.caja[1] + visita.caja[3] <= MESA.tablero.atras && visita.espera >= 5);
  const pagina = readFileSync('src/pages/redondopedia/bestiario/[region].astro', 'utf-8');
  assert.ok(pagina.indexOf('class="capa asoma"') > 0 && pagina.indexOf('class="capa asoma"') < pagina.indexOf('class="capa capa--piso bestiario-svg"'));
  assert.match(pagina, /transform-origin: calc\(var\(--px\) \* \$\{-caja\[0\]!\}\)/);
  for (const n of ['camino-mesa-vapor', 'camino-mesa-visita']) assert.ok(existsSync(`public${rutaDePieza(n)}`), `falta imprimir ${n}`);
  // Y la primera pantalla tiene peso: el candelabro, en la punta de la mesa.
  assert.match(readFileSync('src/lib/bestiario/arte-camino.ts', 'utf-8'), /\$\{candelabro\(204, /);
  const papel = PIEZAS_DE_LUZ.find((q) => q.nombre === 'luz-mesa-lampara')!.dibujo;
  assert.match(papel, /<mask id="lz-mesa">/);
  assert.doesNotMatch(papel, /soplo-|Gradient/i);
  // Las moscas en capa se fueron en la tercera vuelta, por la cuenta (la mesa pasaba del +15 % contra main): queda el moscardón que cruza.
  assert.equal(AIRE['la-mesa']!.length, 1);
  assert.ok(!existsSync('public/bestiario/aire-mesa-moscas.webp'), 'quedó impresa la capa que se fue');
  assert.equal(VIDAS['la-mesa']!.pieza, 'vida-moscardon');
  // Debajo del mantel: va en el piso impreso, y la cueva del ratón además fina, para la lupa.
  const piso = PIEZAS_CAMINO.find((q) => q.nombre === 'camino-mesa-piso')!.dibujo;
  assert.match(piso, /<clipPath id="ms-cueva">/);
  assert.ok(FINAS_DE['la-mesa']!.includes('fino-mesa-cueva') && CUEVA.y > MESA.tablero.cuelga);
  assert.match(readFileSync('src/lib/bestiario/arte-sobremesa.ts', 'utf-8'), /const de = \(id: string\): number => X\(OJOS_DE_LA_MESA\[id\]!\[0\], ancho\);/, 'los pies salen de los datos de la escena');
});

test('D-91/t2: el salón del infierno: arcada, lenguas que respiran, el que asoma y el damero que se va; el recinto, igual', () => {
  const nombres = new Map<string, string>();
  const recinto = escenaInfierno(nombres);
  const camino = pisoDelCamino(CAMINOS['el-infierno']!, nombres);
  assert.doesNotMatch(recinto, /camino-infierno-|class="respira"|class="asoma"/, 'el recinto del plano no lleva lo del camino');
  assert.match(recinto, /infierno-cerca\.webp/);
  // En el camino: el que asoma (apagado), la fila alta, la arcada, la fila baja y el piso nuevo, en ese orden, y todo antes de los bichos.
  const orden = ['class="asoma" data-espera="4.5" opacity="0"', 'camino-infierno-lenguas-a.webp', 'camino-infierno-salon.webp', 'camino-infierno-lenguas-b.webp', 'camino-infierno-piso.webp', 'class="luz-de-vela"'].map((m) => camino.indexOf(m));
  assert.ok(orden.every((i) => i > 0) && orden.every((i, n) => n === 0 || i > orden[n - 1]!), `el orden del salón: ${orden}`);
  assert.doesNotMatch(camino, /infierno-cerca\.webp/);
  assert.equal((camino.match(/class="respira" data-base="/g) ?? []).length, 2);
  for (const p of PIEZAS_DEL_SALON) {
    assert.ok(existsSync(`public${rutaDePieza(p.nombre)}`), `falta imprimir ${p.nombre}`);
    assert.doesNotMatch(p.dibujo, /Gradient/i);
    assert.match(p.dibujo, /filter="url\(#rociado\)"/);
  }
  // Las columnas no caen detrás de la puerta ni de la piedra de Luzbelito, y las lenguas se estiran desde el zócalo.
  const fuenteDelSalon = readFileSync('src/lib/bestiario/arte-salon.ts', 'utf-8');
  for (const x of SALON.columnas) assert.ok((x < 120 || x > 240) && (x < 350 || x > 560), `una columna en ${x}`);
  // Segunda vuelta: columnas finas (una gruesa partía la pantalla de un teléfono en dos) y ninguna pegada al cruce.
  assert.match(fuenteDelSalon, /const g = 7\.5;/);
  assert.ok(Math.max(...SALON.columnas) < 700);
  // El que asoma: quinta vuelta, en el vano de la izquierda (el de la primera pantalla), arriba de la puerta. En el
  // del medio quedaba detrás del busto de Luzbelito y a 430 px no se lo encontraba.
  const medio = GIGANTE.caja[0] + GIGANTE.caja[2] / 2;
  assert.ok(medio > SALON.columnas[0]! + 60 && medio < SALON.columnas[1]! - 60);
  assert.ok(medio < 320, 'el que asoma no entra en la primera pantalla de un teléfono');
  // El calor que tiembla se probó y se sacó (tercera vuelta): en la tira de seis cuadros no se leía. La brasa le sube a Luzbelito.
  assert.equal(AIRE['el-infierno']!.length, 2);
  assert.ok(!existsSync('public/bestiario/aire-infierno-calor.webp'), 'quedó impresa la capa que se fue');
  // El que asoma es fuego más oscuro, no un objeto: la silueta en brasa a media tinta, comida por una máscara, y solo los ojos prenden.
  const asoma = PIEZAS_DEL_SALON.find((q) => q.nombre === 'camino-infierno-gigante')!.dibujo;
  assert.match(asoma, /<mask id="sl-asoma">/);
  assert.match(asoma, /opacity="0\.9"><path d="[^"]+" fill="var\(--entorno-infierno-brasa\)"/);
  // Cuarta vuelta: el contorno quemado, y por fuera la raya de fuego claro que lo recorta.
  assert.match(asoma, /stroke="var\(--acento-2\)" stroke-width="7" stroke-dasharray/);
  assert.ok(LUCES['el-infierno']![0]!.caja[1] <= -200, 'la brasa no llega a los flancos del busto');
  assert.ok(LENGUAS.base >= SALON.zocalo && LENGUAS.caja[1] + LENGUAS.caja[3] >= LENGUAS.base && GIGANTE.caja[1] + GIGANTE.caja[3] <= SALON.zocalo + 10);
  // El damero: más filas que el del recinto y la alfombra hasta el punto de fuga.
  const piso = PIEZAS_DEL_SALON.find((q) => q.nombre === 'camino-infierno-piso')!.dibujo;
  assert.match(piso, /<clipPath id="sl-alfombra">/);
  // Quinta vuelta: la alfombra con peso (los flecos del cabo y la copa caída, con su mancha).
  assert.match(readFileSync('src/lib/bestiario/arte-salon.ts', 'utf-8'), /alhajas\(y0, a0, a1\) \+/);
  const fuente = readFileSync('src/lib/bestiario/arte-salon.ts', 'utf-8');
  assert.match(fuente, /const N = 15;/);
  // La isla: las lenguas, con `transform`; el que asoma, con `opacity`, después de la quietud. Nada más.
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  const salon = isla.slice(isla.indexOf('function moverElSalon('), isla.indexOf('/** Si te fijás en ellos'));
  assert.match(salon, /r\.el\.setAttribute\('transform'/);
  assert.match(salon, /a\.el\.style\.opacity = /);
  assert.deepEqual([...new Set([...salon.matchAll(/\.style\.(\w+)/g)].map((m) => m[1]))], ['opacity']);
  assert.match(salon, /a\.quietud = seMueve \|\| !hoja\.hidden \|\| agarre !== null \? 0 : a\.quietud \+ dt;/);
  assert.match(isla, /if \(!quieto\(\)\) \{[\s\S]*?moverElSalon\(dt, /, 'con movimiento reducido el salón queda quieto y nadie asoma');
});

test('D-91/t2: por dónde se sale es de cada lugar: el portón, el arco y la puerta del pasillo', () => {
  // La tanda 3 sumó tres: la barrera del puerto, la compuerta de la chapa y la última rama del árbol.
  assert.deepEqual(Object.keys(ADORNOS_DEL_CRUCE).sort(), ['cybersiberia', 'el-arbol', 'el-galpon', 'el-infierno', 'la-mesa', 'los-astilleros']);
  for (const [region, pinta] of Object.entries(ADORNOS_DEL_CRUCE)) {
    const t = CAMINOS[region]!;
    const con = piezaDelCruce(t, ['var(--papel)', 'var(--papel)', 'var(--papel)', 'var(--papel)']).dibujo;
    assert.ok(con.includes(pinta(t.escena)), `${region}: el adorno no está en su cruce`);
    assert.doesNotMatch(pinta(t.escena), /Gradient/i);
    // Nada abajo de los carteles: el adorno termina antes del primer poste, con los cruces de hasta cinco vecinas.
    for (const n of [3, 4, 5]) assert.ok(t.escena + ANCHO_DEL_ADORNO <= destinosDelCruce(t, n)[0]! + 16, `${region}: el adorno llega a los carteles`);
    assert.ok(existsSync(`public${rutaDePieza(t.piezas.cruce!)}`));
  }
  // Las otras diez quedan como estaban.
  assert.equal(ADORNOS_DEL_CRUCE['el-monte'], undefined);
});

/* ------------------------------------------------------------------
   `D-91`, tanda 3: los astilleros, Cybersiberia y el árbol
   ------------------------------------------------------------------ */

const TANDA_3 = [['los-astilleros', 'astillero'], ['cybersiberia', 'cyber'], ['el-arbol', 'arbol']] as const;
const dibujoDe = (nombre: string): string => PIEZAS_CAMINO.find((q) => q.nombre === nombre)!.dibujo;

test('D-91/t3: el camino le suma al piso del recinto sin editarlo, y lo lejano es suyo', () => {
  for (const [region, pieza] of TANDA_3) {
    // El piso del recinto va entero y tal cual adentro del piso largo: lo del camino va antes o después, nunca en el medio.
    const delRecinto = ENTORNOS[region].piso(CAMINOS[region]!.escena, ALTO);
    const largo = dibujoDe(`camino-${pieza}-piso`);
    assert.ok(largo.includes(delRecinto), `${region}: el piso del recinto no está entero en el camino`);
    assert.ok(largo.length > delRecinto.length + 2000, `${region}: el camino no le suma nada al piso`);
    // Lo lejano largo ya no es el del recinto estirado; el recinto de 900 queda como estaba.
    assert.notEqual(dibujoDe(`camino-${pieza}-lejos`), ENTORNOS[region].lejos(CAMINOS[region]!.escena, ALTO));
    assert.equal(PIEZAS_ENTORNOS.find((q) => q.nombre === `${pieza}-lejos`)!.dibujo, ENTORNOS[region].lejos());
    for (const n of [`camino-${pieza}-lejos`, `camino-${pieza}-piso`]) assert.ok(existsSync(`public${rutaDePieza(n)}`), `falta imprimir ${n}`);
  }
  // Ninguno de los tres archivos nuevos toca los que está editando la otra sesión (`T-529`).
  for (const archivo of ['arte-puerto.ts', 'arte-tundra.ts', 'arte-bonete.ts']) {
    const fuente = readFileSync(`src/lib/bestiario/${archivo}`, 'utf-8');
    assert.doesNotMatch(fuente, /from '\.\/(arte-entornos|elenco|escenas|recintos)\.ts'/, `${archivo} importa lo que no debe`);
    assert.match(fuente, /from '\.\/escorzo\.ts'/, `${archivo}: sin punto de fuga`);
  }
});

test('D-91/t3: un punto de fuga por región, y nada donde van a pararse los tres títeres que vienen', () => {
  const fuente = (a: string): string => readFileSync(`src/lib/bestiario/${a}`, 'utf-8');
  // El espigón sale del canto del muelle y se pierde contra la otra orilla; las vías llegan hasta él.
  const puerto = fuente('arte-puerto.ts');
  const espigon = /ESPIGON = \{ desde: \[(\d+), (\d+)\], hasta: \[(\d+), (\d+)\]/.exec(puerto)!.slice(1).map(Number);
  assert.ok(Math.abs(espigon[1]! - ASTILLERO.muelle) < 8 && Math.abs(espigon[3]! - ASTILLERO.orilla) < 10, 'el espigón no va del muelle a la otra orilla');
  // El as del Club París espera entre 600 y 760, sobre los tablones: el espigón y las vías pasan lejos, y la tiza queda antes.
  assert.ok(espigon[0]! > 900);
  assert.match(puerto, /const \[cx, cy\] = \[196, 288\]/);
  assert.match(puerto, /RAYUELA = \{ x: 168, cerca: 608/);
  // La huella de la oruga y los postes se juntan en el horizonte de la nieve.
  const tundra = fuente('arte-tundra.ts');
  const huella = /HUELLA = \{ desde: \[(\d+), (\d+)\], hasta: \[(\d+), (\d+)\]/.exec(tundra)!.slice(1).map(Number);
  assert.ok(Math.abs(huella[3]! - CYBER.horizonte) < 8 && huella[1]! >= ALTO);
  // Los camellos esperan entre 190 y 340, de 350 a 470 de alto: a esa altura la huella ya pasó a su derecha.
  const xDeLaHuella = (y: number): number => huella[0]! + ((huella[2]! - huella[0]!) * (huella[1]! - y)) / (huella[1]! - huella[3]!);
  assert.ok(xDeLaHuella(470) > 340 + 40, `la huella pasa por ${Math.round(xDeLaHuella(470))} a la altura de los camellos`);
  // La huella de tierra del árbol cruza la llanura entre el angelito frito (469) y el jocker (848), lejos del ángel guardián (1483).
  const bonete = fuente('arte-bonete.ts');
  const tierra = /HUELLA = \{ desde: \[(\d+), (\d+)\], hasta: \[(\d+), ARBOL\.horizonte/.exec(bonete)!.slice(1).map(Number);
  assert.ok(tierra[0]! > 469 + 100 && tierra[2]! < 848 - 40);
  // Y los huevos de lo lejano no quedan a la altura de su cabeza.
  assert.match(bonete, /if \(y > 370 && x > 1040 && x < 1640\) x \+= 620/);
});

test('D-91/t3: lo que aparece si te quedás quieto está en la primera pantalla, en un teléfono y a 1280', () => {
  const cajas = { 'los-astilleros': GATO.caja, cybersiberia: COLOSO.caja, 'el-arbol': OJO.caja } as const;
  for (const [region] of TANDA_3) {
    const v = VISITAS[region]!;
    const t = CAMINOS[region]!;
    assert.deepEqual([...v.caja], [...cajas[region]], `${region}: la caja de la visita no es la de su pieza`);
    assert.ok(existsSync(`public${rutaDePieza(v.pieza)}`), `falta imprimir ${v.pieza}`);
    assert.ok(v.espera >= 5);
    // El gato va con el piso (asoma de atrás de la pila); los otros dos, clavados en lo lejano.
    assert.equal(v.f, region === 'los-astilleros' ? 1 : t.velocidad.lejos);
    // Un teléfono parado ve 320 unidades, y al llegar la cámara ya dio su primer paso (~96). A 1280 se ven 1024.
    for (const [vista, cam] of [[320, 96], [1024, 0], [1024, 96]] as const) {
      const x = v.caja[0] - corrimiento(v.f, cam, t.foco, vista);
      assert.ok(x >= 0 && x + v.caja[2] <= vista, `${region}: con ${vista} de vista, la visita cae en ${Math.round(x)}`);
    }
  }
  // El gato se sienta en el canto de arriba de la pila; el coloso pisa el horizonte y no baja hasta los camellos; el ojo, adentro de la luna, sobre el horizonte.
  assert.ok(GATO.caja[1] < ASTILLERO.pila.arriba && GATO.caja[1] + GATO.caja[3] > ASTILLERO.pila.arriba);
  assert.ok(Math.abs(COLOSO.caja[1] + COLOSO.caja[3] - CYBER.horizonte) < 8 && COLOSO.caja[1] + COLOSO.caja[3] < 350);
  assert.ok(OJO.caja[1] + OJO.caja[3] < ARBOL.horizonte);
});

test('D-91/t3: el río se mueve en una franja chica, la chata pasa por detrás, y el árbol tiene su farol', () => {
  // Los astilleros: la bruma de atrás se imprimió en lo lejano; la capa de atrás del piso es el río, angosta.
  const rio = AIRE['los-astilleros']!.find((c) => c.plano === 'fondo')!;
  assert.equal(rio.pieza, 'aire-astillero-rio');
  // Tercera vuelta: llega hasta la otra orilla (128 de alto); sigue siendo una franja, no una capa de pantalla.
  assert.ok(rio.alto <= 130 && rio.y >= ASTILLERO.orilla && rio.y + rio.alto <= ASTILLERO.muelle + 10 && rio.deriva !== 0 && rio.late > 0);
  assert.ok(!existsSync('public/bestiario/aire-astillero-bruma.webp'), 'la bruma vieja no queda impresa');
  // El carguero ya no está en lo lejano (segunda vuelta): va en su capa.
  assert.doesNotMatch(dibujoDe('camino-astillero-lejos'), /pt-casco/);
  assert.match(dibujoDe('camino-astillero-carguero'), /pt-casco/);
  const chata = VIDAS['los-astilleros']!;
  assert.ok(chata.atras && chata.dura[0] >= 20 && chata.espera[0] >= 30 && !chata.aletea);
  // Cybersiberia: la nevisca sigue siendo la única capa de pantalla entera, y ya no es una siembra pareja de rayas.
  assert.match(readFileSync('src/lib/bestiario/arte-aire.ts', 'utf-8'), /for \(let m = 0; m < 5; m\+\+\)/);
  assert.match(dibujoDe('camino-cyber-lejos'), /entorno-cyber-lente/);
  // El árbol: la luz es el farol que cuelga de la rama grande, en la primera pantalla, y su boca es la del farol pintado.
  const luz = LUCES['el-arbol']![0]!;
  assert.deepEqual([luz.x, luz.y, luz.f], [FAROL.x, FAROL.y, 1]);
  // La primera pantalla: al llegar, la cámara da su primer paso sola (`PRIMER_PASO`) y un teléfono queda mirando desde ~96 hasta ~416.
  assert.ok(luz.x > 96 + 40 && luz.x < VISTA_MIN + 96 - 40 && luz.vaiven > 0 && luz.vaiven <= 8);
  // El cono no llega a nadie: el primero que vive en esa llanura es el angelito frito, en 469.
  assert.ok(luz.x + luz.caja[0] + luz.caja[2] < 469 - 40);
  assert.ok(existsSync(`public${rutaDePieza(luz.pieza)}`));
});

test('D-91/t3v2: el carguero va en su capa, a otra velocidad, y deja ver las grúas', () => {
  const [barco] = PLANOS['los-astilleros']!;
  const t = CAMINOS['los-astilleros']!;
  assert.deepEqual([...barco!.caja], [...CARGUERO.caja]);
  // Más rápido que la otra orilla y más despacio que el muelle.
  assert.ok(barco!.f > t.velocidad.lejos + 0.1 && barco!.f < 0.9);
  assert.ok(existsSync(`public${rutaDePieza(barco!.pieza)}`));
  // En un teléfono (320 de vista) se lo ve en dos de las cinco posiciones de la recorrida, no en tres; y nunca al llegar.
  const visto = [0, 0.33, 0.5, 0.66, 1].filter((u) => {
    const x = barco!.caja[0] - corrimiento(barco!.f, u * (t.ancho - 320), t.foco, 320);
    return x < 320 && x + barco!.caja[2] > 0;
  });
  assert.deepEqual(visto, [0.33, 0.5]);
  // El casco tiene valor: la traca azul, el óxido y el sodio de los faroles en la panza, no solo negro.
  const casco = dibujoDe('camino-astillero-carguero');
  for (const tinta of ['--entorno-astillero-noche', '--entorno-pastura-honda', '--disco-cordero-atado-tinta', '--entorno-astillero-azul']) assert.ok(casco.includes(tinta), `al casco le falta ${tinta}`);
  // Es una capa como las demás: la isla la corre por `data-f`, entre lo lejano y el piso.
  const pagina = readFileSync('src/pages/redondopedia/bestiario/[region].astro', 'utf-8');
  assert.ok(pagina.indexOf('class="capa plano"') > pagina.indexOf('capa capa--lejos') && pagina.indexOf('class="capa plano"') < pagina.indexOf('class="capa capa--piso bestiario-svg"'));
});

test('D-91/t3v3: lo que cuelga del árbol es un péndulo que gira desde su nudo; la jaula y el farol cuelgan quietos', () => {
  // Ya no es una capa de aire: el árbol vuelve a tener dos, y la baldosa de la segunda vuelta no queda impresa.
  assert.equal(AIRE['el-arbol']!.length, 2);
  assert.ok(!existsSync('public/bestiario/aire-arbol-colgantes.webp'));
  const t = CAMINOS['el-arbol']!;
  const piso = pisoDelCamino(t, new Map());
  const impreso = dibujoDe('camino-arbol-piso');
  assert.equal(COLGANTES.length, 7);
  let memoria = 0;
  for (const c of COLGANTES) {
    const pieza = PIEZAS_CAMINO.find((q) => q.nombre === c.pieza)!;
    assert.ok(existsSync(`public${rutaDePieza(c.pieza)}`), `falta imprimir ${c.pieza}`);
    memoria += c.caja[2] * c.caja[3] * (pieza.densidad ?? 1) ** 2 * 4;
    // Va en el piso, detrás del piso impreso (la rama lo tapa), en un grupo que la isla gira desde el nudo.
    const grupo = piso.indexOf(`<g class="pendula" data-x="${c.x}" data-y="${c.y}" data-largo="${c.largo}"`);
    assert.ok(grupo >= 0 && grupo < piso.indexOf(rutaDePieza(t.piezas.piso!)), `${c.pieza}: no cuelga detrás del piso`);
    // El nudo es el borde de arriba de la pieza, al medio; y el péndulo entra entero aunque gire.
    assert.deepEqual([c.x, c.y], [c.caja[0] + c.caja[2] / 2, c.caja[1]]);
    assert.ok(c.caja[1] + c.caja[3] < 352, `${c.pieza}: llega al piso`);
  }
  // Las siete piezas juntas pesan menos de un tercio de lo que pesaba la baldosa (3360×476×4).
  assert.ok(memoria < (3360 * 476 * 4) / 3, `los colgantes ocupan ${(memoria / 1048576).toFixed(1)} MB`);
  // La jaula (la mira la lupa) y el farol (de él sale la luz) no se mueven: están en el piso impreso.
  for (const marca of ['M13 22 L22 19 L22 31 L13 34', 'M0 11 Q4 18 0 25 Q-4 18 0 11 Z']) {
    assert.ok(impreso.includes(marca) && COLGANTES.every((c) => !c.dibujo.includes(marca)));
  }
  // La isla: gira desde el nudo, solo lo que se ve, y con movimiento reducido no entra.
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  const suelto = isla.slice(isla.indexOf('function moverLoSuelto('), isla.indexOf('function moverElSalon('));
  assert.match(suelto, /p\.el\.setAttribute\('transform', `rotate\(\$\{a\.toFixed\(2\)\} \$\{p\.x\} \$\{p\.y\}\)`\)/);
  assert.match(suelto, /if \(p\.x < desde - 90 \|\| p\.x > hasta \+ 90\) continue;/);
  assert.doesNotMatch(suelto, /\.style\./);
  assert.match(isla, /if \(!quieto\(\)\) \{[\s\S]*?moverLoSuelto\(cam \/ escala, /);
  // El gran bonete, caído en la primera pantalla, abajo, donde cae la luz del farol. Tercera vuelta: se corrió a la
  // izquierda del angelito frito (469), que a 1280 le quedaba pegado a la boca.
  const fuente = readFileSync('src/lib/bestiario/arte-bonete.ts', 'utf-8');
  const [px, , ax, , bx, by] = /GRAN_BONETE = \{ punta: \[(\d+), (\d+)\], arriba: \[(\d+), (\d+)\], abajo: \[(\d+), (\d+)\]/.exec(fuente)!.slice(1).map(Number);
  const luz = LUCES['el-arbol']![0]!;
  assert.ok(px! > 96 && Math.max(ax!, bx!) < 416 && Math.max(ax!, bx!) + 24 < 469 - 110 && by! > 426);
  assert.ok(luz.x + luz.caja[0] < bx! && luz.x + luz.caja[0] + luz.caja[2] > bx!, 'el cono del farol no le pega al bonete');
});

test('D-91/t3v3: el río llega a la otra orilla, el carguero va pintado encima, y los reflejos que temblaban se sacaron', () => {
  // Se probaron reflejos sueltos que la isla ensanchaba desde su eje: en la tira de seis cuadros no se leían. No quedan.
  const isla = readFileSync('src/scripts/camino.ts', 'utf-8');
  assert.doesNotMatch(isla, /tiembla/);
  assert.doesNotMatch(pisoDelCamino(CAMINOS['los-astilleros']!, new Map()), /class="tiembla"/);
  assert.deepEqual(readdirSync('public/bestiario').filter((n) => n.startsWith('reflejo-astillero')), []);
  // El carguero va después del aire de atrás (el río) y antes del piso.
  const pagina = readFileSync('src/pages/redondopedia/bestiario/[region].astro', 'utf-8');
  assert.ok(pagina.indexOf('class="capa plano"') > pagina.indexOf("{aire('fondo').map(") && pagina.indexOf('class="capa plano"') < pagina.indexOf('class="capa capa--piso bestiario-svg"'));
  // Y ninguna torre de lo lejano de Cybersiberia cae debajo de Super Walter (entre 1290 y 1720).
  const torres = /const torres = (\[\[.*?\]\]) as const;/.exec(readFileSync('src/lib/bestiario/arte-tundra.ts', 'utf-8'))![1]!;
  for (const [x] of JSON.parse(torres) as [number, number][]) assert.ok(x < 1290 || x > 1720, `una torre en ${x}`);
});

test('D-91/t3v2: en Cybersiberia lo prendido tiñe la nieve, y el primer poste entra en la primera pantalla', () => {
  const fuente = readFileSync('src/lib/bestiario/arte-tundra.ts', 'utf-8');
  const x0 = Number(/POSTES = \{ desde: \[(\d+), /.exec(fuente)![1]);
  // Al llegar, un teléfono mira desde ~96: el poste y su caja prendida quedan adentro, y a la izquierda de los camellos (190).
  assert.ok(x0 > 96 + 10 && x0 + 36 < 190);
  assert.match(fuente, /tenidos\(rnd, p0\.x \+ 20/);
  const bajo = dibujoDe('camino-cyber-piso');
  assert.ok((bajo.match(/entorno-cyber-lente/g) ?? []).length > 60, 'la caja no tiñe');
  // El coloso camina lejos de la pared de teles (486 a 578) y sus pies siguen en el horizonte.
  assert.ok(COLOSO.caja[0] >= 578 + 40);
});
