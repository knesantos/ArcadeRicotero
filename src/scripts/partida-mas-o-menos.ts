/**
 * La isla de "Más o menos" (`US-10`, `UX-34`).
 *
 * Tres pantallas: la entrada, la partida (pregunta → revelado → *Seguí*) y el resultado.
 * El motor vive en `lib/mas-o-menos/partida.ts` y se prueba en Node; acá solo se pinta.
 *
 * **Nada se escribe con `innerHTML`**, igual que en el resto de las islas: todo con
 * `createElement` y `textContent`. El nombre del desafío viene de la URL (`ADR-02`).
 *
 * ## Las fichas (ronda de pulida, 2026-11-20)
 *
 * El objeto es el de la acotación de la portada: *"Tenés una ficha boca abajo en la mano."*
 * Sobre la mesa hay dos fichas: **la tuya, boca abajo** (el número que hay que adivinar) y
 * **la que está a la vista** (la referencia). Responder es darla vuelta. La racha es **la
 * pila de las fichas que ganaste**, con su contador de ruedas, y la primera que errás la tira.
 *
 * **El número real sigue llegando de golpe** (`UX-34` §5, `RES-98`): está impreso en la cara
 * de la ficha y aparece entero cuando la ficha termina de darse vuelta. No hay contador que
 * suba hasta él. **El número real no está en el documento hasta que se responde**: la cara de
 * la ficha tapada se escribe recién al darla vuelta.
 *
 * La respuesta se cierra en dos tiempos, como en los otros juegos pulidos: primero la ficha
 * se da vuelta, las teclas dicen cuál era y cae el sello sobre la mesa; después llega la
 * ficha de la respuesta, con "Seguí" adentro. El segundo tiempo se adelanta con un toque o
 * con Enter o la barra (se escucha `click`, no `pointerdown`). Con movimiento reducido los
 * tiempos valen cero y todo aparece en su estado final.
 *
 * Se anuncia por una región viva que existe desde que carga la página (`#revelado`): una
 * región creada en el mismo momento que su texto no la lee nadie.
 */

import { armarLink, leerDesafio } from '../lib/desafio.ts';
import {
  nuevaPartida,
  responder,
  siguientePaso,
  tramoDeRacha,
  valorDeReferencia,
  type Dato,
  type Eleccion,
  type EstadoPartida,
  type Paso,
} from '../lib/mas-o-menos/partida.ts';
import { conUnidad, numeroEnPantalla } from '../lib/mas-o-menos/formato.ts';
import type { PozoDeLaIsla } from '../lib/mas-o-menos/datos.ts';
import {
  DETALLE_PALABRA,
  EN_VIVO,
  FAMILIAS,
  FICHAS,
  PANTALLA_0,
  PARTIDA,
  RESULTADO,
  TRAMOS,
  type RotuloBoton,
} from '../lib/mas-o-menos/copy.ts';
import { nombreArchivo } from '../lib/tarjeta/plan.ts';
import { despertarSalida } from '../lib/audio/contexto.ts';
import { sonarEfecto } from '../lib/audio/efectos.ts';
import { botonCompartir } from './compartir.ts';
import { dibujarFichas } from './tarjeta-fichas.ts';
import {
  armarContador,
  armarInterruptorDeRuidos,
  contar,
  duracionDe,
  estampar,
  golpear,
  rodarContador,
  volar,
  volarPieza,
} from './jugo.ts';

/** Quién soy, para `leerDesafio` (`FIND-28`) y para el enlace que se comparte. */
const JUEGO = 'mas-o-menos';
/** La mejor racha del aparato (`D-48` punto 7). */
const CLAVE_MEJOR = 'arcade.mas-o-menos.mejor';
/** Cuántas fichas entran en un montón de la pila, y cuántas se dibujan como mucho. */
const POR_MONTON = 5;
const TOPE_PILA = 40;
/** En la cabecera entran menos: cinco montones. Lo demás lo dice el contador. */
const TOPE_CABECERA = 25;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const inicio = $('inicio');
const zonaPartida = $('partida');
const zonaPregunta = $('pregunta');
const zonaRevelado = $('revelado');
const zonaResultado = $('resultado');

const isla: PozoDeLaIsla = JSON.parse($('pozo').textContent ?? '{}');
const pozo: readonly Dato[] = isla.datos ?? [];

let estado: EstadoPartida = nuevaPartida(pozo);
let paso: Paso | null = null;
/** La mejor racha del aparato al arrancar esta partida: contra esa se mide la hazaña. */
let mejorAlEmpezar = 0;
/** Si el último gesto fue con el dedo o el mouse: el foco que pone la isla no dibuja anillo. */
let conPuntero = false;

// Las piezas de la cabecera, que viven toda la partida.
let tableroEl: HTMLElement | null = null;
let contadorEl: HTMLElement | null = null;
let rachaLeidaEl: HTMLElement | null = null;
let pilaEl: HTMLElement | null = null;
let mejorEl: HTMLElement | null = null;
// Las piezas del paso.
let mesaEl: HTMLElement | null = null;
let fichaTuyaEl: HTMLElement | null = null;
let listaEl: HTMLElement | null = null;

// La tarjeta de la partida: se dibuja una vez, mientras se lee la ficha que cortó la racha.
let tarjetaDeLaPartida: Promise<Blob | null> | null = null;
let archivoDeLaTarjeta: File | null = null;
let urlDeLaTarjeta = '';

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

/** Una pieza que es dibujo: la vista la ve y el lector de pantalla no la lee. */
function dibujo<K extends keyof HTMLElementTagNameMap>(tag: K, clase: string, texto?: string): HTMLElementTagNameMap[K] {
  const n = el(tag, clase, texto);
  n.setAttribute('aria-hidden', 'true');
  return n;
}

function mostrar(seccion: HTMLElement): void {
  for (const s of [inicio, zonaPartida, zonaResultado]) s.hidden = s !== seccion;
}

function enfocar(destino: HTMLElement): void {
  destino.tabIndex = -1;
  destino.focus({ preventScroll: true });
}

