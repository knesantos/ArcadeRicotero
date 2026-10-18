/**
 * Barbazul, el dueño de la prisión (`D-73`, décima vuelta).
 *
 * Pedido del usuario, textual, el de las dos vueltas anteriores: *"Agrega otro personaje y pulilo
 * a fondo, se creativo que qeude como uno de rocambole."* Barbazul sale de *"Barbazul versus el
 * amor letal"* (*Gulp!*), pero vive en su prisión, que viste *Oktubre* (`D-19`): está tallado en
 * la misma madera que su casa (`grabado.ts`), y la vara es **el barbudo de la contratapa de
 * *Oktubre***, el del pelo largo partido al medio, las cuencas hondas y las hebras a gubia.
 *
 * **La barba es otra plancha.** En la prisión no hay más color que el rojo de las banderas. La
 * barba de Barbazul se imprime aparte, entintada de azul, y entra corrida de registro, como
 * cuando una prensa a mano no calza las dos tintas: lo tallado de la barba sale azul, y del lado
 * donde la plancha se corrió asoma un filo azul afuera del negro y un filo de papel adentro. Es
 * el mismo error de imprenta que las letras de *Gulp!* (`corrido`, en `pincel.ts`), hecho con
 * gubia.
 *
 * Está en coordenadas de títere: el (0, 0) es el piso entre los dos zapatos, y arriba es
 * negativo. La luz le viene de arriba a la derecha, del foco del pasillo, y la mitad de la
 * izquierda queda en lo negro.
 */

