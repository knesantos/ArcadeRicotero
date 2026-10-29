/**
 * La imprenta de figuras del bestiario (`D-73`).
 *
 * Ciento y pico de bichos no se dibujan de a uno: se arman con pocas piezas. Un lobo, un
 * perro, un gato y un cordero son el mismo cuadrúpedo con otras orejas, otro hocico, otra
 * cola y otra pose. Lo mismo la gente: una cabeza, un cuerpo según la ropa, y lo que lleva
 * encima (una botella, cuernos, una corona). Así todas salen con el mismo trazo, que es el
 * de la serigrafía del sitio: tinta plana, papel, y el acento del disco de la región.
 *
 * Cada figura se dibuja en una caja de 100 × 100, mirando a la derecha, con el piso en
 * y = 92. Devuelve el marcado de adentro de un `<symbol>`: la página lo declara una vez y
 * el mapa y la ficha lo usan con `<use>`.
 *
 * **Ni un color acá.** Las piezas llevan clases y el color lo pone `sitio.css` desde los
 * tokens (`diseno-marca.md`): `tn` es la tinta, `pp` el papel, `ac` el acento de la región,
 * `oro` el oro de los tokens, `az` el azul de *Un baión* (la barba de Barbazul), y `tz` un
 * trazo de tinta sin relleno. Es puro: lo importa la página en build y lo prueba un test.
 */

export type Dibujo =
  | ({ f: 'cuadrupedo' } & OpcionesCuadrupedo)
  | { f: 'ave'; tipo: 'lechuza' | 'rapaz' | 'buitre' | 'gallo' | 'pichon' | 'pajarito'; pose?: 'vuela'; con?: readonly string[] }
  | { f: 'bicho'; tipo: 'mosca' | 'hormiga' | 'mantis' | 'polilla'; punteado?: boolean; pose?: 'duerme' }
  | { f: 'pez'; con?: readonly string[] }
  | { f: 'anguila' }
  | { f: 'rana'; con?: readonly string[] }
  | { f: 'almeja' }
  | ({ f: 'persona' } & OpcionesPersona)
  | { f: 'maquina'; que: 'tele' | 'pacman' | 'bondi' | 'taxi' | 'auto-mariposa' | 'camion'; volcado?: boolean }
  | { f: 'cosa'; que: string };

export interface OpcionesCuadrupedo {
  orejas: 'punta' | 'caidas' | 'redondas' | 'largas' | 'chicas' | 'cuernos';
  hocico: 'largo' | 'corto' | 'chato';
  cola: 'larga' | 'peluda' | 'corta' | 'enrulada' | 'fina';
  pose?: string;
  lana?: boolean;
  manchas?: boolean;
  joroba?: boolean;
  cuello?: 'largo';
  izq?: boolean;
  con?: readonly string[];
}

export interface OpcionesPersona {
  ropa?: string;
  pose?: string;
  con?: readonly string[];
}

/* ------------------------------------------------------------------
   Las primitivas: cinco formas y un trazo
   ------------------------------------------------------------------ */

const n = (v: number): string => (Math.round(v * 10) / 10).toString();

/**
 * Las clases de tinta llevan el prefijo `b-` y se pintan en `sitio.css` **sin ancestro**: una
 * figura vive en un `<symbol>` y se ve a través de `<use>`, y las copias de un `<use>` no
 * heredan un selector como `.bestiario-svg .tn`. Se comprobó en el navegador el 2026-10-16:
 * con el selector con ancestro, todas las figuras salían negras.
 */
export const tinta = (c: string): string =>
  c.split(' ').map((x) => (x.startsWith('b-') ? x : `b-${x}`)).join(' ');
const E = (cx: number, cy: number, rx: number, ry: number, c = 'tn', rot = 0): string =>
  `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" class="${tinta(c)}"${rot ? ` transform="rotate(${rot} ${n(cx)} ${n(cy)})"` : ''}/>`;
const C = (cx: number, cy: number, r: number, c = 'tn'): string => `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" class="${tinta(c)}"/>`;
const R = (x: number, y: number, w: number, h: number, c = 'tn', rx = 0, rot = 0): string =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"${rx ? ` rx="${rx}"` : ''} class="${tinta(c)}"${rot ? ` transform="rotate(${rot} ${n(x + w / 2)} ${n(y + h / 2)})"` : ''}/>`;
const P = (d: string, c = 'tn'): string => `<path d="${d}" class="${tinta(c)}"/>`;
/** Un trazo de tinta sin relleno. `g` es el grueso. */
const T = (d: string, g = 3, c = 'tz'): string => `<path d="${d}" class="${tinta(c)}" stroke-width="${g}"/>`;
const G = (cuerpo: string, transform: string): string => `<g transform="${transform}">${cuerpo}</g>`;

/** El agua a la altura del pecho: tres ondas de papel. Para lo que nada o flota. */
const agua = (y: number): string =>
  R(0, y, 100, 92 - y + 6, 'ag') + T(`M2 ${y} q8 -5 16 0 t16 0 t16 0 t16 0 t16 0 t16 0`, 2.5, 'tz-pp');

/* ------------------------------------------------------------------
   El cuadrúpedo
   ------------------------------------------------------------------ */

