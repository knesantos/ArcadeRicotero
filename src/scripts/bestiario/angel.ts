/**
 * El ángel de la soledad (`D-73`, decimoséptima vuelta), al pie del árbol del gran bonete.
 *
 * Lo que hace solo sale de la estampa y de la letra, y nada es un bucle.
 *
 * - **Espera con las alas cerradas**, envuelto como en una capa. Respira con las alas, parpadea despacio
 *   y mira de reojo: a vos, al monito que trepa, al jocker que se burla. A lo que mira no le cree:
 *   levanta la ceja.
 * - **Ataja a los que se caen de arriba** (la estampa). Del nido de los pájaros de la noche, que está
 *   justo arriba de él, se cae un huevo de plata. Lo ve venir, abre un poco las alas, levanta las manos y
 *   lo ataja, agachándose con el golpe.
 * - **Y no les cree nada** (*"tampoco cree en lo que oye"*): se lleva el huevo a la oreja, lo escucha con
 *   los ojos cerrados, levanta la ceja, dice que no con la cabeza y lo tira de vuelta para arriba, al
 *   nido. Después cierra las alas.
 *
 * Tocado, **es el verso hecho gesto** (*"Y caes en manos del Ángel de la soledad"*): abre las alas del
 * todo y las manos, como para recibir al que se cae, que sos vos; después las cierra abrazando el aire, y
 * dice que no con la cabeza. Dice su verso. Con movimiento reducido no se mueve nada: tocarlo lo pasa de
 * las alas cerradas a las abiertas.
 *
 * Se lleva números (`rig-angel.ts`) y nada que dibuje.
 */

