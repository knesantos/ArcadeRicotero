/**
 * La isla de "Ponelos en fila" (`US-08`). Implementa `UX-23`.
 *
 * ## El mecanismo, y por qué no se arrastra
 *
 * **Tocás una ficha, tocás una fila.** Cero `pointerdown`, cero `touchstart`, cero
 * `setPointerCapture`: cada ficha y cada fila son `<button type="button">` y todo el juego
 * son sus `click`.
 *
 * No es una simplificación, es lo que la medición dejó como única opción sensata. El
 * arrastre de HTML5 tiene la API presente en iOS Safari y en Chrome Android, pero
 * **ningún motor dispara `dragstart` con el dedo**: piden mouse, trackpad, lápiz o modo
 * escritorio. O sea que "arrastrar en el celular" significa escribir un motor a mano con
 * `touch-action: none`, el clic fantasma del `touchend`, el desplazamiento automático de
 * los bordes y `overflow-anchor` — cuatro trampas propias— **encima de una vía sin
 * arrastre que hay que escribir igual**, porque WCAG 2.5.7 la pide, porque `D-09` dice
 * "jugable con el pulgar" y porque `D-14` no deja poner un molinete nuevo con forma de
 * gesto.
 *
 * Con botones, en cambio, el teclado y el lector de pantalla salen gratis: `Tab` recorre,
 * `Enter` y `Espacio` toman y sueltan, y no hay un solo `keydown` propio salvo `Escape`.
 *
 * **El arrastre sí existe, pero como agregado y solo donde funciona**: los cinco oyentes
 * de `drag*` de más abajo llaman a la misma función `ubicar()` que el toque. Si algún día
 * se rompen, el juego se juega igual — que es la única forma de agregar un gesto sin
 * volverlo un requisito.
 *
 * ## Regla que atraviesa el archivo, como en las otras seis islas
 *
 * Nada se escribe con `innerHTML`: todo se arma con `createElement` y `textContent`. Y
 * ninguna cadena visible vive acá — todas salen de `lib/ponelos/copy.ts`, que es lo único
 * que `voz.test.ts` audita.
 */

import {
  vacio,
  ubicar as moverFicha,
  vaciar,
  cuentas,
  restan,
  terminado,
  porFila,
  enLaBandeja,
  type Conjunto,
  type Ficha,
  type Reparto,
} from '../lib/ponelos/tablero.ts';
import { FILAS, SIN_UBICAR } from '../lib/ponelos/filas.ts';
import {
  armarConjunto,
  conjuntosOfrecidos,
  type Catalogo,
} from '../lib/ponelos/conjuntos.ts';
import { ELECCION, PARTIDA, LAMINA, IMPRESO } from '../lib/ponelos/copy.ts';
import { claseDisco } from '../lib/tema/paleta.ts';
import { armarLink, leerReparto } from '../lib/desafio.ts';
import { dibujarLamina } from './lamina.ts';
import { nombreArchivoLamina } from '../lib/ponelos/lamina.ts';

/** El nombre del juego en el link (`g=`). Alfabeto de `ADR-02`: minúsculas y guiones. */
const JUEGO = 'ponelos';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const zonaInicio = $('inicio');
const zonaEleccion = $('eleccion');
const zonaTablero = $('tablero');

const catalogo = JSON.parse($('catalogo').textContent ?? '{}') as Catalogo;

let conjunto: Conjunto | null = null;
let reparto: Reparto = [];
/** El índice de la ficha que está en la mano, o `null`. Es todo el estado del gesto. */
let enMano: number | null = null;
/** Si la lista llegó por una dirección compartida. Solo cambia lo que dice un renglón. */
let compartida = false;

let zonaMano: HTMLElement | null = null;

