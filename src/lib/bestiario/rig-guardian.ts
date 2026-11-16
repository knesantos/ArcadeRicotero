/**
 * Los números del ángel guardián más tonto (`D-73`, vigesimonovena vuelta): dónde está parado al pie del árbol, cómo
 * está armado y cómo se pone. Los lee el dibujo (`arte-guardian.ts`), para la pose quieta del HTML y para el retrato, y
 * la conducta (`scripts/bestiario/guardian.ts`), que se lleva esto y nada que dibuje.
 *
 * Dos sistemas de coordenadas:
 * - **El del ángel**: el (0, 0) es la tierra entre los pies; arriba es negativo, y adelante (para donde mira) es
 *   positivo. Está dibujado al doble y la escena lo achica con `GUARDIAN.escala`.
 * - **El del recinto** (900 × 640, el del árbol): al pie, entre el tronco y el que duerme colgado, **corrido de donde
 *   hace falta**: está debajo de la rama soldada (`ARBOL.soldada`), pero del tramo donde no cuelga nadie. Mira para la
 *   izquierda, de espaldas al colgado: el dibujo mira a la derecha y la escena lo da vuelta (`escala` negativa en x).
 *   La lona queda tendida delante de él, hacia el tronco, cada vez más lejos del colgado. En el camino el marco lo
 *   corre `ancla · (k − 1)`.
 */

import type { P } from './trazos.ts';

export type Punto = P;

/** Dónde está parado, y lo que mide. */
export const GUARDIAN = { x: 556, piso: 534, escala: 0.56 } as const;

/** Cómo está armado, en sus coordenadas. */
export const GUARDIAN_ARMADO = {
  /** Los hombros (el de atrás y el de adelante) y lo que mide el brazo dibujado, del hombro a la mano. */
  hombros: [[-16, -150], [18, -150]] as readonly [Punto, Punto],
  brazo: 90,
  /** De dónde salen las alas, atrás de los hombros, y lo que se achican: son chicas para el cuerpo que tiene. */
  alas: [[-14, -142], [14, -142]] as readonly [Punto, Punto],
  ala: 0.72,
  /** La base del cogote: de ahí gira la cabeza. Y dónde quedan, en la cabeza derecha, la punta de la cresta del casco, la boca y la aureola. */
  cogote: [0, -152] as Punto,
  casco: [-1, -115] as Punto,
  boca: [17, -43] as Punto,
  aureola: [-1, -158] as Punto,
  /**
   * La lona de rescate: redonda, tendida en escorzo. Una punta está atada a la estaca, clavada adelante, al pie del
   * tronco; la otra la levanta él con las dos manos. `tendida` es lo inclinada que queda (grados).
   */
  lona: { rx: 62, ry: 22, tendida: 30 },
  estaca: [146, -4] as Punto,
  /** La lona arriba de la cabeza, cuando se tapa tarde: el medio, y lo aplastada que se ve. */
  techo: [0, -262, 0.62] as readonly [number, number, number],
  /** La percha vacía, colgada del tramo de la rama donde no cuelga nadie: es lo que mira. El gancho, arriba. */
  percha: [84, -415] as Punto,
  /** De dónde cae el nido, adentro de la copa. */
  nidoDesde: -640,
} as const;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Momento {
  /** El aliento (−1 a 1): le sube los hombros. */
  respira: number;
  /** Entero, con la lona y la estaca: lo que se corre para adelante y lo que salta. */
  todo: readonly [number, number];
  /** La cabeza: lo que gira del cogote (negativo es para atrás, mirando para arriba) y lo que se hunde entre los hombros. */
  cabeza: number;
  hundida: number;
  /** Los párpados (0 como los tiene, a medio cerrar; 1 cerrados) y la boca del bostezo (0 a 1). */
  parpado: number;
  bocaza: number;
  /**
   * La lona. `techo` 0 es tendida de la estaca a sus manos, inclinada `inclina` grados; 1 es de techo, arriba de la
   * cabeza. En el medio va de una a otra.
   */
  inclina: number;
  techo: number;
  /** La mano de adelante: cuánto soltó la lona (0 a 1) y dónde está cuando la soltó. */
  suelta: number;
  mano: Punto;
  /** Las alas: cuánto se abren (grados). */
  alas: number;
  /** La aureola: lo que se corre de su lugar arriba del casco, y lo torcida que está (grados). */
  aureola: readonly [number, number, number];
  /** El nido: dónde está, lo que gira y si se ve. */
  nido: readonly [number, number, number];
  nidoSe: number;
  /** La llama del cabo de vela del casco: cuánto hay (0 apagada) y la fase del temblor. */
  llama: number;
  tiembla: number;
}

