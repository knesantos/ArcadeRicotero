/**
 * La isla del quiz: partida, resultado y compartir. `T-40`, `T-41`, `T-42`, `T-143` y `D-71`.
 *
 * Implementa `UX-01` v2, `BR-01`, `BR-04`, `BR-19`, `UX-07`, `CNT-10`, `ADR-02` v2 y `D-71`.
 * Todo el texto sale de `copy.ts` y toda la logica de reglas de `lib/quiz/`: este archivo es
 * solo el pegamento con el DOM.
 *
 * **Regla que atraviesa todo el archivo: nada se escribe con `innerHTML`.** El unico dato
 * externo que entra al sitio es el nombre del desafio, y `ADR-02` fue explicito en que un
 * nombre inyectado desde la URL es XSS reflejado de manual. Usar `textContent` en todos
 * lados hace que la clase entera de bug sea imposible, no improbable.
 *
 * ## El objeto del juego: la ficha (ronda de pulida, 2026-11-19)
 *
 * La portada lo dice: "Se te cae una moneda en la ranura". El objeto es **la ficha del
 * fichín**, y la máquina le contesta:
 *
 * - **La portada es la chapa de la ranura.** Tocar "Jugá" (o la ficha) la mete: gira de canto,
 *   cae por la ranura y el contador de créditos da una vuelta. Recién ahí arranca la partida.
 * - **Las tres vidas son tres fichas**, las mismas de la portada. Cuando errás, la ficha se
 *   parte en dos y las mitades se caen; queda el hueco con su cruz (forma y símbolo, no solo
 *   tinta) y la pantalla da un golpe.
 * - **El `Nº` de la pregunta es un contador de ruedas**: cada pregunta nueva le da una vuelta.
 * - **La respuesta se cierra en dos tiempos**, como en los otros juegos pulidos: primero el
 *   sello grande cae sobre la pregunta, donde está el ojo; después llega la ficha de la
 *   respuesta, con el grito, lo que sumaste, la tapa, el dato y "Seguí" adentro. El cierre se
 *   adelanta con un toque (o con Enter o la barra): no saltea pasos, los corre.
 *
 * **Lo que no cambió** (`D-71`, `BR-19`, `UX-01` v2): la lógica de `vidas.ts`, las preguntas y
 * su respuesta, la insignia de rótulo antes de responder y el sello completo después, que
 * avanzar lo manda el dedo (sin temporizador), "Cerrá la partida" arriba y en dos pasos, y las
 * teclas 1–4 y A–D. Ningún estado depende del movimiento ni del color; con movimiento reducido
 * todo aparece en su estado final (los tiempos salen de tokens que el corte lleva a cero).
 */

import {
  comenzar as comenzarPartida,
  responder as responderPartida,
  retirarse,
  actual,
  abreEscalon,
  aciertos as aciertosDe,
  resultado as resultadoDe,
  type Partida,
} from '../lib/quiz/vidas.ts';
import { escalones, historial, racha, respondidasPorEscalon } from '../lib/quiz/recorrido.ts';
import { leerDesafio, armarLink } from '../lib/desafio.ts';
import { botonSpotify } from './spotify.ts';
import type { Item } from '../lib/quiz/banco.ts';
import { tituloDelDisco } from '../lib/letra/discos.ts';
import {
  ACIERTOS,
  BOTON_DE_NUEVO,
  BOTON_RETIRARSE,
  BOTON_SEGUIR,
  COMPARTIR,
  DESENLACES,
  ERRORES,
  ESCALON_CANTA,
  FICHIN,
  PLANILLA,
  RACHAS,
  RETIRADA_CONFIRMA,
  VIDAS_ROTULO,
  altTapa,
  avisoEscalon,
  comparacion,
  etiquetaCategoria,
  etiquetaNivel,
  insignia,
  lineaAciertos,
  lineaRecorrido,
  lineaVidas,
  NOMBRE_NIVEL,
  numeroDePregunta,
  numeroDePreguntaLeido,
  planillaParaCompartir,
  selloRevelado,
  subtituloDesafio,
  textoParaCompartir,
  variante,
} from '../lib/quiz/copy.ts';
import { botonCorreccion } from './correccion.ts';
import { botonCompartir } from './compartir.ts';
import { nombreArchivo } from '../lib/tarjeta/plan.ts';
import { dibujarFichin } from './tarjeta-fichin.ts';
import { despertarSalida } from '../lib/audio/contexto.ts';
import { sonarEfecto } from '../lib/audio/efectos.ts';
import {
  golpear,
  estampar,
  volar,
  contar,
  duracionDe,
  armarInterruptorDeRuidos,
  armarContador,
  rodarContador,
} from './jugo.ts';

/** Quien soy, para `leerDesafio`. Ver `FIND-28` en `desafio.ts`. */
const JUEGO = 'quiz';

/** Las letras de las cuatro opciones (`BR-04`). Tambien son las teclas que las eligen. */
const LETRAS = ['A', 'B', 'C', 'D'] as const;

/** Con cuántas vidas arranca la partida: tres fichas (`BR-19`). */
const FICHAS = 3;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const portada = $('portada');
const zonaPartida = $('partida');
const zonaResultado = $('resultado');

const banco: Item[] = JSON.parse($('banco').textContent ?? '[]');
const desafio = leerDesafio(location.search, JUEGO);

let partida: Partida<Item>;
let ultimoFeedback: string | null = null;
/**
 * Si lo último que se tocó fue con el dedo o el mouse y no con el teclado. Decide si el foco
 * que la isla le pone a "Seguí" dibuja su anillo (la misma regla de los otros juegos pulidos).
 */
let conPuntero = false;
/** La tarjeta de la partida: se dibuja una vez al llegar al resultado, y "Compartí" usa esa. */
let tarjetaDeLaPartida: Promise<Blob | null> | null = null;
let archivoDeLaTarjeta: File | null = null;
let urlDeLaTarjeta = '';

