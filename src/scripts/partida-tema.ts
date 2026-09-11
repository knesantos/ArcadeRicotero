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
import {
  ESCALERA,
  INTENTOS,
  paso,
  puntos,
  puntajeMaximo,
  anchosDeTramos,
  tramosConEtiqueta,
  DURACION_FRAGMENTO_SEG,
} from '../lib/tema/escalera.ts';
import { Reproductor, urlDeTema } from '../lib/tema/audio.ts';
import { PARTIDA, REVELACION, RESULTADO, TARJETA, TRAMOS, PANTALLA_0, SIN_SONIDO } from '../lib/tema/copy.ts';
import { estampaDe } from '../lib/tapa/pasadas.ts';
import { armarCasete } from '../lib/tema/casete.ts';
import { PORTAL } from '../lib/sitio/copy.ts';
import { esIOS, esMovil, navegadorIncrustado } from '../lib/sitio/aparato.ts';
import { tramo } from '../lib/quiz/tramo.ts';
import { armarLink } from '../lib/desafio.ts';
import { Cronometro, duracion, total as sumarTiempos } from '../lib/tema/reloj.ts';
import { claseDisco } from '../lib/tema/paleta.ts';
import { escalonar } from '../lib/escalonar.ts';
import { nombreArchivo } from '../lib/tarjeta/plan.ts';
import { dibujarTarjeta } from './tarjeta.ts';

