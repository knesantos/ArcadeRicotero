/**
 * La tipa rapaz (`D-73`, vigesimocuarta vuelta), parada detrás de la mesa servida.
 *
 * Lo que hace sola es estar en la fiesta, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Gira la copa**: la hace dar vueltas despacio y mira cómo se le ladea el cóctel.
 * - **Ojea los platos ajenos**: primero el del verdugo, después el de las mantis, ladeándose para ver mejor.
 * - **Se ríe de costado**: la cabeza para atrás, la boca abierta, los hombros que se sacuden, el aro que se
 *   hamaca y alguna pluma que se le cae a la estola. La garra al pecho.
 * - **Se acomoda la estola**: la agarra de la punta, la levanta, la deja caer, y vuela una pluma.
 * - **Tamborilea** las uñas en el mantel, aburrida.
 * - **Se mira las uñas**: levanta la garra a la altura de la cara y las admira.
 * - **Respira**, pestañea despacio, con los párpados pesados, y el aro se le mueve apenas.
 *
 * Tocada, el **zarpazo** (*"una tipa rapaz / como te gusta a vos"*): le echa el ojo a la billetera que alguien
 * se olvidó en el mantel, se agacha y la agarra de un zarpazo, la trae al pecho mirándote como si nada, la abre,
 * se lleva el billete al escote, devuelve la billetera vacía a la mesa, brinda con la copa en alto, choca dos
 * veces el aire y se ríe de costado. Dice su verso cuando la agarra. Con movimiento reducido no se mueve nada:
 * tocarla la pasa de la pose quieta al brindis con la billetera apretada en la garra.
 *
 * Se lleva números (`rig-rapaz.ts`) y nada que dibuje.
 */

import { BRINDA, QUIETO, VERSO, marcas, type Mano, type Momento } from '../../lib/bestiario/rig-rapaz.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'la-tipa-rapaz';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { gira: 3, ojea: 3.4, rie: 2.6, estola: 2.8, tamborilea: 2.4, unas: 3, zarpa: 7.6 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.2, 3.4] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.2;
/** Cada cuánto pestañea, en segundos. */
export const PESTANEA = [2.6, 6] as const;
const PESTANEO = 0.3;

