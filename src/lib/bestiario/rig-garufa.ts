/**
 * Los números del Rey Garufa (`D-73`, vigesimosexta vuelta): por dónde vaga en la nieve de Cybersiberia, cómo
 * está armado y cómo se pone. Los lee el dibujo (`arte-garufa.ts`), para la pose quieta del HTML y para el
 * retrato, y la conducta (`scripts/bestiario/garufa.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del rey**: el (0, 0) es la nieve entre los dos zapatos; arriba es negativo y mira a la **derecha**,
 *   para donde van sus huellas (la isla lo da vuelta cuando vuelve). Está dibujado casi al doble, y la escena lo
 *   achica con `GARUFA.escala`.
 * - **El del recinto** (900 × 640): en la nieve de adelante, a la derecha de la tele, entre la princesita
 *   sapito y los ojos de Comboman, donde estaba su silueta pintada y de donde salen las huellas.
 */

import { rot, type P } from './trazos.ts';

export type Punto = P;

/** Dónde está parado cuando no camina, y lo que mide. */
export const GARUFA = { x: 722, piso: 544, escala: 0.55 } as const;

/** Hasta dónde vaga, en sus unidades: a la izquierda hasta la sapita, a la derecha hasta los ojos de Comboman. */
export const VAGA = { desde: -60, hasta: 100 } as const;

/** Cómo está armado, en sus coordenadas. El 1 es el lado de lejos (el brazo y la pierna de atrás). */
export const GARUFA_ARMADO = {
  /** Las caderas y las rodillas: de acá giran los muslos y las canillas al caminar. */
  caderas: [[-6, -100], [8, -98]] as readonly [Punto, Punto],
  rodillas: [[-8, -52], [12, -50]] as readonly [Punto, Punto],
  /** El cuello: de acá gira la cabeza. */
  cuello: [2, -174] as Punto,
  /** Los ojos, en la cara de tres cuartos, y lo que miden. */
  ojos: [
    { centro: [-6, -204] as Punto, radio: [5.5, 4.2] as Punto },
    { centro: [12, -206] as Punto, radio: [6.5, 4.6] as Punto },
  ],
  /** La boca: de acá sale el vaho y acá se dibuja la sonrisa. */
  boca: [14, -188] as Punto,
  /** La base de la corona, encima de la cabeza: gira acá cuando se tuerce. */
  corona: [4, -232] as Punto,
  /** Los hombros, los codos y las manos, como están dibujados: el 1 es el de atrás. */
  hombros: [[-14, -166], [12, -162]] as readonly [Punto, Punto],
  codos: [[-4, -130], [36, -134]] as readonly [Punto, Punto],
  manos: [[24, -116], [42, -112]] as readonly [Punto, Punto],
  /** El medio del corazón, como está dibujado, entre las dos manos. */
  corazon: [33, -124] as Punto,
  /** El hueco del pecho, de donde lo sacó. */
  hueco: [4, -138] as Punto,
  /** De dónde cuelga la serpentina y de dónde se vuela la capa. */
  serpentina: [0, -168] as Punto,
  capa: [-2, -168] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Dónde está, en sus unidades, y para dónde mira (1 derecha, −1 izquierda). */
  anda: number;
  lado: 1 | -1;
  /** El paso: la fase del caminar (0 a 1 es un paso entero) y cuánto camina (0 parado, 1 caminando). */
  paso: number;
  camina: number;
  /** La respiración (−1 a 1) y el temblor del frío (unidades, de costado). */
  respira: number;
  tirita: number;
  /** Cuánto gira la cabeza en el cuello (grados; positivo baja la pera). */
  cabeza: number;
  /** Los párpados (0 abiertos, 1 cerrados). */
  parpados: readonly [number, number];
  /** La sonrisa de fiestero que le queda (0 a 1): sin ella, la boca es la que trae la cara. */
  sonrisa: number;
  /** Cuánto gira cada brazo en el hombro y cada antebrazo en el codo (grados). */
  brazos: readonly [number, number];
  antebrazos: readonly [number, number];
  /** El latido: cuánto se agranda el corazón (0 a 1) y cuánto brilla el hueco del pecho (0 a 1). */
  late: number;
  latido: number;
  /** Las gotas que caen del corazón (0 a 1). */
  gotas: number;
  /** El vaho del frío que sale de la boca (0 nada, 1 la nube entera). */
  vaho: number;
  /** El confeti que se le cae de la corona: cuánto cayó (0 arriba, 1 en la nieve) y cuánto se ve. */
  confeti: number;
  confetiSe: number;
  /** Lo que cuelga: la serpentina y la capa (grados), y la corona (grados, torcida). */
  serpentina: number;
  capa: number;
  corona: number;
}

/** La pose quieta, la del HTML: parado en la nieve, con el corazón entre las manos y la corona torcida. */
export const QUIETO: Momento = {
  anda: 0,
  lado: 1,
  paso: 0,
  camina: 0,
  respira: 0,
  tirita: 0,
  cabeza: 6,
  parpados: [0.2, 0.2],
  sonrisa: 0,
  brazos: [0, 0],
  antebrazos: [0, 0],
  late: 0,
  latido: 0.3,
  gotas: 0,
  vaho: 0,
  confeti: 0,
  confetiSe: 0,
  serpentina: 0,
  capa: 0,
  corona: -12,
};

/**
 * *"Y vaga con su corazón entre las manos"*: lo ofrece. Los brazos se estiran para adelante, el corazón se
 * agranda con el latido, el hueco del pecho brilla, y le queda la sonrisa de la fiesta. Es el toque quieto y el
 * retrato.
 */
