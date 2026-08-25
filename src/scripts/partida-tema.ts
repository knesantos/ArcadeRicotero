/**
 * La isla de "adiviná el tema" (`US-02`).
 *
 * El molde es el del juego de referencia que pidió el usuario, relevado a mano y
 * escrito en `Docs/SUGERENCIAS/HILO-mapa-del-juego-de-referencia.md`. Lo que se copió de ahí y lo que no está
 * anotado en ese mapa; acá van las tres decisiones de código que importan.
 *
 * **1. La pantalla de partida se arma una vez y después se actualiza.** Los otros dos
 * juegos del sitio rehacen la pantalla entera en cada pregunta (`partida-tapa.ts`), y
 * está bien porque no tienen dónde escribir. Acá hay una caja de texto con el foco
 * puesto y medio título tipeado: rehacer el DOM se lo lleva puesto en cada intento.
 *
 * **2. Un solo botón grande, que cambia de nombre.** Con la caja vacía dice *Pasar*; en
 * cuanto elegís un tema de la lista dice *Arriesgar*. Es el mismo lugar de la pantalla y
 * el mismo pulgar: no hay que apuntar a otro lado ni decidir entre dos botones. Sale del
 * juego de referencia, donde el botón *Skip* se convierte en *Submit*.
 *
 * **3. La lista de sugerencias se abre para arriba.** En un celular el teclado se come
 * la mitad de abajo de la pantalla, y una lista que se abre hacia abajo queda tapada por
 * el teclado que la está alimentando.
 *
 * **Nada se escribe con `innerHTML`**, igual que en los otros dos juegos: todo con
 * `createElement` y `textContent`.
 */

import { sugerir, acierta, MAX_SUGERENCIAS, type TemaBuscable, type Resultado } from '../lib/tema/buscador.ts';
import { ESCALERA, INTENTOS, paso, puntos, puntajeMaximo, anchosDeTramos } from '../lib/tema/escalera.ts';
import { Reproductor, urlDeTema } from '../lib/tema/audio.ts';
import { PARTIDA, REVELACION, RESULTADO, TRAMOS, PANTALLA_0 } from '../lib/tema/copy.ts';
import { tramo } from '../lib/quiz/tramo.ts';
import { armarLink } from '../lib/desafio.ts';

/** Un tema como llega del build. Espeja `TemaDelJuego` de `catalogo.ts`. */
interface Tema extends TemaBuscable {
  readonly anio: number;
  readonly jugable: boolean;
  readonly entero: boolean;
  readonly letra: string | null;
}

/** Cuántos temas tiene una vuelta. Cuatro entran en los dos o tres minutos del brief. */
const LARGO_RONDA = 4;

/** Cuántos temas se precargan por delante del que suena (`CTR-01.5`: el actual + 2). */
const VENTANA_PRECARGA = 2;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const portada = $('portada');
const zonaPartida = $<HTMLElement>('partida');
const zonaResultado = $('resultado');

const catalogo: Tema[] = JSON.parse($('catalogo').textContent ?? '[]');
const reproductor = new Reproductor();

/** El disco elegido, o `null` por "todos los discos". */
let discoElegido: string | null = null;
let ronda: Tema[] = [];
let indice = 0;
/** En qué paso de la escalera está el tema en curso, de 1 a 6. */
let pasoActual = 1;
let elegido: Tema | null = null;
/** Lo que el jugador ya erró o pasó en este tema: `null` es un "pasar". */
let intentos: (Tema | null)[] = [];
let puntaje = 0;
/** Uno por tema de la ronda: el paso en que lo acertó, o 0 si no lo sacó. */
let marcador: number[] = [];
/** Índice de la sugerencia marcada con el teclado. -1 es ninguna. */
let marcada = -1;
let sugerencias: readonly Resultado[] = [];

// ---------------------------------------------------------------- utilidades de DOM

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

// ---------------------------------------------------------------- portada

for (const boton of portada.querySelectorAll<HTMLButtonElement>('[data-disco]')) {
  boton.addEventListener('click', () => {
    discoElegido = boton.dataset.disco || null;
    for (const otro of portada.querySelectorAll<HTMLButtonElement>('[data-disco]')) {
      otro.setAttribute('aria-pressed', String(otro === boton));
    }
    const cuantos = pozo().length;
    $('cuantos').textContent = PANTALLA_0.hay(cuantos);
    $<HTMLButtonElement>('jugar').disabled = cuantos === 0;
  });
}

