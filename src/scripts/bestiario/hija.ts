/**
 * La hija del fletero (`D-73`, decimosexta vuelta), en la popa del ferry que sale.
 *
 * Lo que hace sola sale de la letra, y nada es un bucle: cada cosa tiene su tiempo, que varía.
 *
 * - **Habla por el tubo.** Asiente cuando habla y se queda quieta cuando escucha, en frases de largo
 *   distinto. *"Pero dos que se quieren se dicen cualquier cosa."* No mira para atrás: mira el río.
 * - **El viento del río** le empuja la pollera, la melena y el pañuelo para el lado del muelle, a
 *   ráfagas.
 * - **Le llegan descargas** (*"todavía su amor me da descargas"*): una chispa rosa sube por el cable,
 *   desde el agua, y cuando le llega a la mano se le suben los hombros, se le eriza el pelo y le
 *   prende la cara. Después sigue hablando, como si nada.
 *
 * Tocada, **te mira** (*"recuerdo cómo su mirada me volteó"*): baja el tubo, se da vuelta por encima
 * del hombro, te mira con el ojo grande de la mujer del tubo, y la descarga va para el otro lado: baja
 * por el cable hasta el agua, para el muelle. Vuelve a darte la espalda y a ponerse el tubo. Dice su
 * verso. Con movimiento reducido no se mueve nada: tocarla la pasa de la pose de perfil a la que te
 * mira, quieta.
 *
 * Se lleva números (`rig-hija.ts`) y nada que dibuje: la pose sale de la misma cuenta que la del HTML.
 */

