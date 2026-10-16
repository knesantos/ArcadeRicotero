/**
 * El mundo redondo, visto desde arriba (`D-73`).
 *
 * Un círculo de mil de lado, como un disco o un buñuelo: el galpón de Patricio Rey en el
 * medio, las regiones alrededor como porciones, la pastura como un claro adentro del monte,
 * y la ruta del último bondi dando la vuelta por el borde, que es el surco. Cada región
 * está al lado de las que se le parecen: el monte rodea la pastura, el bajo inundado toca el
 * infierno por el barro y por las sirenas, los gatos están en los techos arriba del baldío
 * de los perros.
 *
 * Este módulo es puro: arma el marcado del SVG en build, y calcula la cámara de cada
 * región (la caja a la que se acerca el mapa al tocarla). Los colores salen de clases y
 * variables de los tokens; acá no vive ni un hex.
 */

import { dibujarGrupo, type Dibujo } from './figuras.ts';

/** Las clases de tinta del paisaje, las mismas de las figuras (`figuras.ts`, `tinta`). */
const TINTAS = new Set(['tn', 'osc', 'pp', 'ac', 'ac2', 'oro', 'az', 'ag', 'barro', 'borde', 'borde-grueso', 'lana', 'tz', 'tz-pp', 'tz-oro', 'pun']);
const conPrefijo = (svg: string): string =>
  svg.replace(/class="([^"]+)"/g, (_, c: string) => `class="${c.split(' ').map((x) => (TINTAS.has(x) ? `b-${x}` : x)).join(' ')}"`);

export const LADO = 1000;
const CENTRO = LADO / 2;

export type Forma =
  | { tipo: 'centro'; radio: number }
  | { tipo: 'sector'; desde: number; hasta: number; adentro: number; afuera: number }
  | { tipo: 'claro'; angulo: number; distancia: number; radio: number }
  | { tipo: 'anillo'; adentro: number; afuera: number };

export interface Region {
  id: string;
  /** El rótulo del mapa entero, que en un teléfono tiene que entrar sin tapar todo. */
  corto: string;
  nombre: string;
  canta: string;
  disco: string;
  forma: Forma;
  vecinas: readonly string[];
}

export type Posicion = { x: number; y: number } | { ang: number; r: number };

export interface Bestia {
  id: string;
  nombre: string;
  clase: 'bestia' | 'criatura' | 'personaje' | 'fierro';
  region: string;
  pos: Posicion;
  tam: number;
  cantidad?: number;
  dibujo: Dibujo;
  tema?: string;
  verso?: readonly string[];
  tambien?: ReadonlyArray<{ tema: string; verso: readonly string[] }>;
  articulo?: string;
  estampa: string;
  cuenta?: ReadonlyArray<{ rotulo: 'hecho' | 'leyenda' | 'testimonio'; texto: string; quien?: string; fuente?: string }>;
  cerca: readonly string[];
}

export interface Bestiario {
  regiones: readonly Region[];
  bestias: readonly Bestia[];
}

/* ------------------------------------------------------------------
   Geometría
   ------------------------------------------------------------------ */

/** Ángulo en grados desde el norte, en el sentido del reloj (el de la pantalla). */
export function polar(ang: number, r: number): { x: number; y: number } {
  const a = (ang * Math.PI) / 180;
  return { x: CENTRO + r * Math.sin(a), y: CENTRO - r * Math.cos(a) };
}

export function punto(p: Posicion): { x: number; y: number } {
  return 'x' in p ? p : polar(p.ang, p.r);
}

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

function arco(desde: number, hasta: number, r: number, horario: boolean): string {
  const fin = polar(horario ? hasta : desde, r);
  const grande = Math.abs(hasta - desde) > 180 ? 1 : 0;
  return `A${f(r)} ${f(r)} 0 ${grande} ${horario ? 1 : 0} ${f(fin.x)} ${f(fin.y)}`;
}

