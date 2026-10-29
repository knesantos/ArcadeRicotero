/**
 * Las antiguas lobas (`D-73`, vigesimotercera vuelta), echadas al pie de las tiras de la izquierda del monte.
 *
 * *"Y antiguas lobas pulpas que reviven"* es de *Barbazul versus el amor letal*, en *Gulp!* (1985). Son dos
 * perras de monte viejas, flacas, con las costillas marcadas, el pelo ralo y canoso, el hocico blanco de los
 * años, echadas cabeza con cola como si estuvieran muertas. Pulpas: lo que les queda es carne blanda, encías
 * sin dientes, calvas rosadas donde se les cayó el pelo. Y reviven.
 *
 * De la letra son también los detalles: la 1 se pintó la boca (*"puede la Virgen labial brillar"*, y *"de
 * viejas feas como monos"*), y lleva un collar con la cadena rota, de alguna prisión (*"Barbazul de esta
 * prisión"*); el aullido es un vaho que sube y no suena (*"tu aullido esta vez, quiera Dios, no se va a
 * oír"*); y adelante, en el piso, una manzana firme que ya no pueden morder (*"manzanas firmes"*). Del
 * dibujo son la oreja mordida de la 1 y el ojo con catarata de la 2, que es tuerta, y el pelo de loba joven
 * que les vuelve mientras trotan.
 *
 * Visten *Gulp!*, medida con sharp: el pelo viejo es el gris y el blanco de la fotocopia de la tapa, lo
 * hondo es la tinta, la pulpa y la boca pintada son el sello rojo de la contratapa y su borde sobre el papel,
 * el ojo es la letra verde donde se quema de luz, y el pelo joven es la tinta con el verde metido adentro.
 *
 * Coordenadas: cada loba tiene el (0, 0) en el piso debajo de la panza, parada, y mira a la derecha
 * (`rig-lobas.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { AULLAN, LOBAS, LOBA_ARMADO as A, QUIETO, marcas, type Momento } from './rig-lobas.ts';

/** Las tintas de *Gulp!* (`tokens.css`). */
const C = {
  cana: 'var(--bestia-lobas-cana)',
  canaSucia: 'var(--bestia-lobas-cana-sucia)',
  gris: 'var(--bestia-lobas-gris)',
  grisHondo: 'var(--bestia-lobas-gris-hondo)',
  pardo: 'var(--bestia-lobas-pardo)',
  tinta: 'var(--bestia-lobas-tinta)',
  tintaHonda: 'var(--bestia-lobas-tinta-honda)',
  verdeHondo: 'var(--bestia-lobas-verde-hondo)',
  verde: 'var(--bestia-lobas-verde)',
  ojo: 'var(--bestia-lobas-ojo)',
  labial: 'var(--bestia-lobas-labial)',
  labialHondo: 'var(--bestia-lobas-labial-hondo)',
  pulpa: 'var(--bestia-lobas-pulpa)',
  papel: 'var(--bestia-lobas-papel)',
};

/** Un azar con semilla, para que los pelos salgan siempre iguales. */
function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a * 16807) % 2147483647;
    return (a - 1) / 2147483646;
  };
}

/** Los pelos ralos del borde: rayitas sueltas que salen de la silueta para afuera, pocas y torcidas. */
function pelos(pts: readonly P[], centro: P, largo: number, colores: readonly string[], semilla: number, cada = 1): string {
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < pts.length; i += cada) {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[(i + 1) % pts.length]!;
    for (let k = 0; k < 2; k++) {
      const t = rnd();
      const [x, y] = [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
      const a = Math.atan2(y - centro[1], x - centro[0]) + (rnd() - 0.5) * 0.9;
      const l = largo * (0.4 + rnd() * 0.9);
      const c = colores[Math.floor(rnd() * colores.length)]!;
      s += trazo(`M${x.toFixed(1)} ${y.toFixed(1)} q${(Math.cos(a + 0.4) * l * 0.5).toFixed(1)} ${(Math.sin(a + 0.4) * l * 0.5).toFixed(1)} ${(Math.cos(a) * l).toFixed(1)} ${(Math.sin(a) * l).toFixed(1)}`, c, 0.8 + rnd() * 0.5, 0.75);
    }
  }
  return s;
}

