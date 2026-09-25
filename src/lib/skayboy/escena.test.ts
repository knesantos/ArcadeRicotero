/**
 * La escena (`T-278`): qué dibuja la isla de cada atlas, en qué estado y dónde. Se juega en Node
 * porque la isla no se puede cargar acá, y todo lo que decide el dibujo vive en `escena.ts`.
 *
 * Cuatro cosas, y cada una tiene su caso en rojo:
 *
 * 1. **Los atlas que se piden existen y llevan versión** (`CTR-15.5`, `CTR-15.8`): el nombre de
 *    cada pieza es `<pieza>.v<N>`, con la misma `N` que imprime `src/arte/pixel/<pieza>.txt`, y
 *    el PNG y el JSON están en `public/sprites/`. `rutaDe()` no arma una ruta sin versión.
 * 2. **El JSON publicado es el que la escena espera** (`CTR-15.7`): cada estado que pide está, y
 *    ninguno sobra — una fila que nadie dibuja es un dibujo que nadie ve.
 * 3. **Cada pose tiene su estado, y el perfil se espeja** (`UX-28 §3`): de frente `enPausa`, de
 *    perfil `quieto`, `corre`, y en el aire `salta` o `cae` según `vy`; el cuadro que sigue a una
 *    vuelta, de frente (`UX-29 §3`).
 * 4. **Cada celda con su tile y su estado** (`CTR-16.10.8`): la palanca activa, la placa pisada,
 *    la compuerta abierta, la caja donde está, el tesoro que se juntó. Y todo en enteros.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { GRILLA } from '../pixel/fuente.ts';
import type { JsonDelAtlas } from '../pixel/fuente.ts';
import {
  ATLAS_DE_LA_SALA,
  CELDA_DE_PERSONAJE,
  ESTADOS_QUE_PIDE,
  PIEZAS,
  atlasDe,
  cuadroDelAtlas,
  estadoDelCuerpo,
  grillaDelAtlas,
  nivelAJugar,
  problemasDelAtlas,
  problemasDelCuadro,
  problemasDelNombre,
  rutaDe,
  tileDe,
  trazosDe,
  type Pieza,
  type Trazo,
} from './escena.ts';
import { CUERPO_ALTO, CUERPO_ANCHO, TILE, crearMundo, type Cuerpo, type Mundo } from './mundo.ts';
import { problemasDelBanco, type Banco, type CompuertaDelNivel, type MecanismoDelNivel, type Nivel } from './niveles.ts';

const BANCO: Banco = JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as Banco;

/** Del nombre de la ruta al archivo del disco: `/sprites/x.v1.png` vive en `public/sprites/`. */
const enDisco = (ruta: string): string => `public${ruta}`;

function jsonPublicado(pieza: Pieza): JsonDelAtlas {
  return JSON.parse(readFileSync(enDisco(rutaDe(atlasDe(BANCO)[pieza], 'json')), 'utf-8')) as JsonDelAtlas;
}

/** El ancho y el alto de un PNG, leídos de su cabecera IHDR. */
function medidaDelPng(archivo: string): { ancho: number; alto: number } {
  const b = readFileSync(archivo);
  return { ancho: b.readUInt32BE(16), alto: b.readUInt32BE(20) };
}

/* =========================================================================================
   1. Los nombres, las rutas y los archivos
   ========================================================================================= */

test('cada pieza pide su atlas con versión, y es la versión que imprime su dibujo (CTR-15.8)', () => {
  const nombres = atlasDe(BANCO);
  for (const pieza of PIEZAS) {
    assert.deepEqual(problemasDelNombre(nombres[pieza]), [], `${pieza}: ${nombres[pieza]}`);
    const txt = readFileSync(`src/arte/pixel/${pieza}.txt`, 'utf-8');
    const version = /^version:\s*(\d+)/m.exec(txt)?.[1];
    assert.ok(version, `src/arte/pixel/${pieza}.txt no declara su version:`);
    assert.equal(
      nombres[pieza],
      `${pieza}.v${version}`,
      `${pieza}: la isla pide ${nombres[pieza]} y el dibujo imprime la v${version}: se vería el atlas viejo`,
    );
  }
  assert.equal(nombres.sala, ATLAS_DE_LA_SALA);
});

