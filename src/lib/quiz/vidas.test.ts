/**
 * Verificacion de `vidas.ts` contra `BR-19`.
 *
 * El foco esta puesto en los bordes que `BR-19` dejo escritos de frente, porque son los
 * que se pierden cuando alguien toca esto dentro de seis meses: que perder la ultima vida
 * en la ultima pregunta sea derrota y no victoria, que retirarse no sea perder, y que el
 * escalon salga del pozo y no de una constante.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  comenzar,
  responder,
  retirarse,
  actual,
  nivel,
  abreEscalon,
  aciertos,
  resultado,
  VIDAS_INICIALES,
  PartidaImposible,
  type Partida,
} from './vidas.ts';
import type { Jugable } from './ronda.ts';
import type { Dificultad } from './banco.ts';

/** Un banco de mentira con la forma del real: pozos de 10 / 15 / 15. */
function bancoFalso(faciles = 10, medias = 15, dificiles = 15): Jugable[] {
  const hacer = (d: Dificultad, n: number): Jugable[] =>
    Array.from({ length: n }, (_, i) => ({
      id: `${d}-${i}`,
      dificultad: d,
      opciones: [
        { texto: `bien-${d}-${i}`, correcta: true },
        { texto: `mal-${d}-${i}-a`, correcta: false },
        { texto: `mal-${d}-${i}-b`, correcta: false },
        { texto: `mal-${d}-${i}-c`, correcta: false },
      ],
    }));
  return [...hacer('facil', faciles), ...hacer('media', medias), ...hacer('dificil', dificiles)];
}

/** Azar fijo: hace los tests reproducibles sin volverlos mentirosos. */
const azarFijo = () => 0.42;

/** Responde bien la pregunta en juego. */
function bien(p: Partida<Jugable>): Partida<Jugable> {
  const item = actual(p);
  assert.ok(item, 'se esperaba una pregunta en juego');
  return responder(p, item.opciones.find((o) => o.correcta)!.texto);
}

/** Responde mal la pregunta en juego. */
function mal(p: Partida<Jugable>): Partida<Jugable> {
  const item = actual(p);
  assert.ok(item, 'se esperaba una pregunta en juego');
  return responder(p, item.opciones.find((o) => !o.correcta)!.texto);
}

test('la partida arranca con tres vidas y el banco entero', () => {
  const p = comenzar(bancoFalso(), azarFijo);
  assert.equal(p.vidas, VIDAS_INICIALES);
  assert.equal(p.vidas, 3);
  assert.equal(p.orden.length, 40, 'BR-19 apartado 2: el largo es el banco, no un numero fijo');
  assert.equal(p.desenlace, 'jugando');
});

test('BR-01 punto 1 sobrevive: la primera pregunta es facil', () => {
  for (let i = 0; i < 25; i++) {
    const p = comenzar(bancoFalso(), () => i / 25);
    assert.equal(actual(p)!.dificultad, 'facil');
  }
});

test('BR-01 punto 2 sobrevive: la dificultad nunca baja', () => {
  const orden = { facil: 0, media: 1, dificil: 2 };
  const p = comenzar(bancoFalso(), azarFijo);
  for (let i = 1; i < p.orden.length; i++) {
    assert.ok(
      orden[p.orden[i]!.dificultad] >= orden[p.orden[i - 1]!.dificultad],
      `bajo la dificultad entre la ${i} y la ${i + 1}`,
    );
  }
});

test('el escalon dura lo que dura el pozo: 10 / 15 / 15, no 10 / 10 / 10', () => {
  const p = comenzar(bancoFalso(), azarFijo);
  const porNivel = p.orden.map((i) => i.dificultad);
  assert.equal(porNivel.filter((d) => d === 'facil').length, 10);
  assert.equal(porNivel.filter((d) => d === 'media').length, 15);
  assert.equal(porNivel.filter((d) => d === 'dificil').length, 15);
  // Y estan en bloques, no entreverados.
  assert.deepEqual(porNivel.slice(0, 10), Array(10).fill('facil'));
  assert.deepEqual(porNivel.slice(10, 25), Array(15).fill('media'));
});

