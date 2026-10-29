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
 * ## Lo que cambio en el ciclo 20 (`D-71`)
 *
 * El usuario lo jugo y dijo que estaba *"muy duro y feo"*. Medido a 375 px, era cierto: las
 * opciones eran cuatro cajas grises de formulario, la cabecera una linea de 13 px, el
 * `SEGUÍ` quedaba abajo del pliegue y "Cerrá la partida" caia **entre** las opciones y la
 * respuesta, justo donde baja el pulgar. La logica no se toco; cambio todo lo que se ve:
 *
 * - **El tablero** arriba: las tres fichas de vida grandes, el `Nº` de la pregunta y un riel
 *   con un paso por pregunta, partido en los tres escalones. "Cerrá la partida" sube aca,
 *   que es lo mas lejos del pulgar que hay (`BR-19` apartado 7).
 * - **La pregunta es un recorte**: borde de la tinta de su categoria (`D-19`), cinta arriba,
 *   apenas torcido, con los sellos de categoria, nivel y rotulo.
 * - **Las opciones llevan letra** (A, B, C, D), y se eligen tambien con el teclado.
 * - **La respuesta se revela con la tapa del disco** del que se hablaba (`disco` en el
 *   banco), la respuesta correcta escrita grande, el grito estampado del acierto (el mismo
 *   sello de "Adiviná el tema") y la racha cuando la hay.
 * - **`SEGUÍ` va pegado abajo**, en la zona del pulgar, y siempre a la vista.
 * - **El resultado trae la planilla**: pregunta por pregunta, con simbolo.
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
import { escalones, historial, racha, respondidasPorEscalon } from '../lib/quiz/recorrido.ts';
import { leerDesafio, armarLink } from '../lib/desafio.ts';
import { botonSpotify } from './spotify.ts';
import type { Item } from '../lib/quiz/banco.ts';
import { tituloDelDisco } from '../lib/letra/discos.ts';
import {
  ACIERTOS,
  BOTON_COMPARTIR,
  BOTON_DE_NUEVO,
  BOTON_RETIRARSE,
  BOTON_SEGUIR,
  DESENLACES,
  ENLACE_COPIADO,
  ERRORES,
  ESCALON_CANTA,
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
import { PORTAL } from '../lib/sitio/copy.ts';
import { botonCorreccion } from './correccion.ts';

/** Quien soy, para `leerDesafio`. Ver `FIND-28` en `desafio.ts`. */
const JUEGO = 'quiz';

/** Las letras de las cuatro opciones (`BR-04`). Tambien son las teclas que las eligen. */
const LETRAS = ['A', 'B', 'C', 'D'] as const;

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
 * saberlo: el foco se quedaba en el `<body>`. Quien juega con teclado tenia que tabular
 * desde la cinta de regreso en cada pregunta, y quien usa lector de pantalla no se enteraba
 * de nada. Es el mismo principio de los molinetes abiertos, aplicado a quien no ve la
 * pantalla.
 */
function enfocar(destino: HTMLElement): void {
  // -1 lo hace enfocable por codigo sin meterlo en el orden de tabulacion.
  destino.tabIndex = -1;
  destino.focus();
}

/** Si el que juega pidio menos movimiento: el desplazamiento suave tambien es movimiento. */
function sinMovimiento(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Pantalla 0: si se llego por un desafio, el subtitulo lo dice.
if (desafio) $('subtitulo').textContent = subtituloDesafio(desafio);

$('jugar').addEventListener('click', comenzar);

function comenzar(): void {
  partida = comenzarPartida(banco);
  mostrar(zonaPartida);
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

/** El marcador de vidas: tres fichas, y la palabra. `UX-07` — ningun estado por color solo. */
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
      tramo.append(el('span', `riel-paso riel-paso--${estado}`));
    }
    caja.append(tramo);
  }
  return caja;
}

/**
 * El tablero de arriba. `respondida` es el momento de la respuesta: `vidas.ts` ya avanzo
 * el indice a la que sigue, pero en pantalla todavia se esta leyendo la que se contesto,
 * asi que el `Nº` es el de las respondidas y el riel no marca la proxima. Y no se ofrece
 * cerrar: con la respuesta a la vista, el paso que sigue es `SEGUÍ`.
 */
function tablero(respondida = false): HTMLElement {
  const cab = el('div', 'tablero');
  cab.id = 'cabecera-pregunta';

  const fila = el('div', 'tablero-fila');
  const vidas = marcadorVidas(partida.vidas);
  vidas.id = 'vidas-pregunta';
  fila.append(vidas);

  const n = respondida ? partida.elegidas.length : partida.indice + 1;
  // El `Nº` solo no dice de cuantas: el lector lee la frase entera, que va oculta a la vista.
  // No es un `aria-label` sobre el `<p>`: un parrafo no tiene nombre en ARIA 1.2 y varios
  // lectores lo ignoran (`FIND-151`).
  const numero = el('p', 'tablero-numero');
  numero.id = 'numero-pregunta';
  const aLaVista = el('span', undefined, numeroDePregunta(n));
  aLaVista.setAttribute('aria-hidden', 'true');
  numero.append(aLaVista, el('span', 'solo-lector', numeroDePreguntaLeido(n, partida.orden.length)));
  fila.append(numero);
  if (!respondida) fila.append(disparadorRetirada());
  cab.append(fila);
  cab.append(riel(partida, respondida));
  return cab;
}