/** La mejor racha guardada. Sin almacenamiento (ventana privada) es cero, y se juega igual. */
function leerMejor(): number {
  try {
    const n = Number(localStorage.getItem(CLAVE_MEJOR));
    return Number.isInteger(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function guardarMejor(n: number): void {
  try {
    localStorage.setItem(CLAVE_MEJOR, String(n));
  } catch {
    /* sin almacenamiento no hay récord, y no pasa nada */
  }
}

/** "2026-09-24" → "24-09-2026", como la fecha de consulta en el resto del sitio. */
function diaMesAnio(iso: string): string {
  const [a, m, d] = iso.split('-');
  return a && m && d ? `${d}-${m}-${a}` : iso;
}

/** El número tal como se lee, con su unidad: "12 años", "5:34", "1986". */
function comoSeLee(valor: number, dato: Dato): string {
  return conUnidad(valor, dato.escala, dato.unidad);
}

/** La palabra de la tecla que era: "Más", "Menos", "Antes", "Después". */
function rotuloDe(eleccion: Eleccion, dato: Dato): RotuloBoton {
  if (dato.escala === 'anio') return eleccion === 'mas' ? PARTIDA.despues : PARTIDA.antes;
  return eleccion === 'mas' ? PARTIDA.mas : PARTIDA.menos;
}

/* ------------------------------------------------------------------ las fichas */

/**
 * La cara de una ficha: de quién es el número, el número grande y su unidad. El número y la
 * unidad son los de `formato.ts`, partidos en dos renglones; juntos se leen igual que
 * `conUnidad` ("13 temas").
 */
function escribirCara(cara: HTMLElement, valor: number, dato: Dato, sujeto?: string): void {
  cara.replaceChildren();
  if (sujeto) cara.append(el('span', 'ficha-mm-sujeto', `«${sujeto}»`));
  const numero = numeroEnPantalla(valor, dato.escala);
  const cifra = el('span', 'ficha-mm-numero', numero);
  // Cuántas letras tiene el número: la hoja le da el cuerpo que entra en la ficha.
  cifra.style.setProperty('--largo', String(Math.max(2, numero.length)));
  cara.append(cifra);
  const entero = comoSeLee(valor, dato);
  const unidad = entero.slice(numero.length).trim();
  if (unidad) cara.append(el('span', 'ficha-mm-unidad', unidad));
}

/** Una ficha boca arriba, con su número a la vista. */
function fichaALaVista(valor: number, dato: Dato, sujeto: string | undefined, clase: string): HTMLElement {
  const ficha = el('div', `ficha-mm ${clase}`);
  const cara = el('p', 'ficha-mm-cara');
  escribirCara(cara, valor, dato, sujeto);
  ficha.append(cara);
  return ficha;
}

/**
 * Una ficha boca abajo: el dorso, con su trama y la medalla de la marca del fichín (dibujo de
 * la hoja). La cara está vacía hasta que se da vuelta.
 */
function fichaTapada(sujeto: string | undefined, clase: string): HTMLElement {
  const ficha = el('div', `ficha-mm ficha-mm--tapada ${clase}`);
  const cara = el('p', 'ficha-mm-cara');
  const dorso = el('p', 'ficha-mm-dorso');
  if (sujeto) dorso.append(el('span', 'ficha-mm-sujeto', `«${sujeto}»`));
  dorso.prepend(dibujo('span', 'ficha-mm-trama'));
  dorso.append(dibujo('span', 'ficha-mm-medalla'), el('span', 'solo-lector', FICHAS.tapada));
  ficha.append(cara, dorso);
  return ficha;
}

/** Da vuelta una ficha tapada: escribe su cara y la gira, en saltos. Es dibujo y es dato. */
function darVuelta(ficha: HTMLElement, valor: number, dato: Dato): void {
  const cara = ficha.querySelector<HTMLElement>('.ficha-mm-cara');
  if (!cara || !ficha.classList.contains('ficha-mm--tapada')) return;
  escribirCara(cara, valor, dato, dato.sujeto);
  ficha.querySelector('.ficha-mm-dorso')?.setAttribute('aria-hidden', 'true');
  ficha.classList.remove('ficha-mm--tapada', 'jugo-pega');
  void ficha.offsetWidth;
  ficha.classList.add('ficha-mm--dada-vuelta');
}

/**
 * La mesa: la ficha tuya a la izquierda, la que está a la vista a la derecha y, entre las dos,
 * el lugar del signo que las compara. `revelada` la arma ya dada vuelta (el resultado).
 */
function armarMesa(p: Paso, revelada: boolean): { mesa: HTMLElement; tuya: HTMLElement } {
  const { dato, referencia } = p;
  const mesa = el('div', 'mesa');
  mesa.append(el('span', 'categoria mesa-familia', FAMILIAS[dato.familia]));

  const tuya = revelada
    ? fichaALaVista(dato.valor, dato, dato.sujeto, 'ficha-mm--tuya')
    : fichaTapada(dato.sujeto, 'ficha-mm--tuya');
  const sujetoRef = referencia.clase === 'par' ? referencia.dato.sujeto : undefined;
  const vista = fichaALaVista(valorDeReferencia(referencia), dato, sujetoRef, 'ficha-mm--vista');
  const signo = dibujo('span', 'mesa-signo');
  if (revelada) ponerElSigno(signo, p);
  mesa.append(tuya, signo, vista);
  return { mesa, tuya };
}

/**
 * Lo que compara las dos fichas, estampado entre ellas: el símbolo grande (tu ficha es mayor,
 * `>`, o menor, `<`, que la otra) y debajo las palabras ("más que", "antes de"). Es dibujo: lo
 * mismo lo dicen las teclas y la ficha de la respuesta.
 */
function ponerElSigno(signo: Element | null | undefined, p: Paso): void {
  if (!signo || signo.classList.contains('mesa-signo--puesto')) return;
  const palabras = PARTIDA.nombreBoton(rotuloDe(p.correcta, p.dato), '').trim();
  signo.replaceChildren(
    el('span', 'mesa-signo-simbolo', p.correcta === 'mas' ? '>' : '<'),
    el('span', 'mesa-signo-palabras', palabras),
  );
  signo.classList.add('mesa-signo--puesto');
}

/**
 * La línea de setlist.fm de la referencia (`RNF-CTR-19-A`, la enmienda de `BR-18` (b)): un
 * número de setlist.fm lleva su fuente y su fecha también antes de responder. El enlace va
 * recién en el revelado.
 */
function lineaDeSetlist(p: Paso): HTMLElement | null {
  if (p.referencia.clase === 'par' && p.referencia.dato.familia === 'en-vivo' && isla.enVivo) {
    return el('p', 'masomenos-sujeto mesa-nota', EN_VIVO.enCaja(diaMesAnio(isla.enVivo.consultado)));
  }
  return null;
}

/* ------------------------------------------------------------------ la cabecera */

const ruedasPara = (n: number): number => Math.max(2, String(n).length);

/** La cabecera de la partida: el contador de la racha, la pila de fichas ganadas y los ruidos. */
function armarTablero(): void {
  tableroEl?.remove();
  tableroEl = el('div', 'tablero-fichas');

  const cuenta = el('p', 'racha-cuenta');
  contadorEl = armarContador(0, 2);
  rachaLeidaEl = el('span', 'solo-lector', PARTIDA.racha(0));
  cuenta.append(dibujo('span', 'racha-rotulo', FICHAS.racha), contadorEl, rachaLeidaEl);

  pilaEl = el('div', 'apilada');
  pilaEl.setAttribute('role', 'img');

  // La mejor racha de este aparato: la marca a pasar. Sin ninguna guardada, no hay chapa.
  mejorEl = el('span', 'mejor-chapa', FICHAS.mejorCorta(mejorAlEmpezar));
  mejorEl.hidden = mejorAlEmpezar <= 0;

  const ruidos = armarInterruptorDeRuidos({ apagar: FICHAS.ruidosTecla, prender: FICHAS.ruidosTecla });
  ruidos.classList.add('ruidos-tecla');
  const lado = el('div', 'tablero-fichas-lado');
  lado.append(ruidos, mejorEl);

  tableroEl.append(cuenta, pilaEl, lado);
  zonaPartida.prepend(tableroEl);
  pintarPila(pilaEl, 0, false, TOPE_CABECERA);
}

/**
 * La pila: un canto por ficha ganada, en montones de cinco. Pasado el tope se dibujan las del
 * tope y lo demás lo dice el contador, que es el dato.
 */
function pintarPila(pila: HTMLElement | null, n: number, llegaUna: boolean, tope = TOPE_PILA): void {
  if (!pila) return;
  const dibujadas = Math.min(n, tope);
  pila.replaceChildren();
  pila.setAttribute('aria-label', FICHAS.pila(n));
  pila.classList.toggle('apilada--vacia', n === 0);
  let monton: HTMLElement | null = null;
  for (let i = 0; i < dibujadas; i++) {
    if (i % POR_MONTON === 0) {
      monton = el('span', 'apilada-monton');
      pila.append(monton);
    }
    const canto = el('span', 'apilada-ficha');
    if (llegaUna && i === dibujadas - 1 && n <= tope) canto.classList.add('apilada-ficha--llega');
    monton!.append(canto);
  }
}

/** Pone el contador en la racha. `rueda` lo hace girar; si no, queda puesto. */
function ponerLaRacha(rueda: boolean): void {
  if (!tableroEl) return;
  const n = estado.racha;
  if (contadorEl && rueda && contadorEl.childElementCount === ruedasPara(n)) {
    rodarContador(contadorEl, n);
    estampar(contadorEl.parentElement);
  } else if (contadorEl) {
    // Sin giro, o con una rueda más (de 99 a 100): el contador se arma de nuevo, ya puesto.
    const nuevo = armarContador(n, ruedasPara(n));
    contadorEl.replaceWith(nuevo);
    contadorEl = nuevo;
  }
  if (rachaLeidaEl) rachaLeidaEl.textContent = PARTIDA.racha(n);
}

/**
 * La hazaña en curso: la racha pasó a la mejor que había en el aparato. La chapa de la
 * cabecera pasa al oro —el del destaque, no el verde del acierto: es una marca, no una
 * respuesta— y desde ahí va diciendo la racha, que es la mejor nueva. La primera vez, además,
 * cae un sello grande en el paño de arriba de la mesa, y al rato queda solo la chapa.
 */
function anotarHazana(): void {
  if (!mejorEl || mejorAlEmpezar <= 0 || estado.racha <= mejorAlEmpezar) return;
  const texto = FICHAS.mejorCorta(estado.racha);
  if (mejorEl.textContent === texto && mejorEl.classList.contains('mejor-chapa--pasada')) return;
  mejorEl.textContent = texto;
  mejorEl.classList.add('mejor-chapa--pasada');
  estampar(mejorEl);
  const mesa = mesaEl;
  if (estado.racha !== mejorAlEmpezar + 1 || !mesa?.isConnected || mesa.querySelector('.hazana-cae')) return;
  // El sello cae en el paño de arriba, que la mesa le reservó al llegar la respuesta
  // (`mesa--con-hazana`): no pisa las fichas, los números ni el signo. Al rato se va y queda la
  // marca chica, que es la chapa en oro. Con movimiento reducido se queda hasta la pregunta
  // que sigue.
  mesa.classList.add('mesa--con-hazana');
  const sello = el('span', 'hazana-cae', FICHAS.hazana);
  mesa.append(sello);
  sonarEfecto('sello');
  const rato = duracionDe('--duracion-inercia') * 2;
  if (rato > 0) {
    window.setTimeout(() => {
      sello.remove();
      if (mejorEl?.isConnected) estampar(mejorEl);
    }, rato);
  }
}

/**
 * Se cortó la racha: la pila se viene abajo. Cada canto salta y cae hasta el pie de la mesa,
 * en saltos; son dibujo —el contador sigue diciendo hasta dónde llegaste— y con movimiento
 * reducido no hay caída: la pila queda vacía y la cabecera, de trazo cortado.
 */
function tirarLaPila(): void {
  tableroEl?.classList.add('tablero-fichas--cortada');
  const pila = pilaEl;
  if (!pila) return;
  const ms = duracionDe('--duracion-inercia');
  const cantos = [...pila.querySelectorAll<HTMLElement>('.apilada-ficha')];
  const piso = (mesaEl ?? zonaPartida).getBoundingClientRect().bottom;
  if (ms > 0) {
    cantos.forEach((canto, i) => {
      const r = canto.getBoundingClientRect();
      const suelta = dibujo('span', 'apilada-ficha apilada-ficha--suelta');
      if (typeof suelta.animate !== 'function') return;
      suelta.style.left = `${r.left}px`;
      suelta.style.top = `${r.top}px`;
      suelta.style.width = `${r.width}px`;
      document.body.append(suelta);
      const lado = i % 2 === 0 ? 1 : -1;
      const dx = lado * (18 + (i % 5) * 13) + 30;
      const dy = Math.max(90, piso - r.bottom - (i % 3) * 14);
      const caida = suelta.animate(
        [
          { transform: 'translate(0, 0) rotate(0deg)', offset: 0 },
          { transform: `translate(${Math.round(dx * 0.4)}px, -18px) rotate(${lado * 50}deg)`, offset: 0.2 },
          { transform: `translate(${dx}px, ${Math.round(dy)}px) rotate(${lado * (140 + i * 23)}deg)`, offset: 1 },
        ],
        { duration: ms, delay: (cantos.length - 1 - i) * 22, easing: 'steps(12, end)', fill: 'both' },
      );
      const sacar = (): void => suelta.remove();
      caida.addEventListener('finish', sacar, { once: true });
      caida.addEventListener('cancel', sacar, { once: true });
    });
  }
  pintarPila(pila, 0, false, TOPE_CABECERA);
  pila.setAttribute('aria-label', FICHAS.pila(estado.racha));
}

/* ------------------------------------------------------------------ la portada */

// Si alguien llegó por un desafío, la bajada lo dice. `textContent`, nunca `innerHTML`: el
// nombre viene de la URL, que es la única superficie de entrada del sitio (`ADR-02`).
const desafio = leerDesafio(location.search, JUEGO);
if (desafio && desafio.forma !== 'identidad') {
  const bajada = document.getElementById('subtitulo');
  if (bajada) bajada.textContent = PANTALLA_0.desafio(desafio.puntaje, desafio.total, desafio.nombre);
}

// El interruptor de los ruidos, debajo del botón (como en los otros juegos).
document
  .getElementById('ruidos')
  ?.append(armarInterruptorDeRuidos({ apagar: FICHAS.ruidosApagar, prender: FICHAS.ruidosPrender }));

/** La mejor racha del aparato, en la portada: la pila que dejaste y la línea que la nombra. */
function pintarMejorDeLaPortada(): void {
  const caja = document.getElementById('mejor-portada');
  if (!caja) return;
  const mejor = leerMejor();
  caja.hidden = mejor <= 0;
  if (mejor <= 0) return;
  const pila = el('div', 'apilada apilada--portada');
  pila.setAttribute('role', 'img');
  pintarPila(pila, mejor, false);
  // La línea ya dice el número: la pila, acá, es dibujo.
  pila.removeAttribute('role');
  pila.removeAttribute('aria-label');
  pila.setAttribute('aria-hidden', 'true');
  caja.replaceChildren(pila, el('p', 'mejor-marca', RESULTADO.mejor(mejor)));
}
pintarMejorDeLaPortada();

/**
 * Tirar la ficha. Lo llaman "Jugá" y la ficha de la portada, que es el mismo gesto dicho con
 * el objeto: la ficha salta, da una vuelta entera en el aire —dorso, canto, cara, canto,
 * dorso— y cae boca abajo; ahí arranca la partida. Un segundo toque no espera. Con movimiento
 * reducido no hay tirada y la partida arranca en el acto.
 */
let tirando: (() => void) | null = null;

function tirarLaFicha(): void {
  if (tirando) {
    tirando();
    return;
  }
  // Este toque es el gesto que los celulares piden para dejar sonar algo.
  const despierta = despertarSalida();
  const ficha = document.getElementById('ficha-portada');
  const dorso = ficha?.querySelector<HTMLElement>('.ficha-mm-dorso');
  const ms = duracionDe('--duracion-golpe') * 1.4;
  if (!ficha || !dorso || ms <= 0 || typeof ficha.animate !== 'function') {
    void despierta.then(() => sonarEfecto('clac'));
    comenzar();
    return;
  }
  let entro = false;
  const entrar = (): void => {
    if (entro) return;
    entro = true;
    tirando = null;
    vuelta.cancel();
    cara.cancel();
    comenzar();
  };
  tirando = entrar;
  void despierta.then(() => sonarEfecto('tecla'));
  // Nueve poses, ocho saltos: la ficha sube, muestra el canto, la cara, el canto y vuelve.
  const anchos = [1, 0.55, 0.07, 0.55, 1, 0.55, 0.07, 0.55, 1];
  const altos = [0, -22, -40, -52, -56, -52, -40, -22, 0];
  const vuelta = ficha.animate(
    anchos.map((ancho, i) => ({ transform: `translate(0, ${altos[i]}px) scale(${ancho}, ${1 + (1 - ancho) * 0.08})` })),
    { duration: ms, easing: 'steps(8, end)' },
  );
  // El dorso se esconde mientras la ficha está del otro lado del canto, en los mismos saltos:
  // con una curva propia quedaba un cuadro a medio transparentar.
  const cara = dorso.animate(
    [1, 1, 1, 0, 0, 0, 1, 1, 1].map((opacity) => ({ opacity })),
    { duration: ms, easing: 'steps(8, end)' },
  );
  vuelta.addEventListener(
    'finish',
    () => {
      if (entro) return;
      sonarEfecto('clac');
      entrar();
    },
    { once: true },
  );
}

$('jugar').addEventListener('click', tirarLaFicha);
document.getElementById('ficha-portada')?.addEventListener('click', tirarLaFicha);

function comenzar(): void {
  estado = nuevaPartida(pozo);
  mejorAlEmpezar = leerMejor();
  tarjetaDeLaPartida = null;
  mostrar(zonaPartida);
  zonaPartida.classList.remove('partida--revelada', 'partida--apretada', 'partida--mesa-afuera');
  armarTablero();
  window.scrollTo({ top: 0 });
  pintarPaso();
}

/* ------------------------------------------------------------------ la partida */

function pintarPaso(): void {
  paso = siguientePaso(estado, Math.random);
  if (!paso) {
    pintarResultado(null);
    return;
  }
  const { dato, referencia } = paso;
  zonaPartida.classList.remove('partida--revelada', 'partida--apretada', 'partida--mesa-afuera');
  zonaPregunta.replaceChildren();
  zonaRevelado.replaceChildren();

  const enunciado = el('h2', 'enunciado', dato.pregunta);
  // El cuerpo de la pregunta depende de su largo (la hoja): una larga no empuja la mesa.
  enunciado.dataset.largo = dato.pregunta.length > 84 ? 'largo' : dato.pregunta.length > 46 ? 'medio' : 'corto';
  zonaPregunta.append(enunciado);

  // La mesa: las dos fichas se reparten, primero la que está a la vista y después la tuya.
  const { mesa, tuya } = armarMesa(paso, false);
  mesaEl = mesa;
  fichaTuyaEl = tuya;
  mesa.querySelectorAll<HTMLElement>('.ficha-mm').forEach((ficha) => {
    ficha.classList.add('jugo-pega');
    ficha.style.setProperty('--orden', ficha === tuya ? '2' : '0');
  });
  zonaPregunta.append(mesa);
  const nota = lineaDeSetlist(paso);
  if (nota) zonaPregunta.append(nota);

  // Las dos teclas. Para un año, "Antes" y "Después" (`D-48` punto 3), en ese orden.
  const textoRef = comoSeLee(valorDeReferencia(referencia), dato);
  const esAnio = dato.escala === 'anio';
  const botones: readonly [Eleccion, RotuloBoton][] = esAnio
    ? [
        ['menos', PARTIDA.antes],
        ['mas', PARTIDA.despues],
      ]
    : [
        ['mas', PARTIDA.mas],
        ['menos', PARTIDA.menos],
      ];
  const lista = el('ul', 'masomenos-opciones');
  for (const [eleccion, rotulo] of botones) {
    const li = el('li');
    const b = el('button', 'opcion');
    b.type = 'button';
    b.dataset.eleccion = eleccion;
    // La flecha del teclado que la aprieta: se ve solo donde hay puntero fino (la hoja).
    b.append(dibujo('span', 'opcion-flecha', lista.childElementCount === 0 ? '←' : '→'), rotulo);
    b.setAttribute('aria-label', PARTIDA.nombreBoton(rotulo, textoRef));
    b.addEventListener('pointerdown', () => {
      conPuntero = true;
    });
    b.addEventListener('keydown', () => {
      conPuntero = false;
    });
    b.addEventListener('click', () => elegir(eleccion), { once: true });
    li.append(b);
    lista.append(li);
  }
  listaEl = lista;
  zonaPregunta.append(lista);
  enfocar(enunciado);
}

/*
 * Las teclas del teclado: ← y → aprietan la tecla de ese lado; ↑ es "más" (o "después") y ↓ es
 * "menos" (o "antes"). Solo mientras la pregunta espera respuesta.
 */
document.addEventListener('keydown', (ev) => {
  if (zonaPartida.hidden || !listaEl?.isConnected || listaEl.dataset.respondida === 'si') return;
  if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
  const teclas = [...listaEl.querySelectorAll<HTMLButtonElement>('.opcion')];
  const tecla =
    ev.key === 'ArrowLeft'
      ? teclas[0]
      : ev.key === 'ArrowRight'
        ? teclas[1]
        : ev.key === 'ArrowUp'
          ? teclas.find((t) => t.dataset.eleccion === 'mas')
          : ev.key === 'ArrowDown'
            ? teclas.find((t) => t.dataset.eleccion === 'menos')
            : undefined;
  if (!tecla || tecla.disabled) return;
  ev.preventDefault();
  conPuntero = false;
  tecla.click();
});

/** El sello grande del cierre: cae al medio de la mesa, entre las dos fichas. Es dibujo. */
function sellarLaMesa(mesa: HTMLElement, acerto: boolean): void {
  mesa.append(dibujo('span', `sello-cae sello-cae--${acerto ? 'ok' : 'no'}`, acerto ? '✔︎' : '✕︎'));
}

/** Lo que queda del sello: la marca chica, en la esquina de la ficha que diste vuelta. */
function dejarLaMarca(mesa: HTMLElement, tuya: HTMLElement, acerto: boolean): void {
  for (const resto of mesa.querySelectorAll('.sello-cae')) resto.remove();
  if (tuya.querySelector('.sello-marca')) return;
  tuya.append(dibujo('span', `sello-marca sello-marca--${acerto ? 'ok' : 'no'}`, acerto ? '✔︎' : '✕︎'));
}

function elegir(eleccion: Eleccion): void {
  if (!paso || !mesaEl || !fichaTuyaEl || !listaEl) return;
  const p = paso;
  const mesa = mesaEl;
  const tuya = fichaTuyaEl;
  const lista = listaEl;
  if (lista.dataset.respondida === 'si') return;
  const acerto = responder(estado, p, eleccion);
  const vigente = (): boolean => paso === p && mesa.isConnected;

  // Primero se hunde la tecla que tocaste; cuál era lo dicen las dos cuando la ficha apoya.
  lista.dataset.respondida = 'si';
  for (const b of lista.querySelectorAll<HTMLButtonElement>('.opcion')) {
    b.disabled = true;
    if (b.dataset.eleccion === eleccion) b.classList.add('es-apretada');
  }
  // Los botones quedaron deshabilitados: el foco vuelve a la pregunta, no al `<body>`.
  const enunciado = zonaPregunta.querySelector<HTMLElement>('.enunciado');
  if (enunciado) enfocar(enunciado);

  /*
   * El primer tiempo, en el toque: la ficha se da vuelta. Cuando apoya (lo que dura la
   * vuelta), las teclas dicen cuál era, cae el sello sobre la mesa y, si erraste, la partida
   * da un golpe y la pila se viene abajo.
   */
  sonarEfecto('tecla');
  darVuelta(tuya, p.dato.valor, p.dato);

  let apoyo = false;
  let relojVuelta = 0;
  const apoyar = (): void => {
    if (apoyo) return;
    apoyo = true;
    window.clearTimeout(relojVuelta);
    if (!vigente()) return;
    for (const b of lista.querySelectorAll<HTMLButtonElement>('.opcion')) {
      if (b.dataset.eleccion === p.correcta) b.classList.add('es-correcta');
      else if (b.dataset.eleccion === eleccion) b.classList.add('es-elegida');
    }
    sellarLaMesa(mesa, acerto);
    if (acerto) {
      sonarEfecto('sello');
      try {
        navigator.vibrate?.(18);
      } catch {
        // Sin vibración: no pasa nada.
      }
    } else {
      golpear(zonaPartida);
      sonarEfecto('golpe');
      window.setTimeout(() => sonarEfecto('golpe'), 170);
      tirarLaPila();
      // La tarjeta se dibuja mientras se lee lo que te cortó: al resultado llega hecha.
      tarjetaDeLaPartida = dibujarLaTarjeta();
    }
  };

  /*
   * El segundo tiempo llega solo, y **se puede adelantar con un toque** en la partida (o con
   * Enter o la barra). Adelantar no saltea: la ficha de la respuesta se arma una sola vez.
   */
  let conFicha = false;
  let reloj = 0;
  const alTeclear = (ev: KeyboardEvent): void => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    conPuntero = false;
    mostrarLaFicha();
  };
  const alTocar = (): void => {
    conPuntero = true;
    mostrarLaFicha();
  };
  function mostrarLaFicha(): void {
    if (conFicha) return;
    conFicha = true;
    window.clearTimeout(reloj);
    zonaPartida.removeEventListener('click', alTocar);
    document.removeEventListener('keydown', alTeclear);
    apoyar();
    if (vigente()) pintarLaRespuesta(p, acerto, mesa, tuya, lista);
  }
  const vuelta = duracionDe('--duracion-umbral');
  const espera = vuelta + duracionDe('--duracion-pasada') + duracionDe('--duracion-paso');
  if (espera <= 0) {
    mostrarLaFicha();
    return;
  }
  relojVuelta = window.setTimeout(apoyar, vuelta);
  reloj = window.setTimeout(mostrarLaFicha, espera);
  // El toque que eligió la tecla no cuenta: se empieza a escuchar en la vuelta siguiente. Se
  // escucha `click` y no `pointerdown`: la ficha corre la hoja, y con `pointerdown` el `click`
  // de ese mismo toque caería después sobre lo que hubiera quedado bajo el dedo.
  window.setTimeout(() => {
    if (conFicha || !vigente()) return;
    zonaPartida.addEventListener('click', alTocar);
    document.addEventListener('keydown', alTeclear);
  }, 0);
}

/**
 * Lo que la ficha de la respuesta dice además del grito: el número real (para el lector: la
 * vista lo tiene en la ficha), la explicación, la fuente y, si era una palabra, las formas
 * que se contaron y en qué temas aparece (`D-48` punto 4: el número se puede auditar).
 */
function loQueDice(p: Paso, acerto: boolean, enPartida: boolean): { dice: HTMLElement; suma: HTMLElement | null } {
  const { dato } = p;
  const dice = el('div', 'ficha-respuesta-dice');
  // El grito y lo que sumaste son de la partida: en el resultado ya lo dice el encabezado.
  let suma: HTMLElement | null = null;
  if (enPartida) {
    const cabeza = el('div', 'revelacion-cabeza');
    cabeza.append(
      dibujo('span', 'ficha-respuesta-marca', acerto ? '✔︎' : '✕︎'),
      el('p', 'micro', acerto ? PARTIDA.acierto : PARTIDA.error),
    );
    suma = acerto ? dibujo('span', 'revelacion-suma', FICHAS.suma) : null;
    if (suma) cabeza.append(suma);
    dice.append(cabeza);
  }

  // El número real, escrito: en el resultado se ve (la mesa de arriba es chica); en la
  // partida lo lleva la ficha, grande, y acá queda para el lector de pantalla.
  dice.append(el('p', 'masomenos-real', `${acerto ? '✔︎' : '✕︎'} ${comoSeLee(dato.valor, dato)}`));
  if (dato.explicacion) {
    dice.append(el('p', dato.explicacion.length > 90 ? 'explicacion explicacion--larga' : 'explicacion', dato.explicacion));
  }
  dice.append(el('p', 'explicacion', dato.fuente));

  // En un par, las dos fuentes si son distintas (`RNF-CTR-20-A`): el jugador también vio el
  // número de la referencia, y tiene derecho a saber de dónde salió.
  const ref = p.referencia;
  if (ref.clase === 'par' && ref.dato.fuente !== dato.fuente) {
    dice.append(el('p', 'explicacion', `«${ref.dato.sujeto ?? ''}»: ${ref.dato.fuente}`));
  }

  // setlist.fm: el enlace y la fecha en el mismo bloque que el número (`RNF-CTR-19-A`).
  if (dato.familia === 'en-vivo' && isla.enVivo) {
    const bloque = el('p', 'explicacion', `${EN_VIVO.consultado(diaMesAnio(isla.enVivo.consultado))} `);
    const enlace = el('a', 'link', EN_VIVO.enlace);
    enlace.href = isla.enVivo.pagina;
    enlace.rel = 'noopener';
    bloque.append(enlace);
    dice.append(bloque);
  }

  if (dato.formas && dato.temas) {
    dice.append(el('p', 'masomenos-formas', DETALLE_PALABRA.formasContadas(dato.formas)));
    const plegado = el('details', 'masomenos-despliegue');
    plegado.append(el('summary', 'masomenos-despliegue-abrir', DETALLE_PALABRA.verEnCuales));
    const temas = el('ul', 'masomenos-temas');
    for (const t of dato.temas) {
      const li = el('li');
      const a = el('a', 'categoria', t.titulo);
      a.href = `/letras-y-acordes/${t.slug}/`;
      li.append(a);
      temas.append(li);
    }
    plegado.append(temas);
    dice.append(plegado);
  }
  return { dice, suma };
}

/**
 * **Que tu ficha dada vuelta y "Seguí" entren juntas en la ventana.** Se mide, no se calcula
 * (lo aprendido en "Adiviná la tapa"), y la política es una sola, siempre en este orden:
 *
 * 1. si entra, no se toca nada;
 * 2. las dos fichas se achican lo justo, hasta un alto en que el número se lee de lejos;
 * 3. lo largo de la ficha de la respuesta se pliega (la explicación a dos renglones y el
 *    detalle de las palabras, detrás de "Leé más") y las fichas vuelven a medirse;
 * 4. las fichas bajan al mínimo;
 * 5. la pregunta y las teclas —que ya dijeron lo suyo, y el lector conserva— salen de la vista;
 * 6. y si ni así, el número real se escribe también en la ficha de la respuesta y la hoja se
 *    corre hasta "Seguí".
 *
 * El alto nuevo se pone de una y **lo que se anima es la diferencia, con `transform`** (cada
 * ficha arranca donde estaba y del tamaño que tenía): no se rehace la hoja en cada cuadro. Con
 * movimiento reducido, de una. `antes` es dónde estaba cada ficha antes de que llegara la
 * respuesta, en coordenadas de la hoja.
 */
const FICHA_LEGIBLE = 150;
const FICHA_MINIMA = 96;

interface Lugar {
  readonly x: number;
  readonly y: number;
  readonly alto: number;
}

function lugaresDe(mesa: HTMLElement): Lugar[] {
  return [...mesa.querySelectorAll<HTMLElement>('.ficha-mm')].map((ficha) => {
    const r = ficha.getBoundingClientRect();
    return { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY, alto: r.height };
  });
}

function acomodarLaMesa(mesa: HTMLElement, panel: HTMLElement, antes: readonly Lugar[]): void {
  const fichas = [...mesa.querySelectorAll<HTMLElement>('.ficha-mm')];
  const arriba = tableroEl ?? zonaPartida;
  if (fichas.length === 0) return;
  zonaPartida.classList.remove('partida--apretada', 'partida--mesa-afuera');
  panel.classList.remove('ficha-respuesta--plegada');
  mesa.classList.remove('mesa--medida');
  mesa.style.removeProperty('--ficha-alto');
  const natural = fichas[0]!.offsetHeight;
  mesa.classList.add('mesa--medida');
  const sobra = (): number =>
    panel.getBoundingClientRect().bottom - arriba.getBoundingClientRect().top + 14 - window.innerHeight;
  /** Prueba a su alto y, si no entra, achica lo que falta sin bajar de `piso`. Dice si entró. */
  const ajustar = (piso: number): boolean => {
    mesa.style.setProperty('--ficha-alto', `${natural}px`);
    const falta = sobra();
    if (falta <= 0) return true;
    mesa.style.setProperty('--ficha-alto', `${Math.max(Math.min(piso, natural), natural - falta)}px`);
    return sobra() <= 0;
  };
  let entra = ajustar(FICHA_LEGIBLE);
  if (!entra && panel.querySelector('.explicacion--larga, .masomenos-despliegue')) {
    panel.classList.add('ficha-respuesta--plegada');
    entra = ajustar(FICHA_LEGIBLE);
  }
  if (!entra) entra = ajustar(FICHA_MINIMA);
  if (!entra) {
    zonaPartida.classList.add('partida--apretada');
    entra = ajustar(FICHA_MINIMA);
  }
  if (!entra) zonaPartida.classList.add('partida--mesa-afuera');

  // La hoja se mueve primero y los lugares se miden después.
  if (entra) window.scrollTo({ top: Math.max(0, arriba.getBoundingClientRect().top + window.scrollY - 12) });
  else panel.scrollIntoView({ block: 'end' });

  const ms = duracionDe('--duracion-paso');
  if (ms <= 0) return;
  const curva = getComputedStyle(document.documentElement).getPropertyValue('--curva-cinta').trim() || 'linear';
  lugaresDe(mesa).forEach((ahora, i) => {
    const era = antes[i];
    const ficha = fichas[i];
    if (!era || !ficha || typeof ficha.animate !== 'function' || ahora.alto <= 0) return;
    const dx = era.x - ahora.x;
    const dy = era.y - ahora.y;
    const k = era.alto / ahora.alto;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(k - 1) < 0.01) return;
    ficha.animate(
      [{ transform: `translate(${dx}px, ${dy}px) scale(${k})` }, { transform: 'translate(0, 0) scale(1)' }],
      { duration: ms, easing: curva },
    );
  });
}

/**
 * El segundo tiempo: la ficha de la respuesta, con la gramática de los otros juegos pulidos —
 * la marca y el grito estampados, lo que sumaste, de dónde salió el número y "Seguí" adentro—.
 * Sobre la mesa queda la marca chica en tu ficha y, entre las dos, la palabra que las compara.
 */
function pintarLaRespuesta(p: Paso, acerto: boolean, mesa: HTMLElement, tuya: HTMLElement, lista: HTMLElement): void {
  const antes = lugaresDe(mesa);
  zonaPartida.classList.add('partida--revelada');
  // Si con esta pasás tu mejor racha, la mesa le reserva al sello el paño de arriba desde ya:
  // así entra en la cuenta de lo que mide la pantalla.
  if (acerto && mejorAlEmpezar > 0 && estado.racha === mejorAlEmpezar + 1) mesa.classList.add('mesa--con-hazana');
  dejarLaMarca(mesa, tuya, acerto);
  ponerElSigno(mesa.querySelector('.mesa-signo'), p);
  lista.classList.add('masomenos-opciones--cerradas');

  const panel = el('div', `feedback revelacion ficha-respuesta jugo-pega ${acerto ? 'ok' : 'no'}`);
  const { dice, suma } = loQueDice(p, acerto, true);
  panel.append(dice);

  // El avance lo manda el dedo, siempre. No hay temporizador (`UX-34` §3.3, WCAG 2.2.1).
  const seguir = el('button', 'primario seguir-ficha', acerto ? PARTIDA.seguir : FICHAS.alResultado);
  seguir.type = 'button';
  seguir.addEventListener('click', () => (acerto ? pasar(p, tuya) : pintarResultado(p)), { once: true });
  // "Leé más": la puerta de lo que `acomodarLaMesa` haya plegado. Sin plegado no se ve.
  const leerMas = el('button', 'leer-mas', FICHAS.leerMas);
  leerMas.type = 'button';
  leerMas.addEventListener('click', () => {
    panel.classList.remove('ficha-respuesta--plegada');
    panel.scrollIntoView({ block: 'nearest' });
  });
  panel.append(leerMas, seguir);
  zonaRevelado.replaceChildren(panel);

  // Lo que sumaste vuela del sello de la ficha al contador de la racha, que da la vuelta.
  if (acerto && suma) {
    const sigue = (): boolean => paso === p && !!contadorEl?.isConnected;
    window.setTimeout(
      () => {
        if (!sigue()) return;
        if (!suma.isConnected || !contadorEl) {
          ponerLaRacha(false);
          return;
        }
        volar(FICHAS.suma, 'suma-vuela', suma, contadorEl, () => {
          if (!sigue()) return;
          ponerLaRacha(true);
          sonarEfecto('tecla');
          anotarHazana();
        });
      },
      duracionDe('--duracion-umbral') + duracionDe('--escalon-pasada'),
    );
  }

  // El foco va a "Seguí" sin arrastrar la vista. El anillo se dibuja si se llegó con el
  // teclado y no si se llegó con el dedo.
  if (conPuntero) {
    seguir.classList.add('seguir--sin-anillo');
    seguir.addEventListener('blur', () => seguir.classList.remove('seguir--sin-anillo'), { once: true });
  }
  seguir.focus({ preventScroll: true });
  acomodarLaMesa(mesa, panel, antes);
}

/**
 * El pase: la ficha que ganaste vuela de la mesa a la pila de la cabecera, donde cae de canto
 * con su clac, y mientras tanto se reparten las dos fichas de la pregunta que sigue.
 */
function pasar(p: Paso, tuya: HTMLElement): void {
  sonarEfecto('tecla');
  // Si lo que sumaste todavía no había llegado al contador, llega ahora.
  ponerLaRacha(false);
  anotarHazana();
  const racha = estado.racha;
  const apilar = (): void => {
    if (estado.racha !== racha || !pilaEl?.isConnected) return;
    pintarPila(pilaEl, racha, true, TOPE_CABECERA);
    sonarEfecto('clac');
  };
  const destino = pilaEl;
  window.scrollTo({ top: 0 });
  if (destino && tuya.isConnected) {
    const copia = tuya.cloneNode(true) as HTMLElement;
    copia.className = 'ficha-mm ficha-mm--vuela';
    copia.querySelector('.sello-marca')?.remove();
    copia.querySelector('.ficha-mm-dorso')?.remove();
    volarPieza(copia, tuya, lugarEnLaPila(destino), apilar);
  } else {
    apilar();
  }
  if (paso === p) pintarPaso();
}

/** Dónde va a caer la ficha que sigue: una caja suelta, del tamaño de un canto, en su lugar de la pila. */
function lugarEnLaPila(pila: HTMLElement): Element {
  const marca = dibujo('span', 'apilada-lugar');
  const n = Math.min(estado.racha - 1, TOPE_CABECERA - 1);
  const r = pila.getBoundingClientRect();
  const enMonton = n % POR_MONTON;
  const monton = Math.floor(n / POR_MONTON);
  // Las medidas del canto salen de la hoja: un canto de prueba, que no se ve.
  const prueba = el('span', 'apilada-ficha');
  const cajon = el('span', 'apilada-monton');
  cajon.style.visibility = 'hidden';
  cajon.append(prueba);
  pila.append(cajon);
  const c = prueba.getBoundingClientRect();
  const m = cajon.getBoundingClientRect();
  cajon.remove();
  const paso1 = c.height + 1;
  marca.style.position = 'fixed';
  marca.style.left = `${r.left + monton * (m.width + 3)}px`;
  marca.style.top = `${r.bottom - (enMonton + 1) * paso1}px`;
  marca.style.width = `${c.width}px`;
  marca.style.height = `${c.height}px`;
  document.body.append(marca);
  window.setTimeout(() => marca.remove(), 0);
  return marca;
}

/* ------------------------------------------------------------------ el resultado */

/** La tarjeta de la partida, en el idioma de las fichas. Nunca tira: si no se puede, `null`. */
async function dibujarLaTarjeta(): Promise<Blob | null> {
  const racha = estado.racha;
  const mejor = Math.max(mejorAlEmpezar, racha);
  try {
    return await dibujarFichas({
      juego: FICHAS.juego,
      rotulo: FICHAS.racha,
      racha,
      titulo: TRAMOS[tramoDeRacha(racha)],
      mejor: RESULTADO.mejor(mejor),
      hazana: mejorAlEmpezar > 0 && racha > mejorAlEmpezar ? FICHAS.hazana : null,
      sitio: location.host + location.pathname,
    });
  } catch {
    // La tarjeta es el premio, no el camino.
    return null;
  }
}

function pintarResultado(quienCorto: Paso | null): void {
  const racha = estado.racha;
  const anterior = mejorAlEmpezar;
  const mejor = Math.max(leerMejor(), racha);
  if (mejor > leerMejor()) guardarMejor(mejor);
  const esHazana = anterior > 0 && racha > anterior;

  zonaResultado.replaceChildren();

  let orden = 0;
  const entra = <T extends HTMLElement>(pieza: T, clase = 'jugo-entra'): T => {
    pieza.classList.add(clase);
    pieza.style.setProperty('--orden', String(orden++));
    return pieza;
  };

  zonaResultado.append(el('p', 'rotulo-desenlace', estado.ganada ? RESULTADO.victoria : RESULTADO.rotulo));
  const t = tramoDeRacha(racha);
  const encabezado = entra(el('h2', `tramo tramo--${t}`, TRAMOS[t]));
  zonaResultado.append(encabezado);

  /*
   * La cuenta: la racha, grande, y al lado la pila de lo que juntaste. **La pila se arma
   * ficha por ficha y la cifra sube con cada una**; cuando termina, la cifra apoya como un
   * sello. Tres cierres distintos: la hazaña (pasaste tu mejor racha: doble filete y un
   * segundo sello), el de siempre, y el de cero (la cifra queda de trazo cortado y la hoja da
   * un golpe). Con movimiento reducido la pila aparece entera y la cifra en su valor.
   */
  const cuenta = entra(el('div', 'cuenta-vuelta cuenta-fichas'));
  const cifra = el('div', 'cifra');
  const numero = el('p', 'cifra-numero', '0');
  cifra.append(el('p', 'cifra-rotulo', RESULTADO.rotuloRacha), numero);
  const pila = el('div', 'apilada apilada--resultado');
  pila.setAttribute('role', 'img');
  // Al lado de la cifra: la pila, la mejor racha del aparato y, si la pasaste, el sello.
  const lado = el('div', 'cuenta-fichas-lado');
  lado.append(pila);
  if (racha === 0) {
    // Cero: la cifra de trazo cortado y torcida, y el lugar de la pila vacío.
    cuenta.classList.add('cuenta-fichas--cero');
    numero.classList.add('cifra-numero--cero');
    lado.append(el('p', 'cifra-pie', RESULTADO.mejor(mejor)));
  } else if (esHazana) {
    // La hazaña: todo en oro —la cifra, su doble filete y el sello—; el sello ya dice que es
    // tu mejor racha, así que la línea de la mejor no se repite.
    cuenta.classList.add('cuenta-fichas--hazana');
    numero.classList.add('cifra-numero--hazana');
    lado.append(el('p', 'hazana-sello', FICHAS.hazana));
  } else {
    // El de siempre: la cifra en la tinta del disco, con su filete entero.
    numero.classList.add('cifra-numero--puesta');
    lado.append(el('p', 'cifra-pie', RESULTADO.mejor(mejor)));
  }
  cuenta.append(cifra, lado);
  zonaResultado.append(cuenta);

  const cerrarLaCuenta = (): void => {
    if (!numero.isConnected) return;
    numero.textContent = String(racha);
    pintarPila(pila, racha, false);
    if (racha === 0) {
      golpear(zonaResultado);
      sonarEfecto('golpe');
    } else {
      estampar(numero);
      sonarEfecto('sello');
      // La hazaña suena dos veces: la cifra y, un compás después, su sello.
      if (esHazana) window.setTimeout(() => sonarEfecto('sello'), duracionDe('--duracion-cuenta') + 160);
    }
  };
  const escalon = duracionDe('--escalon-umbral');
  const dibujadas = Math.min(racha, TOPE_PILA);
  if (escalon <= 0 || racha === 0) {
    if (racha === 0) window.setTimeout(cerrarLaCuenta, duracionDe('--duracion-umbral'));
    else cerrarLaCuenta();
  } else {
    // Como mucho un segundo y medio: con una racha larga, las fichas caen más seguido.
    const cada = Math.max(24, Math.min(escalon * 1.3, 1500 / dibujadas));
    pintarPila(pila, 0, false);
    let van = 0;
    const reloj = window.setInterval(() => {
      if (!numero.isConnected) {
        window.clearInterval(reloj);
        return;
      }
      van += 1;
      if (van >= dibujadas) {
        window.clearInterval(reloj);
        if (racha > dibujadas) contar(numero, dibujadas, racha, String);
        cerrarLaCuenta();
        return;
      }
      pintarPila(pila, van, true);
      numero.textContent = String(van);
      if (van % 2 === 1) sonarEfecto('clac');
    }, cada);
  }

  if (quienCorto) {
    // La misma pieza que se vio un paso antes, fija (`UX-34` §3.5): la pregunta, las dos
    // fichas como quedaron y de dónde salió el número.
    const corte = entra(el('section', 'corte'));
    corte.append(el('h3', 'resumen-titulo', RESULTADO.teCorto));
    // En un renglón: a la izquierda las dos fichas, chicas, con el signo entre ellas; a la
    // derecha la pregunta, el número escrito y de dónde salió.
    const fila = el('div', 'corte-fila');
    const { mesa, tuya } = armarMesa(quienCorto, true);
    mesa.classList.add('mesa--quieta');
    tuya.append(dibujo('span', 'sello-marca sello-marca--no', '✕︎'));
    const texto = el('div', 'corte-dice');
    texto.append(el('p', 'masomenos-pregunta', quienCorto.dato.pregunta), loQueDice(quienCorto, false, false).dice);
    const nota = lineaDeSetlist(quienCorto);
    if (nota) texto.append(nota);
    fila.append(mesa, texto);
    corte.append(fila);
    zonaResultado.append(corte);
  }

  /*
   * El pie del resultado (`.pie-resultado`): la misma pieza y el mismo orden que los otros
   * juegos pulidos — la tarjeta que asoma, "Compartí", lo que compartir tenga para decir y la
   * otra vuelta. El resultado viaja como desafío (`ADR-02`, forma `marcador`: `p` la racha,
   * `t` las preguntas del pozo).
   */
  const pie = entra(el('div', 'pie-resultado'));
  const { boton: compartir, salida } = botonCompartir(RESULTADO, () => ({
    texto: RESULTADO.paraCompartir(racha),
    url: armarLink(location.origin + location.pathname, {
      forma: 'marcador',
      juego: JUEGO,
      puntaje: racha,
      total: Math.max(racha, pozo.length),
    }),
    archivo: archivoDeLaTarjeta,
  }));

  // La tarjeta asoma: lo que vas a compartir se ve antes de tocar el botón. Se dibuja una vez.
  const asoma = dibujo('div', 'tarjeta-asoma');
  asoma.addEventListener('click', () => compartir.click());
  if (urlDeLaTarjeta) URL.revokeObjectURL(urlDeLaTarjeta);
  urlDeLaTarjeta = '';
  archivoDeLaTarjeta = null;
  const estaTarjeta = tarjetaDeLaPartida ?? dibujarLaTarjeta();
  tarjetaDeLaPartida = estaTarjeta;
  void estaTarjeta.then((imagen) => {
    if (tarjetaDeLaPartida !== estaTarjeta || !asoma.isConnected) return;
    if (!imagen) {
      asoma.remove();
      return;
    }
    archivoDeLaTarjeta = new File([imagen], nombreArchivo(JUEGO), { type: 'image/png' });
    urlDeLaTarjeta = URL.createObjectURL(imagen);
    const foto = el('img', 'jugo-pega');
    foto.alt = '';
    foto.src = urlDeLaTarjeta;
    asoma.append(foto);
  });

  const denuevo = el('button', 'secundario', RESULTADO.deNuevo);
  denuevo.type = 'button';
  denuevo.addEventListener('click', () => {
    sonarEfecto('clac');
    comenzar();
  });
  pie.append(asoma, compartir, salida, denuevo);
  zonaResultado.append(pie);

  const salidaAlFichin = el('p', 'salida-resultado');
  const alFichin = el('a', 'volver', `← ${RESULTADO.volver}`);
  alFichin.href = '/';
  salidaAlFichin.append(alFichin);
  zonaResultado.append(salidaAlFichin);

  tableroEl?.remove();
  tableroEl = null;
  mostrar(zonaResultado);
  window.scrollTo({ top: 0 });
  enfocar(encabezado);
  pintarMejorDeLaPortada();
}
