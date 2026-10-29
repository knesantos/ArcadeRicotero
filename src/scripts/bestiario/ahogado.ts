/**
 * El ahogado y su fiel fantasma (`D-73`, vigesimoquinta vuelta), en el agua de la izquierda del bajo.
 *
 * Lo que hacen solos es estar a punto de irse a pique, y nada es un bucle: eligen qué hacer cada vez.
 *
 * - El ahogado **manotea**, con la moneda en alto; **escupe** un chorrito del agua que tragó; y hace **glu
 *   glu**: se hunde hasta los ojos y le salen las burbujas por la boca, que suben y revientan.
 * - El fantasma **se infla** y se desinfla; **se da vuelta** y se le ve la etiqueta del lavadero; **se asoma**
 *   a mirarlo, inclinado; y baja y **lo sostiene** de la cabeza con las mangas, para que no se hunda.
 * - A veces **se miran** los dos, y pestañean a la vez.
 * - Y siempre: el ahogado sube y baja con el agua, el sombrero flota por su lado, la sábana flota en vaivén
 *   con el ruedo que flamea, y cada uno pestañea por su cuenta (el fantasma, achicando los agujeros).
 *
 * Tocados, **se van a pique** (*"me estoy por ahogar, me voy a pique, glu glu, bu buuu"*): el ahogado se hunde
 * del todo con un glu glu grande, la mano con la moneda última; el fantasma se infla enorme, hace BU para el
 * que mira y se zambulle detrás de él. Silencio, con burbujas. Y salen los dos de golpe: el ahogado con un
 * alga y un pescado en la cabeza, escupiendo, y el fantasma escurriendo la sábana. Dicen el verso. Con
 * movimiento reducido no se mueve nada: tocarlos los pasa de flotando al BU, y de vuelta.
 *
 * Se lleva números (`rig-ahogado.ts`) y nada que dibuje.
 */

import { BU, HONDO, QUIETO, VERSO, ZAMBULLE, marcas, type Momento } from '../../lib/bestiario/rig-ahogado.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-ahogado-y-su-fiel-fantasma';

/** Lo que pueden hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { manotea: 2.6, escupe: 2.2, glu: 3, infla: 2.8, vuelta: 2.6, asoma: 3, sostiene: 3.6, miran: 2.6, pique: 7.6 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['manotea', 'escupe', 'glu', 'infla', 'vuelta', 'asoma', 'sostiene', 'miran'] as const;
type Sola = (typeof SOLAS)[number];

export const PAUSA = [0.8, 2.2] as const;
export const PRIMERA = [0.5, 1.5] as const;
/** El verso cae con el BU: el ahogado ya se fue a pique (*glu glu*) y el fantasma se infla (*bu buuu*). */
export const DEMORA_FICHA = 1.5;
/** Cada cuánto pestañea el ahogado, y cada cuánto achica los agujeros el fantasma, en segundos. */
export const PESTANEA = [2.2, 4.8] as const;
export const ACHICA = [2.8, 5.6] as const;
const PESTANEO = 0.2;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { hunde: [0, 1.3], bu: [1.3, 2.7], zambulle: [2.7, 3.3], silencio: [3.3, 5], salen: [5, 5.6], chorrean: [5.6, 7.6] } as const;

/** Donde se pone el fantasma para sostenerlo de la cabeza, y cómo pone las mangas. */
export const SOSTIENE = { fantasma: [30, 68] as const, mangas: [-30, 30] as const };

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const entreT = (u: number, [a, b]: readonly [number, number]): number => Math.min(1, Math.max(0, (u - a) / (b - a)));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
/** Un racimo de burbujas que sube entre `a` y `b`: 0 antes y después (no se ve). */
const sube = (u: number, a: number, b: number): number => (u <= a || u >= b ? 0 : (u - a) / (b - a));

