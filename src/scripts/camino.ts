/**
 * La isla del camino con cruces (`D-73`, séptima vuelta; `D-76`; `D-77`): deslizar de costado es
 * caminar.
 *
 * ## Se avanza para el lado donde se camina (`D-77`)
 *
 * Pedido del usuario: *"en móvil que haya que scrollear para el lado donde avanzás, no para
 * abajo"*. La escena es la página entera y se corre de costado con el dedo, con el scroll del
 * navegador, su inercia y su borde. En la compu, la ruedita (que solo sabe bajar) camina de
 * costado, y las flechas también. La isla no secuestra nada: lee dónde quedó el scroll.
 *
 * Donde hay capas (el monte, la pastura y los seis entornos largos), la escena queda quieta en la
 * pantalla mientras su tira pasa, y la isla corre cada capa a su velocidad (`data-f`): lo lejano
 * despacio, el piso a la par del dedo, lo de adelante más rápido. Un píxel de deslizar es un píxel
 * de caminar. Los cinco recintos de títeres son una sola capa: se corren con el scroll y nada más.
 *
 * Los ojos de lo oscuro se encienden cuando se llega a ellos; el lobo suelto, en su monte, asoma
 * cuando lo tenés cerca y te sigue con la cabeza; en la pastura, el lobo y el cordero viven como
 * en su recinto (`bestiario/pastura.ts`), y cada recinto vive con su controlador
 * (`bestiario/recintos.ts`), el mismo del bestiario. Al final aparece el cruce, con un cartel por
 * región vecina.
 *
 * Tocar un bicho le hace decir su verso; tocarlo de nuevo abre su ficha, que flota encima de la
 * escena sin taparla entera. Lo que abrís queda anotado en el teléfono, con la misma libreta del
 * bestiario.
 *
 * Siempre a pantalla completa, también con movimiento reducido: ahí nada se mueve solo y las capas
 * van juntas. Sin JavaScript, la escena es una tira en el flujo de la página, con la lista abajo.
 *
 * ## El sonido (`D-76`, `D-77`)
 *
 * Se entra con el sonido prendido: el recital de lejos (`bestiario/lejos.ts`) y los ruidos del
 * camino, con los pasos atados a lo caminado (`bestiario/entorno.ts`). El navegador no deja que
 * suene nada antes del primer toque, así que arranca ahí, sin buscar el botón. El botón lo apaga, y
 * apagado queda recordado para la región que sigue.
 */

import { BESTIARIO, CAMINO } from '../lib/bestiario/copy.ts';
// Solo números, como la isla del bestiario: nada que dibuje (`camino.test.ts` lo vigila).
import { ACECHO, ESCALA_LOBO } from '../lib/bestiario/rig.ts';
import { ARMADO } from '../lib/bestiario/recortes.ts';
import { ALTO, corrimiento, type Forma } from '../lib/bestiario/camino.ts';
import { crearRocola } from './rocola.ts';
import { girar, hacia, parpado, partes, suave } from './bestiario/articular.ts';
import { armarPastura } from './bestiario/pastura.ts';
import { armarRecinto, type Raiz, type Vida } from './bestiario/recintos.ts';
import { crearLejos } from './bestiario/lejos.ts';
import { crearEntorno } from './bestiario/entorno.ts';
import { RECETAS } from '../lib/bestiario/sonido.ts';
import { contextoVivo } from '../lib/audio/contexto.ts';
import { Charla } from '../lib/bestiario/charla.ts';
import { crearCamara, transformDe, type Encuadre } from '../lib/bestiario/camara.ts';
import { alSacudon } from './bestiario/sacudon.ts';
import { lugarDeLaFicha, type Lado } from '../lib/bestiario/hoja.ts';

interface Datos {
  region: string;
  forma: Forma;
  /** Todo lo que se recorre, la escena y dónde lo lejano cae detrás del piso, en unidades. */
  ancho: number;
  escena: number;
  foco: number;
  total: number;
  lobo: number | null;
  claro: number | null;
  /** Los recortes del disco que suena de lejos; vacío, el camino no ofrece sonido. */
  lejos: readonly string[];
  bestias: readonly { id: string; nombre: string; dice: string }[];
}

const datos = JSON.parse(document.getElementById('datos-camino')!.textContent!) as Datos;
const bestias = new Map(datos.bestias.map((b) => [b.id, b]));

const camino = document.getElementById('camino')!;
const escenario = document.getElementById('escenario')!;
const tira = document.getElementById('tira')!;
const vista = document.getElementById('vista')!;
const piso = camino.querySelector<SVGSVGElement>('svg.capa')!;
const capas = [...camino.querySelectorAll<HTMLElement>('.capa')].map((el) => ({ el, f: Number(el.dataset.f) }));
const conCapas = capas.some((c) => c.f !== 1);
const cruce = document.getElementById('cruce')!;
const apariciones = [...piso.querySelectorAll<SVGGElement>('.aparece')].map((el) => ({ el, x: Number(el.dataset.x) }));

const hoja = document.getElementById('hoja')!;
const hojaCuerpo = document.getElementById('hoja-cuerpo')!;
const cerrar = document.getElementById('cerrar')!;
const libreta = document.getElementById('libreta')!;
const bocadillo = document.getElementById('bocadillo')!;
const bocadilloVerso = document.getElementById('bocadillo-verso')!;

const rocola = crearRocola();
const movimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
const quieto = (): boolean => movimiento.matches;

/* ------------------------------------------------------------------
   La libreta: la misma del bestiario, así lo anotado en un lado cuenta en el otro
   ------------------------------------------------------------------ */