/**
 * Adónde vuelve el foco después de repintar. `null` es "no lo muevas".
 *
 * **Es la pieza más importante del teclado de este juego**, y la que ninguna de las otras
 * seis islas necesitó. Acá el tablero se rehace entero en cada toque —es la forma más
 * simple de que la pantalla y el reparto no se puedan desincronizar—, y eso tiene un
 * costo que no se ve con el mouse: **el botón que tenía el foco deja de existir**, y el
 * foco se cae al `<body>`. Para quien juega con teclado o con lector de pantalla, eso es
 * el juego entero roto: cada ficha colocada lo devuelve al principio del documento.
 *
 * Es exactamente el defecto que la auditoría del 2026-08-24 encontró en el quiz —"el foco
 * se caía al `<body>` en cada cambio de pantalla"— y por eso las seis islas tienen un
 * `focus()` después de cada repintado.
 */
let focoPieza: number | null = null;
let focoFila: number | null = null;

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
  for (const s of [zonaInicio, zonaEleccion, zonaTablero]) s.hidden = s !== seccion;
}

/**
 * Lo que dice la región viva, que es la misma línea que se ve.
 *
 * Una sola región y no dos: el rótulo de lo que tenés en la mano y el aviso de dónde
 * quedó la última ficha **son el mismo renglón** en momentos distintos. Partirlos daría
 * dos avisos por cada toque a quien usa lector de pantalla, que es exactamente el ruido
 * que hace que se apague la región.
 */
function decir(texto: string, enMano: boolean): void {
  if (!zonaMano) return;
  zonaMano.replaceChildren();
  zonaMano.classList.toggle('mano--cargada', enMano);
  if (enMano) zonaMano.append(el('span', 'mano-rotulo', PARTIDA.enLaMano));
  zonaMano.append(el('span', 'mano-dice', texto));
}

/* ==================================================================
   Pantalla 1 — qué repartís
   ================================================================== */

function pintarEleccion(): void {
  zonaEleccion.replaceChildren();
  zonaEleccion.append(el('h2', 'eleccion-titulo', ELECCION.titulo));

  const lista = el('ul', 'conjuntos');
  for (const r of conjuntosOfrecidos(catalogo)) {
    const li = el('li');
    const b = el('button', `conjunto ${r.disco ? claseDisco(r.disco) : ''}`.trim()) as HTMLButtonElement;
    b.type = 'button';
    b.append(el('span', 'conjunto-titulo', r.nombre));
    b.append(el('span', 'conjunto-baja', r.bajada));
    b.append(el('span', 'conjunto-dato', ELECCION.cuantas(r.cuantas)));
    b.addEventListener('click', () => abrir(r.id, null));
    li.append(b);
    lista.append(li);
  }
  zonaEleccion.append(lista);
  mostrar(zonaEleccion);
}

/* ==================================================================
   Pantalla 2 — el tablero
   ================================================================== */

/**
 * Abre un conjunto. `casillas` en `null` es empezar de cero; con valores, es una lista que
 * llegó por una dirección compartida.
 */
function abrir(id: string, casillas: readonly number[] | null): void {
  const c = armarConjunto(catalogo, id);
  if (!c) {
    // Un id que no existe es un link viejo o roto. Se abre la elección, nunca un error.
    pintarEleccion();
    return;
  }
  conjunto = c;
  reparto = casillas ?? vacio(c.fichas.length);
  compartida = casillas !== null;
  enMano = null;
  pintarTablero();
  mostrar(zonaTablero);
}

/**
 * Una ficha, como botón. Es la única forma que tiene el jugador de tocarla.
 *
 * **La clase se llama `pieza` y no `ficha`, y eso no es capricho:** `.ficha` ya existe en
 * `sitio.css` y es la tarjeta lateral de un artículo de la Redondopedia. Dos componentes
 * distintos con el mismo nombre de clase es la misma verdad duplicada que este proyecto
 * evita en todos lados, y encima de las que no avisan — se descubrió con el tablero ya
 * dibujado, viendo las fichas salir con papel rayado y cinta adhesiva que nadie les puso.
 */
