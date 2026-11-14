/**
 * La hormiga dormida (`D-73`, vigesimoctava vuelta), tirada panza arriba en el mantel, al lado del membrillo.
 *
 * Lo que hace sola es dormir, con ganas, y dormir no le sale bien del todo. Nada es un bucle: elige qué sueña cada vez.
 *
 * - **Ronca**: la burbuja se le infla de a poco, se pone brillante, y de pronto revienta; ella se sobresalta un poquito, las
 *   antenas se le paran, y vuelve a roncar.
 * - **Sueña que baila**: las patas le hacen tum-tum en el aire, una y otra, al compás de algo que solo escucha ella, y la
 *   cabeza le asiente. Se para sola.
 * - **Se despierta a medias**: entreabre un ojo, la gota fría le baja por la frente, mira, y lo vuelve a cerrar.
 * - **Se le duerme la pata**: la pata que le cuelga le hormiguea; la sacude, la sacude, y no se despierta.
 * - Y siempre: respira, las zetas suben, y la camisa se seca al viento.
 *
 * Tocada, *"vamos, negrita, bailá hasta el fin"*: se despierta de golpe, con los ojos abiertos de par en par, y baila de espaldas:
 * da dos vueltas sobre la espalda, pateando para todos lados, con la camisa que se zamarrea en el hilo. De a poco se
 * cansa, las patas se le aflojan, y se vuelve a dormir; con la pata que le cuelga en otro lugar. Dice su verso. Con movimiento
 * reducido no se mueve nada: tocarla la pasa de dormida a bailando.
 *
 * Se lleva números (`rig-hormiga.ts`) y nada que dibuje.
 */

