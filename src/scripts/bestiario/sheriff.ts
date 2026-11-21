/**
 * El Sheriff (`D-73`, vigesimonovena vuelta, `T-529`), atendiendo su puestito de tiro al blanco en el templo.
 *
 * Lo que hace solo es cuidar que todo esté en su sitio, y no le sale. Nada es un bucle: elige qué intenta.
 *
 * - **Lustra**: baja la cabeza, le echa el vaho a la estrella de lata, la frota con la manga y le saca un brillo.
 * - **Endereza**: levanta el brazo y acomoda un milímetro al tercer ladroncito. Se le cae el de al lado. Lo mira,
 *   cierra los ojos, y tira del piolín para pararlo de nuevo.
 * - **Se despega**: levanta la mano del charquito de miel y se le viene una moneda pegada, con su hilo (*"la guita es
 *   miel"*). La sacude tres veces. No se despega. La vuelve a apoyar.
 * - Respira apenas, pestañea pesado, le cuelga una gota de miel del mostrador y el cartelito de Alí Babá se hamaca.
 *
 * Tocado, **son tres tiros a un peso**: cae la moneda en el frasco y salen los tres tiros. El primero voltea un
 * ladroncito, el segundo otro, y el tercero erra: le pega a la tabla. El sheriff, sin mirar, levanta el brazo y tumba
 * el tercero con el dedo (*"todo en su sitio así"*). Después tira del piolín, los tres se paran de nuevo y el agujero
 * queda tapado. Dice su verso. Con movimiento reducido no se mueve nada: tocarlo lo pasa de atendiendo a haciendo trampa.
 *
 * Se lleva números (`rig-sheriff.ts`) y nada que dibuje.
 */

import { ABURRIDO, A_LA_ESTRELLA, EMPUJA, QUIETO, VERSO, marcas, type Cuatro, type Momento, type Tres } from '../../lib/bestiario/rig-sheriff.ts';
import { aliento, armarCon, armarVida, mezclar, suave, type Config } from './vida.ts';

const ID = 'el-sheriff';

export type Accion = 'lustra' | 'endereza' | 'despega';
const SOLAS = ['lustra', 'endereza', 'despega'] as const;

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { lustra: 3.6, endereza: 5, despega: 4.2, toque: 7.4 } as const;
/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { moneda: [0, 0.6], tiros: [0.95, 1.55, 2.15], sube: [2.7, 3.5], tumba: [3.5, 3.75], baja: [3.95, 4.8], piolin: [5.2, 5.5], paran: [5.45, 6.1], tapa: [5.8, 6.6] } as const;
/** Lo que tarda un ladroncito en voltearse cuando le pegan: cae de golpe. */
export const VOLTEA = 0.16;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const lineal = (u: number, a: number, b: number): number => Math.min(1, Math.max(0, (u - a) / (b - a)));
const cuatro = (c: Cuatro): [number, number, number, number] => [c[0], c[1], c[2], c[3]];

/** Un ladroncito que se voltea a los `c` segundos: cae derecho, sin frenar. Devuelve cuánto queda parado. */
const cae = (u: number, c: number): number => 1 - lineal(u, c, c + VOLTEA) ** 2;
/** Uno que se para de un tirón del piolín entre `a` y `b`: se pasa un poco y vuelve. */
const sePara = (u: number, a: number, b: number): number => {
  const k = lineal(u, a, b);
  return k >= 1 ? 1 : k * (1 + 0.35 * Math.sin(k * Math.PI));
};
/** Lo que tambalea uno recién parado, o recién rozado, desde el instante `c` (grados): se apaga en un segundo. */
const tiembla = (u: number, c: number, cuanto: number): number => (u > c && u < c + 1 ? cuanto * Math.sin((u - c) * 22) * (1 - (u - c)) ** 2 : 0);
/** El fogonazo de un tiro a los `c` segundos. */
const fogon = (u: number, c: number): number => (u >= c && u < c + 0.32 ? 1 - lineal(u, c + 0.06, c + 0.32) : 0);

