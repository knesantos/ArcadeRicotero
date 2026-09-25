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
 */

import { armarRonda, contarAciertos } from '../lib/quiz/ronda.ts';
import { botonCorreccion } from './correccion.ts';
import type { Item, Opcion } from '../lib/letra/banco.ts';
import { PARTIDA, RESULTADO } from '../lib/letra/copy.ts';
import { tituloDelDisco } from '../lib/letra/discos.ts';

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

$('jugar')?.addEventListener('click', comenzar);

function comenzar(): void {
  ronda = armarRonda(banco, Math.min(LARGO_RONDA, banco.length));
  indice = 0;
  elegidas = [];
  mostrar(zonaPartida);
  pintarPregunta();
}

/**
 * El verso con el hueco.
 *
 * `relleno` es lo que va en el lugar de la respuesta: la raya mientras no contestó, y la
 * palabra correcta después. Se pasa como nodo aparte para no concatenar el verso.
 */
function pintarVerso(relleno: HTMLElement, item: ItemJugable): HTMLElement {
  const linea = el('p', 'verso-hueco');
  if (item.hueco.antes) linea.append(document.createTextNode(item.hueco.antes + ' '));
  linea.append(relleno);
  if (item.hueco.despues) linea.append(document.createTextNode(' ' + item.hueco.despues));
  return linea;
}

function pintarPregunta(): void {
  const item = ronda[indice]!;
  zonaPartida.replaceChildren();

  const cab = el('div', 'cabecera');
  cab.append(el('p', 'micro', PARTIDA.progreso(indice + 1, ronda.length)));
  zonaPartida.append(cab);

  // BR-03: en dificil no se nombra ni el tema ni el disco. La pista de mas es justamente
  // lo que separa un nivel del otro, asi que se respeta acá y no en el generador.
  if (item.dificultad !== 'dificil') {
    const disco = tituloDelDisco(item.tema.disco);
    cab.append(
      el(
        'p',
        'micro tenue',
        item.dificultad === 'facil'
          ? PARTIDA.deQueDisco(item.tema.titulo, disco)
          : PARTIDA.deQueTema(item.tema.titulo),
      ),
    );
  }

  zonaPartida.append(el('h2', 'enunciado', PARTIDA.pregunta));

  const bloque = el('div', 'verso-bloque');
  for (const verso of item.contexto.antes) bloque.append(el('p', 'verso-contexto', verso));
  bloque.append(pintarVerso(el('span', 'hueco', PARTIDA.hueco), item));
  for (const verso of item.contexto.despues) bloque.append(el('p', 'verso-contexto', verso));
  zonaPartida.append(bloque);

  const lista = el('ul', 'opciones');
  for (const op of item.opciones) {
    const li = el('li');
    const b = el('button', 'opcion', op.texto);
    b.type = 'button';
    b.addEventListener('click', () => responder(op.texto), { once: true });
    li.append(b);
    lista.append(li);
  }
  zonaPartida.append(lista);
}

function responder(texto: string): void {
  const item = ronda[indice]!;
  elegidas[indice] = texto;
  const acerto = texto === item.hueco.respuesta;

  for (const b of zonaPartida.querySelectorAll<HTMLButtonElement>('.opcion')) {
    b.disabled = true;
    if (b.textContent === item.hueco.respuesta) b.classList.add('es-correcta');
    if (b.textContent === texto && !acerto) b.classList.add('es-elegida');
  }

  // El verso se vuelve a pintar con la palabra en su lugar: es la recompensa de haber
  // contestado, y se ve completo recién ahora.
  const bloque = zonaPartida.querySelector('.verso-bloque');
  const resuelto = pintarVerso(el('span', 'hueco resuelto', item.hueco.respuesta), item);
  bloque?.replaceChild(resuelto, bloque.querySelector('.verso-hueco')!);

  const panel = el('div', `feedback ${acerto ? 'ok' : 'no'}`);
  panel.append(
    el('p', 'micro', acerto ? PARTIDA.ok : `${PARTIDA.no} ${PARTIDA.eraLa} "${item.hueco.respuesta}".`),
  );
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

  // T-145 / D-25: la fuente del verso, con su enlace, en el mismo panel que la
  // respuesta. Bajo fuente unica el jugador tiene derecho a saber de donde salio lo que
  // el juego acaba de darle por bueno — y si esta mal, a que el error tenga direccion.
  const fuente = item.fuenteLetra?.[0];
  if (fuente) {
    const linea = el('p', 'fuente-verso');
    const enlace = el('a', 'fuente-verso-enlace', PARTIDA.fuenteDe(fuente.sitio));
    enlace.href = fuente.url;
    enlace.target = '_blank';
    enlace.rel = 'noopener';
    linea.append(enlace);
    panel.append(linea);
  }

  // `BR-21` / `D-25`: el boton de correccion, en el panel donde la persona acaba de ver
  // el dato. Va antes de `Seguí` y como texto chico: es un control secundario que no
  // puede competir con el que manda el avance.
  const correccion = botonCorreccion(() => ({
      juego: 'letra',
      itemId: item.id,
      ubicacion: 'el hueco',
      dice: `${item.hueco.antes}[${item.hueco.respuesta}]${item.hueco.despues}`,
      ...(item.fuenteLetra?.[0]
        ? { fuente: { sitio: item.fuenteLetra[0].sitio, url: item.fuenteLetra[0].url, fichas: item.fuenteLetra.map((f) => f.ficha) } }
        : {}),
      banco: { contrato: 'CTR-04', version: 2 },
  }));

  const seguir = el('button', 'primario', PARTIDA.seguir);
  seguir.type = 'button';
  seguir.addEventListener('click', avanzar, { once: true });
  panel.append(seguir);
  // `UX-09`: despues de `Seguí`, y **afuera** del panel de respuesta. Ese panel se lee
  // solo; meterle un control adentro haria que el lector anuncie "Corregí esto, boton"
  // mezclado con el resultado.
  zonaPartida.append(panel);
  // Va **despues** del panel en el orden del DOM, que es el orden en que se lee y se
  // tabula: `UX-09` lo quiere despues de `Seguí`, no antes del resultado.
  zonaPartida.append(correccion);
  seguir.focus();
}

function avanzar(): void {
  indice += 1;
  if (indice >= ronda.length) {
    pintarResultado();
    return;
  }
  pintarPregunta();
}

function pintarResultado(): void {
  const aciertos = contarAciertos(ronda, elegidas);
  zonaResultado.replaceChildren();
  zonaResultado.append(el('h2', undefined, RESULTADO.titulo));
  zonaResultado.append(el('p', 'puntaje', RESULTADO.puntaje(aciertos, ronda.length)));

  const denuevo = el('button', 'primario', RESULTADO.denuevo);
  denuevo.type = 'button';
  denuevo.addEventListener('click', comenzar);
  zonaResultado.append(denuevo);

  // El que jugó ya está pensando en el tema: el cancionero es el paso natural.
  const alCancionero = el('a', 'accion-abajo', RESULTADO.alCancionero);
  alCancionero.href = '/letras-y-acordes/';
  zonaResultado.append(alCancionero);

  const volver = el('a', 'accion-abajo', RESULTADO.volver);
  volver.href = '/';
  zonaResultado.append(volver);

  mostrar(zonaResultado);
}
