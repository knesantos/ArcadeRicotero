/**
 * El diablo de muchos cuernos (`D-73`, vigesimocuarta vuelta), el que recibe en la puerta del salón.
 *
 * *"El infierno está encantador esta noche"* es de *Gulp!* (1985), y el verso es *"para cerrar un ojo y ver
 * cuántos cuernos tiene el diablo"*. Es el portero del salón: de levita, chaleco y moño, con guantes blancos
 * y monóculo, sonriendo como quien te hace pasar. Tiene más cuernos de los que se pueden contar con un ojo,
 * y ninguno es del mismo bicho: carnero de los dos lados (uno despuntado), cabra, ciervo, unicornio, chivo,
 * toro, y uno chiquito que le sale de la pera. Como es el portero, la cornamenta le hace de perchero: en la
 * punta de la de cabra cuelga la galera de algún invitado, y del toro la ficha del guardarropa, con su
 * número. Lo del dibujo: las pupilas de chivo, acostadas; el diente de oro; el aro en la oreja; el clavel en
 * el ojal, de donde cuelga el cordón del monóculo; la cadena del reloj cruzada en el chaleco; las polainas
 * blancas sobre las pezuñas. Y el brote: cuando termina de contar le sale uno más, verde, con una hojita.
 *
 * Viste la tapa de *Gulp!*, medida con sharp: la cara y la cola son el rojo de las letras del interior,
 * el chaleco y el brote el verde de las letras del frente, el moño, el monóculo y el diente el amarillo que
 * asoma debajo del rojo, la levita el negro de la tinta, y los guantes, la camisa y los cuernos el papel.
 *
 * Coordenadas: el (0, 0) es el piso entre las pezuñas, y mira de frente (`rig-cuernos.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { CUENTA, CUERNOS, CUERNOS_ARMADO as A, ORDEN, QUIETO, marcas, type Cuerno, type Momento } from './rig-cuernos.ts';

/** Las tintas de *Gulp!* (`tokens.css`). */
const C = {
  negro: 'var(--bestia-cuernos-negro)',
  grafito: 'var(--bestia-cuernos-grafito)',
  grafitoClaro: 'var(--bestia-cuernos-grafito-claro)',
  papel: 'var(--bestia-cuernos-papel)',
  papelHondo: 'var(--bestia-cuernos-papel-hondo)',
  crema: 'var(--bestia-cuernos-crema)',
  rojo: 'var(--bestia-cuernos-rojo)',
  rojoVivo: 'var(--bestia-cuernos-rojo-vivo)',
  naranja: 'var(--bestia-cuernos-naranja)',
  rojoHondo: 'var(--bestia-cuernos-rojo-hondo)',
  sangre: 'var(--bestia-cuernos-sangre)',
  amarillo: 'var(--bestia-cuernos-amarillo)',
  oro: 'var(--bestia-cuernos-oro)',
  verde: 'var(--bestia-cuernos-verde)',
  verdeVivo: 'var(--bestia-cuernos-verde-vivo)',
  verdeHondo: 'var(--bestia-cuernos-verde-hondo)',
  verdeNoche: 'var(--bestia-cuernos-verde-noche)',
};

const H = A.cabeza;
/** Un punto relativo al medio de la cabeza. */
const en = ([x, y]: P): P => [H[0] + x, H[1] + y];
const ens = (pts: readonly P[]): P[] => pts.map(en);
const espejo = (pts: readonly P[]): P[] => pts.map(([x, y]) => [-x, y] as P);

/* ------------------------------------------------------------------
   El tubo: una línea gruesa que se afina, para los cuernos y la cola
   ------------------------------------------------------------------ */

/** Muestrea una Catmull-Rom abierta por los puntos: `n` puntos parejos. */
function muestras(pts: readonly P[], n: number): P[] {
  const k = pts.length - 1;
  const p = (j: number): P => pts[Math.min(k, Math.max(0, j))]!;
  const out: P[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * k;
    const s = Math.min(k - 1, Math.floor(t));
    const u = t - s;
    const [p0, p1, p2, p3] = [p(s - 1), p(s), p(s + 1), p(s + 2)];
    const c = (a: number, b: number, c2: number, d: number): number => 0.5 * (2 * b + (-a + c2) * u + (2 * a - 5 * b + 4 * c2 - d) * u * u + (-a + 3 * b - 3 * c2 + d) * u * u * u);
    out.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
  }
  return out;
}

/** Las normales de una línea muestreada. */
function normales(pts: readonly P[]): P[] {
  return pts.map((_, i) => {
    const a = pts[Math.max(0, i - 1)]!;
    const b = pts[Math.min(pts.length - 1, i + 1)]!;
    const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
    const l = Math.hypot(dx, dy) || 1;
    return [-dy / l, dx / l] as P;
  });
}

/** El contorno de un tubo que va de `w0` de ancho a `w1`, por una línea muestreada. */
function tubo(linea: readonly P[], w0: number, w1: number, punta = 0.5): string {
  const ns = normales(linea);
  const w = (i: number): number => (w0 + (w1 - w0) * (i / (linea.length - 1))) / 2;
  const a = linea.map((p, i) => [p[0] + ns[i]![0] * w(i), p[1] + ns[i]![1] * w(i)] as P);
  const b = linea.map((p, i) => [p[0] - ns[i]![0] * w(i), p[1] - ns[i]![1] * w(i)] as P).reverse();
  const fin = linea[linea.length - 1]!;
  const ant = linea[linea.length - 2]!;
  const [dx, dy] = [fin[0] - ant[0], fin[1] - ant[1]];
  const l = Math.hypot(dx, dy) || 1;
  const pico: P = [fin[0] + (dx / l) * w1 * punta, fin[1] + (dy / l) * w1 * punta];
  return curva([...a, pico, ...b]);
}

