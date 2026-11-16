/**
 * Los árboles del monte y el campo de la pastura (`D-91`, `T-530`, primera vuelta).
 *
 * El usuario: *"buscá ambientes mejorables [...] más misterio, nieblas [...] manteniendo la esencia y
 * el alma y el diseño rocambolesco"*. Lo que se veía en las capturas: lo lejano del monte era una fila
 * de tiras iguales a la misma altura (un serrucho, una estantería), y la pastura usaba ese mismo fondo.
 *
 * - **El monte** pasa a tener árboles: troncos torcidos de papel rasgado (el canto en dientes de la
 *   contratapa de *Lobo suelto* queda, como corteza, de un solo lado y a tramos), ramas que terminan
 *   en manos, y tres planos que se separan por valor y por bruma: lo lejano fino, gris y frío; lo de
 *   adelante grueso, negro, con el canto caliente. Uno de los de adelante es casi una cara.
 * - **La pastura** es el claro visto desde adentro: cielo abierto en los azules del cordero, la luna
 *   naranja de la tapa de *Cordero atado* saliendo detrás de la lomada, el monte allá lejos, un molino
 *   y el alambrado.
 *
 * Todo a aerógrafo y **se imprime** (`arte-camino.ts`, `arte-aire.ts`). Acá no vive ni un hex.
 */

import { forma, nube, soplo, trazo } from './aerografo.ts';
import { M, azar } from './arte.ts';

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
type P = readonly [number, number];
type Azar = () => number;

/** Las tintas que el monte suma a las de `M`: el petróleo frío de *Lobo suelto* para lo lejano, el ocre del lobo para el canto de lo cercano. */
export const MONTE = {
  frio: 'var(--disco-lobo-suelto-apoyo)',
  ocre: 'var(--bestia-lobo-ocre)',
  crema: 'var(--bestia-lobo-crema)',
  ojo: 'var(--acento-2)',
} as const;

/** Las del campo: los azules del cordero y el naranja de su tapa. */
export const CAMPO = {
  cielo: 'var(--bestia-cordero-lana-oscura)',
  azul: 'var(--bestia-cordero-lana)',
  claro: 'var(--bestia-cordero-lana-clara)',
  hondo: 'var(--bestia-cordero-azul-hondo)',
  escama: 'var(--bestia-cordero-escama)',
  luna: 'var(--entorno-pastura)',
  lunaHonda: 'var(--entorno-pastura-honda)',
  pezunia: 'var(--bestia-cordero-pezunia)',
  papel: 'var(--papel)',
} as const;

/* ------------------------------------------------------------------
   El miembro: un tronco, una rama o un dedo
   ------------------------------------------------------------------ */

interface Miembro {
  izq: P[];
  der: P[];
  espina: P[];
  /** Para dónde apunta al final, en radianes. */
  rumbo: number;
}

/**
 * Una espina combada de `a` a `b`, que se retuerce (`tuerce`, en unidades, con `vueltas` idas y
 * vueltas) y se afina de `w0` a `w1`. Devuelve los dos cantos.
 */
function miembro(a: P, b: P, comba: number, w0: number, w1: number, tuerce = 0, vueltas = 1.5, fase = 0, n = 14): Miembro {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const largo = Math.hypot(dx, dy) || 1;
  const nx = -dy / largo;
  const ny = dx / largo;
  const espina: P[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const arco = Math.sin(t * Math.PI) * comba + Math.sin(t * Math.PI * vueltas * 2 + fase) * tuerce * (0.3 + t * 0.7);
    espina.push([a[0] + dx * t + nx * arco, a[1] + dy * t + ny * arco]);
  }
  const izq: P[] = [];
  const der: P[] = [];
  let rumbo = Math.atan2(dy, dx);
  for (let i = 0; i <= n; i++) {
    const p = espina[i]!;
    const q = espina[Math.min(n, i + 1)]!;
    const o = espina[Math.max(0, i - 1)]!;
    const tx = q[0] - o[0];
    const ty = q[1] - o[1];
    const tl = Math.hypot(tx, ty) || 1;
    const w = (w0 + (w1 - w0) * (i / n)) / 2;
    izq.push([p[0] + (ty / tl) * w, p[1] - (tx / tl) * w]);
    der.push([p[0] - (ty / tl) * w, p[1] + (tx / tl) * w]);
    if (i === n) rumbo = Math.atan2(ty, tx);
  }
  return { izq, der, espina, rumbo };
}

const linea = (ps: readonly P[]): string => ps.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join(' ');
const contorno = (m: Miembro): string => `${linea(m.izq)} ${[...m.der].reverse().map((p) => `L${f(p[0])} ${f(p[1])}`).join(' ')} Z`;

/** En qué punto de la espina, y para dónde va ahí. */
function en(m: Miembro, t: number): { p: P; rumbo: number } {
  const n = m.espina.length - 1;
  const i = Math.min(n - 1, Math.max(0, Math.floor(t * n)));
  const a = m.espina[i]!;
  const b = m.espina[i + 1]!;
  const u = t * n - i;
  return { p: [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], rumbo: Math.atan2(b[1] - a[1], b[0] - a[0]) };
}

