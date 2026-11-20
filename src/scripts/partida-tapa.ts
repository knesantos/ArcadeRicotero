/**
 * La isla de "adivinar la tapa" (`US-04`).
 *
 * Calca la mecánica de `partida.ts` —tres pantallas, cuatro opciones, feedback con
 * símbolo además de color— y cambia lo único que cambia: la pregunta es una imagen.
 *
 * **El objeto es la mesa de serigrafía** (ronda de pulida, 2026-11-20). La acotación de la
 * portada ya lo decía: *"Tenés tinta fresca pegada en los dedos."* El recorte se mira adentro
 * de un bastidor; al responder **el zoom se abre** —el pedazo se achica hasta su lugar real en
 * la tapa— y la racleta pasa una vez por tinta: tres pasadas y el fijado si la tenías, una
 * sola tinta si no. La hoja impresa se cuelga a secar en la soga de la cabecera, que es el
 * riel de la partida y, al final, la tirada entera.
 *
 * **Regla que atraviesa el archivo, igual que en el quiz: nada se escribe con
 * `innerHTML`.** Todo se arma con `createElement` y `textContent`.
 *
 * **El crédito se pinta junto a la imagen, siempre** (`D-21`). No es un adorno legal
 * puesto al final: es la condición con la que la tapa real puede estar en pantalla.
 */

import { armarRonda, contarAciertos } from '../lib/quiz/ronda.ts';
import type { Item } from '../lib/tapa/banco.ts';
import { IMPRENTA, PANTALLA_0, PARTIDA, RESULTADO } from '../lib/tapa/copy.ts';
import { armarLink, leerDesafio } from '../lib/desafio.ts';
import { botonCompartir } from './compartir.ts';
import { botonCorreccion } from './correccion.ts';
import { estampaDe, slugDeRecorte, type Estampa } from '../lib/tapa/pasadas.ts';
import { recorteDe } from '../lib/tapa/recorte.ts';
import { nombreArchivo } from '../lib/tarjeta/plan.ts';
import { dibujarTirada } from './tarjeta-tirada.ts';
import { despertarSalida } from '../lib/audio/contexto.ts';
import { sonarEfecto } from '../lib/audio/efectos.ts';
import { golpear, estampar, pegar, volar, volarPieza, contar, duracionDe, armarInterruptorDeRuidos } from './jugo.ts';

const LARGO_RONDA = 6; // US-04: banco chico, ronda mas corta que la del quiz

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const portada = $('portada');
const zonaPartida = $('partida');
const zonaResultado = $('resultado');

const banco: Item[] = JSON.parse($('banco').textContent ?? '[]');

let ronda: readonly Item[] = [];
let indice = 0;
let elegidas: (string | null)[] = [];
/** Si lo último que se tocó fue con el dedo o el mouse: decide si el foco de "Seguí" dibuja anillo. */
let conPuntero = false;
/** La tarjeta de la vuelta: se dibuja una vez al llegar al resultado, y "Compartí" usa esa. */
let tarjetaDeLaVuelta: Promise<Blob | null> | null = null;
let archivoDeLaTarjeta: File | null = null;
let urlDeLaTarjeta = '';

/** Las piezas que son las mismas de una tapa a la otra: la cabecera con la soga, y la mesa. */
let tableroEl: HTMLElement;
let progresoEl: HTMLElement;
let sogaEl: HTMLElement;
let rachaEl: HTMLElement;
let llevasEl: HTMLElement;
let mesaEl: HTMLElement;
let bastidorEl: HTMLElement;
let carroEl: HTMLElement;
let tintasEl: HTMLElement;
let creditoEl: HTMLElement;
/** Las de la tapa en curso. */
let papelEl: HTMLElement;
let enunciadoEl: HTMLElement;
let listaEl: HTMLElement;

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

/** Lleva el foco a lo primero de la pantalla nueva, sin meterlo en el orden de tabulación. */
function enfocar(destino: HTMLElement): void {
  destino.tabIndex = -1;
  destino.focus({ preventScroll: true });
}

const correctaDe = (item: Item): string => item.opciones.find((o) => o.correcta)!.texto;
const estampaDelItem = (item: Item): Estampa | null => {
  const slug = slugDeRecorte(item.imagen.ruta);
  return slug ? estampaDe(slug) : null;
};
const acertada = (i: number): boolean => elegidas[i] === correctaDe(ronda[i]!);

/** Cuántas seguidas van, contando desde la última respondida para atrás. */
function racha(): number {
  let n = 0;
  for (let i = elegidas.length - 1; i >= 0 && acertada(i); i--) n += 1;
  return n;
}

