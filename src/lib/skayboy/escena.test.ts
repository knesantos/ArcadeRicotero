/**
 * La escena (`T-278`): qué dibuja la isla de cada atlas, en qué estado y dónde. Se juega en Node
 * porque la isla no se puede cargar acá, y todo lo que decide el dibujo vive en `escena.ts`.
 *
 * Cinco cosas, y cada una tiene su caso en rojo:
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
 * 5. **Ganar se ve, y se sigue en un toque** (`UX-32`, `T-290`): en el cuadro en que el mundo
 *    termina, las dos puertas se dibujan abiertas —las dos en el mismo cuadro— y los dos muñecos de
 *    frente; desde ese cuadro hay un nivel al que seguir, el que sigue en lo sembrado; y la isla
 *    lo sigue con un botón adentro del recorte, sin recargar la página.
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
  alTocarSeguir,
  atlasDe,
  cuadroDelAtlas,
  estadoDelCuerpo,
  grillaDelAtlas,
  mostrarSeguir,
  nivelAJugar,
  problemasDelAtlas,
  problemasDelCuadro,
  problemasDelNombre,
  rutaDe,
  seguirVisible,
  siguienteAlGanar,
  tileDe,
  trazosDe,
  type Pieza,
  type Trazo,
} from './escena.ts';
import { CUADRO_SEG, CUERPO_ALTO, CUERPO_ANCHO, TILE, crearMundo, paso, type Cuerpo, type Mundo } from './mundo.ts';
import { expandir, leerTraza } from './soluciones.ts';
import { problemasDelBanco, type Banco, type CompuertaDelNivel, type IdPersonaje, type MecanismoDelNivel, type Nivel } from './niveles.ts';

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
    // Y ganado: la puerta abierta (`UX-32`) también tiene que estar en el atlas publicado.
    mundo.terminado = true;
    for (const trazos of [trazosDe(crearMundo(BANCO, nivel)), trazosDe(mundo)]) {
      for (const t of trazos) {
        assert.ok(jsons[t.pieza].animaciones[t.estado], `${nivel.id}: pide ${t.pieza}/${t.estado}, que el atlas no tiene`);
        assert.doesNotThrow(() => cuadroDelAtlas(jsons[t.pieza], t.estado, mundo.tiempo));
      }
    }
  }
});

/* =========================================================================================
   5. Ganar (`UX-32`, `T-290`)
   ========================================================================================= */

const SOLUCIONES = JSON.parse(readFileSync('src/data/skayboy-soluciones.json', 'utf-8')) as {
  soluciones: Record<string, { deUno: string[] }>;
};

const puertas = (trazos: readonly Trazo[]) => deLaSala(trazos).filter((t) => t.estado.startsWith('puerta')).map((t) => t.estado);

test('🔴 ganar se ve: jugando la traza del nivel 1, las dos puertas se abren en el mismo cuadro, y ni uno antes', () => {
  const nivel = BANCO.niveles[0]!;
  const { traza, problemas } = leerTraza(nivel.id, SOLUCIONES.soluciones[nivel.id]!.deUno);
  assert.ok(traza, problemas.join('\n'));
  const mundo = crearMundo(BANCO, nivel);
  let cuadro = 0;
  for (const m of expandir(traza)) {
    assert.deepEqual(puertas(trazosDe(mundo)).sort(), ['puertaPoligirl', 'puertaSkayboy'], `cuadro ${cuadro}: sin ganar, las dos cerradas`);
    paso(mundo, m, CUADRO_SEG);
    cuadro++;
  }
  assert.ok(mundo.terminado, 'la traza grabada del nivel 1 ya no gana: la regraba scripts/resolver-niveles.mjs');
  const trazos = trazosDe(mundo);
  assert.deepEqual(puertas(trazos), ['puertaAbierta', 'puertaAbierta'], 'ganado: las dos abiertas, en el mismo cuadro');
  // Las dos donde estaban: abrir es cambiar el tile, no mover nada (`UX-32 §2.3`).
  assert.deepEqual(en(trazos, 1, 7), ['puertaAbierta']);
  assert.deepEqual(en(trazos, 13, 7), ['puertaAbierta']);
});