const CLAVE = 'fichin-bestiario-anotadas';

function leerAnotadas(): Set<string> {
  try {
    const crudo = localStorage.getItem(CLAVE);
    const lista = crudo ? (JSON.parse(crudo) as unknown) : [];
    return new Set(Array.isArray(lista) ? lista.filter((x): x is string => typeof x === 'string') : []);
  } catch {
    return new Set();
  }
}

const anotadas = leerAnotadas();

function pintarLibreta(): void {
  libreta.textContent = anotadas.size ? BESTIARIO.libreta(anotadas.size, datos.total) : BESTIARIO.libretaVacia(datos.total);
}

function pintarAnotada(id: string): void {
  for (const g of piso.querySelectorAll(`.bestia[data-id="${id}"]`)) g.classList.add('bestia--anotada');
  document.getElementById(`b-${id}`)?.classList.add('bestiario-item--anotada');
}

function anotar(id: string): void {
  if (anotadas.has(id)) return;
  anotadas.add(id);
  pintarAnotada(id);
  pintarLibreta();
  try {
    localStorage.setItem(CLAVE, JSON.stringify([...anotadas]));
  } catch {
    // Sin dónde guardar, queda anotada hasta que se cierre la página.
  }
}

/* ------------------------------------------------------------------
   La ficha y el bocadillo
   ------------------------------------------------------------------ */

let volverA: Element | null = null;
/** La bestia de la ficha abierta, o `null`. */
let abierta: string | null = null;

/** La ficha flota encima de la escena (`D-77`): la escena sigue ahí, alrededor. */
function abrir(id: string): void {
  const original = document.querySelector<HTMLElement>(`.bestiario-ficha[data-bestia="${id}"] .bestiario-cuerpo`);
  if (!original) return;
  callar();
  rocola.parar();
  // Abierta desde la lista: la lista se cierra y la ficha vuelve a su botón.
  cerrarLista();
  volverA = document.activeElement;
  const copia = original.cloneNode(true) as HTMLElement;
  copia.querySelector('[data-titulo]')?.setAttribute('id', 'hoja-titulo');
  hojaCuerpo.replaceChildren(copia);
  hoja.hidden = false;
  hoja.scrollTop = 0;
  abierta = id;
  anotar(id);
  ubicarHoja(id);
  cerrar.focus({ preventScroll: true });
}

/** En la compu la ficha va de costado; en el teléfono, a lo ancho (`camino.css`, el corte de 52 rem). */
const fichaDeCostado = window.matchMedia('(min-width: 52rem)');
const LADOS: readonly Lado[] = ['arriba', 'abajo', 'izquierda', 'derecha'];

/**
 * La ficha se abre donde no tapa al bicho (`D-80`, `lib/bestiario/hoja.ts`): arriba o abajo en el
 * teléfono, achicada hasta el lugar libre; de costado en la compu, y si igual no entra, la escena se
 * corre lo justo para que el bicho quede a la vista.
 */
function ubicarHoja(id: string): void {
  const vistaCaja = escenario.getBoundingClientRect();
  // El bicho que se ve: si hay dos con el mismo id (un títere y su sello), el que está en pantalla.
  const candidatos = [...piso.querySelectorAll(`[data-id="${CSS.escape(id)}"]`)].map((el) => el.getBoundingClientRect());
  const bicho = candidatos.find((r) => r.width > 0 && r.right > vistaCaja.left && r.left < vistaCaja.right) ?? candidatos[0];
  hoja.classList.remove(...LADOS.map((l) => `bestiario-hoja--${l}`));
  hoja.style.removeProperty('max-height');
  if (!bicho) return;
  const renglon = document.querySelector<HTMLElement>('.camino-tablero')?.getBoundingClientRect().bottom ?? 0;
  const lugar = lugarDeLaFicha(bicho, vistaCaja, fichaDeCostado.matches, hoja.getBoundingClientRect().width, renglon);
  hoja.classList.add(`bestiario-hoja--${lugar.lado}`);
  if (lugar.alto) hoja.style.maxHeight = `${lugar.alto}px`;
  if (lugar.correr) irA(escenario.scrollLeft + lugar.correr);
}

function cerrarHoja(): void {
  if (hoja.hidden) return;
  rocola.parar();
  lejos.apartar(false);
  hoja.hidden = true;
  abierta = null;
  if (volverA instanceof HTMLElement || volverA instanceof SVGElement) volverA.focus({ preventScroll: true });
}

function escuchar(boton: HTMLButtonElement): void {
  const slug = boton.dataset.escuchar!;
  // Con recorte propio (`D-78`) la clave es la url: el monito y el diablo comparten tema.
  const url = boton.dataset.recorte;
  const clave = url ?? slug;
  const soltar = (): void => {
    boton.classList.remove('bestiario-escuchar--sonando');
    boton.textContent = BESTIARIO.escuchar;
  };
  if (rocola.sonando === clave) {
    rocola.parar();
    soltar();
    lejos.apartar(false);
    return;
  }
  rocola.tocar(
    clave,
    () => {
      soltar();
      lejos.apartar(false);
    },
    url,
  );
  lejos.apartar(true);
  boton.classList.add('bestiario-escuchar--sonando');
  boton.textContent = BESTIARIO.sonando;
}

let hablando: string | null = null;
let callarEn = 0;
/** Dónde estaba la cámara cuando el bicho empezó a hablar: si se camina, el bocadillo se va. */
let camAlHablar = 0;