/** Un lado del tubo, corrido hacia adentro: la luz o la sombra que corre a lo largo. */
function lado(linea: readonly P[], w0: number, w1: number, s: 1 | -1, k: number, desde = 0, hasta = 1): string {
  const ns = normales(linea);
  const i0 = Math.round(desde * (linea.length - 1));
  const i1 = Math.round(hasta * (linea.length - 1));
  const pts = linea.slice(i0, i1 + 1).map((p, j) => {
    const i = i0 + j;
    const w = ((w0 + (w1 - w0) * (i / (linea.length - 1))) / 2) * k * s;
    return [p[0] + ns[i]![0] * w, p[1] + ns[i]![1] * w] as P;
  });
  return curva(pts, false);
}

interface Hechura {
  pts: readonly P[];
  w0: number;
  w1: number;
  base: string;
  luz: string;
  sombra: string;
  /** La punta: su tinta y desde dónde (0 a 1). */
  punta?: [string, number];
  /** Los anillos del cuerno: cuántos, su tinta y hasta dónde llegan. */
  anillos?: [number, string, number];
}

/** Un cuerno a aerógrafo: la forma, la sombra de abajo, la luz de arriba, los anillos y la punta. */
function cuernoDe(id: string, h: Hechura): string {
  const linea = muestras(h.pts, 40);
  const d = tubo(linea, h.w0, h.w1);
  const ns = normales(linea);
  const anillos = h.anillos
    ? Array.from({ length: h.anillos[0] }, (_, j) => {
        const i = Math.round(((j + 0.6) / (h.anillos![0] + 1)) * h.anillos![2] * (linea.length - 1));
        const [x, y] = linea[i]!;
        const [nx, ny] = ns[i]!;
        const w = ((h.w0 + (h.w1 - h.w0) * (i / (linea.length - 1))) / 2) * 1.1;
        const [tx, ty] = [ny, -nx];
        return trazo(`M${f(x + nx * w)} ${f(y + ny * w)} Q${f(x + tx * w * 0.5)} ${f(y + ty * w * 0.5)} ${f(x - nx * w)} ${f(y - ny * w)}`, h.anillos![1], 1.1, 0.75);
      }).join('')
    : '';
  const punta = h.punta
    ? soplo(tubo(linea.slice(Math.round(h.punta[1] * (linea.length - 1))), h.w0 + (h.w1 - h.w0) * h.punta[1], h.w1), h.punta[0], 's', 0.95)
    : '';
  return enmascarado(id, d,
    forma(d, h.base) +
    trazo(lado(linea, h.w0, h.w1, -1, 0.8), h.sombra, Math.max(2, h.w0 * 0.45), 0.8).replace('/>', ' filter="url(#soplo-s)"/>') +
    trazo(lado(linea, h.w0, h.w1, 1, 0.45, 0.05, 0.8), h.luz, Math.max(1.2, h.w0 * 0.22), 0.85).replace('/>', ' filter="url(#soplo-xs)"/>') +
    anillos + punta);
}

/** Una espiral de carnero alrededor de `c`, del ángulo `a0` al `a1` (grados) y del radio `r0` al `r1`. */
function espiral(c: P, a0: number, a1: number, r0: number, r1: number, n = 14): P[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180;
    const r = r0 + (r1 - r0) * Math.pow(t, 1.3);
    return [c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r] as P;
  });
}

/* ------------------------------------------------------------------
   Los cuernos, uno por bicho
   ------------------------------------------------------------------ */

const CARNERO: P[] = espiral(en([-56, -6]), -20, -335, 27, 9);
const HECHURAS: Readonly<Record<Cuerno, Hechura>> = {
  'carnero-1': { pts: CARNERO, w0: 15, w1: 5, base: C.oro, luz: C.amarillo, sombra: C.rojoHondo, anillos: [11, C.rojoHondo, 0.95] },
  // El de la derecha está despuntado: se le cortó la punta en alguna pelea, y termina chato.
  'carnero-2': { pts: espejo(espiral([-H[0] - 56, H[1] - 6], -20, -300, 28, 12)).map(([x, y]) => [x, y] as P), w0: 15, w1: 7, base: C.oro, luz: C.amarillo, sombra: C.rojoHondo, anillos: [10, C.rojoHondo, 0.95] },
  cabra: { pts: ens([[-18, -28], [-26, -52], [-40, -78], [-60, -96], [-84, -106], [-104, -106], [-114, -98]]), w0: 12, w1: 2, base: C.crema, luz: C.papel, sombra: C.grafito, punta: [C.grafito, 0.82], anillos: [12, C.papelHondo, 0.8] },
  ciervo: { pts: ens([[-6, -34], [-10, -58], [-8, -82], [-16, -106], [-28, -124]]), w0: 8, w1: 2, base: C.papelHondo, luz: C.papel, sombra: C.grafito, punta: [C.crema, 0.85] },
  unicornio: { pts: ens([[1, -36], [2, -60], [4, -96]]), w0: 10, w1: 1, base: C.amarillo, luz: C.papel, sombra: C.oro },
  chivo: { pts: ens([[13, -33], [20, -50], [30, -62], [44, -66], [52, -60]]), w0: 9, w1: 2, base: C.grafito, luz: C.grafitoClaro, sombra: C.negro, anillos: [7, C.negro, 0.85] },
  toro: { pts: ens([[24, -26], [44, -42], [64, -58], [76, -80], [74, -104], [66, -116]]), w0: 12, w1: 2, base: C.papel, luz: C.papel, sombra: C.papelHondo, punta: [C.negro, 0.72] },
  pera: { pts: ens([[3, 46], [10, 54], [20, 58], [28, 54], [31, 46]]), w0: 6, w1: 1.4, base: C.crema, luz: C.papel, sombra: C.grafito, anillos: [3, C.papelHondo, 0.7] },
};

