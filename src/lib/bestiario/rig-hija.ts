/**
 * Los números de la hija del fletero (`D-73`, decimosexta vuelta): dónde está parada en la popa del
 * ferry que sale, cómo está armada, por dónde va el cable del tubo y cómo se da vuelta. Los lee el
 * dibujo (`arte-hija.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/hija.ts`), que se lleva esto y nada que dibuje. La misma cuenta la pone sin
 * JavaScript y con la isla.
 *
 * Dos sistemas de coordenadas:
 * - **El del títere**: el (0, 0) es la cubierta, entre los dos zapatos; arriba es negativo. Mira
 *   para la derecha, para donde sale el ferry: le da la espalda al muelle.
 * - **El del recinto** (900 × 640): el ferry es el de `ASTILLERO.ferry` (`rig-entornos.ts`) y ella
 *   pisa la cubierta, `ferry.cubierta`.
 *
 * El cable rizado del tubo sale de la mano, pasa por la baranda de la popa y se mete en el agua,
 * para el lado del muelle. Como el camino corre a cada personaje entero (`ancla · (k − 1)`), todo lo
 * que dibuja queda cerca de su ancla.
 */

import { ASTILLERO } from './rig-entornos.ts';

export type Punto = readonly [number, number];

/** Cómo está armada, en las coordenadas del títere. */
export const HIJA_ARMADA = {
  /** El talle, de donde cuelga la pollera que el viento empuja para el muelle. */
  talle: [0, -92] as Punto,
  /** El hombro de este lado (el izquierdo de ella, el que da a quien mira): de acá sale el brazo del tubo. */
  hombro: [-11, -124] as Punto,
  /** El cogote: de acá gira la cabeza, y de acá sale el pañuelo. */
  cuello: [2, -130] as Punto,
  /** El largo del brazo, del hombro al codo, y del antebrazo, del codo al medio de la mano. */
  largos: { brazo: 21, antebrazo: 19 },
  /** El ojo de perfil (el izquierdo de ella), con el párpado que baja. */
  ojo: { centro: [10.6, -145.4] as Punto, radio: [2.3, 1.15] as Punto },
  /** El ojo grande de la cara vuelta, el de la mujer del tubo: te mira de frente. */
  ojoVuelta: { centro: [-3.2, -145.2] as Punto, radio: [2.9, 1.6] as Punto },
  /** La oreja de este lado: ahí va el tubo cuando habla. */
  oreja: [-1.6, -143] as Punto,
  /** El pelo se eriza desde acá cuando le llega una descarga. */
  coronilla: [-1, -150] as Punto,
  /** El pañuelo atado al cuello, y el largo de cada uno de sus tres tramos. */
  nudo: [-3, -129] as Punto,
  tramo: 17,
  /**
   * La cabeza se dibuja a la medida del cuerpo y se agranda desde el cogote: a la medida, en el
   * teléfono se perdía la cara, y en la fotonovela la cara es todo.
   */
  agranda: 1.22,
} as const;

/** La hija en el recinto: en la popa del ferry, entre la planchada y la cabina. */
export const LUGAR = {
  x: 640,
  piso: ASTILLERO.ferry.cubierta,
  /**
   * Un poco más chica que el pibe, porque el ferry está más lejos, pero más grande de lo que le tocaría
   * al lado de las ventanas de la cabina: en la fotonovela la protagonista manda, y en el teléfono, más
   * chica, no se leía.
   */
  escala: 0.4,
} as const;

/** Del títere al recinto, y al revés. */
export const alRecinto = ([x, y]: Punto): Punto => [LUGAR.x + x * LUGAR.escala, LUGAR.piso + y * LUGAR.escala];
export const alTitere = ([x, y]: Punto): Punto => [(x - LUGAR.x) / LUGAR.escala, (y - LUGAR.piso) / LUGAR.escala];

/**
 * Por dónde va el cable, en el títere, después de la mano: la baranda de la popa (donde se apoya),
 * donde se mete en el agua, y hasta dónde se lo ve debajo del agua, yendo para el muelle.
 */