import { BAILA, HORMIGA_ARMADO, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-hormiga.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'la-hormiga-dormida';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { ronca: 4.2, suena: 3.2, medias: 3.2, pata: 2.6, baila: 6.4 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['ronca', 'suena', 'medias', 'pata'] as const;

export const PAUSA = [1.2, 3.4] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.4;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { despierta: [0, 0.35], baila: [0.5, 4.3], duerme: [4.3, 6] } as const;
/** Cuántas vueltas da sobre la espalda cuando baila, y cuánto patea. */
export const VUELTAS = 2;
export const PATEA = 32;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const copia = (b: Momento): Momento => ({ ...b, antenas: [...b.antenas], patas: [...b.patas] }) as Momento;
/** El aliento: se llena despacio y se vacía más rápido (−1 a 1). */
export const aliento = (t: number, periodo: number): number => {
  const p = (((t % periodo) + periodo) % periodo) / periodo;
  return p < 0.62 ? -Math.cos((Math.PI * p) / 0.62) : Math.cos((Math.PI * (p - 0.62)) / 0.38);
};

/** La pose de base de un instante: dormida, respira, las zetas suben, la camisa se seca, la burbuja va y viene un poco. `pata` es dónde le quedó la que le cuelga. */
export function base(t: number, pata = 0): Momento {
  return {
    ...QUIETO,
    respira: aliento(t, 3.6),
    antenas: [2.4 * Math.sin(t * 1.1), 2 * Math.sin(t * 0.9 + 1)],
    patas: [pata + 2.2 * Math.sin(t * 0.7), 1.8 * Math.sin(t * 0.6 + 2)],
    cabeza: 0.8 * Math.sin(t * 0.5),
    burbuja: 0.5 + 0.1 * Math.sin(t * 0.8),
    zzz: (t * 0.26) % 1,
    camisa: 7 * Math.sin(t * 1.2) + 3 * Math.sin(t * 2.7),
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number): Momento {
  const m = copia(b);
  switch (accion) {
    case 'ronca': {
      // La burbuja se infla y se infla, y revienta: ahí se sobresalta, y se le para una antena.
      const infla = rampa(u, 0, 2.6);
      const reventada = u >= 2.7;
      m.burbuja = reventada ? 0 : mezclar(b.burbuja, 1, infla);
      const susto = loma(u, 2.7, 2.78, 2.9, 3.6);
      m.antenas = [b.antenas[0] - 22 * susto, b.antenas[1] - 28 * susto];
      m.ojos = 0.3 * susto;
      m.cabeza += -5 * susto;
      m.salto = 2.4 * susto;
      m.gota = 0.5 * loma(u, 2.8, 3, 3.3, 4);
      // La burbuja nueva empieza chica, de a poco.
      if (u > 3.4) m.burbuja = 0.5 * rampa(u, 3.4, 4.2);
      break;
    }
    case 'suena': {
      // Sueña que baila: las patas hacen tum-tum, una y otra, y la cabeza asiente al compás.
      const k = loma(u, 0, 0.4, 2.4, 3.1);
      const tum = Math.sin(u * 10);
      m.patas = [b.patas[0] + 20 * k * tum, b.patas[1] - 20 * k * tum];
      m.cabeza += 3 * k * Math.abs(tum);
      m.salto = 0.8 * k * Math.abs(tum);
      m.antenas = [b.antenas[0] + 6 * k * tum, b.antenas[1] - 6 * k * tum];
      break;
    }
    case 'medias': {
      // Se despierta a medias: se le abre un ojo, la gota le baja por la frente, mira, y lo cierra.
      const k = loma(u, 0, 0.5, 2.3, 2.9);
      m.ojos = 0.55 * k;
      m.gota = loma(u, 0.4, 0.5, 2.2, 3);
      m.antenas = [b.antenas[0] - 14 * k, b.antenas[1] - 18 * k];
      m.cabeza += -4 * k;
      break;
    }
    case 'pata': {
      // La pata que le cuelga le hormiguea: la sacude, la sacude, y no se despierta.
      const k = loma(u, 0, 0.2, 1.9, 2.5);
      m.patas = [b.patas[0] + 16 * k * Math.sin(u * 24), b.patas[1]];
      m.cabeza += 2 * k * Math.sin(u * 24);
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que la tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copia(b);
  // Se despierta de golpe: salta del mantel, abre los ojos de par en par, las antenas se paran, la gota fría.
  const despierta = loma(u, T.despierta[0], 0.12, T.duerme[0], T.duerme[1]);
  m.ojos = despierta;
  m.antenas = [mezclar(b.antenas[0], BAILA.antenas[0], despierta), mezclar(b.antenas[1], BAILA.antenas[1], despierta)];
  m.burbuja = u < 0.1 ? b.burbuja * (1 - u / 0.1) : u > T.duerme[1] - 0.6 ? 0.5 * rampa(u, T.duerme[1] - 0.6, T.duerme[1]) : 0;
  m.zzzVe = 1 - despierta;
  m.gota = loma(u, 0.12, 0.25, 1.6, 2.4) * 0.9 + 0.1 * loma(u, 0.12, 0.25, 1.6, 2.4);
  const salto0 = 10 * loma(u, 0, 0.14, 0.14, 0.5);
  // Baila de espaldas: da las vueltas sobre la espalda (el cuerpo se achata, se da vuelta y vuelve), pateando.
  const [b0, b1] = T.baila;
  const baila = loma(u, b0, b0 + 0.25, b1 - 0.5, b1);
  const giro = ((u - b0) / (b1 - b0)) * VUELTAS * Math.PI * 2;
  m.flip = u < b0 || u > b1 ? 1 : mezclar(1, Math.cos(giro), baila);
  const patea = Math.sin(u * 15);
  m.patas = [mezclar(b.patas[0], PATEA * patea, baila), mezclar(b.patas[1], -PATEA * patea, baila)];
  m.salto = salto0 + 6 * baila * Math.abs(Math.sin(u * 5));
  m.giro = -9 * despierta * Math.sin(u * 5) * baila;
  m.cabeza = b.cabeza + (-8 * despierta + 6 * Math.sin(u * 10) * baila);
  m.camisa = b.camisa + 22 * baila * Math.sin(u * 9);
  // Se cansa: las patas se aflojan y se vuelve a dormir.
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a la hormiga con un azar que se puede fijar (el test lo fija). La isla usa `armarHormiga`. */
export function armarHormigaCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--hormiga')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { ronca: 0, suena: 0, medias: 0, pata: 0, baila: 0 };
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
  let bailaQuieta = false;
  /** Dónde le quedó la pata que le cuelga después del baile: cambia con cada toque. */
  let pata = 0;

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'baila' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const b = base(t, pata);
    const u = t - desde;
    if (accion === 'baila') return momentoDelToque(b, u);
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
      aplicar(bailaQuieta ? BAILA : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (accion && t - desde >= DURA[accion]) {
      // Lo que cambió después del baile: la pata dormida quedó en otro lugar.
      if (accion === 'baila') pata = pata ? 0 : 12;
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocada: lo que esté haciendo lo deja, salvo que ya esté bailando. */
  const tocado = (t: number): void => {
    if (accion !== 'baila') empezar('baila', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      bailaQuieta = !bailaQuieta;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de las zetas, y la página abre la ficha. */
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

export const armarHormiga: Armar = (marcos, esc) => armarHormigaCon(marcos, esc);

/** Dónde apoya la cabeza: el dedal. Lo mira el test para saber que la hormiga no se corre de su almohada al bailar. */
export const ALMOHADA = HORMIGA_ARMADO.dedal;
