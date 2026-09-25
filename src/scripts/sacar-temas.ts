/**
 * Lo que comparten los dos juegos de sacar temas: "Adiviná el tema" (`US-02`) y "Sacalo por
 * la letra" (`US-07`).
 *
 * Los dos se juegan igual —una escalera que se gasta errando, un buscador sobre los 105
 * títulos, una revelación y un resultado tema por tema— y hasta el ciclo del pulido de arte
 * (2026-09-25) cada uno tenía su copia de lo común, o directamente no lo tenía: la tapa
 * impresa por pasadas, el crédito de esas tapas, la columna que se acomoda arriba del
 * teclado y la escalerita del resultado vivían solo en el juego de audio. Acá se escriben
 * una vez y los dos las usan. El buscador ya estaba compartido (`lib/tema/buscador.ts`);
 * esto es lo mismo, del lado del DOM.
 *
 * **Nada se escribe con `innerHTML`**, igual que en las islas: todo con `createElement` y
 * `textContent`. Los textos salen de `lib/tema/copy.ts`, que es donde nacieron y donde los
 * audita `voz.test.ts`.
 */

import { estampaDe } from '../lib/tapa/pasadas.ts';
import { REVELACION } from '../lib/tema/copy.ts';
import { PORTAL } from '../lib/sitio/copy.ts';

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  clase?: string,
  texto?: string,
): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (clase) n.className = clase;
  if (texto !== undefined) n.textContent = texto;
  return n;
}

/** Lo que la estampa necesita saber de un tema: de qué disco es y en qué pista. */
export interface DiscoDelTema {
  readonly disco: string;
  readonly discoTitulo: string;
  readonly pista: number;
}

// ---------------------------------------------------------------- la estampa

/**
 * La estampa: la tapa del tema revelado, impresa por pasadas sobre papel (`UX-22`, `T-200`).
 *
 * Tres `<img>` con alfa —las separaciones de `scripts/generar-pasadas.mjs`, tenidas con
 * los colores medidos de esa tapa (`RES-37`)— y la foto que se fija encima. El orden es el
 * de una serigrafia (`RES-54`): clara, media, clave. Al fallar, la clave sola: te la
 * dejamos en una tinta. Todo el movimiento lo pone `juego.css` desde tokens; aca solo se
 * arma el objeto.
 *
 * Es un objeto: se da vuelta (`T-203`). La trasera real no se baja hasta que alguien la
 * pide con el dedo. El credito lo lleva el pie de la pantalla (`acreditarTapas`), que es
 * la condicion 1 de `D-21`: **quien llama a esto tiene que acreditar el disco**.
 *
 * Devuelve `null` si el disco no tiene estampa —no es uno de los diez—: la revelacion
 * queda como era, sin hueco.
 */
