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
 * Un carrete: el eje de plástico claro con sus tres rayos. Gira entero, como grupo, encima de
 * la cinta enrollada.
 *
 * Son tres rayos y no una cruz a proposito: una cruz se ve igual cada cuarto de vuelta, y a
 * la velocidad de la cinta parece quieta. Y uno de los tres es más largo: sin eso, tres rayos
 * parejos se ven iguales cada tercio de vuelta.
 */
function carrete(cx: number, cy: number): SVGGElement {
  const g = nodo('g', { class: 'casete-carrete' });
  const rayo = (grados: number, largo: number): string => {
    const a = (grados * Math.PI) / 180;
    return `M${cx} ${cy} L ${(cx + Math.cos(a) * largo).toFixed(1)} ${(cy + Math.sin(a) * largo).toFixed(1)}`;
  };
  g.append(
    nodo('circle', { class: 'casete-eje', cx: String(cx), cy: String(cy), r: '13' }),
    nodo('path', { class: 'casete-rayo', d: `${rayo(-90, 12)} ${rayo(30, 8)} ${rayo(150, 8)}` }),
    nodo('circle', { class: 'casete-buje', cx: String(cx), cy: String(cy), r: '3' }),
  );
  return g;
}

let serie = 0;

/**
 * El casete, listo para colgar del reproductor o de la portada.
 *
 * Desde la ronda 2 de la pulida (2026-11-18) **es un objeto y no un ícono de línea**: la
 * carcasa en tinta plana, la etiqueta de papel, la ventana, y adentro la cinta enrollada en
 * cada carrete —oscura sobre el papel de la ventana, para que se lea de lejos—, que se pasa de
 * uno al otro con el audio. Abajo, por la boca, se ve la cinta cruzando por el cabezal.
 *
 * Devuelve una caja con el dibujo y, encima de la etiqueta, el contador de tres ruedas
 * (`ponerContador`). Todo es decorativo para el lector de pantalla (`aria-hidden`): la
 * palabra de estado que lo acompaña y el renglón de "Tenés N s de audio" son los que se leen.
 */
export function armarCasete(): HTMLElement {
  const n = ++serie;
  const caja = document.createElement('span');
  caja.className = 'casete-vivo';
  caja.setAttribute('aria-hidden', 'true');

  const svg = nodo('svg', { viewBox: '0 0 240 152', class: 'casete-dibujo', focusable: 'false' });

  const VENTANA = 'M46 50 C 96 47, 146 48, 194 51 C 195 68, 195 88, 194 105 C 146 108, 96 107, 46 104 C 45 86, 45 68, 46 50 Z';
  const BOCA = 'M72 120 L 168 120 L 180 150 L 60 150 Z';

  const defs = nodo('defs', {});
  const recorteVentana = nodo('clipPath', { id: `casete-ventana-${n}` });
  recorteVentana.append(nodo('path', { d: VENTANA }));
  const recorteBoca = nodo('clipPath', { id: `casete-boca-${n}` });
  recorteBoca.append(nodo('path', { d: BOCA }));
  defs.append(recorteVentana, recorteBoca);

  // La cinta enrollada: se recorta contra la ventana, como en un casete de verdad, donde el
  // rollo lleno no entra entero en el vidrio.
  const rollos = nodo('g', { 'clip-path': `url(#casete-ventana-${n})` });
  rollos.append(
    nodo('circle', { class: 'casete-bobina casete-bobina--llena', cx: '84', cy: '77', r: '36' }),
    nodo('circle', { class: 'casete-bobina casete-bobina--vacia', cx: '156', cy: '77', r: '36' }),
  );

  // Lo que se ve por la boca: la cinta cruzando, con sus marcas, que corren mientras suena.
  const paso = nodo('g', { 'clip-path': `url(#casete-boca-${n})` });
  const marcas = nodo('g', { class: 'casete-pasa' });
  for (let x = 48; x <= 204; x += 12) {
    marcas.append(nodo('rect', { x: String(x), y: '134', width: '4', height: '7' }));
  }
  paso.append(nodo('rect', { class: 'casete-cinta', x: '56', y: '133', width: '128', height: '9' }), marcas);

  svg.append(
    defs,
    // La carcasa, apenas torcida: tinta plana.
    nodo('path', {
      class: 'casete-carcasa',
      d: 'M8 8 C 86 3, 158 5, 233 10 C 236 50, 235 104, 231 145 C 158 150, 82 148, 7 143 C 5 100, 6 50, 8 8 Z',
    }),
    // La etiqueta de papel, con dos renglones garabateados. Al revelar se tiñe con el disco.
    nodo('path', {
      class: 'casete-etiqueta',
      d: 'M24 18 C 88 15, 152 16, 217 20 C 218 28, 218 36, 217 43 C 152 45, 88 44, 24 41 C 23 34, 23 26, 24 18 Z',
    }),
    nodo('path', { class: 'casete-letra', d: 'M34 27 C 62 25, 92 25, 118 27 M34 35 C 54 34, 76 34, 96 35' }),
    // La ventana: papel claro, y adentro la cinta.
    nodo('path', { class: 'casete-ventana', d: VENTANA }),
    rollos,
    carrete(84, 77),
    carrete(156, 77),
    nodo('path', { class: 'casete-marco', d: VENTANA }),
    // La boca, con la cinta, el cabezal que sube a tocarla y los dos rodillos.
    nodo('path', { class: 'casete-boca', d: BOCA }),
    paso,
    nodo('rect', { class: 'casete-cabezal', x: '110', y: '122', width: '20', height: '10' }),
    nodo('circle', { class: 'casete-rodillo', cx: '84', cy: '128', r: '4.5' }),
    nodo('circle', { class: 'casete-rodillo', cx: '156', cy: '128', r: '4.5' }),
    // Los cuatro tornillos.
    nodo('circle', { class: 'casete-tornillo', cx: '20', cy: '58', r: '3.5' }),
    nodo('circle', { class: 'casete-tornillo', cx: '221', cy: '60', r: '3.5' }),
    nodo('circle', { class: 'casete-tornillo', cx: '22', cy: '132', r: '3.5' }),
    nodo('circle', { class: 'casete-tornillo', cx: '218', cy: '134', r: '3.5' }),
    // El piloto: un cuadrado que se llena mientras la cinta corre.
    nodo('rect', { class: 'casete-piloto', x: '196', y: '118', width: '15', height: '11' }),
  );
  caja.append(svg);

  // El contador mecanico, sobre la etiqueta: tres ruedas de cifras, y la coma antes de la ultima.
  const contador = document.createElement('span');
  contador.className = 'casete-contador';
  for (let r = 0; r < 3; r++) {
    if (r === 2) {
      const coma = document.createElement('span');
      coma.className = 'casete-coma';
      coma.textContent = ',';
      contador.append(coma);
    }
    const rueda = document.createElement('span');
    rueda.className = 'casete-rueda';
    const tira = document.createElement('span');
    tira.className = 'casete-cifras';
    for (let d = 0; d <= 9; d++) {
      const cifra = document.createElement('span');
      cifra.textContent = String(d);
      tira.append(cifra);
    }
    rueda.append(tira);
    contador.append(rueda);
  }
  caja.append(contador);
  return caja;
}