/** La pose quieta, la del HTML: la lona tendida, la cabeza para atrás mirando la percha vacía, la vela prendida. */
export const QUIETO: Momento = {
  respira: 0,
  todo: [0, 0],
  cabeza: -26,
  hundida: 0,
  parpado: 0,
  bocaza: 0,
  inclina: GUARDIAN_ARMADO.lona.tendida,
  techo: 0,
  suelta: 0,
  mano: [40, -214],
  alas: 0,
  aureola: [0, 0, 14],
  nido: [0, -640, 0],
  nidoSe: 0,
  llama: 1,
  tiembla: 0,
};

const rad = (g: number): number => (g * Math.PI) / 180;

/** Dónde queda un punto de la cabeza derecha cuando la cabeza gira `giro` y se hunde `hundida`. */
export function enLaCabeza([x, y]: Punto, giro: number, hundida = 0): Punto {
  const [cx, cy] = GUARDIAN_ARMADO.cogote;
  const a = rad(giro);
  return [cx + x * Math.cos(a) - y * Math.sin(a), cy + hundida + x * Math.sin(a) + y * Math.cos(a)];
}

/** Dónde apoya el nido cuando le cayó en el casco. */
export const nidoEnElCasco = (giro: number, hundida: number): Punto => enLaCabeza([GUARDIAN_ARMADO.casco[0], GUARDIAN_ARMADO.casco[1] + 6], giro, hundida);

/**
 * *"Tu ángel guardián es de todos el más tonto que hay"*: el nido ya le cayó en el casco y le apagó la vela, y él se
 * tapa con la lona, tarde. Es el toque quieto y el retrato.
 */
export const TARDE: Momento = {
  ...QUIETO,
  cabeza: -8,
  hundida: 7,
  techo: 1,
  alas: 30,
  aureola: [40, -78, -40],
  nido: [...nidoEnElCasco(-8, 7), -8] as unknown as Momento['nido'],
  nidoSe: 1,
  llama: 0,
};

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

export const alRecinto = ([x, y]: Punto): Punto => [GUARDIAN.x - x * GUARDIAN.escala, GUARDIAN.piso + y * GUARDIAN.escala];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;

/** Dónde está la lona en un momento: el medio, lo que gira y lo aplastada que se ve. */
export function lonaEn(m: Pick<Momento, 'inclina' | 'techo'>): { centro: Punto; giro: number; sy: number } {
  const A = GUARDIAN_ARMADO;
  const a = rad(m.inclina);
  // Tendida: la punta de adelante está en la estaca, y el medio queda a un radio de ahí, para atrás y para arriba.
  const [tx, ty] = [A.estaca[0] - A.lona.rx * Math.cos(a), A.estaca[1] - A.lona.rx * Math.sin(a)];
  const k = Math.min(1, Math.max(0, m.techo));
  return { centro: [mezcla(tx, A.techo[0], k), mezcla(ty, A.techo[1], k)], giro: mezcla(m.inclina, 0, k), sy: mezcla(1, A.techo[2], k) };
}

/** Un punto de la lona (en sus coordenadas, con el medio en el (0, 0)) llevado adonde está la lona. */
function enLaLona([x, y]: Punto, m: Pick<Momento, 'inclina' | 'techo'>): Punto {
  const { centro: [cx, cy], giro, sy } = lonaEn(m);
  const a = rad(giro);
  return [cx + x * Math.cos(a) - y * sy * Math.sin(a), cy + x * Math.sin(a) + y * sy * Math.cos(a)];
}

/**
 * Dónde agarra la lona cada mano (0 la de atrás, 1 la de adelante). Tendida, las dos en la punta que levanta, una al
 * lado de la otra; de techo, una de cada lado.
 */
