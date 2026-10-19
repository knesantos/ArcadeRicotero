/**
 * El esclavo sensible y chillón (`D-73`, decimoquinta vuelta), preso en una celda de la prisión de
 * Barbazul.
 *
 * Sale de *"Preso en mi ciudad"* (*Oktubre*, 1986), la misma canción que la drácula con tacones: *"Fue un
 * esclavo sensible y chillón / y fácil para el gatillo / atrapó un beso bienhechor / con ojos al rojo
 * vivo. / Ahora ya no llora (casi ya no llora...)"*. No está en ninguna tapa: se inventa en la de su
 * disco, que es la de su recinto (`D-19`, `T-440`). **Está tallado como la gente de *Oktubre***
 * (`grabado.ts`): la plancha negra y la luz sacada a gubia. La vara es **el pibe del flequillo del
 * frente de la tapa**, el de los ojos grandes de párpado pesado que mira de costado: la cara blanca, el
 * pelo negro tupido que le tapa la frente, la sombra que se come la mitad de la derecha.
 *
 * Nada de esclavitud de verdad ni de armas: es un preso de la ciudad, un pibe roto. Está sentado en el
 * catre de su celda, abrazado a las rodillas, con un grillete en el tobillo, y mira la calle por la reja
 * de la ventana del fondo, donde flamean las banderas. Lo único de color es lo que pide la letra: los
 * ojos al rojo vivo, del rojo que la tapa le pone en el ojo al hombre de barba del frente
 * (`--bestia-esclavo-ojo`).
 *
 * La piel se talla en el blanco de la gente (`--bestia-dracula-papel`), que le pega la luz de la ventana
 * y del foco, a su izquierda; la ropa, en el gris de atrás (`--disco-oktubre-apoyo`), que está en el
 * fondo del pasillo. Todo en coordenadas de títere (`rig-esclavo.ts`): el (0, 0) es donde se sienta.
 */

