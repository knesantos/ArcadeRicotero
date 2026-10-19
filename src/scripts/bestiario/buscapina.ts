/**
 * La conducta del Capitán Buscapina en la nieve de Cybersiberia (`D-73`, decimoquinta vuelta).
 *
 * *"El Capitán Buscapina salda deudas. / Sentado, en bolas, watcheando la tele"*. Está echado sobre el
 * brazo izquierdo, con las boletas bajo la palma, la rodilla derecha arriba y el control colgando.
 * - **Mira la tele**, y la luz de la pantalla le titila encima: nunca pareja, a veces se corta.
 * - **Respira**, y en el frío cada exhalación se le hace vaho, que sube para el lado de la tele.
 * - **Cambia de canal**: levanta el control, la pantalla se corta y la luz que le pega es otra. Cuando
 *   agarra el partido (*"donde se matan, hoy, el pincha y los canallas"*) la luz se le pone tibia, de
 *   reflector de cancha, y se echa un poco para adelante. Al rato vuelve a la tele de siempre.
 * - **El costado**: cada tanto se agarra debajo de las costillas y se dobla, despacio. Es el hígado del
 *   cómic de Pinamar (`RES-21`), el de la Buscapina.
 * - **La nieve se le junta en los hombros**, y cuando ya tiene mucha tirita y se la sacude.
 * - **Tocado, salda la deuda**: se da vuelta por encima del hombro, te mira, levanta la mano de las
 *   boletas y te tira una para atrás sin levantarse. La boleta cae en la nieve, de tu lado, y la nieve
 *   la va tapando. Después vuelve a la tele.
 *
 * Con movimiento reducido no se mueve nada: tocarlo le hace decir el verso y lo deja mirándote por
 * encima del hombro (o lo vuelve a la tele). Se lleva números (`rig-buscapina.ts`) y nada que dibuje.
 */

import { BUSCA, BUSCA_ARMADO as A, SUELTA, manoCon, rotar, vuelo, type Gesto, type P } from '../../lib/bestiario/rig-buscapina.ts';
import { hacia, suave } from './articular.ts';
import type { Armar, Escenario } from './vivos.ts';

const ID = 'el-capitan-buscapina';

/** Lo que tarda cada gesto en llegar, sostenerse y volver, en segundos. */
export const DURA = {
  canal: [0.6, 1.3, 0.8],
  costado: [0.9, 1.6, 1.2],
  tirita: [0.15, 0.7, 0.25],
} as const;

/**
 * El toque, en segundos desde que lo tocan: se da vuelta, sube la mano, la suelta, baja la mano, te
 * sigue mirando un rato y vuelve a la tele.
 */
export const PAGA = { vuelve: 0.5, sube: [0.3, 1.1], suelta: 1.25, vuela: 0.9, baja: [1.4, 2.3], mira: 2.9, vuelveALaTele: 3.5 } as const;

/** Lo que tarda la nieve en volver a juntarse en los hombros (segundos) y lo que tarda la boleta en taparse. */
const JUNTA = 38;
const TAPA = 9;

type Modo = 'mira' | 'canal' | 'costado' | 'tirita' | 'paga';

/** Cuánto va de un gesto: sube con `suave`, se sostiene en 1 y baja. `atraso` es lo que llega tarde lo que cuelga. */
export function avance(u: number, [sube, sostiene, baja]: readonly [number, number, number], atraso = 0): number {
  const v = u - atraso;
  if (v <= 0) return 0;
  if (v < sube) return suave(v / sube);
  if (v < sube + sostiene) return 1;
  if (v < sube + sostiene + baja) return 1 - suave((v - sube - sostiene) / baja);
  return 0;
}

export const total = (d: readonly [number, number, number]): number => d[0] + d[1] + d[2];

/** La pose de un cuadro: todo lo que la isla escribe en el títere. */
export interface Pose {
  brazos: readonly [Gesto, Gesto];
  /** Cuánto se echa la espalda (grados; positivo, para la derecha). */
  inclina: number;
  /** El aire en el pecho, de -1 a 1. */
  respira: number;
  /** El temblor del frío, en unidades del títere. */
  tirita: number;
  /** El giro de la cabeza (grados). */
  cabeza: number;
  /** Cuánto se dio vuelta a mirarte: 0 mira la tele, 1 te mira a vos. */
  vuelta: number;
  /** La nieve en los hombros, de 0 a 1. */
  nieve: number;
  /** El vaho: dónde está (en el títere), cuánto se abrió y cuánto se ve. */
  vaho: { x: number; y: number; s: number; o: number };
  /** La boleta que vuela: dónde, cuánto giró y cuánto se ve. */
  boleta: { x: number; y: number; giro: number; o: number };
  /** La luz de la tele y la del partido. */
  luz: number;
  cancha: number;
}

