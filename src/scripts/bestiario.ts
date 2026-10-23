/**
 * La isla del bestiario redondo (`D-73`, segunda vuelta): el zoológico vivo.
 *
 * Arriba, el plano redondo, cuyos rótulos son enlaces que bajan a cada recinto. Abajo, los
 * recintos uno detrás del otro, y en cada uno los bichos **viven**: respiran, se balancean,
 * pegan un saltito. En el del monte y la pastura viven los dos títeres de Rocambole, recortados
 * de las tapas: el lobo suelto acecha asomándose desde lo oscuro detrás de la pastura, del lado
 * del cordero, y el cordero atado pasta hasta que el lobo asoma cerca y huye hasta donde le da
 * la soga. El cordero se puede arrastrar con el dedo, pero no más allá de la soga.
 *
 * Tocar un bicho lo hace reaccionar y le hace decir su verso en un bocadillo; desde ahí se
 * abre su ficha, que es la misma del índice de abajo (una sola versión de cada una).
 *
 * Solo se anima lo que se ve (`IntersectionObserver`), y con movimiento reducido no se mueve
 * nada: los bichos quedan quietos en su lugar y se tocan igual.
 *
 * Y solo se baja lo que se acerca (`T-445`, `carga.ts`): cada escena de noche y cada retrato del
 * índice llegan guardados en un `<noscript>`, y se arman recién a una pantalla y media de distancia.
 */

import { BESTIARIO } from '../lib/bestiario/copy.ts';
// La isla solo se lleva números: la geometría vive en `rig.ts` y `recortes.ts`, nunca en los
// módulos que dibujan (`arte*.ts`, `escenas.ts`, `titeres.ts`), que correrían el aerógrafo entero
// en el teléfono al abrir la página. `bestiario.test.ts` lo vigila.
import { ESPERA, GUARDADO } from '../lib/bestiario/carga.ts';
import { crearRocola } from './rocola.ts';
import { armarRecinto } from './bestiario/recintos.ts';
import { Charla } from '../lib/bestiario/charla.ts';
import { lugarDeLaFicha, type Lado } from '../lib/bestiario/hoja.ts';

interface BestiaIsla {
  id: string;
  nombre: string;
  recinto: string;
  dice: string;
}
interface Datos {
  total: number;
  bestias: readonly BestiaIsla[];
}

const datos = JSON.parse(document.getElementById('datos-bestiario')!.textContent!) as Datos;
const bestias = new Map(datos.bestias.map((b) => [b.id, b]));

const hoja = document.getElementById('hoja')!;
const hojaCuerpo = document.getElementById('hoja-cuerpo')!;
const cerrar = document.getElementById('cerrar')!;
const libreta = document.getElementById('libreta')!;
const bocadillo = document.getElementById('bocadillo')!;
const bocadilloVerso = document.getElementById('bocadillo-verso')!;

const rocola = crearRocola();
const BICHOS = '.bestia[data-id], .titere[data-id]';
/** Las que tienen verso: las otras no tienen nada que decir solas. */
const conVerso = new Set(datos.bestias.filter((b) => b.dice !== BESTIARIO.sinTema).map((b) => b.id));
/** La que tiene el mouse encima, en una computadora. */
let encima: string | null = null;
const quieto = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------
   La libreta: lo que ya abriste, en este teléfono
   ------------------------------------------------------------------ */

const CLAVE = 'fichin-bestiario-anotadas';

function leerAnotadas(): Set<string> {
  try {
    const crudo = localStorage.getItem(CLAVE);
    const lista = crudo ? (JSON.parse(crudo) as unknown) : [];
    return new Set(Array.isArray(lista) ? lista.filter((x): x is string => typeof x === 'string' && bestias.has(x)) : []);
  } catch {
    return new Set();
  }
}

const anotadas = leerAnotadas();

function pintarLibreta(): void {
  libreta.textContent = anotadas.size ? BESTIARIO.libreta(anotadas.size, datos.total) : BESTIARIO.libretaVacia(datos.total);
}

/**
 * Lo que esperaba se arma (`carga.ts`): el SVG guardado como texto en su `<noscript>` pasa a SVG y
 * ocupa el lugar del vacío, que ya medía lo mismo. Recién ahí el navegador baja sus piezas.
 */
function materializar(raiz: ParentNode): void {
  for (const guardado of raiz.querySelectorAll<HTMLElement>(`noscript[${GUARDADO}]`)) {
    const molde = document.createElement('template');
    molde.innerHTML = guardado.textContent ?? '';
    const svg = molde.content.querySelector('svg');
    if (!svg) continue;
    const lugar = guardado.previousElementSibling;
    if (lugar instanceof SVGSVGElement && lugar.hasAttribute(ESPERA)) lugar.replaceWith(svg);
    else guardado.before(svg);
    guardado.remove();
  }
}

