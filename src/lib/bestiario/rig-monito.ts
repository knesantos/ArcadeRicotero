/**
 * Los números del monito que trepa (`D-73`, decimoquinta vuelta): dónde se agarra al tronco del árbol
 * del gran bonete, cómo está armado y cómo trepa. Los lee el dibujo (`arte-monito.ts`), para la pose
 * quieta que está en el HTML y para el retrato, y la conducta (`scripts/bestiario/monito.ts`), que se
 * lleva esto y nada que dibuje. Por eso la pose se calcula acá: la misma cuenta pone al monito sin
 * JavaScript y con la isla, y no hay dos poses quietas que se puedan separar.
 *
 * Dos sistemas de coordenadas:
 * - **El del títere**: el (0, 0) es la cadera, donde nace la cola; arriba es negativo. Se dibuja a
 *   esta medida y la escena lo achica con `MONITO.escala`.
 * - **El del recinto** (900 × 640): el tronco es el de `ARBOL.tronco` (`rig-entornos.ts`), con el eje
 *   en `x` 450.
 */

import { ARBOL } from './rig-entornos.ts';

export type Punto = readonly [number, number];

/** Cómo está armado, en las coordenadas del títere. */
export const MONITO_ARMADO = {
  /** De acá gira la cabeza: mira, se agacha a mirarte desde arriba, se da vuelta a mirarse. */
  cuello: [-2, -88] as Punto,
  /** Los hombros y las caderas: de acá sale cada brazo y cada pata. La 1 es la izquierda. */
  hombros: [[-29, -76], [29, -76]] as readonly [Punto, Punto],
  caderas: [[-19, -6], [19, -6]] as readonly [Punto, Punto],
  /** Los largos de cada tramo: el brazo, el antebrazo hasta el medio de la mano, el muslo, la pata hasta el medio del pie. */
  largos: { brazo: 40, antebrazo: 44, muslo: 34, pata: 38 },
  /** De dónde nace la cola, y dónde empieza el rulo. La cola se dibuja colgando derecho. */
  cola: [0, -2] as Punto,
  rulo: [1, 26] as Punto,
  /** El medio del culo pelado: se dibuja escondido debajo del pelo del lomo, y sale al trepar. */
  culo: [0, 9] as Punto,
  /** Los ojos: el de la izquierda es el que da a la luz. Chicos y hundidos, como los del busto. */
  ojos: [
    { centro: [-14.5, -110.5] as Punto, radio: [5.2, 3.6] as Punto },
    { centro: [-2.6, -111.5] as Punto, radio: [4.4, 3.3] as Punto },
  ],
  /** La boca, donde aparece la mueca de los dientes. */
  boca: [-11, -94.5] as Punto,
  /** Donde se rasca: la coronilla, del lado del pelo. */
  coronilla: [7, -127] as Punto,
} as const;

/**
 * El monito en el recinto. `abajo` es dónde queda la cadera a media altura del tronco, quieto y
 * tapado. Trepa tres trancos enteros (`TRAMO`), hasta donde las ramas empiezan a abrirse.
 */
export const MONITO = {
  /** El eje del tronco: el ancla del personaje. */
  x: ARBOL.tronco.x,
  escala: 0.48,
  abajo: 420,
  /** Lo que sube y baja cada mano y cada pie en un tranco, en el recinto. */
  paso: 11,
  /** Qué parte del tranco va cada miembro por el aire (el resto está agarrado). */
  vuelo: 0.32,
  /** Lo que trepa por segundo, de promedio, y lo que baja (baja más ligero: ya sabe por dónde). */
  sube: 24,
  baja: 34,
} as const;

/** Lo que sube la cadera en un tranco entero: cada mano y cada pie se sueltan una vez. */
export const PERIODO = (2 * MONITO.paso) / (1 - MONITO.vuelo);
/**
 * Lo que trepa de punta a punta: tres trancos. Cada medio tranco los cuatro están agarrados, así que
 * donde se para (abajo, arriba, a mitad de camino) nunca queda una mano en el aire.
 */
export const TRAMO = PERIODO * 3;
/** Donde queda la cadera arriba de todo. */
export const ARRIBA = MONITO.abajo - TRAMO;
/** Los lugares del tronco donde se puede parar: cada medio tranco. */
export const PARADAS: readonly number[] = [0, 1, 2, 3, 4, 5, 6].map((k) => (k * PERIODO) / 2);

