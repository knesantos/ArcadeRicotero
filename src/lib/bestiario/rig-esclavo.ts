/**
 * Los números del esclavo sensible y chillón (`D-73`, decimoquinta vuelta): en qué celda de la prisión
 * de Barbazul está preso, cómo está armado y qué hace con la cara. Los lee el dibujo (`arte-esclavo.ts`),
 * para la pose quieta del HTML y para el retrato, y la conducta (`scripts/bestiario/esclavo.ts`), que se
 * lleva esto y nada que dibuje. La pose se calcula acá, así la misma cuenta lo pone sin JavaScript y con
 * la isla.
 *
 * Dos sistemas de coordenadas:
 * - **El del títere**: el (0, 0) es donde se sienta, en el medio del catre; arriba es negativo. Se dibuja
 *   a esta medida y la escena lo achica con `ESCLAVO.escala`.
 * - **El del recinto** (900 × 640): la celda es la del fondo a la derecha del pasillo (`celda` en
 *   `arte-prision.ts`), entre la garita de la guardia y la jaula de la fiera.
 */

import { PRISION } from './rig.ts';

export type Punto = readonly [number, number];

/* ------------------------------------------------------------------
   La celda: la del fondo a la derecha del pasillo
   ------------------------------------------------------------------
   Es la que `prisionLejos` talla con `celda(1, 0.64, 0.88, 0.66, T.gris, 350)`. Se eligió esa y no la
   de sus ojos de antes (la del fondo a la izquierda): aquella queda detrás del brazo de Barbazul, y la
   de adelante a la derecha, detrás de la jaula de la fiera. Esta se ve entera, al lado de la ventana.
*/

/** La celda, con los mismos números con que la talla `prisionLejos` (`arte-prision.ts`). */
export const CELDA = { lado: 1, u0: 0.64, u1: 0.88, alto: 0.66, semilla: 350 } as const;

const ANCHO = 900;
const ALTO = 640;

/**
 * Un punto de la pared del costado, como lo calcula `enPared` en `arte-prision.ts`: `u` va de adelante
 * (0) al fondo (1), `v` del piso (0) al techo (1).
 */
export function enPared(lado: number, u: number, v: number): [number, number] {
  const F = PRISION.fondo;
  const x = lado < 0 ? F.x0 * u : ANCHO - (ANCHO - F.x1) * u;
  const techo = F.techo * u;
  const piso = ALTO - (ALTO - F.piso) * u;
  return [x, piso - (piso - techo) * v];
}

/** El hueco de la celda, en el recinto: lo que se ve de él. Lo de afuera es pared. */
export const HUECO: readonly Punto[] = [
  enPared(CELDA.lado, CELDA.u0, 0),
  enPared(CELDA.lado, CELDA.u1, 0),
  enPared(CELDA.lado, CELDA.u1, CELDA.alto),
  enPared(CELDA.lado, CELDA.u0, CELDA.alto),
];

/** Dónde caen los barrotes de la reja de la celda (sin el temblor de la mano), de adelante al fondo. */
export const BARROTES: readonly number[] = (() => {
  const n = Math.round((CELDA.u1 - CELDA.u0) * 22);
  return Array.from({ length: n - 1 }, (_, i) => enPared(CELDA.lado, CELDA.u0 + ((CELDA.u1 - CELDA.u0) * (i + 1)) / n, 0)[0]);
})();

/** La altura de un travesaño de la reja en una `x` de la celda (`v` es la de `celda`, de 0 a 1). */
export function travesanio(x: number, v: number): number {
  const u = (ANCHO - x) / (ANCHO - PRISION.fondo.x1);
  return enPared(CELDA.lado, u, v)[1];
}

/** Los dos travesaños de la reja, como los pone `celda`. */
export const TRAVESANIOS = [CELDA.alto * 0.18, CELDA.alto * 0.82] as const;

/* ------------------------------------------------------------------
   El esclavo en la celda
   ------------------------------------------------------------------ */

/**
 * Dónde está sentado, en el recinto: en el medio de la celda, sobre un catre colgado de la pared. El
 * catre queda arriba de los ojos de los reos de la sociedad (`[712, 382]`), que miran desde lo oscuro
 * de abajo. La escala la pide la celda: sentado, la cabeza llega al travesaño de arriba y la cara queda
 * en el último paño de la reja, entre el travesaño y el marco.
 */
export const ESCLAVO = { x: 711, asiento: 356, escala: 0.55 } as const;

