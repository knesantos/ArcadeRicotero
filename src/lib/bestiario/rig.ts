/**
 * El esqueleto de los títeres y la geometría del recinto del monte (`D-73`).
 *
 * Es lo único del arte que la isla necesita, y vive aparte a propósito: `arte.ts` arma todos
 * los dibujos al cargarse, y si la isla lo importara se llevaría el aerógrafo entero al
 * teléfono. Esto son números: dónde gira cada pieza, dónde está el palo, cuánto mide la soga.
 */

/** La escena: un claro de noche, más ancho que un teléfono. Se recorre de costado. */
export const ESCENA = { ancho: 900, alto: 640 } as const;
/** El palo, clavado en el medio de la pastura. */
export const PALO = { x: 450, y: 418 } as const;
/** Cuánto se aplasta el piso al verlo de costado: un punto (u, v) se ve en (x + u, y + v · ACHATE). */
export const ACHATE = 0.55;
/** El largo de la soga, en el piso: hasta acá llega el cordero. */
export const SOGA = 84;
/** La pastura, en pantalla. */
export const PASTURA = { rx: 262, ry: 138 } as const;
/** La ronda del lobo: apenas afuera de la pastura, entre las tiras del monte. */
export const RONDA_LOBO = { rx: 300, ry: 168 } as const;

/** La escala por profundidad: lo de más abajo en la pantalla está más cerca. */
export const profundidad = (y: number): number =>
  0.52 + 0.42 * ((y - (PALO.y - RONDA_LOBO.ry)) / (2 * RONDA_LOBO.ry));

/** Dónde gira cada pieza, en las coordenadas del títere (el piso es y = 0, mira a la derecha). */
export const PIVOTES = {
  lobo: {
    cabeza: [64, -98],
    cola: [-58, -70],
    'pata-tras': [-46, -62],
    'pata-tras-lejos': [-38, -62],
    'pata-del': [36, -64],
    'pata-del-lejos': [44, -64],
    boca: [70, -104],
  },
  cordero: {
    cabeza: [44, -92],
    cola: [-56, -74],
    'pata-tras': [-34, -46],
    'pata-tras-lejos': [-22, -46],
    'pata-del': [30, -46],
    'pata-del-lejos': [42, -46],
    hocico: [64, -114],
  },
} as const;

/** La cadena del lobo: cuelga del cogote, toca el piso y arrastra, y termina rota. */
export const CADENA_LOBO: ReadonlyArray<readonly [number, number]> = [
  [62, -92], [57, -78], [53, -63], [50, -48], [47, -33], [41, -18], [31, -7], [17, -3], [2, -2], [-13, -2], [-28, -3],
];

/** Dónde se ata la soga en el cordero: el nudo del collar. */
export const NUDO_CORDERO: readonly [number, number] = [62, -84];
