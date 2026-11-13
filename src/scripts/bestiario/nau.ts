/**
 * Los náufragos (`D-73`, vigesimoctava vuelta), asomando del agua del bajo, agarrados de la mano.
 *
 * Lo que hacen solos es aguantar. Nada es un bucle: eligen qué hacen cada vez.
 *
 * - **Buscan un barco**: el A se pone la mano en la frente y los dos giran la cabeza, de un lado al otro, y suspiran.
 * - **Estornuda uno**: el A echa la cabeza para atrás, la pega para adelante y larga un chorro de agua; el B se tuerce
 *   del susto y le dice salud.
 * - **Se les resbala la mano**: el A se va soltando y se hunde hasta la boca, largando burbujas; el B lo agarra de nuevo y lo sube.
 * - **El tubo del teléfono suena**: el B lo escucha, se le abre la boca, el A lo mira; seis minutos.
 * - **La bomba**: la chispa va quemando la mecha y los dos miran; llega, y es un globo: se desinfla con un pedito.
 * - **Cabecean** en el agua, las ondas se abren, y atrás la multitud se adivina un poco.
 *
 * Tocados, **cae el rayo**: se alumbra la multitud de atrás, que estaba, con los brazos levantados, y los dos gritan
 * agarrados de la mano con el brazo libre para arriba; el rayo cruza dos veces. Dicen su verso. Con movimiento reducido no
 * se mueve nada: tocarlos los pasa de aguantando a gritando con la multitud a la vista.
 *
 * Se llevan números (`rig-nau.ts`) y nada que dibuje.
 */