function pintarFicha(indice: number, ficha: Ficha, fila: number): HTMLButtonElement {
  const puesta = fila !== SIN_UBICAR;
  const b = el(
    'button',
    ['pieza', claseDisco(ficha.disco), puesta ? 'pieza--puesta' : '', enMano === indice ? 'pieza--en-mano' : '']
      .filter(Boolean)
      .join(' '),
  ) as HTMLButtonElement;
  b.type = 'button';
  b.dataset.i = String(indice);
  b.setAttribute('aria-pressed', String(enMano === indice));

  const nombre = puesta
    ? PARTIDA.sacarDe(ficha.titulo, FILAS.find((f) => f.id === fila)!.nombre)
    : PARTIDA.tomar(ficha.titulo);
  b.setAttribute('aria-label', nombre);

  if (ficha.imagen && conjunto?.formato === 'tapa') {
    const img = el('img', 'pieza-tapa');
    img.src = ficha.imagen;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 160;
    img.height = 160;
    b.append(img);
  }

  const cuerpo = el('span', 'pieza-cuerpo');
  cuerpo.append(el('span', 'pieza-titulo', ficha.titulo));
  // El punto medio separa el renglón chico como en un tracklist, y de paso es la marca
  // que distingue una ficha puesta de una en la bandeja sin depender del tinte (`UX-01`).
  cuerpo.append(el('span', 'pieza-pie', puesta ? `· ${ficha.pie}` : ficha.pie));
  b.append(cuerpo);

  if (enMano === indice) b.append(el('span', 'pieza-mano', PARTIDA.enLaMano));

  b.addEventListener('click', () => tocarFicha(indice, fila));

  // El agregado para quien tiene mouse. Con el dedo no dispara nunca, así que no puede
  // romperle el juego a nadie — ver el encabezado.
  b.draggable = true;
  b.addEventListener('dragstart', (e) => {
    // **Acá no se repinta**, y no es un descuido: repintar destruye el elemento que el
    // navegador está arrastrando y el gesto se cancela solo. Se marca la ficha a mano y el
    // tablero se rehace recién al soltar.
    enMano = indice;
    b.classList.add('pieza--en-mano');
    e.dataTransfer?.setData('text/plain', String(indice));
  });
  b.addEventListener('dragend', () => {
    if (enMano !== indice) return;
    enMano = null;
    b.classList.remove('pieza--en-mano');
  });

  return b;
}

/** Mueve una ficha y repinta. Es el único camino por el que cambia el reparto. */
function ubicar(indice: number, fila: number): void {
  const ficha = conjunto!.fichas[indice]!;
  reparto = moverFicha(reparto, indice, fila);
  enMano = null;

  /*
   * Adónde va el foco al soltar una ficha, y por qué a la bandeja y no a la fila.
   *
   * Al que juega con teclado le queda **la siguiente ficha sin ubicar ya enfocada**, así
   * que repartir es tocar dos veces por ficha y nada más. Si el foco se quedara en la fila,
   * habría que volver tabulando a la bandeja en cada vuelta — trece veces en el conjunto
   * más largo.
   *
   * Cuando no queda ninguna, el foco se va a la fila donde acaba de caer la última: es el
   * lugar donde pasó lo último que pasó, y desde ahí se sigue tabulando al botón de
   * compartir.
   */
  const siguiente = reparto.findIndex((v) => v === SIN_UBICAR);
  if (siguiente >= 0) focoPieza = siguiente;
  else focoFila = fila === SIN_UBICAR ? null : fila;
  if (fila === SIN_UBICAR) focoPieza = indice;

  pintarTablero();
  guardarEnLaDireccion();

  if (fila === SIN_UBICAR) decir(PARTIDA.sacaste(ficha.titulo, restan(reparto)), false);
  else decir(PARTIDA.ubicaste(ficha.titulo, FILAS.find((f) => f.id === fila)!.nombre, restan(reparto)), false);
}

/** El toque sobre una ficha: la toma, la suelta, o la saca de donde está. */
function tocarFicha(indice: number, fila: number): void {
  if (enMano === indice) {
    // Segundo toque sobre la misma: se suelta donde estaba. Nada se mueve.
    enMano = null;
    focoPieza = indice;
    pintarTablero();
    decir(PARTIDA.soltaste(conjunto!.fichas[indice]!.titulo), false);
    return;
  }
  if (fila !== SIN_UBICAR) {
    // Una ficha ya puesta vuelve a la bandeja. **Nunca se borra**: el conjunto es fijo.
    ubicar(indice, SIN_UBICAR);
    return;
  }
  enMano = indice;
  focoPieza = indice;
  pintarTablero();
  decir(PARTIDA.tomaste(conjunto!.fichas[indice]!.titulo), true);
  acercarLasFilas();
}

