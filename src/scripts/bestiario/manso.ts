/**
 * El perro manso (`D-73`, vigesimonovena vuelta), comiendo de la olla en la tierra del baldío.
 *
 * Come, y no dice nada. Lo que hace solo es tragar lo que le dan, y nada es un bucle: elige qué le toca.
 *
 * - **Se atraganta**: levanta la cabeza con una espina cruzada en la boca, tose dos veces, se la traga igual y
 *   vuelve a la olla.
 * - **Gruñe**, o quiere: levanta apenas el hocico, abre la boca, y lo que sale es una burbuja de sopa, que revienta.
 * - **Mueve la cola** a nadie: el palo que le cuelga se hamaca y le pega en la última costilla.
 * - **Mira** a quien lo mira, largo, pestañea, y sigue comiendo.
 * - Mastica, respira, y el palo cuelga.
 *
 * Tocado, **le cuentan las costillas** (*"con un palo a carcajadas"*): mueve la cola fuerte, el palo le pasa por
 * las seis costillas de ida y de vuelta, cada una salta cuando le toca, y los cucharones de la olla se sacuden de
 * la risa. Él sigue comiendo, con el ojo a medio cerrar. Con movimiento reducido no se mueve nada: tocarlo lo pasa
 * de comiendo a comiendo con el palo en la tercera costilla.
 *
 * Se lleva números (`rig-manso.ts`) y nada que dibuje.
 */

import { CONTADO, MANSO_ARMADO as A, QUIETO, VERSO, atado, colgado, marcas, type Momento } from '../../lib/bestiario/rig-manso.ts';
import { aliento, arco, armarCon, armarVida, mezclar, suave, type Config } from './vida.ts';

const ID = 'el-perro-manso';

