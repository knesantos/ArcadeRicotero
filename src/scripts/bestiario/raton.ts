/**
 * El ratón (`D-73`, vigesimocuarta vuelta), en la canaleta del canto, con el gato matón encima.
 *
 * Lo que hace solo es vivir de oler, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Olfatea** con todo el hocico: lo estira, lo arruga y barre el aire con los bigotes.
 * - **Se lava la cara**, sentado, con las dos manos y los ojos cerrados.
 * - **Se para en dos patas** a mirar, para un lado y para el otro.
 * - **Se mete en la canaleta** de un salto, y al rato asoma el hocico, y sale.
 * - **Roe** el queso de rallar, con los dientes afuera.
 * - **Respira** ligero, como respira un ratón, pestañea, mueve una oreja cada tanto, y los bigotes no se
 *   le quedan quietos nunca: cada mazo trabaja por su lado.
 *
 * Tocado, **huele el peligro** (*"quiero verte oler como el ratón"*): se para y estira el hocico para el lado
 * del gato hasta que le llega el olor; se congela, con el pelo de punta y el ojo del espanto; se tira a la
 * canaleta y desaparece; al rato asoma nada más que el hocico, que olfatea solo; y sale como si nada. Dice
 * su verso. Con movimiento reducido no se mueve nada: tocarlo lo pasa de las cuatro patas a parado,
 * oliendo, con el pelo de punta.
 *
 * Se lleva números (`rig-raton.ts`) y nada que dibuje.
 */