import { imagenesDe, type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';
import { cajaDe, curva, poli } from './arte-prision.ts';
import { bola, cubica, envolventes, paralelas, picado, plancha, siguiendo, tallar, tono, trazo, type Mancha, type P } from './grabado.ts';
import {
  CELDA, ESCLAVO as E, ESCLAVO_ARMADO as A, HUECO, LAGRIMA, PIVOTES_PARPADO, enPared, transformes,
  type Gesto,
} from './rig-esclavo.ts';
import type { Personaje } from './elenco.ts';

const ID = 'el-esclavo-sensible-y-chillon';

const T = {
  negro: 'var(--fondo)',
  papel: 'var(--bestia-dracula-papel)',
  gris: 'var(--disco-oktubre-apoyo)',
};

/** De dónde le viene la luz: arriba a la izquierda (la ventana y el foco del pasillo), y de frente. */
const LUZ: readonly [number, number, number] = [-0.62, -0.42, 0.66];

const suave = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
/** La luz apretada: en *Oktubre* casi no hay medio tono. */
const apretada = (luz: (x: number, y: number) => number) => (x: number, y: number): number => suave((luz(x, y) - 0.22) / 0.5);

/* ------------------------------------------------------------------
   La cabeza: la cara del pibe, el pelo tupido y el flequillo
   ------------------------------------------------------------------ */

const [FX, FY] = A.cara;
const C = (x: number, y: number): P => [FX + x, FY + y];
const K = A.agranda;
/** La cabeza se dibuja a su medida y se agranda desde la cara (`agranda`). */
const agrandada = (dibujo: string): string => `<g transform="translate(${FX} ${FY}) scale(${K}) translate(${-FX} ${-FY})">${dibujo}</g>`;
const aLaMedida = ([x, y]: P): P => [FX + (x - FX) * K, FY + (y - FY) * K];
/** Los ojos de `rig-esclavo.ts` están agrandados: acá se dibujan a la medida de la cabeza. */
const OJOS = A.ojos.map((o) => ({ centro: [FX + (o.centro[0] - FX) / K, FY + (o.centro[1] - FY) / K] as P, radio: [o.radio[0] / K, o.radio[1] / K] as P }));
/** La línea de la boca, medida desde el medio de la cara, a la medida de la cabeza. */
const BOCA = (A.boca - FY) / K;

/**
 * La piel de la cara, vuelta de tres cuartos hacia la ventana: a la izquierda, el perfil de la frente,
 * la cuenca, el pómulo y el mentón; a la derecha, la mejilla grande que da a este lado.
 */
const CARA: readonly P[] = [
  C(-6, -27), C(-15, -25.5), C(-21.5, -20), C(-24.5, -12), C(-23, -6), C(-24, 1), C(-22.5, 8), C(-21, 14), C(-18.5, 20), C(-14.5, 26), C(-9, 30.5), C(-3, 31.5),
  C(3, 30.5), C(10, 27), C(16.5, 21.5), C(21.5, 14), C(24.5, 5), C(26, -5), C(25, -16), C(19, -23.5), C(8, -27),
];
/** La cara hasta la boca: lo de abajo es de la quijada, que se abre cuando chilla. */
const ARRIBA_DE_LA_BOCA: readonly P[] = [
  C(-6, -27), C(-15, -25.5), C(-21.5, -20), C(-24.5, -12), C(-23, -6), C(-24, 1), C(-22.5, 8), C(-21, 14), C(-19.5, BOCA + 1.4), C(-16, BOCA + 1), C(-11, BOCA + 0.4),
  C(-6, BOCA), C(-1, BOCA + 0.3), C(3.5, BOCA + 0.9), C(9, BOCA + 1.8), C(14, BOCA + 2.6), C(19, BOCA + 0.5), C(21.5, 14), C(24.5, 5), C(26, -5), C(25, -16), C(19, -23.5), C(8, -27),
];
/** La quijada: de la boca para abajo, con un margen que se esconde debajo de la cara. */
const QUIJADA: readonly P[] = [C(-21.5, 10), C(-18.5, 20), C(-14.5, 26), C(-9, 30.5), C(-3, 31.5), C(3, 30.5), C(10, 27), C(16.5, 21.5), C(21.5, 12), C(0, 12)];

/** El pelo de atrás: la mata negra que le tapa las orejas y baja en puntas hasta la quijada. */
const PELO: readonly P[] = [
  C(-4, -50), C(-15, -48.5), C(-24, -42), C(-29, -32), C(-30.5, -20), C(-29.5, -8), C(-28, 2), C(-26, 8), C(-24, 0), C(0, -10), C(21, 12), C(24, 23), C(27, 18),
  C(29.5, 26), C(32, 19), C(34.5, 25.5), C(36.5, 16), C(37.5, 2), C(37, -14), C(34, -28), C(27, -40), C(16, -48), C(6, -50.5),
];

/** El flequillo: le tapa la frente hasta las cejas, cortado en puntas, como el pibe de la tapa. */
const FLEQUILLO: readonly P[] = [
  C(-26, -26), C(-21, -39), C(-11, -46), C(2, -48.5), C(15, -46), C(25, -38), C(30, -26), C(29, -15.5), C(25.5, -12.5), C(21, -15.6), C(17, -12.2),
  C(12.5, -15.4), C(8, -12.2), C(3.5, -15.2), C(-1, -12.4), C(-5.5, -15.4), C(-10, -12.4), C(-14.5, -15.4), C(-18.5, -13), C(-22.5, -15.4), C(-25.5, -14), C(-27.5, -18),
];

/** La luz de la cara: el elipsoide de frente y lo que talló la gubia encima. */
function luzDeCara(): (x: number, y: number) => number {
  const m = (x: number, y: number, rx: number, ry: number, peso: number, giro = 0, blando = 0.7): Mancha => ({ c: C(x, y), r: [rx, ry], peso, giro, blando });
  return tono(0.08, [
    bola(C(-9, 1), [26, 34], LUZ, 1.3),
    // La sombra que tira el flequillo sobre la frente y el arranque de los ojos.
    m(0, -14, 32, 4.5, -0.6, 0, 0.9),
    // Las cuencas, hondas: el ojo vive en lo negro. La de este lado, más.
    m(-17, -7.5, 5.5, 4.5, -0.5, 0, 0.6),
    m(4.5, -7.5, 9.5, 5.5, -0.85, 0, 0.6),
    // Las ojeras de llorar, debajo de cada ojo.
    m(-17, -3, 5, 2.2, -0.35, 0, 0.8),
    m(4.5, -2.5, 8, 2.6, -0.55, 0, 0.8),
    // El lomo de la nariz, un filo de luz del lado de la ventana; el costado de la nariz y la sombra que tira.
    m(-12.5, -1, 2.4, 9, 0.5, 12, 0.75),
    m(-8.5, 5, 1.8, 5, -0.4, 14, 0.6),
    m(-11, 13.2, 5, 1.8, -0.75),
    // El pómulo de allá, prendido: es el plano que da a la ventana.
    m(-19.5, 3, 4.5, 6, 0.3, 0, 0.8),
    // La mejilla de este lado, la grande, comida por la sombra; y el hueco debajo del pómulo.
    m(14, 4, 13, 26, -0.75, 0, 0.85),
    m(8, 13, 7, 7, -0.35),
    // El labio de arriba, apenas.
    m(-7, BOCA - 1.6, 6, 2, 0.15),
  ]);
}

/**
 * El blanco de un ojo: una almendra con la punta de afuera caída, que es la cara de pena. `n` 0 es el de
 * la izquierda. Se usa a la medida de la cabeza (lo impreso) y agrandado (el recorte de la pupila).
 */
function almendra({ centro: [cx, cy], radio: [rx, ry] }: { centro: P; radio: P }, n: number, caida = 1.1): string {
  const afuera = n === 0 ? -1 : 1;
  const r = (v: number): number => Math.round(v * 100) / 100;
  const pts: P[] = [];
  for (let k = 0; k < 28; k++) {
    const a = (k / 28) * Math.PI * 2;
    const s = Math.sin(a);
    const x = Math.cos(a) * rx;
    const y = s < 0 ? s * ry * 1.05 : s * ry * 0.7;
    pts.push([cx + x, cy + y + (x * afuera > 0 ? (x * afuera) / rx : 0) * caida]);
  }
  return `M${pts.map(([x, y]) => `${r(x)} ${r(y)}`).join('L')}Z`;
}

/** Un ojo: el blanco almendrado, el párpado grueso y la ojera tallada. Sin pupila: la pone la página. */
function ojo(n: 0 | 1, semilla: number): { blancos: string; trazos: string } {
  const { centro: [cx, cy], radio: [rx, ry] } = OJOS[n]!;
  const afuera = n === 0 ? -1 : 1;
  return {
    blancos:
      almendra(OJOS[n]!, n, 1.1 / K) +
      // La ojera, en dos cortes debajo del ojo, como la de la tapa; la de la derecha casi no se ve.
      trazo(cubica([[cx - rx * 0.9, cy + ry * 1.9], [cx - rx * 0.3, cy + ry * 2.9], [cx + rx * 0.4, cy + ry * 2.9], [cx + rx * 1.05, cy + ry * 1.9]]), n === 0 ? 1.1 : 0.7, semilla) +
      trazo(cubica([[cx - rx * 0.6, cy + ry * 3.4], [cx - rx * 0.1, cy + ry * 4.1], [cx + rx * 0.4, cy + ry * 4.1], [cx + rx * 0.8, cy + ry * 3.3]]), n === 0 ? 0.8 : 0.5, semilla + 1),
    trazos:
      // El párpado de arriba, grueso, que se va en punta para afuera y cae.
      trazo(
        cubica([[cx - rx * 1.2, cy + 0.4 + (afuera < 0 ? 1.6 : 0)], [cx - rx * 0.5, cy - ry * 1.7], [cx + rx * 0.5, cy - ry * 1.7], [cx + rx * 1.25, cy + 0.4 + (afuera > 0 ? 1.6 : 0)]]),
        2.2,
        semilla + 3,
        (t) => Math.sin(Math.PI * Math.min(1, t * 1.06)) ** 0.4,
      ) +
      // El borde de abajo, fino.
      trazo(cubica([[cx - rx * 0.85, cy + ry * 0.75], [cx - rx * 0.2, cy + ry * 1.05], [cx + rx * 0.4, cy + ry * 1.05], [cx + rx * 0.95, cy + ry * 0.8]]), 0.7, semilla + 4),
  };
}

function cabeza(): string {
  const luz = apretada(luzDeCara());
  // Los cachetes con cortes que bajan; el medio de la cara con cortes que dan la vuelta. La frente no:
  // la tapa el flequillo.
  // El costado de allá es angosto (el perfil); el de este lado, la mejilla ancha.
  const costado = (x: number): number => (x > FX - 6 ? suave((x - FX - 1) / 6) : suave((FX - 18 - x) / 3));
  const cachetes = [
    ...siguiendo([C(-22, -10), C(-24, 4), C(-20, 18), C(-10, 30)], { n: 4, separacion: 2.2, abre: 1.1, semilla: 905 }),
    ...siguiendo([C(18, -12), C(26, 4), C(19, 22), C(3, 31)], { n: 12, separacion: 2.2, abre: 1.15, semilla: 906 }),
  ];
  const medio = envolventes(C(-8, 4), [20, 30], { paso: 2.3, comba: 0.24, desde: -0.55, hasta: 1, semilla: 907 });
  const puente = siguiendo([C(-11, -9), C(-12.5, -1), C(-14, 5), C(-14.5, 9)], { n: 4, separacion: 1.6, semilla: 908 });
  const tallas =
    tallar(cachetes, (x, y) => luz(x, y) * costado(x), { ancho: 2.9, umbral: [0.15, 0.85], semilla: 911 }) +
    tallar(medio, (x, y) => luz(x, y) * (1 - costado(x)), { ancho: 3.2, umbral: [0.15, 0.8], semilla: 915 }) +
    tallar(puente, luz, { ancho: 1.9, umbral: [0.3, 0.8], semilla: 914 });
  const grano = picado(cajaDe(CARA, 0), luz, { rango: [0.2, 0.5], densidad: 9, angulo: 70, semilla: 913 });
  const [o1, o2] = [ojo(0, 921), ojo(1, 931)];
  // Las cejas de pena: la punta de adentro sube, y se meten debajo del flequillo.
  const cejas =
    trazo(cubica([C(-24, -10.4), C(-21, -11.8), C(-16, -12.8), C(-12, -14)]), 1.6, 941, (t) => Math.sin(Math.PI * t) ** 0.4 * (0.5 + t * 0.5)) +
    trazo(cubica([C(-4, -14.6), C(2, -12.9), C(8, -12), C(14, -10.6)]), 2.1, 942, (t) => Math.sin(Math.PI * t) ** 0.4 * (1 - t * 0.4));
  // La nariz: el lomo prendido del lado de la ventana, la punta, y las aletas negras.
  const nariz = trazo(cubica([C(-11.5, -7), C(-13.5, 0), C(-15.5, 5), C(-16, 9)]), 1.5, 951) + trazo(cubica([C(-16.5, 11), C(-13.5, 12.6), C(-10, 12.8), C(-7.5, 11.5)]), 0.9, 952);
  const aletas = trazo(cubica([C(-17, 8.5), C(-17.5, 11), C(-16, 12.6), C(-14, 12.4)]), 1.5, 953) + trazo(cubica([C(-8.5, 12.4), C(-6, 12.8), C(-4.8, 10.8), C(-5.6, 8)]), 2, 954);
  // El surco del labio, y la boca: una raya apretada, con las comisuras que tiran para abajo.
  const surco = trazo(cubica([C(-9, 14.2), C(-9.3, 15), C(-9.2, 15.6), C(-9, BOCA - 1.4)]), 1.1, 955);
  // La boca va adentro del borde de la cara: abajo de ese borde está la quijada, que es la que se abre.
  const boca = trazo(cubica([C(-17, BOCA + 0.6), C(-10, BOCA - 1.4), C(-1, BOCA - 1.4), C(5, BOCA + 0.8)]), 2.4, 956, (t) => 0.5 + 0.5 * Math.sin(Math.PI * t));
  // El pelo: hebras que bajan desde la coronilla. Prendidas del lado de la ventana y arriba, como un
  // casco; del otro lado, casi negras.
  const hebras = [
    ...siguiendo([C(-4, -50), C(-20, -45), C(-29, -22), C(-27, 6)], { n: 8, separacion: 2.1, abre: 1.4, semilla: 963, recorta: 0.15 }),
    ...siguiendo([C(2, -50), C(26, -44), C(37, -18), C(33, 24)], { n: 12, separacion: 2.1, abre: 1.5, semilla: 964, recorta: 0.15 }),
  ];
  const luzPelo = tono(0.1, [
    { c: C(-14, -40), r: [19, 8], peso: 1, giro: -32, blando: 0.85 },
    { c: C(8, -46), r: [12, 4.5], peso: 0.5, giro: 14, blando: 0.85 },
    // El canto de la ventana, a la izquierda: el pelo de la sien.
    { c: C(-29, -10), r: [3.5, 16], peso: 0.85, blando: 0.7 },
    // La nuca, del lado de este lado: apenas un canto contra lo negro de la celda.
    { c: C(36, 8), r: [3, 16], peso: 0.4, blando: 0.8 },
    // Las hebras se juntan en mechones.
    (x) => 0.2 * Math.sin((x - FX) / 3.2),
  ]);
  const flecos = siguiendo([C(1, -48), C(0, -38), C(-1, -26), C(-1.5, -14)], { n: 14, separacion: 4, abre: 1.14, semilla: 965, recorta: 0.1 });
  const luzFleco = tono(0.1, [
    // La comba de la cabeza: una franja de luz que cruza el flequillo, más fuerte del lado de la ventana.
    { c: C(-9, -33), r: [22, 7], peso: 1.05, giro: -12, blando: 0.9 },
    { c: C(13, -36), r: [12, 5], peso: 0.55, giro: 18, blando: 0.9 },
    { c: C(-24, -22), r: [5, 10], peso: 0.6, blando: 0.8 },
    (x) => 0.24 * Math.sin((x - FX) / 2.6 + 1),
  ]);
  return agrandada(
    plancha('es-pelo', curva(PELO), { negro: T.negro, papel: T.papel, tallas: tallar(hebras, luzPelo, { ancho: 1.8, umbral: [0.12, 0.88], punta: 12, semilla: 967 }), caja: cajaDe(PELO, 4) }) +
    plancha('es-cara', curva(ARRIBA_DE_LA_BOCA), {
      negro: T.negro,
      papel: T.papel,
      tallas: tallas + grano,
      blancos: o1.blancos + o2.blancos + nariz,
      trazos: o1.trazos + o2.trazos + cejas + aletas + surco + boca,
      caja: cajaDe(CARA),
    }) +
    plancha('es-flequillo', curva(FLEQUILLO), { negro: T.negro, papel: T.papel, tallas: tallar(flecos, luzFleco, { ancho: 1.7, umbral: [0.12, 0.88], punta: 9, semilla: 968 }), caja: cajaDe(FLEQUILLO, 3) }),
  );
}

/** Lo de adentro de la boca, que se ve cuando chilla: lo negro, los dientes de arriba y la lengua. */
function boca(): string {
  const hueco = curva([C(-17, BOCA - 1), C(-11, BOCA - 1.8), C(-5, BOCA - 1.8), C(1, BOCA - 1.4), C(5.5, BOCA - 0.6), C(3, BOCA + 8), C(-6, BOCA + 12), C(-14.5, BOCA + 8)]);
  let dientes = '';
  // Los de allá, más angostos: la boca también está de tres cuartos.
  for (let i = -2; i <= 2; i++) {
    const x = -6.5 + i * (i < 0 ? 2.2 : 2.6);
    const ancho = i < 0 ? 0.95 : 1.15;
    dientes += poli([C(x - ancho, BOCA - 0.6), C(x - ancho * 0.85, BOCA + 1.9), C(x + ancho * 0.85, BOCA + 1.9), C(x + ancho, BOCA - 0.6)]);
  }
  const lengua = curva([C(-11, BOCA + 9.5), C(-6, BOCA + 7.6), C(0, BOCA + 8.6), C(-2, BOCA + 11), C(-8, BOCA + 11.2)]);
  return agrandada(`<g filter="url(#gubia)"><path d="${hueco}" fill="${T.negro}"/><path d="${dientes}" fill="${T.papel}"/><path d="${lengua}" fill="${T.gris}"/></g>`);
}

/** La quijada: el labio de abajo, el mentón tallado y la sombra que tira el labio. */
function quijada(): string {
  const luz = apretada(tono(0.05, [
    bola(C(-8, 23), [19, 13], LUZ, 1.1),
    { c: C(-6, BOCA + 4.4), r: [8, 2], peso: -0.8, blando: 0.6 },
    { c: C(-8, 27), r: [6, 4], peso: 0.3, blando: 0.8 },
    { c: C(12, 20), r: [9, 11], peso: -0.75, giro: 30, blando: 0.8 },
  ]));
  const lineas = [
    ...envolventes(C(-6, 23), [18, 12], { paso: 2.2, comba: 0.3, desde: -0.5, hasta: 1, semilla: 981 }),
    ...siguiendo([C(-21, 11), C(-19, 18), C(-15, 25), C(-9, 30)], { n: 3, separacion: 2.2, semilla: 982 }),
  ];
  // El labio de abajo: un filo de luz justo debajo de la boca.
  const labio = trazo(cubica([C(-14, BOCA + 1.6), C(-9, BOCA + 2.6), C(-3, BOCA + 2.6), C(2, BOCA + 1.8)]), 1.4, 983);
  return agrandada(plancha('es-quijada', curva(QUIJADA), { negro: T.negro, papel: T.papel, tallas: tallar(lineas, luz, { ancho: 2.8, umbral: [0.15, 0.85], semilla: 984 }), blancos: labio, caja: cajaDe(QUIJADA) }));
}

/* ------------------------------------------------------------------
   El cuerpo: el cuello, la remera, las piernas encogidas
   ------------------------------------------------------------------ */

/** La remera: los hombros encogidos y el pecho, que casi no se ve detrás de las rodillas. */
const REMERA: readonly P[] = [
  [-13, -209], [-23, -205.5], [-34, -201], [-43, -195], [-49, -186], [-52, -172], [-53, -150], [-52, -110], [-51, -70], [-50, -36], [-48, -8],
  [-42, 0], [0, 1], [42, 0], [47, -8], [49, -36], [50, -70], [51, -110], [52, -150], [51, -170], [48, -184], [42, -194], [32, -200], [21, -205],
  [12, -208.5], [0, -203],
];
/** El cuello, que asoma entre el pelo y la remera. */
const CUELLO: readonly P[] = [[-11, -234], [-12, -216], [-15, -207], [-6, -200.5], [0, -199.5], [6, -200.5], [14, -207], [11, -216], [10, -234]];

function cuerpo(): string {
  const luzTela = tono(0, [
    // El hombro de la ventana, prendido arriba; el otro, apenas el canto.
    bola([-35, -191], [20, 13], LUZ, 1),
    bola([33, -190], [16, 11], LUZ, 0.45),
    { c: [-50, -150], r: [4, 40], peso: 0.5, blando: 0.7 },
    // La cadera de la ventana, sentada en el catre: asoma al costado de los pies.
    { c: [-45, -14], r: [6, 14], peso: 0.7, blando: 0.7 },
  ]);
  const tela = [
    ...envolventes([-35, -189], [21, 15], { paso: 2.8, comba: 0.35, desde: -1, hasta: 0.6, semilla: 1001 }),
    ...envolventes([33, -188], [18, 13], { paso: 2.8, comba: 0.35, desde: -1, hasta: 0.6, semilla: 1002 }),
    ...siguiendo([[-50, -184], [-53, -150], [-52, -100], [-50, -40]], { n: 3, separacion: 2.6, semilla: 1003 }),
    ...siguiendo([[-44, -40], [-46, -24], [-46, -10], [-42, 0]], { n: 4, separacion: 2.6, semilla: 1008 }),
  ];
  // El cuello queda en la sombra de la quijada: apenas un filo del lado de la ventana.
  const luzPiel = tono(0, [{ c: [-10, -212], r: [2.6, 9], peso: 0.9, blando: 0.6 }]);
  const piel = siguiendo([[-9, -224], [-9.5, -216], [-10, -209], [-11, -204]], { n: 2, separacion: 2.2, semilla: 1004 });
  // El cuello de la remera, gastado: un filo de luz.
  const borde = trazo(cubica([[-15, -207], [-8, -201.5], [6, -201.5], [14, -207]]), 1.3, 1005);
  return (
    plancha('es-cuello', poli(CUELLO), { negro: T.negro, papel: T.papel, tallas: tallar(piel, luzPiel, { ancho: 2.8, umbral: [0.15, 0.85], semilla: 1006 }), caja: cajaDe(CUELLO) }) +
    plancha('es-remera', curva(REMERA), { negro: T.negro, papel: T.gris, tallas: tallar(tela, luzTela, { ancho: 2.4, umbral: [0.18, 0.9], punta: 10, semilla: 1007 }), blancos: borde, caja: cajaDe(REMERA) })
  );
}

/** Las dos piernas encogidas, con los pantalones arremangados. */
const PIERNA_1: readonly P[] = [
  [-42, -176], [-41, -190], [-35, -199], [-25, -203], [-13, -202], [-5, -195], [-2, -183], [-2.5, -160], [-5, -130], [-8, -100], [-11, -72], [-12.5, -54],
  [-13, -46], [-38, -46], [-38, -62], [-39, -90], [-40, -120], [-41.5, -150],
];
const PIERNA_2: readonly P[] = [
  [0.5, -183], [2.5, -195], [10, -201.5], [21, -203], [32, -199], [38.5, -189], [40, -175], [39, -150], [37, -120], [35, -90], [33.5, -64], [33, -48],
  [11, -48], [10, -58], [8, -80], [5, -110], [2.5, -140], [1, -160],
];
/** Los pies descalzos, mirando para adelante: se les ve el empeine y los dedos. */
const PIE_1: readonly P[] = [[-38, -48], [-13, -48], [-10, -32], [-9, -15], [-12, -3], [-18, 1], [-27, 2], [-35, 0], [-40, -10], [-40, -28]];
const PIE_2: readonly P[] = [[11, -50], [33, -50], [36.5, -33], [37, -15], [34, -3], [27, 1], [18, 1], [12, -3], [9, -16], [9, -33]];

function pierna(contorno: readonly P[], rodilla: P, semilla: number, prendida: number): string {
  const [rx, ry] = rodilla;
  // La rodilla es lo que más sale para adelante: una bola prendida, casi blanca, que dice que está
  // sentado con las piernas encogidas. La canilla, un filo del lado de la ventana.
  // La canilla: un plano ancho prendido del lado de la ventana, que baja de la rodilla al pie. Ancho,
  // para que un barrote de la reja no lo tape entero.
  const luz = tono(0, [
    bola([rx - 3, ry - 2], [21, 17], LUZ, prendida * 1.7),
    { c: [rx - 12, ry + 88], r: [7.5, 76], peso: prendida * 0.95, blando: 0.75 },
    { c: [rx - 2, ry + 70], r: [6, 50], peso: prendida * 0.3, blando: 0.8 },
  ]);
  // En la rodilla los cortes se juntan en un plano blanco, redondo: si quedan rayas, parece una remera
  // a rayas y no una rodilla.
  const rotula = envolventes([rx - 1, ry - 2], [21, 16], { paso: 2.3, comba: 0.45, desde: -1, hasta: 0.9, semilla });
  const canilla = siguiendo([[rx - 12, ry + 14], [rx - 13, ry + 60], [rx - 11.5, ry + 100], [rx - 10, ry + 136]], { n: 6, separacion: 2.9, semilla: semilla + 1 });
  // El ruedo arremangado: un doblez con su filo.
  const [x0, x1] = [Math.min(...contorno.map((p) => p[0])), Math.max(...contorno.map((p) => p[0]))];
  const yb = Math.max(...contorno.map((p) => p[1]));
  const ruedo = trazo([[x0 + 2, yb - 7], [(x0 + x1) / 2, yb - 8.5], [x1 - 2, yb - 7]], 1.6, semilla + 2) + trazo([[x0 + 3, yb - 2.6], [(x0 + x1) / 2, yb - 3.4], [x1 - 3, yb - 2.6]], 0.9, semilla + 3);
  // El pantalón se talla en el blanco, como la ropa de la gente de la tapa: es lo que más le da la luz.
  const tallas = tallar(rotula, luz, { ancho: 3.6, umbral: [0.2, 0.8], punta: 8, pulso: 0.2, semilla: semilla + 4 }) + tallar(canilla, luz, { ancho: 2.6, umbral: [0.2, 0.92], punta: 12, semilla: semilla + 5 });
  return plancha(`es-pierna-${semilla}`, curva(contorno), { negro: T.negro, papel: T.papel, tallas, blancos: ruedo, caja: cajaDe(contorno) });
}

function pie(contorno: readonly P[], semilla: number, prendido: number): string {
  const [x0, x1] = [Math.min(...contorno.map((p) => p[0])), Math.max(...contorno.map((p) => p[0]))];
  const cx = (x0 + x1) / 2;
  const luz = apretada(tono(0.05, [bola([cx - 3, -26], [15, 26], LUZ, prendido * 1.1), { c: [cx + 8, -8], r: [6, 10], peso: -0.4, blando: 0.8 }]));
  const lineas = envolventes([cx, -24], [15, 26], { paso: 2.4, comba: 0.3, desde: -0.9, hasta: 0.7, semilla });
  // Los dedos: cuatro cortes negros en la punta, y el del gordo más largo.
  const dedos = [0, 1, 2, 3].map((i) => trazo([[x0 + 5 + i * ((x1 - x0 - 8) / 4), -9], [x0 + 5.6 + i * ((x1 - x0 - 8) / 4), -1]], i === 0 ? 1.4 : 1, semilla + 10 + i, () => 1)).join('');
  return plancha(`es-pie-${semilla}`, curva(contorno), { negro: T.negro, papel: T.papel, tallas: tallar(lineas, luz, { ancho: 2.4, umbral: [0.15, 0.85], semilla: semilla + 1 }), trazos: dedos, caja: cajaDe(contorno) });
}

/** El grillete del tobillo de la izquierda: el aro de hierro y la argolla de donde sale la cadena. */
function grillete(): string {
  const [gx, gy] = A.grillete;
  const aro = trazo([[-40, gy - 4], [-26, gy - 6], [-11, gy - 4]], 7, 1031, () => 1);
  const filo = trazo([[-39, gy - 6.6], [-26, gy - 8.4], [-12, gy - 6.6]], 1.2, 1032);
  const argolla: P[] = Array.from({ length: 17 }, (_, k) => [gx + Math.cos((k / 16) * Math.PI * 2) * 3.4, gy + 2 + Math.sin((k / 16) * Math.PI * 2) * 4.2]);
  return `<g filter="url(#gubia)"><path d="${aro}" fill="${T.negro}"/><path d="${filo}" fill="${T.papel}"/><path d="${trazo(argolla, 1.5, 1033, () => 1)}" fill="${T.gris}"/></g>`;
}

function piernas(): string {
  return (
    pie(PIE_2, 1021, 0.55) + pierna(PIERNA_2, A.rodillas[1], 1011, 0.6) +
    pie(PIE_1, 1023, 1) + pierna(PIERNA_1, A.rodillas[0], 1015, 1) +
    grillete()
  );
}

/* ------------------------------------------------------------------
   Los brazos: abrazado a las rodillas
   ------------------------------------------------------------------ */

/** Un tramo de brazo de un punto a otro, con su ancho en cada punta y la punta de arriba redonda. */
function tramo(a: P, b: P, anchoA: number, anchoB: number): P[] {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const l = Math.hypot(dx, dy) || 1;
  const [nx, ny] = [-dy / l, dx / l];
  const pts: P[] = [];
  for (let k = 0; k <= 8; k++) {
    const t = Math.PI * (k / 8);
    pts.push([a[0] + nx * (anchoA / 2) * Math.cos(t) - (dx / l) * (anchoA / 2) * Math.sin(t) * 0.6, a[1] + ny * (anchoA / 2) * Math.cos(t) - (dy / l) * (anchoA / 2) * Math.sin(t) * 0.6]);
  }
  pts.push([b[0] - nx * (anchoB / 2), b[1] - ny * (anchoB / 2)], [b[0] + nx * (anchoB / 2), b[1] + ny * (anchoB / 2)]);
  return pts;
}

/** La piel de un tramo de brazo, tallada a lo largo, prendida del lado de arriba. */
function piel(id: string, a: P, b: P, anchoA: number, anchoB: number, prendida: number, semilla: number): { dibujo: string; contorno: P[] } {
  const contorno = tramo(a, b, anchoA, anchoB);
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const l = Math.hypot(dx, dy) || 1;
  // El canto del tramo que da a la luz.
  const haciaLaLuz = (-dy / l) * LUZ[0] + (dx / l) * LUZ[1] > 0;
  const [nx, ny] = haciaLaLuz ? [-dy / l, dx / l] : [dy / l, -dx / l];
  const anchoMedio = (anchoA + anchoB) / 2;
  const luz = apretada(tono(0.05, [
    { c: [(a[0] + b[0]) / 2 + nx * anchoMedio * 0.2, (a[1] + b[1]) / 2 + ny * anchoMedio * 0.2], r: [l / 2 + 4, anchoMedio * 0.42], peso: prendida * 1.1, giro: (Math.atan2(dy, dx) * 180) / Math.PI, blando: 0.7 },
  ]));
  const lineas = siguiendo([a, [a[0] + dx / 3, a[1] + dy / 3], [a[0] + (2 * dx) / 3, a[1] + (2 * dy) / 3], b], { n: Math.max(4, Math.round(anchoMedio / 2.6)), separacion: 2.5, semilla });
  return { contorno, dibujo: plancha(id, poli(contorno), { negro: T.negro, papel: T.papel, tallas: tallar(lineas, luz, { ancho: 2.6, umbral: [0.15, 0.85], punta: 10, semilla: semilla + 1 }), caja: cajaDe(contorno) }) };
}

/** La manga corta de la remera, del hombro a medio brazo. */
function manga(id: string, hombro: P, hasta: P, prendida: number, semilla: number): string {
  const contorno = tramo(hombro, hasta, 28, 24);
  const luz = tono(0, [bola([hombro[0] - 3, hombro[1] + 6], [16, 20], LUZ, prendida)]);
  const lineas = siguiendo([hombro, [hombro[0] + (hasta[0] - hombro[0]) / 3, hombro[1] + (hasta[1] - hombro[1]) / 3], [hombro[0] + (2 * (hasta[0] - hombro[0])) / 3, hombro[1] + (2 * (hasta[1] - hombro[1])) / 3], hasta], { n: 6, separacion: 3.4, semilla });
  // El ruedo de la manga.
  const ruedo = trazo([[hasta[0] - 13, hasta[1] - 1], [hasta[0], hasta[1] + 1], [hasta[0] + 13, hasta[1] - 1]], 1.2, semilla + 2);
  return plancha(id, poli(contorno), { negro: T.negro, papel: T.gris, tallas: tallar(lineas, luz, { ancho: 2.4, umbral: [0.18, 0.9], punta: 10, semilla: semilla + 1 }), blancos: ruedo, caja: cajaDe(contorno) });
}

/** Una mano cerrada: agarra la muñeca del otro brazo o el barrote. Los nudillos de frente, el pulgar encima. */
function puno([cx, cy]: P, lado: number, prendida: number, semilla: number): string {
  const forma = curva([[cx - 9, cy - 8], [cx + 8, cy - 9], [cx + 11, cy - 1], [cx + 9, cy + 8], [cx - 2, cy + 10], [cx - 10, cy + 6], [cx - 11, cy - 2]]);
  const dedos = [0, 1, 2].map((i) => trazo([[cx - 7, cy - 2 + i * 3.6], [cx + 1, cy - 1.4 + i * 3.6], [cx + 9, cy - 2.6 + i * 3.6]], 0.8, semilla + i)).join('');
  const pulgar = trazo(cubica([[cx - lado * 9, cy - 6], [cx - lado * 3, cy - 8.5], [cx + lado * 4, cy - 7.5], [cx + lado * 8, cy - 4]]), 1.2, semilla + 5);
  // La sombra del lado que no ve la luz.
  const sombra = trazo([[cx + 10, cy - 4], [cx + 9.5, cy + 4], [cx + 4, cy + 9]], prendida > 0.6 ? 1.6 : 3, semilla + 6);
  return `<g filter="url(#gubia)"><path d="${forma}" fill="${T.papel}"/><path d="${dedos + pulgar + sombra}" fill="${T.negro}"/></g>`;
}

const [H1, H2] = A.hombros;
const [E1, E2] = A.codos;
const [M1, M2] = A.manos;
/** Dónde termina la manga corta en cada brazo, a un tercio del hombro al codo. */
const mangaHasta = (h: P, e: P): P => [h[0] + (e[0] - h[0]) * 0.42, h[1] + (e[1] - h[1]) * 0.42];

function brazo1(): { dibujo: string; caja: readonly [number, number, number, number] } {
  const p = piel('es-brazo-1', mangaHasta(H1, E1), E1, 21, 18, 1, 1041);
  return { dibujo: p.dibujo + manga('es-manga-1', H1, mangaHasta(H1, E1), 1, 1043), caja: cajaDe([...p.contorno, ...tramo(H1, mangaHasta(H1, E1), 28, 24)], 3) };
}

function antebrazo1(): { dibujo: string; caja: readonly [number, number, number, number] } {
  const munieca: P = [M1[0] - 8, M1[1] + 0.5];
  const p = piel('es-antebrazo-1', E1, munieca, 18, 14, 1, 1051);
  return { dibujo: p.dibujo + puno(M1, 1, 1, 1053), caja: cajaDe([...p.contorno, [M1[0] - 13, M1[1] - 12], [M1[0] + 13, M1[1] + 12]], 3) };
}

function brazo2(): { dibujo: string; caja: readonly [number, number, number, number] } {
  const p1 = piel('es-brazo-2', mangaHasta(H2, E2), E2, 20, 17, 0.45, 1061);
  const munieca: P = [M2[0] + 8, M2[1]];
  const p2 = piel('es-antebrazo-2', E2, munieca, 17, 13, 0.55, 1063);
  return {
    dibujo: p1.dibujo + manga('es-manga-2', H2, mangaHasta(H2, E2), 0.45, 1065) + p2.dibujo + puno(M2, -1, 0.5, 1067),
    caja: cajaDe([...p1.contorno, ...p2.contorno, ...tramo(H2, mangaHasta(H2, E2), 28, 24), [M2[0] - 13, M2[1] - 12], [M2[0] + 13, M2[1] + 12]], 3),
  };
}

/* ------------------------------------------------------------------
   La cadena, el catre y la reja de la celda
   ------------------------------------------------------------------ */

/** Por dónde cuelga la cadena: del grillete, por encima del canto del catre, y para abajo, a lo oscuro. */
const EJE_CADENA: readonly P[] = cubica([[A.grillete[0], A.grillete[1] + 4], [-46, -18], [-50, 10], [-47, 92]], 40);

function cadena(): string {
  // Los eslabones, uno parado y otro de canto, a lo largo del eje. Se apagan a medida que bajan a lo
  // oscuro de abajo del catre.
  const largo = (() => {
    let s = 0;
    for (let i = 1; i < EJE_CADENA.length; i++) s += Math.hypot(EJE_CADENA[i]![0] - EJE_CADENA[i - 1]![0], EJE_CADENA[i]![1] - EJE_CADENA[i - 1]![1]);
    return s;
  })();
  const en = (d: number): { p: P; a: number } => {
    let s = 0;
    for (let i = 1; i < EJE_CADENA.length; i++) {
      const [a, b] = [EJE_CADENA[i - 1]!, EJE_CADENA[i]!];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (s + l >= d) {
        const t = (d - s) / l;
        return { p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], a: Math.atan2(b[1] - a[1], b[0] - a[0]) };
      }
      s += l;
    }
    return { p: EJE_CADENA.at(-1)!, a: Math.PI / 2 };
  };
  const eslabones: P[][] = [];
  const paso = 6.2;
  for (let i = 0, d = 3; d < largo - 2; i++, d += paso) {
    const { p: [x, y], a } = en(d);
    const parado = i % 2 === 0;
    const [ra, rb] = parado ? [4.6, 2.8] : [4.6, 1.1];
    const pts: P[] = [];
    for (let k = 0; k <= 18; k++) {
      const t = (k / 18) * Math.PI * 2;
      const [u, v] = [Math.cos(t) * ra, Math.sin(t) * rb];
      pts.push([x + u * Math.cos(a) - v * Math.sin(a), y + u * Math.sin(a) + v * Math.cos(a)]);
    }
    eslabones.push(pts);
  }
  // La luz: arriba, la de la ventana; abajo del catre, nada.
  const luz = (x: number, y: number): number => Math.max(0, Math.min(1, (24 - y) / 70)) * (0.75 + 0.25 * Math.sin(x * 0.7));
  const hierro = eslabones.map((e) => trazo(e, 2.2, 1071, () => 1)).join('');
  return `<g filter="url(#gubia)"><path d="${hierro}" fill="${T.negro}"/><path d="${tallar(eslabones, luz, { ancho: 1.4, umbral: [0.05, 0.7], punta: 2, pulso: 0.2, semilla: 1072 })}" fill="${T.gris}"/></g>`;
}