function pintarAnotada(id: string): void {
  for (const g of document.querySelectorAll(`.bestia[data-id="${id}"], .bestia-plano[data-id="${id}"]`)) {
    g.classList.add('bestia--anotada');
  }
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

function abrir(id: string): void {
  const original = document.querySelector<HTMLElement>(`.bestiario-ficha[data-bestia="${id}"] .bestiario-cuerpo`);
  if (!original) return;
  callar();
  rocola.parar();
  volverA = document.activeElement;
  const copia = original.cloneNode(true) as HTMLElement;
  // Si la ficha del índice todavía no se armó, la copia trae el retrato guardado: se arma acá.
  materializar(copia);
  copia.querySelector('[data-titulo]')?.setAttribute('id', 'hoja-titulo');
  hojaCuerpo.replaceChildren(copia);
  hoja.hidden = false;
  hoja.scrollTop = 0;
  anotar(id);
  history.replaceState(null, '', `#${id}`);
  ubicarHoja(id);
  cerrar.focus({ preventScroll: true });
}

const fichaDeCostado = window.matchMedia('(min-width: 52rem)');
const LADOS: readonly Lado[] = ['arriba', 'abajo', 'izquierda', 'derecha'];

/**
 * La ficha se abre donde no tapa al bicho (`D-80`, `lib/bestiario/hoja.ts`), si el bicho está en
 * pantalla: abierta desde el índice o desde un enlace, no hay a quién no tapar.
 */
function ubicarHoja(id: string): void {
  hoja.classList.remove(...LADOS.map((l) => `bestiario-hoja--${l}`));
  hoja.style.removeProperty('max-height');
  const ventana = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
  const bicho = [...document.querySelectorAll(`.recinto [data-id="${CSS.escape(id)}"]`)]
    .map((el) => el.getBoundingClientRect())
    .find((r) => r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth);
  if (!bicho) return;
  const lugar = lugarDeLaFicha(bicho, ventana, fichaDeCostado.matches, hoja.getBoundingClientRect().width, 0);
  hoja.classList.add(`bestiario-hoja--${lugar.lado}`);
  if (lugar.alto) hoja.style.maxHeight = `${lugar.alto}px`;
}

function cerrarHoja(): void {
  if (hoja.hidden) return;
  rocola.parar();
  hoja.hidden = true;
  history.replaceState(null, '', location.pathname);
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
    return;
  }
  rocola.tocar(clave, soltar, url);
  boton.classList.add('bestiario-escuchar--sonando');
  boton.textContent = BESTIARIO.sonando;
}

let hablando: string | null = null;
let callarEn = 0;

/**
 * El bicho dice su verso, sin que lo toquen (`D-78`): al pasarle el mouse por arriba, o solo, de
 * vez en cuando (`lib/bestiario/charla.ts`). El bocadillo se cuelga arriba del dibujo, adentro de
 * su escena, y si arriba no entra va abajo, con la punta para arriba.
 */
function decir(id: string, escena: HTMLElement, g: Element, dura = 8000): void {
  const b = bestias.get(id);
  if (!b) return;
  const r = g.getBoundingClientRect();
  const caja = escena.getBoundingClientRect();
  escena.append(bocadillo);
  bocadilloVerso.textContent = `«${b.dice}»`;
  bocadillo.hidden = false;
  const ancho = bocadillo.offsetWidth;
  const alto = bocadillo.offsetHeight;
  // En coordenadas del contenido de la escena: lo corrido de costado se suma, el borde se resta.
  const px = r.left + r.width / 2 - caja.left - escena.clientLeft + escena.scrollLeft;
  const py = r.top + Math.min(r.height * 0.15, 40) - caja.top - escena.clientTop;
  const desde = escena.scrollLeft + 6;
  const hasta = escena.scrollLeft + escena.clientWidth - ancho - 6;
  const izquierda = Math.min(Math.max(px - ancho / 2, desde), Math.max(hasta, desde));
  const abajo = py - alto - 14 < 6;
  bocadillo.classList.toggle('bocadillo--abajo', abajo);
  bocadillo.style.left = `${izquierda}px`;
  bocadillo.style.top = `${abajo ? Math.min(py + 52, escena.clientHeight - alto - 6) : py - alto - 14}px`;
  bocadillo.style.setProperty('--punta', `${Math.min(Math.max(px - izquierda, 16), ancho - 16)}px`);
  hablando = id;
  callarEn = performance.now() + dura;
}

/**
 * Tocar un bicho del mapa abre su ficha, directo (`D-78`). Acá no suena: el mapa no tiene botón de
 * sonido, y explorar tocando de a uno se volvería ruidoso. El tema está en el botón de la ficha.
 */
