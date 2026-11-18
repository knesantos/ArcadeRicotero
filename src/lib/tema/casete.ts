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

/**
 * Un carrete: el aro, el eje y tres rayos. Gira entero, como grupo.
 *
 * Son tres rayos y no una cruz a proposito: una cruz se ve igual cada cuarto de vuelta, y a
 * la velocidad de la cinta parece quieta. Tres rayos desparejos se ven girar.
 */
function carrete(cx: number, cy: number): SVGGElement {
  const g = nodo('g', { class: 'casete-carrete' });
  const rayo = (grados: number, largo: number): string => {
    const a = (grados * Math.PI) / 180;
    return `M${cx} ${cy} L ${(cx + Math.cos(a) * largo).toFixed(1)} ${(cy + Math.sin(a) * largo).toFixed(1)}`;
  };
  g.append(
    nodo('circle', { cx: String(cx), cy: String(cy), r: '14', 'stroke-width': '4' }),
    nodo('path', { d: `${rayo(-90, 13)} ${rayo(30, 13)} ${rayo(150, 13)}`, 'stroke-width': '4' }),
    nodo('circle', { cx: String(cx), cy: String(cy), r: '3.5', 'stroke-width': '3' }),
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
      d: 'M12 12 C 74 8, 136 10, 190 14 C 192 46, 191 86, 188 118 C 126 122, 66 120, 10 116 C 9 84, 10 44, 12 12 Z',
    }),
    // La ventana de la cinta: grande, que es donde pasa todo.
    nodo('path', {
      d: 'M32 26 C 78 23, 124 24, 168 27 C 169 44, 169 64, 168 82 C 122 85, 78 84, 32 81 C 31 62, 31 44, 32 26 Z',
      'stroke-width': '4',
    }),
    // La cinta enrollada en cada carrete: llena a la izquierda y casi vacia a la derecha, y
    // se pasa de un lado al otro mientras suena (`ponerAvance`). Va rellena y translucida,
    // debajo del carrete.
    nodo('circle', { class: 'casete-bobina casete-bobina--llena', cx: '66', cy: '54', r: '25', stroke: 'none', fill: 'currentColor' }),
    nodo('circle', { class: 'casete-bobina casete-bobina--vacia', cx: '134', cy: '54', r: '25', stroke: 'none', fill: 'currentColor' }),
    carrete(66, 54),
    carrete(134, 54),
    // La cinta floja entre los carretes: se tensa cuando corre.
    nodo('path', { class: 'casete-cinta', d: 'M82 62 C 94 70, 106 70, 118 62', 'stroke-width': '3' }),
    // La etiqueta escrita: un renglon garabateado.
    nodo('path', { d: 'M36 100 C 70 98, 104 98, 132 100', 'stroke-width': '3', opacity: '0.7' }),
    // El piloto de la casetera: un cuadrado de tinta que se prende mientras la cinta corre.
    nodo('rect', { class: 'casete-piloto', x: '150', y: '93', width: '16', height: '12', 'stroke-width': '3' }),
  );
  svg.append(trazo);
  return svg;
}

// ---------------------------------------------------------------- el casete se comporta como un casete

/**
 * Lo que hace que el dibujo sea un objeto (ronda de pulida, 2026-11-17; pedido del usuario:
 * *"cuando esta andando el tema que giren las ruedas del cassete, cosas asi para que te metas
 * mas en el juego"*).
 *
 * Tres comportamientos, los tres atados a un estado de la partida y ninguno suelto:
 *
 * - **Toma velocidad y frena con inercia.** Una casetera no arranca ni para de golpe: el
 *   carrete tarda `--duracion-inercia` en llegar a su velocidad y lo mismo en detenerse.
 * - **La cinta se pasa de un carrete al otro** a medida que avanza el audio (`ponerAvance`).
 * - **Rebobina** cuando empieza un tema nuevo: los carretes giran para atras, rapido, y la
 *   cinta vuelve al carrete de la izquierda.
 *
 * El giro es UNA animacion de CSS por carrete (`carrete`, en `juego.css`); aca solo se le
 * cambia la velocidad con `playbackRate`, en pocos escalones y con un reloj comun. No hay un
 * segundo `requestAnimationFrame`, y lo unico que se anima es `transform`.
 *
 * Con movimiento reducido el carrete no tiene animacion (`animation: none`), asi que no hay
 * nada que acelerar: las tres funciones dejan el casete quieto y en su estado final. La
 * palabra SONANDO y el piloto prendido dicen lo mismo que el giro.
 */

