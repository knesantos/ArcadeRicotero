/**
 * El que no se cayó del cielo (`D-73`, vigesimoquinta vuelta), sentado en el borde de la chapa del canto.
 *
 * Lo que hace solo es estar ahí, medio dormido, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Toma un trago**: se lleva el vaso a la boca, echa la cabeza para atrás y lo baja despacio.
 * - **Mira el cielo y niega** con la cabeza: de ahí no se cayó.
 * - **Se tambalea** en el filo, abre el brazo del vaso para no irse, y se agarra de la chapa.
 * - **Bosteza**, con los ojos cerrados.
 * - **Huele el gato**: olfatea para el lado del matón, pone cara de asco y se tapa la nariz.
 * - **Cabecea** de sueño y se despierta de golpe.
 * - **Balancea los pies**, y el zapato se le sale un poco más, hasta que lo engancha con la punta.
 * - **La botella rueda** por la chapa hasta el borde y vuelve, y él la mira irse.
 * - **Respira**, se hamaca un poco (está en pedo), pestañea, y la medalla le cuelga a plomo.
 *
 * Tocado, se inclina de más, se cae del borde para adelante y queda **colgado de una mano** del filo de la
 * chapa, con el vaso derecho en la otra; patalea en el aire, se sube con esfuerzo (un codo, el otro), se
 * sacude el saco y, ya sentado, brinda con el vaso intacto mirando para arriba. Dice su verso. El vaso no se
 * vuelca nunca: `marcas()` lo endereza en cada cuadro. Con movimiento reducido no se mueve nada: tocarlo lo
 * pasa de sentado a colgado de la chapa, con el vaso derecho, y de vuelta.
 *
 * Se lleva números (`rig-cielo.ts`) y nada que dibuje.
 */

import { ARRIBA, CIELO_ARMADO, COLGADO, COLGADO_CAE, QUIETO, VERSO, alTorso, delTorso, marcas, type Momento, type Punto } from '../../lib/bestiario/rig-cielo.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-que-no-se-cayo-del-cielo';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { bebe: 3, cielo: 3.4, tambalea: 2.8, bosteza: 2.6, olfatea: 3.4, cabecea: 3.6, balancea: 3.2, botella: 3.6, toque: 8 } as const;
export type Accion = keyof typeof DURA;
export const SOLAS = ['bebe', 'cielo', 'tambalea', 'bosteza', 'olfatea', 'cabecea', 'balancea', 'botella'] as const;

export const PAUSA = [0.8, 2.2] as const;
export const PRIMERA = [0.5, 1.5] as const;
/** Cada cuánto pestañea, en segundos. */
export const PESTANEA = [2.4, 5] as const;
const PESTANEO = 0.22;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = {
  inclina: [0, 1.1],
  cae: [1.1, 1.5],
  colgado: [1.5, 3.9],
  patalea: [2, 3.5],
  codo1: [3.9, 4.5],
  codo2: [4.5, 5.1],
  sube: [5.1, 5.9],
  sacude: [5.9, 6.7],
  brinda: [6.7, 8],
} as const;
/** Cuándo dice el verso: cuando levanta el vaso. */
export const DICE = TOQUE_T.brinda[0] + 0.2;

/** Hasta dónde rueda la botella, en unidades del tipo. */
export const RUEDA = 20;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const mezclarP = (a: Punto, b: Punto, k: number): Punto => [mezclar(a[0], b[0], k), mezclar(a[1], b[1], k)];

/** Dónde apoya la mano de la izquierda en la chapa y dónde tiene el vaso, en el techo (sin la caída). */
const APOYO: Punto = delTorso(QUIETO, QUIETO.manos[0]);
const RODILLA: Punto = delTorso(QUIETO, QUIETO.manos[1]);
/** Dónde se agarra cuando se cae. */
const FILO: Punto = CIELO_ARMADO.agarre;

/** Lo que copia un momento para cambiarlo sin tocar el original. */
const copia = (m: Momento): Momento => ({ ...m, manos: [...m.manos], piernas: [...m.piernas], rodillas: [...m.rodillas], puntas: [...m.puntas], cabeceo: [...m.cabeceo], mira: [...m.mira], botella: [...m.botella], cae: [...m.cae], eje: [...m.eje] }) as Momento;

