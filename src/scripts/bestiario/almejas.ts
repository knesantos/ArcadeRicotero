/**
 * Las almejas (`D-73`, vigesimoctava vuelta), en su balde sobre el muelle.
 *
 * Lo que hacen solas es no entenderse: nada es un bucle, elige qué hace cada vez.
 *
 * - **Hablan**: las tres abren y cierran la valva, una atrás de la otra, como una conversación en la que nadie escucha.
 * - **Una se escapa**: la que se salió del balde se va por la tabla, estirando el pie y arrastrándose, pasa por arriba
 *   de las cartas, se da cuenta de que no hay para dónde, aplaude con la valva, y vuelve.
 * - **La cuchara baja a buscarlas**: sale del plato, se queda sobre el balde, mete la punta y la almeja de la derecha
 *   se la muerde y no la suelta; la sacude, la levanta, y al final la almeja se cansa y cae. La cuchara vuelve vacía.
 * - **Bosteza una**: abre la valva del todo, despacio, y la cierra de golpe.
 *
 * Tocadas, **se cierran todas juntas de un golpe** y el balde pega un salto; abren de par en par, tiran tres chorros
 * uno atrás del otro, y la última escupe una perla que cae en la sopa con un golpe de cuchara. Dicen su verso. Con
 * movimiento reducido no se mueve nada: tocarlas las pasa de entreabiertas a abiertas, con la perla en el aire.
 *
 * Se llevan números (`rig-almejas.ts`) y nada que dibuje.
 */

import { ALMEJAS_ARMADO, QUIETO, SOPA, VERSO, cucharaA, marcas, type Momento } from '../../lib/bestiario/rig-almejas.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'las-almejas';

/** Lo que pueden hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { hablan: 3.4, fuga: 6, cuchara: 5.4, bostezo: 2.8, toque: 6 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['hablan', 'fuga', 'cuchara', 'bostezo'] as const;

export const PAUSA = [1.6, 3.8] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.4;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { cierran: [0, 0.5], abren: [0.5, 1.3], chorros: [1.3, 3.6], perla: [3.1, 4.7], cuchara: [4.5, 5.1], fin: 6 } as const;
/** Lo que salta el balde del golpe, en sus unidades. */
export const SALTA = 14;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const copia = (b: Momento): Momento => ({ ...b, abre: [...b.abre], chorro: [...b.chorro], cuchara: [...b.cuchara], perla: [...b.perla] }) as Momento;
const A = ALMEJAS_ARMADO;

/** La pose de base de un instante: entreabiertas, que respiran apenas, y el vapor que sube. */
export function base(t: number): Momento {
  return {
    ...QUIETO,
    abre: [0.3 + 0.06 * Math.sin(t * 1.3), 0.46 + 0.07 * Math.sin(t * 1.1 + 1), 0.22 + 0.06 * Math.sin(t * 1.5 + 2)],
    vapor: (t / 3.4) % 1,
    cuchara: [0, 0, 1.2 * Math.sin(t * 1.7)],
  };
}

