/**
 * La gente del galpón, a lo largo (`D-91`, tanda 2).
 *
 * Lo que se vio: en el camino, el 40 % de abajo de cada pantalla era **la misma fila** de cabezas negras
 * con trama, plana, repetida de punta a punta. Es el lugar del recital, y la gente es la mitad del
 * espectáculo. Acá deja de ser una fila y pasa a ser **cuatro planos**, separados por valor:
 *
 * 1. **El fondo de la gente** (va impreso en el piso): contra el borde del tablado, cabezas chicas y
 *    apretadas, las más claras, prendidas de rojo por las luces del escenario.
 * 2. **El pogo** (una capa de aire que salta, `salta` en `aire.ts`): la fila del medio, con las manos
 *    arriba y algún trapo.
 * 3. **Lo de adelante** (la capa `frente` del camino): los grandes, negros, con sus banderas de palo, las
 *    bengalas y el que va a caballito.
 * 4. **Lo pegado a la cámara** (otra capa de aire, que salta a contratiempo): hombros y manos fuera de foco.
 *
 * Entre el 1 y el 2 baja **el humo del escenario**. Todo sigue siendo la mano de *En directo*: siluetas
 * de tinta plana impresas en trama de puntos, que crecen con la luz. No es aerógrafo de cuerpo: el
 * soplo queda para el humo y para lo que está fuera de foco.
 *
 * El recinto de 900 no se toca (`arte-entornos.ts` lo sigue pintando como siempre): esto es solo del camino.
 */

import { enmascarado, forma, nube, soplo, trazo } from './aerografo.ts';
import type { CapaDeAire } from './aire.ts';
import { TINTAS_DEL_GALPON as G, galponLejos, galponPiso } from './arte-entornos.ts';
import { ALTO } from './camino.ts';
import { azar } from './pincel.ts';
import { GALPON } from './rig-entornos.ts';

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

type Rnd = () => number;
type Gesto = 'nada' | 'puno' | 'cuernos' | 'palma' | 've' | 'dos';