/**
 * Trae las filas a la vista al tomar una ficha.
 *
 * Con trece fichas y cuatro filas en 375 px, el destino casi nunca está en pantalla junto
 * a la bandeja: sin esto, tomar una ficha deja al jugador mirando un tablero que no
 * cambió. **Sin `smooth`**, que sería movimiento que el corte de movimiento reducido no
 * apaga; el navegador salta y listo.
 */
function acercarLasFilas(): void {
  document.querySelector('.filas')?.scrollIntoView({ block: 'nearest' });
}

/**
 * Devuelve el foco adonde corresponde después de rehacer el tablero.
 *
 * **Solo si venía de adentro del tablero**, que es lo que distingue al que está jugando con
 * teclado o con mouse del que toca con el dedo: en táctil el botón no queda enfocado, así
 * que mover el foco ahí no arreglaría nada y de paso haría saltar la hoja en cada ficha.
 *
 * `preventScroll` no se usa: si el foco se va a una ficha que quedó fuera de la vista, el
 * que está tabulando necesita verla. Es el navegador el que decide cuánto mover, y mueve
 * lo mínimo.
 */
function devolverElFoco(veniaDeAdentro: boolean): void {
  if (!veniaDeAdentro) return;
  const blanco =
    focoPieza !== null
      ? zonaTablero.querySelector<HTMLElement>(`.pieza[data-i="${focoPieza}"]`)
      : focoFila !== null
        ? zonaTablero.querySelector<HTMLElement>(`.fila-destino[data-fila="${focoFila}"]`)
        : null;
  blanco?.focus();
}

function pintarTablero(): void {
  const c = conjunto!;
  const veniaDeAdentro = zonaTablero.contains(document.activeElement);
  zonaTablero.replaceChildren();

  const cab = el('header', 'tablero-cabecera');
  cab.append(el('h2', 'tablero-titulo', c.nombre));
  cab.append(el('p', 'tablero-baja', c.bajada));
  if (compartida) cab.append(el('p', 'lista--compartida', PARTIDA.llegoCompartida));
  zonaTablero.append(cab);

  zonaMano = el('p', 'mano');
  zonaMano.setAttribute('aria-live', 'polite');
  zonaTablero.append(zonaMano);

  const cuenta = cuentas(reparto);
  const filas = el('div', 'filas');
  for (const armada of porFila(c, reparto)) {
    const seccion = el(
      'section',
      `fila ${enMano !== null ? 'fila--abierta' : ''}`.trim(),
    );

    const destino = el('button', 'fila-destino') as HTMLButtonElement;
    destino.type = 'button';
    destino.dataset.fila = String(armada.fila.id);
    destino.setAttribute('aria-label', PARTIDA.ponerEn(armada.fila.nombre, cuenta[armada.fila.id] ?? 0));
    destino.append(el('span', 'fila-sello', armada.fila.nombre));
    destino.append(el('span', 'fila-cuenta', String(cuenta[armada.fila.id] ?? 0)));
    destino.addEventListener('click', () => {
      if (enMano !== null) ubicar(enMano, armada.fila.id);
    });
    // El agregado de mouse: soltar sobre la banda hace lo mismo que tocarla.
    destino.addEventListener('dragover', (e) => e.preventDefault());
    destino.addEventListener('drop', (e) => {
      e.preventDefault();
      if (enMano !== null) ubicar(enMano, armada.fila.id);
    });
    seccion.append(destino);

    const lista = el('ul', 'fila-piezas');
    for (const ficha of armada.fichas) {
      const li = el('li');
      li.append(pintarFicha(c.fichas.indexOf(ficha), ficha, armada.fila.id));
      lista.append(li);
    }
    seccion.append(lista);
    filas.append(seccion);
  }
  zonaTablero.append(filas);

  const quedan = enLaBandeja(c, reparto);
  const bandeja = el('section', `bandeja ${quedan.length === 0 ? 'bandeja--vacia' : ''}`.trim());
  const rotulo = el('h2', 'bandeja-rotulo');
  rotulo.append(el('span', 'bandeja-sello', PARTIDA.bandeja));
  rotulo.append(el('span', 'fila-cuenta', String(quedan.length)));
  bandeja.append(rotulo);

  const enBandeja = el('ul', 'fila-piezas');
  for (const ficha of quedan) {
    const li = el('li');
    li.append(pintarFicha(c.fichas.indexOf(ficha), ficha, SIN_UBICAR));
    enBandeja.append(li);
  }
  bandeja.append(enBandeja);
  if (quedan.length === 0) bandeja.append(el('p', 'bandeja-lista', PARTIDA.completa));
  zonaTablero.append(bandeja);

  zonaTablero.append(pintarAcciones());
  devolverElFoco(veniaDeAdentro);
  focoPieza = null;
  focoFila = null;
}

