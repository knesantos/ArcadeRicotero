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

  const panel = el('div', `feedback ${acerto ? 'ok' : 'no'}`);
  panel.append(el('p', 'micro', acerto ? PARTIDA.ok : `${PARTIDA.no} ${PARTIDA.eraLa} ${correcta.texto}.`));

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

  const volver = el('a', 'accion-abajo', RESULTADO.volver);
  volver.href = '/';
  zonaResultado.append(volver);

  mostrar(zonaResultado);
}
