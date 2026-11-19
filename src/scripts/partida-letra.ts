/**
 * La isla de "completá la letra" (`US-03`).
 *
 * Calca la mecánica de `partida.ts` y `partida-tapa.ts` —tres pantallas, cuatro
 * opciones, feedback con símbolo además de color— y cambia lo único que cambia: la
 * pregunta es un verso con un hueco.
 *
 * **Dos reglas que atraviesan el archivo:**
 *
 *  1. **Nada se escribe con `innerHTML`.** Todo con `createElement` y `textContent`.
 *  2. **El verso no se arma nunca entero.** `CTR-04` lo parte en `antes` / `respuesta` /
 *     `despues` justamente para que no exista una versión completa esperando a que
 *     alguien la lea, y acá se respeta: las tres partes se pintan como nodos separados y
 *     no se concatenan ni siquiera para mostrar el acierto.
 *
 * ## El objeto del juego: la pintada (ronda de pulida, 2026-11-18)
 *
 * El verso está **pintado en una pared**, y la palabra que falta se cayó con el revoque: en
 * su lugar asoma el ladrillo ("te falta un diente en la sonrisa", dice la portada). Las cuatro
 * opciones son **plantillas de cartón caladas**, apoyadas al pie de la pared. La que elegís va
 * hasta el hueco, se apoya, y al levantarse deja la palabra pintada, que chorrea. Si no era,
 * queda tachada con aerosol —y se sigue leyendo— y **la que era se pinta en su propio renglón,
 * debajo**, sin empujar el verso. Después cae el sello a la altura del hueco, salta polvo de
 * revoque, y recién ahí llega la ficha: un afiche de papel pegado donde estaban las plantillas.
 * Al seguir, el rodillo tapa la pintada vieja y destapa la nueva.
 *
 * **La cantidad de letra a la vista no cambió**: son los mismos versos de contexto por nivel
 * (`BR-03`) y el mismo hueco. Cambió dónde están escritos.
 *
 * Ningún estado depende del movimiento ni del color: lo errado lleva su cruz y su tachón, lo
 * acertado su tilde, y la ficha lo dice con palabras. Con movimiento reducido todo aparece en
 * su estado final (los tiempos salen de tokens que el corte lleva a cero).
 */

import { armarRonda, contarAciertos } from '../lib/quiz/ronda.ts';
import { tramo } from '../lib/quiz/tramo.ts';
import { botonCorreccion } from './correccion.ts';
import type { Item, Opcion } from '../lib/letra/banco.ts';
import { PANTALLA_0, PARTIDA, RESULTADO, TRAMOS, TARJETA } from '../lib/letra/copy.ts';
import { armarLink, leerDesafio } from '../lib/desafio.ts';
import { botonCompartir } from './compartir.ts';
import { tituloDelDisco } from '../lib/letra/discos.ts';
import { nombreArchivo } from '../lib/tarjeta/plan.ts';
import { dibujarMuro } from './tarjeta-pared.ts';
import { despertarSalida } from '../lib/audio/contexto.ts';
import { sonarEfecto } from '../lib/audio/efectos.ts';
import { golpear, estampar, volar, contar, duracionDe, armarInterruptorDeRuidos } from './jugo.ts';
import { armarCasillas, pintarCasillas, vibrarAcierto } from './sacar-temas.ts';

const LARGO_RONDA = 8;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const portada = $('portada');
const zonaPartida = $('partida');
const zonaResultado = $('resultado');

/**
 * El banco tal como lo necesita la ronda.
 *
 * `CTR-04` deja abiertos dos modos de respuesta —elegir de una lista o escribir— y por
 * eso `opciones` es opcional en el tipo del banco. Esta pantalla es la de elegir, y
 * `armarRonda()` pide opciones sí o sí. En vez de castear en cada llamada, se estrecha
 * una vez acá: lo que no trae opciones no es jugable en esta pantalla y no entra.
 */
type ItemJugable = Item & { readonly opciones: readonly Opcion[] };

const banco: ItemJugable[] = (JSON.parse($('banco').textContent ?? '[]') as Item[]).filter(
  (i): i is ItemJugable => Array.isArray(i.opciones) && i.opciones.length > 0,
);

let ronda: readonly ItemJugable[] = [];
let indice = 0;
let elegidas: (string | null)[] = [];
/** Cuántos seguidos van. Dos o más se anotan con un sello en la cabecera. */
let racha = 0;
/**
 * Si lo último que se tocó fue con el dedo o el mouse y no con el teclado. Decide si el foco
 * que la isla le pone a "Seguí" dibuja su anillo (ver `conPuntero` en los juegos de sacar temas).
 */
let conPuntero = false;
/** La tarjeta de la vuelta: se dibuja una vez al llegar al resultado, y "Compartí" usa esa. */
let tarjetaDeLaVuelta: Promise<Blob | null> | null = null;
let archivoDeLaTarjeta: File | null = null;
let urlDeLaTarjeta = '';

/** Las piezas de la pantalla en curso. Se rehacen en cada verso. */
let cabecera: HTMLElement;
let llevasEl: HTMLElement;
let rachaEl: HTMLElement;
let pared: HTMLElement;
let pintada: HTMLElement;
let pano: HTMLElement;
/** El pie de la pared: donde se apoyan las plantillas y, después, donde se pega la ficha. */
let pie: HTMLElement;
let lista: HTMLUListElement;

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

const aciertosHastaAca = (): number => contarAciertos(ronda.slice(0, elegidas.length), elegidas);
const curvaDelSitio = (): string =>
  getComputedStyle(document.documentElement).getPropertyValue('--curva-cinta').trim() || 'linear';

