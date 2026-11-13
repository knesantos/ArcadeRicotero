/**
 * La vida de un títere de la vigesimoctava vuelta (`D-73`): lo que se repite en la conducta de cada uno y no vale
 * la pena escribir cuatro veces. Cada bestia trae sus números (`rig-<slug>.ts`) y cómo se arma cada acción; esto
 * se ocupa del reloj: elegir qué hace sola (nunca la misma dos veces seguidas), correr el toque, los ritmos
 * que se repiten al azar (pestañear, colear), la pose quieta con movimiento reducido y decir el verso.
 *
 * No dibuja nada: escribe en cada `data-parte` el `transform` y la opacidad que le diga `marcas` del rig.
 */

import type { Armar, Escenario, Vivo } from './vivos.ts';

/** Lo que dice el rig de un momento: qué transform y qué opacidad lleva cada parte. */
export interface Marcas {
  transform: Record<string, string>;
  opacity: Record<string, string>;
}

/** Un ritmo que se repite al azar: cada cuánto empieza (segundos, de a a b) y cuánto dura. */
export interface Ritmo {
  cada: readonly [number, number];
  dura: number;
}

export interface Config<M, A extends string> {
  id: string;
  /** La clase del títere dentro de la figura (`titere--rebano`). */
  clase: string;
  /** Cuánto dura cada cosa que hace sola, y el toque. */
  duran: Readonly<Record<A | 'toque', number>>;
  solas: readonly A[];
  pausa: readonly [number, number];
  primera: readonly [number, number];
  /** Cuánto tarda la página en abrir la ficha después del toque, en segundos. */
  demoraFicha: number;
  ritmos: Readonly<Record<string, Ritmo>>;
  quieto: M;
  /** La pose del toque, quieta: es lo que muestra con movimiento reducido y el retrato. */
  toca: M;
  /** La pose de base de un instante; `ev(nombre)` da cuánto va de un ritmo (0 a 1) o -1 si no está pasando. */
  base(t: number, ev: (nombre: string) => number): M;
  accion(b: M, a: A, u: number): M;
  toque(b: M, u: number): M;
  marcas(m: M): Marcas;
  /** Dónde dice su verso, en las coordenadas del recinto. */
  verso: readonly [number, number];
}

export interface Estado<A extends string> {
  accion: A | 'toque' | null;
  hechas: Readonly<Record<A | 'toque', number>>;
}

/** Arma la vida de un títere con un azar que se puede fijar (los tests lo fijan). */
export function armarVida<M, A extends string>(cfg: Config<M, A>, marcos: readonly SVGGElement[], esc: Escenario, azar: () => number): Vivo & { estado(): Estado<A> } {
  const hechas = Object.fromEntries([...cfg.solas, 'toque'].map((a) => [a, 0])) as Record<A | 'toque', number>;
  const g = marcos.map((m) => m.querySelector<SVGGElement>(`.${cfg.clase}`)).find((x): x is SVGGElement => !!x);
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, hechas }) };
  const titere: SVGGElement = g;
  const partes = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) partes.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: A | 'toque' | null = null;
  let desde = 0;
  let hasta = entre(cfg.primera);
  let ultima: A | null = null;
  let hablarEn: number | null = null;
  let tocaQuieto = false;
  /** Cuándo empezó el próximo evento de cada ritmo. */
  const proximo: Record<string, number> = {};
  for (const [n, r] of Object.entries(cfg.ritmos)) proximo[n] = entre(r.cada);

  const elegir = (): A => {
    const opciones = cfg.solas.filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  };

  const empezar = (a: A | 'toque', t: number): void => {
    accion = a;
    if (a !== 'toque') ultima = a;
    desde = t;
    hechas[a]++;
  };

  const ev = (t: number) => (nombre: string): number => {
    const r = cfg.ritmos[nombre];
    const u = t - (proximo[nombre] ?? Infinity);
    return r && u >= 0 && u < r.dura ? u / r.dura : -1;
  };

  function momento(t: number): M {
    const b = cfg.base(t, ev(t));
    if (accion === 'toque') return cfg.toque(b, t - desde);
    if (accion) return cfg.accion(b, accion, t - desde);
    return b;
  }

  function aplicar(m: M): void {
    const { transform, opacity } = cfg.marcas(m);
    for (const [nombre, valor] of Object.entries(transform)) if (nombre !== 'entero') partes.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) partes.get(nombre)?.setAttribute('opacity', valor);
  }

  const decir = (): void => esc.hablar(cfg.id, cfg.verso[0], cfg.verso[1]);

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(tocaQuieto ? cfg.toca : cfg.quieto);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(cfg.quieto);
      return;
    }
    for (const [n, r] of Object.entries(cfg.ritmos)) if (t - proximo[n]! > r.dura) proximo[n] = t + entre(r.cada);
    if (accion && t - desde >= cfg.duran[accion]) {
      accion = null;
      hasta = t + entre(cfg.pausa);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  const tocado = (t: number): void => {
    if (accion !== 'toque') empezar('toque', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      tocaQuieto = !tocaQuieto;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + cfg.demoraFicha;
    }
  };
  titere.addEventListener('click', tocar);
  titere.addEventListener('keydown', (ev2) => {
    const k = (ev2 as KeyboardEvent).key;
    if (k === 'Enter' || k === ' ') {
      ev2.preventDefault();
      tocar();
    }
  });

  pintar(0, 0);
  return {
    mover: pintar,
    reaccionar: (id, t) => {
      if (id !== cfg.id) return false;
      if (!esc.quieto()) tocado(t);
      return true;
    },
    estado: () => ({ accion, hechas: { ...hechas } }),
  };
}

/** Lo que usan las conductas para armar un `Armar` a partir de su configuración. */
export const armarCon = <M, A extends string>(cfg: Config<M, A>): Armar => (marcos, esc) => armarVida(cfg, marcos, esc, Math.random);

export { suave } from './articular.ts';
export const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
/** El arco de un salto: 0 en las puntas, 1 arriba. */
export const arco = (k: number): number => (k <= 0 || k >= 1 ? 0 : 4 * k * (1 - k));
export const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
/** El aliento: se llena despacio y se vacía más rápido (−1 a 1). */
export const aliento = (t: number, periodo: number): number => {
  const p = (((t % periodo) + periodo) % periodo) / periodo;
  return p < 0.62 ? -Math.cos((Math.PI * p) / 0.62) : Math.cos((Math.PI * (p - 0.62)) / 0.38);
};
