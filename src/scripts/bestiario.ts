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
import {
  ACECHO, ACHATE, BAJO, DRACULA, DRACULA_ARMADO, ESCALA_CORDERO, ESCALA_LOBO, LUZBELITO as LUZ, MOMO as MOMO_ESC, PALO, PIERRE, PIERRE_ARMADO, PRISION,
  SOGA, profundidad,
} from '../lib/bestiario/rig.ts';
import { ARMADO } from '../lib/bestiario/recortes.ts';
import { ESPERA, GUARDADO } from '../lib/bestiario/carga.ts';
import { crearRocola } from './rocola.ts';

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
const bocadilloFicha = document.getElementById('bocadillo-ficha')!;

const rocola = crearRocola();
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
  cerrar.focus({ preventScroll: true });
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

/**
 * El bicho dice su verso: el bocadillo aparece arriba de él, adentro de su escena. Las escenas
 * de noche se corren de costado, así que todo se mide contra lo que se ve, no contra la escena
 * entera: si el bicho quedó afuera (se llegó con el teclado), la escena lo trae primero.
 * `abajo` lo cuelga debajo del punto aunque arriba entre: el gordo Pierre llena la pantalla del
 * teléfono, y arriba le taparía la cara mientras se ríe.
 */
function hablar(id: string, escena: HTMLElement, svg: SVGSVGElement, x: number, y: number, preferirAbajo = false): void {
  const b = bestias.get(id);
  if (!b || !svg.getScreenCTM()) return;
  if (hablando === id && !bocadillo.hidden) {
    abrir(id);
    return;
  }
  let p = new DOMPoint(x, y).matrixTransform(svg.getScreenCTM()!);
  let caja = escena.getBoundingClientRect();
  if (p.x < caja.left + 40 || p.x > caja.right - 40) {
    escena.scrollLeft += p.x - (caja.left + caja.width / 2);
    p = new DOMPoint(x, y).matrixTransform(svg.getScreenCTM()!);
    caja = escena.getBoundingClientRect();
  }
  escena.append(bocadillo);
  bocadilloVerso.textContent = `«${b.dice}»`;
  bocadilloFicha.dataset.ir = id;
  bocadillo.hidden = false;
  const ancho = bocadillo.offsetWidth;
  const alto = bocadillo.offsetHeight;
  // En coordenadas del contenido de la escena: lo corrido de costado se suma, el borde se resta.
  const px = p.x - caja.left - escena.clientLeft + escena.scrollLeft;
  const py = p.y - caja.top - escena.clientTop;
  const desde = escena.scrollLeft + 6;
  const hasta = escena.scrollLeft + escena.clientWidth - ancho - 6;
  const izquierda = Math.min(Math.max(px - ancho / 2, desde), Math.max(hasta, desde));
  // Si arriba no entra, va abajo del bicho, con la punta para arriba.
  const abajo = preferirAbajo || py - alto - 14 < 6;
  bocadillo.classList.toggle('bocadillo--abajo', abajo);
  bocadillo.style.left = `${izquierda}px`;
  bocadillo.style.top = `${abajo ? Math.min(py + 52, escena.clientHeight - alto - 6) : py - alto - 14}px`;
  bocadillo.style.setProperty('--punta', `${Math.min(Math.max(px - izquierda, 16), ancho - 16)}px`);
  hablando = id;
  callarEn = performance.now() + 8000;
  for (const g of document.querySelectorAll('.bestia--elegida')) g.classList.remove('bestia--elegida');
  escena.querySelector(`.bestia[data-id="${id}"]`)?.classList.add('bestia--elegida');
}

