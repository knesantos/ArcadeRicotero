import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CUADRO_SEG, QUIETO, crearMundo, paso, type Mando, type Mandos, type Mundo, type Suceso } from './mundo.ts';
import type { Banco, Nivel } from './niveles.ts';
import { CAIDA_FUERTE, CAIDA_QUE_SE_SIENTE, PESO_SEG, crearMemoria, hundimiento, sentir, type Golpe } from './sensacion.ts';
import { AREA, CHISPAS_EN_LA_FILA, TECHO_MS, TINTAS_DE_CHISPA, chispasDe } from './chispas.ts';
import { CUADROS_POR_VUELTA, GUIONES, VUELTAS, avanzarVidriera, crearVidriera, guionLimpio, guionPara, mandosDelGuion, vidrieraViva } from './vidriera.ts';

/**
 * La sensación, las chispas y la vidriera (ronda de pulida de los juegos, 2026-11-18). Lo que se
 * cuida: que lo que se siente salga de lo que pasó de verdad en el mundo, que nada de esto toque
 * el mundo de la partida, y que el idioma sea el del pixel —enteros, tintas de la hoja 14, menos
 * de 400 ms—.
 */

const BANCO: Banco = JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as Banco;
const nivel = (id: string): Nivel => {
  const n = BANCO.niveles.find((x) => x.id === id);
  assert.ok(n, `el banco no tiene ${id}`);
  return n;
};

const con = (m: Partial<Mando>): Mando => ({ ...QUIETO, ...m });
const mandos = (skayboy: Mando = QUIETO, poligirl: Mando = QUIETO): Mandos => ({ skayboy, poligirl });

/** Juega esos cuadros con esos mandos y junta todos los golpes que se sintieron. */
function jugar(mundo: Mundo, memoria: ReturnType<typeof crearMemoria>, m: Mandos, cuadros: number): Golpe[] {
  const golpes: Golpe[] = [];
  for (let i = 0; i < cuadros; i++) golpes.push(...sentir(memoria, mundo, paso(mundo, m, CUADRO_SEG)));
  return golpes;
}

const tipos = (golpes: readonly Golpe[]): string[] => golpes.map((g) => g.tipo);

test('el primer tic de un mundo no se siente: la memoria se arma con lo que ve', () => {
  const mundo = crearMundo(BANCO, nivel('NIV-01'));
  const memoria = crearMemoria();
  assert.deepEqual(sentir(memoria, mundo, [{ tipo: 'salto', quien: 'skayboy' }]), []);
  assert.equal(memoria.mundo, mundo);
});

test('un salto parado: un despegue al salir y un aterrizaje al volver, en los pies', () => {
  const mundo = crearMundo(BANCO, nivel('NIV-01'));
  const memoria = crearMemoria();
  sentir(memoria, mundo, []);
  const pies = { x: Math.round(mundo.cuerpos.skayboy.x + 5), y: Math.round(mundo.cuerpos.skayboy.y + 20) };
  const golpes = jugar(mundo, memoria, mandos(con({ saltar: true })), 60);
  assert.deepEqual(tipos(golpes), ['despegue', 'aterrizaje']);
  assert.deepEqual(golpes[0], { tipo: 'despegue', ...pies });
  // Vuelve con la velocidad con que salió: se siente, pero no es un golpe fuerte.
  assert.deepEqual(golpes[1], { tipo: 'aterrizaje', ...pies, fuerte: false });
  assert.ok(CAIDA_QUE_SE_SIENTE < 270 && 270 < CAIDA_FUERTE, 'el salto parado cae entre los dos umbrales');
});

test('caminar no levanta polvo, y el que no tiene dedo no siente nada', () => {
  const mundo = crearMundo(BANCO, nivel('NIV-01'));
  const memoria = crearMemoria();
  sentir(memoria, mundo, []);
  assert.deepEqual(jugar(mundo, memoria, mandos(QUIETO, con({ izquierda: true })), 20), []);
});

test('el favorito se siente en el centro de su celda, una sola vez', () => {
  const mundo = crearMundo(BANCO, nivel('NIV-01'));
  const memoria = crearMemoria();
  sentir(memoria, mundo, []);
  const golpes = jugar(mundo, memoria, mandos(con({ izquierda: true })), 60);
  // La guitarra del nivel 1 está en la columna 3 de la fila 7.
  assert.deepEqual(golpes, [{ tipo: 'favorito', x: 3 * 16 + 8, y: 7 * 16 + 8, de: 'skayboy' }]);
});