const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;
const poli = (ps: readonly (readonly [number, number])[]): string => `M${ps.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;

/** Un dedo: un palito con la punta redonda, de `(x, y)` (el nudillo) para donde diga el ángulo, en grados desde arriba. */
function dedo(x: number, y: number, largo: number, gordo: number, giro: number): string {
  const a = (giro * Math.PI) / 180;
  const [dx, dy] = [Math.sin(a), -Math.cos(a)];
  const [nx, ny] = [dy, -dx];
  const [px, py] = [x + dx * largo, y + dy * largo];
  return poli([[x + nx * gordo, y + ny * gordo], [px + nx * gordo, py + ny * gordo], [px - nx * gordo, py - ny * gordo], [x - nx * gordo, y - ny * gordo]]) + elipse(px, py, gordo, gordo);
}

/** Una mano, de espaldas: el puño cerrado, los cuernitos, la palma abierta o la ve. `s`, el tamaño del puño. */
function mano(x: number, y: number, s: number, gesto: Gesto, lado: number): string {
  const palma = elipse(x, y, s, s * 1.12);
  if (gesto === 'cuernos') return palma + dedo(x - s * 0.62, y - s * 0.5, s * 1.5, s * 0.26, -8) + dedo(x + s * 0.62, y - s * 0.5, s * 1.35, s * 0.24, 9) + dedo(x + lado * s * 0.9, y + s * 0.1, s * 0.7, s * 0.26, lado * 70);
  if (gesto === 've') return palma + dedo(x - s * 0.3, y - s * 0.6, s * 1.6, s * 0.27, -14) + dedo(x + s * 0.3, y - s * 0.6, s * 1.6, s * 0.27, 14);
  if (gesto === 'palma') return palma + [-28, -10, 8, 26].map((g, i) => dedo(x + (i - 1.5) * s * 0.46, y - s * 0.7, s * (1.15 + (i === 1 || i === 2 ? 0.3 : 0)), s * 0.22, g)).join('') + dedo(x + lado * s * 0.9, y, s * 0.8, s * 0.26, lado * 62);
  return palma;
}

/**
 * Una cabeza, de espaldas o de perfil. No es un círculo (segunda vuelta: la gente eran globos): el
 * cráneo es un huevo con orejas, y arriba lleva lo que lleva cada uno. Pelo largo hasta los hombros,
 * rulos, gorra con la visera para un costado, capucha en punta, cresta, o la cara de perfil con su nariz.
 */
function cabeza(x: number, cy: number, rx: number, rnd: Rnd): string {
  const lado = rnd() < 0.5 ? -1 : 1;
  const craneo = elipse(x, cy, rx * 0.8, rx * 1.04);
  const orejas = elipse(x - rx * 0.82, cy + rx * 0.12, rx * 0.17, rx * 0.26) + elipse(x + rx * 0.82, cy + rx * 0.12, rx * 0.17, rx * 0.26);
  const que = rnd();
  if (que < 0.2) {
    // Pelo largo: una mata que cae recta a los hombros, con el borde de abajo desparejo.
    return `M${f(x - rx * 0.98)} ${f(cy - rx * 0.1)} Q${f(x - rx * 1.06)} ${f(cy - rx * 1.26)} ${f(x)} ${f(cy - rx * 1.2)} Q${f(x + rx * 1.06)} ${f(cy - rx * 1.26)} ${f(x + rx * 0.98)} ${f(cy - rx * 0.1)} L${f(x + rx * (1.08 + rnd() * 0.2))} ${f(cy + rx * 1.5)} L${f(x + rx * 0.5)} ${f(cy + rx * (1.3 + rnd() * 0.5))} L${f(x)} ${f(cy + rx * 1.6)} L${f(x - rx * 0.55)} ${f(cy + rx * (1.3 + rnd() * 0.5))} L${f(x - rx * (1.08 + rnd() * 0.2))} ${f(cy + rx * 1.5)} Z`;
  }
  if (que < 0.34) {
    // Rulos: una corona de bolitas desparejas.
    let s = craneo;
    for (let i = 0; i < 8; i++) {
      const a = Math.PI * (0.95 + (i / 7) * 1.1);
      s += elipse(x + Math.cos(a) * rx * 0.78, cy + Math.sin(a) * rx * 0.86 + rx * 0.1, rx * (0.34 + rnd() * 0.16), rx * (0.34 + rnd() * 0.16));
    }
    return s;
  }
  if (que < 0.5) {
    // Gorra: la copa y la visera para un costado.
    return craneo + orejas + `M${f(x - rx * 0.86)} ${f(cy - rx * 0.26)} Q${f(x - rx * 0.9)} ${f(cy - rx * 1.2)} ${f(x)} ${f(cy - rx * 1.16)} Q${f(x + rx * 0.9)} ${f(cy - rx * 1.2)} ${f(x + rx * 0.86)} ${f(cy - rx * 0.26)} Z` +
      poli([[x + lado * rx * 0.5, cy - rx * 0.52], [x + lado * rx * 1.72, cy - rx * 0.36], [x + lado * rx * 1.64, cy - rx * 0.16], [x + lado * rx * 0.5, cy - rx * 0.22]]);
  }
  if (que < 0.62) {
    // Capucha: en punta, y se junta con los hombros.
    return `M${f(x - rx * 1.08)} ${f(cy + rx * 1.36)} Q${f(x - rx * 1.2)} ${f(cy - rx * 0.6)} ${f(x + lado * rx * 0.16)} ${f(cy - rx * 1.44)} Q${f(x + rx * 1.2)} ${f(cy - rx * 0.5)} ${f(x + rx * 1.08)} ${f(cy + rx * 1.36)} Z`;
  }
  if (que < 0.74) {
    // De perfil: mira para un costado. La nariz, el mentón, y el pelo que le queda atrás.
    return craneo + elipse(x - lado * rx * 0.3, cy - rx * 0.34, rx * 0.86, rx * 0.8) +
      poli([[x + lado * rx * 0.7, cy - rx * 0.16], [x + lado * rx * 1.16, cy + rx * 0.22], [x + lado * rx * 0.7, cy + rx * 0.36]]) +
      elipse(x + lado * rx * 0.42, cy + rx * 0.74, rx * 0.46, rx * 0.34);
  }
  if (que < 0.82) {
    // Cresta: cinco púas.
    let s = craneo + orejas;
    for (let i = 0; i < 5; i++) {
      const u = (i - 2) * 0.3;
      s += poli([[x + (u - 0.14) * rx, cy - rx * 0.9], [x + u * rx * 1.2, cy - rx * (1.5 + rnd() * 0.5) + Math.abs(u) * rx * 0.5], [x + (u + 0.14) * rx, cy - rx * 0.9]]);
    }
    return s;
  }
  // Pelo corto: el cráneo con las orejas, y la nuca un poco más ancha.
  return craneo + orejas + elipse(x, cy - rx * 0.2, rx * 0.86, rx * 0.9);
}

/** Uno que va en andas, acostado sobre las manos de los demás: el cuerpo, las piernas, un brazo que cuelga y otro arriba. */
function enAndas(x: number, y: number, t: number, lado: number): string {
  const X = (dx: number): number => x + lado * dx * t;
  const Y = (dy: number): number => y + dy * t;
  return (
    poli([[X(-34), Y(-9)], [X(26), Y(-12)], [X(30), Y(4)], [X(-32), Y(8)]]) +
    elipse(X(40), Y(-9), 10 * t, 11 * t) +
    poli([[X(-32), Y(-8)], [X(-62), Y(-22)], [X(-66), Y(-13)], [X(-34), Y(6)]]) + poli([[X(-62), Y(-22)], [X(-84), Y(-8)], [X(-80), Y(0)], [X(-64), Y(-12)]]) +
    poli([[X(-30), Y(2)], [X(-58), Y(10)], [X(-80), Y(26)], [X(-74), Y(32)], [X(-54), Y(20)], [X(-30), Y(10)]]) +
    brazo(X(18), Y(-8), X(30), Y(-52), 6 * t, 'cuernos', lado) +
    poli([[X(14), Y(4)], [X(22), Y(4)], [X(20), Y(30)], [X(13), Y(30)]])
  );
}

/** Un brazo levantado, del hombro a la muñeca, con su mano. */
function brazo(hx: number, hy: number, px: number, py: number, gordo: number, gesto: Gesto, lado: number): string {
  return poli([[hx - gordo, hy], [hx + gordo, hy], [px + gordo * 0.74, py + gordo * 0.4], [px - gordo * 0.74, py + gordo * 0.4]]) + mano(px, py - gordo * 0.3, gordo * 0.92, gesto, lado);
}

/**
 * Uno de la gente, de espaldas: la cabeza, los hombros que bajan hasta `base`, y lo que hace con las
 * manos. `alto`: cuánto levanta el brazo desde la coronilla. Devuelve un camino, para juntarlos todos
 * en una sola silueta que después se imprime en trama.
 */
function persona(x: number, cy: number, rx: number, base: number, rnd: Rnd, gesto: Gesto, alto = 46): string {
  const ry = rx * 1.18;
  // La cabeza va un poco ladeada sobre los hombros, y cada hombro cae a su manera: nadie está parado derecho.
  const hx0 = x + (rnd() - 0.5) * rx * 0.5;
  const sy = cy + rx * 1.5;
  const [wi, wd] = [rx * (1.9 + rnd() * 0.8), rx * (1.9 + rnd() * 0.8)];
  const [ci, cd] = [rnd() * rx * 0.5, rnd() * rx * 0.5];
  let d =
    cabeza(hx0, cy, rx, rnd) +
    // El cuello.
    poli([[hx0 - rx * 0.44, cy + rx * 0.5], [hx0 + rx * 0.44, cy + rx * 0.5], [x + rx * 0.56, sy], [x - rx * 0.56, sy]]) +
    // Los hombros y la espalda, hasta la base.
    `M${f(x - wi)} ${f(base)} L${f(x - wi)} ${f(sy + rx * 0.95 + ci)} Q${f(x - wi)} ${f(sy + ci)} ${f(x - wi * 0.62)} ${f(sy - rx * 0.1 + ci * 0.5)} L${f(x - rx * 0.5)} ${f(sy - rx * 0.34)} L${f(x + rx * 0.5)} ${f(sy - rx * 0.34)} L${f(x + wd * 0.62)} ${f(sy - rx * 0.1 + cd * 0.5)} Q${f(x + wd)} ${f(sy + cd)} ${f(x + wd)} ${f(sy + rx * 0.95 + cd)} L${f(x + wd)} ${f(base)} Z`;
  if (gesto === 'nada') return d;
  const lados = gesto === 'dos' ? [-1, 1] : [rnd() < 0.5 ? -1 : 1];
  for (const lado of lados) {
    const hx = x + lado * rx * 1.5;
    const hy = cy + ry * 1.05;
    const px = hx + lado * (rx * 0.3 + rnd() * rx * 0.9);
    const py = cy - ry - alto * (0.55 + rnd() * 0.45);
    const que: Gesto = gesto === 'dos' ? (rnd() < 0.5 ? 'puno' : 'palma') : gesto;
    d += brazo(hx, hy, px, py, rx * 0.5, que, lado);
  }
  return d;
}

type Cabeza = { x: number; y: number; r: number };
/** Cómo se pinta cada uno: recibe su silueta y dónde tiene la cabeza. */
type Pinta = (d: string, x: number, y: number, r: number) => string;

/**
 * La trama de *En directo* como relleno: puntos en tresbolillo sobre un fondo. Con esto se pinta el
 * canto de cada uno (puntos claros) y el cuerpo (puntos apenas más claros que el negro).
 */
function patron(id: string, paso: number, base: string, punto: string, r: number, o = 1): string {
  const h = paso * 1.732;
  const c = (x: number, y: number): string => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`;
  return `<pattern id="${id}" width="${f(paso)}" height="${f(h)}" patternUnits="userSpaceOnUse"><rect width="${f(paso)}" height="${f(h)}" fill="${base}"/><g fill="${punto}"${o < 1 ? ` opacity="${f(o)}"` : ''}>${c(0, 0)}${c(paso, 0)}${c(0, h)}${c(paso, h)}${c(paso / 2, h / 2)}</g></pattern>`;
}