/*
 * Si alguien llegó por un desafío, la bajada de la portada lo dice (`ADR-02`). El juego
 * va obligatorio (`FIND-28`): sin él, un enlace de otro juego pintaría acá un puntaje que
 * no es de este. `textContent` y jamás `innerHTML`: el nombre viene de la URL.
 */
const JUEGO = 'tapa';
{
  const desafio = leerDesafio(location.search, JUEGO);
  const bajada = document.getElementById('subtitulo');
  if (desafio && desafio.forma !== 'identidad' && bajada) {
    bajada.textContent = PANTALLA_0.desafio(desafio.puntaje, desafio.total, desafio.nombre);
  }
}

// El interruptor de los ruidos, debajo del botón (como en los otros juegos).
document
  .getElementById('ruidos')
  ?.append(armarInterruptorDeRuidos({ apagar: IMPRENTA.ruidosApagar, prender: IMPRENTA.ruidosPrender }));

/* ---- La portada: la mesa con una tinta puesta ---- */

/**
 * Pasar la racleta. Lo llaman "Empezá" y la mesa de la portada, que es el mismo gesto dicho
 * con el objeto. En la mesa hay una hoja con la primera tinta; la racleta baja y deja la
 * segunda, vuelve y deja la clave, y recién ahí arranca la partida. Un segundo toque mientras
 * pasa no espera: arranca. Con movimiento reducido no hay pasada y la partida arranca en el acto.
 */
let pasando: (() => void) | null = null;

function pasarLaRacleta(): void {
  if (pasando) {
    pasando();
    return;
  }
  // Este toque es el gesto que los celulares piden para dejar sonar algo: se despierta la
  // salida acá, y los ruidos de la partida ya pueden salir.
  const despierta = despertarSalida();
  const mesa = document.getElementById('mesa-portada');
  const escalon = duracionDe('--escalon-pasada');
  const total = escalon + duracionDe('--duracion-pasada');
  if (!mesa || total <= 0) {
    void despierta.then(() => sonarEfecto('racleta'));
    comenzar();
    return;
  }
  let entro = false;
  const relojes: number[] = [];
  const entrar = (): void => {
    if (entro) return;
    entro = true;
    pasando = null;
    for (const r of relojes) window.clearTimeout(r);
    comenzar();
  };
  pasando = entrar;
  mesa.classList.add('mesa-imprenta--imprime');
  void despierta.then(() => sonarEfecto('racleta'));
  relojes.push(window.setTimeout(() => sonarEfecto('racleta'), escalon));
  // Las dos pasadas, y un respiro para ver la hoja impresa antes de que se vaya.
  relojes.push(window.setTimeout(entrar, total + duracionDe('--duracion-paso')));
}

$('jugar').addEventListener('click', pasarLaRacleta);
document.getElementById('mesa-portada')?.addEventListener('click', pasarLaRacleta);

function comenzar(): void {
  const largo = Math.min(LARGO_RONDA, banco.length);
  ronda = armarRonda(banco, largo);
  indice = 0;
  elegidas = [];
  mostrar(zonaPartida);
  zonaPartida.replaceChildren();
  armarTablero();
  armarMesa();
  pintarPregunta();
  window.scrollTo({ top: 0 });
}

/* ---- La cabecera: por dónde vas, lo que llevás y la soga ---- */

/** Una hoja de la soga, vacía: el broche y el lugar donde va a colgar la impresa. */
function hojaDeSoga(): HTMLElement {
  const hoja = el('span', 'colgada colgada--resto');
  const papel = el('span', 'colgada-papel');
  papel.append(el('span', 'colgada-hoja'));
  hoja.append(papel);
  return hoja;
}

/** La tapa impresa, en chico: la foto si la tenías, la clave sola sobre el papel si no. */
function miniatura(e: Estampa, acerto: boolean): HTMLImageElement {
  const mini = el('img', acerto ? 'colgada-foto' : 'colgada-foto colgada-foto--clave');
  mini.src = acerto ? e.ficha : e.pasadas[2];
  mini.alt = '';
  mini.decoding = 'async';
  return mini;
}

