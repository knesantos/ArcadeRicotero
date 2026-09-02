/**
 * El casete que gira (`T-204`, ciclo 12).
 *
 * Es el mismo dibujo de `public/arte/casete.svg` —línea gruesa, nada perfectamente
 * derecho (`UX-04`)— pasado a un árbol de nodos para que **los dos carretes sean grupos
 * propios** y `juego.css` pueda hacerlos girar mientras el fragmento suena. Un `<img>`
 * del archivo no sirve: lo de adentro de una imagen no se puede animar por partes.
 *
 * ## Qué dice, y por qué no es decoración
 *
 * Los carretes giran **solo mientras `sonando`** y quedan quietos al frenar. Es señal
 * diegética —la cinta corre— y es información: quien no escucha nada ve que el sitio
 * sí está sonando, y sabe que el problema es su aparato, no el juego (`UX-03`, y la
 * pantalla "Si no se escucha" que ya existe). Con movimiento reducido el carrete no gira
 * y una palabra de sello dice lo mismo (`CNT-14` §2.5: SONANDO / QUIETA).
 *
 * ## Cómo se arma
 *
 * `createElementNS`, nunca `innerHTML`: es la regla de todas las islas del repo. Cada
 * carrete lleva `transform-box: fill-box` y `transform-origin: center` desde el CSS, así
 * que gira sobre su propio eje sin que haga falta calcular nada acá.
 */

const SVG = 'http://www.w3.org/2000/svg';

function nodo<K extends keyof SVGElementTagNameMap>(
  tag: K,
  atributos: Record<string, string>,
): SVGElementTagNameMap[K] {
  const n = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(atributos)) n.setAttribute(k, v);
  return n;
}

/** Un carrete: la rueda dentada y su cruz. Gira entero, como grupo. */
function carrete(cx: number, cy: number): SVGGElement {
  const g = nodo('g', { class: 'casete-carrete' });
  g.append(
    nodo('circle', { cx: String(cx), cy: String(cy), r: '12', 'stroke-width': '4' }),
    nodo('path', {
      d: `M${cx} ${cy - 8} L ${cx} ${cy + 8} M ${cx - 8} ${cy} L ${cx + 8} ${cy}`,
      'stroke-width': '3',
    }),
  );
  return g;
}

/**
 * El casete, listo para colgar del reproductor. Es decorativo para el lector de pantalla
 * (`aria-hidden`): la palabra de estado que lo acompaña es la que se lee.
 */
export function armarCasete(): SVGSVGElement {
  const svg = nodo('svg', {
    viewBox: '0 0 200 130',
    class: 'casete-vivo',
    'aria-hidden': 'true',
    focusable: 'false',
  });
  const trazo = nodo('g', {
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '5',
    'stroke-linecap': 'round',
  });
  trazo.append(
    // La carcasa, apenas torcida.
    nodo('path', {
      d: 'M14 18 C 74 14, 136 16, 188 20 C 190 48, 189 82, 186 112 C 126 116, 66 114, 12 110 C 11 80, 12 46, 14 18 Z',
    }),
    // La ventana de la cinta.
    nodo('path', {
      d: 'M48 38 C 84 35, 122 36, 154 39 C 155 52, 155 62, 154 72 C 120 75, 84 74, 48 71 C 47 60, 47 48, 48 38 Z',
      'stroke-width': '4',
    }),
    carrete(72, 55),
    carrete(130, 55),
    // La cinta floja entre los carretes.
    nodo('path', { d: 'M84 60 C 96 66, 108 66, 118 60', 'stroke-width': '3' }),
    // La etiqueta escrita: dos renglones garabateados.
    nodo('path', { d: 'M40 88 C 80 86, 124 86, 162 88', 'stroke-width': '3', opacity: '0.7' }),
    nodo('path', { d: 'M46 98 C 78 96, 110 96, 138 98', 'stroke-width': '3', opacity: '0.7' }),
    // Los cuatro tornillos.
    nodo('circle', { cx: '26', cy: '28', r: '3', 'stroke-width': '3' }),
    nodo('circle', { cx: '176', cy: '30', r: '3', 'stroke-width': '3' }),
    nodo('circle', { cx: '26', cy: '100', r: '3', 'stroke-width': '3' }),
    nodo('circle', { cx: '174', cy: '102', r: '3', 'stroke-width': '3' }),
  );
  svg.append(trazo);
  return svg;
}
