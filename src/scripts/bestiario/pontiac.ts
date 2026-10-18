/**
 * La Mariposa Pontiac en la ruta del último bondi (`D-73`, decimoquinta vuelta).
 *
 * Es un fierro: el tránsito (`recintoDeRuta`) la corre por el carril de adelante a la velocidad de su
 * carril, y acá se mueve lo de adentro. Va con las alas paradas sobre el techo y respira con ellas
 * (las abre y las cierra, cada vez con otro aire), y cada tanto las pliega del todo, como una polilla
 * quieta. Las antenas tantean la noche en el haz de los faros; la cola larga flamea con el viento; la
 * vela del busto de la trompa se corre para atrás. Los dos ojos de los óvalos miran:
 *
 * - **al que pasa**: los del otro carril van más despacio, y cuando lo alcanza al bondi o al camión,
 *   las alas se le van para atrás con el viento del otro y los ojos se le van al zumba colgado del
 *   estribo, o al héroe tirado arriba con su botella;
 * - **a la luz**: es polilla, y si adelante va uno con los faros prendidos, se queda mirando esa luz
 *   y abre más las alas;
 * - **a la señora**: cuando pasa por donde espera la bella señora desencarnada, se le van los ojos;
 * - y si no, para adelante, por donde va el haz, o un rato a la luna.
 *
 * Tocada, el verso hecho gesto, *"¿qué va a ser de mí?"*: se asusta (abre de golpe y muestra los dos
 * ojos, bien abiertos), y a los aletazos despega: le cuelgan las ruedas, levanta la trompa y el haz
 * se le va al cielo; un rato en el aire, mirando para arriba, y vuelve a bajar al carril, que la
 * recibe con la suspensión. El bocadillo lo pone la isla, como a todos los fierros.
 *
 * Con movimiento reducido no se mueve: tocada, queda en la pose del susto.
 *
 * Solo números, como las islas: lee `rig-pontiac.ts` y nada que dibuje.
 */

import { CARRIL_DE, DE_LOS_OTROS, LA_SENORA, PONTIAC_ARMADO, PONTIAC_VIDA, QUIETA, ASUSTADA, transformaciones, type Pose } from '../../lib/bestiario/rig-pontiac.ts';
import { hacia, partes, suave } from './articular.ts';
import type { Armar } from './vivos.ts';

const ID = 'la-mariposa-pontiac';

/** Un resorte con amortiguación: la pieza llega tarde, con peso, y casi no se pasa. */
interface Resorte {
  v: number;
  vel: number;
}
function tirar(r: Resorte, meta: number, dt: number, rigidez: number, amortigua = 0.8): number {
  if (dt <= 0) return r.v;
  const a = rigidez * (meta - r.v) - 2 * Math.sqrt(rigidez) * amortigua * r.vel;
  r.vel += a * dt;
  r.v += r.vel * dt;
  return r.v;
}