function armarTablero(): void {
  tableroEl = el('div', 'tablero-imprenta');
  const fila = el('div', 'tablero-imprenta-fila');
  progresoEl = el('p', 'micro tablero-imprenta-paso');
  rachaEl = el('span', 'racha');
  rachaEl.hidden = true;
  llevasEl = el('span', 'restantes restantes--llevas', IMPRENTA.llevas(0));
  llevasEl.setAttribute('aria-live', 'polite');
  const ruidos = armarInterruptorDeRuidos({ apagar: IMPRENTA.ruidosTecla, prender: IMPRENTA.ruidosTecla });
  ruidos.classList.add('ruidos-tecla');
  fila.append(progresoEl, rachaEl, llevasEl, ruidos);

  // La soga: una hoja por tapa de la vuelta. Es dibujo —lo que dice lo lee `progresoEl` y la
  // cuenta de "Llevás"—; cada hoja respondida lleva además su tilde o su cruz.
  sogaEl = dibujo('div', 'tendedero');
  for (let i = 0; i < ronda.length; i++) sogaEl.append(hojaDeSoga());

  tableroEl.append(fila, sogaEl);
  zonaPartida.append(tableroEl);
}

/** Marca en la soga cuál es la tapa que está en la mesa. */
function ponerTableroAlDia(): void {
  progresoEl.textContent = PARTIDA.progreso(indice + 1, ronda.length);
  [...sogaEl.children].forEach((hoja, i) => {
    if (i === indice) {
      hoja.classList.remove('colgada--resto');
      hoja.classList.add('colgada--ahora');
    }
  });
}

/** La racha de la cabecera: dos o más seguidas. Se anota al llegar la ficha, o se corta. */
function anotarRacha(): void {
  const n = racha();
  rachaEl.hidden = n < 2;
  if (n >= 2) {
    rachaEl.textContent = IMPRENTA.racha(n);
    estampar(rachaEl);
  }
}

/* ---- La mesa: el bastidor, la racleta y las tres tintas ---- */

/**
 * La mesa se arma una vez por partida y queda (lo aprendido en "Completá la letra": lo impreso
 * no se rehace por pregunta). De una tapa a la otra cambia la hoja que hay adentro del bastidor.
 *
 * La `<figure>` y su `figcaption.credito-tapa` siguen siendo las de siempre (`D-21`, condición
 * 1): el crédito va pegado a la imagen, antes y después de responder.
 */
function armarMesa(): void {
  mesaEl = el('figure', 'figura-tapa-juego mesa-imprenta');
  bastidorEl = el('div', 'bastidor');
  bastidorEl.append(dibujo('span', 'bastidor-mordaza'), dibujo('span', 'bastidor-mordaza bastidor-mordaza--der'));
  papelEl = el('span', 'estampa-papel estampa-papel--abre');
  carroEl = dibujo('span', 'racleta-carro');
  carroEl.append(el('span', 'racleta'));
  // Las tres tintas de la tirada, al pie del bastidor: se llenan con cada pasada. Dicen con
  // forma —lleno o hueco— lo que la ficha dice con palabras ("en una tinta").
  tintasEl = dibujo('span', 'tintas');
  for (let i = 0; i < 3; i++) tintasEl.append(el('span', 'tinta'));
  bastidorEl.append(papelEl, carroEl, tintasEl);
  creditoEl = el('figcaption', 'credito-tapa');
  mesaEl.append(bastidorEl, creditoEl);
  zonaPartida.append(mesaEl);
}

/** Pide las imágenes sin ponerlas en pantalla, para que lleguen antes de hacer falta. */
function traer(rutas: readonly string[]): void {
  for (const ruta of rutas) {
    const img = new Image();
    img.decoding = 'async';
    img.src = ruta;
  }
}