/** Las piezas del tablero, que es el mismo de una pregunta a la otra (así el contador gira). */
let tableroEl: HTMLElement;
let vidasEl: HTMLElement;
let contadorEl: HTMLElement;
let numeroLeidoEl: HTMLElement;
let rachaEl: HTMLElement;
let llevasEl: HTMLElement;
let rielEl: HTMLElement;
let retiradaEl: HTMLElement;
/** Las piezas de la pregunta en curso. Se rehacen en cada pregunta. */
let fichaEl: HTMLElement;
let listaEl: HTMLElement;

/** Crea un elemento con texto. Nunca HTML: ver la nota del encabezado. */
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

/** Una pieza que es dibujo: no se lee ni toma toques. */
function dibujo<K extends keyof HTMLElementTagNameMap>(tag: K, clase: string, texto?: string): HTMLElementTagNameMap[K] {
  const n = el(tag, clase, texto);
  n.setAttribute('aria-hidden', 'true');
  return n;
}

function mostrar(seccion: HTMLElement): void {
  for (const s of [portada, zonaPartida, zonaResultado]) s.hidden = s !== seccion;
}

/**
 * Llevar el foco a lo primero de la pantalla nueva.
 *
 * Este juego cambia de pantalla sin cambiar de pagina, y el navegador no tiene forma de
 * saberlo: el foco se quedaba en el `<body>`. Quien juega con teclado tenia que tabular
 * desde la cinta de regreso en cada pregunta, y quien usa lector de pantalla no se enteraba
 * de nada. Es el mismo principio de los molinetes abiertos, aplicado a quien no ve la
 * pantalla.
 */
function enfocar(destino: HTMLElement): void {
  // -1 lo hace enfocable por codigo sin meterlo en el orden de tabulacion.
  destino.tabIndex = -1;
  destino.focus({ preventScroll: true });
}

/* ---- La portada: la ficha en la ranura ---- */

// Pantalla 0: si se llego por un desafio, el subtitulo lo dice.
if (desafio) $('subtitulo').textContent = subtituloDesafio(desafio);

// El interruptor de los ruidos, debajo de la tecla (como en los otros juegos).
document
  .getElementById('ruidos')
  ?.append(armarInterruptorDeRuidos({ apagar: FICHIN.ruidosApagar, prender: FICHIN.ruidosPrender }));

/**
 * Meter la ficha. Lo llaman "Jugá" y la ficha de la chapa, que es el mismo gesto dicho con el
 * objeto. La ficha gira de canto y cae por la ranura, en saltos; cuando entró, suena el clac,
 * el contador de créditos da una vuelta y arranca la partida. Un segundo toque mientras cae
 * no espera: arranca. Con movimiento reducido no hay caída y la partida arranca en el acto.
 */
let entrando: (() => void) | null = null;

function meterLaFicha(): void {
  if (entrando) {
    entrando();
    return;
  }
  // Este toque es el gesto que los celulares piden para dejar sonar algo: se despierta la
  // salida acá, y los ruidos de la partida ya pueden salir.
  const despierta = despertarSalida();
  const ficha = document.getElementById('ficha-portada');
  const ms = duracionDe('--duracion-golpe') * 1.3;
  if (!ficha || ms <= 0 || typeof ficha.animate !== 'function') {
    void despierta.then(() => sonarEfecto('clac'));
    comenzar();
    return;
  }
  let reloj = 0;
  let entro = false;
  const entrar = (): void => {
    if (entro) return;
    entro = true;
    entrando = null;
    window.clearTimeout(reloj);
    comenzar();
  };
  entrando = entrar;
  void despierta.then(() => sonarEfecto('tecla'));
  const entra = Math.round(ficha.getBoundingClientRect().width + 6);
  // La ficha está de canto, a medio meter. El dedo la empuja: retrocede un pelo, y la boca se
  // la traga en saltos (la recorta `.ranura-caida`, a la altura de la hendija).
  const caida = ficha.animate(
    [
      { translate: '0 0', offset: 0 },
      { translate: '-5px 0', offset: 0.2 },
      { translate: '-5px 0', offset: 0.3 },
      { translate: `${entra}px 0`, offset: 1 },
    ],
    { duration: ms, easing: 'steps(8, end)', fill: 'forwards' },
  );
  caida.addEventListener(
    'finish',
    () => {
      if (entro) return;
      sonarEfecto('clac');
      const creditos = document.getElementById('creditos');
      rodarContador(creditos, 1);
      // Lo que tarda la rueda en dar la vuelta, y arranca.
      reloj = window.setTimeout(entrar, duracionDe('--duracion-golpe'));
    },
    { once: true },
  );
}

$('jugar').addEventListener('click', meterLaFicha);
document.getElementById('ficha-portada')?.addEventListener('click', meterLaFicha);

function comenzar(): void {
  partida = comenzarPartida(banco);
  ultimoFeedback = null;
  mostrar(zonaPartida);
  zonaPartida.replaceChildren();
  armarTablero();
  pintarPregunta();
  window.scrollTo({ top: 0 });
}

/* ---- Lo que ya paso: aciertos, racha y donde arranca cada escalon ---- */

function textoCorrecto(item: Item): string {
  return item.opciones.find((o) => o.correcta)!.texto;
}

/**
 * Cuantas van del escalon en curso, y cuantas tiene.
 *
 * No sale de ninguna constante: se cuenta sobre el orden real que armo `vidas.ts`. El
 * escalon **es** el pozo, y el pozo lo define el banco (`BR-19` apartado 2).
 */
function posicionEnEscalon(p: Partida<Item>): { nivel: string; van: number; total: number } {
  const nivel = p.orden[p.indice]!.dificultad;
  const delNivel = p.orden.filter((i) => i.dificultad === nivel);
  const primero = p.orden.findIndex((i) => i.dificultad === nivel);
  return { nivel, van: p.indice - primero + 1, total: delNivel.length };
}

/* ---- El tablero ---- */

/**
 * El marcador de vidas: tres fichas, y la palabra. `UX-07` — ningun estado por color solo.
 *
 * La que está en pie es una ficha llena con su rombo; la que se fue, el hueco de trazo cortado
 * con la cruz —el mismo `✕` de la opción errada, porque errar es la única causa posible de
 * perder una vida—. `seRompe` es la que se acaba de perder: lleva encima las dos mitades de la
 * ficha, que se separan y se caen (`ficha-rompe-*`). Con movimiento reducido no se arman: el
 * hueco con la cruz ya lo dice.
 */
