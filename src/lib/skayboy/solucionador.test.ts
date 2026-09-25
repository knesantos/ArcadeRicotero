/**
 * El solucionador (`T-266`): la máquina que juega sola sobre `mundo.ts`.
 *
 * Las salas de prueba son chicas a propósito —el archivo entero tiene que correr en pocos
 * segundos— y cada una existe para un caso: la holgada, el hueco al límite del alcance, la
 * puerta tapiada, los molinetes que rechazan a uno y no al otro. Salvo `NIV-01`, ninguna es
 * un nivel del juego.
 *
 * Los casos marcados 🔴 son guardas: cosas que existen para que algo **no** pase. Cada una
 * trae su control, porque una guarda que nunca se vio en rojo no es una guarda.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { terrenoEn, type Banco, type CompuertaDelNivel, type IdPersonaje, type MecanismoDelNivel, type Nivel } from './niveles.ts';
import {
  CUERPO_ALTO,
  CUERPO_ANCHO,
  CUADRO_SEG,
  ALCANCE_HUECO_TILES,
  PERSONAJES,
  QUIETO,
  TILE,
  crearMundo,
  paso,
  type Mandos,
  type Mundo,
} from './mundo.ts';
import {
  CAMPOS_DE_LA_CAJA,
  CAMPOS_DEL_CUERPO,
  CAMPOS_DEL_MUNDO,
  HOLGURA,
  claveDeEstado,
  resolverDeADos,
  resolverSolo,
  robustecer,
  type SinSolucion,
  type Solucion,
} from './solucionador.ts';
import {
  TOPE_TOLERANCIA,
  clonarMundo,
  columnasConTeclas,
  compactar,
  enElPiso,
  esCompacta,
  escribirTraza,
  exigirTraza,
  expandir,
  largoDe,
  leerTraza,
  repetir,
  tolerancia,
  type Traza,
} from './soluciones.ts';

const BANCO: Banco = JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as Banco;
const NIVEL_1 = BANCO.niveles[0];

/** Una sala de prueba con la leyenda de verdad, como en `mundo.test.ts`. */
function sala(
  grilla: string[],
  mecanismos: readonly MecanismoDelNivel[] = [],
  compuertas: readonly CompuertaDelNivel[] = [],
): { banco: Banco; nivel: Nivel } {
  const nivel: Nivel = {
    id: 'NIV-PRUEBA',
    nombre: '',
    escalon: 1,
    estado: 'borrador',
    grilla,
    mecanismos,
    compuertas,
    verificaciones: { deDos: false },
  };
  return { banco: { ...BANCO, niveles: [nivel] }, nivel };
}

/** Las dos puertas contra la pared y nada en el camino: todo aguanta. */
const HOLGADA = sala([
  '#########',
  '#.......#',
  '#.......#',
  '#A.1.2.B#',
  '#########',
]);

/**
 * Un hueco de `ALCANCE_HUECO_TILES` entre dos plataformas —el mismo de `mundo.test.ts`—, con
 * un molinete de los dos en el fondo: el que cae, vuelve. Es el único camino de Skayboy.
 */
const HUECO = sala([
  '##############',
  '#............#',
  '#............#',
  '#............#',
  '#B21........A#',
  '######...#####',
  '######XXX#####',
  '##############',
]);

/** La puerta de Poligirl está encerrada entre paredes que llegan al techo. */
const TAPIADA = sala([
  '##########',
  '#......#.#',
  '#......#.#',
  '#A.1.2.#B#',
  '##########',
]);

/**
 * Cada uno cruza lo que rechazaría al otro: Poligirl pasa por los `C` (devuelven a Skayboy)
 * y Skayboy por los `I` (devuelven a Poligirl). El que espera, espera parado.
 */
const MOLINETES = sala([
  '###############',
  '#.............#',
  '#.............#',
  '#B.CCC21.III.A#',
  '###############',
]);

/**
 * La puerta de Skayboy está en una cornisa de dos tiles. Soltarlo en el aire, arriba de la
 * cornisa, le ahorraría a la traza de uno los cuadros de la caída: es la tentación exacta
 * que la regla de cambiar solo en el piso tiene que resistir.
 */
const CORNISA = sala([
  '##########',
  '#........#',
  '#........#',
  '#........#',
  '#.....A..#',
  '#....###.#',
  '#B21.....#',
  '##########',
]);

/**
 * Una entrada dibujada en el aire: Poligirl aparece cuatro filas arriba del piso, sin nada
 * abajo. Ninguna regla de `CTR-16.5` lo prohíbe, y `crearMundo()` la crea con `enSuelo` en
 * `true`, así que para la búsqueda parece apoyada hasta que el primer `paso()` la hace caer.
 * `FLOTA_SKAYBOY` es la misma sala con los dos cambiados de lugar.
 */
const FLOTA_POLIGIRL = sala([
  '###############',
  '#.............#',
  '#.............#',
  '#.......2.....#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#A....1......B#',
  '###############',
]);
const FLOTA_SKAYBOY = sala(FLOTA_POLIGIRL.nivel.grilla.map((r) => r.replace('2', '*').replace('1', '2').replace('*', '1')));

/**
 * Las dos entradas en el aire, en la misma fila. Acá no hay orden que sirva: el que juega
 * primero, juegue quien juegue, lo hace mientras el otro cae. La única manera de empezar
 * una traza de uno es no tocar nada hasta que los dos aterricen, y la búsqueda solo la
 * tiene porque en la raíz prueba `QUIETOS`.
 */
const DOS_EN_EL_AIRE = sala([
  '###############',
  '#.............#',
  '#.............#',
  '#...1...2.....#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#A...........B#',
  '###############',
]);

const QUIETOS: Mandos = { skayboy: QUIETO, poligirl: QUIETO };
const saltaSkayboy: Mandos = { skayboy: { ...QUIETO, saltar: true }, poligirl: QUIETO };

/**
 * Cuántos cuadros con el mando `m`, después de jugar `antes`, hasta que se cumple `listo` —ese
 * cuadro incluido—. Es cómo una prueba nombra un largo **sin escribirlo**: si alguien afina la
 * física, el número se vuelve a contar solo (`ADR-09.4`). Con tope, para que una sala rota se
 * vea como un rojo y no como una prueba colgada.
 */
function cuadrosHasta(
  banco: Banco,
  nivel: Nivel,
  antes: Traza,
  m: Mandos,
  listo: (mundo: Mundo, sucesos: ReturnType<typeof paso>) => boolean,
  tope = 600,
): number {
  const mundo = crearMundo(banco, nivel);
  for (const c of expandir(antes)) paso(mundo, c, CUADRO_SEG);
  for (let n = 1; n <= tope; n++) {
    if (listo(mundo, paso(mundo, m, CUADRO_SEG))) return n;
  }
  throw new Error(`pasaron ${tope} cuadros y no llegó a lo que la prueba esperaba`);
}

function resuelta(s: Solucion | SinSolucion): Solucion {
  assert.ok(s.tipo === 'solucion', `no se resolvió: ${JSON.stringify(s)}`);
  return s;
}

/** Cada solución se busca una vez: varias pruebas miran la misma. */
function unaVez<T>(calcular: () => T): () => T {
  let valor: { v: T } | undefined;
  return () => (valor ??= { v: calcular() }).v;
}

