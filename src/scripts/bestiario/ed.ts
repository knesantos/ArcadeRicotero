/**
 * Mister Ed y Huesito (`D-73`, vigesimoctava vuelta), en el número de la red rota, en el templo.
 *
 * Lo que hacen solos es no caerse, con ganas. Nada es un bucle: eligen qué hacen cada vez.
 *
 * - **Habla** Mister Ed: mueve la mandíbula como si dijera algo, con la cabeza de lado, y no sale nada. Huesito asiente.
 * - **El tambor rueda**: el caballo camina en el lugar arriba del lavarropas, que se le va para adelante y vuelve.
 * - **Se tambalea**: pierde el equilibrio para un lado, después para el otro, los brazos como molinos, Huesito
 *   agachado agarrándose la galera, la jaula balanceándose como loca; lo salva con un pisotón.
 * - **Canta el pajarito**: el caballo baja la cabeza a mirarlo, bizco, y Huesito inclina el cráneo para escucharlo.
 * - **Huesito salta**: se agacha, pega un salto corto con los brazos arriba y cae de nuevo en el lomo, con un aplauso de huesos.
 * - **Respiran y se agitan**: la ropa da vueltas en el tambor, el jabón larga burbujas, la cola se mece.
 *
 * Tocados, **saltan otra vez sin red**: el caballo se para de manos y relincha, el tambor se le va, la jaula se bambolea,
 * y Huesito da dos mortales en el aire para el lado de la red, que está rota: cae por el agujero, y no se lo ve. El
 * caballo mira para abajo. Silencio. Después sale por el agujero con los brazos arriba, y de un salto largo vuelve al lomo.
 * Dicen su verso. Con movimiento reducido no se mueve nada: tocarlos los pasa de equilibrio a saltando.
 *
 * Se llevan números (`rig-ed.ts`) y nada que dibuje.
 */

import { ED_ARMADO, QUIETO, RELINCHA, SALTA, VERSO, correrHasta, marcas, type Momento } from '../../lib/bestiario/rig-ed.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'mister-ed-y-huesito';

/** Lo que pueden hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { habla: 3.4, rueda: 4.6, tambalea: 4.2, canta: 3.6, salta: 3, salto: 7.4 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['habla', 'rueda', 'tambalea', 'canta', 'salta'] as const;

export const PAUSA = [1.4, 3.6] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.4;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { agacha: [0, 0.45], vuelo: [0.45, 1.5], cae: [1.5, 2.45], abajo: [2.45, 3.7], sale: [3.7, 4.6], ta: [4.6, 5.0], vuelve: [5.0, 6.1], fin: 7.4 } as const;
/** Cuántas vueltas en el aire da Huesito (de a 360 grados), y cuánto vuela de alto, en sus unidades. */
export const MORTALES = 2;
export const ALTURA = 92;
/** Cuánto se esconde abajo del piso: más que su altura. */
export const HONDO = 130;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const copia = (b: Momento): Momento => ({ ...b, pupila: [...b.pupila], canario: [...b.canario], h: [...b.h] }) as Momento;
/** El aliento: se llena despacio y se vacía más rápido (−1 a 1). */
export const aliento = (t: number, periodo: number): number => {
  const p = (((t % periodo) + periodo) % periodo) / periodo;
  return p < 0.62 ? -Math.cos((Math.PI * p) / 0.62) : Math.cos((Math.PI * (p - 0.62)) / 0.38);
};
const A = ED_ARMADO;
const RAD_A_GRADOS = 180 / Math.PI;