/** El contorno de una región, como `d` de un `<path>`. */
export function contorno(forma: Forma): string {
  switch (forma.tipo) {
    case 'centro':
    case 'claro': {
      const c = forma.tipo === 'centro' ? { x: CENTRO, y: CENTRO } : polar(forma.angulo, forma.distancia);
      const r = forma.radio;
      return `M${f(c.x - r)} ${f(c.y)} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
    }
    case 'anillo': {
      const anillo = (r: number): string => `M${f(CENTRO - r)} ${CENTRO} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
      return `${anillo(forma.afuera)} ${anillo(forma.adentro)}`;
    }
    case 'sector': {
      const a = polar(forma.desde, forma.afuera);
      const b = polar(forma.hasta, forma.adentro);
      return `M${f(a.x)} ${f(a.y)} ${arco(forma.desde, forma.hasta, forma.afuera, true)} L${f(b.x)} ${f(b.y)} ${arco(forma.desde, forma.hasta, forma.adentro, false)} Z`;
    }
  }
}

export interface Caja {
  x: number;
  y: number;
  lado: number;
}

/** Una caja cuadrada que contiene los puntos, con aire alrededor. */
function cajaDe(puntos: ReadonlyArray<{ x: number; y: number }>, aire: number): Caja {
  const xs = puntos.map((p) => p.x);
  const ys = puntos.map((p) => p.y);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const lado = Math.max(x1 - x0, y1 - y0) * aire;
  return { x: (x0 + x1) / 2 - lado / 2, y: (y0 + y1) / 2 - lado / 2, lado };
}

/**
 * La cámara de una región: la caja a la que se acerca el mapa. La de la pastura deja ver
 * el borde del monte, para que se vea al lobo acechando; la de la ruta, que da la vuelta
 * entera, arranca en su primer fierro y se recorre de a uno.
 */
export function camara(region: Region, bestias: readonly Bestia[]): Caja {
  const forma = region.forma;
  switch (forma.tipo) {
    case 'centro':
      return cajaDe([{ x: CENTRO - forma.radio, y: CENTRO - forma.radio }, { x: CENTRO + forma.radio, y: CENTRO + forma.radio }], 1.25);
    case 'claro': {
      const c = polar(forma.angulo, forma.distancia);
      const r = forma.radio * 1.85;
      return cajaDe([{ x: c.x - r, y: c.y - r }, { x: c.x + r, y: c.y + r }], 1);
    }
    case 'anillo': {
      const primera = bestias.find((b) => b.region === region.id);
      return camaraDe(primera ? punto(primera.pos) : polar(0, forma.adentro));
    }
    case 'sector': {
      const puntos: Array<{ x: number; y: number }> = [];
      for (let a = forma.desde; a <= forma.hasta; a += 2) puntos.push(polar(a, forma.adentro), polar(a, forma.afuera));
      return cajaDe(puntos, 1.08);
    }
  }
}

/** La cámara alrededor de un punto: para ir a una bestia que está lejos de la que se ve. */
export function camaraDe(p: { x: number; y: number }, lado = 300): Caja {
  return { x: p.x - lado / 2, y: p.y - lado / 2, lado };
}

/** Dónde va el rótulo de la región en el mapa entero, en porcentaje del lado. */
export function lugarDelRotulo(region: Region): { x: number; y: number } {
  const forma = region.forma;
  let p: { x: number; y: number };
  switch (forma.tipo) {
    case 'centro': p = { x: CENTRO, y: CENTRO + forma.radio * 0.62 }; break;
    case 'claro': p = polar(forma.angulo, forma.distancia); break;
    case 'anillo': p = polar(180, (forma.adentro + forma.afuera) / 2); break;
    case 'sector': p = polar((forma.desde + forma.hasta) / 2, (forma.adentro + forma.afuera) / 2); break;
  }
  return { x: (p.x / LADO) * 100, y: (p.y / LADO) * 100 };
}

