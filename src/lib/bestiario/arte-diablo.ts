/**
 * El diablo que mea en todas partes (`D-73`, decimoquinta vuelta), en el infierno encantador.
 *
 * *"Sin ese diablo que mea en todas partes / Y en ningún lado hace espuma!"* es de *Juguetes
 * perdidos*, que cierra *Luzbelito* (1996). El diablo no está en ninguna tapa: se inventa en la de su
 * disco (`T-440`), que son cosas de verdad fotografiadas, y **está hecho con esas cosas**:
 *
 * - **La pelada, la nuca y las manos son el cobre del óvalo del frente**: cobre oxidado, con las
 *   manchas de óxido y verdín del anillo y el brillo donde le pega la luz.
 * - **El frac es el cuero verde del lomo del libro**, porque la tapa es una encuadernación: media
 *   pasta de cuero con el papel marmolado en las tapas. Al frac lo forra ese marmolado, que asoma en
 *   la abertura de los faldones, recortado de la tapa de verdad (`href="tapa:luzbelito-frontal"`).
 * - **Los cuernos son el yeso del busto**, y **el pantalón, el cielo violeta del interior**. Las
 *   tintas se midieron en las dos tapas (`--bestia-diablo-*`).
 *
 * Es un aerógrafo con máscara, como los otros del elenco: borde duro afuera, volumen soplado adentro,
 * grano. Lo que lo despega del fuego sin contorno es la luz: está parado contra la pared de fuego del
 * salón (la pincelada de *Gulp!*, `escenas.ts`), así que se lo ve oscuro contra lo claro, con el canto
 * prendido de fuego todo alrededor, y más del lado de la vela de Luzbelito, que le queda a la derecha.
 * El piso encerado le devuelve la brasa por abajo. Y el verde del cuero contra el naranja del fuego se
 * pelean, que es lo que hace que se lea en un teléfono.
 *
 * De espaldas, como dice la estampa, y girado apenas a su derecha: así el chorro asoma por ese lado.
 * Es un arco de brasa que dibuja la página (`bt-diablo-chorro`), no un dibujo de lo que se mea; cae en
 * el damero, y donde cae no queda nada: un brillo que se seca, unas chispas y el vapor, que es pincel
 * seco de *Gulp!* en la crema de esa tapa (`pincel.ts`). Le falta el gorro: la pelada brilla entre los
 * cuernos, con la herradura de pelo atrás.
 *
 * Coordenadas del títere: el (0, 0) es el piso entre las pezuñas, arriba es negativo (`rig-diablo.ts`).
 */

import { forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { azar, pinceladas, tinta } from './pincel.ts';
import { DIABLO as SITIO, DIABLO_ARMADO as A, poseQuieta, transformes, type Pose } from './rig-diablo.ts';

type P = readonly [number, number];
/** Un punto de un contorno; con `'v'`, es una esquina (el canto de un faldón, la punta de una oreja). */
type Q = readonly [number, number] | readonly [number, number, 'v'];
const f = (v: number): string => (Math.round(v * 10) / 10).toString();

const T = {
  cobre: 'var(--bestia-diablo-cobre)',
  cobreClaro: 'var(--bestia-diablo-cobre-claro)',
  cobreHondo: 'var(--bestia-diablo-cobre-hondo)',
  brillo: 'var(--bestia-diablo-brillo)',
  oxido: 'var(--bestia-diablo-oxido)',
  verdin: 'var(--bestia-diablo-verdin)',
  cuero: 'var(--bestia-diablo-cuero)',
  cueroClaro: 'var(--bestia-diablo-cuero-claro)',
  marmol: 'var(--bestia-diablo-marmol)',
  veta: 'var(--bestia-diablo-veta)',
  hueso: 'var(--bestia-diablo-hueso)',
  huesoClaro: 'var(--bestia-diablo-hueso-claro)',
  huesoHondo: 'var(--bestia-diablo-hueso-hondo)',
  violeta: 'var(--bestia-diablo-violeta)',
  violetaHondo: 'var(--bestia-diablo-violeta-hondo)',
  blanco: 'var(--bestia-ojo-blanco)',
  // La luz es la del recinto: el fuego de la pared, el oro de la vela, la brasa del piso.
  fuego: 'var(--entorno-infierno-fuego)',
  brasa: 'var(--entorno-infierno-brasa)',
  rojo: 'var(--marca-rojo)',
  oro: 'var(--acento-2)',
  crema: 'var(--disco-gulp-apoyo)',
  negro: 'var(--fondo)',
};

/* ------------------------------------------------------------------
   Herramientas: la curva, la máscara, el tubo y el canto prendido
   ------------------------------------------------------------------ */

/** Una curva suave que pasa por todos los puntos (Catmull-Rom llevada a Bézier); en las `'v'`, quiebra. */
function curva(pts: readonly Q[], cerrada = true): string {
  const n = pts.length;
  const en = (i: number): Q => (cerrada ? pts[(i + n) % n]! : pts[Math.min(n - 1, Math.max(0, i))]!);
  const esquina = (q: Q): boolean => q[2] === 'v';
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  for (let i = 0; i < (cerrada ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [en(i - 1), en(i), en(i + 1), en(i + 2)];
    const c1: P = esquina(p1) ? [p1[0], p1[1]] : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = esquina(p2) ? [p2[0], p2[1]] : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return cerrada ? `${d} Z` : d;
}

const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;
const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;

/** La máscara del aerógrafo: todo lo de adentro se sopla libre y no se sale de la silueta. */
const enmascarado = (id: string, silueta: string, adentro: string): string =>
  `<clipPath id="${id}"><path d="${silueta}"/></clipPath><g clip-path="url(#${id})">${adentro}</g>`;

/**
 * El canto prendido: un trazo soplado sobre un pedazo del contorno, adentro de la máscara. Es la luz
 * del fuego que le pega de atrás y se le enrosca por el borde: afuera corta la máscara, adentro se abre.
 */
const canto = (pts: readonly Q[], color: string, ancho: number, o: number, tam: 's' | 'xs' | 'm' = 's'): string =>
  `<path d="${curva(pts, false)}" fill="none" stroke="${color}" stroke-width="${f(ancho)}" stroke-linecap="round" filter="url(#soplo-${tam})" opacity="${f(o)}"/>`;

/** Un punto de una línea quebrada, en `t` de 0 a 1 de su largo, con la dirección. */
function enLinea(pts: readonly P[], t: number): { p: P; dir: P } {
  const largos = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i]![0], p[1] - pts[i]![1]));
  const total = largos.reduce((s, l) => s + l, 0);
  let falta = t * total;
  for (let i = 0; i < largos.length; i++) {
    const l = largos[i]!;
    if (falta <= l || i === largos.length - 1) {
      const k = l ? Math.min(1, falta / l) : 0;
      const [a, b] = [pts[i]!, pts[i + 1]!];
      return { p: [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], dir: [(b[0] - a[0]) / (l || 1), (b[1] - a[1]) / (l || 1)] };
    }
    falta -= l;
  }
  return { p: pts[pts.length - 1]!, dir: [0, 1] };
}

/** Un tubo que se afina (la cola, un cuerno): devuelve el contorno y los dos cantos, para prenderlos. */
function tubo(eje: readonly P[], anchos: readonly number[], pasos = 18, punta = false): { d: string; izq: P[]; der: P[] } {
  const ancho = (t: number): number => {
    const x = t * (anchos.length - 1);
    const i = Math.min(anchos.length - 2, Math.floor(x));
    return anchos[i]! + (anchos[i + 1]! - anchos[i]!) * (x - i);
  };
  const izq: P[] = [];
  const der: P[] = [];
  for (let k = 0; k <= pasos; k++) {
    const t = k / pasos;
    const { p, dir } = enLinea(eje, t);
    const w = ancho(t) / 2;
    izq.push([p[0] + dir[1] * w, p[1] - dir[0] * w]);
    der.push([p[0] - dir[1] * w, p[1] + dir[0] * w]);
  }
  const b = enLinea(eje, 1);
  const fin: Q = punta ? [b.p[0], b.p[1], 'v'] : [b.p[0] + b.dir[0] * ancho(1) * 0.4, b.p[1] + b.dir[1] * ancho(1) * 0.4];
  const a = enLinea(eje, 0);
  const ini: P = [a.p[0] - a.dir[0] * ancho(0) * 0.4, a.p[1] - a.dir[1] * ancho(0) * 0.4];
  return { d: curva([ini, ...izq.slice(1, -1), fin, ...der.slice(1, -1).reverse()]), izq, der };
}

/**
 * El cuero craquelado del lomo del libro: grietas finas, cortas, que se quiebran, del verde de las
 * grietas del lomo. Más donde le da la luz, porque en lo oscuro no se ven.
 */
