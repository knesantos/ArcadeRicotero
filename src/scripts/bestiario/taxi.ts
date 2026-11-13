/**
 * El taxi paranormal (`D-73`, vigesimoséptima vuelta), volcado en la banquina, con las ruedas para arriba.
 *
 * No es del tránsito: está quieto, y lo que hace solo son las cosas que le quedaron prendidas. Nada es un bucle:
 * elige cuál se le escapa cada vez.
 *
 * - **Gira una rueda**: alguna de las dos arranca sola, y después se va frenando de a poco, por su peso.
 * - **Parpadea a lo gurú-vudú**: el faro, que es un ojo, baja el párpado tres veces, lento, y el haz se corta.
 * - **Larga pompas** de jabón por el escape, que suben y se pierden.
 * - **Se le escapa la cola**: la del diablo, que ya asoma los cuernos y los ojos, cabeza abajo, por el baúl mal
 *   cerrado. Colea en el pasto, se asoma un poco más, y se vuelve a meter.
 * - **Tamborilea** el chofer, con los dedos de hueso, en el pasto.
 * - **Se va de foco**: el doble se le despega un rato, como una foto movida, y vuelve.
 * - **Titila la bandera** del reloj: libre, ocupado, libre.
 * - El haz tiembla, el foco nunca está del todo, y la cola no se queda quieta.
 *
 * Tocado, **hace lo paranormal**: tiembla, abre el faro de par en par y levita a un palmo de la banquina, inclinado,
 * con las dos ruedas girando y fuera de foco del todo. Arriba se le abre el baúl y se le escapa el diablo, que se
 * asoma; el chofer levanta el brazo y saluda (*"así también te ves bien"*). El diablo se vuelve a meter, y el taxi
 * cae de golpe y se aplasta contra el pasto; el brazo, que cuelga, sigue hamacándose un rato. Parpadea tres veces
 * y queda como estaba, con las ruedas frenándose solas. Dice su verso. Con movimiento reducido no se mueve nada:
 * tocarlo lo pasa de volcado a levitando.
 *
 * Se lleva números (`rig-taxi.ts`) y nada que dibuje.
 */

