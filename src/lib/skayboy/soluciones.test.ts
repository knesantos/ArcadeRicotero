/**
 * Lo que exige la solución grabada (`CTR-18.6`, `T-267`): **cada nivel del banco trae el camino
 * de una persona sola, y ese camino gana repitiéndose a paso fijo en cada build.**
 *
 * Es la mitad de `BR-29` que prueba la máquina: (b) se pasa solo, (c) nada pide dos dedos a la
 * vez, (d) el que espera queda quieto y a salvo, y (f) la paridad está contada. Lo que queda para
 * el teléfono es (a), dos personas a la vez, y lo que solo un pulgar sabe.
 *
 * Las once reglas, en el orden del contrato, y cada una con su caso en rojo al lado:
 *
 * 1. cada nivel tiene su traza y cada traza su nivel;
 * 2. las trazas están en la unidad del mundo;
 * 3. cada renglón cumple la gramática, en forma canónica, con la misma expresión que el schema;
 * 4. un renglón nombra una columna o ninguna;
 * 5. gana, y en el último cuadro;
 * 6. nadie vuelve a la entrada;
 * 7. el que espera no se mueve;
 * 8. la tolerancia alcanza el mínimo de `BR-29` para su escalón —calculada acá, no guardada—;
 * 9. la paridad del banco, con diferencia ≤ 1 (`BR-23.1`), contada con el suceso `compuerta` que
 *    el mundo emite desde `T-272`;
 * 10. nada de esto llega al navegador;
 * 11. las cajas no corren carreras: en ningún cuadro una caja espera a alguien, y al cambiar de
 *     columna ninguna anda (`T-272`, que es la que trajo las cajas).
 *
 * Todo mensaje nombra el nivel, y los de las reglas 5 a 8 terminan con el comando que regraba.
 * Los casos marcados 🔴 son guardas: cada una trae su control, porque una guarda que nunca se vio
 * en rojo no es una guarda.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { Banco, CompuertaDelNivel, IdPersonaje, MecanismoDelNivel, Nivel } from './niveles.ts';
import { CUADRO_SEG, QUIETO, TILE, crearMundo, paso, type Mandos, type Mundo } from './mundo.ts';
import {
  EXPRESION_RENGLON,
  PISO_TECNICO_CUADROS,
  TOLERANCIA_MINIMA_CUADROS,
  clonarMundo,
  columnasConTeclas,
  comandoParaRegrabar,
  diagnosticar,
  escribirTraza,
  exigirTraza,
  expandir,
  largoDe,
  leerTraza,
  mismoFuturo,
  nuevaCuentaDeParidad,
  problemaDeParidad,
  problemaDeTolerancia,
  problemaDeUnidad,
  problemasDeCorrespondencia,
  repetir,
  seMovio,
  sumarParidad,
  TOPE_TOLERANCIA,
  tolerancia,
  toleranciaMinima,
  tramosDeCompuertas,
  type Posiciones,
  type SucesoLeido,
  type TramoDeCompuerta,
  type Traza,
} from './soluciones.ts';

const BANCO: Banco = JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as Banco;

interface ArchivoDeSoluciones {
  readonly cuadrosPorSegundo: number;
  readonly soluciones: Readonly<Record<string, { readonly deUno: readonly string[] }>>;
}

const ARCHIVO = JSON.parse(readFileSync('src/data/skayboy-soluciones.json', 'utf-8')) as ArchivoDeSoluciones;
const ESQUEMA = JSON.parse(readFileSync('src/data/_schema/skayboy-soluciones.schema.json', 'utf-8')) as {
  readonly $defs: { readonly trazaDeUno: { readonly items: { readonly pattern: string } } };
};

/** La traza de un nivel del banco, leída. Si no se lee, la regla 3 ya lo dijo: acá se corta. */
function trazaDe(nivel: Nivel): Traza {
  const renglones = ARCHIVO.soluciones[nivel.id]?.deUno;
  assert.ok(renglones !== undefined, `${nivel.id} no tiene traza. Para grabarla: ${comandoParaRegrabar(nivel.id)}`);
  const { traza, problemas } = leerTraza(nivel.id, renglones);
  assert.ok(traza !== null, problemas.join('\n'));
  return traza;
}

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

/**
 * Cuántos cuadros con el mando `m`, después de jugar `antes`, hasta que se cumple `listo` —ese
 * cuadro incluido—. Es cómo una prueba nombra un largo **sin escribirlo**: si alguien afina la
 * física, el número se vuelve a contar solo (`ADR-09.4`). Con tope.
 */
function cuadrosHasta(banco: Banco, nivel: Nivel, antes: Traza, m: Mandos, listo: (mundo: Mundo) => boolean, tope = 600): number {
  const mundo = crearMundo(banco, nivel);
  for (const c of expandir(antes)) paso(mundo, c, CUADRO_SEG);
  for (let n = 1; n <= tope; n++) {
    paso(mundo, m, CUADRO_SEG);
    if (listo(mundo)) return n;
  }
  throw new Error(`pasaron ${tope} cuadros y no llegó a lo que la prueba esperaba`);
}

const corre = (id: IdPersonaje, tecla: 'izquierda' | 'derecha' | 'saltar'): Mandos =>
  id === 'skayboy' ? { skayboy: { ...QUIETO, [tecla]: true }, poligirl: QUIETO } : { skayboy: QUIETO, poligirl: { ...QUIETO, [tecla]: true } };

/** La traza con su última corrida estirada justo hasta el cuadro en que gana. */
function hastaGanar(banco: Banco, nivel: Nivel, antes: Traza, ultima: Mandos): Traza {
  const r = repetir(banco, nivel, [...antes, { mandos: ultima, cuadros: 600 }]);
  assert.ok(r.gana, 'control: estirada, la traza gana');
  return [...antes, { mandos: ultima, cuadros: r.cuadros - largoDe(antes) }];
}

/* =========================================================================================
   Reglas 1 y 2: el archivo entero
   ========================================================================================= */

test('regla 1: cada nivel de skayboy.json tiene su traza, y cada traza su nivel', () => {
  const problemas = problemasDeCorrespondencia(
    BANCO.niveles.map((n) => n.id),
    Object.keys(ARCHIVO.soluciones),
  );
  assert.deepEqual(problemas, [], problemas.join('\n'));
});

test('🔴 regla 1: el nivel sin traza y la traza sin nivel se nombran, con el comando', () => {
  assert.deepEqual(problemasDeCorrespondencia(['NIV-01', 'NIV-04'], ['NIV-01', 'NIV-09']), [
    `NIV-04 no tiene traza. Para grabarla: ${comandoParaRegrabar('NIV-04')}`,
    'hay traza para NIV-09 y no hay NIV-09',
  ]);
  // Control: con los dos lados iguales, nada.
  assert.deepEqual(problemasDeCorrespondencia(['NIV-01'], ['NIV-01']), []);
});

test('regla 2: las trazas están grabadas en la unidad del mundo', () => {
  assert.equal(ARCHIVO.cuadrosPorSegundo, Math.round(1 / CUADRO_SEG));
  assert.equal(problemaDeUnidad(ARCHIVO.cuadrosPorSegundo), null);
});

test('🔴 regla 2: otra unidad lo dice en una línea, en vez de en seis niveles rojos', () => {
  assert.match(problemaDeUnidad(50) ?? '', /grabadas a 50 cuadros por segundo y mundo\.ts corre a 60: regrabá todas/);
});

/* =========================================================================================
   Reglas 3 y 4: el renglón
   ========================================================================================= */