/**
 * Una mano: de la punta de una rama salen tres a cinco dedos largos, flacos y con nudillo, abiertos
 * en abanico y un poco crispados. Es lo que hace que las ramas no sean palos.
 */
function mano(desde: P, rumbo: number, largo: number, grosor: number, rnd: Azar): Miembro[] {
  const dedos = 3 + Math.floor(rnd() * 3);
  const abre = 0.9 + rnd() * 0.5;
  const s: Miembro[] = [];
  for (let i = 0; i < dedos; i++) {
    const u = dedos === 1 ? 0 : i / (dedos - 1) - 0.5;
    const ang = rumbo + u * abre + (rnd() - 0.5) * 0.18;
    const l = largo * (0.65 + rnd() * 0.5) * (1 - Math.abs(u) * 0.35);
    const punta: P = [desde[0] + Math.cos(ang) * l, desde[1] + Math.sin(ang) * l];
    // Crispado: cada dedo se comba para el lado de adentro de la mano.
    s.push(miembro(desde, punta, -u * l * 0.5 + (rnd() - 0.5) * l * 0.12, grosor * (0.7 + rnd() * 0.3), 0.6, l * 0.03, 1, rnd() * 6, 8));
  }
  return s;
}

export interface Arbol {
  /** Todo lo que es cuerpo: tronco, ramas, dedos. */
  cuerpo: string;
  /** El canto que agarra la luz: los dientes del tronco y un pelo a lo largo de cada rama. */
  canto: string;
  /** La sombra del lado de atrás, para soplar. */
  sombra: string;
  tronco: Miembro;
}

export interface Receta {
  x: number;
  /** Dónde pisa y hasta dónde llega el tronco (puede pasarse del borde de arriba). */
  base: number;
  copa: number;
  grosor: number;
  /** Cuánto se va de costado de la base a la copa. */
  cae: number;
  /** Cuánto se retuerce. */
  tuerce: number;
  /** Cuántas ramas, y lo largas que son en partes del alto. */
  ramas: number;
  largoDeRama: number;
  /** Si las ramas terminan en manos. */
  manos: boolean;
  /** Si el canto derecho del tronco lleva los dientes de papel rasgado, y cuánto salen. */
  dientes: number;
  /** Si abajo se abre en raíces. */
  raices: boolean;
}

