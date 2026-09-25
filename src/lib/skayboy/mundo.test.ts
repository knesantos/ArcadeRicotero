/**
 * El mundo sin motor (`T-254`): la física, la sala cerrada y el terreno que devuelve. Y desde
 * `T-272`, los mecanismos de `CTR-16.10`: palanca, placa, compuerta y caja, con los casos `M1` a
 * `M7` de `CTR-16.10.10` y los que pidió el plan.
 *
 * La puerta doble tiene su archivo aparte, `niveles.test.ts`, porque es la verificación que
 * el plan del ciclo 15 le declaró a `T-248` y conviene que el comando siga diciendo lo que
 * dice. Las reglas del banco que miran la grilla (`E1` a `E8`) están en `banco.test.ts`. Acá va
 * todo lo demás.
 *
 * Los casos marcados 🔴 son reglas que existen para que algo **no** pase. Cada uno trae su
 * control al lado, porque una guarda que nunca se vio en rojo no es una guarda.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { problemasDelBanco, type Banco, type CompuertaDelNivel, type IdPersonaje, type MecanismoDelNivel, type Nivel } from './niveles.ts';
import {
  ALCANCE_ALTO_TILES,
  ALCANCE_HUECO_TILES,
  CAIDA_MAXIMA,
  CUERPO_ALTO,
  CUERPO_ANCHO,
  CUADRO_SEG,
  FASE_SEG,
  GRAVEDAD,
  PASO_MAXIMO_SEG,
  QUIETO,
  SUBPASO_SEG,
  TILE,
  TOPE_CUADROS_POR_TIC,
  VELOCIDAD,
  VELOCIDAD_EMPUJE,
  algunaCajaAnda,
  crearMundo,
  crearReloj,
  jugarTic,
  juntadosPorPersonaje,
  paso,
  poseDe,
  puntoDeEntrada,
  repartirEnCuadros,
  type Caja,
  type Cuerpo,
  type Mando,
  type Mandos,
  type Mundo,
  type Suceso,
} from './mundo.ts';

/** Un cuadro, el de la partida (`ADR-09.1`): el número vive en `mundo.ts` y en ningún otro lado. */
const CUADRO = CUADRO_SEG;
const BANCO: Banco = JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as Banco;

/** Un nivel de prueba con la leyenda de verdad y la grilla que haga falta. */
function sala(grilla: string[]): { banco: Banco; nivel: Nivel } {
  const nivel: Nivel = {
    id: 'NIV-PRUEBA',
    nombre: '',
    escalon: 1,
    estado: 'borrador',
    grilla,
    mecanismos: [],
    compuertas: [],
    verificaciones: { deDos: false },
  };
  return { banco: { ...BANCO, niveles: [nivel] }, nivel };
}

function mandos(parcial: Partial<Record<IdPersonaje, Partial<Mando>>> = {}): Mandos {
  return {
    skayboy: { ...QUIETO, ...parcial.skayboy },
    poligirl: { ...QUIETO, ...parcial.poligirl },
  };
}

/** Corre `segundos` a 60 cuadros con los mismos mandos, y junta todo lo que pasó. */
function correr(mundo: Mundo, m: Mandos, segundos: number): Suceso[] {
  const sucesos: Suceso[] = [];
  const cuadros = Math.round(segundos / CUADRO);
  for (let i = 0; i < cuadros; i++) sucesos.push(...paso(mundo, m, CUADRO));
  return sucesos;
}

/** Un toque de saltar: un cuadro apretado y el resto suelto. */
function tocarSaltar(mundo: Mundo, id: IdPersonaje, resto: Partial<Mando> = {}, segundos = 1.2): Suceso[] {
  const sucesos = [...paso(mundo, mandos({ [id]: { ...resto, saltar: true } }), CUADRO)];
  sucesos.push(...correr(mundo, mandos({ [id]: resto }), segundos));
  return sucesos;
}

/**
 * Avanza cuadro por cuadro hasta que se cumpla la condición, **con tope**. Sin tope, una
 * regla rota no se ve como una prueba en rojo sino como una prueba colgada — se aprendió
 * rompiendo el molinete a propósito, que es cuando más hace falta que el rojo se vea.
 */
function hasta(mundo: Mundo, m: Mandos, listo: (sucesos: readonly Suceso[]) => boolean, tope = 600): Suceso[] {
  for (let i = 0; i < tope; i++) {
    const sucesos = paso(mundo, m, CUADRO);
    if (listo(sucesos)) return [...sucesos];
  }
  throw new Error(`pasaron ${tope} cuadros y no llegó a lo que la prueba esperaba`);
}

const DE_NADIE = [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#A...1...2...B#',
  '###############',
];

test('los dos arrancan parados en su entrada, centrados en el tile', () => {
  const { banco, nivel } = sala(DE_NADIE);
  const mundo = crearMundo(banco, nivel);
  const s = mundo.cuerpos.skayboy;
  assert.equal(s.x, 5 * TILE + (TILE - CUERPO_ANCHO) / 2);
  assert.equal(s.y + CUERPO_ALTO, 8 * TILE, 'los pies apoyan en el piso de la fila 8');
  correr(mundo, mandos(), 0.5);
  assert.equal(mundo.cuerpos.skayboy.y + CUERPO_ALTO, 8 * TILE, 'y quieto no se hunde ni flota');
  assert.ok(mundo.cuerpos.skayboy.enSuelo);
});

test('🔴 el que no tiene dedo encima no se mueve ni un píxel, aunque pasen diez segundos', () => {
  const mundo = crearMundo(BANCO, BANCO.niveles[0]);
  const antes = { ...mundo.cuerpos.poligirl };
  const sucesos = correr(mundo, mandos({ skayboy: { izquierda: true } }), 10);
  assert.equal(mundo.cuerpos.poligirl.x, antes.x);
  assert.equal(mundo.cuerpos.poligirl.y, antes.y);
  assert.ok(!sucesos.some((s) => s.tipo !== 'puerta' && 'quien' in s && s.quien === 'poligirl'));
  // Control: el que sí tiene dedo se movió.
  assert.notEqual(mundo.cuerpos.skayboy.x, puntoDeEntrada(BANCO, BANCO.niveles[0], 'skayboy').x);
});

test('correr mueve, soltar frena, y la pared de la sala no se atraviesa', () => {
  const { banco, nivel } = sala(DE_NADIE);
  const mundo = crearMundo(banco, nivel);
  correr(mundo, mandos({ poligirl: { derecha: true } }), 5);
  assert.equal(mundo.cuerpos.poligirl.x + CUERPO_ANCHO, 14 * TILE, 'queda pegada a la pared de la columna 14');
  const x = mundo.cuerpos.poligirl.x;
  correr(mundo, mandos(), 0.5);
  assert.equal(mundo.cuerpos.poligirl.x, x, 'soltar frena en el acto: no hay patinada');
});

test('🔴 un paso enorme no atraviesa nada: el mundo no simula los segundos que el teléfono se trabó', () => {
  const { banco, nivel } = sala(DE_NADIE);
  const mundo = crearMundo(banco, nivel);
  const t0 = mundo.tiempo;
  paso(mundo, mandos({ poligirl: { derecha: true } }), 5);
  assert.ok(Math.abs(mundo.tiempo - t0 - PASO_MAXIMO_SEG) < 1e-9, 'se topea en PASO_MAXIMO_SEG');
  for (let i = 0; i < 200; i++) paso(mundo, mandos({ poligirl: { derecha: true } }), 5);
  assert.ok(mundo.cuerpos.poligirl.x + CUERPO_ANCHO <= 14 * TILE, 'y la pared sigue ahí');
});

test('🔴 afuera de la grilla es pared: una sala dibujada sin borde tampoco deja salir a nadie', () => {
  const { banco, nivel } = sala([
    '...............',
    '...............',
    '...............',
    '...............',
    '...............',
    '...............',
    '...............',
    'A....1...2....B',
    '...............',
  ]);
  const mundo = crearMundo(banco, nivel);
  correr(mundo, mandos({ poligirl: { derecha: true } }), 3);
  assert.equal(mundo.cuerpos.poligirl.x + CUERPO_ANCHO, 15 * TILE, 'frena en el borde derecho');
  assert.ok(mundo.cuerpos.poligirl.y + CUERPO_ALTO <= 9 * TILE, 'y no cae por debajo del piso del mundo');
});

test('el salto suena una vez por salto, y solo si despega', () => {
  const { banco, nivel } = sala(DE_NADIE);
  const mundo = crearMundo(banco, nivel);
  const sucesos = tocarSaltar(mundo, 'skayboy');
  assert.deepEqual(sucesos.filter((s) => s.tipo === 'salto'), [{ tipo: 'salto', quien: 'skayboy' }]);

  // Mantener la tecla no es saltar de nuevo: no hay "mantener para cargar" ni rebote (`UX-28 §2.1`).
  const otro = crearMundo(banco, nivel);
  const mantenido = correr(otro, mandos({ skayboy: { saltar: true } }), 2);
  assert.equal(mantenido.filter((s) => s.tipo === 'salto').length, 1);
});

test('🔴 en el aire no se salta de nuevo: no hay doble salto', () => {
  const { banco, nivel } = sala(DE_NADIE);
  const mundo = crearMundo(banco, nivel);
  const sucesos: Suceso[] = [];
  sucesos.push(...paso(mundo, mandos({ skayboy: { saltar: true } }), CUADRO));
  sucesos.push(...correr(mundo, mandos(), 0.2));
  sucesos.push(...paso(mundo, mandos({ skayboy: { saltar: true } }), CUADRO));
  sucesos.push(...correr(mundo, mandos(), 0.05));
  assert.equal(sucesos.filter((s) => s.tipo === 'salto').length, 1);
});

test('el perdón temprano: un toque justo antes de aterrizar salta al tocar el piso', () => {
  const { banco, nivel } = sala(DE_NADIE);
  const mundo = crearMundo(banco, nivel);
  paso(mundo, mandos({ skayboy: { saltar: true } }), CUADRO);
  // Esperar hasta estar a punto de aterrizar.
  const sk = mundo.cuerpos.skayboy;
  hasta(mundo, mandos(), () => sk.vy > 0 && sk.y + CUERPO_ALTO > 8 * TILE - 4);
  const sucesos = [...paso(mundo, mandos({ skayboy: { saltar: true } }), CUADRO)];
  sucesos.push(...correr(mundo, mandos(), 0.2));
  assert.equal(sucesos.filter((s) => s.tipo === 'salto').length, 1, 'el toque temprano se guardó');
});

test('el perdón tarde: un toque justo después de dejar el borde todavía salta', () => {
  const { banco, nivel } = sala([
    '###############',
    '#.............#',
    '#.............#',
    '#.............#',
    '#.............#',
    '#....1........#',
    '#...####......#',
    '#A........2..B#',
    '###############',
  ]);
  // Skayboy arranca en una cornisa (la entrada 1 está sobre sólido). Corre a la izquierda
  // hasta caerse del borde y toca saltar dos cuadros después.
  const mundo = crearMundo(banco, nivel);
  const s = mundo.cuerpos.skayboy;
  hasta(mundo, mandos({ skayboy: { izquierda: true } }), () => !s.enSuelo);
  paso(mundo, mandos({ skayboy: { izquierda: true } }), CUADRO);
  const sucesos = [...paso(mundo, mandos({ skayboy: { izquierda: true, saltar: true } }), CUADRO)];
  assert.deepEqual(sucesos, [{ tipo: 'salto', quien: 'skayboy' }]);
});

test(`el alcance que un nivel puede pedir: sube ${ALCANCE_ALTO_TILES} tiles y no ${ALCANCE_ALTO_TILES + 1}`, () => {
  // Una cornisa de dos tiles sobre el piso, a la derecha de la entrada.
  const dos = sala([
    '###############',
    '#.............#',
    '#.............#',
    '#.............#',
    '#.............#',
    '#.............#',
    '#......###....#',
    '#A...1....2..B#',
    '###############',
  ]);
  const m2 = crearMundo(dos.banco, dos.nivel);
  tocarSaltar(m2, 'skayboy', { derecha: true }, 0.6);
  correr(m2, mandos(), 0.5);
  assert.equal(m2.cuerpos.skayboy.y + CUERPO_ALTO, 6 * TILE, 'quedó parado arriba de la cornisa de dos');

  // Control: la misma cornisa un tile más alta ya no se alcanza.
  const tres = sala([
    '###############',
    '#.............#',
    '#.............#',
    '#.............#',
    '#......###....#',
    '#.............#',
    '#.............#',
    '#A...1....2..B#',
    '###############',
  ]);
  const m3 = crearMundo(tres.banco, tres.nivel);
  tocarSaltar(m3, 'skayboy', { derecha: true }, 0.6);
  correr(m3, mandos(), 0.5);
  assert.equal(m3.cuerpos.skayboy.y + CUERPO_ALTO, 8 * TILE, 'no la alcanzó: volvió al piso');
});

