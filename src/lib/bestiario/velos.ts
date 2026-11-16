/**
 * El velo de llegada (`D-90`, octava ronda): lo que tapa la pantalla al entrar a una región y se va.
 *
 * Pedido del usuario: *"una mejor transición entre las zonas, que dé tiempo a que cargue la región
 * siguiente y además sea más inmersiva. Algo relacionado a la zona a la que vas"*. Cada región tiene
 * su firma: la niebla del monte, la ventisca de Cybersiberia, la reja de la prisión que se corre, el
 * agua del bajo que baja, el telón del galpón que sube.
 *
 * Acá van solo los números. Cómo se pinta cada uno, en `arte-velos.ts`; cómo se mueve, en
 * `styles/sitio.css`. El velo es de la página **a la que se llega**: está en su HTML, tapando desde el
 * primer cuadro, y se retira con una animación de CSS (`transform` y nada más).
 *
 * ## Desde `D-91` (`T-530`) es un loader de verdad
 *
 * El usuario: *"los loaders están muy bien pero no hace de loader, nunca termina de cargar y además a
 * veces como que se traba y ni muestra el loader"*. Tres cosas cambian:
 *
 * 1. **Tapa desde el primer cuadro**: debajo de la hoja impresa hay tinta sólida (`tinta`, la base
 *    con la que está pintada la hoja), así que tapa aunque el webp todavía no haya llegado.
 * 2. **Espera a lo que importa**: la hoja queda quieta hasta que la isla avisa (`scripts/bestiario/
 *    llegada.ts`) que el piso, lo lejano y lo de la primera pantalla están decodificados. Mientras
 *    tanto, donde la tinta es oscura se abren los ojos de la región (`mira`), y si tarda aparece un
 *    aviso seco.
 * 3. **Responde al toque al irse**: al tocar un cartel o «Al plano», la hoja del destino entra en la
 *    página que se deja, al revés de como después se va.
 *
 * **Nunca deja a nadie adentro** (`ADR-03`, molinetes abiertos): sin JavaScript se va enseguida, como
 * antes; si la isla no avisa, la isla misma tiene un tope (`ESPERA.tope`), y si la isla ni arrancó,
 * la hoja de estilo la corta sola a los `ESPERA.respaldo`. No frena el dedo en ningún caso.
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
  /** La tinta sólida de debajo: el token con el que está pintado el cuerpo de la hoja (`arte-velos.ts`). */
  tinta: string;
  /** Si mientras espera se abren los ojos de la región: solo donde la tinta es oscura, que es donde se ven. */
  mira: boolean;
}

/**
 * Cuánto espera el velo, en milisegundos. `tope`: lo máximo que la isla lo retiene aunque la red
 * sea mala. `respaldo`: cuándo lo corta la hoja de estilo si la isla no avisó nunca (`--respaldo-velo`
 * en `tokens.css`, que `velos.test.ts` compara con esto). `aviso`: desde cuándo se lee que está cargando;
 * una llegada rápida no lo ve nunca. `salida`: lo que se queda la hoja de salida si la página siguiente no llega.
 */
export const ESPERA = { tope: 6000, respaldo: 7000, aviso: 1400, salida: 5000 } as const;

/** La página del plano no es una región, pero también se llega a ella: tiene su velo. */
export const EL_PLANO = 'el-plano';
/** De quién son los ojos de un velo oscuro que no es de una región con acecho propio: los del monte, que es la puerta. */
export const OJOS_DEL_PLANO = 'el-monte';

export const VELOS: Readonly<Record<string, Velo>> = {
  'el-monte': { rumbo: 'sube', mano: 'soplada', firma: 'la niebla del monte, que te traga y se levanta', tinta: 'var(--entorno-monte-hondo)', mira: true },
  'la-pastura': { rumbo: 'corre', mano: 'soplada', firma: 'la polvareda del claro, que se la lleva el viento', tinta: 'var(--entorno-pastura-honda)', mira: true },
  'la-mesa': { rumbo: 'sube', mano: 'plana', firma: 'el mantel, que alguien levanta', tinta: 'var(--entorno-mesa-papel)', mira: false },
  'los-astilleros': { rumbo: 'corre', mano: 'soplada', firma: 'la bruma del río, con el sodio adentro', tinta: 'var(--entorno-astillero-noche)', mira: true },
  cybersiberia: { rumbo: 'corre', mano: 'soplada', firma: 'la ventisca, que cruza y pasa', tinta: 'var(--entorno-cyber-acero-claro)', mira: false },
  'el-arbol': { rumbo: 'sube', mano: 'soplada', firma: 'las nubes violetas de la llanura', tinta: 'var(--entorno-arbol-cielo)', mira: true },
  'el-galpon': { rumbo: 'sube', mano: 'plana', firma: 'el telón de trama de puntos, que sube', tinta: 'var(--entorno-galpon-brasa)', mira: true },
  'la-ruta': { rumbo: 'corre', mano: 'soplada', firma: 'los faros de uno que pasa de largo', tinta: 'var(--entorno-astillero-noche)', mira: true },
  'los-techos': { rumbo: 'corre', mano: 'crayon', firma: 'el telón de crayón de Un baión', tinta: 'var(--entorno-baion-noche)', mira: true },
  'la-prision': { rumbo: 'corre', mano: 'gubia', firma: 'la reja, que se corre', tinta: 'var(--fondo)', mira: true },
  'el-infierno': { rumbo: 'sube', mano: 'soplada', firma: 'el humo de las brasas', tinta: 'var(--entorno-infierno-brasa)', mira: true },
  'el-bajo': { rumbo: 'baja', mano: 'crayon', firma: 'el agua, que baja', tinta: 'var(--entorno-bajo-agua)', mira: true },
  'el-templo': { rumbo: 'sube', mano: 'soplada', firma: 'el humo del incienso', tinta: 'var(--fondo)', mira: true },
  [EL_PLANO]: { rumbo: 'baja', mano: 'plana', firma: 'la hoja de papel de la imprenta, que cae', tinta: 'var(--papel)', mira: false },
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