function callar(): void {
  bocadillo.hidden = true;
  hablando = null;
  for (const g of document.querySelectorAll('.bestia--elegida')) g.classList.remove('bestia--elegida');
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
   Los bichos del mapa, en su recinto: respiran, se balancean, saltan
   ------------------------------------------------------------------ */

interface Pieza {
  g: SVGGElement;
  cuerpo: SVGGElement;
  x: number;
  y: number;
  pie: number;
  semilla: number;
  saltoDesde: number;
  proximoSalto: number;
}

function piezas(escena: HTMLElement): Pieza[] {
  return [...escena.querySelectorAll<SVGGElement>('.bestia')].map((g, i) => {
    const toque = g.querySelector('circle.toque');
    const r = toque ? Number(toque.getAttribute('r')) : 20;
    return {
      g,
      cuerpo: g.querySelector<SVGGElement>('.cuerpo')!,
      x: Number(g.dataset.x),
      y: Number(g.dataset.y),
      pie: Number(g.dataset.y) + r * 0.9,
      semilla: i * 1.7 + (g.dataset.id?.length ?? 0),
      saltoDesde: -10,
      proximoSalto: 3 + ((i * 2.3) % 7),
    };
  });
}

/** Un saltito: medio segundo de parábola. */
const salto = (p: Pieza, t: number): number => {
  const s = (t - p.saltoDesde) / 0.45;
  return s >= 0 && s <= 1 ? -9 * 4 * s * (1 - s) : 0;
};

function vivir(p: Pieza, t: number, extra = ''): void {
  if (p.g.classList.contains('bestia--ojos')) {
    // Unos ojos en lo oscuro no saltan: parpadean, y a veces se corren un poco.
    const ciclo = (t + p.semilla * 1.9) % (4 + (p.semilla % 3));
    const cerrados = ciclo < 0.16 || (t - p.saltoDesde > 0 && t - p.saltoDesde < 0.5) ? 0.1 : 1;
    const corre = Math.sin(t * 0.35 + p.semilla) * 3;
    p.cuerpo.setAttribute('transform', `${extra}translate(${corre.toFixed(2)} 0) translate(${p.x} ${p.y}) scale(1 ${cerrados}) translate(${-p.x} ${-p.y})`);
    return;
  }
  if (t > p.proximoSalto) {
    p.saltoDesde = t;
    p.proximoSalto = t + 5 + ((p.semilla * 3.1) % 8);
  }
  const respira = Math.sin(t * 2.1 + p.semilla) * 1.2;
  const balanceo = Math.sin(t * 1.3 + p.semilla * 0.7) * 2.2;
  p.cuerpo.setAttribute(
    'transform',
    `${extra}translate(0 ${(respira + salto(p, t)).toFixed(2)}) rotate(${balanceo.toFixed(2)} ${p.x} ${p.pie.toFixed(1)})`,
  );
}

function recintoDeMapa(escena: HTMLElement, svg: SVGSVGElement): Recinto {
  const lista = piezas(escena);
  return {
    escena,
    svg,
    mover: (t) => lista.forEach((p) => vivir(p, t)),
    reaccionar: (id, t) => {
      const p = lista.find((x) => x.g.dataset.id === id);
      if (p) p.saltoDesde = t;
    },
  };
}

/** La ruta: los fierros pasan, cada uno a su velocidad, y vuelven a entrar por el otro lado. */
function recintoDeRuta(escena: HTMLElement, svg: SVGSVGElement): Recinto {
  const lista = piezas(escena);
  const ancho = svg.viewBox.baseVal.width;
  return {
    escena,
    svg,
    mover: (t) =>
      lista.forEach((p, i) => {
        const velocidad = 14 + (i % 3) * 7;
        const x = ((p.x + t * velocidad + 60) % (ancho + 120)) - 60;
        vivir(p, t, `translate(${(x - p.x).toFixed(1)} 0) `);
        p.g.dataset.ahora = x.toFixed(1);
      }),
    reaccionar: (id, t) => {
      const p = lista.find((x) => x.g.dataset.id === id);
      if (p) p.saltoDesde = t;
    },
  };
}

/* ------------------------------------------------------------------
   Los títeres: el lobo suelto y el cordero atado, recortados de las tapas
   ------------------------------------------------------------------ */

type Parte = SVGGraphicsElement;

function partes(titere: SVGGElement): Map<string, Parte> {
  const m = new Map<string, Parte>();
  for (const el of titere.querySelectorAll<Parte>('[data-parte]')) m.set(el.dataset.parte!, el);
  return m;
}

const girar = (el: Parte | undefined, ang: number, [px, py]: readonly [number, number], mas = ''): void =>
  el?.setAttribute('transform', `${mas}rotate(${ang.toFixed(2)} ${px} ${py})`);

/** Un párpado: baja desde su pivote. `k` va de 0 (abierto) a 1 (cerrado). */
function parpado(el: Parte | undefined, k: number): void {
  if (!el) return;
  const [px, py] = (el.dataset.pivote ?? '0 0').split(' ').map(Number) as [number, number];
  el.setAttribute('transform', `translate(${px} ${py}) scale(1 ${k.toFixed(2)}) translate(${-px} ${-py})`);
}

const hacia = (actual: number, meta: number, paso: number): number =>
  Math.abs(meta - actual) <= paso ? meta : actual + Math.sign(meta - actual) * paso;
const suave = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/** Del piso de la pastura (u, v) a la pantalla de la escena. */
const enPantalla = (u: number, v: number): { x: number; y: number } => ({ x: PALO.x + u, y: PALO.y + v * ACHATE });

function recintoDelMonte(escena: HTMLElement, svg: SVGSVGElement): Recinto {
  const deMapa = recintoDeMapa(escena, svg);
  const gLobo = svg.querySelector<SVGGElement>('.titere--lobo')!;
  const gCordero = svg.querySelector<SVGGElement>('.titere--cordero')!;
  const soga = svg.querySelector<SVGPathElement>('#soga')!;
  const pl = partes(gLobo);
  const pc = partes(gCordero);
  const AL = ARMADO.lobo;
  const AC = ARMADO.cordero;

  /**
   * El lobo acecha: está hundido detrás del borde del piso, se corre sin que se vea, sube
   * despacio, mira al cordero un rato y se vuelve a hundir. `alzado` va de 0 (no se ve) a 1.
   */
  const lobo = { x: 300, alzado: 0, modo: 'hundido' as 'hundido' | 'sube' | 'mira' | 'baja', desde: 0, hasta: 1.5, parpadeo: 2 };
  const oveja = { u: 24, v: 18, mu: 24, mv: 18, mira: 1, paso: 0, patas: 0, cambio: 1, modo: 'pasta' as string, balaHasta: -1, parpadeo: 3.4, s: 1 };
  let arrastre: { id: number; x0: number; y0: number; movido: boolean } | null = null;

  const pantallaOveja = (): { x: number; y: number } => enPantalla(oveja.u, oveja.v);

  function aPiso(ev: PointerEvent): { u: number; v: number } {
    const p = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(svg.getScreenCTM()!.inverse());
    return { u: p.x - PALO.x, v: (p.y - PALO.y) / ACHATE };
  }

  function atar(u: number, v: number): { u: number; v: number; r: number } {
    const r = Math.hypot(u, v);
    const tope = SOGA - 4;
    return r > tope ? { u: (u / r) * tope, v: (v / r) * tope, r: tope } : { u, v, r };
  }

  gCordero.addEventListener('pointerdown', (ev) => {
    arrastre = { id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, movido: false };
    gCordero.setPointerCapture(ev.pointerId);
  });
  gCordero.addEventListener('pointermove', (ev) => {
    if (!arrastre || arrastre.id !== ev.pointerId) return;
    if (!arrastre.movido && Math.hypot(ev.clientX - arrastre.x0, ev.clientY - arrastre.y0) < 6) return;
    arrastre.movido = true;
    const piso = aPiso(ev);
    const p = atar(piso.u, piso.v);
    if (Math.abs(p.u - oveja.u) > 0.3) oveja.mira = Math.sign(p.u - oveja.u);
    oveja.u = p.u;
    oveja.v = p.v;
    oveja.modo = 'arrastrado';
    if (quieto()) pintar(reloj);
    ev.preventDefault();
  });
  const soltar = (ev: PointerEvent): void => {
    if (!arrastre || arrastre.id !== ev.pointerId) return;
    const fueToque = !arrastre.movido;
    arrastre = null;
    oveja.modo = 'mira';
    oveja.cambio = reloj + 1.2;
    oveja.mu = oveja.u;
    oveja.mv = oveja.v;
    if (fueToque) tocar('el-cordero-atado');
  };
  gCordero.addEventListener('pointerup', soltar);
  gCordero.addEventListener('pointercancel', soltar);

  /** Dónde está la punta de arriba de cada títere, para el bocadillo. */
  function arribaDe(id: string): { x: number; y: number } {
    if (id === 'el-lobo-suelto') {
      return { x: lobo.x, y: ACECHO.piso + (1 - lobo.alzado) * ACECHO.hundido - (AL.piso[1] - 40) * ESCALA_LOBO };
    }
    const o = pantallaOveja();
    return { x: o.x, y: o.y - (AC.piso[1] + 40) * ESCALA_CORDERO * oveja.s };
  }

  function tocar(id: string): void {
    reaccionar(id, reloj);
    const p = arribaDe(id);
    hablar(id, escena, svg, p.x, p.y);
  }

  function reaccionar(id: string, t: number): void {
    if (id === 'el-lobo-suelto') {
      // Tocado, asoma ya, y se queda mirando más tiempo.
      if (lobo.modo !== 'mira') {
        lobo.modo = 'sube';
        lobo.desde = t - lobo.alzado * 1.4;
      }
      lobo.hasta = t + 7;
    } else if (id === 'el-cordero-atado') oveja.balaHasta = t + 1.2;
    else deMapa.reaccionar(id, t);
    if (quieto()) pintar(t);
  }

  function moverLobo(t: number): void {
    const objetivo = Math.min(ACECHO.hasta, Math.max(ACECHO.desde, pantallaOveja().x + (Math.random() - 0.5) * 220));
    switch (lobo.modo) {
      case 'hundido':
        lobo.alzado = 0;
        if (t > lobo.hasta) {
          lobo.x = objetivo;
          lobo.modo = 'sube';
          lobo.desde = t;
        }
        break;
      case 'sube':
        lobo.alzado = suave((t - lobo.desde) / 1.6);
        if (lobo.alzado >= 1) {
          lobo.modo = 'mira';
          lobo.hasta = Math.max(lobo.hasta, t + 4 + Math.random() * 3);
        }
        break;
      case 'mira':
        lobo.alzado = 1;
        if (t > lobo.hasta) {
          lobo.modo = 'baja';
          lobo.desde = t;
        }
        break;
      case 'baja':
        lobo.alzado = 1 - suave((t - lobo.desde) / 1.4);
        if (lobo.alzado <= 0) {
          lobo.modo = 'hundido';
          lobo.hasta = t + 1.5 + Math.random() * 2.5;
        }
        break;
    }
  }

  function moverOveja(t: number, dt: number): void {
    if (oveja.modo === 'arrastrado') {
      oveja.paso += dt * 9;
      oveja.patas = 1;
      return;
    }
    // Si el lobo asoma cerca, huye para adelante y al otro lado, hasta donde le dé la soga.
    const asoma = lobo.alzado > 0.6 && Math.abs(lobo.x - pantallaOveja().x) < 200;
    if (asoma && oveja.modo !== 'huye') {
      const lu = lobo.x - PALO.x;
      oveja.mu = -Math.sign(lu || 1) * (SOGA * 0.5);
      oveja.mv = SOGA + 30;
      oveja.modo = 'huye';
      oveja.cambio = t + 3;
    } else if (t > oveja.cambio && oveja.modo !== 'huye') {
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * (SOGA * 0.8);
      const quedarse = Math.random() < 0.45;
      oveja.mu = quedarse ? oveja.u : Math.cos(a) * d;
      oveja.mv = quedarse ? oveja.v : Math.sin(a) * d;
      oveja.modo = quedarse ? 'pasta' : 'camina';
      oveja.cambio = t + 3 + Math.random() * 3;
    }
    const velocidad = oveja.modo === 'huye' ? 44 : 16;
    const du = oveja.mu - oveja.u;
    const dv = oveja.mv - oveja.v;
    const falta = Math.hypot(du, dv);
    let anda = false;
    if (falta > 2) {
      const paso = Math.min(falta, velocidad * dt);
      const p = atar(oveja.u + (du / falta) * paso, oveja.v + (dv / falta) * paso);
      anda = Math.hypot(p.u - oveja.u, p.v - oveja.v) > 0.05;
      if (Math.abs(p.u - oveja.u) > 0.05) oveja.mira = Math.sign(p.u - oveja.u);
      oveja.u = p.u;
      oveja.v = p.v;
    } else if (oveja.modo === 'camina') oveja.modo = 'pasta';
    if (oveja.modo === 'huye' && !anda && t > oveja.cambio) oveja.modo = 'mira';
    if (anda) oveja.paso += dt * (oveja.modo === 'huye' ? 11 : 7);
    oveja.patas = hacia(oveja.patas, anda ? 1 : 0, dt * 5);
  }

  function pintar(t: number): void {
    // El lobo: el busto sube desde atrás del piso; la cabeza se ladea hacia el cordero.
    const o = pantallaOveja();
    const y = ACECHO.piso + (1 - lobo.alzado) * ACECHO.hundido;
    gLobo.setAttribute('transform', `translate(${lobo.x.toFixed(1)} ${y.toFixed(1)}) scale(${ESCALA_LOBO}) translate(${-AL.piso[0]} ${-AL.piso[1]})`);
    const respira = Math.sin(t * 1.7) * 0.012;
    pl.get('pecho')?.setAttribute('transform', `translate(${AL.piso[0]} ${AL.piso[1]}) scale(1 ${(1 + respira).toFixed(4)}) translate(${-AL.piso[0]} ${-AL.piso[1]})`);
    const ladeo = Math.max(-7, Math.min(7, (o.x - lobo.x) / 30)) + Math.sin(t * 0.7) * 1.2;
    girar(pl.get('cabeza'), ladeo, AL.cabeza, `translate(0 ${(-respira * 300).toFixed(2)}) `);
    if (t > lobo.parpadeo + 0.15) lobo.parpadeo = t + 2.5 + Math.random() * 4;
    const ciega = t > lobo.parpadeo && t < lobo.parpadeo + 0.15 ? 1 : 0;
    parpado(pl.get('parpado-1'), ciega);
    parpado(pl.get('parpado-2'), ciega);

    // El cordero: las dos patas de la tapa, que se turnan al andar.
    oveja.s = profundidad(o.y);
    const s = ESCALA_CORDERO * oveja.s;
    const bala = t < oveja.balaHasta;
    const salto = bala ? -Math.sin(((oveja.balaHasta - t) / 1.2) * Math.PI) * 12 : 0;
    const bote = -Math.abs(Math.sin(oveja.paso)) * 2.4 * oveja.patas;
    gCordero.setAttribute(
      'transform',
      `translate(${o.x.toFixed(1)} ${(o.y + salto + bote).toFixed(1)}) scale(${(oveja.mira * s).toFixed(4)} ${s.toFixed(4)}) translate(${-AC.piso[0]} ${-AC.piso[1]})`,
    );
    const b = Math.sin(oveja.paso) * 9 * oveja.patas;
    girar(pc.get('pata-tras'), b, AC['pata-tras']);
    girar(pc.get('pata-del'), -b, AC['pata-del']);
    const respiraC = Math.sin(t * 2.2) * 0.012;
    pc.get('cuerpo')?.setAttribute('transform', `translate(${AC.piso[0]} 700) scale(1 ${(1 + respiraC).toFixed(4)}) translate(${-AC.piso[0]} -700)`);
    const pasta = oveja.modo === 'pasta' && !bala;
    girar(pc.get('cabeza'), bala ? -8 : pasta ? 6 + Math.sin(t * 3) * 1.5 : Math.sin(t * 0.8) * 2.5, AC.cabeza);
    if (t > oveja.parpadeo + 0.17) oveja.parpadeo = t + 2 + Math.random() * 4;
    const cierra = t > oveja.parpadeo && t < oveja.parpadeo + 0.17 ? 1 : 0;
    parpado(pc.get('parpado-1'), cierra);
    parpado(pc.get('parpado-2'), cierra);

    // La soga: del palo al cogote. Tensa cuando el cordero está en la punta.
    const [nx0, ny0] = AC.nudo;
    const nx = o.x + (nx0 - AC.piso[0]) * oveja.mira * s;
    const ny = o.y + salto + bote + (ny0 - AC.piso[1]) * s;
    const ax = PALO.x;
    const ay = PALO.y - 46;
    const tension = Math.min(1, Math.hypot(oveja.u, oveja.v) / (SOGA - 4));
    const comba = (1 - tension) * 24 + 2;
    soga.setAttribute('d', `M${ax} ${ay} Q${((ax + nx) / 2).toFixed(1)} ${((ay + ny) / 2 + comba).toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`);
    soga.classList.toggle('soga--tensa', tension > 0.97);
  }

  gLobo.addEventListener('click', () => tocar('el-lobo-suelto'));
  for (const g of [gLobo, gCordero]) {
    g.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        tocar(g.dataset.id!);
      }
    });
  }

  // Con movimiento reducido el lobo queda asomado y quieto, y el cordero en su lugar.
  if (quieto()) {
    lobo.alzado = 1;
    lobo.modo = 'mira';
    lobo.x = 560;
  }
  pintar(0);

  return {
    escena,
    svg,
    mover: (t, dt) => {
      deMapa.mover(t, dt);
      moverLobo(t);
      moverOveja(t, dt);
      pintar(t);
    },
    reaccionar,
  };
}

