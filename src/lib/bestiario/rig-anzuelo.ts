/**
 * Los números del que mordió el anzuelo (`D-73`, vigesimotercera vuelta): dónde cuelga en los astilleros,
 * cómo está armado y cómo se pone. Los lee el dibujo (`arte-anzuelo.ts`), para la pose quieta del HTML y
 * para el retrato, y la conducta (`scripts/bestiario/anzuelo.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del pescado**: el (0, 0) es la punta de la caña que pinta el piso (`ASTILLERO.cania.punta`), de
 *   donde baja la línea; abajo es positivo. El pescado cuelga con la boca para arriba, clavado del labio, y
 *   se lo ve de costado: el lomo a la izquierda, la panza a la derecha.
 * - **El del recinto** (900 × 640): la caña apoyada en la bita del muelle, con la punta sobre el agua, entre
 *   la popa del ferry y el lanchón. El canto del muelle (`ASTILLERO.muelle`) es la línea del agua: lo que baja
 *   de ahí se hunde y no se ve.
 *
 * Como el camino corre a cada personaje entero (`ancla · (k − 1)`), el ancla es la `x` de la punta de la caña:
 * corrida con `k`, la punta del piso y la línea del títere siguen juntas.
 */

import { ASTILLERO } from './rig-entornos.ts';

export type Punto = readonly [number, number];

/** La punta de la caña, de donde cuelga todo. */
export const PUNTA: Punto = [ASTILLERO.cania.punta[0], ASTILLERO.cania.punta[1]];

/** Dónde está el agua, en las coordenadas del pescado: el canto del muelle, y un poco más (la tiza del canto). */
export const AGUA = ASTILLERO.muelle - PUNTA[1] + 2;

/** Cómo está armado, en las coordenadas del pescado. */
export const ANZUELO_ARMADO = {
  /** La cucharita de lata en forma de estrella, enhebrada en la línea: el cebo, su lujo. */
  estrella: [0, 6] as Punto,
  /** El ojo del anzuelo, donde se ata la línea. */
  ojal: [0, 12] as Punto,
  /** El labio de arriba, donde está clavado: de acá gira el pescado y alrededor de acá da la vuelta. */
  labio: [0, 20] as Punto,
  ojo: [4, 36] as Punto,
  /** La boca, que boquea. */
  boca: [2.4, 21] as Punto,
  /** La aleta del lomo, la del pecho y la cola: de acá giran. */
  dorsal: [-15, 57] as Punto,
  pectoral: [8, 50] as Punto,
  cola: [0, 84] as Punto,
  /** La punta de la cola: el largo entero del pescado. */
  punta: [0, 110] as Punto,
  /** De dónde se le caen las gotas: la punta de la aleta del pecho y la de la del lomo. */
  gotas: [[19, 62], [-22, 70], [12, 88]] as readonly Punto[],
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** El vaivén de toda la línea sobre la punta de la caña (grados), y el tirón de la caña (para abajo, positivo). */
  vaiven: number;
  tiron: number;
  /** El pescado: cuánto se corre del anzuelo (dx, dy), cuánto gira sobre el labio, y la vuelta sobre la línea (1 de un lado, −1 del otro). */
  pez: readonly [number, number];
  giro: number;
  vuelta: number;
  /** La cola, la aleta del lomo y la del pecho (grados). */
  cola: number;
  dorsal: number;
  pectoral: number;
  /** Para dónde mira la pupila (corrimiento adentro del ojo). */
  mira: readonly [number, number];
  /** El párpado entero (pestañeo, 0 a 1) y el de medio ojo, el del enamorado (0 a 1). */
  parpado: number;
  ensueno: number;
  /** La boca abierta (0 a 1) y los cachetes colorados (0 a 1). */
  boca: number;
  rubor: number;
  /** La estrella de lata: cuánto gira sobre la línea (−1 a 1) y cuánto brilla (0 a 1). */
  estrella: number;
  brillo: number;
  /** El chapuzón: dónde cae (x), cuánto va (0 a 1) y cuánto se ve. Las ondas en el agua, igual. */
  chapuzon: number;
  salpica: number;
  salpicaVe: number;
  ondas: number;
  ondasVe: number;
  /** Las gotas que se le caen: cuánto bajaron (0 a 1, cada una) y si se ven. */
  gotas: readonly [number, number, number];
  gotasVe: number;
}

