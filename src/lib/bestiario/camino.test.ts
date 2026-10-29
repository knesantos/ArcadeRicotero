import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import {
  ALTO, CAMINOS, CON_CAMINO, CRUCE, ENTRADA, RECINTO, VISTA_MAX, VISTA_MIN, anchoDeCapa, camara, conParalaje, corrimiento, hrefDeRegion,
} from './camino.ts';
import { PALO_EN_EL_CAMINO, PIEZAS_CAMINO, cajaDelCruce, piezasDeLosCruces } from './arte-camino.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { ACECHO, PALO, PASTURA, marcoDelRecinto } from './rig.ts';
import { rutaDePieza } from './aerografo.ts';
import type { Bestiario } from './mapa.ts';

/**
 * El camino con cruces (`D-73`, séptima vuelta; `D-77`): cada región es una página que se camina
 * de costado, y al final hay un cruce con un cartel por región vecina. Lo que se mide acá es lo que,
 * si se rompe, se ve mal o deja a alguien afuera sin que ningún otro test lo note.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as Bestiario;
const regionDe = new Map(datos.regiones.map((r) => [r.id, r]));
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const CRUCES = piezasDeLosCruces(datos.regiones);
const pieza = (nombre: string | null) => [...PIEZAS_CAMINO, ...CRUCES].find((p) => p.nombre === nombre);

test('las trece regiones se caminan, y se entra por el monte', () => {
  assert.deepEqual([...CON_CAMINO].sort(), datos.regiones.map((r) => r.id).sort());
  for (const [id, tramo] of Object.entries(CAMINOS)) {
    assert.equal(tramo.region, id);
    assert.ok(regionDe.has(id), `${id} no es una región de bestiario.json`);
  }
  assert.equal(ENTRADA, '/redondopedia/bestiario/el-monte/');
});

test('los entornos están conectados: desde la entrada se llega a todos, y de todos se vuelve', () => {
  const alcanza = (desde: string, vecinas: (id: string) => readonly string[]): Set<string> => {
    const vistas = new Set([desde]);
    const pendientes = [desde];
    while (pendientes.length) for (const v of vecinas(pendientes.pop()!)) if (!vistas.has(v)) vistas.add(v), pendientes.push(v);
    return vistas;
  };
  const ida = alcanza('el-monte', (id) => regionDe.get(id)!.vecinas);
  const vuelta = alcanza('el-monte', (id) => datos.regiones.filter((r) => r.vecinas.includes(id)).map((r) => r.id));
  for (const id of CON_CAMINO) {
    assert.ok(ida.has(id), `desde el monte no se llega caminando a ${id}`);
    assert.ok(vuelta.has(id), `desde ${id} no se vuelve caminando al monte`);
  }
});

test('cada bicho de la región anda por su camino, una vez, y ninguno queda en la noche del cruce', () => {
  for (const [id, tramo] of Object.entries(CAMINOS)) {
    const piso = pisoDelCamino(tramo, nombres);
    assert.ok(!/NaN|undefined|Infinity/.test(piso), `${id}: el piso tiene un número roto`);
    // Los que se tocan: los bichos y los títeres (y en la ruta, las piezas de los fierros adentro).
    const tocables = [...piso.matchAll(/class="(?:bestia|titere)\b[^"]*"[^>]*?\sdata-id="([^"]+)"/g)].map((m) => m[1]!);
    const deLaRegion = datos.bestias.filter((b) => b.region === id).map((b) => b.id);
    const esperados = [...deLaRegion, ...(tramo.deVisita ?? [])].sort();
    assert.deepEqual([...new Set(tocables)].sort(), esperados, `${id}: la escena y el JSON no tienen los mismos bichos`);
    assert.equal(new Set(tocables).size, tocables.length, `${id}: un bicho aparece dos veces`);
    // Nadie vive debajo de los carteles: los bichos están en la escena, antes del cruce. Adentro de un
    // recinto valen sus coordenadas, y el recinto agrandado para los dos lados va corrido.
    const dx = tramo.forma === 'recinto' ? -marcoDelRecinto(id).x : 0;
    for (const m of piso.matchAll(/data-id="([^"]+)" data-x="(-?[\d.]+)" data-y="(-?[\d.]+)"/g)) {
      const [x, y] = [Number(m[2]) + dx, Number(m[3])];
      assert.ok(x > 20 && x < tramo.escena - 20 && y > 0 && y < ALTO, `${id}: ${m[1]} quedó afuera de la escena (${x}, ${y})`);
    }
  }
});

test('los tramos largos: los ojos lejos de los bordes, el lobo y el claro donde se llega caminando', () => {
  for (const tramo of Object.values(CAMINOS).filter((t) => t.forma === 'largo')) {
    for (const [b, [x, y]] of Object.entries(tramo.ojos)) {
      assert.ok(x > 40 && x < tramo.ancho - 40 && y > 200 && y < ALTO - 40, `${tramo.region}: ${b} quedó afuera (${x}, ${y})`);
    }
  }
  const { lobo, ancho } = CAMINOS['el-monte']!;
  assert.ok(lobo && lobo.x > VISTA_MAX / 2 && lobo.x < ancho - VISTA_MAX / 2);
  const pastura = CAMINOS['la-pastura']!;
  const claro = pastura.claro!;
  // La pastura y el lobo acechando de los dos lados, con lugar para entrar y salir caminando.
  assert.ok(claro.dx + PALO.x - PASTURA.rx > VISTA_MIN, 'el claro arranca pegado a la entrada');
  assert.ok(claro.dx + PALO.x + PASTURA.rx < pastura.ancho - VISTA_MIN, 'el claro se come el cruce');
  assert.ok(claro.dx + ACECHO.desde > 0 && claro.dx + ACECHO.hasta < pastura.ancho);
  assert.deepEqual(PALO_EN_EL_CAMINO, { x: PALO.x + claro.dx, y: PALO.y });
});

test('las tres formas: largo, entorno a lo largo y recinto entero con su cruce', () => {
  for (const t of Object.values(CAMINOS)) {
    if (t.forma === 'largo') {
      assert.equal(t.escena, t.ancho, `${t.region}: un tramo largo lleva el cruce encima del final`);
      assert.equal(t.piezas.cruce, null);
    } else {
      assert.equal(t.ancho - t.escena, CRUCE, `${t.region}: el cruce mide lo que mide`);
      assert.ok(t.piezas.cruce, `${t.region}: le falta su cruce`);
      assert.deepEqual(cajaDelCruce(t).slice(2), [cajaDelCruce(t)[2], ALTO]);
      assert.equal(cajaDelCruce(t)[0] + cajaDelCruce(t)[2], t.ancho, `${t.region}: el cruce no llega al final`);
    }
    if (t.forma === 'recinto') {
      // Mide lo que mide su recinto: los 900 de siempre, o lo que se agrandó.
      assert.equal(t.escena, marcoDelRecinto(t.region).ancho);
      assert.ok(t.escena >= RECINTO, `${t.region}: un recinto no se achica`);
      assert.ok(!conParalaje(t), `${t.region}: un recinto es una sola capa`);
    }
    if (t.forma === 'entorno') assert.ok(t.foco > 0 && t.foco < t.escena, `${t.region}: el foco cae afuera de la escena`);
  }
});

test('las capas alcanzan en cualquier pantalla, caminando y quietas', () => {
  for (const tramo of Object.values(CAMINOS).filter(conParalaje)) {
    const lejos = pieza(tramo.piezas.lejos)!;
    const piso = pieza(tramo.piezas.piso)!;
    const frente = pieza(tramo.piezas.frente)!;
    assert.ok(lejos && piso && frente, `${tramo.region}: falta una pieza en PIEZAS_CAMINO`);
    // Quieto, las capas van juntas: lo lejano llega hasta el final de la escena (el cruce tapa lo
    // demás), y lo de adelante hasta el final de todo.
    assert.ok(lejos.caja[2] >= tramo.escena, `${tramo.region}: lo lejano es más corto que la escena`);
    assert.ok(frente.caja[2] >= tramo.ancho, `${tramo.region}: lo de adelante es más corto que el tramo`);
    assert.equal(piso.caja[2], tramo.escena);
    assert.ok(frente.caja[2] >= anchoDeCapa(tramo.velocidad.frente, tramo.ancho));
    for (const p of [lejos, piso, frente]) assert.equal(p.caja[1] + p.caja[3], ALTO, `${p.nombre} no llega al piso de la escena`);
    // Caminando, cada capa cubre lo que se ve, con la vista más angosta y la más ancha, de punta a
    // punta. Lo lejano solo tiene que cubrir lo que se ve de la escena: lo que sigue es el cruce.
    for (const v of [VISTA_MIN, 375, 900, VISTA_MAX]) {
      const recorre = Math.max(0, tramo.ancho - v);
      for (let cam = 0; cam <= recorre; cam += recorre / 40 || 1) {
        const l = corrimiento(tramo.velocidad.lejos, cam, tramo.foco, v);
        const deEscena = Math.min(v, tramo.escena - cam);
        assert.ok(l >= -0.5, `${tramo.region}: lo lejano asoma su borde de la izquierda (vista ${v})`);
        if (deEscena > 0) assert.ok(l + deEscena <= lejos.caja[2] + 0.5, `${tramo.region}: lo lejano se queda corto con una vista de ${v}`);
        const fr = corrimiento(tramo.velocidad.frente, cam, tramo.foco, v);
        assert.ok(fr >= 0 && fr + v <= frente.caja[2] + 0.5, `${tramo.region}: lo de adelante se queda corto con una vista de ${v}`);
      }
    }
  }
});

test('lo lejano cae detrás del piso cuando el foco pasa por el medio', () => {
  for (const t of Object.values(CAMINOS).filter((x) => x.forma === 'entorno')) {
    for (const v of [375, 900]) {
      const cam = t.foco - v / 2;
      if (cam < 0) continue;
      assert.ok(Math.abs(corrimiento(t.velocidad.lejos, cam, t.foco, v) - cam) < 0.01, `${t.region}: el fondo no coincide con el piso en el foco`);
    }
  }
  // Lo que va a la par del piso, o más rápido, no se acomoda.
  assert.equal(corrimiento(1, 300, 1200, 375), 300);
  assert.equal(corrimiento(1.3, 300, 1200, 375), 390);
});

test('cada pieza del camino está impresa', () => {
  for (const p of [...PIEZAS_CAMINO, ...CRUCES]) {
    assert.ok(existsSync(`public${rutaDePieza(p.nombre)}`), `falta imprimir ${p.nombre}: npm run imprimir-bestiario -- --solo camino-`);
  }
  // Un cruce por cada tramo que no es largo, y uno solo.
  assert.equal(CRUCES.length, Object.values(CAMINOS).filter((t) => t.forma !== 'largo').length);
});

test('el cruce: un cartel por vecina, y cada uno lleva a su camino', () => {
  for (const id of CON_CAMINO) {
    const region = regionDe.get(id)!;
    assert.ok(region.vecinas.length >= 2, `${id}: un cruce de una sola salida no es un cruce`);
    for (const v of region.vecinas) {
      assert.ok(regionDe.has(v), `${id}: la vecina ${v} no existe`);
      assert.equal(hrefDeRegion(v), `/redondopedia/bestiario/${v}/#camino`);
    }
  }
  // El monte y la pastura se tienen la una a la otra: se va y se vuelve caminando.
  assert.ok(regionDe.get('el-monte')!.vecinas.includes('la-pastura'));
  assert.ok(regionDe.get('la-pastura')!.vecinas.includes('el-monte'));
});

test('la cámara: un píxel de deslizar es un píxel de caminar, y no se pasa de los bordes', () => {
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
    'arte.ts', 'arte-bajo.ts', 'arte-camino.ts', 'arte-entornos.ts', 'aerografo.ts', 'pincel.ts', 'escenas.ts', 'escena-monte.ts',
    'escenas-entornos.ts', 'escenas-camino.ts', 'titeres.ts', 'figuras.ts', 'mapa.ts', 'fichas.ts',
  ];
  for (const isla of ['src/scripts/camino.ts', 'src/scripts/bestiario.ts']) {
    const llevados = importados(isla);
    assert.ok(llevados.includes('rig.ts') && llevados.includes('pastura.ts') && llevados.includes('recintos.ts'), `${isla}: el censo no está mirando bien`);
    // El elenco de la decimoquinta vuelta dibuja en `arte-<slug>.ts` y se junta en `elenco.ts`.
    const dibuja = (n: string): boolean => dibujan.includes(n) || n === 'elenco.ts' || n.startsWith('arte-');
    assert.deepEqual(llevados.filter(dibuja), [], `${isla} se lleva al teléfono: ${llevados.join(', ')}`);
  }
  // Y el guardián sabe encontrar: la página sí dibuja.
  assert.ok(importados('src/lib/bestiario/arte-camino.ts').includes('aerografo.ts'));
});
