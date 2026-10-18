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
   La vaca cubana, en la punta de la pastura (`D-73`)
   ------------------------------------------------------------------ */

/**
 * Dónde gira cada pieza de la vaca, en coordenadas de títere: el (0, 0) es el piso debajo del
 * medio de la panza, arriba es negativo, y mira para la izquierda. La cabeza se dibuja derecha
 * en su propio marco, con el (0, 0) en el cogote, y se para en `cuello` girada `mira` grados:
 * así mira el cielo. Lo dibuja `arte-vaca.ts` y lo mueve la isla.
 */
export const VACA_ARMADO = {
  /** El cogote, en el títere: de acá cuelga la cabeza. */
  cuello: [-202, -304],
  /** La cabeza se dibuja en su marco y se agranda al pararla en el cogote. */
  cabeza: 1.2,
  /** Cuánto levanta la cabeza para mirar el cielo, y cuánto la baja para pastar o mirar el pozo. */
  mira: 36,
  pasta: -34,
  /** En el marco de la cabeza: la bisagra de la mandíbula, la oreja y el ojo. */
  bisagra: [-50, 16],
  oreja: [-12, -18],
  ojo: { centro: [-58, -14], radio: [15, 9.5], giro: -8 },
  /** Cuánto se corre la pupila adentro del ojo. */
  pupila: 4.5,
  /** La cola cuelga de acá, y la borla de la punta. */
  cola: [170, -256],
  borla: [190, -136],
  /** Por dónde sube el bolo cuando rumia: del pecho al cogote, por abajo del pescuezo. */
  bolo: [
    [-168, -164],
    [-196, -212],
    [-214, -252],
    [-226, -284],
  ],
} as const;

/** Dónde está la vaca: en la punta de la pastura, con las patas de atrás en el pasto del borde. */
export const VACA = { x: 652, y: 470, escala: 0.5 } as const;

/**
 * El cielo de la vaca. Por arriba cruza la tele de la tapa de *Un baión* hecha satélite, de
 * derecha a izquierda; cuando a la vaca la tocan, se le cae un pedazo prendido fuego, que cae
 * en `impacto`, en el pasto, al lado de las patas de adelante. Todo en coordenadas del recinto.
 */
export const CIELO_VACA = {
  satelite: { desde: [1010, 66], hasta: [-110, 122], dura: 34, pausa: 16, escala: 0.4 },
  /** Si cuando la tocan el satélite no se ve, el pedazo viene de acá, de arriba, fuera de cuadro. */
  arriba: [760, -40],
  impacto: [566, 522],
  /** Lo que tarda en caer el pedazo, y de qué tamaño va. */
  cae: 1.7,
  pedazo: 0.5,
  /** El pozo y el humo: de qué tamaño, y cuánto tardan en irse. */
  pozo: 0.55,
  humea: 7,
} as const;