function orejas(o: OpcionesCuadrupedo['orejas'], hx: number, hy: number, r: number): string {
  switch (o) {
    case 'punta':
      return P(`M${hx - r * 0.9} ${hy - r * 0.4} L${hx - r * 0.5} ${hy - r * 1.9} L${hx} ${hy - r * 0.8} Z`) +
        P(`M${hx} ${hy - r * 0.8} L${hx + r * 0.5} ${hy - r * 1.9} L${hx + r * 0.9} ${hy - r * 0.4} Z`);
    case 'caidas':
      return E(hx - r * 0.8, hy + r * 0.1, r * 0.35, r * 0.85, 'tn', 18) + E(hx + r * 0.1, hy - r * 0.6, r * 0.32, r * 0.7, 'tn', -30);
    case 'redondas':
      return C(hx - r * 0.6, hy - r * 0.85, r * 0.5) + C(hx + r * 0.55, hy - r * 0.9, r * 0.5) + C(hx + r * 0.55, hy - r * 0.9, r * 0.22, 'pp');
    case 'largas':
      return E(hx - r * 0.4, hy - r * 1.7, r * 0.3, r * 1.2, 'tn', -12) + E(hx + r * 0.25, hy - r * 1.75, r * 0.3, r * 1.2, 'tn', 14);
    case 'chicas':
      return P(`M${hx - r * 0.7} ${hy - r * 0.6} L${hx - r * 0.4} ${hy - r * 1.3} L${hx - r * 0.05} ${hy - r * 0.8} Z`);
    case 'cuernos':
      return T(`M${hx - r * 0.5} ${hy - r * 0.7} q-${r * 0.4} -${r * 1.2} ${r * 0.5} -${r * 1.4}`, 3) +
        T(`M${hx + r * 0.3} ${hy - r * 0.8} q${r * 0.1} -${r * 1.2} ${r * 0.9} -${r * 1.1}`, 3) +
        E(hx - r * 0.95, hy - r * 0.3, r * 0.45, r * 0.25, 'tn', -20);
  }
}

function hocico(h: OpcionesCuadrupedo['hocico'], hx: number, hy: number, r: number, arriba = false): string {
  if (arriba) {
    if (h === 'largo') return P(`M${hx - r * 0.2} ${hy - r * 0.5} L${hx + r * 0.9} ${hy - r * 1.9} L${hx + r * 0.9} ${hy - r * 0.1} Z`);
    return E(hx + r * 0.7, hy - r * 0.6, r * 0.55, r * 0.45, 'tn', -40);
  }
  switch (h) {
    case 'largo':
      return P(`M${hx + r * 0.4} ${hy - r * 0.55} L${hx + r * 2} ${hy + r * 0.2} L${hx + r * 1.9} ${hy + r * 0.45} L${hx + r * 0.4} ${hy + r * 0.75} Z`) +
        C(hx + r * 1.95, hy + r * 0.25, r * 0.22);
    case 'corto':
      return E(hx + r * 0.95, hy + r * 0.25, r * 0.55, r * 0.45);
    case 'chato':
      return E(hx + r * 1.05, hy + r * 0.15, r * 0.45, r * 0.55) + C(hx + r * 1.2, hy + r * 0.05, r * 0.12, 'pp') + C(hx + r * 1.2, hy + r * 0.35, r * 0.12, 'pp');
  }
}

function cola(c: OpcionesCuadrupedo['cola'], x: number, y: number, s: number): string {
  switch (c) {
    case 'larga':
      return T(`M${x} ${y} q${-12 * s} ${-4 * s} ${-14 * s} ${-18 * s}`, 3.2);
    case 'peluda':
      return E(x - 9 * s, y - 2 * s, 11 * s, 4.2 * s, 'tn', 28);
    case 'corta':
      return C(x - 1, y + 1, 4 * s);
    case 'enrulada':
      return T(`M${x} ${y} q${-8 * s} ${-2 * s} ${-7 * s} ${-8 * s} q${1 * s} ${-5 * s} ${5 * s} ${-3 * s} q${2 * s} ${3 * s} ${-2 * s} ${4 * s}`, 2.4);
    case 'fina':
      return T(`M${x} ${y} q${-8 * s} ${4 * s} ${-12 * s} ${14 * s}`, 1.8);
  }
}

