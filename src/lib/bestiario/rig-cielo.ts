/**
 * Los números del que no se cayó del cielo (`D-73`, vigesimoquinta vuelta): dónde está sentado en la chapa,
 * cómo está armado y cómo se pone. Los lee el dibujo (`arte-cielo.ts`), para la pose quieta del HTML y para el
 * retrato, y la conducta (`scripts/bestiario/cielo.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del tipo**: el (0, 0) es el filo de la chapa debajo del culo; arriba es negativo. Está de frente, con
 *   la cara apenas vuelta para el lado del farol y del gato, las piernas colgando por delante de la medianera.
 *   Está dibujado al doble, y la escena lo achica con `CIELO.escala`.
 * - **El del recinto** (los techos, 1500 × 640): sentado en el borde de la chapa que remata la medianera, a la
 *   derecha de todo, debajo del farol del fondo y pasando la punta adonde llega Limón. Los ojos quedan donde
 *   estaban sus ojos en lo oscuro (`VECINOS_DEL_BALDIO`).
 *
 * El vaso nunca se vuelca: en `marcas()` gira al revés de todo lo que tiene encima (el cuerpo, el torso, el
 * brazo y el antebrazo), así que la ginebra queda siempre a nivel, pase lo que pase.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde está sentado, y lo que mide. */
export const CIELO = { x: 1420, piso: 300, escala: 0.5 } as const;

/** Cómo está armado, en las coordenadas del tipo. El brazo y la pierna 1 son los de la izquierda de quien mira. */
export const CIELO_ARMADO = {
  /** La cadera: de acá se inclina el torso. */
  cadera: [0, -8] as Punto,
  /** Dónde nace cada pierna, y lo que miden el muslo (de la ingle a la rodilla) y la canilla (al tobillo). */
  ingles: [[-13, -6], [13, -6]] as readonly [Punto, Punto],
  muslo: 66,
  canilla: 76,
  /** Sentado en el filo, el muslo viene para quien mira, de costado: se ve achicado a esto. */
  escorzo: 0.55,
  /** Los hombros, y lo que miden el brazo (al codo) y el antebrazo (al medio de la mano). */
  hombros: [[-30, -86], [30, -86]] as readonly [Punto, Punto],
  brazo: 52,
  antebrazo: 48,
  /** El cogote: de acá gira la cabeza. */
  cuello: [0, -100] as Punto,
  /** Los ojos: el 2 es el hinchado. La nariz y la boca. */
  ojos: [[-8, -128], [8, -128]] as readonly [Punto, Punto],
  nariz: [-1, -119] as Punto,
  boca: [-1, -109] as Punto,
  /** La coronilla, de donde se le vuela el pelo. */
  coronilla: [4, -146] as Punto,
  /** De dónde cuelga la medalla de la virgen, que le asoma del cuello. */
  medalla: [-2, -92] as Punto,
  /** La botella vacía, acostada en la chapa, y el punto donde se apoya. */
  botella: [92, -7] as Punto,
  /** Dónde se agarra de la chapa cuando se cae: el puño, contra el filo. */
  agarre: [-26, 4] as Punto,
} as const;

/** Dónde queda la mano de cada brazo cuando cuelga derecho, como está dibujado. */
export const manoDibujada = (n: 0 | 1): Punto => {
  const [sx, sy] = CIELO_ARMADO.hombros[n];
  return [sx, sy + CIELO_ARMADO.brazo + CIELO_ARMADO.antebrazo];
};

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** Lo que se corre el cuerpo entero (se cae, cuelga, se sube), y lo que gira alrededor de `eje` (grados). */
  cae: Punto;
  vuelco: number;
  eje: Punto;
  /** Lo que se inclina el torso sobre la cadera (grados) y la respiración (−1 a 1). */
  inclina: number;
  respira: number;
  /** Adónde va cada mano, en las coordenadas del torso: el brazo se dobla solo para llegar, con el codo para afuera. */
  manos: readonly [Punto, Punto];
  /** Lo que gira cada muslo (grados; sentado, para la derecha), lo que se dobla cada rodilla y lo estiradas que están (0 sentado, 1 colgando). */
  piernas: readonly [number, number];
  rodillas: readonly [number, number];
  estira: number;
  /** Cuánto se le salió el zapato de la derecha (0 puesto, 1 colgando de la punta), y lo que gira cada zapato. */
  zapato: number;
  puntas: readonly [number, number];
  /** La cabeza: lo que se ladea en el cogote (grados) y lo que se corre; las pupilas, corridas adentro del ojo. */
  cabeza: number;
  cabeceo: Punto;
  mira: Punto;
  /** Los párpados (0 abiertos, 1 cerrados), la boca abierta, la cara de asco y el olor a gato que le llega (0 a 1). */
  parpado: number;
  boca: number;
  asco: number;
  olor: number;
  /** El pelo que se le vuela y la medalla que se hamaca (grados). */
  pelo: number;
  medalla: number;
  /** La botella: lo que rodó por la chapa y lo que se mece. */
  botella: readonly [number, number];
}

