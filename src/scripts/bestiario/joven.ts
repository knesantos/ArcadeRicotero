/**
 * El joven lobo (`D-73`, vigesimosexta vuelta), en la cima del volcán del monte.
 *
 * Lo que hace solo es arder despacio, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Aúlla** al monte: la cabeza al cielo, la quijada abierta, el vaho que sube, y las llamas del lomo crecen
 *   con el aullido.
 * - **Se rasca** con la pata de atrás donde le arde, la brasa, y la brasa se aviva de tanto rascar.
 * - **Se mira la cola**, que humea: da vuelta la cabeza, la levanta, le sale una voluta más grande.
 * - **Mira el cráter**: baja la cabeza a la lava, la lava se aviva, saltan chispas.
 * - **Sacude** las orejas y la cabeza, como para apagarse.
 * - **Respira**, pestañea, la brasa late, la cola se mueve sola, el humo del cráter y el de la cola suben sin
 *   parar, la lava burbujea y las llamas no se quedan quietas.
 *
 * Tocado, **arde** (*"y el joven lobo quemándose de amor"*): se yergue, aúlla largo con la cabeza al cielo, la brasa
 * se pone al rojo, las llamas suben, el volcán le hace segunda —la lava brilla, saltan chispas—, y del aullido le
 * sube un humo con forma de corazón; después jadea y se vuelve a sentar. Dice su verso. Con movimiento reducido
 * no se mueve nada: tocarlo lo pasa de sentado a ardiendo.
 *
 * Se lleva números (`rig-joven.ts`) y nada que dibuje.
 */

