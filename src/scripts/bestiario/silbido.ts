/**
 * El gato que llamás con silbidos (`D-73`, vigesimonovena vuelta), sentado de espaldas en su señal de tren.
 *
 * No viene. Lo que hace solo es esperar un tren, y nada es un bucle: elige qué le pasa.
 *
 * - **Le llega** un silbido de alguien: le rebota en el lomo y cae al montón de la tabla. Gira una oreja y nada
 *   más. El montón crece: cada silbido al que no le hace caso suma uno, hasta que no entra otro.
 * - **Amaga**: cree que oyó el tren; se para a medias, con la oreja para allá. No era. Se sienta.
 * - **Le late** el atadito (*"algo me late y no es mi corazón"*): tres latidos, lo mira, y para.
 * - **Cabecea**: se duerme sentado, se va para adelante, y se endereza de golpe antes de caerse.
 * - Respira, pestañea, y la cola le cuelga y se mece.
 *
 * Tocado, **lo llamás con un silbido**: le llega uno grande, le pega en el lomo, y él gira una oreja. Nada más.
 * Entonces baja el brazo de la señal y pasa el tren, lejos, detrás de los techos, con su propio silbido: a ese sí.
 * Se para, se agazapa para saltar… y el tren ya pasó (*"el futuro llegó hace rato"*). Se le caen las orejas, se
 * sienta despacio, y barre de la tabla con la cola todos los silbidos juntados: el montón vuelve a empezar. Con
 * movimiento reducido no se mueve nada: tocarlo lo pasa de sentado a parado, con la señal baja y el tren yéndose.
 *
 * Se lleva números (`rig-silbido.ts`) y nada que dibuje. El montón es lo único que recuerda: cuántos silbidos
 * juntó vive en cada gato armado (`crear`), no en el módulo.
 */

import { QUIETO, SILBIDO_ARMADO as A, TREN, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-silbido.ts';
import { aliento, arco, armarVida, mezclar, suave, type Config } from './vida.ts';
import type { Armar } from './vivos.ts';

const ID = 'el-gato-que-llamas-con-silbidos';

export type Accion = 'llega' | 'amaga' | 'late' | 'cabecea';
const SOLAS = ['llega', 'amaga', 'late', 'cabecea'] as const;

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { llega: 2.6, amaga: 3.8, late: 3.4, cabecea: 4, toque: 6.2 } as const;
/** Cuánto tarda un silbido de alguien en llegar al montón. */
export const VUELO = 1;
/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { silbido: [0, 1], oreja: [0.5, 1.4], senal: [1.5, 1.75], tren: [1.6, 4.3], para: [2, 2.6], agazapa: [2.7, 3.2], tarde: [3.6, 4.2], sienta: [4.2, 5.2], barre: [5.2, 5.9] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));