/** El catre: una tabla colgada de la pared, con dos ménsulas de hierro. */
function catre(): string {
  const tabla: P[] = [[-66, -5], [68, -5], [70, 3], [70, 14], [-64, 14], [-64, 3]];
  const vetas = paralelas([-66, 3, 136, 11], { angulo: 0, paso: 2.6, semilla: 1081 });
  const luz = tono(0.1, [{ c: [-40, 8], r: [60, 10], peso: 0.6, blando: 1 }]);
  // El canto de arriba, de frente a la luz, y las ménsulas, que se pierden en lo oscuro.
  const canto = trazo([[-64, 2.4], [0, 2], [70, 2.4]], 2.6, 1082, (t) => 1 - t * 0.55);
  const mensulas = trazo([[-50, 14], [-55, 30], [-60, 44]], 2.4, 1083, (t) => (1 - t) ** 1.5) + trazo([[54, 14], [59, 30], [64, 44]], 2.4, 1084, (t) => (1 - t) ** 1.5);
  return (
    plancha('es-catre', poli(tabla), { negro: T.negro, papel: T.gris, tallas: tallar(vetas, luz, { ancho: 1.6, umbral: [0.1, 0.9], punta: 14, pulso: 0.6, semilla: 1085 }), caja: cajaDe(tabla, 2), motas: false }) +
    // El canto de la tabla, de frente a la luz: la raya blanca donde está sentado.
    `<g filter="url(#gubia)"><path d="${canto}" fill="${T.papel}"/><path d="${mensulas}" fill="${T.gris}"/></g>`
  );
}

