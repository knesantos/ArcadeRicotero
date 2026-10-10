import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  planificarLamina,
  bandaDeLasFilas,
  elegirCuerpo,
  altoNecesario,
  altoDeLienzo,
  contenidoDeBanda,
  renglonesQueEntran,
  nombreArchivoLamina,
  pedidoDeTapas,
  LaminaImposible,
  ALTOS,
  ALTO_MAX,
  MIN_BANDAS,
  MAX_BANDAS,
  MIN_CONTENIDO,
  LIENZO,
  MARGEN,
  ANCHO_UTIL,
  INTERLINEA,
  CUERPOS_LAMINA,
  TAPA_LAMINA,
  ladoDeTapa,
  tapasPorRenglon,
  type Bloque,
} from './lamina.ts';
import { MAX_FILAS, MIN_FILAS } from './filas.ts';

/**
 * Lo que estos casos protegen es el defecto que `plan.ts` ya tuvo una vez y dejó anotado:
 * **la lámina desbordaba por 60 px, sin error y sin aviso, y se compartía igual**. Un
 * bloque que se cae del lienzo no rompe nada — sale la imagen con el pie cortado.
 *
 * Desde `D-69` las bandas son de dos a siete, y lo que cada una pide va en píxeles de
 * contenido: un renglón de 34 px son ~38 px, diez tapas a tamaño completo son 350.
 */

const R = Math.ceil(CUERPOS_LAMINA.ficha.base * INTERLINEA);

/** Todos los repartos que la lámina puede recibir de verdad, de dos a siete filas. */
const CASOS: readonly number[][] = [
  [R, R, R, R], // las cuatro de siempre, todas con "Nadie"
  [R, R, R, 9 * R], // un conjunto entero en la última fila
  [9 * R, R, R, R], // y en la primera
  [3 * R, 3 * R, 3 * R, 3 * R],
  [R, R], // dos filas, lo mínimo
  [R, R, R, R, R, R, R], // siete filas, lo máximo
  [40 * R, R, R, R, R, R, R], // los ciento cinco en la primera, con siete filas
  [pedidoDeTapas(10, ANCHO_UTIL), R, R, R, R, R, R], // las diez tapas en una, con siete filas
  [5000, 5000], // más de lo que entra estirando: se reparte lo que hay
];

const bandasDe = (bloques: readonly Bloque[]) => bloques.filter((b) => b.clave.startsWith('banda-'));

test('ninguna lámina se cae del lienzo, con ningún reparto', () => {
  for (const caso of CASOS) {
    const { alto, bloques } = planificarLamina(caso);
    const ultimo = bloques[bloques.length - 1]!;
    assert.ok(ultimo.y + ultimo.alto <= alto - MARGEN, `con ${caso.join(',')} el pie termina en ${ultimo.y + ultimo.alto}`);
    assert.ok(bloques[0]!.y >= MARGEN, 'el primer bloque arranca arriba del margen');
  }
});

test('ningún bloque se pisa con el de al lado', () => {
  for (const caso of CASOS) {
    const { bloques } = planificarLamina(caso);
    for (let i = 1; i < bloques.length; i++) {
      const anterior = bloques[i - 1]!;
      const actual = bloques[i]!;
      assert.ok(
        actual.y >= anterior.y + anterior.alto,
        `con ${caso.join(',')}, "${actual.clave}" se mete adentro de "${anterior.clave}"`,
      );
    }
  }
});

test('las bandas suman exactamente la franja, sin un píxel bailando', () => {
  for (const caso of CASOS) {
    const { alto, bloques } = planificarLamina(caso);
    const bandas = bandasDe(bloques);
    assert.equal(bandas.length, caso.length);
    const suma = bandas.reduce((a, b) => a + b.alto, 0);
    assert.equal(suma, bandaDeLasFilas(alto).alto, `con ${caso.join(',')} las bandas suman ${suma}`);
  }
});