import { QUIETO, TODOS, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-nau.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'los-naufragos';

/** Lo que pueden hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { busca: 4.4, estornuda: 3.2, resbala: 5, telefono: 4.6, bomba: 5.6, rayo: 4.8 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['busca', 'estornuda', 'resbala', 'telefono', 'bomba'] as const;

export const PAUSA = [1.6, 3.8] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.4;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { rayo1: [0, 0.4], multitud: [0.2, 0.9], grito: [0.35, 3.3], rayo2: [1.5, 1.95], baja: [3.4, 4.6] } as const;
/** Lo que se hunde el A cuando se le resbala la mano, en sus unidades. */
export const HUNDE = 62;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const copia = (b: Momento): Momento => ({ ...b, mece: [...b.mece], hundido: [...b.hundido], incl: [...b.incl], cabeza: [...b.cabeza], boca: [...b.boca] }) as Momento;

/** La pose de base de un instante: cabecean en el agua, las ondas se abren, la multitud se adivina atrás, la chispa titila. */
export function base(t: number): Momento {
  return {
    ...QUIETO,
    mece: [3.2 * Math.sin(t * 1.1) + 1 * Math.sin(t * 2.7), 3.2 * Math.sin(t * 1.1 + 0.5) + 1 * Math.sin(t * 2.3 + 1)],
    incl: [2 * Math.sin(t * 0.8), 2 * Math.sin(t * 0.9 + 1)],
    cabeza: [4 + 4 * Math.sin(t * 0.7), -4 + 4 * Math.sin(t * 0.6 + 2)],
    boca: [0.12 + 0.04 * Math.sin(t * 1.3), 0.08 + 0.04 * Math.sin(t * 1.1 + 1)],
    mecePompa: 2 * Math.sin(t * 1.5 + 1),
    ondas: (t / 3.2) % 1,
    multitud: 0.34 + 0.08 * Math.sin(t * 0.4),
    chispa: Math.sin(t * 25) > -0.6 ? 1 : 0,
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number): Momento {
  const m = copia(b);
  switch (accion) {
    case 'busca': {
      // El A se tapa los ojos con la mano; los dos giran la cabeza hacia un lado y hacia el otro, y suspiran.
      const k = loma(u, 0, 0.6, DURA.busca - 1.1, DURA.busca - 0.4);
      m.libreA = mezclar(b.libreA, 2, k);
      const mira = Math.sin(u * 1.9) * k;
      m.cabeza = [b.cabeza[0] + 20 * mira, b.cabeza[1] + 18 * mira];
      m.boca = [b.boca[0], b.boca[1]];
      // El suspiro: se les hunde un poco, la boca se abre, y vuelven.
      const sus = loma(u, DURA.busca - 1.2, DURA.busca - 0.8, DURA.busca - 0.6, DURA.busca - 0.1);
      m.hundido = [4 * sus, 4 * sus];
      m.boca = [mezclar(b.boca[0], 0.5, sus), mezclar(b.boca[1], 0.5, sus)];
      break;
    }
    case 'estornuda': {
      // El A echa la cabeza para atrás, la pega para adelante y larga el chorro; el B se tuerce y le dice salud.
      const atras = loma(u, 0, 0.7, 0.9, 1);
      const pega = loma(u, 0.9, 1, 1.35, 1.8);
      m.incl = [b.incl[0] - 8 * atras + 9 * pega, b.incl[1] + 7 * pega];
      m.cabeza = [b.cabeza[0] - 10 * atras + 14 * pega, b.cabeza[1] + 14 * pega];
      m.boca = [mezclar(mezclar(b.boca[0], 0.4, atras), 1, pega), mezclar(b.boca[1], 0.4, loma(u, 1.9, 2.2, 2.7, 3))];
      m.gotas = rampa(u, 0.95, 1.55);
      m.hundido = [2 * pega, 0];
      break;
    }
    case 'resbala': {
      // El A se va soltando de la mano y se hunde hasta la boca; el B lo agarra de nuevo y lo sube.
      const suelta = loma(u, 0.4, 1.8, 2.8, 3.1);
      m.brazoA = 36 * suelta;
      m.sacude = 4 * Math.sin(u * 16) * loma(u, 0.4, 0.7, 2, 2.8);
      m.hundido = [HUNDE * loma(u, 0.8, 2.2, 3.2, 4.4), 0];
      m.libreA = mezclar(b.libreA, -10, loma(u, 1.2, 1.7, 3.1, 3.6));
      m.burbuja = rampa(u, 2.0, 3.0);
      m.boca = [mezclar(b.boca[0], 0.8, loma(u, 0.6, 1, 2.6, 3)), b.boca[1]];
      // El B se tira para atrás para sostenerlo, y lo vuelve a agarrar de un manotazo.
      m.incl = [b.incl[0], b.incl[1] + 7 * loma(u, 1.2, 2, 3.2, 3.8)];
      m.brazoB = -12 * loma(u, 2.7, 3, 3.1, 3.4);
      break;
    }
    case 'telefono': {
      // Suena el tubo, el B lo escucha con la boca abierta, y el A lo mira.
      const suena = loma(u, 0.2, 0.4, 1.9, 2.1);
      m.tuboB = mezclar(b.tuboB, 6 * Math.sin(u * 30), suena);
      m.cabeza = [b.cabeza[0] - 14 * loma(u, 1, 1.6, 3.5, 4), b.cabeza[1] + 6 * Math.sin(u * 2) * loma(u, 0.4, 1, 3.4, 4)];
      m.boca = [b.boca[0], mezclar(b.boca[1], 0.7 + 0.2 * Math.sin(u * 9), loma(u, 0.4, 0.8, 3.1, 3.6))];
      m.incl = [b.incl[0], b.incl[1] - 4 * loma(u, 2, 2.4, 3, 3.6)];
      // Seis minutos: se encogen de hombros, los dos, y se hunden un poquito.
      m.hundido = [3 * loma(u, 3.3, 3.5, 3.9, 4.3), 3 * loma(u, 3.3, 3.5, 3.9, 4.3)];
      break;
    }
    case 'bomba': {
      // La chispa va quemando la mecha; llega a la bomba, que es un globo, y se desinfla.
      const quema = rampa(u, 0.3, 3.2);
      m.mecha = u < 5.4 ? 1 - quema : 1;
      m.chispa = u < 3.25 || u > 5.4 ? b.chispa : 0;
      const mira = loma(u, 0.4, 1, 3, 3.5);
      m.cabeza = [b.cabeza[0] - 24 * mira, b.cabeza[1] - 24 * mira];
      m.boca = [mezclar(b.boca[0], 0.5, loma(u, 2, 3, 3.2, 3.3)), b.boca[1]];
      m.hundido = [6 * loma(u, 2.6, 3.1, 3.2, 3.5), 0];
      const pfff = rampa(u, 3.2, 3.9);
      m.bomba = 1 - 0.74 * pfff + 0.74 * rampa(u, 4.4, 5.4);
      m.humo = rampa(u, 3.2, 4.2);
      m.mecePompa = b.mecePompa + 3 * Math.sin(u * 30) * loma(u, 3.2, 3.3, 3.8, 4.1);
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que los tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copia(b);
  // El rayo cruza dos veces, de un lado y del otro, y parpadea.
  const r1 = loma(u, T.rayo1[0], T.rayo1[0] + 0.04, T.rayo1[1] - 0.15, T.rayo1[1]);
  const r2 = loma(u, T.rayo2[0], T.rayo2[0] + 0.04, T.rayo2[1] - 0.15, T.rayo2[1]);
  m.rayo = Math.max(r1 * (0.6 + 0.4 * Math.abs(Math.sin(u * 60))), r2 * (0.6 + 0.4 * Math.abs(Math.sin(u * 60))));
  m.rayoLado = u < 1.2 ? 1 : -1;
  // Se alumbra la multitud: aparece, sube, y levanta los brazos. Después se apaga de a poco, en lo oscuro.
  const baja = rampa(u, T.baja[0], T.baja[1]);
  const mult = rampa(u, T.multitud[0], T.multitud[1]);
  m.multitud = mezclar(b.multitud, 1, mult * (1 - baja));
  m.sube = mult * (1 - baja);
  m.manosMultitud = rampa(u, T.multitud[0] + 0.2, T.multitud[1] + 0.3) * (1 - baja);
  // Los dos gritan agarrados de la mano, con el brazo libre para arriba; la mano se les sacude.
  const grita = loma(u, T.grito[0], T.grito[0] + 0.3, T.grito[1] - 0.2, T.grito[1] + 0.5);
  m.boca = [mezclar(b.boca[0], TODOS.boca[0], grita), mezclar(b.boca[1], TODOS.boca[1], grita)];
  m.cabeza = [mezclar(b.cabeza[0], TODOS.cabeza[0], grita), mezclar(b.cabeza[1], TODOS.cabeza[1], grita)];
  m.libreA = mezclar(b.libreA, TODOS.libreA, grita);
  m.tuboB = mezclar(b.tuboB, TODOS.tuboB, grita);
  m.sacude = 4 * Math.sin(u * 15) * grita;
  m.mece = [b.mece[0] + 4 * grita * (0.6 + 0.4 * Math.sin(u * 7)), b.mece[1] + 4 * grita * (0.6 + 0.4 * Math.sin(u * 7 + 1))];
  m.incl = [mezclar(b.incl[0], 0, grita), mezclar(b.incl[1], 0, grita)];
  m.ondas = mezclar(b.ondas, TODOS.ondas, grita);
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a los náufragos con un azar que se puede fijar (el test lo fija). La isla usa `armarNaufragos`. */
export function armarNaufragosCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--nau')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { busca: 0, estornuda: 0, resbala: 0, telefono: 0, bomba: 0, rayo: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas }) };
  const titere: SVGGElement = g;
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let gritando = false;

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'rayo' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const b = base(t);
    const u = t - desde;
    if (accion === 'rayo') return momentoDelToque(b, u);
    if (accion) return momentoDeAccion(b, accion, u);
    return b;
  }

  function aplicar(m: Momento): void {
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
      aplicar(gritando ? TODOS : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocados: lo que estén haciendo lo dejan, salvo que ya les haya caído el rayo. */
  const tocado = (t: number): void => {
    if (accion !== 'rayo') empezar('rayo', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      gritando = !gritando;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de las manos juntas, y la página abre la ficha. */
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
    estado: () => ({ accion, hechas: { ...hechas } }),
  };
}

export const armarNaufragos: Armar = (marcos, esc) => armarNaufragosCon(marcos, esc);