/** Un miembro: de dónde sale (en el títere), por dónde se agarra (en el recinto, respecto del eje y de la cadera). */
interface Miembro {
  /** `brazo-1`, `pata-2`: el nombre de la pieza de arriba; la de abajo es `mano-n` o `pie-n`. */
  nombre: 'brazo-1' | 'brazo-2' | 'pata-1' | 'pata-2';
  /** Cuánto del tranco lleva de ventaja. */
  fase: number;
  /** La `x` del agarre, respecto del eje del tronco. */
  x: number;
  /** La `y` de su lugar de descanso respecto de la cadera, tapado (abajo) y destapado (arriba). */
  y: readonly [number, number];
  /** Para qué lado se dobla el codo o la rodilla: afuera y abajo. */
  dobla: Punto;
}

/**
 * El canto del tronco, medido sobre la curva de `siluetaDelArbol` (`arte-entornos.ts`): entre la
 * horqueta y el pie el tronco tiene unos 55 de ancho, y cada canto anda a 27,5 del eje.
 */
export const CANTO = 27.5;

/**
 * Las manos y los pies se agarran del canto del tronco: el puño queda encima del canto y los dedos se
 * van para atrás, donde no se ven. Abajo los pies van recogidos, casi a la altura de la cadera, y las
 * rodillas encierran el culo; arriba van estirados, y el culo queda en el medio.
 */
export const MIEMBROS: readonly Miembro[] = [
  { nombre: 'brazo-1', fase: 0.5, x: -25, y: [-58, -58], dobla: [-1, 0.3] },
  { nombre: 'brazo-2', fase: 0, x: 25, y: [-58, -58], dobla: [1, 0.3] },
  { nombre: 'pata-1', fase: 0, x: -24, y: [-6, 10], dobla: [-0.6, 1] },
  { nombre: 'pata-2', fase: 0.5, x: 24, y: [-4, 10], dobla: [0.6, 1] },
];

const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;
const suave = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/** Cuánto se destapó, de 0 a 1, según lo que trepó: lo dice el verso, cuanto más alto más se ve. */
export const destape = (subido: number): number => suave(subido / TRAMO);

/** La cadera en el recinto, según lo que trepó. */
export const caderaEn = (subido: number): Punto => [MONITO.x, MONITO.abajo - subido];

/**
 * Dónde se agarra un miembro, en el recinto, según lo que trepó. Cada miembro tiene un tranco que se
 * repite: agarrado, el agarre no se mueve mientras el cuerpo sube; suelto, va por el aire al agarre
 * siguiente. Lo que trepó decide todo, así que bajar es el mismo tranco al revés, y la pose quieta
 * sale de la misma cuenta.
 */
export function agarre(m: Miembro, subido: number): { punto: Punto; suelto: number } {
  const A = MONITO.paso;
  const periodo = PERIODO;
  const u =(((subido / periodo + m.fase) % 1) + 1) % 1;
  const plantado = subido - u * periodo;
  const enDescanso = (s: number): number => {
    const [, cy] = caderaEn(s);
    return cy + mezcla(m.y[0], m.y[1], destape(Math.max(0, s))) - A;
  };
  const x = MONITO.x + m.x;
  if (u < 1 - MONITO.vuelo) return { punto: [x, enDescanso(plantado)], suelto: 0 };
  const k = (u - (1 - MONITO.vuelo)) / MONITO.vuelo;
  const y = mezcla(enDescanso(plantado), enDescanso(plantado + periodo), suave(k));
  return { punto: [x, y], suelto: Math.sin(Math.PI * k) };
}

/**
 * Un miembro de dos tramos que lleva la punta a un punto, en las coordenadas del títere. Devuelve
 * cuánto gira el tramo de arriba en su articulación y cuánto gira el de abajo adentro del de arriba
 * (así están anidados en la página). El codo o la rodilla va para el lado de `dobla`.
 */