function craquelado(rnd: () => number, n: number, lugar: () => P, luz: (p: P) => number): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const [x, y] = lugar();
    const k = luz([x, y]);
    if (k < 0.12) continue;
    let d = `M${f(x)} ${f(y)}`;
    let [cx, cy] = [x, y];
    let a = rnd() * Math.PI * 2;
    for (let j = 0; j < 3; j++) {
      a += (rnd() - 0.5) * 1.6;
      const l = 1.6 + rnd() * 2.6;
      cx += Math.cos(a) * l;
      cy += Math.sin(a) * l;
      d += ` L${f(cx)} ${f(cy)}`;
    }
    s += trazo(d, T.cueroClaro, 0.5, Math.min(1, (0.45 + rnd() * 0.45) * k * 1.3));
    // Y el filo de la grieta, del otro lado, que agarra el fuego donde más luz hay.
    if (k > 0.6 && rnd() < 0.35) s += `<g transform="translate(0.5 -0.4)">${trazo(d, T.cobreHondo, 0.35, 0.5 * k)}</g>`;
  }
  return s;
}

/** Al azar adentro de un rectángulo. */
const enCaja = (rnd: () => number, x0: number, y0: number, w: number, h: number) => (): P => [x0 + rnd() * w, y0 + rnd() * h];

/**
 * Las manchas del cobre oxidado del anillo de la tapa: óxido y verdín, sopladas chicas y desparejas.
 * Le sacan lo liso de muñeco de plástico.
 */
function oxidado(rnd: () => number, n: number, lugar: () => P, o = 1): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const [x, y] = lugar();
    const r = 0.5 + rnd() * 1.4;
    const tinta = rnd();
    s += nube(x, y, r * (0.8 + rnd() * 0.6), r, tinta < 0.5 ? T.brasa : tinta < 0.8 ? T.oxido : T.verdin, 'xs', (0.25 + rnd() * 0.4) * o);
  }
  return s;
}

/** Un pedazo de la tapa de verdad (953 × 953): el píxel (px, py) cae en (x, y), a `e` unidades por píxel. */
const deLaTapa = (x: number, y: number, px: number, py: number, e: number, giro = 0): string =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(giro)}) scale(${e})"><image href="tapa:luzbelito-frontal" x="${-px}" y="${-py}" width="953" height="953" preserveAspectRatio="none"/></g>`;

/* ------------------------------------------------------------------
   El frac: el cuero del lomo, de espaldas, con los faldones
   ------------------------------------------------------------------ */

/** El contorno del frac de espaldas: el cuello, los hombros con hombreras, la cintura y los dos faldones. */
export const FRAC: readonly Q[] = [
  [-13, -180], [0, -182.5], [13, -180.5],
  [24, -176.5], [33, -172.5], [39.5, -166, 'v'],
  [38.8, -152], [35.2, -137], [30.2, -124],
  // El faldón derecho: de la cadera se cierra, y baja derecho hasta la corva, cortado a escuadra.
  [29.2, -113], [26.4, -100], [24.6, -80], [23.4, -60], [22.8, -46, 'v'],
  [15.4, -44.4, 'v'], [11, -60], [6.6, -80], [2.6, -99], [0, -112.4, 'v'],
  // La abertura, y el faldón izquierdo, del otro lado, más angosto.
  [-3, -99], [-7, -80], [-10.6, -60], [-14.2, -45.4, 'v'],
  [-21, -46.8, 'v'], [-22, -60], [-23.2, -80], [-24.8, -100], [-26.6, -114], [-25.6, -123],
  [-29.6, -138], [-33, -154], [-35.2, -163.4, 'v'],
  [-31, -171], [-23, -177],
];

/** La luz que le toca a un punto del frac: el canto derecho (la vela), los hombros (el fuego de enfrente). */
const luzFrac = ([x, y]: P): number => Math.max(0, Math.min(1, 0.15 + (x + 5) / 70 + (-140 - y) / 90));

function frac(): string {
  const d = curva(FRAC);
  const rnd = azar(701);
  const adentro =
    forma(d, T.cuero) +
    // Lo que agarra un poco de luz del cuero: los omóplatos, el costado de la vela, los faldones.
    nube(-15, -157, 11, 13, T.cueroClaro, 'm', 0.75) +
    nube(12, -158, 13, 14, T.cueroClaro, 'm', 0.95) +
    nube(34, -146, 6, 24, T.cueroClaro, 'm', 0.9) +
    nube(35.5, -150, 3, 16, T.cobreHondo, 's', 0.35) +
    nube(19, -82, 5, 30, T.cueroClaro, 'm', 0.75) +
    nube(-18, -82, 4, 28, T.cueroClaro, 'm', 0.45) +
    // El medio de la espalda y lo de adentro de los faldones, hundidos.
    nube(-4, -138, 9, 26, T.negro, 'l', 0.55) +
    nube(5, -84, 4, 26, T.negro, 'm', 0.7) +
    nube(-6, -84, 3, 26, T.negro, 'm', 0.7) +
    nube(-25, -140, 4, 18, T.negro, 'm', 0.4) +
    // Las arrugas del cuero que bajan de los hombros a la cintura.
    [[-20, -168, -10, -130], [-8, -172, -6, -140], [16, -170, 8, -132], [27, -165, 18, -128]].map(([x0, y0, x1, y1]) => {
      const c = `M${x0} ${y0} Q${f((x0! + x1!) / 2 + 3)} ${f((y0! + y1!) / 2)} ${x1} ${y1}`;
      return trazo(c, T.negro, 2.4, 0.35) + `<g transform="translate(1.2 0)">${trazo(c, T.cueroClaro, 1.2, 0.45)}</g>`;
    }).join('') +
    craquelado(rnd, 260, enCaja(rnd, -34, -180, 74, 134), luzFrac) +
    // La costura del medio, la de la cintura y los dos botones de atrás del frac, de cobre.
    trazo('M-3 -181 Q-4.6 -152 -5 -123', T.negro, 1.1, 0.8) +
    trazo('M-2 -181 Q-3.6 -152 -4 -123', T.cueroClaro, 0.5, 0.5) +
    trazo('M-26 -122.6 Q-2 -120 31 -124', T.negro, 1.3, 0.85) +
    trazo('M-26 -121.2 Q-2 -118.6 31 -122.6', T.cueroClaro, 0.6, 0.6) +
    [[-8.6, -124.2], [7.4, -124.6]].map(([x, y]) => forma(elipse(x!, y!, 2.1, 2.1), T.cobreHondo) + nube(x! + 0.5, y! - 0.6, 1.2, 1.1, T.cobreClaro, 'xs', 0.95) + nube(x!, y! + 2.6, 2, 0.8, T.negro, 'xs', 0.6)).join('') +
    // Los pliegues que bajan de los botones por los faldones.
    trazo('M7.2 -121 Q7.6 -100 9.4 -66', T.negro, 1, 0.45) +
    trazo('M-8.4 -121 Q-8.6 -100 -9.6 -70', T.negro, 1, 0.4) +
    // El cuello del frac, alzado, y la costura que lo pega.
    soplo('M-13 -180 Q0 -183 13 -180.5 L14 -176 Q0 -178.6 -14 -175.6 Z', T.cueroClaro, 'xs', 0.7) +
    trazo('M-14 -175.4 Q0 -178.2 14.4 -175.8', T.negro, 1.1, 0.8) +
    // El canto prendido: los hombros (el fuego de enfrente), el costado de la vela, y el otro, más flojo.
    canto([[-31, -171], [-23, -177], [-13, -180], [0, -182.5], [13, -180.5], [24, -176.5], [33, -172.5], [39.5, -166]], T.fuego, 4.2, 0.95) +
    canto([[-23, -177], [-13, -180.4], [0, -182.6], [13, -180.6], [24, -176.6], [33, -172.6]], T.oro, 1.6, 0.8, 'xs') +
    canto([[39.5, -166], [38.8, -152], [35.2, -137], [30.2, -124], [29.2, -113], [26.4, -100], [24.6, -80], [23.4, -60], [22.8, -46]], T.fuego, 3.4, 0.9) +
    canto([[38.8, -160], [38.6, -150], [35.4, -137]], T.oro, 1.3, 0.75, 'xs') +
    canto([[-35.2, -163.4], [-33, -154], [-29.6, -138], [-25.6, -123], [-26.6, -114], [-24.8, -100], [-23.2, -80], [-22, -60]], T.fuego, 2.6, 0.55) +
    // Lo de adentro de la abertura agarra el fuego que pasa entre las piernas.
    canto([[15.4, -44.4], [11, -60], [6.6, -80], [2.6, -99]], T.fuego, 1.6, 0.45, 'xs') +
    canto([[-3, -99], [-7, -80], [-10.6, -60], [-14.2, -45.4]], T.fuego, 1.4, 0.35, 'xs') +
    // Abajo, el damero encerado le devuelve la brasa a los faldones.
    nube(19, -47, 7, 4, T.brasa, 's', 0.8) +
    nube(-17.6, -48, 6, 4, T.brasa, 's', 0.6) +
    canto([[22.8, -46], [15.4, -44.4]], T.fuego, 1.6, 0.6, 'xs') +
    canto([[-14.2, -45.4], [-21, -46.8]], T.fuego, 1.4, 0.45, 'xs');
  // El forro: el papel marmolado de la tapa, que asoma en el canto de adentro de cada faldón.
  const forroDer = curva([[0.8, -108, 'v'], [3.4, -96], [7.2, -79], [11.4, -60.4], [15, -46.4, 'v'], [13.2, -50.4], [9.2, -61], [5.2, -79.6], [1.8, -96.6]]);
  const forroIzq = curva([[-0.8, -108, 'v'], [-3.8, -96.4], [-7.6, -79.6], [-11, -61], [-14, -47.4, 'v'], [-12.6, -51.4], [-9.4, -61.4], [-5.8, -80], [-2.4, -97]]);
  const forro = (id: string, silueta: string, px: number): string =>
    enmascarado(id, silueta, deLaTapa(-14, -104, px, 520, 0.18) + nube(0, -80, 8, 26, T.negro, 'm', 0.35));
  return conGrano(enmascarado('m-diablo-frac', d, adentro) + forro('m-diablo-forro-1', forroDer, 230) + forro('m-diablo-forro-2', forroIzq, 300));
}

