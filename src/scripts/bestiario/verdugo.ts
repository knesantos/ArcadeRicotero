/**
 * El verdugo que cena distinguido (`D-73`, decimoctava vuelta), en la otra punta de la mesa servida.
 *
 * Lo que hace solo es cenar con buenos modales, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Pincha** la guinda del plato con el tenedor, con el meñique de la otra mano parado.
 * - **Come**: se levanta el faldón de la capucha como una cortina, se mete el bocado, y abajo asoma la
 *   pera blanca. Después la mesa le sirve otra guinda, sin que nadie la traiga.
 * - **Toma** de la copa por debajo del faldón, echando la capucha para atrás. La copa se le vuelve a
 *   llenar sola cuando la baja.
 * - **Mira** para los costados con los dos puntos al rojo, y **se ríe**: *"ji ji ji"*, tres sacudones de
 *   capucha con los ojos achinados.
 *
 * Tocado, **brinda por tu suerte** (es su estampa): levanta la copa para el lado de quien mira, le corre
 * la luz por el filo del hacha, y se ríe. Dice su verso. Con movimiento reducido no se mueve nada:
 * tocarlo lo pasa de la copa en el pecho a la copa en alto.
 *
 * Se lleva números (`rig-verdugo.ts`) y nada que dibuje.
 */

import { A_LA_BOCA, GESTOS, MANOS_QUIETAS, VERSO, marcas, type Gesto, type Mano, type Punto } from '../../lib/bestiario/rig-verdugo.ts';
import { partes, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-verdugo-que-cena';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { pincha: 1.7, come: 2.6, bebe: 2.8, mira: 2, rie: 1.5, brinda: 3.4 } as const;
export type Accion = keyof typeof DURA;

/** Cuánto espera quieto entre una cosa y otra, y antes de la primera. */
export const PAUSA = [1.1, 3.2] as const;
export const PRIMERA = [0.8, 2] as const;

/** Cuánto espera para abrir la ficha después del toque: que se lo vea levantar la copa. */
export const DEMORA_FICHA = 1.1;

/** Cuánto vino toma de un trago, y el nivel al que la copa se vuelve a llenar sola. */
export const TRAGO = 0.3;
const LLENA_DEBAJO = 0.35;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;
const mezclaP = (a: Punto, b: Punto, k: number): Punto => [mezcla(a[0], b[0], k), mezcla(a[1], b[1], k)];
const mezclaMano = (a: Mano, b: Mano, k: number): Mano => ({ muneca: mezclaP(a.muneca, b.muneca, k), giro: mezcla(a.giro, b.giro, k) });
/** Una ida y vuelta: sube de 0 a 1 entre `a` y `b`, se queda, y baja entre `c` y `d`. */
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));

/** Lo que lleva cada uno: para el test. */
export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
  bocado: Gesto['bocado'];
  vino: number;
}