/**
 * La pose quieta, la del HTML: sentado en el filo de la chapa, el vaso parado en la rodilla, la otra mano
 * agarrada del borde, la cabeza un poco caída y el zapato a medio salir.
 */
export const QUIETO: Momento = {
  cae: [0, 0],
  vuelco: 0,
  eje: [0, 0],
  inclina: 2,
  respira: 0,
  manos: [[-44, -4], [46, -10]],
  piernas: [-60, -66],
  rodillas: [62, 70],
  estira: 0,
  zapato: 0.35,
  puntas: [0, 6],
  cabeza: -4,
  cabeceo: [0, 0],
  mira: [-0.6, 0.4],
  parpado: 0,
  boca: 0,
  asco: 0,
  olor: 0,
  pelo: 0,
  medalla: 0,
  botella: [0, 0],
};

/** Colgado: el cuerpo entero, bajo el filo, lo que mide el brazo estirado para arriba. */
export const COLGADO_CAE: Punto = [CIELO_ARMADO.agarre[0] - manoDibujada(0)[0], CIELO_ARMADO.agarre[1] - (CIELO_ARMADO.hombros[0][1] - CIELO_ARMADO.brazo - CIELO_ARMADO.antebrazo)];

/** Dónde queda la mano de arriba colgado, en las coordenadas del torso: el brazo derecho para arriba. */
export const ARRIBA: Punto = [CIELO_ARMADO.hombros[0][0], CIELO_ARMADO.hombros[0][1] - CIELO_ARMADO.brazo - CIELO_ARMADO.antebrazo];

/**
 * Colgado de una mano del borde de la chapa, con el vaso derecho en la otra, bien afuera, y el zapato
 * colgando de la punta. Es el toque quieto.
 */
export const COLGADO: Momento = {
  ...QUIETO,
  cae: COLGADO_CAE,
  eje: ARRIBA,
  inclina: 0,
  manos: [ARRIBA, [88, -118]],
  piernas: [6, -8],
  rodillas: [-8, 12],
  estira: 1,
  zapato: 0.62,
  puntas: [-6, 14],
  cabeza: 6,
  mira: [-0.4, -1.6],
  boca: 0.55,
  pelo: -8,
  medalla: 0,
};