/** Un azar con semilla, propio: la isla no se lleva el de los que dibujan. */
function azar(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const limita = (v: number, a = -1, b = 1): number => Math.min(b, Math.max(a, v));

/**
 * El vuelo del toque, en función de cuánto pasó desde que la tocaron (`u`, en segundos): cuánto
 * despega, cuánto abre en cada aletazo y para dónde mira. Pura, para que el test la pueda recorrer.
 */
export function vuelo(u: number): { alto: number; aletazo: number; intensidad: number; cabeceo: number; tramo: 'susto' | 'despega' | 'aire' | 'baja' | 'asienta' | 'nada' } {
  const V = PONTIAC_VIDA;
  if (u < 0 || u >= V.asienta) return { alto: 0, aletazo: 0, intensidad: 0, cabeceo: 0, tramo: 'nada' };
  const subida = suave((u - V.susto) / (V.despega - V.susto));
  const bajada = suave((u - V.enElAire) / (V.baja - V.enElAire));
  const enElAire = subida * (1 - bajada);
  // Los aletazos: el golpe para abajo (abre) es rápido; la vuelta, lenta.
  const fase = (((u - V.susto) * V.aletazos) % 1 + 1) % 1;
  const golpe = fase < 0.4 ? suave(fase / 0.4) : 1 - suave((fase - 0.4) / 0.6);
  const intensidad = u < V.susto ? 0 : Math.min(1, (u - V.susto) / 0.2) * (1 - bajada * 0.75);
  let alto = V.alto * enElAire + Math.sin(fase * Math.PI * 2 - 0.6) * 2.2 * enElAire;
  let tramo: 'susto' | 'despega' | 'aire' | 'baja' | 'asienta' = u < V.susto ? 'susto' : u < V.despega ? 'despega' : u < V.enElAire ? 'aire' : u < V.baja ? 'baja' : 'asienta';
  if (tramo === 'asienta') {
    // La recibe el carril: la suspensión se hunde una vez y vuelve.
    const s = (u - V.baja) / (V.asienta - V.baja);
    alto = -2.6 * Math.sin(Math.PI * Math.min(1, s * 1.4)) * (1 - s);
  }
  const cabeceo = V.cabeceo * enElAire + 1.6 * Math.sin(Math.PI * bajada) + Math.sin(fase * Math.PI * 2) * 0.8 * enElAire;
  return { alto, aletazo: golpe * intensidad, intensidad, cabeceo, tramo };
}

export const armarPontiac: Armar = (marcos, esc) => {
  const marco = marcos[0]!;
  const p = partes(marco);
  const A = PONTIAC_ARMADO;
  const V = PONTIAC_VIDA;
  const rnd = azar(1996);
  const rango = ([a, b]: readonly [number, number]): number => a + rnd() * (b - a);

  // Dónde está: el fierro que la lleva, y los otros fierros y la señora de la misma escena.
  const fierro = marco.closest<SVGGElement>('.bestia--fierro');
  const escena: ParentNode | null = (marco.closest('svg') as ParentNode | null) ?? fierro?.parentElement ?? null;
  const otros = fierro?.parentElement
    ? [...fierro.parentElement.querySelectorAll<SVGGElement>('.bestia--fierro')].filter((g) => g !== fierro && DE_LOS_OTROS[g.dataset.id ?? ''])
    : [];
  const senora = escena?.querySelector<SVGGElement>(`[data-id="${LA_SENORA}"]`) ?? null;
  const x = (g: SVGGElement | null): number => Number(g?.dataset.ahora ?? g?.dataset.x ?? 0);
  const carril = CARRIL_DE[ID]!;
  const velocidad = Number(fierro?.dataset.velocidad ?? 46);

  // Lo que se mueve con peso.
  const abre: Resorte = { v: QUIETA.abre, vel: 0 };
  const barre: Resorte = { v: QUIETA.barre, vel: 0 };
  const adelanta: Resorte = { v: 0, vel: 0 };
  const miraX: Resorte = { v: QUIETA.mira[0], vel: 0 };
  const miraY: Resorte = { v: QUIETA.mira[1], vel: 0 };
  const antenas: [Resorte, Resorte] = [{ v: 0, vel: 0 }, { v: 0, vel: 0 }];
  const cola: Resorte = { v: 0, vel: 0 };

  // La respiración: cada una con su largo y su hondura.
  let respiraDesde = 0;
  let respiraDura = rango(V.respira.periodo);
  let respiraHonda = 0.7;
  // Cada tanto las pliega.
  let pliegaHasta = -1;
  let proximoPliegue = rango(V.pliega.cada);
  // El parpadeo, y el párpado de ahora.
  let parpadeo = rango(V.parpadeo.cada);
  let parpadoBase: number = V.parpadoQuieto;
  // Un rato mira la luna.
  let lunaHasta = -1;
  let proximaLuna = 6 + rnd() * 8;
  // El toque, y el giro de las ruedas.
  let tocadaDesde = -100;
  let asustadaQuieta = false;
  let giro = 0;

  function pintar(pose: Pose): void {
    for (const [nombre, a] of Object.entries(transformaciones(pose))) {
      const el = p.get(nombre);
      if (!el) continue;
      el.setAttribute('transform', a.transform);
      if (a.opacity !== undefined) el.setAttribute('opacity', a.opacity);
    }
  }

  /** Para dónde miran los ojos: un punto de la escena, visto desde el ojo de adelante. */
  function mirarA(tx: number, ty: number, aqui: number, alto: number): [number, number] {
    const [ox, oy] = A.ojos[0].centro;
    const ex = aqui + ox * 0.9;
    const ey = carril - alto + oy * 0.85;
    return [limita((tx - ex) / 90), limita((ty - ey) / 70)];
  }

  function mover(t: number, dt: number): void {
    if (dt <= 0) {
      // La pose quieta: la del HTML, o la del susto si la tocaron sin movimiento.
      pintar(asustadaQuieta ? ASUSTADA : QUIETA);
      return;
    }
    const aqui = x(fierro);
    const u = t - tocadaDesde;
    const vu = vuelo(u);
    const tocada = vu.tramo !== 'nada';

    // La respiración de siempre.
    if (t - respiraDesde > respiraDura) {
      respiraDesde = t;
      respiraDura = rango(V.respira.periodo);
      respiraHonda = 0.55 + rnd() * 0.45;
    }
    const fase = (t - respiraDesde) / respiraDura;
    let abreMeta = V.respira.cerrada + (V.respira.abierta - V.respira.cerrada) * respiraHonda * (0.5 - 0.5 * Math.cos(fase * Math.PI * 2));
    let barreMeta: number = V.viento;
    let adelantaMeta = 0;
    let antenaMeta = 0;
    let parpadoMeta: number = V.parpadoQuieto;

    // Cada tanto las pliega, y se le cierran un poco los ojos.
    if (t > proximoPliegue && !tocada) {
      pliegaHasta = t + rango(V.pliega.dura);
      proximoPliegue = pliegaHasta + rango(V.pliega.cada);
    }
    const pliega = t < pliegaHasta;
    if (pliega) {
      abreMeta = 0;
      barreMeta = 2;
      parpadoMeta = 0.55;
    }

    // Lo que mira, de lo que más la llama a lo que menos.
    let mira: [number, number] = [0.75, 0.2];
    const alLado = otros.find((g) => Math.abs(x(g) - aqui) < V.alLado);
    const adelante = otros.find((g) => {
      const d = x(g) - aqui;
      return d > V.luzAdelante[0] && d < V.luzAdelante[1];
    });
    if (alLado) {
      // Lo pasa: el viento del otro le tira las alas para atrás, y mira al que va colgado.
      const o = DE_LOS_OTROS[alLado.dataset.id!]!;
      barreMeta = V.viento + V.rafagaAlPasar;
      abreMeta = Math.min(abreMeta, 8);
      mira = mirarA(x(alLado) + o.pasajero[0], CARRIL_DE[alLado.dataset.id!]! + o.pasajero[1], aqui, 0);
      parpadoMeta = 0.1;
    } else if (adelante) {
      // Es polilla: la luz de adelante la llama. Abre más, y las antenas se van para allá.
      const o = DE_LOS_OTROS[adelante.dataset.id!]!;
      abreMeta += 8;
      antenaMeta = -6;
      mira = mirarA(x(adelante) + o.luz[0], CARRIL_DE[adelante.dataset.id!]! + o.luz[1], aqui, 0);
      parpadoMeta = 0.12;
    } else if (senora && Math.abs(Number(senora.dataset.x) - aqui) < 150) {
      mira = mirarA(Number(senora.dataset.x), Number(senora.dataset.y), aqui, 0);
    } else {
      if (t > proximaLuna) {
        lunaHasta = t + 1.4 + rnd() * 1.4;
        proximaLuna = lunaHasta + 7 + rnd() * 9;
      }
      if (t < lunaHasta) mira = [0.55, -1];
    }

    // Tocada: el susto, el vuelo y el asiento mandan sobre todo lo demás.
    if (tocada) {
      if (vu.tramo === 'susto') {
        adelantaMeta = 18;
        abreMeta = 12;
        mira = [-0.15, 0.3];
      } else if (vu.tramo === 'asienta') {
        abreMeta = V.respira.cerrada;
        mira = [0.5, 0.9];
      } else {
        adelantaMeta = 8 * (1 - vu.aletazo);
        abreMeta = 10 + (V.abreAletazo - 10) * vu.aletazo;
        mira = vu.tramo === 'baja' ? [0.4, 0.7] : [0.35, -1];
      }
      barreMeta = vu.tramo === 'susto' ? 0 : 4 + vu.intensidad * 6;
      antenaMeta = vu.tramo === 'susto' ? -8 : -22 * vu.intensidad;
      parpadoMeta = vu.tramo === 'asienta' ? 0.15 : 0;
    }

    // Los resortes: firmes en el vuelo, para que los aletazos lleguen; blandos en la ruta.
    const firme = tocada && vu.tramo !== 'asienta' ? 320 : 26;
    tirar(abre, abreMeta, dt, firme, 0.7);
    tirar(barre, barreMeta, dt, 14);
    tirar(adelanta, adelantaMeta, dt, tocada ? 180 : 30, 0.75);
    tirar(miraX, mira[0], dt, 50);
    tirar(miraY, mira[1], dt, 50);

    // Las antenas tantean, cada una a su ritmo, y llegan tarde a lo que hace el auto.
    const tantea = (i: number): number => Math.sin(t * (0.9 + i * 0.23) + i * 2.1) * 4 + Math.sin(t * (2.3 + i * 0.4) + i) * 1.6;
    antenas.forEach((r, i) => tirar(r, antenaMeta + tantea(i), dt, 40, 0.55));

    // La cola flamea con el viento, y en el vuelo sigue a los aletazos.
    const flamea = Math.sin(t * 5.3) * 0.55 + Math.sin(t * 8.7 + 1.3) * 0.3 + Math.sin(t * 1.7) * 0.4;
    tirar(cola, V.colaSacude * flamea + (tocada ? -9 * vu.aletazo + 4 : 0), dt, 60, 0.5);

    // El parpadeo, cada tanto; en el susto, ni eso.
    if (t > parpadeo + V.parpadeo.dura) parpadeo = t + rango(V.parpadeo.cada);
    const ciego = t > parpadeo && t < parpadeo + V.parpadeo.dura && !(tocada && vu.tramo !== 'asienta') ? 1 : 0;
    parpadoBase = hacia(parpadoBase, parpadoMeta, dt * (parpadoMeta < parpadoBase ? 6 : 1.2));

    // Las ruedas giran con la ruta; en el aire, van frenando.
    giro = (giro + dt * (velocidad / A.radioRueda) * (180 / Math.PI) * (vu.alto > 6 ? 0.35 : 1)) % 360;

    // La llama de la vela: tiembla, y se estira con el viento.
    const llama = limita(0.62 + Math.sin(t * 13.1) * 0.16 + Math.sin(t * 21.7 + 2) * 0.1 + (rnd() - 0.5) * 0.12, 0, 1);

    const alto = vu.alto;
    pintar({
      abre: Math.max(0, abre.v),
      barre: barre.v,
      adelanta: adelanta.v,
      cola: cola.v,
      antenas: [antenas[0].v, antenas[1].v],
      alto,
      cabeceo: vu.cabeceo,
      colgado: Math.min(V.colgado, alto),
      giro,
      parpados: [Math.max(parpadoBase, ciego), Math.max(parpadoBase, ciego)],
      mira: [miraX.v, miraY.v],
      llama,
    });
  }

  mover(0, 0);
  return {
    mover,
    reaccionar: (id, t) => {
      if (id !== ID) return false;
      if (esc.quieto()) {
        // Sin movimiento, el susto queda quieto: las alas abiertas y los dos ojos bien abiertos.
        asustadaQuieta = true;
        pintar(ASUSTADA);
        return true;
      }
      // Si ya está en el aire, no vuelve a arrancar: sigue el vuelo que tiene.
      if (vuelo(t - tocadaDesde).tramo === 'nada' || vuelo(t - tocadaDesde).tramo === 'asienta') tocadaDesde = t;
      return true;
    },
  };
};
