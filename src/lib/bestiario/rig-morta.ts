/**
 * Los números del Morta (`D-73`, decimoquinta vuelta): dónde está parado en el templo de Momo, cómo
 * está armado y qué pose tiene. Los lee el dibujo (`arte-morta.ts`), para la pose quieta que va en el
 * HTML y para el retrato, y la conducta (`scripts/bestiario/morta.ts`), que se lleva esto y nada que
 * dibuje. La pose se calcula acá, así la del HTML y la de la isla son la misma cuenta.
 *
 * Dos sistemas de coordenadas:
 * - **El del títere**: el (0, 0) es el piso, entre las dos pezuñas; arriba es negativo. Se dibuja a esta
 *   medida y la escena lo achica con `MORTA.escala`.
 * - **El del recinto** (900 × 640): el templo de `escenaTemplo`, con el medallón de Momo colgado en el
 *   medio (`MOMO`, en `rig.ts`).
 *
 * La cabeza se dibuja acostada, con el hocico para la izquierda y la nuca en el (0, 0) (`CABEZA_LOCAL`),
 * y se cuelga del pescuezo girada (`MORTA_ARMADO.cabeza`).
 */

export type Punto = readonly [number, number];

/** Dónde está parado: entre el medallón y la columna de la derecha, delante de los gallos. */
export const MORTA = { x: 660, piso: 584, escala: 0.55 } as const;

/** Cómo está armado, en las coordenadas del títere. La 1 es su derecha (la izquierda de quien mira). */
export const MORTA_ARMADO = {
  /** Alrededor de este punto se escora: es donde apoya las dos pezuñas. */
  apoyo: [0, -4] as Punto,
  /** La cintura: de acá se dobla el torso, y de acá cuelga el toallón. */
  cintura: [0, -190] as Punto,
  hombros: [[-50, -267], [50, -265]] as readonly [Punto, Punto],
  /** El brazo hasta el codo, y el antebrazo hasta el medio de la mano. */
  largos: { brazo: 58, antebrazo: 60 },
  /** El pescuezo de caballo nace de los hombros de tipo, y la cabeza se cuelga de la nuca. */
  cuello: [-4, -268] as Punto,
  nuca: [-22, -344] as Punto,
  /** Cuánto gira la cabeza en reposo: el hocico para abajo y para la izquierda, para el lado del medallón. */
  cabeza: -50,
  /** De dónde salen las patas, debajo del toallón, y cuánto miden hasta el piso. */
  caderas: [[-21, -118], [21, -118]] as readonly [Punto, Punto],
  /** Dónde nace la cola, debajo del toallón, atrás. */
  cola: [26, -142] as Punto,
  /** El nudo del toallón, en la cadera izquierda: ahí lo agarra la mano 2. */
  nudo: [33, -184] as Punto,
  /** El ruedo del toallón, y por dónde gotea el aceite: debajo, entre las patas. */
  ruedo: -100,
  gotera: [13, -102] as Punto,
} as const;

/** Lo de la cabeza, en sus coordenadas: la nuca en el (0, 0), el hocico para la izquierda. */
export const CABEZA_LOCAL = {
  /** El ojo de persona, de costado: el blanco impreso, la pupila y el párpado de la página. */
  ojo: { centro: [-42, -1] as Punto, radio: [9.6, 6.2] as Punto },
  /** La articulación de la quijada, detrás del cachete. */
  atm: [-14, 9] as Punto,
  /** De dónde giran las orejas. */
  orejas: [-6, -16] as Punto,
  /** La punta del hocico y la comisura: el test mira que queden en la cabeza. */
  hocico: [-114, 4] as Punto,
  comisura: [-94, 13] as Punto,
} as const;

const rad = (g: number): number => (g * Math.PI) / 180;
const n2 = (v: number): string => (Math.round(v * 100) / 100).toFixed(2);
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;

/** Gira un punto `g` grados alrededor de un pivote (el giro de SVG: positivo es como las agujas del reloj). */
export function girado([x, y]: Punto, g: number, [px, py]: Punto = [0, 0]): Punto {
  const [c, s] = [Math.cos(rad(g)), Math.sin(rad(g))];
  return [px + (x - px) * c - (y - py) * s, py + (x - px) * s + (y - py) * c];
}

