/**
 * Los gestos de la lupa (`D-90`): el pellizco de dos dedos, la ruedita con Ctrl (que es también el
 * pellizco de un panel táctil) y el doble toque. Lee los dedos y avisa; las cuentas son de
 * `lib/bestiario/lupa.ts` y lo que se hace con ellas, de cada isla (el camino y el plano).
 *
 * ## Por qué a mano
 *
 * El navegador ya sabe agrandar la página con dos dedos, pero agranda **todo**: el cartel, los
 * botones y la ficha se van de la pantalla junto con la escena, y el camino (que es una caja que
 * se corre de costado, `D-77`) queda a medio mirar. Acá se agranda la escena y nada más.
 *
 * ## Lo que no se rompe
 *
 * - **Caminar** sigue siendo del navegador: un dedo de costado es su scroll, con su inercia. Solo
 *   se frena el gesto cuando hay dos dedos, y solo si todavía se puede (si el navegador ya empezó
 *   a correr la escena, el pellizco se deja pasar: mejor nada que un tirón).
 * - **El toque** que abre una ficha: un doble toque son dos toques, y el primero hace lo de siempre.
 *   El segundo, si cae enseguida y en el mismo lugar, no es un toque: es la lupa, y se lo traga
 *   antes de que le llegue a nadie. Los toques que la isla le pasa a un bicho (`dispatchEvent`) no
 *   cuentan: no son de un dedo.
 */

import { LUPA } from '../../lib/bestiario/lupa.ts';

export interface Gestos {
  /** Dos dedos se apoyaron: el punto del medio, en la pantalla. */
  empieza(cx: number, cy: number): void;
  /** Cuánto se abrieron o cerraron desde que se apoyaron, y dónde está ahora el punto del medio. */
  pellizco(factor: number, cx: number, cy: number): void;
  termina(): void;
  /** La ruedita con Ctrl, o el pellizco del panel táctil: cuánto acerca, y dónde está el puntero. */
  rueda(factor: number, x: number, y: number): void;
  /** Dos toques seguidos en el mismo lugar. */
  doble(x: number, y: number, blanco: Element): void;
}

/** Lo que no cuenta para el doble toque: ahí dos toques son dos toques. */
const DE_TOCAR = 'a, button, input, select, textarea';

export function leerGestos(el: HTMLElement, g: Gestos): void {
  let abierto: number | null = null;

  const medio = (t: TouchList): { d: number; x: number; y: number } => {
    const [a, b] = [t[0]!, t[1]!];
    return { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
  };

  el.addEventListener(
    'touchstart',
    (ev) => {
      if (ev.touches.length !== 2) {
        if (abierto !== null) {
          abierto = null;
          g.termina();
        }
        return;
      }
      const m = medio(ev.touches);
      if (m.d < 8) return;
      abierto = m.d;
      g.empieza(m.x, m.y);
    },
    { passive: true },
  );

  el.addEventListener(
    'touchmove',
    (ev) => {
      if (abierto === null || ev.touches.length !== 2) return;
      // El navegador ya se llevó el gesto: no se le pelea.
      if (!ev.cancelable) {
        abierto = null;
        g.termina();
        return;
      }
      ev.preventDefault();
      const m = medio(ev.touches);
      g.pellizco(m.d / abierto, m.x, m.y);
    },
    { passive: false },
  );

  const soltar = (ev: TouchEvent): void => {
    if (abierto === null || ev.touches.length >= 2) return;
    abierto = null;
    g.termina();
  };
  el.addEventListener('touchend', soltar, { passive: true });
  el.addEventListener('touchcancel', soltar, { passive: true });

  el.addEventListener(
    'wheel',
    (ev) => {
      if (!ev.ctrlKey) return;
      ev.preventDefault();
      // Un panel táctil manda pasos chicos; una ruedita, de a cien: cada muesca acerca lo mismo.
      const paso = Math.max(-40, Math.min(40, ev.deltaY * (ev.deltaMode === 1 ? 16 : 1)));
      g.rueda(Math.exp(-paso * 0.0085), ev.clientX, ev.clientY);
    },
    { passive: false },
  );

  let ultimo: { t: number; x: number; y: number } | null = null;
  /**
   * Cuándo se apoyó el dedo del toque que viene. El aviso de toque (`click`) puede llegar tarde si el
   * teléfono está ocupado; el dedo no: el reloj del doble toque es el del dedo.
   */
  let apoyado = 0;
  el.addEventListener('pointerdown', (ev) => (apoyado = ev.timeStamp || performance.now()), { passive: true, capture: true });
  el.addEventListener(
    'click',
    (ev) => {
      if (!ev.isTrusted) return;
      const blanco = ev.target as Element;
      if (blanco.closest(DE_TOCAR)) {
        ultimo = null;
        return;
      }
      const ahora = apoyado || performance.now();
      if (ultimo && ahora - ultimo.t < LUPA.doblePausa && Math.hypot(ev.clientX - ultimo.x, ev.clientY - ultimo.y) < LUPA.dobleRadio) {
        ultimo = null;
        ev.stopPropagation();
        ev.preventDefault();
        g.doble(ev.clientX, ev.clientY, blanco);
        return;
      }
      ultimo = { t: ahora, x: ev.clientX, y: ev.clientY };
    },
    true,
  );
}
