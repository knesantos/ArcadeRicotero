/**
 * Los números de las antiguas lobas (`D-73`, vigesimotercera vuelta): dónde están echadas en el monte,
 * cómo está armada cada una y cómo se ponen. Los lee el dibujo (`arte-lobas.ts`), para la pose quieta del
 * HTML y para el retrato, y la conducta (`scripts/bestiario/lobas.ts`), que se lleva esto y nada que dibuje.
 *
 * Tres sistemas de coordenadas:
 * - **El de cada loba**: el (0, 0) es el piso debajo del medio de la panza **parada**; arriba es negativo y
 *   la cabeza mira a la derecha. Echada, el cuerpo baja `CAIDA` y las patas se doblan para adelante.
 *   Está dibujada a dos veces y media, y la escena la achica con `LOBAS.escala`.
 * - **El de las dos**: el (0, 0) es `LOBAS` en el recinto; cada loba tiene su lugar (`ECHADAS`), en
 *   unidades del recinto. La 1 está atrás y mira a la derecha; la 2 adelante, más abajo, y mira a la
 *   izquierda: echadas cabeza con cola, como dos perras viejas que duermen juntas.
 * - **El del recinto** (900 × 640): al pie de las tiras de la izquierda del monte, a la derecha de la tira
 *   de adelante (que tapa hasta x 86) y a la izquierda de donde asoma el lobo suelto (`ACECHO.desde`).
 *   En el camino el monte es un tramo largo y el marco las corre enteras adonde estaban sus ojos.
 */

export type Punto = readonly [number, number];

/** Dónde están, y lo que miden. */
export const LOBAS = { x: 152, piso: 312, escala: 0.42 } as const;

/** Dónde está echada cada una, en unidades del recinto desde `LOBAS`, y para dónde mira (1 derecha). */
export const ECHADAS = [
  { x: -16, y: -10, mira: 1 },
  { x: 16, y: 6, mira: -1 },
] as const;

/** Lo que baja el cuerpo echada, en unidades de la loba. */
export const CAIDA = 52;

/** Cómo está armada cada loba, en sus coordenadas. */
export const LOBA_ARMADO = {
  /** El medio del lomo: de acá se sacude. */
  lomo: [-6, -76] as Punto,
  /** Los hombros y las caderas: el de cerca y el de lejos, de donde giran las patas. */
  hombro: [36, -66] as Punto,
  hombroLejos: [28, -68] as Punto,
  cadera: [-44, -68] as Punto,
  caderaLejos: [-36, -70] as Punto,
  /** El cogote: de acá gira la cabeza. */
  cuello: [50, -84] as Punto,
  /** De dónde sale la cola. */
  cola: [-66, -84] as Punto,
  /** De dónde gira la quijada, y la punta del hocico. */
  quijada: [80, -93] as Punto,
  hocico: [124, -97] as Punto,
  /** El ojo de cerca (el único que se ve de perfil), y la oreja que se mueve. */
  ojo: [92, -108] as Punto,
  oreja: [72, -117] as Punto,
} as const;

/** Lo que se doblan las patas y la cabeza echada, en grados: las de adelante estiradas, la cola en el piso. */
export const DOBLADA = { delantera: -80, trasera: -74, cola: 40, cabeza: 22 } as const;

/** Cuánto se abre la quijada a pleno, en grados. */
export const ABRE = 32;

/* ------------------------------------------------------------------
   El momento
   ------------------------------------------------------------------ */

export interface Loba {
  /** Cuánto se corrió de donde está echada, en unidades del recinto, y para dónde mira (-1 a 1). */
  x: number;
  y: number;
  mira: number;
  /** 0 echada, 1 parada. */
  alza: number;
  /** El sacudón del cuerpo entero, en grados alrededor del lomo, y el aire del pecho. */
  sacude: number;
  respira: number;
  /** Cuánto gira la cabeza en el cogote (negativo es para arriba) y cuánto abre la quijada (0 a 1). */
  cabeza: number;
  quijada: number;
  /** El párpado: 1 cerrado, 0 abierto. La oreja, en grados (negativo es para atrás y arriba). */
  parpado: number;
  oreja: number;
  /** Lo que gira cada pata además de la pose: adelante cerca, adelante lejos, atrás cerca, atrás lejos. */
  patas: readonly [number, number, number, number];
  cola: number;
  /** La lengua afuera (0 a 1). */
  lengua: number;
  /** La pulpa que revive: cuánto se le ve el pelo de loba joven (0 a 1). */
  joven: number;
  /** El polvo de años que se sacude, el crujido de los huesos y el vaho del aullido (0 a 1, por fase). */
  polvo: number;
  cruje: number;
  vaho: number;
}

export interface Momento {
  lobas: readonly [Loba, Loba];
}

const echada = (mira: number): Loba => ({
  x: 0, y: 0, mira, alza: 0, sacude: 0, respira: 0, cabeza: 0, quijada: 0, parpado: 1, oreja: 0,
  patas: [0, 0, 0, 0], cola: 0, lengua: 0, joven: 0, polvo: 0, cruje: 0, vaho: 0,
});

/** La pose quieta, la del HTML: echadas como muertas, con los ojos cerrados. */
export const QUIETO: Momento = { lobas: [echada(ECHADAS[0].mira), echada(ECHADAS[1].mira)] };

/**
 * *"Y antiguas lobas pulpas que reviven"*: paradas, con el hocico al cielo, aullando a dúo un aullido que
 * no se oye (*"tu aullido esta vez, quiera Dios, no se va a oír"*): se les ve el vaho y nada más. Es el
 * toque quieto y el retrato.
 */
