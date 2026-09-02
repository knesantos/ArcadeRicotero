/**
 * La isla de "adivinar la tapa" (`US-04`).
 *
 * Calca la mecánica de `partida.ts` —tres pantallas, cuatro opciones, feedback con
 * símbolo además de color— y cambia lo único que cambia: la pregunta es una imagen.
 *
 * **Regla que atraviesa el archivo, igual que en el quiz: nada se escribe con
 * `innerHTML`.** Todo se arma con `createElement` y `textContent`.
 *
 * **El crédito se pinta junto a la imagen, siempre** (`D-21`). No es un adorno legal
 * puesto al final: es la condición con la que la tapa real puede estar en pantalla.
 */

import { armarRonda, contarAciertos } from '../lib/quiz/ronda.ts';
import type { Item } from '../lib/tapa/banco.ts';
import { PARTIDA, RESULTADO } from '../lib/tapa/copy.ts';
import { estampaDe, slugDeRecorte } from '../lib/tapa/pasadas.ts';

const LARGO_RONDA = 6; // US-04: banco chico, ronda mas corta que la del quiz

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const portada = $('portada');
const zonaPartida = $('partida');
const zonaResultado = $('resultado');

const banco: Item[] = JSON.parse($('banco').textContent ?? '[]');

let ronda: readonly Item[] = [];
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

$('jugar').addEventListener('click', comenzar);

function comenzar(): void {
  const largo = Math.min(LARGO_RONDA, banco.length);
  ronda = armarRonda(banco, largo);
  indice = 0;
  elegidas = [];
  mostrar(zonaPartida);
  pintarPregunta();
}

function pintarPregunta(): void {
  const item = ronda[indice]!;
  zonaPartida.replaceChildren();

  const cab = el('div', 'cabecera');
  cab.append(el('p', 'micro', PARTIDA.progreso(indice + 1, ronda.length)));
  zonaPartida.append(cab);

  // La imagen es la pregunta. El alt NO nombra el disco: nombrarlo seria regalar la
  // respuesta a quien usa lector de pantalla y a quien mire el HTML.
  const figura = el('figure', 'figura-tapa-juego');
  const img = el('img', 'tapa-juego');
  img.src = item.imagen.ruta;
  img.alt = PARTIDA.altImagen;
  img.loading = 'eager';
  figura.append(img);
  figura.append(el('figcaption', 'credito-tapa', PARTIDA.credito(item.imagen.credito.autor)));
  zonaPartida.append(figura);

  zonaPartida.append(
    el('h2', 'enunciado', item.imagen.encuadre === 'detalle' ? PARTIDA.preguntaDetalle : PARTIDA.pregunta),
  );

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
  const correcta = item.opciones.find((o) => o.correcta)!;
  const acerto = texto === correcta.texto;

  // Se marcan todas y se apagan: la ronda no admite cambiar de opinion.
  for (const b of zonaPartida.querySelectorAll<HTMLButtonElement>('.opcion')) {
    b.disabled = true;
    if (b.textContent === correcta.texto) b.classList.add('es-correcta');
    if (b.textContent === texto && !acerto) b.classList.add('es-elegida');
  }

  // El zoom se abre (`UX-22` §11, `T-206`): la pieza que `UX-13` §4 dejo escrita como
  // pendiente. Va antes del panel porque el panel se agrega despues de la figura y el
  // orden de la pantalla no cambia: imagen, enunciado, opciones, feedback.
  const seImprimio = abrirElRecorte(item, correcta.texto, acerto);

  const panel = el('div', `feedback ${acerto ? 'ok' : 'no'}`);
  // Al fallar, la tapa llega en una sola tinta, y la linea lo dice con las mismas
  // palabras que "Adivina el tema" (`CNT-14` §3). Si el disco no tiene estampa, no hay
  // tinta de la que hablar y la frase queda como estaba.
  const linea = acerto
    ? PARTIDA.ok
    : `${PARTIDA.no} ${PARTIDA.eraLa} ${correcta.texto}${seImprimio ? `, ${PARTIDA.enClave}` : '.'}`;
  panel.append(el('p', 'micro', linea));

  // La edicion se cuenta recien acá: antes de responder es una pista de mas.
  panel.append(el('p', 'edicion-tapa', PARTIDA.edicion(item.imagen.edicion)));

  if (item.explicacion) panel.append(el('p', 'explicacion', item.explicacion));

  if (item.rotulo) {
    const insignia = el(
      'p',
      `sello sello--${item.rotulo.tipo}`,
      `${item.rotulo.tipo === 'leyenda' ? '◆' : '❝'} ${item.rotulo.texto}`,
    );
    panel.append(insignia);
  }

  const seguir = el('button', 'primario', PARTIDA.seguir);
  seguir.type = 'button';
  seguir.addEventListener('click', avanzar, { once: true });
  panel.append(seguir);

  zonaPartida.append(panel);
  /*
   * El foco va al boton de seguir, como siempre, pero SIN que el navegador se lleve la
   * pantalla hasta el (`preventScroll`), y la vista se va a la figura. Es la misma
   * correccion que `partida-tema.ts` hizo con la estampa, por el mismo motivo: enfocar el
   * boton dejaba el premio afuera de la vista, y aca el premio es la tapa que se termina
   * de imprimir. El boton queda abajo, ya enfocado —quien juega con teclado aprieta Enter
   * sin moverse— y a un pulgar de distancia para el resto. Sin `smooth`: un
   * desplazamiento animado seria movimiento que el corte de movimiento reducido no apaga.
   *
   * Si no hubo estampa que imprimir, no hay premio arriba y el boton se lleva la vista
   * como toda la vida.
   */
  if (seImprimio) {
    seguir.focus({ preventScroll: true });
    zonaPartida.querySelector('.figura-tapa-juego')?.scrollIntoView({ block: 'start' });
  } else {
    seguir.focus();
  }
}

