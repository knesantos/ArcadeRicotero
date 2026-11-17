/**
 * El bajo, anegado de verdad (`D-91`, tanda 4): el agua que se lee, y un fondo que se hunde.
 *
 * La sala (`bajoLejos`), el agua (`bajoAgua`), lo que flota adelante y todos los que viven ahí son de
 * `arte-bajo.ts` y `escenas.ts`, y acá no se editan: otra sesión los está tocando (`T-529`). El bajo era azul
 * parejo de punta a punta: la pared y el agua, del mismo valor. Lo que el camino pinta por su cuenta:
 *
 * - **El pasillo** (`anegadoFondo`): un vano en la pared, a la entrada, y detrás un pasillo inundado que se
 *   pierde: tres marcos cada vez más chicos y más fríos, y al fondo una lamparita prendida que el agua
 *   devuelve en una escalera de rayas. Es el punto de fuga, y lo primero que se ve al llegar.
 * - **La marca del agua**: la pared está mojada hasta donde llegó la crecida, con el salitre arriba y lo
 *   que chorreó. Abajo de la marca la pared es más oscura: ahí termina la sala y empieza el agua.
 * - **La línea de flote**: una raya de luz rota contra la pared, lo negro que la pared deja en el agua, y
 *   las ondas en escorzo (cortas y apretadas contra el fondo, largas adelante).
 * - **Lo que flota y se mece** (`FLOTAN`): una silla de bar patas arriba y un bombín. La isla los hamaca.
 * - **El que está en el pasillo** (`FIGURA`): si te quedás quieto, hay alguien parado en el agua, a contraluz.
 *
 * Es crayón, como la contratapa de *Un baión*. La mano entra después del agua de atrás (`bajo-agua`), así
 * queda debajo de Pierre y de todos; la escena vuelve a pintar el agua de la línea de Pierre para abajo, y
 * por eso lo de acá vive de ahí para arriba. Lo que flota va encima de todo, en los huecos.
 * Nada de esto viene de una letra.
 */

import { forma, nube, trazo, type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';
import { BAJO, PIERRE, marcoDelRecinto } from './rig.ts';

const B = {
  noche: 'var(--entorno-baion-noche)',
  violeta: 'var(--entorno-baion-violeta)',
  lila: 'var(--entorno-baion-lila)',
  luzFria: 'var(--entorno-baion-luz)',
  azul: 'var(--entorno-baion-azul)',
  rosa: 'var(--entorno-baion-rosa)',
  agua: 'var(--entorno-bajo-agua)',
  celeste: 'var(--entorno-bajo-celeste)',
  llama: 'var(--entorno-bajo-llama)',
  llamaClara: 'var(--entorno-bajo-llama-clara)',
  verde: 'var(--bestia-pierre-verde)',
  crema: 'var(--disco-gulp-apoyo)',
  negro: 'var(--fondo)',
};

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const SALA = marcoDelRecinto('el-bajo');
const [S0, S1] = [SALA.x, SALA.x + SALA.ancho];

/** El vano del pasillo, en la pared: de dónde a dónde, y el punto al que fuga todo lo de adentro. */
export const PASILLO = { x0: -116, x1: -10, arriba: 150, fuga: [-58, 302] } as const;
/** Hasta dónde llegó la crecida: la marca en la pared. */
export const MARCA = 318;
/** Donde empieza el escenario de la sala (`escenario()` en `arte-bajo.ts`, corrido 250): de ahí en adelante no hay pared que mojar. */
export const ESCENARIO = 976;
/** La caja de la mano del fondo: del dintel del pasillo a la línea de Pierre, donde la escena repinta el agua. */
export const CAJA_DEL_FONDO = [S0, 140, SALA.ancho, PIERRE.agua - 140 + 4] as const;

/** Rayones de crayón acostados (o parados, con `angulo`). */
function rayado([x0, y0, x1, y1]: readonly [number, number, number, number], cuantos: number, colores: readonly string[], semilla: number, o: { angulo?: number; largo?: readonly [number, number]; grueso?: readonly [number, number]; opacidad?: readonly [number, number]; temblor?: number; donde?: (x: number, y: number) => boolean } = {}): string {
  const { angulo = 0, largo = [8, 30], grueso = [1.2, 2.6], opacidad = [0.35, 0.8], temblor = 0.05, donde } = o;
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < cuantos; i++) {
    const x = x0 + rnd() * (x1 - x0);
    const y = y0 + rnd() * (y1 - y0);
    const a = ((angulo + (rnd() - 0.5) * temblor * 90) * Math.PI) / 180;
    const l = largo[0] + rnd() * (largo[1] - largo[0]);
    const color = colores[Math.floor(rnd() * colores.length)]!;
    const w = grueso[0] + rnd() * (grueso[1] - grueso[0]);
    const op = opacidad[0] + rnd() * (opacidad[1] - opacidad[0]);
    if (donde && !donde(x, y)) continue;
    s += trazo(`M${f(x)} ${f(y)} l${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}`, color, w, op);
  }
  return s;
}