test('el PNG y el JSON de cada atlas están en public/sprites/', () => {
  const nombres = atlasDe(BANCO);
  for (const pieza of PIEZAS) {
    for (const extension of ['png', 'json'] as const) {
      const ruta = rutaDe(nombres[pieza], extension);
      assert.match(ruta, /^\/sprites\/[a-z]+\.v\d+\.(png|json)$/);
      assert.ok(existsSync(enDisco(ruta)), `${enDisco(ruta)} no existe`);
    }
  }
});

test('🔴 un nombre sin versión no tiene ruta', () => {
  for (const nombre of ['skayboy', 'skayboy.png', 'skayboy.v0', 'skayboy.v', 'Skayboy.v1', 'v1/skayboy', 'skayboy.v1.png']) {
    assert.equal(problemasDelNombre(nombre).length, 1, `«${nombre}» tenía que caer`);
    assert.throws(() => rutaDe(nombre, 'png'), /versión en el nombre/, `rutaDe(«${nombre}») tenía que tirar`);
  }
  assert.equal(rutaDe('skayboy.v12', 'json'), '/sprites/skayboy.v12.json');
});

test('🔴 los muñecos toman el atlas del banco: si el banco cambia de versión, la isla la sigue', () => {
  const otro: Banco = {
    ...BANCO,
    personajes: BANCO.personajes.map((p) => (p.id === 'poligirl' ? { ...p, atlas: 'poligirl.v2' } : p)),
  };
  assert.equal(atlasDe(otro).poligirl, 'poligirl.v2');
  assert.throws(() => atlasDe({ ...BANCO, personajes: BANCO.personajes.filter((p) => p.id !== 'skayboy') }), /skayboy/);
});

/* =========================================================================================
   2. El JSON publicado, contra lo que la escena pide
   ========================================================================================= */

test('la celda del muñeco es la de la imprenta (CTR-15.3)', () => {
  assert.deepEqual({ ...CELDA_DE_PERSONAJE }, GRILLA.personaje);
  assert.deepEqual({ ancho: TILE, alto: TILE }, GRILLA.tile);
});

test('el JSON de cada atlas es el que la escena espera, y ningún estado sobra', () => {
  for (const pieza of PIEZAS) {
    const json = jsonPublicado(pieza);
    assert.deepEqual(problemasDelAtlas(pieza, json), [], pieza);
    const sobran = Object.keys(json.animaciones).filter((e) => !ESTADOS_QUE_PIDE[pieza].includes(e));
    assert.deepEqual(sobran, [], `${pieza}: estados que la escena nunca dibuja`);
  }
});

test('cada PNG, cortado en la grilla de su JSON, da cuadros del tamaño de la celda: se carga a tamaño nativo (CTR-15.6)', () => {
  const nombres = atlasDe(BANCO);
  for (const pieza of PIEZAS) {
    const json = jsonPublicado(pieza);
    const { columnas, filas } = grillaDelAtlas(json);
    const { ancho, alto } = medidaDelPng(enDisco(rutaDe(nombres[pieza], 'png')));
    assert.deepEqual(problemasDelCuadro(pieza, json, ancho / columnas, alto / filas), [], pieza);
  }
});

