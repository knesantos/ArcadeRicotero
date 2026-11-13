/**
 * El aire del camino (`D-90`): lo que hay entre la cámara y las cosas.
 *
 * Pedido del usuario: *"quiero mejorar la inmersión [...] que tenga más misterio y efectos,
 * nieblas"*. Hasta acá cada camino eran tres capas duras (lo lejano, el piso, lo de adelante) y
 * entre una y otra no había nada: se veía todo de una. El aire son capas sopladas que van en el
 * medio: la bruma que sale de atrás del borde del piso, la niebla que anda a ras del suelo, y lo
 * que queda pegado a la cámara, fuera de foco, tapando el borde de abajo de la pantalla (que en un
 * teléfono parado era medio metro de piso vacío).
 *
 * Esto son números, como `camino.ts` y `rig.ts`: los lee la página para poner cada capa y la isla
 * para moverla. El dibujo está en `arte-aire.ts` y **se imprime** (`scripts/imprimir-bestiario.mjs`):
 * el soplo y el grano se calculan una vez, y el teléfono solo corre la imagen y le cambia el alfa.
 * Ni un filtro en vivo, ni un degradé de CSS.
 *
 * ## Cómo es una capa de aire
 *
 * Una baldosa que se repite de costado (y para arriba, la que cae o sube), más ancha que cualquier
 * pantalla, que la isla corre con `transform`:
 *
 * - `f` es su velocidad de paralaje, como la de las capas del camino: lo que está atrás del piso
 *   va más despacio que él, lo que está pegado a la cámara pasa volando.
 * - `deriva` y `cae` son el viento: lo que se corre sola, en unidades de escena por segundo.
 * - `alfa` es lo espesa que está quieta; `late` y `ritmo`, lo que respira; `abre`, cuánto se
 *   deshace mientras se camina. La niebla del monte se abre al paso y se vuelve a cerrar cuando
 *   te quedás quieto: quedarse quieto tiene premio.
 *
 * Con movimiento reducido no se corre ni respira: queda impresa en su lugar, con su alfa.
 */

import { ALTO } from './camino.ts';

/** Dónde va una capa de aire entre las del camino. */
export type Plano =
  /** Entre lo lejano y el piso: sale de atrás del borde del piso. */
  | 'fondo'
  /** Encima del piso y de los bichos, debajo de lo de adelante. */
  | 'medio'
  /** Encima de todo: lo que está pegado a la cámara. */
  | 'cerca';

export interface CapaDeAire {
  /** La pieza impresa (`arte-aire.ts`). */
  pieza: string;
  plano: Plano;
  /** La velocidad de paralaje. */
  f: number;
  /** Dónde arranca y cuánto mide de alto, en unidades de escena. */
  y: number;
  alto: number;
  /** Lo ancho de la baldosa, en unidades de escena: se repite de costado. */
  ancho: number;
  /** El viento, en unidades por segundo: de costado (negativo, hacia la izquierda) y para abajo. */
  deriva: number;
  /** Solo en las capas de pantalla entera (`y` 0, `alto` `ALTO`): la baldosa se repite también para arriba. */
  cae: number;
  /** El alfa quieta, lo que late (se suma y se resta) y a qué ritmo, en radianes por segundo. */
  alfa: number;
  late: number;
  ritmo: number;
  /** Cuánto se deshace caminando, de 0 (nada) a 1 (del todo). */
  abre: number;
}

const capa = (c: Partial<CapaDeAire> & Pick<CapaDeAire, 'pieza' | 'plano' | 'f' | 'y' | 'alto' | 'ancho'>): CapaDeAire => ({
  deriva: 0,
  cae: 0,
  alfa: 1,
  late: 0,
  ritmo: 0.5,
  abre: 0,
  ...c,
});

/**
 * La bruma de atrás, la niebla rasante y lo pegado a la cámara del monte. La pastura es un claro
 * del mismo monte (`camino.ts`): respira el mismo aire.
 */
const DEL_MONTE: readonly CapaDeAire[] = [
  capa({ pieza: 'aire-monte-bruma', plano: 'fondo', f: 0.72, y: 110, alto: 320, ancho: 1200, deriva: 5, alfa: 0.7, late: 0.12, ritmo: 0.23 }),
  capa({ pieza: 'aire-monte-rasante', plano: 'medio', f: 1.12, y: 300, alto: 340, ancho: 1400, deriva: -9, alfa: 0.82, late: 0.1, ritmo: 0.31, abre: 0.6 }),
  capa({ pieza: 'aire-monte-cerca', plano: 'cerca', f: 1.75, y: 380, alto: 260, ancho: 1600 }),
];

/**
 * El aire de cada región. La que no está, todavía no tiene: el sistema es el mismo para todas, y
 * sumar una es escribir su receta acá y pintar sus baldosas en `arte-aire.ts`.
 */
