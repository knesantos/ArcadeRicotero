/**
 * La conducta de la bestia pop en el tablado del galpón (`D-73`, decimoquinta vuelta).
 *
 * *"Vamos a brillar, mi amor"*. Está encorvada, con los nudillos en el tablado, y respira pesado.
 * - **La cara no es suya**: tiene cuatro, de gente del galpón, y se le van cambiando. A veces se tapa
 *   con la mano y, cuando la saca, es otra; a veces una se le funde en la siguiente sin que haga nada.
 * - **Mira**: a la silla vacía, a la gente, a ningún lado.
 * - **Busca la luz**: cada tanto estira el brazo de atrás hasta el cono del seguidor —el de la silla,
 *   que no es suyo— y las lentejuelas de esa mano se prenden. No llega a la silla.
 * - **Tocada, brilla**: se endereza, levanta los dos brazos como la gente levanta los puños, el
 *   halo crece, se prenden todos los destellos y las caras le pasan una atrás de otra hasta que se
 *   queda con una. Después se vuelve a encorvar, despacio.
 *
 * Con movimiento reducido queda quieta, encorvada; tocarla le hace decir el verso y le cambia la
 * cara, sin que nada se mueva. Se lleva números (`rig-bestia-pop.ts`) y nada que dibuje.
 */

import { POP, POP_ARMADO as A, type Gesto } from '../../lib/bestiario/rig-bestia-pop.ts';
import { hacia, suave } from './articular.ts';
import type { Armar, Escenario } from './vivos.ts';

const ID = 'la-bestia-pop';

/** Lo que tarda cada gesto en llegar, sostenerse y volver, en segundos. */
export const DURA = {
  tapa: [0.75, 1.3, 0.85],
  busca: [1.2, 1.9, 1.1],
  brilla: [0.5, 2.2, 1.4],
} as const;

/** Lo que tarda una cara en fundirse en la otra, y cada cuánto cambian cuando brilla (no más de tres por segundo). */
const FUNDE = 1.6;
const CARRUSEL = 0.36;

/** El halo de todos los días, que respira, y el de cuando brilla. */
const HALO = { quieto: 0.4, brilla: 1 };

type Modo = 'mira' | 'tapa' | 'busca' | 'brilla';

/**
 * Cuánto va de un gesto: sube con `suave`, se sostiene en 1 y baja. `u` son los segundos desde que
 * empezó y `atraso` lo que llega tarde una pieza que cuelga de otra (el antebrazo, del brazo).
 */
export function avance(u: number, [sube, sostiene, baja]: readonly [number, number, number], atraso = 0): number {
  const v = u - atraso;
  if (v <= 0) return 0;
  if (v < sube) return suave(v / sube);
  if (v < sube + sostiene) return 1;
  if (v < sube + sostiene + baja) return 1 - suave((v - sube - sostiene) / baja);
  return 0;
}

/** Lo que dura un gesto entero. */
export const total = (d: readonly [number, number, number]): number => d[0] + d[1] + d[2];

/** La pose de un cuadro: todo lo que la isla escribe en el títere. */
export interface Pose {
  brazos: readonly [Gesto, Gesto];
  /** Cuánto se endereza (0 encorvada, 1 parada para brillar). */
  sube: number;
  /** Cuánto se inclina hacia la silla (grados). */
  inclina: number;
  /** El aire en el pecho, de -1 a 1. */
  respira: number;
  /** El giro de la cabeza (grados). */
  cabeza: number;
  /** La opacidad de cada cara. */
  caras: readonly number[];
  halo: number;
}

/** La pose sin isla: la del HTML. Encorvada, la primera cara, el halo de siempre. */
export const poseQuieta = (cara = 0): Pose => ({
  brazos: [{ brazo: 0, antebrazo: 0 }, { brazo: 0, antebrazo: 0 }],
  sube: 0,
  inclina: 0,
  respira: 0,
  cabeza: 0,
  caras: Array.from({ length: A.caras }, (_, i) => (i === cara ? 1 : 0)),
  halo: HALO.quieto,
});

