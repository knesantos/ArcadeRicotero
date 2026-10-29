/**
 * El verdugo que cena distinguido (`D-73`, decimoctava vuelta), en la otra punta de la mesa servida.
 *
 * *"El hijo tenaz de tu enemigo / el muy verdugo cena distinguido"* es de *Jijiji*, en *Oktubre* (1986).
 * Por eso está **tallado**, como la gente de la tapa de *Oktubre*: la plancha negra y la luz sacada a
 * gubia (`grabado.ts`), en el negro y el blanco medidos de la tapa y el rojo de las banderas. Y como en
 * la mesa todo es recorte del collage de la contratapa de *La mosca y la sopa*, el grabado está
 * **recortado**: cada pieza lleva el canto de papel donde pasó la tijera, como la mosca y la olla.
 *
 * De la letra son la cena y los buenos modales; del dibujo, todo lo demás: la capucha de punta, los
 * guantes blancos, el meñique parado con la copa, la guinda que pincha y el hacha apoyada en la silla.
 * Por los agujeros de la capucha no se ve una cara: se ven dos puntos al rojo. Para comer se levanta el
 * faldón de la capucha, y abajo hay una pera blanca y una sonrisa.
 *
 * Coordenadas del títere: el (0, 0) es el canto de atrás del tablero, debajo de él (`rig-verdugo.ts`).
 */