/** Una línea de fibra temblada a mano, como el contorno de las cosas de la sala. */
function fibra(pts: readonly (readonly [number, number])[], ancho: number, semilla: number, color: string, o = 1): string {
  const rnd = azar(semilla);
  return trazo(pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x + (rnd() - 0.5) * 2)} ${f(y + (rnd() - 0.5) * 2)}`).join(' '), color, ancho, o);
}

/** Un punto del pasillo a una hondura `t` (0, el vano; 1, el punto de fuga), desde un punto del vano. */
const hondo = ([x, y]: readonly [number, number], t: number): readonly [number, number] => [x + (PASILLO.fuga[0] - x) * t, y + (PASILLO.fuga[1] - y) * t];

/** Dónde pisa el agua alguien parado en el pasillo a hondura `t`, y cuánto mide de alto el pasillo ahí. */
export const enElPasillo = (t: number): { x: number; agua: number; alto: number } => ({
  x: hondo([(PASILLO.x0 + PASILLO.x1) / 2, BAJO.fondo], t)[0],
  agua: hondo([0, BAJO.fondo], t)[1],
  alto: (BAJO.fondo - PASILLO.arriba) * (1 - t),
});

function pasillo(): string {
  const { x0, x1, arriba } = PASILLO;
  const agua = BAJO.fondo;
  const vano = `M${x0} ${agua + 2} L${x0 + 1.5} ${arriba + 2} L${x1 - 1} ${arriba} L${x1} ${agua + 2} Z`;
  const esquinas = [[x0, arriba], [x1, arriba], [x1, agua], [x0, agua]] as const;
  const marco = (t: number): readonly (readonly [number, number])[] => esquinas.map((e) => hondo(e, t));
  const poli = (ps: readonly (readonly [number, number])[]): string => `M${ps.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;
  const FONDO = 0.84;
  const [a0, a1, a2, a3] = marco(0);
  const [b0, b1, b2, b3] = marco(FONDO);
  let s =
    forma(vano, B.negro) +
    // Las dos paredes, el techo y el agua: cuatro paños que se juntan en el fondo. Lo lejano, más claro y más frío.
    forma(poli([a0!, b0!, b3!, a3!]), B.noche) +
    forma(poli([a1!, b1!, b2!, a2!]), B.violeta, 0.55) +
    forma(poli([a0!, a1!, b1!, b0!]), B.negro) +
    forma(poli([a3!, a2!, b2!, b3!]), B.negro) +
    nube(PASILLO.fuga[0], PASILLO.fuga[1] - 6, 30, 46, B.celeste, 'm', 0.42) +
    nube(PASILLO.fuga[0], PASILLO.fuga[1], 16, 22, B.luzFria, 's', 0.22);
  // El cuarto del fondo: la puerta abierta y la lamparita, con su halo.
  const [p0, p1, p2, p3] = marco(FONDO + 0.02);
  const luz = [(p0![0] + p1![0]) / 2 + 1.5, p0![1] + (p3![1] - p0![1]) * 0.3] as const;
  s +=
    forma(poli([p0!, p1!, p2!, p3!]), B.llama, 0.5) +
    nube(luz[0], luz[1] + 2, 9, 11, B.llama, 's', 0.8) +
    nube(luz[0], luz[1], 3.4, 3.8, B.llamaClara, 'xs') +
    trazo(`M${f(luz[0])} ${f(p0![1])} L${f(luz[0])} ${f(luz[1] - 3)}`, B.negro, 0.8);
  // Los marcos de las puertas del pasillo: cada uno más chico, más fino y más claro que el anterior.
  [0.3, 0.56, 0.74].forEach((t, i) => {
    const [m0, m1, m2, m3] = marco(t);
    const ancho = (1 - t) * 7;
    s +=
      trazo(`M${f(m3![0])} ${f(m3![1])} L${f(m0![0])} ${f(m0![1])} L${f(m1![0])} ${f(m1![1])} L${f(m2![0])} ${f(m2![1])}`, B.negro, ancho) +
      // El canto que mira a la lamparita, tocado.
      trazo(`M${f(m3![0] + ancho * 0.5)} ${f(m3![1])} L${f(m0![0] + ancho * 0.5)} ${f(m0![1] + ancho * 0.5)} L${f(m1![0] - ancho * 0.5)} ${f(m1![1] + ancho * 0.5)} L${f(m2![0] - ancho * 0.5)} ${f(m2![1])}`, i === 2 ? B.llama : B.rosa, 1.1, 0.4 + i * 0.2);
  });
  // El agua del pasillo: la lamparita devuelta en una escalera de rayas, cada una más ancha y más floja hacia acá.
  const rnd = azar(5107);
  for (let k = 0; k < 15; k++) {
    const t = FONDO - (k / 14) * FONDO;
    const y = hondo([0, agua], t)[1] + 0.6;
    const cx = hondo([(x0 + x1) / 2, agua], t)[0] + 1.5 + (rnd() - 0.5) * (1 - t) * 9;
    const w = 5 + (1 - t) * 30 * (0.6 + rnd() * 0.6);
    s += trazo(`M${f(cx - w / 2)} ${f(y)} l${f(w)} 0`, k < 5 ? B.llamaClara : k % 3 ? B.llama : B.llamaClara, 0.9 + (1 - t) * 1.5, 0.85 - (1 - t) * 0.45);
  }
  // Lo que se junta en un pasillo inundado: rayas frías contra las paredes, en escorzo.
  for (let k = 0; k < 16; k++) {
    const t = rnd() * 0.7;
    const lado = k % 2 ? 0.14 : 0.86;
    const y = hondo([0, agua], t)[1] - 0.5;
    const x = hondo([x0 + (x1 - x0) * lado, agua], t)[0];
    const w = (1 - t) * (8 + rnd() * 12);
    s += trazo(`M${f(x - w / 2)} ${f(y)} l${f(w)} 0`, rnd() < 0.5 ? B.celeste : B.lila, 0.8 + (1 - t), 0.3 + rnd() * 0.3);
  }
  return (
    `<clipPath id="an-vano"><path d="${vano}"/></clipPath><g clip-path="url(#an-vano)">${s}</g>` +
    // El marco del vano: madera oscura, con la fibra rosa de la puerta de la sala.
    trazo(`M${x0} ${agua + 2} L${x0 + 1.5} ${arriba + 2} L${x1 - 1} ${arriba} L${x1} ${agua + 2}`, B.negro, 9) +
    fibra([[x0 - 3, agua], [x0 - 1.6, arriba - 2], [x1 + 2, arriba - 4], [x1 + 3, agua]], 1.6, 5111, B.rosa, 0.8) +
    fibra([[x0 + 4, agua], [x0 + 5, arriba + 6], [x1 - 5, arriba + 4], [x1 - 4, agua]], 1.2, 5113, B.violeta, 0.9) +
    // La luz del pasillo, que sale por el vano y se derrama en el agua de la sala.
    rayado([x0 + 26, agua + 4, x1 - 20, agua + 64], 26, [B.llama, B.llamaClara, B.llama], 5121, { largo: [10, 34], grueso: [1.2, 2.4], opacidad: [0.3, 0.75] }) +
    nube((x0 + x1) / 2, agua + 30, 44, 34, B.llama, 'l', 0.16)
  );
}