/** Un árbol entero, de papel rasgado: el tronco torcido, las ramas que suben como brazos, las manos. */
export function arbol(r: Receta, rnd: Azar): Arbol {
  const alto = r.base - r.copa;
  const tronco = miembro([r.x, r.base], [r.x + r.cae, r.copa], (rnd() - 0.5) * alto * 0.08, r.grosor, r.grosor * (0.32 + rnd() * 0.2), r.tuerce, 0.8 + rnd() * 1.4, rnd() * 6, 22);
  const miembros: Miembro[] = [tronco];
  for (let i = 0; i < r.ramas; i++) {
    const t = 0.38 + ((i + rnd() * 0.8) / Math.max(1, r.ramas)) * 0.56;
    const { p, rumbo } = en(tronco, Math.min(0.97, t));
    const lado = (i + (rnd() < 0.2 ? 1 : 0)) % 2 ? 1 : -1;
    // Sube como un brazo: sale de costado y dobla para arriba.
    const ang = rumbo + lado * (0.55 + rnd() * 0.75);
    const l = alto * r.largoDeRama * (0.55 + rnd() * 0.7) * (1.15 - t * 0.5);
    const w = r.grosor * (0.36 - t * 0.16);
    const punta: P = [p[0] + Math.cos(ang) * l, p[1] + Math.sin(ang) * l];
    const rama = miembro(p, punta, lado * l * (0.16 + rnd() * 0.2), Math.max(2.4, w), Math.max(1.4, w * 0.42), l * 0.04, 1.2, rnd() * 6, 12);
    miembros.push(rama);
    if (r.manos) miembros.push(...mano(punta, rama.rumbo, l * (0.3 + rnd() * 0.22), Math.max(1.6, w * 0.4), rnd));
    // Cada tanto, una rama corta que sale del codo.
    if (rnd() < 0.45) {
      const codo = en(rama, 0.45 + rnd() * 0.2);
      const a2 = codo.rumbo - lado * (0.7 + rnd() * 0.5);
      const l2 = l * (0.3 + rnd() * 0.25);
      const p2: P = [codo.p[0] + Math.cos(a2) * l2, codo.p[1] + Math.sin(a2) * l2];
      const chica = miembro(codo.p, p2, -lado * l2 * 0.2, Math.max(1.8, w * 0.5), 1.1, 0, 1, 0, 8);
      miembros.push(chica);
      if (r.manos && rnd() < 0.7) miembros.push(...mano(p2, chica.rumbo, l2 * 0.5, 1.5, rnd));
    }
  }
  if (r.raices) {
    const cuantas = 3 + Math.floor(rnd() * 3);
    for (let i = 0; i < cuantas; i++) {
      const u = i / (cuantas - 1) - 0.5;
      const l = r.grosor * (0.9 + rnd() * 0.9);
      const pie: P = [r.x + u * r.grosor * 0.7, r.base - r.grosor * 0.5];
      const punta: P = [r.x + u * (r.grosor + l * 1.6), r.base + 10 + rnd() * 8];
      miembros.push(miembro(pie, punta, -u * l * 0.7, r.grosor * 0.42, 2.2, l * 0.05, 1, rnd() * 6, 9));
    }
  }
  let cuerpo = miembros.map(contorno).join(' ');
  // Los dientes: el canto derecho del tronco, rasgado como las tiras de la contratapa. A tramos y
  // desparejos (un tronco no es una sierra): nacen, crecen y se pierden.
  let canto = '';
  if (r.dientes > 0) {
    const d = tronco.der;
    const fase = rnd() * 6;
    for (let i = 1; i < d.length - 2; i++) {
      const a = d[i]!;
      const b = d[i + 1]!;
      const largoSeg = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const cuantos = Math.max(1, Math.round(largoSeg / (9 + rnd() * 5)));
      const fuerza = Math.max(0, Math.sin(i * 0.9 + fase)) * (1 - i / d.length) + 0.12;
      for (let k = 0; k < cuantos; k++) {
        const p0: P = [a[0] + ((b[0] - a[0]) * k) / cuantos, a[1] + ((b[1] - a[1]) * k) / cuantos];
        const p1: P = [a[0] + ((b[0] - a[0]) * (k + 1)) / cuantos, a[1] + ((b[1] - a[1]) * (k + 1)) / cuantos];
        // Hacia afuera: la normal del tramo, del lado derecho.
        const nx = -(b[1] - a[1]) / largoSeg;
        const ny = (b[0] - a[0]) / largoSeg;
        const sale = r.dientes * fuerza * (0.5 + rnd());
        if (sale < 1.2) continue;
        const pico: P = [p0[0] * 0.3 + p1[0] * 0.7 - nx * sale, p0[1] * 0.3 + p1[1] * 0.7 - ny * sale];
        const diente = `M${f(p0[0])} ${f(p0[1])} L${f(pico[0])} ${f(pico[1])} L${f(p1[0])} ${f(p1[1])} Z`;
        cuerpo += ' ' + diente;
        canto += diente + ' ';
      }
    }
  }
  // El pelo de luz a lo largo del canto derecho del tronco y de arriba de cada rama.
  const pelos = miembros.slice(0, 1 + r.ramas * 2).map((m) => linea(m.der.slice(1, -1))).join(' ');
  // La sombra: el canto izquierdo del tronco, engordado hacia adentro.
  const sombra = `${linea(tronco.izq)} ${[...tronco.espina].reverse().map((p) => `L${f(p[0])} ${f(p[1])}`).join(' ')} Z`;
  return { cuerpo, canto: canto + '|' + pelos, sombra, tronco };
}