test('el escalon sale del banco, no de una constante: con otro banco, otro escalon', () => {
  const p = comenzar(bancoFalso(15, 15, 15), azarFijo);
  const faciles = p.orden.filter((i) => i.dificultad === 'facil').length;
  assert.equal(faciles, 15, 'si contenido carga cinco faciles mas, el escalon dura 15');
  assert.equal(p.orden.length, 45);
});

test('una respuesta correcta no gasta vida; una incorrecta gasta exactamente una', () => {
  let p = comenzar(bancoFalso(), azarFijo);
  p = bien(p);
  assert.equal(p.vidas, 3);
  p = mal(p);
  assert.equal(p.vidas, 2);
  p = bien(p);
  assert.equal(p.vidas, 2);
  p = mal(p);
  assert.equal(p.vidas, 1);
});

test('tres errores terminan la partida en derrota, aunque sea en la pregunta 3', () => {
  let p = comenzar(bancoFalso(), azarFijo);
  p = mal(p);
  p = mal(p);
  assert.equal(p.desenlace, 'jugando');
  p = mal(p);
  assert.equal(p.desenlace, 'derrota');
  assert.equal(p.vidas, 0);
  assert.equal(resultado(p)!.pregunta, 3);
});

test('agotar el banco con vidas en pie es victoria', () => {
  let p = comenzar(bancoFalso(), azarFijo);
  for (let i = 0; i < 40; i++) p = bien(p);
  assert.equal(p.desenlace, 'victoria');
  const r = resultado(p)!;
  assert.equal(r.pregunta, 40);
  assert.equal(r.total, 40);
  assert.equal(r.aciertos, 40);
});

test('se puede ganar habiendo errado dos veces: la victoria es sin morir, no perfecta', () => {
  let p = comenzar(bancoFalso(), azarFijo);
  p = mal(p);
  p = mal(p);
  for (let i = 2; i < 40; i++) p = bien(p);
  assert.equal(p.desenlace, 'victoria');
  assert.equal(p.vidas, 1);
  assert.equal(resultado(p)!.aciertos, 38);
});

test('BR-19 apartado 3: perder la ultima vida en la ultima pregunta es DERROTA, no victoria', () => {
  let p = comenzar(bancoFalso(), azarFijo);
  p = mal(p);
  p = mal(p);
  for (let i = 2; i < 39; i++) p = bien(p);
  assert.equal(p.desenlace, 'jugando');
  assert.equal(p.vidas, 1);
  assert.equal(resultado(p), null, 'todavia no hay resultado que mostrar');
  p = mal(p); // la 40, y se queda sin vidas justo ahi
  assert.equal(p.desenlace, 'derrota', '"sin morir" manda por sobre "llego hasta el final"');
  assert.equal(resultado(p)!.pregunta, 40);
});

test('retirarse cierra la partida y no es perder', () => {
  let p = comenzar(bancoFalso(), azarFijo);
  for (let i = 0; i < 12; i++) p = bien(p);
  p = retirarse(p);
  const r = resultado(p)!;
  assert.equal(r.desenlace, 'retirada');
  assert.notEqual(r.desenlace, 'derrota');
  assert.equal(r.pregunta, 12);
  assert.equal(r.vidasRestantes, 3, 'una retirada tranquila: las tres vidas intactas');
});

test('la retirada guarda las vidas que quedaban, que es lo que la distingue', () => {
  let p = comenzar(bancoFalso(), azarFijo);
  p = mal(p);
  p = mal(p);
  p = retirarse(p);
  assert.equal(resultado(p)!.vidasRestantes, 1, 'una retirada al limite');
});

test('victoria y derrota no reportan vidas restantes: ahi el dato no dice nada', () => {
  let g = comenzar(bancoFalso(), azarFijo);
  for (let i = 0; i < 40; i++) g = bien(g);
  assert.equal(resultado(g)!.vidasRestantes, null);

  let d = comenzar(bancoFalso(), azarFijo);
  d = mal(d);
  d = mal(d);
  d = mal(d);
  assert.equal(resultado(d)!.vidasRestantes, null);
});