test('🔴 el auditor del JSON sabe encontrar un estado que falta, otro contrato, otra pieza, otra celda', () => {
  const sano = jsonPublicado('skayboy');
  const sinCae = { ...sano, animaciones: Object.fromEntries(Object.entries(sano.animaciones).filter(([e]) => e !== 'cae')) };
  const casos: [string, unknown, string][] = [
    ['sin cae', sinCae, '«cae»'],
    ['otro contrato', { ...sano, contrato: 'CTR-99' }, 'CTR-99'],
    ['otra pieza', { ...sano, pieza: 'poligirl' }, '«poligirl»'],
    ['celda a ×2', { ...sano, celda: { ancho: 32, alto: 48 } }, '32×48'],
    ['otra caja de colisión', { ...sano, colision: { ancho: 12, alto: 20 } }, 'colisión'],
    ['nada', null, 'no es un objeto'],
  ];
  for (const [caso, json, espera] of casos) {
    const problemas = problemasDelAtlas('skayboy', json);
    assert.ok(problemas.some((p) => p.includes(espera)), `${caso}: tenía que caer por «${espera}» y dijo:\n${problemas.join('\n') || '(nada)'}`);
  }
  // Un PNG guardado a ×2 corta cuadros de 32 × 48; y basta con que falle una de las dos medidas.
  assert.equal(problemasDelCuadro('skayboy', sano, 32, 48).length, 1);
  assert.equal(problemasDelCuadro('skayboy', sano, 16, 48).length, 1, 'solo el alto mal');
  assert.equal(problemasDelCuadro('skayboy', sano, 32, 24).length, 1, 'solo el ancho mal');
  assert.deepEqual(problemasDelCuadro('skayboy', sano, 16, 24), []);
});

test('el cuadro de cada estado: la fila del atlas, y la carrera de cuatro a diez por segundo', () => {
  const json = jsonPublicado('skayboy');
  const columnas = grillaDelAtlas(json).columnas;
  assert.equal(columnas, 4);
  assert.equal(cuadroDelAtlas(json, 'quieto', 3.7), json.animaciones.quieto!.fila * columnas);
  assert.equal(cuadroDelAtlas(json, 'enPausa', 0), json.animaciones.enPausa!.fila * columnas);
  const corre = json.animaciones.corre!.fila * columnas;
  assert.deepEqual(
    [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.45].map((t) => cuadroDelAtlas(json, 'corre', t)),
    [corre, corre, corre + 1, corre + 2, corre + 3, corre, corre],
  );
  // Un estado de varios cuadros que no repite se queda en el último.
  const unaVez = { animaciones: { a: { fila: 2, cuadros: 3, porSegundo: 10, repite: false } } };
  assert.equal(cuadroDelAtlas(unaVez, 'a', 5), 2 * 3 + 2);
  assert.throws(() => cuadroDelAtlas(json, 'muerte', 0), /muerte/);
});

/* =========================================================================================
   3. Los muñecos
   ========================================================================================= */

function cuerpo(parcial: Partial<Cuerpo> = {}): Cuerpo {
  const mundo = crearMundo(BANCO, BANCO.niveles[0]!);
  return Object.assign(mundo.cuerpos.skayboy, parcial);
}

test('de frente es esperando, de perfil es en juego (UX-28 §3)', () => {
  assert.deepEqual(estadoDelCuerpo(cuerpo({ conDedo: false, mira: -1 })), { estado: 'enPausa', espejo: false });
  assert.deepEqual(estadoDelCuerpo(cuerpo({ conDedo: true, vx: 0, mira: 1 })), { estado: 'quieto', espejo: false });
  assert.deepEqual(estadoDelCuerpo(cuerpo({ conDedo: true, vx: 88, mira: 1 })), { estado: 'corre', espejo: false });
});

test('🔴 el perfil se espeja cuando mira a la izquierda, y el de frente nunca', () => {
  assert.deepEqual(estadoDelCuerpo(cuerpo({ conDedo: true, vx: -88, mira: -1 })), { estado: 'corre', espejo: true });
  assert.deepEqual(estadoDelCuerpo(cuerpo({ conDedo: true, vx: 0, mira: -1 })), { estado: 'quieto', espejo: true });
  assert.deepEqual(estadoDelCuerpo(cuerpo({ conDedo: true, enSuelo: false, vy: 50, mira: -1 })), { estado: 'cae', espejo: true });
  assert.equal(estadoDelCuerpo(cuerpo({ conDedo: false, mira: -1 })).espejo, false);
});