/** Un cuadrúpedo parado, mirando a la derecha. Las poses lo doblan o lo giran. */
function cuadrupedo(o: OpcionesCuadrupedo): string {
  const pose = o.pose ?? 'parado';
  const con = new Set(o.con ?? []);
  const echado = pose === 'echado';
  const sentado = pose === 'sentado' || pose === 'de-espaldas';
  const bajo = pose === 'acecha' ? 7 : 0;
  const cuerpoY = echado ? 80 : sentado ? 66 : 58 + bajo;
  const patasAlto = echado ? 0 : 92 - (cuerpoY + 8);
  let s = '';

  // La cola va primero: queda atrás del cuerpo.
  if (sentado) s += cola(o.cola, 40, 86, 1);
  else s += cola(o.cola, 25, cuerpoY - 4, 1);

  if (con.has('manto')) s += R(14, 84, 72, 8, 'tn', 2);

  // Las patas.
  if (!echado && !sentado) {
    for (const [x, atras] of [[30, true], [38, false], [57, true], [65, false]] as const) {
      s += R(x, cuerpoY + 4, 5.5, patasAlto + 4, atras ? 'tn osc' : 'tn', 2);
    }
  }
  if (sentado) {
    s += R(56, 64, 5.5, 28, 'tn', 2) + R(63, 64, 5.5, 28, 'tn', 2);
    s += E(48, 82, 14, 10);
  }
  if (echado) s += E(70, 89, 9, 3) + E(30, 89, 8, 3);

  // El cuerpo.
  if (sentado) s += E(52, 64, 13, 19, 'tn', 12);
  else if (o.lana) {
    s += E(48, cuerpoY, 25, 14, 'pp lana');
    for (const [dx, dy] of [[-18, -6], [-8, -11], [4, -11], [15, -7], [-20, 5], [18, 4], [-6, 9], [8, 9]] as const) {
      s += C(48 + dx, cuerpoY + dy, 6, 'pp lana');
    }
  } else s += E(48, cuerpoY, 25, echado ? 10 : 13);

  if (o.manchas) s += E(40, cuerpoY - 3, 6, 4, 'pp') + E(56, cuerpoY + 3, 5, 3.5, 'pp') + E(30, cuerpoY + 4, 3.5, 3, 'pp');
  if (o.joroba) s += E(44, cuerpoY - 12, 11, 9);
  if (con.has('toallon')) s += R(36, cuerpoY - 13, 12, 26, 'pp', 2);

  // El cuello y la cabeza.
  let hx: number;
  let hy: number;
  const r = 9.5;
  const arriba = pose === 'aulla' || pose === 'mira-arriba';
  const abajo = pose === 'come' || pose === 'olfatea';
  if (sentado) { hx = 60; hy = 40; }
  else if (echado) { hx = 76; hy = 74; }
  else if (abajo) { hx = 78; hy = 80; }
  else if (o.cuello === 'largo') {
    hx = 80; hy = 30 + bajo;
    s += P(`M62 ${cuerpoY - 8} L${hx - 4} ${hy + 2} L${hx + 4} ${hy + 6} L72 ${cuerpoY + 2} Z`);
  } else if (arriba) { hx = 72; hy = 36; }
  else { hx = 74; hy = 46 + bajo * 1.3; }
  if (!sentado && !echado && o.cuello !== 'largo') s += E((62 + hx) / 2, (cuerpoY - 4 + hy) / 2 + 2, 9, 8, 'tn', -35);

  s += orejas(o.orejas, hx, hy, r);
  s += C(hx, hy, r);
  if (pose !== 'de-espaldas') s += hocico(o.hocico, hx, hy, r, arriba);
  if (pose !== 'de-espaldas') s += C(hx + r * 0.25, hy - r * 0.15, r * 0.2, 'pp');
  if (con.has('barbita')) s += P(`M${hx + r * 0.6} ${hy + r * 0.6} l3 9 l3 -8 Z`);
  if (con.has('corona')) s += P(`M${hx - 7} ${hy - 8} l2 -9 l3 5 l2 -7 l2 7 l3 -5 l2 9 Z`, 'ac');
  if (pose === 'ladra' || pose === 'aulla') {
    const bx = arriba ? hx + 14 : hx + 24;
    const by = arriba ? hy - 22 : hy - 2;
    s += T(`M${bx} ${by} l7 -4 M${bx + 1} ${by + 6} l8 0 M${bx} ${by + 12} l7 4`, 2.2);
  }
  if (con.has('mecha')) s += P('M14 33 q-3 -6 2 -11 q0 5 4 6 q2 -5 0 -9 q7 5 2 14 Z', 'ac');
  if (con.has('plato')) s += E(88, 89, 10, 3.5, 'pp borde');

  let todo = s;
  if (pose === 'trepa') todo = G(todo, 'rotate(-62 50 55)');
  if (pose === 'parado-dos') todo = G(todo, 'rotate(-48 50 70)');
  if (pose === 'nada') todo = G(todo, 'translate(0 18)') + agua(78);
  return o.izq ? G(todo, 'translate(100 0) scale(-1 1)') : todo;
}

/* ------------------------------------------------------------------
   Las aves
   ------------------------------------------------------------------ */

function ave(d: Extract<Dibujo, { f: 'ave' }>): string {
  const con = new Set(d.con ?? []);
  switch (d.tipo) {
    case 'lechuza':
      return E(50, 60, 20, 26) + P('M32 40 l4 -14 l8 10 Z') + P('M68 40 l-4 -14 l-8 10 Z') + C(42, 46, 8, 'pp') + C(58, 46, 8, 'pp') +
        C(42, 46, 3.5) + C(58, 46, 3.5) + P('M47 54 l3 7 l3 -7 Z', 'ac') + R(42, 84, 4, 8) + R(54, 84, 4, 8);
    case 'rapaz':
      return P('M4 44 Q26 30 46 46 Q50 40 54 46 Q74 30 96 44 Q76 46 60 58 L50 70 L40 58 Q24 46 4 44 Z') + C(50, 40, 7) +
        P('M50 44 l3 7 l-6 0 Z', 'ac') + P('M44 66 l6 12 l6 -12 Z');
    case 'buitre':
      return E(46, 60, 20, 18, 'tn', -15) + P('M30 52 Q20 70 34 84 L44 70 Z', 'tn osc') + T('M58 48 q8 -8 6 -16', 5) + C(66, 30, 6, 'pp borde') +
        P('M71 30 l9 4 l-9 3 Z') + R(40, 76, 3, 16) + R(50, 76, 3, 16);
    case 'gallo':
      return P('M18 40 q-6 -16 10 -22 q-2 10 6 14 q-4 -14 10 -16 q-4 12 4 20 Z', 'ac') + E(48, 58, 20, 16) + C(66, 38, 8) +
        P('M62 30 l2 -8 l3 5 l3 -6 l2 7 Z', 'ac') + P('M74 38 l9 3 l-9 3 Z') + E(70, 47, 2.5, 4, 'ac') + C(68, 36, 1.6, 'pp') +
        R(42, 72, 3, 20) + R(52, 72, 3, 20);
    case 'pichon':
      return E(50, 70, 15, 12) + C(62, 58, 7) + P('M68 57 l7 2 l-7 3 Z') + C(63, 56, 1.5, 'pp') + P('M36 68 l-10 -4 l2 8 Z') + R(46, 80, 2.5, 12) + R(53, 80, 2.5, 12) +
        T('M18 86 a12 12 0 1 1 0.1 0', 1.6) + T('M18 86 a6 6 0 1 1 0.1 0', 1.6);
    case 'pajarito': {
      const pajaro = E(50, 62, 10, 8) + C(58, 54, 5) + P('M62 53 l6 2 l-6 2 Z', 'ac') + C(59, 53, 1.2, 'pp') + P('M41 61 l-8 -3 l1 6 Z') + R(48, 69, 2, 8);
      if (!con.has('jaula')) return pajaro;
      return T('M24 90 L24 40 Q50 6 76 40 L76 90 Z M36 90 L36 26 M50 90 L50 16 M64 90 L64 26 M24 60 L76 60', 2) + R(48, 77, 6, 2.5) + pajaro;
    }
  }
}

