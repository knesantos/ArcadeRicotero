/**
 * La isla del bestiario redondo (`D-73`, segunda vuelta): el zoológico vivo.
 *
 * Arriba, el plano redondo, cuyos rótulos son enlaces que bajan a cada recinto. Abajo, los
 * recintos uno detrás del otro, y en cada uno los bichos **viven**: respiran, se balancean,
 * pegan un saltito. En el del monte y la pastura viven los dos títeres de Rocambole: el lobo
 * suelto ronda la pastura por afuera, siempre del lado del cordero, y el cordero atado pasta
 * hasta que el lobo se acerca y huye al otro lado, hasta donde le da la soga. El cordero se
 * puede arrastrar con el dedo, pero no más allá de la soga.
 *
 * Tocar un bicho lo hace reaccionar y le hace decir su verso en un bocadillo; desde ahí se
 * abre su ficha, que es la misma del índice de abajo (una sola versión de cada una).
 *
 * Solo se anima lo que se ve (`IntersectionObserver`), y con movimiento reducido no se mueve
 * nada: los bichos quedan quietos en su lugar y se tocan igual.
 */

import { BESTIARIO } from '../lib/bestiario/copy.ts';
import { ACHATE, NUDO_CORDERO, PALO, PIVOTES, RONDA_LOBO, SOGA, profundidad } from '../lib/bestiario/rig.ts';
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

/** El bicho dice su verso: el bocadillo aparece arriba de él, adentro de su escena. */
function hablar(id: string, escena: HTMLElement, svg: SVGSVGElement, x: number, y: number): void {
  const b = bestias.get(id);
  const m = svg.getScreenCTM();
  if (!b || !m) return;
  if (hablando === id && !bocadillo.hidden) {
    abrir(id);
    return;
  }
  const p = new DOMPoint(x, y).matrixTransform(m);
  const caja = escena.getBoundingClientRect();
  escena.append(bocadillo);
  bocadilloVerso.textContent = `«${b.dice}»`;
  bocadilloFicha.dataset.ir = id;
  bocadillo.hidden = false;
  const ancho = bocadillo.offsetWidth;
  const izquierda = Math.min(Math.max(p.x - caja.left - ancho / 2, 6), caja.width - ancho - 6);
  const arriba = Math.max(p.y - caja.top - bocadillo.offsetHeight - 14, 6);
  bocadillo.style.left = `${izquierda}px`;
  bocadillo.style.top = `${arriba}px`;
  hablando = id;
  callarEn = performance.now() + 5000;
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
   Los títeres: el lobo suelto y el cordero atado
   ------------------------------------------------------------------ */

type Parte = SVGGraphicsElement;

function partes(titere: SVGGElement): Map<string, Parte> {
  const m = new Map<string, Parte>();
  for (const el of titere.querySelectorAll<Parte>('[data-parte]')) {
    if (el.dataset.parte !== 'eslabon') m.set(el.dataset.parte!, el);
  }
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

const envolver = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));
const hacia = (actual: number, meta: number, paso: number): number =>
  Math.abs(meta - actual) <= paso ? meta : actual + Math.sign(meta - actual) * paso;

/** Del piso de la pastura (u, v) a la pantalla de la escena, y la escala por profundidad. */
const enPantalla = (u: number, v: number): { x: number; y: number } => ({ x: PALO.x + u, y: PALO.y + v * ACHATE });

