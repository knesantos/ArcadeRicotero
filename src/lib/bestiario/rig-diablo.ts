/**
 * Los números del diablo que mea en todas partes (`D-73`, decimoquinta vuelta): dónde está parado en
 * el salón del infierno, cómo está armado y la cuenta de cada pose. Los lee el dibujo
 * (`arte-diablo.ts`), para la pose quieta que va en el HTML y para el retrato, y la conducta
 * (`scripts/bestiario/diablo.ts`), que se lleva esto y nada que dibuje. La misma cuenta pone al diablo
 * sin JavaScript y con la isla: no hay dos poses quietas que se puedan separar.
 *
 * Dos sistemas de coordenadas:
 * - **El del títere**: el (0, 0) es el piso, entre las dos pezuñas; arriba es negativo. Parado, de
 *   las pezuñas a la punta de los cuernos, mide unos 250, y la escena lo achica a la mitad.
 * - **El del recinto** (900 × 640): el diablo está contra la pared del fondo del salón, entre la puerta
 *   (140 a 220) y la piedra de Luzbelito (`LUZBELITO`, desde 360), y marca de costado a lo largo de la
 *   pared. Lo que cae al piso, el vapor y la sombra van en la capa de atrás, con el mismo marco.
 */

export type P = readonly [number, number];

/** El diablo en el recinto. */
export const DIABLO = {
  /** Donde está sin la isla: en el medio de lo que marca, entre la puerta y la piedra. */
  x: 318,
  /** El piso donde pisa: la segunda fila del damero, delante de la pared de fuego. */
  piso: 390,
  /** Del tamaño de la puerta del salón, que está más al fondo: con los cuernos, un poco más. */
  escala: 0.6,
  /**
   * Los lugares de la pared que va marcando. El de la izquierda no llega a los ojos del diablo de
   * muchos cuernos (en la puerta, x 180) y el de la derecha no se mete en la piedra de Luzbelito.
   */
  lugares: [272, 318, 346] as readonly number[],
  /** Lo más a la derecha que llega el chorro, en el recinto: el busto de Luzbelito empieza en 405. */
  hastaX: 392,
  /** Lo que avanza de costado por segundo, y lo que mide un paso. */
  velocidad: 24,
  zancada: 13,
} as const;

/** Cómo está armado, en las coordenadas del títere. Lo vemos de espaldas, girado apenas a su derecha. */
export const DIABLO_ARMADO = {
  /** De acá se mece el cuerpo entero (el frac, la cabeza, los brazos y la cola). */
  cadera: [-2, -104] as P,
  /** De acá cuelga cada pierna. La 1 es la izquierda de él, que es la de nuestra izquierda. */
  caderas: [[-12, -102], [13, -102]] as readonly [P, P],
  /** Lo que mide la pierna, de la cadera al piso, con la pezuña. */
  pierna: 102,
  /** Los hombros: el izquierdo queda del otro lado del cuerpo, un poco más bajo y más adentro. */
  hombros: [[-30, -165], [31, -168]] as readonly [P, P],
  /** El brazo derecho: del hombro al codo y del codo al medio de la palma. */
  largos: { brazo: 44, antebrazo: 46 },
  /** De acá gira la cabeza, la de la nuca y la que se da vuelta. */
  cuello: [-1, -181] as P,
  /** De acá sale la cola, arriba de la abertura de los faldones, y acá se dobla la punta. */
  cola: [0, -108] as P,
  codoDeLaCola: [-6, -60] as P,
  /** Por dónde sale el chorro: delante de él, donde no se ve. */
  sale: [9, -97] as P,
  /** La pelada entre los cuernos: donde estaba el gorro, y donde se palpa. */
  pelada: [2, -226] as P,
  /** El ojo de la cara que se da vuelta: el derecho, el único que te mira por encima del hombro. */
  ojo: { centro: [15.5, -205.5] as P, radio: [4.6, 2.9] as P },
} as const;

const A = DIABLO_ARMADO;