test('ganar: un golpe por puerta, cada una con su dueño', () => {
  const mundo = crearMundo(BANCO, nivel('NIV-01'));
  const memoria = crearMemoria();
  sentir(memoria, mundo, []);
  const golpes = jugar(mundo, memoria, mandos(con({ izquierda: true }), con({ derecha: true })), 120);
  assert.ok(mundo.terminado, 'en el nivel 1 cada uno camina a su puerta');
  const puertas = golpes.filter((g) => g.tipo === 'puerta');
  assert.deepEqual(puertas, [
    { tipo: 'puerta', x: 1 * 16 + 8, y: 7 * 16 + 2, de: 'skayboy' },
    { tipo: 'puerta', x: 13 * 16 + 8, y: 7 * 16 + 2, de: 'poligirl' },
  ]);
});

test('volver a la entrada es una pasada del lugar: ni aterrizaje ni peso (UX-29 §3)', () => {
  // En el nivel 2 el charco del cielo devuelve a Skayboy: camina a la derecha hasta pisarlo.
  const mundo = crearMundo(BANCO, nivel('NIV-02'));
  const memoria = crearMemoria();
  sentir(memoria, mundo, []);
  const golpes = jugar(mundo, memoria, mandos(con({ derecha: true })), 90);
  assert.ok(tipos(golpes).includes('vuelta'), 'pisó el charco y volvió');
  assert.ok(!tipos(golpes).includes('aterrizaje'), 'al que devuelve el lugar no le suena el piso');
  assert.equal(memoria.peso.skayboy, null);
});

test('dos que vuelven en el mismo tic dan una sola pasada', () => {
  const mundo = crearMundo(BANCO, nivel('NIV-01'));
  const memoria = crearMemoria();
  sentir(memoria, mundo, []);
  const sucesos: Suceso[] = [
    { tipo: 'vuelta', quien: 'skayboy' },
    { tipo: 'vuelta', quien: 'poligirl' },
  ];
  assert.deepEqual(sentir(memoria, mundo, sucesos), [{ tipo: 'vuelta' }]);
});

test('la caja que arranca raspa del lado de atrás, y la palanca avisa para dónde quedó', () => {
  // Nivel 10: la caja está a la izquierda de Skayboy. Nivel 8: la palanca, a su derecha.
  const conCaja = crearMundo(BANCO, nivel('NIV-10'));
  const memoria = crearMemoria();
  sentir(memoria, conCaja, []);
  const empujes = jugar(conCaja, memoria, mandos(con({ izquierda: true })), 90).filter((g) => g.tipo === 'empuje');
  assert.ok(empujes.length >= 1, 'la empujó');
  assert.equal(empujes[0]?.tipo === 'empuje' ? empujes[0].lado : 0, -1);

  const conPalanca = crearMundo(BANCO, nivel('NIV-08'));
  const otra = crearMemoria();
  sentir(otra, conPalanca, []);
  const palancas = jugar(conPalanca, otra, mandos(con({ derecha: true })), 60).filter((g) => g.tipo === 'palanca');
  assert.deepEqual(palancas, [{ tipo: 'palanca', x: 3 * 16 + 8, y: 7 * 16 + 4, lado: 1 }]);
});

test('el nivel que sigue no hereda nada: con otro mundo, cero golpes y cero peso', () => {
  const mundo = crearMundo(BANCO, nivel('NIV-01'));
  const memoria = crearMemoria();
  sentir(memoria, mundo, []);
  jugar(mundo, memoria, mandos(con({ saltar: true })), 60);
  assert.notEqual(memoria.peso.skayboy, null);
  const otro = crearMundo(BANCO, nivel('NIV-02'));
  assert.deepEqual(sentir(memoria, otro, [{ tipo: 'puerta' }]), []);
  assert.equal(memoria.peso.skayboy, null);
  assert.equal(hundimiento(memoria, 'skayboy', otro, false), 0);
});

test('el peso: un píxel al caer, un instante, y nada con movimiento reducido', () => {
  const mundo = crearMundo(BANCO, nivel('NIV-01'));
  const memoria = crearMemoria();
  sentir(memoria, mundo, []);
  let visto = 0;
  let conReducido = 0;
  let cuadrosHundido = 0;
  for (let i = 0; i < 90; i++) {
    // Suelta el salto antes de caer: así el peso se mide parado, sin la tecla.
    sentir(memoria, mundo, paso(mundo, mandos(i < 10 ? con({ saltar: true }) : QUIETO), CUADRO_SEG));
    const h = hundimiento(memoria, 'skayboy', mundo, false);
    visto = Math.max(visto, h);
    if (h > 0) cuadrosHundido++;
    conReducido = Math.max(conReducido, hundimiento(memoria, 'skayboy', mundo, true));
  }
  assert.equal(visto, 1, 'un salto parado hunde un píxel');
  assert.equal(conReducido, 0);
  assert.ok(cuadrosHundido >= 3 && cuadrosHundido <= Math.ceil(PESO_SEG / CUADRO_SEG) + 1, `dura un instante (${cuadrosHundido} cuadros)`);
  assert.equal(hundimiento(memoria, 'poligirl', mundo, false), 0, 'la que no saltó no pesa');
});

