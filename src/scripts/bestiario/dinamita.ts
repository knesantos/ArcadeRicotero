/**
 * Mi perro dinamita (`D-73`, decimonovena vuelta), en la tierra del baldío.
 *
 * Lo que hace solo sale de la letra, y nada es un bucle: cada cosa tiene su tiempo.
 *
 * - **Anda por el baldío** al trote, de acá para allá, y se da vuelta como un títere de papel.
 * - **Jadea con el hocico afiebrado**: la lengua afuera, y la trufa que le late como una brasa.
 * - **Olfatea la tierra**, y cada tanto **aúlla** (*"y aúlla este rock'n roll"*): el hocico para arriba,
 *   las orejas para atrás.
 * - **La cola no la mueve** (*"no mueve el rabo con docilidad"*): es una mecha. Cada tanto le salta una
 *   chispa sola en la punta, y él la mira de reojo.
 *
 * Tocado, **se prende la mecha**: la chispa baja por la cola, él tiembla, se agacha y la mira, y cuando
 * llega al cartucho **explota**: el fogonazo, la estrella del *BUM*, las esquirlas, el humo y un sacudón de
 * la cámara. El perro vuela en pedazos (la cabeza dando vueltas para arriba, las patas para los costados)
 * y se vuelve a armar, como en los dibujos animados, tiznado y con la mecha cortita. Le dan vueltas los
 * ojos, se sacude el hollín y aúlla. Ahí dice su verso. La mecha le vuelve a crecer de a poco. Con
 * movimiento reducido no se mueve nada: tocarlo lo pasa de la pose quieta a la del aullido, tiznado.
 *
 * Se lleva números (`rig-dinamita.ts`) y nada que dibuje.
 */

import { AULLA, LUGAR, QUIETO, RANGO, VERSO, marcas, type Llama, type Momento, type Punto } from '../../lib/bestiario/rig-dinamita.ts';
import { partes, suave } from './articular.ts';
import { sacudir } from './sacudon.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'mi-perro-dinamita';

/** Cuánto tardan las cosas, en segundos: lo que se repite varía entre el mínimo y el máximo. */
export const TIEMPOS = {
  paseo: [4, 9],
  olfatea: [6, 13],
  aulla: [16, 28],
  primerAullido: [7, 12],
  chispazo: [4, 9],
  mira: [2, 5],
  parpadeo: [2.4, 5.5],
} as const;

/** Cuánto dura cada cosa. */
export const DURA = { olfatea: 2.4, aulla: 1.9, chispazo: 0.35, bum: 6.6 } as const;

/** A qué velocidad trota, en las del perro por segundo; y cuánto tarda en darse vuelta. */
export const TROTE = 66;
const VUELTA_SEG = 0.3;

/**
 * La explosión, en segundos desde que lo tocan: cuándo estalla, y desde el estallido cuánto vuela, cuánto
 * queda en el aire, cuándo está armado de vuelta, cuándo se sacude y cuándo aúlla.
 */
export const BUM = { estalla: 1.4, vuela: 0.45, cuelga: 1.15, armado: 1.75, sacude: [1.95, 2.75], aulla: [2.9, 4.8], crece: [3.6, 5] } as const;

/** La fuerza del sacudón de la cámara cuando estalla: menos que el meteorito de la vaca, más que el bombo. */
export const SACUDON = 0.72;

/**
 * Cuánto espera para abrir la ficha después del toque, en segundos: que se vea el estallido y que esté
 * armado de vuelta. Con movimiento reducido se abre enseguida.
 */
export const DEMORA_FICHA = 3.3;

const entre01 = (v: number): number => Math.min(1, Math.max(0, v));
/** Sube de 0 a 1 entre `a` y `b`. */
const rampa = (u: number, a: number, b: number): number => suave((u - a) / (b - a));
/** Sube entre `a` y `b`, se queda, y baja entre `c` y `d`. */
const meseta = (u: number, a: number, b: number, c: number, d: number): number => Math.min(rampa(u, a, b), 1 - rampa(u, c, d));
/** Arranca rápido y frena: lo que sale disparado. */
const sale = (k: number): number => 1 - (1 - entre01(k)) ** 3;
const APAGADA: Llama = { k: 1, o: 0 };

