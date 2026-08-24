/**
 * La isla del quiz: partida, resultado y compartir. `T-40`, `T-41`, `T-42`.
 *
 * Implementa `UX-01` v2, `BR-01`, `BR-02`(no aplica aca), `BR-04`, `BR-05` y `ADR-02`.
 * Todo el texto sale de `copy.ts` y toda la logica de reglas de `lib/quiz/`: este archivo
 * es solo el pegamento con el DOM.
 *
 * **Regla que atraviesa todo el archivo: nada se escribe con `innerHTML`.** El unico dato
 * externo que entra al sitio es el nombre del desafio, y `ADR-02` fue explicito en que un
 * nombre inyectado desde la URL es XSS reflejado de manual. Usar `textContent` en todos
 * lados hace que la clase entera de bug sea imposible, no improbable.
 */

import { armarRonda, contarAciertos } from '../lib/quiz/ronda.ts';
import { tramo } from '../lib/quiz/tramo.ts';
import { leerDesafio, armarLink } from '../lib/desafio.ts';
import { botonSpotify } from './spotify.ts';
import type { Item } from '../lib/quiz/banco.ts';
import {
  ACIERTOS,
  BOTON_COMPARTIR,
  comparacion,
  BOTON_DE_NUEVO,
  BOTON_SEGUIR,
  ERRORES,
  TRAMOS,
  etiquetaCategoria,
  insignia,
  selloRevelado,
  subtituloDesafio,
  textoParaCompartir,
  variante,
} from '../lib/quiz/copy.ts';
import { PORTAL } from '../lib/sitio/copy.ts';

const LARGO_RONDA = 8; // US-01 criterio 1

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const portada = $('portada');
const zonaPartida = $('partida');
const zonaResultado = $('resultado');

const banco: Item[] = JSON.parse($('banco').textContent ?? '[]');
const desafio = leerDesafio(location.search);

let ronda: readonly Item[] = [];
let indice = 0;
let elegidas: (string | null)[] = [];
let ultimoFeedback: string | null = null;

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

function mostrar(seccion: HTMLElement): void {
  for (const s of [portada, zonaPartida, zonaResultado]) s.hidden = s !== seccion;
}

/**
 * Llevar el foco a lo primero de la pantalla nueva.
 *
 * Este juego cambia de pantalla sin cambiar de pagina, y el navegador no tiene forma de
 * saberlo: el foco se quedaba en el `<body>`. Medido el 2026-08-24 — al tocar `JUGÁ`, en
 * cada avance y al llegar al resultado, `document.activeElement` era `BODY`. Quien juega
 * con teclado tenia que tabular desde la cinta de regreso en cada pregunta, y quien usa
 * lector de pantalla no se enteraba de nada: ni del acierto, ni del error, ni del puntaje.
 *
 * Es el mismo principio de los molinetes abiertos, aplicado a quien no ve la pantalla.
 */
function enfocar(destino: HTMLElement): void {
  // -1 lo hace enfocable por codigo sin meterlo en el orden de tabulacion: el foco llega
  // ahi cuando la pantalla cambia, pero nadie tiene que pasar por el tabulando.
  destino.tabIndex = -1;
  destino.focus();
}

// Pantalla 0: si se llego por un desafio, el subtitulo lo dice.
if (desafio) {
  $('subtitulo').textContent = subtituloDesafio(desafio.nombre, desafio.puntaje, desafio.total);
}

$('jugar').addEventListener('click', comenzar);

function comenzar(): void {
  ronda = armarRonda(banco, LARGO_RONDA);
  indice = 0;
  elegidas = [];
  mostrar(zonaPartida);
  pintarPregunta();
}