/** La marca de la crecida: lo mojado, el salitre arriba y lo que chorreó. No pasa por delante del pasillo. */
function marcaDelAgua(): string {
  const rnd = azar(5201);
  const agua = BAJO.fondo;
  // No pasa por el vano del pasillo, ni por delante del escenario, que está más acá que la pared.
  const enElVano = (x: number): boolean => (x > PASILLO.x0 - 8 && x < PASILLO.x1 + 8) || x > ESCENARIO;
  // El canto de arriba de lo mojado, a mano: sube y baja unos pocos puntos.
  const canto: [number, number][] = [];
  for (let x = S0 - 10; x <= S1 + 10; x += 22) canto.push([x, MARCA + (rnd() - 0.5) * 9 + Math.sin(x / 90) * 3]);
  const hastaElEscenario = canto.filter(([x]) => x <= ESCENARIO);
  const mojado = `M${hastaElEscenario.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} L${ESCENARIO} ${agua + 2} L${S0 - 10} ${agua + 2} Z`;
  let salitre = '';
  let chorros = '';
  for (let i = 0; i < canto.length - 1; i++) {
    const [x, y] = canto[i]!;
    if (enElVano(x) || enElVano(x + 22)) continue;
    // El salitre: motas cortas y acostadas, en dos o tres alturas, que no llegan a ser una raya.
    const [, y1] = canto[i + 1]!;
    for (let k = 0; k < 5; k++) {
      const u = rnd();
      salitre += trazo(`M${f(x + u * 22)} ${f(y + (y1 - y) * u - 1 + rnd() * 6)} l${f(3 + rnd() * 7)} 0`, rnd() < 0.5 ? B.luzFria : B.lila, 1 + rnd() * 1.2, 0.14 + rnd() * 0.22);
    }
    if (rnd() < 0.2) chorros += trazo(`M${f(x + rnd() * 20)} ${f(y + 4)} l${f((rnd() - 0.5) * 2)} ${f(10 + rnd() * 26)}`, B.celeste, 0.9 + rnd(), 0.14 + rnd() * 0.14);
  }
  return (
    `<clipPath id="an-mojado"><path d="${mojado}"/></clipPath>` +
    `<g clip-path="url(#an-mojado)">` +
    forma(mojado, B.noche, 0.44) +
    // Más negro contra el agua: es lo que despega la pared de lo que tiene abajo.
    `<rect x="${S0 - 10}" y="${agua - 22}" width="${SALA.ancho + 20}" height="26" fill="${B.negro}" opacity="0.4" filter="url(#soplo-m)"/>` +
    // El verdín, en manchones, donde el agua se quedó más tiempo.
    [-196, 262, 640, 904].map((x, i) => nube(x, agua - 14, 70 + (i % 3) * 30, 16, B.verde, 'l', 0.1)).join('') +
    rayado([S0, MARCA + 6, ESCENARIO, agua], 200, [B.noche, B.agua, B.violeta], 5211, { angulo: 90, largo: [8, 26], grueso: [1.6, 3.4], opacidad: [0.22, 0.5], temblor: 0.06, donde: (x) => !enElVano(x) }) +
    `</g>` +
    salitre +
    chorros
  );
}