$('jugar').addEventListener('click', () => {
  // Este clic es el gesto que los celulares exigen para dejar sonar audio. Despertar el
  // motor acá es lo que hace que el primer "Escuchar" no tenga que esperar nada.
  reproductor.despertar();
  comenzar();
});

/** Los temas que pueden salir sorteados con lo que el jugador eligió. */
function pozo(): Tema[] {
  return catalogo.filter((t) => t.jugable && (discoElegido === null || t.disco === discoElegido));
}

/** Los temas que ofrece el buscador: los del disco elegido, tengan audio o no. */
function buscables(): Tema[] {
  return catalogo.filter((t) => discoElegido === null || t.disco === discoElegido);
}

// ---------------------------------------------------------------- la vuelta

function comenzar(): void {
  const disponibles = [...pozo()];
  // Barajado de Fisher-Yates: sin repetir tema dentro de la misma vuelta.
  for (let i = disponibles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [disponibles[i], disponibles[j]] = [disponibles[j]!, disponibles[i]!];
  }
  ronda = disponibles.slice(0, Math.min(LARGO_RONDA, disponibles.length));
  indice = 0;
  puntaje = 0;
  marcador = [];
  armarPantalla();
  mostrar(zonaPartida);
  arrancarTema();
}

function arrancarTema(): void {
  pasoActual = 1;
  elegido = null;
  intentos = [];
  cerrarLista();
  buscadorInput.value = '';
  buscadorInput.disabled = false;
  cajaBuscador.hidden = false;
  pintarTodo();
  void precargar();
}

/** Baja el fragmento del tema en curso y de los dos que siguen (`CTR-01.5`). */
async function precargar(): Promise<void> {
  const actual = ronda[indice];
  if (actual) await reproductor.precargar(actual.slug);
  for (let i = 1; i <= VENTANA_PRECARGA; i++) {
    const siguiente = ronda[indice + i];
    if (siguiente) void reproductor.precargar(siguiente.slug);
  }
}

// ---------------------------------------------------------------- la pantalla de juego

let barra!: HTMLElement;
let etiquetaPaso!: HTMLElement;
let botonEscuchar!: HTMLButtonElement;
let renglones!: HTMLElement;
let buscadorInput!: HTMLInputElement;
let lista!: HTMLElement;
let botonPrincipal!: HTMLButtonElement;
let cajaBuscador!: HTMLElement;
let progreso!: HTMLElement;
let restantesEl!: HTMLElement;
let revelacion!: HTMLElement;

/** Arma la pantalla de partida una sola vez por vuelta. Después solo se actualiza. */
function armarPantalla(): void {
  zonaPartida.replaceChildren();

  const cab = el('div', 'cabecera');
  progreso = el('p', 'paso');
  restantesEl = el('p', 'restantes');
  restantesEl.setAttribute('aria-live', 'polite');
  cab.append(progreso, restantesEl);
  zonaPartida.append(cab);

  // Los seis renglones de intento. Se dibujan siempre los seis, vacíos: la altura de la
  // escalera tiene que verse antes de empezar a gastarla.
  renglones = el('ol', 'intentos');
  zonaPartida.append(renglones);

  // La barra: un tramo por paso, de ancho proporcional a lo que ese paso agrega.
  const reproductorCaja = el('div', 'reproductor');
  barra = el('div', 'barra');
  const anchos = anchosDeTramos();
  for (let i = 0; i < ESCALERA.length; i++) {
    const tramoBarra = el('div', 'barra-tramo');
    tramoBarra.style.flexGrow = String(anchos[i]);
    tramoBarra.append(el('div', 'barra-relleno'));
    barra.append(tramoBarra);
  }
  reproductorCaja.append(barra);

  etiquetaPaso = el('p', 'barra-etiqueta');
  etiquetaPaso.setAttribute('aria-live', 'polite');
  reproductorCaja.append(etiquetaPaso);

  botonEscuchar = el('button', 'escuchar', PARTIDA.escuchar);
  botonEscuchar.type = 'button';
  botonEscuchar.addEventListener('click', alternarSonido);
  reproductorCaja.append(botonEscuchar);
  zonaPartida.append(reproductorCaja);

  // El panel de revelación vive acá y se muestra cuando el tema se cierra. El aviso de
  // sonido NO está: `US-02` criterio 2 lo pide **antes de arrancar la partida**, y ahí
  // está, en la portada. Repetirlo en cada pantalla es ruido que nadie vuelve a leer.
  revelacion = el('div', 'revelacion');
  revelacion.hidden = true;
  zonaPartida.append(revelacion);

  cajaBuscador = armarBuscador();
  zonaPartida.append(cajaBuscador);
}