/** Las puntas del ciervo, que salen del palo: tres, finitas. */
function puntasDeCiervo(): string {
  const ramas: Array<[P[], number]> = [
    [ens([[-9, -64], [-22, -74], [-36, -76]]), 5],
    [ens([[-10, -90], [-2, -104], [6, -120]]), 4.5],
    [ens([[-7, -46], [-16, -50], [-24, -48]]), 4],
  ];
  return ramas.map(([pts, w], i) => cuernoDe(`m-cuernos-ciervo-punta-${i + 1}`, { pts, w0: w, w1: 1.4, base: C.papelHondo, luz: C.papel, sombra: C.grafito, punta: [C.crema, 0.7] })).join('');
}

/** La galera de un invitado, puesta en la punta de la cabra como en un perchero. */
function galera(): string {
  const [gx, gy] = A.galera;
  const giro = -24;
  const copa = poli([[gx - 11, gy - 2], [gx - 9, gy - 30], [gx + 10, gy - 30], [gx + 12, gy - 2]]);
  const ala = elipse(gx, gy, 19, 4.6);
  return `<g transform="rotate(${giro} ${gx} ${gy})">` +
    enmascarado('m-cuernos-galera', copa,
      forma(copa, C.negro) + nube(gx - 5, gy - 18, 3, 12, C.grafitoClaro, 's', 0.8) + nube(gx + 9, gy - 14, 4, 16, C.grafito, 's', 0.5) +
      forma(poli([[gx - 11, gy - 9], [gx + 12, gy - 9], [gx + 12, gy - 4], [gx - 11, gy - 4]]), C.rojoHondo)) +
    forma(ala, C.negro) + trazo(`M${gx - 17} ${gy - 1} Q${gx} ${gy - 5} ${gx + 17} ${gy - 1}`, C.grafitoClaro, 1, 0.8) +
    forma(elipse(gx - 1, gy - 30, 10, 2.4), C.grafito) +
    `</g>`;
}

/** La ficha del guardarropa: un cartón con un agujero, el piolín y el número a mano. */
function ficha(): string {
  const [fx, fy] = A.ficha;
  const [hx, hy] = en([74, -86]);
  const carton = poli([[fx - 8, fy - 1], [fx + 8, fy - 3], [fx + 10, fy + 19], [fx - 6, fy + 21]]);
  return trazo(`M${hx} ${hy} Q${f((hx + fx) / 2 + 2)} ${f((hy + fy) / 2 + 6)} ${fx + 1} ${fy + 3}`, C.crema, 0.9) +
    enmascarado('m-cuernos-ficha', carton,
      forma(carton, C.crema) + nube(fx + 6, fy + 14, 6, 8, C.papelHondo, 's', 0.9) + forma(poli([[fx - 8, fy + 15], [fx + 10, fy + 13], [fx + 10, fy + 17], [fx - 8, fy + 19]]), C.rojo, 0.85) +
      // El número, garabateado: un uno y un tres.
      trazo(`M${fx - 3} ${fy + 7} l2 -2 l0 8 M${fx + 2} ${fy + 5} q4 -1 3 2 q-2 1 -1 1 q4 1 1 4 q-2 1 -3 0`, C.negro, 1, 0.9)) +
    forma(elipse(fx + 1, fy + 3, 1.3, 1.3), C.negro);
}

/** Un cuerno entero, con lo que tenga colgado. */
function cuerno(c: Cuerno): string {
  const extra = c === 'ciervo' ? puntasDeCiervo() : '';
  const cuelga = c === 'cabra' ? galera() : c === 'toro' ? ficha() : '';
  // El carnero despuntado: la cara del corte, más clara.
  const corte = c === 'carnero-2' ? (() => {
    const pts = muestras(HECHURAS['carnero-2'].pts, 40);
    const [x, y] = pts[pts.length - 1]!;
    return forma(elipse(x, y, 3.6, 2.6), C.amarillo, 0.95) + trazo(`M${f(x - 2)} ${f(y)} l4 0.6`, C.rojoHondo, 0.6, 0.7);
  })() : '';
  // El unicornio: la rosca, en diagonal, como el diente del narval.
  const rosca = c === 'unicornio' ? Array.from({ length: 9 }, (_, i) => {
    const [x, y] = en([1.4 + i * 0.33, -40 - i * 6.2]);
    const w = 4.8 - i * 0.5;
    return trazo(`M${f(x - w)} ${f(y + 2)} Q${f(x)} ${f(y + 1)} ${f(x + w)} ${f(y - 3)}`, C.oro, 1.2, 0.85);
  }).join('') : '';
  return conGrano(extra + cuernoDe(`m-cuernos-${c}`, HECHURAS[c]) + rosca + corte + cuelga);
}

/** El brote: el cuerno nuevo, verde y tierno, con una hojita en la punta. */
function brote(): string {
  const pts = ens([[8, -36], [9, -50], [14, -60], [21, -63]]);
  const [hx, hy] = en([21, -63]);
  const hoja = `M${hx} ${hy} Q${hx + 6} ${hy - 9} ${hx + 13} ${hy - 6} Q${hx + 8} ${hy + 2} ${hx} ${hy} Z`;
  return conGrano(
    cuernoDe('m-cuernos-brote', { pts, w0: 7, w1: 1.6, base: C.verde, luz: C.verdeVivo, sombra: C.verdeHondo }) +
    forma(hoja, C.verdeVivo) + trazo(`M${hx} ${hy} Q${hx + 6} ${hy - 4} ${hx + 12} ${hy - 5}`, C.verdeHondo, 0.7, 0.8),
  );
}