function marcadorVidas(vidas: number, seRompe = false, llegan = false): HTMLElement {
  const caja = el('div', 'vidas');
  caja.append(el('span', 'vidas-rotulo', VIDAS_ROTULO));
  const fila = el('span', 'vidas-fichas');
  const conMovimiento = duracionDe('--duracion-cuenta') > 0;
  for (let i = 0; i < FICHAS; i++) {
    const viva = i < vidas;
    const ficha = el('span', `vida ${viva ? 'vida--viva' : 'vida--ida'}`, viva ? '◆' : '✕︎');
    if (viva && llegan) {
      ficha.classList.add('vida--llega');
      ficha.style.setProperty('--orden', String(i));
    }
    if (!viva && seRompe && i === vidas && conMovimiento) {
      ficha.append(dibujo('span', 'vida-mitad vida-mitad--izq'), dibujo('span', 'vida-mitad vida-mitad--der'));
    }
    fila.append(ficha);
  }
  caja.append(fila);
  caja.setAttribute('role', 'img');
  caja.setAttribute('aria-label', `${VIDAS_ROTULO}: ${vidas} de ${FICHAS}`);
  caja.id = 'vidas-pregunta';
  return caja;
}

/**
 * El riel: un paso por pregunta, partido en los tres escalones.
 *
 * Es el "cuanto falta" que la cabecera vieja no decia. Decorativo para el lector de
 * pantalla (`aria-hidden`): lo mismo se lee en el `Nº` y en la etiqueta del nivel. Y aun
 * asi no dice nada solo con color: el acierto es un paso lleno, el error un paso hueco y
 * bajo, el que se juega uno alto (`UX-07`).
 */
function riel(p: Partida<Item>, respondida: boolean): HTMLElement {
  const h = historial(p);
  const caja = el('div', 'riel');
  caja.setAttribute('aria-hidden', 'true');
  for (const g of escalones(p)) {
    const tramo = el('span', 'riel-tramo');
    // Cada escalon ocupa lo que dura: un pozo de 15 es mas largo que uno de 10.
    tramo.style.flexGrow = String(g.indices.length);
    for (const i of g.indices) {
      let estado = 'resto';
      if (i < h.length) estado = h[i] ? 'ok' : 'no';
      else if (!respondida && i === p.indice) estado = 'ahora';
      const paso = el('span', `riel-paso riel-paso--${estado}`);
      // El que se acaba de contestar apoya como un sello: es la marca que quedó.
      if (respondida && i === h.length - 1) paso.classList.add('jugo-sello');
      tramo.append(paso);
    }
    caja.append(tramo);
  }
  return caja;
}

/**
 * El tablero de arriba, que se arma una vez por partida y después se pone al día: las tres
 * fichas, el `Nº` en su contador de ruedas y lo que llevás; debajo el riel, y en el último
 * renglón —lo más lejos del pulgar que hay— la tecla de los ruidos, la racha y "Cerrá la partida".
 */
function armarTablero(): void {
  tableroEl = el('div', 'tablero');
  tableroEl.id = 'cabecera-pregunta';

  const fila = el('div', 'tablero-fila');
  vidasEl = marcadorVidas(partida.vidas, false, true);

  // El `Nº` solo no dice de cuantas: el lector lee la frase entera, que va oculta a la vista.
  // No es un `aria-label` sobre el `<p>`: un parrafo no tiene nombre en ARIA 1.2 y varios
  // lectores lo ignoran (`FIND-151`).
  const numero = el('p', 'tablero-numero');
  numero.id = 'numero-pregunta';
  contadorEl = armarContador(0, String(partida.orden.length).length);
  numeroLeidoEl = el('span', 'solo-lector');
  numero.append(dibujo('span', 'tablero-numero-rotulo', numeroDePregunta(0).replace(/\s*0$/, '')), contadorEl, numeroLeidoEl);

  rachaEl = el('span', 'racha');
  rachaEl.hidden = true;
  llevasEl = el('span', 'restantes restantes--llevas', FICHIN.llevas(0));
  llevasEl.setAttribute('aria-live', 'polite');
  // La tecla de los ruidos va en la cabecera, junto a lo que llevás, como en los otros juegos.
  const ruidos = armarInterruptorDeRuidos({ apagar: FICHIN.ruidosTecla, prender: FICHIN.ruidosTecla });
  ruidos.classList.add('ruidos-tecla');
  fila.append(vidasEl, numero, ruidos, llevasEl);

  rielEl = riel(partida, false);

  const pie = el('div', 'tablero-pie');
  retiradaEl = disparadorRetirada();
  pie.append(rachaEl, retiradaEl);

  tableroEl.append(fila, rielEl, pie);
  zonaPartida.append(tableroEl);
}

/**
 * Pone el tablero al día. `respondida` es el momento de la respuesta: `vidas.ts` ya avanzó el
 * índice a la que sigue, pero en pantalla todavía se está leyendo la que se contestó, así que
 * el `Nº` es el de las respondidas y el riel no marca la próxima. Y no se ofrece cerrar: con
 * la respuesta a la vista, el paso que sigue es `SEGUÍ`.
 */
function ponerTableroAlDia(respondida: boolean, perdioUna = false): void {
  const n = respondida ? partida.elegidas.length : partida.indice + 1;
  if (rodarContador(contadorEl, n) && !respondida && n > 1) sonarEfecto('tecla');
  numeroLeidoEl.textContent = numeroDePreguntaLeido(n, partida.orden.length);

  // Las vidas cambian en el mismo tick que el feedback: son la misma noticia (`UX-07`).
  // `CNT-10` decidió que perder una no lleva texto propio; lo dice el marcador.
  if (perdioUna) {
    const nuevas = marcadorVidas(partida.vidas, true);
    vidasEl.replaceWith(nuevas);
    vidasEl = nuevas;
  }

  const nuevoRiel = riel(partida, respondida);
  rielEl.replaceWith(nuevoRiel);
  rielEl = nuevoRiel;

  retiradaEl.hidden = respondida;
}

