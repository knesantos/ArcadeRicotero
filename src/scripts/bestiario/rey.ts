/**
 * El rey de esta jungla (`D-73`, vigesimoquinta vuelta): enterrado hasta los ojos en la ladera del monte.
 *
 * Lo que hace solo es mirar crecer las flores desde abajo, y nada es un bucle: elige qué pasa cada vez.
 *
 * - **Mira** una flor y después otra, con los ojos nada más.
 * - **Se abre una flor**: uno de los capullos se abre despacio, y a la noche se vuelve a cerrar.
 * - **La rueda** floja del patín gira con el viento y para.
 * - **Cae un pétalo** de la flor naranja, hamacándose, y queda un rato en la tierra.
 * - **Pasa un escarabajo** por la cara del montículo, y los ojos lo siguen.
 * - **Duerme**: cierra los ojos un rato largo y los vuelve a abrir.
 * - Y la tierra respira apenas, las flores se hamacan con el aire y él pestañea.
 *
 * Tocado, **ruge sin voz** (el sitio no tiene sonido): la tierra tiembla y se parte, el león empuja la cabeza
 * afuera hasta la boca, con la corona de lata que le salta a la cabeza, torcida, y abre la boca grande; las
 * flores crecen de golpe y se abren todas, el patín se le vuelve a soltar y sale rodando y vuelve, la cruz
 * se tambalea, y él se hunde despacio otra vez hasta los ojos, a mirar crecer las flores desde abajo. Dice su
 * verso. Con movimiento reducido no se mueve nada: tocarlo lo pasa de enterrado a asomado, y de vuelta.
 *
 * Se lleva números (`rig-rey.ts`) y nada que dibuje.
 */