/** Si un punto cae adentro de una forma. Lo usa el test para que nadie quede en la región ajena. */
export function adentro(forma: Forma, p: { x: number; y: number }): boolean {
  const dx = p.x - CENTRO;
  const dy = p.y - CENTRO;
  const r = Math.hypot(dx, dy);
  switch (forma.tipo) {
    case 'centro': return r <= forma.radio;
    case 'claro': {
      const c = polar(forma.angulo, forma.distancia);
      return Math.hypot(p.x - c.x, p.y - c.y) <= forma.radio;
    }
    case 'anillo': return r >= forma.adentro && r <= forma.afuera;
    case 'sector': {
      let ang = (Math.atan2(dx, -dy) * 180) / Math.PI;
      if (ang < 0) ang += 360;
      const desde = (forma.desde + 360) % 360;
      const hasta = (forma.hasta + 360) % 360;
      const enArco = desde <= hasta ? ang >= desde && ang <= hasta : ang >= desde || ang <= hasta;
      return enArco && r >= forma.adentro && r <= forma.afuera;
    }
  }
}

/* ------------------------------------------------------------------
   El paisaje de cada región
   ------------------------------------------------------------------ */

/** Un azar con semilla: el mismo monte en cada build. */
function azar(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const at = (p: { x: number; y: number }, cuerpo: string, giro = 0, escala = 1): string =>
  `<g transform="translate(${f(p.x)} ${f(p.y)})${giro ? ` rotate(${giro})` : ''}${escala !== 1 ? ` scale(${escala})` : ''}">${cuerpo}</g>`;

const arbol = (alto: number): string =>
  `<rect x="-2" y="${-alto * 0.25}" width="4" height="${alto * 0.25}" class="tn"/><path d="M0 ${-alto} L${alto * 0.4} ${-alto * 0.2} L${-alto * 0.4} ${-alto * 0.2} Z" class="tn"/>`;

const llama = (alto: number): string =>
  `<path d="M0 0 Q${-alto * 0.45} ${-alto * 0.4} 0 ${-alto} Q${alto * 0.1} ${-alto * 0.55} ${alto * 0.3} ${-alto * 0.6} Q${alto * 0.45} ${-alto * 0.25} 0 0 Z" class="ac"/>`;

const onda = (ancho: number): string => `<path d="M0 0 q${ancho / 4} -5 ${ancho / 2} 0 t${ancho / 2} 0" class="tz-pp" stroke-width="2"/>`;

/** Puntos sueltos en un sector, lejos de las bestias y de lo que se le diga. */
function sembrar(
  forma: Extract<Forma, { tipo: 'sector' }>,
  cantidad: number,
  semilla: number,
  lejosDe: ReadonlyArray<{ x: number; y: number; r: number }>,
): Array<{ x: number; y: number }> {
  const rnd = azar(semilla);
  const salida: Array<{ x: number; y: number }> = [];
  for (let intento = 0; intento < cantidad * 30 && salida.length < cantidad; intento++) {
    const a = forma.desde + 2 + rnd() * (forma.hasta - forma.desde - 4);
    const r = forma.adentro + 12 + rnd() * (forma.afuera - forma.adentro - 20);
    const p = polar(a, r);
    if (lejosDe.some((o) => Math.hypot(o.x - p.x, o.y - p.y) < o.r)) continue;
    if (salida.some((o) => Math.hypot(o.x - p.x, o.y - p.y) < 16)) continue;
    salida.push(p);
  }
  return salida;
}

function paisaje(region: Region, todas: readonly Region[], bestias: readonly Bestia[]): string {
  const forma = region.forma;
  const ocupado = bestias.map((b) => ({ ...punto(b.pos), r: b.tam * 0.75 }));
  const sector = forma.tipo === 'sector' ? forma : null;
  let s = '';

  switch (region.id) {
    case 'el-galpon': {
      s += `<rect x="410" y="420" width="180" height="150" class="pp borde-grueso"/>`;
      s += `<path d="M396 424 L500 362 L604 424 Z" class="ac borde-grueso"/>`;
      s += `<rect x="484" y="536" width="32" height="34" class="tn"/>`;
      s += `<path d="M430 470 L570 470" class="tz" stroke-width="2" stroke-dasharray="6 6"/>`;
      break;
    }
    case 'el-arbol': {
      s += `<path d="M486 372 L490 190 Q470 150 430 140 L436 130 Q474 138 494 170 L496 110 L504 110 L506 170 Q526 138 564 130 L570 140 Q530 150 510 190 L514 372 Z" class="tn"/>`;
      for (const [x, y, r] of [[500, 100, 62], [446, 128, 40], [556, 126, 42], [470, 78, 36], [534, 80, 38], [500, 140, 34]] as const) {
        s += `<circle cx="${x}" cy="${y}" r="${r}" class="ac copa"/>`;
      }
      s += `<g class="detalle">${[[470, 104], [520, 120], [540, 90], [452, 140]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" class="ac2"/>`).join('')}</g>`;
      break;
    }
    case 'cybersiberia': {
      const c = polar(42, 290);
      s += `<rect x="${f(c.x - 92)}" y="${f(c.y - 70)}" width="184" height="140" rx="16" class="tz" stroke-width="5"/>`;
      s += `<path d="M${f(c.x - 20)} ${f(c.y - 70)} l-26 -40 M${f(c.x + 20)} ${f(c.y - 70)} l26 -40" class="tz" stroke-width="3"/>`;
      if (sector) for (const p of sembrar(sector, 34, 7, ocupado)) s += at(p, `<path d="M-4 0 L4 0 M0 -4 L0 4 M-3 -3 L3 3 M-3 3 L3 -3" class="tz-pp" stroke-width="1.6"/>`);
      break;
    }
    case 'el-templo': {
      const c = polar(85, 330);
      s += at(c, `<rect x="-50" y="-34" width="100" height="62" class="pp borde-grueso"/><path d="M-60 -32 L0 -66 L60 -32 Z" class="ac borde-grueso"/><rect x="-12" y="0" width="24" height="28" class="tn"/>`
        + `<path d="M-74 -40 l-14 -8 M74 -40 l14 -8 M-70 -60 l-10 -14 M70 -60 l10 -14 M0 -76 l0 -16" class="tz-oro" stroke-width="3"/>`, 4);
      const farol = polar(80, 250);
      s += at(farol, `<rect x="-2" y="-40" width="4" height="40" class="tn"/><circle cx="0" cy="-44" r="7" class="oro"/>`);
      const a = polar(68, 220);
      const b = polar(102, 220);
      s += `<path d="M${f(a.x)} ${f(a.y)} Q${f((a.x + b.x) / 2 + 30)} ${f((a.y + b.y) / 2 + 30)} ${f(b.x)} ${f(b.y)}" class="tz" stroke-width="1.6"/>`;
      s += `<g class="detalle">${[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((t) => {
        const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * ((a.x + b.x) / 2 + 30) + t * t * b.x;
        const y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * ((a.y + b.y) / 2 + 30) + t * t * b.y;
        return `<path d="M${f(x - 5)} ${f(y)} l10 0 l-5 10 Z" class="ac"/>`;
      }).join('')}</g>`;
      break;
    }
    case 'los-astilleros': {
      if (sector) {
        s += `<path d="${contorno({ tipo: 'sector', desde: sector.desde, hasta: sector.hasta, adentro: 380, afuera: sector.afuera })}" class="agua"/>`;
        for (const p of sembrar({ ...sector, adentro: 384 }, 10, 13, ocupado)) s += at(p, onda(18));
      }
      const pila = polar(118, 355);
      s += at(pila, `<rect x="-30" y="-6" width="28" height="14" class="ac borde"/><rect x="0" y="-6" width="28" height="14" class="tn"/><rect x="-16" y="-20" width="28" height="14" class="tn"/>`, 28);
      const grua = polar(132, 395);
      s += at(grua, `<path d="M0 0 L0 -70 L50 -70 M0 -60 L40 -70 M44 -70 L44 -40" class="tz" stroke-width="4"/>`, 30);
      const muelle = polar(127, 250);
      s += at(muelle, `<rect x="-40" y="-6" width="80" height="12" class="pp borde"/><path d="M-30 -6 l0 12 M-15 -6 l0 12 M0 -6 l0 12 M15 -6 l0 12 M30 -6 l0 12" class="tz" stroke-width="1.5"/>`, 37);
      const barco = polar(138, 352);
      s += at(barco, `<path d="M-34 0 L34 0 L24 16 L-24 16 Z" class="tn"/><rect x="-6" y="-26" width="4" height="26" class="tn"/><path d="M-2 -26 L22 -6 L-2 -6 Z" class="pp borde"/>`, 48);
      break;
    }
    case 'el-bajo': {
      s += `<path d="${contorno(forma)}" class="agua"/>`;
      if (sector) for (const p of sembrar(sector, 26, 21, ocupado)) s += at(p, onda(22));
      const puerta = polar(158, 345);
      s += at(puerta, `<rect x="-22" y="-40" width="44" height="66" class="pp borde-grueso"/><rect x="-14" y="-32" width="28" height="30" class="ag"/>`
        + `<path d="M-14 -32 L-2 -20 L-8 -12 L4 -6 L14 -18 M-14 -8 L-4 -14" class="tz" stroke-width="2"/>`
        + `<path d="M26 18 l6 -4 l2 5 Z M34 24 l7 -2 l-2 6 Z M-30 22 l6 -5 l1 6 Z" class="pp borde"/>`, -12);
      const mesa = polar(163, 300);
      s += at(mesa, `<rect x="-34" y="16" width="68" height="8" class="pp borde"/><path d="M-26 24 l0 10 M26 24 l0 10" class="tz" stroke-width="3"/>`, 0);
      break;
    }
    case 'el-infierno': {
      if (sector) {
        for (const p of sembrar(sector, 22, 33, ocupado)) s += at(p, llama(14 + (p.x % 9)));
      }
      const puerta = polar(195, 165);
      s += at(puerta, `<path d="M-24 18 L-24 -14 Q0 -40 24 -14 L24 18 Z" class="tn"/><path d="M-14 18 L-14 -8 Q0 -24 14 -8 L14 18 Z" class="ac"/>`, 15);
      const piedra = polar(199, 305);
      s += at(piedra, `<path d="M-30 30 Q-26 10 -6 14 Q14 4 30 20 L32 30 Z" class="tn osc"/>`);
      break;
    }
    case 'la-prision': {
      const bloque = polar(236, 300);
      s += at(bloque, `<rect x="-70" y="-50" width="140" height="80" class="pp borde-grueso"/>`
        + Array.from({ length: 13 }, (_, i) => `<path d="M${-60 + i * 10} -50 L${-60 + i * 10} 30" class="tz" stroke-width="2.4"/>`).join(''), 56);
      const blanco = polar(221, 410);
      s += at(blanco, `<circle r="16" class="pp borde"/><circle r="10" class="ac"/><circle r="4" class="pp"/>`);
      const ascensor = polar(238, 190);
      s += at(ascensor, `<rect x="-36" y="-30" width="72" height="44" class="tz" stroke-width="3"/><path d="M0 -30 L0 14" class="tz" stroke-width="2"/><path d="M-6 -40 l6 -8 l6 8 Z" class="tn"/>`, 56);
      break;
    }
    case 'los-techos': {
      if (sector) {
        for (let a = sector.desde; a < sector.hasta; a += 4) {
          const p = polar(a + 2, 425);
          const q = polar(a + 2, 340);
          s += `<path d="M${f(p.x)} ${f(p.y)} L${f(q.x)} ${f(q.y)}" class="tz" stroke-width="1.4"/>`;
        }
        s += `<path d="${contorno({ ...sector, adentro: 340 })}" class="techo"/>`;
        const m1 = polar(sector.desde, 340);
        s += `<path d="M${f(m1.x)} ${f(m1.y)} ${arco(sector.desde, sector.hasta, 340, true)}" class="tz" stroke-width="5" stroke-dasharray="14 4"/>`;
        s += `<g class="detalle">${sembrar({ ...sector, afuera: 335 }, 18, 41, ocupado).map((p) => at(p, `<path d="M-4 0 l2 -8 M0 0 l0 -10 M4 0 l-2 -8" class="tz" stroke-width="1.6"/>`)).join('')}</g>`;
      }
      for (const a of [262, 280, 293]) s += at(polar(a, 418), `<rect x="-6" y="-16" width="12" height="16" class="tn"/>`);
      break;
    }
    case 'el-monte': {
      if (sector) {
        const claro = todas.find((r) => r.forma.tipo === 'claro');
        const lejos = [...ocupado];
        if (claro && claro.forma.tipo === 'claro') lejos.push({ ...polar(claro.forma.angulo, claro.forma.distancia), r: claro.forma.radio + 14 });
        lejos.push({ x: 165, y: 262, r: 44 });
        for (const p of sembrar(sector, 46, 5, lejos)) s += at(p, arbol(18 + (Math.round(p.x) % 3) * 4));
      }
      // El volcán del joven lobo va en la tinta del monte: un lobo negro arriba de un volcán
      // negro no se ve (visto en el navegador el 2026-10-16).
      s += `<path d="M118 298 L150 236 L180 236 L214 298 Z" class="ac borde-grueso"/><path d="M150 236 Q165 228 180 236 Z" class="tn"/>`
        + `<path d="M162 226 q-8 -14 4 -24 q8 -10 0 -22" class="tz" stroke-width="3"/>`;
      break;
    }
    case 'la-pastura': {
      if (forma.tipo === 'claro') {
        const c = polar(forma.angulo, forma.distancia);
        s += `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${forma.radio}" class="pasto"/>`;
        s += `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="30" class="pelado"/>`;
        s += `<circle cx="${f(c.x)}" cy="${f(c.y)}" r="30" class="tz" stroke-width="1.6" stroke-dasharray="4 5"/>`;
        s += `<path d="M${f(c.x)} ${f(c.y)} L${f(c.x + 19)} ${f(c.y + 2)}" class="tz" stroke-width="2"/>`;
        s += `<rect x="${f(c.x - 3)}" y="${f(c.y - 18)}" width="6" height="22" class="tn"/>`;
        const rnd = azar(3);
        let pasto = '';
        for (let i = 0; i < 60; i++) {
          const a = rnd() * Math.PI * 2;
          const d = 34 + rnd() * (forma.radio - 40);
          const x = c.x + Math.cos(a) * d;
          const y = c.y + Math.sin(a) * d;
          // El pasto no le pasa por encima a nadie.
          if (ocupado.some((o) => Math.hypot(o.x - x, o.y - y) < o.r)) continue;
          pasto += `<path d="M${f(x - 3)} ${f(y)} l2 -7 M${f(x)} ${f(y)} l0 -9 M${f(x + 3)} ${f(y)} l-2 -7" class="tz" stroke-width="1.4"/>`;
        }
        s += `<g class="detalle">${pasto}</g>`;
      }
      break;
    }
    case 'la-mesa': {
      if (sector) {
        s += `<path d="${contorno({ tipo: 'sector', desde: 266, hasta: 330, adentro: 178, afuera: 222 })}" class="pp borde-grueso"/>`;
        s += `<path d="${contorno({ tipo: 'sector', desde: 266, hasta: 330, adentro: 196, afuera: 204 })}" class="ac mantel"/>`;
        const plato = polar(300, 160);
        s += `<ellipse cx="${f(plato.x)}" cy="${f(plato.y)}" rx="26" ry="14" class="pp borde-grueso"/><ellipse cx="${f(plato.x)}" cy="${f(plato.y)}" rx="18" ry="9" class="ac"/>`;
        const miel = polar(284, 150);
        s += at(miel, `<rect x="-9" y="-16" width="18" height="20" rx="3" class="oro borde"/><rect x="-10" y="-20" width="20" height="5" class="tn"/>`);
        const ventana = polar(318, 242);
        s += at(ventana, `<rect x="-20" y="-6" width="40" height="12" class="pp borde"/><path d="M0 -6 L0 6" class="tz" stroke-width="2"/>`, 48);
      }
      break;
    }
    case 'la-ruta':
      break;
  }
  return s;
}