/**
 * El cuello de la camisa: una tira de crema entre el cuello del frac y la nuca. Va en el frac, encima
 * de la nuca, así tapa la costura de la cabeza cuando gira.
 */
function camisa(): string {
  const d = 'M-11.6 -184.6 Q0 -186.6 11.8 -184.6 L12.6 -180.2 Q0 -182.6 -12.4 -180 Z';
  return conGrano(
    enmascarado('m-diablo-camisa', d,
      forma(d, T.hueso) + nube(-6, -182, 7, 2, T.huesoHondo, 's', 0.7) + nube(9, -183.6, 5, 1.4, T.huesoClaro, 'xs', 0.9) + canto([[-11.6, -184.6], [0, -186.6], [11.8, -184.6]], T.fuego, 1.4, 0.8, 'xs')),
  );
}

/* ------------------------------------------------------------------
   La nuca: el cobre de la pelada, los cuernos de yeso, la herradura de pelo
   ------------------------------------------------------------------ */

const CRANEO = { c: [0.5, -206] as P, r: [17.5, 19.6] as P };
const CUELLO: readonly Q[] = [[-11.6, -174], [-11.2, -186], [-9.6, -194], [9.6, -194], [11.6, -186], [12.2, -174]];
const OREJA: readonly Q[] = [[15.6, -210.6], [19.4, -213.6], [23.6, -219.4, 'v'], [22, -209.4], [19.8, -202.6], [16.8, -199.4]];
const OREJA_IZQ: readonly Q[] = [[-15.8, -209.6], [-19.8, -215.6, 'v'], [-18.4, -206], [-16.6, -202.4]];
/** La herradura de pelo: de oreja a oreja por la nuca, más baja en el medio, como la del pelado de barrio. */
const PELO: readonly Q[] = [[17, -205], [9, -200.4], [0, -198.8], [-9, -200], [-16.8, -205.4], [-17.4, -197], [-9.6, -191], [0, -189.4], [9.6, -190.6], [17.4, -196.4]];

/** Un cuerno de yeso, del eje que sale de la pelada a la punta; con anillos, y el canto del fuego. */
function cuerno(id: string, eje: readonly P[], base: number, luzALaDerecha: boolean, semilla: number): string {
  const t = tubo(eje, [base, base * 0.8, base * 0.55, base * 0.28, 0.4], 20, true);
  const rnd = azar(semilla);
  let anillos = '';
  for (let k = 0; k < 7; k++) {
    const u = 0.1 + k * 0.11 + rnd() * 0.03;
    const { p, dir } = enLinea(eje, u);
    const w = base * (1 - u * 0.8) * 0.55;
    const [nx, ny] = [dir[1], -dir[0]];
    const c = `M${f(p[0] + nx * w)} ${f(p[1] + ny * w)} Q${f(p[0] + dir[0] * 1.6)} ${f(p[1] + dir[1] * 1.6)} ${f(p[0] - nx * w)} ${f(p[1] - ny * w)}`;
    anillos += trazo(c, T.huesoHondo, 0.8, 0.6) + `<g transform="translate(${f(-dir[0] * 0.8)} ${f(-dir[1] * 0.8)})">${trazo(c, T.huesoClaro, 0.45, 0.5)}</g>`;
  }
  const lado = luzALaDerecha ? t.der : t.izq;
  const otro = luzALaDerecha ? t.izq : t.der;
  const [b, m] = [enLinea(eje, 0.15).p, enLinea(eje, 0.55).p];
  return enmascarado(id, t.d,
    forma(t.d, T.huesoHondo) +
    nube(m[0], m[1], base * 0.45, 9, T.hueso, 'm', 0.85) +
    nube(b[0], b[1] + 2, base * 0.6, 4, T.negro, 's', 0.5) +
    anillos +
    canto(lado, T.fuego, 2.8, 0.95) +
    canto(lado.slice(0, -2), T.huesoClaro, 1, 0.8, 'xs') +
    canto(otro, T.fuego, 1.4, 0.5, 'xs'));
}

/** Los dos cuernos de la nuca: salen de la pelada para arriba y para afuera. El de la derecha, más cerca, más grande. */
export const CUERNOS_NUCA: readonly [readonly P[], readonly P[]] = [
  [[-9.4, -219], [-12.6, -230], [-16.6, -240], [-21.4, -249]],
  [[10.4, -220], [14, -231.4], [18.6, -241.4], [24.2, -250.4]],
];