/* ------------------------------------------------------------------
   Los protagonistas de tapa de los otros recintos: el perro, Luzbelito y Momo
   ------------------------------------------------------------------ */

/** El perro de *Un baión*, en el borde del baldío: sigue ahí, y de a ratos ladra. */
function recintoDelPerro(escena: HTMLElement, svg: SVGSVGElement): Recinto {
  const deMapa = recintoDeMapa(escena, svg);
  const g = svg.querySelector<SVGGElement>('.titere--perro')!;
  const p = partes(g);
  const base = g.getAttribute('transform') ?? '';
  const AP = ARMADO.perro;
  let ladraDesde = -10;
  let ladridos = 0;
  let proximo = 2.5;

  function pintar(t: number): void {
    if (t > proximo) {
      ladraDesde = t;
      ladridos = 2 + Math.floor(Math.random() * 2);
      proximo = t + 4 + Math.random() * 4;
    }
    // Cada ladrido es una abierta y cerrada de la mandíbula, de un cuarto de segundo.
    const s = (t - ladraDesde) / 0.26;
    const abre = s >= 0 && s < ladridos ? Math.sin((s % 1) * Math.PI) : 0;
    girar(p.get('mandibula'), abre * 16, AP.mandibula);
    girar(p.get('cabeza'), -abre * 3 + Math.sin(t * 1.1) * 0.8, AP.cabeza);
    // Respira y se asoma un poco más o un poco menos, sin dejar el borde.
    const asoma = Math.sin(t * 0.45) * 8 + abre * 4;
    g.setAttribute('transform', `translate(${asoma.toFixed(1)} ${(Math.sin(t * 1.9) * 1.5).toFixed(1)}) ${base}`);
  }

  const tocar = (): void => {
    ladraDesde = reloj;
    ladridos = 3;
    if (quieto()) pintar(reloj);
    hablar('ese-perro-que-sigue-alli', escena, svg, 150, 300);
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
    escena,
    svg,
    mover: (t, dt) => {
      deMapa.mover(t, dt);
      pintar(t);
    },
    reaccionar: (id, t) => {
      if (id === 'ese-perro-que-sigue-alli') {
        ladraDesde = t;
        ladridos = 3;
      } else deMapa.reaccionar(id, t);
    },
  };
}