test('sentir no toca el mundo: con y sin sensación, la partida es la misma', () => {
  const a = crearMundo(BANCO, nivel('NIV-10'));
  const b = crearMundo(BANCO, nivel('NIV-10'));
  const memoria = crearMemoria();
  const m = mandos(con({ izquierda: true, saltar: true }), con({ derecha: true }));
  for (let i = 0; i < 120; i++) {
    sentir(memoria, a, paso(a, m, CUADRO_SEG));
    paso(b, m, CUADRO_SEG);
  }
  assert.deepEqual(a.cuerpos, b.cuerpos);
  assert.deepEqual(a.cajas, b.cajas);
  assert.equal(a.tiempo, b.tiempo);
});

/* ---------------------------------------------------------------- las chispas */

const GOLPES: readonly Golpe[] = [
  { tipo: 'aterrizaje', x: 80, y: 128, fuerte: false },
  { tipo: 'aterrizaje', x: 80, y: 128, fuerte: true },
  { tipo: 'despegue', x: 80, y: 128 },
  { tipo: 'favorito', x: 56, y: 120, de: 'skayboy' },
  { tipo: 'empuje', x: 64, y: 128, lado: 1 },
  { tipo: 'empuje', x: 64, y: 128, lado: -1 },
  { tipo: 'cajaApoya', x: 64, y: 128 },
  { tipo: 'palanca', x: 56, y: 116, lado: 1 },
  { tipo: 'palanca', x: 56, y: 116, lado: -1 },
  { tipo: 'puerta', x: 24, y: 114, de: 'skayboy' },
];

test('las chispas son pixel duro: enteros, tintas de la hoja 14, y ninguna pasa de 400 ms', () => {
  for (const golpe of GOLPES) {
    const chispas = chispasDe(golpe);
    assert.ok(chispas.length > 0, `${golpe.tipo}: suelta algo`);
    for (const c of chispas) {
      assert.ok(Number.isInteger(c.x) && Number.isInteger(c.y) && Number.isInteger(c.lado), `${golpe.tipo}: nace en un píxel entero`);
      assert.ok(c.lado >= 2 && c.lado <= 4, `${golpe.tipo}: de 2 a 4 píxeles de lado`);
      assert.ok((TINTAS_DE_CHISPA as readonly string[]).includes(c.tinta), `${golpe.tipo}: tinta ${c.tinta}`);
      assert.deepEqual(c.pasos[0], [0, 0], `${golpe.tipo}: el primer paso es donde nace`);
      assert.ok(c.pasos.length >= 3 && c.pasos.length <= 6, `${golpe.tipo}: de tres a seis saltos`);
      for (const [dx, dy] of c.pasos) {
        assert.ok(Number.isInteger(dx) && Number.isInteger(dy), `${golpe.tipo}: salta de a píxeles enteros`);
        assert.ok(Math.abs(dx) <= 12 && Math.abs(dy) <= 12, `${golpe.tipo}: no se va lejos`);
      }
      assert.ok(c.ms > 0 && c.ms <= TECHO_MS, `${golpe.tipo}: ${c.ms} ms`);
      assert.ok(c.x >= -8 && c.x <= AREA.ancho && c.y >= -8 && c.y <= AREA.alto, `${golpe.tipo}: nace en el área`);
    }
  }
});

test('la vuelta no suelta chispas, y ganar entra en la fila con polvo en el aire', () => {
  assert.deepEqual(chispasDe({ tipo: 'vuelta' }), []);
  const ganar = 2 * chispasDe({ tipo: 'puerta', x: 24, y: 114, de: 'skayboy' }).length;
  const polvo = chispasDe({ tipo: 'aterrizaje', x: 80, y: 128, fuerte: true }).length;
  assert.ok(ganar + 2 * polvo <= CHISPAS_EN_LA_FILA, `${ganar} + ${2 * polvo} chispas no entran en ${CHISPAS_EN_LA_FILA}`);
});

test('el polvo del piso no se mete en el piso, y lo que raspa una caja queda atrás', () => {
  for (const golpe of GOLPES.filter((g) => g.tipo === 'aterrizaje' || g.tipo === 'cajaApoya' || g.tipo === 'favorito')) {
    for (const c of chispasDe(golpe)) {
      for (const [, dy] of c.pasos) assert.ok(dy <= 0, `${golpe.tipo}: sube o corre, no baja`);
    }
  }
  const aLaDerecha = chispasDe({ tipo: 'empuje', x: 64, y: 128, lado: 1 });
  for (const c of aLaDerecha) assert.ok((c.pasos.at(-1)?.[0] ?? 0) < 0, 'la caja va a la derecha, la raspadura a la izquierda');
});