const aulla = (mira: number, cabeza: number): Loba => ({ ...echada(mira), alza: 1, cabeza, quijada: 0.85, oreja: -14, cola: -8, vaho: 0.45 });
export const AULLAN: Momento = { lobas: [aulla(ECHADAS[0].mira, -56), aulla(ECHADAS[1].mira, -50)] };

/**
 * La vuelta trotando, de jóvenes: una elipse chata alrededor de donde están echadas. La de atrás va por
 * una más alta que la de adelante, así nunca se cruzan mal. Empiezan y terminan donde estaban.
 */
export const VUELTA = { x: 0, rx: 40, ry: 3.6, trancos: 6 } as const;

/** El ángulo de la vuelta donde arranca cada una: el que cae justo donde está echada, yendo para donde mira. */
export const ARRANQUE: readonly [number, number] = (() => {
  const a = Math.acos(ECHADAS[0].x / VUELTA.rx);
  // La 1 va para la derecha (seno negativo); la 2, del otro lado, para la izquierda.
  return [-a, Math.PI - a] as const;
})();

/** Dónde está cada loba en la vuelta, desde donde está echada, y para dónde mira. */
export function enLaVuelta(n: 0 | 1, ang: number): { x: number; y: number; mira: number } {
  const t = ARRANQUE[n] + ang;
  const [x0, y0] = [ECHADAS[n].x, ECHADAS[n].y];
  const cy = y0 - VUELTA.ry * Math.sin(ARRANQUE[n]);
  return {
    x: VUELTA.x + VUELTA.rx * Math.cos(t) - x0,
    y: cy + VUELTA.ry * Math.sin(t) - y0,
    mira: Math.max(-1, Math.min(1, -Math.sin(t) * 4)),
  };
}

/* ------------------------------------------------------------------
   Las cuentas
   ------------------------------------------------------------------ */

/** Un punto de la loba `n` (parada, sin correrse), llevado al recinto. */
export const alRecinto = (n: 0 | 1, [x, y]: Punto): Punto => [
  LOBAS.x + ECHADAS[n].x + x * LOBAS.escala * ECHADAS[n].mira,
  LOBAS.piso + ECHADAS[n].y + y * LOBAS.escala,
];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const giro = (g: number, [x, y]: Punto): string => `rotate(${n2(g)} ${x} ${y})`;
/** Lo que se ve de una fase (0 a 1): sube y baja. */
export const fase = (k: number): number => (k > 0 && k < 1 ? Math.sin(Math.PI * k) : 0);

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el HTML
 * (la pose quieta) y la isla en cada cuadro, con la misma cuenta.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const A = LOBA_ARMADO;
  const transform: Record<string, string> = { entero: `translate(${LOBAS.x} ${LOBAS.piso})` };
  const opacity: Record<string, string> = {};
  m.lobas.forEach((l, i) => {
    const n = i + 1;
    const e = ECHADAS[i]!;
    const echa = 1 - l.alza;
    transform[`loba-${n}`] = `translate(${n2(e.x + l.x)} ${n2(e.y + l.y)}) scale(${n2(LOBAS.escala * l.mira)} ${LOBAS.escala})`;
    transform[`alza-${n}`] = `translate(0 ${n2(CAIDA * echa)}) ${giro(l.sacude, A.lomo)}`;
    transform[`torso-${n}`] = `translate(0 -50) scale(1 ${(1 + l.respira).toFixed(4)}) translate(0 50)`;
    transform[`cola-${n}`] = giro(l.cola + DOBLADA.cola * echa, A.cola);
    transform[`pata-dc-${n}`] = giro(DOBLADA.delantera * echa + l.patas[0], A.hombro);
    transform[`pata-dl-${n}`] = giro(DOBLADA.delantera * echa + l.patas[1], A.hombroLejos);
    transform[`pata-tc-${n}`] = giro(DOBLADA.trasera * echa + l.patas[2], A.cadera);
    transform[`pata-tl-${n}`] = giro(DOBLADA.trasera * echa + l.patas[3], A.caderaLejos);
    // La cabeza sube un poco con el aire del pecho.
    transform[`cabeza-${n}`] = `translate(0 ${n2(-l.respira * 30)}) ${giro(l.cabeza + DOBLADA.cabeza * echa, A.cuello)}`;
    transform[`quijada-${n}`] = giro(ABRE * l.quijada, A.quijada);
    transform[`oreja-${n}`] = giro(l.oreja, A.oreja);
    transform[`polvo-${n}`] = `translate(0 -64) scale(${n2(0.6 + 0.7 * l.polvo)}) translate(0 64)`;
    transform[`vaho-${n}`] = `translate(${n2(30 * l.vaho)} ${n2(-8 * l.vaho)})`;
    opacity[`parpado-${n}`] = n2(l.parpado);
    opacity[`lengua-${n}`] = n2(l.lengua);
    opacity[`joven-${n}`] = n2(l.joven);
    opacity[`polvo-${n}`] = n2(fase(l.polvo));
    opacity[`cruje-${n}`] = n2(l.cruje);
    opacity[`vaho-${n}`] = n2(fase(l.vaho));
    opacity[`boca-${n}`] = l.quijada > 0.02 ? '1' : '0';
  });
  return { transform, opacity };
}

/** Dónde dicen su verso: arriba de las dos, en el recinto. */
export const VERSO: Punto = [LOBAS.x, LOBAS.piso - 70];