/* ------------------------------------------------------------------
   Los bichos chicos y los del agua
   ------------------------------------------------------------------ */

function bicho(d: Extract<Dibujo, { f: 'bicho' }>): string {
  const p = d.punteado;
  const t = p ? 'pun' : 'tn';
  switch (d.tipo) {
    case 'mosca': {
      const alas = E(42, 40, 13, 7, p ? 'pun' : 'pp borde', -30) + E(54, 40, 13, 7, p ? 'pun' : 'pp borde', 30);
      const patas = T('M42 62 l-8 10 M48 64 l-2 12 M54 64 l2 12 M60 62 l8 10', 2, p ? 'pun' : 'tz');
      return patas + E(50, 56, 13, 9, t) + alas + C(64, 52, 7, t) + (p ? '' : C(66, 50, 2.6, 'ac'));
    }
    case 'hormiga': {
      const h = T('M40 64 l-8 12 M46 64 l0 14 M52 64 l8 12 M40 60 l-10 -6 M52 58 l10 -8 M46 58 l0 -10', 2) +
        E(30, 62, 9, 7) + E(46, 62, 6, 5) + C(60, 58, 6) + T('M62 52 q4 -10 10 -10 M64 54 q6 -6 12 -4', 1.6);
      return d.pose === 'duerme' ? G(h, 'rotate(180 50 60) translate(0 -12)') : h;
    }
    case 'mantis':
      return T('M40 62 l-10 26 M46 62 l4 26 M30 60 l-12 26', 2) + E(36, 60, 18, 5, 'tn', -10) + P('M52 54 L66 36 L70 40 L56 58 Z') +
        P('M64 32 l10 -2 l-4 10 Z') + T('M62 44 l14 -6 l-2 12 M58 48 l16 2 l-6 10', 2.6) + C(70, 32, 1.4, 'pp');
    case 'polilla':
      return P('M50 56 L14 30 Q8 54 30 70 Z', 'pp borde') + P('M50 56 L86 30 Q92 54 70 70 Z', 'pp borde') +
        E(50, 58, 4, 16) + C(26, 48, 4) + C(74, 48, 4) + T('M48 42 l-6 -10 M52 42 l6 -10', 1.6);
  }
}

function pez(d: Extract<Dibujo, { f: 'pez' }>): string {
  const anzuelo = (d.con ?? []).includes('anzuelo');
  return (anzuelo ? T('M74 0 L74 46 q0 8 -6 8 q-6 0 -6 -6', 1.8) : '') +
    E(52, 62, 22, 11) + P('M30 62 L12 50 L14 74 Z') + C(66, 59, 2.4, 'pp') + P('M50 52 l6 -10 l6 10 Z', 'tn osc');
}

const anguila = (): string =>
  T('M8 70 q10 -20 20 0 t20 0 t20 0 t18 -6', 9) + C(88, 63, 6) + C(90, 62, 1.6, 'pp') + R(0, 78, 100, 14, 'barro', 3);

function rana(d: Extract<Dibujo, { f: 'rana' }>): string {
  const corona = (d.con ?? []).includes('corona');
  return E(50, 74, 24, 14) + E(34, 86, 12, 5) + E(66, 86, 12, 5) + C(40, 58, 7) + C(60, 58, 7) + C(40, 57, 3.5, 'pp') + C(60, 57, 3.5, 'pp') +
    C(40, 57, 1.5) + C(60, 57, 1.5) + T('M40 76 q10 6 20 0', 2, 'tz-pp') +
    (corona ? P('M40 50 l2 -10 l4 6 l4 -8 l4 8 l4 -6 l2 10 Z', 'ac') : '');
}

const almeja = (): string =>
  P('M14 84 Q50 20 86 84 Z') + T('M50 84 L50 42 M50 84 L32 52 M50 84 L68 52 M50 84 L22 68 M50 84 L78 68', 2, 'tz-pp') + R(34, 84, 32, 6, 'tn', 2);

/* ------------------------------------------------------------------
   La gente
   ------------------------------------------------------------------ */