test('🔴 ganado, los dos van de frente aunque el último tenga el dedo encima (UX-32 §3)', () => {
  const mundo = crearMundo(BANCO, BANCO.niveles[0]!);
  Object.assign(mundo.cuerpos.poligirl, { conDedo: true, vx: 88, mira: -1 });
  Object.assign(mundo.cuerpos.skayboy, { conDedo: true, vx: 0, mira: 1 });
  const munecos = () => trazosDe(mundo).filter((t) => t.pieza !== 'sala').map((t) => [t.pieza, t.estado, t.espejo]);
  assert.deepEqual(munecos(), [['skayboy', 'quieto', false], ['poligirl', 'corre', true]], 'en juego, de perfil');
  mundo.terminado = true;
  assert.deepEqual(
    munecos(),
    [['skayboy', 'enPausa', false], ['poligirl', 'enPausa', false]],
    'ganado: de frente, sin espejo, ninguno mirando al otro',
  );
});

test('🔴 a dónde se sigue: a ninguna parte sin ganar; ganado, al que sigue en lo sembrado (US-09 c1)', () => {
  const [primero, segundo] = BANCO.niveles;
  assert.ok(primero && segundo, 'el banco tiene menos de dos niveles');
  const mundo = crearMundo(BANCO, primero);
  assert.equal(siguienteAlGanar(mundo, BANCO.niveles), undefined, 'sin ganar no hay a dónde seguir');
  mundo.terminado = true;
  assert.equal(siguienteAlGanar(mundo, BANCO.niveles), segundo);
  // Lo sembrado manda, no el banco: en producción se siembran solo los `listo`, y el que sigue es
  // el siguiente de esos, aunque en el banco haya un borrador en el medio.
  const tercero = BANCO.niveles[2] ?? segundo;
  assert.equal(siguienteAlGanar(mundo, [primero, tercero]), tercero);
  // En el último no hay siguiente: qué pasa ahí es de `producto` (`UX-32 §5`, `BR-27`).
  const ultimo = crearMundo(BANCO, BANCO.niveles.at(-1)!);
  ultimo.terminado = true;
  assert.equal(siguienteAlGanar(ultimo, BANCO.niveles), undefined);
  // Un nivel que no está en lo sembrado no sigue a ninguno: no hay desde dónde contar.
  assert.equal(siguienteAlGanar(mundo, [segundo]), undefined);
});

/**
 * El botón, jugado en Node con un objeto que solo tiene `hidden` —lo único que la escena le toca—.
 * La isla llama a `mostrarSeguir()` después de cada `jugarTic(` y lo que decide está acá: escondido
 * en cada cuadro sin ganar, visible **en el mismo** en que se gana, y escondido otra vez en el
 * último nivel o apenas se siguió.
 */