/** Donde está la punta de la cuchara cuando baja a la almeja de la derecha (en las coordenadas del balde). */
const SOBRE_LA_ALMEJA: readonly [number, number] = [A.almejas[2][0] - 2, A.almejas[2][1] - 30];
const EN_LA_ALMEJA: readonly [number, number] = [A.almejas[2][0] - 2, A.almejas[2][1] - 6];

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number): Momento {
  const m = copia(b);
  switch (accion) {
    case 'hablan': {
      // Una atrás de la otra: cada una abre y cierra a su ritmo, y se pisan.
      const dentro = loma(u, 0, 0.3, DURA.hablan - 0.5, DURA.hablan);
      m.abre = b.abre.map((a, i) => mezclar(a, 0.65 * (0.5 + 0.5 * Math.sin(u * (6 + i * 2.1) + i * 2)), dentro * (u > 0.3 * i ? 1 : 0))) as unknown as Momento['abre'];
      break;
    }
    case 'fuga': {
      // Se va para la izquierda a los empujones: estira el pie, lo apoya, se arrastra. Llega al final de las cartas, ve que no hay
      // para dónde, aplaude, se da vuelta y vuelve.
      const ida = rampa(u, 0.3, 2.6);
      const vuelta = rampa(u, 3.5, 5.7);
      const x = A.fugitiva.hasta * (ida - vuelta);
      m.fuga = x;
      // El pie va y viene a cada paso: dos veces por tramo.
      const caminando = ida > 0 && ida < 1 ? 1 : vuelta > 0 && vuelta < 1 ? 1 : 0;
      m.pie = caminando * (0.5 + 0.5 * Math.sin(u * 9));
      m.mira = u < 3.1 ? 1 : -1;
      // Aplaude: la valva da tres golpes.
      m.fugiAbre = mezclar(0.26, 0.7 * Math.max(0, Math.sin((u - 2.7) * 14)), loma(u, 2.65, 2.7, 3.35, 3.4));
      break;
    }
    case 'cuchara': {
      // Sale del plato, se queda sobre el balde y baja a la almeja de la derecha; la almeja se la muerde, la cuchara la sube y la sacude,
      // y cuando se cansa, cae. La cuchara vuelve vacía.
      const sube = loma(u, 0, 1.2, 3.8, 4.8);
      const baja = loma(u, 1.2, 1.6, 2.1, 2.5);
      const [x, y] = [mezclar(SOBRE_LA_ALMEJA[0], EN_LA_ALMEJA[0], baja), mezclar(SOBRE_LA_ALMEJA[1], EN_LA_ALMEJA[1], baja)];
      const sacude = 7 * Math.sin(u * 21) * loma(u, 2.3, 2.5, 3.1, 3.4);
      const [dx, dy, ang] = cucharaA([x, y - 6 * loma(u, 2.4, 2.8, 3.2, 3.6)], -22 + sacude * 0.3);
      m.cuchara = [mezclar(b.cuchara[0], dx, sube), mezclar(b.cuchara[1], dy, sube), mezclar(b.cuchara[2], ang, sube)];
      // La almeja de la derecha la muerde de golpe (cierra la valva), la lleva colgada, y se suelta de a poco.
      const muerde = u >= 1.9 && u < 3.55;
      m.abre = [b.abre[0], b.abre[1], muerde ? 0.02 : u < 1.9 ? mezclar(b.abre[2], 0.8, rampa(u, 1.2, 1.7)) : mezclar(0.02, b.abre[2], rampa(u, 3.55, 4.2))];
      m.prendida = loma(u, 1.9, 2.0, 3.4, 3.6);
      break;
    }
    case 'bostezo': {
      const k = loma(u, 0, 1.5, 2.2, 2.3);
      m.abre = [mezclar(b.abre[0], 1, k), b.abre[1], b.abre[2]];
      // Contagia: la del medio se cierra un poquito.
      m.abre = [m.abre[0], mezclar(b.abre[1], 0.05, k * 0.8), m.abre[2]];
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que las tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copia(b);
  // Se cierran todas de un golpe y el balde pega un salto; la fugitiva también.
  const cierra = loma(u, T.cierran[0], T.cierran[0] + 0.05, T.cierran[1] - 0.05, T.cierran[1]);
  m.salto = SALTA * loma(u, T.cierran[0], 0.18, 0.32, T.cierran[1] + 0.1);
  m.tiembla = 3 * Math.sin(u * 40) * loma(u, 0.02, 0.1, 0.4, 0.7);
  // Abren de par en par, de a una: la que bosteza primero, después las otras dos.
  const abierta = (i: number): number => rampa(u, T.abren[0] + 0.12 * i, T.abren[1] + 0.12 * i);
  const cierraDespues = (i: number): number => rampa(u, T.fin - 1 + 0.1 * i, T.fin);
  m.abre = [0, 1, 2].map((i) => mezclar(b.abre[i]!, 1, abierta(i)) * (1 - cierra * 0.98) * (1 - cierraDespues(i)) + b.abre[i]! * cierraDespues(i)) as unknown as Momento['abre'];
  m.fugiAbre = mezclar(b.fugiAbre, 1, rampa(u, T.abren[0], T.abren[1])) * (1 - cierraDespues(0)) + b.fugiAbre * cierraDespues(0);
  m.pie = 0.8 * loma(u, T.abren[0], T.abren[1], T.fin - 1.2, T.fin - 0.6);
  // Tres chorros, uno atrás del otro, que se estiran de golpe y se aflojan.
  m.chorro = [0, 1, 2].map((i) => loma(u, T.chorros[0] + 0.5 * i, T.chorros[0] + 0.5 * i + 0.16, T.chorros[0] + 0.5 * i + 0.8, T.chorros[0] + 0.5 * i + 1.1)) as unknown as Momento['chorro'];
  // Cada chorro cierra un poco la almeja que lo tira.
  m.abre = m.abre.map((a, i) => a * (1 - 0.35 * m.chorro[i]!)) as unknown as Momento['abre'];
  // La perla: la escupe la del medio hacia arriba, hace un arco, y cae en la sopa.
  const k = rampa(u, T.perla[0], T.perla[1]);
  const [x0, y0] = A.almejas[1];
  const [x1, y1] = [A.plato[0] - 2, A.plato[1] - 12];
  m.perla = [mezclar(x0, x1, k), mezclar(y0, y1, k) - 82 * 4 * k * (1 - k)];
  m.perlaSe = u >= T.perla[0] && u < T.perla[1] ? 1 : 0;
  // La sopa recibe la perla con un golpe de cuchara: se mueve, y vuelve.
  m.cuchara = [b.cuchara[0], b.cuchara[1] - 3 * loma(u, T.cuchara[0], T.cuchara[0] + 0.1, T.cuchara[0] + 0.2, T.cuchara[1]), b.cuchara[2] + 14 * loma(u, T.cuchara[0], T.cuchara[0] + 0.08, T.cuchara[0] + 0.15, T.cuchara[1])];
  m.hay = 1;
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a las almejas con un azar que se puede fijar (el test lo fija). La isla usa `armarAlmejas`. */
export function armarAlmejasCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--almejas')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { hablan: 0, fuga: 0, cuchara: 0, bostezo: 0, toque: 0 };
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
  let abiertas = false;

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'toque' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const b = base(t);
    const u = t - desde;
    if (accion === 'toque') return momentoDelToque(b, u);
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
      aplicar(abiertas ? SOPA : QUIETO);
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

  /** Tocadas: lo que estén haciendo lo dejan, salvo que ya estén en el toque. */
  const tocado = (t: number): void => {
    if (accion !== 'toque') empezar('toque', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      abiertas = !abiertas;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba del balde, y la página abre la ficha. */
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

export const armarAlmejas: Armar = (marcos, esc) => armarAlmejasCon(marcos, esc);
