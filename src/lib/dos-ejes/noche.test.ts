/**
 * El camino de la noche (`noche.ts`): que la mirada camine siempre para adelante y nunca se
 * salga de la tira, que la luna cruce el cielo, y que el dibujo servido sea el de estas medidas.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CARPETA_NOCHE, GUINOS, PIEZAS_DE_LA_NOCHE, TIRA, inicioDelLugar, lunaDe, paradaDe } from './noche.ts';

const banco = JSON.parse(readFileSync('src/data/dos-ejes.json', 'utf-8')) as { momentos: unknown[]; preguntasPorEje: number };
const HOJAS = banco.preguntasPorEje * 2;
const POR_MOMENTO = HOJAS / banco.momentos.length;

test('la mirada avanza con cada hoja y cada parada cae adentro de su lugar', () => {
  let antes = -Infinity;
  for (let paso = 0; paso < HOJAS; paso++) {
    const x = paradaDe(paso, POR_MOMENTO);
    assert.ok(x > antes, `la hoja ${paso + 1} no avanza`);
    const lugar = Math.floor(paso / POR_MOMENTO);
    assert.ok(x > inicioDelLugar(lugar) && x < inicioDelLugar(lugar + 1), `la hoja ${paso + 1} mira afuera de su lugar`);
    antes = x;
  }
});

test('la tira alcanza para todos los momentos del banco, con margen a las dos puntas', () => {
  assert.equal(TIRA.margen * 2 + TIRA.lugar * banco.momentos.length, TIRA.ancho);
  // Una ventana de mesa muestra hasta cuatro altos de suelo: medio a cada lado de la parada.
  const media = TIRA.alto * 2;
  assert.ok(paradaDe(0, POR_MOMENTO) - media >= 0, 'en la primera hoja se ve el borde izquierdo de la tira');
  assert.ok(paradaDe(HOJAS - 1, POR_MOMENTO) + media <= TIRA.ancho, 'en la última hoja se ve el borde derecho');
});

test('la luna cruza el cielo de punta a punta y pasa por arriba', () => {
  const primera = lunaDe(0, HOJAS);
  const medio = lunaDe(Math.floor(HOJAS / 2), HOJAS);
  const ultima = lunaDe(HOJAS - 1, HOJAS);
  assert.equal(primera.x, 0);
  assert.equal(ultima.x, 100);
  assert.ok(medio.y < primera.y && medio.y < ultima.y, 'la luna no sube');
  for (let p = 0; p < HOJAS; p++) {
    const { x, y } = lunaDe(p, HOJAS);
    assert.ok(x >= 0 && x <= 100 && y >= 0 && y <= 100);
  }
});

test('las pasadas de la noche están servidas y juego.css las usa todas', () => {
  const css = readFileSync('src/styles/juego.css', 'utf-8');
  for (const pieza of PIEZAS_DE_LA_NOCHE) {
    assert.ok(existsSync(join('public', CARPETA_NOCHE, pieza)), `falta ${pieza}: corré npm run generar-noche-dos-ejes`);
    assert.ok(css.includes(`${CARPETA_NOCHE}/${pieza}`), `juego.css no usa ${pieza}`);
  }
  assert.ok(css.includes(`calc(var(--u) * ${TIRA.ancho})`), 'la tira de juego.css no mide lo que mide el dibujo');
  // La gente es dibujo propio desde la ronda 2: la multitud de *Oktubre* no entra a este juego
  // (no está acreditada en su pie).
  const lugar = css.slice(css.indexOf('La noche se ve'), css.indexOf('La partida por vidas'));
  assert.ok(!lugar.includes('multitud-'), 'el lugar volvió a usar la multitud de Oktubre');
});

test('los guiños: uno de cada lado por hoja, del mismo tipo, adentro de su lugar (BR-17)', () => {
  assert.equal(GUINOS.porHoja.length, HOJAS, 'no hay un par de guiños por hoja');
  GUINOS.porHoja.forEach(([izq, der], hoja) => {
    // Mismo tipo y misma altura de los dos lados: si fueran distintos, el lado pesaría.
    assert.equal(izq.tipo, der.tipo, `la hoja ${hoja + 1} tiene guiños de distinto tipo`);
    assert.ok(izq.x < der.x, `la hoja ${hoja + 1}: el de la izquierda no está a la izquierda`);
    const lugar = Math.floor(hoja / POR_MOMENTO);
    const medio = paradaDe(hoja, POR_MOMENTO);
    for (const g of [izq, der]) {
      assert.ok(g.x > inicioDelLugar(lugar) && g.x < inicioDelLugar(lugar + 1), `la hoja ${hoja + 1}: un guiño cae en otro lugar`);
      // Un teléfono muestra unas 200 unidades a cada lado de la parada: el guiño tiene que verse al caer.
      assert.ok(Math.abs(g.x - medio) < 200, `la hoja ${hoja + 1}: un guiño cae fuera de la ventana`);
    }
  });
  // La isla guarda el lado tocado, nunca el polo.
  const isla = readFileSync('src/scripts/partida-dos-ejes.ts', 'utf-8');
  assert.match(isla, /lados\[paso\] = lado/);
  assert.ok(!/ponerGuino\([^)]*polo/.test(isla), 'el guiño depende del polo elegido');
});