/* ------------------------------------------------------------------
   El armado
   ------------------------------------------------------------------ */

/** Las variables de color de una región: el disco que viste (`D-19`). */
export function tintaDe(disco: string): string {
  if (disco === 'marca') return 'var(--marca-rojo)';
  if (disco === 'ninguno') return 'var(--papel-tenue)';
  return `var(--disco-${disco}-tinta)`;
}

/** Los `<symbol>` de cada figura: el mapa y las fichas los usan con `<use>`. */
export function simbolos(bestias: readonly Bestia[]): string {
  return bestias
    .map((b) => `<symbol id="fig-${b.id}" viewBox="-10 -15 120 115">${dibujarGrupo(b.dibujo, b.cantidad ?? 1)}</symbol>`)
    .join('');
}

/** Dónde va el `<use>` de una figura: la caja de 120 × 115 escalada al tamaño de la bestia. */
export function cajaDeFigura(b: Bestia): { x: number; y: number; ancho: number; alto: number } {
  const p = punto(b.pos);
  const t = b.tam * AUMENTO;
  return { x: p.x - t * 0.6, y: p.y - t * 0.65, ancho: t * 1.2, alto: t * 1.15 };
}

/**
 * Cuánto más grande se dibuja una figura que su `tam`. El `tam` es el lugar que ocupa en el
 * mapa (lo que mide el test de solapes); la figura adentro de su caja deja aire, así que se
 * imprime un poco más grande para que de cerca se lea.
 */