/* ------------------------------------------------------------------
   El cuerpo viejo, flaco, con las costillas; y el de loba joven que le vuelve
   ------------------------------------------------------------------ */

const TORSO: readonly P[] = [[56, -100], [40, -105], [22, -98], [2, -91], [-18, -94], [-36, -103], [-45, -106], [-55, -100], [-63, -92], [-68, -78], [-67, -62], [-58, -57], [-46, -60], [-26, -66], [-4, -63], [18, -58], [36, -50], [54, -56], [64, -74], [64, -92]];
const JOVEN: readonly P[] = [[58, -103], [40, -109], [20, -105], [0, -103], [-20, -105], [-40, -108], [-60, -103], [-75, -88], [-79, -68], [-67, -53], [-46, -53], [-24, -55], [-2, -53], [18, -51], [38, -45], [57, -53], [67, -74], [67, -95]];

/** Las costillas: una raya honda y la luz al lado, que es lo que se ve de una loba flaca. */
const costillas = (desde: number, cuantas: number, o: number): string =>
  Array.from({ length: cuantas }, (_, i) => {
    const x = desde + i * 8.5;
    const y0 = -90 + (i % 2) * 2;
    return trazo(`M${x} ${y0} Q${x + 7} -78 ${x + 1} ${-64 - i}`, C.tinta, 2, 0.4 * o) + trazo(`M${x + 3.4} ${y0 + 1} Q${x + 10} -78 ${x + 4} ${-65 - i}`, C.canaSucia, 1, 0.35 * o);
  }).join('');

/** El espinazo: los nudos del lomo, que se le marcan. */
const espinazo = (o: number): string =>
  [[30, -103], [18, -99], [6, -95], [-6, -95], [-18, -97], [-30, -101]].map(([x, y]) => nube(x!, y! + 1, 3.4, 2.2, C.cana, 's', 0.7 * o) + nube(x! + 3, y! + 3, 2.6, 2, C.tinta, 's', 0.5 * o)).join('');

function torso(n: 1 | 2): string {
  const d = curva(TORSO);
  const adentro =
    forma(d, C.gris) +
    // El lomo canoso, el pecho blanco de vieja, la panza honda y el anca gastada.
    nube(-4, -97, 60, 6, C.canaSucia, 'm', 0.8) + nube(54, -72, 11, 20, C.cana, 'm', 0.7) +
    nube(-8, -56, 72, 14, C.tinta, 'l', 0.8) + nube(-64, -68, 14, 18, C.tinta, 'm', 0.6) + nube(-58, -84, 14, 14, C.grisHondo, 'm', 0.8) + nube(24, -76, 18, 18, C.pardo, 'm', 0.5) + nube(-6, -80, 30, 10, C.grisHondo, 'm', 0.5) +
    costillas(n === 1 ? -12 : -20, n === 1 ? 5 : 7, n === 1 ? 0.85 : 1) + espinazo(n === 1 ? 0.8 : 1) +
    // El hueso de la cadera, que asoma.
    nube(-40, -101, 8, 5, C.cana, 's', 0.9) + nube(-38, -94, 9, 4, C.tinta, 's', 0.5) +
    (n === 2
      // La 2 está más pelada: dos calvas rosadas, con el borde gris donde se cayó el pelo.
      ? nube(-48, -80, 8, 6, C.grisHondo, 's', 0.8) + forma(curva([[-53, -82], [-47, -85], [-43, -80], [-46, -76], [-52, -77]]), C.pulpa, 0.8) + nube(-49, -81, 2.4, 1.4, C.cana, 'xs', 0.6) +
        nube(34, -64, 6, 4, C.grisHondo, 's', 0.8) + forma(curva([[31, -66], [36, -67], [38, -63], [33, -62]]), C.pulpa, 0.75)
      : nube(-30, -70, 10, 6, C.grisHondo, 's', 0.6));
  const borde = pelos(TORSO.slice(0, 10), [-6, -76], 4.6, [C.canaSucia, C.gris, C.grisHondo], n * 101) + pelos(TORSO.slice(10, 16), [-6, -76], 6, [C.gris, C.grisHondo], n * 211);
  // La 1 lleva el collar viejo de alguna prisión, con la cadena rota colgando.
  const collar = n === 1
    ? forma(poli([[34, -105], [44, -107], [56, -61], [46, -57]]), C.tinta) + trazo('M38 -103 L50 -60', C.grisHondo, 1.2, 0.8) +
      forma(cajaRedonda(44, -72, 9, 8, 1.4), C.pardo) + forma(cajaRedonda(46.5, -70, 4, 4, 0.8), C.tintaHonda) +
      trazo('M51 -58 a3 4.4 0 1 0 0.1 0', C.canaSucia, 1.6) + trazo('M52 -51 a3 4.4 0 1 0 0.1 0', C.canaSucia, 1.6) +
      // El último eslabón, abierto: por ahí se rompió.
      trazo('M51 -44 a3 4.4 0 1 1 3.2 3', C.canaSucia, 1.6)
    : '';
  return conGrano(enmascarado(`m-lobas-torso-${n}`, d, adentro) + borde + collar);
}