test('🔴 el botón de seguir: escondido en cada cuadro sin ganar, visible en el cuadro que gana, y ni uno antes (D-32 límite 3)', () => {
  const nivel = BANCO.niveles[0]!;
  const { traza, problemas } = leerTraza(nivel.id, SOLUCIONES.soluciones[nivel.id]!.deUno);
  assert.ok(traza, problemas.join('\n'));
  const mundo = crearMundo(BANCO, nivel);
  // Nace visible a propósito: lo que lo esconde tiene que ser la escena, no el HTML.
  const boton = { hidden: false };
  mostrarSeguir(boton, mundo, BANCO.niveles);
  assert.equal(boton.hidden, true, 'arrancando, el botón se esconde: sin ganar no hay nada que tocar');
  assert.equal(seguirVisible(mundo, BANCO.niveles), false);
  let cuadro = 0;
  for (const m of expandir(traza)) {
    paso(mundo, m, CUADRO_SEG);
    cuadro++;
    mostrarSeguir(boton, mundo, BANCO.niveles);
    assert.equal(boton.hidden, !mundo.terminado, `cuadro ${cuadro}: el botón se ve si y solo si se ganó`);
  }
  assert.ok(mundo.terminado, 'la traza grabada del nivel 1 ya no gana: la regraba scripts/resolver-niveles.mjs');
  assert.equal(seguirVisible(mundo, BANCO.niveles), true);
  assert.equal(boton.hidden, false, 'ganado: el botón ya es tocable en ese mismo cuadro');
  // Sin botón en la página, no tira: la isla lo busca y puede no estar.
  assert.doesNotThrow(() => mostrarSeguir(null, mundo, BANCO.niveles));
  // En el último, ganado y todo, no hay a dónde: el botón no aparece (`UX-32 §5`, `BR-27`).
  const ultimo = crearMundo(BANCO, BANCO.niveles.at(-1)!);
  ultimo.terminado = true;
  const otro = { hidden: false };
  mostrarSeguir(otro, ultimo, BANCO.niveles);
  assert.equal(otro.hidden, true, 'en el último nivel el botón no aparece');
  assert.equal(seguirVisible(ultimo, BANCO.niveles), false);
});

test('🔴 tocar seguir: sin ganar no hace nada; ganado, arma el nivel que sigue, en cero, y se olvida de quién iba de frente (UX-32 §5)', () => {
  const [primero, segundo] = BANCO.niveles;
  assert.ok(primero && segundo, 'el banco tiene menos de dos niveles');
  const mundo = crearMundo(BANCO, primero);
  const deFrente = new Set<IdPersonaje>(['skayboy']);
  // Sin ganar: un toque que no debería haber llegado no cambia nada.
  assert.equal(alTocarSeguir(mundo, BANCO.niveles, deFrente), undefined, 'sin ganar, tocar no lleva a ningún lado');
  assert.deepEqual([...deFrente], ['skayboy'], 'sin ganar, tocar no toca nada');
  mundo.terminado = true;
  const nuevo = alTocarSeguir(mundo, BANCO.niveles, deFrente);
  assert.ok(nuevo, 'ganado, tocar arma un mundo');
  assert.notEqual(nuevo, mundo, 'es un mundo nuevo, no el viejo vuelto a cero');
  assert.equal(nuevo.nivel.id, segundo.id, 'el que sigue, no el mismo otra vez');
  assert.equal(nuevo.terminado, false);
  // En cero: es el mismo mundo que arma la isla al arrancar ese nivel, bit a bit.
  assert.deepEqual(nuevo, crearMundo(BANCO, segundo));
  assert.equal(deFrente.size, 0, 'nadie arranca el nivel nuevo con el cuadro de frente del viejo');
  // Lo sembrado manda también acá.
  const tercero = BANCO.niveles[2] ?? segundo;
  assert.equal(alTocarSeguir(mundo, [primero, tercero], new Set())?.nivel.id, tercero.id);
  // En el último no hay a dónde: nada, y `deFrente` queda como estaba.
  const ultimo = crearMundo(BANCO, BANCO.niveles.at(-1)!);
  ultimo.terminado = true;
  const quedan = new Set<IdPersonaje>(['poligirl']);
  assert.equal(alTocarSeguir(ultimo, BANCO.niveles, quedan), undefined);
  assert.deepEqual([...quedan], ['poligirl']);
});