const n2 = (v: number): string => v.toFixed(2);

/** Lo que se escribe en cada pieza para una pose: transformaciones y opacidades. */
export function escribir(p: Pose): Record<string, { transform?: string; opacity?: string }> {
  const [cx, cy] = A.cadera;
  const [nx, ny] = A.cuello;
  const salida: Record<string, { transform?: string; opacity?: string }> = {
    cuerpo: {
      transform: `translate(0 ${n2(-p.sube * A.endereza.sube)}) rotate(${n2(p.inclina)} ${cx} ${cy}) translate(${cx} ${cy}) scale(1 ${(1 + p.respira * 0.012).toFixed(4)}) translate(${-cx} ${-cy})`,
    },
    cabeza: { transform: `translate(0 ${n2(-p.sube * 3)}) rotate(${n2(p.cabeza)} ${nx} ${ny})` },
    halo: { opacity: n2(p.halo) },
  };
  p.brazos.forEach((g, i) => {
    const [hx, hy] = A.hombros[i as 0 | 1];
    const [ex, ey] = A.codos[i as 0 | 1];
    salida[`brazo-${i + 1}`] = { transform: `rotate(${n2(g.brazo)} ${hx} ${hy})` };
    salida[`antebrazo-${i + 1}`] = { transform: `rotate(${n2(g.antebrazo)} ${ex} ${ey})` };
  });
  p.caras.forEach((o, i) => (salida[`cara-${i + 1}`] = { opacity: n2(o) }));
  return salida;
}

const mezcla = (a: Gesto, b: Gesto, k: number): Gesto => ({ brazo: a.brazo + (b.brazo - a.brazo) * k, antebrazo: a.antebrazo + (b.antebrazo - a.antebrazo) * k });
const escalado = (g: Gesto, k: number, k2 = k): Gesto => ({ brazo: g.brazo * k, antebrazo: g.antebrazo * k2 });

interface Chispa {
  el: SVGGraphicsElement;
  x: number;
  y: number;
  luz: number;
  parte: string;
  periodo: number;
  fase: number;
  quieta: boolean;
}

