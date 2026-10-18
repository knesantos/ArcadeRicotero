/**
 * La isla del camino con cruces (`D-73`, séptima vuelta): bajar es caminar.
 *
 * La escena queda pegada a la pantalla mientras su sección pasa, y cada capa se corre a su
 * velocidad (`data-f`): lo lejano despacio, el piso a la par del dedo, lo de adelante más rápido.
 * Un píxel de bajar es un píxel de caminar, porque la sección mide eso de alto. Los ojos de lo
 * oscuro se encienden cuando se llega a ellos; el lobo suelto, en su monte, asoma cuando lo tenés
 * cerca y te sigue con la cabeza; en la pastura, el lobo y el cordero viven como en su recinto
 * (`bestiario/pastura.ts`). Al final aparece el cruce, con un cartel por región vecina.
 *
 * Tocar un bicho le hace decir su verso; tocarlo de nuevo abre su ficha, que es la misma de la
 * lista de abajo. Lo que abrís queda anotado en el teléfono, con la misma libreta del bestiario.
 *
 * Con movimiento reducido no camina nada: la escena queda como tira que se corre de costado
 * con el dedo, todo a la vista, y los bichos se tocan igual. Sin JavaScript, lo mismo.
 */

import { BESTIARIO } from '../lib/bestiario/copy.ts';
// Solo números, como la isla del bestiario: nada que dibuje (`camino.test.ts` lo vigila).
import { ACECHO, ESCALA_LOBO } from '../lib/bestiario/rig.ts';
import { ARMADO } from '../lib/bestiario/recortes.ts';
import { ALTO, camara } from '../lib/bestiario/camino.ts';
import { crearRocola } from './rocola.ts';
import { girar, hacia, parpado, partes, suave } from './bestiario/articular.ts';
import { armarPastura, type Pastura } from './bestiario/pastura.ts';

interface Datos {
  region: string;
  ancho: number;
  total: number;
  lobo: number | null;
  claro: number | null;
  bestias: readonly { id: string; nombre: string; dice: string }[];
}

const datos = JSON.parse(document.getElementById('datos-camino')!.textContent!) as Datos;
const bestias = new Map(datos.bestias.map((b) => [b.id, b]));

const camino = document.getElementById('camino')!;
const escenario = document.getElementById('escenario')!;
const piso = camino.querySelector<SVGSVGElement>('svg.capa')!;
const capas = [...camino.querySelectorAll<HTMLElement>('.capa')].map((el) => ({ el, f: Number(el.dataset.f) }));
const cruce = document.getElementById('cruce')!;
const apariciones = [...piso.querySelectorAll<SVGGElement>('.aparece')].map((el) => ({ el, x: Number(el.dataset.x) }));

const hoja = document.getElementById('hoja')!;
const hojaCuerpo = document.getElementById('hoja-cuerpo')!;
const cerrar = document.getElementById('cerrar')!;
const libreta = document.getElementById('libreta')!;
const bocadillo = document.getElementById('bocadillo')!;
const bocadilloVerso = document.getElementById('bocadillo-verso')!;
const bocadilloFicha = document.getElementById('bocadillo-ficha')!;

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

function abrir(id: string): void {
  const original = document.querySelector<HTMLElement>(`.bestiario-ficha[data-bestia="${id}"] .bestiario-cuerpo`);
  if (!original) return;
  callar();
  rocola.parar();
  volverA = document.activeElement;
  const copia = original.cloneNode(true) as HTMLElement;
  copia.querySelector('[data-titulo]')?.setAttribute('id', 'hoja-titulo');
  hojaCuerpo.replaceChildren(copia);
  hoja.hidden = false;
  hoja.scrollTop = 0;
  anotar(id);
  cerrar.focus({ preventScroll: true });
}

function cerrarHoja(): void {
  if (hoja.hidden) return;
  rocola.parar();
  hoja.hidden = true;
  if (volverA instanceof HTMLElement || volverA instanceof SVGElement) volverA.focus({ preventScroll: true });
}