export const AIRE: Readonly<Record<string, readonly CapaDeAire[]>> = {
  'el-monte': DEL_MONTE,
  'la-pastura': DEL_MONTE,
  // Cybersiberia: el vaho helado contra la chapa, la ventisca que cruza el piso y los médanos de nieve pegados a la cámara.
  cybersiberia: [
    capa({ pieza: 'aire-cyber-vaho', plano: 'fondo', f: 0.8, y: 110, alto: 320, ancho: 1200, deriva: -12, alfa: 0.75, late: 0.15, ritmo: 0.19 }),
    capa({ pieza: 'aire-cyber-ventisca', plano: 'medio', f: 1.2, y: 250, alto: 390, ancho: 1300, deriva: -130, alfa: 0.6, late: 0.32, ritmo: 0.47, abre: 0.25 }),
    capa({ pieza: 'aire-cyber-cerca', plano: 'cerca', f: 1.75, y: 420, alto: 220, ancho: 1600 }),
  ],
  // Los astilleros: la bruma del río detrás del muelle, el vaho que sube del agua y los fierros del muelle fuera de foco.
  'los-astilleros': [
    capa({ pieza: 'aire-astillero-bruma', plano: 'fondo', f: 0.7, y: 110, alto: 320, ancho: 1200, deriva: 7, alfa: 0.7, late: 0.1, ritmo: 0.21 }),
    capa({ pieza: 'aire-astillero-vaho', plano: 'medio', f: 1.1, y: 300, alto: 340, ancho: 1400, deriva: 11, alfa: 0.75, late: 0.14, ritmo: 0.29, abre: 0.45 }),
    capa({ pieza: 'aire-astillero-cerca', plano: 'cerca', f: 1.75, y: 420, alto: 220, ancho: 1600 }),
  ],
  // El infierno: el humo que se arrastra por el damero y la ceniza encendida que sube. Es un recinto (una sola capa), y el aire le da el fondo que no tenía.
  'el-infierno': [
    capa({ pieza: 'aire-infierno-humo', plano: 'medio', f: 1.15, y: 250, alto: 390, ancho: 1300, deriva: 8, alfa: 0.8, late: 0.14, ritmo: 0.27, abre: 0.4 }),
    capa({ pieza: 'aire-infierno-ceniza', plano: 'cerca', f: 1.5, y: 0, alto: ALTO, ancho: 800, deriva: 9, cae: -34, alfa: 0.9, late: 0.1, ritmo: 0.9 }),
  ],
};

/** Las capas de aire de una región, de atrás para adelante adentro de cada plano; vacío si no tiene. */
export const aireDe = (region: string, plano: Plano): readonly CapaDeAire[] => (AIRE[region] ?? []).filter((c) => c.plano === plano);

/** Lo que una capa repite para arriba, en unidades; cero, la que no cae ni sube. */
export const altoDeBaldosa = (c: CapaDeAire): number => (c.cae !== 0 ? c.alto : 0);

/** El resto que siempre da entre 0 y `m`, también con números negativos. */
export const resto = (v: number, m: number): number => ((v % m) + m) % m;

/**
 * Cuánto se corre una capa de aire, en unidades de escena: de costado, entre `-ancho` y 0, y para
 * abajo, entre 0 y el alto de su baldosa. `cam` es lo caminado y `t` el reloj. `suelta`: la capa
 * está en la vista quieta y hay que correrla entera (`f · cam`); si no, viaja con la tira, que ya
 * se corrió `cam`, y solo le falta la diferencia.
 */
export function corridaDeAire(c: CapaDeAire, cam: number, t: number, suelta: boolean): { x: number; y: number } {
  const paralaje = (suelta ? c.f : c.f - 1) * cam;
  const alto = altoDeBaldosa(c);
  const x = -resto(paralaje - c.deriva * t, c.ancho);
  return { x: x === 0 ? 0 : x, y: alto ? resto(c.cae * t, alto) : 0 };
}

/**
 * El alfa de una capa en el momento `t`. `anda`, de 0 (quieto) a 1 (caminando a paso pleno), la
 * deshace lo que diga `abre`. Nunca menos que cero ni más que uno.
 */
export function alfaDeAire(c: CapaDeAire, t: number, anda: number): number {
  const a = (c.alfa + Math.sin(t * c.ritmo + c.ancho) * c.late) * (1 - c.abre * Math.min(1, Math.max(0, anda)));
  return Math.min(1, Math.max(0, a));
}

/**
 * Cuánto queda de una capa con la lupa en `z` (`lupa.ts`), de 0 a 1. Acercarse es meterse adentro
 * del aire: las matas pegadas a la cámara quedan atrás (si no, la lupa las agranda y tapan justo lo
 * que se fue a mirar), y la niebla del medio afloja. Lo de atrás del piso y lo que cae quedan igual.
 */
export function despejeDeLupa(plano: Plano, cae: boolean, z: number): number {
  const k = Math.min(1, Math.max(0, z - 1));
  if (plano === 'cerca' && !cae) return Math.max(0, 1 - k * 1.6);
  if (plano === 'medio') return 1 - k * 0.45;
  return 1;
}

/** A qué paso la niebla ya está abierta del todo, en unidades de escena por segundo. */
export const PASO_PLENO = 380;