function pintarPregunta(): void {
  const item = ronda[indice]!;
  // Lo de la tapa anterior se va; la cabecera y la mesa quedan.
  for (const hijo of [...zonaPartida.children]) if (hijo !== tableroEl && hijo !== mesaEl) hijo.remove();
  zonaPartida.classList.remove('partida--revelada');
  ponerTableroAlDia();

  // La mesa vuelve a como estaba: la racleta arriba, las tintas sin usar, ningún sello.
  mesaEl.classList.remove('figura-tapa-juego--abierta');
  carroEl.className = 'racleta-carro';
  for (const t of tintasEl.children) t.className = 'tinta';
  for (const resto of bastidorEl.querySelectorAll('.sello-cae, .sello-marca')) resto.remove();

  // La imagen es la pregunta. El alt NO nombra el disco: nombrarlo seria regalar la
  // respuesta a quien usa lector de pantalla y a quien mire el HTML.
  const papel = el('span', 'estampa-papel estampa-papel--abre');
  const img = el('img', 'tapa-juego');
  img.src = item.imagen.ruta;
  img.alt = PARTIDA.altImagen;
  img.loading = 'eager';
  papel.append(img);
  papelEl.replaceWith(papel);
  papelEl = papel;
  pegar(papel);
  creditoEl.textContent = PARTIDA.credito(item.imagen.credito.autor);

  // Mientras se piensa, llegan las tintas de esta tapa y el recorte de la que sigue: al
  // responder, la racleta no espera a la red.
  const e = estampaDelItem(item);
  const proxima = ronda[indice + 1];
  traer([...(e ? [...e.pasadas, e.ficha] : []), ...(proxima ? [proxima.imagen.ruta] : [])]);

  enunciadoEl = el(
    'h2',
    'enunciado',
    item.imagen.encuadre === 'detalle' ? PARTIDA.preguntaDetalle : PARTIDA.pregunta,
  );
  zonaPartida.append(enunciadoEl);

  listaEl = el('ul', 'opciones opciones--tapa');
  item.opciones.forEach((op, i) => {
    const li = el('li');
    const b = el('button', 'opcion jugo-pega');
    b.type = 'button';
    b.dataset.texto = op.texto;
    b.style.setProperty('--orden', String(i + 1));
    b.append(el('span', 'opcion-texto', op.texto));
    b.addEventListener('pointerdown', () => (conPuntero = true));
    b.addEventListener('keydown', () => (conPuntero = false));
    b.addEventListener('click', () => responder(op.texto), { once: true });
    li.append(b);
    listaEl.append(li);
  });
  zonaPartida.append(listaEl);
}

/**
 * El sello grande del cierre: cae sobre la esquina de la hoja recién impresa, con la tilde o la
 * cruz, como el visto de una prueba de imprenta. Es dibujo: lo mismo lo dicen las opciones
 * (símbolo y tinta) y la ficha.
 */
function sellarLaHoja(acerto: boolean): void {
  if (bastidorEl.querySelector('.sello-cae, .sello-marca')) return;
  bastidorEl.append(dibujo('span', `sello-cae sello-cae--${acerto ? 'ok' : 'no'}`, acerto ? '✔︎' : '✕︎'));
  sonarEfecto('sello');
}

/** Lo que queda del sello cuando llega la ficha: la marca chica, en la esquina del bastidor. */
function dejarLaMarca(acerto: boolean): void {
  for (const resto of bastidorEl.querySelectorAll('.sello-cae')) resto.remove();
  if (bastidorEl.querySelector('.sello-marca')) return;
  bastidorEl.append(dibujo('span', `sello-marca sello-marca--${acerto ? 'ok' : 'no'}`, acerto ? '✔︎' : '✕︎'));
}