/* ==================================================================
   Pantalla 3 — la lámina, que aparece cuando no queda ninguna sin ubicar
   ================================================================== */

let salidaCompartir: HTMLElement | null = null;

function pintarAcciones(): HTMLElement {
  const zona = el('section', 'lamina');
  if (terminado(reparto)) zona.append(el('h2', 'lamina-titulo', LAMINA.titulo));

  const compartir = el('button', 'primario firma con-tilde', LAMINA.compartir) as HTMLButtonElement;
  compartir.type = 'button';
  compartir.addEventListener('click', () => void compartirLista(compartir));
  zona.append(compartir);

  salidaCompartir = el('div', 'compartir-salida');
  salidaCompartir.setAttribute('aria-live', 'polite');
  zona.append(salidaCompartir);

  const desarmar = el('button', 'secundario', PARTIDA.desarmar) as HTMLButtonElement;
  desarmar.type = 'button';
  desarmar.addEventListener('click', () => {
    reparto = vaciar(reparto);
    enMano = null;
    compartida = false;
    pintarTablero();
    guardarEnLaDireccion();
  });
  zona.append(desarmar);

  const otra = el('button', 'secundario', LAMINA.denuevo) as HTMLButtonElement;
  otra.type = 'button';
  otra.addEventListener('click', () => {
    limpiarLaDireccion();
    pintarEleccion();
  });
  zona.append(otra);

  const volver = el('a', 'secundario', LAMINA.volver);
  volver.href = '/';
  zona.append(volver);

  return zona;
}

/**
 * Compartir la lista: la lámina para mirarla, y la dirección para contestarla.
 *
 * La escalera es la de los otros juegos, de la mejor salida a la que no puede fallar:
 * menú del sistema con la imagen, menú sin la imagen, portapapeles con la lámina a mano, y
 * la dirección escrita. **Si la lámina no se puede dibujar, se comparte igual sin ella** —
 * una imagen que falló no puede dejar a nadie sin poder compartir (`D-14`).
 */
async function compartirLista(boton: HTMLButtonElement): Promise<void> {
  const c = conjunto!;
  const url = armarLink(location.origin + location.pathname, {
    forma: 'reparto',
    juego: JUEGO,
    conjunto: c.id,
    casillas: reparto,
  });
  const texto = LAMINA.paraCompartir(c.nombre);

  const rotuloOriginal = boton.textContent ?? LAMINA.compartir;
  boton.disabled = true;
  boton.textContent = PARTIDA.armando;

  let imagen: Blob | null = null;
  try {
    imagen = await dibujarLamina({
      juego: IMPRESO.juego,
      conjunto: c.nombre,
      bandas: porFila(c, reparto).map((a) => ({
        nombre: a.fila.nombre,
        fichas: a.fichas.length > 0 ? a.fichas.map((f) => f.titulo) : [LAMINA.vacia],
        // Un conjunto que se mira se imprime con las tapas; uno que se lee, con los
        // titulos. Una lista de discos sin las tapas es la mitad de lo que se ordeno.
        imagenes: a.fichas.map((f) => f.imagen).filter((r): r is string => r !== null),
      })),
      repartidas: `${IMPRESO.rotuloCuantas}: ${c.fichas.length - restan(reparto)} / ${c.fichas.length}`,
      // El credito dice lo que hay adentro de ESTA lamina, no lo que suele haber: firmarle
      // a Rocambole una imagen de puro texto seria un rotulo que miente (`D-21`).
      credito: c.formato === 'tapa' ? IMPRESO.creditoConTapas : IMPRESO.creditoSinTapas,
      sitio: location.host + location.pathname,
    });
  } catch {
    // La lámina es el premio, no el camino.
    imagen = null;
  }

  boton.disabled = false;
  boton.textContent = rotuloOriginal;

  const archivo = imagen
    ? new File([imagen], nombreArchivoLamina(c.nombre), { type: 'image/png' })
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

  mostrarSalida(url, imagen, c.nombre);
}