/**
 * Una figura con el canto prendido (segunda vuelta). Primero la silueta entera en la trama clara;
 * encima, la misma silueta en oscuro, corrida para el lado contrario a la luz y recortada por la
 * primera. Lo que queda sin tapar es el canto que mira a la luz: la coronilla, los hombros, el filo de
 * cada dedo. Así cada uno se recorta del de atrás, que con una sola máscara para toda la fila no pasaba.
 */
function figura(id: string, d: string, canto: string, cuerpo: string, dx: number, dy: number): string {
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="url(#${canto})"/><g clip-path="url(#${id})"><path d="${d}" fill="url(#${cuerpo})" transform="translate(${f(dx)} ${f(dy)})"/></g>`;
}

const GESTOS: readonly Gesto[] = ['puno', 'cuernos', 'palma', 've', 'dos', 'cuernos', 'puno'];

/**
 * Una tanda de gente: grupos apretados con huecos entre uno y otro. `arriba` y `abajo`: entre qué
 * alturas quedan las coronillas; `radio`: lo que mide una cabeza. `manos`: cuántos, de cada diez, tienen
 * algo levantado. `rala`: de 0 a 1 según x, cuánta gente queda (el final del recital, hacia el cruce).
 * Cada uno se pinta aparte (`pinta`), y los de más abajo, que están más cerca, van encima.
 */
function gentio(desde: number, hasta: number, arriba: number, abajo: number, radio: readonly [number, number], base: number, manos: number, semilla: number, pinta: Pinta, rala: (x: number) => number = () => 1): { dibujo: string; cabezas: Cabeza[] } {
  const rnd = azar(semilla);
  const cabezas: Cabeza[] = [];
  const figuras: { y: number; s: string }[] = [];
  let x = desde;
  while (x < hasta) {
    const grupo = 3 + Math.floor(rnd() * 6);
    // Cada grupo tiene su altura: un montón que salta más alto, otro que está más hundido.
    const nivel = arriba + rnd() * (abajo - arriba) * 0.6;
    for (let i = 0; i < grupo && x < hasta; i++) {
      const rx = radio[0] + rnd() * (radio[1] - radio[0]);
      const cy = nivel + rnd() * (abajo - arriba) * 0.4 + rx * 1.18;
      const queda = rnd() < rala(x);
      const gesto = rnd() < manos ? GESTOS[Math.floor(rnd() * GESTOS.length)]! : 'nada';
      const d = persona(x, cy, rx, base, rnd, gesto, radio[1] * 2.6);
      // Una mano suelta que sale de la masa, de alguien que quedó tapado.
      const suelta = rnd() < manos * 0.5;
      const mx = x + rx * (0.9 + rnd() * 0.6);
      const mano = brazo(mx, cy + rx * 2.4, mx + (rnd() - 0.5) * rx, cy - rx * (1.2 + rnd() * 1.6), rx * 0.46, GESTOS[Math.floor(rnd() * GESTOS.length)]!, rnd() < 0.5 ? -1 : 1);
      if (queda) {
        figuras.push({ y: cy, s: pinta(d, x, cy, rx) });
        if (suelta) figuras.push({ y: cy - 0.5, s: pinta(mano, mx, cy, rx) });
        cabezas.push({ x, y: cy, r: rx });
      }
      x += rx * (1.9 + rnd() * 1.1);
    }
    x += radio[1] * (0.6 + rnd() * 4.2);
  }
  figuras.sort((a, b) => a.y - b.y);
  return { dibujo: figuras.map((q) => q.s).join(''), cabezas };
}

/**
 * Un trapo en un palo: la tela en franjas, que flamea. Es tinta plana, como los trapos colgados del
 * escenario; sin letras. `tumba`: lo que se inclina el palo.
 */
function bandera(id: string, x: number, pie: number, punta: number, ancho: number, alto: number, franjas: readonly string[], tumba: number, rnd: Rnd): string {
  const tx = x + tumba;
  const lado = tumba >= 0 ? 1 : -1;
  const fase = rnd() * 6.3;
  const ondas = 1.1 + rnd() * 0.7;
  const canto = (v: number): [number, number][] => {
    const ps: [number, number][] = [];
    for (let i = 0; i <= 12; i++) {
      const u = i / 12;
      ps.push([tx + lado * ancho * u, punta + 6 + alto * v + Math.sin(u * 6.3 * ondas + fase) * alto * 0.1 * u + u * u * alto * 0.34]);
    }
    return ps;
  };
  const tira = (v0: number, v1: number): string => poli([...canto(v0), ...canto(v1).reverse()]);
  const silueta = tira(0, 1);
  let adentro = '';
  franjas.forEach((color, i) => (adentro += forma(tira(i / franjas.length - 0.01, (i + 1) / franjas.length + 0.01), color)));
  // Los pliegues: cuñas oscuras, planas, donde la tela se dobla.
  for (let i = 0; i < 3; i++) {
    const u = 0.2 + i * 0.27 + rnd() * 0.08;
    const [a, b] = [canto(0)[Math.round(u * 12)]!, canto(1)[Math.round(u * 12)]!];
    adentro += forma(poli([[a[0], a[1]], [a[0] + lado * 9, a[1]], [b[0] + lado * 3, b[1]], [b[0] - lado * 3, b[1]]]), G.negro, 0.3);
  }
  return (
    trazo(`M${f(x)} ${f(pie)} L${f(tx)} ${f(punta)}`, G.negro, 3) +
    trazo(`M${f(x + 1)} ${f(pie)} L${f(tx + 1)} ${f(punta)}`, G.brasa, 0.9, 0.7) +
    enmascarado(id, silueta, adentro)
  );
}

// Trapos de tribuna, no banderas de país: siempre con negro (el rojo y blanco solos se leían como una bandera).
const FRANJAS: readonly (readonly string[])[] = [
  [G.vivo, G.negro, G.vivo],
  [G.negro, G.vivo, G.negro],
  [G.papel, G.negro, G.papel, G.negro],
  [G.vivo, G.negro],
  [G.negro, G.papel, G.vivo, G.negro],
];

/** Una bengala prendida: el palito, la llama blanca de tan roja, las chispas y el humo que se va para arriba. */
function bengala(x: number, y: number, semilla: number, fuerza = 1): string {
  const rnd = azar(semilla);
  let chispas = '';
  for (let i = 0; i < 26; i++) {
    const a = rnd() * 6.3;
    const r = (6 + rnd() * 38) * fuerza;
    chispas += `<circle cx="${f(x + Math.cos(a) * r)}" cy="${f(y + Math.sin(a) * r * 0.8 - r * 0.2)}" r="${f(0.5 + rnd() * 1.2)}" fill="${rnd() < 0.5 ? G.oro : G.papel}" opacity="${f(0.5 + rnd() * 0.5)}"/>`;
  }
  return (
    nube(x + 26 * fuerza, y - 84 * fuerza, 40 * fuerza, 62 * fuerza, G.brasa, 'xl', 0.42) +
    nube(x + 62 * fuerza, y - 150 * fuerza, 54 * fuerza, 60 * fuerza, G.noche, 'xl', 0.45) +
    nube(x, y, 30 * fuerza, 30 * fuerza, G.vivo, 'l', 0.75) +
    nube(x, y, 15 * fuerza, 16 * fuerza, G.vivo, 'm') +
    nube(x, y, 5.5 * fuerza, 6.5 * fuerza, G.papel, 's') +
    chispas
  );
}

/* ------------------------------------------------------------------
   El techo: la parrilla de luces y los bafles colgados
   ------------------------------------------------------------------ */

/** Un tacho de luz colgado de la cabriada, apuntando para donde diga `giro`, con su haz. `prendido`: de 0 a 1. */
function tacho(x: number, y: number, giro: number, color: string, largo: number, prendido: number): string {
  const a = (giro * Math.PI) / 180;
  const [bx, by] = [x + Math.sin(a) * 20, y + Math.cos(a) * 20];
  const [px, py] = [x + Math.sin(a) * largo, y + Math.cos(a) * largo];
  const abre = largo * 0.16;
  return (
    // El haz: una cuña soplada, floja, que se pierde antes de llegar al tablado.
    (prendido > 0.15 ? soplo(poli([[bx - 4, by], [bx + 4, by], [px + abre, py], [px - abre, py]]), color, 'm', 0.2 * prendido) : '') +
    trazo(`M${f(x)} ${f(y - 6)} L${f(x)} ${f(y + 2)}`, G.negro, 2) +
    `<g transform="rotate(${f(-giro)} ${f(x)} ${f(y + 2)})">` +
    forma(poli([[x - 6, y + 2], [x + 6, y + 2], [x + 8.6, y + 21], [x - 8.6, y + 21]]), G.negro) +
    forma(elipse(x, y + 21, 8.6, 3), prendido > 0.15 ? color : G.noche, 0.4 + prendido * 0.6) +
    `</g>` +
    (prendido > 0.5 ? nube(bx, by, 10, 9, color, 's', 0.55 * prendido) : '')
  );
}

/** Una columna de bafles colgada, curvada hacia la gente: seis cajas, cada una un poco más inclinada. */
function colgados(x: number, y: number, lado: number): string {
  let s = trazo(`M${f(x - 12)} 76 L${f(x - 10)} ${y} M${f(x + 12)} 76 L${f(x + 10)} ${y}`, G.negro, 1.6);
  let [cx, cy] = [x, y];
  for (let i = 0; i < 6; i++) {
    const giro = lado * i * 3.4;
    s +=
      `<g transform="rotate(${f(giro)} ${f(cx)} ${f(cy)})">` +
      forma(poli([[cx - 24, cy], [cx + 24, cy], [cx + 22, cy + 15], [cx - 22, cy + 15]]), G.negro) +
      trazo(`M${f(cx - 22)} ${f(cy + 15)} L${f(cx + 22)} ${f(cy + 15)}`, G.brasa, 1.3, 0.9) +
      trazo(`M${f(cx - 17)} ${f(cy + 5)} l34 0 M${f(cx - 17)} ${f(cy + 9.6)} l34 0`, G.noche, 1.4, 0.9) +
      `</g>`;
    cx += lado * i * 0.9;
    cy += 16.4;
  }
  return s;
}

/**
 * Lo lejano del galpón largo: el de siempre y, colgado de la cabriada, lo que le faltaba a la mitad de
 * arriba (era chapa vacía): la parrilla de tachos, unos prendidos y otros no, cada uno con su haz; una
 * segunda cabriada más atrás, más chica y más clara; y dos columnas de bafles. Nada baja de la altura
 * de los trapos: a los que están parados en el tablado no les cruza nada por la cara.
 */
export function galponLejosLargo(ancho: number, alto: number): string {
  const rnd = azar(3413);
  const k = ancho / 900;
  const disco = GALPON.disco.x * k;
  const lejosDelDisco = (x: number): boolean => Math.abs(x - disco) > GALPON.disco.r + 34;
  // La cabriada de atrás: más chica, del color de la noche, que se pierde detrás de la primera.
  let atras = trazo(`M-10 104 L${ancho + 10} 104 M-10 132 L${ancho + 10} 132`, G.noche, 3.4, 0.9);
  for (let x = -10, n = 0; x < ancho + 10; x += 26, n++) if (lejosDelDisco(x + 13)) atras += trazo(`M${f(x)} ${n % 2 ? 104 : 132} L${f(x + 26)} ${n % 2 ? 132 : 104}`, G.noche, 2, 0.85);
  let tachos = '';
  const colores = [G.rojo, G.luz, G.rojo, G.vivo, G.luz];
  for (let x = 40 + rnd() * 40, n = 0; x < ancho - 20; x += 62 + rnd() * 70, n++) {
    if (!lejosDelDisco(x)) continue;
    // De a tandas: tres o cuatro juntos apuntan para el mismo lado, como los arma un iluminador.
    const tanda = Math.floor(n / 4);
    const giro = (tanda % 2 ? -1 : 1) * (10 + ((tanda * 7) % 3) * 8) + (rnd() - 0.5) * 8;
    tachos += tacho(x, 80, giro, colores[tanda % colores.length]!, 150 + rnd() * 110, rnd() < 0.62 ? 0.5 + rnd() * 0.5 : 0);
    // Y alguno más chico en la cabriada de atrás.
    if (n % 3 === 0) tachos += `<g transform="translate(${f(x + 30)} 134) scale(0.6) translate(${f(-x - 30)} -80)">${tacho(x + 30, 80, -giro * 0.7, colores[(tanda + 2) % colores.length]!, 120, rnd() < 0.5 ? 0.6 : 0)}</g>`;
  }
  return (
    galponLejos(ancho, alto) +
    `<g filter="url(#rociado)">` +
    atras +
    tachos +
    colgados(820, 96, 1) +
    colgados(1592, 96, -1) +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   1. El fondo de la gente: va en el piso, contra el borde del tablado
   ------------------------------------------------------------------ */

/**
 * El piso del galpón largo: el de siempre, y encima, de la línea del tablado para abajo, tres filas
 * de gente chica, cada una más grande y más oscura que la de atrás. Las de atrás de todo están contra
 * las luces: son casi rojas. Es lo que le da fondo al pozo, que antes era una franja negra.
 */
export function galponPisoLargo(ancho: number, alto: number): string {
  const borde = GALPON.tablado.borde;
  const filas = [
    { y: [borde + 3, borde + 10], r: [4.4, 6.4], tinta: G.brasa, canto: 1.7, manos: 0.2, semilla: 3301 },
    { y: [borde + 15, borde + 25], r: [6, 9], tinta: G.noche, canto: 2.3, manos: 0.26, semilla: 3307 },
    { y: [borde + 32, borde + 46], r: [8, 12.4], tinta: G.negro, canto: 3, manos: 0.3, semilla: 3313 },
  ] as const;
  let gente = '';
  filas.forEach((fila, i) => {
    let n = 0;
    // Cuanto más atrás, más clara la fila entera: el cuerpo también se aclara, no solo el canto.
    gente +=
      patron(`gl-trama-fondo-${i}`, 2.6 + i * 0.5, i ? G.brasa : G.rojo, i ? G.rojo : G.luz, 0.8 + i * 0.2, i ? 1 : 0.8) +
      patron(`gl-cuerpo-fondo-${i}`, 3.4, fila.tinta, i ? G.noche : G.rojo, 0.7, i === 2 ? 0.6 : 0.45) +
      gentio(-20, ancho + 20, fila.y[0], fila.y[1], fila.r, alto + 10, fila.manos, fila.semilla, (d) => figura(`gl-f${i}-${n++}`, d, `gl-trama-fondo-${i}`, `gl-cuerpo-fondo-${i}`, 0, fila.canto)).dibujo;
  });
  return (
    galponPiso(ancho, alto) +
    `<g filter="url(#grano)">${gente}</g>` +
    // El pozo se hunde: debajo de la tercera fila, lo negro donde arranca la gente grande.
    `<g filter="url(#rociado)">${soplo(`M-20 ${borde + 74} L${ancho + 20} ${borde + 74} L${ancho + 20} ${alto + 20} L-20 ${alto + 20} Z`, G.negro, 'm', 0.9)}</g>`
  );
}

/* ------------------------------------------------------------------
   3. Lo de adelante: los grandes, las banderas, las bengalas
   ------------------------------------------------------------------ */

/** Dónde arranca la gente grande, en la capa de adelante. */
const GRANDES = { arriba: GALPON.gente + 46, abajo: GALPON.gente + 104 } as const;

/**
 * Lo de adelante del galpón largo. Compuesto, no sembrado parejo: cada tanto un montón con su bandera,
 * uno a caballito con los dos brazos arriba, una bengala que tiñe a los de al lado; y entre montón y
 * montón, cabezas sueltas. Hacia el final (el cruce) la gente ralea: es la salida.
 */
export function galponFrenteLargo(ancho: number, alto: number): string {
  const rnd = azar(3331);
  const salida = ancho - 720;
  const rala = (x: number): number => (x < salida ? 1 : Math.max(0.16, 1 - (x - salida) / 520));
  // Las bengalas van primero, porque cada uno se pinta según la que tenga cerca.
  const bengalas = [0.13, 0.47, 0.8].map((u, i) => ({ x: ancho * u + (i % 2 ? -16 : 18), y: GRANDES.arriba - 34 - i * 4, lado: i % 2 ? -1 : 1 }));
  let n = 0;
  /**
   * Cada uno con su canto. La luz del tablado viene de arriba y de adelante: un canto fino en la
   * coronilla y los hombros. El que tiene una bengala cerca la tiene de costado: el canto es ancho, en
   * el rojo vivo, y mira para la bengala.
   */
  const pinta: Pinta = (d, x, y, r) => {
    let cerca: { x: number; y: number } | null = null;
    for (const b of bengalas) if (Math.hypot(x - b.x, (y - b.y) * 0.6) < 170 && (!cerca || Math.abs(x - b.x) < Math.abs(x - cerca.x))) cerca = b;
    if (!cerca) return figura(`gl-g-${n++}`, d, 'gl-trama', 'gl-cuerpo', 0, 2.6 + r * 0.12);
    const [ux, uy] = [x - cerca.x, y + r * 2 - cerca.y];
    const largo = Math.hypot(ux, uy) || 1;
    const fuerza = (2.4 + r * 0.2) * (1.25 - Math.min(1, largo / 190) * 0.6);
    return figura(`gl-g-${n++}`, d, 'gl-trama-viva', 'gl-cuerpo', (ux / largo) * fuerza, (uy / largo) * fuerza + 1.4);
  };
  const { dibujo: fila, cabezas } = gentio(-30, ancho + 30, GRANDES.arriba, GRANDES.abajo, [12, 23], alto + 10, 0.36, 3343, pinta, rala);
  let gente = fila;

  // El brazo que levanta cada bengala, y el palito.
  for (const b of bengalas) gente += pinta(brazo(b.x - b.lado * 20, GRANDES.arriba + 40, b.x, b.y + 30, 8.5, 'puno', 1), b.x, b.y + 60, 14);

  // Los que van a caballito: el torso entero por encima de la fila, con los dos brazos abiertos.
  for (const u of [0.05, 0.29, 0.61, 0.72]) {
    const c = cabezas.reduce((m, q) => (Math.abs(q.x - ancho * u) < Math.abs(m.x - ancho * u) ? q : m), cabezas[0]!);
    const y = c.y - c.r * 1.2 - 38;
    gente += pinta(persona(c.x + 2, y, 13, c.y + 26, rnd, 'dos', 38), c.x, y, 13);
  }
  // Dos que van en andas, pasando por arriba de las cabezas.
  for (const [u, lado] of [[0.36, 1], [0.66, -1]] as const) gente += pinta(enAndas(ancho * u, GRANDES.arriba - 6, 1.05, lado), ancho * u, GRANDES.arriba - 6, 16);

  // Las banderas: el palo sale de entre la gente. Van donde no hay ni bengala ni jinete.
  let banderas = '';
  let m = 0;
  for (const u of [0.2, 0.41, 0.55, 0.7, 0.9]) {
    const x = ancho * u + (rnd() - 0.5) * 60;
    if (rala(x) < 0.5) continue;
    // Bajas: la punta no pasa del borde del tablado, así ninguna le cruza la cara a los que están arriba.
    const punta = GALPON.tablado.borde + 2 + rnd() * 26;
    const w = 78 + rnd() * 40;
    banderas += bandera(`gl-bandera-${m}`, x, GRANDES.abajo + 20, punta, w, w * (0.5 + rnd() * 0.14), FRANJAS[m % FRANJAS.length]!, (m % 2 ? -1 : 1) * (14 + rnd() * 26), rnd);
    m++;
  }

  const fuegos = bengalas.map((b, i) => trazo(`M${f(b.x)} ${f(b.y + 28)} L${f(b.x)} ${f(b.y)}`, G.negro, 3) + bengala(b.x, b.y, 3361 + i, i === 1 ? 1 : 0.86)).join('');
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-40" y="240" width="${ancho + 80}" height="${alto - 240}" fill="${G.negro}" fill-opacity="0"/>` +
    patron('gl-trama', 4.6, G.brasa, G.rojo, 1.7) +
    patron('gl-trama-viva', 4.6, G.vivo, G.papel, 1.2, 0.85) +
    patron('gl-cuerpo', 5.2, G.negro, G.noche, 1.3, 0.7) +
    // El resplandor de cada bengala, por detrás de la gente.
    bengalas.map((b) => nube(b.x, b.y, 130, 90, G.vivo, 'xl', 0.3)).join('') +
    banderas +
    gente +
    fuegos +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   2 y 4. El pogo, lo pegado a la cámara y el humo: capas de aire
   ------------------------------------------------------------------ */

/** La hoja entera de una baldosa, sin tinta: el filtro del grano mide por la caja de lo que tiene adentro. */
const hoja = (c: CapaDeAire): string => `<rect x="-200" y="${c.y - 40}" width="${c.ancho + 400}" height="${c.alto + 80}" fill="${G.negro}" fill-opacity="0"/>`;

/**
 * El pogo: la fila del medio. Cabezas medianas, más manos arriba que en ninguna otra, y un par de
 * trapos chicos. La baldosa cierra sola: la gente se siembra un poco más allá de cada borde con la
 * misma semilla corrida, y lo que cae cerca de un borde está también del otro lado.
 */
export function galponPogo(c: CapaDeAire): string {
  const base = c.y + c.alto + 30;
  const arriba = c.y + 62;
  // Un montón por gajo (`gajos` en `aire.ts`), con aire en los bordes: cada gajo salta a su tiempo, y
  // el corte entre uno y otro cae en un hueco, no en la cabeza de nadie.
  const gajos = c.gajos ?? 1;
  const paso = c.ancho / gajos;
  const rnd = azar(3389);
  let gente = '';
  let n = 0;
  for (let g = 0; g < gajos; g++) {
    // El trapo, en el medio de su gajo y detrás de su gente, así salta entero con ella.
    if (g % 2 === 0) gente += bandera(`gl-pogo-trapo-${g}`, paso * (g + 0.5), arriba + 60, arriba - 40 + g * 4, 58 + g * 6, 32, FRANJAS[(g + 2) % FRANJAS.length]!, g ? -12 : 14, rnd);
    // Los hombros miden hasta dos cabezas y media: el margen los deja adentro del gajo.
    gente += gentio(g * paso + 48, (g + 1) * paso - 48, arriba, arriba + 34, [9.5, 14.5], base, 0.55, 3373 + g * 7, (d) => figura(`gl-p-${n++}`, d, 'gl-trama-pogo', 'gl-cuerpo-pogo', 0, 3.4)).dibujo;
  }
  return `<g filter="url(#grano)">${hoja(c)}${patron('gl-trama-pogo', 3.8, G.brasa, G.rojo, 1.45)}${patron('gl-cuerpo-pogo', 4.6, G.negro, G.noche, 1.1, 0.8)}${gente}</g>`;
}

/**
 * Lo pegado a la cámara: hombros, nucas y manos enormes, fuera de foco, con el canto prendido de rojo
 * por lo que viene del escenario. No pasan del quinto de la pantalla.
 */
export function galponCerca(c: CapaDeAire): string {
  const rnd = azar(3391);
  const base = ALTO + 40;
  let bultos = '';
  let cantos = '';
  let x = 60;
  let n = 0;
  while (x < c.ancho - 40) {
    const rx = 40 + rnd() * 22;
    const cy = ALTO - 6 - rnd() * 34 + rx * 0.2;
    const copia = (dx: number): void => {
      bultos += persona(x + dx, cy, rx, base, azar(3400 + n), n % 3 === 1 ? 'puno' : n % 4 === 2 ? 'cuernos' : 'nada', 36);
      cantos += `<ellipse cx="${f(x + dx)}" cy="${f(cy - rx * 1.05)}" rx="${f(rx * 0.74)}" ry="5" fill="${G.rojo}" opacity="0.5"/>`;
    };
    copia(0);
    if (x < 260) copia(c.ancho);
    if (x > c.ancho - 260) copia(-c.ancho);
    x += rx * 2.6 + 90 + rnd() * 260;
    n++;
  }
  return (
    `<g filter="url(#rociado)">${hoja(c)}` +
    `<g filter="url(#soplo-s)">${forma(bultos, G.negro)}</g>` +
    `<g filter="url(#soplo-m)">${cantos}</g>` +
    soplo(`M-260 ${ALTO - 10} L${c.ancho + 260} ${ALTO - 10} L${c.ancho + 260} ${ALTO + 80} L-260 ${ALTO + 80} Z`, G.negro, 'l', 0.85) +
    `</g>`
  );
}

/**
 * El humo del escenario, que baja del tablado y se queda sobre la gente del fondo: bocanadas chatas,
 * rojas donde les pegan las luces y oscuras donde no, y el polvo que flota adentro. Aerógrafo: es humo.
 */
export function galponHumo(c: CapaDeAire): string {
  const rnd = azar(3407);
  let s = '';
  const vuelta = (x: number, medio: number, pinta: (x: number) => string): string => pinta(x) + (x - medio < 120 ? pinta(x + c.ancho) : '') + (x + medio > c.ancho - 120 ? pinta(x - c.ancho) : '');
  const tintas: readonly (readonly [string, number])[] = [[G.rojo, 0.2], [G.noche, 0.5], [G.luz, 0.1], [G.brasa, 0.4], [G.noche, 0.42]];
  for (let i = 0; i < 15; i++) {
    const x = (c.ancho / 15) * (i + rnd());
    const hondura = rnd();
    const y = c.y + 50 + hondura * (c.alto - 100);
    const rx = 60 + rnd() * 80;
    const ry = 12 + hondura * 14 + rnd() * 8;
    const [color, o] = tintas[i % tintas.length]!;
    s += vuelta(x, rx + 80, (xx) => nube(xx, y, rx, ry, color, ry >= 17 ? 'xl' : 'l', o * (0.8 + rnd() * 0.4)));
  }
  // El polvo que ya estaba: motas chicas, tibias, que el seguidor prende al pasar.
  for (let i = 0; i < 110; i++) {
    const x = rnd() * c.ancho;
    const y = c.y + 20 + rnd() * (c.alto - 40);
    const r = 0.8 + rnd() * 1.2;
    const o = 0.35 + rnd() * 0.4;
    s += vuelta(x, 8, (xx) => `<circle cx="${f(xx)}" cy="${f(y)}" r="${f(r)}" fill="${i % 4 ? G.luz : G.rojo}" opacity="${f(o)}"/>`);
  }
  return `<g filter="url(#rociado)">${hoja(c)}${s}</g>`;
}

/**
 * Lo que cruza por arriba de la gente: una zapatilla, de las que se pierden en el pogo. De lona, con
 * la suela de goma y los cordones sueltos. Tinta plana, chica: se imprime fina.
 */
export function zapatilla(): string {
  return (
    `<g filter="url(#grano)"><rect x="0" y="0" width="30" height="18" fill="${G.negro}" fill-opacity="0"/>` +
    // La suela y la puntera de goma.
    forma('M2 13 Q2 11 4 11 L26 11 Q29 11 29 13.4 L29 14.6 Q29 16 27 16 L4 16 Q2 16 2 14.4 Z', G.papel) +
    // La lona: la caña alta atrás y el empeine que baja a la puntera.
    forma('M4 11 L3.4 3.4 Q3.6 2 5.4 2 L10 2 Q11.6 2 12 3.6 L13 6.4 L21 8.2 Q26 9 27 11 Z', G.vivo) +
    forma('M21.4 8.4 Q26 9.2 27 11 L22 11 Z', G.papel) +
    // Los cordones, y uno suelto que vuela.
    trazo('M11.6 4.6 l3.6 2.2 M12.6 6.6 l3.8 1.4', G.papel, 0.9) +
    trazo('M12 3.6 q-3 -3.4 -7 -1.6', G.papel, 0.8, 0.9) +
    `<circle cx="7.4" cy="6.4" r="1.7" fill="${G.papel}"/>` +
    `</g>`
  );
}