/**
 * La isla no se puede cargar en Node, así que lo que queda de ella se lee del fuente, como hace
 * `motor.test.ts`. Lo que decide —si el botón se ve, a qué mundo lleva el toque— ya está jugado
 * arriba con `mostrarSeguir()` y `alTocarSeguir()`; acá se mira que la isla **las llame donde
 * tiene que**, porque una función probada que nadie llama no protege nada:
 *
 * - la página tiene el botón, escondido y adentro del recorte, con el verbo del sitio;
 * - el `onUpdate(` llama a `mostrarSeguir(seguir, mundo, …)` **después** de `jugarTic(`: en el
 *   mismo tic en que se gana, el botón ya se ve (`D-32` límite 3);
 * - la isla no toca el `hidden` del botón por su cuenta: eso es de `mostrarSeguir()`;
 * - el toque le pide el mundo nuevo a `alTocarSeguir(mundo, …, deFrente)`, cambia `mundo` por
 *   **ese**, no arma otro por su cuenta, y suelta las teclas;
 * - seguir no recarga la página;
 * - y el mundo que se cambia es el que se juega y el que se dibuja: el `onUpdate(` le pasa a
 *   `jugarTic(reloj, mundo, …)` y el `onDraw(` a `dibujar(k, mundo, …)` la misma variable `mundo`
 *   —la del `let` que el toque reasigna, sin copia ni sombra adentro del tic—, y `dibujar()` le
 *   pasa ese mundo a `trazosDe(mundo, …)` tal cual. Si dibujara una copia tomada al arrancar, después
 *   de Seguí se vería el nivel viejo; si le tocara `terminado`, al ganar la puerta no se abriría
 *   nunca en la página aunque `escena.test.ts` la vea abrirse en Node (verificación de `T-290`).
 */
const ISLA = 'src/scripts/partida-skayboy.ts';
const PAGINA = 'src/pages/juegos/skayboy-y-poligirl.astro';

function sinComentarios(fuente: string): string {
  return fuente
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:'"`])\/\/[^\n]*/g, '$1');
}

/** El cuerpo `{ … }` de la primera flecha que arranca después de `desde`, o `undefined`. */
function cuerpoDesde(codigo: string, desde: number): string | undefined {
  const flecha = codigo.indexOf('=>', desde);
  const abre = flecha < 0 ? -1 : codigo.indexOf('{', flecha);
  return abre < 0 ? undefined : cuerpoDesdeLlave(codigo, abre);
}

/** El cuerpo de la llave que abre en `abre`, hasta la que la cierra, o `undefined`. */
function cuerpoDesdeLlave(codigo: string, abre: number): string | undefined {
  let hondo = 0;
  for (let i = abre; i < codigo.length; i++) {
    if (codigo[i] === '{') hondo++;
    else if (codigo[i] === '}' && --hondo === 0) return codigo.slice(abre + 1, i);
  }
  return undefined;
}