/** Cómo está armado, en las coordenadas del títere. */
export const ESCLAVO_ARMADO = {
  /** De acá gira la cabeza: mira la calle, se esconde en los brazos, se echa para atrás. */
  cuello: [1, -214] as Punto,
  /** El medio de la cara, entre los ojos y la boca: de acá se mide todo lo de la cabeza. */
  cara: [-3, -248] as Punto,
  /**
   * La cabeza se dibuja a su medida y se agranda desde la cara, como la de Barbazul: a la medida del
   * cuerpo, en una celda de sesenta de ancho, la cara se perdía.
   */
  agranda: 1.2,
  /** La línea de la boca, en las coordenadas del títere: hasta acá llega la cabeza; abajo, la quijada. */
  boca: -227.6,
  /** Cuánto baja la quijada cuando chilla. */
  abre: 11,
  /**
   * Los ojos, ya agrandados. La cara está vuelta de tres cuartos hacia la ventana: el de la izquierda
   * queda del lado de allá, chico; el de la derecha es el de este lado, en la mejilla que se come la
   * sombra. Las pupilas y los párpados no se imprimen: los pone la página.
   */
  ojos: [
    { centro: [-23.4, -257.6] as Punto, radio: [5.3, 3] as Punto },
    { centro: [2.4, -257.6] as Punto, radio: [8.4, 3.5] as Punto },
  ],
  /**
   * Los hombros, levantados hasta las orejas (está encogido); los codos, afuera de las rodillas; las
   * manos, abrazadas a las canillas: la de adelante agarra el otro brazo. Las rodillas quedan arriba de
   * los brazos, debajo del mentón: es lo que dice que está sentado.
   */
  hombros: [[-44, -195], [42, -194]] as readonly [Punto, Punto],
  codos: [[-55, -142], [53, -140]] as readonly [Punto, Punto],
  manos: [[10, -126], [-10, -118]] as readonly [Punto, Punto],
  /** Las rodillas, contra el pecho, debajo del mentón. */
  rodillas: [[-21, -188], [19, -187]] as readonly [Punto, Punto],
  /** El grillete en el tobillo de la izquierda, y de dónde cuelga la cadena. */
  grillete: [-34, -44] as Punto,
} as const;

/** Del títere al recinto, y al revés. */
export const alRecinto = ([x, y]: Punto): [number, number] => [ESCLAVO.x + x * ESCLAVO.escala, ESCLAVO.asiento + y * ESCLAVO.escala];
export const alTitere = ([x, y]: Punto): [number, number] => [(x - ESCLAVO.x) / ESCLAVO.escala, (y - ESCLAVO.asiento) / ESCLAVO.escala];

/**
 * El barrote del que se agarra cuando chilla: el que tiene a la izquierda, del lado de la ventana. La
 * mano lo agarra arriba, por encima de la cabeza, así el puño no le tapa la cara.
 */
export const BARROTE: Punto = alTitere([BARROTES[BARROTES.length - 1]!, travesanio(BARROTES[BARROTES.length - 1]!, CELDA.alto) + 9]);

/** Dónde dice su verso: arriba de la celda, que el bocadillo no le tape la cara. */
export const VERSO: Punto = [ESCLAVO.x, HUECO[3]![1] - 4];

/* ------------------------------------------------------------------
   La pose: lo que hace con la cara y con el brazo de adelante
   ------------------------------------------------------------------ */

/**
 * Un gesto. `mira` va de -1 a 1 en cada eje (adónde van las pupilas), `parpados` de 0 (abiertos) a 1
 * (cerrados), `cabeza` es el giro en grados (negativo, hacia la ventana), `alza` cuánto sube la cabeza,
 * `quijada` cuánto abre la boca, `brazo` cuánto fue la mano de adelante de las rodillas al barrote,
 * `hombros` cuánto los sube (negativo es arriba), `lagrima` de 0 (no hay) a 1 (bajó por la mejilla),
 * `rojo` cuánto se le enrojecen los ojos y `cadena` cuánto se mece la cadena, en grados.
 */
export interface Gesto {
  mira: Punto;
  parpados: readonly [number, number];
  cabeza: number;
  alza: number;
  quijada: number;
  brazo: number;
  hombros: number;
  lagrima: number;
  rojo: number;
  cadena: number;
}

/**
 * Los gestos fijos:
 * - `calle`: la pose quieta, la del HTML. Mira la calle por la reja de la ventana, con los párpados
 *   pesados y una lágrima parada en el borde del ojo, que no cae: *ahora ya casi no llora*.
 * - `chillido`: tocado. Se agarra del barrote, echa la cabeza para atrás y chilla con los ojos
 *   apretados, al rojo vivo.
 * - `rodillas`: esconde la cara en las rodillas.
 * - `vos`: te mira.
 */