/*
 * Si alguien llegó por un desafío, la bajada de la portada lo dice (`ADR-02`). El juego
 * va obligatorio (`FIND-28`): sin él, un enlace de otro juego pintaría acá un puntaje que
 * no es de este. `textContent` y jamás `innerHTML`: el nombre viene de la URL.
 */
const JUEGO = 'letra';
{
  const desafio = leerDesafio(location.search, JUEGO);
  const bajada = document.getElementById('subtitulo');
  if (desafio && desafio.forma !== 'identidad' && bajada) {
    bajada.textContent = PANTALLA_0.desafio(desafio.puntaje, desafio.total, desafio.nombre);
  }
}

// El interruptor de los ruidos, en la portada, debajo de la tecla (como en los otros juegos).
document
  .getElementById('ruidos')
  ?.append(armarInterruptorDeRuidos({ apagar: PARTIDA.ruidosApagar, prender: PARTIDA.ruidosPrender }));

/**
 * Arranca la partida desde la portada. Lo llaman el botón "Empezá" y la plantilla apoyada en
 * la pared de la portada, que es el mismo gesto dicho con el objeto del juego.
 */
function arrancar(): void {
  // Este toque es el gesto que los celulares piden para dejar sonar algo: se despierta la
  // salida acá, y los ruidos de la partida (la tecla, el golpe, el sello) ya pueden salir.
  void despertarSalida().then(() => sonarEfecto('clac'));
  /*
   * La pared se abre (ronda 2): la de la portada y la de la partida son el mismo objeto. Se
   * mide dónde estaba la franja de la portada, se arma la partida, y la pared nueva arranca
   * recortada a esa franja y se abre hasta su tamaño. Es un barrido de `clip-path`, como las
   * pasadas de la imprenta, y no un cambio de escala: escalar la pared obligaba a volver a
   * imprimir el ladrillo entero al terminar (un cuadro de ~420 ms con la CPU ×4, medido). Con
   * movimiento reducido el sub-paso vale cero y no hay viaje.
   */
  const desde = portada.querySelector('.pared')?.getBoundingClientRect();
  comenzar();
  const ms = duracionDe('--duracion-umbral');
  if (!desde || desde.width === 0 || ms <= 0 || typeof pared.animate !== 'function') return;
  const hasta = pared.getBoundingClientRect();
  if (hasta.width === 0 || hasta.height === 0) return;
  const arriba = Math.max(0, Math.round(desde.top - hasta.top));
  const abajo = Math.max(0, Math.round(hasta.bottom - desde.bottom));
  pared.animate([{ clipPath: `inset(${arriba}px 0 ${abajo}px 0)` }, { clipPath: 'inset(0 0 0 0)' }], {
    duration: ms,
    easing: curvaDelSitio(),
  });
}

$('jugar')?.addEventListener('click', arrancar);

/*
 * La plantilla de la portada (ronda 3): un cartón apoyado en la pared, con la palabra del
 * botón. Si la tocás, va hasta el hueco como en la partida, se queda apoyada y la partida arranca.
 * Es un atajo del mismo botón: va escondida del lector de pantalla y fuera del orden de
 * tabulación, porque "Empezá" ya está ahí y dice lo mismo.
 */
{
  const plantillaDeLaPortada = document.getElementById('plantilla-portada');
  const huecoDeLaPortada = portada.querySelector('.hueco--muestra');
  let yendo = false;
  plantillaDeLaPortada?.addEventListener('click', () => {
    if (yendo) return;
    yendo = true;
    sonarEfecto('tecla');
    const soltar = (): void => {
      yendo = false;
    };
    if (huecoDeLaPortada) llevarPlantilla(plantillaDeLaPortada, huecoDeLaPortada, arrancar, soltar, true);
    else {
      arrancar();
      soltar();
    }
  });
}

function comenzar(): void {
  ronda = armarRonda(banco, Math.min(LARGO_RONDA, banco.length));
  indice = 0;
  elegidas = [];
  racha = 0;
  mostrar(zonaPartida);
  zonaPartida.replaceChildren();
  pintarPregunta();
  window.scrollTo(0, 0);
}

/**
 * El verso con el hueco.
 *
 * `relleno` es lo que va en el lugar de la respuesta: el hueco mientras no contestó, y la
 * palabra pintada después. Se pasa como nodo aparte para no concatenar el verso.
 *
 * Lo que sigue al hueco va pegado si arranca con un signo ("vida" + "."): con el espacio de
 * siempre el punto quedaba suelto, un renglón más abajo si la línea partía ahí.
 */
function pintarVerso(relleno: HTMLElement, item: ItemJugable): HTMLElement {
  const linea = el('p', 'verso-hueco');
  if (item.hueco.antes) linea.append(document.createTextNode(item.hueco.antes + ' '));
  linea.append(relleno);
  if (item.hueco.despues) {
    const pegado = /^[.,;:!?…)»”]/.test(item.hueco.despues);
    linea.append(document.createTextNode((pegado ? '' : ' ') + item.hueco.despues));
  }
  return linea;
}

/** El hueco: el ladrillo que asoma donde se cayó la palabra. Quien no ve, escucha que falta una. */
function armarHueco(): HTMLElement {
  const hueco = el('span', 'hueco');
  hueco.append(dibujo('span', 'hueco-ladrillo'), el('span', 'solo-lector', PARTIDA.huecoDice));
  return hueco;
}

/** Una palabra recién pintada chorrea: dos gotas que bajan del pie de la letra y se quedan. */
function chorrear(palabra: HTMLElement, semilla: number): void {
  const gotas: readonly (readonly [number, number])[] = [
    [18 + ((semilla * 37) % 22), 6 + ((semilla * 13) % 6)],
    [58 + ((semilla * 53) % 26), 4 + ((semilla * 29) % 5)],
  ];
  gotas.forEach(([x, largo], i) => {
    const gota = dibujo('span', 'chorreada');
    gota.style.setProperty('--x', `${x}%`);
    gota.style.setProperty('--largo', `${largo}px`);
    gota.style.setProperty('--orden', String(i));
    palabra.append(gota);
  });
}

