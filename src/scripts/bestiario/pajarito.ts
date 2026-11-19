/**
 * El pajarito del Lavi-rap (`D-73`, vigesimonovena vuelta), en su jaula linda, colgada en la prisión.
 *
 * Es el pajarito de la suerte, y lo que hace solo casi nunca le sale. Nada es un bucle: elige qué intenta.
 *
 * - **Saca** un papelito del cajoncito: sale en blanco. Lo mira, y se le cae entre los barrotes.
 * - **Mira el precio**: se estira hasta la etiqueta, que se hamaca, y se echa para atrás.
 * - **Se rasca** el pecho pelado, y se le cae una pluma más.
 * - **Se hamaca**: salta dos veces en la percha y la jaula entera va y viene, con la etiqueta atrás.
 * - Respira, pestañea, y la jaula se mece apenas.
 *
 * Tocado, **da la buena** (*"si el pajarito da la buena"*): saca el papelito bueno, el de la tilde, lo levanta
 * con el pico y aletea; del salto, la etiqueta se da vuelta y del otro lado el precio sigue. Después guarda el
 * papelito. Con movimiento reducido no se mueve nada: tocarlo lo pasa de parado a con el papelito bueno en el pico.
 *
 * Se lleva números (`rig-pajarito.ts`) y nada que dibuje.
 */