const deUno = {
  nivel1: unaVez(() => resuelta(resolverSolo(BANCO, NIVEL_1))),
  holgada: unaVez(() => resuelta(resolverSolo(HOLGADA.banco, HOLGADA.nivel))),
  hueco: unaVez(() => resuelta(resolverSolo(HUECO.banco, HUECO.nivel))),
  molinetes: unaVez(() => resuelta(resolverSolo(MOLINETES.banco, MOLINETES.nivel))),
};

/** Las celdas que toca la caja de un cuerpo, como las mira `mundo.ts`. */
function tipoDeLoQueToca(banco: Banco, nivel: Nivel, mundo: Mundo, id: IdPersonaje): string[] {
  const c = mundo.cuerpos[id];
  const tipos: string[] = [];
  for (let fila = Math.floor(c.y / TILE); fila <= Math.floor((c.y + CUERPO_ALTO - 0.001) / TILE); fila++) {
    for (let columna = Math.floor(c.x / TILE); columna <= Math.floor((c.x + CUERPO_ANCHO - 0.001) / TILE); columna++) {
      const renglon = nivel.grilla[fila] ?? '';
      const t = terrenoEn(banco, nivel, { columna, fila });
      tipos.push(t?.tipo === 'molinete' ? renglon[columna] : (t?.tipo ?? 'afuera'));
    }
  }
  return tipos;
}

/* -----------------------------------------------------------------------------------------
   NIV-01, de las dos maneras
   ----------------------------------------------------------------------------------------- */

test('NIV-01 se resuelve de uno y de a dos, y cada traza gana al repetirla con la física entera', () => {
  const uno = deUno.nivel1();
  const dos = resuelta(resolverDeADos(BANCO, NIVEL_1, { deUno: uno }));
  for (const s of [uno, dos]) {
    for (const traza of [s.traza, s.minima.traza]) {
      const r = repetir(BANCO, NIVEL_1, traza);
      assert.ok(r.gana, `la de ${s.modo} no gana`);
      assert.equal(r.sobrantes, 0, 'termina en el cuadro que gana');
      assert.equal(r.cuadros, largoDe(traza));
    }
  }
  assert.equal(uno.modo, 'uno');
  assert.equal(dos.modo, 'dos');
  // De a dos, cada uno camina lo suyo al mismo tiempo: dura lo que el más largo, no la suma.
  assert.ok(dos.minima.cuadros < uno.minima.cuadros, `${dos.minima.cuadros} contra ${uno.minima.cuadros}`);
  assert.ok(dos.cuadros <= uno.cuadros);
});

test('la de a dos por solape dura lo mismo que buscarla con las dos columnas a la vez', () => {
  /*
   * Es el control de la semántica elegida para la de a dos. En `NIV-01` los dos recorridos
   * no se tocan, así que solapar los turnos de la de uno tiene que dar lo mismo que la
   * búsqueda conjunta, que es exacta. Si el solape arrancara el segundo turno un cuadro
   * tarde —pasó, por un tope que solo tenía sentido para el turno siguiente—, esto lo ve.
   */
  const solape = resuelta(resolverDeADos(BANCO, NIVEL_1, { deUno: deUno.nivel1(), robustecer: false }));
  const conjunta = resuelta(resolverDeADos(BANCO, NIVEL_1, { metodo: 'conjunta', robustecer: false }));
  assert.equal(solape.metodo, 'solape');
  assert.equal(conjunta.metodo, 'conjunta');
  assert.equal(solape.minima.cuadros, conjunta.minima.cuadros);
});

/* -----------------------------------------------------------------------------------------
   BR-25 (b), (c) y (d), sobre la traza de uno
   ----------------------------------------------------------------------------------------- */

test('🔴 en la de uno nunca hay dos columnas en el mismo cuadro, y el que espera ni se mueve ni vuelve', () => {
  const casos: [string, Banco, Nivel, Solucion][] = [
    ['NIV-01', BANCO, NIVEL_1, deUno.nivel1()],
    ['molinetes', MOLINETES.banco, MOLINETES.nivel, deUno.molinetes()],
    ['hueco', HUECO.banco, HUECO.nivel, deUno.hueco()],
  ];
  for (const [nombre, banco, nivel, s] of casos) {
    for (const traza of [s.traza, s.minima.traza]) {
      const r = exigirTraza(banco, nivel, traza, 'uno');
      assert.equal(r.maxColumnasConTeclas, 1, `${nombre}: una columna por cuadro`);
      assert.equal(r.cambiosSinPiso, 0, `${nombre}: se cambia de columna con los dos en el piso`);
      assert.ok(r.cambiosDeColumna >= 1, `${nombre}: control — la traza sí cambia de columna`);
      assert.deepEqual(r.vueltas, { skayboy: 0, poligirl: 0 }, `${nombre}: nadie vuelve a la entrada`);

      // Y a mano, cuadro por cuadro: el que no tiene teclas no se mueve ni un píxel.
      const mundo = crearMundo(banco, nivel);
      for (const m of expandir(traza)) {
        const antes = PERSONAJES.map((id) => ({ x: mundo.cuerpos[id].x, y: mundo.cuerpos[id].y }));
        const conTeclas = columnasConTeclas(m);
        paso(mundo, m, CUADRO_SEG);
        PERSONAJES.forEach((id, i) => {
          if (conTeclas.length === 0 || conTeclas.includes(id)) return;
          assert.deepEqual({ x: mundo.cuerpos[id].x, y: mundo.cuerpos[id].y }, antes[i], `${nombre}: ${id} se movió esperando`);
        });
      }
    }
  }
});

test('🔴 con cambios libres tampoco se suelta a nadie en el aire, y en-hitos no pierde nada', () => {
  /*
   * Con `'en-hitos'` cada cambio de columna pasa en una puerta, que ya es el piso, así que
   * las pruebas de arriba no ven si la búsqueda exige los dos apoyados. Con `'libres'` sí se
   * ve: sin esa exigencia, la de uno de esta sala suelta a Skayboy volando sobre la cornisa
   * —se probó en una copia, y el solucionador tiró por su propia verificación—.
   */
  const { banco, nivel } = CORNISA;
  const libres = resuelta(resolverSolo(banco, nivel, { cambios: 'libres', robustecer: false }));
  const r = exigirTraza(banco, nivel, libres.traza, 'uno');
  assert.equal(r.cambiosSinPiso, 0);
  assert.ok(r.cambiosDeColumna >= 1, 'control: sí cambia de columna');
  assert.ok(r.sucesos.saltos.skayboy >= 1, 'control: sí salta a la cornisa');
  // Y el filtro de hitos no le saca nada a un nivel sin mecanismos: no dura más. No se pide que
  // duren lo mismo: las dos búsquedas son aproximadas y la igualdad era una coincidencia de la
  // física de hoy (34 y 34 a VELOCIDAD 88; 31 contra 33 a 96,8; 38 contra 39 a 79,2, T-267).
  const enHitos = resuelta(resolverSolo(banco, nivel, { robustecer: false }));
  assert.ok(
    enHitos.minima.cuadros <= libres.minima.cuadros,
    `en-hitos dura ${enHitos.minima.cuadros} cuadros y libres ${libres.minima.cuadros}: el filtro perdió un camino`,
  );
  assert.ok(enHitos.explorados <= libres.explorados, `${enHitos.explorados} contra ${libres.explorados} nodos`);
});