/**
 * El bicho dice su verso, sin que lo toquen: al pasarle el mouse por arriba, o solo, de vez en
 * cuando (`lib/bestiario/charla.ts`). El bocadillo se cuelga arriba del punto de la pantalla (`sx`, `sy`), o
 * abajo si arriba no entra o si `preferirAbajo` (los títeres grandes, que si no se tapan la cara).
 */
function decir(id: string, sx: number, sy: number, preferirAbajo = false, dura = 8000): void {
  const b = bestias.get(id);
  if (!b) return;
  escenario.append(bocadillo);
  bocadilloVerso.textContent = `«${b.dice}»`;
  bocadillo.hidden = false;
  const caja = escenario.getBoundingClientRect();
  const ancho = bocadillo.offsetWidth;
  const alto = bocadillo.offsetHeight;
  // En coordenadas del contenido del escenario, que se corre de costado.
  const px = sx - caja.left - escenario.clientLeft + escenario.scrollLeft;
  const py = sy - caja.top - escenario.clientTop;
  const desde = escenario.scrollLeft + 6;
  const hasta = escenario.scrollLeft + escenario.clientWidth - ancho - 6;
  const izquierda = Math.min(Math.max(px - ancho / 2, desde), Math.max(hasta, desde));
  // El tablero flota encima de la escena (`D-77`): si arriba del bicho no hay lugar debajo de él,
  // el bocadillo va abajo. Pasaba con los títeres altos: el cartel le tapaba el verso.
  const techo = techoDelTablero(caja, izquierda - escenario.scrollLeft + caja.left + escenario.clientLeft, ancho);
  const abajo = preferirAbajo || py - alto - 14 < techo + 6;
  bocadillo.classList.toggle('bocadillo--abajo', abajo);
  bocadillo.style.left = `${izquierda}px`;
  bocadillo.style.top = `${abajo ? Math.min(py + 40, escenario.clientHeight - alto - 6) : py - alto - 14}px`;
  bocadillo.style.setProperty('--punta', `${Math.min(Math.max(px - izquierda, 16), ancho - 16)}px`);
  hablando = id;
  callarEn = performance.now() + dura;
  camAlHablar = cam;
  for (const g of piso.querySelectorAll('.bestia--elegida')) g.classList.remove('bestia--elegida');
  piso.querySelector(`.bestia[data-id="${id}"]`)?.classList.add('bestia--elegida');
}

/**
 * Tocar un bicho (`D-78`): se abre su ficha y, con el sonido prendido, suena su tema desde el
 * verso. Sin recorte propio suena lo de siempre al tocarlo (el cencerro, la cadena…), no un
 * pedazo cualquiera del tema. Tocarlo de nuevo mientras suena lo para. Todos los toques pasan por
 * acá: los bichos sueltos, el lobo y los títeres, que primero hacen su gesto.
 */
function hablar(id: string, _sx?: number, _sy?: number, _abajo?: boolean): void {
  if (!bestias.has(id)) return;
  const boton = (): HTMLButtonElement | null => hojaCuerpo.querySelector<HTMLButtonElement>('[data-escuchar][data-recorte]');
  if (abierta === id && !hoja.hidden) {
    const b = boton();
    if (b && conSonido()) escuchar(b);
    return;
  }
  abrir(id);
  const b = boton();
  if (b && conSonido()) escuchar(b);
  else if (conSonido()) entorno?.tocar(id);
}

/**
 * Hasta dónde baja el tablero cuando flota encima de la escena, en coordenadas del escenario, si
 * queda de costado sobre el bocadillo (`x` y `ancho`, en pantalla). Si va arriba, en el flujo de la
 * página, o si no se cruzan, no cuenta.
 */
function techoDelTablero(caja: DOMRect, x: number, ancho: number): number {
  const tablero = document.querySelector<HTMLElement>('.camino-tablero');
  if (!tablero || getComputedStyle(tablero).position !== 'fixed') return 0;
  const t = tablero.getBoundingClientRect();
  if (t.right < x || t.left > x + ancho) return 0;
  return Math.max(0, t.bottom - caja.top);
}

function callar(): void {
  bocadillo.hidden = true;
  hablando = null;
  for (const g of piso.querySelectorAll('.bestia--elegida')) g.classList.remove('bestia--elegida');
}

/** De coordenadas de un elemento del dibujo a la pantalla. */
function enPantalla(el: SVGGraphicsElement, x: number, y: number): { x: number; y: number } {
  const p = new DOMPoint(x, y).matrixTransform(el.getScreenCTM()!);
  return { x: p.x, y: p.y };
}

/* ------------------------------------------------------------------
   La cámara: el scroll de costado, pasado a lo que se camina
   ------------------------------------------------------------------ */

/** Píxeles por unidad de escena, el ancho de la tira y el de la vista, en píxeles. */
let escala = 1;
let anchoPx = 0;
let vistaPx = 0;
/** Lo caminado, en píxeles: cuánto se corrió el piso. */
let cam = 0;
/** El paralaje de cada capa, en píxeles: lo que se corre por lo caminado, sin la cámara. */
let corridas: number[] = capas.map(() => 0);
/**
 * El cuerpo de quien camina (`D-80`, `lib/bestiario/camara.ts`): el vaivén de los pasos, la inercia,
 * los sacudones, el retumbo y el arrimarse. Con movimiento reducido no se usa.
 */
