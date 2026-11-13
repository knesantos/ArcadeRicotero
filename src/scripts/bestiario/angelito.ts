/**
 * El angelito frito (`D-73`, vigesimoctava vuelta), caído al pie del árbol, del lado del galpón, con el cable todavía en
 * la mano.
 *
 * Lo que hace solo no es un bucle: elige qué hace cada vez, y casi nada le sale bien.
 *
 * - **Tose** humo, dos veces, y se le sacude el cuerpo entero.
 * - **Se acomoda la aureola**: se le va resbalando por el costado, la mira, la golpea con la cabeza para arriba, y vuelve a
 *   quedar torcida.
 * - **El brote lo quiere**: se le arrima al pie, se lo toca, y él lo patea sin ganas. El brote se achica y vuelve.
 * - **Hace contacto**: el enchufe tiene una chispa, se le pone el pelo de punta un segundo y se le ve un hueso de la mano; después
 *   no pasa nada, y se queda mirando el cable.
 * - **Mira su ala**: la ve humear, le sopla, las brasas se apagan y se vuelven a prender.
 * - Y siempre: respira, las dos alas y la zapatilla echan humo, las brasas laten, los ojos le dan vueltas, y la aureola
 *   parpadea como un tubo que no agarra.
 *
 * Tocado, *"estás frito, angelito"*: lo cruza la corriente. Las chispas saltan del enchufe, el cuerpo le tiembla, se le ven
 * los huesos tres veces, el pelo se le para del todo, los ojos se le salen, las alas se abren de golpe y la aureola sale
 * volando y vuelve a caerle rebotando, torcida para el otro lado. Con movimiento reducido no se mueve nada: tocarlo lo pasa
 * de sentado a frito.
 *
 * Se lleva números (`rig-angelito.ts`) y nada que dibuje.
 */