test('regla 3: la expresión del lector es la del schema, carácter por carácter', () => {
  // Dos gramáticas escritas por separado son dos gramáticas que un día aceptan cosas distintas.
  assert.equal(ESQUEMA.$defs.trazaDeUno.items.pattern, EXPRESION_RENGLON);
});

for (const nivel of BANCO.niveles) {
  test(`regla 3: ${nivel.id}, cada renglón se lee y la forma es canónica`, () => {
    const renglones = ARCHIVO.soluciones[nivel.id]?.deUno ?? [];
    const { traza, problemas } = leerTraza(nivel.id, renglones);
    assert.deepEqual(problemas, []);
    assert.ok(traza !== null);
    // Canónica: escrita otra vez, da exactamente los mismos renglones.
    assert.deepEqual(escribirTraza(traza), renglones);
  });
}

test('🔴 regla 3: dos renglones seguidos con el mismo mando son uno solo', () => {
  const { problemas } = leerTraza('NIV-02', ['s< 30', 's< 9', 'p> 39']);
  assert.deepEqual(problemas, ['NIV-02, renglón 2: igual al 1, y dos renglones seguidos con el mismo mando son uno solo (CTR-18.3)']);
  // Control: un renglón «-» en el medio los separa, y el escritor junta los dos iguales.
  assert.deepEqual(leerTraza('NIV-02', ['s< 30', '- 5', 's< 9']).problemas, []);
  const leida = leerTraza('NIV-02', ['s< 30', 's< 9', 'p> 39']).traza;
  assert.ok(leida !== null);
  assert.deepEqual(escribirTraza(leida), ['s< 39', 'p> 39']);
});

test('🔴 regla 3: lo que no es un renglón no se lee, y dice por qué', () => {
  const casos: [string, RegExp][] = [
    ['s<> 4', /«<>», que no existe/],
    ['s< 0', /de 1 a 9999, sin ceros/],
    ['s< 007', /de 1 a 9999, sin ceros/],
    ['s< 10000', /de 1 a 9999/],
    ['s 4', /no es un renglón de CTR-18\.3/],
    ['x< 4', /no es un renglón de CTR-18\.3/],
    ['s<4', /no es un renglón de CTR-18\.3/],
  ];
  for (const [renglon, porque] of casos) {
    const { traza, problemas } = leerTraza('NIV-01', ['p> 39', renglon]);
    assert.equal(traza, null, `«${renglon}» no se tenía que leer`);
    assert.equal(problemas.length, 1);
    assert.match(problemas[0], new RegExp(`^NIV-01, renglón 2: «${renglon.replace(/[<^]/g, '\\$&')}» `));
    assert.match(problemas[0], porque);
  }
  // Control: las cinco formas de teclas y el «-» se leen.
  assert.deepEqual(leerTraza('NIV-01', ['s<^ 1', 'p>^ 2', 's< 3', 'p> 4', 's^ 5', '- 6']).problemas, []);
});

test('🔴 regla 4: un renglón con dos columnas no se lee: la persona sola toca una por vez', () => {
  const { traza, problemas } = leerTraza('NIV-01', ['s< p> 4', 'p> 39']);
  assert.equal(traza, null);
  assert.deepEqual(problemas, [
    'NIV-01, renglón 1: «s< p> 4» nombra dos columnas: una persona sola toca una por vez (CTR-18.3, BR-25 b y c)',
  ]);
  // Y el escritor tampoco tiene cómo escribirlo: una corrida con las dos columnas tira.
  const conLasDos: Traza = [{ mandos: { skayboy: { ...QUIETO, izquierda: true }, poligirl: { ...QUIETO, derecha: true } }, cuadros: 4 }];
  assert.throws(() => escribirTraza(conLasDos), /las dos columnas tienen teclas/);
});

/* =========================================================================================
   Reglas 5 a 8, sobre cada nivel del banco
   ========================================================================================= */

for (const nivel of BANCO.niveles) {
  test(`reglas 5 a 7: ${nivel.id} gana en su último cuadro, a paso fijo, una columna por cuadro, sin vueltas y sin que el que espera se mueva`, () => {
    const traza = trazaDe(nivel);
    const r = exigirTraza(BANCO, nivel, traza, 'uno');
    // Lo que `exigirTraza()` ya miró, dicho otra vez con números, para que el que lea la prueba
    // sepa qué garantiza: el largo de la traza es su duración (CTR-18.5 punto 6).
    assert.ok(r.gana);
    assert.equal(r.cuadros, largoDe(traza));
    assert.equal(r.sobrantes, 0);
    assert.ok(r.maxColumnasConTeclas <= 1);
    assert.deepEqual(r.vueltas, { skayboy: 0, poligirl: 0 });
    assert.equal(r.movimientosDelQueEspera, 0);
    for (const m of expandir(traza)) assert.ok(columnasConTeclas(m).length <= 1);
  });

  test(`regla 8: ${nivel.id} aguanta lo que BR-29 pide a su escalón (${toleranciaMinima(nivel.escalon)} cuadros), medido acá`, () => {
    assert.equal(problemaDeTolerancia(BANCO, nivel, trazaDe(nivel)), null);
  });

  test(`${nivel.id}: el script ve lo mismo que esta prueba`, () => {
    // `resolver-niveles.mjs` decide qué regrabar con `diagnosticar()`: si dijera otra cosa que
    // las reglas de acá, el script dejaría en rojo lo que el test aprueba, o al revés.
    assert.deepEqual(diagnosticar(BANCO, nivel, ARCHIVO.soluciones[nivel.id]?.deUno).problemas, []);
  });
}

/** El primer nivel del banco y su traza, para romperla a mano en los casos de abajo. */
const NIVEL_1 = BANCO.niveles[0];

test('🔴 regla 5: recortada un cuadro al final no gana, y el mensaje nombra el nivel y el comando', () => {
  const renglones = [...(ARCHIVO.soluciones[NIVEL_1.id]?.deUno ?? [])];
  const ultimo = renglones.length - 1;
  renglones[ultimo] = renglones[ultimo].replace(/\d+$/, (n) => String(Number(n) - 1));
  const recortada = leerTraza(NIVEL_1.id, renglones).traza;
  assert.ok(recortada !== null);
  assert.throws(
    () => exigirTraza(BANCO, NIVEL_1, recortada, 'uno'),
    new RegExp(`${NIVEL_1.id} · no gana: después de sus \\d+ cuadros, .*Para regrabarla: node scripts/resolver-niveles\\.mjs --regrabar ${NIVEL_1.id}$`),
  );
  // Y el que se lee en `diagnosticar()`, que es lo que ve el script, es el mismo mensaje.
  assert.match(diagnosticar(BANCO, NIVEL_1, renglones).problemas.join('\n'), /no gana/);
});

test('🔴 regla 5: con un cuadro de más tampoco: gana antes, y recortada seguiría ganando', () => {
  const traza = trazaDe(NIVEL_1);
  const largo = largoDe(traza);
  const conUnoDeMas: Traza = [...traza.slice(0, -1), { ...traza[traza.length - 1], cuadros: traza[traza.length - 1].cuadros + 1 }];
  assert.throws(
    () => exigirTraza(BANCO, NIVEL_1, conUnoDeMas, 'uno'),
    new RegExp(`${NIVEL_1.id} · gana a los ${largo} cuadros y la traza tiene ${largo + 1}: sobra 1\\. Para regrabarla: .*--regrabar ${NIVEL_1.id}$`),
  );
});

