/**
 * La isla de "Ponelos en fila" (`US-08`). Implementa `UX-23`, con el mazo y las filas
 * propias de `D-69`.
 *
 * ## El mecanismo: te toca una por vez
 *
 * Abajo, en la zona del pulgar, queda **la que sigue**: la ficha grande, con su disco y su
 * tapa. Debajo, un botón por fila. Un toque la manda a esa fila y aparece la próxima. Es lo
 * que vuelve jugable el conjunto de los ciento cinco temas, que con el "tocás una ficha,
 * tocás una fila" de antes eran doscientos diez toques y un salto de pantalla por ficha —
 * el destino casi nunca estaba a la vista junto a la bandeja.
 *
 * Las filas siguen siendo destino: tocar la banda de una fila manda ahí a la que sigue. Y
 * una ficha ya puesta se toca para tomarla: pasa a la mano, el mazo dice "la estás
 * moviendo", y los mismos botones la cambian de fila.
 *
 * ## Por qué no se arrastra
 *
 * **Cero `pointerdown`, cero `touchstart`, cero `setPointerCapture`**: cada ficha, cada fila
 * y cada botón del mazo son `<button type="button">` y todo el juego son sus `click`. El
 * arrastre de HTML5 no dispara con el dedo en ningún motor, y escribir uno a mano son cuatro
 * trampas propias encima de una vía sin arrastre que hay que escribir igual (WCAG 2.5.7,
 * `D-09`, `D-14`). Con botones, el teclado y el lector de pantalla salen gratis.
 *
 * **El arrastre sí existe, pero como agregado y solo donde funciona**: los oyentes de
 * `drag*` llaman a la misma función `ubicar()` que el toque. Si algún día se rompen, el
 * juego se juega igual.
 *
 * ## Regla que atraviesa el archivo, como en las otras islas
 *
 * Nada se escribe con `innerHTML`: todo se arma con `createElement` y `textContent`. Y
 * ninguna cadena visible vive acá — todas salen de `lib/ponelos/copy.ts`, que es lo único
 * que `voz.test.ts` audita. **Los nombres de las filas propias son la excepción que
 * confirma la regla**: los escribe el jugador, entran por `limpiarNombreFila` y se pintan
 * con `textContent`, como todo lo demás.
 */

import {
  vacio,
  ubicar as moverFicha,
  vaciar,
  cuentas,
  restan,
  terminado,
  porFila,
  esValido,
  sacarFila,
  ajustarAFilas,
  entraOtraFila,
  sePuedeSacar,
  type Conjunto,
  type Ficha,
  type Reparto,
} from '../lib/ponelos/tablero.ts';
import { SIN_UBICAR, MAX_FILAS, MIN_FILAS, nombresDeSiempre, sonLasDeSiempre, filasDe } from '../lib/ponelos/filas.ts';
import { armarMazo, sincronizar, primera, saltear, alFrente, mezclar, type Mazo } from '../lib/ponelos/mazo.ts';
import {
  armarConjunto,
  conjuntosOfrecidos,
  ID_TODOS,
  PREFIJO_SORTEO,
  type Catalogo,
  type Resumen,
} from '../lib/ponelos/conjuntos.ts';
import { ELECCION, PARTIDA, LAMINA, IMPRESO } from '../lib/ponelos/copy.ts';
import { claseDisco } from '../lib/tema/paleta.ts';
import { rutaFicha } from '../lib/tapa/pasadas.ts';
import { DISCOS } from '../lib/letra/discos.ts';
import { urlDeFragmento } from '../lib/audio/rutas-de-audio.ts';
import { armarLink, leerReparto, limpiarNombreFila, LARGO_MAX_NOMBRE_FILA } from '../lib/desafio.ts';
import { dibujarLamina } from './lamina.ts';
import { nombreArchivoLamina } from '../lib/ponelos/lamina.ts';
import { duracionDe, estampar, pegar, armarInterruptorDeRuidos } from './jugo.ts';
import { sonarEfecto } from '../lib/audio/efectos.ts';
import { contextoDeAudio, despertarSalida } from '../lib/audio/contexto.ts';
import type { DatosLamina } from '../lib/ponelos/lamina.ts';

/** El nombre del juego en el link (`g=`). Alfabeto de `ADR-02`: minúsculas y guiones. */
const JUEGO = 'ponelos';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const zonaInicio = $('inicio');
const zonaEleccion = $('eleccion');
const zonaTablero = $('tablero');

/** El catálogo de `CTR-13`, más los temas que tienen recorte de audio (`D-69`). */
const catalogo = JSON.parse($('catalogo').textContent ?? '{}') as Catalogo & {
  readonly conAudio?: readonly string[];
};
const conAudio = new Set(catalogo.conAudio ?? []);
const temaPorSlug = new Map(catalogo.temas.map((t) => [t.slug, t]));
const tituloDeDisco = new Map(catalogo.discos.map((d) => [d.slug, d.titulo]));

let conjunto: Conjunto | null = null;
let reparto: Reparto = [];
/** Las filas del tablero, en orden. Su número es la posición (`D-69`). */
let nombres: string[] = [...nombresDeSiempre()];
/** El orden en que se reparte lo que falta (`mazo.ts`). No viaja en el link. */
let mazo: Mazo = [];
/**
 * Una ficha **ya puesta** que el jugador tomó para cambiarla de fila, o `null`. La que
 * sigue del mazo no necesita tomarse: ya está en la mano de entrada.
 */
let enMano: number | null = null;
/** Si la lista llegó por una dirección compartida. Solo cambia lo que dice un renglón. */
let compartida = false;
/** Si las filas se están editando. */
let editando = false;
/** Si el mazo está abierto para elegir cuál sigue, y qué disco filtra. */
let viendoMazo = false;
let filtroDisco: string | null = null;
/** La última ficha que cayó en una fila: se marca hasta la próxima jugada. */
let recien: number | null = null;
/** Lo que se puede deshacer: el tablero y las filas de antes de cada jugada. */
let historia: Array<{ readonly reparto: Reparto; readonly nombres: readonly string[] }> = [];
const HISTORIA_MAX = 300;

let zonaMano: HTMLElement | null = null;

/**
 * Adónde vuelve el foco después de repintar. `null` es "no lo muevas".
 *
 * **Es la pieza más importante del teclado de este juego.** El tablero se rehace entero en
 * cada toque —es la forma más simple de que la pantalla y el reparto no se puedan
 * desincronizar—, y eso tiene un costo que no se ve con el mouse: **el botón que tenía el
 * foco deja de existir**, y el foco se cae al `<body>`. Para quien juega con teclado o con
 * lector de pantalla, eso es el juego entero roto.
 */
let focoPieza: number | null = null;
let focoFila: number | null = null;
let focoSelector: string | null = null;

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

function boton(clase: string, texto: string, alTocar: () => void): HTMLButtonElement {
  const b = el('button', clase, texto) as HTMLButtonElement;
  b.type = 'button';
  b.addEventListener('click', alTocar);
  return b;
}

function mostrar(seccion: HTMLElement): void {
  for (const s of [zonaInicio, zonaEleccion, zonaTablero]) s.hidden = s !== seccion;
  ajustarAireDelMazo();
}

/**
 * El aire de abajo que el mazo pegado le quita a la hoja, puesto en `scroll-padding-bottom`.
 *
 * El mazo tapa los últimos trescientos píxeles de la pantalla mientras se reparte. Sin este
 * aire, el navegador lleva a la vista lo que toma el foco con el teclado (una ficha puesta,
 * la banda de una fila) **justo hasta el borde de abajo, que es detrás del mazo**: el foco
 * existe, pero no se ve (WCAG 2.4.11). Se mide en vez de fijarse, porque el mazo crece con
 * las filas; y se saca cuando el mazo no está pegado (en la computadora, vacío o editando).
 */
function ajustarAireDelMazo(): void {
  const mazoEl = zonaTablero.hidden ? null : zonaTablero.querySelector<HTMLElement>('.mazo');
  const estilo = mazoEl ? getComputedStyle(mazoEl) : null;
  const pegado = mazoEl && estilo && estilo.position === 'sticky' && estilo.bottom !== 'auto';
  document.documentElement.style.scrollPaddingBottom = pegado ? `${mazoEl.offsetHeight + 16}px` : '';
}

window.addEventListener('resize', () => ajustarAireDelMazo());

/** El movimiento que el sistema pidió reducir no se anima: el salto es instantáneo. */
function comoMoverse(): ScrollBehavior {
  return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

/** La ficha que se está por repartir: la tomada, o la primera del mazo. */
function actual(): number | null {
  return enMano ?? primera(mazo);
}

/** Una ficha de tema, y no de disco: la de un disco se llama como su disco. */
function esTema(f: Ficha): boolean {
  return f.slug !== f.disco;
}

/** El nombre de una fila, por su número. */
function nombreDeFila(id: number): string {
  return nombres[id - 1] ?? '';
}

/**
 * Lo que dice la región viva, que es la misma línea que se ve.
 *
 * Una sola región y no dos: el rótulo de lo que tenés en la mano y el aviso de dónde
 * quedó la última ficha **son el mismo renglón** en momentos distintos. Partirlos daría
 * dos avisos por cada toque a quien usa lector de pantalla.
 */
function decir(texto: string, cargada: boolean): void {
  if (!zonaMano) return;
  zonaMano.replaceChildren();
  zonaMano.classList.toggle('mano--cargada', cargada);
  if (cargada) zonaMano.append(el('span', 'mano-rotulo', PARTIDA.enLaMano));
  zonaMano.append(el('span', 'mano-dice', texto));
}

/* ==================================================================
   Lo que se guarda en este navegador (`D-69`)

   Dos cosas, y las dos son comodidad de quien juega, no estado del sitio: las filas que se
   armó, para no volver a escribirlas en cada conjunto, y **una partida por conjunto**, para
   seguirla otro día. Una por conjunto y no una sola: con un solo lugar, mover una ficha en
   "Los diez discos" borraba sesenta temas repartidos en "Todos los temas", sin aviso. Las
   listas que llegaron por un link no se guardan: son de otro, y pisarían la propia del mismo
   conjunto. Todo con `try`: en una ventana privada o con el almacenamiento bloqueado, el
   juego se juega igual y simplemente no se acuerda.
   ================================================================== */

const CLAVE_FILAS = 'ponelos:filas';
const CLAVE_PARTIDAS = 'ponelos:partidas';
/** Cuántas partidas se recuerdan. Las sorteadas tienen ids infinitos: sin techo, no se borrarían nunca. */
const PARTIDAS_MAX = 8;

function leerGuardado(clave: string): unknown {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo ? (JSON.parse(crudo) as unknown) : null;
  } catch {
    return null;
  }
}