test('🔴 en el piso no es enSuelo: con un salto guardado, el que se suelta salta solo', () => {
  /*
   * Es el porqué de `enElPiso()`. Un toque de saltar un poco antes de aterrizar queda
   * guardado (el perdón temprano), y si justo al aterrizar se suelta esa columna, el cuerpo
   * salta en el cuadro siguiente sin nadie encima. Las búsquedas de hoy no llegan a ese
   * estado —descartan los saltos que no saltan—, así que la regla solo se ve en rojo acá.
   */
  const mundo = crearMundo(HOLGADA.banco, HOLGADA.nivel);
  const s = mundo.cuerpos.skayboy;
  assert.ok(enElPiso(s), 'control: parado en su entrada, está en el piso');
  s.saltoGuardado = 0.05;
  assert.ok(s.enSuelo && !enElPiso(s), 'apoyado, pero con un salto pendiente');
  const sucesos = paso(mundo, { skayboy: QUIETO, poligirl: QUIETO }, CUADRO_SEG);
  assert.deepEqual(sucesos, [{ tipo: 'salto', quien: 'skayboy' }], 'saltó sin un dedo encima');
});

test('🔴 una entrada en el aire: la de uno existe, y la búsqueda la encuentra en vez de tirar', () => {
  /*
   * La revisión de T-266 encontró que con esta sala `resolverSolo()` tiraba «defecto del
   * solucionador: … poligirl esperaba y se movió»: la búsqueda elegía la primera columna sin
   * mirar si el otro estaba apoyado de verdad, y nada vigilaba la regla 7 de `CTR-18.6` cuadro a
   * cuadro. Ahora la búsqueda descarta la jugada en la que el que espera se mueve, y el rojo de
   * esta prueba es volver a tirar, o devolver una traza que no pasa `exigirTraza()`.
   */
  for (const [nombre, { banco, nivel }, flota] of [
    ['Poligirl en el aire', FLOTA_POLIGIRL, 'poligirl'],
    ['Skayboy en el aire', FLOTA_SKAYBOY, 'skayboy'],
  ] as const) {
    const s = resuelta(resolverSolo(banco, nivel));
    for (const traza of [s.traza, s.minima.traza]) {
      const r = exigirTraza(banco, nivel, traza, 'uno');
      assert.equal(r.movimientosDelQueEspera, 0, `${nombre}: el que espera no se mueve`);
      assert.ok(r.cambiosDeColumna >= 1, `${nombre}: control — la traza sí cambia de columna`);
    }
    assert.equal(resuelta(resolverDeADos(banco, nivel, { deUno: s })).modo, 'dos', `${nombre}: y de a dos también`);

    // Control: el orden que la búsqueda tuvo que evitar. El que está apoyado juega primero y el
    // que flota cae mientras tanto, con la otra columna apretada.
    const apoyado: IdPersonaje = flota === 'poligirl' ? 'skayboy' : 'poligirl';
    const corre = { ...QUIETO, derecha: true };
    const mandos: Mandos = apoyado === 'skayboy' ? { skayboy: corre, poligirl: QUIETO } : { skayboy: QUIETO, poligirl: corre };
    const mal = repetir(banco, nivel, [{ mandos, cuadros: 4 }]);
    assert.equal(mal.primerMovimientoDelQueEspera?.quien, flota, `${nombre}: control — ese orden mueve al que espera`);
  }

  /*
   * Las dos en el aire. Es la sala que ve la excepción de la poda 3 —`QUIETOS` en la raíz de
   * `buscar()`—, y sin mecanismos: sin esa jugada, la raíz solo ofrece jugadas de una columna,
   * todas mueven al que espera, la poda 5 las descarta, y la búsqueda contesta «no hay
   * solución» con un nodo explorado, para una sala que se pasa. Se probó en una copia.
   */
  const { banco, nivel } = DOS_EN_EL_AIRE;
  const s = resuelta(resolverSolo(banco, nivel));
  for (const traza of [s.traza, s.minima.traza]) {
    const r = exigirTraza(banco, nivel, traza, 'uno');
    assert.equal(r.movimientosDelQueEspera, 0, 'las dos en el aire: el que espera no se mueve');
    assert.ok(r.cambiosDeColumna >= 1, 'las dos en el aire: control — la traza sí cambia de columna');
  }
  const primera = s.minima.traza[0];
  assert.deepEqual(columnasConTeclas(primera.mandos), [], 'las dos en el aire: la mínima arranca sin teclas');
  assert.ok(primera.cuadros > 1, `las dos en el aire: y sin teclas cae unos cuadros, no uno (${primera.cuadros})`);
  assert.equal(resuelta(resolverDeADos(banco, nivel, { deUno: s })).modo, 'dos', 'las dos en el aire: y de a dos también');

  // Control: cualquier columna que arranque apretada mueve al otro, que cae mientras tanto.
  for (const juega of PERSONAJES) {
    const otro: IdPersonaje = juega === 'skayboy' ? 'poligirl' : 'skayboy';
    const corre = { ...QUIETO, derecha: true };
    const mandos: Mandos = juega === 'skayboy' ? { skayboy: corre, poligirl: QUIETO } : { skayboy: QUIETO, poligirl: corre };
    const mal = repetir(banco, nivel, [{ mandos, cuadros: 4 }]);
    assert.equal(mal.primerMovimientoDelQueEspera?.quien, otro, `las dos en el aire: control — si arranca ${juega}, se mueve ${otro}`);
  }
});

test('🔴 exigirTraza: el que espera se mueve mientras el otro juega, sin ningún cambio de columna en el aire', () => {
  /*
   * La regla 7 de `CTR-18.6` sola. Skayboy juega desde el cuadro cero mientras Poligirl, que
   * aparece en el aire, cae: no hay dos columnas en un cuadro, no hay cambio de columna con
   * nadie volando —cuando Poligirl toma la suya ya aterrizó—, nadie vuelve y la traza gana.
   * Lo único que está mal es que el que esperaba se movió. Si la regla 7 se apaga en
   * `exigirTraza()`, esta prueba no tira; la de `saltaYSuelta`, más abajo, sí, porque a esa
   * la caza el cambio en el aire.
   */
  const { banco, nivel } = FLOTA_POLIGIRL;
  const nadie = { skayboy: QUIETO, poligirl: QUIETO };
  const skay = { skayboy: { ...QUIETO, izquierda: true }, poligirl: QUIETO };
  const poli = { skayboy: QUIETO, poligirl: { ...QUIETO, derecha: true } };
  const hastaGanar = (antes: Traza): Traza => {
    const r = repetir(banco, nivel, [...antes, { mandos: poli, cuadros: 300 }]);
    assert.ok(r.gana, 'control: con Poligirl corriendo hasta el final, gana');
    return [...antes, { mandos: poli, cuadros: r.cuadros - largoDe(antes) }];
  };

  const mala = hastaGanar([{ mandos: skay, cuadros: 70 }]);
  const r = repetir(banco, nivel, mala);
  assert.ok(r.gana && r.sobrantes === 0, 'control: gana, en el último cuadro');
  assert.equal(r.cambiosSinPiso, 0, 'control: el cambio de columna es con las dos apoyadas');
  assert.equal(r.maxColumnasConTeclas, 1, 'control: una columna por cuadro');
  assert.throws(
    () => exigirTraza(banco, nivel, mala, 'uno'),
    (e: Error) =>
      /NIV-PRUEBA.*cuadro 0: poligirl esperaba y se movió de \(\d+(\.\d)?, \d+(\.\d)?\) a/.test(e.message) &&
      !/en el aire|no gana|volvió|sobra|dos columnas/.test(e.message),
  );
  // Y lo que la búsqueda usa para filtrar candidatas mira lo mismo: no se robustece.
  assert.throws(() => robustecer(banco, nivel, mala, { modo: 'uno' }), /no es de uno/);

  // Control: la misma traza, dejándola caer antes sin tocar nada, es de uno. Los cuadros sin
  // teclas no cuentan para la regla 7.
  const buena = hastaGanar([{ mandos: nadie, cuadros: 40 }, { mandos: skay, cuadros: 70 }]);
  assert.doesNotThrow(() => exigirTraza(banco, nivel, buena, 'uno'));
  assert.doesNotThrow(() => robustecer(banco, nivel, buena, { modo: 'uno', maxEvaluaciones: 2 }));
});

