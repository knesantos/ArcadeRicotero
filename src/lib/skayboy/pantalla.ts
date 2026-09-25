/**
 * El encuadre de la pantalla completa (`ADR-10.4`, `T-301`). **Puro**: sin DOM, sin motor, sin
 * `window`. Lo usa el modo (`modo-pantalla.ts`, que la isla monta) y lo juega `pantalla.test.ts`
 * en Node.
 *
 * ## La pregunta es "¿entera en qué unidad?"
 *
 * Hay tres unidades (`ADR-08.3`): el píxel **nativo** del área (240 × 144), el píxel **CSS** de
 * la caja y el píxel **de dispositivo** de la pantalla. Lo que hace que el píxel se vea nítido
 * es que cada nativo ocupe un número entero de píxeles **de dispositivo**: eso es `E`. En el
 * mueble, `E` sale de una `--escala` CSS entera que reparte `UX-28 §2`. En el modo no hay
 * reparto que proteger, así que se elige `E` directamente, la más grande que entra.
 *
 * En un teléfono común (844 × 390 @ 3) la diferencia es la que decide: con escala CSS entera el
 * área se queda en 480 × 288 px CSS; con `E` entera llega a 640 × 384. Y el píxel sale igual de
 * nítido, porque el navegador lleva el buffer del motor a la caja con `pixelated` y, con los dos
 * enteros, a cada nativo le tocan exactamente `E` píxeles de dispositivo (`ADR-10.4`).
 *
 * ## Qué no sabe esta función
 *
 * No sabe de teclas, ni de la chapa del pie, ni del bisel. Recibe la caja donde tiene que entrar
 * el área y devuelve dónde va. Qué se descuenta de la ventana antes de llamarla lo decide
 * `UX-33` (`§1.3`, `§1.7`) y lo arma `cajaDelArea()`, abajo, también pura.
 *
 * **Toda medida dice su unidad** (`FIND-55`): todo es px CSS salvo `escala`, que es `E`.
 */

/** El área en píxeles **nativos** (`CTR-16`, `ADR-08.3`). */
export const NATIVO_ANCHO = 240;
export const NATIVO_ALTO = 144;

/** `ADR-10.4`. Todo en px CSS, salvo `escala`, que es `E`: px de dispositivo por px nativo. */
export interface Encuadre {
  /** `E`, entero, ≥ 1. */
  readonly escala: number;
  /** 240 · E / dpr. */
  readonly ancho: number;
  /** 144 · E / dpr. */
  readonly alto: number;
  /** Redondeado a un px de dispositivo entero, expresado en px CSS. */
  readonly izquierda: number;
  /** Ídem. */
  readonly arriba: number;
}

/** Dónde empieza la caja, en px CSS, medido desde el mismo origen que el resultado. */
export interface Origen {
  readonly x: number;
  readonly y: number;
}

/** El margen de la coma flotante: un cociente exacto no puede perder un entero por ella. */
const EPSILON = 1e-9;

/**
 * La escala entera más grande que entra en la caja, y dónde queda el área centrada en ella.
 *
 * - `E = max(1, ⌊min(anchoCss·dpr / 240, altoCss·dpr / 144) + 1e-9⌋)`. **`floor`, nunca
 *   `round`**: con `round`, 812 × 375 @ 3 daría `E = 8` y un área de 1152 px de dispositivo de
 *   alto en una ventana de 1125. El piso es 1: con una ventana más chica que el área a ×1 el área
 *   no entra, y ningún teléfono llega ahí (caso 6 de `ADR-10.4`).
 * - `izquierda = round(origen.x·dpr + (anchoCss·dpr − 240·E) / 2) / dpr`, y `arriba` igual con
 *   144. El área queda centrada y **arranca en un píxel de dispositivo entero** — que es la
 *   segunda condición de la nitidez de `ADR-10.4`. Con `origen` en cero es la fórmula de la
 *   decisión tal cual; el origen existe porque la caja que arma `cajaDelArea()` no siempre
 *   arranca en el borde de la ventana, y redondear después de sumarlo es lo único que deja la
 *   posición final en un píxel entero.
 */
export function encuadre(anchoCss: number, altoCss: number, dpr: number, origen: Origen = { x: 0, y: 0 }): Encuadre {
  const anchoDisp = anchoCss * dpr;
  const altoDisp = altoCss * dpr;
  const escala = Math.max(1, Math.floor(Math.min(anchoDisp / NATIVO_ANCHO, altoDisp / NATIVO_ALTO) + EPSILON));
  return {
    escala,
    ancho: (NATIVO_ANCHO * escala) / dpr,
    alto: (NATIVO_ALTO * escala) / dpr,
    izquierda: Math.round(origen.x * dpr + (anchoDisp - NATIVO_ANCHO * escala) / 2) / dpr,
    arriba: Math.round(origen.y * dpr + (altoDisp - NATIVO_ALTO * escala) / 2) / dpr,
  };
}

/** Lo que `UX-33` le saca a la ventana antes de buscar la escala. Todo en px CSS. */
export interface Reserva {
  /** El bisel, en los cuatro lados (`UX-27 §1.1`, `UX-33 §1.3`): 4 px CSS, fijo. */
  readonly bisel: number;
  /** La chapa del pie con el homenaje, pinchada abajo (`UX-33 §1.7`): lo que mida de verdad. */
  readonly pie: number;
  /** Las teclas, cuando el área no puede ir debajo de ellas: el vertical. Alto + aire. */
  readonly mando: number;
}

/** La caja donde tiene que entrar el área: su origen y su tamaño, en px CSS. */
export interface Caja extends Origen {
  readonly ancho: number;
  readonly alto: number;
}

/**
 * La caja que se le pasa a `encuadre()`, dada la ventana del modo (el contenedor entero).
 *
 * - **De costado** (`UX-33 §1.3` y `§1.4`): se descuentan el pie de abajo y el bisel de los
 *   cuatro lados, y nada más. Las teclas van **encima** del área, en la disposición del
 *   horizontal: es el pedido del usuario (`D-47` punto 1) y por eso no se reservan.
 * - **Parado** (alto mayor que ancho): además se reserva el alto del mando abajo. En vertical el
 *   área es chica (`ADR-10.4`, caso 3) y las dos columnas de teclas, puestas encima, taparían
 *   buena parte de ella; con la reserva, el área va arriba y las teclas quedan debajo, donde
 *   cae el pulgar. `UX-33 §1.9` no pone el botón de entrar en vertical, pero el que entró de
 *   costado y giró el teléfono sigue en el modo (`ADR-10.2`): esto es lo que ve.
 *
 * Nunca devuelve un tamaño negativo: una ventana más chica que lo reservado da una caja de
 * cero, y `encuadre()` la lleva a su piso de `E = 1`.
 */
export function cajaDelArea(anchoCss: number, altoCss: number, reserva: Reserva): Caja {
  const parado = altoCss > anchoCss;
  const abajo = reserva.pie + (parado ? reserva.mando : 0);
  return {
    x: reserva.bisel,
    y: reserva.bisel,
    ancho: Math.max(0, anchoCss - 2 * reserva.bisel),
    alto: Math.max(0, altoCss - abajo - 2 * reserva.bisel),
  };
}
