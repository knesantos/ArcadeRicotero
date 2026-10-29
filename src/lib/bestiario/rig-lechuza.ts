/**
 * Los números de la lechuza que circula (`D-73`, vigesimotercera vuelta): en qué rama del árbol del gran
 * bonete se para, cómo está armada, cómo gira la cabeza de más y por dónde da la vuelta al árbol cuando la
 * tocan. Los lee el dibujo (`arte-lechuza.ts`), para la pose quieta del HTML y para el retrato, y la
 * conducta (`scripts/bestiario/lechuza.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de la lechuza**: el (0, 0) es donde las garras agarran la rama; arriba es negativo. Mira de frente,
 *   a quien la mira. Está dibujada a dos veces, y la escena la achica con `LECHUZA.escala`.
 * - **El del recinto** (900 × 640): parada en una rama seca que sale del hombro derecho de la copa, contra
 *   el cielo, arriba del fruto y lejos del nido. El ancla es el eje del tronco, como el monito: en el camino
 *   el árbol se corre `450 · (k − 1)` entero, y la rama tiene que seguir saliendo de la copa.
 */

import { ARBOL } from './rig-entornos.ts';
import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde se para (las garras en la rama), lo que mide, y el ancla del marco: el eje del tronco. */
export const LECHUZA = { x: 676, piso: 112, escala: 0.5, ancla: ARBOL.tronco.x } as const;

/** Cómo está armada, en las coordenadas de la lechuza. La 1 es la izquierda de quien mira. */
export const LECHUZA_ARMADO = {
  /** El eje de la rama, de la punta que se mete en la copa a la punta seca. Las garras pisan su lomo en (0, 0). */
  rama: [[-170, 70], [-96, 38], [-34, 12], [0, 7], [40, 0], [104, -24], [160, -52], [204, -78]] as readonly Punto[],
  /** De acá se agacha y se esponja todo el cuerpo: entre las patas. */
  base: [0, -8] as Punto,
  /** El medio del cuerpo: de acá gira y se achica en el vuelo. */
  centro: [0, -70] as Punto,
  /** Los hombros: de acá se abren las alas (las plegadas y las abiertas). */
  hombros: [[-30, -98], [30, -98]] as readonly [Punto, Punto],
  /** El cuello: de acá se ladea la cabeza. */
  cuello: [0, -108] as Punto,
  /** El medio de la cabeza y del disco de la cara: de acá gira la cara de más. */
  cabeza: [0, -140] as Punto,
  /** Los ojos de disco, y su radio. */
  ojos: [[-16, -142], [16, -142]] as readonly [Punto, Punto],
  radioOjo: 11,
  /** El pico, que muerde el pito de vigilante. */
  pico: [0, -118] as Punto,
  /** El pito: la boquilla en el pico y la bolita, más allá. */
  pito: [24, -108] as Punto,
  /** Donde nace la cola, detrás de la rama. */
  cola: [0, -26] as Punto,
  /** El boleto, pinchado en una astilla de la rama, a la derecha: el agujero por donde lo atraviesa. */
  boleto: [54, -28] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Lo que gira la cabeza a los costados (grados; 0 de frente, 180 de nuca, se puede pasar de vuelta). */
  giro: number;
  /** Lo que ladea la cabeza en el cuello (grados), y el cabeceo de lechuza que mide la distancia. */
  ladea: number;
  cabeceo: readonly [number, number];
  /** Los párpados: 0 abiertos, 1 cerrados. Cada uno por su cuenta, para entornar uno solo. */
  parpados: readonly [number, number];
  /** Lo esponjada (0 a 1), lo agachada para saltar (0 a 1) y la respiración (de −1 a 1). */
  esponja: number;
  agacha: number;
  respira: number;
  /** Las alas plegadas, despegadas del cuerpo (grados), y las abiertas: cuánto se ven y el aleteo (grados). */
  alas: number;
  abiertas: number;
  aleteo: number;
  /** El vuelo: dónde está el centro del cuerpo (en unidades de la lechuza, desde el quieto), cuánto se achica y se ladea. */
  vuelo: readonly [number, number];
  lejos: number;
  ladeo: number;
  /** Las patas recogidas en el vuelo (0 a 1), y la cola (grados). */
  patas: number;
  cola: number;
  /** El pito: lo que tiembla (grados), el pitido (0 a 1) y los cachetes inflados (0 a 1). */
  pito: number;
  pitido: number;
  cachetes: number;
  /** El boleto que levanta el viento de las alas: lo que se despega y lo que gira. */
  boleto: readonly [number, number];
}

