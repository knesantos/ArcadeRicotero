/**
 * Los números del Sheriff (`D-73`, vigesimonovena vuelta, `T-529`): dónde atiende su puestito de tiro al blanco en el
 * templo, cómo está armado y cómo se pone. Los lee el dibujo (`arte-sheriff.ts`), para la pose quieta del HTML y para
 * el retrato, y la conducta (`scripts/bestiario/sheriff.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del puestito**: el (0, 0) es el piso debajo del medio del mostrador; arriba es negativo. El sheriff atiende de
 *   frente, detrás del mostrador, con la tabla de los blancos arriba del sombrero.
 * - **El del recinto** (el del templo, que arranca antes del cero: `MARCO_DEL_RECINTO`): en el ala izquierda, contra
 *   la primera columna, donde estaban sus ojos. El templo va entero al camino, así que ahí queda igual.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde está el puestito, y lo que mide. El piso es el del templo. */
export const SHERIFF = { x: -232, piso: 588, escala: 0.8 } as const;

/** Cómo está armado, en sus coordenadas. */
export const SHERIFF_ARMADO = {
  /** El mostrador: de dónde a dónde, y a qué altura está su tapa. */
  mostrador: { desde: -80, hasta: 80, tapa: -76 },
  /** La repisa de los blancos: a qué altura apoyan, y dónde está cada lugar. El del medio es el de Alí Babá, que se fue. */
  repisa: -213,
  lugares: [-52, -26, 0, 26, 52] as readonly number[],
  /** Los cuatro ladroncitos que quedan: en qué lugar está cada uno, y para qué lado mira (los de la izquierda, espejados). */
  blancos: [{ x: -52, lado: -1 }, { x: -26, lado: -1 }, { x: 26, lado: 1 }, { x: 52, lado: 1 }] as readonly { x: number; lado: 1 | -1 }[],
  /** Cuánto se achica el ladroncito, que está dibujado de 40 de alto, para entrar en su lugar. */
  talla: 0.8,
  /** Donde pega el tiro que erra: en la tabla, entre el tercero y el cuarto. */
  yerro: [39, -244] as Punto,
  /** El clavo del cartelito de Alí Babá. */
  cartel: [-13, -259] as Punto,
  /** El cogote: de acá gira la cabeza. Los dos ojos, y lo que miden. */
  cuello: [-16, -147] as Punto,
  ojos: [[-23, -165], [-9, -165]] as readonly [Punto, Punto],
  ojo: [3.6, 3] as Punto,
  /** La estrella de lata, en el pecho. */
  estrella: [-24, -120] as Punto,
  /** El codo del brazo de cerca: de acá gira el antebrazo. Y la mano, apoyada en el mostrador, en la miel. */
  codo: [-50, -100] as Punto,
  mano: [-24, -79] as Punto,
  /** El hombro del brazo de lejos, y lo que mide ese brazo hasta la punta del dedo. */
  hombro: [12, -136] as Punto,
  largo: 101,
  /** El frasco de miel: el medio de la boca. Por ahí entra la moneda. */
  frasco: [23, -108] as Punto,
  /** De dónde cuelga la gota de miel, en el canto del mostrador. */
  gota: [-40, -66] as Punto,
} as const;

/** El medio del cuerpo del ladroncito de un lugar: donde le pega el tiro, o el dedo. */
export const pechoDe = (x: number): Punto => [x, SHERIFF_ARMADO.repisa - 25.8 * SHERIFF_ARMADO.talla];

/** Lo que gira el antebrazo para llegar a la estrella, y lo que cuelga el brazo de lejos cuando descansa (grados). */
export const A_LA_ESTRELLA = -78;
export const BRAZO_BAJO = 158;
/** Los párpados del sheriff cuando nadie lo toca: a media asta. */
export const ABURRIDO = 0.46;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export type Cuatro = readonly [number, number, number, number];
export type Tres = readonly [number, number, number];

export interface Momento {
  /** El aliento (−1 a 1): sube y baja apenas. */
  respira: number;
  /** La cabeza (grados), para dónde mira (corrimiento de las pupilas) y los párpados (0 abiertos, 1 cerrados). */
  cabeza: number;
  mira: readonly [number, number];
  parpado: number;
  /** El antebrazo de cerca (grados; 0 es la mano apoyada en el mostrador). */
  antebrazo: number;
  /** El brazo de lejos (0 colgando detrás del mostrador, 1 con el dedo en el tercer ladroncito) y el empujón (grados). */
  brazo: number;
  empuja: number;
  /** Los cuatro ladroncitos: cuánto está parado cada uno (1 parado, 0 volteado) y lo que tambalea (grados). */
  parados: Cuatro;
  tambalea: Cuatro;
  /** Los tres fogonazos (0 a 1) y el agujero del tiro que erra (0 a 1). */
  fogonazo: Tres;
  agujero: number;
  /** La moneda que cae al frasco: cuánto del viaje hizo (0 no está, 1 ya entró). */
  moneda: number;
  /** La moneda que se le queda pegada en los dedos (0 a 1). */
  pegada: number;
  /** El vaho en la estrella y el brillo que le saca (0 a 1). */
  vaho: number;
  brillo: number;
  /** La gota de miel que cuelga del mostrador: cuánto se estiró y cayó (0 a 1). */
  gota: number;
  /** El cartelito del que se fue, que se hamaca (grados). */
  cartel: number;
}

