/**
 * Los números de la fiera más fiera (`D-73`, vigesimonovena vuelta): dónde está su jaula en la prisión, cómo está
 * armada y cómo se pone. Los lee el dibujo (`arte-fiera.ts`), para la pose quieta del HTML y para el retrato, y la
 * conducta (`scripts/bestiario/fiera.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El de la jaula**: el (0, 0) es el piso en el medio de la jaula; arriba es negativo. La puerta abre a la izquierda.
 * - **El del recinto** (la prisión): adelante a la derecha, donde estuvo siempre (`PRISION.jaula` en `rig.ts`).
 *
 * La fiera no se dibuja nunca. Lo que se mueve es lo que tiene puesto y lo que toca: el collar a la altura del
 * cogote, la cadena que va del piso al collar, el hueso, el aliento, la puerta y los barrotes.
 */

import type { P } from './trazos.ts';

export type Punto = P;

export const FIERA = { x: 796, piso: 628, escala: 1 } as const;

export const FIERA_ARMADO = {
  /** La jaula: de dónde a dónde, la punta de la cúpula y cuántos barrotes; los dos del hueco de la puerta no están. */
  jaula: { x0: -84, x1: 84, arriba: -310, barrotes: 9, hueco: [1, 2] as readonly number[] },
  /** La puerta: la bisagra, de dónde a dónde y lo que mide abierta, para afuera. */
  puerta: { x: -70, arriba: -224, abajo: -12, ancho: 70 },
  /** Dónde flota el collar cuando la fiera está parada, quieta: el cogote. */
  cogote: [14, -150] as Punto,
  /** De dónde sale la cadena en el collar, medido desde su centro, y la argolla del piso. */
  enganche: [6, 9] as Punto,
  argolla: [66, -12] as Punto,
  /** Lo que mide la cadena, en dos tramos iguales: floja cuelga, tirante la frena. */
  cadena: 166,
  /** Dónde tiene la boca, medido desde el collar: de ahí sale el aliento y ahí sube el hueso. */
  boca: [-30, -22] as Punto,
  /** Lo que mide el collar: una vez y media el dibujo. */
  collar: 1.5,
  /** Dónde está tirado el hueso. */
  hueso: [-34, -24] as Punto,
  /** Entre qué barrotes empuja cuando la tocan, y a qué altura: ahí se comban. */
  comba: { barrotes: [3, 4] as readonly [number, number], y: -156, alto: 150, abre: 18 },
} as const;

export interface Momento {
  /** Cuánto se corrió el collar de su lugar (el cogote de la fiera) y cuánto se ladea (grados). */
  dx: number;
  dy: number;
  ladea: number;
  /** Cuánto se viene para el lado de quien mira (0 a 1): el collar se agranda. */
  cerca: number;
  /** La chapita: por dónde va de su giro (radianes) y cuánto se hamaca (grados). */
  chapita: number;
  cuelga: number;
  /** El hueso: cuánto subió a la boca (0 en el piso, 1 en la boca), cuánto gira y cuánto rebota al caer. */
  hueso: number;
  roe: number;
  rebota: number;
  /** El aliento que se ve (0 a 1). */
  aliento: number;
  /** Los barrotes combados (0 a 1) y los cuatro tajos en el aire (0 a 1). */
  comba: number;
  tajos: number;
  /** La puerta: 1 abierta para afuera, 0 de canto, negativa cerrada sobre el hueco. */
  puerta: number;
  /** Cuánto se sacude la jaula entera. */
  tiembla: number;
}

/** La pose quieta, la del HTML: la jaula abierta, el collar flotando a la altura del cogote, la cadena floja. */
export const QUIETO: Momento = { dx: 0, dy: 0, ladea: 0, cerca: 0, chapita: 0.5, cuelga: 0, hueso: 0, roe: 0, rebota: 0, aliento: 0.35, comba: 0, tajos: 0, puerta: 0.9, tiembla: 0 };

/** *"La fiera más fiera ¿dónde está?"*: acá. Los barrotes combados, los tajos, la cadena tirante. El toque quieto y el retrato. */
export const ATACA: Momento = { ...QUIETO, dx: -36, dy: -8, ladea: -14, cerca: 0.4, chapita: 0.3, cuelga: 24, aliento: 1, comba: 1, tajos: 1, puerta: 1 };