export function armarEstampa(tema: DiscoDelTema, acerto: boolean): HTMLElement | null {
  const e = estampaDe(tema.disco);
  if (!e) return null;

  // Sin modificador por fallo: `estampa--clave` se creaba y **ninguna hoja la pintaba**
  // (lo encontro la red derivada de `estilos.test.ts`). Lo que de verdad distingue fallar
  // de acertar son las capas de abajo: con acierto entran las tres tintas y la foto, sin
  // acierto entra sola la clave.
  const figura = el('figure', 'estampa');

  const papel = el('span', 'estampa-papel');
  const capas: Array<[nombre: string, ruta: string]> = acerto
    ? [['clara', e.pasadas[0]], ['media', e.pasadas[1]], ['clave', e.pasadas[2]]]
    : [['clave', e.pasadas[2]]];
  for (const [nombre, ruta] of capas) {
    const tinta = el('img', `pasada pasada--${nombre}`);
    tinta.src = ruta;
    tinta.decoding = 'async';
    // Las tintas son partes de una sola imagen: la que habla es la foto, o la clave sola.
    tinta.alt = !acerto && nombre === 'clave' ? REVELACION.altTapaClave(tema.discoTitulo) : '';
    papel.append(tinta);
  }
  if (acerto) {
    const foto = el('img', 'estampa-foto');
    foto.src = e.ficha;
    foto.decoding = 'async';
    foto.alt = REVELACION.altTapa(tema.discoTitulo);
    papel.append(foto);
  }

  const frente = el('span', 'estampa-frente');
  frente.append(papel);

  // El dorso nace con el sello de la pista y SIN la imagen: la trasera no se baja hasta
  // que alguien la pide con el dedo (`ADR-05.6`). Quien nunca da vuelta la tapa no baja
  // un byte de las diez traseras.
  const dorso = el('span', 'estampa-dorso');
  dorso.append(el('span', 'sello-pista', REVELACION.pista(tema.pista)));

  // Un boton con `aria-pressed` (`UX-22` §5): apretado es "mostrando el dorso". El nombre
  // accesible y el rotulo a la vista dicen lo mismo, y los dos salen del copy.
  const hoja = el('button', 'estampa-hoja');
  hoja.type = 'button';
  hoja.dataset.cara = 'frente';
  hoja.setAttribute('aria-pressed', 'false');
  hoja.setAttribute('aria-label', REVELACION.girar);
  hoja.append(frente, dorso);
  figura.append(hoja);
  const girar = el('span', 'estampa-girar', REVELACION.girar);
  girar.setAttribute('aria-hidden', 'true');
  figura.append(girar);
  hoja.addEventListener('click', () => darVuelta(hoja, dorso, girar, e.trasera, tema.discoTitulo));

  // El pie nombra el disco en su letra.
  const pie = el('figcaption', 'estampa-pie');
  pie.append(el('span', `estampa-disco${e.letra ? ` estampa-disco--${e.letra}` : ''}`, e.nombreEstampado));
  figura.append(pie);

  return figura;
}

/** Da vuelta la estampa. La trasera se crea, y se baja, recien la primera vez que alguien la pide. */
function darVuelta(hoja: HTMLButtonElement, dorso: HTMLElement, girar: HTMLElement, ruta: string, disco: string): void {
  const alDorso = hoja.dataset.cara !== 'dorso';
  if (alDorso && !dorso.querySelector('.estampa-trasera')) {
    const trasera = el('img', 'estampa-trasera');
    trasera.alt = REVELACION.altTrasera(disco);
    trasera.decoding = 'async';
    trasera.src = ruta;
    dorso.prepend(trasera);
  }
  hoja.dataset.cara = alDorso ? 'dorso' : 'frente';
  hoja.setAttribute('aria-pressed', String(alDorso));
  hoja.setAttribute('aria-label', alDorso ? REVELACION.volverATapa : REVELACION.girar);
  girar.textContent = alDorso ? REVELACION.volverATapa : REVELACION.girar;
}

/**
 * La estampa chica del resultado (`UX-22` §10, `T-205`): la tirada como afiche.
 *
 * Cada tema de la vuelta lleva su tapa del tamano de un sello — a color si lo sacaste, en
 * la tinta de la clave si no, que es la misma diferencia que hace la revelacion. Son los
 * archivos que la revelacion ya bajo, a 32 px: cero archivos nuevos.
 *
 * **No se anima**, y es a proposito: un afiche se pega en la pared, no se imprime delante
 * tuyo. El grito es el acierto (`D-33`), y ya paso. Va escondida del lector de pantalla: el
 * simbolo ✔/✕ y el pie de la fila ya dicen todo lo que dice.
 */
export function armarEstampita(disco: string, acerto: boolean): HTMLElement | null {
  const e = estampaDe(disco);
  if (!e) return null;
  const caja = el('span', 'estampita');
  caja.setAttribute('aria-hidden', 'true');
  const img = el('img', acerto ? 'estampita-foto' : 'estampita-tinta');
  img.src = acerto ? e.ficha : e.pasadas[2];
  img.alt = '';
  img.loading = 'lazy';
  img.decoding = 'async';
  caja.append(img);
  return caja;
}

// ---------------------------------------------------------------- el credito de las tapas

/**
 * Los discos que se vieron en esta pantalla durante la sesion (`UX-22` §2.5, `D-21`).
 *
 * **Acumula y no saca.** El pie tiene que nombrar cada tapa que estuvo en pantalla,
 * deduplicada, y no solo la del cuadro actual: era `FIND-46` de `REV-11`.
 */