export const AUMENTO = 1.4;

/** El paisaje entero: el suelo, las regiones con su paisaje y la ruta. Sin las bestias. */
export function dibujarSuelo(datos: Bestiario): string {
  let s = `<circle cx="${CENTRO}" cy="${CENTRO}" r="478" class="tn"/>`;
  s += `<circle cx="${CENTRO}" cy="${CENTRO}" r="432" class="pp suelo"/>`;
  for (const region of datos.regiones) {
    if (region.forma.tipo === 'anillo') continue;
    const tinta = tintaDe(region.disco);
    const delaRegion = datos.bestias.filter((b) => b.region === region.id);
    s += `<g class="region region--${region.id}" data-region="${region.id}" style="--tr: ${tinta}">`;
    s += `<path d="${contorno(region.forma)}" class="region-suelo"/>`;
    s += paisaje(region, datos.regiones, delaRegion);
    s += `<path d="${contorno(region.forma)}" class="region-borde"/>`;
    s += `</g>`;
  }
  // La ruta: el surco del disco.
  s += `<g class="region region--la-ruta" data-region="la-ruta" style="--tr: var(--papel-tenue)">`;
  s += `<circle cx="${CENTRO}" cy="${CENTRO}" r="454" class="ruta" stroke-width="40"/>`;
  s += `<circle cx="${CENTRO}" cy="${CENTRO}" r="454" class="tz-pp" stroke-width="2.4" stroke-dasharray="14 12"/>`;
  s += `<circle cx="${CENTRO}" cy="${CENTRO}" r="433" class="tz" stroke-width="3"/>`;
  s += `</g>`;
  return conPrefijo(s);
}