/** La pose quieta, la del HTML: colgado del labio, resignado y contento, mirando la estrella de reojo. */
export const QUIETO: Momento = {
  vaiven: 0,
  tiron: 0,
  pez: [0, 0],
  giro: 0,
  vuelta: 1,
  cola: 0,
  dorsal: 0,
  pectoral: 0,
  mira: [0.6, -1.4],
  parpado: 0,
  ensueno: 0.25,
  boca: 0,
  rubor: 0.35,
  estrella: 1,
  brillo: 0.2,
  chapuzon: 0,
  salpica: 0,
  salpicaVe: 0,
  ondas: 0,
  ondasVe: 0,
  gotas: [0.3, 0.65, 0.1],
  gotasVe: 0.85,
};

/**
 * *"Mordí el anzuelo una vez más / Siempre un iluso"*: recién mordido otra vez, mirando la estrella de lata
 * con los ojos entornados, colorado, y la estrella brillando. Es el toque quieto y el retrato.
 */
export const TOCADO: Momento = {
  ...QUIETO,
  giro: -6,
  cola: 14,
  dorsal: -10,
  pectoral: -18,
  mira: [0, -2.4],
  ensueno: 0.75,
  rubor: 1,
  estrella: 0.4,
  brillo: 1,
};

/** Hasta dónde se hunde cuando se zafa (en unidades del pescado): el labio queda bajo el agua. */
export const HUNDE = AGUA + 12;

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [PUNTA[0] + x, PUNTA[1] + y];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = ANZUELO_ARMADO;
  const [, ly] = A.labio;
  const [, ey] = A.estrella;
  const [dx, dy] = A.dorsal;
  const [px, py] = A.pectoral;
  const [, cy] = A.cola;
  const [, oy] = A.ojo;
  // La vuelta sobre la línea no llega nunca a cero: de canto, el pescado es una lámina, no desaparece.
  const vuelta = Math.sign(m.vuelta || 1) * Math.max(0.08, Math.abs(m.vuelta));
  const transform: Record<string, string> = {
    entero: `translate(${PUNTA[0]} ${PUNTA[1]})`,
    colgado: `translate(0 ${n2(m.tiron)}) rotate(${n2(m.vaiven)} 0 0)`,
    estrella: `translate(0 ${ey}) scale(${n2(Math.sign(m.estrella || 1) * Math.max(0.12, Math.abs(m.estrella)))} 1) translate(0 ${-ey})`,
    pez: `translate(${n2(m.pez[0])} ${n2(m.pez[1])}) rotate(${n2(m.giro)} 0 ${ly}) translate(0 ${ly}) scale(${n2(vuelta)} 1) translate(0 ${-ly})`,
    cola: `rotate(${n2(m.cola)} 0 ${cy})`,
    dorsal: `rotate(${n2(m.dorsal)} ${dx} ${dy})`,
    pectoral: `rotate(${n2(m.pectoral)} ${px} ${py})`,
    pupila: `translate(${n2(m.mira[0])} ${n2(m.mira[1])})`,
    // El medio párpado baja desde arriba del ojo.
    ensueno: `translate(0 ${n2(oy - 7)}) scale(1 ${n2(Math.max(0.01, m.ensueno))}) translate(0 ${n2(-(oy - 7))})`,
    salpica: `translate(${n2(m.chapuzon)} ${n2(AGUA)}) scale(${n2(0.35 + 0.9 * m.salpica)} ${n2(0.3 + 0.9 * Math.sin(Math.PI * Math.min(1, m.salpica)))})`,
    ondas: `translate(${n2(m.chapuzon)} ${n2(AGUA)}) scale(${n2(0.3 + 1.2 * m.ondas)} ${n2(0.3 + 1.2 * m.ondas)})`,
  };
  A.gotas.forEach(([gx, gy], i) => {
    transform[`gota-${i + 1}`] = `translate(${gx} ${n2(gy + (AGUA - gy) * m.gotas[i]!)})`;
  });
  const opacity: Record<string, string> = {
    parpado: n2(m.parpado),
    ensueno: n2(m.ensueno > 0.01 ? 1 : 0),
    boca: n2(m.boca),
    rubor: n2(m.rubor),
    brillo: n2(m.brillo),
    salpica: n2(m.salpicaVe),
    ondas: n2(m.ondasVe),
  };
  A.gotas.forEach((_, i) => {
    // Cada gota se apaga al llegar al agua.
    opacity[`gota-${i + 1}`] = n2(m.gotasVe * (1 - Math.max(0, (m.gotas[i]! - 0.8) / 0.2)));
  });
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la punta de la caña, del lado del lanchón. */
export const VERSO: Punto = alRecinto([34, -34]);