/* ---- La pregunta ---- */

/** `T-40` — la pregunta, con la insignia de rotulo **antes** de responder (`UX-01` v2). */
function pintarPregunta(): void {
  const item = actual(partida)!;
  zonaPartida.replaceChildren();
  zonaPartida.append(tablero());

  const ficha = el('article', `ficha-pregunta ficha-pregunta--${item.categoria}`);

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
  if (abreEscalon(partida)) {
    const aviso = el('div', 'escalon');
    aviso.setAttribute('role', 'status');
    aviso.append(el('span', 'escalon-rotulo', avisoEscalon(pos.nivel)));
    const canta = ESCALON_CANTA[pos.nivel];
    if (canta) aviso.append(el('span', 'escalon-canta', canta));
    ficha.append(aviso);
  }

  const enunciado = el('h2', 'enunciado', item.enunciado);
  // El foco aterriza en la pregunta, pero las vidas, el numero, la categoria y —sobre todo—
  // la insignia de rotulo tienen que llegar con ella (`UX-01` v2).
  // Las vidas, el numero y los sellos, y no el tablero entero: el tablero tambien tiene el
  // boton de cerrar, y su texto no es parte de la pregunta (`FIND-151`).
  enunciado.setAttribute('aria-describedby', 'vidas-pregunta numero-pregunta sellos-pregunta');
  ficha.append(enunciado);
  zonaPartida.append(ficha);

  const lista = el('div', 'opciones opciones--letradas');
  item.opciones.forEach((op, i) => {
    const b = el('button', 'opcion');
    b.type = 'button';
    // El texto se compara por el dato y no por `textContent`: la letra vive adentro.
    b.dataset.texto = op.texto;
    const letra = el('span', 'opcion-letra', LETRAS[i]);
    letra.setAttribute('aria-hidden', 'true');
    b.append(letra, el('span', 'opcion-texto', op.texto));
    b.addEventListener('click', () => responder(op.texto), { once: true });
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
  zonaPartida.querySelector('.tablero')!.after(caja);
  enfocar(no);
}

/* ---- La respuesta ---- */

function responder(texto: string): void {
  const item = actual(partida)!;
  const correcta = textoCorrecto(item);
  const acerto = texto === correcta;
  partida = responderPartida(partida, texto);

  // La confirmacion de cerrar, si estaba abierta, ya no tiene sentido: se respondio.
  zonaPartida.querySelector('.retirada--confirma')?.remove();

  for (const b of zonaPartida.querySelectorAll<HTMLButtonElement>('.opcion')) {
    b.disabled = true;
    if (b.dataset.texto === correcta) b.classList.add('es-correcta');
    else if (b.dataset.texto === texto) b.classList.add('es-elegida');
    else b.classList.add('es-otra');
  }

  // El tablero se rehace entero: las vidas, si se perdio una, y el paso del riel. Las vidas
  // cambian en el mismo tick que el feedback y se anuncian en la misma region viva: son la
  // misma noticia (`UX-07`). `CNT-10` decidio que perder una no lleva texto propio.
  zonaPartida.querySelector('.tablero')?.replaceWith(tablero(true));

  const fuente = acerto ? ACIERTOS : ERRORES;
  ultimoFeedback = variante(fuente, ultimoFeedback, Math.random);
  // `revelacion` es la pieza de "Adiviná el tema": el acierto se estampa como sello de goma.
  const panel = el('div', `feedback revelacion ${acerto ? 'ok' : 'no'}`);
  // Region viva: se inserta VACIA a proposito — un lector de pantalla anuncia los cambios
  // de una region que ya existe con mucha mas confiabilidad que una recien nacida.
  panel.setAttribute('role', 'status');
  zonaPartida.append(panel);

  const cabeza = el('div', 'revelacion-cabeza');
  cabeza.append(el('p', 'micro', ultimoFeedback));
  const n = acerto ? racha(partida) : 0;
  const grito = RACHAS[n];
  if (grito) cabeza.append(el('p', 'racha', grito));
  panel.append(cabeza);

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
  panel.append(cuerpo);

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
   * El avance lo manda el dedo, siempre. No hay temporizador (`UX-01` v2, WCAG 2.2.1).
   *
   * Desde `D-71` el boton va en una barra pegada abajo: en la zona del pulgar y siempre a la
   * vista, aunque la explicacion sea larga. Va AFUERA del panel, no adentro: asi la region
   * viva anuncia el resultado y la explicacion, y no "SEGUÍ, boton" mezclado con ellos.
   */
  const barra = el('div', 'seguir-barra');
  const seguir = el('button', 'primario', BOTON_SEGUIR);
  seguir.type = 'button';
  seguir.addEventListener('click', avanzar, { once: true });
  barra.append(seguir);

  // `BR-21` criterio 4: el boton de correccion, despues de la respuesta y afuera del panel.
  zonaPartida.append(
    botonCorreccion(() => ({
      juego: 'quiz',
      itemId: item.id,
      ubicacion: 'la respuesta correcta',
      dice: `${item.enunciado} → ${correcta}`,
      rotulo: item.clase,
      banco: { contrato: 'CTR-02', version: 1 },
    })),
  );
  zonaPartida.append(barra);

  seguir.focus({ preventScroll: true });
  panel.scrollIntoView({ block: 'nearest', behavior: sinMovimiento() ? 'auto' : 'smooth' });
}

function avanzar(): void {
  // Quien decide si la partida sigue es `vidas.ts`, no esta funcion.
  if (partida.desenlace === 'jugando') {
    pintarPregunta();
    window.scrollTo({ top: 0 });
  } else pintarResultado();
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
  for (const g of escalones(p)) {
    const tramo = el('div', 'planilla-tramo');
    tramo.append(el('span', 'planilla-nivel', (NOMBRE_NIVEL[g.nivel] ?? g.nivel).toUpperCase()));
    const casillas = el('div', 'planilla-casillas');
    for (const i of g.indices) {
      const estado = i < h.length ? (h[i] ? 'ok' : 'no') : 'resto';
      casillas.append(el('span', `planilla-casilla planilla-casilla--${estado}`, estado === 'ok' ? '✔︎' : estado === 'no' ? '✕︎' : '·'));
    }
    tramo.append(casillas);
    grilla.append(tramo);
  }
  caja.append(grilla);
  return caja;
}

/** `T-41`, `T-42` y `T-143` — el resultado, que son tres desenlaces y no tres tramos. */
function pintarResultado(): void {
  const r = resultadoDe(partida)!;
  const { titulo, rotulo } = DESENLACES[r.desenlace];

  zonaResultado.replaceChildren();

  // Registro 3 primero: el rotulo dice que hay adentro y se calla. Estampado como sello
  // de goma, pero sin tinta propia por desenlace: lo que dice como te fue es la palabra.
  const marcador = el('p', 'rotulo-desenlace', rotulo);
  marcador.id = 'rotulo-desenlace';
  zonaResultado.append(marcador);

  // El numero grande es la ficha a la que llegaste. Decorativo para el lector: la frase de
  // abajo dice lo mismo con todas las palabras.
  const numero = el('p', 'resultado-numero', numeroDePregunta(r.pregunta));
  numero.setAttribute('aria-hidden', 'true');

  const recorrido = el('p', 'puntaje', lineaRecorrido(r));
  recorrido.id = 'recorrido';
  const acertadas = el('p', 'tenue', lineaAciertos(r));
  acertadas.id = 'acertadas';

  // El foco aterriza en el encabezado, que es la noticia, y se lleva puestos el rotulo y
  // los dos datos: los cuatro son una sola cosa.
  const encabezado = el('h2', `tramo tramo--${r.desenlace}`, titulo);
  encabezado.setAttribute('aria-describedby', `${marcador.id} ${recorrido.id} ${acertadas.id}`);
  zonaResultado.append(encabezado, numero, recorrido, acertadas);

  // Solo la retirada muestra las vidas (`BR-19` apartado 6.4).
  const vidas = lineaVidas(r);
  if (vidas) zonaResultado.append(el('p', 'tenue', vidas));

  zonaResultado.append(planilla(partida));

  // FIND-17: las variantes de `CNT-10`, no un string inventado aca.
  if (desafio) zonaResultado.append(el('p', 'comparacion', comparacion(r, desafio)));

  // "COMPARTÍ" con tilde (`D-17`), en la letra de la firma (`D-65`).
  const compartir = el('button', 'primario firma', BOTON_COMPARTIR);
  compartir.type = 'button';
  compartir.addEventListener('click', () => void compartirResultado());
  zonaResultado.append(compartir);

  const denuevo = el('button', 'secundario', BOTON_DE_NUEVO);
  denuevo.type = 'button';
  denuevo.addEventListener('click', comenzar);
  zonaResultado.append(denuevo);

  // La salida hacia el arcade: la misma cinta de regreso de la portada, no un boton nuevo.
  const salida = el('p', 'salida-resultado');
  const alArcade = el('a', 'volver', `← ${PORTAL.volverAlArcade}`);
  alArcade.href = '/';
  salida.append(alArcade);
  zonaResultado.append(salida);

  mostrar(zonaResultado);
  window.scrollTo({ top: 0 });
  enfocar(encabezado);
}

async function compartirResultado(): Promise<void> {
  const r = resultadoDe(partida)!;
  // Forma `recorrido` de `ADR-02` v2: hasta donde llego y como termino.
  const url = armarLink(location.origin + location.pathname, {
    forma: 'recorrido',
    juego: JUEGO,
    puntaje: r.pregunta,
    total: r.total,
    desenlace: r.desenlace,
  });
  // La planilla va debajo de la frase de `CNT-10`: lo respondido, escalon por escalon.
  const marcas = planillaParaCompartir(respondidasPorEscalon(partida));
  const texto = marcas ? [textoParaCompartir(r), marcas].join('\n') : textoParaCompartir(r);

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