/** El agua del fondo, de la pared a la línea de Pierre: la línea de flote, lo negro de la pared y las ondas en escorzo. */
function aguaDelFondo(): string {
  const agua = BAJO.fondo;
  const hasta = PIERRE.agua + 4;
  const fueraDelVano = (x: number): boolean => x < PASILLO.x0 - 4 || x > PASILLO.x1 + 4;
  let ondas = '';
  // Seis franjas: contra la pared, rayas cortas, finas y muchas; hacia acá, largas, gruesas y pocas.
  for (let b = 0; b < 6; b++) {
    const k = b / 5;
    const y0 = agua + 12 + (hasta - agua - 12) * k ** 1.5;
    const y1 = agua + 12 + (hasta - agua - 12) * ((b + 1) / 5) ** 1.5;
    ondas += rayado([S0, y0, S1, Math.min(hasta, y1)], Math.round(64 - k * 36), [B.celeste, B.celeste, B.lila, B.agua], 5300 + b, {
      largo: [8 + k * 26, 22 + k * 70],
      grueso: [0.8 + k * 0.9, 1.5 + k * 1.6],
      opacidad: [0.22, 0.5 + k * 0.18],
      temblor: 0.02,
    });
  }
  return (
    // Lo que la pared deja en el agua: una franja negra pegada a ella, que se afloja hacia acá.
    `<rect x="${S0 - 10}" y="${agua - 2}" width="${SALA.ancho + 20}" height="20" fill="${B.negro}" opacity="0.62" filter="url(#soplo-s)"/>` +
    `<rect x="${S0 - 10}" y="${agua + 10}" width="${SALA.ancho + 20}" height="38" fill="${B.negro}" opacity="0.3" filter="url(#soplo-l)"/>` +
    // El agua estancada tira a verde, apenas, y solo lejos.
    [-60, 420, 820, 1120].map((x) => nube(x, agua + 34, 180, 22, B.verde, 'xl', 0.07)).join('') +
    ondas +
    // La línea de flote: una raya clara, rota, de punta a punta. Es lo que más se lee de lejos.
    rayado([S0, agua - 1, S1, agua + 1.6], 150, [B.luzFria, B.luzFria, B.celeste], 5321, { largo: [10, 34], grueso: [1.3, 2.4], opacidad: [0.5, 0.95], temblor: 0.015, donde: fueraDelVano }) +
    rayado([S0, agua + 3, S1, agua + 8], 90, [B.celeste, B.lila], 5323, { largo: [6, 20], grueso: [0.9, 1.6], opacidad: [0.3, 0.6], temblor: 0.015, donde: fueraDelVano })
  );
}

