import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  armarLinkRecital,
  leerRecital,
  limpiarLugar,
  MAX_TEMAS_RECITAL,
  MAX_BISES_RECITAL,
  HUELLA_RECITAL,
  VERSION_RECITAL,
  LARGO_MAX_LUGAR,
} from '../desafio.ts';
import { leerTemas, slugDeTitulo } from '../letra/temas.ts';

/**
 * La quinta forma del link (`D-72`): la lista de "Armá tu recital". Vive en `desafio.ts`,
 * que es la única puerta de dato de afuera del sitio, y se prueba acá, al lado del juego.
 */

const LUGARES = new Set(['estadio-huracan', 'go-disco']);
const existe = (s: string): boolean => LUGARES.has(s);
const BASE = 'https://ricotaarcade.example/juegos/arma-tu-recital/';

test('lo que se arma se lee igual, con bises y sin bises', () => {
  const ida = { lugar: 'estadio-huracan', lista: [0, 35, 36, 104], bises: [7] };
  const link = armarLinkRecital(BASE, 'recital', ida);
  // Dos caracteres por tema, en base 36: 0 → 00, 35 → 0z, 36 → 10, 104 → 2w.
  assert.match(link, /\?g=recital#r=1\.estadio-huracan\.000z102w\.07$/);
  assert.deepEqual(leerRecital(link, 'recital', 105, existe), ida);
  const sinBises = { lugar: 'go-disco', lista: [3], bises: [] };
  assert.deepEqual(leerRecital(armarLinkRecital(BASE, 'recital', sinBises), 'recital', 105, existe), sinBises);
});

test('lo imposible no se arma', () => {
  const armar = (r: { lugar: string; lista: number[]; bises: number[] }) => () => armarLinkRecital(BASE, 'recital', r);
  assert.throws(armar({ lugar: 'go-disco', lista: [], bises: [] }), RangeError, 'lista vacía');
  assert.throws(armar({ lugar: 'go-disco', lista: [1], bises: [1] }), RangeError, 'tema repetido');
  assert.throws(armar({ lugar: 'Huracán', lista: [1], bises: [] }), RangeError, 'lugar fuera del alfabeto');
  const muchos = Array.from({ length: MAX_TEMAS_RECITAL + 1 }, (_, i) => i);
  assert.throws(armar({ lugar: 'go-disco', lista: muchos, bises: [] }), RangeError, 'lista larga');
  const bises = Array.from({ length: MAX_BISES_RECITAL + 1 }, (_, i) => i + 50);
  assert.throws(armar({ lugar: 'go-disco', lista: [1], bises }), RangeError, 'muchos bises');
});

test('un link raro abre de cero, nunca a medias', () => {
  const leer = (h: string, q = '?g=recital') => leerRecital(`${BASE}${q}#${h}`, 'recital', 105, existe);
  assert.deepEqual(leer('r=1.estadio-huracan.0001.'), { lugar: 'estadio-huracan', lista: [0, 1], bises: [] });
  assert.equal(leer('r=1.estadio-huracan.0001.', '?g=ponelos'), null, 'otro juego');
  assert.equal(leer('r=1.estadio-huracan.0001.', ''), null, 'sin juego');
  assert.equal(leer('r=2.estadio-huracan.0001.'), null, 'otra versión');
  assert.equal(leer('r=1.river.0001.'), null, 'un lugar que el juego no ofrece');
  assert.equal(leer('r=1.estadio-huracan.000.'), null, 'carga impar');
  assert.equal(leer('r=1.estadio-huracan.002x.'), null, 'índice 105 o más: fuera del catálogo');
  assert.equal(leer('r=1.estadio-huracan.0000.'), null, 'un tema repetido');
  assert.equal(leer('r=1.estadio-huracan.01.01'), null, 'el mismo tema en la lista y en los bises');
  assert.equal(leer('r=1.estadio-huracan..01'), null, 'bises sin lista');
  assert.equal(leer('r=1.estadio-huracan.0001'), null, 'faltan partes');
  assert.equal(leer('r=1.estadio-huracan.00%3C1.'), null, 'caracteres fuera de la lista blanca');
  assert.equal(leer(''), null);
  assert.equal(leerRecital('no es una dirección', 'recital', 105, existe), null);
});

test('el orden de los 105 es el mismo con el que se escribió la versión del link (FIND-168)', () => {
  const huella = createHash('sha256')
    .update(leerTemas().map((t) => slugDeTitulo(t.titulo)).join('\n'))
    .digest('hex')
    .slice(0, 16);
  assert.equal(
    huella,
    HUELLA_RECITAL,
    `cambió el orden del catálogo: subí VERSION_RECITAL (hoy ${VERSION_RECITAL}) y poné HUELLA_RECITAL = '${huella}'`,
  );
});

test('un descampado viaja con su localidad, y otro lugar con su nombre escrito a mano', () => {
  const descampado = { lugar: 'descampado', ciudad: 'Tandil', lista: [1, 2], bises: [] };
  const l1 = armarLinkRecital(BASE, 'recital', descampado);
  assert.match(l1, /#r=1\.descampado\.0102\.&c=Tandil$/);
  assert.deepEqual(leerRecital(l1, 'recital', 105, existe), descampado);
  const otro = { lugar: 'otro', nombre: "Club Social y Deportivo L'Amistad", ciudad: 'Villa María', lista: [3], bises: [4] };
  assert.deepEqual(leerRecital(armarLinkRecital(BASE, 'recital', otro), 'recital', 105, existe), otro);
  const sinCiudad = { lugar: 'otro', nombre: 'La terraza de mi casa', lista: [3], bises: [] };
  assert.deepEqual(leerRecital(armarLinkRecital(BASE, 'recital', sinCiudad), 'recital', 105, existe), sinCiudad);
});

test('el texto escrito a mano entra limpio, y sin lo obligatorio no hay link', () => {
  assert.equal(limpiarLugar('  <script>Obras</script>  '), 'scriptObrasscript');
  assert.equal(limpiarLugar('La "Cancha"   de   Tandil'), 'La Cancha de Tandil');
  assert.equal(limpiarLugar('x'.repeat(80)).length, LARGO_MAX_LUGAR);
  assert.throws(() => armarLinkRecital(BASE, 'recital', { lugar: 'descampado', lista: [1], bises: [] }), RangeError);
  assert.throws(() => armarLinkRecital(BASE, 'recital', { lugar: 'otro', nombre: '<>', lista: [1], bises: [] }), RangeError);
  const leer = (h: string) => leerRecital(`${BASE}?g=recital#${h}`, 'recital', 105, existe);
  assert.equal(leer('r=1.descampado.01.'), null, 'descampado sin localidad');
  assert.equal(leer('r=1.otro.01.&c=Rosario'), null, 'otro sin nombre');
  assert.deepEqual(leer('r=1.otro.01.&l=%3Cb%3EMi%20casa%3C%2Fb%3E'), { lugar: 'otro', nombre: 'bMi casab', lista: [1], bises: [] });
  assert.deepEqual(leer('r=1.estadio-huracan.01.&l=Ignorado'), { lugar: 'estadio-huracan', lista: [1], bises: [] }, 'un lugar del catálogo no lee texto libre');
});
