/**
 * Los números del reo semental (`D-73`, vigesimosexta vuelta): en qué celda de la prisión de Barbazul está
 * preso, cómo está armado y cómo se licúa. Los lee el dibujo (`arte-reo.ts`), para la pose quieta del HTML y
 * para el retrato, y la conducta (`scripts/bestiario/reo.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del reo**: el (0, 0) es el piso de la celda entre las dos botas; arriba es negativo y está de frente,
 *   agarrado a la reja. Está dibujado al doble, y la escena lo achica con `REO.escala`.
 * - **El del recinto** (la prisión agrandada, de −250 a 1150): la celda del ala de la izquierda, la grande de
 *   adelante (`CELDAS_DE_LAS_ALAS` en `arte-prision.ts`), donde estaban sus ojos. El piso de esa celda cae
 *   fuera de la pantalla: lo que se ve es de la cintura para arriba, y el charco se arma en el borde de abajo.
 */

import { PRISION, marcoDelRecinto } from './rig.ts';

export type Punto = readonly [number, number];

/* ------------------------------------------------------------------
   La celda: la del ala de la izquierda
   ------------------------------------------------------------------ */

const ANCHO = 900;
const ALTO = 640;
/** La celda, con los mismos números que `CELDAS_DE_LAS_ALAS` en `arte-prision.ts` (copiados: la isla no se lleva el dibujo). */
export const CELDA = { lado: -1, u0: -0.9, u1: -0.3, alto: 0.6 } as const;

/** Un punto de la pared del costado, como lo calcula `enPared` en `arte-prision.ts`. */
export function enPared(lado: number, u: number, v: number): [number, number] {
  const F = PRISION.fondo;
  const x = lado < 0 ? F.x0 * u : ANCHO - (ANCHO - F.x1) * u;
  const techo = F.techo * u;
  const piso = ALTO - (ALTO - F.piso) * u;
  return [x, piso - (piso - techo) * v];
}

/** El hueco de la celda, en el recinto, cortado en el borde de abajo de la pantalla: lo de afuera es pared. */
export const HUECO: readonly Punto[] = (() => {
  const [a, b, c, d] = [enPared(CELDA.lado, CELDA.u0, 0), enPared(CELDA.lado, CELDA.u1, 0), enPared(CELDA.lado, CELDA.u1, CELDA.alto), enPared(CELDA.lado, CELDA.u0, CELDA.alto)];
  return [[a[0], ALTO + 20], [b[0], ALTO + 20], c, d];
})();

/** Dónde caen los barrotes de la reja de la celda, de adelante al fondo, y el grueso de cada uno. */
export const BARROTES: readonly { x: number; arriba: number; grueso: number }[] = (() => {
  const n = Math.round((CELDA.u1 - CELDA.u0) * 22);
  return Array.from({ length: n - 1 }, (_, i) => {
    const u = CELDA.u0 + ((CELDA.u1 - CELDA.u0) * (i + 1)) / n;
    const [x, arriba] = enPared(CELDA.lado, u, CELDA.alto - 0.01);
    return { x, arriba, grueso: 2.6 * (1 - u * 0.6) * 0.95 };
  });
})();

/** Los dos travesaños de la reja, como los pone `celda`: la altura en cada punta de la celda. */
export const TRAVESANIOS: readonly { v: number; izq: Punto; der: Punto }[] = [CELDA.alto * 0.18, CELDA.alto * 0.82].map((v) => ({
  v,
  izq: enPared(CELDA.lado, CELDA.u0, v),
  der: enPared(CELDA.lado, CELDA.u1, v),
}));

/* ------------------------------------------------------------------
   El reo en la celda
   ------------------------------------------------------------------ */

/** Dónde está parado, en el recinto, y lo que mide. El `piso` es el borde de abajo de la pantalla, no el de la celda. */
export const REO = { x: -170, piso: 612, escala: 0.5 } as const;

