/**
 * Los números del pibe de los astilleros (`D-73`, decimoquinta vuelta): dónde se sienta arriba de la
 * pila de containers, cómo está armado y cómo se para. Los lee el dibujo (`arte-pibe.ts`), para la
 * pose quieta que está en el HTML y para el retrato, y la conducta (`scripts/bestiario/pibe.ts`), que
 * se lleva esto y nada que dibuje. Por eso la pose se calcula acá, como la del monito: la misma cuenta
 * pone al pibe sin JavaScript y con la isla, y no hay dos poses quietas que se puedan separar.
 *
 * Dos sistemas de coordenadas:
 * - **El del títere**: el (0, 0) es la cadera, el medio de la pelvis; arriba es negativo. Se dibuja a
 *   esta medida y la escena lo achica con `LUGAR.escala`.
 * - **El del recinto** (900 × 640): la pila de containers es la de `ASTILLERO.pila`
 *   (`rig-entornos.ts`), y el pibe se sienta en el canto de arriba, `pila.arriba`.
 *
 * Todo lo que hace pasa cerca de su ancla: en el camino la pila se estira con `k` y el marco del pibe
 * se corre entero, así que lo que se alejara del ancla quedaría fuera de su container.
 */

import { ASTILLERO, OJOS_DE_LOS_ASTILLEROS } from './rig-entornos.ts';

export type Punto = readonly [number, number];

/** Cómo está armado, en las coordenadas del títere. La 1 es la izquierda de quien mira. */
export const PIBE_ARMADO = {
  /** De acá sale cada pierna. */
  caderas: [[-8, 0], [8, 0]] as readonly [Punto, Punto],
  /** De acá sale cada brazo. Los brazos se dibujan colgando. */
  hombros: [[-15, -41], [15, -41]] as readonly [Punto, Punto],
  /** De acá gira la cabeza. */
  cuello: [1, -46] as Punto,
  /** Los largos: el brazo, el antebrazo hasta el medio de la mano, el muslo y la pierna hasta la suela. */
  largos: { brazo: 25, antebrazo: 27, muslo: 33, pierna: 35 },
  /**
   * La strato roja va colgada a la espalda: la correa le cruza el pecho, el clavijero asoma por arriba
   * del hombro derecho (de quien mira) y el cuerpo, por la cadera de la izquierda. Se mece desde acá.
   */
  correa: [15, -42] as Punto,
  /** Los ojos, en la cara de tres cuartos que mira al muelle: el de la izquierda queda más cerca. */
  ojos: [
    { centro: [-1.6, -61] as Punto, radio: [2.7, 1.6] as Punto },
    { centro: [8.4, -61.3] as Punto, radio: [2.1, 1.45] as Punto },
  ],
  /** La boca, y la comisura de la que cuelga el pucho, del lado del farol. */
  boca: [5.6, -51.4] as Punto,
  labio: [9.4, -51.2] as Punto,
  /** El bolsillo canguro del buzo, donde guarda lo que se afana. */
  bolsillo: [1, -6] as Punto,
  /**
   * La cabeza se dibuja a la medida del cuerpo y se agranda desde el cuello: a la medida, en el
   * teléfono la cara se perdía, y el pibe de la contratapa es todo cara.
   */
  agranda: 1.18,
} as const;

/** El pibe en el recinto: arriba del container de más arriba de la pila, mirando al muelle. */
export const LUGAR = {
  /**
   * El ancla: en la mitad izquierda del container de arriba, a un brazo de la rana. Con 150 (donde
   * estaban sus ojos) el teléfono, que arranca mirando a 300, le cortaba la caja.
   */
  x: 176,
  /** El canto de arriba de la pila: ahí se sienta, y ahí pisa cuando se para. */
  piso: ASTILLERO.pila.arriba,
  escala: 0.5,
  /** Cuánto queda la cadera arriba del canto cuando está sentado. */
  sentado: 4,
} as const;

/** Lo que mide de la cadera a la suela, en el recinto: lo que sube la cadera cuando se para. */
export const PARADO = (PIBE_ARMADO.largos.muslo + PIBE_ARMADO.largos.pierna) * LUGAR.escala;

