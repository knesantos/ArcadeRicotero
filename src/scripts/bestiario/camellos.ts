/**
 * Los camellos prestigiosos (`D-73`, vigesimonovena vuelta), parados en la nieve con su cajón.
 *
 * Lo que hacen solos es despachar, y nada es un bucle: eligen cómo.
 *
 * - **Pesa un copo**: el joyero baja la pinza al platillo, la balanza se inclina, y mientras él se acerca con la lupa
 *   el copo se le derrite. La balanza vuelve sola. Mira el platillo vacío, pestañea dos veces, y agarra otro.
 * - **Vigila**: el campana estira el cogote para atrás, mirando por arriba del hombro, lo lleva para adelante, y le
 *   resbala una pata en el hielo: se va de costado, se endereza de un salto y mira si alguien lo vio.
 * - **Pasan un sobrecito**: el campana lo saca con la cola de abajo del sobretodo y lo revolea al cajón sin mirar; el
 *   joyero lo ve caer de reojo.
 * - Respiran, rumian cada tanto, pestañean, y la cola del campana se hamaca.
 *
 * Tocados (*"tu naturaleza te quiere"*) **se hacen los camellos**: se tiran a cuatro patas detrás de una polvareda de
 * nieve, con el sobretodo de manta y el cajón tapado como una joroba más, y rumian con cara de zoológico; uno olfatea la nieve. Un sobre se
 * les escapa de abajo del bulto y se quedan duros un instante. Después se paran de nuevo, y el campana mira para
 * atrás. Con movimiento reducido no se mueve nada: tocarlos los pasa de parados a cuatro patas.
 *
 * Se llevan números (`rig-camellos.ts`) y nada que dibuje.
 */

import { BRAZO_AL_PLATILLO, CAMELLOS_ARMADO, CAMELLOS_NOMAS, QUIETO, VERSO, marcas, puntaDeLaCola, type Momento, type Punto } from '../../lib/bestiario/rig-camellos.ts';
import { aliento, arco, armarCon, armarVida, mezclar, suave, type Config } from './vida.ts';

const ID = 'los-camellos-prestigiosos';

export type Accion = 'pesa' | 'vigila' | 'pase';
const SOLAS = ['pesa', 'vigila', 'pase'] as const;

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { pesa: 6, vigila: 5.6, pase: 4.8, toque: 6.6 } as const;
/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { cae: 0.22, pasta: [1.5, 2.9], escapa: [3.1, 3.6], duros: [3.5, 4.2], para: 5.1, fin: 6.6 } as const;
/** Cuándo se derrite el copo, en `pesa`, y cuándo resbala la pata, en `vigila`. */
export const PESA_T = { baja: [0.4, 1.1], derrite: [1.9, 3.1], otro: [5.1, 5.6] } as const;
export const RESBALA_T = [2.9, 3.15] as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const A = CAMELLOS_ARMADO;
const dos = (a: number, b: number): readonly [number, number] => [a, b];

/** Dónde cae el sobrecito en el cajón: al final de la fila. */
const EN_LA_FILA: Punto = [A.cajon.x0 + 16 + 4 * 11, A.cajon.tapa - 7];

/** La pose de base de un instante: despachando. */
export function base(t: number, ev: (n: string) => number): Momento {
  const r1 = ev('rumia');
  const r2 = ev('rumia2');
  const p1 = ev('pestanea');
  const p2 = ev('pestanea2');
  return {
    ...QUIETO,
    respira: aliento(t, 3.4),
    cogote: dos(QUIETO.cogote[0] + 1.5 * Math.sin(t * 0.5), QUIETO.cogote[1] + 2 * Math.sin(t * 0.4 + 1)),
    quijada: dos(r1 >= 0 ? 2.6 * Math.sin(r1 * Math.PI * 8) : 0, r2 >= 0 ? 2.6 * Math.sin(r2 * Math.PI * 8) : 0),
    parpado: dos(p1 >= 0 ? 1 : 0, p2 >= 0 ? 1 : 0),
    // Lo que cuelga llega después.
    cola: 7 * Math.sin(t * 0.9 - 0.8),
    balanza: QUIETO.balanza + 0.8 * Math.sin(t * 1.3),
  };
}