function armarBuscador(): HTMLElement {
  const caja = el('div', 'buscador');

  // La lista vive adentro de la fila del buscador y no del bloque entero: se abre para
  // arriba, pegada a la caja de texto, que es lo único que el teclado del celular no
  // tapa. Colgada del bloque quedaría a la altura del botón, ocho renglones más abajo.
  const fila = el('div', 'buscador-fila');
  lista = el('ul', 'sugerencias');
  lista.hidden = true;
  lista.id = 'sugerencias';
  fila.append(lista);
  buscadorInput = el('input', 'buscador-caja');
  buscadorInput.type = 'text';
  buscadorInput.autocomplete = 'off';
  buscadorInput.autocapitalize = 'off';
  buscadorInput.spellcheck = false;
  buscadorInput.placeholder = PARTIDA.buscar;
  buscadorInput.setAttribute('aria-label', PARTIDA.buscar);
  buscadorInput.setAttribute('role', 'combobox');
  buscadorInput.setAttribute('aria-expanded', 'false');
  buscadorInput.setAttribute('aria-controls', 'sugerencias');
  buscadorInput.addEventListener('input', alTipear);
  buscadorInput.addEventListener('keydown', alTeclear);
  fila.append(buscadorInput);

  const borrar = el('button', 'buscador-borrar', '✕');
  borrar.type = 'button';
  borrar.setAttribute('aria-label', 'Borrar lo escrito');
  borrar.addEventListener('click', () => {
    buscadorInput.value = '';
    elegido = null;
    cerrarLista();
    pintarBotonPrincipal();
    buscadorInput.focus();
  });
  fila.append(borrar);
  caja.append(fila);

  caja.append(el('p', 'buscador-ayuda', PARTIDA.buscarAyuda));

  botonPrincipal = el('button', 'arriesgar', PARTIDA.pasar);
  botonPrincipal.type = 'button';
  botonPrincipal.addEventListener('click', () => (elegido ? arriesgar() : pasar()));
  caja.append(botonPrincipal);

  return caja;
}

// ---------------------------------------------------------------- pintar

function pintarTodo(): void {
  progreso.textContent = PARTIDA.progreso(indice + 1, ronda.length);
  pintarRenglones();
  pintarBarra(0);
  pintarBotonPrincipal();
  revelacion.hidden = true;
  revelacion.replaceChildren();
  botonEscuchar.disabled = false;
}

function pintarRenglones(): void {
  renglones.replaceChildren();
  for (let i = 0; i < INTENTOS; i++) {
    const usado = i < intentos.length;
    const fallado = usado ? intentos[i] : undefined;
    const li = el('li', 'intento');
    if (!usado) {
      li.classList.add('intento--libre');
      li.append(el('span', 'intento-texto', ''));
    } else if (fallado === null) {
      li.classList.add('intento--pasado');
      // Símbolo además de color: ningún estado se comunica solo con tinte (`UX-01`).
      li.append(el('span', 'intento-marca', '·'));
      li.append(el('span', 'intento-texto', PARTIDA.pasado));
    } else {
      li.classList.add('intento--fallado');
      li.append(el('span', 'intento-marca', '✕'));
      li.append(el('span', 'intento-texto', PARTIDA.fallado(fallado!.titulo)));
    }
    renglones.append(li);
  }
}

/** Pinta la barra: los tramos ya ganados llenos, y el que suena llenándose. */
function pintarBarra(transcurrido: number): void {
  const tramos = [...barra.querySelectorAll<HTMLElement>('.barra-tramo')];
  let previo = 0;
  for (let i = 0; i < tramos.length; i++) {
    const p = ESCALERA[i]!;
    const relleno = tramos[i]!.firstElementChild as HTMLElement;
    const abierto = p.n <= pasoActual;
    tramos[i]!.classList.toggle('barra-tramo--abierto', abierto);
    const largo = p.segundos - previo;
    const dentro = Math.min(Math.max(transcurrido - previo, 0), largo);
    relleno.style.width = `${largo > 0 ? (dentro / largo) * 100 : 0}%`;
    previo = p.segundos;
  }
  const p = paso(pasoActual);
  etiquetaPaso.textContent = PARTIDA.pasoActual(p.etiqueta);
}

