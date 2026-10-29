/**
 * Lo que comparten las escenas de las zonas del plano (`arte-mapa.ts`): la geometría y el azar.
 */

import { contorno, polar, type Forma } from './mapa.ts';

export { contorno, polar, type Forma };

/** El centro del plano y el radio de la tierra: afuera está la ruta, que va dibujada aparte. */
export const CENTRO = 500;
export const RADIO_TIERRA = 432;

/** Una escena: el dibujo de una zona, en las coordenadas del plano (0 a 1000), sin recortar. */
export type Escena = () => string;

/** Un azar con semilla: el mismo dibujo en cada impresión. */
export function azar(semilla: number): () => number {
  let s = semilla >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Redondea a un decimal, para que el SVG no pese de más. */
export const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** Un punto en coordenadas polares, ya redondeado como `x y`. */
export const xy = (ang: number, r: number): string => {
  const p = polar(ang, r);
  return `${f(p.x)} ${f(p.y)}`;
};