export function alcanzar(raiz: Punto, largo1: number, largo2: number, haciaArriba: boolean, meta: Punto, dobla: Punto): { arriba: number; abajo: number; codo: Punto; punta: Punto } {
  const [sx, sy] = raiz;
  const lejos = Math.hypot(meta[0] - sx, meta[1] - sy);
  const d = Math.min(largo1 + largo2 - 0.5, Math.max(Math.abs(largo1 - largo2) + 0.5, lejos));
  const phi = Math.atan2(meta[1] - sy, meta[0] - sx);
  const alfa = Math.acos(Math.min(1, Math.max(-1, (largo1 * largo1 + d * d - largo2 * largo2) / (2 * largo1 * d))));
  const codos = [phi + alfa, phi - alfa].map((a) => [sx + Math.cos(a) * largo1, sy + Math.sin(a) * largo1] as const);
  const [mx, my] = [sx + Math.cos(phi) * d * 0.5, sy + Math.sin(phi) * d * 0.5];
  const cuanto = ([x, y]: Punto): number => (x - mx) * dobla[0] + (y - my) * dobla[1];
  const codo = cuanto(codos[0]!) >= cuanto(codos[1]!) ? codos[0]! : codos[1]!;
  // Los tramos se dibujan derechos, para arriba (los brazos) o para abajo (las patas).
  const referencia = haciaArriba ? -90 : 90;
  const grados = (x: number, y: number): number => (Math.atan2(y, x) * 180) / Math.PI;
  const vuelta = (a: number): number => ((((a + 180) % 360) + 360) % 360) - 180;
  const arriba = vuelta(grados(codo[0] - sx, codo[1] - sy) - referencia);
  const abajo = vuelta(grados(meta[0] - codo[0], meta[1] - codo[1]) - grados(codo[0] - sx, codo[1] - sy));
  // Donde queda la punta de verdad: la meta, o lo más cerca que llega si no le da el largo.
  const hasta = Math.hypot(meta[0] - codo[0], meta[1] - codo[1]) || 1;
  const punta: Punto = [codo[0] + ((meta[0] - codo[0]) / hasta) * largo2, codo[1] + ((meta[1] - codo[1]) / hasta) * largo2];
  return { arriba, abajo, codo, punta };
}

/** Del recinto al títere, con la cadera en `cadera` (sin giro: el monito trepa derecho). */
export const alTitere = ([x, y]: Punto, [cx, cy]: Punto): Punto => [(x - cx) / MONITO.escala, (y - cy) / MONITO.escala];

/** La pose de los cuatro miembros, en grados, para lo que trepó. */
export interface Pose {
  cadera: Punto;
  miembros: Record<Miembro['nombre'], { arriba: number; abajo: number; punta: Punto }>;
  /** La cola: cuánto gira desde donde nace, y cuánto el rulo adentro de ella. */
  cola: number;
  rulo: number;
  /** El culo pelado: cuánto baja y cuánto crece al asomar debajo del pelo. */
  culo: { baja: number; crece: number };
}

/** Cuánto gira la cola: colgada sobre el culo (0) o levantada al costado para el equilibrio. */
export const COLA = { tapa: 0, levantada: -138, rulo: { tapa: 0, levantada: -28 } } as const;
/** Cuánto baja y crece el culo pelado, tapado y destapado: abajo queda entero debajo del pelo. */
export const CULO = { baja: [-14, 10] as Punto, crece: [0.78, 1.1] as Punto } as const;

/**
 * Lo que la conducta le agrega a la pose: `corre` mueve la cadera (respira, se acomoda) y `cambia`
 * lleva una mano a otro lado (a rascarse). Los agarres no se mueven: los brazos y las patas se doblan.
 */
export interface Retoque {
  corre?: Punto;
  cambia?: (nombre: string, agarre: Punto) => Punto;
}

export function pose(subido: number, retoque: Retoque = {}): Pose {
  const [cx, cy] = caderaEn(subido);
  const cadera: Punto = [cx + (retoque.corre?.[0] ?? 0), cy + (retoque.corre?.[1] ?? 0)];
  const k = destape(subido);
  const A = MONITO_ARMADO;
  const miembros = {} as Pose['miembros'];
  for (const m of MIEMBROS) {
    const { punto } = agarre(m, subido);
    const meta = alTitere(retoque.cambia ? retoque.cambia(m.nombre, punto) : punto, cadera);
    const brazo = m.nombre.startsWith('brazo');
    const n = Number(m.nombre.slice(-1)) - 1;
    const raiz = brazo ? A.hombros[n]! : A.caderas[n]!;
    const [l1, l2] = brazo ? [A.largos.brazo, A.largos.antebrazo] : [A.largos.muslo, A.largos.pata];
    const r = alcanzar(raiz, l1, l2, brazo, meta, m.dobla);
    miembros[m.nombre] = { arriba: r.arriba, abajo: r.abajo, punta: r.punta };
  }
  return {
    cadera,
    miembros,
    cola: mezcla(COLA.tapa, COLA.levantada, k),
    rulo: mezcla(COLA.rulo.tapa, COLA.rulo.levantada, k),
    culo: { baja: mezcla(CULO.baja[0], CULO.baja[1], k), crece: mezcla(CULO.crece[0], CULO.crece[1], k) },
  };
}

/** Dónde dice su verso: arriba de donde termina de trepar, así el bocadillo no le tapa la subida. */
export const VERSO: Punto = [MONITO.x, ARRIBA - 82];

