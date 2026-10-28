/**
 * Las antiguas lobas (`D-73`, vigesimotercera vuelta), echadas al pie de las tiras del monte.
 *
 * Lo que hacen solas es hacerse las muertas, y nada es un bucle: cada vez se elige qué y cuál.
 *
 * - **Respiran**, despacio y cada una a su ritmo: es lo único que dice que están vivas.
 * - **Espían**: cada tanto una entreabre el ojo (la 1, el amarillo; la 2, el de la catarata) y lo cierra.
 * - **Paran la oreja**, sin abrir los ojos.
 * - **Se lamen** la mano.
 * - **Sueñan**: una patalea dormida, mueve la cola y ladra sin ruido.
 * - **Bostezan**, y se les ven las encías sin dientes.
 *
 * Tocadas, **reviven** (*"y antiguas lobas pulpas que reviven"*): abren los ojos, se paran crujiendo en tres
 * tirones, se sacuden el polvo de años, aúllan a dúo con el hocico al cielo un aullido que no se oye (sale
 * el vaho y nada más), trotan una vuelta como lobas jóvenes, con el pelo lleno, y se vuelven a echar, viejas.
 * Dicen su verso. Con movimiento reducido no se mueve nada: tocarlas las pasa de echadas a aullando.
 *
 * Se lleva números (`rig-lobas.ts`) y nada que dibuje.
 */

