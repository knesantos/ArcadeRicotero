/**
 * Los números de Porco Rex (`D-73`, decimosexta vuelta): por dónde trota en la nieve de Cybersiberia,
 * cómo está armado, cómo trota, cómo se revuelca y cómo se para en dos patas. Los lee el dibujo
 * (`arte-porco.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/porco.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del títere**: el (0, 0) es la nieve debajo de la panza, arriba es negativo, y mira para la
 *   derecha (para la tele grande); cuando trota para el otro lado, la isla lo da vuelta entero.
 * - **El del recinto** (900 × 640): Cybersiberia (`CYBER`, `rig-entornos.ts`). Trota en su campo de
 *   juego, a la izquierda de la tele, entre el camello y el robot; en el medio está el charco de barro
 *   donde se revuelca.
 *
 * En el camino la nieve se estira con `k` y el marco de Porco se corre entero, así que todo lo que hace
 * queda cerca de su ancla.
 */

export type Punto = readonly [number, number];

/**
 * Porco en el recinto: su campo de juego en la nieve de atrás, sobre el cable que sale de la tele,
 * entre el camello y el robot, y arriba de la tele chica del noticiero. Más abajo le tapaba la cara a
 * Drogocop y a las monjas.
 */
export const LUGAR = {
  x: 246,
  piso: 452,
  escala: 0.52,
  /** Hasta dónde trota para cada lado, en el recinto, desde el ancla. */
  ida: 30,
} as const;

/** El charco, en el títere quieto (debajo del ancla): ahí hoza y se revuelca. */
export const CHARCO = { x: 0, rx: 44, ry: 6 } as const;

/** Cómo está armado, en el títere. Las patas: la 1 y la 2 adelante, la 3 y la 4 atrás; la 1 y la 3 de este lado. */
export const PORCO_ARMADO = {
  /** El medio del cuerpo, y sus radios. */
  cuerpo: { centro: [0, -46] as Punto, radio: [48, 28] as Punto },
  /** De dónde gira la cabeza: el pescuezo. */
  pescuezo: [38, -52] as Punto,
  /** El medio de la cabeza, y la trompa, adelante. */
  cabeza: [58, -54] as Punto,
  trompa: [82, -48] as Punto,
  /** De dónde cuelga cada pata, y lo que mide hasta la pezuña. */
  patas: [[30, -30], [22, -30], [-28, -30], [-36, -30]] as readonly [Punto, Punto, Punto, Punto],
  pata: 30,
  /** De dónde sale la cola enrulada. */
  cola: [-48, -52] as Punto,
  /** Las orejas, de donde se doblan. */
  orejas: [[56, -74], [64, -76]] as readonly [Punto, Punto],
  /** La corona, de donde salta y se tuerce: arriba de la cabeza. */
  corona: [52, -80] as Punto,
  /** De dónde se para en dos patas: las caderas de atrás. */
  ancas: [-32, -32] as Punto,
  /** Los anteojos, sobre los ojos: ahí brilla la tele. */
  anteojos: [66, -60] as Punto,
  /** La cabeza se agranda desde el pescuezo: la cabezota con que asomó en *Alien Duce*. */
  agranda: 1.38,
} as const;

export const alRecinto = ([x, y]: Punto, desde = 0): Punto => [LUGAR.x + desde + x * LUGAR.escala, LUGAR.piso + y * LUGAR.escala];

/** Rota `p` alrededor de `c`, en grados (positivo es como las agujas, como en SVG). */
export function rotar([x, y]: Punto, [cx, cy]: Punto, grados: number): Punto {
  const a = (grados * Math.PI) / 180;
  const [dx, dy] = [x - cx, y - cy];
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
}

/* ------------------------------------------------------------------
   El momento: lo que la conducta decide en cada cuadro
   ------------------------------------------------------------------ */

export interface Momento {
  /** Dónde está, corrido del ancla (en el recinto), y para dónde mira: 1 a la derecha, -1 a la izquierda. */
  x: number;
  mira: 1 | -1;
  /** El rebote del trote, hacia arriba, en el títere. */
  rebote: number;
  /** Cuánto gira cada pata en su cadera, en grados. */
  patas: readonly [number, number, number, number];
  /** Cuánto se para en dos patas, de 0 a 1. */
  parado: number;
  /** Cuánto se echa en el barro, de 0 a 1, y cuánto se hamaca de costado mientras se revuelca. */
  echado: number;
  hamaca: number;
  /** La cabeza: cuánto gira (negativo la levanta), y la boca abierta, de 0 a 1. */
  cabeza: number;
  boca: number;
  /** Las orejas, que rebotan, y la cola, que da vueltas (grados). */
  orejas: number;
  cola: number;
  /** La corona: cuánto salta para arriba y cuánto se tuerce. */
  corona: { y: number; giro: number };
  /** El brillo de la tele en los anteojos, de 0 a 1. */
  brillo: number;
  /** El vaho que larga por la trompa, y el barro que salpica. */
  vaho: { k: number; o: number };
  salpica: number;
  /** La ceja, que asoma arriba de los anteojos: de 0 (tranquila) a 1 (bien arriba, cuando rockea). */
  ceja: number;
}

/** La pose quieta, la del HTML: parado en sus cuatro patas en el medio del campo, mirando la tele. */
export const QUIETA: Momento = {
  x: 0,
  mira: 1,
  rebote: 0,
  patas: [0, 0, 0, 0],
  parado: 0,
  echado: 0,
  hamaca: 0,
  cabeza: 0,
  boca: 0,
  orejas: 0,
  cola: 0,
  corona: { y: 0, giro: 0 },
  brillo: 0.3,
  vaho: { k: 1, o: 0 },
  salpica: 0,
  ceja: 0,
};