/**
 * La pose quieta, la del HTML: parada en la rama, de frente, mordiendo el pito, con un ojo un poco más
 * entornado que el otro. No le cree a nadie.
 */
export const QUIETO: Momento = {
  giro: 0,
  ladea: 5,
  cabeceo: [0, 0],
  parpados: [0.16, 0.34],
  esponja: 0,
  agacha: 0,
  respira: 0,
  alas: 0,
  abiertas: 0,
  aleteo: 0,
  vuelo: [0, 0],
  lejos: 1,
  ladeo: 0,
  patas: 0,
  cola: 0,
  pito: 0,
  pitido: 0,
  cachetes: 0,
  boleto: [0, 0],
};

/**
 * *"Con la lechuza que circula, ya no se puede más"*: las alas abiertas en la rama, los ojos de par en par
 * y el pito sonando. Es el toque quieto y el retrato.
 */
export const CIRCULA: Momento = {
  ...QUIETO,
  ladea: 0,
  parpados: [0, 0],
  esponja: 0.5,
  alas: 10,
  abiertas: 1,
  aleteo: -14,
  pitido: 1,
  cachetes: 1,
  pito: -4,
  cola: 6,
};

/**
 * La vuelta al árbol, en el recinto: por dónde pasa el centro del cuerpo. Sale de la rama para la izquierda,
 * pasa por arriba de la copa (lejos, más chica), baja por el lado del marco, cruza por delante del tronco
 * (cerca, más grande) y sube por la derecha hasta la rama.
 */
export const VUELTA: readonly Punto[] = [
  [676, 77], [606, 50], [450, 54], [262, 70], [140, 146], [150, 254], [312, 322], [530, 330], [726, 280], [776, 178], [762, 104], [676, 77],
];

/** Lo que mide a cada altura de la vuelta: arriba de la copa es lejos, abajo del tronco es cerca. */
export function lejania(y: number): number {
  const y0 = VUELTA[0]![1];
  return y < y0 ? 1 - ((y0 - y) / 30) * 0.3 : 1 + ((y - y0) / 253) * 0.3;
}

