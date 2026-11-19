/**
 * Las cárceles de atrás de la prisión de Barbazul (`D-91`, tanda 5): acá no se llena, se hunde.
 *
 * La prisión (`prisionLejos`, la reja, las jaulas y todos los que viven ahí) es de `arte-prision.ts` y
 * `escenas.ts`, y acá no se edita: otra sesión la está tocando (`T-529`). El pasillo del medio ya fugaba a
 * la ventana; las dos alas eran pared negra con una reja adelante. Lo que el camino pinta por su cuenta entra
 * después del telón (`EN_EL_RECINTO`), debajo de todos, en los dos paños de pared que estaban vacíos:
 *
 * - **La puerta de la escalera** (a la entrada, entre las dos primeras rejas): un vano angosto y, adentro,
 *   una escalera que baja y se pierde, con la luz que viene de abajo. Si te quedás quieto, **alguien sube**.
 * - **El arco de las cárceles** (en el ala del final): por un arco se ve el resto de la prisión, que es
 *   enorme: una escalera que cruza en diagonal, un puente con baranda, otro arco más chico al fondo con
 *   luz, y una cadena con su gancho colgando del puente, que se hamaca. Es el punto de fuga del ala.
 *   La idea es de las *Carceri* de Piranesi, que son esto mismo en aguafuerte: arcos, puentes, escaleras
 *   y cadenas que no terminan. Es invento sobre el recinto, no letra.
 *
 * Todo es gubia, como *Oktubre*: blanco de papel sobre negro, sin un gris. Lo que está lejos no es más
 * tenue: es **más fino y más ralo**. El filtro de la gubia deja el alfa en todo o nada, así que acá no hay
 * opacidades: el valor se hace con el grosor y con el paso del rayado.
 */

