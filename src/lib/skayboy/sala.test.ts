/**
 * La sala dibujada (`T-276`, ciclo 16; `D-44`): que cada `tipo` de la leyenda tenga su tile, y
 * que ninguno vista una tinta que no le toca.
 *
 * Lee `src/arte/pixel/sala.txt` con el mismo lector que usa la imprenta (`leerDibujo`), así
 * que lo que acá pasa es lo que se imprime. Cinco cosas, y las cinco salen de un contrato
 * escrito:
 *
 * 1. **Cada `tipo` de `CTR-16.4` / `CTR-16.10` que se dibuja tiene su tile**, y las piezas con
 *    estado —palanca, placa, compuerta— tienen dos (`CTR-16.10.8`, *"lo que `sala.test.ts`
 *    puede contar"*). Los tres molinetes y las dos puertas, uno cada uno.
 * 2. **Ninguna tinta de personaje** (`--px-skay-*`, `--px-poli-*`) entra a la sala: una pieza
 *    pintada con una de ellas se lee como un pedazo de uno de los dos (`D-38`).
 * 3. **Las piezas de los dos van en clave y luz** (`CTR-16.10.8`, `UX-27 §4.1.2`): palanca,
 *    placa, compuerta, caja y las dos puertas. Lo que las distingue es la forma.
 * 4. **Cielo e infierno no se mezclan, y el molinete de los dos los mezcla**: el de cielo no
 *    trae tinta de infierno ni al revés, y el que devuelve a los dos trae de las dos rampas
 *    (`CTR-16.10.8`, la tabla: *"las dos rampas mezcladas se leen como el molinete que
 *    devuelve a los dos"*). Que además se distingan **por forma** y en gris no lo puede ver
 *    un test: lo mira `revisor` en la hoja de contacto (`UX-30 §7`).
 * 5. **Ninguna tinta de rampa llega al borde del tile** (`UX-27 §5.2`): el contorno es de clave,
 *    o el tile no sabría dónde termina contra el aire.
 *
 * La tinta diecisiete —un color que no está en `tokens.css`— no es de este archivo: la caza el
 * auditor de paleta sobre el PNG impreso (`T-268`).
 *
 * **La lista de `tipo` está escrita acá y además se cruza con el schema.** El schema es la
 * fuente, pero `T-272` le está sumando los tipos de `CTR-16.10` en la misma ráfaga: si el test
 * leyera solo el schema, hoy no vería la palanca ni la compuerta. Entonces manda la unión: lo
 * que dice `CTR-16.4` y lo que diga el schema. Un `tipo` nuevo en el schema sin decisión acá
 * es rojo.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { leerDibujo, type Dibujo } from '../pixel/fuente.ts';

const ARCHIVO = 'src/arte/pixel/sala.txt';
const SCHEMA = 'src/data/_schema/skayboy.schema.json';
const DATO = 'src/data/skayboy.json';

/**
 * `CTR-16.4`, el enum de `tipo` enmendado por `CTR-16.10`: los diez, y qué tile lleva cada uno.
 * Lo que no se dibuja lleva `noSeDibuja` con el porqué: una decisión sin motivo es un olvido.
 */
const TILES_DE_LA_SALA: Readonly<Record<string, readonly string[] | { noSeDibuja: string }>> = {
  aire: { noSeDibuja: 'es el fondo del área, --px-luz liso (UX-27 §1.1)' },
  solido: ['solido'],
  molinete: ['molineteCielo', 'molineteInfierno', 'molineteDos'],
  tesoro: ['tesoro'],
  entrada: { noSeDibuja: 'es aire; lo que la muestra es el muñeco parado ahí (UX-29 §3)' },
  puerta: ['puertaSkayboy', 'puertaPoligirl'],
  palanca: ['palancaReposo', 'palancaActiva'],
  placa: ['placaLibre', 'placaPisada'],
  compuerta: ['compuertaCerrada', 'compuertaAbierta'],
  caja: ['caja'],
};

/** Las piezas con estado: dos tiles cada una, y distintos (`CTR-16.10.8`). */
const CON_ESTADO = ['palanca', 'placa', 'compuerta'] as const;

/**
 * Lo que `CTR-16.10` retiró del enum y el schema todavía puede traer mientras `T-272` no lo
 * saca: `mecanismo` se partió en `palanca` y `placa`. Cuando el schema ya no lo nombre, esta
 * línea se puede borrar.
 */
const RETIRADOS = new Set(['mecanismo']);