/** Luzbelito en su piedra: la llama titila, el resplandor la sigue, y el busto se mece apenas. */
function recintoDeLuzbelito(escena: HTMLElement, svg: SVGSVGElement): Recinto {
  const deMapa = recintoDeMapa(escena, svg);
  const g = svg.querySelector<SVGGElement>('.titere--luzbelito')!;
  const p = partes(g);
  const luz = svg.querySelector<SVGGElement>('.luz-de-vela')!;
  const lx = Number(luz.dataset.x);
  const ly = Number(luz.dataset.y);
  const AL = ARMADO.luzbelito;
  let avivaHasta = -1;

  function pintar(t: number): void {
    const aviva = t < avivaHasta ? 1 : 0;
    // La llama: un temblor que no se repite, hecho de dos senos que no se encuentran.
    const temblor = Math.sin(t * 13) * 0.5 + Math.sin(t * 7.3) * 0.5;
    const alto = 1 + temblor * 0.12 + aviva * 0.6;
    const ladeo = Math.sin(t * 5.1) * 5;
    const [fx, fy] = [AL.llama[0], AL.llama[1] + 8];
    p.get('llama')?.setAttribute('transform', `translate(${fx} ${fy}) rotate(${ladeo.toFixed(1)}) scale(${(1 + aviva * 0.3).toFixed(2)} ${alto.toFixed(3)}) translate(${-fx} ${-fy})`);
    const brillo = 0.75 + temblor * 0.15 + aviva * 0.25;
    luz.setAttribute('transform', `translate(${lx} ${ly}) scale(${(0.9 + temblor * 0.08 + aviva * 0.35).toFixed(3)})`);
    luz.setAttribute('opacity', brillo.toFixed(2));
    girar(p.get('busto'), Math.sin(t * 0.6) * 1.4, AL.cuello);
  }

  const tocar = (): void => {
    avivaHasta = reloj + 0.9;
    if (quieto()) pintar(reloj);
    hablar('luzbelito', escena, svg, LUZ.x, LUZ.y - 250 * LUZ.escala);
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
    escena,
    svg,
    mover: (t, dt) => {
      deMapa.mover(t, dt);
      pintar(t);
    },
    reaccionar: (id, t) => {
      if (id === 'luzbelito') avivaHasta = t + 0.9;
      else deMapa.reaccionar(id, t);
    },
  };
}