function escribirGuardado(clave: string, valor: unknown): void {
  try {
    if (valor === null) localStorage.removeItem(clave);
    else localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Sin almacenamiento: se juega igual.
  }
}

/**
 * Unos nombres de fila que vienen de afuera del código, ya limpios, o `null`.
 *
 * Lo guardado se trata igual que lo que llega por el link: lo pudo haber tocado cualquiera
 * con las herramientas del navegador, y pasa por la misma lista blanca.
 */
function nombresValidos(crudo: unknown): string[] | null {
  if (!Array.isArray(crudo) || crudo.length < MIN_FILAS || crudo.length > MAX_FILAS) return null;
  const limpios = crudo.map((n) => (typeof n === 'string' ? limpiarNombreFila(n) : ''));
  return limpios.every((n) => n.length > 0) ? limpios : null;
}

function filasGuardadas(): string[] | null {
  return nombresValidos(leerGuardado(CLAVE_FILAS));
}

function guardarFilas(): void {
  escribirGuardado(CLAVE_FILAS, sonLasDeSiempre(nombres) ? null : nombres);
}

interface PartidaGuardada {
  readonly conjunto: Conjunto;
  readonly casillas: Reparto;
  readonly filas: string[];
  readonly cuando: number;
}

type Crudas = Record<string, { casillas?: unknown; filas?: unknown; cuando?: unknown }>;

function partidasCrudas(): Crudas {
  const crudo = leerGuardado(CLAVE_PARTIDAS);
  return crudo && typeof crudo === 'object' && !Array.isArray(crudo) ? (crudo as Crudas) : {};
}

/** La partida guardada de un conjunto, validada como si llegara por un link, o `null`. */
function partidaDe(id: string, crudas: Crudas = partidasCrudas()): PartidaGuardada | null {
  const g = crudas[id];
  if (!g) return null;
  const c = armarConjunto(catalogo, id);
  const filas = nombresValidos(g.filas);
  if (!c || !filas || !esValido(g.casillas, c.fichas.length, filas.length)) return null;
  return { conjunto: c, casillas: g.casillas as Reparto, filas, cuando: typeof g.cuando === 'number' ? g.cuando : 0 };
}

/** ¿Quedó a medias? Ni vacía ni terminada: es la única que vale la pena ofrecer para seguir. */
function aMedias(p: PartidaGuardada): boolean {
  const faltan = restan(p.casillas);
  return faltan > 0 && faltan < p.casillas.length;
}

/** La partida a medias más reciente, para ofrecerla arriba de todo en la elección. */
function ultimaAMedias(): PartidaGuardada | null {
  const crudas = partidasCrudas();
  return (
    Object.keys(crudas)
      .map((id) => partidaDe(id, crudas))
      .filter((p): p is PartidaGuardada => p !== null && aMedias(p))
      .sort((a, b) => b.cuando - a.cuando)[0] ?? null
  );
}

function guardarPartida(): void {
  if (!conjunto || compartida) return;
  const crudas = partidasCrudas();
  crudas[conjunto.id] = { casillas: reparto, filas: nombres, cuando: Date.now() };
  // Las más viejas se olvidan primero.
  const ids = Object.keys(crudas).sort(
    (a, b) => (Number(crudas[b]!.cuando) || 0) - (Number(crudas[a]!.cuando) || 0),
  );
  for (const id of ids.slice(PARTIDAS_MAX)) delete crudas[id];
  escribirGuardado(CLAVE_PARTIDAS, crudas);
}

/* ==================================================================
   Pantalla 1 — qué repartís
   ================================================================== */

/** Una tapa chica, de adorno de identidad y no de premio. Sin texto alternativo: el nombre está al lado. */
function tapita(disco: string, clase: string): HTMLImageElement | null {
  const ruta = rutaFicha(disco);
  if (!ruta) return null;
  const img = el('img', clase);
  img.src = ruta;
  img.alt = '';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.width = 160;
  img.height = 160;
  return img;
}

/** Una pieza de la pantalla que entra un escalón después de la anterior (`.jugo-entra`). */
function entrar<T extends HTMLElement>(n: T, orden: number): T {
  n.classList.add('jugo-entra');
  n.style.setProperty('--orden', String(orden));
  return n;
}

/**
 * El dibujo que acompaña a cada conjunto de los que cruzan discos, hecho con lo que hay
 * adentro (ronda de pulida, 2026-11-19). Nada de íconos: los diez discos parados en la batea,
 * diez lomos con la tinta de cada disco, tres tapas en abanico, un surco con la púa donde
 * arranca o donde termina, y las tres primeras tapas de lo que salió sorteado.
 */
function adornoDeConjunto(r: Resumen): HTMLElement | null {
  const con = (clase: string, hijos: readonly (HTMLElement | null)[]): HTMLElement => {
    const zona = el('span', clase);
    zona.setAttribute('aria-hidden', 'true');
    for (const h of hijos) if (h) zona.append(h);
    return zona;
  };
  if (r.id === ID_TODOS) return con('conjunto-tira', DISCOS.map((d) => tapita(d, 'conjunto-tira-tapa')));
  if (r.id === 'discos') return con('conjunto-lomos', DISCOS.map((d) => el('span', `conjunto-lomo ${claseDisco(d)}`)));
  if (r.id === 'tapas') {
    return con('conjunto-abanico', [DISCOS[1], DISCOS[7], DISCOS[4]].map((d) => tapita(d, 'conjunto-abanico-tapa')));
  }
  if (r.id === 'abren' || r.id === 'cierran') {
    const surco = con(`conjunto-surco conjunto-surco--${r.id}`, [el('span', 'conjunto-surco-galleta'), el('span', 'conjunto-surco-pua')]);
    return surco;
  }
  if (r.id.startsWith(PREFIJO_SORTEO)) {
    const salieron = armarConjunto(catalogo, r.id)?.fichas.slice(0, 3) ?? [];
    return con('conjunto-sorteo', salieron.map((f) => tapita(f.disco, 'conjunto-sorteo-tapa')));
  }
  return null;
}

function pintarEleccion(deLaPila: ReadonlyMap<string, DOMRect> | null = null): void {
  pararEscucha();
  zonaEleccion.replaceChildren();
  zonaEleccion.append(el('h2', 'eleccion-titulo', ELECCION.titulo));

  const ofrecidos = conjuntosOfrecidos(catalogo);
  const lista = el('ul', 'conjuntos');
  let orden = 0;

  // La partida que quedó a medias va arriba de todo: es lo primero que alguien que vuelve
  // quiere ver, y con los ciento cinco es lo más probable.
  const guardada = ultimaAMedias();
  if (guardada) {
    const li = entrar(el('li', 'conjuntos-retomar'), orden++);
    const b = boton('conjunto conjunto--retomar', '', () => abrir(guardada.conjunto.id, null, null, false, b));
    b.append(el('span', 'conjunto-sello', ELECCION.retomar.rotulo));
    b.append(el('span', 'conjunto-titulo', ELECCION.retomar.boton(guardada.conjunto.nombre)));
    b.append(el('span', 'conjunto-dato', ELECCION.retomar.dato(restan(guardada.casillas), guardada.casillas.length)));
    li.append(b);
    lista.append(li);
  }

  /*
   * Los que cruzan discos: tarjetas, cada una con su dibujo. "Todos los temas" va primero y a
   * lo ancho, con los diez discos parados; los demás van de a dos por renglón.
   */
  for (const r of ofrecidos.filter((o) => !o.disco)) {
    const entero = r.id === ID_TODOS;
    const sorteo = r.id.startsWith(PREFIJO_SORTEO);
    const li = entrar(el('li', entero ? 'conjuntos-todos' : sorteo ? 'conjuntos-sorteo' : undefined), orden++);
    const b = boton(['conjunto', entero ? 'conjunto--todos' : sorteo ? 'conjunto--sorteo' : 'conjunto--media'].join(' '), '', () =>
      abrir(r.id, null, null, false, b),
    );
    b.dataset.conjunto = r.id;

    const adorno = adornoDeConjunto(r);
    if (adorno && !entero) b.append(adorno);
    const texto = el('span', 'conjunto-texto');
    texto.append(el('span', 'conjunto-titulo', r.nombre));
    texto.append(el('span', 'conjunto-baja', r.bajada));
    texto.append(el('span', 'conjunto-dato', ELECCION.cuantas(r.cuantas)));
    b.append(texto);
    // En "Todos los temas" los diez discos van abajo del nombre, a lo ancho.
    if (adorno && entero) b.append(adorno);

    li.append(b);
    lista.append(li);
  }
  zonaEleccion.append(lista);

  /*
   * La batea: los diez discos, tapa por tapa, para repartir el tracklist de uno. La tapa es el
   * botón, y el año la ordena; el nombre lo dice el botón a quien no la ve (`aria-label`) y a
   * quien le pasa el mouse por encima (`title`), y la pantalla siguiente lo escribe grande.
   */
  const deDisco = ofrecidos.filter((o) => o.disco);
  if (deDisco.length > 0) {
    // Cuando la pila vuela hasta acá, la batea ya está en su lugar: el vuelo se mide contra ella.
    const batea = deLaPila ? el('section', 'batea') : entrar(el('section', 'batea'), orden++);
    batea.append(el('h3', 'batea-rotulo', ELECCION.batea));
    const discos = el('ul', 'batea-discos');
    for (const r of deDisco) {
      const disco = r.disco!;
      const anio = catalogo.discos.find((d) => d.slug === disco)?.anio ?? 0;
      const li = el('li');
      const b = boton(`batea-disco ${claseDisco(disco)}`, '', () => abrir(r.id, null, null, false, b));
      b.dataset.conjunto = r.id;
      b.setAttribute('aria-label', ELECCION.discoDeLaBatea(r.nombre, anio, r.cuantas));
      b.title = r.nombre;
      const t = tapita(disco, 'batea-tapa');
      if (t) {
        t.dataset.disco = disco;
        // La batea se ve entera de entrada, y la pila de la portada vuela hasta acá: sin espera.
        t.loading = 'eager';
        t.decoding = 'sync';
        b.append(t);
      }
      b.append(el('span', 'batea-anio', String(anio)));
      li.append(b);
      discos.append(li);
    }
    batea.append(discos);
    zonaEleccion.append(batea);
  }

  mostrar(zonaEleccion);
  enfocarTitulo(zonaEleccion, '.eleccion-titulo');
  if (deLaPila) repartirLaPila(deLaPila);
}

