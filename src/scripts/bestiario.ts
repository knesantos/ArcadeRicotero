/**
 * La isla del bestiario redondo (`D-73`).
 *
 * El mapa entero se ve de lejos; al tocar una región, la cámara baja y se acerca (se anima
 * el `viewBox`); desde ahí se viaja a la de al lado sin volver a subir, que es lo que hace
 * que el mundo se *recorra*. Una bestia abre su ficha en una hoja que sube desde abajo: la
 * ficha no se arma acá, se copia del índice que la página ya trae escrito, así hay una sola
 * versión de cada una.
 *
 * Lo que guarda el teléfono es solo una comodidad: qué bestias abriste, para el "Anotaste
 * X de N". Si el navegador no deja guardar, el bestiario anda igual y no anota.
 */

import { BESTIARIO } from '../lib/bestiario/copy.ts';
import { crearRocola } from './rocola.ts';

interface Caja {
  x: number;
  y: number;
  lado: number;
}
interface RegionIsla {
  id: string;
  nombre: string;
  canta: string;
  vecinas: readonly string[];
  camara: Caja;
}
interface BestiaIsla {
  id: string;
  nombre: string;
  region: string;
  x: number;
  y: number;
}
interface Datos {
  total: number;
  regiones: readonly RegionIsla[];
  bestias: readonly BestiaIsla[];
}

const datos = JSON.parse(document.getElementById('datos-bestiario')!.textContent!) as Datos;
const regiones = new Map(datos.regiones.map((r) => [r.id, r]));
const bestias = new Map(datos.bestias.map((b) => [b.id, b]));

const marco = document.getElementById('marco')!;
const mapa = document.getElementById('mapa') as unknown as SVGSVGElement;
const barra = document.getElementById('barra')!;
const aqui = document.getElementById('aqui')!;
const aquiCanta = document.getElementById('aqui-canta')!;
const aca = document.getElementById('aca')!;
const alLado = document.getElementById('al-lado')!;
const volver = document.getElementById('volver-al-mapa')!;
const hoja = document.getElementById('hoja')!;
const hojaCuerpo = document.getElementById('hoja-cuerpo')!;
const cerrar = document.getElementById('cerrar')!;
const libreta = document.getElementById('libreta')!;

const rocola = crearRocola();
const ENTERO: Caja = { x: 0, y: 0, lado: 1000 };
let camaraActual: Caja = ENTERO;
let regionActual: string | null = null;
let elegida: string | null = null;
let animacion = 0;

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
  libreta.textContent = anotadas.size
    ? BESTIARIO.libreta(anotadas.size, datos.total)
    : BESTIARIO.libretaVacia(datos.total);
}