/** Un punto del títere, llevado al recinto con el diablo parado en `x`. */
export const enElRecinto = ([px, py]: P, x: number = DIABLO.x): P => [x + px * DIABLO.escala, DIABLO.piso + py * DIABLO.escala];

/** Rota `p` alrededor de `c`, en grados (positivo es como las agujas, como en SVG). */
export function rotar([x, y]: P, [cx, cy]: P, grados: number): P {
  const a = (grados * Math.PI) / 180;
  const [dx, dy] = [x - cx, y - cy];
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
}

/**
 * Un brazo de dos tramos que lleva la palma a un punto. Los tramos se dibujan colgando, para abajo;
 * devuelve cuánto gira el de arriba en el hombro y cuánto el de abajo adentro de él (así están
 * anidados en la página), con el codo para el lado de `dobla`.
 */
export function alcanzar(raiz: P, largo1: number, largo2: number, meta: P, dobla: P): { arriba: number; abajo: number; codo: P; punta: P } {
  const [sx, sy] = raiz;
  const lejos = Math.hypot(meta[0] - sx, meta[1] - sy);
  const d = Math.min(largo1 + largo2 - 0.5, Math.max(Math.abs(largo1 - largo2) + 0.5, lejos));
  const phi = Math.atan2(meta[1] - sy, meta[0] - sx);
  const alfa = Math.acos(Math.min(1, Math.max(-1, (largo1 * largo1 + d * d - largo2 * largo2) / (2 * largo1 * d))));
  const codos = [phi + alfa, phi - alfa].map((a) => [sx + Math.cos(a) * largo1, sy + Math.sin(a) * largo1] as const);
  const [mx, my] = [sx + Math.cos(phi) * d * 0.5, sy + Math.sin(phi) * d * 0.5];
  const cuanto = ([x, y]: P): number => (x - mx) * dobla[0] + (y - my) * dobla[1];
  const codo = cuanto(codos[0]!) >= cuanto(codos[1]!) ? codos[0]! : codos[1]!;
  const grados = (x: number, y: number): number => (Math.atan2(y, x) * 180) / Math.PI;
  const vuelta = (a: number): number => ((((a + 180) % 360) + 360) % 360) - 180;
  const arriba = vuelta(grados(codo[0] - sx, codo[1] - sy) - 90);
  const abajo = vuelta(grados(meta[0] - codo[0], meta[1] - codo[1]) - grados(codo[0] - sx, codo[1] - sy));
  const hasta = Math.hypot(meta[0] - codo[0], meta[1] - codo[1]) || 1;
  const punta: P = [codo[0] + ((meta[0] - codo[0]) / hasta) * largo2, codo[1] + ((meta[1] - codo[1]) / hasta) * largo2];
  return { arriba, abajo, codo, punta };
}

/** Dónde queda la palma con el brazo girado así: primero el antebrazo en el codo, después todo en el hombro. */
export function palma(arriba: number, abajo: number): P {
  const s = A.hombros[1];
  const codo: P = [s[0], s[1] + A.largos.brazo];
  const p: P = [s[0], codo[1] + A.largos.antebrazo];
  return rotar(rotar(p, codo, abajo), s, arriba);
}

/**
 * Dónde apoya la palma para palparse la pelada: en la nuca, y en la cara vuelta, que se corre a la
 * derecha. Arriba de todo, entre los cuernos: los dedos asoman por encima de la cabeza.
 */
export const PALPA: Readonly<Record<'nuca' | 'vuelta', P>> = { nuca: [3, -224], vuelta: [5, -229] };

/**
 * El chorro, en el títere: sale de delante de él, sube apenas y cae en el damero, más lejos (más
 * arriba en la pantalla) cuanto más fuerza tiene. `barrido` lo pasea de cerca a lejos: así marca en
 * todas partes. Con la fuerza que se acaba, cae cada vez más cerca, al lado de la pezuña.
 */
