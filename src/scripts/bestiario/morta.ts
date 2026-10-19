/**
 * El Morta (`D-73`, decimoquinta vuelta), parado en el templo de Momo.
 *
 * *"Va perdiendo aceite, relincha de más"*, y *"apenas se mantiene en pie"*. Quieto hace cuatro cosas,
 * cada una con su tiempo, que no se repiten iguales:
 *
 * - **Se bambolea.** Está escorado a estribor y no se para derecho: se va para un lado, se pasa, vuelve,
 *   como un títere con peso. La mano que cuelga se le queda atrás del cuerpo.
 * - **Gotea aceite.** Debajo del toallón se le forma una gota negra que engorda, se suelta y cae en la
 *   mancha del piso, que crece un poco con cada una (y se va secando despacio).
 * - **Tartamudea** (*"ta-tartamudea"*): la quijada le tiembla, ta-ta-ta, las orejas para atrás, y no le
 *   sale nada.
 * - **Se sube el toallón**, que se le resbala de a poco: lo agarra del nudo y de un tirón lo sube.
 *
 * Y mira: a vos, al medallón que se mece, a la bailarina, a su mancha en el piso, a los focos. Parpadea
 * despacio, con los párpados a media asta del gin. Mueve la cola y las orejas.
 *
 * **Tocado, relincha de más**: toma aire, tira la cabeza para arriba con la boca abierta del todo (el
 * grito de la cara del interior de *Momo Sampler*), le tiembla el cuerpo, se le escapa un chorro de
 * aceite por debajo del toallón, brinca y cae escorado a estribor (*"con sus gambas de poli brinca y cae
 * levemente hacia su estribor"*). Y dice su verso. Con movimiento reducido no se mueve nada: tocarlo lo
 * pasa de una pose quieta a la otra (de pie, relinchando) y dice su verso.
 *
 * Se lleva números (`rig-morta.ts`) y nada que dibuje: la pose sale de la misma cuenta que la del HTML.
 */

