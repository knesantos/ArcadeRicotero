import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { CON_TITERE, ELENCO, LUGAR_EN_EL_ELENCO, capasDe, retratoDe, type Capa } from './elenco.ts';
import { PIEZAS } from './arte.ts';
import { RECORTES } from './recortes.ts';
import { escenaBajo, escenaBaldio, escenaInfierno, escenaPrision, escenaTemplo } from './escenas.ts';
import { escenaMonte } from './escena-monte.ts';
import { ENTORNOS_DE_NOCHE } from './escenas-entornos.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS, K_ENTORNO } from './camino.ts';
import { retrato } from './titeres.ts';
import { marcoDelRecinto } from './rig.ts';
import { CON_CONDUCTA } from '../../scripts/bestiario/vivos.ts';

/**
 * El elenco de la decimoquinta vuelta (`D-73`): lo que vale para cada uno de los diez, se haya hecho
 * ya o no. Lo de cada personaje (que la mano alcance la boca, que pise el piso) va en su propio test,
 * `<slug>.test.ts`; acá va lo que los junta con el resto del bestiario.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; region: string }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const roto = /NaN|undefined|Infinity/;

/** La escena del recinto de cada región, como la dibuja la página del bestiario. */
const ESCENA: Readonly<Record<string, (n: ReadonlyMap<string, string>) => string>> = {
  ...Object.fromEntries(Object.entries(ENTORNOS_DE_NOCHE).map(([r, { escena }]) => [r, escena])),
  'el-infierno': escenaInfierno,
  'el-bajo': escenaBajo,
  'el-templo': escenaTemplo,
  'la-prision': escenaPrision,
  'los-techos': escenaBaldio,
  'el-monte': escenaMonte,
};

/** Los diez de la decimoquinta vuelta, uno por entorno; después vienen los de la decimosexta, la decimoséptima y la decimoctava. */
const DIEZ = Object.keys(LUGAR_EN_EL_ELENCO).slice(0, 10);

test('el elenco son los diez, uno por entorno, los tres de la decimosexta, la decimoséptima y la decimoctava, el de la decimonovena, los cinco de la vigésima, el de la vigesimoprimera y los cinco de la vigesimosegunda; cada uno es una bestia de esa región', () => {
  const lugares = Object.entries(LUGAR_EN_EL_ELENCO);
  assert.equal(lugares.length, 31);
  assert.equal(new Set(DIEZ.map((id) => LUGAR_EN_EL_ELENCO[id])).size, 10, 'dos de los diez en el mismo entorno');
  assert.deepEqual(lugares.slice(10, 13).map(([id]) => id), ['la-hija-del-fletero', 'el-buen-psicopata', 'porco-rex']);
  assert.deepEqual(lugares.slice(13, 16).map(([id]) => id), ['el-angel-de-la-soledad', 'el-pac-man', 'la-mosca']);
  // La decimoctava: uno en cada uno de los tres entornos con menos títeres para los bichos que tienen.
  assert.deepEqual(lugares.slice(16, 19).map(([id]) => id), ['el-verdugo-que-cena', 'el-doctor-saturno', 'tu-animal']);
  // La decimonovena: el perro dinamita, en el baldío.
  assert.deepEqual(lugares.slice(19, 20).map(([id]) => id), ['mi-perro-dinamita']);
  // La vigésima: cinco en los entornos más flacos de títeres, dos de ellos en el infierno, que tenía uno solo.
  assert.deepEqual(lugares.slice(20, 25).map(([id]) => id), ['zippo', 'el-diablo-mas-veloz', 'el-santo-fumador', 'el-que-duerme-colgado', 'la-bella-senora-desencarnada']);
  // La vigesimoprimera: el esclavo encadenado, el dibujo que trajo el usuario, en la prisión.
  assert.deepEqual(lugares.slice(25, 26).map(([id]) => id), ['el-esclavo-encadenado']);
  // La vigesimosegunda: cinco que seguían siendo ojos, el Alien Duce pedido por el usuario y dos en el bajo.
  assert.deepEqual(lugares.slice(26).map(([id]) => id), ['el-gato-maton', 'el-amorcito-que-mordio-el-vidrio', 'las-sirenas', 'mandinga', 'el-alien-duce']);
  for (const [id, region] of lugares) {
    const b = datos.bestias.find((x) => x.id === id);
    assert.ok(b, `${id} no está en el bestiario`);
    assert.equal(b.region, region, `${id} no vive en ${region}`);
    assert.ok(ESCENA[region], `${region} no tiene escena de noche`);
  }
  for (const p of ELENCO) assert.equal(LUGAR_EN_EL_ELENCO[p.id], p.region, `${p.id} está anotado en otra región`);
});

test('el que tiene dibujo tiene conducta, y al revés', () => {
  assert.deepEqual([...CON_CONDUCTA].sort(), ELENCO.map((p) => p.id).sort());
});