function responder(texto: string): void {
  const item = ronda[indice]!;
  if (elegidas[indice] !== undefined) return;
  elegidas[indice] = texto;
  const correcta = correctaDe(item);
  const acerto = texto === correcta;
  const cual = indice;
  const estaHoja = papelEl;
  const vigente = (): boolean => indice === cual && papelEl === estaHoja && estaHoja.isConnected;

  // Se marcan todas y se apagan: la ronda no admite cambiar de opinion.
  for (const b of zonaPartida.querySelectorAll<HTMLButtonElement>('.opcion')) {
    b.disabled = true;
    b.classList.remove('jugo-pega');
    if (b.dataset.texto === correcta) b.classList.add('es-correcta');
    else if (b.dataset.texto === texto) b.classList.add('es-elegida');
    else b.classList.add('es-otra');
  }
  // Los botones quedaron deshabilitados: el foco vuelve a la pregunta, no al `<body>`.
  enfocar(enunciadoEl);

  /*
   * El primer tiempo, en el mismo toque: la hoja de la soga dice cómo salió (tilde o cruz), el
   * zoom se abre y la racleta empieza a pasar. Si erraste, además, la mesa da un golpe.
   */
  const hoja = sogaEl.children[indice];
  if (hoja) {
    hoja.classList.remove('colgada--ahora');
    hoja.classList.add(acerto ? 'colgada--ok' : 'colgada--no');
    hoja.querySelector('.colgada-papel')?.append(el('span', 'colgada-marca', acerto ? '✔︎' : '✕︎'));
    estampar(hoja.querySelector('.colgada-marca'));
  }
  const seImprimio = abrirElRecorte(item, correcta, acerto);
  if (acerto) {
    try {
      navigator.vibrate?.(18);
    } catch {
      // Sin vibración: no pasa nada.
    }
  } else {
    golpear(zonaPartida);
    sonarEfecto('golpe');
  }

  /*
   * Lo que tarda la tirada: el zoom que se abre y una pasada por tinta (tres y el fijado si la
   * tenías; la clave sola si no). Cuando la última tinta ya está apoyando cae el sello, y un
   * compás después llega la ficha. **Todo se puede adelantar con un toque** (o con Enter o la
   * barra). Adelantar no saltea: el sello y la ficha se ponen una sola vez, vengan de su reloj
   * o del toque. Con movimiento reducido los tiempos valen cero.
   */
  const escalon = duracionDe('--escalon-pasada');
  const arranque = seImprimio ? duracionDe('--duracion-paso') : 0;
  const pasadas = !seImprimio ? 0 : acerto ? 4 : 1;
  const hastaElSello = arranque + escalon * pasadas;
  const hastaLaFicha = hastaElSello + duracionDe('--duracion-pasada');
  const relojes: number[] = [];
  for (let i = 0; i < pasadas; i++) {
    relojes.push(window.setTimeout(() => vigente() && sonarEfecto('racleta'), arranque + escalon * i));
  }

  let conFicha = false;
  const alTeclear = (ev: KeyboardEvent): void => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    ev.preventDefault();
    conPuntero = false;
    mostrarLaFicha();
  };
  const alTocar = (): void => {
    conPuntero = true;
    mostrarLaFicha();
  };
  function mostrarLaFicha(): void {
    if (conFicha) return;
    conFicha = true;
    for (const r of relojes) window.clearTimeout(r);
    zonaPartida.removeEventListener('click', alTocar);
    document.removeEventListener('keydown', alTeclear);
    if (!vigente()) return;
    sellarLaHoja(acerto);
    pintarFicha(item, acerto, correcta, seImprimio);
  }
  if (hastaLaFicha <= 0) {
    mostrarLaFicha();
    return;
  }
  relojes.push(window.setTimeout(() => vigente() && sellarLaHoja(acerto), hastaElSello));
  relojes.push(window.setTimeout(mostrarLaFicha, hastaLaFicha));
  // El toque que eligió la opción no cuenta: se empieza a escuchar en la vuelta siguiente. Se
  // escucha el `click` y no el `pointerdown`: la ficha corre la hoja, y con `pointerdown` el
  // `click` de ese mismo toque cae después sobre lo que haya quedado bajo el dedo.
  window.setTimeout(() => {
    if (conFicha || !vigente()) return;
    zonaPartida.addEventListener('click', alTocar);
    document.addEventListener('keydown', alTeclear);
  }, 0);
}

/**
 * El zoom se abre (`UX-22` §11, `T-206`; ronda de pulida, 2026-11-20).
 *
 * Se jugó mirando un recorte de la tapa y al responder deja de haber zoom. **El pedazo se
 * achica hasta su lugar real** adentro de la tapa (`recorte.ts` sabe dónde cae) y el resto se
 * imprime alrededor, por las mismas pasadas del reveal de "Adiviná el tema" —clara, media,
 * clave y el fijado de la foto—, con la racleta pasando una vez por tinta. Al fallar, la clave
 * sola: la tapa de un ítem que no se acertó no se completa nunca; lo que queda es una prueba de
 * imprenta en una tinta, con el pedazo que mirabas pegado en su sitio.
 *
 * *La mosca y la sopa* se juega con la olla de la contratapa, que no está en la tapa de
 * adelante: ahí no hay lugar al que llevar el pedazo. Al acertar queda debajo y la foto lo tapa
 * al fijarse; al fallar se va, como antes.
 *
 * La `<figure>` y su `figcaption.credito-tapa` no se tocan (`D-21`, condición 1): el crédito ya
 * estaba pegado a la imagen y sigue pegado a la que la reemplaza.
 *
 * Devuelve si de verdad se imprimió algo: un disco fuera de los diez no tiene estampa y la
 * pantalla queda como era, sin hueco (`ADR-05.5`).
 */