export function chorro(fuerza: number, barrido: number): { sale: P; control: P; cae: P } {
  const [sx, sy] = A.sale;
  const k = Math.max(0, Math.min(1, fuerza));
  const b = Math.max(0, Math.min(1, barrido));
  const cae: P = [27 + (46 + 70 * b) * k, -8 - (32 + 16 * b) * k];
  const control: P = [sx + (cae[0] - sx) * 0.55, Math.min(sy, cae[1]) - 16 * k - 5];
  return { sale: [sx, sy], control, cae };
}

/** El camino del chorro para la página. */
export function trazoDelChorro(fuerza: number, barrido: number): string {
  const { sale, control, cae } = chorro(fuerza, barrido);
  const n = (v: number): string => v.toFixed(1);
  return `M${n(sale[0])} ${n(sale[1])} Q${n(control[0])} ${n(control[1])} ${n(cae[0])} ${n(cae[1])}`;
}

/** Un vapor que sube de donde cayó: dónde, de qué tamaño y cuánto se ve, a `u` de su vida (0 a 1). */
export function vapor([x, y]: P, u: number, deriva: number): { x: number; y: number; s: number; o: number } {
  if (u < 0 || u >= 1) return { x, y, s: 0.4, o: 0 };
  return {
    x: x + deriva * u,
    y: y - 52 * u + 6 * u * u,
    s: 0.45 + 0.85 * u,
    o: Math.min(1, u / 0.12) * Math.pow(1 - u, 1.3) * 0.9,
  };
}

/** Todo lo que la isla le escribe al diablo en un cuadro. */
export interface Pose {
  /** Dónde está parado, en el recinto. */
  x: number;
  /** Lo que baja el cuerpo (al pisar, al sacudirse), y lo que se ladea, en grados. */
  bob: number;
  inclina: number;
  /** El aire en el pecho, de -1 a 1. */
  respira: number;
  /** El giro de cada pierna en la cadera (positivo, la pezuña va para la izquierda). */
  piernas: readonly [number, number];
  /** El brazo derecho: el giro en el hombro, en el codo, y si el antebrazo se ve (no se ve cuando la mano está adelante). */
  brazo: { arriba: number; abajo: number; ve: number };
  /** El brazo izquierdo, del otro lado del cuerpo. */
  izq: number;
  /** La nuca: cuánto gira. Y cuánto se dio vuelta a mirar (0 de espaldas, 1 por encima del hombro). */
  cabeza: number;
  vuelta: number;
  /** El ojo de la cara vuelta: adónde mira (de -1 a 1) y cuánto baja el párpado (0 abierto). */
  mira: P;
  parpado: number;
  /** La cola: el giro en la raíz y el de la punta. */
  cola: number;
  punta: number;
  /** El chorro: la fuerza (0, no mea), el barrido, y lo que corrió el chorro (para las gotas). */
  chorro: { fuerza: number; barrido: number; corre: number };
  /** El brillo en el piso donde cae, que no dura. */
  charco: { x: number; y: number; s: number; o: number };
  vapores: ReadonlyArray<{ x: number; y: number; s: number; o: number }>;
  chispas: ReadonlyArray<{ x: number; y: number; o: number }>;
}

/** Las poses de los gestos, en grados: la que tiene al estar, la de mear y la de palparse. */
export const GESTOS = {
  /** Esperando: los brazos colgando, apenas doblados (el codo para afuera), la cola caída. */
  espera: { piernas: [2.2, -2.4] as P, brazo: { arriba: 2, abajo: 6 }, izq: 2, cola: 8, punta: -14 },
  /**
   * Meando: las piernas abiertas, las manos adelante (el antebrazo no se ve) y la cola que se levanta
   * de gusto para el otro lado, lejos del chorro.
   */
  mea: { piernas: [4.6, -4.4] as P, brazo: { arriba: -9, abajo: 28 }, izq: -9, cola: 34, punta: 40 },
} as const;

const suave = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/**
 * Dónde se palpa la pelada, según cuánto se dio vuelta (de la nuca a la cara vuelta), y `alto` lo que
 * levanta la mano entre palmada y palmada.
 */
