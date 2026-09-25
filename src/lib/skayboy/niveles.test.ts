/**
 * La puerta doble y el fin del nivel 1 (`T-248`), con los tres casos que el plan del ciclo
 * 15 le declaró: **falla** si se gana con uno solo en la puerta, **pasa** con los dos, y el
 * que llegó primero no paga nada mientras espera.
 *
 * La regla no se escribe acá: se escribe una sola vez, en `paso()` de `mundo.ts` (`T-254`),
 * y acá se la prueba contra **el nivel 1 de verdad**, el de `src/data/skayboy.json`. Si
 * alguien redibuja ese nivel y rompe la puerta doble, se entera por este archivo.
 *
 * Y se juega como lo juega el que llega solo (`D-43`): una columna, después la otra. Si el
 * nivel 1 no se pasa así, está mal (`BR-25` fila b).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { nivelesASembrar, problemasDelBanco, tesorosDelNivel, type Banco, type IdPersonaje } from './niveles.ts';
import {
  CUADRO_SEG,
  QUIETO,
  crearMundo,
  juntadosPorPersonaje,
  paso,
  type Mando,
  type Mandos,
  type Mundo,
  type Suceso,
} from './mundo.ts';

/** Un cuadro, el de la partida (`ADR-09.1`): el número vive en `mundo.ts`. */
const CUADRO = CUADRO_SEG;
const BANCO = JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as Banco;
const NIVEL_1 = BANCO.niveles[0];

function mandos(parcial: Partial<Record<IdPersonaje, Partial<Mando>>> = {}): Mandos {
  return {
    skayboy: { ...QUIETO, ...parcial.skayboy },
    poligirl: { ...QUIETO, ...parcial.poligirl },
  };
}

function correr(mundo: Mundo, m: Mandos, segundos: number): Suceso[] {
  const sucesos: Suceso[] = [];
  for (let i = 0; i < Math.round(segundos / CUADRO); i++) sucesos.push(...paso(mundo, m, CUADRO));
  return sucesos;
}

/** En el nivel 1, la puerta de cada uno queda hacia afuera de su entrada. */
const HACIA_SU_PUERTA: Readonly<Record<IdPersonaje, Partial<Mando>>> = {
  skayboy: { izquierda: true },
  poligirl: { derecha: true },
};

test('el nivel 1 es el que dice el contrato: dos entradas, dos puertas, nada que devuelva', () => {
  // Si esto falla, los tres casos de abajo están probando otro nivel. La lista es la de
  // `CTR-16.5` desde `CTR-16.10`: el molinete y las cuatro piezas, escritas a mano.
  const caracteres = new Set(NIVEL_1.grilla.join(''));
  for (const c of caracteres) {
    const t = BANCO.leyenda[c];
    assert.ok(t !== undefined, `«${c}» no está en la leyenda`);
    assert.ok(!['molinete', 'palanca', 'placa', 'compuerta', 'caja'].includes(t.tipo), `el nivel 1 trae un ${t.tipo}`);
  }
  assert.deepEqual([NIVEL_1.mecanismos, NIVEL_1.compuertas], [[], []], 'y no declara ni mecanismos ni compuertas');
});

test('🔴 T-248: uno solo en su puerta no gana, aunque se quede ahí todo lo que quiera', () => {
  const mundo = crearMundo(BANCO, NIVEL_1);
  const sucesos = correr(mundo, mandos({ skayboy: HACIA_SU_PUERTA.skayboy }), 8);
  assert.ok(mundo.cuerpos.skayboy.enPuerta, 'control: skayboy sí llegó a su puerta');
  assert.ok(!mundo.cuerpos.poligirl.enPuerta);
  assert.ok(!mundo.terminado, 'con uno solo en la puerta el nivel sigue abierto');
  assert.ok(!sucesos.some((s) => s.tipo === 'puerta'), 'y la puerta no suena');
});

test('T-248: con los dos en su puerta se gana, de a dos y con las dos columnas a la vez', () => {
  const mundo = crearMundo(BANCO, NIVEL_1);
  const sucesos = correr(mundo, mandos(HACIA_SU_PUERTA), 3);
  assert.ok(mundo.terminado);
  assert.deepEqual(sucesos.filter((s) => s.tipo === 'puerta'), [{ tipo: 'puerta' }], 'la puerta suena una vez');
});

test('T-248: se gana solo, una columna y después la otra, sin ningún botón que aprender (D-43)', () => {
  const mundo = crearMundo(BANCO, NIVEL_1);
  correr(mundo, mandos({ skayboy: HACIA_SU_PUERTA.skayboy }), 3);
  assert.ok(!mundo.terminado);
  correr(mundo, mandos({ poligirl: HACIA_SU_PUERTA.poligirl }), 3);
  assert.ok(mundo.terminado, 'el que llega solo pasa el nivel 1 igual (BR-25 b)');
});

