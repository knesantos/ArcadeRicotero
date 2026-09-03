/**
 * Las cuatro filas de "Ponelos en fila" (`US-08`), y la bandeja de lo que todavía no se
 * ubicó.
 *
 * ## Por qué este archivo no importa nada
 *
 * Misma razón que `letra/discos.ts`, escrita allá y todavía vigente: lo necesitan **los
 * dos lados**. La página lo lee en build para armar el conjunto, la isla lo lee en el
 * navegador para pintar el tablero, y el empaquetado del link lo lee para saber cuántos
 * valores caben en tres bits. Un archivo hoja es la condición para que los tres usen la
 * misma lista en vez de tres copias que se desincronizan.
 *
 * Lo vigila `islas.test.ts`, que ya se llevó puesto un juego entero por importar `node:fs`
 * dos saltos más allá de donde nadie miraba.
 *
 * ## Por qué son lugares de un recital y no S / A / B / C / D
 *
 * Es la decisión que sostiene todo el juego, y no es de estilo.
 *
 * Las letras del género son **notas de boletín**: S es "sobresaliente" y F es *fail*. Una
 * nota dice que la fila de arriba está bien y la de abajo está mal — que es exactamente la
 * afirmación que este juego no puede hacer (`BR-22`, heredado de `BR-17`). El sitio no
 * tiene un orden correcto de los temas de esta banda, y si lo tuviera, el juego dejaría de
 * ser tuyo.
 *
 * Un lugar, en cambio, ordena sin calificar. Contra la valla se está más cerca que en el
 * medio, y eso es un hecho de geografía, no un juicio: nadie que se quedó atrás de todo
 * "se equivocó". Y de paso es la imagen que este proyecto ya tiene puesta en el centro —
 * los molinetes, la valla, el que entró y el que se quedó en la vereda (`D-14`).
 *
 * ## Por qué cuatro y no seis
 *
 * TierMaker trae seis (S A B C D F) porque es una fábrica de plantillas y quien la usa
 * arma sus propias filas. Acá el conjunto viene armado y las filas no se editan, así que
 * el número lo decide otra cosa: **cuántos lugares distintos hay de verdad en la imagen**.
 * Hay cuatro, y ninguno se confunde con el de al lado. Un quinto —"en el pogo", "adelante"—
 * obligaba al jugador a decidir si está más cerca o más lejos que la valla, y una fila
 * cuyo orden se puede discutir no ordena nada.
 */

/** El identificador de una fila, y **su número en el empaquetado del link** (`ADR-06`). */
export const FILAS = [
  { id: 1, clave: 'valla', nombre: 'CONTRA LA VALLA' },
  { id: 2, clave: 'medio', nombre: 'EN EL MEDIO' },
  { id: 3, clave: 'atras', nombre: 'ATRÁS DE TODO' },
  { id: 4, clave: 'vereda', nombre: 'EN LA VEREDA' },
] as const;

export type Fila = (typeof FILAS)[number];
export type ClaveFila = Fila['clave'];

/**
 * Lo que vale una ficha sin ubicar. **Es cero a propósito**: en el empaquetado de tres
 * bits, una carga en blanco decodifica a un tablero vacío en vez de a uno lleno de
 * fichas en la primera fila.
 */
export const SIN_UBICAR = 0;

/**
 * El techo de lo que entra en tres bits. Hoy sobran tres valores (5, 6 y 7) y quedan
 * reservados: si algún día las filas fueran cinco o seis, el formato no cambia y los
 * links viejos se siguen leyendo.
 */
export const MAX_FILAS_CODIFICABLES = 7;

/** La fila con ese número, o `null` si el número no es de ninguna. */
export function filaPorId(id: number): Fila | null {
  return FILAS.find((f) => f.id === id) ?? null;
}

/** La fila con esa clave, o `null`. */
export function filaPorClave(clave: string): Fila | null {
  return FILAS.find((f) => f.clave === clave) ?? null;
}