/** Pinta un árbol: el cuerpo plano, la sombra soplada adentro, y el canto prendido. */
export function pintarArbol(a: Arbol, cuerpo: string, luz: string, o = 1, fuerzaDeLuz = 0.8): string {
  const [dientes, pelos] = a.canto.split('|') as [string, string];
  return (
    `<g${o < 1 ? ` opacity="${f(o)}"` : ''}>` +
    forma(a.cuerpo, cuerpo) +
    (dientes.trim() ? soplo(dientes, luz, 'xs', fuerzaDeLuz) : '') +
    (pelos.trim() ? `<path d="${pelos}" fill="none" stroke="${luz}" stroke-width="1.3" stroke-linecap="round" opacity="${f(fuerzaDeLuz * 0.5)}" filter="url(#soplo-xs)"/>` : '') +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   Lo que premia a la lupa
   ------------------------------------------------------------------ */

/**
 * La cara: dos nudos y un tajo en un tronco gordo. No es un dibujo de una cara: son dos agujeros que
 * no están a la misma altura y una grieta, y la cara la pone el que mira.
 */
export function caraEnElTronco(t: Miembro, altura: number, grosor: number): string {
  const { p, rumbo } = en(t, altura);
  const giro = (rumbo * 180) / Math.PI + 90;
  const w = grosor * 0.22;
  const nudo = (dx: number, dy: number, r: number, cae: number): string =>
    `<ellipse cx="${f(dx)}" cy="${f(dy)}" rx="${f(r)}" ry="${f(r * 1.35)}" fill="${M.negro}" transform="rotate(${cae} ${f(dx)} ${f(dy)})"/>` +
    // El reborde de la corteza, que agarra la luz de arriba.
    trazo(`M${f(dx - r * 1.25)} ${f(dy - r * 0.3)} Q${f(dx)} ${f(dy - r * 2.1)} ${f(dx + r * 1.25)} ${f(dy - r * 0.1)}`, MONTE.ocre, 1.4, 0.55) +
    // Algo, adentro, que devuelve la luz.
    nube(dx + r * 0.2, dy + r * 0.25, r * 0.22, r * 0.22, MONTE.ojo, 'xs', 0.5);
  const grieta =
    `M${f(-w * 1.5)} ${f(w * 2.7)} L${f(-w * 0.8)} ${f(w * 3.2)} L${f(-w * 0.3)} ${f(w * 2.8)} L${f(w * 0.3)} ${f(w * 3.5)} L${f(w * 0.9)} ${f(w * 2.9)} L${f(w * 1.6)} ${f(w * 3.3)} ` +
    `L${f(w * 0.9)} ${f(w * 3.9)} L${f(w * 0.2)} ${f(w * 4.4)} L${f(-w * 0.5)} ${f(w * 3.8)} L${f(-w * 1.1)} ${f(w * 4)} Z`;
  return (
    `<g transform="translate(${f(p[0])} ${f(p[1])}) rotate(${f(giro)})">` +
    nudo(-w * 1.05, -w * 0.4, w * 0.62, -12) +
    nudo(w * 1.1, w * 0.3, w * 0.5, 9) +
    forma(grieta, M.negro) +
    trazo(`M${f(-w * 1.5)} ${f(w * 2.7)} L${f(-w * 0.8)} ${f(w * 3.2)} L${f(-w * 0.3)} ${f(w * 2.8)} L${f(w * 0.3)} ${f(w * 3.5)} L${f(w * 0.9)} ${f(w * 2.9)} L${f(w * 1.6)} ${f(w * 3.3)}`, MONTE.ocre, 1, 0.4) +
    `</g>`
  );
}

/**
 * Lo que alguien dejó tallado a cortaplumas: «P.R.» y, abajo, palotes de contar. Mide unos pocos
 * milímetros en la pantalla: se lee con la lupa.
 */
export function tallado(t: Miembro, altura: number): string {
  const { p, rumbo } = en(t, altura);
  const giro = (rumbo * 180) / Math.PI + 90 + 4;
  const letras = 'M-9 4 L-9 -6 L-5.5 -6 Q-3 -6 -3 -3.4 Q-3 -1 -5.5 -1 L-9 -1 M-0.6 4 l0.1 0.1 M3 4 L3 -6 L6.5 -6 Q9 -6 9 -3.4 Q9 -1 6.5 -1 L3 -1 M6 -1 L9.4 4 M11.6 4 l0.1 0.1';
  const palotes = 'M-8 9 l0.6 6 M-5 9 l0.4 6 M-2 9.4 l0.5 5.8 M1 9 l0.4 6 M-9.4 14 L3 9.6 M6 9.4 l0.5 5.8 M9 9 l0.4 6';
  return `<g transform="translate(${f(p[0])} ${f(p[1])}) rotate(${f(giro)})">` + trazo(letras, MONTE.crema, 1.1, 0.7) + trazo(palotes, MONTE.crema, 0.9, 0.55) + `</g>`;
}

/* ------------------------------------------------------------------
   El monte, por planos
   ------------------------------------------------------------------ */

/** Lo de más atrás: palos finos, grises, casi tragados por la bruma fría. Ni ramas tienen. */
export function planoLejano(desde: number, hasta: number, pie: number, semilla: number): string {
  const rnd = azar(semilla);
  let s = '';
  for (let x = desde; x < hasta; ) {
    // De a manchones: tres o cuatro juntos y un hueco por donde se ve más bruma.
    const grupo = 2 + Math.floor(rnd() * 4);
    for (let i = 0; i < grupo; i++) {
      const g = 4 + rnd() * 7;
      const a = arbol({ x: x + rnd() * 10, base: pie + rnd() * 14, copa: -30 - rnd() * 40, grosor: g, cae: (rnd() - 0.5) * 50, tuerce: 2 + rnd() * 5, ramas: rnd() < 0.5 ? 1 + Math.floor(rnd() * 2) : 0, largoDeRama: 0.14, manos: false, dientes: 0, raices: false }, rnd);
      s += pintarArbol(a, M.hondo, M.medio, 0.34 + rnd() * 0.3, 0.3);
      x += g + 9 + rnd() * 22;
    }
    x += 26 + rnd() * 70;
  }
  return s;
}

/** Los del medio: árboles enteros, con brazos y manos, en el pardo oscuro del lobo. Cada uno a su altura. */
export function planoMedio(desde: number, hasta: number, pie: number, semilla: number): string {
  const rnd = azar(semilla);
  let s = '';
  for (let x = desde + rnd() * 60; x < hasta; ) {
    const g = 13 + rnd() * 15;
    // Unos se pierden arriba; otros terminan a la vista, con la copa pelada abierta contra la bruma.
    const entero = rnd() < 0.55;
    const copa = entero ? 40 + rnd() * 90 : -60 - rnd() * 40;
    const a = arbol({ x, base: pie + rnd() * 12, copa, grosor: g, cae: (rnd() - 0.5) * 70, tuerce: 5 + rnd() * 9, ramas: entero ? 3 + Math.floor(rnd() * 3) : 2 + Math.floor(rnd() * 2), largoDeRama: entero ? 0.34 : 0.24, manos: true, dientes: 5 + rnd() * 4, raices: false }, rnd);
    s += pintarArbol(a, M.oscuro, M.sombra, 1, 0.75);
    s += soplo(a.sombra, M.negro, 's', 0.55);
    x += 46 + rnd() * 104;
  }
  return s;
}

export interface TroncoCercano {
  x: number;
  grosor: number;
  /** `cara`, el que es casi una cara; `tallado`, el que tiene la marca; `caido`, el que se venció contra el de al lado. */
  que?: 'cara' | 'tallado' | 'caido';
}

/**
 * Los de adelante: troncos gordos que cruzan la vista de arriba abajo, negros, con el canto de dientes
 * prendido en ocre y las raíces agarradas al piso como dedos. Son pocos y cada uno es alguien.
 */
export function troncosCercanos(troncos: readonly TroncoCercano[], pie: number, semilla: number, prefijo: string): string {
  const rnd = azar(semilla);
  let s = '';
  troncos.forEach((t, i) => {
    const caido = t.que === 'caido';
    const a = arbol(
      { x: t.x, base: pie, copa: -70, grosor: t.grosor, cae: caido ? 240 : (rnd() - 0.5) * 60, tuerce: caido ? 4 : 7 + rnd() * 8, ramas: caido ? 2 : 2 + Math.floor(rnd() * 2), largoDeRama: 0.2, manos: true, dientes: 8 + rnd() * 5, raices: !caido },
      rnd,
    );
    s +=
      `<g data-tronco="${prefijo}-${i}">` +
      pintarArbol(a, M.negro, MONTE.ocre, 1, 0.9) +
      // El volumen: un lomo apenas más claro del lado de la luz, y la sombra honda del otro.
      `<path d="${linea(a.tronco.der)} ${[...a.tronco.espina].reverse().map((p) => `L${f(p[0])} ${f(p[1])}`).join(' ')} Z" fill="${M.oscuro}" filter="url(#soplo-s)" opacity="0.85"/>` +
      (t.que === 'cara' ? caraEnElTronco(a.tronco, 0.56, t.grosor) : '') +
      (t.que === 'tallado' ? tallado(a.tronco, 0.36) : '') +
      `</g>`;
  });
  return s;
}

/** La bruma entre plano y plano: manchas, no una franja. Es lo que los separa. */
export function brumaEntrePlanos(desde: number, hasta: number, y: number, alto: number, color: string, o: number, semilla: number): string {
  const rnd = azar(semilla);
  let s = '';
  for (let x = desde + rnd() * 160; x < hasta; x += 130 + rnd() * 210) s += nube(x, y + (rnd() - 0.5) * alto, 80 + rnd() * 110, alto * (0.5 + rnd() * 0.6), color, 'xl', o * (0.55 + rnd() * 0.6));
  return s;
}

/* ------------------------------------------------------------------
   El campo de la pastura
   ------------------------------------------------------------------ */

/** Un espiral de crayón, de los de la contratapa de *Cordero atado*: en el cielo hacen de nubes. */
function espiral(cx: number, cy: number, r: number, color: string, ancho: number, o: number, achate = 0.5, vueltas = 2.5): string {
  let d = '';
  for (let k = 0; k <= 70; k++) {
    const a = (k / 70) * Math.PI * 2 * vueltas;
    const rr = (r * k) / 70;
    d += `${k ? 'L' : 'M'}${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr * achate)} `;
  }
  return trazo(d, color, ancho, o);
}

/** El monte, allá lejos, alrededor del claro: puntas de tiras, chiquitas, recortadas contra el cielo. */
function monteAlFondo(desde: number, hasta: number, h: number, rnd: Azar): string {
  let d = `M${f(desde)} ${h + 4}`;
  for (let x = desde; x < hasta; ) {
    const w = 5 + rnd() * 9;
    const alto = 8 + rnd() * 20 + Math.sin(x / 130) * 6;
    d += ` L${f(x + w * 0.4 + (rnd() - 0.5) * 3)} ${f(h - alto)} L${f(x + w)} ${f(h - 1 - rnd() * 3)}`;
    x += w;
  }
  return forma(`${d} L${f(hasta)} ${h + 4} Z`, M.negro);
}

/** Una lomada: el lomo del campo, de canto duro arriba y perdida abajo. */
function lomada(desde: number, hasta: number, y: number, alto: number, paso: number, color: string, rnd: Azar, o = 1): string {
  let d = `M${f(desde)} ${f(y)}`;
  for (let x = desde; x < hasta; x += paso) d += ` Q${f(x + paso / 2)} ${f(y - alto * (0.3 + rnd() * 1.1))} ${f(x + paso)} ${f(y - rnd() * alto * 0.25)}`;
  return forma(`${d} L${f(hasta + paso)} ${f(y + 80)} L${f(desde)} ${f(y + 80)} Z`, color, o);
}

/** El molino de campo: la torre de fierro, la rueda y la cola. Y el tanque al pie. */
function molino(x: number, pie: number, alto: number): string {
  const c: P = [x, pie - alto];
  let s = trazo(`M${f(x - alto * 0.16)} ${pie} L${f(x - 2)} ${f(c[1] + 4)} M${f(x + alto * 0.16)} ${pie} L${f(x + 2)} ${f(c[1] + 4)}`, M.negro, 2);
  // Las cruces de la torre.
  for (let i = 0; i < 4; i++) {
    const u0 = i / 4;
    const u1 = (i + 1) / 4;
    const w0 = alto * 0.16 * (1 - u0) + 2 * u0;
    const w1 = alto * 0.16 * (1 - u1) + 2 * u1;
    const y0 = pie - (alto - 4) * u0;
    const y1 = pie - (alto - 4) * u1;
    s += trazo(`M${f(x - w0)} ${f(y0)} L${f(x + w1)} ${f(y1)} M${f(x + w0)} ${f(y0)} L${f(x - w1)} ${f(y1)}`, M.negro, 1);
  }
  // La rueda: aspas, vista medio de costado.
  const r = alto * 0.24;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + 0.2;
    s += forma(`M${f(c[0])} ${f(c[1])} L${f(c[0] + Math.cos(a - 0.11) * r * 0.8)} ${f(c[1] + Math.sin(a - 0.11) * r)} L${f(c[0] + Math.cos(a + 0.11) * r * 0.8)} ${f(c[1] + Math.sin(a + 0.11) * r)} Z`, M.negro);
  }
  s += forma(`M${f(c[0] + 2)} ${f(c[1] - 1.5)} L${f(c[0] + r * 1.5)} ${f(c[1] - r * 0.4)} L${f(c[0] + r * 1.7)} ${f(c[1] + r * 0.3)} L${f(c[0] + 2)} ${f(c[1] + 1.5)} Z`, M.negro);
  // El tanque australiano, y un pelo de luna en el borde.
  s += forma(`M${f(x + alto * 0.3)} ${pie} l0 ${f(-alto * 0.15)} l${f(alto * 0.5)} 0 l0 ${f(alto * 0.15)} Z`, M.negro);
  s += trazo(`M${f(x + alto * 0.31)} ${f(pie - alto * 0.15)} l${f(alto * 0.48)} 0`, CAMPO.luna, 1, 0.5);
  return s;
}

/** El lobo, chiquito, aullándole a la luna desde la lomada. Se adivina antes de verse: es para la lupa. */
function loboEnLaLomada(x: number, y: number, k: number): string {
  const d =
    `M0 0 L1 -7 L-1 -8 L0 -13 L3 -15 L4 -22 L7 -27 L8 -24 L10 -26 L10 -22 L15 -30 L16 -28 L13 -21 L12 -16 L15 -12 L19 -11 L22 -6 L24 2 L27 5 L22 4 L21 0 L20 -1 L19 0 L17 0 L17 -5 L9 -6 L5 -2 L5 0 Z`;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k)})">` + forma(d, M.negro) + `</g>`;
}