const camara = crearCamara(RECETAS[datos.region]?.zancada ?? 85, 0);
let encuadre: Encuadre | null = null;
/** Dónde estaba el piso en el cuadro anterior: lo caminado entre cuadro y cuadro mueve el cuerpo. */
let camEnElCuadro: number | null = null;
alSacudon((fuerza) => camara.sacudir(fuerza));
/** Si las capas se corren cada una a su velocidad (con capas y sin movimiento reducido). */
let paralaje = false;

const recorrido = (): number => Math.max(0, anchoPx - vistaPx);

function medir(): void {
  paralaje = conCapas && !quieto();
  camino.classList.add('camino--andando');
  camino.classList.toggle('camino--paralaje', paralaje);
  document.documentElement.classList.add('camino-pantalla');
  abrirLista.hidden = false;
  const alto = escenario.clientHeight;
  escala = alto / ALTO;
  anchoPx = datos.ancho * escala;
  vistaPx = escenario.clientWidth;
  tira.style.width = `${Math.round(anchoPx)}px`;
  vista.style.width = paralaje ? `${vistaPx}px` : '';
  if (!paralaje) corridas = capas.map(() => 0);
  if (quieto()) {
    encuadre = null;
    for (const c of capas) c.el.style.removeProperty('transform');
  }
}

/**
 * Cada capa, con su paralaje y la cámara encima. Sin paralaje la capa empieza en la punta de la tira,
 * que está corrida `cam` a la izquierda de la vista.
 */
function pintarCapas(): void {
  if (!encuadre && !paralaje) return;
  capas.forEach((c, i) => {
    const corrida = corridas[i]!;
    c.el.style.transform = encuadre ? transformDe(encuadre, paralaje ? 0 : -cam, corrida) : `translate3d(${corrida.toFixed(1)}px, 0, 0)`;
  });
}

/** El retumbo de la ruta: los fierros que pasan cerca del medio de la vista hacen temblar el piso. */
function retumboDeLaRuta(): number {
  if (datos.region !== 'la-ruta') return 0;
  const medio = (cam + vistaPx / 2) / escala;
  let nivel = 0;
  for (const g of piso.querySelectorAll<SVGGElement>('.bestia[data-velocidad]')) {
    const x = Number(g.dataset.ahora ?? g.dataset.x);
    nivel = Math.max(nivel, 1 - Math.abs(x - medio) / 420);
  }
  return Math.max(0, nivel) * 0.8;
}

/** Cuánto de la tira ya se caminó, de 0 a 1. */
const avance = (): number => (recorrido() > 0 ? Math.min(1, cam / recorrido()) : 1);

/**
 * Si el cruce ya está a la vista. En un tramo largo, al final de la caminata, encima del piso.
 * En los demás, cuando la noche del cruce llena casi toda la vista, o cuando no se puede caminar
 * más: así ningún bicho del final queda debajo de los carteles.
 */
function enElCruce(): boolean {
  if (datos.forma === 'largo') return avance() > 0.9;
  const v = vistaPx / escala;
  return cam / escala >= Math.min(datos.escena - 0.1 * v, recorrido() / escala) - 1;
}

function encuadrar(): void {
  cam = escenario.scrollLeft;
  if (paralaje) {
    const focoPx = datos.foco * escala;
    corridas = capas.map((c) => -corrimiento(c.f, cam, focoPx, vistaPx));
  }
  pintarCapas();
  for (const a of apariciones) {
    const x = a.x * escala - cam;
    a.el.classList.toggle('aparece--a-la-vista', x > -20 && x < vistaPx * 0.92);
  }
  const alFinal = enElCruce();
  cruce.classList.toggle('cruce--a-la-vista', alFinal);
  lejos.acercar(avance());
  entorno?.caminar(cam / escala);
  if (hablando && Math.abs(cam - camAlHablar) > 60) callar();
}

/** A dónde quiere llegar la ruedita o el teclado, en píxeles; se llega de a poco. */
let objetivo: number | null = null;

function irA(x: number, deUna = false): void {
  const meta = Math.min(recorrido(), Math.max(0, x));
  if (deUna || quieto()) {
    objetivo = null;
    escenario.scrollLeft = meta;
    encuadrar();
    return;
  }
  objetivo = meta;
  arrancar();
}

/** Trae a la vista algo de la escena que quedó afuera (se llegó con el teclado). */
function traer(el: Element): void {
  const r = el.getBoundingClientRect();
  const caja = escenario.getBoundingClientRect();
  const centro = r.left + r.width / 2;
  if (centro > caja.left + 40 && centro < caja.right - 40) return;
  irA(escenario.scrollLeft + centro - (caja.left + caja.width / 2), true);
}

/** Al cruce: el final de la caminata. */
function alCruce(enfocar: boolean): void {
  irA(recorrido(), true);
  if (enfocar) cruce.querySelector<HTMLElement>('.cartel-cruce')?.focus({ preventScroll: true });
}

/* ------------------------------------------------------------------
   La lista de fichas, abierta encima del camino (`D-76`)
   ------------------------------------------------------------------ */

const abrirLista = document.getElementById('abrir-lista') as HTMLButtonElement;
const lista = document.getElementById('aca-lista')!;
const cerrarListaBoton = document.getElementById('cerrar-lista') as HTMLButtonElement;

function cerrarLista(): void {
  if (!lista.classList.contains('camino-fichas--abierta')) return;
  lista.classList.remove('camino-fichas--abierta');
  cerrarListaBoton.hidden = true;
  abrirLista.setAttribute('aria-expanded', 'false');
  abrirLista.focus({ preventScroll: true });
}