const [BX, BY] = A.boca;

/** La pose sin isla: la del HTML. Mira la tele, la luz de siempre, la nieve a medio juntar. */
export const poseQuieta = (vuelta = 0): Pose => ({
  brazos: [{ brazo: 0, antebrazo: 0 }, { brazo: 0, antebrazo: 0 }],
  inclina: 0,
  respira: 0,
  tirita: 0,
  cabeza: 0,
  vuelta,
  nieve: 0.6,
  vaho: { x: BX + 10, y: BY - 6, s: 1, o: 0 },
  boleta: { x: 0, y: 0, giro: 0, o: 0 },
  luz: 0.6,
  cancha: 0,
});

const n2 = (v: number): string => v.toFixed(2);

/** Lo que se escribe en cada pieza para una pose: transformaciones y opacidades. */
export function escribir(p: Pose): Record<string, { transform?: string; opacity?: string }> {
  const [ax, ay] = A.asiento;
  const [cx, cy] = A.cuello;
  const salida: Record<string, { transform?: string; opacity?: string }> = {
    espalda: {
      transform: `translate(${n2(p.tirita)} 0) rotate(${n2(p.inclina)} ${ax} ${ay}) translate(${ax} ${ay}) scale(1 ${(1 + p.respira * 0.012).toFixed(4)}) translate(${-ax} ${-ay})`,
    },
    cabeza: { transform: `rotate(${n2(p.cabeza)} ${cx} ${cy})` },
    nuca: { opacity: n2(1 - p.vuelta) },
    vuelta: { opacity: n2(p.vuelta) },
    nieve: { opacity: n2(p.nieve) },
    vaho: { transform: `translate(${n2(p.vaho.x)} ${n2(p.vaho.y)}) scale(${n2(p.vaho.s)})`, opacity: n2(p.vaho.o) },
    boleta: { transform: `translate(${n2(p.boleta.x)} ${n2(p.boleta.y)}) rotate(${n2(p.boleta.giro)})`, opacity: n2(p.boleta.o) },
    luz: { opacity: n2(p.luz) },
    'luz-cancha': { opacity: n2(p.cancha) },
  };
  p.brazos.forEach((g, i) => {
    const [hx, hy] = A.hombros[i as 0 | 1];
    const [ex, ey] = A.codos[i as 0 | 1];
    salida[`brazo-${i + 1}`] = { transform: `rotate(${n2(g.brazo)} ${hx} ${hy})` };
    salida[`antebrazo-${i + 1}`] = { transform: `rotate(${n2(g.antebrazo)} ${ex} ${ey})` };
  });
  return salida;
}

const mezcla = (a: Gesto, b: Gesto, k: number): Gesto => ({ brazo: a.brazo + (b.brazo - a.brazo) * k, antebrazo: a.antebrazo + (b.antebrazo - a.antebrazo) * k });
const QUIETO: Gesto = { brazo: 0, antebrazo: 0 };

/**
 * La luz de una tele: nunca pareja. Tres titileos que no coinciden nunca, y cada tanto un bajón, que
 * es un corte de plano.
 */
export function titila(t: number): number {
  const ondas = 0.06 * Math.sin(t * 2.3) + 0.05 * Math.sin(t * 5.7 + 1.3) + 0.04 * Math.sin(t * 13.1 + 0.4);
  const corte = Math.sin(t * 0.83) * Math.sin(t * 1.37) > 0.82 ? -0.18 : 0;
  return ondas + corte;
}

/** Dónde está la mano izquierda con un gesto, con la espalda echada como está: la boleta va ahí. */
const manoEnElTitere = (g: Gesto, inclina: number): P => rotar(manoCon(0, g), A.asiento, inclina);