/** El aullido, de 0 a 1: el hocico arriba, la boca abierta, las orejas atrás y los ojos entornados. */
export function aullido(a: number, t: number): Pick<Momento, 'cabeza' | 'boca' | 'oreja' | 'parpado'> {
  return {
    cabeza: 34 * a,
    boca: 0.9 * a + 0.06 * a * Math.sin(t * 31),
    oreja: QUIETO.oreja + (-0.8 - QUIETO.oreja) * a,
    parpado: QUIETO.parpado + 0.6 * a,
  };
}

/**
 * La explosión en el tiempo `u` desde que lo tocaron (de 0 a `DURA.bum`): lo que cambia del perro y de la
 * explosión. Lo que no devuelve lo decide lo de siempre.
 */
export function explosion(u: number): Partial<Momento> {
  const e = BUM.estalla;
  if (u < 0 || u >= DURA.bum) return {};
  if (u < e) {
    // La mecha se quema: la chispa baja por la cola, y él tiembla cada vez más mirándola.
    const tiembla = rampa(u, 0.25, e);
    return {
      mecha: 1 - 0.92 * (u / e),
      chispa: { k: 1.15 + 0.35 * Math.sin(u * 61), o: 1 },
      temblor: [Math.sin(u * 83) * 1.8 * tiembla, Math.cos(u * 71) * 1 * tiembla],
      agacha: 0.55 * rampa(u, 0.2, 0.9),
      cabeza: -7 * rampa(u, 0.1, 0.5),
      boca: 0.04,
      oreja: 1,
      pupila: [2.2, -0.4],
      pupilaK: 0.7,
      parpado: 0,
      fiebre: 1,
      anda: 0,
    };
  }
  const v = u - e;
  const desarme = v < BUM.vuela ? sale(v / BUM.vuela) : v < BUM.cuelga ? 1 - 0.08 * rampa(v, BUM.vuela, BUM.cuelga) : 0.92 * (1 - rampa(v, BUM.cuelga, BUM.armado));
  const armado = v >= BUM.armado;
  const [s0, s1] = BUM.sacude;
  const sacudon = v > s0 && v < s1 ? Math.sin((v - s0) * Math.PI * 2 * 7) * 9 * (1 - (v - s0) / (s1 - s0)) : 0;
  // Armado de vuelta, mareado: los ojos le dan vueltas.
  const mareo = meseta(v, BUM.armado, BUM.armado + 0.1, 2.3, 2.5);
  const a = meseta(v, BUM.aulla[0], BUM.aulla[0] + 0.3, BUM.aulla[1] - 0.3, BUM.aulla[1]);
  return {
    mecha: 0.22 + 0.78 * rampa(v, BUM.crece[0], BUM.crece[1]),
    chispa: armado ? { k: 0.55, o: 0.7 * (1 - rampa(v, BUM.armado + 0.1, 3.2)) } : APAGADA,
    temblor: [0, 0],
    sacude: sacudon,
    agacha: 0,
    anda: 0,
    fiebre: 1,
    hollin: armado ? 1 - 0.45 * rampa(v, s0, s1) : 1,
    desarme,
    estrella: v < 0.6 ? { k: 0.25 + sale(v / 0.12), o: 1 - rampa(v, 0.32, 0.55) } : APAGADA,
    fogonazo: { k: 0.3 + 1.2 * sale(v / 0.5), o: 1 - rampa(v, 0.08, 0.75) },
    esquirlas: { k: 0.3 + 1.4 * sale(v / 0.45), o: 1 - rampa(v, 0.2, 0.65) },
    humo: { k: 0.45 + 0.95 * sale(v / 1.8), o: entre01(v / 0.1) * (1 - rampa(v, 0.9, 2.6)), sube: 110 * sale(v / 2.6) },
    pupila: mareo ? [Math.cos(v * 15) * 1.3 * mareo, Math.sin(v * 15) * 1.1 * mareo] : [0, 0],
    pupilaK: 1 - 0.3 * mareo,
    oreja: armado && v < BUM.aulla[0] ? -1 + 2 * rampa(v, 2.2, 2.8) * 0.7 : undefined,
    ...(a > 0 ? aullido(a, u) : {}),
  };
}

