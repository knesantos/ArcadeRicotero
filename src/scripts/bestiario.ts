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
 */

import { BESTIARIO } from '../lib/bestiario/copy.ts';
import { ACECHO, ACHATE, ESCALA_CORDERO, ESCALA_LOBO, PALO, SOGA, profundidad } from '../lib/bestiario/rig.ts';
import { ARMADO } from '../lib/bestiario/recortes.ts';
import { LUZBELITO as LUZ, MOMO as MOMO_ESC } from '../lib/bestiario/escenas.ts';
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

/**
 * El bicho dice su verso: el bocadillo aparece arriba de él, adentro de su escena. Las escenas
 * de noche se corren de costado, así que todo se mide contra lo que se ve, no contra la escena
 * entera: si el bicho quedó afuera (se llegó con el teclado), la escena lo trae primero.
 */
function hablar(id: string, escena: HTMLElement, svg: SVGSVGElement, x: number, y: number): void {
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
  const abajo = py - alto - 14 < 6;
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
  const controlador: Record<string, (e: HTMLElement, s: SVGSVGElement) => Recinto> = {
    'monte-pastura': recintoDelMonte,
    'los-techos': recintoDelPerro,
    'el-infierno': recintoDeLuzbelito,
    'el-templo': recintoDeMomo,
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