export type Accion = 'atraganta' | 'gruñe' | 'colea' | 'mira';
const SOLAS = ['atraganta', 'gruñe', 'colea', 'mira'] as const;

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { atraganta: 4, 'gruñe': 3.4, colea: 3, mira: 3.4, toque: 4 } as const;
/** Los tiempos del toque: el palo sube, pasa de la sexta a la primera, vuelve, y cae. */
export const TOQUE_T = { sube: [0.15, 0.6], ida: [0.6, 1.5], vuelta: [1.6, 2.3], cae: [2.3, 3], risa: [0.8, 3.1] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar3 = (a: readonly [number, number, number], b: readonly [number, number, number], k: number): [number, number, number] => [mezclar(a[0], b[0], k), mezclar(a[1], b[1], k), mezclar(a[2], b[2], k)];

/** La pose de base de un instante: come, respira, la cola floja; el palo cuelga y llega después. */
export function base(t: number, ev: (n: string) => number): Momento {
  const p = ev('pestanea');
  const cola = 4 * Math.sin(t * 1.1);
  // Mastica de a tandas: cuatro mordiscos y una pausa para tragar.
  const tanda = (t % 3.2) / 3.2;
  return {
    ...QUIETO,
    respira: aliento(t, 2.8),
    mastica: tanda < 0.7 ? 0.2 + 0.6 * Math.abs(Math.sin(tanda * Math.PI * 5.7)) : 0.1,
    cabeza: tanda < 0.7 ? 0 : 3 * Math.sin(((tanda - 0.7) / 0.3) * Math.PI),
    oreja: 2 * Math.sin(t * 1.4),
    cola,
    palo: colgado(cola, 3 + 5 * Math.sin(t * 1.1 - 0.9)),
    parpado: Math.max(QUIETO.parpado, p >= 0 ? arco(p) : 0),
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Accion, u: number): Momento {
  const m: Momento = { ...b };
  switch (accion) {
    case 'atraganta': {
      // Levanta la cabeza con la espina cruzada, tose dos veces, se la traga y vuelve a la olla.
      const arriba = loma(u, 0.2, 0.7, 2.9, 3.6);
      const tos = (c: number): number => (u > c && u < c + 0.3 ? arco((u - c) / 0.3) : 0);
      const t2 = tos(1.2) + tos(1.75);
      m.cabeza = 34 * arriba - 10 * t2 - 12 * loma(u, 2.3, 2.5, 2.7, 2.9);
      m.espina = rampa(u, 0.25, 0.4) * (1 - rampa(u, 2.3, 2.55));
      m.mastica = mezclar(b.mastica, 0.9, Math.min(1, t2)) * (u > 2.3 && u < 2.9 ? 0.1 : 1);
      m.sacude = -3 * t2;
      m.oreja = b.oreja + 14 * t2;
      m.parpado = Math.max(b.parpado, loma(u, 2.3, 2.5, 2.8, 3));
      m.costillas = b.costillas.map((_, i) => 1.6 * t2 * (i % 2 ? 1 : 0.5));
      break;
    }
    case 'gruñe': {
      // Quiere gruñir: lo que le sale es una burbuja de sopa.
      const k = loma(u, 0.2, 0.6, 2.4, 3);
      m.cabeza = 12 * k;
      m.mastica = mezclar(b.mastica, 0.8, loma(u, 0.6, 0.8, 2, 2.2));
      m.burbuja = u < 0.8 ? 0 : Math.min(1, (u - 0.8) / 1.3);
      m.parpado = Math.max(b.parpado, arco((u - 2.15) / 0.25));
      m.sacude = u > 2.1 && u < 2.3 ? 1.4 : 0;
      break;
    }
    case 'colea': {
      // Mueve la cola a nadie; el palo se hamaca y le pega en la sexta.
      const k = loma(u, 0.1, 0.4, 2.2, 2.8);
      m.cola = b.cola + 30 * k * Math.sin(u * 13);
      m.palo = colgado(m.cola, 3 + 34 * k * Math.sin(u * 13 - 1.2));
      const golpe = Math.max(0, Math.sin(u * 13 - 1.2 - 0.9)) * k;
      m.costillas = b.costillas.map((_, i) => (i === 5 ? 3 * golpe : i === 4 ? golpe : 0));
      break;
    }
    case 'mira': {
      // Levanta la cabeza, mira largo a quien lo mira, pestañea despacio, y vuelve a comer.
      const k = loma(u, 0.2, 0.8, 2.5, 3.2);
      m.cabeza = 22 * k;
      m.mastica = b.mastica * (1 - k) + 0.05 * k;
      m.parpado = Math.max(b.parpado * (1 - k), loma(u, 1.4, 1.7, 1.9, 2.3));
      m.oreja = b.oreja * (1 - k);
      break;
    }
  }
  return m;
}

/** Dónde tiene el palo la punta que pega, a los `u` segundos del toque: de la sexta a la primera, y de vuelta. `null` si no está pasando. */
export function puntaDelPalo(u: number): number | null {
  const T = TOQUE_T;
  const [x1, x6] = [A.costillas.x[0]! + 1, A.costillas.x[5]! + 6];
  if (u >= T.ida[0] && u <= T.ida[1]) return mezclar(x6, x1, (u - T.ida[0]) / (T.ida[1] - T.ida[0]));
  if (u > T.ida[1] && u < T.vuelta[0]) return x1;
  if (u >= T.vuelta[0] && u <= T.vuelta[1]) return mezclar(x1, x6, (u - T.vuelta[0]) / (T.vuelta[1] - T.vuelta[0]));
  return null;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b };
  const fuerza = loma(u, 0, 0.3, T.cae[0], T.cae[1]);
  m.cola = b.cola + (18 + 16 * Math.sin(u * 15)) * fuerza;
  // El palo: de colgar a acostado sobre las costillas, con el nudo para el lado de la cola.
  const punta = puntaDelPalo(u);
  const sobre = rampa(u, T.sube[0], T.sube[1]) * (1 - rampa(u, T.cae[0], T.cae[1]));
  const px = punta ?? (u < T.ida[0] ? A.costillas.x[5]! + 6 : A.costillas.x[5]! + 6);
  const acostado: [number, number, number] = [px + A.palo / 2, -40 - 2.4 * Math.abs(Math.sin(u * 21)), 84 + 5 * Math.sin(u * 21)];
  m.palo = atado(mezclar3(colgado(m.cola, 3), acostado, sobre), m.cola);
  // Cada costilla salta cuando la punta le pasa por encima, a la ida y a la vuelta.
  m.costillas = A.costillas.x.map((x) => (punta === null ? 0 : 9 * Math.max(0, 1 - Math.abs(punta - x) / 7)));
  // Los cucharones se sacuden de la risa: cada uno a su ritmo.
  const risa = loma(u, T.risa[0], T.risa[0] + 0.2, T.risa[1] - 0.5, T.risa[1]);
  m.cucharones = [15 * risa * Math.sin(u * 23), 13 * risa * Math.sin(u * 27 + 2), 16 * risa * Math.sin(u * 21 + 4)];
  // Él come: el ojo a medio cerrar, la oreja que acusa cada golpe.
  m.parpado = Math.max(b.parpado, CONTADO.parpado * sobre);
  m.oreja = b.oreja - 6 * sobre * Math.abs(Math.sin(u * 21));
  return m;
}

export const CONFIG: Config<Momento, Accion> = {
  id: ID,
  clase: 'titere--manso',
  duran: DURA,
  solas: SOLAS,
  pausa: [1.4, 3.8],
  primera: [1, 2.6],
  demoraFicha: 1.9,
  ritmos: { pestanea: { cada: [2.4, 5.5], dura: 0.22 } },
  quieto: QUIETO,
  toca: CONTADO,
  base,
  accion: momentoDeAccion,
  toque: momentoDelToque,
  marcas,
  verso: VERSO,
};

export const armarMansoCon = (marcos: readonly SVGGElement[], esc: Parameters<typeof armarVida>[2], azar: () => number = Math.random) => armarVida(CONFIG, marcos, esc, azar);
export const armarManso = armarCon(CONFIG);
