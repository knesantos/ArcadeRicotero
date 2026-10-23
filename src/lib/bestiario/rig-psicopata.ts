/**
 * Los números del buen psicópata (`D-73`, decimosexta vuelta): dónde está parado en el baldío, cómo
 * está armado él, cómo está armado su perro, dónde está el cuadro que mira y cómo se mueven los dos.
 * Los lee el dibujo (`arte-psicopata.ts`), para la pose quieta del HTML y para el retrato, y la
 * conducta (`scripts/bestiario/psicopata.ts`), que se lleva esto y nada que dibuje.
 *
 * Tres sistemas de coordenadas:
 * - **El del recinto** (900 × 640): el baldío (`escenaBaldio`), con la medianera arriba y el piso de
 *   tierra abajo. El cuadro, en su caballete, va en estas.
 * - **El del títere**: el (0, 0) es el piso entre los zapatos, arriba es negativo, y mira para la
 *   izquierda, al cuadro. Se dibuja a esta medida y la escena lo achica con `LUGAR.escala`.
 * - **El del perro**: el (0, 0) es el piso entre las patas, y también mira para la izquierda. El perro
 *   vive adentro del títere, en `PERRO.x`, y salta adentro de él.
 */

export type Punto = readonly [number, number];

/** El buen psicópata en el recinto: parado en la tierra del baldío, a la derecha del cuadro. */
export const LUGAR = { x: 566, piso: 600, escala: 0.55 } as const;

export const alRecinto = ([x, y]: Punto): Punto => [LUGAR.x + x * LUGAR.escala, LUGAR.piso + y * LUGAR.escala];
export const alTitere = ([x, y]: Punto): Punto => [(x - LUGAR.x) / LUGAR.escala, (y - LUGAR.piso) / LUGAR.escala];

/**
 * El cuadro, en el recinto: el fusilamiento de la tapa de *Bang! Bang!*, en su marco, parado en un
 * caballete en el medio del baldío, con la lamparita de museo arriba. `x`, `y` es el medio del cuadro;
 * `ancho` y `alto`, lo de adentro del marco; `marco`, cuánto mide el marco; `piso`, donde apoyan las
 * patas del caballete.
 */
export const CUADRO = { x: 392, y: 446, ancho: 92, alto: 82, marco: 7, piso: 594 } as const;

/** Cómo está armado él, en el títere. */
export const PSICOPATA_ARMADO = {
  /** De acá gira el cuerpo cuando se inclina a mirar el cuadro de cerca: las caderas. */
  cadera: [4, -196] as Punto,
  /** El cogote: de acá gira la cabeza. */
  cuello: [4, -318] as Punto,
  /** El hombro de este lado, y los largos del brazo y del antebrazo hasta el medio de la mano. */
  hombro: [-14, -300] as Punto,
  largos: { brazo: 66, antebrazo: 60 },
  /** La visera de la gorra: ahí lleva la mano para saludar. La gorra se levanta desde la nuca. */
  visera: [-32, -362] as Punto,
  nuca: [26, -360] as Punto,
  /** La cabeza se agranda desde el cogote: a la medida del cuerpo, la gorra de la tapa se perdía. */
  agranda: 1.24,
  /** El ojo de la cara vuelta, que te mira por encima del hombro. */
  ojo: { centro: [-10, -340] as Punto, radio: [3.6, 2.2] as Punto },
} as const;

/** Cómo está armado el perro, en el suyo. */
export const PERRO_ARMADO = {
  /** El medio del cuerpo: de ahí da la vuelta el salto mortal. */
  centro: [2, -38] as Punto,
  /** El pescuezo, de donde gira la cabeza (con la parabellum encima). */
  pescuezo: [-10, -54] as Punto,
  /** La cola, de donde se mueve. */
  cola: [20, -10] as Punto,
  /** El collar, de donde sale la correa. */
  collar: [-12, -52] as Punto,
  /** La boca del caño, en la cabeza, y para dónde apunta: de ahí sale la banderita. */
  boca: [-58, -100] as Punto,
  /** El ojo, con su párpado. */
  ojo: { centro: [-24, -70] as Punto, radio: [2.6, 2] as Punto },
} as const;

/** El perro en el títere: sentado entre él y el cuadro, mirando para el mismo lado. */
export const PERRO = { x: -150, y: 0, escala: 1.3 } as const;

