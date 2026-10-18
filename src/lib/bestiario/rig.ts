/**
 * La geometría de los recintos de noche y lo que la isla necesita para mover a los títeres
 * (`D-73`). Vive aparte de `arte.ts` y de `escenas.ts` a propósito: aquellos arman todos los
 * dibujos al cargarse, y si la isla los importara se llevaría el aerógrafo entero al teléfono y
 * lo correría al abrir la página. Esto son números, y `bestiario.test.ts` vigila que la isla
 * no importe otra cosa.
 */

import { ARMADO } from './recortes.ts';

/** La escena: un claro de noche, más ancho que un teléfono. Se recorre de costado. */
export const ESCENA = { ancho: 900, alto: 640 } as const;
/** El palo, clavado en el medio de la pastura. */
export const PALO = { x: 450, y: 418 } as const;
/** Cuánto se aplasta el piso al verlo de costado: un punto (u, v) se ve en (x + u, y + v · ACHATE). */
export const ACHATE = 0.55;
/** El largo de la soga, en el piso: hasta acá llega el cordero. */
export const SOGA = 84;
/** La pastura, en pantalla. */
export const PASTURA = { rx: 262, ry: 138 } as const;

/**
 * Dónde acecha el lobo: detrás de la pastura, entre el monte y el piso. Asoma subiendo desde
 * atrás del borde de `monte-cerca` y se hunde de nuevo; `hundido` es cuánto baja para no verse.
 */
export const ACECHO = { desde: 200, hasta: 700, piso: 326, hundido: 190 } as const;

/** De píxeles de la tapa a unidades de la escena. */
export const ESCALA_LOBO = 0.2;
export const ESCALA_CORDERO = 0.15;

/** El cordero, más cerca cuanto más abajo en la pastura. */
export const profundidad = (y: number): number => 0.82 + 0.32 * ((y - (PALO.y - PASTURA.ry)) / (2 * PASTURA.ry));

/* ------------------------------------------------------------------
   Los protagonistas de tapa de la quinta vuelta: dónde va cada uno en su escena
   ------------------------------------------------------------------ */

/** Dónde entra el perro: por el borde izquierdo, como en la tapa. */
export const PERRO = { x: 0, y: 470, escala: 1.15 } as const;

/* ------------------------------------------------------------------
   Limón, por los techos del baldío (`D-73`, décima vuelta)
   ------------------------------------------------------------------ */

/**
 * Dónde gira cada pieza de Limón, en coordenadas de títere: el (0, 0) es la chapa entre los dos
 * pies, arriba es negativo, y mira para la derecha (la isla lo da vuelta cuando corre para el otro
 * lado). Lo dibuja `arte-baldio.ts` y lo mueve la isla.
 */
export const LIMON_ARMADO = {
  /** El limón: el centro de la fruta y sus dos radios. La punta, la del pezón, va adelante. */
  fruta: { centro: [0, -66], radio: [36, 31] },
  /** De acá cuelgan las piernas y los brazos. */
  caderas: [[-9, -40], [9, -40]],
  hombros: [[-30, -56], [18, -42]],
  /** El largo de una pierna, de la cadera a la suela, y de un brazo, del hombro a la mano. */
  pierna: 40,
  brazo: 28,
  /** El cabito con la hoja, arriba: la hoja gira acá. */
  cabito: [-6, -96],
  /** La boca abierta, que jadea: se achica y se agranda de arriba para abajo. */
  boca: [14, -52],
  /** Los ojos: el blanco, que se imprime, y la pupila, que la isla corre para mirar para atrás. */
  ojos: [
    { centro: [1, -75], radio: [8, 9.5] },
    { centro: [18, -74], radio: [7, 8.5] },
  ],
} as const;

/**
 * Por dónde corre: la chapa que remata la medianera del baldío (`baldio-chapa`). `piso` es el filo
 * de arriba, donde pisa; corre de `desde` a `hasta`, sin meterse arriba del perro.
 */