/* ------------------------------------------------------------------
   La cola, los faldones, las piernas
   ------------------------------------------------------------------ */

function cola(): string {
  const pts: P[] = [[10, -108], [40, -100], [62, -76], [62, -46], [68, -22], [84, -14]];
  const linea = muestras(pts, 40);
  const d = tubo(linea, 7, 3.4);
  // La punta de flecha, de pala, mirando para adelante.
  const [px, py] = [86, -14];
  const pala = `M${px - 4} ${py - 1} Q${px + 2} ${py - 12} ${px + 16} ${py - 6} Q${px + 10} ${py - 2} ${px + 16} ${py + 6} Q${px + 2} ${py + 10} ${px - 4} ${py + 1} Z`;
  return conGrano(
    enmascarado('m-cuernos-cola', d, forma(d, C.rojo) + trazo(lado(linea, 7, 3.4, -1, 0.7), C.rojoHondo, 3, 0.9) + trazo(lado(linea, 7, 3.4, 1, 0.4), C.naranja, 1.4, 0.8)) +
    enmascarado('m-cuernos-pala', pala, forma(pala, C.rojo) + nube(px + 10, py + 2, 6, 5, C.rojoHondo, 's', 0.9) + nube(px + 4, py - 4, 4, 2, C.naranja, 'xs', 0.9)),
  );
}

/** Los faldones de la levita, que asoman detrás de las piernas. */
function faldones(): string {
  const d = curva([[-30, -118], [-38, -86], [-44, -40], [-34, -30], [-16, -62], [0, -104], [16, -62], [34, -30], [44, -40], [38, -86], [30, -118]]);
  return conGrano(enmascarado('m-cuernos-faldones', d,
    forma(d, C.negro) + nube(-38, -64, 5, 28, C.grafito, 'm', 0.7) + nube(38, -64, 4, 26, C.grafito, 'm', 0.4) +
    nube(0, -90, 20, 14, C.negro, 'm', 0.9) + trazo('M-36 -100 Q-40 -70 -40 -40', C.grafitoClaro, 1, 0.5)));
}

function piernas(): string {
  const pierna = (s: 1 | -1): string => {
    const X = (x: number): number => x * s;
    const d = poli([[X(-27), -114], [X(-1), -114], [X(-3), -28], [X(-23), -28]]);
    const rayas = [-23, -18, -13, -8].map((x) => trazo(`M${X(x - 1)} -112 L${X(x + 0.5)} -30`, C.negro, 1.6, 0.85)).join('');
    const polaina = curva([[X(-24), -32], [X(-2), -32], [X(-1), -12], [X(-12), -9], [X(-26), -12]]);
    const botones = [-28, -22, -16].map((y) => forma(elipse(X(-4.5), y, 1.1, 1.1), C.grafito)).join('');
    // La pezuña partida, de chivo, que asoma debajo de la polaina.
    const pezuna = `M${X(-25)} -11 Q${X(-26)} -2 ${X(-22)} 0 L${X(-14)} 0 L${X(-13)} -6 L${X(-12)} 0 L${X(-3)} 0 Q${X(0)} -2 ${X(-1)} -11 Z`;
    return enmascarado(`m-cuernos-pierna-${s > 0 ? 1 : 2}`, d, forma(d, C.grafito) + rayas + nube(X(-6), -70, 5, 40, C.negro, 'm', 0.6) + nube(X(-20), -80, 3, 30, C.grafitoClaro, 'm', 0.5)) +
      forma(pezuna, C.negro) + trazo(`M${X(-23)} -3 l6 0`, C.grafitoClaro, 0.8, 0.7) +
      enmascarado(`m-cuernos-polaina-${s > 0 ? 1 : 2}`, polaina, forma(polaina, C.papel) + nube(X(-4), -18, 5, 10, C.papelHondo, 's', 0.9) + nube(X(-14), -14, 12, 3, C.papelHondo, 's', 0.6)) +
      botones;
  };
  return conGrano(nube(2, 2, 40, 5, C.negro, 'm', 0.6) + pierna(1) + pierna(-1));
}

/* ------------------------------------------------------------------
   El cuerpo: la levita, el chaleco, el moño, el clavel y la cadena
   ------------------------------------------------------------------ */

