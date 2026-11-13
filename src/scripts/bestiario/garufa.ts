/**
 * El Rey Garufa (`D-73`, vigesimosexta vuelta), vagando por la nieve de Cybersiberia.
 *
 * Lo que hace solo es vagar, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Camina** unos pasos con el corazón entre las manos, para un lado, y cuando se le acaba la nieve se da
 *   vuelta y vuelve, siguiendo sus propias huellas.
 * - **Mira el corazón**: lo levanta hasta la cara, lo mira un rato, y le late más fuerte.
 * - **Tirita** de frío: tiembla, se le tuerce la corona y se le cae confeti.
 * - **Un pasito** de la fiesta que se terminó: dos pasos de baile sin moverse del lugar, con la serpentina
 *   volando, y la sonrisa le vuelve un segundo.
 * - **Suspira**: una nube de vaho grande, la cabeza gacha, el corazón late lento.
 * - **Respira**, pestañea, el corazón late y el hueco del pecho brilla con cada latido, y de vez en cuando se le
 *   escapa el vaho.
 *
 * Tocado, **ofrece el corazón** (*"y vaga con su corazón entre las manos"*): se para, estira los brazos con el
 * corazón adelante, el corazón late fuerte y grande, el hueco le brilla al ritmo, gotea, le vuelve la sonrisa de
 * fiestero, se le cae el confeti de la corona; después lo vuelve a arrimar al pecho y sigue vagando. Dice su
 * verso. Con movimiento reducido no se mueve nada: tocarlo lo pasa de parado a ofreciendo el corazón.
 *
 * Se lleva números (`rig-garufa.ts`) y nada que dibuje.
 */

