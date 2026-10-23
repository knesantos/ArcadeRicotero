/**
 * Los números de tu animal (`D-73`, decimoctava vuelta): dónde se esconde en el monte, cómo está armado y
 * cómo se pone. Los lee el dibujo (`arte-animal.ts`), para la pose quieta del HTML y para el retrato, y la
 * conducta (`scripts/bestiario/animal.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del títere**: el (0, 0) es el piso debajo del medio de la panza; arriba es negativo y la cabeza
 *   mira para la izquierda, para el lado del lobo y del claro. Está dibujado a dos veces y la escena lo
 *   achica con `ESCALA`.
 * - **El del recinto** (900 × 640): el monte de noche, en el borde del fondo, entre las tiras (`escena-monte.ts`).
 *   En el camino el monte es un tramo largo, y el marco lo corre entero adonde lo esperaban sus ojos.
 */

export type Punto = readonly [number, number];

/**
 * Dónde está: el piso debajo de la panza, en el borde de atrás del monte, contra las tiras del fondo y
 * lejos de la vaca y de las tiras de adelante. Está lejos, así que es más chico que los de adelante.
 */
export const ANIMAL = { x: 742, piso: 286, escala: 0.52 } as const;

/** Cómo está armado, en las coordenadas del títere. */
export const ANIMAL_ARMADO = {
  /** De acá gira la cabeza: el cogote, donde va el collar. */
  cogote: [-58, -118] as Punto,
  /** Los dos ojos, de tres cuartos: el de allá más chico. */
  ojos: [
    { centro: [-105, -124] as Punto, radio: 6 },
    { centro: [-88, -127] as Punto, radio: 5 },
  ],
  /** La quijada: de dónde gira, y hasta dónde llega el hocico. */
  quijada: [-84, -108] as Punto,
  hocico: [-150, -104] as Punto,
  /** La cola: de dónde sale. */
  cola: [80, -96] as Punto,
  /** La argolla del collar, de donde sale la correa. */
  argolla: [-52, -100] as Punto,
  /** Para dónde se va la correa: arriba a la derecha, afuera del monte. Alguien la tiene. */
  correa: [360, -700] as Punto,
} as const;

/** Lo que mide en la escena: el títere está dibujado a dos veces. */
export const ESCALA = ANIMAL.escala;

/* ------------------------------------------------------------------
   El momento: lo que la conducta decide en cada cuadro
   ------------------------------------------------------------------ */

export interface Momento {
  /** Cuánto se corre parado (unidades del títere), y cuánto aire tiene. */
  paso: number;
  respira: number;
  /** Cuánto gira la cabeza en el cogote (negativo es para arriba), y cuánto abre la quijada (0 a 1). */
  cabeza: number;
  quijada: number;
  /** Cuánto gira la cola (grados). */
  cola: number;
  /** Adónde miran los ojos (de -1 a 1), y cuánto bajan los párpados (0 abiertos, 1 cerrados). */
  mira: Punto;
  parpados: number;
  /** Cuánto se ve el cuerpo: 0 es una sombra con dos ojos. */
  ve: number;
  /** Lo tirante que está la correa (0 floja, 1 tensa). */
  tira: number;
}

/** La pose quieta, la del HTML: medio metido en lo oscuro, mirando para el claro. */
export const QUIETO: Momento = { paso: 0, respira: 0, cabeza: 0, quijada: 0, cola: 0, mira: [-0.4, 0.1], parpados: 0.25, ve: 0.7, tira: 0.3 };

/**
 * Lo que pasa cuando lo tocás: se muestra entero, pela los dientes (*"el peligro sensato"*), y después
 * baja la cabeza para que lo acaricies. Esta es la de los dientes: el toque quieto y el retrato.
 */
export const MUESTRA: Momento = { paso: -10, respira: 0.03, cabeza: -10, quijada: 1, cola: 18, mira: [-1, 0.2], parpados: 0, ve: 1, tira: 1 };

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

/** Gira `p` alrededor de `c`, en grados (positivo es como las agujas, como en SVG). */
export function rot([x, y]: Punto, [cx, cy]: Punto, grados: number): Punto {
  const a = (grados * Math.PI) / 180;
  const [dx, dy] = [x - cx, y - cy];
  return [cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)];
}

/** Un punto del títere, llevado al recinto. */
export const alRecinto = ([x, y]: Punto): Punto => [ANIMAL.x + x * ESCALA, ANIMAL.piso + y * ESCALA];

/** Cuánto se abre la quijada, en grados, con la quijada a pleno. */
export const ABRE = 26;

/** Cuánto se corren las pupilas adentro del ojo. */
export const MIRA = [1.8, 1.2] as const;

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * La correa: de la argolla del collar (que se corre con el paso) para arriba y afuera del monte. Floja
 * cuelga en panza; tirante va derecha.
 */
export function correa(m: Momento): string {
  const [ax, ay] = ANIMAL_ARMADO.argolla;
  const [cx, cy] = ANIMAL_ARMADO.correa;
  const x0 = ax + m.paso;
  const panza = (1 - m.tira) * 70;
  const [mx, my] = [(x0 + cx) / 2 + panza * 0.3, (ay + cy) / 2 + panza];
  return `M${n2(x0)} ${n2(ay)} Q${n2(mx)} ${n2(my)} ${cx} ${cy}`;
}

/**
 * Las transformaciones, las opacidades y la correa para un momento: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string>; correa: string } {
  const A = ANIMAL_ARMADO;
  const [gx, gy] = A.cogote;
  const [qx, qy] = A.quijada;
  const [cx, cy] = A.cola;
  const transform: Record<string, string> = {
    entero: `translate(${ANIMAL.x} ${ANIMAL.piso}) scale(${ESCALA})`,
    // El cuerpo se corre con el paso y el pecho se llena desde el piso.
    anda: `translate(${n2(m.paso)} 0)`,
    torso: `scale(1 ${(1 + m.respira).toFixed(4)})`,
    cabeza: `translate(0 ${n2(gy * -m.respira)}) rotate(${n2(m.cabeza)} ${gx} ${gy})`,
    // Los ojos van aparte del cuerpo, que se esconde, pero con la cabeza: la misma cuenta.
    ojos: `translate(0 ${n2(gy * -m.respira)}) rotate(${n2(m.cabeza)} ${gx} ${gy})`,
    quijada: `rotate(${n2(-ABRE * m.quijada)} ${qx} ${qy})`,
    cola: `rotate(${n2(m.cola)} ${cx} ${cy})`,
  };
  A.ojos.forEach(({ centro: [ox, oy], radio }, i) => {
    transform[`pupila-${i + 1}`] = `translate(${n2(m.mira[0] * MIRA[0])} ${n2(m.mira[1] * MIRA[1])})`;
    const py = oy - radio;
    transform[`parpado-${i + 1}`] = `translate(${ox} ${n2(py)}) scale(1 ${n2(m.parpados)}) translate(${-ox} ${n2(-py)})`;
  });
  const opacity: Record<string, string> = {
    // Lo que se esconde es el cuerpo: los ojos quedan siempre, que es lo que se ve de tu animal en lo oscuro.
    cuerpo: n2(m.ve),
    boca: m.quijada > 0.02 ? '1' : '0',
    sombra: n2(0.25 + 0.4 * m.ve),
  };
  return { transform, opacity, correa: correa(m) };
}

/** Dónde dice su verso: arriba de él, en el recinto, sin salirse por la derecha. */
export const VERSO: Punto = [ANIMAL.x - 50, ANIMAL.piso - 120];