/* ------------------------------------------------------------------
   Los recintos del recorrido (D-73, segunda vuelta)
   ------------------------------------------------------------------ */

/** Una bestia como pieza tocable: el aro de toque, la figura y la marca de anotada. */
export function piezaDeBestia(b: Bestia, tinta: string, x?: number, y?: number): string {
  const p = x === undefined || y === undefined ? punto(b.pos) : { x, y };
  const t = b.tam * AUMENTO;
  return (
    `<g class="bestia" data-id="${b.id}" data-region="${b.region}" data-x="${f(p.x)}" data-y="${f(p.y)}" role="button" tabindex="0" style="--tr: ${tinta}">` +
    `<circle class="toque" cx="${f(p.x)}" cy="${f(p.y)}" r="${f(Math.max(b.tam * 0.62, 20))}"/>` +
    `<g class="cuerpo"><use href="#fig-${b.id}" x="${f(p.x - t * 0.6)}" y="${f(p.y - t * 0.65)}" width="${f(t * 1.2)}" height="${f(t * 1.15)}"/></g>` +
    `<g class="marca-anotada" transform="translate(${f(p.x + b.tam * 0.45)} ${f(p.y - b.tam * 0.55)})"><circle r="7" class="b-pp b-borde"/><path d="M-3.5 0 l2.5 3 l4.5 -6" class="b-tz" stroke-width="2.2"/></g>` +
    `</g>`
  );
}