export const armarBestiaPop: Armar | null = (marcos: readonly SVGGElement[], esc: Escenario) => {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--bestia-pop')).find(Boolean)!;
  const partes = new Map<string, SVGGraphicsElement>();
  for (const el of g.querySelectorAll<SVGGraphicsElement>('[data-parte]')) partes.set(el.dataset.parte!, el);
  const chispas: Chispa[] = [...g.querySelectorAll<SVGGraphicsElement>('[data-chispa]')].map((el, i) => {
    const nombre = el.dataset.chispa!;
    return {
      el,
      // Van en coordenadas del títere: `data-x`/`data-y` son las del recinto, y son de los ojos.
      x: Number(el.dataset.px),
      y: Number(el.dataset.py),
      luz: Number(el.dataset.luz),
      parte: nombre.replace(/-\d+$/, ''),
      // Cada lentejuela tiene su ritmo: nada de un titilar parejo.
      periodo: 2.4 + ((i * 7.31) % 4.2),
      fase: (i * 3.17) % 5,
      quieta: (el.getAttribute('transform') ?? '').includes('scale(1)'),
    };
  });

  const e = {
    modo: 'mira' as Modo,
    desde: 0,
    cara: 0,
    otra: 0,
    funde: -100,
    cambiada: true,
    carrusel: 0,
    cabeza: 0,
    meta: 0,
    proximaMirada: 2.2,
    proximaTapa: 6 + Math.random() * 5,
    proximaBusca: 13 + Math.random() * 6,
    proximoFundido: 16 + Math.random() * 6,
  };

  const otraCara = (no: number): number => (no + 1 + Math.floor(Math.random() * (A.caras - 1))) % A.caras;

  function empezar(m: Modo, t: number): void {
    e.modo = m;
    e.desde = t;
    e.cambiada = false;
    e.carrusel = t;
  }

  function aplicar(p: Pose): void {
    for (const [nombre, attrs] of Object.entries(escribir(p))) {
      const el = partes.get(nombre);
      if (!el) continue;
      if (attrs.transform !== undefined) el.setAttribute('transform', attrs.transform);
      if (attrs.opacity !== undefined) el.setAttribute('opacity', attrs.opacity);
    }
  }

  function destellar(t: number, k: { busca: number; brilla: number }, quieto: boolean): void {
    chispas.forEach((c, i) => {
      let s: number;
      if (quieto) s = c.quieta ? 1 : 0;
      else {
        const u = (t + c.fase) % c.periodo;
        s = u < 0.32 ? Math.sin((u / 0.32) * Math.PI) * c.luz ** 1.5 : 0;
        if (k.busca > 0 && c.parte.endsWith('-2')) s = Math.max(s, k.busca * (0.55 + 0.45 * Math.sin(t * 8 + i)));
        if (k.brilla > 0) {
          // De adentro para afuera: las del pecho primero, las de las manos al final.
          const lejos = Math.hypot(c.x, c.y + 110) / 140;
          const prende = Math.max(0, Math.min(1, (k.brilla * 1.4 - lejos * 0.4) / 0.6));
          s = Math.max(s, prende * (1.1 + 0.5 * Math.sin(t * 11 + i * 1.7)));
        }
      }
      const gira = quieto ? 0 : (t * 70 + i * 37) % 90;
      c.el.setAttribute('transform', `translate(${c.x} ${c.y}) scale(${n2(s)}) rotate(${n2(gira)})`);
    });
  }

  function pintar(t: number, dt: number): void {
    if (esc.quieto()) {
      aplicar(poseQuieta(e.cara));
      destellar(t, { busca: 0, brilla: 0 }, true);
      return;
    }
    const u = t - e.desde;

    // Lo que decide: un gesto por vez, y los tiempos se corren para que nunca sea un reloj.
    if (e.modo !== 'mira' && u > total(DURA[e.modo])) {
      if (e.modo === 'tapa') e.proximaTapa = t + 12 + Math.random() * 9;
      if (e.modo === 'busca') e.proximaBusca = t + 16 + Math.random() * 10;
      // Después de un gesto respira un rato encorvada: nada de encadenar uno con otro.
      e.proximaTapa = Math.max(e.proximaTapa, t + 3 + Math.random() * 3);
      e.proximaBusca = Math.max(e.proximaBusca, t + 4 + Math.random() * 4);
      e.proximoFundido = Math.max(e.proximoFundido, t + 2.5);
      e.modo = 'mira';
      e.desde = t;
    }
    if (e.modo === 'mira' && t - e.funde > FUNDE + 0.3) {
      if (t > e.proximaTapa) empezar('tapa', t);
      else if (t > e.proximaBusca) empezar('busca', t);
      else if (t > e.proximoFundido && t - e.funde > FUNDE) {
        // Sin taparse: una cara se le funde en la siguiente, como si la pusiera otro.
        e.otra = otraCara(e.cara);
        e.funde = t;
        e.proximoFundido = t + 15 + Math.random() * 9;
      }
    }

    // Las caras: el fundido, el cambio detrás de la mano y el carrusel de cuando brilla.
    const f = (t - e.funde) / FUNDE;
    if (f >= 1 && e.cara !== e.otra) e.cara = e.otra;
    let caras: number[] = Array.from({ length: A.caras }, (_, i) => (i === e.cara ? 1 : 0));
    if (f >= 0 && f < 1) {
      const k = suave(f);
      caras = caras.map((_, i) => (i === e.cara ? 1 - k : i === e.otra ? k : 0));
    }
    const kTapa = e.modo === 'tapa' ? avance(u, DURA.tapa) : 0;
    if (e.modo === 'tapa' && !e.cambiada && u > DURA.tapa[0] + DURA.tapa[1] * 0.45) {
      e.cara = otraCara(e.cara);
      e.otra = e.cara;
      e.cambiada = true;
      caras = caras.map((_, i) => (i === e.cara ? 1 : 0));
    }
    if (e.modo === 'brilla') {
      const fin = DURA.brilla[0] + DURA.brilla[1] * 0.6;
      if (u < fin && t - e.carrusel > CARRUSEL) {
        e.cara = (e.cara + 1) % A.caras;
        e.otra = e.cara;
        e.carrusel = t;
      } else if (u >= fin && !e.cambiada) {
        e.cara = otraCara(e.cara);
        e.otra = e.cara;
        e.cambiada = true;
      }
      caras = caras.map((_, i) => (i === e.cara ? 1 : 0));
    }

    // Los brazos: el antebrazo llega un poco después que el brazo, que es lo que les da peso.
    const kBusca = e.modo === 'busca' ? avance(u, DURA.busca) : 0;
    const kBrilla = e.modo === 'brilla' ? avance(u, DURA.brilla) : 0;
    const ka = (d: readonly [number, number, number]): number => avance(u, d, 0.14);
    const vaiven = (fase: number): Gesto => ({ brazo: Math.sin(t * 0.8 + fase) * 1.6, antebrazo: Math.sin(t * 0.8 + fase + 0.9) * 2 });
    let b0 = vaiven(0);
    let b1 = vaiven(2.1);
    if (e.modo === 'tapa') b0 = mezcla(b0, escalado(A.gestos.tapa, kTapa, ka(DURA.tapa)), Math.min(1, kTapa * 3));
    if (e.modo === 'busca') b1 = mezcla(b1, escalado(A.gestos.busca, kBusca, ka(DURA.busca)), Math.min(1, kBusca * 3));
    if (e.modo === 'brilla') {
      const kb = ka(DURA.brilla);
      b0 = mezcla(b0, escalado(A.gestos.brilla[0], kBrilla, kb), Math.min(1, kBrilla * 3));
      b1 = mezcla(b1, escalado(A.gestos.brilla[1], kBrilla, kb), Math.min(1, kBrilla * 3));
    }

    // La cabeza: mira la silla, la gente o nada; se agacha detrás de la mano; cuando brilla, se levanta.
    if (t > e.proximaMirada) {
      const r = Math.random();
      e.meta = r < 0.35 ? 6 : r < 0.6 ? -4 : r < 0.85 ? 0 : 2.5;
      e.proximaMirada = t + 2.4 + Math.random() * 3.2;
    }
    const meta = e.modo === 'tapa' ? -5 * kTapa : e.modo === 'busca' ? 7 * kBusca : e.modo === 'brilla' ? A.endereza.cabeza * kBrilla : e.meta;
    e.cabeza = hacia(e.cabeza, meta, dt * (e.modo === 'mira' ? 7 : 30));

    aplicar({
      brazos: [b0, b1],
      sube: kBrilla,
      inclina: 3 * kBusca - 2 * kTapa,
      respira: Math.sin(t * 1.15) * (1 - kBrilla) + kBrilla,
      cabeza: e.cabeza,
      caras,
      halo: HALO.quieto + 0.06 * Math.sin(t * 1.15) + 0.14 * kBusca + (HALO.brilla - HALO.quieto) * kBrilla,
    });
    destellar(t, { busca: kBusca, brilla: kBrilla }, false);
  }

  function reaccionar(id: string, t: number): boolean {
    if (id !== ID) return false;
    if (esc.quieto()) {
      // Quieta no se mueve: nada más se le cambia la cara.
      e.cara = otraCara(e.cara);
      e.otra = e.cara;
      pintar(t, 0);
      return true;
    }
    if (e.modo === 'brilla' && t - e.desde < DURA.brilla[0] + DURA.brilla[1]) e.desde = Math.max(e.desde, t - DURA.brilla[0] - 0.4);
    else empezar('brilla', t);
    e.funde = -100;
    return true;
  }

  const tocar = (): void => {
    const t = esc.reloj();
    reaccionar(ID, t);
    // El bocadillo, arriba de la melena: ahí no le tapa la cara a nadie, ni la silla.
    esc.hablar(ID, POP.x + 8 * POP.escala, POP.piso - 214 * POP.escala);
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