/** Los tiempos del zarpazo: para el test y para la conducta. */
export const TOQUE_T = { ojea: [0, 0.7], zarpa: [0.7, 1.05], trae: [1.05, 1.8], abre: [1.8, 2.6], billete: [2.6, 3.3], devuelve: [3.3, 4.3], brinda: [3.9, 6], rie: [6, 7.2] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const entreT = (u: number, [a, b]: readonly [number, number]): number => Math.min(1, Math.max(0, (u - a) / (b - a)));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const mezclarMano = (a: Mano, b: Mano, k: number): Mano => ({ muneca: [mezclar(a.muneca[0], b.muneca[0], k), mezclar(a.muneca[1], b.muneca[1], k)], giro: mezclar(a.giro, b.giro, k) });

/** Una sucesión de llaves `[segundo, valor]`, pasada de una a otra con suavidad. */
function llaves<T>(u: number, ks: ReadonlyArray<readonly [number, T]>, mezcla: (a: T, b: T, k: number) => T): T {
  if (u <= ks[0]![0]) return ks[0]![1];
  for (let i = 1; i < ks.length; i++) {
    const [t1, v1] = ks[i]!;
    const [t0, v0] = ks[i - 1]!;
    if (u <= t1) return mezcla(v0, v1, suave((u - t0) / (t1 - t0)));
  }
  return ks[ks.length - 1]![1];
}
const mano = (x: number, y: number, giro: number): Mano => ({ muneca: [x, y], giro });
const par = (x: number, y: number): readonly [number, number] => [x, y];
const mezclarPar = (a: readonly [number, number], b: readonly [number, number], k: number): readonly [number, number] => [mezclar(a[0], b[0], k), mezclar(a[1], b[1], k)];
const mezclarNum = (a: number, b: number, k: number): number => mezclar(a, b, k);

const [COPA, GARRA] = QUIETO.manos;
const G = GARRA.giro;

/** La garra en el zarpazo: se levanta, se tira sobre la billetera, la trae, la abre, va al escote, la devuelve y vuelve al mantel. */
const GARRA_ZARPA: ReadonlyArray<readonly [number, Mano]> = [
  [0, GARRA], [0.55, mano(34, -16, G + 4)], [0.7, mano(35, -18, G + 6)], [0.95, mano(22, -2, G + 12)], [1.05, mano(21, -1, G + 10)], [1.15, mano(21, -2, G + 10)],
  [1.7, mano(14, -46, 348)], [2.6, mano(12, -48, 348)], [3.0, mano(4, -74, 352)], [3.3, mano(6, -72, 352)], [3.75, mano(22, -14, G + 368)],
  [3.9, mano(22, -12, G + 368)], [4.3, mano(GARRA.muneca[0], GARRA.muneca[1], G + 360)],
];
/** La copa en el brindis: sube, choca dos veces el aire, se queda arriba y baja mientras se ríe. */
const COPA_BRINDA: ReadonlyArray<readonly [number, Mano]> = [
  [3.9, COPA], [4.4, BRINDA.manos[0]], [4.7, mano(-70, -116, 2)], [4.85, BRINDA.manos[0]], [5.0, mano(-70, -116, 2)], [5.15, BRINDA.manos[0]],
  [6.0, BRINDA.manos[0]], [6.8, COPA],
];
/** Adónde mira en el zarpazo: la billetera, a vos como si nada, adentro de la billetera, a la mesa, a vos, y para arriba riéndose. */
const MIRA_ZARPA: ReadonlyArray<readonly [number, readonly [number, number]]> = [
  [0, QUIETO.mira], [0.4, par(0.9, 1)], [1.15, par(0.9, 1)], [1.45, par(-1, 0.2)], [1.9, par(-1, 0.2)], [2.1, par(0.3, 1)], [3.0, par(0.3, 1)],
  [3.3, par(0.7, 0.9)], [3.9, par(0.6, 0.8)], [4.2, par(-0.9, 0.1)], [6.0, par(-0.9, 0.1)], [6.3, par(-0.4, -0.4)], [7.2, par(-0.4, -0.4)], [7.6, QUIETO.mira],
];
/** Los párpados: entornados para echar el ojo, de par en par cuando abre la billetera, pesados al brindar, apretados al reírse. */
const PARPADOS_ZARPA: ReadonlyArray<readonly [number, number]> = [
  [0, QUIETO.parpados[0]], [0.4, 0.58], [0.9, 0.3], [1.4, 0.42], [2.0, 0.08], [2.9, 0.08], [3.3, 0.4], [4.3, 0.5], [6.0, 0.5], [6.3, 0.82], [7.0, 0.82], [7.6, QUIETO.parpados[0]],
];

/**
 * El zarpazo, sobre la pose de base de ese cuadro (quieta, con la respiración y el pestañeo): lo que hace a
 * los `u` segundos de que la tocaron.
 */
export function momentoDelToque(base: Momento, u: number): Momento {
  const m: Momento = { ...base };
  m.manos = [llaves(u, COPA_BRINDA, mezclarMano), llaves(u, GARRA_ZARPA, mezclarMano)];
  if (u < COPA_BRINDA[0]![0]) m.manos = [base.manos[0], m.manos[1]];
  const p = llaves(u, PARPADOS_ZARPA, mezclarNum);
  m.parpados = [Math.max(base.parpados[0] - QUIETO.parpados[0] + p, 0), Math.max(base.parpados[1] - QUIETO.parpados[1] + p + 0.04, 0)];
  m.mira = llaves(u, MIRA_ZARPA, mezclarPar);
  m.garra = rampa(u, 0.95, 1.05) * (1 - rampa(u, 3.78, 3.88));
  m.billetera = u >= 1.02 && u < 3.82 ? 'mano' : 'mesa';
  const cae = entreT(u, [3.82, 4.08]);
  m.cae = u >= 3.82 ? (cae < 1 ? 16 * (1 - cae * cae) : 3 * Math.sin(Math.PI * entreT(u, [4.08, 4.3]))) : 0;
  m.abierta = loma(u, 1.8, 2.0, 2.9, 3.1);
  m.billete = loma(u, 2.55, 2.7, 2.95, 3.25);
  m.agacha = loma(u, 0.68, 0.85, 1.1, 1.5);
  m.inclina = 4 * loma(u, 0.6, 0.8, 1.1, 1.5) - 3 * loma(u, 3.9, 4.4, 5.8, 6.2) + 3 * loma(u, 6.1, 6.4, 6.9, 7.4);
  const sacudon = loma(u, 6.1, 6.3, 6.9, 7.2);
  m.sacude = base.sacude + 1.6 * sacudon * Math.abs(Math.sin(u * 26));
  m.cabeza = 8 * loma(u, 0.1, 0.5, 1.1, 1.6) + 10 * loma(u, 1.9, 2.2, 2.8, 3.1) - 7 * loma(u, 3.9, 4.4, 5.8, 6.3) - 12 * loma(u, 6.0, 6.3, 6.9, 7.5) + 2 * sacudon * Math.sin(u * 26);
  m.ceja = Math.max(loma(u, 0.1, 0.4, 1.0, 1.4), loma(u, 1.9, 2.1, 2.8, 3.1), loma(u, 3.9, 4.3, 5.8, 6.2));
  m.risa = Math.max(0.3 * loma(u, 3.9, 4.3, 5.9, 6.1), loma(u, 6.0, 6.15, 7.0, 7.3));
  m.aro = base.aro + 12 * Math.sin(u * 7) * (loma(u, 0.7, 0.9, 1.3, 1.9) + loma(u, 6.0, 6.2, 7.0, 7.5));
  m.plumas = loma(u, 6.2, 6.4, 7.2, 7.6);
  m.caen = entreT(u, [6.2, 7.6]);
  m.vino = -10 * loma(u, 3.9, 4.4, 6.0, 6.8) + 8 * Math.sin(u * 9) * (loma(u, 4.4, 4.6, 5.2, 5.6) + loma(u, 0.7, 0.8, 1.1, 1.5));
  return m;
}

/** Lo que hace en cada cosa que elige sola, a los `u` segundos de empezarla, para un lado (−1 o 1). */
export function momentoDeAccion(base: Momento, a: Exclude<Accion, 'zarpa'>, u: number, lado: number): Momento {
  const m: Momento = { ...base };
  switch (a) {
    case 'gira': {
      // Hace girar la copa y mira el cóctel ladearse: el remolino va atrás de la mano.
      const k = loma(u, 0, 0.4, 2.5, DURA.gira);
      const w = u * Math.PI * 2 * 1.1;
      m.manos = [mano(COPA.muneca[0] + 3 * Math.cos(w) * k, COPA.muneca[1] + 2 * Math.sin(w) * k, COPA.giro + 8 * Math.sin(w) * k), m.manos[1]];
      m.vino = -14 * Math.sin(w - 0.7) * k;
      m.mira = [mezclar(m.mira[0], -0.9, k), mezclar(m.mira[1], 0.8, k)];
      m.cabeza -= 4 * k;
      break;
    }
    case 'ojea': {
      // El plato del verdugo, primero; después el de las mantis. Se ladea para ver mejor, y la ceja sube.
      const k = loma(u, 0, 0.4, 3, DURA.ojea);
      const va = suave(entreT(u, [1.4, 1.9]));
      const s = mezclar(lado, -lado, va);
      m.mira = [s * k + m.mira[0] * (1 - k), mezclar(m.mira[1], 0.6, k)];
      m.cabeza += 6 * s * k;
      m.inclina += 3 * s * k;
      m.ceja = 0.7 * k;
      m.parpados = [mezclar(m.parpados[0], 0.52, k), mezclar(m.parpados[1], 0.56, k)];
      break;
    }
    case 'rie': {
      // Se ríe de costado: la cabeza para atrás, los hombros se sacuden y la garra va al pecho.
      const k = loma(u, 0.15, 0.4, 1.9, 2.4);
      const sacudon = loma(u, 0.3, 0.45, 1.7, 2);
      m.risa = k;
      m.cabeza -= 11 * k + 2 * sacudon * Math.sin(u * 28);
      m.sacude += 1.6 * sacudon * Math.abs(Math.sin(u * 28));
      m.aro += 14 * Math.sin(u * 9) * k;
      m.parpados = [mezclar(m.parpados[0], 0.8, k), mezclar(m.parpados[1], 0.82, k)];
      m.mira = [mezclar(m.mira[0], -0.4, k), mezclar(m.mira[1], -0.4, k)];
      m.manos = [m.manos[0], mezclarMano(GARRA, mano(12, -40, 348 - 360), loma(u, 0, 0.5, 1.9, DURA.rie))];
      m.garra = 0.5 * loma(u, 0, 0.5, 1.9, DURA.rie);
      m.plumas = loma(u, 0.5, 0.7, 2.2, 2.6);
      m.caen = entreT(u, [0.5, 2.6]);
      break;
    }
    case 'estola': {
      // La agarra de la punta, la levanta, la deja caer, y vuela una pluma.
      const k = loma(u, 0, 0.6, 2.2, DURA.estola);
      const sube = loma(u, 0.7, 1.1, 1.7, 2.1);
      m.estola = sube;
      m.manos = [m.manos[0], mezclarMano(GARRA, mano(16, -64 - 10 * sube, -12), k)];
      m.garra = 0.8 * loma(u, 0.5, 0.7, 2.0, 2.2);
      m.cabeza += 5 * k;
      m.mira = [mezclar(m.mira[0], 0.6, k), mezclar(m.mira[1], 0.9, k)];
      m.aro += 6 * Math.sin(u * 8) * sube;
      m.plumas = loma(u, 1.6, 1.8, 2.4, DURA.estola);
      m.caen = entreT(u, [1.6, DURA.estola]);
      break;
    }
    case 'tamborilea': {
      // Las uñas en el mantel, una atrás de la otra: aburrida.
      const k = loma(u, 0, 0.25, 2.1, DURA.tamborilea);
      const tic = Math.sin(u * 28);
      m.manos = [m.manos[0], mano(GARRA.muneca[0], GARRA.muneca[1] - 1.6 * Math.abs(tic) * k, G + 7 * tic * k)];
      m.parpados = [mezclar(m.parpados[0], 0.6, k), mezclar(m.parpados[1], 0.62, k)];
      m.mira = [mezclar(m.mira[0], -0.2, k), mezclar(m.mira[1], 0.4, k)];
      m.cabeza -= 3 * k;
      break;
    }
    case 'unas': {
      // Levanta la garra a la altura de la cara y se mira las uñas, de cerca, con la boca en una o.
      const k = loma(u, 0, 0.6, 2.4, DURA.unas);
      const gira = Math.sin(u * 2.4) * k;
      m.manos = [m.manos[0], mezclarMano(GARRA, mano(58, -116, -26 + 16 * gira), k)];
      m.mira = [mezclar(m.mira[0], 1, k), mezclar(m.mira[1], -0.3, k)];
      m.cabeza += 5 * k;
      m.ceja = 0.5 * k;
      m.risa = 0.18 * loma(u, 1.4, 1.6, 2.0, 2.3);
      break;
    }
  }
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma a la tipa con un azar que se puede fijar (el test lo fija). La isla usa `armarRapaz`. */
export function armarRapazCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--rapaz')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { gira: 0, ojea: 0, rie: 0, estola: 0, tamborilea: 0, unas: 0, zarpa: 0 };
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
  let brindaQuieta = false;
  let lado = 1;
  let pestanea = entre(PESTANEA);

  function elegir(): Exclude<Accion, 'zarpa'> {
    const opciones = (['gira', 'ojea', 'rie', 'estola', 'tamborilea', 'unas'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'zarpa' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const m: Momento = { ...QUIETO };
    // Quieta: respira, el aro se le mueve apenas y el cóctel tiembla en la copa.
    m.respira = Math.sin(t * 1.3);
    m.aro = 2 * Math.sin(t * 0.9);
    m.vino = 1.5 * Math.sin(t * 1.7);
    m.cabeza = 1.2 * Math.sin(t * 0.31);
    // El pestañeo: despacio, que los párpados pesan.
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) {
      const k = Math.sin((ojo / PESTANEO) * Math.PI);
      m.parpados = [mezclar(m.parpados[0], 1, k), mezclar(m.parpados[1], 1, k)];
    }
    if (!accion) return m;
    const u = t - desde;
    return accion === 'zarpa' ? momentoDelToque(m, u) : momentoDeAccion(m, accion, u, lado);
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
      aplicar(brindaQuieta ? BRINDA : QUIETO);
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

  /** Tocada: lo que esté haciendo lo deja, salvo que ya esté en el zarpazo. */
  const tocado = (t: number): void => {
    if (accion !== 'zarpa') empezar('zarpa', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      brindaQuieta = !brindaQuieta;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba del peinado, y la página abre la ficha. */
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

export const armarRapaz: Armar = (marcos, esc) => armarRapazCon(marcos, esc);
