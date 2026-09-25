/**
 * La isla de "Más o menos" (`US-10`, `UX-34`).
 *
 * Tres pantallas: la entrada, la partida (pregunta → revelado → *Seguí*) y el resultado.
 * El motor vive en `lib/mas-o-menos/partida.ts` y se prueba en Node; acá solo se pinta.
 *
 * **Nada se escribe con `innerHTML`**, igual que en el resto de las islas: todo con
 * `createElement` y `textContent`. El nombre del desafío viene de la URL (`ADR-02`).
 *
 * **El revelado es de golpe** (`UX-34` §5, `RES-98`): el número real aparece entero, sin
 * contador que sube. Y se anuncia por una región viva que existe desde que carga la página
 * (`#revelado`): una región creada en el mismo momento que su texto no la lee nadie.
 */

import { armarLink, leerDesafio } from '../lib/desafio.ts';
import {
  nuevaPartida,
  responder,
  siguientePaso,
  tramoDeRacha,
  valorDeReferencia,
  type Dato,
  type Eleccion,
  type EstadoPartida,
  type Paso,
} from '../lib/mas-o-menos/partida.ts';
import { conUnidad } from '../lib/mas-o-menos/formato.ts';
import type { PozoDeLaIsla } from '../lib/mas-o-menos/datos.ts';
import { DETALLE_PALABRA, EN_VIVO, FAMILIAS, PANTALLA_0, PARTIDA, RESULTADO, TRAMOS } from '../lib/mas-o-menos/copy.ts';
import { PORTAL } from '../lib/sitio/copy.ts';

/** Quién soy, para `leerDesafio` (`FIND-28`) y para el enlace que se comparte. */
const JUEGO = 'mas-o-menos';
/** La mejor racha del aparato (`D-48` punto 7). */
const CLAVE_MEJOR = 'arcade.mas-o-menos.mejor';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const inicio = $('inicio');
const zonaPartida = $('partida');
const zonaPregunta = $('pregunta');
const zonaRevelado = $('revelado');
const zonaResultado = $('resultado');

const isla: PozoDeLaIsla = JSON.parse($('pozo').textContent ?? '{}');
const pozo: readonly Dato[] = isla.datos ?? [];

let estado: EstadoPartida = nuevaPartida(pozo);
let paso: Paso | null = null;
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
  for (const s of [inicio, zonaPartida, zonaResultado]) s.hidden = s !== seccion;
}

function enfocar(destino: HTMLElement): void {
  destino.tabIndex = -1;
  destino.focus();
}

