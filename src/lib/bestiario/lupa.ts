/**
 * La lupa del bestiario (`D-90`): acercarse a mirar.
 *
 * Pedido del usuario: *"que se pueda hacer zoom"*. El plano redondo en un teléfono es chico y sus
 * carteles apenas se leen; en los caminos, el detalle de un títere es lo que más trabajo tiene y no
 * había cómo arrimarse. La lupa es la misma cuenta en los dos lados: una ventana más chica que el
 * mundo, que se agranda hasta llenar la vista.
 *
 * Esto son cuentas, sin DOM: las usan `scripts/camino.ts` y `scripts/bestiario.ts` por medio de
 * `scripts/bestiario/pellizco.ts`, que lee los dedos, y las mira `lupa.test.ts`.
 *
 * Todo se mide en píxeles **sin agrandar**: `x` e `y` son la esquina de lo que se ve, en el mundo
 * tal como está con la lupa en 1. Con la lupa en `z`, se ve una ventana de `vista / z`.
 */

/** Cuánto acerca: nunca menos que entero, y un tope donde el aerógrafo impreso todavía aguanta. */
export const LUPA = {
  min: 1,
  max: 2.6,
  /** A cuánto lleva el doble toque. */
  doble: 2,
  /** Lo que acerca o aleja cada toque de botón o de tecla. */
  paso: 1.4,
  /** Lo que dura el viaje del doble toque y de los botones, en segundos. */
  dura: 0.32,
  /** Por debajo de esto, al soltar, la lupa vuelve a 1: nadie quiere quedarse en 1,03. */
  suelta: 1.06,
  /**
   * Dos toques son un doble toque si caen a menos de esto: milisegundos y píxeles. Con 350 ms y 28 px
   * fallaba cuando el teléfono venía cargado (el segundo toque llegaba tarde, o el dedo caía un poco
   * corrido): 520 y 44 dan margen, y siguen por debajo de lo que tarda alguien en tocar dos veces a
   * propósito el mismo bicho (`D-90`, sexta ronda). El tiempo se cuenta desde que se apoyó el dedo, no
   * desde que el navegador avisa el toque.
   */
  doblePausa: 520,
  dobleRadio: 44,
} as const;

export interface Lente {
  z: number;
  /** La esquina de lo que se ve, en píxeles del mundo sin agrandar. */
  x: number;
  y: number;
}

export interface Medida {
  ancho: number;
  alto: number;
}

export const ENTERA: Lente = { z: 1, x: 0, y: 0 };

const entre = (v: number, a: number, b: number): number => Math.min(Math.max(v, a), Math.max(a, b));

/** La lente adentro de sus topes: ni más cerca ni más lejos de lo que se puede, y sin salirse del mundo. */
export function acotar(l: Lente, vista: Medida, mundo: Medida): Lente {
  const z = entre(l.z, LUPA.min, LUPA.max);
  return { z, x: entre(l.x, 0, mundo.ancho - vista.ancho / z), y: entre(l.y, 0, mundo.alto - vista.alto / z) };
}

/**
 * Acercar o alejar a `z` sin que se mueva lo que está debajo del dedo: `(fx, fy)` es un punto de la
 * vista, en píxeles de pantalla, y después de la cuenta sigue mostrando lo mismo del mundo.
 */
export function enfocar(l: Lente, z: number, fx: number, fy: number, vista: Medida, mundo: Medida): Lente {
  const zz = entre(z, LUPA.min, LUPA.max);
  const mx = l.x + fx / l.z;
  const my = l.y + fy / l.z;
  return acotar({ z: zz, x: mx - fx / zz, y: my - fy / zz }, vista, mundo);
}

/** Acercar a `z` dejando en el medio de la vista un punto del mundo (`mx`, `my`, sin agrandar). */
export function centrar(z: number, mx: number, my: number, vista: Medida, mundo: Medida): Lente {
  const zz = entre(z, LUPA.min, LUPA.max);
  return acotar({ z: zz, x: mx - vista.ancho / (2 * zz), y: my - vista.alto / (2 * zz) }, vista, mundo);
}

/** Qué punto del mundo se ve en un punto de la vista. */
export const enElMundo = (l: Lente, fx: number, fy: number): { x: number; y: number } => ({ x: l.x + fx / l.z, y: l.y + fy / l.z });

/**
 * Un punto entre dos lentes, para el viaje: `u` de 0 a 1, que arranca y llega despacio. La escala
 * viaja en proporción, no en línea: así acercar y alejar se sienten igual de rápidos.
 */
export function entreLentes(a: Lente, b: Lente, u: number): Lente {
  const k = Math.min(1, Math.max(0, u));
  const s = k * k * (3 - 2 * k);
  return { z: a.z * Math.pow(b.z / a.z, s), x: a.x + (b.x - a.x) * s, y: a.y + (b.y - a.y) * s };
}

/** Si la lupa está puesta: con menos que esto, es como si no estuviera. */
export const conLupa = (l: Lente): boolean => l.z > 1.001;
