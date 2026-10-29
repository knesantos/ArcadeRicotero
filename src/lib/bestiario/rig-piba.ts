/**
 * Los números de la piba con la remera de Greenpeace (`D-73`, vigesimotercera vuelta): dónde duerme en la
 * banquina de la ruta, cómo está armada y cómo se pone. Los lee el dibujo (`arte-piba.ts`), para la pose
 * quieta del HTML y para el retrato, y la conducta (`scripts/bestiario/piba.ts`), que se lleva esto y nada
 * que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de la piba**: el (0, 0) es el pasto debajo de la cadera; arriba es negativo. Está acostada de
 *   costado, mirando para este lado, con la cabeza a la izquierda en el almohadón y los pies a la derecha.
 *   La cabeza se dibuja derecha, parada sobre el cuello, y se acuesta girándola `BASE` grados: así los
 *   ojos, la boca y los párpados se miden como en una cara de frente. Dibujada a dos veces, y la escena la
 *   achica con `PIBA.escala`, la misma de la bella señora, que está a la misma distancia.
 * - **El del recinto** (900 × 640): en la banquina de este lado, abajo del asfalto, a la izquierda de la
 *   bella señora y lejos del taxi volcado. Los fierros pasan por detrás.
 */

import { rot, type P } from './trazos.ts';

export type Punto = P;

/** Dónde duerme, y lo que mide. */
export const PIBA = { x: 300, piso: 614, escala: 0.56 } as const;

/** Lo que gira la cabeza para quedar acostada en el almohadón (grados). */
export const BASE = -72;

/** Cómo está armada, en las coordenadas de la piba. La cabeza, los ojos y la boca, en la cara derecha. */
export const PIBA_ARMADO = {
  /** La cadera de abajo, apoyada: de acá se acomoda el cuerpo entero. */
  cadera: [0, -28] as Punto,
  /** El pecho apoyado en el pasto: de acá respira el torso. */
  pecho: [-56, -2] as Punto,
  /** El cuello: de acá gira la cabeza (y se acuesta). */
  cuello: [-104, -42] as Punto,
  /** El medio de la cara, con la cabeza derecha. */
  cara: [-104, -84] as Punto,
  ojos: [[-113, -86], [-95, -86]] as readonly [Punto, Punto],
  nariz: [-104, -78] as Punto,
  /** El aro, en el borde de la cara que queda para arriba: ahí se posa el mosquito. */
  aro: [-83, -78] as Punto,
  boca: [-104, -69] as Punto,
  /** El brazo de arriba, el que se rasca y espanta: hombro, codo y mano apoyada en la cadera. */
  hombro: [-86, -60] as Punto,
  codo: [-46, -58] as Punto,
  mano: [-12, -44] as Punto,
  /** La pierna de arriba, la que corre dormida: cadera, rodilla y tobillo. */
  muslo: [6, -42] as Punto,
  rodilla: [72, -48] as Punto,
  tobillo: [128, -34] as Punto,
  /** La mano de abajo, metida debajo del cachete. */
  manoAbajo: [-130, -24] as Punto,
  /** De dónde salen los zzz de mentira, arriba de la cabeza acostada. */
  zzz: [-150, -96] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** La respiración: -1 a 1, el pecho que sube y baja. */
  respira: number;
  /** Cuánto se acomoda el cuerpo entero desde la cadera, y la cabeza sobre la acostada (grados). */
  cuerpo: number;
  cabeza: number;
  /** Lo abierto de cada ojo (0 dormido, 1 bien abierto), y para dónde mira la pupila (-1 a 1). */
  ojos: readonly [number, number];
  mira: number;
  /** Los ojos apretados fuerte, las cejas levantadas, la boca abierta del ronquido y el rubor (0 a 1). */
  aprieta: number;
  cejas: number;
  boca: number;
  rubor: number;
  /** El brazo de arriba en el hombro y el antebrazo en el codo, y la pierna en la cadera y la pantorrilla en la rodilla (grados). */
  brazo: number;
  antebrazo: number;
  pierna: number;
  pantorrilla: number;
  /** Los tres zzz: cuánto subió cada uno (0 no está, 1 se fue). */
  zetas: readonly [number, number, number];
  /** El bicho: dónde está (en coordenadas de la piba) y si está (0 a 1). */
  bicho: readonly [number, number];
  vuela: number;
}

/** Dónde queda el aro con la cabeza acostada (girada `extra` grados más): ahí se posa el mosquito. */
export const posaEn = (extra = 0): Punto => rot(PIBA_ARMADO.aro, PIBA_ARMADO.cuello, BASE + extra);

/** La pose quieta, la del HTML: dormida, o haciéndose, con la mano en la cadera. */
export const QUIETO: Momento = {
  respira: 0,
  cuerpo: 0,
  cabeza: 0,
  ojos: [0, 0],
  mira: 0,
  aprieta: 0,
  cejas: 0,
  boca: 0,
  rubor: 0,
  brazo: 0,
  antebrazo: 0,
  pierna: 0,
  pantorrilla: 0,
  zetas: [0, 0, 0],
  bicho: [-60, -150],
  vuela: 0,
};

