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
import { PANTALLA_0, PARTIDA, RESULTADO, TRAMOS, TARJETA } from '../lib/por-la-letra/copy.ts';
import { PORTAL } from '../lib/sitio/copy.ts';
import { botonCorreccion } from './correccion.ts';
import { claseDisco } from '../lib/tema/paleta.ts';
import { tramo } from '../lib/quiz/tramo.ts';
import { armarLink, leerDesafio } from '../lib/desafio.ts';
import { armarRonda } from '../lib/por-la-letra/ronda.ts';
import { nombreArchivo } from '../lib/tarjeta/plan.ts';
import { dibujarTarjeta } from './tarjeta.ts';

/**
 * El nombre con el que este juego firma sus desafios (`ADR-02`).
 *
 * Es obligatorio pasarselo a `leerDesafio` por `FIND-28`: sin el, un enlace de otro juego
 * pintaria su puntaje en esta pantalla. Cumple `/^[a-z-]{1,20}$/`, que es lo que valida.
 */
const JUEGO = 'por-la-letra';

/** Un ítem del banco, tal como lo escribe `generar-por-la-letra.mjs` (`CTR-09.2`). */
interface ItemDelBanco {
  readonly slug: string;
  readonly titulo: string;
  readonly versos: readonly string[];
  readonly dificultad: string;
  readonly fuente: { readonly sitio: string; readonly url: string };
}

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const portada = $('portada');
const zonaPartida = $('partida');
const zonaResultado = $('resultado');

/** Un tema del catalogo. Extiende el del buscador con el anio, que la ficha necesita. */
interface TemaDelCatalogo extends TemaBuscable {
  readonly anio: number;
}

const banco: ItemDelBanco[] = JSON.parse($('banco').textContent ?? '[]');
const buscables: TemaDelCatalogo[] = JSON.parse($('catalogo').textContent ?? '[]');
const porSlug = new Map(buscables.map((t) => [t.slug, t]));

/**
 * Lo que sobrevive de cada tema jugado, y sin esto el resultado no tiene nada que contar.
 *
 * `cerrarTema` ya sabia si el tema salio y con cuantos versos —lo escribe en el panel de
 * respuesta— pero lo unico que guardaba era `puntaje += suma`. El dato se producia y se
 * tiraba, asi que la pantalla final solo podia mostrar un numero.
 */
interface TemaHecho {
  readonly titulo: string;
  readonly disco: string;
  readonly discoTitulo: string;
  readonly acerto: boolean;
  /** Cuantos versos hubo que leer. Es la moneda de este juego (`BR-20`). */
  readonly versos: number;
}

let hechos: TemaHecho[] = [];

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
/** La caja entera del buscador: hace falta para poder esconderla al revelar. */
let cajaBuscador: HTMLElement;
/** El rotulo del conteo de versos. Es a la vez el nombre accesible de la hoja y el aviso. */
let rotuloVersos: HTMLElement;
/** Cuantos versos hay pintados: lo que permite agregar solo los nuevos. */
let versosPintados = 0;
/** Donde cae lo que compartir tenga para decir. Se reemplaza, nunca se apila. */
let salidaCompartir: HTMLElement | null = null;

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

/*
 * Si alguien llego por un desafio, la bajada de la portada lo dice.
 *
 * Es la punta que faltaba: el juego mandaba un enlace y **ningun juego salvo el quiz leia
 * el que recibia**, asi que el que abria el desafio de un amigo caia en la portada pelada
 * y el "Vos cuantos sacas?" del texto compartido quedaba sin contra. Media copia de
 * `ADR-02` produce un enlace decorativo.
 *
 * El segundo argumento es obligatorio por `FIND-28`: sin el, `?g=tapa&p=10&t=10` pintaria
 * en esta pantalla un puntaje que no es de este juego.
 */