export interface Estado {
  explotando: boolean;
  estallidos: number;
  x: number;
  mira: number;
  hollin: number;
}

/** Arma al perro con un azar que se puede fijar (el test lo fija). La isla usa `armarDinamita`. */
export function armarDinamitaCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--dinamita')).find((x): x is SVGGElement => !!x);
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => ({ explotando: false, estallidos: 0, x: 0, mira: 1, hollin: 0 }) };
  const titere: SVGGElement = g;
  const p = partes(titere);
  /** El rectángulo que se toca acompaña al perro cuando camina. */
  const toque = titere.querySelector<SVGRectElement>('.bt-dinamita-toque');
  const toqueX = Number(toque?.getAttribute('x') ?? 0);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();
  let hablarEn: number | null = null;

  let bumDesde = -100;
  let estallo = true;
  let estallidos = 0;
  let x = 0;
  let mira = 1;
  let metaX = 0;
  let paso = 0;
  let anda = 0;
  let proximoPaseo = entre(TIEMPOS.paseo);
  let olfateaDesde = -100;
  let proximoOlfateo = entre(TIEMPOS.olfatea);
  let aullaDesde = -100;
  let proximoAullido = entre(TIEMPOS.primerAullido);
  let chispazoDesde = -100;
  let proximoChispazo = entre(TIEMPOS.chispazo);
  let mirada: Punto = [0, 0];
  let proximaMirada = entre(TIEMPOS.mira);
  let parpadeo = entre(TIEMPOS.parpadeo);
  /** El tizne que le queda después, que se le va yendo. */
  let hollin = 0;
  let ultimo: Momento = QUIETO;
  let tiznadoQuieto = false;

  const explotando = (t: number): boolean => t - bumDesde < DURA.bum;
  const encender = (t: number): void => {
    if (explotando(t)) return;
    bumDesde = t;
    estallo = false;
  };

  function momento(t: number, dt: number): Momento {
    const m: Momento = { ...QUIETO };
    const quieto = !explotando(t);

    // El paseo: elige adónde ir, se da vuelta para ese lado y trota hasta llegar.
    if (quieto && t > proximoPaseo && anda < 0.05) {
      let otra = metaX;
      for (let i = 0; i < 6 && Math.abs(otra - x) < 50; i++) otra = (azar() * 2 - 1) * RANGO;
      metaX = otra;
      proximoPaseo = t + Math.abs(metaX - x) / TROTE + entre(TIEMPOS.paseo);
    }
    const miraMeta = metaX < x - 0.5 ? 1 : metaX > x + 0.5 ? -1 : mira;
    mira += Math.sign(miraMeta - mira) * Math.min(Math.abs(miraMeta - mira), (2 / VUELTA_SEG) * dt);
    const dado = Math.abs(miraMeta - mira) < 0.05;
    const falta = metaX - x;
    const trota = quieto && dado && Math.abs(falta) > 0.5;
    if (trota) x += Math.sign(falta) * Math.min(Math.abs(falta), TROTE * dt * Math.max(0.3, anda));
    anda += ((trota ? 1 : 0) - anda) * Math.min(1, dt * 6);
    paso += dt * 11 * anda;
    m.x = x;
    m.mira = mira;
    m.paso = paso;
    m.anda = anda;

    // Jadea, con la lengua afuera, y la trufa le late.
    m.respira = Math.sin(t * 11) * 0.6;
    m.boca = 0.24 + 0.1 * Math.sin(t * 11);
    m.fiebre = 0.5 + 0.45 * Math.sin(t * 2.3) ** 2;

    // Olfatea la tierra, parado.
    if (quieto && t > proximoOlfateo && anda < 0.1 && t - aullaDesde > DURA.aulla) {
      olfateaDesde = t;
      proximoOlfateo = t + DURA.olfatea + entre(TIEMPOS.olfatea);
    }
    const huele = meseta(t - olfateaDesde, 0, 0.4, DURA.olfatea - 0.4, DURA.olfatea);
    if (huele > 0) {
      m.cabeza = -24 * huele;
      m.boca = 0.08 + 0.06 * Math.abs(Math.sin(t * 19)) * huele;
    }

    // Aúlla, de la nada.
    if (quieto && t > proximoAullido && anda < 0.1 && huele === 0) {
      aullaDesde = t;
      proximoAullido = t + DURA.aulla + entre(TIEMPOS.aulla);
    }
    const a = meseta(t - aullaDesde, 0, 0.3, DURA.aulla - 0.3, DURA.aulla);
    if (a > 0) Object.assign(m, aullido(a, t));

    // La chispa sola en la punta de la mecha: la oreja se le para y la mira de reojo.
    if (quieto && t > proximoChispazo) {
      chispazoDesde = t;
      proximoChispazo = t + entre(TIEMPOS.chispazo);
    }
    const uc = t - chispazoDesde;
    if (uc >= 0 && uc < DURA.chispazo) {
      m.chispa = { k: 0.5 + 0.4 * Math.abs(Math.sin(uc * 70)), o: 1 - uc / DURA.chispazo };
      m.oreja = 1;
    }
    const reojo = meseta(uc, 0, 0.08, 0.7, 0.9);

    // Adónde mira: a vos, al baldío, o a la mecha cuando chisporrotea.
    if (t > proximaMirada) {
      mirada = azar() < 0.5 ? [-0.9, 0.3] : [0.5, -0.2];
      proximaMirada = t + entre(TIEMPOS.mira);
    }
    m.pupila = [mirada[0] + (2 - mirada[0]) * reojo, mirada[1] + (-0.4 - mirada[1]) * reojo];

    // El párpado.
    if (t > parpadeo + 0.13) parpadeo = t + entre(TIEMPOS.parpadeo);
    if (t > parpadeo && t < parpadeo + 0.13) m.parpado = 1;

    // El tizne que le quedó se le va yendo.
    hollin = Math.max(0, hollin - dt * 0.05);
    m.hollin = hollin;

    // La explosión manda sobre todo lo de arriba.
    if (!quieto) {
      const u = t - bumDesde;
      if (!estallo && u >= BUM.estalla) {
        estallo = true;
        estallidos++;
        sacudir(SACUDON);
      }
      for (const [k, v] of Object.entries(explosion(u))) if (v !== undefined) (m as unknown as Record<string, unknown>)[k] = v;
      if (u > BUM.estalla) hollin = m.hollin;
      anda = 0;
    }
    return m;
  }

  function aplicar(m: Momento): void {
    ultimo = m;
    const { transform, opacity, d } = marcas(m);
    for (const [nombre, valor] of Object.entries(transform)) p.get(nombre)?.setAttribute('transform', valor);
    for (const [nombre, valor] of Object.entries(opacity)) p.get(nombre)?.setAttribute('opacity', valor);
    p.get('mecha')?.setAttribute('d', d.mecha!);
    p.get('mecha-trenza')?.setAttribute('d', d.mecha!);
    toque?.setAttribute('x', (toqueX + m.x * LUGAR.escala).toFixed(1));
  }

  function pintar(t: number, dt: number): void {
    if (hablarEn !== null && t >= hablarEn) {
      hablarEn = null;
      decir();
    }
    if (esc.quieto()) {
      aplicar(tiznadoQuieto ? AULLA : QUIETO);
      return;
    }
    if (t === 0 && dt === 0) {
      aplicar(QUIETO);
      return;
    }
    aplicar(momento(t, Math.min(dt, 0.1)));
  }

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      tiznadoQuieto = !tiznadoQuieto;
      pintar(t, 0);
      decir();
    } else if (!explotando(t)) {
      encender(t);
      hablarEn = t + DEMORA_FICHA;
    }
  };
  /** Dice su verso, y la página abre la ficha. */
  const decir = (): void => esc.hablar(ID, VERSO[0] + x * LUGAR.escala, VERSO[1]);
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
      if (!esc.quieto()) encender(t);
      return true;
    },
    estado: () => ({ explotando: explotando(esc.reloj()), estallidos, x, mira, hollin: ultimo.hollin }),
  };
}

export const armarDinamita: Armar = (marcos, esc) => armarDinamitaCon(marcos, esc);