/** Un punto de la vuelta, de 0 (despega) a 1 (vuelve a la rama): Catmull-Rom por los puntos. */
export function enLaVuelta(u: number): Punto {
  const pts = VUELTA;
  const n = pts.length - 1;
  const t = Math.min(1, Math.max(0, u)) * n;
  const i = Math.min(n - 1, Math.floor(t));
  const s = t - i;
  const p = (j: number): Punto => pts[Math.min(n, Math.max(0, j))]!;
  const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
  const c = (a: number, b: number, c2: number, d: number): number =>
    0.5 * (2 * b + (-a + c2) * s + (2 * a - 5 * b + 4 * c2 - d) * s * s + (-a + 3 * b - 3 * c2 + d) * s * s * s);
  return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])];
}

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [LECHUZA.x + x * LECHUZA.escala, LECHUZA.piso + y * LECHUZA.escala];
export const alaLechuza = ([x, y]: Punto): Punto => [(x - LECHUZA.x) / LECHUZA.escala, (y - LECHUZA.piso) / LECHUZA.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const suaveP = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/** Cuánto se ve la cara y cuánto la nuca, para un giro: la cara se va de costado, se angosta y se apaga. */
export function caras(giro: number): { cara: number; nuca: number; corre: number; ancho: number } {
  const a = (giro * Math.PI) / 180;
  const c = Math.cos(a);
  return { cara: suaveP((c + 0.3) / 0.3), nuca: suaveP((-c - 0.1) / 0.4), corre: 30 * Math.sin(a), ancho: Math.max(0.12, Math.abs(c)) };
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = LECHUZA_ARMADO;
  const [bx, by] = A.base;
  const [cx, cy] = A.centro;
  const [nx, ny] = A.cuello;
  const [hx, hy] = A.cabeza;
  const [px, py] = A.pico;
  const [kx, ky] = A.cola;
  // Esponjada se ensancha; agachada se achata; respira apenas.
  const sx = 1 + 0.12 * m.esponja + 0.012 * m.respira;
  const sy = 1 - 0.12 * m.agacha + 0.05 * m.esponja + 0.014 * m.respira;
  // La cabeza va donde quede el cuello del cuerpo estirado.
  const subeCuello = (ny - by) * (sy - 1);
  const v = caras(m.giro);
  const infla = 1 + 0.06 * m.cachetes;
  const transform: Record<string, string> = {
    entero: `translate(${LECHUZA.x} ${LECHUZA.piso}) scale(${LECHUZA.escala})`,
    vuelo: `translate(${n2(m.vuelo[0])} ${n2(m.vuelo[1])}) translate(${cx} ${cy}) rotate(${n2(m.ladeo)}) scale(${n2(m.lejos)}) translate(${-cx} ${-cy})`,
    cuerpo: `translate(${bx} ${by}) scale(${n2(sx)} ${n2(sy)}) translate(${-bx} ${-by})`,
    cola: `rotate(${n2(m.cola)} ${kx} ${ky})`,
    patas: `translate(0 ${n2(-7 * m.patas)}) translate(0 -14) scale(1 ${n2(1 - 0.45 * m.patas)}) translate(0 14)`,
    cabeza: `translate(${n2(m.cabeceo[0])} ${n2(subeCuello + m.cabeceo[1])}) rotate(${n2(m.ladea - m.ladeo)} ${nx} ${ny})`,
    cara: `translate(${n2(v.corre)} 0) translate(${hx} ${hy}) scale(${n2(v.ancho * infla)} ${n2(infla)}) translate(${-hx} ${-hy})`,
    nuca: `translate(${n2(-v.corre * 0.08)} 0)`,
    pito: `rotate(${n2(m.pito)} ${px} ${py})`,
    // La cola va detrás de la rama: vuela con el mismo traslado, en su propio grupo.
    'vuelo-atras': '',
    boleto: `translate(0 ${n2(-m.boleto[0])}) rotate(${n2(m.boleto[1])} ${A.boleto[0]} ${A.boleto[1]})`,
  };
  transform['vuelo-atras'] = transform.vuelo!;
  for (const n of [0, 1] as const) {
    const s = n === 0 ? -1 : 1;
    const [ox, oy] = A.hombros[n];
    transform[`ala-${n + 1}`] = `rotate(${n2(s * m.alas)} ${ox} ${oy})`;
    transform[`abierta-${n + 1}`] = `rotate(${n2(s * m.aleteo)} ${ox} ${oy})`;
    // El párpado baja desde el borde de arriba del ojo.
    const [ex, ey] = A.ojos[n];
    const top = ey - A.radioOjo - 1;
    transform[`parpado-${n + 1}`] = `translate(${ex} ${top}) scale(1 ${n2(Math.max(0.02, m.parpados[n]))}) translate(${-ex} ${-top})`;
  }
  const opacity: Record<string, string> = {
    cara: n2(v.cara),
    nuca: n2(v.nuca),
    abiertas: n2(m.abiertas),
    plegadas: n2(1 - m.abiertas),
    pitido: n2(m.pitido),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la cabeza, en el recinto. */
export const VERSO: Punto = alRecinto([0, -196]);