/**
 * La reja de la celda, de vuelta, delante de él. La celda la talla `prisionLejos` en el fondo, así que
 * lo que se meta adentro queda encima de sus barrotes: estos son los mismos (`celda`, en
 * `arte-prision.ts`, con los mismos números y la misma semilla), y van delante. El test mira que sean
 * idénticos a los de atrás.
 */
export function rejaDeLaCelda(): string {
  const { lado, u0, u1, alto } = CELDA;
  const tinta = T.gris;
  const semilla = CELDA.semilla;
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
  // Sin el hueco negro de `celda`, que lo taparía a él: solo los hierros.
  return (
    `<g filter="url(#gubia)"><path d="${barrotes + travesanio(alto * 0.18) + travesanio(alto * 0.82)}" fill="${tinta}"/>` +
    `<path d="${trazo([enPared(lado, u0, 0), enPared(lado, u0, alto), enPared(lado, u1, alto)], 4 * (1 - u0 * 0.6), semilla + 50, () => 1)}" fill="${tinta}"/></g>`
  );
}

/* ------------------------------------------------------------------
   Las piezas
   ------------------------------------------------------------------ */

const B1 = brazo1();
const AB1 = antebrazo1();
const B2 = brazo2();

/**
 * La densidad la pide la ficha, que lo muestra de cerca: a la escala de la escena sobra. La cabeza va
 * más fina, que es donde está todo.
 */