function nuca(): string {
  const rnd = azar(733);
  const craneo = elipse(CRANEO.c[0], CRANEO.c[1], CRANEO.r[0], CRANEO.r[1]);
  const cuello = curva(CUELLO);
  const pelo = curva(PELO);
  const cabeza =
    enmascarado('m-diablo-cuello', cuello,
      forma(cuello, T.cobreHondo) +
      nube(-2, -184, 10, 7, T.brasa, 'm', 0.75) +
      nube(9, -186, 3, 8, T.cobreHondo, 's', 0.95) +
      nube(10.6, -187, 1.4, 6, T.cobre, 'xs', 0.8) +
      // El rollo de la nuca, del que come bien: un pliegue que se hunde y el filo de abajo.
      trazo('M-8.6 -188.4 Q0 -185.6 9.4 -188.8', T.brasa, 1.6, 0.75) +
      trazo('M-7.6 -187 Q0 -184.4 8.8 -187.4', T.cobre, 0.7, 0.45) +
      canto([[9.6, -194], [11.6, -186], [12.2, -174]], T.fuego, 2.4, 0.9) +
      canto([[-9.6, -194], [-11.2, -186], [-11.6, -174]], T.fuego, 1.6, 0.5)) +
    enmascarado('m-diablo-craneo', craneo,
      // La pelada: de espaldas está a contraluz, oscura, y el fuego de enfrente la prende por arriba y
      // la vela por la derecha. Es lo que brilla, ahora que no tiene el gorro.
      forma(craneo, T.cobreHondo) +
      nube(-3, -201, 15, 12, T.brasa, 'm', 0.75) +
      // El cobre: lo que da a la vela (arriba a la derecha) se enciende, con su brillo de metal.
      nube(7, -214, 9, 8, T.cobre, 'm', 0.9) +
      nube(2, -220.6, 12, 4, T.cobre, 's', 0.95) +
      nube(8.6, -219.6, 5.6, 3.2, T.cobreClaro, 's', 0.95) +
      nube(10.4, -220.6, 2.4, 1.3, T.brillo, 'xs', 1) +
      nube(15, -208, 2.6, 8, T.cobre, 's', 0.8) +
      nube(-9, -214, 4, 5, T.cobreHondo, 's', 0.7) +
      oxidado(rnd, 34, () => [CRANEO.c[0] + (rnd() - 0.5) * 30, CRANEO.c[1] + (rnd() - 0.4) * 30]) +
      // El cobre del anillo de la tapa tiene motas claras donde agarra luz: acá, en el canto prendido.
      Array.from({ length: 14 }, () => {
        const a = -Math.PI * (0.15 + rnd() * 0.75);
        return nube(CRANEO.c[0] + Math.cos(a) * 15.6, CRANEO.c[1] + Math.sin(a) * 17.6, 0.7, 0.6, T.brillo, 'xs', 0.4 + rnd() * 0.5);
      }).join('') +
      // La marca del gorro: una vuelta más pálida donde apretaba el elástico, que ya nadie tapa.
      soplo('M-17 -211.6 Q0 -216.6 17.6 -212.2 L17.4 -210.2 Q0 -214.2 -17 -209.6 Z', T.cobreHondo, 'xs', 0.85) +
      canto([[-16.6, -212], [-12, -221], [-2, -225.4], [9, -224], [16, -216], [18, -206]], T.fuego, 5, 1) +
      canto([[-10, -222.4], [-2, -225.6], [8, -224.4], [14.6, -218.6], [17.6, -210]], T.oro, 1.8, 0.95, 'xs') +
      canto([[18, -206], [17.6, -198], [15, -191]], T.fuego, 2.6, 0.8) +
      canto([[-16.6, -212], [-17.6, -204], [-15, -194]], T.fuego, 2, 0.55) +
      // La herradura de pelo, corta, del verdín del anillo: soplada, así arriba se funde en la pelada y
      // no queda una vincha; los pelos asoman del borde de arriba.
      soplo(pelo, T.verdin, 's', 0.8) +
      nube(0, -192.6, 14, 3, T.negro, 's', 0.55) +
      Array.from({ length: 46 }, () => {
        const x = -16.6 + rnd() * 34;
        const y = -203 + Math.abs(x) * 0.12 + rnd() * 8;
        return trazo(`M${f(x)} ${f(y)} l${f(-x * 0.03 + (rnd() - 0.5) * 0.8)} ${f(1.4 + rnd() * 1.6)}`, rnd() < 0.65 ? T.verdin : T.cobreHondo, 0.45, 0.65);
      }).join('') +
      canto([[17.4, -205], [17.4, -196.4]], T.fuego, 1.6, 0.8, 'xs'));
  const oreja = (id: string, pts: readonly Q[], fuerte: boolean): string => {
    const d = curva(pts);
    const [tx, ty] = pts.find((q) => q[2] === 'v')!;
    return enmascarado(id, d,
      forma(d, T.oxido) +
      // A contraluz la oreja se prende roja, como se prenden las orejas delante de un fuego.
      nube(tx - 2, ty + 5, 2.6, 4.4, T.rojo, 's', fuerte ? 0.9 : 0.55) +
      nube(pts[0]![0] + 1, pts[0]![1] + 6, 2.2, 5, T.verdin, 's', 0.7) +
      canto(pts.slice(0, 4), T.fuego, 1.8, fuerte ? 0.95 : 0.6, 'xs'));
  };
  return conGrano(
    oreja('m-diablo-oreja-izq', OREJA_IZQ, false) +
    cabeza +
    oreja('m-diablo-oreja', OREJA, true) +
    cuerno('m-diablo-cuerno-1', CUERNOS_NUCA[0], 7.2, false, 741) +
    cuerno('m-diablo-cuerno-2', CUERNOS_NUCA[1], 8.4, true, 743),
  );
}

/* ------------------------------------------------------------------
   La cara vuelta: por encima del hombro, a ver quién le robó el gorro
   ------------------------------------------------------------------ */

/**
 * La cabeza dada vuelta, de tres cuartos perfil: la nariz ganchuda, la perilla en punta, la ceja que
 * baja. El ojo es de persona, como el de los animales de Rocambole: el blanco va impreso y el iris, la
 * pupila y el párpado los dibuja la página (`bt-diablo-*`), para que mire y desconfíe.
 */
export const CARA: readonly Q[] = [
  [-15, -212], [-9.6, -222], [0.6, -226.2], [10.6, -224], [16.8, -218],
  [19.8, -212], [21.8, -209.2, 'v'], [20.4, -206.2, 'v'],
  [23.4, -201.6], [28.6, -195, 'v'], [25.4, -193.2], [22.6, -193.8, 'v'],
  [22.8, -191.6], [21.6, -189.8, 'v'], [19.4, -189.2, 'v'], [20.8, -187], [19.8, -184, 'v'],
  [21.6, -178], [23.4, -170.4], [24.2, -164.6, 'v'], [19.6, -171.6], [16, -179.6], [12.4, -182, 'v'],
  // El cogote baja hasta el cuello de la camisa, que pone el frac: calza con su canto de arriba.
  [12.6, -184.4, 'v'], [6, -185.4], [0, -185.6], [-6, -185.4], [-11.6, -184.4, 'v'],
  [-12.8, -190], [-15.4, -196], [-17.4, -203.4],
];
export const CUERNOS_CARA: readonly [readonly P[], readonly P[]] = [
  [[-8.2, -220.6], [-12.4, -231.4], [-16.4, -239.6], [-21.4, -246.6]],
  [[6.4, -223.4], [7.2, -235], [9.8, -244.2], [14.4, -251.6]],
];
const OREJA_CARA: readonly Q[] = [[-0.6, -211.4], [-5, -215.4], [-9.8, -221.6, 'v'], [-8.6, -211.4], [-7, -202.6], [-3.6, -199], [0, -200.6], [0.8, -205.6]];
const PELO_CARA: readonly Q[] = [[-16.8, -206], [-12, -202], [-7.6, -196.6], [-9.4, -190.4], [-14.4, -192.4], [-17.6, -199]];