function hablar(id: string): void {
  if (bestias.has(id)) abrir(id);
}

function callar(): void {
  bocadillo.hidden = true;
  hablando = null;
}

/* ------------------------------------------------------------------
   Los recintos: qué se ve, y el reloj que mueve lo que se ve
   ------------------------------------------------------------------ */

interface Recinto {
  escena: HTMLElement;
  svg: SVGSVGElement;
  /** Avanza un cuadro. `t` en segundos, `dt` lo que pasó desde el anterior. */
  mover(t: number, dt: number): void;
  /** Lo tocaron: la bestia de ese id reacciona. */
  reaccionar(id: string, t: number): void;
}

const recintos = new Map<HTMLElement, Recinto>();
const visibles = new Set<Recinto>();
let reloj = 0;
let antes = 0;
let corriendo = false;

function cuadro(ahora: number): void {
  const dt = Math.min((ahora - antes) / 1000, 0.05);
  antes = ahora;
  reloj += dt;
  for (const r of visibles) r.mover(reloj, dt);
  if (hablando && ahora > callarEn) callar();
  if (visibles.size && !quieto() && document.visibilityState === 'visible') requestAnimationFrame(cuadro);
  else corriendo = false;
}

function arrancar(): void {
  if (corriendo || quieto() || !visibles.size) return;
  corriendo = true;
  antes = performance.now();
  requestAnimationFrame(cuadro);
}


/* ------------------------------------------------------------------
   El armado
   ------------------------------------------------------------------ */

const observador = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      const r = recintos.get(e.target as HTMLElement);
      if (!r) continue;
      if (e.isIntersecting) visibles.add(r);
      else visibles.delete(r);
    }
    arrancar();
  },
  { rootMargin: '80px 0px' },
);

/**
 * Un recinto se arma cuando se acerca: su escena pasa del `<noscript>` a SVG, se le pone su
 * controlador y se le pintan las bestias que ya estaban anotadas.
 */
function montar(escena: HTMLElement): void {
  materializar(escena);
  const svg = escena.querySelector<SVGSVGElement>('svg')!;
  // La vida de cada escena vive en `bestiario/recintos.ts`, que comparte con el camino.
  const vida = armarRecinto(escena.dataset.recinto ?? '', svg, {
    hablar: (b) => hablar(b),
    quieto,
    reloj: () => reloj,
    ancho: svg.viewBox.baseVal.width,
  });
  const r: Recinto = { escena, svg, mover: vida.mover, reaccionar: vida.reaccionar };
  // Las escenas de noche son más anchas que un teléfono: arrancan mirando a su protagonista, y
  // un rótulo avisa que se corren de costado hasta que la gente lo hace.
  if (escena.scrollWidth > escena.clientWidth) {
    const foco = Number(escena.dataset.foco ?? NaN);
    const escala = svg.clientWidth / svg.viewBox.baseVal.width;
    escena.scrollLeft = Number.isFinite(foco) ? foco * escala - escena.clientWidth / 2 : (escena.scrollWidth - escena.clientWidth) / 2;
    const pista = escena.nextElementSibling;
    if (pista instanceof HTMLElement && pista.classList.contains('recinto-deslizar')) {
      pista.hidden = false;
      const desde = escena.scrollLeft;
      const mirar = (): void => {
        if (Math.abs(escena.scrollLeft - desde) < 24) return;
        pista.hidden = true;
        escena.removeEventListener('scroll', mirar);
      };
      escena.addEventListener('scroll', mirar, { passive: true });
    }
  }
  recintos.set(escena, r);
  observador.observe(escena);
  if (quieto()) r.mover(0, 0);

  // Tocar un bicho del mapa (los títeres tienen sus propios toques).
  escena.addEventListener('click', (ev) => {
    const g = (ev.target as Element).closest<SVGGElement>('.bestia');
    if (!g) return;
    r.reaccionar(g.dataset.id!, reloj);
    hablar(g.dataset.id!);
  });
  escena.addEventListener('keydown', (ev) => {
    const g = (ev.target as Element).closest<SVGGElement>('.bestia');
    if (g && (ev.key === 'Enter' || ev.key === ' ')) {
      ev.preventDefault();
      r.reaccionar(g.dataset.id!, reloj);
      hablar(g.dataset.id!);
    }
  });
  escena.addEventListener('pointerover', (ev) => {
    if (ev.pointerType !== 'mouse') return;
    const g = (ev.target as Element).closest(BICHOS);
    const id = g?.getAttribute('data-id');
    if (!g || !id || id === encima || !conVerso.has(id) || !hoja.hidden) return;
    encima = id;
    decir(id, escena, g);
  });
  escena.addEventListener('pointerout', (ev) => {
    if (ev.pointerType !== 'mouse' || !encima) return;
    const g = (ev.target as Element).closest(BICHOS);
    if (g && g.contains(ev.relatedTarget as Node | null)) return;
    if (hablando === encima) callar();
    encima = null;
  });
  for (const id of anotadas) for (const g of escena.querySelectorAll(`.bestia[data-id="${id}"]`)) g.classList.add('bestia--anotada');
}

