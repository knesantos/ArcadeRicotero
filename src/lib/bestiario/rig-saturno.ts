/**
 * Los números del Dr. Saturno (`D-73`, decimoctava vuelta): dónde atiende en el templo de Momo, cómo
 * está armado y cómo se pone. Los lee el dibujo (`arte-saturno.ts`), para la pose quieta del HTML y para
 * el retrato, y la conducta (`scripts/bestiario/saturno.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del títere**: el (0, 0) es el punto del piso debajo de él; arriba es negativo. No pisa: flota,
 *   y el guardapolvo termina en jirones. Está dibujado a dos veces y la escena lo achica con `ESCALA`.
 * - **El del recinto**: el templo, agrandado para los dos lados (`MARCO_DEL_RECINTO`). Atiende del lado de
 *   la columna de la derecha, lejos del Morta y de lo que se hamaca Momo.
 */

export type Punto = readonly [number, number];

/** Dónde atiende: el punto del piso debajo de él, y lo que mide. */
export const SATURNO = { x: 884, piso: 584, escala: 0.58 } as const;

/** Cómo está armado, en las coordenadas del títere. El brazo 1 es el de la izquierda (el turnero), el 2 el del estetoscopio. */
export const SATURNO_ARMADO = {
  /** El medio de la cara, y su óvalo (dibujado a esta medida y agrandado con `agranda`, desde el medio). */
  cara: [0, -354] as Punto,
  radioCara: [30, 38] as Punto,
  agranda: 1.2,
  /** De acá gira la cabeza (con el anillo puesto). */
  cuello: [0, -306] as Punto,
  /** El anillo: el medio, los radios de afuera y el ancho de la banda, y cuánto se ladea quieto (grados). */
  anillo: { centro: [0, -352] as Punto, rx: 94, ry: 23, banda: 16, ladeo: -13 },
  /** Los hombros: de acá gira cada brazo, que va entero, de la manga a la mano. */
  hombros: [[-44, -290], [44, -290]] as readonly [Punto, Punto],
  /** Las manos, con el brazo colgando quieto: el turnero en la 1, la campana del estetoscopio en la 2. */
  manos: [[-60, -150], [58, -160]] as readonly [Punto, Punto],
  /** La boca del turnero, de donde sale el boleto, en el brazo 1. */
  turnero: [-62, -138] as Punto,
  /** El espejo de frente, el de los doctores de antes: en la frente, donde da la vuelta la vincha. */
  espejo: [2, -380] as Punto,
  /** Las tres lunitas: en qué vuelta del anillo arrancan (radianes), y su radio. */
  lunas: [0.4, 2.5, 4.4] as const,
  radioLuna: 6,
  /** Hasta dónde baja el guardapolvo: termina en jirones, en el aire. */
  ruedo: -34,
} as const;

/* ------------------------------------------------------------------
   El momento: lo que la conducta decide en cada cuadro
   ------------------------------------------------------------------ */

export interface Momento {
  /** Cuánto flota sobre el piso, y cuánto se ladea el cuerpo entero (grados). */
  flota: number;
  inclina: number;
  /** Cuánto gira la cabeza en el cuello, y cuánto se ladea el anillo (grados, sumado al quieto). */
  cabeza: number;
  anillo: number;
  /** Por dónde van las lunitas en su vuelta (radianes, la primera; las otras van corridas). */
  lunas: number;
  /** Cuánto gira cada brazo en su hombro (grados; positivo es como las agujas). */
  brazos: readonly [number, number];
  /** El destello del espejo de frente y el halo de atrás de la cabeza, de 0 a 1. */
  espejo: number;
  halo: number;
  /** El boleto que da, en el recinto del títere: dónde, cuánto gira y cuánto se ve (0, guardado). */
  boleto: { x: number; y: number; giro: number; ve: number };
}

/** La pose quieta, la del HTML: flotando apenas, con el anillo ladeado y los brazos colgando. */
export const QUIETO: Momento = {
  flota: 26,
  inclina: 0,
  cabeza: 0,
  anillo: 0,
  lunas: 0,
  brazos: [0, 0],
  espejo: 0,
  halo: 0,
  boleto: { x: SATURNO_ARMADO.turnero[0], y: SATURNO_ARMADO.turnero[1], giro: 0, ve: 0 },
};

