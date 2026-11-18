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
 * opciones son **plantillas de cartón caladas**. La que elegís va hasta el hueco, se apoya, y
 * al levantarse deja la palabra pintada, que chorrea. Si no era, queda tachada con aerosol y
 * al lado se pinta la que era. Después cae el sello sobre la pared y recién ahí llega la ficha
 * (el cierre en dos tiempos de los otros juegos pulidos). Al seguir, el rodillo tapa la pintada
 * vieja y destapa la nueva.
 *
 * **La cantidad de letra a la vista no cambió**: son los mismos versos de contexto por nivel
 * (`BR-03`) y el mismo hueco. Cambió dónde están escritos.
 *
 * Ningún estado depende del movimiento ni del color: lo errado lleva su cruz y su tachón, lo
 * acertado su tilde, y la ficha lo dice con palabras. Con movimiento reducido todo aparece en
 * su estado final (los tiempos salen de tokens que el corte lleva a cero).
 */

import { armarRonda, contarAciertos } from '../lib/quiz/ronda.ts';
import { botonCorreccion } from './correccion.ts';
import type { Item, Opcion } from '../lib/letra/banco.ts';
import { PANTALLA_0, PARTIDA, RESULTADO } from '../lib/letra/copy.ts';
import { armarLink, leerDesafio } from '../lib/desafio.ts';
import { botonCompartir } from './compartir.ts';
import { tituloDelDisco } from '../lib/letra/discos.ts';
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

/** Las piezas de la pantalla en curso. Se rehacen en cada verso. */
let cabecera: HTMLElement;
let llevasEl: HTMLElement;
let rachaEl: HTMLElement;
let pintada: HTMLElement;
let pano: HTMLElement;
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

$('jugar')?.addEventListener('click', () => {
  // Este toque es el gesto que los celulares piden para dejar sonar algo: se despierta la
  // salida acá, y los ruidos de la partida (la tecla, el golpe, el sello) ya pueden salir.
  void despertarSalida().then(() => sonarEfecto('clac'));
  comenzar();
});