/** `T-40` — la pregunta, con la insignia de rotulo **antes** de responder (`UX-01` v2). */
function pintarPregunta(): void {
  const item = ronda[indice]!;
  zonaPartida.replaceChildren();

  const cab = el('div', 'cabecera');
  cab.id = 'cabecera-pregunta';
  cab.append(el('span', 'paso', `${indice + 1} de ${ronda.length}`));
  // La clase sigue llevando el identificador (la mezcla D-19 la pinta por ahi); lo que se
  // lee sale de la tabla de etiquetas, porque `mitologia` en mayusculas se leia sin tilde.
  cab.append(el('span', `categoria categoria--${item.categoria}`, etiquetaCategoria(item.categoria)));

  // La insignia va antes de tocar: el que conoce la historia real tiene que saber que se
  // le pregunta "que se cuenta" y no "que paso".
  const ins = insignia(item.clase);
  if (ins) cab.append(el('span', `insignia insignia--${item.clase}`, ins));
  zonaPartida.append(cab);

  const enunciado = el('h2', 'enunciado', item.enunciado);
  // El foco aterriza en la pregunta, pero el paso, la categoria y —sobre todo— la
  // insignia de rotulo tienen que llegar con ella: saber que se pregunta "que se cuenta"
  // y no "que paso" es justo lo que `UX-01` v2 pide que se sepa ANTES de responder.
  enunciado.setAttribute('aria-describedby', cab.id);
  zonaPartida.append(enunciado);

  const lista = el('div', 'opciones');
  for (const op of item.opciones) {
    const b = el('button', 'opcion', op.texto);
    b.type = 'button';
    b.addEventListener('click', () => responder(op.texto), { once: true });
    lista.append(b);
  }
  zonaPartida.append(lista);

  enfocar(enunciado);
}

function responder(texto: string): void {
  const item = ronda[indice]!;
  const correcta = item.opciones.find((o) => o.correcta)!;
  const acerto = texto === correcta.texto;
  elegidas.push(texto);

  for (const b of zonaPartida.querySelectorAll<HTMLButtonElement>('.opcion')) {
    b.disabled = true;
    if (b.textContent === correcta.texto) b.classList.add('es-correcta');
    else if (b.textContent === texto) b.classList.add('es-elegida');
  }

  const fuente = acerto ? ACIERTOS : ERRORES;
  ultimoFeedback = variante(fuente, ultimoFeedback, Math.random);
  const panel = el('div', `feedback ${acerto ? 'ok' : 'no'}`);
  // Region viva: lo que aparezca acá adentro se lee solo, sin robarle el foco a nadie.
  // Se inserta VACIA a proposito — un lector de pantalla anuncia los cambios de una
  // region que ya existe con mucha mas confiabilidad que una region recien nacida con
  // todo el texto adentro.
  panel.setAttribute('role', 'status');
  zonaPartida.append(panel);

  panel.append(el('p', 'micro', ultimoFeedback));
  panel.append(el('p', 'explicacion', item.explicacion));

  // El sello completo se revela recien ahora.
  const sello = selloRevelado(item);
  if (sello) {
    const caja = el('div', `sello sello--${item.clase}`);
    caja.append(el('strong', undefined, sello.etiqueta));
    caja.append(el('span', undefined, ` ${sello.detalle}`));
    panel.append(caja);
  }

  // FIND-18 / RQ-B8: el link vive en su propio modulo. Borrar `spotify.ts` y esta
  // llamada saca Spotify del sitio entero sin romper nada mas.
  const spot = botonSpotify(item.spotify?.trackId);
  if (spot) panel.append(spot);

  /*
   * El avance lo manda el dedo, siempre. No hay temporizador.
   *
   * `UX-01` v2 ya habia sacado el auto-avance de los items con rotulo, con este
   * argumento: "un timer fijo no puede servir a la vez a un rotulo de 15 caracteres y a
   * uno de 200". El resto seguia con `setTimeout(..., acerto ? 1200 : 1600)`, y ahi
   * estaba el problema, porque la explicacion es mas larga que varios rotulos: mediana de
   * 171 caracteres, maxima de 379. Medido en pantalla el 2026-08-24, el panel duraba
   * **1.577 ms** con un texto de unos seis segundos de lectura, y eso pasaba en 22 de los
   * 40 items. El sitio tiraba a la basura el trabajo de `contenido` en mas de la mitad de
   * las preguntas, y le pegaba mas fuerte a quien lee mas despacio.
   *
   * De paso saca una violacion de WCAG 2.2.1 (Nivel A): un limite de tiempo que no se
   * puede apagar, alargar ni ajustar.
   *
   * El boton va AFUERA del panel, no adentro: asi la region viva anuncia el resultado y
   * la explicacion, y no "SEGUÍ, boton" mezclado con ellos.
   */
  const seguir = el('button', 'primario', BOTON_SEGUIR);
  seguir.type = 'button';
  seguir.addEventListener('click', avanzar, { once: true });
  zonaPartida.append(seguir);
  seguir.focus();
}