import { OFRECE, QUIETO, VAGA, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-garufa.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-rey-garufa';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { camina: 3.2, mira: 3.4, tirita: 2.6, pasito: 2.8, suspira: 3, ofrece: 7.2 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['camina', 'mira', 'tirita', 'pasito', 'suspira'] as const;

export const PAUSA = [0.8, 2.4] as const;
export const PRIMERA = [0.5, 1.5] as const;
export const DEMORA_FICHA = 1.4;
/** Cada cuánto pestañea y cada cuánto se le escapa el vaho, en segundos. */
export const PESTANEA = [2.4, 5] as const;
export const VAHEA = [4, 9] as const;
const PESTANEO = 0.22;
const VAHO = 1.6;
/** Lo que camina por segundo, en sus unidades, y cuántos pasos por segundo da. */
export const VELOCIDAD = 34;
export const PASOS = 1.4;
/** El latido: cuántos por segundo, caminando y ofreciendo. */
export const LATE = { lento: 1.1, fuerte: 2.2 } as const;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { para: [0, 0.5], ofrece: [0.5, 1.4], late: [1.4, 5.4], guarda: [5.4, 6.4], sigue: [6.4, 7.2] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
/** El pulso de un latido: un golpe corto, dos veces por ciclo (el lub y el dub). */
const pulso = (t: number, porSegundo: number): number => {
  const u = (t * porSegundo) % 1;
  return Math.max(0, Math.sin(u * Math.PI * 2)) * (u < 0.5 ? 1 : 0.55);
};

/** La pose de base de un instante: respira, late despacio y el hueco brilla con el latido. */
export function base(t: number, anda: number, lado: 1 | -1): Momento {
  const l = pulso(t, LATE.lento);
  return {
    ...QUIETO,
    anda,
    lado,
    respira: Math.sin(t * 2.4),
    cabeza: QUIETO.cabeza + 2 * Math.sin(t * 0.7),
    late: 0.5 * l,
    latido: 0.3 + 0.7 * l,
    serpentina: 3 * Math.sin(t * 1.9),
    capa: 2 * Math.sin(t * 1.3),
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number, t: number): Momento {
  const m: Momento = { ...b, parpados: [...b.parpados], brazos: [...b.brazos], antebrazos: [...b.antebrazos] };
  switch (accion) {
    case 'camina': {
      // Camina: el `anda` lo lleva la conducta; acá va el paso, el balanceo y la vista al frente.
      const k = loma(u, 0, 0.4, DURA.camina - 0.5, DURA.camina);
      m.camina = k;
      m.paso = (u * PASOS) % 1;
      m.cabeza += 4 * k;
      m.capa += 8 * k;
      break;
    }
    case 'mira': {
      // Levanta el corazón hasta la cara, lo mira, y el corazón se da cuenta: late más.
      const k = loma(u, 0, 0.7, 2.6, DURA.mira);
      m.brazos = [-52 * k, -48 * k];
      m.antebrazos = [-52 * k, -46 * k];
      m.cabeza += 14 * k;
      const l = pulso(t, LATE.fuerte);
      m.late = mezclar(m.late, 0.8 * l, k);
      m.latido = mezclar(m.latido, 0.4 + 0.6 * l, k);
      m.gotas = loma(u, 1, 1.4, 2.2, 2.8);
      break;
    }
    case 'tirita': {
      // Tiembla de frío: el cuerpo vibra, la corona se tuerce más y se le cae el confeti.
      const k = loma(u, 0, 0.3, 2, DURA.tirita);
      m.tirita = 1.6 * k * Math.sin(u * 46);
      m.corona = QUIETO.corona - 10 * k + 3 * k * Math.sin(u * 23);
      m.cabeza += 3 * k * Math.sin(u * 31);
      m.parpados = [m.parpados[0] + 0.4 * k, m.parpados[1] + 0.4 * k];
      m.confeti = rampa(u, 0.4, 2.2);
      m.confetiSe = loma(u, 0.3, 0.5, 1.8, 2.4);
      m.vaho = loma(u, 0.6, 1.2, 1.4, 2.2);
      break;
    }
    case 'pasito': {
      // Dos pasos de baile sin moverse: la pierna se levanta, la serpentina vuela y la sonrisa vuelve.
      const k = loma(u, 0, 0.3, 2.2, DURA.pasito);
      m.camina = 0.6 * k;
      m.paso = (u * 1.1) % 1;
      m.serpentina += 16 * k * Math.sin(u * 6.9);
      m.capa += 12 * k * Math.sin(u * 6.9 + 1);
      m.sonrisa = loma(u, 0.4, 0.9, 1.8, 2.4);
      m.corona = QUIETO.corona + 6 * k * Math.sin(u * 6.9);
      m.cabeza -= 6 * k * Math.sin(u * 6.9);
      break;
    }
    case 'suspira': {
      // Toma aire, lo larga en una nube de vaho y baja la cabeza; el corazón late lento.
      const toma = loma(u, 0, 0.8, 0.9, 1.2);
      m.respira = mezclar(m.respira, 1, toma);
      m.vaho = loma(u, 1, 1.6, 2, 2.9);
      m.cabeza += 12 * rampa(u, 1, 1.8) * (1 - rampa(u, 2.4, DURA.suspira));
      m.parpados = [Math.max(m.parpados[0], 0.6 * rampa(u, 1, 1.6)), Math.max(m.parpados[1], 0.6 * rampa(u, 1, 1.6))];
      m.latido *= 0.6;
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number, t: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b, parpados: [...b.parpados], brazos: [...b.brazos], antebrazos: [...b.antebrazos] };
  // Se para, levanta la cabeza y estira los brazos con el corazón adelante.
  const k = rampa(u, T.ofrece[0], T.ofrece[1]) * (1 - rampa(u, T.guarda[0], T.guarda[1]));
  m.brazos = [OFRECE.brazos[0] * k, OFRECE.brazos[1] * k];
  m.antebrazos = [OFRECE.antebrazos[0] * k, OFRECE.antebrazos[1] * k];
  m.cabeza = mezclar(m.cabeza, OFRECE.cabeza, k);
  m.parpados = [m.parpados[0] * (1 - k), m.parpados[1] * (1 - k)];
  // El corazón late fuerte y grande; el hueco brilla al ritmo; gotea.
  const fuerte = loma(u, T.late[0] - 0.3, T.late[0], T.late[1], T.guarda[1]);
  const l = pulso(t, LATE.fuerte);
  m.late = mezclar(m.late, 0.4 + 0.6 * l, fuerte);
  m.latido = mezclar(m.latido, 0.5 + 0.5 * l, fuerte);
  m.gotas = loma(u, T.late[0] + 0.4, T.late[0] + 1, T.late[1] - 0.4, T.late[1] + 0.4) * ((u * 1.3) % 1);
  // Le vuelve la sonrisa, se le escapa el vaho, y el confeti se cae de la corona.
  m.sonrisa = loma(u, T.ofrece[1], T.ofrece[1] + 0.5, T.guarda[0], T.guarda[1]);
  m.vaho = loma(u, T.ofrece[0], T.ofrece[0] + 0.6, T.ofrece[1] + 0.4, T.late[0] + 1);
  m.corona = mezclar(m.corona, OFRECE.corona, k);
  m.confeti = rampa(u, T.ofrece[1], T.late[0] + 1.4);
  m.confetiSe = loma(u, T.ofrece[0] + 0.3, T.ofrece[1], T.late[0] + 0.8, T.late[0] + 1.6);
  m.serpentina += 10 * k * Math.sin(u * 5);
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
  anda: number;
  lado: 1 | -1;
}

/** Arma al rey con un azar que se puede fijar (el test lo fija). La isla usa `armarGarufa`. */
export function armarGarufaCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--garufa')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { camina: 0, mira: 0, tirita: 0, pasito: 0, suspira: 0, ofrece: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas, anda: 0, lado: 1 }) };
  const titere: SVGGElement = g;
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let ofreceQuieto = false;
  let anda = 0;
  let lado: 1 | -1 = 1;
  let pestanea = entre(PESTANEA);
  let vahea = entre(VAHEA);

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'ofrece' ? ultima : a;
    desde = t;
    hechas[a]++;
    // Si se le acabó la nieve para ese lado, se da vuelta antes de caminar.
    if (a === 'camina') {
      if (anda >= VAGA.hasta - 10) lado = -1;
      else if (anda <= VAGA.desde + 10) lado = 1;
      else if (azar() < 0.3) lado = lado === 1 ? -1 : 1;
    }
  }

  function momento(t: number): Momento {
    const b = base(t, anda, lado);
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) {
      const k = Math.sin((ojo / PESTANEO) * Math.PI);
      b.parpados = [k, k];
    }
    const nube = t - vahea;
    if (nube > 0 && nube < VAHO) b.vaho = Math.max(b.vaho, nube / VAHO);
    const u = t - desde;
    if (accion === 'ofrece') return momentoDelToque(b, u, t);
    if (accion) return momentoDeAccion(b, accion, u, t);
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
      aplicar(ofreceQuieto ? OFRECE : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - pestanea > PESTANEO) pestanea = t + entre(PESTANEA);
    if (t - vahea > VAHO) vahea = t + entre(VAHEA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    // Caminando, avanza lo que el paso lo deja, sin salirse de su nieve.
    if (accion === 'camina') {
      const k = loma(t - desde, 0, 0.4, DURA.camina - 0.5, DURA.camina);
      anda = Math.min(VAGA.hasta, Math.max(VAGA.desde, anda + lado * VELOCIDAD * k * dt));
    }
    aplicar(momento(t));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté ofreciendo el corazón. */
  const tocado = (t: number): void => {
    if (accion !== 'ofrece') empezar('ofrece', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      ofreceQuieto = !ofreceQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la corona, donde esté parado, y la página abre la ficha. */
  const decir = (): void => esc.hablar(ID, VERSO[0] + anda * 0.55, VERSO[1]);
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
    estado: () => ({ accion, hechas: { ...hechas }, anda, lado }),
  };
}

export const armarGarufa: Armar = (marcos, esc) => armarGarufaCon(marcos, esc);
