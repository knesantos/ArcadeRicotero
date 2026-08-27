import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ESCALERA,
  INTENTOS,
  DURACION_FRAGMENTO_SEG,
  paso,
  puntos,
  puntajeMaximo,
  anchosDeTramos,
  tramosConEtiqueta,
  PISO_ETIQUETA_PCT,
} from './escalera.ts';

/**
 * La escalera que fijó el usuario, escrita a mano acá.
 *
 * Si esta tabla y `escalera.ts` dejan de coincidir, **cambió una decisión**, no un
 * detalle de código: la que manda es la del usuario y la que hay que corregir es la
 * otra. Es el mismo criterio que `tramo.test.ts` usa con la tabla de `BR-05`.
 */
const LA_QUE_PIDIO_EL_USUARIO: Array<[number, number]> = [
  [1, 0.1],
  [2, 0.5],
  [3, 2],
  [4, 4],
  [5, 8],
  // `D-26`: el sexto paso pedia 15; los fragmentos reales del PR #8 miden 10, y la
  // escalera no promete audio que el archivo no tiene. Vuelve a 15 con fragmentos de 15.
  [6, 10],
];

test('los seis pasos son exactamente los que pidió el usuario', () => {
  assert.equal(ESCALERA.length, 6, 'la escalera tiene que tener seis pasos');
  for (const [n, segundos] of LA_QUE_PIDIO_EL_USUARIO) {
    assert.equal(paso(n).segundos, segundos, `el paso ${n} debería durar ${segundos} s`);
  }
});

test('cada paso da más audio que el anterior', () => {
  for (let i = 1; i < ESCALERA.length; i++) {
    assert.ok(
      ESCALERA[i]!.segundos > ESCALERA[i - 1]!.segundos,
      `el paso ${i + 1} no agrega audio sobre el ${i}`,
    );
  }
});

test('cada paso vale menos que el anterior, y ninguno vale cero', () => {
  // Cero es exclusivamente el resultado de no sacarla. Nunca el de haber tardado: esa
  // parte de `BR-02` se mantiene tal cual estaba escrita.
  for (let i = 1; i < ESCALERA.length; i++) {
    assert.ok(ESCALERA[i]!.puntos < ESCALERA[i - 1]!.puntos, `el paso ${i + 1} no baja el puntaje`);
  }
  for (const p of ESCALERA) assert.ok(p.puntos > 0, `el paso ${p.n} vale 0 y no debería`);
});

test('el fragmento que sirve el sitio alcanza para el último paso', () => {
  // Si el archivo durara menos que el último escalón, el jugador que llegó hasta ahí
  // recibiría silencio justo cuando pidió todo el audio.
  assert.ok(
    DURACION_FRAGMENTO_SEG >= ESCALERA[ESCALERA.length - 1]!.segundos,
    `el fragmento dura ${DURACION_FRAGMENTO_SEG} s y el último paso pide ${ESCALERA[ESCALERA.length - 1]!.segundos} s`,
  );
});

test('hay tantos intentos como escalones', () => {
  // La mecánica del juego de referencia: cada intento gastado abre el escalón siguiente,
  // y el último no abre nada. Si los dos números se separan, o sobran intentos sin audio
  // nuevo o queda audio que nadie puede llegar a escuchar.
  assert.equal(INTENTOS, ESCALERA.length);
});

test('paso() nunca devuelve undefined, ni con números de fantasía', () => {
  for (const n of [-5, 0, 1, 6, 7, 999]) {
    assert.ok(paso(n), `paso(${n}) no devolvió nada`);
  }
  assert.equal(paso(0).n, 1, 'por debajo del rango, el primero');
  assert.equal(paso(99).n, 6, 'por encima del rango, el último');
});

test('los anchos de la barra suman el 100% de la línea de tiempo', () => {
  const anchos = anchosDeTramos();
  assert.equal(anchos.length, ESCALERA.length);
  const suma = anchos.reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(suma - 100) < 0.0001, `los tramos suman ${suma}% y deberían sumar 100%`);
});

test('el ancho de cada tramo es lo que ESE paso agrega, no su duración total', () => {
  // El último tramo va de 8 a 10 segundos: dos segundos nuevos sobre diez totales.
  const anchos = anchosDeTramos();
  assert.ok(Math.abs(anchos[5]! - ((10 - 8) / 10) * 100) < 0.0001);
  // Y el primero es apenas la décima: por eso el CSS le pone un `min-width`.
  assert.ok(Math.abs(anchos[0]! - (0.1 / 10) * 100) < 0.0001);
  // Con el total en 10 (`D-26`) la decima da exactamente el 1%; con 15 daba 0,67%.
  assert.ok(anchos[0]! <= 1, 'el primer tramo tendría que ser casi invisible sin el min-width');
});

test('el puntaje máximo de una vuelta son todos los temas acertados en el paso 1', () => {
  assert.equal(puntajeMaximo(4), 400);
  assert.equal(puntos(1), 100);
});

test('la regla de abajo de la barra numera los tramos que tienen lugar', () => {
  // Los dos primeros se llevan el 1% y el 4% de la barra: en un celular, tres pixeles y
  // trece. Numerarlos seria pisar un numero con el otro.
  assert.deepEqual(tramosConEtiqueta(), [false, false, true, true, true, true]);
});

test('ningun tramo numerado es mas angosto que el numero que lleva', () => {
  const anchos = anchosDeTramos();
  tramosConEtiqueta().forEach((lleva, i) => {
    if (lleva) assert.ok(anchos[i]! >= PISO_ETIQUETA_PCT, `el tramo ${i + 1} no da el ancho`);
  });
});

test('el ultimo tramo siempre lleva numero: es el final de la escalera', () => {
  // Si el ultimo no estuviera numerado, la regla no diria cuanto audio hay en total.
  const marcados = tramosConEtiqueta();
  assert.equal(marcados[marcados.length - 1], true);
});