/** Cómo está armado, en sus coordenadas. El 1 es el brazo de la izquierda de quien mira. */
export const REO_ARMADO = {
  /** El cogote: de acá gira la cabeza. */
  cuello: [0, -356] as Punto,
  /** Lo más alto de la cabeza: desde acá se estira cuando se licúa. */
  coronilla: [0, -484] as Punto,
  /** De dónde sale el jopo. */
  jopo: [-6, -486] as Punto,
  /** Los ojos, y lo que miden. */
  ojos: [
    { centro: [-18, -432] as Punto, radio: [9, 7] as Punto },
    { centro: [18, -432] as Punto, radio: [9, 7] as Punto },
  ],
  /** Las cejas: de dónde giran. */
  cejas: [[-18, -452], [18, -452]] as readonly [Punto, Punto],
  /** La boca. */
  boca: [0, -392] as Punto,
  /** Los hombros, de donde giran los brazos cuando suelta la reja. */
  hombros: [[-72, -330], [72, -330]] as readonly [Punto, Punto],
  /** Los puños, cerrados en los barrotes: no se mueven aunque el cuerpo baje. */
  punios: [[-62, -424], [62, -424]] as readonly [Punto, Punto],
  /** El medio del pecho: de acá se hincha. */
  pecho: [0, -280] as Punto,
  /** El ruedo de la camisa, de donde chorrean las rayas. */
  ruedo: -206,
  /** Cuánto baja, en sus unidades, licuado del todo. */
  hunde: 300,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** La respiración (−1 a 1) y lo que se hincha el pecho (0 a 1). */
  respira: number;
  pecho: number;
  /** Cuánto se licuó (0 entero, 1 charco). */
  licua: number;
  /** El temblor (unidades, de costado). */
  tiembla: number;
  /** Cuánto ladea la cabeza (grados), y cuánto cae el jopo (grados). */
  cabeza: number;
  jopo: number;
  /** Los párpados (0 abiertos, 1 cerrados), las pupilas (corrimiento) y las cejas (grados, positivo es ceño). */
  parpados: readonly [number, number];
  pupilas: readonly [number, number];
  cejas: number;
  /** La boca (0 cerrada, 1 abierta), y los dientes del gruñido (0 a 1). */
  boca: number;
  dientes: number;
  /** Cuánto gira cada brazo en el hombro (grados; soltó la reja si no es cero). */
  brazos: readonly [number, number];
  /** El sudor: la fase de las gotas (0 arriba, 1 cayendo) y cuánto se ven. */
  gotas: number;
  gotasSe: number;
  /** Las rayas que chorrean del ruedo (0 a 1), el charco (0 a 1) y los ojos que flotan en el charco (0 a 1). */
  chorrea: number;
  charco: number;
  charcoOjos: number;
}

/** La pose quieta, la del HTML: agarrado a la reja con los dos puños, de frente, la frente sudada. */
export const QUIETO: Momento = {
  respira: 0,
  pecho: 0,
  licua: 0,
  tiembla: 0,
  cabeza: 0,
  jopo: 0,
  parpados: [0.15, 0.15],
  pupilas: [0, 0],
  cejas: 6,
  boca: 0,
  dientes: 0,
  brazos: [0, 0],
  gotas: 0.3,
  gotasSe: 0.7,
  chorrea: 0,
  charco: 0,
  charcoOjos: 0,
};

/**
 * *"El reo semental se va a licuar"*: a medio derretir. La cara se le estira, el jopo cae, los párpados pesan, la
 * boca se abre, las rayas chorrean del ruedo y abajo ya se armó medio charco. Es el toque quieto y el retrato.
 */