/**
 * La caja de cartón que se afanó, arriba del container, a su izquierda: `x` es el medio de abajo, en el
 * recinto; `ancho` y `alto` (sin las solapas) van en el títere. La caja de cartón es la del pibe de la
 * contratapa de *La mosca y la sopa*, que la tiene en la cabeza.
 */
export const CAJA = { x: LUGAR.x - 32, ancho: 34, alto: 24 } as const;

/** Donde está la rana rubia, que él alquiló, en la misma pila: se miran. */
export const RANA: Punto = [OJOS_DE_LOS_ASTILLEROS['la-rana-rubia']![0], OJOS_DE_LOS_ASTILLEROS['la-rana-rubia']![1]];

const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;

/** Rota `p` alrededor de `c`, en grados (positivo es como las agujas, como en SVG). */
export function rotar([x, y]: Punto, [cx, cy]: Punto, grados: number): Punto {
  const a = (grados * Math.PI) / 180;
  const [dx, dy] = [x - cx, y - cy];
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
}

/** La cadera en el recinto, según cuánto se paró. */
export const caderaEn = (parado: number): Punto => [LUGAR.x, LUGAR.piso - mezcla(LUGAR.sentado, PARADO, parado)];

/** Del títere al recinto, con la cadera en `cadera`. */
export const alRecinto = ([x, y]: Punto, [cx, cy]: Punto): Punto => [cx + x * LUGAR.escala, cy + y * LUGAR.escala];
/** Del recinto al títere. */
export const alTitere = ([x, y]: Punto, [cx, cy]: Punto): Punto => [(x - cx) / LUGAR.escala, (y - cy) / LUGAR.escala];

/**
 * Un miembro de dos tramos que lleva la punta a un punto. Devuelve cuánto gira el tramo de arriba en
 * su articulación (respecto de colgar derecho) y cuánto gira el de abajo adentro del de arriba. El
 * codo va para el lado de `dobla`.
 */
export function alcanzar(raiz: Punto, largo1: number, largo2: number, meta: Punto, dobla: Punto): { arriba: number; abajo: number; codo: Punto; punta: Punto } {
  const [sx, sy] = raiz;
  const lejos = Math.hypot(meta[0] - sx, meta[1] - sy);
  const d = Math.min(largo1 + largo2 - 0.5, Math.max(Math.abs(largo1 - largo2) + 0.5, lejos));
  const phi = Math.atan2(meta[1] - sy, meta[0] - sx);
  const alfa = Math.acos(Math.min(1, Math.max(-1, (largo1 * largo1 + d * d - largo2 * largo2) / (2 * largo1 * d))));
  const codos = [phi + alfa, phi - alfa].map((a) => [sx + Math.cos(a) * largo1, sy + Math.sin(a) * largo1] as const);
  const [mx, my] = [sx + Math.cos(phi) * d * 0.5, sy + Math.sin(phi) * d * 0.5];
  const cuanto = ([x, y]: Punto): number => (x - mx) * dobla[0] + (y - my) * dobla[1];
  const codo = cuanto(codos[0]!) >= cuanto(codos[1]!) ? codos[0]! : codos[1]!;
  const grados = (x: number, y: number): number => (Math.atan2(y, x) * 180) / Math.PI;
  const vuelta = (a: number): number => ((((a + 180) % 360) + 360) % 360) - 180;
  const arriba = vuelta(grados(codo[0] - sx, codo[1] - sy) - 90);
  const abajo = vuelta(grados(meta[0] - codo[0], meta[1] - codo[1]) - grados(codo[0] - sx, codo[1] - sy));
  const hasta = Math.hypot(meta[0] - codo[0], meta[1] - codo[1]) || 1;
  const punta: Punto = [codo[0] + ((meta[0] - codo[0]) / hasta) * largo2, codo[1] + ((meta[1] - codo[1]) / hasta) * largo2];
  return { arriba, abajo, codo, punta };
}

/* ------------------------------------------------------------------
   El momento: lo que la conducta decide en cada cuadro
   ------------------------------------------------------------------ */

/** Dónde está la caja, en el títere: el medio de abajo y cuánto gira. */
export interface Lugar {
  x: number;
  y: number;
  giro: number;
}