/** La racha de la cabecera: dos o más seguidas. Se anota al cerrar la respuesta, o se corta. */
function anotarRacha(): void {
  const n = racha(partida);
  rachaEl.hidden = n < 2;
  if (n >= 2) {
    rachaEl.textContent = FICHIN.racha(n);
    estampar(rachaEl);
  }
}

/* ---- La pregunta ---- */

/** `T-40` — la pregunta, con la insignia de rotulo **antes** de responder (`UX-01` v2). */
function pintarPregunta(): void {
  const item = actual(partida)!;
  // Lo de la pregunta anterior se va; el tablero queda.
  for (const hijo of [...zonaPartida.children]) if (hijo !== tableroEl) hijo.remove();
  zonaPartida.classList.remove('partida--revelada');
  ponerTableroAlDia(false);

  // La pregunta es **la pantalla del fichín**: ocupa el alto libre, se prende de una línea al
  // medio (`pantalla-prende`) y las cuatro teclas quedan abajo, donde está el pulgar.
  const ficha = el('article', `ficha-pregunta ficha-pregunta--${item.categoria} ficha-pregunta--prende`);
  fichaEl = ficha;

  const sellos = el('div', 'ficha-sellos');
  sellos.id = 'sellos-pregunta';
  // La clase sigue llevando el identificador (la mezcla D-19 la pinta por ahi); lo que se
  // lee sale de la tabla de etiquetas, porque `mitologia` en mayusculas se leia sin tilde.
  sellos.append(el('span', `categoria categoria--${item.categoria}`, etiquetaCategoria(item.categoria)));
  const pos = posicionEnEscalon(partida);
  sellos.append(el('span', 'paso', etiquetaNivel(pos.nivel, pos.van, pos.total)));
  // La insignia va antes de tocar: el que conoce la historia real tiene que saber que se
  // le pregunta "que se cuenta" y no "que paso".
  const ins = insignia(item.clase);
  if (ins) sellos.append(el('span', `insignia insignia--${item.clase}`, ins));
  ficha.append(sellos);

  // El aviso de escalon aparece una sola vez por salto y no corta el ritmo con una
  // pantalla intermedia: `UX-07` descarto el "¡subiste de nivel!" por ese motivo. Va
  // adentro de la ficha, como una franja estampada: el rotulo seco y la linea que canta.
  const abre = abreEscalon(partida);
  if (abre) {
    // El escalón es un momento, sin pantalla aparte (`UX-07`): el cartel cae sobre la pantalla
    // cuando ya prendió, suena el sello y el tramo nuevo del riel apoya.
    window.setTimeout(() => {
      if (fichaEl !== ficha) return;
      sonarEfecto('sello');
      estampar(rielEl.querySelector('.riel-paso--ahora')?.parentElement);
    }, duracionDe('--duracion-umbral'));
    const aviso = el('div', 'escalon');
    aviso.setAttribute('role', 'status');
    aviso.append(el('span', 'escalon-rotulo', avisoEscalon(pos.nivel)));
    const canta = ESCALON_CANTA[pos.nivel];
    if (canta) aviso.append(el('span', 'escalon-canta', canta));
    ficha.append(aviso);
  }

  // Un enunciado largo baja un cuerpo: la pantalla tiene que entrar con sus cuatro teclas.
  const enunciado = el('h2', item.enunciado.length > 120 ? 'enunciado enunciado--largo' : 'enunciado', item.enunciado);
  // El foco aterriza en la pregunta, pero las vidas, el numero, la categoria y —sobre todo—
  // la insignia de rotulo tienen que llegar con ella (`UX-01` v2).
  // Las vidas, el numero y los sellos, y no el tablero entero: el tablero tambien tiene el
  // boton de cerrar, y su texto no es parte de la pregunta (`FIND-151`).
  enunciado.setAttribute('aria-describedby', 'vidas-pregunta numero-pregunta sellos-pregunta');
  ficha.append(enunciado);
  zonaPartida.append(ficha);

  const lista = el('div', 'opciones opciones--letradas');
  listaEl = lista;
  item.opciones.forEach((op, i) => {
    const b = el('button', 'opcion jugo-pega');
    b.type = 'button';
    // Las teclas se apoyan cuando la pantalla ya prendió (y el cartel del escalón ya cayó).
    b.style.setProperty('--orden', String(i + (abre ? 9 : 5)));
    // El texto se compara por el dato y no por `textContent`: la letra vive adentro.
    b.dataset.texto = op.texto;
    const letra = el('span', 'opcion-letra', LETRAS[i]);
    letra.setAttribute('aria-hidden', 'true');
    b.append(letra, el('span', 'opcion-texto', op.texto));
    b.addEventListener(
      'click',
      (ev) => {
        conPuntero = ev.detail > 0;
        responder(op.texto);
      },
      { once: true },
    );
    lista.append(b);
  });
  zonaPartida.append(lista);

  enfocar(enunciado);
}

/**
 * Las teclas: 1-4 o A-D eligen la opcion. Es la misma partida con otro dedo.
 *
 * Solo mientras hay opciones vivas en pantalla, **solo con el foco adentro de la partida**
 * y nunca con un modificador apretado. Lo segundo es WCAG 2.1.4 (`FIND-150`): un atajo de
 * una tecla tiene que estar activo solo cuando el componente tiene el foco, si no el que
 * dicta por voz o navega con lector contesta sin querer. El foco ya cae en la pregunta en
 * cada paso, asi que para el que juega con teclado no cambia nada.
 */
document.addEventListener('keydown', (ev) => {
  if (zonaPartida.hidden || ev.ctrlKey || ev.metaKey || ev.altKey || ev.shiftKey) return;
  if (!zonaPartida.contains(document.activeElement)) return;
  const tecla = ev.key.toUpperCase();
  let i = LETRAS.indexOf(tecla as (typeof LETRAS)[number]);
  if (i < 0 && /^[1-4]$/.test(tecla)) i = Number(tecla) - 1;
  if (i < 0) return;
  const botones = zonaPartida.querySelectorAll<HTMLButtonElement>('.opcion:not(:disabled)');
  if (botones.length !== LETRAS.length) return;
  ev.preventDefault();
  botones[i]!.click();
});

