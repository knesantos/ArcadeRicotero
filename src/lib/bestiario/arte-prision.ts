/**
 * La prisión de Barbazul y la drácula con tacones (`D-73`, octava vuelta).
 *
 * Pedido del usuario, textual: *"Agrega otro personaje y pulilo a fondo, se creativo que quede
 * como uno de rocambole."* La drácula sale de *"Preso en mi ciudad"*, que es de *Oktubre* (1986),
 * y la prisión viste justo *Oktubre* (`D-19`): el personaje y su recinto comparten la técnica de
 * esa tapa, que en el bestiario todavía no estaba. **Es grabado**: la plancha negra y la luz
 * sacada a gubia, como la gente de la tapa (`grabado.ts`). El único color es el rojo de las
 * banderas, y la drácula lo lleva adentro de la capa: cuando la abre, la capa es una bandera.
 *
 * No está en ninguna tapa: se inventa en esa estética (`T-440`), con las caras de *Oktubre* como
 * vara —la cuenca honda, el pómulo blanco, la boca dura— y no con la vampiresa de dibujito.
 *
 * Está en coordenadas de títere: el (0, 0) es el piso entre los dos tacos, y arriba es negativo.
 * La luz le viene de arriba y de la izquierda (el foco del pasillo), y la ventana de atrás le
 * recorta el pelo y los hombros.
 */