import { ASOMA, QUIETO, REY_ARMADO, RUEDA_LEJOS, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-rey.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-rey-de-esta-jungla';

/** Lo que puede pasar, y cuánto dura cada cosa, en segundos. */
export const DURA = { mira: 3.2, abre: 4.2, rueda: 3.4, petalo: 3.2, bicho: 4.6, duerme: 4.8, ruge: 7.4 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['mira', 'abre', 'rueda', 'petalo', 'bicho', 'duerme'] as const;

export const PAUSA = [0.8, 2.4] as const;
export const PRIMERA = [0.5, 1.5] as const;
/** Dice el verso con la boca abierta. */
export const DEMORA_FICHA = 2.2;
/** Cada cuánto pestañea, en segundos. */
export const PESTANEA = [2.6, 5.4] as const;
const PESTANEO = 0.22;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { tiembla: [0, 0.9], sube: [0.7, 1.7], ruge: [1.9, 3.5], rueda: [2, 4.6], hunde: [3.8, 6.6], calma: [6.6, 7.4] } as const;

/** Para dónde miran los ojos cada flor (corrimiento de las pupilas). */
const HACIA_FLOR = [[-3, -1.6], [2.6, -1.8], [3.2, -0.6], [-3.4, 0.6]] as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
/** Lo que gira una rueda por lo que anduvo, en grados. */
const gira = (x: number): number => (x / REY_ARMADO.rueda) * (180 / Math.PI);

type Cuatro = [number, number, number, number];

/** La pose de base de un instante: la tierra respira apenas y las flores se hamacan con el aire. */
export function base(t: number): Momento {
  return {
    ...QUIETO,
    respira: Math.sin(t * 1.1),
    mira: [1.2 * Math.sin(t * 0.37), 0.4 * Math.sin(t * 0.29)],
    vaiven: [3 * Math.sin(t * 1.3), 2.6 * Math.sin(t * 1.1 + 1), 3.4 * Math.sin(t * 0.9 + 2), 2 * Math.sin(t * 1.5 + 3)],
  };
}

const copia = (b: Momento): Momento & { flores: Cuatro; abiertas: Cuatro; vaiven: Cuatro; mira: [number, number]; ruedas: [number, number] } => ({
  ...b,
  flores: [...b.flores] as Cuatro,
  abiertas: [...b.abiertas] as Cuatro,
  vaiven: [...b.vaiven] as Cuatro,
  mira: [...b.mira] as [number, number],
  ruedas: [...b.ruedas] as [number, number],
});

/**
 * Lo que pasa a los `u` segundos de empezar una acción sola, sobre la pose de base. `cual` elige: la flor que
 * mira primero (0 a 3), o el capullo que se abre (0 el de la flor 2, 1 el de la 4).
 */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number, cual = 0): Momento {
  const m = copia(b);
  switch (accion) {
    case 'mira': {
      // Mira una flor, se queda, y después otra.
      const [p, q] = [HACIA_FLOR[cual % 4]!, HACIA_FLOR[(cual + 2) % 4]!];
      const una = loma(u, 0.1, 0.5, 1.5, 1.8);
      const otra = loma(u, 1.6, 2, 2.8, DURA.mira);
      m.mira = [m.mira[0] + p[0] * una + q[0] * otra, m.mira[1] + p[1] * una + q[1] * otra];
      break;
    }
    case 'abre': {
      // Un capullo se abre despacio, lo mira, y a la noche se vuelve a cerrar.
      const n = cual % 2 ? 3 : 1;
      const k = loma(u, 0.2, 1.8, 3.2, DURA.abre);
      m.abiertas[n] = k;
      m.flores[n] = 0.12 * k;
      const ojo = loma(u, 0.4, 0.8, 3, 3.4);
      m.mira = [mezclar(m.mira[0], HACIA_FLOR[n]![0], ojo), mezclar(m.mira[1], HACIA_FLOR[n]![1], ojo)];
      break;
    }
    case 'rueda': {
      // Le pega el viento a la rueda floja: arranca, gira, y para de a poco, con un vaivén al final.
      // Dos vueltas justas, así queda la mancha roja donde estaba.
      const anda = 720 * rampa(u, 0.1, 2.6);
      m.ruedas = [m.ruedas[0], anda + 14 * Math.sin(u * 9) * loma(u, 2.4, 2.6, 3, DURA.rueda)];
      m.mira = [mezclar(m.mira[0], 3.4, loma(u, 0.3, 0.7, 2.4, 2.9)), m.mira[1]];
      break;
    }
    case 'petalo': {
      // Se le cae un pétalo a la flor naranja; la flor se sacude, y él lo sigue con los ojos hasta la tierra.
      m.petalo = Math.min(0.999, u / DURA.petalo);
      m.vaiven[0] += 6 * loma(u, 0, 0.1, 0.3, 0.6) * Math.sin(u * 20);
      const sigue = loma(u, 0.1, 0.4, 2.4, DURA.petalo);
      m.mira = [mezclar(m.mira[0], -3.2, sigue), mezclar(m.mira[1], -1.4 + 2.4 * rampa(u, 0.4, 2.2), sigue)];
      break;
    }
    case 'bicho': {
      // Un escarabajo cruza la cara del montículo, y los ojos lo siguen de punta a punta.
      const k = u / DURA.bicho;
      m.bicho = Math.min(0.999, Math.max(0.001, k));
      m.mira = [mezclar(m.mira[0], -3.4 + 6.8 * k, loma(u, 0.2, 0.6, 4, DURA.bicho)), mezclar(m.mira[1], 1.4, loma(u, 0.2, 0.6, 4, DURA.bicho))];
      break;
    }
    case 'duerme': {
      // Cierra los ojos un rato largo, y los vuelve a abrir.
      m.parpado = Math.max(m.parpado, loma(u, 0, 0.7, 3.9, DURA.duerme));
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que pasa a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copia(b);
  // La tierra tiembla y se parte; los terrones saltan cuando empuja la cabeza.
  m.tiembla = 2.4 * loma(u, 0, 0.1, T.sube[1] - 0.2, T.sube[1]) * Math.sin(u * 47);
  m.grieta = rampa(u, 0.15, 0.9) * (1 - rampa(u, 6, T.calma[1]));
  m.terrones = Math.max(0, Math.min(1, (u - T.sube[0]) / 1.2));
  if (u >= T.sube[0] + 1.2) m.terrones = 0;
  // Sube hasta la boca, y se hunde despacio.
  m.sube = rampa(u, T.sube[0], T.sube[1]) * (1 - rampa(u, T.hunde[0], T.hunde[1]));
  // La corona le salta a la cabeza; cuando se hunde, se le resbala y vuelve al pie de la cruz.
  m.corona = rampa(u, 1.1, 1.7) * (1 - rampa(u, 4.6, 5.6));
  // Ruge sin voz: la boca grande, la melena que se sacude, los ojos bien abiertos mirando arriba.
  const ruge = loma(u, T.ruge[0], T.ruge[0] + 0.25, T.ruge[1] - 0.25, T.ruge[1]);
  m.boca = ruge;
  m.melena = 4 * ruge * Math.sin(u * 18);
  m.parpado = Math.sin(Math.PI * Math.min(1, Math.max(0, (u - 6.8) / 0.3)));
  const arriba = loma(u, T.sube[0], T.sube[1], T.hunde[0], T.hunde[0] + 0.6);
  m.mira = [mezclar(m.mira[0], ASOMA.mira[0], arriba), mezclar(m.mira[1], ASOMA.mira[1], arriba)];
  // Las flores crecen de golpe y se abren todas; después se van achicando a lo de siempre.
  const crecen = rampa(u, 2, 2.5) * (1 - rampa(u, 5.4, 7.2));
  for (let i = 0; i < 4; i++) {
    m.flores[i] = crecen;
    m.abiertas[i] = mezclar(QUIETO.abiertas[i]!, 1, crecen);
    m.vaiven[i] += 5 * loma(u, 0.1, 0.3, 1.6, 2) * Math.sin(u * (13 + i * 3));
  }
  // El patín se le vuelve a soltar: sale rodando, para, y vuelve rodando a su lugar.
  const x = RUEDA_LEJOS * (rampa(u, T.rueda[0], T.rueda[0] + 1) - rampa(u, T.rueda[1] - 1.2, T.rueda[1]));
  m.patin = x;
  m.ruedas = [gira(x), gira(x) + 30 * loma(u, T.rueda[0] + 1, T.rueda[0] + 1.1, T.rueda[1] - 1.2, T.rueda[1] - 1) * Math.sin(u * 12)];
  // La cruz se tambalea, y se aquieta de a poco.
  m.cruz = 9 * Math.exp(-1.2 * Math.max(0, u - 1.8)) * Math.sin(Math.max(0, u - 1.8) * 7) * rampa(u, 1.6, 1.9) + 1.4 * Math.sin(u * 47) * loma(u, 0, 0.1, 0.8, 0.9);
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al rey con un azar que se puede fijar (el test lo fija). La isla usa `armarRey`. */
export function armarReyCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--rey')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { mira: 0, abre: 0, rueda: 0, petalo: 0, bicho: 0, duerme: 0, ruge: 0 };
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
  let asomado = false;
  let cual = 0;
  let pestanea = entre(PESTANEA);

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'ruge' ? ultima : a;
    desde = t;
    hechas[a]++;
    cual = Math.floor(azar() * 4);
  }

  function momento(t: number): Momento {
    const b = base(t);
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) b.parpado = Math.sin((ojo / PESTANEO) * Math.PI);
    const u = t - desde;
    if (accion === 'ruge') return momentoDelToque(b, u);
    if (accion) return momentoDeAccion(b, accion, u, cual);
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
      aplicar(asomado ? ASOMA : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - pestanea > PESTANEO) pestanea = t + entre(PESTANEA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocado: lo que esté pasando se corta, salvo que ya esté rugiendo. */
  const tocado = (t: number): void => {
    if (accion !== 'ruge') empezar('ruge', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      asomado = !asomado;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la cruz, y la página abre la ficha. */
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

export const armarRey: Armar = (marcos, esc) => armarReyCon(marcos, esc);