function vuelta(): string {
  const rnd = azar(761);
  const d = curva(CARA);
  const [ox, oy] = A.ojo.centro;
  const [rx, ry] = A.ojo.radio;
  // El blanco del ojo: almendrado, con el lagrimal del lado de la nariz.
  const blanco = curva([[ox + rx, oy + 0.4, 'v'], [ox + 1, oy - ry], [ox - rx * 0.6, oy - ry * 0.8], [ox - rx, oy + 0.2, 'v'], [ox - rx * 0.4, oy + ry * 0.8], [ox + rx * 0.6, oy + ry * 0.7]]);
  // Los planos de la cara, como se modela un busto: lo que da a la vela (a la derecha) se prende, lo que
  // da a vos queda en la media sombra, y la nuca, en la sombra del todo.
  const cara =
    forma(d, T.cobreHondo) +
    nube(-8, -200, 10, 16, T.brasa, 'm', 0.8) +
    nube(-12, -190, 5, 8, T.verdin, 's', 0.55) +
    nube(4, -207, 6, 10, T.brasa, 'm', 0.45) +
    nube(12, -186, 6, 3, T.verdin, 's', 0.8) +
    // La frente y el ceño, de frente a la vela.
    nube(15, -215.6, 5.4, 5, T.cobre, 'm', 0.95) +
    nube(18.4, -213.4, 2.6, 3, T.cobreClaro, 's', 0.9) +
    nube(19.6, -209.6, 2, 1.1, T.brillo, 'xs', 0.85) +
    // Las arrugas de la frente: surco y filo.
    [0, 1, 2].map((i) => {
      const c = `M${f(11 + i * 0.6)} ${f(-218.4 + i * 2.4)} Q${f(15.6 + i * 0.4)} ${f(-219.8 + i * 2.4)} ${f(19.2 - i * 0.2)} ${f(-217 + i * 2.6)}`;
      return trazo(c, T.brasa, 0.7, 0.7) + `<g transform="translate(0 0.7)">${trazo(c, T.cobreClaro, 0.45, 0.55)}</g>`;
    }).join('') +
    // La cuenca honda, y la ceja que baja hacia la nariz: desconfía.
    nube(ox + 0.6, oy, rx + 2.2, ry + 2.4, T.verdin, 's', 0.92) +
    nube(ox + 3.4, oy - 0.8, 1.8, 1.8, T.negro, 'xs', 0.6) +
    soplo(`M${f(ox - rx - 1.6)} ${f(oy - 4.8)} Q${f(ox)} ${f(oy - 8)} ${f(ox + rx + 1.6)} ${f(oy - 2.4)} L${f(ox + rx + 1.2)} ${f(oy - 1.2)} Q${f(ox)} ${f(oy - 5.4)} ${f(ox - rx - 1.2)} ${f(oy - 3)} Z`, T.verdin, 'xs', 0.95) +
    Array.from({ length: 12 }, (_, i) => trazo(`M${f(ox - rx - 1 + i * 0.85)} ${f(oy - 5.4 - Math.sin((i / 11) * Math.PI) * 1.6 + i * 0.22)} l${f(1.4)} ${f(0.5)}`, T.negro, 0.5, 0.7)).join('') +
    trazo(`M${f(ox - rx - 1.6)} ${f(oy - 6.6)} Q${f(ox + 1)} ${f(oy - 9)} ${f(ox + rx + 2)} ${f(oy - 3.8)}`, T.cobreClaro, 0.7, 0.8) +
    trazo(`M${f(ox + rx + 2.6)} ${f(oy - 7.8)} l0.6 3`, T.negro, 0.6, 0.8) +
    `<path d="${blanco}" fill="${T.blanco}"/>` +
    nube(ox, oy - ry * 0.6, rx * 1.1, ry * 0.7, T.brasa, 'xs', 0.55) +
    // Las patas de gallo y la bolsa de abajo, arrugada como la del busto.
    [0, 1, 2].map((i) => trazo(`M${f(ox - rx - 0.8)} ${f(oy - 0.6 + i * 1.6)} l${f(-2.6 - i * 0.3)} ${f(-0.8 + i * 1.2)}`, T.brasa, 0.5, 0.8)).join('') +
    trazo(`M${f(ox - rx + 0.6)} ${f(oy + ry + 1.2)} Q${f(ox)} ${f(oy + ry + 2.6)} ${f(ox + rx - 0.4)} ${f(oy + ry + 0.8)}`, T.verdin, 0.6, 0.8) +
    // El pómulo prendido y el cachete chupado debajo.
    nube(14, -199.6, 3.8, 2.6, T.cobre, 's', 0.95) +
    nube(14.6, -200.4, 1.8, 1.1, T.cobreClaro, 'xs', 0.9) +
    nube(11.6, -194, 3.4, 4, T.brasa, 's', 0.7) +
    // La nariz ganchuda: el lomo prendido, la punta que brilla, el costado y el ala en la sombra.
    `<path d="M21 -205.4 Q24.6 -201 27.4 -196.2" fill="none" stroke="${T.cobreClaro}" stroke-width="1.6" stroke-linecap="round" filter="url(#soplo-xs)" opacity="0.95"/>` +
    nube(26.6, -196.6, 1.4, 1.2, T.brillo, 'xs', 0.95) +
    nube(21.4, -199.4, 1.6, 3.4, T.brasa, 'xs', 0.6) +
    trazo('M21.6 -197.4 Q20.2 -195.6 21.6 -193.6', T.negro, 0.8, 0.8) +
    nube(23.4, -194, 1.4, 0.7, T.negro, 'xs', 0.95) +
    // El surco que baja de la nariz a la boca, y la mueca torcida para arriba, con un colmillo.
    trazo('M21.2 -197 Q17.8 -194 18.2 -189.6', T.negro, 0.9, 0.75) +
    `<g transform="translate(0.6 0)">${trazo('M21.2 -196.6 Q18.4 -194 18.8 -190', T.cobreClaro, 0.5, 0.6)}</g>` +
    nube(21.4, -191.2, 1.4, 0.9, T.cobre, 'xs', 0.85) +
    trazo('M21.8 -189.8 Q19.6 -189.6 17 -190.9', T.negro, 1.1, 0.95) +
    trazo('M17 -190.9 l-1.3 -1.6', T.negro, 0.8, 0.85) +
    soplo('M20.2 -189.9 L21 -189.8 L20.5 -188.4 Z', T.huesoClaro, 'xs') +
    nube(20.4, -187.7, 1.6, 0.8, T.cobreClaro, 'xs', 0.8) +
    nube(19.8, -186, 1.6, 0.6, T.brasa, 'xs', 0.8) +
    nube(20.6, -184.8, 1.4, 1, T.cobre, 'xs', 0.9) +
    // La quijada, y los tendones del cogote, torcido para mirar para atrás.
    trazo('M12.6 -183.2 Q16 -184 19.2 -184.4', T.negro, 1.2, 0.5) +
    trazo('M-4 -197 Q1 -191 7 -185.4', T.brasa, 1.8, 0.7) +
    trazo('M-3 -197.4 Q2 -191.4 8 -185.6', T.cobre, 0.7, 0.6) +
    // La pelada: el fuego de enfrente la prende por arriba, la vela de frente.
    nube(5, -216, 7, 5, T.cobre, 'm', 0.7) +
    nube(5, -221.8, 6, 2.4, T.cobreClaro, 's', 0.85) +
    nube(7, -223, 2, 1, T.brillo, 'xs', 0.9) +
    soplo('M-15.4 -212.6 Q2 -218.4 17.4 -213.2 L17.2 -211 Q2 -216 -15.4 -210.4 Z', T.cobreHondo, 'xs', 0.6) +
    oxidado(rnd, 22, () => [-12 + rnd() * 22, -222 + rnd() * 34], 0.85) +
    // La perilla en punta, del verdín, con el canto de la vela.
    soplo('M19.6 -184 Q21.6 -178 23.4 -170.4 L24.2 -164.6 Q19.6 -171.6 16 -179.6 Z', T.verdin, 'xs') +
    Array.from({ length: 26 }, () => {
      const t = rnd();
      const x = 17.8 + t * 5 + (rnd() - 0.5) * 2;
      const y = -183 + t * 16;
      return trazo(`M${f(x)} ${f(y)} l${f(0.4 + rnd() * 0.6)} ${f(1.6 + rnd() * 2)}`, rnd() < 0.6 ? T.negro : T.oxido, 0.4, 0.8);
    }).join('') +
    // El canto: la vela en el perfil, el fuego de atrás arriba.
    canto([[16.8, -218], [19.8, -212], [21.8, -209.2], [20.4, -206.2], [23.4, -201.6], [28.6, -195]], T.oro, 1.8, 0.95, 'xs') +
    canto([[22.8, -191.6], [21.6, -189.8], [19.4, -189.2], [20.8, -187], [19.8, -184], [21.6, -178], [23.4, -170.4], [24.2, -164.6]], T.fuego, 1.6, 0.85, 'xs') +
    canto([[-15, -212], [-9.6, -222], [0.6, -226.2], [10.6, -224], [16.8, -218]], T.fuego, 4.4, 0.95) +
    canto([[-15, -212], [-17.4, -203.4], [-15.4, -196], [-12.8, -190]], T.fuego, 1.8, 0.5) +
    // La herradura de pelo de atrás.
    enmascarado('m-diablo-pelo-cara', curva(PELO_CARA),
      soplo(curva(PELO_CARA), T.verdin, 's', 0.9) +
      Array.from({ length: 24 }, () => trazo(`M${f(-17 + rnd() * 10)} ${f(-205 + rnd() * 12)} l${f(0.6 + rnd())} ${f(1.6 + rnd() * 2)}`, rnd() < 0.6 ? T.negro : T.oxido, 0.45, 0.7)).join(''));
  const oreja = curva(OREJA_CARA);
  return conGrano(
    cuerno('m-diablo-cuerno-3', CUERNOS_CARA[0], 7, false, 771) +
    enmascarado('m-diablo-cara', d, cara) +
    // La oreja en punta, de costado: el hueco de adentro en la sombra y la punta prendida a contraluz.
    enmascarado('m-diablo-oreja-cara', oreja,
      forma(oreja, T.cobreHondo) +
      nube(-7.6, -215, 2.6, 5, T.rojo, 's', 0.85) +
      soplo('M-1.6 -209 Q-5.4 -210.6 -6.6 -205 Q-5.6 -201.4 -2.4 -201.6 Q-4.4 -205.6 -1.6 -209 Z', T.brasa, 'xs', 0.9) +
      nube(-2.4, -207, 1, 2, T.cobre, 'xs', 0.7) +
      canto(OREJA_CARA.slice(0, 4), T.fuego, 1.8, 0.95, 'xs')) +
    cuerno('m-diablo-cuerno-4', CUERNOS_CARA[1], 8.4, true, 773),
  );
}

/* ------------------------------------------------------------------
   Los brazos: las mangas del frac, el puño de la camisa, la mano de cobre
   ------------------------------------------------------------------ */

const [H1, H2] = A.hombros;
const L = A.largos;

/** La manga de arriba del brazo derecho, colgando del hombro hasta el codo. */
const MANGA: readonly Q[] = [[31, -175.4], [37.6, -172], [40.6, -163], [39.6, -148], [38.2, -134], [37, -126], [32, -120.4], [26, -123], [24.6, -134], [23.6, -150], [24, -164], [26.6, -172]];

function brazo(): string {
  const d = curva(MANGA);
  const rnd = azar(781);
  return conGrano(
    enmascarado('m-diablo-brazo', d,
      forma(d, T.cuero) +
      nube(35, -150, 4, 22, T.cueroClaro, 'm', 0.95) +
      nube(27, -146, 3, 20, T.negro, 's', 0.6) +
      nube(31, -126, 5, 4, T.negro, 's', 0.5) +
      craquelado(rnd, 70, enCaja(rnd, 24, -174, 17, 54), ([x]) => 0.3 + (x - 24) / 24) +
      trazo('M27 -150 Q30 -140 28 -128', T.negro, 1.2, 0.4) +
      canto([[26.6, -172], [31, -175.4], [37.6, -172], [40.6, -163], [39.6, -148], [38.2, -134], [37, -126]], T.fuego, 3.4, 0.95) +
      canto([[37.6, -172], [40.6, -163], [39.6, -150]], T.oro, 1.2, 0.8, 'xs') +
      canto([[24, -164], [23.6, -150], [24.6, -134]], T.fuego, 1.2, 0.35, 'xs')),
  );
}

