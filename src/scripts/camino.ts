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
import { contextoVivo, despertarSalida } from '../lib/audio/contexto.ts';
import { Charla } from '../lib/bestiario/charla.ts';
import { PRIMER_PASO, corridaDe, crearCamara, primerPaso, transformDe, type Encuadre } from '../lib/bestiario/camara.ts';
import {
  ACECHOS, AIRE, ALIVIO, LUCES, MIRADA, PASO_PLENO, VIDAS, alfaDeAire, alivioDeEntrada, alivioTras, corridaDeAire, despejeDeLupa, estadoDeLuz, parpadeo, pasoDeVida,
} from '../lib/bestiario/aire.ts';
import { ENTERA, LUPA, acotar, centrar, conLupa, enElMundo, enfocar, entreLentes, type Lente } from '../lib/bestiario/lupa.ts';
import { leerGestos } from './bestiario/pellizco.ts';
import { miradaDe, seguir } from './bestiario/mirada.ts';
import { alSacudon } from './bestiario/sacudon.ts';
import { lugarDeLaFicha, type Lado } from '../lib/bestiario/hoja.ts';
import { reposar, sellar, sellarAnotada } from './bestiario/sellos.ts';

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
  /** A qué altura agranda la cámara; `null`, la de siempre. */
  apoyo: number | null;
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
/** El aire (`D-90`, `lib/bestiario/aire.ts`): cada capa con su receta, y el alfa que tiene pintada. */
const recetasDeAire = new Map((AIRE[datos.region] ?? []).map((c) => [c.pieza, c]));
const aires = [...camino.querySelectorAll<HTMLElement>('.aire')].flatMap((el) => {
  const c = recetasDeAire.get(el.dataset.aire ?? '');
  return c ? [{ el, c, alfa: -1 }] : [];
});
/** Las luces de la región (`LUCES`): la imagen, su receta y el alfa que tiene pintada. */
const recetasDeLuz = new Map((LUCES[datos.region] ?? []).map((l) => [l.pieza, l]));
const luces = [...camino.querySelectorAll<HTMLElement>('.luz')].flatMap((el) => {
  const r = recetasDeLuz.get(el.dataset.luz ?? '');
  return r ? [{ el, r, alfa: -1 }] : [];
});
/** Los ojos sin dueño (`ACECHOS`): se abren si te quedás quieto, y se apagan si los mirás. */
const acecho = ACECHOS[datos.region] ?? null;
const acechoEl = document.getElementById('acecho');
const mira = { abierto: 0, pintado: -1, quiere: false, quietud: 0, proxima: 0, hasta: 0, lugar: -1, x: 0, y: 0 };
/** Lo que cruza lejos (`VIDAS`): de a uno y muy cada tanto. `desde` y `hasta`, en el reloj del camino. */
const loQuePasa = VIDAS[datos.region] ?? null;
const vidaEl = document.getElementById('vida');
const pasa = { desde: -1, hasta: -1, alReves: false, proxima: 0, visible: false };
/** El bicho del que cuelga cada luz que va con uno (los faros del bondi). */
const colgadas = new Map<string, SVGGElement | null>();
/**
 * El alivio (`ALIVIO`): 0, todo; 1, sin la bruma de atrás; 2, sin la luz ni lo que cruza lejos. Sube
 * solo si los cuadros vienen lentos, y un teléfono que ya avisa que es flojo arranca en 1.
 */
const delNavegador = navigator as Navigator & { deviceMemory?: number };
let alivio = alivioDeEntrada(navigator.hardwareConcurrency, delNavegador.deviceMemory);
/**
 * Para mirarlo sin un teléfono flojo: `?liviano=1` o `?liviano=2` en la dirección fuerza ese escalón
 * (y `?liviano=0`, ninguno aunque el teléfono avise que es flojo). Con la bandera puesta no se mide.
 */
