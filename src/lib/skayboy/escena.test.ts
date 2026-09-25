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
 *    termina, las dos puertas se dibujan abiertas —las dos en el mismo cuadro— y los dos muñecos
 *    bailan; desde ese cuadro hay un nivel al que seguir, el que sigue en lo sembrado; y la isla
 *    lo sigue con un botón adentro del recorte, sin recargar la página.
 * 6. **La victoria bailada y la fila** (`UX-33 §2`, `CTR-15.7`, `CTR-16.11`, `T-302`): el baile
 *    cuenta desde que se ganó y no se mueve de la celda; con movimiento reducido, cuadro 0; el
 *    avance se guarda en el tic en que se gana; al entrar se juega el primero de la fila que falta;
 *    y el contador de lo que juntó cada uno aparece solo en la victoria. Lo que decide está jugado
 *    en Node, y al final, que la isla lo llame donde tiene que.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { GRILLA } from '../pixel/fuente.ts';
import type { JsonDelAtlas } from '../pixel/fuente.ts';
import {
  AL_GANAR,
  ATLAS_DE_LA_SALA,
  CELDA_DE_PERSONAJE,
  ESTADOS_DE_PERSONAJE,
  ESTADOS_QUE_PIDE,
  PIEZAS,
  alTocarSeguir,
  ETIQUETA_DEL_CONTADOR,
  PROPIEDADES_DEL_CONTADOR,
  atlasDe,
  avisoDelSuceso,
  celdaDelCuerpo,
  contadorDeLaVictoria,
  crearVictoria,
  cuadroDelAtlas,
  esElUltimo,
  estadoDelCuerpo,
  grillaDelAtlas,
  marcarVictoria,
  mostrarContador,
  mostrarSeguir,
  nivelAJugar,
  pidioMenosMovimiento,
  relojDelTrazo,
  seCruzan,
  ubicarEtiquetas,
  textoDelContador,
  problemasDelAtlas,
  problemasDelCuadro,
  problemasDelNombre,
  rutaDe,
  seguirVisible,
  siguienteAlGanar,
  tileDe,
  trazosDe,
  type Caja,
  type CapaDelContador,
  type EtiquetaDelContador,
  type NodoDelContador,
  type Pieza,
  type Trazo,
} from './escena.ts';
import { SIN_AVANCE, leerAvance } from './avance.ts';
import { COLECCIONABLE, PANTALLA } from './copy.ts';
import { CUADRO_SEG, CUERPO_ALTO, CUERPO_ANCHO, TILE, crearMundo, juntadosPorPersonaje, paso, type Cuerpo, type Mundo } from './mundo.ts';
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

/**
 * **Guitarras y cigarrillos** (`D-47`, `CTR-16.4` versión 3): un tile por dueño, `tesoroSkayboy` y
 * `tesoroPoligirl`, elegido por el `para` de la leyenda y no por el caracter. Los dibuja `T-300` en
 * la sala nueva: mientras `public/sprites/` no los traiga, el caso de arriba *"el JSON de cada atlas
 * es el que la escena espera"* da rojo nombrando los dos estados que faltan (y el `tesoro` viejo que
 * sobra). Ese rojo es el aviso, y es a propósito: una escena que pide un tile que el atlas no tiene
 * no arranca (`problemasDelAtlas()`).
 */
test('🔴 D-47: la guitarra se dibuja con el tile de Skayboy y el cigarrillo con el de Poligirl', () => {
  const nivel = BANCO.niveles[0]!;
  const mundo = crearMundo(BANCO, nivel);
  const dueno = (columna: number) => BANCO.leyenda[nivel.grilla[7]![columna]!]?.para?.[0];
  assert.deepEqual([dueno(3), dueno(11)], ['skayboy', 'poligirl'], 'control: el nivel 1 trae la guitarra en la 3 y el cigarrillo en la 11');
  assert.deepEqual(en(trazosDe(mundo), 3, 7), ['tesoroSkayboy']);
  assert.deepEqual(en(trazosDe(mundo), 11, 7), ['tesoroPoligirl']);
  // Por el dueño y no por el caracter: el mismo caracter, con la leyenda dada vuelta, cambia de tile.
  const alReves: Banco = {
    ...BANCO,
    leyenda: Object.fromEntries(
      Object.entries(BANCO.leyenda).map(([c, t]) =>
        t.tipo === 'tesoro' ? [c, { ...t, para: [t.para?.[0] === 'skayboy' ? 'poligirl' : 'skayboy'] as const }] : [c, t],
      ),
    ),
  };
  const volteado = crearMundo(alReves, alReves.niveles[0]!);
  assert.deepEqual([en(trazosDe(volteado), 3, 7), en(trazosDe(volteado), 11, 7)], [['tesoroPoligirl'], ['tesoroSkayboy']]);
  assert.equal(tileDe(mundo, { tipo: 'tesoro' }, 0, 0), null, 'un tesoro sin dueño no se dibuja: no es de nadie');
});

