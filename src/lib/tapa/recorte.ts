/**
 * Dónde cae, adentro de la tapa entera, el recorte con el que se juega (`US-04`).
 *
 * "Adiviná la tapa" muestra un zoom de la tapa. Al responder, **el zoom se abre**: el pedazo
 * que mirabas se achica hasta su lugar real en la tapa, y el resto se imprime alrededor
 * (ronda de pulida, 2026-11-20). Para eso el navegador tiene que saber dónde va el pedazo, y
 * ese dato hasta ahora vivía solo en `scripts/generar-tapas.mjs`, que es quien corta los zooms.
 *
 * Esta tabla es **la misma del generador, escrita una segunda vez** porque un script de Node
 * no se importa desde una isla; `recorte.test.ts` lee el generador y falla si las dos dejan de
 * decir lo mismo. No importa nada (`D-29`, `islas.test.ts`).
 *
 * El generador corta un cuadrado de lado `LADO[nivel]` del lado corto del master, centrado en
 * `centro` y empujado hacia adentro si se sale. Los masters frontales son cuadrados y la ficha
 * de 320 px sale del mismo master, así que las fracciones del master son las de la ficha.
 *
 * **El que falta, falta a propósito**: el zoom de *La mosca y la sopa* sale de la contratapa
 * (la olla), y la tapa que se imprime al responder es la de adelante. Ahí no hay lugar al que
 * llevar el pedazo, y `recorteDe` devuelve `null`: la pantalla hace lo que hacía.
 */

/** El lado del recorte, como fracción del lado de la tapa. El mismo `ZOOM` del generador. */
export const LADO = { facil: 0.4, media: 0.26, dificil: 0.22 } as const;
export type NivelDeZoom = keyof typeof LADO;

/** El centro de cada recorte, en fracciones de la tapa, y qué tan cerrado es. */
export const CENTROS: Readonly<
  Record<string, { readonly centro: readonly [number, number]; readonly nivel: NivelDeZoom }>
> = {
  gulp: { centro: [0.42, 0.33], nivel: 'facil' },
  oktubre: { centro: [0.5, 0.83], nivel: 'facil' },
  luzbelito: { centro: [0.5, 0.52], nivel: 'facil' },
  'un-baion-para-el-ojo-idiota': { centro: [0.72, 0.35], nivel: 'media' },
  'bang-bang-estas-liquidado': { centro: [0.8, 0.33], nivel: 'media' },
  'ultimo-bondi-a-finisterre': { centro: [0.5, 0.5], nivel: 'media' },
  'lobo-suelto': { centro: [0.53, 0.47], nivel: 'dificil' },
  'cordero-atado': { centro: [0.68, 0.28], nivel: 'dificil' },
  'momo-sampler': { centro: [0.57, 0.48], nivel: 'dificil' },
};

/** El recorte ya ubicado: la esquina de arriba a la izquierda y el lado, de 0 a 1. */
export interface Recorte {
  readonly x: number;
  readonly y: number;
  readonly lado: number;
}

const acotar = (v: number, tope: number): number => Math.min(Math.max(0, v), tope);

/** Dónde va el recorte de un disco adentro de su tapa, o `null` si no sale de esa tapa. */
export function recorteDe(slug: string): Recorte | null {
  const dato = Object.hasOwn(CENTROS, slug) ? CENTROS[slug] : undefined;
  if (!dato) return null;
  const lado = LADO[dato.nivel];
  return {
    x: acotar(dato.centro[0] - lado / 2, 1 - lado),
    y: acotar(dato.centro[1] - lado / 2, 1 - lado),
    lado,
  };
}