function escuchar(boton: HTMLButtonElement): void {
  const slug = boton.dataset.escuchar!;
  const soltar = (): void => {
    boton.classList.remove('bestiario-escuchar--sonando');
    boton.textContent = BESTIARIO.escuchar;
  };
  if (rocola.sonando === slug) {
    rocola.parar();
    soltar();
    return;
  }
  rocola.tocar(slug, soltar);
  boton.classList.add('bestiario-escuchar--sonando');
  boton.textContent = BESTIARIO.sonando;
}

let hablando: string | null = null;
let callarEn = 0;
/** Dónde estaba la cámara cuando el bicho empezó a hablar: si se camina, el bocadillo se va. */
let camAlHablar = 0;

/** El bicho dice su verso: el bocadillo se cuelga arriba del punto de la pantalla (`sx`, `sy`). */
function hablar(id: string, sx: number, sy: number): void {
  const b = bestias.get(id);
  if (!b) return;
  if (hablando === id && !bocadillo.hidden) {
    abrir(id);
    return;
  }
  escenario.append(bocadillo);
  bocadilloVerso.textContent = `«${b.dice}»`;
  bocadilloFicha.dataset.ir = id;
  bocadillo.hidden = false;
  const caja = escenario.getBoundingClientRect();
  const ancho = bocadillo.offsetWidth;
  const alto = bocadillo.offsetHeight;
  // En coordenadas del contenido del escenario: quieto, la tira se corre de costado.
  const px = sx - caja.left - escenario.clientLeft + escenario.scrollLeft;
  const py = sy - caja.top - escenario.clientTop;
  const desde = escenario.scrollLeft + 6;
  const hasta = escenario.scrollLeft + escenario.clientWidth - ancho - 6;
  const izquierda = Math.min(Math.max(px - ancho / 2, desde), Math.max(hasta, desde));
  const abajo = py - alto - 14 < 6;
  bocadillo.classList.toggle('bocadillo--abajo', abajo);
  bocadillo.style.left = `${izquierda}px`;
  bocadillo.style.top = `${abajo ? Math.min(py + 40, escenario.clientHeight - alto - 6) : py - alto - 14}px`;
  bocadillo.style.setProperty('--punta', `${Math.min(Math.max(px - izquierda, 16), ancho - 16)}px`);
  hablando = id;
  callarEn = performance.now() + 8000;
  camAlHablar = cam;
  for (const g of piso.querySelectorAll('.bestia--elegida')) g.classList.remove('bestia--elegida');
  piso.querySelector(`.bestia[data-id="${id}"]`)?.classList.add('bestia--elegida');
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
   La cámara: el scroll de la página, pasado a lo que se camina
   ------------------------------------------------------------------ */

/** Píxeles por unidad de escena, el ancho del piso y el de la vista, en píxeles. */
let escala = 1;
let anchoPx = 0;
let vistaPx = 0;
/** Lo caminado, en píxeles: cuánto se corrió el piso. */
let cam = 0;
let andando = false;

function medir(): void {
  andando = !quieto();
  camino.classList.toggle('camino--andando', andando);
  if (!andando) {
    camino.style.removeProperty('--recorrido');
    for (const c of capas) c.el.style.removeProperty('transform');
    cam = escenario.scrollLeft;
    return;
  }
  const alto = escenario.clientHeight;
  escala = alto / ALTO;
  anchoPx = datos.ancho * escala;
  vistaPx = escenario.clientWidth;
  camino.style.setProperty('--recorrido', `${Math.round(Math.max(0, anchoPx - vistaPx) + alto)}px`);
}

/** Cuánto de la sección ya pasó, de 0 a 1. */
function avance(): number {
  const r = camino.getBoundingClientRect();
  const recorrido = r.height - escenario.clientHeight;
  return recorrido > 0 ? Math.min(1, Math.max(0, -r.top / recorrido)) : 0;
}

/** Dónde empieza y termina la caminata, en el scroll de la página. */
function tramoDeScroll(): { desde: number; hasta: number } {
  const desde = camino.getBoundingClientRect().top + window.scrollY;
  return { desde, hasta: desde + camino.offsetHeight - escenario.clientHeight };
}

function encuadrar(): void {
  if (!andando) return;
  const p = avance();
  cam = camara(p, anchoPx, vistaPx);
  for (const c of capas) c.el.style.transform = `translate3d(${(-cam * c.f).toFixed(1)}px, 0, 0)`;
  for (const a of apariciones) {
    const x = a.x * escala - cam;
    a.el.classList.toggle('aparece--a-la-vista', x > -20 && x < vistaPx * 0.92);
  }
  cruce.classList.toggle('cruce--a-la-vista', p > 0.9);
  if (hablando && Math.abs(cam - camAlHablar) > 60) callar();
}

/** Trae a la vista algo de la escena que quedó afuera (se llegó con el teclado). */
function traer(el: Element): void {
  const r = el.getBoundingClientRect();
  const caja = escenario.getBoundingClientRect();
  const centro = r.left + r.width / 2;
  if (centro > caja.left + 40 && centro < caja.right - 40) return;
  const delta = centro - (caja.left + caja.width / 2);
  // Andando, un píxel de bajar es un píxel de caminar; quieto, la tira se corre de costado.
  if (andando) window.scrollBy({ top: delta, behavior: 'instant' });
  else escenario.scrollLeft += delta;
}

/** Al cruce: andando, es el final de la caminata. */
function alCruce(enfocar: boolean): void {
  if (andando) window.scrollTo({ top: tramoDeScroll().hasta, behavior: 'instant' });
  else escenario.scrollLeft = escenario.scrollWidth;
  encuadrar();
  if (enfocar) cruce.querySelector<HTMLElement>('.cartel-cruce')?.focus({ preventScroll: true });
}

/* ------------------------------------------------------------------
   Los que viven en el camino
   ------------------------------------------------------------------ */

/** Unos ojos en lo oscuro: parpadean y se corren un poco. Tocados, pestañean. */
const ojos = [...piso.querySelectorAll<SVGGElement>('.bestia--ojos')].map((g, i) => ({
  g,
  cuerpo: g.querySelector<SVGGElement>('.cuerpo')!,
  x: Number(g.dataset.x),
  y: Number(g.dataset.y),
  semilla: i * 1.7 + (g.dataset.id?.length ?? 0),
  tocado: -10,
}));

function vivirOjos(t: number): void {
  for (const o of ojos) {
    const ciclo = (t + o.semilla * 1.9) % (4 + (o.semilla % 3));
    const cerrados = ciclo < 0.16 || (t - o.tocado > 0 && t - o.tocado < 0.5) ? 0.1 : 1;
    const corre = Math.sin(t * 0.35 + o.semilla) * 3;
    o.cuerpo.setAttribute('transform', `translate(${corre.toFixed(2)} 0) translate(${o.x} ${o.y}) scale(1 ${cerrados}) translate(${-o.x} ${-o.y})`);
  }
}

for (const o of ojos) {
  const tocar = (): void => {
    o.tocado = reloj;
    const p = enPantalla(o.g, o.x, o.y - 8);
    hablar(o.g.dataset.id!, p.x, p.y);
  };
  o.g.addEventListener('click', tocar);
  o.g.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });
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
    const centro = andando ? (cam + vistaPx / 2) / escala : x;
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