const MUESTRA = /(?<![\w$.])mostrarSeguir\s*\(\s*seguir\s*,\s*mundo\s*,/;

function problemasDelSeguir(isla: string, pagina: string): string[] {
  const codigo = sinComentarios(isla);
  const html = sinComentarios(pagina);
  const problemas: string[] = [];
  const boton = /<button\b[^>]*\bid="seguir-juego"[^>]*>/.exec(html);
  if (boton === null) problemas.push('la página no tiene el botón #seguir-juego');
  else {
    if (!/\shidden[\s>]/.test(boton[0])) problemas.push('#seguir-juego no nace escondido: se podría tocar sin haber ganado');
    if (!/aria-label=\{PANTALLA\.seguir\}/.test(boton[0])) problemas.push('#seguir-juego no lleva PANTALLA.seguir de etiqueta');
    const recorte = html.indexOf('class="recorte"');
    const cierre = html.indexOf('</div>', recorte);
    if (recorte < 0 || boton.index < recorte || boton.index > cierre) {
      problemas.push('#seguir-juego no vive adentro del recorte: tocar el área no lo toca');
    }
  }
  if (!/querySelector<HTMLButtonElement>\(\s*'#seguir-juego'\s*\)/.test(codigo)) problemas.push('la isla no busca #seguir-juego');
  if (/(?<![\w$])seguir\s*[?!]?\s*\.\s*(hidden\s*=(?!=)|(set|remove|toggle)Attribute\s*\(\s*['"]hidden)/.test(codigo)) {
    problemas.push('la isla esconde o muestra #seguir-juego por su cuenta: eso lo decide mostrarSeguir(');
  }

  // El tic: después de jugarTic(, mostrarSeguir(.
  const onUpdate = codigo.search(/(?<![\w$])onUpdate\s*\(/);
  const tic = onUpdate < 0 ? undefined : cuerpoDesde(codigo, onUpdate);
  if (tic === undefined) problemas.push('la isla no tiene onUpdate(: este auditor no está mirando nada');
  else {
    const muestra = MUESTRA.exec(tic);
    const juega = tic.search(/(?<![\w$.])jugarTic\s*\(/);
    if (muestra === null) problemas.push('el onUpdate( no llama a mostrarSeguir(seguir, mundo, …): al ganar, el botón no aparece');
    else if (juega < 0 || muestra.index < juega) {
      problemas.push('el onUpdate( llama a mostrarSeguir( antes de jugarTic(: el botón aparece un tic tarde (D-32 límite 3)');
    }
  }

  // El toque: el mundo que arma alTocarSeguir(, y las teclas sueltas.
  const click = codigo.search(/addEventListener\(\s*'click'/);
  const toque = click < 0 ? undefined : cuerpoDesde(codigo, click);
  if (toque === undefined) problemas.push('la isla no escucha el toque del botón para seguir');
  else {
    const pide = /const\s+([\w$]+)\s*=\s*alTocarSeguir\s*\(\s*mundo\s*,[^;]*,\s*deFrente\s*\)/.exec(toque);
    if (pide === null) problemas.push('el toque no le pide el mundo nuevo a alTocarSeguir(mundo, …, deFrente)');
    else if (!new RegExp(`(?<![\\w$.])mundo\\s*=(?!=)\\s*${pide[1]}(?![\\w$])`).test(toque)) {
      problemas.push(`el toque no cambia el mundo por el que armó alTocarSeguir( («${pide[1]}»): se sigue jugando el viejo`);
    }
    if (/(?<![\w$.])crearMundo\s*\(/.test(toque)) {
      problemas.push('el toque arma un mundo por su cuenta: lo arma alTocarSeguir(, que es el que sabe a cuál se sigue');
    }
    if (!/(?<![\w$.])soltarTodas\s*\(\s*\)/.test(toque)) {
      problemas.push('el toque no suelta las teclas: el nivel nuevo arrancaría con un dedo trabado (UX-28 §3)');
    }
  }

  // El mundo que se juega y se dibuja es el `let mundo` que el toque reasigna.
  if (!/(?<![\w$.])let\s+mundo\s*=/.test(codigo)) {
    problemas.push('la isla no declara «let mundo»: el toque no tiene qué mundo cambiar');
  }
  if (tic !== undefined) {
    if (!/(?<![\w$.])jugarTic\s*\(\s*reloj\s*,\s*mundo\s*,/.test(tic)) {
      problemas.push('el onUpdate( no le pasa a jugarTic(reloj, mundo, …) el mundo que cambia el toque: después de Seguí se juega otro');
    }
    if (/(?<![\w$.])(const|let|var)\s+mundo(?![\w$])/.test(tic)) problemas.push('el onUpdate( declara su propio mundo: tapa al que cambia el toque');
  }
  const onDraw = codigo.search(/(?<![\w$])onDraw\s*\(/);
  const cuadro = onDraw < 0 ? undefined : cuerpoDesde(codigo, onDraw);
  if (cuadro === undefined) problemas.push('la isla no tiene onDraw(: no dibuja nada');
  else {
    if (!/(?<![\w$.])dibujar\s*\(\s*k\s*,\s*mundo\s*,/.test(cuadro)) {
      problemas.push('el onDraw( no le pasa a dibujar(k, mundo, …) el mundo que cambia el toque: después de Seguí se ve el nivel viejo');
    }
    if (/(?<![\w$.])(const|let|var)\s+mundo(?![\w$])/.test(cuadro)) problemas.push('el onDraw( declara su propio mundo: tapa al que cambia el toque');
  }
  const firma = /function\s+dibujar\s*\(\s*k\b[^,]*,\s*mundo\s*:[^)]*\)[^{]*\{/.exec(codigo);
  const cuerpo = firma === null ? undefined : cuerpoDesdeLlave(codigo, firma.index + firma[0].length - 1);
  if (cuerpo === undefined) problemas.push('la isla no tiene function dibujar(k, mundo: …): este auditor no está mirando cómo dibuja');
  else {
    if (!/(?<![\w$.])trazosDe\s*\(\s*mundo\s*,/.test(cuerpo)) {
      problemas.push('dibujar() no le pasa el mundo tal cual a trazosDe(mundo, …): lo que se abre al ganar lo decide la escena, no la isla');
    }
    if (/(?<![\w$.])mundo\s*=(?!=)|(?<![\w$.])(const|let|var)\s+mundo(?![\w$])/.test(cuerpo)) {
      problemas.push('dibujar() cambia o tapa el mundo antes de dibujarlo');
    }
  }

  // Leer la dirección está bien (`?nivel=` en desarrollo); lo que no, es navegar.
  if (/\blocation\s*\.\s*(assign|replace|reload)\s*\(|\blocation(\s*\.\s*(href|search|hash|pathname))?\s*=(?!=)/.test(codigo)) {
    problemas.push('seguir recarga la página: el nivel nuevo se arma ahí mismo, con alTocarSeguir( (D-32 límite 3)');
  }
  return problemas;
}

test('la isla de verdad sigue al próximo nivel con el botón del recorte (UX-32 §5)', () => {
  assert.deepEqual(problemasDelSeguir(readFileSync(ISLA, 'utf-8'), readFileSync(PAGINA, 'utf-8')), []);
});

const TIC_SANO = '    atender(jugarTic(reloj, mundo, ambos, k.dt()), deFrente);\n    mostrarSeguir(seguir, mundo, banco.niveles);\n';
const DIBUJO_SANO = '  for (const t of trazosDe(mundo, deFrente)) {';
const ISLA_SANA = `
  function dibujar(k: KAPLAYCtx, mundo: Mundo, atlas: Readonly<Record<Pieza, Atlas>>, deFrente: ReadonlySet<IdPersonaje>): void {
${DIBUJO_SANO}
      k.drawSprite({ sprite: atlas[t.pieza].sprite, frame: cuadroDelAtlas(atlas[t.pieza].json, t.estado, mundo.tiempo) });
    }
  }
  const seguir = document.querySelector<HTMLButtonElement>('#seguir-juego');
  let mundo = crearMundo(banco, nivel);
  const deFrente = new Set<IdPersonaje>();
  seguir?.addEventListener('click', () => {
    const nuevo = alTocarSeguir(mundo, banco.niveles, deFrente);
    if (nuevo === undefined) return;
    mundo = nuevo;
    soltarTodas();
    mostrarSeguir(seguir, mundo, banco.niveles);
  });
  k.onUpdate(() => {
    const ambos = { skayboy: QUIETO, poligirl: QUIETO };
${TIC_SANO}  });
  k.onDraw(() => {
    dibujar(k, mundo, atlas, deFrente);
    deFrente.clear();
  });
`;
const PAGINA_SANA =
  '<div class="recorte"><canvas id="juego"></canvas>' +
  '<button type="button" id="seguir-juego" class="seguir-juego" hidden aria-label={PANTALLA.seguir}></button></div>';

test('control: la isla y la página de referencia están sanas', () => {
  assert.deepEqual(problemasDelSeguir(ISLA_SANA, PAGINA_SANA), []);
  // Un comentario que cita lo prohibido no cuenta.
  assert.deepEqual(problemasDelSeguir(ISLA_SANA + '\n// nunca location.reload() ni seguir.hidden = false acá', PAGINA_SANA), []);
  // Leer la dirección no es navegar: la isla lee `?nivel=` en desarrollo.
  const leeLaDireccion = ISLA_SANA + "\nconst pedido = new URLSearchParams(location.search).get('nivel');";
  assert.deepEqual(problemasDelSeguir(leeLaDireccion, PAGINA_SANA), []);
  // Preguntar si está escondido no es esconderlo.
  const pregunta = ISLA_SANA.replace('    soltarTodas();', '    if (seguir.hidden === false) soltarTodas();');
  assert.deepEqual(problemasDelSeguir(pregunta, PAGINA_SANA), []);
});

const TOQUE_SANO = '    const nuevo = alTocarSeguir(mundo, banco.niveles, deFrente);\n    if (nuevo === undefined) return;\n    mundo = nuevo;';

for (const [caso, isla, pagina, espera] of [
  ['🔴 sin el botón', ISLA_SANA, '<div class="recorte"></div>', 'no tiene el botón'],
  ['🔴 el botón visible desde el arranque', ISLA_SANA, PAGINA_SANA.replace(' hidden', ''), 'no nace escondido'],
  ['🔴 el botón afuera del recorte', ISLA_SANA, PAGINA_SANA.replace('</canvas>', '</canvas></div><div>'), 'adentro del recorte'],
  ['🔴 el botón con otra etiqueta', ISLA_SANA, PAGINA_SANA.replace('{PANTALLA.seguir}', '"Seguir"'), 'PANTALLA.seguir'],
  ['🔴 la isla no busca el botón', ISLA_SANA.replace("'#seguir-juego'", "'#otro'"), PAGINA_SANA, 'no busca #seguir-juego'],
  // M3 de la verificación: al ganar, el botón no aparece nunca.
  [
    '🔴 el tic no muestra el botón',
    ISLA_SANA.replace(TIC_SANO, '    atender(jugarTic(reloj, mundo, ambos, k.dt()), deFrente);\n'),
    PAGINA_SANA,
    'no llama a mostrarSeguir(',
  ],
  [
    '🔴 el tic muestra el botón antes de jugar',
    ISLA_SANA.replace(TIC_SANO, '    mostrarSeguir(seguir, mundo, banco.niveles);\n    atender(jugarTic(reloj, mundo, ambos, k.dt()), deFrente);\n'),
    PAGINA_SANA,
    'un tic tarde',
  ],
  // M5 y M13 de la verificación, escritos en la isla: el botón siempre escondido, o siempre a la vista.
  ['🔴 la isla lo esconde siempre', ISLA_SANA.replace(TIC_SANO, `${TIC_SANO}    seguir!.hidden = true;\n`), PAGINA_SANA, 'por su cuenta'],
  ['🔴 la isla lo muestra desde el arranque', ISLA_SANA + "\nseguir?.removeAttribute('hidden');", PAGINA_SANA, 'por su cuenta'],
  // M4: el toque vuelve a armar el mismo nivel.
  ['🔴 el toque rearma el mismo nivel', ISLA_SANA.replace('    mundo = nuevo;', '    mundo = crearMundo(banco, nivel);'), PAGINA_SANA, 'se sigue jugando el viejo'],
  ['🔴 el toque arma otro mundo además', ISLA_SANA.replace('    mundo = nuevo;', '    mundo = nuevo;\n    mundo = crearMundo(banco, nivel);'), PAGINA_SANA, 'por su cuenta: lo arma alTocarSeguir('],
  // M14: el toque no mira si se ganó; decide solo a dónde ir.
  [
    '🔴 el toque decide solo a dónde sigue',
    ISLA_SANA.replace(TOQUE_SANO, '    mundo = crearMundo(banco, banco.niveles[1]!);'),
    PAGINA_SANA,
    'no le pide el mundo nuevo a alTocarSeguir(',
  ],
  // M6: el toque no olvida quién iba de frente, o no suelta las teclas.
  [
    '🔴 el toque le pasa otro deFrente',
    ISLA_SANA.replace('alTocarSeguir(mundo, banco.niveles, deFrente)', 'alTocarSeguir(mundo, banco.niveles, new Set())'),
    PAGINA_SANA,
    'no le pide el mundo nuevo a alTocarSeguir(',
  ],
  ['🔴 el toque no suelta las teclas', ISLA_SANA.replace('    soltarTodas();\n', ''), PAGINA_SANA, 'no suelta las teclas'],
  [
    '🔴 seguir recarga la página',
    ISLA_SANA.replace('    mundo = nuevo;', "    location.search = '?nivel=' + nuevo.nivel.id;"),
    PAGINA_SANA,
    'recarga la página',
  ],
  ['🔴 seguir con location.reload()', ISLA_SANA.replace('    mundo = nuevo;', '    location.reload();'), PAGINA_SANA, 'recarga la página'],
  ['🔴 nadie escucha el toque', ISLA_SANA.replace("addEventListener('click'", "addEventListener('keydown'"), PAGINA_SANA, 'no escucha el toque'],
  ['sin onUpdate(', ISLA_SANA.replace('k.onUpdate(', 'k.onDraw('), PAGINA_SANA, 'no tiene onUpdate('],
  // Ma, Mb y Mc de la verificación de T-290: el mundo que se dibuja y se juega es el que cambia el toque.
  [
    '🔴 el onDraw dibuja un mundo tomado al arrancar',
    ISLA_SANA.replace('  let mundo = crearMundo(banco, nivel);', '  let mundo = crearMundo(banco, nivel);\n  const mundoDibujo = mundo;').replace(
      'dibujar(k, mundo, atlas, deFrente);',
      'dibujar(k, mundoDibujo, atlas, deFrente);',
    ),
    PAGINA_SANA,
    'se ve el nivel viejo',
  ],
  [
    '🔴 el onUpdate juega un mundo tomado al arrancar',
    ISLA_SANA.replace('  let mundo = crearMundo(banco, nivel);', '  let mundo = crearMundo(banco, nivel);\n  const mundoJuego = mundo;').replace(
      'jugarTic(reloj, mundo, ambos',
      'jugarTic(reloj, mundoJuego, ambos',
    ),
    PAGINA_SANA,
    'se juega otro',
  ],
  [
    '🔴 dibujar() le borra el terminado a la escena',
    ISLA_SANA.replace(DIBUJO_SANO, '  for (const t of trazosDe({ ...mundo, terminado: false }, deFrente)) {'),
    PAGINA_SANA,
    'no le pasa el mundo tal cual',
  ],
  [
    '🔴 el onDraw tapa el mundo con uno propio',
    ISLA_SANA.replace('    dibujar(k, mundo, atlas, deFrente);', '    const mundo = crearMundo(banco, nivel);\n    dibujar(k, mundo, atlas, deFrente);'),
    PAGINA_SANA,
    'declara su propio mundo',
  ],
  ['🔴 el mundo no es let', ISLA_SANA.replace('  let mundo = crearMundo', '  const mundo = crearMundo'), PAGINA_SANA, 'no declara «let mundo»'],
  ['🔴 sin onDraw(', ISLA_SANA.replace('k.onDraw(', 'k.onRender('), PAGINA_SANA, 'no tiene onDraw('],
] as const) {
  test(`el auditor del seguir sabe encontrar: ${caso}`, () => {
    assert.notEqual(isla + pagina, ISLA_SANA + PAGINA_SANA, 'el reemplazo del caso no encontró su texto: el caso no está probando nada');
    const problemas = problemasDelSeguir(isla, pagina);
    assert.ok(problemas.some((p) => p.includes(espera)), `tenía que caer por «${espera}» y dijo:\n${problemas.join('\n') || '(nada)'}`);
  });
}