function persona(o: OpcionesPersona): string {
  const con = new Set(o.con ?? []);
  const ropa = o.ropa ?? 'saco';
  const pose = o.pose ?? 'parado';
  const cx = 50;
  let cabezaY = 20;
  let s = '';

  // Lo que va detrás de todo.
  if (con.has('alas')) s += P('M44 36 Q14 18 8 46 Q22 44 30 58 Z', 'pp borde') + P('M56 36 Q86 18 92 46 Q78 44 70 58 Z', 'pp borde');
  if (ropa === 'capa' || con.has('capa-heroe')) s += P('M36 32 L64 32 L78 88 L22 88 Z', con.has('capa-heroe') ? 'ac' : 'tn osc');
  if (con.has('cola-diablo')) s += T('M40 66 q-22 6 -26 -12', 2.6) + P('M10 50 l8 -2 l-2 8 Z');
  if (con.has('bombo')) s += C(28, 62, 12, 'ac') + T('M18 56 l20 12 M18 68 l20 -12', 1.6);

  // Las piernas, según la pose.
  const piernas = (): string => {
    if (con.has('cola-de-pez')) return P('M40 60 Q36 80 50 86 Q40 92 34 92 L66 92 Q60 92 52 86 Q64 80 60 60 Z', 'ac');
    switch (pose) {
      case 'sentado':
        return R(38, 62, 24, 8, 'tn', 3) + R(56, 62, 8, 24, 'tn', 2) + R(40, 62, 8, 24, 'tn osc', 2);
      case 'corre':
        return R(42, 62, 7, 26, 'tn', 2, 28) + R(52, 62, 7, 26, 'tn osc', 2, -32);
      case 'baila':
        return R(46, 62, 6, 28, 'tn', 2) + R(54, 58, 6, 24, 'tn osc', 2, -70);
      case 'arrastra':
        return R(42, 62, 7, 26, 'tn', 2, 12) + R(52, 62, 7, 24, 'tn osc', 2, -6) + T('M30 92 l-14 0 M34 88 l-12 0', 1.6);
      default:
        if (['tunica', 'vestido', 'pollera', 'levita', 'guardapolvo', 'poncho'].includes(ropa)) return R(43, 76, 5, 16, 'tn', 2) + R(52, 76, 5, 16, 'tn', 2);
        return R(42, 62, 7, 30, 'tn', 2) + R(52, 62, 7, 30, 'tn osc', 2);
    }
  };
  if (ropa !== 'nada' || con.has('cola-de-pez')) s += piernas();
  if (con.has('tacones')) s += P('M40 90 l8 0 l0 2 l-8 0 Z M48 92 l1 -4', 'ac') + P('M51 90 l8 0 l0 2 l-8 0 Z', 'ac');

  // El cuerpo, según la ropa.
  const panza = con.has('panza');
  switch (ropa) {
    case 'tunica':
    case 'vestido':
    case 'pollera':
      s += P(`M42 32 L58 32 L${ropa === 'pollera' ? 72 : 68} 80 L${ropa === 'pollera' ? 28 : 32} 80 Z`, ropa === 'vestido' ? 'tn' : ropa === 'pollera' ? 'ac' : 'pp borde');
      if (ropa === 'pollera') s += R(42, 32, 16, 18);
      break;
    case 'levita':
    case 'guardapolvo':
      s += P('M38 32 L62 32 L66 82 L34 82 Z', ropa === 'guardapolvo' ? 'pp borde' : 'tn');
      break;
    case 'poncho':
      s += P('M30 60 L50 30 L70 60 Z', 'ac') + T('M30 60 L70 60', 2);
      break;
    case 'malla':
      s += P('M42 32 L58 32 L60 64 L40 64 Z', 'ac');
      break;
    case 'nada':
      s += P('M42 32 L58 32 L60 62 L40 62 Z');
      break;
    case 'rayado':
      s += P('M38 32 L62 32 L64 66 L36 66 Z', 'pp borde') + T('M37 42 L63 42 M36 52 L64 52 M36 61 L64 61', 3);
      break;
    case 'gaban':
      s += P('M36 30 L64 30 L68 76 L32 76 Z') + R(36, 28, 28, 8, 'tn osc', 2);
      break;
    default:
      if (panza) s += E(50, 52, 18, 16);
      else s += P('M38 32 L62 32 L65 66 L35 66 Z');
      if (ropa === 'uniforme') s += C(50, 42, 1.8, 'pp') + C(50, 50, 1.8, 'pp') + C(50, 58, 1.8, 'pp');
      if (ropa === 'campera') s += T('M50 34 L50 64', 1.6, 'tz-pp');
      if (ropa === 'remera') s += R(40, 40, 20, 4, 'ac');
  }
  if (panza && ropa !== 'saco') s += E(50, 54, 16, 13);

  // Los brazos.
  const arriba = pose === 'baila' || con.has('corazon');
  if (arriba) s += T('M40 36 L28 18 M60 36 L72 18', 5);
  else if (pose === 'sentado' && con.has('botella')) s += T('M40 36 L32 56 M60 36 L74 30', 5);
  else s += T('M40 36 L32 62 M60 36 L68 62', 5);

  // La cabeza.
  const calavera = con.has('calavera');
  s += C(cx, cabezaY, 9.5, calavera ? 'pp borde' : 'tn');
  if (calavera) s += C(46.5, 19, 2.4) + C(53.5, 19, 2.4) + T('M46 26 l8 0', 1.6);
  else if (pose !== 'de-espaldas') s += C(46.5, 19, 1.4, 'pp') + C(53.5, 19, 1.4, 'pp');
  if (con.has('mascara')) s += R(40, 15, 20, 6, 'ac', 2);
  if (con.has('colmillos')) s += P('M46 24 l1.5 4 l1.5 -4 Z M51 24 l1.5 4 l1.5 -4 Z', 'pp');
  if (con.has('barba')) s += P('M41 22 Q50 50 59 22 Z', 'az');
  if (con.has('vidrio')) s += P('M52 24 l10 -3 l-3 7 Z', 'pp borde');

  // Lo que lleva en la cabeza.
  if (con.has('aureola')) s += E(cx, 6, 10, 3, 'tz-oro');
  if (con.has('corona')) s += P('M40 13 l2 -11 l4 6 l4 -8 l4 8 l4 -6 l2 11 Z', 'ac');
  if (con.has('cuernos')) s += P('M42 14 q-4 -8 -2 -14 q4 6 6 12 Z') + P('M58 14 q4 -8 2 -14 q-4 6 -6 12 Z');
  if (con.has('muchos-cuernos')) {
    for (let i = 0; i < 7; i++) {
      const a = -80 + i * 27;
      const rad = (a * Math.PI) / 180;
      const x0 = cx + Math.sin(rad) * 8;
      const y0 = cabezaY - Math.cos(rad) * 8;
      s += P(`M${n(x0 - 2)} ${n(y0)} L${n(cx + Math.sin(rad) * 18)} ${n(cabezaY - Math.cos(rad) * 18)} L${n(x0 + 2)} ${n(y0)} Z`);
    }
  }
  if (con.has('sombrero')) s += R(36, 9, 28, 3) + R(42, 0, 16, 10, 'tn', 1);
  if (con.has('gorra')) s += P('M40 14 Q50 2 60 14 Z') + R(56, 12, 12, 3);
  if (con.has('gorra-nado')) s += P('M40 18 Q50 4 60 18 Z', 'pp borde');
  if (con.has('bonete')) s += P('M40 13 L30 0 L46 8 L50 -4 L54 8 L70 0 L60 13 Z', 'ac');
  if (con.has('antenas')) s += T('M45 12 l-6 -12 M55 12 l6 -12', 2) + C(39, 0, 2.6, 'ac') + C(61, 0, 2.6, 'ac');
  if (con.has('casco')) s += P('M39 20 Q50 0 61 20 Z', 'tn osc') + R(40, 17, 20, 4, 'pp');
  if (con.has('toca')) s += P('M38 26 Q50 2 62 26 L66 46 L34 46 Z', 'ac') + C(cx, 21, 7.5) + C(47, 20, 1.3, 'pp') + C(53, 20, 1.3, 'pp');
  if (con.has('capucha')) s += P('M38 30 L50 -2 L62 30 Z') + R(44, 16, 12, 4, 'pp');
  if (con.has('anillo')) s += E(cx, 18, 18, 4, 'tz-oro', -12);
  if (con.has('llama')) s += P('M42 14 q-2 -10 6 -16 q-1 8 4 9 q2 -6 0 -10 q10 8 2 18 Z', 'ac');
  if (con.has('mono-pelo')) s += P('M56 8 l8 -5 l0 10 Z M56 8 l-8 -5 l0 10 Z', 'ac');
  if (con.has('humo')) s += T('M58 6 q4 -6 0 -10 q-4 -4 2 -8', 1.6) + T('M44 4 q-4 -4 0 -8', 1.6);

  // Lo que lleva encima o en las manos.
  if (con.has('botella')) {
    const [bx, by] = pose === 'sentado' ? [72, 16] : [66, 52];
    s += R(bx, by, 7, 16, 'ac', 2) + R(bx + 2, by - 6, 3, 7, 'ac');
  }
  if (con.has('cuchillo')) s += P('M68 60 l2 -26 l4 2 l-3 24 Z', 'pp borde') + R(66, 58, 6, 8);
  if (con.has('corazon')) s += P('M44 8 q-6 -8 -12 0 q0 6 12 14 q12 -8 12 -14 q-6 -8 -12 0 Z', 'ac');
  if (con.has('estrella')) s += P('M50 40 l2.5 5 l5.5 .5 l-4 4 l1 5.5 l-5 -2.5 l-5 2.5 l1 -5.5 l-4 -4 l5.5 -.5 Z', 'oro');
  if (con.has('llaves')) s += T('M66 58 a5 5 0 1 0 0.1 0', 2, 'tz-oro') + T('M70 62 l6 6 M66 64 l2 8', 2, 'tz-oro');
  if (con.has('guitarra')) s += E(62, 56, 9, 7, 'ac', -30) + R(64, 30, 3, 26, 'tn', 1, 40);
  if (con.has('valija')) s += R(66, 64, 18, 14, 'ac', 2) + T('M71 64 l0 -4 l8 0 l0 4', 2);
  if (con.has('manzana')) s += C(70, 56, 6, 'ac') + T('M70 50 l2 -5', 1.6);
  if (con.has('servilleta')) s += P('M43 30 L57 30 L50 44 Z', 'pp borde');
  if (con.has('tenedor')) s += T('M72 62 L74 30 M70 30 l0 6 M74 30 l0 6 M78 30 l0 6 M70 36 l8 0', 2);
  if (con.has('copa') || con.has('vaso')) s += T('M66 46 l10 0 l-2 10 l-6 0 Z M71 56 l0 6', 2, 'tz-pp');
  if (con.has('flor')) s += C(68, 50, 4, 'ac') + T('M68 54 l0 8', 1.6);
  if (con.has('soga')) s += T('M50 30 q-4 -8 6 -12 L60 -6', 2);
  if (con.has('cadena')) s += T('M32 62 l-6 6 l-6 -2 l-6 6 l-6 -2', 2.4);
  if (con.has('toallon')) s += R(36, 54, 28, 8, 'pp borde', 2);

  // Las poses que mueven todo.
  if (pose === 'colgado') return G(s, 'rotate(180 50 46)') + T('M50 92 L50 100 M26 100 L74 100', 3);
  if (pose === 'flota' || pose === 'nada') {
    let fant = '';
    if (con.has('sabana')) fant = P('M60 10 Q60 -10 78 -10 Q96 -10 96 10 L96 30 l-6 -5 l-6 5 l-6 -5 l-6 5 l-6 -5 l-6 5 Z', 'pp borde') + C(73, 4, 2) + C(83, 4, 2);
    return G(s, pose === 'nada' ? 'translate(0 40) rotate(-70 50 50)' : 'translate(-10 38)') + agua(66) + fant;
  }
  if (con.has('bote')) s = P('M20 30 Q50 52 80 30 L76 22 L24 22 Z', 'ac') + G(s, 'translate(0 22)') + agua(82);
  if (pose === 'echada' || pose === 'duerme') {
    const hamaca = pose === 'echada' ? T('M6 40 Q50 80 94 40', 2.6) : '';
    return hamaca + G(s, 'rotate(-90 50 50) translate(-14 0)');
  }
  return s;
}