/** Un tema como llega del build. Espeja `TemaDelJuego` de `catalogo.ts`. */
interface Tema extends TemaBuscable {
  readonly anio: number;
  readonly jugable: boolean;
  readonly entero: boolean;
  readonly letra: string | null;
  /**
   * Espejo de `TemaDelJuego.dificultad` (`CTR-03.11`). La estampa `catalogo()` en build
   * desde las escuchas; acá llega ya resuelta, dentro del JSON que la pagina serializa.
   *
   * Se declara de nuevo y no se importa el tipo de `catalogo.ts` porque ese modulo lee el
   * disco y ninguna isla puede tocar un modulo de Node (`D-29`).
   */
  readonly dificultad: string;
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
/**
 * El reloj de la vuelta (`reloj.ts`). Corre callado: no hay número subiendo en pantalla
 * mientras se juega, y el dato aparece recién al revelar. Es lo que el usuario eligió el
 * 2026-08-27 sobre la alternativa de un contador a la vista — un cronómetro visible
 * convierte un juego de dos minutos en una prueba, y el que llega sin idea ya tiene
 * bastante (`D-14`).
 */
const cronometro = new Cronometro();
/** Uno por tema: cuánto tardó el jugador en cerrarlo, en milisegundos. */
let tiempos: number[] = [];
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

/**
 * El reloj para cuando la pestaña se esconde, y sigue cuando vuelve.
 *
 * Atender el teléfono en medio de una vuelta no puede arruinar el tiempo: un número que
 * castiga por vivir no lo quiere compartir nadie, y la tarjeta que se comparte lleva ese
 * número adelante. Es la regla 2 de `reloj.ts`, enchufada acá.
 *
 * `visibilitychange` es el evento correcto y no `blur`: cambiar de ventana en una
 * computadora sin irse de la página no interrumpe nada, y ahí el reloj tiene que seguir.
 */
let temaEnCurso = false;
document.addEventListener('visibilitychange', () => {
  if (!temaEnCurso) return;
  if (document.hidden) {
    cronometro.pausar();
    // Si estaba sonando, se corta: el audio de un tema escondido no se escucha igual y
    // volver a una barra que avanzo sola desorienta.
    if (sonando) {
      reproductor.detener();
      frenar();
    }
  } else {
    cronometro.reanudar();
  }
});

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

/*
 * El aviso de la llave del iPhone, en la portada y **antes** de que haga falta el audio.
 *
 * Va en JavaScript y no en el HTML porque la pagina es estatica: en build no se sabe que
 * aparato hay del otro lado, y mostrarle a todo el mundo un aviso sobre una llave que
 * solo existe en iPhone es ruido para la mayoria.
 *
 * `US-02` criterio 2 ya pedia un aviso de sonido antes de arrancar, y ya estaba puesto
 * (`.aviso-sonido`). Lo que faltaba era **decir cual es la causa concreta**: "fijate el
 * volumen" no alcanza cuando el volumen esta alto y la llave es lo que manda.
 */
const avisoSonido = document.querySelector('.aviso-sonido');
if (avisoSonido) {
  const donde = navegadorIncrustado();
  if (esIOS()) {
    const extra = el('strong', 'aviso-llave', SIN_SONIDO.llaveIphone);
    avisoSonido.append(document.createTextNode(' '), extra);
  }
  if (donde) {
    const extra = el('strong', 'aviso-llave', SIN_SONIDO.incrustado(donde));
    avisoSonido.append(document.createTextNode(' '), extra);
  }
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

/*
 * La vuelta se arma **escalonada**, no barajada. `BR-01`, y es `FIND-29` — el mismo
 * defecto que `REV-08` encontro en "Sacalo por la letra", que aca siguio vivo un ciclo
 * mas y pesaba mas, porque este juego si esta adentro del "Listo" de la v1.
 *
 * Hasta el ciclo 10 esto era un Fisher-Yates sobre el pozo entero y la palabra
 * `dificultad` no aparecia una sola vez en este archivo: **el que llegaba sin saber nada
 * podia recibir el tema mas oscuro del catalogo como primer fragmento**, que es el muro
 * de entrada que `D-09` y `BR-01` existen para impedir. Y `PRD-alcance-v1.md` le pide a
 * este juego un minimo de 8 Faciles, que sin el campo eran 0.
 *
 * El nivel lo estampa `catalogo()` en build desde las escuchas (`D-27`, `CTR-03.11`).
 * **Mientras `popularidad.json` no tenga mediciones los 95 caen en `dificil`** y esto
 * degrada a un barajado — el mismo reparto que antes, pero declarado, y andando solo el
 * dia que corra `npm run ingerir-popularidad`.
 */
function comenzar(): void {
  ronda = escalonar(pozo(), LARGO_RONDA);
  indice = 0;
  puntaje = 0;
  marcador = [];
  tiempos = [];
  armarPantalla();
  mostrar(zonaPartida);
  arrancarTema();
}

function arrancarTema(): void {
  escuchoEsteTema = false;
  // La sala vuelve a ser Lobo suelto: el disco anterior ya no es la respuesta.
  sacarLaSala();
  pasoActual = 1;
  elegido = null;
  intentos = [];
  cerrarLista();
  buscadorInput.value = '';
  buscadorInput.disabled = false;
  cajaBuscador.hidden = false;
  // Lo gastado vuelve a verse: la revelacion del tema anterior las habia escondido.
  renglones.hidden = false;
  pintarTodo();
  // El reloj arranca con el tema listo para jugar, no antes: lo que se mide es decidir,
  // no cargar la pantalla.
  temaEnCurso = true;
  cronometro.arrancar();
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
let reproductorCaja!: HTMLElement;
/** La palabra de sello que dice si la cinta corre (`CNT-14` §2.5). La lee quien no ve girar. */
let palabraCinta!: HTMLElement;
/** La capa que convierte la sala en el disco que sacaste (`UX-22`, `T-202`). Nace al primer acierto. */
let sala: HTMLElement | null = null;
/**
 * Si la persona prendio el audio en ESTE tema. Es lo que decide si el acierto suena entero
 * (`UX-22`, `T-201`): quien jugo a ciegas no recibe diez segundos de sonido que no pidio.
 */
let escuchoEsteTema = false;
/**
 * Los discos que se imprimieron o vistieron el fondo en esta sesion (`UX-22` §2.5, `D-21`).
 *
 * **Acumula y no saca.** El pie tiene que nombrar cada tapa que estuvo en pantalla durante
 * la sesion, deduplicada, y no solo la del cuadro actual: era `FIND-46` de `REV-11`, y el
 * defecto estaba en recalcular la lista desde el `data-tapas` estatico en cada tema, con lo
 * cual el disco acreditado en el tema anterior se perdia apenas empezaba el siguiente.
 */
const tapasDeLaSesion = new Set<string>();
/** Si ya se sembro el conjunto con las tapas que la pagina traia escritas en build. */
let tapasSembradas = false;


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
  reproductorCaja = el('div', 'reproductor');
  barra = el('div', 'barra');
  const anchos = anchosDeTramos();
  for (let i = 0; i < ESCALERA.length; i++) {
    const tramoBarra = el('div', 'barra-tramo');
    tramoBarra.style.flexGrow = String(anchos[i]);
    tramoBarra.append(el('div', 'barra-relleno'));
    barra.append(tramoBarra);
  }
  reproductorCaja.append(barra);

  /*
   * La regla graduada de abajo de la barra.
   *
   * Antes la escalera solo se anunciaba de a un escalon por vez ("Tenes 0,1 s de
   * audio"), asi que **la forma de la escalera no se veia**: para saber que despues de
   * 0,1 vienen 0,5, 2, 4, 8 y 10 habia que gastarlos. Los seis renglones de intento se
   * dibujan todos desde el arranque justamente por lo contrario — "la altura de la
   * escalera tiene que verse antes de empezar a gastarla" — y a la barra, que ES la
   * escalera, eso no se le habia aplicado.
   *
   * Cada numero va alineado al borde derecho de su tramo, porque marca **cuanto audio
   * llevas acumulado si llegaste hasta ahi**. Los dos primeros no llevan numero: se
   * llevan el 1% y el 4% de la barra (`tramosConEtiqueta`).
   *
   * Es decoracion cero: es el eje de un grafico que ya estaba dibujado sin eje.
   */
  const escala = el('div', 'barra-escala');
  escala.setAttribute('aria-hidden', 'true');
  const conEtiqueta = tramosConEtiqueta();
  for (let i = 0; i < ESCALERA.length; i++) {
    const marca = el('span', 'barra-marca');
    marca.style.flexGrow = String(anchos[i]);
    if (conEtiqueta[i]) marca.append(el('span', 'barra-valor', ESCALERA[i]!.etiqueta));
    escala.append(marca);
  }
  reproductorCaja.append(escala);

  /*
   * La cinta gira (`UX-22`, `T-204`). El casete dibujado, con los carretes que giran
   * mientras suena el fragmento, va en el mismo renglon que "Tenes N s de audio": es la
   * misma informacion —cuanto audio hay y si esta corriendo— dicha dos veces, una con
   * palabras y otra con el objeto. Para quien no escucha nada es la unica prueba de que
   * el sitio si esta sonando (`UX-03`). Con movimiento reducido el carrete no gira y la
   * palabra de sello de al lado dice lo mismo (`CNT-14` §2.5).
   */
  const fila = el('div', 'cinta-fila');
  fila.append(armarCasete());
  const textos = el('div', 'cinta-textos');
  etiquetaPaso = el('p', 'barra-etiqueta');
  etiquetaPaso.setAttribute('aria-live', 'polite');
  palabraCinta = el('span', 'casete-estado', REVELACION.sonando);
  palabraCinta.hidden = true;
  textos.append(etiquetaPaso, palabraCinta);
  fila.append(textos);
  reproductorCaja.append(fila);

  botonEscuchar = el('button', 'escuchar', PARTIDA.escuchar);
  botonEscuchar.type = 'button';
  botonEscuchar.addEventListener('click', alternarSonido);
  reproductorCaja.append(botonEscuchar);

  // La salida para cuando igual no se escucha. Va pegada al boton que produce el sonido,
  // que es donde aparece la duda, y en letra chica: es una puerta, no un aviso.
  const ayuda = el('p', 'sin-sonido');
  const abrir = el('button', 'sin-sonido-abrir', SIN_SONIDO.disparador);
  abrir.type = 'button';
  abrir.addEventListener('click', () => abrirAyudaDeSonido(ayuda));
  ayuda.append(abrir);
  reproductorCaja.append(ayuda);

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

  const borrar = el('button', 'buscador-borrar', '✕︎');
  borrar.type = 'button';
  borrar.setAttribute('aria-label', PARTIDA.borrar);
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
      li.append(el('span', 'intento-marca', '✕︎'));
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
  // La regla de abajo se tine con la barra: el numero del escalon que ya tenes deja de
  // ser una promesa y pasa a ser un dato. Es la misma senal, en la misma columna.
  const marcas = barra.parentElement?.querySelectorAll<HTMLElement>('.barra-marca') ?? [];
  marcas.forEach((marca, i) => {
    marca.classList.toggle('barra-marca--abierta', ESCALERA[i]!.n <= pasoActual);
  });

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

/**
 * Que mirar cuando no se escucha nada.
 *
 * El orden **no es alfabetico ni tematico: es por probabilidad**, y el primero de la
 * lista es el que se llevo puesta una partida entera. La llave del iPhone va arriba y
 * solo en iPhone; el resto lo ve cualquiera.
 */
function abrirAyudaDeSonido(ancla: HTMLElement): void {
  if (ancla.querySelector('.sin-sonido-panel')) return;

  const panel = el('div', 'sin-sonido-panel');
  panel.setAttribute('role', 'group');
  const titulo = el('p', 'sin-sonido-titulo', SIN_SONIDO.titulo);
  titulo.id = 'sin-sonido-titulo';
  panel.setAttribute('aria-labelledby', titulo.id);
  panel.append(titulo);

  const lista = el('ul', 'sin-sonido-lista');
  const punto = (texto: string, fuerte = false): void => {
    const li = el('li', fuerte ? 'sin-sonido-punto sin-sonido-punto--primero' : 'sin-sonido-punto', texto);
    lista.append(li);
  };

  // Primero lo que no se puede detectar y mas caro sale: la llave del iPhone.
  if (esIOS()) punto(SIN_SONIDO.llaveIphone, true);
  const donde = navegadorIncrustado();
  if (donde) punto(SIN_SONIDO.incrustado(donde), true);
  if (esMovil()) punto(SIN_SONIDO.volumen);
  punto(SIN_SONIDO.auriculares);
  panel.append(lista);

  const diag = el('a', 'sin-sonido-diagnostico', SIN_SONIDO.verDiagnostico);
  diag.href = '/diagnostico-audio/';
  panel.append(diag);

  const cerrar = el('button', 'sin-sonido-cerrar', SIN_SONIDO.cerrar);
  cerrar.type = 'button';
  cerrar.addEventListener('click', () => {
    panel.remove();
    ancla.querySelector<HTMLButtonElement>('.sin-sonido-abrir')?.focus();
  });
  panel.append(cerrar);

  ancla.append(panel);
  titulo.tabIndex = -1;
  titulo.focus();
}

function alternarSonido(): void {
  if (sonando) {
    reproductor.detener();
    frenar();
    return;
  }
  sonar(paso(pasoActual).segundos);
}

/**
 * Hace sonar el tema en curso hasta `segundos`, y pone la cinta a girar.
 *
 * Separado de `alternarSonido` porque ahora tiene dos puertas: el boton de escuchar, y
 * el acierto, que hace sonar el fragmento entero (`UX-22`, `T-201`) si el audio estuvo
 * prendido en este tema. Las dos ponen el mismo estado en los mismos tres lugares —el
 * boton, la caja del reproductor, la palabra de la cinta— para que no haya forma de que
 * uno diga "sonando" y otro "quieta".
 */
function sonar(segundos: number): void {
  const tema = ronda[indice];
  if (!tema) return;
  sonando = true;
  escuchoEsteTema = true;
  botonEscuchar.textContent = PARTIDA.parar;
  botonEscuchar.classList.add('escuchar--sonando');
  reproductorCaja.classList.add('reproductor--sonando');
  palabraCinta.hidden = false;
  reproductor.sonar(tema.slug, segundos, {
    alAvanzar: (t) => pintarBarra(t),
    alTerminar: frenar,
  });
}

function frenar(): void {
  sonando = false;
  botonEscuchar.textContent = PARTIDA.escuchar;
  botonEscuchar.classList.remove('escuchar--sonando');
  reproductorCaja.classList.remove('reproductor--sonando');
  palabraCinta.hidden = true;
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

  // El reloj para antes que nada: leer la revelacion es gratis, y lo que se mide es
  // cuanto tardaste en decidir, no cuanto tardaste en enterarte.
  temaEnCurso = false;
  tiempos.push(cronometro.cerrar());

  const ganados = acerto ? puntos(pasoActual) : 0;
  puntaje += ganados;
  marcador.push(acerto ? pasoActual : 0);

  // El buscador se esconde entero, no se deshabilita: una caja de texto apagada abajo
  // del resultado es un control muerto ocupando la zona del pulgar.
  cajaBuscador.hidden = true;
  buscadorInput.disabled = true;
  cerrarLista();

  /*
   * Los renglones de intento se esconden, y es el mismo argumento del buscador aplicado a
   * lo que ya no sirve.
   *
   * Medido a 375x812 antes de tocar nada: los seis renglones ocupan **192 px** — casi la
   * cuarta parte de la pantalla — y la revelacion arrancaba en y=489 con la hoja
   * scrolleando hasta 963. O sea: el premio del juego caia abajo del pliegue, tapado por
   * la lista de lo que erraste, y habia que scrollear para encontrar el boton de seguir.
   *
   * Se esconden y no se borran: la vuelta anterior no se pierde, vuelve entera en el
   * resultado. Lo que se gana es que la respuesta quede arriba, que es donde va.
   */
  renglones.hidden = true;

  /*
   * El boton de escuchar **queda vivo**, y eso cambia respecto de antes.
   *
   * Se deshabilitaba al revelar, y era un control muerto de 52 px en el medio de la
   * pantalla — exactamente lo que el comentario del buscador, tres lineas mas arriba,
   * daba como motivo para esconderlo. Pero ademas se perdia algo: solo unos pocos temas
   * tienen el archivo entero (`D-22`), asi que para la mayoria **el fragmento de diez
   * segundos es lo unico que hay para escuchar**, y es justo despues de saber cual era
   * cuando dan ganas de volver a oirlo.
   */
  pasoActual = ESCALERA.length;

  /*
   * La barra se llena **solo si nada la va a volver a mover en el cuadro siguiente**.
   *
   * `pasoActual` se queda donde esta: eso es informacion —tine el borde de cada tramo y
   * la regla graduada de abajo— y no depende de que suene nada. Lo que se movio es el
   * relleno. Estaba puesto acá arriba y trece lineas mas abajo, si habias acertado con el
   * audio prendido, `sonar()` entra en `audio.ts` y ese avisa `alAvanzar(0)`: los seis
   * tramos se llenaban al 100 % y se vaciaban de golpe en el cuadro siguiente, para
   * volver a llenarse durante los diez segundos del fragmento. La barra decia "tenes
   * todo el audio" y un cuadro despues decia "no tenes nada".
   *
   * En los otros dos caminos —fallar, o acertar sin haber prendido el audio— la barra
   * tiene que quedar llena igual, porque ahi ya nadie la vuelve a tocar hasta el tema
   * siguiente.
   */
  const vaASonar = acerto && escuchoEsteTema;
  if (!vaASonar) pintarBarra(ESCALERA[ESCALERA.length - 1]!.segundos);

  pintarRevelacion(tema, acerto, ganados);

  /*
   * El acierto es el unico grito del sitio (`UX-22`, `D-33`).
   *
   * Al acertar pasan dos cosas mas que al fallar, y las dos son la sala, no un elemento:
   * el fondo de la pantalla se vuelve la tapa que sacaste (`T-202`), y si el audio estuvo
   * prendido en este tema, el fragmento entero de diez segundos arranca solo y la estampa
   * se imprime con la musica (`T-201`). Quien jugo a ciegas no recibe sonido que no pidio.
   */
  if (acerto) {
    ponerLaSala(tema);
    if (vaASonar) sonar(DURACION_FRAGMENTO_SEG);
  }
}

function pintarRevelacion(tema: Tema, acerto: boolean, ganados: number): void {
  revelacion.replaceChildren();
  /*
   * La ficha viste **la tinta real del disco del tema**, no la de la seccion (`paleta.ts`).
   *
   * Los diez colores estan medidos de las tapas (`RES-37`) y pasan AA; hasta hoy este
   * juego no usaba ninguno y revelaba los 105 temas con el mismo naranja de Lobo suelto.
   * Aca el tema no es el contenido de la pantalla: **es la respuesta**. Que Oktubre se
   * revele en rojo Oktubre es el premio mas barato que el sitio puede dar.
   *
   * El acierto y el error **no rotan**: `.ok` y `.no` siguen poniendo el verde y el rojo
   * de siempre en el borde y en la linea de arriba. Es la base que no rota nunca.
   */
  const disco = claseDisco(tema.disco);
  revelacion.className = `revelacion feedback ${acerto ? 'ok' : 'no'}${disco ? ` ${disco}` : ''}`;
  revelacion.hidden = false;

  revelacion.append(el('p', 'micro', acerto ? REVELACION.acerto : REVELACION.fallo));
  // La estampa va ANTES del titulo: es el premio, y el titulo es su pie.
  const estampa = armarEstampa(tema, acerto);
  if (estampa) revelacion.append(estampa);
  revelacion.append(el('h2', 'revelacion-titulo', `${REVELACION.eraEl} ${tema.titulo}`));
  revelacion.append(el('p', 'revelacion-ficha', REVELACION.ficha(tema.discoTitulo, tema.anio, tema.pista)));

  /*
   * Lo que costo el tema, en las dos monedas del juego.
   *
   * Antes esta linea solo aparecia al acertar y solo decia los puntos. Ahora dice tambien
   * el reloj, y **aparece igual cuando el tema se escapa**: el que gasto los seis
   * intentos tambien jugo, y su tiempo es parte de la vuelta que despues se comparte.
   */
  const reloj = duracion(tiempos[tiempos.length - 1] ?? 0);
  if (acerto) {
    const audio = paso(marcador[marcador.length - 1]!).etiqueta;
    revelacion.append(el('p', 'revelacion-puntos', REVELACION.puntos(ganados)));
    revelacion.append(el('p', 'revelacion-costo', REVELACION.costo(audio, reloj)));
  } else {
    revelacion.append(el('p', 'revelacion-costo', REVELACION.tardaste(reloj)));
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
  /*
   * A donde mira la pantalla al revelar (`UX-22` §1.4, que ratifico esto al resolver
   * `FIND-51`). El foco va al boton de seguir, como siempre, pero SIN que el navegador se
   * lleve la pantalla hasta el (`preventScroll`): enfocar el boton dejaba el premio afuera
   * de la vista, que es justo lo que este ciclo existe para que no pase. Sin `smooth`: un
   * desplazamiento animado seria movimiento que el corte de movimiento reducido no apaga.
   *
   * Las dos condiciones con las que `UX-22` §1.4 lo acota, y que antes no se cumplian:
   *
   *  1. **Vale solo si hay premio de verdad.** Un tema de un disco fuera de los diez no
   *     tiene estampa, y entonces no hay nada que mirar: la pantalla vuelve al
   *     comportamiento generico de cualquier revelacion de texto del sitio —el foco se
   *     lleva la vista consigo—, igual que el quiz y "sacalo por la letra".
   *  2. **El blanco es el bloque que TERMINA en el boton, alineado al pie**
   *     (`block: 'end'`), no la imagen alineada arriba. Apuntar al premio se medio bien
   *     aca de casualidad —este panel es corto— y rompia el otro juego, donde entre la
   *     tapa y el boton hay enunciado, cuatro opciones, explicacion y sello: el boton
   *     terminaba 457 px abajo del pliegue. Con el pie alineado, el boton **nunca queda
   *     afuera, por construccion**, y lo que varia con el largo del contenido es cuanto
   *     del premio se ve arriba. Esa jerarquia es a proposito: entre ver el premio y que
   *     el boton este, gana el boton.
   */
  if (estampa) {
    seguir.focus({ preventScroll: true });
    revelacion.scrollIntoView({ block: 'end' });
  } else {
    seguir.focus();
  }
}



/**
 * La estampa: la tapa que sacaste, impresa por pasadas sobre papel (`UX-22`, `T-200`).
 *
 * Tres `<img>` con alfa —las separaciones de `scripts/generar-pasadas.mjs`, tenidas con
 * los colores medidos de esa tapa (`RES-37`)— y la foto que se fija encima. El orden es el
 * de una serigrafia (`RES-54`): clara, media, clave. Al fallar, la clave sola: te la
 * dejamos en una tinta. Todo el movimiento lo pone `juego.css` desde tokens; aca solo se
 * arma el objeto.
 *
 * Es un objeto: se da vuelta (`T-203`). La trasera real no se baja hasta que alguien la
 * pide con el dedo. Y lleva su sello de credito, que es la condicion 1 de `D-21`.
 *
 * Devuelve `null` si el disco no tiene estampa —no es uno de los diez—: la revelacion
 * queda como era, sin hueco.
 */
function armarEstampa(tema: Tema, acerto: boolean): HTMLElement | null {
  const e = estampaDe(tema.disco);
  if (!e) return null;

  // Sin modificador por fallo: `estampa--clave` se creaba aca y **ninguna hoja la
  // pintaba** (lo encontro la red derivada de `estilos.test.ts`). Lo que de verdad
  // distingue fallar de acertar son las capas de abajo: con acierto entran las tres
  // tintas y la foto, sin acierto entra sola la clave. Darle tinta propia al fallo es
  // una decision que empieza en el lienzo (`.claude/rules/diseno-marca.md`), no aca.
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

  // El pie nombra el disco en su letra. El credito NO va aca: lo lleva el pie de la
  // pantalla, que se recalcula con cada disco que se imprime (`UX-22` §2.5, `D-21`).
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
 * La sala se vuelve el disco (`UX-22`, `T-202`).
 *
 * Al acertar, el fondo velado de la pantalla pasa a ser la ficha de la tapa que sacaste.
 * No es un elemento que aparece: es el lugar que cambia, que es lo unico que `D-32` deja
 * mover. Cero archivos nuevos —es la misma ficha de 320 px que la estampa ya bajo—, y
 * siempre detras de `--velo-tapa`, que es el peor caso que `contraste.test.ts` mide. La
 * capa vive en `#app`, debajo de las secciones (`.sobre-tapa` va con z-index 1), y no
 * lleva `.tapa-fondo` porque ese nombre de transito es unico por documento (`ADR-03`).
 *
 * Y el pie de la pantalla dice que tapa se ve (`D-21`, condicion 1): mientras la sala es
 * el disco, el credito nombra al disco.
 */
function ponerLaSala(tema: Tema): void {
  const e = estampaDe(tema.disco);
  const app = document.getElementById('app');
  if (!e || !app) return;
  if (!sala) {
    sala = el('div', 'sala-disco');
    sala.setAttribute('aria-hidden', 'true');
    app.append(sala);
  }
  // Nunca una imagen de fondo en linea: la ruta viaja en `--tapa-de-la-sala` y el velo lo
  // pone la regla de `juego.css`, donde `estilos.test.ts` lo puede ver (`ADR-05.7`).
  sala.style.setProperty('--tapa-de-la-sala', `url("${e.ficha}")`);
  sala.classList.add('sala-disco--puesta');
  creditoDePantalla([tema.discoTitulo]);
}

function sacarLaSala(): void {
  if (!sala) return;
  sala.classList.remove('sala-disco--puesta');
  sala.style.removeProperty('--tapa-de-la-sala');
  creditoDePantalla([]);
}

/**
 * El credito del pie nombra las tapas que se ven en la pantalla (`D-21`, condicion 1).
 *
 * Arranca con las que la pagina trae escritas y le suma las que la isla pone en tiempo de
 * ejecucion: la sala que se vuelve el disco (`T-202`) y las estampas chicas del setlist
 * (`T-205`). Una sola vez por disco, aunque aparezca en los tres lugares.
 */
function creditoDePantalla(discos: readonly string[]): void {
  // Las paginas con `Base.astro` lo llaman `.credito-pantalla`; esta, que arma su pie a
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
  for (const d of discos) tapasDeLaSesion.add(d);
  if (tapasDeLaSesion.size > 0) credito.textContent = PORTAL.creditoTapas([...tapasDeLaSesion]);
}


/**
 * La estampa chica del setlist (`UX-22` §10, `T-205`): la tirada como afiche.
 *
 * Cada tema de la vuelta lleva su tapa del tamano de un sello — a color si lo sacaste, en
 * la tinta de la clave si no, que es la misma diferencia que hace la revelacion. Son los
 * archivos que la revelacion ya bajo, a 32 px: cero archivos nuevos.
 *
 * **No se anima**, y es a proposito: un afiche se pega en la pared, no se imprime delante
 * tuyo. El grito es el acierto (`D-33`), y ya paso.
 *
 * **El simbolo ✔/✕ se queda.** Una tapa a color no le sirve a quien no distingue tintas, y
 * la fila no puede comunicar el resultado solo con color (`US-02`). La estampa va escondida
 * del lector de pantalla: el simbolo y el pie ya dicen todo lo que dice.
 */
function armarEstampita(tema: Tema, acerto: boolean): HTMLElement | null {
  const e = estampaDe(tema.disco);
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


function avanzar(): void {
  /*
   * Cortar el sonido antes de pasar, y no es cosmetico.
   *
   * Desde que el boton de escuchar queda vivo durante la revelacion, el fragmento del
   * tema que se acaba de revelar **puede estar sonando** cuando se toca "Segui". Sin esto
   * seguiria sonando arriba del tema siguiente: el jugador escucharia la respuesta
   * anterior mientras trata de adivinar la nueva. Es un defecto que no existia antes y
   * que el cambio de la revelacion habilita.
   */
  reproductor.detener();
  frenar();

  indice += 1;
  if (indice >= ronda.length) {
    /*
     * Y sacar la sala, que es la otra cosa que quedaba prendida.
     *
     * `sacarLaSala()` se llamaba solo desde `arrancarTema()`, o sea por el camino del
     * tema siguiente. Cuando el que se cerraba era el ULTIMO, la salida es esta, y la
     * pantalla de resultado quedaba **vestida con la tapa del ultimo tema**: si lo
     * acertaste, con ese disco; si lo erraste, con Lobo suelto, que es el fondo de la
     * pagina. La misma pantalla se veia de dos maneras segun como habia salido el
     * ultimo tema, y ninguna de las dos estaba elegida. El afiche del resumen ya trae
     * sus cuatro estampas: no necesita una tapa entera atras.
     */
    sacarLaSala();
    pintarResultado();
    return;
  }
  arrancarTema();
}

// ---------------------------------------------------------------- resultado

/** El pie de un tema en el resumen y en la tarjeta: disco, audio que hizo falta, reloj. */
function pieDeTema(i: number): string {
  const tema = ronda[i]!;
  const p = marcador[i] ?? 0;
  const reloj = duracion(tiempos[i] ?? 0);
  return p > 0
    ? TARJETA.pieAcierto(tema.discoTitulo, paso(p).etiqueta, reloj)
    : TARJETA.pieFallo(tema.discoTitulo, reloj);
}

/**
 * El resultado, reordenado por lo que el jugador realmente quiere contar.
 *
 * Antes esta pantalla abria con el puntaje en cifra grande y el detalle de los temas
 * decia, por tema, `0,1 s` o un guion. El pedido del usuario del 2026-08-27 la da vuelta:
 * *"mas que el puntaje es importante y divertido saber en cuanto tiempo y que temas
 * adivino"*.
 *
 * Asi que la jerarquia es otra. La linea que canta es el tramo; el numero grande es **el
 * tiempo**; el setlist —que era una nota al pie— pasa a ser la pieza central, con cada
 * tema vestido con la tinta real de su disco; y el puntaje se queda, en su renglon, abajo
 * del tiempo. No desaparece: deja de ser lo primero que se lee.
 *
 * La pantalla viste **Gulp!** y no Lobo suelto, porque asi lo reparte `D-19`
 * ("resultado=Gulp!+logo") y asi lo tenia ya el boton de compartir.
 */
function pintarResultado(): void {
  const aciertos = marcador.filter((p) => p > 0).length;
  const t = tramo(aciertos, ronda.length);
  const maximo = puntajeMaximo(ronda.length);

  zonaResultado.replaceChildren();

  // Registro 3 arriba de todo: dice que hay adentro y se calla. Es el mismo rotulo que
  // ya usa el desenlace del quiz, para que las dos pantallas se lean igual.
  zonaResultado.append(el('p', 'rotulo-desenlace', RESULTADO.titulo));
  const encabezado = el('h2', `tramo tramo--${t}`, TRAMOS[t]);
  zonaResultado.append(encabezado);

  // El reloj: el dato que el jugador cuenta cuando sale de la partida.
  const reloj = el('div', 'cifra');
  reloj.append(el('p', 'cifra-rotulo', RESULTADO.rotuloTiempo));
  reloj.append(el('p', 'cifra-numero', duracion(sumarTiempos(tiempos))));
  reloj.append(el('p', 'cifra-pie', RESULTADO.puntos(puntaje, maximo)));
  zonaResultado.append(reloj);

  // La linea que canta del afiche (`CNT-14` §2.6): la vuelta se pega en la pared. La que
  // nombra es el `h3` de abajo, que sigue diciendo que hay en la lista (`UX-22` §10).
  zonaResultado.append(el('p', 'afiche-canta', RESULTADO.afiche));
  zonaResultado.append(el('h3', 'resumen-titulo', RESULTADO.detalle));
  const detalle = el('ol', 'resumen');
  ronda.forEach((tema, i) => {
    const p = marcador[i] ?? 0;
    const disco = claseDisco(tema.disco);
    const li = el('li', `resumen-fila resumen-fila--${p > 0 ? 'ok' : 'no'}${disco ? ` ${disco}` : ''}`);
    li.append(el('span', 'resumen-marca', p > 0 ? '✔︎' : '✕︎'));
    const estampita = armarEstampita(tema, p > 0);
    if (estampita) li.append(estampita);
    const cuerpo = el('span', 'resumen-cuerpo');
    cuerpo.append(el('span', 'resumen-tema', tema.titulo));
    cuerpo.append(el('span', 'resumen-pie', pieDeTema(i)));
    li.append(cuerpo);
    detalle.append(li);
  });
  zonaResultado.append(detalle);

  /*
   * El pie nombra TODAS las tapas que se ven en esta pantalla (`D-21`, condicion 1,
   * `UX-22` §10): las que la pagina traia, la que quedo de sala, y ahora las cuatro
   * estampas chicas del setlist. Una sola vez por disco aunque aparezca en los tres
   * lugares — de eso se encarga `creditoDePantalla`.
   */
  creditoDePantalla(ronda.map((t) => t.discoTitulo));


  // `con-tilde` no es un apaño: es la deuda declarada en .claude/rules/diseno-marca.md.
  // La letra de la firma (`RES-42`) no tiene acentos, y 'Compartí' lleva uno. La regla
  // dice qué hacer y qué no: la palabra va en `--fuente-rotulada`, y **no** se le saca
  // la tilde para que entre — `D-17` no negocia el voseo.
  const compartir = el('button', 'primario firma con-tilde', RESULTADO.compartir);
  compartir.type = 'button';
  compartir.addEventListener('click', () => void compartirResultado(compartir));
  zonaResultado.append(compartir);

  // La caja donde cae lo que compartir tenga para decir. Existe vacia desde el arranque
  // para que cada intento REEMPLACE al anterior: antes cada clic apilaba un parrafo
  // nuevo, y a los tres clics la pantalla tenia tres avisos iguales uno abajo del otro.
  salidaCompartir = el('div', 'compartir-salida');
  salidaCompartir.setAttribute('aria-live', 'polite');
  zonaResultado.append(salidaCompartir);

  const denuevo = el('button', 'secundario', RESULTADO.denuevo);
  denuevo.type = 'button';
  denuevo.addEventListener('click', comenzar);
  zonaResultado.append(denuevo);

  const volver = el('a', 'accion-abajo', RESULTADO.volver);
  volver.href = '/';
  zonaResultado.append(volver);

  mostrar(zonaResultado);
  encabezado.tabIndex = -1;
  encabezado.focus();
}

/**
 * Compartir la vuelta: la dirección para jugarla y la tarjeta para mirarla.
 *
 * ## Las dos piezas, y por qué van juntas
 *
 * - **La dirección** ya existía (`armarLink`, `ADR-02`). Es el molinete abierto: el que
 *   la recibe toca y juega, sin cuenta y sin bajar nada.
 * - **La tarjeta** es nueva (`lib/tarjeta/plan.ts` la planifica, `scripts/tarjeta.ts` la
 *   lo que hacía falta para que se pueda contar *qué* temas salieron y en cuánto tiempo,
 *   que es lo que el usuario pidió y lo que una línea de texto no puede decir.
 *
 * El link sigue llevando **puntos**, igual que el texto que lo acompaña. Antes llevaba
 * temas acertados porque `ADR-02` acotaba el total a 100 y una vuelta vale hasta 400;
 * `ADR-02` v2 subió el tope a 9999 justamente por esto, y al hacerlo dejó a la vista el
 * defecto que la restricción tapaba: el texto decía "160 de 400" y su propio link decía
 * "3 de 4". Ahora los dos dicen lo mismo.
 *
 * ## La escalera de salidas, de la mejor a la que no puede fallar
 *
 * 1. Menú del sistema **con la imagen** (`navigator.share` con archivos). Es lo que hay
 *    en un celular, que es donde se comparte esto.
 * 2. Menú del sistema **sin la imagen**, cuando el navegador comparte pero no archivos.
 * 3. Portapapeles, y la tarjeta queda a mano en un botón para bajarla.
 * 4. La dirección escrita y seleccionable.
 *
 * Nunca se corta antes de tiempo: **si la tarjeta no se puede dibujar, se comparte igual
 * sin ella.** Una imagen que falló no puede dejar a nadie sin poder compartir — es la
 * misma escalera de `D-14` que ya usa el botón de corrección.
 */
let salidaCompartir: HTMLElement | null = null;

async function compartirResultado(boton: HTMLButtonElement): Promise<void> {
  const maximo = puntajeMaximo(ronda.length);
  const url = armarLink(location.origin + location.pathname, {
    forma: 'marcador',
    juego: 'tema',
    puntaje,
    total: maximo,
  });
  const aciertos = marcador.filter((p) => p > 0).length;
  const t = tramo(aciertos, ronda.length);
  const tiempoTotal = duracion(sumarTiempos(tiempos));
  const texto = `${TRAMOS[t]} ${tiempoTotal} · ${RESULTADO.puntos(puntaje, maximo)}`;

  // Dibujar puede tardar un parpadeo (hay que esperar las letras). Un boton mudo se toca
  // dos veces, asi que dice lo que esta haciendo y no se deja tocar de nuevo.
  const rotuloOriginal = boton.textContent ?? RESULTADO.compartir;
  boton.disabled = true;
  boton.textContent = RESULTADO.armando;

  let imagen: Blob | null = null;
  try {
    imagen = await dibujarTarjeta({
      juego: TARJETA.juego,
      tinteJuego: '--cat-mitologia',
      tramo: TRAMOS[t],
      filas: ronda.map((tema, i) => ({
        acerto: (marcador[i] ?? 0) > 0,
        titulo: tema.titulo,
        pie: pieDeTema(i),
        disco: tema.disco,
      })),
      rotuloHero: TARJETA.rotuloTiempo,
      hero: tiempoTotal,
      puntaje: RESULTADO.puntos(puntaje, maximo),
      sitio: location.host + location.pathname,
    });
  } catch {
    // La tarjeta es el premio, no el camino: si el canvas falla, se comparte sin ella.
    imagen = null;
  }

  boton.disabled = false;
  boton.textContent = rotuloOriginal;

  const archivo = imagen
    ? new File([imagen], nombreArchivo('adivina-el-tema'), { type: 'image/png' })
    : null;

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
      // Sin portapapeles: la direccion queda escrita y seleccionable. Nadie queda afuera.
      caja.prepend(el('p', 'link', url));
      caja.prepend(el('p', 'compartir-aviso', RESULTADO.aManoTitulo));
    });

  if (!imagen) return;
  const bajar = el('a', 'secundario compartir-bajar', RESULTADO.bajarTarjeta);
  bajar.href = URL.createObjectURL(imagen);
  bajar.download = nombreArchivo('adivina-el-tema');
  // La direccion temporal se suelta despues de usarla: sin esto la imagen queda en
  // memoria hasta que se cierra la pestania, y una vuelta son 1080x1350 pixeles.
  bajar.addEventListener('click', () => {
    setTimeout(() => URL.revokeObjectURL(bajar.href), 60_000);
  });
  caja.append(bajar);
}
