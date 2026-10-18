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
