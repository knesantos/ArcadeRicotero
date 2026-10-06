/**
 * La isla del quiz: partida, resultado y compartir. `T-40`, `T-41`, `T-42`, `T-143`.
 *
 * Implementa `UX-01` v2, `BR-01`, `BR-04`, `BR-19`, `UX-07`, `CNT-10` y `ADR-02` v2. Todo
 * el texto sale de `copy.ts` y toda la logica de reglas de `lib/quiz/`: este archivo es
 * solo el pegamento con el DOM.
 *
 * **Regla que atraviesa todo el archivo: nada se escribe con `innerHTML`.** El unico dato
 * externo que entra al sitio es el nombre del desafio, y `ADR-02` fue explicito en que un
 * nombre inyectado desde la URL es XSS reflejado de manual. Usar `textContent` en todos
 * lados hace que la clase entera de bug sea imposible, no improbable.
 *
 * ## Lo que cambio en el ciclo 9
 *
 * El quiz dejo de ser una ronda fija de 8 con nota final y paso a **partida por vidas**
 * (`BR-19`). Este archivo ya no llama a `armarRonda` ni a `tramo` — los dos siguen
 * existiendo intactos porque los usan los otros juegos —, sino a `lib/quiz/vidas.ts`, que
 * compone sobre ellos. Toda la logica de cuando termina una partida vive alla y esta
 * testeada; aca solo se pinta.
 */

import {
  comenzar as comenzarPartida,
  responder as responderPartida,
  retirarse,
  actual,
  abreEscalon,
  resultado as resultadoDe,
  type Partida,
} from '../lib/quiz/vidas.ts';
import { leerDesafio, armarLink } from '../lib/desafio.ts';
import { botonSpotify } from './spotify.ts';
import type { Item } from '../lib/quiz/banco.ts';
import {
  ACIERTOS,
  BOTON_COMPARTIR,
  BOTON_DE_NUEVO,
  BOTON_RETIRARSE,
  BOTON_SEGUIR,
  DESENLACES,
  ENLACE_COPIADO,
  ERRORES,
  RETIRADA_CONFIRMA,
  VIDAS_ROTULO,
  avisoEscalon,
  comparacion,
  etiquetaCategoria,
  etiquetaNivel,
  insignia,
  lineaAciertos,
  lineaRecorrido,
  lineaVidas,
  NOMBRE_NIVEL,
  selloRevelado,
  subtituloDesafio,
  textoParaCompartir,
  variante,
} from '../lib/quiz/copy.ts';
import { PORTAL } from '../lib/sitio/copy.ts';
import { botonCorreccion } from './correccion.ts';

/** Quien soy, para `leerDesafio`. Ver `FIND-28` en `desafio.ts`. */
const JUEGO = 'quiz';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const portada = $('portada');
const zonaPartida = $('partida');
const zonaResultado = $('resultado');

const banco: Item[] = JSON.parse($('banco').textContent ?? '[]');
const desafio = leerDesafio(location.search, JUEGO);

let partida: Partida<Item>;
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
if (desafio) $('subtitulo').textContent = subtituloDesafio(desafio);

$('jugar').addEventListener('click', comenzar);

function comenzar(): void {
  partida = comenzarPartida(banco);
  mostrar(zonaPartida);
  pintarPregunta();
}

/**
 * Cuantas van del escalon en curso, y cuantas tiene.
 *
 * No sale de ninguna constante: se cuenta sobre el orden real que armo `vidas.ts`. Es la
 * misma razon por la que `vidas.ts` no tiene un largo de escalon — el escalon **es** el
 * pozo, y el pozo lo define el banco (`BR-19` apartado 2).
 */
function posicionEnEscalon(p: Partida<Item>): { nivel: string; van: number; total: number } {
  const nivel = p.orden[p.indice]!.dificultad;
  const delNivel = p.orden.filter((i) => i.dificultad === nivel);
  const primero = p.orden.findIndex((i) => i.dificultad === nivel);
  return { nivel, van: p.indice - primero + 1, total: delNivel.length };
}

/** El marcador de vidas: tres sellos, y la palabra. `UX-07` — ningun estado por color solo. */
function marcadorVidas(vidas: number): HTMLElement {
  const caja = el('div', 'vidas');
  caja.append(el('span', 'vidas-rotulo', VIDAS_ROTULO));
  for (let i = 0; i < 3; i++) {
    const viva = i < vidas;
    // El simbolo va ademas del color, no en su lugar: el trazo es el mismo `✕` que ya
    // marca la opcion errada, porque errar es la unica causa posible de perder una vida.
    caja.append(el('span', `vida ${viva ? 'vida--viva' : 'vida--ida'}`, viva ? '◆' : '✕︎'));
  }
  caja.setAttribute('role', 'img');
  caja.setAttribute('aria-label', `${VIDAS_ROTULO}: ${vidas} de 3`);
  return caja;
}

