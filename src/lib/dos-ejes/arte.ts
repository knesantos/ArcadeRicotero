/**
 * El libro de *Luzbelito*: de dónde salen las piezas del juego y adónde van (`D-57` punto 8).
 *
 * *Luzbelito* salió como un libro de tapas de cartón con lomo de cuero y el disco en un sobre
 * (`RES-168`). El juego usa **ese libro, y nada más**: el mármol, el lomo y el esquinero del
 * frente. Una sola pieza para las cuatro maneras —los tres jueces del panel coincidieron en
 * que un pedazo distinto por identidad deja siempre una más linda—, así que ningún recorte se
 * asigna a un cuadrante.
 *
 * **Módulo hoja: no importa nada.** Lo leen el taller (`scripts/generar-dos-ejes.mjs`, que
 * recorta y dibuja), las páginas (que piden los archivos por estas rutas) y el test (que
 * vigila que ningún recorte toque lo prohibido). Una tabla de cajas en tres lugares serían
 * tres verdades.
 */

/** Un rectángulo en píxeles del máster. */
export interface Caja {
  readonly x: number;
  readonly y: number;
  readonly ancho: number;
  readonly alto: number;
}

/** El máster del frente, 953 × 953. Vive afuera de `public/`: al sitio llega solo lo recortado. */
export const MASTER = 'Docs/INVESTIGACION/TapasDiscos/luzbelito-frontal.jpg';
export const LADO_MASTER = 953;

/**
 * Lo que ningún recorte puede tocar, medido sobre el máster con una grilla el 2026-10-04.
 *
 * - **El óvalo con la figura.** Parte de la foto de una persona esclavizada (`RES-168`): se
 *   trata en registro 3, nunca como pieza ni como mascota.
 * - **La palabra LUZBELITO.** Un recorte con el título sería la tapa con otro nombre: `UX-20`
 *   §2 advertía que estampar un resultado con una tapa sugiere que hay que reconocerla.
 */
export const PROHIBIDO: Readonly<Record<'ovalo' | 'titulo', Caja>> = {
  ovalo: { x: 370, y: 260, ancho: 285, alto: 430 },
  titulo: { x: 330, y: 100, ancho: 390, alto: 130 },
};

/**
 * Las tres piezas, con su caja en el máster y el tamaño al que se achican (nunca se agrandan).
 *
 * - **La franja**: el pie de la tapa entera, de lado a lado, por debajo del óvalo. Trae el
 *   lomo a la izquierda, el mármol en el medio y el esquinero de cuero abajo a la derecha. Es
 *   la tapa de la portada del juego y el libro sobre el que se apoya la última hoja.
 * - **El canto**: el lomo y el mármol de la izquierda, de arriba abajo, sin llegar al título.
 *   Es el borde del libro en la tarjeta vertical.
 * - **El esquinero**: el triángulo de cuero de arriba a la derecha. Se pega en la esquina de la
 *   hoja del resultado.
 */
export const PIEZAS = {
  franja: { caja: { x: 0, y: 700, ancho: 953, alto: 253 }, ancho: 760, alto: 202, archivo: 'libro-franja.jpg' },
  canto: { caja: { x: 0, y: 0, ancho: 320, alto: 953 }, ancho: 160, alto: 476, archivo: 'libro-canto.jpg' },
  esquinero: { caja: { x: 730, y: 0, ancho: 223, alto: 256 }, ancho: 112, alto: 128, archivo: 'libro-esquinero.png' },
} as const satisfies Record<string, { caja: Caja; ancho: number; alto: number; archivo: string }>;

export type Pieza = keyof typeof PIEZAS;

/** Dónde quedan, servidas. */
export const CARPETA_ARTE = '/arte/dos-ejes';
export const CARPETA_TARJETAS = '/tarjetas/dos-ejes';

export const rutaDePieza = (p: Pieza): string => `${CARPETA_ARTE}/${PIEZAS[p].archivo}`;

/** El id del cuadrante en la ruta: minúscula, nunca el nombre (`ADR-02` enmendado). */
export const slugDe = (id: string): string => id.toLowerCase();

/** La tarjeta vertical que se comparte (1080 × 1350) y la vista previa (1200 × 630). */
export const rutaDeTarjeta = (id: string): string => `${CARPETA_TARJETAS}/${slugDe(id)}.png`;
export const rutaDeVistaPrevia = (id: string): string => `${CARPETA_TARJETAS}/og-${slugDe(id)}.png`;
/** La vista previa de la portada del juego, sin identidad. */
export const VISTA_PREVIA_JUEGO = `${CARPETA_TARJETAS}/og-dos-ejes.png`;

export const TARJETA = { ancho: 1080, alto: 1350 } as const;
export const VISTA_PREVIA = { ancho: 1200, alto: 630 } as const;

/** ¿Se pisan dos cajas? Para la guarda de lo prohibido. */
export function sePisan(a: Caja, b: Caja): boolean {
  return a.x < b.x + b.ancho && b.x < a.x + a.ancho && a.y < b.y + b.alto && b.y < a.y + a.alto;
}
