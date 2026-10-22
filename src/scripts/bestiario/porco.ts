/**
 * Porco Rex (`D-73`, decimosexta vuelta), solo en su campo de juego de la nieve de Cybersiberia.
 *
 * Lo que hace solo sale de la letra y de lo que el Indio contó de él, y nada es un bucle.
 *
 * - **Va a Porno Rock** (*"va Porco Rex a Porno Rock!"*): siempre está yendo. Trota de una punta a la
 *   otra de su campo, con el paso cruzado de los chanchos, y en cada punta se para, resopla y pega la
 *   vuelta. *"La soledad es el campo de juego de Porco Rex"*, dice el disco del Indio que lleva su
 *   nombre (`RES-21`, p. 486): trota solo.
 * - **Larga vaho** por la trompa, del frío, y a veces se queda mirando la tele grande, donde asomó
 *   la cabezota por primera vez: le brilla en los anteojos.
 * - **Se revuelca en el barro**: es un rey arrastrado al barro (`RES-21`, p. 397). Va al charco del
 *   medio, hoza, se echa y se hamaca, salpicando.
 *
 * Tocado, **se para en dos patas y hace los cuernos del rock** con las pezuñas partidas, tira la cabeza
 * para atrás y chilla; la corona le salta y le vuelve a caer torcida, y la tele le brilla en los
 * anteojos. Después sigue trotando. Dice su verso. Con movimiento reducido no se mueve nada: tocarlo lo
 * pasa de la pose quieta a la del rock.
 *
 * Se lleva números (`rig-porco.ts`) y nada que dibuje.
 */