/** Rota `p` alrededor de `c`, en grados (positivo es como las agujas, como en SVG). */
export function rotar([x, y]: Punto, [cx, cy]: Punto, grados: number): Punto {
  const a = (grados * Math.PI) / 180;
  const [dx, dy] = [x - cx, y - cy];
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
}

const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;
const entre01 = (v: number): number => Math.min(1, Math.max(0, v));
const vuelta180 = (a: number): number => ((((a + 180) % 360) + 360) % 360) - 180;

/**
 * Un brazo de dos tramos que lleva la mano a `meta`, con el codo para el lado de `dobla`. Devuelve
 * cuánto gira cada tramo respecto de colgar derecho, y dónde quedan el codo y la mano.
 */
export function alcanzar(raiz: Punto, l1: number, l2: number, meta: Punto, dobla: Punto): { arriba: number; abajo: number; codo: Punto; mano: Punto } {
  const [sx, sy] = raiz;
  const d = Math.min(l1 + l2 - 0.5, Math.max(Math.abs(l1 - l2) + 0.5, Math.hypot(meta[0] - sx, meta[1] - sy)));
  const phi = Math.atan2(meta[1] - sy, meta[0] - sx);
  const alfa = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const codos = [phi + alfa, phi - alfa].map((a) => [sx + Math.cos(a) * l1, sy + Math.sin(a) * l1] as const);
  const [mx, my] = [sx + Math.cos(phi) * d * 0.5, sy + Math.sin(phi) * d * 0.5];
  const cuanto = ([x, y]: Punto): number => (x - mx) * dobla[0] + (y - my) * dobla[1];
  const codo = cuanto(codos[0]!) >= cuanto(codos[1]!) ? codos[0]! : codos[1]!;
  const grados = (x: number, y: number): number => (Math.atan2(y, x) * 180) / Math.PI;
  const arriba = vuelta180(grados(codo[0] - sx, codo[1] - sy) - 90);
  const abajo = vuelta180(grados(meta[0] - codo[0], meta[1] - codo[1]) - grados(codo[0] - sx, codo[1] - sy));
  const hasta = Math.hypot(meta[0] - codo[0], meta[1] - codo[1]) || 1;
  const mano: Punto = [codo[0] + ((meta[0] - codo[0]) / hasta) * l2, codo[1] + ((meta[1] - codo[1]) / hasta) * l2];
  return { arriba, abajo, codo, mano };
}

/* ------------------------------------------------------------------
   El momento: lo que la conducta decide en cada cuadro
   ------------------------------------------------------------------ */

export interface Perro {
  /** Dónde está el perro, corrido de su lugar (en el títere), y cuánto da la vuelta entero. */
  x: number;
  y: number;
  giro: number;
  /** Cuánto se agacha para tomar envión, de 0 a 1. */
  agacha: number;
  /** La cabeza: cuánto gira en el pescuezo (negativo levanta el caño). */
  cabeza: number;
  /** Las orejas, que se paran o se tuercen, de -1 a 1; y la cola, que barre. */
  orejas: number;
  cola: number;
  /** El párpado. */
  parpado: number;
}

export interface Momento {
  /** Cuánto se inclina a mirar el cuadro de cerca, en grados (negativo es para el cuadro). */
  inclina: number;
  /** El pecho que sube y baja, de -1 a 1. */
  respira: number;
  /** Cuánto gira la cabeza en el cogote, y cuánto se dio vuelta a mirarte (de 0 a 1). */
  cabeza: number;
  vuelta: number;
  /** Adónde va la mano, en el títere; `null` es abajo, con la correa. */
  mano: Punto | null;
  /** Cuánto se levanta la gorra, de 0 a 1. */
  gorra: number;
  /** El párpado de la cara vuelta. */
  parpado: number;
  perro: Perro;
  /** La banderita que sale del caño, de 0 (adentro) a 1 (afuera del todo), y el humo del disparo. */
  bandera: number;
  humo: { k: number; o: number };
}

export const PERRO_QUIETO: Perro = { x: 0, y: 0, giro: 0, agacha: 0, cabeza: 0, orejas: 0, cola: 0, parpado: 0.2 };

/** La pose quieta, la del HTML: de espaldas, mirando el cuadro, con el perro sentado. */
export const QUIETA: Momento = {
  inclina: 0,
  respira: 0,
  cabeza: 0,
  vuelta: 0,
  mano: null,
  gorra: 0,
  parpado: 0.2,
  perro: PERRO_QUIETO,
  bandera: 0,
  humo: { k: 1, o: 0 },
};

