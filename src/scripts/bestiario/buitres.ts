/**
 * Los buitres de la tele (`D-73`, vigesimoctava vuelta), dos arriba de la antena, esperando la cena.
 *
 * Lo que hacen solos es esperar, y nada es un bucle: eligen cómo.
 *
 * - **Esperan**: bajan la vista para la pantalla de la tele y tamborilean con el cubierto, cada uno a su ritmo.
 * - **Cuchichean**: se acercan los dos, uno asiente y el otro le contesta un rato después.
 * - **Se afilan**: el cuchillo contra el tenedor, dos veces; en cada choque sale una chispa.
 * - **Se le suelta la servilleta**: a uno se le levanta con el viento, el cogote sale detrás, y vuelve a asentarse torcida.
 * - Respiran, pestañean y el segundo siempre lo hace un rato después que el primero.
 *
 * Tocados (*"estás frito, angelito"*) giran la cabeza de golpe para quien los toca, estiran el cogote, abren los ojos y
 * levantan los cubiertos, asienten tres veces, y después se hacen los que miraban para otro lado, con los ojos entornados.
 * Con movimiento reducido no se mueve nada: tocarlos los pasa de esperar a estar encima.
 *
 * Se llevan números (`rig-buitres.ts`) y nada que dibuje.
 */