test('uno espera parado mientras el otro cruza lo que lo rechazaría a él (molinetes C e I)', () => {
  const { banco, nivel } = MOLINETES;
  const s = deUno.molinetes();
  const mundo = crearMundo(banco, nivel);
  const cruces = { poligirlPorC: 0, skayboyPorI: 0 };
  for (const m of expandir(s.traza)) {
    paso(mundo, m, CUADRO_SEG);
    const [conTeclas] = columnasConTeclas(m);
    if (conTeclas === 'poligirl' && tipoDeLoQueToca(banco, nivel, mundo, 'poligirl').includes('C')) {
      cruces.poligirlPorC++;
      assert.ok(mundo.cuerpos.skayboy.enSuelo, 'Skayboy espera en el piso');
    }
    if (conTeclas === 'skayboy' && tipoDeLoQueToca(banco, nivel, mundo, 'skayboy').includes('I')) {
      cruces.skayboyPorI++;
      assert.ok(mundo.cuerpos.poligirl.enSuelo, 'Poligirl espera en el piso');
    }
  }
  assert.ok(mundo.terminado);
  assert.ok(cruces.poligirlPorC > 0, 'Poligirl cruzó los C, que la dejan pasar a ella');
  assert.ok(cruces.skayboyPorI > 0, 'Skayboy cruzó los I, que lo dejan pasar a él');
  assert.deepEqual(repetir(banco, nivel, s.traza).vueltas, { skayboy: 0, poligirl: 0 });
});

/* -----------------------------------------------------------------------------------------
   Salas con mecanismos (T-272): la búsqueda sobre palancas, placas, compuertas y cajas
   ----------------------------------------------------------------------------------------- */

/**
 * **La sala de `CTR-16.10.1`**, tal cual la escribió el contrato: una placa que abre la primera
 * compuerta mientras algo la pisa, una caja al lado, y una palanca que abre la segunda. *"La caja
 * arriba de la placa es lo que deja pasar a los dos"*: es la segunda solución de `CTR-16.6`, que
 * era una frase (`alternativaSolo`) y acá la tiene que encontrar una máquina.
 */
const CAJA_SOBRE_PLACA = sala(
  [
    '###############',
    '#......#...#..#',
    '#......#...#..#',
    '#......#...#..#',
    '#......#...#..#',
    '#......|...|..#',
    '#......|...|..#',
    '#1.2n=.|./.|AB#',
    '###############',
  ],
  [
    { id: 'MEC-01', en: [5, 7], abre: ['COM-01'] },
    { id: 'MEC-02', en: [9, 7], abre: ['COM-02'] },
  ],
  [
    { id: 'COM-01', en: [7, 5] },
    { id: 'COM-02', en: [11, 5] },
  ],
);

/**
 * **Una palanca que Poligirl no alcanza**: entre ella y la palanca hay un infierno (`I`), que a
 * ella la devuelve y a Skayboy no. La palanca abre la compuerta de la puerta de Poligirl, y la de
 * Skayboy queda a la izquierda de la palanca: si vuelve caminando, la deja en reposo y la compuerta
 * se cierra (`CTR-16.10.2`). Que ella pase depende de que él se la abra.
 */
const PALANCA_DEL_OTRO = sala(
  [
    '###############',
    '#.............#',
    '#.............#',
    '#.............#',
    '#..........#..#',
    '#..........|..#',
    '#..........|..#',
    '#A1../.I.2.|B.#',
    '###############',
  ],
  [{ id: 'MEC-01', en: [5, 7], abre: ['COM-01'] }],
  [{ id: 'COM-01', en: [11, 5] }],
);

const conPiezas = {
  cajaSobrePlaca: unaVez(() => resuelta(resolverSolo(CAJA_SOBRE_PLACA.banco, CAJA_SOBRE_PLACA.nivel))),
  palanca: unaVez(() => resuelta(resolverSolo(PALANCA_DEL_OTRO.banco, PALANCA_DEL_OTRO.nivel))),
};

/** El primero que juega en una traza de uno: la columna de la primera corrida con teclas. */
function primeroEnJugar(traza: Traza): IdPersonaje {
  const corrida = traza.find((c) => columnasConTeclas(c.mandos).length > 0);
  assert.ok(corrida !== undefined, 'la traza no tiene ninguna tecla');
  return columnasConTeclas(corrida.mandos)[0];
}

test('resolverSolo resuelve la sala de CTR-16.10.1: la caja sobre la placa es la segunda solución de CTR-16.6, probada', () => {
  const { banco, nivel } = CAJA_SOBRE_PLACA;
  const s = conPiezas.cajaSobrePlaca();
  // Es de uno: las reglas 5 a 7 y 11 de CTR-18.6, las mismas que corre el build.
  const r = exigirTraza(banco, nivel, s.traza, 'uno');
  assert.ok(r.cambiosDeColumna >= 1, 'control: juegan los dos, uno por vez');

  // La caja tapa la placa: hay cuadros en que alguien está en la primera compuerta mientras la
  // placa la pisa la caja sola, sin nadie arriba.
  const mundo = crearMundo(banco, nivel);
  let tapada = 0;
  for (const m of expandir(s.traza)) {
    paso(mundo, m, CUADRO_SEG);
    const k = mundo.cajas[0];
    const cajaEnLaPlaca = k.estado === 'quieta' && k.columna === 5 && k.fila === 7;
    const nadieEnLaPlaca = PERSONAJES.every((id) => {
      const c = mundo.cuerpos[id];
      return !(c.enSuelo && Math.floor((c.x + CUERPO_ANCHO / 2) / TILE) === 5 && c.y + CUERPO_ALTO === 8 * TILE);
    });
    const alguienEnLaCompuerta = PERSONAJES.some((id) => {
      const c = mundo.cuerpos[id];
      return c.x < 8 * TILE && c.x + CUERPO_ANCHO > 7 * TILE;
    });
    if (cajaEnLaPlaca && nadieEnLaPlaca && alguienEnLaCompuerta) tapada++;
  }
  assert.ok(tapada > 0, 'nadie pasó la primera compuerta con la caja sola sobre la placa');

  // Y la paridad, contada con los sucesos del mundo: el primero que juega empuja la caja a la placa
  // y cruza la palanca, y el otro pasa por las dos compuertas que le abrió.
  const primero = primeroEnJugar(s.traza);
  assert.deepEqual(r.paridad, primero === 'skayboy' ? { skayboyAPoligirl: 2, poligirlASkayboy: 0 } : { skayboyAPoligirl: 0, poligirlASkayboy: 2 });
  // La de a dos también sale, y se mide sin grabarse (CTR-18.4).
  assert.equal(resuelta(resolverDeADos(banco, nivel, { deUno: s })).modo, 'dos');
});