/** La pose de base de un instante: respira, se hamaca un poco, los pies cuelgan y la medalla se mece. */
export function base(t: number): Momento {
  const m = copia(QUIETO);
  m.respira = Math.sin(t * 1.5);
  m.vuelco = 1.4 * Math.sin(t * 0.45) + 0.5 * Math.sin(t * 1.1);
  m.cabeza = QUIETO.cabeza + 2.4 * Math.sin(t * 0.5);
  m.mira = [QUIETO.mira[0] + 0.5 * Math.sin(t * 0.3), QUIETO.mira[1]];
  m.piernas = [QUIETO.piernas[0] + 1.6 * Math.sin(t * 0.9), QUIETO.piernas[1] + 1.6 * Math.sin(t * 0.8 + 1)];
  m.rodillas = [QUIETO.rodillas[0] + 4 * Math.sin(t * 1.3), QUIETO.rodillas[1] + 4 * Math.sin(t * 1.2 + 2)];
  m.medalla = 4 * Math.sin(t * 1.7) - m.vuelco;
  m.pelo = 1.4 * Math.sin(t * 0.7);
  m.manos = [QUIETO.manos[0], [QUIETO.manos[1][0], QUIETO.manos[1][1] + 0.8 * Math.sin(t * 1.5)]];
  return m;
}

/** La mano de la izquierda, apoyada en la chapa: se queda en el mismo lugar del techo aunque él se hamaque. */
function apoyada(m: Momento, k = 1): void {
  m.manos = [mezclarP(m.manos[0], alTorso(m, APOYO), k), m.manos[1]];
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number): Momento {
  const m = copia(b);
  let apoyo = 1;
  switch (accion) {
    case 'bebe': {
      // El vaso a la boca, la cabeza para atrás, un trago largo con los ojos entornados, y abajo.
      const k = loma(u, 0, 0.6, 2.3, DURA.bebe);
      const trago = loma(u, 0.7, 0.9, 1.9, 2.2);
      const [bx, by] = CIELO_ARMADO.boca;
      m.manos = [m.manos[0], mezclarP(m.manos[1], [bx + 8, by + 30 - 2 * trago], k)];
      m.cabeceo = [0, -2.4 * trago];
      m.cabeza += 3 * trago;
      m.mira = [mezclar(m.mira[0], 0.4, k), mezclar(m.mira[1], -1.6, trago)];
      m.parpado = 0.6 * trago;
      break;
    }
    case 'cielo': {
      // Levanta la vista al cielo, lo mira un rato y niega con la cabeza: de ahí no se cayó.
      const mira = loma(u, 0, 0.5, 2.9, DURA.cielo);
      const niega = loma(u, 1.3, 1.5, 2.6, 2.9);
      m.mira = [mezclar(m.mira[0], 0.3, mira), mezclar(m.mira[1], -2.2, mira)];
      m.cabeceo = [0, -2 * mira];
      m.cabeza += 4 * mira + 9 * niega * Math.sin(u * 11);
      m.pelo += 3 * niega * Math.sin(u * 11 - 0.6);
      break;
    }
    case 'tambalea': {
      // Se le va el cuerpo para un lado y para el otro; abre el brazo del vaso y se agarra fuerte de la chapa.
      const k = loma(u, 0, 0.3, 2, DURA.tambalea);
      m.vuelco += 9 * k * Math.sin(u * 4.6);
      m.manos = [m.manos[0], mezclarP(m.manos[1], [76, -54], k)];
      m.mira = [mezclar(m.mira[0], 1.2 * Math.sin(u * 4.6), k), mezclar(m.mira[1], 1.4, k)];
      m.boca = 0.3 * loma(u, 0.4, 0.6, 1.6, 2);
      m.medalla += 14 * k * Math.sin(u * 4.6 - 1);
      break;
    }
    case 'bosteza': {
      const k = loma(u, 0.2, 0.7, 1.6, 2.2);
      m.boca = k;
      m.parpado = 0.85 * k;
      m.cabeceo = [0, -2 * k];
      m.cabeza += 4 * k;
      break;
    }
    case 'olfatea': {
      // Para la nariz para el lado del gato, olfatea, pone cara de asco y se la tapa con la mano.
      const k = loma(u, 0, 0.4, 2.9, DURA.olfatea);
      const olfa = loma(u, 0.2, 0.4, 1.1, 1.3);
      const asco = loma(u, 1.1, 1.4, 2.8, 3.3);
      const tapa = loma(u, 1.3, 1.7, 2.7, 3.2);
      const [nx, ny] = CIELO_ARMADO.nariz;
      m.olor = loma(u, 0, 0.6, 2.6, DURA.olfatea);
      m.mira = [mezclar(m.mira[0], -2.2, k * (1 - asco)) + 1.8 * asco, m.mira[1]];
      m.cabeza += -8 * k * (1 - asco) + 5 * asco;
      m.cabeceo = [-1.4 * olfa * Math.sin(u * 16), -1 * olfa * Math.abs(Math.sin(u * 16))];
      m.asco = asco;
      m.manos = [mezclarP(m.manos[0], [nx - 1, ny + 8], tapa), m.manos[1]];
      apoyo = 1 - tapa;
      break;
    }
    case 'cabecea': {
      // Se le cierran los ojos, se le va la cabeza para adelante, y de golpe se despierta.
      const duerme = rampa(u, 0, 1.4) * (1 - rampa(u, 2.4, 2.52));
      const susto = loma(u, 2.4, 2.5, 2.9, 3.4);
      m.parpado = Math.max(m.parpado, duerme);
      m.cabeceo = [0, 6 * duerme - 1.6 * susto];
      m.cabeza += 9 * duerme;
      m.mira = [mezclar(m.mira[0], 0, susto), mezclar(m.mira[1], -0.6, susto)];
      m.boca = 0.25 * susto;
      m.pelo += 6 * susto * Math.sin(u * 30);
      m.medalla += 18 * susto * Math.sin(u * 14);
      m.vuelco += 3 * susto;
      break;
    }
    case 'balancea': {
      // Hamaca los pies para adelante y para atrás; el zapato se sale, y lo engancha con la punta al final.
      const k = loma(u, 0, 0.3, 2.6, DURA.balancea);
      m.rodillas = [m.rodillas[0] + 16 * k * Math.sin(u * 6), m.rodillas[1] - 16 * k * Math.sin(u * 6)];
      m.zapato = mezclar(QUIETO.zapato, 0.88, rampa(u, 0.3, 2.2)) * (1 - rampa(u, 2.5, 2.8)) + QUIETO.zapato * rampa(u, 2.5, 2.8);
      m.puntas = [m.puntas[0], m.puntas[1] - 18 * loma(u, 2.4, 2.5, 2.7, 2.9)];
      m.mira = [mezclar(m.mira[0], 0.6, k), mezclar(m.mira[1], 2, k)];
      break;
    }
    case 'botella': {
      // La botella rueda por la chapa para el borde, se mece en la punta, y vuelve; él la sigue con los ojos.
      const va = rampa(u, 0, 1.4) * (1 - rampa(u, 1.9, 3.3));
      const k = loma(u, 0, 0.4, 3.1, DURA.botella);
      m.botella = [RUEDA * va, 7 * Math.sin(u * 9) * loma(u, 1, 1.3, 1.8, 2.2) + 3 * Math.sin(u * 5) * k];
      m.mira = [mezclar(m.mira[0], 2.2 * (0.4 + 0.6 * va), k), mezclar(m.mira[1], 1, k)];
      m.cabeza += 4 * k;
      break;
    }
  }
  apoyada(m, apoyo);
  return m;
}

