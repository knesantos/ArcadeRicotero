/**
 * El ovejero (`D-73`, vigesimosexta vuelta), echado en el manto negro en el borde de la pastura.
 *
 * Lo que hace solo es cuidar sin conformarse, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Mira al cordero**: levanta la cabeza, las orejas adelante, la pupila clavada en el claro.
 * - **Bosteza** con la quijada abierta del todo, la lengua enrollada y los ojos cerrados.
 * - **Se lame** los belfos con la lengua, de un lado y del otro.
 * - **Aparta el plato** con el hocico: baja la cabeza a los restos, los huele, y los corre más lejos. No los quiere.
 * - **Se rasca** con la pata de atrás, con la cabeza torcida.
 * - **Gruñe** bajito: el belfo sube, las orejas atrás, un temblor.
 * - **Respira**, pestañea, la cola golpea el manto cada tanto, una oreja se le mueve sola, y la pupila vuelve
 *   siempre al cordero.
 *
 * Tocado, **se pone cruel** (*"tu perro, un perro cruel"*): se para sobre el manto, se le eriza el lomo, las orejas
 * atrás, el belfo levantado y los dientes afuera; ladra sin ruido tres veces, arremetiendo; patea el plato de los
 * restos, que sale volando con los huesos; y se vuelve a echar despacio, con el ojo en el cordero. Dice su verso.
 * Con movimiento reducido no se mueve nada: tocarlo lo pasa de echado a parado, gruñendo.
 *
 * Se lleva números (`rig-ovejero.ts`) y nada que dibuje.
 */

