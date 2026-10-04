import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  planificarLamina,
  bandaDeLasFilas,
  renglonesQueEntran,
  nombreArchivoLamina,
  LaminaImposible,
  ALTOS,
  MIN_BANDA,
  BANDAS,
  LIENZO,
  MARGEN,
  ANCHO_UTIL,
  CUERPOS_LAMINA,
  TAPA_LAMINA,
  ladoDeTapa,
  tapasPorRenglon,
  renglonesDeTapas,
} from './lamina.ts';

/**
 * Lo que estos casos protegen es el defecto que `plan.ts` ya tuvo una vez y dejó anotado:
 * **la lámina desbordaba por 60 px, sin error y sin aviso, y se compartía igual**. Un
 * bloque que se cae del lienzo no rompe nada — sale la imagen con el pie cortado.
 */

/** Todos los repartos de renglones que la lámina puede recibir de verdad. */
const CASOS: readonly number[][] = [
  [1, 1, 1, 1], // todo vacío: cuatro bandas con "Nadie"
  [1, 1, 1, 9], // un conjunto entero en la última fila
  [9, 1, 1, 1], // y en la primera
  [3, 3, 3, 3], // repartido parejo
  [1, 4, 2, 1],
  [6, 5, 4, 3],
];

test('ninguna lámina se cae del lienzo, con ningún reparto', () => {
  for (const caso of CASOS) {
    const bloques = planificarLamina(caso);
    const ultimo = bloques[bloques.length - 1]!;
    assert.ok(
      ultimo.y + ultimo.alto <= LIENZO.alto - MARGEN,
      `con ${caso.join(',')} el pie termina en ${ultimo.y + ultimo.alto}`,
    );
    assert.ok(bloques[0]!.y >= MARGEN, 'el primer bloque arranca arriba del margen');
  }
});