abrirLista.addEventListener('click', () => {
  callar();
  lista.classList.add('camino-fichas--abierta');
  lista.scrollTop = 0;
  cerrarListaBoton.hidden = false;
  abrirLista.setAttribute('aria-expanded', 'true');
  cerrarListaBoton.focus({ preventScroll: true });
});
cerrarListaBoton.addEventListener('click', cerrarLista);

/* ------------------------------------------------------------------
   El sonido: el recital de lejos y los ruidos del camino (`D-76`, `D-77`)
   ------------------------------------------------------------------ */

/** Lo único que se guarda es que se apagó: sin nada guardado, se entra con el sonido prendido. */
const CLAVE_SONIDO = 'fichin-bestiario-sonido';
const lejos = crearLejos(datos.lejos);
const receta = RECETAS[datos.region];
const entorno = receta ? crearEntorno(receta) : null;
const botonSonido = document.getElementById('lejos') as HTMLButtonElement | null;
const suena = document.getElementById('suena');

function quiereSonido(): boolean {
  try {
    return localStorage.getItem(CLAVE_SONIDO) !== '0';
  } catch {
    return true;
  }
}

function recordarSonido(si: boolean): void {
  try {
    if (si) localStorage.removeItem(CLAVE_SONIDO);
    else localStorage.setItem(CLAVE_SONIDO, '0');
  } catch {
    // Sin dónde guardar, la próxima región arranca con el sonido, como siempre.
  }
}

function pintarSonido(si: boolean): void {
  if (!botonSonido) return;
  botonSonido.setAttribute('aria-pressed', String(si));
  botonSonido.textContent = si ? CAMINO.lejos.apagar : CAMINO.lejos.prender;
  if (suena) suena.hidden = !si;
}

async function prenderSonido(): Promise<boolean> {
  const ok = await lejos.prender();
  const ctx = contextoVivo();
  if (!ok || !ctx) return false;
  entorno?.prender(ctx);
  entorno?.caminar(cam / escala);
  return true;
}

function apagarSonido(): void {
  lejos.apagar();
  entorno?.apagar();
}

/** Con el sonido pedido, cada toque lo intenta hasta que el navegador lo deja sonar. */
let pedido = false;

/** Si tocar un bicho hace ruido: lo que dice el botón del camino, o lo último que se eligió. */
function conSonido(): boolean {
  return botonSonido && datos.lejos.length ? pedido : quiereSonido();
}
const GESTOS = ['pointerup', 'touchend', 'keydown', 'click'] as const;

function alTocar(ev: Event): void {
  if ((ev.target as Element | null)?.closest?.('#lejos')) return;
  if (!pedido || lejos.prendido) return soltarGestos();
  void prenderSonido().then((ok) => {
    if (ok) soltarGestos();
  });
}

function esperarGestos(): void {
  for (const g of GESTOS) document.addEventListener(g, alTocar, true);
}

function soltarGestos(): void {
  for (const g of GESTOS) document.removeEventListener(g, alTocar, true);
}

if (botonSonido && datos.lejos.length) {
  botonSonido.hidden = false;
  botonSonido.addEventListener('click', () => {
    if (pedido) {
      pedido = false;
      apagarSonido();
      soltarGestos();
    } else {
      pedido = true;
      void prenderSonido();
    }
    pintarSonido(pedido);
    recordarSonido(pedido);
  });
  // Se entra con el sonido prendido (`D-77`), y sin puerta (`D-78`): se intenta de una, al cargar.
  // Si el navegador lo deja (en la compu, viniendo de otra página del sitio, casi siempre), suena
  // ya; si no (el iPhone nunca deja), arranca con el primer toque, sea donde sea.
  pedido = quiereSonido();
  pintarSonido(pedido);
  if (pedido) {
    esperarGestos();
    void prenderSonido().then((ok) => {
      if (ok) soltarGestos();
    });
  }
}


/* ------------------------------------------------------------------
   El tablero plegado (`D-77`)
   ------------------------------------------------------------------

   Pedido del usuario: *"en móvil se ven muy grandes los textos y tapan a los personajes. Que
   haya para leer solo cuando el usuario quiera"*. Queda el nombre, chico; tocarlo despliega
   la bajada, la libreta y los botones. Caminar un trecho lo vuelve a plegar. */
const tablero = document.getElementById('tablero');
const nombre = tablero?.querySelector('.recinto-nombre');
if (tablero && nombre) {
  const plegar = document.createElement('button');
  plegar.type = 'button';
  plegar.className = 'camino-plegar';
  plegar.setAttribute('aria-expanded', 'false');
  plegar.setAttribute('aria-controls', 'tablero');
  plegar.title = CAMINO.desplegar;
  plegar.textContent = nombre.textContent;
  nombre.replaceChildren(plegar);
  tablero.classList.add('camino-tablero--plegado');
  let camAlAbrir = 0;
  const pintar = (abierto: boolean): void => {
    tablero.classList.toggle('camino-tablero--plegado', !abierto);
    plegar.setAttribute('aria-expanded', String(abierto));
    camAlAbrir = escenario.scrollLeft;
  };
  plegar.addEventListener('click', () => pintar(tablero.classList.contains('camino-tablero--plegado')));
  escenario.addEventListener(
    'scroll',
    () => {
      if (!tablero.classList.contains('camino-tablero--plegado') && Math.abs(escenario.scrollLeft - camAlAbrir) > 240) pintar(false);
    },
    { passive: true },
  );
}

/* ------------------------------------------------------------------
   Los que viven en el camino
   ------------------------------------------------------------------ */

let reloj = 0;