/** Lo que el pibe está haciendo en un cuadro. La pose quieta es `QUIETA`; la isla la retoca. */
export interface Momento {
  /** De sentado (0) a parado arriba del container (1). */
  parado: number;
  /** Cuánto se inclina el torso, en grados: negativo es para la caja. */
  inclina: number;
  /** El pecho que sube y baja, de -1 a 1. */
  respira: number;
  /** Cuánto patea cada pierna contra el container, de -1 a 1. */
  patas: readonly [number, number];
  /** Adónde va cada mano, en el títere; `null` es apoyada en el canto (o colgando, parado). */
  manos: readonly [Punto | null, Punto | null];
  /** Dónde está la caja, en el títere; `null` es en su lugar, arriba del container. */
  caja: Lugar | null;
  /** La cara: cuánto gira la cabeza (positivo baja la pera para el lado del muelle), adónde miran las pupilas, los párpados. */
  cabeza: number;
  mira: Punto;
  parpados: readonly [number, number];
  /** La boca abierta del grito, de 0 a 1. */
  grito: number;
  /** Cuánto se mece la strato desde la correa. */
  guitarra: number;
  /** El pucho: cuánto se sacude, cuánto mide la ceniza, cuánto se prende la brasa y la luz que le da en la cara. */
  pucho: number;
  ceniza: number;
  brasa: number;
  /** El humo que larga: dónde está (en el títere), cuánto creció y cuánto se ve. */
  humo: { x: number; y: number; k: number; o: number };
  /** Lo que sacó de la caja, en la mano: cuánto se ve. */
  botin: number;
}

/** Adónde mira, con la cabeza y los ojos. */
export const MIRADAS = {
  /** El muelle, abajo a la derecha: el ferry que sale, la planchada. Es lo que vigila. */
  muelle: { cabeza: 5, mira: [0.85, 0.45] as Punto },
  /** La rana rubia, en la misma pila: la alquiló, y se moría de ganas de matarla. */
  rana: { cabeza: 1, mira: [1, 0.05] as Punto },
  /** El farol de sodio, que le da de costado. */
  farol: { cabeza: -2, mira: [1, 0.3] as Punto },
  /** A vos, de reojo. */
  vos: { cabeza: -3, mira: [-0.35, 0.15] as Punto },
  /** La caja, abajo a la izquierda. */
  caja: { cabeza: 12, mira: [-1, 0.9] as Punto },
  /** Para arriba: el grito. */
  arriba: { cabeza: -13, mira: [0.3, -1] as Punto },
} as const;

/** El largo de la ceniza en la pose quieta, y el más largo que llega: nunca se cae. */
export const CENIZA = { quieta: 5.5, maxima: 11 } as const;

/** La pose quieta, la del HTML: sentado en el canto, con el pucho en la boca, vigilando el muelle. */
export const QUIETA: Momento = {
  parado: 0,
  inclina: 0,
  respira: 0,
  patas: [0, 0],
  manos: [null, null],
  caja: null,
  cabeza: MIRADAS.muelle.cabeza,
  mira: MIRADAS.muelle.mira,
  parpados: [0.32, 0.36],
  grito: 0,
  guitarra: 0,
  pucho: 0,
  ceniza: CENIZA.quieta,
  brasa: 0.3,
  humo: { x: 0, y: 0, k: 1, o: 0 },
  botin: 0,
};

/** La caja arriba de la cabeza, parado: un poco torcida, como se levanta lo que pesa. */
export const CAJA_ARRIBA: Lugar = { x: 2, y: -87, giro: -4 };
/** De dónde la agarra con cada mano: las esquinas de abajo de la caja, del lado de atrás. */
export const AGARRE_CAJA: readonly [Punto, Punto] = [[-15.5, -4], [15.5, -4]];
/** Adónde mete la mano para rapiñar: adentro de la caja, detrás del frente. */
export const ADENTRO_CAJA: Punto = [4, -10];

/** Un punto de la caja (en su dibujo, con el medio de abajo en 0, 0), llevado al títere. */
export const enLaCaja = (p: Punto, c: Lugar): Punto => {
  const [x, y] = rotar(p, [0, 0], c.giro);
  return [x + c.x, y + c.y];
};

/** La caja quieta arriba del container, en el títere, para una cadera dada. */
export const cajaEnSuLugar = (cadera: Punto): Lugar => {
  const [x, y] = alTitere([CAJA.x, LUGAR.piso], cadera);
  return { x, y, giro: 0 };
};