/* ---- La retirada ---- */

/**
 * El boton que cierra la partida. `BR-19` apartado 7.
 *
 * Va **lejos de la zona pulgar** y en texto chico, no como boton primario: si quedara a
 * mano de las opciones, la gente se retiraria sin querer. Desde `D-71` vive en el tablero,
 * arriba a la derecha — antes caia entre las opciones y la respuesta, que era justo donde
 * baja el dedo. Lleva **confirmacion de dos pasos** que muestra hasta donde llegaste antes
 * de decidir, sin temporizador (WCAG 2.2.1).
 */
function disparadorRetirada(): HTMLElement {
  const caja = el('p', 'retirada');
  const b = el('button', 'retirada-disparador', BOTON_RETIRARSE);
  b.type = 'button';
  b.addEventListener('click', () => pintarConfirmacionRetirada());
  caja.append(b);
  return caja;
}

function pintarConfirmacionRetirada(): void {
  if (zonaPartida.querySelector('.retirada--confirma')) return;
  const caja = el('div', 'retirada retirada--confirma');
  caja.setAttribute('role', 'group');

  const pos = posicionEnEscalon(partida);
  caja.append(el('p', 'retirada-pregunta', RETIRADA_CONFIRMA.pregunta));
  // Mostrar hasta donde llegaste **antes** de decidir: es el dato que hace la decision.
  caja.append(
    el('p', 'tenue', `Pregunta ${partida.indice + 1} de ${partida.orden.length} · nivel ${NOMBRE_NIVEL[pos.nivel] ?? pos.nivel}`),
  );

  const si = el('button', 'secundario', RETIRADA_CONFIRMA.aceptar);
  si.type = 'button';
  si.addEventListener('click', () => {
    partida = retirarse(partida);
    pintarResultado();
  });
  const no = el('button', 'primario', RETIRADA_CONFIRMA.volver);
  no.type = 'button';
  no.addEventListener('click', () => {
    caja.remove();
    zonaPartida.querySelector<HTMLButtonElement>('.retirada-disparador')?.focus();
  });
  caja.append(no, si);
  tableroEl.after(caja);
  enfocar(no);
}

/* ---- La respuesta ---- */

/**
 * El sello grande del cierre: cae al medio de la pregunta, que es donde está el ojo, con la
 * tilde o la cruz. Es dibujo: lo mismo lo dicen las opciones (símbolo y tinta) y la ficha.
 */
function sellarLaPregunta(acerto: boolean): void {
  fichaEl.append(dibujo('span', `sello-cae sello-cae--${acerto ? 'ok' : 'no'}`, acerto ? '✔︎' : '✕︎'));
}

/** Lo que queda del sello cuando llega la ficha: la marca chica, en la esquina de la pregunta. */
function dejarLaMarca(acerto: boolean): void {
  for (const resto of fichaEl.querySelectorAll('.sello-cae')) resto.remove();
  if (fichaEl.querySelector('.sello-marca')) return;
  fichaEl.append(dibujo('span', `sello-marca sello-marca--${acerto ? 'ok' : 'no'}`, acerto ? '✔︎' : '✕︎'));
}

function responder(texto: string): void {
  const item = actual(partida);
  if (!item || partida.desenlace !== 'jugando') return;
  const correcta = textoCorrecto(item);
  const acerto = texto === correcta;
  const vidasAntes = partida.vidas;
  partida = responderPartida(partida, texto);
  const perdioUna = partida.vidas < vidasAntes;
  const termino = partida.desenlace !== 'jugando';
  const cual = partida.elegidas.length;
  const estaFicha = fichaEl;
  const vigente = (): boolean => partida.elegidas.length === cual && fichaEl === estaFicha && estaFicha.isConnected;

  // La confirmacion de cerrar, si estaba abierta, ya no tiene sentido: se respondio.
  zonaPartida.querySelector('.retirada--confirma')?.remove();

  // Las opciones dicen ya cuál era y cuál elegiste, con símbolo además de tinta.
  for (const b of zonaPartida.querySelectorAll<HTMLButtonElement>('.opcion')) {
    b.disabled = true;
    b.classList.remove('jugo-pega');
    if (b.dataset.texto === correcta) b.classList.add('es-correcta');
    else if (b.dataset.texto === texto) b.classList.add('es-elegida');
    else b.classList.add('es-otra');
  }
  // Los botones quedaron deshabilitados: el foco vuelve a la pregunta, no al `<body>`.
  const enunciado = estaFicha.querySelector<HTMLElement>('.enunciado');
  if (enunciado) enfocar(enunciado);

  /*
   * El primer tiempo del cierre, en el mismo tick del toque: el tablero se pone al día (el
   * paso del riel, y la ficha de vida que se parte si erraste), el sello grande cae sobre la
   * pregunta y, si erraste, la pantalla da un golpe. Si era la última vida, el golpe es doble.
   */
  ponerTableroAlDia(true, perdioUna);
  sellarLaPregunta(acerto);
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
    if (termino) window.setTimeout(() => sonarEfecto('golpe'), 170);
  }

  /*
   * El segundo tiempo llega solo, y **se puede adelantar con un toque** en la partida (o con
   * Enter o la barra). Adelantar no saltea: la ficha se arma una sola vez (`conFicha`), venga
   * de su reloj o del toque. Con movimiento reducido la espera vale cero.
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
    if (vigente()) pintarFicha(item!, acerto, correcta);
  }
  const espera = duracionDe('--duracion-pasada') + duracionDe('--duracion-umbral') + duracionDe('--duracion-paso');
  if (espera <= 0) {
    mostrarLaFicha();
    return;
  }
  reloj = window.setTimeout(mostrarLaFicha, espera);
  // El toque que eligió la opción no cuenta: se empieza a escuchar en la vuelta siguiente.
  // Se escucha el `click` y no el `pointerdown`: la ficha corre la hoja, y con `pointerdown` el
  // `click` de ese mismo toque caía después sobre lo que hubiera quedado bajo el dedo —"Seguí",
  // en un teléfono bajo—, y se salteaba la respuesta entera (medido a 320 × 568).
  window.setTimeout(() => {
    if (conFicha || !vigente()) return;
    zonaPartida.addEventListener('click', alTocar);
    document.addEventListener('keydown', alTeclear);
  }, 0);
}

/**
 * El segundo tiempo: la ficha de la respuesta, con la gramática de los otros juegos pulidos —
 * la marca y el grito estampados, lo que sumaste, la respuesta escrita grande con la tapa del
 * disco, el dato, el sello de leyenda o testimonio, y "Seguí" adentro, cerrando la columna—.
 * Las dos opciones que no eran ni la tuya ni la buena se van: lo que queda arriba es lo que
 * dice algo. Debajo, en un renglón, el enlace a Spotify y la puerta para corregir.
 */