/** Lo que cada escena le pide a la isla: el bocadillo en sus coordenadas, el reloj y la quietud. */
function contexto(marco: SVGGraphicsElement, ancho: number): { hablar(id: string, x: number, y: number, abajo?: boolean): void; quieto(): boolean; reloj(): number; ancho: number } {
  return {
    hablar: (id, x, y, abajo) => {
      const p = enPantalla(marco, x, y);
      hablar(id, p.x, p.y, abajo);
    },
    quieto,
    reloj: () => reloj,
    ancho,
  };
}

/**
 * El lobo suelto en su monte: el busto de la tapa, hundido detrás del borde del piso. Asoma
 * cuando lo tenés cerca, te sigue con la cabeza mientras pasás, y se vuelve a hundir cuando te
 * alejás. Tocado, asoma del todo y se queda mirando.
 */
function armarLoboDelMonte(x: number): { mover(t: number, dt: number): void } {
  const g = piso.querySelector<SVGGElement>('.titere--lobo')!;
  const p = partes(g);
  const AL = ARMADO.lobo;
  const lobo = { alzado: quieto() ? 1 : 0, hasta: -1, parpadeo: 2 };

  const arriba = (): { x: number; y: number } => ({
    x,
    y: ACECHO.piso + (1 - lobo.alzado) * ACECHO.hundido - (AL.piso[1] - 40) * ESCALA_LOBO,
  });

  function pintar(t: number): void {
    const y = ACECHO.piso + (1 - lobo.alzado) * ACECHO.hundido;
    g.setAttribute('transform', `translate(${x} ${y.toFixed(1)}) scale(${ESCALA_LOBO}) translate(${-AL.piso[0]} ${-AL.piso[1]})`);
    const respira = Math.sin(t * 1.7) * 0.012;
    p.get('pecho')?.setAttribute('transform', `translate(${AL.piso[0]} ${AL.piso[1]}) scale(1 ${(1 + respira).toFixed(4)}) translate(${-AL.piso[0]} ${-AL.piso[1]})`);
    const centro = (cam + vistaPx / 2) / escala;
    const ladeo = Math.max(-7, Math.min(7, (centro - x) / 30)) + Math.sin(t * 0.7) * 1.2;
    girar(p.get('cabeza'), ladeo, AL.cabeza, `translate(0 ${(-respira * 300).toFixed(2)}) `);
    if (t > lobo.parpadeo + 0.15) lobo.parpadeo = t + 2.5 + Math.random() * 4;
    const ciega = t > lobo.parpadeo && t < lobo.parpadeo + 0.15 ? 1 : 0;
    parpado(p.get('parpado-1'), ciega);
    parpado(p.get('parpado-2'), ciega);
  }

  const tocar = (): void => {
    lobo.hasta = reloj + 6;
    if (quieto()) {
      lobo.alzado = 1;
      pintar(reloj);
    }
    const a = enPantalla(piso, arriba().x, arriba().y);
    hablar('el-lobo-suelto', a.x, a.y);
  };
  g.addEventListener('click', tocar);
  g.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });
  pintar(0);

  return {
    mover(t, dt) {
      // Cuánto falta para llegar a él, en unidades de escena, desde el medio de la vista.
      const centro = (cam + vistaPx / 2) / escala;
      const cerca = 1 - suave((Math.abs(centro - x) - 140) / 300);
      const meta = t < lobo.hasta ? 1 : cerca;
      lobo.alzado = hacia(lobo.alzado, meta, dt * (meta > lobo.alzado ? 0.7 : 0.9));
      pintar(t);
    },
  };
}

/**
 * La vida del tramo. Los ojos y las cosas viven como en cualquier recinto (`recintos.ts`); el
 * monte suma su lobo; la pastura, el claro del recinto corrido adentro del piso; los entornos y
 * los recintos, el controlador de su recinto.
 */
function armarVida(): Vida {
  if (datos.forma === 'recinto') {
    const marco = piso.querySelector<SVGGElement>('.recinto-en-camino')!;
    return armarRecinto(datos.region, marco, contexto(marco, datos.escena));
  }
  if (datos.forma === 'entorno') return armarRecinto(datos.region, piso, contexto(piso, datos.escena));
  // Los tramos largos: los ojos viven como los del mapa, y encima, los títeres de cada uno.
  const ojos = armarRecinto('', piso, contexto(piso, datos.ancho));
  if (datos.claro !== null) {
    const marco = piso.querySelector<SVGGElement>('.claro')!;
    const pastura = armarPastura(piso, { marco, ...contexto(marco, datos.ancho) });
    return {
      mover: (t, dt) => {
        ojos.mover(t, dt);
        pastura.mover(t, dt);
      },
      reaccionar: (id, t) => {
        if (!pastura.reaccionar(id, t)) ojos.reaccionar(id, t);
      },
    };
  }
  const lobo = datos.lobo !== null ? armarLoboDelMonte(datos.lobo) : null;
  return {
    mover: (t, dt) => {
      ojos.mover(t, dt);
      lobo?.mover(t, dt);
    },
    reaccionar: ojos.reaccionar,
  };
}

const vida = armarVida();

/** Tocar un bicho de los que no son títeres (los títeres tienen sus propios toques). */
function tocarBicho(g: SVGGElement): void {
  const id = g.dataset.id!;
  vida.reaccionar(id, reloj);
  if (quieto()) vida.mover(reloj, 0);
  const x = Number(g.dataset.ahora ?? g.dataset.x);
  const y = Number(g.dataset.y) - 26;
  // Las coordenadas del bicho son las de su escena: la del recinto, o el piso entero.
  const marco = g.closest<SVGGElement>('.recinto-en-camino, .claro') ?? piso;
  const p = enPantalla(marco, x, y);
  hablar(id, p.x, p.y);
}

