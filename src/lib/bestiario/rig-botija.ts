/**
 * Los números del botija rapado (`D-73`, vigesimocuarta vuelta): en qué parte de la planchada del ferry está
 * parado, cómo está armado, cómo se doblan las piernas y hasta dónde llega cuando corre y salta a la borda.
 * Los lee el dibujo (`arte-botija.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/botija.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del botija**: el (0, 0) es el piso entre los dos pies, sobre la planchada; arriba es negativo. Va
 *   de perfil para la derecha, subiendo, con la cara para el ferry y la nuca para quien mira. Está dibujado
 *   a dos veces, y la escena lo achica con `BOTIJA.escala`.
 * - **El del recinto** (900 × 640): la planchada es la de `ASTILLERO.planchada` (`rig-entornos.ts`), una
 *   tabla que sube del muelle a la cubierta del ferry, y él está parado en su tercio de abajo.
 *
 * El camino corre a cada personaje entero `ancla · (k − 1)`, pero la planchada del piso largo se estira con
 * `k` a lo ancho. Por eso el ancla es el canto de la planchada a la altura de sus pies (parado, queda
 * sobre la tabla con cualquier `k`), y lo que avanza cuando corre se estira con `k` (`viaje`): así sube por
 * la misma tabla y cae en la misma borda.
 */

import { ASTILLERO } from './rig-entornos.ts';
import type { P } from './trazos.ts';

export type Punto = P;

const { muelle: M0, cubierta: C0 } = ASTILLERO.planchada;
/** El ancho de la tabla, que el piso no estira. */
const ANCHO_TABLA = 26;

/** Un punto del medio de la tabla, de 0 (el muelle) a 1 (la cubierta). */
export const enLaPlanchada = (s: number): Punto => [M0[0] + (C0[0] - M0[0]) * s + ANCHO_TABLA / 2, M0[1] + (C0[1] - M0[1]) * s];

/** Por dónde de la tabla está parado. */
const PARADO = 0.3;

/** Dónde está parado (el piso entre los pies), lo que mide, y el ancla: el canto de la tabla a esa altura. */
export const BOTIJA = {
  x: enLaPlanchada(PARADO)[0],
  piso: enLaPlanchada(PARADO)[1],
  escala: 0.5,
  ancla: enLaPlanchada(PARADO)[0] - ANCHO_TABLA / 2,
} as const;

/** Cómo está armado, en las coordenadas del botija, tal como está dibujado (todo colgando derecho). */
export const BOTIJA_ARMADO = {
  /** La cadera: de acá cuelgan las piernas y se inclina el cuerpo. */
  cadera: [0, -66] as Punto,
  /** Dónde nace cada pierna: la 1 es la de allá (la derecha de él), la 2 la de acá. */
  ingles: [[3, -66], [-3, -66]] as readonly [Punto, Punto],
  /** Lo que miden el muslo y la canilla (de la rodilla al tobillo), y del tobillo a la suela. */
  muslo: 30,
  canilla: 31,
  tobillo: 5,
  /** Los hombros: el 1 es el de allá, el 2 el de acá. */
  hombros: [[11, -103], [-9, -103]] as readonly [Punto, Punto],
  /** Lo que miden el brazo (hasta el codo) y el antebrazo (hasta el medio de la mano). */
  brazo: 22,
  antebrazo: 23,
  /** El cogote: de acá cabecea la cabeza. */
  cuello: [3, -112] as Punto,
  /** El medio de la cabeza rapada: de acá se da vuelta a mirar para atrás. */
  cabeza: [8, -134] as Punto,
  /** El ojo, la ceja y la boca, que muerde el boleto del ferry. */
  ojo: [17, -137] as Punto,
  ceja: [17, -142] as Punto,
  boca: [23.5, -122] as Punto,
  /** Donde la correa del bolso llega a la cadera: de acá se hamaca el bolso. */
  bolso: [-12, -68] as Punto,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Lo que avanza el cuerpo entero desde donde está parado (en unidades del botija). La isla estira la `x` con `k`. */
  viaje: Punto;
  /** Dónde está la cadera (como está dibujado, `BOTIJA_ARMADO.cadera`), y cuánto se inclina el cuerpo (grados; positivo, para adelante). */
  cadera: Punto;
  inclina: number;
  /** Los tobillos (la 1, la de allá; la 2, la de acá) y lo que gira cada zapatilla (grados; negativo, la punta arriba). */
  pies: readonly [Punto, Punto];
  puntas: readonly [number, number];
  /** Cada brazo: el hombro (grados desde colgar derecho; negativo, para adelante) y el codo (grados, sobre el hombro). */
  brazos: readonly [readonly [number, number], readonly [number, number]];
  /** La cabeza: lo que se ladea en el cogote (grados), lo que se corre, y para dónde mira (1 para el ferry, −1 para atrás). */
  ladea: number;
  cabeceo: Punto;
  mira: number;
  /** La pupila, corrida adentro del ojo; el párpado (0 abierto, 1 cerrado) y la ceja (cuánto sube). */
  pupila: Punto;
  parpado: number;
  ceja: number;
  /** La boca abierta (0 a 1): el grito. */
  boca: number;
  /** El boleto: dónde está respecto de los dientes y cuánto gira. */
  boleto: readonly [number, number, number];
  /** El bolso que se hamaca (grados), la respiración (−1 a 1) y las gotas de sudor que vuelan de la cabeza (0 a 1). */
  bolso: number;
  respira: number;
  gotas: number;
}