/** La pose quieta, la del HTML: atendiendo, aburrido, con la mano en la miel y los cuatro ladroncitos parados. */
export const QUIETO: Momento = {
  respira: 0,
  cabeza: 0,
  mira: [0, 0],
  parpado: ABURRIDO,
  antebrazo: 0,
  brazo: 0,
  empuja: 0,
  parados: [1, 1, 1, 1],
  tambalea: [0, 0, 0, 0],
  fogonazo: [0, 0, 0],
  agujero: 0,
  moneda: 0,
  pegada: 0,
  vaho: 0,
  brillo: 0,
  gota: 0,
  cartel: 0,
};

/**
 * *"Todo en su sitio así"*: dos ladroncitos volteados, el tiro que erró marcado en la tabla, y el sheriff, mirando
 * para otro lado, que tumba el tercero con el dedo. Es el toque quieto y el retrato.
 */
export const EMPUJA: Momento = {
  ...QUIETO,
  cabeza: -4,
  mira: [-2.2, 0.6],
  parpado: 0.6,
  brazo: 1,
  empuja: -3,
  parados: [0, 0, 0.62, 1],
  tambalea: [0, 0, 16, 0],
  fogonazo: [0, 0, 0.5],
  agujero: 1,
  moneda: 1,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [SHERIFF.x + x * SHERIFF.escala, SHERIFF.piso + y * SHERIFF.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const mezclar = (a: number, b: number, k: number): number => a + (b - a) * k;
const girar = ([x, y]: Punto, [cx, cy]: Punto, grados: number): Punto => {
  const a = (grados * Math.PI) / 180;
  return [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)];
};

/** Dónde está la mano de cerca para un giro del antebrazo. */
export const manoEn = (grados: number): Punto => girar(SHERIFF_ARMADO.mano, SHERIFF_ARMADO.codo, grados);

/** Cuánto mide el hilo de miel, dibujado: la isla lo estira de la mancha del mostrador a la mano. */
export const HILO = 20;

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = SHERIFF_ARMADO;
  const [nx, ny] = A.cuello;
  const [cx, cy] = A.codo;
  const [hx, hy] = A.hombro;
  const [fx, fy] = A.frasco;
  const [gx, gy] = A.gota;
  const [kx, ky] = A.cartel;
  const top = A.ojos[0][1] - A.ojo[1] - 0.6;
  // El hilo de miel va de donde estaba apoyada la mano a donde está ahora.
  const [mx, my] = manoEn(m.antebrazo);
  const [dx, dy] = [mx - A.mano[0], my - A.mano[1]];
  const largo = Math.hypot(dx, dy);
  // La gota: primero se estira, colgando; después se suelta y cae al piso.
  const estira = Math.min(1, m.gota / 0.6);
  const cae = Math.max(0, (m.gota - 0.6) / 0.4);
  const transform: Record<string, string> = {
    entero: `translate(${SHERIFF.x} ${SHERIFF.piso}) scale(${SHERIFF.escala})`,
    sheriff: `translate(0 ${n2(-0.7 * m.respira)})`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    pupilas: `translate(${n2(m.mira[0])} ${n2(m.mira[1])})`,
    parpados: `translate(0 ${n2(top)}) scale(1 ${n2(Math.max(0.02, m.parpado))}) translate(0 ${n2(-top)})`,
    antebrazo: `rotate(${n2(m.antebrazo)} ${cx} ${cy})`,
    'brazo-lejos': `rotate(${n2(mezclar(BRAZO_BAJO, 0, m.brazo) + m.empuja)} ${hx} ${hy})`,
    hilo: `translate(${A.mano[0]} ${A.mano[1] + 2}) rotate(${n2(largo > 0.01 ? (Math.atan2(dx, -dy) * 180) / Math.PI : 0)}) scale(1 ${n2(Math.max(0.02, largo / HILO))})`,
    moneda: `translate(${fx} ${n2(mezclar(fy - 190, fy + 8, m.moneda * m.moneda))}) rotate(${n2(540 * m.moneda)})`,
    gota: `translate(${gx} ${n2(gy + cae * cae * -gy)}) scale(${n2(1 - 0.3 * estira * (1 - cae))} ${n2(0.4 + 1.2 * estira * (1 - cae) + 0.6 * cae)})`,
    cartel: `rotate(${n2(m.cartel)} ${kx} ${ky})`,
  };
  A.blancos.forEach(({ x, lado }, i) => {
    const k = m.parados[i as 0]!;
    // Volteado queda acostado para atrás: se ve el canto, apenas.
    transform[`blanco-${i + 1}`] = `translate(${x} ${A.repisa}) rotate(${n2(m.tambalea[i as 0]!)}) scale(${n2(lado * A.talla)} ${n2(A.talla * Math.max(0.1, k))})`;
  });
  const opacity: Record<string, string> = {
    agujero: n2(m.agujero),
    moneda: m.moneda > 0.001 && m.moneda < 0.999 ? '1' : '0',
    pegada: n2(m.pegada),
    hilo: n2(m.pegada * Math.min(1, largo / 6)),
    vaho: n2(m.vaho),
    brillo: n2(m.brillo),
    gota: n2(m.gota > 0.001 && m.gota < 0.999 ? Math.min(1, m.gota * 6) : 0),
  };
  m.fogonazo.forEach((f, i) => (opacity[`fogonazo-${i + 1}`] = n2(f)));
  return { transform, opacity };
}

/** Dónde dice su verso: arriba del toldo, en el recinto. */
export const VERSO: Punto = alRecinto([10, -310]);