function mostrarSalida(url: string, imagen: Blob | null, conjuntoNombre: string): void {
  const caja = salidaCompartir;
  if (!caja) return;
  caja.replaceChildren();

  void navigator.clipboard
    ?.writeText(url)
    .then(() => {
      caja.prepend(el('p', 'compartir-aviso', LAMINA.copiado));
    })
    .catch(() => {
      // Sin portapapeles: la dirección queda escrita y seleccionable. Nadie queda afuera.
      caja.prepend(el('p', 'link', url));
      caja.prepend(el('p', 'compartir-aviso', LAMINA.aManoTitulo));
    });

  if (!imagen) return;
  const bajar = el('a', 'secundario compartir-bajar', LAMINA.bajarLamina);
  bajar.href = URL.createObjectURL(imagen);
  bajar.download = nombreArchivoLamina(conjuntoNombre);
  bajar.addEventListener('click', () => {
    setTimeout(() => URL.revokeObjectURL(bajar.href), 60_000);
  });
  caja.append(bajar);
}

/* ==================================================================
   La dirección, que siempre dice lo que hay en pantalla
   ================================================================== */

/**
 * Deja el reparto escrito en el fragmento después de cada movimiento.
 *
 * Sin esto, recargar una lista compartida devolvería la lista del que la mandó y no la que
 * el jugador estuvo moviendo, y copiar la dirección de la barra daría cualquier cosa. Va
 * con `replaceState` y no con `pushState`: cada ficha movida no es un paso atrás.
 */
function guardarEnLaDireccion(): void {
  if (!conjunto) return;
  try {
    const url = armarLink(location.origin + location.pathname, {
      forma: 'reparto',
      juego: JUEGO,
      conjunto: conjunto.id,
      casillas: reparto,
    });
    history.replaceState(null, '', url);
  } catch {
    // Un reparto que no se puede escribir no puede frenar la partida.
  }
}

function limpiarLaDireccion(): void {
  try {
    history.replaceState(null, '', location.pathname);
  } catch {
    /* ídem */
  }
}

/* ==================================================================
   Arranque
   ================================================================== */

/** `Escape` suelta lo que tengas en la mano. Es el único atajo propio del juego. */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || enMano === null) return;
  const ficha = conjunto!.fichas[enMano]!;
  focoPieza = enMano;
  enMano = null;
  pintarTablero();
  decir(PARTIDA.soltaste(ficha.titulo), false);
});

$('empezar').addEventListener('click', pintarEleccion);

/**
 * Si la dirección trae una lista compartida, se abre esa. Si no, la elección.
 *
 * `leerReparto` recibe el catálogo **como función**, que es lo que le permite a
 * `desafio.ts` seguir sin importar nada (`ADR-06.5`). Un fragmento roto, de otra versión o
 * de un conjunto que no existe devuelve `null`, y entonces esto es una visita normal.
 */
const compartido = leerReparto(
  location.href,
  JUEGO,
  (id) => armarConjunto(catalogo, id)?.fichas.length ?? null,
);
if (compartido) abrir(compartido.conjunto, compartido.casillas);
