/**
 * La mosca, cuando alguien se le acerca (`D-49`).
 *
 * Sin esta isla la mosca hace lo de siempre: el recorrido de `@keyframes vuelo-de-mosca`,
 * que es CSS puro y anda sin una línea de JavaScript. Esta isla **toma el control solo
 * cuando hay alguien**, y lo devuelve:
 *
 * - **Con mouse** (escritorio): en cuanto el puntero se mueve, la mosca va a revolotear
 *   alrededor y lo sigue. Si el puntero se va de la ventana, ella vuelve a su recorrido.
 * - **Con el dedo** (teléfono): vuela como siempre. Si la persona toca, intenta ir a
 *   revolotear alrededor del toque; si nadie vuelve a tocar en `QUEDARSE_MS`, se aburre y
 *   vuelve al recorrido.
 *
 * "Vuelve al recorrido" quiere decir **vuela hasta el primer cuadro de la animación de CSS**
 * —el mismo lugar y la misma cara— y recién ahí suelta. El CSS arranca de nuevo desde 0 %
 * sin que se vea el empalme. La física es de `lib/sitio/mosca.ts`; acá solo hay DOM.
 *
 * **Con movimiento reducido no hace nada**, y si la preferencia cambia con la página abierta,
 * suelta en el acto: la mosca es lo único del sitio que se mueve sin llevar información, y
 * bajo esa preferencia se queda parada donde arranca (`sitio.css`).
 *
 * No toca un solo clic: la mosca tiene `pointer-events: none` y los oyentes son pasivos. Un
 * toque sobre un casete sigue siendo un toque sobre un casete.
 */

import { despegar, llegoACasa, volar, type Punto, type Rumbo, type Vuelo } from '../lib/sitio/mosca.ts';

/** Cuánto se queda alrededor de un toque antes de volver al recorrido. */
const QUEDARSE_MS = 4500;
/** Lo que se puede correr el dedo para que siga contando como un toque y no como arrastre. */
const TOQUE_TOLERANCIA = 12;
/** La cara con la que arranca `vuelo-de-mosca` (`sitio.css`, 0 %). */
const ANGULO_CASA = 12;

const mosca = document.querySelector<HTMLElement>('.mosca-viva');
const reducido = matchMedia('(prefers-reduced-motion: reduce)');

if (mosca) {
  let vuelo: Vuelo | null = null;
  let rumbo: Rumbo | null = null;
  let cuadro = 0;
  let antes = 0;
  let aburrida = 0;
  let toque: { id: number; x: number; y: number } | null = null;

  const ventana = () => ({ ancho: innerWidth, alto: innerHeight });

  /** El primer cuadro del recorrido de CSS: `left: 2vw; top: 4vh`, sin traslado. */
  const casa = (): Punto => ({
    x: innerWidth * 0.02 + mosca.offsetWidth / 2,
    y: innerHeight * 0.04 + mosca.offsetHeight / 2,
  });

  function pintar(v: Vuelo): void {
    const x = v.x - mosca!.offsetWidth / 2;
    const y = v.y - mosca!.offsetHeight / 2;
    mosca!.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${v.angulo.toFixed(1)}deg)`;
  }

  /** Le saca la mosca al CSS desde donde la tenga en este cuadro, sin salto. */
  function tomar(): void {
    if (vuelo) return;
    const caja = mosca!.getBoundingClientRect();
    const m = new DOMMatrixReadOnly(getComputedStyle(mosca!).transform);
    const angulo = (Math.atan2(m.b, m.a) * 180) / Math.PI;
    vuelo = despegar({ x: caja.left + caja.width / 2, y: caja.top + caja.height / 2 }, angulo);
    mosca!.classList.add('mosca-viva--a-mano');
    pintar(vuelo);
    antes = performance.now();
    cuadro = requestAnimationFrame(latir);
  }

  /** Le devuelve la mosca al CSS. Solo se llama con la mosca ya en casa, o cortando. */
  function soltar(): void {
    cancelAnimationFrame(cuadro);
    clearTimeout(aburrida);
    vuelo = null;
    rumbo = null;
    mosca!.classList.remove('mosca-viva--a-mano');
    mosca!.style.transform = '';
  }

  function aCasa(): void {
    if (!vuelo) return;
    clearTimeout(aburrida);
    rumbo = { tipo: 'a-casa', casa: casa(), angulo: ANGULO_CASA };
  }

  function alrededorDe(ancla: Punto): void {
    rumbo = { tipo: 'alrededor', ancla };
    tomar();
  }

  function latir(ahora: number): void {
    if (!vuelo || !rumbo) return;
    const dt = (ahora - antes) / 1000;
    antes = ahora;
    vuelo = volar(vuelo, rumbo, ventana(), dt, Math.random);
    if (rumbo.tipo === 'a-casa' && llegoACasa(vuelo, rumbo.casa, ANGULO_CASA)) {
      soltar();
      return;
    }
    pintar(vuelo);
    cuadro = requestAnimationFrame(latir);
  }

  const quieto = () => reducido.matches;

  // Con mouse: la sigue mientras el puntero esté en la ventana.
  addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse' || quieto()) return;
      alrededorDe({ x: e.clientX, y: e.clientY });
    },
    { passive: true },
  );
  document.documentElement.addEventListener('mouseleave', aCasa);
  addEventListener('blur', aCasa);

  // Con el dedo: un toque, no un arrastre. El arrastre es la persona desplazando la página,
  // y ahí la mosca no tiene nada que ir a ver.
  addEventListener(
    'pointerdown',
    (e) => {
      if (e.pointerType === 'mouse') return;
      toque = { id: e.pointerId, x: e.clientX, y: e.clientY };
    },
    { passive: true },
  );
  addEventListener('pointercancel', () => (toque = null), { passive: true });
  addEventListener(
    'pointerup',
    (e) => {
      if (!toque || e.pointerId !== toque.id || quieto()) return;
      const corrido = Math.hypot(e.clientX - toque.x, e.clientY - toque.y);
      toque = null;
      if (corrido > TOQUE_TOLERANCIA) return;
      alrededorDe({ x: e.clientX, y: e.clientY });
      clearTimeout(aburrida);
      aburrida = window.setTimeout(aCasa, QUEDARSE_MS);
    },
    { passive: true },
  );

  // Una pestaña escondida no vuela: al volver arranca con el reloj en cero y no de un salto.
  document.addEventListener('visibilitychange', () => {
    if (!vuelo) return;
    if (document.hidden) {
      cancelAnimationFrame(cuadro);
    } else {
      antes = performance.now();
      cuadro = requestAnimationFrame(latir);
    }
  });

  reducido.addEventListener('change', () => {
    if (reducido.matches) soltar();
  });
}