export const CABLE = {
  baranda: alTitere([611, ASTILLERO.ferry.cubierta - 3]),
  agua: alTitere([598, ASTILLERO.ferry.agua + 6]),
  hundido: alTitere([548, ASTILLERO.ferry.agua + 44]),
  /** El radio de cada rulo, y cuántos rulos entran por unidad de largo. */
  rulo: 2.2,
  paso: 0.62,
} as const;

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
  const d = Math.min(l1 + l2 - 0.4, Math.max(Math.abs(l1 - l2) + 0.4, Math.hypot(meta[0] - sx, meta[1] - sy)));
  const phi = Math.atan2(meta[1] - sy, meta[0] - sx);
  const alfa = Math.acos(entre01(((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d) + 1) / 2) * 2 - 1);
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

export interface Momento {
  /** Cuánto se dio vuelta a mirarte, de 0 (mira al río) a 1 (te mira por encima del hombro). */
  vuelta: number;
  /** Cuánto gira la cabeza en el cogote (asiente mientras habla), en grados. */
  cabeza: number;
  /** El pecho que sube y baja, de -1 a 1. */
  respira: number;
  /** Los hombros que suben con la descarga, de 0 a 1. */
  hombros: number;
  /** El pelo erizado por la descarga, de 0 a 1. */
  eriza: number;
  /** El tubo: de 0 (en la oreja) a 1 (bajado al pecho, mientras te mira). */
  baja: number;
  /** El viento: cuánto empuja la pollera, el pelo y el pañuelo, y en qué fase va cada tramo del pañuelo. */
  viento: number;
  panuelo: readonly [number, number, number];
  /** El párpado del ojo que se ve, de 0 (abierto) a 1 (cerrado). */
  parpado: number;
  /** La descarga que corre por el cable: dónde va (0 es la mano, 1 el agua; `null` es que no hay) y cuánto brilla. */
  chispa: { donde: number; brillo: number } | null;
}

/** La pose quieta, la del HTML: de perfil, con el tubo en la oreja, mirando el río. */
export const QUIETA: Momento = {
  vuelta: 0,
  cabeza: 0,
  respira: 0,
  hombros: 0,
  eriza: 0,
  baja: 0,
  viento: 0.5,
  panuelo: [0.6, 1.9, 3.1],
  parpado: 0.3,
  chispa: null,
};

/** La que te mira: la del toque con movimiento reducido, y la del retrato. */
export const VUELTA: Momento = { ...QUIETA, vuelta: 1, baja: 1, parpado: 0.18 };

/* ------------------------------------------------------------------
   La pose: del momento a cada pieza
   ------------------------------------------------------------------ */

/** Lo que el pecho sube al respirar, y los hombros con la descarga, en el títere. */
const RESPIRA = 0.8;
const ENCOGE = 3.4;

/** Lo que el torso le hace a un punto de arriba del talle: lo levanta al respirar y al encogerse. */
const delTorso = (p: Punto, m: Momento): Punto => [p[0], p[1] - m.respira * RESPIRA - m.hombros * ENCOGE];

/** Cuánto gira la cabeza para mirarte: de perfil a tres cuartos, por encima del hombro. */
export const GIRO_VUELTA = -9;

/** Dónde está el tubo en el dibujo de la cabeza: el auricular en la oreja, el micrófono en la boca. */
export const TUBO = { oreja: [-1.4, -143.6] as Punto, boca: [9, -133.2] as Punto } as const;

/** Un punto del dibujo de la cabeza, llevado al títere con el cuello y el giro como están. */
export function enLaCabeza(p: Punto, m: Momento): Punto {
  const A = HIJA_ARMADA;
  const cuello = delTorso(A.cuello, m);
  const grande: Punto = [A.cuello[0] + (p[0] - A.cuello[0]) * A.agranda, A.cuello[1] + (p[1] - A.cuello[1]) * A.agranda];
  const [x, y] = rotar(grande, A.cuello, m.cabeza + GIRO_VUELTA * m.vuelta);
  return [x + cuello[0] - A.cuello[0], y + cuello[1] - A.cuello[1]];
}