import { CRUEL, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-ovejero.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-ovejero';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { mira: 3.2, bosteza: 2.8, lame: 2.6, aparta: 3.4, rasca: 3, grune: 2.6, cruel: 8.8 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['mira', 'bosteza', 'lame', 'aparta', 'rasca', 'grune'] as const;

export const PAUSA = [1.2, 3.2] as const;
export const PRIMERA = [0.6, 1.8] as const;
export const DEMORA_FICHA = 1.4;
/** Cada cuánto pestañea, cada cuánto golpea la cola y cada cuánto se le mueve una oreja, en segundos. */
export const PESTANEA = [2.6, 5.4] as const;
export const COLEA = [2, 5] as const;
export const OREJEA = [3, 7] as const;
const PESTANEO = 0.22;
const COLEO = 0.9;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { para: [0, 0.9], eriza: [0.6, 1.4], ladra: [1.6, 4.2], patea: [4.4, 5.2], echa: [6.6, 8.2], calma: [8.2, 8.8] } as const;
/** Cuántas veces ladra. */
export const LADRIDOS = 3;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;

/** La pose de base de un instante: echado, respira, y la pupila se queda en el cordero. */
export function base(t: number): Momento {
  return {
    ...QUIETO,
    respira: Math.sin(t * 2.3),
    cabeza: QUIETO.cabeza + 1.5 * Math.sin(t * 0.5),
    pupila: [2 + 0.8 * Math.sin(t * 0.3), 0.4 * Math.sin(t * 0.7)],
    orejas: [1.5 * Math.sin(t * 0.8), -1.5 * Math.sin(t * 0.8 + 1)],
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. `lado` es 1 o −1. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number, lado = 1): Momento {
  const m: Momento = { ...b, orejas: [...b.orejas], pupila: [...b.pupila], plato: [...b.plato] };
  switch (accion) {
    case 'mira': {
      // Levanta la cabeza, las orejas adelante, y mira fijo al cordero.
      const k = loma(u, 0, 0.6, 2.4, DURA.mira);
      m.cabeza = mezclar(m.cabeza, -14, k);
      m.orejas = [m.orejas[0] + 12 * k, m.orejas[1] + 14 * k];
      m.pupila = [mezclar(m.pupila[0], 4, k), mezclar(m.pupila[1], -1, k)];
      m.parpado = Math.max(m.parpado, 0.15 * k);
      break;
    }
    case 'bosteza': {
      // La quijada se abre del todo, la lengua se enrolla, los ojos se cierran, las orejas atrás.
      const k = loma(u, 0, 0.7, 1.9, DURA.bosteza);
      m.quijada = mezclar(m.quijada, 1, k);
      m.lengua = 0.7 * k;
      m.parpado = Math.max(m.parpado, k);
      m.cabeza = mezclar(m.cabeza, -10, k);
      m.orejas = [m.orejas[0] - 20 * k, m.orejas[1] - 22 * k];
      break;
    }
    case 'lame': {
      // La lengua sale y se pasa por los belfos, de un lado al otro.
      const k = loma(u, 0, 0.4, 2, DURA.lame);
      m.lengua = k * (0.5 + 0.5 * Math.sin(u * 9));
      m.quijada = mezclar(m.quijada, 0.3, k);
      m.cabeza += 4 * k * Math.sin(u * 4.5);
      break;
    }
    case 'aparta': {
      // Baja la cabeza al plato, lo huele, y lo corre con el hocico. No los quiere.
      const baja = loma(u, 0, 0.8, 2.6, DURA.aparta);
      const empuja = loma(u, 1.2, 1.7, 2.2, 2.6);
      m.cabeza = mezclar(m.cabeza, 34, baja);
      m.arremete = 8 * baja;
      m.plato = [14 * rampa(u, 1.2, 1.7), 0, 4 * empuja];
      m.orejas = [m.orejas[0] - 8 * baja, m.orejas[1] - 10 * baja];
      m.quijada = mezclar(m.quijada, 0.2, loma(u, 0.8, 1, 1.2, 1.4));
      break;
    }
    case 'rasca': {
      // La pata de atrás de cerca se rasca el cogote a toda velocidad; la cabeza se tuerce.
      const k = loma(u, 0, 0.5, 2.3, DURA.rasca);
      const frota = loma(u, 0.5, 0.7, 2.1, 2.3);
      m.rasca = 40 * k + 14 * frota * Math.sin(u * 30);
      m.cabeza = mezclar(m.cabeza, 16 * lado, k);
      m.parpado = Math.max(m.parpado, 0.6 * frota);
      m.orejas = [m.orejas[0] + 8 * frota * Math.sin(u * 30), m.orejas[1] - 8 * frota * Math.sin(u * 30)];
      break;
    }
    case 'grune': {
      // El belfo sube, las orejas atrás, y un temblor bajito. Sin levantarse.
      const k = loma(u, 0, 0.4, 2, DURA.grune);
      m.belfo = k;
      m.quijada = mezclar(m.quijada, 0.2, k);
      m.orejas = [m.orejas[0] - 24 * k, m.orejas[1] - 26 * k];
      m.tiembla = 0.8 * k * Math.sin(u * 50);
      m.parpado = Math.max(m.parpado, 0.3 * k);
      m.erizo = 0.4 * k;
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b, orejas: [...b.orejas], pupila: [...b.pupila], plato: [...b.plato] };
  // Se para, y al final se vuelve a echar despacio.
  const parado = rampa(u, T.para[0], T.para[1]) * (1 - rampa(u, T.echa[0], T.echa[1]));
  m.echado = 1 - parado;
  // Se eriza, las orejas atrás, el belfo y los dientes.
  const cruel = loma(u, T.eriza[0], T.eriza[1], T.echa[0], T.echa[1]);
  m.erizo = cruel;
  m.belfo = cruel;
  m.orejas = [mezclar(m.orejas[0], CRUEL.orejas[0], cruel), mezclar(m.orejas[1], CRUEL.orejas[1], cruel)];
  m.parpado = Math.max(m.parpado, CRUEL.parpado * cruel);
  m.cola = mezclar(m.cola, CRUEL.cola, cruel);
  m.tiembla = 0.8 * cruel * Math.sin(u * 48);
  // Ladra tres veces sin ruido: la quijada se abre de golpe y arremete.
  const ladra = loma(u, T.ladra[0], T.ladra[0] + 0.1, T.ladra[1], T.ladra[1] + 0.2);
  const ciclo = ((u - T.ladra[0]) / ((T.ladra[1] - T.ladra[0]) / LADRIDOS)) % 1;
  const golpe = ladra * Math.max(0, Math.sin(ciclo * Math.PI)) ** 2;
  m.quijada = mezclar(m.quijada, 0.45, cruel) + 0.55 * golpe;
  m.arremete = CRUEL.arremete * golpe + 4 * cruel;
  m.cabeza = mezclar(m.cabeza, CRUEL.cabeza, cruel) - 8 * golpe;
  // Patea el plato: la pata de adelante se va atrás y pega, el plato vuela y los huesos también.
  const toma = loma(u, T.patea[0], T.patea[0] + 0.3, T.patea[0] + 0.35, T.patea[0] + 0.45);
  const pega = rampa(u, T.patea[0] + 0.35, T.patea[1]);
  m.patea = -30 * toma + 20 * Math.sin(Math.PI * Math.min(1, pega)) * (1 - rampa(u, T.patea[1], T.patea[1] + 0.4));
  m.plato = [CRUEL.plato[0] * pega, CRUEL.plato[1] * pega, CRUEL.plato[2] * pega];
  m.huesos = rampa(u, T.patea[0] + 0.4, T.patea[1] + 0.9);
  m.huesosSe = loma(u, T.patea[0] + 0.35, T.patea[0] + 0.45, T.patea[1] + 0.6, T.patea[1] + 1);
  // Echado otra vez, vuelve el ojo al cordero y respira hondo.
  const calma = rampa(u, T.calma[0], T.calma[1]);
  m.pupila = [mezclar(m.pupila[0], 4, calma), m.pupila[1]];
  m.respira = mezclar(m.respira, Math.sin(u * 6), loma(u, T.echa[0], T.echa[1], T.calma[0], T.calma[1]));
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al ovejero con un azar que se puede fijar (el test lo fija). La isla usa `armarOvejero`. */
export function armarOvejeroCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--ovejero')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { mira: 0, bosteza: 0, lame: 0, aparta: 0, rasca: 0, grune: 0, cruel: 0 };
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
  let cruelQuieto = false;
  let lado = 1;
  let pestanea = entre(PESTANEA);
  let colea = entre(COLEA);
  let orejea = entre(OREJEA);

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'cruel' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const b = base(t);
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) b.parpado = Math.sin((ojo / PESTANEO) * Math.PI);
    const cola = t - colea;
    if (cola > 0 && cola < COLEO) b.cola = 18 * Math.sin((cola / COLEO) * Math.PI * 3) * Math.sin((cola / COLEO) * Math.PI);
    const oreja = t - orejea;
    if (oreja > 0 && oreja < 0.3) b.orejas = [b.orejas[0], b.orejas[1] - 16 * Math.sin((oreja / 0.3) * Math.PI)];
    const u = t - desde;
    if (accion === 'cruel') return momentoDelToque(b, u);
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
      aplicar(cruelQuieto ? CRUEL : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - pestanea > PESTANEO) pestanea = t + entre(PESTANEA);
    if (t - colea > COLEO) colea = t + entre(COLEA);
    if (t - orejea > 0.3) orejea = t + entre(OREJEA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté cruel. */
  const tocado = (t: number): void => {
    if (accion !== 'cruel') empezar('cruel', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      cruelQuieto = !cruelQuieto;
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

export const armarOvejero: Armar = (marcos, esc) => armarOvejeroCon(marcos, esc);