test('cada banda recibe lo que pide cuando entra: nadie se queda sin su renglón', () => {
  // Una fila vacía sigue siendo una banda visible: la lámina dice "Nadie" y eso hay que
  // poder leerlo. Si se encogiera a nada, la lámina mentiría por omisión.
  for (const caso of CASOS.filter((c) => altoNecesario(c) <= bandaDeLasFilas(ALTO_MAX).alto)) {
    const { bloques } = planificarLamina(caso);
    bandasDe(bloques).forEach((b, i) => {
      const pide = Math.max(MIN_CONTENIDO, caso[i]!);
      assert.ok(contenidoDeBanda(b.alto) >= pide, `con ${caso.join(',')}, ${b.clave} da ${contenidoDeBanda(b.alto)} de ${pide}`);
    });
  }
});

test('la banda con más contenido recibe más alto que la que tiene menos', () => {
  const bandas = bandasDe(planificarLamina([R, R, R, 9 * R]).bloques);
  assert.ok(bandas[3]!.alto > bandas[0]!.alto, 'la banda de nueve renglones no recibió más alto que la de uno');
});

test('D-69: la lámina se estira antes que cortar un tema, y nunca pasa del techo', () => {
  // Lo de siempre entra en el lienzo de siempre.
  assert.equal(altoDeLienzo([R, R, R, R]), LIENZO.alto);
  // Lo que no entra, lo estira lo justo.
  const largo = [15 * R, 8 * R, R, R];
  const alto = altoDeLienzo(largo);
  assert.ok(alto > LIENZO.alto && alto < ALTO_MAX, `se estiró a ${alto}`);
  assert.ok(bandaDeLasFilas(alto).alto >= altoNecesario(largo), 'se estiró de menos');
  assert.ok(bandaDeLasFilas(alto - 1).alto < altoNecesario(largo), 'se estiró de más');
  // Y lo imposible se queda en el techo.
  assert.equal(altoDeLienzo([100000, 100000]), ALTO_MAX);
});

test('D-69: el cuerpo de las fichas baja antes de estirar, y nunca baja del piso', () => {
  // Una regla de mentira: cada banda pide cuatro renglones al cuerpo que sea. Al cuerpo de
  // base no entran por poco; dos píxeles menos, sí.
  const pide = (cuerpo: number) => [4, 4, 4, 4].map((n) => n * cuerpo * INTERLINEA);
  const cuerpo = elegirCuerpo(pide);
  assert.ok(cuerpo < CUERPOS_LAMINA.ficha.base, 'no achicó la letra');
  assert.ok(cuerpo >= CUERPOS_LAMINA.ficha.piso);
  assert.ok(altoNecesario(pide(cuerpo)) <= bandaDeLasFilas().alto, 'eligió un cuerpo con el que no entra');
  // Con poco, la letra queda grande.
  assert.equal(elegirCuerpo(() => [R, R, R, R]), CUERPOS_LAMINA.ficha.base);
  // Con muchísimo, el piso, y el resto lo hace estirar.
  assert.equal(elegirCuerpo(() => [99999, 1, 1, 1]), CUERPOS_LAMINA.ficha.piso);
});

test('D-69: la lámina dibuja tantas bandas como filas puede tener un tablero', () => {
  assert.equal(MIN_BANDAS, MIN_FILAS);
  assert.equal(MAX_BANDAS, MAX_FILAS);
});

test('la lámina se niega a dibujar lo que no sabe dibujar', () => {
  // Mismo criterio que el `RangeError` de `plan.ts`: se rompe el test, no la imagen.
  assert.throws(() => planificarLamina([R]), LaminaImposible);
  assert.throws(() => planificarLamina(new Array<number>(8).fill(R)), LaminaImposible);
  assert.throws(() => planificarLamina([R, -1, R]), LaminaImposible);
  assert.throws(() => planificarLamina([R, Number.NaN]), LaminaImposible);
});

test('el crédito de D-21 tiene su bloque propio, y no es un renglón de relleno', () => {
  // La lámina sale del sitio, y afuera no hay pie de pantalla donde poner el crédito. Si
  // este bloque desaparece, una tapa de Rocambole viaja sin firma.
  for (const caso of [[R, R, R, R], [40 * R, R, R, R, R, R, R]]) {
    const { alto, bloques } = planificarLamina(caso);
    const credito = bloques.find((b) => b.clave === 'credito');
    assert.ok(credito, 'la lámina perdió el bloque del crédito');
    assert.equal(credito!.alto, ALTOS.credito);
    // Y va abajo de todo, también en una lámina estirada.
    assert.ok(credito!.y > alto - MARGEN - ALTOS.credito - ALTOS.sitio - 20);
  }
});

