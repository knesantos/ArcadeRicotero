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

/* ------------------------------------------------------------------
   La luz que se ve en el aire (segunda ronda)
   ------------------------------------------------------------------ */

/**
 * Una luz: una forma soplada **impresa** (un cono, un resplandor) clavada en un punto de una capa,
 * que la isla gira, agranda y le cambia el alfa. No es un `glow`, ni una sombra, ni un modo de
 * mezcla: es una mancha de aerógrafo con grano, como el resplandor de cualquier tapa, que se mueve.
 */
export interface Luz {
  pieza: string;
  /** La velocidad de la capa en la que está clavada: 1, el piso. */
  f: number;
  /** Dónde está clavada, en unidades de esa capa: la boca del farol, el centro de la brasa. */
  x: number;
  y: number;
  /** La caja de la pieza, medida desde ese punto: x, y, ancho, alto. */
  caja: readonly [number, number, number, number];
  /** El vaivén: cuántos grados para cada lado y a qué ritmo (radianes por segundo). */
  vaiven: number;
  ritmo: number;
  /** El alfa quieta y lo que cambia. */
  alfa: number;
  late: number;
  /** Cómo cambia: `titila` como un tubo viejo, `late` como un corazón (dos golpes y una pausa), `barre` parejo. */
  pulso: 'titila' | 'late' | 'barre';
  /** Cuánto crece con el pulso, en partes de su tamaño. */
  crece: number;
}

/**
 * Las luces de cada región, una por región como mucho: es una superficie más que el teléfono compone.
 * En los astilleros, el cono del farol de sodio del muelle, que se hamaca con el viento y barre la
 * bruma. En el infierno, la brasa al pie de Luzbelito, que late sobre el humo. En Cybersiberia, el
 * haz de la cámara que vigila la nieve desde la chapa.
 */
export const LUCES: Readonly<Record<string, readonly Luz[]>> = {
  // El farol está en `ASTILLERO.farol` (440 de 900, a lo largo ×2400/900), y su boca a 30 a la derecha del poste.
  'los-astilleros': [{ pieza: 'luz-astillero-cono', f: 1, x: 1203, y: 244, caja: [-170, -14, 340, 380], vaiven: 7, ritmo: 0.55, alfa: 0.62, late: 0.16, pulso: 'titila', crece: 0 }],
  'el-infierno': [{ pieza: 'luz-infierno-brasa', f: 1, x: 452, y: 486, caja: [-260, -110, 520, 220], vaiven: 0, ritmo: 3.9, alfa: 0.56, late: 0.36, pulso: 'late', crece: 0.07 }],
  cybersiberia: [{ pieza: 'luz-cyber-haz', f: 1, x: 1560, y: -6, caja: [-190, -14, 380, 600], vaiven: 15, ritmo: 0.33, alfa: 0.34, late: 0.05, pulso: 'barre', crece: 0 }],
};

/** El latido: dos golpes seguidos y una pausa, de 0 a 1. `u` es la fase, en vueltas. */
export function latido(u: number): number {
  const k = u - Math.floor(u);
  const golpe = (centro: number, ancho: number): number => Math.exp(-(((k - centro) / ancho) ** 2));
  return Math.min(1, golpe(0.12, 0.07) + 0.7 * golpe(0.36, 0.08));
}

/** Cómo está una luz en el momento `t`: cuánto giró, su alfa y su tamaño. */
export function estadoDeLuz(l: Luz, t: number): { giro: number; alfa: number; escala: number } {
  const giro = l.vaiven ? Math.sin(t * l.ritmo) * l.vaiven + Math.sin(t * l.ritmo * 2.7 + 1.3) * l.vaiven * 0.12 : 0;
  // De -1 a 1 (o de 0 a 1 el latido): lo que el pulso le suma al alfa.
  const pulso =
    l.pulso === 'late'
      ? latido((t * l.ritmo) / (Math.PI * 2)) * 2 - 0.6
      : l.pulso === 'titila'
        ? Math.sin(t * 7.3) * 0.35 + Math.sin(t * 13.1 + 2) * 0.25 + (Math.sin(t * 1.9) > 0.93 ? -1.4 : 0.2)
        : Math.sin(t * l.ritmo * 2);
  const alfa = Math.min(1, Math.max(0, l.alfa + pulso * l.late));
  return { giro, alfa, escala: 1 + (l.crece ? l.crece * Math.max(0, pulso) : 0) };
}