function pintarFicha(item: Item, acerto: boolean, correcta: string): void {
  zonaPartida.classList.add('partida--revelada');
  dejarLaMarca(acerto);
  listaEl.classList.add('opciones--cerradas');
  anotarRacha();

  ultimoFeedback = variante(acerto ? ACIERTOS : ERRORES, ultimoFeedback, Math.random);

  // `revelacion` es la pieza de "Adiviná el tema": el acierto se estampa como sello de goma.
  const panel = el('div', `feedback revelacion ficha-respuesta jugo-pega ${acerto ? 'ok' : 'no'}`);
  // Region viva: se inserta VACIA a proposito — un lector de pantalla anuncia los cambios
  // de una region que ya existe con mucha mas confiabilidad que una recien nacida. Lo que se
  // anuncia es lo que dice la ficha, sin el botón (`UX-09`).
  const dice = el('div', 'ficha-respuesta-dice');
  dice.setAttribute('role', 'status');
  panel.append(dice);
  zonaPartida.append(panel);

  const cabeza = el('div', 'revelacion-cabeza');
  cabeza.append(dibujo('span', 'ficha-respuesta-marca', acerto ? '✔︎' : '✕︎'), el('p', 'micro', ultimoFeedback));
  const sumaEl = acerto ? dibujo('span', 'revelacion-suma', FICHIN.suma) : null;
  if (sumaEl) cabeza.append(sumaEl);
  dice.append(cabeza);
  // La racha redonda (tres, cinco, diez): un segundo sello, que cae un compás después.
  const grito = acerto ? RACHAS[racha(partida)] : undefined;
  if (grito) dice.append(el('p', 'racha-grito', grito));

  // La respuesta escrita grande, siempre: en el error es lo que hay que llevarse, y en el
  // acierto es el premio. Con la tapa del disco al lado, cuando la pregunta tiene disco.
  const cuerpo = el('div', 'respuesta-cuerpo');
  if (item.disco) {
    const tapa = el('img', 'respuesta-tapa');
    tapa.src = `/tapas/${item.disco}.jpg`;
    tapa.alt = altTapa(tituloDelDisco(item.disco));
    tapa.width = 88;
    tapa.height = 88;
    tapa.decoding = 'async';
    cuerpo.append(tapa);
  }
  const texto2 = el('div', 'respuesta-texto');
  texto2.append(el('p', 'respuesta-dato', correcta));
  texto2.append(el('p', 'explicacion', item.explicacion));
  cuerpo.append(texto2);
  dice.append(cuerpo);

  // El sello completo se revela recien ahora.
  const sello = selloRevelado(item);
  if (sello) {
    const caja = el('div', `sello sello--${item.clase}`);
    caja.append(el('strong', undefined, sello.etiqueta));
    caja.append(el('span', undefined, ` ${sello.detalle}`));
    dice.append(caja);
  }

  /*
   * El avance lo manda el dedo, siempre. No hay temporizador (`UX-01` v2, WCAG 2.2.1).
   * "Seguí" va adentro de la ficha y afuera de la región viva: así se anuncia el resultado y
   * la explicación, y no "SEGUÍ, botón" mezclado con ellos.
   */
  const termino = partida.desenlace !== 'jugando';
  const seguir = el('button', 'primario seguir-ficha', termino ? FICHIN.alResultado : BOTON_SEGUIR);
  seguir.type = 'button';
  seguir.addEventListener('click', avanzar, { once: true });
  panel.append(seguir);

  /*
   * El zócalo (`UX-09`): afuera del panel y después de "Seguí" en el orden del DOM. A la
   * izquierda el enlace a Spotify —FIND-18 / RQ-B8: vive en su propio módulo; borrar
   * `spotify.ts` y esta llamada saca Spotify del sitio entero sin romper nada más—, y a la
   * derecha el botón de corrección (`BR-21` criterio 4).
   */
  const zocalo = el('div', 'ficha-pie ficha-zocalo');
  const spot = botonSpotify(item.spotify?.trackId);
  if (spot) {
    const linea = el('p', 'fuente-verso');
    linea.append(spot);
    zocalo.append(linea);
  }
  zocalo.append(
    botonCorreccion(() => ({
      juego: 'quiz',
      itemId: item.id,
      ubicacion: 'la respuesta correcta',
      dice: `${item.enunciado} → ${correcta}`,
      rotulo: item.clase,
      banco: { contrato: 'CTR-02', version: 1 },
    })),
  );
  zonaPartida.append(zocalo);

  // Lo que sumaste vuela del sello de la ficha a la cuenta de la cabecera, que sube al llegar.
  const total = aciertosDe(partida);
  if (acerto && sumaEl) {
    const cual = partida.elegidas.length;
    const destino = llevasEl;
    const sigue = (): boolean => partida.elegidas.length === cual && destino.isConnected;
    window.setTimeout(
      () => {
        if (!sigue()) return;
        // Si ya se pasó de pregunta, la ficha no está: la cuenta se pone al día sin vuelo.
        if (!sumaEl.isConnected) {
          destino.textContent = FICHIN.llevas(total);
          return;
        }
        volar(FICHIN.suma, 'suma-vuela', sumaEl, destino, () => {
          if (!sigue()) return;
          contar(destino, total - 1, total, FICHIN.llevas);
          estampar(destino);
        });
      },
      duracionDe('--duracion-umbral') + duracionDe('--escalon-pasada'),
    );
  } else {
    llevasEl.textContent = FICHIN.llevas(total);
  }

  // El foco va a "Seguí" sin arrastrar la vista. El anillo se dibuja si se llegó con el
  // teclado y no si se llegó con el dedo.
  if (conPuntero) {
    seguir.classList.add('seguir--sin-anillo');
    seguir.addEventListener('blur', () => seguir.classList.remove('seguir--sin-anillo'), { once: true });
  }
  seguir.focus({ preventScroll: true });
  // Hasta el zócalo: así "Seguí" queda entero a la vista, en la zona del pulgar.
  zocalo.scrollIntoView({ block: 'nearest' });
}