/** El pelo de loba joven: la tinta de la tapa con el verde metido adentro, lleno, sin costillas. */
function joven(): string {
  const d = curva(JOVEN);
  return conGrano(enmascarado('m-lobas-joven', d,
    // Como una loba joven de verdad: los costados del gris de las patas, la montura de tinta en el lomo y el pecho claro.
    forma(d, C.gris) + nube(-8, -100, 64, 10, C.tinta, 'm', 0.95) + nube(-4, -103, 54, 3, C.verdeHondo, 'm', 0.9) + nube(52, -72, 10, 18, C.canaSucia, 'm', 0.8) +
    nube(-8, -55, 66, 8, C.grisHondo, 'm', 0.8) + nube(-62, -84, 12, 14, C.tinta, 'm', 0.6) + nube(10, -80, 26, 8, C.pardo, 'm', 0.45) +
    // El brillo del pelo nuevo, como la letra verde sobre lo negro.
    trazo('M-56 -101 Q-20 -106 20 -103 T58 -100', C.verde, 1.4, 0.55) + trazo('M-40 -96 Q-4 -100 30 -97', C.verde, 0.9, 0.35)) +
    pelos(JOVEN.slice(0, 9), [-6, -76], 6, [C.tinta, C.verdeHondo], 77, 1));
}

/* ------------------------------------------------------------------
   Las patas (las de cerca y las de lejos) y la cola
   ------------------------------------------------------------------ */

const correr = (pts: readonly P[], dx: number, dy: number): P[] => pts.map(([x, y]) => [x + dx, y + dy] as P);

const DELANTERA: readonly P[] = [[25, -76], [47, -74], [46, -48], [43, -32], [45, -12], [48, -3], [34, -3], [36, -13], [33, -32], [29, -48]];
const TRASERA: readonly P[] = [[-62, -82], [-30, -80], [-30, -58], [-40, -42], [-47, -28], [-45, -13], [-41, -3], [-56, -3], [-58, -14], [-62, -30], [-67, -52]];