/** La pose de base de un instante: el agua lo sube y lo baja, el sombrero flota y la sábana se mece. */
export function base(t: number): Momento {
  const ola = Math.sin(t * 1.3);
  return {
    ...QUIETO,
    alto: 3 * ola + 1.2 * Math.sin(t * 2.9),
    ladea: 4 * Math.sin(t * 0.9),
    brazos: [6 * Math.sin(t * 1.7), 3 * Math.sin(t * 1.3 + 1)],
    mira: [1.2 * Math.sin(t * 0.7), -1.5 + 0.8 * Math.sin(t * 1.1)],
    sombrero: [5 * Math.sin(t * 0.31), -2.2 * Math.sin(t * 1.3 + 0.8), 7 * Math.sin(t * 0.9)],
    ondas: 0.4 + 0.2 * ola,
    fantasma: [6 * Math.sin(t * 0.8), 5 * Math.sin(t * 1.1)],
    inclina: 4 * Math.sin(t * 0.8 + 0.5),
    flamea: 0.7 * Math.sin(t * 2.2) + 0.3 * Math.sin(t * 5.1),
    mangas: [6 * Math.sin(t * 1.4), -6 * Math.sin(t * 1.4 + 0.7)],
  };
}

const copia = (b: Momento): Momento => ({ ...b, brazos: [...b.brazos], mira: [...b.mira], glu: [...b.glu], sombrero: [...b.sombrero], fantasma: [...b.fantasma], mangas: [...b.mangas] });