/**
 * La cercanía: a una pantalla y media se arma lo que viene. Los recintos, con su controlador; las
 * fichas del índice que tienen retrato, con sus piezas.
 */
const cerca = new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      cerca.unobserve(e.target);
      const el = e.target as HTMLElement;
      if (el.classList.contains('recinto-escena')) montar(el);
      else materializar(el);
    }
  },
  { rootMargin: '150% 0px' },
);
for (const escena of document.querySelectorAll<HTMLElement>('.recinto-escena')) cerca.observe(escena);
for (const item of document.querySelectorAll<HTMLElement>('.bestiario-item')) if (item.querySelector(`noscript[${GUARDADO}]`)) cerca.observe(item);

document.addEventListener('visibilitychange', arrancar);

/* Los botones: las fichitas de cada recinto, la hoja y el índice. */

document.querySelector('.recorrido')!.addEventListener('click', (ev) => {
  const chip = (ev.target as Element).closest<HTMLButtonElement>('.bestiario-chip[data-ir]');
  if (chip) abrir(chip.dataset.ir!);
});

cerrar.addEventListener('click', cerrarHoja);

hoja.addEventListener('click', (e) => {
  const objetivo = e.target as Element;
  const ir = objetivo.closest<HTMLAnchorElement>('[data-ir]');
  if (ir) {
    e.preventDefault();
    const b = bestias.get(ir.dataset.ir!);
    if (b) document.getElementById(`recinto-${b.recinto}`)?.scrollIntoView({ behavior: quieto() ? 'auto' : 'smooth', block: 'start' });
    abrir(ir.dataset.ir!);
    return;
  }
  const sonar = objetivo.closest<HTMLButtonElement>('[data-escuchar]');
  if (sonar) escuchar(sonar);
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!hoja.hidden) cerrarHoja();
  else callar();
});

/* El índice: abrir una ficha ahí también la anota; "Buscala en el mapa" baja hasta su recinto. */
const indice = document.querySelector('.bestiario-indice')!;
indice.addEventListener(
  'toggle',
  (e) => {
    const d = e.target as HTMLDetailsElement;
    if (d.open && d.dataset.bestia) anotar(d.dataset.bestia);
  },
  true,
);
indice.addEventListener('click', (e) => {
  const objetivo = e.target as Element;
  const ver = objetivo.closest<HTMLButtonElement>('[data-ver]');
  if (ver) {
    const b = bestias.get(ver.dataset.ver!);
    if (b) document.getElementById(`recinto-${b.recinto}`)?.scrollIntoView({ behavior: quieto() ? 'auto' : 'smooth', block: 'start' });
    return;
  }
  const sonar = objetivo.closest<HTMLButtonElement>('[data-escuchar]');
  if (sonar) escuchar(sonar);
});

/* Las que hablan solas: una de cada cinco que aparecen, de a una, en los recintos que se ven. */
const charla = new Charla();
window.setInterval(() => {
  if (document.visibilityState !== 'visible') return;
  const ids: string[] = [];
  const donde = new Map<string, { escena: HTMLElement; g: Element }>();
  for (const r of visibles) {
    const caja = r.escena.getBoundingClientRect();
    for (const g of r.escena.querySelectorAll(BICHOS)) {
      const id = g.getAttribute('data-id')!;
      if (!conVerso.has(id) || donde.has(id)) continue;
      const b = g.getBoundingClientRect();
      const enEscena = b.width && b.left >= caja.left && b.right <= caja.right && b.top >= caja.top && b.bottom <= caja.bottom;
      if (enEscena && b.top >= 0 && b.bottom <= window.innerHeight) {
        ids.push(id);
        donde.set(id, { escena: r.escena, g });
      }
    }
  }
  const id = charla.mirar(ids, performance.now(), !hoja.hidden || !bocadillo.hidden || encima !== null);
  if (id) decir(id, donde.get(id)!.escena, donde.get(id)!.g, 5000);
}, 700);

/* Arranque: lo anotado, y una dirección que trae una bestia. */
for (const id of anotadas) pintarAnotada(id);
pintarLibreta();

function seguirLaDireccion(): void {
  const pedido = decodeURIComponent(location.hash.slice(1));
  if (bestias.has(pedido)) {
    document.getElementById(`recinto-${bestias.get(pedido)!.recinto}`)?.scrollIntoView({ block: 'start' });
    abrir(pedido);
  }
}

seguirLaDireccion();
window.addEventListener('hashchange', seguirLaDireccion);