/** Un punto de la cabeza (en su dibujo) llevado al títere con la cabeza agrandada, sin girar. */
const enLaCabezaQuieta = ([x, y]: Punto): Punto => {
  const [cx, cy] = PSICOPATA_ARMADO.cuello;
  return [cx + (x - cx) * PSICOPATA_ARMADO.agranda, cy + (y - cy) * PSICOPATA_ARMADO.agranda];
};

/** Dónde lleva la mano para saludar con la gorra: en la visera. */
export const SALUDO: Punto = enLaCabezaQuieta([PSICOPATA_ARMADO.visera[0] + 4, PSICOPATA_ARMADO.visera[1] + 8]);

/** La que saluda: el perro ya disparó y él te mira tocándose la gorra. Es la del toque quieto y la del retrato. */
export const SALUDA: Momento = { ...QUIETA, vuelta: 1, mano: SALUDO, gorra: 1, bandera: 1, perro: { ...PERRO_QUIETO, cabeza: -10, orejas: 1 } };

/* ------------------------------------------------------------------
   La pose: del momento a cada pieza
   ------------------------------------------------------------------ */

const RESPIRA = 1.6;

/** Lo que el cuerpo le hace a un punto de arriba de la cadera: lo inclina y lo levanta al respirar. */
const delCuerpo = (p: Punto, m: Momento): Punto => {
  const [x, y] = rotar(p, PSICOPATA_ARMADO.cadera, m.inclina);
  return [x, y - m.respira * RESPIRA];
};

/** Dónde queda la mano quieta: abajo y adelante, con la correa, como en la tapa. */
export const MANO_QUIETA: Punto = [-52, -196];

export function brazo(m: Momento): { arriba: number; abajo: number; codo: Punto; mano: Punto; hombro: Punto } {
  const A = PSICOPATA_ARMADO;
  const hombro = delCuerpo(A.hombro, m);
  const meta = m.mano ?? delCuerpo(MANO_QUIETA, m);
  // Abajo, el codo va para atrás, pegado al sobretodo; arriba, para adelante, como el que se saluda.
  const arriba = entre01((hombro[1] - meta[1] + 20) / 60);
  return { ...alcanzar(hombro, A.largos.brazo, A.largos.antebrazo, meta, [mezcla(0.8, -0.6, arriba), mezcla(0.3, 1, arriba)]), hombro };
}

/** Un punto del perro (en el suyo) llevado al títere, con el salto y la vuelta como están. */
export function enElPerro(p: Punto, q: Perro): Punto {
  const P = PERRO_ARMADO;
  const agachado: Punto = [p[0], p[1] * (1 - q.agacha * 0.18)];
  const [x, y] = rotar(agachado, P.centro, q.giro);
  return [x * PERRO.escala + PERRO.x + q.x, y * PERRO.escala + PERRO.y + q.y];
}

/** Un punto de la cabeza del perro (en el suyo) llevado al títere: gira en el pescuezo. */
export const enLaCabezaDelPerro = (p: Punto, q: Perro): Punto => enElPerro(rotar(p, PERRO_ARMADO.pescuezo, q.cabeza), q);

/**
 * La correa, de la mano al collar: larga, para que le alcance cuando saluda con la gorra y el perro
 * salta. Cuando sobra, cuelga en panza, pero nunca se mete en la tierra.
 */
export const CORREA = 340;
export function correa(m: Momento): { desde: Punto; hasta: Punto; panza: Punto } {
  const desde = brazo(m).mano;
  const hasta = enLaCabezaDelPerro(PERRO_ARMADO.collar, m.perro);
  const lejos = Math.hypot(hasta[0] - desde[0], hasta[1] - desde[1]);
  const floja = Math.max(0, CORREA - lejos);
  return { desde, hasta, panza: [(desde[0] + hasta[0]) / 2, Math.min(-6, (desde[1] + hasta[1]) / 2 + floja * 0.3)] };
}

const n2 = (v: number): string => v.toFixed(2);

/** La banderita va más grande que el caño: es el remate del chiste y se tiene que leer en un teléfono. */
export const BANDERA = 1.45;