/** Los tobillos y las zapatillas parado en la tabla, que sube para la derecha: el pie de allá más arriba. */
const PARADO_PIES: readonly [Punto, Punto] = [[9, -12], [-8, -2]];

/**
 * La pose quieta, la del HTML: parado en la planchada, con el boleto del ferry en los dientes y la mano de
 * acá en la correa del bolso. Mira el ferry de reojo.
 */
export const QUIETO: Momento = {
  viaje: [0, 0],
  cadera: [0, -63],
  inclina: 4,
  pies: PARADO_PIES,
  puntas: [-30, -24],
  brazos: [[-6, -18], [8, -64]],
  ladea: 0,
  cabeceo: [0, 0],
  mira: 1,
  pupila: [0.6, -0.2],
  parpado: 0.3,
  ceja: 0,
  boca: 0,
  boleto: [0, 0, 0],
  bolso: 0,
  respira: 0,
  gotas: 0,
};

/**
 * *"Pudo cruzar el charco a tiempo / ¡Zafó!"*: los brazos para arriba, la boca abierta, el boleto saltando
 * de los dientes y las gotas del susto volando de la cabeza. Es el toque quieto y el retrato.
 */
export const ZAFO: Momento = {
  ...QUIETO,
  cadera: [0, -62],
  inclina: -6,
  brazos: [[-128, -34], [150, 22]],
  ladea: -10,
  pupila: [0.4, -1],
  parpado: 0.15,
  ceja: 3,
  boca: 1,
  boleto: [6, -30, -40],
  bolso: 12,
  gotas: 0.7,
};