piso.addEventListener('click', (ev) => {
  const g = (ev.target as Element).closest<SVGGElement>('.bestia');
  if (g) tocarBicho(g);
});

// Tocar cualquier bicho, suelto o títere, arrima la cámara hacia él (`D-80`).
escenario.addEventListener('click', (ev) => {
  if (quieto()) return;
  const g = (ev.target as Element).closest(BICHOS);
  if (!g) return;
  const r = g.getBoundingClientRect();
  const caja = escenario.getBoundingClientRect();
  camara.acercarse(r.left + r.width / 2 - caja.left, r.top + r.height / 2 - caja.top, reloj);
});
piso.addEventListener('keydown', (ev) => {
  const g = (ev.target as Element).closest<SVGGElement>('.bestia');
  if (g && (ev.key === 'Enter' || ev.key === ' ')) {
    ev.preventDefault();
    tocarBicho(g);
  }
});

/* ------------------------------------------------------------------
   El reloj: anda mientras la escena se ve
   ------------------------------------------------------------------ */

let antes = 0;
let corriendo = false;

function cuadro(ahora: number): void {
  const dt = Math.min((ahora - antes) / 1000, 0.05);
  antes = ahora;
  reloj += dt;
  // La ruedita y el teclado llegan de a poco: el scroll se acerca a donde se pidió.
  if (objetivo !== null) {
    const falta = objetivo - escenario.scrollLeft;
    if (Math.abs(falta) < 1) {
      escenario.scrollLeft = objetivo;
      objetivo = null;
    } else escenario.scrollLeft += falta * Math.min(1, dt * 12);
  }
  encuadrar();
  vida.mover(reloj, dt);
  if (!quieto()) {
    // Un salto (ir a un bicho, volver del cruce) no es caminar: no mueve el cuerpo.
    const paso = camEnElCuadro === null ? 0 : (cam - camEnElCuadro) / escala;
    if (Math.abs(paso) < 160) camara.caminar(paso, dt);
    camEnElCuadro = cam;
    camara.retumbar(retumboDeLaRuta());
    encuadre = camara.encuadre(reloj, dt, vistaPx, escenario.clientHeight);
    pintarCapas();
  }
  if (hablando && ahora > callarEn) callar();
  if (!quieto() && document.visibilityState === 'visible') requestAnimationFrame(cuadro);
  else corriendo = false;
}

function arrancar(): void {
  if (corriendo || quieto()) return;
  corriendo = true;
  antes = performance.now();
  requestAnimationFrame(cuadro);
}

document.addEventListener('visibilitychange', arrancar);

let pendiente = 0;
window.addEventListener('resize', () => {
  cancelAnimationFrame(pendiente);
  pendiente = requestAnimationFrame(() => {
    const p = avance();
    medir();
    // Al cambiar el tamaño, se queda en el mismo punto del camino.
    irA(p * recorrido(), true);
    arrancar();
  });
});

movimiento.addEventListener('change', () => {
  medir();
  encuadrar();
  if (quieto()) vida.mover(reloj, 0);
  arrancar();
});

/* ------------------------------------------------------------------
   Caminar: el dedo, la ruedita y el teclado
   ------------------------------------------------------------------ */

// El dedo: el scroll de costado del navegador. La isla solo mira dónde quedó.
escenario.addEventListener(
  'scroll',
  () => {
    if (objetivo === null || Math.abs(objetivo - escenario.scrollLeft) < 1) encuadrar();
  },
  { passive: true },
);
// Si el dedo agarra la escena mientras la ruedita la llevaba, manda el dedo.
escenario.addEventListener('pointerdown', () => (objetivo = null), { passive: true });

/** Lo que flota encima: ahí la ruedita y las flechas son de ellos. */
const encima = (el: Element | null): boolean => !!el?.closest?.('.bestiario-hoja, .camino-fichas--abierta');

// La ruedita sabe bajar: en el camino, bajar es caminar.
document.addEventListener(
  'wheel',
  (ev) => {
    if (ev.ctrlKey || encima(ev.target as Element)) return;
    const unidad = ev.deltaMode === 1 ? 16 : ev.deltaMode === 2 ? vistaPx : 1;
    const dy = ev.deltaY * unidad;
    const dx = ev.deltaX * unidad;
    // De costado (un panel táctil) camina solo, con el scroll del navegador.
    if (Math.abs(dy) <= Math.abs(dx)) return;
    ev.preventDefault();
    irA((objetivo ?? escenario.scrollLeft) + dy);
  },
  { passive: false },
);

document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape') {
    if (!hoja.hidden) cerrarHoja();
    else if (lista.classList.contains('camino-fichas--abierta')) cerrarLista();
    else callar();
    return;
  }
  const el = ev.target as Element;
  if (ev.defaultPrevented || ev.altKey || ev.ctrlKey || ev.metaKey || encima(el) || el.closest('input, textarea, select')) return;
  const boton = el.closest('a, button, [role="button"]');
  const paso = vistaPx * 0.25;
  const hoja_ = vistaPx * 0.8;
  const desde = objetivo ?? escenario.scrollLeft;
  const metas: Record<string, number> = {
    ArrowRight: desde + paso,
    ArrowDown: desde + paso,
    ArrowLeft: desde - paso,
    ArrowUp: desde - paso,
    PageDown: desde + hoja_,
    PageUp: desde - hoja_,
    Home: 0,
    End: recorrido(),
  };
  // La barra espaciadora es de los botones; afuera de ellos, camina como en una página.
  if (ev.key === ' ' && !boton) metas[' '] = desde + (ev.shiftKey ? -hoja_ : hoja_);
  const meta = metas[ev.key];
  if (meta === undefined) return;
  ev.preventDefault();
  irA(meta);
});

