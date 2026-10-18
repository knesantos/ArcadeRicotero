import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { ALTO, CAMINOS, CON_CAMINO, VELOCIDAD, VISTA_MAX, VISTA_MIN, anchoDeCapa, camara, hrefDeRegion, recintoDe } from './camino.ts';
import { PALO_EN_EL_CAMINO, PIEZAS_CAMINO } from './arte-camino.ts';
import { ACECHO, PALO, PASTURA } from './rig.ts';
import { rutaDePieza } from './aerografo.ts';
import type { Bestiario } from './mapa.ts';

/**
 * El camino con cruces (`D-73`, séptima vuelta): cada región que ya se camina es una página, y
 * al final hay un cruce con un cartel por región vecina. Lo que se mide acá es lo que, si se
 * rompe, se ve mal o deja a alguien afuera sin que ningún otro test lo note.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as Bestiario;
const regionDe = new Map(datos.regiones.map((r) => [r.id, r]));
const pieza = (nombre: string) => PIEZAS_CAMINO.find((p) => p.nombre === nombre);

test('cada tramo es de una región que existe, y el monte y la pastura ya se caminan', () => {
  assert.deepEqual([...CON_CAMINO].sort(), ['el-monte', 'la-pastura']);
  for (const [id, tramo] of Object.entries(CAMINOS)) {
    assert.equal(tramo.region, id);
    assert.ok(regionDe.has(id), `${id} no es una región de bestiario.json`);
  }
});

test('cada bicho de la región anda por su camino, una vez y adentro de la escena', () => {
  for (const [id, tramo] of Object.entries(CAMINOS)) {
    const enElCamino: string[] = [
      ...Object.keys(tramo.ojos),
      ...Object.keys(tramo.claro?.ojos ?? {}),
      // El lobo asoma en su monte, y en el claro acecha al cordero.
      ...(tramo.lobo || tramo.claro ? ['el-lobo-suelto'] : []),
      ...(tramo.claro ? ['el-cordero-atado'] : []),
    ];
    const deLaRegion = datos.bestias.filter((b) => b.region === id).map((b) => b.id);
    const deVisita = tramo.deVisita ?? [];
    assert.equal(new Set(enElCamino).size, enElCamino.length, `${id}: un bicho aparece dos veces`);
    assert.deepEqual(
      enElCamino.filter((b) => !deVisita.includes(b)).sort(),
      [...deLaRegion].sort(),
      `${id}: la escena y el JSON no tienen los mismos bichos`,
    );
    for (const v of deVisita) assert.ok(enElCamino.includes(v), `${id}: ${v} es de visita pero no está en la escena`);
    for (const [b, [x, y]] of Object.entries(tramo.ojos)) {
      assert.ok(x > 40 && x < tramo.ancho - 40 && y > 200 && y < ALTO - 40, `${id}: ${b} quedó afuera (${x}, ${y})`);
    }
  }
});

test('el lobo del monte asoma lejos de los bordes, así se llega a él caminando', () => {
  const { lobo, ancho } = CAMINOS['el-monte']!;
  assert.ok(lobo && lobo.x > VISTA_MAX / 2 && lobo.x < ancho - VISTA_MAX / 2);
});

test('el claro de la pastura cae entero adentro del piso, y el palo donde dice el arte', () => {
  const { claro, ancho } = CAMINOS['la-pastura']!;
  assert.ok(claro);
  // La pastura y el lobo acechando de los dos lados, con lugar para entrar y salir caminando.
  assert.ok(claro.dx + PALO.x - PASTURA.rx > VISTA_MIN, 'el claro arranca pegado a la entrada');
  assert.ok(claro.dx + PALO.x + PASTURA.rx < ancho - VISTA_MIN, 'el claro se come el cruce');
  assert.ok(claro.dx + ACECHO.desde > 0 && claro.dx + ACECHO.hasta < ancho);
  assert.deepEqual(PALO_EN_EL_CAMINO, { x: PALO.x + claro.dx, y: PALO.y });
});

test('las capas alcanzan en cualquier pantalla, también quietas', () => {
  for (const tramo of Object.values(CAMINOS)) {
    const lejos = pieza(tramo.piezas.lejos)!;
    const piso = pieza(tramo.piezas.piso)!;
    const frente = pieza(tramo.piezas.frente)!;
    assert.ok(lejos && piso && frente, `${tramo.region}: falta una pieza en PIEZAS_CAMINO`);
    // Quieto, las capas van juntas: ninguna puede terminar antes que el piso.
    assert.ok(lejos.caja[2] >= tramo.ancho, `${tramo.region}: lo lejano es más corto que el piso`);
    assert.ok(frente.caja[2] >= tramo.ancho, `${tramo.region}: lo de adelante es más corto que el piso`);
    assert.equal(piso.caja[2], tramo.ancho);
    // Andando, cada una cubre lo que su velocidad recorre con la vista más exigente.
    assert.ok(lejos.caja[2] >= anchoDeCapa(VELOCIDAD.lejos, tramo.ancho));
    assert.ok(frente.caja[2] >= anchoDeCapa(VELOCIDAD.frente, tramo.ancho));
    for (const p of [lejos, piso, frente]) assert.equal(p.caja[1] + p.caja[3], ALTO, `${p.nombre} no llega al piso de la escena`);
    for (const v of [VISTA_MIN, 375, 900, VISTA_MAX]) {
      const recorre = tramo.ancho - v;
      assert.ok(VELOCIDAD.lejos * recorre + v <= lejos.caja[2] + 0.5, `${tramo.region}: lo lejano se queda corto con una vista de ${v}`);
      assert.ok(VELOCIDAD.frente * recorre + v <= frente.caja[2] + 0.5, `${tramo.region}: lo de adelante se queda corto con una vista de ${v}`);
    }
  }
});

test('cada pieza del camino está impresa', () => {
  for (const p of PIEZAS_CAMINO) {
    assert.ok(existsSync(`public${rutaDePieza(p.nombre)}`), `falta imprimir ${p.nombre}: npm run imprimir-bestiario -- --solo camino-`);
  }
});

test('el cruce: un cartel por vecina, al camino si lo tiene y si no a su recinto', () => {
  for (const id of CON_CAMINO) {
    const region = regionDe.get(id)!;
    assert.ok(region.vecinas.length >= 2, `${id}: un cruce de una sola salida no es un cruce`);
    for (const v of region.vecinas) {
      assert.ok(regionDe.has(v), `${id}: la vecina ${v} no existe`);
      const href = hrefDeRegion(v);
      if (CON_CAMINO.includes(v)) assert.equal(href, `/redondopedia/bestiario/${v}/#camino`);
      else assert.equal(href, `/redondopedia/bestiario/#recinto-${recintoDe(v)}`);
    }
  }
  // El monte y la pastura se tienen la una a la otra: se va y se vuelve caminando.
  assert.ok(regionDe.get('el-monte')!.vecinas.includes('la-pastura'));
  assert.ok(regionDe.get('la-pastura')!.vecinas.includes('el-monte'));
});

test('la cámara: un píxel de bajar es un píxel de caminar, y no se pasa de los bordes', () => {
  assert.equal(camara(0, 3000, 375), 0);
  assert.equal(camara(1, 3000, 375), 2625);
  assert.equal(camara(0.5, 3000, 375), 1312.5);
  assert.equal(camara(1.4, 3000, 375), 2625);
  assert.equal(camara(-1, 3000, 375), 0);
  // Una vista más ancha que el piso no camina para atrás.
  assert.equal(camara(1, 1000, 1400), 0);
});

/** Todo lo que un archivo importa, de punta a punta, siguiendo los caminos relativos. */
function importados(desde: string): string[] {
  const vistos = new Set<string>();
  const pendientes = [desde];
  while (pendientes.length) {
    const archivo = pendientes.pop()!;
    if (vistos.has(archivo)) continue;
    vistos.add(archivo);
    const carpeta = archivo.slice(0, archivo.lastIndexOf('/'));
    for (const m of readFileSync(archivo, 'utf-8').matchAll(/(?:^|\n)\s*(?:import|export)[^'"]*?from\s+'(\.[^']+)'/g)) {
      const ruta: string[] = [];
      for (const p of `${carpeta}/${m[1]}`.split('/')) {
        if (p === '..') ruta.pop();
        else if (p !== '.') ruta.push(p);
      }
      pendientes.push(ruta.join('/'));
    }
  }
  return [...vistos].map((r) => r.slice(r.lastIndexOf('/') + 1));
}

test('las dos islas se llevan números: ni el camino ni el bestiario importan algo que dibuje', () => {
  const dibujan = [
    'arte.ts', 'arte-bajo.ts', 'arte-camino.ts', 'aerografo.ts', 'pincel.ts', 'escenas.ts', 'escena-monte.ts',
    'titeres.ts', 'figuras.ts', 'mapa.ts', 'fichas.ts',
  ];
  for (const isla of ['src/scripts/camino.ts', 'src/scripts/bestiario.ts']) {
    const llevados = importados(isla);
    assert.ok(llevados.includes('rig.ts') && llevados.includes('pastura.ts'), `${isla}: el censo no está mirando bien`);
    assert.deepEqual(llevados.filter((n) => dibujan.includes(n)), [], `${isla} se lleva al teléfono: ${llevados.join(', ')}`);
  }
  // Y el guardián sabe encontrar: la página sí dibuja.
  assert.ok(importados('src/lib/bestiario/arte-camino.ts').includes('aerografo.ts'));
});