const CIELO = new Set(['--px-cielo', '--px-cielo-2', '--px-blanco-gulp']);
const INFIERNO = new Set(['--px-infierno', '--px-infierno-2', '--px-infierno-3']);
const FIJAS = new Set(['--px-clave', '--px-luz']);
/** Las tintas que la sala puede usar: las fijas, las dos rampas de terreno y el tesoro. */
const DE_LA_SALA = new Set([...FIJAS, ...CIELO, ...INFIERNO, '--px-tesoro']);
/** Las piezas que son de los dos y no tienen tinta propia: clave y luz, y nada más. */
const SOLO_CLAVE_Y_LUZ = ['puerta', 'palanca', 'placa', 'compuerta', 'caja'] as const;

function dibujados(tipo: string): readonly string[] {
  const t = TILES_DE_LA_SALA[tipo];
  return t === undefined || 'noSeDibuja' in t ? [] : t;
}

function leerSala(): Dibujo {
  const { dibujo, errores } = leerDibujo(readFileSync(ARCHIVO, 'utf-8'), ARCHIVO);
  assert.ok(dibujo, `${ARCHIVO} no se deja leer:\n  ${errores.join('\n  ')}`);
  return dibujo;
}

/**
 * Las tintas (por nombre `--px-*`) que usa de verdad la grilla de un estado. Un estado que no
 * está da un conjunto vacío: que falte un tile lo dice un solo test, el de los que faltan, y
 * los demás no se caen en cadena por eso.
 */
function tintasDe(d: Dibujo, estado: string): Set<string> {
  const cuadro = d.cuadros.find((c) => c.estado === estado);
  if (!cuadro) return new Set();
  const usadas = new Set<string>();
  for (const fila of cuadro.filas) for (const car of fila) usadas.add(d.leyenda.get(car) ?? car);
  return usadas;
}

test('sala.txt se lee, y es un atlas de tiles de 16 × 16', () => {
  const d = leerSala();
  assert.equal(d.tipo, 'tile', 'la sala son tiles (CTR-15.3), no celdas de personaje');
  for (const e of d.estados) assert.equal(e.cuadros, 1, `${e.nombre}: un tile de la sala es un cuadro fijo`);
});

test('cada tipo del schema tiene una decisión acá: su tile, o por qué no se dibuja', () => {
  const schema = JSON.parse(readFileSync(SCHEMA, 'utf-8'));
  const enums = new Set<string>();
  JSON.stringify(schema, (k, v) => {
    if (k === 'tipo' && v && Array.isArray(v.enum)) for (const t of v.enum) enums.add(t);
    return v;
  });
  assert.ok(enums.size > 0, `${SCHEMA}: no encontré el enum de tipo`);
  const sinDecision = [...enums].filter((t) => !RETIRADOS.has(t) && !(t in TILES_DE_LA_SALA));
  assert.deepEqual(sinDecision, [], `tipos del schema sin tile ni motivo en sala.test.ts: ${sinDecision.join(', ')}`);
});

test('cada tipo que se dibuja tiene su tile en sala.txt, y los que tienen estado, dos', () => {
  const d = leerSala();
  const hay = new Set(d.estados.map((e) => e.nombre));
  const faltan: string[] = [];
  for (const [tipo, tiles] of Object.entries(TILES_DE_LA_SALA)) {
    if ('noSeDibuja' in tiles) {
      assert.ok(tiles.noSeDibuja.length > 0, `${tipo}: no se dibuja, pero no dice por qué`);
      continue;
    }
    for (const t of tiles) if (!hay.has(t)) faltan.push(`${tipo} → ${t}`);
  }
  assert.deepEqual(faltan, [], `a sala.txt le faltan tiles: ${faltan.join(', ')}`);
  for (const tipo of CON_ESTADO) assert.equal(dibujados(tipo).length, 2, `${tipo} tiene dos estados (CTR-16.10.8)`);
});

test('sala.txt no trae un tile que no sea de ningún tipo', () => {
  const d = leerSala();
  const conocidos = new Set(Object.keys(TILES_DE_LA_SALA).flatMap(dibujados));
  const sobran = d.estados.map((e) => e.nombre).filter((n) => !conocidos.has(n));
  assert.deepEqual(sobran, [], `tiles sin tipo en la leyenda: ${sobran.join(', ')}`);
});

test('los dos estados de una pieza no son el mismo dibujo', () => {
  const d = leerSala();
  for (const tipo of CON_ESTADO) {
    const [a, b] = dibujados(tipo).map((e) => d.cuadros.find((c) => c.estado === e)?.filas.join('\n'));
    if (a === undefined || b === undefined) continue; // falta uno: lo dice el test de los que faltan
    assert.notEqual(a, b, `${tipo}: los dos estados son iguales, y el estado va por forma (CTR-16.10.8)`);
  }
});

test('ninguna tinta de personaje entra a la sala, y ninguna fuera de las suyas', () => {
  const d = leerSala();
  for (const nombre of d.leyenda.values()) {
    assert.ok(!/^--px-(skay|poli)-/.test(nombre), `${nombre} es de un personaje: en la sala se leería como un pedazo de uno (D-38)`);
    assert.ok(DE_LA_SALA.has(nombre), `${nombre} no es una tinta de la sala (clave, luz, cielo, infierno, tesoro)`);
  }
});