export const GESTOS: Readonly<Record<'calle' | 'chillido' | 'rodillas' | 'vos', Gesto>> = {
  calle: { mira: [-0.9, -0.25], parpados: [0.3, 0.32], cabeza: -5, alza: 0, quijada: 0, brazo: 0, hombros: 0, lagrima: 0.5, rojo: 0.45, cadena: 0 },
  chillido: { mira: [0, -1], parpados: [1, 1], cabeza: 7, alza: 7, quijada: 1, brazo: 1, hombros: -5, lagrima: 0, rojo: 1, cadena: 0 },
  rodillas: { mira: [-0.3, 1], parpados: [0.7, 0.72], cabeza: 6, alza: -17, quijada: 0, brazo: 0, hombros: 2, lagrima: 0, rojo: 0.6, cadena: 0 },
  vos: { mira: [0.15, 0.25], parpados: [0.32, 0.34], cabeza: 2, alza: 0, quijada: 0, brazo: 0, hombros: 0, lagrima: 0.5, rojo: 0.45, cadena: 0 },
};

/** Cuánto se corre una pupila adentro del blanco del ojo, en el títere. */
export const MIRA = [2.9, 1.05] as const;

/** De dónde baja cada párpado: el borde de arriba del ojo. */
export const PIVOTES_PARPADO: readonly Punto[] = ESCLAVO_ARMADO.ojos.map(({ centro: [cx, cy], radio: [, ry] }) => [cx, Math.round((cy - ry - 0.6) * 10) / 10] as const);

/**
 * La lágrima: dónde asoma (en el borde de abajo del ojo de este lado, el de la mejilla en sombra, donde
 * una gota blanca se ve) y cuánto baja por la mejilla.
 */
export const LAGRIMA = { asoma: [-1.5, -254.4] as Punto, baja: 10 } as const;

/**
 * Un brazo de dos tramos que lleva la mano a un punto. Devuelve cuánto gira el tramo de arriba en el
 * hombro y cuánto gira el de abajo adentro del de arriba (así están anidados en la página), con el codo
 * del lado de `dobla`.
 */
export function alcanzar(hombro: Punto, codo: Punto, mano: Punto, meta: Punto, dobla: Punto): { arriba: number; abajo: number; codo: Punto; punta: Punto } {
  const [sx, sy] = hombro;
  const l1 = Math.hypot(codo[0] - sx, codo[1] - sy);
  const l2 = Math.hypot(mano[0] - codo[0], mano[1] - codo[1]);
  const lejos = Math.hypot(meta[0] - sx, meta[1] - sy);
  const d = Math.min(l1 + l2 - 0.5, Math.max(Math.abs(l1 - l2) + 0.5, lejos));
  const phi = Math.atan2(meta[1] - sy, meta[0] - sx);
  const alfa = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const codos = [phi + alfa, phi - alfa].map((a) => [sx + Math.cos(a) * l1, sy + Math.sin(a) * l1] as const);
  const [mx, my] = [sx + Math.cos(phi) * d * 0.5, sy + Math.sin(phi) * d * 0.5];
  const cuanto = ([x, y]: Punto): number => (x - mx) * dobla[0] + (y - my) * dobla[1];
  const nuevo = cuanto(codos[0]!) >= cuanto(codos[1]!) ? codos[0]! : codos[1]!;
  const grados = (x: number, y: number): number => (Math.atan2(y, x) * 180) / Math.PI;
  const vuelta = (a: number): number => ((((a + 180) % 360) + 360) % 360) - 180;
  const arriba = vuelta(grados(nuevo[0] - sx, nuevo[1] - sy) - grados(codo[0] - sx, codo[1] - sy));
  const abajo = vuelta(grados(meta[0] - nuevo[0], meta[1] - nuevo[1]) - grados(mano[0] - codo[0], mano[1] - codo[1]) - arriba);
  const hasta = Math.hypot(meta[0] - nuevo[0], meta[1] - nuevo[1]) || 1;
  const punta: Punto = [nuevo[0] + ((meta[0] - nuevo[0]) / hasta) * l2, nuevo[1] + ((meta[1] - nuevo[1]) / hasta) * l2];
  return { arriba, abajo, codo: nuevo, punta };
}