function cuerpo(): string {
  const d = curva([[-42, -200], [-20, -208], [0, -206], [20, -208], [42, -200], [47, -180], [41, -150], [35, -122], [31, -104], [0, -100], [-31, -104], [-35, -122], [-41, -150], [-47, -180]]);
  const camisa = poli([[-12, -206], [12, -206], [0, -172]]);
  const chaleco = curva([[-16, -190], [0, -170], [16, -190], [24, -150], [26, -112], [14, -104], [0, -110], [-14, -104], [-26, -112], [-24, -150]]);
  const solapa = (s: 1 | -1): string => {
    const X = (x: number): number => x * s;
    const p = poli([[X(-12), -206], [X(-22), -204], [X(-30), -184], [X(-26), -180], [X(-30), -168], [X(-20), -150], [X(-14), -170], [X(-6), -184]]);
    return forma(p, C.negro) + trazo(`M${X(-14)} -202 L${X(-26)} -182 L${X(-18)} -154`, C.grafitoClaro, 1, 0.6);
  };
  const botones = [-160, -142, -124].map((y) => forma(elipse(0, y, 1.8, 1.8), C.oro) + forma(elipse(-0.5, y - 0.6, 0.6, 0.6), C.amarillo)).join('');
  const cadena = trazo('M0 -142 Q10 -132 22 -138', C.oro, 1.3) + trazo('M0 -142 Q10 -132 22 -138', C.amarillo, 0.5, 0.8);
  // El moño: el amarillo que asoma debajo del rojo en las letras de la tapa.
  const mono = `M0 -199 L-12 -205 Q-15 -199 -12 -192 Z M0 -199 L12 -205 Q15 -199 12 -192 Z`;
  const [ox, oy] = A.ojal;
  const clavel = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2;
    return forma(elipse(ox + Math.cos(a) * 3, oy + Math.sin(a) * 3, 3, 2.4), i % 2 ? C.rojoVivo : C.rojo);
  }).join('') + forma(elipse(ox, oy, 2, 2), C.rojoHondo) + trazo(`M${ox} ${oy + 3} l-1 7`, C.verdeHondo, 1.2);
  return conGrano(
    enmascarado('m-cuernos-cuerpo', d,
      forma(d, C.negro) +
      nube(-36, -178, 8, 16, C.grafito, 'm', 0.85) + nube(38, -170, 6, 22, C.grafito, 'm', 0.5) + nube(0, -104, 34, 8, C.negro, 's', 0.9) +
      enmascarado('m-cuernos-chaleco', chaleco, forma(chaleco, C.verde) + nube(-10, -150, 8, 30, C.verdeVivo, 'm', 0.7) + nube(16, -130, 10, 28, C.verdeHondo, 'm', 0.85) + nube(0, -186, 16, 6, C.verdeNoche, 's', 0.8) +
        [-180, -164, -148, -132, -116].map((y) => trazo(`M-22 ${y} Q0 ${y + 3} 22 ${y}`, C.verdeHondo, 0.6, 0.45)).join('')) +
      enmascarado('m-cuernos-camisa', camisa, forma(camisa, C.papel) + nube(4, -190, 4, 10, C.papelHondo, 's', 0.9)) +
      solapa(1) + solapa(-1) + botones + cadena) +
    clavel +
    forma(mono, C.amarillo) + trazo('M-12 -203 Q-8 -199 -12 -194 M12 -203 Q8 -199 12 -194', C.oro, 1, 0.9) + forma(elipse(0, -199, 3, 3.2), C.oro),
  );
}

/** El brazo, del hombro al codo: la manga de la levita. */
function brazo(n: 0 | 1): string {
  const s = n === 0 ? 1 : -1;
  const X = (x: number): number => x * s;
  const d = curva([[X(-30), -200], [X(-46), -196], [X(-54), -170], [X(-52), -146], [X(-40), -146], [X(-36), -172]]);
  return conGrano(enmascarado(`m-cuernos-brazo-${n + 1}`, d, forma(d, C.negro) + nube(X(-50), -176, 4, 20, C.grafito, 'm', 0.8) + nube(X(-36), -160, 4, 18, C.negro, 's', 0.9)));
}

/** El antebrazo: la manga, el puño de la camisa y el guante blanco con el índice estirado. */
function antebrazo(n: 0 | 1): string {
  const s = n === 0 ? 1 : -1;
  const X = (x: number): number => x * s;
  const manga = curva([[X(-52), -154], [X(-39), -154], [X(-41), -124], [X(-55), -124]]);
  const puno = poli([[X(-56), -126], [X(-40), -126], [X(-40), -120], [X(-56), -120]]);
  const guante = curva([[X(-55), -120], [X(-41), -120], [X(-40), -110], [X(-45), -104], [X(-54), -104], [X(-57), -112]]);
  const indice = `M${X(-50.5)} -106 L${X(-47.5)} -106 L${X(-47.6)} -98 Q${X(-49)} -95.6 ${X(-50.4)} -98 Z`;
  const pulgar = curva([[X(-41), -116], [X(-37), -112], [X(-38), -108], [X(-42), -110]]);
  return conGrano(
    enmascarado(`m-cuernos-manga-${n + 1}`, manga, forma(manga, C.negro) + nube(X(-52), -140, 3, 16, C.grafito, 'm', 0.8)) +
    forma(puno, C.papel) + trazo(`M${X(-55)} -123 L${X(-41)} -123`, C.papelHondo, 0.7, 0.8) + forma(elipse(X(-48), -123, 1, 1), C.oro) +
    enmascarado(`m-cuernos-guante-${n + 1}`, guante, forma(guante, C.papel) + nube(X(-44), -108, 5, 4, C.papelHondo, 's', 0.9)) +
    forma(pulgar, C.papel) + forma(indice, C.papel) +
    trazo(`M${X(-53)} -110 Q${X(-50)} -106 ${X(-46)} -108 M${X(-52)} -106 l3 1`, C.papelHondo, 0.8, 0.85) +
    trazo(`M${X(-51)} -116 l0 3 M${X(-48)} -117 l0 3 M${X(-45)} -117 l0 3`, C.grafitoClaro, 0.6, 0.6),
  );
}

/** El reloj de bolsillo, abierto en la mano 2. */
function reloj(): string {
  const [x, y] = [46, -110];
  return conGrano(
    forma(elipse(x, y, 8, 8), C.oro) + forma(elipse(x, y, 6.2, 6.2), C.crema) + nube(x + 2, y + 2, 4, 4, C.papelHondo, 's', 0.8) +
    trazo(`M${x} ${y} l0 -4.4 M${x} ${y} l3 1.6`, C.negro, 0.9) +
    [0, 1, 2, 3].map((i) => forma(elipse(x + Math.cos((i * Math.PI) / 2) * 5, y + Math.sin((i * Math.PI) / 2) * 5, 0.6, 0.6), C.negro)).join('') +
    forma(elipse(x, y - 9.4, 1.8, 1.4), C.oro) + nube(x - 3, y - 4, 2, 1.4, C.amarillo, 'xs', 0.9),
  );
}