/** La pose de base de un instante: sentado, respira, pestañea; la cola cuelga y se mece. El montón lo pone quien lleva la cuenta. */
export function base(t: number, ev: (n: string) => number): Momento {
  const p = ev('pestanea');
  const o = ev('oreja');
  return {
    ...QUIETO,
    respira: aliento(t, 3),
    cola: 5 * Math.sin(t * 0.8) + 2 * Math.sin(t * 2.1),
    cabeza: 2 * Math.sin(t * 0.4),
    orejas: [o >= 0 ? -16 * arco(o) : 0, 0],
    atadito: 1.5 * Math.sin(t * 0.8 - 1),
    parpado: Math.max(QUIETO.parpado, p >= 0 ? arco(p) : 0),
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Accion, u: number): Momento {
  const m: Momento = { ...b };
  switch (accion) {
    case 'llega': {
      // Le llega un silbido, le rebota en el lomo y cae al montón. Gira una oreja, y nada más.
      m.silbido = Math.min(1, u / VUELO);
      m.orejas = [b.orejas[0] - 50 * loma(u, 0.55, 0.75, 1.5, 2), b.orejas[1]];
      m.cola = b.cola + 12 * loma(u, 0.6, 0.8, 1.2, 1.8);
      break;
    }
    case 'amaga': {
      // Cree que oyó el tren: se para a medias. No era.
      const k = loma(u, 0.5, 1.1, 2.3, 3.4);
      m.para = 0.6 * k;
      m.cabeza = b.cabeza - 8 * k;
      m.orejas = [b.orejas[0] + 8 * k, b.orejas[1] + 22 * loma(u, 0.2, 0.5, 2.1, 2.6)];
      m.parpado = b.parpado * (1 - k) + 0.6 * loma(u, 2.6, 3, 3.3, 3.8);
      m.cola = b.cola + 18 * k;
      break;
    }
    case 'late': {
      // Algo le late, y no es su corazón: el atadito. Lo mira, y para.
      const late = (c: number): number => arco((u - c) / 0.28);
      m.late = Math.max(late(0.4), late(0.9), late(1.4));
      m.atadito = b.atadito - 4 * m.late;
      m.cabeza = b.cabeza + 16 * loma(u, 1.2, 1.6, 2.4, 3);
      m.orejas = [b.orejas[0] - 20 * loma(u, 0.4, 0.6, 2.4, 3), b.orejas[1]];
      m.parpado = b.parpado * (1 - loma(u, 1.2, 1.5, 2.4, 2.8));
      break;
    }
    case 'cabecea': {
      // Se duerme sentado, se va para adelante, y se endereza de golpe.
      const cae = rampa(u, 0.4, 2.4) * (u < 2.5 ? 1 : 0);
      const susto = u >= 2.5 ? Math.exp(-(u - 2.5) * 3) : 0;
      m.parpado = Math.max(b.parpado, rampa(u, 0.2, 1) * (u < 2.5 ? 1 : 0));
      m.agazapa = 15 * cae - 4 * susto * Math.sin((u - 2.5) * 16);
      m.cabeza = b.cabeza + 18 * cae;
      m.orejas = [b.orejas[0] - 14 * cae + 16 * susto, b.orejas[1] - 14 * cae + 16 * susto];
      m.cola = b.cola + 40 * susto;
      m.para = 0.25 * susto;
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b };
  // El silbido de quien toca: grande, le pega en el lomo y cae al montón. Gira una oreja, y nada más.
  m.grande = 1;
  m.silbido = Math.min(1, (u - T.silbido[0]) / (T.silbido[1] - T.silbido[0]));
  const oye = loma(u, T.oreja[0], T.oreja[0] + 0.2, T.oreja[1] - 0.3, T.oreja[1]);
  // La señal baja de golpe, con un rebote, y sube cuando ya no hay nada que esperar.
  const baja = rampa(u, T.senal[0], T.senal[1]) * (1 - rampa(u, T.sienta[0] + 0.3, T.sienta[0] + 0.6));
  m.brazo = TREN.brazo * baja + (u > T.senal[1] && u < T.senal[1] + 0.5 ? 6 * Math.sin((u - T.senal[1]) * 20) * (1 - (u - T.senal[1]) / 0.5) : 0);
  m.tren = u < T.tren[0] ? 0 : Math.min(1, (u - T.tren[0]) / (T.tren[1] - T.tren[0]));
  // A ese silbido sí: se para, se agazapa para saltar, y el tren ya pasó.
  const para = rampa(u, T.para[0], T.para[1]) * (1 - rampa(u, T.sienta[0], T.sienta[1]));
  const salta = rampa(u, T.agazapa[0], T.agazapa[1]) * (1 - rampa(u, T.tarde[0], T.tarde[1]));
  const tarde = rampa(u, T.tarde[0], T.tarde[1]) * (1 - rampa(u, T.sienta[1] - 0.2, T.sienta[1] + 0.4));
  m.para = para;
  m.agazapa = TREN.agazapa * salta;
  m.cabeza = mezclar(b.cabeza, TREN.cabeza, para) + 16 * tarde;
  m.orejas = [b.orejas[0] - 56 * oye + TREN.orejas[0] * para * (1 - tarde) - 34 * tarde, b.orejas[1] + 18 * rampa(u, T.senal[0], T.para[0]) * (1 - tarde) - 34 * tarde];
  m.parpado = mezclar(b.parpado, 0, para) + 0.5 * tarde;
  m.atadito = b.atadito + TREN.atadito * para;
  m.cola = b.cola + TREN.cola * para * (1 - tarde) + 8 * salta * Math.sin(u * 20);
  // Lo último: barre el montón de la tabla, con la cola.
  const golpe = loma(u, T.barre[0], T.barre[0] + 0.25, T.barre[0] + 0.4, T.barre[1]);
  m.cola += 60 * golpe;
  m.barre = rampa(u, T.barre[0] + 0.15, T.barre[1]);
  return m;
}

/**
 * La configuración de un gato, con su cuenta: cuántos silbidos tiene juntados en la tabla. Cada silbido que le
 * llega suma uno, hasta el tope; el toque suma el de quien toca y al final los barre todos.
 */
export function crear(): Config<Momento, Accion> {
  let cuenta = 0;
  let antes = Infinity;
  let sumado = false;
  /** Una acción nueva arranca con `u` más chico que el del cuadro anterior: se puede volver a sumar. */
  const paso = (u: number): void => {
    if (u < antes) sumado = false;
    antes = u;
  };
  const sumar = (): void => {
    if (sumado) return;
    sumado = true;
    cuenta = Math.min(A.tope, cuenta + 1);
  };
  return {
    id: ID,
    clase: 'titere--silbido',
    duran: DURA,
    solas: SOLAS,
    pausa: [1.6, 4.2],
    primera: [1.2, 2.8],
    demoraFicha: 2.6,
    ritmos: { pestanea: { cada: [3, 6], dura: 0.24 }, oreja: { cada: [5, 11], dura: 0.5 } },
    quieto: QUIETO,
    toca: TREN,
    base: (t, ev) => ({ ...base(t, ev), pila: cuenta }),
    accion: (b, a, u) => {
      paso(u);
      if (a === 'llega' && u >= VUELO) sumar();
      return { ...momentoDeAccion(b, a, u), pila: cuenta };
    },
    toque: (b, u) => {
      paso(u);
      if (u >= TOQUE_T.silbido[1]) sumar();
      const m = momentoDelToque(b, u);
      m.pila = cuenta;
      // Barridos: cuando ya no se ven, la cuenta vuelve a cero.
      if (u >= TOQUE_T.barre[1]) cuenta = 0;
      return m;
    },
    marcas,
    verso: VERSO,
  };
}

export const armarSilbidoCon = (marcos: readonly SVGGElement[], esc: Parameters<typeof armarVida>[2], azar: () => number = Math.random) => armarVida(crear(), marcos, esc, azar);
export const armarSilbido: Armar = (marcos, esc) => armarVida(crear(), marcos, esc, Math.random);
