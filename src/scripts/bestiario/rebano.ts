/**
 * El rebaño (`D-73`, vigesimoctava vuelta), amontonado en la punta de la pastura alrededor de su veleta.
 *
 * Lo que hace solo es tener miedo, y nada es un bucle: elige de qué.
 *
 * - **Sopla**: la veleta se da vuelta y las tres miran para donde sople, cada una un poco más tarde; la última llega
 *   cuando las otras ya miran para otro lado.
 * - **Bolsa**: la bolsa de nailon se suelta del palo y les pasa por arriba; se aprietan, y la bolsa vuelve a engancharse.
 * - **Asoma**: una se anima a salir del montón, mira para el lado del monte, y un ruido la devuelve de un salto.
 * - **Aprieta**: se juntan todas contra la del medio y balan sin ruido.
 * - **Se esconde**: la del medio mete la cabeza abajo, queda con el cuerpo afuera, y no se aguanta: espía.
 * - Siempre tiemblan un poco, respiran, la cinta de la veleta no para.
 *
 * Tocadas, el miedo se les sube a todas juntas (*"al rebaño y su temor"*): saltan, sueltan copos de lana, la veleta
 * da vueltas, se abren cada una para su lado, miran todas para arriba y se vuelven a apretar, más que antes. Con
 * movimiento reducido no se mueve nada: tocarlas las pasa de apretadas a espantadas.
 *
 * Se lleva números (`rig-rebano.ts`) y nada que dibuje.
 */