/** Lo que hacen a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: Sola, u: number): Momento {
  const m = copia(b);
  const D = DURA[accion];
  switch (accion) {
    case 'manotea': {
      // Manotea con la moneda en alto, se levanta un poco y abre la boca: el agua se revuelve.
      const k = loma(u, 0, 0.25, D - 0.4, D);
      m.brazos = [m.brazos[0] + k * (-18 + 24 * Math.sin(u * 14)), m.brazos[1] + k * 12 * Math.sin(u * 11)];
      m.alto += k * (4 + 3 * Math.sin(u * 9));
      m.boca = 0.6 * k * (0.5 + 0.5 * Math.sin(u * 10));
      m.mira = [m.mira[0], mezclar(m.mira[1], -3, k)];
      m.ondas = mezclar(m.ondas, 1, k);
      break;
    }
    case 'escupe': {
      // Traga agua (se hunde un poco), sale, y la escupe en un chorrito para el lado del sombrero.
      const traga = loma(u, 0, 0.3, 0.5, 0.75);
      m.alto -= 7 * traga;
      m.boca = Math.max(m.boca, loma(u, 0.7, 0.8, 1.3, 1.5));
      m.chorro = u > 0.75 && u < 1.9 ? entreT(u, [0.75, 1.6]) : 0;
      m.ladea += -8 * loma(u, 0.6, 0.8, 1.6, 2);
      break;
    }
    case 'glu': {
      // Se hunde hasta los ojos y le salen las burbujas por la boca: glu, y glu.
      const k = loma(u, 0, 0.4, D - 0.5, D);
      m.alto = mezclar(m.alto, -14, k);
      m.boca = k;
      m.glu = [sube(u, 0.4, 1.7), sube(u, 1.1, 2.6)];
      m.mira = [m.mira[0], mezclar(m.mira[1], -3.4, k)];
      m.brazos = [m.brazos[0] - 14 * k * Math.sin(u * 8), m.brazos[1]];
      m.ondas = mezclar(m.ondas, 1, k);
      break;
    }
    case 'infla': {
      // Se infla, dos veces, como quien junta aire para el bu, y se desinfla.
      const k = Math.sin(Math.PI * entreT(u, [0, D]));
      m.infla = 0.24 * k * (0.7 + 0.3 * Math.sin(u * 5));
      m.mangas = [m.mangas[0] - 18 * k, m.mangas[1] + 18 * k];
      m.flamea *= 1 - 0.6 * k;
      break;
    }
    case 'vuelta': {
      // Se da vuelta en el aire, y se le ve la espalda con la etiqueta; después vuelve.
      m.vuelta = rampa(u, 0.2, 0.9) * (1 - rampa(u, 1.7, 2.4));
      m.fantasma = [m.fantasma[0], m.fantasma[1] - 6 * loma(u, 0.1, 0.4, 2.1, 2.5)];
      break;
    }
    case 'asoma': {
      // Se inclina a mirarlo, baja un poco, y el ahogado lo mira para arriba.
      const k = loma(u, 0, 0.5, D - 0.6, D);
      m.inclina += 22 * k;
      m.fantasma = [m.fantasma[0] + 14 * k, m.fantasma[1] + 18 * k];
      m.mira = [mezclar(m.mira[0], -3, k), mezclar(m.mira[1], -3, k)];
      m.agujeros = Math.max(m.agujeros, Math.sin(Math.PI * entreT(u, [1.3, 1.5])));
      break;
    }
    case 'sostiene': {
      // Baja detrás de él y lo agarra de la cabeza con las mangas: el ahogado sube un poco, aliviado.
      const k = loma(u, 0, 0.7, D - 0.8, D);
      m.fantasma = [mezclar(m.fantasma[0], SOSTIENE.fantasma[0], k), mezclar(m.fantasma[1], SOSTIENE.fantasma[1], k)];
      m.mangas = [mezclar(m.mangas[0], SOSTIENE.mangas[0], k), mezclar(m.mangas[1], SOSTIENE.mangas[1], k)];
      m.inclina *= 1 - k;
      m.alto += 6 * k;
      m.ladea *= 1 - k;
      m.mira = [m.mira[0], mezclar(m.mira[1], -3, k)];
      break;
    }
    case 'miran': {
      // Se miran: el fantasma se inclina, el ahogado ladea la cabeza para arriba, y pestañean a la vez.
      const k = loma(u, 0, 0.4, D - 0.4, D);
      m.inclina += 12 * k;
      m.fantasma = [m.fantasma[0] + 8 * k, m.fantasma[1] + 10 * k];
      m.mira = [mezclar(m.mira[0], -3.5, k), mezclar(m.mira[1], -3, k)];
      m.ladea = mezclar(m.ladea, -8, k);
      const a = Math.sin(Math.PI * entreT(u, [1.2, 1.4]));
      m.parpado = Math.max(m.parpado, a);
      m.agujeros = Math.max(m.agujeros, a);
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hacen a los `u` segundos de que los tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copia(b);
  // El ahogado manotea y se va a pique: la mano con la moneda es lo último que se ve.
  const baja = rampa(u, 0.2, T.hunde[1]);
  const sale = rampa(u, T.salen[0], T.salen[0] + 0.35);
  const rebote = Math.sin(Math.PI * entreT(u, [T.salen[0], T.salen[1] + 0.2]));
  m.alto = mezclar(b.alto, -HONDO, baja * (1 - sale)) + 14 * rebote * sale;
  m.brazos = [m.brazos[0] + 26 * Math.sin(u * 16) * loma(u, 0, 0.1, 0.8, 1.1), m.brazos[1] + 14 * Math.sin(u * 12) * loma(u, 0, 0.1, 0.8, 1.1)];
  m.boca = Math.max(loma(u, 0, 0.2, 1, 1.3), 0.6 * loma(u, T.salen[0], T.salen[0] + 0.1, T.salen[1], T.salen[1] + 0.3));
  m.mira = [m.mira[0], mezclar(m.mira[1], -3.6, loma(u, 0, 0.2, 1, 1.2))];
  // El glu glu grande donde se hundió, y los racimos que siguen subiendo en el silencio.
  m.burbujon = loma(u, 0.6, 1, T.silencio[1] - 0.4, T.silencio[1]);
  m.glu = [sube((u - 0.8) % 1.1 + 0.8, 0.8, 1.9) * (u > 0.8 && u < T.silencio[1] ? 1 : 0), sube((u - 1.35) % 1.1 + 1.35, 1.35, 2.45) * (u > 1.35 && u < T.silencio[1] ? 1 : 0)];
  m.ondas = Math.max(m.ondas, loma(u, 0.2, 0.6, 1.4, 2.2), loma(u, T.zambulle[0], T.zambulle[1], T.zambulle[1] + 0.3, T.silencio[0] + 0.6), loma(u, T.salen[0], T.salen[0] + 0.2, 6, 6.8));
  // El fantasma se infla enorme y hace BU, acercándose al que mira, con las mangas arriba.
  const infla = rampa(u, T.bu[0], T.bu[0] + 0.5);
  const bu = loma(u, T.bu[0] + 0.1, T.bu[0] + 0.4, T.bu[1] - 0.2, T.bu[1] + 0.1);
  m.infla = infla * (1 - 0.6 * rampa(u, T.zambulle[0] + 0.2, T.zambulle[1])) * (1 - rampa(u, T.salen[0], T.salen[1]));
  m.bu = bu;
  m.flamea = mezclar(m.flamea, Math.sin(u * 9), infla * (1 - sale));
  const arriba = infla * (1 - rampa(u, T.silencio[0], T.silencio[0] + 0.3));
  m.mangas = [mezclar(m.mangas[0], BU.mangas[0], arriba), mezclar(m.mangas[1], BU.mangas[1], arriba)];
  m.inclina = mezclar(m.inclina, BU.inclina, infla * (1 - sale));
  // Y se zambulle detrás de él; salen los dos de golpe.
  const zambulle = rampa(u, T.zambulle[0], T.zambulle[1]);
  const vuelve = rampa(u, T.salen[0] + 0.05, T.salen[0] + 0.4);
  const salto = Math.sin(Math.PI * entreT(u, [T.salen[0] + 0.05, T.salen[1] + 0.3]));
  const [bx, by] = [mezclar(b.fantasma[0], BU.fantasma[0], infla), mezclar(b.fantasma[1], BU.fantasma[1], infla)];
  m.fantasma = [bx, mezclar(by, ZAMBULLE, zambulle * (1 - vuelve)) - 20 * salto * vuelve];
  // Ya afuera: el ahogado con el alga y el pescado, que coletea; escupe el agua que tragó.
  m.alga = rampa(u, T.salen[0], T.salen[0] + 0.1) * (1 - rampa(u, 7.2, DURA.pique));
  m.pescado = 26 * Math.sin(u * 18) * loma(u, 5.4, 5.5, 6.8, 7);
  m.chorro = u > 5.8 && u < 6.9 ? entreT(u, [5.8, 6.6]) : 0;
  m.mira = [mezclar(m.mira[0], 2.4 * Math.sin(u * 6), loma(u, T.salen[0], T.salen[0] + 0.2, 6.6, 7)), m.mira[1]];
  // Y el fantasma escurre la sábana: se retuerce, cruza las mangas y chorrea.
  const escurre = loma(u, T.chorrean[0] + 0.1, T.chorrean[0] + 0.4, 7, 7.4);
  m.escurre = escurre;
  m.mangas = [mezclar(m.mangas[0], -40, escurre), mezclar(m.mangas[1], 40, escurre)];
  m.inclina += 6 * Math.sin(u * 20) * escurre;
  m.gotas = u > 5.4 && u < 7.4 ? ((u - 5.4) % 0.7) / 0.7 : 0;
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a los dos con un azar que se puede fijar (el test lo fija). La isla usa `armarAhogado`. */
export function armarAhogadoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--ahogado')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { manotea: 0, escupe: 0, glu: 0, infla: 0, vuelta: 0, asoma: 0, sostiene: 0, miran: 0, pique: 0 };
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
  let buQuieto = false;
  let pestanea = entre(PESTANEA);
  let achica = entre(ACHICA);

  function elegir(): Sola {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'pique' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const b = base(t);
    // Cada uno pestañea por su cuenta: el ahogado con los párpados, el fantasma achicando los agujeros.
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) b.parpado = Math.sin((ojo / PESTANEO) * Math.PI);
    const hueco = t - achica;
    if (hueco > 0 && hueco < PESTANEO * 1.4) b.agujeros = Math.sin((hueco / (PESTANEO * 1.4)) * Math.PI);
    const u = t - desde;
    if (accion === 'pique') return momentoDelToque(b, u);
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
      aplicar(buQuieto ? BU : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - pestanea > PESTANEO) pestanea = t + entre(PESTANEA);
    if (t - achica > PESTANEO * 1.4) achica = t + entre(ACHICA);
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocados: lo que estén haciendo lo dejan, salvo que ya se estén yendo a pique. */
  const tocado = (t: number): void => {
    if (accion !== 'pique') empezar('pique', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      buQuieto = !buQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dicen su verso arriba de la sábana, y la página abre la ficha. */
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

export const armarAhogado: Armar = (marcos, esc) => armarAhogadoCon(marcos, esc);