import { QUIETA, VERSO, VUELTA, marcas, type Momento } from '../../lib/bestiario/rig-hija.ts';
import { partes, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'la-hija-del-fletero';

/** Cuánto tardan las cosas, en segundos: lo que se repite varía entre el mínimo y el máximo. */
export const TIEMPOS = {
  frase: [1.4, 3.8],
  escucha: [1.2, 3.4],
  descarga: [10, 20],
  primeraDescarga: [3.5, 6.5],
  parpadeo: [2.6, 6],
} as const;

/** Cuánto dura cada cosa: lo que tarda la chispa en subir por el cable, lo que dura el respingo y la mirada entera. */
export const DURA = { sube: 1.1, respingo: 1.4, mira: 3.8 } as const;

/** La mirada, en segundos desde que la tocan: cuándo baja el tubo, se da vuelta, baja la descarga y vuelve. */
export const MIRA = { baja: 0.45, vuelta: 0.75, descarga: 0.95, bajaHasta: 2, vuelve: 2.7, deVuelta: 3.2, sube: 3.8 } as const;

/**
 * Cuánto espera para abrir la ficha después del toque, en segundos: que se vea cómo se da vuelta y la descarga que baja. En el teléfono la ficha
 * tapa la mitad de abajo de la escena, que es donde pasa; con movimiento reducido se abre enseguida.
 */
export const DEMORA_FICHA = 1.2;

const entre01 = (v: number): number => Math.min(1, Math.max(0, v));

/**
 * La mirada, en el tiempo `u` desde que la tocaron: cuánto se dio vuelta, cuánto bajó el tubo y dónde
 * va la descarga que manda para el muelle (0 es la mano, 1 el agua).
 */
export function mirada(u: number): { vuelta: number; baja: number; chispa: { donde: number; brillo: number } | null } {
  const baja = u < MIRA.vuelve ? suave(u / MIRA.baja) : 1 - suave((u - MIRA.deVuelta) / (MIRA.sube - MIRA.deVuelta));
  const vuelta = u < MIRA.vuelve ? suave((u - 0.2) / (MIRA.vuelta - 0.2)) : 1 - suave((u - MIRA.vuelve) / (MIRA.deVuelta - MIRA.vuelve));
  const k = (u - MIRA.descarga) / (MIRA.bajaHasta - MIRA.descarga);
  const chispa = k >= 0 && k <= 1 ? { donde: suave(k), brillo: Math.min(1, k * 8, (1 - k) * 6) } : null;
  return { vuelta: entre01(vuelta), baja: entre01(baja), chispa };
}

/**
 * La descarga que llega sola, en el tiempo `u` desde que salió del agua: la chispa sube por el cable
 * (de 1 a 0) y, cuando llega, el respingo: los hombros arriba, el pelo erizado, la cara prendida.
 */
export function descarga(u: number): { chispa: { donde: number; brillo: number } | null; hombros: number; eriza: number } {
  if (u < 0) return { chispa: null, hombros: 0, eriza: 0 };
  if (u < DURA.sube) {
    const k = u / DURA.sube;
    // Sube más rápido cerca de la mano: el cable de arriba es más corto que lo que cuelga.
    return { chispa: { donde: 1 - suave(k), brillo: Math.min(1, k * 6) }, hombros: 0, eriza: 0 };
  }
  const r = u - DURA.sube;
  if (r > DURA.respingo) return { chispa: null, hombros: 0, eriza: 0 };
  // El respingo: arriba de golpe, y baja de a poco, con un temblor.
  const golpe = Math.min(1, r / 0.06) * Math.exp(-Math.max(0, r - 0.06) * 2.6);
  const temblor = Math.sin(r * 46) * 0.12 * Math.exp(-r * 3);
  return {
    chispa: r < 0.25 ? { donde: 0, brillo: 1 - r / 0.25 } : null,
    hombros: entre01(golpe + temblor),
    eriza: entre01(Math.min(1, r / 0.05) * Math.exp(-Math.max(0, r - 0.05) * 1.6)),
  };
}

export interface Estado {
  mirando: boolean;
  vuelta: number;
  descargas: number;
  eriza: number;
}

/** Arma a la hija con un azar que se puede fijar (el test lo fija). La isla usa `armarHija`. */
export function armarHijaCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--hija')).find((x): x is SVGGElement => !!x);
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ mirando: false, vuelta: 0, descargas: 0, eriza: 0 }) };
  const titere: SVGGElement = g;
  const p = partes(titere);
  /** Cuándo abre la ficha: después del gesto (`DEMORA_FICHA`). */
  let hablarEn: number | null = null;
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let miraDesde = -100;
  let descargaDesde = -100;
  let proximaDescarga = entre(TIEMPOS.primeraDescarga);
  let descargas = 0;
  let hablando = true;
  let fraseHasta = entre(TIEMPOS.frase);
  let parpadeo = entre(TIEMPOS.parpadeo);
  let cabeza = 0;
  let ultimo: Momento = QUIETA;
  // Con movimiento reducido: cuál de las dos poses quietas está a la vista.
  let mirandoQuieta = false;

  const mirando = (t: number): boolean => t - miraDesde < DURA.mira;

  const mirar = (t: number): void => {
    if (mirando(t) && t - miraDesde < MIRA.vuelve) return;
    miraDesde = t;
  };

  function momento(t: number, paso: number): Momento {
    const m: Momento = { ...QUIETA };
    m.respira = Math.sin(t * 1.6);

    // El viento del río, a ráfagas: el pañuelo flamea más rápido cuanto más sopla.
    const viento = 0.5 + Math.sin(t * 0.53) * 0.22 + Math.sin(t * 1.37 + 1) * 0.12 + Math.max(0, Math.sin(t * 0.21)) * 0.15;
    m.viento = Math.min(1, Math.max(0, viento));
    const vuela = 4 + m.viento * 3;
    m.panuelo = [t * vuela + 0.6, t * vuela * 1.13 + 1.9, t * vuela * 1.27 + 3.1];

    // Habla y escucha, de a frases. Cuando habla asiente; cuando escucha se queda casi quieta.
    if (t > fraseHasta) {
      hablando = !hablando;
      fraseHasta = t + entre(hablando ? TIEMPOS.frase : TIEMPOS.escucha);
    }
    const metaCabeza = hablando ? Math.sin(t * 6.2) * 1.6 + Math.sin(t * 2.3) * 1.1 : 1.6 + Math.sin(t * 0.9) * 0.5;

    // La descarga que llega sola, mientras no te esté mirando.
    if (t > proximaDescarga && !mirando(t)) {
      descargaDesde = t;
      descargas++;
      proximaDescarga = t + entre(TIEMPOS.descarga);
    }
    const de = descarga(t - descargaDesde);
    m.hombros = de.hombros;
    m.eriza = de.eriza;
    m.chispa = de.chispa;

    // La mirada: se da vuelta, baja el tubo, y la descarga va para el muelle.
    if (mirando(t)) {
      const mi = mirada(t - miraDesde);
      m.vuelta = mi.vuelta;
      m.baja = mi.baja;
      if (mi.chispa) m.chispa = mi.chispa;
    }

    // La cabeza asiente con la frase, y da un tirón con el respingo; mientras te mira, quieta.
    cabeza += (metaCabeza * (1 - m.vuelta) - de.hombros * 3 - cabeza) * Math.min(1, paso * 6);
    m.cabeza = cabeza;

    // El párpado: pesado de perfil, más abierto cuando te mira, y un parpadeo cada tanto.
    if (t > parpadeo + 0.13) parpadeo = t + entre(TIEMPOS.parpadeo);
    const ciego = t > parpadeo && t < parpadeo + 0.13;
    m.parpado = ciego ? 1 : QUIETA.parpado + (VUELTA.parpado - QUIETA.parpado) * m.vuelta - m.eriza * 0.2;
    return m;
  }

  function aplicar(m: Momento, fase = 0): void {
    ultimo = m;
    const { transform, opacity, d } = marcas(m, fase);
    for (const [nombre, valor] of Object.entries(transform)) p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
    for (const [nombre, valor] of Object.entries(d)) p.get(nombre)?.setAttribute('d', valor);
  }

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(mirandoQuieta ? VUELTA : QUIETA);
      return;
    }
    const paso = Math.min(dt, 0.1);
    if (t === 0 && dt === 0) {
      aplicar(QUIETA);
      return;
    }
    // Los rulos del cable corren apenas con el viento.
    aplicar(momento(t, paso), Math.sin(t * 0.8) * 0.4);
  }

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      mirandoQuieta = !mirandoQuieta;
      pintar(t, 0);
      decir();
    } else {
      mirar(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso, y la página abre la ficha. */
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
      if (!esc.quieto()) mirar(t);
      return true;
    },
    estado: () => ({ mirando: mirando(esc.reloj()), vuelta: ultimo.vuelta, descargas, eriza: ultimo.eriza }),
  };
}

export const armarHija: Armar = (marcos, esc) => armarHijaCon(marcos, esc);