/* ------------------------------------------------------------------
   Los fierros y las cosas
   ------------------------------------------------------------------ */

function maquina(d: Extract<Dibujo, { f: 'maquina' }>): string {
  let s: string;
  switch (d.que) {
    case 'tele':
      s = T('M40 22 L28 4 M60 22 L72 4', 2.4) + R(16, 22, 68, 54, 'tn', 6) + R(23, 29, 46, 40, 'pp', 8) + C(76, 36, 3, 'ac') + C(76, 48, 3, 'ac') +
        T('M30 40 l30 0 M30 48 l24 0 M30 56 l30 0', 2, 'tz') + R(26, 76, 5, 14) + R(69, 76, 5, 14);
      break;
    case 'pacman':
      s = P('M58 50 L88 32 A36 36 0 1 0 88 68 Z', 'oro') + C(56, 34, 4) + C(96, 50, 3, 'pp borde') + C(80, 50, 0.1);
      break;
    case 'bondi':
      s = R(2, 36, 96, 44, 'tn', 8) + R(8, 42, 14, 14, 'pp', 2) + R(26, 42, 14, 14, 'pp', 2) + R(44, 42, 14, 14, 'pp', 2) + R(62, 42, 14, 14, 'pp', 2) +
        R(82, 42, 12, 26, 'ac', 2) + R(2, 62, 96, 4, 'ac') + C(22, 82, 8) + C(22, 82, 3, 'pp') + C(76, 82, 8) + C(76, 82, 3, 'pp') +
        C(96, 50, 5) + T('M96 56 l0 18 M96 62 l6 8', 3);
      break;
    case 'taxi':
      s = P('M6 70 L14 56 L30 54 L40 40 L68 40 L78 54 L94 58 L94 74 L6 74 Z') + R(30, 54, 64, 6, 'oro') + R(42, 44, 12, 10, 'pp', 1) + R(58, 44, 10, 10, 'pp', 1) +
        R(48, 34, 12, 6, 'oro', 1) + C(24, 76, 8) + C(24, 76, 3, 'pp') + C(76, 76, 8) + C(76, 76, 3, 'pp');
      if (d.volcado) s = G(s, 'rotate(180 50 62)');
      break;
    case 'auto-mariposa':
      s = P('M30 50 Q10 6 2 30 Q8 52 30 58 Z', 'ac') + P('M70 50 Q90 6 98 30 Q92 52 70 58 Z', 'ac') + P('M30 50 Q18 70 24 80 L36 60 Z', 'ac') +
        P('M70 50 Q82 70 76 80 L64 60 Z', 'ac') + P('M14 76 L20 62 L36 58 L44 46 L60 46 L68 58 L86 62 L88 78 L14 78 Z') + R(46, 50, 12, 8, 'pp', 1) +
        C(28, 80, 7) + C(28, 80, 2.6, 'pp') + C(74, 80, 7) + C(74, 80, 2.6, 'pp') + T('M44 46 l-6 -12 M56 46 l6 -12', 1.8);
      break;
    case 'camion':
      s = R(4, 44, 60, 30, 'tn', 2) + T('M4 44 l0 -6 l60 0 l0 6', 2) + R(66, 46, 30, 28, 'tn', 4) + R(72, 50, 18, 12, 'pp', 2) + C(20, 78, 8) + C(20, 78, 3, 'pp') +
        C(80, 78, 8) + C(80, 78, 3, 'pp') + C(16, 34, 6) + R(22, 32, 34, 6) + R(40, 28, 10, 6, 'ac', 1) +
        P('M20 8 l2 5 l5 0 l-4 3 l2 5 l-5 -3 l-5 3 l2 -5 l-4 -3 l5 0 Z', 'oro') + P('M60 14 l1.5 3 l3 0 l-2.5 2 l1 3 l-3 -2 l-3 2 l1 -3 l-2.5 -2 l3 0 Z', 'oro');
      break;
  }
  return s;
}