import { ENCIMA, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-buitres.ts';
import { aliento, arco, armarCon, armarVida, mezclar, suave, type Config } from './vida.ts';

const ID = 'los-buitres-de-la-tele';

export type Accion = 'espera' | 'cuchichea' | 'afila' | 'servilleta';
const SOLAS = ['espera', 'cuchichea', 'afila', 'servilleta'] as const;

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { espera: 3.6, cuchichea: 3.4, afila: 3.4, servilleta: 3.8, toque: 5.6 } as const;
/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { gira: [0, 0.3], amenaza: [0.3, 2.4], disimula: [2.6, 4.4] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const dos = (a: number, b: number): readonly [number, number] => [a, b];

/** La pose de base de un instante: parados en el travesaño, mirando para abajo, respirando, con los cubiertos al costado. */
export function base(t: number, ev: (n: string) => number): Momento {
  const p1 = ev('pestanea');
  const p2 = ev('pestanea2');
  return {
    ...QUIETO,
    respira: aliento(t, 3),
    cuello: dos(QUIETO.cuello[0] + 2 * Math.sin(t * 0.5), QUIETO.cuello[1] + 2 * Math.sin(t * 0.43 + 1)),
    parpado: dos(p1 >= 0 ? Math.max(QUIETO.parpado[0], Math.sin(p1 * Math.PI)) : QUIETO.parpado[0], p2 >= 0 ? Math.max(QUIETO.parpado[1], Math.sin(p2 * Math.PI)) : QUIETO.parpado[1]),
    // Lo que cuelga llega después que el cuerpo.
    servilleta: dos(2 + 3 * Math.sin(t * 0.9 - 0.8), -2 - 3 * Math.sin(t * 0.8 - 1.3)),
    cubierto: dos(QUIETO.cubierto[0] + 2 * Math.sin(t * 0.6), QUIETO.cubierto[1] + 2 * Math.sin(t * 0.55 + 1)),
  };
}

/** Lo que hacen a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Accion, u: number): Momento {
  const m: Momento = { ...b };
  switch (accion) {
    case 'espera': {
      // Miran la pantalla de la tele, abajo, y tamborilean: el primero y después el segundo.
      const k = loma(u, 0, 0.7, 2.9, 3.6);
      m.cuello = dos(mezclar(b.cuello[0], 28, k), mezclar(b.cuello[1], 30, k));
      m.estira = dos(1 + 0.05 * k, 1 + 0.05 * k);
      const t1 = loma(u, 0.8, 1, 1.9, 2.1);
      const t2 = loma(u, 1.7, 1.9, 2.8, 3);
      m.cubierto = dos(b.cubierto[0] + 10 * t1 * Math.sin(u * 20), b.cubierto[1] + 10 * t2 * Math.sin(u * 20 + 1));
      break;
    }
    case 'cuchichea': {
      // Se acercan, uno asiente y el otro le contesta un rato después.
      const k = loma(u, 0, 0.6, 2.7, 3.3);
      const asiente = (d: number): number => Math.max(0, Math.sin((u - d) * 9)) * loma(u, d, d + 0.2, d + 1.3, d + 1.6);
      m.cuello = dos(mezclar(b.cuello[0], 24, k) + 8 * asiente(0.6), mezclar(b.cuello[1], 24, k) + 8 * asiente(1.5));
      m.estira = dos(1 + 0.08 * k, 1 + 0.08 * k);
      m.parpado = dos(Math.max(b.parpado[0], 0.5 * k), Math.max(b.parpado[1], 0.5 * k));
      m.servilleta = dos(b.servilleta[0] + 5 * asiente(0.6), b.servilleta[1] - 5 * asiente(1.5));
      break;
    }
    case 'afila': {
      // El cuchillo contra el tenedor: se levantan los dos, chocan dos veces y cada choque saca una chispa.
      const k = loma(u, 0, 0.6, 2.6, 3.3);
      const choque = (c: number): number => Math.max(0, 1 - Math.abs(u - c) / 0.12);
      const golpe = choque(1.2) + choque(2);
      m.cubierto = dos(mezclar(b.cubierto[0], 20, k) + 4 * golpe, mezclar(b.cubierto[1], 20, k) + 4 * golpe);
      m.chispa = Math.min(1, golpe);
      m.cuello = dos(mezclar(b.cuello[0], 18, k), mezclar(b.cuello[1], 18, k));
      m.sacude = dos(1.4 * golpe, -1.4 * golpe);
      break;
    }
    case 'servilleta': {
      // A uno se le levanta con el viento; el cogote sale tras ella; después queda torcida.
      const vuela = loma(u, 0.3, 0.6, 1.9, 2.5);
      m.servilleta = dos(b.servilleta[0] + 68 * vuela + 14 * vuela * Math.sin(u * 16) + 12 * rampa(u, 2.4, 3), b.servilleta[1]);
      const sigue = loma(u, 0.6, 1.1, 2, 2.6);
      m.cuello = dos(mezclar(b.cuello[0], -24, sigue), b.cuello[1]);
      m.estira = dos(1 + 0.16 * sigue, 1);
      m.salta = dos(2.4 * arco((u - 1.9) / 0.4), 0);
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hacen a los `u` segundos de que los tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b };
  // Giran de golpe para quien los toca, y se quedan encima.
  const encima = loma(u, T.gira[0], T.gira[1], T.disimula[0], T.disimula[0] + 0.5);
  m.estira = dos(mezclar(b.estira[0], ENCIMA.estira[0], encima), mezclar(b.estira[1], ENCIMA.estira[1], encima));
  m.parpado = dos(mezclar(b.parpado[0], 0, encima), mezclar(b.parpado[1], 0, encima));
  m.servilleta = dos(mezclar(b.servilleta[0], ENCIMA.servilleta[0], encima), mezclar(b.servilleta[1], ENCIMA.servilleta[1], encima));
  m.cubierto = dos(mezclar(b.cubierto[0], ENCIMA.cubierto[0], encima), mezclar(b.cubierto[1], ENCIMA.cubierto[1], encima));
  m.salta = dos(2 * encima + 5 * arco((u - 0.05) / 0.4), 2 * encima + 5 * arco((u - 0.15) / 0.4));
  // Asienten tres veces: "estás frito".
  const asiente = (c: number): number => arco((u - c) / 0.32);
  const nod = asiente(0.9) + asiente(1.3) + asiente(1.7);
  m.cuello = dos(mezclar(b.cuello[0], ENCIMA.cuello[0], encima) + 10 * nod, mezclar(b.cuello[1], ENCIMA.cuello[1], encima) + 10 * nod);
  m.chispa = Math.max(arco((u - 0.25) / 0.4), arco((u - 1.5) / 0.4)) * 0.9;
  m.sacude = dos(1.6 * encima * Math.sin(u * 40), -1.6 * encima * Math.sin(u * 40 + 1));
  // Después se hacen los que miraban para otro lado, con los ojos entornados.
  const disimula = loma(u, T.disimula[0], T.disimula[0] + 0.5, T.disimula[1], T.disimula[1] + 0.8);
  m.cuello = dos(mezclar(m.cuello[0], -24, disimula), mezclar(m.cuello[1], -30, disimula));
  m.parpado = dos(mezclar(m.parpado[0], 0.65, disimula), mezclar(m.parpado[1], 0.65, disimula));
  return m;
}

export const CONFIG: Config<Momento, Accion> = {
  id: ID,
  clase: 'titere--buitres',
  duran: DURA,
  solas: SOLAS,
  pausa: [0.8, 2.6],
  primera: [0.5, 1.6],
  demoraFicha: 1.6,
  // El segundo siempre pestañea un rato después que el primero.
  ritmos: { pestanea: { cada: [2.4, 5.2], dura: 0.2 }, pestanea2: { cada: [3, 6], dura: 0.2 } },
  quieto: QUIETO,
  toca: ENCIMA,
  base,
  accion: momentoDeAccion,
  toque: momentoDelToque,
  marcas,
  verso: VERSO,
};

export const armarBuitresCon = (marcos: readonly SVGGElement[], esc: Parameters<typeof armarVida>[2], azar: () => number = Math.random) => armarVida(CONFIG, marcos, esc, azar);
export const armarBuitres = armarCon(CONFIG);