/** El medallón de Momo cuelga de su cordón: se mece, le pasa un brillo, y tocado, gira. */
function recintoDeMomo(escena: HTMLElement, svg: SVGSVGElement): Recinto {
  const deMapa = recintoDeMapa(escena, svg);
  const g = svg.querySelector<SVGGElement>('.titere--momo')!;
  const p = partes(g);
  const AM = ARMADO.momo;
  let giraDesde = -10;
  let empujon = 0;

  function pintar(t: number): void {
    // El péndulo, con el empujón del toque que se va apagando.
    const gira = (t - giraDesde) / 1.3;
    const amplitud = 4 + empujon * Math.exp(-(t - giraDesde) * 0.8);
    const angulo = Math.sin(t * 1.5) * amplitud;
    p.get('pendulo')?.setAttribute('transform', `rotate(${angulo.toFixed(2)} ${MOMO_ESC.cuelga.x} ${MOMO_ESC.cuelga.y})`);
    // El giro: el medallón se da vuelta como una moneda, una vez.
    const ancho = gira >= 0 && gira < 1 ? Math.cos(gira * Math.PI * 2) : 1;
    const [cx, cy] = AM.centro;
    p.get('medallon')?.setAttribute('transform', `translate(${cx} ${cy}) scale(${ancho.toFixed(3)} 1) translate(${-cx} ${-cy})`);
    // El brillo: cruza el medallón cada tanto, de izquierda a derecha.
    const pasada = (t % 4.5) / 1.2;
    const dx = pasada < 1 ? -420 + pasada * 840 : 600;
    p.get('brillo')?.setAttribute('transform', `translate(${(cx + dx).toFixed(1)} ${cy}) scale(1.6)`);
  }

  const tocar = (): void => {
    giraDesde = reloj;
    empujon = 10;
    if (quieto()) pintar(reloj);
    hablar('momo', escena, svg, MOMO_ESC.argolla.x, MOMO_ESC.argolla.y - 20);
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
    escena,
    svg,
    mover: (t, dt) => {
      deMapa.mover(t, dt);
      pintar(t);
    },
    reaccionar: (id, t) => {
      if (id === 'momo') {
        giraDesde = t;
        empujon = 10;
      } else deMapa.reaccionar(id, t);
    },
  };
}


/* ------------------------------------------------------------------
   El gordo Pierre, en la sala inundada (sexta vuelta)
   ------------------------------------------------------------------ */

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Pierre flota con el agua y respira; cada tanto se empina la botella o se ríe solo. Tocado, se
 * ríe a carcajadas hasta que tose, que es lo que dice la letra: *"Cómo se ríe el gordo Pierre /
 * [...] y cómo tose el gordo Pierre"*. Cuando se sacude, la panza le hace ondas en el agua.
 * Mientras tanto el agua entra por el vidrio roto sin parar, y afuera llueve.
 */