import { AULLAN, QUIETO, VERSO, VUELTA, enLaVuelta, marcas, type Loba, type Momento } from '../../lib/bestiario/rig-lobas.ts';
import { suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'las-antiguas-lobas';

/** Lo que pueden hacer, y cuánto dura cada cosa, en segundos. */
export const DURA = { oreja: 2.4, lame: 2.8, suena: 3.4, bosteza: 2.4, revive: 8 } as const;
export type Accion = keyof typeof DURA;

export const PAUSA = [1.4, 3.6] as const;
export const PRIMERA = [0.8, 2] as const;
export const DEMORA_FICHA = 1.2;
/** Cada cuánto una entreabre el ojo, y cuánto lo deja abierto. */
export const ESPIA = [3, 6.5] as const;
export const OJO_ABIERTO = 0.7;

/** Los tiempos de cuando reviven, para el test y para la conducta. */
export const REVIVE_T = { despiertan: [0, 0.5], paran: [0.5, 2.1], sacuden: [2.1, 2.9], aullan: [2.9, 4.4], trotan: [4.4, 6.5], echan: [6.5, 7.7] } as const;

const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
const loma = (u: number, a: number, b: number, c: number, d: number): number => rampa(u, a, b) * (1 - rampa(u, c, d));
const entreT = (u: number, [a, b]: readonly [number, number]): number => Math.min(1, Math.max(0, (u - a) / (b - a)));
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;

/** Pararse a los tirones: tres escalones, cada uno sube y se queda un rato. Devuelve la altura y el tirón. */
function escalones(v: number, n = 3): { alza: number; tiron: number } {
  if (v <= 0) return { alza: 0, tiron: 0 };
  if (v >= 1) return { alza: 1, tiron: 0 };
  const k = Math.min(n - 1, Math.floor(v * n));
  const f = v * n - k;
  return { alza: (k + suave(f / 0.55)) / n, tiron: f < 0.4 ? Math.sin((f / 0.4) * Math.PI) : 0 };
}

export interface Estado {
  accion: Accion | null;
  /** Cuál está haciendo lo suyo (0 o 1). */
  quien: number;
  hechas: Readonly<Record<Accion, number>>;
  espiadas: number;
}

/** Arma a las lobas con un azar que se puede fijar (el test lo fija). La isla usa `armarLobas`. */
export function armarLobasCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--lobas')).find((x): x is SVGGElement => !!x);
  const hechas: Record<Accion, number> = { oreja: 0, lame: 0, suena: 0, bosteza: 0, revive: 0 };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ accion: null, quien: 0, hechas, espiadas: 0 }) };
  const titere: SVGGElement = g;
  const p = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  let accion: Accion | null = null;
  let quien = 0;
  let desde = 0;
  let hasta = entre(PRIMERA);
  let ultima: Accion | null = null;
  let hablarEn: number | null = null;
  let aullanQuietas = false;
  let espiaEn = entre(ESPIA);
  let espiona = 0;
  let espiadas = 0;
  // Cada una respira a su ritmo.
  const ritmo = [1.05 + azar() * 0.2, 0.85 + azar() * 0.2] as const;

  function elegir(): Accion {
    const opciones = (['oreja', 'lame', 'suena', 'bosteza'] as const).filter((a) => a !== ultima);
    return opciones[Math.floor(azar() * opciones.length)]!;
  }

  function empezar(a: Accion, t: number): void {
    accion = a;
    if (a !== 'revive') ultima = a;
    desde = t;
    hechas[a]++;
    quien = azar() < 0.5 ? 0 : 1;
  }

  /** Lo que hace una loba sola, echada. */
  function sola(l: Loba, n: 0 | 1, t: number): void {
    l.respira = 0.03 * Math.sin(t * ritmo[n] * 1.3 + n * 2);
    l.cola = 2 * Math.sin(t * 0.4 + n);
    // Espía: entreabre el ojo un rato y lo cierra.
    const e = t - espiaEn;
    if (n === espiona && e > 0 && e < OJO_ABIERTO) l.parpado = Math.max(0, 1 - 1.2 * Math.sin((e / OJO_ABIERTO) * Math.PI));
    if (accion === null || accion === 'revive' || quien !== n) return;
    const u = t - desde;
    switch (accion) {
      case 'oreja': {
        // Para la oreja de golpe, la mueve para un lado y el otro, y la baja: sin abrir los ojos.
        const k = loma(u, 0, 0.18, 1.8, DURA.oreja);
        l.oreja = -26 * k + 8 * k * Math.sin(u * 9) * (u > 0.6 ? 1 : 0);
        l.cabeza = -5 * loma(u, 0.1, 0.4, 1.6, 2.1);
        break;
      }
      case 'lame': {
        // Baja la cabeza a la mano y se la lame, despacito.
        const k = loma(u, 0, 0.5, 2.2, DURA.lame);
        l.cabeza = 8 * k;
        l.lengua = k > 0.7 ? 0.6 + 0.4 * Math.sin(u * 16) : 0;
        l.quijada = 0.18 * k;
        break;
      }
      case 'suena': {
        // Sueña que corre: patalea dormida, la cola le late y ladra sin ruido.
        const k = loma(u, 0, 0.3, 2.9, DURA.suena);
        const f = Math.sin(u * 17);
        l.patas = [12 * k * f, -10 * k * f, -9 * k * f, 8 * k * f];
        l.cola += 10 * k * Math.sin(u * 11);
        l.quijada = 0.22 * k * Math.max(0, Math.sin(u * 7));
        l.oreja = -6 * k * Math.sin(u * 5);
        break;
      }
      case 'bosteza': {
        const k = loma(u, 0, 0.6, 1.5, DURA.bosteza);
        l.quijada = k;
        l.cabeza = -14 * k;
        l.lengua = 0.6 * loma(u, 0.4, 0.7, 1.3, 1.6);
        l.oreja = -10 * k;
        break;
      }
    }
  }

  /** Cuando reviven: la misma coreografía para las dos, la 2 un poquito después. */
  function revive(l: Loba, n: 0 | 1, u0: number): void {
    const T = REVIVE_T;
    const u = u0 - n * 0.22;
    const ua = u0 - n * 0.14;
    // Despiertan: abren los ojos y paran las orejas.
    const despierta = rampa(u, T.despiertan[0], T.despiertan[1]) * (1 - rampa(u, T.echan[0] + 0.6, T.echan[1]));
    l.parpado = mezclar(l.parpado, 0, despierta);
    l.oreja = -18 * despierta;
    l.cabeza = -8 * loma(u, 0, 0.4, 0.6, 1.2);
    // Se paran crujiendo, a los tirones.
    const { alza, tiron } = escalones(entreT(u, T.paran));
    const echa = rampa(u, T.echan[0] + 0.1, T.echan[1] - 0.1);
    l.alza = alza * (1 - echa);
    l.cruje = u < T.paran[1] ? tiron : 0;
    l.sacude = -5 * tiron;
    // Se sacuden el polvo de años.
    const sac = loma(u, T.sacuden[0], T.sacuden[0] + 0.12, T.sacuden[1] - 0.15, T.sacuden[1]);
    l.sacude += 9 * sac * Math.sin(u * 40);
    l.cabeza += 9 * sac * Math.sin(u * 40 + 1);
    l.oreja += 16 * sac * Math.sin(u * 46);
    l.polvo = entreT(u, T.sacuden);
    if (sac > 0) l.parpado = Math.max(l.parpado, 0.6 * sac);
    // Aúllan a dúo, al cielo: el vaho sale en tres bocanadas y no se oye nada.
    const aulla = loma(ua, T.aullan[0], T.aullan[0] + 0.35, T.aullan[1] - 0.3, T.aullan[1]);
    l.cabeza = mezclar(l.cabeza, AULLAN.lobas[n].cabeza, aulla);
    l.quijada = mezclar(l.quijada, AULLAN.lobas[n].quijada, aulla);
    l.parpado = mezclar(l.parpado, 1, aulla);
    l.cola = mezclar(l.cola, AULLAN.lobas[n].cola, aulla);
    if (ua > T.aullan[0] + 0.3 && ua < T.aullan[1] - 0.2) l.vaho = ((ua - T.aullan[0] - 0.3) / 0.4) % 1;
    // Trotan una vuelta, de jóvenes.
    const v = entreT(u0, T.trotan);
    const joven = loma(u0, T.trotan[0], T.trotan[0] + 0.4, T.trotan[1] - 0.2, T.echan[0] + 0.5);
    l.joven = joven;
    if (u0 > T.trotan[0] && u0 < T.trotan[1]) {
      const ang = 2 * Math.PI * suave(v);
      const en = enLaVuelta(n, ang);
      l.x = en.x;
      l.y = en.y;
      l.mira = en.mira;
      const paso = ang * VUELTA.trancos;
      const s = Math.sin(paso) * Math.min(1, v * 8, (1 - v) * 8);
      l.patas = [24 * s, -24 * s, -22 * s, 22 * s];
      l.y -= 1.2 * Math.abs(Math.sin(paso));
      l.cola = -32 * joven + 6 * Math.sin(paso);
      l.cabeza = -4 + 3 * Math.sin(paso * 2);
      l.quijada = 0.32 * joven;
      l.lengua = joven;
      l.parpado = 0;
    }
    // Se vuelven a echar, viejas: bajan la cabeza, cierran los ojos.
    const baja = rampa(u, T.echan[0] + 0.2, T.echan[1]);
    l.cabeza = mezclar(l.cabeza, 0, baja);
    l.oreja = mezclar(l.oreja, 0, baja);
    if (u > T.echan[0]) l.respira = 0.05 * Math.sin((u - T.echan[0]) * 3) * (1 - baja);
  }

  function momento(t: number): Momento {
    const copia = (q: Loba): Loba => ({ ...q, patas: [...q.patas] });
    const lobas: [Loba, Loba] = [copia(QUIETO.lobas[0]), copia(QUIETO.lobas[1])];
    lobas.forEach((l, n) => {
      sola(l, n as 0 | 1, t);
      if (accion === 'revive') revive(l, n as 0 | 1, t - desde);
    });
    return { lobas };
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
      aplicar(aullanQuietas ? AULLAN : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    if (t - espiaEn > OJO_ABIERTO) {
      espiaEn = t + entre(ESPIA);
      espiona = azar() < 0.5 ? 0 : 1;
      espiadas++;
    }
    if (accion && t - desde >= DURA[accion]) {
      accion = null;
      hasta = t + entre(PAUSA);
    }
    if (!accion && t >= hasta) empezar(elegir(), t);
    aplicar(momento(t));
  }

  /** Tocadas: lo que estén haciendo lo dejan, salvo que ya estén reviviendo. */
  const tocado = (t: number): void => {
    if (accion !== 'revive') empezar('revive', t);
  };

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      aullanQuietas = !aullanQuietas;
      pintar(t, 0);
      decir();
    } else {
      tocado(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dicen su verso arriba de las dos, y la página abre la ficha. */
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
    estado: () => ({ accion, quien, hechas: { ...hechas }, espiadas }),
  };
}

export const armarLobas: Armar = (marcos, esc) => armarLobasCon(marcos, esc);