function pata(pts: readonly P[], pie: P, nudo: P, lejos: boolean, id: string): string {
  const d = curva(pts);
  const [px, py] = pie;
  const base = lejos ? C.grisHondo : C.gris;
  const adentro =
    forma(d, base) + nube(pts[1]![0] - 4, pts[1]![1] + 14, 8, 16, lejos ? C.tinta : C.canaSucia, 'm', 0.6) +
    nube(pts[0]![0] + 4, pts[0]![1] + 20, 6, 22, C.tinta, 'm', lejos ? 0.7 : 0.45) +
    // El nudo de la articulación, gordo de vieja.
    nube(nudo[0], nudo[1], 6, 5, lejos ? C.gris : C.cana, 's', 0.75) + nube(nudo[0] + 1, nudo[1] + 4, 6, 3, C.tinta, 's', 0.6);
  const mano = forma(elipse(px, py, 8.5, 4.2), lejos ? C.gris : C.canaSucia) + nube(px, py + 1.5, 8, 2, C.tinta, 'xs', 0.6) +
    [-4, 0, 4].map((dx) => trazo(`M${px + dx} ${py - 3} l0.6 3.6`, C.tinta, 0.9, 0.8)).join('') +
    // Las uñas largas, de no gastarlas.
    [-2, 2, 6].map((dx) => trazo(`M${px + dx + 2} ${py + 2} l3 1`, C.pardo, 1, 0.9)).join('');
  return conGrano(enmascarado(id, d, adentro) + pelos(pts.slice(0, 4), [pts[0]![0], pts[0]![1] + 30], 4, [lejos ? C.grisHondo : C.canaSucia], id.length * 31, 1) + mano);
}

const COLA: readonly P[] = [[-70, -92], [-60, -82], [-68, -60], [-78, -42], [-88, -27], [-95, -22], [-94, -32], [-88, -48], [-82, -66], [-80, -84]];

/** La cola peluda de loba, ya rala: gorda en la base y pelada en la punta, con cuatro pelos. */
function cola(): string {
  const d = curva(COLA);
  return conGrano(enmascarado('m-lobas-cola', d,
    forma(d, C.gris) + nube(-66, -76, 8, 16, C.canaSucia, 'm', 0.8) + nube(-84, -46, 6, 14, C.grisHondo, 'm', 0.8) + nube(-92, -26, 4, 6, C.pulpa, 's', 0.6)) +
    pelos(COLA, [-78, -58], 7, [C.canaSucia, C.gris, C.cana], 919));
}

/* ------------------------------------------------------------------
   Las cabezas: el hocico blanco, la boca pintada de la 1 y el ojo con catarata de la 2
   ------------------------------------------------------------------ */

const CRANEO: readonly P[] = [[54, -110], [66, -120], [82, -119], [95, -111], [108, -105], [121, -102], [126, -97], [122, -92], [104, -91], [88, -90], [76, -86], [62, -77], [49, -81], [47, -96]];
const QUIJADA: readonly P[] = [[79, -95], [96, -93], [118, -93], [121, -89], [106, -84], [90, -82], [77, -86]];

