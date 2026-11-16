/**
 * El animal que no late (`D-73`, vigesimonovena vuelta, `T-529`), embalsamado en su peana, bajo su nube.
 *
 * No respira: es lo único del monte que no respira. Lo que se mueve es lo que le pasa, y nada es un bucle:
 *
 * - **Sopla**: una ráfaga le levanta el flequillo (*"el nene sopla el flequillo"*), le peina la paja y le hamaca la
 *   etiqueta; la peana rueda un poquito y vuelve.
 * - **Pierde un ojo**: el ojo de vidrio se le suelta, cae a la peana, rueda hasta el canto, duda, vuelve rodando y de
 *   un salto se le mete en la cuenca. Él, nada.
 * - **Amaga**: la nube se hincha, la lluvia aprieta, chisporrotea… y el rayo no sale. Se desinfla.
 * - **Sintoniza**: la puertita del pecho se abre un poco sola, la antena sube a medias, la radio agarra medio compás
 *   y se corta: la puertita se cierra de un golpe.
 * - Siempre le llueve, a él solo, y la nube deriva apenas.
 *
 * Tocado, **la nube le tira el rayo a la antena** (*"cuando esa tormenta suena"*): la puertita se abre de par en par,
 * la radio suena (*"rata-ta-ta"*: tiembla en su hueco, vibra la antena, salta la paja, repiquetean las patas) y el bicho baila tres compases, tieso, bamboleándose en la varilla, con la pata en
 * alto y la peana rodando para un lado y para el otro (*"y la vas de bailarín"*). Después se corta, la puertita se
 * cierra, la antena baja y queda como estaba. Dice su verso. Con movimiento reducido no se mueve nada: tocarlo lo
 * pasa de tieso a sonando.
 *
 * Se lleva números (`rig-nolate.ts`) y nada que dibuje.
 */

import { ASOMA, ENTORNADA, QUIETO, SUENA, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-nolate.ts';
import { armarCon, armarVida, mezclar, suave, type Config } from './vida.ts';

const ID = 'el-animal-que-no-late';

export type Accion = 'sopla' | 'ojo' | 'amaga' | 'sintoniza';
const SOLAS = ['sopla', 'ojo', 'amaga', 'sintoniza'] as const;

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { sopla: 2.8, ojo: 5.4, amaga: 3.6, sintoniza: 3.4, toque: 7.2 } as const;
/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { rayo: [0, 0.7], abre: [0.45, 1.0], suena: [1.0, 4.6], cierra: [4.6, 5.3], asienta: [5.3, 6.6] } as const;
/** Cuánto dura un compás, y en qué momentos del compás pega la radio: ra-ta-ta, y un silencio. */
export const COMPAS = 1.2;
export const GOLPES = [0, 0.22, 0.44] as const;
/** Lo que tarda la lluvia en bajar un tramo, en segundos. */
export const CAE = 0.5;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));

/** Cuánto pega la radio a los `v` segundos de empezar a sonar (0 a 1): un golpe seco que se apaga, tres por compás. */
export function golpe(v: number): number {
  if (v < 0) return 0;
  const p = (v % COMPAS) / COMPAS;
  let g = 0;
  for (const c of GOLPES) if (p >= c) g = Math.max(g, 1 - (p - c) / 0.2);
  return Math.max(0, g);
}