/** Lo que pusiste y no era: la palabra apagada, con la raya de aerosol y la cruz. Se lee igual. */
function armarErrada(texto: string): { readonly errada: HTMLElement; readonly palabra: HTMLElement } {
  const errada = dibujo('span', 'hueco-errada');
  const palabra = el('span', 'hueco-errada-palabra', texto);
  errada.append(palabra);
  return { errada, palabra };
}

/**
 * La cabecera: en qué verso vas (con una casilla por verso, la fila de vidas de un fichín),
 * la racha, la tecla de los ruidos y cuánto llevás.
 */
function armarCabecera(): HTMLElement {
  const cab = el('div', 'cabecera');
  const vuelta = el('div', 'vuelta');
  const casillas = armarCasillas(ronda.length);
  pintarCasillas(
    casillas,
    ronda.slice(0, elegidas.length).map((it, i) => elegidas[i] === it.hueco.respuesta),
    indice,
  );
  rachaEl = el('span', 'racha');
  rachaEl.hidden = racha < 2;
  if (racha >= 2) rachaEl.textContent = PARTIDA.racha(racha);
  vuelta.append(el('span', 'paso', PARTIDA.progreso(indice + 1, ronda.length)), casillas, rachaEl);
  const ruidos = armarInterruptorDeRuidos({ apagar: PARTIDA.ruidosTecla, prender: PARTIDA.ruidosTecla });
  ruidos.classList.add('ruidos-tecla');
  llevasEl = el('span', 'restantes restantes--llevas', PARTIDA.llevas(aciertosHastaAca()));
  llevasEl.setAttribute('aria-live', 'polite');
  cab.append(vuelta, ruidos, llevasEl);
  return cab;
}

/**
 * La pintada vieja, tapada a rodillo, no está siempre en el mismo lugar: cada verso es otra
 * pared de la misma cuadra. La semilla es el verso, así que el mismo verso la encuentra siempre
 * donde estaba. Es dibujo: cambia corrida, altura, giro y lado, nada más.
 */
function moverLaTapada(semillaTexto: string): void {
  const tapada = pared.querySelector<HTMLElement>('.pared-tapada');
  if (!tapada) return;
  let s = 7;
  for (const letra of semillaTexto) s = (s * 31 + letra.charCodeAt(0)) % 9973;
  tapada.style.setProperty('--tapada-x', `${0.6 - (s % 7) * 1.1}rem`);
  tapada.style.setProperty('--tapada-y', `${-((s >> 3) % 5) * 0.9}rem`);
  tapada.style.setProperty('--tapada-giro', `${-4 + ((s >> 5) % 8)}deg`);
  tapada.style.setProperty('--tapada-lado', (s >> 2) % 2 ? '1' : '-1');
}

/**
 * La pantalla de un verso. `destapa` es si llega detrás del rodillo (al pasar de un verso al
 * otro y al arrancar): el paño nace tapado y el rodillo se va, dejando la pintada a la vista.
 */
function pintarPregunta(destapa = true): void {
  const item = ronda[indice]!;
  zonaPartida.classList.remove('partida--revelada');

  const cabeceraNueva = armarCabecera();
  if (cabecera?.isConnected) cabecera.replaceWith(cabeceraNueva);
  else zonaPartida.prepend(cabeceraNueva);
  cabecera = cabeceraNueva;

  /*
   * La pared: de ladrillo a la vista, de borde a borde y hasta abajo. Es fondo y no lleva
   * texto encima: lo que se lee va sobre el paño pintado (`--fondo`, el par medido) o sobre
   * papel. La componen, además, un caño que la cruza por arriba y una pintada vieja tapada
   * con rodillo: son dibujo, para que el ladrillo no sea un vacío (ronda 2).
   */
  /*
   * **La pared es la misma de un verso al otro**: se le cambia lo que tiene pegado y pintado,
   * no el ladrillo. Rehacerla entera en cada verso hacía que el navegador volviera a imprimir
   * las máscaras del ladrillo cada vez (un cuadro de ~220 ms con la CPU ×4 en cada pase, medido).
   */
  if (pared?.isConnected && pared.parentElement === zonaPartida) {
    for (const hijo of [...pared.children]) {
      if (!hijo.matches('.pared-ladrillos, .pared-cano, .pared-tapada')) hijo.remove();
    }
  } else {
    pared = el('div', 'pared');
    pared.append(dibujo('span', 'pared-ladrillos'), dibujo('span', 'pared-cano'), dibujo('span', 'pared-tapada'));
    zonaPartida.append(pared);
  }
  moverLaTapada(item.id);

  // BR-03: en dificil no se nombra ni el tema ni el disco. La pista de mas es justamente
  // lo que separa un nivel del otro, asi que se respeta acá y no en el generador.
  // De dónde sale el verso va en un afiche pegado a la pared: papel, cinta, apenas torcido.
  if (item.dificultad !== 'dificil') {
    const afiche = el('p', 'pared-afiche');
    afiche.append(el('span', 'pared-afiche-tema', PARTIDA.deQueTema(item.tema.titulo)));
    if (item.dificultad === 'facil') {
      afiche.append(el('span', 'pared-afiche-disco', tituloDelDisco(item.tema.disco)));
    }
    pared.append(afiche);
  }

  /*
   * La pintada: el paño donde el revoque aguantó, con su canto roto arriba y abajo. Adentro,
   * los versos; el del hueco es el que grita. Debajo del verso del hueco hay **un renglón
   * guardado para la corrección** (`.verso-correccion`): si errás, ahí se pinta la que era,
   * sin empujar nada. El rodillo es la pieza que tapa y destapa al pasar de un verso a otro.
   */
  const cuadro = el('div', 'pared-cuadro');
  cuadro.append(el('h2', 'enunciado pared-pregunta', PARTIDA.pregunta));
  pintada = el('div', 'verso-bloque pintada');
  pano = el('div', 'pintada-pano');
  for (const verso of item.contexto.antes) pano.append(el('p', 'verso-contexto', verso));
  pano.append(pintarVerso(armarHueco(), item), dibujo('p', 'verso-correccion'));
  for (const verso of item.contexto.despues) pano.append(el('p', 'verso-contexto', verso));
  pano.append(dibujo('span', 'pintada-rodillo'));
  pintada.append(dibujo('span', 'pintada-canto pintada-canto--arriba'), pano, dibujo('span', 'pintada-canto pintada-canto--abajo'));
  if (destapa) pintada.classList.add('pintada--se-destapa');
  cuadro.append(pintada);
  pared.append(cuadro);

  // Las plantillas: cuatro cartones calados, apoyados al pie de la pared. Se apoyan de a uno.
  pie = el('div', 'pared-pie');
  lista = el('ul', 'opciones plantillas');
  item.opciones.forEach((op, i) => {
    const li = el('li');
    const b = el('button', 'opcion plantilla jugo-pega', op.texto);
    b.type = 'button';
    b.style.setProperty('--orden', String(i + 2));
    b.addEventListener(
      'click',
      (ev) => {
        conPuntero = ev.detail > 0;
        responder(op.texto, b);
      },
      { once: true },
    );
    li.append(b);
    lista.append(li);
  });
  pie.append(lista);
  pared.append(pie);
}