/** Dónde está la luna en lo lejano de la pastura, y lo que mide: la usa el piso para devolverla en el agua. */
export const LUNA = { x: 700, y: 318, r: 118 } as const;

/**
 * Lo lejano de la pastura: el cielo abierto en los azules del cordero, con los espirales de crayón de
 * su contratapa haciendo de nubes; la luna naranja de la tapa saliendo detrás de la lomada; el monte
 * todo alrededor, lejos; el molino.
 */
export function pasturaLejos(ancho: number, alto: number): string {
  const rnd = azar(907);
  const h = 304;
  let estrellas = '';
  for (let i = 0; i < Math.round(ancho / 9); i++) {
    const x = rnd() * ancho;
    const y = rnd() * (h - 50);
    // Cerca de la luna no hay estrellas: su luz las tapa.
    if (Math.hypot(x - LUNA.x, y - LUNA.y) < LUNA.r * 2.1) continue;
    estrellas += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.5 + rnd() * 0.9)}" opacity="${f(0.25 + rnd() * 0.6)}"/>`;
  }
  let nubes = '';
  for (let x = 90 + rnd() * 80; x < ancho; x += 230 + rnd() * 260) {
    if (Math.abs(x - LUNA.x) < LUNA.r * 1.5) continue;
    nubes += espiral(x, 70 + rnd() * 130, 26 + rnd() * 34, rnd() < 0.5 ? CAMPO.claro : CAMPO.escama, 2.4 + rnd() * 1.6, 0.34 + rnd() * 0.22, 0.4 + rnd() * 0.15);
  }
  // Las manchas de la luna: los mismos espirales, en el naranja hondo.
  const manchas =
    espiral(LUNA.x - 38, LUNA.y - 58, 26, CAMPO.lunaHonda, 3.2, 0.75, 0.8) +
    espiral(LUNA.x + 40, LUNA.y - 34, 17, CAMPO.lunaHonda, 2.6, 0.7, 0.85) +
    espiral(LUNA.x + 4, LUNA.y - 92, 11, CAMPO.lunaHonda, 2.2, 0.65, 0.9);
  let molinos = '';
  for (const [x, a] of [[188, 86], [1420, 58], [2140, 74]] as const) if (x < ancho) molinos += molino(x, h + 2, a);
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${CAMPO.cielo}"/>` +
    // El cielo: hondo arriba, y se aclara y se enfría hacia el horizonte.
    nube(ancho / 2, -30, ancho * 0.8, 90, M.negro, 'xl', 0.6) +
    nube(ancho / 2, h - 40, ancho * 0.8, 120, CAMPO.azul, 'xl', 0.9) +
    brumaEntrePlanos(0, ancho, h - 24, 26, CAMPO.claro, 0.34, 911) +
    `<g fill="${CAMPO.papel}">${estrellas}</g>` +
    nubes +
    // La luna de *Cordero atado*: el resplandor, el disco de canto duro, y lo hondo del lado de abajo.
    nube(LUNA.x, LUNA.y - 20, LUNA.r * 2.3, LUNA.r * 1.5, CAMPO.lunaHonda, 'xl', 0.5) +
    nube(LUNA.x, LUNA.y - 10, LUNA.r * 1.35, LUNA.r * 1.2, CAMPO.luna, 'xl', 0.45) +
    `<circle cx="${LUNA.x}" cy="${LUNA.y}" r="${LUNA.r}" fill="${CAMPO.luna}"/>` +
    nube(LUNA.x - 30, LUNA.y - 50, LUNA.r * 0.55, LUNA.r * 0.5, CAMPO.pezunia, 'l', 0.6) +
    nube(LUNA.x + 50, LUNA.y + 20, LUNA.r * 0.7, LUNA.r * 0.8, CAMPO.lunaHonda, 'l', 0.7) +
    manchas +
    // El monte, lejos, todo alrededor; y delante la lomada, más clara cuanto más atrás.
    monteAlFondo(-10, ancho + 10, h - 2, rnd) +
    brumaEntrePlanos(0, ancho, h - 6, 10, CAMPO.claro, 0.3, 913) +
    lomada(-10, ancho + 10, h + 2, 16, 190, CAMPO.hondo, rnd) +
    loboEnLaLomada(LUNA.x - 74, h - 9, 0.62) +
    molinos +
    lomada(-10, ancho + 10, h + 16, 10, 140, M.negro, rnd) +
    forma(`M-10 ${h + 24} L${ancho + 10} ${h + 24} L${ancho + 10} ${alto + 10} L-10 ${alto + 10} Z`, M.negro) +
    // La bruma baja del horizonte, que se junta en los bajos.
    brumaEntrePlanos(0, ancho, h + 14, 8, CAMPO.claro, 0.2, 917) +
    `</g>`
  );
}