/** En cuantos escalones cambia de velocidad el carrete. */
const ESCALONES_DE_INERCIA = 6;

const relojes = new WeakMap<SVGSVGElement, number>();

function duracion(token: string): number {
  const crudo = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const n = parseFloat(crudo);
  if (!Number.isFinite(n)) return 0;
  return crudo.endsWith('ms') ? n : n * 1000;
}

function giros(casete: SVGSVGElement): Animation[] {
  return [...casete.querySelectorAll('.casete-carrete')].flatMap((c) => c.getAnimations?.() ?? []);
}

function cortarReloj(casete: SVGSVGElement): void {
  const previo = relojes.get(casete);
  if (previo !== undefined) window.clearInterval(previo);
  relojes.delete(casete);
}

/**
 * Lleva la velocidad de los carretes de `desde` a `hasta` en `ms`, y avisa al llegar.
 * La velocidad es la de la animacion: 1 es la de tocar, 0 es quieto, negativo es para atras.
 */
function llevarVelocidad(casete: SVGSVGElement, desde: number, hasta: number, ms: number, alLlegar?: () => void): void {
  cortarReloj(casete);
  const poner = (v: number): void => {
    for (const g of giros(casete)) g.playbackRate = v;
  };
  if (ms <= 0) {
    poner(hasta);
    alLlegar?.();
    return;
  }
  let escalon = 0;
  poner(desde);
  const reloj = window.setInterval(() => {
    escalon += 1;
    const f = escalon / ESCALONES_DE_INERCIA;
    // Parejo: a este tamano, una frenada que pierde casi todo en el primer escalon no se ve.
    const suave = f;
    poner(desde + (hasta - desde) * suave);
    if (escalon >= ESCALONES_DE_INERCIA) {
      cortarReloj(casete);
      alLlegar?.();
    }
  }, ms / ESCALONES_DE_INERCIA);
  relojes.set(casete, reloj);
}

/** La cinta arranca: el carrete toma velocidad. */
export function correrCasete(casete: SVGSVGElement): void {
  casete.classList.add('casete-vivo--girando');
  llevarVelocidad(casete, 0.25, 1, duracion('--duracion-inercia'));
}

/** La cinta para: el carrete sigue un poco por inercia y se detiene. */
export function frenarCasete(casete: SVGSVGElement): void {
  if (!casete.classList.contains('casete-vivo--girando')) return;
  const actual = giros(casete)[0]?.playbackRate ?? 1;
  // Llega casi a cero y ahi se pausa, sin tocar mas la velocidad: asi el carrete queda en el
  // angulo donde freno. La proxima vez que corra, `correrCasete` le pone la velocidad de nuevo.
  llevarVelocidad(casete, Math.abs(actual), 0.06, duracion('--duracion-inercia'), () => {
    casete.classList.remove('casete-vivo--girando');
  });
}

/** Tema nuevo: los carretes giran para atras, rapido, y la cinta vuelve a la izquierda. */
export function rebobinarCasete(casete: SVGSVGElement): void {
  const ms = duracion('--duracion-umbral');
  ponerAvance(casete, 0);
  if (ms <= 0) return;
  casete.classList.add('casete-vivo--girando', 'casete-vivo--rebobina');
  llevarVelocidad(casete, -5, -1, ms, () => {
    casete.classList.remove('casete-vivo--girando', 'casete-vivo--rebobina');
  });
}

/** Cuanta cinta paso al carrete de la derecha, de 0 a 1. El dibujo lo lee de `--avance`. */
export function ponerAvance(casete: SVGSVGElement, fraccion: number): void {
  casete.style.setProperty('--avance', String(Math.min(Math.max(fraccion, 0), 1)));
}