import { ARDE, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-joven.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-joven-lobo';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { aulla: 3.4, rasca: 3, cola: 3.2, crater: 3, sacude: 2.2, arde: 7.8 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['aulla', 'rasca', 'cola', 'crater', 'sacude'] as const;

export const PAUSA = [1, 2.8] as const;
export const PRIMERA = [0.5, 1.5] as const;
export const DEMORA_FICHA = 1.4;
/** Cada cuánto pestañea, en segundos. */
export const PESTANEA = [2.6, 5.2] as const;
const PESTANEO = 0.22;
/** Lo que tarda cada voluta de humo en subir, del cráter y de la cola. */
export const HUMO = { crater: 3.2, cola: 2.4 } as const;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { yergue: [0, 0.6], aulla: [0.6, 4.4], erupcion: [1.4, 4.8], jadea: [4.4, 6.6], sienta: [6.6, 7.8] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;

/** La pose de base de un instante: respira, la brasa late, el fuego tiembla y el humo sube. */
export function base(t: number): Momento {
  const late = 0.5 + 0.5 * Math.sin(t * 2.6);
  return {
    ...QUIETO,
    respira: Math.sin(t * 3.1),
    cabeza: 2 * Math.sin(t * 0.5),
    cola: 5 * Math.sin(t * 1.1) + 2 * Math.sin(t * 2.7),
    colaHumo: (t / HUMO.cola) % 1,
    brasa: 0.35 + 0.35 * late,
    llamas: 0.45 + 0.2 * Math.sin(t * 9.3) + 0.12 * Math.sin(t * 15.1),
    lava: 0.45 + 0.2 * Math.sin(t * 1.7),
    humo: (t / HUMO.crater) % 1,
    orejas: [2 * Math.sin(t * 0.9), -2 * Math.sin(t * 0.9 + 1)],
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number): Momento {
  const m: Momento = { ...b, orejas: [...b.orejas] };
  switch (accion) {
    case 'aulla': {
      // Levanta la cabeza, abre la quijada y aúlla; el vaho sube y las llamas crecen.
      const k = loma(u, 0, 0.5, 2.6, DURA.aulla);
      m.cabeza = mezclar(m.cabeza, -26, k);
      m.quijada = mezclar(m.quijada, 0.8, loma(u, 0.4, 0.7, 2.4, 2.9));
      m.orejas = [m.orejas[0] - 14 * k, m.orejas[1] - 16 * k];
      m.parpado = Math.max(m.parpado, 0.7 * k);
      m.aullido = ((u - 0.5) / 1.4) % 1;
      m.aullidoSe = loma(u, 0.5, 0.8, 2.4, 2.9);
      m.llamas = mezclar(m.llamas, 0.9, k);
      m.brasa = mezclar(m.brasa, 0.85, k);
      break;
    }
    case 'rasca': {
      // La pata de atrás se rasca el pecho a toda velocidad; la cabeza baja a mirarse; la brasa se aviva.
      const k = loma(u, 0, 0.5, 2.3, DURA.rasca);
      const frota = loma(u, 0.5, 0.7, 2.1, 2.3);
      m.rasca = -40 * k + 12 * frota * Math.sin(u * 32);
      m.cabeza = mezclar(m.cabeza, 18, k);
      m.parpado = Math.max(m.parpado, 0.5 * frota);
      m.brasa = mezclar(m.brasa, 1, frota * (0.6 + 0.4 * Math.sin(u * 32)));
      m.llamas = mezclar(m.llamas, 0.8, frota);
      m.orejas = [m.orejas[0] + 8 * frota, m.orejas[1] + 10 * frota];
      break;
    }
    case 'cola': {
      // Da vuelta la cabeza a la cola, la levanta, y la punta larga una voluta grande.
      const k = loma(u, 0, 0.6, 2.4, DURA.cola);
      m.cabeza = mezclar(m.cabeza, 30, k);
      m.cola = mezclar(m.cola, 26, k);
      m.colaHumo = ((u - 0.6) / 1.6) % 1;
      m.colaHumoSe = mezclar(m.colaHumoSe, 1, loma(u, 0.6, 0.9, 2.2, 2.8));
      m.orejas = [m.orejas[0] + 10 * k, m.orejas[1] + 6 * k];
      break;
    }
    case 'crater': {
      // Baja la cabeza a la lava: la lava se aviva con el aire y saltan chispas.
      const k = loma(u, 0, 0.6, 2.3, DURA.crater);
      m.cabeza = mezclar(m.cabeza, 24, k);
      m.yergue = 0.25 * k;
      m.lava = mezclar(m.lava, 1, k);
      m.chispas = ((u - 0.6) / 1.2) % 1;
      m.chispasSe = loma(u, 0.6, 0.9, 2.2, 2.7) * 0.7;
      m.parpado = Math.max(m.parpado, 0.3 * k);
      break;
    }
    case 'sacude': {
      // Sacude la cabeza y las orejas, como para apagarse; las llamas se agachan y vuelven.
      const k = loma(u, 0, 0.3, 1.6, DURA.sacude);
      m.cabeza += 10 * k * Math.sin(u * 28);
      m.orejas = [m.orejas[0] + 24 * k * Math.sin(u * 28 + 0.6), m.orejas[1] - 24 * k * Math.sin(u * 28 + 0.6)];
      m.parpado = Math.max(m.parpado, 0.8 * k);
      m.llamas = mezclar(m.llamas, 0.2, k);
      m.llamasSe = mezclar(m.llamasSe, 0.4, k);
      m.cola += 8 * k * Math.sin(u * 14);
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b, orejas: [...b.orejas] };
  // Se yergue y levanta la cabeza al cielo.
  const yergue = rampa(u, T.yergue[0], T.yergue[1]) * (1 - rampa(u, T.sienta[0], T.sienta[1]));
  m.yergue = ARDE.yergue * yergue;
  const aulla = loma(u, T.yergue[1] - 0.2, T.aulla[0] + 0.3, T.aulla[1], T.aulla[1] + 0.5);
  m.cabeza = mezclar(m.cabeza, ARDE.cabeza, aulla);
  m.quijada = mezclar(m.quijada, 1, aulla);
  m.orejas = [mezclar(m.orejas[0], ARDE.orejas[0], aulla), mezclar(m.orejas[1], ARDE.orejas[1], aulla)];
  m.parpado = Math.max(m.parpado, ARDE.parpado * aulla);
  // El aullido: el vaho sube en oleadas, y de la última sube el corazón de humo.
  m.aullido = ((u - T.aulla[0]) / 1.3) % 1;
  m.aullidoSe = aulla;
  m.corazon = rampa(u, T.aulla[0] + 1.6, T.aulla[1] + 1);
  m.corazonSe = loma(u, T.aulla[0] + 1.4, T.aulla[0] + 1.8, T.aulla[1] + 0.4, T.aulla[1] + 1);
  // Se quema de adentro: la brasa al rojo y las llamas altas, temblando.
  const arde = loma(u, T.yergue[0], T.aulla[0], T.jadea[0], T.sienta[1]);
  m.brasa = mezclar(m.brasa, 0.75 + 0.25 * Math.sin(u * 11), arde);
  m.llamas = mezclar(m.llamas, 0.8 + 0.2 * Math.sin(u * 13.7), arde);
  m.llamasSe = Math.max(m.llamasSe, arde);
  m.cola = mezclar(m.cola, ARDE.cola + 4 * Math.sin(u * 6), arde);
  m.colaHumoSe = Math.max(m.colaHumoSe, arde);
  // El volcán le hace segunda: la lava brilla y saltan chispas, en dos tandas.
  const erupcion = loma(u, T.erupcion[0], T.erupcion[0] + 0.3, T.erupcion[1], T.erupcion[1] + 0.6);
  m.lava = mezclar(m.lava, 1, erupcion);
  m.chispas = ((u - T.erupcion[0]) / 1.1) % 1;
  m.chispasSe = erupcion;
  m.humo = ((u * 1.6) / 3.2) % 1;
  // Jadea: la quijada a medio abrir, la respiración corta.
  const jadea = loma(u, T.jadea[0], T.jadea[0] + 0.3, T.jadea[1], T.sienta[0] + 0.4);
  m.quijada = mezclar(m.quijada, 0.35 + 0.15 * Math.sin(u * 16), jadea);
  m.respira = mezclar(m.respira, Math.sin(u * 16), jadea);
  m.cabeza = mezclar(m.cabeza, 8, jadea);
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al lobo con un azar que se puede fijar (el test lo fija). La isla usa `armarJoven`. */
export function armarJovenCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--joven')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { aulla: 0, rasca: 0, cola: 0, crater: 0, sacude: 0, arde: 0 };
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
  let ardeQuieto = false;
  let pestanea = entre(PESTANEA);

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'arde' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const b = base(t);
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) b.parpado = Math.sin((ojo / PESTANEO) * Math.PI);
    const u = t - desde;
    if (accion === 'arde') return momentoDelToque(b, u);
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
      aplicar(ardeQuieto ? ARDE : QUIETO);
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

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté ardiendo. */
  const tocado = (t: number): void => {
    if (accion !== 'arde') empezar('arde', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      ardeQuieto = !ardeQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de las orejas, y la página abre la ficha. */
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

export const armarJoven: Armar = (marcos, esc) => armarJovenCon(marcos, esc);