test('🔴 T-248: el que llegó primero espera gratis — no se mueve, no vuelve, y el reloj es el mismo para los dos', () => {
  const mundo = crearMundo(BANCO, NIVEL_1);
  correr(mundo, mandos({ skayboy: HACIA_SU_PUERTA.skayboy }), 3);
  const quieto = { x: mundo.cuerpos.skayboy.x, y: mundo.cuerpos.skayboy.y };

  // Diez segundos esperando mientras la otra columna ni se toca, y después ella llega.
  const esperando = correr(mundo, mandos(), 10);
  assert.deepEqual({ x: mundo.cuerpos.skayboy.x, y: mundo.cuerpos.skayboy.y }, quieto);
  assert.ok(mundo.cuerpos.skayboy.enPuerta, 'sigue en su puerta');
  assert.deepEqual(esperando, [], 'esperar no produce nada: ni una vuelta, ni un sonido');

  const tiempoAntes = mundo.tiempo;
  correr(mundo, mandos({ poligirl: HACIA_SU_PUERTA.poligirl }), 3);
  assert.ok(mundo.terminado);
  // El único costo de esperar es el reloj, y es el mismo reloj que corre para la que viene.
  assert.ok(mundo.tiempo > tiempoAntes);
  assert.ok(!Object.keys(mundo.cuerpos.skayboy).some((k) => /espera|castigo|costo/i.test(k)));
});

test('🔴 después de ganar el mundo se congela: el reloj no corre y nadie se mueve', () => {
  const mundo = crearMundo(BANCO, NIVEL_1);
  correr(mundo, mandos(HACIA_SU_PUERTA), 3);
  const t = mundo.tiempo;
  const x = mundo.cuerpos.skayboy.x;
  const despues = correr(mundo, mandos({ skayboy: { derecha: true, saltar: true } }), 2);
  assert.equal(mundo.tiempo, t);
  assert.equal(mundo.cuerpos.skayboy.x, x);
  assert.deepEqual(despues, []);
});

/**
 * Qué le llega al navegador. La vista previa de cada PR siembra los borradores para que se
 * puedan jugar en un teléfono; **la dirección de producción nunca**. Es la mitad que importa
 * y la que este caso cuida: un borrador en producción es un nivel sin jugar en el teléfono
 * de alguien (`CTR-16.7`).
 */
test('nivelesASembrar: producción solo los listo; la vista previa del PR y el desarrollo, todos', () => {
  const mezcla: Banco = {
    ...BANCO,
    niveles: [
      { ...BANCO.niveles[0]!, id: 'NIV-01', estado: 'listo' },
      { ...BANCO.niveles[0]!, id: 'NIV-02', estado: 'borrador' },
    ],
  };
  const ids = (n: readonly { id: string }[]) => n.map((x) => x.id);
  assert.deepEqual(ids(nivelesASembrar(mezcla, { desarrollo: false, vercel: 'production' })), ['NIV-01']);
  assert.deepEqual(ids(nivelesASembrar(mezcla, { desarrollo: false })), ['NIV-01'], 'un build sin Vercel es producción');
  assert.deepEqual(ids(nivelesASembrar(mezcla, { desarrollo: false, vercel: 'preview' })), ['NIV-01', 'NIV-02']);
  assert.deepEqual(ids(nivelesASembrar(mezcla, { desarrollo: true })), ['NIV-01', 'NIV-02']);
});

/* =========================================================================================
   Guitarras y cigarrillos (D-47 punto 4, BR-31 punto 2, CTR-16.4 versión 3)
   ========================================================================================= */

/** Una copia del banco con la fila 7 de un nivel cambiada. */
function conFila7(id: string, fila7: string): Banco {
  return {
    ...BANCO,
    niveles: BANCO.niveles.map((n) => (n.id === id ? { ...n, grilla: n.grilla.map((r, f) => (f === 7 ? fila7 : r)) } : n)),
  };
}

const deE10 = (problemas: readonly string[]) => problemas.filter((p) => p.includes('(BR-31 punto 2, E10)'));

test('E10: cada nivel del banco trae tantas guitarras como cigarrillos', () => {
  assert.deepEqual(deE10(problemasDelBanco(BANCO)), []);
  for (const nivel of BANCO.niveles) {
    const t = tesorosDelNivel(BANCO, nivel);
    assert.equal(t.skayboy, t.poligirl, `${nivel.id}: ${t.skayboy} y ${t.poligirl}`);
  }
});