function recintoDelMonte(escena: HTMLElement, svg: SVGSVGElement): Recinto {
  const deMapa = recintoDeMapa(escena, svg);
  const actores = svg.querySelector<SVGGElement>('.actores')!;
  const gLobo = svg.querySelector<SVGGElement>('.titere--lobo')!;
  const gCordero = svg.querySelector<SVGGElement>('.titere--cordero')!;
  const soga = svg.querySelector<SVGPathElement>('#soga')!;
  const pl = partes(gLobo);
  const pc = partes(gCordero);
  const eslabones = [...gLobo.querySelectorAll<SVGGElement>('[data-parte="eslabon"]')].map((el) => ({
    el,
    i: Number(el.dataset.i),
    x: Number(el.dataset.x),
    y: Number(el.dataset.y),
    ang: Number(el.dataset.ang),
  }));

  const lobo = { th: 2.7, x: 0, y: 0, mira: -1, paso: 0, patas: 0, aullaHasta: -1, parpadeo: 2, s: 0.5 };
  const oveja = { u: 30, v: 12, mu: 30, mv: 12, mira: 1, paso: 0, patas: 0, cambio: 1, modo: 'pasta' as string, balaHasta: -1, parpadeo: 3.4, s: 0.5 };
  let arrastre: { id: number; x0: number; y0: number; movido: boolean } | null = null;
  let adelante: 'lobo' | 'cordero' | null = null;

  function aPiso(ev: PointerEvent): { u: number; v: number } {
    const m = svg.getScreenCTM()!.inverse();
    const p = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(m);
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
    const p = atar(aPiso(ev).u, aPiso(ev).v);
    oveja.u = p.u;
    oveja.v = p.v;
    oveja.modo = 'arrastrado';
    if (quieto()) pintar(reloj, 0);
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

  function tocar(id: string): void {
    reaccionar(id, reloj);
    const pos = id === 'el-lobo-suelto' ? { x: lobo.x + 60 * lobo.mira * lobo.s, y: lobo.y - 214 * lobo.s } : { x: enPantalla(oveja.u, oveja.v).x + 60 * oveja.mira * oveja.s, y: enPantalla(oveja.u, oveja.v).y - 176 * oveja.s };
    hablar(id, escena, svg, pos.x, pos.y);
  }

  function reaccionar(id: string, t: number): void {
    if (id === 'el-lobo-suelto') lobo.aullaHasta = t + 1.8;
    else if (id === 'el-cordero-atado') oveja.balaHasta = t + 1.2;
    else deMapa.reaccionar(id, t);
    if (quieto()) pintar(t, 0);
  }

  function moverLobo(t: number, dt: number): void {
    const pantallaOveja = enPantalla(oveja.u, oveja.v);
    const thMeta = Math.atan2((pantallaOveja.y - PALO.y) / RONDA_LOBO.ry, (pantallaOveja.x - PALO.x) / RONDA_LOBO.rx);
    const delta = envolver(thMeta - lobo.th);
    const aulla = t < lobo.aullaHasta;
    const camina = !aulla && Math.abs(delta) > 0.24;
    if (camina) {
      const antesX = PALO.x + RONDA_LOBO.rx * Math.cos(lobo.th);
      lobo.th = envolver(lobo.th + Math.sign(delta) * 0.34 * dt);
      const despuesX = PALO.x + RONDA_LOBO.rx * Math.cos(lobo.th);
      if (Math.abs(despuesX - antesX) > 0.01) lobo.mira = Math.sign(despuesX - antesX);
      lobo.paso += dt * 7.5;
    } else {
      lobo.mira = Math.sign(pantallaOveja.x - lobo.x) || lobo.mira;
    }
    lobo.patas = hacia(lobo.patas, camina ? 1 : 0, dt * 4);
    lobo.x = PALO.x + RONDA_LOBO.rx * Math.cos(lobo.th);
    lobo.y = PALO.y + RONDA_LOBO.ry * Math.sin(lobo.th);
    lobo.s = profundidad(lobo.y);
  }

  function moverOveja(t: number, dt: number): void {
    if (oveja.modo === 'arrastrado') {
      oveja.paso += dt * 9;
      oveja.patas = 1;
      return;
    }
    const lu = lobo.x - PALO.x;
    const lv = (lobo.y - PALO.y) / ACHATE;
    const cerca = Math.hypot(lu - oveja.u, lv - oveja.v) < 170;
    if (cerca && oveja.modo !== 'huye') {
      // Huye al otro lado del palo, hasta donde le dé la soga, y un poco más: la soga la frena.
      const r = Math.hypot(lu, lv) || 1;
      oveja.mu = (-lu / r) * (SOGA + 30);
      oveja.mv = (-lv / r) * (SOGA + 30);
      oveja.modo = 'huye';
      oveja.cambio = t + 2.6;
    } else if (t > oveja.cambio) {
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * (SOGA * 0.8);
      const quedarse = Math.random() < 0.45;
      oveja.mu = quedarse ? oveja.u : Math.cos(a) * d;
      oveja.mv = quedarse ? oveja.v : Math.sin(a) * d;
      oveja.modo = quedarse ? 'pasta' : 'camina';
      oveja.cambio = t + 3 + Math.random() * 3;
    }
    const velocidad = oveja.modo === 'huye' ? 58 : 20;
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
    } else if (oveja.modo === 'camina') {
      oveja.modo = 'pasta';
    }
    if (oveja.modo === 'huye' && !anda && t > oveja.cambio) oveja.modo = 'mira';
    if (oveja.modo === 'mira') oveja.mira = Math.sign(lobo.x - enPantalla(oveja.u, oveja.v).x) || oveja.mira;
    if (anda) oveja.paso += dt * (oveja.modo === 'huye' ? 13 : 8);
    oveja.patas = hacia(oveja.patas, anda ? 1 : 0, dt * 5);
  }

  function pupilas(p: Map<string, Parte>, dx: number, dy: number, mira: number, cuanto: number): void {
    const r = Math.hypot(dx, dy) || 1;
    const x = ((dx / r) * cuanto * mira).toFixed(2);
    const y = ((dy / r) * cuanto * 0.6).toFixed(2);
    p.get('pupila-1')?.setAttribute('transform', `translate(${x} ${y})`);
    p.get('pupila-2')?.setAttribute('transform', `translate(${x} ${y})`);
  }

  function pintar(t: number, dt: number): void {
    // El lobo.
    const P = PIVOTES.lobo;
    const aulla = t < lobo.aullaHasta;
    const a = Math.sin(lobo.paso) * 24 * lobo.patas;
    const acecha = 1 - lobo.patas;
    gLobo.setAttribute('transform', `translate(${lobo.x.toFixed(1)} ${lobo.y.toFixed(1)}) scale(${(lobo.mira * lobo.s).toFixed(3)} ${lobo.s.toFixed(3)})`);
    girar(pl.get('pata-tras'), a, P['pata-tras']);
    girar(pl.get('pata-del-lejos'), a, P['pata-del-lejos']);
    girar(pl.get('pata-del'), -a, P['pata-del']);
    girar(pl.get('pata-tras-lejos'), -a, P['pata-tras-lejos']);
    const bote = (-Math.abs(Math.sin(lobo.paso)) * 2.5 * lobo.patas + acecha * 5 * (aulla ? 0 : 1)).toFixed(2);
    pl.get('torso')?.setAttribute('transform', `translate(0 ${bote})`);
    girar(pl.get('cola'), Math.sin(t * 2.2) * 7 + Math.sin(lobo.paso) * 8 * lobo.patas - acecha * 10, P.cola);
    const cabeza = aulla ? -32 : acecha * 9 + Math.sin(t * 0.9) * 2;
    girar(pl.get('cabeza'), cabeza, P.cabeza, `translate(0 ${bote}) `);
    parpado(pl.get('boca'), aulla ? 1 + Math.sin(t * 9) * 0.12 : 0);
    const pantallaOveja = enPantalla(oveja.u, oveja.v);
    pupilas(pl, pantallaOveja.x - lobo.x, pantallaOveja.y - lobo.y, lobo.mira, 2.6);
    if (t > lobo.parpadeo + 0.14) lobo.parpadeo = t + 2.5 + Math.random() * 4;
    const ciega = t > lobo.parpadeo && t < lobo.parpadeo + 0.14 ? 1 : 0;
    parpado(pl.get('parpado-1'), ciega);
    parpado(pl.get('parpado-2'), ciega);
    // La cadena: se sacude al caminar, más cuanto más lejos del cogote; la que arrastra, en el piso.
    for (const e of eslabones) {
      const peso = Math.min(1, e.i / 5);
      const sacudon = Math.sin(lobo.paso * 0.5 - e.i * 0.8) * 7 * lobo.patas + Math.sin(t * 1.4 - e.i * 0.5) * 1.5;
      const enElPiso = e.y > -10;
      const dx = enElPiso ? -lobo.patas * Math.abs(Math.sin(lobo.paso * 0.5 - e.i * 0.4)) * 4 : sacudon * peso * 0.6;
      e.el.setAttribute('transform', `translate(${(e.x + dx).toFixed(1)} ${e.y}) rotate(${(e.ang + (enElPiso ? 0 : sacudon * peso)).toFixed(1)})`);
    }

    // El cordero.
    const C = PIVOTES.cordero;
    const o = enPantalla(oveja.u, oveja.v);
    oveja.s = profundidad(o.y) * 0.95;
    const bala = t < oveja.balaHasta;
    const salta = bala ? -Math.sin(((oveja.balaHasta - t) / 1.2) * Math.PI) * 14 : 0;
    gCordero.setAttribute('transform', `translate(${o.x.toFixed(1)} ${(o.y + salta * oveja.s).toFixed(1)}) scale(${(oveja.mira * oveja.s).toFixed(3)} ${oveja.s.toFixed(3)})`);
    const b = Math.sin(oveja.paso) * 22 * oveja.patas;
    girar(pc.get('pata-tras'), b, C['pata-tras']);
    girar(pc.get('pata-del-lejos'), b, C['pata-del-lejos']);
    girar(pc.get('pata-del'), -b, C['pata-del']);
    girar(pc.get('pata-tras-lejos'), -b, C['pata-tras-lejos']);
    const respira = Math.sin(t * 2.4) * 0.025;
    pc.get('torso')?.setAttribute('transform', `translate(0 ${(-Math.abs(Math.sin(oveja.paso)) * 2 * oveja.patas).toFixed(2)}) translate(0 -60) scale(1 ${(1 + respira).toFixed(3)}) translate(0 60)`);
    girar(pc.get('cola'), Math.sin(t * (oveja.modo === 'huye' ? 14 : 3)) * 12, C.cola);
    const pasta = oveja.modo === 'pasta' && !bala;
    girar(pc.get('cabeza'), bala ? -18 : pasta ? 30 : oveja.modo === 'huye' ? -6 : Math.sin(t * 0.8) * 3, C.cabeza);
    pc.get('hocico')?.setAttribute(
      'transform',
      pasta || bala ? `translate(64 -114) scale(1 ${(1 + Math.abs(Math.sin(t * (bala ? 20 : 11))) * (bala ? 0.3 : 0.1)).toFixed(3)}) translate(-64 114)` : '',
    );
    pupilas(pc, lobo.x - o.x, lobo.y - o.y, oveja.mira, 2.2);
    if (t > oveja.parpadeo + 0.16) oveja.parpadeo = t + 2 + Math.random() * 4;
    const cierra = t > oveja.parpadeo && t < oveja.parpadeo + 0.16 ? 1 : 0;
    parpado(pc.get('parpado-1'), cierra);
    parpado(pc.get('parpado-2'), cierra);

    // La soga: del palo al nudo del collar. Tensa cuando el cordero está en la punta.
    const nx = o.x + NUDO_CORDERO[0] * oveja.mira * oveja.s;
    const ny = o.y + salta * oveja.s + NUDO_CORDERO[1] * oveja.s;
    const ax = PALO.x;
    const ay = PALO.y - 40;
    const tension = Math.min(1, Math.hypot(oveja.u, oveja.v) / (SOGA - 4));
    const comba = (1 - tension) * 26 + 2;
    soga.setAttribute('d', `M${ax} ${ay} Q${((ax + nx) / 2).toFixed(1)} ${((ay + ny) / 2 + comba).toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`);
    soga.classList.toggle('soga--tensa', tension > 0.97);

    // Quién va adelante: el que está más abajo en la pantalla.
    const primero = lobo.y > o.y ? 'lobo' : 'cordero';
    if (primero !== adelante) {
      adelante = primero;
      actores.append(primero === 'lobo' ? gLobo : gCordero);
    }
    void dt;
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

  moverLobo(0, 0);
  pintar(0, 0);

  return {
    escena,
    svg,
    mover: (t, dt) => {
      deMapa.mover(t, dt);
      moverLobo(t, dt);
      moverOveja(t, dt);
      pintar(t, dt);
    },
    reaccionar,
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

for (const escena of document.querySelectorAll<HTMLElement>('.recinto-escena')) {
  const svg = escena.querySelector<SVGSVGElement>('svg')!;
  const id = escena.dataset.recinto;
  const r = id === 'monte-pastura' ? recintoDelMonte(escena, svg) : id === 'la-ruta' ? recintoDeRuta(escena, svg) : recintoDeMapa(escena, svg);
  // La escena del monte es más ancha que un teléfono: arranca con la pastura en el medio.
  if (escena.scrollWidth > escena.clientWidth) escena.scrollLeft = (escena.scrollWidth - escena.clientWidth) / 2;
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
}

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