/** Dónde está cada tapa de la pila de la portada, para repartirla desde ahí. */
function posesDeLaPila(): Map<string, DOMRect> {
  const poses = new Map<string, DOMRect>();
  for (const img of zonaInicio.querySelectorAll<HTMLElement>('.pila-disco')) {
    if (img.dataset.disco) poses.set(img.dataset.disco, img.getBoundingClientRect());
  }
  return poses;
}

/** La curva del sitio, para los vuelos que arma la isla. */
function curvaDelSitio(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--curva-cinta').trim() || 'linear';
}

/**
 * La pila de la portada se reparte: cada tapa de la batea llega desde donde estaba tirada.
 *
 * No hay un segundo juego de tapas viajando: son las de la batea, que arrancan corridas hasta
 * su lugar en la pila y vuelven al suyo, una atrás de la otra. Solo se anima `transform`, y con
 * movimiento reducido (`--duracion-umbral` en cero) la batea aparece ordenada y listo.
 */
function repartirLaPila(poses: ReadonlyMap<string, DOMRect>): void {
  const ms = duracionDe('--duracion-umbral');
  const escalon = duracionDe('--escalon-umbral') / 2;
  const batea = zonaEleccion.querySelector<HTMLElement>('.batea');
  if (ms <= 0 || !batea) return;
  const curva = curvaDelSitio();
  const vuelos: Animation[] = [];
  batea.querySelectorAll<HTMLElement>('.batea-tapa').forEach((tapa, i) => {
    const de = poses.get(tapa.dataset.disco ?? '');
    if (!de || de.width === 0 || typeof tapa.animate !== 'function') return;
    const a = tapa.getBoundingClientRect();
    if (a.width === 0) return;
    const dx = de.left + de.width / 2 - (a.left + a.width / 2);
    const dy = de.top + de.height / 2 - (a.top + a.height / 2);
    const giro = i % 2 === 0 ? -14 : 11;
    vuelos.push(
      tapa.animate(
        [{ transform: `translate(${dx}px, ${dy}px) rotate(${giro}deg) scale(${de.width / a.width})` }, { transform: 'none' }],
        { duration: ms, delay: i * escalon, easing: curva, fill: 'backwards' },
      ),
    );
  });
  const ultimo = vuelos.at(-1);
  if (!ultimo) return;
  // Mientras vuelan pasan por encima de las tarjetas de arriba: la batea sube un plano.
  batea.classList.add('batea--llega');
  const asentar = (): void => batea.classList.remove('batea--llega');
  ultimo.addEventListener('finish', asentar, { once: true });
  ultimo.addEventListener('cancel', asentar, { once: true });
}

/**
 * Al cambiar de pantalla, el foco va al título de la nueva.
 *
 * Sin esto, el botón que se tocó queda adentro de una sección escondida y el foco se cae al
 * `<body>`: el próximo `Tab` arranca desde el principio de la página y el lector de pantalla
 * no se entera de que cambió la pantalla. **Solo si había un foco que perder**: el que abre
 * un link compartido no tocó nada, y no hay por qué moverle nada.
 */
function enfocarTitulo(zona: HTMLElement, selector: string): void {
  const habia = document.activeElement !== null && document.activeElement !== document.body;
  if (!habia) return;
  const titulo = zona.querySelector<HTMLElement>(selector);
  if (!titulo) return;
  titulo.tabIndex = -1;
  titulo.focus({ preventScroll: true });
}

/* ==================================================================
   Pantalla 2 — el tablero
   ================================================================== */

/**
 * Abre un conjunto. `casillas` en `null` es el conjunto del jugador: **si quedó a medias, se
 * sigue donde quedó** —abrir de nuevo "Todos los temas" no puede tirar sesenta temas
 * repartidos; para empezar de cero está "Desarmala", que se deshace—, y si no, de cero. Con
 * valores, es una lista que llegó por una dirección compartida. `filas` en `null` son las
 * del jugador (las que se armó, o las de siempre).
 */
function abrir(
  id: string,
  casillas: readonly number[] | null,
  filas: readonly string[] | null,
  deAfuera: boolean,
  tocado: HTMLElement | null = null,
): void {
  const c = armarConjunto(catalogo, id);
  if (!c) {
    // Un id que no existe es un link viejo o roto. Se abre la elección, nunca un error.
    pintarEleccion();
    return;
  }
  // Abrir un conjunto es un toque: el audio del sitio se despierta acá, para el golpe de
  // cartón de las fundas (`efectos.ts` solo suena con el contexto ya despierto). El que llega
  // por un link no tocó nada todavía; para él se despierta en la primera ficha que reparta.
  if (tocado) void despertarSalida();
  // De dónde sale la primera carta: la tapa que se tocó en la batea, o la primera del dibujo.
  const tapaTocada = tocado?.querySelector<HTMLElement>('img')?.getBoundingClientRect() ?? null;
  conjunto = c;
  variosDiscos = new Set(c.fichas.map((f) => f.disco)).size > 1;
  const propia = casillas === null && !deAfuera ? partidaDe(id) : null;
  const seguir = propia && aMedias(propia) ? propia : null;
  nombres = [...(filas ?? seguir?.filas ?? filasGuardadas() ?? nombresDeSiempre())];
  const base = casillas ?? seguir?.casillas ?? null;
  reparto = base ? ajustarAFilas(base, nombres.length) : vacio(c.fichas.length);
  mazo = armarMazo(reparto);
  compartida = deAfuera;
  enMano = null;
  editando = false;
  viendoMazo = false;
  filtroDisco = null;
  recien = null;
  historia = [];
  cartaAnterior = null;
  pintarTablero();
  mostrar(zonaTablero);
  zonaTablero.scrollIntoView({ block: 'start' });
  enfocarTitulo(zonaTablero, '.tablero-titulo');
  traerLaTapa(tapaTocada);
  guardarEnLaDireccion();
  // La primera ficha suena apenas aparece. Desde un link no hay gesto todavía, y el
  // navegador la deja muda hasta el primer toque: no es un error, es la regla de la casa.
  seguirEscuchando();
}

/** Si el conjunto abierto cruza discos: entonces cada ficha de tema lleva la tapita del suyo. */
let variosDiscos = false;

/**
 * De la batea al tablero: la tapa que se tocó llega a ser la funda de la primera carta.
 *
 * Mismo recurso que la pila que se reparte: no viaja una copia, es la funda de la carta, que
 * arranca corrida hasta donde estaba la tapa tocada y vuelve a su lugar. Solo `transform`; con
 * movimiento reducido la carta aparece puesta.
 */
function traerLaTapa(desde: DOMRect | null): void {
  const funda = zonaTablero.querySelector<HTMLElement>('.carta-funda');
  const ms = duracionDe('--duracion-umbral');
  if (!desde || desde.width === 0 || !funda || ms <= 0 || typeof funda.animate !== 'function') return;
  const a = funda.getBoundingClientRect();
  if (a.width === 0) return;
  const dx = desde.left + desde.width / 2 - (a.left + a.width / 2);
  const dy = desde.top + desde.height / 2 - (a.top + a.height / 2);
  funda.animate(
    [{ transform: `translate(${dx}px, ${dy}px) rotate(-6deg) scale(${desde.width / a.width})` }, { transform: 'none' }],
    { duration: ms, easing: curvaDelSitio(), fill: 'backwards' },
  );
}

/** Guarda lo de antes de una jugada, para poder deshacerla. */
function anotar(): void {
  historia.push({ reparto, nombres: [...nombres] });
  if (historia.length > HISTORIA_MAX) historia.shift();
}

/**
 * Una ficha, como botón. Es la única forma que tiene el jugador de tocarla.
 *
 * **La clase se llama `pieza` y no `ficha`, y eso no es capricho:** `.ficha` ya existe en
 * `sitio.css` y es la tarjeta lateral de un artículo de la Redondopedia. Dos componentes
 * distintos con el mismo nombre de clase es la misma verdad duplicada que este proyecto
 * evita en todos lados.
 */
function pintarFicha(indice: number, ficha: Ficha, fila: number, alTocar: () => void): HTMLButtonElement {
  const puesta = fila !== SIN_UBICAR;
  const b = el(
    'button',
    [
      'pieza',
      claseDisco(ficha.disco),
      puesta ? 'pieza--puesta' : '',
      // En el conjunto que se mira, la pieza puesta es la tapa sola (el nombre queda para el lector).
      ficha.imagen && conjunto?.formato === 'tapa' ? 'pieza--tapa' : '',
      enMano === indice ? 'pieza--en-mano' : '',
      recien === indice ? 'pieza--recien' : '',
    ]
      .filter(Boolean)
      .join(' '),
  ) as HTMLButtonElement;
  b.type = 'button';
  b.dataset.i = String(indice);
  b.setAttribute('aria-pressed', String(enMano === indice));

  const nombre = puesta ? PARTIDA.sacarDe(ficha.titulo, nombreDeFila(fila)) : PARTIDA.tomar(ficha.titulo);
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
  } else if (variosDiscos && esTema(ficha)) {
    // Un tema de un conjunto que cruza discos lleva la tapita del suyo (ronda 2 de la pulida):
    // en una fila de cuarenta temas, la tapa se reconoce antes de leer el renglón chico. Son
    // diez imágenes para todo el tablero; el navegador las baja y las decodifica una vez.
    const mini = tapita(ficha.disco, 'pieza-tapa pieza-tapa--mini');
    if (mini) {
      // Sin carga diferida: son diez archivos ya bajados, y vigilar cien imágenes "perezosas"
      // en cada repintado costaba más que pintarlas.
      mini.loading = 'eager';
      b.append(mini);
    }
  }

  const cuerpo = el('span', 'pieza-cuerpo');
  cuerpo.append(el('span', 'pieza-titulo', ficha.titulo));
  // El punto medio separa el renglón chico como en un tracklist, y de paso es la marca
  // que distingue una ficha puesta de una en la bandeja sin depender del tinte (`UX-01`).
  cuerpo.append(el('span', 'pieza-pie', puesta ? `· ${ficha.pie}` : ficha.pie));
  b.append(cuerpo);

  if (enMano === indice) b.append(el('span', 'pieza-mano', PARTIDA.enLaMano));

  b.addEventListener('click', alTocar);

  // El agregado para quien tiene mouse. Con el dedo no dispara nunca, así que no puede
  // romperle el juego a nadie — ver el encabezado.
  b.draggable = true;
  b.addEventListener('dragstart', (e) => {
    // **Acá no se repinta**: repintar destruye el elemento que el navegador está
    // arrastrando y el gesto se cancela solo. Se recuerda a mano y se rehace al soltar.
    arrastrada = indice;
    b.classList.add('pieza--en-mano');
    e.dataTransfer?.setData('text/plain', String(indice));
  });
  b.addEventListener('dragend', () => {
    arrastrada = null;
    b.classList.remove('pieza--en-mano');
  });

  return b;
}