function avanzar(): void {
  indice++;
  if (indice < ronda.length) pintarPregunta();
  else pintarResultado();
}

/** `T-41` y `T-42` — resultado, tramo y compartir. */
function pintarResultado(): void {
  const aciertos = contarAciertos(ronda, elegidas);
  const t = tramo(aciertos, ronda.length);
  const { titulo, bajada } = TRAMOS[t];

  zonaResultado.replaceChildren();

  const marcador = el('p', 'puntaje', `${aciertos}/${ronda.length}`);
  marcador.id = 'puntaje';
  zonaResultado.append(marcador);

  // El foco aterriza en el titulo del tramo, que es el encabezado de la pantalla, y se
  // lleva puestos el puntaje y la bajada: los tres son una sola noticia.
  const encabezado = el('h2', `tramo tramo--${t}`, titulo);
  const bajadaTramo = el('p', 'tenue', bajada);
  bajadaTramo.id = 'bajada-tramo';
  encabezado.setAttribute('aria-describedby', `${marcador.id} ${bajadaTramo.id}`);
  zonaResultado.append(encabezado);
  zonaResultado.append(bajadaTramo);

  // FIND-17: las tres variantes de `D2` en `CNT-05`, no un string inventado aca.
  if (desafio) {
    zonaResultado.append(
      el('p', 'comparacion', comparacion(aciertos, ronda.length, desafio.nombre, desafio.puntaje, desafio.total)),
    );
  }

  // `con-tilde` porque `BOTON_COMPARTIR` dejo de ser "COMPARTIR" y paso a "COMPARTÍ" al
  // aplicarse `D-17`. La letra de la firma es una digitalizacion fan (`RES-42`) y **no
  // tiene los acentos**: medido en el navegador, la `Í` cae en la fuente de repuesto y el
  // boton salia partido a mitad de palabra. La clase manda la palabra a
  // `--fuente-rotulada`, que es completa, sin sacarle la tilde — `D-17` no la negocia.
  const compartir = el('button', 'primario firma con-tilde', BOTON_COMPARTIR);
  compartir.type = 'button';
  compartir.addEventListener('click', () => void compartirResultado(aciertos));
  zonaResultado.append(compartir);

  const denuevo = el('button', 'secundario', BOTON_DE_NUEVO);
  denuevo.type = 'button';
  denuevo.addEventListener('click', comenzar);
  zonaResultado.append(denuevo);

  /*
   * La salida hacia el arcade.
   *
   * Hasta acá el resultado era un callejón sin salida: los dos botones que tenía te
   * dejaban adentro del quiz, y los otros cuatro juegos quedaban atrás del botón del
   * navegador. Justo en el momento de más ganas de seguir jugando. Es la misma cinta de
   * regreso de la portada, no un botón nuevo: la pantalla ya tiene dos y un tercero
   * competiría con ellos.
   */
  const salida = el('p', 'salida-resultado');
  const alArcade = el('a', 'volver', `← ${PORTAL.volverAlArcade}`);
  alArcade.href = '/';
  salida.append(alArcade);
  zonaResultado.append(salida);

  mostrar(zonaResultado);
  enfocar(encabezado);
}

async function compartirResultado(aciertos: number): Promise<void> {
  const url = armarLink(location.origin + location.pathname, {
    juego: 'quiz',
    puntaje: aciertos,
    total: ronda.length,
  });
  const texto = textoParaCompartir(aciertos, ronda.length);

  if (navigator.share) {
    try {
      await navigator.share({ text: texto, url });
      return;
    } catch {
      // El usuario cancelo, o el navegador la rechazo. Cae al respaldo.
    }
  }
  try {
    await navigator.clipboard.writeText(`${texto} ${url}`);
    const aviso = el('p', 'tenue', 'Link copiado.');
    zonaResultado.append(aviso);
  } catch {
    // Sin portapapeles tampoco: mostrar el link para copiarlo a mano. Nadie queda afuera.
    const campo = el('p', 'link', url);
    zonaResultado.append(campo);
  }
}