export const armarBuscapina: Armar | null = (marcos: readonly SVGGElement[], esc: Escenario) => {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--buscapina')).find(Boolean)!;
  const partes = new Map<string, SVGGraphicsElement>();
  for (const el of g.querySelectorAll<SVGGraphicsElement>('[data-parte]')) partes.set(el.dataset.parte!, el);

  const e = {
    modo: 'mira' as Modo,
    desde: 0,
    /** Qué pasa la tele: la de siempre o el partido. */
    partido: false,
    cambiado: false,
    nieve: 0.6,
    cabeza: 0,
    meta: 0,
    vuelta: 0,
    respiro: 0,
    periodo: 3.8,
    exhala: -100,
    boleta: -100,
    proximaMirada: 2.5,
    proximoCanal: 9 + Math.random() * 6,
    proximoCostado: 20 + Math.random() * 10,
    proximoTirita: 26 + Math.random() * 8,
    antes: 0,
  };

  function empezar(m: Modo, t: number): void {
    e.modo = m;
    e.desde = t;
    e.cambiado = false;
  }

  function aplicar(p: Pose): void {
    for (const [nombre, attrs] of Object.entries(escribir(p))) {
      const el = partes.get(nombre);
      if (!el) continue;
      if (attrs.transform !== undefined) el.setAttribute('transform', attrs.transform);
      if (attrs.opacity !== undefined) el.setAttribute('opacity', attrs.opacity);
    }
  }

  function pintar(t: number, dt: number): void {
    if (esc.quieto() || dt === 0) {
      aplicar(poseQuieta(e.vuelta > 0.5 ? 1 : 0));
      return;
    }
    const u = t - e.desde;

    // Lo que decide: un gesto por vez, con los tiempos corridos para que nunca sea un reloj.
    const dura = e.modo === 'paga' ? PAGA.vuelveALaTele : e.modo === 'mira' ? Infinity : total(DURA[e.modo]);
    if (u > dura) {
      if (e.modo === 'canal') e.proximoCanal = t + (e.partido ? 18 + Math.random() * 12 : 12 + Math.random() * 10);
      if (e.modo === 'costado') e.proximoCostado = t + 22 + Math.random() * 16;
      if (e.modo === 'tirita') e.proximoTirita = t + 18 + Math.random() * 14;
      // Después de un gesto se queda mirando un rato: nada de encadenar uno con otro.
      e.proximoCanal = Math.max(e.proximoCanal, t + 3 + Math.random() * 3);
      e.proximoCostado = Math.max(e.proximoCostado, t + 5 + Math.random() * 4);
      e.proximoTirita = Math.max(e.proximoTirita, t + 4 + Math.random() * 3);
      e.modo = 'mira';
      e.desde = t;
    }
    if (e.modo === 'mira') {
      if (e.nieve > 0.95 || t > e.proximoTirita) empezar('tirita', t);
      else if (t > e.proximoCanal) empezar('canal', t);
      else if (t > e.proximoCostado) empezar('costado', t);
    }

    // La nieve se le junta despacio; cuando tirita, se le cae de golpe.
    if (e.modo === 'tirita' && u > DURA.tirita[0] + 0.1) e.nieve = Math.max(0.05, e.nieve - dt * 3);
    else e.nieve = Math.min(1, e.nieve + dt / JUNTA);

    // Los brazos: el antebrazo llega un poco después que el brazo, que es lo que les da peso.
    const k = (d: readonly [number, number, number], atraso = 0): number => avance(e.modo === 'mira' || e.modo === 'paga' ? -1 : u, d, atraso);
    let b0: Gesto = { brazo: Math.sin(t * 0.7) * 0.5, antebrazo: 0 };
    let b1: Gesto = { brazo: Math.sin(t * 0.9 + 1) * 1.2, antebrazo: Math.sin(t * 1.3) * 3 };
    let inclina = 0;
    let tirita = 0;
    let metaCabeza = e.meta;
    if (e.modo === 'canal') {
      const kb = k(DURA.canal);
      b1 = mezcla(b1, { brazo: A.gestos.canal.brazo * kb, antebrazo: A.gestos.canal.antebrazo * k(DURA.canal, 0.12) }, Math.min(1, kb * 3));
      // El clic: arriba del todo, la pantalla se corta y cambia lo que pasa.
      if (!e.cambiado && u > DURA.canal[0] + 0.25) {
        e.partido = !e.partido;
        e.cambiado = true;
      }
      metaCabeza = 2;
    }
    if (e.modo === 'costado') {
      const kc = k(DURA.costado);
      b1 = mezcla(b1, { brazo: A.gestos.costado.brazo * kc, antebrazo: A.gestos.costado.antebrazo * k(DURA.costado, 0.15) }, Math.min(1, kc * 3));
      inclina = A.inclina * kc;
      metaCabeza = 6 * kc;
    }
    if (e.modo === 'tirita') {
      const kt = k(DURA.tirita);
      tirita = Math.sin(t * 52) * A.tirita * kt + Math.sin(t * 31) * A.tirita * 0.5 * kt;
      b0 = { brazo: b0.brazo + Math.sin(t * 47) * 0.8 * kt, antebrazo: 0 };
      metaCabeza = Math.sin(t * 40) * 2 * kt;
    }
    if (e.partido && e.modo !== 'costado') inclina += 1.4;

    // El toque: se da vuelta, sube la mano de las boletas, suelta una por encima del hombro y vuelve.
    let vuelta = 0;
    if (e.modo === 'paga') {
      vuelta = u < PAGA.vuelve ? suave(u / PAGA.vuelve) : u < PAGA.mira ? 1 : 1 - suave((u - PAGA.mira) / (PAGA.vuelveALaTele - PAGA.mira));
      const sube = suave((u - PAGA.sube[0]) / (PAGA.sube[1] - PAGA.sube[0]));
      const latigo = u < PAGA.sube[1] ? 0 : u < PAGA.suelta ? suave((u - PAGA.sube[1]) / (PAGA.suelta - PAGA.sube[1])) : 1;
      const baja = suave((u - PAGA.baja[0]) / (PAGA.baja[1] - PAGA.baja[0]));
      const arriba = mezcla(A.gestos.paga, SUELTA, latigo);
      b0 = mezcla(QUIETO, arriba, sube * (1 - baja));
      metaCabeza = -4 * vuelta;
      if (u >= PAGA.suelta && e.boleta < e.desde) e.boleta = t;
    }
    e.vuelta = vuelta;

    // La cabeza: mira la tele, y se va un poco con lo que pasa.
    if (t > e.proximaMirada) {
      e.meta = (Math.random() - 0.4) * 5;
      e.proximaMirada = t + 2.8 + Math.random() * 3.5;
    }
    e.cabeza = hacia(e.cabeza, metaCabeza, dt * (e.modo === 'mira' ? 5 : 26));

    // La respiración: cada exhalación larga un vaho, que sube para el lado de la tele y se abre.
    e.respiro += (dt / e.periodo) * Math.PI * 2;
    if (e.respiro > Math.PI * 2) {
      e.respiro -= Math.PI * 2;
      e.periodo = 3.2 + Math.random() * 1.6 - (e.modo === 'costado' ? 1 : 0);
      e.exhala = t;
    }
    const v = (t - e.exhala) / 1.8;
    const [vx, vy] = vuelta > 0.5 ? [-38, -138] : [BX + 8, BY - 4];
    const vaho = v >= 0 && v < 1
      ? { x: vx + v * (vuelta > 0.5 ? -8 : 10), y: vy - v * 16, s: 0.7 + v * 1.1, o: Math.min(1, v * 6) * (1 - v) * 0.9 }
      : { x: vx, y: vy, s: 0.7, o: 0 };

    // La boleta: en la mano mientras sube, volando cuando la suelta, y en la nieve hasta que la tapa.
    let boleta = { x: 0, y: 0, giro: 0, o: 0 };
    if (e.modo === 'paga' && u >= PAGA.sube[0] && u < PAGA.suelta) {
      const [hx, hy] = manoEnElTitere(b0, inclina);
      boleta = { x: hx, y: hy - 4, giro: -30 * suave((u - PAGA.sube[0]) / 0.6), o: Math.min(1, (u - PAGA.sube[0]) * 5) };
    } else if (t - e.boleta >= 0) {
      const kv = (t - e.boleta) / PAGA.vuela;
      const { p, giro } = vuelo(kv);
      boleta = { x: p[0], y: p[1], giro: giro - 30, o: kv < 1 ? 1 : Math.max(0, 1 - (kv - 1) * (PAGA.vuela / TAPA)) };
    }

    // La luz: la de la tele titila siempre; cuando cambia de canal se corta un instante, y el partido es tibio.
    const corte = e.modo === 'canal' && u > DURA.canal[0] + 0.15 && u < DURA.canal[0] + 0.45 ? 0.15 : 1;
    const tv = 0.6 + titila(t);
    const cancha = e.partido ? 0.75 + 0.15 * Math.sin(t * 3.1) * Math.sin(t * 1.7) : 0;
    aplicar({
      brazos: [b0, b1],
      inclina,
      respira: Math.sin(e.respiro),
      tirita,
      cabeza: e.cabeza,
      vuelta,
      nieve: e.nieve,
      vaho,
      boleta,
      luz: Math.max(0, tv * corte * (e.partido ? 0.35 : 1)),
      cancha: cancha * corte,
    });
  }

  function reaccionar(id: string, t: number): boolean {
    if (id !== ID) return false;
    if (esc.quieto()) {
      // Quieto no se mueve: nada más te mira por encima del hombro, o vuelve a la tele.
      e.vuelta = e.vuelta > 0.5 ? 0 : 1;
      pintar(t, 0);
      return true;
    }
    if (e.modo !== 'paga' || t - e.desde > PAGA.mira) empezar('paga', t);
    return true;
  }

  const tocar = (): void => {
    const t = esc.reloj();
    reaccionar(ID, t);
    // El bocadillo, arriba de la gorra: ahí tapa la tele un rato, que es lo que él mira.
    esc.hablar(ID, BUSCA.x + A.craneo.centro[0] * BUSCA.escala, BUSCA.piso - 206 * BUSCA.escala);
  };
  g.addEventListener('click', tocar);
  g.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });

  pintar(0, 0);
  return { mover: pintar, reaccionar };
};
