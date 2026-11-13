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
  /** Lo que se hamaca de costado, en unidades, y a qué ritmo: la ropa tendida, los juncos. */
  mece: number;
  ritmoMece: number;
  /** La pieza ya la pinta y la imprime otro (`arte-entornos.ts`): acá solo se la mueve. */
  ajena?: boolean;
}

const capa = (c: Partial<CapaDeAire> & Pick<CapaDeAire, 'pieza' | 'plano' | 'f' | 'y' | 'alto' | 'ancho'>): CapaDeAire => ({
  deriva: 0,
  cae: 0,
  alfa: 1,
  late: 0,
  ritmo: 0.5,
  abre: 0,
  mece: 0,
  ritmoMece: 0.8,
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
    // La nevada (tercera ronda). Es la misma capa de copos del recinto (`cyber-nieve`), que en el camino
    // vivía adentro del dibujo del piso y bajaba con una animación de CSS: cada cuadro obligaba a
    // repintar el piso entero, y Cybersiberia andaba a 12 cuadros por segundo con la CPU estrangulada
    // ×4. Como capa de aire la mueve el compositor: 51. Cae lo mismo que antes, 640 unidades en 16 s.
    capa({ pieza: 'cyber-nieve', plano: 'medio', f: 1, y: 0, alto: ALTO, ancho: 900, cae: 40, alfa: 1, ajena: true }),
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
  // La ruta (tercera ronda): la bruma baja del horizonte, el polvo que levantan los fierros y los pastos de la banquina.
  'la-ruta': [
    capa({ pieza: 'aire-ruta-bruma', plano: 'fondo', f: 0.6, y: 110, alto: 320, ancho: 1200, deriva: 4, alfa: 0.7, late: 0.1, ritmo: 0.2 }),
    capa({ pieza: 'aire-ruta-polvo', plano: 'medio', f: 1.2, y: 250, alto: 390, ancho: 1300, deriva: 46, alfa: 0.55, late: 0.25, ritmo: 0.41, abre: 0.2 }),
    capa({ pieza: 'aire-ruta-cerca', plano: 'cerca', f: 1.75, y: 420, alto: 220, ancho: 1600, mece: 3, ritmoMece: 0.9 }),
  ],
  // Los tres recintos que siguen son de una sola capa y cada uno viste la mano de su disco: el aire
  // no es aerógrafo ahí. En el bajo es crayón (*Gulp!* y la contratapa de *Un baión*): vaho rayado
  // sobre el agua y juncos.
  'el-bajo': [
    capa({ pieza: 'aire-bajo-vaho', plano: 'medio', f: 1.1, y: 380, alto: 260, ancho: 1300, deriva: 7, alfa: 0.7, late: 0.16, ritmo: 0.3, abre: 0.4 }),
    capa({ pieza: 'aire-bajo-cerca', plano: 'cerca', f: 1.75, y: 440, alto: 200, ancho: 1600, mece: 4, ritmoMece: 0.7 }),
  ],
  // Los techos: el hollín que cae, a rayas de pastel como el cielo de *Un baión*, y la ropa tendida que se hamaca.
  'los-techos': [
    capa({ pieza: 'aire-techos-hollin', plano: 'medio', f: 1.3, y: 0, alto: ALTO, ancho: 800, deriva: -9, cae: 16, alfa: 0.75, late: 0.1, ritmo: 0.5 }),
    capa({ pieza: 'aire-techos-ropa', plano: 'cerca', f: 1.75, y: 430, alto: 210, ancho: 1600, mece: 7, ritmoMece: 1.1 }),
  ],
  // La prisión es madera tallada (*Oktubre*): el frío es un rayado de gubia a ras del piso, y lo
  // pegado a la cámara son los barrotes, de arriba abajo. Se mira desde otra celda.
  'la-prision': [
    capa({ pieza: 'aire-prision-frio', plano: 'medio', f: 1.1, y: 330, alto: 310, ancho: 1300, deriva: 5, alfa: 0.42, late: 0.14, ritmo: 0.26, abre: 0.45 }),
    capa({ pieza: 'aire-prision-rejas', plano: 'cerca', f: 1.75, y: 0, alto: ALTO, ancho: 1500 }),
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
  const hamaca = c.mece ? Math.sin(t * c.ritmoMece) * c.mece : 0;
  const x = -resto(paralaje - c.deriva * t - hamaca, c.ancho);
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
  /** Para dónde apunta, en grados: 0 para abajo (un farol), -90 para la derecha (un faro). */
  rumbo?: number;
  /** Si va colgada de un bicho que se mueve (el bondi): su `id`. Entonces `x` se mide desde él. */
  sigue?: string;
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
  // La ruta: los faros del último bondi, que van con él y alumbran el polvo. El bondi anda para la derecha.
  'la-ruta': [{ pieza: 'luz-ruta-faros', f: 1, x: 286, y: 446, caja: [-110, -14, 220, 300], vaiven: 1.6, ritmo: 6.5, alfa: 0.72, late: 0.06, pulso: 'barre', crece: 0, rumbo: -90, sigue: 'el-zumba' }],
  // El bajo: el reflejo del pucho de Pierre en el agua, una escalerita de rayas de crayón que tiembla. Pierre está en 486, y el recinto arranca en -250.
  'el-bajo': [{ pieza: 'luz-bajo-reflejo', f: 1, x: 806, y: 492, caja: [-70, -12, 140, 140], vaiven: 2.5, ritmo: 1.7, alfa: 0.62, late: 0.2, pulso: 'titila', crece: 0 }],
  // Los techos: el farol del baldío (650, 130 en su recinto), que titila.
  'los-techos': [{ pieza: 'luz-techos-farol', f: 1, x: 650, y: 140, caja: [-180, -14, 360, 420], vaiven: 2.5, ritmo: 0.7, alfa: 0.4, late: 0.16, pulso: 'titila', crece: 0 }],
  // La prisión: el reflector del muro, que barre. Es de gubia: canto duro y rayado, sin soplo.
  'la-prision': [{ pieza: 'luz-prision-reflector', f: 1, x: 760, y: -6, caja: [-220, -14, 440, 660], vaiven: 19, ritmo: 0.27, alfa: 0.32, late: 0.05, pulso: 'barre', crece: 0 }],
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
  // La ruta: algo en la banquina, o lejos, al borde del asfalto.
  'la-ruta': { pieza: 'acecho-monte', ancho: 46, alto: 20, lugares: [[0.16, 600, 1], [0.82, 606, 1.1], [0.3, 404, 0.5], [0.7, 396, 0.45]], espera: [5, 6.5], dura: [6, 9] },
  // El bajo: lo que mira desde el agua, con su reflejo.
  'el-bajo': { pieza: 'acecho-astillero', ancho: 46, alto: 30, lugares: [[0.2, 560, 0.9], [0.78, 590, 1.1], [0.5, 610, 1]], espera: [5, 6.5], dura: [6, 9] },
  // Los techos: los gatos, en lo negro de las medianeras.
  'los-techos': { pieza: 'acecho-monte', ancho: 46, alto: 20, lugares: [[0.2, 300, 0.6], [0.7, 330, 0.65], [0.45, 340, 0.55], [0.84, 612, 1]], espera: [5, 6.5], dura: [6, 9] },
  // La prisión: desde la celda de enfrente, en lo negro de arriba.
  'la-prision': { pieza: 'acecho-prision', ancho: 46, alto: 20, lugares: [[0.18, 190, 0.8], [0.8, 210, 0.85], [0.5, 150, 0.7]], espera: [5, 6.5], dura: [5, 8] },
};

/* ------------------------------------------------------------------
   La vida del fondo (tercera ronda)
   ------------------------------------------------------------------ */

/**
 * Lo que pasa solo, lejos, de a uno y muy cada tanto: un pájaro que cruza, una estrella que se cae,
 * un barquito de papel que se lleva el agua. No se toca ni dice nada: premia al que mira. Es una
 * imagen impresa que cruza la pantalla con `transform`; con movimiento reducido no pasa nada.
 */
export interface Vida {
  pieza: string;
  /** Lo que mide la pieza, en unidades de escena, y cuánto se la achica (lo lejos que está). */
  ancho: number;
  alto: number;
  tam: number;
  /** La altura por la que cruza: de dónde a dónde, en unidades de escena. */
  y: readonly [number, number];
  /** Cuánto tarda en cruzar la pantalla, en segundos, y cada cuánto pasa uno. */
  dura: readonly [number, number];
  espera: readonly [number, number];
  /** Cuánto aletea (0, nada: una estrella, un barco) y cuánto se bambolea, en grados. */
  aletea: number;
  bamboleo: number;
  alfa: number;
  /** Si puede venir de cualquiera de los dos lados, o siempre de la izquierda (la estrella cae para un lado). */
  deLosDosLados: boolean;
}

const AVE = { pieza: 'vida-ave', ancho: 40, alto: 18, tam: 0.55, y: [70, 150], dura: [9, 14], espera: [22, 40], aletea: 1, bamboleo: 0, alfa: 0.8, deLosDosLados: true } as const;

export const VIDAS: Readonly<Record<string, Vida>> = {
  // La lechuza del monte y la gaviota del río son la misma silueta lejana.
  'el-monte': AVE,
  'la-pastura': AVE,
  'los-astilleros': { ...AVE, y: [60, 130] },
  // Los techos: un murciélago, más bajo y más rápido.
  'los-techos': { ...AVE, tam: 0.45, y: [120, 240], dura: [5, 8] },
  // La prisión: un pájaro blanco, de gubia, que pasa por arriba del muro. El único que sale.
  'la-prision': { ...AVE, pieza: 'vida-ave-papel', y: [40, 110], dura: [10, 15], alfa: 0.9 },
  // La ruta: una estrella que se cae.
  'la-ruta': { pieza: 'vida-fugaz', ancho: 90, alto: 30, tam: 1, y: [50, 190], dura: [0.9, 1.4], espera: [18, 34], aletea: 0, bamboleo: 0, alfa: 0.9, deLosDosLados: false },
  // El bajo: un barquito de papel que se lleva el agua, despacio.
  'el-bajo': { pieza: 'vida-barquito', ancho: 40, alto: 30, tam: 0.7, y: [500, 506], dura: [34, 46], espera: [14, 26], aletea: 0, bamboleo: 5, alfa: 0.9, deLosDosLados: true },
};

/**
 * Dónde está lo que cruza, para un avance `u` de 0 a 1: de costado en partes de la vista (entra y
 * sale por afuera), la altura en unidades, lo que aletea (de 0,3 a 1) y lo que se bambolea.
 */
export function pasoDeVida(v: Vida, u: number, t: number, alReves: boolean): { fx: number; y: number; aleteo: number; giro: number } {
  const k = Math.min(1, Math.max(0, u));
  const fx = alReves ? 1.15 - k * 1.3 : -0.15 + k * 1.3;
  // Un pájaro sube y baja apenas mientras cruza; lo que cae, cae derecho.
  const onda = v.aletea ? Math.sin(k * Math.PI * 3) * 6 : 0;
  return {
    fx,
    y: v.y[0] + (v.y[1] - v.y[0]) * k + onda,
    aleteo: v.aletea ? 0.3 + 0.7 * Math.abs(Math.sin(t * 7.5)) : 1,
    giro: v.bamboleo ? Math.sin(t * 1.3) * v.bamboleo : 0,
  };
}

/* ------------------------------------------------------------------
   El alivio: cuando el teléfono no da (tercera ronda)
   ------------------------------------------------------------------ */

/**
 * Si los cuadros vienen lentos, el camino se saca peso de encima, de a un escalón: primero lo de
 * atrás del piso (la bruma: es lo que menos se extraña), después la luz y la vida del fondo. La
 * niebla del medio y lo pegado a la cámara, que son las que hacen la escena, se quedan.
 *
 * `LENTO`: milisegundos por cuadro, promediados en una tanda de `TANDA` cuadros. 30 fps son 33 ms;
 * por encima de 28 ya se nota a tirones.
 */
export const ALIVIO = { lento: 28, tanda: 90, niveles: 2, /** Una tanda no dura más que esto, en milisegundos: a 10 cuadros por segundo, 90 cuadros serían nueve segundos de espera. */ tope: 2500 } as const;

/** El nivel de alivio que toca después de una tanda: sube de a uno, y no vuelve a bajar en la visita. */
export function alivioTras(nivel: number, msPorCuadro: number): number {
  return msPorCuadro > ALIVIO.lento ? Math.min(ALIVIO.niveles, nivel + 1) : nivel;
}

/** Con qué nivel se arranca: un teléfono que ya avisa que es flojo empieza sin la bruma de atrás. */
export function alivioDeEntrada(nucleos: number | undefined, memoria: number | undefined): number {
  return (nucleos !== undefined && nucleos <= 2) || (memoria !== undefined && memoria <= 1) ? 1 : 0;
}

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