test('se puede retirar sin haber respondido nada, y no rompe', () => {
  const p = retirarse(comenzar(bancoFalso(), azarFijo));
  const r = resultado(p)!;
  assert.equal(r.desenlace, 'retirada');
  assert.equal(r.pregunta, 0);
  assert.equal(r.respondidas, 0);
  assert.equal(r.nivel, null, 'sin responder ninguna no hay nivel alcanzado');
});

test('una partida terminada no se puede seguir jugando', () => {
  let p = comenzar(bancoFalso(), azarFijo);
  p = mal(p);
  p = mal(p);
  p = mal(p);
  assert.equal(p.desenlace, 'derrota');
  assert.deepEqual(responder(p, 'lo que sea'), p, 'responder despues del final no hace nada');
  assert.deepEqual(retirarse(p), p, 'retirarse despues del final no hace nada');
  assert.equal(actual(p), null);
});

test('abreEscalon avisa el ascenso, y no lo avisa en la primera', () => {
  let p = comenzar(bancoFalso(), azarFijo);
  assert.equal(abreEscalon(p), false, 'BR-01 punto 1: abrir en facil no es un ascenso');
  for (let i = 0; i < 9; i++) {
    p = bien(p);
    assert.equal(abreEscalon(p), false, `la ${i + 2} sigue en el mismo escalon`);
  }
  p = bien(p); // la 11: primera media
  assert.equal(abreEscalon(p), true);
  assert.equal(nivel(p), 'media');
  p = bien(p);
  assert.equal(abreEscalon(p), false, 'solo la primera del escalon lo abre');
});

test('el nivel del resultado es el del momento del desenlace', () => {
  let p = comenzar(bancoFalso(), azarFijo);
  for (let i = 0; i < 12; i++) p = bien(p);
  p = retirarse(p);
  assert.equal(resultado(p)!.nivel, 'media', 'se retiro en la 12, que ya es media');
});

test('aciertos cuenta solo lo respondido, no el banco entero', () => {
  let p = comenzar(bancoFalso(), azarFijo);
  p = bien(p);
  p = mal(p);
  p = bien(p);
  assert.equal(aciertos(p), 2);
  p = retirarse(p);
  const r = resultado(p)!;
  assert.equal(r.aciertos, 2);
  assert.equal(r.respondidas, 3);
});

test('no hay resultado mientras la partida sigue', () => {
  const p = comenzar(bancoFalso(), azarFijo);
  assert.equal(resultado(p), null);
  assert.equal(resultado(bien(p)), null);
});

test('un banco vacio no arranca una partida', () => {
  assert.throws(() => comenzar([], azarFijo), PartidaImposible);
});

test('la partida es inmutable: responder devuelve una nueva, no muta la anterior', () => {
  const p = comenzar(bancoFalso(), azarFijo);
  const antes = { ...p, elegidas: [...p.elegidas] };
  const q = mal(p);
  assert.equal(p.vidas, antes.vidas, 'la partida original no cambio');
  assert.equal(p.elegidas.length, 0);
  assert.equal(q.vidas, 2);
  assert.equal(q.elegidas.length, 1);
});

test('las opciones vienen barajadas: la correcta no cae siempre primera', () => {
  // El defecto que documenta `barajarOpciones` en ronda.ts: 25 de 30 items tenian la
  // correcta primera, y tocando siempre arriba se sacaba 83% sin saber nada. La partida
  // por vidas hereda el arreglo, y conviene que un test lo diga.
  let primeras = 0;
  const vueltas = 40;
  for (let i = 0; i < vueltas; i++) {
    const p = comenzar(bancoFalso(), () => (i * 7919) % 1000 / 1000);
    if (actual(p)!.opciones[0]!.correcta) primeras++;
  }
  assert.ok(primeras < vueltas, `la correcta cayo primera en las ${vueltas} vueltas`);
});