/** Lo que hacen a los `u` segundos de empezar una acción solos, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Accion, u: number): Momento {
  const m: Momento = { ...b };
  switch (accion) {
    case 'pesa': {
      // Baja la pinza al platillo; la balanza se inclina; se acerca con la lupa y el copo se le derrite.
      const T = PESA_T;
      const baja = loma(u, T.baja[0], T.baja[1], 3.2, 3.7);
      m.brazo = BRAZO_AL_PLATILLO * baja + 5 * loma(u, 4.6, 5, 5.2, 5.7);
      const queda = 1 - rampa(u, T.derrite[0], T.derrite[1]);
      m.copo = u < T.otro[0] ? queda : rampa(u, T.otro[0], T.otro[1]);
      const apoya = rampa(u, T.baja[1] - 0.1, T.baja[1] + 0.3) * (u < 3.3 ? 1 : 0);
      m.balanza = b.balanza + 10 * apoya * queda + 2.4 * Math.sin((u - T.baja[1]) * 16) * Math.exp(-Math.max(0, u - T.baja[1]) * 3) * apoya;
      // Se acerca, se queda mirando el platillo vacío, pestañea despacio dos veces y levanta la cabeza.
      m.cogote = dos(b.cogote[0] + 9 * loma(u, 1.2, 1.9, 4.2, 4.8) - 12 * loma(u, 4.4, 4.9, 5.4, 5.9), b.cogote[1]);
      m.parpado = dos((u > 3.5 && u < 3.75) || (u > 4 && u < 4.25) ? 1 : b.parpado[0], b.parpado[1]);
      break;
    }
    case 'vigila': {
      // Estira el cogote para atrás, lo lleva para adelante, y le resbala la pata.
      const [r0, r1] = RESBALA_T;
      const resbala = loma(u, r0, r1, 3.7, 4.2);
      m.pata = -56 * resbala;
      m.campana = [5 * resbala, 10 * resbala - 9 * arco((u - 3.7) / 0.5), 8 * resbala];
      m.cogote = dos(b.cogote[0], b.cogote[1] - 30 * loma(u, 0.3, 0.8, 1.4, 1.8) + 18 * loma(u, 1.7, 2.1, 2.6, 2.9) + 16 * resbala - 28 * loma(u, 4.5, 4.8, 5, 5.4));
      m.cola = b.cola + 40 * resbala;
      m.parpado = dos(b.parpado[0], u > r0 && u < 4.4 ? 0 : b.parpado[1]);
      break;
    }
    case 'pase': {
      // El campana levanta la cola con un sobrecito y lo revolea al cajón, sin mirar.
      const alza = loma(u, 0.5, 1.4, 1.6, 2.2);
      const latigo = arco((u - 1.4) / 0.3);
      m.cola = b.cola + 62 * alza + 30 * latigo;
      const [cx, cy] = puntaDeLaCola(m.cola, m);
      const vuela = rampa(u, 1.5, 2.3);
      m.sobre = [mezclar(cx, EN_LA_FILA[0], vuela), mezclar(cy, EN_LA_FILA[1], vuela) - 44 * arco(vuela), 360 * vuela - 20 * (1 - vuela)];
      m.sobreSe = u > 0.5 && u < 4.2 ? 1 : 0;
      // Mira para arriba, como silbando. El joyero lo ve caer de reojo y sigue.
      m.cogote = dos(b.cogote[0] - 12 * loma(u, 2.1, 2.5, 3.2, 3.8), b.cogote[1] - 16 * loma(u, 0.4, 1, 2.4, 3));
      m.parpado = dos(u > 2.9 && u < 3.2 ? 1 : b.parpado[0], b.parpado[1]);
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hacen a los `u` segundos de que los tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b };
  const abajo = u >= T.cae && u < T.para;
  m.parados = abajo ? 0 : 1;
  // Se tiran: los parados se hunden, la nieve salta y tapa el cambio. Y al pararse, lo mismo al revés.
  m.hunde = u < T.cae ? rampa(u, 0, T.cae) : u >= T.para ? 1 - rampa(u, T.para, T.para + 0.35) : 0;
  const nube1 = loma(u, 0.04, 0.2, 0.55, 1.2);
  const nube2 = loma(u, T.para - 0.22, T.para - 0.04, T.para + 0.3, T.para + 0.9);
  m.polvoSe = Math.max(nube1, nube2);
  // La polvareda llega a su tamaño antes del cambio de pose: si no, no lo tapa.
  m.polvo = u < 2 ? rampa(u, 0.02, T.cae + 0.06) : rampa(u, T.para - 0.24, T.para + 0.04);
  m.aplasta = abajo ? Math.exp(-(u - T.cae) * 5) * Math.cos((u - T.cae) * 9) : 0;
  // A cuatro patas rumian de costado, cada uno a su ritmo, y el campana baja el cogote a olfatear la nieve (poco: al lado trota Porco).
  const duros = loma(u, T.duros[0], T.duros[0] + 0.08, T.duros[1], T.duros[1] + 0.1);
  const rumia = abajo ? 1 - duros : 0;
  m.quijada = dos(b.quijada[0] * (1 - (abajo ? 1 : 0)) + 2.8 * Math.sin(u * 7.4) * rumia, b.quijada[1] * (1 - (abajo ? 1 : 0)) + 2.8 * Math.sin(u * 6.4 + 1) * rumia);
  const pasta = loma(u, T.pasta[0], T.pasta[0] + 0.5, T.pasta[1] - 0.5, T.pasta[1]);
  m.cogote4 = dos(CAMELLOS_NOMAS.cogote4[0] + 3 * Math.sin(u * 1.1) - 8 * duros, CAMELLOS_NOMAS.cogote4[1] + 24 * pasta + 4 * Math.sin(u * 0.9 + 1) - 6 * duros);
  // Pestañean de a uno, con cara de nada; cuando se les escapa el sobre, abren los ojos.
  m.parpado = dos(abajo && ((u > 1.1 && u < 1.3) || (u > 4.4 && u < 4.6)) ? 1 : abajo ? 0 : b.parpado[0], abajo && ((u > 0.8 && u < 1) || (u > 4.6 && u < 4.8)) ? 1 : abajo ? 0 : b.parpado[1]);
  m.suelto = CAMELLOS_NOMAS.suelto * rampa(u, T.escapa[0], T.escapa[1]);
  m.sueltoSe = u >= T.escapa[0] ? 1 : 0;
  // Ya parados: el joyero agarra otro copo y el campana mira para atrás, por las dudas.
  if (u >= T.para) {
    m.copo = rampa(u, T.para + 0.7, T.para + 1.2);
    m.cogote = dos(b.cogote[0], b.cogote[1] - 28 * loma(u, T.para + 0.5, T.para + 0.8, T.para + 1, T.para + 1.4));
    m.cola = b.cola + 30 * arco((u - T.para - 0.3) / 0.6);
  }
  return m;
}

export const CONFIG: Config<Momento, Accion> = {
  id: ID,
  clase: 'titere--camellos',
  duran: DURA,
  solas: SOLAS,
  pausa: [1.2, 3.4],
  primera: [0.8, 2],
  demoraFicha: 2.4,
  ritmos: { pestanea: { cada: [2.6, 5.4], dura: 0.2 }, pestanea2: { cada: [3, 6.2], dura: 0.2 }, rumia: { cada: [5, 10], dura: 1.8 }, rumia2: { cada: [4, 9], dura: 1.8 } },
  quieto: QUIETO,
  toca: CAMELLOS_NOMAS,
  base,
  accion: momentoDeAccion,
  toque: momentoDelToque,
  marcas,
  verso: VERSO,
};

export const armarCamellosCon = (marcos: readonly SVGGElement[], esc: Parameters<typeof armarVida>[2], azar: () => number = Math.random) => armarVida(CONFIG, marcos, esc, azar);
export const armarCamellos = armarCon(CONFIG);