/* ------------------------------------------------------------------
   Lo que aparece si te quedás quieto (segunda ronda)
   ------------------------------------------------------------------ */

/**
 * Los ojos sin dueño. Si te quedás quieto unos segundos, en lo oscuro se abren unos ojos que no son
 * de ningún bicho de la libreta. Parpadean, y **se apagan si los mirás**: caminar, tocarles cerca,
 * pasarles el mouse o sacar la lupa los cierra. Vuelven más tarde, en otro lado.
 *
 * No se tocan ni abren ficha: no son un bicho, son el monte mirando. Con movimiento reducido no están.
 */
export interface Acecho {
  /** La pieza impresa: el par de ojos de la región. */
  pieza: string;
  /** Lo que mide la pieza, en unidades de escena. */
  ancho: number;
  alto: number;
  /**
   * Dónde pueden abrirse: `[de costado, de 0 a 1 de la vista; altura, en unidades de escena; tamaño]`.
   * Siempre en lo oscuro: entre las matas de abajo, o lejos, entre lo de atrás.
   */
  lugares: readonly (readonly [number, number, number])[];
  /** Cuánto hay que quedarse quieto para que se abran, en segundos: entre tanto y tanto. */
  espera: readonly [number, number];
  /** Cuánto se quedan mirando, si nadie los mira. */
  dura: readonly [number, number];
}

export const ACECHOS: Readonly<Record<string, Acecho>> = {
  'el-monte': { pieza: 'acecho-monte', ancho: 46, alto: 20, lugares: [[0.16, 596, 1], [0.8, 604, 1.15], [0.5, 612, 0.9], [0.3, 268, 0.5], [0.72, 252, 0.45]], espera: [5, 6.5], dura: [6, 9] },
  'la-pastura': { pieza: 'acecho-monte', ancho: 46, alto: 20, lugares: [[0.14, 600, 1], [0.84, 606, 1.1], [0.24, 262, 0.5], [0.66, 250, 0.45]], espera: [5, 6.5], dura: [6, 9] },
  cybersiberia: { pieza: 'acecho-cyber', ancho: 46, alto: 20, lugares: [[0.14, 598, 1], [0.82, 606, 1.1], [0.36, 168, 0.6], [0.7, 232, 0.6]], espera: [5, 6.5], dura: [5, 8] },
  'los-astilleros': { pieza: 'acecho-astillero', ancho: 46, alto: 30, lugares: [[0.2, 600, 1], [0.78, 606, 1.1], [0.62, 372, 0.55], [0.3, 380, 0.5]], espera: [5, 6.5], dura: [6, 9] },
  'el-infierno': { pieza: 'acecho-infierno', ancho: 46, alto: 20, lugares: [[0.18, 606, 1.1], [0.8, 610, 1.2], [0.5, 616, 0.9]], espera: [5, 6.5], dura: [5, 8] },
};

/** A cuántos píxeles de los ojos un dedo o un mouse ya los está mirando. */
export const MIRADA = 84;

/**
 * El párpado de los ojos sin dueño: 1 abierto, cerca de 0 cerrado. Parpadean cada tanto, corto, con
 * un compás que depende de dónde están (así dos regiones no parpadean igual).
 */
export function parpadeo(t: number, semilla: number): number {
  const ciclo = 3.1 + (semilla % 7) * 0.31;
  const k = (t + semilla) % ciclo;
  return k < 0.14 ? 0.12 + 0.88 * Math.abs(k - 0.07) / 0.07 : 1;
}

/** A qué paso la niebla ya está abierta del todo, en unidades de escena por segundo. */
export const PASO_PLENO = 380;