/** La pose del grito, quieta: la que se ve tocándolo con movimiento reducido, y la del retrato. */
export const ALZADA: Momento = {
  ...QUIETA,
  parado: 1,
  // Se tira un poco para atrás, del lado de la izquierda: el que grita para arriba.
  inclina: -4,
  manos: [enLaCaja(AGARRE_CAJA[0], CAJA_ARRIBA), enLaCaja(AGARRE_CAJA[1], CAJA_ARRIBA)],
  caja: CAJA_ARRIBA,
  cabeza: MIRADAS.arriba.cabeza,
  mira: MIRADAS.arriba.mira,
  parpados: [0.12, 0.14],
  grito: 1,
  brasa: 0.6,
};

/* ------------------------------------------------------------------
   La pose: del momento a cada pieza
   ------------------------------------------------------------------ */

/** Lo que el pecho sube al respirar, en el títere. */
const RESPIRA = 0.9;

/** Lo que el torso hace con un punto del cuerpo: lo levanta al respirar y lo gira en la cadera. */
const delTorso = (p: Punto, m: Momento): Punto => rotar([p[0], p[1] - m.respira * RESPIRA], [0, 0], m.inclina);

/** Cuánto se acorta el muslo visto de frente (sentado le apunta a quien mira) y cuánto la pierna al subirla. */
export const acorte = (parado: number): { muslo: number; pierna: number } => ({
  muslo: mezcla(0.5, 1, parado),
  pierna: 1 - 0.68 * Math.sin(Math.PI * Math.min(1, Math.max(0, parado))),
});

/** Para qué lado se dobla cada codo. */
const DOBLA: readonly [Punto, Punto] = [[-1, 0.15], [1, 0.15]];

export interface Pose {
  cadera: Punto;
  /** Los hombros y el cuello donde quedan, en el títere. */
  hombros: readonly [Punto, Punto];
  cuello: Punto;
  brazos: readonly [Brazo, Brazo];
  /** Cada pierna: cuánto gira y se acorta el muslo, dónde queda la rodilla, y cuánto gira y se acorta la pierna. */
  piernas: readonly [Pierna, Pierna];
  caja: Lugar;
}

/** Un brazo: cuánto gira en el hombro y en el codo, dónde quedan el codo y la mano, y cuánto se acorta el de arriba. */
export interface Brazo {
  arriba: number;
  abajo: number;
  codo: Punto;
  punta: Punto;
  acorte: number;
}

export interface Pierna {
  giro: number;
  acorte: number;
  rodilla: Punto;
  giroPierna: number;
  acortePierna: number;
  suela: Punto;
}

const entre01 = (v: number): number => Math.min(1, Math.max(0, v));

/**
 * Un brazo que lleva la mano a `meta`. Cuando la mano va a la cara (a darle un golpecito al pucho, a
 * mirar lo que sacó de la caja) el brazo de arriba apunta para adelante, a quien mira, y de frente se
 * ve más corto: así el codo baja pegado al cuerpo en vez de abrirse como un saludo. Es el mismo
 * escorzo que el muslo cuando se sienta, y entra y sale de a poco, sin saltos.
 */
export function brazoA(n: 0 | 1, hombro: Punto, meta: Punto): { arriba: number; abajo: number; codo: Punto; punta: Punto; acorte: number } {
  const A = PIBE_ARMADO;
  const dx = Math.abs(meta[0] - A.cuello[0]);
  const cara = entre01((-30 - meta[1]) / 10) * entre01((meta[1] + 64) / 10) * entre01((24 - dx) / 6);
  // Lo justo para que la mano llegue doblando el codo: el antebrazo sube y el brazo baja apenas menos.
  const lejos = Math.hypot(meta[0] - hombro[0], meta[1] - hombro[1]);
  const justo = entre01((A.largos.antebrazo - lejos * 0.8) / A.largos.brazo);
  const acorte = mezcla(1, Math.max(0.45, Math.min(1, justo)), cara);
  // El codo baja delante del pecho, un poco para adentro.
  const dobla: Punto = [mezcla(DOBLA[n][0], -DOBLA[n][0] * 0.3, cara), mezcla(DOBLA[n][1], 1, cara)];
  return { ...alcanzar(hombro, A.largos.brazo * acorte, A.largos.antebrazo, meta, dobla), acorte };
}