/**
 * El pase, que es una sola historia: la ficha de la respuesta se va, **la pantalla se apaga**
 * (se cierra a una línea, como un tubo), la rueda del contador da la vuelta y la pantalla
 * vuelve a prender con la pregunta nueva; recién ahí se apoyan las teclas. Un sub-paso cada
 * mitad. Con movimiento reducido el sub-paso vale cero y la pregunta nueva aparece puesta.
 */
function avanzar(): void {
  sonarEfecto('tecla');
  // Quien decide si la partida sigue es `vidas.ts`, no esta funcion.
  if (partida.desenlace !== 'jugando') {
    pintarResultado();
    return;
  }
  const vieja = fichaEl;
  const ms = duracionDe('--duracion-umbral');
  if (ms <= 0 || !vieja?.isConnected) {
    pintarPregunta();
    window.scrollTo({ top: 0 });
    return;
  }
  for (const hijo of [...zonaPartida.children]) if (hijo !== tableroEl && hijo !== vieja) hijo.remove();
  window.scrollTo({ top: 0 });
  vieja.classList.remove('ficha-pregunta--prende');
  vieja.classList.add('ficha-pregunta--apaga');
  // El foco no se queda en un botón que ya no está.
  enfocar(vieja);
  window.setTimeout(() => {
    if (fichaEl !== vieja) return;
    pintarPregunta();
  }, ms * 0.6);
}

/* ---- El resultado ---- */

/**
 * La planilla: pregunta por pregunta, partida en escalones. Lo que el riel iba diciendo
 * durante la partida, puesto entero al final. Cada casilla lleva simbolo (✔ ✕ ·), no solo
 * tinta; para el lector de pantalla es una imagen con su cuenta.
 */
function planilla(p: Partida<Item>): HTMLElement {
  const h = historial(p);
  const caja = el('div', 'planilla');
  caja.append(el('p', 'planilla-rotulo', PLANILLA.rotulo));
  const grilla = el('div', 'planilla-grilla');
  const ok = h.filter(Boolean).length;
  const no = h.length - ok;
  const resto = p.orden.length - h.length;
  grilla.setAttribute('role', 'img');
  grilla.setAttribute(
    'aria-label',
    `${ok} ${PLANILLA.acertada}${ok === 1 ? '' : 's'}, ${no} ${PLANILLA.errada}${no === 1 ? '' : 's'}, ${resto} ${PLANILLA.sinJugar}`,
  );
  escalones(p).forEach((g, k) => {
    const tramo = el('div', 'planilla-tramo jugo-pega');
    tramo.style.setProperty('--orden', String(k + 5));
    tramo.append(el('span', 'planilla-nivel', (NOMBRE_NIVEL[g.nivel] ?? g.nivel).toUpperCase()));
    const casillas = el('div', 'planilla-casillas');
    for (const i of g.indices) {
      const estado = i < h.length ? (h[i] ? 'ok' : 'no') : 'resto';
      const casilla = el('span', `planilla-casilla planilla-casilla--${estado}`, estado === 'ok' ? '✔︎' : estado === 'no' ? '✕︎' : '·');
      // La planilla se llena casilla por casilla, en el orden en que se jugó.
      if (estado !== 'resto') casilla.style.setProperty('--orden', String(i));
      casillas.append(casilla);
    }
    tramo.append(casillas);
    grilla.append(tramo);
  });
  caja.append(grilla);
  return caja;
}

/** La tarjeta de la partida, en el idioma del fichín. Nunca tira: si no se puede, `null`. */
async function dibujarLaTarjeta(): Promise<Blob | null> {
  const r = resultadoDe(partida);
  if (!r) return null;
  try {
    return await dibujarFichin({
      juego: FICHIN.juego,
      rotulo: DESENLACES[r.desenlace].rotulo,
      titulo: DESENLACES[r.desenlace].titulo,
      numero: numeroDePregunta(r.pregunta),
      recorrido: lineaRecorrido(r),
      aciertos: lineaAciertos(r),
      vidas: partida.vidas,
      fichas: FICHAS,
      escalones: escalones(partida).map((g) => ({
        nivel: (NOMBRE_NIVEL[g.nivel] ?? g.nivel).toUpperCase(),
        casillas: g.indices.map((i) => {
          const h = historial(partida);
          return i < h.length ? (h[i] ? 'ok' : 'no') : 'resto';
        }),
      })),
      sitio: location.host + location.pathname,
    });
  } catch {
    // La tarjeta es el premio, no el camino.
    return null;
  }
}