/* ------------------------------------------------------------------
   La cabeza: la cara, los ojos de chivo, las cejas, la boca
   ------------------------------------------------------------------ */

const CRANEO: readonly P[] = ens([[0, -40], [22, -36], [34, -18], [36, 4], [30, 26], [16, 40], [0, 44], [-16, 40], [-30, 26], [-36, 4], [-34, -18], [-22, -36]]);

function oreja(s: 1 | -1): string {
  const X = (x: number): number => x * s;
  const d = curva(ens([[X(-32), -10], [X(-48), -16], [X(-60), -20], [X(-50), -2], [X(-34), 10]]));
  const [ax, ay] = en([X(-42), 5]);
  return enmascarado(`m-cuernos-oreja-${s > 0 ? 1 : 2}`, d, forma(d, C.rojo) + nube(...en([X(-44), -6]), 6, 4, C.rojoHondo, 's', 0.9) + nube(...en([X(-50), -14]), 4, 2, C.naranja, 'xs', 0.8)) +
    (s > 0 ? `<circle cx="${ax}" cy="${ay}" r="3.2" fill="none" stroke="${C.oro}" stroke-width="1.3"/>` + nube(ax - 1.4, ay + 2, 1, 1, C.amarillo, 'xs', 0.9) : '');
}

function cara(): string {
  const d = curva(CRANEO);
  const [bx, by] = A.boca;
  const ojo = ([x, y]: P): string =>
    forma(elipse(x, y, A.radioOjo + 1.6, A.radioOjo + 1.2), C.rojoHondo) +
    forma(elipse(x, y, A.radioOjo, A.radioOjo - 0.6), C.crema) +
    forma(elipse(x, y, 4.8, 4.8), C.amarillo) + nube(x, y + 2, 4, 2.4, C.oro, 'xs', 0.9);
  const nariz = `M${H[0] - 4} ${H[1] - 6} Q${H[0] - 6} ${H[1] + 6} ${H[0] - 7} ${H[1] + 12} Q${H[0] - 2} ${H[1] + 18} ${H[0] + 6} ${H[1] + 13} Q${H[0] + 6} ${H[1] + 4} ${H[0] + 4} ${H[1] - 6} Z`;
  // El bigote fino, encerado, con las puntas para arriba; la pera en punta.
  const bigote = `M${bx} ${by - 7} Q${bx - 10} ${by - 9} ${bx - 18} ${by - 6} Q${bx - 24} ${by - 4} ${bx - 26} ${by - 12} Q${bx - 22} ${by - 6} ${bx - 18} ${by - 8} Q${bx - 8} ${by - 12} ${bx} ${by - 9} Q${bx + 8} ${by - 12} ${bx + 18} ${by - 8} Q${bx + 22} ${by - 6} ${bx + 26} ${by - 12} Q${bx + 24} ${by - 4} ${bx + 18} ${by - 6} Q${bx + 10} ${by - 9} ${bx} ${by - 7} Z`;
  const pera = `M${bx - 7} ${by + 9} Q${bx} ${by + 12} ${bx + 7} ${by + 9} Q${bx + 6} ${by + 18} ${bx + 2} ${by + 28} Q${bx - 4} ${by + 18} ${bx - 7} ${by + 9} Z`;
  // La sonrisa de quien recibe, con un diente de oro.
  const sonrisa = `M${bx - 13} ${by - 2} Q${bx} ${by + 9} ${bx + 13} ${by - 2} Q${bx} ${by + 4} ${bx - 13} ${by - 2} Z`;
  return conGrano(
    oreja(1) + oreja(-1) +
    enmascarado('m-cuernos-cara', d,
      forma(d, C.rojo) +
      nube(H[0] - 14, H[1] - 14, 16, 12, C.naranja, 'm', 0.75) + nube(H[0] + 20, H[1] + 10, 14, 26, C.rojoHondo, 'm', 0.8) +
      nube(H[0], H[1] + 38, 30, 10, C.rojoHondo, 'm', 0.9) + nube(H[0] - 22, H[1] + 14, 8, 6, C.rojoVivo, 'm', 0.7) +
      nube(H[0] + 16, H[1] + 16, 7, 5, C.rojoVivo, 'm', 0.5) + nube(H[0], H[1] - 36, 24, 8, C.sangre, 'm', 0.75) +
      // Las arrugas de la frente, de tanto alzar la ceja del monóculo.
      trazo(`M${H[0] - 14} ${H[1] - 26} Q${H[0]} ${H[1] - 29} ${H[0] + 16} ${H[1] - 27} M${H[0] - 10} ${H[1] - 21} Q${H[0] + 2} ${H[1] - 23} ${H[0] + 12} ${H[1] - 21}`, C.rojoHondo, 0.9, 0.6) +
      A.ojos.map(ojo).join('') +
      forma(sonrisa, C.sangre) + forma(elipse(bx + 4, by + 1.6, 2, 1.6), C.amarillo) + trazo(`M${bx - 12} ${by - 1.4} Q${bx} ${by + 2.6} ${bx + 12} ${by - 1.4}`, C.papel, 1, 0.5) +
      trazo(`M${bx - 15} ${by - 4} q-2 2 -1 4 M${bx + 15} ${by - 4} q2 2 1 4`, C.rojoHondo, 1, 0.8)) +
    forma(nariz, C.rojo) + nube(H[0] + 3, H[1] + 8, 3, 6, C.rojoHondo, 's', 0.9) + nube(H[0] - 3, H[1] + 2, 1.6, 5, C.naranja, 'xs', 0.9) +
    forma(elipse(H[0] - 1, H[1] + 13.5, 2.6, 1.4), C.sangre, 0.8) +
    forma(bigote, C.negro) + trazo(`M${bx - 16} ${by - 9} Q${bx - 8} ${by - 11} ${bx - 2} ${by - 9}`, C.grafitoClaro, 0.6, 0.7) +
    forma(pera, C.negro) + trazo(`M${bx} ${by + 13} l1 10`, C.grafitoClaro, 0.6, 0.6),
  );
}

