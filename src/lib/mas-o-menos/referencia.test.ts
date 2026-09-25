import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ANIO_TOPE,
  SEGUNDOS_PISO,
  escalon,
  lejosParaPar,
  pasoDeRedondeo,
  referenciaNumero,
  type Escala,
} from './referencia.ts';
import { azarConSemilla } from './partida.ts';
import { conPuntoDeMiles, conUnidad, numeroEnPantalla } from './formato.ts';

/**
 * La referencia es lo único del juego que se inventa, y por eso es lo que más se prueba:
 * el número real sale de una ficha, pero el "¿más o menos que 12?" lo pone el motor. Si la
 * referencia pudiera caer sobre la respuesta, habría un empate que ninguna regla resuelve
 * (`D-48` punto 9); si pudiera ser 0 o 2031, sería una pregunta absurda.
 */

const VALORES: Record<Escala, readonly number[]> = {
  anio: [1949, 1968, 1976, 1985, 1996, 2001, 2017, 2024],
  entero: [1, 2, 3, 5, 9, 14, 24, 34, 57, 101, 863, 4700, 21000, 70000, 85018],
  segundos: [53, 58, 61, 180, 334, 445],
};

test('los cuatro escalones de la racha: 0–2, 3–5, 6–9, 10+', () => {
  assert.deepEqual(
    [0, 2, 3, 5, 6, 9, 10, 40].map(escalon),
    [0, 0, 1, 1, 2, 2, 3, 3],
  );
});

test('la referencia nunca es la respuesta, ni cae fuera de su escala, en mil sorteos por valor', () => {
  const azar = azarConSemilla(7);
  for (const escala of ['anio', 'entero', 'segundos'] as const) {
    for (const valor of VALORES[escala]) {
      for (const racha of [0, 3, 6, 10, 25]) {
        for (let i = 0; i < 200; i++) {
          const ref = referenciaNumero(valor, escala, racha, azar);
          assert.notEqual(ref, valor, `${escala} ${valor} racha ${racha}: empate`);
          assert.ok(Number.isInteger(ref), `${escala} ${valor}: ${ref} no es entero`);
          if (escala === 'entero') assert.ok(ref >= 1, `entero ${valor}: referencia ${ref} < 1`);
          if (escala === 'anio') assert.ok(ref <= ANIO_TOPE, `año ${valor}: referencia ${ref} > ${ANIO_TOPE}`);
          if (escala === 'segundos') {
            assert.ok(ref >= SEGUNDOS_PISO, `segundos ${valor}: referencia ${ref}`);
            assert.equal(ref % 5, 0, `segundos ${valor}: ${ref} no redondea a cinco`);
          }
        }
      }
    }
  }
});

test('un valor de 1 no tiene "menos": la referencia va siempre para arriba', () => {
  const azar = azarConSemilla(3);
  for (let i = 0; i < 200; i++) assert.ok(referenciaNumero(1, 'entero', 0, azar) > 1);
});

test('un año de 2024 no puede preguntarse contra 2034: el tope lo manda para abajo', () => {
  const azar = azarConSemilla(11);
  for (let i = 0; i < 200; i++) assert.ok(referenciaNumero(2024, 'anio', 0, azar) < 2024);
});

test('la distancia se achica con la racha: la media del primer escalón le gana a la del último', () => {
  const media = (escala: Escala, valor: number, racha: number): number => {
    const azar = azarConSemilla(99);
    let suma = 0;
    for (let i = 0; i < 400; i++) {
      const ref = referenciaNumero(valor, escala, racha, azar);
      suma += escala === 'entero' ? Math.max(ref, valor) / Math.min(ref, valor) : Math.abs(ref - valor);
    }
    return suma / 400;
  };
  for (const [escala, valor] of [
    ['anio', 1986],
    ['entero', 70000],
    ['entero', 34],
    ['segundos', 334],
  ] as const) {
    const lejos = media(escala, valor, 0);
    const medio = media(escala, valor, 4);
    const cerca = media(escala, valor, 12);
    assert.ok(lejos > medio && medio > cerca, `${escala} ${valor}: ${lejos} / ${medio} / ${cerca}`);
  }
});

test('el primer escalón es de sentido común: un año se aleja al menos 8, una cantidad al menos el doble', () => {
  const azar = azarConSemilla(5);
  for (let i = 0; i < 300; i++) {
    assert.ok(Math.abs(referenciaNumero(1986, 'anio', 0, azar) - 1986) >= 8);
    const ref = referenciaNumero(70000, 'entero', 0, azar);
    assert.ok(Math.max(ref, 70000) / Math.min(ref, 70000) >= 2, `70000 contra ${ref}`);
  }
});