/** El medio del tubo y para dónde apunta (grados), en el títere: en la oreja o bajado al pecho. */
export function tuboEn(m: Momento): { centro: Punto; giro: number } {
  const enOreja: Punto = enLaCabeza([(TUBO.oreja[0] + TUBO.boca[0]) / 2, (TUBO.oreja[1] + TUBO.boca[1]) / 2], m);
  const giroOreja = (Math.atan2(TUBO.boca[1] - TUBO.oreja[1], TUBO.boca[0] - TUBO.oreja[0]) * 180) / Math.PI + m.cabeza + GIRO_VUELTA * m.vuelta;
  // Bajado, lo tiene contra el pecho, con el auricular para arriba: lo deja de lado para mirarte.
  const enPecho: Punto = delTorso([-5, -112], m);
  const k = m.baja;
  return { centro: [mezcla(enOreja[0], enPecho[0], k), mezcla(enOreja[1], enPecho[1], k)], giro: mezcla(giroOreja, 64, k) };
}

/** Un punto del dibujo del tubo (el medio en 0, 0, a lo largo del eje x) llevado al títere. */
export function enElTubo(p: Punto, m: Momento): Punto {
  const { centro, giro } = tuboEn(m);
  const [x, y] = rotar([p[0] * HIJA_ARMADA.agranda, p[1] * HIJA_ARMADA.agranda], [0, 0], giro);
  return [x + centro[0], y + centro[1]];
}

/** El medio largo del tubo, y de dónde sale el cable (la punta del micrófono). */
export const TUBO_LARGO = Math.hypot(TUBO.boca[0] - TUBO.oreja[0], TUBO.boca[1] - TUBO.oreja[1]) / 2;
export const salidaDelCable = (m: Momento): Punto => enElTubo([TUBO_LARGO + 1.2, 1.4], m);

/** El brazo del tubo: lleva la mano al medio del tubo, con el codo para abajo y adelante. */
export function brazo(m: Momento): { arriba: number; abajo: number; codo: Punto; mano: Punto; hombro: Punto } {
  const A = HIJA_ARMADA;
  const hombro = delTorso(A.hombro, m);
  const meta = enElTubo([0.4, 1.8], m);
  return { ...alcanzar(hombro, A.largos.brazo, A.largos.antebrazo, meta, [-0.55, 1]), hombro };
}

/**
 * El cable rizado, de la mano al agua: una línea de base (la mano, una panza que cuelga, la baranda,
 * el agua y lo hundido) y, a lo largo de ella, los rulos. Los rulos son un punto que gira alrededor de
 * la base mientras avanza: donde gira más rápido que lo que avanza, hace el rulo de los cables de
 * teléfono. Devuelve los puntos, en el títere.
 */