const loboDelMonte = datos.lobo !== null && datos.claro === null ? armarLoboDelMonte(datos.lobo) : null;

let reloj = 0;

/** En la pastura: el claro del recinto, corrido adentro del piso largo. */
let pastura: Pastura | null = null;
if (datos.claro !== null) {
  const marco = piso.querySelector<SVGGElement>('.claro')!;
  pastura = armarPastura(piso, {
    marco,
    hablar: (id, x, y) => {
      const p = enPantalla(marco, x, y);
      hablar(id, p.x, p.y);
    },
    quieto,
    reloj: () => reloj,
  });
}

/* ------------------------------------------------------------------
   El reloj: anda mientras la escena se ve
   ------------------------------------------------------------------ */

let antes = 0;
let corriendo = false;
let aLaVista = false;

function cuadro(ahora: number): void {
  const dt = Math.min((ahora - antes) / 1000, 0.05);
  antes = ahora;
  reloj += dt;
  encuadrar();
  vivirOjos(reloj);
  loboDelMonte?.mover(reloj, dt);
  pastura?.mover(reloj, dt);
  if (hablando && ahora > callarEn) callar();
  if (aLaVista && andando && document.visibilityState === 'visible') requestAnimationFrame(cuadro);
  else corriendo = false;
}

function arrancar(): void {
  if (corriendo || !andando || !aLaVista) return;
  corriendo = true;
  antes = performance.now();
  requestAnimationFrame(cuadro);
}