/** El de *Porno Rock*: parado en dos patas, con las pezuñas arriba haciendo los cuernos. Es la del toque quieto y la del retrato. */
export const ROCK: Momento = { ...QUIETA, parado: 1, cabeza: 22, boca: 1, brillo: 1, orejas: 1, ceja: 1, corona: { y: -6, giro: -10 }, patas: [0, 0, 6, -6] };

/* ------------------------------------------------------------------
   La pose: del momento a cada pieza
   ------------------------------------------------------------------ */

/** Cuánto gira el cuerpo cuando se para en dos patas: casi derecho, apoyado en las ancas. */
export const PARADO = -62;
/**
 * Cuánto más gira cada pata de adelante cuando se para, adentro del cuerpo: con el cuerpo parado,
 * quedan para arriba y para adelante, con la pezuña partida al cielo, que son los cuernos del rock.
 */
export const CUERNOS = -100;

const n2 = (v: number): string => v.toFixed(2);

/** Cuánto se hamaca de costado, en grados, cuando se revuelca: echado sobre la panza, con las patas dobladas. */
export const HAMACA = 8;

/** Lo que el cuerpo le hace a un punto: lo para en las ancas, lo echa en el barro y lo hamaca. */
export function delCuerpo(p: Punto, m: Momento): Punto {
  const A = PORCO_ARMADO;
  const parado = rotar(p, A.ancas, PARADO * m.parado);
  // Se echa doblando las patas antes de bajar la panza: así ninguna pezuña se mete en la nieve.
  const echado: Punto = [parado[0], parado[1] + m.echado * m.echado * 20 - m.rebote];
  return rotar(echado, [0, 0], m.hamaca * HAMACA);
}

/** Lo que gira cada pata adentro del cuerpo: el paso, los cuernos de las de adelante, las de atrás plantadas, y dobladas si se echa. */
export function giroDePata(n: 0 | 1 | 2 | 3, m: Momento): number {
  const adelante = n < 2;
  const extra = adelante ? (CUERNOS + (n === 1 ? 26 : 0)) * m.parado : -PARADO * m.parado;
  const dobla = m.echado * (adelante ? -90 : 90);
  return m.patas[n] + extra + dobla;
}

/** Dónde queda la pezuña de cada pata, en el títere. */
export function pezuna(n: 0 | 1 | 2 | 3, m: Momento): Punto {
  const A = PORCO_ARMADO;
  const cadera = delCuerpo(A.patas[n], m);
  const giro = PARADO * m.parado + m.hamaca * HAMACA + giroDePata(n, m);
  return rotar([cadera[0], cadera[1] + A.pata], cadera, giro);
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el
 * HTML (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = PORCO_ARMADO;
  const [ax, ay] = A.ancas;
  const [px, py] = A.pescuezo;
  const cuerpo = `rotate(${n2(m.hamaca * HAMACA)} 0 0) translate(0 ${n2(m.echado * m.echado * 20 - m.rebote)}) rotate(${n2(PARADO * m.parado)} ${ax} ${ay})`;
  const transform: Record<string, string> = {
    entero: `translate(${n2(LUGAR.x + m.x)} ${LUGAR.piso}) scale(${n2(LUGAR.escala * m.mira)} ${LUGAR.escala})`,
    cuerpo,
    cabeza: `rotate(${n2(m.cabeza)} ${px} ${py}) translate(${px} ${py}) scale(${A.agranda}) translate(${-px} ${-py})`,
    // La quijada se abre desde atrás de la trompa: el chillido.
    boca: `rotate(${n2(m.boca * 22)} 70 -42)`,
    'oreja-1': `rotate(${n2(-m.orejas * 24)} ${A.orejas[0][0]} ${A.orejas[0][1]})`,
    'oreja-2': `rotate(${n2(-m.orejas * 18)} ${A.orejas[1][0]} ${A.orejas[1][1]})`,
    cola: `rotate(${n2(m.cola)} ${A.cola[0]} ${A.cola[1]})`,
    corona: `translate(0 ${n2(m.corona.y)}) rotate(${n2(m.corona.giro)} ${A.corona[0]} ${A.corona[1]})`,
    vaho: `translate(${A.trompa[0] + 6} ${A.trompa[1] + 2}) scale(${n2(m.vaho.k)})`,
    ceja: `translate(0 ${n2(-m.ceja * 3)}) rotate(${n2(-m.ceja * 8)} 66 -66)`,
  };
  // Las patas van adentro del cuerpo: las de adelante suben con él, las de atrás se quedan plantadas.
  for (const n of [0, 1, 2, 3] as const) {
    const [hx, hy] = A.patas[n];
    transform[`pata-${n + 1}`] = `rotate(${n2(giroDePata(n, m))} ${hx} ${hy})`;
  }
  const opacity: Record<string, string> = {
    brillo: n2(m.brillo),
    vaho: n2(m.vaho.o),
    salpica: n2(m.salpica),
    // La boca abierta muestra lo de adentro: solo cuando chilla.
    adentro: n2(Math.min(1, m.boca * 2)),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de su campo de juego, debajo de la tele chica del noticiero no. */
export const VERSO: Punto = [LUGAR.x + 10, LUGAR.piso - 74];