test('resolverSolo resuelve una palanca que Poligirl no alcanza: Skayboy le abre paso y la paridad lo cuenta', () => {
  const { banco, nivel } = PALANCA_DEL_OTRO;
  const s = conPiezas.palanca();
  const r = exigirTraza(banco, nivel, s.traza, 'uno');
  assert.deepEqual(r.paridad, { skayboyAPoligirl: 1, poligirlASkayboy: 0 });
  assert.deepEqual(r.vueltas, { skayboy: 0, poligirl: 0 }, 'nadie tocó lo que lo rechaza');
  // La palanca quedó activa hasta el final: nadie la volvió a cruzar caminando hacia la izquierda.
  const mundo = crearMundo(banco, nivel);
  let activa = false;
  let volvioAReposo = false;
  for (const m of expandir(s.traza)) {
    paso(mundo, m, CUADRO_SEG);
    if (mundo.palancas[0].activa) activa = true;
    else if (activa && !mundo.cuerpos.poligirl.enPuerta) volvioAReposo = true;
  }
  assert.ok(activa && !volvioAReposo, 'la palanca tenía que quedar activa hasta que Poligirl pasara');
});

test('🔴 robustecer vuelve a mirar un borde quieto cuando otra jugada lo destraba: la sala de la caja aguanta más que cero', () => {
  /*
   * En la traza más corta, el salto que pasa por encima de la caja es un toque de un cuadro en el
   * primer cuadro del empujón: un cuadro antes no hay empujón, y demorado el toque desaparece. No
   * se puede correr para ningún lado, y el robustecedor lo marcaba quieto para siempre; cuando
   * otra jugada lo sostenía, tenía trece cuadros de ventana y nadie lo volvía a mirar. La traza se
   * grababa aguantando 0. Ahora, cada mejora destraba a todos.
   */
  const s = conPiezas.cajaSobrePlaca();
  assert.ok(s.tolerancia.minimo >= 4, `la sala de la caja aguanta ${s.tolerancia.minimo} cuadros`);
  const salto = s.tolerancia.bordes.find((b) => b.tecla === 'saltar' && b.sentido === 'aprieta' && b.columna === primeroEnJugar(s.traza));
  assert.ok(salto !== undefined && salto.antes > 0 && salto.despues > 0, 'el salto sobre la caja se corrió al medio de su ventana');
  // Control: la mínima, sin ensanchar, no aguanta nada.
  assert.equal(tolerancia(CAJA_SOBRE_PLACA.banco, CAJA_SOBRE_PLACA.nivel, s.minima.traza).minimo, 0);
});

/* -----------------------------------------------------------------------------------------
   Rojo que no cuelga
   ----------------------------------------------------------------------------------------- */

test('🔴 la puerta tapiada: contesta que no hay solución, recorriendo todo, dentro del presupuesto', () => {
  const r = resolverSolo(TAPIADA.banco, TAPIADA.nivel, { maxNodos: 20_000 });
  assert.equal(r.tipo, 'sin-solucion');
  assert.ok(r.tipo === 'sin-solucion');
  assert.equal(r.motivo, 'agotada', 'no se quedó sin presupuesto: recorrió todo y no hay manera');
  assert.ok(r.explorados > 0 && r.explorados < 20_000, `exploró ${r.explorados}`);
  // Control: la misma sala con la pared abierta sí tiene solución.
  const abierta = sala(TAPIADA.nivel.grilla.map((renglon) => renglon.replace('#B#', '.B#').replace('#.#', '..#')));
  assert.equal(resolverSolo(abierta.banco, abierta.nivel, { robustecer: false }).tipo, 'solucion');
});

test('🔴 el presupuesto se respeta: de nodos, y de tiempo con un reloj fingido', () => {
  const nodos = resolverSolo(BANCO, NIVEL_1, { maxNodos: 5 });
  assert.ok(nodos.tipo === 'sin-solucion');
  assert.equal(nodos.motivo, 'nodos');
  assert.equal(nodos.explorados, 5);

  // Cada vez que la búsqueda mira el reloj pasa un segundo: a la tercera mirada se pasó.
  let ahora = 0;
  const reloj = (): number => (ahora += 1_000);
  const tiempo = resolverSolo(TAPIADA.banco, TAPIADA.nivel, { maxMs: 2_500, reloj });
  assert.ok(tiempo.tipo === 'sin-solucion');
  assert.equal(tiempo.motivo, 'tiempo');
  assert.ok(tiempo.explorados < 1_000, `cortó al ver el reloj, no al agotar la sala (${tiempo.explorados})`);

  // Control: con presupuesto de sobra, lo mismo se resuelve.
  assert.equal(resolverSolo(BANCO, NIVEL_1, { maxNodos: 10_000, robustecer: false }).tipo, 'solucion');
});

/* -----------------------------------------------------------------------------------------
   La guarda que corre T-267 sobre cada traza grabada
   ----------------------------------------------------------------------------------------- */