const tapasDeLaSesion = new Set<string>();
/** Si ya se sembro el conjunto con las tapas que la pagina traia escritas en build. */
let tapasSembradas = false;

/**
 * El credito del pie nombra las tapas que se ven en la pantalla (`D-21`, condicion 1).
 *
 * Arranca con las que la pagina trae escritas (`data-tapas`) y le suma las que la isla pone
 * en tiempo de ejecucion: la estampa de la revelacion, la sala que se vuelve el disco, las
 * estampitas del resultado. Una sola vez por disco, aunque aparezca en los tres lugares.
 * Llamarla con una lista vacia no borra nada: vuelve a escribir lo acumulado.
 */
export function acreditarTapas(discos: readonly string[]): void {
  // Las paginas con `Base.astro` lo llaman `.credito-pantalla`; las que arman su pie a
  // mano, `.credito-tapas`. Los dos llevan `data-tapas` con la lista con la que arrancan.
  const credito = document.querySelector<HTMLElement>('.credito-tapas, .credito-pantalla');
  if (!credito) return;
  if (!tapasSembradas) {
    try {
      for (const t of JSON.parse(credito.dataset.tapas ?? '[]') as string[]) tapasDeLaSesion.add(t);
    } catch {
      // Un `data-tapas` roto no puede dejar la pantalla sin credito: se sigue con lo que venga.
    }
    tapasSembradas = true;
  }
  for (const d of discos) if (d) tapasDeLaSesion.add(d);
  if (tapasDeLaSesion.size > 0) credito.textContent = PORTAL.creditoTapas([...tapasDeLaSesion]);
}

// ---------------------------------------------------------------- la vuelta y el resultado

/**
 * Las casillas de la vuelta, en la cabecera de la partida: una por tema.
 *
 * La fila de vidas de un fichin, dicha en sellos: cuantos temas tiene la vuelta, en cual
 * estas, y como salieron los que ya pasaron. Va escondida del lector de pantalla: el texto
 * de al lado ("Tema 2 de 4") dice lo mismo.
 */
export function armarCasillas(cuantas: number): HTMLOListElement {
  const casillas = el('ol', 'vuelta-casillas');
  casillas.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < cuantas; i++) casillas.append(el('li', 'vuelta-casilla'));
  return casillas;
}

/** Pinta las casillas: las que ya pasaron dicen como salieron, y una es la que va. */
export function pintarCasillas(casillas: HTMLElement, salieron: readonly boolean[], actual: number): void {
  [...casillas.children].forEach((casilla, i) => {
    casilla.className = 'vuelta-casilla';
    if (i < salieron.length) {
      casilla.classList.add(salieron[i] ? 'vuelta-casilla--ok' : 'vuelta-casilla--no');
    } else if (i === actual) {
      casilla.classList.add('vuelta-casilla--actual');
    }
  });
}

/** Lo que se hizo con un intento gastado antes de cerrar el tema. */
export type Gastado = 'fallo' | 'paso';

/**
 * La escalerita de un tema del resultado: los escalones, con lo que paso en cada uno.
 *
 * Es la forma de la vuelta que el juego de referencia comparte como una fila de cuadrados,
 * dibujada en el idioma de este sitio: casillas de sello, **distintas por forma y no solo
 * por tinta** (`UX-01`) — tachada si erraste, con una raya si pasaste, llena si la sacaste
 * ahi, vacia si no llegaste a usarla. De un vistazo se ve si la sacaste de una o en la
 * ultima. Va escondida del lector de pantalla: el pie de la fila ya lo dice con palabras.
 */
export function armarEscalerita(gastados: readonly Gastado[], acerto: boolean, escalones: number): HTMLElement {
  const caja = el('span', 'escalerita');
  caja.setAttribute('aria-hidden', 'true');
  for (let n = 0; n < escalones; n++) {
    const celda = el('span', 'escalerita-paso');
    if (n < gastados.length) {
      celda.classList.add(gastados[n] === 'fallo' ? 'escalerita-paso--fallo' : 'escalerita-paso--pasado');
    } else if (acerto && n === gastados.length) {
      celda.classList.add('escalerita-paso--acierto');
    }
    caja.append(celda);
  }
  return caja;
}