test('las piezas del elenco tienen nombre propio y están impresas', () => {
  const todas = [...PIEZAS.map((p) => p.nombre), ...RECORTES.map((r) => r.nombre)];
  assert.equal(new Set(todas).size, todas.length, 'hay dos piezas con el mismo nombre');
  for (const p of ELENCO) {
    assert.ok(p.piezas.length > 0, `${p.id} no tiene piezas`);
    for (const q of p.piezas) {
      assert.ok(existsSync(`public/bestiario/${q.nombre}.webp`), `${q.nombre} no está impresa`);
      assert.ok(!roto.test(q.dibujo) && !q.caja.some((v) => !Number.isFinite(v)), `${q.nombre} tiene un número roto`);
    }
  }
});

test('ni un hex en el elenco: las tintas son tokens', () => {
  const malos: string[] = [];
  for (const archivo of ['src/lib/bestiario/elenco.ts', 'src/scripts/bestiario/vivos.ts']) {
    if (/#[0-9a-fA-F]{3,8}\b(?![-\w])/.test(readFileSync(archivo, 'utf-8'))) malos.push(archivo);
  }
  for (const p of ELENCO) {
    // Lo que se imprime se resuelve contra `tokens.css`: acá solo puede haber `var(--...)`.
    for (const q of p.piezas) if (/(fill|stroke|stop-color|flood-color|color)="#[0-9a-fA-F]{3,8}"/.test(q.dibujo)) malos.push(q.nombre);
  }
  assert.deepEqual(malos, []);
});

test('el que tiene títere se toca como títere, y ya no está como ojos ni como cosa', () => {
  for (const p of ELENCO) {
    const escena = ESCENA[p.region]!(nombres);
    assert.ok(!roto.test(escena), `${p.region} tiene un número roto`);
    assert.ok(escena.includes(`data-marco="${p.id}"`), `${p.id} no está en la escena de ${p.region}`);
    assert.ok(!escena.includes(`bestia--ojos" data-id="${p.id}"`), `${p.id} sigue siendo ojos en lo oscuro`);
    assert.ok(!escena.includes(`bestia--cosa" data-id="${p.id}"`), `${p.id} sigue siendo una cosa pintada`);
    // Se toca una sola vez: el títere (o, en la ruta, el fierro que lo lleva).
    const toques = [...escena.matchAll(new RegExp(`data-id="${p.id}"`, 'g'))].length;
    assert.equal(toques, 1, `${p.id} se puede tocar en ${toques} lugares`);
    if (!p.fierro) {
      assert.match(escena, new RegExp(`<g class="titere titere--[a-z-]+" data-id="${p.id}" role="button" tabindex="0" aria-label="[^"]+"`), `${p.id} no es un títere que se toca`);
    }
  }
});

test('lo que pide el elenco está impreso, y cada capa sale sin un número roto', () => {
  const impresas = new Set([...PIEZAS.map((p) => p.nombre), ...RECORTES.map((r) => r.nombre)]);
  for (const p of ELENCO) {
    const marcado = (['atras', 'figura', 'delante'] as Capa[]).map((c) => capasDe(p.region, c, nombres)).join('') + (p.fierro?.() ?? '');
    assert.ok(!roto.test(marcado), `${p.id}: número roto`);
    const piden = [...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!);
    assert.deepEqual(piden.filter((n) => !impresas.has(n)), [], `${p.id} pide piezas que no están`);
    // El recinto es el de siempre (900) o el agrandado para los dos lados (`MARCO_DEL_RECINTO`), como el templo.
    const marco = marcoDelRecinto(p.region);
    assert.ok(p.ancla >= marco.x && p.ancla <= marco.x + marco.ancho, `${p.id}: el ancla se sale del recinto`);
  }
});

test('en el camino, el elenco va en su entorno corrido con k, y en los recintos va entero', () => {
  for (const p of ELENCO) {
    const tramo = CAMINOS[p.region];
    assert.ok(tramo, `${p.region} no tiene camino`);
    const piso = pisoDelCamino(tramo, nombres);
    assert.ok(piso.includes(`data-marco="${p.id}"`), `${p.id} no camina en ${p.region}`);
    assert.ok(!piso.includes(`bestia--ojos" data-id="${p.id}"`), `${p.id} sigue siendo ojos en el camino`);
    if (tramo.forma === 'entorno' && !p.fierro) {
      const dx = Math.round(p.ancla * (K_ENTORNO - 1));
      assert.ok(piso.includes(`data-marco="${p.id}" data-capa="figura" data-dx="${dx}"`) || piso.includes(`data-marco="${p.id}" data-capa="atras" data-dx="${dx}"`), `${p.id} no se corrió con k en el camino`);
    }
  }
});

test('cada uno del elenco tiene su retrato de ficha, encuadrado', () => {
  for (const p of ELENCO) {
    assert.ok(retratoDe(p.id), `${p.id} no tiene retrato`);
    const r = retrato(p.id);
    assert.ok(r && !roto.test(r.svg) && !roto.test(r.caja), `${p.id}: retrato roto`);
    const [, , ancho, alto] = r.caja.split(' ').map(Number);
    assert.ok(ancho! > 20 && alto! > 20, `${p.id}: el retrato no tiene caja`);
  }
  // Los que todavía no tienen títere siguen con su figura.
  for (const id of Object.keys(LUGAR_EN_EL_ELENCO)) if (!CON_TITERE.has(id)) assert.equal(retratoDe(id), null);
});