test('ningún bloque se pisa con el de al lado', () => {
  for (const caso of CASOS) {
    const bloques = planificarLamina(caso);
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

test('las cuatro bandas suman exactamente la franja, sin un píxel bailando', () => {
  const franja = bandaDeLasFilas();
  for (const caso of CASOS) {
    const bandas = planificarLamina(caso).filter((b) => b.clave.startsWith('banda-'));
    assert.equal(bandas.length, BANDAS);
    const suma = bandas.reduce((a, b) => a + b.alto, 0);
    assert.equal(suma, franja.alto, `con ${caso.join(',')} las bandas suman ${suma}`);
  }
});

test('ninguna banda baja del piso, ni siquiera la que no tiene nada', () => {
  // Una fila vacía sigue siendo una banda visible: la lámina dice "Nadie" y eso hay que
  // poder leerlo. Si se encogiera a nada, la lámina mentiría por omisión — parecería que
  // el conjunto se repartió en tres lugares.
  for (const caso of CASOS) {
    for (const b of planificarLamina(caso).filter((x) => x.clave.startsWith('banda-'))) {
      assert.ok(b.alto >= MIN_BANDA, `con ${caso.join(',')}, ${b.clave} mide ${b.alto}`);
    }
  }
});

test('la banda con más contenido recibe más alto que la que tiene menos', () => {
  // Es la razón entera por la que este módulo existe en vez de reusar el reparto en partes
  // iguales de `plan.ts`.
  const bandas = planificarLamina([1, 1, 1, 9]).filter((b) => b.clave.startsWith('banda-'));
  assert.ok(
    bandas[3]!.alto > bandas[0]!.alto,
    'la banda de nueve renglones no recibió más alto que la de uno',
  );
});

test('el piso de las cuatro bandas entra en la franja, con lugar de sobra', () => {
  // Si algún día las filas fueran seis, esta cuenta hay que rehacerla. Este caso la rehace
  // solo, y falla antes de que alguien lo descubra mirando una lámina cortada.
  const franja = bandaDeLasFilas();
  assert.ok(
    franja.alto >= MIN_BANDA * BANDAS,
    `las ${BANDAS} bandas piden ${MIN_BANDA * BANDAS} px y hay ${franja.alto}`,
  );
});

test('la lámina se niega a dibujar lo que no sabe dibujar', () => {
  // Mismo criterio que el `RangeError` de `plan.ts`: se rompe el test, no la imagen.
  assert.throws(() => planificarLamina([1, 1, 1]), LaminaImposible);
  assert.throws(() => planificarLamina([1, 1, 1, 1, 1]), LaminaImposible);
  assert.throws(() => planificarLamina([1, 0, 1, 1]), LaminaImposible);
  assert.throws(() => planificarLamina([1, 1.5, 1, 1]), LaminaImposible);
});

test('el crédito de D-21 tiene su bloque propio, y no es un renglón de relleno', () => {
  // La lámina sale del sitio, y afuera no hay pie de pantalla donde poner el crédito. Si
  // este bloque desaparece, una tapa de Rocambole viaja sin firma.
  const bloques = planificarLamina([2, 2, 2, 2]);
  const credito = bloques.find((b) => b.clave === 'credito');
  assert.ok(credito, 'la lámina perdió el bloque del crédito');
  assert.equal(credito!.alto, ALTOS.credito);
});

test('en una banda del piso entra al menos un renglón de fichas', () => {
  // El piso se eligió para esto. Si el rótulo se comiera la banda entera, la fila más
  // chica saldría con su nombre y nada más.
  assert.ok(renglonesQueEntran(MIN_BANDA, CUERPOS_LAMINA.ficha.base) >= 1);
  assert.ok(renglonesQueEntran(300, CUERPOS_LAMINA.ficha.base) > 1, 'una banda grande no aprovecha el alto');
});

test('el nombre del archivo viaja por todos lados', () => {
  assert.equal(nombreArchivoLamina('Los diez discos'), 'fichin-ricotero-ponelos-en-fila-los-diez-discos.png');
  assert.equal(
    nombreArchivoLamina('Los temas de ¡Bang! ¡Bang!… estás liquidado'),
    'fichin-ricotero-ponelos-en-fila-los-temas-de-bang-bang-estas-liquidado.png',
  );
  assert.match(nombreArchivoLamina(''), /^fichin-ricotero-ponelos-en-fila-lista\.png$/);
  for (const nombre of ['Los diez discos', 'Doce al azar', '']) {
    assert.doesNotMatch(nombreArchivoLamina(nombre), /[^a-z0-9.-]/, 'quedó un carácter que no viaja');
  }
});

/* ==================================================================
   Las tapas: el desborde que no se ve

   Los conjuntos que se miran —los diez discos, las diez tapas— se imprimen con las tapas
   dibujadas y no con los titulos. El alto de una banda lo reparte `planificarLamina` en
   proporcion a lo que cada una pide, asi que una banda con las diez tapas puede recibir
   menos alto del que esas diez ocupan a tamaño completo. Sin achicar, se meterian adentro
   de la banda de abajo — **sin error y sin aviso**, y la imagen se comparte igual.
   ================================================================== */

test('las tapas de una banda nunca se salen del alto que les toco', () => {
  // El caso que importa es el peor: las diez tapas en una sola fila, que es lo que pasa
  // cuando alguien manda todo un conjunto al pogo.
  for (const caso of [[10, 1, 1, 1], [1, 10, 1, 1], [5, 5, 1, 1], [1, 1, 1, 10]]) {
    const bandas = planificarLamina(caso).filter((b) => b.clave.startsWith('banda-'));
    caso.forEach((cuantas, i) => {
      if (cuantas < 2) return;
      const alto = bandas[i]!.alto - CUERPOS_LAMINA.rotuloFila.base * 1.12 - 14;
      const lado = ladoDeTapa(cuantas, ANCHO_UTIL, alto);
      const filas = Math.ceil(cuantas / tapasPorRenglon(ANCHO_UTIL, lado));
      const ocupa = filas * (lado + TAPA_LAMINA.aire) - TAPA_LAMINA.aire;
      assert.ok(
        ocupa <= alto,
        `con ${caso.join(',')}, la banda ${i} ocupa ${ocupa} px de ${Math.round(alto)}`,
      );
    });
  }
});

test('una tapa nunca se achica hasta dejar de reconocerse', () => {
  // El piso existe para eso. Si ni al minimo entran, se dibuja lo que se puede: una fila
  // incompleta se ve; una tapa de 20 px no es una tapa.
  assert.ok(ladoDeTapa(10, ANCHO_UTIL, 40) >= TAPA_LAMINA.min);
  assert.ok(ladoDeTapa(1, ANCHO_UTIL, 1000) === TAPA_LAMINA.lado, 'con lugar de sobra no usa el lado entero');
});

test('el alto que una banda de tapas pide alcanza para dibujarlas', () => {
  // Las dos cuentas tienen que estar de acuerdo: la que pide alto al planificar y la que
  // decide el tamaño al dibujar. Si la primera pidiera de menos, la segunda achicaria
  // siempre — y las laminas de discos saldrian con tapas diminutas sin motivo.
  for (const cuantas of [1, 3, 5, 8, 10]) {
    const renglones = renglonesDeTapas(cuantas, ANCHO_UTIL, CUERPOS_LAMINA.ficha.base);
    assert.ok(renglones >= 1);
    const pide = Math.ceil(cuantas / tapasPorRenglon(ANCHO_UTIL));
    assert.ok(
      renglones * CUERPOS_LAMINA.ficha.base * 1.12 >= pide * (TAPA_LAMINA.lado + TAPA_LAMINA.aire) - TAPA_LAMINA.aire - 1,
      `con ${cuantas} tapas pide ${renglones} renglones y no alcanzan`,
    );
  }
});