const forzado = /^[012]$/.exec(new URLSearchParams(location.search).get('liviano') ?? '')?.[0];
if (forzado !== undefined) alivio = Number(forzado);
const tanda = { cuadros: 0, ms: 0 };

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
  sellar(libreta, 'bestiario-libreta--sella');
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
  const nueva = !anotadas.has(id);
  const copia = original.cloneNode(true) as HTMLElement;
  copia.querySelector('[data-titulo]')?.setAttribute('id', 'hoja-titulo');
  hojaCuerpo.replaceChildren(copia);
  hoja.hidden = false;
  hoja.scrollTop = 0;
  abierta = id;
  anotar(id);
  // Lo anotado se ve donde se anota (`D-83`): el sello y la cuenta, en la hoja.
  sellarAnotada(copia, nueva, anotadas.size, datos.total);
  ubicarHoja(id);
  // La hoja se asienta de nuevo aunque ya estuviera abierta con otro bicho.
  reposar(hoja);
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
    revivirRecital();
    return;
  }
  rocola.tocar(
    clave,
    () => {
      soltar();
      lejos.apartar(false);
      revivirRecital();
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
  reposar(bocadillo);
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
  // Habló alguien (este títere, u otro bicho que se tocó mientras tanto): ya no se espera a nadie.
  esperando = null;
  // El títere que terminó su gesto cuando su ficha ya se había abierto sola: no la abre de nuevo ni
  // corta el tema que está sonando.
  const tarde = adelantadas.get(id);
  if (tarde !== undefined) {
    adelantadas.delete(id);
    if (reloj <= tarde) return;
  }
  abrirYSonar(id);
}

function abrirYSonar(id: string): void {
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
 * Los títeres abren su ficha después de su gesto, y hay gestos largos: el que no se cayó del cielo
 * se cae, se sacude y brinda (casi siete segundos), el del anzuelo pega el tirón, el perro dinamita
 * explota. Pedido del usuario: *"las fichas no molestan"*; esperar tanto parecía que el toque no
 * había andado. Si a los `ESPERA_MAXIMA` segundos el títere todavía no habló, la ficha se abre igual
 * y el gesto sigue detrás, a la vista (la ficha se abre donde no tapa al bicho). Cuando el títere
 * termina y habla, la ficha ya está: esa llamada se traga (`adelantadas`).
 */
const ESPERA_MAXIMA = 1.6;
let esperando: { id: string; hasta: number } | null = null;
/** Las fichas que se abrieron antes que hablara su títere, con hasta cuándo se espera esa llamada. */
const adelantadas = new Map<string, number>();

function esperarAlTitere(id: string): void {
  if (!bestias.has(id) || (abierta === id && !hoja.hidden)) return;
  esperando = { id, hasta: reloj + ESPERA_MAXIMA };
  adelantadas.delete(id);
}

function noEsperarMas(): void {
  if (!esperando || reloj < esperando.hasta) return;
  const { id } = esperando;
  esperando = null;
  if (abierta === id && !hoja.hidden) return;
  adelantadas.set(id, reloj + 15);
  abrirYSonar(id);
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
const camara = crearCamara(RECETAS[datos.region]?.zancada ?? 85, 0, datos.apoyo ?? undefined);
let encuadre: Encuadre | null = null;
/** Dónde estaba el piso en el cuadro anterior: lo caminado entre cuadro y cuadro mueve el cuerpo. */
let camEnElCuadro: number | null = null;
alSacudon((fuerza) => camara.sacudir(fuerza));
/** Si las capas se corren cada una a su velocidad (con capas y sin movimiento reducido). */
let paralaje = false;

/**
 * La lupa (`D-90`, `lib/bestiario/lupa.ts`). Con la lupa en `z`, la tira mide `z` veces su ancho:
 * así un píxel de deslizar sigue siendo un píxel de pantalla, con la lupa que sea, y el scroll del
 * navegador (`D-77`) no se entera de nada. `cam` es siempre lo caminado **sin agrandar**; `lente.x`
 * es lo mismo, y `lente.y`, cuánto se mira para abajo.
 */
let lente: Lente = { ...ENTERA };
let altoPx = 0;
/** El viaje de la lupa (el doble toque, los botones): de dónde a dónde, y desde cuándo. */
let viaje: { desde: Lente; hasta: Lente; t0: number } | null = null;
/** Si hay una lupa pintada en las capas: al sacarla, quieto, hay que despintarla. */
let lupaPintada = false;
/** Cuánto se camina ahora, de 0 a 1, para el aire: sube rápido y baja despacio (la niebla tarda en cerrarse). */
let anda = 0;
/** A cuánto se camina en este cuadro, en unidades por segundo y con signo: lo que cuelga se va para atrás. */
let pasoAhora = 0;

const vistaDe = (): { ancho: number; alto: number } => ({ ancho: vistaPx, alto: altoPx });
const mundoDe = (): { ancho: number; alto: number } => ({ ancho: anchoPx, alto: altoPx });
/** Lo que se puede deslizar, en píxeles de pantalla. */
const recorrido = (): number => Math.max(0, anchoPx * lente.z - vistaPx);
/** El medio de lo que se ve, en unidades de escena. */
const medioDeLaVista = (): number => (cam + vistaPx / (2 * lente.z)) / escala;

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
  altoPx = alto;
  lente = acotar(lente, vistaDe(), mundoDe());
  tira.style.width = `${Math.round(anchoPx * lente.z)}px`;
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
/**
 * Las luces y los ojos sin dueño, en el mismo cuadro que las capas. La luz va clavada en su punto de
 * la escena y se hamaca, late o titila; quieta (con movimiento reducido), queda en su lugar con su alfa.
 */
function pintarLuces(): void {
  const z = lente.z;
  const capaX = paralaje ? 0 : -cam * z;
  for (const l of luces) {
    const e = quieto() ? { giro: 0, alfa: l.r.alfa, escala: 1 } : estadoDeLuz(l.r, reloj);
    // La que cuelga de un bicho que anda (los faros del bondi) va donde está él ahora.
    let ancla = l.r.x;
    if (l.r.sigue) {
      if (!colgadas.has(l.r.sigue)) colgadas.set(l.r.sigue, piso.querySelector<SVGGElement>(`.bestia[data-id="${l.r.sigue}"]`));
      const g = colgadas.get(l.r.sigue);
      ancla += Number(g?.dataset.ahora ?? g?.dataset.x ?? 0);
    }
    const x = ancla * escala - (paralaje ? corrimiento(l.r.f, cam, datos.foco * escala, vistaPx) : 0);
    const y = l.r.y * escala - lente.y;
    const base = encuadre ? transformDe(encuadre, capaX, x, z, y) : corridaDe(x, z, y);
    l.el.style.transform = `${base} rotate(${((l.r.rumbo ?? 0) + e.giro).toFixed(2)}deg) scale(${e.escala.toFixed(3)}) translate(${(l.r.caja[0] * escala).toFixed(1)}px, ${(l.r.caja[1] * escala).toFixed(1)}px)`;
    if (Math.abs(e.alfa - l.alfa) > 0.004) {
      l.alfa = e.alfa;
      l.el.style.opacity = e.alfa.toFixed(3);
    }
  }
  pintarVida(capaX);
  if (!acecho || !acechoEl || mira.lugar < 0) return;
  if (Math.abs(mira.abierto - mira.pintado) > 0.004) {
    mira.pintado = mira.abierto;
    acechoEl.style.opacity = mira.abierto.toFixed(3);
  }
  if (mira.abierto <= 0) return;
  const [fx, alto, tam] = acecho.lugares[mira.lugar]!;
  // En la pantalla: los ojos no caminan con nada. Están donde se abrieron, y si caminás, se cierran.
  mira.x = fx * vistaPx;
  mira.y = alto * escala;
  const x = (paralaje ? 0 : cam) + mira.x;
  const base = encuadre ? transformDe(encuadre, capaX, x, 1, mira.y) : corridaDe(x, 1, mira.y);
  const s = tam * (0.85 + 0.15 * mira.abierto);
  acechoEl.style.transform = `${base} scale(${s.toFixed(3)}, ${(s * parpadeo(reloj, mira.lugar * 13 + 5) * mira.abierto).toFixed(3)}) translate(${((-acecho.ancho / 2) * escala).toFixed(1)}px, ${((-acecho.alto / 2) * escala).toFixed(1)}px)`;
}

/**
 * Lo que cruza lejos: un pájaro, una estrella, un barquito. De a uno, y muy cada tanto: la primera
 * vez tarda la mitad, para que el que se quedó mirando tenga su premio. Con la lupa puesta no cruza
 * (va por la pantalla, no por la escena), y con movimiento reducido el reloj no anda.
 */
function pintarVida(capaX: number): void {
  if (!loQuePasa || !vidaEl) return;
  if (pasa.desde < 0) {
    if (pasa.proxima === 0) pasa.proxima = reloj + (loQuePasa.espera[0] + Math.random() * (loQuePasa.espera[1] - loQuePasa.espera[0])) * 0.5;
    if (reloj < pasa.proxima || conLupa(lente) || quieto() || alivio >= 2) return;
    pasa.desde = reloj;
    pasa.hasta = reloj + loQuePasa.dura[0] + Math.random() * (loQuePasa.dura[1] - loQuePasa.dura[0]);
    pasa.alReves = loQuePasa.deLosDosLados && Math.random() < 0.5;
  }
  const u = (reloj - pasa.desde) / (pasa.hasta - pasa.desde);
  if (u >= 1 || conLupa(lente)) {
    pasa.desde = -1;
    pasa.proxima = reloj + loQuePasa.espera[0] + Math.random() * (loQuePasa.espera[1] - loQuePasa.espera[0]);
    pasa.visible = false;
    vidaEl.style.opacity = '0';
    return;
  }
  if (!pasa.visible) {
    pasa.visible = true;
    vidaEl.style.opacity = String(loQuePasa.alfa);
  }
  const p = pasoDeVida(loQuePasa, u, reloj, pasa.alReves);
  const x = (paralaje ? 0 : cam) + p.fx * vistaPx;
  const base = encuadre ? transformDe(encuadre, capaX, x, 1, p.y * escala) : corridaDe(x, 1, p.y * escala);
  const lado = pasa.alReves ? -loQuePasa.tam : loQuePasa.tam;
  vidaEl.style.transform = `${base} rotate(${p.giro.toFixed(2)}deg) scale(${lado.toFixed(3)}, ${(loQuePasa.tam * p.aleteo).toFixed(3)}) translate(${((-loQuePasa.ancho / 2) * escala).toFixed(1)}px, ${((-loQuePasa.alto / 2) * escala).toFixed(1)}px)`;
}

/** Pone el alivio que toca: las clases las pinta `camino.css`. */
function pintarAlivio(): void {
  camino.classList.toggle('camino--liviano', alivio >= 1);
  camino.classList.toggle('camino--muy-liviano', alivio >= 2);
}

/**
 * Mide una tanda de cuadros y, si vinieron lentos, sube un escalón de alivio. `ms`: lo que tardó
 * este cuadro de verdad, sin el tope del reloj.
 */
function medirAlivio(ms: number): void {
  if (forzado !== undefined || alivio >= ALIVIO.niveles || reloj < 1.5 || ms > 400) return;
  tanda.cuadros++;
  tanda.ms += ms;
  if (tanda.cuadros < ALIVIO.tanda && tanda.ms < ALIVIO.tope) return;
  const antes = alivio;
  alivio = alivioTras(alivio, tanda.ms / tanda.cuadros);
  tanda.cuadros = 0;
  tanda.ms = 0;
  if (alivio !== antes) pintarAlivio();
}

const sortearEspera = (extra = 0): void => {
  if (acecho) mira.proxima = extra + acecho.espera[0] + Math.random() * (acecho.espera[1] - acecho.espera[0]);
};
sortearEspera();

/** Los ojos se cierran y esperan un rato más largo antes de volver, en otro lado. */
function cerrarLosOjos(extra: number): void {
  mira.quiere = false;
  mira.quietud = 0;
  sortearEspera(extra);
}

/**
 * La vida de los ojos sin dueño. `seMueve`: se está caminando en este cuadro. Cualquier cosa que no
 * sea quedarse mirando la escena (caminar, la lupa, una ficha abierta) los cierra y vuelve a cero
 * la cuenta de la quietud.
 */
function moverAcecho(dt: number, seMueve: boolean): void {
  if (!acecho || !acechoEl) return;
  const molesto = seMueve || conLupa(lente) || !hoja.hidden || lista.classList.contains('camino-fichas--abierta') || agarre !== null;
  if (molesto) {
    mira.quietud = 0;
    if (mira.quiere) cerrarLosOjos(3);
  } else mira.quietud += dt;
  if (!mira.quiere && mira.abierto <= 0 && mira.quietud >= mira.proxima) {
    // Otro lugar que el de la última vez.
    const n = acecho.lugares.length;
    mira.lugar = (Math.max(0, mira.lugar) + 1 + Math.floor(Math.random() * (n - 1))) % n;
    mira.quiere = true;
    mira.hasta = reloj + acecho.dura[0] + Math.random() * (acecho.dura[1] - acecho.dura[0]);
  }
  if (mira.quiere && reloj > mira.hasta) cerrarLosOjos(7);
  // Se abren despacio y se cierran de golpe.
  mira.abierto = Math.min(1, Math.max(0, mira.abierto + dt * (mira.quiere ? 1.1 : -5)));
}

/** Si te fijás en ellos, se apagan: un dedo o un mouse cerca alcanza. */
function mirarLosOjos(ev: PointerEvent): void {
  if (!acecho || mira.abierto < 0.2 || !mira.quiere) return;
  const caja = escenario.getBoundingClientRect();
  if (Math.hypot(ev.clientX - caja.left - mira.x, ev.clientY - caja.top - mira.y) < MIRADA) cerrarLosOjos(6);
}
escenario.addEventListener('pointermove', mirarLosOjos, { passive: true });
escenario.addEventListener('pointerdown', mirarLosOjos, { passive: true });

function pintarCapas(): void {
  pintarLuces();
  const lupa = conLupa(lente);
  if (!encuadre && !paralaje && !lupa) {
    // Quieto y sin lupa, las capas van en su lugar. Si venían de una lupa, se despintan.
    if (lupaPintada) {
      for (const c of capas) c.el.style.removeProperty('transform');
      for (const a of aires) a.el.style.removeProperty('transform');
      lupaPintada = false;
    }
    return;
  }
  lupaPintada = lupa;
  const z = lente.z;
  // La capa que viaja con la tira tiene su esquina donde la tira: corrida lo deslizado, en pantalla.
  const capaX = paralaje ? 0 : -cam * z;
  capas.forEach((c, i) => {
    const corrida = corridas[i]!;
    c.el.style.transform = encuadre ? transformDe(encuadre, capaX, corrida, z, -lente.y) : corridaDe(corrida, z, -lente.y);
  });
  // El aire: cada capa a su velocidad, con su viento, y el alfa que respira y se abre al paso.
  const t = quieto() ? 0 : reloj;
  for (const a of aires) {
    const k = corridaDeAire(a.c, cam / escala, t, paralaje);
    const x = quieto() ? 0 : k.x * escala;
    const baja = k.y * escala - lente.y;
    a.el.style.transform = encuadre ? transformDe(encuadre, capaX, x, z, baja) : corridaDe(x, z, baja);
    // Con la lupa uno se mete adentro del aire: lo pegado a la cámara queda atrás, y la niebla afloja.
    const alfa = (quieto() ? a.c.alfa : alfaDeAire(a.c, t, anda)) * despejeDeLupa(a.c.plano, a.c.cae !== 0, z);
    if (Math.abs(alfa - a.alfa) > 0.004) {
      a.alfa = alfa;
      a.el.style.opacity = alfa.toFixed(3);
    }
  }
}

/* ------------------------------------------------------------------
   La lupa (`D-90`)
   ------------------------------------------------------------------ */

const lupa = document.getElementById('lupa');
const lupaTodo = document.getElementById('lupa-todo') as HTMLButtonElement | null;
const lupaMas = document.getElementById('lupa-mas') as HTMLButtonElement | null;
const lupaMenos = document.getElementById('lupa-menos') as HTMLButtonElement | null;

/** Los botones dicen lo que se puede: sin lupa no hay de dónde alejarse, y en el tope no hay más. */
function pintarLupa(): void {
  const puesta = conLupa(lente);
  camino.classList.toggle('camino--lupa', puesta);
  if (lupaTodo) lupaTodo.hidden = !puesta;
  if (lupaMenos) lupaMenos.disabled = !puesta;
  if (lupaMas) lupaMas.disabled = lente.z >= LUPA.max - 0.01;
}

/** Pone la lupa donde se le dice, ya: agranda la tira, acomoda el scroll y pinta. */
function ponerLente(l: Lente): void {
  const antes = lente.z;
  lente = acotar(l, vistaDe(), mundoDe());
  if (lente.z !== antes) {
    tira.style.width = `${Math.round(anchoPx * lente.z)}px`;
    pintarLupa();
  }
  escenario.scrollLeft = lente.x * lente.z;
  // Acercarse no es caminar: que la cámara no cabecee ni suenen pasos.
  camEnElCuadro = null;
  encuadrar();
}

/** Mirar más arriba o más abajo con la lupa puesta, sin tocar el scroll (que es del dedo). */
function mirarA(y: number): void {
  lente = acotar({ ...lente, y }, vistaDe(), mundoDe());
  pintarCapas();
}

/** Lleva la lupa hasta `hasta` de a poco; con movimiento reducido, de una. */
function viajar(hasta: Lente): void {
  paseo = null;
  objetivo = null;
  if (quieto()) {
    viaje = null;
    ponerLente(hasta);
    alLlegarLaLupa();
    return;
  }
  viaje = { desde: { ...lente }, hasta, t0: reloj };
  arrancar();
}

/** Con la lupa en su lugar, la ficha abierta se acomoda de nuevo: el bicho se movió en la pantalla. */
function alLlegarLaLupa(): void {
  if (abierta && !hoja.hidden) ubicarHoja(abierta);
}

/** Un paso de lupa, desde el medio de la vista: los botones y el teclado. */
function pasoDeLupa(factor: number): void {
  const desde = viaje?.hasta ?? lente;
  viajar(enfocar(desde, desde.z * factor, vistaPx / 2, altoPx / 2, vistaDe(), mundoDe()));
}

/** La vuelta: la escena entera, parada donde estaba. */
function mirarTodo(): void {
  viajar(acotar({ z: 1, x: lente.x, y: 0 }, vistaDe(), mundoDe()));
}

lupaMas?.addEventListener('click', () => pasoDeLupa(LUPA.paso));
lupaMenos?.addEventListener('click', () => pasoDeLupa(1 / LUPA.paso));
lupaTodo?.addEventListener('click', mirarTodo);

/** Dónde arrancó el pellizco: la lupa que había y el punto del mundo que quedó entre los dedos. */
let pellizcado: { z: number; mx: number; my: number } | null = null;

leerGestos(escenario, {
  empieza(cx, cy) {
    viaje = null;
    paseo = null;
    objetivo = null;
    agarre = null;
    const caja = escenario.getBoundingClientRect();
    const m = enElMundo(lente, cx - caja.left, cy - caja.top);
    pellizcado = { z: lente.z, mx: m.x, my: m.y };
  },
  pellizco(factor, cx, cy) {
    if (!pellizcado) return;
    const caja = escenario.getBoundingClientRect();
    const z = Math.min(LUPA.max, Math.max(LUPA.min, pellizcado.z * factor));
    // Lo que estaba entre los dedos sigue entre los dedos.
    ponerLente({ z, x: pellizcado.mx - (cx - caja.left) / z, y: pellizcado.my - (cy - caja.top) / z });
  },
  termina() {
    pellizcado = null;
    if (conLupa(lente) && lente.z < LUPA.suelta) mirarTodo();
    else alLlegarLaLupa();
  },
  rueda(factor, x, y) {
    viaje = null;
    const caja = escenario.getBoundingClientRect();
    ponerLente(enfocar(lente, lente.z * factor, x - caja.left, y - caja.top, vistaDe(), mundoDe()));
    if (conLupa(lente) && lente.z < LUPA.suelta && factor < 1) ponerLente({ z: 1, x: lente.x, y: 0 });
  },
  doble(x, y, blanco) {
    // Con la lupa puesta, el doble toque es la vuelta.
    if (lente.z > 1.2) return mirarTodo();
    const caja = escenario.getBoundingClientRect();
    const g = blanco.closest(BICHOS) ?? bichoCerca(x, y);
    if (!g) return viajar(enfocar(lente, LUPA.doble, x - caja.left, y - caja.top, vistaDe(), mundoDe()));
    // Sobre un bicho, la lupa va a él y lo deja en el medio.
    const r = (g.querySelector('.toque') ?? g).getBoundingClientRect();
    const m = enElMundo(lente, r.left + r.width / 2 - caja.left, r.top + r.height / 2 - caja.top);
    viajar(centrar(LUPA.doble, m.x, m.y, vistaDe(), mundoDe()));
  },
});

/** El retumbo de la ruta: los fierros que pasan cerca del medio de la vista hacen temblar el piso. */
function retumboDeLaRuta(): number {
  if (datos.region !== 'la-ruta') return 0;
  const medio = medioDeLaVista();
  let nivel = 0;
  for (const g of piso.querySelectorAll<SVGGElement>('.bestia[data-velocidad]')) {
    const x = Number(g.dataset.ahora ?? g.dataset.x);
    nivel = Math.max(nivel, 1 - Math.abs(x - medio) / 420);
  }
  return Math.max(0, nivel) * 0.8;
}

/** Cuánto de la tira ya se caminó, de 0 a 1. */
const avance = (): number => (recorrido() > 0 ? Math.min(1, (cam * lente.z) / recorrido()) : 1);

/**
 * Si el cruce ya está a la vista. En un tramo largo, al final de la caminata, encima del piso.
 * En los demás, cuando la noche del cruce llena casi toda la vista, o cuando no se puede caminar
 * más: así ningún bicho del final queda debajo de los carteles.
 */
function enElCruce(): boolean {
  if (datos.forma === 'largo') return avance() > 0.9;
  const v = vistaPx / lente.z / escala;
  return cam / escala >= Math.min(datos.escena - 0.1 * v, recorrido() / lente.z / escala) - 1;
}

/**
 * Lee dónde quedó el scroll y acomoda todo. `pintar`: si además pinta las capas. Con el reloj andando
 * no hace falta: el cuadro las pinta una vez, después de mover la cámara (antes se pintaban dos
 * veces por cuadro, y cada pintada es un estilo que el navegador recalcula).
 */
function encuadrar(pintar = true): void {
  cam = escenario.scrollLeft / lente.z;
  lente.x = cam;
  if (paralaje) {
    const focoPx = datos.foco * escala;
    corridas = capas.map((c) => -corrimiento(c.f, cam, focoPx, vistaPx));
  }
  if (pintar) pintarCapas();
  for (const a of apariciones) {
    const x = a.x * escala - cam;
    a.el.classList.toggle('aparece--a-la-vista', x > -20 && x < (vistaPx / lente.z) * 0.92);
  }
  const alFinal = enElCruce();
  cruce.classList.toggle('cruce--a-la-vista', alFinal);
  lejos.acercar(avance());
  entorno?.caminar(cam / escala);
  if (hablando && Math.abs(cam - camAlHablar) > 60) callar();
}

/** A dónde quiere llegar la ruedita o el teclado, en píxeles; se llega de a poco. */
let objetivo: number | null = null;

/**
 * El primer paso (`D-83`, `lib/bestiario/camara.ts`): al llegar, la cámara camina sola un trecho
 * corto y despacio, para que se vea que el mundo se corre de costado y asome lo primero que hay.
 * Cualquier gesto lo corta; con movimiento reducido no se da.
 */
let paseo: { desde: number; hasta: number; t0: number } | null = null;

function darElPrimerPaso(): void {
  if (quieto() || recorrido() <= 0) return;
  const largo = Math.min(vistaPx * PRIMER_PASO.cuanto, PRIMER_PASO.tope, recorrido() - escenario.scrollLeft);
  if (largo <= 0) return;
  paseo = { desde: escenario.scrollLeft, hasta: escenario.scrollLeft + largo, t0: reloj };
  arrancar();
}

function irA(x: number, deUna = false): void {
  paseo = null;
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

/**
 * Cada toque, mientras el sonido esté pedido: lo prende si todavía no arrancó, y si ya andaba y el
 * contexto se durmió, lo despierta (`T-519`). En el celular el `<audio>` de una bestia puede dejar
 * el Web Audio del recital suspendido al terminar, y antes la escucha de toques se soltaba con el
 * primero que andaba: el camino quedaba mudo hasta recargar. Un `resume()` que no hacía falta no
 * cuesta nada.
 */
function alTocar(ev: Event): void {
  if ((ev.target as Element | null)?.closest?.('#lejos')) return;
  if (!pedido) return soltarGestos();
  if (lejos.prendido) {
    if (contextoVivo()?.state !== 'running') void despertarSalida();
    return;
  }
  void prenderSonido();
}

/** Al terminar de hablar una bestia, el contexto del recital se intenta despertar sin esperar un toque. */
function revivirRecital(): void {
  const ctx = contextoVivo();
  if (pedido && ctx && ctx.state !== 'running') void ctx.resume().catch(() => {});
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
      esperarGestos();
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
    void prenderSonido();
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
   El cartel se aparta
   ------------------------------------------------------------------

   El nombre de la región flota arriba a la derecha, y ahí arriba viven los que vuelan o se sientan
   alto: el señor de los cielos en la copa del árbol, el gavilán, la lechuza. Pedido del usuario:
   *"todas las bestias son visibles [...] no se molestan entre sí"*. Cuando un bicho queda debajo
   del cartel plegado, el cartel se aclara y deja pasar el toque; cuando se va, vuelve. Los títeres
   que ocupan media pantalla (Momo, el Alien Duce) no cuentan: su caja es el aire que recorren. */
const cartel = tablero?.querySelector<HTMLElement>('.camino-cartel') ?? null;

function despejarCartel(): void {
  if (!tablero || !cartel) return;
  // Apartado, se mide con un margen: el que vuela en el borde no lo hace titilar.
  const m = tablero.classList.contains('camino-tablero--apartado') ? 24 : 0;
  const k = cartel.getBoundingClientRect();
  const c = { left: k.left - m, right: k.right + m, top: k.top - m, bottom: k.bottom + m };
  let debajo = false;
  if (tablero.classList.contains('camino-tablero--plegado')) {
    for (const g of piso.querySelectorAll(BICHOS)) {
      const r = (g.querySelector('.toque') ?? g).getBoundingClientRect();
      if (!r.width || r.height > innerHeight * 0.45 || r.right < c.left || r.left > c.right) continue;
      const ix = Math.min(r.right, c.right) - Math.max(r.left, c.left);
      const iy = Math.min(r.bottom, c.bottom) - Math.max(r.top, c.top);
      if (ix > 0 && iy > 0 && ix * iy > r.width * r.height * 0.2) {
        debajo = true;
        break;
      }
    }
  }
  tablero.classList.toggle('camino-tablero--apartado', debajo);
}

// Con movimiento reducido el reloj no anda: ahí se mira al caminar.
escenario.addEventListener('scroll', () => quieto() && despejarCartel(), { passive: true });

/* ------------------------------------------------------------------
   Los que viven en el camino
   ------------------------------------------------------------------ */

let reloj = 0;

/** Lo que cada escena le pide a la isla: el bocadillo en sus coordenadas, el reloj y la quietud. */
function contexto(marco: SVGGraphicsElement, ancho: number): {
  hablar(id: string, x: number, y: number, abajo?: boolean): void;
  quieto(): boolean;
  reloj(): number;
  ancho: number;
  vista(): readonly [number, number];
  seVe(el: Element): boolean;
  paso(): number;
} {
  // Cuánto está corrido el marco adentro del piso (el recinto que arranca antes del cero, el claro de la pastura).
  const corrido = marco === piso ? 0 : ((marco as SVGGElement).transform.baseVal.consolidate()?.matrix.e ?? 0);
  return {
    // Lo que se ve, en las unidades del marco, con media pantalla de margen a cada lado: lo que está
    // por entrar ya se está moviendo.
    vista: () => {
      const ancha = vistaPx / lente.z / escala;
      const desde = cam / escala - corrido;
      return [desde - ancha * 0.5, desde + ancha * 1.5];
    },
    seVe: (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.right > -vistaPx * 0.5 && r.left < vistaPx * 1.5;
    },
    paso: () => pasoAhora,
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
  /**
   * El cuerpo del lobo (`D-90`, cuarta ronda). La cabeza llega tarde y se pasa (un resorte): cuando
   * asoma, cabecea; cuando lo mirás de cerca, te clava la vista con la cabeza baja y los ojos
   * entornados, y resopla. `mira`: hacia dónde tiene el dedo, y cuánto le importa.
   */
  const cuerpo = { cabeza: 0, v: 0, mira: 0, cerca: 0, antes: 0, alzadoAntes: lobo.alzado };

  const arriba = (): { x: number; y: number } => ({
    x,
    y: ACECHO.piso + (1 - lobo.alzado) * ACECHO.hundido - (AL.piso[1] - 40) * ESCALA_LOBO,
  });

  function pintar(t: number): void {
    const y = ACECHO.piso + (1 - lobo.alzado) * ACECHO.hundido;
    g.setAttribute('transform', `translate(${x} ${y.toFixed(1)}) scale(${ESCALA_LOBO}) translate(${-AL.piso[0]} ${-AL.piso[1]})`);
    const dt = Math.min(0.05, Math.max(0, t - cuerpo.antes));
    cuerpo.antes = t;
    // La mirada: el dedo o el mouse cerca de la cara. Con alguien encima respira más corto y más hondo.
    const m = lobo.alzado > 0.5 ? miradaDe(g, AL.cabeza[0], AL.cabeza[1] - 60, 300) : { dx: 0, dy: 0, cerca: 0 };
    cuerpo.mira = seguir(cuerpo.mira, m.dx * m.cerca, dt, 3);
    cuerpo.cerca = seguir(cuerpo.cerca, m.cerca, dt, 2.5);
    // Respira con peso: el pecho se llena despacio y se vacía más rápido.
    const aire = Math.sin(t * (1.7 + cuerpo.cerca * 1.6));
    const respira = (aire > 0 ? Math.pow(aire, 0.7) : -Math.pow(-aire, 1.5)) * (0.016 + cuerpo.cerca * 0.008);
    p.get('pecho')?.setAttribute('transform', `translate(${AL.piso[0]} ${AL.piso[1]}) scale(1 ${(1 + respira).toFixed(4)}) translate(${-AL.piso[0]} ${-AL.piso[1]})`);
    const centro = medioDeLaVista();
    // Adónde quiere tener la cabeza: hacia quien pasa, y si hay un dedo cerca, hacia el dedo, agachada.
    const quiere = Math.max(-7, Math.min(7, (centro - x) / 30)) * (1 - cuerpo.cerca) + cuerpo.mira * 9 + Math.sin(t * 0.7) * 1.2;
    // La cabeza es pesada: persigue con un resorte, y lo que sube o baja el cuerpo la empuja para el otro lado.
    const empuje = dt > 0 ? ((lobo.alzado - cuerpo.alzadoAntes) / dt) * -14 : 0;
    cuerpo.alzadoAntes = lobo.alzado;
    cuerpo.v += ((quiere + empuje - cuerpo.cabeza) * 42 - cuerpo.v * 7.5) * dt;
    cuerpo.cabeza += cuerpo.v * dt;
    girar(p.get('cabeza'), dt > 0 ? cuerpo.cabeza : quiere, AL.cabeza, `translate(0 ${(-respira * 300 + cuerpo.cerca * 5).toFixed(2)}) `);
    if (t > lobo.parpadeo + 0.15) lobo.parpadeo = t + 2.5 + Math.random() * 4;
    const ciega = t > lobo.parpadeo && t < lobo.parpadeo + 0.15 ? 1 : 0;
    // Con alguien cerca entorna los ojos: no parpadea de más, mira fijo.
    parpado(p.get('parpado-1'), Math.max(ciega, cuerpo.cerca * 0.42));
    parpado(p.get('parpado-2'), Math.max(ciega, cuerpo.cerca * 0.42));
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
      const centro = medioDeLaVista();
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

/**
 * El dedo es más grueso que un par de ojos, y hay bichos chicos que no se quedan quietos (el moscón,
 * la del lanchón en su bote). El toque que cae al lado, en el piso, era un toque perdido: pasaba
 * sobre todo contra el borde de la pantalla. Ahora va al bicho más cercano, si está a menos de
 * `RADIO_CERCA` píxeles. Los títeres que ocupan media pantalla no cuentan: su caja es el aire que
 * recorren, y el toque en ese aire no es de ellos.
 */
const RADIO_CERCA = 34;

function bichoCerca(x: number, y: number): SVGGElement | null {
  let mejor: SVGGElement | null = null;
  let distancia = RADIO_CERCA;
  for (const g of piso.querySelectorAll<SVGGElement>(BICHOS)) {
    const r = (g.querySelector('.toque') ?? g).getBoundingClientRect();
    if (!r.width || r.height > innerHeight * 0.45 || r.width > innerWidth * 0.6) continue;
    // Entre un par de ojos y un títere a la misma distancia, los ojos: la caja del títere es más
    // grande que su dibujo.
    const d = Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom)) + (g.classList.contains('titere') ? 8 : 0);
    if (d < distancia) [mejor, distancia] = [g, d];
  }
  return mejor;
}

/**
 * El dedo que baja y sube sobre el mismo bicho lo tocó, aunque el clic llegue al piso. En el
 * teléfono pasaba con el toque que seguía a cerrar una ficha: el navegador, al armar el clic, lo
 * mandaba al `<svg>` de abajo, y el bicho no se enteraba.
 */
let apretado: { g: SVGGElement; x: number; y: number } | null = null;
/** Los clics que cayeron en el piso y se le pasaron a un bicho. */
const atendidos = new WeakSet<Event>();
let soltado: { g: SVGGElement; t: number } | null = null;
const bichoDe = (ev: Event): SVGGElement | null => (ev.target as Element).closest<SVGGElement>(BICHOS);
piso.addEventListener(
  'pointerdown',
  (ev) => {
    const g = bichoDe(ev);
    apretado = g ? { g, x: ev.clientX, y: ev.clientY } : null;
  },
  { passive: true },
);
piso.addEventListener(
  'pointerup',
  (ev) => {
    const quieta = apretado && Math.hypot(ev.clientX - apretado.x, ev.clientY - apretado.y) < 12;
    soltado = quieta && bichoDe(ev) === apretado!.g ? { g: apretado!.g, t: performance.now() } : null;
    apretado = null;
  },
  { passive: true },
);

piso.addEventListener('click', (ev) => {
  const tocado = ev.target as Element;
  const suelto = soltado && performance.now() - soltado.t < 600 ? soltado.g : null;
  soltado = null;
  const g = tocado.closest<SVGGElement>('.bestia');
  if (g) return tocarBicho(g);
  if (tocado.closest('.titere')) return;
  const cerca = suelto ?? bichoCerca(ev.clientX, ev.clientY);
  if (!cerca) return;
  // Este clic ya tocó a alguien: que el de "tocar afuera cierra la ficha" no lo cuente.
  atendidos.add(ev);
  if (cerca.classList.contains('bestia')) tocarBicho(cerca);
  // Un títere escucha su propio toque: se lo pasa como si lo hubieran tocado a él.
  else cerca.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: ev.clientX, clientY: ev.clientY }));
});

// Un títere tocado: si su gesto es largo, la ficha no lo espera entero. Corre después del toque del
// títere (que escucha en él mismo), así que si ya habló, la ficha ya está abierta y no se espera nada.
escenario.addEventListener('click', (ev) => {
  if (quieto()) return;
  const g = (ev.target as Element).closest<SVGGElement>('.titere[data-id]');
  if (g) esperarAlTitere(g.dataset.id!);
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

let cuadros = 0;

function cuadro(ahora: number): void {
  medirAlivio(ahora - antes);
  const dt = Math.min((ahora - antes) / 1000, 0.05);
  antes = ahora;
  reloj += dt;
  // El primer paso: la cámara camina sola un trecho corto, y se para.
  if (paseo) {
    const u = (reloj - paseo.t0) / PRIMER_PASO.dura;
    escenario.scrollLeft = paseo.desde + (paseo.hasta - paseo.desde) * primerPaso(u);
    if (u >= 1) {
      camDeEntrada = paseo.hasta;
      paseo = null;
    }
  }
  // El viaje de la lupa: llega de a poco, y al llegar acomoda la ficha.
  if (viaje) {
    const u = (reloj - viaje.t0) / LUPA.dura;
    ponerLente(entreLentes(viaje.desde, viaje.hasta, u));
    if (u >= 1) {
      viaje = null;
      alLlegarLaLupa();
    }
  }
  // La ruedita y el teclado llegan de a poco: el scroll se acerca a donde se pidió.
  if (objetivo !== null) {
    const falta = objetivo - escenario.scrollLeft;
    if (Math.abs(falta) < 1) {
      escenario.scrollLeft = objetivo;
      objetivo = null;
    } else escenario.scrollLeft += falta * Math.min(1, dt * 12);
  }
  encuadrar(quieto());
  vida.mover(reloj, dt);
  noEsperarMas();
  // Cada tanto alcanza: medir todos los bichos en cada cuadro es caro en un teléfono.
  if (++cuadros % 8 === 0) despejarCartel();
  if (!quieto()) {
    // Un salto (ir a un bicho, volver del cruce) no es caminar: no mueve el cuerpo.
    const paso = camEnElCuadro === null ? 0 : (cam - camEnElCuadro) / escala;
    if (Math.abs(paso) < 160) camara.caminar(paso, dt);
    // El aire se abre al paso: sube enseguida y se vuelve a cerrar despacio.
    const pide = dt > 0 && Math.abs(paso) < 160 ? Math.min(1, Math.abs(paso) / dt / PASO_PLENO) : 0;
    anda += (pide - anda) * Math.min(1, dt * (pide > anda ? 3.5 : 0.55));
    pasoAhora = dt > 0 && Math.abs(paso) < 160 ? paso / dt : 0;
    moverAcecho(dt, dt > 0 && Math.abs(paso) / dt > 6);
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
    // Lo deslizado se lee del scroll, no de la cámara: si el tamaño cambia en el mismo cuadro en que
    // se deslizó, la cámara todavía no se enteró, y volver a su cuenta era pegar un salto para atrás.
    const p = recorrido() > 0 ? Math.min(1, escenario.scrollLeft / recorrido()) : 1;
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
   La invitación a caminar (`D-83`)
   ------------------------------------------------------------------

   En el teléfono, con el tablero plegado, nada decía que se camina deslizando de costado: se veía
   el monte, y nada más. Hasta que la mano camine por primera vez, el aviso de deslizar es un sello
   flotando abajo. Lo aprendido queda anotado en el teléfono, como la libreta: la región que sigue
   ya no lo repite. Donde hay mouse no hace falta: el primer paso y el agarre lo dicen solos. */

const CLAVE_CAMINAR = 'fichin-bestiario-sabe-caminar';
const invitacion = camino.querySelector<HTMLElement>('.camino-deslizar');
/** Dónde estaba la cámara al entrar (o al terminar el primer paso): lo caminado se mide desde ahí. */
let camDeEntrada = 0;

function sabeCaminar(): boolean {
  try {
    return localStorage.getItem(CLAVE_CAMINAR) === '1';
  } catch {
    return false;
  }
}

function invitar(): void {
  if (!invitacion || sabeCaminar() || recorrido() <= 0) return;
  camino.classList.add('camino--invita');
}

/** La mano ya caminó: el sello se va, y no vuelve en este teléfono. */
function aprender(): void {
  if (!camino.classList.contains('camino--invita')) return;
  camino.classList.remove('camino--invita');
  try {
    localStorage.setItem(CLAVE_CAMINAR, '1');
  } catch {
    // Sin dónde guardar, la próxima región vuelve a invitar.
  }
}

/* ------------------------------------------------------------------
   Caminar: el dedo, la ruedita, el teclado y el mouse
   ------------------------------------------------------------------ */

// El dedo: el scroll de costado del navegador. La isla solo mira dónde quedó.
escenario.addEventListener(
  'scroll',
  () => {
    if (objetivo === null || Math.abs(objetivo - escenario.scrollLeft) < 1) encuadrar(!corriendo || quieto());
    // Un trecho caminado por la mano, no por el primer paso: ya sabe.
    if (!paseo && objetivo === null && Math.abs(escenario.scrollLeft - camDeEntrada) > 80) aprender();
  },
  { passive: true },
);
// Si el dedo agarra la escena mientras la ruedita la llevaba, manda el dedo; y corta el primer paso.
escenario.addEventListener(
  'pointerdown',
  (ev) => {
    objetivo = null;
    paseo = null;
    agarrar(ev);
  },
  { passive: true },
);

/* Agarrar la escena con el mouse (`D-83`). En la compu la escena no se arrastraba: el scroll de
   costado solo lo movían la ruedita y las flechas. Con el mouse apretado, la escena se agarra y se
   lleva, como con el dedo. Seis píxeles de movimiento y es un arrastre, no un toque; soltar después
   de arrastrar no toca nada. */

let agarre: { id: number; x: number; y: number; cam: number; sube: number; mouse: boolean; movio: boolean } | null = null;
/** El clic que cierra un arrastre no es un toque: se traga. */
let soltadoSinTocar = false;

function agarrar(ev: PointerEvent): void {
  soltadoSinTocar = false;
  const mouse = ev.pointerType === 'mouse';
  // El mouse agarra siempre. El dedo camina solo (el scroll es del navegador): se lo sigue nada más
  // que con la lupa puesta, para mirar más arriba o más abajo (`D-90`).
  if (mouse ? ev.button !== 0 : !conLupa(lente) || pellizcado !== null) return;
  agarre = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, cam: escenario.scrollLeft, sube: lente.y, mouse, movio: false };
}

escenario.addEventListener('pointermove', (ev) => {
  if (!agarre || ev.pointerId !== agarre.id) return;
  const dx = ev.clientX - agarre.x;
  const dy = ev.clientY - agarre.y;
  const conLente = conLupa(lente);
  if (!agarre.movio) {
    if (Math.hypot(agarre.mouse ? dx : 0, conLente ? dy : 0) < 6) return;
    agarre.movio = true;
    if (agarre.mouse) {
      camino.classList.add('camino--agarrando');
      escenario.setPointerCapture(agarre.id);
    }
  }
  if (agarre.mouse) escenario.scrollLeft = agarre.cam - dx;
  if (conLente) mirarA(agarre.sube - dy / lente.z);
});

function soltar(ev: PointerEvent): void {
  if (!agarre || ev.pointerId !== agarre.id) return;
  if (agarre.movio) {
    camino.classList.remove('camino--agarrando');
    soltadoSinTocar = true;
    if (agarre.mouse) aprender();
  }
  agarre = null;
}
escenario.addEventListener('pointerup', soltar);
escenario.addEventListener('pointercancel', soltar);
escenario.addEventListener(
  'click',
  (ev) => {
    if (!soltadoSinTocar) return;
    soltadoSinTocar = false;
    ev.stopPropagation();
    ev.preventDefault();
  },
  true,
);

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
    // De costado (un panel táctil) camina solo, con el scroll del navegador. Manda la mano: lo que
    // la escena se estuviera corriendo sola (la ficha que la corre, el primer paso) se suelta.
    if (Math.abs(dy) <= Math.abs(dx)) {
      objetivo = null;
      paseo = null;
      return;
    }
    ev.preventDefault();
    irA((objetivo ?? escenario.scrollLeft) + dy);
    aprender();
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
  // La lupa, con el teclado: más, menos y cero, como en cualquier lado.
  const deLupa: Record<string, () => void> = { '+': () => pasoDeLupa(LUPA.paso), '=': () => pasoDeLupa(LUPA.paso), '-': () => pasoDeLupa(1 / LUPA.paso), '0': mirarTodo };
  if (deLupa[ev.key]) {
    ev.preventDefault();
    deLupa[ev.key]!();
    return;
  }
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
  aprender();
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
  if (atendidos.has(ev)) return;
  if (!bocadillo.hidden && !el.closest('.bocadillo, .bestia, .titere')) callar();
  if (!hoja.hidden && !el.closest('.bestiario-hoja, .bocadillo, .bestia, .titere, .camino-fichas, .lupa')) cerrarHoja();
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
if (lupa) lupa.hidden = false;
pintarLupa();
pintarAlivio();
medir();
encuadrar();
if (quieto()) vida.mover(0, 0);
requestAnimationFrame(() => {
  // Se llegó al cruce volviendo de la región de al lado (`#cruce`): se aparece al final del
  // camino. Un enlace a un bicho (`#el-lobo-suelto`) lleva hasta él con su ficha abierta. Si no,
  // se entra por el principio: el primer paso, y a quien no caminó nunca, la invitación.
  const pedido = decodeURIComponent(location.hash.slice(1));
  if (pedido === 'cruce') alCruce(false);
  else if (bestias.has(pedido)) llevarA(pedido);
  else {
    camDeEntrada = escenario.scrollLeft;
    invitar();
    darElPrimerPaso();
  }
});
arrancar();