/**
 * *"Está dormida o finge que duerme"*: espía con un ojo, con la ceja levantada, un zzz de mentira en el aire
 * y los cachetes colorados porque la vieron. Es el toque quieto y el retrato.
 */
export const FINGE: Momento = {
  ...QUIETO,
  cabeza: 8,
  ojos: [0, 0.75],
  mira: -1,
  cejas: 0.7,
  rubor: 0.8,
  zetas: [0.45, 0, 0],
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [PIBA.x + x * PIBA.escala, PIBA.piso + y * PIBA.escala];

/** La mano de arriba con el brazo y el antebrazo girados: para ver que llega a la nariz cuando espanta. */
export function manoCon(brazo: number, antebrazo: number): Punto {
  const A = PIBA_ARMADO;
  return rot(rot(A.mano, A.codo, antebrazo), A.hombro, brazo);
}

/**
 * Cuánto giran el brazo y el antebrazo para que la mano llegue arriba del aro, a espantar el mosquito: se
 * busca una vez, a mano alzada, entre los giros que no le quiebran el codo para atrás.
 */
export const ESPANTA: readonly [number, number] = (() => {
  const [px, py] = posaEn();
  const meta: Punto = [px + 2, py - 10];
  let mejor: [number, number] = [0, 0];
  let dist = Infinity;
  for (let b = -180; b <= 20; b += 2) {
    for (let a = -150; a <= 10; a += 2) {
      const [hx, hy] = manoCon(b, a);
      const d = Math.hypot(hx - meta[0], hy - meta[1]);
      if (d < dist) [dist, mejor] = [d, [b, a]];
    }
  }
  return mejor;
})();

/** Dónde está el zzz `n` cuando subió `p`: sale de arriba de la cabeza y se va para arriba, meciéndose. */
export function zetaEn(n: number, p: number): Punto {
  const [x, y] = PIBA_ARMADO.zzz;
  return [x + 10 * n + 34 * p + 6 * Math.sin(p * 9 + n), y - 8 * n - 96 * p];
}

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = PIBA_ARMADO;
  const [kx, ky] = A.cadera;
  const [px, py] = A.pecho;
  const [nx, ny] = A.cuello;
  const [bx, by] = A.boca;
  const sube = n2(-2.4 * m.respira);
  const transform: Record<string, string> = {
    entero: `translate(${PIBA.x} ${PIBA.piso}) scale(${PIBA.escala})`,
    cuerpo: `rotate(${n2(m.cuerpo)} ${kx} ${ky})`,
    // El pecho se infla para arriba y un poco para los lados, desde donde se apoya en el pasto.
    torso: `translate(${px} ${py}) scale(${n2(1 + 0.012 * m.respira)} ${n2(1 + 0.035 * m.respira)}) translate(${-px} ${-py})`,
    cabeza: `translate(0 ${sube}) rotate(${n2(BASE + m.cabeza)} ${nx} ${ny})`,
    brazo: `translate(0 ${sube}) rotate(${n2(m.brazo)} ${A.hombro[0]} ${A.hombro[1]})`,
    antebrazo: `rotate(${n2(m.antebrazo)} ${A.codo[0]} ${A.codo[1]})`,
    pierna: `rotate(${n2(m.pierna)} ${A.muslo[0]} ${A.muslo[1]})`,
    pantorrilla: `rotate(${n2(m.pantorrilla)} ${A.rodilla[0]} ${A.rodilla[1]})`,
    cejas: `translate(0 ${n2(-3.4 * m.cejas)})`,
    boca: `translate(${bx} ${by}) scale(${n2(0.4 + 0.6 * m.boca)}) translate(${-bx} ${-by})`,
    bicho: `translate(${n2(m.bicho[0])} ${n2(m.bicho[1])})`,
  };
  const opacity: Record<string, string> = {
    aprieta: n2(m.aprieta),
    rubor: n2(m.rubor * 0.85),
    boca: m.boca > 0.03 ? '1' : '0',
    bicho: n2(m.vuela),
  };
  for (const n of [0, 1] as const) {
    const [ex, ey] = A.ojos[n];
    const k = Math.max(0.02, m.ojos[n]);
    transform[`ojo-${n + 1}`] = `translate(${ex} ${ey}) scale(1 ${n2(k)}) translate(${-ex} ${-ey})`;
    opacity[`ojo-${n + 1}`] = m.ojos[n] > 0.04 ? '1' : '0';
    transform[`pupila-${n + 1}`] = `translate(${n2(2.6 * m.mira)} ${n2(-0.6 * Math.abs(m.mira))})`;
  }
  m.zetas.forEach((p, n) => {
    const [zx, zy] = zetaEn(n, p);
    transform[`zeta-${n + 1}`] = `translate(${n2(zx)} ${n2(zy)}) rotate(${n2(-12 + 18 * p)}) scale(${n2(0.7 + 0.7 * p)})`;
    opacity[`zeta-${n + 1}`] = p <= 0 || p >= 1 ? '0' : n2(Math.min(1, Math.sin(Math.PI * p) * 1.6));
  });
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la cabeza, en el recinto. */
export const VERSO: Punto = alRecinto([-120, -200]);