/** La mano de cobre colgando, vista de atrás: los nudillos, los dedos largos y las uñas de verdín. */
function mano([x, y]: P, id: string, luzFuerte: boolean): string {
  const palma = curva([[x - 4, y], [x + 4, y], [x + 5.4, y + 6], [x + 5, y + 13], [x + 3, y + 19], [x + 0.4, y + 21.4], [x - 2.2, y + 19.6], [x - 4.2, y + 13.6], [x - 5, y + 6.6]]);
  const pulgar = curva([[x - 4.4, y + 3], [x - 7, y + 6.4], [x - 7.6, y + 11], [x - 6, y + 14.4], [x - 4.8, y + 10]]);
  const k = luzFuerte ? 1 : 0.55;
  const rnd = azar(Math.round(Math.abs(x) * 7 + Math.abs(y)));
  const dedos = [-2.6, -0.2, 2.2].map((dx) => trazo(`M${f(x + dx)} ${f(y + 9)} L${f(x + dx * 1.1)} ${f(y + 19)}`, T.verdin, 0.8, 0.85)).join('');
  // Las uñas largas, en punta, que salen de la punta de los dedos.
  const unas = [-2.2, 0.4, 2.8].map((dx, i) => soplo(`M${f(x + dx - 1.1)} ${f(y + 19 + i * 0.4)} L${f(x + dx + 1.1)} ${f(y + 19.4 + i * 0.4)} L${f(x + dx * 1.15)} ${f(y + 24.4 + i * 0.6)} Z`, T.verdin, 'xs')).join('');
  return (
    unas +
    `<clipPath id="${id}"><path d="${palma}"/><path d="${pulgar}"/></clipPath><g clip-path="url(#${id})">` +
    forma(palma, T.cobreHondo) + forma(pulgar, T.cobreHondo) +
    nube(x + 2.6, y + 8, 3, 8, T.cobre, 's', 0.9 * k) +
    nube(x + 3.6, y + 5, 1.6, 3, T.cobreClaro, 'xs', 0.9 * k) +
    [-2.6, -0.2, 2.2, 4.4].map((dx) => nube(x + dx, y + 7.6, 1, 0.8, T.cobreClaro, 'xs', 0.7 * k)).join('') +
    dedos +
    oxidado(rnd, 8, () => [x - 4 + rnd() * 9, y + 2 + rnd() * 17], 0.5) +
    canto([[x + 4, y], [x + 5.4, y + 6], [x + 5, y + 13], [x + 3, y + 19]], T.fuego, 1.6, 0.9 * k, 'xs') +
    `</g>`
  );
}

/** El antebrazo derecho con el puño de la camisa y la mano, colgando del codo. */
function antebrazo(): string {
  const [sx, sy] = H2;
  const codo = sy + L.brazo;
  const manga = curva([[sx - 6, codo - 6], [sx + 6, codo - 6], [sx + 5.6, codo + 14], [sx + 4.6, codo + 35.6], [sx - 4.6, codo + 35.6], [sx - 5.6, codo + 14]]);
  const rnd = azar(791);
  const puno = `M${sx - 4.6} ${codo + 35} L${sx + 4.6} ${codo + 35} L${sx + 4.2} ${codo + 38.6} L${sx - 4.2} ${codo + 38.6} Z`;
  return conGrano(
    enmascarado('m-diablo-antebrazo', manga,
      forma(manga, T.cuero) +
      nube(sx + 3, codo + 14, 3, 18, T.cueroClaro, 'm', 0.95) +
      nube(sx - 3.6, codo + 14, 2.4, 18, T.negro, 's', 0.6) +
      craquelado(rnd, 40, enCaja(rnd, sx - 5, codo - 4, 11, 38), ([x]) => 0.3 + (x - sx + 5) / 12) +
      trazo(`M${sx - 3} ${codo + 6} Q${sx} ${codo + 4} ${sx + 3} ${codo + 7}`, T.negro, 1, 0.5) +
      canto([[sx + 6, codo - 6], [sx + 5.6, codo + 14], [sx + 4.6, codo + 35.6]], T.fuego, 2.6, 0.9)) +
    enmascarado('m-diablo-puno', puno, forma(puno, T.hueso) + nube(sx - 2, codo + 37, 3, 2, T.huesoHondo, 's', 0.7) + nube(sx + 3, codo + 36, 1.4, 1.4, T.huesoClaro, 'xs', 0.9)) +
    mano([sx, codo + 38], 'm-diablo-mano', true),
  );
}

/** El brazo izquierdo, del otro lado del cuerpo: el cuerpo lo tapa, y asoma la manga, el puño y la mano. */
function brazoIzq(): string {
  const [sx, sy] = H1;
  const manga = curva([[sx, sy - 7], [sx + 6, sy - 3], [sx + 7, sy + 15], [sx + 5.6, sy + 45], [sx + 4.6, sy + 77], [sx - 4.6, sy + 77], [sx - 6, sy + 45], [sx - 7, sy + 15], [sx - 6.4, sy - 1]]);
  const puno = `M${sx - 4.6} ${sy + 76.4} L${sx + 4.6} ${sy + 76.4} L${sx + 4.2} ${sy + 80} L${sx - 4.2} ${sy + 80} Z`;
  return conGrano(
    enmascarado('m-diablo-brazo-izq', manga,
      forma(manga, T.cuero) +
      nube(sx - 3.6, sy + 40, 2.4, 34, T.cueroClaro, 'm', 0.6) +
      trazo(`M${sx - 3} ${sy + 46} Q${sx} ${sy + 43} ${sx + 3} ${sy + 47}`, T.negro, 1, 0.5) +
      canto([[sx - 6.4, sy - 1], [sx - 7, sy + 15], [sx - 6, sy + 45], [sx - 4.6, sy + 77]], T.fuego, 2.2, 0.55)) +
    enmascarado('m-diablo-puno-izq', puno, forma(puno, T.huesoHondo) + nube(sx - 2, sy + 78, 2, 1.4, T.hueso, 'xs', 0.6)) +
    `<g transform="translate(${f(2 * sx)} 0) scale(-1 1)">${mano([sx, sy + 79.4], 'm-diablo-mano-izq', false)}</g>`,
  );
}

/* ------------------------------------------------------------------
   Las piernas: el pantalón del cielo violeta, y las pezuñas
   ------------------------------------------------------------------ */