/**
 * La plantilla va hasta el hueco, se apoya y vuelve. `alApoyar` corre con la plantilla puesta
 * encima: es cuando se pinta. Con movimiento reducido (o sin `animate`) no hay viaje y se
 * pinta en el acto. Solo se anima `transform`.
 */
function llevarPlantilla(
  boton: HTMLElement,
  hueco: Element,
  alApoyar: () => void,
  alVolver: () => void,
  seQueda = false,
): Animation | null {
  const ms = duracionDe('--duracion-umbral') * 2.2;
  const desde = boton.getBoundingClientRect();
  const hasta = hueco.getBoundingClientRect();
  if (ms <= 0 || typeof boton.animate !== 'function' || desde.width === 0 || hasta.width === 0) {
    alApoyar();
    alVolver();
    return null;
  }
  const escala = Math.max(0.6, Math.min(1, (hasta.width + 52) / desde.width));
  const dx = hasta.left + hasta.width / 2 - (desde.left + desde.width / 2);
  const dy = hasta.top + hasta.height / 2 - (desde.top + desde.height / 2);
  const puesta = `translate(${Math.round(dx)}px, ${Math.round(dy)}px) scale(${escala.toFixed(3)}) rotate(-2deg)`;
  const curva = curvaDelSitio();
  // Una pieza lleva una sola animación: la de apoyarse al entrar ya terminó o se corta acá.
  boton.classList.remove('jugo-pega');
  boton.classList.add('plantilla--vuela');
  if (seQueda) {
    // La de la portada no vuelve: llega, se queda apoyada y ahí arranca la partida. Armar la
    // partida le lleva un rato al teléfono, y con la plantilla volviendo a su lugar se la veía
    // irse y la pantalla seguía quieta.
    const ida = boton.animate([{ transform: 'none' }, { transform: puesta }], { duration: ms * 0.4, easing: curva, fill: 'forwards' });
    const llegar = (): void => {
      alApoyar();
      ida.cancel();
      boton.classList.remove('plantilla--vuela');
      alVolver();
    };
    ida.addEventListener('finish', llegar, { once: true });
    return ida;
  }
  const vuelo = boton.animate(
    [
      { transform: 'none', easing: curva },
      { transform: puesta, offset: 0.38, easing: 'linear' },
      { transform: puesta, offset: 0.62, easing: curva },
      { transform: 'none' },
    ],
    { duration: ms },
  );
  window.setTimeout(alApoyar, ms * 0.5);
  const fin = (): void => {
    boton.classList.remove('plantilla--vuela');
    alVolver();
  };
  vuelo.addEventListener('finish', fin, { once: true });
  vuelo.addEventListener('cancel', fin, { once: true });
  return vuelo;
}

/**
 * El sello del cierre cae **sobre el canto de arriba del paño**, a la derecha: pisa ladrillo y
 * revoque, nunca lo pintado (en la ronda 2 caía a la altura del hueco y tapaba la punta del
 * renglón). Al apoyar salta polvo de revoque: unas motas que caen y se van. Cuando el sello se
 * va deja su marca chica en ese lugar (`dejarLaMarca`), que dura hasta el verso siguiente.
 */
/** Dónde cae el sello, medido desde arriba del paño: un poco por encima de su borde. */
const ALTURA_DEL_SELLO = -32;

function sellarLaPared(acerto: boolean): void {
  const y = ALTURA_DEL_SELLO;
  const sello = dibujo('span', `sello-cae sello-cae--${acerto ? 'ok' : 'no'}`, acerto ? '✔︎' : '✕︎');
  sello.style.setProperty('--sello-y', `${Math.round(y)}px`);
  pintada.append(sello);
  const motas: readonly (readonly [number, number])[] = [
    [-58, 46],
    [-24, 84],
    [10, 66],
    [38, 96],
    [-80, 22],
    [64, 40],
    [-6, 112],
  ];
  motas.forEach(([dx, dy], i) => {
    const mota = dibujo('span', 'polvo');
    mota.style.setProperty('--sello-y', `${Math.round(y)}px`);
    mota.style.setProperty('--dx', `${dx}px`);
    mota.style.setProperty('--dy', `${dy}px`);
    mota.style.setProperty('--orden', String(i % 3));
    pintada.append(mota);
  });
}