new IntersectionObserver((entradas) => {
  aLaVista = entradas.some((e) => e.isIntersecting);
  arrancar();
}).observe(camino);

document.addEventListener('visibilitychange', arrancar);

let pendiente = 0;
window.addEventListener('resize', () => {
  cancelAnimationFrame(pendiente);
  pendiente = requestAnimationFrame(() => {
    const p = avance();
    medir();
    // Al cambiar el tamaño, se queda en el mismo punto del camino.
    if (andando) {
      const { desde, hasta } = tramoDeScroll();
      window.scrollTo({ top: desde + p * (hasta - desde), behavior: 'instant' });
    }
    encuadrar();
    arrancar();
  });
});

movimiento.addEventListener('change', () => {
  medir();
  encuadrar();
  arrancar();
});

/* ------------------------------------------------------------------
   Los toques de la página
   ------------------------------------------------------------------ */

// Con el teclado, lo que recibe el foco adentro de la escena se trae a la vista; el cruce,
// andando, está al final de la caminata.
escenario.addEventListener('focusin', (ev) => {
  const el = ev.target as Element;
  if (cruce.contains(el)) {
    if (andando && !cruce.classList.contains('cruce--a-la-vista')) alCruce(false);
  } else if (el.closest('.bestia, .titere')) traer(el);
});

camino.querySelector('.camino-saltar')!.addEventListener('click', (ev) => {
  ev.preventDefault();
  alCruce(true);
});

bocadilloFicha.addEventListener('click', () => abrir(bocadilloFicha.dataset.ir!));
cerrar.addEventListener('click', cerrarHoja);

document.addEventListener('keydown', (ev) => {
  if (ev.key !== 'Escape') return;
  if (!hoja.hidden) cerrarHoja();
  else callar();
});

document.addEventListener('click', (ev) => {
  const el = ev.target as Element;
  const escucha = el.closest<HTMLButtonElement>('[data-escuchar]');
  if (escucha) {
    escuchar(escucha);
    return;
  }
  // Un vecino de "Anda cerca" que vive en esta página abre su ficha acá; si vive en otra,
  // el enlace lleva a su página.
  const ir = el.closest<HTMLElement>('[data-ir]');
  if (ir && ir !== bocadilloFicha && bestias.has(ir.dataset.ir!)) {
    ev.preventDefault();
    abrir(ir.dataset.ir!);
    return;
  }
  // Tocar la escena fuera de un bicho calla el bocadillo.
  if (!bocadillo.hidden && !el.closest('.bocadillo, .bestia, .titere')) callar();
});

/* ------------------------------------------------------------------
   Arranque
   ------------------------------------------------------------------ */

for (const id of anotadas) if (bestias.has(id)) pintarAnotada(id);
pintarLibreta();
medir();
encuadrar();
// Se llegó al cruce volviendo de la región de al lado (`#cruce`): se aparece al final del camino.
if (location.hash === '#cruce') requestAnimationFrame(() => alCruce(false));
arrancar();