/** La mejor racha guardada. Sin almacenamiento (ventana privada) es cero, y se juega igual. */
function leerMejor(): number {
  try {
    const n = Number(localStorage.getItem(CLAVE_MEJOR));
    return Number.isInteger(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function guardarMejor(n: number): void {
  try {
    localStorage.setItem(CLAVE_MEJOR, String(n));
  } catch {
    /* sin almacenamiento no hay récord, y no pasa nada */
  }
}

/** "2026-09-24" → "24-09-2026", como la fecha de consulta en el resto del sitio. */
function diaMesAnio(iso: string): string {
  const [a, m, d] = iso.split('-');
  return a && m && d ? `${d}-${m}-${a}` : iso;
}

/** El número tal como se lee, con su unidad: "12 años", "5:34", "1986". */
function comoSeLee(valor: number, dato: Dato): string {
  return conUnidad(valor, dato.escala, dato.unidad);
}

// Si alguien llegó por un desafío, la bajada lo dice. `textContent`, nunca `innerHTML`: el
// nombre viene de la URL, que es la única superficie de entrada del sitio (`ADR-02`).
const desafio = leerDesafio(location.search, JUEGO);
if (desafio && desafio.forma !== 'identidad') {
  const bajada = document.getElementById('subtitulo');
  if (bajada) bajada.textContent = PANTALLA_0.desafio(desafio.puntaje, desafio.total, desafio.nombre);
}

$('jugar').addEventListener('click', comenzar);

function comenzar(): void {
  estado = nuevaPartida(pozo);
  mostrar(zonaPartida);
  pintarPaso();
}

function pintarPaso(): void {
  paso = siguientePaso(estado, Math.random);
  if (!paso) {
    pintarResultado(null);
    return;
  }
  const { dato, referencia } = paso;
  zonaPregunta.replaceChildren();
  zonaRevelado.replaceChildren();

  // La cabecera: la racha a la izquierda, la familia como sello neutro (`UX-34` §3.2).
  const cab = el('div', 'cabecera');
  cab.append(el('span', 'paso', PARTIDA.racha(estado.racha)));
  cab.append(el('span', 'categoria', FAMILIAS[dato.familia]));
  zonaPregunta.append(cab);

  const enunciado = el('h2', 'enunciado', dato.pregunta);
  zonaPregunta.append(enunciado);

  const textoRef = comoSeLee(valorDeReferencia(referencia), dato);
  zonaPregunta.append(cajaDeReferencia(paso));

  // Los dos botones. Para un año, "Antes" y "Después" (`D-48` punto 3), en ese orden.
  const esAnio = dato.escala === 'anio';
  const botones: readonly [Eleccion, 'Más' | 'Menos' | 'Antes' | 'Después'][] = esAnio
    ? [
        ['menos', PARTIDA.antes],
        ['mas', PARTIDA.despues],
      ]
    : [
        ['mas', PARTIDA.mas],
        ['menos', PARTIDA.menos],
      ];
  const lista = el('ul', 'masomenos-opciones');
  for (const [eleccion, rotulo] of botones) {
    const li = el('li');
    const b = el('button', 'opcion', rotulo);
    b.type = 'button';
    b.dataset.eleccion = eleccion;
    b.setAttribute('aria-label', PARTIDA.nombreBoton(rotulo, textoRef));
    b.addEventListener('click', () => elegir(eleccion), { once: true });
    li.append(b);
    lista.append(li);
  }
  zonaPregunta.append(lista);
  enfocar(enunciado);
}

/**
 * La referencia: el nombre del dato en chico si es un par, y el número grande (`UX-34`
 * §3.2). Sin "¿más o menos?" adentro: eso lo dicen los botones.
 */
function cajaDeReferencia(p: Paso): HTMLElement {
  const caja = el('div', 'masomenos-referencia');
  if (p.referencia.clase === 'par' && p.referencia.dato.sujeto) {
    caja.append(el('p', 'masomenos-sujeto', `«${p.referencia.dato.sujeto}»`));
  }
  caja.append(el('p', 'masomenos-valor', comoSeLee(valorDeReferencia(p.referencia), p.dato)));
  // Un número de setlist.fm lleva su fuente y su fecha también acá, antes de responder
  // (`RNF-CTR-19-A`, la enmienda de `BR-18` (b)). El enlace va recién en el revelado.
  if (p.referencia.clase === 'par' && p.referencia.dato.familia === 'en-vivo' && isla.enVivo) {
    caja.append(el('p', 'masomenos-sujeto', EN_VIVO.enCaja(diaMesAnio(isla.enVivo.consultado))));
  }
  return caja;
}

function elegir(eleccion: Eleccion): void {
  if (!paso) return;
  const acerto = responder(estado, paso, eleccion);

  // Los dos botones se apagan y se marcan: la correcta con ✔, la elegida con ✕ si no era.
  for (const b of zonaPregunta.querySelectorAll<HTMLButtonElement>('.opcion')) {
    b.disabled = true;
    if (b.dataset.eleccion === paso.correcta) b.classList.add('es-correcta');
    else if (b.dataset.eleccion === eleccion) b.classList.add('es-elegida');
  }

  const panel = panelDeRevelado(paso, acerto);
  const seguir = el('button', 'primario', PARTIDA.seguir);
  seguir.type = 'button';
  seguir.addEventListener('click', () => (acerto ? pintarPaso() : pintarResultado(paso)), { once: true });
  panel.append(seguir);

  zonaRevelado.replaceChildren(panel);
  seguir.focus({ preventScroll: true });
  panel.scrollIntoView({ block: 'end' });
}

/**
 * El panel del revelado: el número real, la fuente, y si era una palabra, las formas que
 * se contaron y en qué temas aparece (`D-48` punto 4: el número se puede auditar).
 */
function panelDeRevelado(p: Paso, acerto: boolean): HTMLElement {
  const { dato } = p;
  const panel = el('div', `feedback ${acerto ? 'ok' : 'no'}`);
  panel.append(el('p', 'micro', acerto ? PARTIDA.acierto : PARTIDA.error));
  panel.append(el('p', 'masomenos-real', `${acerto ? '✔︎' : '✕︎'} ${comoSeLee(dato.valor, dato)}`));
  if (dato.explicacion) panel.append(el('p', 'explicacion', dato.explicacion));
  panel.append(el('p', 'explicacion', dato.fuente));

  // En un par, las dos fuentes si son distintas (`RNF-CTR-20-A`): el jugador también vio el
  // número de la referencia, y tiene derecho a saber de dónde salió.
  const ref = p.referencia;
  if (ref.clase === 'par' && ref.dato.fuente !== dato.fuente) {
    panel.append(el('p', 'explicacion', `«${ref.dato.sujeto ?? ''}»: ${ref.dato.fuente}`));
  }

  // setlist.fm: el enlace y la fecha en el mismo bloque que el número (`RNF-CTR-19-A`).
  if (dato.familia === 'en-vivo' && isla.enVivo) {
    const bloque = el('p', 'explicacion', `${EN_VIVO.consultado(diaMesAnio(isla.enVivo.consultado))} `);
    const enlace = el('a', 'link', EN_VIVO.enlace);
    enlace.href = isla.enVivo.pagina;
    enlace.rel = 'noopener';
    bloque.append(enlace);
    panel.append(bloque);
  }

  if (dato.formas && dato.temas) {
    panel.append(el('p', 'masomenos-formas', DETALLE_PALABRA.formasContadas(dato.formas)));
    const plegado = el('details', 'masomenos-despliegue');
    plegado.append(el('summary', 'masomenos-despliegue-abrir', DETALLE_PALABRA.verEnCuales));
    const temas = el('ul', 'masomenos-temas');
    for (const t of dato.temas) {
      const li = el('li');
      const a = el('a', 'categoria', t.titulo);
      a.href = `/letras-y-acordes/${t.slug}/`;
      li.append(a);
      temas.append(li);
    }
    plegado.append(temas);
    panel.append(plegado);
  }
  return panel;
}

function pintarResultado(quienCorto: Paso | null): void {
  const racha = estado.racha;
  const anterior = leerMejor();
  const mejor = Math.max(anterior, racha);
  if (mejor > anterior) guardarMejor(mejor);

  zonaResultado.replaceChildren();
  zonaResultado.append(el('p', 'rotulo-desenlace', estado.ganada ? RESULTADO.victoria : RESULTADO.rotulo));
  const t = tramoDeRacha(racha);
  const encabezado = el('h2', `tramo tramo--${t}`, TRAMOS[t]);
  zonaResultado.append(encabezado);

  const cifra = el('div', 'cifra');
  cifra.append(el('p', 'cifra-rotulo', RESULTADO.rotuloRacha));
  cifra.append(el('p', 'cifra-numero', String(racha)));
  cifra.append(el('p', 'cifra-pie', RESULTADO.mejor(mejor)));
  zonaResultado.append(cifra);

  if (quienCorto) {
    // La misma pieza que se vio un paso antes, fija (`UX-34` §3.5): la pregunta, su
    // referencia y el panel del error.
    zonaResultado.append(el('h3', 'resumen-titulo', RESULTADO.teCorto));
    zonaResultado.append(el('p', 'masomenos-pregunta', quienCorto.dato.pregunta));
    zonaResultado.append(cajaDeReferencia(quienCorto));
    zonaResultado.append(panelDeRevelado(quienCorto, false));
  }

  const compartir = el('button', 'primario firma con-tilde', RESULTADO.compartir);
  compartir.type = 'button';
  compartir.addEventListener('click', () => void compartirResultado(racha));
  zonaResultado.append(compartir);

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
 * Compartir: el texto y el enlace de desafío (`ADR-02`, forma `marcador`: `p` la racha,
 * `t` las preguntas del pozo). Sin tarjeta-imagen en esta versión (`D-48` punto 11).
 */
async function compartirResultado(racha: number): Promise<void> {
  const url = armarLink(location.origin + location.pathname, {
    forma: 'marcador',
    juego: JUEGO,
    puntaje: racha,
    total: Math.max(racha, pozo.length),
  });
  const texto = RESULTADO.paraCompartir(racha);
  if (navigator.share) {
    try {
      await navigator.share({ text: texto, url });
      return;
    } catch {
      // Canceló, o el navegador no quiso. Cae al respaldo.
    }
  }
  const caja = salidaCompartir;
  if (!caja) return;
  caja.replaceChildren();
  try {
    await navigator.clipboard.writeText(`${texto} ${url}`);
    caja.append(el('p', 'compartir-aviso', RESULTADO.copiado));
  } catch {
    caja.append(el('p', 'compartir-aviso', RESULTADO.aManoTitulo));
    caja.append(el('p', 'link', `${texto} ${url}`));
  }
}
