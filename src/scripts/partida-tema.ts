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
  etiquetaDeRegla,
  extraAlPasar,
  DURACION_FRAGMENTO_SEG,
} from '../lib/tema/escalera.ts';
import { Reproductor, urlDeTema } from '../lib/tema/audio.ts';
import { sonarAunqueEsteEnSilencio, laLlaveManda } from '../lib/audio/sesion.ts';
import { PARTIDA, REVELACION, RESULTADO, TARJETA, TRAMOS, PANTALLA_0, SIN_SONIDO } from '../lib/tema/copy.ts';
import { estampaDe } from '../lib/tapa/pasadas.ts';
import {
  armarCasete,
  correrCasete,
  frenarCasete,
  rebobinarCasete,
  ponerAvance,
  ponerContador,
} from '../lib/tema/casete.ts';
import { sonarEfecto, type Efecto } from '../lib/audio/efectos.ts';
import { golpear, estampar, pegar, volar, contar, duracionDe, armarInterruptorDeRuidos } from './jugo.ts';
import { esIOS, esMovil, navegadorIncrustado } from '../lib/sitio/aparato.ts';
import { tramo } from '../lib/quiz/tramo.ts';
import { armarLink, leerDesafio } from '../lib/desafio.ts';
import { Cronometro, duracion, total as sumarTiempos } from '../lib/tema/reloj.ts';
import { claseDisco } from '../lib/tema/paleta.ts';
import { armarVuelta } from '../lib/tema/vuelta.ts';
import { nombreArchivo } from '../lib/tarjeta/plan.ts';
import { dibujarTarjeta } from './tarjeta.ts';
import { incrustado, postearEnX } from './en-x.ts';
import {
  armarEstampa,
  armarEstampita,
  armarEscalerita,
  acreditarTapas,
  armarCasillas,
  pintarCasillas,
  vibrarAcierto,
  modoTeclado,
} from './sacar-temas.ts';

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

/** Cuántos temas se precargan por delante del que suena (`CTR-01.5`: el actual + 2). */
const VENTANA_PRECARGA = 2;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const portada = $('portada');
const zonaPartida = $<HTMLElement>('partida');
const zonaResultado = $('resultado');

const catalogo: Tema[] = JSON.parse($('catalogo').textContent ?? '[]');
const reproductor = new Reproductor();

/*
 * El heroe de la portada (ronda 2 de la pulida, 2026-11-18): el casete del juego, en reposo
 * y con la cinta al principio. Lo arma la isla porque el dibujo es el mismo objeto de la
 * partida (`armarCasete`), y asi hay uno solo. Si la pagina no trae el hueco, no pasa nada.
 */
const heroe = document.getElementById('heroe');
const caseteDeLaPortada = heroe ? armarCasete() : null;
if (heroe && caseteDeLaPortada) heroe.append(caseteDeLaPortada);
/** La clase de disco que tiene puesta la etiqueta del casete de la portada, o nada. */
let discoDelHeroe = '';

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
 * Uno por tema: qué hizo con cada intento que gastó antes de cerrarlo. Es lo que dibuja la
 * escalerita del resultado —los seis escalones de cada tema, con lo que pasó en cada uno—,
 * que `marcador` no alcanza a decir: un 3 no distingue entre dos errores y dos pases.
 */
let recorridos: Array<Array<'fallo' | 'paso'>> = [];
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
    // El casete de la portada se queda con el disco elegido: su etiqueta toma esa tinta, como
    // quien saca una cinta de la caja. Con "todos los discos" vuelve a ser papel.
    if (caseteDeLaPortada) {
      if (discoDelHeroe) caseteDeLaPortada.classList.remove(discoDelHeroe);
      discoDelHeroe = (discoElegido && claseDisco(discoElegido)) || '';
      if (discoDelHeroe) {
        caseteDeLaPortada.classList.add(discoDelHeroe);
        pegar(heroe);
      }
    }
    const cuantos = pozo().length;
    // La cuenta ya la dice el boton del pozo elegido; este renglon es para el lector de
    // pantalla, que se entera asi de que la eleccion cambio (`aria-live`).
    $('cuantos').textContent = PANTALLA_0.hay(cuantos);
    $<HTMLButtonElement>('jugar').disabled = cuantos === 0;
  });
}

/*
 * Un disco ya elegido desde el enlace (`?disco=oktubre`), `D-49`: el afiche de octubre del
 * portal manda acá con *Oktubre* puesto. Es el mismo toque que haría la persona —el botón
 * del disco, con su `aria-pressed` y su cuenta—, y el desplegable se abre para que se vea
 * cuál quedó elegido. Un slug que no existe, o un disco sin audio, no elige nada: queda
 * "Todos los discos", que es lo de siempre.
 */
{
  const pedido = new URLSearchParams(location.search).get('disco');
  const boton = pedido
    ? [...portada.querySelectorAll<HTMLButtonElement>('[data-disco]')].find((b) => b.dataset.disco === pedido)
    : undefined;
  if (boton && !boton.disabled) {
    boton.click();
    boton.closest('details')?.setAttribute('open', '');
  }
}

