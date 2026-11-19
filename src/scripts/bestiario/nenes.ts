/**
 * Los nenes de oro (`D-73`, vigesimonovena vuelta, `T-529`), dos trofeos de natación en su podio, con el agua al tobillo.
 *
 * Son de metal: no respiran. Lo que hacen solos es posar, y les sale a medias. Nada es un bucle: eligen qué les toca.
 *
 * - **Se lustra**: uno baja los brazos, se frota el costado, rechina, y le salta un destello. El otro, nada.
 * - **Larga en falso**: uno se tira solo. Queda clavado de cabeza, con las piernas afuera, temblando. El otro ni se
 *   mueve: brilla. El que se tiró se va a pique y vuelve trepando por atrás de su pedestal.
 * - **Pagan**: la marea sube y tapa la plaquita (*"cuando la marea los quiere tapar"*); sueltan un pagaré cada uno,
 *   hecho barquito, y el agua baja (*"pagan con promesas"*). Los barquitos se alejan y se hunden.
 * - **Chupan**: sube una burbuja por la botella del suero (*"Pepsi inyectable, dame más"*) y les agarra un temblor.
 * - Siempre: la espuma se mece contra el podio, la marea respira apenas y cada tanto les corre un destello.
 *
 * Tocados, hacen todo junto y bien: la marea sube, pagan, baja, y **se tiran los dos a la vez**, uno para cada lado.
 * Quedan clavados de cabeza, tiesos, con las piernas de oro afuera del agua; uno entra torcido. Se van a pique y
 * vuelven trepando. Dicen su verso. Con movimiento reducido no se mueve nada: tocarlos los pasa de posando a la
 * largada en falso, con la marea a medio subir.
 *
 * Se lleva números (`rig-nenes.ts`) y nada que dibuje.
 */

import { CLAVADO, QUIETO, VERSO, marcas, type Dos, type Momento } from '../../lib/bestiario/rig-nenes.ts';
import { armarCon, armarVida, mezclar, suave, type Config } from './vida.ts';

const ID = 'los-nenes-de-oro';