function abrirElRecorte(item: Item, disco: string, acerto: boolean): boolean {
  const recorte = papelEl.querySelector<HTMLImageElement>('.tapa-juego');
  const e = estampaDelItem(item);
  if (!recorte || !e) return false;

  mesaEl.classList.add('figura-tapa-juego--abierta');
  papelEl.classList.remove('jugo-pega');

  const lugar = recorteDe(e.slug);
  if (lugar) {
    recorte.style.setProperty('--recorte-x', `${lugar.x * 100}%`);
    recorte.style.setProperty('--recorte-y', `${lugar.y * 100}%`);
    recorte.style.setProperty('--recorte-lado', String(lugar.lado));
    recorte.classList.add('tapa-juego--a-su-lugar');
  } else if (!acerto) {
    recorte.remove();
  }
  // Deja de ser lo que se lee: arriba llega la tapa, que es la que habla.
  recorte.alt = '';

  const capas: Array<[nombre: string, ruta: string]> = acerto
    ? [['clara', e.pasadas[0]], ['media', e.pasadas[1]], ['clave', e.pasadas[2]]]
    : [['clave', e.pasadas[2]]];
  for (const [nombre, ruta] of capas) {
    const tinta = el('img', `pasada pasada--${nombre}`);
    tinta.src = ruta;
    tinta.decoding = 'async';
    tinta.alt = acerto ? '' : PARTIDA.altTapaClave(disco);
    papelEl.append(tinta);
  }

  if (acerto) {
    const foto = el('img', 'estampa-foto');
    foto.src = e.ficha;
    foto.decoding = 'async';
    foto.alt = PARTIDA.altTapaEntera(disco);
    papelEl.append(foto);
  }

  // La racleta: cuatro pasadas (ida y vuelta, dos veces), o una sola ida con su vuelta.
  carroEl.classList.add(acerto ? 'racleta-carro--tirada' : 'racleta-carro--prueba');
  if (!acerto) papelEl.classList.add('estampa-papel--prueba');
  // Las tintas que se usaron: las tres, una atrás de la otra, o la clave sola.
  [...tintasEl.children].forEach((t, i) => {
    if (!acerto && i < 2) return;
    t.classList.add('tinta--puesta');
    (t as HTMLElement).style.setProperty('--orden', String(acerto ? i : 0));
  });

  return true;
}

/**
 * El segundo tiempo: la ficha de la respuesta, con la gramática de los otros juegos pulidos —
 * la marca y el grito estampados, lo que sumaste, el disco escrito grande, el dato, el rótulo
 * de leyenda o testimonio, y "Seguí" adentro, cerrando la columna—. Las dos opciones que no
 * eran ni la tuya ni la buena se van. Debajo, el zócalo: de qué edición es la imagen y la
 * puerta para corregir.
 */
function pintarFicha(item: Item, acerto: boolean, correcta: string, seImprimio: boolean): void {
  zonaPartida.classList.add('partida--revelada');
  dejarLaMarca(acerto);
  listaEl.classList.add('opciones--cerradas');
  anotarRacha();

  const panel = el('div', `feedback revelacion ficha-respuesta jugo-pega ${acerto ? 'ok' : 'no'}`);
  // Region viva: se inserta VACIA a proposito —un lector de pantalla anuncia los cambios de una
  // region que ya existe con mucha mas confiabilidad que una recien nacida—, y sin el botón.
  const dice = el('div', 'ficha-respuesta-dice');
  dice.setAttribute('role', 'status');
  panel.append(dice);
  zonaPartida.append(panel);

  const cabeza = el('div', 'revelacion-cabeza');
  cabeza.append(dibujo('span', 'ficha-respuesta-marca', acerto ? '✔︎' : '✕︎'), el('p', 'micro', acerto ? PARTIDA.ok : PARTIDA.no));
  const sumaEl = acerto ? dibujo('span', 'revelacion-suma', IMPRENTA.suma) : null;
  if (sumaEl) cabeza.append(sumaEl);
  dice.append(cabeza);

  // El disco, escrito grande. Al fallar, la tapa llegó en una sola tinta, y la línea lo dice
  // con las mismas palabras que "Adiviná el tema" (`CNT-14` §3). Si el disco no tiene estampa,
  // no hay tinta de la que hablar y la frase queda como estaba.
  dice.append(
    el(
      'p',
      'respuesta-dato',
      acerto ? correcta : `${PARTIDA.eraLa} ${correcta}${seImprimio ? `, ${PARTIDA.enClave}` : '.'}`,
    ),
  );

  if (item.explicacion) dice.append(el('p', 'explicacion', item.explicacion));

  // El rótulo (`BR-08`, registro 3): frío, con su símbolo, sin adornos.
  if (item.rotulo) {
    dice.append(
      el(
        'p',
        `sello sello--${item.rotulo.tipo}`,
        `${item.rotulo.tipo === 'leyenda' ? '◆' : '❝'} ${item.rotulo.texto}`,
      ),
    );
  }

  /*
   * El avance lo manda el dedo, siempre. "Seguí" va adentro de la ficha y afuera de la región
   * viva: así se anuncia el resultado y la explicación, y no "Seguí, botón" mezclado con ellos.
   */
  const ultima = indice + 1 >= ronda.length;
  const seguir = el('button', 'primario seguir-ficha', ultima ? IMPRENTA.alResultado : PARTIDA.seguir);
  seguir.type = 'button';
  seguir.addEventListener('click', avanzar, { once: true });
  panel.append(seguir);

  // El zócalo, pegado debajo: la edición de la imagen —que se cuenta recién acá: antes de
  // responder es una pista de más— y el botón de corrección, afuera de la región viva (`UX-09`).
  const zocalo = el('div', 'ficha-pie ficha-zocalo');
  zocalo.append(el('p', 'edicion-tapa', PARTIDA.edicion(item.imagen.edicion)));
  zocalo.append(
    botonCorreccion(() => ({
      juego: 'tapa',
      itemId: item.id,
      ubicacion: 'la respuesta correcta',
      dice: `${item.imagen.encuadre === 'detalle' ? PARTIDA.preguntaDetalle : PARTIDA.pregunta} → ${correcta}`,
      rotulo: item.rotulo?.tipo ?? 'hecho',
      banco: { contrato: 'CTR-05', version: 1 },
    })),
  );
  zonaPartida.append(zocalo);

  // Lo que sumaste vuela del sello de la ficha a la cuenta de la cabecera, que sube al llegar.
  const total = contarAciertos(ronda, elegidas);
  if (acerto && sumaEl) {
    const cual = indice;
    const destino = llevasEl;
    const sigue = (): boolean => indice === cual && destino.isConnected;
    window.setTimeout(
      () => {
        if (!destino.isConnected) return;
        if (!sigue() || !sumaEl.isConnected) {
          destino.textContent = IMPRENTA.llevas(contarAciertos(ronda, elegidas));
          return;
        }
        volar(IMPRENTA.suma, 'suma-vuela', sumaEl, destino, () => {
          if (!destino.isConnected) return;
          contar(destino, total - 1, total, IMPRENTA.llevas);
          estampar(destino);
        });
      },
      duracionDe('--duracion-umbral') + duracionDe('--escalon-pasada'),
    );
  } else {
    llevasEl.textContent = IMPRENTA.llevas(total);
  }

  // El foco va a "Seguí" sin arrastrar la vista. El anillo se dibuja si se llegó con el
  // teclado y no si se llegó con el dedo.
  if (conPuntero) {
    seguir.classList.add('seguir--sin-anillo');
    seguir.addEventListener('blur', () => seguir.classList.remove('seguir--sin-anillo'), { once: true });
  }
  seguir.focus({ preventScroll: true });
  // Hasta el zócalo: así "Seguí" queda entero a la vista, en la zona del pulgar. Entre ver el
  // premio y que el botón esté, gana el botón (`UX-22` §1.4).
  zocalo.scrollIntoView({ block: 'nearest' });
}