/** Las paradas del toque: dónde está el cuerpo y adónde van las manos, en el techo (sin la caída). */
interface Parada {
  u: number;
  cae: Punto;
  estira: number;
  piernas: readonly [number, number];
  rodillas: readonly [number, number];
  manos: readonly [Punto, Punto];
}
const ARRIBA_FUERA: Punto = [COLGADO_CAE[0] + COLGADO.manos[1][0], COLGADO_CAE[1] + COLGADO.manos[1][1]];
const PARADAS: readonly Parada[] = [
  { u: 0, cae: [0, 0], estira: 0, piernas: QUIETO.piernas, rodillas: QUIETO.rodillas, manos: [APOYO, RODILLA] },
  { u: 0.8, cae: [0, 0], estira: 0, piernas: QUIETO.piernas, rodillas: QUIETO.rodillas, manos: [APOYO, [72, -48]] },
  { u: TOQUE_T.cae[0], cae: [2, 8], estira: 0.1, piernas: [-40, -46], rodillas: [40, 48], manos: [APOYO, [74, -56]] },
  { u: TOQUE_T.cae[1], cae: COLGADO_CAE, estira: 1, piernas: COLGADO.piernas, rodillas: COLGADO.rodillas, manos: [FILO, ARRIBA_FUERA] },
  { u: TOQUE_T.codo1[0], cae: COLGADO_CAE, estira: 1, piernas: COLGADO.piernas, rodillas: COLGADO.rodillas, manos: [FILO, ARRIBA_FUERA] },
  // Un codo en el filo, con el antebrazo acostado en la chapa.
  { u: TOQUE_T.codo2[0], cae: [4, 126], estira: 1, piernas: [10, -4], rodillas: [-14, 20], manos: [[-4, -6], [92, 8]] },
  // El otro codo, con el vaso parado en la mano.
  { u: TOQUE_T.sube[0], cae: [4, 112], estira: 1, piernas: [4, -14], rodillas: [-6, 26], manos: [[-4, -6], [40, -46]] },
  { u: TOQUE_T.sacude[0], cae: [0, 0], estira: 0, piernas: QUIETO.piernas, rodillas: QUIETO.rodillas, manos: [APOYO, [46, -40]] },
  { u: TOQUE_T.brinda[0], cae: [0, 0], estira: 0, piernas: QUIETO.piernas, rodillas: QUIETO.rodillas, manos: [APOYO, [46, -40]] },
  { u: TOQUE_T.brinda[0] + 0.4, cae: [0, 0], estira: 0, piernas: QUIETO.piernas, rodillas: QUIETO.rodillas, manos: [APOYO, [50, -150]] },
  { u: TOQUE_T.brinda[1] - 0.5, cae: [0, 0], estira: 0, piernas: QUIETO.piernas, rodillas: QUIETO.rodillas, manos: [APOYO, [50, -150]] },
  { u: TOQUE_T.brinda[1], cae: [0, 0], estira: 0, piernas: QUIETO.piernas, rodillas: QUIETO.rodillas, manos: [APOYO, RODILLA] },
];

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copia(b);
  // Entre dos paradas, suave; la caída, con la gravedad: arranca lenta y llega rápido.
  let i = 0;
  while (i < PARADAS.length - 2 && u >= PARADAS[i + 1]!.u) i++;
  const [p, q] = [PARADAS[i]!, PARADAS[i + 1]!];
  const lineal = Math.min(1, Math.max(0, (u - p.u) / (q.u - p.u)));
  const k = p.u === T.cae[0] ? lineal * lineal : suave(lineal);
  m.cae = mezclarP(p.cae, q.cae, k);
  m.estira = mezclar(p.estira, q.estira, k);
  m.piernas = [mezclar(p.piernas[0], q.piernas[0], k), mezclar(p.piernas[1], q.piernas[1], k)];
  m.rodillas = [mezclar(p.rodillas[0], q.rodillas[0], k), mezclar(p.rodillas[1], q.rodillas[1], k)];
  const mundo: [Punto, Punto] = [mezclarP(p.manos[0], q.manos[0], k), mezclarP(p.manos[1], q.manos[1], k)];
  // Colgado, se balancea desde la mano; antes, sentado, se tambalea desde el culo.
  const colgado = u >= T.cae[0];
  m.eje = colgado && u < T.sube[1] ? ARRIBA : [0, 0];
  m.inclina = mezclar(b.inclina, 0, loma(u, 0.9, 1.2, T.sube[0], T.sube[1]));
  if (!colgado) {
    m.vuelco = b.vuelco * (1 - rampa(u, 0.6, 1.05)) + 12 * Math.sin(u * 6.5) * rampa(u, 0, 0.5) * (1 - rampa(u, 0.85, 1.08));
    m.cabeceo = [0, 4 * rampa(u, 0.7, 1.1)];
    m.cabeza += 6 * rampa(u, 0.7, 1.1);
  } else if (u < T.codo1[1]) {
    const v = u - T.colgado[0];
    m.vuelco = v > 0 ? 8 * Math.sin(v * 3) * Math.exp(-v * 0.5) * (1 - rampa(u, T.colgado[1] - 0.3, T.codo1[1])) : 0;
    // El tirón cuando se agarra: el brazo hace de resorte y lo sube un poco.
    if (v > 0) m.cae = [m.cae[0], m.cae[1] - 8 * Math.abs(Math.sin(v * 12)) * Math.exp(-v * 5)];
  } else {
    m.vuelco = b.vuelco * rampa(u, T.sube[1], T.brinda[0]);
  }
  // Patalea en el aire.
  const pata = loma(u, T.patalea[0], T.patalea[0] + 0.2, T.patalea[1] - 0.2, T.patalea[1]);
  if (pata > 0) {
    m.piernas = [m.piernas[0] + 14 * pata * Math.sin(u * 11), m.piernas[1] + 20 * pata * Math.sin(u * 11 + Math.PI)];
    m.rodillas = [m.rodillas[0] - 26 * pata * Math.max(0, Math.sin(u * 11 + 1)), m.rodillas[1] + 28 * pata * Math.max(0, Math.sin(u * 11 + 1 + Math.PI))];
  }
  // Se sacude el saco a manotazos.
  const sacude = loma(u, T.sacude[0], T.sacude[0] + 0.15, T.sacude[1] - 0.15, T.sacude[1]);
  if (sacude > 0) {
    mundo[0] = mezclarP(mundo[0], [-12 + 6 * Math.sin(u * 18), -50 + 10 * Math.sin(u * 9)], sacude);
    m.inclina += 3 * sacude * Math.sin(u * 18);
  }
  // La cara: el susto de la caída, mirar abajo el baldío, mirar el vaso, el esfuerzo de subir, el brindis.
  const susto = loma(u, 0.9, 1.1, 2, 2.4);
  const fuerza = loma(u, T.codo1[0], T.codo1[0] + 0.2, T.sube[1] - 0.2, T.sube[1]);
  const brinda = loma(u, T.brinda[0], T.brinda[0] + 0.4, T.brinda[1] - 0.5, T.brinda[1]);
  m.boca = Math.max(0.8 * susto, 0.5 * pata, 0.3 * fuerza);
  m.parpado = Math.max(m.parpado, 0.7 * fuerza);
  m.mira = [
    mezclar(m.mira[0], 1.6, loma(u, 2.4, 2.6, 3.4, 3.6)),
    mezclar(mezclar(m.mira[1], 2.2, loma(u, 1.5, 1.7, 2.3, 2.5)), -2.2, brinda) - 1.6 * loma(u, 2.4, 2.6, 3.4, 3.6),
  ];
  m.cabeceo = [m.cabeceo[0], m.cabeceo[1] - 2 * brinda];
  m.cabeza += 6 * brinda;
  m.pelo = -14 * loma(u, T.cae[0], T.cae[0] + 0.2, T.colgado[0] + 0.3, T.colgado[0] + 0.8) + 4 * pata * Math.sin(u * 11);
  m.medalla = 22 * Math.sin(u * 6) * loma(u, 0.4, 0.8, T.sube[1], T.sacude[1]) - m.vuelco - m.inclina;
  m.zapato = mezclar(mezclar(QUIETO.zapato, 0.92, rampa(u, T.cae[0], T.patalea[1])), QUIETO.zapato, rampa(u, T.sube[0], T.sube[1]));
  m.manos = [alTorso(m, mundo[0]), alTorso(m, mundo[1])];
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
  momento: Momento;
}

