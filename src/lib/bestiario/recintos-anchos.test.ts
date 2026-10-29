/**
 * Los recintos agrandados (`MARCO_DEL_RECINTO` en `rig.ts`). El pedido del usuario: *"agrandar el
 * espacio de los entornos que están muy cargados, o separar un poco bestias"*. Este test es el que
 * no deja que vuelvan a encimarse: dos pares de ojos de un recinto no quedan pegados, y ninguno
 * queda adentro del cuerpo de un títere parado en su lugar.
 *
 * Los cuerpos son cajas medidas sobre la escena impresa, colgadas del número de cada títere en su
 * `rig`: si el títere se corre, su caja se corre con él. Lo que se mueve (el Atila por la medianera,
 * la drácula por el pasillo, Limón por la chapa) se mide quieto, donde queda sin la isla.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VECINOS_DEL_BAJO, VECINOS_DEL_BALDIO, VECINOS_DE_LA_PRISION, VECINOS_DEL_TEMPLO, type Tinta } from './escenas.ts';
import { CON_TITERE } from './elenco.ts';
import { ARMADO } from './recortes.ts';
import { ATILA, BARBAZUL, CHAPA, DRACULA, ESCENA, LIMON, MARCO_DEL_RECINTO, MOMO, PIERRE, marcoDelRecinto } from './rig.ts';
import { ESCLAVO } from './rig-esclavo.ts';
import { MORTA } from './rig-morta.ts';
import { RATO } from './rig-rato.ts';
import { CAMINOS } from './camino.ts';

/** Una caja: `[x0, y0, x1, y1]`, en coordenadas del recinto. */
type Caja = readonly [number, number, number, number];

/** Un cuerpo parado en `x`, con los pies en `piso`: lo que tiene a cada lado y lo que mide de alto. */
const parado = (x: number, piso: number, izq: number, der: number, alto: number): Caja => [x - izq, piso - alto, x + der, piso];

/** El medallón de Momo, con lo que se hamaca (cuatro grados, colgado de arriba de la escena). */
const medallon = (): Caja => {
  const { argolla, centro, radio } = ARMADO.momo;
  const cx = MOMO.argolla.x + (centro[0] - argolla[0]) * MOMO.escala;
  const cy = MOMO.argolla.y + (centro[1] - argolla[1]) * MOMO.escala;
  const r = radio * MOMO.escala;
  const hamaca = 30;
  return [cx - r - hamaca, cy - r, cx + r + hamaca, cy + r];
};

const RECINTOS: Readonly<Record<string, { ojos: Readonly<Record<string, readonly [number, number, Tinta]>>; cuerpos: Readonly<Record<string, Caja>> }>> = {
  'el-templo': {
    ojos: VECINOS_DEL_TEMPLO,
    cuerpos: { momo: medallon(), 'el-morta': parado(MORTA.x, MORTA.piso, 64, 44, 206) },
  },
  'los-techos': {
    ojos: VECINOS_DEL_BALDIO,
    cuerpos: {
      // El perro asoma por el borde izquierdo con la cabeza, que llega hasta x ~ 290.
      'ese-perro-que-sigue-alli': [0, 296, 290, ESCENA.alto],
      'el-negro-atila': parado(ATILA.x, ATILA.piso, 50, 50, 252),
      limon: parado((LIMON.desde + LIMON.hasta) / 2, CHAPA.piso, 48, 44, 126),
    },
  },
  'la-prision': {
    ojos: VECINOS_DE_LA_PRISION,
    cuerpos: {
      barbazul: parado(BARBAZUL.x, BARBAZUL.piso, 98, 104, 510),
      'la-dracula-con-tacones': parado(DRACULA.x, DRACULA.piso, 102, 104, 458),
      'el-esclavo-sensible-y-chillon': parado(ESCLAVO.x, ESCLAVO.asiento + 10, 36, 33, 180),
    },
  },
  'el-bajo': {
    ojos: VECINOS_DEL_BAJO,
    // Pierre y el rato, de la línea del agua para arriba: abajo está el reflejo, que no se toca.
    cuerpos: { 'el-gordo-pierre': parado(PIERRE.x, PIERRE.agua, 234, 203, 366), 'el-rato-molhado': parado(RATO.x, RATO.agua, 80, 68, 148) },
  },
};

/** Lo que mide el toque de unos ojos (`ojos()` en `escenas.ts`). */
const TOQUE = 26;
/** Lo menos que se separan dos pares de ojos: más que dos toques, con aire para el dedo. */
const SEPARADOS = 60;
/**
 * Lo menos que unos ojos se separan del cuerpo de un títere: el toque entero y un poco más. Con 40,
 * los de antes de agrandar fallaban (los gallos y Mister Ed contra el Morta, el ahogado y los nenes
 * de oro contra Pierre), aunque ninguno cayera adentro de la caja.
 */
const AIRE = 40;

const ojosDe = (region: string): Array<[string, number, number]> =>
  Object.entries(RECINTOS[region]!.ojos)
    .filter(([id]) => !CON_TITERE.has(id))
    .map(([id, [x, y]]) => [id, x, y]);

test('los recintos agrandados: el marco tiene a su escena de siempre adentro, y el camino mide lo mismo', () => {
  for (const [region, { x, ancho }] of Object.entries(MARCO_DEL_RECINTO)) {
    assert.ok(x <= 0 && x + ancho >= ESCENA.ancho, `${region}: el marco no tiene adentro la escena de 900`);
    assert.ok(ancho > ESCENA.ancho, `${region}: está en la lista y no se agrandó`);
    assert.equal(CAMINOS[region]?.escena, ancho, `${region}: el camino no mide lo que mide el recinto`);
  }
  assert.deepEqual(marcoDelRecinto('el-infierno'), { x: 0, ancho: ESCENA.ancho });
  // El perro entra por el borde izquierdo, como en la tapa: los techos crecen solo a la derecha.
  assert.equal(marcoDelRecinto('los-techos').x, 0);
});

test('en un recinto agrandado nadie se le encima a nadie: ni ojos con ojos, ni ojos con un títere', () => {
  for (const region of Object.keys(RECINTOS)) {
    const marco = marcoDelRecinto(region);
    const ojos = ojosDe(region);
    for (const [id, x, y] of ojos) {
      assert.ok(x - TOQUE > marco.x && x + TOQUE < marco.x + marco.ancho && y - TOQUE > 0 && y + TOQUE < ESCENA.alto, `${region}: ${id} se sale del recinto`);
    }
    for (let i = 0; i < ojos.length; i++) {
      for (let j = i + 1; j < ojos.length; j++) {
        const [a, ax, ay] = ojos[i]!;
        const [b, bx, by] = ojos[j]!;
        const d = Math.hypot(ax - bx, ay - by);
        assert.ok(d >= SEPARADOS, `${region}: ${a} y ${b} están encimados (${d.toFixed(0)} de ${SEPARADOS})`);
      }
    }
    for (const [titere, [x0, y0, x1, y1]] of Object.entries(RECINTOS[region]!.cuerpos)) {
      for (const [id, x, y] of ojos) {
        // Lo que separa el centro de los ojos de la caja del cuerpo.
        const d = Math.hypot(Math.max(x0 - x, 0, x - x1), Math.max(y0 - y, 0, y - y1));
        assert.ok(d > AIRE, `${region}: ${id} queda encima de ${titere} (${d.toFixed(0)} de ${AIRE})`);
      }
    }
  }
});
