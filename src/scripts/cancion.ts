/**
 * La isla de la ficha de un tema: transportar y bajar solo.
 *
 * Las dos cosas dependen de quién está mirando, así que no se pueden resolver en build:
 *
 *  · **Transportar** existe porque el que canta no siempre llega al tono del disco.
 *    Un cancionero que obliga a cantar en el tono original le pide al que entra que
 *    tenga la voz del Indio, y eso es un molinete cerrado (`D-14`).
 *  · **Bajar solo** existe porque cuando estás tocando tenés las dos manos ocupadas.
 *    Es la función de autoscroll de cualquier cancionero que se use de verdad.
 *
 * Si el JavaScript no carga, la página sigue sirviendo: la letra y los acordes ya están
 * en el HTML, en el tono del disco. La isla agrega, no habilita (`D-02`).
 */

import { transportar, transportarTono, renglonDeAcordes, type Marca } from '../lib/cancionero/acordes.ts';

const tema = document.querySelector<HTMLElement>('.tema');
if (tema) {
  const tonoOriginal = tema.dataset.tono || null;

  // ---------------------------------------------------------------- transportar

  const renglones = [...tema.querySelectorAll<HTMLElement>('.renglon-acordes')];
  const grilla = [...tema.querySelectorAll<HTMLElement>('.acordes-del-tema li')];
  const salidaSemitonos = tema.querySelector<HTMLElement>('[data-semitonos]');
  const salidaTono = tema.querySelector<HTMLElement>('[data-tono-actual]');

  let semitonos = 0;

  function repintar(): void {
    const tonoAhora = transportarTono(tonoOriginal, semitonos);

    for (const renglon of renglones) {
      const marcas = JSON.parse(renglon.dataset.marcas ?? '[]') as Marca[];
      renglon.textContent = renglonDeAcordes(marcas, semitonos, tonoAhora)
        .map((c) => ' '.repeat(c.hueco) + c.acorde)
        .join('');
    }

    for (const casilla of grilla) {
      casilla.textContent = transportar(casilla.dataset.acorde ?? '', semitonos, tonoAhora);
    }

    if (salidaSemitonos) {
      // El signo importa: "+2" y "-2" se leen de un vistazo, "2" no dice para dónde.
      salidaSemitonos.textContent = semitonos > 0 ? `+${semitonos}` : String(semitonos);
    }
    if (salidaTono && tonoAhora) salidaTono.textContent = tonoAhora;
  }

  for (const boton of tema.querySelectorAll<HTMLButtonElement>('[data-transportar]')) {
    boton.addEventListener('click', () => {
      // Se da la vuelta a la octava: más de doce semitonos es el mismo tono otra vez.
      semitonos = (((semitonos + Number(boton.dataset.transportar) + 6) % 12) + 12) % 12 - 6;
      repintar();
    });
  }

  // ---------------------------------------------------------------- bajar solo

  const botonScroll = tema.querySelector<HTMLButtonElement>('[data-autoscroll]');
  const salidaVelocidad = tema.querySelector<HTMLElement>('[data-velocidad-valor]');

  /** 1 es apenas un arrastre; 5 ya es rápido para un tema movido. */
  let velocidad = 2;
  let andando = false;
  let ultimo = 0;
  /** El resto de píxel que sobra de cada cuadro: sin esto, a velocidad baja no se mueve. */
  let resto = 0;

  function paso(ahora: number): void {
    if (!andando) return;
    const delta = ultimo ? ahora - ultimo : 16;
    ultimo = ahora;

    // ~12 px por segundo por unidad de velocidad. Independiente de los Hz de la pantalla.
    const avance = (velocidad * 12 * delta) / 1000 + resto;
    const entero = Math.floor(avance);
    resto = avance - entero;

    const antes = window.scrollY;
    if (entero > 0) window.scrollBy(0, entero);

    // Llegó al final: se apaga solo en vez de quedar corriendo contra el tope.
    if (window.scrollY === antes && entero > 0) {
      detener();
      return;
    }
    requestAnimationFrame(paso);
  }

  function arrancar(): void {
    andando = true;
    ultimo = 0;
    resto = 0;
    botonScroll?.setAttribute('aria-pressed', 'true');
    if (botonScroll) botonScroll.textContent = 'Frenar';
    requestAnimationFrame(paso);
  }

  function detener(): void {
    andando = false;
    botonScroll?.setAttribute('aria-pressed', 'false');
    if (botonScroll) botonScroll.textContent = 'Bajar solo';
  }

  botonScroll?.addEventListener('click', () => (andando ? detener() : arrancar()));

  for (const boton of tema.querySelectorAll<HTMLButtonElement>('[data-velocidad]')) {
    boton.addEventListener('click', () => {
      velocidad = Math.min(6, Math.max(1, velocidad + Number(boton.dataset.velocidad)));
      if (salidaVelocidad) salidaVelocidad.textContent = String(velocidad);
    });
  }

  /**
   * Volver a la pestaña no tiene que tirarte al final del tema.
   *
   * `requestAnimationFrame` se congela cuando la pestaña deja de estar a la vista. Al
   * volver, el primer cuadro traería un `delta` de todo el tiempo que estuvo escondida
   * —minutos, si el que toca se fue a atender el teléfono— y el avance calculado con ese
   * delta manda la página al fondo de un salto. Se pone `ultimo` en cero para que el
   * primer cuadro después de volver mida desde ahí, y se vuelve a pedir el cuadro, que
   * si no la animación queda muerta con el botón diciendo "Frenar".
   */
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || !andando) return;
    ultimo = 0;
    resto = 0;
    requestAnimationFrame(paso);
  });

  // Si el que lee toca la pantalla para leer otra cosa, el scroll automático estorba.
  // Se frena solo ante cualquier gesto de scroll propio, que es lo que uno espera.
  for (const evento of ['wheel', 'touchstart'] as const) {
    window.addEventListener(evento, () => andando && detener(), { passive: true });
  }

  // `prefers-reduced-motion`: no se arranca solo nunca, pero el botón sigue estando.
  // Quien lo pide explícitamente lo tiene; lo que no hay es movimiento no pedido.
}