/**
 * El pase: la hoja impresa sale de la mesa y **se cuelga a secar en la soga**, donde se queda
 * hamacando un momento; en la mesa ya está el recorte que sigue. Con movimiento reducido la
 * hoja aparece colgada.
 */
function avanzar(): void {
  sonarEfecto('tecla');
  const cual = indice;
  const item = ronda[cual]!;
  const acerto = acertada(cual);
  const e = estampaDelItem(item);
  const hoja = sogaEl.children[cual];
  const lugar = hoja?.querySelector<HTMLElement>('.colgada-hoja');
  const estaSoga = sogaEl;

  indice += 1;
  if (indice >= ronda.length) {
    pintarResultado();
    return;
  }

  // Primero la hoja vuelve arriba: el vuelo se mide con la soga ya en su lugar.
  window.scrollTo({ top: 0 });
  const desde = papelEl;
  if (e && lugar && desde.isConnected) {
    const colgar = (): void => {
      if (!estaSoga.isConnected || lugar.firstChild) return;
      lugar.append(miniatura(e, acerto));
      hoja?.classList.add('colgada--llega');
      sonarEfecto('clac');
    };
    const pieza = el('span', 'hoja-suelta');
    const enElAire = miniatura(e, acerto);
    // Ya está bajada (es la que se acaba de imprimir): que se pinte en el primer cuadro.
    enElAire.decoding = 'sync';
    pieza.append(enElAire);
    volarPieza(pieza, desde, lugar, colgar);
  }
  pintarPregunta();
  enfocar(enunciadoEl);
}

/* ---- El resultado: la tirada colgada ---- */

