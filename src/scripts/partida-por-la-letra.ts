/**
 * La isla de "Sacalo por la letra" (`US-07`). `T-141`.
 *
 * Implementa `BR-20` (la escalera de versos), `UX-08` (las tres franjas y los chips) y
 * `CTR-09` (el banco). Toda la lógica de reglas vive en `lib/por-la-letra/`; este archivo
 * es el pegamento con el DOM.
 *
 * **Reusa entero el buscador del hermano de audio** (`lib/tema/buscador.ts`): mismo
 * catálogo de 105 títulos, misma tolerancia a tildes y a títulos por la mitad, mismo
 * rescate por letras salteadas. `D-24` eligió ese mecanismo y no hay razón para tener dos.
 *
 * **Nada se escribe con `innerHTML`.** Igual que en las otras islas: el resaltado del
 * buscador se arma con nodos de texto.
 */

import {
  ESCALERA_VERSOS,
  INTENTOS_VERSOS,
  pasoDeVersos,
  puntosDeVersos,
  puntajeMaximoVersos,
} from '../lib/por-la-letra/escalera.ts';
import { sugerir, acierta, MAX_SUGERENCIAS, type TemaBuscable, type Resultado } from '../lib/tema/buscador.ts';
import { PANTALLA_0, PARTIDA, RESULTADO } from '../lib/por-la-letra/copy.ts';
import { PORTAL } from '../lib/sitio/copy.ts';
import { botonCorreccion } from './correccion.ts';

/** Un ítem del banco, tal como lo escribe `generar-por-la-letra.mjs` (`CTR-09.2`). */
interface ItemDelBanco {
  readonly slug: string;
  readonly titulo: string;
  readonly versos: readonly string[];
  readonly dificultad: string;
  readonly fuente: { readonly sitio: string; readonly url: string };
}

/** Cuántos temas trae una vuelta. Sesión de dos o tres minutos: acá se lee, no se escucha. */
const LARGO_RONDA = 5;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const portada = $('portada');
const zonaPartida = $('partida');
const zonaResultado = $('resultado');

const banco: ItemDelBanco[] = JSON.parse($('banco').textContent ?? '[]');
const buscables: TemaBuscable[] = JSON.parse($('catalogo').textContent ?? '[]');
const porSlug = new Map(buscables.map((t) => [t.slug, t]));

let ronda: ItemDelBanco[] = [];
let indice = 0;
let pasoActual = 1;
/** Un elemento por intento gastado: el tema arriesgado, o `null` si pasó. */
let intentos: (TemaBuscable | null)[] = [];
let puntaje = 0;

let elegido: TemaBuscable | null = null;
let sugerencias: readonly Resultado[] = [];
let marcada = -1;

// Nodos que se recrean en cada tema y se guardan para no volver a buscarlos.
let hoja: HTMLElement;
let chips: HTMLElement;
let cabecera: HTMLElement;
let entrada: HTMLInputElement;
let lista: HTMLUListElement;
let botonPrincipal: HTMLButtonElement;

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

function enfocar(destino: HTMLElement): void {
  destino.tabIndex = -1;
  destino.focus();
}