test(`el alcance que un nivel puede pedir: cruza un hueco de ${ALCANCE_HUECO_TILES} tiles`, () => {
  // Dos plataformas en la fila 5 con un hueco de tres entre medio. Si no cruza, cae al piso.
  const { banco, nivel } = sala([
    '###############',
    '#.............#',
    '#.............#',
    '#.............#',
    '#....1........#',
    '#.#####...###.#',
    '#.............#',
    '#A........2..B#',
    '###############',
  ]);
  const mundo = crearMundo(banco, nivel);
  const s = mundo.cuerpos.skayboy;
  // Corre hasta el borde de la plataforma de la izquierda (columna 6) y salta ahí.
  hasta(mundo, mandos({ skayboy: { derecha: true } }), () => s.x >= 6 * TILE + (TILE - CUERPO_ANCHO));
  tocarSaltar(mundo, 'skayboy', { derecha: true }, 0.7);
  correr(mundo, mandos(), 0.5);
  assert.equal(s.y + CUERPO_ALTO, 5 * TILE, 'aterrizó arriba, del otro lado del hueco');
  assert.ok(s.x >= 10 * TILE - CUERPO_ANCHO, 'y del lado derecho');
});

/**
 * ## El terreno ajeno devuelve a la entrada (`UX-29 §3`, `§7.2`)
 */
const CON_MOLINETES = [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#A..C1...2I..B#',
  '###############',
];

test('🔴 el molinete devuelve al que declara, y a nadie más', () => {
  const { banco, nivel } = sala(CON_MOLINETES);
  const mundo = crearMundo(banco, nivel);
  const entrada = puntoDeEntrada(banco, nivel, 'skayboy');
  const sucesos = correr(mundo, mandos({ skayboy: { izquierda: true } }), 0.5);
  assert.ok(sucesos.some((s) => s.tipo === 'vuelta' && s.quien === 'skayboy'), 'C devuelve a skayboy');
  // Y quedó en la entrada, no en el molinete (con dedo encima vuelve a arrancar desde ahí).
  correr(mundo, mandos(), CUADRO);
  assert.equal(mundo.cuerpos.skayboy.y, entrada.y);

  // Control: `C` no devuelve a poligirl. La corremos a la izquierda hasta cruzarlo.
  const otro = crearMundo(banco, nivel);
  const vueltas = correr(otro, mandos({ poligirl: { izquierda: true } }), 3).filter((s) => s.tipo === 'vuelta');
  assert.deepEqual(vueltas, [], 'poligirl cruzó el molinete de skayboy sin volver');
  assert.ok(otro.cuerpos.poligirl.x < 5 * TILE, 'y siguió de largo');
});

test('🔴 el que vuelve a la entrada no mueve al otro ni le saca lo que consiguió (D-38 baranda 3)', () => {
  const { banco, nivel } = sala([
    '###############',
    '#.............#',
    '#.............#',
    '#.............#',
    '#.............#',
    '#.............#',
    '#.............#',
    '#A..C1..-2...B#',
    '###############',
  ]);
  const mundo = crearMundo(banco, nivel);
  const juntado = correr(mundo, mandos({ poligirl: { izquierda: true } }), 0.3);
  assert.ok(juntado.some((s) => s.tipo === 'tesoro' && s.quien === 'poligirl'));
  const antes = { x: mundo.cuerpos.poligirl.x, y: mundo.cuerpos.poligirl.y };

  const vuelta = correr(mundo, mandos({ skayboy: { izquierda: true } }), 0.5);
  assert.ok(vuelta.some((s) => s.tipo === 'vuelta' && s.quien === 'skayboy'));
  assert.deepEqual({ x: mundo.cuerpos.poligirl.x, y: mundo.cuerpos.poligirl.y }, antes);
  assert.equal(mundo.juntados.size, 1, 'el tesoro juntado sigue juntado');
});

test('🔴 volver a la entrada no bloquea el mando: el dedo responde en el cuadro siguiente', () => {
  const { banco, nivel } = sala(CON_MOLINETES);
  const mundo = crearMundo(banco, nivel);
  const entrada = puntoDeEntrada(banco, nivel, 'skayboy');
  hasta(mundo, mandos({ skayboy: { izquierda: true } }), (sucesos) => sucesos.some((s) => s.tipo === 'vuelta'));
  paso(mundo, mandos({ skayboy: { derecha: true } }), CUADRO);
  assert.ok(mundo.cuerpos.skayboy.x > entrada.x, 'se movió en el primer cuadro después de volver');
});

test('🔴 volver no tiene contador: el mundo no lleva la cuenta de cuántas veces pasó', () => {
  const { banco, nivel } = sala(CON_MOLINETES);
  const mundo = crearMundo(banco, nivel);
  correr(mundo, mandos({ skayboy: { izquierda: true } }), 5);
  const claves = [...Object.keys(mundo), ...Object.keys(mundo.cuerpos.skayboy)].join(' ');
  assert.ok(!/intento|vuelta|fracas|contador/i.test(claves), `apareció una cuenta: ${claves}`);
});

test('el tesoro se junta una vez, y solo lo junta el que figura en `para`', () => {
  const soloPoli = { ...BANCO.leyenda, p: { tipo: 'tesoro' as const, para: ['poligirl' as const] } };
  const { nivel } = sala([
    '###############',
    '#.............#',
    '#.............#',
    '#.............#',
    '#.............#',
    '#.............#',
    '#.............#',
    '#A..p1...2...B#',
    '###############',
  ]);
  const banco: Banco = { ...BANCO, leyenda: soloPoli, niveles: [nivel] };
  const mundo = crearMundo(banco, nivel);
  const ida = correr(mundo, mandos({ skayboy: { izquierda: true } }), 1);
  assert.ok(!ida.some((s) => s.tipo === 'tesoro'), 'skayboy pasó por arriba y no lo juntó');
  const poli = correr(mundo, mandos({ poligirl: { izquierda: true } }), 2);
  assert.deepEqual(poli.filter((s) => s.tipo === 'tesoro'), [{ tipo: 'tesoro', quien: 'poligirl' }]);
  const otra = correr(mundo, mandos({ poligirl: { derecha: true } }), 1);
  assert.ok(!otra.some((s) => s.tipo === 'tesoro'), 'y no se junta dos veces');
});

/**
 * ## Guitarras y cigarrillos (`D-47` punto 4, `CTR-16.4` versión 3, `BR-31` punto 2)
 *
 * Con la leyenda de verdad: se buscan por dueño y no por caracter, así que si mañana el cigarrillo
 * cambia de letra (o de objeto, que es lo que `D-47` avisa que puede pasar) esto no se entera. En
 * la sala de abajo el cigarrillo está en la 7 y la guitarra en la 8, entre las dos entradas: cada
 * uno, para llegar al suyo, pasa por arriba del del otro.
 */
function tesoroDe(banco: Banco, id: IdPersonaje): string {
  const par = Object.entries(banco.leyenda).find(([, t]) => t.tipo === 'tesoro' && t.para?.[0] === id);
  assert.ok(par, `la leyenda no trae un tesoro de ${id} (E9)`);
  return par[0];
}
const GUITARRA = tesoroDe(BANCO, 'skayboy');
const CIGARRILLO = tesoroDe(BANCO, 'poligirl');
const CRUZADOS = [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  `#A...1.${CIGARRILLO}${GUITARRA}.2..B#`,
  '###############',
];

test('🔴 D-47: la guitarra la junta Skayboy y el cigarrillo Poligirl; el del otro no se junta', () => {
  const { banco, nivel } = sala(CRUZADOS);
  const mundo = crearMundo(banco, nivel);
  assert.deepEqual(juntadosPorPersonaje(mundo), { skayboy: 0, poligirl: 0 });

  // Poligirl va hasta la pared de la izquierda: pasa por la guitarra (8) y por su cigarrillo (7).
  const ella = correr(mundo, mandos({ poligirl: { izquierda: true } }), 2);
  assert.deepEqual(ella.filter((s) => s.tipo === 'tesoro'), [{ tipo: 'tesoro', quien: 'poligirl' }], 'juntó uno solo, el suyo');
  assert.deepEqual([...mundo.juntados], ['7,7'], 'y es el cigarrillo: la guitarra sigue en su celda');
  assert.deepEqual(juntadosPorPersonaje(mundo), { skayboy: 0, poligirl: 1 });

  // Skayboy va hasta la pared de la derecha: pasa por el cigarrillo ya juntado y por su guitarra.
  const el = correr(mundo, mandos({ skayboy: { derecha: true } }), 2);
  assert.deepEqual(el.filter((s) => s.tipo === 'tesoro'), [{ tipo: 'tesoro', quien: 'skayboy' }], 'juntó la suya');
  assert.deepEqual([...mundo.juntados].sort(), ['7,7', '8,7']);
  assert.deepEqual(juntadosPorPersonaje(mundo), { skayboy: 1, poligirl: 1 });
});

test('🔴 D-47: el otro pasa por encima del tesoro ajeno como por aire, caminando y saltando', () => {
  // La misma sala con aire donde están los tesoros: el cuerpo que no es el dueño tiene que hacer,
  // cuadro por cuadro, exactamente lo mismo en las dos. Y con los tesoros también en la fila 6,
  // que es por donde pasa la cabeza de un salto corto.
  const conAire = CRUZADOS.map((r) => r.replaceAll(CIGARRILLO, '.').replaceAll(GUITARRA, '.'));
  const enAlto = CRUZADOS.map((r, f) => (f === 6 ? `#......${CIGARRILLO}${GUITARRA}.....#` : r));
  for (const [quien, hacia, dueno] of [
    ['poligirl', 'izquierda', 'la guitarra'],
    ['skayboy', 'derecha', 'el cigarrillo'],
  ] as const) {
    for (const grilla of [CRUZADOS, enAlto]) {
      for (const saltar of [false, true]) {
        const m = mandos({ [quien]: { [hacia]: true, saltar } });
        const conTesoro = crearMundo(sala(grilla).banco, sala(grilla).nivel);
        const vara = crearMundo(sala(conAire).banco, sala(conAire).nivel);
        const sucesos: Suceso[] = [];
        for (let i = 0; i < 90; i++) {
          sucesos.push(...paso(conTesoro, m, CUADRO));
          paso(vara, m, CUADRO);
          const a = conTesoro.cuerpos[quien];
          const b = vara.cuerpos[quien];
          assert.deepEqual([a.x, a.y, a.enSuelo], [b.x, b.y, b.enSuelo], `${quien} ${saltar ? 'saltando' : 'caminando'}: en el cuadro ${i} ${dueno} lo frenó o lo movió`);
        }
        assert.ok(!sucesos.some((s) => s.tipo === 'vuelta'), `${quien}: ${dueno} no la devuelve a la entrada`);
        // Control: pasó de verdad por la columna del tesoro del otro.
        const x = conTesoro.cuerpos[quien].x;
        assert.ok(quien === 'poligirl' ? x < 7 * TILE : x > 8 * TILE, `${quien}: control, cruzó las dos columnas`);
      }
    }
  }
});

test('la pose: de frente sin dedo, de perfil con dedo (UX-28 §3)', () => {
  const { banco, nivel } = sala(DE_NADIE);
  const mundo = crearMundo(banco, nivel);
  assert.equal(poseDe(mundo.cuerpos.skayboy), 'frente');
  paso(mundo, mandos({ skayboy: { derecha: true } }), CUADRO);
  assert.equal(poseDe(mundo.cuerpos.skayboy), 'perfil-corre');
  assert.equal(mundo.cuerpos.skayboy.mira, 1);
  assert.equal(poseDe(mundo.cuerpos.poligirl), 'frente', 'el otro sigue de frente, esperando');
  paso(mundo, mandos({ skayboy: { saltar: true } }), CUADRO);
  assert.equal(poseDe(mundo.cuerpos.skayboy), 'perfil-aire');
  paso(mundo, mandos(), CUADRO);
  assert.equal(poseDe(mundo.cuerpos.skayboy), 'frente', 'soltar en el aire vuelve a la pose de espera');
});

test('el mismo mando da el mismo mundo: la simulación no tiene azar ni reloj propio', () => {
  const a = crearMundo(BANCO, BANCO.niveles[0]);
  const b = crearMundo(BANCO, BANCO.niveles[0]);
  const m = mandos({ skayboy: { izquierda: true, saltar: true }, poligirl: { derecha: true } });
  correr(a, m, 1.3);
  correr(b, m, 1.3);
  assert.deepEqual(a.cuerpos, b.cuerpos);
  assert.equal(a.tiempo, b.tiempo);
});

/**
 * ## El paso fijo de la isla (`ADR-09.1`, `T-267`)
 *
 * La isla no se puede cargar en Node —toca el DOM al importarla—, así que el reparto del reloj
 * del motor en cuadros vive en `mundo.ts` como función pura, y se prueba acá con sus tres
 * reglas: cuadros enteros, tope por tic, y lo que no entra en el tope se tira. `motor.test.ts`
 * mira del otro lado que la isla lo use y que `paso()` reciba siempre `CUADRO_SEG`.
 */