export const OFRECE: Momento = {
  ...QUIETO,
  cabeza: -4,
  parpados: [0, 0],
  sonrisa: 1,
  brazos: [-44, -40],
  antebrazos: [-22, -26],
  late: 1,
  latido: 1,
  gotas: 0.5,
  vaho: 0.6,
  serpentina: 8,
  corona: -22,
};

/** Lo que giran los muslos y las canillas en un paso, en grados. */
export const ZANCADA = { muslo: 24, canilla: 30 } as const;

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [GARUFA.x + x * GARUFA.escala, GARUFA.piso + y * GARUFA.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Dónde queda cada mano con los brazos girados: el corazón va entre las dos. */
export function manosEn(m: Pick<Momento, 'brazos' | 'antebrazos'>): [Punto, Punto] {
  const A = GARUFA_ARMADO;
  return [0, 1].map((n) => {
    const hombro = A.hombros[n]!;
    const codo = rot(A.codos[n]!, hombro, m.brazos[n]!);
    const mano = rot(rot(A.manos[n]!, hombro, m.brazos[n]!), codo, m.antebrazos[n]!);
    return mano;
  }) as [Punto, Punto];
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = GARUFA_ARMADO;
  const [nx, ny] = A.cuello;
  const [kx, ky] = A.corona;
  const [sx, sy] = A.serpentina;
  const [px, py] = A.capa;
  const [cx, cy] = A.corazon;
  const [bx, by] = A.boca;
  // El paso: los muslos van a contrafase y la canilla se dobla cuando la pierna va atrás.
  const fase = m.paso * Math.PI * 2;
  const muslo = [Math.sin(fase), Math.sin(fase + Math.PI)].map((s) => s * ZANCADA.muslo * m.camina);
  const canilla = [Math.max(0, -Math.sin(fase)), Math.max(0, -Math.sin(fase + Math.PI))].map((s) => s * ZANCADA.canilla * m.camina);
  // Camina y la figura sube y baja un poco con cada paso; respira apenas desde los hombros.
  const bob = -3 * Math.abs(Math.sin(fase)) * m.camina + 0.6 * m.respira;
  // El corazón va donde están las manos: la mitad entre las dos.
  const [[m1x, m1y], [m2x, m2y]] = manosEn(m);
  const [d1, d2] = [A.manos[0], A.manos[1]];
  const dx = (m1x + m2x) / 2 - (d1[0] + d2[0]) / 2;
  const dy = (m1y + m2y) / 2 - (d1[1] + d2[1]) / 2;
  const late = 1 + 0.16 * m.late;
  const transform: Record<string, string> = {
    entero: `translate(${GARUFA.x} ${GARUFA.piso}) scale(${GARUFA.escala})`,
    anda: `translate(${n2(m.anda + m.tirita)} 0)`,
    lado: `scale(${m.lado} 1)`,
    figura: `translate(0 ${n2(bob)})`,
    capa: `rotate(${n2(m.capa - 6 * Math.sin(fase) * m.camina)} ${px} ${py})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    corona: `rotate(${n2(m.corona)} ${kx} ${ky})`,
    serpentina: `rotate(${n2(m.serpentina + 5 * Math.sin(fase) * m.camina)} ${sx} ${sy})`,
    corazon: `translate(${n2(dx)} ${n2(dy)}) translate(${cx} ${cy}) scale(${n2(late)}) translate(${-cx} ${-cy})`,
    confeti: `translate(0 ${n2(60 * m.confeti)})`,
    vaho: `translate(${n2(10 * m.vaho)} ${n2(-8 * m.vaho)}) translate(${bx + 20} ${by - 10}) scale(${n2(0.4 + 0.8 * m.vaho)}) translate(${-bx - 20} ${-by + 10})`,
    gotas: `translate(0 ${n2(14 * m.gotas)})`,
  };
  for (const n of [0, 1] as const) {
    const [hx, hy] = A.caderas[n];
    const [rx, ry] = A.rodillas[n];
    transform[`muslo-${n + 1}`] = `rotate(${n2(muslo[n]!)} ${hx} ${hy})`;
    transform[`canilla-${n + 1}`] = `rotate(${n2(canilla[n]!)} ${rx} ${ry})`;
    const [ox, oy] = A.hombros[n];
    const [ex, ey] = A.codos[n];
    transform[`brazo-${n + 1}`] = `rotate(${n2(m.brazos[n])} ${ox} ${oy})`;
    transform[`antebrazo-${n + 1}`] = `rotate(${n2(m.antebrazos[n])} ${ex} ${ey})`;
    const { centro: [ojx, ojy], radio: [, ry2] } = A.ojos[n];
    const top = ojy - ry2 - 0.6;
    transform[`parpado-${n + 1}`] = `translate(${ojx} ${top}) scale(1 ${n2(Math.max(0.02, m.parpados[n]))}) translate(${-ojx} ${-top})`;
  }
  const opacity: Record<string, string> = {
    latido: n2(0.25 + 0.75 * m.latido),
    sonrisa: n2(m.sonrisa),
    vaho: n2(m.vaho > 0.01 ? Math.sin(Math.min(1, m.vaho) * Math.PI) * 0.85 : 0),
    confeti: n2(m.confetiSe),
    gotas: n2(m.gotas > 0.01 ? Math.sin(Math.min(1, m.gotas) * Math.PI) : 0),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la corona, en el recinto. */
export const VERSO: Punto = alRecinto([0, -262]);