export type Accion = 'lustra' | 'falsa' | 'pagan' | 'chupan';
const SOLAS = ['lustra', 'falsa', 'pagan', 'chupan'] as const;

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { lustra: 3.2, falsa: 6.4, pagan: 6, chupan: 2.8, toque: 9 } as const;
/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { sube: [0, 1], pagan: [0.9, 5.6], baja: [1.7, 2.7], saltan: [2.9, 3.8], clavados: [3.8, 5.9], pique: [5.9, 6.5], trepan: [6.9, 8.3] } as const;
/** Los tiempos de la largada en falso. */
export const FALSA_T = { salta: [0.3, 1.2], clavado: [1.2, 3.3], pique: [3.3, 3.9], trepa: [4.3, 5.7] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const lineal = (u: number, a: number, b: number): number => Math.min(1, Math.max(0, (u - a) / (b - a)));
const par = (a: number, b: number, quien: 0 | 1): Dos => (quien ? [b, a] : [a, b]);

/** El valor de `salto` (0 a 3) a los `u` segundos, dados los tiempos de saltar, quedar clavado, irse a pique y trepar. */
export function saltoEn(u: number, T: { salta: readonly [number, number]; clavado: readonly [number, number]; pique: readonly [number, number]; trepa: readonly [number, number] }): number {
  // Sube despacio y cae de golpe: el salto arranca lento y entra rápido.
  const s = lineal(u, T.salta[0], T.salta[1]) ** 1.5 + 0.7 * lineal(u, T.clavado[0], T.clavado[1]) + 0.3 * lineal(u, T.pique[0], T.pique[1]) + lineal(u, T.trepa[0], T.trepa[1]);
  return s >= 3 ? 0 : s;
}

/** La pose de base de un instante: posan. La espuma se mece, la marea respira, y cada tanto les corre un destello. */
export function base(t: number, ev: (n: string) => number): Momento {
  const a = ev('destello-a');
  const b = ev('destello-b');
  return {
    ...QUIETO,
    reloj: t,
    mece: Math.sin(t * 1.3),
    marea: 0.05 + 0.05 * Math.sin(t * 0.45),
    brillo: [a >= 0 ? Math.sin(a * Math.PI) : 0, b >= 0 ? Math.sin(b * Math.PI) : 0],
    botella: 1.6 * Math.sin(t * 0.8),
  };
}

/** A quién le toca en una acción que empezó a los `t0` segundos: al A o al B. */
export const leToca = (t0: number): 0 | 1 => (Math.floor(t0 * 10) % 2 ? 1 : 0);

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Accion, u: number): Momento {
  const m: Momento = { ...b };
  const quien = leToca(b.reloj - u);
  switch (accion) {
    case 'lustra': {
      // Baja los brazos, se frota el costado, rechina, y le salta el destello.
      const baja = loma(u, 0, 0.7, 2.3, 3);
      const frota = loma(u, 0.7, 0.9, 2.1, 2.3);
      m.brazos = par(150 * baja + 9 * frota * Math.sin(u * 20), 0, quien);
      m.inclina = par(5 * baja, 0, quien);
      m.tiembla = par(0.9 * frota * Math.sin(u * 60), 0, quien);
      m.brillo = par(Math.max(b.brillo[quien], loma(u, 2.2, 2.4, 2.8, 3.2)), b.brillo[quien ? 0 : 1], quien);
      break;
    }
    case 'falsa': {
      // Uno se tira solo. El otro ni se mueve: brilla.
      const T = FALSA_T;
      const s = saltoEn(u, T);
      const clavado = loma(u, T.clavado[0], T.clavado[0] + 0.2, T.clavado[1] - 0.2, T.clavado[1]);
      m.salto = par(s, 0, quien);
      m.tiembla = par(3.4 * clavado * Math.sin(u * 30) * (0.4 + 0.6 * rampa(u, 1.6, 3)), 0, quien);
      m.torcido = par(-8 * clavado, 0, quien);
      m.brillo = par(0, loma(u, 1.5, 1.8, 2.6, 3.2), quien);
      break;
    }
    case 'pagan': {
      // La marea sube, pagan con un barquito cada uno, y baja. Los barquitos se alejan y se hunden.
      m.marea = mezclar(b.marea, 1, loma(u, 0, 1.4, 2.4, 3.6));
      m.barco = [lineal(u, 1.2, 5.6), lineal(u, 1.5, 5.9)];
      m.brazos = [-10 * loma(u, 1.0, 1.2, 1.5, 1.9), -10 * loma(u, 1.3, 1.5, 1.8, 2.2)];
      break;
    }
    case 'chupan': {
      // Sube la burbuja por la botella, y les agarra el temblor.
      m.burbuja = lineal(u, 0.2, 1.4);
      m.botella = b.botella + 5 * loma(u, 0.1, 0.4, 1.2, 2.2) * Math.sin(u * 9);
      const k = loma(u, 1.1, 1.3, 1.9, 2.4);
      m.tiembla = [1.6 * k * Math.sin(u * 50), 1.6 * k * Math.sin(u * 50 + 2)];
      m.brillo = [Math.max(b.brillo[0], loma(u, 1.8, 2, 2.3, 2.7)), Math.max(b.brillo[1], loma(u, 1.9, 2.1, 2.4, 2.8))];
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hacen a los `u` segundos de que los tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b };
  // La marea sube y tapa la plaquita; pagan; baja.
  m.marea = mezclar(b.marea, 1, loma(u, T.sube[0], T.sube[1], T.baja[0], T.baja[1]));
  m.barco = [lineal(u, T.pagan[0], T.pagan[1]), lineal(u, T.pagan[0] + 0.15, T.pagan[1] + 0.15)];
  m.brazos = [-10 * loma(u, 0.7, 0.9, 1.1, 1.5), -10 * loma(u, 0.85, 1.05, 1.25, 1.65)];
  // Se tiran los dos a la vez, uno para cada lado.
  const s = saltoEn(u, { salta: T.saltan, clavado: T.clavados, pique: T.pique, trepa: T.trepan });
  m.salto = [s, s];
  // Clavados, tiesos: les tiemblan las piernas del esfuerzo, y el A entró torcido.
  const clavado = loma(u, T.clavados[0], T.clavados[0] + 0.2, T.clavados[1] - 0.2, T.clavados[1]);
  const esfuerzo = clavado * (0.3 + 0.7 * rampa(u, 4.4, 5.6));
  m.tiembla = [3 * esfuerzo * Math.sin(u * 31), 2.4 * esfuerzo * Math.sin(u * 29 + 1)];
  m.torcido = [16 * rampa(u, T.clavados[0], T.clavados[0] + 0.5), 0];
  // De vuelta en el pedestal, chorreando, les corre el destello.
  m.brillo = [loma(u, 8.3, 8.45, 8.6, 8.95), loma(u, 8.35, 8.5, 8.65, 9)];
  return m;
}

export const CONFIG: Config<Momento, Accion> = {
  id: ID,
  clase: 'titere--nenes',
  duran: DURA,
  solas: SOLAS,
  pausa: [1.6, 4],
  primera: [1, 2.6],
  demoraFicha: 4.2,
  ritmos: { 'destello-a': { cada: [5, 12], dura: 0.9 }, 'destello-b': { cada: [6, 13], dura: 0.9 } },
  quieto: QUIETO,
  toca: CLAVADO,
  base,
  accion: momentoDeAccion,
  toque: momentoDelToque,
  marcas,
  verso: VERSO,
};

export const armarNenesCon = (marcos: readonly SVGGElement[], esc: Parameters<typeof armarVida>[2], azar: () => number = Math.random) => armarVida(CONFIG, marcos, esc, azar);
export const armarNenes = armarCon(CONFIG);