const desafio = leerDesafio(location.search, JUEGO);
if (desafio && desafio.forma !== 'identidad') {
  const bajada = document.getElementById('subtitulo');
  // `textContent` y jamas `innerHTML`: el nombre viene de la URL, que es la unica
  // superficie de entrada del sitio (`ADR-02`, y el encabezado de `desafio.ts`).
  if (bajada) bajada.textContent = PANTALLA_0.desafio(desafio.puntaje, desafio.total, desafio.nombre);
}

$('jugar').addEventListener('click', comenzar);

/*
 * La ronda se arma **escalonada**, no barajada. `BR-01`, y lo encontro `REV-08`
 * (`FIND-29`).
 *
 * Hasta esa revision esto era `barajar(banco).slice(0, 5)`: un barajado puro sobre los 92
 * temas, sin mirar `dificultad` en ningun punto del archivo. Con eso, **el que llega sin
 * saber nada de los Redondos podia recibir el tema mas oscuro del catalogo como primera
 * pregunta** — el muro de entrada exacto que `D-09` y `BR-01` existen para impedir, en un
 * juego que el tablero ya daba por cumplido.
 *
 * La funcion vivia aca y en el ciclo 10 se mudo a `src/lib/escalonar.ts`, cuando `US-02`
 * necesito exactamente lo mismo (`T-163`). Misma logica, un solo lugar.
 *
 * **Desde `D-46` (`T-285`) el banco escalona de verdad**: la dificultad sale de lo mas tocado
 * en vivo, en tercios (`CTR-19.15`), y ya no queda todo en `dificil`. Con eso aparecio la
 * vidriera fija que `US-02` ya habia tenido: sin cupo, las cinco preguntas salian siempre de
 * los Faciles. `armarRonda()` (`src/lib/por-la-letra/ronda.ts`) pone el cupo, y el largo de
 * la ronda vive ahi para que un test lo corra contra el banco real.
 */

function comenzar(): void {
  ronda = armarRonda(banco);
  indice = 0;
  puntaje = 0;
  hechos = [];
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
  // El tablero vuelve a ser una columna de alto fijo: el tema anterior lo habia soltado
  // para que la respuesta no le aplastara los versos.
  zonaPartida.classList.remove('partida--revelada');
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
  // Region viva, igual que en el hermano: el contador cambiaba en silencio, y el que mas
  // lo necesita es justo el que no ve la tinta con la que el CSS marca "te queda 1".
  restantes.setAttribute('aria-live', 'polite');
  if (quedan === 1) restantes.classList.add('restantes--ultimo');
  cabecera.append(restantes);
  zonaPartida.append(cabecera);

  chips = el('ul', 'chips');
  zonaPartida.append(chips);
  pintarChips();

  /*
   * El rotulo del conteo de versos hace tres trabajos a la vez, y por eso es visible.
   *
   * 1. **Le da nombre accesible a la hoja.** Antes la hoja era `role="status"` con
   *    `aria-label`, y como `enfocar(hoja)` le manda el foco al abrir cada tema, lo que se
   *    anunciaba era el rotulo —"Tenes 1 verso"— **en vez del verso**. El dato tapaba al
   *    contenido.
   * 2. **Avisa cuando sube el escalon.** El `role="status"` de la hoja tenia
   *    `aria-atomic` implicito en true, asi que cada escalon volvia a leer los ocho versos
   *    desde el principio en vez de dar el pedazo nuevo. Aca el aviso es corto y dice
   *    cuanto tenes ahora.
   * 3. **Se ve.** Es el mismo patron del hermano, que anuncia con `.barra-etiqueta`, un
   *    elemento visible y no una caja escondida: lo que escucha el lector de pantalla es
   *    lo mismo que lee el que mira.
   *
   * `PARTIDA.versos()` ya existia y vivia unicamente adentro de un `aria-label`.
   */
  rotuloVersos = el('p', 'rotulo-versos');
  rotuloVersos.id = 'rotulo-versos';
  rotuloVersos.setAttribute('aria-live', 'polite');
  zonaPartida.append(rotuloVersos);

  versosPintados = 0;
  hoja = el('div', 'hoja-versos');
  hoja.setAttribute('role', 'group');
  hoja.setAttribute('aria-labelledby', rotuloVersos.id);
  zonaPartida.append(hoja);
  pintarVersos();

  cajaBuscador = armarBuscador();
  zonaPartida.append(cajaBuscador);
  enfocar(hoja);
}