/** Hasta dónde llega corriendo por la tabla (el `viaje`, en el recinto y con `k` 1), y la borda donde cae. */
export const CORRIDA: Punto = [(enLaPlanchada(0.85)[0] - BOTIJA.x) / BOTIJA.escala, (enLaPlanchada(0.85)[1] - BOTIJA.piso) / BOTIJA.escala];
export const BORDA_RECINTO: Punto = [ASTILLERO.ferry.x0 + 20, ASTILLERO.ferry.cubierta - 5];
export const BORDA: Punto = [(BORDA_RECINTO[0] - BOTIJA.x) / BOTIJA.escala, (BORDA_RECINTO[1] - BOTIJA.piso) / BOTIJA.escala];

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [BOTIJA.x + x * BOTIJA.escala, BOTIJA.piso + y * BOTIJA.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
/** Para dónde apunta un tramo que cuelga derecho, girado a la dirección `(dx, dy)`: el ángulo del `rotate`. */
const angulo = (dx: number, dy: number): number => (Math.atan2(-dx, dy) * 180) / Math.PI;

/**
 * Una pierna de dos tramos de la ingle al tobillo, con la rodilla para adelante (para la derecha). Si el
 * tobillo queda más lejos de lo que da la pierna, la estira derecha para ese lado.
 */
export function pierna(ingle: Punto, tobillo: Punto): { rodilla: Punto; pie: Punto; muslo: number; canilla: number } {
  const { muslo: l1, canilla: l2 } = BOTIJA_ARMADO;
  const [hx, hy] = ingle;
  const largo = Math.hypot(tobillo[0] - hx, tobillo[1] - hy) || 1;
  const d = Math.min(l1 + l2 - 0.01, Math.max(Math.abs(l1 - l2) + 0.1, largo));
  const a = Math.atan2(tobillo[1] - hy, tobillo[0] - hx);
  const b = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const rodillas = [a + b, a - b].map((r) => [hx + Math.cos(r) * l1, hy + Math.sin(r) * l1] as Punto);
  const rodilla = rodillas[0]![0] >= rodillas[1]![0] ? rodillas[0]! : rodillas[1]!;
  const [ux, uy] = [(tobillo[0] - rodilla[0]), (tobillo[1] - rodilla[1])];
  const u = Math.hypot(ux, uy) || 1;
  const pie: Punto = [rodilla[0] + (ux / u) * l2, rodilla[1] + (uy / u) * l2];
  return { rodilla, pie, muslo: angulo(rodilla[0] - hx, rodilla[1] - hy), canilla: angulo(pie[0] - rodilla[0], pie[1] - rodilla[1]) };
}

/** Dónde queda la mano de un brazo, para el test y para la conducta (rascarse, mirar el reloj). */
export function mano(n: 0 | 1, [a, b]: readonly [number, number], inclina = 0, cadera: Punto = BOTIJA_ARMADO.cadera): Punto {
  const A = BOTIJA_ARMADO;
  const gira = (p: Punto, c: Punto, g: number): Punto => {
    const r = (g * Math.PI) / 180;
    const [dx, dy] = [p[0] - c[0], p[1] - c[1]];
    return [c[0] + dx * Math.cos(r) - dy * Math.sin(r), c[1] + dx * Math.sin(r) + dy * Math.cos(r)];
  };
  const [sx, sy] = A.hombros[n];
  const codo = gira([sx, sy + A.brazo], [sx, sy], a);
  const m = gira([codo[0], codo[1] + A.antebrazo], codo, a + b);
  const corrida: Punto = [m[0] + cadera[0] - A.cadera[0], m[1] + cadera[1] - A.cadera[1]];
  return gira(corrida, cadera, inclina);
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = BOTIJA_ARMADO;
  const [cx, cy] = A.cadera;
  const [hx, hy] = m.cadera;
  const [nx, ny] = A.cuello;
  const [kx] = A.cabeza;
  const [bx, by] = A.boca;
  // El cuerpo va con la cadera y se inclina sobre ella; respira estirándose apenas.
  const torso = `translate(${n2(hx - cx)} ${n2(hy - cy)}) rotate(${n2(m.inclina)} ${cx} ${cy}) translate(0 ${cy}) scale(1 ${n2(1 + 0.012 * m.respira)}) translate(0 ${-cy})`;
  // Dar vuelta la cabeza es espejarla en su medio: se aplasta un poco al pasar, como en los dibujitos.
  const giro = Math.sign(m.mira || 1) * Math.max(0.78, Math.abs(m.mira));
  const transform: Record<string, string> = {
    entero: `translate(${n2(BOTIJA.x)} ${n2(BOTIJA.piso)}) scale(${BOTIJA.escala})`,
    viaje: `translate(${n2(m.viaje[0])} ${n2(m.viaje[1])})`,
    'torso-atras': torso,
    torso,
    cabeza: `translate(${n2(m.cabeceo[0])} ${n2(m.cabeceo[1])}) rotate(${n2(m.ladea)} ${nx} ${ny})`,
    cara: `translate(${kx} 0) scale(${n2(giro)} 1) translate(${-kx} 0)`,
    pupila: `translate(${n2(m.pupila[0])} ${n2(m.pupila[1])})`,
    parpado: `translate(0 ${A.ojo[1] - 3}) scale(1 ${n2(Math.max(0.02, m.parpado))}) translate(0 ${-(A.ojo[1] - 3)})`,
    ceja: `translate(0 ${n2(-m.ceja)})`,
    boleto: `translate(${n2(m.boleto[0])} ${n2(m.boleto[1])}) rotate(${n2(m.boleto[2])} ${bx} ${by})`,
    bolso: `rotate(${n2(m.bolso)} ${A.bolso[0]} ${A.bolso[1]})`,
    gotas: `translate(${kx} ${A.cabeza[1] - 14}) scale(${n2(0.4 + 0.9 * m.gotas)}) translate(${-kx} ${-(A.cabeza[1] - 14)}) translate(0 ${n2(-6 * m.gotas)})`,
  };
  // Las piernas: cada tramo, girado desde colgar derecho a donde lo deja la cuenta de la rodilla.
  for (const n of [0, 1] as const) {
    const [ix, iy] = A.ingles[n];
    const ingle: Punto = [ix + hx - cx, iy + hy - cy];
    const { rodilla, pie, muslo, canilla } = pierna(ingle, m.pies[n]);
    const [rx, ry] = [ix, iy + A.muslo];
    const [tx, ty] = [ix, ry + A.canilla];
    transform[`muslo-${n + 1}`] = `translate(${n2(ingle[0])} ${n2(ingle[1])}) rotate(${n2(muslo)}) translate(${-ix} ${-iy})`;
    transform[`canilla-${n + 1}`] = `translate(${n2(rodilla[0])} ${n2(rodilla[1])}) rotate(${n2(canilla)}) translate(${-rx} ${-ry})`;
    transform[`zapatilla-${n + 1}`] = `translate(${n2(pie[0])} ${n2(pie[1])}) rotate(${n2(m.puntas[n])}) translate(${-tx} ${-ty})`;
    // Los brazos cuelgan del hombro, y el antebrazo del codo.
    const [sx, sy] = A.hombros[n];
    const [a, b] = m.brazos[n];
    transform[`hombro-${n + 1}`] = `rotate(${n2(a)} ${sx} ${sy})`;
    transform[`codo-${n + 1}`] = `rotate(${n2(b)} ${sx} ${sy + A.brazo})`;
  }
  const opacity: Record<string, string> = {
    boca: n2(m.boca),
    gotas: n2(Math.min(1, m.gotas * 2.5) * (1 - Math.max(0, (m.gotas - 0.8) / 0.2))),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la cabeza rapada, en el recinto. */
export const VERSO: Punto = alRecinto([8, -172]);