/* ---------------------------------------------------------------- la vidriera */

test('la vidriera no importa las soluciones: la traza no viaja al teléfono (ADR-09.2)', () => {
  const fuente = readFileSync('src/lib/skayboy/vidriera.ts', 'utf-8');
  assert.ok(!/from\s+['"][^'"]*soluciones/.test(fuente), 'vidriera.ts importa soluciones.ts');
  assert.ok(!/from\s+['"][^'"]*solucionador/.test(fuente), 'vidriera.ts importa el solucionador');
});

test('en cada nivel sembrado, el guion elegido no toca nada y termina donde empezó', () => {
  const elegidos: Record<string, string> = {};
  for (const n of BANCO.niveles) {
    const guion = guionPara(BANCO, n);
    elegidos[n.id] = guion ?? 'ninguno';
    if (guion === null) continue;
    assert.ok(guionLimpio(BANCO, n, guion), `${n.id}: ${guion} no sale limpio`);
    // Y jugado por la vidriera misma, vuelta por vuelta, con el tiempo del motor temblando.
    const v = crearVidriera(BANCO, n);
    assert.ok(v);
    const alEmpezar = JSON.stringify(v.mundo.cuerpos);
    let cuadros = 0;
    while (vidrieraViva(v) && cuadros < 100_000) {
      const dt = cuadros % 3 === 0 ? 1 / 50 : 1 / 70;
      for (const s of avanzarVidriera(v, dt)) assert.equal(s.tipo, 'salto', `${n.id}: en la vidriera pasó «${s.tipo}»`);
      assert.equal(v.mundo.juntados.size, 0, `${n.id}: la vidriera juntó un favorito`);
      assert.ok(!v.mundo.terminado, `${n.id}: la vidriera ganó el nivel`);
      cuadros++;
    }
    assert.equal(v.vueltas, VUELTAS, `${n.id}: da sus vueltas y se queda quieta`);
    assert.equal(JSON.stringify(v.mundo.cuerpos), alEmpezar, `${n.id}: queda como arrancó`);
    assert.deepEqual(avanzarVidriera(v, 1 / 60), [], `${n.id}: terminada, no avanza más`);
  }
  // El nivel 1, que es el que ve quien llega por primera vez, tiene el guion entero.
  assert.equal(elegidos['NIV-01'], 'con-pasos');
  const sinVidriera = Object.values(elegidos).filter((g) => g === 'ninguno').length;
  assert.ok(sinVidriera <= 2, `demasiados niveles sin vidriera: ${JSON.stringify(elegidos)}`);
});

test('un guion que toca algo se descarta: saltar debajo de un favorito no sale limpio', () => {
  // En el nivel 4 la guitarra está arriba de Skayboy, al alcance de un salto.
  assert.equal(guionLimpio(BANCO, nivel('NIV-04'), 'solo-saltos'), false);
  assert.notEqual(guionPara(BANCO, nivel('NIV-04')), 'solo-saltos');
});

test('el guion es un bucle corto: cada tecla se suelta, y nadie camina sin volver', () => {
  const lados = { skayboy: 1, poligirl: -1 } as const;
  for (const guion of GUIONES) {
    let pasos = { skayboy: 0, poligirl: 0 };
    for (let c = 0; c < CUADROS_POR_VUELTA; c++) {
      const m = mandosDelGuion(guion, c, lados);
      for (const id of ['skayboy', 'poligirl'] as const) pasos[id] += (m[id].derecha ? 1 : 0) - (m[id].izquierda ? 1 : 0);
    }
    assert.deepEqual(pasos, { skayboy: 0, poligirl: 0 }, `${guion}: los pasos de ida y de vuelta no cierran`);
    assert.deepEqual(mandosDelGuion(guion, 0, lados), { skayboy: QUIETO, poligirl: QUIETO }, `${guion}: arranca quieto`);
    assert.deepEqual(mandosDelGuion(guion, CUADROS_POR_VUELTA - 1, lados), { skayboy: QUIETO, poligirl: QUIETO }, `${guion}: termina quieto`);
  }
});

test('la vidriera corre sobre un mundo aparte: el de la partida no se entera', () => {
  const partida = crearMundo(BANCO, nivel('NIV-01'));
  const v = crearVidriera(BANCO, nivel('NIV-01'));
  assert.ok(v);
  for (let i = 0; i < 300; i++) avanzarVidriera(v, 1 / 60);
  assert.notEqual(v.mundo, partida);
  assert.equal(partida.tiempo, 0, 'la partida sigue en la entrada');
  assert.ok(v.mundo.tiempo > 0);
});