import { LEVITA, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-taxi.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-taxi-paranormal';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { rueda: 3, parpadea: 3.6, pompas: 2.6, cola: 3.4, dedos: 2.2, foco: 3, libre: 2, levita: 8.6 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['rueda', 'parpadea', 'pompas', 'cola', 'dedos', 'foco', 'libre'] as const;

export const PAUSA = [1, 3] as const;
export const PRIMERA = [0.6, 1.8] as const;
export const DEMORA_FICHA = 1.4;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { tiembla: [0, 0.8], sube: [0.6, 1.8], baul: [2, 4.9], diablo: [2.3, 4.7], saluda: [2.6, 4.8], cae: [4.9, 5.2], golpe: [5.2, 5.7], parpadea: [5.8, 7.6] } as const;
/** Cuántas veces parpadea, solo y después de caer. */
export const PARPADEOS = 3;
/** A cuánto giran las ruedas, en grados por segundo: empujadas por nada, y levitando. */
export const GIRA = { sola: 260, levita: 760 } as const;
/** Cuánto tardan en tomar velocidad y cuánto en frenarse solas: lo que pesa una rueda. Por segundo. */
export const RUEDA = { toma: 5, frena: 0.55 } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
/** Un parpadeo lento, `n` veces en el tramo: 0 abierto, 1 cerrado. */
const parpadeo = (u: number, a: number, b: number, n: number): number => (u <= a || u >= b ? 0 : Math.abs(Math.sin(((u - a) / (b - a)) * Math.PI * n)) ** 0.6);

/** La pose de base de un instante: volcado, con lo que le quedó prendido temblando apenas. */
export function base(t: number): Momento {
  return {
    ...QUIETO,
    haz: QUIETO.haz + 0.07 * Math.sin(t * 7.3) * Math.sin(t * 1.1),
    foco: QUIETO.foco + 0.06 * Math.sin(t * 0.7),
    colea: 6 * Math.sin(t * 1.4),
    libre: QUIETO.libre + 0.2 * Math.sin(t * 0.9),
    baul: QUIETO.baul + 0.04 * Math.sin(t * 1.4 - 0.6),
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number): Momento {
  const m: Momento = { ...b, ruedas: [...b.ruedas] };
  switch (accion) {
    case 'rueda':
      // La vuelta la lleva la isla, que es la que sabe cuánto pesa la rueda (`empuje`).
      break;
    case 'parpadea': {
      const p = parpadeo(u, 0.3, 3.3, PARPADEOS);
      m.parpado = mezclar(m.parpado, 1, p);
      break;
    }
    case 'pompas':
      m.pompas = Math.min(1, u / 2.4);
      break;
    case 'cola': {
      const k = loma(u, 0, 0.7, 2.6, DURA.cola);
      m.cola = mezclar(m.cola, 1, k);
      m.colea += 22 * k * Math.sin(u * 7);
      m.baul = mezclar(m.baul, 0.4, k);
      m.diablo = mezclar(m.diablo, 0.8, k);
      break;
    }
    case 'dedos': {
      const k = loma(u, 0, 0.3, 1.7, DURA.dedos);
      m.brazo = -7 * k * Math.abs(Math.sin(u * 13));
      break;
    }
    case 'foco': {
      const k = loma(u, 0, 1.2, 1.8, DURA.foco);
      m.foco = mezclar(m.foco, 0.85, k);
      m.tiembla = 0.8 * k * Math.sin(u * 40);
      break;
    }
    case 'libre':
      m.libre = Math.sin(u * 19) > 0 ? 1 : 0.1;
      break;
  }
  return m;
}

/** A cuánto quiere girar cada rueda a los `u` segundos de una acción: la isla llega de a poco y frena sola. */
export function empuje(accion: Accion | null, u: number, cual: 0 | 1): readonly [number, number] {
  if (accion === 'rueda' && u < 1.1) return cual ? [0, GIRA.sola] : [GIRA.sola, 0];
  if (accion === 'levita' && u > TOQUE_T.sube[0] && u < TOQUE_T.cae[0]) return [GIRA.levita, -GIRA.levita * 0.8];
  return [0, 0];
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b, ruedas: [...b.ruedas] };
  // Tiembla, y abre el faro de par en par.
  m.tiembla = 2.2 * loma(u, T.tiembla[0], 0.2, T.tiembla[1] - 0.2, T.tiembla[1] + 0.2) * Math.sin(u * 62);
  const despierto = loma(u, 0, 0.3, T.cae[1], T.parpadea[0]);
  m.parpado = mezclar(m.parpado, 0, despierto);
  m.haz = mezclar(m.haz, 1, despierto);
  // Levita: sube despacio, se hamaca arriba, y cae de golpe (cada vez más rápido).
  const cae = Math.min(1, Math.max(0, (u - T.cae[0]) / (T.cae[1] - T.cae[0])));
  const arriba = rampa(u, T.sube[0], T.sube[1]) * (1 - cae * cae);
  m.levita = arriba * (1 + 0.06 * Math.sin(u * 2.3));
  m.inclina = arriba * (LEVITA.inclina + 2.4 * Math.sin(u * 1.7));
  m.foco = mezclar(m.foco, 1, loma(u, 0.4, T.sube[1], T.cae[0] - 0.3, T.golpe[1]));
  m.libre = arriba > 0.2 ? (Math.sin(u * 23) > 0 ? 1 : 0.2) : m.libre;
  // Las pompas: dos tandas mientras sube y flota.
  m.pompas = u > 0.8 && u < 4 ? ((u - 0.8) / 1.6) % 1 : 0;
  // Arriba se le abre el baúl y se le escapa el diablo, que asoma y colea. Después se mete solo.
  m.baul = mezclar(m.baul, 1, loma(u, T.baul[0], T.baul[0] + 0.5, T.baul[1] - 0.4, T.baul[1]));
  m.diablo = mezclar(m.diablo, 1, loma(u, T.diablo[0], T.diablo[0] + 0.6, T.diablo[1] - 0.4, T.diablo[1]));
  const suelta = loma(u, T.baul[0], T.diablo[0] + 0.3, T.diablo[1], T.baul[1] + 0.3);
  m.cola = mezclar(m.cola, 1, suelta);
  m.colea += 24 * suelta * Math.sin(u * 8);
  // El chofer saluda: levanta el brazo y lo mueve. Cuando el taxi cae, el brazo sigue hamacándose: llega después.
  const saluda = loma(u, T.saluda[0], T.saluda[0] + 0.5, T.saluda[1] - 0.5, T.saluda[1]);
  m.brazo = LEVITA.brazo * saluda + 16 * saluda * Math.sin(u * 10) + 22 * loma(u, T.golpe[0], T.golpe[0] + 0.1, T.golpe[0] + 0.3, T.golpe[0] + 1.8) * Math.sin((u - T.golpe[0]) * 11);
  // El golpe: se aplasta contra el pasto y rebota apenas.
  m.aplasta = loma(u, T.golpe[0] - 0.02, T.golpe[0] + 0.06, T.golpe[0] + 0.12, T.golpe[1]);
  // Y parpadea tres veces, a lo gurú-vudú.
  m.parpado = mezclar(m.parpado, 1, parpadeo(u, T.parpadea[0], T.parpadea[1], PARPADEOS));
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
  /** A cuánto gira cada rueda ahora, en grados por segundo. */
  giro: readonly [number, number];
}

/** Arma al taxi con un azar que se puede fijar (el test lo fija). La isla usa `armarTaxi`. */
export function armarTaxiCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--taxi')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { rueda: 0, parpadea: 0, pompas: 0, cola: 0, dedos: 0, foco: 0, libre: 0, levita: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas, giro: [0, 0] }) };
  const titere: SVGGElement = g;
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let levitaQuieto = false;
  let cual: 0 | 1 = 0;
  // Las ruedas tienen peso: lo que giraron y a cuánto vienen girando.
  const vuelta: [number, number] = [QUIETO.ruedas[0], QUIETO.ruedas[1]];
  const giro: [number, number] = [0, 0];

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'levita' ? ultima : a;
    desde = t;
    hechas[a]++;
    cual = azar() < 0.5 ? 0 : 1;
  }

  function rodar(t: number, dt: number): void {
    const quiere = empuje(accion, t - desde, cual);
    for (const n of [0, 1] as const) {
      const k = Math.abs(quiere[n]) > Math.abs(giro[n]) ? RUEDA.toma : RUEDA.frena;
      giro[n] += (quiere[n] - giro[n]) * Math.min(1, k * dt);
      if (Math.abs(giro[n]) < 2 && quiere[n] === 0) giro[n] = 0;
      vuelta[n] = (vuelta[n] + giro[n] * dt) % 360;
    }
  }

  function momento(t: number): Momento {
    const b = base(t);
    const u = t - desde;
    const m = accion === 'levita' ? momentoDelToque(b, u) : accion ? momentoDeAccion(b, accion, u) : b;
    return { ...m, ruedas: [vuelta[0], vuelta[1]] };
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
      aplicar(levitaQuieto ? LEVITA : QUIETO);
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
    rodar(t, dt);
    aplicar(momento(t));
  }

  /** Tocado: lo que esté haciendo lo deja, salvo que ya esté levitando. */
  const tocado = (t: number): void => {
    if (accion !== 'levita') empezar('levita', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      levitaQuieto = !levitaQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de las ruedas, y la página abre la ficha. */
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
    estado: () => ({ accion, hechas: { ...hechas }, giro: [giro[0], giro[1]] }),
  };
}

export const armarTaxi: Armar = (marcos, esc) => armarTaxiCon(marcos, esc);