/** La pose de base de un instante: en equilibrio, que se mece un poco, el tambor que rueda al compás, la ropa que da vueltas. */
export function base(t: number): Momento {
  const tx = 3 * Math.sin(t * 0.7);
  const incl = 2.2 * Math.sin(t * 0.9) + 1.1 * Math.sin(t * 2.3 + 1);
  const parpadea = t % 4.3 < 0.14 ? 1 : 0;
  return {
    ...QUIETO,
    respira: aliento(t, 3.6),
    tx,
    rueda: (tx / A.tambor.radio) * RAD_A_GRADOS,
    ropa: 70 * Math.sin(t * 0.5) + 22 * Math.sin(t * 1.7),
    incl,
    patas: -0.6 * incl,
    cola: 6 * Math.sin(t * 1.3 + 1),
    crin: 3 * Math.sin(t * 1.6),
    brazoL: 4 * Math.sin(t * 1.1),
    brazoC: 8 * Math.sin(t * 1.2 + 1) - 0.8 * incl,
    jaula: 5 * Math.sin(t * 1.9) + 2.5 * Math.sin(t * 3.1),
    hbrazos: -2.4 * incl + 3 * Math.sin(t * 1.4),
    parpado: mezclar(0.3, 1, parpadea),
    mandibula: 0.08 + 0.03 * Math.sin(t * 0.8),
    burbuja: (t / 5) % 1,
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number): Momento {
  const m = copia(b);
  switch (accion) {
    case 'habla': {
      // Mueve la mandíbula como si dijera algo largo; la cabeza va de un lado al otro. Y de afuera, nada.
      const dentro = loma(u, 0.2, 0.5, DURA.habla - 0.7, DURA.habla - 0.3);
      m.mandibula = mezclar(b.mandibula, 0.18 + 0.55 * Math.abs(Math.sin(u * 8.6)) * (0.6 + 0.4 * Math.sin(u * 2.3)), dentro);
      m.cabeza = 5 * Math.sin(u * 3.7) * dentro - 3 * dentro;
      m.parpado = mezclar(b.parpado, 0.1, dentro);
      m.pupila = [1.2 * dentro, 0];
      // Huesito asiente con el cráneo, un poco después.
      m.hcraneo = 9 * Math.sin((u - 0.3) * 5.3) * dentro;
      break;
    }
    case 'rueda': {
      // El tambor se va para adelante y vuelve; el caballo camina en el lugar, y se inclina para donde acelera.
      const ida = loma(u, 0, 1.7, 2.3, DURA.rueda - 0.3);
      m.tx = b.tx + 26 * ida;
      m.rueda = (m.tx / A.tambor.radio) * RAD_A_GRADOS;
      const anda = loma(u, 0.1, 0.5, DURA.rueda - 0.8, DURA.rueda - 0.2);
      m.patas = b.patas + 11 * Math.sin(u * 8.6) * anda;
      m.incl = b.incl + 7 * (rampa(u, 0, 1) * (1 - rampa(u, 1.2, 2))) - 7 * (rampa(u, 2.3, 3.2) * (1 - rampa(u, 3.4, 4.2)));
      m.brazoC = b.brazoC + 14 * Math.sin(u * 8.6 + 1.5) * anda;
      m.brazoL = b.brazoL + 8 * Math.sin(u * 8.6) * anda;
      m.ropa = b.ropa + m.rueda * 2.2;
      m.hbrazos = b.hbrazos - 2 * (m.incl - b.incl);
      m.cola = b.cola + 10 * Math.sin(u * 4.3) * anda;
      break;
    }
    case 'tambalea': {
      // Pierde el equilibrio para adelante, para atrás, para adelante; los brazos como molinos; lo salva con un pisotón.
      const k = loma(u, 0, 0.4, 2.8, 3.2);
      const sube = Math.sin(u * 5.2) * k;
      m.incl = b.incl + 15 * sube;
      m.tx = b.tx + 9 * Math.sin(u * 5.2 + 0.8) * k;
      m.rueda = (m.tx / A.tambor.radio) * RAD_A_GRADOS;
      m.patas = b.patas - 0.8 * (m.incl - b.incl);
      m.brazoC = b.brazoC + 55 * Math.sin(u * 9.1) * k;
      m.brazoL = b.brazoL + 38 * Math.sin(u * 9.1 + 1.2) * k;
      m.jaula = b.jaula + 26 * Math.sin(u * 7.3) * k;
      m.canario = [3 * Math.abs(Math.sin(u * 11)) * k, 0];
      m.hbrazos = 30 * Math.sin(u * 8.1 + 0.6) * k;
      m.hagacha = 1 - 0.14 * k;
      m.hcraneo = -8 * k;
      m.parpado = 0;
      m.mandibula = mezclar(b.mandibula, 0.5, k);
      // El pisotón: salta un poco y se asienta.
      m.salto = 5 * loma(u, 2.9, 3.0, 3.1, 3.4);
      break;
    }
    case 'canta': {
      // El pajarito canta: el caballo baja la cabeza a mirarlo, bizco; Huesito inclina el cráneo.
      const k = loma(u, 0, 0.7, DURA.canta - 0.9, DURA.canta - 0.2);
      m.cabeza = b.cabeza + 9 * k;
      m.pupila = [2.2 * k, 2 * k];
      m.parpado = mezclar(b.parpado, 0.05, k);
      m.canario = [3.5 * Math.max(0, Math.sin(u * 7)) * k, k * Math.max(0, Math.sin(u * 14))];
      m.jaula = b.jaula + 6 * Math.sin(u * 4) * k;
      m.hcraneo = 14 * k * Math.sin(u * 1.3 + 1);
      m.brazoL = b.brazoL - 6 * k;
      break;
    }
    case 'salta': {
      // Huesito se agacha, pega un salto corto con los brazos arriba y cae otra vez en el lomo, con un aplauso de huesos.
      const agacha = loma(u, 0, 0.45, 0.5, 0.6);
      const vuela = loma(u, 0.5, 0.85, 1.05, 1.4);
      m.hagacha = 1 - 0.22 * agacha + 0.04 * vuela - 0.18 * loma(u, 1.4, 1.45, 1.5, 1.8);
      m.h = [0, -34 * vuela];
      m.hbrazos = mezclar(b.hbrazos, 24, vuela) + 16 * Math.sin(u * 22) * loma(u, 1.5, 1.6, 2, 2.4);
      m.sobre = 1;
      // El caballo, que lo siente, se mece para el otro lado.
      m.incl = b.incl - 3 * loma(u, 0.5, 0.85, 1.4, 1.9);
      m.hcraneo = -6 * vuela;
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que los tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m = copia(b);
  // El caballo se para de manos y relincha; el tambor se le va, y la jaula se bambolea.
  const rea = loma(u, 0.05, 0.5, T.cae[1] - 0.2, T.cae[1] + 0.7);
  m.incl = mezclar(b.incl, SALTA.incl, rea);
  m.patas = mezclar(b.patas, SALTA.patas, rea);
  m.tx = mezclar(b.tx, SALTA.tx, rea);
  m.rueda = mezclar(b.rueda, SALTA.rueda, rea);
  m.ropa = b.ropa + 110 * rea;
  m.salto = SALTA.salto * loma(u, 0.1, 0.5, 1.2, 1.8);
  m.cola = mezclar(b.cola, SALTA.cola, rea);
  m.crin = mezclar(b.crin, SALTA.crin, rea);
  m.brazoL = mezclar(b.brazoL, SALTA.brazoL, rea);
  m.brazoC = mezclar(b.brazoC, SALTA.brazoC, rea);
  m.jaula = b.jaula + (SALTA.jaula - b.jaula) * rea + 14 * Math.sin(u * 13) * loma(u, 0.4, 0.6, 1.6, 2.4);
  m.canario = [4 * Math.abs(Math.sin(u * 12)) * rea, rea];
  // Mira para abajo cuando se cae: el relincho se apaga, la cabeza baja, la boca queda en «o».
  const mira = loma(u, T.cae[1], T.cae[1] + 0.4, T.sale[0] - 0.1, T.sale[1]);
  m.cabeza = mezclar(mezclar(b.cabeza, SALTA.cabeza, rea), 14, mira);
  m.mandibula = mezclar(mezclar(b.mandibula, 1, loma(u, 0.2, 0.5, T.cae[1] - 0.5, T.cae[1] + 0.3)), 0.28, mira);
  m.parpado = mezclar(mezclar(b.parpado, SALTA.parpado, rea), 0.05, mira);
  m.pupila = [mezclar(SALTA.pupila[0] * rea, -2.6, mira), mezclar(SALTA.pupila[1] * rea, 3.6, mira)];
  // Huesito: se agacha, vuela dos mortales para el lado de la red, y cae de cabeza por el agujero.
  const [hx, hy] = A.hueco;
  const agacha = loma(u, T.agacha[0], T.agacha[1], T.agacha[1] + 0.02, T.agacha[1] + 0.1);
  m.hagacha = 1 - 0.2 * agacha;
  m.sobre = u < T.vuelo[0] ? 1 : 0;
  m.hbrazos = mezclar(b.hbrazos, SALTA.hbrazos, rampa(u, T.vuelo[0], T.vuelo[0] + 0.2)) * (u < T.sale[0] ? 1 : 1 - rampa(u, T.sale[0], T.sale[0] + 0.1)) + (u >= T.sale[0] ? 28 * rampa(u, T.sale[0] + 0.2, T.sale[1]) : 0);
  m.hcraneo = mezclar(0, SALTA.hcraneo, loma(u, T.vuelo[0], T.vuelo[0] + 0.3, T.cae[1] - 0.1, T.cae[1]));
  const apice = [A.hueco[0] + 18, A.lomo[1] - ALTURA];
  if (u < T.vuelo[0]) {
    m.h = [0, 0];
  } else if (u < T.cae[0]) {
    // Sube para el lado de la red y gira.
    const k = (u - T.vuelo[0]) / (T.cae[0] - T.vuelo[0]);
    const sube = Math.sin(Math.min(1, k) * Math.PI * 0.5);
    const p = correrHasta(m, [mezclar(A.lomo[0], apice[0]!, suave(k)), mezclar(A.lomo[1], apice[1]!, sube)]);
    m.h = [p[0], p[1]];
    m.hgiro = -360 * MORTALES * suave(k);
  } else if (u < T.abajo[0]) {
    // Baja de cabeza al agujero, cada vez más rápido.
    const k = (u - T.cae[0]) / (T.abajo[0] - T.cae[0]);
    const cae = k * k;
    const p = correrHasta(m, [mezclar(apice[0]!, hx, suave(k)), mezclar(apice[1]!, hy + 6, cae)]);
    m.h = [p[0], p[1]];
    m.hgiro = -360 * MORTALES - 180 * rampa(k, 0, 0.7);
  } else if (u < T.sale[0]) {
    // Abajo del piso, donde no se ve.
    const p = correrHasta(m, [hx, hy + HONDO]);
    m.h = [p[0], p[1]];
    m.hgiro = 0;
  } else if (u < T.vuelve[0]) {
    // Sube por el agujero con los brazos abiertos, hasta quedar parado en el borde de la red.
    const k = rampa(u, T.sale[0], T.sale[1]);
    const p = correrHasta(m, [hx, mezclar(hy + HONDO, 3, k)]);
    m.h = [p[0], p[1]];
    m.hgiro = 0;
  } else if (u < T.vuelve[1]) {
    // De un salto largo vuelve al lomo.
    const k = (u - T.vuelve[0]) / (T.vuelve[1] - T.vuelve[0]);
    const x = mezclar(hx, A.lomo[0], suave(k));
    const y = mezclar(3, A.lomo[1], suave(k)) - 70 * Math.sin(k * Math.PI);
    const p = correrHasta(m, [x, y]);
    m.h = [p[0], p[1]];
    m.hgiro = 0;
    m.hagacha = 1 - 0.1 * (1 - k);
    m.sobre = rampa(k, 0.7, 1);
  } else {
    m.h = [0, 0];
    m.sobre = 1;
    // Cae en el lomo: se aplasta y se endereza, y los brazos aplauden.
    m.hagacha = 1 - 0.2 * loma(u, T.vuelve[1], T.vuelve[1] + 0.05, T.vuelve[1] + 0.12, T.vuelve[1] + 0.5);
    m.hbrazos = 18 * loma(u, T.vuelve[1], T.vuelve[1] + 0.2, T.fin - 1.2, T.fin - 0.4) + 14 * Math.sin(u * 20) * loma(u, T.vuelve[1] + 0.2, T.vuelve[1] + 0.3, T.vuelve[1] + 0.9, T.vuelve[1] + 1.1);
  }
  // La red tiembla cuando cae, y se calma.
  m.red = loma(u, T.cae[1] - 0.05, T.cae[1] + 0.05, T.cae[1] + 0.5, T.abajo[1] + 0.4) * Math.abs(Math.cos(u * 18));
  m.hay = 1;
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al número con un azar que se puede fijar (el test lo fija). La isla usa `armarEd`. */
export function armarEdCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--ed')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { habla: 0, rueda: 0, tambalea: 0, canta: 0, salta: 0, salto: 0 };
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
  let saltando = false;

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'salto' ? ultima : a;
    desde = t;
    hechas[a]++;
  }

  function momento(t: number): Momento {
    const b = base(t);
    const u = t - desde;
    if (accion === 'salto') return momentoDelToque(b, u);
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
      aplicar(saltando ? SALTA : QUIETO);
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

  /** Tocados: lo que estén haciendo lo dejan, salvo que ya estén saltando. */
  const tocado = (t: number): void => {
    if (accion !== 'salto') empezar('salto', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      saltando = !saltando;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la cabeza del caballo, y la página abre la ficha. */
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

export const armarEd: Armar = (marcos, esc) => armarEdCon(marcos, esc);