/**
 * Pone el contador en `segundos` (de 0 a 99,9): cada rueda gira hasta su cifra. Lo unico que
 * cambia es un `transform`; el giro lo hace una transicion de `juego.css`.
 */
export function ponerContador(casete: HTMLElement, segundos: number): void {
  const decimas = Math.min(Math.max(Math.round(segundos * 10), 0), 999);
  const cifras = [Math.floor(decimas / 100), Math.floor(decimas / 10) % 10, decimas % 10];
  casete.querySelectorAll<HTMLElement>('.casete-cifras').forEach((tira, i) => {
    const d = String(cifras[i] ?? 0);
    if (tira.style.getPropertyValue('--cifra') !== d) tira.style.setProperty('--cifra', d);
  });
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

const relojes = new WeakMap<HTMLElement, number>();

function duracion(token: string): number {
  const crudo = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const n = parseFloat(crudo);
  if (!Number.isFinite(n)) return 0;
  return crudo.endsWith('ms') ? n : n * 1000;
}

function giros(casete: HTMLElement): Animation[] {
  return [...casete.querySelectorAll('.casete-carrete')].flatMap((c) => c.getAnimations?.() ?? []);
}

function cortarReloj(casete: HTMLElement): void {
  const previo = relojes.get(casete);
  if (previo !== undefined) window.clearInterval(previo);
  relojes.delete(casete);
}

/**
 * Lleva la velocidad de los carretes de `desde` a `hasta` en `ms`, y avisa al llegar.
 * La velocidad es la de la animacion: 1 es la de tocar, 0 es quieto, negativo es para atras.
 */
function llevarVelocidad(casete: HTMLElement, desde: number, hasta: number, ms: number, alLlegar?: () => void): void {
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
export function correrCasete(casete: HTMLElement): void {
  // `--play` es la tecla apretada: el cabezal sube, el piloto se prende y la cinta corre por
  // la boca. Se suelta en el acto al frenar; el giro (`--girando`) sigue un momento mas.
  casete.classList.add('casete-vivo--girando', 'casete-vivo--play');
  llevarVelocidad(casete, 0.25, 1, duracion('--duracion-inercia'));
}

/** La cinta para: el carrete sigue un poco por inercia y se detiene. */
export function frenarCasete(casete: HTMLElement): void {
  casete.classList.remove('casete-vivo--play');
  if (!casete.classList.contains('casete-vivo--girando')) return;
  const actual = giros(casete)[0]?.playbackRate ?? 1;
  // Llega casi a cero y ahi se pausa, sin tocar mas la velocidad: asi el carrete queda en el
  // angulo donde freno. La proxima vez que corra, `correrCasete` le pone la velocidad de nuevo.
  llevarVelocidad(casete, Math.abs(actual), 0.06, duracion('--duracion-inercia'), () => {
    casete.classList.remove('casete-vivo--girando');
  });
}

/** Tema nuevo: los carretes giran para atras, rapido, y la cinta vuelve a la izquierda. */
export function rebobinarCasete(casete: HTMLElement): void {
  const ms = duracion('--duracion-umbral');
  ponerAvance(casete, 0);
  if (ms <= 0) return;
  casete.classList.add('casete-vivo--girando', 'casete-vivo--rebobina');
  llevarVelocidad(casete, -5, -1, ms, () => {
    casete.classList.remove('casete-vivo--girando', 'casete-vivo--rebobina');
  });
}

/** Cuanta cinta paso al carrete de la derecha, de 0 a 1. El dibujo lo lee de `--avance`. */
export function ponerAvance(casete: HTMLElement, fraccion: number): void {
  casete.style.setProperty('--avance', String(Math.min(Math.max(fraccion, 0), 1)));
}