test('🔴 regla 6: el que juega vuelve a la entrada y después gana: no es un «así se hace»', () => {
  // Skayboy camina hasta tocar el `C`, que lo devuelve, y desde su entrada igual llega: la física
  // gana. Los cuadros hasta el `C` se cuentan jugando, no se escriben: si alguien afina la
  // velocidad, esta prueba sigue probando lo mismo (ADR-09.4).
  const { banco, nivel } = sala(['############', '#..........#', '#..........#', '#A..1C..2.B#', '############']);
  const hastaElMolinete = crearMundo(banco, nivel);
  let cuadrosHastaVolver = 1;
  while (!paso(hastaElMolinete, corre('skayboy', 'derecha'), CUADRO_SEG).some((s) => s.tipo === 'vuelta')) {
    cuadrosHastaVolver++;
    assert.ok(cuadrosHastaVolver < 120, 'control: caminando a la derecha, Skayboy llega al C');
  }
  const conVuelta = hastaGanar(
    banco,
    nivel,
    [
      { mandos: corre('skayboy', 'derecha'), cuadros: cuadrosHastaVolver },
      { mandos: corre('skayboy', 'izquierda'), cuadros: 90 },
    ],
    corre('poligirl', 'derecha'),
  );
  const r = repetir(banco, nivel, conVuelta);
  assert.ok(r.gana && r.sobrantes === 0, 'control: gana, en el último cuadro');
  assert.equal(r.vueltas.skayboy, 1, 'control: y pasó por una vuelta');
  assert.throws(
    () => exigirTraza(banco, nivel, conVuelta, 'uno'),
    /NIV-PRUEBA · cuadro \d+: skayboy volvió a la entrada\. Para regrabarla: .*--regrabar NIV-PRUEBA$/,
  );
});

test('🔴 regla 7: cambiar de columna con el otro en el aire mueve al que espera', () => {
  // Skayboy salta, y en el aire la persona agarra la columna de Poligirl: él termina de caer
  // mientras ella camina. Después él vuelve a su puerta, y la traza gana igual.
  const traza = hastaGanar(
    BANCO,
    NIVEL_1,
    [
      { mandos: corre('skayboy', 'saltar'), cuadros: 1 },
      { mandos: corre('poligirl', 'derecha'), cuadros: 45 },
    ],
    corre('skayboy', 'izquierda'),
  );
  assert.ok(repetir(BANCO, NIVEL_1, traza).gana, 'control: la traza gana');
  assert.throws(
    () => exigirTraza(BANCO, NIVEL_1, traza, 'uno'),
    new RegExp(`${NIVEL_1.id} · .*cuadro 1: skayboy esperaba y se movió de \\(\\d+(\\.\\d)?, \\d+(\\.\\d)?\\) a .*--regrabar ${NIVEL_1.id}$`),
  );
});

test('🔴 regla 8: la traza más corta no aguanta nada, y el mensaje dice qué borde y cuánto pide BR-29', () => {
  // Es el ejemplo de ADR-09.5 (con la física de hoy, `["s< 39", "p> 39"]`): la más corta suelta
  // cada tecla en el primer cuadro en que ya sirve. Se arma jugando y no escribiendo los 39, para
  // que siga siendo la más corta aunque alguien afine la velocidad: Skayboy camina hasta estar
  // en su puerta, y Poligirl hasta ganar.
  const mundo = crearMundo(BANCO, NIVEL_1);
  let hastaSuPuerta = 0;
  while (!mundo.cuerpos.skayboy.enPuerta) {
    paso(mundo, corre('skayboy', 'izquierda'), CUADRO_SEG);
    hastaSuPuerta++;
    assert.ok(hastaSuPuerta < 600, 'control: caminando a la izquierda, Skayboy llega a su puerta');
  }
  const masCorta = hastaGanar(BANCO, NIVEL_1, [{ mandos: corre('skayboy', 'izquierda'), cuadros: hastaSuPuerta }], corre('poligirl', 'derecha'));
  assert.doesNotThrow(() => exigirTraza(BANCO, NIVEL_1, masCorta, 'uno'), 'control: gana, y en su último cuadro');
  assert.equal(
    problemaDeTolerancia(BANCO, NIVEL_1, masCorta),
    `${NIVEL_1.id} (escalón 1) · el borde del cuadro 0 (skayboy, izquierda, aprieta) aguanta 0 cuadros y BR-29 pide ${toleranciaMinima(1)}. ` +
      `Para regrabarla: ${comandoParaRegrabar(NIVEL_1.id)}`,
  );
});

/**
 * Una traza de `NIV-01` con un margen de `k` cuadros **a mano**: Skayboy camina hasta su puerta
 * y `k` cuadros más contra la pared, y Poligirl hasta ganar. Se arma jugando, como la más corta
 * de arriba, para que la prueba del borde siga siendo la misma si alguien afina la física.
 */
function conMargen(k: number): Traza {
  const mundo = crearMundo(BANCO, NIVEL_1);
  let hastaSuPuerta = 0;
  while (!mundo.cuerpos.skayboy.enPuerta) {
    paso(mundo, corre('skayboy', 'izquierda'), CUADRO_SEG);
    hastaSuPuerta++;
    assert.ok(hastaSuPuerta < 600, 'control: caminando a la izquierda, Skayboy llega a su puerta');
  }
  return hastaGanar(BANCO, NIVEL_1, [{ mandos: corre('skayboy', 'izquierda'), cuadros: hastaSuPuerta + k }], corre('poligirl', 'derecha'));
}

for (const escalon of [1, 2, 3]) {
  test(`🔴 regla 8, en el borde exacto del escalón ${escalon}: un cuadro menos que BR-29 cae, justo lo que pide pasa`, () => {
    /*
     * La traza más corta de arriba aguanta 0, lejos del borde: con ella sola, un `>` en lugar
     * de `>=`, o un mínimo que bajó uno, pasan en verde. Acá se busca, jugando, la primera traza
     * que llega al mínimo del escalón, y la anterior —la que aguanta un cuadro menos— tiene que
     * caer. Con la física de hoy y en Fácil son `s< 49` y `s< 48` (T-267, revisión).
     */
    const nivel: Nivel = { ...NIVEL_1, escalon: escalon as Nivel['escalon'] };
    const minimo = toleranciaMinima(escalon);
    const medir = (t: Traza): number => tolerancia(BANCO, nivel, t, { tope: minimo + 1 }).minimo;
    let k = 0;
    while (medir(conMargen(k)) < minimo) {
      k++;
      assert.ok(k <= TOPE_TOLERANCIA, `control: con ${k} cuadros de margen ya tendría que aguantar ${minimo}`);
    }
    assert.ok(k >= 1, 'control: la más corta no llega, así que hay una traza justo debajo del borde');
    const justo = conMargen(k);
    const unoMenos = conMargen(k - 1);
    assert.equal(medir(unoMenos), minimo - 1, 'control: el borde es filoso —un cuadro de margen es un cuadro de tolerancia—');
    assert.equal(problemaDeTolerancia(BANCO, nivel, justo), null, `${escribirTraza(justo).join(' | ')} aguanta ${minimo}: pasa`);
    assert.match(
      problemaDeTolerancia(BANCO, nivel, unoMenos) ?? '(pasó)',
      new RegExp(`aguanta ${minimo - 1} cuadros y BR-29 pide ${minimo}\\. Para regrabarla: `),
      `${escribirTraza(unoMenos).join(' | ')} aguanta ${minimo - 1}: cae`,
    );
  });
}