test('🔴 E10: NIV-01 con dos guitarras y ningún cigarrillo no entra, y el mensaje dice el nivel y las dos cuentas', () => {
  // La fila roja de la tabla de CTR-16.4.
  const problemas = deE10(problemasDelBanco(conFila7('NIV-01', '#A.g.1...2.g.B#')));
  assert.deepEqual(problemas, [
    'NIV-01: trae 2 tesoro(s) de skayboy y 0 de poligirl, y cada nivel trae la misma cantidad de los dos (BR-31 punto 2, E10)',
  ]);
});

test('🔴 E10: y al revés, NIV-01 con dos cigarrillos y ninguna guitarra tampoco entra', () => {
  // La igualdad se mira de los dos lados: una E10 que solo frenara el sobrante de guitarras
  // dejaría pasar un nivel cargado de cigarrillos.
  const problemas = deE10(problemasDelBanco(conFila7('NIV-01', '#A.-.1...2.-.B#')));
  assert.deepEqual(problemas, [
    'NIV-01: trae 0 tesoro(s) de skayboy y 2 de poligirl, y cada nivel trae la misma cantidad de los dos (BR-31 punto 2, E10)',
  ]);
});

test('🔴 E10: sacarle un cigarrillo a un nivel que traía dos y dos tampoco entra', () => {
  const nivel = BANCO.niveles.find((n) => tesorosDelNivel(BANCO, n).poligirl >= 2);
  assert.ok(nivel, 'control: hay un nivel con dos cigarrillos');
  const cigarrillo = Object.entries(BANCO.leyenda).find(([, t]) => t.tipo === 'tesoro' && t.para?.[0] === 'poligirl')![0];
  const fila = nivel.grilla.findIndex((r) => r.includes(cigarrillo));
  const banco: Banco = {
    ...BANCO,
    niveles: BANCO.niveles.map((n) =>
      n === nivel ? { ...n, grilla: n.grilla.map((r, f) => (f === fila ? r.replace(cigarrillo, '.') : r)) } : n,
    ),
  };
  const problemas = deE10(problemasDelBanco(banco));
  assert.equal(problemas.length, 1, problemas.join('\n'));
  assert.ok(problemas[0]!.startsWith(`${nivel.id}: trae 2 tesoro(s) de skayboy y 1 de poligirl`), problemas[0]);
});

test('E10: cero y cero cumple (BR-31 no fija un mínimo), y uno y uno también', () => {
  assert.deepEqual(deE10(problemasDelBanco(conFila7('NIV-01', '#A...1...2...B#'))), []);
  assert.deepEqual(deE10(problemasDelBanco(conFila7('NIV-01', '#A.-.1...2.g.B#'))), [], 'da igual de qué lado esté cada uno');
});

/**
 * **No es condición para ganar** (`BR-31` punto 2, y antes la sección "No entra el coleccionable
 * como condición"): se gana con los dos en su puerta, juntando todo o nada. En `NIV-02` la guitarra
 * está arriba del infierno y el cigarrillo arriba del cielo, del otro lado de cada entrada: ir
 * derecho a la puerta no junta ninguno.
 */
test('🔴 BR-31: se gana sin juntar ni una guitarra ni un cigarrillo, y juntándolos todos también', () => {
  const nivel = BANCO.niveles.find((n) => n.id === 'NIV-02')!;
  const derecho = crearMundo(BANCO, nivel);
  correr(derecho, mandos({ skayboy: { izquierda: true }, poligirl: { derecha: true } }), 3);
  assert.deepEqual(juntadosPorPersonaje(derecho), { skayboy: 0, poligirl: 0 }, 'control: no juntó nada');
  assert.ok(derecho.terminado, 'sin juntar nada, los dos en su puerta ganan');

  // Ahora cada uno va primero a buscar el suyo —a la columna 6 él, a la 8 ella— y después a su puerta.
  const todo = crearMundo(BANCO, nivel);
  const hasta = (quien: IdPersonaje, hacia: 'izquierda' | 'derecha', x: (px: number) => boolean) => {
    for (let i = 0; i < 300 && !x(todo.cuerpos[quien].x); i++) paso(todo, mandos({ [quien]: { [hacia]: true } }), CUADRO);
  };
  hasta('skayboy', 'derecha', (px) => px + 10 > 6 * 16 + 4);
  hasta('poligirl', 'izquierda', (px) => px < 9 * 16 - 4);
  assert.deepEqual(juntadosPorPersonaje(todo), tesorosDelNivel(BANCO, nivel), 'control: juntaron todo');
  assert.ok(!todo.terminado);
  correr(todo, mandos({ skayboy: { izquierda: true }, poligirl: { derecha: true } }), 3);
  assert.ok(todo.terminado, 'juntando todo se gana igual: ni más ni menos');
});