/** Lo que queda del sello cuando llega la ficha: la marca chica, en el mismo lugar. */
function dejarLaMarca(acerto: boolean): void {
  for (const resto of pintada.querySelectorAll('.sello-cae, .polvo')) resto.remove();
  if (pintada.querySelector('.sello-marca')) return;
  const marca = dibujo('span', `sello-marca sello-marca--${acerto ? 'ok' : 'no'}`, acerto ? '✔︎' : '✕︎');
  marca.style.setProperty('--sello-y', `${ALTURA_DEL_SELLO}px`);
  pintada.append(marca);
}

function responder(texto: string, boton: HTMLButtonElement): void {
  const item = ronda[indice]!;
  if (elegidas.length > indice) return;
  elegidas[indice] = texto;
  const acerto = texto === item.hueco.respuesta;
  const cual = indice;
  const estaPared = pintada;
  const vigente = (): boolean => indice === cual && pintada === estaPared && estaPared.isConnected;

  sonarEfecto('tecla');
  const botones = [...zonaPartida.querySelectorAll<HTMLButtonElement>('.opcion')];
  for (const b of botones) b.disabled = true;

  const linea = pano.querySelector('.verso-hueco')!;

  /*
   * El verso se vuelve a pintar con la palabra en su lugar: es la recompensa de haber
   * contestado, y se ve completo recién ahora.
   *
   * **El hueco toma el ancho de lo elegido en el momento del toque** (`.hueco--por-pintar`:
   * sigue siendo hueco, sin letra a la vista), y la plantilla viaja hasta ahí. Después de eso
   * **el verso no se vuelve a mover**: si no era, lo elegido queda donde se pintó, tachado y
   * legible, y la que era se pinta en el renglón guardado de abajo, a la altura de lo tachado.
   */
  const correcta = el('span', 'hueco resuelto', item.hueco.respuesta);
  const vestir = (palabra: HTMLElement, marca: string, semilla: number): HTMLElement => {
    chorrear(palabra, semilla);
    return dibujo('span', 'hueco-marca', marca);
  };
  const { errada, palabra: palabraErrada } = armarErrada(texto);
  const porPintar = acerto ? correcta : palabraErrada;
  porPintar.classList.add('hueco--por-pintar');
  const lineaNueva = pintarVerso(acerto ? correcta : errada, item);
  linea.replaceWith(lineaNueva);
  /*
   * La que era va **colgada de lo tachado**, justo debajo. Si lo tachado quedó en el último
   * renglón del verso, cae en el aire que el verso ya tiene abajo y nada se mueve. Si el verso
   * sigue en otro renglón, lo tachado le hace lugar ahora, en el mismo toque en que el hueco
   * tomó su ancho (`hueco-errada--con-lugar`): es el único momento en que el verso se acomoda.
   */
  if (!acerto && errada.getBoundingClientRect().bottom < lineaNueva.getBoundingClientRect().bottom - 8) {
    errada.classList.add('hueco-errada--con-lugar');
  }

  /*
   * El cierre dura 1,7 s y **se puede adelantar con un toque** en la pared (o con Enter o la
   * barra): lo que falte pasa en el acto y llega la ficha. No se pierde ningún estado, porque
   * adelantar no saltea pasos: los corre. Cada paso se hace una sola vez (`pintado`,
   * `cerrado`, `conFicha`), venga de su reloj o del toque, y `pintada--ya` lleva a cero los
   * tiempos de lo que se estaba pintando, así queda en su forma final.
   */
  let pintado = false;
  let cerrado = false;
  let conFicha = false;
  let apurado = false;
  let relojDeLaFicha = 0;
  let vuelo: Animation | null = null;
  const laPared = pared;
  const alTeclear = (ev: KeyboardEvent): void => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    conPuntero = false;
    apurar();
  };
  const soltarElApuro = (): void => {
    laPared.removeEventListener('pointerdown', apurar);
    document.removeEventListener('keydown', alTeclear);
  };

  const pintar = (): void => {
    if (pintado || !vigente()) return;
    pintado = true;
    porPintar.classList.remove('hueco--por-pintar');
    if (acerto) {
      correcta.append(vestir(correcta, '✔︎', item.hueco.respuesta.length));
      estampar(correcta);
      sonarEfecto('sello');
      vibrarAcierto();
      return;
    }
    palabraErrada.append(el('span', 'hueco-tachon'));
    errada.append(vestir(palabraErrada, '✕︎', texto.length + 3));
    // La que era llega un golpe después, cuando el tachón ya pasó: debajo de lo tachado,
    // corrida un codo para adentro. El codo (un trazo en la misma pintura) baja de lo tachado
    // y la señala, así no se lee como un verso suelto. Si no entra hasta el borde del paño,
    // se corre para atrás lo que haga falta.
    correcta.classList.add('la-que-era', 'resuelto--despues');
    correcta.append(vestir(correcta, '✔︎', item.hueco.respuesta.length));
    errada.append(correcta);
    const codo = parseFloat(getComputedStyle(correcta).fontSize) * 1.15;
    const borde = pano.getBoundingClientRect();
    const desde = errada.getBoundingClientRect().left;
    const sobra = desde + codo + correcta.offsetWidth - (borde.right - 10);
    const corre = Math.max(borde.left + 10 + codo - desde, codo - Math.max(0, sobra));
    correcta.style.setProperty('--corre', `${Math.round(corre)}px`);
    golpear(pano);
    sonarEfecto('golpe');
  };

  const mostrarLaFicha = (): void => {
    if (conFicha) return;
    conFicha = true;
    soltarElApuro();
    if (vigente()) pintarFicha(item, acerto);
  };

  const cerrar = (): void => {
    if (cerrado || !vigente()) return;
    cerrado = true;
    // Las plantillas dicen cuál era y cuál elegiste, con símbolo además de tinta.
    for (const b of botones) {
      if (b.textContent === item.hueco.respuesta) b.classList.add('es-correcta');
      if (b === boton && !acerto) b.classList.add('es-elegida');
    }
    // La casilla de este verso dice ya cómo salió, y la racha se anota o se corta.
    const casillas = cabecera.querySelector<HTMLElement>('.vuelta-casillas');
    if (casillas) {
      pintarCasillas(
        casillas,
        ronda.slice(0, elegidas.length).map((it, i) => elegidas[i] === it.hueco.respuesta),
        indice,
      );
      estampar(casillas.children[indice]);
    }
    racha = acerto ? racha + 1 : 0;
    rachaEl.hidden = racha < 2;
    if (racha >= 2) {
      rachaEl.textContent = PARTIDA.racha(racha);
      estampar(rachaEl);
    }
    // El primer tiempo del cierre: el sello cae sobre la pared, donde está el ojo.
    sellarLaPared(acerto);
    const espera = duracionDe('--duracion-pasada') + duracionDe('--duracion-umbral') + duracionDe('--duracion-paso');
    if (espera > 0 && !apurado) relojDeLaFicha = window.setTimeout(mostrarLaFicha, espera);
    else mostrarLaFicha();
  };

  function apurar(): void {
    if (conFicha || !vigente()) return;
    apurado = true;
    estaPared.classList.add('pintada--ya');
    pintar();
    if (cerrado) {
      window.clearTimeout(relojDeLaFicha);
      mostrarLaFicha();
    } else if (vuelo && vuelo.playState !== 'finished') {
      // Terminar el vuelo dispara su final, que cierra; y cerrar, apurado, trae la ficha.
      vuelo.finish();
    } else {
      cerrar();
    }
  }

  vuelo = llevarPlantilla(boton, porPintar, pintar, cerrar);
  // El toque que eligió la plantilla no cuenta: se empieza a escuchar en la vuelta siguiente.
  window.setTimeout(() => {
    if (conFicha || !vigente()) return;
    laPared.addEventListener('pointerdown', apurar);
    document.addEventListener('keydown', alTeclear);
  }, 0);
}

