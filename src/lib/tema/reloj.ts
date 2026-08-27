/**
 * El reloj de "adiviná el tema" (`US-02`): cuánto tardaste en decidir.
 *
 * ## Por qué el juego mide tiempo, si ya puntúa
 *
 * El puntaje de `escalera.ts` mide **cuánto audio necesitaste**. Es la mitad del juego.
 * La otra mitad es lo que cualquiera cuenta cuando sale de una partida: *la saqué al
 * toque*. Eso no estaba escrito en ningún lado, y sin embargo es lo que se comparte.
 *
 * El pedido del usuario lo dice sin vueltas (2026-08-27): "más que el puntaje es
 * importante y divertido saber en cuánto tiempo y qué temas adivinó".
 *
 * ## Las tres reglas del reloj, y las tres tienen motivo
 *
 * **1. Corre callado.** No hay número subiendo en pantalla mientras se juega. Un
 * cronómetro a la vista convierte un juego de dos minutos en una prueba, y el que llega
 * sin idea ya tiene bastante — es la línea de los molinetes abiertos (`D-14`). Se mide
 * todo y se muestra recién al revelar, que es cuando el dato es premio y no presión.
 *
 * **2. Solo cuenta lo que se jugó de verdad.** El reloj para cuando la pestaña se
 * esconde (`pausar()` / `reanudar()`), así que atender el teléfono no arruina la vuelta.
 * Un número que castiga por vivir no lo quiere compartir nadie.
 *
 * **3. Solo cuenta el tema, no la ficha.** Arranca cuando el tema queda listo para
 * jugar y para cuando se cierra. Leer la revelación es gratis: el total del resultado es
 * la suma de los cuatro temas, no el reloj de pared de la vuelta entera.
 *
 * ## El formato es registro 3
 *
 * `.claude/rules/voz-ricotera.md` reparte el sitio en tres voces, y un tiempo es un
 * rótulo: dice qué hay adentro y se calla. Sin chiste, sin adorno, sin suspensivos.
 */

/** Lo que devuelve el reloj al cerrar un tema. Milisegundos, sin redondear todavía. */
export type Milisegundos = number;

/**
 * Arriba de esto, el número deja de ser un dato y pasa a ser un accidente: alguien dejó
 * la pestaña abierta y volvió al rato. Cien minutos es holgado a propósito — el tema más
 * lento imaginable no llega —, así que topearlo no le recorta la partida a nadie.
 */
export const TOPE_MINUTOS = 99;

/**
 * Cómo se escribe una duración en pantalla y en la tarjeta.
 *
 * Segundos enteros y nunca décimas: la décima es de la escalera de audio (`0,1 s`), y
 * dos precisiones distintas en la misma línea se leen como un error de tipeo. Abajo del
 * minuto va `8 s`; arriba, `1 m 04 s` — con el cero adelante, que es como se lee un
 * tiempo y como se alinea una columna.
 */
export function duracion(ms: Milisegundos): string {
  const totalSeg = Math.max(0, Math.round(ms / 1000));
  const min = Math.floor(totalSeg / 60);
  if (min > TOPE_MINUTOS) return `+${TOPE_MINUTOS} m`;
  if (min === 0) return `${totalSeg} s`;
  const seg = totalSeg % 60;
  return `${min} m ${String(seg).padStart(2, '0')} s`;
}

/**
 * Un cronómetro que se puede parar y seguir, y que no sabe nada de pantallas.
 *
 * **Usa el reloj monótono del navegador (`performance.now()`), no la hora.** Un
 * cronómetro contra `Date.now()` se corre solo cuando el sistema ajusta la hora, y puede
 * devolver una duración negativa. Acá eso no puede pasar.
 *
 * La fuente de tiempo entra por el constructor para que los tests midan sin esperar.
 */
export class Cronometro {
  private readonly ahora: () => number;
  /** Cuándo arrancó el tramo en curso, o `null` si está parado. */
  private desde: number | null = null;
  /** Lo acumulado de los tramos ya cerrados. */
  private acumulado = 0;

  constructor(ahora: () => number = () => performance.now()) {
    this.ahora = ahora;
  }

  /** Empieza a contar de cero. Un tema nuevo nunca hereda el tiempo del anterior. */
  arrancar(): void {
    this.acumulado = 0;
    this.desde = this.ahora();
  }

  /** Para el reloj sin perder lo contado. Idempotente: pausar dos veces no cambia nada. */
  pausar(): void {
    if (this.desde === null) return;
    this.acumulado += this.ahora() - this.desde;
    this.desde = null;
  }

  /** Sigue contando. Idempotente, por el mismo motivo que `pausar`. */
  reanudar(): void {
    if (this.desde !== null) return;
    this.desde = this.ahora();
  }

  /** Lo transcurrido hasta ahora, esté corriendo o parado. */
  leer(): Milisegundos {
    return this.acumulado + (this.desde === null ? 0 : this.ahora() - this.desde);
  }

  /** Para el reloj y devuelve el total. Es lo que se llama al cerrar un tema. */
  cerrar(): Milisegundos {
    this.pausar();
    return this.acumulado;
  }
}

/** La suma de los tiempos de una vuelta. Se separa para que el test la mire sola. */
export function total(tiempos: readonly Milisegundos[]): Milisegundos {
  return tiempos.reduce((a, b) => a + b, 0);
}