/**
 * Las transformaciones, las opacidades y los trazos de cada parte para un momento: los escribe el
 * dibujo en el HTML (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string>; d: Record<string, string> } {
  const A = PSICOPATA_ARMADO;
  const P = PERRO_ARMADO;
  const b = brazo(m);
  const cuello = delCuerpo(A.cuello, m);
  const [hx, hy] = A.hombro;
  const [cx, cy] = A.cadera;
  const q = m.perro;
  const cuerpo = `rotate(${n2(m.inclina)} ${cx} ${cy}) translate(0 ${n2(-m.respira * RESPIRA)})`;
  // El perro: corrido, dado vuelta en su centro, y agachado desde el piso.
  const [pcx, pcy] = P.centro;
  const perro =
    `translate(${n2(PERRO.x + q.x)} ${n2(PERRO.y + q.y)}) scale(${PERRO.escala}) rotate(${n2(q.giro)} ${pcx} ${pcy}) scale(1 ${n2(1 - q.agacha * 0.18)})`;
  const transform: Record<string, string> = {
    entero: `translate(${n2(LUGAR.x)} ${n2(LUGAR.piso)}) scale(${LUGAR.escala})`,
    cuerpo,
    cabeza:
      `translate(${n2(cuello[0] - A.cuello[0])} ${n2(cuello[1] - A.cuello[1])}) rotate(${n2(m.cabeza)} ${A.cuello[0]} ${A.cuello[1]}) ` +
      `translate(${A.cuello[0]} ${A.cuello[1]}) scale(${A.agranda}) translate(${-A.cuello[0]} ${-A.cuello[1]})`,
    // La gorra se levanta desde la nuca: la visera sube, como cuando uno saluda.
    gorra: `rotate(${n2(-m.gorra * 14)} ${A.nuca[0]} ${A.nuca[1]}) translate(0 ${n2(-m.gorra * 4)})`,
    brazo: `translate(${n2(b.hombro[0] - hx)} ${n2(b.hombro[1] - hy)}) rotate(${n2(b.arriba)} ${hx} ${hy})`,
    antebrazo: `rotate(${n2(b.abajo)} ${hx} ${hy + A.largos.brazo})`,
    perro,
    'perro-cabeza': `rotate(${n2(q.cabeza)} ${P.pescuezo[0]} ${P.pescuezo[1]})`,
    'perro-cola': `rotate(${n2(q.cola * 22)} ${P.cola[0]} ${P.cola[1]})`,
    'perro-oreja': `rotate(${n2(q.orejas * 9)} -20 -84)`,
    // La banderita sale del caño estirándose a lo largo, y el humo se abre en la boca.
    bandera: `translate(${P.boca[0]} ${P.boca[1]}) scale(${n2(Math.max(0.02, m.bandera) * BANDERA)} ${n2((0.3 + 0.7 * Math.min(1, m.bandera * 1.6)) * BANDERA)})`,
    humo: `translate(${P.boca[0]} ${P.boca[1]}) scale(${n2(m.humo.k)})`,
    'parpado': `translate(${A.ojo.centro[0]} ${n2(A.ojo.centro[1] - A.ojo.radio[1])}) scale(1 ${n2(m.parpado)}) translate(${-A.ojo.centro[0]} ${n2(-(A.ojo.centro[1] - A.ojo.radio[1]))})`,
    'perro-parpado': `translate(${P.ojo.centro[0]} ${n2(P.ojo.centro[1] - P.ojo.radio[1])}) scale(1 ${n2(q.parpado)}) translate(${-P.ojo.centro[0]} ${n2(-(P.ojo.centro[1] - P.ojo.radio[1]))})`,
  };
  const c = correa(m);
  const d = { correa: `M${n2(c.desde[0])} ${n2(c.desde[1])} Q${n2(c.panza[0])} ${n2(c.panza[1])} ${n2(c.hasta[0])} ${n2(c.hasta[1])}` };
  const opacity: Record<string, string> = {
    // La cara vuelta se funde encima de la nuca, que no se apaga hasta que la tapa entera.
    nuca: m.vuelta < 0.98 ? '1.00' : '0.00',
    vuelta: n2(m.vuelta),
    bandera: m.bandera > 0.01 ? '1.00' : '0.00',
    humo: n2(m.humo.o),
  };
  return { transform, opacity, d };
}

/** Dónde dice su verso: arriba del cuadro, sobre la medianera. */
export const VERSO: Punto = [CUADRO.x + 60, CUADRO.y - CUADRO.alto / 2 - 30];