/**
 * *"Dr. Saturno, dame un turno!"*: el brazo del turnero para adelante, el boleto afuera, el anillo
 * desbocado y el halo prendido. Es el toque quieto y el retrato.
 */
export const TURNO: Momento = {
  ...QUIETO,
  flota: 34,
  inclina: -3,
  cabeza: -6,
  anillo: 9,
  lunas: 1.2,
  brazos: [38, -8],
  espejo: 1,
  halo: 1,
  boleto: { x: -112, y: -214, giro: -24, ve: 1 },
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

/** Gira `p` alrededor de `c`, en grados (positivo es como las agujas, como en SVG). */
export function rot([x, y]: Punto, [cx, cy]: Punto, grados: number): Punto {
  const a = (grados * Math.PI) / 180;
  const [dx, dy] = [x - cx, y - cy];
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
}

/** Un punto del títere, llevado al recinto, con lo que flota (sin el ladeo). */
export const alRecinto = ([x, y]: Punto, flota = QUIETO.flota): Punto => [SATURNO.x + x * SATURNO.escala, SATURNO.piso + (y - flota) * SATURNO.escala];

/**
 * Dónde va una lunita en el anillo, en las coordenadas del títere, y si pasa por adelante de la cabeza
 * (la mitad de abajo del anillo) o por detrás.
 */
export function enElAnillo(vuelta: number, ladeoExtra = 0): { punto: Punto; adelante: boolean } {
  const { centro, rx, ry, banda, ladeo } = SATURNO_ARMADO.anillo;
  const [cx, cy] = centro;
  const r = [rx - banda / 2, ry - banda * 0.12] as const;
  const p: Punto = [cx + Math.cos(vuelta) * r[0], cy + Math.sin(vuelta) * r[1]];
  return { punto: rot(p, centro, ladeo + ladeoExtra), adelante: Math.sin(vuelta) > 0 };
}

/** La boca del turnero, con el brazo 1 girado: de ahí sale el boleto. */
export const bocaDelTurnero = (giro: number): Punto => rot(SATURNO_ARMADO.turnero, SATURNO_ARMADO.hombros[0], giro);

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = SATURNO_ARMADO;
  const [nx, ny] = A.cuello;
  const [ax, ay] = A.anillo.centro;
  const transform: Record<string, string> = {
    entero: `translate(${SATURNO.x} ${SATURNO.piso}) scale(${SATURNO.escala})`,
    // Lo que flota sube, y se ladea desde la cintura.
    flota: `translate(0 ${n2(-m.flota)}) rotate(${n2(m.inclina)} 0 -150)`,
    // La sombra en el piso: más chica y más clara cuanto más alto flota.
    sombra: `scale(${n2(1.25 - m.flota / 90)} 1)`,
    cabeza: `rotate(${n2(m.cabeza)} ${nx} ${ny})`,
    'anillo-atras': `rotate(${n2(m.anillo)} ${ax} ${ay})`,
    'anillo-delante': `rotate(${n2(m.anillo)} ${ax} ${ay})`,
    boleto: `translate(${n2(m.boleto.x)} ${n2(m.boleto.y)}) rotate(${n2(m.boleto.giro)})`,
  };
  for (const n of [0, 1] as const) {
    const [sx, sy] = A.hombros[n];
    transform[`brazo-${n + 1}`] = `rotate(${n2(m.brazos[n])} ${sx} ${sy})`;
  }
  const opacity: Record<string, string> = {
    espejo: n2(m.espejo),
    halo: n2(0.25 + 0.75 * m.halo),
    boleto: n2(m.boleto.ve),
    sombra: n2(Math.max(0.15, 0.7 - m.flota / 120)),
  };
  // Las lunitas: cada una tiene su lugar adelante y su lugar atrás de la cabeza; se ve en uno solo.
  A.lunas.forEach((arranque, i) => {
    const { punto: [x, y], adelante } = enElAnillo(arranque + m.lunas, m.anillo);
    for (const lado of ['atras', 'delante'] as const) {
      transform[`luna-${lado}-${i + 1}`] = `translate(${n2(x)} ${n2(y)})`;
      opacity[`luna-${lado}-${i + 1}`] = (lado === 'delante') === adelante ? '1' : '0';
    }
  });
  return { transform, opacity };
}

/** Dónde dice su verso: arriba del anillo, en el recinto. */
export const VERSO: Punto = alRecinto([0, -470]);
