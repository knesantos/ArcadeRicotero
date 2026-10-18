/**
 * El aerógrafo del bestiario (`D-73`, tercera vuelta).
 *
 * Pedido del usuario: *"Que sea el arte más oscuro, no tan infantil. Tratá de que se note más
 * que se basa en arte de Rocambole. Que tenga toda su estética."* La estética de las tapas de
 * Rocambole del disco doble es aerógrafo: volúmenes soplados, borde duro donde él ponía una
 * máscara de papel y borde blando donde soplaba suelto, grano, y sombras hondas. Nada de
 * contorno negro: el contorno es lo que hacía infantil a la segunda vuelta.
 *
 * Esto arma ese aerógrafo en SVG. **No lo pinta el navegador**: lo imprime una vez
 * `scripts/imprimir-bestiario.mjs` con `sharp`, pieza por pieza, a imágenes. El navegador
 * solo mueve las piezas (`scripts/bestiario.ts`). Así el desenfoque y el grano, que serían
 * carísimos en cada cuadro de un teléfono, se calculan una sola vez.
 *
 * Los colores se nombran por token (`var(--...)`) y la imprenta los resuelve contra
 * `tokens.css`: acá no vive ni un hex (`diseno-marca.md`).
 */

const f = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Los filtros del aerógrafo. Van en el `<defs>` de cada pieza que se imprime. */
export function filtros(): string {
  const soplo = (id: string, d: number): string =>
    `<filter id="${id}" x="-250%" y="-250%" width="600%" height="600%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${d}"/></filter>`;
  return (
    soplo('soplo-xs', 1.2) +
    soplo('soplo-s', 3) +
    soplo('soplo-m', 7) +
    soplo('soplo-l', 14) +
    soplo('soplo-xl', 26) +
    // El grano: oscurece apenas, punto por punto, sin tocar la forma. Es el polvo del
    // aerógrafo y del papel de la tapa impresa.
    `<filter id="grano" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="1" seed="11" result="ruido"/>` +
    `<feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0.74  0 0 0 0 0.74  0 0 0 0 0.74  1.3 0 0 0 -0.48" result="puntos"/>` +
    `<feComposite in="puntos" in2="SourceGraphic" operator="in" result="puntos-adentro"/>` +
    `<feBlend in="SourceGraphic" in2="puntos-adentro" mode="multiply"/></filter>` +
    // El grano grueso: el rociado de la boquilla abierta, para los fondos.
    `<filter id="rociado" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="3" result="ruido"/>` +
    `<feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0.7  0 0 0 0 0.7  0 0 0 0 0.7  1.4 0 0 0 -0.62" result="puntos"/>` +
    `<feComposite in="puntos" in2="SourceGraphic" operator="in" result="puntos-adentro"/>` +
    `<feBlend in="SourceGraphic" in2="puntos-adentro" mode="multiply"/></filter>` +
    // La fotocopia de *Gulp!* (`pincel.ts`): el borde de la tinta se corre con un ruido ancho
    // y queda duro, sin medios tonos.
    `<filter id="xerox" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="5" result="onda"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="onda" scale="4.5" xChannelSelector="R" yChannelSelector="G" result="corrido"/>` +
    `<feComponentTransfer in="corrido"><feFuncA type="discrete" tableValues="0 0 1 1 1"/></feComponentTransfer></filter>` +
    // La fotocopia fina, para las líneas corridas de color: corre el borde y nada más.
    `<filter id="xerox-fino" x="-6%" y="-6%" width="112%" height="112%" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.11" numOctaves="2" seed="13" result="onda"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="onda" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter>` +
    // La gubia de *Oktubre* (`grabado.ts`): el filo de cada corte en la madera, que no es una
    // curva de compás. Ruido fino y corto, y el borde vuelve a quedar duro.
    `<filter id="gubia" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.42" numOctaves="2" seed="17" result="astilla"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="astilla" scale="1.7" xChannelSelector="R" yChannelSelector="G" result="corrido"/>` +
    `<feComponentTransfer in="corrido"><feFuncA type="discrete" tableValues="0 1 1"/></feComponentTransfer></filter>` +
    // Las motas de la prensa: donde la tinta no agarró y asoma el papel. Se aplica a un
    // rectángulo, que no importa: lo que sale son las motas, del color del papel de la tapa.
    `<filter id="motas" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="29" result="ruido"/>` +
    `<feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  26 0 0 0 -20.4" result="sueltas"/>` +
    `<feFlood flood-color="var(--bestia-dracula-papel)"/><feComposite in2="sueltas" operator="in"/></filter>` +
    // Las banderas de la tapa de *Oktubre*: lo rojo de la tapa, pasado a la tinta plana del rojo.
    // Y su contrario: la calle de la tapa sin las banderas, que flamean aparte.
    `<filter id="solo-rojo" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">` +
    `<feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.2 -1.1 -1.1 0 -0.35"/>` +
    `<feComponentTransfer result="rojo"><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer>` +
    `<feFlood flood-color="var(--disco-oktubre-tinta)"/><feComposite in2="rojo" operator="in"/></filter>` +
    `<filter id="sin-rojo" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">` +
    `<feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.2 -1.1 -1.1 0 -0.2"/>` +
    `<feMorphology operator="dilate" radius="1.5"/>` +
    `<feComponentTransfer result="rojo"><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer>` +
    `<feFlood flood-color="var(--fondo)"/><feComposite in2="rojo" operator="in"/></filter>`
  );
}