/** La que se está arrastrando con el mouse, o `null`. Solo vive entre `dragstart` y `drop`. */
let arrastrada: number | null = null;

/** Hace de un elemento un lugar donde soltar lo que se arrastra. */
function recibeArrastre(destino: HTMLElement, fila: number): void {
  destino.addEventListener('dragover', (e) => e.preventDefault());
  destino.addEventListener('drop', (e) => {
    e.preventDefault();
    const i = arrastrada ?? actual();
    arrastrada = null;
    if (i !== null) ubicar(i, fila);
  });
}

/** Mueve una ficha y repinta. Es el único camino por el que cambia el reparto. */
function ubicar(indice: number, fila: number): void {
  const c = conjunto!;
  const ficha = c.fichas[indice]!;
  if (reparto[indice] === fila) {
    // Mandarla a donde ya está no es una jugada: se suelta y nada más.
    enMano = null;
    focoFila = fila;
    pintarTablero();
    decir(PARTIDA.soltaste(ficha.titulo), false);
    return;
  }
  // El audio del sitio, despierto para el golpe de cartón (si ya lo estaba, no hace nada).
  void despertarSalida();
  // De dónde sale: la funda de la carta, que es donde está la ficha que se reparte. Se mide
  // antes de rehacer el tablero, porque después esa carta ya es la de la ficha siguiente.
  // (Arrastrando con el mouse se puede soltar una que no es la de la carta: esa no vuela.)
  const funda =
    fila === SIN_UBICAR || actual() !== indice ? null : zonaTablero.querySelector<HTMLElement>('.carta-funda');
  const origen = funda?.getBoundingClientRect() ?? null;
  const imagenDeOrigen = funda?.querySelector('img')?.getAttribute('src') ?? null;

  anotar();
  reparto = moverFicha(reparto, indice, fila, nombres.length);
  enMano = null;
  viendoMazo = false;
  recien = fila === SIN_UBICAR ? null : indice;
  mazo = sincronizar(mazo, reparto);

  /*
   * Adónde va el foco: al mismo botón de fila del mazo. Al que juega con teclado le queda
   * la siguiente ficha arriba y el foco donde estaba, así que repartir es un `Enter` por
   * ficha, o un `Tab` hasta la fila que quiera. Cuando no queda ninguna, el foco se va al
   * botón de compartir, que es lo que sigue.
   */
  const listo = terminado(reparto);
  if (listo) focoSelector = '.lamina .firma';
  else if (fila === SIN_UBICAR) focoSelector = '.reparto-boton';
  else focoFila = fila;

  // La última: las filas se terminan de pegar, una atrás de la otra, una sola vez.
  cerrando = listo;
  pintarTablero();
  cerrando = false;
  guardar();
  seguirEscuchando();

  if (fila !== SIN_UBICAR) {
    // La última no vuela: la hoja baja hasta la lámina en ese mismo momento, y una funda
    // suelta quedaría apuntando a donde la fila ya no está. Apoya, y las filas se pegan.
    llevarALaFila(listo ? null : origen, imagenDeOrigen, ficha);
    // La cuenta que cambió, donde está el pulgar: cae como sello en el botón de esa fila.
    estampar(zonaTablero.querySelector(`.reparto-boton[data-fila="${fila}"] .fila-cuenta`));
  }

  if (fila === SIN_UBICAR) decir(PARTIDA.sacaste(ficha.titulo, restan(reparto)), false);
  else decir(PARTIDA.ubicaste(ficha.titulo, nombreDeFila(fila), restan(reparto)), false);

  // La última: lo que sigue es mirar la lista entera y compartirla.
  if (listo) zonaTablero.querySelector('.lamina')?.scrollIntoView({ block: 'nearest', behavior: comoMoverse() });
}

/** Si el tablero se está pintando justo después de ubicar la última: las filas se pegan. */
let cerrando = false;
/** La ficha que mostraba la carta la última vez que se pintó, para saber si llegó una nueva. */
let cartaAnterior: number | null = null;

/**
 * La ficha viaja de la mano a su fila, y apoya (ronda de pulida, 2026-11-19).
 *
 * El tablero se rehace entero en cada toque, así que no hay una pieza que mover: se mide dónde
 * estaba la funda de la carta **antes** de repintar, y después una copia suelta de esa funda
 * vuela hasta la pieza nueva. Mientras vuela, la pieza de verdad espera escondida; al llegar,
 * apoya torcida y se endereza, la fila acusa el peso y su cuenta cae como sello.
 *
 * **Nada depende de esto**: el reparto ya cambió, la región viva ya lo dijo y la pieza lleva su
 * borde de recién puesta. No frena el toque siguiente (si el tablero se rehace en el medio, la
 * copia llega igual y se borra). Con movimiento reducido no hay vuelo: la pieza aparece puesta.
 * Solo se anima `transform`.
 */
function llevarALaFila(origen: DOMRect | null, imagen: string | null, ficha: Ficha): void {
  const pieza = zonaTablero.querySelector<HTMLElement>('.pieza--recien');
  if (!pieza) return;
  const filaEl = pieza.closest<HTMLElement>('.fila');
  const apoyar = (): void => {
    pieza.classList.remove('pieza--viene');
    pieza.classList.add('pieza--apoya');
    filaEl?.classList.add('fila--recibe');
    estampar(filaEl?.querySelector('.fila-destino .fila-cuenta'));
    // El golpe sordo del cartón contra la batea (ronda 2). Igual en cualquier fila: es peso,
    // no premio. Va detrás del interruptor de los ruidos y no toca lo que suena de la banda.
    sonarEfecto('carton');
  };
  /*
   * Si la pieza cayó donde no se ve —detrás del mazo pegado, o arriba de la ventana—, la hoja
   * se corre lo justo para que la fila quede a la vista (`UX-23` §5.2: `nearest`, nunca un
   * salto que no hace falta). De una, sin deslizar: el vuelo se mide contra donde quedó. El
   * aire de abajo ya lo descuenta `scroll-padding-bottom`, que mide el mazo.
   */
  const mazoEl = zonaTablero.querySelector<HTMLElement>('.mazo');
  const estiloMazo = mazoEl ? getComputedStyle(mazoEl) : null;
  const pegado = mazoEl && estiloMazo?.position === 'sticky' && estiloMazo.bottom !== 'auto';
  const piso = pegado ? mazoEl.getBoundingClientRect().top : window.innerHeight;
  const caja = pieza.getBoundingClientRect();
  if (caja.bottom > piso || caja.top < 0) filaEl?.scrollIntoView({ block: 'nearest' });

  const ms = duracionDe('--duracion-umbral');
  if (!origen || origen.width === 0 || ms <= 0 || typeof pieza.animate !== 'function') {
    apoyar();
    return;
  }
  // Adónde va: a la tapa de la pieza si la tiene, o a su esquina.
  const blanco = (pieza.querySelector<HTMLElement>('.pieza-tapa') ?? pieza).getBoundingClientRect();
  const lado = Math.min(blanco.width, blanco.height);
  const vuelo = el('span', ['pieza-vuelo', claseDisco(ficha.disco)].filter(Boolean).join(' '));
  vuelo.setAttribute('aria-hidden', 'true');
  if (imagen) {
    const img = el('img');
    img.src = imagen;
    img.alt = '';
    vuelo.append(img);
  }
  vuelo.style.left = `${origen.left}px`;
  vuelo.style.top = `${origen.top}px`;
  vuelo.style.width = `${origen.width}px`;
  vuelo.style.height = `${origen.height}px`;
  document.body.append(vuelo);
  pieza.classList.add('pieza--viene');
  const viaje = vuelo.animate(
    [
      { transform: 'translate(0, 0) rotate(-5deg) scale(1)' },
      {
        transform: `translate(${blanco.left - origen.left}px, ${blanco.top - origen.top}px) rotate(0deg) scale(${lado / origen.width})`,
      },
    ],
    { duration: ms, easing: curvaDelSitio(), fill: 'forwards' },
  );
  const llegar = (): void => {
    vuelo.remove();
    apoyar();
  };
  viaje.addEventListener('finish', llegar, { once: true });
  viaje.addEventListener('cancel', llegar, { once: true });
}

/** El toque sobre una ficha puesta: la toma para moverla, o la suelta si ya estaba en la mano. */
function tocarPuesta(indice: number, fila: number): void {
  const ficha = conjunto!.fichas[indice]!;
  if (enMano === indice) {
    enMano = null;
    focoPieza = indice;
    pintarTablero();
    decir(PARTIDA.soltaste(ficha.titulo), false);
    return;
  }
  enMano = indice;
  viendoMazo = false;
  focoFila = fila;
  pintarTablero();
  decir(PARTIDA.tomaste(ficha.titulo), true);
  seguirEscuchando();
}

/** Elegir del mazo abierto: la elegida pasa a ser la que sigue. */
function elegirDelMazo(indice: number): void {
  mazo = alFrente(mazo, indice);
  viendoMazo = false;
  focoSelector = '.reparto-boton';
  pintarTablero();
  decir(PARTIDA.tomaste(conjunto!.fichas[indice]!.titulo), false);
  seguirEscuchando();
}