/** El retrato de la ficha: sentado en la chapa, con el vaso alzado a la altura del pecho, mirando para arriba. */
export const BRINDIS: Momento = {
  ...QUIETO,
  manos: [[-44, -4], [46, -128]],
  cabeza: 3,
  mira: [0.2, -1.6],
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [CIELO.x + x * CIELO.escala, CIELO.piso + y * CIELO.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const rad = (g: number): number => (g * Math.PI) / 180;
/** Gira `p` alrededor de `c`, en grados, como `rotate` del SVG. */
const gira = ([x, y]: Punto, [cx, cy]: Punto, g: number): Punto => {
  const [dx, dy] = [x - cx, y - cy];
  return [cx + dx * Math.cos(rad(g)) - dy * Math.sin(rad(g)), cy + dx * Math.sin(rad(g)) + dy * Math.cos(rad(g))];
};
/** El ángulo de un `rotate` que lleva un tramo que cuelga derecho a la dirección `(dx, dy)`. */
const angulo = (dx: number, dy: number): number => (Math.atan2(-dx, dy) * 180) / Math.PI;
/** Un ángulo entre −180 y 180. */
const vuelta = (g: number): number => ((((g + 180) % 360) + 360) % 360) - 180;

/**
 * Un brazo de dos tramos del hombro a la mano: si la mano queda más lejos de lo que da el brazo, lo estira
 * derecho para ese lado. El codo sale para afuera, como sale el codo de cualquiera. Devuelve lo que gira el
 * hombro y el codo (grados, sobre colgar derecho), y dónde quedan el codo y la mano, en el torso.
 */
export function brazo(n: 0 | 1, objetivo: Punto): { hombro: number; codo: number; punta: Punto; mano: Punto } {
  const A = CIELO_ARMADO;
  const [l1, l2] = [A.brazo, A.antebrazo];
  const [sx, sy] = A.hombros[n];
  const largo = Math.hypot(objetivo[0] - sx, objetivo[1] - sy) || 1;
  const d = Math.min(l1 + l2 - 0.01, Math.max(Math.abs(l1 - l2) + 0.5, largo));
  const a = Math.atan2(objetivo[1] - sy, objetivo[0] - sx);
  const b = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const s = n ? 1 : -1;
  const codos = [a + b, a - b].map((r) => [sx + Math.cos(r) * l1, sy + Math.sin(r) * l1] as Punto);
  const punta = s * codos[0]![0] >= s * codos[1]![0] ? codos[0]! : codos[1]!;
  const [ux, uy] = [Math.cos(a) * d + sx - punta[0], Math.sin(a) * d + sy - punta[1]];
  const u = Math.hypot(ux, uy) || 1;
  const mano: Punto = [punta[0] + (ux / u) * l2, punta[1] + (uy / u) * l2];
  const hombro = angulo(punta[0] - sx, punta[1] - sy);
  const codo = vuelta(angulo(mano[0] - punta[0], mano[1] - punta[1]) - hombro);
  return { hombro, codo, punta, mano };
}

/** Una pierna: dónde quedan la rodilla y el tobillo, en el cuerpo, y cuánto se achica el muslo. */
export function pierna(m: Momento, n: 0 | 1): { rodilla: Punto; tobillo: Punto; escorzo: number } {
  const A = CIELO_ARMADO;
  const ingle = A.ingles[n];
  const escorzo = A.escorzo + (1 - A.escorzo) * m.estira;
  const rodilla = gira([ingle[0], ingle[1] + A.muslo * escorzo], ingle, m.piernas[n]);
  const tobillo = gira([rodilla[0], rodilla[1] + A.canilla], rodilla, m.piernas[n] + m.rodillas[n]);
  return { rodilla, tobillo, escorzo };
}

/** Lo que gira el vaso para quedar derecho: al revés de todo lo que tiene encima. */
export const giroDelVaso = (m: Momento): number => {
  const { hombro, codo } = brazo(1, m.manos[1]);
  return vuelta(-(m.vuelco + m.inclina + hombro + codo));
};

/** Un punto del torso, llevado al cuerpo entero (las unidades del tipo, con la caída y el vuelco). */
export const delTorso = (m: Momento, p: Punto): Punto => {
  const [x, y] = gira(gira(p, CIELO_ARMADO.cadera, m.inclina), m.eje, m.vuelco);
  return [x + m.cae[0], y + m.cae[1]];
};

/** Al revés: un punto fijo del techo (la chapa, el filo), llevado al torso, para que la mano llegue ahí. */
export const alTorso = (m: Momento, [x, y]: Punto): Punto => gira(gira([x - m.cae[0], y - m.cae[1]], m.eje, -m.vuelco), CIELO_ARMADO.cadera, -m.inclina);

/** Un punto del cuerpo, en el recinto. `torso` si va con el torso (los brazos, la cabeza, el vaso). */
export function alMundo(m: Momento, p: Punto, torso = false): Punto {
  const q = torso ? gira(p, CIELO_ARMADO.cadera, m.inclina) : p;
  const [x, y] = gira(q, m.eje, m.vuelco);
  return alRecinto([x + m.cae[0], y + m.cae[1]]);
}

/** Dónde queda cada mano, en el recinto. */
export const manoEn = (m: Momento, n: 0 | 1): Punto => alMundo(m, brazo(n, m.manos[n]).mano, true);

/**
 * Lo que ocupa en un momento, en el recinto: los hombros, los codos y las manos con lo que tienen, la cabeza
 * con el pelo, las piernas con los zapatos y la botella. Lo mira el test, para que no se salga por la derecha
 * ni se le meta a Limón.
 */
export function contorno(m: Momento): Punto[] {
  const A = CIELO_ARMADO;
  const pts: Punto[] = [];
  const caja = (c: Punto, rx: number, ry: number, torso: boolean): void => {
    for (const [dx, dy] of [[-rx, -ry], [rx, -ry], [rx, ry], [-rx, ry]] as const) pts.push(alMundo(m, [c[0] + dx, c[1] + dy], torso));
  };
  for (const n of [0, 1] as const) {
    const b = brazo(n, m.manos[n]);
    caja(A.hombros[n], 12, 8, true);
    caja(b.punta, 11, 11, true);
    caja(b.mano, n ? 14 : 12, n ? 16 : 12, true);
    const p = pierna(m, n);
    caja(A.ingles[n], 14, 6, false);
    caja(p.rodilla, 14, 10, false);
    caja(p.tobillo, 14, 16 + 12 * m.zapato * n, false);
  }
  caja([2, -126], 28, 34, true);
  caja([0, -48], 36, 44, true);
  const [bx, by] = A.botella;
  pts.push(alRecinto([bx - 28 + m.botella[0], by]), alRecinto([bx + 34 + m.botella[0], by]));
  return pts;
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = CIELO_ARMADO;
  const [hx, hy] = A.cadera;
  const [nx, ny] = A.cuello;
  const [cx, cy] = A.coronilla;
  const [mx, my] = A.medalla;
  const [bx] = A.botella;
  const torso = `rotate(${n2(m.inclina)} ${hx} ${hy}) translate(0 ${hy}) scale(1 ${n2(1 + 0.012 * m.respira)}) translate(0 ${-hy})`;
  const transform: Record<string, string> = {
    entero: `translate(${CIELO.x} ${CIELO.piso}) scale(${CIELO.escala})`,
    olor: `translate(${n2(-24 * (1 - m.olor))} ${n2(-6 * (1 - m.olor))})`,
    botella: `translate(${n2(m.botella[0])} 0) rotate(${n2(m.botella[1])} ${bx + 4} 0)`,
    caida: `translate(${n2(m.cae[0])} ${n2(m.cae[1])}) rotate(${n2(m.vuelco)} ${n2(m.eje[0])} ${n2(m.eje[1])})`,
    torso,
    'torso-brazos': torso,
    cabeza: `translate(${n2(m.cabeceo[0])} ${n2(m.cabeceo[1])}) rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    pelo: `rotate(${n2(m.pelo)} ${cx} ${cy + 10})`,
    pupilas: `translate(${n2(m.mira[0])} ${n2(m.mira[1])})`,
    // La medalla cuelga a plomo, y se hamaca: no gira con el cuerpo.
    medalla: `rotate(${n2(m.medalla - m.vuelco - m.inclina)} ${mx} ${my})`,
  };
  for (const n of [0, 1] as const) {
    const [sx, sy] = A.hombros[n];
    const b = brazo(n, m.manos[n]);
    transform[`hombro-${n + 1}`] = `rotate(${n2(b.hombro)} ${sx} ${sy})`;
    transform[`codo-${n + 1}`] = `rotate(${n2(b.codo)} ${sx} ${sy + A.brazo})`;
    // Las piernas: el muslo se achica sentado, que viene para quien mira, y cada tramo cuelga de donde lo deja la cuenta.
    const [ix, iy] = A.ingles[n];
    const p = pierna(m, n);
    const [rx, ry] = [ix, iy + A.muslo];
    const [tx, ty] = [ix, ry + A.canilla];
    transform[`muslo-${n + 1}`] = `rotate(${n2(m.piernas[n])} ${ix} ${iy}) translate(0 ${iy}) scale(1 ${n2(p.escorzo)}) translate(0 ${-iy})`;
    transform[`canilla-${n + 1}`] = `translate(${n2(p.rodilla[0] - rx)} ${n2(p.rodilla[1] - ry)}) rotate(${n2(m.piernas[n] + m.rodillas[n])} ${rx} ${ry})`;
    // El zapato de la derecha se le sale: baja del pie y queda colgando de la punta.
    const sale = n ? m.zapato : 0;
    transform[`zapato-${n + 1}`] = `translate(${n2(p.tobillo[0] - tx)} ${n2(p.tobillo[1] - ty)}) rotate(${n2(m.piernas[n] + m.rodillas[n] + m.puntas[n])} ${tx} ${ty}) translate(0 ${n2(sale * 12)}) rotate(${n2(sale * 10)} ${tx} ${ty + 14})`;
  }
  const [vx, vy] = manoDibujada(1);
  transform.vaso = `rotate(${n2(giroDelVaso(m))} ${vx} ${vy})`;
  const opacity: Record<string, string> = {
    parpados: n2(m.parpado),
    boca: n2(m.boca),
    asco: n2(m.asco),
    olor: n2(m.olor),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba del pelo revuelto, en el recinto. */
export const VERSO: Punto = alRecinto([0, -180]);