/** Una mancha soplada: la forma, rellena y desenfocada. `o` es la opacidad. */
export const soplo = (d: string, color: string, tam: 'xs' | 's' | 'm' | 'l' | 'xl', o = 1): string =>
  `<path d="${d}" fill="${color}" filter="url(#soplo-${tam})"${o < 1 ? ` opacity="${f(o)}"` : ''}/>`;

/** Una elipse soplada. */
export const nube = (cx: number, cy: number, rx: number, ry: number, color: string, tam: 'xs' | 's' | 'm' | 'l' | 'xl', o = 1, giro = 0): string =>
  `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${color}" filter="url(#soplo-${tam})"${o < 1 ? ` opacity="${f(o)}"` : ''}${giro ? ` transform="rotate(${f(giro)} ${f(cx)} ${f(cy)})"` : ''}/>`;

/** Una forma de borde duro: lo que Rocambole tapaba con una máscara de papel. */
export const forma = (d: string, color: string, o = 1): string =>
  `<path d="${d}" fill="${color}"${o < 1 ? ` opacity="${f(o)}"` : ''}/>`;

/** Un trazo fino, sin relleno: un pelo, una arruga, una grieta. */
export const trazo = (d: string, color: string, ancho: number, o = 1): string =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${f(ancho)}" stroke-linecap="round" stroke-linejoin="round"${o < 1 ? ` opacity="${f(o)}"` : ''}/>`;

/**
 * La máscara: todo lo que va adentro se sopla libre, pero no se sale de la silueta. Es el
 * gesto central del aerógrafo de las tapas: borde duro afuera, volumen blando adentro.
 */
export const enmascarado = (id: string, silueta: string, adentro: string): string =>
  `<clipPath id="${id}"><path d="${silueta}"/></clipPath><g clip-path="url(#${id})">${adentro}</g>`;

/** Una pieza que se imprime: su caja en coordenadas del títere o de la escena, y el dibujo. */
export interface Pieza {
  nombre: string;
  /** x, y, ancho, alto: la caja de la imagen, en las coordenadas de quien la usa. */
  caja: readonly [number, number, number, number];
  /** El dibujo, sin `<svg>` ni `<defs>`: la imprenta los pone. */
  dibujo: string;
  /** Si la imagen es opaca (un fondo) o recortada (una pieza con alfa). */
  opaca?: boolean;
  /** Cuántos píxeles de imagen por unidad. Las piezas chicas se imprimen más finas. */
  densidad?: number;
  /**
   * La calidad del webp, si no es la de siempre. Un grabado es puro borde duro y pesa más que un
   * aerógrafo: el fondo de la prisión se imprime un poco más comprimido, que el corte lo aguanta.
   */
  calidad?: number;
}

/** La ruta pública de la imagen de una pieza. */
export const rutaDePieza = (nombre: string): string => `/bestiario/${nombre}.webp`;

/**
 * Las imágenes de un juego de piezas, cada una en su caja. Es lo que usa cada personaje del elenco
 * (`elenco.ts`) para armar su títere con sus propias piezas, sin pasar por `titeres.ts`, que junta
 * todas las del bestiario y lo importaría de vuelta.
 */
export function imagenesDe(piezas: readonly Pieza[]): (nombre: string) => string {
  const cajas = new Map(piezas.map((p) => [p.nombre, p.caja] as const));
  const f = (v: number): string => (Math.round(v * 10) / 10).toString();
  return (nombre) => {
    const caja = cajas.get(nombre);
    if (!caja) throw new Error(`no hay pieza "${nombre}" entre las del personaje`);
    const [x, y, ancho, alto] = caja;
    return `<image href="${rutaDePieza(nombre)}" x="${f(x)}" y="${f(y)}" width="${ancho}" height="${alto}" preserveAspectRatio="none"/>`;
  };
}