import { HONDO, HUELE, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-raton.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-raton';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { olfatea: 2.6, lava: 3.2, parado: 3, esconde: 3.4, roe: 2.8, huele: 7.6 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['olfatea', 'lava', 'parado', 'esconde', 'roe'] as const;

export const PAUSA = [0.9, 2.6] as const;
export const PRIMERA = [0.5, 1.5] as const;
export const DEMORA_FICHA = 1.2;
/** Cada cuánto pestañea, y cada cuánto se le mueve una oreja sola, en segundos. */
export const PESTANEA = [2.2, 4.8] as const;
export const OREJEA = [2.6, 6] as const;
const PESTANEO = 0.2;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { olfa: [0, 1.6], congela: [1.6, 2.8], huye: [2.8, 3.2], escondido: [3.2, 4.6], asoma: [4.6, 6.2], vuelve: [6.2, 7], calma: [7, 7.6] } as const;

/** Lo que gira cada brazo para llevarse las manos a la cara, sentado. */
export const LAVA: readonly [number, number] = [62, 54];

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const entreT = (u: number, [a, b]: readonly [number, number]): number => Math.min(1, Math.max(0, (u - a) / (b - a)));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;

/** La pose de base de un instante: respira ligero, el hocico late y los bigotes trabajan solos. */
export function base(t: number): Momento {
  return {
    ...QUIETO,
    respira: Math.sin(t * 9),
    cabeza: QUIETO.cabeza + 3 * Math.sin(t * 0.6),
    hocico: 3 * Math.sin(t * 7.7),
    olfato: 0.25 * (0.5 + 0.5 * Math.sin(t * 9.4)),
    bigotes: [8 * Math.sin(t * 5.3) + 4 * Math.sin(t * 13.1), 7 * Math.sin(t * 4.7 + 1) + 4 * Math.sin(t * 11.3)],
    cola: 6 * Math.sin(t * 0.8) + 2 * Math.sin(t * 2.3),
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. `lado` es 1 o −1. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number, lado = 1): Momento {
  const m: Momento = { ...b, bigotes: [...b.bigotes], brazos: [...b.brazos], huida: [...b.huida] };
  switch (accion) {
    case 'olfatea': {
      // Estira el pescuezo y barre el aire: el hocico se arruga y la nariz late a mil.
      const k = loma(u, 0, 0.35, 2.1, DURA.olfatea);
      m.pose = 0.14 * k;
      m.cabeza += k * (6 + 12 * Math.sin(u * 2.4) * lado);
      m.hocico += 10 * k * Math.sin(u * 14);
      m.olfato = mezclar(m.olfato, 0.5 + 0.5 * Math.sin(u * 20), k);
      m.bigotes = [m.bigotes[0] - 16 * k + 10 * k * Math.sin(u * 18), m.bigotes[1] + 14 * k - 10 * k * Math.sin(u * 17)];
      m.oreja = -12 * k;
      break;
    }
    case 'lava': {
      // Se sienta, se lleva las manos a la cara y se la frota en redondo, con los ojos cerrados.
      const k = loma(u, 0, 0.45, 2.6, DURA.lava);
      const frota = loma(u, 0.5, 0.7, 2.4, 2.6);
      m.pose = 0.5 * k;
      m.cabeza += k * -8 + frota * 6 * Math.sin(u * 9);
      m.brazos = [LAVA[0] * k + frota * 14 * Math.sin(u * 9), LAVA[1] * k + frota * 14 * Math.sin(u * 9 + 1.4)];
      m.parpado = Math.max(m.parpado, 0.95 * frota);
      m.bigotes = [m.bigotes[0] + 14 * frota * (0.6 + 0.4 * Math.sin(u * 9)), m.bigotes[1] - 14 * frota];
      m.hocico += 6 * frota * Math.sin(u * 9 + 0.6);
      m.oreja = 10 * frota * Math.sin(u * 9 + 2);
      break;
    }
    case 'parado': {
      // Se para en dos patas, con las manos al pecho, y mira para un lado del canto y para el otro.
      const k = loma(u, 0, 0.4, 2.5, DURA.parado);
      m.pose = k;
      m.brazos = [-12 * k, -18 * k];
      m.cabeza += lado * (14 * loma(u, 0.4, 0.7, 1.2, 1.5) - 12 * loma(u, 1.5, 1.8, 2.2, 2.5));
      m.oreja = -10 * k;
      m.cola -= 10 * k;
      break;
    }
    case 'esconde': {
      // Se tira a la canaleta; al rato asoma el hocico, olfatea, y sale.
      const baja = rampa(u, 0.15, 0.4);
      const asoma = rampa(u, 1.5, 1.8) * (1 - rampa(u, 2.6, 2.9));
      const sale = rampa(u, 2.6, 3.2);
      const y = HONDO * baja * (1 - sale) - (HONDO - 32) * asoma;
      m.agacha = 0.5 * loma(u, 0, 0.12, 0.15, 0.25);
      m.huida = [10 * baja * (1 - sale), y - 10 * Math.sin(Math.PI * entreT(u, [0.12, 0.32]))];
      m.cabeza += 22 * asoma;
      m.olfato = mezclar(m.olfato, 0.5 + 0.5 * Math.sin(u * 22), asoma);
      m.hocico += 8 * asoma * Math.sin(u * 15);
      break;
    }
    case 'roe': {
      // Agacha la cabeza al queso y lo roe, con los dientes afuera: el queso tiembla.
      const k = loma(u, 0, 0.4, 2.3, DURA.roe);
      const roe = loma(u, 0.4, 0.5, 2.2, 2.3);
      m.cabeza -= 16 * k;
      m.agacha = 0.2 * k;
      m.dientes = roe;
      m.hocico += 4 * roe * Math.sin(u * 40);
      m.queso = 2.4 * roe * Math.sin(u * 40 + 1);
      m.parpado = Math.max(m.parpado, 0.4 * roe);
      m.oreja = 8 * roe * Math.sin(u * 3);
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b, bigotes: [...b.bigotes], brazos: [...b.brazos], huida: [...b.huida] };
  // Se para y estira el hocico para el lado del gato; le llega el olor, de a poco, desde la chapa.
  const para = rampa(u, 0, 0.6) * (1 - rampa(u, T.huye[0], T.huye[0] + 0.12));
  m.pose = HUELE.pose * para;
  m.cabeza = mezclar(m.cabeza, HUELE.cabeza, para);
  m.brazos = [HUELE.brazos[0] * para, HUELE.brazos[1] * para];
  m.oreja = HUELE.oreja * para;
  m.olor = rampa(u, 0.1, 0.7) * (1 - rampa(u, T.huye[0], T.escondido[0] + 0.4));
  m.viene = suave(entreT(u, [0.1, 1.4]));
  const olfa = loma(u, 0.2, 0.4, T.congela[0] - 0.05, T.congela[0]);
  m.olfato = mezclar(m.olfato, 0.5 + 0.5 * Math.sin(u * 22), olfa);
  m.hocico = mezclar(m.hocico, HUELE.hocico + 6 * Math.sin(u * 16), olfa);
  m.bigotes = [m.bigotes[0] - 14 * olfa + 12 * olfa * Math.sin(u * 19), m.bigotes[1] + 12 * olfa - 12 * olfa * Math.sin(u * 17)];
  // Se congela: deja de respirar, el pelo de punta, el ojo del espanto, los bigotes duros y la cola tiesa.
  const quieto = loma(u, T.congela[0], T.congela[0] + 0.08, T.huye[1], T.huye[1] + 0.1);
  if (quieto > 0) {
    m.respira *= 1 - quieto;
    m.olfato = mezclar(m.olfato, HUELE.olfato, quieto);
    m.hocico = mezclar(m.hocico, HUELE.hocico, quieto);
    m.bigotes = [mezclar(m.bigotes[0], HUELE.bigotes[0], quieto), mezclar(m.bigotes[1], HUELE.bigotes[1], quieto)];
    m.cola = mezclar(m.cola, HUELE.cola, quieto);
    m.agacha = 0.3 * quieto;
  }
  m.espanto = rampa(u, T.congela[0], T.congela[0] + 0.12) * (1 - rampa(u, T.escondido[1] - 0.3, T.escondido[1]));
  m.erizo = rampa(u, T.congela[0], T.congela[0] + 0.2) * (1 - rampa(u, T.escondido[1] - 0.3, T.escondido[1]));
  // Tirita, apenas.
  const tirita = loma(u, T.congela[0] + 0.3, T.congela[0] + 0.4, T.congela[1] - 0.1, T.congela[1]);
  // Se tira a la canaleta: un saltito y abajo, corriéndose para el lado del Atila.
  const baja = rampa(u, T.huye[0] + 0.05, T.huye[1]);
  const salto = Math.sin(Math.PI * entreT(u, [T.huye[0], T.huye[0] + 0.2]));
  // Abajo, sin que se vea, vuelve para el lado del gato, y asoma el hocico nada más; después sale.
  const vuelta = rampa(u, T.escondido[1] - 0.4, T.escondido[1] - 0.1);
  const asoma = rampa(u, T.asoma[0], T.asoma[0] + 0.4) * (1 - rampa(u, T.vuelve[0], T.vuelve[1] - 0.2));
  const sale = rampa(u, T.vuelve[0], T.vuelve[1]);
  const x = 36 * baja * (1 - vuelta) - 6 * vuelta * (1 - sale);
  const y = HONDO * baja * (1 - sale) - (HONDO - 34) * asoma - 12 * salto * (1 - baja) + 0.8 * tirita * Math.sin(u * 60);
  m.huida = [x + 0.6 * tirita * Math.sin(u * 53), y - 8 * Math.sin(Math.PI * entreT(u, T.vuelve))];
  // Asomado, el hocico apunta arriba y olfatea solo; mira para el gato antes de salir.
  const mira = loma(u, 5.5, 5.8, 6.1, 6.4);
  m.cabeza += 22 * asoma - 14 * mira;
  m.olfato = mezclar(m.olfato, 0.5 + 0.5 * Math.sin(u * 24), asoma * (1 - mira));
  m.hocico += 9 * asoma * Math.sin(u * 15);
  // Ya afuera, sacude las orejas como si nada.
  m.oreja += 16 * loma(u, T.calma[0], T.calma[0] + 0.1, T.calma[0] + 0.25, T.calma[0] + 0.35) * Math.sin(u * 40);
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al ratón con un azar que se puede fijar (el test lo fija). La isla usa `armarRaton`. */
export function armarRatonCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--raton')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { olfatea: 0, lava: 0, parado: 0, esconde: 0, roe: 0, huele: 0 };
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
  let hueleQuieto = false;
  let lado = 1;
  let pestanea = entre(PESTANEA);
  let orejea = entre(OREJEA);

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'huele' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const b = base(t);
    // El pestañeo, y la oreja que se le mueve sola.
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) b.parpado = Math.sin((ojo / PESTANEO) * Math.PI);
    const oreja = t - orejea;
    if (oreja > 0 && oreja < 0.3) b.oreja = -18 * Math.sin((oreja / 0.3) * Math.PI);
    const u = t - desde;
    if (accion === 'huele') return momentoDelToque(b, u);
    if (accion) return momentoDeAccion(b, accion, u, lado);
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
      aplicar(hueleQuieto ? HUELE : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - pestanea > PESTANEO) pestanea = t + entre(PESTANEA);
    if (t - orejea > 0.3) orejea = t + entre(OREJEA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté oliendo el peligro. */
  const tocado = (t: number): void => {
    if (accion !== 'huele') empezar('huele', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      hueleQuieto = !hueleQuieto;
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

export const armarRaton: Armar = (marcos, esc) => armarRatonCon(marcos, esc);