/** La pupila de chivo: acostada, una barra con las puntas redondas. */
function pupila(n: 0 | 1): string {
  const [x, y] = A.ojos[n];
  return forma(`M${x - 4} ${y - 1.3} Q${x} ${y - 2.2} ${x + 4} ${y - 1.3} Q${x + 5} ${y} ${x + 4} ${y + 1.3} Q${x} ${y + 2.2} ${x - 4} ${y + 1.3} Q${x - 5} ${y} ${x - 4} ${y - 1.3} Z`, C.negro) +
    forma(elipse(x - 1.8, y - 2.6, 1.2, 0.9), C.papel, 0.9);
}

/** El párpado, cerrado del todo: la isla lo baja desde arriba del ojo. */
function parpado(n: 0 | 1): string {
  const [x, y] = A.ojos[n];
  const r = A.radioOjo;
  const d = elipse(x, y, r + 2, r + 1.6);
  return conGrano(enmascarado(`m-cuernos-parpado-${n + 1}`, d, forma(d, C.rojo) + nube(x, y - r, r, 4, C.naranja, 's', 0.8) + nube(x, y + r, r, 4, C.rojoHondo, 's', 0.9)) +
    trazo(`M${x - r - 1} ${y + r - 1} Q${x} ${y + r + 2} ${x + r + 1} ${y + r - 1}`, C.negro, 1.6) +
    trazo(`M${x - 4} ${y + r + 0.6} l-1 2 M${x} ${y + r + 1.2} l0 2 M${x + 4} ${y + r + 0.6} l1 2`, C.negro, 0.7));
}

/** La ceja: gruesa, negra, arqueada, la del monóculo un poco más alta. */
function ceja(n: 0 | 1): string {
  const s = n === 0 ? -1 : 1;
  const [x, y] = A.cejas[n];
  const d = `M${x - s * 11} ${y + 3} Q${x - s * 2} ${y - 6} ${x + s * 11} ${y - 2} Q${x + s * 13} ${y + 1} ${x + s * 9} ${y + 1} Q${x} ${y - 2} ${x - s * 10} ${y + 5} Z`;
  return conGrano(forma(d, C.negro) + trazo(`M${x - s * 8} ${y} Q${x} ${y - 4} ${x + s * 8} ${y - 1}`, C.grafitoClaro, 0.7, 0.6));
}

/** La boca abierta del susto, cuando le sale el cuerno de más. */
function grito(): string {
  const [bx, by] = A.boca;
  const d = elipse(bx, by + 2, 7, 8);
  return conGrano(forma(elipse(bx, by + 2, 9, 10), C.rojo) + enmascarado('m-cuernos-grito', d, forma(d, C.sangre) + nube(bx, by + 8, 5, 3, C.rojoHondo, 's', 0.9) + forma(elipse(bx + 3, by - 4.6, 2, 1.6), C.amarillo)));
}