test('las cantidades redondean como se dicen: de a uno, de a cinco, de a cincuenta, dos cifras', () => {
  assert.deepEqual([7, 34, 863, 4700, 70000].map(pasoDeRedondeo), [1, 5, 50, 100, 1000]);
  const azar = azarConSemilla(21);
  for (let i = 0; i < 300; i++) {
    const ref = referenciaNumero(70000, 'entero', 0, azar);
    assert.equal(ref % 1000, 0, `${ref} no tiene dos cifras significativas`);
  }
});

test('el par pide la distancia del escalón, y nunca dos valores iguales', () => {
  assert.equal(lejosParaPar(1986, 1986, 'anio', 12), false);
  assert.equal(lejosParaPar(1986, 1996, 'anio', 0), true);
  assert.equal(lejosParaPar(1986, 1991, 'anio', 0), false);
  assert.equal(lejosParaPar(1986, 1991, 'anio', 3), true);
  assert.equal(lejosParaPar(10, 20, 'entero', 0), false);
  assert.equal(lejosParaPar(10, 20, 'entero', 3), true);
  assert.equal(lejosParaPar(10, 30, 'entero', 0), true);
  assert.equal(lejosParaPar(10, 11, 'entero', 10), true);
  assert.equal(lejosParaPar(334, 445, 'segundos', 0), false);
  assert.equal(lejosParaPar(334, 445, 'segundos', 3), true);
});

test('los números se escriben como se leen: el año pelado, el punto de miles desde el mil, m:ss', () => {
  assert.equal(numeroEnPantalla(1986, 'anio'), '1986');
  assert.equal(numeroEnPantalla(4700, 'entero'), '4.700');
  assert.equal(numeroEnPantalla(70000, 'entero'), '70.000');
  assert.equal(numeroEnPantalla(85018, 'entero'), '85.018');
  assert.equal(numeroEnPantalla(999, 'entero'), '999');
  assert.equal(numeroEnPantalla(334, 'segundos'), '5:34');
  assert.equal(numeroEnPantalla(53, 'segundos'), '0:53');
  assert.equal(numeroEnPantalla(445, 'segundos'), '7:25');
  assert.equal(conPuntoDeMiles(1234567), '1.234.567');
  assert.equal(conUnidad(1, 'entero', ['tema', 'temas']), '1 tema');
  assert.equal(conUnidad(34, 'entero', ['tema', 'temas']), '34 temas');
  assert.equal(conUnidad(1986, 'anio'), '1986');
});

/*
 * `CTR-20.11` i20 e i21: los bordes donde la respuesta se sabría sin saber, y la franja del
 * par. Cada caso a mano, sin recorrer las constantes: si una guarda se afloja, el caso rojo
 * no se afloja con ella.
 */
test('CTR-20 i20: la referencia nunca cae donde la respuesta se sabe sin saber', () => {
  const azar = azarConSemilla(31);
  for (let i = 0; i < 300; i++) {
    for (const racha of [0, 3, 6, 10]) {
      assert.ok(referenciaNumero(1, 'entero', racha, azar) >= 2, 'un 1 contra un 1 sería regalado');
      assert.notEqual(referenciaNumero(2, 'entero', racha, azar), 1, '"¿más o menos que 1?" es siempre "más"');
      assert.ok(referenciaNumero(2025, 'anio', racha, azar) < 2026, '"¿antes o después de 2026?" es siempre "antes"');
      const seg = referenciaNumero(53, 'segundos', racha, azar);
      assert.ok(seg >= 30, `una canción de ${seg} segundos no existe`);
      assert.ok(referenciaNumero(34, 'entero', racha, azar, 100) < 100, 'más temas de los que se contaron');
      assert.ok(referenciaNumero(101, 'entero', racha, azar, 256) < 256, 'más setlists de los cargados');
    }
    const fino = referenciaNumero(213, 'segundos', 10, azar);
    assert.ok(Math.abs(fino - 213) >= 10, `213 contra ${fino}: la referencia quedó más fina que el par`);
  }
});

test('CTR-20 i21: el par cae en la franja del escalón, no solo arriba de su piso', () => {
  assert.equal(lejosParaPar(1986, 1996, 'anio', 12), false, 'diez años de distancia a racha 12 es regalado');
  assert.equal(lejosParaPar(1986, 1987, 'anio', 12), true);
  assert.equal(lejosParaPar(101, 5, 'entero', 12), false, 'Jijiji contra Scaramanzia a racha 12');
  assert.equal(lejosParaPar(101, 90, 'entero', 12), true);
  assert.equal(lejosParaPar(334, 445, 'segundos', 12), false);
  assert.equal(lejosParaPar(334, 350, 'segundos', 12), true);
  assert.equal(lejosParaPar(1993, 1993, 'anio', 0), false, 'Lobo suelto y Cordero atado no van en par');
});
