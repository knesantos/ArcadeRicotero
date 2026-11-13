/**
 * La mirada (`D-90`, cuarta ronda): los títeres más vistos saben dónde está el dedo o el mouse.
 *
 * Pedido del usuario: *"mejores animaciones"*, y de la auditoría: *"una mirada que siga al dedo o al
 * mouse cuando está cerca"*. Acá vive lo único que hace falta compartir: dónde se vio el puntero por
 * última vez y hace cuánto. Cada títere decide qué hace con eso (el lobo tuerce la cabeza, una loba
 * entreabre el ojo, el medallón de Momo se ladea, Pierre te sigue con la cara).
 *
 * El puntero se escucha una sola vez, en el documento, y sin frenar nada (`passive`). En un
 * teléfono no hay puntero que flote: cuenta el dedo mientras está apoyado y un par de segundos
 * después de que se levantó, y el bicho se queda mirando donde estuvo.
 */

/** Cuánto dura la atención después del último movimiento, en milisegundos. */
export const ATENCION = 2600;

const puntero = { x: 0, y: 0, visto: -1e9, escucha: false };

function escuchar(): void {
  if (puntero.escucha || typeof document === 'undefined') return;
  puntero.escucha = true;
  const anotar = (ev: PointerEvent): void => {
    puntero.x = ev.clientX;
    puntero.y = ev.clientY;
    puntero.visto = performance.now();
  };
  document.addEventListener('pointermove', anotar, { passive: true });
  document.addEventListener('pointerdown', anotar, { passive: true });
}

export interface Mirada {
  /** Para dónde queda el puntero desde el bicho, de -1 a 1 en cada eje (positivo: a la derecha y abajo). */
  dx: number;
  dy: number;
  /** Cuánta atención: de 0 (lejos, o hace rato que no se mueve) a 1 (encima). */
  cerca: number;
}

const NADA: Mirada = { dx: 0, dy: 0, cerca: 0 };

/**
 * La mirada de algo que está en `(x, y)` de las coordenadas de `el`. `alcance`: a cuántos píxeles
 * de pantalla deja de importarle el puntero. Si nadie movió nada hace rato, no mide nada: devuelve
 * cero sin tocar el DOM.
 */
export function miradaDe(el: SVGGraphicsElement | null | undefined, x: number, y: number, alcance = 280): Mirada {
  escuchar();
  if (!el || typeof performance === 'undefined') return NADA;
  const hace = performance.now() - puntero.visto;
  if (hace > ATENCION) return NADA;
  const m = el.getScreenCTM?.();
  if (!m) return NADA;
  const sx = m.a * x + m.c * y + m.e;
  const sy = m.b * x + m.d * y + m.f;
  const dx = puntero.x - sx;
  const dy = puntero.y - sy;
  const d = Math.hypot(dx, dy);
  if (d > alcance) return NADA;
  // La atención se va de a poco al final, no de golpe.
  const fresca = Math.min(1, (ATENCION - hace) / 600);
  const k = (1 - d / alcance) * fresca;
  const n = Math.max(40, d);
  return { dx: (dx / n) * Math.min(1, d / 60), dy: (dy / n) * Math.min(1, d / 60), cerca: Math.min(1, k * 1.6) };
}

/** Acerca un valor a su meta con un freno: lo que hace que la mirada llegue tarde y con peso. */
export const seguir = (actual: number, meta: number, dt: number, rapidez: number): number => actual + (meta - actual) * Math.min(1, dt * rapidez);