function cabeza(n: 1 | 2): string {
  const d = curva(CRANEO);
  const [ox, oy] = A.ojo;
  // La oreja de allá, quieta, detrás del cráneo.
  const orejaLejos = forma(poli([[78, -116], [84, -140], [92, -113]]), C.grisHondo) + forma(poli([[81, -118], [84, -134], [88, -116]]), C.tinta, 0.7);
  const ojo = n === 1
    ? forma(elipse(ox, oy, 4.6, 3.1), C.ojo) + nube(ox, oy, 7, 5, C.ojo, 's', 0.45) + forma(elipse(ox + 1, oy, 1, 2.6), C.tintaHonda) + forma(elipse(ox - 1.4, oy - 1, 0.9, 0.7), C.cana)
    // La tuerta: el ojo lechoso de la catarata, sin pupila, y la cicatriz que lo cruza.
    : forma(elipse(ox, oy, 4.6, 3.1), C.canaSucia) + nube(ox + 0.6, oy + 0.4, 3, 2, C.papel, 's', 0.9) + nube(ox, oy, 6.4, 4.4, C.papel, 's', 0.3) + forma(elipse(ox + 1, oy, 1.6, 1.6), C.gris, 0.5);
  const adentro =
    forma(d, C.gris) +
    // El hocico blanco de los años, las cejas canosas y el cachete hondo.
    nube(110, -98, 18, 6, C.cana, 'm', 0.9) + nube(98, -95, 12, 5, C.canaSucia, 'm', 0.8) + nube(86, -114, 8, 3.4, C.cana, 's', 0.85) +
    nube(66, -96, 14, 14, C.grisHondo, 'm', 0.8) + nube(70, -114, 12, 6, C.canaSucia, 'm', 0.6) + nube(56, -84, 10, 8, C.tinta, 'm', 0.6) +
    nube(ox, oy, 7, 6, C.tinta, 's', 0.8) + ojo +
    // Las arrugas de vieja arriba del ojo y en el hocico.
    trazo(`M${ox - 6} ${oy - 6} q6 -3 11 0`, C.tinta, 0.9, 0.7) + trazo(`M${ox - 4} ${oy - 9} q5 -2 9 0`, C.tinta, 0.7, 0.5) +
    trazo('M100 -101 q4 -1.4 8 0 M102 -98 q4 -1 7 0.4', C.grisHondo, 0.8, 0.7) +
    (n === 2 ? trazo(`M${ox - 4} ${oy - 9} L${ox + 5} ${oy + 7}`, C.pulpa, 1.4, 0.9) + trazo(`M${ox - 3} ${oy - 9} L${ox + 6} ${oy + 7}`, C.labialHondo, 0.5, 0.6) : '');
  const nariz = forma(elipse(123, -98.5, 4.6, 3.4), C.tinta) + forma(elipse(122, -100, 1.4, 0.9), C.canaSucia, 0.8) + trazo('M120.5 -97 l1.4 1', C.tintaHonda, 0.8);
  const labio = trazo('M86 -90.5 Q104 -91.8 121 -92.2', C.tinta, 1.3) +
    // La 1 se pintó la boca, corrida, pasándose del labio como una vieja que no se ve bien.
    (n === 1 ? trazo('M90 -91.4 Q106 -93 120 -93', C.labial, 3, 0.9) + trazo('M96 -93.6 q8 -1.2 14 -0.4', C.labialHondo, 1.2, 0.7) + nube(102, -94, 4, 1.4, C.labial, 'xs', 0.6) : '');
  const mechones = pelos(CRANEO.slice(10, 14), [80, -100], 7, [C.canaSucia, C.cana], n * 37) + pelos(CRANEO.slice(0, 4), [80, -100], 4, [C.canaSucia, C.gris], n * 53);
  return conGrano(orejaLejos + enmascarado(`m-lobas-cabeza-${n}`, d, adentro) + labio + nariz + mechones);
}

/** La quijada de abajo: la barbilla blanca, la encía rosada y el único diente que le queda. */
function quijada(n: 1 | 2): string {
  const d = curva(QUIJADA);
  return conGrano(
    forma(poli([[86, -93], [116, -93], [116, -90.6], [86, -90.6]]), C.pulpa) + forma(poli([[103, -93], [106, -93], [104.6, -97.4]]), C.canaSucia) +
    enmascarado(`m-lobas-quijada-${n}`, d, forma(d, C.gris) + nube(100, -84, 16, 4, C.cana, 'm', 0.85) + nube(84, -88, 6, 4, C.grisHondo, 's', 0.7)) +
    trazo('M90 -90.4 Q104 -90.8 118 -91', C.tinta, 1) +
    (n === 1 ? trazo('M92 -89.4 Q104 -88.6 116 -89.6', C.labial, 2.4, 0.85) : '') + pelos(QUIJADA.slice(3, 7), [100, -92], 4, [C.cana], n * 61));
}

/** Lo de adentro de la boca, detrás de la quijada: lo hondo, la encía de arriba y un colmillo gastado. */
function boca(): string {
  const d = poli([[82, -95], [122, -95], [120, -84], [92, -78], [80, -86]]);
  return conGrano(forma(d, C.tintaHonda) + nube(100, -88, 12, 4, C.labialHondo, 's', 0.7) +
    forma(poli([[86, -95], [121, -95], [120, -92.6], [86, -93]]), C.pulpa) + forma(poli([[114, -93], [117, -93], [115.4, -88.6]]), C.canaSucia) + nube(112, -94, 4, 1, C.labial, 'xs', 0.6));
}

/** La lengua, que cuelga de costado cuando se lame o cuando jadea. */
function lengua(): string {
  const d = curva([[98, -91], [106, -91], [109, -80], [106, -72], [101, -74], [99, -84]]);
  return conGrano(enmascarado('m-lobas-lengua', d, forma(d, C.labial) + nube(104, -80, 2.4, 6, C.pulpa, 's', 0.8) + nube(100, -88, 3, 3, C.labialHondo, 's', 0.8)) + trazo('M103.6 -88 l0.6 12', C.labialHondo, 0.7, 0.7));
}