/** Dónde apoya cada mano cuando no hace nada: en el canto, al lado de la cadera, o colgando si está parado. */
export function manoQuieta(n: 0 | 1, cadera: Punto = caderaEn(0), parado = 0, hombro: Punto = PIBE_ARMADO.hombros[n]): Punto {
  const lado = n === 0 ? -1 : 1;
  const enElCanto = alTitere([LUGAR.x + lado * 14, LUGAR.piso], cadera);
  const colgando: Punto = [hombro[0] + lado * 4, hombro[1] + 49];
  return [mezcla(enElCanto[0], colgando[0], parado), mezcla(enElCanto[1], colgando[1], parado)];
}

export function pose(m: Momento): Pose {
  const A = PIBE_ARMADO;
  const cadera = caderaEn(m.parado);
  const hombros = [delTorso(A.hombros[0], m), delTorso(A.hombros[1], m)] as const;
  const cuello = delTorso(A.cuello, m);
  const brazos = ([0, 1] as const).map((n) => {
    const meta = m.manos[n] ?? manoQuieta(n, cadera, m.parado, hombros[n]);
    const r = brazoA(n, hombros[n], meta);
    return { arriba: r.arriba, abajo: r.abajo, punta: r.punta, codo: r.codo, acorte: r.acorte };
  }) as unknown as Pose['brazos'];
  const { muslo, pierna } = acorte(m.parado);
  const piernas = ([0, 1] as const).map((n) => {
    const lado = n === 0 ? -1 : 1;
    // Sentado en el canto, las rodillas abiertas y los pies juntos, colgando; parado, plantado.
    const giro = -lado * mezcla(26, 9, m.parado);
    const [hx, hy] = A.caderas[n];
    const rodilla = rotar([hx, hy + A.largos.muslo * muslo], [hx, hy], giro);
    // Patea: la pierna va y viene, y cuando va para adelante se ve más corta.
    const patea = m.patas[n] * (1 - m.parado);
    const giroPierna = lado * mezcla(10, -4, m.parado) + patea * 7;
    const acortePierna = pierna * (1 - 0.14 * Math.max(0, patea));
    const suela = rotar([rodilla[0], rodilla[1] + A.largos.pierna * acortePierna], rodilla, giroPierna);
    return { giro, acorte: muslo, rodilla, giroPierna, acortePierna, suela };
  }) as unknown as Pose['piernas'];
  return { cadera, hombros, cuello, brazos, piernas, caja: m.caja ?? cajaEnSuLugar(cadera) };
}

/** Un punto de la cabeza (en su dibujo) llevado al títere, con el torso y la cabeza como están. */
export function enLaCabeza(p: Punto, m: Momento): Punto {
  const A = PIBE_ARMADO;
  const cuello = delTorso(A.cuello, m);
  const grande: Punto = [A.cuello[0] + (p[0] - A.cuello[0]) * A.agranda, A.cuello[1] + (p[1] - A.cuello[1]) * A.agranda];
  const [x, y] = rotar(grande, A.cuello, m.inclina + m.cabeza);
  return [x + cuello[0] - A.cuello[0], y + cuello[1] - A.cuello[1]];
}

/** Dónde le queda el pucho en la boca, en el títere: de ahí sale el humo y ahí va el dedo a golpearlo. */
export const puchoEn = (m: Momento): Punto => enLaCabeza([PIBE_ARMADO.labio[0], PIBE_ARMADO.labio[1] + m.grito * 2.4], m);

/** Cuánto se corre la pupila adentro del ojo. */
export const MIRA = [1.1, 0.55] as const;

/** De dónde baja cada párpado: el borde de arriba del ojo. */
export const PIVOTES_PARPADO: readonly Punto[] = PIBE_ARMADO.ojos.map(({ centro: [cx, cy], radio: [, ry] }) => [cx, Math.round((cy - ry - 0.4) * 10) / 10] as const);

/** El pucho cuelga de la comisura, para abajo y hacia el farol. */
export const PUCHO = { giro: 24, largo: 6.2 } as const;

const n2 = (v: number): string => v.toFixed(2);