import {
  ABIERTO, ATAJADO, LUGAR, MANOS_ABIERTAS, MANOS_ABRAZO, MANOS_ATAJAN, MANOS_QUIETAS, MANO_OREJA, QUIETA, VERSO,
  manoEn, marcas, nidoEn, type Momento, type Punto,
} from '../../lib/bestiario/rig-angel.ts';
import { partes, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-angel-de-la-soledad';

/** Cuánto tardan las cosas, en segundos: lo que se repite varía entre el mínimo y el máximo. */
export const TIEMPOS = {
  parpadeo: [2.6, 5.8],
  mirada: [3.2, 7.4],
  ataja: [15, 26],
  primerAtaje: [5, 8],
} as const;

/** Cuánto duran las cosas. */
export const DURA = { ataja: 5.2, toque: 3.2, parpadeo: 0.22 } as const;

/**
 * Los tiempos del ataje, desde que el huevo asoma en el nido: cuándo se suelta, cuándo lo ataja, cuándo
 * lo tira de vuelta y cuándo llega al nido.
 */
export const ATAJE = { suelta: 0.4, ataja: 1.15, tira: 4.0, llega: 4.85 } as const;

/** La gravedad del árbol, en unidades del títere por segundo al cuadrado, para el huevo que sube al nido. */
export const GRAVEDAD = 2000;

/** Cuánto espera para abrir la ficha después del toque: que se lo vea abrir las alas. */
export const DEMORA_FICHA = 1.0;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const meseta = (u: number, a: number, b: number, c: number, d: number): number => Math.min(rampa(u, a, b), 1 - rampa(u, c, d));
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;
const mezclaP = (a: Punto, b: Punto, k: number): Punto => [mezcla(a[0], b[0], k), mezcla(a[1], b[1], k)];

/** Adónde mira, quieto: a vos, al monito que trepa (arriba, al tronco), al jocker (arriba, del otro lado) y abajo. */
export const MIRADAS: Readonly<Record<'vos' | 'monito' | 'jocker' | 'abajo', { cabeza: number; mira: Punto; ceja: number }>> = {
  vos: { cabeza: 0, mira: QUIETA.mira, ceja: QUIETA.ceja },
  monito: { cabeza: 7, mira: [0.95, -0.9], ceja: 0.9 },
  jocker: { cabeza: -6, mira: [-0.95, -0.85], ceja: 0.75 },
  abajo: { cabeza: 3, mira: [0.1, 0.9], ceja: 0.1 },
};

/** Dónde está el huevo en el ataje, en el tiempo `u`, con el nido en `nido` (en el títere). */
export function huevoEn(u: number, nido: Punto, m: Pick<Momento, 'manos' | 'agacha'>): Momento['huevo'] {
  if (u < 0 || u >= ATAJE.llega) return { x: nido[0], y: nido[1], giro: 0, o: 0 };
  if (u < ATAJE.suelta) {
    // Asoma en el nido y se tambalea, antes de caerse.
    return { x: nido[0], y: nido[1], giro: Math.sin(u * 40) * 14 * rampa(u, 0.05, 0.3), o: rampa(u, 0, 0.12) };
  }
  if (u < ATAJE.ataja) {
    // Cae acelerando, de punta: x va derecho del nido a las manos.
    const k = (u - ATAJE.suelta) / (ATAJE.ataja - ATAJE.suelta);
    return { x: mezcla(nido[0], ATAJADO[0], k), y: mezcla(nido[1], ATAJADO[1], k * k), giro: k * 200, o: 1 };
  }
  if (u < ATAJE.tira) {
    // En la mano: la de la oreja, o las dos que atajaron. Va con la mano 1, un poco adentro de la palma.
    const mano = manoEn(0, { ...QUIETA, manos: m.manos, agacha: m.agacha });
    const k = rampa(u, ATAJE.ataja, ATAJE.ataja + 0.35);
    const enLaMano: Punto = [mano[0] - 6, mano[1] - 8];
    const [x, y] = mezclaP(ATAJADO, enLaMano, k);
    return { x, y, giro: 200 + k * 160, o: 1 };
  }
  // Tirado de vuelta para arriba: una parábola de la mano al nido, que pasa apenas por arriba y cae adentro.
  const suelta = manoEn(0, { ...QUIETA, ...ataje(ATAJE.tira) });
  const desde: Punto = [suelta[0] - 6, suelta[1] - 8];
  const T = ATAJE.llega - ATAJE.tira;
  const t = u - ATAJE.tira;
  const vy = (nido[1] - desde[1] - 0.5 * GRAVEDAD * T * T) / T;
  return {
    x: mezcla(desde[0], nido[0], t / T),
    y: desde[1] + vy * t + 0.5 * GRAVEDAD * t * t,
    giro: 360 + t * 520,
    o: 1 - rampa(t / T, 0.82, 1),
  };
}

/** El ataje, en el tiempo `u`: lo ve venir, abre las alas, lo ataja, lo escucha, no le cree y lo tira. */
export function ataje(u: number): Omit<Momento, 'huevo' | 'respira'> {
  // Las alas: se abren un poco para atajar, quedan entreabiertas mientras escucha y se cierran al tirarlo.
  const alas = 0.42 * meseta(u, 0.35, 0.85, 4.0, 4.9);
  // Las manos: arriba a atajar, una a la oreja con el huevo, y el tiro (la mano baja y sube de golpe).
  const arriba = meseta(u, 0.5, 1.0, 1.4, 1.9);
  const oreja = meseta(u, 1.45, 1.95, 3.5, 3.85);
  const tiro = meseta(u, 3.55, 3.85, 3.85, 4.05);
  const baja = meseta(u, 3.4, 3.6, 3.7, 3.85);
  let mano1 = mezclaP(MANOS_QUIETAS[0], MANOS_ATAJAN[0], arriba);
  mano1 = mezclaP(mano1, MANO_OREJA, oreja);
  mano1 = mezclaP(mano1, [30, -118], baja);
  mano1 = mezclaP(mano1, [38, -226], tiro);
  const mano2 = mezclaP(MANOS_QUIETAS[1], MANOS_ATAJAN[1], arriba);
  // El golpe del huevo en las manos: se agacha y vuelve.
  const agacha = meseta(u, 1.1, 1.22, 1.3, 1.6);
  // La cabeza: mira para arriba al nido, se inclina hacia el huevo para escucharlo, y dice que no.
  const noNo = meseta(u, 2.75, 2.95, 3.3, 3.5);
  const cabeza = -5 * meseta(u, 0.15, 0.4, 1.0, 1.3) + 11 * oreja + Math.sin((u - 2.75) * 15) * 8 * noNo;
  const arribaMira = meseta(u, 0.15, 0.35, 1.05, 1.3);
  const mira: Punto = mezclaP(mezclaP(QUIETA.mira, [-0.2, -1], arribaMira), [0.9, 0.2], meseta(u, 2.7, 2.9, 3.6, 3.9));
  // Escucha con los ojos cerrados; después los abre a medias, de no creer.
  const parpados = mezcla(mezcla(QUIETA.parpados, 0.08, arribaMira), 0.96, meseta(u, 1.9, 2.15, 2.55, 2.75));
  const ceja = Math.max(QUIETA.ceja * (1 - arribaMira), meseta(u, 2.6, 2.8, 3.9, 4.4));
  return { alas, manos: [mano1, mano2], agacha, cabeza, mira, parpados, ceja };
}

/** El toque, en el tiempo `u`: abre todo para recibirte, te abraza el aire y dice que no. */
export function toque(u: number): Omit<Momento, 'huevo' | 'respira'> {
  const abre = meseta(u, 0, 0.5, 1.45, 2.1);
  const abrazo = meseta(u, 1.6, 2.05, 2.5, 3.1);
  const noNo = meseta(u, 2.15, 2.3, 2.75, 2.95);
  let manos: [Punto, Punto] = [mezclaP(MANOS_QUIETAS[0], MANOS_ABIERTAS[0], abre), mezclaP(MANOS_QUIETAS[1], MANOS_ABIERTAS[1], abre)];
  manos = [mezclaP(manos[0], MANOS_ABRAZO[0], abrazo), mezclaP(manos[1], MANOS_ABRAZO[1], abrazo)];
  return {
    alas: Math.max(abre, 0.18 * abrazo),
    manos,
    agacha: 0,
    cabeza: Math.sin((u - 2.15) * 15) * 7 * noNo,
    mira: mezclaP(QUIETA.mira, ABIERTO.mira, abre),
    parpados: mezcla(QUIETA.parpados, ABIERTO.parpados, abre) + 0.3 * abrazo,
    ceja: Math.max(mezcla(QUIETA.ceja, ABIERTO.ceja, abre), meseta(u, 2.0, 2.2, 2.8, 3.2)),
  };
}

export interface Estado {
  atajando: boolean;
  tocado: boolean;
  atajes: number;
  mirada: keyof typeof MIRADAS;
}

/** Arma al ángel con un azar que se puede fijar (el test lo fija). La isla usa `armarAngel`. */
export function armarAngelCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--angel')).find((x): x is SVGGElement => !!x);
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ atajando: false, tocado: false, atajes: 0, mirada: 'vos' }) };
  const titere: SVGGElement = g;
  const p = partes(titere);
  // En el camino la copa se estira y el ángel se corre con su marco: el nido le queda más lejos.
  const dx = Number(marcos[0]?.dataset.dx ?? 0);
  const nido = nidoEn(1 + dx / LUGAR.x);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let hablarEn: number | null = null;
  let ataDesde = -100;
  let proximoAtaje = entre(TIEMPOS.primerAtaje);
  let atajes = 0;
  let toqueDesde = -100;
  let toquePendiente = false;
  let parpadeoDesde = -100;
  let proximoParpadeo = entre(TIEMPOS.parpadeo);
  let mirada: keyof typeof MIRADAS = 'vos';
  let antes: keyof typeof MIRADAS = 'vos';
  let miradaDesde = -100;
  let proximaMirada = entre(TIEMPOS.mirada);
  let abiertoQuieto = false;

  const atajando = (t: number): boolean => t - ataDesde < DURA.ataja;
  const tocando = (t: number): boolean => t - toqueDesde < DURA.toque;

  function momento(t: number): Momento {
    if (!atajando(t) && !tocando(t)) {
      if (toquePendiente) {
        toquePendiente = false;
        toqueDesde = t;
      } else if (t > proximoAtaje) {
        ataDesde = t;
        atajes++;
        proximoAtaje = t + DURA.ataja + entre(TIEMPOS.ataja);
      }
    }
    // Quieto: respira con las alas y mira de reojo, cambiando de a ratos.
    if (t > proximaMirada) {
      antes = mirada;
      const r = azar();
      mirada = r < 0.4 ? 'vos' : r < 0.68 ? 'monito' : r < 0.86 ? 'jocker' : 'abajo';
      miradaDesde = t;
      proximaMirada = t + entre(TIEMPOS.mirada);
    }
    const k = rampa(t - miradaDesde, 0, 0.6);
    const [a, b] = [MIRADAS[antes], MIRADAS[mirada]];
    const m: Momento = {
      ...QUIETA,
      respira: Math.sin((t * Math.PI * 2) / 4.4) * 1.6,
      cabeza: mezcla(a.cabeza, b.cabeza, k),
      mira: mezclaP(a.mira, b.mira, k),
      ceja: mezcla(a.ceja, b.ceja, k),
      huevo: { ...QUIETA.huevo },
    };
    if (atajando(t)) {
      const u = t - ataDesde;
      Object.assign(m, ataje(u));
      m.huevo = huevoEn(u, nido, m);
    } else if (tocando(t)) {
      Object.assign(m, toque(t - toqueDesde));
    }
    // El parpadeo, despacio, encima de lo que esté haciendo.
    if (t > proximoParpadeo) {
      parpadeoDesde = t;
      proximoParpadeo = t + entre(TIEMPOS.parpadeo);
    }
    const u = (t - parpadeoDesde) / DURA.parpadeo;
    if (u >= 0 && u <= 1) m.parpados = Math.max(m.parpados, Math.sin(u * Math.PI));
    return m;
  }

  function aplicar(m: Momento): void {
    const { transform, opacity } = marcas(m);
    for (const [nombre, valor] of Object.entries(transform)) p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
  }

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(abiertoQuieto ? ABIERTO : QUIETA);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETA);
      return;
    }
    aplicar(momento(t));
  }

  const tocado = (t: number): void => {
    if (tocando(t)) return;
    // Si está atajando, primero termina: no suelta el huevo por vos.
    if (atajando(t)) toquePendiente = true;
    else toqueDesde = t;
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      abiertoQuieto = !abiertoQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la cabeza, y la página abre la ficha. */
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
    estado: () => {
      const t = esc.reloj();
      return { atajando: atajando(t), tocado: tocando(t) || toquePendiente, atajes, mirada };
    },
  };
}

export const armarAngel: Armar = (marcos, esc) => armarAngelCon(marcos, esc);