/** Lo que asoma del agua contra la pared, en el hueco entre el rato y Pierre: el respaldo de una silla y una botella parada. */
function loQueAsoma(): string {
  const agua = BAJO.fondo;
  const x = 222;
  return (
    forma(`M${x} ${agua + 14} L${x + 1} ${agua - 20} L${x + 5} ${agua - 20} L${x + 5} ${agua + 14} Z M${x + 22} ${agua + 15} L${x + 22} ${agua - 22} L${x + 26} ${agua - 22} L${x + 27} ${agua + 15} Z M${x + 2} ${agua - 17} L${x + 25} ${agua - 19} L${x + 25} ${agua - 12} L${x + 2} ${agua - 10} Z M${x + 2} ${agua - 4} L${x + 25} ${agua - 6} L${x + 25} ${agua - 1} L${x + 2} ${agua + 1} Z`, B.negro) +
    fibra([[x + 1, agua + 12], [x + 2, agua - 20], [x + 24, agua - 22]], 1.4, 5401, B.rosa, 0.8) +
    // Su reflejo, cortado.
    [0, 1, 2].map((i) => trazo(`M${x + (i % 2 ? 2 : -1)} ${agua + 18 + i * 5} l${26 - i * 4} 0`, B.negro, 2.2, 0.6 - i * 0.14)).join('')
  );
}

