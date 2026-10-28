/**
 * El gato matón (`D-73`, vigesimosegunda vuelta), agazapado en la chapa del canto.
 *
 * Lo que hace solo es esperar al ratón, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Acecha**: se aplasta contra la chapa y menea el culo, como para saltar. Y no salta.
 * - **Barre con la cola** y mira para los dos lados del canto.
 * - **Se lame la mano**, la de la matraca, con la matraca y todo.
 * - **Bosteza**, y se le ven los colmillos.
 * - **Pestañea**, cada tanto, haga lo que haga.
 *
 * Tocado, **sale de operativo** (*"ha cambiado la sirena, y compró matraca nueva, de ocasión"*): se le
 * prende la sirena de la gorra y barre los techos, maúlla, hace girar la matraca, menea el culo, salta
 * adonde estaba el ratón y cae con las manos vacías: el ratón ya lo había olido. Mira para los dos lados,
 * se apaga la sirena, se lame la mano como si nada y vuelve de un salto. Dice su verso. Con movimiento
 * reducido no se mueve nada: tocarlo lo pasa de agazapado al operativo.
 *
 * Se lleva números (`rig-maton.ts`) y nada que dibuje.
 */

import { LAME, OPERATIVO, QUIETO, SALTO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-maton.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-gato-maton';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { acecha: 2.8, cola: 3, lame: 2.6, bosteza: 2, operativo: 7.2 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.2, 3.2] as const;
export const PRIMERA = [0.6, 1.8] as const;
export const DEMORA_FICHA = 1.2;
/** Cada cuánto pestañea, en segundos. */
export const PESTANEA = [2.4, 5] as const;

/** Los tiempos del operativo: cuándo salta y cuándo cae, para el test y para la conducta. */
export const OPERATIVO_T = { prende: [0, 0.4], matraca: [0.3, 2.2], menea: [1.7, 2.5], vuela: [2.5, 3.2], mira: [3.4, 4.6], apaga: [4.4, 5], lame: [4.8, 5.9], vuelve: [6, 6.9] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const entreT = (u: number, [a, b]: readonly [number, number]): number => Math.min(1, Math.max(0, (u - a) / (b - a)));

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al gato con un azar que se puede fijar (el test lo fija). La isla usa `armarMaton`. */
export function armarMatonCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--maton')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { acecha: 0, cola: 0, lame: 0, bosteza: 0, operativo: 0 };
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
  let operativoQuieto = false;
  let lado = 1;
  let pestanea = entre(PESTANEA);

  function elegir(): Accion {
    const opciones = (['acecha', 'cola', 'lame', 'bosteza'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'operativo' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const m: Momento = { ...QUIETO, patas: [...QUIETO.patas], salto: [...QUIETO.salto] };
    // Agazapado: respira, la punta de la cola le late sola y la cabeza sigue al ratón.
    m.agazapa = QUIETO.agazapa + 0.04 * Math.sin(t * 1.6);
    m.cola = 6 * Math.sin(t * 0.9) + 3 * Math.sin(t * 2.7);
    m.cabeza = QUIETO.cabeza + 2 * Math.sin(t * 0.5);
    // El pestañeo: un cuarto de segundo, cada tanto.
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < 0.24) m.parpado = Math.sin((ojo / 0.24) * Math.PI);
    const u = t - desde;
    switch (accion) {
      case 'acecha': {
        // Se aplasta y menea el culo, cada vez más rápido, y se arrepiente.
        const k = loma(u, 0, 0.5, 2.2, DURA.acecha);
        m.agazapa += 0.6 * k;
        m.menea = 7 * k * Math.sin(u * (8 + u * 4));
        m.cabeza -= 6 * k;
        m.cola += 14 * k * Math.sin(u * 6);
        break;
      }
      case 'cola': {
        // Barre la chapa con la cola y mira para un lado del canto, después para el otro.
        m.cola += 34 * loma(u, 0, 0.4, 2.4, DURA.cola) * Math.sin(u * 3.2);
        m.cabeza += lado * (-22 * loma(u, 0.2, 0.6, 1.2, 1.5) + 18 * loma(u, 1.5, 1.9, 2.5, 2.9));
        break;
      }
      case 'lame': {
        // Se lleva la mano de la matraca a la boca y se la lame, con la matraca y todo.
        const k = loma(u, 0, 0.5, 2, DURA.lame);
        m.patas = [0, LAME * k];
        m.cabeza -= 10 * k;
        m.lengua = k > 0.8 ? 0.5 + 0.5 * Math.sin(u * 22) : 0;
        m.parpado = Math.max(m.parpado, 0.7 * k);
        break;
      }
      case 'bosteza': {
        const k = loma(u, 0, 0.5, 1.3, DURA.bosteza);
        m.boca = k;
        m.cabeza -= 16 * k;
        m.parpado = Math.max(m.parpado, 0.9 * k);
        m.agazapa -= 0.2 * k;
        break;
      }
      case 'operativo': {
        const T = OPERATIVO_T;
        // La sirena se prende, barre los techos dando vueltas y se apaga cuando ya no hay a quién.
        const prendida = rampa(u, T.prende[0], T.prende[1]) * (1 - rampa(u, T.apaga[0], T.apaga[1]));
        m.sirena = prendida * (0.75 + 0.25 * Math.sin(u * 30));
        m.barre = u * 420;
        // Alerta: levanta la cabeza y maúlla de cana.
        m.cabeza = mezclar(m.cabeza, OPERATIVO.cabeza, loma(u, 0, 0.3, 2.4, 2.6));
        m.boca = loma(u, 0.1, 0.3, 0.9, 1.2);
        // La matraca nueva, a toda máquina, con la pata levantada.
        const gira = loma(u, T.matraca[0], T.matraca[0] + 0.2, T.matraca[1] - 0.2, T.matraca[1]);
        m.patas = [0, OPERATIVO.patas[1] * gira];
        m.matraca = (u - T.matraca[0]) * 1500 * gira;
        m.ratata = gira * (0.6 + 0.4 * Math.sin(u * 40));
        // El meneo de antes del salto.
        const menea = loma(u, T.menea[0], T.menea[0] + 0.2, T.menea[1] - 0.1, T.menea[1]);
        m.agazapa = mezclar(m.agazapa, 1, menea);
        m.menea = 9 * menea * Math.sin(u * 26);
        m.cola += 20 * menea;
        // El salto: un arco hasta donde estaba el ratón, estirado en el aire.
        const v = entreT(u, T.vuela);
        if (u >= T.vuela[0]) {
          m.salto = [SALTO.largo * suave(v), SALTO.alto * Math.sin(Math.PI * Math.min(1, v))];
          m.estira = u < T.vuela[1] ? Math.sin(Math.PI * v) : 0;
          m.vuelo = u < T.vuela[1] ? -14 * Math.cos(Math.PI * v) : 0;
          m.patas = [-40 * m.estira, -50 * m.estira];
          // Cae y se aplasta.
          m.agazapa = Math.max(m.agazapa * (1 - m.estira), 0.9 * loma(u, T.vuela[1] - 0.05, T.vuela[1] + 0.05, T.vuela[1] + 0.2, T.vuela[1] + 0.5));
        }
        // Nada: mira para los dos lados con las manos vacías.
        m.cabeza += -26 * loma(u, T.mira[0], T.mira[0] + 0.25, T.mira[0] + 0.5, T.mira[0] + 0.7) + 20 * loma(u, T.mira[0] + 0.6, T.mira[0] + 0.85, T.mira[1] - 0.2, T.mira[1]);
        // Como si nada: se lame la mano.
        const lame = loma(u, T.lame[0], T.lame[0] + 0.3, T.lame[1] - 0.3, T.lame[1]);
        if (lame > 0) {
          m.patas = [m.patas[0], LAME * lame];
          m.lengua = lame > 0.8 ? 0.5 + 0.5 * Math.sin(u * 22) : 0;
          m.parpado = Math.max(m.parpado, 0.8 * lame);
        }
        // Y vuelve a su lugar, de un salto para atrás.
        if (u >= T.vuelve[0]) {
          const w = entreT(u, T.vuelve);
          m.salto = [SALTO.largo * (1 - suave(w)), SALTO.alto * 0.4 * Math.sin(Math.PI * w)];
          m.estira = 0.4 * Math.sin(Math.PI * w);
        }
        break;
      }
    }
    return m;
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
      aplicar(operativoQuieto ? OPERATIVO : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - pestanea > 0.24) pestanea = t + entre(PESTANEA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté de operativo. */
  const tocado = (t: number): void => {
    if (accion !== 'operativo') empezar('operativo', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      operativoQuieto = !operativoQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la sirena, y la página abre la ficha. */
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

const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;

export const armarMaton: Armar = (marcos, esc) => armarMatonCon(marcos, esc);
