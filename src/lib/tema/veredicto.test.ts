import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { tramoDeLaVuelta, titularDeLaVuelta, puertaDeLaVuelta, PUNTOS_DE_OIDO } from './veredicto.ts';
import { ESCALERA } from './escalera.ts';
import { LARGO_VUELTA } from './vuelta.ts';
import { TRAMOS, RESULTADO, TITULAR } from './copy.ts';
import { DISCOS } from '../letra/discos.ts';

/** Lo que puede valer un tema: 0 (no salió) o los puntos de alguno de los seis pasos. */
const VALORES = [0, ...ESCALERA.map((e) => e.puntos)];

/** Todas las vueltas posibles de `n` temas. Con cuatro son 7^4 = 2.401: se recorren todas. */
function todasLasVueltas(n: number): number[][] {
  let vueltas: number[][] = [[]];
  for (let i = 0; i < n; i++) vueltas = vueltas.flatMap((v) => VALORES.map((p) => [...v, p]));
  return vueltas;
}

const VUELTAS = todasLasVueltas(LARGO_VUELTA);
const DISCOS_DE_PRUEBA = DISCOS.slice(0, LARGO_VUELTA);
const LA_FRASE = 'Te falta escuchar disco.';

test('la frase sigue en el sitio, y es la del tramo bajo', () => {
  assert.equal(TRAMOS.bajo, LA_FRASE);
});

test('T-535: «Te falta escuchar disco.» no le sale al que sacó bien', () => {
  for (const v of VUELTAS) {
    if (TRAMOS[tramoDeLaVuelta(v, v.length)] !== LA_FRASE) continue;
    const aciertos = v.filter((p) => p > 0).length;
    const puntos = v.reduce((a, p) => a + p, 0);
    assert.ok(aciertos / v.length < 0.3, `[${v}] sacó ${aciertos} de ${v.length} y le dice que le falta escuchar disco`);
    assert.ok(puntos / (v.length * 100) < 0.3, `[${v}] sumó ${puntos} y le dice que le falta escuchar disco`);
    assert.ok(v.every((p) => p < PUNTOS_DE_OIDO), `[${v}] sacó uno de oído y le dice que le falta escuchar disco`);
  }
});

test('T-535: los casos con nombre', () => {
  assert.equal(tramoDeLaVuelta([0, 0, 0, 0], 4), 'bajo', 'no sacó ninguno');
  assert.equal(tramoDeLaVuelta([10, 0, 0, 0], 4), 'bajo', 'uno, con todo el audio');
  assert.equal(tramoDeLaVuelta([0, 40, 0, 0], 4), 'bajo', 'uno, con cuatro segundos');
  assert.equal(tramoDeLaVuelta([100, 0, 0, 0], 4), 'oido', 'uno con la primera décima: antes era bajo');
  assert.equal(tramoDeLaVuelta([0, 0, 60, 0], 4), 'oido', 'uno con dos segundos');
  assert.equal(tramoDeLaVuelta([10, 10, 0, 0], 4), 'medio', 'la mitad: como antes');
  assert.equal(tramoDeLaVuelta([10, 10, 10, 0], 4), 'alto', 'tres de cuatro: como antes');
  assert.equal(tramoDeLaVuelta([100, 100, 100, 100], 4), 'alto');
});

test('medio y alto no se movieron: siguen siendo los cortes de BR-05 por aciertos', () => {
  for (const v of VUELTAS) {
    const aciertos = v.filter((p) => p > 0).length;
    const t = tramoDeLaVuelta(v, v.length);
    if (aciertos >= 3) assert.equal(t, 'alto', `[${v}]`);
    else if (aciertos === 2) assert.equal(t, 'medio', `[${v}]`);
    else assert.ok(t === 'bajo' || t === 'oido', `[${v}] cayó en ${t}`);
  }
});

test('en una vuelta larga, los puntos también sacan del tramo bajo', () => {
  // Dos de diez (20 % de aciertos) con 40 puntos cada uno: 8 % de los puntos. Sigue bajo.
  assert.equal(tramoDeLaVuelta([40, 40, 0, 0, 0, 0, 0, 0, 0, 0], 10), 'bajo');
  // Sin ningún acierto de oído no hay forma de llegar al 30 % con menos del 30 % de aciertos
  // en la escalera de hoy; el corte por puntos queda para una escalera que cambie.
  assert.equal(tramoDeLaVuelta([100, 100, 0, 0, 0, 0, 0, 0, 0, 0], 10), 'oido');
});