import { forma, imagenesDe, nube, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { bola, cubica, envolventes, paralelas, picado, plancha, siguiendo, tallar, tono, trazo as corte, type P } from './grabado.ts';
import { GESTOS, VERDUGO, VERDUGO_ARMADO as A, codoDibujado, marcas, munecaDibujada, type Gesto } from './rig-verdugo.ts';

const f = (v: number): string => (Math.round(v * 100) / 100).toString();
const suave = (t: number): number => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/** Las tintas de *Oktubre* (`tokens.css`), y el papel del collage de la mesa para el canto. */
const T = {
  negro: 'var(--bestia-verdugo-negro)',
  papel: 'var(--bestia-dracula-papel)',
  rojo: 'var(--bestia-verdugo-rojo)',
  brasa: 'var(--bestia-verdugo-brasa)',
  canto: 'var(--entorno-mesa-papel)',
  gris: 'var(--disco-oktubre-apoyo)',
};

/** La luz: el seguidor que se escapa de la foto del escenario, arriba a la derecha y un poco adelante. */
const LUZ = [0.55, -0.6, 0.6] as const;
/** La luz apretada: en *Oktubre* casi no hay medio tono. */
const apretada = (luz: (x: number, y: number) => number) => (x: number, y: number): number => suave((luz(x, y) - 0.2) / 0.5);

/* ------------------------------------------------------------------
   Herramientas
   ------------------------------------------------------------------ */

function curva(pts: readonly P[], cerrada = true): string {
  const n = pts.length;
  const en = (i: number): P => (cerrada ? pts[(i + n) % n]! : pts[Math.min(n - 1, Math.max(0, i))]!);
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  for (let i = 0; i < (cerrada ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [en(i - 1), en(i), en(i + 1), en(i + 2)];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return cerrada ? `${d} Z` : d;
}

const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;
const poli = (pts: readonly P[]): string => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;

/** La caja de un contorno, con un margen. */
function cajaDe(pts: readonly P[], margen = 3): readonly [number, number, number, number] {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, y0] = [Math.min(...xs) - margen, Math.min(...ys) - margen];
  return [x0, y0, Math.max(...xs) + margen - x0, Math.max(...ys) + margen - y0];
}

/** El canto del recorte: la silueta un poco más gorda, en el papel del collage, por debajo de todo. */
const canto = (d: string, ancho = 5): string =>
  `<path d="${d}" fill="${T.canto}" stroke="${T.canto}" stroke-width="${ancho}" stroke-linejoin="round"/>`;

/** Una plancha tallada con su canto de papel: lo que es cada pieza del verdugo. */
function recorte(id: string, contorno: readonly P[], adentro: Omit<Parameters<typeof plancha>[2], 'negro' | 'papel' | 'caja'>, conCanto = true): string {
  const d = curva(contorno);
  return (conCanto ? canto(d) : '') + plancha(id, d, { negro: T.negro, papel: T.papel, caja: cajaDe(contorno), ...adentro });
}

/* ------------------------------------------------------------------
   La silla y el hacha
   ------------------------------------------------------------------ */

/** El respaldo: alto, de punta, como el de un tribunal; casi negro, con la luz del seguidor en el canto. */
const RESPALDO: readonly P[] = [[-50, 0], [-51, -120], [-50, -196], [-36, -222], [0, -246], [36, -222], [50, -196], [51, -120], [50, 0]];

function silla(): string {
  const luz = apretada(tono(0.04, [{ c: [44, -170], r: [16, 90], peso: 0.95, blando: 0.8 }, { c: [0, -232], r: [30, 12], peso: 0.6, blando: 0.8 }]));
  const lineas = paralelas([-52, -248, 104, 250], { angulo: 90, paso: 3.2, comba: 0.02, semilla: 1811 });
  // La ojiva tallada en el medio del respaldo: dos cortes finos que se juntan arriba.
  const ojiva = corte(cubica([[-24, -10], [-26, -120], [-14, -180], [0, -204]]), 1.3, 1812) + corte(cubica([[24, -10], [26, -120], [14, -180], [0, -204]]), 1.3, 1813);
  // El respaldo es un plano de atrás: va en el gris que Rocambole contó que agregó a la tapa, como los
  // planos de atrás de la prisión, para que la capucha negra se despegue.
  const d = curva(RESPALDO);
  return canto(d) + plancha('ve-silla', d, { negro: T.gris, papel: T.papel, caja: cajaDe(RESPALDO), tallas: tallar(lineas, luz, { ancho: 2.2, umbral: [0.12, 0.85], semilla: 1814 }), motas: false }) + `<path d="${ojiva}" fill="${T.negro}" opacity="0.7"/>`;
}

/** El hacha, apoyada contra la silla: el cabo largo y la hoja de media luna, con el filo para afuera. */
const [HP, HC] = [A.hacha.pie, A.hacha.cabeza];
/** Lo que se inclina el cabo, en grados (positivo es la punta para la derecha). */
const LADEO = (Math.atan2(HC[0] - HP[0], HP[1] - HC[1]) * 180) / Math.PI;
/** Un punto de la hoja, dibujada con el cabo parado (x para el filo, y para abajo), llevado al cabo ladeado. */
function enLaHoja([u, v]: P): P {
  const a = (LADEO * Math.PI) / 180;
  return [HC[0] + u * Math.cos(a) - v * Math.sin(a), HC[1] + u * Math.sin(a) + v * Math.cos(a)];
}
/** La hoja: sale del cabo cerca de la punta y se abre en media luna, con las dos puntas del filo. */
const HOJA: readonly P[] = ([[-2, 2], [8, -2], [18, -16], [26, -8], [31, 10], [29, 30], [22, 44], [12, 34], [2, 28], [-2, 24]] as const).map((p) => enLaHoja(p));
/** El filo: la curva de afuera de la media luna. */
const FILO: readonly P[] = ([[18, -15], [27, -6], [31.4, 10], [29.4, 30], [22, 43]] as const).map((p) => enLaHoja(p));

function hacha(): string {
  const ancho = 3.2;
  const a = (LADEO * Math.PI) / 180;
  const [nx, ny] = [Math.cos(a), Math.sin(a)];
  const cabo: P[] = [[HP[0] - nx * ancho, HP[1] - ny * ancho], [HC[0] - nx * ancho, HC[1] - ny * ancho - 6], [HC[0] + nx * ancho, HC[1] + ny * ancho - 6], [HP[0] + nx * ancho, HP[1] + ny * ancho]];
  const luzCabo = apretada(tono(0.1, [(x, y) => 0.55 + 0.45 * Math.sin((x - HP[0] - (HP[1] - y) * Math.tan(a)) * 0.9)]));
  const luzHoja = apretada(tono(0.02, [{ c: enLaHoja([22, 12]), r: [14, 26], peso: 1.15, blando: 0.9 }, { c: enLaHoja([4, 12]), r: [5, 18], peso: -0.5, blando: 0.8 }]));
  const lineasHoja = envolventes(enLaHoja([12, 14]), [20, 28], { paso: 2.3, comba: 0.25, giro: LADEO + 90, semilla: 1823 });
  // Las vetas del cabo, y el anillo de hierro donde se encaja la hoja.
  const anillo = [-4, 26].map((v) => corte([enLaHoja([-ancho - 0.6, v]), enLaHoja([ancho + 0.6, v])], 1.6, 1826 + v, () => 1)).join('');
  return (
    canto(poli(cabo), 4) + canto(curva(HOJA), 4.4) +
    plancha('ve-cabo', poli(cabo), { negro: T.negro, papel: T.papel, caja: cajaDe(cabo), tallas: tallar(siguiendo([HP, HC], { n: 2, separacion: 2, semilla: 1821 }), luzCabo, { ancho: 1.3, semilla: 1822 }), motas: false }) +
    plancha('ve-hoja', curva(HOJA), { negro: T.negro, papel: T.papel, caja: cajaDe(HOJA), tallas: tallar(lineasHoja, luzHoja, { ancho: 2.3, umbral: [0.12, 0.85], semilla: 1824 }), trazos: anillo })
  );
}

/** El filo del hacha: la raya de luz que corre por el borde de la hoja cuando brinda. */
function filo(): string {
  const [x, y] = enLaHoja([30, 10]);
  return (
    nube(x - 2, y, 9, 24, T.papel, 'm', 0.45, LADEO) +
    `<path d="${corte(FILO, 2.6, 1825, (t) => Math.sin(Math.PI * t) ** 0.7)}" fill="${T.papel}"/>` +
    nube(...enLaHoja([31, 4]), 2.6, 2.6, T.papel, 'xs')
  );
}

/* ------------------------------------------------------------------
   El cuerpo: la levita, la capa corta de la capucha, la servilleta y el moño
   ------------------------------------------------------------------ */

const LEVITA: readonly P[] = [[-44, 0], [-45, -50], [-47, -92], [-42, -108], [-28, -116], [-12, -122], [12, -122], [28, -116], [42, -108], [47, -92], [45, -50], [44, 0]];
const CAPA: readonly P[] = [[-21, -136], [-34, -128], [-50, -110], [-46, -102], [-30, -100], [-14, -96], [0, -88], [14, -96], [30, -100], [46, -102], [50, -110], [34, -128], [21, -136]];
const SERVILLETA: readonly P[] = [[-16, -97], [16, -97], [12, -80], [4, -58], [0, -50], [-4, -58], [-12, -80]];

function cuerpo(): string {
  const luzLevita = apretada(tono(0.03, [bola([10, -70], [50, 82], LUZ, 1.15), { c: [-40, -40], r: [12, 50], peso: -0.5, blando: 0.8 }]));
  const pliegues = [
    ...siguiendo([[-30, -104], [-34, -70], [-36, -36], [-38, 0]], { n: 6, separacion: 2.6, abre: 1.3, semilla: 1831 }),
    ...siguiendo([[30, -104], [34, -70], [36, -36], [38, 0]], { n: 9, separacion: 2.6, abre: 1.3, semilla: 1832 }),
    ...siguiendo([[0, -100], [2, -60], [0, -30], [0, 0]], { n: 6, separacion: 2.6, abre: 1.2, semilla: 1833 }),
  ];
  // Las solapas: dos cortes que bajan del cuello abriéndose, y los botones de la levita.
  const solapas = corte(cubica([[-11, -98], [-16, -80], [-20, -60], [-22, -40]]), 1.6, 1834) + corte(cubica([[11, -98], [16, -80], [20, -60], [22, -40]]), 1.8, 1835);
  const botones = [-34, -22, -10].map((y, i) => elipse(10 + i * 0.4, y, 2.2, 2.2)).join('');
  const levita = recorte('ve-levita', LEVITA, {
    tallas: tallar(pliegues, luzLevita, { ancho: 2.5, umbral: [0.15, 0.85], semilla: 1836 }) + picado(cajaDe(LEVITA, 0), luzLevita, { rango: [0.2, 0.5], densidad: 7, angulo: 80, semilla: 1837 }),
    blancos: solapas + botones,
  });
  // La capa corta de la capucha, que cae sobre los hombros: los cortes dan la vuelta, como un cuello.
  const luzCapa = apretada(tono(0.02, [bola([8, -116], [46, 20], LUZ, 1.2)]));
  const capa = recorte('ve-capa', CAPA, { tallas: tallar(envolventes([0, -114], [48, 20], { paso: 2.4, comba: 0.45, desde: -0.6, hasta: 1, semilla: 1841 }), luzCapa, { ancho: 2.2, umbral: [0.15, 0.85], semilla: 1842 }) });
  // La servilleta atada al cuello, blanca de papel, con los dobleces tallados en negro y una gota de vino.
  const servilleta =
    canto(curva(SERVILLETA), 4) +
    forma(curva(SERVILLETA), T.papel) +
    `<path d="${corte(cubica([[-8, -94], [-6, -84], [-3, -72], [-1, -60]]), 1.2, 1843)}${corte(cubica([[7, -94], [6, -84], [4, -74], [2, -64]]), 1, 1844)}${corte(cubica([[-14, -95], [-4, -92], [4, -92], [14, -95]]), 1.1, 1845)}" fill="${T.negro}"/>` +
    forma(elipse(5, -74, 2.6, 3.4), T.rojo) + forma(elipse(6.2, -68.4, 1, 1.4), T.rojo);
  // El moño, rojo de bandera, asomando en la punta de la capa.
  const mono =
    forma(poli([[0, -89], [-10, -94], [-11, -84]]), T.rojo) + forma(poli([[0, -89], [10, -94], [11, -84]]), T.rojo) +
    forma(elipse(0, -89, 3, 2.6), T.rojo) + `<path d="${corte([[-8, -92], [-3, -89.4]], 0.7, 1846, () => 1)}${corte([[8, -92], [3, -89.4]], 0.7, 1847, () => 1)}" fill="${T.negro}"/>`;
  return `<g filter="url(#grano)">${levita}${servilleta}${capa}${mono}</g>`;
}

/* ------------------------------------------------------------------
   La cabeza: la capucha de punta, la pera de abajo y el faldón
   ------------------------------------------------------------------ */

/** La capucha: alta, con la punta que se le dobla para atrás, y ancha abajo donde se apoya en la capa. */
const CAPUCHA: readonly P[] = [[16, -232], [10, -214], [16, -198], [24, -182], [28, -164], [29, -146], [27, -132], [22, -124], [0, -122], [-22, -124], [-27, -132], [-29, -146], [-28, -164], [-23, -184], [-12, -204], [2, -222]];

function capucha(): string {
  const luz = apretada(tono(0.02, [
    bola([4, -168], [28, 46], LUZ, 1.25),
    // La punta doblada agarra la luz del seguidor de lleno.
    { c: [12, -218], r: [6, 12], peso: 0.7, giro: 20, blando: 0.7 },
    // Abajo de los agujeros, la tela se hunde.
    { c: [0, -158], r: [24, 5], peso: -0.35, blando: 0.8 },
  ]));
  const lineas = [
    ...envolventes([2, -170], [28, 44], { paso: 2.3, comba: 0.3, desde: -0.85, hasta: 1, semilla: 1851 }),
    ...siguiendo([[2, -222], [10, -214], [16, -200], [22, -186]], { n: 3, separacion: 1.8, semilla: 1852 }),
  ];
  // Los agujeros: el borde de arriba prendido por la luz (la tela tiene espesor), y lo de adentro negro.
  const agujeros = A.ojos.map(({ centro: [cx, cy], radio: [rx, ry] }, i) =>
    corte(cubica([[cx - rx - 1, cy + 0.4], [cx - rx * 0.4, cy - ry - 1.6], [cx + rx * 0.4, cy - ry - 1.6], [cx + rx + 1, cy + 0.4]]), 1.5 + i * 0.4, 1853 + i)).join('');
  const costura = corte(cubica([[3, -218], [6, -196], [4, -176], [1, -156]]), 0.8, 1857);
  return recorte('ve-capucha', CAPUCHA, {
    tallas: tallar(lineas, luz, { ancho: 2.4, umbral: [0.14, 0.86], semilla: 1858 }) + picado(cajaDe(CAPUCHA, 0), luz, { rango: [0.2, 0.55], densidad: 9, angulo: 60, semilla: 1859 }),
    blancos: agujeros,
    trazos: costura + A.ojos.map(({ centro: [cx, cy], radio: [rx, ry] }) => elipse(cx, cy, rx, ry)).join(''),
  });
}

/** Debajo del faldón: una pera blanca, bien afeitada, y la sonrisa del *"ji ji ji"*. */
const PERA: readonly P[] = [[-17, -152], [17, -152], [18, -140], [13, -128], [0, -123], [-13, -128], [-18, -140]];

function pera(): string {
  const luz = apretada(tono(0.15, [bola([4, -142], [18, 15], LUZ, 1.2), { c: [0, -136], r: [9, 2.2], peso: -0.9, blando: 0.5 }]));
  const lineas = envolventes([2, -140], [18, 14], { paso: 2, comba: 0.35, desde: -1, hasta: 1, semilla: 1861 });
  // La sonrisa: una medialuna negra con los dientes de arriba cortados en blanco.
  const sonrisa = `M-10 -137.6 Q0 -134.6 10 -137.6 Q7 -130.6 0 -130 Q-7 -130.6 -10 -137.6 Z`;
  const dientes = [-6, -2, 2, 6].map((x) => `M${f(x - 1.6)} -136.4 L${f(x + 1.6)} -136.4 L${f(x + 1.1)} -133.8 L${f(x - 1.1)} -133.8 Z`).join('');
  return recorte('ve-pera', PERA, {
    tallas: tallar(lineas, luz, { ancho: 2.2, umbral: [0.1, 0.8], semilla: 1862 }),
    trazos: sonrisa,
    brillos: dientes,
  }, false);
}

/** El faldón de la capucha: la tela que tapa la pera y se recoge para comer. */
const BABERO: readonly P[] = [[-A.babero.ancho, A.babero.arriba], [A.babero.ancho, A.babero.arriba], [A.babero.ancho + 1, -137], [21, -124], [10, A.babero.abajo + 0.5], [0, A.babero.abajo], [-10, A.babero.abajo + 0.5], [-21, -124], [-A.babero.ancho - 1, -137]];

function babero(): string {
  const luz = apretada(tono(0.02, [bola([6, -138], [26, 18], LUZ, 1.1)]));
  const lineas = envolventes([0, -142], [26, 18], { paso: 2.2, comba: 0.5, desde: -0.8, hasta: 1, semilla: 1871 });
  return recorte('ve-babero', BABERO, { tallas: tallar(lineas, luz, { ancho: 2.1, umbral: [0.15, 0.85], semilla: 1872 }) });
}

/* ------------------------------------------------------------------
   Los brazos y las manos: las mangas de la levita, los puños, los guantes
   ------------------------------------------------------------------ */

/** La manga, del hombro al codo, dibujada derecha para abajo. */
function contornoBrazo(n: 0 | 1): P[] {
  const [sx, sy] = A.hombros[n];
  const L = A.largos.brazo;
  return [[sx - 10, sy - 7], [sx + 10, sy - 7], [sx + 8.5, sy + L * 0.5], [sx + 7.5, sy + L + 3], [sx, sy + L + 7.5], [sx - 7.5, sy + L + 3], [sx - 8.5, sy + L * 0.5]];
}
/** El antebrazo, del codo a la muñeca, derecho para arriba; arriba asoma el puño blanco de la camisa. */
function contornoAntebrazo(n: 0 | 1): P[] {
  const [ex, ey] = codoDibujado(n);
  const L = A.largos.antebrazo;
  return [[ex - 7.5, ey + 5], [ex - 8, ey - L * 0.5], [ex - 7, ey - L + 4], [ex + 7, ey - L + 4], [ex + 8, ey - L * 0.5], [ex + 7.5, ey + 5], [ex, ey + 7.5]];
}
const cajaBrazo = (n: 0 | 1) => cajaDe(contornoBrazo(n), 6);
const cajaAntebrazo = (n: 0 | 1) => cajaDe(contornoAntebrazo(n), 6);

function brazo(n: 0 | 1): string {
  const [sx, sy] = A.hombros[n];
  const prendido = n === 1 ? 1.15 : 0.7;
  const luz = apretada(tono(0.03, [bola([sx + 2, sy + 22], [9, 36], LUZ, prendido)]));
  const lineas = envolventes([sx, sy + 24], [9, 32], { paso: 2.4, comba: 0.35, desde: -1, hasta: 1, semilla: 1881 + n });
  return `<g filter="url(#grano)">${recorte(`ve-brazo-${n}`, contornoBrazo(n), { tallas: tallar(lineas, luz, { ancho: 2.2, semilla: 1883 + n }) })}</g>`;
}

function antebrazo(n: 0 | 1): string {
  const [ex, ey] = codoDibujado(n);
  const [wx, wy] = munecaDibujada(n);
  const prendido = n === 1 ? 1.15 : 0.75;
  const luz = apretada(tono(0.03, [bola([ex + 2, ey - 20], [8, 28], LUZ, prendido)]));
  const lineas = envolventes([ex, ey - 20], [8, 26], { paso: 2.4, comba: 0.35, desde: -1, hasta: 0.9, semilla: 1885 + n });
  // El puño de la camisa: una banda blanca, con el gemelo rojo.
  const puno: P[] = [[wx - 7.5, wy + 3], [wx + 7.5, wy + 3], [wx + 7, wy + 8.5], [wx - 7, wy + 8.5]];
  return (
    `<g filter="url(#grano)">` +
    recorte(`ve-antebrazo-${n}`, contornoAntebrazo(n), { tallas: tallar(lineas, luz, { ancho: 2.2, semilla: 1887 + n }) }) +
    forma(poli(puno), T.papel) + `<path d="${corte([[wx - 8, wy + 8.6], [wx + 8, wy + 8.6]], 1, 1889 + n, () => 1)}" fill="${T.negro}"/>` +
    forma(elipse(wx + (n ? -3 : 3), wy + 6, 1.5, 1.5), T.rojo) +
    `</g>`
  );
}

/** Un guante blanco cerrado en un puño, con el meñique parado si es la mano de la copa. */
function guante(n: 0 | 1): string {
  const [wx, wy] = munecaDibujada(n);
  const y = wy - A.puno;
  const puno: P[] = [[wx - 8, y + 6], [wx - 9, y - 2], [wx - 6, y - 8], [wx + 6, y - 8], [wx + 9, y - 2], [wx + 8, y + 6]];
  const s = n === 0 ? -1 : 1;
  // Los nudillos, en negro; y en la copa, el meñique que se para para afuera.
  const nudillos = [-4, 0, 4].map((dx) => corte([[wx + dx, y - 7.6], [wx + dx + 0.4, y - 2]], 0.9, 1890 + dx, () => 1)).join('');
  const menique = n === 0 ? curva([[wx + s * 7, y + 2], [wx + s * 13, y - 3], [wx + s * 16, y - 9], [wx + s * 14, y - 10], [wx + s * 10, y - 5], [wx + s * 6.5, y - 1]]) : '';
  const luz = apretada(tono(0.5, [{ c: [wx - 6, y + 2], r: [5, 6], peso: -0.5, blando: 0.8 }]));
  return (
    canto(curva(puno), 3.4) + (menique ? canto(menique, 3) : '') +
    forma(curva(puno), T.papel) + (menique ? forma(menique, T.papel) : '') +
    `<path d="${nudillos}${tallar(envolventes([wx, y - 1], [9, 7], { paso: 2.2, semilla: 1894 + n }), (x2, y2) => 1 - luz(x2, y2), { ancho: 0.8, semilla: 1896 + n })}" fill="${T.negro}" opacity="0.8"/>`
  );
}

/** La copa, parada arriba del puño: el pie, el tallo y el cáliz, de vidrio tallado, con el vino adentro. */
function copa(): string {
  const [wx, wy] = munecaDibujada(0);
  const base = wy - A.puno - 6;
  const { tallo, caliz, radio } = A.copa;
  const boca = base - tallo - caliz;
  const caz = `M${f(wx - radio)} ${f(boca)} C${f(wx - radio)} ${f(boca + caliz * 0.75)} ${f(wx - 3)} ${f(base - tallo)} ${f(wx)} ${f(base - tallo)} C${f(wx + 3)} ${f(base - tallo)} ${f(wx + radio)} ${f(boca + caliz * 0.75)} ${f(wx + radio)} ${f(boca)} Z`;
  return (
    canto(caz, 2.4) +
    forma(caz, T.negro, 0.55) +
    `<path d="${corte(cubica([[wx + radio - 0.6, boca + 1], [wx + radio - 1, boca + caliz * 0.7], [wx + 4, base - tallo - 1], [wx + 1, base - tallo]]), 1, 1903)}" fill="${T.papel}"/>` +
    `<path d="${corte([[wx, base + 4], [wx, base - tallo]], 2.2, 1901, () => 1)}" fill="${T.papel}"/>` +
    forma(elipse(wx, base + 4, 6.5, 1.8), T.papel) +
    `<path d="${corte(cubica([[wx - radio + 2, boca + 2], [wx - radio + 2, boca + 9], [wx - 5, boca + 13], [wx - 2, boca + 14]]), 1.4, 1902)}" fill="${T.papel}"/>` +
    forma(elipse(wx, boca, radio, 2.2), T.papel, 0.9)
  );
}

/** El vino de la copa: rojo de bandera, desde la boca de la copa para abajo. La isla le baja el nivel. */
function vino(): string {
  const [wx, wy] = munecaDibujada(0);
  const base = wy - A.puno - 6;
  const { tallo, caliz, radio } = A.copa;
  const boca = base - tallo - caliz;
  const y0 = boca + 3;
  const d = `M${f(wx - radio + 1)} ${f(y0)} L${f(wx + radio - 1)} ${f(y0)} C${f(wx + radio - 1.5)} ${f(boca + caliz * 0.72)} ${f(wx + 2.5)} ${f(base - tallo - 1.5)} ${f(wx)} ${f(base - tallo - 1.5)} C${f(wx - 2.5)} ${f(base - tallo - 1.5)} ${f(wx - radio + 1.5)} ${f(boca + caliz * 0.72)} ${f(wx - radio + 1)} ${f(y0)} Z`;
  return forma(d, T.rojo) + forma(elipse(wx, y0, radio - 1, 1.6), T.brasa);
}

/** El tenedor, arriba del puño: el cabo y los cuatro dientes, de plata en el blanco del papel. */
function tenedor(): string {
  const [wx, wy] = munecaDibujada(1);
  const base = wy - A.puno - 6;
  const punta = base - A.tenedor;
  const dientes = [-3, -1, 1, 3].map((dx) => corte([[wx + dx * 0.9, punta + 9], [wx + dx * 1.15, punta]], 0.9, 1910 + dx, () => 1)).join('');
  return (
    `<path d="${corte([[wx, base + 4], [wx, punta + 9]], 2.2, 1915, (t) => 0.7 + 0.3 * t)}" fill="${T.canto}" transform="translate(0.6 0.6)"/>` +
    `<path d="${corte([[wx, base + 4], [wx, punta + 9]], 1.8, 1916, (t) => 0.7 + 0.3 * t)}${corte([[wx - 3.6, punta + 9], [wx + 3.6, punta + 9]], 1.6, 1917, () => 1)}${dientes}" fill="${T.papel}"/>`
  );
}

/** La guinda que pincha: chica y roja, con su cabito. Una en el plato y la misma en el tenedor. */
const guinda = (x: number, y: number): string =>
  forma(elipse(x, y, 3.8, 3.6), T.canto) + forma(elipse(x, y, 3, 2.9), T.rojo) + forma(elipse(x - 1, y - 1, 0.9, 0.8), T.papel, 0.9) +
  `<path d="${corte(cubica([[x, y - 2.6], [x + 0.5, y - 5], [x + 2, y - 6.5], [x + 3.4, y - 7.2]]), 0.7, 1921, () => 1)}" fill="${T.negro}"/>`;

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 4;

function cajaMano(n: 0 | 1): readonly [number, number, number, number] {
  const [wx, wy] = munecaDibujada(n);
  const arriba = wy - A.puno - 6 - (n === 0 ? A.copa.tallo + A.copa.caliz : A.tenedor) - 6;
  return [wx - 20, arriba, 40, wy + 8 - arriba];
}
const cajaHacha = (): readonly [number, number, number, number] => [58, -196, 56, 200];

export const PIEZAS_VERDUGO: readonly Pieza[] = [
  { nombre: 'verdugo-silla', caja: cajaDe(RESPALDO, 8), dibujo: `<g filter="url(#grano)">${silla()}</g>`, densidad: 2.2 },
  { nombre: 'verdugo-hacha', caja: cajaHacha(), dibujo: `<g filter="url(#grano)">${hacha()}</g>`, densidad: 2.6 },
  { nombre: 'verdugo-filo', caja: cajaHacha(), dibujo: filo(), densidad: 2.2 },
  { nombre: 'verdugo-cuerpo', caja: [-56, -142, 112, 146], dibujo: cuerpo(), densidad: D },
  { nombre: 'verdugo-capucha', caja: cajaDe(CAPUCHA, 6), dibujo: `<g filter="url(#grano)">${capucha()}</g>`, densidad: D },
  { nombre: 'verdugo-pera', caja: cajaDe(PERA, 2), dibujo: `<g filter="url(#grano)">${pera()}</g>`, densidad: D * 1.3 },
  { nombre: 'verdugo-babero', caja: cajaDe(BABERO, 6), dibujo: `<g filter="url(#grano)">${babero()}</g>`, densidad: D },
  { nombre: 'verdugo-brazo-1', caja: cajaBrazo(0), dibujo: brazo(0), densidad: D },
  { nombre: 'verdugo-antebrazo-1', caja: cajaAntebrazo(0), dibujo: antebrazo(0), densidad: D },
  { nombre: 'verdugo-mano-1', caja: cajaMano(0), dibujo: `<g filter="url(#grano)">${copa()}${guante(0)}</g>`, densidad: D * 1.2 },
  { nombre: 'verdugo-vino', caja: cajaMano(0), dibujo: vino(), densidad: D },
  { nombre: 'verdugo-brazo-2', caja: cajaBrazo(1), dibujo: brazo(1), densidad: D },
  { nombre: 'verdugo-antebrazo-2', caja: cajaAntebrazo(1), dibujo: antebrazo(1), densidad: D },
  { nombre: 'verdugo-mano-2', caja: cajaMano(1), dibujo: `<g filter="url(#grano)">${tenedor()}${guante(1)}</g>`, densidad: D * 1.2 },
  { nombre: 'verdugo-guinda', caja: [-6, -10, 12, 14], dibujo: `<g filter="url(#grano)">${guinda(0, 0)}</g>`, densidad: 6 },
];

const img = imagenesDe(PIEZAS_VERDUGO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Los dos puntos al rojo en los agujeros de la capucha, y la risa, que los achina: son tinta de la página. */
function ojos(t: Readonly<Record<string, string>>, o: Readonly<Record<string, string>>): string {
  const puntos = A.ojos
    .map(({ centro: [cx, cy] }, i) =>
      parte(`ojo-${i + 1}`, `<circle cx="${cx}" cy="${cy}" r="3.4" class="bt-verdugo-brasa"/><circle cx="${cx}" cy="${cy}" r="1.7" class="bt-verdugo-ojo"/>`, t[`ojo-${i + 1}`]))
    .join('');
  const achinados = A.ojos.map(({ centro: [cx, cy] }) => `<path d="M${cx - 4} ${cy + 0.6} Q${cx} ${cy - 3.6} ${cx + 4} ${cy + 0.6}" class="bt-verdugo-risa"/>`).join('');
  return `<g class="verdugo-ojos">${puntos}</g>` + parte('risa', achinados, '', o.risa);
}

/** El verdugo armado con las marcas de un gesto (`marcas`, `rig-verdugo.ts`). */
function armado(g: Gesto): string {
  const { transform: t, opacity: o } = marcas(g);
  const [bx, by] = A.plato;
  const brazoCon = (n: 0 | 1): string =>
    parte(`brazo-${n + 1}`,
      img(`verdugo-brazo-${n + 1}`) +
      parte(`antebrazo-${n + 1}`,
        img(`verdugo-antebrazo-${n + 1}`) +
        parte(`mano-${n + 1}`,
          n === 0
            ? img('verdugo-mano-1') + parte('vino', img('verdugo-vino'), t.vino)
            : img('verdugo-mano-2') + parte('bocado-tenedor', `<g transform="translate(${munecaDibujada(1)[0]} ${munecaDibujada(1)[1] - A.puno - 6 - A.tenedor + 3})">${img('verdugo-guinda')}</g>`, '', o['bocado-tenedor']),
          t[`mano-${n + 1}`]),
        t[`antebrazo-${n + 1}`]),
      t[`brazo-${n + 1}`]);
  return (
    img('verdugo-silla') +
    img('verdugo-hacha') +
    parte('filo', img('verdugo-filo'), '', o.filo) +
    parte('torso', img('verdugo-cuerpo'), t.torso) +
    parte('cabeza', img('verdugo-capucha') + ojos(t, o) + img('verdugo-pera') + parte('babero', img('verdugo-babero'), t.babero), t.cabeza) +
    parte('bocado-plato', `<g transform="translate(${bx} ${by})">${img('verdugo-guinda')}</g>`, '', o['bocado-plato']) +
    brazoCon(1) +
    brazoCon(0)
  );
}

/** El verdugo en un gesto, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function verdugoEn(g: Gesto = GESTOS.quieto): string {
  return `<g transform="${marcas(g).transform.entero}">${armado(g)}</g>`;
}

/** El títere que se toca, en la pose quieta: la copa a la altura del pecho, mirándote por los agujeros. */
function titere(nombres: ReadonlyMap<string, string>): string {
  const g = GESTOS.quieto;
  return (
    `<g class="titere titere--verdugo" data-id="el-verdugo-que-cena" role="button" tabindex="0" aria-label="${nombres.get('el-verdugo-que-cena') ?? 'El verdugo que cena distinguido'}">` +
    `<g data-parte="entero" transform="${marcas(g).transform.entero}">${armado(g)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: brindando por tu suerte en su punta de la mesa, con el filo del hacha prendido. */
export const RETRATO = { caja: [736, 204, 132, 148] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('mesa-lejos') + fondo('mesa-piso') + verdugoEn(GESTOS.brinda);
}

export const VERDUGO_CENA: Personaje = {
  id: 'el-verdugo-que-cena',
  region: 'la-mesa',
  ancla: VERDUGO.x,
  piezas: PIEZAS_VERDUGO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