/** Una pierna colgando de su cadera hasta el piso: el pantalón, el mechón de chivo y la pezuña partida. */
function pierna(n: 1 | 2): string {
  const [cx, cy] = A.caderas[n - 1];
  const lado = n === 1 ? -1 : 1;
  const ancho = n === 2 ? 1.06 : 1;
  const w = (v: number): number => v * ancho;
  const pts: Q[] = [
    [cx - w(9.6), cy - 6], [cx + w(9.6), cy - 6], [cx + w(8.8), cy + 22], [cx + w(7.4), cy + 50], [cx + w(6.4), cy + 72], [cx + w(6), cy + 89],
    [cx - w(6), cy + 89], [cx - w(6.4), cy + 72], [cx - w(7.4), cy + 50], [cx - w(8.8), cy + 22],
  ];
  const d = curva(pts);
  const afuera = (k: number): number => cx + lado * k;
  const rnd = azar(800 + n);
  // El mechón de pelo de chivo que cuelga sobre la pezuña.
  let mechon = '';
  for (let i = 0; i < 26; i++) {
    const x = cx - 7 + rnd() * 14;
    mechon += trazo(`M${f(x)} ${f(cy + 86 + rnd() * 2)} l${f((x - cx) * 0.18 + (rnd() - 0.5))} ${f(4 + rnd() * 3)}`, rnd() < 0.5 ? T.verdin : T.cueroClaro, 0.7, 0.9);
  }
  // La pezuña de atrás: los dos talones partidos, de cuerno lustroso, con el canto del fuego.
  const piso = cy + A.pierna;
  const talon = (dx: number): string => curva([[cx + dx - 3.8, piso - 8], [cx + dx + 3.6, piso - 8], [cx + dx + 4.4, piso - 3], [cx + dx + 3.4, piso], [cx + dx - 3.4, piso], [cx + dx - 4.6, piso - 3]]);
  const talones = [talon(-3.6), talon(3.6)];
  return conGrano(
    enmascarado(`m-diablo-pierna-${n}`, d,
      forma(d, T.violetaHondo) +
      nube(afuera(4), cy + 44, 3.2, 40, T.violeta, 'm', n === 2 ? 0.7 : 0.4) +
      nube(cx - lado * 4, cy + 44, 3, 40, T.negro, 'm', 0.55) +
      // Las arrugas de la corva y del ruedo.
      trazo(`M${f(cx - 5)} ${f(cy + 50)} Q${f(cx)} ${f(cy + 47)} ${f(cx + 5)} ${f(cy + 51)}`, T.negro, 1.2, 0.5) +
      trazo(`M${f(cx - 4)} ${f(cy + 55)} Q${f(cx)} ${f(cy + 53)} ${f(cx + 4.4)} ${f(cy + 56)}`, T.violeta, 0.7, 0.5) +
      trazo(`M${f(cx - 5)} ${f(cy + 80)} Q${f(cx + 1)} ${f(cy + 77)} ${f(cx + 5)} ${f(cy + 82)}`, T.negro, 1, 0.5) +
      // El piso le devuelve la brasa al ruedo; el fuego le prende el canto de afuera.
      nube(cx, cy + 88, 8, 6, T.brasa, 's', 0.9) +
      canto([[cx + lado * w(9.6), cy - 6], [cx + lado * w(8.8), cy + 22], [cx + lado * w(7.4), cy + 50], [cx + lado * w(6.4), cy + 72], [cx + lado * w(6), cy + 89]], T.fuego, 2.4, n === 2 ? 0.9 : 0.6)) +
    `<clipPath id="m-diablo-pezuna-${n}">${talones.map((t) => `<path d="${t}"/>`).join('')}</clipPath><g clip-path="url(#m-diablo-pezuna-${n})">` +
    forma(talones.join(' '), T.verdin) +
    nube(cx + lado * 4, piso - 5, 3, 3, T.cueroClaro, 's', 0.9) +
    nube(cx + lado * 5, piso - 6, 1.2, 1.4, T.fuego, 'xs', 0.9) +
    nube(cx, piso - 1, 8, 1.6, T.brasa, 'xs', 0.9) +
    trazo(`M${f(cx)} ${f(piso - 8)} L${f(cx)} ${f(piso)}`, T.negro, 1, 0.9) +
    `</g>` +
    mechon,
  );
}

/* ------------------------------------------------------------------
   La cola: del cobre de la pelada, con la punta de flecha
   ------------------------------------------------------------------ */

const [RX, RY] = A.cola;
const [KX, KY] = A.codoDeLaCola;
const EJE_COLA: readonly P[] = [[RX, RY - 3], [RX - 0.6, RY + 12], [RX - 2.4, RY + 24], [RX - 4.6, RY + 36], [KX, KY + 1]];
const EJE_PUNTA: readonly P[] = [[KX, KY - 1], [KX - 1.4, KY + 12], [KX + 0.6, KY + 23], [KX + 5.4, KY + 31], [KX + 12, KY + 36]];

function tramoDeCola(id: string, eje: readonly P[], anchos: readonly number[], semilla: number): string {
  const t = tubo(eje, anchos, 16);
  const rnd = azar(semilla);
  return enmascarado(id, t.d,
    forma(t.d, T.oxido) +
    eje.map(([x, y]) => nube(x + 1, y, 1.2, 4, T.cobreHondo, 's', 0.9)).join('') +
    oxidado(rnd, 10, () => {
      const { p } = enLinea(eje, rnd());
      return [p[0] + (rnd() - 0.5) * 3, p[1]];
    }, 0.7) +
    canto(t.der, T.fuego, 1.8, 0.95, 'xs') +
    canto(t.izq, T.fuego, 1.2, 0.5, 'xs'));
}

/** El primer tramo de la cola: sale de debajo del frac, arriba de la abertura, en la sombra de los faldones. */
function cola(): string {
  return conGrano(tramoDeCola('m-diablo-cola', EJE_COLA, [6, 5.6, 5, 4.6], 811) + nube(RX, RY - 1, 4, 4, T.negro, 's', 0.8));
}

/** El sentido en que apunta la flecha de la cola, y su punta: el test la sigue para que no tape a nadie. */
const [BX, BY] = EJE_PUNTA[EJE_PUNTA.length - 1]!;
const SENTIDO_FLECHA: P = (() => {
  const [ax, ay] = EJE_PUNTA[EJE_PUNTA.length - 2]!;
  const l = Math.hypot(BX - ax, BY - ay);
  return [(BX - ax) / l, (BY - ay) / l];
})();
export const PUNTA_DE_LA_FLECHA: P = [BX + SENTIDO_FLECHA[0] * 10.6, BY + SENTIDO_FLECHA[1] * 10.6];

/** La segunda mitad de la cola y la flecha de la punta. */
function punta(): string {
  const [bx, by] = [BX, BY];
  const u = SENTIDO_FLECHA;
  const nn: P = [-u[1], u[0]];
  const en = (a: number, b: number, esquina = false): Q => {
    const [x, y] = [bx + u[0] * a + nn[0] * b, by + u[1] * a + nn[1] * b];
    return esquina ? [x, y, 'v'] : [x, y];
  };
  const flecha = curva([en(-1, 0), en(-3.6, 4.6), en(-1.2, 6.4, true), en(4, 3.6), en(10.6, 0, true), en(4, -3.6), en(-1.2, -6.4, true), en(-3.6, -4.6)]);
  const [cx, cy] = [bx + u[0] * 3, by + u[1] * 3];
  return conGrano(
    tramoDeCola('m-diablo-punta', EJE_PUNTA, [4.6, 4.2, 3.6, 3], 821) +
    enmascarado('m-diablo-flecha', flecha,
      forma(flecha, T.oxido) + nube(cx + 1, cy - 1, 4, 3, T.cobreHondo, 's', 0.95) + nube(cx + 3, cy - 1.6, 1.6, 1.2, T.cobre, 'xs', 0.9) +
      `<path d="${flecha}" fill="none" stroke="${T.fuego}" stroke-width="1.6" filter="url(#soplo-xs)" opacity="0.8"/>`),
  );
}

/* ------------------------------------------------------------------
   Lo de atrás: el vapor de pincel seco y la sombra en el piso encerado
   ------------------------------------------------------------------ */

/**
 * El vapor: pinceladas secas en la crema de *Gulp!*, que se enroscan para arriba, con un soplo debajo
 * que es el cuerpo del vapor. El (0, 0) es donde cayó.
 */
function vaporPintado(): string {
  const rulo = (cx: number, cy: number, r: number, desde: number, vuelta: number): P[] => {
    const pts: P[] = [];
    for (let k = 0; k <= 24; k++) {
      const a = desde + (k / 24) * vuelta;
      const rr = r * (1 - (k / 24) * 0.45);
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
    }
    return pts;
  };
  // El vapor es un montón de bollos que suben: el de abajo ancho y chato, contra el piso, y los de
  // arriba que se abren y se separan, como el humo de un fierro caliente cuando le cae agua.
  const bollos: ReadonlyArray<readonly [number, number, number, number]> = [
    [0, -4, 10, 4.6], [-7, -12, 7.4, 6.6], [6, -14, 8.4, 7.4], [-2, -24, 8.6, 8], [8, -30, 6, 5.6], [-7, -36, 5.4, 5], [2, -42, 4.4, 4],
  ];
  const cuerpo =
    nube(0, -20, 14, 22, T.crema, 'l', 0.22) +
    bollos.map(([x, y, rx, ry], i) => nube(x, y, rx, ry, T.crema, 'xs', 0.34 - i * 0.025) + nube(x - rx * 0.2, y - ry * 0.3, rx * 0.5, ry * 0.45, T.crema, 'xs', 0.3)).join('');
  // Y cada bollo, repasado a pincel seco: la vuelta de arriba, que se seca antes de cerrar.
  const rulos = bollos.map(([x, y, rx], i) => rulo(x, y, rx * 0.92, (i % 2 ? 3.4 : 3.9) + i * 0.3, (i % 2 ? -1 : 1) * 3.6));
  return cuerpo + tinta(pinceladas(rulos, { ancho: 2.2, seco: 0.4, tinta: T.crema, grano: 6, apoyo: [0.3, 0.2] }, 851));
}