export function baseDelCable(m: Momento): Punto[] {
  const desde = salidaDelCable(m);
  const { baranda, agua, hundido } = CABLE;
  // Entre la mano y la baranda el cable cuelga en panza, y se mece con el viento.
  const panza: Punto = [mezcla(desde[0], baranda[0], 0.35) + m.viento * 3, mezcla(desde[1], baranda[1], 0.62) + 10 - m.vuelta * 6];
  const tramos: Punto[] = [desde, panza, baranda, agua, hundido];
  // Una curva suave por esos puntos, muestreada.
  const salida: Punto[] = [];
  const n = tramos.length;
  const en = (i: number): Punto => tramos[Math.min(n - 1, Math.max(0, i))]!;
  for (let i = 0; i < n - 1; i++) {
    const [p0, p1, p2, p3] = [en(i - 1), en(i), en(i + 1), en(i + 2)];
    const largo = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const pasos = Math.max(4, Math.round(largo / 1.6));
    for (let j = 0; j < pasos; j++) {
      const t = j / pasos;
      const t2 = t * t;
      const t3 = t2 * t;
      const c = (a: number, b: number, c2: number, d: number): number =>
        0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (-a + 3 * b - 3 * c2 + d) * t3);
      salida.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  salida.push(hundido);
  return salida;
}

/** Hasta qué punto de la base el cable está afuera del agua (lo que sigue va hundido). */
export function cuantoAfuera(base: readonly Punto[]): number {
  const i = base.findIndex((p) => p[1] > CABLE.agua[1]);
  return i < 0 ? base.length : i;
}

/**
 * Los rulos sobre la base: el trazo del cable. Se recorre la base a pasos cortos y, a cada paso, el
 * punto gira alrededor de ella: adelante y atrás (`cos`), de costado (`sin`). Como el giro es más
 * rápido que el avance, cada vuelta hace un rulo, como los cables de teléfono. `fase` lo corre.
 */
export function rulos(base: readonly Punto[], fase = 0, hasta = base.length): Punto[] {
  const out: Punto[] = [];
  const omega = (Math.PI * 2) / (1 / CABLE.paso) / 1.6;
  let s = 0;
  for (let i = 0; i < Math.min(hasta, base.length) - 1; i++) {
    const [a, b] = [base[i]!, base[i + 1]!];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-6;
    const [ux, uy] = [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
    const pasos = Math.max(1, Math.ceil(l / 0.35));
    for (let k = 0; k < pasos; k++) {
      const t = k / pasos;
      const ang = (s + t * l) * omega + fase;
      // Lo que cuelga cerca del agua tira más: los rulos se estiran y se achican.
      const r = CABLE.rulo * (1 - 0.35 * (i / base.length));
      const [x, y] = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      out.push([x + ux * Math.cos(ang) * r * 0.75 - uy * Math.sin(ang) * r, y + uy * Math.cos(ang) * r * 0.75 + ux * Math.sin(ang) * r]);
    }
    s += l;
  }
  return out;
}

/** Un punto de la base, en `t` de 0 (la mano) a 1 (lo hundido): por donde corre la descarga. */
export function enElCable(base: readonly Punto[], t: number): Punto {
  const largos = base.slice(1).map((p, i) => Math.hypot(p[0] - base[i]![0], p[1] - base[i]![1]));
  const total = largos.reduce((s, l) => s + l, 0);
  let falta = entre01(t) * total;
  for (let i = 0; i < largos.length; i++) {
    const l = largos[i]!;
    if (falta <= l) {
      const k = l ? falta / l : 0;
      return [base[i]![0] + (base[i + 1]![0] - base[i]![0]) * k, base[i]![1] + (base[i + 1]![1] - base[i]![1]) * k];
    }
    falta -= l;
  }
  return base[base.length - 1]!;
}

const n2 = (v: number): string => v.toFixed(2);
const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** El trazo del cable, en `d`: lo de afuera y lo hundido, por separado (lo hundido va tenue). */
export function trazoDelCable(m: Momento, fase = 0): { afuera: string; hundido: string } {
  const base = baseDelCable(m);
  const corte = cuantoAfuera(base);
  const d = (pts: readonly Punto[]): string => (pts.length ? `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')}` : '');
  return { afuera: d(rulos(base, fase, corte + 1)), hundido: d(base.slice(Math.max(0, corte - 1))) };
}

/**
 * Las transformaciones, las opacidades y los trazos de cada parte para un momento: los escribe el
 * dibujo en el HTML (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento, fase = 0): { transform: Record<string, string>; opacity: Record<string, string>; d: Record<string, string> } {
  const A = HIJA_ARMADA;
  const b = brazo(m);
  const t = tuboEn(m);
  const torsoY = -m.respira * RESPIRA - m.hombros * ENCOGE;
  const cuello = delTorso(A.cuello, m);
  const giro = m.cabeza + GIRO_VUELTA * m.vuelta;
  const [hx, hy] = A.hombro;
  const transform: Record<string, string> = {
    entero: `translate(${n2(LUGAR.x)} ${n2(LUGAR.piso)}) scale(${LUGAR.escala})`,
    // El torso sube entero desde el talle: con la descarga, como el que se encoge de hombros.
    torso: `translate(0 ${n2(torsoY)})`,
    // La pollera la empuja el viento para el lado del muelle, desde el talle.
    pollera: `rotate(${n2(3 + m.viento * 4 + Math.sin(m.panuelo[0] * 0.7) * 1.2)} ${A.talle[0]} ${A.talle[1]}) skewX(${n2(m.viento * 3)})`,
    cabeza:
      `translate(${n2(cuello[0] - A.cuello[0])} ${n2(cuello[1] - A.cuello[1])}) rotate(${n2(giro)} ${A.cuello[0]} ${A.cuello[1]}) ` +
      `translate(${A.cuello[0]} ${A.cuello[1]}) scale(${A.agranda}) translate(${-A.cuello[0]} ${-A.cuello[1]})`,
    // El pelo que vuela para el muelle, y que se eriza con la descarga.
    pelo: `rotate(${n2(-2 - m.viento * 2 + Math.sin(m.panuelo[1]) * 1.4)} ${A.coronilla[0]} ${A.coronilla[1]}) translate(${A.coronilla[0]} ${A.coronilla[1]}) scale(${n2(1 + m.eriza * 0.16)} ${n2(1 + m.eriza * 0.22)}) translate(${-A.coronilla[0]} ${-A.coronilla[1]})`,
    brazo: `translate(${n2(b.hombro[0] - hx)} ${n2(b.hombro[1] - hy)}) rotate(${n2(b.arriba)} ${hx} ${hy})`,
    antebrazo: `rotate(${n2(b.abajo)} ${hx} ${hy + A.largos.brazo})`,
    tubo: `translate(${n2(t.centro[0])} ${n2(t.centro[1])}) rotate(${n2(t.giro)}) scale(${A.agranda})`,
    'parpado': `translate(${A.ojo.centro[0]} ${n2(A.ojo.centro[1] - A.ojo.radio[1])}) scale(1 ${n2(m.parpado)}) translate(${-A.ojo.centro[0]} ${n2(-(A.ojo.centro[1] - A.ojo.radio[1]))})`,
    'parpado-vuelta': `translate(${A.ojoVuelta.centro[0]} ${n2(A.ojoVuelta.centro[1] - A.ojoVuelta.radio[1])}) scale(1 ${n2(m.parpado)}) translate(${-A.ojoVuelta.centro[0]} ${n2(-(A.ojoVuelta.centro[1] - A.ojoVuelta.radio[1]))})`,
  };
  // El pañuelo: tres tramos, cada uno colgado del anterior, que flamean para el lado del muelle. Van
  // adentro del torso, que ya sube con la respiración: se cuentan desde el nudo quieto.
  let [px, py] = A.nudo;
  let ang = 180 - 16 + m.viento * 8;
  for (let i = 0; i < 3; i++) {
    const onda = Math.sin(m.panuelo[i]!) * (8 + i * 6) * (0.5 + m.viento);
    ang += onda * 0.5;
    transform[`panuelo-${i + 1}`] = `translate(${n2(px)} ${n2(py)}) rotate(${n2(ang - 180)})`;
    const r = (ang * Math.PI) / 180;
    px += Math.cos(r) * A.tramo;
    py += Math.sin(r) * A.tramo;
  }
  const chispa = m.chispa ? enElCable(baseDelCable(m), m.chispa.donde) : null;
  if (chispa) transform.chispa = `translate(${n2(chispa[0])} ${n2(chispa[1])}) scale(${n2(0.6 + (m.chispa?.brillo ?? 0) * 0.7)})`;
  const opacity: Record<string, string> = {
    // La cara vuelta se funde encima del perfil, que no se apaga hasta que la tapa entera.
    perfil: m.vuelta < 0.98 ? '1.00' : '0.00',
    vuelta: n2(m.vuelta),
    chispa: n2(m.chispa ? m.chispa.brillo : 0),
    // La luz de la descarga en la cara, cuando llega, y el pelo parado por la estática.
    resplandor: n2(m.eriza * 0.85),
    erizo: n2(Math.min(1, m.eriza * 1.6)),
  };
  const cable = trazoDelCable(m, fase);
  return { transform, opacity, d: { cable: cable.afuera, 'cable-luz': cable.afuera, hundido: cable.hundido } };
}

/** Dónde dice su verso: arriba de ella, sobre la cabina del ferry. */
export const VERSO: Punto = [LUGAR.x + 18, LUGAR.piso - 78];
