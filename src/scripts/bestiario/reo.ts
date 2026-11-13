/**
 * El reo semental (`D-73`, vigesimosexta vuelta), en la celda del ala de la izquierda de la prisión.
 *
 * Lo que hace solo es aguantarse el calor, y nada es un bucle: elige qué hacer cada vez.
 *
 * - **Suda**: las gotas le bajan por la frente, sacude la cabeza y vuelan.
 * - **Resopla**: hincha el pecho, aprieta los dientes, suelta el aire con los labios.
 * - **Flexiona**: suelta un barrote, levanta el brazo para mirarse el bíceps con el tatuaje, y vuelve a agarrarse.
 * - **Se ablanda**: se le derrite un poco la cara, chorrean las rayas, se asusta y se endereza.
 * - **Mira** para un lado y para el otro, con el ceño, a ver quién anda.
 * - **Respira**, pestañea, y la frente no se le seca nunca.
 *
 * Tocado, **se licúa** (*"el reo semental se va a licuar"*): se le estira la cara, se le cae el jopo, se derrite
 * entero y baja por la reja con los puños todavía agarrados, hasta quedar hecho un charco a rayas con los dos ojos
 * flotando; se queda así un rato; y se vuelve a armar, de abajo para arriba, se sacude el sudor y gruñe. Dice su
 * verso. Con movimiento reducido no se mueve nada: tocarlo lo pasa de entero a medio licuado.
 *
 * Se lleva números (`rig-reo.ts`) y nada que dibuje.
 */

import { LICUADO, QUIETO, VERSO, marcas, type Momento } from '../../lib/bestiario/rig-reo.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-reo-semental';

/** Lo que puede hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { suda: 2.8, resopla: 2.6, flexiona: 3.6, ablanda: 3.2, mira: 3, licua: 8.4 } as const;
export type Accion = keyof typeof DURA;
const SOLAS = ['suda', 'resopla', 'flexiona', 'ablanda', 'mira'] as const;

export const PAUSA = [1, 2.6] as const;
export const PRIMERA = [0.5, 1.5] as const;
export const DEMORA_FICHA = 1.4;
/** Cada cuánto pestañea, en segundos, y cuánto tarda cada gota en bajar. */
export const PESTANEA = [2.4, 5] as const;
const PESTANEO = 0.2;
export const GOTA = 2.2;