/**
 * Un brazo de dos tramos que lleva la mano a un punto. Se dibujan derechos para abajo desde el hombro;
 * devuelve cuánto gira el brazo en el hombro y cuánto el antebrazo en el codo (anidado), con el codo
 * para el lado de `dobla`.
 */
export function alcanzar(raiz: Punto, l1: number, l2: number, meta: Punto, dobla: Punto): { brazo: number; antebrazo: number; codo: Punto; mano: Punto } {
  const [sx, sy] = raiz;
  const lejos = Math.hypot(meta[0] - sx, meta[1] - sy);
  const d = Math.min(l1 + l2 - 0.5, Math.max(Math.abs(l1 - l2) + 0.5, lejos));
  const phi = Math.atan2(meta[1] - sy, meta[0] - sx);
  const alfa = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const codos = [phi + alfa, phi - alfa].map((a) => [sx + Math.cos(a) * l1, sy + Math.sin(a) * l1] as const);
  const [mx, my] = [sx + Math.cos(phi) * d * 0.5, sy + Math.sin(phi) * d * 0.5];
  const cuanto = ([x, y]: Punto): number => (x - mx) * dobla[0] + (y - my) * dobla[1];
  const codo = cuanto(codos[0]!) >= cuanto(codos[1]!) ? codos[0]! : codos[1]!;
  const grados = (x: number, y: number): number => (Math.atan2(y, x) * 180) / Math.PI;
  const vuelta = (a: number): number => ((((a + 180) % 360) + 360) % 360) - 180;
  const brazo = vuelta(grados(codo[0] - sx, codo[1] - sy) - 90);
  const antebrazo = vuelta(grados(meta[0] - codo[0], meta[1] - codo[1]) - grados(codo[0] - sx, codo[1] - sy));
  const hasta = Math.hypot(meta[0] - codo[0], meta[1] - codo[1]) || 1;
  const mano: Punto = [codo[0] + ((meta[0] - codo[0]) / hasta) * l2, codo[1] + ((meta[1] - codo[1]) / hasta) * l2];
  return { brazo, antebrazo, codo, mano };
}

/** La pose entera: todo lo que la isla mueve, en grados y unidades del títere. */
export interface Pose {
  /** Cuánto se escora alrededor de las pezuñas: negativo es a estribor, su derecha. */
  escora: number;
  /** Lo que se levanta del piso al brincar. */
  salto: number;
  /** Cuánto se dobla el torso en la cintura, y cuánto le sube el pecho al respirar (0 a 1). */
  torso: number;
  respira: number;
  /** El pescuezo en su base, y la cabeza en la nuca, sumados a los de reposo. */
  cuello: number;
  cabeza: number;
  /** La quijada: 0 cerrada, 1 abierta del todo, como la boca que grita en el interior del disco. */
  quijada: number;
  /** Las orejas: negativo es para atrás, aplastadas. */
  orejas: number;
  /** Lo que se le resbaló el toallón para abajo. */
  toallon: number;
  /** Adónde van las manos, en el títere (sin escorar). */
  manos: readonly [Punto, Punto];
  /** Las patas en la cadera (al brincar las recoge), y la cola. */
  patas: readonly [number, number];
  cola: number;
  /** Adónde mira la pupila (de -1 a 1 en cada eje, en la cabeza) y cuánto baja el párpado. */
  mira: Punto;
  parpado: number;
}

/** Las manos quietas: la derecha cuelga al costado; la izquierda agarra el nudo del toallón. */
export const MANOS_QUIETAS: readonly [Punto, Punto] = [[-63, -162], [MORTA_ARMADO.nudo[0], MORTA_ARMADO.nudo[1]]];
/** Para qué lado se dobla cada codo: para afuera. */
export const DOBLA: readonly [Punto, Punto] = [[-1, 0.15], [1, 0]];

/**
 * Las dos poses quietas. **De pie** es la del HTML: escorado a estribor, la cabeza colgando para el lado
 * del medallón, los párpados a media asta del gin. **Relincha** es el verso: la cabeza para arriba, la
 * boca abierta del todo, las orejas aplastadas y la mano derecha en el aire.
 */