export const CHAPA = { arriba: 284, piso: 290, abajo: 306 } as const;
export const LIMON = { desde: 250, hasta: 820, escala: 1.2, velocidad: 200 } as const;

/**
 * Las linternas del bloque: salen de afuera de la escena, arriba, una de cada lado, y barren los
 * techos entre dos ángulos (en grados, como `rotate()`: 0 es para la derecha, y crece hacia abajo).
 */
export const LINTERNAS = {
  largo: 620,
  der: { x: 960, y: 70, barre: [146, 172] },
  izq: { x: -60, y: 70, barre: [8, 34] },
} as const;

/** Dónde está la piedra de Luzbelito, y de qué tamaño va el busto. */
export const LUZBELITO = { x: 452, y: 418, escala: 0.95 } as const;

/** Dónde queda la llama de Luzbelito en la escena, para el resplandor. */
export function llamaEnEscena(): { x: number; y: number } {
  const [px, py] = ARMADO.luzbelito.piso;
  const [lx, ly] = ARMADO.luzbelito.llama;
  return { x: LUZBELITO.x + (lx - px) * LUZBELITO.escala, y: LUZBELITO.y + (ly - py) * LUZBELITO.escala };
}

/** De dónde cuelga el cordón de Momo, dónde queda la argolla y de qué tamaño va el medallón. */
export const MOMO = { cuelga: { x: 450, y: -10 }, argolla: { x: 450, y: 212 }, escala: 0.62 } as const;

/* ------------------------------------------------------------------
   El bajo inundado y el gordo Pierre (`D-73`, sexta vuelta)
   ------------------------------------------------------------------ */

/**
 * Dónde gira cada pieza del gordo Pierre, en coordenadas de títere: el (0, 0) es el agua
 * debajo del medio de la panza, y arriba es negativo. Lo dibuja `arte-bajo.ts` y lo mueve la isla.
 */
export const PIERRE_ARMADO = {
  /** El cogote: de acá se ladea la cabeza. */
  cuello: [0, -226],
  /** El hombro y el codo del brazo de la botella. */
  hombro: [-150, -188],
  codo: [-222, -116],
  /** El pico de la botella, con el brazo quieto, y la boca, adonde lo lleva el trago. */
  pico: [-210, -342],
  boca: [-4, -242],
  /** Cuánto giran el brazo y el antebrazo para empinarse la botella: el pico llega a la boca. */
  trago: { brazo: 80, antebrazo: 9 },
  /**
   * Los ojos: el centro de cada uno (de ahí los pinta `arte-bajo.ts`) y el párpado de papel que
   * lo tapa al parpadear, un poco más arriba, porque el ojo achinado es una medialuna.
   */
  ojos: [
    { centro: [-38, -304], parpado: [-38, -309], radio: [28, 10] },
    { centro: [38, -304], parpado: [38, -309], radio: [28, 10] },
  ],
} as const;

/** El bajo: dónde está el agua contra la pared y dónde la toca Pierre, y de qué tamaño va. */
export const BAJO = {
  /** La línea del agua contra la pared del fondo. */
  fondo: 372,
  /** La puerta del vidrio roto: el agujero, por donde entra el agua. */
  agujero: { x: 196, y: 176 },
} as const;
export const PIERRE = { x: 486, agua: 476, escala: 0.9 } as const;

/* ------------------------------------------------------------------
   La prisión de Barbazul y la drácula con tacones (`D-73`, séptima vuelta)
   ------------------------------------------------------------------ */

/**
 * Dónde gira cada pieza de la drácula, en coordenadas de títere: el (0, 0) es el piso entre los
 * dos tacos, y arriba es negativo. Lo dibuja `arte-prision.ts` y lo mueve la isla.
 */
