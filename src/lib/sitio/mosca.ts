/**
 * Cómo vuela la mosca cuando la lleva alguien (`D-49`).
 *
 * Hasta acá la mosca del portal era un recorrido fijo de `@keyframes`: diecisiete segundos
 * de ida y vuelta por la pantalla, iguales para todos. Lo pidió el usuario el 2026-10-01:
 * *"que la mosca en desktop vuele alrededor del mouse como una mosca, y en mobile que vuele
 * como ahora, pero si el usuario toca, que trate de ir a volar alrededor de donde toca"*.
 *
 * Este módulo es la física y nada más: no toca el DOM, no lee la hora, no sabe de mouse ni
 * de dedos. Recibe dónde está la mosca, adónde quiere ir y cuánto tiempo pasó, y devuelve
 * dónde quedó. Vive aparte de la isla (`src/scripts/mosca.ts`) por lo mismo que el resto del
 * repo: así un test lo puede correr en Node con el azar sembrado.
 *
 * ## Por qué vuela así, y no siguiendo el puntero
 *
 * Una mosca no persigue: **revolotea alrededor**. Pica en línea casi recta hacia un punto
 * cerca de lo que le interesa, frena, se queda un instante temblando en el aire y vuelve a
 * picar para otro lado. Un objeto que sigue al cursor con resorte se lee como un cursor de
 * plantilla; esto se lee como un bicho. Por eso:
 *
 * - **El destino nunca es el ancla.** Es un punto a entre `RADIO_MIN` y `RADIO_MAX` del
 *   mouse o del toque, y se sortea de nuevo cada fracción de segundo. Se guarda como
 *   desvío del ancla y no como punto fijo: si el mouse se va, la mosca lo persigue.
 * - **Pica, no se desliza.** La velocidad deseada es alta y el giro es rápido pero no
 *   instantáneo, así que cada tramo sale en una curva corta y nerviosa.
 * - **A veces se queda.** Un cuarto de las veces que llega, se queda quieta un rato,
 *   temblando, antes del próximo tramo.
 * - **Mira para donde va.** El recorte (`public/arte/mosca.png`) tiene la cabeza para
 *   arriba, así que el ángulo es el del movimiento más un cuarto de vuelta.
 */

/** Un punto de la pantalla, en píxeles CSS desde la esquina de arriba a la izquierda. */
export interface Punto {
  readonly x: number;
  readonly y: number;
}

/** El estado de la mosca entre un cuadro y el siguiente. */
export interface Vuelo {
  /** El centro de la mosca. */
  readonly x: number;
  readonly y: number;
  /** La velocidad, en píxeles por segundo. */
  readonly vx: number;
  readonly vy: number;
  /** Para dónde mira, en grados (0 = cabeza para arriba, como el recorte). */
  readonly angulo: number;
  /** Adónde va, como desvío del ancla. */
  readonly desvio: Punto;
  /** Segundos que le quedan quieta en el aire; 0 si está volando. */
  readonly quieta: number;
  /** Segundos hasta que sortee otro destino aunque no haya llegado. */
  readonly cambio: number;
}

/**
 * Lo que la mosca está haciendo.
 *
 * - `alrededor`: revolotea cerca del ancla (el mouse, o el último toque).
 * - `a-casa`: vuelve al punto donde arranca el recorrido de siempre, para que el CSS lo
 *   retome sin salto. `angulo` es el del primer cuadro de `vuelo-de-mosca`.
 */
export type Rumbo =
  | { readonly tipo: 'alrededor'; readonly ancla: Punto }
  | { readonly tipo: 'a-casa'; readonly casa: Punto; readonly angulo: number };

/** El tamaño de la ventana: la mosca no sortea destinos fuera de ella. */
export interface Ventana {
  readonly ancho: number;
  readonly alto: number;
}

/** Lo más cerca y lo más lejos del ancla que sortea un destino. */
export const RADIO_MIN = 26;
export const RADIO_MAX = 110;

/** Lo que nunca pasa la mosca, aunque el mouse se le escape. */
export const VELOCIDAD_MAX = 900;
/** La velocidad con la que pica hacia un destino. */
const VELOCIDAD_PIQUE = 560;
/** La de volver a casa: sin apuro, como algo que se aburrió. */
const VELOCIDAD_CASA = 380;
/** Cuánto de la diferencia entre la velocidad que tiene y la que quiere corrige por segundo. */
const GIRO = 9;
/** El temblor: cuánto la empuja el azar en cada segundo de vuelo. */
const TEMBLOR = 260;
/** Cuánto se acerca a un destino antes de darlo por alcanzado. */
const LLEGADA = 8;
/** Lo que se aleja de los bordes de la ventana un destino sorteado. */
const MARGEN = 18;
/** Distancia y velocidad por debajo de las cuales la vuelta a casa está terminada. */
const EN_CASA_DISTANCIA = 3;
const EN_CASA_VELOCIDAD = 40;

/**
 * La mosca recién tomada: está donde estaba, quieta, y mira para donde miraba.
 *
 * `cambio` en cero hace que el primer cuadro sortee destino enseguida.
 */
export function despegar(donde: Punto, angulo: number): Vuelo {
  return { x: donde.x, y: donde.y, vx: 0, vy: 0, angulo, desvio: { x: 0, y: 0 }, quieta: 0, cambio: 0 };
}