/** `T-40` — la pregunta, con la insignia de rotulo **antes** de responder (`UX-01` v2). */
function pintarPregunta(): void {
  const item = actual(partida)!;
  zonaPartida.replaceChildren();

  const cab = el('div', 'cabecera');
  cab.id = 'cabecera-pregunta';
  cab.append(marcadorVidas(partida.vidas));

  const pos = posicionEnEscalon(partida);
  // Reemplaza al viejo "N de 8". La fraccion sobre 40 se reserva para el resultado y para
  // el momento de retirarse, donde si importa saber cuanto falta (`UX-07`).
  cab.append(el('span', 'paso', etiquetaNivel(pos.nivel, pos.van, pos.total)));
  // La clase sigue llevando el identificador (la mezcla D-19 la pinta por ahi); lo que se
  // lee sale de la tabla de etiquetas, porque `mitologia` en mayusculas se leia sin tilde.
  cab.append(el('span', `categoria categoria--${item.categoria}`, etiquetaCategoria(item.categoria)));

  // La insignia va antes de tocar: el que conoce la historia real tiene que saber que se
  // le pregunta "que se cuenta" y no "que paso".
  const ins = insignia(item.clase);
  if (ins) cab.append(el('span', `insignia insignia--${item.clase}`, ins));
  zonaPartida.append(cab);

  // El aviso de escalon aparece una sola vez por salto y no corta el ritmo con una
  // pantalla intermedia: `UX-07` descarto el "¡subiste de nivel!" por ese motivo.
  if (abreEscalon(partida)) {
    const aviso = el('p', 'escalon', avisoEscalon(pos.nivel));
    aviso.setAttribute('role', 'status');
    zonaPartida.append(aviso);
  }

  const enunciado = el('h2', 'enunciado', item.enunciado);
  // El foco aterriza en la pregunta, pero las vidas, el nivel, la categoria y —sobre
  // todo— la insignia de rotulo tienen que llegar con ella: saber que se pregunta "que se
  // cuenta" y no "que paso" es justo lo que `UX-01` v2 pide que se sepa ANTES de responder.
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

  zonaPartida.append(disparadorRetirada());
  enfocar(enunciado);
}