/**
 * Los versos del escalón en curso (`CTR-09.3`), **agregando solo los que faltan**.
 *
 * Antes esto era `replaceChildren()` y volver a escribir los ocho. Cambia por dos motivos
 * que apuntan al mismo lado: al pasar del escalón 3 al 4 aparecen cuatro versos de golpe
 * entre los cuatro que ya estabas leyendo, todos iguales y sin ninguna pista de dónde
 * empieza lo nuevo — y encima la hoja se baja sola hasta el final. El filete teñido de
 * `.verso--nuevo` lo dice sin agregar un elemento ni una palabra.
 *
 * En el primer escalón no hay nada marcado: no hay con qué contrastar.
 */
function pintarVersos(): void {
  const item = ronda[indice]!;
  const cuantos = pasoDeVersos(pasoActual).versos;
  const primeraVez = versosPintados === 0;

  // Lo que el escalón anterior trajo deja de ser novedad.
  for (const previo of hoja.querySelectorAll('.verso--nuevo')) previo.classList.remove('verso--nuevo');

  for (let i = versosPintados; i < cuantos; i++) {
    const verso = el('p', 'verso', item.versos[i]!);
    if (!primeraVez) verso.classList.add('verso--nuevo');
    hoja.append(verso);
  }
  versosPintados = cuantos;
  rotuloVersos.textContent = PARTIDA.versos(cuantos);

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
      li.append(el('span', 'chip-marca', '✕︎'));
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
  // El patron de combobox pide un listbox de verdad: habia `role="option"` colgando de un
  // `<ul>` pelado, asi que la lista no se anunciaba como lista y la marca del teclado no
  // llegaba a ningun lado.
  lista.setAttribute('role', 'listbox');
  lista.setAttribute('aria-label', PARTIDA.buscar);
  fila.append(lista);

  entrada = el('input', 'buscador-caja');
  entrada.type = 'text';
  entrada.autocomplete = 'off';
  entrada.autocapitalize = 'off';
  entrada.spellcheck = false;
  entrada.placeholder = PARTIDA.buscar;
  entrada.setAttribute('aria-label', PARTIDA.buscar);
  entrada.setAttribute('role', 'combobox');
  entrada.setAttribute('aria-expanded', 'false');
  entrada.setAttribute('aria-controls', 'sugerencias');
  entrada.addEventListener('input', alTipear);
  entrada.addEventListener('keydown', alTeclear);
  fila.append(entrada);

  const borrar = el('button', 'buscador-borrar', '✕︎');
  borrar.type = 'button';
  borrar.setAttribute('aria-label', PARTIDA.borrar);
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

/**
 * El botón dice qué hace: con un tema elegido, arriesga; sin nada, pasa.
 *
 * Y ahora también **se enciende**. La clase `arriesgar--listo` existía en `juego.css`
 * desde el ciclo del hermano y esta isla no la aplicaba nunca: el botón cambiaba de
 * palabra pero no de peso, así que la diferencia entre "voy a pasar" y "voy a arriesgar
 * cien puntos" era una palabra en un botón del mismo color.
 */
function pintarBotonPrincipal(): void {
  botonPrincipal.textContent = elegido ? PARTIDA.arriesga : PARTIDA.pasa;
  botonPrincipal.classList.toggle('arriesgar--listo', elegido !== null);
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
    lista.append(el('li', 'sugerencia sugerencia--vacia', PARTIDA.sinResultados));
    abrirLista();
    return;
  }
  sugerencias.forEach((s, i) => {
    const li = el('li');
    // El `<li>` no participa del patron: el listbox tiene que ver sus opciones.
    li.setAttribute('role', 'presentation');
    const b = el('button', 'sugerencia');
    b.type = 'button';
    b.id = `sugerencia-${i}`;
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

  /*
   * Lo marcado con el teclado tiene que llegar a las dos puntas.
   *
   * `aria-activedescendant` es lo que le dice al lector de pantalla cual es la opcion
   * activa: el foco del DOM nunca se mueve de la caja de texto, asi que sin esto la
   * navegacion con flechas no se transmite. Y `scrollIntoView` es la mitad visual del
   * mismo problema: la lista abre para arriba y tiene tope de alto, asi que con seis
   * sugerencias la marcada podia quedar recortada arriba, sin ninguna senal de que algo
   * se habia movido.
   */
  const activa = marcada >= 0 ? lista.querySelector<HTMLElement>(`#sugerencia-${marcada}`) : null;
  if (activa) {
    entrada.setAttribute('aria-activedescendant', activa.id);
    activa.scrollIntoView({ block: 'nearest' });
  } else {
    entrada.removeAttribute('aria-activedescendant');
  }
}

function abrirLista(): void {
  lista.hidden = false;
  entrada.setAttribute('aria-expanded', 'true');
}

function cerrarLista(): void {
  lista.hidden = true;
  lista.replaceChildren();
  entrada.setAttribute('aria-expanded', 'false');
  entrada.removeAttribute('aria-activedescendant');
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
  if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
    ev.preventDefault();
    /*
     * El mismo ciclo de n+1 estados que el hermano, y no es un capricho de simetria.
     *
     * Con el modulo sobre `sugerencias.length` pelado faltaba el estado "ninguna marcada"
     * (-1), asi que **una vez que marcabas algo no habia forma de volver a lo que
     * escribiste**: las flechas te dejaban dando vueltas entre las opciones para siempre.
     * Y ademas el primer ArrowUp desde el arranque caia en la anteultima en vez de la
     * ultima, porque partia de -1 y restaba uno.
     *
     * Se corre el indice un lugar para arriba para no hacer modulo de un negativo.
     */
    const delta = ev.key === 'ArrowDown' ? 1 : -1;
    const estados = sugerencias.length + 1;
    marcada = (((marcada + 1 + delta) % estados) + estados) % estados - 1;
    pintarLista();
  } else if (ev.key === 'Enter') {
    ev.preventDefault();
    if (marcada >= 0) {
      elegirSugerencia(marcada);
    } else if (sugerencias.length === 1) {
      // Una sola sugerencia y apretas Enter: no hay ambiguedad que resolver. Sin esta
      // rama la tecla quedaba muerta justo cuando el buscador ya habia acertado solo.
      elegirSugerencia(0);
    } else if (elegido) {
      arriesgar();
    }
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
  const versos = pasoDeVersos(pasoActual).versos;
  const suma = acerto ? puntosDeVersos(pasoActual) : 0;
  puntaje += suma;

  const ficha = porSlug.get(item.slug);

  /*
   * Lo que pasó con este tema queda guardado, y es lo que hace posible el resultado.
   *
   * Hasta acá el juego calculaba si salió y con cuántos versos, lo escribía en el panel y
   * después **lo tiraba**: lo único que sobrevivía a la vuelta era `puntaje`. Por eso la
   * pantalla final no podía decir nada más que un número.
   */
  hechos.push({
    titulo: item.titulo,
    disco: ficha?.disco ?? '',
    discoTitulo: ficha?.discoTitulo ?? '',
    acerto,
    versos,
  });

  cerrarLista();

  /*
   * El buscador se esconde y se apaga, y no es solo prolijidad: cerraba TRES agujeros.
   *
   * 1. Eran 174 px de control muerto medidos **arriba** de la respuesta.
   * 2. **Repuntuación**: al acertar, `elegido` seguía apuntando al tema correcto y el
   *    botón seguía diciendo `Arriesgá` habilitado, así que otro toque sumaba cien puntos
   *    de nuevo y appendeaba un segundo panel.
   * 3. **Panel duplicado por el otro camino**: agotados los intentos, el botón decía
   *    `Pasá` y seguía vivo, así que otro toque volvía a entrar en `cerrarTema(false)`.
   */
  cajaBuscador.hidden = true;
  entrada.disabled = true;
  elegido = null;

  /*
   * El tablero suelta el alto fijo.
   *
   * Es una columna de `100svh` con la hoja en `flex: 1 1 auto`, así que appendear el panel
   * le comía el alto a los versos: medido, **de 515 px a 59 px**. Los versos que estabas
   * tratando de sacar quedaban ilegibles justo cuando aparece la respuesta.
   */
  zonaPartida.classList.add('partida--revelada');

  /*
   * La respuesta viste **la tinta real del disco de ese tema** (`paleta.ts`).
   *
   * `UX-08` §6 lo pedía textual —"reusa la estructura entera de `pintarRevelacion()` del
   * hermano: micro-copy corto, título grande con el nombre del tema, ficha de disco y
   * año"— y estaba sin construir: los 89 temas se revelaban con el mismo par verde/rojo de
   * estado y una línea tenue con el nombre del disco.
   *
   * Va con `.revelacion` y no con `.feedback` pelado, y eso es una condición y no un
   * gusto: `.feedback` trae `background: var(--fondo-elevado)`, y `contraste.test.ts` deja
   * escrito que las tintas de disco **no llegan a AA sobre el elevado**. `.revelacion`
   * pisa el fondo a `--fondo` justo por eso.
   */
  const disco = claseDisco(ficha?.disco ?? '');
  const panel = el('div', `revelacion feedback ${acerto ? 'ok' : 'no'}${disco ? ` ${disco}` : ''}`);
  panel.setAttribute('role', 'status');
  panel.append(el('p', 'micro', acerto ? PARTIDA.ok : PARTIDA.no));
  panel.append(el('h2', 'revelacion-titulo', PARTIDA.era(item.titulo)));

  // De qué disco salió y de qué año. `PARTIDA.deDonde` estaba escrita y sin usar: al que
  // no lo sacó se le daba el nombre del disco y nada más.
  if (ficha) panel.append(el('p', 'revelacion-ficha', PARTIDA.deDonde(ficha.discoTitulo, ficha.anio)));
  panel.append(el('p', 'puntaje-paso', PARTIDA.puntos(suma, versos)));

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

  // El último tema no sigue nada: entrega el resultado, y el botón lo dice. Un rótulo que
  // promete otra pregunta y devuelve la pantalla final no está diciendo qué hay adentro.
  const ultimo = indice + 1 >= ronda.length;
  const seguir = el('button', 'primario', ultimo ? PARTIDA.ultimo : PARTIDA.seguir);
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

/** El renglón chico de un tema en el resumen y en la tarjeta. Registro 3. */
function pieDeTema(h: TemaHecho): string {
  return h.acerto
    ? RESULTADO.pieAcierto(h.discoTitulo, RESULTADO.versos(h.versos))
    : RESULTADO.pieFallo(h.discoTitulo);
}

/**
 * El resultado, que hasta hoy decía un número y se callaba.
 *
 * Tenía "0 de 500" y "Cómo te fue", y nada más: ni qué temas salieron, ni con cuánta letra
 * — o sea, **ninguna de las dos cosas que distinguen una vuelta de otra**.
 *
 * ## Qué es el número grande acá, y por qué no es un reloj
 *
 * En el hermano de audio el número grande es el tiempo, porque escuchar una décima de
 * segundo y decidir es una carrera. Copiarlo acá sería el error más caro disponible: **leer
 * ocho versos tarda lo que tarde cada uno**, así que un cronómetro castigaría al lector
 * lento sin medir nada del juego — y eso es cerrar un molinete (`D-14`) en el juego que se
 * lee.
 *
 * La moneda de `US-07` es la de `BR-20`: **con cuántos versos lo sacaste**. Es el
 * equivalente exacto del "cuánto audio te hizo falta" del hermano, y es lo único que la
 * vuelta produce y que antes se tiraba.
 *
 * El tramo se calcula sobre **temas sacados, nunca sobre puntos**: cinco de cinco sacados
 * siempre en el último escalón dan 200 sobre 500, o sea 40%, y el que los sacó todos se
 * llevaría la línea del que sacó la mitad.
 */
function pintarResultado(): void {
  const maximo = puntajeMaximoVersos(ronda.length);
  const aciertos = hechos.filter((h) => h.acerto).length;
  const t = tramo(aciertos, ronda.length);
  const versosTotal = hechos.reduce((suma, h) => suma + h.versos, 0);

  zonaResultado.replaceChildren();

  // Registro 3 arriba de todo, y la línea que canta como encabezado. Antes el único h2
  // llevaba el rótulo, o sea que el sitio se sacaba la voz justo cuando le tocaba usarla.
  zonaResultado.append(el('p', 'rotulo-desenlace', RESULTADO.titulo));
  const encabezado = el('h2', `tramo tramo--${t}`, TRAMOS[t]);
  zonaResultado.append(encabezado);

  const cifra = el('div', 'cifra');
  cifra.append(el('p', 'cifra-rotulo', RESULTADO.rotuloVersos));
  cifra.append(el('p', 'cifra-numero', RESULTADO.versos(versosTotal)));
  cifra.append(el('p', 'cifra-pie', RESULTADO.de(puntaje, maximo)));
  zonaResultado.append(cifra);

  zonaResultado.append(el('h3', 'resumen-titulo', RESULTADO.detalle));
  const detalle = el('ol', 'resumen');
  for (const h of hechos) {
    const disco = claseDisco(h.disco);
    const li = el('li', `resumen-fila resumen-fila--${h.acerto ? 'ok' : 'no'}${disco ? ` ${disco}` : ''}`);
    li.append(el('span', 'resumen-marca', h.acerto ? '✔︎' : '✕︎'));
    const cuerpo = el('span', 'resumen-cuerpo');
    cuerpo.append(el('span', 'resumen-tema', h.titulo));
    cuerpo.append(el('span', 'resumen-pie', pieDeTema(h)));
    li.append(cuerpo);
    detalle.append(li);
  }
  zonaResultado.append(detalle);

  const compartir = el('button', 'primario firma con-tilde', RESULTADO.compartir);
  compartir.type = 'button';
  compartir.addEventListener('click', () => void compartirResultado(compartir));
  zonaResultado.append(compartir);

  // La caja donde cae lo que compartir tenga para decir. Existe vacía desde el arranque
  // para que cada intento REEMPLACE al anterior: antes cada clic appendeaba un párrafo al
  // final de la sección —debajo de la cinta de regreso, lejos del botón que lo provocó— y
  // a los tres clics había tres avisos iguales.
  salidaCompartir = el('div', 'compartir-salida');
  salidaCompartir.setAttribute('aria-live', 'polite');
  zonaResultado.append(salidaCompartir);

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

/**
 * Compartir: la dirección para jugarla y la tarjeta para mirarla.
 *
 * La dirección ahora es un **desafío de verdad** (`armarLink`, `ADR-02`) y no la portada
 * pelada: antes se compartía `location.origin + pathname`, así que el "¿Vos cuántos
 * sacás?" del texto llegaba sin ningún número contra el cual jugar. La otra punta —leer el
 * desafío que llega— está arriba de todo en este archivo; media copia de `ADR-02` produce
 * un enlace decorativo.
 *
 * La tarjeta es la misma pieza del hermano (`lib/tarjeta/plan.ts`), que no sabe de qué
 * juego es: recibe el nombre, el token que lo viste y un número grande con su rótulo. Acá
 * ese número son **versos**, no minutos.
 *
 * La escalera de salidas es la del hermano, y nunca se corta antes de tiempo: si la
 * tarjeta no se puede dibujar, se comparte igual sin ella.
 */
async function compartirResultado(boton: HTMLButtonElement): Promise<void> {
  const maximo = puntajeMaximoVersos(ronda.length);
  const aciertos = hechos.filter((h) => h.acerto).length;
  const t = tramo(aciertos, ronda.length);
  const versosTotal = hechos.reduce((suma, h) => suma + h.versos, 0);

  const url = armarLink(location.origin + location.pathname, {
    forma: 'marcador',
    juego: JUEGO,
    puntaje,
    total: maximo,
  });
  const texto = RESULTADO.paraCompartir(puntaje, maximo);

  const rotuloOriginal = boton.textContent ?? RESULTADO.compartir;
  boton.disabled = true;
  boton.textContent = RESULTADO.armando;

  let imagen: Blob | null = null;
  try {
    imagen = await dibujarTarjeta({
      juego: TARJETA.juego,
      tinteJuego: '--disco-momo-sampler-tinta',
      tramo: TRAMOS[t],
      filas: hechos.map((h) => ({
        acerto: h.acerto,
        titulo: h.titulo,
        pie: pieDeTema(h),
        disco: h.disco,
      })),
      rotuloHero: TARJETA.rotuloHero,
      hero: RESULTADO.versos(versosTotal),
      puntaje: RESULTADO.de(puntaje, maximo),
      sitio: location.host + location.pathname,
    });
  } catch {
    // La tarjeta es el premio, no el camino.
    imagen = null;
  }

  boton.disabled = false;
  boton.textContent = rotuloOriginal;

  const archivo = imagen ? new File([imagen], nombreArchivo(JUEGO), { type: 'image/png' }) : null;

  if (archivo && navigator.canShare?.({ files: [archivo] })) {
    try {
      await navigator.share({ files: [archivo], text: texto, url });
      return;
    } catch {
      // Canceló, o el navegador la rechazó. Cae al escalón siguiente.
    }
  }
  if (navigator.share) {
    try {
      await navigator.share({ text: texto, url });
      return;
    } catch {
      // Ídem.
    }
  }

  mostrarSalidaDeCompartir(url, imagen);
}

/** El respaldo de escritorio: el aviso de copiado, y la tarjeta a mano para bajarla. */
function mostrarSalidaDeCompartir(url: string, imagen: Blob | null): void {
  const caja = salidaCompartir;
  if (!caja) return;
  caja.replaceChildren();

  void navigator.clipboard
    ?.writeText(url)
    .then(() => {
      caja.prepend(el('p', 'compartir-aviso', RESULTADO.copiado));
    })
    .catch(() => {
      caja.prepend(el('p', 'link', url));
      caja.prepend(el('p', 'compartir-aviso', RESULTADO.aManoTitulo));
    });

  if (!imagen) return;
  const bajar = el('a', 'secundario compartir-bajar', RESULTADO.bajarTarjeta);
  bajar.href = URL.createObjectURL(imagen);
  bajar.download = nombreArchivo(JUEGO);
  bajar.addEventListener('click', () => {
    setTimeout(() => URL.revokeObjectURL(bajar.href), 60_000);
  });
  caja.append(bajar);
}

// La escalera se declara acá para que el test de la página pueda leerla del DOM si algún
// día hace falta; el motor la toma de `escalera.ts`, que es su única fuente.
void ESCALERA_VERSOS;