import { type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';

const PAPEL = 'var(--bestia-dracula-papel)';
const NEGRO = 'var(--fondo)';
const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** Un corte de gubia: una línea blanca. */
const corte = (d: string, ancho: number): string => `<path d="${d}" fill="none" stroke="${PAPEL}" stroke-width="${f(ancho)}" stroke-linecap="round" stroke-linejoin="round"/>`;
const negro = (d: string): string => `<path d="${d}" fill="${NEGRO}"/>`;
const blanco = (d: string): string => `<path d="${d}" fill="${PAPEL}"/>`;

/** Un rayado: cortes paralelos en una caja, cada uno en tramos, con algún hueco. `paso` chico es más claro. */
function rayado([x0, y0, x1, y1]: readonly [number, number, number, number], paso: number, ancho: number, semilla: number, parado = false): string {
  const rnd = azar(semilla);
  let d = '';
  const [desde, hasta, a, b] = parado ? [x0, x1, y0, y1] : [y0, y1, x0, x1];
  for (let v = desde + paso / 2; v < hasta; v += paso * (0.8 + rnd() * 0.4)) {
    let u = a + rnd() * 6;
    while (u < b - 3) {
      const largo = Math.min(b - u, 8 + rnd() * 34);
      d += parado ? `M${f(v + (rnd() - 0.5))} ${f(u)} l${f((rnd() - 0.5) * 0.8)} ${f(largo)} ` : `M${f(u)} ${f(v + (rnd() - 0.5))} l${f(largo)} ${f((rnd() - 0.5) * 0.8)} `;
      u += largo + 2 + rnd() * 7;
    }
  }
  return corte(d, ancho);
}

let cuenta = 0;
const recortado = (silueta: string, adentro: string): string => {
  const id = `cc-${cuenta++}`;
  return `<clipPath id="${id}"><path d="${silueta}"/></clipPath><g clip-path="url(#${id})">${adentro}</g>`;
};
const hoja = ([x, y, w, h]: readonly [number, number, number, number], adentro: string): string =>
  `<g filter="url(#gubia)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${NEGRO}" fill-opacity="0"/>${adentro}</g>`;

/* ------------------------------------------------------------------
   La puerta de la escalera que baja (a la entrada)
   ------------------------------------------------------------------ */

/** El vano: en el paño negro entre las dos primeras rejas de la izquierda, detrás de donde se para el chivato. */
export const PUERTA = { x0: -66, x1: 6, arriba: 118, umbral: 364 } as const;
/** Los escalones: cada uno más abajo, más angosto y más junto que el anterior. `[medio, y, medio ancho]`. */
export const ESCALONES: readonly (readonly [number, number, number])[] = Array.from({ length: 9 }, (_, i) => [-30 + i * 1.2, 232 + 124 * (1 - 0.8 ** i), 30 * 0.88 ** i] as const);

function puertaDeLaEscalera(): string {
  const { x0, x1, arriba, umbral } = PUERTA;
  const medio = (x0 + x1) / 2;
  const vano = `M${x0} ${umbral} L${x0} ${arriba + 30} Q${x0} ${arriba} ${medio} ${arriba} Q${x1} ${arriba} ${x1} ${arriba + 30} L${x1} ${umbral} Z`;
  let escalera = '';
  ESCALONES.forEach(([cx, y, w], i) => {
    const sig = ESCALONES[i + 1];
    // La pisada, y debajo la contrahuella rayada: más apretada cuanto más abajo, porque la luz viene de ahí.
    escalera += corte(`M${f(cx - w)} ${f(y)} L${f(cx + w)} ${f(y)}`, 2.2 - i * 0.16);
    if (sig) escalera += rayado([cx - w + 1, y + 2, cx + w - 1, sig[1] - 1], Math.max(2.2, 6.4 - i * 0.6), 0.8, 7100 + i, true);
  });
  const [fx, fy] = ESCALONES[ESCALONES.length - 1]!;
  let luz = '';
  for (let k = 0; k < 13; k++) {
    const a = Math.PI * (1.08 + (k / 12) * 0.84);
    luz += `M${f(fx + Math.cos(a) * 5)} ${f(fy + 6 + Math.sin(a) * 4)} L${f(fx + Math.cos(a) * (16 + (k % 3) * 7))} ${f(fy + 6 + Math.sin(a) * (14 + (k % 2) * 8))} `;
  }
  return (
    negro(vano) +
    recortado(
      vano,
      // Las dos paredes de la caja de la escalera: rayadas a lo largo, ralas arriba y más prendidas abajo.
      rayado([x0, arriba, ESCALONES[0]![0] - 31, 230], 9, 0.7, 7001) +
        rayado([ESCALONES[0]![0] + 31, arriba, x1, 230], 9, 0.7, 7003) +
        rayado([x0, 232, x0 + 9, umbral], 5, 0.8, 7005) +
        rayado([x1 - 9, 232, x1, umbral], 5, 0.8, 7007) +
        // El techo de la escalera, que baja con ella.
        corte(`M${x0 + 4} ${arriba + 34} L${f(fx - 6)} ${f(fy - 44)} M${x1 - 4} ${arriba + 34} L${f(fx + 8)} ${f(fy - 44)}`, 0.9) +
        escalera +
        corte(luz, 0.9),
    ) +
    // El marco: las jambas de piedra, las dovelas del arco y el umbral gastado.
    corte(`M${x0} ${umbral} L${x0} ${arriba + 30} Q${x0} ${arriba} ${medio} ${arriba} Q${x1} ${arriba} ${x1} ${arriba + 30} L${x1} ${umbral}`, 3) +
    corte(`M${x0 - 6} ${umbral} L${x0 - 6} ${arriba + 28} Q${x0 - 6} ${arriba - 7} ${medio} ${arriba - 7} Q${x1 + 6} ${arriba - 7} ${x1 + 6} ${arriba + 28} L${x1 + 6} ${umbral}`, 1) +
    [0.12, 0.3, 0.5, 0.7, 0.88].map((u) => corte(`M${f(x0 + (x1 - x0) * u)} ${f(arriba - 6.4 + Math.abs(u - 0.5) * 22)} l${f((u - 0.5) * 3)} 6`, 0.9)).join('') +
    [150, 196, 244, 290, 334].map((y, i) => corte(`M${x0 - 6} ${y} l6 ${i % 2 ? 0.6 : -0.6} M${x1} ${y + 9} l6 ${i % 2 ? -0.6 : 0.6}`, 0.9)).join('') +
    corte(`M${x0 - 8} ${umbral + 1} L${x1 + 8} ${umbral}`, 2.2)
  );
}

/** El que sube: una cabeza rapada y una mano en la pared, a media escalera. Sale si te quedás quieto. */
const SUBE = ESCALONES[2]!;
// Segunda vuelta: un 40 % más grande (medía 40 de ancho y en el teléfono se perdía), y con una mano agarrada de la jamba.
const TALLA_DEL_QUE_SUBE = 1.4;
export const EL_QUE_SUBE = { caja: [Math.round(SUBE[0] - 30), Math.round(SUBE[1] - 50), 60, 56] as const } as const;

function elQueSube(): string {
  const [cx, y] = [SUBE[0], SUBE[1]];
  return hoja(
    EL_QUE_SUBE.caja,
    // La mano, en la jamba de la derecha, más arriba que él: cuatro dedos.
    blanco(`M${f(cx + 22)} ${f(y - 34)} l6 -0.6 l0.4 8 l-6.4 0.6 Z`) +
      `<path d="M${f(cx + 23.6)} ${f(y - 34)} l0.2 7.6 M${f(cx + 25.2)} ${f(y - 34.2)} l0.2 7.6 M${f(cx + 26.8)} ${f(y - 34.4)} l0.2 7.6" fill="none" stroke="${NEGRO}" stroke-width="0.7"/>` +
      `<g transform="translate(${f(cx)} ${f(y + 3)}) scale(${TALLA_DEL_QUE_SUBE}) translate(${f(-cx)} ${f(-y - 3)})">` +
      // La cabeza y los hombros, en papel: lo que queda afuera del hueco de la escalera. Los ojos, dos tajos.
      blanco(`M${f(cx - 16)} ${f(y + 3)} Q${f(cx - 15)} ${f(y - 9)} ${f(cx - 7)} ${f(y - 11)} Q${f(cx - 10)} ${f(y - 30)} ${f(cx + 1)} ${f(y - 31)} Q${f(cx + 11)} ${f(y - 30)} ${f(cx + 8)} ${f(y - 11)} Q${f(cx + 16)} ${f(y - 9)} ${f(cx + 17)} ${f(y + 3)} Z`) +
      negro(`M${f(cx - 5.6)} ${f(y - 21)} l4.4 0.6 l-0.4 2.2 l-4 -0.4 Z M${f(cx + 2)} ${f(y - 20.4)} l4.4 -0.6 l0 2.4 l-4.2 0.4 Z`) +
      `<path d="M${f(cx - 3)} ${f(y - 13.6)} l7 0 M${f(cx - 9)} ${f(y - 4)} l4 5 M${f(cx + 6)} ${f(y - 3)} l4 4 M${f(cx - 2)} ${f(y - 28)} l5 0.4" fill="none" stroke="${NEGRO}" stroke-width="1.1"/>` +
      `</g>`,
  );
}

/* ------------------------------------------------------------------
   El arco de las cárceles (en el ala del final)
   ------------------------------------------------------------------ */

/** El arco: en la pared del ala derecha, arriba de donde está el esclavo encadenado y antes de la noche del cruce. */
// Termina en 262: de 270 para abajo está la reja grande del ala, que es del recinto y no se tapa.
export const ARCO = { x0: 906, x1: 1072, arriba: 30, hombro: 104, abajo: 262 } as const;
/** El puente que cruza el arco, y de dónde cuelga la cadena. */
export const PUENTE = { y0: 136, y1: 120, cuelga: 1020, largo: 66 } as const;

function arcoDeLasCarceles(): string {
  const { x0, x1, arriba, hombro, abajo } = ARCO;
  const medio = (x0 + x1) / 2;
  const vano = `M${x0} ${abajo} L${x0} ${hombro} Q${x0} ${arriba} ${medio} ${arriba} Q${x1} ${arriba} ${x1} ${hombro} L${x1} ${abajo} Z`;
  const yPuente = (x: number): number => PUENTE.y0 + ((PUENTE.y1 - PUENTE.y0) * (x - x0)) / (x1 - x0);
  // El arco del fondo: más chico, y adentro la luz (el rayado más apretado de toda la pieza).
  const lejos = { x0: 972, x1: 1036, arriba: 160, abajo: 232 };
  const vanoLejos = `M${lejos.x0} ${lejos.abajo} L${lejos.x0} ${lejos.arriba + 26} Q${lejos.x0} ${lejos.arriba} ${(lejos.x0 + lejos.x1) / 2} ${lejos.arriba} Q${lejos.x1} ${lejos.arriba} ${lejos.x1} ${lejos.arriba + 26} L${lejos.x1} ${lejos.abajo} Z`;
  // La escalera grande: sube en diagonal de abajo a la izquierda a la derecha, por delante del arco del fondo.
  let peldanos = `M${x0 + 2} ${abajo - 4}`;
  const pasos = 9;
  for (let i = 0; i < pasos; i++) peldanos += ` l0 -10.6 l11.6 0`;
  const cima = [x0 + 2 + pasos * 11.6, abajo - 4 - pasos * 10.6] as const;
  const bajoLaEscalera = `M${x0 + 2} ${abajo - 4} L${cima[0]} ${cima[1]} L${cima[0]} ${cima[1] + 30} L${x0 + 40} ${abajo + 2} Z`;
  let baranda = '';
  for (let x = x0 + 8; x < x1; x += 13) baranda += `M${f(x)} ${f(yPuente(x))} l0 -13 `;
  return (
    negro(vano) +
    recortado(
      vano,
      // La pared del fondo, rala; la bóveda, con tres nervios que se cierran.
      rayado([x0, arriba, x1, 120], 10, 0.6, 7201) +
        corte(`M${x0 + 14} ${abajo} Q${x0 + 20} ${arriba + 40} ${medio + 6} ${arriba + 30} M${x1 - 10} ${abajo} Q${x1 - 22} ${arriba + 46} ${medio + 6} ${arriba + 30}`, 0.8) +
        // El arco del fondo, prendido.
        recortado(vanoLejos, rayado([lejos.x0, lejos.arriba, lejos.x1, lejos.abajo], 2.6, 0.9, 7203, true) + negro(`M${lejos.x0 + 18} ${lejos.abajo} l0 -30 q9 -12 18 0 l0 30 Z`)) +
        corte(`M${lejos.x0} ${lejos.abajo} L${lejos.x0} ${lejos.arriba + 26} Q${lejos.x0} ${lejos.arriba} ${(lejos.x0 + lejos.x1) / 2} ${lejos.arriba} Q${lejos.x1} ${lejos.arriba} ${lejos.x1} ${lejos.arriba + 26} L${lejos.x1} ${lejos.abajo}`, 1.2) +
        // Otra escalera, lejísimos, al pie del arco del fondo.
        corte(`M${lejos.x0 - 30} ${lejos.abajo + 30} l0 -4 l5 0 l0 -4 l5 0 l0 -4 l5 0 l0 -4 l5 0 l0 -4 l5 0 l0 -4 l5 0 L${lejos.x1 + 30} ${lejos.abajo + 6}`, 0.8) +
        // El puente: el tablero, la baranda, y el arco que lo sostiene con su panza rayada.
        negro(`M${x0} ${yPuente(x0) - 15} L${x1} ${yPuente(x1) - 15} L${x1} ${yPuente(x1) + 9} L${x0} ${yPuente(x0) + 9} Z`) +
        corte(`M${x0} ${yPuente(x0)} L${x1} ${yPuente(x1)} M${x0} ${yPuente(x0) + 7} L${x1} ${yPuente(x1) + 7}`, 1.6) +
        corte(baranda, 1) +
        corte(`M${x0} ${yPuente(x0) - 13} L${x1} ${yPuente(x1) - 13}`, 1.2) +
        rayado([x0, PUENTE.y1 + 1, x1, PUENTE.y0 + 6], 3, 0.6, 7205, true) +
        corte(`M${x0 + 6} ${yPuente(x0) + 40} Q${medio} ${yPuente(medio) + 2} ${x1 - 6} ${yPuente(x1) + 40}`, 1.1) +
        // La escalera grande: lo de abajo en negro (tapa lo lejano), la panza rayada, los peldaños en papel.
        negro(bajoLaEscalera) +
        recortado(bajoLaEscalera, rayado([x0, cima[1], cima[0] + 4, abajo + 4], 4.4, 0.8, 7207, true)) +
        corte(peldanos, 2) +
        corte(`M${x0 + 40} ${abajo + 2} L${cima[0]} ${cima[1] + 30} L${cima[0]} ${cima[1]} L${x1} ${cima[1]}`, 1.2) +
        // La polea de la cadena, clavada abajo del puente.
        `<circle cx="${PUENTE.cuelga}" cy="${f(yPuente(PUENTE.cuelga) + 13)}" r="4.4" fill="${NEGRO}" stroke="${PAPEL}" stroke-width="1.3"/>`,
    ) +
    // El marco del arco: la piedra gruesa, las dovelas y las hiladas de las jambas.
    corte(`M${x0} ${abajo} L${x0} ${hombro} Q${x0} ${arriba} ${medio} ${arriba} Q${x1} ${arriba} ${x1} ${hombro} L${x1} ${abajo}`, 3.4) +
    corte(`M${x0 - 9} ${abajo} L${x0 - 9} ${hombro - 2} Q${x0 - 9} ${arriba - 10} ${medio} ${arriba - 10} Q${x1 + 9} ${arriba - 10} ${x1 + 9} ${hombro - 2} L${x1 + 9} ${abajo}`, 1.1) +
    [0.06, 0.18, 0.31, 0.44, 0.56, 0.69, 0.82, 0.94].map((u) => corte(`M${f(x0 + (x1 - x0) * u)} ${f(arriba - 9 + (Math.abs(u - 0.5) * 2) ** 2.4 * 56)} l${f((u - 0.5) * 5)} 9`, 0.9)).join('') +
    [128, 162, 196, 230].map((y, i) => corte(`M${x0 - 9} ${y} l9 ${i % 2 ? 0.8 : -0.8} M${x1} ${y + 14} l9 ${i % 2 ? -0.8 : 0.8}`, 0.9)).join('') +
    corte(`M${x0 - 12} ${abajo + 1} L${x1 + 12} ${abajo}`, 2.4)
  );
}

/** La cadena del puente: eslabones, y abajo el gancho. Cuelga de la polea y la isla la hamaca desde ahí. */
const NUDO = { x: PUENTE.cuelga, y: PUENTE.y0 + ((PUENTE.y1 - PUENTE.y0) * (PUENTE.cuelga - ARCO.x0)) / (ARCO.x1 - ARCO.x0) + 17 };
export const CADENA = { pieza: 'camino-prision-cadena', caja: [NUDO.x - 12, Math.round(NUDO.y) - 2, 24, PUENTE.largo + 20] as const, x: NUDO.x, y: Math.round(NUDO.y), largo: PUENTE.largo } as const;

function cadena(): string {
  const { x, y, largo } = CADENA;
  let d = '';
  for (let k = 0; k * 7 < largo; k++) d += k % 2 ? `M${x} ${y + k * 7} l0 7 ` : `M${x - 2} ${y + k * 7 + 1} q-1.6 2.6 0 5.2 M${x + 2} ${y + k * 7 + 1} q1.6 2.6 0 5.2 `;
  return hoja(CADENA.caja, corte(d, 1.3) + corte(`M${x} ${y + largo} l0 5 q0 8 -6 7 q-4 -1 -3 -5`, 2));
}

/* ------------------------------------------------------------------
   Segunda vuelta: las galerías altas, el haz de la ventana y el del puente
   ------------------------------------------------------------------ */

/** La altura de un punto de la pared del pasillo que en el rincón del fondo (x = 650) está a `yb`: todo fuga a (450, 250). */
const enLaPared = (x: number, yb: number): number => 250 + ((yb - 250) * (x - 450)) / 200;
/** Las galerías: de dónde a dónde en la pared de la derecha (la de la izquierda es su espejo), y entre qué alturas en el rincón. */
export const GALERIA = { desde: 660, hasta: 846, techo: 112, piso: 170, celdas: [660, 684, 716, 760, 820] } as const;

/** Un segundo piso de celdas sobre la pared del pasillo, en fuga: la pasarela, la baranda, las rejas y, en la más cercana, dos manos. */
function galeria(lado: 1 | -1): string {
  const X = (x: number): number => (lado > 0 ? x : 900 - x);
  const { desde, hasta, techo, piso, celdas } = GALERIA;
  const raya = (yb: number, ancho: number): string => corte(`M${X(desde)} ${f(enLaPared(desde, yb))} L${X(hasta)} ${f(enLaPared(hasta, yb))}`, ancho);
  let s = negro(`M${X(desde)} ${f(enLaPared(desde, techo))} L${X(hasta)} ${f(enLaPared(hasta, techo))} L${X(hasta)} ${f(enLaPared(hasta, piso + 4))} L${X(desde)} ${f(enLaPared(desde, piso + 4))} Z`);
  for (let i = 0; i < celdas.length - 1; i++) {
    const [a, b] = [celdas[i]! + 2 + i, celdas[i + 1]! - 2 - i];
    // El vano de la celda, y sus barrotes: más gruesos y más separados cuanto más cerca.
    s += corte(`M${X(a)} ${f(enLaPared(a, 160))} L${X(a)} ${f(enLaPared(a, 122))} L${X(b)} ${f(enLaPared(b, 122))} L${X(b)} ${f(enLaPared(b, 160))}`, 0.9 + i * 0.3);
    const n = 3 + i;
    for (let k = 1; k <= n; k++) {
      const x = a + ((b - a) * k) / (n + 1);
      s += corte(`M${X(x)} ${f(enLaPared(x, 124))} L${X(x)} ${f(enLaPared(x, 159))}`, 0.7 + i * 0.3);
    }
  }
  // Las manos, agarradas de dos barrotes de la celda más cercana: es todo lo que se ve del que está adentro.
  const [a, b] = [celdas[3]! + 5, celdas[4]! - 5];
  for (const k of [2, 4]) {
    const x = a + ((b - a) * k) / 7;
    s += blanco(`M${f(X(x) - 3.4)} ${f(enLaPared(x, 139))} l6.8 0 l0 ${f(8.6)} l-6.8 0 Z`) + `<path d="M${f(X(x) - 3.2)} ${f(enLaPared(x, 139) + 2.8)} l6.4 0 M${f(X(x) - 3.2)} ${f(enLaPared(x, 139) + 5.6)} l6.4 0" fill="none" stroke="${NEGRO}" stroke-width="0.7"/>`;
  }
  // La pasarela con su canto, la baranda con sus parantes, y el dintel corrido.
  let parantes = '';
  for (let x = desde + 8; x < hasta; x += 10 + (x - desde) * 0.12) parantes += `M${X(x)} ${f(enLaPared(x, 168))} L${X(x)} ${f(enLaPared(x, 161))} `;
  return s + raya(168, 2) + raya(172, 0.9) + raya(161, 0.9) + corte(parantes, 0.8) + raya(116, 1.1);
}

const CAJA_DE_LA_GALERIA = (lado: 1 | -1): readonly [number, number, number, number] => [lado > 0 ? GALERIA.desde - 4 : 900 - GALERIA.hasta - 4, 0, GALERIA.hasta - GALERIA.desde + 8, 178];

/**
 * El haz de la ventana: la luz que entra por la reja y baja al piso del pasillo, en rayos de gubia cortados, con el polvo
 * que flota adentro. Va en la pared de abajo de la ventana, detrás de Drácula y de todos: no le cruza la cara a nadie.
 * El enrejado de luz en el piso ya lo trae el recinto; esto es lo que lo une con la ventana.
 */
export const HAZ = { caja: [244, 330, 412, 78] as const } as const;

function hazDeLaVentana(): string {
  const rnd = azar(7301);
  let rayos = '';
  let polvo = '';
  for (let i = 0; i <= 12; i++) {
    const [x0, x1] = [330 + i * 20, 258 + i * 32];
    // Cada rayo en dos o tres tramos, con huecos: la reja los corta.
    let u = rnd() * 0.15;
    while (u < 0.94) {
      const largo = 0.16 + rnd() * 0.3;
      const v = Math.min(1, u + largo);
      rayos += `M${f(x0 + (x1 - x0) * u)} ${f(337 + 66 * u)} L${f(x0 + (x1 - x0) * v)} ${f(337 + 66 * v)} `;
      u = v + 0.06 + rnd() * 0.1;
    }
  }
  for (let i = 0; i < 46; i++) {
    const u = rnd();
    const x = 300 + rnd() * 300 + (rnd() - 0.5) * 120 * u;
    polvo += `M${f(x)} ${f(340 + 60 * u)} l${f(0.6 + rnd() * 1.6)} ${f(-0.6 - rnd())} `;
  }
  return corte(rayos, 0.7) + corte(polvo, 1.1);
}

/** El del puente: una figura mínima con un farol, parada en el puente del arco. Sale si te quedás quieto un rato más que el que sube. */
const VIGIA_X = ARCO.x0 + 46;
const VIGIA_Y = PUENTE.y0 + ((PUENTE.y1 - PUENTE.y0) * 46) / (ARCO.x1 - ARCO.x0);
export const EL_DEL_PUENTE = { caja: [VIGIA_X - 10, Math.round(VIGIA_Y) - 28, 22, 30] as const } as const;

function elDelPuente(): string {
  const [x, y] = [VIGIA_X, VIGIA_Y];
  return hoja(
    EL_DEL_PUENTE.caja,
    blanco(`M${f(x - 3.4)} ${f(y - 1)} L${f(x - 3)} ${f(y - 15)} Q${f(x - 3.6)} ${f(y - 22)} ${x} ${f(y - 23)} Q${f(x + 3.6)} ${f(y - 22)} ${f(x + 3)} ${f(y - 15)} L${f(x + 3.6)} ${f(y - 1)} Z`) +
      // El farol, en la punta del brazo, con sus cuatro rayos.
      corte(`M${f(x + 3)} ${f(y - 14)} l5 -2`, 0.9) +
      `<circle cx="${f(x + 8.6)}" cy="${f(y - 14)}" r="1.6" fill="${PAPEL}"/>` +
      corte(`M${f(x + 8.6)} ${f(y - 18)} l0 -2.4 M${f(x + 11)} ${f(y - 16.4)} l1.6 -1.4 M${f(x + 6.4)} ${f(y - 17)} l-1 -1.6`, 0.5),
  );
}

/** Lo que premia a la lupa: una rata en el umbral de la puerta de la escalera, y los palotes de alguien que contaba los días. */
const RATA = [PUERTA.x0 + 2, PUERTA.umbral - 16, 56, 18] as const;

function rata(): string {
  const [x0, y0] = RATA;
  const [x, y] = [x0 + 30, y0 + 14];
  return hoja(
    RATA,
    blanco(`M${x - 11} ${y} Q${x - 12} ${y - 7} ${x - 3} ${y - 8} Q${x + 5} ${y - 9} ${x + 9} ${y - 4} L${x + 15} ${y - 1.4} L${x + 9} ${y} Z`) +
      `<circle cx="${x + 9.4}" cy="${y - 3.4}" r="0.7" fill="${NEGRO}"/>` +
      blanco(`M${x + 4} ${y - 8} q1.6 -3 3.4 -0.4 Z`) +
      corte(`M${x - 11} ${y - 1} q-8 -1 -10 -6 q-1 -3 2 -4`, 0.8) +
      corte(`M${x + 14} ${y - 2} l4 -1.6 M${x + 14} ${y - 1.4} l4.4 0.6`, 0.4) +
      // Los palotes, rayados en la jamba: cuatro y uno cruzado, tres veces, y dos sueltos.
      [0, 1, 2].map((g) => corte(`M${x0 + 4 + g * 0} ${y0 + 1 + g * 5} l0 3.6 m1.8 -3.6 l0 3.6 m1.8 -3.6 l0 3.6 m1.8 -3.6 l0 3.6 M${x0 + 3} ${y0 + 4 + g * 5} l7.4 -2.4`, 0.5)).join(''),
  );
}

const CAJA_DE_LA_PUERTA = [PUERTA.x0 - 10, PUERTA.arriba - 10, PUERTA.x1 - PUERTA.x0 + 20, PUERTA.umbral - PUERTA.arriba + 14] as const;
const CAJA_DEL_ARCO = [ARCO.x0 - 14, ARCO.arriba - 13, ARCO.x1 - ARCO.x0 + 28, ARCO.abajo - ARCO.arriba + 17] as const;

/** Las piezas sueltas de la prisión: los dos vanos, el que sube, la cadena y lo que premia a la lupa. */
export const PIEZAS_DE_LAS_CARCELES: readonly Pieza[] = [
  { nombre: 'camino-prision-puerta', caja: CAJA_DE_LA_PUERTA, dibujo: hoja(CAJA_DE_LA_PUERTA, puertaDeLaEscalera()), densidad: 2.5 },
  { nombre: 'camino-prision-arco', caja: CAJA_DEL_ARCO, dibujo: hoja(CAJA_DEL_ARCO, arcoDeLasCarceles()), densidad: 2.5 },
  { nombre: 'camino-prision-sube', caja: EL_QUE_SUBE.caja, dibujo: elQueSube(), densidad: 3 },
  { nombre: 'camino-prision-galeria-der', caja: CAJA_DE_LA_GALERIA(1), dibujo: hoja(CAJA_DE_LA_GALERIA(1), galeria(1)), densidad: 2.5 },
  { nombre: 'camino-prision-galeria-izq', caja: CAJA_DE_LA_GALERIA(-1), dibujo: hoja(CAJA_DE_LA_GALERIA(-1), galeria(-1)), densidad: 2.5 },
  { nombre: 'camino-prision-haz', caja: HAZ.caja, dibujo: hoja(HAZ.caja, hazDeLaVentana()), densidad: 2.5 },
  { nombre: 'camino-prision-vigia', caja: EL_DEL_PUENTE.caja, dibujo: elDelPuente(), densidad: 4 },
  { nombre: CADENA.pieza, caja: CADENA.caja, dibujo: cadena(), densidad: 3 },
  { nombre: 'fino-prision-rata', caja: RATA, dibujo: rata(), densidad: 4 },
];
