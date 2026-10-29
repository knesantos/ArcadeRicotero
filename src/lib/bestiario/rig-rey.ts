/**
 * Los números del rey de esta jungla (`D-73`, vigesimoquinta vuelta): dónde está enterrado, cómo está armada
 * la tumba y cómo se pone. Los lee el dibujo (`arte-rey.ts`), para la pose quieta del HTML y para el retrato,
 * y la conducta (`scripts/bestiario/rey.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de la tumba**: el (0, 0) es el pie del montículo, debajo de la cara del león; arriba es negativo.
 *   Está dibujada al doble, y la escena la achica con `REY.escala`.
 * - **El del recinto** (el monte, 900 × 640): en la ladera, entre las tiras de atrás, arriba del borde del
 *   piso. Los ojos quedan donde estaban sus ojos en lo oscuro (`VECINOS_DEL_MONTE`). En el camino el monte
 *   es un tramo largo y el marco lo corre entero adonde estaban sus ojos: por eso el ancla es su `x`.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde está la tumba, y lo que mide. */
export const REY = { x: 566, piso: 278, escala: 0.5 } as const;

/** La loma del montículo: la altura de la tierra en cada `x` de la tumba (0 afuera del montículo). */
export const LOMA = { ancho: 140, alto: 104 } as const;
export const cumbre = (x: number): number => (Math.abs(x) >= LOMA.ancho ? 0 : -LOMA.alto * Math.pow(1 - (x / LOMA.ancho) ** 2, 0.7));

/** Cómo está armada, en las coordenadas de la tumba. */
export const REY_ARMADO = {
  /** Los ojos del león, a ras de la tierra. */
  ojos: [[-16, -112], [16, -112]] as readonly [Punto, Punto],
  /** El medio de la cabeza: de acá sacude la melena. */
  cabeza: [0, -104] as Punto,
  /** De dónde baja la quijada. */
  quijada: [0, -74] as Punto,
  /** Donde se le asienta la corona, en la coronilla. */
  coronilla: [4, -160] as Punto,
  /** Donde el palo de la cruz entra en la tierra: de acá se tambalea. */
  cruz: [-92, -66] as Punto,
  /** Donde quedó la corona caída, al pie de la cruz, y cuánto está volcada. */
  corona: [-118, -50] as Punto,
  coronaVolcada: 28,
  /** Las cuatro flores: de dónde salen y cuánto miden. La 1 y la 3 abiertas; la 2 y la 4 en capullo. */
  flores: [
    { base: [-58, -91] as Punto, alto: 64, lean: -6 },
    { base: [50, -94] as Punto, alto: 52, lean: 5 },
    { base: [96, -66] as Punto, alto: 72, lean: 8 },
    { base: [-122, -38] as Punto, alto: 46, lean: -4 },
  ],
  /** El patín tirado al lado: el medio, y el eje de cada rueda (la 1 adelante, la 2 la floja). */
  patin: [182, -16] as Punto,
  ruedas: [[203, -7], [160, -9]] as readonly [Punto, Punto],
  rueda: 7,
  /** Donde está dibujado el escarabajo, y por dónde cruza la cara del montículo. */
  bicho: [0, -54] as Punto,
  camino: [-122, 126] as readonly [number, number],
} as const;

/** Lo que sube la cabeza tocado, y lo que baja la quijada a pleno, en unidades de la tumba. */
export const SUBE = 72;
export const ABRE = 30;
/** Lo que rueda el patín cuando se le vuelve a soltar. */
export const RUEDA_LEJOS = 72;

/** El pie de una flor y la punta, parada, sin crecer. */
export const puntaDe = (n: number): Punto => {
  const f = REY_ARMADO.flores[n]!;
  return [f.base[0] + f.lean, f.base[1] - f.alto];
};

/** Por dónde va el escarabajo: la cara del montículo, a media altura. `k` va de 0 a 1. */
export function caminoDelBicho(k: number): { x: number; y: number; giro: number } {
  const [a, b] = REY_ARMADO.camino;
  const x = a + (b - a) * k;
  const y = 0.52 * cumbre(x) - 2;
  const y2 = 0.52 * cumbre(x + 2) - 2;
  return { x, y, giro: (Math.atan2(y2 - y, 2) * 180) / Math.PI };
}

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

type Cuatro = readonly [number, number, number, number];

export interface Momento {
  /** La tierra que respira (−1 a 1), el temblor de la tierra (corrimiento) y las grietas (0 a 1). */
  respira: number;
  tiembla: number;
  grieta: number;
  /** Los terrones que salta la cabeza al salir (0 a 1, de punta a punta). */
  terrones: number;
  /** Cuánto asoma la cabeza (0 hasta los ojos, 1 hasta la boca), y el sacudón de la melena (grados). */
  sube: number;
  melena: number;
  /** Para dónde miran los ojos (corrimiento de las pupilas), el párpado (0 abierto) y la boca (0 a 1). */
  mira: readonly [number, number];
  parpado: number;
  boca: number;
  /** Lo que se tambalea la cruz (grados) y dónde está la corona: 0 caída al pie, 1 puesta en la cabeza. */
  cruz: number;
  corona: number;
  /** Lo que crece cada flor (0 a 1), cuánto está abierta (0 capullo, 1 abierta) y el vaivén (grados). */
  flores: Cuatro;
  abiertas: Cuatro;
  vaiven: Cuatro;
  /** Dónde está el patín (corrimiento) y cuánto giró cada rueda (grados). */
  patin: number;
  ruedas: readonly [number, number];
  /** El pétalo que cae (0 a 1) y el escarabajo que cruza (0 a 1; afuera no se ve). */
  petalo: number;
  bicho: number;
}