const suave = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/**
 * Adónde va la mano de adelante, en las coordenadas del brazo (que sube y baja con los hombros): de las
 * rodillas al barrote. Va por afuera de la rodilla, no a través del pecho. El barrote no se mueve: si
 * los hombros subieron, la mano lo busca igual donde está.
 */
export function manoDeAdelante(k: number, hombros = 0): Punto {
  const [hx, hy] = ESCLAVO_ARMADO.manos[0];
  const [bx, by] = BARROTE;
  const s = suave(k);
  // Primero sale para afuera, por el costado de la rodilla, y recién después sube: así el antebrazo no
  // le cruza la cara.
  const arco = Math.sin(Math.PI * s) * 30;
  const sube = s ** 1.8;
  return [hx + (bx - hx) * s - arco, hy + (by - hy) * sube - hombros * s];
}

/* ------------------------------------------------------------------
   Lo que hace en el tiempo: el chillido y el sollozo que se le corta
   ------------------------------------------------------------------ */

const mezcla = (a: number, b: number, k: number): number => a + (b - a) * k;
/** Un tramo de una línea de tiempo: 0 antes de `desde`, 1 después de `hasta`, suave en el medio. */
const entre = (u: number, desde: number, hasta: number): number => suave((u - desde) / (hasta - desde));

/** Cuánto dura cada cosa, en segundos. */
export const DURA = { chillido: 2.9, sollozo: 2.6 } as const;

/**
 * El chillido, el verso hecho gesto (*"Fue un esclavo sensible y chillón"*), a `u` segundos de que lo
 * tocaron: se agarra del barrote, echa la cabeza para atrás y chilla con los ojos apretados, al rojo
 * vivo; tiembla. Y se le corta: la boca se cierra de golpe, abre los ojos (se escuchó), te mira, traga
 * con la cabeza gacha, suelta el barrote y vuelve a abrazarse las rodillas. La lágrima vuelve a asomar
 * en el ojo y no cae: *ahora ya casi no llora*.
 */
export function chillidoEn(u: number, base: Gesto): Gesto {
  if (u <= 0 || u >= DURA.chillido) return base;
  // El arranque: el barrote y la cabeza, en un cuarto de segundo.
  const sube = entre(u, 0, 0.28);
  // El corte: a los 1,32 s la boca se cierra en un décimo de segundo.
  const corta = entre(u, 1.32, 1.44);
  const suelta = entre(u, 1.55, 2.25);
  const vuelve = entre(u, 1.6, 2.7);
  const temblor = Math.sin(u * 31) * (u < 1.32 ? 1 : 0);
  const abre = entre(u, 0.12, 0.32) * (1 - corta);
  // Después del corte, traga: un temblor chico del mentón.
  const traga = u > 1.7 && u < 2.05 ? Math.sin((u - 1.7) * 18) * 0.05 : 0;
  const apretados = sube * (1 - corta);
  // Se escuchó: abre los ojos grandes y te mira, un momento.
  const sorpresa = corta * (1 - entre(u, 1.75, 2.2));
  const ojos = (b: number): number => Math.max(0, mezcla(mezcla(b, 1, apretados), 0.08, sorpresa));
  const mira: Punto = sorpresa > 0.01 ? [mezcla(base.mira[0], GESTOS.vos.mira[0], sorpresa), mezcla(base.mira[1], GESTOS.vos.mira[1], sorpresa)] : base.mira;
  return {
    mira,
    parpados: [ojos(base.parpados[0]), ojos(base.parpados[1])],
    cabeza: mezcla(base.cabeza, GESTOS.chillido.cabeza + temblor * 1.2, sube * (1 - vuelve)),
    // Sube con el chillido; al cortarse baja la cabeza, gacha, y después vuelve.
    alza: base.alza + GESTOS.chillido.alza * sube * (1 - corta) - 4 * corta * (1 - vuelve),
    quijada: Math.max(0, abre * (0.88 + 0.12 * temblor) + traga),
    brazo: sube * (1 - suelta),
    hombros: base.hombros + GESTOS.chillido.hombros * sube * (1 - corta) + temblor * 0.8 * sube * (1 - corta),
    // La lágrima se va con los ojos apretados, y vuelve a asomar cuando traga.
    lagrima: base.lagrima * (1 - sube * (1 - entre(u, 1.9, 2.6))),
    rojo: mezcla(base.rojo, 1, Math.min(1, sube * 1.4) * (1 - entre(u, 2.2, 2.9) * 0.5)),
    cadena: base.cadena,
  };
}