function barajar<T>(xs: readonly T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

$('jugar').addEventListener('click', comenzar);

function comenzar(): void {
  ronda = barajar(banco).slice(0, Math.min(LARGO_RONDA, banco.length));
  indice = 0;
  puntaje = 0;
  mostrar(zonaPartida);
  abrirTema();
}

/** Arranca el tema en curso: primer escalón, sin intentos gastados. */
function abrirTema(): void {
  pasoActual = 1;
  intentos = [];
  elegido = null;
  sugerencias = [];
  marcada = -1;
  pintarPantalla();
}

/**
 * Las tres franjas de `UX-08`: cabecera fija, hoja de versos que crece y scrollea sola,
 * buscador anclado abajo en la zona pulgar. El buscador queda siempre en el mismo lugar
 * tenga el tema 1 verso o 8, sin `sticky` ni `fixed`: es la última franja de una columna
 * flex de alto `100svh`.
 */
function pintarPantalla(): void {
  zonaPartida.replaceChildren();

  cabecera = el('div', 'cabecera');
  cabecera.id = 'cabecera-verso';
  cabecera.append(el('span', 'paso', PARTIDA.tema(indice + 1, ronda.length)));
  const quedan = INTENTOS_VERSOS - intentos.length;
  const restantes = el('span', 'restantes', PARTIDA.intentos(quedan));
  if (quedan === 1) restantes.classList.add('restantes--ultimo');
  cabecera.append(restantes);
  zonaPartida.append(cabecera);

  chips = el('ul', 'chips');
  zonaPartida.append(chips);
  pintarChips();

  hoja = el('div', 'hoja-versos');
  hoja.setAttribute('role', 'status');
  hoja.setAttribute('aria-label', PARTIDA.versos(pasoDeVersos(pasoActual).versos));
  zonaPartida.append(hoja);
  pintarVersos();

  zonaPartida.append(armarBuscador());
  enfocar(hoja);
}

/** Los versos del escalón en curso: `slice(0, n)` sobre la ventana de ocho (`CTR-09.3`). */
function pintarVersos(): void {
  const item = ronda[indice]!;
  const cuantos = pasoDeVersos(pasoActual).versos;
  hoja.replaceChildren();
  for (const verso of item.versos.slice(0, cuantos)) {
    hoja.append(el('p', 'verso', verso));
  }
  hoja.setAttribute('aria-label', PARTIDA.versos(cuantos));
  // Si la hoja venía scrolleada, el verso nuevo puede quedar fuera de vista sin que
  // nadie lo note (`UX-08` sección 2). Se baja hasta el final, no hasta el tope.
  hoja.scrollTop = hoja.scrollHeight;
}

/**
 * Los intentos **ya gastados**, como chips de sello. Nunca se predibujan los que faltan:
 * la propia hoja de versos ya dice en qué escalón estás, y cuatro renglones vacíos son el
 * gasto de espacio que `UX-08` no se puede permitir.
 */
function pintarChips(): void {
  chips.replaceChildren();
  chips.hidden = intentos.length === 0;
  for (const intento of intentos) {
    const li = el('li', 'chip');
    if (intento === null) {
      li.classList.add('chip--pasado');
      // Símbolo además de color: ningún estado se comunica solo con tinte.
      li.append(el('span', 'chip-marca', '·'));
      li.append(el('span', 'chip-texto', PARTIDA.paso));
    } else {
      li.classList.add('chip--fallado');
      li.append(el('span', 'chip-marca', '✕'));
      li.append(el('span', 'chip-texto', intento.titulo));
    }
    chips.append(li);
  }
}

function armarBuscador(): HTMLElement {
  const caja = el('div', 'buscador');

  // La lista se abre para arriba, pegada a la caja: es lo único que el teclado del
  // celular no tapa. Mismo criterio que el hermano de audio.
  const fila = el('div', 'buscador-fila');
  lista = el('ul', 'sugerencias');
  lista.hidden = true;
  lista.id = 'sugerencias';
  fila.append(lista);

  entrada = el('input', 'buscador-caja');
  entrada.type = 'text';
  entrada.autocomplete = 'off';
  entrada.autocapitalize = 'off';
  entrada.spellcheck = false;
  entrada.placeholder = 'Escribí el tema';
  entrada.setAttribute('aria-label', 'Escribí el tema');
  entrada.setAttribute('role', 'combobox');
  entrada.setAttribute('aria-expanded', 'false');
  entrada.setAttribute('aria-controls', 'sugerencias');
  entrada.addEventListener('input', alTipear);
  entrada.addEventListener('keydown', alTeclear);
  fila.append(entrada);

  const borrar = el('button', 'buscador-borrar', '✕');
  borrar.type = 'button';
  borrar.setAttribute('aria-label', 'Borrar lo escrito');
  borrar.addEventListener('click', () => {
    entrada.value = '';
    elegido = null;
    cerrarLista();
    pintarBotonPrincipal();
    entrada.focus();
  });
  fila.append(borrar);
  caja.append(fila);

  caja.append(el('p', 'buscador-ayuda', PARTIDA.ayuda));

  botonPrincipal = el('button', 'arriesgar', PARTIDA.pasa);
  botonPrincipal.type = 'button';
  botonPrincipal.addEventListener('click', () => (elegido ? arriesgar() : pasar()));
  caja.append(botonPrincipal);

  return caja;
}

/** El botón dice qué hace: con un tema elegido, arriesga; sin nada, pasa. */
function pintarBotonPrincipal(): void {
  botonPrincipal.textContent = elegido ? PARTIDA.arriesga : PARTIDA.pasa;
}

function alTipear(): void {
  // Escribir después de elegir desarma la elección: vale lo que se eligió de la lista.
  elegido = null;
  sugerencias = sugerir(buscables, entrada.value, MAX_SUGERENCIAS);
  marcada = -1;
  pintarLista();
  pintarBotonPrincipal();
}

function pintarLista(): void {
  lista.replaceChildren();
  if (!entrada.value.trim()) {
    cerrarLista();
    return;
  }
  if (sugerencias.length === 0) {
    lista.append(el('li', 'sugerencia sugerencia--vacia', 'No hay ningún tema así'));
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
  entrada.setAttribute('aria-expanded', 'true');
}

function cerrarLista(): void {
  lista.hidden = true;
  lista.replaceChildren();
  entrada.setAttribute('aria-expanded', 'false');
  marcada = -1;
}

function elegirSugerencia(i: number): void {
  const s = sugerencias[i];
  if (!s) return;
  elegido = s.tema;
  entrada.value = s.tema.titulo;
  cerrarLista();
  pintarBotonPrincipal();
  entrada.focus();
}

function alTeclear(ev: KeyboardEvent): void {
  if (lista.hidden || sugerencias.length === 0) {
    if (ev.key === 'Enter' && elegido) {
      ev.preventDefault();
      arriesgar();
    }
    return;
  }
  if (ev.key === 'ArrowDown') {
    ev.preventDefault();
    marcada = (marcada + 1) % sugerencias.length;
    pintarLista();
  } else if (ev.key === 'ArrowUp') {
    ev.preventDefault();
    marcada = (marcada - 1 + sugerencias.length) % sugerencias.length;
    pintarLista();
  } else if (ev.key === 'Enter') {
    ev.preventDefault();
    if (marcada >= 0) elegirSugerencia(marcada);
    else if (elegido) arriesgar();
  } else if (ev.key === 'Escape') {
    cerrarLista();
  }
}

function arriesgar(): void {
  const item = ronda[indice];
  if (!item || !elegido) return;
  const correcto = porSlug.get(item.slug);
  if (correcto && acierta(elegido, correcto)) {
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

/**
 * Un intento gastado abre el escalón siguiente. Si no quedan, el tema se cierra en 0.
 *
 * A diferencia del hermano de audio, los versos nuevos aparecen **sin tap adicional**:
 * el texto ya está, no hay que volver a tocar "Escuchá" (`UX-08` sección 2).
 */
function gastarIntento(): void {
  elegido = null;
  entrada.value = '';
  cerrarLista();

  if (intentos.length >= INTENTOS_VERSOS) {
    cerrarTema(false);
    return;
  }
  pasoActual = intentos.length + 1;

  const quedan = INTENTOS_VERSOS - intentos.length;
  const restantes = cabecera.querySelector('.restantes');
  if (restantes) {
    restantes.textContent = PARTIDA.intentos(quedan);
    restantes.classList.toggle('restantes--ultimo', quedan === 1);
  }
  pintarChips();
  pintarVersos();
  pintarBotonPrincipal();
  entrada.focus();
}

/** Revela el tema y suma. Acertar en el paso 1 vale 100; no sacarlo, 0. */
function cerrarTema(acerto: boolean): void {
  const item = ronda[indice]!;
  const suma = acerto ? puntosDeVersos(pasoActual) : 0;
  puntaje += suma;

  cerrarLista();
  const panel = el('div', `feedback ${acerto ? 'ok' : 'no'}`);
  panel.setAttribute('role', 'status');
  panel.append(el('p', 'micro', acerto ? PARTIDA.ok : PARTIDA.no));
  panel.append(el('p', 'explicacion', PARTIDA.era(item.titulo)));

  const ficha = porSlug.get(item.slug);
  if (ficha) panel.append(el('p', 'tenue', ficha.discoTitulo));
  panel.append(el('p', 'puntaje-paso', PARTIDA.puntos(suma, pasoDeVersos(pasoActual).versos)));

  // La fuente del verso, a la vista — mismo mecanismo que `US-03` (`T-145`, `D-25`).
  const linea = el('p', 'fuente-verso');
  const enlace = el('a', 'fuente-verso-enlace', PARTIDA.fuenteDe(item.fuente.sitio));
  enlace.href = item.fuente.url;
  enlace.target = '_blank';
  enlace.rel = 'noopener';
  linea.append(enlace);
  panel.append(linea);

  const verLetra = el('a', 'volver', PARTIDA.verLetra);
  verLetra.href = `/letras-y-acordes/${item.slug}/`;
  panel.append(verLetra);

  const correccion = botonCorreccion(() => ({
      juego: 'por-la-letra',
      itemId: item.slug,
      ubicacion: 'los versos',
      dice: `${item.versos.slice(0, pasoDeVersos(pasoActual).versos).join(' / ')} → ${item.titulo}`,
      fuente: { sitio: item.fuente.sitio, url: item.fuente.url },
      banco: { contrato: 'CTR-09', version: 1 },
  }));

  zonaPartida.append(panel);

  const seguir = el('button', 'primario', PARTIDA.seguir);
  seguir.type = 'button';
  seguir.addEventListener('click', avanzar, { once: true });
  zonaPartida.append(seguir);
  // `UX-09`: despues de `Seguí` y afuera del panel, que es `role="status"`.
  zonaPartida.append(correccion);
  seguir.focus();
}

function avanzar(): void {
  indice += 1;
  if (indice >= ronda.length) {
    pintarResultado();
    return;
  }
  abrirTema();
}

function pintarResultado(): void {
  const maximo = puntajeMaximoVersos(ronda.length);
  zonaResultado.replaceChildren();

  const marcador = el('p', 'puntaje', RESULTADO.de(puntaje, maximo));
  marcador.id = 'puntaje-final';
  zonaResultado.append(marcador);

  const encabezado = el('h2', 'tramo', RESULTADO.titulo);
  encabezado.setAttribute('aria-describedby', marcador.id);
  zonaResultado.append(encabezado);

  const compartir = el('button', 'primario firma con-tilde', RESULTADO.compartir);
  compartir.type = 'button';
  compartir.addEventListener('click', () => void compartirResultado(puntaje, maximo));
  zonaResultado.append(compartir);

  const denuevo = el('button', 'secundario', RESULTADO.deNuevo);
  denuevo.type = 'button';
  denuevo.addEventListener('click', comenzar);
  zonaResultado.append(denuevo);

  const salida = el('p', 'salida-resultado');
  const alArcade = el('a', 'volver', `← ${PORTAL.volverAlArcade}`);
  alArcade.href = '/';
  salida.append(alArcade);
  zonaResultado.append(salida);

  mostrar(zonaResultado);
  enfocar(encabezado);
}

async function compartirResultado(puntos: number, maximo: number): Promise<void> {
  const texto = RESULTADO.paraCompartir(puntos, maximo);
  const url = location.origin + location.pathname;
  if (navigator.share) {
    try {
      await navigator.share({ text: texto, url });
      return;
    } catch {
      // Canceló, o el navegador la rechazó. Cae al respaldo.
    }
  }
  try {
    await navigator.clipboard.writeText(`${texto} ${url}`);
    zonaResultado.append(el('p', 'tenue', RESULTADO.copiado));
  } catch {
    zonaResultado.append(el('p', 'link', url));
  }
}

// La escalera se declara acá para que el test de la página pueda leerla del DOM si algún
// día hace falta; el motor la toma de `escalera.ts`, que es su única fuente.
void ESCALERA_VERSOS;