export const POSES: Readonly<Record<'de-pie' | 'relincha', Pose>> = {
  'de-pie': {
    escora: -4, salto: 0, torso: -1.5, respira: 0, cuello: 0, cabeza: 0, quijada: 0, orejas: -8, toallon: 0,
    manos: MANOS_QUIETAS, patas: [0, 0], cola: 0, mira: [0.35, 0.1], parpado: 0.42,
  },
  relincha: {
    escora: -7, salto: 0, torso: 3, respira: 1, cuello: 14, cabeza: 34, quijada: 1, orejas: -30, toallon: 3,
    manos: [[-112, -168], MANOS_QUIETAS[1]], patas: [0, 0], cola: -16, mira: [0.2, -0.6], parpado: 0.05,
  },
};

/** Cuántos grados baja la quijada abierta del todo. */
export const QUIJADA_ABRE = 30;

/** Cuánto se corre la pupila adentro del blanco, en la cabeza. */
export const MIRA: Punto = [3.2, 1.6];

/** De dónde baja el párpado: el borde de arriba del ojo. */
export const PIVOTE_PARPADO: Punto = [CABEZA_LOCAL.ojo.centro[0], CABEZA_LOCAL.ojo.centro[1] - CABEZA_LOCAL.ojo.radio[1] - 0.6];

/* ------------------------------------------------------------------
   Del títere al recinto
   ------------------------------------------------------------------ */

/** Un punto del cuerpo (sin escorar) en el títere, con la escora y el salto de la pose. */
export const escorado = (p: Punto, pose: Pose): Punto => {
  const [x, y] = girado(p, pose.escora, MORTA_ARMADO.apoyo);
  return [x, y - pose.salto];
};

/** Un punto del torso (antes de doblarlo) en el cuerpo. */
export const delTorso = (p: Punto, pose: Pose): Punto => girado([p[0], p[1]], pose.torso, MORTA_ARMADO.cintura);

/** Un punto del pescuezo (antes de girarlo) en el torso. */
export const delPescuezo = (p: Punto, pose: Pose): Punto => girado(p, pose.cuello, MORTA_ARMADO.cuello);

/** Un punto de la cabeza, en sus coordenadas, llevado al pescuezo. */
export const deLaCabeza = (p: Punto, pose: Pose): Punto => {
  const [x, y] = girado(p, MORTA_ARMADO.cabeza + pose.cabeza);
  return [x + MORTA_ARMADO.nuca[0], y + MORTA_ARMADO.nuca[1]];
};

/** Un punto de la cabeza, en el títere (con todo lo de arriba). */
export const cabezaEnTitere = (p: Punto, pose: Pose): Punto => escorado(delTorso(delPescuezo(deLaCabeza(p, pose), pose), pose), pose);

/** Del títere al recinto. */
export const alRecinto = ([x, y]: Punto): Punto => [MORTA.x + x * MORTA.escala, MORTA.piso + y * MORTA.escala];

/** Lo que gira cada brazo para llevar la mano a su meta (la meta va sin escorar; el brazo vive en el torso). */
export function brazos(pose: Pose): Array<ReturnType<typeof alcanzar>> {
  const A = MORTA_ARMADO;
  return [0, 1].map((n) => {
    // La meta está en el cuerpo; el hombro, en el torso, que se dobla: se la lleva al torso al revés.
    const meta = girado(pose.manos[n]!, -pose.torso, A.cintura);
    return alcanzar(A.hombros[n]!, A.largos.brazo, A.largos.antebrazo, meta, DOBLA[n]!);
  });
}

/** Dónde se forma la gota de aceite, en el títere: el ruedo del toallón, escorado con todo. */
export const goteraEn = (pose: Pose): Punto => {
  const [x, y] = MORTA_ARMADO.gotera;
  return escorado([x, y + pose.toallon], pose);
};

/** La mancha en el piso: debajo de la gotera, corrida un poco a estribor, que es para donde cae. */
export const MANCHA = { centro: [-8, 0] as Punto, ancho: 86, alto: 14 } as const;

