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
import { TINTAS_DEL_GALPON as G, galponPiso, trama } from './arte-entornos.ts';
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
  let d =
    elipse(x, cy, rx, ry) +
    `M${f(x - rx * 2.4)} ${f(base)} C${f(x - rx * 2.3)} ${f(cy + ry * 1.2)} ${f(x - rx * 1.2)} ${f(cy + ry * 0.7)} ${f(x)} ${f(cy + ry * 0.8)} C${f(x + rx * 1.2)} ${f(cy + ry * 0.7)} ${f(x + rx * 2.3)} ${f(cy + ry * 1.2)} ${f(x + rx * 2.4)} ${f(base)} Z`;
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

/**
 * La luz que le toca a cada uno: la coronilla y los hombros prendidos, y para abajo, negro. Así cada
 * fila se recorta contra la de atrás en vez de fundirse en un campo de puntos parejo (primera prueba:
 * tres filas con la trama pareja eran una sola mancha roja). Por arriba de `manos`, donde solo hay
 * brazos levantados, la luz es pareja: las manos están en el aire, contra los reflectores.
 */
function luzDeCabezas(cabezas: readonly Cabeza[], fuerza: number, manos: number): (x: number, y: number) => number {
  return (x, y) => {
    let b = 0;
    for (const c of cabezas) {
      const dx = x - c.x;
      if (dx > c.r * 4 || dx < -c.r * 4) continue;
      const dy = (y - (c.y - c.r * 0.5)) * 1.15;
      const k = Math.exp(-(dx * dx + dy * dy) / (c.r * c.r * 2.1));
      if (k > b) b = k;
    }
    return fuerza * Math.max(b, y < manos ? 0.62 : 0);
  };
}

const GESTOS: readonly Gesto[] = ['puno', 'cuernos', 'palma', 've', 'dos', 'cuernos', 'puno'];

/**
 * Una tanda de gente: grupos apretados con huecos entre uno y otro. `arriba` y `abajo`: entre qué
 * alturas quedan las coronillas; `radio`: lo que mide una cabeza. `manos`: cuántos, de cada diez, tienen
 * algo levantado. `rala`: de 0 a 1 según x, cuánta gente queda (el final del recital, hacia el cruce).
 */
