import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  sortearPartida,
  resolverCuadrante,
  disposicion,
  relacion,
  PartidaImposible,
  type Banco,
  type Item,
  type Polo,
} from './partida.ts';

/** Azar determinista: sin semilla fija, un fallo de sorteo no se puede reproducir. */
function azarSemilla(semilla: number): () => number {
  // La semilla se mezcla antes de arrancar: con semillas seguidas (0, 1, 2…) el primer número
  // de un generador lineal sale casi igual en todas, y el primer barajado de la noche —qué eje
  // va primero— salía siempre para el mismo lado. El motor no tenía nada; el azar de prueba, sí.
  let s = Math.imul((semilla ^ 0x9e3779b9) >>> 0, 0x85ebca6b) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const BANCO = JSON.parse(readFileSync('src/data/dos-ejes.json', 'utf-8')) as Banco;

const MOMENTOS = ['previa', 'ida', 'vereda', 'adentro', 'vuelta'].map((id) => ({ id, nombre: id, canta: id }));

function item(id: string, eje: Item['eje'], momento: string, estado = 'listo'): Item {
  const [a, b]: [Polo, Polo] = eje === 'luz-oscuridad' ? ['luz', 'oscuridad'] : ['orden', 'caos'];
  return {
    id,
    eje,
    momento,
    enunciado: `Enunciado ${id}`,
    opciones: [
      { texto: 'A', polo: a },
      { texto: 'B', polo: b },
    ],
    estado,
  };
}

/** Un banco de juguete con `n` ítems por celda: la forma, sin el contenido. */
function sintetico(n = 3): Banco {
  const items: Item[] = [];
  for (const m of MOMENTOS) {
    for (const eje of ['luz-oscuridad', 'orden-caos'] as const) {
      for (let k = 0; k < n; k++) items.push(item(`${m.id}-${eje}-${k}`, eje, m.id));
    }
  }
  return { preguntasPorEje: 5, momentos: MOMENTOS, cuadrantes: BANCO.cuadrantes, items };
}

/* ------------------------------------------------------------------
   El sorteo de la noche (`D-57` punto 1, `CTR-08` v2).
   ------------------------------------------------------------------ */

test('la noche sirve un ítem de cada eje por momento, en el orden de la noche', () => {
  for (const banco of [sintetico(), BANCO]) {
    for (let s = 0; s < 50; s++) {
      const ronda = sortearPartida(banco, azarSemilla(s));
      assert.equal(ronda.length, banco.preguntasPorEje * 2);
      banco.momentos.forEach((m, k) => {
        const par = ronda.slice(k * 2, k * 2 + 2);
        assert.deepEqual(par.map((i) => i.momento), [m.id, m.id], `semilla ${s}: el momento ${k} no es ${m.id}`);
        assert.deepEqual(par.map((i) => i.eje).sort(), ['luz-oscuridad', 'orden-caos'], `semilla ${s}, ${m.id}`);
      });
    }
  }
});

test('cada eje sale preguntasPorEje veces, que es impar', () => {
  for (let s = 0; s < 50; s++) {
    const ronda = sortearPartida(BANCO, azarSemilla(s));
    const porEje: Record<string, number> = {};
    for (const i of ronda) porEje[i.eje] = (porEje[i.eje] ?? 0) + 1;
    assert.deepEqual(porEje, { 'luz-oscuridad': BANCO.preguntasPorEje, 'orden-caos': BANCO.preguntasPorEje });
    assert.equal(BANCO.preguntasPorEje % 2, 1);
  }
});

test('el orden de los ejes dentro del momento se sortea: la primera no delata las diez', () => {
  // Con el ABAB de antes, sabiendo el eje de la primera se sabía el de todas.
  const primeros = new Set<string>();
  const patrones = new Set<string>();
  for (let s = 0; s < 60; s++) {
    const ronda = sortearPartida(sintetico(), azarSemilla(s));
    primeros.add(ronda[0]!.eje);
    patrones.add(ronda.map((i) => i.eje[0]).join(''));
  }
  assert.equal(primeros.size, 2);
  assert.ok(patrones.size > 10, `solo ${patrones.size} patrones de ejes en 60 noches`);
});

test('nunca tres seguidas del mismo eje', () => {
  for (let s = 0; s < 50; s++) {
    const ronda = sortearPartida(BANCO, azarSemilla(s));
    for (let i = 2; i < ronda.length; i++) {
      const tres = new Set([ronda[i - 2]!.eje, ronda[i - 1]!.eje, ronda[i]!.eje]);
      assert.ok(tres.size > 1, `semilla ${s}: tres seguidas del mismo eje en la posición ${i}`);
    }
  }
});

test('ninguna noche repite un ítem', () => {
  for (let s = 0; s < 50; s++) {
    const ronda = sortearPartida(BANCO, azarSemilla(s));
    assert.equal(new Set(ronda.map((i) => i.id)).size, ronda.length, `semilla ${s}`);
  }
});

test('otra noche no repite escenas mientras haya frescas (BR-37)', () => {
  // Tres por celda: tres noches seguidas sin repetir nada, y la cuarta vuelve a empezar.
  for (const banco of [sintetico(3), BANCO]) {
    const vistos = new Set<string>();
    for (let noche = 0; noche < 3; noche++) {
      const ronda = sortearPartida(banco, azarSemilla(100 + noche), vistos);
      for (const i of ronda) {
        assert.ok(!vistos.has(i.id), `noche ${noche + 1}: ${i.id} ya había salido`);
        vistos.add(i.id);
      }
    }
    // La cuarta no falla: con las celdas agotadas toma de todas.
    assert.equal(sortearPartida(banco, azarSemilla(7), vistos).length, banco.preguntasPorEje * 2);
  }
});

test('una celda vacía falla ruidoso, no sirve una noche coja', () => {
  const banco = sintetico();
  const sinVuelta: Banco = {
    ...banco,
    items: banco.items.filter((i) => !(i.momento === 'vuelta' && i.eje === 'orden-caos')),
  };
  assert.throws(() => sortearPartida(sinVuelta, azarSemilla(1)), PartidaImposible);
});

test('si los momentos no son tantos como preguntasPorEje, tira: un eje par podría empatar', () => {
  const banco = sintetico();
  assert.throws(() => sortearPartida({ ...banco, preguntasPorEje: 3 }, azarSemilla(1)), PartidaImposible);
});

test('un ítem en borrador o retirado no entra a la noche', () => {
  const banco = sintetico(1);
  const items = [...banco.items, item('B-1', 'luz-oscuridad', 'previa', 'borrador'), item('R-1', 'luz-oscuridad', 'previa', 'retirado')];
  for (let s = 0; s < 20; s++) {
    const ronda = sortearPartida({ ...banco, items }, azarSemilla(s));
    assert.ok(!ronda.some((i) => i.id === 'B-1' || i.id === 'R-1'));
  }
});

test('las opciones se barajan: tocar siempre la primera no fija el resultado', () => {
  const primeros = new Set<string>();
  for (let s = 0; s < 40; s++) {
    for (const i of sortearPartida(BANCO, azarSemilla(s))) primeros.add(i.opciones[0]!.polo);
  }
  assert.equal(primeros.size, 4, `solo aparecieron ${[...primeros].join(', ')} como primera opción`);
});

/* ------------------------------------------------------------------
   El resultado: una identidad, no un puntaje.
   ------------------------------------------------------------------ */

test('resolverCuadrante toma la mayoría de cada eje', () => {
  const elegidos: Polo[] = ['luz', 'luz', 'luz', 'oscuridad', 'oscuridad', 'orden', 'orden', 'orden', 'caos', 'caos'];
  const r = resolverCuadrante(BANCO, elegidos);
  const esperado = BANCO.cuadrantes.find((c) => c.luzOscuridad === 'luz' && c.ordenCaos === 'orden')!;
  assert.equal(r.id, esperado.id);
  assert.equal(r.nombre, esperado.nombre);
});

test('los cuatro cuadrantes salen de una noche real', () => {
  // Una noche de verdad, cinco por eje: la elección se hace sobre lo que el sorteo sirvió.
  const vistos = new Set<string>();
  for (const [lo, oc] of [
    ['luz', 'orden'],
    ['luz', 'caos'],
    ['oscuridad', 'orden'],
    ['oscuridad', 'caos'],
  ] as const) {
    const ronda = sortearPartida(BANCO, azarSemilla(lo.length * 7 + oc.length));
    const elegidos = ronda.map((i) => i.opciones.find((o) => o.polo === lo || o.polo === oc)!.polo);
    const r = resolverCuadrante(BANCO, elegidos);
    vistos.add(r.id);
    const c = BANCO.cuadrantes.find((x) => x.id === r.id)!;
    assert.deepEqual([c.luzOscuridad, c.ordenCaos], [lo, oc]);
  }
  assert.equal(vistos.size, 4);
});

test('el resultado no devuelve ningún número: US-06 criterio 3 desde el tipo', () => {
  // Si alguna vez alguien agrega el conteo acá, la pantalla lo va a poder mostrar y el test de
  // identidad se convierte en un puntaje. Que falle antes.
  const ronda = sortearPartida(BANCO, azarSemilla(3));
  const r = resolverCuadrante(BANCO, ronda.map((i) => i.opciones[0]!.polo));
  assert.deepEqual(Object.keys(r).sort(), ['bajada', 'id', 'nombre']);
  for (const v of Object.values(r)) assert.equal(typeof v, 'string');
});

/* ------------------------------------------------------------------
   La grilla de dos por dos y el contraste (`D-57` puntos 7 y 11).
   ------------------------------------------------------------------ */

test('la grilla pone la tuya primero, y ninguna manera queda arriba para todos', () => {
  const primeras = new Set<string>();
  for (const c of BANCO.cuadrantes) {
    const { celdas, renglones, columnas } = disposicion(BANCO, c.id);
    const [tuya, alLado, abajo, enDiagonal] = celdas;
    assert.equal(tuya.id, c.id);
    // Al lado: tu mismo renglón, o sea tu polo de luz-oscuridad.
    assert.equal(alLado.luzOscuridad, c.luzOscuridad);
    assert.notEqual(alLado.ordenCaos, c.ordenCaos);
    // Abajo: tu misma columna, o sea tu polo de orden-caos.
    assert.equal(abajo.ordenCaos, c.ordenCaos);
    assert.notEqual(abajo.luzOscuridad, c.luzOscuridad);
    // En diagonal: la que no comparte nada.
    assert.notEqual(enDiagonal.luzOscuridad, c.luzOscuridad);
    assert.notEqual(enDiagonal.ordenCaos, c.ordenCaos);
    assert.equal(new Set(celdas.map((x) => x.id)).size, 4);
    assert.deepEqual(renglones, [c.luzOscuridad, enDiagonal.luzOscuridad]);
    assert.deepEqual(columnas, [c.ordenCaos, enDiagonal.ordenCaos]);
    primeras.add(celdas[0].id);
  }
  assert.equal(primeras.size, 4, 'cada manera tiene que poder ser la primera');
});

test('la relación con el amigo es simétrica y cubre los cuatro casos', () => {
  const vistas = new Set<string>();
  for (const a of BANCO.cuadrantes) {
    for (const b of BANCO.cuadrantes) {
      const r = relacion(BANCO, a.id, b.id);
      assert.equal(r, relacion(BANCO, b.id, a.id), `${a.id} y ${b.id}: depende del orden`);
      if (a.id === b.id) assert.equal(r, 'misma');
      vistas.add(r);
    }
  }
  assert.deepEqual([...vistas].sort(), ['luz-oscuridad', 'misma', 'opuesta', 'orden-caos']);
});

test('la grilla y la línea de contraste dicen lo mismo (CTR-08 v2.5)', () => {
  // Se calculan por caminos distintos —una busca por polos, la otra los compara—. Si una
  // cambia sola, la celda punteada y la línea de abajo se contradicen en la misma pantalla.
  for (const c of BANCO.cuadrantes) {
    const { celdas } = disposicion(BANCO, c.id);
    assert.deepEqual(
      celdas.map((x) => relacion(BANCO, c.id, x.id)),
      ['misma', 'luz-oscuridad', 'orden-caos', 'opuesta'],
      c.id,
    );
  }
});

test('un id que no está en el banco no pinta nada: tira', () => {
  assert.throws(() => disposicion(BANCO, 'CU-9'), PartidaImposible);
  assert.throws(() => relacion(BANCO, 'CU-1', 'nada'), PartidaImposible);
});