test('🔴 el tesoro juntado deja de dibujarse, y solo ese: el del otro sigue', () => {
  const mundo = crearMundo(BANCO, BANCO.niveles[0]!);
  mundo.juntados.add('3,7');
  assert.deepEqual(en(trazosDe(mundo), 3, 7), [], 'la guitarra juntada es aire');
  assert.deepEqual(en(trazosDe(mundo), 11, 7), ['tesoroPoligirl'], 'el cigarrillo sigue ahí');
  mundo.juntados.add('11,7');
  assert.deepEqual(en(trazosDe(mundo), 11, 7), []);
  // Y jugando: Skayboy va a su puerta por arriba de su guitarra, que desaparece en el cuadro en que la toca.
  const jugado = crearMundo(BANCO, BANCO.niveles[0]!);
  for (let i = 0; i < 30; i++) paso(jugado, { skayboy: { izquierda: true, derecha: false, saltar: false }, poligirl: { izquierda: false, derecha: false, saltar: false } }, CUADRO_SEG);
  assert.ok(jugado.juntados.has('3,7'), 'control: la juntó');
  assert.deepEqual(en(trazosDe(jugado), 3, 7), []);
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

test('🔴 qué nivel se juega sin avance: el primero, o el que se pide por id si está sembrado', () => {
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

test('🔴 ganado, los dos bailan aunque el último tenga el dedo encima (UX-33 §2.1, que enmienda UX-32 §3)', () => {
  const mundo = crearMundo(BANCO, BANCO.niveles[0]!);
  Object.assign(mundo.cuerpos.poligirl, { conDedo: true, vx: 88, mira: -1 });
  Object.assign(mundo.cuerpos.skayboy, { conDedo: true, vx: 0, mira: 1 });
  const munecos = () => trazosDe(mundo).filter((t) => t.pieza !== 'sala').map((t) => [t.pieza, t.estado, t.espejo]);
  assert.deepEqual(munecos(), [['skayboy', 'quieto', false], ['poligirl', 'corre', true]], 'en juego, de perfil');
  mundo.terminado = true;
  assert.deepEqual(
    munecos(),
    [['skayboy', 'baila', false], ['poligirl', 'baila', false]],
    'ganado: los dos en baila, sin espejo, ninguno a mitad de un salto ni mirando al otro',
  );
  // Y con el cuadro de frente pedido para los dos, igual: la victoria le gana a la vuelta.
  assert.deepEqual(
    trazosDe(mundo, new Set<IdPersonaje>(['skayboy', 'poligirl'])).filter((t) => t.pieza !== 'sala').map((t) => t.estado),
    ['baila', 'baila'],
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
  // En el último, el primero de la fila: la pieza de `BR-27` no existe todavía, y un sexto sin
  // toque es un callejón (la verificación de `T-302`). Nunca un séptimo.
  const ultimo = crearMundo(BANCO, BANCO.niveles.at(-1)!);
  ultimo.terminado = true;
  assert.equal(siguienteAlGanar(ultimo, BANCO.niveles), primero);
  assert.equal(esElUltimo(ultimo, BANCO.niveles), true);
  assert.equal(esElUltimo(mundo, BANCO.niveles), false);
  assert.equal(esElUltimo(mundo, []), false, 'sin nada sembrado no hay último');
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
  // En el último también: el mismo toque desde el primer cuadro de la victoria (`UX-33 §2.3`, §2.4).
  const ultimo = crearMundo(BANCO, BANCO.niveles.at(-1)!);
  ultimo.terminado = true;
  const otro = { hidden: true };
  mostrarSeguir(otro, ultimo, BANCO.niveles);
  assert.equal(otro.hidden, false, 'en el último nivel el botón aparece igual: si no, el sexto es un callejón');
  assert.equal(seguirVisible(ultimo, BANCO.niveles), true);
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
  // En el último, el primero de la fila, en cero, y sin nadie de frente.
  const ultimo = crearMundo(BANCO, BANCO.niveles.at(-1)!);
  ultimo.terminado = true;
  const quedan = new Set<IdPersonaje>(['poligirl']);
  assert.deepEqual(alTocarSeguir(ultimo, BANCO.niveles, quedan), crearMundo(BANCO, primero));
  assert.equal(quedan.size, 0);
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

/* =========================================================================================
   6. La victoria bailada y la fila (`UX-33 §2`, `CTR-15.7`, `CTR-16.11`, `T-302`)
   ========================================================================================= */

/** El mundo del nivel, jugado con su traza grabada hasta el cuadro en que gana. */
function ganado(nivel: Nivel): { mundo: Mundo; cuadros: number } {
  const { traza, problemas } = leerTraza(nivel.id, SOLUCIONES.soluciones[nivel.id]!.deUno);
  assert.ok(traza, problemas.join('\n'));
  const mundo = crearMundo(BANCO, nivel);
  let cuadros = 0;
  for (const m of expandir(traza)) {
    paso(mundo, m, CUADRO_SEG);
    cuadros++;
  }
  assert.ok(mundo.terminado, `la traza grabada de ${nivel.id} ya no gana: la regraba scripts/resolver-niveles.mjs`);
  return { mundo, cuadros };
}

const munecos = (trazos: readonly Trazo[]) => trazos.filter((t) => t.pieza !== 'sala');

test('baila es el sexto estado de los dos, y el atlas publicado lo trae en 4 cuadros a 8 por segundo, en bucle (CTR-15.7, UX-33 §2.2)', () => {
  assert.deepEqual([...ESTADOS_DE_PERSONAJE], ['quieto', 'corre', 'salta', 'cae', 'enPausa', 'baila']);
  assert.equal(AL_GANAR.estado, 'baila');
  assert.equal(AL_GANAR.espejo, false);
  for (const pieza of ['skayboy', 'poligirl'] as const) {
    assert.ok(ESTADOS_QUE_PIDE[pieza].includes('baila'), `la escena no le pide baila a ${pieza}`);
    assert.deepEqual(jsonPublicado(pieza).animaciones.baila, { fila: 5, cuadros: 4, porSegundo: 8, repite: true }, pieza);
  }
  // Un atlas v1, sin la fila del baile, ya no arranca: por eso el banco apunta a los v2.
  const v1 = JSON.parse(readFileSync('public/sprites/skayboy.v1.json', 'utf-8')) as JsonDelAtlas;
  assert.ok(problemasDelAtlas('skayboy', v1).some((p) => p.includes('«baila»')));
});

test('🔴 el reloj del baile: marca la victoria en un solo tic, el del cuadro en que se gana, y ni uno antes', () => {
  const nivel = BANCO.niveles[0]!;
  const { traza } = leerTraza(nivel.id, SOLUCIONES.soluciones[nivel.id]!.deUno);
  const mundo = crearMundo(BANCO, nivel);
  const victoria = crearVictoria();
  const marcas: number[] = [];
  let cuadro = 0;
  for (const m of expandir(traza!)) {
    paso(mundo, m, CUADRO_SEG);
    cuadro++;
    if (marcarVictoria(victoria, mundo, 100 + cuadro * CUADRO_SEG)) marcas.push(cuadro);
    assert.equal(victoria.ganadoEn === null, !mundo.terminado, `cuadro ${cuadro}: la victoria se anota si y solo si se ganó`);
  }
  // Después de ganar la isla sigue llamando, tic a tic: la marca no se repite.
  for (let i = 1; i <= 120; i++) if (marcarVictoria(victoria, mundo, 100 + (cuadro + i) * CUADRO_SEG)) marcas.push(cuadro + i);
  assert.deepEqual(marcas, [cuadro], 'una sola marca, en el cuadro que gana');
  assert.ok(Math.abs(victoria.ganadoEn! - (100 + cuadro * CUADRO_SEG)) < 1e-9);
  // Con el mundo del nivel que sigue, la suelta: el baile del próximo arranca en su cuadro 0.
  const siguiente = alTocarSeguir(mundo, BANCO.niveles, new Set())!;
  assert.equal(marcarVictoria(victoria, siguiente, 200), false);
  assert.equal(victoria.ganadoEn, null);
});

test('🔴 el cuadro del baile cuenta desde que se ganó, con el reloj del motor, y no con el de la partida, que se congela', () => {
  const { mundo } = ganado(BANCO.niveles[0]!);
  const json = jsonPublicado('skayboy');
  const { columnas } = grillaDelAtlas(json);
  const victoria = crearVictoria();
  const congelado = mundo.tiempo;
  // Se gana en un instante que no cae en un múltiplo de 1/8 s, ni de medio segundo: si el baile
  // contara con el reloj absoluto del motor en vez de «desde que se ganó», no arrancaría en el 0
  // (la verificación de `T-302`: ganando en 50, 50 × 8 = 400, y el reloj absoluto pasaba igual).
  const ganoEn = 50.3;
  marcarVictoria(victoria, mundo, ganoEn);
  const [skay] = munecos(trazosDe(mundo));
  const cuadros: number[] = [];
  for (const desde of [0, 0.125, 0.25, 0.375, 0.5, 0.625]) {
    const ahora = ganoEn + desde + 1e-9;
    marcarVictoria(victoria, mundo, ahora);
    cuadros.push(cuadroDelAtlas(json, skay!.estado, relojDelTrazo(skay!, mundo, victoria, false)) - 5 * columnas);
  }
  assert.deepEqual(cuadros, [0, 1, 2, 3, 0, 1], 'cuatro cuadros a ocho por segundo, en bucle, arrancando en el 0');
  assert.equal(mundo.tiempo, congelado, 'el reloj de la partida no se tocó');
  // La sala sigue con el reloj de la partida, congelado: nada más se mueve (`UX-32 §4`).
  for (const t of deLaSala(trazosDe(mundo))) assert.equal(relojDelTrazo(t, mundo, victoria, false), mundo.tiempo);
  // Sin victoria anotada todavía, el baile arranca en cero, no en un cuadro cualquiera.
  assert.equal(relojDelTrazo(skay!, mundo, crearVictoria(), false), 0);
});

test('🔴 con movimiento reducido, el baile queda en el cuadro 0, fijo (CTR-15.7, ADR-08.8)', () => {
  const { mundo } = ganado(BANCO.niveles[0]!);
  const victoria = crearVictoria();
  marcarVictoria(victoria, mundo, 10);
  for (const pieza of ['skayboy', 'poligirl'] as const) {
    const json = jsonPublicado(pieza);
    const t = munecos(trazosDe(mundo)).find((q) => q.pieza === pieza)!;
    for (const ahora of [10, 10.13, 10.3, 11, 17.4]) {
      marcarVictoria(victoria, mundo, ahora);
      assert.equal(relojDelTrazo(t, mundo, victoria, true), 0);
      assert.equal(cuadroDelAtlas(json, t.estado, relojDelTrazo(t, mundo, victoria, true)), 5 * grillaDelAtlas(json).columnas);
    }
  }
});

test('🔴 ganado, los dos bailan en su celda: el baile no los mueve, ni el dedo después de ganar (UX-33 §2.2 punto 3)', () => {
  const { mundo } = ganado(BANCO.niveles[0]!);
  const antes = munecos(trazosDe(mundo));
  assert.deepEqual(antes.map((t) => [t.pieza, t.estado, t.espejo]), [['skayboy', 'baila', false], ['poligirl', 'baila', false]]);
  for (const t of antes) {
    const c = mundo.cuerpos[t.pieza as IdPersonaje];
    assert.deepEqual({ x: t.x, y: t.y }, celdaDelCuerpo(c), `${t.pieza}: el baile se dibuja en su celda`);
  }
  // Un segundo entero con los dos apretando todo: nadie se corre de lugar.
  const todo = { izquierda: true, derecha: true, saltar: true };
  for (let i = 0; i < 60; i++) paso(mundo, { skayboy: todo, poligirl: todo }, CUADRO_SEG);
  assert.deepEqual(munecos(trazosDe(mundo)), antes);
});

test('🔴 al entrar se juega el primero de la fila que falta; el pedido de desarrollo le gana al avance (CTR-16.11.2)', () => {
  const niveles = BANCO.niveles;
  const id = (a: string) => nivelAJugar(niveles, null, leerAvance(a))?.id;
  assert.equal(nivelAJugar(niveles, null, SIN_AVANCE)?.id, 'NIV-01');
  assert.equal(id('{"pasados":["NIV-01","NIV-02"]}'), 'NIV-03');
  assert.equal(id('{"pasados":["NIV-01","NIV-03"]}'), 'NIV-02', 'con un hueco, el hueco');
  assert.equal(id('basura'), 'NIV-01', 'un avance roto es sin avance');
  // El pedido gana, aunque sea un nivel ya pasado o uno salteado.
  assert.equal(nivelAJugar(niveles, 'NIV-01', leerAvance('{"pasados":["NIV-01"]}'))?.id, 'NIV-01');
  assert.equal(nivelAJugar(niveles, 'niv-05', SIN_AVANCE)?.id, 'NIV-05');
  // Un pedido que no está sembrado no es un pedido: manda el avance.
  assert.equal(nivelAJugar(niveles, 'NIV-99', leerAvance('{"pasados":["NIV-01"]}'))?.id, 'NIV-02');
  // Con los seis pasados, el primero otra vez: la fila vuelve a empezar.
  assert.equal(id(JSON.stringify({ pasados: niveles.map((n) => n.id) })), 'NIV-01');
  // En producción la fila son los listos: si NIV-02 no está sembrado, después de NIV-01 va NIV-03.
  const listos = niveles.filter((n) => n.id !== 'NIV-02');
  assert.equal(nivelAJugar(listos, null, leerAvance('{"pasados":["NIV-01"]}'))?.id, 'NIV-03');
});

test('🔴 lo que lee el lector de pantalla con cada suceso: el lugar, el objeto o el hecho, nunca la persona (CNT-22)', () => {
  for (const ultimo of [false, true]) {
    assert.equal(avisoDelSuceso({ tipo: 'vuelta', quien: 'skayboy' }, ultimo), PANTALLA.avisoEntrada);
    assert.equal(avisoDelSuceso({ tipo: 'tesoro', quien: 'skayboy' }, ultimo), COLECCIONABLE.avisoGuitarra);
    assert.equal(avisoDelSuceso({ tipo: 'tesoro', quien: 'poligirl' }, ultimo), COLECCIONABLE.avisoCigarrillo);
    assert.equal(avisoDelSuceso({ tipo: 'salto', quien: 'poligirl' }, ultimo), null);
    assert.equal(avisoDelSuceso({ tipo: 'compuerta', id: 'COM-01', abierta: true, por: 'skayboy' }, ultimo), null);
  }
  assert.equal(avisoDelSuceso({ tipo: 'puerta' }, false), PANTALLA.avisoVictoria);
  assert.equal(PANTALLA.avisoVictoria, 'Las dos puertas, abiertas.', 'la de CNT-22 §2, sin tocar una letra');
});

test('🔴 al ganar el sexto, el lector oye además que era el último, y nada de compartir (CNT-22 §3, T-302)', () => {
  assert.equal(avisoDelSuceso({ tipo: 'puerta' }, true), 'Las dos puertas, abiertas. Último nivel.');
  // Es la primera oración de la línea de `contenido`, tal cual: la segunda promete una pieza que no hay.
  assert.ok(PANTALLA.avisoUltimoNivel.startsWith(`${PANTALLA.avisoUltimo} `), 'avisoUltimo es el comienzo de CNT-22 §3');
  assert.doesNotMatch(avisoDelSuceso({ tipo: 'puerta' }, true)!, /compart/i);
});

test('🔴 el texto del contador: el número y la palabra de su objeto, en singular solo con uno (CNT-22 §4)', () => {
  assert.equal(textoDelContador('skayboy', 1), '1 guitarra');
  assert.equal(textoDelContador('skayboy', 2), '2 guitarras');
  assert.equal(textoDelContador('skayboy', 0), '0 guitarras');
  assert.equal(textoDelContador('poligirl', 1), '1 cigarrillo');
  assert.equal(textoDelContador('poligirl', 3), '3 cigarrillos');
});

/** Un nodo de mentira que anota cada escritura. Lo único que `mostrarContador()` le toca. */
function nodo(): NodoDelContador & { escrituras: number; propiedades: Record<string, string> } {
  const n = {
    escrituras: 0,
    _hidden: true,
    _texto: '' as string | null,
    get hidden() {
      return n._hidden;
    },
    set hidden(v: boolean) {
      n.escrituras++;
      n._hidden = v;
    },
    get textContent() {
      return n._texto;
    },
    set textContent(v: string | null) {
      n.escrituras++;
      n._texto = v;
    },
    propiedades: {} as Record<string, string>,
    style: {
      setProperty(nombre: string, valor: string) {
        n.escrituras++;
        n.propiedades[nombre] = valor;
      },
    },
    dataset: {} as Record<string, string | undefined>,
  };
  return n;
}

function capaDePrueba() {
  const capa = nodo();
  const etiquetas = { skayboy: nodo(), poligirl: nodo() };
  const total = () => capa.escrituras + etiquetas.skayboy.escrituras + etiquetas.poligirl.escrituras;
  return { capa: { capa, etiquetas } satisfies CapaDelContador, nodos: { capa, ...etiquetas }, total };
}

test('🔴 el contador aparece solo en la victoria: en ningún cuadro de la partida, y en el mismo en que se gana (UX-33 §2.5)', () => {
  const nivel = BANCO.niveles[0]!;
  const { traza } = leerTraza(nivel.id, SOLUCIONES.soluciones[nivel.id]!.deUno);
  const mundo = crearMundo(BANCO, nivel);
  const { capa, nodos } = capaDePrueba();
  nodos.capa.hidden = false; // Nace visible a propósito: lo que la esconde tiene que ser la escena.
  mostrarContador(capa, mundo);
  assert.equal(nodos.capa.hidden, true, 'arrancando, sin contador');
  let cuadro = 0;
  for (const m of expandir(traza!)) {
    paso(mundo, m, CUADRO_SEG);
    cuadro++;
    assert.equal(contadorDeLaVictoria(mundo) === null, !mundo.terminado, `cuadro ${cuadro}`);
    mostrarContador(capa, mundo);
    assert.equal(nodos.capa.hidden, !mundo.terminado, `cuadro ${cuadro}: el contador se ve si y solo si se ganó`);
  }
  // La traza del nivel 1 junta la guitarra y el cigarrillo (`CTR-16.4`, `T-303`).
  assert.deepEqual(juntadosPorPersonaje(mundo), { skayboy: 1, poligirl: 1 });
  assert.equal(nodos.skayboy.textContent, '1 guitarra');
  assert.equal(nodos.poligirl.textContent, '1 cigarrillo');
  assert.equal(nodos.skayboy.hidden, false);
  assert.equal(nodos.poligirl.hidden, false);
  // Con el mundo del nivel que sigue, se va.
  mostrarContador(capa, alTocarSeguir(mundo, BANCO.niveles, new Set())!);
  assert.equal(nodos.capa.hidden, true);
  assert.doesNotThrow(() => mostrarContador(null, mundo), 'sin capa en la página no tira');
});

test('🔴 cada etiqueta dice lo que juntó ese, no el otro, y nada que los compare (BR-27 punto 2)', () => {
  const nivel = BANCO.niveles.find((n) => n.id === 'NIV-03')!;
  const mundo = crearMundo(BANCO, nivel);
  // NIV-03 trae dos de cada uno: que Skayboy junte dos y Poligirl ninguno, a mano.
  const tesoros = nivel.grilla.flatMap((renglon, fila) =>
    [...renglon].map((c, columna) => ({ c, columna, fila })).filter(({ c }) => BANCO.leyenda[c]?.tipo === 'tesoro'),
  );
  for (const { c, columna, fila } of tesoros) if (BANCO.leyenda[c]!.para![0] === 'skayboy') mundo.juntados.add(`${columna},${fila}`);
  mundo.terminado = true;
  const contador = contadorDeLaVictoria(mundo)!;
  assert.equal(contador.skayboy!.texto, '2 guitarras');
  assert.equal(contador.poligirl!.texto, '0 cigarrillos');
  for (const e of [contador.skayboy!, contador.poligirl!]) {
    assert.match(e.texto, /^\d+ [a-z]+$/, `«${e.texto}»: un número y una palabra, nada más`);
  }
});

/** La caja de una etiqueta, de vuelta en píxeles nativos del área. */
function enNativos(e: EtiquetaDelContador, nivel: Nivel): Caja {
  const ancho = nivel.grilla[0]!.length * TILE;
  const alto = nivel.grilla.length * TILE;
  const px = (porcentaje: number, de: number): number => Math.round((porcentaje / 100) * de * 1e6) / 1e6;
  return { x: px(e.x, ancho), y: px(e.y, alto), ancho: px(e.ancho, ancho), alto: px(e.alto, alto) };
}

/**
 * Lo que tiene que cumplir un par de etiquetas, en nativos (`UX-33 §2.5`): cada una adentro del área,
 * sobre la columna de su muñeco, pegada arriba o abajo de él (a lo sumo un renglón de etiqueta más
 * allá) —o, si no queda otra, al costado de la cabeza—, sin tapar al otro muñeco, y las dos sin
 * cruzarse, con aire. Vacío es sano.
 */
function problemasDeLasEtiquetas(
  cajas: Readonly<Record<IdPersonaje, Caja | null>>,
  celdas: Readonly<Record<IdPersonaje, { x: number; y: number }>>,
  area: { ancho: number; alto: number },
): string[] {
  const problemas: string[] = [];
  const cerca = 2 * ETIQUETA_DEL_CONTADOR.alto + ETIQUETA_DEL_CONTADOR.aire + 1e-6;
  const celda = (id: IdPersonaje): Caja => ({ ...celdas[id], ...CELDA_DE_PERSONAJE });
  for (const id of ['skayboy', 'poligirl'] as const) {
    const c = cajas[id];
    if (c === null) continue;
    const otro = id === 'skayboy' ? 'poligirl' : 'skayboy';
    const propia = celda(id);
    if (c.x < -1e-6 || c.y < -1e-6 || c.x + c.ancho > area.ancho + 1e-6 || c.y + c.alto > area.alto + 1e-6) problemas.push(`${id}: se sale del área`);
    const aire = ETIQUETA_DEL_CONTADOR.aire;
    const alCostado =
      Math.abs(c.y - propia.y) < 1e-6 &&
      (Math.abs(c.x - (propia.x + propia.ancho + aire)) < 1e-6 || Math.abs(c.x + c.ancho - (propia.x - aire)) < 1e-6);
    if (!alCostado) {
      if (c.x > propia.x + 1e-6 || c.x + c.ancho < propia.x + propia.ancho - 1e-6) problemas.push(`${id}: no está sobre la columna de su muñeco`);
      const arriba = propia.y - (c.y + c.alto);
      const abajo = c.y - (propia.y + propia.alto);
      if (!((arriba >= -1e-6 && arriba < cerca - ETIQUETA_DEL_CONTADOR.alto) || (abajo >= -1e-6 && abajo < cerca - ETIQUETA_DEL_CONTADOR.alto))) {
        problemas.push(`${id}: no está pegada arriba ni abajo de su muñeco`);
      }
    }
    if (seCruzan(c, celda(otro))) problemas.push(`${id}: su etiqueta tapa a ${otro}, y se lee como de ${otro}`);
  }
  if (cajas.skayboy && cajas.poligirl && seCruzan(cajas.skayboy, cajas.poligirl, ETIQUETA_DEL_CONTADOR.aire)) {
    problemas.push(`las dos etiquetas se cruzan: ${JSON.stringify(cajas.skayboy)} y ${JSON.stringify(cajas.poligirl)}`);
  }
  return problemas;
}

test('🔴 en los seis niveles, ganados con sus trazas grabadas, las dos etiquetas no se cruzan ni tapan al otro (UX-33 §2.5, T-302)', () => {
  // La verificación de `T-302` encontró que a ×1 se pisaban en NIV-03, NIV-05 y NIV-06: las dos
  // crecían hacia el centro sin mirar a la otra. Acá se juega cada traza grabada hasta ganar.
  const vistos: string[] = [];
  const problemas: string[] = [];
  for (const nivel of BANCO.niveles) {
    for (const [cual, solucion] of Object.entries(SOLUCIONES.soluciones[nivel.id] ?? {})) {
      const { traza, problemas: deLaTraza } = leerTraza(nivel.id, solucion);
      assert.ok(traza, `${nivel.id} ${cual}: ${deLaTraza.join('; ')}`);
      const mundo = crearMundo(BANCO, nivel);
      for (const m of expandir(traza)) paso(mundo, m, CUADRO_SEG);
      assert.ok(mundo.terminado, `${nivel.id} ${cual}: la traza ya no gana`);
      const contador = contadorDeLaVictoria(mundo)!;
      const cajas = {
        skayboy: contador.skayboy && enNativos(contador.skayboy, nivel),
        poligirl: contador.poligirl && enNativos(contador.poligirl, nivel),
      };
      assert.ok(cajas.skayboy && cajas.poligirl, `${nivel.id}: los seis niveles traen de los dos, y los dos cuentan`);
      const celdas = { skayboy: celdaDelCuerpo(mundo.cuerpos.skayboy), poligirl: celdaDelCuerpo(mundo.cuerpos.poligirl) };
      const area = { ancho: nivel.grilla[0]!.length * TILE, alto: nivel.grilla.length * TILE };
      for (const p of problemasDeLasEtiquetas(cajas, celdas, area)) problemas.push(`${nivel.id} ${cual}: ${p}`);
      vistos.push(nivel.id);
    }
  }
  assert.deepEqual([...new Set(vistos)], BANCO.niveles.map((n) => n.id), 'cada nivel se miró ganado');
  assert.deepEqual(problemas, []);
});

test('🔴 ubicarEtiquetas, en cualquier par de lugares donde se puede estar parado: nunca se cruzan ni tapan al otro', () => {
  // Todas las celdas apoyadas sobre un renglón de tiles, cada 8 px, en un área de 15 × 9 tiles. Dos
  // muñecos no ocupan la misma celda, así que los pares encimados no cuentan.
  const area = { ancho: 15 * TILE, alto: 9 * TILE };
  const lugares: { x: number; y: number }[] = [];
  for (let y = TILE - 8; y + CELDA_DE_PERSONAJE.alto <= area.alto; y += TILE) {
    for (let x = 0; x + CELDA_DE_PERSONAJE.ancho <= area.ancho; x += 8) lugares.push({ x, y });
  }
  const con = { skayboy: true, poligirl: true };
  let mirados = 0;
  const fallas: string[] = [];
  for (const skayboy of lugares) {
    for (const poligirl of lugares) {
      if (seCruzan({ ...skayboy, ...CELDA_DE_PERSONAJE }, { ...poligirl, ...CELDA_DE_PERSONAJE })) continue;
      const celdas = { skayboy, poligirl };
      const p = problemasDeLasEtiquetas(ubicarEtiquetas(celdas, con, area), celdas, area);
      mirados++;
      if (p.length > 0) fallas.push(`${JSON.stringify(celdas)}: ${p.join('; ')}`);
    }
  }
  assert.ok(mirados > 40000, `se miraron ${mirados} pares`);
  assert.deepEqual(fallas.slice(0, 5), [], `${fallas.length} pares fallan`);
});

test('🔴 cada etiqueta va junto a su personaje: arriba de la cabeza y hacia el centro cuando hay lugar (NIV-01)', () => {
  const nivel = BANCO.niveles[0]!;
  const { mundo } = ganado(nivel);
  const contador = contadorDeLaVictoria(mundo)!;
  const skay = celdaDelCuerpo(mundo.cuerpos.skayboy);
  const poli = celdaDelCuerpo(mundo.cuerpos.poligirl);
  const { ancho, alto } = ETIQUETA_DEL_CONTADOR;
  // Skayboy gana en la puerta de la izquierda: la suya sale de su borde izquierdo hacia la derecha.
  assert.deepEqual(enNativos(contador.skayboy!, nivel), { x: skay.x, y: skay.y - alto, ancho, alto });
  // Poligirl, en la de la derecha: la suya termina en su borde derecho.
  assert.deepEqual(enNativos(contador.poligirl!, nivel), { x: poli.x + CELDA_DE_PERSONAJE.ancho - ancho, y: poli.y - alto, ancho, alto });
});

const ETIQUETA_DEL_CONTADOR_CAJA = { ancho: ETIQUETA_DEL_CONTADOR.ancho, alto: ETIQUETA_DEL_CONTADOR.alto };

test('🔴 en la primera fila no hay lugar arriba: va abajo de los pies; y si hacia el centro se pisan, cada una crece hacia afuera', () => {
  const area = { ancho: 240, alto: 144 };
  const con = { skayboy: true, poligirl: false };
  const lejos = { x: 200, y: 104 };
  const techo = ubicarEtiquetas({ skayboy: { x: 40, y: 0 }, poligirl: lejos }, con, area);
  assert.equal(techo.skayboy!.y, CELDA_DE_PERSONAJE.alto, 'abajo de los pies');
  assert.equal(techo.poligirl, null, 'el que no lleva etiqueta no tiene caja');
  // Las puertas de NIV-03, a 85 px: hacia el centro se pisaban. Cada una crece hacia afuera, y
  // contra el borde se corre para adentro en vez de salirse.
  const juntas = ubicarEtiquetas({ skayboy: { x: 72, y: 104 }, poligirl: { x: 157, y: 104 } }, { skayboy: true, poligirl: true }, area);
  assert.deepEqual(juntas.skayboy, { x: 0, y: 88, ...ETIQUETA_DEL_CONTADOR_CAJA });
  assert.deepEqual(juntas.poligirl, { x: area.ancho - ETIQUETA_DEL_CONTADOR.ancho, y: 88, ...ETIQUETA_DEL_CONTADOR_CAJA });
});

test('🔴 la caja de la etiqueta es fija, la de ETIQUETA_DEL_CONTADOR, y no la del texto: la hoja no la estima', () => {
  const nivel = BANCO.niveles.find((n) => n.id === 'NIV-03')!;
  const { mundo } = ganado(nivel);
  const contador = contadorDeLaVictoria(mundo)!;
  for (const e of [contador.skayboy!, contador.poligirl!]) {
    assert.ok(Math.abs(e.ancho - (ETIQUETA_DEL_CONTADOR.ancho / (nivel.grilla[0]!.length * TILE)) * 100) < 1e-9);
    assert.ok(Math.abs(e.alto - (ETIQUETA_DEL_CONTADOR.alto / (nivel.grilla.length * TILE)) * 100) < 1e-9);
  }
});

test('un nivel que no le trae nada a nadie no muestra ceros: las etiquetas se esconden', () => {
  const nivel = BANCO.niveles[0]!;
  const sinNada: Nivel = { ...nivel, grilla: nivel.grilla.map((r) => [...r].map((c) => (BANCO.leyenda[c]?.tipo === 'tesoro' ? '.' : c)).join('')) };
  const mundo = crearMundo(BANCO, sinNada);
  mundo.terminado = true;
  assert.deepEqual(contadorDeLaVictoria(mundo), { skayboy: null, poligirl: null });
  const { capa, nodos } = capaDePrueba();
  nodos.skayboy.hidden = false;
  mostrarContador(capa, mundo);
  assert.equal(nodos.skayboy.hidden, true);
  assert.equal(nodos.poligirl.hidden, true);
});

test('🔴 mostrarContador escribe solo lo que cambia: el DOM no se toca sesenta veces por segundo', () => {
  const { mundo } = ganado(BANCO.niveles[0]!);
  const { capa, nodos, total } = capaDePrueba();
  mostrarContador(capa, mundo);
  const primera = total();
  assert.ok(primera > 0);
  // La caja entera, en porcentajes del área: la esquina, el ancho y el alto.
  const e = contadorDeLaVictoria(mundo)!.skayboy!;
  assert.deepEqual(
    PROPIEDADES_DEL_CONTADOR.map((nombre) => nodos.skayboy.propiedades[nombre]),
    [e.x, e.y, e.ancho, e.alto].map((v) => `${v.toFixed(3)}%`),
  );
  for (let i = 0; i < 60; i++) mostrarContador(capa, mundo);
  assert.equal(total(), primera, 'con el mismo mundo, ni una escritura más');
});

test('🔴 la victoria del sexto es la misma que la de cualquier otro, con el mismo toque, que vuelve al primero (UX-33 §2.3, §2.4)', () => {
  const sexto = BANCO.niveles.at(-1)!;
  assert.equal(sexto.id, 'NIV-06');
  const nivel = BANCO.niveles.at(-1)!;
  const { traza } = leerTraza(nivel.id, SOLUCIONES.soluciones[nivel.id]!.deUno);
  const mundo = crearMundo(BANCO, nivel);
  // El toque está desde el primer cuadro de la victoria, también en el sexto: nace escondido y en el
  // cuadro que gana aparece, igual que en los otros cinco.
  const boton = { hidden: true };
  for (const m of expandir(traza!)) {
    paso(mundo, m, CUADRO_SEG);
    mostrarSeguir(boton, mundo, BANCO.niveles);
    assert.equal(boton.hidden, !mundo.terminado, 'el sexto no es un callejón: el toque se ve si y solo si se ganó');
  }
  assert.deepEqual(munecos(trazosDe(mundo)).map((t) => t.estado), ['baila', 'baila']);
  assert.ok(contadorDeLaVictoria(mundo)?.skayboy, 'el sexto también cuenta lo que juntó cada uno');
  assert.deepEqual(puertas(trazosDe(mundo)), ['puertaAbierta', 'puertaAbierta']);
  // No hay un séptimo: el toque vuelve al primero de la fila, en cero.
  const vuelta = alTocarSeguir(mundo, BANCO.niveles, new Set());
  assert.equal(vuelta?.nivel.id, 'NIV-01');
  assert.deepEqual(vuelta, crearMundo(BANCO, BANCO.niveles[0]!));
  // Y quien no ve la pantalla oye que era el último.
  assert.equal(esElUltimo(mundo, BANCO.niveles), true);
  assert.equal(avisoDelSuceso({ tipo: 'puerta' }, esElUltimo(mundo, BANCO.niveles)), `${PANTALLA.avisoVictoria} ${PANTALLA.avisoUltimo}`);
});

/**
 * La isla, leída del fuente como en el auditor del seguir: lo que decide ya está jugado arriba, y
 * acá se mira que la isla lo llame donde tiene que. Una función probada que nadie llama no protege
 * nada (la verificación de `T-290` encontró justo eso: mutar la isla no hacía caer ningún test).
 *
 * - **La fila**: al arrancar, `nivelAJugar(banco.niveles, pedido, cargarAvance())`.
 * - **El avance se guarda en el tic en que se gana**, no al tocar Seguí (`CTR-16.11.1`): en el
 *   `onUpdate(`, después de `jugarTic(`, `if (marcarVictoria(victoria, mundo, k.time()))
 *   guardarPasado(mundo.nivel.id)`, y `guardarPasado(` en ningún otro lado. El reloj es el del motor:
 *   con `mundo.tiempo`, que se congela al ganar, el baile quedaría quieto.
 * - **La `victoria` es una sola**, un `const` de `crearVictoria()` antes del `onUpdate(`.
 * - **El contador**: `mostrarContador(contador, mundo)` después de `jugarTic(`, en cada tic; la capa
 *   `#contador-victoria` en la página, adentro del recorte, escondida, con una etiqueta por
 *   personaje; y la isla no le toca el `hidden` por su cuenta.
 * - **El baile se dibuja con su reloj**: `dibujar(k, mundo, atlas, deFrente, victoria)`, y adentro el
 *   cuadro es `cuadroDelAtlas(json, t.estado, relojDelTrazo(t, mundo, victoria, movimientoReducido()))`,
 *   con `movimientoReducido()` devolviendo **exactamente** `pidioMenosMovimiento(preferencia)`, y
 *   `preferencia` de `matchMedia('(prefers-reduced-motion: reduce)')`. La condición vive en
 *   `escena.ts`, probada; acá no se deja ni un `!` (la verificación de `T-302` dio vuelta el `===`).
 * - **Los avisos salen de `avisoDelSuceso(s, ultimo)`**, con `ultimo` de `esElUltimo(mundo,
 *   banco.niveles)` en el tic: la isla no nombra ningún texto de aviso.
 * - **La capa no le gana al toque** (la verificación de `T-302`): en la página va antes de
 *   `#seguir-juego`, que se pinta encima; la hoja la ve con `problemasDeLaHojaDelContador()`.
 */
function problemasDeLaVictoria(isla: string, pagina: string): string[] {
  const codigo = sinComentarios(isla);
  const html = sinComentarios(pagina);
  const problemas: string[] = [];

  // La página: la capa, adentro del recorte, escondida, con las dos etiquetas.
  const capa = /<p\b[^>]*\bid="contador-victoria"[^>]*>([\s\S]*?)<\/p>/.exec(html);
  if (capa === null) problemas.push('la página no tiene la capa #contador-victoria');
  else {
    const apertura = /<p\b[^>]*>/.exec(capa[0])![0];
    if (!/\shidden[\s>]/.test(apertura)) problemas.push('#contador-victoria no nace escondido: se vería durante la partida');
    const recorte = html.indexOf('class="recorte"');
    const cierre = html.indexOf('</div>', recorte);
    if (recorte < 0 || capa.index < recorte || capa.index > cierre) problemas.push('#contador-victoria no vive adentro del recorte');
    for (const id of ['skayboy', 'poligirl']) {
      if (!new RegExp(`data-de="${id}"`).test(capa[1]!)) problemas.push(`#contador-victoria no tiene la etiqueta de ${id}`);
    }
    const boton = html.search(/<button\b[^>]*\bid="seguir-juego"/);
    if (boton >= 0 && boton < capa.index) {
      problemas.push('#contador-victoria va después de #seguir-juego: se pinta encima del botón y, sin pointer-events: none, se come el toque de Seguí');
    }
  }
  if (!/querySelector<HTMLElement>\(\s*'#contador-victoria'\s*\)/.test(codigo)) problemas.push('la isla no busca #contador-victoria');
  // Cualquier cadena que arranque en la capa, el contador o una etiqueta y termine escondiendo o
  // mostrando: `capa.hidden =`, `contador.capa.hidden =`, `contador?.etiquetas['skayboy'].hidden =`,
  // `…setAttribute('hidden'`, `…style.display =`. La verificación de `T-302` se coló con la segunda.
  if (
    /(?<![\w$.])(capa|contador|etiqueta\w*)(?:\s*[?!]?\.\s*[\w$]+|\s*[?!]?\.?\s*\[[^\]]*\])*\s*[?!]?\.\s*(hidden\s*=(?!=)|(set|remove|toggle)Attribute\s*\(\s*['"]hidden|style\s*\.\s*(display|visibility)\s*=(?!=))/.test(codigo)
  ) {
    problemas.push('la isla esconde o muestra el contador por su cuenta: eso lo decide mostrarContador(');
  }

  // La fila.
  if (!/(?<![\w$.])nivelAJugar\s*\(\s*banco\.niveles\s*,\s*pedido\s*,\s*cargarAvance\s*\(\s*\)\s*\)/.test(codigo)) {
    problemas.push('la isla no elige el nivel con el avance: nivelAJugar(banco.niveles, pedido, cargarAvance())');
  }

  // La victoria: una sola, antes del tic.
  const onUpdate = codigo.search(/(?<![\w$])onUpdate\s*\(/);
  const declarada = /(?<![\w$.])const\s+victoria\s*=\s*crearVictoria\s*\(\s*\)/.exec(codigo);
  if (declarada === null) problemas.push('la isla no tiene «const victoria = crearVictoria()»');
  else if (onUpdate >= 0 && declarada.index > onUpdate) problemas.push('la victoria se crea adentro del tic: cada tic arranca sin saber cuándo se ganó');

  // El tic: después de jugarTic(, la marca con el guardado, y el contador.
  const tic = onUpdate < 0 ? undefined : cuerpoDesde(codigo, onUpdate);
  if (tic === undefined) problemas.push('la isla no tiene onUpdate(: este auditor no está mirando nada');
  else {
    const juega = tic.search(/(?<![\w$.])jugarTic\s*\(/);
    const guarda = /if\s*\(\s*marcarVictoria\s*\(\s*victoria\s*,\s*mundo\s*,\s*((?:[^()]|\(\s*\))*)\)\s*\)\s*\{?\s*guardarPasado\s*\(\s*mundo\.nivel\.id\s*\)/.exec(tic);
    if (guarda === null) problemas.push('el onUpdate( no guarda el avance al ganar: if (marcarVictoria(victoria, mundo, k.time())) guardarPasado(mundo.nivel.id)');
    else {
      if (guarda[1]!.replace(/\s/g, '') !== 'k.time()') {
        problemas.push(`marcarVictoria( lleva «${guarda[1]}» de reloj, y es el del motor, k.time(): el de la partida se congela al ganar y el baile no se movería`);
      }
      if (juega < 0 || guarda.index < juega) problemas.push('el onUpdate( marca la victoria antes de jugarTic(: se guarda un tic tarde');
    }
    const muestra = /(?<![\w$.])mostrarContador\s*\(\s*contador\s*,\s*mundo\s*\)/.exec(tic);
    if (muestra === null) problemas.push('el onUpdate( no llama a mostrarContador(contador, mundo): al ganar no aparece el contador');
    else if (juega < 0 || muestra.index < juega) problemas.push('el onUpdate( muestra el contador antes de jugarTic(: aparece un tic tarde');
  }
  const guardados = [...codigo.matchAll(/(?<![\w$.])guardarPasado\s*\(/g)].length;
  if (guardados > 1) problemas.push(`hay ${guardados} guardarPasado(: el avance se guarda al ganar y en ningún otro lado (CTR-16.11.5, no al tocar Seguí)`);

  // El dibujo: el baile con su reloj.
  const onDraw = codigo.search(/(?<![\w$])onDraw\s*\(/);
  const cuadro = onDraw < 0 ? undefined : cuerpoDesde(codigo, onDraw);
  if (cuadro === undefined || !/(?<![\w$.])dibujar\s*\(\s*k\s*,\s*mundo\s*,\s*atlas\s*,\s*deFrente\s*,\s*victoria\s*\)/.test(cuadro)) {
    problemas.push('el onDraw( no le pasa la victoria a dibujar(k, mundo, atlas, deFrente, victoria): el baile no tiene reloj');
  }
  const frame = /\bframe\s*:\s*cuadroDelAtlas\s*\(\s*json\s*,\s*t\.estado\s*,\s*relojDelTrazo\s*\(\s*t\s*,\s*mundo\s*,\s*victoria\s*,\s*((?:[^()]|\(\s*\))*)\)\s*\)/.exec(codigo);
  if (frame === null) {
    problemas.push('el cuadro no sale de relojDelTrazo(t, mundo, victoria, …): con mundo.tiempo, congelado al ganar, el baile queda quieto');
  } else if (frame[1]!.replace(/\s/g, '') !== 'movimientoReducido()') {
    problemas.push(`relojDelTrazo( recibe «${frame[1]}» de movimiento reducido, y tiene que ser movimientoReducido(): la preferencia se lee de la página`);
  }
  const reducido = /function\s+movimientoReducido\s*\(\s*\)\s*:\s*boolean\s*\{/.exec(codigo);
  const cuerpoReducido = reducido === null ? undefined : cuerpoDesdeLlave(codigo, reducido.index + reducido[0].length - 1);
  if (cuerpoReducido === undefined || cuerpoReducido.replace(/\s/g, '') !== 'returnpidioMenosMovimiento(preferencia);') {
    problemas.push('movimientoReducido() no devuelve exactamente pidioMenosMovimiento(preferencia): la condición se decide en escena.ts, probada, y acá no se da vuelta');
  }
  if (!/(?<![\w$.])const\s+preferencia\s*=\s*typeof\s+matchMedia\s*===\s*'function'\s*\?\s*matchMedia\s*\(\s*'\(prefers-reduced-motion: reduce\)'\s*\)\s*:\s*null\s*;/.test(codigo)) {
    problemas.push("la isla no consulta matchMedia('(prefers-reduced-motion: reduce)') en const preferencia: el baile se movería igual (ADR-08.8)");
  }

  // Los avisos.
  const atender = /function\s+atender\s*\([^)]*\)[^{]*\{/.exec(codigo);
  const cuerpoAtender = atender === null ? undefined : cuerpoDesdeLlave(codigo, atender.index + atender[0].length - 1);
  if (cuerpoAtender === undefined || !/(?<![\w$.])avisoDelSuceso\s*\(\s*s\s*,\s*ultimo\s*\)/.test(cuerpoAtender)) {
    problemas.push('atender() no le pide el aviso a avisoDelSuceso(s, ultimo): ganar y juntar no se anuncian, o el sexto no dice que era el último');
  }
  if (atender === null || !/\bultimo\s*:\s*boolean\s*\)/.test(atender[0])) problemas.push('atender() no recibe ultimo: boolean');
  if (tic !== undefined && !/(?<![\w$.])atender\s*\(\s*jugarTic\s*\((?:[^()]|\(\s*\))*\)\s*,\s*deFrente\s*,\s*esElUltimo\s*\(\s*mundo\s*,\s*banco\.niveles\s*\)\s*\)/.test(tic)) {
    problemas.push('el onUpdate( no le dice a atender( si es el último: atender(jugarTic(…), deFrente, esElUltimo(mundo, banco.niveles))');
  }
  if (/(?<![\w$])(PANTALLA\s*\.\s*aviso\w*|COLECCIONABLE)(?![\w$])/.test(codigo)) {
    problemas.push('la isla nombra un texto de aviso por su cuenta: lo elige avisoDelSuceso(');
  }
  return problemas;
}

test('la isla de verdad baila, cuenta y guarda el avance donde tiene que (T-302)', () => {
  assert.deepEqual(problemasDeLaVictoria(readFileSync(ISLA, 'utf-8'), readFileSync(PAGINA, 'utf-8')), []);
});

const TIC_VICTORIA =
  '    atender(jugarTic(reloj, mundo, ambos, k.dt()), deFrente, esElUltimo(mundo, banco.niveles));\n' +
  '    if (marcarVictoria(victoria, mundo, k.time())) guardarPasado(mundo.nivel.id);\n' +
  '    mostrarContador(contador, mundo);\n';
const FRAME_SANO = 'frame: cuadroDelAtlas(json, t.estado, relojDelTrazo(t, mundo, victoria, movimientoReducido()))';
const ISLA_VICTORIA_SANA = `
  const preferencia = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  function movimientoReducido(): boolean {
    return pidioMenosMovimiento(preferencia);
  }
  function atender(sucesos: readonly Suceso[], deFrente: Set<IdPersonaje>, ultimo: boolean): void {
    for (const s of sucesos) {
      const texto = avisoDelSuceso(s, ultimo);
      if (texto !== null && aviso !== null) aviso.textContent = texto;
    }
  }
  function dibujar(k: KAPLAYCtx, mundo: Mundo, atlas: Atlas, deFrente: ReadonlySet<IdPersonaje>, victoria: Victoria): void {
    for (const t of trazosDe(mundo, deFrente)) {
      const { json, sprite } = atlas[t.pieza];
      k.drawSprite({ sprite, ${FRAME_SANO}, flipX: t.espejo });
    }
  }
  const capa = document.querySelector<HTMLElement>('#contador-victoria');
  const nivel = nivelAJugar(banco.niveles, pedido, cargarAvance());
  let mundo = crearMundo(banco, nivel);
  const victoria = crearVictoria();
  k.onUpdate(() => {
${TIC_VICTORIA}  });
  k.onDraw(() => {
    dibujar(k, mundo, atlas, deFrente, victoria);
  });
`;
const PAGINA_VICTORIA_SANA =
  '<div class="recorte"><canvas id="juego"></canvas>' +
  '<p id="contador-victoria" class="contador-victoria" hidden><span data-de="skayboy" hidden></span><span data-de="poligirl" hidden></span></p></div>';

test('control: la isla y la página de referencia de la victoria están sanas', () => {
  assert.deepEqual(problemasDeLaVictoria(ISLA_VICTORIA_SANA, PAGINA_VICTORIA_SANA), []);
  // Un comentario que cita lo prohibido no cuenta.
  const comentada = ISLA_VICTORIA_SANA + '\n// nunca guardarPasado(mundo.nivel.id) al tocar, ni PANTALLA.avisoVictoria a mano';
  assert.deepEqual(problemasDeLaVictoria(comentada, PAGINA_VICTORIA_SANA), []);
});

for (const [caso, isla, pagina, espera] of [
  ['🔴 sin la capa', ISLA_VICTORIA_SANA, '<div class="recorte"><canvas id="juego"></canvas></div>', 'no tiene la capa'],
  ['🔴 la capa visible desde el arranque', ISLA_VICTORIA_SANA, PAGINA_VICTORIA_SANA.replace('class="contador-victoria" hidden', 'class="contador-victoria"'), 'no nace escondido'],
  ['🔴 la capa afuera del recorte', ISLA_VICTORIA_SANA, PAGINA_VICTORIA_SANA.replace('</canvas>', '</canvas></div><div>'), 'adentro del recorte'],
  ['🔴 sin la etiqueta de Poligirl', ISLA_VICTORIA_SANA, PAGINA_VICTORIA_SANA.replace('data-de="poligirl"', 'data-de="otra"'), 'etiqueta de poligirl'],
  ['🔴 la isla no busca la capa', ISLA_VICTORIA_SANA.replace("'#contador-victoria'", "'#otra'"), PAGINA_VICTORIA_SANA, 'no busca #contador-victoria'],
  ['🔴 la isla muestra la capa por su cuenta', ISLA_VICTORIA_SANA + '\ncapa!.hidden = false;', PAGINA_VICTORIA_SANA, 'por su cuenta'],
  ['🔴 al entrar, sin avance', ISLA_VICTORIA_SANA.replace('nivelAJugar(banco.niveles, pedido, cargarAvance())', 'nivelAJugar(banco.niveles, pedido)'), PAGINA_VICTORIA_SANA, 'con el avance'],
  ['🔴 al ganar no se guarda', ISLA_VICTORIA_SANA.replace(' guardarPasado(mundo.nivel.id);', ' {}'), PAGINA_VICTORIA_SANA, 'no guarda el avance'],
  [
    '🔴 se guarda al tocar Seguí',
    ISLA_VICTORIA_SANA + "\nseguir?.addEventListener('click', () => { guardarPasado(mundo.nivel.id); });",
    PAGINA_VICTORIA_SANA,
    'no al tocar Seguí',
  ],
  ['🔴 la victoria con el reloj de la partida', ISLA_VICTORIA_SANA.replace('marcarVictoria(victoria, mundo, k.time())', 'marcarVictoria(victoria, mundo, mundo.tiempo)'), PAGINA_VICTORIA_SANA, 'el del motor'],
  [
    '🔴 la victoria se marca antes de jugar',
    ISLA_VICTORIA_SANA.replace(
      TIC_VICTORIA,
      '    if (marcarVictoria(victoria, mundo, k.time())) guardarPasado(mundo.nivel.id);\n    atender(jugarTic(reloj, mundo, ambos, k.dt()), deFrente, esElUltimo(mundo, banco.niveles));\n    mostrarContador(contador, mundo);\n',
    ),
    PAGINA_VICTORIA_SANA,
    'un tic tarde',
  ],
  [
    '🔴 una victoria nueva en cada tic',
    ISLA_VICTORIA_SANA.replace('  const victoria = crearVictoria();\n', '').replace('  k.onUpdate(() => {\n', '  k.onUpdate(() => {\n    const victoria = crearVictoria();\n'),
    PAGINA_VICTORIA_SANA,
    'adentro del tic',
  ],
  ['🔴 sin victoria', ISLA_VICTORIA_SANA.replace('  const victoria = crearVictoria();\n', ''), PAGINA_VICTORIA_SANA, 'no tiene «const victoria'],
  ['🔴 el tic no muestra el contador', ISLA_VICTORIA_SANA.replace('    mostrarContador(contador, mundo);\n', ''), PAGINA_VICTORIA_SANA, 'no llama a mostrarContador('],
  [
    '🔴 el contador antes de jugar',
    ISLA_VICTORIA_SANA.replace('    atender(jugarTic(', '    mostrarContador(contador, mundo);\n    atender(jugarTic(').replace('    mostrarContador(contador, mundo);\n  });', '  });'),
    PAGINA_VICTORIA_SANA,
    'un tic tarde',
  ],
  ['🔴 el baile con el reloj de la partida', ISLA_VICTORIA_SANA.replace(FRAME_SANO, 'frame: cuadroDelAtlas(json, t.estado, mundo.tiempo)'), PAGINA_VICTORIA_SANA, 'relojDelTrazo('],
  [
    '🔴 el baile sin mirar el movimiento reducido',
    ISLA_VICTORIA_SANA.replace('relojDelTrazo(t, mundo, victoria, movimientoReducido())', 'relojDelTrazo(t, mundo, victoria, false)'),
    PAGINA_VICTORIA_SANA,
    'movimiento reducido',
  ],
  ['🔴 movimientoReducido() que no lee nada', ISLA_VICTORIA_SANA.replace('return pidioMenosMovimiento(preferencia);', 'return false;'), PAGINA_VICTORIA_SANA, 'exactamente pidioMenosMovimiento'],
  [
    '🔴 movimientoReducido() dado vuelta, con la condición a mano',
    ISLA_VICTORIA_SANA.replace('return pidioMenosMovimiento(preferencia);', 'return preferencia?.matches !== true;'),
    PAGINA_VICTORIA_SANA,
    'exactamente pidioMenosMovimiento',
  ],
  [
    '🔴 movimientoReducido() dado vuelta, negando la función',
    ISLA_VICTORIA_SANA.replace('return pidioMenosMovimiento(preferencia);', 'return !pidioMenosMovimiento(preferencia);'),
    PAGINA_VICTORIA_SANA,
    'exactamente pidioMenosMovimiento',
  ],
  [
    '🔴 la preferencia sin el null de cuando no hay matchMedia',
    ISLA_VICTORIA_SANA.replace("typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null", "matchMedia('(prefers-reduced-motion: reduce)')"),
    PAGINA_VICTORIA_SANA,
    'no consulta matchMedia',
  ],
  ['🔴 la isla esconde la capa por el contador', ISLA_VICTORIA_SANA + '\ncontador.capa.hidden = true;', PAGINA_VICTORIA_SANA, 'por su cuenta'],
  ['🔴 la isla esconde una etiqueta por el contador', ISLA_VICTORIA_SANA + "\ncontador?.etiquetas['skayboy'].hidden = true;", PAGINA_VICTORIA_SANA, 'por su cuenta'],
  ['🔴 la isla le pone hidden a la capa por atributo', ISLA_VICTORIA_SANA + "\ncontador!.capa.setAttribute('hidden', '');", PAGINA_VICTORIA_SANA, 'por su cuenta'],
  ['🔴 la isla la esconde por estilo', ISLA_VICTORIA_SANA + "\ncontador.capa.style.display = 'none';", PAGINA_VICTORIA_SANA, 'por su cuenta'],
  [
    '🔴 la capa después del botón',
    ISLA_VICTORIA_SANA,
    '<div class="recorte"><canvas id="juego"></canvas><button type="button" id="seguir-juego" hidden></button>' +
      '<p id="contador-victoria" class="contador-victoria" hidden><span data-de="skayboy" hidden></span><span data-de="poligirl" hidden></span></p></div>',
    'se come el toque',
  ],
  ['🔴 atender sin decir si es el último', ISLA_VICTORIA_SANA.replace('const texto = avisoDelSuceso(s, ultimo);', 'const texto = avisoDelSuceso(s, false);'), PAGINA_VICTORIA_SANA, 'avisoDelSuceso(s, ultimo)'],
  [
    '🔴 el tic sin esElUltimo',
    ISLA_VICTORIA_SANA.replace('deFrente, esElUltimo(mundo, banco.niveles));', 'deFrente, false);'),
    PAGINA_VICTORIA_SANA,
    'si es el último',
  ],
  ['🔴 sin consultar la preferencia', ISLA_VICTORIA_SANA.replace("'(prefers-reduced-motion: reduce)'", "'(min-width: 1px)'"), PAGINA_VICTORIA_SANA, 'no consulta matchMedia'],
  ['🔴 el onDraw no le pasa la victoria', ISLA_VICTORIA_SANA.replace('dibujar(k, mundo, atlas, deFrente, victoria);', 'dibujar(k, mundo, atlas, deFrente, crearVictoria());'), PAGINA_VICTORIA_SANA, 'no le pasa la victoria'],
  ['🔴 atender sin avisoDelSuceso', ISLA_VICTORIA_SANA.replace('const texto = avisoDelSuceso(s, ultimo);', 'const texto = null;'), PAGINA_VICTORIA_SANA, 'avisoDelSuceso(s, ultimo)'],
  ['🔴 un aviso escrito a mano', ISLA_VICTORIA_SANA + '\naviso.textContent = PANTALLA.avisoVictoria;', PAGINA_VICTORIA_SANA, 'por su cuenta: lo elige avisoDelSuceso('],
] as const) {
  test(`el auditor de la victoria sabe encontrar: ${caso}`, () => {
    assert.notEqual(isla + pagina, ISLA_VICTORIA_SANA + PAGINA_VICTORIA_SANA, 'el reemplazo del caso no encontró su texto: el caso no está probando nada');
    const problemas = problemasDeLaVictoria(isla, pagina);
    assert.ok(problemas.some((p) => p.includes(espera)), `tenía que caer por «${espera}» y dijo:\n${problemas.join('\n') || '(nada)'}`);
  });
}

test('🔴 pidioMenosMovimiento: solo un matches que es true de verdad frena el baile (ADR-08.8)', () => {
  assert.equal(pidioMenosMovimiento({ matches: true }), true);
  assert.equal(pidioMenosMovimiento({ matches: false }), false);
  assert.equal(pidioMenosMovimiento(null), false, 'sin matchMedia, el baile se mueve');
  assert.equal(pidioMenosMovimiento(undefined), false);
  assert.equal(pidioMenosMovimiento({ matches: 'true' }), false, 'un texto no es la preferencia');
});

/* -----------------------------------------------------------------------------------------
   La hoja de la capa del contador
   ----------------------------------------------------------------------------------------- */

const HOJA = 'src/styles/skayboy.css';

/** Las reglas de una hoja, sin comentarios: selector y cuerpo. Las de adentro de un `@media` también. */
function reglasDe(css: string): { selector: string; cuerpo: string }[] {
  const limpio = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...limpio.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1]!.trim(), cuerpo: m[2]! }));
}

/** El valor de una propiedad en el cuerpo de una regla, sin espacios de más, o `undefined`. */
function valorDe(cuerpo: string, propiedad: string): string | undefined {
  const m = new RegExp(`(?:^|[;\\s])${propiedad}\\s*:\\s*([^;]+)`).exec(cuerpo);
  return m?.[1]!.trim().replace(/\s+/g, ' ');
}

/**
 * **La hoja de la capa del contador** (la verificación de `T-302`). Dos cosas que ningún test
 * miraba:
 *
 * 1. **La capa no toma toques.** Es `inset: 0` sobre el área: con toques, se come el de Seguí.
 *    `pointer-events: none` en `.contador-victoria`, y ninguna regla del contador que lo devuelva.
 * 2. **La caja que se ve es la que `ubicarEtiquetas()` prueba en Node**: la etiqueta va en
 *    `--contador-x/-y/-ancho/-alto`, con `box-sizing: border-box` y sin `transform` que la corra, y
 *    la letra en `cqw` de la capa (`container-type: size`), que escala con el área. Con la letra en
 *    `rem`, la caja del texto no escala y las dos etiquetas se pisaban a ×1.
 */
function problemasDeLaHojaDelContador(css: string): string[] {
  const problemas: string[] = [];
  const reglas = reglasDe(css);
  const unica = (clase: string) => reglas.filter((r) => new RegExp(`\\.${clase}\\s*$`).test(r.selector));
  const capas = unica('contador-victoria');
  if (capas.length === 0) problemas.push('la hoja no tiene la regla de .contador-victoria');
  for (const capa of capas) {
    if (valorDe(capa.cuerpo, 'pointer-events') !== 'none') problemas.push('.contador-victoria no lleva pointer-events: none: se come el toque de Seguí');
    if (valorDe(capa.cuerpo, 'container-type') !== 'size') problemas.push('.contador-victoria no es contenedor (container-type: size): la letra no escala con el área');
  }
  for (const r of reglas.filter((q) => /contador-/.test(q.selector))) {
    const v = valorDe(r.cuerpo, 'pointer-events');
    if (v !== undefined && v !== 'none') problemas.push(`«${r.selector}» le devuelve los toques al contador (pointer-events: ${v})`);
  }
  const etiquetas = unica('contador-etiqueta');
  if (etiquetas.length === 0) problemas.push('la hoja no tiene la regla de .contador-etiqueta');
  for (const e of etiquetas) {
    for (const [propiedad, variable] of [
      ['left', '--contador-x'],
      ['top', '--contador-y'],
      ['width', '--contador-ancho'],
      ['height', '--contador-alto'],
    ] as const) {
      if (!new RegExp(`^var\\(\\s*${variable}\\b`).test(valorDe(e.cuerpo, propiedad) ?? '')) {
        problemas.push(`.contador-etiqueta no toma ${propiedad} de var(${variable}): la caja que se ve no es la que se probó`);
      }
    }
    if (valorDe(e.cuerpo, 'box-sizing') !== 'border-box') problemas.push('.contador-etiqueta sin box-sizing: border-box: el borde la agranda');
    if (!/^[\d.]+cqw$/.test(valorDe(e.cuerpo, 'font-size') ?? '')) problemas.push('.contador-etiqueta no tiene la letra en cqw: el texto no escala con el área');
  }
  for (const r of reglas.filter((q) => /contador-etiqueta/.test(q.selector))) {
    if (valorDe(r.cuerpo, 'transform') !== undefined) problemas.push(`«${r.selector}» corre la etiqueta con transform: la caja que se ve no es la que se probó`);
  }
  return problemas;
}

test('la hoja de verdad: la capa no toma toques, y la caja de cada etiqueta es la que se probó (T-302)', () => {
  assert.deepEqual(problemasDeLaHojaDelContador(readFileSync(HOJA, 'utf-8')), []);
});

const HOJA_SANA = `
.juego-skayboy .contador-victoria { position: absolute; inset: 0; pointer-events: none; container-type: size; }
.juego-skayboy .contador-victoria[hidden], .juego-skayboy .contador-etiqueta[hidden] { display: none; }
.juego-skayboy .contador-etiqueta {
  left: var(--contador-x, 0%); top: var(--contador-y, 0%);
  width: var(--contador-ancho, 40%); height: var(--contador-alto, 11.111%);
  box-sizing: border-box; font-size: 3.75cqw;
}`;

test('control: la hoja de referencia del contador está sana', () => {
  assert.deepEqual(problemasDeLaHojaDelContador(HOJA_SANA), []);
});

for (const [caso, hoja, espera] of [
  ['🔴 la capa toma toques', HOJA_SANA.replace(' pointer-events: none;', ''), 'se come el toque'],
  ['🔴 la capa con pointer-events: auto', HOJA_SANA.replace('pointer-events: none', 'pointer-events: auto'), 'se come el toque'],
  ['🔴 una etiqueta que devuelve los toques', HOJA_SANA.replace('box-sizing: border-box;', 'box-sizing: border-box; pointer-events: auto;'), 'le devuelve los toques'],
  ['🔴 la capa no es contenedor', HOJA_SANA.replace(' container-type: size;', ''), 'container-type'],
  ['🔴 la letra en rem', HOJA_SANA.replace('font-size: 3.75cqw', 'font-size: 0.56rem'), 'letra en cqw'],
  ['🔴 el ancho del texto', HOJA_SANA.replace('width: var(--contador-ancho, 40%);', 'width: auto;'), 'width de var(--contador-ancho)'],
  ['🔴 sin box-sizing', HOJA_SANA.replace(' box-sizing: border-box;', ''), 'border-box'],
  ['🔴 la etiqueta corrida con transform', HOJA_SANA + '\n.juego-skayboy .contador-etiqueta[data-lado] { transform: translate(-100%, 0); }', 'transform'],
  ['🔴 sin la regla de la capa', HOJA_SANA.replace('.juego-skayboy .contador-victoria {', '.juego-skayboy .otra {'), 'no tiene la regla de .contador-victoria'],
] as const) {
  test(`el auditor de la hoja del contador sabe encontrar: ${caso}`, () => {
    assert.notEqual(hoja, HOJA_SANA, 'el reemplazo del caso no encontró su texto');
    const problemas = problemasDeLaHojaDelContador(hoja);
    assert.ok(problemas.some((p) => p.includes(espera)), `tenía que caer por «${espera}» y dijo:\n${problemas.join('\n') || '(nada)'}`);
  });
}
