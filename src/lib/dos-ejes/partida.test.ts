import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  sortearPartida,
  resolverCuadrante,
  PartidaImposible,
  type Banco,
  type Item,
  type Polo,
} from './partida.ts';

/** Azar determinista: sin semilla fija, un fallo de sorteo no se puede reproducir. */
function azarSemilla(semilla: number): () => number {
  let s = semilla >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const BANCO = JSON.parse(readFileSync('src/data/dos-ejes.json', 'utf-8')) as Banco;

function item(id: string, eje: Item['eje'], a: Polo, b: Polo): Item {
  return {
    id,
    eje,
    enunciado: `Enunciado ${id}`,
    opciones: [
      { texto: 'A', polo: a },
      { texto: 'B', polo: b },
    ],
    estado: 'listo',
  };
}

test('la partida sirve exactamente preguntasPorEje de cada eje', () => {
  for (let s = 0; s < 50; s++) {
    const ronda = sortearPartida(BANCO, azarSemilla(s));
    const porEje: Record<string, number> = {};
    for (const i of ronda) porEje[i.eje] = (porEje[i.eje] ?? 0) + 1;
    assert.deepEqual(porEje, {
      'luz-oscuridad': BANCO.preguntasPorEje,
      'orden-caos': BANCO.preguntasPorEje,
    });
  }
});

test('los dos ejes se intercalan: nunca tres seguidas del mismo', () => {
  // Cinco preguntas seguidas del mismo eje se leen como la misma pregunta cinco veces.
  for (let s = 0; s < 50; s++) {
    const ronda = sortearPartida(BANCO, azarSemilla(s));
    for (let i = 2; i < ronda.length; i++) {
      const tres = new Set([ronda[i - 2]!.eje, ronda[i - 1]!.eje, ronda[i]!.eje]);
      assert.ok(tres.size > 1, `semilla ${s}: tres seguidas del mismo eje en la posicion ${i}`);
    }
  }
});

test('ninguna partida repite un item', () => {
  for (let s = 0; s < 50; s++) {
    const ronda = sortearPartida(BANCO, azarSemilla(s));
    assert.equal(new Set(ronda.map((i) => i.id)).size, ronda.length, `semilla ${s}`);
  }
});

test('dos partidas seguidas no son identicas', () => {
  const a = sortearPartida(BANCO, azarSemilla(1)).map((i) => i.id);
  const b = sortearPartida(BANCO, azarSemilla(2)).map((i) => i.id);
  assert.notDeepEqual(a, b);
});

test('un pozo corto falla ruidoso, no sirve una partida corta', () => {
  // Es la regla que cierra el ultimo agujero del empate: con 4 preguntas en un eje, un
  // jugador parejo empata y el juego no tiene que mostrar.
  const corto: Banco = {
    preguntasPorEje: 5,
    cuadrantes: BANCO.cuadrantes,
    items: [
      ...Array.from({ length: 5 }, (_, n) => item(`A-${n}`, 'luz-oscuridad', 'luz', 'oscuridad')),
      ...Array.from({ length: 4 }, (_, n) => item(`B-${n}`, 'orden-caos', 'orden', 'caos')),
    ],
  };
  assert.throws(() => sortearPartida(corto, azarSemilla(1)), PartidaImposible);
});

test('un item en borrador no entra a la partida', () => {
  const conBorrador: Banco = {
    preguntasPorEje: 2,
    cuadrantes: BANCO.cuadrantes,
    items: [
      item('L-1', 'luz-oscuridad', 'luz', 'oscuridad'),
      item('L-2', 'luz-oscuridad', 'luz', 'oscuridad'),
      { ...item('L-3', 'luz-oscuridad', 'luz', 'oscuridad'), estado: 'borrador' },
      item('O-1', 'orden-caos', 'orden', 'caos'),
      item('O-2', 'orden-caos', 'orden', 'caos'),
    ],
  };
  const ronda = sortearPartida(conBorrador, azarSemilla(4));
  assert.ok(!ronda.some((i) => i.id === 'L-3'));
});

test('las opciones se barajan: tocar siempre la primera no fija el resultado', () => {
  // En el JSON los 20 items tienen la opcion luz/orden primera. Sin barajado, tocar
  // siempre arriba daria siempre el mismo cuadrante.
  const primeros = new Set<string>();
  for (let s = 0; s < 40; s++) {
    for (const i of sortearPartida(BANCO, azarSemilla(s))) primeros.add(i.opciones[0]!.polo);
  }
  assert.ok(primeros.size >= 4, `solo aparecieron ${[...primeros].join(', ')} como primera opcion`);
});

test('resolverCuadrante toma la mayoria de cada eje', () => {
  const elegidos: Polo[] = ['luz', 'luz', 'luz', 'oscuridad', 'oscuridad', 'orden', 'orden', 'orden', 'caos', 'caos'];
  const r = resolverCuadrante(BANCO, elegidos);
  const esperado = BANCO.cuadrantes.find((c) => c.luzOscuridad === 'luz' && c.ordenCaos === 'orden')!;
  assert.equal(r.id, esperado.id);
  assert.equal(r.nombre, esperado.nombre);
});

test('los cuatro cuadrantes son alcanzables desde una eleccion real', () => {
  const combinaciones: [Polo, Polo][] = [
    ['luz', 'orden'],
    ['luz', 'caos'],
    ['oscuridad', 'orden'],
    ['oscuridad', 'caos'],
  ];
  const vistos = new Set<string>();
  for (const [lo, oc] of combinaciones) {
    const elegidos: Polo[] = [...Array<Polo>(3).fill(lo), ...Array<Polo>(3).fill(oc)];
    vistos.add(resolverCuadrante(BANCO, elegidos).id);
  }
  assert.equal(vistos.size, 4, `solo se alcanzaron ${vistos.size} cuadrantes`);
});

test('el resultado no devuelve ningun numero: US-06 criterio 3 desde el tipo', () => {
  // Si alguna vez alguien agrega el conteo aca, la pantalla lo va a poder mostrar y el
  // test de identidad se convierte en un puntaje. Que falle antes.
  const r = resolverCuadrante(BANCO, ['luz', 'luz', 'orden', 'orden']);
  assert.deepEqual(Object.keys(r).sort(), ['bajada', 'id', 'nombre']);
  for (const v of Object.values(r)) assert.equal(typeof v, 'string');
});
