/**
 * El lobo caído (`D-73`, vigesimoctava vuelta), tirado entre las raíces con la trompetilla atada a la oreja.
 *
 * Lo que hace solo es no oír, y nada es un bucle: elige qué intenta.
 *
 * - **Oye**: la oreja de lejos se le para para un lado donde no hay nada, y vuelve a caer.
 * - **Intenta pararse**: levanta el pecho, las patas de adelante le tiemblan, y se cae de golpe.
 * - **Marca**: estira la pata, raspa con la uña un tanto más en la rodilla de raíz, y se duerme antes del quinto; los tantos
 *   vuelven a tres (*"maté… y maté…"* y nunca termina).
 * - **Sueña**: corre dormido: las patas se le mueven, la boca le tira un ladrido sin voz, la cola le da un golpe.
 * - Respira (se le cuentan las costillas) y, de vez en cuando, cruza el otro lobo por detrás, entero, sin que él se mueva:
 *   cuando ya pasó, abre un poco el ojo para el lado donde estuvo.
 *
 * Tocado, no se entera: pasa un rato sin que se le mueva una oreja. Después levanta la cabeza, para la oreja de la
 * trompetilla para quien lo toca y pregunta a los gritos, sin voz, tres veces (un tanto por grito); se cae, y los
 * tantos vuelven a tres. Con movimiento reducido no se mueve nada: tocarlo lo pasa de tirado a gritando.
 *
 * Se lleva números (`rig-lobocaido.ts`) y nada que dibuje.
 */

import { GRITA, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-lobocaido.ts';
import { aliento, arco, armarCon, armarVida, mezclar, suave, type Config } from './vida.ts';

const ID = 'el-lobo-caido';

export type Accion = 'oye' | 'intenta' | 'marca' | 'sueña';
const SOLAS = ['oye', 'intenta', 'marca', 'sueña'] as const;

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { oye: 2.2, intenta: 3.8, marca: 3.8, sueña: 3, toque: 6 } as const;
/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { sordo: [0, 1.3], levanta: [1.3, 2.1], grita: [2.1, 3.9], cae: [3.9, 4.8], gritos: [2.2, 2.9, 3.6] } as const;
/** Lo que tarda el otro lobo en cruzar, en segundos. */
export const CRUCE = 7;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));