test('🔴 los mínimos de soluciones.ts son los de BR-29 punto 3, leídos del documento de producto', () => {
  /*
   * Viven en un solo lugar del código (`CTR-18.11`), pero la fuente es la tabla de `BR-29` y el
   * dueño es `producto`. Esta prueba lee la tabla: bajar un número en `soluciones.ts` —o que
   * producto lo cambie en el documento— se ve en rojo. Si la tabla cambia de forma, el rojo lo dice.
   */
  const prd = readFileSync('Docs/PRODUCTO/PRD-skayboy-y-poligirl.md', 'utf8');
  const br29 = prd.indexOf('## BR-29');
  const desde = prd.indexOf('### 3. La tolerancia mínima por escalón', br29);
  assert.ok(br29 !== -1 && desde !== -1, 'no encontré BR-29 punto 3 en el PRD de Skayboy y Poligirl');
  const hasta = prd.indexOf('\n### ', desde + 1);
  const tabla = prd.slice(desde, hasta === -1 ? undefined : hasta);
  const ESCALON: Readonly<Record<string, number>> = { Fácil: 1, Media: 2, Difícil: 3 };
  const leidos: Record<number, number> = {};
  for (const [, nombre, cuadros] of tabla.matchAll(/^\|\s*\*\*(Fácil|Media|Difícil)\*\*\s*\|[^|\n]*\|\s*\*\*≥\s*(\d+)\s*cuadros\*\*/gm)) {
    leidos[ESCALON[nombre]] = Number(cuadros);
  }
  assert.deepEqual(leidos, { ...TOLERANCIA_MINIMA_CUADROS }, 'la tabla de BR-29 punto 3 y TOLERANCIA_MINIMA_CUADROS no dicen lo mismo');
});

test('el mínimo de BR-29 está para cada escalón, pasa el piso técnico y no sube con la dificultad', () => {
  // Los números son de BR-29 punto 3 y viven en un solo lugar del código (`soluciones.ts`); la
  // prueba de arriba los compara con el documento. Acá se mira la forma que BR-29 promete.
  const escalones = [1, 2, 3];
  assert.deepEqual(Object.keys(TOLERANCIA_MINIMA_CUADROS).map(Number), escalones);
  for (const e of escalones) assert.ok(toleranciaMinima(e) >= PISO_TECNICO_CUADROS, `escalón ${e}: menos de ${PISO_TECNICO_CUADROS} es otro juego en un teléfono lento (ADR-09.1)`);
  assert.ok(toleranciaMinima(1) >= toleranciaMinima(2) && toleranciaMinima(2) >= toleranciaMinima(3), 'Difícil nunca pide más filo que Fácil');
  assert.throws(() => toleranciaMinima(4), /no fija tolerancia para el escalón 4/);
});

/* =========================================================================================
   Salas con piezas, y sus trazas de una persona sola
   ========================================================================================= */

const NADIE: Mandos = { skayboy: QUIETO, poligirl: QUIETO };

/**
 * Una palanca en la columna 7 que manda una compuerta en la 12, delante de la puerta de Poligirl.
 * La puerta de Skayboy queda a la izquierda: el que la activa tiene que volver **saltándola**, o la
 * deja en reposo (`CTR-16.10.2`).
 */
const PALANCA = sala(
  [
    '###############',
    '#.............#',
    '#.............#',
    '#.............#',
    '#...........#.#',
    '#...........|.#',
    '#...........|.#',
    '#A1..../...2|B#',
    '###############',
  ],
  [{ id: 'MEC-01', en: [7, 7], abre: ['COM-01'] }],
  [{ id: 'COM-01', en: [12, 5] }],
);

/**
 * La traza de uno de esa sala, armada jugando: Skayboy cruza la palanca hacia la derecha —abre—,
 * vuelve saltándola y llega a su puerta; después Poligirl pasa por la compuerta hasta la suya.
 */
function trazaDeLaPalanca(): Traza {
  const { banco, nivel } = PALANCA;
  const pasada = cuadrosHasta(banco, nivel, [], corre('skayboy', 'derecha'), (m) => m.cuerpos.skayboy.x + 5 > 7 * TILE + TILE / 2 + 6);
  const ida: Traza = [{ mandos: corre('skayboy', 'derecha'), cuadros: pasada }];
  const salta: Mandos = { skayboy: { ...QUIETO, izquierda: true, saltar: true }, poligirl: QUIETO };
  const vuelo = cuadrosHasta(banco, nivel, ida, salta, (m) => m.cuerpos.skayboy.enSuelo);
  const conSalto: Traza = [...ida, { mandos: salta, cuadros: vuelo }];
  const aSuPuerta = cuadrosHasta(banco, nivel, conSalto, corre('skayboy', 'izquierda'), (m) => m.cuerpos.skayboy.enPuerta);
  return hastaGanar(banco, nivel, [...conSalto, { mandos: corre('skayboy', 'izquierda'), cuadros: aSuPuerta }], corre('poligirl', 'derecha'));
}

/**
 * Una cornisa con una caja en el borde. Empujada, la caja anda una celda y cae dos filas hasta el
 * piso, por la columna 4. Poligirl arranca en la columna 5, fuera de esa columna.
 */
const CORNISA = sala([
  '###############',
  '#.............#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#1.n..........#',
  '####..........#',
  '#....2......AB#',
  '###############',
]);

/** Skayboy camina hasta que la caja arranca, y suelta. */
function empujon(): Traza {
  const { banco, nivel } = CORNISA;
  return [{ mandos: corre('skayboy', 'derecha'), cuadros: cuadrosHasta(banco, nivel, [], corre('skayboy', 'derecha'), (m) => m.cajas[0].estado !== 'quieta') }];
}

/** Después de `antes`: Poligirl a su puerta, y Skayboy —de la cornisa, por arriba de la caja— a la suya. */
function yLosDosASuPuerta(antes: Traza): Traza {
  const { banco, nivel } = CORNISA;
  const poli = cuadrosHasta(banco, nivel, antes, corre('poligirl', 'derecha'), (m) => m.cuerpos.poligirl.enPuerta);
  return hastaGanar(banco, nivel, [...antes, { mandos: corre('poligirl', 'derecha'), cuadros: poli }], corre('skayboy', 'derecha'));
}

/** La de uno de verdad: empuja, espera sin tocar nada a que la caja apoye, y recién ahí agarra la otra columna. */
function trazaDeLaCornisa(): Traza {
  const { banco, nivel } = CORNISA;
  const quieta = cuadrosHasta(banco, nivel, empujon(), NADIE, (m) => m.cajas[0].estado === 'quieta');
  return yLosDosASuPuerta([...empujon(), { mandos: NADIE, cuadros: quieta }]);
}

/* =========================================================================================
   La foto del mundo: la tolerancia repite desde el borde, no desde el cuadro cero
   ========================================================================================= */

/** Todo lo que se mueve del mundo, sala incluida, para comparar dos corridas. */
const estado = (m: Mundo): string =>
  JSON.stringify({
    cuerpos: m.cuerpos,
    juntados: [...m.juntados].sort(),
    palancas: m.palancas,
    placas: m.placas,
    compuertas: m.compuertas,
    cajas: m.cajas,
    tiempo: m.tiempo,
    terminado: m.terminado,
  });