import { ESPANTADO, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-rebano.ts';
import { aliento, arco, armarCon, armarVida, mezclar, suave, type Config } from './vida.ts';

const ID = 'el-rebano';

export type Accion = 'sopla' | 'bolsa' | 'asoma' | 'aprieta' | 'esconde';
const SOLAS = ['sopla', 'bolsa', 'asoma', 'aprieta', 'esconde'] as const;

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { sopla: 3.4, bolsa: 3.8, asoma: 3.4, aprieta: 2.8, esconde: 3.4, toque: 5.6 } as const;
/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { salto: [0, 0.9], gira: [0.3, 2], abre: [0.5, 1.4], cierra: [3, 4.4], mira: [1.4, 3.4] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const tres = (f: (i: number) => number): readonly [number, number, number] => [f(0), f(1), f(2)];

/** La pose de base de un instante: apretadas, temblando, con la bolsa aleteando en el palo. */
export function base(t: number, ev: (n: string) => number): Momento {
  const pestanea = ev('espanta');
  return {
    ...QUIETO,
    respira: aliento(t, 2.2),
    // El temblor: chico, rápido, y cada una a su ritmo.
    tiembla: tres((i) => 0.5 * Math.sin(t * (31 + i * 5) + i * 2)),
    cabeza: tres((i) => QUIETO.cabeza[i]! + 3 * Math.sin(t * (0.7 + i * 0.2) + i)),
    orejas: tres((i) => QUIETO.orejas[i]! + 4 * Math.sin(t * (1.1 + i * 0.3) + i * 3)),
    ojo: tres((i) => 1 + (pestanea >= 0 ? 0.25 * Math.sin(pestanea * Math.PI) * (i === 1 ? 1 : 0.6) : 0)),
    viento: 1,
    // La cinta y la bolsa nunca paran: lo que cuelga llega después que el viento.
    cinta: 8 + 14 * Math.sin(t * 2.3) + 6 * Math.sin(t * 5.1),
    aletea: -8 + 10 * Math.sin(t * 3.1) + 5 * Math.sin(t * 7.3),
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Accion, u: number): Momento {
  const m: Momento = { ...b };
  switch (accion) {
    case 'sopla': {
      // El gallo se da vuelta (pasa de canto), y las tres lo siguen, una tras otra.
      const k = rampa(u, 0.4, 1.1);
      const vuelve = rampa(u, 2.2, 2.9);
      m.viento = Math.cos(Math.PI * (k - vuelve));
      m.cinta = b.cinta - 50 * loma(u, 0.4, 1, 1.8, 2.4);
      const sigue = (d: number): number => loma(u, 0.6 + d, 1.2 + d, 2.3 + d, 2.9 + d);
      m.cabeza = tres((i) => mezclar(b.cabeza[i]!, [-24, -10, 6][i]!, sigue(i * 0.35)));
      m.orejas = tres((i) => mezclar(b.orejas[i]!, 34, sigue(i * 0.35) * 0.6));
      // La última, la tercera, se pasa de rosca: gira de más y vuelve.
      m.cabeza = [m.cabeza[0], m.cabeza[1], m.cabeza[2] + 10 * loma(u, 1.4, 1.6, 1.9, 2.2)];
      m.tiembla = tres((i) => b.tiembla[i]! + 1.6 * sigue(i * 0.35) * Math.sin(u * 40));
      break;
    }
    case 'bolsa': {
      // La bolsa se suelta y les pasa por arriba; se aprietan y la siguen con los ojos.
      const k = rampa(u, 0.3, 3.2);
      m.bolsa = u < 0.3 || u > 3.25 ? -1 : k;
      const pasa = loma(u, 0.8, 1.4, 2.3, 3.1);
      m.apreta = mezclar(b.apreta, 0.6, pasa);
      m.cabeza = tres((i) => mezclar(b.cabeza[i]!, -28 + 30 * Math.sin(k * Math.PI) * (i - 1), pasa));
      m.ojo = tres((i) => mezclar(b.ojo[i]!, 1.35, pasa));
      m.orejas = tres((i) => mezclar(b.orejas[i]!, 36, pasa));
      m.salta = tres((i) => 7 * arco((u - 1.1 - i * 0.12) / 0.5));
      m.aletea = b.aletea + 60 * loma(u, 0, 0.3, 0.3, 0.5);
      break;
    }
    case 'asoma': {
      // La primera sale del montón, mira lejos, y un ruido la devuelve de un salto.
      const sale = loma(u, 0, 0.9, 2.2, 2.4);
      m.abre = 0.55 * sale;
      m.cabeza = [mezclar(b.cabeza[0], -16, sale), b.cabeza[1], b.cabeza[2]];
      const ruido = arco((u - 2.2) / 0.5);
      m.salta = [8 * ruido, 6 * ruido, 6 * ruido];
      m.ojo = tres((i) => b.ojo[i]! + 0.4 * ruido);
      m.apreta = mezclar(b.apreta, 0.45, rampa(u, 2.2, 2.6));
      break;
    }
    case 'aprieta': {
      const k = loma(u, 0, 0.7, 1.9, 2.6);
      m.apreta = mezclar(b.apreta, 0.72, k);
      m.boca = tres((i) => 0.55 * k * (0.5 + 0.5 * Math.abs(Math.sin(u * (9 + i * 2)))) * loma(u, 0.5, 0.7, 1.7, 1.9));
      m.cabeza = tres((i) => mezclar(b.cabeza[i]!, -18, k));
      m.tiembla = tres((i) => b.tiembla[i]! + 1.2 * k * Math.sin(u * 36 + i));
      break;
    }
    case 'esconde': {
      // La del medio mete la cabeza debajo, pero el cuerpo queda afuera, y no se aguanta.
      const baja = loma(u, 0, 0.6, 2.3, 2.8);
      const espia = loma(u, 1.5, 1.75, 2, 2.3);
      m.cabeza = [b.cabeza[0], mezclar(b.cabeza[1], 60, baja) - 70 * espia, b.cabeza[2]];
      m.ojo = tres((i) => (i === 1 ? mezclar(b.ojo[1]!, 1.3, espia) : b.ojo[i]!));
      m.orejas = tres((i) => (i === 1 ? mezclar(b.orejas[1]!, 40, baja) : b.orejas[i]!));
      m.tiembla = tres((i) => b.tiembla[i]! + (i === 1 ? 1.4 * baja * Math.sin(u * 44) : 0));
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b };
  // Todas de un brinco, una tras otra.
  m.salta = tres((i) => 1.6 * 18 * arco((u - T.salto[0] - i * 0.08) / (T.salto[1] - T.salto[0])));
  const susto = loma(u, 0, 0.12, 3.4, 4.2);
  m.ojo = tres((i) => mezclar(b.ojo[i]!, ESPANTADO.ojo[i]!, susto));
  m.orejas = tres((i) => mezclar(b.orejas[i]!, ESPANTADO.orejas[i]!, susto));
  m.boca = tres((i) => (0.4 + 0.5 * Math.abs(Math.sin(u * (14 + i * 3)))) * loma(u, 0.1, 0.3, 1.5 + i * 0.2, 1.9 + i * 0.2));
  // La veleta da vueltas locas y se queda mirando para el otro lado.
  m.viento = u < T.gira[0] ? b.viento : u < T.gira[1] ? Math.cos((u - T.gira[0]) * 16) : -1;
  m.cinta = b.cinta - 40 * loma(u, 0.2, 0.5, 2, 3);
  // Cada una para su lado, y de vuelta más apretadas que antes.
  const abre = loma(u, T.abre[0], T.abre[1], T.cierra[0], T.cierra[1]);
  m.abre = 0.9 * abre;
  m.apreta = mezclar(b.apreta, 0.62, rampa(u, T.cierra[0], T.cierra[1] + 0.4));
  m.cabeza = tres((i) => mezclar(b.cabeza[i]!, ESPANTADO.cabeza[i]!, loma(u, T.mira[0], T.mira[0] + 0.4, T.mira[1], T.mira[1] + 0.8)));
  m.tiembla = tres((i) => b.tiembla[i]! + 1.8 * loma(u, 1.4, 1.6, 4.4, 5) * Math.sin(u * 46 + i * 2));
  // La lana sale despedida y vuelve a su lugar.
  m.copos = Math.sin(Math.PI * Math.min(1, Math.max(0, (u - 0.1) / 3.6))) ** 0.8;
  m.aletea = b.aletea + 40 * loma(u, 0, 0.2, 1, 2);
  return m;
}

export const CONFIG: Config<Momento, Accion> = {
  id: ID,
  clase: 'titere--rebano',
  duran: DURA,
  solas: SOLAS,
  pausa: [0.8, 2.6],
  primera: [0.5, 1.6],
  demoraFicha: 1.6,
  // Cada tanto, un ruido que no existía: los ojos se les abren.
  ritmos: { espanta: { cada: [3, 7], dura: 0.5 } },
  quieto: QUIETO,
  toca: ESPANTADO,
  base,
  accion: momentoDeAccion,
  toque: momentoDelToque,
  marcas,
  verso: VERSO,
};

export const armarRebanoCon = (marcos: readonly SVGGElement[], esc: Parameters<typeof armarVida>[2], azar: () => number = Math.random) => armarVida(CONFIG, marcos, esc, azar);
export const armarRebano = armarCon(CONFIG);