import { LUGAR, QUIETA, ROCK, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-porco.ts';
import { partes, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'porco-rex';

/** Cuánto tardan las cosas, en segundos: lo que se repite varía entre el mínimo y el máximo. */
export const TIEMPOS = {
  pausa: [0.8, 2.2],
  vaho: [2.2, 4.4],
  revuelca: [14, 26],
  primerRevuelco: [8, 12],
  tele: [6, 14],
} as const;

/** Cuánto duran las cosas. */
export const DURA = { rock: 2.8, revuelca: 4.6, tele: 2.2 } as const;

/** A qué velocidad trota (unidades del recinto por segundo), y cuánto avanza en cada paso entero. */
export const TROTE = { velocidad: 34, zancada: 22 } as const;

/**
 * Cuánto espera para abrir la ficha después del toque, en segundos: que se lo vea pararse y hacer los cuernos. En el teléfono la ficha
 * tapa la mitad de abajo de la escena, que es donde pasa; con movimiento reducido se abre enseguida.
 */
export const DEMORA_FICHA = 1.0;

const entre01 = (v: number): number => Math.min(1, Math.max(0, v));
const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const meseta = (u: number, a: number, b: number, c: number, d: number): number => Math.min(rampa(u, a, b), 1 - rampa(u, c, d));

/** Las patas en la fase `fase` del trote: cruzadas, la de adelante de acá con la de atrás de allá. */
export function patasAlTrote(fase: number, k = 1): [number, number, number, number] {
  const a = Math.sin(fase) * 26 * k;
  return [a, -a, -a, a];
}

/** El rock, en el tiempo `u` desde que lo tocaron: se para, chilla, la corona salta y cae, y vuelve a las cuatro patas. */
export function rock(u: number): Pick<Momento, 'parado' | 'boca' | 'cabeza' | 'brillo' | 'ceja' | 'orejas' | 'corona'> {
  const parado = meseta(u, 0, 0.45, 1.9, 2.5);
  const salto = u > 0.35 && u < 1.15 ? Math.sin(Math.PI * ((u - 0.35) / 0.8)) : 0;
  return {
    parado,
    boca: meseta(u, 0.38, 0.55, 1.6, 1.85),
    cabeza: ROCK.cabeza * parado + Math.sin(u * 20) * 3 * meseta(u, 0.45, 0.6, 1.5, 1.8),
    brillo: Math.max(0.3, meseta(u, 0.4, 0.5, 1.4, 1.9)),
    ceja: meseta(u, 0.3, 0.5, 1.8, 2.2),
    orejas: meseta(u, 0.3, 0.5, 1.8, 2.2),
    corona: { y: -16 * salto + ROCK.corona.y * parado, giro: ROCK.corona.giro * parado + Math.sin(u * 14) * 8 * salto },
  };
}

/** El revuelco, en el tiempo `u` desde que llegó al charco: hoza, se echa, se hamaca salpicando y se levanta. */
export function revuelco(u: number): Pick<Momento, 'echado' | 'hamaca' | 'cabeza' | 'salpica'> {
  const hoza = meseta(u, 0, 0.3, 1, 1.2);
  const echado = meseta(u, 1, 1.5, 3.8, 4.4);
  const hamaca = echado * Math.sin((u - 1.4) * 5.5) * entre01((u - 1.4) / 0.3);
  return {
    echado,
    hamaca,
    cabeza: 20 * hoza + Math.sin(u * 22) * 4 * hoza,
    salpica: Math.max(hoza * 0.5 * Math.abs(Math.sin(u * 11)), echado * Math.abs(Math.sin((u - 1.4) * 5.5)) * 0.95),
  };
}

export interface Estado {
  rockeando: boolean;
  revolcandose: boolean;
  x: number;
  mira: 1 | -1;
  vueltas: number;
}

/** Arma a Porco con un azar que se puede fijar (el test lo fija). La isla usa `armarPorco`. */
export function armarPorcoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--porco')).find((x): x is SVGGElement => !!x);
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ rockeando: false, revolcandose: false, x: 0, mira: 1, vueltas: 0 }) };
  const titere: SVGGElement = g;
  const p = partes(titere);
  /** Cuándo abre la ficha: después del gesto (`DEMORA_FICHA`). */
  let hablarEn: number | null = null;
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let x = 0;
  let mira: 1 | -1 = 1;
  let fase = 0;
  let quietoHasta = 0.6;
  let vueltas = 0;
  let rockDesde = -100;
  let revuelcoDesde = -100;
  let proximoRevuelco = entre(TIEMPOS.primerRevuelco);
  let yendoAlCharco = false;
  let teleDesde = -100;
  let proximaTele = entre(TIEMPOS.tele);
  let vahoDesde = -100;
  let proximoVaho = entre(TIEMPOS.vaho);
  let cola = 0;
  let ultimo: Momento = QUIETA;
  let rockQuieto = false;

  const rockeando = (t: number): boolean => t - rockDesde < DURA.rock;
  const revolcandose = (t: number): boolean => t - revuelcoDesde < DURA.revuelca;

  const tocado = (t: number): void => {
    if (rockeando(t)) return;
    rockDesde = t;
  };

  function momento(t: number, paso: number): Momento {
    const m: Momento = { ...QUIETA, corona: { ...QUIETA.corona }, vaho: { ...QUIETA.vaho } };
    const ocupado = rockeando(t) || revolcandose(t);
    let trota = 0;

    if (!ocupado) {
      // Al charco del medio, a revolcarse.
      if (t > proximoRevuelco && !yendoAlCharco) yendoAlCharco = true;
      const meta = yendoAlCharco ? 0 : mira * LUGAR.ida;
      if (yendoAlCharco && Math.abs(x) < 2) {
        yendoAlCharco = false;
        revuelcoDesde = t;
        proximoRevuelco = t + DURA.revuelca + entre(TIEMPOS.revuelca);
      } else if (t > quietoHasta) {
        if (Math.abs(meta - x) < 0.5) {
          // Llegó a la punta, y ya resopló: pega la vuelta.
          mira = (mira === 1 ? -1 : 1) as 1 | -1;
          vueltas++;
          quietoHasta = t + 0.35;
          vahoDesde = t;
        } else {
          const dir = Math.sign(meta - x) as 1 | -1;
          if (dir !== mira) {
            // Va al charco, que le queda atrás: se da vuelta.
            mira = dir;
            vueltas++;
            quietoHasta = t + 0.35;
          } else {
            const avanza = Math.min(Math.abs(meta - x), TROTE.velocidad * paso);
            x += mira * avanza;
            fase += (avanza / TROTE.zancada) * Math.PI * 2;
            trota = 1;
            // En la punta se para un momento y resopla, antes de pegar la vuelta.
            if (Math.abs(meta - x) < 0.5 && !yendoAlCharco) {
              quietoHasta = t + entre(TIEMPOS.pausa);
              vahoDesde = t;
            }
          }
        }
      }
    }
    m.x = x;
    m.mira = mira;
    m.patas = patasAlTrote(fase, trota);
    m.rebote = Math.abs(Math.sin(fase)) * 2.4 * trota;
    m.orejas = Math.sin(fase * 2) * 0.35 * trota;
    cola += paso * (trota ? 520 : 90);
    m.cola = Math.sin((cola * Math.PI) / 180) * 30;

    // Mira la tele grande, parado: le brilla en los anteojos.
    if (t > proximaTele && !trota && !ocupado) {
      teleDesde = t;
      proximaTele = t + DURA.tele + entre(TIEMPOS.tele);
    }
    const tele = meseta(t - teleDesde, 0, 0.4, DURA.tele - 0.4, DURA.tele);
    m.cabeza = -12 * tele * (mira === 1 ? 1 : 0.4);
    m.brillo = 0.3 + 0.7 * tele;

    // El vaho del frío, por la trompa.
    if (t > proximoVaho) {
      vahoDesde = t;
      proximoVaho = t + entre(TIEMPOS.vaho);
    }
    const uv = (t - vahoDesde) / 1.3;
    if (uv >= 0 && uv <= 1) m.vaho = { k: 0.5 + uv * 1.2, o: Math.min(1, uv * 6) * (1 - uv) * 0.9 };

    if (revolcandose(t)) Object.assign(m, revuelco(t - revuelcoDesde));
    if (rockeando(t)) {
      const r = rock(t - rockDesde);
      Object.assign(m, r);
      m.patas = [0, 0, 6 * r.parado, -6 * r.parado];
      m.rebote = 0;
    }
    return m;
  }

  function aplicar(m: Momento): void {
    ultimo = m;
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
      aplicar(rockQuieto ? ROCK : QUIETA);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETA);
      return;
    }
    aplicar(momento(t, Math.min(dt, 0.1)));
  }

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      rockQuieto = !rockQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso, arriba de donde esté trotando, y la página abre la ficha. */
  const decir = (): void => esc.hablar(ID, VERSO[0] + x, VERSO[1]);
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
    estado: () => ({ rockeando: rockeando(esc.reloj()), revolcandose: revolcandose(esc.reloj()), x: ultimo.x, mira: ultimo.mira, vueltas }),
  };
}

export const armarPorco: Armar = (marcos, esc) => armarPorcoCon(marcos, esc);