export const alRecinto = ([x, y]: Punto): Punto => [FIERA.x + x * FIERA.escala, FIERA.piso + y * FIERA.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const entre01 = (v: number): number => Math.min(1, Math.max(0, v));

/** Dónde está el collar en un momento. */
export function collar(m: Momento): Punto {
  const [cx, cy] = FIERA_ARMADO.cogote;
  return [cx + m.dx, Math.min(-30, cy + m.dy)];
}

/**
 * La cadena, en dos tramos: de la argolla del piso al medio y del medio al collar. Si alcanza, el medio cuelga;
 * si no, queda tirante. Devuelve el medio y cuánto se estira cada tramo (1 es su largo).
 */
export function cadena(m: Momento): { medio: Punto; hasta: Punto; estira: number } {
  const A = FIERA_ARMADO;
  const [ax, ay] = A.argolla;
  const [cx, cy] = collar(m);
  const hasta: Punto = [cx + A.enganche[0] * A.collar, cy + A.enganche[1] * A.collar];
  const d = Math.hypot(hasta[0] - ax, hasta[1] - ay);
  const medio: [number, number] = [(ax + hasta[0]) / 2, (ay + hasta[1]) / 2];
  const tramo = A.cadena / 2;
  if (d < A.cadena) {
    // Cuelga para abajo y para el lado de la argolla, hasta el piso.
    const h = Math.sqrt(tramo * tramo - (d / 2) * (d / 2));
    const [nx, ny] = [-(hasta[1] - ay) / d, (hasta[0] - ax) / d];
    const s = ny > 0 ? 1 : -1;
    medio[0] += nx * h * s * 0.8;
    medio[1] = Math.min(-3, medio[1] + ny * h * s);
  }
  const largo = (Math.hypot(medio[0] - ax, medio[1] - ay) + Math.hypot(hasta[0] - medio[0], hasta[1] - medio[1])) / 2;
  return { medio, hasta, estira: largo / tramo };
}

/** Las transformaciones y las opacidades de cada parte para un momento. */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = FIERA_ARMADO;
  const [cx, cy] = collar(m);
  const escala = A.collar * (1 + 0.25 * m.cerca);
  const { medio, hasta } = cadena(m);
  const tramo = (de: Punto, a: Punto): string => {
    const [dx, dy] = [a[0] - de[0], a[1] - de[1]];
    return `translate(${n2(de[0])} ${n2(de[1])}) rotate(${n2((Math.atan2(dy, dx) * 180) / Math.PI)}) scale(${n2(Math.hypot(dx, dy) / (A.cadena / 2))} 1)`;
  };
  const boca: Punto = [cx + A.boca[0] * escala, cy + A.boca[1] * escala];
  const k = entre01(m.hueso);
  const [hx, hy] = [A.hueso[0] + (boca[0] + 8 - A.hueso[0]) * k, A.hueso[1] + (boca[1] + 10 - A.hueso[1]) * k - m.rebota];
  const gira = Math.cos(m.chapita);
  const transform: Record<string, string> = {
    entero: `translate(${FIERA.x} ${FIERA.piso}) scale(${FIERA.escala})`,
    jaula: `translate(${n2(m.tiembla)} 0)`,
    'cadena-1': tramo(A.argolla, medio),
    'cadena-2': tramo(medio, hasta),
    collar: `translate(${n2(cx)} ${n2(cy)}) rotate(${n2(m.ladea)}) scale(${n2(escala)})`,
    chapita: `translate(-4 9) rotate(${n2(m.cuelga)}) scale(${n2(1.3 * Math.sign(gira || 1) * Math.max(0.12, Math.abs(gira)))} 1.3)`,
    hueso: `translate(${n2(hx)} ${n2(hy)}) rotate(${n2(-8 + m.roe + 30 * k)}) scale(1.35)`,
    aliento: `translate(${n2(boca[0])} ${n2(boca[1])}) scale(${n2(0.45 + 0.75 * m.aliento)})`,
    puerta: `translate(${A.puerta.x} 0) scale(${n2(Math.abs(m.puerta) < 0.12 ? 0.12 : m.puerta)} 1) translate(${-A.puerta.x} 0)`,
    tajos: `translate(-18 -150) scale(${n2(0.7 + 0.3 * m.tajos)}) translate(18 150)`,
  };
  const opacity: Record<string, string> = {
    barrotes: n2(1 - entre01(m.comba)),
    combada: n2(entre01(m.comba)),
    aliento: n2(0.75 * entre01(m.aliento)),
    tajos: n2(entre01(m.tajos)),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la jaula, en el recinto. */
export const VERSO: Punto = alRecinto([0, -340]);