/** La sombra en el damero: la de los pies, y el reflejo oscuro de las piernas y los faldones en lo encerado. */
function sombra(): string {
  return (
    nube(1, -1, 30, 3.6, T.negro, 's', 0.85) +
    nube(-13, 0, 9, 2.4, T.negro, 'xs', 0.8) +
    nube(14, 0, 9, 2.4, T.negro, 'xs', 0.8) +
    // El reflejo: las piernas para abajo, y los faldones más abajo todavía, apagados y soplados.
    soplo('M-20 2 L-6 2 L-8 40 L-18 40 Z', T.negro, 'm', 0.5) +
    soplo('M6 2 L21 2 L19 40 L8 40 Z', T.negro, 'm', 0.5) +
    soplo('M-29 46 L31 46 L28 100 L-26 100 Z', T.negro, 'l', 0.38)
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

/**
 * La densidad: el retrato de la ficha lo ve a unos 1,4 píxeles de pantalla por unidad del títere, y en
 * un teléfono de pantalla triple eso son 4. En la escena, a la mitad, sobra.
 */
const D = 3.6;
/** La calidad del webp: el grano y las grietas del cuero son un ruido fino que a la de siempre se lava. */
const Q_ = 94;

export const PIEZAS_DIABLO: readonly Pieza[] = [
  { nombre: 'diablo-sombra', caja: [-44, -8, 88, 112], dibujo: sombra(), densidad: 0.7 },
  { nombre: 'diablo-vapor', caja: [-26, -54, 52, 62], dibujo: vaporPintado(), densidad: 2.2 },
  { nombre: 'diablo-pierna-1', caja: [-25, -110, 26, 112], dibujo: pierna(1), densidad: D, calidad: Q_ },
  { nombre: 'diablo-pierna-2', caja: [1, -110, 26, 112], dibujo: pierna(2), densidad: D, calidad: Q_ },
  { nombre: 'diablo-brazo-izq', caja: [H1[0] - 12, H1[1] - 10, 22, 106], dibujo: brazoIzq(), densidad: D, calidad: Q_ },
  { nombre: 'diablo-nuca', caja: [-26, -254, 56, 82], dibujo: nuca(), densidad: D * 1.2, calidad: Q_ },
  { nombre: 'diablo-frac', caja: [-38, -190, 80, 146], dibujo: frac() + camisa(), densidad: D, calidad: Q_ },
  { nombre: 'diablo-cola', caja: [-12, -117, 18, 62], dibujo: cola(), densidad: D, calidad: Q_ },
  { nombre: 'diablo-punta', caja: [-14, -66, 36, 54], dibujo: punta(), densidad: D, calidad: Q_ },
  { nombre: 'diablo-brazo', caja: [21, -178, 22, 60], dibujo: brazo(), densidad: D, calidad: Q_ },
  { nombre: 'diablo-antebrazo', caja: [H2[0] - 10, H2[1] + L.brazo - 9, 20, 75], dibujo: antebrazo(), densidad: D, calidad: Q_ },
  { nombre: 'diablo-vuelta', caja: [-26, -256, 56, 94], dibujo: vuelta(), densidad: D * 1.4, calidad: Q_ },
];

const img = imagenesDe(PIEZAS_DIABLO);

/**
 * El ojo de la página, adentro de la cara vuelta: el iris rojo y la pupila que mira, y el párpado que
 * baja. El recorte del blanco lleva el nombre de dónde está, porque la escena y la ficha van en la misma
 * página y dos recortes con el mismo nombre se pisan.
 */
function ojo(t: Readonly<Record<string, Readonly<Record<string, string>>>>, donde: string): string {
  const [ox, oy] = A.ojo.centro;
  const [rx, ry] = A.ojo.radio;
  return (
    `<clipPath id="diablo-ojo-${donde}"><ellipse cx="${ox}" cy="${oy}" rx="${rx}" ry="${f(ry * 0.92)}"/></clipPath>` +
    `<g clip-path="url(#diablo-ojo-${donde})">` +
    `<g data-parte="pupila" transform="${t.pupila!.transform}">` +
    `<circle cx="${ox}" cy="${oy}" r="2.5" class="bt-diablo-iris"/><circle cx="${ox}" cy="${oy}" r="1.15" class="bt-diablo-pupila"/>` +
    `<circle cx="${f(ox + 0.8)}" cy="${f(oy - 0.9)}" r="0.5" class="bt-diablo-brillo"/></g>` +
    `<ellipse data-parte="parpado" cx="${ox}" cy="${f(oy - 0.3)}" rx="${f(rx + 0.6)}" ry="${f(ry + 0.7)}" class="bt-diablo-parpado" transform="${t.parpado!.transform}"/>` +
    `</g>`
  );
}

const atributos = (a: Readonly<Record<string, string>> | undefined): string =>
  a ? Object.entries(a).map(([k, v]) => ` ${k}="${v}"`).join('') : '';

/** El diablo armado con los atributos de una pose (`transformes`, `rig-diablo.ts`). */
function armado(t: Readonly<Record<string, Readonly<Record<string, string>>>>, donde: string): string {
  const parte = (nombre: string, cuerpo: string): string => `<g data-parte="${nombre}"${atributos(t[nombre])}>${cuerpo}</g>`;
  return (
    parte('pierna-1', img('diablo-pierna-1')) +
    parte('pierna-2', img('diablo-pierna-2')) +
    parte(
      'cuerpo',
      parte('brazo-izq', img('diablo-brazo-izq')) +
        parte('nuca', img('diablo-nuca')) +
        img('diablo-frac') +
        parte('cola', img('diablo-cola') + parte('punta', img('diablo-punta'))) +
        parte('brazo', img('diablo-brazo') + parte('antebrazo', img('diablo-antebrazo'))) +
        parte('vuelta', img('diablo-vuelta') + ojo(t, donde)),
    )
  );
}

/** Lo que va en el piso, atrás: la sombra, el brillo donde cae, el chorro, el vapor y las chispas. */
function suelo(t: Readonly<Record<string, Readonly<Record<string, string>>>>): string {
  const el = (tag: string, nombre: string, extra: string): string => `<${tag} data-parte="${nombre}" ${extra}${atributos(t[nombre])}/>`;
  return (
    img('diablo-sombra') +
    el('ellipse', 'charco', 'cx="0" cy="0" rx="10" ry="2.6" class="bt-diablo-charco"') +
    el('path', 'chorro-halo', 'class="bt-diablo-halo"') +
    el('path', 'chorro', 'class="bt-diablo-chorro"') +
    [1, 2, 3].map((n) => `<g data-parte="vapor-${n}"${atributos(t[`vapor-${n}`])}>${img('diablo-vapor')}</g>`).join('') +
    [1, 2, 3].map((n) => el('circle', `chispa-${n}`, 'cx="0" cy="0" r="2.6" class="bt-diablo-chispa"')).join('')
  );
}

/**
 * El diablo en una pose, sin lo que lo hace tocable: para la escena, el retrato y el test. `donde`
 * le pone nombre propio al recorte del ojo.
 */
export function diabloEn(p: Pose, donde = 'escena'): { atras: string; figura: string } {
  const t = transformes(p);
  return {
    atras: `<g class="diablo-suelo" aria-hidden="true" pointer-events="none"><g data-parte="suelo"${atributos(t.suelo)}>${suelo(t)}</g></g>`,
    figura: `<g data-parte="entero"${atributos(t.entero)}>${armado(t, donde)}</g>`,
  };
}

const ID = 'el-diablo-que-mea-en-todas-partes';

/** El títere que se toca, en la pose quieta: meando contra la pared de fuego, de espaldas. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--diablo" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El diablo que mea en todas partes'}">` +
    diabloEn(poseQuieta()).figura +
    `</g>`
  );
}

/**
 * El retrato de la ficha: lo pescaste. Sigue meando, pero se dio vuelta por encima del hombro y te
 * mira con la mano en la pelada, que es donde le falta el gorro. Va contra su pedazo de pared de fuego
 * y de damero, que la página ya cargó.
 */
export const RETRATO = { caja: [SITIO.x - 60, SITIO.piso - 162, 142, 176] as const };
function retrato(): string {
  const fondo = (nombre: string, y: number, alto: number): string => `<image href="/bestiario/${nombre}.webp" x="0" y="${y}" width="900" height="${alto}" preserveAspectRatio="none"/>`;
  const { atras, figura } = diabloEn(poseQuieta(true), 'retrato');
  return (
    fondo('infierno-lejos', 0, 640) +
    `<g class="infierno-fuego" transform="translate(-30 -330)"><image href="/bestiario/infierno-pincelada.webp" x="0" y="0" width="953" height="953" preserveAspectRatio="none"/></g>` +
    fondo('infierno-cerca', 300, 340) +
    atras +
    figura
  );
}

export const DIABLO: Personaje = {
  id: ID,
  region: 'el-infierno',
  ancla: SITIO.x,
  piezas: PIEZAS_DIABLO,
  capas: { atras: () => diabloEn(poseQuieta()).atras, figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