/** La pose de base de un instante: tirado, respira, la cola floja, y a veces cruza el otro lobo. */
export function base(t: number, ev: (n: string) => number): Momento {
  const cruza = ev('cruza');
  const m: Momento = {
    ...QUIETO,
    respira: aliento(t, 3.4),
    cola: 3 * Math.sin(t * 0.5 - 1),
    orejas: [QUIETO.orejas[0], QUIETO.orejas[1]],
    parpado: 0.55 + 0.05 * Math.sin(t * 0.7),
  };
  if (cruza >= 0) {
    m.paso = cruza;
    m.zancada = Math.floor(t * 5) % 2;
    // Cuando el otro ya pasó, mira, tarde, para donde estuvo; las orejas no se le mueven nunca.
    m.parpado -= 0.4 * loma(cruza, 0.7, 0.8, 0.95, 1);
  }
  return m;
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Accion, u: number): Momento {
  const m: Momento = { ...b };
  switch (accion) {
    case 'oye': {
      // La oreja de lejos se para, tarde y para el lado equivocado; la de la trompetilla no se entera.
      const k = loma(u, 0.4, 0.6, 1.2, 1.7);
      m.orejas = [b.orejas[0], mezclar(b.orejas[1], 36, k) + 4 * Math.sin(u * 30) * k];
      m.cola = b.cola + 6 * k;
      break;
    }
    case 'intenta': {
      // Levanta el pecho, tiembla, se le doblan las patas y se cae de golpe.
      const sube = loma(u, 0, 1.6, 2.4, 2.55);
      m.alza = 24 * sube;
      m.inclina = -10 * sube;
      m.pata = -22 * sube;
      m.cabeza = mezclar(b.cabeza, -14, sube);
      m.parpado = mezclar(b.parpado, 0, rampa(u, 0, 0.6));
      m.tiembla = (0.9 * sube * Math.sin(u * 40)) + (u > 2.5 && u < 3.1 ? 1.8 * Math.sin((u - 2.5) * 50) * (1 - rampa(u, 2.5, 3.1)) : 0);
      m.quijada = 0.25 * loma(u, 1.2, 1.5, 2.3, 2.5);
      break;
    }
    case 'marca': {
      // Estira la pata, raspa un tanto, y se duerme antes del quinto: después los tantos vuelven a tres.
      const alcanza = loma(u, 0, 0.6, 2.6, 3.2);
      m.alcanza = 18 * alcanza;
      m.pata = -16 * alcanza + 5 * alcanza * Math.sin(u * 20) * loma(u, 0.8, 0.9, 1.5, 1.6);
      m.cabeza = mezclar(b.cabeza, -6, alcanza);
      m.parpado = mezclar(b.parpado, 0.15, alcanza) + 0.8 * rampa(u, 2.6, 3.1);
      const cuarto = rampa(u, 0.9, 1.4);
      const quinto = 0.5 * rampa(u, 1.9, 2.3);
      m.tantos = (b.tantos + cuarto + quinto) * (1 - rampa(u, 3.2, 3.7)) + b.tantos * rampa(u, 3.2, 3.7);
      break;
    }
    case 'sueña': {
      // Corre dormido: las patas, la boca sin voz, un golpe de cola.
      const k = loma(u, 0.3, 0.6, 2.2, 2.7);
      m.pata = 14 * k * Math.sin(u * 17);
      m.alcanza = 3 * k * Math.sin(u * 17 + 1);
      m.quijada = 0.35 * k * Math.abs(Math.sin(u * 11));
      m.cola = b.cola + 16 * k * Math.sin(u * 13);
      m.orejas = [b.orejas[0] + 5 * k * Math.sin(u * 9), b.orejas[1]];
      m.parpado = 1;
      m.tiembla = 0.4 * k * Math.sin(u * 30);
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b };
  // Primero no se entera: sigue tirado, sin una oreja, sin un pestañeo.
  const arriba = loma(u, T.levanta[0], T.levanta[1], T.cae[0], T.cae[1]);
  m.alza = GRITA.alza * arriba;
  m.inclina = GRITA.inclina * arriba;
  m.pata = GRITA.pata * arriba;
  m.cabeza = mezclar(b.cabeza, GRITA.cabeza, arriba);
  m.parpado = mezclar(b.parpado, 0, loma(u, T.levanta[0], T.levanta[1] + 0.2, T.cae[0], T.cae[1] + 0.3));
  // La oreja de la trompetilla se para para quien lo toca, y gira un poco buscando.
  m.orejas = [mezclar(b.orejas[0], GRITA.orejas[0], arriba) + 5 * arriba * Math.sin(u * 7), mezclar(b.orejas[1], 8, arriba)];
  // Grita sin voz tres veces, y con cada grito marca un tanto.
  const grito = (c: number): number => loma(u, c, c + 0.12, c + 0.42, c + 0.6);
  const [g1, g2, g3] = T.gritos;
  m.quijada = Math.max(grito(g1), grito(g2), grito(g3)) * 0.9;
  m.tantos = (3 + Math.min(2, rampa(u, g1 + 0.2, g1 + 0.4) + rampa(u, g2 + 0.2, g2 + 0.4))) * (1 - rampa(u, 5.0, 5.5)) + 3 * rampa(u, 5.0, 5.5);
  m.tiembla = 0.8 * loma(u, T.grita[0], T.grita[0] + 0.2, T.grita[1] - 0.2, T.grita[1]) * Math.sin(u * 45);
  m.cola = b.cola + 18 * arriba * Math.sin(u * 9);
  // Se cae de golpe, con un rebote.
  const rebote = u > T.cae[0] && u < T.cae[0] + 0.5 ? arco((u - T.cae[0]) / 0.5) * 5 : 0;
  m.alza += rebote;
  return m;
}

export const CONFIG: Config<Momento, Accion> = {
  id: ID,
  clase: 'titere--lobocaido',
  duran: DURA,
  solas: SOLAS,
  pausa: [1, 3.4],
  primera: [0.8, 2.2],
  demoraFicha: 1.8,
  // Cada tanto cruza el otro lobo: de a uno, raro.
  ritmos: { cruza: { cada: [14, 40], dura: CRUCE } },
  quieto: QUIETO,
  toca: GRITA,
  base,
  accion: momentoDeAccion,
  toque: momentoDelToque,
  marcas,
  verso: VERSO,
};

export const armarLobocaidoCon = (marcos: readonly SVGGElement[], esc: Parameters<typeof armarVida>[2], azar: () => number = Math.random) => armarVida(CONFIG, marcos, esc, azar);
export const armarLobocaido = armarCon(CONFIG);