test('🔴 la foto más el resto es la corrida entera (CTR-18.7), en cada borde de cada traza grabada y de dos salas con piezas', () => {
  /*
   * Es la condición que `CTR-18.7` le puso a repetir desde una foto: su propio caso de prueba.
   * Un clon al que le falta un campo del mundo hace que la variante arranque de un estado falso, y
   * eso no se ve en ningún otro lado. Se corta la partida en cada cuadro donde una tecla cambia,
   * se clona, y la copia termina igual que la original. Desde `T-272` el mundo tiene palancas,
   * compuertas y cajas que andan solas: por eso entran la palanca y la cornisa, con una caja que se
   * corta a la mitad de su tramo y de su caída.
   */
  const casos: [string, Banco, Nivel, Traza][] = [
    ...BANCO.niveles.map((nivel): [string, Banco, Nivel, Traza] => [nivel.id, BANCO, nivel, trazaDe(nivel)]),
    ['la palanca', PALANCA.banco, PALANCA.nivel, trazaDeLaPalanca()],
    ['la cornisa', CORNISA.banco, CORNISA.nivel, trazaDeLaCornisa()],
  ];
  for (const [nombre, banco, nivel, traza] of casos) {
    const cuadros = expandir(traza);
    const entera = crearMundo(banco, nivel);
    for (const m of cuadros) paso(entera, m, CUADRO_SEG);
    const cortes = new Set([0, cuadros.length - 1]);
    cuadros.forEach((m, i) => {
      if (i > 0 && JSON.stringify(m) !== JSON.stringify(cuadros[i - 1])) cortes.add(i);
    });
    // Y cuadros sueltos en el medio, para agarrar la caja andando y no solo en los bordes.
    for (let i = 3; i < cuadros.length; i += 7) cortes.add(i);
    for (const corte of cortes) {
      const hasta = crearMundo(banco, nivel);
      for (const m of cuadros.slice(0, corte)) paso(hasta, m, CUADRO_SEG);
      const foto = clonarMundo(hasta);
      for (const m of cuadros.slice(corte)) paso(foto, m, CUADRO_SEG);
      assert.equal(estado(foto), estado(entera), `${nombre}: desde la foto del cuadro ${corte} termina distinto`);
    }
  }
});