/** La tarjeta de la vuelta: la soga con las seis hojas. Nunca tira: si no se puede, `null`. */
async function dibujarLaTarjeta(aciertos: number): Promise<Blob | null> {
  try {
    const autores = [...new Set(ronda.map((i) => i.imagen.credito.autor))];
    return await dibujarTirada({
      juego: IMPRENTA.juego,
      puntaje: RESULTADO.puntaje(aciertos, ronda.length),
      rotulo: IMPRENTA.tirada,
      hojas: ronda.map((item, i) => {
        const e = estampaDelItem(item);
        return { entera: acertada(i), imagen: e ? (acertada(i) ? e.ficha : e.pasadas[2]) : null };
      }),
      credito: IMPRENTA.creditoTarjeta(autores.join(', ')),
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
  zonaResultado.replaceChildren();

  let orden = 0;
  const entra = <T extends HTMLElement>(pieza: T, clase = 'jugo-entra'): T => {
    pieza.classList.add(clase);
    pieza.style.setProperty('--orden', String(orden++));
    return pieza;
  };

  const puntaje = el('p', 'puntaje puntaje--tirada');
  puntaje.id = 'puntaje-tapa';
  const encabezado = entra(el('h2', undefined, RESULTADO.titulo));
  encabezado.setAttribute('aria-describedby', puntaje.id);
  zonaResultado.append(encabezado);

  // La cuenta sube en escalones y apoya como un sello. El lector lee el valor final.
  const cuenta = entra(el('div', 'cuenta-vuelta'));
  contar(puntaje, 0, aciertos, (n) => RESULTADO.puntaje(n, total));
  cuenta.append(puntaje);
  window.setTimeout(() => {
    if (!puntaje.isConnected) return;
    estampar(puntaje);
    sonarEfecto('sello');
  }, duracionDe('--duracion-cuenta'));
  if (aciertos === total && total > 0) {
    // La hazaña: la tirada entera. Doble filete y un segundo sello.
    puntaje.classList.add('puntaje--hazana');
    cuenta.append(el('p', 'hazana-sello', IMPRENTA.hazana));
  }
  zonaResultado.append(cuenta);

  // La soga, entera: las seis hojas en el orden en que se jugaron, cada una con su disco. Las
  // que tenías, impresas del todo; las que no, en una tinta. Tilde o cruz además de la tinta.
  zonaResultado.append(entra(el('p', 'tendedero-rotulo', IMPRENTA.tirada)));
  const soga = el('ul', 'tendedero tendedero--vuelta');
  soga.setAttribute('aria-label', IMPRENTA.tiradaLeida(aciertos, total - aciertos));
  ronda.forEach((item, i) => {
    const ok = acertada(i);
    const disco = correctaDe(item);
    const e = estampaDelItem(item);
    const hoja = el('li', `colgada colgada--${ok ? 'ok' : 'no'} colgada--llega`);
    hoja.style.setProperty('--orden', String(i));
    const papel = dibujo('span', 'colgada-papel');
    const lamina = el('span', 'colgada-hoja');
    if (e) lamina.append(miniatura(e, ok));
    papel.append(lamina, el('span', 'colgada-marca', ok ? '✔︎' : '✕︎'));
    hoja.append(papel);
    hoja.append(dibujo('span', 'colgada-disco', disco));
    hoja.append(el('span', 'solo-lector', ok ? IMPRENTA.hojaEntera(disco) : IMPRENTA.hojaEnUnaTinta(disco)));
    soga.append(hoja);
  });
  zonaResultado.append(soga);

  /*
   * El pie del resultado (`.pie-resultado`): la misma pieza y el mismo orden que los otros
   * juegos pulidos — la tarjeta que asoma, "Compartí", lo que compartir tenga para decir y la
   * otra vuelta. El resultado viaja como desafío, forma `marcador` (`ADR-02`).
   */
  const pie = entra(el('div', 'pie-resultado'));
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
    archivoDeLaTarjeta = new File([imagen], nombreArchivo('adivina-la-tapa'), { type: 'image/png' });
    urlDeLaTarjeta = URL.createObjectURL(imagen);
    const foto = el('img', 'jugo-pega');
    foto.alt = '';
    foto.src = urlDeLaTarjeta;
    asoma.append(foto);
  });

  const denuevo = el('button', 'secundario', RESULTADO.denuevo);
  denuevo.type = 'button';
  denuevo.addEventListener('click', () => {
    sonarEfecto('racleta');
    comenzar();
  });
  pie.append(asoma, compartir, salida, denuevo);
  zonaResultado.append(pie);

  // La salida hacia el fichín: la misma cinta de regreso de la portada, no un botón nuevo.
  const salidaAlFichin = el('p', 'salida-resultado');
  const volver = el('a', 'volver', `← ${RESULTADO.volver}`);
  volver.href = '/';
  salidaAlFichin.append(volver);
  zonaResultado.append(salidaAlFichin);

  mostrar(zonaResultado);
  window.scrollTo({ top: 0 });
  enfocar(encabezado);
}