/**
 * El boton que cierra la partida. `BR-19` apartado 7.
 *
 * Va **lejos de la zona pulgar** y en texto chico, no como boton primario: si quedara a
 * mano de las opciones, la gente se retiraria sin querer. Y lleva **confirmacion de dos
 * pasos** que muestra hasta donde llegaste antes de decidir — `UX-07` descarto el "tocar y
 * deshacer con temporizador" por el mismo motivo por el que `UX-01` ya habia sacado el
 * auto-avance: un limite de tiempo que no se puede apagar es WCAG 2.2.1 (Nivel A).
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
  const previo = zonaPartida.querySelector('.retirada');
  if (!previo) return;
  const caja = el('div', 'retirada retirada--confirma');
  caja.setAttribute('role', 'group');

  const pos = posicionEnEscalon(partida);
  caja.append(el('p', 'retirada-pregunta', RETIRADA_CONFIRMA.pregunta));
  // Mostrar hasta donde llegaste **antes** de decidir: es el dato que hace la decision.
  caja.append(el('p', 'tenue', `Pregunta ${partida.indice + 1} de ${partida.orden.length} · nivel ${NOMBRE_NIVEL[pos.nivel] ?? pos.nivel}`));

  const si = el('button', 'secundario', RETIRADA_CONFIRMA.aceptar);
  si.type = 'button';
  si.addEventListener('click', () => {
    partida = retirarse(partida);
    pintarResultado();
  });
  const no = el('button', 'primario', RETIRADA_CONFIRMA.volver);
  no.type = 'button';
  no.addEventListener('click', () => {
    caja.replaceWith(disparadorRetirada());
  });
  caja.append(no, si);
  previo.replaceWith(caja);
  enfocar(no);
}

function responder(texto: string): void {
  const item = actual(partida)!;
  const correcta = item.opciones.find((o) => o.correcta)!;
  const acerto = texto === correcta.texto;
  const antes = partida;
  partida = responderPartida(partida, texto);

  for (const b of zonaPartida.querySelectorAll<HTMLButtonElement>('.opcion')) {
    b.disabled = true;
    if (b.textContent === correcta.texto) b.classList.add('es-correcta');
    else if (b.textContent === texto) b.classList.add('es-elegida');
  }
  // Al perder una vida, el marcador cambia en el mismo tick que el feedback y se anuncia
  // en la misma region viva: son la misma noticia (`UX-07`). `CNT-10` decidio que no lleva
  // texto propio — el conteo ya se ve, y una frase extra sumaria dureza al que menos sabe.
  if (!acerto) {
    zonaPartida.querySelector('.vidas')?.replaceWith(marcadorVidas(partida.vidas));
  }
  void antes;

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

  // `BR-21` criterio 4: el boton de correccion va en `US-01`, `US-03` y `US-07`. Faltaba
  // aca, y lo encontro `REV-08` (`FIND-32`) — el quiz es el juego con mas items del sitio
  // y el que mas afirma cosas verificables, asi que era justo donde mas hacia falta.
  //
  // Va **despues** de `Seguí` y afuera del panel de feedback, que es `role="status"`.
  zonaPartida.append(
    botonCorreccion(() => ({
      juego: 'quiz',
      itemId: item.id,
      ubicacion: 'la respuesta correcta',
      dice: `${item.enunciado} → ${correcta.texto}`,
      // `clase` ya es el enum de `D-14` (hecho | leyenda | testimonio) y viaja al
      // cliente; `esLeyenda` y `fuentes` se quedan del lado del build a proposito
      // (`aPayload`), asi que no hay de donde sacarlas ni falta.
      rotulo: item.clase,
      banco: { contrato: 'CTR-02', version: 1 },
    })),
  );

  seguir.focus();
}

function avanzar(): void {
  // Quien decide si la partida sigue es `vidas.ts`, no esta funcion: aca solo se mira el
  // desenlace que ya quedo fijado al responder.
  if (partida.desenlace === 'jugando') pintarPregunta();
  else pintarResultado();
}

/** `T-41`, `T-42` y `T-143` — el resultado, que ahora son tres desenlaces y no tres tramos. */
function pintarResultado(): void {
  const r = resultadoDe(partida)!;
  const { titulo, rotulo } = DESENLACES[r.desenlace];

  zonaResultado.replaceChildren();

  // Registro 3 primero: el rotulo dice que hay adentro y se calla.
  //
  // Sin modificador por desenlace: `rotulo--victoria`, `--derrota` y `--retirada` se
  // creaban aca y **ninguna hoja las pintaba** (lo encontro la red derivada de
  // `estilos.test.ts`). Y es coherente con el registro: lo que dice como te fue es la
  // palabra —VICTORIA, DERROTA, RETIRADA—, no el color, que es lo que pide `UX-01`.
  const marcador = el('p', 'rotulo-desenlace', rotulo);
  marcador.id = 'rotulo-desenlace';
  zonaResultado.append(marcador);

  const recorrido = el('p', 'puntaje', lineaRecorrido(r));
  recorrido.id = 'recorrido';
  const acertadas = el('p', 'tenue', lineaAciertos(r));
  acertadas.id = 'acertadas';

  // El foco aterriza en el encabezado, que es la noticia, y se lleva puestos el rotulo y
  // los dos datos: los cuatro son una sola cosa.
  const encabezado = el('h2', `tramo tramo--${r.desenlace}`, titulo);
  encabezado.setAttribute('aria-describedby', `${marcador.id} ${recorrido.id} ${acertadas.id}`);
  zonaResultado.append(encabezado, recorrido, acertadas);

  // Solo la retirada muestra las vidas: en victoria siempre quedo al menos una y en
  // derrota siempre cero, asi que ahi el dato no distingue nada (`BR-19` apartado 6.4).
  const vidas = lineaVidas(r);
  if (vidas) zonaResultado.append(el('p', 'tenue', vidas));

  // FIND-17: las variantes de `CNT-10`, no un string inventado aca.
  if (desafio) zonaResultado.append(el('p', 'comparacion', comparacion(r, desafio)));

  // "COMPARTÍ" con tilde (`D-17`), en la letra de la firma: desde `D-65` la Í existe,
  // derivada de la propia letra. Antes caía al repuesto a mitad de palabra y llevaba
  // `con-tilde` para irse entera a la rotulada.
  const compartir = el('button', 'primario firma', BOTON_COMPARTIR);
  compartir.type = 'button';
  compartir.addEventListener('click', () => void compartirResultado());
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

async function compartirResultado(): Promise<void> {
  const r = resultadoDe(partida)!;
  // Forma `recorrido` de `ADR-02` v2: hasta donde llego y como termino. No viajan ni los
  // aciertos ni las vidas — el resultado propio y el desafio que viaja no son el mismo
  // dato, y bajo vidas los aciertos son casi la pregunta alcanzada.
  const url = armarLink(location.origin + location.pathname, {
    forma: 'recorrido',
    juego: JUEGO,
    puntaje: r.pregunta,
    total: r.total,
    desenlace: r.desenlace,
  });
  const texto = textoParaCompartir(r);

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
    zonaResultado.append(el('p', 'tenue', ENLACE_COPIADO));
  } catch {
    // Sin portapapeles tampoco: mostrar el link para copiarlo a mano. Nadie queda afuera.
    zonaResultado.append(el('p', 'link', url));
  }
}