test('🔴 clonarMundo no comparte nada que se mueva: jugar la copia no toca el original, ni en una sala con las cuatro piezas', () => {
  const original = crearMundo(BANCO, NIVEL_1);
  const antes = estado(original);
  const copia = clonarMundo(original);
  for (let i = 0; i < 60; i++) paso(copia, { skayboy: { ...QUIETO, izquierda: true }, poligirl: { ...QUIETO, derecha: true } }, CUADRO_SEG);
  assert.ok(copia.juntados.size > 0, 'control: la copia juntó tesoros y se movió');
  assert.equal(estado(original), antes);

  // La sala de CTR-16.10.1: en la copia, Poligirl empuja la caja a la placa y la compuerta se abre.
  const ejemplo = sala(
    ['###############', '#......#...#..#', '#......#...#..#', '#......#...#..#', '#......#...#..#', '#......|...|..#', '#......|...|..#', '#1.2n=.|./.|AB#', '###############'],
    [
      { id: 'MEC-01', en: [5, 7], abre: ['COM-01'] },
      { id: 'MEC-02', en: [9, 7], abre: ['COM-02'] },
    ],
    [
      { id: 'COM-01', en: [7, 5] },
      { id: 'COM-02', en: [11, 5] },
    ],
  );
  const conPiezas = crearMundo(ejemplo.banco, ejemplo.nivel);
  const sinTocar = estado(conPiezas);
  const jugada = clonarMundo(conPiezas);
  for (let i = 0; i < 40; i++) paso(jugada, corre('poligirl', 'derecha'), CUADRO_SEG);
  assert.ok(jugada.cajas[0].x > conPiezas.cajas[0].x && jugada.compuertas[0].abierta, 'control: en la copia la caja anduvo y la compuerta se abrió');
  assert.equal(estado(conPiezas), sinTocar, 'el original no se enteró de nada');

  // Y ningún objeto de adentro es el mismo, salvo el banco y el nivel, que no cambian nunca.
  for (const mundo of [original, jugada]) {
    const mismos: string[] = [];
    const recorrer = (a: unknown, b: unknown, ruta: string): void => {
      if (typeof a !== 'object' || a === null) return;
      if (a === b) mismos.push(ruta);
      for (const k of Object.keys(a)) recorrer((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${ruta}.${k}`);
    };
    const otra = clonarMundo(mundo);
    for (const k of Object.keys(mundo) as (keyof Mundo)[]) {
      if (k === 'banco' || k === 'nivel') continue;
      recorrer(mundo[k], otra[k], k);
    }
    assert.deepEqual(mismos, []);
  }
});

test('🔴 regla 7, eje por eje: el que espera se movió si cambió x, si cambió y, o las dos', () => {
  // En el mundo de hoy nadie se corre solo en x esperando (ver `seMovio()`), así que ninguna traza
  // pone este eje en rojo: se prueba la comparación sola, cada eje por separado.
  const quieto = { x: 40.5, y: 108 };
  assert.equal(seMovio(quieto.x, quieto.y, { ...quieto }), false, 'control: en el mismo lugar no se movió');
  assert.equal(seMovio(quieto.x, quieto.y, { x: quieto.x + 0.5, y: quieto.y }), true, 'solo en x');
  assert.equal(seMovio(quieto.x, quieto.y, { x: quieto.x, y: quieto.y - 0.5 }), true, 'solo en y');
  assert.equal(seMovio(quieto.x, quieto.y, { x: quieto.x - 1, y: quieto.y + 1 }), true, 'en los dos');
  // Y es `===`, no "cerca": una fracción de píxel es un cuerpo que se movió.
  assert.equal(seMovio(quieto.x, quieto.y, { x: quieto.x + 1e-9, y: quieto.y }), true, 'una fracción también');
});

test('🔴 mismoFuturo mira cada campo que decide el futuro, uno por uno, y la prueba conoce todos los campos', () => {
  /*
   * En una partida los campos se mueven juntos, y sacar una sola comparación de `mismoFuturo()`
   * no cambia ninguna tolerancia medida —ni en `NIV-01`, ni en el hueco que salta de
   * `solucionador.test.ts`—: se probó en copias, campo por campo (T-267, revisión). Por eso se
   * prueba acá la comparación sola: dos mundos iguales salvo un campo no tienen el mismo futuro.
   */
  const deciden = ['x', 'y', 'vy', 'enSuelo', 'desdeElSuelo', 'saltoGuardado', 'saltoApretado', 'yaSalto'] as const;
  const noDeciden = ['id', 'vx', 'mira', 'conDedo', 'enPuerta'];
  const base = crearMundo(BANCO, NIVEL_1);
  for (let i = 0; i < 10; i++) paso(base, corre('skayboy', 'saltar'), CUADRO_SEG);
  assert.equal(mismoFuturo(base, clonarMundo(base)), true, 'control: la copia tiene el mismo futuro');
  assert.deepEqual(
    Object.keys(base.cuerpos.skayboy).sort(),
    [...deciden, ...noDeciden].sort(),
    'mundo.ts sumó un campo al cuerpo: decidí si mismoFuturo() lo tiene que mirar, y sumalo acá',
  );
  for (const id of ['skayboy', 'poligirl'] as const) {
    for (const campo of deciden) {
      const otro = clonarMundo(base);
      const c = otro.cuerpos[id] as unknown as Record<string, number | boolean>;
      c[campo] = typeof c[campo] === 'boolean' ? !c[campo] : (c[campo] as number) + 0.25;
      assert.equal(mismoFuturo(base, otro), false, `${id}.${campo} distinto y mismoFuturo() dice que sí`);
    }
  }
  const terminado = clonarMundo(base);
  terminado.terminado = true;
  assert.equal(mismoFuturo(base, terminado), false, 'terminado distinto');
});

test('🔴 mismoFuturo mira la sala: una palanca, una placa, una compuerta o una caja distinta no es el mismo futuro', () => {
  /*
   * `mismoFuturo()` compara la sala con `claveDeMecanismos()`, que es exacta. Si le faltara una
   * pieza, la tolerancia cortaría una variante que todavía no volvió al camino —una compuerta
   * cerrada en la variante y abierta en la original— y mediría de más. Se prueba campo por campo,
   * igual que los del cuerpo. Y lo único que no decide nada, la `espera` del último cuadro, no
   * cuenta.
   */
  const { banco, nivel } = CORNISA;
  const base = crearMundo(banco, nivel);
  for (const m of expandir(empujon())) paso(base, m, CUADRO_SEG);
  const conPalanca = crearMundo(PALANCA.banco, PALANCA.nivel);
  assert.equal(mismoFuturo(base, clonarMundo(base)), true, 'control: la copia tiene el mismo futuro');
  const cambios: [string, Mundo, (m: Mundo) => void][] = [
    ['la palanca', conPalanca, (m) => (m.palancas[0].activa = true)],
    ['la compuerta', conPalanca, (m) => (m.compuertas[0].abierta = true)],
    ['la x de la caja', base, (m) => (m.cajas[0].x += 0.25)],
    ['la y de la caja', base, (m) => (m.cajas[0].y += 0.25)],
    ['el estado de la caja', base, (m) => (m.cajas[0].estado = 'quieta')],
    ['la columna de la caja', base, (m) => (m.cajas[0].columna += 1)],
    ['la fila de la caja', base, (m) => (m.cajas[0].fila -= 1)],
    ['la velocidad de la caja', base, (m) => (m.cajas[0].vy += 1)],
    ['para dónde anda la caja', base, (m) => (m.cajas[0].direccion = -1)],
    ['quién empujó la caja', base, (m) => (m.cajas[0].empujadaPor = 'poligirl')],
  ];
  for (const [que, mundo, cambiar] of cambios) {
    const otro = clonarMundo(mundo);
    cambiar(otro);
    assert.equal(mismoFuturo(mundo, otro), false, `${que} distinta y mismoFuturo() dice que sí`);
  }
  const placa = sala(
    ['###############', '#.............#', '#.............#', '#.............#', '#.......#.....#', '#.......|.....#', '#.......|.....#', '#A1=..2.|....B#', '###############'],
    [{ id: 'MEC-01', en: [3, 7], abre: ['COM-01'] }],
    [{ id: 'COM-01', en: [8, 5] }],
  );
  const conPlaca = crearMundo(placa.banco, placa.nivel);
  const pisada = clonarMundo(conPlaca);
  pisada.placas[0].pisada = true;
  assert.equal(mismoFuturo(conPlaca, pisada), false, 'la placa distinta y mismoFuturo() dice que sí');
  const esperando = clonarMundo(base);
  esperando.cajas[0].espera = { quien: 'poligirl', donde: 'arriba' };
  assert.equal(mismoFuturo(base, esperando), true, 'la espera dice qué pasó, no qué va a pasar');
});

test('el atajo de la tolerancia no cambia ningún número: cada traza grabada y las de las salas con piezas, medidas con y sin él', () => {
  /*
   * La variante se corta apenas vuelve exactamente al estado de la original, porque de ahí en
   * adelante juega lo mismo. Es lo que hace barato ensanchar una traza; si alguna vez el atajo
   * se equivoca —un mecanismo que `claveDeMecanismos()` no mira, por ejemplo—, acá se ve.
   */
  for (const nivel of BANCO.niveles) {
    const traza = trazaDe(nivel);
    const tope = toleranciaMinima(nivel.escalon);
    assert.deepEqual(tolerancia(BANCO, nivel, traza, { tope }), tolerancia(BANCO, nivel, traza, { tope, atajo: false }), nivel.id);
  }
  for (const [nombre, { banco, nivel }, traza] of [
    ['la palanca', PALANCA, trazaDeLaPalanca()],
    ['la cornisa', CORNISA, trazaDeLaCornisa()],
  ] as const) {
    assert.deepEqual(tolerancia(banco, nivel, traza, { tope: 8 }), tolerancia(banco, nivel, traza, { tope: 8, atajo: false }), nombre);
  }
});

/* =========================================================================================
   Regla 9: la paridad
   ========================================================================================= */

test('regla 9: la paridad del banco, sobre las trazas grabadas, tiene diferencia ≤ 1 (BR-23.1)', () => {
  const pares = BANCO.niveles.map((nivel) => repetir(BANCO, nivel, trazaDe(nivel)).paridad);
  const total = sumarParidad(pares);
  assert.equal(problemaDeParidad(total), null, `${total.skayboyAPoligirl} contra ${total.poligirlASkayboy}`);
});

test('🔴 regla 9: cuatro contra uno no pasa, y el mensaje cita BR-23.1', () => {
  assert.equal(
    problemaDeParidad({ skayboyAPoligirl: 1, poligirlASkayboy: 4 }),
    'paridad: Poligirl le abre paso a Skayboy 4 veces y Skayboy a Poligirl 1 vez; BR-23.1 pide diferencia ≤ 1',
  );
  // Control: con uno de diferencia, pasa; sobre el banco se suma nivel por nivel.
  assert.equal(problemaDeParidad({ skayboyAPoligirl: 3, poligirlASkayboy: 2 }), null);
  assert.deepEqual(
    sumarParidad([
      { skayboyAPoligirl: 1, poligirlASkayboy: 0 },
      { skayboyAPoligirl: 0, poligirlASkayboy: 1 },
      { skayboyAPoligirl: 1, poligirlASkayboy: 1 },
    ]),
    { skayboyAPoligirl: 2, poligirlASkayboy: 2 },
  );
});

test('regla 9, con el suceso de verdad: el que cruza la palanca le abre paso al otro, y la cuenta lo ve (CTR-18.8)', () => {
  /*
   * Desde `T-272` el mundo emite el suceso `compuerta` de `CTR-16.10.7`, y `repetir()` se lo pasa
   * a la cuenta. En la sala de la palanca, Skayboy la cruza hacia la derecha —la compuerta se abre
   * a su nombre—, vuelve saltándola, y Poligirl pasa: *Skayboy le abrió paso a Poligirl*, una vez.
   */
  const { banco, nivel } = PALANCA;
  const traza = trazaDeLaPalanca();
  const r = exigirTraza(banco, nivel, traza, 'uno');
  assert.ok(r.sucesos.saltos.skayboy >= 1, 'control: volvió saltando la palanca');
  assert.deepEqual(r.paridad, { skayboyAPoligirl: 1, poligirlASkayboy: 0 });
  // Control: el mismo camino sin saltar —vuelve caminando— deja la palanca en reposo, la compuerta
  // se cierra, y Poligirl no llega: la cuenta no inventa un paso que no hubo.
  const caminando = traza.map((c) => (c.mandos.skayboy.saltar ? { mandos: corre('skayboy', 'izquierda'), cuadros: c.cuadros } : c));
  const sinSalto = repetir(banco, nivel, caminando);
  assert.equal(sinSalto.gana, false, 'control: con la palanca en reposo, Poligirl no pasa');
  assert.deepEqual(sinSalto.paridad, { skayboyAPoligirl: 0, poligirlASkayboy: 0 });
});

/*
 * La cuenta, con un mundo de juguete: cuadros armados a mano, para ver cada caso que el mundo de
 * verdad tarda en armar. Una compuerta en la columna 7, de la fila 5 a la 7, y los cuerpos pasando
 * por el piso de la fila 8. La misma cuenta es la que `repetir()` alimenta con los sucesos del
 * mundo desde `T-272` (la prueba de arriba).
 */
const COMPUERTA: TramoDeCompuerta = { id: 'COM-01', columna: 7, desdeFila: 5, hastaFila: 7 };
/** La `y` de un cuerpo parado en el piso de la fila 8: la caja toca las filas 6 y 7. */
const EN_EL_PISO = 8 * TILE - 20;
/** La `y` de uno que camina por arriba del sólido que corona la compuerta (fila 4). */
const POR_ARRIBA = 4 * TILE - 20;

function posicionesCon(quien: IdPersonaje, x: number, y: number, otro = { x: 16, y: EN_EL_PISO }): Posiciones {
  return quien === 'skayboy' ? { skayboy: { x, y }, poligirl: otro } : { skayboy: otro, poligirl: { x, y } };
}

/** Un cuadro en que `quien` camina de `x0` a `x1` a la altura `y`, con esos sucesos. */
function cruza(quien: IdPersonaje, x0: number, x1: number, y = EN_EL_PISO, sucesos: SucesoLeido[] = []) {
  return { sucesos, antes: posicionesCon(quien, x0, y), despues: posicionesCon(quien, x1, y) };
}

const abre = (por: IdPersonaje | null): SucesoLeido => ({ tipo: 'compuerta', id: COMPUERTA.id, abierta: true, por });
const cierra: SucesoLeido = { tipo: 'compuerta', id: COMPUERTA.id, abierta: false, por: null };

/** El centro de la caja de colisión sobre el centro de la columna 7 (x = 120): x = 115. */
const IZQ = 110;
const DER = 121;

function contar(cuadros: ReturnType<typeof cruza>[]) {
  const cuenta = nuevaCuentaDeParidad([COMPUERTA]);
  for (const c of cuadros) cuenta.cuadro(c.sucesos, c.antes, c.despues);
  return cuenta.paridad();
}

test('la paridad, en un mundo de juguete: B cruza lo que A abrió, y suma una vez por apertura', () => {
  assert.deepEqual(
    contar([
      cruza('poligirl', IZQ - 2, IZQ, EN_EL_PISO, [abre('skayboy')]),
      cruza('poligirl', IZQ, DER),
      cruza('poligirl', DER, IZQ),
      cruza('poligirl', IZQ, DER),
      cruza('poligirl', DER, DER + 20, EN_EL_PISO, [cierra]),
    ]),
    { skayboyAPoligirl: 1, poligirlASkayboy: 0 },
    'tres cruces antes del cierre son una apertura: suma uno',
  );
  assert.deepEqual(
    contar([
      cruza('skayboy', DER + 2, DER, EN_EL_PISO, [abre('poligirl')]),
      cruza('skayboy', DER, IZQ),
      cruza('skayboy', IZQ, IZQ - 20, EN_EL_PISO, [cierra]),
      cruza('skayboy', IZQ - 20, IZQ, EN_EL_PISO, [abre('poligirl')]),
      cruza('skayboy', IZQ, DER),
    ]),
    { skayboyAPoligirl: 0, poligirlASkayboy: 2 },
    'cerrada y vuelta a abrir, es otra apertura: suma otra vez',
  );
});

test('🔴 la paridad no cuenta lo que no es abrirle paso al otro', () => {
  const nada = { skayboyAPoligirl: 0, poligirlASkayboy: 0 };
  assert.deepEqual(contar([cruza('skayboy', IZQ, IZQ, EN_EL_PISO, [abre('skayboy')]), cruza('skayboy', IZQ, DER)]), nada, 'la apertura propia');
  assert.deepEqual(contar([cruza('poligirl', IZQ, IZQ, EN_EL_PISO, [abre(null)]), cruza('poligirl', IZQ, DER)]), nada, 'la de por: null');
  assert.deepEqual(contar([cruza('poligirl', IZQ, DER)]), nada, 'cruzar sin ninguna apertura (la compuerta abierta sin suceso no existe)');
  assert.deepEqual(
    contar([cruza('poligirl', IZQ, IZQ, POR_ARRIBA, [abre('skayboy')]), cruza('poligirl', IZQ, DER, POR_ARRIBA)]),
    nada,
    'el que camina por arriba del sólido que corona la compuerta no la cruzó',
  );
  assert.deepEqual(
    contar([
      cruza('poligirl', IZQ, IZQ, EN_EL_PISO, [abre('skayboy')]),
      cruza('poligirl', IZQ, DER, EN_EL_PISO, [{ tipo: 'vuelta', quien: 'poligirl' }]),
    ]),
    nada,
    'una vuelta a la entrada cambia de lugar de una: no recorre nada, no cruza nada',
  );
  assert.deepEqual(
    contar([
      cruza('poligirl', IZQ, IZQ, EN_EL_PISO, [abre('skayboy')]),
      cruza('poligirl', IZQ, IZQ + 2, EN_EL_PISO, [cierra]),
      cruza('poligirl', IZQ + 2, DER),
    ]),
    nada,
    'cruzar después del cierre',
  );
  // Control: el mismo cruce, con la apertura del otro abierta, sí suma.
  assert.deepEqual(contar([cruza('poligirl', IZQ, IZQ, EN_EL_PISO, [abre('skayboy')]), cruza('poligirl', IZQ, DER)]), {
    skayboyAPoligirl: 1,
    poligirlASkayboy: 0,
  });
});

test('la paridad no pierde un cruce que se detiene justo sobre el centro de la columna', () => {
  // El centro del cuerpo queda exacto sobre el de la columna al final de un cuadro, y cruza en el
  // siguiente: el lado se recuerda entre cuadros.
  const centro = 7 * TILE + TILE / 2 - 5;
  assert.deepEqual(
    contar([
      cruza('poligirl', IZQ, IZQ, EN_EL_PISO, [abre('skayboy')]),
      cruza('poligirl', IZQ, centro),
      cruza('poligirl', centro, DER),
    ]),
    { skayboyAPoligirl: 1, poligirlASkayboy: 0 },
  );
});

test('los tramos de compuerta se leen de la grilla, con el id de su celda de arriba', () => {
  // El banco de hoy no trae ningún tramo (`NIV-01` no tiene compuertas), y su paridad es cero a cero.
  for (const nivel of BANCO.niveles) assert.deepEqual(tramosDeCompuertas(BANCO, nivel), [], nivel.id);

  // Con la forma de CTR-16.10.1 y la leyenda de verdad (`|` es compuerta desde T-272): un tramo de
  // tres celdas en la columna 7 y uno de dos en la 11.
  const { banco, nivel } = sala(
    ['###############', '#......#...#..#', '#......#...#..#', '#......#...#..#', '#......#...#..#', '#......|...#..#', '#......|...|..#', '#1.2...|...|AB#', '###############'],
    [],
    [
      { id: 'COM-01', en: [7, 5] },
      { id: 'COM-02', en: [11, 6] },
    ],
  );
  assert.deepEqual(tramosDeCompuertas(banco, nivel), [
    { id: 'COM-01', columna: 7, desdeFila: 5, hastaFila: 7 },
    { id: 'COM-02', columna: 11, desdeFila: 6, hastaFila: 7 },
  ]);
  // Y son las compuertas del mundo, con el mismo id y el mismo tramo, cerradas al empezar.
  assert.deepEqual(
    crearMundo(banco, nivel).compuertas,
    tramosDeCompuertas(banco, nivel).map((t) => ({ ...t, abierta: false })),
  );
});

/* =========================================================================================
   Regla 10: nada de esto llega al navegador
   ========================================================================================= */

/** Lo que no puede nombrar ninguna página ni ninguna isla (`CTR-18.11`). */
const NO_VIAJA = /skayboy-soluciones|solucionador|skayboy\/soluciones/;

function archivosDe(carpeta: string): string[] {
  return readdirSync(carpeta).flatMap((nombre) => {
    const ruta = join(carpeta, nombre);
    return statSync(ruta).isDirectory() ? archivosDe(ruta) : [ruta];
  });
}

test('regla 10: ninguna página, isla, componente ni plantilla nombra las trazas ni el solucionador', () => {
  const lugares = ['src/pages', 'src/scripts', 'src/components', 'src/layouts'];
  const archivos = lugares.flatMap(archivosDe);
  assert.ok(archivos.some((a) => a.endsWith('partida-skayboy.ts')), 'control: la isla del juego está entre los que se miran');
  const nombran = archivos.filter((a) => NO_VIAJA.test(readFileSync(a, 'utf-8')));
  assert.deepEqual(nombran, [], `la traza no viaja al teléfono (ADR-09.2), y esto la nombra:\n${nombran.join('\n')}`);
});

test('🔴 regla 10: sabe encontrar las tres maneras de traerla', () => {
  for (const fuente of [
    "import soluciones from '../../data/skayboy-soluciones.json';",
    "import { resolverSolo } from '../lib/skayboy/solucionador.ts';",
    "import { repetir } from '../lib/skayboy/soluciones.ts';",
  ]) {
    assert.match(fuente, NO_VIAJA);
  }
  assert.doesNotMatch("import { paso } from '../lib/skayboy/mundo.ts';", NO_VIAJA, 'control: el mundo sí viaja');
});

/* =========================================================================================
   Regla 11: las cajas no corren carreras
   ========================================================================================= */

/*
 * La regla 11 de `CTR-18.6`, las dos mitades (`CTR-16.10.5`, `CTR-16.10.11`): en ningún cuadro de
 * la traza de uno una caja espera a alguien, y al agarrar la otra columna ninguna caja anda. Se
 * encendió con `T-272`, que es la que trajo las cajas; el banco de hoy no tiene ninguna, y por eso
 * las pruebas de abajo juegan la cornisa de arriba: una caja que se empuja, anda una celda y cae.
 */

for (const nivel of BANCO.niveles) {
  test(`regla 11: ${nivel.id}, ninguna caja espera a nadie y ninguna anda al cambiar de columna`, () => {
    const r = repetir(BANCO, nivel, trazaDe(nivel));
    assert.equal(r.cuadrosConCajaEnEspera, 0);
    assert.equal(r.cambiosConCajaAndando, 0);
  });
}

test('regla 11, control: la traza de la cornisa espera sin tocar nada a que la caja apoye, y es de uno', () => {
  const { banco, nivel } = CORNISA;
  const r = exigirTraza(banco, nivel, trazaDeLaCornisa(), 'uno');
  assert.equal(r.cambiosDeColumna, 2, 'control: Skayboy, Poligirl, Skayboy');
  assert.deepEqual([r.cuadrosConCajaEnEspera, r.cambiosConCajaAndando], [0, 0]);
});

test('🔴 regla 11: agarrar la otra columna con la caja todavía andando no es de uno, y el mensaje dice de quién es la caja', () => {
  // Empuja y suelta, y el pulgar se va a la otra columna mientras la caja anda. Poligirl camina para
  // el otro lado, así que la caja no espera a nadie: la única falta es el cambio de columna.
  const { banco, nivel } = CORNISA;
  const traza = yLosDosASuPuerta(empujon());
  const r = repetir(banco, nivel, traza);
  assert.ok(r.gana && r.sobrantes === 0, 'control: gana, en su último cuadro');
  assert.equal(r.cuadrosConCajaEnEspera, 0, 'control: la caja no esperó a nadie');
  assert.throws(
    () => exigirTraza(banco, nivel, traza, 'uno'),
    (e: Error) =>
      /NIV-PRUEBA · cuadro \d+: poligirl agarra su columna y la caja que empujó skayboy todavía anda \(CTR-16\.10\.11\)\. Para regrabarla: .*--regrabar NIV-PRUEBA$/.test(e.message) &&
      !/espera|no gana|volvió|dos columnas|esperaba y se movió|en el aire/.test(e.message),
  );
});

test('🔴 regla 11: una caja que espera arriba de alguien es una carrera, y la traza de uno no pasa por ninguna', () => {
  // Lo mismo, pero Poligirl se mete en la columna por la que cae la caja y se queda ahí, sin que
  // nadie toque nada, hasta que la caja le apoya en la cabeza. Después sale, y la caja termina.
  const { banco, nivel } = CORNISA;
  const antes = empujon();
  const hastaLaColumna = cuadrosHasta(banco, nivel, antes, corre('poligirl', 'izquierda'), (m) => m.cuerpos.poligirl.x < 4 * TILE + 10);
  const debajo: Traza = [...antes, { mandos: corre('poligirl', 'izquierda'), cuadros: hastaLaColumna }];
  const apoya = cuadrosHasta(banco, nivel, debajo, NADIE, (m) => m.cajas[0].espera !== null);
  const traza = yLosDosASuPuerta([...debajo, { mandos: NADIE, cuadros: apoya + 10 }]);
  const r = repetir(banco, nivel, traza);
  assert.ok(r.gana && r.sobrantes === 0, 'control: gana, en su último cuadro');
  assert.ok(r.cuadrosConCajaEnEspera > 10, `control: la caja esperó (${r.cuadrosConCajaEnEspera} cuadros)`);
  assert.equal(r.movimientosDelQueEspera, 0, 'control: el que esperaba no se movió');
  assert.throws(
    () => exigirTraza(banco, nivel, traza, 'uno'),
    /NIV-PRUEBA · .*cuadro \d+: una caja espera arriba de poligirl \(y espera en \d+ cuadro\(s\) más\): es una carrera, y la traza de uno no pasa por ninguna \(CTR-16\.10\.5\)/,
  );
});

/* =========================================================================================
   Lo que el módulo no puede tener adentro
   ========================================================================================= */

const FUENTE = readFileSync(new URL('./soluciones.ts', import.meta.url), 'utf8');

test('🔴 soluciones.ts importa solo mundo.ts y niveles.ts: ni node:*, ni motor, ni DOM, ni azar (CTR-18.11)', () => {
  const importaciones = (FUENTE.match(/from\s+'[^']+'/g) ?? []).map((l) => l.replace(/from\s+/, ''));
  assert.deepEqual(importaciones, ["'./mundo.ts'", "'./niveles.ts'"]);
  for (const prohibida of ['import(', 'require(', 'kaplay', 'document.', 'window.', 'Date.now', 'performance.now', 'Math.random']) {
    assert.ok(!FUENTE.includes(prohibida), `usa ${prohibida}: el módulo de las trazas es puro`);
  }
});

test('🔴 el vocabulario del fallo no entra ni en el módulo ni en esta prueba', () => {
  // Partidas a propósito, como en `mundo.test.ts`: la barredora corre sobre la carpeta entera.
  const prohibidas = ['vi' + 'da', 'muer' + 'te', 'mo' + 'riste', 'per' + 'diste', 'game' + ' over', 'le' + 'tal', 'ma' + 'ta('];
  const prueba = readFileSync(new URL('./soluciones.test.ts', import.meta.url), 'utf8');
  for (const [nombre, texto] of [['soluciones.ts', FUENTE], ['soluciones.test.ts', prueba]] as const) {
    for (const palabra of prohibidas) {
      assert.ok(!texto.toLowerCase().includes(palabra), `entró «${palabra}» en ${nombre}: acá el fracaso devuelve a la entrada y nada más`);
    }
  }
});