test('🔴 en el aire: salta mientras sube, cae desde el vértice (CTR-15.7 tiene dos filas, poseDe una)', () => {
  assert.equal(estadoDelCuerpo(cuerpo({ conDedo: true, enSuelo: false, vy: -270 })).estado, 'salta');
  assert.equal(estadoDelCuerpo(cuerpo({ conDedo: true, enSuelo: false, vy: 0 })).estado, 'cae');
  assert.equal(estadoDelCuerpo(cuerpo({ conDedo: true, enSuelo: false, vy: 320 })).estado, 'cae');
});

test('🔴 el cuadro que sigue a una vuelta va de frente aunque haya un dedo encima (UX-29 §3)', () => {
  const c = cuerpo({ conDedo: true, vx: 88, mira: -1 });
  assert.deepEqual(estadoDelCuerpo(c, true), { estado: 'enPausa', espejo: false });
  const mundo = crearMundo(BANCO, BANCO.niveles[0]!);
  mundo.cuerpos.poligirl.conDedo = true;
  const deUno = (id: 'skayboy' | 'poligirl', vueltos: ReadonlySet<'skayboy' | 'poligirl'>) =>
    trazosDe(mundo, vueltos).find((t) => t.pieza === id)!.estado;
  assert.equal(deUno('poligirl', new Set()), 'quieto');
  assert.equal(deUno('poligirl', new Set(['poligirl'])), 'enPausa');
  assert.equal(deUno('skayboy', new Set(['poligirl'])), 'enPausa', 'el otro no se entera: sigue de frente porque no tiene dedo');
});

test('la celda del muñeco apoya abajo y al centro de la caja de colisión, en enteros (CTR-15.3)', () => {
  const mundo = crearMundo(BANCO, BANCO.niveles[0]!);
  const c = mundo.cuerpos.skayboy;
  c.x = 37.4;
  c.y = 91.6;
  const t = trazosDe(mundo).find((q) => q.pieza === 'skayboy')!;
  assert.ok(Number.isInteger(t.x) && Number.isInteger(t.y));
  assert.equal(t.x, Math.round(37.4 + (CUERPO_ANCHO - 16) / 2));
  assert.equal(t.y, Math.round(91.6 + CUERPO_ALTO - 24));
  // Parado en la entrada, el pie de la celda cae en el piso del tile.
  const parado = trazosDe(crearMundo(BANCO, BANCO.niveles[0]!)).find((q) => q.pieza === 'poligirl')!;
  assert.equal((parado.y + 24) % TILE, 0);
});

/* =========================================================================================
   4. La sala
   ========================================================================================= */

const deLaSala = (trazos: readonly Trazo[]) => trazos.filter((t) => t.pieza === 'sala');
const en = (trazos: readonly Trazo[], columna: number, fila: number) =>
  deLaSala(trazos).filter((t) => t.x === columna * TILE && t.y === fila * TILE).map((t) => t.estado);

test('el nivel 1: un tile por sólido, puerta y tesoro; nada en el aire ni en las entradas', () => {
  const nivel = BANCO.niveles[0]!;
  const mundo = crearMundo(BANCO, nivel);
  const trazos = trazosDe(mundo);
  let esperados = 0;
  nivel.grilla.forEach((renglon, fila) => {
    [...renglon].forEach((car, columna) => {
      const tipo = BANCO.leyenda[car]?.tipo;
      const aca = en(trazos, columna, fila);
      if (tipo === 'aire' || tipo === 'entrada') assert.deepEqual(aca, [], `[${columna}, ${fila}] es ${tipo}`);
      else {
        esperados++;
        assert.equal(aca.length, 1, `[${columna}, ${fila}] (${tipo}) tiene ${aca.length} tiles`);
      }
    });
  });
  assert.equal(deLaSala(trazos).length, esperados);
  assert.deepEqual(en(trazos, 1, 7), ['puertaSkayboy']);
  assert.deepEqual(en(trazos, 13, 7), ['puertaPoligirl']);
  assert.deepEqual(en(trazos, 0, 0), ['solido']);
  // Todo adentro del área de 240 × 144 nativos, y en enteros: el tile mide 16 × 16 y la celda del
  // muñeco 16 × 24, que es la que puede asomar por arriba.
  for (const t of trazos) {
    const { ancho, alto } = t.pieza === 'sala' ? { ancho: TILE, alto: TILE } : CELDA_DE_PERSONAJE;
    assert.ok(Number.isInteger(t.x) && Number.isInteger(t.y), `${t.pieza}/${t.estado} en [${t.x}, ${t.y}]`);
    assert.ok(t.x >= 0 && t.y >= 0 && t.x + ancho <= 240 && t.y + alto <= 144, `${t.pieza}/${t.estado} se sale del área`);
  }
  // Los muñecos van arriba de la sala: se dibujan últimos.
  assert.deepEqual(trazos.slice(-2).map((t) => t.pieza), ['skayboy', 'poligirl']);
});