import { FRITO, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-angelito.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-angelito-frito';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { tos: 2.4, aureola: 3.4, patea: 3.2, contacto: 2.2, ala: 3.4, frito: 5.2 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['tos', 'aureola', 'patea', 'contacto', 'ala'] as const;

export const PAUSA = [1.4, 3.8] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.5;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { zap: [0, 0.8], huesos: [[0.05, 0.2], [0.32, 0.47], [0.6, 0.75]], vuela: [0.3, 2.1], cae: [2.1, 2.7], aflojan: [2.2, 5] } as const;
/** Cuánto sube la aureola, volando. */
export const SUBE_AUREOLA = 52;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const copia = (b: Momento): Momento => ({ ...b, pupilas: [...b.pupilas], aureola: [...b.aureola], alas: [...b.alas], humo: [...b.humo], temblor: [...b.temblor] }) as Momento;
/** El aliento: se llena despacio y se vacía más rápido (−1 a 1). */
export const aliento = (t: number, periodo: number): number => {
  const p = (((t % periodo) + periodo) % periodo) / periodo;
  return p < 0.62 ? -Math.cos((Math.PI * p) / 0.62) : Math.cos((Math.PI * (p - 0.62)) / 0.38);
};

/** El tubo que no agarra: casi siempre prendido, y de a ratos se le va un cuarto de segundo (0 a 1). */
export const parpadeo = (t: number): number => (Math.sin(t * 2.3) * Math.sin(t * 5.7 + 1) > 0.86 ? 0.15 : 1);

/** La pose de base de un instante: sentado, respira, los ojos le dan vueltas, humea, las brasas laten. `signo` es para qué lado quedó torcida la aureola. */
export function base(t: number, signo = 1): Momento {
  return {
    ...QUIETO,
    respira: aliento(t, 4.2),
    // Los ojos le dan vueltas, mareados.
    pupilas: [1.6 * Math.cos(t * 1.7), 1.4 * Math.sin(t * 2.1), 1],
    aureola: [0.8 * Math.sin(t * 1.3), 0.8 * Math.sin(t * 0.9 + 1), -14 * signo + 1.4 * Math.sin(t * 1.1), parpadeo(t)],
    brasas: 0.62 + 0.3 * Math.sin(t * 1.9) + 0.08 * Math.sin(t * 7.3),
    humo: [(t * 0.2) % 1, (t * 0.2 + 0.45) % 1, (t * 0.28 + 0.2) % 1],
    brote: 1.6 * Math.sin(t * 1.1) + 0.8 * Math.sin(t * 2.9),
    pelo: 1 + 0.02 * Math.sin(t * 3.1),
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number): Momento {
  const m = copia(b);
  switch (accion) {
    case 'tos': {
      // Dos toses: se dobla, sale la bocanada, y se endereza.
      for (const [c, k] of [[0.5, 1], [1.4, 0.8]] as const) {
        const tose = loma(u, c - 0.2, c, c + 0.05, c + 0.5);
        m.tos = Math.max(m.tos, tose * k);
        m.tumbo += 3.4 * tose * k;
        m.cabeza += 6 * tose * k;
      }
      m.pelo += 0.06 * m.tos;
      break;
    }
    case 'aureola': {
      // Se le resbala por el costado hasta la oreja; levanta la vista, la golpea con la cabeza y sube; queda torcida otra vez.
      const baja = loma(u, 0, 1.1, 1.6, 1.9);
      const golpe = loma(u, 1.5, 1.7, 1.8, 2.3);
      m.aureola = [b.aureola[0] + 8 * baja, b.aureola[1] + 12 * baja - 9 * golpe, b.aureola[2] - 20 * baja + 6 * golpe, b.aureola[3]];
      m.cabeza += -8 * golpe + 5 * baja;
      m.pupilas = [b.pupilas[0] - 2 * baja, b.pupilas[1] + 1.8 * baja, 1];
      break;
    }
    case 'patea': {
      // El brote se arrima, le toca el pie, y el pie sale despedido; el brote se achica y vuelve de a poco.
      const llega = loma(u, 0, 1.2, 1.5, 2.5);
      const patada = loma(u, 1.45, 1.55, 1.7, 2.2);
      m.brote = b.brote + 13 * llega - 20 * patada;
      m.pie = 24 * patada;
      m.tumbo += -2 * patada;
      m.pupilas = [b.pupilas[0] - 2.6 * llega, b.pupilas[1] + 2 * llega, 1];
      m.cabeza += 6 * llega;
      break;
    }
    case 'contacto': {
      // Chispa en el enchufe: se le para el pelo, se le ve un hueso, y no pasa nada más.
      const chispa = loma(u, 0.5, 0.56, 0.7, 0.9);
      const hueso = loma(u, 0.52, 0.56, 0.72, 0.8);
      m.chispas = chispa * (0.7 + 0.3 * Math.sin(u * 60));
      m.pelo = b.pelo + 0.36 * chispa;
      m.esqueleto = 0.5 * hueso;
      m.temblor = [1.2 * chispa * Math.sin(u * 70), 0.8 * chispa * Math.cos(u * 83)];
      m.pupilas = [b.pupilas[0], b.pupilas[1], 1 + 0.4 * chispa];
      m.brazo = -4 * chispa;
      // Después se queda mirando el cable.
      m.cabeza += 7 * loma(u, 1, 1.5, 2, 2.2);
      break;
    }
    case 'ala': {
      // Mira un ala, le sopla, las brasas se apagan y se prenden de golpe.
      const mira = loma(u, 0, 0.7, 2.6, 3.2);
      const sopla = loma(u, 1.1, 1.3, 1.9, 2.2);
      m.cabeza += -9 * mira;
      m.pupilas = [b.pupilas[0] + 3 * mira, b.pupilas[1] - 1.4 * mira, 1];
      m.tos = 0.5 * sopla;
      m.brasas = b.brasas * (1 - 0.6 * sopla) + 0.4 * loma(u, 2, 2.1, 2.3, 2.9);
      m.alas = [3 * loma(u, 1, 1.2, 2.2, 2.5), 3 * loma(u, 1, 1.2, 2.2, 2.5)];
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. `signo` es el de la aureola de antes. */
export function momentoDelToque(b: Momento, u: number, signo = 1): Momento {
  const T = TOQUE_T;
  const m = copia(b);
  const zap = loma(u, T.zap[0], 0.04, 0.55, T.zap[1]);
  // La corriente: el cuerpo tiembla, las chispas saltan, los huesos aparecen tres veces.
  m.temblor = [3.4 * zap * Math.sin(u * 90), 2.4 * zap * Math.cos(u * 77)];
  m.chispas = Math.max(zap, loma(u, 0.8, 0.9, 1.1, 1.5) * 0.6) * (0.75 + 0.25 * Math.sin(u * 55));
  m.esqueleto = Math.max(...T.huesos.map(([a, c]) => loma(u, a, a + 0.03, c - 0.03, c)));
  // El pelo se le para a pleno, y se le va aflojando.
  const pelo = loma(u, 0, 0.1, T.aflojan[0], T.aflojan[1]);
  m.pelo = mezclar(b.pelo, FRITO.pelo, pelo);
  m.pupilas = [b.pupilas[0] * (1 - zap), b.pupilas[1] * (1 - zap), mezclar(1, FRITO.pupilas[2], loma(u, 0, 0.08, 1.2, 2))];
  // Las alas se abren de golpe y se cierran de a poco; las brasas se prenden y el humo sale a borbotones.
  const abre = loma(u, 0, 0.12, 0.9, 2.6);
  m.alas = [FRITO.alas[0] * abre, FRITO.alas[1] * abre];
  m.brasas = mezclar(b.brasas, 1, loma(u, 0, 0.1, 2, 4));
  m.humo = [(u * 0.9) % 1, (u * 0.9 + 0.33) % 1, (u * 0.9 + 0.66) % 1];
  m.cabeza = b.cabeza + FRITO.cabeza * loma(u, 0, 0.1, 1.4, 2.4);
  m.tumbo = b.tumbo + FRITO.tumbo * loma(u, 0, 0.1, 1.2, 2.2);
  m.brazo = FRITO.brazo * loma(u, 0, 0.1, 1.2, 2);
  m.pie = FRITO.pie * loma(u, 0.05, 0.15, 1.2, 2.2);
  m.brote = b.brote + FRITO.brote * loma(u, 0.8, 1.4, 3.2, 4.4);
  // La aureola sale volando, gira, queda un rato en el aire y vuelve rebotando, torcida para el otro lado.
  const sube = loma(u, T.vuela[0], 0.8, 1.5, T.vuela[1]);
  const cae = rampa(u, T.cae[0], T.cae[1]);
  const rebote = u > T.cae[1] ? Math.exp(-(u - T.cae[1]) * 6) * Math.abs(Math.sin((u - T.cae[1]) * 11)) * 8 : 0;
  m.aureola = [
    mezclar(b.aureola[0], FRITO.aureola[0], sube) + 6 * Math.sin(u * 3) * sube,
    -SUBE_AUREOLA * sube - 4 * Math.sin(u * 9) * sube + rebote * -1,
    mezclar(b.aureola[2], 14 * -signo * -1, cae) + 360 * rampa(u, 0.3, 1.2) * (1 - cae) + 12 * Math.sin(u * 8) * sube,
    1,
  ];
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al angelito con un azar que se puede fijar (el test lo fija). La isla usa `armarAngelito`. */
export function armarAngelitoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--angelito')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { tos: 0, aureola: 0, patea: 0, contacto: 0, ala: 0, frito: 0 };
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
  let fritoQuieto = false;
  /** Para qué lado quedó torcida la aureola: el toque la da vuelta. */
  let signo = 1;

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'frito' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const b = base(t, signo);
    const u = t - desde;
    if (accion === 'frito') return momentoDelToque(b, u, signo);
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
      aplicar(fritoQuieto ? FRITO : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (accion && t - desde >= DURA[accion]) {
      // Lo que cambió después del toque: la aureola quedó torcida para el otro lado.
      if (accion === 'frito') signo = -signo;
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya lo esté cruzando la corriente. */
  const tocado = (t: number): void => {
    if (accion !== 'frito') empezar('frito', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      fritoQuieto = !fritoQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la aureola, y la página abre la ficha. */
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

export const armarAngelito: Armar = (marcos, esc) => armarAngelitoCon(marcos, esc);