/** La pose de base de un instante: atiende, aburrido. Respira, pestañea, el cartelito se hamaca y le cuelga la gota. */
export function base(t: number, ev: (n: string) => number): Momento {
  const pestañea = ev('pestañea');
  const gota = ev('gota');
  return {
    ...QUIETO,
    respira: aliento(t, 4.4),
    parpado: pestañea >= 0 ? mezclar(ABURRIDO, 1, Math.sin(pestañea * Math.PI)) : ABURRIDO,
    cartel: 4 * Math.sin(t * 1.1) + 2 * Math.sin(t * 2.7),
    gota: gota >= 0 ? gota : 0,
    cabeza: 0.8 * Math.sin(t * 0.4),
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Accion, u: number): Momento {
  const m: Momento = { ...b };
  switch (accion) {
    case 'lustra': {
      // Baja la cabeza, echa el vaho, frota con la manga y mira cómo quedó.
      const baja = loma(u, 0, 0.5, 2.9, 3.4);
      m.cabeza = b.cabeza + 9 * baja;
      m.mira = [-1.6 * baja, 1.4 * baja];
      m.parpado = mezclar(b.parpado, 0.3, baja);
      m.vaho = loma(u, 0.5, 0.8, 1.2, 1.7);
      const frota = loma(u, 0.9, 1.4, 2.6, 3.1);
      m.antebrazo = A_LA_ESTRELLA * frota + 7 * frota * Math.sin(u * 19);
      m.brillo = loma(u, 2.5, 2.7, 3.0, 3.5);
      break;
    }
    case 'endereza': {
      // Acomoda el tercero un milímetro. Se le cae el cuarto. Lo mira, cierra los ojos, y tira del piolín.
      m.brazo = loma(u, 0, 1.1, 2.6, 3.3);
      const toca = loma(u, 1.1, 1.2, 1.7, 1.8);
      m.empuja = -1.5 * toca * Math.sin(u * 16);
      const t3 = 2.2 * toca * Math.sin(u * 16);
      const k4 = u < 4.1 ? cae(u, 1.85) : sePara(u, 4.1, 4.6);
      m.parados = [b.parados[0], b.parados[1], b.parados[2], k4];
      m.tambalea = [0, 0, t3, tiembla(u, 4.6, 7)];
      const mira = loma(u, 2.0, 2.2, 3.6, 3.9);
      m.mira = [2.6 * mira, -1.2 * mira];
      m.cabeza = b.cabeza + 5 * mira;
      m.parpado = Math.max(b.parpado, loma(u, 2.6, 3.2, 3.6, 3.9));
      // El tirón del piolín: la mano baja de golpe del mostrador y vuelve.
      m.antebrazo = 13 * loma(u, 3.9, 4.05, 4.2, 4.5);
      break;
    }
    case 'despega': {
      // Levanta la mano con la moneda pegada, la sacude tres veces, y la apoya de nuevo: no se despega.
      const arriba = loma(u, 0.3, 1.0, 2.8, 3.4);
      const sacude = loma(u, 1.1, 1.2, 2.5, 2.6) * Math.sin(u * 26) * (Math.sin(u * 4.5) > -0.2 ? 1 : 0);
      m.antebrazo = -44 * arriba + 9 * sacude;
      m.pegada = loma(u, 0.25, 0.4, 3.3, 3.5);
      m.mira = [-2 * arriba, 1.6 * arriba];
      m.cabeza = b.cabeza + 6 * arriba;
      m.parpado = mezclar(b.parpado, 0.28, arriba);
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b };
  const [t1, t2, t3] = T.tiros;
  // Cae el peso en el frasco.
  m.moneda = lineal(u, T.moneda[0], T.moneda[1]);
  // Los tres tiros: dos pegan y el tercero erra, a la tabla. El tercer ladroncito tiembla del susto y sigue parado.
  m.fogonazo = [fogon(u, t1), fogon(u, t2), fogon(u, t3)] as Tres;
  const paran = u >= T.paran[0];
  const p: [number, number, number, number] = cuatro(b.parados);
  const w: [number, number, number, number] = [0, 0, 0, 0];
  p[0] = paran ? sePara(u, T.paran[0], T.paran[0] + 0.45) : cae(u, t1 + 0.03);
  p[1] = paran ? sePara(u, T.paran[0] + 0.1, T.paran[0] + 0.55) : cae(u, t2 + 0.03);
  // El tercero no cae con el tiro: lo tumba el dedo.
  const dedo = lineal(u, T.tumba[0], T.tumba[1]);
  p[2] = paran ? sePara(u, T.paran[0] + 0.2, T.paran[1]) : 1 - dedo * dedo;
  w[0] = tiembla(u, T.paran[0] + 0.45, 6);
  w[1] = tiembla(u, T.paran[0] + 0.55, 6);
  w[2] = tiembla(u, t3, 8) + (paran ? tiembla(u, T.paran[1], 6) : 18 * dedo * (1 - dedo) * 4 * 0.9);
  m.parados = p;
  m.tambalea = w;
  m.agujero = rampa(u, t3, t3 + 0.05) * (1 - rampa(u, T.tapa[0], T.tapa[1]));
  // Sube el brazo despacio, empuja de golpe, y lo baja.
  m.brazo = loma(u, T.sube[0], T.sube[1], T.baja[0], T.baja[1]);
  m.empuja = -4 * loma(u, T.tumba[0], T.tumba[0] + 0.12, T.tumba[1], T.tumba[1] + 0.3);
  // No mira: cuando erra el tiro, cierra más los ojos y se va con la vista para el otro lado.
  const disimula = loma(u, t3 + 0.2, t3 + 0.6, T.baja[1], T.baja[1] + 0.4);
  m.mira = [-2.4 * disimula, 0.6 * disimula];
  m.cabeza = b.cabeza - 4 * disimula;
  m.parpado = Math.max(b.parpado, mezclar(b.parpado, 0.62, disimula));
  // Tira del piolín con la mano del mostrador, y los tres se paran.
  m.antebrazo = 13 * loma(u, T.piolin[0], T.piolin[0] + 0.12, T.piolin[1], T.piolin[1] + 0.3);
  m.brillo = loma(u, 6.3, 6.5, 6.8, 7.2);
  return m;
}

export const CONFIG: Config<Momento, Accion> = {
  id: ID,
  clase: 'titere--sheriff',
  duran: DURA,
  solas: SOLAS,
  pausa: [1.6, 4],
  primera: [1, 2.6],
  demoraFicha: 2.6,
  ritmos: { pestañea: { cada: [2.6, 6], dura: 0.26 }, gota: { cada: [5, 11], dura: 1.8 } },
  quieto: QUIETO,
  toca: EMPUJA,
  base,
  accion: momentoDeAccion,
  toque: momentoDelToque,
  marcas,
  verso: VERSO,
};

export const armarSheriffCon = (marcos: readonly SVGGElement[], esc: Parameters<typeof armarVida>[2], azar: () => number = Math.random) => armarVida(CONFIG, marcos, esc, azar);
export const armarSheriff = armarCon(CONFIG);
