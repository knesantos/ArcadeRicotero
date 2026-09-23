/**
 * El mundo sin motor (`T-254`): la física, la sala cerrada y el terreno que devuelve.
 *
 * La puerta doble tiene su archivo aparte, `niveles.test.ts`, porque es la verificación que
 * el plan del ciclo 15 le declaró a `T-248` y conviene que el comando siga diciendo lo que
 * dice. Acá va todo lo demás.
 *
 * Los casos marcados 🔴 son reglas que existen para que algo **no** pase. Cada uno trae su
 * control al lado, porque una guarda que nunca se vio en rojo no es una guarda.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Banco, IdPersonaje, Nivel } from './niveles.ts';
import {
  ALCANCE_ALTO_TILES,
  ALCANCE_HUECO_TILES,
  CAJA_ALTO,
  CAJA_ANCHO,
  PASO_MAXIMO_SEG,
  QUIETO,
  TILE,
  crearMundo,
  paso,
  poseDe,
  puntoDeEntrada,
  type Mando,
  type Mandos,
  type Mundo,
  type Suceso,
} from './mundo.ts';

const CUADRO = 1 / 60;
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
    cajas: [],
    verificaciones: { deDos: false, solo: false },
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
  assert.equal(s.x, 5 * TILE + (TILE - CAJA_ANCHO) / 2);
  assert.equal(s.y + CAJA_ALTO, 8 * TILE, 'los pies apoyan en el piso de la fila 8');
  correr(mundo, mandos(), 0.5);
  assert.equal(mundo.cuerpos.skayboy.y + CAJA_ALTO, 8 * TILE, 'y quieto no se hunde ni flota');
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
  assert.equal(mundo.cuerpos.poligirl.x + CAJA_ANCHO, 14 * TILE, 'queda pegada a la pared de la columna 14');
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
  assert.ok(mundo.cuerpos.poligirl.x + CAJA_ANCHO <= 14 * TILE, 'y la pared sigue ahí');
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
  assert.equal(mundo.cuerpos.poligirl.x + CAJA_ANCHO, 15 * TILE, 'frena en el borde derecho');
  assert.ok(mundo.cuerpos.poligirl.y + CAJA_ALTO <= 9 * TILE, 'y no cae por debajo del piso del mundo');
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
  hasta(mundo, mandos(), () => sk.vy > 0 && sk.y + CAJA_ALTO > 8 * TILE - 4);
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
  assert.equal(m2.cuerpos.skayboy.y + CAJA_ALTO, 6 * TILE, 'quedó parado arriba de la cornisa de dos');

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
  assert.equal(m3.cuerpos.skayboy.y + CAJA_ALTO, 8 * TILE, 'no la alcanzó: volvió al piso');
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
  hasta(mundo, mandos({ skayboy: { derecha: true } }), () => s.x >= 6 * TILE + (TILE - CAJA_ANCHO));
  tocarSaltar(mundo, 'skayboy', { derecha: true }, 0.7);
  correr(mundo, mandos(), 0.5);
  assert.equal(s.y + CAJA_ALTO, 5 * TILE, 'aterrizó arriba, del otro lado del hueco');
  assert.ok(s.x >= 10 * TILE - CAJA_ANCHO, 'y del lado derecho');
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
    '#A..C1..o2...B#',
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