/**
 * El sollozo que se le corta (*"ahora ya no llora / casi ya no llora"*): tres hipos que le suben los
 * hombros, los párpados que bajan, el mentón que tiembla, los ojos al rojo vivo. La lágrima crece y baja
 * un poco por la mejilla, y se queda ahí: no cae. Después levanta la cabeza y vuelve a mirar la calle.
 */
export function sollozoEn(u: number, base: Gesto): Gesto {
  if (u <= 0 || u >= DURA.sollozo) return base;
  const hipo = (desde: number): number => (u > desde && u < desde + 0.32 ? Math.sin((Math.PI * (u - desde)) / 0.32) : 0);
  const hipos = hipo(0.25) + hipo(0.8) * 0.85 + hipo(1.3) * 0.6;
  const llora = entre(u, 0.05, 0.4) * (1 - entre(u, 1.7, 2.4));
  const temblor = Math.sin(u * 23) * 0.06 * llora;
  return {
    ...base,
    parpados: [mezcla(base.parpados[0], 0.72, llora), mezcla(base.parpados[1], 0.74, llora)],
    cabeza: base.cabeza + 3.5 * llora,
    alza: base.alza - 3 * llora - hipos * 0.6,
    quijada: Math.max(0, base.quijada + temblor + 0.04 * llora),
    hombros: base.hombros - 2.6 * hipos,
    // Crece y baja hasta tres cuartos, y ahí se queda: el que sigue la lleva de vuelta de a poco.
    lagrima: mezcla(base.lagrima, Math.max(base.lagrima, 0.75), entre(u, 0.3, 1.6)),
    rojo: mezcla(base.rojo, 1, llora),
  };
}

const n2 = (v: number): string => v.toFixed(2);

/**
 * Las transformaciones de cada parte de la página para un gesto: las escribe el dibujo en el HTML (la
 * pose quieta) y la isla en cada cuadro, con la misma cuenta. `rojo` es una opacidad.
 */
export function transformes(g: Gesto | keyof typeof GESTOS): Record<string, string> {
  const gesto = typeof g === 'string' ? GESTOS[g] : g;
  const A = ESCLAVO_ARMADO;
  const [nx, ny] = A.cuello;
  // El brazo de adelante: el hombro sube con los otros, y la mano busca el barrote. La meta se pide en
  // las coordenadas de la pieza, que ya viene corrida con los hombros.
  const meta = manoDeAdelante(gesto.brazo, gesto.hombros);
  const r = alcanzar(A.hombros[0], A.codos[0], A.manos[0], meta, [-1, 0.25]);
  const t: Record<string, string> = {
    entero: `translate(${n2(ESCLAVO.x)} ${n2(ESCLAVO.asiento)}) scale(${ESCLAVO.escala})`,
    torso: `translate(0 ${n2(gesto.hombros)})`,
    brazos: `translate(0 ${n2(gesto.hombros)})`,
    cabeza: `translate(0 ${n2(-gesto.alza)}) rotate(${n2(gesto.cabeza)} ${nx} ${ny})`,
    quijada: `translate(0 ${n2(gesto.quijada * A.abre)})`,
    'brazo-1': `rotate(${n2(r.arriba)} ${A.hombros[0][0]} ${A.hombros[0][1]})`,
    'antebrazo-1': `rotate(${n2(r.abajo)} ${A.codos[0][0]} ${A.codos[0][1]})`,
    cadena: `rotate(${n2(gesto.cadena)} ${A.grillete[0]} ${A.grillete[1]})`,
    rojo: n2(0.25 + 0.75 * gesto.rojo),
  };
  // La lágrima: asoma en el borde del ojo (a 0,5 está parada ahí) y, si sigue, baja un poco y se achica.
  const [lx, ly] = LAGRIMA.asoma;
  const crece = Math.min(1, gesto.lagrima * 2);
  const baja = Math.max(0, gesto.lagrima - 0.5) * 2;
  const tam = crece * (1 - baja * 0.45);
  t.lagrima = `translate(0 ${n2(baja * LAGRIMA.baja)}) translate(${lx} ${ly}) scale(${tam.toFixed(3)}) translate(${-lx} ${-ly})`;
  for (const n of [1, 2] as const) {
    t[`pupila-${n}`] = `translate(${n2(gesto.mira[0] * MIRA[0])} ${n2(gesto.mira[1] * MIRA[1])})`;
    const [px, py] = PIVOTES_PARPADO[n - 1]!;
    t[`parpado-${n}`] = `translate(${px} ${py}) scale(1 ${n2(gesto.parpados[n - 1]!)}) translate(${-px} ${-py})`;
  }
  return t;
}