/** Arma al tipo con un azar que se puede fijar (el test lo fija). La isla usa `armarCielo`. */
export function armarCieloCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--cielo')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { bebe: 0, cielo: 0, tambalea: 0, bosteza: 0, olfatea: 0, cabecea: 0, balancea: 0, botella: 0, toque: 0 };
  let ahora: Momento = QUIETO;
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas, momento: ahora }) };
  const titere: SVGGElement = g;
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let colgadoQuieto = false;
  let pestanea = entre(PESTANEA);

  /** Elige al azar, sin repetir la última, y le da más chance a lo que hizo menos. */
  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    const pesos = opciones.map((a) => 1 / (1 + hechas[a]));
    let r = azar() * pesos.reduce((s, w) => s + w, 0);
    for (const [i, a] of opciones.entries()) {
      r -= pesos[i]!;
      if (r <= 0) return a;
    }
    return opciones[opciones.length - 1]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    if (a !== 'toque') ultima = a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const b = base(t);
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) b.parpado = Math.sin((ojo / PESTANEO) * Math.PI);
    const u = t - desde;
    let m: Momento;
    if (accion === 'toque') m = momentoDelToque(b, u);
    else if (accion) m = momentoDeAccion(b, accion, u);
    else {
      m = copia(b);
      apoyada(m);
    }
    return m;
  }

  function aplicar(m: Momento): void {
    ahora = m;
    const { transform, opacity } = marcas(m);
    for (const [nombre, valor] of Object.entries(transform)) if (nombre !== 'entero') p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
  }

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(colgadoQuieto ? COLGADO : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - pestanea > PESTANEO) pestanea = t + entre(PESTANEA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya se esté cayendo. */
  const tocado = (t: number): boolean => {
    if (accion === 'toque') return false;
    empezar('toque', t);
    return true;
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      colgadoQuieto = !colgadoQuieto;
      pintar(t, 0);
      decir();
    } else if (tocado(t)) {
      hablarEn = t + DICE;
    }
  };
  /** Dice su verso arriba del pelo revuelto, y la página abre la ficha. */
  const decir = (): void => esc.hablar(ID, VERSO[0], VERSO[1]);
  titere.addEventListener('click', tocar);
  titere.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });

  pintar(0, 0);
  return {
    mover: pintar,
    reaccionar: (id, t) => {
      if (id !== ID) return false;
      if (!esc.quieto()) tocado(t);
      return true;
    },
    estado: () => ({ accion, hechas: { ...hechas }, momento: ahora }),
  };
}

export const armarCielo: Armar = (marcos, esc) => armarCieloCon(marcos, esc);