function cosa(que: string): string {
  switch (que) {
    case 'silla':
      return R(28, 6, 8, 86, 'tn', 2) + R(28, 6, 40, 8, 'tn', 2) + R(28, 26, 40, 5) + R(26, 52, 50, 9, 'tn', 2) + R(66, 56, 7, 36, 'tn', 2) + R(30, 58, 6, 34, 'tn osc', 2) +
        T('M82 14 l10 -8 M86 30 l12 0 M82 46 l10 6', 2.4, 'tz-oro');
    case 'bunuelos':
      return E(50, 80, 42, 12, 'pp borde') + C(32, 70, 10) + C(52, 68, 11) + C(70, 72, 9) + C(42, 56, 10) + C(62, 54, 9) + C(52, 42, 9) +
        C(29, 67, 2.4, 'pp') + C(49, 64, 2.6, 'pp') + C(67, 69, 2.2, 'pp') + C(39, 53, 2.4, 'pp') + C(59, 51, 2.2, 'pp') + C(49, 39, 2.2, 'pp');
    case 'bestia-pop': {
      let rayos = '';
      for (let i = 0; i < 10; i++) {
        const a = (i * 36 * Math.PI) / 180;
        rayos += `M${n(50 + Math.cos(a) * 34)} ${n(50 + Math.sin(a) * 34)} L${n(50 + Math.cos(a) * 46)} ${n(50 + Math.sin(a) * 46)} `;
      }
      return T(rayos, 3, 'tz-oro') + P('M22 60 Q16 26 40 22 L44 10 L50 20 L58 8 L60 22 Q86 26 80 60 Q78 84 50 86 Q24 84 22 60 Z') +
        C(40, 46, 7, 'pp') + C(62, 46, 7, 'pp') + C(41, 47, 3) + C(61, 47, 3) + P('M36 64 Q50 76 66 64 L60 68 L56 64 L50 70 L46 64 L42 68 Z', 'ac') +
        R(32, 84, 10, 8, 'tn', 2) + R(58, 84, 10, 8, 'tn', 2);
    }
    case 'nidos':
      return T('M6 70 L94 54', 5) + P('M14 66 Q22 80 34 64 Z') + P('M52 60 Q60 74 72 58 Z') + T('M18 64 q8 -2 14 -2 M56 58 q8 -2 14 -2', 1.6, 'tz-pp') +
        T('M40 30 q4 -6 8 0 q4 6 8 0 M64 24 q4 -6 8 0', 2) ;
    case 'jaula-vacia':
      return T('M14 92 L14 30 Q50 -6 86 30 L86 92 Z M26 92 L26 16 M38 92 L38 8 M50 92 L50 6', 2.6) + T('M62 92 L82 74 L82 22 M74 92 L94 74', 2.6) +
        R(10, 88, 80, 5) + T('M86 46 l8 -4', 2);
    case 'nube-quieta':
      return P('M14 38 Q10 20 28 20 Q34 6 52 12 Q68 2 78 18 Q94 20 88 38 Z') + T('M30 44 l-4 10 M50 44 l-4 10 M70 44 l-4 10', 2) +
        E(54, 84, 26, 8) + C(80, 80, 8) + P('M76 72 l2 -8 l4 6 Z') + T('M26 84 q-10 -2 -14 6', 2.4);
    case 'cruz-con-flores':
      return R(44, 18, 10, 74) + R(30, 34, 38, 9) + C(30, 86, 5, 'ac') + C(40, 88, 4, 'ac') + C(64, 86, 5, 'ac') + C(72, 89, 3.5, 'ac') +
        T('M30 86 l0 6 M64 86 l0 6', 1.6) + R(76, 76, 18, 8, 'tn', 3) + C(80, 88, 3) + C(90, 88, 3);
    case 'vaso-con-moscon':
      return E(50, 56, 9, 6) + E(44, 50, 6, 4, 'pp borde', -20) + E(56, 50, 6, 4, 'pp borde', 20) + C(58, 55, 4) +
        T('M24 92 L30 22 L70 22 L76 92 Z', 2.6, 'tz') + T('M34 30 L32 80', 2, 'tz-pp') + R(20, 90, 60, 3) + T('M80 40 l8 -4 M82 52 l10 0', 1.8);
    case 'limon':
      // Un limón verde que corre: la fruta con el pezón adelante, la hoja, los ojos para atrás.
      return P('M22 46 Q22 22 48 20 Q70 18 80 36 L90 40 L80 46 Q76 70 50 72 Q24 72 22 46 Z', 'ac') + P('M44 22 Q36 6 22 8 Q30 20 44 22 Z') +
        C(56, 38, 6, 'pp') + C(70, 38, 5, 'pp') + C(53, 38, 2.6) + C(67, 38, 2.4) + P('M60 52 Q66 50 70 54 Q66 60 60 56 Z') +
        T('M42 70 L32 84 L40 92 M56 70 L66 84 L60 94', 3) + T('M26 48 L12 40 M78 54 L90 64', 2.6);
    case 'sombra':
      return P('M14 92 Q10 50 30 40 Q46 26 66 36 Q90 46 86 92 Z', 'tn osc') + C(40, 56, 4, 'oro') + C(60, 56, 4, 'oro');
    default:
      throw new Error(`no sé dibujar la cosa "${que}"`);
  }
}