/** `T-41`, `T-42` y `T-143` — el resultado, que son tres desenlaces y no tres tramos. */
function pintarResultado(): void {
  const r = resultadoDe(partida)!;
  const { titulo, rotulo } = DESENLACES[r.desenlace];
  const sinPerderUna = r.desenlace === 'victoria' && partida.vidas === FICHAS;

  zonaResultado.replaceChildren();

  let orden = 0;
  const entra = <T extends HTMLElement>(pieza: T, clase = 'jugo-entra'): T => {
    pieza.classList.add(clase);
    pieza.style.setProperty('--orden', String(orden++));
    return pieza;
  };

  // Registro 3 primero: el rotulo dice que hay adentro y se calla. Estampado como sello
  // de goma, pero sin tinta propia por desenlace: lo que dice como te fue es la palabra.
  const marcador = el('p', 'rotulo-desenlace', rotulo);
  marcador.id = 'rotulo-desenlace';
  zonaResultado.append(marcador);

  const recorrido = el('p', 'puntaje', lineaRecorrido(r));
  recorrido.id = 'recorrido';
  const acertadas = el('p', 'tenue', lineaAciertos(r));
  acertadas.id = 'acertadas';

  // El foco aterriza en el encabezado, que es la noticia, y se lleva puestos el rotulo y
  // los dos datos: los cuatro son una sola cosa.
  const encabezado = entra(el('h2', `tramo tramo--${r.desenlace}`, titulo));
  encabezado.setAttribute('aria-describedby', `${marcador.id} ${recorrido.id} ${acertadas.id}`);
  zonaResultado.append(encabezado);

  // El numero grande es la ficha a la que llegaste: sube en escalones y apoya como un sello.
  // Decorativo para el lector: la frase de abajo dice lo mismo con todas las palabras. Al
  // lado, las fichas como quedaron, cuando el desenlace las cuenta (`BR-19` apartado 6.4: en
  // la victoria no son un dato).
  const cuenta = entra(el('div', 'cuenta-vuelta cuenta-fichin'));
  const numero = dibujo('p', 'resultado-numero');
  contar(numero, 0, r.pregunta, numeroDePregunta);
  cuenta.append(numero);
  window.setTimeout(() => sonarEfecto(r.desenlace === 'derrota' ? 'golpe' : 'sello'), duracionDe('--duracion-cuenta'));
  // El crédito se gastó: el contador de la máquina vuelve a 00 cuando la cifra terminó de
  // contar. "Jugá de nuevo" es poner otra ficha.
  const creditos = dibujo('p', 'maquina-creditos');
  const ruedas = armarContador(1, 2);
  creditos.append(el('span', 'maquina-rotulo', FICHIN.creditos), ruedas);
  window.setTimeout(
    () => {
      if (rodarContador(ruedas, 0)) sonarEfecto('tecla');
    },
    duracionDe('--duracion-cuenta') + duracionDe('--duracion-umbral'),
  );
  if (r.desenlace !== 'victoria') {
    const fichas = marcadorVidas(partida.vidas);
    fichas.removeAttribute('id');
    fichas.setAttribute('aria-hidden', 'true');
    fichas.removeAttribute('role');
    fichas.classList.add('vidas--resultado');
    cuenta.append(fichas);
  }
  cuenta.append(creditos);
  if (sinPerderUna) {
    // La hazaña: agotar el banco con las tres fichas en pie. Doble filete y un segundo sello.
    numero.classList.add('resultado-numero--hazana');
    cuenta.append(el('p', 'hazana-sello', FICHIN.hazana));
    window.setTimeout(() => sonarEfecto('sello'), duracionDe('--duracion-cuenta') + 160);
  }
  zonaResultado.append(cuenta, entra(recorrido), entra(acertadas));

  // Solo la retirada muestra las vidas (`BR-19` apartado 6.4).
  const vidas = lineaVidas(r);
  if (vidas) zonaResultado.append(entra(el('p', 'tenue', vidas)));

  zonaResultado.append(entra(planilla(partida)));

  // FIND-17: las variantes de `CNT-10`, no un string inventado aca.
  if (desafio) zonaResultado.append(entra(el('p', 'comparacion', comparacion(r, desafio))));

  /*
   * El pie del resultado (`.pie-resultado`): la misma pieza y el mismo orden que los otros
   * juegos pulidos — la tarjeta que asoma, "Compartí" (el primario, en la letra de la firma,
   * `D-65`), lo que compartir tenga para decir y la otra vuelta. El resultado viaja como
   * desafío, forma `recorrido` (`ADR-02` v2): hasta dónde llegó y cómo terminó. La planilla va
   * debajo de la frase de `CNT-10`: lo respondido, escalón por escalón.
   */
  const pie = entra(el('div', 'pie-resultado'));
  const { boton: compartir, salida } = botonCompartir(COMPARTIR, () => {
    const marcas = planillaParaCompartir(respondidasPorEscalon(partida));
    return {
      texto: marcas ? [textoParaCompartir(r), marcas].join('\n') : textoParaCompartir(r),
      url: armarLink(location.origin + location.pathname, {
        forma: 'recorrido',
        juego: JUEGO,
        puntaje: r.pregunta,
        total: r.total,
        desenlace: r.desenlace,
      }),
      archivo: archivoDeLaTarjeta,
    };
  });

  // La tarjeta asoma: lo que vas a compartir se ve antes de tocar el botón. Se dibuja una vez.
  const asoma = dibujo('div', 'tarjeta-asoma');
  asoma.addEventListener('click', () => compartir.click());
  if (urlDeLaTarjeta) URL.revokeObjectURL(urlDeLaTarjeta);
  urlDeLaTarjeta = '';
  archivoDeLaTarjeta = null;
  const estaTarjeta = dibujarLaTarjeta();
  tarjetaDeLaPartida = estaTarjeta;
  void estaTarjeta.then((imagen) => {
    if (tarjetaDeLaPartida !== estaTarjeta || !asoma.isConnected) return;
    if (!imagen) {
      asoma.remove();
      return;
    }
    archivoDeLaTarjeta = new File([imagen], nombreArchivo('preguntas-ricoteras'), { type: 'image/png' });
    urlDeLaTarjeta = URL.createObjectURL(imagen);
    const foto = el('img', 'jugo-pega');
    foto.alt = '';
    foto.src = urlDeLaTarjeta;
    asoma.append(foto);
  });

  const denuevo = el('button', 'secundario', BOTON_DE_NUEVO);
  denuevo.type = 'button';
  denuevo.addEventListener('click', () => {
    sonarEfecto('clac');
    comenzar();
  });
  pie.append(asoma, compartir, salida, denuevo);
  zonaResultado.append(pie);

  // La salida hacia el arcade: la misma cinta de regreso de la portada, no un boton nuevo.
  const salidaAlArcade = el('p', 'salida-resultado');
  const alArcade = el('a', 'volver', `← ${FICHIN.volver}`);
  alArcade.href = '/';
  salidaAlArcade.append(alArcade);
  zonaResultado.append(salidaAlArcade);

  mostrar(zonaResultado);
  window.scrollTo({ top: 0 });
  enfocar(encabezado);
}