test('en la banda más chica entra al menos un renglón de fichas', () => {
  assert.ok(renglonesQueEntran(MIN_CONTENIDO, CUERPOS_LAMINA.ficha.piso) >= 1);
  assert.ok(renglonesQueEntran(300, CUERPOS_LAMINA.ficha.base) > 1, 'una banda grande no aprovecha el alto');
});

test('el nombre del archivo viaja por todos lados', () => {
  assert.equal(nombreArchivoLamina('Los diez discos'), 'fichin-ricotero-ponelos-en-fila-los-diez-discos.png');
  assert.equal(
    nombreArchivoLamina('Los temas de ¡Bang! ¡Bang!… estás liquidado'),
    'fichin-ricotero-ponelos-en-fila-los-temas-de-bang-bang-estas-liquidado.png',
  );
  assert.match(nombreArchivoLamina(''), /^fichin-ricotero-ponelos-en-fila-lista\.png$/);
  for (const nombre of ['Los diez discos', 'Doce al azar', 'Todos los temas', '']) {
    assert.doesNotMatch(nombreArchivoLamina(nombre), /[^a-z0-9.-]/, 'quedó un carácter que no viaja');
  }
});

/* ==================================================================
   Las tapas: el desborde que no se ve

   Las diez tapas se imprimen dibujadas y no con los titulos. Desde `D-69` una banda de
   tapas pide su alto a tamaño completo y la lámina se estira si hace falta; pero si no
   entra ni así, el reparto es proporcional y la banda puede recibir menos de lo que pidió.
   Sin achicar, las tapas se meterian adentro de la banda de abajo — **sin error y sin
   aviso**, y la imagen se comparte igual.
   ================================================================== */

test('las tapas de una banda nunca se salen del alto que les tocó', () => {
  const t = (n: number) => pedidoDeTapas(n, ANCHO_UTIL);
  for (const caso of [
    [10, 1, 1, 1],
    [1, 10, 1, 1],
    [5, 5, 1, 1],
    [1, 1, 1, 10],
    [10, 0, 0, 0, 0, 0, 0],
    [3, 3, 2, 2, 0, 0, 0],
  ]) {
    const bandas = bandasDe(planificarLamina(caso.map(t)).bloques);
    caso.forEach((cuantas, i) => {
      if (cuantas < 2) return;
      const alto = contenidoDeBanda(bandas[i]!.alto);
      const lado = ladoDeTapa(cuantas, ANCHO_UTIL, alto);
      const filas = Math.ceil(cuantas / tapasPorRenglon(ANCHO_UTIL, lado));
      const ocupa = filas * (lado + TAPA_LAMINA.aire) - TAPA_LAMINA.aire;
      assert.ok(ocupa <= alto, `con ${caso.join(',')}, la banda ${i} ocupa ${ocupa} px de ${Math.round(alto)}`);
    });
  }
});

test('una tapa nunca se achica hasta dejar de reconocerse', () => {
  // El piso existe para eso. Si ni al minimo entran, se dibuja lo que se puede: una fila
  // incompleta se ve; una tapa de 20 px no es una tapa.
  assert.ok(ladoDeTapa(10, ANCHO_UTIL, 40) >= TAPA_LAMINA.min);
  assert.ok(ladoDeTapa(1, ANCHO_UTIL, 1000) === TAPA_LAMINA.lado, 'con lugar de sobra no usa el lado entero');
});

test('el alto que una banda de tapas pide alcanza para dibujarlas a tamaño completo', () => {
  // Las dos cuentas tienen que estar de acuerdo: la que pide alto al planificar y la que
  // decide el tamaño al dibujar. Si la primera pidiera de menos, la segunda achicaria
  // siempre — y las laminas de tapas saldrian con tapas diminutas sin motivo.
  for (const cuantas of [1, 3, 5, 8, 10]) {
    assert.equal(ladoDeTapa(cuantas, ANCHO_UTIL, pedidoDeTapas(cuantas, ANCHO_UTIL)), TAPA_LAMINA.lado);
  }
  assert.equal(pedidoDeTapas(0, ANCHO_UTIL), 0);
});