export function agarre(m: Pick<Momento, 'inclina' | 'techo'>, i: 0 | 1): Punto {
  const { rx, ry } = GUARDIAN_ARMADO.lona;
  const k = Math.min(1, Math.max(0, m.techo));
  const tendida: Punto = i === 0 ? [-rx * 0.86, -ry * 0.5] : [-rx * 0.86, ry * 0.5];
  const deTecho: Punto = i === 0 ? [-rx * 0.62, ry * 0.2] : [rx * 0.62, ry * 0.2];
  return enLaLona([mezcla(tendida[0], deTecho[0], k), mezcla(tendida[1], deTecho[1], k)], m);
}

/** Dónde está cada mano en un momento: la de atrás siempre en la lona; la de adelante, en la lona o donde la llevó. */
export function manos(m: Momento): readonly [Punto, Punto] {
  const [gx, gy] = agarre(m, 1);
  const k = Math.min(1, Math.max(0, m.suelta));
  return [agarre(m, 0), [gx + (m.mano[0] - gx) * k, gy + (m.mano[1] - gy) * k]];
}

/** La transformación que lleva un brazo (dibujado del hombro para abajo) del hombro a la mano: gira y se estira. */
function brazoA([hx, hy]: Punto, [tx, ty]: Punto, sube: number): string {
  const [dx, dy] = [tx - hx, ty - (hy - sube)];
  const largo = Math.hypot(dx, dy);
  const ang = (Math.atan2(-dx, dy) * 180) / Math.PI;
  return `translate(${n2(hx)} ${n2(hy - sube)}) rotate(${n2(ang)}) scale(1 ${n2(largo / GUARDIAN_ARMADO.brazo)})`;
}

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML (la pose
 * quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = GUARDIAN_ARMADO;
  const sube = 1.6 * m.respira;
  const [mi, md] = manos(m);
  const [ax, ay] = enLaCabeza(A.aureola, m.cabeza, m.hundida);
  const lona = lonaEn(m);
  const f = (v: number): string => n2(Math.min(1, Math.max(0, v)));
  const transform: Record<string, string> = {
    entero: `translate(${GUARDIAN.x} ${GUARDIAN.piso}) scale(${-GUARDIAN.escala} ${GUARDIAN.escala})`,
    todo: `translate(${n2(m.todo[0])} ${n2(-m.todo[1])})`,
    'ala-i': `translate(${A.alas[0][0]} ${n2(A.alas[0][1] - sube)}) scale(${-A.ala} ${A.ala}) rotate(${n2(-m.alas)})`,
    'ala-d': `translate(${A.alas[1][0]} ${n2(A.alas[1][1] - sube)}) scale(${A.ala}) rotate(${n2(-m.alas)})`,
    cuerpo: `translate(0 ${n2(-sube * 0.5)})`,
    cabeza: `translate(${A.cogote[0]} ${n2(A.cogote[1] + m.hundida - sube)}) rotate(${n2(m.cabeza)})`,
    bocaza: `translate(${A.boca[0]} ${A.boca[1]}) scale(${n2(Math.max(0.05, m.bocaza))})`,
    llama: `translate(${A.casco[0]} ${A.casco[1] - 14}) scale(${n2(1.4 * (1 + 0.12 * Math.sin(m.tiembla)))} ${n2(1.4 * Math.max(0.05, m.llama) * (1 + 0.16 * Math.sin(m.tiembla * 1.7 + 1)))})`,
    'brazo-i': brazoA(A.hombros[0], mi, sube),
    'brazo-d': brazoA(A.hombros[1], md, sube),
    lona: `translate(${n2(lona.centro[0])} ${n2(lona.centro[1])}) rotate(${n2(lona.giro)}) scale(1 ${n2(lona.sy)})`,
    aureola: `translate(${n2(ax + m.aureola[0])} ${n2(ay - sube + m.aureola[1])}) rotate(${n2(m.aureola[2])})`,
    nido: `translate(${n2(m.nido[0])} ${n2(m.nido[1])}) rotate(${n2(m.nido[2])})`,
  };
  const opacity: Record<string, string> = {
    parpados: f(m.parpado > 0.5 ? 1 : 0),
    bocaza: m.bocaza > 0.06 ? '1' : '0',
    llama: m.llama > 0.06 ? '1' : '0',
    nido: f(m.nidoSe),
  };
  return { transform, opacity };
}

/** Dónde dice su verso: arriba de la aureola, en el recinto. */
export const VERSO: Punto = alRecinto([0, -300]);