test('T-535: la frase nunca va sola — siempre con la cuenta de titular y con una puerta', () => {
  let vistos = 0;
  for (const v of VUELTAS) {
    if (tramoDeLaVuelta(v, v.length) !== 'bajo') continue;
    vistos++;
    const titular = titularDeLaVuelta(v, v.length, '1 m 14 s');
    const aciertos = v.filter((p) => p > 0).length;
    assert.equal(titular.es, 'sacaste', `[${v}] con el tramo bajo el número grande es el reloj`);
    assert.equal(titular.numero, `${aciertos} de ${v.length}`);
    const puerta = puertaDeLaVuelta(DISCOS_DE_PRUEBA, v);
    assert.ok(puerta, `[${v}] tramo bajo sin puerta`);
    assert.match(puerta.href, /^\/redondopedia\/[a-z-]+\/$/);
  }
  assert.ok(vistos > 0, 'ninguna vuelta cayó en bajo: el test no miró nada');
});

test('la puerta lleva al disco del primer tema que no salió, y solo sale con el tramo bajo', () => {
  const discos = ['gulp', 'oktubre', 'luzbelito', 'momo-sampler'];
  assert.equal(puertaDeLaVuelta(discos, [0, 0, 0, 0])?.href, '/redondopedia/gulp/');
  assert.equal(puertaDeLaVuelta(discos, [20, 0, 0, 0])?.href, '/redondopedia/oktubre/');
  assert.equal(puertaDeLaVuelta(discos, [100, 0, 0, 0]), null, 'de oído: no hay veredicto que acompañar');
  assert.equal(puertaDeLaVuelta(discos, [20, 20, 0, 0]), null);
});

test('T-535: con menos de la mitad, lo grande es lo que sacaste y el reloj va abajo', () => {
  for (const v of VUELTAS) {
    const aciertos = v.filter((p) => p > 0).length;
    const t = titularDeLaVuelta(v, v.length, '1 m 14 s');
    if (aciertos * 2 < v.length) {
      assert.equal(t.es, 'sacaste', `[${v}]`);
      assert.equal(t.rotulo, TITULAR.rotuloSacaste);
      assert.ok(!t.numero.includes('1 m 14 s'), `[${v}] el número grande sigue siendo el tiempo`);
      assert.ok(t.pie.includes('1 m 14 s'), `[${v}] el tiempo se perdió: tiene que seguir, de dato menor`);
    } else {
      assert.equal(t.es, 'tiempo', `[${v}]`);
      assert.equal(t.rotulo, RESULTADO.rotuloTiempo);
      assert.equal(t.numero, '1 m 14 s');
      assert.ok(t.pie.includes(`${aciertos} de ${v.length} temas`), `[${v}] la cuenta se perdió`);
    }
    // En cualquiera de los dos, los puntos siguen a la vista.
    assert.match(t.pie, /\d+ de 400 puntos/, `[${v}]`);
  }
});

test('con un solo tema sacado, el renglón dice con cuánto audio', () => {
  assert.equal(
    titularDeLaVuelta([0, 80, 0, 0], 4, '1 m 14 s').pie,
    'Con 0,5 s de audio · 80 de 400 puntos · en 1 m 14 s',
  );
  assert.equal(titularDeLaVuelta([0, 10, 0, 0], 4, '2 m').pie, 'Con el resto del audio · 10 de 400 puntos · en 2 m');
  assert.equal(titularDeLaVuelta([0, 0, 0, 0], 4, '54 s').pie, '0 de 400 puntos · en 54 s');
  assert.equal(titularDeLaVuelta([0, 0, 0, 0], 4, '54 s').numero, '0 de 4');
});

test('la isla no decide el tramo por su cuenta: pasa por veredicto.ts', () => {
  // Si una fusión trae de vuelta `tramo(aciertos, ronda.length)` —la otra rama tiene tres—,
  // la pantalla y la tarjeta que se comparte dirían cosas distintas sin que nada falle.
  const isla = readFileSync('src/scripts/partida-tema.ts', 'utf-8');
  assert.ok(!/\btramo\(aciertos/.test(isla), 'partida-tema.ts volvió a llamar a tramo() del quiz');
  assert.ok(/tramoDeLaVuelta\(/.test(isla), 'partida-tema.ts no usa tramoDeLaVuelta');
  assert.ok(/titularDeLaVuelta\(/.test(isla), 'partida-tema.ts no usa titularDeLaVuelta');
  assert.ok(/puertaDeLaVuelta\(/.test(isla), 'partida-tema.ts no pinta la puerta');
});