import { type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';
import { cajaDe, curva, poli } from './arte-prision.ts';
import { bola, cubica, envolventes, paralelas, picado, plancha, rayos, siguiendo, tallar, tono, trazo, type Mancha, type P } from './grabado.ts';
import { BARBAZUL_ARMADO as A, PUERTA_DE_BARBAZUL as PB } from './rig.ts';

const T = {
  negro: 'var(--fondo)',
  papel: 'var(--bestia-dracula-papel)',
  gris: 'var(--disco-oktubre-apoyo)',
  rojo: 'var(--disco-oktubre-tinta)',
  azul: 'var(--bestia-barbazul-azul)',
};

/** De dónde le viene la luz: arriba a la derecha (el foco del pasillo), y de frente. */
const LUZ: readonly [number, number, number] = [0.55, -0.6, 0.72];

/** Cuánto se corrió la plancha del azul: a la derecha y apenas para abajo, para que el error quede en el costado de la barba y no en la cara. */
const REGISTRO: P = [3.8, 1.4];

const suave = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
/** La luz apretada: en *Oktubre* casi no hay medio tono. */
const apretada = (luz: (x: number, y: number) => number) => (x: number, y: number): number => suave((luz(x, y) - 0.22) / 0.5);

/* ------------------------------------------------------------------
   La cabeza: la cara angosta, las cuencas, el pelo largo partido al medio
   ------------------------------------------------------------------ */

const [FX, FY] = A.cara;
const C = (x: number, y: number): P => [FX + x, FY + y];
const K = A.agranda;
/** La cabeza y la barba se dibujan a su medida y se agrandan desde la cara (`agranda`). */
const agrandada = (dibujo: string): string => `<g transform="translate(${FX} ${FY}) scale(${K}) translate(${-FX} ${-FY})">${dibujo}</g>`;
const aLaMedida = ([x, y]: P): P => [FX + (x - FX) * K, FY + (y - FY) * K];
/** Los ojos de `rig.ts` están agrandados: acá se dibujan a la medida de la cabeza. */
const OJOS = A.ojos.map((o) => ({ centro: [FX + (o.centro[0] - FX) / K, FY + (o.centro[1] - FY) / K] as P, radio: [o.radio[0] / K, o.radio[1] / K] as P }));

/** La piel de la cara: la frente alta, la sien, el pómulo, y abajo se la tapa la barba. */
const CARA: readonly P[] = [
  C(0, -58), C(-17, -56), C(-32, -48), C(-40, -30), C(-43, -8), C(-43, 14), C(-40, 34), C(-33, 50), C(-20, 60), C(0, 64),
  C(20, 60), C(33, 50), C(40, 34), C(43, 14), C(43, -8), C(40, -30), C(32, -48), C(17, -56),
];

/**
 * El pelo: la masa negra partida al medio, que cae lacia y despareja hasta pasar los hombros,
 * como el barbudo de la contratapa. Atrás de la cara y de la barba.
 */
const PELO: readonly P[] = [
  C(0, -76), C(-12, -79), C(-32, -74), C(-50, -58), C(-60, -32), C(-64, 4), C(-68, 44), C(-74, 84), C(-84, 120), C(-74, 116),
  C(-72, 132), C(-62, 112), C(-58, 126), C(-50, 100), C(-46, 66), C(-42, 40), C(-30, 30), C(0, 36), C(30, 30), C(42, 40), C(46, 66),
  C(50, 100), C(58, 126), C(62, 112), C(72, 132), C(74, 116), C(84, 120), C(74, 84), C(68, 44), C(64, 4), C(60, -32), C(50, -58),
  C(32, -74), C(12, -79),
];

/** La luz de la cara: el elipsoide de frente, y lo que se talló encima. */
function luzDeCara(): (x: number, y: number) => number {
  const m = (x: number, y: number, rx: number, ry: number, peso: number, giro = 0, blando = 0.7): Mancha => ({ c: C(x, y), r: [rx, ry], peso, giro, blando });
  return tono(0.02, [
    bola(C(3, -2), [44, 62], LUZ, 1.12),
    // La frente alta, un plano de luz, y el filo del puente de la nariz, del lado del foco.
    m(8, -36, 26, 14, 0.25),
    m(3.5, 0, 4.2, 18, 0.55, 0, 0.75),
    // Las cuencas, hondas: el ojo vive en lo negro. Y el ceño, que se junta entre las cejas.
    m(0, -18, 5, 7, -0.45, 0, 0.9),
    m(-19, -10, 14, 10, -1.2, 8, 0.45),
    m(19, -10, 13, 9.5, -0.95, -8, 0.5),
    // Los pómulos altos, y el cachete chupado debajo, que se mete en la barba.
    m(25, 8, 12, 6, 0.4, 22, 0.8),
    m(-25, 8, 11, 5.5, 0.12, -22, 0.8),
    m(29, 26, 10, 13, -0.6, 10),
    m(-29, 26, 11, 14, -0.7, -10),
    // El costado de la nariz que no ve el foco, y la sombra que tira hacia la boca.
    m(-5, 4, 3.4, 13, -0.65, 6, 0.6),
    m(-3, 22, 8, 3, -0.6),
    // La mitad de la izquierda, en lo negro.
    m(-34, -6, 12, 40, -0.45, -4, 0.85),
  ]);
}

/** Un ojo: el blanco almendrado, hundido en su cuenca, con la bolsa tallada abajo. Sin pupila: la pone la página. */
function ojo(n: number, semilla: number): { blancos: string; trazos: string } {
  const { centro: [cx, cy], radio: [rx, ry] } = OJOS[n]!;
  const lado = n === 0 ? -1 : 1;
  const r = (v: number): number => Math.round(v * 10) / 10;
  const almendra: P[] = [];
  for (let k = 0; k < 28; k++) {
    const a = (k / 28) * Math.PI * 2;
    const s = Math.sin(a);
    const x = Math.cos(a) * rx;
    // Arriba, el arco del párpado; abajo, casi recto. La punta de afuera cae un poco.
    const y = s < 0 ? s * ry * 1.05 : s * ry * 0.6;
    almendra.push([cx + x, cy + y + (x * lado > 0 ? (x * lado) / rx : 0) * 1.2]);
  }
  const d = `M${almendra.map(([x, y]) => `${r(x)} ${r(y)}`).join('L')}Z`;
  return {
    blancos:
      d +
      // La bolsa debajo del ojo, tallada en dos cortes, como el barbudo de la contratapa.
      trazo(cubica([[cx - rx * 0.9, cy + ry * 1.8], [cx - rx * 0.3, cy + ry * 2.9], [cx + rx * 0.5, cy + ry * 2.8], [cx + rx * 1.1, cy + ry * 1.5]]), 1.3, semilla) +
      trazo(cubica([[cx - rx * 0.6, cy + ry * 3.2], [cx - rx * 0.1, cy + ry * 4], [cx + rx * 0.5, cy + ry * 3.9], [cx + rx * 0.9, cy + ry * 3]]), 0.9, semilla + 1),
    trazos:
      // El párpado de arriba, grueso y pesado, que se va en punta para afuera.
      trazo(
        cubica([[cx - rx * 1.2, cy + 0.6], [cx - rx * 0.5, cy - ry * 1.6], [cx + rx * 0.45, cy - ry * 1.7], [cx + rx * 1.3, cy + 0.4]]),
        2.6,
        semilla + 3,
        (t) => Math.sin(Math.PI * Math.min(1, t * 1.08)) ** 0.45,
      ),
  };
}

function cabeza(): string {
  const luz = apretada(luzDeCara());
  const arriba = (x: number, y: number): number => (y < FY - 14 ? luz(x, y) : y < FY - 6 ? luz(x, y) * ((FY - 6 - y) / 8) : 0);
  const abajo = (x: number, y: number): number => (y > FY - 6 ? luz(x, y) : y > FY - 14 ? luz(x, y) * ((y - FY + 14) / 8) : 0);
  // La frente, con cortes que dan la vuelta; los cachetes, con cortes que bajan hacia la barba.
  const frente = envolventes(C(0, -8), [44, 60], { paso: 3, comba: 0.14, desde: -1, hasta: -0.1, semilla: 503 });
  const costado = (x: number): number => suave((Math.abs(x - FX) - 13) / 8);
  const cachetes = [
    ...siguiendo([C(-32, -16), C(-41, 8), C(-35, 32), C(-20, 56)], { n: 12, separacion: 2.7, abre: 1.1, semilla: 505 }),
    ...siguiendo([C(32, -16), C(41, 8), C(35, 32), C(20, 56)], { n: 12, separacion: 2.7, abre: 1.1, semilla: 506 }),
  ];
  const medio = envolventes(C(0, 8), [40, 50], { paso: 3, comba: 0.26, desde: -0.2, hasta: 1, semilla: 507 });
  const puente = siguiendo([C(1.5, -16), C(2.5, -4), C(3.5, 8), C(3, 18)], { n: 5, separacion: 2.1, semilla: 508 });
  const tallas =
    tallar(frente, arriba, { ancho: 4, umbral: [0.15, 0.85], semilla: 511 }) +
    tallar(cachetes, (x, y) => abajo(x, y) * costado(x), { ancho: 4, umbral: [0.15, 0.85], semilla: 512 }) +
    tallar(medio, (x, y) => abajo(x, y) * (1 - costado(x)), { ancho: 3.9, umbral: [0.15, 0.85], semilla: 515 }) +
    tallar(puente, luz, { ancho: 2.6, umbral: [0.3, 0.8], semilla: 514 });
  const grano = picado(cajaDe(CARA, 0), luz, { rango: [0.2, 0.5], densidad: 7, angulo: 110, semilla: 513 });
  const [o1, o2] = [ojo(0, 521), ojo(1, 531)];
  // Las cejas: tupidas, bajas, que se juntan en el ceño. Lo negro que la gubia no tocó.
  const ceja = (lado: number, semilla: number): string =>
    trazo(cubica([C(lado * 4, -19), C(lado * 13, -27), C(lado * 25, -28), C(lado * 36, -21)]), 4.6, semilla, (t) => Math.sin(Math.PI * (0.15 + t * 0.85)) ** 0.3 * (1 - t * 0.35)) +
    // Y los pelos sueltos de la ceja, tallados en blanco del lado del foco.
    (lado > 0 ? trazo(cubica([C(9, -27), C(16, -30), C(24, -31), C(32, -27)]), 0.9, semilla + 1) : '');
  // La nariz: larga y recta, el filo de luz del lado del foco, la punta y las aletas negras.
  const nariz = trazo(cubica([C(1.5, -12), C(3.5, -2), C(5, 9), C(4, 17)]), 1.9, 551) + trazo(cubica([C(-4, 20), C(-1, 22.5), C(3, 22.5), C(6, 20)]), 1.2, 552);
  const aletas = trazo(cubica([C(-9, 15), C(-10, 20), C(-7, 22), C(-3, 21)]), 2.8, 553) + trazo(cubica([C(4, 21), C(7, 22), C(10, 20), C(9, 15)]), 2.4, 554);
  // Las arrugas de la frente, largas, como las del barbudo: tres cortes negros que cruzan lo blanco.
  const arrugas = [-44, -39, -34].map((y, i) => trazo(cubica([C(-22, y + 2), C(-8, y - 1.5), C(8, y - 1.5), C(26, y + 2)]), 1.4 - i * 0.2, 560 + i)).join('');
  // El pelo: hebras largas que bajan desde la raya del medio. Prendidas del lado del foco y en
  // la coronilla; del otro lado, casi negras.
  const hebras = [
    ...siguiendo([C(-2, -77), C(-34, -72), C(-58, -36), C(-66, 50)], { n: 15, separacion: 2.5, abre: 1.7, semilla: 563, recorta: 0.15 }),
    ...siguiendo([C(2, -77), C(34, -72), C(58, -36), C(66, 50)], { n: 15, separacion: 2.5, abre: 1.7, semilla: 564, recorta: 0.15 }),
    ...siguiendo([C(-50, -10), C(-60, 40), C(-70, 84), C(-78, 124)], { n: 8, separacion: 2.8, abre: 1.4, semilla: 565, recorta: 0.2 }),
    ...siguiendo([C(50, -10), C(60, 40), C(70, 84), C(78, 124)], { n: 8, separacion: 2.8, abre: 1.4, semilla: 566, recorta: 0.2 }),
  ];
  const luzPelo = tono(0.2, [
    { c: C(16, -62), r: [30, 13], peso: 1, giro: 20, blando: 0.85 },
    { c: C(-20, -64), r: [18, 8], peso: 0.45, giro: -20, blando: 0.85 },
    // La caída del lado del foco, prendida; la otra, apenas un canto.
    { c: C(62, 40), r: [9, 80], peso: 0.85, blando: 0.65 },
    { c: C(-60, 30), r: [9, 80], peso: 0.45, giro: 4, blando: 0.8 },
    // Las hebras se juntan en mechones: franjas de luz y de sombra a lo largo de la caída.
    (x) => 0.2 * Math.sin((x - FX) / 4.2),
    { c: C(74, 110), r: [10, 20], peso: 0.5, blando: 0.8 },
  ]);
  return agrandada(
    plancha('bb-pelo', curva(PELO), { negro: T.negro, papel: T.papel, tallas: tallar(hebras, luzPelo, { ancho: 2.4, umbral: [0.12, 0.88], punta: 16, semilla: 567 }), caja: cajaDe(PELO, 4) }) +
    plancha('bb-cara', curva(CARA), {
      negro: T.negro,
      papel: T.papel,
      tallas: tallas + grano,
      blancos: o1.blancos + o2.blancos + nariz,
      trazos: o1.trazos + o2.trazos + ceja(-1, 541) + ceja(1, 543) + aletas + arrugas,
      caja: cajaDe(CARA),
    }),
  );
}

/* ------------------------------------------------------------------
   La barba: la segunda plancha, en azul, corrida de registro
   ------------------------------------------------------------------ */

/**
 * La barba con el bigote: arranca en las patillas, tapa la boca y la quijada, y baja larga hasta
 * la cintura, partida en dos puntas.
 */
export const BARBA: readonly P[] = [
  C(0, 18), C(-8, 19), C(-22, 23), C(-34, 18), C(-40, 8), C(-49, 26), C(-58, 60), C(-60, 104), C(-54, 146), C(-42, 182), C(-28, 210),
  C(-16, 240), C(-7, 222), C(0, 206), C(6, 222), C(14, 234), C(26, 206), C(40, 176), C(52, 140), C(59, 102), C(58, 60), C(49, 26), C(40, 8),
  C(34, 18), C(22, 23), C(8, 19),
];

function barba(): string {
  const silueta = curva(BARBA);
  const luz = apretada(
    tono(0.46, [
      bola(C(6, 92), [60, 150], LUZ, 0.6),
      // El bigote, prendido arriba; abajo de él, la sombra que tira sobre la barba.
      { c: C(12, 26), r: [20, 7], peso: 0.45, giro: 12, blando: 0.75 },
      { c: C(0, 41), r: [18, 4], peso: -0.6, blando: 0.6 },
      // El mechón del medio, más claro, y la mitad de la izquierda en lo negro.
      { c: C(2, 150), r: [12, 70], peso: 0.25, blando: 0.8 },
      { c: C(-44, 80), r: [18, 90], peso: -0.3, blando: 0.85 },
      // Las ondas de la barba: franjas que la cruzan, donde las hebras se juntan y se abren.
      (x, y) => 0.16 * Math.sin((y - FY) / 15 + (x - FX) / 40),
      // Y los mechones: entre hebra y hebra queda el negro, como en las hebras del barbudo.
      (x, y) => 0.22 * Math.sin((x - FX) / 3.1 + (y - FY) / 60),
    ]),
  );
  const hebras = [
    // El bigote: dos alas que caen desde la nariz hasta perderse en la barba.
    ...siguiendo([C(-2, 22), C(-14, 25), C(-28, 30), C(-40, 48)], { n: 5, separacion: 1.8, abre: 1.5, semilla: 601 }),
    ...siguiendo([C(2, 22), C(14, 25), C(28, 30), C(40, 48)], { n: 5, separacion: 1.8, abre: 1.5, semilla: 602 }),
    // La barba: tres caídas largas, que se ondulan un poco y se juntan en las puntas.
    ...siguiendo([C(-42, 4), C(-62, 70), C(-48, 152), C(-16, 236)], { n: 13, separacion: 2.7, abre: 0.7, semilla: 603, recorta: 0.12 }),
    ...siguiendo([C(-8, 44), C(-16, 110), C(-2, 172), C(-6, 228)], { n: 11, separacion: 2.6, abre: 0.8, semilla: 604, recorta: 0.15 }),
    ...siguiendo([C(42, 4), C(62, 70), C(50, 150), C(14, 232)], { n: 13, separacion: 2.7, abre: 0.7, semilla: 605, recorta: 0.12 }),
  ];
  const tallas = tallar(hebras, luz, { ancho: 2.1, umbral: [0.12, 0.9], punta: 14, pulso: 0.6, semilla: 607 });
  // La boca: el hueco negro entre el bigote y la barba, que la gubia no tocó.
  const boca = trazo(cubica([C(-12, 40), C(-5, 43), C(5, 43), C(12, 40)]), 2.6, 609);
  const [rx, ry] = REGISTRO;
  return agrandada(
    // El azul que se salió del negro, del lado donde se corrió la plancha.
    `<path d="${silueta}" transform="translate(${rx} ${ry})" fill="${T.azul}" filter="url(#gubia)"/>` +
    plancha('bb-barba', silueta, { negro: T.negro, papel: T.papel, tallas, trazos: boca, caja: cajaDe(BARBA, 4) }) +
    // Lo tallado, entintado de azul donde la plancha del azul lo agarra; del otro lado queda papel.
    `<clipPath id="bb-azul"><path d="${silueta}" transform="translate(${rx} ${ry})"/></clipPath>` +
    `<g clip-path="url(#bb-barba)"><g clip-path="url(#bb-azul)"><path d="${tallas}" fill="${T.azul}" filter="url(#gubia)"/></g></g>`,
  );
}

/* ------------------------------------------------------------------
   La levita: el cuello alto, las solapas, los botones y los zapatos
   ------------------------------------------------------------------ */

export const LEVITA: readonly P[] = [
  [-26, -474], [-46, -464], [-74, -454], [-92, -442], [-102, -424], [-104, -380], [-100, -330], [-94, -300], [-98, -280], [-108, -200], [-118, -100],
  [-126, -24], [-132, -12], [-100, -16], [-66, -9], [-32, -13], [0, -10], [32, -13], [66, -9], [100, -16], [132, -12], [126, -24], [118, -100],
  [108, -200], [98, -280], [94, -300], [100, -330], [104, -380], [102, -424], [92, -442], [74, -454], [46, -464], [26, -474],
];

/** Un zapato de punta, negro, con el filo de luz del empeine. */
function zapato(lado: number): { negro: string; luz: string } {
  const X = (x: number): number => lado * x;
  return {
    negro: curva([[X(8), -16], [X(36), -18], [X(44), -10], [X(62), -3], [X(64), 1], [X(30), 2], [X(10), 0]]),
    luz: trazo([[X(lado > 0 ? 18 : 22), -13], [X(36), -12], [X(50), -6], [X(62), -1]], lado > 0 ? 2.4 : 1.2, 620 + lado),
  };
}

function levita(): string {
  const luz = tono(0, [
    // El pecho, del lado del foco; el filo del costado derecho; el faldón, que se abre en pliegues.
    bola([30, -384], [64, 84], LUZ, 0.8),
    { c: [98, -230], r: [8, 210], peso: 0.7, blando: 0.6 },
    { c: [-98, -230], r: [6, 170], peso: 0.3, blando: 0.7 },
    (x, y) => (y > -290 ? (0.5 + 0.5 * Math.cos((x - 4) / 7.5)) ** 4 * (0.25 + 0.6 * suave((x + 60) / 160)) * suave((y + 290) / 90) : 0),
  ]);
  const pliegues = [
    // El pecho: cortes que bajan de la solapa, abiertos, del lado del foco.
    ...siguiendo([[34, -452], [52, -410], [56, -360], [50, -306]], { n: 9, separacion: 3.6, abre: 1.3, semilla: 633 }),
    ...siguiendo([[-36, -452], [-52, -410], [-56, -360], [-50, -306]], { n: 6, separacion: 3.6, abre: 1.3, semilla: 629 }),
    // El faldón, en caídas que se abren hacia el ruedo.
    ...siguiendo([[54, -290], [66, -200], [80, -100], [92, -14]], { n: 10, separacion: 7, abre: 1.5, semilla: 631 }),
    ...siguiendo([[-50, -290], [-64, -200], [-78, -100], [-90, -14]], { n: 8, separacion: 7, abre: 1.5, semilla: 632 }),
  ];
  // Las solapas: dos filos blancos del cuello a la cintura, y la camisa que asoma en la V.
  const solapas =
    trazo(cubica([[-24, -472], [-40, -420], [-36, -350], [-12, -300]]), 2.2, 634) +
    trazo(cubica([[24, -472], [40, -420], [36, -350], [12, -300]]), 3.2, 635) +
    trazo(cubica([[-26, -474], [-56, -470], [-80, -456], [-94, -440]]), 1.4, 636) +
    trazo(cubica([[26, -474], [56, -470], [80, -456], [94, -440]]), 2.6, 637);
  const camisa = poli([[-20, -470], [20, -470], [14, -400], [0, -380], [-14, -400]]);
  // La costura de la cintura, que ciñe, y las tapas de los bolsillos.
  const cintura = trazo([[-96, -298], [-40, -292], [0, -294], [40, -292], [96, -298]], 1.8, 641, (t) => 0.4 + 0.6 * t);
  const bolsillos = trazo([[-86, -238], [-62, -236], [-40, -238]], 1.4, 642) + trazo([[40, -238], [64, -236], [88, -240]], 2.4, 643);
  // Cruzada: dos filas de botones, tallados como cabezas de clavo, y el cierre que baja al ruedo.
  let botones = '';
  for (const y of [-354, -326, -278, -248]) {
    for (const x of [-18, 20]) {
      const r = x > 0 ? 3.8 : 3;
      botones += `M${x - r} ${y} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
    }
  }
  const cierre = trazo([[4, -296], [5, -200], [6, -100], [8, -12]], 2, 638, (t) => 0.5 + 0.5 * Math.sin(Math.PI * t));
  const ruedo = trazo([[-130, -12], [-66, -8], [0, -9], [66, -8], [130, -12]], 2.2, 639);
  const [z1, z2] = [zapato(-1), zapato(1)];
  return (
    `<path d="${z1.negro + z2.negro}" fill="${T.negro}" filter="url(#gubia)"/><path d="${z1.luz + z2.luz}" fill="${T.papel}" filter="url(#gubia)"/>` +
    plancha('bb-levita', poli(LEVITA), {
      negro: T.negro,
      papel: T.papel,
      tallas: tallar(pliegues, luz, { ancho: 3.4, umbral: [0.16, 0.9], punta: 26, pulso: 0.55, semilla: 640 }),
      blancos: camisa + solapas + cierre + ruedo + cintura + bolsillos,
      brillos: botones,
      caja: cajaDe(LEVITA, 4),
    })
  );
}

/* ------------------------------------------------------------------
   Los brazos: las mangas, los puños de la camisa y las manos
   ------------------------------------------------------------------ */

/** Una manga de un punto a otro, con su ancho en cada punta. */
function manga(a: P, b: P, anchoA: number, anchoB: number): P[] {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const l = Math.hypot(dx, dy) || 1;
  const [nx, ny] = [-dy / l, dx / l];
  const pts: P[] = [];
  // La punta de arriba, redonda (el hombro, el codo): media vuelta.
  for (let k = 0; k <= 8; k++) {
    const t = Math.PI * (k / 8);
    pts.push([a[0] + nx * (anchoA / 2) * Math.cos(t) - (dx / l) * (anchoA / 2) * Math.sin(t) * 0.7, a[1] + ny * (anchoA / 2) * Math.cos(t) - (dy / l) * (anchoA / 2) * Math.sin(t) * 0.7]);
  }
  pts.push([b[0] - nx * (anchoB / 2), b[1] - ny * (anchoB / 2)], [b[0] + nx * (anchoB / 2), b[1] + ny * (anchoB / 2)]);
  return pts;
}

/** El tramo de arriba del brazo: del hombro al codo. */
function brazo(n: 0 | 1): { dibujo: string; contorno: P[] } {
  const lado = n === 0 ? -1 : 1;
  const [h, c] = [A.hombros[n], A.codos[n]];
  const contorno = manga(h, c, 46, 36);
  const luz = tono(0, [
    { c: [(h[0] + c[0]) / 2 + lado * 13, (h[1] + c[1]) / 2], r: [9, 80], peso: lado > 0 ? 1 : 0.55, blando: 0.6 },
    bola([h[0] + lado * 6, h[1] + 10], [24, 24], LUZ, lado > 0 ? 0.9 : 0.45),
  ]);
  const lineas = siguiendo([[h[0], h[1] - 8], [h[0] + lado * 4, h[1] + 40], [c[0] - lado * 2, c[1] - 40], [c[0], c[1] + 4]], { n: 11, separacion: 3.6, semilla: 650 + n });
  return {
    contorno,
    dibujo: plancha(`bb-brazo-${n + 1}`, poli(contorno), { negro: T.negro, papel: T.papel, tallas: tallar(lineas, luz, { ancho: 2.8, umbral: [0.15, 0.9], punta: 18, semilla: 652 + n }), caja: cajaDe(contorno) }),
  };
}

/** Una mano que cuelga abierta: la palma, los dedos largos hacia abajo, los nudillos tallados. */
function manoAbierta([cx, cy]: P, lado: number, semilla: number): string {
  const rnd = azar(semilla);
  const palma = curva([[cx - 13, cy - 24], [cx + 13, cy - 24], [cx + 15, cy - 6], [cx + 12, cy + 6], [cx - 12, cy + 6], [cx - 15, cy - 8]]);
  let dedos = '';
  let nudillos = '';
  for (let i = 0; i < 4; i++) {
    const x = cx - 10.5 + i * 7 + (rnd() - 0.5);
    const largo = 22 + (i === 1 || i === 2 ? 5 : 0) + rnd() * 2;
    // Los dedos se cierran un poco hacia adentro, como una mano que espera.
    const d: P[] = [[x, cy + 2], [x + lado * 0.5, cy + largo * 0.45], [x + lado * 1.5, cy + largo * 0.8], [x + lado * 3, cy + largo]];
    dedos += trazo(d, 5.4, semilla + i, (t) => 1 - t * 0.3);
    nudillos += trazo([[x - 2, cy + largo * 0.42], [x + 2, cy + largo * 0.44]], 1, semilla + 10 + i, () => 1);
  }
  const pulgar = trazo([[cx - lado * 14, cy - 18], [cx - lado * 18, cy - 4], [cx - lado * 16, cy + 8], [cx - lado * 12, cy + 16]], 5.2, semilla + 9);
  // Las sombras de la mano, del lado que no ve el foco: un corte negro que sigue el borde.
  const sombra = trazo([[cx - 14 * lado * -1, cy - 22], [cx + lado * 13, cy - 6], [cx + lado * 12, cy + 4]], 2, semilla + 20);
  return `<g filter="url(#gubia)"><path d="${palma + dedos + pulgar}" fill="${T.papel}"/><path d="${nudillos + sombra}" fill="${T.negro}"/></g>`;
}

/** Un puño cerrado sobre la argolla: los nudillos de frente, el pulgar encima. */
function punio([cx, cy]: P, semilla: number): string {
  const forma = curva([[cx - 15, cy - 20], [cx + 14, cy - 22], [cx + 18, cy - 4], [cx + 15, cy + 12], [cx - 2, cy + 16], [cx - 16, cy + 10], [cx - 18, cy - 6]]);
  const dedos = [0, 1, 2, 3].map((i) => trazo([[cx - 13, cy - 4 + i * 5], [cx, cy - 3 + i * 5], [cx + 15, cy - 5 + i * 5]], 1.1, semilla + i)).join('');
  const pulgar = trazo(cubica([[cx - 16, cy - 14], [cx - 6, cy - 16], [cx + 6, cy - 14], [cx + 14, cy - 8]]), 1.6, semilla + 5);
  // Un anillo de sello en el meñique, del lado del foco.
  const anillo = `M${cx + 11} ${cy + 8} a4 2.6 0 1 0 8 0 a4 2.6 0 1 0 -8 0 Z`;
  return `<g filter="url(#gubia)"><path d="${forma}" fill="${T.papel}"/><path d="${dedos + pulgar}" fill="${T.negro}"/><path d="${anillo}" fill="${T.negro}"/></g>`;
}

/** El tramo de abajo: del codo a la muñeca, el puño blanco de la camisa, y la mano. */
function antebrazo(n: 0 | 1): { dibujo: string; caja: readonly [number, number, number, number] } {
  const lado = n === 0 ? -1 : 1;
  const [c, m] = [A.codos[n], A.manos[n]];
  const munieca: P = [m[0] + (c[0] - m[0]) * 0.2, m[1] - 26];
  const contorno = manga(c, munieca, 36, 34);
  const luz = tono(0, [
    { c: [(c[0] + munieca[0]) / 2 + lado * 11, (c[1] + munieca[1]) / 2], r: [8, 74], peso: lado > 0 ? 1 : 0.55, blando: 0.6 },
    // El codo, una bola de luz donde dobla la manga.
    bola([c[0] + lado * 4, c[1] + 6], [16, 16], LUZ, lado > 0 ? 0.8 : 0.4),
  ]);
  const lineas = siguiendo([[c[0], c[1] - 4], [c[0] + (munieca[0] - c[0]) * 0.33, c[1] + 40], [munieca[0] - (munieca[0] - c[0]) * 0.33, munieca[1] - 30], munieca], { n: 9, separacion: 3.6, semilla: 660 + n });
  // El puño de la camisa: una franja blanca con el gemelo.
  const punio1: P[] = [[munieca[0] - 17, munieca[1] - 6], [munieca[0] + 17, munieca[1] - 6], [munieca[0] + 16, munieca[1] + 4], [munieca[0] - 16, munieca[1] + 4]];
  const mano = `<g transform="translate(${m[0]} ${m[1]}) scale(1.35) translate(${-m[0]} ${-m[1]})">${n === 0 ? manoAbierta(m, lado, 670) : punio(m, 680)}</g>`;
  return {
    caja: cajaDe([...contorno, ...punio1, [m[0] - 30, m[1] - 34], [m[0] + 30, m[1] + 44]], 4),
    dibujo:
      plancha(`bb-antebrazo-${n + 1}`, poli(contorno), { negro: T.negro, papel: T.papel, tallas: tallar(lineas, luz, { ancho: 2.8, umbral: [0.15, 0.9], punta: 16, semilla: 662 + n }), caja: cajaDe(contorno) }) +
      `<g filter="url(#gubia)"><path d="${poli(punio1)}" fill="${T.papel}"/><path d="${trazo([[munieca[0] - 4, munieca[1] - 1], [munieca[0] + 4, munieca[1] - 1]], 3, 690 + n, () => 1)}" fill="${T.negro}"/></g>` +
      mano,
  };
}

/* ------------------------------------------------------------------
   El manojo: la argolla de hierro y las llaves, y la chiquita, manchada
   ------------------------------------------------------------------ */

/** El centro de la argolla: cuelga del puño. */
const ARGOLLA: P = [A.llavero[0], A.llavero[1] + 14];
const RADIO_ARGOLLA = 14;

/**
 * Las llaves del manojo: de dónde salen de la argolla (el ángulo, para abajo es 90), el largo y
 * cuántos dientes. La última es la chiquita del cuento, la del cuarto: tiene la mancha.
 */
const LLAVES: ReadonlyArray<{ ang: number; largo: number; dientes: number }> = [
  { ang: 62, largo: 50, dientes: 3 },
  { ang: 78, largo: 58, dientes: 2 },
  { ang: 94, largo: 54, dientes: 3 },
  { ang: 110, largo: 46, dientes: 2 },
  { ang: 126, largo: 30, dientes: 1 },
];

export function manojo(): string {
  const [ax, ay] = ARGOLLA;
  const aro: P[] = [];
  for (let k = 0; k <= 28; k++) aro.push([ax + Math.cos((k / 28) * Math.PI * 2) * RADIO_ARGOLLA, ay + Math.sin((k / 28) * Math.PI * 2) * RADIO_ARGOLLA]);
  let hierro = trazo(aro, 3, 701, () => 1);
  let filos = trazo(aro.slice(18, 27), 1, 702);
  let mancha = '';
  for (const [i, { ang, largo, dientes }] of LLAVES.entries()) {
    const a = (ang * Math.PI) / 180;
    const [ux, uy] = [Math.cos(a), Math.sin(a)];
    const [nx, ny] = [-uy, ux];
    const chica = i === LLAVES.length - 1;
    const esc = chica ? 0.7 : 1;
    // El ojo de la llave, enhebrado en la argolla.
    const [ox, oy] = [ax + ux * (RADIO_ARGOLLA + 4 * esc), ay + uy * (RADIO_ARGOLLA + 4 * esc)];
    const ojo: P[] = [];
    for (let k = 0; k <= 16; k++) ojo.push([ox + Math.cos((k / 16) * Math.PI * 2) * 5.5 * esc, oy + Math.sin((k / 16) * Math.PI * 2) * 5.5 * esc]);
    hierro += trazo(ojo, 2.6 * esc, 710 + i, () => 1);
    // La caña, y el paletón con sus dientes, hacia el lado de afuera.
    const [px, py] = [ox + ux * largo, oy + uy * largo];
    hierro += trazo([[ox + ux * 5 * esc, oy + uy * 5 * esc], [px, py]], 3.2 * esc, 720 + i, () => 1);
    for (let d = 0; d < dientes; d++) {
      const s = largo - 3 - d * 7 * esc;
      const [bx, by] = [ox + ux * s, oy + uy * s];
      hierro += trazo([[bx, by], [bx + nx * 9 * esc, by + ny * 9 * esc]], 3.6 * esc, 730 + i * 4 + d, () => 1);
    }
    // El filo de luz de cada caña, del lado del foco.
    filos += trazo([[ox + ux * 8 + nx * -1.2, oy + uy * 8 + ny * -1.2], [px + nx * -1.2, py + ny * -1.2]], 0.8, 750 + i);
    if (chica) {
      // La mancha de la llave chiquita: del cuento, no de la letra. No sale ni lavándola.
      const [mx, my] = [ox + ux * (largo - 4) + nx * 4, oy + uy * (largo - 4) + ny * 4];
      mancha = `M${mx - 4} ${my} q1 -5 4 -5.6 q3 0.6 4 5.6 q-0.6 4 -4 4.4 q-3.4 -0.4 -4 -4.4 Z`;
    }
  }
  return `<g filter="url(#gubia)"><path d="${hierro}" fill="${T.papel}"/><path d="${filos}" fill="${T.negro}"/><path d="${mancha}" fill="${T.rojo}"/></g>`;
}

/** La caja del manojo: lo que puede llegar a ocupar la llave más larga. */
const CAJA_MANOJO = ((): readonly [number, number, number, number] => {
  const largo = Math.max(...LLAVES.map((l) => l.largo)) + RADIO_ARGOLLA + 18;
  return [ARGOLLA[0] - largo, ARGOLLA[1] - RADIO_ARGOLLA - 8, largo * 2, largo + RADIO_ARGOLLA + 8];
})();

/* ------------------------------------------------------------------
   La puerta de Barbazul y el cuarto de adentro
   ------------------------------------------------------------------
   Al fondo del pasillo, a la izquierda de la ventana. Cerrada se ve una hoja de tablas con dos
   flejes de hierro; cuando Barbazul hace la reverencia se entreabre, y del cuarto sale una luz
   roja que se derrama por el piso. Lo que hay adentro no se dibuja: es el cuento.
*/

const HUECO = `M${PB.x0} ${PB.piso} L${PB.x0} ${PB.arriba} Q${(PB.x0 + PB.x1) / 2} ${PB.arco - 16} ${PB.x1} ${PB.arriba} L${PB.x1} ${PB.piso} Z`;
/**
 * Lo que la luz del cuarto alcanza del piso: no se abre derecho para adelante como la de la
 * ventana, corre en diagonal hasta los pies de Barbazul, como una alfombra que él te tiende. Así
 * se ve aunque la drácula tape la puerta.
 */
const ALFOMBRA = { hasta: [150, 640] as P, abre: 82 } as const;
const DERRAME: readonly P[] = [[PB.x0, PB.piso], [PB.x1, PB.piso], [ALFOMBRA.hasta[0] + ALFOMBRA.abre + 8, 646], [ALFOMBRA.hasta[0] - ALFOMBRA.abre - 8, 646]];

function cuarto(): string {
  // Adentro, el rojo de las banderas, y la gubia le deja rayas de sombra que salen de lo hondo.
  const hondo: P = [(PB.x0 + PB.x1) / 2 + 4, PB.piso - 70];
  const sombras = rayos(hondo, { desde: 0, hasta: 360, n: 22, r0: 6, r1: 120, semilla: 801 });
  const luzAdentro = tono(0.15, [{ c: hondo, r: [30, 60], peso: 0.85, blando: 1 }]);
  // Afuera, la luz roja corre por las juntas del piso y se apaga hacia adelante.
  const vetas = paralelas(cajaDe(DERRAME, 0), { angulo: 0, paso: 6, semilla: 802 });
  const medio = (PB.x0 + PB.x1) / 2;
  const luzPiso = tono(0, [
    (x, y) => {
      const t = (y - PB.piso) / (ALFOMBRA.hasta[1] - PB.piso);
      const centro = medio + (ALFOMBRA.hasta[0] - medio) * t;
      const ancho = (PB.x1 - PB.x0) / 2 + (ALFOMBRA.abre - (PB.x1 - PB.x0) / 2) * t;
      return (1 - 0.5 * t) * suave((1 - Math.abs(x - centro) / ancho) / 0.35);
    },
  ]);
  return (
    `<clipPath id="bb-hueco"><path d="${HUECO}"/></clipPath>` +
    `<g clip-path="url(#bb-hueco)"><path d="${HUECO}" fill="${T.rojo}"/>` +
    `<g filter="url(#gubia)"><path d="${tallar(sombras, (x, y) => 1 - luzAdentro(x, y), { ancho: 3.4, umbral: [0.3, 0.9], punta: 12, semilla: 803 })}" fill="${T.negro}"/></g></g>` +
    `<clipPath id="bb-derrame"><path d="${poli(DERRAME)}"/></clipPath>` +
    `<g clip-path="url(#bb-derrame)" filter="url(#gubia)"><path d="${tallar(vetas, luzPiso, { ancho: 4.4, umbral: [0.08, 0.8], punta: 10, pulso: 0.7, semilla: 804 })}" fill="${T.rojo}"/></g>`
  );
}

/** La hoja de la puerta: tablas verticales, dos flejes con sus clavos y la cerradura. */
function hoja(): string {
  const caja: readonly [number, number, number, number] = [PB.x0 - 2, PB.arco - 20, PB.x1 - PB.x0 + 4, PB.piso - PB.arco + 22];
  const tablas = paralelas(caja, { angulo: 90, paso: 7.6, semilla: 811 });
  const luz = tono(0.15, [{ c: [PB.x1 - 8, PB.arriba + 40], r: [24, 120], peso: 0.55, blando: 1 }]);
  let flejes = '';
  let clavos = '';
  for (const y of [PB.arriba + 18, PB.piso - 40]) {
    flejes += trazo([[PB.x0, y], [(PB.x0 + PB.x1) / 2, y + 0.5], [PB.x1, y]], 5.4, 812 + y, () => 1);
    for (let x = PB.x0 + 5; x < PB.x1; x += 9) clavos += `M${x - 1.4} ${y} a1.4 1.4 0 1 0 2.8 0 a1.4 1.4 0 1 0 -2.8 0 Z`;
  }
  const cerradura = `M${PB.x1 - 10} ${PB.piso - 82} a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 Z M${PB.x1 - 8.4} ${PB.piso - 81} l-1 7 h3.4 l-1 -7 Z`;
  return plancha('bb-hoja', HUECO, {
    negro: T.negro,
    papel: T.gris,
    tallas: tallar(tablas, luz, { ancho: 5.6, umbral: [0.1, 0.95], punta: 18, pulso: 0.5, semilla: 815 }),
    trazos: flejes,
    brillos: clavos + cerradura,
    caja,
    motas: false,
  });
}

/* ------------------------------------------------------------------
   Las piezas
   ------------------------------------------------------------------ */

const [B1, B2] = [brazo(0), brazo(1)];
const [AB1, AB2] = [antebrazo(0), antebrazo(1)];

export const PIEZAS_BARBAZUL: readonly Pieza[] = [
  { nombre: 'barbazul-levita', caja: cajaDe([...LEVITA, [-70, 4], [70, 4]], 6), dibujo: levita(), densidad: 2.2 },
  { nombre: 'barbazul-cabeza', caja: cajaDe(PELO.map(aLaMedida), 10), dibujo: cabeza(), densidad: 3.6 },
  { nombre: 'barbazul-barba', caja: cajaDe(BARBA.map(([x, y]): P => [x + REGISTRO[0], y + REGISTRO[1]]).concat(BARBA).map(aLaMedida), 8), dibujo: barba(), densidad: 3.2 },
  { nombre: 'barbazul-brazo-1', caja: cajaDe(B1.contorno, 6), dibujo: B1.dibujo, densidad: 2.6 },
  { nombre: 'barbazul-brazo-2', caja: cajaDe(B2.contorno, 6), dibujo: B2.dibujo, densidad: 2.6 },
  { nombre: 'barbazul-antebrazo-1', caja: AB1.caja, dibujo: AB1.dibujo, densidad: 3 },
  { nombre: 'barbazul-antebrazo-2', caja: AB2.caja, dibujo: AB2.dibujo, densidad: 3 },
  { nombre: 'barbazul-llaves', caja: CAJA_MANOJO, dibujo: manojo(), densidad: 3.4 },
];

/** La puerta del cuarto, en coordenadas de la escena. */
export const PIEZAS_PUERTA: readonly Pieza[] = [
  { nombre: 'prision-cuarto', caja: cajaDe([...DERRAME, [PB.x0, PB.arco - 20], [PB.x1, PB.arco - 20]], 4), dibujo: cuarto(), densidad: 2.4 },
  { nombre: 'prision-hoja', caja: [PB.x0 - 4, PB.arco - 22, PB.x1 - PB.x0 + 8, PB.piso - PB.arco + 26], dibujo: hoja(), densidad: 2.6 },
];