/** El monóculo: el aro de oro, el vidrio y el brillo. */
function monoculo(): string {
  const [x, y] = A.ojos[1];
  return conGrano(
    `<circle cx="${x}" cy="${y}" r="10" fill="none" stroke="${C.oro}" stroke-width="2.4"/>` +
    `<circle cx="${x}" cy="${y}" r="10.6" fill="none" stroke="${C.amarillo}" stroke-width="0.7" opacity="0.8"/>` +
    forma(elipse(x, y, 8.8, 8.8), C.papel, 0.14) +
    forma(`M${x - 6} ${y - 4} Q${x - 4} ${y - 7} ${x} ${y - 7.6} Q${x - 4} ${y - 5} ${x - 5} ${y - 1} Z`, C.papel, 0.8) +
    forma(elipse(x + 9.2, y + 4.4, 1.5, 1.5), C.oro),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;
const CAJAS: Readonly<Record<Cuerno, readonly [number, number, number, number]>> = {
  'carnero-1': [-96, -290, 74, 70],
  'carnero-2': [22, -290, 74, 70],
  cabra: [-144, -372, 136, 116],
  ciervo: [-50, -384, 62, 110],
  unicornio: [-6, -350, 18, 70],
  chivo: [6, -320, 54, 46],
  toro: [16, -370, 104, 136],
  pera: [-2, -204, 38, 24],
};

export const PIEZAS_CUERNOS: readonly Pieza[] = [
  { nombre: 'cuernos-cola', caja: [0, -116, 108, 118], dibujo: cola(), densidad: D },
  { nombre: 'cuernos-faldones', caja: [-50, -124, 100, 100], dibujo: faldones(), densidad: D },
  { nombre: 'cuernos-piernas', caja: [-46, -118, 92, 128], dibujo: piernas(), densidad: D },
  { nombre: 'cuernos-cuerpo', caja: [-50, -212, 100, 116], dibujo: cuerpo(), densidad: D * 1.2 },
  ...ORDEN.filter((c) => c !== 'pera').map((c) => ({ nombre: `cuernos-cuerno-${c}`, caja: CAJAS[c], dibujo: cuerno(c), densidad: D })),
  { nombre: 'cuernos-brote', caja: [-2, -320, 38, 42], dibujo: brote(), densidad: D * 1.3 },
  { nombre: 'cuernos-cara', caja: [-66, -292, 132, 96], dibujo: cara(), densidad: D * 1.3 },
  { nombre: 'cuernos-cuerno-pera', caja: CAJAS.pera, dibujo: cuerno('pera'), densidad: D * 1.3 },
  { nombre: 'cuernos-pupila-1', caja: [A.ojos[0][0] - 8, A.ojos[0][1] - 8, 16, 16], dibujo: pupila(0), densidad: D * 1.5 },
  { nombre: 'cuernos-pupila-2', caja: [A.ojos[1][0] - 8, A.ojos[1][1] - 8, 16, 16], dibujo: pupila(1), densidad: D * 1.5 },
  { nombre: 'cuernos-parpado-1', caja: [A.ojos[0][0] - 11, A.ojos[0][1] - 11, 22, 22], dibujo: parpado(0), densidad: D * 1.5 },
  { nombre: 'cuernos-parpado-2', caja: [A.ojos[1][0] - 11, A.ojos[1][1] - 11, 22, 22], dibujo: parpado(1), densidad: D * 1.5 },
  { nombre: 'cuernos-ceja-1', caja: [A.cejas[0][0] - 16, A.cejas[0][1] - 10, 32, 18], dibujo: ceja(0), densidad: D * 1.5 },
  { nombre: 'cuernos-ceja-2', caja: [A.cejas[1][0] - 16, A.cejas[1][1] - 10, 32, 18], dibujo: ceja(1), densidad: D * 1.5 },
  { nombre: 'cuernos-grito', caja: [A.boca[0] - 12, A.boca[1] - 10, 24, 24], dibujo: grito(), densidad: D * 1.5 },
  { nombre: 'cuernos-monoculo', caja: [A.ojos[1][0] - 13, A.ojos[1][1] - 13, 26, 26], dibujo: monoculo(), densidad: D * 1.5 },
  { nombre: 'cuernos-brazo-1', caja: [-58, -204, 32, 62], dibujo: brazo(0), densidad: D },
  { nombre: 'cuernos-antebrazo-1', caja: [-60, -158, 26, 66], dibujo: antebrazo(0), densidad: D * 1.2 },
  { nombre: 'cuernos-brazo-2', caja: [26, -204, 32, 62], dibujo: brazo(1), densidad: D },
  { nombre: 'cuernos-antebrazo-2', caja: [34, -158, 26, 66], dibujo: antebrazo(1), densidad: D * 1.2 },
  { nombre: 'cuernos-reloj', caja: [36, -124, 20, 24], dibujo: reloj(), densidad: D * 1.5 },
];

const img = imagenesDe(PIEZAS_CUERNOS);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El diablo armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const brazoCon = (n: 1 | 2): string =>
    parte(`brazo-${n}`, img(`cuernos-brazo-${n}`) + parte(`antebrazo-${n}`, img(`cuernos-antebrazo-${n}`) + (n === 2 ? parte('reloj', img('cuernos-reloj'), '', o.reloj) : ''), t[`antebrazo-${n}`]), t[`brazo-${n}`]);
  const atras = ORDEN.filter((c) => c !== 'pera').map((c) => parte(`cuerno-${c}`, img(`cuernos-cuerno-${c}`), t[`cuerno-${c}`])).join('');
  return (
    parte('cola', img('cuernos-cola'), t.cola) +
    img('cuernos-faldones') +
    img('cuernos-piernas') +
    parte('tronco',
      parte('cuerpo', img('cuernos-cuerpo'), t.cuerpo) +
      parte('cabeza',
        atras +
        parte('brote', img('cuernos-brote'), t.brote, o.brote) +
        img('cuernos-cara') +
        parte('cuerno-pera', img('cuernos-cuerno-pera'), t['cuerno-pera']) +
        parte('grito', img('cuernos-grito'), '', o.grito) +
        parte('pupila-1', img('cuernos-pupila-1'), t['pupila-1']) +
        parte('pupila-2', img('cuernos-pupila-2'), t['pupila-2']) +
        parte('parpado-1', img('cuernos-parpado-1'), t['parpado-1']) +
        parte('parpado-2', img('cuernos-parpado-2'), t['parpado-2']) +
        parte('ceja-1', img('cuernos-ceja-1'), t['ceja-1']) +
        parte('ceja-2', img('cuernos-ceja-2'), t['ceja-2']),
        t.cabeza) +
      // El cordón y el monóculo, fuera de la cabeza: cuando se le cae, cuelga del ojal.
      parte('cordon', `<path class="bt-cuernos-cordon" d="M0 0 L0 1" vector-effect="non-scaling-stroke"/>`, t.cordon) +
      parte('monoculo', img('cuernos-monoculo'), t.monoculo) +
      brazoCon(2) + brazoCon(1),
      t.tronco)
  );
}

/** El diablo en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function cuernosEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: en la puerta, de frente, con el monóculo puesto. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--cuernos" data-id="el-diablo-de-muchos-cuernos" role="button" tabindex="0" aria-label="${nombres.get('el-diablo-de-muchos-cuernos') ?? 'El diablo de muchos cuernos'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: con un ojo cerrado, contándose los cuernos, y el de más recién salido. */
export const RETRATO = { caja: [CUERNOS.x - 84, CUERNOS.piso - 230, 176, 240] as const };
function retrato(): string {
  return `<image href="/bestiario/infierno-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/infierno-cerca.webp" x="0" y="300" width="900" height="340" preserveAspectRatio="none"/>` + cuernosEn(CUENTA);
}

export const CUERNOS_PERSONAJE: Personaje = {
  id: 'el-diablo-de-muchos-cuernos',
  region: 'el-infierno',
  ancla: CUERNOS.x,
  piezas: PIEZAS_CUERNOS,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