/** Los tiempos del toque: para el test y para la conducta. */
export const TOQUE_T = { estira: [0, 1.2], baja: [1.2, 3.6], charco: [3.6, 5.2], arma: [5.2, 7.2], sacude: [7.2, 8.4] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;

/** La pose de base de un instante: respira, el sudor baja despacio y el ceño no se le va. */
export function base(t: number): Momento {
  return {
    ...QUIETO,
    respira: Math.sin(t * 2.2),
    cabeza: 1.5 * Math.sin(t * 0.6),
    gotas: (t / GOTA) % 1,
    gotasSe: 0.7,
    cejas: QUIETO.cejas + 2 * Math.sin(t * 0.9),
  };
}

/** Lo que hace a los `u` segundos de empezar una acción sola, sobre la pose de base. `lado` es 1 o −1. */
export function momentoDeAccion(b: Momento, accion: (typeof SOLAS)[number], u: number, lado = 1): Momento {
  const m: Momento = { ...b, parpados: [...b.parpados], pupilas: [...b.pupilas], brazos: [...b.brazos] };
  switch (accion) {
    case 'suda': {
      // Las gotas bajan a chorro; sacude la cabeza y vuelan.
      const k = loma(u, 0, 0.4, 2.2, DURA.suda);
      m.gotas = (u / 0.9) % 1;
      m.gotasSe = mezclar(m.gotasSe, 1, k);
      const sacude = loma(u, 1.2, 1.3, 1.9, 2.1);
      m.cabeza += 9 * sacude * Math.sin(u * 30);
      m.parpados = [Math.max(m.parpados[0], 0.9 * sacude), Math.max(m.parpados[1], 0.9 * sacude)];
      m.jopo = 6 * sacude * Math.sin(u * 30 + 1);
      break;
    }
    case 'resopla': {
      // Toma aire, hincha el pecho, aprieta los dientes, y lo suelta.
      const toma = loma(u, 0, 0.8, 1.2, 1.5);
      const suelta = loma(u, 1.4, 1.6, 2.1, 2.5);
      m.pecho = toma;
      m.respira = mezclar(m.respira, 1, toma);
      m.dientes = loma(u, 0.4, 0.7, 1.3, 1.6);
      m.cejas += 10 * toma;
      m.boca = 0.5 * suelta * (0.6 + 0.4 * Math.sin(u * 40));
      m.cabeza += 4 * suelta * Math.sin(u * 40);
      break;
    }
    case 'flexiona': {
      // Suelta el barrote de ese lado, dobla el brazo para mirarse el bíceps, y vuelve a agarrarse.
      const k = loma(u, 0, 0.7, 2.6, DURA.flexiona);
      const n = lado > 0 ? 1 : 0;
      m.brazos = n ? [0, -70 * k] : [70 * k, 0];
      m.cabeza = mezclar(m.cabeza, lado * 12, k);
      m.pupilas = [lado * 4 * k, -2 * k];
      m.cejas -= 8 * k;
      m.boca = 0.3 * loma(u, 1, 1.4, 2, 2.4);
      break;
    }
    case 'ablanda': {
      // Se le derrite un poco la cara, chorrean las rayas; se asusta, abre los ojos y se endereza.
      const k = loma(u, 0, 1.4, 2, 2.6);
      m.licua = 0.22 * k;
      m.jopo = 20 * k;
      m.chorrea = loma(u, 0.4, 1.4, 2.2, 3);
      m.parpados = [Math.max(m.parpados[0], 0.5 * k), Math.max(m.parpados[1], 0.5 * k)];
      const susto = loma(u, 2, 2.2, 2.8, DURA.ablanda);
      m.parpados = [m.parpados[0] * (1 - susto), m.parpados[1] * (1 - susto)];
      m.cejas = mezclar(m.cejas, -12, susto);
      m.tiembla = 1.2 * susto * Math.sin(u * 44);
      break;
    }
    case 'mira': {
      // Mira para un lado, después para el otro, con el ceño.
      const k = loma(u, 0, 0.4, 2.5, DURA.mira);
      const vuelta = loma(u, 1.2, 1.6, 2.2, 2.6);
      m.pupilas = [lado * 6 * k * (1 - 2 * vuelta), 0];
      m.cabeza += lado * 6 * k * (1 - 2 * vuelta);
      m.cejas += 8 * k;
      break;
    }
  }
  return m;
}

/** El toque, sobre la pose de base de ese cuadro: lo que hace a los `u` segundos de que lo tocaron. */
export function momentoDelToque(b: Momento, u: number): Momento {
  const T = TOQUE_T;
  const m: Momento = { ...b, parpados: [...b.parpados], pupilas: [...b.pupilas], brazos: [...b.brazos] };
  // Se licúa: primero la cara, después baja entero, y se queda hecho un charco; después se arma de nuevo.
  const estira = rampa(u, T.estira[0], T.estira[1]);
  const baja = rampa(u, T.baja[0], T.baja[1]);
  const arma = rampa(u, T.arma[0], T.arma[1]);
  m.licua = Math.max(estira * 0.45, baja) * (1 - arma);
  m.jopo = mezclar(m.jopo, LICUADO.jopo, estira) * (1 - arma);
  m.boca = mezclar(m.boca, LICUADO.boca, estira) * (1 - arma);
  m.chorrea = Math.max(m.chorrea, loma(u, T.estira[0] + 0.3, T.estira[1], T.arma[1] - 0.6, T.arma[1]));
  m.gotas = (u / 0.7) % 1;
  m.gotasSe = mezclar(m.gotasSe, 1, estira) * (1 - rampa(u, T.baja[1] - 0.6, T.baja[1]));
  m.cejas = mezclar(m.cejas, -8, estira) * (1 - arma);
  m.parpados = [Math.max(m.parpados[0], 0.5 * estira * (1 - arma)), Math.max(m.parpados[1], 0.5 * estira * (1 - arma))];
  // El charco se arma a medida que baja, y los ojos flotan cuando ya no queda nada.
  m.charco = Math.max(loma(u, T.baja[0], T.baja[1], T.arma[0] + 0.4, T.arma[1]), 0);
  m.charcoOjos = loma(u, T.baja[1] - 0.3, T.baja[1], T.arma[0], T.arma[0] + 0.4);
  // Armado de nuevo, se sacude el sudor y gruñe.
  const sacude = loma(u, T.sacude[0], T.sacude[0] + 0.1, T.sacude[0] + 0.7, T.sacude[0] + 0.9);
  m.cabeza += 10 * sacude * Math.sin(u * 32);
  m.tiembla = 1.5 * sacude * Math.sin(u * 32);
  m.dientes = loma(u, T.sacude[0] + 0.6, T.sacude[0] + 0.8, T.sacude[1] - 0.3, T.sacude[1]);
  m.cejas += 14 * loma(u, T.sacude[0] + 0.5, T.sacude[0] + 0.8, T.sacude[1] - 0.3, T.sacude[1]);
  return m;
}

export interface Estado {
  accion: Accion | null;
  hechas: Readonly<Record<Accion, number>>;
}

/** Arma al reo con un azar que se puede fijar (el test lo fija). La isla usa `armarReo`. */
export function armarReoCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--reo')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { suda: 0, resopla: 0, flexiona: 0, ablanda: 0, mira: 0, licua: 0 };
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
  let licuadoQuieto = false;
  let lado = 1;
  let pestanea = entre(PESTANEA);

  function elegir(): Accion {
    const opciones = SOLAS.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    ultima = a === 'licua' ? ultima : a;
    desde = t;
    hechas[a]++;
    lado = azar() < 0.5 ? -1 : 1;
  }

  function momento(t: number): Momento {
    const b = base(t);
    const ojo = t - pestanea;
    if (ojo > 0 && ojo < PESTANEO) {
      const k = Math.sin((ojo / PESTANEO) * Math.PI);
      b.parpados = [k, k];
    }
    const u = t - desde;
    if (accion === 'licua') return momentoDelToque(b, u);
    if (accion) return momentoDeAccion(b, accion, u, lado);
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
      aplicar(licuadoQuieto ? LICUADO : QUIETO);
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

  /** Tocado: lo que esté haciendo lo deja, salvo que ya se esté licuando. */
  const tocado = (t: number): void => {
    if (accion !== 'licua') empezar('licua', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      licuadoQuieto = !licuadoQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso arriba de la celda, y la página abre la ficha. */
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

export const armarReo: Armar = (marcos, esc) => armarReoCon(marcos, esc);
