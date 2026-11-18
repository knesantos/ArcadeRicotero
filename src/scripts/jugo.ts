/**
 * El jugo: la respuesta de las piezas cuando pasa algo en la partida.
 *
 * Nace en la ronda de pulida de "Adiviná el tema" (2026-11-17) y está escrito para que lo
 * usen los demás juegos: son tres gestos, y cada uno tiene su clase en `juego.css` (bloque
 * "El jugo").
 *
 * - **Golpear** (`.jugo-golpe`): la pieza se sacude en saltos duros, cuadro a cuadro, como el
 *   temblor de un fichín. Es el error.
 * - **Estampar** (`.jugo-sello`): la pieza cae como un sello de goma, más grande y más torcida,
 *   y apoya. Sin rebote. Es lo que cambia de valor o se cierra.
 * - **Contar**: un número llega a su valor en escalones, no en un deslizamiento. Es lo que suma.
 *
 * Los tres quedan quietos con movimiento reducido: los tiempos salen de tokens que el corte
 * lleva a cero (`--duracion-golpe`, `--duracion-pasada`, `--duracion-cuenta`), y `contar`
 * escribe el valor final de una. **Ningún estado depende de estos gestos**: acompañan a un
 * texto o a un símbolo que ya dice lo mismo.
 *
 * No hay un segundo `requestAnimationFrame`: los dos primeros son animaciones de CSS que se
 * vuelven a disparar, y la cuenta sube con un reloj de pocos escalones.
 */

/** Lee una duración de `tokens.css`, en milisegundos. Con movimiento reducido da 0. */
export function duracionDe(token: string): number {
  const crudo = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const n = parseFloat(crudo);
  if (!Number.isFinite(n)) return 0;
  return crudo.endsWith('ms') ? n : n * 1000;
}

/** Vuelve a disparar una animación de CSS: la clase sale, el navegador se entera, y vuelve. */
function redisparar(pieza: Element, clase: string): void {
  pieza.classList.remove(clase);
  // Leer una medida obliga al navegador a asentar el estilo sin la clase; sin esto, sacarla y
  // ponerla en el mismo cuadro no reinicia nada.
  void (pieza as HTMLElement).offsetWidth;
  pieza.classList.add(clase);
}

/** El error: la pieza se sacude en saltos duros. */
export function golpear(pieza: Element | null | undefined): void {
  if (pieza) redisparar(pieza, 'jugo-golpe');
}

/** Lo que cambia o se cierra: la pieza cae como un sello y apoya. */
export function estampar(pieza: Element | null | undefined): void {
  if (pieza) redisparar(pieza, 'jugo-sello');
}

/** Cuántos escalones tiene una cuenta. Pocos y parejos: se tienen que poder ver uno por uno. */
const ESCALONES_DE_CUENTA = 8;

const cuentas = new WeakMap<Element, number>();

/**
 * Lleva un número de `desde` a `hasta` en escalones, escribiéndolo con `formato`.
 *
 * El valor final se escribe siempre, pase lo que pase en el medio: si la cuenta se corta
 * (otra cuenta sobre la misma pieza, movimiento reducido, un valor que no cambia), lo que
 * queda escrito es `hasta`.
 */
export function contar(
  pieza: HTMLElement,
  desde: number,
  hasta: number,
  formato: (n: number) => string,
): void {
  const previa = cuentas.get(pieza);
  if (previa !== undefined) window.clearInterval(previa);
  cuentas.delete(pieza);

  const total = duracionDe('--duracion-cuenta');
  if (total <= 0 || desde === hasta) {
    pieza.textContent = formato(hasta);
    return;
  }

  let escalon = 0;
  pieza.textContent = formato(desde);
  const reloj = window.setInterval(() => {
    escalon += 1;
    if (escalon >= ESCALONES_DE_CUENTA) {
      window.clearInterval(reloj);
      cuentas.delete(pieza);
      pieza.textContent = formato(hasta);
      return;
    }
    pieza.textContent = formato(Math.round(desde + ((hasta - desde) * escalon) / ESCALONES_DE_CUENTA));
  }, total / ESCALONES_DE_CUENTA);
  cuentas.set(pieza, reloj);
}