function gentio(desde: number, hasta: number, arriba: number, abajo: number, radio: readonly [number, number], base: number, manos: number, semilla: number, rala: (x: number) => number = () => 1): { silueta: string; cabezas: Cabeza[] } {
  const rnd = azar(semilla);
  let silueta = '';
  const cabezas: Cabeza[] = [];
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
      if (queda) {
        silueta += persona(x, cy, rx, base, rnd, gesto, radio[1] * 2.6);
        cabezas.push({ x, y: cy, r: rx });
      }
      x += rx * (1.7 + rnd() * 0.7);
    }
    x += radio[1] * (0.6 + rnd() * 4.2);
  }
  return { silueta, cabezas };
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
    { y: [borde + 3, borde + 10], r: [4.6, 6.2], tinta: G.brasa, luz: 1.05, manos: 0.2, semilla: 3301 },
    { y: [borde + 15, borde + 25], r: [6.4, 8.4], tinta: G.noche, luz: 0.92, manos: 0.26, semilla: 3307 },
    { y: [borde + 32, borde + 46], r: [8.6, 11.4], tinta: G.negro, luz: 0.8, manos: 0.3, semilla: 3313 },
  ] as const;
  let gente = '';
  filas.forEach((fila, i) => {
    const { silueta, cabezas } = gentio(-20, ancho + 20, fila.y[0], fila.y[1], fila.r, alto + 10, fila.manos, fila.semilla);
    // La luz les pega de arriba y de adelante: prende la coronilla de cada uno y se apaga para abajo.
    const brilla = luzDeCabezas(cabezas, fila.luz, fila.y[0] + 1);
    gente += enmascarado(`gl-fondo-${i}`, silueta, forma(silueta, fila.tinta) + trama(-20, borde - 40, ancho + 20, borde + 120, 4.4 + i * 0.8, brilla, G.rojo, 0.95));
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
  const { silueta: fila, cabezas } = gentio(-30, ancho + 30, GRANDES.arriba, GRANDES.abajo, [15, 22], alto + 10, 0.34, 3343, rala);
  let silueta = fila;

  // Las bengalas: tres a lo largo, cada una en la mano de alguien de la fila.
  const bengalas = [0.13, 0.47, 0.8].map((u, i) => {
    const cerca = cabezas.reduce((m, c) => (Math.abs(c.x - ancho * u) < Math.abs(m.x - ancho * u) ? c : m), cabezas[0]!);
    const b = { x: cerca.x + (i % 2 ? -16 : 18), y: cerca.y - cerca.r * 1.2 - 60 - i * 5 };
    silueta += brazo(cerca.x + (i % 2 ? -1 : 1) * cerca.r * 1.5, cerca.y + cerca.r * 1.2, b.x, b.y + 30, 8.5, 'puno', 1);
    return b;
  });

  // Los que van a caballito: el torso entero por encima de la fila, con los dos brazos abiertos.
  const jinetes: { x: number; y: number }[] = [];
  for (const u of [0.05, 0.29, 0.61, 0.72]) {
    const c = cabezas.reduce((m, q) => (Math.abs(q.x - ancho * u) < Math.abs(m.x - ancho * u) ? q : m), cabezas[0]!);
    const y = c.y - c.r * 1.2 - 44;
    silueta +=
      persona(c.x + 2, y, 14, c.y + 20, rnd, 'dos', 38) +
      // El torso, que baja hasta los hombros del que lo lleva.
      poli([[c.x - 24, y + 22], [c.x + 28, y + 22], [c.x + 22, c.y + 10], [c.x - 18, c.y + 10]]);
    jinetes.push({ x: c.x, y });
  }

  // Las banderas: el palo sale de entre la gente. Van donde no hay ni bengala ni jinete.
  let banderas = '';
  let n = 0;
  for (const u of [0.2, 0.37, 0.55, 0.68, 0.9]) {
    const x = ancho * u + (rnd() - 0.5) * 60;
    if (rala(x) < 0.5) continue;
    // Bajas: la punta no pasa del borde del tablado, así ninguna le cruza la cara a los que están arriba.
    const punta = GALPON.tablado.borde + 2 + rnd() * 26;
    const w = 78 + rnd() * 40;
    banderas += bandera(`gl-bandera-${n}`, x, GRANDES.abajo + 20, punta, w, w * (0.5 + rnd() * 0.14), FRANJAS[n % FRANJAS.length]!, (n % 2 ? -1 : 1) * (14 + rnd() * 26), rnd);
    n++;
  }

  // La trama: la luz del escenario les marca la coronilla y los hombros, y cada bengala prende a los de al lado.
  // Son los más oscuros: de la luz del tablado les queda apenas el canto de la cabeza.
  const canto = luzDeCabezas(cabezas, 0.36, GRANDES.arriba - 6);
  const brilla = (px: number, py: number): number => {
    let b = 0.035 + canto(px, py);
    for (const q of bengalas) b = Math.max(b, 1.15 * Math.exp(-Math.hypot(px - q.x, (py - q.y) * 0.8) / 105));
    return b;
  };
  const fuegos = bengalas.map((b, i) => trazo(`M${f(b.x)} ${f(b.y + 28)} L${f(b.x)} ${f(b.y)}`, G.negro, 3) + bengala(b.x, b.y, 3361 + i, i === 1 ? 1.15 : 1)).join('');
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-40" y="240" width="${ancho + 80}" height="${alto - 240}" fill="${G.negro}" fill-opacity="0"/>` +
    // El resplandor de cada bengala, por detrás de la gente.
    bengalas.map((b) => nube(b.x, b.y, 150, 110, G.vivo, 'xl', 0.34)).join('') +
    banderas +
    enmascarado('gl-gente', silueta, forma(silueta, G.negro) + trama(-30, GALPON.gente - 150, ancho + 30, alto + 10, 6, brilla, G.rojo, 0.95)) +
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
  // La misma tanda tres veces, corrida un ancho: lo que asoma por un borde es lo que entra por el otro.
  const { silueta, cabezas } = gentio(0, c.ancho, arriba, arriba + 34, [10.5, 14], base, 0.5, 3373);
  const todas = [-c.ancho, 0, c.ancho].flatMap((dx) => cabezas.map((q) => ({ ...q, x: q.x + dx })));
  const tres = [-c.ancho, 0, c.ancho].map((dx) => `<path transform="translate(${dx} 0)" d="${silueta}"/>`).join('');
  const brilla = luzDeCabezas(todas, 0.72, arriba + 2);
  const rnd = azar(3389);
  let trapos = '';
  [0.31, 0.78].forEach((u, i) => {
    trapos += bandera(`gl-pogo-trapo-${i}`, c.ancho * u, arriba + 60, arriba - 54 + i * 8, 62 + i * 14, 34, FRANJAS[(i + 2) % FRANJAS.length]!, i ? -16 : 20, rnd);
  });
  return (
    `<g filter="url(#grano)">${hoja(c)}` +
    trapos +
    `<clipPath id="gl-pogo">${tres}</clipPath>` +
    `<g clip-path="url(#gl-pogo)">` +
    `<rect x="-200" y="${c.y - 20}" width="${c.ancho + 400}" height="${c.alto + 60}" fill="${G.negro}"/>` +
    trama(-130, c.y, c.ancho + 130, c.y + c.alto + 10, 5.2, brilla, G.rojo, 0.9) +
    `</g></g>`
  );
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