/** La pose de base de un instante: tieso. No respira; le llueve, y la nube deriva apenas. */
export function base(t: number): Momento {
  return { ...QUIETO, lluvia: t / CAE, deriva: 3 * Math.sin(t * 0.23), etiqueta: 2 * Math.sin(t * 0.9), flequillo: 2 * Math.sin(t * 1.3 + 1) };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Accion, u: number): Momento {
  const m: Momento = { ...b };
  switch (accion) {
    case 'sopla': {
      // La ráfaga llega de golpe y se va despacio; lo que cuelga llega después y se queda hamacando.
      const k = loma(u, 0.1, 0.4, 1.2, 2.2);
      const cola = loma(u, 0.3, 0.7, 1.5, DURA.sopla);
      m.flequillo = b.flequillo - 52 * k + 8 * k * Math.sin(u * 22);
      m.paja = 14 * cola + 3 * cola * Math.sin(u * 17);
      m.etiqueta = b.etiqueta - 26 * cola + 12 * cola * Math.sin(u * 6);
      m.cola = 5 * cola * Math.sin(u * 19);
      m.rueda = -5 * loma(u, 0.2, 0.9, 1.4, 2.6);
      m.deriva = b.deriva - 7 * cola;
      break;
    }
    case 'ojo': {
      m.ojo = Math.min(1, u / (DURA.ojo - 0.3));
      break;
    }
    case 'amaga': {
      // Se hincha, aprieta la lluvia, chisporrotea tres veces, y nada.
      const k = loma(u, 0, 1.2, 2.5, DURA.amaga);
      m.hincha = k;
      m.fuerza = mezclar(b.fuerza, 1, k);
      m.chispa = loma(u, 1.2, 1.3, 2.3, 2.4) * (Math.sin(u * 31) > 0.2 ? 1 : 0.15);
      m.flequillo = b.flequillo + 6 * k;
      break;
    }
    case 'sintoniza': {
      // La puertita se abre un poco, la antena sube a medias, agarra medio compás y se corta de un golpe.
      const abre = loma(u, 0, 0.9, 2.4, 2.52);
      m.puerta = mezclar(ENTORNADA, 0.5, abre) - (u > 2.52 ? ENTORNADA * (1 - rampa(u, 2.7, 3.2)) : 0);
      m.antena = mezclar(ASOMA, 0.62, loma(u, 0.3, 1.2, 2.4, 2.9));
      const suena = u > 1.3 && u < 2.1 ? golpe(u - 1.3) : 0;
      m.suena = 0.6 * suena;
      m.vibra = Math.sin(u * 70);
      m.baila = -1.6 * suena;
      m.pata = b.pata - 8 * suena;
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b };
  // La nube se hincha y le tira el rayo a la antena: dos fogonazos.
  m.hincha = loma(u, 0, 0.25, T.suena[1], T.cierra[1]);
  m.rayo = Math.max(loma(u, 0.2, 0.26, 0.4, 0.5), loma(u, 0.52, 0.56, 0.62, T.rayo[1]));
  m.fuerza = mezclar(b.fuerza, 1, m.hincha);
  // La antena sube de un tirón, la puertita se abre de par en par.
  const prendida = loma(u, T.abre[0], T.abre[1], T.cierra[0], T.cierra[1]);
  m.antena = mezclar(ASOMA, 1, loma(u, 0.1, 0.45, T.cierra[0] + 0.2, T.asienta[0] + 0.3));
  m.puerta = mezclar(ENTORNADA, 1, prendida);
  // Suena: tres golpes por compás. Con cada golpe se bambolea para un lado, tieso, y la peana rueda al revés.
  const v = u - T.suena[0];
  const sonando = u >= T.suena[0] && u < T.suena[1];
  const g = sonando ? golpe(v) : 0;
  const compas = sonando ? Math.floor(v / COMPAS) : 0;
  const lado = compas % 2 ? 1 : -1;
  const vaiven = sonando ? Math.sin((v / COMPAS) * Math.PI * 2) : 0;
  // El sonido no se dibuja: es lo que sacude. La radio tiembla, la antena vibra, la paja salta, las patas repiquetean.
  m.suena = prendida * g;
  m.vibra = Math.sin(u * 70);
  m.baila = prendida * (lado * 4 * vaiven * vaiven - 3 * g);
  m.rueda = 9 * prendida * (sonando ? Math.sin((v / (COMPAS * 2)) * Math.PI * 2) : 0);
  // La pata en alto hace el brazo del bailarín: sube con el compás y marca los golpes.
  m.pata = mezclar(b.pata, -30, prendida) - 8 * g;
  // Lo que cuelga llega después.
  const tarde = sonando ? Math.sin(((v - 0.18) / COMPAS) * Math.PI * 2) : 0;
  m.flequillo = b.flequillo + prendida * (14 * tarde - 10 * g);
  m.paja = prendida * 7 * tarde;
  m.etiqueta = b.etiqueta - prendida * 16 * tarde;
  m.cola = prendida * 6 * g;
  // Se corta: un último bamboleo que se apaga, y queda tieso.
  const queda = loma(u, T.asienta[0], T.asienta[0] + 0.1, T.asienta[0] + 0.3, T.asienta[1]);
  m.baila += 2.4 * queda * Math.sin((u - T.asienta[0]) * 14);
  return m;
}

export const CONFIG: Config<Momento, Accion> = {
  id: ID,
  clase: 'titere--nolate',
  duran: DURA,
  solas: SOLAS,
  pausa: [1.6, 4.2],
  primera: [1, 2.4],
  demoraFicha: 1.6,
  ritmos: {},
  quieto: QUIETO,
  toca: SUENA,
  base: (t) => base(t),
  accion: momentoDeAccion,
  toque: momentoDelToque,
  marcas,
  verso: VERSO,
};

export const armarNolateCon = (marcos: readonly SVGGElement[], esc: Parameters<typeof armarVida>[2], azar: () => number = Math.random) => armarVida(CONFIG, marcos, esc, azar);
export const armarNolate = armarCon(CONFIG);