export function palpaEn(vuelta: number, alto = 0): P {
  const [a, b] = [PALPA.nuca, PALPA.vuelta];
  const k = Math.max(0, Math.min(1, vuelta));
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k - alto];
}

/**
 * El brazo derecho entre su pose de reposo y la palma en `meta`: `alza` va de 0 (el reposo, tal cual) a
 * 1 (la palma en la meta, con el codo para afuera y para arriba).
 *
 * Es como lo hace el cuerpo: el codo sube de costado y el antebrazo se dobla hacia adentro, por delante
 * del pecho, hasta que la mano asoma por encima del hombro y cae en la pelada. Por eso el antebrazo se
 * dobla antes de que el codo llegue arriba, y siempre para el mismo lado (el de la flexión). Si los dos
 * fueran juntos, a mitad de camino el brazo pasaría estirado, para el costado o para arriba, que es
 * otro gesto: ni se hace ni se le mete a Luzbelito.
 */
export function brazoAlzado(reposo: { arriba: number; abajo: number }, meta: P, alza: number): { arriba: number; abajo: number } {
  if (alza <= 0) return { arriba: reposo.arriba, abajo: reposo.abajo };
  const fin = alcanzar(A.hombros[1], A.largos.brazo, A.largos.antebrazo, meta, [1, -1]);
  let doblado = fin.abajo;
  while (doblado < reposo.abajo) doblado += 360;
  const k = Math.min(1, alza);
  const brazo = suave(k);
  const antebrazo = suave(Math.min(1, k * 1.5));
  return {
    arriba: reposo.arriba + (fin.arriba - reposo.arriba) * brazo,
    abajo: reposo.abajo + (doblado - reposo.abajo) * antebrazo,
  };
}

/** Si la mano se ve: por delante del cuerpo no, y asoma cuando pasa por encima del hombro. */
export const manoALaVista = (arriba: number, abajo: number): boolean => palma(arriba, abajo)[1] < A.hombros[1][1] - 4;

/** La pose del brazo que se palpa la pelada, con el codo para afuera, desde la pose de mear. */
export const palpa = (vuelta: number, alto = 0): { arriba: number; abajo: number } => brazoAlzado(GESTOS.mea.brazo, palpaEn(vuelta, alto), 1);

/** Donde cae el chorro de la pose quieta: lejos, contra el zócalo de la pared de fuego. */
const QUIETO = { fuerza: 1, barrido: 0.45 };

/**
 * La pose sin isla, que es la del HTML: meando contra la pared, mirando para arriba del alivio, con
 * dos vapores subiendo de donde cae. `pescado` es la del toque con movimiento reducido y la del
 * retrato: sigue meando, pero se dio vuelta a mirarte por encima del hombro, con la mano en la pelada.
 */
export function poseQuieta(pescado = false): Pose {
  const { cae } = chorro(QUIETO.fuerza, QUIETO.barrido);
  const g = GESTOS.mea;
  return {
    x: DIABLO.x,
    bob: 0,
    inclina: 0,
    respira: 0,
    piernas: g.piernas,
    brazo: pescado ? { ...palpa(1), ve: 1 } : { ...g.brazo, ve: 0 },
    izq: g.izq,
    cabeza: pescado ? 0 : -5,
    vuelta: pescado ? 1 : 0,
    mira: pescado ? [-0.55, 0.15] : [0, 0],
    parpado: pescado ? 0.42 : 0.2,
    cola: pescado ? 4 : g.cola,
    punta: pescado ? 18 : g.punta,
    chorro: { ...QUIETO, corre: 0 },
    charco: { x: cae[0], y: cae[1], s: 1, o: 0.6 },
    vapores: [vapor(cae, 0.32, 6), vapor(cae, 0.7, -4), vapor(cae, 1, 0)],
    chispas: [0, 1, 2].map(() => ({ x: cae[0], y: cae[1], o: 0 })),
  };
}

const n2 = (v: number): string => v.toFixed(2);