const D = 4.2;

export const PIEZAS_ESCLAVO: readonly Pieza[] = [
  { nombre: 'esclavo-catre', caja: [-68, -7, 140, 54], dibujo: catre(), densidad: 2.6 },
  { nombre: 'esclavo-cuerpo', caja: cajaDe([...REMERA, ...CUELLO], 3), dibujo: cuerpo(), densidad: D },
  { nombre: 'esclavo-boca', caja: cajaDe([C(-14, BOCA - 3), C(12, BOCA + 13)].map(aLaMedida), 2), dibujo: boca(), densidad: 6 },
  { nombre: 'esclavo-quijada', caja: cajaDe(QUIJADA.map(aLaMedida), 3), dibujo: quijada(), densidad: 6 },
  { nombre: 'esclavo-cabeza', caja: cajaDe([...PELO, ...FLEQUILLO, ...CARA].map(aLaMedida), 4), dibujo: cabeza(), densidad: 6 },
  { nombre: 'esclavo-piernas', caja: cajaDe([...PIERNA_1, ...PIERNA_2, ...PIE_1, ...PIE_2], 4), dibujo: piernas(), densidad: D },
  { nombre: 'esclavo-cadena', caja: cajaDe(EJE_CADENA, 8), dibujo: cadena(), densidad: D },
  { nombre: 'esclavo-brazo-2', caja: B2.caja, dibujo: B2.dibujo, densidad: D },
  { nombre: 'esclavo-brazo-1', caja: B1.caja, dibujo: B1.dibujo, densidad: D },
  { nombre: 'esclavo-antebrazo-1', caja: AB1.caja, dibujo: AB1.dibujo, densidad: D },
  { nombre: 'esclavo-reja', caja: cajaDe(HUECO, 6), dibujo: rejaDeLaCelda(), densidad: 3 },
];