function pintarAnotada(id: string): void {
  mapa.querySelector(`.bestia[data-id="${id}"]`)?.classList.add('bestia--anotada');
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
   La cámara
   ------------------------------------------------------------------ */

const quieto = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function ponerCaja(c: Caja): void {
  mapa.setAttribute('viewBox', `${c.x.toFixed(1)} ${c.y.toFixed(1)} ${c.lado.toFixed(1)} ${c.lado.toFixed(1)}`);
}

/**
 * Lleva la cámara a una caja. El viaje sube un poco en el medio —se aleja y vuelve a
 * bajar— cuando va lejos, como quien mira el mapa desde más arriba para ubicarse.
 */
function irA(destino: Caja): void {
  cancelAnimationFrame(animacion);
  const desde = camaraActual;
  camaraActual = destino;
  if (quieto()) {
    ponerCaja(destino);
    return;
  }
  const cx0 = desde.x + desde.lado / 2;
  const cy0 = desde.y + desde.lado / 2;
  const cx1 = destino.x + destino.lado / 2;
  const cy1 = destino.y + destino.lado / 2;
  const distancia = Math.hypot(cx1 - cx0, cy1 - cy0);
  const subida = Math.min(distancia * 0.6, 400);
  const duracion = 520 + Math.min(distancia, 600) * 0.5;
  const inicio = performance.now();
  const paso = (ahora: number): void => {
    const t = Math.min((ahora - inicio) / duracion, 1);
    const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    const lado = desde.lado + (destino.lado - desde.lado) * e + Math.sin(Math.PI * t) * subida;
    const cx = cx0 + (cx1 - cx0) * e;
    const cy = cy0 + (cy1 - cy0) * e;
    ponerCaja({ x: cx - lado / 2, y: cy - lado / 2, lado });
    if (t < 1) animacion = requestAnimationFrame(paso);
  };
  animacion = requestAnimationFrame(paso);
}

/** Si el punto queda en el borde o afuera de lo que se ve, la cámara se corre hasta él. */
function encuadrar(b: BestiaIsla): void {
  const c = camaraActual;
  const margen = c.lado * 0.12;
  const adentro = b.x > c.x + margen && b.x < c.x + c.lado - margen && b.y > c.y + margen && b.y < c.y + c.lado - margen;
  if (!adentro) irA({ x: b.x - c.lado / 2, y: b.y - c.lado / 2, lado: c.lado });
}

/* ------------------------------------------------------------------
   Las regiones
   ------------------------------------------------------------------ */

function boton(texto: string, dato: string, valor: string): HTMLLIElement {
  const li = document.createElement('li');
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'bestiario-chip';
  b.dataset[dato] = valor;
  b.textContent = texto;
  li.append(b);
  return li;
}

function entrar(id: string, conCamara = true): void {
  const region = regiones.get(id);
  if (!region) return;
  regionActual = id;
  marco.dataset.vista = 'cerca';
  marco.dataset.region = id;
  for (const g of mapa.querySelectorAll<SVGGElement>('.region')) {
    g.classList.toggle('region--elegida', g.dataset.region === id);
  }
  for (const g of mapa.querySelectorAll<SVGGElement>('.bestia')) {
    g.setAttribute('tabindex', g.dataset.region === id ? '0' : '-1');
  }
  aqui.textContent = region.nombre;
  aquiCanta.textContent = region.canta;
  aca.replaceChildren(...datos.bestias.filter((b) => b.region === id).map((b) => boton(b.nombre, 'ir', b.id)));
  alLado.replaceChildren(...region.vecinas.map((v) => boton(regiones.get(v)!.nombre, 'region', v)));
  barra.hidden = false;
  if (conCamara) irA(region.camara);
  history.replaceState(null, '', `#${id}`);
}

function salir(): void {
  regionActual = null;
  marco.dataset.vista = 'lejos';
  delete marco.dataset.region;
  for (const g of mapa.querySelectorAll<SVGGElement>('.region')) g.classList.remove('region--elegida');
  for (const g of mapa.querySelectorAll<SVGGElement>('.bestia')) g.setAttribute('tabindex', '-1');
  barra.hidden = true;
  cerrarHoja();
  irA(ENTERO);
  history.replaceState(null, '', location.pathname);
  marco.querySelector<HTMLButtonElement>('.rotulo-region')?.focus({ preventScroll: true });
}

/* ------------------------------------------------------------------
   La ficha
   ------------------------------------------------------------------ */

function elegir(id: string | null): void {
  if (elegida) mapa.querySelector(`.bestia[data-id="${elegida}"]`)?.classList.remove('bestia--elegida');
  elegida = id;
  if (id) mapa.querySelector(`.bestia[data-id="${id}"]`)?.classList.add('bestia--elegida');
}

function abrir(id: string): void {
  const b = bestias.get(id);
  const original = document.querySelector<HTMLElement>(`.bestiario-ficha[data-bestia="${id}"] .bestiario-cuerpo`);
  if (!b || !original) return;
  if (regionActual !== b.region) entrar(b.region, false);
  if (camaraActual === ENTERO) irA(regiones.get(b.region)!.camara);
  else encuadrar(b);
  rocola.parar();
  const copia = original.cloneNode(true) as HTMLElement;
  copia.querySelector('[data-titulo]')?.setAttribute('id', 'hoja-titulo');
  hojaCuerpo.replaceChildren(copia);
  hoja.hidden = false;
  hoja.scrollTop = 0;
  elegir(id);
  anotar(id);
  history.replaceState(null, '', `#${id}`);
  cerrar.focus({ preventScroll: true });
}

function cerrarHoja(): void {
  if (hoja.hidden) return;
  rocola.parar();
  hoja.hidden = true;
  const volverA = elegida;
  elegir(null);
  if (regionActual) history.replaceState(null, '', `#${regionActual}`);
  if (volverA) mapa.querySelector<SVGGElement>(`.bestia[data-id="${volverA}"]`)?.focus({ preventScroll: true });
}

function escuchar(botonEscuchar: HTMLButtonElement): void {
  const slug = botonEscuchar.dataset.escuchar!;
  const soltar = (): void => {
    botonEscuchar.classList.remove('bestiario-escuchar--sonando');
    botonEscuchar.textContent = BESTIARIO.escuchar;
  };
  if (rocola.sonando === slug) {
    rocola.parar();
    soltar();
    return;
  }
  rocola.tocar(slug, soltar);
  botonEscuchar.classList.add('bestiario-escuchar--sonando');
  botonEscuchar.textContent = BESTIARIO.sonando;
}

/* ------------------------------------------------------------------
   Los toques
   ------------------------------------------------------------------ */

mapa.addEventListener('click', (e) => {
  const objetivo = e.target as Element;
  if (marco.dataset.vista === 'cerca') {
    const g = objetivo.closest<SVGGElement>('.bestia');
    if (g) {
      abrir(g.dataset.id!);
      return;
    }
    const otra = objetivo.closest<SVGGElement>('.region');
    if (otra && otra.dataset.region !== regionActual) entrar(otra.dataset.region!);
    return;
  }
  const region = objetivo.closest<SVGGElement>('.region');
  if (region) entrar(region.dataset.region!);
});

mapa.addEventListener('keydown', (e) => {
  const g = (e.target as Element).closest<SVGGElement>('.bestia');
  if (g && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    abrir(g.dataset.id!);
  }
});

marco.querySelector('.bestiario-rotulos')!.addEventListener('click', (e) => {
  const b = (e.target as Element).closest<HTMLButtonElement>('.rotulo-region');
  if (b) entrar(b.dataset.region!);
});

barra.addEventListener('click', (e) => {
  const b = (e.target as Element).closest<HTMLButtonElement>('button');
  if (!b) return;
  if (b.dataset.region) entrar(b.dataset.region);
  else if (b.dataset.ir) abrir(b.dataset.ir);
});

volver.addEventListener('click', salir);
cerrar.addEventListener('click', cerrarHoja);

hoja.addEventListener('click', (e) => {
  const objetivo = e.target as Element;
  const ir = objetivo.closest<HTMLAnchorElement>('[data-ir]');
  if (ir) {
    e.preventDefault();
    abrir(ir.dataset.ir!);
    return;
  }
  const sonar = objetivo.closest<HTMLButtonElement>('[data-escuchar]');
  if (sonar) escuchar(sonar);
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!hoja.hidden) cerrarHoja();
  else if (regionActual) salir();
});