/**
 * Devuelve el foco adonde corresponde después de rehacer el tablero.
 *
 * **Solo si venía de adentro del tablero**, que es lo que distingue al que está jugando con
 * teclado o con mouse del que toca con el dedo: en táctil el botón no queda enfocado, así
 * que mover el foco ahí no arreglaría nada y de paso haría saltar la hoja en cada ficha.
 */
function devolverElFoco(veniaDeAdentro: boolean): void {
  if (!veniaDeAdentro) return;
  const blanco =
    (focoPieza !== null
      ? zonaTablero.querySelector<HTMLElement>(`.pieza[data-i="${focoPieza}"]`)
      : focoFila !== null
        ? (zonaTablero.querySelector<HTMLElement>(`.reparto-boton[data-fila="${focoFila}"]`) ??
          zonaTablero.querySelector<HTMLElement>(`.fila-destino[data-fila="${focoFila}"]`))
        : focoSelector !== null
          ? zonaTablero.querySelector<HTMLElement>(focoSelector)
          : null) ??
    // Si el blanco no existe en esta pantalla (deshacer con las filas abiertas, donde no hay
    // botones de fila), el foco va al primer lugar que sí exista, en este orden. Nunca al
    // `<body>`: para quien juega con teclado, eso es la partida cortada.
    zonaTablero.querySelector<HTMLElement>('.reparto-boton') ??
    zonaTablero.querySelector<HTMLElement>('.fila-nombre') ??
    zonaTablero.querySelector<HTMLElement>('.tablero-herramientas .herramienta');
  // "Compartí" recibe el foco al cerrar la lista. Si se llegó con el dedo o el mouse, ese foco
  // no dibuja anillo (la misma regla y la misma clase de los otros juegos pulidos).
  if (blanco && conPuntero && blanco.matches('.firma')) {
    blanco.classList.add('seguir--sin-anillo');
    blanco.addEventListener('blur', () => blanco.classList.remove('seguir--sin-anillo'), { once: true });
  }
  blanco?.focus({ preventScroll: blanco.matches('.firma') });
}

/**
 * Si lo último que se tocó fue con el dedo o el mouse y no con el teclado. Un `click` que
 * viene del teclado (o de un guion) trae `detail` en cero.
 */
let conPuntero = false;
document.addEventListener('click', (e) => (conPuntero = e.detail > 0), true);

/* ---- Las herramientas: cambiar las filas, deshacer, mezclar ---- */

function pintarHerramientas(): HTMLElement {
  const zona = el('div', 'tablero-herramientas');

  // Sin `aria-pressed`: el rótulo ya cambia ("Cambiá las filas" / "Listo"), y las dos cosas
  // juntas se anuncian dos veces (el mismo criterio de `D-61` en la pantalla completa).
  const editar = boton(editando ? 'herramienta herramienta--activa' : 'herramienta', editando ? PARTIDA.listoFilas : PARTIDA.cambiaFilas, () => {
    editando = !editando;
    enMano = null;
    focoSelector = editando ? '.fila-nombre' : '.herramienta';
    pintarTablero();
    seguirEscuchando();
    // Al cerrar la edición, los nombres quedan estampados en sus pestañas: caen como sello,
    // todos a la vez, y si alguno cambió suena el sello de goma.
    if (!editando) {
      for (const sello of zonaTablero.querySelectorAll('.fila-sello')) estampar(sello);
      if (huboNombreNuevo) sonarEfecto('sello');
      huboNombreNuevo = false;
    }
  });
  zona.append(editar);

  const sonido = boton('herramienta', sonidoPrendido ? PARTIDA.apagaSonido : PARTIDA.prendeSonido, alternarSonido);
  sonido.dataset.herramienta = 'sonido';
  zona.append(sonido);

  const deshacer = boton('herramienta', PARTIDA.deshace, deshacerJugada);
  deshacer.dataset.herramienta = 'deshacer';
  deshacer.disabled = historia.length === 0;
  zona.append(deshacer);

  if (mazo.length > 2 && !editando) {
    const mezcla = boton('herramienta', PARTIDA.mezcla, () => {
      mazo = mezclar(mazo);
      enMano = null;
      focoSelector = '[data-herramienta="mezcla"]';
      pintarTablero();
      decir(PARTIDA.mezclaste, false);
      seguirEscuchando();
    });
    mezcla.dataset.herramienta = 'mezcla';
    zona.append(mezcla);
  }
  return zona;
}

function deshacerJugada(): void {
  const antes = historia.pop();
  if (!antes) return;
  const cambiaronLasFilas = antes.nombres.join('\n') !== nombres.join('\n');
  // Las que la jugada deshecha había ubicado vuelven **arriba** del mazo, no al fondo: el que
  // deshace quiere volver a ubicar esa misma, no encontrarla dentro de cien fichas.
  const vuelven = antes.reparto.flatMap((v, i) => (v === SIN_UBICAR && reparto[i] !== SIN_UBICAR ? [i] : []));
  reparto = antes.reparto;
  nombres = [...antes.nombres];
  mazo = sincronizar(mazo, reparto);
  for (const i of [...vuelven].reverse()) mazo = alFrente(mazo, i);
  enMano = null;
  recien = null;
  if (cambiaronLasFilas) guardarFilas();
  focoSelector = historia.length > 0 ? '[data-herramienta="deshacer"]' : '.reparto-boton';
  pintarTablero();
  guardar();
  decir(PARTIDA.deshiciste, false);
  seguirEscuchando();
}

/* ---- Las filas propias (`D-69`) ---- */

/**
 * Le cambia el nombre a una fila. **No rehace el tablero**, y es a propósito: renombrar
 * corre en el `change` del campo, que dispara al soltarlo — o sea, justo cuando el dedo
 * ya está tocando otra cosa. Si acá se rehiciera todo, ese toque caería sobre un botón que
 * dejó de existir y se perdería ("Sumá una fila" no sumaba nada). Así que se escribe en su
 * lugar: el campo queda con el nombre limpio y el resto sigue como estaba.
 */
function renombrar(id: number, campo: HTMLInputElement): void {
  const limpio = limpiarNombreFila(campo.value);
  const antes = nombreDeFila(id);
  // Un nombre vacío o igual no cambia nada: vuelve el que estaba.
  campo.value = limpio || antes;
  if (!limpio || limpio === antes) return;
  anotar();
  nombres[id - 1] = limpio;
  campo.closest('.fila')?.querySelector('.fila-sacar')?.setAttribute('aria-label', PARTIDA.sacarAria(limpio));
  zonaTablero.querySelector('[data-herramienta="deshacer"]')?.removeAttribute('disabled');
  guardarFilas();
  guardar();
  decir(PARTIDA.renombraste(limpio), false);
  // El nombre nuevo queda puesto: el campo termina de pegarse, sin rehacer nada.
  huboNombreNuevo = true;
  pegar(campo);
}

/** Si en esta edición se cambió algún nombre: al tocar "Listo", el sello suena. */
let huboNombreNuevo = false;

function sumarFila(): void {
  if (!entraOtraFila(nombres.length)) return;
  anotar();
  const nueva = PARTIDA.filaNueva(nombres.length + 1);
  nombres.push(nueva);
  guardarFilas();
  focoSelector = `.fila-nombre[data-fila="${nombres.length}"]`;
  pintarTablero();
  guardar();
  decir(PARTIDA.sumaste(nueva), false);
  // El cajón nuevo llega torcido y termina de apoyar al final de la batea.
  pegar(zonaTablero.querySelector('.filas > .fila:last-of-type'));
  huboNombreNuevo = true;
}

function sacarFilaDe(id: number): void {
  if (!sePuedeSacar(nombres.length)) return;
  anotar();
  const nombre = nombreDeFila(id);
  const vuelven = reparto.filter((v) => v === id).length;
  reparto = sacarFila(reparto, id, nombres.length);
  nombres.splice(id - 1, 1);
  mazo = sincronizar(mazo, reparto);
  enMano = null;
  recien = null;
  guardarFilas();
  focoSelector = '.fila-nombre';
  pintarTablero();
  guardar();
  decir(PARTIDA.sacasteFila(nombre, vuelven), false);
}

function volverASiempre(): void {
  if (sonLasDeSiempre(nombres)) return;
  anotar();
  nombres = [...nombresDeSiempre()];
  reparto = ajustarAFilas(reparto, nombres.length);
  mazo = sincronizar(mazo, reparto);
  enMano = null;
  recien = null;
  guardarFilas();
  focoSelector = '.fila-nombre';
  pintarTablero();
  guardar();
  decir(PARTIDA.volvisteASiempre, false);
}

/* ---- Las filas ---- */

