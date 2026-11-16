/**
 * El ángel guardián más tonto (`D-73`, vigesimonovena vuelta), con su lona de rescate tendida donde no hace falta.
 *
 * Lo que hace solo es guardar mal, y nada es un bucle: elige cómo.
 *
 * - **Mide el viento**: suelta una mano, se chupa el dedo, lo levanta, y con eso decide correr todo un paso… para el
 *   lado contrario al colgado. Queda conforme un rato, duda, y vuelve.
 * - **Bosteza**: se le cierran los ojos, se le aflojan los brazos y la punta de la lona se le cae; se despierta de un salto y la
 *   vuelve a tensar.
 * - **Ensaya la atajada**: revolea su propia aureola para atajarla con la lona, y le erra: le cae justo debajo del
 *   colgado, que es donde tendría que estar la lona. La aureola vuelve sola, despacio, porque es de ángel.
 * - Respira, pestañea, le tiembla la vela del casco y cada tanto sacude un ala.
 *
 * Tocado (*"tu ángel guardián es de todos el más tonto que hay"*) le cae un nido entero en el casco, que le apaga la
 * vela y le vuela la aureola; queda mareado, y **recién ahí** levanta la lona y se tapa con ella, tarde. Después la
 * baja, el nido se le resbala por la nuca y la vela se prende sola. Con movimiento reducido no se mueve nada: tocarlo
 * lo pasa de guardar a taparse tarde.
 *
 * Se lleva números (`rig-guardian.ts`) y nada que dibuje.
 */

import { GUARDIAN_ARMADO, QUIETO, TARDE, VERSO, enLaCabeza, marcas, nidoEnElCasco, type Momento, type Punto } from '../../lib/bestiario/rig-guardian.ts';
import { aliento, arco, armarCon, armarVida, mezclar, suave, type Config } from './vida.ts';

const ID = 'el-angel-guardian';

export type Accion = 'viento' | 'bosteza' | 'ensaya';
const SOLAS = ['viento', 'bosteza', 'ensaya'] as const;

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { viento: 5.6, bosteza: 4.6, ensaya: 6.2, toque: 6.4 } as const;
/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { cae: [0.25, 0.85], mareo: [0.85, 2], sube: [2, 2.7], baja: [4.6, 5.3], resbala: [5, 5.6], fin: 6.4 } as const;
/** Lo que corre la lona cuando midió el viento (para el lado contrario al colgado), y dónde le cae la aureola cuando le erra. */
export const PASO = 18;
export const ERRA: Punto = [-100, -8];

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const A = GUARDIAN_ARMADO;

/** La pose de base de un instante: guardando, con la vista en la percha vacía. */
export function base(t: number, ev: (n: string) => number): Momento {
  const p = ev('pestanea');
  const al = ev('aletea');
  return {
    ...QUIETO,
    respira: aliento(t, 3.6),
    cabeza: QUIETO.cabeza + 2 * Math.sin(t * 0.43),
    parpado: p >= 0 ? 1 : 0,
    tiembla: t * 9,
    // Lo que cuelga llega después: la aureola se hamaca un rato más tarde que la cabeza.
    aureola: [0, 1.5 * Math.sin(t * 1.1), QUIETO.aureola[2] + 4 * Math.sin(t * 0.43 - 0.9)],
    alas: 3 * Math.sin(t * 0.7) + (al >= 0 ? 16 * Math.sin(al * Math.PI * 3) * (1 - al) : 0),
  };
}

/** Dónde tiene la boca, para chuparse el dedo. */
const boca = (m: Momento): Punto => enLaCabeza([A.boca[0] + 8, A.boca[1]], m.cabeza, m.hundida);