function recintoDePierre(escena: HTMLElement, svg: SVGSVGElement): Recinto {
  const deMapa = recintoDeMapa(escena, svg);
  const g = svg.querySelector<SVGGElement>('.titere--pierre')!;
  const entero = svg.querySelector<SVGGElement>('#pierre-entero')!;
  const p = partes(g);
  const reflejo = svg.querySelector<SVGGElement>('[data-parte="reflejo"]');
  const lluvia = svg.querySelector<SVGGElement>('[data-parte="lluvia"]');
  const chorros = [...svg.querySelectorAll<SVGPathElement>('.bajo-chorro')];
  const capas = new Map([...svg.querySelectorAll<SVGGElement>('.bajo-ondas-vivas')].map((c) => [c.dataset.onda ?? '', c]));
  const AP = PIERRE_ARMADO;
  const { x: px, agua, escala } = PIERRE;

  type Modo = 'quieto' | 'trago' | 'risa' | 'tos';
  let modo: Modo = 'quieto';
  let desde = 0;
  let dura = 0;
  let tosDespues = false;
  let proximo = 5;
  let parpadeo = 2.2;
  let proximaOnda = 0;
  let proximaGota = 0;

  function empezar(m: Modo, t: number, segundos: number): void {
    modo = m;
    desde = t;
    dura = segundos;
  }

  /**
   * Las ondas en el agua: anillos que se abren y se apagan, y se reciclan. Las de Pierre van
   * partidas en dos capas: la mitad de atrás pasa por detrás de él y la de adelante, por delante.
   */
  interface Onda { anillos: SVGEllipseElement[]; x: number; y: number; desde: number; vida: number; r0: number; r1: number }
  const pozos: Record<'pierre' | 'puerta', Onda[]> = { pierre: [], puerta: [] };
  function onda(cual: 'pierre' | 'puerta', x: number, y: number, t: number, r0: number, r1: number, vida: number): void {
    const pozo = pozos[cual];
    let o = pozo.find((w) => t - w.desde > w.vida);
    if (!o) {
      if (pozo.length >= 7) return;
      const anillos = (cual === 'pierre' ? ['pierre-atras', 'pierre'] : ['puerta']).map((n) => {
        const e = document.createElementNS(SVG_NS, 'ellipse');
        e.setAttribute('class', 'bajo-onda');
        capas.get(n)?.append(e);
        return e;
      });
      o = { anillos, x, y, desde: t, vida, r0, r1 };
      pozo.push(o);
    }
    Object.assign(o, { x, y, desde: t, vida, r0, r1 });
  }

  function pintarOndas(t: number): void {
    for (const o of [...pozos.pierre, ...pozos.puerta]) {
      const k = (t - o.desde) / o.vida;
      const rx = o.r0 + (o.r1 - o.r0) * suave(k);
      for (const e of o.anillos) {
        if (k < 0 || k > 1) {
          e.setAttribute('opacity', '0');
          continue;
        }
        e.setAttribute('cx', o.x.toFixed(1));
        e.setAttribute('cy', o.y.toFixed(1));
        e.setAttribute('rx', rx.toFixed(1));
        e.setAttribute('ry', (rx * 0.13).toFixed(1));
        e.setAttribute('opacity', ((1 - k) * 0.75).toFixed(2));
      }
    }
  }

  function pintar(t: number): void {
    // Lo que cambia según qué hace: la boca, la cabeza, el brazo, los ojos y el temblor.
    let boca = 0;
    let cabezaDy = 0;
    let cabezaGiro = Math.sin(t * 0.7) * 1.4;
    let cabezaSy = 1;
    let brazo = Math.sin(t * 0.5) * 2;
    let antebrazo = Math.sin(t * 0.8 + 1) * 1.5;
    let achina = 0;
    let sacude = 0;
    let encoge = 0;
    const k = dura ? (t - desde) / dura : 1;
    if (modo !== 'quieto' && k >= 1) {
      if (modo === 'risa' && tosDespues) {
        tosDespues = false;
        empezar('tos', t, 1.35);
      } else {
        modo = 'quieto';
        proximo = t + 6 + Math.random() * 6;
      }
    } else if (modo === 'trago') {
      // Levanta la botella, se la empina con la cabeza para atrás, traga dos veces y la baja.
      const sube = k < 0.3 ? suave(k / 0.3) : k < 0.72 ? 1 : 1 - suave((k - 0.72) / 0.28);
      const traga = k > 0.34 && k < 0.7 ? Math.max(0, Math.sin((k - 0.34) * Math.PI * 2 * 2.8)) : 0;
      brazo = AP.trago.brazo * sube;
      antebrazo = AP.trago.antebrazo * sube;
      cabezaDy = -7 * sube + traga * 2;
      cabezaGiro = -5 * sube;
      cabezaSy = 1 - 0.03 * sube;
      boca = 7 * sube;
      achina = 0.7 * sube;
    } else if (modo === 'risa') {
      // La carcajada: la boca se abre y se cierra a cuatro por segundo, la cabeza se va para
      // atrás, la panza tiembla al doble, y los ojos se achinan.
      const entra = Math.min(1, (t - desde) / 0.18, (desde + dura - t) / 0.25);
      const fase = (t - desde) * Math.PI * 2 * 4.4;
      boca = (5 + (0.5 + 0.5 * Math.sin(fase)) * 14) * entra;
      cabezaDy = -5 * entra + Math.sin(fase) * 1.5 * entra;
      cabezaGiro = (-3 + Math.sin(fase * 0.5) * 3) * entra;
      brazo = (-8 + Math.sin(fase) * 4) * entra;
      antebrazo = Math.sin(fase + 1) * 5 * entra;
      achina = 0.62 * entra;
      sacude = Math.sin(fase * 2) * 2 * entra;
      if (t > proximaOnda && !quieto()) {
        onda('pierre', px, agua + 2, t, 140 * escala, 270 * escala, 1.4);
        proximaOnda = t + 0.24;
      }
    } else if (modo === 'tos') {
      // Tres golpes de tos: se encoge, cierra los ojos, abre la boca y la cabeza se le va abajo.
      const u = ((t - desde) / (dura / 3)) % 1;
      const golpe = u < 0.28 ? suave(u / 0.28) : 1 - suave((u - 0.28) / 0.72);
      boca = 13 * golpe;
      cabezaDy = 9 * golpe;
      cabezaSy = 1 - 0.05 * golpe;
      cabezaGiro = 3 * golpe;
      brazo = 6 * golpe;
      antebrazo = -10 * golpe;
      achina = Math.max(0.6, golpe);
      encoge = golpe;
      if (u < 0.1 && t > proximaOnda && !quieto()) {
        onda('pierre', px, agua + 2, t, 150 * escala, 240 * escala, 1.1);
        proximaOnda = t + 0.3;
      }
    } else if (t > proximo && !quieto()) {
      // Solo: se empina la botella, o se ríe de algo que se acordó.
      if (Math.random() < 0.6) empezar('trago', t, 3.4);
      else empezar('risa', t, 1.3);
    }

    // Flota: sube y baja con el agua, y se mece apenas. El temblor de la risa va encima.
    const bob = Math.sin(t * 0.9) * 2.4 + sacude + encoge * 3;
    const mece = Math.sin(t * 0.6) * 0.7;
    entero.setAttribute('transform', `translate(${px} ${(agua + bob).toFixed(2)}) rotate(${mece.toFixed(2)}) scale(${escala})`);
    // Respira: la panza crece y se achica desde el agua; la cabeza y el brazo la siguen.
    const sy = 1 + Math.sin(t * 1.6) * 0.008 + sacude * 0.006 - encoge * 0.02;
    p.get('cuerpo')?.setAttribute('transform', `scale(1 ${sy.toFixed(4)})`);
    const [cx, cy] = AP.cuello;
    const alza = cy * (sy - 1);
    p.get('cabeza')?.setAttribute(
      'transform',
      `translate(0 ${(alza + cabezaDy).toFixed(2)}) rotate(${cabezaGiro.toFixed(2)} ${cx} ${cy}) translate(${cx} ${cy}) scale(1 ${cabezaSy.toFixed(3)}) translate(${-cx} ${-cy})`,
    );
    p.get('mandibula')?.setAttribute('transform', `translate(0 ${boca.toFixed(2)})`);
    girar(p.get('brazo'), brazo, AP.hombro, `translate(0 ${(AP.hombro[1] * (sy - 1)).toFixed(2)}) `);
    girar(p.get('antebrazo'), antebrazo, AP.codo);
    if (t > parpadeo + 0.16) parpadeo = t + 2.4 + Math.random() * 3.6;
    const ciego = t > parpadeo && t < parpadeo + 0.16 ? 1 : 0;
    parpado(p.get('parpado-1'), Math.max(ciego, achina));
    parpado(p.get('parpado-2'), Math.max(ciego, achina));

    // El reflejo se corre un poco de costado, como se corre en el agua que se mueve.
    reflejo?.setAttribute('transform', `translate(${(Math.sin(t * 1.3) * 2.2).toFixed(2)} 0)`);
    // La lluvia de afuera baja en diagonal, y el agua del agujero cae por la puerta.
    const cae = (t * 210) % 70;
    lluvia?.setAttribute('transform', `translate(${(-cae * 0.36).toFixed(1)} ${cae.toFixed(1)})`);
    chorros.forEach((c, i) => c.setAttribute('stroke-dashoffset', (-((t * (88 + i * 9)) % 17)).toFixed(1)));
    if (t > proximaGota && !quieto()) {
      onda('puerta', BAJO.agujero.x + 10 + (Math.random() - 0.5) * 24, BAJO.fondo + 3, t, 3, 26, 0.9);
      proximaGota = t + 0.35 + Math.random() * 0.3;
    }
    if (modo === 'quieto' && t > proximaOnda && !quieto()) {
      onda('pierre', px, agua + 2, t, 150 * escala, 230 * escala, 2.4);
      proximaOnda = t + 2 + Math.random() * 1.5;
    }
    pintarOndas(t);
  }

  function reirse(t: number): void {
    // Se ríe hasta que tose. Si ya se estaba riendo, sigue un rato más.
    if (modo === 'risa') dura = Math.max(dura, t - desde + 1.6);
    else empezar('risa', t, 2.4);
    tosDespues = true;
  }

  const tocar = (): void => {
    reirse(reloj);
    if (quieto()) {
      // Sin movimiento, queda la carcajada quieta: la boca abierta y los ojos achinados.
      p.get('mandibula')?.setAttribute('transform', 'translate(0 14)');
      parpado(p.get('parpado-1'), 0.62);
      parpado(p.get('parpado-2'), 0.62);
    }
    // Le cuelga de la papada, sobre la panza: que se le vea la cara mientras se ríe.
    hablar('el-gordo-pierre', escena, svg, px, agua - 150 * escala, true);
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
    escena,
    svg,
    mover: (t, dt) => {
      deMapa.mover(t, dt);
      pintar(t);
    },
    reaccionar: (id, t) => {
      if (id === 'el-gordo-pierre') reirse(t);
      else deMapa.reaccionar(id, t);
    },
  };
}

/* ------------------------------------------------------------------
   La drácula con tacones, en la prisión de Barbazul (séptima vuelta)
   ------------------------------------------------------------------ */