import { BUENA, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-pajarito.ts';
import { aliento, arco, armarCon, armarVida, mezclar, suave, type Config } from './vida.ts';

const ID = 'el-pajarito-del-lavi-rap';

export type Accion = 'saca' | 'precio' | 'rasca' | 'hamaca';
const SOLAS = ['saca', 'precio', 'rasca', 'hamaca'] as const;

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { saca: 4, precio: 3.4, rasca: 3, hamaca: 3.6, toque: 4.8 } as const;
/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { busca: [0, 0.55], levanta: [0.75, 1.2], vuelta: [1.1, 1.7], guarda: [3.5, 4.1] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
/** Un vaivén que se apaga: lo que le queda a la jaula después de un salto. */
const vaiven = (u: number, desde: number, fuerza: number): number => (u < desde ? 0 : fuerza * Math.sin((u - desde) * 5.2) * Math.exp(-(u - desde) * 1.3));

/** La pose de base de un instante: parado, respira, pestañea; la jaula se mece apenas y la etiqueta llega después. */
export function base(t: number, ev: (n: string) => number): Momento {
  const p = ev('pestanea');
  return {
    ...QUIETO,
    mece: 1.4 * Math.sin(t * 0.9),
    etiqueta: 3.4 * Math.sin(t * 0.9 - 1.1),
    respira: aliento(t, 2.2),
    cola: 3 * Math.sin(t * 1.7),
    cabeza: 3 * Math.sin(t * 0.5 + 1),
    parpado: p >= 0 ? arco(p) : 0,
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Accion, u: number): Momento {
  const m: Momento = { ...b };
  switch (accion) {
    case 'saca': {
      // Se inclina al cajoncito, saca uno, lo mira: en blanco. Se le cae.
      const va = loma(u, 0, 0.5, 0.7, 1.1);
      m.inclina = 24 * va;
      m.cabeza = b.cabeza + 12 * va + 14 * loma(u, 1.3, 1.6, 2.1, 2.3) + 26 * loma(u, 2.3, 2.6, 3.2, 3.8);
      m.papel = u >= 0.55 && u < 2.2 ? 1 : 0;
      m.suelto = u < 2.2 ? 0 : Math.min(1, (u - 2.2) / 1.3);
      m.parpado = Math.max(b.parpado, arco((u - 1.7) / 0.2), arco((u - 1.95) / 0.2));
      m.cola = b.cola - 10 * loma(u, 2.2, 2.4, 3.2, 3.8);
      break;
    }
    case 'precio': {
      // Se estira para abajo hasta la etiqueta, que se hamaca; se echa para atrás del susto.
      const baja = loma(u, 0.1, 0.8, 1.7, 1.85);
      const susto = loma(u, 1.8, 1.9, 2.5, 3.2);
      m.inclina = 34 * baja - 8 * susto;
      m.cabeza = b.cabeza + 26 * baja - 12 * susto;
      m.etiqueta = b.etiqueta + 14 * loma(u, 0.6, 0.9, 2.4, 3.2) * Math.sin(u * 5);
      m.ala = -18 * susto;
      m.salto = 3 * arco((u - 1.8) / 0.25);
      break;
    }
    case 'rasca': {
      // Se picotea el pecho pelado, y se le cae una pluma.
      const k = loma(u, 0.1, 0.4, 1.5, 1.8);
      m.cabeza = b.cabeza + (34 + 8 * Math.sin(u * 22)) * k;
      m.ala = -8 * k;
      m.pluma = u < 1.3 ? 0 : Math.min(1, (u - 1.3) / 1.5);
      m.cabeza += 14 * loma(u, 1.9, 2.1, 2.6, 2.9);
      break;
    }
    case 'hamaca': {
      // Dos saltos en la percha, y la jaula va y viene; la etiqueta, atrás.
      m.salto = 7 * arco((u - 0.3) / 0.36) + 8 * arco((u - 0.9) / 0.4);
      m.ala = -30 * (arco((u - 0.3) / 0.36) + arco((u - 0.9) / 0.4));
      m.mece = b.mece + vaiven(u, 0.5, 5) + vaiven(u, 1.2, 4);
      m.etiqueta = b.etiqueta + vaiven(u, 0.75, 13) + vaiven(u, 1.45, 10);
      m.cola = b.cola + 14 * (arco((u - 0.3) / 0.36) + arco((u - 0.9) / 0.4));
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b };
  const busca = loma(u, T.busca[0], T.busca[1], T.levanta[0], T.levanta[1]);
  const guarda = loma(u, T.guarda[0], T.guarda[0] + 0.4, T.guarda[1], T.guarda[1] + 0.4);
  const arriba = rampa(u, T.levanta[0], T.levanta[1]) * (1 - rampa(u, T.guarda[0] - 0.2, T.guarda[0] + 0.3));
  m.inclina = 24 * (busca + guarda);
  m.cabeza = b.cabeza * (1 - arriba) + 12 * (busca + guarda) + BUENA.cabeza * arriba;
  // El papelito: lo tiene desde que lo saca hasta que lo guarda.
  const tiene = u >= T.busca[1] && u < T.guarda[0] + 0.45 ? 1 : 0;
  m.papel = tiene;
  m.buena = tiene;
  // Salta, aletea, y del salto la jaula se hamaca y la etiqueta se da vuelta.
  m.salto = 8 * arco((u - T.levanta[0]) / 0.42);
  m.ala = BUENA.ala * arriba * (0.6 + 0.4 * Math.abs(Math.sin(u * 13))) * (u < 2.6 ? 1 : 0.5 + 0.5 * (1 - rampa(u, 2.6, 3)));
  m.cola = b.cola + BUENA.cola * arriba;
  m.mece = b.mece + vaiven(u, T.levanta[0] + 0.3, 5);
  m.etiqueta = b.etiqueta + vaiven(u, T.levanta[0] + 0.5, 14) + BUENA.etiqueta * arriba;
  m.vuelta = rampa(u, T.vuelta[0], T.vuelta[1]) * (1 - rampa(u, T.guarda[1], T.guarda[1] + 0.5));
  m.parpado = Math.max(b.parpado * (1 - arriba), arco((u - 2.2) / 0.2));
  return m;
}

export const CONFIG: Config<Momento, Accion> = {
  id: ID,
  clase: 'titere--pajarito',
  duran: DURA,
  solas: SOLAS,
  pausa: [1, 3.2],
  primera: [0.8, 2.2],
  demoraFicha: 1.9,
  ritmos: { pestanea: { cada: [2, 5], dura: 0.2 } },
  quieto: QUIETO,
  toca: BUENA,
  base,
  accion: momentoDeAccion,
  toque: momentoDelToque,
  marcas,
  verso: VERSO,
};

export const armarPajaritoCon = (marcos: readonly SVGGElement[], esc: Parameters<typeof armarVida>[2], azar: () => number = Math.random) => armarVida(CONFIG, marcos, esc, azar);
export const armarPajarito = armarCon(CONFIG);