test('las piezas de los dos van en clave y luz, sin tinta propia', () => {
  const d = leerSala();
  for (const tipo of SOLO_CLAVE_Y_LUZ) {
    for (const estado of dibujados(tipo)) {
      const ajenas = [...tintasDe(d, estado)].filter((t) => !FIJAS.has(t));
      assert.deepEqual(ajenas, [], `${estado} usa ${ajenas.join(', ')}: va en clave y luz, y se distingue por forma (CTR-16.10.8)`);
    }
  }
});

test('el molinete de cielo no trae infierno, el de infierno no trae cielo, y el de los dos trae de los dos', () => {
  const d = leerSala();
  const cielo = tintasDe(d, 'molineteCielo');
  const infierno = tintasDe(d, 'molineteInfierno');
  const dos = tintasDe(d, 'molineteDos');
  const de = (usadas: Set<string>, rampa: Set<string>) => [...usadas].filter((t) => rampa.has(t));
  assert.deepEqual(de(cielo, INFIERNO), [], 'el cielo trae tinta de infierno');
  assert.deepEqual(de(infierno, CIELO), [], 'el infierno trae tinta de cielo');
  assert.ok(de(cielo, CIELO).length > 0, 'el cielo no usa ninguna tinta de cielo');
  assert.ok(de(infierno, INFIERNO).length > 0, 'el infierno no usa ninguna tinta de infierno');
  assert.ok(
    de(dos, CIELO).length > 0 && de(dos, INFIERNO).length > 0,
    'el molinete que devuelve a los dos tiene que traer de las dos rampas: con una sola se lee "de uno"',
  );
  assert.ok(tintasDe(d, 'tesoro').has('--px-tesoro'), 'el tesoro usa su tinta, la única de objeto (UX-27 §4)');
});

/**
 * El contorno (`UX-27 §5.2`): el borde de un tile toca al vecino, que puede ser aire, y el ancla
 * del cielo queda a 1,024:1 del aire (`§4`). Si una tinta de rampa llega al borde, suelta contra
 * el aire no se sabe dónde termina la celda: fue el hallazgo de la revisión de `T-276` sobre el
 * molinete de cielo. En el borde, entonces, solo clave o luz.
 */
test('ningún tile deja una tinta de rampa en su borde: el contorno es de clave', () => {
  const d = leerSala();
  for (const cuadro of d.cuadros) {
    const n = cuadro.filas.length;
    const borde = [
      ...cuadro.filas[0]!,
      ...cuadro.filas[n - 1]!,
      ...cuadro.filas.map((f) => f[0]!),
      ...cuadro.filas.map((f) => f[f.length - 1]!),
    ];
    const ajenas = [...new Set(borde.map((c) => d.leyenda.get(c) ?? c))].filter((t) => !FIJAS.has(t));
    assert.deepEqual(ajenas, [], `${cuadro.estado}: ${ajenas.join(', ')} llega al borde sin contorno de clave (UX-27 §5.2)`);
  }
});

test('cada caracter de la leyenda del dato cae en un tile de la sala, o en un tipo que no se dibuja', () => {
  const d = leerSala();
  const hay = new Set(d.estados.map((e) => e.nombre));
  const dato = JSON.parse(readFileSync(DATO, 'utf-8')) as {
    leyenda: Record<string, { tipo: string; elemento?: string; devuelve?: string[]; de?: string }>;
  };
  const mayus = (s: string) => s[0]!.toUpperCase() + s.slice(1);
  for (const [car, e] of Object.entries(dato.leyenda)) {
    if (RETIRADOS.has(e.tipo)) continue;
    const decision = TILES_DE_LA_SALA[e.tipo];
    assert.ok(decision, `"${car}" es ${e.tipo}, que la sala no conoce`);
    if ('noSeDibuja' in decision) continue;
    let tile: string;
    if (e.tipo === 'molinete') {
      // Por elemento (CTR-16.10). Mientras T-272 no lo carga, el reparto de UX-30 §3:
      // el cielo devuelve a Skayboy y el infierno a Poligirl.
      const elemento =
        e.elemento ?? (e.devuelve?.length === 2 ? 'dos' : e.devuelve?.[0] === 'skayboy' ? 'cielo' : 'infierno');
      tile = `molinete${mayus(elemento)}`;
    } else if (e.tipo === 'puerta') {
      tile = `puerta${mayus(e.de ?? '')}`;
    } else {
      tile = decision[0]!;
    }
    assert.ok(hay.has(tile), `"${car}" (${e.tipo}) no tiene su tile ${tile} en sala.txt`);
  }
});