/**
 * El segundo tiempo del cierre: las plantillas se van y en su lugar se pega **un afiche de
 * papel**, con cinta, que es la ficha del verso. Tiene la gramática de los otros juegos
 * pulidos —el grito estampado y lo que sumaste, el dato, y "Seguí" adentro, cerrando la
 * columna, en la tinta del disco—. La letra va en `--fondo` sobre papel, el par medido; el
 * estado lo dicen el grito, la marca dibujada y el filete, nunca solo la tinta.
 *
 * Debajo, en un zócalo pintado, de dónde salió la letra y la puerta para corregirla.
 */
function pintarFicha(item: ItemJugable, acerto: boolean): void {
  zonaPartida.classList.add('partida--revelada');
  dejarLaMarca(acerto);
  lista.hidden = true;

  const afiche = el('div', `feedback ficha-verso jugo-pega ${acerto ? 'ok' : 'no'}`);
  // Lo que se anuncia es lo que dice el afiche, sin el botón: ese panel se lee solo (`UX-09`).
  const dice = el('div', 'ficha-verso-dice');
  dice.setAttribute('role', 'status');
  const cabeza = el('div', 'ficha-verso-cabeza');
  cabeza.append(
    dibujo('span', 'ficha-verso-marca', acerto ? '✔︎' : '✕︎'),
    el('p', 'micro ficha-verso-grito', acerto ? PARTIDA.ok : PARTIDA.no),
  );
  const sumaEl = acerto ? dibujo('span', 'ficha-verso-suma', PARTIDA.suma) : null;
  if (sumaEl) cabeza.append(sumaEl);
  dice.append(cabeza);
  if (!acerto) dice.append(el('p', 'respuesta-dato', `${PARTIDA.eraLa} “${item.hueco.respuesta}”.`));

  // De qué tema era, **solo si la pared no lo dijo**: en difícil no hay afiche del tema
  // (`BR-03` lo esconde mientras se juega), y con el verso ya contestado dejó de ser una pista
  // y pasó a ser el dato que te llevás. En los otros dos niveles ese afiche sigue a la vista.
  if (item.dificultad === 'dificil') {
    const tema = el('p', 'ficha-verso-tema');
    tema.append(
      el('span', 'ficha-verso-titulo', item.tema.titulo),
      el('span', 'ficha-verso-disco', tituloDelDisco(item.tema.disco)),
    );
    dice.append(tema);
  }

  if (item.explicacion) dice.append(el('p', 'explicacion', item.explicacion));

  if (item.rotulo) {
    dice.append(
      el(
        'p',
        `sello sello--${item.rotulo.tipo}`,
        `${item.rotulo.tipo === 'leyenda' ? '◆' : '❝'} ${item.rotulo.texto}`,
      ),
    );
  }
  afiche.append(dice);

  const ultimo = indice + 1 >= ronda.length;
  const seguir = el('button', 'primario seguir', ultimo ? PARTIDA.ultimo : PARTIDA.seguir);
  seguir.type = 'button';
  seguir.addEventListener('click', avanzar, { once: true });
  afiche.append(seguir);
  pie.append(afiche);

  /*
   * El zócalo de la ficha (`UX-09`): **afuera** del panel de respuesta y después de `Seguí` en
   * el orden del DOM, que es el orden en que se lee y se tabula.
   *
   * `T-145` / `D-25`: la fuente del verso, con su enlace. Bajo fuente única el jugador tiene
   * derecho a saber de dónde salió lo que el juego acaba de darle por bueno. `BR-21`: y el
   * botón de corrección al lado, como control secundario.
   */
  const zocalo = el('div', 'ficha-pie');
  const fuente = item.fuenteLetra?.[0];
  if (fuente) {
    const linea = el('p', 'fuente-verso');
    const enlace = el('a', 'fuente-verso-enlace', PARTIDA.fuenteDe(fuente.sitio));
    enlace.href = fuente.url;
    enlace.target = '_blank';
    enlace.rel = 'noopener';
    linea.append(enlace);
    zocalo.append(linea);
  }
  zocalo.append(
    botonCorreccion(() => ({
      juego: 'letra',
      itemId: item.id,
      ubicacion: 'el hueco',
      dice: `${item.hueco.antes}[${item.hueco.respuesta}]${item.hueco.despues}`,
      ...(item.fuenteLetra?.[0]
        ? { fuente: { sitio: item.fuenteLetra[0].sitio, url: item.fuenteLetra[0].url, fichas: item.fuenteLetra.map((f) => f.ficha) } }
        : {}),
      banco: { contrato: 'CTR-04', version: 2 },
    })),
  );
  pie.append(zocalo);

  const total = aciertosHastaAca();
  if (acerto && sumaEl) {
    // Lo que sumaste vuela del sello de la ficha a la cuenta de la cabecera, que sube al llegar.
    const cual = indice;
    const destino = llevasEl;
    contar(destino, total - 1, total - 1, PARTIDA.llevas);
    window.setTimeout(
      () => {
        if (indice !== cual || !destino.isConnected) return;
        volar(PARTIDA.suma, 'suma-vuela', sumaEl, destino, () => {
          if (indice !== cual || !destino.isConnected) return;
          contar(destino, total - 1, total, PARTIDA.llevas);
          estampar(destino);
        });
      },
      duracionDe('--duracion-umbral') + duracionDe('--escalon-pasada'),
    );
  }

  // El foco va a "Seguí" sin arrastrar la vista. El anillo se dibuja si se llegó con el
  // teclado y no si se llegó con el dedo (la misma regla de los juegos de sacar temas).
  if (conPuntero) {
    seguir.classList.add('seguir--sin-anillo');
    seguir.addEventListener('blur', () => seguir.classList.remove('seguir--sin-anillo'), { once: true });
  }
  seguir.focus({ preventScroll: true });
  // Hasta el zócalo: así "Seguí" queda entero a la vista y no cortado por el borde.
  zocalo.scrollIntoView({ block: 'nearest' });
}