test('🔴 exigirTraza: recortada un cuadro no gana, con uno de más tampoco pasa, y nombra el nivel', () => {
  const s = deUno.nivel1();
  assert.doesNotThrow(() => exigirTraza(BANCO, NIVEL_1, s.traza, 'uno'), 'control: la traza sana pasa');

  const cuadros = expandir(s.traza);
  // El "no gana" dice dónde quedó cada uno (CTR-18.6 regla 5): el que llegó, en su puerta; el
  // que no, con su posición. Y todo mensaje de la traza de uno termina con el comando que la
  // regraba (CTR-18.6, ADR-09.4).
  assert.throws(
    () => exigirTraza(BANCO, NIVEL_1, compactar(cuadros.slice(0, -1)), 'uno'),
    /NIV-01 · no gana: después de sus \d+ cuadros, (skayboy|poligirl) (está en \(\d+(\.\d)?, \d+(\.\d)?\)|en su puerta) y (skayboy|poligirl) (está en \(|en su puerta).*node scripts\/resolver-niveles\.mjs --regrabar NIV-01$/,
  );
  assert.throws(
    () => exigirTraza(BANCO, NIVEL_1, compactar([...cuadros, cuadros[cuadros.length - 1]]), 'uno'),
    new RegExp(`NIV-01 · gana a los ${cuadros.length} cuadros y la traza tiene ${cuadros.length + 1}: sobra 1\\..*--regrabar NIV-01$`),
  );
});

test('🔴 exigirTraza: dos columnas en un cuadro, o un cambio con alguno en el aire, no son de uno', () => {
  const cuadros = expandir(deUno.nivel1().traza);
  // El que espera salta en el lugar mientras el otro corre: cae donde estaba, así que el resto
  // de la traza no cambia y la única falta es la de las dos columnas. Vale para cualquiera de
  // los dos órdenes que elija el solucionador.
  const [juega] = columnasConTeclas(cuadros[0]);
  const espera: IdPersonaje = juega === 'skayboy' ? 'poligirl' : 'skayboy';
  const conLasDos = { ...cuadros[0], [espera]: { ...QUIETO, saltar: true } } as Mandos;
  assert.equal(columnasConTeclas(conLasDos).length, 2, 'control: el cuadro armado tiene las dos');
  const dosColumnas = compactar([conLasDos, ...cuadros.slice(1)]);
  assert.throws(() => exigirTraza(BANCO, NIVEL_1, dosColumnas, 'uno'), /dos columnas/);
  // Control: la misma traza, de a dos, no tiene nada de malo.
  assert.doesNotThrow(() => exigirTraza(BANCO, NIVEL_1, dosColumnas, 'dos'));

  // Skayboy salta, y en el aire se pasa a la otra columna: el que queda, queda volando.
  const saltaYSuelta: Traza = [
    { mandos: { skayboy: { ...QUIETO, saltar: true }, poligirl: QUIETO }, cuadros: 1 },
    { mandos: { skayboy: QUIETO, poligirl: { ...QUIETO, derecha: true } }, cuadros: 60 },
  ];
  assert.throws(() => exigirTraza(BANCO, NIVEL_1, saltaYSuelta, 'uno'), /en el aire/);
});

test('🔴 exigirTraza: el que cae sin un dedo encima en lo que lo rechaza está a la vista', () => {
  // Skayboy arranca en una cornisa; camina hasta el borde, se suelta, y cae sobre un `C`.
  const { banco, nivel } = sala([
    '########',
    '#......#',
    '#..1...#',
    '#..#...#',
    '#A..C2B#',
    '########',
  ]);
  const cae: Traza = [
    { mandos: { skayboy: { ...QUIETO, derecha: true }, poligirl: QUIETO }, cuadros: 10 },
    { mandos: { skayboy: QUIETO, poligirl: QUIETO }, cuadros: 40 },
  ];
  assert.equal(repetir(banco, nivel, cae).vueltasSinDedo.skayboy, 1, 'control: la vuelta pasó, y sin dedo');
  assert.throws(() => exigirTraza(banco, nivel, cae, 'uno'), /cuadro \d+: skayboy volvió a la entrada y su columna estaba suelta/);
});

test('🔴 lo que devuelve el solucionador se escribe en renglones y se lee igual (CTR-18.3)', () => {
  /*
   * El script graba lo que devuelve `resolverSolo()`, así que toda traza de uno tiene que tener
   * renglón. La que no, no se podría grabar: por eso `validar()` descarta en la de uno cualquier
   * candidata del ensanchado con izquierda y derecha apretadas a la vez, que `CTR-18.3` no escribe.
   */
  for (const s of [deUno.nivel1(), deUno.holgada(), deUno.hueco(), deUno.molinetes()]) {
    for (const traza of [s.traza, s.minima.traza]) {
      const renglones = escribirTraza(traza);
      assert.deepEqual(compactar(expandir(traza)), traza, 'control: la traza ya viene compacta');
      assert.equal(renglones.length, traza.length, 'un renglón por corrida');
      const leida = leerTraza('NIV-PRUEBA', renglones);
      assert.deepEqual(leida.problemas, []);
      assert.deepEqual(leida.traza, traza, 'escrita y leída, es la misma traza');
    }
  }
  // Control: una corrida con izquierda y derecha a la vez no tiene renglón.
  const conLasDos: Traza = [{ mandos: { skayboy: { ...QUIETO, izquierda: true, derecha: true }, poligirl: QUIETO }, cuadros: 3 }];
  assert.throws(() => escribirTraza(conLasDos), /«<>» no existe/);
});

/* -----------------------------------------------------------------------------------------
   La tolerancia
   ----------------------------------------------------------------------------------------- */

test(`la tolerancia: la sala holgada aguanta más que un hueco de ${ALCANCE_HUECO_TILES} tiles`, () => {
  const holgada = deUno.holgada().tolerancia;
  const hueco = deUno.hueco().tolerancia;
  assert.equal(holgada.tope, TOPE_TOLERANCIA, 'lo que se informa se mide hasta el tope de ADR-09.5');
  assert.ok(holgada.minimo >= HOLGURA, `en la holgada, todo aguanta lo que se ensanchó: ${holgada.minimo}`);
  assert.ok(hueco.minimo > 0, 'el hueco se puede saltar sin cuadro exacto');
  assert.ok(holgada.minimo > hueco.minimo, `holgada ${holgada.minimo}, hueco ${hueco.minimo}`);

  // Y lo apretado del hueco es el que salta: el toque, y la corrida que lo lleva al borde.
  assert.equal(hueco.masApretado?.columna, 'skayboy');
  const salto = hueco.bordes.find((b) => b.tecla === 'saltar' && b.sentido === 'aprieta');
  assert.ok(salto !== undefined);
  assert.ok(salto.tolerancia < TOPE_TOLERANCIA, 'el salto es lo que tiene ventana');
  assert.ok(salto.antes > 0 && salto.despues > 0, 'el toque aguanta que lo adelanten y que lo demoren');
});

test('🔴 un toque de un cuadro, demorado un cuadro, desaparece: por eso la traza grabada sostiene el salto', () => {
  /*
   * Es la regla de `CTR-18.7` punto 3 —el corrimiento pisa lo que encuentra, no arrastra— vista
   * donde más se nota. La búsqueda salta con toques de un cuadro; medida así, demorar el toque
   * un cuadro lo borra, Skayboy no salta y cae al molinete. Aguanta cero. La traza robustecida
   * sostiene la tecla, y sostenerla no cambia nada en `mundo.ts` —salta con el flanco—: solo
   * hace que un pulgar tardío todavía salte.
   */
  const s = deUno.hueco();
  const minima = tolerancia(HUECO.banco, HUECO.nivel, s.minima.traza);
  const toque = minima.bordes.find((b) => b.tecla === 'saltar' && b.sentido === 'aprieta');
  assert.ok(toque !== undefined);
  assert.equal(toque.despues, 0, 'el toque de un cuadro, demorado uno, ya no salta');
  assert.equal(s.minima.traza.find((c) => c.mandos.skayboy.saltar)?.cuadros, 1, 'control: la mínima salta con un toque');

  const sostenido = s.traza.find((c) => c.mandos.skayboy.saltar);
  assert.ok(sostenido !== undefined && sostenido.cuadros > 1, 'la grabada sostiene el salto');
  const salto = s.tolerancia.bordes.find((b) => b.tecla === 'saltar' && b.sentido === 'aprieta');
  assert.ok(salto !== undefined && salto.despues > 0, 'y demorarlo ya no lo borra');
});

test('🔴 una variante que gana pasando por una vuelta no cuenta como ganar (CTR-18.7 punto 4)', () => {
  /*
   * Skayboy camina hacia un `C` hasta el último cuadro que no lo toca, espera, y vuelve a su puerta. Soltar la derecha un cuadro
   * tarde lo mete en el `C`: vuelve a la entrada… y desde ahí igual llega, porque su puerta queda
   * del otro lado. La física gana; la definición no, porque una traza que pasa por perder no es
   * un "así se hace" (`CTR-18.6` regla 6).
   */
  const { banco, nivel } = sala([
    '############',
    '#..........#',
    '#..........#',
    '#A..1C..2.B#',
    '############',
  ]);
  const der = { skayboy: { ...QUIETO, derecha: true }, poligirl: QUIETO };
  const izq = { skayboy: { ...QUIETO, izquierda: true }, poligirl: QUIETO };
  const nadie = { skayboy: QUIETO, poligirl: QUIETO };
  const poli = { skayboy: QUIETO, poligirl: { ...QUIETO, derecha: true } };
  // Los cuadros se cuentan jugando, no se escriben (ADR-09.4): hacia el `C`, el último cuadro
  // que todavía no lo toca; y de vuelta, lo que haga falta para llegar a cada puerta. Así la
  // prueba sigue diciendo lo mismo si alguien afina la velocidad.
  const hastaElC = cuadrosHasta(banco, nivel, [], der, (_, sucesos) => sucesos.some((x) => x.tipo === 'vuelta')) - 1;
  assert.ok(hastaElC >= 1, 'control: Skayboy da al menos un paso antes del C');
  const ida: Traza = [
    { mandos: der, cuadros: hastaElC },
    { mandos: nadie, cuadros: 5 },
  ];
  const vuelta = cuadrosHasta(banco, nivel, ida, izq, (m) => m.cuerpos.skayboy.enPuerta);
  const conSkayboy: Traza = [...ida, { mandos: izq, cuadros: vuelta }];
  const traza: Traza = [...conSkayboy, { mandos: poli, cuadros: cuadrosHasta(banco, nivel, conSkayboy, poli, (m) => m.terminado) }];
  assert.ok(repetir(banco, nivel, traza).gana, 'control: la traza gana');
  const suelta = tolerancia(banco, nivel, traza).bordes.find(
    (b) => b.columna === 'skayboy' && b.tecla === 'derecha' && b.sentido === 'suelta',
  );
  assert.equal(suelta?.despues, 0);

  // Control: esa misma variante, jugada, llega al final. Lo que la hace perder es la vuelta.
  const variante: Traza = [{ mandos: der, cuadros: hastaElC + 1 }, ...traza.slice(1)];
  const r = repetir(banco, nivel, variante);
  assert.ok(r.gana && r.vueltas.skayboy === 1, 'la variante gana, pero Skayboy volvió a la entrada');
});

test('🔴 robustecer no pule lo que no mueve el mínimo: el salto del hueco no se sostiene de más', () => {
  /*
   * Con la suma de tolerancias como desempate, el robustecedor alargaba el salto ya centrado de
   * a un cuadro —la suma subía uno cada vez— y gastaba las 120 mediciones del presupuesto en eso:
   * el salto terminaba sostenido 36 cuadros y el mínimo seguía en 7.
   */
  const s = deUno.hueco();
  const r = robustecer(HUECO.banco, HUECO.nivel, s.minima.traza, { modo: 'uno' });
  assert.equal(r.tolerancia.minimo, s.tolerancia.minimo);
  assert.ok(r.evaluaciones <= 30, `midió ${r.evaluaciones} veces`);
  // El techo del sostenido sale de la física, no de un número escrito (ADR-09.4): lo que dura un
  // salto en el aire, jugado en la misma sala. Sostener más que eso no le da margen a nadie —el
  // salto sale con el flanco y ya aterrizó—, y es justo donde terminaba el defecto: 36 cuadros,
  // un salto entero. Antes decía "16 como mucho", que era lo que medía la física de VELOCIDAD 88
  // y a 96,8 ya daba 20 sin que el robustecedor hiciera nada mal (T-267).
  const vuelo = cuadrosHasta(HUECO.banco, HUECO.nivel, [{ mandos: saltaSkayboy, cuadros: 1 }], QUIETOS, (m) => m.cuerpos.skayboy.enSuelo) + 1;
  const sostenido = r.traza.find((c) => c.mandos.skayboy.saltar)?.cuadros ?? 0;
  assert.ok(sostenido > 1 && sostenido < vuelo, `el salto se sostiene ${sostenido} cuadros y en el aire dura ${vuelo}`);
});

test('🔴 el atajo de la tolerancia no cambia ningún número, tampoco con saltos: el hueco, medido con y sin él', () => {
  /*
   * `soluciones.test.ts` hace esta misma comparación sobre las trazas grabadas, pero `NIV-01` no
   * tiene un solo salto, y las variables que mueve un salto —la altura, la velocidad vertical, el
   * salto guardado— son justo las que `mismoFuturo()` tiene que mirar para cortar bien. Acá se
   * mide el hueco, que salta, en su traza robustecida y en la mínima, hasta el tope de `ADR-09.5`.
   *
   * Lo que esta prueba no ve: sacar **una sola** comparación de `mismoFuturo()`. Los campos de un
   * cuerpo que salta se mueven juntos y otro campo tapa al que falta —se probó en copias, campo
   * por campo, acá y en `NIV-01`—. Eso lo prueba `soluciones.test.ts`, con la comparación sola.
   */
  const s = deUno.hueco();
  for (const traza of [s.traza, s.minima.traza]) {
    assert.ok(repetir(HUECO.banco, HUECO.nivel, traza).sucesos.saltos.skayboy >= 1, 'control: la traza salta');
    assert.deepEqual(
      tolerancia(HUECO.banco, HUECO.nivel, traza),
      tolerancia(HUECO.banco, HUECO.nivel, traza, { atajo: false }),
      escribirTraza(traza).join(' | '),
    );
  }
});

test('🔴 la tolerancia ve un borde justo: la traza mínima, sin robustecer, no aguanta nada', () => {
  /*
   * Si la medición devolviera siempre el tope, la prueba de arriba pasaría igual en la
   * holgada. Esta es el control: la traza más corta suelta la tecla en el primer cuadro en
   * que el cuerpo ya está en su puerta, y soltarla antes no llega.
   */
  const s = deUno.holgada();
  const minima = tolerancia(HOLGADA.banco, HOLGADA.nivel, s.minima.traza);
  assert.ok(minima.minimo < 5, `la mínima aguanta ${minima.minimo}`);
  assert.ok(s.cuadros > s.minima.cuadros, 'la robustecida es más larga: el margen se paga en tiempo');
});

/* -----------------------------------------------------------------------------------------
   La traza como dato
   ----------------------------------------------------------------------------------------- */

test('compactar(expandir(t)) devuelve t', () => {
  const trazas: Traza[] = [
    deUno.nivel1().traza,
    deUno.hueco().traza,
    deUno.hueco().minima.traza,
    [
      { mandos: { skayboy: { ...QUIETO, izquierda: true }, poligirl: QUIETO }, cuadros: 3 },
      { mandos: { skayboy: { ...QUIETO, izquierda: true, saltar: true }, poligirl: QUIETO }, cuadros: 1 },
      { mandos: { skayboy: QUIETO, poligirl: QUIETO }, cuadros: 7 },
      { mandos: { skayboy: QUIETO, poligirl: { ...QUIETO, derecha: true } }, cuadros: 12 },
    ],
  ];
  for (const t of trazas) {
    assert.ok(esCompacta(t));
    assert.deepEqual(compactar(expandir(t)), t);
    assert.equal(expandir(t).length, largoDe(t));
  }
  // Control: una traza con dos corridas iguales seguidas no es compacta, y compactar las junta.
  const partida: Traza = [trazas[3][0], trazas[3][0]];
  assert.ok(!esCompacta(partida));
  assert.deepEqual(compactar(expandir(partida)), [{ ...trazas[3][0], cuadros: 6 }]);
});

/* -----------------------------------------------------------------------------------------
   El estado: lo que T-272 va a tocar
   ----------------------------------------------------------------------------------------- */

// `clonarMundo()` se mudó a `soluciones.ts` con la tolerancia (`T-267`), y su prueba —que la
// copia no comparta nada que se mueva, y que foto más resto sea la corrida entera— está en
// `soluciones.test.ts`.

test('🔴 el solucionador conoce cada campo del mundo: si mundo.ts suma uno, esta prueba lo nombra', () => {
  /*
   * `claveDeEstado()` tiene que tener todo lo que decide el futuro, y `clonarMundo()` tiene
   * que copiar todo lo que se mueve. Si `T-272` le suma una compuerta al mundo y no la suma
   * acá, la búsqueda confunde dos mundos distintos. El tipo ya lo exige al compilar; esto lo
   * exige al correr, que es lo que ve `npm test`.
   */
  const mundo = crearMundo(BANCO, NIVEL_1);
  assert.deepEqual(Object.keys(mundo).sort(), Object.keys(CAMPOS_DEL_MUNDO).sort());
  assert.deepEqual(Object.keys(mundo.cuerpos.skayboy).sort(), Object.keys(CAMPOS_DEL_CUERPO).sort());
});

test('claveDeEstado: el mismo lugar da la misma clave, y un píxel o un tesoro la cambian', () => {
  const mundo = crearMundo(BANCO, NIVEL_1);
  assert.equal(claveDeEstado(clonarMundo(mundo)), claveDeEstado(mundo));
  const corrido = clonarMundo(mundo);
  corrido.cuerpos.poligirl.x += 1;
  assert.notEqual(claveDeEstado(corrido), claveDeEstado(mundo));
  const conTesoro = clonarMundo(mundo);
  conTesoro.juntados.add('3,7');
  assert.notEqual(claveDeEstado(conTesoro), claveDeEstado(mundo));
  // Una fracción de píxel no: es la precisión que un nivel no tiene que pedir.
  const casi = clonarMundo(mundo);
  casi.cuerpos.skayboy.x += 0.2;
  assert.equal(claveDeEstado(casi), claveDeEstado(mundo));
});

test('🔴 claveDeEstado mira la sala: una palanca, una placa, una compuerta o una caja la cambian (CTR-16.10.11)', () => {
  /*
   * Sin la sala en la clave, la búsqueda confundía un mundo con la compuerta abierta con el mismo
   * mundo con la compuerta cerrada, y se quedaba con el primero que llegaba: una sala con
   * mecanismos contestaba «no hay solución». La compuerta va en su estado real, no el mandato.
   */
  const { banco, nivel } = CAJA_SOBRE_PLACA;
  const mundo = crearMundo(banco, nivel);
  assert.equal(claveDeEstado(clonarMundo(mundo)), claveDeEstado(mundo), 'control: la misma sala, la misma clave');
  const cambios: [string, (m: Mundo) => void][] = [
    ['la palanca', (m) => (m.palancas[0].activa = true)],
    ['la placa', (m) => (m.placas[0].pisada = true)],
    ['una compuerta', (m) => (m.compuertas[1].abierta = true)],
    ['la caja, un píxel', (m) => (m.cajas[0].x += 1)],
    ['la caja, que anda', (m) => (m.cajas[0].estado = 'tramo')],
  ];
  for (const [que, cambiar] of cambios) {
    const otro = clonarMundo(mundo);
    cambiar(otro);
    assert.notEqual(claveDeEstado(otro), claveDeEstado(mundo), `${que} distinta y la clave es la misma`);
  }
  // Lo que no decide lo que pasa después no parte un nodo en dos: quién empujó la caja, y la
  // espera del último cuadro.
  const empujada = clonarMundo(mundo);
  empujada.cajas[0].empujadaPor = 'poligirl';
  empujada.cajas[0].espera = { quien: 'skayboy', donde: 'arriba' };
  assert.equal(claveDeEstado(empujada), claveDeEstado(mundo));
});

test('🔴 el solucionador conoce cada campo de la caja: si mundo.ts suma uno, esta prueba lo nombra', () => {
  const { banco, nivel } = CAJA_SOBRE_PLACA;
  const caja = crearMundo(banco, nivel).cajas[0];
  assert.deepEqual(Object.keys(caja).sort(), Object.keys(CAMPOS_DE_LA_CAJA).sort());
});

/* -----------------------------------------------------------------------------------------
   Lo que el módulo no puede tener adentro
   ----------------------------------------------------------------------------------------- */

const FUENTE = readFileSync(new URL('./solucionador.ts', import.meta.url), 'utf8');

test('🔴 importa solo mundo.ts, niveles.ts y soluciones.ts: ni node:*, ni motor, ni DOM, ni azar', () => {
  // La lista de importaciones es la guarda de `node:*`; el texto lo nombra en la cabecera. Es la
  // fila del solucionador en la tabla de `CTR-18.11`.
  const importaciones = (FUENTE.match(/from\s+'[^']+'/g) ?? []).map((l) => l.replace(/from\s+/, ''));
  assert.deepEqual(importaciones, ["'./mundo.ts'", "'./niveles.ts'", "'./soluciones.ts'"]);
  for (const prohibida of ['import(', 'require(', 'kaplay', 'document.', 'window.', 'Date.now', 'Math.random']) {
    assert.ok(!FUENTE.includes(prohibida), `usa ${prohibida}: el solucionador es puro`);
  }
});

test('🔴 el vocabulario del fallo no entra ni en el solucionador, ni en esta prueba, ni en el script', () => {
  // Partidas a propósito, como en `mundo.test.ts`: la barredora corre sobre la carpeta entera.
  const prohibidas = ['vi' + 'da', 'muer' + 'te', 'mo' + 'riste', 'per' + 'diste', 'game' + ' over', 'le' + 'tal', 'ma' + 'ta('];
  const archivos = {
    'solucionador.ts': FUENTE,
    'solucionador.test.ts': readFileSync(new URL('./solucionador.test.ts', import.meta.url), 'utf8'),
    'resolver-niveles.mjs': readFileSync('scripts/resolver-niveles.mjs', 'utf8'),
  };
  for (const [nombre, texto] of Object.entries(archivos)) {
    for (const palabra of prohibidas) {
      assert.ok(!texto.toLowerCase().includes(palabra), `entró «${palabra}» en ${nombre}: acá el fracaso devuelve a la entrada y nada más`);
    }
  }
});