/* ---- El alambrado ---- */

/**
 * Un tramo de alambrado: postes de madera, cada uno un poco para su lado, y tres hilos que se comban
 * entre poste y poste. Alguno cortado, que cuelga enrulado; y en las púas, vellones de lana.
 */
export function alambrado(desde: number, hasta: number, pie: number, alto: number, paso: number, semilla: number, tranquera?: number): string {
  const rnd = azar(semilla);
  const postes: { x: number; cae: number; h: number }[] = [];
  for (let x = desde; x <= hasta; x += paso * (0.85 + rnd() * 0.3)) postes.push({ x, cae: (rnd() - 0.5) * 9, h: alto * (0.88 + rnd() * 0.24) });
  let s = '';
  const punta = (p: { x: number; cae: number; h: number }, u: number): P => [p.x + p.cae * u, pie - p.h * u];
  for (let i = 0; i < postes.length - 1; i++) {
    const a = postes[i]!;
    const b = postes[i + 1]!;
    const enTranquera = tranquera !== undefined && a.x <= tranquera && b.x > tranquera;
    if (enTranquera) {
      // La tranquera, abierta: cinco tablas y la cruz, colgada del poste y vencida para adentro.
      const w = (b.x - a.x) * 0.72;
      const t = `<g transform="translate(${f(a.x + 3)} ${f(pie - a.h * 0.94)}) skewY(13)">` +
        [0, 0.24, 0.48, 0.72, 0.96].map((u) => forma(`M0 ${f(a.h * 0.8 * u)} l${f(w)} 0 l0 2.6 l${f(-w)} 0 Z`, M.sombra)).join('') +
        trazo(`M0 0 L${f(w)} ${f(a.h * 0.78)} M${f(w)} 0 l0 ${f(a.h * 0.8)}`, M.sombra, 2.2) +
        trazo(`M0 0.6 l${f(w)} 0`, M.claro, 0.9, 0.5) +
        `</g>`;
      s += t;
      continue;
    }
    for (const [k, u] of [0.9, 0.6, 0.3].entries()) {
      const p = punta(a, u);
      const q = punta(b, u);
      const roto = rnd() < 0.09;
      if (roto) {
        // El hilo cortado: cae del poste y se enrula.
        s += trazo(`M${f(p[0])} ${f(p[1])} q${f((q[0] - p[0]) * 0.3)} ${f(10 + k * 3)} ${f((q[0] - p[0]) * 0.34)} ${f(alto * u * 0.7)} q4 5 -1 7 q-5 0 -3 -5`, M.medio, 0.9, 0.6);
        continue;
      }
      s += trazo(`M${f(p[0])} ${f(p[1])} Q${f((p[0] + q[0]) / 2)} ${f((p[1] + q[1]) / 2 + 2.5 + rnd() * 3)} ${f(q[0])} ${f(q[1])}`, M.medio, 0.9, 0.55);
      // Un vellón enganchado: lana del cordero, o de alguno del rebaño.
      if (rnd() < 0.13) {
        const m: P = [p[0] + (q[0] - p[0]) * (0.25 + rnd() * 0.5), (p[1] + q[1]) / 2 + 3];
        s += nube(m[0], m[1] + 2, 3.2, 2.4, CAMPO.papel, 'xs', 0.8) + nube(m[0] + 1.5, m[1] + 4.5, 2, 2.6, CAMPO.claro, 'xs', 0.7);
      }
    }
  }
  for (const p of postes) {
    const w = 3 + rnd() * 1.4;
    const t = punta(p, 1);
    const d = `M${f(p.x - w)} ${pie + 2} L${f(t[0] - w * 0.8)} ${f(t[1])} L${f(t[0] + w * 0.7)} ${f(t[1] - 2)} L${f(p.x + w)} ${pie + 2} Z`;
    s += nube(p.x + 3, pie + 2, 9, 2.4, M.negro, 's', 0.7) + forma(d, M.sombra) + trazo(`M${f(p.x - w + 0.8)} ${pie} L${f(t[0] - w * 0.8 + 0.8)} ${f(t[1] + 1)}`, CAMPO.pezunia, 1, 0.55) + trazo(`M${f(p.x + w - 0.6)} ${pie} L${f(t[0] + w * 0.7 - 0.6)} ${f(t[1])}`, M.negro, 1.2, 0.7);
  }
  return s;
}