import { POSES, VERSO, caminoDelChorro, entre, gota, mancha, transformes, type Pose, type Punto } from '../../lib/bestiario/rig-morta.ts';
import { hacia, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-morta';

export type Modo = 'quieto' | 'relincha';
type Mirada = 'vos' | 'medallon' | 'bailarina' | 'mancha' | 'focos';

/** Cuánto tardan las cosas, en segundos: lo que se repite varía entre el mínimo y el máximo. */
export const TIEMPOS = {
  bamboleo: [1.4, 3.8],
  tartamudeo: [7, 15],
  tartamudea: [0.7, 1.3],
  resbala: 0.5,
  sube: 0.4,
  gota: [1.8, 5],
  cae: 0.32,
  mirada: [1.3, 3.6],
  parpadeo: [2.6, 6.5],
  orejas: [2.4, 6],
  cola: [3, 8],
  relincha: 3.2,
} as const;

/** Para dónde se escora: siempre a estribor, más o menos. Negativo es a su derecha. */
export const ESCORA = { min: -9, max: -1.5, rigidez: 7, freno: 2.2 } as const;

/**
 * Adónde mira, con la pupila (en la cabeza, que está girada) y un poco con la cabeza. Calculado con la
 * cabeza de la pose quieta: el medallón está arriba a la izquierda, la bailarina abajo a la izquierda,
 * la mancha abajo y los focos arriba.
 */
export const MIRADAS: Readonly<Record<Mirada, { mira: Punto; cabeza: number }>> = {
  vos: { mira: POSES['de-pie'].mira, cabeza: 0 },
  medallon: { mira: [-0.3, -0.95], cabeza: 7 },
  bailarina: { mira: [-0.95, -0.35], cabeza: -4 },
  mancha: { mira: [-0.9, 0.5], cabeza: -10 },
  focos: { mira: [0.75, -0.65], cabeza: 9 },
};

/**
 * El relincho, en el tiempo `u` desde que lo tocaron: cuánto de la pose de relinchar tiene (`k`), si toma
 * aire antes, el temblor, el chorro (de 0 a 1 mientras está en el aire), el brinco y la caída.
 */
export function relincho(u: number): { toma: number; k: number; tiembla: number; chorro: number; salto: number; cae: boolean } {
  const toma = u < 0.3 ? suave(u / 0.25) : u < 0.45 ? 1 - suave((u - 0.3) / 0.15) : 0;
  const k = u < 0.25 ? 0 : u < 0.45 ? suave((u - 0.25) / 0.2) : u < 1.55 ? 1 : u < 2.4 ? 1 - suave((u - 1.55) / 0.85) : 0;
  const tiembla = u > 0.45 && u < 1.5 ? 1 : 0;
  const chorro = u > 0.4 && u < 1.3 ? (u - 0.4) / 0.9 : 0;
  const salto = u > 1.55 && u < 2.05 ? Math.sin((Math.PI * (u - 1.55)) / 0.5) : 0;
  return { toma, k, tiembla, chorro, salto, cae: u >= 2.05 };
}

export interface Estado {
  modo: Modo;
  escora: number;
  toallon: number;
  mancha: number;
  gotas: number;
  tartamudeos: number;
  subidas: number;
  mirada: Mirada;
}

/** Arma al Morta con un azar que se puede fijar (el test lo fija). La isla usa `armarMorta`. */
export function armarMortaCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const g = marcos.map((m) => m.querySelector<SVGGElement>('.titere--morta')).find((x): x is SVGGElement => !!x);
  const nada: Estado = { modo: 'quieto', escora: 0, toallon: 0, mancha: 1, gotas: 0, tartamudeos: 0, subidas: 0, mirada: 'vos' };
  if (!g) return { mover: () => {}, reaccionar: () => false, estado: () => nada };
  const titere: SVGGElement = g;
  const p = new Map<string, Element>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGElement>('[data-parte]')) p.set(el.dataset.parte!, el);
  const entreAzar = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();
  const Q = POSES['de-pie'];

  let modo: Modo = 'quieto';
  let desde = 0;
  // El bamboleo: un resorte que va detrás de una meta que cambia.
  let escora: number = Q.escora;
  let vel = 0;
  let meta: number = Q.escora;
  let proximaMeta = entreAzar(TIEMPOS.bamboleo);
  // El toallón se resbala; cuando se resbaló bastante, lo sube de un tirón.
  let toallon = 0;
  let subeDesde = -10;
  let subeDe = 0;
  let subidas = 0;
  // La gota: se forma durante `forma` segundos, y cae.
  let gotaDesde = -0.55 * TIEMPOS.gota[0];
  let gotaForma: number = TIEMPOS.gota[0];
  let gotas = 0;
  let manchaK = 1;
  // El tartamudeo.
  let proximoTartamudeo = entreAzar(TIEMPOS.tartamudeo);
  let tartamudeaDesde = -10;
  let tartamudeaDura = 1;
  let tartamudeos = 0;
  // La mirada, el parpadeo, las orejas y la cola.
  let mirada: Mirada = 'vos';
  let proximaMirada = entreAzar(TIEMPOS.mirada);
  let parpadeo = entreAzar(TIEMPOS.parpadeo);
  let lento = false;
  let orejaDesde = -10;
  let proximaOreja = entreAzar(TIEMPOS.orejas);
  let colaDesde = -10;
  let proximaCola = entreAzar(TIEMPOS.cola);
  // Lo que se suaviza de cuadro en cuadro: arranca en la pose quieta.
  const cara = { mira: [Q.mira[0], Q.mira[1]] as [number, number], cabeza: 0 };
  // Con movimiento reducido: cuál de las dos poses quietas está a la vista.
  let relinchaQuieto = false;

  const relinchar = (t: number): void => {
    if (modo === 'relincha' && t - desde < 1.5) return;
    modo = 'relincha';
    desde = t;
  };

  function decidir(t: number, dt: number): void {
    // El bamboleo: un resorte flojo, que se pasa y vuelve.
    if (t > proximaMeta) {
      meta = ESCORA.min + (ESCORA.max - ESCORA.min) * azar();
      proximaMeta = t + entreAzar(TIEMPOS.bamboleo);
    }
    const acel = ESCORA.rigidez * (meta - escora) - ESCORA.freno * vel;
    vel += acel * dt;
    escora += vel * dt;

    // El toallón: se resbala, y cuando llega abajo lo sube de un tirón.
    const us = t - subeDesde;
    if (us < TIEMPOS.sube) toallon = subeDe * (1 - suave(us / TIEMPOS.sube));
    else if (modo === 'quieto') {
      toallon = Math.min(7, toallon + TIEMPOS.resbala * dt * (0.6 + azar() * 0.8));
      if (toallon >= 7 || (toallon > 4.5 && azar() < dt * 0.15)) {
        subeDesde = t;
        subeDe = toallon;
        subidas++;
      }
    }

    // La gota.
    const ug = t - gotaDesde;
    if (ug > gotaForma + TIEMPOS.cae) {
      gotas++;
      manchaK = Math.min(1.35, manchaK + 0.014);
      gotaDesde = t;
      gotaForma = entreAzar(TIEMPOS.gota);
    }
    // La mancha se va secando, despacio.
    manchaK = Math.max(1, manchaK - dt * 0.004);

    if (modo === 'quieto') {
      if (t > proximoTartamudeo) {
        tartamudeaDesde = t;
        tartamudeaDura = entreAzar(TIEMPOS.tartamudea);
        proximoTartamudeo = t + tartamudeaDura + entreAzar(TIEMPOS.tartamudeo);
        tartamudeos++;
      }
      if (t > proximaMirada) {
        const r = azar();
        mirada = r < 0.36 ? 'vos' : r < 0.6 ? 'medallon' : r < 0.76 ? 'bailarina' : r < 0.9 ? 'mancha' : 'focos';
        proximaMirada = t + entreAzar(TIEMPOS.mirada);
      }
    } else {
      const u = t - desde;
      // Cae del brinco: escorado a estribor más que nunca, y de ahí el resorte lo vuelve.
      if (u >= 2.05 && u - dt < 2.05) {
        escora = Math.min(escora, -11);
        vel = -6;
        meta = -6;
        proximaMeta = t + 1.6;
      }
      if (u > 0.4 && u - dt <= 1.3 && u > 1.3) manchaK = Math.min(1.45, manchaK + 0.2);
      if (u > TIEMPOS.relincha) {
        modo = 'quieto';
        mirada = 'vos';
        proximaMirada = t + 1.2;
        proximoTartamudeo = Math.max(proximoTartamudeo, t + 3);
      }
    }
    if (t > proximaOreja) {
      orejaDesde = t;
      proximaOreja = t + entreAzar(TIEMPOS.orejas);
    }
    if (t > proximaCola) {
      colaDesde = t;
      proximaCola = t + entreAzar(TIEMPOS.cola);
    }
    if (t > parpadeo + (lento ? 0.5 : 0.16)) {
      parpadeo = t + entreAzar(TIEMPOS.parpadeo);
      lento = azar() < 0.3;
    }
  }

  function pintar(t: number, dt: number): void {
    if (esc.quieto()) {
      // Las dos poses quietas, tal cual: la de pie es la del HTML.
      if (relinchaQuieto) aplicar(POSES.relincha, 0.45, 0, 1.15);
      else aplicar(Q, 0, 0.55, 1);
      return;
    }
    const paso = Math.min(dt, 0.1);
    if (paso > 0) decidir(t, paso);

    const r = modo === 'relincha' ? relincho(t - desde) : { toma: 0, k: 0, tiembla: 0, chorro: 0, salto: 0, cae: false };
    // La base: de pie, con lo que respira, el bamboleo y el toallón.
    const respira = (1 - Math.cos(t * 1.7)) / 2;
    const ut = t - tartamudeaDesde;
    const tartamudea = modo === 'quieto' && ut >= 0 && ut < tartamudeaDura ? Math.abs(Math.sin(ut * Math.PI * 2 * 5.5)) * Math.min(1, ut / 0.1, (tartamudeaDura - ut) / 0.15) : 0;
    const enTartamudeo = modo === 'quieto' && ut >= 0 && ut < tartamudeaDura ? 1 : 0;
    const uo = t - orejaDesde;
    const oreja = uo >= 0 && uo < 0.45 ? Math.sin((Math.PI * uo) / 0.45) : 0;
    const uc = t - colaDesde;
    const cola = uc >= 0 && uc < 1.4 ? Math.sin(uc * Math.PI * 2 * 1.4) * Math.sin((Math.PI * uc) / 1.4) : 0;
    // La cara: adónde mira (suavizado), y un cabeceo de borracho que no para.
    const m = MIRADAS[modo === 'quieto' ? mirada : 'vos'];
    cara.mira = [hacia(cara.mira[0], m.mira[0], paso * 4), hacia(cara.mira[1], m.mira[1], paso * 4)];
    cara.cabeza = hacia(cara.cabeza, m.cabeza, paso * 30);
    const cabecea = Math.sin(t * 0.9) * Math.sin(t * 0.37) * 2.2;
    const ciego = t > parpadeo && t < parpadeo + (lento ? 0.5 : 0.16);
    // La mano que cuelga se queda atrás del bamboleo.
    const [m1x, m1y] = Q.manos[0];
    const tirones = t - subeDesde < TIEMPOS.sube ? Math.sin((Math.PI * (t - subeDesde)) / TIEMPOS.sube) : 0;
    const base: Pose = {
      ...Q,
      escora: escora + r.tiembla * Math.sin(t * 46) * 1.4,
      salto: r.salto * 10,
      torso: Q.torso + respira * 0.6 + tirones * 2.4 + r.toma * 2,
      respira: Math.max(respira * 0.6, r.toma),
      cabeza: cara.cabeza + cabecea + tartamudea * 2.5 - r.toma * 8,
      quijada: tartamudea * 0.24,
      orejas: Q.orejas - oreja * 14 - enTartamudeo * 10 - r.toma * 12,
      toallon,
      manos: [[m1x + vel * 1.6, m1y + Math.abs(vel) * 0.4], [Q.manos[1][0], Q.manos[1][1] + toallon]],
      patas: [r.salto * 9, -r.salto * 9],
      cola: cola * 9,
      mira: [cara.mira[0], cara.mira[1]],
      parpado: ciego ? 1 : Q.parpado + enTartamudeo * 0.15,
    };
    // El relincho encima: la pose de relinchar, con la quijada que tiembla abierta.
    const pose = r.k > 0 ? entre(base, { ...POSES.relincha, escora: base.escora, salto: base.salto, patas: base.patas, toallon: base.toallon, manos: [POSES.relincha.manos[0], base.manos[1]] }, r.k) : base;
    if (r.k > 0) pose.quijada = Math.max(pose.quijada, r.k * (0.86 + Math.sin(t * 38) * 0.14));
    // La gota, en su ciclo.
    const ug = t - gotaDesde;
    const crece = Math.min(1, ug / gotaForma);
    const cae = ug > gotaForma ? (ug - gotaForma) / TIEMPOS.cae : 0;
    aplicar(pose, r.chorro, crece, manchaK, cae);
  }

  function aplicar(pose: Pose, chorro: number, crece: number, manchaK: number, cae = 0): void {
    for (const [nombre, valor] of Object.entries(transformes(pose))) p.get(nombre)?.setAttribute('transform', valor);
    for (const n of ['chorro', 'chorro-brillo']) {
      p.get(n)?.setAttribute('d', caminoDelChorro(chorro, pose, n === 'chorro-brillo'));
      p.get(n)?.setAttribute('opacity', chorro > 0 ? '1' : '0');
    }
    // La gota cae derecho, al aire: con su forma de gota mientras se forma y estirada al caer.
    p.get('gota')?.setAttribute('transform', gota(pose, crece, Math.min(1, cae * cae)));
    p.get('gota')?.setAttribute('opacity', cae >= 1 ? '0' : '1');
    p.get('mancha')?.setAttribute('transform', mancha(manchaK));
  }

  const tocar = (): void => {
    const t = esc.reloj();
    if (esc.quieto()) {
      relinchaQuieto = !relinchaQuieto;
      pintar(t, 0);
    } else relinchar(t);
    esc.hablar(ID, VERSO[0], VERSO[1]);
  };
  titere.addEventListener('click', tocar);
  titere.addEventListener('keydown', (ev) => {
    const k = (ev as KeyboardEvent).key;
    if (k === 'Enter' || k === ' ') {
      ev.preventDefault();
      tocar();
    }
  });

  pintar(0, 0);
  return {
    mover: pintar,
    reaccionar: (id, t) => {
      if (id !== ID) return false;
      if (!esc.quieto()) relinchar(t);
      return true;
    },
    estado: () => ({ modo, escora, toallon, mancha: manchaK, gotas, tartamudeos, subidas, mirada }),
  };
}

export const armarMorta: Armar = (marcos, esc) => armarMortaCon(marcos, esc);