/* El índice: abrir una ficha ahí también la anota; "Buscala en el mapa" sube hasta el mapa. */
const indice = document.querySelector('.bestiario-indice')!;
indice.addEventListener('toggle', (e) => {
  const d = e.target as HTMLDetailsElement;
  if (d.open && d.dataset.bestia) anotar(d.dataset.bestia);
}, true);
indice.addEventListener('click', (e) => {
  const objetivo = e.target as Element;
  const ver = objetivo.closest<HTMLButtonElement>('[data-ver]');
  if (ver) {
    marco.scrollIntoView({ behavior: quieto() ? 'auto' : 'smooth', block: 'start' });
    abrir(ver.dataset.ver!);
    return;
  }
  const sonar = objetivo.closest<HTMLButtonElement>('[data-escuchar]');
  if (sonar) escuchar(sonar);
});

/* ------------------------------------------------------------------
   Arranque: lo anotado, y la dirección que trae una región o una bestia
   ------------------------------------------------------------------ */

for (const id of anotadas) pintarAnotada(id);
pintarLibreta();

/** Una dirección con `#región` o `#bestia` lleva ahí: al cargar, y si cambia con la página abierta. */
function seguirLaDireccion(): void {
  const pedido = decodeURIComponent(location.hash.slice(1));
  if (regiones.has(pedido)) {
    cerrarHoja();
    entrar(pedido);
  } else if (bestias.has(pedido)) abrir(pedido);
}

seguirLaDireccion();
window.addEventListener('hashchange', seguirLaDireccion);