/** Una mata de pasto: hojas que salen de un punto, combadas, con alguna punta que agarra la luna. */
export function mataDePasto(x: number, y: number, alto: number, rnd: Azar, cuerpo: string, luz: string, hojas = 9): string {
  let s = '';
  for (let i = 0; i < hojas; i++) {
    const cae = (rnd() - 0.5) * alto * 1.3;
    const h = alto * (0.5 + rnd() * 0.5);
    const w = 0.9 + rnd() * 1.5 + alto * 0.012;
    const bx = x + (rnd() - 0.5) * alto * 0.4;
    const d = `M${f(bx - w)} ${f(y)} Q${f(bx - w + cae * 0.15)} ${f(y - h * 0.65)} ${f(bx + cae)} ${f(y - h)} Q${f(bx + w + cae * 0.4)} ${f(y - h * 0.55)} ${f(bx + w)} ${f(y)} Z`;
    s += forma(d, i % 4 === 0 ? luz : cuerpo, i % 4 === 0 ? 0.75 : 1);
  }
  return s;
}

/** Un cardo: el tallo, dos hojas en pico y la cabeza, que de noche es una borla clara. */
export function cardo(x: number, y: number, alto: number, rnd: Azar): string {
  const cae = (rnd() - 0.5) * alto * 0.3;
  const c: P = [x + cae, y - alto];
  return (
    trazo(`M${f(x)} ${f(y)} Q${f(x + cae * 0.2)} ${f(y - alto * 0.6)} ${f(c[0])} ${f(c[1])}`, CAMPO.hondo, 1.5) +
    forma(`M${f(x)} ${f(y - alto * 0.3)} l${f(-alto * 0.3)} ${f(-alto * 0.16)} l${f(alto * 0.2)} ${f(alto * 0.02)} l${f(-alto * 0.08)} ${f(-alto * 0.14)} Z`, CAMPO.hondo) +
    forma(`M${f(x + cae * 0.3)} ${f(y - alto * 0.5)} l${f(alto * 0.28)} ${f(-alto * 0.14)} l${f(-alto * 0.2)} ${f(alto * 0.03)} l${f(alto * 0.06)} ${f(-alto * 0.14)} Z`, CAMPO.hondo) +
    nube(c[0], c[1], alto * 0.11, alto * 0.11, CAMPO.claro, 'xs', 0.9) +
    forma(`M${f(c[0] - alto * 0.08)} ${f(c[1] + alto * 0.04)} l${f(alto * 0.08)} ${f(alto * 0.12)} l${f(alto * 0.08)} ${f(-alto * 0.12)} Z`, CAMPO.hondo)
  );
}