test('🔴 el tesoro juntado deja de dibujarse', () => {
  const mundo = crearMundo(BANCO, BANCO.niveles[0]!);
  assert.deepEqual(en(trazosDe(mundo), 3, 7), ['tesoro']);
  mundo.juntados.add('3,7');
  assert.deepEqual(en(trazosDe(mundo), 3, 7), []);
});

const VACIA = BANCO.niveles[0]!;

function salaCon(grilla: string[], mecanismos: MecanismoDelNivel[], compuertas: CompuertaDelNivel[]): Mundo {
  const nivel: Nivel = { ...VACIA, id: 'NIV-PRUEBA', estado: 'borrador', grilla, mecanismos, compuertas };
  const banco: Banco = { ...BANCO, niveles: [nivel] };
  assert.deepEqual(problemasDelBanco(banco), [], 'la sala de prueba tiene que ser un nivel que el banco admite');
  return crearMundo(banco, nivel);
}

/**
 * Una palanca en la 4, una placa en la 9, un tramo de compuerta de dos celdas en la 12, una caja en
 * la 6, y arriba los tres molinetes: de cielo, de infierno y de los dos.
 */
const PIEZAS_DE_LA_SALA = [
  '###############',
  '#.............#',
  '#.C.I.X.......#',
  '#.............#',
  '#...........#.#',
  '#...........|.#',
  '#...........|.#',
  '#A1./.n..=.2|B#',
  '###############',
];

test('🔴 cada pieza con su estado: palanca, placa, compuerta y caja (CTR-16.10.8)', () => {
  const mundo = salaCon(
    PIEZAS_DE_LA_SALA,
    [
      { id: 'MEC-01', en: [4, 7], abre: ['COM-01'] },
      { id: 'MEC-02', en: [9, 7], abre: ['COM-01'] },
    ],
    [{ id: 'COM-01', en: [12, 5] }],
  );
  let trazos = trazosDe(mundo);
  assert.deepEqual(en(trazos, 4, 7), ['palancaReposo']);
  assert.deepEqual(en(trazos, 9, 7), ['placaLibre']);
  assert.deepEqual([...en(trazos, 12, 5), ...en(trazos, 12, 6)], ['compuertaCerrada', 'compuertaCerrada']);
  assert.deepEqual(en(trazos, 6, 7), ['caja']);
  assert.deepEqual([...en(trazos, 2, 2), ...en(trazos, 4, 2), ...en(trazos, 6, 2)], ['molineteCielo', 'molineteInfierno', 'molineteDos']);

  mundo.palancas[0]!.activa = true;
  mundo.placas[0]!.pisada = true;
  mundo.compuertas[0]!.abierta = true;
  trazos = trazosDe(mundo);
  assert.deepEqual(en(trazos, 4, 7), ['palancaActiva']);
  assert.deepEqual(en(trazos, 9, 7), ['placaPisada']);
  assert.deepEqual([...en(trazos, 12, 5), ...en(trazos, 12, 6)], ['compuertaAbierta', 'compuertaAbierta']);
});

