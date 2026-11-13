/**
 * El velo de llegada (`D-90`, octava ronda): lo que tapa la pantalla al entrar a una región y se va.
 *
 * Pedido del usuario: *"una mejor transición entre las zonas, que dé tiempo a que cargue la región
 * siguiente y además sea más inmersiva. Algo relacionado a la zona a la que vas"*. Cada región tiene
 * su firma: la niebla del monte, la ventisca de Cybersiberia, la reja de la prisión que se corre, el
 * agua del bajo que baja, el telón del galpón que sube.
 *
 * Acá van solo los números. Cómo se pinta cada uno, en `arte-velos.ts`; cómo se mueve, en
 * `styles/velo.css`. El velo es de la página **a la que se llega**: está en su HTML, tapando desde el
 * primer cuadro, y se retira solo con una animación de CSS (`transform` y nada más). No hay
 * JavaScript: `ADR-03` decidió que el paso entre pantallas no lo tiene, y así un error de la isla no
 * deja a nadie mirando un velo. Mientras tapa, la región carga sus piezas atrás.
 */

/** Para dónde se va: para arriba, para abajo o de costado. Lo último que se ve es su canto, que es el lado que arrastra. */
export type Rumbo = 'sube' | 'baja' | 'corre';
/** Con qué mano está hecho: soplado con aerógrafo, o de canto duro (crayón, gubia, tinta plana). */
export type Mano = 'soplada' | 'crayon' | 'gubia' | 'plana';

export interface Velo {
  rumbo: Rumbo;
  mano: Mano;
  /** De qué está hecho, en una línea: es lo que lee quien revisa, no el jugador. */
  firma: string;
}

/** La página del plano no es una región, pero también se llega a ella: tiene su velo. */
export const EL_PLANO = 'el-plano';

export const VELOS: Readonly<Record<string, Velo>> = {
  'el-monte': { rumbo: 'sube', mano: 'soplada', firma: 'la niebla del monte, que te traga y se levanta' },
  'la-pastura': { rumbo: 'corre', mano: 'soplada', firma: 'la polvareda del claro, que se la lleva el viento' },
  'la-mesa': { rumbo: 'sube', mano: 'plana', firma: 'el mantel, que alguien levanta' },
  'los-astilleros': { rumbo: 'corre', mano: 'soplada', firma: 'la bruma del río, con el sodio adentro' },
  cybersiberia: { rumbo: 'corre', mano: 'soplada', firma: 'la ventisca, que cruza y pasa' },
  'el-arbol': { rumbo: 'sube', mano: 'soplada', firma: 'las nubes violetas de la llanura' },
  'el-galpon': { rumbo: 'sube', mano: 'plana', firma: 'el telón de trama de puntos, que sube' },
  'la-ruta': { rumbo: 'corre', mano: 'soplada', firma: 'los faros de uno que pasa de largo' },
  'los-techos': { rumbo: 'corre', mano: 'crayon', firma: 'el telón de crayón de Un baión' },
  'la-prision': { rumbo: 'corre', mano: 'gubia', firma: 'la reja, que se corre' },
  'el-infierno': { rumbo: 'sube', mano: 'soplada', firma: 'el humo de las brasas' },
  'el-bajo': { rumbo: 'baja', mano: 'crayon', firma: 'el agua, que baja' },
  'el-templo': { rumbo: 'sube', mano: 'soplada', firma: 'el humo del incienso' },
  [EL_PLANO]: { rumbo: 'baja', mano: 'plana', firma: 'la hoja de papel de la imprenta, que cae' },
};

/**
 * La hoja en la que se imprime: a lo largo de su rumbo mide `LARGO`, y tapa la pantalla con los
 * primeros `TAPA`; el resto es el canto roto que arrastra. De ancho, lo que mide la pantalla en esas
 * unidades: angosta si sube o baja (un teléfono parado), alta si corre.
 */
export const HOJA = { largo: 900, tapa: 640, deTraves: { sube: 360, baja: 360, corre: 640 } } as const;

/** Cuánto más larga que la pantalla es la hoja: lo que la hoja de estilo usa de alto o de ancho (140 %). */
export const SOBRA = Math.round((HOJA.largo / HOJA.tapa) * 100);

export const piezaDelVelo = (region: string): string => `velo-${region}`;
export const rutaDelVelo = (region: string): string => `/bestiario/${piezaDelVelo(region)}.webp`;