export const DRACULA_ARMADO = {
  /** El medio de la cara, entre los ojos y la boca: de acá se mide todo lo de la cabeza. */
  cara: [0, -502],
  /** El cogote: de acá se ladea la cabeza. */
  cuello: [0, -446],
  /**
   * Los ojos: el centro de cada uno y el tamaño de la almendra, que tapa el párpado al parpadear.
   * El párpado nunca sube del todo (`entornados`): mira con los ojos a media asta.
   */
  entornados: 0.3,
  ojos: [
    { centro: [-17, -508], radio: [9.4, 3.5] },
    { centro: [17, -508], radio: [9.4, 3.5] },
  ],
  /**
   * Las bisagras de la capa, en cada hombro: cada mitad negra se da vuelta contra la suya como una
   * puerta de papel, y del otro lado aparece el forro rojo.
   */
  hombros: [
    [-80, -412],
    [80, -412],
  ],
  /** De dónde se mueve cada pierna al caminar, escondido debajo del vestido. */
  caderas: [
    [-17, -250],
    [17, -250],
  ],
  /** La mano que agarra el borde de la capa abierta, en la punta del ala de la derecha (la otra, espejada). */
  punta: [300, -478],
  /** La mano que cierra la capa sobre el pecho. */
  mano: [-6, -384],
} as const;

/**
 * La prisión de Barbazul: un pasillo de celdas visto de frente, con el punto de fuga en el medio.
 * Al fondo, la ventana enrejada, y detrás la calle de *Oktubre*: la tapa misma, con su gente.
 */
export const PRISION = {
  /** El punto de fuga del pasillo. */
  fuga: [450, 250],
  /** La pared del fondo: de dónde a dónde, el techo y el piso. */
  fondo: { x0: 250, x1: 650, techo: 70, piso: 400 },
  /** La ventana: el hueco, con el arco arriba. */
  ventana: { x0: 322, x1: 578, hombro: 158, clave: 116, abajo: 334 },
  /**
   * Dónde cae la tapa de *Oktubre* detrás de la ventana: el (0, 0) de la tapa y cuánto se achica.
   * Lo de abajo de la tapa (la gente y las banderas) queda en el hueco.
   */
  tapa: { x: 306.3, y: 4.1, escala: 0.342 },
  /** La jaula vacía de la fiera más fiera, adelante a la derecha, y la bisagra de su puerta. */
  jaula: { x0: 712, x1: 880, arriba: 318, piso: 628, puerta: { x: 726, arriba: 404, abajo: 616, ancho: 70 } },
} as const;

/**
 * Las banderas de la tapa, que flamean afuera de la ventana: el polígono que las recorta de la
 * tapa (en píxeles de la tapa, 953 × 953) y el punto del asta de donde flamean.
 */
export const BANDERAS: ReadonlyArray<{ poligono: ReadonlyArray<readonly [number, number]>; asta: readonly [number, number] }> = [
  { poligono: [[58, 438], [190, 438], [190, 662], [58, 662]], asta: [72, 452] },
  { poligono: [[282, 422], [338, 422], [338, 672], [282, 672]], asta: [300, 664] },
  { poligono: [[390, 432], [602, 432], [602, 502], [470, 574], [390, 600]], asta: [584, 450] },
  { poligono: [[408, 672], [470, 576], [602, 504], [652, 504], [656, 556], [560, 580], [528, 592], [470, 672]], asta: [426, 656] },
  { poligono: [[528, 594], [560, 582], [656, 558], [700, 498], [762, 498], [762, 672], [528, 672]], asta: [652, 630] },
];

/** De píxeles de la tapa a la escena. */
export const deLaTapa = ([x, y]: readonly [number, number]): [number, number] => [PRISION.tapa.x + x * PRISION.tapa.escala, PRISION.tapa.y + y * PRISION.tapa.escala];

/**
 * La drácula: dónde arranca (y dónde queda quieta con movimiento reducido), el piso por donde
 * camina, de dónde a dónde, y de qué tamaño va.
 */
export const DRACULA = { x: 330, piso: 624, desde: 196, hasta: 590, escala: 0.8 } as const;