/**
 * El chorro del relincho: sale de debajo del toallón y cae en arco, para adelante y a estribor, en la
 * mancha. `k` va de 0 a 1 por el chorro; devuelve el tramo que está en el aire, de `desde` a `hasta`
 * (en la parábola, de 0 a 1), y la parábola misma.
 */
export const CHORRO = { sale: [12, -103] as Punto, cae: [-42, -2] as Punto, alto: -8, dura: 0.9 } as const;

export function chorroEn(k: number): { desde: number; hasta: number } {
  if (k <= 0 || k >= 1) return { desde: 0, hasta: 0 };
  // La punta del chorro llega al piso en la primera mitad; la cola se suelta después y cae detrás.
  const hasta = Math.min(1, k / 0.42);
  const desde = Math.max(0, (k - 0.5) / 0.5);
  return { desde, hasta };
}

/**
 * Un punto de la parábola del chorro, en el títere sin escorar, de `t` 0 (sale) a 1 (cae): sale casi
 * de costado, con un empujón para afuera, y la gravedad lo dobla hasta el piso.
 */
export function enElChorro(t: number): Punto {
  const [x0, y0] = CHORRO.sale;
  const [x1, y1] = CHORRO.cae;
  return [mezcla(x0, x1, t), y0 + (y1 - y0) * t * t - CHORRO.alto * t * (1 - t)];
}

/**
 * El tramo de chorro que está en el aire, como `d`: el chorro lleno, que se afina de la salida a la
 * punta, o (`brillo`) el hilo de luz que le corre por el lomo de arriba.
 */
export function caminoDelChorro(k: number, pose: Pose, brillo = false): string {
  const { desde, hasta } = chorroEn(k);
  if (hasta - desde < 0.01) return 'M0 0';
  const eje: Punto[] = [];
  for (let i = 0; i <= 12; i++) eje.push(escorado(enElChorro(mezcla(desde, hasta, i / 12)), pose));
  const lado = (i: number, w: number): Punto => {
    const [a, b] = [eje[Math.max(0, i - 1)]!, eje[Math.min(eje.length - 1, i + 1)]!];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [eje[i]![0] - ((b[1] - a[1]) / l) * w, eje[i]![1] + ((b[0] - a[0]) / l) * w];
  };
  // Se afina: grueso donde sale (si todavía está pegado al toallón), finito en la punta.
  const ancho = (i: number): number => mezcla(desde === 0 ? 4.6 : 2.6, 1.6, i / 12);
  if (brillo) return `M${eje.slice(0, 10).map((_, i) => lado(i, ancho(i) * 0.45)).map(([x, y]) => `${n2(x)} ${n2(y)}`).join(' L')}`;
  const ida = eje.map((_, i) => lado(i, ancho(i)));
  const vuelta = eje.map((_, i) => lado(i, -ancho(i))).reverse();
  return `M${[...ida, ...vuelta].map(([x, y]) => `${n2(x)} ${n2(y)}`).join(' L')} Z`;
}

/** Dónde dice su verso: arriba de las orejas de la pose quieta, en el recinto. */
export const VERSO: Punto = (() => {
  const [x, y] = alRecinto(cabezaEnTitere([16, -50], POSES['de-pie']));
  return [Math.round(x), Math.round(y - 12)] as const;
})();