export const LICUADO: Momento = {
  ...QUIETO,
  licua: 0.45,
  jopo: 30,
  parpados: [0.5, 0.5],
  cejas: -8,
  boca: 0.7,
  gotas: 0.6,
  gotasSe: 1,
  chorrea: 1,
  charco: 0.6,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [REO.x + x * REO.escala, REO.piso + y * REO.escala];
export const alTitere = ([x, y]: Punto): Punto => [(x - REO.x) / REO.escala, (y - REO.piso) / REO.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = REO_ARMADO;
  const [nx, ny] = A.cuello;
  const [kx, ky] = A.coronilla;
  const [jx, jy] = A.jopo;
  const [bx, by] = A.boca;
  const [px, py] = A.pecho;
  const hunde = A.hunde * m.licua;
  // El pecho se hincha al respirar y al resoplar.
  const hincha = 1 + 0.03 * m.respira + 0.06 * m.pecho;
  // Licuado, la cara se estira para abajo desde la coronilla, y la boca baja y se ensancha.
  const estira = 1 + 0.5 * m.licua;
  const transform: Record<string, string> = {
    entero: `translate(${REO.x} ${REO.piso}) scale(${REO.escala})`,
    figura: `translate(${n2(m.tiembla)} ${n2(hunde)})`,
    torso: `translate(${px} ${py}) scale(${n2(hincha)} ${n2(1 + 0.02 * m.pecho)}) translate(${-px} ${-py})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny}) translate(${kx} ${ky}) scale(${n2(1 + 0.08 * m.licua)} ${n2(estira)}) translate(${-kx} ${-ky})`,
    jopo: `rotate(${n2(m.jopo + 50 * m.licua)} ${jx} ${jy})`,
    boca: `translate(0 ${n2(26 * m.licua)}) translate(${bx} ${by}) scale(${n2(1 + 0.35 * m.licua)} ${n2(0.6 + 0.4 * m.boca + 0.6 * m.licua)}) translate(${-bx} ${-by})`,
    chorrea: `translate(0 ${A.ruedo}) scale(1 ${n2(Math.max(0.02, m.chorrea))}) translate(0 ${-A.ruedo})`,
    gotas: `translate(0 ${n2(44 * m.gotas)})`,
    charco: `scale(${n2(Math.max(0.02, 0.3 + 0.7 * m.charco))} ${n2(Math.max(0.02, m.charco))})`,
  };
  for (const n of [0, 1] as const) {
    const { centro: [ex, ey], radio: [, ry] } = A.ojos[n];
    const top = ey - ry - 0.6;
    transform[`parpado-${n + 1}`] = `translate(${ex} ${top}) scale(1 ${n2(Math.max(0.02, Math.max(m.parpados[n], 0.6 * m.licua)))}) translate(${-ex} ${-top})`;
    transform[`pupila-${n + 1}`] = `translate(${n2(m.pupilas[0])} ${n2(m.pupilas[1] + 4 * m.licua)})`;
    const [cx, cy] = A.cejas[n];
    transform[`ceja-${n + 1}`] = `rotate(${n2((n ? -1 : 1) * (m.cejas - 14 * m.licua))} ${cx} ${cy})`;
    // Los puños se quedan en la reja: el brazo sube lo que bajó el cuerpo y se estira desde el puño.
    const [fx, fy] = A.punios[n];
    const [hx, hy] = A.hombros[n];
    const largo = hy - fy;
    transform[`brazo-${n + 1}`] = `translate(0 ${n2(-hunde)}) translate(${fx} ${fy}) scale(${n2(1 - 0.12 * m.licua)} ${n2((largo + hunde) / largo)}) translate(${-fx} ${-fy}) rotate(${n2(m.brazos[n])} ${hx} ${hy})`;
  }
  const opacity: Record<string, string> = {
    gotas: n2(m.gotasSe * Math.sin(Math.min(1, Math.max(0, m.gotas)) * Math.PI)),
    dientes: n2(m.dientes),
    chorrea: m.chorrea > 0.02 ? '1' : '0',
    charco: n2(Math.min(1, m.charco * 1.6)),
    'charco-ojos': n2(m.charcoOjos),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la celda, en el recinto, que el bocadillo no le tape la cara. */
export const VERSO: Punto = [REO.x, HUECO[3]![1] - 4];

/** El recinto de la prisión, para que el dibujo sepa hasta dónde llega la pared. */
export const SALA = marcoDelRecinto('la-prision');