function pintarBotonPrincipal(): void {
  botonPrincipal.textContent = elegido ? PARTIDA.arriesgar : PARTIDA.pasar;
  botonPrincipal.classList.toggle('arriesgar--listo', elegido !== null);
  botonPrincipal.disabled = false;

  // Cuántos quedan va escrito y no solo insinuado por los renglones vacíos: el que
  // está por gastar el último tiene que saberlo antes de gastarlo, no después.
  const restantes = INTENTOS - intentos.length;
  restantesEl.textContent = restantes === 1 ? PARTIDA.ultimoIntento : PARTIDA.intentosRestantes(restantes);
  restantesEl.classList.toggle('restantes--ultimo', restantes === 1);
}

// ---------------------------------------------------------------- el sonido

let sonando = false;

function alternarSonido(): void {
  if (sonando) {
    reproductor.detener();
    frenar();
    return;
  }
  const tema = ronda[indice];
  if (!tema) return;
  sonando = true;
  botonEscuchar.textContent = PARTIDA.parar;
  botonEscuchar.classList.add('escuchar--sonando');
  reproductor.sonar(tema.slug, paso(pasoActual).segundos, {
    alAvanzar: (t) => pintarBarra(t),
    alTerminar: frenar,
  });
}

function frenar(): void {
  sonando = false;
  botonEscuchar.textContent = PARTIDA.escuchar;
  botonEscuchar.classList.remove('escuchar--sonando');
  pintarBarra(paso(pasoActual).segundos);
}

// ---------------------------------------------------------------- el buscador

function alTipear(): void {
  // Escribir después de haber elegido desarma la elección: lo que vale es lo que se
  // eligió de la lista, nunca lo que quedó escrito a mano en la caja.
  elegido = null;
  sugerencias = sugerir(buscables(), buscadorInput.value, MAX_SUGERENCIAS);
  marcada = -1;
  pintarLista();
  pintarBotonPrincipal();
}

function pintarLista(): void {
  lista.replaceChildren();
  const consulta = buscadorInput.value.trim();

  if (!consulta) {
    cerrarLista();
    return;
  }

  if (sugerencias.length === 0) {
    lista.append(el('li', 'sugerencia sugerencia--vacia', PARTIDA.sinResultados));
    abrirLista();
    return;
  }

  sugerencias.forEach((s, i) => {
    const li = el('li');
    const b = el('button', 'sugerencia');
    b.type = 'button';
    b.setAttribute('role', 'option');
    b.setAttribute('aria-selected', String(i === marcada));
    if (i === marcada) b.classList.add('sugerencia--marcada');

    const titulo = el('span', 'sugerencia-titulo');
    // El tramo que coincide va resaltado, y se arma con nodos de texto: nunca innerHTML.
    if (s.medio) {
      titulo.append(document.createTextNode(s.antes));
      titulo.append(el('mark', 'sugerencia-coincide', s.medio));
      titulo.append(document.createTextNode(s.despues));
    } else {
      titulo.textContent = s.tema.titulo;
    }
    b.append(titulo);
    b.append(el('span', 'sugerencia-disco', s.tema.discoTitulo));

    b.addEventListener('click', () => elegirSugerencia(i));
    li.append(b);
    lista.append(li);
  });

  abrirLista();
}

function abrirLista(): void {
  lista.hidden = false;
  buscadorInput.setAttribute('aria-expanded', 'true');
}

function cerrarLista(): void {
  lista.hidden = true;
  lista.replaceChildren();
  sugerencias = [];
  marcada = -1;
  buscadorInput.setAttribute('aria-expanded', 'false');
}

function elegirSugerencia(i: number): void {
  const s = sugerencias[i];
  if (!s) return;
  elegido = s.tema as Tema;
  buscadorInput.value = s.tema.titulo;
  cerrarLista();
  pintarBotonPrincipal();
  // El foco vuelve al botón: el pulgar ya está abajo y lo siguiente es arriesgar.
  botonPrincipal.focus();
}

