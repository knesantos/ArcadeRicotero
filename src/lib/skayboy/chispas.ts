/**
 * Las chispas de Skayboy y Poligirl (ronda de pulida de los juegos, 2026-11-18): **el polvo, la
 * viruta y el destello de pixel duro** que el lugar suelta cuando pasa algo (`sensacion.ts`).
 *
 * ## Dónde se dibujan, y por qué no en el canvas
 *
 * Adentro del canvas todo es un cuadro de un atlas (`T-278`, `CTR-15`, y lo vigila
 * `motor.test.ts`): ni un rectángulo de tinta plana, ni un color armado a mano. Una partícula en
 * el canvas pedía o romper esa regla o una versión nueva del atlas de la sala. Estas van en **una
 * capa de HTML encima del área**, la misma categoría que el contador de la victoria y el rótulo
 * de entrada (`UX-33 §2.5`, `D-61`): mide lo que el canvas, no toma toques, y cada chispa es un
 * cuadradito con una tinta `--px-*` de la hoja.
 *
 * ## Pixel duro
 *
 * - Cada chispa mide un número entero de píxeles nativos y **salta de una posición entera a la
 *   otra**: los pasos de la receta son enteros y cada cuadro clave lleva `step-end`. Nada se
 *   desliza y nada se funde: aparece, salta tres o cuatro veces, y no está más.
 * - Solo se anima `transform` (y la visibilidad, que es un interruptor). Las chispas salen de una
 *   fila fija de nodos que se reusan: no se crea ni se borra nada durante la partida.
 * - Ninguna dura más de 400 ms (`D-32` límite 1), y con movimiento reducido no sale ninguna: la
 *   isla no llama a `soltar()`.
 *
 * La receta —qué sale de cada golpe— es dato puro y la juega `chispas.test.ts`; el pegamento con
 * el DOM, abajo, es lo único que no corre en Node.
 */

import type { Golpe } from './sensacion.ts';

/** Las tintas que puede vestir una chispa: todas de la hoja 14, ninguna nueva. */
export const TINTAS_DE_CHISPA = ['clave', 'tesoro'] as const;
export type TintaDeChispa = (typeof TINTAS_DE_CHISPA)[number];

/** El tamaño del área, en píxeles nativos (`UX-27 §2`). */
export const AREA = { ancho: 240, alto: 144 } as const;

/** El techo de `D-32` límite 1, en milisegundos. */
export const TECHO_MS = 400;

/** Una chispa: de dónde sale, cuánto mide, de qué tinta, y por dónde salta. */
export interface Chispa {
  /** La esquina de arriba a la izquierda al nacer, en píxeles nativos. */
  readonly x: number;
  readonly y: number;
  /** El lado del cuadradito, en píxeles nativos. */
  readonly lado: number;
  readonly tinta: TintaDeChispa;
  /** Dónde está en cada salto, relativo a donde nació. El primero es siempre `[0, 0]`. */
  readonly pasos: readonly (readonly [number, number])[];
  readonly ms: number;
}

type Paso = readonly [number, number];

/** Una trayectoria espejada: lo que iba a la derecha va a la izquierda. */
const espejo = (pasos: readonly Paso[]): Paso[] => pasos.map(([dx, dy]) => [dx === 0 ? 0 : -dx, dy] as const);

const POLVO: readonly Paso[] = [[0, 0], [2, -1], [4, -2], [5, -2]];
const POLVO_ALTO: readonly Paso[] = [[0, 0], [2, -3], [4, -5], [5, -6], [6, -5]];
const RASPA: readonly Paso[] = [[0, 0], [2, 0], [3, 0]];
const VIRUTA: readonly Paso[] = [[0, 0], [2, -2], [3, -3], [4, -2]];
const DESTELLO: readonly Paso[] = [[0, 0], [3, -3], [5, -5], [6, -6]];
const DESTELLO_BAJO: readonly Paso[] = [[0, 0], [4, -1], [7, -2], [8, -2]];
/** El surtidor de una puerta que se abre: sube y cae. `abre` es cuánto se corre de costado. */
const surtidor = (abre: number): Paso[] =>
  [[0, 0], [0.4, -5], [0.7, -8], [1, -9], [1.2, -7], [1.4, -3]].map(([f, dy]) => [Math.round((f ?? 0) * abre) + 0, dy ?? 0] as const);

/**
 * **Qué chispas suelta un golpe.** `vuelta` no suelta ninguna: es la pasada del área, que es de
 * la hoja y no de esta capa.
 */