function pintarFilas(c: Conjunto): HTMLElement {
  const cuenta = cuentas(reparto, nombres.length);
  const listaCerrada = terminado(reparto);
  const filas = el('div', ['filas', editando ? 'filas--editando' : ''].filter(Boolean).join(' '));

  for (const armada of porFila(c, reparto, nombres)) {
    const id = armada.fila.id;
    const seccion = el(
      'section',
      [
        'fila',
        enMano !== null && !editando ? 'fila--abierta' : '',
        // Con la lista cerrada, la fila que quedó vacía se apaga: sigue ahí, con su nombre y su
        // cero, pero de trazo cortado. Una "FILA 5" entera y vacía se veía como algo sin terminar.
        listaCerrada && !editando && (cuenta[id] ?? 0) === 0 ? 'fila--vacia' : '',
      ]
        .filter(Boolean)
        .join(' '),
    );
    // El cierre: con la última ficha puesta, cada fila termina de pegarse, de arriba para abajo.
    if (cerrando) {
      seccion.classList.add('jugo-pega');
      seccion.style.setProperty('--orden', String(id));
    }

    if (editando) {
      const edicion = el('div', 'fila-edicion');
      const campo = el('input', 'fila-nombre');
      campo.type = 'text';
      campo.value = armada.fila.nombre;
      campo.maxLength = LARGO_MAX_NOMBRE_FILA;
      campo.autocomplete = 'off';
      const ultima = id === nombres.length;
      campo.enterKeyHint = ultima ? 'done' : 'next';
      campo.dataset.fila = String(id);
      campo.setAttribute('aria-label', PARTIDA.nombreAria(id));
      campo.addEventListener('change', () => renombrar(id, campo));
      // `Enter` guarda y pasa al nombre siguiente, como un formulario; en el último, a
      // "Listo". Sin esto, el foco se caía al `<body>` con el primer `Enter`.
      campo.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        renombrar(id, campo);
        const siguiente = ultima
          ? zonaTablero.querySelector<HTMLElement>('.tablero-herramientas .herramienta')
          : zonaTablero.querySelector<HTMLElement>(`.fila-nombre[data-fila="${id + 1}"]`);
        siguiente?.focus();
      });
      edicion.append(campo);

      const sacar = boton('fila-sacar', PARTIDA.sacala, () => sacarFilaDe(id));
      sacar.setAttribute('aria-label', PARTIDA.sacarAria(armada.fila.nombre));
      sacar.disabled = !sePuedeSacar(nombres.length);
      edicion.append(sacar);
      seccion.append(edicion);
    } else {
      const destino = el('button', 'fila-destino') as HTMLButtonElement;
      destino.type = 'button';
      destino.dataset.fila = String(id);
      destino.setAttribute('aria-label', PARTIDA.ponerEn(armada.fila.nombre, cuenta[id] ?? 0));
      destino.append(el('span', 'fila-sello', armada.fila.nombre));
      destino.append(el('span', 'fila-cuenta', String(cuenta[id] ?? 0)));
      destino.addEventListener('click', () => {
        const i = actual();
        if (i !== null) ubicar(i, id);
      });
      // El agregado de mouse: soltar sobre la banda hace lo mismo que tocarla.
      recibeArrastre(destino, id);
      seccion.append(destino);
    }

    const lista = el('ul', 'fila-piezas');
    for (const ficha of armada.fichas) {
      const i = c.fichas.indexOf(ficha);
      const li = el('li');
      li.append(pintarFicha(i, ficha, id, () => tocarPuesta(i, id)));
      lista.append(li);
    }
    seccion.append(lista);
    filas.append(seccion);
  }

  if (editando) {
    const pie = el('div', 'filas-edicion');
    pie.append(el('p', 'filas-ayuda', PARTIDA.ayudaFilas));
    const sumar = boton('secundario', PARTIDA.sumaFila, sumarFila);
    sumar.disabled = !entraOtraFila(nombres.length);
    pie.append(sumar);
    const siempre = boton('secundario', PARTIDA.deSiempre, volverASiempre);
    siempre.disabled = sonLasDeSiempre(nombres);
    pie.append(siempre);
    filas.append(pie);
  }
  return filas;
}

/* ---- El mazo: la que sigue, en la zona del pulgar ---- */

/** La tapa que acompaña a la carta: la del dibujo, o la del disco de un tema. */
function tapaDeLaCarta(f: Ficha): string | null {
  if (conjunto?.formato === 'tapa') return f.imagen;
  return esTema(f) ? rutaFicha(f.disco) : null;
}

/** El renglón chico de la carta: el disco y la pista de un tema, o el año de un disco. */
function pieDeLaCarta(f: Ficha): string {
  const tema = esTema(f) ? temaPorSlug.get(f.slug) : undefined;
  if (!tema) return f.pie;
  return PARTIDA.pieDeTema(tituloDeDisco.get(tema.disco) ?? tema.disco, String(tema.pista));
}

/**
 * La carta: el disco que tenés en la mano (ronda de pulida, 2026-11-19).
 *
 * Es una funda con su tapa —o ciega, en el conjunto que se juega sin tapas— y el vinilo que
 * asoma por el costado. **Mientras suena el recorte, el disco sale de la funda y gira**; cuando
 * se corta, vuelve a entrar y queda quieto. Es el único detalle vivo de esta pantalla y está
 * atado a un estado, el de sonar, que además dice el botón ("Pará"). El giro lo prende
 * `marcarEscucha()` con `.carta--suena`, sin rehacer nada.
 *
 * Abajo de la carta asoma lo que queda del mazo: hasta tres fundas más, la pila que se achica.
 */