/** Juega esos tics desde `inicio` y devuelve cuántos cuadros le tocaron a cada uno. */
function tics(dts: readonly number[], inicio = FASE_SEG): number[] {
  let acumulado = inicio;
  return dts.map((dt) => {
    const r = repartirEnCuadros(acumulado, dt);
    acumulado = r.acumulado;
    return r.cuadros;
  });
}

test('un cuadro son dos subpasos exactos, y el tope por tic es PASO_MAXIMO_SEG dicho en cuadros', () => {
  assert.equal(CUADRO_SEG, 2 * SUBPASO_SEG, '1/60 es 2 × 1/120 sin redondeo: la garantía del subpaso queda escrita tal cual');
  assert.equal(TOPE_CUADROS_POR_TIC, 3);
  assert.equal(TOPE_CUADROS_POR_TIC, Math.round(PASO_MAXIMO_SEG / CUADRO_SEG), 'se deriva: si una se mueve, la otra la sigue');
  const mundo = crearMundo(BANCO, BANCO.niveles[0]);
  paso(mundo, mandos(), CUADRO_SEG);
  assert.equal(mundo.tiempo, CUADRO_SEG, 'un paso de un cuadro avanza el reloj de la partida exactamente un cuadro');
});

test('🔴 a 60 Hz, un cuadro por tic, aunque el tic tiemble hasta casi medio cuadro para cada lado', () => {
  assert.deepEqual([...new Set(tics(Array<number>(600).fill(CUADRO_SEG)))], [1]);

  // El temblor es del instante en que llega cada tic, no del intervalo: cada uno cae a menos de
  // medio cuadro de donde tocaba. Con semilla fija, para que un rojo se pueda repetir.
  let semilla = 7;
  const azar = (): number => (semilla = (semilla * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
  const instantes = Array.from({ length: 600 }, (_, n) => (n + 1) * CUADRO_SEG + (azar() - 0.5) * 0.98 * CUADRO_SEG);
  const dts = instantes.map((t, n) => t - (n === 0 ? 0 : instantes[n - 1]));
  assert.deepEqual([...new Set(tics(dts))], [1], 'con medio cuadro de fase, el temblor no cambia la cuenta');

  // Control: el mismo temblor sin la fase corre cero cuadros en un tic y dos en el siguiente,
  // que es el tirón que se ve (`ADR-09.1`, "el medio cuadro de fase").
  const sinFase = new Set(tics(dts, 0));
  assert.ok(sinFase.has(0) && sinFase.has(2), `sin fase tenía que tironear y dio ${[...sinFase].join(', ')}`);
});

test('🔴 a 20 tics por segundo, tres cuadros por tic; más lento que eso, tope, y lo que sobra se tira', () => {
  assert.deepEqual([...new Set(tics(Array<number>(60).fill(PASO_MAXIMO_SEG)))], [3], 'a 20 Hz, tres por tic, y nada se tira');

  // A 10 tics por segundo el juego va en cámara lenta: tres cuadros por tic y no seis. Es lo
  // honesto: un cuerpo que avanza de golpe lo que el teléfono no dibujó hizo algo que nadie vio.
  let acumulado = FASE_SEG;
  for (let i = 0; i < 20; i++) {
    const r = repartirEnCuadros(acumulado, 0.1);
    assert.equal(r.cuadros, TOPE_CUADROS_POR_TIC);
    assert.equal(r.acumulado, FASE_SEG, 'lo que no entró en el tope se tira: el acumulador vuelve a la fase');
    acumulado = r.acumulado;
  }
  // La pestaña que se escondió cinco segundos y volvió: tres cuadros, no trescientos.
  assert.deepEqual(repartirEnCuadros(FASE_SEG, 5), { cuadros: TOPE_CUADROS_POR_TIC, acumulado: FASE_SEG });
});

test('a 120 Hz, un cuadro cada dos tics; y un dt que no es un número positivo no suma nada', () => {
  assert.deepEqual(tics(Array<number>(8).fill(1 / 120)), [1, 0, 1, 0, 1, 0, 1, 0]);
  for (const dt of [0, -0.5, Number.NaN]) {
    assert.deepEqual(repartirEnCuadros(FASE_SEG, dt), { cuadros: 0, acumulado: FASE_SEG }, `dt = ${dt}`);
  }
});

/**
 * ## El tic entero: `crearReloj()` y `jugarTic()`
 *
 * Es lo que la isla llama, y lo único que llama con el tiempo del motor (`motor.test.ts` lo
 * vigila). Cada línea del tic tiene su rojo acá: el reloj arranca en la fase y no en cero; se
 * queda con lo que sobró (sin eso, a 120 Hz cada tic juega un cuadro y el juego corre al
 * doble); juega los cuadros del reparto y no uno por tic (a 30 Hz son dos); el reparto recibe
 * el `dt` del tic y no un cuadro fijo; y cada cuadro es un `paso(…, CUADRO_SEG)`.
 *
 * La vara es independiente de `jugarTic()`: `tics()` de arriba cuenta los cuadros de cada tic
 * con `repartirEnCuadros()` a mano, y el mundo de referencia se juega con esa cuenta y `paso()`.
 * Además cada frecuencia trae su cuenta escrita, para que un reparto roto no se valide solo.
 */

/**
 * Los mandos del tic `n`: **los dos caminan a la izquierda**, y Skayboy salta de a ratos. Él va a
 * su puerta y junta en el camino su guitarra; ella va a la puerta de él y pasa por arriba de la
 * guitarra sin juntarla (`D-47`: cada uno junta la suya). Que nadie gane es a propósito: una
 * partida ganada deja de avanzar el reloj, y la cuenta de cuadros tiene que poder leerse en
 * `mundo.tiempo` hasta el final. *(Hasta `T-303` cada uno iba a la puerta del otro juntando el
 * tesoro de los dos; con un coleccionable para cada uno, ese camino ya no junta nada.)*
 */
function mandosDelTic(n: number, porSegundo: number): Mandos {
  const salta = Math.floor((n / porSegundo) * 4) % 2 === 1;
  return mandos({ skayboy: { izquierda: true, saltar: salta }, poligirl: { izquierda: true } });
}

/** Juega esos tics con `jugarTic()` sobre `NIV-01`. */
function conElReloj(dts: readonly number[], porSegundo: number): { mundo: Mundo; sucesos: Suceso[] } {
  const mundo = crearMundo(BANCO, BANCO.niveles[0]);
  const reloj = crearReloj();
  const sucesos: Suceso[] = [];
  dts.forEach((dt, n) => sucesos.push(...jugarTic(reloj, mundo, mandosDelTic(n, porSegundo), dt)));
  return { mundo, sucesos };
}

/** Los mismos tics a mano: la cuenta de `tics()` y `paso(…, CUADRO_SEG)` esa cantidad de veces. */
function aMano(dts: readonly number[], porSegundo: number): { mundo: Mundo; sucesos: Suceso[]; cuadros: number } {
  const mundo = crearMundo(BANCO, BANCO.niveles[0]);
  const sucesos: Suceso[] = [];
  const cuentas = tics(dts);
  cuentas.forEach((c, n) => {
    for (let i = 0; i < c; i++) sucesos.push(...paso(mundo, mandosDelTic(n, porSegundo), CUADRO_SEG));
  });
  return { mundo, sucesos, cuadros: cuentas.reduce((a, b) => a + b, 0) };
}

test('🔴 el reloj nace en la fase, y cada reloj es suyo', () => {
  const uno = crearReloj();
  assert.equal(uno.acumulado, FASE_SEG, 'en cero, una pantalla de 60 Hz tironea (ver FASE_SEG)');
  assert.notEqual(crearReloj(), uno, 'un reloj compartido junta el tiempo de dos partidas');
  // El primer tic de una pantalla de 120 Hz ya juega un cuadro: la fase más medio cuadro.
  const mundo = crearMundo(BANCO, BANCO.niveles[0]);
  jugarTic(uno, mundo, mandos(), 1 / 120);
  assert.equal(mundo.tiempo, CUADRO_SEG);
  assert.equal(uno.acumulado, 0, 'y el reloj se quedó con lo que sobró, que es nada');
});

for (const [nombre, porSegundo, dts, cuadros] of [
  ['🔴 a 120 Hz, un cuadro cada dos tics: dos segundos son 120 cuadros, no 240', 120, Array<number>(240).fill(1 / 120), 120],
  ['🔴 a 30 Hz, dos cuadros por tic: dos segundos son 120 cuadros, no 60', 30, Array<number>(60).fill(1 / 30), 120],
  ['🔴 a 10 Hz, tope de tres por tic: cuatro segundos son 120 cuadros, no 240', 10, Array<number>(40).fill(0.1), 120],
  [
    'a 144 Hz con temblor, la cuenta sale del reparto',
    144,
    Array.from({ length: 288 }, (_, n) => (1 / 144) * (1 + 0.3 * Math.sin(n))),
    null,
  ],
] as const) {
  test(`${nombre} (jugarTic, ADR-09.1)`, () => {
    const hecho = conElReloj(dts, porSegundo);
    const vara = aMano(dts, porSegundo);
    if (cuadros !== null) assert.equal(vara.cuadros, cuadros, 'la vara misma: la cuenta escrita de esta frecuencia');
    assert.equal(
      Math.round(hecho.mundo.tiempo / CUADRO_SEG),
      vara.cuadros,
      `jugó ${Math.round(hecho.mundo.tiempo / CUADRO_SEG)} cuadros y el reparto daba ${vara.cuadros}`,
    );
    assert.equal(hecho.mundo.tiempo, vara.mundo.tiempo);
    assert.deepEqual(hecho.mundo.cuerpos, vara.mundo.cuerpos, 'bit a bit: cada cuadro es un paso(…, CUADRO_SEG)');
    assert.deepEqual(hecho.sucesos, vara.sucesos, 'devuelve los sucesos de todos los cuadros del tic, en orden');
  });
}

test('control: la vara de jugarTic tiene algo que mirar (sucesos, y cuerpos que se movieron)', () => {
  const { mundo, sucesos } = conElReloj(Array<number>(60).fill(1 / 30), 30);
  assert.ok(sucesos.some((s) => s.tipo === 'tesoro'), 'sin sucesos, "devuelve todos los sucesos" no prueba nada');
  assert.equal(mundo.terminado, false, 'una partida ganada para el reloj, y la cuenta de cuadros deja de leerse');
  const quieto = crearMundo(BANCO, BANCO.niveles[0]);
  assert.notDeepEqual(mundo.cuerpos, quieto.cuerpos, 'con los dos quietos, comparar cuerpos no prueba nada');
});

/**
 * ## Los mecanismos (`CTR-16.10`, `T-272`)
 *
 * Palanca, placa, compuerta y caja, con los casos `M1` a `M7` de `CTR-16.10.10` y lo que pidió el
 * plan: la placa sin nadie encima cierra, la compuerta no se cierra con alguien adentro, la
 * palanca vuelve a reposo cruzada hacia la izquierda y no cambia si se la salta, la caja no
 * atraviesa un sólido ni se empuja con algo encima ni contra alguien, y ningún cuerpo empuja ni
 * carga al otro (`BR-23` punto 4).
 *
 * **Cada sala de acá es un nivel que el banco admite** —pasa `problemasDelBanco()`, `E1` a `E8`—:
 * una prueba sobre una sala imposible probaría una física que ningún nivel va a usar. Cuando una
 * prueba pone a alguien a mano (`ponerEn()`), lo dice.
 */

/** Una sala con piezas, que además tiene que ser un nivel sano. */
function salaCon(
  grilla: string[],
  mecanismos: readonly MecanismoDelNivel[] = [],
  compuertas: readonly CompuertaDelNivel[] = [],
): { banco: Banco; nivel: Nivel } {
  const nivel: Nivel = { ...sala(grilla).nivel, mecanismos, compuertas };
  const banco: Banco = { ...BANCO, niveles: [nivel] };
  assert.deepEqual(problemasDelBanco(banco), [], 'la sala de prueba tiene que ser un nivel que el banco admite');
  return { banco, nivel };
}

const compuertasDe = (sucesos: readonly Suceso[]): Suceso[] => sucesos.filter((s) => s.tipo === 'compuerta');

/** Pone un cuerpo a mano, parado: en el piso de la fila 8 si no se dice otra altura. */
function ponerEn(c: Cuerpo, x: number, y = 8 * TILE - CUERPO_ALTO): void {
  c.x = x;
  c.y = y;
  c.vx = 0;
  c.vy = 0;
  c.enSuelo = true;
}

/** El medio de los pies, que es lo que pisa una placa y lo que cruza una palanca. */
const medio = (c: Cuerpo): number => c.x + CUERPO_ANCHO / 2;

/** Si una caja y un cuerpo se meten uno en el otro. Apoyarse no es meterse. */
function seMeten(k: Caja, c: Cuerpo): boolean {
  const eps = 1e-6;
  return k.x < c.x + CUERPO_ANCHO - eps && c.x < k.x + TILE - eps && k.y < c.y + CUERPO_ALTO - eps && c.y < k.y + TILE - eps;
}

/** Todo lo que se mueve en el mundo, salvo el reloj: para ver que la sala quieta no cambia. */
const sinReloj = (m: Mundo): string =>
  JSON.stringify({
    cuerpos: m.cuerpos,
    juntados: [...m.juntados].sort(),
    palancas: m.palancas,
    placas: m.placas,
    compuertas: m.compuertas,
    cajas: m.cajas,
    terminado: m.terminado,
  });

/** Una placa en la columna 3 que manda una compuerta de tres celdas en la columna 8. */
const PLACA = [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.......#.....#',
  '#.......|.....#',
  '#.......|.....#',
  '#A1=..2.|....B#',
  '###############',
];
const salaPlaca = () => salaCon(PLACA, [{ id: 'MEC-01', en: [3, 7], abre: ['COM-01'] }], [{ id: 'COM-01', en: [8, 5] }]);

test('🔴 M1: la placa abre en el subpaso en que la pisan, y sin nadie encima cierra en el subpaso en que la sueltan', () => {
  const { banco, nivel } = salaPlaca();
  const mundo = crearMundo(banco, nivel);
  const s = mundo.cuerpos.skayboy;
  const columna = (): number => Math.floor(medio(s) / TILE);
  const derecha = mandos({ skayboy: { derecha: true } });
  assert.deepEqual([mundo.placas[0].pisada, mundo.compuertas[0].abierta], [false, false], 'arranca libre y cerrada');

  let abre: Suceso[] = [];
  for (let i = 0; i < 400 && abre.length === 0; i++) {
    const antes = columna();
    abre = compuertasDe(paso(mundo, derecha, SUBPASO_SEG));
    if (abre.length === 0) assert.notEqual(columna(), 3, 'con los pies en la placa, la compuerta seguía cerrada');
    else assert.ok(antes !== 3 && columna() === 3, 'se abrió justo en el subpaso en que la pisó');
  }
  assert.deepEqual(abre, [{ tipo: 'compuerta', id: 'COM-01', abierta: true, por: 'skayboy' }]);
  assert.equal(mundo.compuertas[0].abierta, true);

  let cierra: Suceso[] = [];
  for (let i = 0; i < 400 && cierra.length === 0; i++) {
    cierra = compuertasDe(paso(mundo, derecha, SUBPASO_SEG));
    if (cierra.length === 0) assert.equal(columna(), 3, 'ya no la pisaba nadie, y la compuerta seguía abierta');
  }
  assert.equal(columna(), 4, 'se cerró justo en el subpaso en que la soltó');
  assert.deepEqual(cierra, [{ tipo: 'compuerta', id: 'COM-01', abierta: false, por: 'skayboy' }], 'y la cerró él');
  assert.deepEqual([mundo.placas[0].pisada, mundo.compuertas[0].abierta], [false, false]);
});

test('🔴 M1: el que salta de una placa la suelta, y al caer la vuelve a pisar', () => {
  const { banco, nivel } = salaPlaca();
  const mundo = crearMundo(banco, nivel);
  const s = mundo.cuerpos.skayboy;
  // Hasta el medio de la placa, para que el salto en el lugar caiga adentro.
  hasta(mundo, mandos({ skayboy: { derecha: true } }), () => medio(s) >= 3 * TILE + TILE / 2);
  assert.equal(mundo.compuertas[0].abierta, true, 'control: parado en la placa, abierta');
  const despega = compuertasDe(paso(mundo, mandos({ skayboy: { saltar: true } }), SUBPASO_SEG));
  assert.equal(s.enSuelo, false, 'control: despegó en ese subpaso');
  assert.deepEqual(despega, [{ tipo: 'compuerta', id: 'COM-01', abierta: false, por: 'skayboy' }], 'un cuerpo en el aire no la pisa');
  const vuelve = compuertasDe(hasta(mundo, mandos(), () => s.enSuelo));
  assert.deepEqual(vuelve, [{ tipo: 'compuerta', id: 'COM-01', abierta: true, por: 'skayboy' }], 'al caer la pisa otra vez');
});

test('🔴 M4: la compuerta no se cierra con alguien adentro: espera abierta, no lo mueve, y cuando sale la cierra el lugar', () => {
  const { banco, nivel } = salaPlaca();
  const mundo = crearMundo(banco, nivel);
  const p = mundo.cuerpos.poligirl;
  hasta(mundo, mandos({ skayboy: { derecha: true } }), () => mundo.placas[0].pisada);
  assert.equal(mundo.compuertas[0].abierta, true, 'control: Skayboy en la placa, abierta');
  // Poligirl entra al tramo (columna 8, de 128 a 144) y se queda entera adentro.
  hasta(mundo, mandos({ poligirl: { derecha: true } }), () => p.x >= 8 * TILE + 1);
  assert.ok(p.x + CUERPO_ANCHO <= 9 * TILE, 'control: está entera adentro del tramo');
  const quieta = { x: p.x, y: p.y };

  const suelta = correr(mundo, mandos({ skayboy: { izquierda: true } }), 1);
  assert.equal(mundo.placas[0].pisada, false, 'control: Skayboy soltó la placa');
  assert.deepEqual(compuertasDe(suelta), [], 'mandada a cerrar con alguien adentro: no se cierra ni avisa nada');
  assert.equal(mundo.compuertas[0].abierta, true);
  assert.deepEqual({ x: p.x, y: p.y }, quieta, 'y a ella no la movió nada');
  assert.ok(!suelta.some((x) => x.tipo === 'vuelta'), 'ni la devolvió a la entrada');

  let cierre: Suceso[] = [];
  for (let i = 0; i < 120 && cierre.length === 0; i++) {
    cierre = compuertasDe(paso(mundo, mandos({ poligirl: { derecha: true } }), CUADRO));
    if (cierre.length === 0) assert.ok(p.x < 9 * TILE, 'con el tramo libre tenía que cerrarse');
  }
  assert.ok(p.x >= 9 * TILE, 'se cerró en el cuadro en que el tramo quedó libre, no antes');
  assert.deepEqual(cierre, [{ tipo: 'compuerta', id: 'COM-01', abierta: false, por: null }], 'la cerró el lugar, no alguien');
});

/** Una placa en el medio de la sala (columna 7): para ponerlos a mano uno de cada lado. */
const PLACA_EN_EL_MEDIO = [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#...........#.#',
  '#...........|.#',
  '#...........|.#',
  '#A1....=...2|B#',
  '###############',
];

test('🔴 M7: lo que hacen los dos a la vez no es de ninguno: pisan la misma placa en el mismo subpaso, y se bajan juntos', () => {
  const { banco, nivel } = salaCon(PLACA_EN_EL_MEDIO, [{ id: 'MEC-01', en: [7, 7], abre: ['COM-01'] }], [{ id: 'COM-01', en: [12, 5] }]);
  // A mano, a la misma distancia de la placa (columna 7, de 112 a 128), uno de cada lado: el
  // medio de los pies a 1,1 px afuera. Caminando uno hacia el otro, entran los dos en el segundo
  // subpaso del cuadro.
  const juntos = crearMundo(banco, nivel);
  ponerEn(juntos.cuerpos.skayboy, 7 * TILE - 1.1 - CUERPO_ANCHO / 2);
  ponerEn(juntos.cuerpos.poligirl, 8 * TILE + 1.1 - CUERPO_ANCHO / 2);
  const llegan = compuertasDe(paso(juntos, mandos({ skayboy: { derecha: true }, poligirl: { izquierda: true } }), CUADRO));
  assert.equal(Math.floor(medio(juntos.cuerpos.skayboy) / TILE), 7, 'control: Skayboy la pisa');
  assert.equal(Math.floor(medio(juntos.cuerpos.poligirl) / TILE), 7, 'control: Poligirl la pisa');
  assert.deepEqual(llegan, [{ tipo: 'compuerta', id: 'COM-01', abierta: true, por: null }], 'una sola apertura, y de ninguno');
  const seVan = compuertasDe(paso(juntos, mandos({ skayboy: { izquierda: true }, poligirl: { derecha: true } }), CUADRO));
  assert.deepEqual(seVan, [{ tipo: 'compuerta', id: 'COM-01', abierta: false, por: null }], 'un solo cierre, y de ninguno');

  // Control: uno solo, desde cualquiera de los dos lados, y la apertura es suya.
  for (const [quien, x, mando] of [
    ['skayboy', 7 * TILE - 1.1 - CUERPO_ANCHO / 2, { derecha: true }],
    ['poligirl', 8 * TILE + 1.1 - CUERPO_ANCHO / 2, { izquierda: true }],
  ] as const) {
    const solo = crearMundo(banco, nivel);
    ponerEn(solo.cuerpos[quien], x);
    assert.deepEqual(compuertasDe(paso(solo, mandos({ [quien]: mando }), CUADRO)), [
      { tipo: 'compuerta', id: 'COM-01', abierta: true, por: quien },
    ]);
  }
});

/** Una palanca en la columna 7 que manda una compuerta en la 12. */
const PALANCA = [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#...........#.#',
  '#...........|.#',
  '#...........|.#',
  '#A1..../...2|B#',
  '###############',
];

test('🔴 la palanca queda para el lado que la cruzaste caminando: vuelve a reposo hacia la izquierda, y saltarla no la mueve', () => {
  const { banco, nivel } = salaCon(PALANCA, [{ id: 'MEC-01', en: [7, 7], abre: ['COM-01'] }], [{ id: 'COM-01', en: [12, 5] }]);
  const mundo = crearMundo(banco, nivel);
  const s = mundo.cuerpos.skayboy;
  const palanca = mundo.palancas[0];
  const centro = 7 * TILE + TILE / 2;
  const caminar = (tecla: 'izquierda' | 'derecha', listo: () => boolean): Suceso[] => {
    const sucesos: Suceso[] = [];
    for (let i = 0; i < 400 && !listo(); i++) sucesos.push(...paso(mundo, mandos({ skayboy: { [tecla]: true } }), CUADRO));
    assert.ok(listo(), `caminando a la ${tecla} no llegó`);
    return sucesos;
  };
  const saltarHacia = (tecla: 'izquierda' | 'derecha'): Suceso[] => {
    const sucesos = [...paso(mundo, mandos({ skayboy: { [tecla]: true, saltar: true } }), CUADRO)];
    sucesos.push(...caminar(tecla, () => s.enSuelo));
    assert.ok(sucesos.some((x) => x.tipo === 'salto'), 'control: saltó');
    return sucesos;
  };
  const lejosALaIzquierda = (): boolean => medio(s) < centro - 6;
  const lejosALaDerecha = (): boolean => medio(s) > centro + 6;
  assert.equal(palanca.activa, false, 'arranca en reposo');

  let sucesos = caminar('derecha', lejosALaDerecha);
  assert.equal(palanca.activa, true, 'cruzada caminando hacia la derecha: activa');
  assert.deepEqual(compuertasDe(sucesos), [{ tipo: 'compuerta', id: 'COM-01', abierta: true, por: 'skayboy' }]);

  sucesos = caminar('izquierda', lejosALaIzquierda);
  assert.equal(palanca.activa, false, 'cruzada caminando hacia la izquierda: vuelve a reposo');
  assert.deepEqual(compuertasDe(sucesos), [{ tipo: 'compuerta', id: 'COM-01', abierta: false, por: 'skayboy' }]);

  sucesos = saltarHacia('derecha');
  assert.ok(lejosALaDerecha(), 'control: la pasó por arriba');
  assert.equal(palanca.activa, false, 'saltada hacia la derecha, sigue en reposo');
  assert.deepEqual(compuertasDe(sucesos), []);

  sucesos = caminar('izquierda', lejosALaIzquierda);
  assert.equal(palanca.activa, false, 'en reposo y cruzada hacia la izquierda, queda como estaba');
  assert.deepEqual(compuertasDe(sucesos), []);

  caminar('derecha', lejosALaDerecha);
  assert.equal(palanca.activa, true, 'control: activa otra vez');
  sucesos = saltarHacia('izquierda');
  assert.ok(lejosALaIzquierda(), 'control: la pasó por arriba');
  assert.equal(palanca.activa, true, 'saltada hacia la izquierda, sigue activa: volver sobre tus pasos por arriba no deshace nada');
  assert.deepEqual(compuertasDe(sucesos), []);

  // Pararse encima y darse vuelta: sin cruce no hay cambio. Subpaso por subpaso, hasta quedar a
  // menos de un paso del centro sin pasarlo.
  caminar('izquierda', () => medio(s) < centro - 30);
  const unPaso = VELOCIDAD * SUBPASO_SEG;
  for (let i = 0; i < 200 && medio(s) + unPaso < centro; i++) paso(mundo, mandos({ skayboy: { derecha: true } }), SUBPASO_SEG);
  assert.ok(medio(s) < centro && medio(s) + unPaso >= centro, 'control: parado encima, a menos de un paso del centro');
  sucesos = caminar('izquierda', lejosALaIzquierda);
  assert.equal(palanca.activa, true, 'se acercó al centro, se dio vuelta, y la palanca no se enteró');
  assert.deepEqual(compuertasDe(sucesos), []);
});

test('🔴 la palanca: un salto que despega pegado al centro la cruza en el aire, y no la mueve', () => {
  // La prueba de arriba salta de lejos: los pies dejan la fila de la palanca antes del centro, y
  // la fila sola ya la protege. Esta despega a menos de un paso del centro y lo cruza en el primer
  // subpaso del salto, con los pies todavía en la fila: lo único que la cuida es pedir suelo.
  const { banco, nivel } = salaCon(PALANCA, [{ id: 'MEC-01', en: [7, 7], abre: ['COM-01'] }], [{ id: 'COM-01', en: [12, 5] }]);
  const mundo = crearMundo(banco, nivel);
  const s = mundo.cuerpos.skayboy;
  const centro = 7 * TILE + TILE / 2;
  const unPaso = VELOCIDAD * SUBPASO_SEG;
  for (let i = 0; i < 400 && medio(s) + unPaso < centro; i++) paso(mundo, mandos({ skayboy: { derecha: true } }), SUBPASO_SEG);
  assert.ok(medio(s) < centro && medio(s) + unPaso >= centro, 'control: a menos de un paso del centro');
  const sucesos = [...paso(mundo, mandos({ skayboy: { derecha: true, saltar: true } }), SUBPASO_SEG)];
  assert.ok(medio(s) >= centro && !s.enSuelo, 'control: lo cruzó en el subpaso en que despegó');
  assert.equal(Math.floor((s.y + CUERPO_ALTO - 1) / TILE), 7, 'control: con los pies todavía en la fila de la palanca');
  sucesos.push(...hasta(mundo, mandos({ skayboy: { derecha: true } }), () => s.enSuelo));
  assert.equal(mundo.palancas[0].activa, false, 'cruzada en el aire, sigue en reposo');
  assert.deepEqual(compuertasDe(sucesos), []);
});

/** La palanca en el piso, debajo de una cornisa por la que se camina: la cornisa cruza su columna. */
const PALANCA_BAJO_UNA_CORNISA = [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#....1......#.#',
  '#...######..|.#',
  '#...........|.#',
  '#A....../..2|B#',
  '###############',
];

test('🔴 la palanca: caminar por arriba de su columna en otra fila no la mueve; hay que cruzarla con los pies en su fila', () => {
  const { banco, nivel } = salaCon(PALANCA_BAJO_UNA_CORNISA, [{ id: 'MEC-01', en: [8, 7], abre: ['COM-01'] }], [{ id: 'COM-01', en: [12, 5] }]);
  const mundo = crearMundo(banco, nivel);
  const s = mundo.cuerpos.skayboy;
  const centro = 8 * TILE + TILE / 2;
  let sucesos: Suceso[] = [];
  for (let i = 0; i < 200 && medio(s) < centro + 10; i++) sucesos.push(...paso(mundo, mandos({ skayboy: { derecha: true } }), CUADRO));
  assert.ok(s.enSuelo && s.y + CUERPO_ALTO === 5 * TILE, 'control: cruzó la columna de la palanca caminando por la cornisa');
  assert.equal(mundo.palancas[0].activa, false, 'desde la cornisa, la palanca no se enteró');
  assert.deepEqual(compuertasDe(sucesos), []);
  // Control: baja de la cornisa y la cruza en el piso, primero hacia la izquierda y después hacia la derecha.
  hasta(mundo, mandos({ skayboy: { derecha: true } }), () => s.enSuelo && s.y + CUERPO_ALTO === 8 * TILE);
  hasta(mundo, mandos({ skayboy: { izquierda: true } }), () => medio(s) < centro - 10);
  sucesos = [];
  for (let i = 0; i < 200 && medio(s) < centro + 10; i++) sucesos.push(...paso(mundo, mandos({ skayboy: { derecha: true } }), CUADRO));
  assert.equal(mundo.palancas[0].activa, true, 'control: en el piso, la cruzó y quedó activa');
  assert.deepEqual(compuertasDe(sucesos), [{ tipo: 'compuerta', id: 'COM-01', abierta: true, por: 'skayboy' }]);
});

test('🔴 la palanca: dos cruces opuestos en el mismo subpaso se anulan, para cualquier lado que esté (regla 4)', () => {
  const { banco, nivel } = salaCon(PALANCA, [{ id: 'MEC-01', en: [7, 7], abre: ['COM-01'] }], [{ id: 'COM-01', en: [12, 5] }]);
  const centro = 7 * TILE + TILE / 2;
  const izquierda = centro - 0.3 - CUERPO_ANCHO / 2;
  const derecha = centro + 0.3 - CUERPO_ANCHO / 2;
  /** Un subpaso con los dos puestos a mano pegados al centro, y de qué lado quedó la palanca. */
  const cruzan = (activa: boolean, quienes: readonly (readonly [IdPersonaje, 'izquierda' | 'derecha'])[]): { activa: boolean; sucesos: Suceso[] } => {
    const mundo = crearMundo(banco, nivel);
    const sucesos: Suceso[] = [];
    if (activa) {
      // A mano, cruzándola hacia la derecha: un subpaso y queda activa, con la compuerta abierta.
      ponerEn(mundo.cuerpos.skayboy, izquierda);
      paso(mundo, mandos({ skayboy: { derecha: true } }), SUBPASO_SEG);
      assert.deepEqual([mundo.palancas[0].activa, mundo.compuertas[0].abierta], [true, true], 'control: activa');
    }
    for (const [id, hacia] of quienes) ponerEn(mundo.cuerpos[id], hacia === 'derecha' ? izquierda : derecha);
    sucesos.push(...paso(mundo, mandos(Object.fromEntries(quienes.map(([id, hacia]) => [id, { [hacia]: true }]))), SUBPASO_SEG));
    for (const [id, hacia] of quienes) {
      const lado = medio(mundo.cuerpos[id]) < centro ? 'izquierda' : 'derecha';
      assert.equal(lado, hacia, `control: ${id} la cruzó hacia la ${hacia} en ese subpaso`);
    }
    return { activa: mundo.palancas[0].activa, sucesos };
  };
  // Activa: Skayboy la cruza hacia la derecha y Poligirl hacia la izquierda. Y en reposo, al revés.
  for (const [activa, quienes] of [
    [true, [['skayboy', 'derecha'], ['poligirl', 'izquierda']]],
    [false, [['skayboy', 'izquierda'], ['poligirl', 'derecha']]],
  ] as const) {
    const r = cruzan(activa, quienes);
    assert.equal(r.activa, activa, `${activa ? 'activa' : 'en reposo'}, cruzada para los dos lados a la vez: quedó como estaba`);
    assert.deepEqual(compuertasDe(r.sucesos), []);
    // Control: el que la cruza hacia el lado contrario, solo, sí la cambia.
    const [solo] = quienes.filter(([, hacia]) => (hacia === 'derecha') !== activa);
    assert.equal(cruzan(activa, [solo]).activa, !activa, `control: ${solo[0]} solo la cambia`);
  }
});

/** Una palanca entre la entrada de Skayboy y un molinete de los dos. */
const PALANCA_Y_MOLINETE = [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#...........#.#',
  '#...........|.#',
  '#...........|.#',
  '#A1..../..X2|B#',
  '###############',
];

test('🔴 la palanca: volver a la entrada no la cruza, aunque la entrada esté del otro lado', () => {
  const { banco, nivel } = salaCon(PALANCA_Y_MOLINETE, [{ id: 'MEC-01', en: [7, 7], abre: ['COM-01'] }], [{ id: 'COM-01', en: [12, 5] }]);
  const mundo = crearMundo(banco, nivel);
  const s = mundo.cuerpos.skayboy;
  const centro = 7 * TILE + TILE / 2;
  const sucesos = hasta(mundo, mandos({ skayboy: { derecha: true } }), (x) => x.some((y) => y.tipo === 'vuelta'));
  assert.ok(medio(s) < centro, 'control: volvió a la entrada, del lado izquierdo de la palanca');
  assert.equal(mundo.palancas[0].activa, true, 'la cruzó caminando hacia la derecha, y la vuelta no la devolvió a reposo');
  assert.deepEqual(compuertasDe(sucesos), []);
  assert.equal(mundo.compuertas[0].abierta, true);
});

/** La caja en la columna 5, con la 6 libre. */
const CAJA_LIBRE = [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#A1..n.....2.B#',
  '###############',
];
const CAJA_CONTRA_UN_SOLIDO = CAJA_LIBRE.map((r, fila) => (fila === 7 ? '#A1..n#....2.B#' : r));
const CAJA_CONTRA_OTRA_CAJA = CAJA_LIBRE.map((r, fila) => (fila === 7 ? '#A1..nn...2..B#' : r));
/** La caja contra una compuerta cerrada (columna 6); la abre una placa en la 9. */
const CAJA_CONTRA_UNA_COMPUERTA = [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.....#.......#',
  '#.....|.......#',
  '#.....|.......#',
  '#A1..n|..=.2.B#',
  '###############',
];
const salaCajaYCompuerta = () =>
  salaCon(CAJA_CONTRA_UNA_COMPUERTA, [{ id: 'MEC-01', en: [9, 7], abre: ['COM-01'] }], [{ id: 'COM-01', en: [6, 5] }]);

/** Cómo está una caja, para compararla entera. */
const foto = (k: Caja): Caja => ({ ...k, espera: k.espera === null ? null : { ...k.espera } });

test('la caja se empuja caminando contra ella: anda una celda a VELOCIDAD_EMPUJE y termina su tramo aunque el que empujaba se detenga', () => {
  assert.ok(VELOCIDAD_EMPUJE > 0 && VELOCIDAD_EMPUJE <= VELOCIDAD, 'nunca más rápida que el que la empuja (CTR-16.10.5)');
  const { banco, nivel } = salaCon(CAJA_LIBRE);
  const mundo = crearMundo(banco, nivel);
  const k = mundo.cajas[0];
  assert.deepEqual([k.x, k.y, k.estado], [5 * TILE, 7 * TILE, 'quieta'], 'arranca en la celda de su «n», y esa celda es aire');
  hasta(mundo, mandos({ skayboy: { derecha: true } }), () => k.estado === 'tramo');
  assert.equal(k.empujadaPor, 'skayboy', 'recuerda quién la empujó');
  assert.equal(k.columna, 6, 'va a la celda de al lado, y a ninguna otra');
  // Suelta en el acto: la caja termina sola.
  let cuadros = 0;
  while (k.estado !== 'quieta') {
    paso(mundo, mandos(), CUADRO);
    cuadros++;
    assert.ok(cuadros < 100, 'la caja no terminó su tramo');
  }
  assert.deepEqual([k.x, k.y, k.columna, k.fila], [6 * TILE, 7 * TILE, 6, 7], 'quieta, justo en su celda');
  const esperados = TILE / (VELOCIDAD_EMPUJE * CUADRO);
  assert.ok(Math.abs(cuadros - esperados) <= 1, `el tramo duró ${cuadros} cuadros y a VELOCIDAD_EMPUJE son ${esperados}`);
  assert.ok(algunaCajaAnda(mundo) === false);
});

test('🔴 M2: la caja no atraviesa un sólido, ni una compuerta cerrada, ni otra caja: no se mueve un píxel', () => {
  for (const [nombre, { banco, nivel }] of [
    ['un sólido', salaCon(CAJA_CONTRA_UN_SOLIDO)],
    ['una compuerta cerrada', salaCajaYCompuerta()],
    ['otra caja', salaCon(CAJA_CONTRA_OTRA_CAJA)],
  ] as const) {
    const mundo = crearMundo(banco, nivel);
    const antes = mundo.cajas.map(foto);
    correr(mundo, mandos({ skayboy: { derecha: true } }), 3);
    assert.deepEqual(mundo.cajas.map(foto), antes, `contra ${nombre}, la caja se movió`);
    assert.equal(mundo.cuerpos.skayboy.x, 5 * TILE - CUERPO_ANCHO, `contra ${nombre}: el que empuja frena como contra una pared`);
  }
  // Control: la misma caja con la celda de al lado libre sí anda.
  const { banco, nivel } = salaCon(CAJA_LIBRE);
  const libre = crearMundo(banco, nivel);
  correr(libre, mandos({ skayboy: { derecha: true } }), 3);
  assert.ok(libre.cajas[0].x > 5 * TILE, 'con la celda libre, la caja se mueve');
});

test('una caja adentro de una compuerta abierta la traba abierta (CTR-16.10.4)', () => {
  const { banco, nivel } = salaCajaYCompuerta();
  const mundo = crearMundo(banco, nivel);
  const k = mundo.cajas[0];
  hasta(mundo, mandos({ poligirl: { izquierda: true } }), () => mundo.placas[0].pisada);
  assert.equal(mundo.compuertas[0].abierta, true, 'control: Poligirl en la placa, abierta');
  // Un empujón hasta la columna 6, que es el tramo, y suelta: si siguiera, la sacaría del otro lado.
  hasta(mundo, mandos({ skayboy: { derecha: true } }), () => k.columna === 6);
  hasta(mundo, mandos(), () => k.estado === 'quieta');
  const sucesos = correr(mundo, mandos({ poligirl: { derecha: true } }), 1);
  assert.equal(mundo.placas[0].pisada, false, 'control: Poligirl se bajó de la placa');
  assert.equal(mundo.compuertas[0].abierta, true, 'la caja en el tramo la sostiene abierta');
  assert.deepEqual(compuertasDe(sucesos), []);
});

test('🔴 la caja no se empuja con algo encima —un cuerpo u otra caja—, ni contra alguien', () => {
  const casos: [string, { banco: Banco; nivel: Nivel }, (m: Mundo) => void][] = [
    ['con Poligirl parada arriba', salaCon(CAJA_LIBRE), (m) => ponerEn(m.cuerpos.poligirl, 5 * TILE + 3, 7 * TILE - CUERPO_ALTO)],
    ['con Poligirl en la celda de al lado', salaCon(CAJA_LIBRE), (m) => ponerEn(m.cuerpos.poligirl, 6 * TILE + 3)],
    [
      'con otra caja arriba',
      salaCon(CAJA_LIBRE.map((r, fila) => (fila === 6 ? '#....n........#' : r))),
      () => undefined,
    ],
  ];
  for (const [nombre, { banco, nivel }, preparar] of casos) {
    const mundo = crearMundo(banco, nivel);
    preparar(mundo);
    const cajas = mundo.cajas.map(foto);
    const poli = { x: mundo.cuerpos.poligirl.x, y: mundo.cuerpos.poligirl.y };
    correr(mundo, mandos({ skayboy: { derecha: true } }), 3);
    assert.deepEqual(mundo.cajas.map(foto), cajas, `${nombre}: la caja se movió`);
    assert.deepEqual({ x: mundo.cuerpos.poligirl.x, y: mundo.cuerpos.poligirl.y }, poli, `${nombre}: a Poligirl la movió algo`);
    assert.equal(mundo.cuerpos.skayboy.x, 5 * TILE - CUERPO_ANCHO, `${nombre}: control, Skayboy llegó a empujarla`);
  }
});

test('la caja sube el alcance un tile: se le puede parar encima, y es piso', () => {
  const { banco, nivel } = salaCon(CAJA_LIBRE);
  const mundo = crearMundo(banco, nivel);
  const s = mundo.cuerpos.skayboy;
  // Hasta pegado a la caja, y un salto hacia ella: aterriza arriba.
  hasta(mundo, mandos({ skayboy: { derecha: true } }), () => s.x >= 5 * TILE - CUERPO_ANCHO - 2);
  tocarSaltar(mundo, 'skayboy', { derecha: true }, 0.25);
  correr(mundo, mandos(), 0.8);
  assert.equal(s.y + CUERPO_ALTO, 7 * TILE, 'parado arriba de la caja');
  assert.ok(s.enSuelo, 'y la caja es piso');
  assert.equal(mundo.cajas[0].x, 5 * TILE, 'control: saltar sobre la caja no la empuja');
});

/** Una caja al lado de un pozo de un tile con un molinete de los dos en el fondo. */
const TAPON = [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#A1.n.....2..B#',
  '#####X#########',
];

test('la caja cae con la misma gravedad, apoya alineada, y tapa el molinete: el que pasa por arriba no vuelve (RES-61.5)', () => {
  const { banco, nivel } = salaCon(TAPON);
  // Control: sin la caja, Poligirl cae en el pozo y la devuelve a la entrada.
  const sinCaja = crearMundo(banco, nivel);
  const cae = correr(sinCaja, mandos({ poligirl: { izquierda: true } }), 2);
  assert.ok(cae.some((x) => x.tipo === 'vuelta' && x.quien === 'poligirl'), 'control: el pozo devuelve');

  const mundo = crearMundo(banco, nivel);
  const k = mundo.cajas[0];
  hasta(mundo, mandos({ skayboy: { derecha: true } }), () => k.estado !== 'quieta');
  assert.deepEqual([k.columna, k.fila], [5, 8], 'va a caer al fondo del pozo, arriba del molinete');
  // Subpaso por subpaso, hasta que termina el tramo y arranca la caída.
  for (let i = 0; i < 200 && k.estado === 'tramo'; i++) paso(mundo, mandos(), SUBPASO_SEG);
  assert.deepEqual([k.estado, k.y, k.vy], ['cae', 7 * TILE, 0], 'control: cae desde el reposo');
  // La misma cuenta que hace un cuerpo en `moverCuerpo`: sumar GRAVEDAD, topear en CAIDA_MAXIMA, mover.
  let y = k.y;
  let vy = 0;
  let subpasos = 0;
  while (k.estado === 'cae') {
    paso(mundo, mandos(), SUBPASO_SEG);
    vy = Math.min(vy + GRAVEDAD * SUBPASO_SEG, CAIDA_MAXIMA);
    y = Math.min(y + vy * SUBPASO_SEG, 8 * TILE);
    assert.ok(Math.abs(k.y - y) < 1e-9, `subpaso ${subpasos}: la caja está en y=${k.y} y con la gravedad de los cuerpos estaría en ${y}`);
    assert.ok(++subpasos < 200, 'la caja no terminó de caer');
  }
  assert.ok(subpasos > 10, `control: la caída se midió en ${subpasos} subpasos, no de un salto`);
  assert.deepEqual([k.x, k.y], [5 * TILE, 8 * TILE], 'apoyada, alineada al tile');
  const cruza = correr(mundo, mandos({ poligirl: { izquierda: true } }), 2);
  assert.ok(!cruza.some((x) => x.tipo === 'vuelta'), 'con la caja en el pozo, nadie vuelve a la entrada');
  assert.ok(mundo.cuerpos.poligirl.x < 5 * TILE, 'control: Poligirl pasó por arriba del pozo');
});

test('🔴 M3: un cuerpo no empuja ni carga a otro: se atraviesan, y el que cae encima del otro apoya en el piso', () => {
  const plano = crearMundo(sala(DE_NADIE).banco, sala(DE_NADIE).nivel);
  const quieta = { x: plano.cuerpos.poligirl.x, y: plano.cuerpos.poligirl.y };
  correr(plano, mandos({ skayboy: { derecha: true } }), 3);
  assert.ok(plano.cuerpos.skayboy.x > quieta.x + CUERPO_ANCHO, 'control: Skayboy pasó del otro lado de Poligirl');
  assert.deepEqual({ x: plano.cuerpos.poligirl.x, y: plano.cuerpos.poligirl.y }, quieta, 'la atravesó sin moverla');

  const { banco, nivel } = salaCon([
    '###############',
    '#.............#',
    '#.............#',
    '#.............#',
    '#.............#',
    '#...1.........#',
    '#..###........#',
    '#A....2......B#',
    '###############',
  ]);
  const mundo = crearMundo(banco, nivel);
  const s = mundo.cuerpos.skayboy;
  const p = mundo.cuerpos.poligirl;
  const ella = { x: p.x, y: p.y };
  // Skayboy baja de la cornisa justo arriba de Poligirl.
  hasta(mundo, mandos({ skayboy: { derecha: true } }), () => !s.enSuelo);
  hasta(mundo, mandos(), () => s.enSuelo);
  assert.ok(s.x < p.x + CUERPO_ANCHO && p.x < s.x + CUERPO_ANCHO, 'control: cayó encima de ella');
  assert.equal(s.y + CUERPO_ALTO, 8 * TILE, 'apoya en el piso, no en ella');
  assert.deepEqual({ x: p.x, y: p.y }, ella, 'y a ella no la movió');
});

/** Una cornisa con la caja en el borde; abajo, la columna 4 es por donde caería. */
const CORNISA_CON_CAJA = (entradaDePoligirl: number): string[] => [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#1.n..........#',
  '####..........#',
  `#${'.'.repeat(entradaDePoligirl - 1)}2${'.'.repeat(11 - entradaDePoligirl)}AB#`,
  '###############',
];

test('🔴 M5: la caja no cae sobre nadie: con alguien en la columna por la que caería, el empujón no arranca', () => {
  // Poligirl entra lejos (columna 6) y se la pone a mano en la columna 4, en el piso. Con su
  // entrada en la columna 4 la prueba no probaba esta regla: la caja no entra en la celda de
  // arriba de una entrada, y el empujón no arrancaba por eso, con o sin nadie abajo.
  const { banco, nivel } = salaCon(CORNISA_CON_CAJA(6));
  const mundo = crearMundo(banco, nivel);
  ponerEn(mundo.cuerpos.poligirl, 4 * TILE + 3);
  const k = foto(mundo.cajas[0]);
  const p = { x: mundo.cuerpos.poligirl.x, y: mundo.cuerpos.poligirl.y };
  correr(mundo, mandos({ skayboy: { derecha: true } }), 2);
  assert.deepEqual(foto(mundo.cajas[0]), k, 'la caja no se movió');
  assert.equal(mundo.cuerpos.skayboy.x, 3 * TILE - CUERPO_ANCHO, 'control: Skayboy llegó a empujarla');
  assert.deepEqual({ x: mundo.cuerpos.poligirl.x, y: mundo.cuerpos.poligirl.y }, p);
  // Control: con Poligirl dos columnas más allá, la misma caja cae hasta el piso.
  const lejos = salaCon(CORNISA_CON_CAJA(6));
  const otro = crearMundo(lejos.banco, lejos.nivel);
  hasta(otro, mandos({ skayboy: { derecha: true } }), () => otro.cajas[0].estado !== 'quieta');
  hasta(otro, mandos(), () => otro.cajas[0].estado === 'quieta');
  assert.deepEqual([otro.cajas[0].x, otro.cajas[0].y], [4 * TILE, 7 * TILE], 'control: con la columna libre, cae y apoya en el piso');
});

test('🔴 M5: en la carrera, la caja frena contra el cuerpo y espera; en ningún cuadro se le mete adentro', () => {
  const { banco, nivel } = salaCon(CORNISA_CON_CAJA(6));
  const mundo = crearMundo(banco, nivel);
  const k = mundo.cajas[0];
  const p = mundo.cuerpos.poligirl;
  const cuadro = (m: Mandos): void => {
    paso(mundo, m, CUADRO);
    for (const id of ['skayboy', 'poligirl'] as const) {
      assert.ok(!seMeten(k, mundo.cuerpos[id]), `la caja se le metió adentro a ${id}`);
    }
  };
  // Skayboy la empuja, y Poligirl —la otra columna, a la vez— se mete abajo mientras anda.
  for (let i = 0; i < 200 && k.estado === 'quieta'; i++) cuadro(mandos({ skayboy: { derecha: true } }));
  for (let i = 0; i < 200 && p.x > 4 * TILE; i++) cuadro(mandos({ poligirl: { izquierda: true } }));
  assert.ok(p.x + CUERPO_ANCHO > 4 * TILE && p.x < 5 * TILE, 'control: Poligirl está en la columna por donde cae');
  const debajo = { x: p.x, y: p.y };
  let espero = false;
  for (let i = 0; i < 120; i++) {
    cuadro(mandos());
    if (k.espera !== null) {
      espero = true;
      assert.deepEqual(k.espera, { quien: 'poligirl', donde: 'arriba' });
    }
  }
  assert.ok(espero, 'la caja tenía que esperar arriba de Poligirl');
  assert.equal(k.y + TILE, p.y, 'frenó apoyada en su cabeza, sin apretarla');
  assert.deepEqual({ x: p.x, y: p.y }, debajo, 'y a ella no la movió');
  // Poligirl sale, y la caja sigue: termina de caer y apoya en el piso.
  for (let i = 0; i < 200 && k.estado !== 'quieta'; i++) cuadro(mandos({ poligirl: { derecha: true } }));
  assert.deepEqual([k.x, k.y, k.estado], [4 * TILE, 7 * TILE, 'quieta']);
});

/*
 * ## Las reglas de la caja que el plan no numeró, cada una con su rojo (`CTR-16.10.5`)
 *
 * Las pidió la verificación de `T-272`: son reglas del contrato que `T-277` y `T-278` van a usar,
 * y una regresión en cualquiera pasaba `npm test` en verde. Cada una se vio en rojo rompiendo la
 * línea de `mundo.ts` que la sostiene.
 */

/** Si una caja quieta está apoyada: sólido, compuerta cerrada, otra caja quieta o el borde, abajo. */
function apoyada(m: Mundo, k: Caja): boolean {
  if (k.y !== k.fila * TILE || k.x !== k.columna * TILE) return false;
  const abajo = m.nivel.grilla[k.fila + 1]?.[k.columna];
  if (abajo === undefined || abajo === '#') return true;
  const compuerta = m.compuertas.find((g) => g.columna === k.columna && g.desdeFila <= k.fila + 1 && k.fila + 1 <= g.hastaFila);
  if (compuerta !== undefined && !compuerta.abierta) return true;
  return m.cajas.some((o) => o !== k && o.estado === 'quieta' && o.columna === k.columna && o.fila === k.fila + 1);
}

/** Si dos cajas se meten una en la otra. Apoyarse no es meterse. */
function cajasSeMeten(m: Mundo): boolean {
  const eps = 1e-6;
  return m.cajas.some((a, i) =>
    m.cajas.some((b, j) => j > i && a.x < b.x + TILE - eps && b.x < a.x + TILE - eps && a.y < b.y + TILE - eps && b.y < a.y + TILE - eps),
  );
}

/** Una cornisa con una caja en el borde; abajo, otra caja en la columna 4, por donde cae la primera. */
const CAJA_SOBRE_CAJA = [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#1.n..........#',
  '####..........#',
  '#...n..2...AB.#',
  '###############',
];

test('🔴 la caja que va a apoyar en otra le reserva el apoyo: la de abajo no se empuja, y ninguna queda quieta en el aire', () => {
  const { banco, nivel } = salaCon(CAJA_SOBRE_CAJA);
  // Dos personas: Skayboy empuja la de la cornisa, y Poligirl, mientras esa todavía anda, empuja
  // la de abajo hacia la izquierda. La de arriba ya decidió que apoya en ella.
  const mundo = crearMundo(banco, nivel);
  const [arriba, abajo] = mundo.cajas;
  const p = mundo.cuerpos.poligirl;
  let contraLaDeAbajo = 0;
  for (let i = 0; i < 300; i++) {
    paso(mundo, mandos({ skayboy: { derecha: arriba.estado === 'quieta' && i < 60 }, poligirl: { izquierda: true } }), CUADRO);
    if (arriba.estado !== 'quieta' && p.x === abajo.x + TILE) contraLaDeAbajo++;
    for (const k of mundo.cajas) {
      if (k.estado === 'quieta') assert.ok(apoyada(mundo, k), `cuadro ${i}: una caja quieta en (${k.columna}, ${k.fila}) sin nada abajo`);
    }
  }
  assert.ok(contraLaDeAbajo > 0, 'control: Poligirl empujaba la de abajo mientras la de arriba andaba');
  assert.deepEqual([arriba.x, arriba.y, arriba.estado], [4 * TILE, 6 * TILE, 'quieta'], 'la de arriba apoyó en la de abajo');
  assert.deepEqual([abajo.x, abajo.y, abajo.estado], [4 * TILE, 7 * TILE, 'quieta'], 'y la de abajo no se movió');

  // Lo mismo con los dos empujones en el mismo subpaso, a mano: la de abajo tampoco arranca.
  const juntos = crearMundo(banco, nivel);
  ponerEn(juntos.cuerpos.skayboy, 3 * TILE - CUERPO_ANCHO - 0.5, 6 * TILE - CUERPO_ALTO);
  ponerEn(juntos.cuerpos.poligirl, 5 * TILE + 0.5);
  paso(juntos, mandos({ skayboy: { derecha: true }, poligirl: { izquierda: true } }), SUBPASO_SEG);
  assert.deepEqual([juntos.cajas[0].estado, juntos.cajas[0].fila], ['tramo', 6], 'control: la de arriba arrancó, y apoya en la de abajo');
  assert.deepEqual(foto(juntos.cajas[1]), foto(mundo.cajas[1]), 'la de abajo, empujada en el mismo subpaso, no arrancó');
  hasta(juntos, mandos({ poligirl: { izquierda: true } }), () => juntos.cajas[0].estado === 'quieta');
  assert.ok(juntos.cajas.every((k) => apoyada(juntos, k)), 'las dos quietas, cada una apoyada');

  // Control: sin la de arriba andando, Poligirl sí la empuja.
  const sola = crearMundo(banco, nivel);
  hasta(sola, mandos({ poligirl: { izquierda: true } }), () => sola.cajas[1].estado !== 'quieta');
  assert.equal(sola.cajas[1].columna, 3);
});

/** La caja de la cornisa cae por la columna 4; abajo, otra caja en la 5 que se puede empujar hacia ahí. */
const DOS_CAJAS_A_LA_COLUMNA_4 = [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#1.n..........#',
  '####..........#',
  '#....n2.....AB#',
  '###############',
];

test('🔴 una caja que anda tiene su camino reservado, y dos cajas que piden el mismo lugar a la vez no arrancan', () => {
  const { banco, nivel } = salaCon(DOS_CAJAS_A_LA_COLUMNA_4);
  // La reserva: la de la cornisa arranca y va a caer hasta el piso de la columna 4. Mientras anda,
  // Poligirl empuja la otra hacia esa columna, adonde la primera todavía no llegó.
  const mundo = crearMundo(banco, nivel);
  const [cornisa, piso] = mundo.cajas;
  hasta(mundo, mandos({ skayboy: { derecha: true } }), () => cornisa.estado !== 'quieta');
  assert.equal(cornisa.fila, 7, 'control: la de la cornisa va a apoyar en el piso');
  const quieta = foto(piso);
  let contra = 0;
  for (let i = 0; i < 200; i++) {
    const andaba = cornisa.estado !== 'quieta';
    paso(mundo, mandos({ poligirl: { izquierda: true } }), CUADRO);
    if (andaba && mundo.cuerpos.poligirl.x === piso.x + TILE) contra++;
    assert.ok(!cajasSeMeten(mundo), `cuadro ${i}: dos cajas se metieron una en la otra`);
  }
  assert.ok(contra > 0, 'control: Poligirl empujaba mientras la otra andaba');
  assert.deepEqual(foto(piso), quieta, 'la del piso no entró en el camino reservado');
  assert.deepEqual([cornisa.x, cornisa.y, cornisa.estado], [4 * TILE, 7 * TILE, 'quieta'], 'y la de la cornisa llegó a su lugar');

  // Las dos al mismo lugar en el mismo subpaso, a mano: no arranca ninguna. La lista no decide.
  const juntos = crearMundo(banco, nivel);
  const antes = juntos.cajas.map(foto);
  ponerEn(juntos.cuerpos.skayboy, 3 * TILE - CUERPO_ANCHO - 0.5, 6 * TILE - CUERPO_ALTO);
  ponerEn(juntos.cuerpos.poligirl, 6 * TILE + 0.5);
  correr(juntos, mandos({ skayboy: { derecha: true }, poligirl: { izquierda: true } }), 1);
  assert.deepEqual(juntos.cajas.map(foto), antes, 'empujadas a la vez hacia la misma celda, las dos se quedaron');
  assert.equal(juntos.cuerpos.skayboy.x, 3 * TILE - CUERPO_ANCHO, 'control: Skayboy empujaba');
  assert.equal(juntos.cuerpos.poligirl.x, 6 * TILE, 'control: Poligirl empujaba');

  // Control: cualquiera de las dos sola, con la misma mano, arranca.
  for (const [quien, mando] of [['skayboy', { derecha: true }], ['poligirl', { izquierda: true }]] as const) {
    const solo = crearMundo(banco, nivel);
    ponerEn(solo.cuerpos.skayboy, 3 * TILE - CUERPO_ANCHO - 0.5, 6 * TILE - CUERPO_ALTO);
    ponerEn(solo.cuerpos.poligirl, 6 * TILE + 0.5);
    paso(solo, mandos({ [quien]: mando }), CUADRO);
    assert.ok(solo.cajas.some((k) => k.estado !== 'quieta'), `control: empujando ${quien} sola, arranca`);
  }
});

/**
 * Una sala con piezas donde **la grilla dice todo**: cada palanca o placa abre la única compuerta,
 * que está en la columna 12. Para las salas de la tabla de abajo, que cambian una celda por caso.
 */
function salaDeGrilla(grilla: string[]): { banco: Banco; nivel: Nivel } {
  const mecanismos: MecanismoDelNivel[] = [];
  grilla.forEach((r, fila) =>
    [...r].forEach((ch, columna) => {
      if (ch === '/' || ch === '=') mecanismos.push({ id: `MEC-0${mecanismos.length + 1}`, en: [columna, fila], abre: ['COM-01'] });
    }),
  );
  const compuertas: CompuertaDelNivel[] = grilla.some((r) => r.includes('|')) ? [{ id: 'COM-01', en: [12, 5] }] : [];
  return salaCon(grilla, mecanismos, compuertas);
}

/** La caja en el piso, en la columna 5; lo que se prueba va en la 6. La compuerta es de relleno. */
const EN_EL_PISO = (fila7: string): string[] => [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#...........#.#',
  '#...........|.#',
  '#...........|.#',
  fila7,
  '###############',
];
/** La caja en un escalón de sólido, en (5, 6): lo que se prueba va abajo de la celda (6, 6). */
const EN_UN_ESCALON = (fila7: string): string[] => [
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#....n........#',
  fila7,
  '###############',
];

/**
 * La tabla de `CTR-16.10.5`, la columna de "no entra", menos lo que ya prueba `M2` (sólido,
 * compuerta cerrada, otra caja). Cada caso trae su control: la misma sala con aire ahí.
 *
 * **Los dos casos de "la celda de arriba" no tienen rojo propio, y no es un descuido.** Una caja
 * no puede quedar quieta arriba de una entrada o de una puerta, porque ninguna de las dos es
 * apoyo: para ocupar esa celda tendría que caer a través de ella, y la de abajo ya la rechaza.
 * Borrar esa línea de `cajaEntra` deja el mundo igual; los casos quedan para que la tabla del
 * contrato esté entera, y se ponen en rojo si alguna vez una entrada o una puerta pasa a frenar.
 */
const DONDE_NO_ENTRA: readonly [string, string[], string[]][] = [
  ['una palanca', EN_EL_PISO('#A1..n/...=2|B#'), EN_EL_PISO('#A1..n..../2|B#')],
  // El cigarrillo de la 9 está para que la sala cumpla E10 (uno de cada uno); la caja no llega ahí.
  ['un tesoro', EN_EL_PISO('#A1..ng..-=2|B#'), EN_EL_PISO('#A1..n..g-=2|B#')],
  ['una entrada', EN_EL_PISO('#A1..n2...=.|B#'), EN_EL_PISO('#A1..n....=2|B#')],
  ['una puerta', EN_EL_PISO('#.1..nA...=2|B#'), EN_EL_PISO('#A1..n....=2|B#')],
  ['la celda de arriba de una entrada', EN_UN_ESCALON('#A1.##2......B#'), EN_UN_ESCALON('#A1.##.....2.B#')],
  ['la celda de arriba de una puerta', EN_UN_ESCALON('#.1.##A.....2B#'), EN_UN_ESCALON('#A1.##.....2.B#')],
];

test('🔴 la caja no entra en palanca, tesoro, entrada ni puerta, ni en la celda de arriba de una entrada o una puerta', () => {
  for (const [nombre, grilla, control] of DONDE_NO_ENTRA) {
    const empujar = (g: string[]): Mundo => {
      const { banco, nivel } = salaDeGrilla(g);
      const mundo = crearMundo(banco, nivel);
      const k = mundo.cajas[0];
      // A mano: Poligirl lejos, para que lo único que haya en la celda sea la celda; y Skayboy, en
      // la sala del escalón, parado en el sólido de al lado, con los pies a la altura de la base.
      ponerEn(mundo.cuerpos.poligirl, 9 * TILE + 3);
      if (k.fila === 6) ponerEn(mundo.cuerpos.skayboy, 5 * TILE - CUERPO_ANCHO - 3, 7 * TILE - CUERPO_ALTO);
      correr(mundo, mandos({ skayboy: { derecha: true } }), 1);
      return mundo;
    };
    const mundo = empujar(grilla);
    const k = mundo.cajas[0];
    assert.deepEqual([k.x, k.y, k.estado], [5 * TILE, k.fila * TILE, 'quieta'], `contra ${nombre}, la caja se movió`);
    assert.equal(mundo.cuerpos.skayboy.x, 5 * TILE - CUERPO_ANCHO, `contra ${nombre}: control, Skayboy llegó a empujarla`);
    assert.ok(empujar(control).cajas[0].x > 5 * TILE, `${nombre}, control: con aire en esa celda, la caja anda`);
  }
});

test('🔴 en la carrera de costado, la caja frena contra el cuerpo y espera; no lo mueve ni se le mete adentro', () => {
  const { banco, nivel } = salaCon(CAJA_LIBRE);
  const mundo = crearMundo(banco, nivel);
  const k = mundo.cajas[0];
  const p = mundo.cuerpos.poligirl;
  // A mano: Poligirl en la columna 7, fuera del camino de la caja cuando el empujón arranca.
  ponerEn(p, 7 * TILE + 2);
  const cuadro = (m: Mandos): void => {
    paso(mundo, m, CUADRO);
    for (const id of ['skayboy', 'poligirl'] as const) assert.ok(!seMeten(k, mundo.cuerpos[id]), `la caja se le metió adentro a ${id}`);
  };
  for (let i = 0; i < 200 && k.estado === 'quieta'; i++) cuadro(mandos({ skayboy: { derecha: true } }));
  assert.equal(k.columna, 6, 'control: el empujón arrancó hacia la columna 6');
  // Poligirl da un paso hacia la izquierda, adentro de la celda a la que va la caja, y se queda.
  for (let i = 0; i < 20 && p.x >= 7 * TILE; i++) cuadro(mandos({ poligirl: { izquierda: true } }));
  assert.ok(p.x < 7 * TILE && k.x + TILE <= p.x, 'control: Poligirl está en la celda de destino, delante de la caja');
  const ella = { x: p.x, y: p.y };
  let espero = false;
  for (let i = 0; i < 60; i++) {
    cuadro(mandos());
    if (k.espera !== null) {
      espero = true;
      assert.deepEqual(k.espera, { quien: 'poligirl', donde: 'contra' });
    }
  }
  assert.ok(espero, 'la caja tenía que esperar contra Poligirl');
  assert.deepEqual([k.x + TILE, k.estado], [p.x, 'tramo'], 'frenó apoyada en su costado, sin terminar el tramo');
  assert.deepEqual({ x: p.x, y: p.y }, ella, 'y a ella no la movió');
  // Poligirl se va, y la caja termina su tramo.
  for (let i = 0; i < 200 && k.estado !== 'quieta'; i++) cuadro(mandos({ poligirl: { derecha: true } }));
  assert.deepEqual([k.x, k.y, k.estado], [6 * TILE, 7 * TILE, 'quieta']);
});

test('🔴 con alguien encima, la caja que anda se detiene: no le mueve el piso (regla 2)', () => {
  const { banco, nivel } = salaCon(CAJA_LIBRE);
  const mundo = crearMundo(banco, nivel);
  const k = mundo.cajas[0];
  const p = mundo.cuerpos.poligirl;
  hasta(mundo, mandos({ skayboy: { derecha: true } }), () => k.estado === 'tramo');
  paso(mundo, mandos(), CUADRO);
  assert.ok(k.x > 5 * TILE && k.x < 6 * TILE, 'control: a mitad del tramo');
  // A mano: Poligirl parada arriba de la caja, a mitad del tramo.
  ponerEn(p, k.x + 3, k.y - CUERPO_ALTO);
  const donde = { caja: k.x, x: p.x, y: p.y };
  const sucesos = correr(mundo, mandos(), 1);
  assert.deepEqual(k.espera, { quien: 'poligirl', donde: 'debajo' });
  assert.deepEqual({ caja: k.x, x: p.x, y: p.y }, donde, 'con ella encima, la caja no anduvo ni la llevó');
  assert.ok(p.enSuelo && !sucesos.some((x) => x.tipo === 'vuelta'), 'y ella sigue parada, sin volver a ningún lado');
  // Se baja hacia atrás, y la caja termina su tramo.
  for (let i = 0; i < 200 && k.estado !== 'quieta'; i++) paso(mundo, mandos({ poligirl: { izquierda: true } }), CUADRO);
  assert.deepEqual([k.x, k.y, k.estado], [6 * TILE, 7 * TILE, 'quieta']);
});

/** La caja al lado de una placa que manda la compuerta de la columna 12. */
const CAJA_A_LA_PLACA = EN_EL_PISO('#A1..n=...2.|B#');

test('🔴 la caja que empujan los dos no es de ninguno, y lo que abre en la placa tampoco (CTR-16.10.7)', () => {
  const { banco, nivel } = salaDeGrilla(CAJA_A_LA_PLACA);
  const pegado = 5 * TILE - CUERPO_ANCHO - 0.5;
  const empujon = (quienes: readonly IdPersonaje[]): { mundo: Mundo; sucesos: Suceso[] } => {
    const mundo = crearMundo(banco, nivel);
    // A mano: los que empujan, pegados a la caja, en el mismo lugar; se atraviesan (M3).
    for (const id of quienes) ponerEn(mundo.cuerpos[id], pegado);
    const m = mandos(Object.fromEntries(quienes.map((id) => [id, { derecha: true }])));
    const sucesos = [...paso(mundo, m, SUBPASO_SEG)];
    assert.equal(mundo.cajas[0].estado, 'tramo', `control: ${quienes.join(' y ')} la empujaron en el primer subpaso`);
    sucesos.push(...hasta(mundo, mandos(), () => mundo.cajas[0].estado === 'quieta'));
    sucesos.push(...correr(mundo, mandos(), 0.2));
    return { mundo, sucesos };
  };
  const dos = empujon(['skayboy', 'poligirl']);
  assert.equal(dos.mundo.cajas[0].empujadaPor, null, 'empujada por los dos a la vez, no es de ninguno');
  assert.deepEqual(compuertasDe(dos.sucesos), [{ tipo: 'compuerta', id: 'COM-01', abierta: true, por: null }]);
  // Control: de a uno, es del que empujó, y la apertura también.
  for (const quien of ['skayboy', 'poligirl'] as const) {
    const uno = empujon([quien]);
    assert.equal(uno.mundo.cajas[0].empujadaPor, quien);
    assert.deepEqual(compuertasDe(uno.sucesos), [{ tipo: 'compuerta', id: 'COM-01', abierta: true, por: quien }]);
  }
});

test('🔴 una caja que anda no pisa la placa: la pisa en el subpaso en que queda quieta, y ni uno antes', () => {
  const { banco, nivel } = salaDeGrilla(CAJA_A_LA_PLACA);
  const mundo = crearMundo(banco, nivel);
  const k = mundo.cajas[0];
  hasta(mundo, mandos({ skayboy: { derecha: true } }), () => k.estado === 'tramo');
  assert.equal(mundo.placas[0].pisada, false, 'control: arrancó hacia la placa, y todavía no la pisa');
  // Una función y no la comparación suelta: `paso()` cambia la caja, y TypeScript no lo sabe.
  const anda = (): boolean => k.estado !== 'quieta';
  let abre: Suceso[] = [];
  for (let i = 0; i < 200 && anda(); i++) {
    abre = compuertasDe(paso(mundo, mandos(), SUBPASO_SEG));
    if (anda()) {
      assert.equal(mundo.placas[0].pisada, false, `subpaso ${i}: la caja anda (x=${k.x}) y ya pisaba la placa`);
      assert.deepEqual(abre, []);
    }
  }
  assert.deepEqual([k.x, k.estado, mundo.placas[0].pisada], [6 * TILE, 'quieta', true], 'quieta en la placa, y pisada en ese subpaso');
  assert.deepEqual(abre, [{ tipo: 'compuerta', id: 'COM-01', abierta: true, por: 'skayboy' }], 'la compuerta se abrió en el mismo subpaso');
});

/** El ejemplo de `CTR-16.10.1`: las cuatro piezas, y es la sala de `M6`. */
const EJEMPLO_CTR_16_10_1 = [
  '###############',
  '#......#...#..#',
  '#......#...#..#',
  '#......#...#..#',
  '#......#...#..#',
  '#......|...|..#',
  '#......|...|..#',
  '#1.2n=.|./.|AB#',
  '###############',
];
const salaEjemplo = () =>
  salaCon(
    EJEMPLO_CTR_16_10_1,
    [
      { id: 'MEC-01', en: [5, 7], abre: ['COM-01'] },
      { id: 'MEC-02', en: [9, 7], abre: ['COM-02'] },
    ],
    [
      { id: 'COM-01', en: [7, 5] },
      { id: 'COM-02', en: [11, 5] },
    ],
  );

test('🔴 M6: el que espera no se mueve, haga lo que haga el otro; y la sala quieta no cambia', () => {
  // Poligirl quieta en cuatro lugares; Skayboy, 2.000 cuadros de mandos al azar con semilla fija.
  const lugares: [string, (m: Mundo) => void][] = [
    ['en el piso, en su entrada', () => undefined],
    ['en la placa', (m) => ponerEn(m.cuerpos.poligirl, 5 * TILE + 3)],
    [
      'adentro de una compuerta abierta',
      (m) => {
        // La caja en la placa, a mano, y un cuadro para que la placa y la compuerta se enteren.
        Object.assign(m.cajas[0], { x: 5 * TILE, columna: 5 });
        paso(m, mandos(), CUADRO);
        assert.equal(m.compuertas[0].abierta, true, 'control: la caja en la placa la abrió');
        ponerEn(m.cuerpos.poligirl, 7 * TILE + 3);
      },
    ],
    ['arriba de la caja', (m) => ponerEn(m.cuerpos.poligirl, 4 * TILE + 3, 7 * TILE - CUERPO_ALTO)],
  ];
  const { banco, nivel } = salaEjemplo();
  for (const [donde, preparar] of lugares) {
    const mundo = crearMundo(banco, nivel);
    preparar(mundo);
    const p = mundo.cuerpos.poligirl;
    const quieta = { x: p.x, y: p.y };
    let semilla = 12;
    const azar = (): number => (semilla = (semilla * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
    let mando: Mando = QUIETO;
    let queda = 0;
    for (let i = 0; i < 2000; i++) {
      if (queda-- <= 0) {
        mando = { izquierda: azar() < 0.4, derecha: azar() < 0.4, saltar: azar() < 0.3 };
        queda = Math.floor(azar() * 15);
      }
      const sucesos = paso(mundo, { skayboy: mando, poligirl: QUIETO }, CUADRO);
      assert.deepEqual({ x: p.x, y: p.y }, quieta, `${donde}: Poligirl se movió en el cuadro ${i}`);
      assert.ok(!sucesos.some((x) => x.tipo === 'vuelta' && x.quien === 'poligirl'), `${donde}: Poligirl volvió a la entrada`);
      for (const k of mundo.cajas) assert.ok(!seMeten(k, mundo.cuerpos.skayboy) && !seMeten(k, p), `${donde}: una caja se metió en un cuerpo`);
    }
    // Sin mandos: en cuanto todo apoya, la sala no cambia más. Solo corre el reloj. Apoyado quiere
    // decir también sin un salto guardado: el perdón temprano lo haría saltar solo al tocar el piso.
    let quietos = 0;
    const s = mundo.cuerpos.skayboy;
    while (!(s.enSuelo && s.saltoGuardado === 0 && !algunaCajaAnda(mundo))) {
      paso(mundo, mandos(), CUADRO);
      assert.ok(++quietos < 600, `${donde}: sin mandos, la sala no se aquietó`);
    }
    const antes = sinReloj(mundo);
    const t = mundo.tiempo;
    correr(mundo, mandos(), 10);
    assert.equal(sinReloj(mundo), antes, `${donde}: sin nadie tocando nada, algo de la sala cambió`);
    assert.ok(mundo.tiempo > t, 'control: el reloj sí corrió');
  }
});

/**
 * ## Lo que el módulo no puede tener adentro
 */
const FUENTE = readFileSync(new URL('./mundo.ts', import.meta.url), 'utf8');

test('🔴 importa solo `niveles.ts`: ni motor, ni DOM, ni `node:*`, ni un paquete (CTR-16.8)', () => {
  const importaciones = (FUENTE.match(/from\s+'[^']+'/g) ?? []).map((l) => l.replace(/from\s+/, ''));
  assert.deepEqual(importaciones, ["'./niveles.ts'"]);
  for (const prohibida of ['kaplay', 'document.', 'window.', 'Date.now', 'performance.now', 'Math.random']) {
    assert.ok(!FUENTE.includes(prohibida), `usa ${prohibida}: el mundo recibe el tiempo y el mando por parámetro`);
  }
});

test('🔴 el vocabulario del fallo no entra ni en el módulo ni en esta prueba (BR-24, UX-29 §9.1)', () => {
  // Partidas a propósito, como en `sonido.test.ts`: la barredora corre sobre la carpeta entera.
  const prohibidas = ['vi' + 'da', 'muer' + 'te', 'mo' + 'riste', 'per' + 'diste', 'game' + ' over', 'le' + 'tal', 'ma' + 'ta('];
  const prueba = readFileSync(new URL('./mundo.test.ts', import.meta.url), 'utf8');
  for (const archivo of [FUENTE, prueba]) {
    for (const palabra of prohibidas) {
      assert.ok(!archivo.toLowerCase().includes(palabra), `entró «${palabra}»: acá el fracaso devuelve a la entrada y nada más`);
    }
  }
});