/** Lo que hace a los `u` segundos de empezar una acción solo, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Accion, u: number): Momento {
  const m: Momento = { ...b };
  switch (accion) {
    case 'viento': {
      // Baja la cabeza, se chupa el dedo, lo levanta bien alto y lo deja ahí.
      const chupa = loma(u, 0.2, 0.7, 1.1, 1.4);
      const alza = loma(u, 1.2, 1.7, 3.3, 3.8);
      m.cabeza = mezclar(b.cabeza, -2, chupa);
      m.suelta = rampa(u, 0, 0.5) * (1 - rampa(u, 3.4, 3.9));
      const [bx, by] = boca(m);
      m.mano = [mezclar(bx, 46, alza), mezclar(by, -232, alza)];
      // Decidido: corre todo un paso, a los saltitos, para el lado contrario al colgado. Queda conforme, duda y vuelve.
      const ida = rampa(u, 2.3, 3.1);
      const vuelta = rampa(u, 4.5, 5.4);
      m.todo = [PASO * (ida - vuelta), 5 * (arco((u - 2.3) / 0.4) + arco((u - 2.7) / 0.4) + arco((u - 4.5) / 0.45) + arco((u - 4.95) / 0.45))];
      m.parpado = u > 3.5 && u < 4.2 ? 1 : b.parpado;
      break;
    }
    case 'bosteza': {
      // Se le abre la boca, se le cierran los ojos, se le aflojan los brazos y la lona se le cae. Se despierta de un salto.
      const abre = loma(u, 0.2, 1.4, 2.3, 2.45);
      m.bocaza = abre;
      m.parpado = abre > 0.35 ? 1 : b.parpado;
      m.cabeza = mezclar(b.cabeza, -36, abre);
      const cae = loma(u, 0.9, 2.3, 2.5, 2.8);
      m.inclina = mezclar(b.inclina, 18, cae) + 5 * arco((u - 2.7) / 0.5);
      m.todo = [0, 9 * arco((u - 2.42) / 0.36)];
      m.alas = b.alas + 26 * arco((u - 2.4) / 0.6);
      m.hundida = 3 * cae;
      break;
    }
    case 'ensaya': {
      // Agarra la aureola, la revolea para atajarla con la lona, y le erra: cae del otro lado, debajo del colgado.
      const [ax, ay] = enLaCabeza(A.aureola, b.cabeza, 0);
      const agarra = loma(u, 0, 0.5, 1, 1.5);
      m.suelta = agarra;
      m.mano = [ax + 8, ay + 4];
      m.hundida = 4 * loma(u, 0.6, 0.9, 1, 1.15);
      const vuela = rampa(u, 1, 2.2);
      const vuelve = rampa(u, 3.7, 5.6);
      const k = vuela - vuelve;
      const [dx, dy] = [ERRA[0] - ax, ERRA[1] - ay];
      m.aureola = [dx * k, dy * k - 120 * arco(vuela) * (1 - vuelve) + 8 * Math.sin(u * 5) * arco(vuelve), mezclar(b.aureola[2], 0, k) + 540 * vuela * (1 - vuela)];
      // La sigue con la vista para arriba, espera con la lona, y cuando no llega mira para abajo.
      m.cabeza = mezclar(mezclar(b.cabeza, -38, loma(u, 1, 1.5, 2.3, 2.7)), 4, loma(u, 2.5, 3, 3.6, 4.2));
      m.inclina = b.inclina + 7 * loma(u, 1.4, 1.8, 2.4, 2.8);
      m.parpado = (u > 2.9 && u < 3.05) || (u > 3.3 && u < 3.45) ? 1 : b.parpado;
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b };
  const golpe = T.cae[1];
  const pegado = u >= golpe;
  // Con el nido encima: la cabeza hundida entre los hombros, derecha, y mareada un rato.
  const encima = pegado ? 1 - rampa(u, T.resbala[0], T.resbala[1]) : 0;
  const mareo = pegado ? Math.exp(-(u - golpe) * 1.6) : 0;
  m.hundida = encima * (TARDE.hundida + 12 * Math.exp(-(u - golpe) * 7));
  m.cabeza = mezclar(b.cabeza, TARDE.cabeza, encima) + 9 * mareo * Math.sin((u - golpe) * 13);
  m.parpado = pegado && u < golpe + 0.75 ? 1 : b.parpado;
  m.alas = b.alas + (pegado ? TARDE.alas * (1 - rampa(u, T.baja[0], T.fin - 0.4)) + 14 * mareo * Math.sin((u - golpe) * 20) : 0);
  // La vela se apaga con el golpe y se prende sola al final.
  m.llama = pegado ? rampa(u, T.resbala[1], T.resbala[1] + 0.5) : b.llama;
  // El nido: cae de la copa, cada vez más rápido, le queda de sombrero, y al final se le resbala por la nuca.
  const [nx, ny] = nidoEnElCasco(m.cabeza, m.hundida);
  if (!pegado) {
    const k = Math.max(0, (u - T.cae[0]) / (golpe - T.cae[0]));
    m.nido = [nx, mezclar(A.nidoDesde, ny, k * k), 40 * (1 - k)];
    m.nidoSe = u >= T.cae[0] ? 1 : 0;
  } else {
    const r = rampa(u, T.resbala[0], T.resbala[1]);
    m.nido = [nx - 34 * r, ny + 70 * r * r, TARDE.nido[2] - 80 * r];
    m.nidoSe = u < T.resbala[1] - 0.12 ? 1 : 0;
  }
  // Recién ahí levanta la lona y se tapa. Tarde.
  const techo = loma(u, T.sube[0], T.sube[1], T.baja[0], T.baja[1]);
  m.techo = techo;
  m.inclina = b.inclina + 6 * arco((u - T.baja[1] + 0.1) / 0.5);
  // La aureola salta con el golpe, queda torcida para el otro lado, y sube arriba de la lona cuando la lona sube.
  const fuera = pegado ? rampa(u, golpe, golpe + 0.25) * (1 - rampa(u, T.baja[1], T.fin - 0.2)) : 0;
  m.aureola = [TARDE.aureola[0] * fuera, mezclar(b.aureola[1], -10 - 30 * arco((u - golpe) / 0.5), fuera) + (TARDE.aureola[1] + 10) * techo, mezclar(b.aureola[2], TARDE.aureola[2], fuera)];
  return m;
}

export const CONFIG: Config<Momento, Accion> = {
  id: ID,
  clase: 'titere--guardian',
  duran: DURA,
  solas: SOLAS,
  pausa: [1.4, 3.6],
  primera: [1, 2.4],
  demoraFicha: 2.9,
  ritmos: { pestanea: { cada: [2.2, 5], dura: 0.16 }, aletea: { cada: [5, 11], dura: 0.9 } },
  quieto: QUIETO,
  toca: TARDE,
  base,
  accion: momentoDeAccion,
  toque: momentoDelToque,
  marcas,
  verso: VERSO,
};

export const armarGuardianCon = (marcos: readonly SVGGElement[], esc: Parameters<typeof armarVida>[2], azar: () => number = Math.random) => armarVida(CONFIG, marcos, esc, azar);
export const armarGuardian = armarCon(CONFIG);