/**
 * La drácula taconea por el pasillo de las celdas: camina un tramo, se para, mira, parpadea, y
 * vuelve a caminar; cada taco que apoya suena en el piso con dos cortes blancos. Tocada, abre la
 * capa como dos puertas de papel —la mitad negra se achica contra el hombro y del otro lado se
 * despliega el forro, rojo como las banderas de la ventana— y muestra los colmillos. Afuera, las
 * banderas de *Oktubre* flamean detrás de la reja, y la puerta de la jaula vacía de la fiera se
 * mece; tocada la jaula, chirría.
 */
function recintoDeLaDracula(escena: HTMLElement, svg: SVGSVGElement): Recinto {
  const deMapa = recintoDeMapa(escena, svg);
  const g = svg.querySelector<SVGGElement>('.titere--dracula')!;
  const entera = svg.querySelector<SVGGElement>('#dracula-entera')!;
  const p = partes(g);
  const sombra = svg.querySelector<SVGEllipseElement>('[data-parte="sombra"]');
  const taco = svg.querySelector<SVGPathElement>('[data-parte="taco"]');
  const puerta = svg.querySelector<SVGGElement>('[data-parte="puerta-jaula"]');
  const banderas = [...svg.querySelectorAll<SVGGElement>('[data-bandera]')].map((b) => ({
    g: b,
    asta: (b.dataset.asta ?? '0 0').split(' ').map(Number) as [number, number],
    fase: Number(b.dataset.bandera) * 1.3,
  }));
  const AD = DRACULA_ARMADO;
  const { piso, escala, desde: izquierda, hasta: derecha } = DRACULA;

  type Modo = 'camina' | 'para' | 'abre';
  let modo: Modo = 'para';
  let x: number = DRACULA.x;
  let meta = x;
  let hasta = 2;
  let fase = 0;
  let abreDesde = -10;
  let parpadeo = 1.5;
  let tacoEn = -10;
  let tacoX = 0;
  let chirria = -10;
  let ultimoPaso = 0;
  // Quieta, hace una de dos: se acomoda la capa (asoma el forro) o mira para la ventana.
  let acomodaDesde = -10;
  let mira = 0;
  let mirando = 0;
  // El reloj de las banderas: corre más rápido cuando sopla, sin saltar de fase.
  let soplo = 0;

  /** Cuánto está abierta la capa, de 0 a 1: se abre en medio segundo, se sostiene y se cierra. */
  const ABRE = 0.55;
  const SOSTIENE = 1.9;
  const CIERRA = 0.6;
  function abierta(t: number): number {
    const u = t - abreDesde;
    if (u < 0 || u > ABRE + SOSTIENE + CIERRA) return 0;
    if (u < ABRE) return suave(u / ABRE);
    if (u < ABRE + SOSTIENE) return 1;
    return 1 - suave((u - ABRE - SOSTIENE) / CIERRA);
  }

  /** Se acomoda la capa: la abre un poco y la cierra, en menos de un segundo. */
  function acomoda(t: number): number {
    const u = (t - acomodaDesde) / 0.9;
    return u < 0 || u > 1 ? 0 : Math.sin(Math.PI * u) * 0.34;
  }

  /** Una mitad de la capa: la negra se da vuelta contra el hombro y del otro lado aparece el forro. */
  function capa(n: 1 | 2, k: number, t: number, mece: number): void {
    const [hx, hy] = AD.hombros[n - 1];
    const lado = n === 1 ? -1 : 1;
    const c = Math.cos(k * Math.PI * 0.94);
    const negra = p.get(`capa-${n}`);
    const forro = p.get(`forro-${n}`);
    if (c > 0) {
      negra?.setAttribute('transform', `translate(${hx} ${hy}) rotate(${(mece * lado).toFixed(2)}) scale(${c.toFixed(3)} 1) translate(${-hx} ${-hy})`);
      forro?.setAttribute('transform', `translate(${hx} 0) scale(0.001 1) translate(${-hx} 0)`);
    } else {
      negra?.setAttribute('transform', `translate(${hx} 0) scale(0.001 1) translate(${-hx} 0)`);
      // Abierta, el ala sube un poco y flamea como las banderas de afuera.
      const sube = -lado * 6 * k;
      const flamea = Math.sin(t * 6.5 + n * 1.7) * 2.6 * k;
      forro?.setAttribute('transform', `translate(${hx} ${hy}) rotate(${sube.toFixed(2)}) skewY(${flamea.toFixed(2)}) scale(${(-c).toFixed(3)} 1) translate(${-hx} ${-hy})`);
    }
  }

  function pintar(t: number, dt: number): void {
    const k = abierta(t);
    const capaAbierta = Math.max(k, acomoda(t));
    if (modo === 'abre' && t - abreDesde > ABRE + SOSTIENE + CIERRA) {
      modo = 'para';
      hasta = t + 1.2;
    } else if (modo === 'para' && t > hasta && !quieto()) {
      // A otro lado del pasillo, lejos de donde está.
      let otra = izquierda + Math.random() * (derecha - izquierda);
      if (Math.abs(otra - x) < 140) otra = x < (izquierda + derecha) / 2 ? Math.min(derecha, x + 160 + Math.random() * 120) : Math.max(izquierda, x - 160 - Math.random() * 120);
      meta = otra;
      modo = 'camina';
      mira = 0;
    } else if (modo === 'camina') {
      const paso = Math.sign(meta - x) * Math.min(Math.abs(meta - x), 46 * dt);
      x += paso;
      fase += (Math.abs(paso) / 34) * Math.PI;
      // Cada vez que apoya un taco: el golpe en el piso.
      const pasos = Math.floor(fase / Math.PI);
      if (pasos !== ultimoPaso) {
        ultimoPaso = pasos;
        tacoEn = t;
        tacoX = x + (pasos % 2 ? 1 : -1) * 18 * escala;
      }
      if (Math.abs(meta - x) < 0.5) {
        modo = 'para';
        hasta = t + 1.8 + Math.random() * 2.2;
        if (Math.random() < 0.4) acomodaDesde = t + 0.5;
        else mira = x < (PRISION.ventana.x0 + PRISION.ventana.x1) / 2 ? 1 : -1;
        // Termina el paso con los dos pies juntos.
        fase = Math.round(fase / Math.PI) * Math.PI;
      }
    }

    // Las piernas: una adelante y otra atrás, como se camina en el teatro de papel; la que se
    // adelanta se levanta un poco. Quieta, las dos juntas.
    const andar = modo === 'camina' ? 1 : 0;
    const s = Math.sin(fase) * andar;
    const levanta = (lado: number): number => Math.max(0, Math.cos(fase) * lado) * 5 * andar;
    girar(p.get('pierna-1'), s * 7, AD.caderas[0], `translate(0 ${(-levanta(1)).toFixed(2)}) `);
    girar(p.get('pierna-2'), -s * 7, AD.caderas[1], `translate(0 ${(-levanta(-1)).toFixed(2)}) `);
    const rebota = -Math.abs(Math.sin(fase)) * 3 * andar + Math.sin(t * 1.3) * 0.8;
    const inclina = Math.sign(meta - x) * 1.4 * andar;
    entera.setAttribute('transform', `translate(${x.toFixed(1)} ${(piso + rebota).toFixed(2)}) rotate(${inclina.toFixed(2)}) scale(${escala})`);

    // La capa: cerrada se mece con el paso; tocada, se abre.
    const mece = Math.sin(fase) * 1.6 * andar + Math.sin(t * 0.9) * 0.4;
    capa(1, capaAbierta, t, mece);
    capa(2, capaAbierta, t, mece);
    p.get('mano')?.setAttribute('opacity', (1 - suave(capaAbierta / 0.2)).toFixed(2));

    // La cabeza: se ladea apenas; con la capa abierta se va para atrás, abre la boca y entorna los ojos.
    const [cx, cy] = AD.cuello;
    mirando = hacia(mirando, mira, dt * 1.6);
    const ladea = Math.sin(t * 0.55) * 1.6 - 4 * k + 5 * suave(Math.abs(mirando)) * Math.sign(mirando);
    const cabeza = `translate(0 ${(-2 * k).toFixed(2)}) rotate(${ladea.toFixed(2)} ${cx} ${cy})`;
    p.get('cabeza')?.setAttribute('transform', cabeza);
    p.get('pelo')?.setAttribute('transform', cabeza);
    p.get('mandibula')?.setAttribute('transform', `translate(0 ${(7 * k).toFixed(2)})`);
    if (t > parpadeo + 0.16) parpadeo = t + 2.6 + Math.random() * 3.4;
    const ciega = t > parpadeo && t < parpadeo + 0.16 ? 1 : 0;
    parpado(p.get('parpado-1'), Math.max(ciega, AD.entornados + 0.3 * k));
    parpado(p.get('parpado-2'), Math.max(ciega, AD.entornados + 0.3 * k));

    // La sombra en el piso, más ancha con las alas abiertas, y el golpe del taco.
    sombra?.setAttribute('cx', x.toFixed(1));
    sombra?.setAttribute('rx', (64 * escala * (1 + 1.6 * k)).toFixed(1));
    const golpe = 1 - (t - tacoEn) / 0.22;
    taco?.setAttribute('opacity', golpe > 0 ? golpe.toFixed(2) : '0');
    if (golpe > 0) taco?.setAttribute('transform', `translate(${tacoX.toFixed(1)} ${piso}) scale(${escala})`);

    // Afuera flamean las banderas, más fuerte cuando ella abre la capa; y la puerta de la jaula
    // se mece: tocada, chirría y va y viene.
    const viento = 1 + 1.6 * k;
    soplo += dt * viento;
    for (const b of banderas) {
      const [ax, ay] = b.asta;
      const rota = Math.sin(soplo * 1.6 + b.fase) * 2.6 * viento;
      const tuerce = Math.sin(soplo * 2.4 + b.fase * 1.7) * 5 * viento;
      b.g.setAttribute('transform', `translate(${ax} ${ay}) rotate(${rota.toFixed(2)}) skewY(${tuerce.toFixed(2)}) translate(${-ax} ${-ay})`);
    }
    if (puerta) {
      const bx = Number(puerta.dataset.bisagra);
      const u = t - chirria;
      const vaivien = u >= 0 && u < 4 ? Math.sin(u * 5.5) * 0.36 * Math.exp(-u * 1.1) : 0;
      const abre = 0.9 + Math.sin(t * 0.7) * 0.05 + vaivien;
      puerta.setAttribute('transform', `translate(${bx} 0) scale(${Math.min(1, Math.max(0.25, abre)).toFixed(3)} 1) translate(${-bx} 0)`);
    }
  }

  function abrirLaCapa(t: number): void {
    // Si ya la tiene abierta, la sostiene un rato más.
    if (modo === 'abre' && t - abreDesde < ABRE + SOSTIENE) abreDesde = Math.max(abreDesde, t - ABRE);
    else abreDesde = t;
    modo = 'abre';
  }

  const tocar = (): void => {
    abrirLaCapa(reloj);
    if (quieto()) {
      // Sin movimiento, queda abierta y quieta: las alas rojas, la boca abierta.
      abreDesde = reloj - ABRE;
      pintar(reloj, 0);
    }
    // El bocadillo le cuelga del mentón, sobre el pecho: que se le vea la cara.
    hablar('la-dracula-con-tacones', escena, svg, x, piso - 440 * escala, true);
  };
  g.addEventListener('click', tocar);
  g.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });
  pintar(0, 0);
  return {
    escena,
    svg,
    mover: (t, dt) => {
      deMapa.mover(t, dt);
      pintar(t, dt);
    },
    reaccionar: (id, t) => {
      if (id === 'la-dracula-con-tacones') abrirLaCapa(t);
      else if (id === 'la-fiera-mas-fiera') {
        chirria = t;
        if (quieto()) pintar(t + 0.3, 0);
      } else deMapa.reaccionar(id, t);
    },
  };
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
  const id = escena.dataset.recinto;
  const controlador: Record<string, (e: HTMLElement, s: SVGSVGElement) => Recinto> = {
    'monte-pastura': recintoDelMonte,
    'los-techos': recintoDelPerro,
    'el-infierno': recintoDeLuzbelito,
    'el-templo': recintoDeMomo,
    'el-bajo': recintoDePierre,
    'la-prision': recintoDeLaDracula,
    'la-ruta': recintoDeRuta,
  };
  const r = (controlador[id ?? ''] ?? recintoDeMapa)(escena, svg);
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
    const x = Number(g.dataset.ahora ?? g.dataset.x);
    const y = Number(g.dataset.y) - 26;
    r.reaccionar(g.dataset.id!, reloj);
    hablar(g.dataset.id!, escena, svg, x, y);
  });
  escena.addEventListener('keydown', (ev) => {
    const g = (ev.target as Element).closest<SVGGElement>('.bestia');
    if (g && (ev.key === 'Enter' || ev.key === ' ')) {
      ev.preventDefault();
      r.reaccionar(g.dataset.id!, reloj);
      hablar(g.dataset.id!, escena, svg, Number(g.dataset.ahora ?? g.dataset.x), Number(g.dataset.y) - 26);
    }
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

/* Los botones: el bocadillo, las fichitas de cada recinto, la hoja y el índice. */
bocadilloFicha.addEventListener('click', () => {
  if (bocadilloFicha.dataset.ir) abrir(bocadilloFicha.dataset.ir);
});

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