/**
 * El pase: **el rodillo tapa la pintada vieja** y, en cuanto la tapó, el verso nuevo aparece
 * detrás del mismo rodillo, que se va. Un sub-paso cada mitad, sin pantalla vacía en el medio.
 * Con movimiento reducido el sub-paso vale cero y el verso nuevo aparece puesto.
 */
function avanzar(): void {
  sonarEfecto('tecla');
  const vieja = pintada;
  const ms = duracionDe('--duracion-umbral');
  if (ms > 0 && vieja?.isConnected) {
    window.scrollTo(0, 0);
    vieja.classList.remove('pintada--se-destapa');
    vieja.classList.add('pintada--se-tapa');
    window.setTimeout(pasarDeVerso, ms);
  } else {
    pasarDeVerso();
  }
}

function pasarDeVerso(): void {
  indice += 1;
  if (indice >= ronda.length) {
    pintarResultado();
    return;
  }
  pintarPregunta();
  estampar(cabecera.querySelector('.vuelta-casilla--actual'));
  window.scrollTo(0, 0);
}

/** La tarjeta de la vuelta, en el idioma de la pared. Nunca tira: si no se puede, `null`. */
async function dibujarLaTarjeta(aciertos: number): Promise<Blob | null> {
  try {
    return await dibujarMuro({
      juego: TARJETA.juego,
      tramo: TRAMOS[tramo(aciertos, ronda.length)],
      cuenta: RESULTADO.puntaje(aciertos, ronda.length),
      palabras: ronda.map((item, i) => ({
        era: item.hueco.respuesta,
        acerto: elegidas[i] === item.hueco.respuesta,
        puso: elegidas[i] ?? '',
      })),
      sitio: location.host + location.pathname,
    });
  } catch {
    // La tarjeta es el premio, no el camino.
    return null;
  }
}