function pintarCarta(i: number): HTMLElement {
  const f = conjunto!.fichas[i]!;
  const carta = el(
    'div',
    [
      'carta',
      claseDisco(f.disco),
      enMano !== null ? 'carta--moviendo' : '',
      sonando === i ? 'carta--suena' : '',
      // La que recién llega sube desde la pila; la misma carta repintada no se mueve.
      cartaAnterior !== i ? 'carta--llega' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
  cartaAnterior = i;
  carta.draggable = true;
  carta.addEventListener('dragstart', (e) => {
    arrastrada = i;
    e.dataTransfer?.setData('text/plain', String(i));
  });
  carta.addEventListener('dragend', () => {
    arrastrada = null;
  });

  const funda = el('span', 'carta-funda');
  const vinilo = el('span', 'carta-vinilo');
  vinilo.setAttribute('aria-hidden', 'true');
  const cara = el('span', 'carta-vinilo-cara');
  // La veta: dos arcos enfrentados de tinta clara, impresos sobre el surco. Es lo que da vuelta.
  cara.append(el('span', 'carta-vinilo-veta'), el('span', 'carta-vinilo-galleta'));
  vinilo.append(cara);
  funda.append(vinilo);
  const tapa = tapaDeLaCarta(f);
  if (tapa) {
    const img = el('img', 'carta-tapa');
    img.src = tapa;
    img.alt = '';
    img.decoding = 'async';
    img.width = 160;
    img.height = 160;
    funda.append(img);
  } else {
    const ciega = el('span', 'carta-ciega');
    ciega.setAttribute('aria-hidden', 'true');
    funda.append(ciega);
  }
  carta.append(funda);
  const cuerpo = el('div', 'carta-cuerpo');
  cuerpo.append(el('span', 'carta-titulo', f.titulo));
  cuerpo.append(el('span', 'carta-pie', pieDeLaCarta(f)));
  // En una ficha de disco suena uno de sus temas: este renglón dice cuál.
  if (!esTema(f)) {
    const suena = sonando === i && temaSonando ? PARTIDA.suena(temaSonando.titulo) : '';
    cuerpo.append(el('span', 'carta-suena', suena));
  }
  carta.append(cuerpo);
  if (enMano !== null) carta.append(el('span', 'pieza-mano', PARTIDA.enLaMano));
  return carta;
}

function pintarAccionesDeCarta(i: number): HTMLElement {
  const zona = el('div', 'carta-acciones');
  const f = conjunto!.fichas[i]!;

  if (puedeSonar(f)) {
    const b = boton('carta-accion carta-escuchar', '', () => (sonando === i ? pararEscucha() : escuchar(i)));
    rotularEscucha(b, f, sonando === i);
    zona.append(b);
  }

  if (enMano !== null) {
    zona.append(
      boton('carta-accion', PARTIDA.devolvela, () => {
        if (enMano !== null) ubicar(enMano, SIN_UBICAR);
      }),
    );
    zona.append(
      boton('carta-accion', PARTIDA.dejala, () => {
        const t = conjunto!.fichas[enMano!]!.titulo;
        focoPieza = enMano;
        enMano = null;
        pintarTablero();
        decir(PARTIDA.soltaste(t), false);
        seguirEscuchando();
      }),
    );
    return zona;
  }

  if (mazo.length > 1) {
    zona.append(
      boton('carta-accion', PARTIDA.salteala, () => {
        mazo = saltear(mazo, i);
        focoSelector = '.carta-accion:not(.carta-escuchar)';
        pintarTablero();
        decir(PARTIDA.salteaste(f.titulo), false);
        seguirEscuchando();
      }),
    );
    zona.append(
      boton('carta-accion', PARTIDA.elegiOtra, () => {
        // Con el mazo abierto no hay carta ni botón de "Pará": lo que suena se corta acá.
        pararEscucha();
        viendoMazo = true;
        filtroDisco = null;
        focoSelector = '.mazo-abierto button';
        pintarTablero();
      }),
    );
  }
  return zona;
}

/** Un botón por fila, debajo de la carta: un toque y la ficha queda ubicada. */
function pintarBotonesDeFila(i: number): HTMLElement {
  const cuenta = cuentas(reparto, nombres.length);
  const grilla = el('div', 'reparto');
  for (const fila of filasDe(nombres)) {
    const n = cuenta[fila.id] ?? 0;
    const b = el('button', 'reparto-boton') as HTMLButtonElement;
    b.type = 'button';
    b.dataset.fila = String(fila.id);
    b.setAttribute('aria-label', PARTIDA.mandarA(fila.nombre, n));
    b.append(el('span', 'reparto-nombre', fila.nombre));
    b.append(el('span', 'fila-cuenta', String(n)));
    b.addEventListener('click', () => ubicar(i, fila.id));
    recibeArrastre(b, fila.id);
    grilla.append(b);
  }
  return grilla;
}

/** El mazo abierto: todas las que faltan, con un filtro por disco cuando hay más de uno. */
function pintarMazoAbierto(): HTMLElement {
  const c = conjunto!;
  const zona = el('div', 'mazo-abierto');

  const discos = DISCOS.filter((d) => mazo.some((i) => c.fichas[i]!.disco === d));
  if (discos.length > 1) {
    const filtros = el('div', 'mazo-filtros');
    const todos = boton('filtro', PARTIDA.filtroTodos, () => {
      filtroDisco = null;
      focoSelector = '.filtro';
      pintarTablero();
    });
    todos.setAttribute('aria-pressed', String(filtroDisco === null));
    filtros.append(todos);
    for (const d of discos) {
      const titulo = tituloDeDisco.get(d) ?? d;
      const b = boton(`filtro ${claseDisco(d)}`, titulo, () => {
        filtroDisco = d;
        focoSelector = `.filtro[data-disco="${d}"]`;
        pintarTablero();
      });
      b.dataset.disco = d;
      b.setAttribute('aria-pressed', String(filtroDisco === d));
      b.setAttribute('aria-label', PARTIDA.filtroDe(titulo));
      filtros.append(b);
    }
    zona.append(filtros);
  }

  const visibles = mazo.filter((i) => filtroDisco === null || c.fichas[i]!.disco === filtroDisco);
  if (visibles.length === 0) {
    zona.append(el('p', 'bandeja-lista', PARTIDA.filtroVacio));
  } else {
    const lista = el('ul', 'fila-piezas mazo-lista');
    for (const i of visibles) {
      const li = el('li');
      li.append(pintarFicha(i, c.fichas[i]!, SIN_UBICAR, () => elegirDelMazo(i)));
      lista.append(li);
    }
    zona.append(lista);
  }

  zona.append(
    boton('secundario', PARTIDA.volveALaQueSigue, () => {
      viendoMazo = false;
      focoSelector = '.reparto-boton';
      pintarTablero();
    }),
  );
  return zona;
}

function pintarMazo(): HTMLElement {
  const c = conjunto!;
  const i = actual();
  const vacio = i === null;
  const seccion = el(
    'section',
    ['bandeja', 'mazo', vacio ? 'bandeja--vacia' : '', enMano !== null ? 'mazo--moviendo' : '']
      .filter(Boolean)
      .join(' '),
  );

  /*
   * Sin nada en el mazo, el mazo no se dibuja (ronda 2 de la pulida): la caja decía tres veces
   * que no quedaba ninguna, y el cierre ya lo dice con su título y con la lámina. Queda la
   * región viva, escondida a la vista, para que el lector de pantalla escuche dónde cayó la
   * última y que no queda ninguna.
   */
  if (vacio) {
    zonaMano = el('p', 'mano', PARTIDA.completa);
    zonaMano.setAttribute('aria-live', 'polite');
    seccion.append(zonaMano);
    return seccion;
  }

  const rotulo = el('h2', 'bandeja-rotulo');
  rotulo.append(el('span', 'bandeja-sello', enMano !== null ? PARTIDA.laEstasMoviendo : PARTIDA.laQueSigue));
  rotulo.append(el('span', 'fila-cuenta', PARTIDA.quedan(mazo.length, c.fichas.length)));
  seccion.append(rotulo);

  zonaMano = el('p', 'mano');
  zonaMano.setAttribute('aria-live', 'polite');
  seccion.append(zonaMano);

  if (editando) return seccion;
  if (viendoMazo && enMano === null) {
    seccion.append(pintarMazoAbierto());
    return seccion;
  }
  // La carta, arriba de lo que queda del mazo: hasta tres fundas asoman por abajo.
  const pila = el('div', 'mazo-carta');
  const debajo = Math.min(3, enMano !== null ? mazo.length : mazo.length - 1);
  pila.dataset.resto = String(Math.max(0, debajo));
  for (let k = 0; k < 3; k++) {
    const resto = el('span', 'carta-resto');
    resto.setAttribute('aria-hidden', 'true');
    pila.append(resto);
  }
  pila.append(pintarCarta(i));
  seccion.append(pila);
  seccion.append(pintarAccionesDeCarta(i));
  seccion.append(pintarBotonesDeFila(i));
  return seccion;
}

function pintarTablero(): void {
  const c = conjunto!;
  const veniaDeAdentro = zonaTablero.contains(document.activeElement);
  zonaTablero.replaceChildren();

  // La cabecera, en un renglón: el nombre de lo que se reparte y la tecla de los ruidos. (La
  // bajada del conjunto ya se leyó en la elección; acá le sacaba un renglón a las filas.)
  const cab = el('header', 'tablero-cabecera');
  cab.append(el('h2', 'tablero-titulo', c.nombre));
  const ruidos = armarInterruptorDeRuidos({ apagar: PARTIDA.ruidosTecla, prender: PARTIDA.ruidosTecla });
  ruidos.classList.add('ruidos-tecla');
  cab.append(ruidos);
  if (compartida) cab.append(el('p', 'lista--compartida', PARTIDA.llegoCompartida));
  zonaTablero.append(cab);

  zonaTablero.append(pintarHerramientas());
  zonaTablero.append(pintarFilas(c));
  zonaTablero.append(pintarMazo());

  zonaTablero.append(pintarAcciones());
  ajustarAireDelMazo();
  devolverElFoco(veniaDeAdentro);
  focoPieza = null;
  focoFila = null;
  focoSelector = null;
}

/* ==================================================================
   Lo que suena al tocarte una ficha (`D-69`)

   El usuario, textual: *"me gustaría que al seleccionar una canción suene el recorte que
   tenemos para el juego Adiviná el tema. Lo mismo con álbumes, que suenen temas de ese
   álbum"*. Así que **suena solo**: cada vez que te toca una ficha —la que sigue del mazo, una
   que tomaste de una fila, una que elegiste del mazo abierto— suena su recorte de diez
   segundos. Si la ficha es un disco, suena un tema de ese disco, al azar, la carta dice
   cuál, y cuando termina arranca otro del mismo disco ("que en el álbum, si termina el
   recorte, suene otro del mismo álbum").

   Con un `<audio>` y no con Web Audio: acá no hay escalera de una décima que medir, y un
   `<audio>` suena aunque el iPhone tenga la llave de silencio puesta (`D-66`). Todo arranca
   dentro del toque que trae la ficha, que es el gesto que el navegador pide para dejar sonar
   algo; el que llega por un link no tiene ese gesto, y su primera ficha espera al botón.

   **El sonido se apaga desde las herramientas, y se acuerda.** No hay festejo acá (`BR-22`,
   `D-33`): lo único que suena es la banda.
   ================================================================== */

const CLAVE_SONIDO = 'ponelos:sonido';

let audio: HTMLAudioElement | null = null;
/** La ficha que está sonando, o `null`. */
let sonando: number | null = null;
/** El tema que está sonando: el de la ficha, o el que tocó del disco. */
let temaSonando: { readonly slug: string; readonly titulo: string } | null = null;
/** Si suena solo al tocarte una ficha. Prendido salvo que el jugador lo haya apagado. */
let sonidoPrendido = leerGuardado(CLAVE_SONIDO) !== 'no';
/**
 * Qué reproducción está vigente. Una promesa de `play()` que vuelve tarde —porque ya se
 * pidió otro tema— no puede marcar como muda a la que está sonando ahora.
 */
let vueltaAudio = 0;

/** Los temas de un disco que tienen recorte, en el orden del disco. */
function temasConAudioDe(disco: string): readonly { readonly slug: string; readonly titulo: string }[] {
  return catalogo.temas
    .filter((t) => t.disco === disco && conAudio.has(t.slug))
    .sort((a, b) => a.pista - b.pista);
}

/** ¿Esta ficha tiene algo que sonar? Un tema con recorte, o un disco con algún tema que lo tenga. */
function puedeSonar(f: Ficha): boolean {
  return esTema(f) ? conAudio.has(f.slug) : temasConAudioDe(f.disco).length > 0;
}

/**
 * Qué suena para esta ficha. Un tema suena él; un disco, uno de sus temas al azar y nunca el
 * mismo dos veces seguidas, así "Escuchá otro" trae otro de verdad.
 */
function queSuena(f: Ficha): { readonly slug: string; readonly titulo: string } | null {
  if (esTema(f)) return conAudio.has(f.slug) ? { slug: f.slug, titulo: f.titulo } : null;
  const temas = temasConAudioDe(f.disco);
  if (temas.length === 0) return null;
  const otros = temas.length > 1 ? temas.filter((t) => t.slug !== temaSonando?.slug) : temas;
  return otros[Math.floor(Math.random() * otros.length)]!;
}

/**
 * El rótulo del botón de escuchar. **El nombre accesible es el texto visible**, más el
 * título de la ficha para el lector de pantalla: quien maneja la página con la voz dice
 * "Pará" y tiene que encontrar un botón que se llame así (WCAG 2.5.3). Por eso no lleva
 * `aria-label` fijo ni `aria-pressed`: el rótulo cambia, y eso ya dice el estado.
 */
function rotularEscucha(b: HTMLButtonElement, f: Ficha, suena: boolean): void {
  const deDisco = !esTema(f);
  b.replaceChildren(suena ? PARTIDA.parala : deDisco ? PARTIDA.escuchaOtro : PARTIDA.escuchala);
  b.append(el('span', 'solo-lector', `, ${f.titulo}`));
  b.classList.toggle('carta-accion--sonando', suena);
}

/** Pone al día lo que dice la carta sobre lo que suena, sin rehacer el tablero. */
function marcarEscucha(): void {
  const i = actual();
  const suena = sonando !== null && sonando === i;
  const b = zonaTablero.querySelector<HTMLButtonElement>('.carta-escuchar');
  const fb = i !== null ? conjunto?.fichas[i] : undefined;
  if (b && fb) rotularEscucha(b, fb, suena);
  // El disco de la carta sale de la funda y gira mientras suena; cuando se corta, vuelve.
  zonaTablero.querySelector('.carta')?.classList.toggle('carta--suena', suena);
  const renglon = zonaTablero.querySelector<HTMLElement>('.carta-suena');
  if (renglon) {
    const f = i !== null ? conjunto?.fichas[i] : undefined;
    // Solo en las fichas de disco: en una de tema, lo que suena es lo que dice la carta.
    renglon.textContent = suena && temaSonando && f && !esTema(f) ? PARTIDA.suena(temaSonando.titulo) : '';
  }
}

function escuchar(i: number): void {
  const f = conjunto?.fichas[i];
  const tema = f ? queSuena(f) : null;
  if (!tema) return;
  if (!audio) {
    audio = new Audio();
    audio.preload = 'none';
    audio.addEventListener('ended', () => {
      // En una ficha de disco, cuando termina un recorte arranca otro del mismo disco
      // (pedido del usuario): el disco suena mientras lo tenés en la mano. Una de tema
      // suena una vez; el botón la vuelve a pasar.
      const i = sonando;
      const f = i !== null ? conjunto?.fichas[i] : undefined;
      if (i !== null && f && !esTema(f) && i === actual() && !zonaTablero.hidden && !viendoMazo && !editando) {
        escuchar(i);
        return;
      }
      sonando = null;
      marcarEscucha();
    });
  }
  const vuelta = ++vueltaAudio;
  audio.src = urlDeFragmento(tema.slug);
  sonando = i;
  temaSonando = tema;
  void audio.play().catch(() => {
    // El navegador no lo dejó sonar (sin gesto, sin red): el juego sigue mudo, y el botón
    // queda para pedirlo a mano.
    if (vuelta !== vueltaAudio) return;
    sonando = null;
    marcarEscucha();
  });
  marcarEscucha();
}

function pararEscucha(): void {
  vueltaAudio++;
  audio?.pause();
  sonando = null;
  marcarEscucha();
}

/** Al cambiar la ficha que te toca: suena la nueva, si el sonido está prendido. */
function seguirEscuchando(): void {
  const i = actual();
  if (!sonidoPrendido || i === null || editando) {
    if (sonando !== null) pararEscucha();
    return;
  }
  if (sonando === i) return;
  const f = conjunto?.fichas[i];
  if (f && puedeSonar(f)) escuchar(i);
  else if (sonando !== null) pararEscucha();
}

function alternarSonido(): void {
  sonidoPrendido = !sonidoPrendido;
  escribirGuardado(CLAVE_SONIDO, sonidoPrendido ? null : 'no');
  focoSelector = '[data-herramienta="sonido"]';
  pintarTablero();
  seguirEscuchando();
}

// Una pestaña que se esconde no sigue sonando: diez segundos de un tema que no se ve.
document.addEventListener('visibilitychange', () => {
  if (document.hidden && sonando !== null) pararEscucha();
});

/* ==================================================================
   Pantalla 3 — la lámina, que aparece cuando no queda ninguna sin ubicar
   ================================================================== */

let salidaCompartir: HTMLElement | null = null;

/** Lo que la lámina lleva impreso de la lista que está en pantalla, en el idioma de la batea. */
function datosDeLaLamina(c: Conjunto): DatosLamina {
  return {
    juego: IMPRESO.juego,
    conjunto: c.nombre,
    batea: true,
    bandas: porFila(c, reparto, nombres).map((a) => ({
      nombre: a.fila.nombre,
      fichas: a.fichas.length > 0 ? a.fichas.map((f) => f.titulo) : [LAMINA.vacia],
      // Un conjunto que se mira se imprime con las tapas; uno que se lee, con los
      // titulos. Una lista de tapas sin las tapas es la mitad de lo que se ordeno.
      imagenes: a.fichas.map((f) => f.imagen).filter((r): r is string => r !== null),
      cuenta: a.fichas.length,
      // La fila que quedó vacía sale apagada: se dice, no se esconde, y no pesa como las otras.
      vacia: a.fichas.length === 0,
    })),
    repartidas: `${IMPRESO.rotuloCuantas}: ${c.fichas.length - restan(reparto)} / ${c.fichas.length}`,
    // El credito dice lo que hay adentro de ESTA lamina, no lo que suele haber: firmarle
    // a Rocambole una imagen de puro texto seria un rotulo que miente (`D-21`).
    credito: c.formato === 'tapa' ? IMPRESO.creditoConTapas : IMPRESO.creditoSinTapas,
    sitio: location.host + location.pathname,
  };
}

/**
 * La lámina de la lista que está en pantalla, dibujada una sola vez.
 *
 * El tablero se rehace entero en cada toque, y la lámina tarda: se guarda con la lista que
 * retrata (la dirección la dice entera, filas incluidas), y mientras la lista no cambie se usa
 * la misma, para asomarla en el cierre y para compartirla. `null` si no se pudo dibujar: la
 * lámina es el premio, no el camino (`D-14`).
 */
let laminaHecha: { readonly clave: string; readonly imagen: Promise<Blob | null>; url: string; vista: boolean } | null = null;

function laminaDeAhora(c: Conjunto): Promise<Blob | null> {
  let clave: string;
  try {
    clave = linkDeLaLista(c);
  } catch {
    clave = `${c.id}|${reparto.join('')}|${nombres.join('|')}`;
  }
  if (laminaHecha?.clave === clave) return laminaHecha.imagen;
  if (laminaHecha?.url) URL.revokeObjectURL(laminaHecha.url);
  const imagen = dibujarLamina(datosDeLaLamina(c)).catch(() => null);
  laminaHecha = { clave, imagen, url: '', vista: false };
  return imagen;
}

/**
 * El cierre (ronda 2 de la pulida): la misma pieza que los otros juegos pulidos.
 *
 * `.pie-resultado` con la lámina que asoma —lo que vas a compartir se ve antes de tocar—,
 * "Compartí", lo que compartir tenga para decir y la otra vuelta ("Armá otra"). Abajo, en
 * `.salida-resultado`, la cinta de vuelta al fichín y "Desarmala", chica: se deshace, pero no
 * es lo que alguien viene a buscar acá.
 *
 * Se puede compartir sin terminar (`D-14`), así que el pie está siempre, abajo del mazo. El
 * título y la lámina que asoma aparecen cuando no queda ninguna sin ubicar.
 */
function pintarAcciones(): HTMLElement {
  const c = conjunto!;
  const listo = terminado(reparto);
  const zona = el('section', 'lamina');
  if (listo) zona.append(el('h2', cerrando ? 'lamina-titulo jugo-sello' : 'lamina-titulo', LAMINA.titulo));

  const pie = el('div', 'pie-resultado');
  const compartir = el('button', 'primario firma', LAMINA.compartir) as HTMLButtonElement;
  compartir.type = 'button';
  compartir.addEventListener('click', () => void compartirLista(compartir));

  if (listo) {
    const asoma = el('div', 'tarjeta-asoma');
    asoma.setAttribute('aria-hidden', 'true');
    asoma.addEventListener('click', () => compartir.click());
    pie.append(asoma);
    const esta = laminaDeAhora(c);
    void esta.then((imagen) => {
      const hecha = laminaHecha;
      if (!asoma.isConnected || !hecha || hecha.imagen !== esta) return;
      if (!imagen) {
        asoma.remove();
        return;
      }
      hecha.url ||= URL.createObjectURL(imagen);
      // Se pega una vez, cuando llega; el tablero repintado la muestra ya puesta.
      const foto = el('img', hecha.vista ? undefined : 'jugo-pega');
      hecha.vista = true;
      foto.alt = '';
      foto.src = hecha.url;
      asoma.append(foto);
    });
  }
  pie.append(compartir);

  salidaCompartir = el('div', 'compartir-salida');
  salidaCompartir.setAttribute('aria-live', 'polite');
  pie.append(salidaCompartir);

  const otra = el('button', 'secundario', LAMINA.denuevo) as HTMLButtonElement;
  otra.type = 'button';
  otra.addEventListener('click', () => {
    limpiarLaDireccion();
    pintarEleccion();
    zonaEleccion.scrollIntoView({ block: 'start' });
  });
  pie.append(otra);
  zona.append(pie);

  const salidas = el('p', 'salida-resultado salida-resultado--doble');
  const volver = el('a', 'volver', `← ${LAMINA.volver}`);
  volver.href = '/';
  salidas.append(volver);

  const desarmar = el('button', 'desarmar', PARTIDA.desarmar) as HTMLButtonElement;
  desarmar.type = 'button';
  desarmar.disabled = restan(reparto) === reparto.length;
  desarmar.addEventListener('click', () => {
    // Se puede deshacer: desarmar sin preguntar es seguro desde que existe "Deshacé".
    anotar();
    reparto = vaciar(reparto);
    mazo = armarMazo(reparto);
    enMano = null;
    recien = null;
    compartida = false;
    focoSelector = '.reparto-boton';
    pintarTablero();
    guardar();
    seguirEscuchando();
  });
  salidas.append(desarmar);
  zona.append(salidas);

  return zona;
}

/** El link de la lista que está en pantalla, con las filas si son propias (`D-69`). */
function linkDeLaLista(c: Conjunto): string {
  return armarLink(location.origin + location.pathname, {
    forma: 'reparto',
    juego: JUEGO,
    conjunto: c.id,
    casillas: reparto,
    ...(sonLasDeSiempre(nombres) ? {} : { filas: nombres }),
  });
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
  let url: string;
  try {
    url = linkDeLaLista(c);
  } catch {
    // Un nombre de fila que no se puede escribir en el link (llegó roto por otro link): la
    // lista se comparte con la dirección del juego, que abre igual. Nunca un botón mudo.
    url = location.origin + location.pathname;
  }
  const texto = LAMINA.paraCompartir(c.nombre);

  const rotuloOriginal = boton.textContent ?? LAMINA.compartir;
  boton.disabled = true;
  boton.textContent = PARTIDA.armando;

  // La lámina es el premio, no el camino: si no se pudo dibujar llega `null` y se comparte igual.
  // Con la lista cerrada ya está hecha —es la que asoma—; a medias, se dibuja acá.
  const imagen = await laminaDeAhora(c);

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
    history.replaceState(null, '', linkDeLaLista(conjunto));
  } catch {
    // Un reparto que no se puede escribir no puede frenar la partida.
  }
}

/** Después de cada jugada: la dirección y la partida guardada dicen lo mismo que la pantalla. */
function guardar(): void {
  guardarEnLaDireccion();
  guardarPartida();
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

/** `Escape` suelta lo que tengas en la mano, o cierra el mazo abierto. El único atajo propio. */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || !conjunto || zonaTablero.hidden) return;
  if (viendoMazo) {
    viendoMazo = false;
    focoSelector = '.reparto-boton';
    pintarTablero();
    return;
  }
  if (enMano === null) return;
  const ficha = conjunto.fichas[enMano]!;
  focoPieza = enMano;
  enMano = null;
  pintarTablero();
  decir(PARTIDA.soltaste(ficha.titulo), false);
  seguirEscuchando();
});