const img = imagenesDe(PIEZAS_ESCLAVO);
const parte = (nombre: string, cuerpo: string, transform = ''): string => `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}>${cuerpo}</g>`;

/** Los ojos de la página: la pupila que mira, el párpado que baja, el rojo de abajo y la lágrima. */
function ojos(t: Readonly<Record<string, string>>): string {
  const rnd = (v: number): string => (Math.round(v * 100) / 100).toString();
  let s = '';
  for (const [i, { centro: [cx, cy], radio: [rx, ry] }] of A.ojos.entries()) {
    const n = i + 1;
    const [px, py] = PIVOTES_PARPADO[i]!;
    s +=
      `<clipPath id="esclavo-ojo-${n}"><path d="${almendra(A.ojos[i]!, i)}"/></clipPath>` +
      `<g clip-path="url(#esclavo-ojo-${n})"><g data-parte="pupila-${n}" transform="${t[`pupila-${n}`]}">` +
      `<circle cx="${cx}" cy="${cy}" r="${rnd(ry * 0.98)}" class="bt-esclavo-pupila"/>` +
      `<circle cx="${rnd(cx - ry * 0.34)}" cy="${rnd(cy - ry * 0.36)}" r="${rnd(ry * 0.24)}" class="bt-esclavo-brillo"/></g>` +
      `<ellipse data-parte="parpado-${n}" data-pivote="${px} ${py}" cx="${cx}" cy="${rnd(cy - 0.2)}" rx="${rnd(rx + 1.4)}" ry="${rnd(ry + 1.2)}" class="bt-esclavo-parpado" transform="${t[`parpado-${n}`]}"/></g>`;
  }
  // Los ojos al rojo vivo: el borde de abajo de cada ojo, irritado de llorar.
  const rojo = A.ojos
    .map(({ centro: [cx, cy], radio: [rx, ry] }, i) => {
      const caida = i === 0 ? -1 : 1;
      return `M${rnd(cx - rx * 0.95)} ${rnd(cy + ry * 0.7 + (caida < 0 ? 1 : 0))} Q${rnd(cx)} ${rnd(cy + ry * 2.1)} ${rnd(cx + rx * 0.98)} ${rnd(cy + ry * 0.75 + (caida > 0 ? 1 : 0))} Q${rnd(cx)} ${rnd(cy + ry * 1.25)} ${rnd(cx - rx * 0.95)} ${rnd(cy + ry * 0.7 + (caida < 0 ? 1 : 0))} Z`;
    })
    .join(' ');
  // La lágrima: una gota parada en el borde del ojo de la ventana.
  const [lx, ly] = LAGRIMA.asoma;
  const gota = `M${lx} ${rnd(ly - 0.6)} Q${rnd(lx + 1.9)} ${rnd(ly + 2.4)} ${lx} ${rnd(ly + 3.6)} Q${rnd(lx - 1.9)} ${rnd(ly + 2.4)} ${lx} ${rnd(ly - 0.6)} Z`;
  return (
    s +
    `<path data-parte="rojo" d="${rojo}" class="bt-esclavo-rojo" opacity="${t.rojo}"/>` +
    `<g data-parte="lagrima" transform="${t.lagrima}"><path d="${gota}" class="bt-esclavo-lagrima"/></g>`
  );
}

