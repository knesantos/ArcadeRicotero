/**
 * Las reglas del banco que el schema no puede correr (`CTR-16.10.10`, `T-272`): `E1` a `E6` y
 * `E8`, las de `problemasDelBanco()` en `niveles.ts`.
 *
 * Todas miran una celda vecina o cruzan la grilla con un arreglo, que es justo lo que JSON Schema
 * no sabe hacer: que cada mecanismo esté sobre una palanca o una placa, que cada tramo de
 * compuerta tenga su nombre y alguien que la abra, que todo esté apoyado, que en Difícil no entre
 * nada nuevo, y que **cada entrada tenga dónde pararse** (`CTR-16.5` regla 3). `E7` —cielo e
 * infierno— es de la leyenda y vive en `esquemas.test.ts`, con los tres molinetes.
 *
 * **Cómo está armado.** Una sala sana —el ejemplo de `CTR-16.10.1`, que trae las cuatro piezas—
 * y, por cada regla, la misma sala rota en un solo lugar. El rojo se busca por el número de la
 * regla y por lo que tiene que nombrar el mensaje: el nivel, la celda y lo que hay al lado. Una
 * guarda que nunca se vio en rojo no es una guarda, y un mensaje que no dice dónde no le sirve al
 * que dibuja.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { problemasDelBanco, type Banco, type CompuertaDelNivel, type MecanismoDelNivel, type Nivel } from './niveles.ts';

const BANCO: Banco = JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as Banco;

/** El ejemplo de `CTR-16.10.1`, tal como está en el contrato: válido contra el schema y contra estas reglas. */
const GRILLA = [
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
const MECANISMOS: readonly MecanismoDelNivel[] = [
  { id: 'MEC-01', en: [5, 7], abre: ['COM-01'] },
  { id: 'MEC-02', en: [9, 7], abre: ['COM-02'] },
];
const COMPUERTAS: readonly CompuertaDelNivel[] = [
  { id: 'COM-01', en: [7, 5] },
  { id: 'COM-02', en: [11, 5] },
];

function nivel(cambios: Partial<Nivel> = {}): Nivel {
  return {
    id: 'NIV-03',
    nombre: '',
    escalon: 2,
    estado: 'borrador',
    grilla: GRILLA,
    mecanismos: MECANISMOS,
    compuertas: COMPUERTAS,
    verificaciones: { deDos: false },
    ...cambios,
  };
}

const problemas = (...niveles: Nivel[]): readonly string[] => problemasDelBanco({ ...BANCO, niveles });

/** La grilla con un caracter cambiado. */
function conCelda(grilla: readonly string[], columna: number, fila: number, caracter: string): string[] {
  return grilla.map((renglon, f) => (f === fila ? renglon.slice(0, columna) + caracter + renglon.slice(columna + 1) : renglon));
}

/** Que algún problema nombre la regla —sola, `(E4)`, o con su origen, `(CTR-16.5 regla 3, E8)`— y lleve todo lo que tiene que llevar. */
function cae(lista: readonly string[], regla: string, ...tiene: string[]): void {
  assert.ok(
    lista.some((p) => new RegExp(`[(, ]${regla}\\)$`).test(p) && tiene.every((t) => p.includes(t))),
    `tenía que caer por ${regla} nombrando ${tiene.join(', ')}, y dijo:\n${lista.join('\n') || '(nada)'}`,
  );
}

test('control: el ejemplo de CTR-16.10.1 es un nivel sano, y el banco de verdad también', () => {
  assert.deepEqual(problemas(nivel()), []);
  assert.deepEqual(problemasDelBanco(BANCO), []);
});

test('🔴 E1: un mecanismo que no está sobre una palanca o una placa, y una pieza sin mecanismo o con dos', () => {
  const corrido = problemas(nivel({ mecanismos: [{ ...MECANISMOS[0], en: [6, 7] }, MECANISMOS[1]] }));
  cae(corrido, 'E1', 'NIV-03', 'MEC-01', '[6, 7]', '«.» (aire)');
  cae(corrido, 'E1', 'la placa de [5, 7] tiene 0 mecanismos');
  const doble = problemas(nivel({ mecanismos: [...MECANISMOS, { id: 'MEC-03', en: [5, 7], abre: ['COM-01'] }] }));
  cae(doble, 'E1', 'la placa de [5, 7] tiene 2 mecanismos');
});

test('🔴 E2: un tramo sin su nombre, y un nombre que no apunta a la celda de arriba de un tramo', () => {
  const sinNombre = problemas(nivel({ compuertas: [COMPUERTAS[0]], mecanismos: [MECANISMOS[0], { ...MECANISMOS[1], abre: ['COM-01'] }] }));
  cae(sinNombre, 'E2', 'columna 11', 'filas 5 a 7', 'tiene 0 entradas');
  const alMedio = problemas(nivel({ compuertas: [{ id: 'COM-01', en: [7, 6] }, COMPUERTAS[1]] }));
  cae(alMedio, 'E2', 'COM-01 apunta a [7, 6]', '«|» (compuerta)', 'no es la celda de arriba');
});

test('🔴 E3: ids repetidos, un «abre» que nombra una compuerta que no es del nivel, y una compuerta que no abre nadie', () => {
  cae(problemas(nivel({ mecanismos: [MECANISMOS[0], { ...MECANISMOS[1], id: 'MEC-01' }] })), 'E3', 'MEC-01 está dos veces en «mecanismos»');
  cae(problemas(nivel({ compuertas: [COMPUERTAS[0], { ...COMPUERTAS[1], id: 'COM-01' }] })), 'E3', 'COM-01 está dos veces en «compuertas»');
  const aOtra = problemas(nivel({ mecanismos: [{ ...MECANISMOS[0], abre: ['COM-09'] }, MECANISMOS[1]] }));
  cae(aOtra, 'E3', 'MEC-01 abre COM-09', 'que no es una compuerta de este nivel');
  cae(aOtra, 'E3', 'COM-01 no la abre ningún mecanismo');
});

test('🔴 E4: la compuerta va de sólido a sólido, y la palanca y la placa tienen sólido abajo', () => {
  cae(problemas(nivel({ grilla: conCelda(GRILLA, 7, 4, '.') })), 'E4', 'arriba del tramo de compuerta de [7, 5]', '«.» (aire)');
  // Una palanca y una placa en el aire, sobre un hueco del piso que las deja sin apoyo.
  const colgada = conCelda(conCelda(GRILLA, 9, 8, '.'), 5, 8, '.');
  const sinApoyo = problemas(nivel({ grilla: colgada }));
  cae(sinApoyo, 'E4', 'abajo de la palanca de [9, 7]', '«.» (aire)');
  cae(sinApoyo, 'E4', 'abajo de la placa de [5, 7]', '«.» (aire)');
  // Y abajo del tramo: la compuerta de la columna 7 sobre un hueco.
  cae(problemas(nivel({ grilla: conCelda(GRILLA, 7, 8, '.') })), 'E4', 'abajo del tramo de compuerta de [7, 7]');
});

test('🔴 E5: una caja que arranca en el aire; apoyada en otra caja, sí', () => {
  const alta = conCelda(conCelda(GRILLA, 4, 7, '.'), 4, 6, 'n');
  cae(problemas(nivel({ grilla: alta })), 'E5', 'la caja de [4, 6] arranca en el aire', '«.» (aire)');
  // Control: la misma, con otra caja abajo.
  assert.deepEqual(problemas(nivel({ grilla: conCelda(GRILLA, 4, 6, 'n') })), []);
});

test('🔴 E6: en Difícil no entra nada que no haya aparecido en un escalón menor', () => {
  const facil: Nivel = { ...BANCO.niveles[0], id: 'NIV-01' };
  const dificil = nivel({ id: 'NIV-05', escalon: 3 });
  const solos = problemas(facil, dificil);
  for (const tipo of ['palanca', 'placa', 'compuerta', 'caja']) cae(solos, 'E6', 'NIV-05 (escalón 3)', `«${tipo}»`);
  // Control: con un nivel Medio que ya los enseñó, el Difícil puede combinarlos.
  assert.deepEqual(problemas(facil, nivel({ id: 'NIV-03', escalon: 2 }), dificil), []);
});

/**
 * `E8`, que es la regla 3 de `CTR-16.5`. Los rojos que pide el contrato: la sala `FLOTA_POLIGIRL`
 * de `solucionador.test.ts` —copiada acá tal cual, porque un archivo de prueba no importa otro— y
 * una entrada con su molinete propio abajo.
 */
const FLOTA_POLIGIRL = [
  '###############',
  '#.............#',
  '#.............#',
  '#.......2.....#',
  '#.............#',
  '#.............#',
  '#.............#',
  '#A....1......B#',
  '###############',
];

test('🔴 E8: cada entrada tiene dónde pararse: abajo sólido o el borde', () => {
  cae(problemas(nivel({ grilla: FLOTA_POLIGIRL, mecanismos: [], compuertas: [] })), 'E8', 'la entrada de poligirl ([8, 3])', 'abajo hay «.» (aire)');
  // Su molinete propio abajo: el infierno devuelve a Poligirl, y caería en él para siempre.
  const sobreSuMolinete = conCelda(conCelda(FLOTA_POLIGIRL, 8, 3, '.'), 8, 7, '2').map((r, f) => (f === 8 ? conCelda([r], 8, 0, 'I')[0] : r));
  cae(problemas(nivel({ grilla: sobreSuMolinete, mecanismos: [], compuertas: [] })), 'E8', 'la entrada de poligirl ([8, 7])', 'abajo hay «I» (molinete)');
  // Control: la entrada en la última fila, con el borde abajo, sí tiene dónde pararse.
  const enElBorde = conCelda(conCelda(FLOTA_POLIGIRL, 8, 3, '.'), 8, 8, '2');
  assert.ok(!problemas(nivel({ grilla: enElBorde, mecanismos: [], compuertas: [] })).some((p) => p.includes('(CTR-16.5 regla 3, E8)')));
});

test('🔴 E8: y arriba no es la fila 0, ni un sólido, ni un molinete que la devuelva', () => {
  const plana = [
    '###############',
    '#.............#',
    '#.............#',
    '#.............#',
    '#.............#',
    '#.............#',
    '#.............#',
    '#1.2........AB#',
    '###############',
  ];
  const con = (grilla: string[]): readonly string[] => problemas(nivel({ grilla, mecanismos: [], compuertas: [] }));
  assert.deepEqual(con(plana), [], 'control: la sala de base está sana');
  // El cuerpo mide 20 px nativos y asoma 4 en la celda de arriba de su entrada.
  cae(con(conCelda(plana, 3, 6, '#')), 'E8', 'arriba de la entrada de poligirl ([3, 7])', '«#» (solido)');
  cae(con(conCelda(plana, 3, 6, 'I')), 'E8', 'arriba de la entrada de poligirl ([3, 7])', '«I» (molinete)');
  // Control: el molinete de arriba es el cielo, que devuelve a Skayboy y a ella no.
  assert.deepEqual(con(conCelda(plana, 3, 6, 'C')), []);
  // La fila 0: sólido abajo, y la entrada asoma por arriba de la sala.
  const enLaFila0 = conCelda(conCelda(conCelda(plana, 3, 7, '.'), 3, 0, '2'), 3, 1, '#');
  cae(con(enLaFila0), 'E8', 'la entrada de poligirl ([3, 0]) está en la fila 0');
});