/**
 * El acierto se siente en la mano: un toque corto, uno solo.
 *
 * Es el mismo grito de `D-33` dicho con el motor del telefono, y solo en el acierto —errar
 * no vibra, igual que errar no imprime a color—. Quien pidio menos movimiento no lo recibe;
 * donde no hay motor de vibracion (el iPhone, la compu) la llamada no existe y no pasa nada.
 */
export function vibrarAcierto(): void {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) navigator.vibrate?.(40);
}

// ---------------------------------------------------------------- el teclado

/** Lo que una isla necesita del modo teclado. */
export interface ModoTeclado {
  /** Si la partida esta armada arriba del teclado en este momento. */
  readonly activo: boolean;
  /** Engancha una caja de texto: al tomar el foco entra, al perderlo sale. */
  vigilar(caja: HTMLInputElement): void;
  /** Sale a mano. Hace falta cuando la caja desaparece con el foco adentro y no avisa. */
  salir(): void;
}

/**
 * Con el teclado abierto, la pantalla es otra (`partida--tecleando`).
 *
 * El problema, medido y no supuesto: en un telefono el teclado se come la mitad de abajo
 * de la pantalla, y **estas dos pantallas tienen todo lo que importa abajo**. Con el
 * teclado arriba quedaban tapados la caja y el boton, y la lista tapaba lo de arriba —en
 * "adivina el tema" la regla, en "sacalo por la letra" los versos que estas tratando de
 * reconocer—. Para arriesgar habia que cerrar el teclado, la pantalla saltaba, y habia que
 * buscar el boton de nuevo.
 *
 * Lo que hace, mientras la caja tiene el foco en un aparato tactil:
 *
 * 1. **La partida pasa a ocupar exactamente lo que queda visible** —la ventana visual, que
 *    el teclado achica— como columna pegada abajo. Cada juego decide en su CSS que queda en
 *    esa columna y que cede alto.
 * 2. **El teclado no se cierra al tocar un boton de la partida.** Se previene el `mousedown`
 *    —la accion por defecto que le saca el foco a la caja— y el `click` llega igual. Errar
 *    deja escribir de nuevo en el acto; acertar si lo cierra, porque ahi empieza el premio.
 *
 * En escritorio no pasa nada de esto: el foco en la caja no trae ningun teclado que tape.
 *
 * `alSalir` y `alMedir` son de cada juego: el de audio vuelve a mostrar la caja al salir, y
 * el de la letra vuelve a bajar la hoja al verso nuevo cada vez que la columna cambia de alto.
 */
export function modoTeclado(
  zona: HTMLElement,
  opciones: { alSalir?: () => void; alMedir?: () => void } = {},
): ModoTeclado {
  const conPulgar = window.matchMedia('(pointer: coarse)');
  let activo = false;

  // Copia la ventana visual en dos variables: son las que ubican la columna arriba del teclado.
  const medir = (): void => {
    const vv = window.visualViewport;
    if (!vv) return;
    zona.style.setProperty('--vv-arriba', `${vv.offsetTop}px`);
    zona.style.setProperty('--vv-alto', `${vv.height}px`);
    opciones.alMedir?.();
  };

  const entrar = (): void => {
    if (activo || !conPulgar.matches) return;
    activo = true;
    zona.classList.add('partida--tecleando');
    medir();
    window.visualViewport?.addEventListener('resize', medir);
    window.visualViewport?.addEventListener('scroll', medir);
  };

  const salir = (): void => {
    if (!activo) return;
    activo = false;
    zona.classList.remove('partida--tecleando');
    window.visualViewport?.removeEventListener('resize', medir);
    window.visualViewport?.removeEventListener('scroll', medir);
    opciones.alSalir?.();
  };

  zona.addEventListener('mousedown', (ev) => {
    if (!activo) return;
    const blanco = ev.target as HTMLElement | null;
    if (blanco?.closest('button, .sugerencias')) ev.preventDefault();
  });

  return {
    get activo() {
      return activo;
    },
    vigilar(caja) {
      caja.addEventListener('focus', entrar);
      caja.addEventListener('blur', salir);
    },
    salir,
  };
}
