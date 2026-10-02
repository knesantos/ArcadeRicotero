/**
 * El teclado de la computadora para "Skayboy y Poligirl": **W A D** para Skayboy y **las
 * flechas** para Poligirl.
 *
 * ## Por qué así
 *
 * Lo pidió el usuario el 2026-10-02: *"que en desktop se pueda jugar con awsd y las
 * flechitas"* (`D-53`). El reparto no se elige, sale de `D-43`: la columna izquierda maneja
 * siempre a Skayboy y la derecha siempre a Poligirl, así que la mano izquierda (W A D) es la
 * de Skayboy y la derecha (las flechas) la de Poligirl. Son dos personas en un teclado, como
 * en el juego de origen, o una sola con las dos manos.
 *
 * Se lee `KeyboardEvent.code` y no `key`: el código es **la posición** de la tecla, así que en
 * un teclado francés las mismas tres teclas de la izquierda (Z Q D) mueven a Skayboy sin que
 * nadie configure nada. Por eso la etiqueta que se imprime en el botón dice la letra del
 * teclado de acá, el más común entre la gente que juega esto.
 *
 * `S` y la flecha para abajo no hacen nada: los personajes no se agachan.
 *
 * Es un módulo hoja que no importa nada, como `filas.ts`: lo leen la página (en build, para
 * `aria-keyshortcuts` y la etiqueta) y la isla (en el navegador, para escuchar), y los dos
 * leen la misma tabla.
 */

export type Lado = 'izquierda' | 'derecha';
export type TeclaDelMando = 'izquierda' | 'derecha' | 'salto';

export interface TeclaFisica {
  /** `KeyboardEvent.code`. */
  readonly codigo: string;
  readonly mando: Lado;
  readonly tecla: TeclaDelMando;
  /** Lo que se imprime en el botón y se anuncia como atajo. */
  readonly etiqueta: string;
  /** El valor de `aria-keyshortcuts` (la sintaxis de ARIA, no la del evento). */
  readonly atajo: string;
}

export const TECLAS_FISICAS: readonly TeclaFisica[] = [
  { codigo: 'KeyA', mando: 'izquierda', tecla: 'izquierda', etiqueta: 'A', atajo: 'A' },
  { codigo: 'KeyD', mando: 'izquierda', tecla: 'derecha', etiqueta: 'D', atajo: 'D' },
  { codigo: 'KeyW', mando: 'izquierda', tecla: 'salto', etiqueta: 'W', atajo: 'W' },
  { codigo: 'ArrowLeft', mando: 'derecha', tecla: 'izquierda', etiqueta: '←', atajo: 'ArrowLeft' },
  { codigo: 'ArrowRight', mando: 'derecha', tecla: 'derecha', etiqueta: '→', atajo: 'ArrowRight' },
  { codigo: 'ArrowUp', mando: 'derecha', tecla: 'salto', etiqueta: '↑', atajo: 'ArrowUp' },
];

/** La tecla física que mueve ese botón del mando, o `null` si no tiene. */
export function teclaDelBoton(mando: Lado, tecla: TeclaDelMando): TeclaFisica | null {
  return TECLAS_FISICAS.find((t) => t.mando === mando && t.tecla === tecla) ?? null;
}

/**
 * Qué botón del mando aprieta un evento de teclado, o `null` si no aprieta ninguno.
 *
 * Con Ctrl, Alt o la tecla de sistema apretada no aprieta nada: `Ctrl+D` es "guardar en
 * favoritos" y `Alt+←` es "volver", y el juego no le roba al navegador sus atajos.
 */
export function botonDelEvento(e: {
  readonly code: string;
  readonly ctrlKey?: boolean;
  readonly altKey?: boolean;
  readonly metaKey?: boolean;
}): TeclaFisica | null {
  if (e.ctrlKey || e.altKey || e.metaKey) return null;
  return TECLAS_FISICAS.find((t) => t.codigo === e.code) ?? null;
}