function alTeclear(ev: KeyboardEvent): void {
  if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
    if (sugerencias.length === 0) return;
    ev.preventDefault();
    const delta = ev.key === 'ArrowDown' ? 1 : -1;
    // Hay n+1 estados: "ninguna marcada" (-1) más una por sugerencia. Se recorren en
    // círculo corriendo el índice un lugar para arriba, para no hacer módulo de -1.
    const estados = sugerencias.length + 1;
    marcada = (((marcada + 1 + delta) % estados) + estados) % estados - 1;
    pintarLista();
    return;
  }
  if (ev.key === 'Enter') {
    ev.preventDefault();
    if (marcada >= 0) {
      elegirSugerencia(marcada);
    } else if (sugerencias.length === 1) {
      // Una sola sugerencia y apretás Enter: no hay ambigüedad que resolver.
      elegirSugerencia(0);
    } else if (elegido) {
      arriesgar();
    }
    return;
  }
  if (ev.key === 'Escape') cerrarLista();
}

// ---------------------------------------------------------------- responder

function arriesgar(): void {
  const tema = ronda[indice];
  if (!tema || !elegido) return;

  if (acierta(elegido, tema)) {
    cerrarTema(true);
    return;
  }

  intentos.push(elegido);
  gastarIntento();
}

function pasar(): void {
  intentos.push(null);
  gastarIntento();
}

/** Un intento gastado abre el paso siguiente. Si no quedan, el tema se cierra en 0. */
function gastarIntento(): void {
  elegido = null;
  buscadorInput.value = '';
  cerrarLista();

  if (intentos.length >= INTENTOS) {
    cerrarTema(false);
    return;
  }

  pasoActual = intentos.length + 1;
  reproductor.detener();
  frenar();
  pintarRenglones();
  pintarBarra(0);
  pintarBotonPrincipal();
  // Se escucha solo el paso nuevo: errar tiene que devolver audio en el acto, sin que
  // haya que ir a buscar el botón otra vez.
  alternarSonido();
}

function cerrarTema(acerto: boolean): void {
  const tema = ronda[indice]!;
  reproductor.detener();
  frenar();

  const ganados = acerto ? puntos(pasoActual) : 0;
  puntaje += ganados;
  marcador.push(acerto ? pasoActual : 0);

  // El buscador se esconde entero, no se deshabilita: una caja de texto apagada abajo
  // del resultado es un control muerto ocupando la zona del pulgar.
  cajaBuscador.hidden = true;
  buscadorInput.disabled = true;
  botonEscuchar.disabled = true;
  cerrarLista();

  // El fragmento se abre entero al revelar: ya no hay nada que esconder.
  pasoActual = ESCALERA.length;
  pintarBarra(ESCALERA[ESCALERA.length - 1]!.segundos);

  pintarRevelacion(tema, acerto, ganados);
}

function pintarRevelacion(tema: Tema, acerto: boolean, ganados: number): void {
  revelacion.replaceChildren();
  revelacion.className = `revelacion feedback ${acerto ? 'ok' : 'no'}`;
  revelacion.hidden = false;

  revelacion.append(el('p', 'micro', acerto ? REVELACION.acerto : REVELACION.fallo));
  revelacion.append(el('h2', 'revelacion-titulo', `${REVELACION.eraEl} ${tema.titulo}`));
  revelacion.append(el('p', 'revelacion-ficha', REVELACION.ficha(tema.discoTitulo, tema.anio, tema.pista)));

  if (acerto) {
    revelacion.append(
      el('p', 'revelacion-puntos', `${REVELACION.puntos(ganados)} · ${REVELACION.enQuePaso(paso(marcador[marcador.length - 1]!).etiqueta)}`),
    );
  }

  // `D-22`: el tema entero lo sirve el sitio. Si todavía no está el archivo, no se
  // promete nada — la pantalla simplemente no muestra el reproductor.
  if (tema.entero) {
    const audio = el('audio', 'revelacion-audio');
    audio.controls = true;
    audio.preload = 'none';
    audio.src = urlDeTema(tema.slug);
    revelacion.append(el('p', 'revelacion-escuchar', REVELACION.escucharEntero));
    revelacion.append(audio);
  }

  if (tema.letra) {
    const a = el('a', 'revelacion-letra', REVELACION.verLetra);
    a.href = `/letras-y-acordes/${tema.letra}/`;
    revelacion.append(a);
  }

  const ultimo = indice + 1 >= ronda.length;
  const seguir = el('button', 'seguir', ultimo ? REVELACION.ultimo : REVELACION.seguir);
  seguir.type = 'button';
  seguir.addEventListener('click', avanzar, { once: true });
  revelacion.append(seguir);
  seguir.focus();
}