function comenzar(): void {
  ronda = armarRonda(banco, Math.min(LARGO_RONDA, banco.length));
  indice = 0;
  elegidas = [];
  racha = 0;
  mostrar(zonaPartida);
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
 * La pantalla de un verso. `destapa` es si llega detrás del rodillo (al pasar de un verso al
 * otro y al arrancar): el paño nace tapado y el rodillo se va, dejando la pintada a la vista.
 */
function pintarPregunta(destapa = true): void {
  const item = ronda[indice]!;
  zonaPartida.replaceChildren();
  zonaPartida.classList.remove('partida--revelada');

  cabecera = armarCabecera();
  zonaPartida.append(cabecera);

  /*
   * La pared: la banda del medio, de ladrillo a la vista, de borde a borde. Es fondo y no
   * lleva texto encima: lo que se lee va sobre el paño pintado (`--fondo`, el par medido) o
   * sobre el papel del afiche.
   */
  const pared = el('div', 'pared');
  pared.append(dibujo('span', 'pared-ladrillos'));

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

  pared.append(el('h2', 'enunciado pared-pregunta', PARTIDA.pregunta));

  /*
   * La pintada: el paño donde el revoque aguantó, con su canto roto arriba y abajo. Adentro,
   * los versos; el del hueco es el que grita. El rodillo es la pieza que tapa y destapa al
   * pasar de un verso a otro.
   */
  pintada = el('div', 'verso-bloque pintada');
  pano = el('div', 'pintada-pano');
  for (const verso of item.contexto.antes) pano.append(el('p', 'verso-contexto', verso));
  pano.append(pintarVerso(armarHueco(), item));
  for (const verso of item.contexto.despues) pano.append(el('p', 'verso-contexto', verso));
  pano.append(dibujo('span', 'pintada-rodillo'));
  pintada.append(dibujo('span', 'pintada-canto pintada-canto--arriba'), pano, dibujo('span', 'pintada-canto pintada-canto--abajo'));
  if (destapa) pintada.classList.add('pintada--se-destapa');
  pared.append(pintada);
  zonaPartida.append(pared);

  // Las plantillas: cuatro cartones calados, cada uno con su palabra. Se apoyan de a uno.
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
  zonaPartida.append(lista);
}

/**
 * La plantilla va hasta el hueco, se apoya y vuelve. `alApoyar` corre con la plantilla puesta
 * encima: es cuando se pinta. Con movimiento reducido (o sin `animate`) no hay viaje y se
 * pinta en el acto. Solo se anima `transform`.
 */
function llevarPlantilla(boton: HTMLElement, hueco: Element, alApoyar: () => void, alVolver: () => void): void {
  const ms = duracionDe('--duracion-umbral') * 2.2;
  const desde = boton.getBoundingClientRect();
  const hasta = hueco.getBoundingClientRect();
  if (ms <= 0 || typeof boton.animate !== 'function' || desde.width === 0 || hasta.width === 0) {
    alApoyar();
    alVolver();
    return;
  }
  const escala = Math.max(0.6, Math.min(1, (hasta.width + 52) / desde.width));
  const dx = hasta.left + hasta.width / 2 - (desde.left + desde.width / 2);
  const dy = hasta.top + hasta.height / 2 - (desde.top + desde.height / 2);
  const puesta = `translate(${Math.round(dx)}px, ${Math.round(dy)}px) scale(${escala.toFixed(3)}) rotate(-2deg)`;
  const curva = getComputedStyle(document.documentElement).getPropertyValue('--curva-cinta').trim() || 'linear';
  // Una pieza lleva una sola animación: la de apoyarse al entrar ya terminó o se corta acá.
  boton.classList.remove('jugo-pega');
  boton.classList.add('plantilla--vuela');
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
}

/** Una palabra recién pintada chorrea: dos gotas que bajan del pie de la letra y se quedan. */
function chorrear(palabra: HTMLElement, semilla: number): void {
  const gotas: readonly (readonly [number, number])[] = [
    [18 + ((semilla * 37) % 22), 9 + ((semilla * 13) % 8)],
    [58 + ((semilla * 53) % 26), 5 + ((semilla * 29) % 7)],
  ];
  gotas.forEach(([x, largo], i) => {
    const gota = dibujo('span', 'chorreada');
    gota.style.setProperty('--x', `${x}%`);
    gota.style.setProperty('--largo', `${largo}px`);
    gota.style.setProperty('--orden', String(i));
    palabra.append(gota);
  });
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
   * contestado, y se ve completo recién ahora. Si no era, lo elegido queda tachado al lado
   * —con su cruz, no solo en rojo— y la que era se pinta después del tachón.
   *
   * **El hueco toma el ancho de lo elegido en el momento del toque** (`.hueco--por-pintar`:
   * sigue siendo hueco, sin letra a la vista), y la plantilla viaja hasta ahí. Si se midiera el
   * hueco genérico, una palabra más ancha partiría el renglón al pintarse y aparecería lejos de
   * donde se apoyó la plantilla.
   */
  const correcta = el('span', 'hueco resuelto', item.hueco.respuesta);
  const vestir = (palabra: HTMLElement, marca: string, semilla: number): HTMLElement => {
    const m = dibujo('span', 'hueco-marca', marca);
    chorrear(palabra, semilla);
    return m;
  };
  const errada = dibujo('span', 'hueco-errada');
  const palabraErrada = el('span', 'hueco-errada-palabra', texto);
  const porPintar = acerto ? correcta : palabraErrada;
  porPintar.classList.add('hueco--por-pintar');
  if (acerto) {
    linea.replaceWith(pintarVerso(correcta, item));
  } else {
    errada.append(palabraErrada);
    linea.replaceWith(pintarVerso(errada, item));
  }

  const pintar = (): void => {
    if (!vigente()) return;
    porPintar.classList.remove('hueco--por-pintar');
    if (acerto) {
      correcta.append(vestir(correcta, '✔︎', item.hueco.respuesta.length));
      estampar(correcta);
      sonarEfecto('sello');
      vibrarAcierto();
    } else {
      palabraErrada.append(el('span', 'hueco-tachon'));
      errada.append(vestir(palabraErrada, '✕︎', texto.length + 3));
      // La que era llega un golpe después: primero se ve lo que pusiste, tachado.
      correcta.classList.add('resuelto--despues');
      correcta.append(vestir(correcta, '✔︎', item.hueco.respuesta.length));
      errada.after(document.createTextNode(' '), correcta);
      golpear(pano);
      sonarEfecto('golpe');
    }
  };

  const cerrar = (): void => {
    if (!vigente()) return;
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
    // El primer tiempo del cierre: el sello cae sobre la pared, en la esquina del paño.
    pintada.append(dibujo('span', `sello-cae sello-cae--${acerto ? 'ok' : 'no'}`, acerto ? '✔︎' : '✕︎'));
    const espera = duracionDe('--duracion-pasada') + duracionDe('--duracion-paso');
    const mostrarLaFicha = (): void => {
      if (vigente()) pintarFicha(item, texto, acerto);
    };
    if (espera > 0) window.setTimeout(mostrarLaFicha, espera);
    else mostrarLaFicha();
  };

  llevarPlantilla(boton, porPintar, pintar, cerrar);
}

/**
 * El segundo tiempo del cierre: las plantillas se van y en su lugar queda la ficha del verso,
 * con la gramática de los otros juegos pulidos —el grito estampado y lo que sumaste, de qué
 * tema era, y "Seguí" adentro, cerrando la columna—. Debajo, en un renglón de registro 3, de
 * dónde salió la letra y la puerta para corregirla.
 */
function pintarFicha(item: ItemJugable, texto: string, acerto: boolean): void {
  zonaPartida.classList.add('partida--revelada');
  pintada.querySelector('.sello-cae')?.remove();
  lista.hidden = true;

  const panel = el('div', `feedback revelacion ficha-verso ${acerto ? 'ok' : 'no'}`);
  panel.setAttribute('role', 'status');
  const cabeza = el('div', 'revelacion-cabeza');
  cabeza.append(el('p', 'micro', acerto ? PARTIDA.ok : PARTIDA.no));
  const sumaEl = acerto ? dibujo('span', 'revelacion-suma', PARTIDA.suma) : null;
  if (sumaEl) cabeza.append(sumaEl);
  panel.append(cabeza);
  if (!acerto) panel.append(el('p', 'respuesta-dato', `${PARTIDA.eraLa} “${item.hueco.respuesta}”.`));

  // De qué tema era, **solo si la pared no lo dijo**: en difícil no hay afiche (`BR-03` lo
  // esconde mientras se juega), y con el verso ya contestado dejó de ser una pista y pasó a
  // ser el dato que te llevás. En los otros dos niveles el afiche sigue a la vista.
  if (item.dificultad === 'dificil') {
    const tema = el('p', 'ficha-verso-tema');
    tema.append(
      el('span', 'ficha-verso-titulo', item.tema.titulo),
      el('span', 'ficha-verso-disco', tituloDelDisco(item.tema.disco)),
    );
    panel.append(tema);
  }

  if (item.explicacion) panel.append(el('p', 'explicacion', item.explicacion));

  if (item.rotulo) {
    panel.append(
      el(
        'p',
        `sello sello--${item.rotulo.tipo}`,
        `${item.rotulo.tipo === 'leyenda' ? '◆' : '❝'} ${item.rotulo.texto}`,
      ),
    );
  }

  const ultimo = indice + 1 >= ronda.length;
  const seguir = el('button', 'primario seguir', ultimo ? PARTIDA.ultimo : PARTIDA.seguir);
  seguir.type = 'button';
  seguir.addEventListener('click', avanzar, { once: true });
  panel.append(seguir);
  zonaPartida.append(panel);

  /*
   * El pie de la ficha (`UX-09`): **afuera** del panel de respuesta —ese panel se lee solo— y
   * después de `Seguí` en el orden del DOM, que es el orden en que se lee y se tabula.
   *
   * `T-145` / `D-25`: la fuente del verso, con su enlace. Bajo fuente única el jugador tiene
   * derecho a saber de dónde salió lo que el juego acaba de darle por bueno. `BR-21`: y el
   * botón de corrección al lado, como control secundario.
   */
  const pie = el('div', 'ficha-pie');
  const fuente = item.fuenteLetra?.[0];
  if (fuente) {
    const linea = el('p', 'fuente-verso');
    const enlace = el('a', 'fuente-verso-enlace', PARTIDA.fuenteDe(fuente.sitio));
    enlace.href = fuente.url;
    enlace.target = '_blank';
    enlace.rel = 'noopener';
    linea.append(enlace);
    pie.append(linea);
  }
  pie.append(
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
  zonaPartida.append(pie);

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
      duracionDe('--duracion-pasada') + duracionDe('--escalon-pasada'),
    );
  }

  // El foco va a "Seguí" sin arrastrar la vista. El anillo se dibuja si se llegó con el
  // teclado y no si se llegó con el dedo (la misma regla de los juegos de sacar temas).
  if (conPuntero) {
    seguir.classList.add('seguir--sin-anillo');
    seguir.addEventListener('blur', () => seguir.classList.remove('seguir--sin-anillo'), { once: true });
  }
  seguir.focus({ preventScroll: true });
  seguir.scrollIntoView({ block: 'nearest' });
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

function pintarResultado(): void {
  const aciertos = contarAciertos(ronda, elegidas);
  const total = ronda.length;
  zonaResultado.replaceChildren();

  let orden = 0;
  const entra = <T extends HTMLElement>(pieza: T, clase = 'jugo-entra'): T => {
    pieza.classList.add(clase);
    pieza.style.setProperty('--orden', String(orden++));
    return pieza;
  };

  const titulo = entra(el('h2', 'rotulo-desenlace', RESULTADO.titulo));
  zonaResultado.append(titulo);
  // La cifra de la vuelta: sube en escalones y apoya como un sello.
  const puntaje = entra(el('p', 'puntaje puntaje--sello'));
  contar(puntaje, 0, aciertos, (n) => RESULTADO.puntaje(n, total));
  zonaResultado.append(puntaje);
  window.setTimeout(() => sonarEfecto('sello'), duracionDe('--duracion-cuenta'));

  /*
   * La pared de la vuelta: una pintada por verso, con la palabra que era. La que sacaste
   * lleva la tilde; la que no, la cruz y lo que habías puesto, escrito (`UX-01`: nunca solo
   * la tinta). No muestra más letra que la que ya se vio: la palabra y el título del tema.
   */
  zonaResultado.append(entra(el('h3', 'resumen-titulo', RESULTADO.detalle)));
  const detalle = el('ol', 'resumen resumen--pintadas');
  ronda.forEach((item, i) => {
    const salio = elegidas[i] === item.hueco.respuesta;
    const li = entra(el('li', `pintada-fila pintada-fila--${salio ? 'ok' : 'no'}`), 'jugo-pega');
    li.append(dibujo('span', 'pintada-fila-marca', salio ? '✔︎' : '✕︎'));
    const cuerpo = el('span', 'pintada-fila-cuerpo');
    cuerpo.append(
      el('span', 'pintada-fila-palabra', item.hueco.respuesta),
      el(
        'span',
        'pintada-fila-pie',
        salio ? item.tema.titulo : RESULTADO.pusiste(item.tema.titulo, elegidas[i] ?? ''),
      ),
    );
    li.append(cuerpo);
    detalle.append(li);
  });
  zonaResultado.append(detalle);

  /*
   * El pie del resultado (`.pie-resultado`): la misma pieza y el mismo orden que los otros
   * juegos pulidos — "Compartí" (el primario, en la letra de la firma), lo que compartir tenga
   * para decir y la otra vuelta. Este juego todavía no tiene tarjeta: comparte texto y enlace,
   * forma `marcador` (`ADR-02`).
   */
  const pie = entra(el('div', 'pie-resultado'));
  const { boton: compartir, salida } = botonCompartir(RESULTADO, () => ({
    texto: RESULTADO.paraCompartir(aciertos, total),
    url: armarLink(location.origin + location.pathname, { forma: 'marcador', juego: JUEGO, puntaje: aciertos, total }),
  }));
  const denuevo = el('button', 'secundario', RESULTADO.denuevo);
  denuevo.type = 'button';
  denuevo.addEventListener('click', () => {
    sonarEfecto('clac');
    comenzar();
  });
  // El que jugó ya está pensando en el tema: el cancionero es el paso natural.
  const alCancionero = el('a', 'secundario', RESULTADO.alCancionero);
  alCancionero.href = '/letras-y-acordes/';
  pie.append(compartir, salida, denuevo, alCancionero);
  zonaResultado.append(pie);

  const salidaAlFichin = el('p', 'salida-resultado');
  const volver = el('a', 'volver', `← ${RESULTADO.volver}`);
  volver.href = '/';
  salidaAlFichin.append(volver);
  zonaResultado.append(salidaAlFichin);

  mostrar(zonaResultado);
  window.scrollTo(0, 0);
  titulo.tabIndex = -1;
  titulo.focus({ preventScroll: true });
}