/** Arma al verdugo con un azar que se puede fijar (el test lo fija). La isla usa `armarVerdugo`. */
export function armarVerdugoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--verdugo')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { pincha: 0, come: 0, bebe: 0, mira: 0, rie: 0, brinda: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas, bocado: 'plato', vino: 1 }) };
  const titere: SVGGElement = g;
  const p = partes(titere);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let bocado: Gesto['bocado'] = 'plato';
  let vino = 1;
  let vinoAntes = 1;
  let llenando = false;
  // Para dónde mira cuando mira, y la mano 2 donde quedó (después de pinchar queda en alto, con el bocado).
  let miraA: { cabeza: number; mira: Punto } = { cabeza: 0, mira: [0, 0] };
  let toquePendiente = false;
  let hablarEn: number | null = null;
  let enAltoQuieto = false;

  /** Elige la próxima cosa: si tiene el bocado en el tenedor, casi seguro se lo come. */
  function elegir(): Accion {
    if (bocado === 'tenedor' && azar() < 0.85) return 'come';
    const r = azar();
    if (bocado !== 'tenedor' && r < 0.36) return 'pincha';
    if (r < 0.6) return 'bebe';
    if (r < 0.84) return 'mira';
    return 'rie';
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    desde = t;
    hechas[a]++;
    if (a === 'bebe') vinoAntes = vino;
    if (a === 'mira') miraA = { cabeza: -12 + azar() * 22, mira: [azar() * 2 - 1, -0.3 + azar() * 0.9] };
  }

  function terminar(t: number): void {
    if (accion === 'pincha') bocado = 'tenedor';
    if (accion === 'come') bocado = 'nada';
    if (accion === 'bebe') vino = Math.max(0.1, vinoAntes - TRAGO);
    accion = null;
    desde = t;
    hasta = t + entre(PAUSA);
  }

  /** El gesto de un momento: la base quieta, con lo que la cosa de ahora le cambia. */
  function gesto(t: number): Gesto {
    const g: Gesto = { ...GESTOS.quieto, manos: [MANOS_QUIETAS[0], MANOS_QUIETAS[1]], bocado, vino };
    // Respira siempre, despacio; y los puntos rojos se pasean un poco solos.
    g.respira = 0.012 * Math.sin(t * 1.3);
    g.mira = [GESTOS.quieto.mira[0] + 0.25 * Math.sin(t * 0.37), GESTOS.quieto.mira[1] + 0.2 * Math.sin(t * 0.53 + 1)];
    // La mano del tenedor, cuando tiene el bocado, espera en alto.
    const enAlto: Mano = { muneca: [30, -64], giro: 6 };
    const mano2 = bocado === 'tenedor' ? enAlto : MANOS_QUIETAS[1];
    g.manos = [MANOS_QUIETAS[0], mano2];
    if (!accion) {
      // Si la copa quedó baja, se le vuelve a llenar sola, de a poco, mientras espera.
      if (vino < LLENA_DEBAJO) llenando = true;
      if (llenando) {
        vino = Math.min(1, vino + 0.006);
        if (vino >= 1) llenando = false;
      }
      // Y al rato de comerse la guinda, la mesa le sirve otra.
      if (bocado === 'nada' && t - desde > 0.9) bocado = 'plato';
      g.vino = vino;
      g.bocado = bocado;
      return g;
    }
    const u = t - desde;
    switch (accion) {
      case 'pincha': {
        // Baja al plato, pincha (un golpecito), y sube con la guinda.
        const baja = rampa(u, 0, 0.55);
        const sube = rampa(u, 1, DURA.pincha);
        const golpe = loma(u, 0.55, 0.7, 0.75, 0.95) * 4;
        const plato: Mano = { ...A_LA_BOCA.plato, muneca: [A_LA_BOCA.plato.muneca[0], A_LA_BOCA.plato.muneca[1] + golpe] };
        g.manos = [MANOS_QUIETAS[0], mezclaMano(mezclaMano(MANOS_QUIETAS[1], plato, baja), enAlto, sube)];
        g.bocado = u > 0.8 ? 'tenedor' : 'plato';
        g.cabeza = mezcla(GESTOS.quieto.cabeza, 6, loma(u, 0, 0.4, 1, 1.5));
        g.mira = mezclaP(g.mira, [0.1, 1], loma(u, 0, 0.4, 1, 1.4));
        break;
      }
      case 'come': {
        // El faldón se recoge, entra el tenedor, sale vacío, y mastica con el faldón temblando.
        const va = loma(u, 0, 0.6, 1.1, 1.7);
        g.manos = [MANOS_QUIETAS[0], mezclaMano(u < 1 ? enAlto : MANOS_QUIETAS[1], A_LA_BOCA.tenedor, va)];
        g.babero = loma(u, 0.25, 0.6, 1.05, 1.4) + loma(u, 1.5, 1.6, 1.6, 1.7) * 0.3 + loma(u, 1.8, 1.9, 1.9, 2) * 0.3 + loma(u, 2.1, 2.2, 2.2, 2.3) * 0.25;
        g.bocado = u < 0.85 ? 'tenedor' : 'nada';
        g.cabeza = mezcla(GESTOS.quieto.cabeza, -2, va) + Math.sin(u * 14) * 1.2 * loma(u, 1.4, 1.5, 2.2, 2.4);
        break;
      }
      case 'bebe': {
        // La copa sube a la boca, se inclina, la capucha va para atrás; baja con menos vino.
        const va = loma(u, 0, 0.7, 1.8, 2.5);
        const inclina = loma(u, 0.7, 1.1, 1.5, 1.8);
        const boca: Mano = { ...A_LA_BOCA.copa, giro: A_LA_BOCA.copa.giro + inclina * 30 };
        g.manos = [mezclaMano(MANOS_QUIETAS[0], boca, va), mano2];
        g.babero = loma(u, 0.45, 0.75, 1.6, 1.9);
        g.cabeza = mezcla(GESTOS.quieto.cabeza, -10, loma(u, 0.6, 1, 1.5, 1.9));
        g.vino = mezcla(vinoAntes, Math.max(0.1, vinoAntes - TRAGO), rampa(u, 0.85, 1.5));
        break;
      }
      case 'mira': {
        const k = loma(u, 0, 0.45, 1.4, 1.95);
        g.cabeza = mezcla(GESTOS.quieto.cabeza, miraA.cabeza, k);
        g.mira = mezclaP(g.mira, miraA.mira, k);
        break;
      }
      case 'rie': {
        // Ji, ji, ji: tres sacudones, con el pecho y la capucha, y los ojos achinados.
        const ji = Math.abs(Math.sin((u / DURA.rie) * Math.PI * 3)) * loma(u, 0, 0.1, DURA.rie - 0.15, DURA.rie);
        g.risa = ji;
        g.respira = 0.03 * ji;
        g.cabeza = GESTOS.quieto.cabeza - 3 * ji;
        break;
      }
      case 'brinda': {
        // La copa en alto, para el lado de quien mira; la luz le corre por el filo; y se ríe ahí arriba.
        const sube = loma(u, 0, 0.6, 2.7, DURA.brinda);
        g.manos = [mezclaMano(MANOS_QUIETAS[0], GESTOS.brinda.manos[0], sube), mano2];
        g.cabeza = mezcla(GESTOS.quieto.cabeza, GESTOS.brinda.cabeza, sube);
        g.mira = mezclaP(g.mira, GESTOS.brinda.mira, sube);
        g.filo = Math.sin(Math.PI * rampa(u, 0.5, 1.5));
        const ji = Math.abs(Math.sin(((u - 1.5) / 1.2) * Math.PI * 3)) * loma(u, 1.5, 1.6, 2.55, 2.7);
        g.risa = ji;
        g.respira = 0.02 * sube + 0.03 * ji;
        break;
      }
    }
    return g;
  }

  function aplicar(g: Gesto): void {
    const { transform, opacity } = marcas(g);
    for (const [nombre, valor] of Object.entries(transform)) if (nombre !== 'entero') p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
  }

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(enAltoQuieto ? GESTOS.brinda : GESTOS.quieto);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(GESTOS.quieto);
      return;
    }
    if (accion && t - desde >= DURA[accion]) terminar(t);
    if (toquePendiente && (!accion || accion === 'mira' || accion === 'rie')) {
      toquePendiente = false;
      empezar('brinda', t);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(gesto(t));
  }

  const tocado = (t: number): void => {
    if (accion === 'brinda') return;
    // Lo que tiene en la boca lo termina: no brinda con el tenedor adentro de la capucha.
    if (accion && accion !== 'mira' && accion !== 'rie') toquePendiente = true;
    else empezar('brinda', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      enAltoQuieto = !enAltoQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la capucha, y la página abre la ficha. */
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
    estado: () => ({ accion, hechas: { ...hechas }, bocado, vino }),
  };
}

export const armarVerdugo: Armar = (marcos, esc) => armarVerdugoCon(marcos, esc);
