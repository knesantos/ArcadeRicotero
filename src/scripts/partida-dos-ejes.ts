/**
 * La partida del test de dos ejes (`US-06`). Isla de `dos-ejes.astro`.
 *
 * **Lo que este archivo no hace, y es deliberado:** no cuenta nada en pantalla. No hay
 * puntaje, no hay aciertos, no hay barra de cuánto te inclinaste hacia un extremo. El
 * único número que se muestra es en qué pregunta va (`3 de 10`), que es orientación y no
 * medición.
 *
 * La regla está antes que la interfaz: `resolverCuadrante` devuelve tres campos de texto y
 * ninguno numérico (`CTR-08.6`), así que **el conteo por eje no llega hasta acá**. Si algún
 * día alguien quiere mostrar el "4 a 1", va a tener que cambiar el contrato primero — que
 * es exactamente la conversación que conviene tener antes y no después.
 */

import {
  sortearPartida,
  resolverCuadrante,
  type Banco,
  type ItemServido,
  type Polo,
} from '../lib/dos-ejes/partida.ts';
import { PARTIDA, RESULTADO } from '../lib/dos-ejes/copy.ts';

const $ = <T extends HTMLElement>(sel: string): T => document.querySelector<T>(sel)!;

const banco = JSON.parse($('#banco').textContent ?? '{}') as Banco;

const zonaInicio = $('#inicio');
const zonaPregunta = $('#pregunta');
const zonaResultado = $('#resultado');

let ronda: ItemServido[] = [];
let paso = 0;
const elegidos: Polo[] = [];

function el(tag: string, clase: string, texto?: string): HTMLElement {
  const n = document.createElement(tag);
  n.className = clase;
  if (texto !== undefined) n.textContent = texto;
  return n;
}

/**
 * El rombo de `UX-06` §4: el cuadrado girado 45°, con los cuatro extremos en las puntas.
 *
 * **Por qué rombo y no una grilla de dos por dos.** En una grilla, la fila de arriba se lee
 * como mejor que la de abajo — y este test no tiene resultados mejores que otros. En un
 * rombo los cuatro cuadrantes son caras equivalentes alrededor de un centro, y lo único
 * que queda verdaderamente arriba es una punta de eje, no un cuadrante.
 *
 * El punto va **centrado en su cara, nunca graduado**: mostrar cuánto se inclinó el
 * jugador sería el conteo por otra puerta.
 */
function plano(luzOscuridad: string, ordenCaos: string): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 240 240');
  svg.setAttribute('class', 'ejes-plano');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', RESULTADO.altPlano);

  const c = 120;
  const r = 84;
  const rombo = document.createElementNS(ns, 'polygon');
  rombo.setAttribute('points', `${c},${c - r} ${c + r},${c} ${c},${c + r} ${c - r},${c}`);
  rombo.setAttribute('class', 'ejes-rombo');
  svg.append(rombo);

  // Las dos diagonales: separan las cuatro caras sin darle color distinto a ninguna.
  for (const [x1, y1, x2, y2] of [
    [c, c - r, c, c + r],
    [c - r, c, c + r, c],
  ]) {
    const linea = document.createElementNS(ns, 'line');
    linea.setAttribute('x1', String(x1));
    linea.setAttribute('y1', String(y1));
    linea.setAttribute('x2', String(x2));
    linea.setAttribute('y2', String(y2));
    linea.setAttribute('class', 'ejes-diagonal');
    svg.append(linea);
  }

  // Norte, sur, oeste, este. Fuera del rombo, como rótulos.
  const puntas: [string, number, number, string][] = [
    [RESULTADO.ejes.luz, c, c - r - 10, 'middle'],
    [RESULTADO.ejes.oscuridad, c, c + r + 20, 'middle'],
    [RESULTADO.ejes.orden, c - r - 6, c + 4, 'end'],
    [RESULTADO.ejes.caos, c + r + 6, c + 4, 'start'],
  ];
  for (const [texto, x, y, anclaje] of puntas) {
    const t = document.createElementNS(ns, 'text');
    t.setAttribute('x', String(x));
    t.setAttribute('y', String(y));
    t.setAttribute('text-anchor', anclaje);
    t.setAttribute('class', 'ejes-punta');
    t.textContent = texto;
    svg.append(t);
  }

  // El centroide de la cara: a un tercio del radio en cada direccion.
  const punto = document.createElementNS(ns, 'circle');
  punto.setAttribute('cx', String(c + (ordenCaos === 'caos' ? r / 3 : -r / 3)));
  punto.setAttribute('cy', String(c + (luzOscuridad === 'luz' ? -r / 3 : r / 3)));
  punto.setAttribute('r', '8');
  punto.setAttribute('class', 'ejes-punto');
  svg.append(punto);

  return svg;
}

function pintarPregunta(): void {
  const item = ronda[paso]!;
  zonaPregunta.replaceChildren();

  zonaPregunta.append(el('p', 'ejes-progreso', PARTIDA.progreso(paso + 1, ronda.length)));
  zonaPregunta.append(el('h2', 'ejes-enunciado', item.enunciado));

  const opciones = el('div', 'ejes-opciones');
  for (const o of item.opciones) {
    const boton = el('button', 'primario ejes-opcion', o.texto) as HTMLButtonElement;
    boton.type = 'button';
    boton.addEventListener('click', () => {
      elegidos.push(o.polo);
      paso++;
      if (paso < ronda.length) pintarPregunta();
      else pintarResultado();
    });
    opciones.append(boton);
  }
  zonaPregunta.append(opciones);
}

function pintarResultado(): void {
  const r = resolverCuadrante(banco, elegidos);
  const cuadrante = banco.cuadrantes.find((c) => c.id === r.id)!;

  zonaPregunta.hidden = true;
  zonaResultado.hidden = false;
  zonaResultado.replaceChildren();

  zonaResultado.append(el('p', 'ejes-rotulo', RESULTADO.titulo));
  zonaResultado.append(el('h2', 'ejes-nombre', r.nombre));
  zonaResultado.append(plano(cuadrante.luzOscuridad, cuadrante.ordenCaos));
  zonaResultado.append(el('p', 'ejes-bajada', r.bajada));

  const acciones = el('div', 'ejes-acciones');
  const denuevo = el('button', 'primario', RESULTADO.denuevo) as HTMLButtonElement;
  denuevo.type = 'button';
  denuevo.addEventListener('click', empezar);
  acciones.append(denuevo);

  const volver = document.createElement('a');
  volver.className = 'secundario';
  volver.href = '/';
  volver.textContent = RESULTADO.volver;
  acciones.append(volver);

  zonaResultado.append(acciones);
}

function empezar(): void {
  ronda = sortearPartida(banco);
  paso = 0;
  elegidos.length = 0;
  zonaInicio.hidden = true;
  zonaResultado.hidden = true;
  zonaPregunta.hidden = false;
  pintarPregunta();
}

$('#empezar').addEventListener('click', empezar);