/**
 * De la portada a la elección: la pila se reparte en la batea. El botón y la pila hacen lo
 * mismo; la pila es el atajo dicho con el objeto del juego.
 */
function empezar(): void {
  const poses = posesDeLaPila();
  pintarEleccion(poses.size > 0 ? poses : null);
  /*
   * El audio del sitio se arma acá, pero **después** de que la pila terminó de repartirse:
   * crear el contexto cuesta un cuadro largo (medido con la CPU ×4: de 130 a 300 ms si cae en
   * el mismo toque), y en ese toque arranca el vuelo. Queda armado y dormido; lo despierta el
   * toque que elige qué repartir, que ya es barato.
   */
  window.setTimeout(() => contextoDeAudio(), DESPUES_DE_LA_PILA_MS);
}
/** Lo que se espera para armar el audio: la pila ya llegó a la batea. Es un reloj, no un tiempo de animación. */
const DESPUES_DE_LA_PILA_MS = 1200;
$('empezar').addEventListener('click', empezar);
// El interruptor de los ruidos, en la portada: apaga el golpe de cartón y nada más.
document
  .getElementById('ruidos')
  ?.append(armarInterruptorDeRuidos({ apagar: PARTIDA.ruidosApagar, prender: PARTIDA.ruidosPrender }));
document.getElementById('pila')?.addEventListener('click', empezar);

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
if (compartido) abrir(compartido.conjunto, compartido.casillas, compartido.filas ?? nombresDeSiempre(), true);