/** La oreja de la 1, mordida y caída; la de la 2, en punta. */
function oreja(n: 1 | 2): string {
  if (n === 1) {
    const d = curva([[64, -114], [65, -130], [70, -138], [77, -134], [74, -129], [79, -124], [82, -114]]);
    return conGrano(enmascarado('m-lobas-oreja-1', d, forma(d, C.gris) + nube(72, -122, 4, 8, C.pulpa, 's', 0.55) + nube(66, -116, 6, 4, C.tinta, 's', 0.6)) +
      // La punta doblada, que se le cae para adelante.
      forma(poli([[70, -138], [77, -134], [82, -131], [76, -140]]), C.grisHondo) + pelos([[64, -114], [66, -128], [70, -138]], [76, -122], 3, [C.canaSucia], 43));
  }
  const d = curva([[63, -114], [68, -134], [71, -147], [76, -134], [82, -114]]);
  return conGrano(enmascarado('m-lobas-oreja-2', d, forma(d, C.gris) + nube(72, -124, 3.4, 10, C.pulpa, 's', 0.6) + nube(76, -120, 3, 10, C.tinta, 's', 0.5)) + pelos([[63, -114], [68, -134], [71, -147]], [74, -124], 3, [C.canaSucia, C.cana], 47));
}

/** El párpado cerrado: el pelo de la cara y la raya del ojo que duerme. */
function parpado(n: 1 | 2): string {
  const [x, y] = A.ojo;
  return conGrano(forma(elipse(x, y, 5.6, 4.2), C.gris) + nube(x, y - 1.4, 5, 2.4, C.canaSucia, 's', 0.7) +
    trazo(`M${x - 5} ${y} Q${x} ${y + 2.6} ${x + 5} ${y - 0.6}`, C.tinta, 1.2) + (n === 2 ? trazo(`M${x - 3} ${y - 4} L${x + 3} ${y + 4}`, C.pulpa, 1.2, 0.9) : ''));
}

/* ------------------------------------------------------------------
   El polvo, el crujido, el vaho y la manzana
   ------------------------------------------------------------------ */

/** El polvo de años que se sacuden: bocanadas del papel de la tapa alrededor del cuerpo. */
function polvo(): string {
  const rnd = azar(311);
  const puffs = [[-74, -100], [-44, -118], [-4, -114], [36, -118], [70, -102], [-90, -70], [86, -72], [-36, -36], [28, -36], [-60, -50], [58, -46]];
  return puffs.map(([x, y]) => nube(x!, y!, 10 + rnd() * 8, 7 + rnd() * 5, C.papel, 'm', 0.55)).join('') +
    Array.from({ length: 30 }, () => nube(-96 + rnd() * 192, -128 + rnd() * 100, 1.4, 1.4, C.canaSucia, 'xs', 0.9)).join('');
}

/** El crujido de los huesos al pararse: rayitas quebradas en los hombros, la cadera y el cogote. */
function cruje(): string {
  const crac = (x: number, y: number): string =>
    trazo(`M${x - 6} ${y} l3 -3 l2 3 l3 -4 l2 3`, C.papel, 1.6) + [-1, 0, 1].map((i) => trazo(`M${x + i * 6} ${y - 7} l${i * 2} -5`, C.papel, 1.2, 0.8)).join('');
  return crac(36, -82) + crac(-44, -88) + crac(54, -100) + crac(-10, -100);
}

/** El vaho del aullido que no se oye: tres bocanadas que salen del hocico. */
function vaho(): string {
  return nube(134, -101, 7, 5, C.papel, 's', 0.95) + nube(148, -106, 10, 7, C.papel, 'm', 0.85) + nube(164, -112, 13, 9, C.papel, 'm', 0.7) + nube(150, -105, 4, 3, C.cana, 's', 0.9);
}

