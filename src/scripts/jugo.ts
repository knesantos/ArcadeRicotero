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

import { ponerRuidos, ruidosPrendidos, sonarEfecto } from '../lib/audio/efectos.ts';

/** Lee una duración de `tokens.css`, en milisegundos. Con movimiento reducido da 0. */
export function duracionDe(token: string): number {
  const crudo = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const n = parseFloat(crudo);
  if (!Number.isFinite(n)) return 0;
  return crudo.endsWith('ms') ? n : n * 1000;
}

/** Vuelve a disparar una animación de CSS: la clase sale, el navegador se entera, y vuelve. */
function redisparar(pieza: Element, clase: string): void {
  // Los dos gestos son la misma propiedad (`animation`): una pieza lleva uno solo por vez.
  pieza.classList.remove('jugo-golpe', 'jugo-sello', 'jugo-pega');
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

/** Lo que se elige o se apoya: la pieza llega corrida y torcida y termina de pegarse. */
export function pegar(pieza: Element | null | undefined): void {
  if (pieza) redisparar(pieza, 'jugo-pega');
}

/**
 * Un numero que vuela de donde nacio a donde se suma: el "+40" del acierto, hasta la cuenta
 * de la cabecera. Es una copia suelta del texto que viaja por encima de la pantalla y se
 * borra al llegar; `alLlegar` es donde la cuenta de destino empieza a subir.
 *
 * Dura `--duracion-umbral` y usa la curva del sitio. Con movimiento reducido no hay vuelo:
 * `alLlegar` se llama en el acto. Solo se anima `transform`.
 */
export function volar(texto: string, clase: string, desde: Element, hasta: Element, alLlegar: () => void): void {
  const ms = duracionDe('--duracion-umbral');
  if (ms <= 0 || typeof desde.animate !== 'function') {
    alLlegar();
    return;
  }
  const a = desde.getBoundingClientRect();
  const b = hasta.getBoundingClientRect();
  const ficha = document.createElement('span');
  ficha.className = clase;
  ficha.textContent = texto;
  ficha.setAttribute('aria-hidden', 'true');
  ficha.style.left = `${a.left}px`;
  ficha.style.top = `${a.top}px`;
  document.body.append(ficha);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const curva = getComputedStyle(document.documentElement).getPropertyValue('--curva-cinta').trim() || 'linear';
  const vuelo = ficha.animate(
    [{ transform: 'translate(0, 0) scale(1)' }, { transform: `translate(${dx}px, ${dy}px) scale(0.45)` }],
    { duration: ms, easing: curva, fill: 'forwards' },
  );
  const llegar = (): void => {
    ficha.remove();
    alLlegar();
  };
  vuelo.addEventListener('finish', llegar, { once: true });
  vuelo.addEventListener('cancel', llegar, { once: true });
}

/**
 * Una pieza que vuela de un lugar a otro de la pantalla: la hoja recién impresa, de la mesa a
 * la soga (nace en "Adiviná la tapa", ronda de pulida del 2026-11-20). Es `volar`, pero con
 * una pieza en vez de un texto: quien llama arma el nodo (una imagen, un recorte de papel) y
 * este gesto lo lleva del rectángulo de `desde` al de `hasta`, achicándolo a su medida.
 *
 * La pieza viaja suelta por encima de la pantalla (`.pieza-vuela`, en `juego.css`), no se lee
 * ni toma toques, y se borra al llegar. Dura `--duracion-umbral`; con movimiento reducido no
 * hay vuelo y `alLlegar` se llama en el acto. Solo se anima `transform`.
 */
export function volarPieza(pieza: HTMLElement, desde: Element, hasta: Element, alLlegar: () => void): void {
  const ms = duracionDe('--duracion-umbral');
  const a = desde.getBoundingClientRect();
  const b = hasta.getBoundingClientRect();
  if (ms <= 0 || typeof pieza.animate !== 'function' || a.width === 0 || b.width === 0) {
    alLlegar();
    return;
  }
  pieza.classList.add('pieza-vuela');
  pieza.setAttribute('aria-hidden', 'true');
  pieza.style.left = `${a.left}px`;
  pieza.style.top = `${a.top}px`;
  pieza.style.width = `${a.width}px`;
  pieza.style.height = `${a.height}px`;
  document.body.append(pieza);
  const curva = getComputedStyle(document.documentElement).getPropertyValue('--curva-cinta').trim() || 'linear';
  const vuelo = pieza.animate(
    [
      { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
      {
        transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${b.width / a.width}, ${b.height / a.height}) rotate(-3deg)`,
      },
    ],
    { duration: ms, easing: curva, fill: 'forwards' },
  );
  let llego = false;
  const llegar = (): void => {
    if (llego) return;
    llego = true;
    pieza.remove();
    alLlegar();
  };
  vuelo.addEventListener('finish', llegar, { once: true });
  vuelo.addEventListener('cancel', llegar, { once: true });
}

/**
 * El interruptor de los ruidos de interfaz, para la cabina de cualquier juego.
 *
 * Un boton chico con `aria-pressed`: apretado es "ruidos prendidos". El texto dice lo que va
 * a hacer el toque, en voseo, y lo pone quien llama (sale del copy de su juego, que es donde
 * lo audita `voz.test.ts`). Apaga solo los efectos de `lib/audio/efectos.ts`; la musica no.
 */
export function armarInterruptorDeRuidos(textos: { apagar: string; prender: string }): HTMLButtonElement {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'ruidos';
  const pintar = (): void => {
    const si = ruidosPrendidos();
    boton.setAttribute('aria-pressed', String(si));
    boton.textContent = si ? textos.apagar : textos.prender;
  };
  boton.addEventListener('click', () => {
    ponerRuidos(!ruidosPrendidos());
    pintar();
    // Al prenderlos, se oye que volvieron.
    sonarEfecto('tecla');
  });
  pintar();
  return boton;
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

/* ---------------------------------------------------------------- el contador mecánico
 *
 * Nace en la ronda de "Preguntas ricoteras" (2026-11-19): el contador de créditos de un
 * fichín, de ruedas. Cada cifra vive en su ventanita y, cuando cambia, **la rueda gira**: la
 * cifra nueva baja y empuja a la vieja, en cuatro saltos (`cifra-rueda`, en `juego.css`). Solo
 * giran las ruedas que cambian, como en uno de verdad.
 *
 * Es dibujo: va con `aria-hidden` y quien llama pone al lado el texto que se lee. Con
 * movimiento reducido el tiempo vale cero y la cifra nueva aparece puesta.
 */

const enRuedas = (valor: number, cifras: number): string =>
  String(Math.max(0, Math.floor(valor))).padStart(cifras, '0').slice(-cifras);

/** Arma un contador con `cifras` ruedas (se completa con ceros a la izquierda). */
export function armarContador(valor: number, cifras = 2): HTMLElement {
  const caja = document.createElement('span');
  caja.className = 'contador';
  caja.setAttribute('aria-hidden', 'true');
  for (const letra of enRuedas(valor, cifras)) {
    const rueda = document.createElement('span');
    rueda.className = 'contador-cifra';
    const tira = document.createElement('span');
    tira.className = 'contador-tira';
    const cifra = document.createElement('span');
    cifra.textContent = letra;
    tira.append(cifra);
    rueda.append(tira);
    caja.append(rueda);
  }
  return caja;
}

/** Lleva el contador a `valor`: giran solo las ruedas cuya cifra cambia. Devuelve si algo giró. */
export function rodarContador(contador: Element | null | undefined, valor: number): boolean {
  if (!contador) return false;
  const ruedas = [...contador.querySelectorAll<HTMLElement>('.contador-cifra')];
  const texto = enRuedas(valor, ruedas.length);
  let giro = false;
  ruedas.forEach((rueda, i) => {
    const tira = rueda.firstElementChild as HTMLElement | null;
    const vieja = tira?.firstElementChild?.textContent ?? '';
    const nueva = texto[i]!;
    if (!tira || vieja === nueva) return;
    giro = true;
    // La tira queda con la nueva arriba y la vieja abajo: la animación arranca mostrando la
    // vieja y termina, sin transformación, en la nueva.
    const a = document.createElement('span');
    a.textContent = nueva;
    const b = document.createElement('span');
    b.textContent = vieja;
    tira.replaceChildren(a, b);
    rueda.classList.remove('contador-cifra--rueda');
    void rueda.offsetWidth;
    rueda.classList.add('contador-cifra--rueda');
  });
  return giro;
}