import { type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';
import { bola, cubica, envolventes, paralelas, picado, plancha, rayos, siguiendo, tallar, tono, trazo, type Mancha, type P } from './grabado.ts';
import { BANDERAS, DRACULA_ARMADO as A, PRISION, deLaTapa } from './rig.ts';

const T = {
  negro: 'var(--fondo)',
  papel: 'var(--bestia-dracula-papel)',
  gris: 'var(--disco-oktubre-apoyo)',
  rojo: 'var(--disco-oktubre-tinta)',
};

/** De dónde le viene la luz: arriba a la izquierda, y de frente. */
const LUZ: readonly [number, number, number] = [-0.5, -0.62, 0.72];

const suave = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
export const poli = (pts: readonly P[]): string => `M${pts.map(([x, y]) => `${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`).join(' L')} Z`;
/** Un camino cerrado que pasa suave por los puntos (Catmull-Rom a cúbicas). */
export function curva(pts: readonly P[], cerrada = true): string {
  const n = pts.length;
  const p = (i: number): P => pts[cerrada ? (i + n) % n : Math.max(0, Math.min(n - 1, i))]!;
  const r = (v: number): number => Math.round(v * 10) / 10;
  let d = `M${r(p(0)[0])} ${r(p(0)[1])}`;
  for (let i = 0; i < (cerrada ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    d += `C${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)} ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return cerrada ? `${d}Z` : d;
}

/** La caja de una lista de puntos, con aire. */
export function cajaDe(pts: readonly P[], aire = 6): readonly [number, number, number, number] {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs) - aire;
  const y0 = Math.min(...ys) - aire;
  return [x0, y0, Math.max(...xs) + aire - x0, Math.max(...ys) + aire - y0];
}

/* ------------------------------------------------------------------
   La cabeza: la cara tallada, el pelo largo, la boca roja
   ------------------------------------------------------------------ */

/** La cara, con el centro en el medio de la cara (entre los ojos y la boca). */
const [FX, FY] = A.cara;
const C = (x: number, y: number): P => [FX + x, FY + y];

/**
 * El contorno de la piel de la cara: la sien, el pómulo alto, el cachete hundido, el mentón en
 * punta. La cabeza corta en la boca: lo de abajo es de la mandíbula (`QUIJADA`), que se abre.
 */
const CARA: readonly P[] = [
  C(0, -50), C(-14, -46), C(-30, -40), C(-38, -24), C(-41, -6), C(-40, 8), C(-35, 22), C(-29, 36), C(-19, 50), C(-8, 58), C(0, 60),
  C(8, 58), C(19, 50), C(29, 36), C(35, 22), C(40, 8), C(41, -6), C(38, -24), C(30, -40), C(14, -46),
];
/** La línea de la boca, de comisura a comisura: hasta acá llega la cabeza. */
const BOCA_Y = 37.4;
const ARRIBA_DE_LA_BOCA: readonly P[] = [
  C(0, -50), C(-14, -46), C(-30, -40), C(-38, -24), C(-41, -6), C(-40, 8), C(-35, 22), C(-30, 33), C(-22, 38), C(-15, BOCA_Y), C(-7, BOCA_Y + 1.2),
  C(0, BOCA_Y + 0.6), C(7, BOCA_Y + 1.2), C(15, BOCA_Y), C(22, 38), C(30, 33), C(35, 22), C(40, 8), C(41, -6), C(38, -24), C(30, -40), C(14, -46),
];
/** La quijada: de la boca para abajo, con un margen que se esconde debajo de la cabeza. */
const QUIJADA: readonly P[] = [C(-34, 24), C(-29, 36), C(-19, 50), C(-8, 58), C(0, 60), C(8, 58), C(19, 50), C(29, 36), C(34, 24), C(0, 28)];

/**
 * El pelo de atrás: la masa negra partida al medio que enmarca la cara y cae lacia hasta los
 * hombros, cortada en puntas despareja. Deja libre el cogote.
 */
const PELO_ATRAS: readonly P[] = [
  C(0, -68), C(-8, -71), C(-26, -69), C(-46, -56), C(-58, -34), C(-62, -6), C(-63, 30), C(-66, 70), C(-70, 104), C(-62, 98), C(-60, 112), C(-52, 100),
  C(-49, 114), C(-43, 92), C(-40, 62), C(-36, 44), C(-30, 32), C(0, 30), C(30, 32), C(36, 44), C(40, 62), C(43, 92), C(49, 114), C(52, 100), C(60, 112), C(62, 98),
  C(70, 104), C(66, 70), C(63, 30), C(62, -6), C(58, -34), C(46, -56), C(26, -69), C(8, -71),
];

/** La luz apretada de la piel: en *Oktubre* casi no hay medio tono. */
const apretada = (luz: (x: number, y: number) => number) => (x: number, y: number): number => suave((luz(x, y) - 0.22) / 0.5);

/** La luz de la cara: el elipsoide, y lo que talló Rocambole encima. */
function luzDeCara(): (x: number, y: number) => number {
  const m = (x: number, y: number, rx: number, ry: number, peso: number, giro = 0, blando = 0.7): Mancha => ({ c: C(x, y), r: [rx, ry], peso, giro, blando });
  return tono(0.04, [
    bola(C(-2, 0), [48, 66], [-0.48, -0.36, 0.8], 1.08),
    // La frente y el puente de la nariz, planos de luz.
    m(-8, -30, 26, 13, 0.2),
    m(-2.5, 4, 4.5, 20, 0.55, 0, 0.75),
    // Las cuencas, hondas: el ojo vive en lo negro. Y el ceño, entre las cejas.
    m(0, -16, 4, 5, -0.35, 0, 0.9),
    m(-17, -7, 13, 8.5, -0.95, 6, 0.5),
    m(18, -7, 13.5, 9, -1.1, -6, 0.5),
    // El pómulo alto, blanco, y el cachete hundido debajo.
    m(-23, 9, 13, 7, 0.35, -24, 0.8),
    m(23, 9, 11, 6, 0.25, 24, 0.8),
    m(-28, 27, 10, 14, -0.55, -12),
    m(28, 27, 11, 15, -0.62, 12),
    // El costado de la nariz y la sombra que tira abajo.
    m(5, 11, 3.2, 11, -0.6, -8, 0.6),
    m(2, 25.5, 7, 2.6, -0.7),
    // La mitad de la noche, más hundida.
    m(26, 4, 16, 30, -0.28, 0, 0.9),
    // El labio de arriba y el mentón, de luz; la quijada de la izquierda, prendida.
    m(-3, 31, 10, 4, 0.2),
    m(-3, 48, 13, 8, 0.45),
    m(-22, 40, 12, 6, 0.3, -38),
    // El lado de la noche.
    m(36, -10, 10, 34, -0.4, 6),
  ]);
}

/** Un ojo: el blanco almendrado en su cuenca, la pupila negra con su brillo, el párpado pesado. */
function ojo(n: number, semilla: number): { blancos: string; trazos: string; brillos: string } {
  const { centro: [cx, cy], radio: [rx, ry] } = A.ojos[n]!;
  const lado = n === 0 ? -1 : 1;
  const r = (v: number): number => Math.round(v * 10) / 10;
  const d = (p: readonly P[]): string => `M${p.map(([x, y]) => `${r(x)} ${r(y)}`).join('L')}Z`;
  const almendra: P[] = [];
  for (let k = 0; k < 28; k++) {
    const a = (k / 28) * Math.PI * 2;
    const s = Math.sin(a);
    // Arriba, la curva alta del párpado; abajo, casi recta. La punta de afuera, caída.
    const y = s < 0 ? s * ry * 1.05 : s * ry * 0.55;
    const x = Math.cos(a) * rx;
    almendra.push([cx + x, cy + y + (x * lado > 0 ? (x * lado) / rx : 0) * 1.4]);
  }
  const circulo = (x: number, y: number, radio: number, m = 14): P[] =>
    Array.from({ length: m }, (_, k) => [x + Math.cos((k / m) * Math.PI * 2) * radio, y + Math.sin((k / m) * Math.PI * 2) * radio] as P);
  // La pupila mira un poco para adentro y para abajo: al que llega por el pasillo.
  const [ix, iy] = [cx - lado * 1.4, cy + 0.2];
  return {
    blancos:
      d(almendra) +
      // El pliegue del párpado, tallado arriba del ojo, y la ojera de Oktubre abajo.
      trazo(cubica([[cx - rx * 1.05, cy - ry * 0.9], [cx - rx * 0.4, cy - ry * 3], [cx + rx * 0.5, cy - ry * 2.9], [cx + rx * 1.15, cy - ry * 1.1]]), 1.5, semilla) +
      trazo(cubica([[cx - rx * 0.85, cy + ry * 1.9], [cx - rx * 0.3, cy + ry * 2.9], [cx + rx * 0.4, cy + ry * 2.8], [cx + rx * 1.05, cy + ry * 1.6]]), 1.25, semilla + 1),
    trazos:
      d(circulo(ix, iy, ry * 0.92)) +
      // La línea del párpado de arriba, gruesa, que tapa la pupila y se va en punta para afuera.
      trazo(
        cubica([[cx - rx * 1.15, cy + 0.8 - lado * 0.6], [cx - rx * 0.45, cy - ry * 1.7], [cx + rx * 0.45, cy - ry * 1.75], [cx + rx * 1.3, cy - ry * 0.1 + lado * 0.6]]),
        2.8,
        semilla + 3,
        (t) => Math.sin(Math.PI * Math.min(1, t * 1.1)) ** 0.45,
      ) +
      trazo(cubica([[cx - rx * 0.8, cy + ry * 0.62], [cx - rx * 0.2, cy + ry * 0.95], [cx + rx * 0.4, cy + ry * 0.95], [cx + rx * 0.95, cy + ry * 0.7]]), 1, semilla + 4),
    brillos: d(circulo(ix - 1.3, iy - 1.1, 0.95, 8)),
  };
}

function cabeza(): string {
  // La luz se aprieta: lo iluminado es un plano blanco, la sombra es negra, y la raya queda para
  // el paso de una a otra.
  const luz = apretada(luzDeCara());
  const caja = cajaDe(PELO_ATRAS, 4);
  // La frente y las sienes, con cortes que dan la vuelta; los cachetes, con cortes que bajan.
  const arriba = (x: number, y: number): number => (y < FY - 12 ? luz(x, y) : y < FY - 4 ? luz(x, y) * ((FY - 4 - y) / 8) : 0);
  const abajo = (x: number, y: number): number => (y > FY - 4 ? luz(x, y) : y > FY - 12 ? luz(x, y) * ((y - FY + 12) / 8) : 0);
  const frente = envolventes(C(0, -6), [46, 62], { paso: 3, comba: 0.16, desde: -1, hasta: -0.05, semilla: 3 });
  // Los cachetes con cortes que bajan, y el medio de la cara con cortes que dan la vuelta: cada
  // familia en su zona, que en *Oktubre* la gubia no cruza la trama.
  const costado = (x: number): number => suave((Math.abs(x - FX) - 14) / 8);
  const cachetes = [
    ...siguiendo([C(-31, -14), C(-39, 8), C(-31, 34), C(-9, 57)], { n: 13, separacion: 2.8, abre: 1.15, semilla: 5 }),
    ...siguiendo([C(31, -14), C(39, 8), C(31, 34), C(9, 57)], { n: 13, separacion: 2.8, abre: 1.15, semilla: 6 }),
  ];
  const medio = envolventes(C(0, 8), [42, 54], { paso: 3.1, comba: 0.26, desde: -0.25, hasta: 1, semilla: 7 });
  const puente = siguiendo([C(-1.5, -14), C(-2.5, -2), C(-3.5, 10), C(-3, 22)], { n: 5, separacion: 2.2, semilla: 8 });
  // En la luz los cortes casi se tocan, y queda una raya negra fina entre corte y corte: las
  // arrugas de la frente de la gente de la tapa.
  const tallas =
    tallar(frente, arriba, { ancho: 4.1, umbral: [0.15, 0.85], semilla: 11 }) +
    tallar(cachetes, (x, y) => abajo(x, y) * costado(x), { ancho: 4.1, umbral: [0.15, 0.85], semilla: 12 }) +
    tallar(medio, (x, y) => abajo(x, y) * (1 - costado(x)), { ancho: 4, umbral: [0.15, 0.85], semilla: 15 }) +
    tallar(puente, luz, { ancho: 2.6, umbral: [0.3, 0.8], semilla: 14 });
  const grano = picado(cajaDe(CARA, 0), luz, { rango: [0.2, 0.48], densidad: 7, angulo: 70, semilla: 13 });
  const [o1, o2] = [ojo(0, 21), ojo(1, 31)];
  // Las cejas: finas, en arco alto, negras sobre la frente blanca.
  const cejas =
    trazo(cubica([C(-31, -22), C(-23, -28), C(-13, -25), C(-4, -17)]), 2.5, 41, (t) => Math.sin(Math.PI * t) ** 0.35 * (0.55 + t * 0.45)) +
    trazo(cubica([C(4, -17), C(13, -25), C(23, -28), C(31, -22)]), 2.5, 42, (t) => Math.sin(Math.PI * t) ** 0.35 * (1 - t * 0.45));
  // La nariz: el filo de luz del lado izquierdo y las aletas negras.
  const nariz = trazo(cubica([C(-1, -10), C(-3, 0), C(-4, 12), C(-3, 21)]), 1.8, 51) + trazo(cubica([C(-5, 24), C(-2, 26.5), C(2, 26.5), C(5, 24)]), 1.3, 52);
  const aletas = trazo(cubica([C(-8, 20), C(-9, 24), C(-6, 26), C(-3, 25)]), 2.6, 53) + trazo(cubica([C(3, 25), C(6, 26), C(9, 24), C(8, 20)]), 2.6, 54);
  // El surco entre la nariz y la boca, tallado, y la comisura que tira para abajo.
  const surco = trazo(cubica([C(-2, 28), C(-3, 31), C(-3, 33), C(-2, 35)]), 1.6, 55);
  const comisuras = trazo(cubica([C(-15, 30), C(-18, 33), C(-19, 36), C(-17, 38)]), 1.2, 56) + trazo(cubica([C(15, 30), C(18, 33), C(19, 36), C(17, 38)]), 1.2, 57);
  // El pelo: una franja de brillo que le da la vuelta a la coronilla, y el canto de la derecha
  // prendido por la ventana de atrás.
  const raya = siguiendo([C(0, -70), C(0, -64), C(-1, -56), C(-1, -50)], { n: 1, separacion: 1, semilla: 60 });
  const mechones = [
    ...siguiendo([C(-2, -69), C(-30, -67), C(-56, -38), C(-62, 40)], { n: 16, separacion: 2.4, abre: 1.6, semilla: 63, recorta: 0.15 }),
    ...siguiendo([C(2, -69), C(30, -67), C(56, -38), C(62, 40)], { n: 16, separacion: 2.4, abre: 1.6, semilla: 64, recorta: 0.15 }),
    ...siguiendo([C(-48, 0), C(-56, 40), C(-60, 76), C(-62, 112)], { n: 7, separacion: 2.8, abre: 1.3, semilla: 65, recorta: 0.2 }),
    ...siguiendo([C(48, 0), C(56, 40), C(60, 76), C(62, 112)], { n: 7, separacion: 2.8, abre: 1.3, semilla: 66, recorta: 0.2 }),
  ];
  const luzPelo = tono(0.1, [
    // El brillo de la coronilla, una medialuna del lado de la luz.
    { c: C(-18, -56), r: [30, 11], peso: 1, giro: -22, blando: 0.85 },
    { c: C(20, -58), r: [20, 8], peso: 0.55, giro: 20, blando: 0.85 },
    // El canto contra la ventana.
    { c: C(60, 20), r: [7, 80], peso: 0.8, blando: 0.6 },
    { c: C(-56, 10), r: [8, 60], peso: 0.5, giro: 4, blando: 0.8 },
    { c: C(-62, 92), r: [10, 18], peso: 0.45, blando: 0.8 },
  ]);
  const tallasPelo = tallar([...mechones, ...raya], luzPelo, { ancho: 2.4, umbral: [0.12, 0.88], punta: 16, semilla: 67 });
  return (
    plancha('dr-pelo-atras', curva(PELO_ATRAS), { negro: T.negro, papel: T.papel, tallas: tallasPelo, caja }) +
    plancha('dr-cara', curva(ARRIBA_DE_LA_BOCA), {
      negro: T.negro,
      papel: T.papel,
      tallas: tallas + grano,
      blancos: o1.blancos + o2.blancos + nariz + surco,
      trazos: o1.trazos + o2.trazos + cejas + aletas + comisuras,
      brillos: o1.brillos + o2.brillos,
      caja: cajaDe(CARA),
    }) +
    labioDeArriba()
  );
}

/**
 * El labio de arriba, rojo como las banderas, con los colmillos que cuelgan de él: a boca
 * cerrada las puntas asoman sobre el labio de abajo; abierta, se ven enteros.
 */
function labioDeArriba(): string {
  const labio = curva([C(-15, BOCA_Y), C(-7, 33), C(-2, 35), C(0, 34.5), C(2, 35), C(7, 33), C(15, BOCA_Y), C(6, BOCA_Y + 1.6), C(0, BOCA_Y + 1.1), C(-6, BOCA_Y + 1.6)]);
  const colmillo = (x: number, lado: number): string => poli([C(x - lado * 1.6, BOCA_Y + 0.6), C(x + lado * 0.2, BOCA_Y + 8.2), C(x + lado * 1.4, BOCA_Y + 0.9)]);
  // El contorno negro de cada colmillo, para que se despegue de lo que tenga detrás.
  const borde = (x: number, lado: number): string =>
    trazo([C(x - lado * 2.2, BOCA_Y + 0.4), C(x - lado * 0.6, BOCA_Y + 5), C(x + lado * 0.2, BOCA_Y + 9.2)], 1.1, 72, () => 1) +
    trazo([C(x + lado * 0.2, BOCA_Y + 9.2), C(x + lado * 1.3, BOCA_Y + 5), C(x + lado * 2, BOCA_Y + 0.6)], 1.1, 73, () => 1);
  return (
    `<g filter="url(#gubia)"><path d="${borde(-5.7, 1) + borde(5.7, -1)}" fill="${T.negro}"/><path d="${colmillo(-5.7, 1) + colmillo(5.7, -1)}" fill="${T.papel}"/>` +
    `<path d="${labio}" fill="${T.rojo}"/></g>`
  );
}

/** Lo de adentro de la boca, que se ve cuando abre: lo negro y la fila de dientes de arriba. */
function boca(): string {
  const hueco = curva([C(-15, BOCA_Y - 1), C(-8, BOCA_Y - 2), C(0, BOCA_Y - 2), C(8, BOCA_Y - 2), C(15, BOCA_Y - 1), C(11, BOCA_Y + 10), C(0, BOCA_Y + 13), C(-11, BOCA_Y + 10)]);
  let dientes = '';
  for (let i = -3; i <= 3; i++) {
    if (Math.abs(i) === 2) continue;
    const x = i * 2.4;
    dientes += poli([C(x - 1.1, BOCA_Y), C(x - 0.9, BOCA_Y + 2.6), C(x + 0.9, BOCA_Y + 2.6), C(x + 1.1, BOCA_Y)]);
  }
  return `<g filter="url(#gubia)"><path d="${hueco}" fill="${T.negro}"/><path d="${dientes}" fill="${T.papel}"/></g>`;
}

/** La mandíbula: el labio de abajo, rojo, el mentón tallado y la sombra que el labio tira. */
function mandibula(): string {
  const luz = apretada(tono(0.05, [
    bola(C(-2, 44), [30, 22], [-0.45, -0.3, 0.85], 1.05),
    { c: C(0, 43), r: [12, 3.5], peso: -0.75, blando: 0.6 },
    { c: C(-3, 50), r: [11, 7], peso: 0.3, blando: 0.8 },
    { c: C(24, 40), r: [10, 14], peso: -0.5, giro: 30, blando: 0.8 },
  ]));
  const lineas = [
    ...envolventes(C(-1, 44), [30, 20], { paso: 3, comba: 0.3, desde: -0.6, hasta: 1, semilla: 81 }),
    ...siguiendo([C(-28, 30), C(-28, 40), C(-20, 50), C(-8, 58)], { n: 4, separacion: 2.8, semilla: 82 }),
  ];
  const labio = curva([C(-14, BOCA_Y + 0.6), C(-6, BOCA_Y + 1.6), C(0, BOCA_Y + 1.2), C(6, BOCA_Y + 1.6), C(14, BOCA_Y + 0.6), C(8, BOCA_Y + 5), C(0, BOCA_Y + 6), C(-8, BOCA_Y + 5)]);
  return (
    plancha('dr-quijada', curva(QUIJADA), { negro: T.negro, papel: T.papel, tallas: tallar(lineas, luz, { ancho: 4, umbral: [0.15, 0.85], semilla: 83 }), caja: cajaDe(QUIJADA) }) +
    `<g filter="url(#gubia)"><path d="${labio}" fill="${T.rojo}"/>` +
    `<path d="${trazo(cubica([C(-9, BOCA_Y + 4.6), C(-3, BOCA_Y + 6.4), C(3, BOCA_Y + 6.4), C(9, BOCA_Y + 4.6)]), 1.1, 84)}" fill="${T.negro}"/></g>`
  );
}

/* ------------------------------------------------------------------
   El cuerpo: el cuello, el escote y el vestido negro
   ------------------------------------------------------------------ */

const [HX, HY] = A.hombros[1];

/** El vestido con el cuello y el escote: lo que se ve cuando abre la capa. Sin brazos: van en las alas. */
const VESTIDO: readonly P[] = [
  [-11, -452], [-13, -432], [-30, -418], [-54, -414], [-60, -404], [-46, -380], [-34, -350], [-27, -318], [-26, -300], [-36, -268],
  [-44, -236], [-46, -200], [-48, -168], [-40, -150], [-30, -158], [-20, -146], [-8, -156], [4, -144], [16, -156], [28, -146], [40, -156],
  [48, -168], [46, -200], [44, -236], [36, -268], [26, -300], [27, -318], [34, -350], [46, -380], [60, -404], [54, -414], [30, -418], [13, -432], [11, -452],
];
/** El escote: la piel del cuello al pecho, que corta el vestido en punta. */
const ESCOTE: readonly P[] = [[-11, -452], [-13, -432], [-30, -418], [-40, -410], [-20, -390], [-6, -356], [0, -350], [6, -356], [20, -390], [40, -410], [30, -418], [13, -432], [11, -452], [0, -456]];

function cuerpo(): string {
  const luzPiel = apretada(tono(0.05, [
    bola([-2, -420], [36, 60], [-0.5, -0.3, 0.8], 1.05),
    // El cuello, en sombra debajo de la quijada; las clavículas, filos de luz.
    { c: [0, -448], r: [12, 8], peso: -0.6, blando: 0.8 },
    { c: [8, -440], r: [6, 16], peso: -0.45, blando: 0.8 },
    { c: [-20, -414], r: [16, 3], peso: 0.3, giro: 12, blando: 0.8 },
    { c: [0, -372], r: [5, 18], peso: -0.5, blando: 0.8 },
  ]));
  const piel = [
    ...siguiendo([[-8, -456], [-9, -440], [-10, -428], [-12, -418]], { n: 7, separacion: 2.6, semilla: 101 }),
    ...envolventes([0, -400], [42, 40], { paso: 3, comba: 0.35, desde: -0.6, hasta: 1, semilla: 102 }),
  ];
  const luzTela = tono(0, [
    // El pecho y la cadera, de luz del lado izquierdo; el canto de la derecha, de la ventana.
    bola([-12, -350], [16, 18], LUZ, 0.9),
    bola([14, -350], [16, 18], LUZ, 0.6),
    bola([-6, -230], [44, 70], LUZ, 0.7),
    { c: [-30, -300], r: [8, 30], peso: 0.25, blando: 0.8 },
    { c: [44, -220], r: [5, 60], peso: 0.55, blando: 0.6 },
  ]);
  const tela = [
    ...envolventes([-12, -350], [17, 19], { paso: 3, comba: 0.4, semilla: 103 }),
    ...envolventes([14, -350], [17, 19], { paso: 3, comba: 0.4, semilla: 104 }),
    ...siguiendo([[-6, -320], [-10, -270], [-14, -210], [-16, -150]], { n: 14, separacion: 5, abre: 1.4, semilla: 105 }),
  ];
  // La gargantilla negra con la piedra roja.
  const gargantilla = trazo([[-12, -438], [-6, -436], [0, -435.5], [6, -436], [12, -438]], 4, 106, () => 1);
  return (
    plancha('dr-vestido', curva(VESTIDO), { negro: T.negro, papel: T.papel, tallas: tallar(tela, luzTela, { ancho: 2.4, umbral: [0.2, 0.9], punta: 12, semilla: 107 }), caja: cajaDe(VESTIDO) }) +
    plancha('dr-escote', poli(ESCOTE), { negro: T.negro, papel: T.papel, tallas: tallar(piel, luzPiel, { ancho: 4, umbral: [0.15, 0.85], semilla: 108 }), trazos: gargantilla, caja: cajaDe(ESCOTE) }) +
    `<path d="${curva([[-3, -435], [0, -438.5], [3, -435], [0, -430]])}" fill="${T.rojo}" filter="url(#gubia)"/>`
  );
}

/* ------------------------------------------------------------------
   Las piernas: las medias negras y los tacos aguja
   ------------------------------------------------------------------ */

/** Una pierna, de la cadera al taco: la de la izquierda (`lado` -1) o la de la derecha (1). */
function pierna(lado: number): string {
  const X = (x: number): number => lado * x;
  const [, cy] = A.caderas[0];
  const contorno: P[] = [
    [X(3), cy - 6], [X(32), cy - 4], [X(32), -200], [X(27), -152], [X(31), -112], [X(30), -80], [X(23), -46], [X(21), -28],
    // El zapato: el empeine que baja en punta, para afuera.
    [X(27), -18], [X(32), -7], [X(35), 0], [X(26), -1], [X(16), -8], [X(13), -26], [X(10), -48], [X(5), -90], [X(6), -122],
    [X(9), -152], [X(4), -200],
  ];
  const luz = tono(0, [
    // El filo de luz de la canilla y la rodilla, del lado de la luz.
    { c: [X(lado < 0 ? 13 : 24), -100], r: [3.5, 70], peso: lado < 0 ? 0.95 : 0.55, blando: 0.75 },
    { c: [X(19), -150], r: [8, 7], peso: 0.6, blando: 0.8 },
    { c: [X(lado < 0 ? 22 : 20), -12], r: [9, 6], peso: 0.95, giro: lado * 30, blando: 0.6 },
    // La pantorrilla, redonda.
    { c: [X(lado < 0 ? 14 : 26), -96], r: [6, 26], peso: 0.45, blando: 0.8 },
  ]);
  const lineas = [
    ...siguiendo([[X(18), -210], [X(18), -150], [X(18), -90], [X(17), -30]], { n: 9, separacion: 2.4, semilla: 120 + lado }),
    ...siguiendo([[X(17), -24], [X(22), -16], [X(27), -8], [X(32), -1]], { n: 4, separacion: 2.2, semilla: 122 + lado }),
  ];
  // El taco aguja, atrás del empeine, del lado de adentro.
  const taco = trazo([[X(12), -24], [X(11), -13], [X(10), -5], [X(10), 0]], 3, 125 + lado, (t) => 1 - t * 0.6);
  return (
    plancha(`dr-pierna-${lado < 0 ? 1 : 2}`, curva(contorno), { negro: T.negro, papel: T.papel, tallas: tallar(lineas, luz, { ancho: 2.6, umbral: [0.15, 0.85], punta: 16, semilla: 127 + lado }), caja: cajaDe(contorno) }) +
    `<path d="${taco}" fill="${T.negro}" filter="url(#gubia)"/>`
  );
}

/* ------------------------------------------------------------------
   La capa: el cuello alto, la espalda, las dos mitades del frente y el forro
   ------------------------------------------------------------------ */

/** La luz de la tela de la capa: pliegues que bajan abiertos desde el hombro, prendidos del lado de la luz. */
function luzDePliegues(apice: P, lado: number, pliegues: number): (x: number, y: number) => number {
  return (x, y) => {
    const a = Math.atan2(y - apice[1], (x - apice[0]) * lado);
    const cresta = 0.5 + 0.5 * Math.cos(a * pliegues * 2 + 0.8);
    const deLaLuz = lado < 0 ? 1 : 0.62;
    const baja = Math.min(1, Math.max(0, (y - apice[1]) / 90));
    return Math.max(0, Math.min(1, cresta ** 1.6 * deLaLuz * (0.25 + 0.75 * baja)));
  };
}

/** El cuello alto, de pie detrás de la cabeza: afuera negro, adentro rojo, con sus varillas. */
function cuelloDeCapa(): string {
  const ala = (lado: number): P[] => [
    [lado * 16, -420], [lado * 34, -456], [lado * 58, -500], [lado * 88, -536], [lado * 106, -544], [lado * 112, -516], [lado * 102, -472], [lado * 92, -438], [lado * 84, -416],
  ];
  const adentro = (lado: number): P[] => [[lado * 22, -424], [lado * 40, -458], [lado * 63, -500], [lado * 91, -531], [lado * 104, -518], [lado * 96, -472], [lado * 88, -440], [lado * 78, -420]];
  const varillas = (lado: number): string =>
    [0.15, 0.4, 0.65, 0.88]
      .map((k, i) => {
        const [x0, y0] = [lado * (24 + 54 * k), -424];
        const [x1, y1] = [lado * (50 + 54 * k), -530 + 60 * k];
        return trazo([[x0, y0], [(x0 * 2 + x1) / 3, (y0 * 2 + y1) / 3], [(x0 + x1 * 2) / 3, (y0 + y1 * 2) / 3], [x1, y1]], 2.2, 140 + i + lado, (t) => (1 - t) ** 0.6);
      })
      .join('');
  const espalda: P[] = [[-78, -416], [-92, -330], [-104, -220], [-112, -132], [-70, -136], [0, -138], [70, -136], [112, -132], [104, -220], [92, -330], [78, -416], [0, -424]];
  const pliegues = [-0.7, -0.35, 0, 0.35, 0.7].map((k, i) => trazo([[k * 56, -410], [k * 70, -330], [k * 86, -230], [k * 100, -124]], 3, 150 + i, (t) => Math.sin(Math.PI * t) ** 0.5)).join('');
  return (
    // La espalda: el forro de atrás, que se ve entre las alas y el cuerpo cuando abre.
    `<g filter="url(#gubia)"><path d="${curva(espalda)}" fill="${T.rojo}"/><path d="${pliegues}" fill="${T.negro}"/></g>` +
    [-1, 1]
      .map((lado) => `<g filter="url(#gubia)"><path d="${poli(ala(lado))}" fill="${T.negro}"/><path d="${poli(adentro(lado))}" fill="${T.rojo}"/><path d="${varillas(lado)}" fill="${T.negro}"/></g>`)
      .join('')
  );
}

/**
 * Una mitad del frente de la capa, cerrada: negra, con los pliegues tallados. La bisagra es el
 * hombro: al abrirse se achica contra él, y del otro lado aparece el forro (`forro`).
 */
const MITAD_CAPA = (lado: number): P[] => [
  [lado * 2, -428], [lado * 30, -424], [lado * 62, -420], [lado * 84, -412], [lado * 92, -396], [lado * 100, -340], [lado * 110, -260], [lado * 120, -180],
  [lado * 128, -122], [lado * 96, -118], [lado * 60, -122], [lado * 26, -128], [lado * 3, -132], [lado * 1, -250], [lado * 0, -380],
];

function capa(lado: number): string {
  const contorno = MITAD_CAPA(lado);
  const apice: P = [lado * 20, -440];
  const luz = luzDePliegues(apice, lado, 4.5);
  const lineas = rayos(apice, { desde: lado < 0 ? 92 : 30, hasta: lado < 0 ? 150 : 88, n: 30, r0: 20, r1: 340, semilla: 160 + lado });
  // El canto del borde: el filo de la tela a la luz, y la costura del borde de adelante.
  const filo = trazo([[lado * 86, -408], [lado * 98, -340], [lado * 112, -230], [lado * 126, -126]], lado < 0 ? 3 : 2, 165 + lado, (t) => 0.4 + 0.6 * Math.sin(Math.PI * t));
  const ruedo = trazo([[lado * 124, -124], [lado * 90, -120], [lado * 50, -125], [lado * 6, -131]], 2.2, 167 + lado);
  return plancha(`dr-capa-${lado < 0 ? 1 : 2}`, poli(contorno), {
    negro: T.negro,
    papel: T.papel,
    tallas: tallar(lineas, luz, { ancho: 3.6, umbral: [0.2, 0.95], punta: 30, pulso: 0.5, semilla: 169 + lado }),
    blancos: filo + ruedo,
    caja: cajaDe(contorno),
  });
}

/**
 * El forro de una mitad, abierta como un ala: rojo como las banderas de *Oktubre*, con el brazo
 * levantado arriba y la mano que tira del borde. Se dibuja ya abierto, del lado de afuera de la
 * bisagra; la isla lo despliega cuando la mitad negra se termina de dar vuelta.
 */
function forro(lado: number): string {
  const [hx, hy] = [lado * HX, HY];
  const [mx, my] = [lado * A.punta[0], A.punta[1]];
  // Las puntas del ala: de la mano salen las varillas, y entre punta y punta el borde se hunde
  // hacia la mano, como el ala de un murciélago.
  const puntas: P[] = [[mx + lado * 8, my + 150], [mx - lado * 48, my + 258], [mx - lado * 142, my + 300], [lado * (HX + 46), -124]];
  const festones: P[] = [];
  let desde: P = [mx + lado * 8, my + 4];
  for (const fin of puntas) {
    for (let k = 1; k <= 6; k++) {
      const t = k / 6;
      // Se hunde hacia la mano en el medio de cada tramo.
      const hunde = Math.sin(Math.PI * t) * 0.16;
      festones.push([desde[0] + (fin[0] - desde[0]) * t + (mx - (desde[0] + fin[0]) / 2) * hunde, desde[1] + (fin[1] - desde[1]) * t + (my - (desde[1] + fin[1]) / 2) * hunde]);
    }
    desde = fin;
  }
  const ala: P[] = [[hx - lado * 6, hy + 4], [hx, hy - 8], [hx + lado * 60, hy - 38], [hx + lado * 140, my - 2], [mx, my - 10], ...festones, [hx + lado * 12, -120], [hx - lado * 8, -200], [hx - lado * 10, -320]];
  const varillas = puntas
    .slice(1, 3)
    .map((fin, i) => trazo([[mx, my], [mx + (fin[0] - mx) * 0.33, my + (fin[1] - my) * 0.28], [mx + (fin[0] - mx) * 0.66, my + (fin[1] - my) * 0.62], fin], 4, 180 + i, (t) => (1 - t) ** 0.6 * 0.85 + 0.15))
    .join('');
  // Los pliegues que bajan del hombro, finos.
  const caidas = [0.3, 0.62]
    .map((k, i) => {
      const fin = puntas[3]!;
      const x0 = hx + lado * 40 * (1 + k);
      return trazo([[x0, hy - 20 - 30 * k], [x0 + lado * 10, -330], [(x0 + fin[0]) / 2 + lado * 30, -230], [fin[0] + lado * 40 * k, -140]], 2.4, 183 + i, (t) => Math.sin(Math.PI * t) ** 0.7);
    })
    .join('');
  // El brazo: la manga negra del vestido, del hombro a la muñeca, sobre el borde de arriba.
  const brazo: P[] = [[hx - lado * 6, hy - 8], [hx + lado * 60, hy - 44], [mx - lado * 34, my - 20], [mx - lado * 4, my - 16], [mx, my + 6], [mx - lado * 34, my + 10], [hx + lado * 60, hy - 18], [hx + lado * 2, hy + 14]];
  const luzBrazo = tono(0, [{ c: [(hx + mx) / 2, (hy + my) / 2 - 14], r: [140, 7], peso: 0.95, giro: Math.atan2(my - hy, mx - hx) * (180 / Math.PI), blando: 0.8 }]);
  const lineasBrazo = siguiendo([[hx, hy - 8], [hx + lado * 60, hy - 36], [mx - lado * 60, my - 10], [mx - lado * 4, my - 8]], { n: 6, separacion: 2.6, semilla: 185 + lado });
  return (
    `<g filter="url(#gubia)"><path d="${poli(ala)}" fill="${T.rojo}"/><path d="${varillas + caidas}" fill="${T.negro}"/>` +
    // El borde negro: la tela de afuera, que se asoma en el canto del ala.
    `<path d="${trazo([[mx + lado * 8, my + 4], ...festones], 4.5, 188 + lado, () => 1)}" fill="${T.negro}"/></g>` +
    plancha(`dr-brazo-${lado < 0 ? 1 : 2}`, poli(brazo), { negro: T.negro, papel: T.papel, tallas: tallar(lineasBrazo, luzBrazo, { ancho: 2.4, umbral: [0.15, 0.9], punta: 14, semilla: 189 + lado }), caja: cajaDe(brazo) }) +
    mano([mx, my], lado, lado < 0 ? -30 : 30, 190 + lado, 1.5)
  );
}

/**
 * Una mano larga, de dedos flacos y uñas en punta, que agarra algo: el borde de la capa. `giro`
 * apunta los dedos.
 */
function mano([cx, cy]: P, lado: number, giro: number, semilla: number, tam = 1): string {
  const a = (giro * Math.PI) / 180;
  const R = ([x, y]: P): P => [cx + (x * lado * tam) * Math.cos(a) - y * tam * Math.sin(a), cy + (x * lado * tam) * Math.sin(a) + y * tam * Math.cos(a)];
  const enMano = (pts: readonly P[]): P[] => pts.map(R);
  const palma = enMano([[-7, -6], [6, -8], [11, -2], [10, 8], [0, 11], [-8, 7]]);
  const rnd = azar(semilla);
  let dedos = '';
  let unias = '';
  for (let i = 0; i < 4; i++) {
    const y0 = -5 + i * 4.4;
    const largo = 15 + (i === 1 || i === 2 ? 4 : 0) + rnd() * 2;
    // Cada dedo se dobla dos veces sobre lo que agarra.
    const d = enMano([[8, y0], [8 + largo * 0.5, y0 - 2], [8 + largo * 0.8, y0 + 3], [8 + largo * 0.7, y0 + 7]]);
    dedos += trazo(d, 3.6 * tam, semilla + i, (t) => 1 - t * 0.35);
    const punta = d[3]!;
    const atras = R([8 + largo * 0.8, y0 + 3]);
    unias += poli([[atras[0] + tam, atras[1] - tam], [punta[0] + (punta[0] - atras[0]) * 1.5, punta[1] + (punta[1] - atras[1]) * 1.5], [punta[0] + 1.4 * tam, punta[1] - tam]]);
  }
  const pulgar = trazo(enMano([[-6, 6], [-2, 12], [4, 13], [8, 10]]), 3.4 * tam, semilla + 9);
  return (
    `<g filter="url(#gubia)"><path d="${poli(palma)}" fill="${T.papel}"/><path d="${dedos + pulgar}" fill="${T.papel}"/>` +
    `<path d="${trazo(enMano([[-4, -2], [1, 0], [5, 2]]), 1, semilla + 10) + unias}" fill="${T.negro}"/></g>`
  );
}

/** Los dos mechones de adelante, que caen sobre la capa hasta el pecho. */
function pelo(): string {
  const mechon = (lado: number): string => {
    const pts: P[] = [
      C(lado * 34, -12), C(lado * 46, 6), C(lado * 52, 40), C(lado * 54, 80), C(lado * 58, 120), C(lado * 54, 168), C(lado * 48, 176),
      C(lado * 46, 150), C(lado * 42, 178), C(lado * 36, 150), C(lado * 38, 110), C(lado * 36, 70), C(lado * 34, 36), C(lado * 30, 8),
    ];
    const luz = tono(0.12, [
      { c: C(lado * 50, 60), r: [5, 90], peso: lado < 0 ? 0.75 : 0.45, blando: 0.7 },
      { c: C(lado * 40, 20), r: [5, 30], peso: 0.4, blando: 0.8 },
    ]);
    const hebras = siguiendo([C(lado * 38, -8), C(lado * 48, 40), C(lado * 48, 110), C(lado * 46, 170)], { n: 6, separacion: 2.5, abre: 1.3, semilla: 200 + lado, recorta: 0.2 });
    return plancha(`dr-mechon-${lado < 0 ? 1 : 2}`, curva(pts), { negro: T.negro, papel: T.papel, tallas: tallar(hebras, luz, { ancho: 2.3, umbral: [0.12, 0.88], punta: 18, semilla: 203 + lado }), caja: cajaDe(pts) });
  };
  return mechon(-1) + mechon(1);
}

/* ------------------------------------------------------------------
   La prisión de Barbazul: el pasillo de celdas, tallado
   ------------------------------------------------------------------
   Los planos de atrás se tallan con el gris que Rocambole agregó a *Oktubre*, y lo de adelante
   con el blanco: así la drácula, tallada en blanco, se despega de la pared sin un contorno.
*/

const { fuga: [VX, VY], fondo: F, ventana: V, jaula: J } = PRISION;
const ANCHO = 900;
const ALTO = 640;

/** La ventana: el hueco con el arco. */
function hueco(): string {
  return `M${V.x0} ${V.abajo} L${V.x0} ${V.hombro} Q${V.x0} ${V.clave} ${(V.x0 + V.x1) / 2} ${V.clave} Q${V.x1} ${V.clave} ${V.x1} ${V.hombro} L${V.x1} ${V.abajo} Z`;
}

/** La luz que entra por la ventana y cae al piso, con la sombra de cada barrote. */
function luzDeLaVentana(): (x: number, y: number) => number {
  // La luz baja de un punto alto atrás de la ventana: el charco se abre hacia adelante.
  const foco: P = [(V.x0 + V.x1) / 2, F.piso - 240];
  const barrotes = BARROTES.map((x) => Math.atan2(F.piso - foco[1], x - foco[0]));
  return (x, y) => {
    if (y < F.piso) return 0;
    const a = Math.atan2(y - foco[1], x - foco[0]);
    const izq = Math.atan2(F.piso - foco[1], V.x0 - 10 - foco[0]);
    const der = Math.atan2(F.piso - foco[1], V.x1 + 10 - foco[0]);
    if (a > izq || a < der) return 0;
    const borde = Math.min(a - der, izq - a) / 0.05;
    let sombra = 0;
    for (const b of barrotes) sombra = Math.max(sombra, 1 - Math.abs(a - b) / 0.016);
    const lejos = 1 - (y - F.piso) / (ALTO - F.piso + 40);
    return Math.min(1, borde) * (1 - sombra) * (0.2 + 0.38 * lejos);
  };
}

/** Dónde van los barrotes de la ventana. */
const BARROTES = [0, 1, 2, 3, 4, 5, 6].map((i) => V.x0 + ((V.x1 - V.x0) * (i + 0.5)) / 7);

/**
 * Un punto de una pared del costado: `u` va de adelante (0) al fondo (1), `v` del piso (0) al
 * techo (1). `lado` -1 es la de la izquierda.
 */
function enPared(lado: number, u: number, v: number): P {
  const x = lado < 0 ? F.x0 * u : ANCHO - (ANCHO - F.x1) * u;
  const techo = F.techo * u;
  const piso = ALTO - (ALTO - F.piso) * u;
  return [x, piso - (piso - techo) * v];
}

/** Una celda en la pared: el hueco negro, la reja tallada, y el marco. */
function celda(lado: number, u0: number, u1: number, alto: number, tinta: string, semilla: number): string {
  const esquinas = [enPared(lado, u0, 0), enPared(lado, u1, 0), enPared(lado, u1, alto), enPared(lado, u0, alto)];
  const rnd = azar(semilla);
  let barrotes = '';
  const n = Math.round((u1 - u0) * 22);
  for (let i = 1; i < n; i++) {
    const u = u0 + ((u1 - u0) * i) / n;
    const [a, b] = [enPared(lado, u, 0.01), enPared(lado, u, alto - 0.01)];
    const grueso = 2.6 * (1 - u * 0.6) * (0.85 + rnd() * 0.3);
    barrotes += trazo([b, [b[0], (a[1] + b[1]) / 2], a], grueso, semilla + i, () => 1);
  }
  const travesanio = (v: number): string => trazo([enPared(lado, u0, v), enPared(lado, (u0 + u1) / 2, v), enPared(lado, u1, v)], 3 * (1 - u0 * 0.6), semilla + 40 + v * 10, () => 1);
  return (
    `<path d="${poli(esquinas)}" fill="${T.negro}"/>` +
    `<g filter="url(#gubia)"><path d="${barrotes + travesanio(alto * 0.18) + travesanio(alto * 0.82)}" fill="${tinta}"/>` +
    `<path d="${trazo([enPared(lado, u0, 0), enPared(lado, u0, alto), enPared(lado, u1, alto)], 4 * (1 - u0 * 0.6), semilla + 50, () => 1)}" fill="${tinta}"/></g>`
  );
}

/** Una jaulita colgada, de las lindas: la del pajarito del Lavi-rap. */
function jaulita(cx: number, arriba: number, alto: number, ancho: number, semilla: number): string {
  const r = ancho / 2;
  let d = trazo([[cx, 0], [cx + 1, arriba / 2], [cx, arriba - 10]], 1.6, semilla, () => 1);
  // El aro de colgar, la cúpula y los barrotes que bajan de la cúpula.
  d += trazo([[cx - 5, arriba - 8], [cx, arriba - 16], [cx + 5, arriba - 8]], 1.6, semilla + 1, () => 1);
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const x = cx - r + ancho * t;
    const tope = arriba + r * (1 - Math.sin(Math.PI * t)) * 0.9;
    d += trazo([[cx, arriba], [(cx + x) / 2, (arriba + tope) / 2 - 3], [x, tope + 4], [x, arriba + alto]], 1.3, semilla + 2 + i, () => 1);
  }
  d += trazo([[cx - r - 3, arriba + alto], [cx, arriba + alto + 2], [cx + r + 3, arriba + alto]], 3, semilla + 20, () => 1);
  d += trazo([[cx - r, arriba + r * 0.9 + 4], [cx, arriba + r * 0.9 + 5], [cx + r, arriba + r * 0.9 + 4]], 1.4, semilla + 21, () => 1);
  // El palito adentro, donde se para.
  d += trazo([[cx - r + 6, arriba + alto - 16], [cx + r - 6, arriba + alto - 16]], 1.4, semilla + 22, () => 1);
  return `<path d="${d}" fill="${T.papel}" filter="url(#gubia)"/>`;
}

/**
 * El clavo de la pared, al lado de la puerta de Barbazul, donde colgaba el manojo. Está vacío: las
 * llaves las tiene él (`arte-barbazul.ts`), que te recibe en la entrada.
 */
function clavo(cx: number, cy: number, semilla: number): string {
  const d = trazo([[cx - 2.4, cy - 3], [cx, cy - 5], [cx + 2.4, cy - 3]], 2.2, semilla, () => 1) + trazo([[cx, cy - 4], [cx + 0.4, cy + 1], [cx + 3, cy + 3]], 1.8, semilla + 1, () => 1);
  return `<path d="${d}" fill="${T.papel}" filter="url(#gubia)"/>`;
}

/** Lo de atrás de todo: el techo, las paredes, el fondo con la ventana y la calle, y el piso. */
function prisionLejos(): string {
  const todo: readonly [number, number, number, number] = [0, 0, ANCHO, ALTO];
  // La pared del fondo: hiladas de ladrillo, prendidas alrededor de la ventana.
  const luzFondo = tono(0.12, [{ c: [450, 230], r: [230, 190], peso: 0.65, blando: 0.9 }]);
  const hiladas = paralelas([F.x0, F.techo, F.x1 - F.x0, F.piso - F.techo], { angulo: 0, paso: 9, semilla: 301 });
  const fondo: P[] = [[F.x0, F.techo], [F.x1, F.techo], [F.x1, F.piso], [F.x0, F.piso]];
  // Las juntas de los ladrillos: un corte corto cada tanto, corrido una hilada sí y otra no.
  let juntas = '';
  for (let y = F.techo + 4, fila = 0; y < F.piso; y += 9, fila++) {
    for (let x = F.x0 + (fila % 2 ? 0 : 14); x < F.x1; x += 28) {
      if (luzFondo(x, y) < 0.3) continue;
      juntas += trazo([[x, y + 1], [x, y + 7]], 1.4, 302 + x + y, () => 1);
    }
  }
  // El techo y las paredes: cortes que corren hacia el fondo, apagándose.
  const techo: P[] = [[0, 0], [ANCHO, 0], [F.x1, F.techo], [F.x0, F.techo]];
  const izquierda: P[] = [[0, 0], [F.x0, F.techo], [F.x0, F.piso], [0, ALTO]];
  const derecha: P[] = [[ANCHO, 0], [F.x1, F.techo], [F.x1, F.piso], [ANCHO, ALTO]];
  const hacia = (lado: number, n: number, semilla: number): P[][] =>
    Array.from({ length: n }, (_, i) => {
      const v = (i + 0.5) / n;
      return [enPared(lado, 0, v), enPared(lado, 0.5, v + (azar(semilla + i)() - 0.5) * 0.02), enPared(lado, 1, v)];
    });
  const luzParedes = tono(0.06, [
    { c: [F.x0 - 10, 260], r: [90, 200], peso: 0.45, blando: 1 },
    { c: [F.x1 + 10, 260], r: [90, 200], peso: 0.45, blando: 1 },
    // El foco del pasillo prende el arranque de la pared de la izquierda.
    { c: [330, 40], r: [220, 120], peso: 0.3, blando: 1 },
  ]);
  const vigas: P[][] = [-3, -2, -1, 0, 1, 2, 3].map((k) => [[450 + k * 150, 0], [450 + k * 60, F.techo * 0.6], [450 + k * 34, F.techo]]);
  // El piso: baldosas que se achican hacia el fondo, y el charco de luz de la ventana con la sombra de la reja.
  const charco = luzDeLaVentana();
  // El piso gastado: manchas grandes donde la luz agarra más o menos, para que no sea un damero.
  const gastado = (semilla: number): ((x: number, y: number) => number) => {
    const rnd = azar(semilla);
    const manchas = Array.from({ length: 14 }, () => ({ x: rnd() * ANCHO, y: F.piso + rnd() * (ALTO - F.piso), r: 40 + rnd() * 90, p: (rnd() - 0.5) * 0.5 }));
    return (x, y) => manchas.reduce((t, m) => t + m.p * Math.max(0, 1 - Math.hypot(x - m.x, (y - m.y) * 2.2) / m.r), 0);
  };
  const luzPiso = tono(0.06, [charco, gastado(311), { c: [450, ALTO], r: [460, 120], peso: 0.1, blando: 1 }]);
  const filas: P[][] = [];
  for (let k = 0; k < 28; k++) {
    const t = (k + 0.5) / 28;
    const y = F.piso + (ALTO - F.piso) * t ** 1.55;
    const sobra = ((y - F.piso) / (ALTO - F.piso)) * 260;
    filas.push([[F.x0 - sobra - 20, y], [450, y + 0.6], [F.x1 + sobra + 20, y]]);
  }
  const juntasPiso = [-6, -4, -2, 0, 2, 4, 6].map((k) => [[450 + k * 36, F.piso], [450 + k * 130, ALTO + 20]] as P[]);
  // El foco: un cable, la lamparita pelada, y la luz que tira, tallada en rayos.
  const foco: P = [566, 46];
  const rayosDelFoco = rayos(foco, { desde: 0, hasta: 360, n: 30, r0: 12, r1: 74, semilla: 320 });
  const luzDelFoco = tono(0, [{ c: foco, r: [78, 78], peso: 0.7, blando: 1 }]);
  // La calle de Oktubre detrás de la ventana: la tapa misma, sin las banderas, que flamean aparte.
  const { x: tx, y: ty, escala } = PRISION.tapa;
  const lado = 953 * escala;
  return (
    `<rect x="0" y="0" width="${ANCHO}" height="${ALTO}" fill="${T.negro}"/>` +
    `<clipPath id="pr-calle"><path d="${hueco()}"/></clipPath>` +
    `<g clip-path="url(#pr-calle)"><image href="tapa:oktubre-frontal" x="${tx}" y="${ty}" width="${lado}" height="${lado}"/>` +
    `<image href="tapa:oktubre-frontal" x="${tx}" y="${ty}" width="${lado}" height="${lado}" filter="url(#sin-rojo)"/></g>` +
    plancha('pr-fondo', poli(fondo) + hueco(), { negro: T.negro, papel: T.gris, tallas: tallar(hiladas, luzFondo, { ancho: 7.4, umbral: [0.1, 0.95], pulso: 0.6, punta: 20, semilla: 303 }), trazos: juntas, caja: todo, motas: false }) +
    `<path d="${hueco()}" fill="none" stroke="${T.negro}" stroke-width="10"/>` +
    plancha('pr-techo', poli(techo), { negro: T.negro, papel: T.gris, tallas: tallar(vigas, luzDelFoco, { ancho: 6, umbral: [0.05, 0.7], punta: 30, semilla: 304 }), caja: todo, motas: false }) +
    plancha('pr-izq', poli(izquierda), { negro: T.negro, papel: T.gris, tallas: tallar(hacia(-1, 30, 305), luzParedes, { ancho: 7, umbral: [0.05, 0.9], punta: 40, pulso: 0.6, semilla: 306 }), caja: todo, motas: false }) +
    plancha('pr-der', poli(derecha), { negro: T.negro, papel: T.gris, tallas: tallar(hacia(1, 30, 307), luzParedes, { ancho: 7, umbral: [0.05, 0.9], punta: 40, pulso: 0.6, semilla: 308 }), caja: todo, motas: false }) +
    plancha('pr-piso', poli([[0, ALTO], [F.x0, F.piso], [F.x1, F.piso], [ANCHO, ALTO]]), {
      negro: T.negro,
      papel: T.papel,
      tallas: tallar(filas, luzPiso, { ancho: 5.2, umbral: [0.1, 0.95], pulso: 0.85, punta: 22, semilla: 309 }),
      trazos: juntasPiso.map((l, i) => trazo(l, 1.6, 310 + i, () => 1)).join(''),
      caja: todo, motas: false,
    }) +
    // Las celdas: dos de cada lado, la de adelante tallada en blanco y la del fondo en gris.
    celda(-1, 0.14, 0.5, 0.62, T.papel, 330) +
    celda(-1, 0.64, 0.88, 0.66, T.gris, 340) +
    celda(1, 0.64, 0.88, 0.66, T.gris, 350) +
    celda(1, 0.3, 0.56, 0.64, T.gris, 360) +
    // La puerta de Barbazul, a la izquierda de la ventana, con el clavo vacío; la de la guardia, a la derecha.
    // La hoja de la puerta de Barbazul y su cuarto van aparte (`arte-barbazul.ts`): se entreabre.
    `<path d="M262 ${F.piso} L262 262 Q281 246 300 262 L300 ${F.piso} Z" fill="${T.negro}"/>` +
    `<path d="${trazo([[258, F.piso], [258, 260], [281, 240], [304, 260], [304, F.piso]], 3, 370, () => 1)}" fill="${T.gris}" filter="url(#gubia)"/>` +
    clavo(316, 270, 371) +
    `<path d="M604 ${F.piso} L604 262 L640 262 L640 ${F.piso} Z" fill="${T.negro}"/>` +
    `<path d="${trazo([[600, F.piso], [600, 258], [644, 258], [644, F.piso]], 3, 372, () => 1)}" fill="${T.gris}" filter="url(#gubia)"/>` +
    `<path d="${[612, 622, 632].map((x, i) => trazo([[x, 276], [x, 300]], 1.8, 373 + i, () => 1)).join('') + trazo([[608, 276], [636, 276]], 1.8, 377, () => 1) + trazo([[608, 300], [636, 300]], 1.8, 378, () => 1)}" fill="${T.gris}" filter="url(#gubia)"/>` +
    // El foco y la jaulita, colgados del techo.
    // La luz del foco va sobre todo, menos sobre la calle.
    `<clipPath id="pr-sin-calle"><path d="M0 0 H${ANCHO} V${ALTO} H0 Z ${hueco()}" clip-rule="evenodd"/></clipPath>` +
    `<g clip-path="url(#pr-sin-calle)" filter="url(#gubia)"><path d="${tallar(rayosDelFoco, luzDelFoco, { ancho: 1.6, umbral: [0.12, 0.9], punta: 14, semilla: 321 })}" fill="${T.papel}"/></g>` +
    `<path d="${trazo([[foco[0], 0], [foco[0], foco[1] - 10]], 1.6, 322, () => 1) + curva([[foco[0] - 4.5, foco[1] - 4], [foco[0], foco[1] - 10], [foco[0] + 4.5, foco[1] - 4], [foco[0] + 3.6, foco[1] + 3], [foco[0], foco[1] + 6], [foco[0] - 3.6, foco[1] + 3]])}" fill="${T.papel}" filter="url(#gubia)"/>` +
    jaulita(222, 124, 56, 44, 380)
  );
}

/** La reja de la ventana, que va delante de las banderas. */
function prisionReja(): string {
  let d = '';
  for (const [i, x] of BARROTES.entries()) d += trazo([[x, V.clave - 10], [x + 0.6, (V.clave + V.abajo) / 2], [x, V.abajo + 6]], 5.4, 390 + i, () => 1);
  for (const y of [V.hombro + 16, V.abajo - 64]) d += trazo([[V.x0 - 4, y], [450, y + 1], [V.x1 + 4, y]], 5, 398 + y, () => 1);
  // El filo de luz de cada barrote, del lado del foco.
  let filos = '';
  for (const [i, x] of BARROTES.entries()) filos += trazo([[x - 1.6, V.clave + 2], [x - 1.2, (V.clave + V.abajo) / 2], [x - 1.6, V.abajo - 2]], 1.1, 400 + i);
  // El marco de piedra y el alféizar.
  const marco = `M${V.x0 - 14} ${V.abajo + 14} L${V.x0 - 14} ${V.hombro} Q${V.x0 - 14} ${V.clave - 14} ${(V.x0 + V.x1) / 2} ${V.clave - 14} Q${V.x1 + 14} ${V.clave - 14} ${V.x1 + 14} ${V.hombro} L${V.x1 + 14} ${V.abajo + 14} L${V.x1} ${V.abajo + 14} L${V.x1} ${V.hombro} Q${V.x1} ${V.clave} ${(V.x0 + V.x1) / 2} ${V.clave} Q${V.x0} ${V.clave} ${V.x0} ${V.hombro} L${V.x0} ${V.abajo + 14} Z`;
  const dovelas = Array.from({ length: 11 }, (_, i) => {
    const a = Math.PI + (Math.PI * (i + 1)) / 12;
    const [cx, cy, rx, ry] = [(V.x0 + V.x1) / 2, V.hombro, (V.x1 - V.x0) / 2, V.hombro - V.clave];
    return trazo([[cx + Math.cos(a) * rx, cy + Math.sin(a) * ry], [cx + Math.cos(a) * (rx + 14), cy + Math.sin(a) * (ry + 14)]], 1.4, 410 + i, () => 1);
  }).join('');
  return (
    `<path d="${marco}" fill="${T.negro}"/>` +
    `<g filter="url(#gubia)"><path d="${d}" fill="${T.negro}"/><path d="${filos}" fill="${T.gris}"/><path d="${dovelas}" fill="${T.gris}"/>` +
    `<path d="${trazo([[V.x0 - 14, V.abajo + 12], [450, V.abajo + 13], [V.x1 + 14, V.abajo + 12]], 2.4, 420, () => 1)}" fill="${T.gris}"/></g>`
  );
}

/** Una bandera de la tapa: recortada de ahí, solo lo rojo, en el rojo de la tinta. */
function bandera(i: number): string {
  const { poligono } = BANDERAS[i]!;
  const { x: tx, y: ty, escala } = PRISION.tapa;
  const lado = 953 * escala;
  return (
    `<clipPath id="pr-bandera-${i}"><path d="${poli(poligono.map(deLaTapa))}"/></clipPath>` +
    `<g clip-path="url(#pr-bandera-${i})"><image href="tapa:oktubre-frontal" x="${tx}" y="${ty}" width="${lado}" height="${lado}" filter="url(#solo-rojo)"/></g>`
  );
}

/** La jaula vacía de la fiera más fiera: abierta, con la cadena rota y un hueso. Sin la puerta, que es aparte. */
function prisionFrente(): string {
  const { x0, x1, arriba, piso } = J;
  const cx = (x0 + x1) / 2;
  const r = (x1 - x0) / 2;
  let barrotes = '';
  let filos = '';
  for (let i = 0; i <= 9; i++) {
    const t = i / 9;
    const x = x0 + (x1 - x0) * t;
    if (i === 1 || i === 2) continue; // el hueco de la puerta
    const tope = arriba + r * 0.55 * (1 - Math.sin(Math.PI * t));
    barrotes += trazo([[cx, arriba - 6], [(cx + x) / 2, (arriba + tope) / 2 - 8], [x, tope + 10], [x, piso]], 5, 430 + i, () => 1);
    filos += trazo([[x + 1.4, tope + 14], [x + 1.6, (tope + piso) / 2], [x + 1.4, piso - 4]], 1.6, 440 + i);
  }
  for (const y of [arriba + r * 0.55 + 6, piso - 70]) barrotes += trazo([[x0 - 4, y], [cx, y + 1], [x1 + 4, y]], 5, 450 + y, () => 1);
  // El piso de la jaula y la argolla de arriba.
  const base = trazo([[x0 - 10, piso], [cx, piso + 1], [x1 + 10, piso]], 12, 460, () => 1);
  const argolla: P[] = [];
  for (let k = 0; k <= 16; k++) argolla.push([cx + Math.cos((k / 16) * Math.PI * 2) * 8, arriba - 14 + Math.sin((k / 16) * Math.PI * 2) * 8]);
  // Adentro: la cadena rota, tirada, y un hueso roído.
  const cadena = Array.from({ length: 6 }, (_, i) => {
    const [x, y] = [x1 - 24 - i * 13, piso - 6 - Math.sin(i * 0.9) * 4];
    return `M${x - 6} ${y} a6 3.6 ${i % 2 ? 20 : -20} 1 0 12 0 a6 3.6 ${i % 2 ? 20 : -20} 1 0 -12 0 Z`;
  }).join('');
  const hueso = trazo([[cx - 22, piso - 10], [cx - 4, piso - 14], [cx + 14, piso - 12]], 5, 470, () => 1) + `M${cx - 26} ${piso - 10} a4 4 0 1 0 8 -3 a4 4 0 1 0 -8 3 Z M${cx + 12} ${piso - 12} a4 4 0 1 0 8 -1 a4 4 0 1 0 -8 1 Z`;
  // La columna de adelante a la izquierda, con una cadena colgando.
  const columna: P[] = [[0, 0], [34, 0], [30, ALTO], [0, ALTO]];
  const luzColumna = tono(0, [{ c: [30, 320], r: [8, 340], peso: 0.7, blando: 0.8 }]);
  const colgando = Array.from({ length: 9 }, (_, i) => `M${44} ${i * 15 - 2} a3.4 7 ${i % 2 ? 0 : 90} 1 0 0.1 0 Z`).join('');
  return (
    `<g filter="url(#gubia)"><path d="${barrotes + base}" fill="${T.papel}"/><path d="${filos}" fill="${T.negro}"/>` +
    `<path d="${trazo(argolla, 2.6, 461, () => 1)}" fill="${T.papel}"/>` +
    `<path d="${cadena}" fill="none" stroke="${T.papel}" stroke-width="1.8"/><path d="${hueso}" fill="${T.papel}"/></g>` +
    plancha('pr-columna', poli(columna), { negro: T.negro, papel: T.papel, tallas: tallar(siguiendo([[24, 0], [26, 200], [26, 420], [24, ALTO]], { n: 5, separacion: 3, semilla: 480 }), luzColumna, { ancho: 2.4, umbral: [0.1, 0.9], punta: 30, semilla: 481 }), caja: [0, 0, 60, ALTO] }) +
    `<path d="${colgando}" fill="none" stroke="${T.papel}" stroke-width="2" filter="url(#gubia)"/>`
  );
}

/** La puerta de la jaula, abierta: gira en su bisagra, del lado de adentro de la jaula. */
function puertaDeJaula(): string {
  const { x, arriba, abajo, ancho } = J.puerta;
  let d = '';
  for (let i = 0; i <= 3; i++) d += trazo([[x - (ancho * i) / 3, arriba], [x - (ancho * i) / 3, abajo]], 4.4, 490 + i, () => 1);
  for (const y of [arriba, (arriba + abajo) / 2, abajo]) d += trazo([[x + 2, y], [x - ancho - 2, y]], 4.4, 495 + y, () => 1);
  return `<g filter="url(#gubia)"><path d="${d}" fill="${T.papel}"/><path d="${trazo([[x - ancho + 1.4, arriba + 6], [x - ancho + 1.6, abajo - 6]], 1.4, 499)}" fill="${T.negro}"/></g>`;
}

/* ------------------------------------------------------------------
   Las piezas
   ------------------------------------------------------------------ */

const [MX, MY] = A.mano;
const [PX, PY] = A.punta;

export const PIEZAS_DRACULA: readonly Pieza[] = [
  { nombre: 'dracula-capa-atras', caja: [-158, -606, 316, 506], dibujo: cuelloDeCapa(), densidad: 2 },
  { nombre: 'dracula-pierna-1', caja: [-38, -262, 44, 268], dibujo: pierna(-1), densidad: 3 },
  { nombre: 'dracula-pierna-2', caja: [-6, -262, 44, 268], dibujo: pierna(1), densidad: 3 },
  { nombre: 'dracula-cuerpo', caja: cajaDe(VESTIDO, 6), dibujo: cuerpo(), densidad: 2.5 },
  { nombre: 'dracula-forro-1', caja: [-PX - 52, PY - 50, PX - 8, -96 - PY + 50], dibujo: forro(-1), densidad: 2 },
  { nombre: 'dracula-forro-2', caja: [60, PY - 50, PX - 8, -96 - PY + 50], dibujo: forro(1), densidad: 2 },
  { nombre: 'dracula-capa-1', caja: cajaDe(MITAD_CAPA(-1), 6), dibujo: capa(-1), densidad: 2 },
  { nombre: 'dracula-capa-2', caja: cajaDe(MITAD_CAPA(1), 6), dibujo: capa(1), densidad: 2 },
  { nombre: 'dracula-mano', caja: [MX - 40, MY - 36, 80, 72], dibujo: mano([MX, MY], 1, 8, 230, 1.45), densidad: 4 },
  { nombre: 'dracula-pelo', caja: cajaDe([C(-60, -16), C(60, 182)], 4), dibujo: pelo(), densidad: 3 },
  { nombre: 'dracula-boca', caja: cajaDe([C(-17, BOCA_Y - 4), C(17, BOCA_Y + 15)], 2), dibujo: boca(), densidad: 4 },
  { nombre: 'dracula-mandibula', caja: cajaDe(QUIJADA, 4), dibujo: mandibula(), densidad: 4 },
  { nombre: 'dracula-cabeza', caja: cajaDe(PELO_ATRAS, 8), dibujo: cabeza(), densidad: 4 },
];

const { puerta: PJ } = PRISION.jaula;

export const PIEZAS_PRISION: readonly Pieza[] = [
  { nombre: 'prision-lejos', caja: [0, 0, ANCHO, ALTO], dibujo: prisionLejos(), opaca: true, densidad: 1.7, calidad: 72 },
  ...BANDERAS.map((b, i): Pieza => ({ nombre: `prision-bandera-${i + 1}`, caja: cajaDe(b.poligono.map(deLaTapa), 2), dibujo: bandera(i), densidad: 3 })),
  { nombre: 'prision-reja', caja: [V.x0 - 22, V.clave - 26, V.x1 - V.x0 + 44, V.abajo - V.clave + 48], dibujo: prisionReja(), densidad: 2 },
  { nombre: 'prision-columna', caja: [0, 0, 64, ALTO], dibujo: prisionFrente(), densidad: 2 },
  { nombre: 'prision-jaula', caja: [J.x0 - 16, J.arriba - 30, J.x1 - J.x0 + 32, ALTO - J.arriba + 30], dibujo: prisionFrente(), densidad: 2 },
  { nombre: 'prision-puerta', caja: [PJ.x - PJ.ancho - 8, PJ.arriba - 8, PJ.ancho + 16, PJ.abajo - PJ.arriba + 16], dibujo: puertaDeJaula(), densidad: 2 },
  ...PIEZAS_DRACULA,
];