/* ------------------------------------------------------------------
   Los toques de la página
   ------------------------------------------------------------------ */

// Con el teclado, lo que recibe el foco adentro de la escena se trae a la vista; el cruce, al
// final de la caminata.
escenario.addEventListener('focusin', (ev) => {
  const el = ev.target as Element;
  if (cruce.contains(el)) {
    if (!cruce.classList.contains('cruce--a-la-vista')) alCruce(false);
  } else if (el.closest('.bestia, .titere')) traer(el);
});

camino.querySelector('.camino-saltar')!.addEventListener('click', (ev) => {
  ev.preventDefault();
  alCruce(true);
});

cerrar.addEventListener('click', cerrarHoja);

document.addEventListener('click', (ev) => {
  const el = ev.target as Element;
  const escucha = el.closest<HTMLButtonElement>('[data-escuchar]');
  if (escucha) {
    escuchar(escucha);
    return;
  }
  // Un vecino de "Anda cerca" que vive en esta página abre su ficha acá; si vive en otra,
  // el enlace lleva a su camino, que la abre al llegar.
  const ir = el.closest<HTMLElement>('[data-ir]');
  if (ir && bestias.has(ir.dataset.ir!)) {
    ev.preventDefault();
    llevarA(ir.dataset.ir!);
    return;
  }
  // Tocar la escena fuera de un bicho calla el bocadillo; tocar afuera de la ficha la cierra.
  if (!bocadillo.hidden && !el.closest('.bocadillo, .bestia, .titere')) callar();
  if (!hoja.hidden && !el.closest('.bestiario-hoja, .bocadillo, .bestia, .titere, .camino-fichas')) cerrarHoja();
});

/** Lleva hasta un bicho de esta página y abre su ficha: lo pide un enlace de otro camino. */
function llevarA(id: string): void {
  const g = piso.querySelector<SVGGElement>(`.bestia[data-id="${id}"], .titere[data-id="${id}"]`);
  if (g) traer(g);
  abrir(id);
}

/* ------------------------------------------------------------------
   El verso sin tocar: el mouse encima, y las que hablan solas (`D-78`)
   ------------------------------------------------------------------ */

const BICHOS = '.bestia[data-id], .titere[data-id]';
/** Las que tienen verso: las otras no tienen nada que decir solas. */
const conVerso = new Set(datos.bestias.filter((b) => b.dice !== BESTIARIO.sinTema).map((b) => b.id));
let conMouse: string | null = null;

/** Dice su verso arriba del dibujo, donde esté. */
function decirArriba(g: Element, dura?: number): void {
  const r = g.getBoundingClientRect();
  decir(g.getAttribute('data-id')!, r.left + r.width / 2, r.top + Math.min(r.height * 0.15, 40), false, dura);
}

piso.addEventListener('pointerover', (ev) => {
  if (ev.pointerType !== 'mouse') return;
  const g = (ev.target as Element).closest(BICHOS);
  const id = g?.getAttribute('data-id');
  if (!g || !id || id === conMouse || !conVerso.has(id) || !hoja.hidden) return;
  conMouse = id;
  decirArriba(g);
});
piso.addEventListener('pointerout', (ev) => {
  if (ev.pointerType !== 'mouse' || !conMouse) return;
  const g = (ev.target as Element).closest(BICHOS);
  if (g && g.contains(ev.relatedTarget as Node | null)) return;
  if (hablando === conMouse) callar();
  conMouse = null;
});

/** De vez en cuando, una de las que se ven dice su verso sola: una de cada cinco que aparecen. */
const charla = new Charla();
window.setInterval(() => {
  if (document.visibilityState !== 'visible') return;
  const caja = escenario.getBoundingClientRect();
  const visibles: string[] = [];
  const porId = new Map<string, Element>();
  for (const g of piso.querySelectorAll(BICHOS)) {
    const id = g.getAttribute('data-id')!;
    if (!conVerso.has(id) || porId.has(id)) continue;
    const r = g.getBoundingClientRect();
    if (r.width && r.left >= caja.left && r.right <= caja.right && r.bottom > caja.top && r.top < caja.bottom) {
      visibles.push(id);
      porId.set(id, g);
    }
  }
  const id = charla.mirar(visibles, performance.now(), !hoja.hidden || !bocadillo.hidden || conMouse !== null);
  if (id) decirArriba(porId.get(id)!, 5000);
}, 700);

/* ------------------------------------------------------------------
   Arranque
   ------------------------------------------------------------------ */

for (const id of anotadas) if (bestias.has(id)) pintarAnotada(id);
pintarLibreta();
medir();
encuadrar();
if (quieto()) vida.mover(0, 0);
requestAnimationFrame(() => {
  // Se llegó al cruce volviendo de la región de al lado (`#cruce`): se aparece al final del
  // camino. Un enlace a un bicho (`#el-lobo-suelto`) lleva hasta él con su ficha abierta.
  const pedido = decodeURIComponent(location.hash.slice(1));
  if (pedido === 'cruce') alCruce(false);
  else if (bestias.has(pedido)) llevarA(pedido);
});
arrancar();