/**
 * Un recinto con el arte del mapa: su región sola, con el paisaje y sus bestias, en la caja
 * de su cámara. Lo de afuera es el sendero.
 */
export function dibujarRecinto(region: Region, datos: Bestiario): { caja: Caja; svg: string } {
  const caja = camara(region, datos.bestias);
  const tinta = tintaDe(region.disco);
  const deAca = datos.bestias.filter((b) => b.region === region.id);
  let s = `<rect x="${f(caja.x)}" y="${f(caja.y)}" width="${f(caja.lado)}" height="${f(caja.lado)}" class="pp sendero"/>`;
  s += `<g class="region" style="--tr: ${tinta}"><path d="${contorno(region.forma)}" class="pp"/>`;
  s += `<path d="${contorno(region.forma)}" class="region-suelo"/>`;
  s += paisaje(region, datos.regiones, deAca);
  s += `<path d="${contorno(region.forma)}" class="region-borde region-borde--cerco"/></g>`;
  return { caja, svg: conPrefijo(s) + deAca.map((b) => piezaDeBestia(b, tinta)).join('') };
}

/** La ruta como carretera recta: los fierros pasan de un lado al otro. */
export const RUTA = { ancho: 400, alto: 220 } as const;

export function dibujarRuta(datos: Bestiario): string {
  const deAca = datos.bestias.filter((b) => b.region === 'la-ruta');
  let s = `<rect width="${RUTA.ancho}" height="${RUTA.alto}" class="pp"/>`;
  s += `<rect y="70" width="${RUTA.ancho}" height="110" class="ruta-asfalto"/>`;
  s += `<path d="M0 125 L${RUTA.ancho} 125" class="tz-pp" stroke-width="3" stroke-dasharray="18 14"/>`;
  s += `<path d="M0 70 L${RUTA.ancho} 70 M0 180 L${RUTA.ancho} 180" class="tz" stroke-width="3"/>`;
  for (let x = 20; x < RUTA.ancho; x += 70) s += `<rect x="${x}" y="186" width="6" height="16" class="tn"/>`;
  const paso = RUTA.ancho / deAca.length;
  const piezas = deAca.map((b, i) => piezaDeBestia(b, 'var(--papel-tenue)', paso * i + paso / 2, i % 2 ? 150 : 108)).join('');
  return conPrefijo(s) + piezas;
}