/** La pose quieta, la del HTML: enterrado hasta los ojos, mirando las flores, con la corona al pie de la cruz. */
export const QUIETO: Momento = {
  respira: 0,
  tiembla: 0,
  grieta: 0,
  terrones: 0,
  sube: 0,
  melena: 0,
  mira: [0, 0],
  parpado: 0,
  boca: 0,
  cruz: 0,
  corona: 0,
  flores: [0, 0, 0, 0],
  abiertas: [1, 0, 1, 0],
  vaiven: [0, 0, 0, 0],
  patin: 0,
  ruedas: [0, 0],
  petalo: 0,
  bicho: 0,
};

/**
 * *"A él, que era rey de esta jungla"*: asomado hasta la boca, rugiendo sin voz, con la corona de lata
 * torcida en la cabeza, la tierra partida y las flores altas y abiertas. Es el toque quieto y el retrato.
 */
export const ASOMA: Momento = {
  ...QUIETO,
  grieta: 1,
  sube: 1,
  mira: [0, -1.4],
  boca: 0.85,
  cruz: -5,
  corona: 1,
  flores: [1, 1, 1, 1],
  abiertas: [1, 1, 1, 1],
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [REY.x + x * REY.escala, REY.piso + y * REY.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const giro = (g: number, [x, y]: Punto): string => `rotate(${n2(g)} ${x} ${y})`;
const escala = (s: number, [x, y]: Punto): string => `translate(${x} ${y}) scale(${n2(s)}) translate(${-x} ${-y})`;
/** Lo que se ve de una fase (0 a 1): sube y baja. */
export const fase = (k: number): number => (k > 0 && k < 1 ? Math.sin(Math.PI * k) : 0);

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = REY_ARMADO;
  const alza = -SUBE * m.sube;
  // La corona salta en arco del pie de la cruz a la coronilla, y se endereza a medias: queda torcida.
  const [cx, cy] = A.corona;
  const [hx, hy] = A.coronilla;
  const k = m.corona;
  const corona = `translate(${n2((hx - cx) * k)} ${n2((hy + alza - cy) * k - 46 * fase(k))}) ${giro(A.coronaVolcada * (1 - k) - 14 * k, A.corona)}`;
  const b = caminoDelBicho(Math.min(1, Math.max(0, m.bicho)));
  const [px, py] = puntaDe(0);
  const p = m.petalo;
  const transform: Record<string, string> = {
    entero: `translate(${REY.x} ${REY.piso}) scale(${REY.escala})`,
    cruz: giro(m.cruz, A.cruz),
    cabeza: `translate(${n2(m.tiembla * 0.5)} ${n2(alza)}) ${giro(m.melena, A.cabeza)}`,
    quijada: `translate(0 ${n2(ABRE * m.boca)})`,
    pupilas: `translate(${n2(m.mira[0])} ${n2(m.mira[1])})`,
    // La tierra respira apenas, y tocada se levanta con la cabeza.
    tierra: `translate(${n2(m.tiembla)} 0) scale(${n2(1 + 0.006 * m.respira + 0.03 * m.sube)} ${(1 + 0.016 * m.respira + 0.07 * m.sube).toFixed(4)})`,
    terrones: `translate(0 ${n2(-38 * fase(m.terrones) + alza * 0.4)}) ${escala(1 + 0.7 * m.terrones, A.cabeza)}`,
    corona,
    // El pétalo cae de la flor 1 hamacándose, y queda un rato en la tierra antes de irse.
    petalo: `translate(${n2(-16 * Math.min(1, p / 0.8) + 6 * Math.sin(p * 11))} ${n2(66 * Math.min(1, p / 0.8))}) rotate(${n2(380 * Math.min(1, p / 0.8))} ${px} ${py})`,
    bicho: `translate(${n2(b.x - A.bicho[0])} ${n2(b.y - A.bicho[1])}) ${giro(b.giro + 4 * Math.sin(m.bicho * 90), A.bicho)}`,
    patin: `translate(${n2(m.patin)} 0)`,
  };
  A.flores.forEach((f, i) => {
    const n = i + 1;
    const [tx, ty] = puntaDe(i);
    transform[`flor-${n}`] = `${giro(m.vaiven[i]!, f.base)} ${escala(1 + 0.6 * m.flores[i]!, f.base)}`;
    transform[`corola-${n}`] = escala(0.3 + 0.7 * m.abiertas[i]!, [tx, ty]);
  });
  A.ruedas.forEach((r, i) => {
    transform[`rueda-${i + 1}`] = giro(m.ruedas[i]!, r);
  });
  const opacity: Record<string, string> = {
    parpado: n2(m.parpado),
    boca: m.boca > 0.02 ? '1' : '0',
    grietas: n2(m.grieta),
    terrones: n2(fase(m.terrones)),
    petalo: n2(p > 0 && p < 1 ? Math.min(1, (1 - p) * 6) : 0),
    bicho: n2(m.bicho > 0 && m.bicho < 1 ? Math.min(1, m.bicho * 14, (1 - m.bicho) * 14) : 0),
  };
  m.abiertas.forEach((a, i) => {
    opacity[`capullo-${i + 1}`] = n2(Math.max(0, 1 - a * 1.6));
    opacity[`corola-${i + 1}`] = n2(Math.min(1, a * 2.5));
  });
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la cruz, en el recinto. */
export const VERSO: Punto = alRecinto([-20, -250]);