/**
 * Lo que hace con la cara: cuánto gira la cabeza (positivo es para arriba), adónde miran las
 * pupilas (de -1 a 1 en cada eje), cuánto bajan los párpados y si pela los dientes.
 */
export interface Gesto {
  cabeza: number;
  mira: Punto;
  parpados: readonly [number, number];
  mueca: number;
}

/** Los dos gestos quietos: abajo te mira de reojo, desconfiado; arriba se agacha a mirarte y pela los dientes. */
export const GESTOS: Readonly<Record<'vos' | 'abajo', Gesto>> = {
  vos: { cabeza: 0, mira: [0.2, 0.15], parpados: [0.22, 0.26], mueca: 0 },
  abajo: { cabeza: -15, mira: [0.35, 0.85], parpados: [0.1, 0.14], mueca: 1 },
};

/**
 * Adónde mira la conducta, con la cabeza y los ojos: a vos, para arriba (adonde quiere llegar), al
 * jocker que se burla, al ángel de abajo, y a su propio culo. `parpados` es cuánto los baja.
 */
export const MIRADAS: Readonly<Record<'vos' | 'arriba' | 'jocker' | 'angel' | 'culo' | 'abajo', Omit<Gesto, 'mueca'>>> = {
  vos: GESTOS.vos,
  arriba: { cabeza: 12, mira: [0.15, -1], parpados: [0.04, 0.06] },
  jocker: { cabeza: 4, mira: [-1, 0.15], parpados: [0.18, 0.22] },
  angel: { cabeza: -7, mira: [-0.9, 0.9], parpados: [0.28, 0.32] },
  culo: { cabeza: -26, mira: [0.8, 1], parpados: [0.42, 0.46] },
  abajo: GESTOS.abajo,
};

/** Cuánto se corre la pupila adentro del blanco, en el títere. */
export const MIRA = [1.7, 1.1] as const;

/** De dónde baja cada párpado: el borde de arriba del ojo. */
export const PIVOTES_PARPADO: readonly Punto[] = MONITO_ARMADO.ojos.map(({ centro: [cx, cy], radio: [, ry] }) => [cx, Math.round((cy - ry - 0.6) * 10) / 10] as const);

const n2 = (v: number): string => v.toFixed(2);

/**
 * Las transformaciones de cada parte de la página para una pose y un gesto: las escribe el dibujo en
 * el HTML (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function transformes(p: Pose, g: Gesto | 'vos' | 'abajo'): Record<string, string> {
  const gesto = typeof g === 'string' ? GESTOS[g] : g;
  const A = MONITO_ARMADO;
  const t: Record<string, string> = {
    entero: `translate(${n2(p.cadera[0])} ${n2(p.cadera[1])}) scale(${MONITO.escala})`,
    culo: `translate(0 ${n2(p.culo.baja)}) translate(${A.culo[0]} ${A.culo[1]}) scale(${p.culo.crece.toFixed(3)}) translate(${-A.culo[0]} ${-A.culo[1]})`,
    cola: `rotate(${n2(p.cola)} ${A.cola[0]} ${A.cola[1]})`,
    rulo: `rotate(${n2(p.rulo)} ${A.rulo[0]} ${A.rulo[1]})`,
    cabeza: `rotate(${n2(gesto.cabeza)} ${A.cuello[0]} ${A.cuello[1]})`,
    mueca: n2(gesto.mueca),
  };
  for (const n of [1, 2] as const) {
    const [sx, sy] = A.hombros[n - 1];
    const [cx, cy] = A.caderas[n - 1];
    const b = p.miembros[`brazo-${n}`];
    const q = p.miembros[`pata-${n}`];
    t[`brazo-${n}`] = `rotate(${n2(b.arriba)} ${sx} ${sy})`;
    t[`mano-${n}`] = `rotate(${n2(b.abajo)} ${sx} ${sy - A.largos.brazo})`;
    t[`pata-${n}`] = `rotate(${n2(q.arriba)} ${cx} ${cy})`;
    t[`pie-${n}`] = `rotate(${n2(q.abajo)} ${cx} ${cy + A.largos.muslo})`;
    t[`pupila-${n}`] = `translate(${n2(gesto.mira[0] * MIRA[0])} ${n2(gesto.mira[1] * MIRA[1])})`;
    const [px, py] = PIVOTES_PARPADO[n - 1]!;
    t[`parpado-${n}`] = `translate(${px} ${py}) scale(1 ${n2(gesto.parpados[n - 1]!)}) translate(${-px} ${-py})`;
  }
  return t;
}
