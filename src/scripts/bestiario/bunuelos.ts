/**
 * Los redonditos de ricota (`D-73`, vigesimoctava vuelta): la fuente de buñuelos, servida, en la mesita de la silla vacía.
 *
 * Lo que hace sola es estar servida, y nada es un bucle: elige qué pasa.
 *
 * - **Rueda**: el de arriba se va rodando por la pila hasta el borde de la mesa, se queda en el borde balanceándose, y
 *   vuelve: no se cae nunca, porque son para el que pase.
 * - **Espolvorea**: cae azúcar de arriba, sin que nadie la tire, y la pila se asienta un poquito.
 * - **Agarra**: las pinzas se alzan solas, se abren, se cierran en el aire y le erran; las dejan donde estaban.
 * - **Se asienta**: la pila cruje y se aplasta de un lado; el de arriba baja de un salto.
 * - Siempre humea (dos hilos de vapor, cada uno a su ritmo).
 *
 * Tocada, ofrece (*«Agarrá uno. Son de quien pase.»*): el de arriba sale de la pila hacia quien mira, grande, sostenido en
 * las pinzas, con el azúcar cayendo, se queda ofreciéndose un rato y vuelve a su lugar. Con movimiento reducido no se
 * mueve nada: tocarla pasa de la fuente servida a la que ofrece.
 *
 * Se lleva números (`rig-bunuelos.ts`) y nada que dibuje.
 */