function avanzar(): void {
  indice += 1;
  if (indice >= ronda.length) {
    pintarResultado();
    return;
  }
  arrancarTema();
}

// ---------------------------------------------------------------- resultado

function pintarResultado(): void {
  const aciertos = marcador.filter((p) => p > 0).length;
  const t = tramo(aciertos, ronda.length);

  zonaResultado.replaceChildren();
  zonaResultado.append(el('h2', undefined, RESULTADO.titulo));
  zonaResultado.append(el('p', 'puntaje', String(puntaje)));
  zonaResultado.append(el('p', 'tenue', RESULTADO.de(puntaje, puntajeMaximo(ronda.length))));
  zonaResultado.append(el('p', `tramo tramo--${t}`, TRAMOS[t]));

  zonaResultado.append(el('h3', 'resumen-titulo', RESULTADO.detalle));
  const detalle = el('ol', 'resumen');
  ronda.forEach((tema, i) => {
    const p = marcador[i] ?? 0;
    const li = el('li', `resumen-fila resumen-fila--${p > 0 ? 'ok' : 'no'}`);
    li.append(el('span', 'resumen-marca', p > 0 ? '✔' : '✕'));
    li.append(el('span', 'resumen-tema', tema.titulo));
    li.append(el('span', 'resumen-dato', p > 0 ? paso(p).etiqueta : '—'));
    detalle.append(li);
  });
  zonaResultado.append(detalle);

  // `con-tilde` no es un apaño: es la deuda declarada en .claude/rules/diseno-marca.md.
  // La letra de la firma (`RES-42`) no tiene acentos, y 'Compartí' lleva uno. La regla
  // dice qué hacer y qué no: la palabra va en `--fuente-rotulada`, y **no** se le saca
  // la tilde para que entre — `D-17` no negocia el voseo.
  const compartir = el('button', 'primario firma con-tilde', RESULTADO.compartir);
  compartir.type = 'button';
  compartir.addEventListener('click', () => void compartirResultado(aciertos));
  zonaResultado.append(compartir);

  const denuevo = el('button', 'secundario', RESULTADO.denuevo);
  denuevo.type = 'button';
  denuevo.addEventListener('click', comenzar);
  zonaResultado.append(denuevo);

  const volver = el('a', 'accion-abajo', RESULTADO.volver);
  volver.href = '/';
  zonaResultado.append(volver);

  mostrar(zonaResultado);
}

/**
 * El link de desafío lleva **puntos**, igual que el texto que lo acompaña.
 *
 * Antes llevaba temas acertados, y el motivo escrito acá era que `ADR-02` acotaba el
 * total a 100 mientras una vuelta vale hasta 400 puntos: mandar el puntaje daba un link
 * que el propio `leerDesafio()` rechazaba.
 *
 * **`ADR-02` v2 subió ese tope a 9999 justamente por esto**, y al hacerlo dejó a la vista
 * el defecto que la restricción tapaba: el texto compartido decía "160 de 400" y el link
 * que iba pegado decía "3 de 4". Dos números para la misma partida, y el que abría el
 * desafío veía el que no correspondía. Ahora los dos dicen lo mismo.
 */
async function compartirResultado(aciertos: number): Promise<void> {
  void aciertos; // se sigue recibiendo para no cambiar la firma; el link va en puntos
  const url = armarLink(location.origin + location.pathname, {
    forma: 'marcador',
    juego: 'tema',
    puntaje,
    total: puntajeMaximo(ronda.length),
  });
  try {
    await navigator.clipboard.writeText(`${RESULTADO.de(puntaje, puntajeMaximo(ronda.length))} — ${url}`);
    zonaResultado.append(el('p', 'link', RESULTADO.copiado));
  } catch {
    // Sin permiso de portapapeles: se muestra el link para copiarlo a mano.
    zonaResultado.append(el('p', 'link', url));
  }
}