/** El marcado de una figura, en su caja de 100 × 100. Tira si el dibujo no existe. */
export function dibujar(d: Dibujo): string {
  switch (d.f) {
    case 'cuadrupedo': return cuadrupedo(d);
    case 'ave': return ave(d);
    case 'bicho': return bicho(d);
    case 'pez': return pez(d);
    case 'anguila': return anguila();
    case 'rana': return rana(d);
    case 'almeja': return almeja();
    case 'persona': return persona(d);
    case 'maquina': return maquina(d);
    case 'cosa': return cosa(d.que);
  }
}

/**
 * Varias del mismo dibujo, para los que andan en grupo (el rebaño, la murga, la jauría).
 * Se corren de costado y apenas de alto, como un sello estampado varias veces a mano.
 */
export function dibujarGrupo(d: Dibujo, cantidad: number): string {
  const una = dibujar(d);
  if (cantidad <= 1) return una;
  const paso = 46;
  const ancho = 100 + paso * (cantidad - 1);
  const escala = 100 / ancho;
  let s = '';
  for (let i = cantidad - 1; i >= 0; i--) {
    const dy = i % 2 === 0 ? 0 : -8;
    // El piso de cada copia (y = 92) queda en el piso de la caja.
    s += G(una, `translate(${n(i * paso * escala)} ${n(92 * (1 - escala) + dy * escala)}) scale(${(Math.round(escala * 1000) / 1000).toString()})`);
  }
  return s;
}