/**
 * Las transformaciones de cada parte de la página para una pose: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function transformes(p: Pose): Record<string, string> {
  const A = MORTA_ARMADO;
  const L = CABEZA_LOCAL;
  const [ax, ay] = A.apoyo;
  const [cx, cy] = A.cintura;
  const b = brazos(p);
  const t: Record<string, string> = {
    entero: `translate(${MORTA.x} ${MORTA.piso}) scale(${MORTA.escala})`,
    cuerpo: `translate(0 ${n2(-p.salto)}) rotate(${n2(p.escora)} ${ax} ${ay})`,
    toallon: `translate(0 ${n2(p.toallon)})`,
    // El pecho sube un poco al respirar: se estira desde la cintura.
    torso: `rotate(${n2(p.torso)} ${cx} ${cy}) translate(${cx} ${cy}) scale(${n2(1 + p.respira * 0.012)} ${n2(1 + p.respira * 0.02)}) translate(${-cx} ${-cy})`,
    pescuezo: `rotate(${n2(p.cuello)} ${A.cuello[0]} ${A.cuello[1]})`,
    cabeza: `translate(${A.nuca[0]} ${A.nuca[1]}) rotate(${n2(A.cabeza + p.cabeza)})`,
    quijada: `rotate(${n2(-p.quijada * QUIJADA_ABRE)} ${L.atm[0]} ${L.atm[1]})`,
    // Lo hondo de la boca gira la mitad: así llena la abertura entre los labios.
    boca: `rotate(${n2((-p.quijada * QUIJADA_ABRE) / 2)} ${L.atm[0]} ${L.atm[1]})`,
    orejas: `rotate(${n2(p.orejas)} ${L.orejas[0]} ${L.orejas[1]})`,
    cola: `rotate(${n2(p.cola)} ${A.cola[0]} ${A.cola[1]})`,
    pupila: `translate(${n2(p.mira[0] * MIRA[0])} ${n2(p.mira[1] * MIRA[1])})`,
    parpado: `translate(${PIVOTE_PARPADO[0]} ${PIVOTE_PARPADO[1]}) scale(1 ${n2(p.parpado)}) translate(${-PIVOTE_PARPADO[0]} ${-PIVOTE_PARPADO[1]})`,
  };
  for (const n of [0, 1] as const) {
    const [sx, sy] = A.hombros[n];
    t[`brazo-${n + 1}`] = `rotate(${n2(b[n]!.brazo)} ${sx} ${sy})`;
    t[`antebrazo-${n + 1}`] = `rotate(${n2(b[n]!.antebrazo)} ${sx} ${sy + A.largos.brazo})`;
    const [hx, hy] = A.caderas[n];
    t[`pata-${n + 1}`] = `rotate(${n2(p.patas[n])} ${hx} ${hy})`;
  }
  return t;
}

/** La mancha de aceite en el piso del recinto, de tamaño `k` (1 es la de siempre; crece con lo que cae). */
export function mancha(k: number): string {
  const [x, y] = alRecinto(MANCHA.centro);
  return `translate(${n2(x)} ${n2(y)}) scale(${n2(k)} ${n2(0.85 + k * 0.15)})`;
}

/** La gota que se forma en el ruedo, en el títere: `crece` de 0 a 1, `cae` lo que bajó hacia el piso. */
export function gota(pose: Pose, crece: number, cae: number): string {
  const [x, y] = goteraEn(pose);
  const piso = -1;
  const yy = mezcla(y, piso, Math.min(1, cae));
  const estira = cae > 0 ? 1.5 : 1 + crece * 0.25;
  const s = cae > 0 ? 1 : 0.25 + crece * 0.75;
  return `translate(${n2(x)} ${n2(yy)}) scale(${n2(s / Math.sqrt(estira))} ${n2(s * estira)})`;
}

/** La pose quieta, mezclada con la del relincho (`k` de 0 a 1): para el retrato y para mirarlo. */
export function entre(a: Pose, b: Pose, k: number): Pose {
  const m = (u: number, v: number): number => mezcla(u, v, k);
  const pm = (u: Punto, v: Punto): Punto => [m(u[0], v[0]), m(u[1], v[1])];
  return {
    escora: m(a.escora, b.escora), salto: m(a.salto, b.salto), torso: m(a.torso, b.torso), respira: m(a.respira, b.respira),
    cuello: m(a.cuello, b.cuello), cabeza: m(a.cabeza, b.cabeza), quijada: m(a.quijada, b.quijada), orejas: m(a.orejas, b.orejas),
    toallon: m(a.toallon, b.toallon), manos: [pm(a.manos[0], b.manos[0]), pm(a.manos[1], b.manos[1])],
    patas: [m(a.patas[0], b.patas[0]), m(a.patas[1], b.patas[1])], cola: m(a.cola, b.cola), mira: pm(a.mira, b.mira), parpado: m(a.parpado, b.parpado),
  };
}