test('🔴 la caja se dibuja donde está, no donde arrancó, y en enteros', () => {
  const mundo = salaCon(PIEZAS_DE_LA_SALA, [
    { id: 'MEC-01', en: [4, 7], abre: ['COM-01'] },
    { id: 'MEC-02', en: [9, 7], abre: ['COM-01'] },
  ], [{ id: 'COM-01', en: [12, 5] }]);
  const k = mundo.cajas[0]!;
  k.x = 7 * TILE + 5.5;
  k.estado = 'tramo';
  k.columna = 8;
  const cajas = deLaSala(trazosDe(mundo)).filter((t) => t.estado === 'caja');
  assert.equal(cajas.length, 1, 'una caja, un tile: la celda donde arrancó es aire');
  assert.deepEqual({ x: cajas[0]!.x, y: cajas[0]!.y }, { x: Math.round(7 * TILE + 5.5), y: 7 * TILE });
});

test('🔴 el molinete de uno solo sin elemento: el cielo devuelve a Skayboy, el infierno a Poligirl (UX-30 §3)', () => {
  // El schema exige `elemento` (CTR-16.10) y `problemasDelBanco()` no: esta rama es la de un banco
  // que pasó el build sin pasar el schema. Tiene que dibujar el mismo reparto que la leyenda.
  const mundo = crearMundo(BANCO, BANCO.niveles[0]!);
  const sin = (devuelve: readonly ('skayboy' | 'poligirl')[]) => tileDe(mundo, { tipo: 'molinete', devuelve }, 0, 0);
  assert.equal(sin(['skayboy']), 'molineteCielo');
  assert.equal(sin(['poligirl']), 'molineteInfierno');
  assert.equal(sin(['skayboy', 'poligirl']), 'molineteDos');
  // Y el reparto es el mismo que dice la leyenda del banco, que sí trae elemento.
  for (const t of Object.values(BANCO.leyenda)) {
    if (t.tipo !== 'molinete' || (t.devuelve ?? []).length !== 1) continue;
    assert.equal(tileDe(mundo, t, 0, 0), sin(t.devuelve!), `${t.elemento}: el dibujo sin elemento no coincide con la leyenda`);
  }
  // Con elemento, manda el elemento.
  assert.equal(tileDe(mundo, { tipo: 'molinete', elemento: 'infierno', devuelve: ['skayboy'] }, 0, 0), 'molineteInfierno');
});

test('🔴 qué nivel se juega: el primero, o el que se pide por id si está sembrado', () => {
  const niveles = BANCO.niveles;
  const primero = niveles[0]!;
  const otro = niveles.at(-1)!;
  assert.equal(nivelAJugar(niveles, null), primero);
  assert.equal(nivelAJugar(niveles, otro.id), otro);
  assert.equal(nivelAJugar(niveles, ` ${otro.id.toLowerCase()} `), otro, 'el id se lee sin mayúsculas ni espacios');
  for (const basura of ['', 'NIV-99', 'nivel', '4', '<script>']) {
    assert.equal(nivelAJugar(niveles, basura), primero, `«${basura}» juega el primero`);
  }
  assert.equal(nivelAJugar([], otro.id), undefined, 'sin niveles sembrados no hay nivel: queda el rótulo');
});

test('en cada nivel del banco, cada trazo pide un estado que su atlas publicado tiene', () => {
  const jsons = Object.fromEntries(PIEZAS.map((p) => [p, jsonPublicado(p)])) as Record<Pieza, JsonDelAtlas>;
  for (const nivel of BANCO.niveles) {
    const mundo = crearMundo(BANCO, nivel);
    // Con todo en su otro estado también: la palanca activa, la placa pisada, la compuerta abierta.
    for (const q of mundo.palancas) q.activa = true;
    for (const l of mundo.placas) l.pisada = true;
    for (const g of mundo.compuertas) g.abierta = true;
    for (const trazos of [trazosDe(crearMundo(BANCO, nivel)), trazosDe(mundo)]) {
      for (const t of trazos) {
        assert.ok(jsons[t.pieza].animaciones[t.estado], `${nivel.id}: pide ${t.pieza}/${t.estado}, que el atlas no tiene`);
        assert.doesNotThrow(() => cuadroDelAtlas(jsons[t.pieza], t.estado, mundo.tiempo));
      }
    }
  }
});