import { FUENTE_ARMADA, OFRECE, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-bunuelos.ts';
import { arco, armarCon, armarVida, mezclar, suave, type Config } from './vida.ts';

const ID = 'redonditos-de-ricota';

export type Accion = 'rueda' | 'espolvorea' | 'agarra' | 'asienta';
const SOLAS = ['rueda', 'espolvorea', 'agarra', 'asienta'] as const;

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { rueda: 4.2, espolvorea: 3, agarra: 4, asienta: 2.2, toque: 5.6 } as const;
/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { sale: [0.2, 1.2], ofrece: [1.2, 3.8], vuelve: [3.8, 4.8] } as const;
/** Hasta dónde rueda el de arriba: lo que se corre (x, y) del lugar donde está. */
export const RUEDA = { x: 64, y: 80 } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
/** Cuánto se parece el momento `u` de una acción a un `[a, b]`: 1 cuando es lo mismo. */
const entre = (u: number, a: number, b: number): number => (u >= a && u < b ? 1 : 0);

/** La pose de base de un instante: servida, humeando, la pila apenas viva. */
export function base(t: number): Momento {
  return { ...QUIETO, vapor: t, asienta: 0.05 + 0.04 * Math.sin(t * 0.7), tope: [0, 0.8 * Math.sin(t * 0.9), 1.2 * Math.sin(t * 0.6), 1] };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Accion, u: number): Momento {
  const m: Momento = { ...b };
  switch (accion) {
    case 'rueda': {
      // Baja rodando por la pila (acelera), se balancea en el borde y vuelve, despacio.
      const baja = rampa(u, 0.2, 1.4);
      const vuelve = rampa(u, 2.9, 4.1);
      const k = baja * (1 - vuelve);
      // Por el camino pasa sobre los de abajo: no baja en línea recta sino con un arco.
      const salto = 7 * arco(baja) * (1 - vuelve) + 7 * arco(vuelve);
      const borde = loma(u, 1.4, 1.5, 2.8, 2.9);
      const balancea = borde * (8 * Math.sin((u - 1.4) * 9) * (1 - rampa(u, 1.4, 2.9) * 0.4));
      m.tope = [RUEDA.x * k + 2 * borde, RUEDA.y * k - salto + 3 * borde * Math.abs(Math.sin((u - 1.4) * 9)), 300 * baja - 300 * vuelve + balancea, 1];
      m.asienta = b.asienta + 0.15 * rampa(u, 0.4, 1.4) * (1 - rampa(u, 1.4, 2));
      break;
    }
    case 'espolvorea': {
      m.azucar = rampa(u, 0, 2.6);
      m.asienta = b.asienta + 0.3 * loma(u, 0.2, 1, 1.6, 2.6);
      m.tope = [b.tope[0], b.tope[1] + 1.4 * loma(u, 1.2, 1.4, 1.8, 2.2), b.tope[2] + 4 * Math.sin(u * 14) * loma(u, 1.1, 1.3, 1.8, 2.2), 1];
      break;
    }
    case 'agarra': {
      // Se alzan solas, se abren, se cierran en el aire (le erran por un dedo) y vuelven. Dos intentos.
      const [ax, ay, ar] = FUENTE_ARMADA.agarra;
      const sube = loma(u, 0, 0.9, 3, 3.9);
      m.pinza = [ax * sube, ay * sube + 6 * sube, ar * sube];
      const abre = loma(u, 0.8, 1.2, 1.5, 1.7) + loma(u, 2.1, 2.4, 2.6, 2.8);
      m.abre = mezclar(b.abre, 1, Math.min(1, abre));
      // Cerradas (el pellizco al aire) las dos veces.
      m.abre = m.abre * (1 - entre(u, 1.7, 2.1) - entre(u, 2.8, 3.2)) + 0 * b.abre;
      m.pinza = [m.pinza[0], m.pinza[1] + 4 * (entre(u, 1.7, 2.1) + entre(u, 2.8, 3.2)), m.pinza[2] - 2 * (entre(u, 1.7, 2.1) + entre(u, 2.8, 3.2))];
      break;
    }
    case 'asienta': {
      const k = loma(u, 0, 0.35, 0.5, 1.9);
      m.asienta = mezclar(b.asienta, 1, k);
      const cae = arco((u - 0.3) / 0.5);
      m.tope = [b.tope[0], b.tope[1] + 5 * k - 3 * cae, b.tope[2] + 10 * k * Math.sin(u * 20), 1];
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b };
  const [tx, ty, tr, ts] = OFRECE.tope;
  // El de arriba salta y sale hacia quien mira; se queda ofreciéndose y vuelve con otro salto.
  const sale = rampa(u, T.sale[0], T.sale[1]);
  const vuelve = rampa(u, T.vuelve[0], T.vuelve[1]);
  const k = sale * (1 - vuelve);
  const hop = 44 * arco((u - T.sale[0]) / (T.sale[1] - T.sale[0])) + 20 * arco((u - T.vuelve[0]) / (T.vuelve[1] - T.vuelve[0]));
  const ofrece = loma(u, T.sale[1], T.sale[1] + 0.3, T.ofrece[1] - 0.2, T.vuelve[1]);
  m.tope = [tx * k, ty * k - hop, tr * k + 5 * ofrece * Math.sin(u * 3), 1 + (ts - 1) * k + 0.06 * ofrece * Math.sin(u * 6)];
  // Las pinzas lo sostienen: suben, se cierran sobre el buñuelo y lo acompañan.
  const [px, py, pr] = OFRECE.pinza;
  const pinza = loma(u, 0.1, 0.9, T.ofrece[1], T.vuelve[1]);
  m.pinza = [px * pinza, py * pinza, pr * pinza];
  m.abre = mezclar(b.abre, OFRECE.abre, rampa(u, 0.9, 1.3)) + 0.6 * arco((u - 0.2) / 0.7) * (1 - rampa(u, 0.9, 1));
  m.azucar = rampa(u, 0.4, 3.4) * (1 - rampa(u, 3.6, 3.7));
  m.asienta = mezclar(b.asienta, OFRECE.asienta, sale * (1 - vuelve));
  // El vapor se les va para arriba un rato: sale más caliente.
  m.vapor = b.vapor + 2.2 * loma(u, 0.3, 0.8, 3, 4);
  return m;
}

export const CONFIG: Config<Momento, Accion> = {
  id: ID,
  clase: 'titere--bunuelos',
  duran: DURA,
  solas: SOLAS,
  pausa: [1.2, 3.6],
  primera: [0.8, 2.2],
  demoraFicha: 1.8,
  ritmos: {},
  quieto: QUIETO,
  toca: OFRECE,
  base: (t) => base(t),
  accion: momentoDeAccion,
  toque: momentoDelToque,
  marcas,
  verso: VERSO,
};

export const armarBunuelosCon = (marcos: readonly SVGGElement[], esc: Parameters<typeof armarVida>[2], azar: () => number = Math.random) => armarVida(CONFIG, marcos, esc, azar);
export const armarBunuelos = armarCon(CONFIG);
