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
 * ## Por qué es el cuerpo en el recital y no S / A / B / C / D
 *
 * Es la decisión que sostiene todo el juego, y no es de estilo.
 *
 * Las letras del género son **notas de boletín**: S es "sobresaliente" y F es *fail*. Una
 * nota dice que la fila de arriba está bien y la de abajo está mal — que es exactamente la
 * afirmación que este juego no puede hacer (`BR-22`, heredado de `BR-17`). El sitio no
 * tiene un orden correcto de los temas de esta banda, y si lo tuviera, el juego dejaría de
 * ser tuyo.
 *
 * Las filas dicen **cuánto te mueve el cuerpo ese tema**: en el pogo, saltando,
 * cabeceando, quietito. Ordenan sin calificar: nadie que escucha un tema quietito "se
 * equivocó", hay temas que se escuchan con los ojos cerrados. Y es la imagen más ricotera
 * que hay —el pogo de la misa—, dicha con el cuerpo y no con un adjetivo (`voz-ricotera.md`
 * §4.3). El diminutivo del final no achica a nadie: le pone ternura (§4.4).
 *
 * **Hasta el 2026-10-01 eran lugares de un recital** —contra la valla, en el medio, atrás de
 * todo, en la vereda— y los cambió el usuario, que las quería más ricoteras (`D-52`). Los
 * números de fila no cambiaron, así que un enlace compartido con las viejas abre igual: lo
 * que estaba contra la valla aparece en el pogo.
 *
 * ## Por qué cuatro y no seis
 *
 * TierMaker trae seis (S A B C D F) porque es una fábrica de plantillas y quien la usa
 * arma sus propias filas. Acá el conjunto viene armado y las filas no se editan, así que
 * el número lo decide otra cosa: **cuántas maneras distintas de moverse hay de verdad**.
 * Hay cuatro, y ninguna se confunde con la de al lado. Una quinta —"bailando", "aplaudiendo"—
 * obligaba al jugador a decidir si mueve más o menos que saltar, y una fila cuyo orden se
 * puede discutir no ordena nada.
 */

/** El identificador de una fila, y **su número en el empaquetado del link** (`ADR-06`). */
export const FILAS = [
  { id: 1, clave: 'pogo', nombre: 'EN EL POGO' },
  { id: 2, clave: 'saltando', nombre: 'SALTANDO' },
  { id: 3, clave: 'cabeceando', nombre: 'CABECEANDO' },
  { id: 4, clave: 'quietito', nombre: 'QUIETITO' },
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