/** El esclavo armado con las transformaciones de un gesto (`transformes`, `rig-esclavo.ts`). */
function armado(t: Readonly<Record<string, string>>): string {
  return (
    img('esclavo-catre') +
    parte('torso', img('esclavo-cuerpo') + parte('cabeza', img('esclavo-boca') + parte('quijada', img('esclavo-quijada'), t.quijada) + img('esclavo-cabeza') + ojos(t), t.cabeza), t.torso) +
    img('esclavo-piernas') +
    parte('cadena', img('esclavo-cadena'), t.cadena) +
    parte('brazos', img('esclavo-brazo-2') + parte('brazo-1', img('esclavo-brazo-1') + parte('antebrazo-1', img('esclavo-antebrazo-1'), t['antebrazo-1']), t['brazo-1']), t.brazos)
  );
}

/** Lo de adentro de la celda se ve por el hueco: lo de afuera es pared. */
const RECORTE = `<clipPath id="esclavo-hueco"><path d="${poli(HUECO)}"/></clipPath>`;

/** El esclavo en cualquier gesto, sin lo que lo hace tocable: para el test, para el retrato y para mirarlo. */
export function esclavoEn(gesto: Gesto | 'calle' | 'chillido' | 'rodillas' | 'vos' = 'calle'): string {
  const t = transformes(gesto);
  return `${RECORTE}<g clip-path="url(#esclavo-hueco)"><g transform="${t.entero}">${armado(t)}</g></g>${img('esclavo-reja')}`;
}

/** El títere que se toca, en la pose quieta: mira la calle, con la lágrima parada en el ojo. */
function titere(nombres: ReadonlyMap<string, string>): string {
  const t = transformes('calle');
  return (
    RECORTE +
    `<g clip-path="url(#esclavo-hueco)">` +
    `<g class="titere titere--esclavo" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El esclavo sensible y chillón'}">` +
    `<g data-parte="entero" transform="${t.entero}">${armado(t)}</g>` +
    `</g></g>` +
    `<g pointer-events="none">${img('esclavo-reja')}</g>`
  );
}

/**
 * El retrato de la ficha: su celda en la pared del pasillo, con él adentro, la lágrima parada en el
 * ojo y la reja adelante. El fondo es el de la prisión, que la página ya cargó.
 */
export const RETRATO = { caja: [E.x - 60, HUECO[3]![1] - 10, 120, 186] as const };
function retrato(): string {
  return `<image href="/bestiario/prision-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` + esclavoEn('calle');
}

export const ESCLAVO: Personaje = {
  id: ID,
  region: 'la-prision',
  ancla: E.x,
  piezas: PIEZAS_ESCLAVO,
  capas: { atras: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