/** Lo que se escribe en cada parte de la página para una pose: atributos, por parte. */
export function transformes(p: Pose): Record<string, Record<string, string>> {
  const entero = `translate(${n2(p.x)} ${DIABLO.piso}) scale(${DIABLO.escala})`;
  const [cx, cy] = A.cadera;
  const [hx, hy] = A.hombros[1];
  const [ix, iy] = A.hombros[0];
  const [kx, ky] = A.cuello;
  const [ox, oy] = A.ojo.centro;
  const [, ry] = A.ojo.radio;
  const [colx, coly] = A.cola;
  const [px, py] = A.codoDeLaCola;
  const fuerza = p.chorro.fuerza;
  const d = trazoDelChorro(Math.max(0.02, fuerza), p.chorro.barrido);
  const t: Record<string, Record<string, string>> = {
    entero: { transform: entero },
    suelo: { transform: entero },
    cuerpo: { transform: `translate(0 ${n2(p.bob)}) rotate(${n2(p.inclina)} ${cx} ${cy}) translate(${cx} ${cy}) scale(1 ${(1 + p.respira * 0.012).toFixed(4)}) translate(${-cx} ${-cy})` },
    'pierna-1': { transform: `rotate(${n2(p.piernas[0])} ${A.caderas[0][0]} ${A.caderas[0][1]})` },
    'pierna-2': { transform: `rotate(${n2(p.piernas[1])} ${A.caderas[1][0]} ${A.caderas[1][1]})` },
    brazo: { transform: `rotate(${n2(p.brazo.arriba)} ${hx} ${hy})` },
    antebrazo: { transform: `rotate(${n2(p.brazo.abajo)} ${hx} ${hy + A.largos.brazo})`, opacity: n2(p.brazo.ve) },
    'brazo-izq': { transform: `rotate(${n2(p.izq)} ${ix} ${iy})` },
    // La nuca no se apaga hasta que la cara vuelta la tapa entera: a mitad del giro no se ve el fuego a
    // través de la cabeza.
    nuca: { transform: `rotate(${n2(p.cabeza + p.vuelta * 8)} ${kx} ${ky})`, opacity: p.vuelta < 0.97 ? '1.00' : '0.00' },
    vuelta: { transform: `rotate(${n2((1 - p.vuelta) * -9)} ${kx} ${ky})`, opacity: n2(p.vuelta) },
    pupila: { transform: `translate(${n2(p.mira[0] * 1.7)} ${n2(p.mira[1] * 0.9)})` },
    parpado: { transform: `translate(${ox} ${n2(oy - ry - 0.4)}) scale(1 ${n2(Math.max(0.02, p.parpado))}) translate(${-ox} ${n2(-(oy - ry - 0.4))})` },
    cola: { transform: `rotate(${n2(p.cola)} ${colx} ${coly})` },
    punta: { transform: `rotate(${n2(p.punta)} ${px} ${py})` },
    chorro: { d, 'stroke-dashoffset': n2(-p.chorro.corre), opacity: n2(Math.min(1, fuerza * 3)) },
    'chorro-halo': { d, opacity: n2(Math.min(1, fuerza * 3) * 0.5) },
    charco: { transform: `translate(${n2(p.charco.x)} ${n2(p.charco.y)}) scale(${n2(p.charco.s)})`, opacity: n2(p.charco.o) },
  };
  p.vapores.forEach((v, i) => {
    t[`vapor-${i + 1}`] = { transform: `translate(${n2(v.x)} ${n2(v.y)}) scale(${n2(v.s)})`, opacity: n2(v.o) };
  });
  p.chispas.forEach((c, i) => {
    t[`chispa-${i + 1}`] = { transform: `translate(${n2(c.x)} ${n2(c.y)})`, opacity: n2(c.o) };
  });
  return t;
}

/** Dónde dice su verso: arriba de los cuernos, así el bocadillo no le tapa la cara cuando te mira. */
export const VERSO = (x: number = DIABLO.x): P => [x, DIABLO.piso - 268 * DIABLO.escala];