function pintarResultado(): void {
  const aciertos = contarAciertos(ronda, elegidas);
  const total = ronda.length;
  const t = tramo(aciertos, total);
  const entera = total > 0 && aciertos === total;
  zonaResultado.replaceChildren();

  let orden = 0;
  const entra = <T extends HTMLElement>(pieza: T, clase = 'jugo-entra'): T => {
    pieza.classList.add(clase);
    pieza.style.setProperty('--orden', String(orden++));
    return pieza;
  };

  zonaResultado.append(entra(el('p', 'rotulo-desenlace', RESULTADO.titulo)));
  // La línea que canta, y al lado la cuenta: sube en escalones y apoya como un sello.
  const titulo = entra(el('h2', `tramo tramo--${t}`, TRAMOS[t]));
  zonaResultado.append(titulo);
  const cuenta = entra(el('div', 'cuenta-vuelta'));
  const puntaje = el('p', 'puntaje puntaje--sello');
  contar(puntaje, 0, aciertos, (n) => RESULTADO.puntaje(n, total));
  cuenta.append(puntaje);
  window.setTimeout(() => sonarEfecto('sello'), duracionDe('--duracion-cuenta'));
  if (entera) {
    // La hazaña: la vuelta entera. Doble filete en la cuenta, un segundo sello que grita, y
    // el golpe suena dos veces.
    puntaje.classList.add('puntaje--hazana');
    cuenta.append(el('p', 'hazana-sello', RESULTADO.hazana));
    window.setTimeout(() => sonarEfecto('sello'), duracionDe('--duracion-cuenta') + 160);
  }
  zonaResultado.append(cuenta);

  /*
   * El muro de la vuelta: la pared con las palabras de la noche pintadas. La que sacaste, con
   * su tilde; la que no, lo que pusiste tachado y debajo la que era (`UX-01`: nunca solo la
   * tinta). No muestra más letra que la que ya se vio: la palabra y el título del tema. Lo
   * pintado es dibujo; quien no ve escucha cada una dicha con palabras.
   */
  zonaResultado.append(entra(el('h3', 'resumen-titulo', RESULTADO.detalle)));
  const muroPared = entra(el('div', 'pared pared--vuelta'));
  muroPared.append(dibujo('span', 'pared-ladrillos'), dibujo('span', 'pared-cano'));
  const muroPintada = el('div', 'pintada');
  const muroPano = el('div', 'pintada-pano');
  const muro = el('ol', 'muro');
  ronda.forEach((item, i) => {
    const salio = elegidas[i] === item.hueco.respuesta;
    const puso = elegidas[i] ?? '';
    const li = entra(el('li', `muro-palabra muro-palabra--${salio ? 'ok' : 'no'}`), 'jugo-pega');
    const pintadaDeLaPalabra = dibujo('span', 'muro-pintada');
    if (salio) {
      const escrita = el('span', 'muro-escrita', item.hueco.respuesta);
      escrita.append(el('span', 'hueco-marca', '✔︎'));
      pintadaDeLaPalabra.append(escrita);
    } else {
      const { errada, palabra } = armarErrada(puso);
      palabra.append(el('span', 'hueco-tachon'));
      errada.append(el('span', 'hueco-marca', '✕︎'));
      const era = el('span', 'muro-era', item.hueco.respuesta);
      era.append(el('span', 'hueco-marca', '✔︎'));
      pintadaDeLaPalabra.append(errada, era);
    }
    li.append(
      pintadaDeLaPalabra,
      dibujo('span', 'muro-tema', item.tema.titulo),
      el(
        'span',
        'solo-lector',
        salio
          ? RESULTADO.salio(item.hueco.respuesta, item.tema.titulo)
          : RESULTADO.noSalio(item.hueco.respuesta, item.tema.titulo, puso),
      ),
    );
    muro.append(li);
  });
  muroPano.append(muro);
  muroPintada.append(dibujo('span', 'pintada-canto pintada-canto--arriba'), muroPano, dibujo('span', 'pintada-canto pintada-canto--abajo'));
  muroPared.append(muroPintada);
  zonaResultado.append(muroPared);

  /*
   * El pie del resultado (`.pie-resultado`): la misma pieza y el mismo orden que los otros
   * juegos pulidos — la tarjeta que asoma, "Compartí" (el primario, en la letra de la firma),
   * lo que compartir tenga para decir y la otra vuelta. El resultado viaja como desafío, forma
   * `marcador` (`ADR-02`), y con la tarjeta del muro si el teléfono la acepta.
   */
  const pieDelResultado = entra(el('div', 'pie-resultado'));
  const { boton: compartir, salida } = botonCompartir(RESULTADO, () => ({
    texto: RESULTADO.paraCompartir(aciertos, total),
    url: armarLink(location.origin + location.pathname, { forma: 'marcador', juego: JUEGO, puntaje: aciertos, total }),
    archivo: archivoDeLaTarjeta,
  }));

  // La tarjeta asoma: lo que vas a compartir se ve antes de tocar el botón. Se dibuja una vez.
  const asoma = dibujo('div', 'tarjeta-asoma');
  asoma.addEventListener('click', () => compartir.click());
  if (urlDeLaTarjeta) URL.revokeObjectURL(urlDeLaTarjeta);
  urlDeLaTarjeta = '';
  archivoDeLaTarjeta = null;
  const estaTarjeta = dibujarLaTarjeta(aciertos);
  tarjetaDeLaVuelta = estaTarjeta;
  void estaTarjeta.then((imagen) => {
    if (tarjetaDeLaVuelta !== estaTarjeta || !asoma.isConnected) return;
    if (!imagen) {
      asoma.remove();
      return;
    }
    archivoDeLaTarjeta = new File([imagen], nombreArchivo('completar-la-letra'), { type: 'image/png' });
    urlDeLaTarjeta = URL.createObjectURL(imagen);
    const foto = el('img', 'jugo-pega');
    foto.alt = '';
    foto.src = urlDeLaTarjeta;
    asoma.append(foto);
  });

  const denuevo = el('button', 'secundario', RESULTADO.denuevo);
  denuevo.type = 'button';
  denuevo.addEventListener('click', () => {
    sonarEfecto('clac');
    comenzar();
  });
  pieDelResultado.append(asoma, compartir, salida, denuevo);
  zonaResultado.append(pieDelResultado);

  /*
   * Las salidas (`.salida-resultado`, la pieza compartida): la vuelta al fichín y, al lado, el
   * cancionero —el que jugó ya está pensando en el tema—. Las dos son la cinta de papel del
   * sitio, con su flecha; el pie queda con tres piezas, como en los otros juegos pulidos.
   */
  const salidas = el('p', 'salida-resultado salida-resultado--doble');
  const volver = el('a', 'volver', `← ${RESULTADO.volver}`);
  volver.href = '/';
  const alCancionero = el('a', 'volver', `${RESULTADO.alCancionero} →`);
  alCancionero.href = '/letras-y-acordes/';
  salidas.append(volver, alCancionero);
  zonaResultado.append(salidas);

  mostrar(zonaResultado);
  window.scrollTo(0, 0);
  titulo.tabIndex = -1;
  titulo.focus({ preventScroll: true });
}