/** Un destino nuevo alrededor del ancla, sin salirse de la ventana. */
export function sortearDesvio(ancla: Punto, ventana: Ventana, azar: () => number): Punto {
  const radio = RADIO_MIN + (RADIO_MAX - RADIO_MIN) * azar();
  const giro = azar() * Math.PI * 2;
  const x = limitar(ancla.x + Math.cos(giro) * radio, MARGEN, ventana.ancho - MARGEN);
  const y = limitar(ancla.y + Math.sin(giro) * radio, MARGEN, ventana.alto - MARGEN);
  return { x: x - ancla.x, y: y - ancla.y };
}

/**
 * Un cuadro de vuelo.
 *
 * `dt` se recorta a una décima: si la pestaña estuvo dormida y vuelve con tres segundos de
 * golpe, la mosca no tiene que cruzar la pantalla en un cuadro.
 */
export function volar(v: Vuelo, rumbo: Rumbo, ventana: Ventana, dtCrudo: number, azar: () => number): Vuelo {
  const dt = Math.min(Math.max(dtCrudo, 0), 0.1);
  if (dt === 0) return v;

  let { desvio, quieta, cambio } = v;
  let destino: Punto;
  let rapidez: number;

  if (rumbo.tipo === 'alrededor') {
    destino = { x: rumbo.ancla.x + desvio.x, y: rumbo.ancla.y + desvio.y };
    const lejos = Math.hypot(destino.x - v.x, destino.y - v.y);
    cambio -= dt;
    if (quieta > 0) {
      quieta = Math.max(0, quieta - dt);
    } else if (cambio <= 0 || lejos < LLEGADA) {
      // Llegó, o tardó demasiado: otro destino. A veces, antes, se queda un rato.
      if (lejos < LLEGADA && azar() < 0.25) quieta = 0.15 + 0.5 * azar();
      desvio = sortearDesvio(rumbo.ancla, ventana, azar);
      cambio = 0.25 + 0.5 * azar();
      destino = { x: rumbo.ancla.x + desvio.x, y: rumbo.ancla.y + desvio.y };
    }
    rapidez = quieta > 0 ? 0 : VELOCIDAD_PIQUE;
  } else {
    destino = rumbo.casa;
    quieta = 0;
    rapidez = VELOCIDAD_CASA;
  }

  // Llega frenando: lejos pica a toda velocidad, cerca afloja en proporción a lo que falta.
  const dx = destino.x - v.x;
  const dy = destino.y - v.y;
  const falta = Math.hypot(dx, dy);
  const querida = Math.min(rapidez, falta * 7);
  const qx = falta > 0 ? (dx / falta) * querida : 0;
  const qy = falta > 0 ? (dy / falta) * querida : 0;

  const k = Math.min(1, GIRO * dt);
  // Temblor solo en el aire alrededor del ancla: volviendo a casa tiene que llegar justo.
  const tiembla = rumbo.tipo === 'alrededor' ? TEMBLOR * dt : 0;
  let vx = v.vx + (qx - v.vx) * k + (azar() - 0.5) * 2 * tiembla;
  let vy = v.vy + (qy - v.vy) * k + (azar() - 0.5) * 2 * tiembla;

  const rapidezActual = Math.hypot(vx, vy);
  if (rapidezActual > VELOCIDAD_MAX) {
    vx = (vx / rapidezActual) * VELOCIDAD_MAX;
    vy = (vy / rapidezActual) * VELOCIDAD_MAX;
  }

  const x = v.x + vx * dt;
  const y = v.y + vy * dt;

  // Mira para donde va, salvo cuando casi no se mueve: ahí se queda con la cara que tenía.
  // Llegando a casa se acomoda al ángulo con el que arranca el recorrido de CSS.
  let quiereMirar = v.angulo;
  if (rumbo.tipo === 'a-casa' && falta < 60) quiereMirar = rumbo.angulo;
  else if (Math.hypot(vx, vy) > 60) quiereMirar = (Math.atan2(vy, vx) * 180) / Math.PI + 90;
  const angulo = v.angulo + diferenciaAngular(v.angulo, quiereMirar) * Math.min(1, 12 * dt);

  return { x, y, vx, vy, angulo, desvio, quieta, cambio };
}

/**
 * Si la vuelta a casa ya terminó: el CSS puede retomar el recorrido sin que se note.
 *
 * Pide las tres cosas a la vez —el lugar, la quietud y la cara— porque el recorrido de CSS
 * arranca con las tres puestas, y la que falte se ve como un salto en el primer cuadro.
 */
export function llegoACasa(v: Vuelo, casa: Punto, angulo: number): boolean {
  return (
    Math.hypot(casa.x - v.x, casa.y - v.y) < EN_CASA_DISTANCIA &&
    Math.hypot(v.vx, v.vy) < EN_CASA_VELOCIDAD &&
    Math.abs(diferenciaAngular(v.angulo, angulo)) < 4
  );
}

/** El giro más corto de un ángulo a otro, en grados, entre -180 y 180. */
export function diferenciaAngular(desde: number, hasta: number): number {
  return ((((hasta - desde) % 360) + 540) % 360) - 180;
}

function limitar(n: number, min: number, max: number): number {
  return max < min ? (min + max) / 2 : Math.min(max, Math.max(min, n));
}