/** La mano del fondo del bajo: entra después del agua de atrás (`bajo-agua`) y antes de todos los demás. */
export function anegadoFondo(): string {
  const [x0, y0, w, h] = CAJA_DEL_FONDO;
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="var(--fondo)" fill-opacity="0"/>` +
    marcaDelAgua() +
    aguaDelFondo() +
    pasillo() +
    loQueAsoma() +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   El agua de adelante (segunda vuelta)
   ------------------------------------------------------------------
   De la línea de Pierre para abajo la escena repinta el agua (`bajo-agua`, recortada) y tapaba todo lo
   del fondo: el agua de adelante seguía siendo el paño parejo. Esta mano entra **después de ese repintado**
   y antes de los que están parados en el agua, así que les queda debajo a todos menos a Pierre, al que le
   tapa la panza como el agua. Sigue el escorzo del fondo: las rayas son cada vez más largas y gruesas.
*/

/** La caja del agua de adelante: de la línea de Pierre al borde de abajo. */
export const CAJA_DE_ADELANTE = [S0, PIERRE.agua - 4, SALA.ancho, 640 - PIERRE.agua + 4] as const;

export function anegadoCerca(): string {
  const [x0, y0, w, h] = CAJA_DE_ADELANTE;
  const desde = PIERRE.agua;
  let ondas = '';
  // Cinco franjas, cada una con sus lomos claros y, debajo de cada lomo, lo negro del valle.
  for (let b = 0; b < 5; b++) {
    const k = b / 4;
    const ya = desde + 4 + (640 - desde) * k ** 1.3 * 0.86;
    const yb = desde + 4 + (640 - desde) * ((b + 1) / 4) ** 1.3 * 0.86;
    const cuantos = Math.round(40 - k * 22);
    ondas +=
      rayado([S0, ya + 3, S1, Math.min(640, yb) + 3], cuantos, [B.negro, B.noche], 5700 + b, { largo: [50 + k * 60, 110 + k * 150], grueso: [2 + k * 2, 3.4 + k * 3.4], opacidad: [0.3, 0.6], temblor: 0.02 }) +
      rayado([S0, ya, S1, Math.min(640, yb)], cuantos, [B.celeste, B.celeste, B.lila, B.luzFria], 5710 + b, { largo: [40 + k * 50, 90 + k * 130], grueso: [1.4 + k * 1.2, 2.4 + k * 2], opacidad: [0.32, 0.62 + k * 0.14], temblor: 0.02 });
  }
  // Lo que se junta donde el agua no corre: corchos, papeles y hojas, en un montón.
  const rnd = azar(5731);
  let resaca = nube(668, 584, 46, 9, B.negro, 'm', 0.5);
  for (let i = 0; i < 26; i++) {
    const [x, y] = [668 + (rnd() - 0.5) * 96 * (0.4 + rnd()), 584 + (rnd() - 0.5) * 22];
    const t = 2.2 + rnd() * 3.4;
    resaca += `<rect x="${f(x)}" y="${f(y)}" width="${f(t)}" height="${f(t * 0.5)}" fill="${[B.crema, B.rosa, B.lila, B.crema][i % 4]}" opacity="${f(0.5 + rnd() * 0.4)}" transform="rotate(${Math.round(rnd() * 60 - 30)} ${f(x)} ${f(y)})"/>`;
  }
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="var(--fondo)" fill-opacity="0"/>` +
    // El agua tiene planos: contra la línea de Pierre, clara donde le da la lamparita; adelante, se hunde.
    nube(430, desde + 44, 330, 30, B.celeste, 'xl', 0.2) +
    nube(1010, desde + 50, 220, 30, B.celeste, 'xl', 0.16) +
    nube(-110, desde + 40, 130, 26, B.celeste, 'xl', 0.14) +
    nube(480, 650, 800, 40, B.negro, 'xl', 0.5) +
    ondas +
    // La lamparita del pasillo y la de la sala llegan hasta acá, en rayas cada vez más sueltas.
    rayado([PASILLO.x0 + 16, desde + 2, PASILLO.x1 - 10, desde + 80], 16, [B.llama, B.llamaClara], 5741, { largo: [16, 50], grueso: [1.4, 2.8], opacidad: [0.25, 0.6] }) +
    rayado([1022, desde + 2, 1082, desde + 120], 22, [B.llamaClara, B.llama, B.llamaClara], 5743, { largo: [14, 46], grueso: [1.4, 3], opacidad: [0.25, 0.65] }) +
    resaca +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   El que está en el pasillo
   ------------------------------------------------------------------ */

const PARADO = enElPasillo(0.46);
/** La caja de la figura: parada en el agua del pasillo, a media hondura, a contraluz de la lamparita. */
export const FIGURA = { caja: [Math.round(PARADO.x - 20), Math.round(PARADO.agua - 92), 44, 112] as const } as const;

function figura(): string {
  const [x0, y0, w, h] = FIGURA.caja;
  const { x, agua } = PARADO;
  const cx = x + 2;
  return (
    `<g filter="url(#grano)"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="var(--fondo)" fill-opacity="0"/>` +
    // Una sombra de sobretodo y sombrero, con el agua a la rodilla. Dos ojos y nada más.
    forma(`M${cx - 11} ${f(agua)} L${cx - 12} ${f(agua - 40)} Q${cx - 14} ${f(agua - 58)} ${cx - 7} ${f(agua - 62)} L${cx - 5} ${f(agua - 66)} Q${cx - 8} ${f(agua - 76)} ${cx - 3} ${f(agua - 80)} L${cx - 13} ${f(agua - 80.6)} L${cx - 13} ${f(agua - 83)} L${cx - 6} ${f(agua - 83.4)} Q${cx - 5} ${f(agua - 90)} ${cx + 1} ${f(agua - 90)} Q${cx + 7} ${f(agua - 90)} ${cx + 7} ${f(agua - 83.4)} L${cx + 14} ${f(agua - 83)} L${cx + 14} ${f(agua - 80.6)} L${cx + 4} ${f(agua - 80)} Q${cx + 9} ${f(agua - 75)} ${cx + 6} ${f(agua - 66)} L${cx + 8} ${f(agua - 62)} Q${cx + 15} ${f(agua - 58)} ${cx + 13} ${f(agua - 40)} L${cx + 12} ${f(agua)} Z`, B.negro) +
    // El canto que le prende la lamparita de atrás.
    trazo(`M${cx + 8} ${f(agua - 61)} Q${cx + 14.4} ${f(agua - 57)} ${cx + 12.6} ${f(agua - 40)} L${cx + 12} ${f(agua - 8)}`, B.llama, 1, 0.7) +
    `<ellipse cx="${cx - 2.6}" cy="${f(agua - 73)}" rx="1.5" ry="1.1" fill="${B.luzFria}"/><ellipse cx="${cx + 3}" cy="${f(agua - 73.2)}" rx="1.5" ry="1.1" fill="${B.luzFria}"/>` +
    // El reflejo, en rayas que se corren.
    [0, 1, 2, 3].map((i) => trazo(`M${f(cx - 10 + (i % 2 ? 3 : -2))} ${f(agua + 3 + i * 4.4)} l${22 - i * 3} 0`, B.negro, 2.6, 0.8 - i * 0.16)).join('') +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   Lo que flota y se mece, y la botella con el papel
   ------------------------------------------------------------------ */

export interface Flota {
  pieza: string;
  caja: readonly [number, number, number, number];
  /** De dónde se hamaca: un punto abajo de la línea donde flota, como la quilla. */
  x: number;
  y: number;
  /** Cuánto sube y baja con el agua, en unidades. */
  sube: number;
  dibujo: string;
}

const hoja = ([x0, y0, w, h]: readonly [number, number, number, number], adentro: string): string =>
  `<g filter="url(#grano)"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="var(--fondo)" fill-opacity="0"/>${adentro}</g>`;

/** Una silla de bar, patas arriba: el asiento a flor de agua y las cuatro patas para el techo, con su travesaño. */
function silla(x: number, y: number): string {
  // Las patas: las dos de atrás, más cortas y finas; las de adelante, abiertas y torcidas por el agua.
  const pata = (x0: number, x1: number, alto: number, w: number): string => forma(`M${f(x + x0 - w / 2)} ${f(y - 2)} L${f(x + x1 - w * 0.4)} ${f(y - alto)} L${f(x + x1 + w * 0.4)} ${f(y - alto)} L${f(x + x0 + w / 2)} ${f(y - 2)} Z`, B.rosa) + trazo(`M${f(x + x0 - w / 2)} ${f(y - 2)} L${f(x + x1 - w * 0.4)} ${f(y - alto)}`, B.crema, 1.1, 0.8);
  return (
    pata(-12, -15, 34, 4) +
    pata(15, 19, 36, 4) +
    // El asiento, redondo, de esterilla: se le ve el canto.
    forma(`M${x - 30} ${y} Q${x - 28} ${y - 8} ${x} ${y - 9} Q${x + 30} ${y - 8} ${x + 31} ${y + 1} Q${x + 18} ${y + 6} ${x} ${y + 6} Q${x - 20} ${y + 6} ${x - 30} ${y} Z`, B.noche) +
    forma(`M${x - 25} ${y - 2} Q${x - 18} ${y - 7} ${x} ${y - 7.4} Q${x + 22} ${y - 7} ${x + 26} ${y - 1} Q${x + 12} ${y + 1.6} ${x} ${y + 1.6} Q${x - 14} ${y + 1.6} ${x - 25} ${y - 2} Z`, B.crema, 0.8) +
    rayado([x - 20, y - 6, x + 14, y], 12, [B.noche], 5503, { angulo: 20, largo: [4, 9], grueso: [0.7, 1.1], opacidad: [0.6, 0.9] }) +
    fibra([[x - 30, y], [x - 20, y - 7.6], [x, y - 9], [x + 22, y - 7.6], [x + 31, y + 1]], 1.4, 5501, B.lila, 0.8) +
    pata(-24, -31, 44, 5.4) +
    pata(25, 33, 46, 5.4) +
    // El travesaño, y el canto de las patas que agarra la lamparita.
    trazo(`M${x - 28} ${y - 24} L${x + 30} ${y - 26}`, B.rosa, 3) +
    trazo(`M${x - 28} ${y - 25.4} L${x + 30} ${y - 27.4}`, B.crema, 0.9, 0.8) +
    // La raya del agua contra el asiento.
    trazo(`M${x - 38} ${y + 5} q10 3 22 2 M${x + 10} ${y + 8} q16 1 30 -4`, B.luzFria, 1.3, 0.6)
  );
}

/** Un bombín, boca arriba, que hace de bote. */
function bombin(x: number, y: number): string {
  return (
    forma(`M${x - 19} ${y - 2} Q${x} ${y - 7} ${x + 19} ${y - 2} Q${x + 12} ${y + 3} ${x} ${y + 3} Q${x - 12} ${y + 3} ${x - 19} ${y - 2} Z`, B.negro) +
    forma(`M${x - 11} ${y - 1} Q${x - 11} ${y + 11} ${x} ${y + 11} Q${x + 11} ${y + 11} ${x + 11} ${y - 1} Z`, B.negro) +
    `<ellipse cx="${x}" cy="${y - 2.4}" rx="10" ry="2.6" fill="${B.violeta}"/>` +
    trazo(`M${x - 19} ${y - 2} Q${x} ${y - 7} ${x + 19} ${y - 2} Q${x + 12} ${y + 3} ${x} ${y + 3} Q${x - 12} ${y + 3} ${x - 19} ${y - 2}`, B.luzFria, 1.2, 0.8) +
    trazo(`M${x - 11} ${y + 3} Q${x} ${y + 6.4} ${x + 11} ${y + 3}`, B.llama, 2, 0.9) +
    trazo(`M${x + 9.6} ${y + 1} Q${x + 10.6} ${y + 9} ${x + 3} ${y + 10.6}`, B.lila, 1, 0.7) +
    trazo(`M${x - 24} ${y + 5} q8 2 16 1 M${x + 10} ${y + 7} q8 0 15 -3`, B.luzFria, 1.1, 0.55)
  );
}

const SILLA = { x: 762, y: 606 } as const;
const BOMBIN = { x: 338, y: 600 } as const;

/** Lo que flota adelante, en los huecos: debajo de los nenes de oro (que terminan en 576) y entre el bote y la botella de la sala. */
const CAJA_DE_LA_SILLA = [SILLA.x - 44, SILLA.y - 50, 88, 62] as const;
const CAJA_DEL_BOMBIN = [BOMBIN.x - 28, BOMBIN.y - 12, 56, 28] as const;
export const FLOTAN: readonly Flota[] = [
  { pieza: 'camino-bajo-silla', caja: CAJA_DE_LA_SILLA, x: SILLA.x, y: SILLA.y + 40, sube: 2.6, dibujo: hoja(CAJA_DE_LA_SILLA, silla(SILLA.x, SILLA.y)) },
  { pieza: 'camino-bajo-bombin', caja: CAJA_DEL_BOMBIN, x: BOMBIN.x, y: BOMBIN.y + 40, sube: 3.4, dibujo: hoja(CAJA_DEL_BOMBIN, bombin(BOMBIN.x, BOMBIN.y)) },
];

/** La botella con el papel adentro: lo que premia a la lupa. */
const BOTELLA = [806, 606, 50, 24] as const;

function botella(): string {
  const [x0, y0] = BOTELLA;
  const [x, y] = [x0 + 6, y0 + 13];
  return hoja(
    BOTELLA,
    forma(`M${x} ${y - 5} L${x + 22} ${y - 6.4} Q${x + 27} ${y - 6} ${x + 30} ${y - 3} L${x + 37} ${y - 3} L${x + 37} ${y + 2} L${x + 30} ${y + 2} Q${x + 27} ${y + 5.4} ${x + 22} ${y + 5.6} L${x} ${y + 5} Q${x - 3} ${y} ${x} ${y - 5} Z`, B.verde, 0.5) +
      trazo(`M${x} ${y - 5} L${x + 22} ${y - 6.4} Q${x + 27} ${y - 6} ${x + 30} ${y - 3} L${x + 37} ${y - 3} L${x + 37} ${y + 2} L${x + 30} ${y + 2} Q${x + 27} ${y + 5.4} ${x + 22} ${y + 5.6} L${x} ${y + 5} Q${x - 3} ${y} ${x} ${y - 5}`, B.negro, 0.9) +
      // El papel enrollado, con su piolín, y el corcho.
      forma(`M${x + 5} ${y - 2.6} L${x + 20} ${y - 3.2} L${x + 20} ${y + 2.6} L${x + 5} ${y + 2.4} Z`, B.crema, 0.95) +
      trazo(`M${x + 12} ${y - 3} l0.2 5.6 M${x + 7} ${y - 0.8} l5 -0.2 M${x + 14} ${y + 0.6} l4.4 -0.2`, B.rosa, 0.5) +
      forma(`M${x + 37} ${y - 2.4} l4 0.4 l0 3 l-4 0.4 Z`, B.rosa) +
      trazo(`M${x + 2} ${y - 3.6} L${x + 20} ${y - 4.8}`, B.luzFria, 0.6, 0.8) +
      trazo(`M${x - 5} ${y + 7} q10 2.4 22 1.6 M${x + 26} ${y + 7.6} q9 0 17 -2.4`, B.luzFria, 0.8, 0.6),
  );
}

/** Las piezas sueltas del bajo: la mano del fondo, lo que asoma, lo que flota y lo que premia a la lupa. */
export const PIEZAS_DEL_ANEGADO: readonly Pieza[] = [
  { nombre: 'camino-bajo-fondo', caja: CAJA_DEL_FONDO, dibujo: anegadoFondo(), densidad: 2 },
  { nombre: 'camino-bajo-cerca', caja: CAJA_DE_ADELANTE, dibujo: anegadoCerca(), densidad: 1.5 },
  { nombre: 'camino-bajo-figura', caja: FIGURA.caja, dibujo: figura(), densidad: 3 },
  ...FLOTAN.map((fl): Pieza => ({ nombre: fl.pieza, caja: fl.caja, dibujo: fl.dibujo, densidad: 2.5 })),
  { nombre: 'fino-bajo-botella', caja: BOTELLA, dibujo: botella(), densidad: 4 },
];