/*
 * Si alguien llegó por un desafío, la bajada de la portada lo dice.
 *
 * Este juego armaba el enlace desde el ciclo 13 (`compartirResultado`, más abajo) y **nunca
 * leía el que recibía**: el amigo caía en la portada pelada y el "fijate vos" quedaba sin
 * contra. Era el único de los cuatro juegos con desafío que lo dejaba a medias. Mismo
 * mecanismo que "Sacalo por la letra": `leerDesafio` con el juego obligatorio (`FIND-28`),
 * y el texto por `textContent`, jamás `innerHTML` — el nombre viene de la URL, que es la
 * única superficie de entrada del sitio (`ADR-02`).
 *
 * `?disco=` (el afiche de octubre) y el desafío no se pisan: el enlace compartido sale de
 * `location.pathname`, sin la query, así que un desafío nunca trae un disco elegido.
 */
{
  const desafio = leerDesafio(location.search, 'tema');
  const bajada = document.getElementById('subtitulo');
  if (desafio && desafio.forma !== 'identidad' && bajada) {
    bajada.textContent = PANTALLA_0.desafio(desafio.puntaje, desafio.total, desafio.nombre);
  }
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
 *
 * Desde `D-66` el aviso **solo sale donde la llave todavia manda**: un iPhone sin la Audio
 * Session API. En los demas el juego pide la sesion de la musica en "Empezá" y la llave deja
 * de apagarlo, asi que el aviso diria algo que ya no es cierto.
 */
const avisoSonido = document.querySelector('.aviso-sonido');
if (avisoSonido) {
  const donde = navegadorIncrustado();
  if (esIOS() && laLlaveManda()) {
    const extra = el('strong', 'aviso-llave', SIN_SONIDO.llaveIphone);
    avisoSonido.append(document.createTextNode(' '), extra);
  }
  // Adentro del reproductor de un posteo (`T-518`) el juego está donde tiene que estar: mandarlo
  // a "abrirlo aparte" le contradice la puerta por la que entró.
  if (donde && !incrustado()) {
    const extra = el('strong', 'aviso-llave', SIN_SONIDO.incrustado(donde));
    avisoSonido.append(document.createTextNode(' '), extra);
  }
}

$('jugar').addEventListener('click', () => {
  // `D-66`: la llave de silencio del iPhone no apaga el juego. Se pide **antes** de
  // despertar, para que el primer fragmento ya salga por la sesión de la música.
  sonarAunqueEsteEnSilencio();
  // Este clic es el gesto que los celulares exigen para dejar sonar audio. Despertar el
  // motor acá es lo que hace que el primer "Escuchar" no tenga que esperar nada.
  reproductor.despertar();
  /*
   * El casete viaja (ronda 3): el de la portada va a su lugar en la partida, como un solo
   * objeto. Se mide donde estaba, se arma la partida, y el casete de la partida arranca
   * dibujado ENCIMA de aquel —mismo lugar, mismo tamano, misma inclinacion— y viaja hasta el
   * suyo girando; al llegar frena con su inercia. Ya no hay espera antes de cambiar de
   * pantalla. Con movimiento reducido el sub-paso vale cero y no hay viaje.
   */
  const desde = caseteDeLaPortada?.getBoundingClientRect();
  comenzar();
  // El clac va un instante despues: el audio se acaba de despertar en este mismo toque.
  window.setTimeout(() => sonarEfecto('clac'), 90);
  const ms = duracionDe('--duracion-umbral');
  if (!desde || desde.width === 0 || ms <= 0 || typeof casete.animate !== 'function') return;
  const hasta = casete.getBoundingClientRect();
  if (hasta.width === 0) return;
  const curva = getComputedStyle(document.documentElement).getPropertyValue('--curva-cinta').trim() || 'linear';
  casete.animate(
    [
      {
        transformOrigin: '0 0',
        transform: `translate(${desde.left - hasta.left}px, ${desde.top - hasta.top}px) scale(${desde.width / hasta.width}) rotate(5deg)`,
      },
      { transformOrigin: '0 0', transform: 'none' },
    ],
    { duration: ms, easing: curva },
  );
  correrCasete(casete);
  window.setTimeout(() => {
    // Si en el medio la persona ya le dio a escuchar, la cinta sigue: no se frena.
    if (!sonando) frenarCasete(casete);
  }, ms);
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
 * El nivel lo estampa `catalogo()` en build desde lo mas tocado en vivo (`D-45`,
 * `CTR-19.5`): los 8 temas del pozo que mas figuran en los setlists que carga la gente en
 * setlist.fm son `facil`, y el resto se parte en tercios por el mismo conteo: el de abajo
 * es `dificil`, los dos de arriba `media`, y un tema que no figura es `dificil` (`BR-30`,
 * `FIND-71`). Sin conteo, todo cae en `dificil` y esto degrada a un barajado declarado.
 *
 * La vuelta lleva **un solo** Facil y el resto sorteado entre Media y Dificil
 * (`src/lib/tema/vuelta.ts`): sin ese cupo, con todos los discos las cuatro canciones
 * salian siempre de los mismos 8 (`CTR-19.14` punto 3).
 */
function comenzar(): void {
  ronda = armarVuelta(pozo());
  indice = 0;
  puntaje = 0;
  marcador = [];
  recorridos = [];
  tiempos = [];
  racha = 0;
  armarPantalla();
  mostrar(zonaPartida);
  arrancarTema();
}

function arrancarTema(): void {
  escuchoEsteTema = false;
  tramoAcertado = -1;
  cortarLoPendiente();
  // La etiqueta del casete vuelve a ser papel: el disco anterior ya no es la respuesta.
  if (discoDelCasete) casete.classList.remove(discoDelCasete);
  discoDelCasete = '';
  casete.classList.remove('casete-expulsa');
  quitarEntero();
  // La sala vuelve a ser Lobo suelto: el disco anterior ya no es la respuesta.
  sacarLaSala();
  pasoActual = 1;
  elegido = null;
  intentos = [];
  cerrarLista();
  buscadorInput.value = '';
  buscadorInput.disabled = false;
  cajaBuscador.hidden = false;
  // La pantalla sale del modo revelado: vuelve a haber audio que comprar y puntos en juego.
  const veniaDeOtro = zonaPartida.classList.contains('partida--revelada');
  zonaPartida.classList.remove('partida--revelada');
  restantesEl.classList.remove('restantes--llevas');
  if (veniaDeOtro) rebobinar();
  // Si "lo que llevas" todavia estaba contando, se corta: la cabecera vuelve a los intentos.
  contar(restantesEl, puntaje, puntaje, PARTIDA.llevas);
  pintarTodo();
  // "Tema 2 de 4" cae como un sello: es lo que cambio en la cabecera.
  if (veniaDeOtro) estampar(progreso);
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
/**
 * La aguja de la regla. Mientras suena, marca por dónde va la cinta; quieta, se para en el
 * tope del audio que tenés. Vive **adentro del tramo** donde está, a un porcentaje de su
 * ancho: así la ubica el CSS y no una medida en píxeles que envejece cuando la pantalla
 * cambia de ancho (girar el teléfono, abrir el teclado).
 */
let aguja!: HTMLElement;
/** El casete que gira: lo arma `casete.ts`, y la isla le dice cuando corre, frena o rebobina. */
let casete!: HTMLElement;
/** La clase de disco que tiene puesta el casete (su etiqueta tenida), o nada. */
let discoDelCasete = '';
/** El tema entero que esta a la vista en la revelacion (`D-22`), para poder cortarlo. */
let audioEntero: HTMLAudioElement | null = null;
/** Lo que quedo citado para dentro de un momento (el audio despues del golpe o del sello). */
let relojPendiente = 0;
/** Cuantos temas seguidos lleva sacados en esta vuelta. Un tema que se escapa la corta. */
let racha = 0;
/** El sello de la racha, en la cabecera. */
let rachaEl!: HTMLElement;
/** La fila de la caja de texto: es la que se viste de ficha cuando hay un tema elegido. */
let buscadorFila!: HTMLElement;
/** El renglon de ayuda del buscador: se va en cuanto la persona escribio la primera letra. */
let ayudaBuscador!: HTMLElement;
let yaEscribio = false;
/** Las piezas del tema entero que estan puestas en la cabina (`D-22`), para sacarlas. */
let piezasDelEntero: HTMLElement[] = [];

/** Saca de la cabina el reproductor del tema entero: el tema siguiente no lo trae puesto. */
function quitarEntero(): void {
  for (const pieza of piezasDelEntero) pieza.remove();
  piezasDelEntero = [];
  zonaPartida.classList.remove('partida--entero');
}

/** Corta lo que estuviera por sonar o sonando fuera del fragmento: se llama al cambiar de tema. */
function cortarLoPendiente(): void {
  window.clearTimeout(relojPendiente);
  audioEntero?.pause();
  audioEntero = null;
}

/**
 * Un sonido de interfaz (`lib/audio/efectos.ts`). **Nunca encima de un fragmento**: si la
 * cinta esta sonando, no suena nada. Es la unica puerta por la que esta isla hace ruido que
 * no sea musica.
 */
function efecto(cual: Efecto): void {
  if (!sonando) sonarEfecto(cual);
}
let etiquetaPaso!: HTMLElement;
/** Lo que vale acertar en el paso en curso, al lado del audio que tenés. */
let valeEl!: HTMLElement;
let botonEscuchar!: HTMLButtonElement;
/**
 * El rótulo del botón de escuchar, aparte del botón. Con el teclado abierto el botón se
 * achica a un cuadrado del ancho del pulgar y el rótulo se esconde a la vista —no al lector
 * de pantalla—: el símbolo alcanza, y lo que se gana es la regla entera al lado.
 */
let textoEscuchar!: HTMLElement;
let renglones!: HTMLElement;
let buscadorInput!: HTMLInputElement;
let lista!: HTMLElement;
let botonPrincipal!: HTMLButtonElement;
let cajaBuscador!: HTMLElement;
let progreso!: HTMLElement;
/** Una casilla por tema de la vuelta: cómo salió cada uno de los que ya pasaron, y cuál va. */
let casillas!: HTMLElement;
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
/** El tramo de la regla donde sacaste el tema en curso (de 0 a 5), o -1 si todavia no. */
let tramoAcertado = -1;


/** Arma la pantalla de partida una sola vez por vuelta. Después solo se actualiza. */
function armarPantalla(): void {
  zonaPartida.replaceChildren();

  /*
   * La cabecera dice en qué tema de la vuelta estás, y además **cómo te fue en los que ya
   * pasaron**: una casilla por tema, llena si la sacaste, tachada si se te escapó. Es lo
   * que en un fichín es la fila de vidas arriba de la pantalla, y cuesta un renglón que ya
   * estaba. Va escondida del lector de pantalla: el texto de al lado dice lo mismo.
   */
  const cab = el('div', 'cabecera');
  const vuelta = el('div', 'vuelta');
  progreso = el('p', 'paso');
  casillas = armarCasillas(ronda.length);
  // La racha: un sello que aparece al lado de las casillas cuando sacas dos o mas seguidos.
  rachaEl = el('span', 'racha');
  rachaEl.hidden = true;
  vuelta.append(progreso, casillas, rachaEl);
  restantesEl = el('p', 'restantes');
  restantesEl.setAttribute('aria-live', 'polite');
  cab.append(vuelta, restantesEl);
  zonaPartida.append(cab);

  // Lo que ya escribiste en este tema. Nace vacia y va debajo del reproductor: la escalera
  // entera la dibuja la regla, una sola vez, y esta lista es solo lo gastado (ver `juego.css`).
  renglones = el('ol', 'intentos');
  renglones.hidden = true;

  reproductorCaja = el('div', 'reproductor');

  // Lo que tenés y lo que vale, en un renglón. El audio es el dato que el lector de
  // pantalla anuncia cuando cambia; lo que vale es el incentivo, y va al costado.
  const cabeza = el('div', 'reproductor-cabeza');
  etiquetaPaso = el('p', 'barra-etiqueta');
  etiquetaPaso.setAttribute('aria-live', 'polite');
  valeEl = el('span', 'reproductor-vale');
  /*
   * Las dos puertas chicas de la cabina (ronda 3): "¿No se escucha?", que antes era un
   * renglon suelto con su separador entre la tecla y la lista, y el interruptor de los ruidos
   * de interfaz. Van juntas, chicas, debajo de lo que vale. El panel de ayuda se abre mas
   * abajo, a todo el ancho (`anclaAyuda`).
   */
  const puertas = el('div', 'cabina-puertas');
  const abrir = el('button', 'sin-sonido-abrir', SIN_SONIDO.disparador);
  abrir.type = 'button';
  const anclaAyuda = el('div', 'sin-sonido');
  abrir.addEventListener('click', () => abrirAyudaDeSonido(anclaAyuda, abrir));
  puertas.append(
    abrir,
    armarInterruptorDeRuidos({ apagar: PARTIDA.ruidosApagar, prender: PARTIDA.ruidosPrender }),
  );
  cabeza.append(etiquetaPaso, valeEl, puertas);

  // La cabina: el casete, grande, y al lado lo que tenes y lo que vale. La regla va abajo,
  // de lado a lado. SONANDO se estampa sobre la esquina del casete: mismo lugar siempre.
  const cabina = el('div', 'cabina');
  casete = armarCasete();
  palabraCinta = el('span', 'casete-estado', REVELACION.sonando);
  palabraCinta.hidden = true;
  casete.append(palabraCinta);
  cabina.append(casete, cabeza);
  reproductorCaja.append(cabina);

  /*
   * La cinta y su regla (`UX-22`, `T-204`).
   *
   * **La barra de seis cajitas grises con relleno naranja se fue**: era la barra de
   * progreso por defecto de cualquier reproductor, y en este sitio eso es la estetica que
   * `.claude/rules/diseno-marca.md` veta por nombre. En su lugar hay un objeto del mismo
   * idioma que el resto: **una tira de papel impresa como una regla**, que sale del casete.
   *
   * - Cada tramo es un escalon de la escalera, separado del siguiente por un corte de
   *   tinta, con sus medios segundos marcados abajo como las rayitas de una regla.
   * - Lo que todavia no te dimos esta **tramado**: papel con rayado de imprenta, sin tinta.
   * - Lo que tenes esta **entintado** con el naranja de Lobo suelto, que se apoya en el
   *   papel con `multiply`, como tinta de verdad.
   * - La aguja corre mientras suena y se para en el tope cuando no.
   *
   * El casete de al lado gira mientras suena: para quien no escucha nada es la prueba de
   * que el sitio si esta sonando (`UX-03`). Con movimiento reducido el carrete no gira y la
   * palabra de sello dice lo mismo (`CNT-14` §2.5).
   */
  const fila = el('div', 'cinta-fila');
  const pista = el('div', 'barra-pista');
  barra = el('div', 'barra');
  // La regla dibuja lo que el renglon de arriba ya dice con palabras.
  barra.setAttribute('aria-hidden', 'true');
  const anchos = anchosDeTramos();
  let previo = 0;
  for (let i = 0; i < ESCALERA.length; i++) {
    const p = ESCALERA[i]!;
    const tramoBarra = el('div', 'barra-tramo');
    tramoBarra.style.flexGrow = String(anchos[i]);
    // Las rayitas de la regla: una cada medio segundo. Los dos primeros tramos no llegan
    // a tener dos, y ahi una rayita suelta seria un defecto de impresion, no una medida.
    const medios = Math.round((p.segundos - previo) * 2);
    if (medios >= 2) {
      tramoBarra.dataset.marcas = String(medios);
      tramoBarra.style.setProperty('--marcas', String(medios));
    }
    tramoBarra.append(el('div', 'barra-relleno'));
    barra.append(tramoBarra);
    previo = p.segundos;
  }
  aguja = el('span', 'barra-aguja');
  aguja.append(el('span', 'barra-aguja-fiel'));
  pista.append(barra);

  /*
   * Los numeros de la regla: cuanto audio llevas acumulado si llegaste hasta ahi.
   *
   * Van los seis (`etiquetaDeRegla`): el CSS le da a cada tramo un ancho minimo que alcanza
   * para su numero, asi que la forma entera de la escalera se ve antes de gastarla. El del
   * paso en curso se estampa: es el unico numero de la regla que es un dato y no una promesa.
   */
  const escala = el('div', 'barra-escala');
  escala.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < ESCALERA.length; i++) {
    const marca = el('span', 'barra-marca');
    marca.style.flexGrow = String(anchos[i]);
    marca.append(el('span', 'barra-valor', etiquetaDeRegla(i)));
    escala.append(marca);
  }
  pista.append(escala);

  fila.append(pista);
  reproductorCaja.append(fila);

  botonEscuchar = el('button', 'escuchar');
  botonEscuchar.type = 'button';
  textoEscuchar = el('span', 'escuchar-texto', PARTIDA.escuchar);
  botonEscuchar.append(textoEscuchar);
  botonEscuchar.addEventListener('click', alternarSonido);
  reproductorCaja.append(botonEscuchar);

  // Donde se abre el panel de "Si no se escucha": vacio hasta que alguien lo pide.
  reproductorCaja.append(anclaAyuda);

  zonaPartida.append(reproductorCaja);
  zonaPartida.append(renglones);

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

  /*
   * La lista cuelga del bloque y no de la fila de la caja, y se abre para arriba.
   *
   * Sin teclado se ve igual que antes: `.buscador` es la caja posicionada, y su borde de
   * arriba es el de la fila, asi que la lista queda pegada a la caja de texto. Lo que cambia
   * es **con el teclado abierto**: ahi el bloque se desarma en la columna de la pantalla
   * (`.partida--tecleando`), y la lista pasa a ser un renglon mas de esa columna, entre la
   * regla y la caja, que se achica sola cuando no entra. Adentro de la fila no podia: una
   * fila no le puede ceder alto a nadie.
   */
  lista = el('ul', 'sugerencias');
  lista.hidden = true;
  lista.id = 'sugerencias';
  caja.append(lista);

  const fila = el('div', 'buscador-fila');
  buscadorFila = fila;
  buscadorInput = el('input', 'buscador-caja');
  buscadorInput.type = 'text';
  buscadorInput.autocomplete = 'off';
  buscadorInput.autocapitalize = 'off';
  buscadorInput.spellcheck = false;
  // Safari corrige solo aunque `spellcheck` este apagado: "Ji ji ji" no es un error.
  buscadorInput.setAttribute('autocorrect', 'off');
  // La tecla de Enter del teclado del telefono dice "Ir" y no "Intro": elige el primero de
  // la lista, y con un tema elegido, arriesga (`alTeclear`).
  buscadorInput.enterKeyHint = 'go';
  buscadorInput.placeholder = PARTIDA.buscar;
  buscadorInput.setAttribute('aria-label', PARTIDA.buscar);
  buscadorInput.setAttribute('role', 'combobox');
  buscadorInput.setAttribute('aria-expanded', 'false');
  buscadorInput.setAttribute('aria-controls', 'sugerencias');
  buscadorInput.addEventListener('input', alTipear);
  buscadorInput.addEventListener('keydown', alTeclear);
  teclado.vigilar(buscadorInput);
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

  // La ayuda se lee una vez: en cuanto la persona escribio la primera letra, ya la entendio.
  ayudaBuscador = el('p', 'buscador-ayuda', PARTIDA.buscarAyuda);
  ayudaBuscador.hidden = yaEscribio;
  caja.append(ayudaBuscador);

  botonPrincipal = el('button', 'arriesgar', PARTIDA.pasar);
  botonPrincipal.type = 'button';
  botonPrincipal.addEventListener('click', () => (elegido ? arriesgar() : pasar()));
  caja.append(botonPrincipal);

  return caja;
}

// ---------------------------------------------------------------- pintar

function pintarTodo(): void {
  progreso.textContent = PARTIDA.progreso(indice + 1, ronda.length);
  pintarVuelta();
  pintarRenglones();
  pintarBarra(0);
  pintarBotonPrincipal();
  revelacion.hidden = true;
  revelacion.replaceChildren();
  botonEscuchar.disabled = false;
}

/** Las casillas de la cabecera (`sacar-temas.ts`): las que ya pasaron dicen como salieron. */
function pintarVuelta(): void {
  pintarCasillas(
    casillas,
    marcador.map((p) => p > 0),
    indice,
  );
}

function pintarRenglones(): void {
  renglones.replaceChildren();
  // Solo lo gastado: un renglon por intento que ya hiciste, en el orden en que los hiciste.
  intentos.forEach((fallado, i) => {
    const li = el('li', 'intento');
    if (fallado === null) {
      li.classList.add('intento--pasado');
      // Símbolo además de color: ningún estado se comunica solo con tinte (`UX-01`).
      li.append(el('span', 'intento-marca', '·'));
      li.append(el('span', 'intento-texto', PARTIDA.pasado));
    } else {
      li.classList.add('intento--fallado');
      li.append(el('span', 'intento-marca', '✕︎'));
      li.append(el('span', 'intento-texto', PARTIDA.fallado(fallado.titulo)));
    }
    // El ultimo que gastaste es el que se escribe (el barrido), y el unico que queda a la
    // vista con el teclado abierto: es la respuesta a lo que acabas de hacer.
    if (i === intentos.length - 1) li.classList.add('intento--ultimo');
    // Con cuanto audio se jugo este intento: lo ata a su tramo de la regla.
    li.append(el('span', 'intento-paso', ESCALERA[i]!.etiqueta));
    renglones.append(li);
  });
  // Sin nada gastado no hay lista: ni un renglon vacio ocupando lugar.
  renglones.hidden = intentos.length === 0;
}

/** Pinta la regla: los tramos ya ganados entintados, el que suena entintándose, y la aguja. */
function pintarBarra(transcurrido: number): void {
  const tramos = [...barra.querySelectorAll<HTMLElement>('.barra-tramo')];
  const tope = paso(pasoActual).segundos;
  const t = Math.min(Math.max(transcurrido, 0), tope);
  let previo = 0;
  // Donde va la aguja: el primer tramo que todavia no se termino de escuchar.
  let dondeAguja = 0;
  let fraccionAguja = 0;
  for (let i = 0; i < tramos.length; i++) {
    const p = ESCALERA[i]!;
    const relleno = tramos[i]!.firstElementChild as HTMLElement;
    const abierto = p.n <= pasoActual;
    tramos[i]!.classList.toggle('barra-tramo--abierto', abierto);
    const largo = p.segundos - previo;
    const dentro = Math.min(Math.max(transcurrido - previo, 0), largo);
    relleno.style.setProperty('--lleno', String(largo > 0 ? dentro / largo : 0));
    // Lo que hiciste con este escalon queda marcado en su tramo: cruz si erraste, punto si
    // pasaste. Es la misma informacion de la lista de abajo, puesta sobre la escala.
    const gastado = intentos[i];
    tramos[i]!.classList.toggle('barra-tramo--fallo', gastado !== undefined && gastado !== null);
    tramos[i]!.classList.toggle('barra-tramo--pasado', gastado === null);
    tramos[i]!.classList.toggle('barra-tramo--acierto', i === tramoAcertado);
    if (abierto && t >= previo) {
      dondeAguja = i;
      fraccionAguja = largo > 0 ? Math.min((t - previo) / largo, 1) : 1;
    }
    previo = p.segundos;
  }
  // Recien arrancado, la aguja espera al principio de la cinta, no al final del tramo cero.
  if (t === 0) {
    dondeAguja = 0;
    fraccionAguja = 0;
  }
  if (aguja.parentElement !== tramos[dondeAguja]) tramos[dondeAguja]!.append(aguja);
  aguja.style.setProperty('--donde', String(fraccionAguja));

  // El casete y su contador siguen a la aguja: la cinta se pasa de un carrete al otro en
  // proporcion al fragmento entero, y el contador dice el segundo por donde va.
  ponerAvance(casete, t / DURACION_FRAGMENTO_SEG);
  ponerContador(casete, t);

  // La regla de abajo se tine con la barra: el numero del escalon que ya tenes deja de
  // ser una promesa y pasa a ser un dato. Es la misma senal, en la misma columna. El del
  // tope se estampa: es hasta donde llega lo que tenes.
  const marcas = barra.parentElement?.querySelectorAll<HTMLElement>('.barra-marca') ?? [];
  marcas.forEach((marca, i) => {
    marca.classList.toggle('barra-marca--abierta', ESCALERA[i]!.n <= pasoActual);
    marca.classList.toggle('barra-marca--actual', ESCALERA[i]!.n === pasoActual);
  });

  const p = paso(pasoActual);
  etiquetaPaso.textContent = PARTIDA.pasoActual(p.etiqueta);
  valeEl.textContent = PARTIDA.vale(p.puntos);
}

function pintarBotonPrincipal(): void {
  /*
   * Con un tema elegido, "Arriesgá". Sin nada elegido, **pasar dice cuánto audio compra**:
   * "Pasá (+0,4 s)". Es el mismo boton que el juego de referencia escribe como "Skip
   * (+1s)", y le saca al que llega sin idea la duda de si pasar es perder. En el ultimo
   * intento ya no hay audio que comprar: el boton dice lo que va a pasar, que es ver cual era.
   */
  if (elegido) {
    botonPrincipal.textContent = PARTIDA.arriesgar;
  } else {
    const extra = extraAlPasar(pasoActual);
    botonPrincipal.textContent = extra ? PARTIDA.pasarSuma(extra) : PARTIDA.rendirse;
  }
  botonPrincipal.classList.toggle('arriesgar--listo', elegido !== null);
  // Con un tema elegido el campo deja de ser un renglon para escribir y pasa a ser la ficha
  // que elegiste, pegada con cinta.
  buscadorFila.classList.toggle('buscador-fila--elegida', elegido !== null);
  botonPrincipal.disabled = false;

  // Cuántos quedan va escrito y no solo insinuado por los renglones vacíos: el que
  // está por gastar el último tiene que saberlo antes de gastarlo, no después.
  const restantes = INTENTOS - intentos.length;
  restantesEl.textContent = restantes === 1 ? PARTIDA.ultimoIntento : PARTIDA.intentosRestantes(restantes);
  restantesEl.classList.toggle('restantes--ultimo', restantes === 1);
}

// ---------------------------------------------------------------- el teclado

/*
 * Con el teclado abierto, la partida se arma arriba del teclado (`sacar-temas.ts`, que
 * explica el porque). Lo propio de este juego esta en `juego.css`: la columna lleva la
 * regla compacta con su tecla, el ultimo intento, la lista, la caja y el boton.
 *
 * Al salir, la partida recupera su largo y la hoja puede haber quedado en cualquier lado:
 * lo que estaba usando la persona tiene que seguir a la vista.
 */
const teclado = modoTeclado(zonaPartida, {
  alSalir: () => {
    if (!cajaBuscador.hidden) cajaBuscador.scrollIntoView({ block: 'nearest' });
  },
});

// ---------------------------------------------------------------- el sonido

let sonando = false;

/**
 * Que mirar cuando no se escucha nada.
 *
 * El orden **no es alfabetico ni tematico: es por probabilidad**, y el primero de la
 * lista es el que se llevo puesta una partida entera. La llave del iPhone va arriba y
 * solo en iPhone; el resto lo ve cualquiera.
 */
function abrirAyudaDeSonido(ancla: HTMLElement, disparador: HTMLElement): void {
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

  // Primero lo que no se puede detectar y mas caro sale: la llave del iPhone, donde todavia
  // manda (`D-66`).
  if (esIOS() && laLlaveManda()) punto(SIN_SONIDO.llaveIphone, true);
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
    disparador.focus();
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
    // La tecla que salta: el unico clac de la partida, porque aca la cinta ya paro. Al
    // arrancar no hay ninguno: la decima de segundo no comparte el oido con nada.
    efecto('clac');
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
  // El tema entero y el fragmento no suenan juntos.
  audioEntero?.pause();
  sonando = true;
  escuchoEsteTema = true;
  textoEscuchar.textContent = PARTIDA.parar;
  botonEscuchar.classList.add('escuchar--sonando');
  reproductorCaja.classList.add('reproductor--sonando');
  correrCasete(casete);
  palabraCinta.hidden = false;
  reproductor.sonar(tema.slug, segundos, {
    alAvanzar: (t) => pintarBarra(t),
    alTerminar: frenar,
  });
}

function frenar(): void {
  sonando = false;
  textoEscuchar.textContent = PARTIDA.escuchar;
  botonEscuchar.classList.remove('escuchar--sonando');
  reproductorCaja.classList.remove('reproductor--sonando');
  // El sonido ya paro; el carrete sigue un momento por inercia y se detiene solo.
  frenarCasete(casete);
  palabraCinta.hidden = true;
  pintarBarra(paso(pasoActual).segundos);
}

/**
 * Tema nuevo: la cinta se rebobina. La tinta de la regla se recoge hacia el principio, el
 * tramado vuelve a cubrir los tramos y los carretes giran para atras. Dura un sub-paso
 * (`--duracion-umbral`); con movimiento reducido no dura nada y la regla aparece ya vacia.
 */
let relojRebobinado = 0;
function rebobinar(): void {
  window.clearTimeout(relojRebobinado);
  reproductorCaja.classList.add('reproductor--rebobina');
  rebobinarCasete(casete);
  relojRebobinado = window.setTimeout(() => {
    reproductorCaja.classList.remove('reproductor--rebobina');
    // La cinta llego al principio y el mecanismo corta.
    efecto('clac');
  }, duracionDe('--duracion-umbral'));
}

// ---------------------------------------------------------------- el buscador

function alTipear(): void {
  // Escribir después de haber elegido desarma la elección: lo que vale es lo que se
  // eligió de la lista, nunca lo que quedó escrito a mano en la caja.
  elegido = null;
  if (!yaEscribio) {
    yaEscribio = true;
    ayudaBuscador.hidden = true;
  }
  sugerencias = sugerir(buscables(), buscadorInput.value, MAX_SUGERENCIAS);
  marcada = -1;
  pintarLista();
  pintarBotonPrincipal();
}

function pintarLista(): void {
  lista.replaceChildren();
  // La lista es la misma caja de una tecla a la otra: sin esto, si la anterior quedo
  // desplazada, la nueva arranca a mitad de camino y la mejor coincidencia no se ve.
  lista.scrollTop = 0;
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
    // Lo que ya arriesgaste en este tema sigue en la lista —sacarlo haria saltar los
    // renglones mientras escribis— pero no se puede volver a elegir, y dice por que.
    const probada = yaProbado(s.tema);
    if (probada) {
      b.classList.add('sugerencia--probada');
      b.disabled = true;
    }

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
    b.append(
      el('span', 'sugerencia-disco', probada ? `${s.tema.discoTitulo} · ${PARTIDA.yaProbado}` : s.tema.discoTitulo),
    );

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

/** Si este tema ya se arriesgo (y se erro) en el tema en curso. */
function yaProbado(tema: TemaBuscable): boolean {
  return intentos.some((t) => t !== null && t.slug === tema.slug);
}

/** La primera sugerencia que se puede elegir: lo que el Enter toma cuando no marcaste nada. */
function primeraElegible(): number {
  return sugerencias.findIndex((s) => !yaProbado(s.tema));
}

function elegirSugerencia(i: number): void {
  const s = sugerencias[i];
  if (!s || yaProbado(s.tema)) return;
  elegido = s.tema as Tema;
  efecto('tecla');
  buscadorInput.value = s.tema.titulo;
  cerrarLista();
  pintarBotonPrincipal();
  // La ficha elegida se pega en el campo: la fila entera llega torcida y apoya.
  pegar(buscadorFila);
  // Sin teclado en pantalla, el foco va al boton: el pulgar ya esta abajo y lo siguiente
  // es arriesgar. Con el teclado abierto se queda en la caja —mover el foco lo cerraria y
  // la pantalla saltaria— y el boton ya esta a la vista, justo arriba del teclado.
  if (!teclado.activo) botonPrincipal.focus();
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
    /*
     * El Enter hace lo que haria el pulgar, en dos tiempos y sin adivinar de mas: con la
     * lista abierta **elige** (la marcada, o si no la primera que se puede elegir, que es la
     * que mejor coincide), y con un tema ya elegido **arriesga**. Nunca elige y arriesga
     * de un saque: un intento es caro, y se gasta mirando lo que dice la caja.
     *
     * Antes solo elegia si habia una sugerencia sola. En el telefono eso dejaba la tecla
     * "Ir" muerta casi siempre, y es la tecla que el pulgar tiene mas a mano.
     */
    if (marcada >= 0) {
      elegirSugerencia(marcada);
    } else if (sugerencias.length > 0 && primeraElegible() >= 0) {
      elegirSugerencia(primeraElegible());
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
  gastarIntento(true);
}

function pasar(): void {
  intentos.push(null);
  gastarIntento(false);
}

/** Un intento gastado abre el paso siguiente. Si no quedan, el tema se cierra en 0. */
function gastarIntento(erro: boolean): void {
  elegido = null;
  buscadorInput.value = '';
  cerrarLista();

  if (intentos.length >= INTENTOS) {
    reproductor.detener();
    frenar();
    if (erro) {
      efecto('golpe');
      golpear(barra);
    }
    cerrarTema(false);
    return;
  }

  const tramoGastado = barra.children[intentos.length - 1];
  pasoActual = intentos.length + 1;
  reproductor.detener();
  frenar();
  pintarRenglones();
  pintarBarra(0);
  pintarBotonPrincipal();
  /*
   * El error pega (ronda de pulida, 2026-11-17). Antes lo unico que pasaba era una cruz
   * nueva en una lista. Ahora la regla recibe el golpe —se sacude en saltos duros—, la cruz
   * cae como un sello en el tramo que gastaste, el tramado del tramo siguiente se levanta, y
   * los dos numeros que cambiaron se vuelven a estampar: lo que vale ahora, que bajo, y los
   * intentos que te quedan. Pasar no es errar: no hay golpe, solo lo que cambio.
   */
  estampar(valeEl);
  if (!erro) {
    estampar(restantesEl);
    // Se escucha solo el paso nuevo: pasar tiene que devolver audio en el acto, sin que
    // haya que ir a buscar el botón otra vez.
    alternarSonido();
    return;
  }
  /*
   * Ronda 2: el error cae SOBRE la regla. Un sello rojo con la cruz se estampa en el tramo
   * que gastaste —grande, y se va: queda la cruz chica—, la regla se sacude con su marco en
   * rojo, y la cuenta de intentos recibe el mismo golpe. Suena un golpe sordo.
   *
   * Y el audio nuevo espera a que el golpe termine (`--pausa-error`): asi el ruido del error
   * nunca cae encima del fragmento que hay que adivinar. Solo con el motor de Web Audio; el
   * repuesto de `<audio>` necesita sonar adentro del toque, asi que ahi no hay espera ni ruido.
   */
  golpear(barra);
  golpear(restantesEl);
  // Y el casete se sacude con el golpe, como cualquier grabador al que le pegan.
  golpear(casete);
  const golpe = duracionDe('--duracion-golpe');
  if (golpe > 0 && tramoGastado) {
    const sello = el('span', 'barra-sello-error', '✕︎');
    sello.setAttribute('aria-hidden', 'true');
    tramoGastado.append(sello);
    // Se saca solo cuando su animacion termina (y no con un reloj): asi dura lo que dura.
    sello.addEventListener('animationend', () => sello.remove(), { once: true });
  }
  if (reproductor.enRepuesto) {
    alternarSonido();
    return;
  }
  efecto('golpe');
  window.clearTimeout(relojPendiente);
  relojPendiente = window.setTimeout(() => {
    if (temaEnCurso && !sonando) alternarSonido();
  }, duracionDe('--pausa-error'));
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
  if (acerto) tramoAcertado = pasoActual - 1;
  puntaje += ganados;
  marcador.push(acerto ? pasoActual : 0);
  recorridos.push(intentos.map((t) => (t === null ? 'paso' : 'fallo')));
  pintarVuelta();
  // La casilla del tema que se cerro cae como un sello: llena si la sacaste, tachada si no.
  estampar(casillas.children[indice]);
  // La racha: dos o mas seguidos se anotan con un sello en la cabecera; un tema que se
  // escapa la corta y el sello se va.
  racha = acerto ? racha + 1 : 0;
  rachaEl.hidden = racha < 2;
  if (racha >= 2) {
    rachaEl.textContent = PARTIDA.racha(racha);
    estampar(rachaEl);
  }

  /*
   * La pantalla cambia de modo (ronda de pulida, 2026-11-17).
   *
   * Con el tema revelado, la cabecera seguia diciendo "Ultimo intento" y el reproductor
   * "Tenes 10 s de audio · Vale 10": tres datos de una partida que ya habia terminado. Ahora
   * la cabecera dice cuanto llevas —y si acertaste, el numero sube hasta ahi— y el
   * reproductor se queda en un renglon: el casete, la regla con lo que hiciste y la tecla
   * para volver a oirlo (`.partida--revelada` en `juego.css`).
   */
  zonaPartida.classList.add('partida--revelada');
  restantesEl.classList.remove('restantes--ultimo');
  restantesEl.classList.add('restantes--llevas');
  // Lo que llevabas hasta aca. Si acertaste, lo nuevo llega volando desde el sello de la
  // ficha (mas abajo, cuando la ficha ya esta armada) y recien ahi la cuenta sube.
  contar(restantesEl, puntaje - ganados, puntaje - ganados, PARTIDA.llevas);

  // El buscador se esconde entero, no se deshabilita: una caja de texto apagada abajo
  // del resultado es un control muerto ocupando la zona del pulgar.
  cajaBuscador.hidden = true;
  buscadorInput.disabled = true;
  cerrarLista();
  // Y si el teclado estaba abierto, se cierra aca: el premio se mira con la pantalla
  // entera. Se llama a mano porque una caja que desaparece con el foco adentro no siempre
  // avisa que lo perdio.
  teclado.salir();

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

  // El tema entero, si esta (`D-22`), ocupa la cabina: el mismo casete y la regla en largo.
  if (tema.entero) armarEntero(tema);
  pintarRevelacion(tema, acerto, ganados);

  /*
   * El acierto es el unico grito del sitio (`UX-22`, `D-33`).
   *
   * Al acertar pasan dos cosas mas que al fallar, y las dos son la sala, no un elemento:
   * el fondo de la pantalla se vuelve la tapa que sacaste (`T-202`), y si el audio estuvo
   * prendido en este tema, el fragmento entero de diez segundos arranca solo y la estampa
   * se imprime con la musica (`T-201`). Quien jugo a ciegas no recibe sonido que no pidio.
   */
  // El casete se queda con el disco: su etiqueta se tine con la tinta de la tapa revelada.
  discoDelCasete = claseDisco(tema.disco) ?? '';
  if (discoDelCasete) casete.classList.add(discoDelCasete);

  if (acerto) {
    const hazana = marcador[marcador.length - 1] === 1;
    /*
     * El acierto es el momento mas grande del juego (ronda 3). El casete expulsa —salta y
     * vuelve, como cuando se abre la tapa del grabador—, y lo que sumaste vuela desde el
     * sello de la ficha hasta la cuenta de la cabecera, que sube recien cuando llega.
     * Sacarlo con la primera decima es la hazana: el sello dice otra cosa, es mas grande,
     * la ficha lleva doble filete, y el golpe del sello suena dos veces.
     */
    casete.classList.add('casete-expulsa');
    const sumaEl = revelacion.querySelector('.revelacion-suma');
    const cual = indice;
    window.setTimeout(
      () => {
        // Si ya paso al tema siguiente, no hay nada que sumar a la vista.
        if (indice !== cual || temaEnCurso) return;
        const llegar = (): void => {
          if (indice !== cual || temaEnCurso) return;
          contar(restantesEl, puntaje - ganados, puntaje, PARTIDA.llevas);
          estampar(restantesEl);
        };
        if (sumaEl) volar(REVELACION.suma(ganados), 'suma-vuela', sumaEl, restantesEl, llegar);
        else llegar();
      },
      duracionDe('--duracion-pasada') + duracionDe('--escalon-pasada'),
    );
    if (hazana) {
      window.setTimeout(() => {
        if (!sonando) sonarEfecto('sello');
      }, 150);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) navigator.vibrate?.([40, 70, 40]);
    }
    ponerLaSala(tema);
    // El sello de goma contra la hoja, y recien despues la musica: el fragmento entero
    // espera a que el golpe termine (con el repuesto de `<audio>` no hay espera ni ruido).
    if (vaASonar && reproductor.enRepuesto) {
      sonar(DURACION_FRAGMENTO_SEG);
    } else {
      efecto('sello');
      if (vaASonar) {
        const cual = indice;
        window.clearTimeout(relojPendiente);
        relojPendiente = window.setTimeout(() => {
          if (indice === cual && !temaEnCurso && !sonando) sonar(DURACION_FRAGMENTO_SEG);
        }, duracionDe('--pausa-error'));
      }
    }
    // Y el telefono lo siente: un toque corto, solo en el acierto (`sacar-temas.ts`).
    vibrarAcierto();
  }
}

/** Minutos y segundos, como en la contratapa de un disco: 4:07. */
function minutos(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * El tema entero, en la cabina (`D-22`; rondas 2 y 3 de la pulida).
 *
 * Con el tema revelado, **la cabina pasa a ser la del tema entero**: el mismo casete —con sus
 * rollos pasando de un carrete al otro durante todo el tema—, la regla en largo y la tecla. No
 * hay una caja aparte: el fragmento de diez segundos deja su lugar, porque el tema lo contiene.
 *
 * **La regla es un `<input type="range">` vestido de regla**, y es a proposito: el teclado
 * (flechas, Inicio, Fin) y el lector de pantalla (rol, valor, `aria-valuetext` con los
 * minutos) vienen del navegador. El motor es un `<audio>` sin controles y sin precargar: no
 * se baja un byte del tema hasta que alguien lo pide.
 *
 * Si el archivo no carga, el pie lo dice y la tecla se apaga: no queda un control mudo.
 */
function armarEntero(tema: Tema): void {
  quitarEntero();
  const audio = el('audio', 'revelacion-audio');
  audio.preload = 'none';
  audio.src = urlDeTema(tema.slug);
  audioEntero = audio;

  const pista = el('div', 'entero');
  const avance = el('input', 'entero-avance');
  avance.type = 'range';
  avance.min = '0';
  avance.max = '1000';
  avance.step = '1';
  avance.value = '0';
  avance.setAttribute('aria-label', REVELACION.avanceEntero);
  const pie = el('p', 'entero-pie');
  const tiempo = el('span', 'entero-tiempo', minutos(0));
  pie.append(el('span', 'entero-rotulo', REVELACION.escucharEntero), tiempo);
  pista.append(avance, pie, audio);

  const tecla = el('button', 'escuchar entero-tecla');
  tecla.type = 'button';
  const rotulo = el('span', 'solo-lector', REVELACION.escucharEntero);
  tecla.append(rotulo);

  reproductorCaja.append(pista, tecla);
  piezasDelEntero = [pista, tecla];
  zonaPartida.classList.add('partida--entero');

  const pintar = (): void => {
    const total = Number.isFinite(audio.duration) ? audio.duration : 0;
    const f = total > 0 ? audio.currentTime / total : 0;
    avance.value = String(Math.round(f * 1000));
    avance.style.setProperty('--lleno', String(f));
    const dice = total > 0 ? REVELACION.tiempoEntero(minutos(audio.currentTime), minutos(total)) : minutos(audio.currentTime);
    tiempo.textContent = dice;
    avance.setAttribute('aria-valuetext', dice);
    // El casete sigue al tema: la cinta se pasa de un carrete al otro de punta a punta, y el
    // contador cuenta de a diez segundos (llega a 99,9: le alcanza para un tema de un cuarto de hora).
    if (audioEntero === audio && total > 0 && !sonando) {
      ponerAvance(casete, f);
      ponerContador(casete, audio.currentTime / 10);
    }
  };

  tecla.addEventListener('click', () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }
    // El fragmento y el tema no suenan juntos.
    if (sonando) {
      reproductor.detener();
      frenar();
    }
    window.clearTimeout(relojPendiente);
    sonarEfecto('clac');
    void audio.play().catch(() => {
      // Lo dice el `error` de abajo si fue el archivo; si fue otra cosa, la tecla sigue lista.
    });
  });
  audio.addEventListener('play', () => {
    tecla.classList.add('escuchar--sonando');
    rotulo.textContent = PARTIDA.parar;
    correrCasete(casete);
    palabraCinta.hidden = false;
  });
  for (const fin of ['pause', 'ended'] as const) {
    audio.addEventListener(fin, () => {
      tecla.classList.remove('escuchar--sonando');
      rotulo.textContent = REVELACION.escucharEntero;
      frenarCasete(casete);
      if (!sonando) palabraCinta.hidden = true;
      sonarEfecto('clac');
    });
  }
  audio.addEventListener('timeupdate', pintar);
  audio.addEventListener('durationchange', pintar);
  // Arrastrar la aguja o mover las flechas: la cinta salta ahi. Sin duracion todavia —nadie
  // le dio a sonar— no hay a donde saltar, y la aguja vuelve al principio.
  avance.addEventListener('input', () => {
    const total = Number.isFinite(audio.duration) ? audio.duration : 0;
    if (total > 0) audio.currentTime = (Number(avance.value) / 1000) * total;
    pintar();
  });
  audio.addEventListener('error', () => {
    tecla.disabled = true;
    avance.disabled = true;
    tiempo.textContent = REVELACION.enteroNoCarga;
  });
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
  const hazana = acerto && marcador[marcador.length - 1] === 1;
  revelacion.className = `revelacion feedback ${acerto ? 'ok' : 'no'}${disco ? ` ${disco}` : ''}`;
  if (hazana) revelacion.classList.add('revelacion--hazana');
  revelacion.hidden = false;

  /*
   * El grito, estampado (`D-33`). Al acertar, "¡La sacaste!" es un sello de goma que cae
   * sobre la hoja, y al lado otro con lo que sumaste. Son los unicos dos sellos del sitio
   * que se mueven, y se mueven una vez: bajan y apoyan, sin rebote. Al errar la linea queda
   * quieta y en su tinta: no hay nada que festejar, y el sitio no finge que si.
   */
  const cabeza = el('div', 'revelacion-cabeza');
  cabeza.append(el('p', 'micro', hazana ? REVELACION.hazana : acerto ? REVELACION.acerto : REVELACION.fallo));
  if (acerto) {
    const suma = el('span', 'revelacion-suma', REVELACION.suma(ganados));
    // El numero ya lo lee entero el renglon de puntos de mas abajo.
    suma.setAttribute('aria-hidden', 'true');
    cabeza.append(suma);
  }
  revelacion.append(cabeza);
  // La estampa va ANTES del titulo: es el premio, y el titulo es su pie.
  const estampa = armarEstampa(tema, acerto);
  if (estampa) {
    revelacion.append(estampa);
    // La tapa se ve tambien cuando se escapa —en una tinta sola—, y lo que se ve se
    // acredita (`D-21`, condicion 1). Antes solo la acreditaba la sala, que es del acierto.
    acreditarTapas([tema.discoTitulo]);
  }
  revelacion.append(el('h2', 'revelacion-titulo', `${REVELACION.eraEl} ${tema.titulo}`));
  // Con la estampa a la vista el disco ya esta nombrado en su pie, en su letra: el renglon
  // de la ficha no lo repite. Sin estampa (un disco fuera de los diez) lo dice entero.
  revelacion.append(
    el(
      'p',
      'revelacion-ficha',
      estampa
        ? REVELACION.fichaCorta(tema.anio, tema.pista)
        : REVELACION.ficha(tema.discoTitulo, tema.anio, tema.pista),
    ),
  );

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
    // A la vista, lo que sumaste ya esta estampado arriba (`revelacion-suma`); este renglon
    // queda para el lector de pantalla, que el sello no le dice nada.
    revelacion.append(el('p', 'revelacion-puntos solo-lector', REVELACION.puntos(ganados)));
    revelacion.append(el('p', 'revelacion-costo', REVELACION.costo(audio, reloj)));
  } else {
    revelacion.append(el('p', 'revelacion-costo', REVELACION.tardaste(reloj)));
  }

  // `D-22`: el tema entero lo sirve el sitio. Si todavía no está el archivo, no se
  // promete nada — la pantalla simplemente no muestra el reproductor.

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
  acreditarTapas([tema.discoTitulo]);
}

function sacarLaSala(): void {
  if (!sala) return;
  sala.classList.remove('sala-disco--puesta');
  sala.style.removeProperty('--tapa-de-la-sala');
  acreditarTapas([]);
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
  cortarLoPendiente();
  efecto('tecla');

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
  /*
   * El resultado tiene su momento (ronda de pulida, 2026-11-17). Las piezas se apoyan una
   * atras de la otra —`--orden` marca el turno—: el rotulo, la linea que canta, el reloj, que
   * cuenta hasta el tiempo que hiciste, y despues cada tema de la vuelta se pega en la pared
   * como un afiche. Con movimiento reducido todo aparece puesto y el reloj dice el total.
   */
  let orden = 0;
  const entra = <T extends HTMLElement>(pieza: T, clase = 'jugo-entra'): T => {
    pieza.classList.add(clase);
    pieza.style.setProperty('--orden', String(orden++));
    return pieza;
  };
  zonaResultado.append(entra(el('p', 'rotulo-desenlace', RESULTADO.titulo)));
  // La linea que canta, y al lado el sello de la vuelta: la cuenta de temas, en la tinta del
  // tramo, que cae cuando la pantalla termino de entrar (ronda 2). El renglon de abajo del
  // reloj dice lo mismo con palabras, asi que el sello va escondido del lector de pantalla.
  const cabezaDesenlace = entra(el('div', 'desenlace-cabeza'));
  const encabezado = el('h2', `tramo tramo--${t}`, TRAMOS[t]);
  const selloVuelta = el('span', `sello-vuelta tramo--${t}`, RESULTADO.selloVuelta(aciertos, ronda.length));
  selloVuelta.setAttribute('aria-hidden', 'true');
  cabezaDesenlace.append(encabezado, selloVuelta);
  zonaResultado.append(cabezaDesenlace);
  // Y suena cuando cae: el mismo sello de goma del acierto.
  window.setTimeout(() => efecto('sello'), duracionDe('--escalon-umbral') * 9);

  // El reloj: el dato que el jugador cuenta cuando sale de la partida.
  const reloj = el('div', 'cifra');
  reloj.append(el('p', 'cifra-rotulo', RESULTADO.rotuloTiempo));
  const cifraReloj = el('p', 'cifra-numero');
  contar(cifraReloj, 0, sumarTiempos(tiempos), duracion);
  reloj.append(cifraReloj);
  // Abajo del tiempo, las dos cuentas que se dicen en la previa: cuantos sacaste y cuanto
  // sumaste. El punto medio las separa sin sumarlas, igual que en la revelacion.
  reloj.append(
    el('p', 'cifra-pie', `${RESULTADO.sacaste(aciertos, ronda.length)} · ${RESULTADO.puntos(puntaje, maximo)}`),
  );
  zonaResultado.append(entra(reloj));

  // La linea que canta del afiche (`CNT-14` §2.6): la vuelta se pega en la pared. La que
  // nombra es el `h3` de abajo, que sigue diciendo que hay en la lista (`UX-22` §10).
  zonaResultado.append(entra(el('p', 'afiche-canta', RESULTADO.afiche)));
  zonaResultado.append(entra(el('h3', 'resumen-titulo', RESULTADO.detalle)));
  const detalle = el('ol', 'resumen');
  ronda.forEach((tema, i) => {
    const p = marcador[i] ?? 0;
    const disco = claseDisco(tema.disco);
    const li = el('li', `resumen-fila resumen-fila--${p > 0 ? 'ok' : 'no'}${disco ? ` ${disco}` : ''}`);
    li.append(el('span', 'resumen-marca', p > 0 ? '✔︎' : '✕︎'));
    const estampita = armarEstampita(tema.disco, p > 0);
    if (estampita) li.append(estampita);
    const cuerpo = el('span', 'resumen-cuerpo');
    cuerpo.append(el('span', 'resumen-tema', tema.titulo));
    cuerpo.append(el('span', 'resumen-pie', pieDeTema(i)));
    cuerpo.append(armarEscalerita(recorridos[i] ?? [], p > 0, INTENTOS));
    li.append(cuerpo);
    entra(li, 'jugo-pega');
    detalle.append(li);
  });
  zonaResultado.append(detalle);

  /*
   * El pie nombra TODAS las tapas que se ven en esta pantalla (`D-21`, condicion 1,
   * `UX-22` §10): las que la pagina traia, la que quedo de sala, y ahora las cuatro
   * estampas chicas del setlist. Una sola vez por disco aunque aparezca en los tres
   * lugares — de eso se encarga `acreditarTapas` (`sacar-temas.ts`).
   */
  acreditarTapas(ronda.map((t) => t.discoTitulo));


  // 'Compartí' va en la letra de la firma con su tilde: desde `D-65` la tiene, derivada de la
  // propia letra. Antes llevaba `con-tilde`, que la mandaba a la rotulada.
  const compartir = el('button', 'primario firma', RESULTADO.compartir);
  compartir.type = 'button';
  compartir.addEventListener('click', () => void compartirResultado(compartir));

  /*
   * La tarjeta asoma (ronda 2): lo que vas a compartir se ve antes de tocar el boton. Se
   * dibuja una sola vez, aca, y "Comparti" usa esa misma imagen. El hueco existe desde el
   * primer cuadro para que la pantalla no salte cuando la imagen llega; si el dibujo falla, el
   * hueco se va y se comparte igual, sin imagen. Tocarla hace lo mismo que el boton, que es
   * el que tiene nombre para el lector de pantalla.
   */
  const asoma = el('div', 'tarjeta-asoma');
  asoma.setAttribute('aria-hidden', 'true');
  asoma.addEventListener('click', () => compartir.click());
  zonaResultado.append(asoma);
  if (urlDeLaTarjeta) URL.revokeObjectURL(urlDeLaTarjeta);
  urlDeLaTarjeta = '';
  const estaTarjeta = dibujarLaTarjeta();
  tarjetaDeLaVuelta = estaTarjeta;
  void estaTarjeta.then((imagen) => {
    if (tarjetaDeLaVuelta !== estaTarjeta || !asoma.isConnected) return;
    if (!imagen) {
      asoma.remove();
      return;
    }
    urlDeLaTarjeta = URL.createObjectURL(imagen);
    const foto = el('img', 'jugo-pega');
    foto.alt = '';
    foto.src = urlDeLaTarjeta;
    asoma.append(foto);
  });
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
/** La tarjeta de la vuelta que esta en pantalla: se dibuja al llegar al resultado, una vez. */
let tarjetaDeLaVuelta: Promise<Blob | null> | null = null;
let urlDeLaTarjeta = '';

/** Dibuja la tarjeta de la vuelta. Nunca rechaza: si el canvas falla, devuelve `null`. */
function dibujarLaTarjeta(): Promise<Blob | null> {
  const maximo = puntajeMaximo(ronda.length);
  const aciertos = marcador.filter((p) => p > 0).length;
  const t = tramo(aciertos, ronda.length);
  return dibujarTarjeta({
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
    hero: duracion(sumarTiempos(tiempos)),
    puntaje: RESULTADO.puntos(puntaje, maximo),
    sitio: location.host + location.pathname,
  }).catch(() => null);
}

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

  // Adentro de X, el posteo ya escrito va primero (`en-x.ts`): antes de dibujar, que es el
  // primer `await` y le haría perder el toque a la pestaña nueva.
  if (incrustado() && postearEnX(texto, url)) return;

  // Dibujar puede tardar un parpadeo (hay que esperar las letras). Un boton mudo se toca
  // dos veces, asi que dice lo que esta haciendo y no se deja tocar de nuevo.
  const rotuloOriginal = boton.textContent ?? RESULTADO.compartir;
  boton.disabled = true;
  boton.textContent = RESULTADO.armando;

  // La tarjeta ya se dibujo al llegar al resultado (es la que asoma arriba del boton): aca
  // se espera esa misma. Es el premio, no el camino: si el canvas fallo, se comparte sin ella.
  const imagen = await (tarjetaDeLaVuelta ?? dibujarLaTarjeta());

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