export function chispasDe(golpe: Golpe): Chispa[] {
  switch (golpe.tipo) {
    case 'vuelta':
      return [];
    case 'despegue': {
      const { x, y } = golpe;
      return [
        { x: x + 3, y: y - 2, lado: 2, tinta: 'clave', pasos: RASPA, ms: 140 },
        { x: x - 5, y: y - 2, lado: 2, tinta: 'clave', pasos: espejo(RASPA), ms: 140 },
      ];
    }
    case 'aterrizaje': {
      const { x, y, fuerte } = golpe;
      const polvo: Chispa[] = [
        { x: x + 4, y: y - 3, lado: 3, tinta: 'clave', pasos: POLVO, ms: 220 },
        { x: x - 7, y: y - 3, lado: 3, tinta: 'clave', pasos: espejo(POLVO), ms: 220 },
      ];
      if (!fuerte) return polvo;
      return [
        ...polvo,
        { x: x + 2, y: y - 3, lado: 2, tinta: 'clave', pasos: POLVO_ALTO, ms: 280 },
        { x: x - 4, y: y - 3, lado: 2, tinta: 'clave', pasos: espejo(POLVO_ALTO), ms: 280 },
      ];
    }
    case 'cajaApoya': {
      const { x, y } = golpe;
      return [
        { x: x + 7, y: y - 3, lado: 3, tinta: 'clave', pasos: POLVO, ms: 220 },
        { x: x - 10, y: y - 3, lado: 3, tinta: 'clave', pasos: espejo(POLVO), ms: 220 },
        { x: x + 5, y: y - 3, lado: 2, tinta: 'clave', pasos: POLVO_ALTO, ms: 280 },
        { x: x - 7, y: y - 3, lado: 2, tinta: 'clave', pasos: espejo(POLVO_ALTO), ms: 280 },
      ];
    }
    case 'empuje': {
      // Lo que raspa queda atrás: sale para el lado contrario al que va la caja.
      const { x, y, lado } = golpe;
      const atras = lado > 0 ? espejo(POLVO) : POLVO;
      const atrasAlto = lado > 0 ? espejo(VIRUTA) : VIRUTA;
      const desde = lado > 0 ? x - 3 : x;
      return [
        { x: desde, y: y - 3, lado: 3, tinta: 'clave', pasos: atras, ms: 220 },
        { x: desde, y: y - 6, lado: 2, tinta: 'clave', pasos: atrasAlto, ms: 260 },
      ];
    }
    case 'palanca': {
      const { x, y, lado } = golpe;
      const hacia = lado > 0 ? VIRUTA : espejo(VIRUTA);
      const hastaAlla = lado > 0 ? POLVO_ALTO : espejo(POLVO_ALTO);
      return [
        { x: x - 1, y: y - 2, lado: 2, tinta: 'clave', pasos: hacia, ms: 200 },
        { x: x - 1, y: y - 1, lado: 2, tinta: 'clave', pasos: hastaAlla, ms: 260 },
      ];
    }
    case 'favorito': {
      const { x, y } = golpe;
      // Las cuatro para arriba y para los costados: una que bajara se perdería contra el piso.
      return [DESTELLO, espejo(DESTELLO), DESTELLO_BAJO, espejo(DESTELLO_BAJO)].map((pasos) => ({
        x: x - 2,
        y: y - 2,
        lado: 4,
        tinta: 'tesoro' as const,
        pasos,
        ms: 280,
      }));
    }
    case 'puerta': {
      const { x, y } = golpe;
      return [-7, -3, 0, 4, 8].map((abre, i) => ({
        x: x - 2,
        y: y - 2,
        lado: i % 2 === 0 ? 4 : 2,
        tinta: i % 2 === 0 ? ('tesoro' as const) : ('clave' as const),
        pasos: surtidor(abre),
        ms: 380,
      }));
    }
  }
}

/* =========================================================================================
   El pegamento con el DOM
   ========================================================================================= */

/** Cuántos nodos tiene la fila: alcanza para ganar (dos puertas, diez chispas) con polvo en el aire. */
export const CHISPAS_EN_LA_FILA = 24;

export interface Chispero {
  /** Suelta las chispas de un golpe. Si la fila está toda en el aire, reusa la más vieja. */
  soltar(golpe: Golpe): void;
}

/**
 * Arma la fila de chispas adentro de la capa (`#chispas`, encima del canvas) y devuelve cómo
 * soltarlas. Sin capa, o en un navegador sin `animate()`, un chispero que no hace nada: el juego
 * no depende de esto.
 */
export function crearChispero(capa: HTMLElement | null): Chispero {
  if (capa === null || typeof capa.animate !== 'function') return { soltar: () => undefined };
  const fila: HTMLElement[] = [];
  for (let i = 0; i < CHISPAS_EN_LA_FILA; i++) {
    const nodo = document.createElement('i');
    nodo.className = 'chispa';
    capa.append(nodo);
    fila.push(nodo);
  }
  let proxima = 0;
  return {
    soltar(golpe) {
      for (const c of chispasDe(golpe)) {
        const nodo = fila[proxima];
        proxima = (proxima + 1) % fila.length;
        if (nodo === undefined) continue;
        nodo.className = `chispa chispa--${c.tinta}`;
        nodo.style.left = `${(c.x / AREA.ancho) * 100}%`;
        nodo.style.top = `${(c.y / AREA.alto) * 100}%`;
        nodo.style.setProperty('--lado', String(c.lado));
        // El traslado va en porcentajes del propio cuadradito: así un paso nativo mide lo mismo
        // que un pixel del área en cualquier escala, sin medir nada.
        const cuadros = c.pasos.map(([dx, dy], i) => ({
          offset: i / c.pasos.length,
          visibility: 'visible',
          transform: `translate(${(dx / c.lado) * 100}%, ${(dy / c.lado) * 100}%)`,
          easing: 'step-end',
        }));
        const ultimo = cuadros[cuadros.length - 1];
        if (ultimo !== undefined) cuadros.push({ ...ultimo, offset: 1 });
        for (const vieja of nodo.getAnimations()) vieja.cancel();
        nodo.animate(cuadros, { duration: c.ms });
      }
    },
  };
}