/**
 * Las transformaciones y las opacidades de cada parte de la página para un momento: las escribe el
 * dibujo en el HTML (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = PIBE_ARMADO;
  const p = pose(m);
  const torso = `rotate(${n2(m.inclina)} 0 0) translate(0 ${n2(-m.respira * RESPIRA)})`;
  const t: Record<string, string> = {
    entero: `translate(${n2(p.cadera[0])} ${n2(p.cadera[1])}) scale(${LUGAR.escala})`,
    torso,
    guitarra: `${torso} rotate(${n2(m.guitarra)} ${A.correa[0]} ${A.correa[1]})`,
    cabeza:
      `translate(${n2(p.cuello[0] - A.cuello[0])} ${n2(p.cuello[1] - A.cuello[1])}) rotate(${n2(m.inclina + m.cabeza)} ${A.cuello[0]} ${A.cuello[1]}) ` +
      `translate(${A.cuello[0]} ${A.cuello[1]}) scale(${A.agranda}) translate(${-A.cuello[0]} ${-A.cuello[1]})`,
    pucho: `translate(${A.labio[0]} ${n2(A.labio[1] + m.grito * 2.4)}) rotate(${n2(PUCHO.giro + m.pucho)})`,
    ceniza: `translate(${PUCHO.largo} 0) scale(${(m.ceniza / 10).toFixed(3)} 1)`,
    caja: `translate(${n2(p.caja.x)} ${n2(p.caja.y)}) rotate(${n2(p.caja.giro)})`,
    humo: `translate(${n2(m.humo.x)} ${n2(m.humo.y)}) scale(${m.humo.k.toFixed(3)})`,
  };
  for (const n of [1, 2] as const) {
    const i = n - 1;
    const [sx, sy] = A.hombros[i];
    const ahora = p.hombros[i];
    const b = p.brazos[i];
    // El brazo de arriba se acorta en el hombro; el antebrazo, que va adentro, deshace ese acorte y
    // gira en el codo donde quedó.
    const k = b.acorte;
    const l = A.largos.brazo;
    t[`brazo-${n}`] = `translate(${n2(ahora[0] - sx)} ${n2(ahora[1] - sy)}) rotate(${n2(b.arriba)} ${sx} ${sy})` +
      (k < 0.9995 ? ` translate(${sx} ${sy}) scale(1 ${k.toFixed(3)}) translate(${-sx} ${-sy})` : '');
    t[`mano-${n}`] = (k < 0.9995 ? `translate(${sx} ${sy}) scale(1 ${(1 / k).toFixed(4)}) translate(${-sx} ${-sy}) translate(0 ${n2(l * k - l)}) ` : '') +
      `rotate(${n2(b.abajo)} ${sx} ${sy + l})`;
    const q = p.piernas[i];
    const [hx, hy] = A.caderas[i];
    t[`muslo-${n}`] = `rotate(${n2(q.giro)} ${hx} ${hy}) translate(${hx} ${hy}) scale(1 ${q.acorte.toFixed(3)}) translate(${-hx} ${-hy})`;
    const [kx, ky] = [hx, hy + A.largos.muslo];
    t[`pierna-${n}`] =
      `translate(${n2(q.rodilla[0] - kx)} ${n2(q.rodilla[1] - ky)}) rotate(${n2(q.giroPierna)} ${kx} ${ky}) ` +
      `translate(${kx} ${ky}) scale(1 ${q.acortePierna.toFixed(3)}) translate(${-kx} ${-ky})`;
    t[`pupila-${n}`] = `translate(${n2(m.mira[0] * MIRA[0])} ${n2(m.mira[1] * MIRA[1])})`;
    const [px, py] = PIVOTES_PARPADO[i]!;
    t[`parpado-${n}`] = `translate(${px} ${py}) scale(1 ${n2(m.parpados[i]!)}) translate(${-px} ${-py})`;
  }
  const o: Record<string, string> = {
    grito: n2(m.grito),
    brasa: n2(0.45 + 0.55 * m.brasa),
    resplandor: n2(m.brasa),
    humo: n2(m.humo.o),
    botin: n2(m.botin),
  };
  return { transform: t, opacity: o };
}

/**
 * Dónde dice su verso: abajo de él, sobre los containers. Arriba de la pila no queda lugar para el
 * bocadillo, y así no le tapa el grito.
 */
export const VERSO: Punto = [LUGAR.x, LUGAR.piso + 30];