/**
 * El zoom se abre (`UX-22` §11, `T-206`).
 *
 * Se jugo mirando un recorte de la tapa —uno de los diez encuadres de `UX-13` §3— y al
 * responder deja de haber zoom: la tapa entera se imprime a su tamano de ficha real, por
 * las mismas pasadas del reveal de "Adivina el tema" (clara, media, clave, el fijado de
 * la foto). No es un mecanismo nuevo: es el del `§2`, con las mismas clases, los mismos
 * tokens y el mismo techo de tiempo. Al fallar, la clave sola: la tapa de un item que no
 * se acerto no se completa nunca.
 *
 * **La asimetria del recorte, dicha en voz alta.** Al acertar, el recorte con el que se
 * jugo queda de capa de abajo: las tintas llegan encima y la foto lo tapa entero al
 * fijarse, asi que se ve literalmente como el pedazo que mirabas se abre al resto. Al
 * fallar no queda: la clave sola sobre un recorte ampliado del mismo dibujo serian dos
 * versiones desalineadas de la misma tapa, que no es registro imperfecto sino ruido. Sin
 * la tapa completa no hay nada que abrir, y lo que queda es lo mismo que en el otro
 * juego: una tinta sobre el papel.
 *
 * La `<figure>` y su `figcaption.credito-tapa` no se tocan (`D-21`, condicion 1): el
 * credito ya estaba pegado a la imagen y sigue estando pegado a la que la reemplaza.
 *
 * Devuelve si de verdad se imprimio algo: un disco fuera de los diez no tiene estampa y
 * la pantalla queda como era, sin hueco (`ADR-05.5`).
 */
function abrirElRecorte(item: Item, disco: string, acerto: boolean): boolean {
  const figura = zonaPartida.querySelector<HTMLElement>('.figura-tapa-juego');
  const recorte = figura?.querySelector<HTMLImageElement>('.tapa-juego');
  const slug = slugDeRecorte(item.imagen.ruta);
  const e = slug ? estampaDe(slug) : null;
  if (!figura || !recorte || !e) return false;

  figura.classList.add('figura-tapa-juego--abierta');

  // El papel se mete en el lugar del recorte y se lo lleva adentro: asi la caja de la
  // figura no salta de tamano al reemplazar una imagen por otra.
  const papel = el('span', 'estampa-papel estampa-papel--abre');
  recorte.replaceWith(papel);
  if (acerto) {
    papel.append(recorte);
    // Deja de ser lo que se lee: arriba llega la tapa entera, que es la que habla.
    recorte.alt = '';
  }

  const capas: Array<[nombre: string, ruta: string]> = acerto
    ? [['clara', e.pasadas[0]], ['media', e.pasadas[1]], ['clave', e.pasadas[2]]]
    : [['clave', e.pasadas[2]]];
  for (const [nombre, ruta] of capas) {
    const tinta = el('img', `pasada pasada--${nombre}`);
    tinta.src = ruta;
    tinta.decoding = 'async';
    tinta.alt = acerto ? '' : PARTIDA.altTapaClave(disco);
    papel.append(tinta);
  }

  if (acerto) {
    const foto = el('img', 'estampa-foto');
    foto.src = e.ficha;
    foto.decoding = 'async';
    foto.alt = PARTIDA.altTapaEntera(disco);
    papel.append(foto);
  }

  return true;
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

  const volver = el('a', 'accion-abajo', RESULTADO.volver);
  volver.href = '/';
  zonaResultado.append(volver);

  mostrar(zonaResultado);
}