/** La manzana firme, en el piso, adelante: entera, que ya no pueden morder. */
function manzana(): string {
  const d = curva([[0, -9], [6, -10], [9, -4], [7, 3], [2, 6], [-2, 6], [-7, 3], [-9, -4], [-6, -10]]);
  return conGrano(enmascarado('m-lobas-manzana', d, forma(d, C.labial) + nube(4, 2, 6, 5, C.labialHondo, 's', 0.9) + nube(-3, -4, 3, 3, C.pulpa, 's', 0.9) + nube(-3.4, -5, 1, 1, C.cana, 'xs', 1)) +
    trazo('M0 -9 q0 -4 2 -6', C.tinta, 1.2) + forma(curva([[1.6, -12], [6, -15], [8, -12], [4, -10.6]]), C.verde) + trazo('M2 -12 l5 -2', C.verdeHondo, 0.5));
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.2;
const MANZANA: P = [-38, 12];

export const PIEZAS_LOBAS: readonly Pieza[] = [
  { nombre: 'lobas-pata-tras-lejos', caja: [-80, -92, 64, 100], dibujo: pata(correr(TRASERA, 8, -2), [-41, -5], [-48, -30], true, 'm-lobas-pata-tl'), densidad: D },
  { nombre: 'lobas-pata-del-lejos', caja: [8, -88, 58, 96], dibujo: pata(correr(DELANTERA, -8, -2), [33, -5], [30, -16], true, 'm-lobas-pata-dl'), densidad: D },
  { nombre: 'lobas-cola', caja: [-106, -100, 56, 86], dibujo: cola(), densidad: D },
  { nombre: 'lobas-torso-1', caja: [-90, -118, 166, 82], dibujo: torso(1), densidad: D },
  { nombre: 'lobas-torso-2', caja: [-90, -118, 166, 82], dibujo: torso(2), densidad: D },
  { nombre: 'lobas-joven', caja: [-90, -120, 166, 80], dibujo: joven(), densidad: D },
  { nombre: 'lobas-pata-tras', caja: [-80, -92, 60, 100], dibujo: pata(TRASERA, [-49, -3], [-56, -28], false, 'm-lobas-pata-tc'), densidad: D },
  { nombre: 'lobas-pata-del', caja: [16, -86, 50, 94], dibujo: pata(DELANTERA, [41, -3], [38, -14], false, 'm-lobas-pata-dc'), densidad: D },
  { nombre: 'lobas-boca', caja: [76, -100, 52, 26], dibujo: boca(), densidad: D * 1.3 },
  { nombre: 'lobas-quijada-1', caja: [72, -102, 56, 26], dibujo: quijada(1), densidad: D * 1.3 },
  { nombre: 'lobas-quijada-2', caja: [72, -102, 56, 26], dibujo: quijada(2), densidad: D * 1.3 },
  { nombre: 'lobas-lengua', caja: [94, -96, 20, 28], dibujo: lengua(), densidad: D * 1.3 },
  { nombre: 'lobas-cabeza-1', caja: [38, -146, 96, 76], dibujo: cabeza(1), densidad: D * 1.3 },
  { nombre: 'lobas-cabeza-2', caja: [38, -146, 96, 76], dibujo: cabeza(2), densidad: D * 1.3 },
  { nombre: 'lobas-parpado-1', caja: [84, -116, 16, 14], dibujo: parpado(1), densidad: D * 1.6 },
  { nombre: 'lobas-parpado-2', caja: [84, -116, 16, 14], dibujo: parpado(2), densidad: D * 1.6 },
  { nombre: 'lobas-oreja-1', caja: [58, -146, 30, 38], dibujo: oreja(1), densidad: D * 1.3 },
  { nombre: 'lobas-oreja-2', caja: [58, -154, 30, 46], dibujo: oreja(2), densidad: D * 1.3 },
  { nombre: 'lobas-vaho', caja: [120, -130, 64, 44], dibujo: vaho(), densidad: 1.6 },
  { nombre: 'lobas-cruje', caja: [-56, -120, 120, 44], dibujo: cruje(), densidad: 2 },
  { nombre: 'lobas-polvo', caja: [-130, -150, 260, 140], dibujo: polvo(), densidad: 1.2 },
  { nombre: 'lobas-manzana', caja: [-12, -18, 24, 27], dibujo: manzana(), densidad: 6 },
];

const img = imagenesDe(PIEZAS_LOBAS);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Una loba armada con las marcas de un momento. */
function loba(n: 1 | 2, t: Record<string, string>, o: Record<string, string>): string {
  return parte(`loba-${n}`,
    `<ellipse cx="-6" cy="1" rx="84" ry="7" class="bt-lobas-sombra"/>` +
    parte(`alza-${n}`,
      // Las cuatro patas salen de abajo del cuerpo, que les tapa la juntura: las de lejos primero.
      parte(`pata-tl-${n}`, img('lobas-pata-tras-lejos'), t[`pata-tl-${n}`]) +
      parte(`pata-dl-${n}`, img('lobas-pata-del-lejos'), t[`pata-dl-${n}`]) +
      parte(`pata-tc-${n}`, img('lobas-pata-tras'), t[`pata-tc-${n}`]) +
      parte(`pata-dc-${n}`, img('lobas-pata-del'), t[`pata-dc-${n}`]) +
      parte(`cola-${n}`, img('lobas-cola'), t[`cola-${n}`]) +
      parte(`torso-${n}`, img(`lobas-torso-${n}`) + parte(`joven-${n}`, img('lobas-joven'), '', o[`joven-${n}`]), t[`torso-${n}`]) +
      parte(`cabeza-${n}`,
        parte(`boca-${n}`, img('lobas-boca'), '', o[`boca-${n}`]) +
        parte(`quijada-${n}`, img(`lobas-quijada-${n}`), t[`quijada-${n}`]) +
        parte(`lengua-${n}`, img('lobas-lengua'), '', o[`lengua-${n}`]) +
        img(`lobas-cabeza-${n}`) +
        parte(`parpado-${n}`, img(`lobas-parpado-${n}`), '', o[`parpado-${n}`]) +
        parte(`oreja-${n}`, img(`lobas-oreja-${n}`), t[`oreja-${n}`]) +
        parte(`vaho-${n}`, img('lobas-vaho'), t[`vaho-${n}`], o[`vaho-${n}`]),
        t[`cabeza-${n}`]) +
      parte(`cruje-${n}`, img('lobas-cruje'), '', o[`cruje-${n}`]) +
      parte(`polvo-${n}`, img('lobas-polvo'), t[`polvo-${n}`], o[`polvo-${n}`]),
      t[`alza-${n}`]),
    t[`loba-${n}`]);
}

/** Las dos armadas con las marcas de un momento: la 1 atrás, la 2 adelante, y la manzana en el piso. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return loba(1, t, o) + loba(2, t, o) + `<g transform="translate(${MANZANA[0]} ${MANZANA[1]}) scale(0.62)">${img('lobas-manzana')}</g>`;
}

/** Las lobas en un momento, sin lo que las hace tocables: para el test, el retrato y para mirarlas. */
export function lobasEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: echadas. Se toca también el hueco donde duermen. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--lobas" data-id="las-antiguas-lobas" role="button" tabindex="0" aria-label="${nombres.get('las-antiguas-lobas') ?? 'Las antiguas lobas'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">` +
    `<ellipse cx="0" cy="-12" rx="66" ry="30" class="bt-lobas-toque"/>` +
    armado(QUIETO) +
    `</g></g>`
  );
}

/** El retrato de la ficha: paradas, aullando a dúo el aullido que no se oye, al pie de las tiras. */
export const RETRATO = { caja: [LOBAS.x - 86, LOBAS.piso - 86, 176, 104] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/monte-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/monte-cerca.webp" x="0" y="240" width="900" height="400" preserveAspectRatio="none"/>` +
    lobasEn(AULLAN)
  );
}

export const LOBAS_PERSONAJE: Personaje = {
  id: 'las-antiguas-lobas',
  region: 'el-monte',
  ancla: LOBAS.x,
  piezas: PIEZAS_LOBAS,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
