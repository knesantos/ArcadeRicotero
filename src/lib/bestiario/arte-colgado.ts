/**
 * El que duerme colgado (`D-73`, vigésima vuelta), cabeza abajo de la rama soldada del árbol del gran
 * bonete.
 *
 * *"Dormís colgado en la rama que soldaste con primor"* es de *¡Es hora de levantarse, querido!*, el
 * tercer tema de *Cordero atado* (1993), que en la contratapa lleva entre paréntesis *(dormiste bien?)*.
 * Por eso viste ese disco, medido con sharp: el saco es el bicho de plumas azules del frente, con su
 * naranja de fondo y el ocre de sus pezuñas; y el sueño está dibujado con la tiza azul de la contratapa.
 *
 * De la letra son la rama soldada con primor, los angelitos muy profesionales que juegan a los gangsters
 * en el sueño, el laurel, y el carozo del asunto, que es su temor, tan puro y tan elegante, sentado en su
 * dedo, muy almibarado. Del dibujo, todo lo demás: que duerme como un murciélago envuelto en el saco de
 * plumas, el gorro de dormir, la careta de soldador colgada al lado y que el temor lleva moño.
 *
 * Coordenadas: el (0, 0) son las rodillas enganchadas en la rama, y lo positivo es para abajo
 * (`rig-colgado.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { caja, cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { COLGADO, COLGADO_ARMADO as A, LEVANTARSE, QUIETO, marcas, type Momento } from './rig-colgado.ts';

/** Las tintas de *Cordero atado* (`tokens.css`). */
const C = {
  azul: 'var(--bestia-colgado-azul)',
  azulClaro: 'var(--bestia-colgado-azul-claro)',
  azulHondo: 'var(--bestia-colgado-azul-hondo)',
  tiza: 'var(--bestia-colgado-tiza)',
  naranja: 'var(--bestia-colgado-naranja)',
  naranjaClara: 'var(--bestia-colgado-naranja-clara)',
  ocre: 'var(--bestia-colgado-ocre)',
  ocreHondo: 'var(--bestia-colgado-ocre-hondo)',
  tinta: 'var(--bestia-colgado-tinta)',
  piel: 'var(--bestia-colgado-piel)',
  pielClara: 'var(--bestia-colgado-piel-clara)',
  una: 'var(--bestia-colgado-una)',
  verde: 'var(--bestia-colgado-verde)',
};

/** Plumas como las del bicho de la tapa: escamas puntudas en filas, la de arriba tapando a la de abajo. */
function plumas(x0: number, y0: number, x1: number, y1: number, paso: number, semilla: number): string {
  let s = '';
  let fila = 0;
  for (let y = y0; y <= y1; y += paso * 0.7, fila++) {
    for (let x = x0 + (fila % 2 ? paso / 2 : 0); x <= x1; x += paso) {
      const k = ((x * 7 + y * 13 + semilla) % 5) / 5;
      // Cabeza abajo: las plumas apuntan para abajo, hacia la cabeza, como en el bicho dado vuelta.
      s += forma(`M${x - paso * 0.45} ${y} Q${x} ${y + paso * 0.2} ${x + paso * 0.45} ${y} L${x} ${y + paso * 0.95} Z`, k > 0.6 ? C.azulClaro : C.azul, 0.9);
      s += trazo(`M${x} ${y + paso * 0.15} L${x} ${y + paso * 0.8}`, C.azulHondo, 0.6, 0.7);
    }
  }
  return s;
}

/* ------------------------------------------------------------------
   Lo que no se hamaca: las piernas en la rama, el laurel y la careta
   ------------------------------------------------------------------ */

function piernas(): string {
  // Enganchado de las rodillas: las corvas abrazan la rama y las canillas se van para atrás y para
  // arriba, con los zapatos al cielo.
  const canilla = (dx: number, tx: number, ty: number, lejos: boolean): string => {
    const d = curva([[dx - 8, 6], [dx - 9, -4], [dx - 2, -10], [tx + 5, ty - 4], [tx + 2, ty + 6], [dx + 8, 4]]);
    return enmascarado(`m-col-canilla-${dx}`, d, forma(d, lejos ? C.azulHondo : C.tinta) + nube(dx - 4, -6, 6, 4, C.azul, 's', 0.5) + nube((dx + tx) / 2, ty / 2, 4, 10, C.azulHondo, 's', 0.6));
  };
  const zapato = (x: number, y: number, g: number): string =>
    `<g transform="rotate(${g} ${x} ${y})">${forma(curva([[x - 6, y + 4], [x - 7, y - 6], [x - 2, y - 16], [x + 4, y - 14], [x + 6, y + 4]]), C.ocreHondo)}${nube(x - 3, y - 10, 2, 4, C.ocre, 'xs', 0.7)}${trazo(`M${x - 6} ${y + 2} l12 0`, C.tinta, 1.4)}</g>`;
  const piernas = canilla(10, 40, -30, true) + zapato(42, -34, 40) + canilla(-6, 26, -38, false) + zapato(28, -42, 34);
  // El laurel soldado a la rama: hojas de chapa con su cordón de soldadura.
  const hoja = (x: number, y: number, g: number): string =>
    `<g transform="rotate(${g} ${x} ${y})">${forma(curva([[x, y], [x + 7, y - 4], [x + 16, y], [x + 7, y + 4]]), C.ocre)}${trazo(`M${x + 1} ${y} l14 0`, C.ocreHondo, 0.7)}${nube(x + 6, y - 1.6, 4, 1.2, C.una, 'xs', 0.5)}</g>`;
  const laurel = [[-58, -2, -30], [-52, 2, 20], [-44, -4, -48], [-38, 3, 34], [-30, -3, -20]].map(([x, y, g]) => hoja(x!, y!, g!)).join('') +
    [-56, -46, -36].map((x) => forma(elipse(x, 0, 2.4, 2), C.ocreHondo) + forma(elipse(x - 0.6, -0.6, 1, 0.8), C.naranjaClara)).join('');
  // La careta de soldador, colgada de la correa: el que soldó la rama con primor.
  const careta = trazo('M40 -2 L44 14', C.tinta, 1.6) +
    forma(cajaRedonda(34, 14, 22, 26, 6), C.tinta) + forma(caja(38, 20, 14, 6), C.verde) + nube(41, 21, 3, 1.4, C.una, 'xs', 0.6) + nube(48, 34, 8, 6, C.azulHondo, 's', 0.6);
  return conGrano(piernas + laurel + careta);
}

/* ------------------------------------------------------------------
   El cuerpo cabeza abajo: el pantalón, el saco de plumas y los brazos cruzados
   ------------------------------------------------------------------ */

const SACO: readonly P[] = [[-20, 50], [20, 50], [26, 80], [28, 120], [22, 140], [-22, 140], [-28, 120], [-26, 80]];

function cuerpo(): string {
  const muslos = curva([[-12, -4], [12, -4], [16, 30], [18, 56], [-18, 56], [-16, 30]]);
  const d = curva(SACO);
  // Los brazos cruzados sobre el pecho, y la mano que deja el índice para arriba: ahí se sienta el temor.
  const brazos = curva([[-26, 100], [-10, 96], [14, 104], [26, 110], [24, 122], [6, 116], [-14, 112], [-26, 114]]);
  const [dx, dy] = A.dedo;
  const mano = curva([[dx - 6, dy + 18], [dx + 6, dy + 18], [dx + 7, dy + 10], [dx + 2, dy + 8], [dx + 2, dy], [dx - 1, dy - 1], [dx - 2, dy + 8], [dx - 7, dy + 10]]);
  const adentro =
    forma(d, C.azul) + plumas(-28, 52, 28, 138, 9, 3) +
    nube(-14, 70, 10, 30, C.tiza, 'm', 0.25) + nube(20, 110, 12, 30, C.azulHondo, 'm', 0.8) + nube(0, 52, 30, 6, C.tinta, 'm', 0.7) +
    // La camisa y la corbata, que cuelgan para el lado de la cabeza.
    forma(poli([[-8, 140], [8, 140], [3, 126], [-3, 126]]), C.una) + forma(poli([[-2, 130], [2, 130], [3, 150], [0, 154], [-3, 150]]), C.naranja);
  return conGrano(
    enmascarado('m-col-muslos', muslos, forma(muslos, C.tinta) + nube(-8, 20, 4, 20, C.azulHondo, 's', 0.7) + nube(10, 40, 6, 16, C.tinta, 's', 0.8)) +
    enmascarado('m-col-saco', d, adentro) +
    nube(0, 108, 30, 14, C.tinta, 's', 0.6) +
    enmascarado('m-col-brazos', brazos, forma(brazos, C.azulClaro) + plumas(-26, 96, 26, 120, 7, 9) + nube(-6, 100, 16, 4, C.tiza, 's', 0.45) + nube(10, 118, 12, 4, C.azulHondo, 's', 0.8)) +
    trazo('M-26 114 Q-6 110 24 122', C.azulHondo, 1.4, 0.9) +
    // La otra mano, metida debajo del codo.
    forma(elipse(24, 112, 5, 4), C.piel) + nube(25, 113, 3, 2, C.ocreHondo, 's', 0.6) +
    enmascarado('m-col-mano', mano, forma(mano, C.piel) + nube(dx - 2, dy + 8, 4, 6, C.pielClara, 's', 0.7) + nube(dx + 4, dy + 14, 4, 4, C.ocreHondo, 's', 0.6)) +
    forma(caja(-6, 140, 12, 8), C.piel),
  );
}

/** Un ala del saco: el faldón de plumas que lo envuelve como a un murciélago, y que se abre al despertarse. */
function ala(n: 0 | 1): string {
  const s = n === 0 ? -1 : 1;
  const [hx, hy] = A.hombros[n];
  const d = curva([[hx, hy - 30], [hx + s * 14, hy - 20], [hx + s * 22, hy + 10], [hx + s * 24, hy + 44], [hx + s * 16, hy + 62], [hx + s * 8, hy + 56], [hx + s * 4, hy + 66], [hx - s * 2, hy + 56], [hx - s * 2, hy + 20]]);
  return conGrano(enmascarado(`m-col-ala-${n}`, d, forma(d, C.azul) + plumas(hx - 26, hy - 30, hx + 26, hy + 66, 9, n * 5) + nube(hx + s * 18, hy + 20, 8, 40, C.azulHondo, 'm', 0.85) + nube(hx - s * 2, hy, 6, 20, C.tiza, 's', 0.25)));
}

/* ------------------------------------------------------------------
   La cabeza dada vuelta, el gorro de dormir y los ojos
   ------------------------------------------------------------------ */

const CARA: readonly P[] = [[0, 146], [12, 150], [17, 164], [15, 180], [8, 188], [0, 190], [-8, 188], [-15, 180], [-17, 164], [-12, 150]];

function cabeza(): string {
  const d = curva(CARA);
  const [cx, cy] = A.cara;
  // Cabeza abajo: la pera arriba, la nariz que apunta para arriba, las cejas abajo de los ojos.
  const nariz = forma(curva([[cx - 3, cy + 2], [cx + 3, cy + 2], [cx + 4, cy - 6], [cx, cy - 9], [cx - 4, cy - 6]]), C.pielClara) + forma(elipse(cx, cy - 7, 3.4, 2.2), C.tinta);
  const cejas = [-1, 1].map((s) => trazo(`M${cx + s * 4} ${cy + 15} Q${cx + s * 8} ${cy + 17} ${cx + s * 12} ${cy + 14}`, C.tinta, 1.6)).join('');
  const boca = trazo(`M${cx - 6} ${cy - 15} Q${cx} ${cy - 19} ${cx + 6} ${cy - 15}`, C.tinta, 1.4);
  const adentro =
    forma(d, C.piel) + nube(cx - 6, cy - 6, 8, 12, C.pielClara, 'm', 0.7) + nube(cx + 10, cy + 6, 6, 14, C.ocreHondo, 'm', 0.75) +
    // La sangre que se le va a la cabeza de dormir colgado: cachetes del naranja de la tapa.
    nube(cx - 9, cy + 2, 5, 4, C.naranja, 's', 0.55) + nube(cx + 9, cy + 2, 5, 4, C.naranja, 's', 0.5) +
    nariz + cejas + boca;
  return conGrano(enmascarado('m-col-cara', d, adentro) + forma(curva([[-15, 178], [-8, 190], [0, 192], [8, 190], [15, 178], [10, 184], [0, 186], [-10, 184]]), C.tinta));
}

/** Los ojos cerrados: dos rayas curvas con pestañas, dadas vuelta. */
function dormido(): string {
  const [cx, cy] = A.cara;
  return [-1, 1].map((s) => trazo(`M${cx + s * 3} ${cy + 8} Q${cx + s * 7.5} ${cy + 5} ${cx + s * 12} ${cy + 8}`, C.tinta, 1.4) + [0.3, 0.6, 0.9].map((k) => trazo(`M${cx + s * (3 + 9 * k)} ${cy + 7} l0 -2.6`, C.tinta, 0.8)).join('')).join('');
}

/** Los ojos abiertos del susto: grandes, con el iris verde del bicho de la tapa. */
function ojos(): string {
  const [cx, cy] = A.cara;
  return [-1, 1].map((s) => forma(elipse(cx + s * 7.5, cy + 8, 5.4, 4.6), C.una) + forma(elipse(cx + s * 7.5, cy + 8.6, 2.6, 2.6), C.verde) + forma(elipse(cx + s * 7.5, cy + 8.6, 1.2, 1.2), C.tinta) + nube(cx + s * 7.5 - 1, cy + 7.4, 0.7, 0.6, C.una, 'xs', 0.9)).join('');
}

/** La boca abierta: el ronquido, o el susto. */
function bocaAbierta(): string {
  const [cx, cy] = A.cara;
  return forma(elipse(cx, cy - 16, 5, 3.6), C.tinta) + nube(cx, cy - 15, 3, 1.6, C.naranja, 'xs', 0.6);
}

/** El gorro de dormir, que cuelga para abajo desde la coronilla, a rayas, con el pompón. */
function gorro(): string {
  const [gx, gy] = A.coronilla;
  const d = curva([[gx - 16, gy - 8], [gx + 16, gy - 8], [gx + 14, gy + 10], [gx + 8, gy + 34], [gx - 2, gy + 56], [gx - 6, gy + 54], [gx - 6, gy + 30], [gx - 14, gy + 8]]);
  const rayas = [gy + 4, gy + 18, gy + 32, gy + 46].map((y) => forma(caja(gx - 20, y, 40, 5), C.azulHondo, 0.85)).join('');
  return conGrano(
    enmascarado('m-col-gorro', d, forma(d, C.naranja) + rayas + nube(gx - 8, gy + 10, 6, 20, C.naranjaClara, 's', 0.6) + nube(gx + 8, gy + 20, 6, 20, C.ocreHondo, 's', 0.6)) +
    forma(elipse(gx - 4, gy + 58, 7, 7), C.una) + nube(gx - 6, gy + 56, 3, 3, C.una, 'xs') + nube(gx - 2, gy + 61, 4, 3, C.tiza, 's', 0.5),
  );
}

/* ------------------------------------------------------------------
   El temor: el carozo almibarado, sentado en el dedo, con moño
   ------------------------------------------------------------------ */

function carozo(): string {
  const [kx, ky] = A.carozo;
  const d = curva([[kx, ky - 11], [kx + 7, ky - 7], [kx + 8, ky + 3], [kx + 3, ky + 10], [kx - 3, ky + 10], [kx - 8, ky + 3], [kx - 7, ky - 7]]);
  // Las arrugas del carozo de durazno, y el almíbar que lo baña y le brilla.
  const arrugas = [[-4, -6, 2, -2], [3, -4, 5, 2], [-5, 1, -1, 5], [1, 4, 4, 7], [-2, -9, 1, -6]].map(([a, b, c, e]) => trazo(`M${kx + a!} ${ky + b!} Q${kx + (a! + c!) / 2 + 1} ${ky + (b! + e!) / 2} ${kx + c!} ${ky + e!}`, C.ocreHondo, 0.9, 0.8)).join('');
  const ojitos = [-1, 1].map((s) => forma(elipse(kx + s * 2.6, ky - 2, 1.8, 2), C.una) + forma(elipse(kx + s * 2.6, ky - 1.6, 0.9, 1.1), C.tinta)).join('');
  // El moño: es elegante.
  const mono = forma(poli([[kx, ky + 4], [kx - 4, ky + 2], [kx - 4, ky + 6]]), C.tinta) + forma(poli([[kx, ky + 4], [kx + 4, ky + 2], [kx + 4, ky + 6]]), C.tinta) + forma(elipse(kx, ky + 4, 1, 1), C.tinta);
  return conGrano(
    enmascarado('m-col-carozo', d, forma(d, C.ocre) + nube(kx + 4, ky + 5, 6, 6, C.ocreHondo, 's', 0.7) + arrugas + nube(kx - 2, ky - 4, 5, 6, C.naranjaClara, 's', 0.55) + nube(kx - 3, ky - 6, 1.6, 2.4, C.una, 'xs', 0.95) + nube(kx + 4, ky + 2, 1, 1.6, C.una, 'xs', 0.7)) +
    ojitos + mono +
    // Las patitas, sentado en la punta del dedo.
    trazo(`M${kx - 2} ${ky + 10} l-1 3 M${kx + 2} ${ky + 10} l1 3`, C.ocreHondo, 0.9),
  );
}

/** La gota de almíbar que se le cae al temor. */
function gota(): string {
  const [kx, ky] = A.carozo;
  return forma(`M${kx + 3} ${ky + 10} Q${kx + 6} ${ky + 15} ${kx + 3} ${ky + 17} Q${kx} ${ky + 15} ${kx + 3} ${ky + 10} Z`, C.naranjaClara) + nube(kx + 2.4, ky + 14, 0.7, 1, C.una, 'xs', 0.9);
}

/* ------------------------------------------------------------------
   El sueño, dibujado con la tiza de la contratapa
   ------------------------------------------------------------------ */

/** Una raya de tiza: tres pasadas corridas, que no tapan del todo. */
const tiza = (d: string, color: string, ancho: number): string =>
  `<g filter="url(#xerox-fino)">${trazo(d, color, ancho, 0.85)}<g transform="translate(0.8 0.6)">${trazo(d, color, ancho * 0.6, 0.5)}</g><g transform="translate(-0.6 0.9)">${trazo(d, color, ancho * 0.4, 0.4)}</g></g>`;

function sueno(): string {
  const { centro: [cx, cy], rx, ry } = A.sueno;
  const pts: P[] = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const r = i % 2 ? 1 : 1.14;
    return [cx + Math.cos(a) * rx * r * 0.9, cy + Math.sin(a) * ry * r * 0.9];
  });
  const nubeD = curva(pts);
  // Las burbujas que lo atan a la cabeza.
  const burbujas = [[24, 180, 3], [36, 188, 4.5], [50, 194, 6]].map(([x, y, r]) => forma(elipse(x!, y!, r!, r!), C.azulHondo, 0.9) + tiza(elipse(x!, y!, r!, r!), C.tiza, 1)).join('');
  return burbujas + forma(nubeD, C.azulHondo, 0.92) + nube(cx - rx * 0.3, cy - ry * 0.3, rx * 0.5, ry * 0.4, C.azul, 'l', 0.6) + tiza(nubeD, C.tiza, 1.8) + tiza(curva(pts.map(([x, y]) => [cx + (x - cx) * 0.86, cy + (y - cy) * 0.86] as P)), C.azulClaro, 1);
}

/** Un angelito muy profesional, de los que van al grano: alitas, sombrero y metralleta. Mira a la derecha. */
function angelito(): string {
  const cabeza = elipse(0, -6, 6, 6);
  const cuerpo = curva([[-5, 0], [5, 0], [6, 10], [0, 13], [-6, 10]]);
  const alita = curva([[-4, -2], [-14, -10], [-16, -2], [-12, 4], [-6, 4]]);
  const sombrero = `M-8 -10 L8 -10 M-5 -10 L-4 -16 L4 -16 L5 -10`;
  const metralleta = `M3 4 L16 2 M8 3 L8 8 M12 2.4 L13 7 M16 2 L16 4`;
  return (
    forma(alita, C.una, 0.85) + tiza(alita, C.tiza, 0.8) +
    forma(cuerpo, C.tiza, 0.9) + tiza(cuerpo, C.una, 0.9) +
    forma(cabeza, C.una, 0.95) + tiza(cabeza, C.tiza, 0.7) +
    forma(caja(-5, -16, 10, 6), C.tinta) + tiza(sombrero, C.una, 1.4) +
    tiza(metralleta, C.una, 1.6) + forma(elipse(2, -6, 0.9, 1), C.tinta)
  );
}

/** El fogonazo de la metralleta. */
function tiro(): string {
  return nube(19, 2, 5, 4, C.naranjaClara, 's', 0.9) + forma(poli([[16, 2], [24, -1], [20, 2], [24, 5]]), C.una);
}

/** El sueño reventado: rayas de tiza para todos lados. */
function pop(): string {
  const { centro: [cx, cy], rx } = A.sueno;
  return Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2 + 0.2;
    const [r0, r1] = [rx * 0.7, rx * (1.1 + (i % 3) * 0.12)];
    return tiza(`M${cx + Math.cos(a) * r0} ${cy + Math.sin(a) * r0 * 0.8} L${cx + Math.cos(a) * r1} ${cy + Math.sin(a) * r1 * 0.8}`, i % 2 ? C.tiza : C.una, 2);
  }).join('');
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.4;
const { centro: [SX, SY], rx: SRX, ry: SRY } = A.sueno;
const [KX, KY] = A.carozo;

export const PIEZAS_COLGADO: readonly Pieza[] = [
  { nombre: 'colgado-piernas', caja: [-72, -60, 140, 104], dibujo: piernas(), densidad: D },
  { nombre: 'colgado-ala-1', caja: [A.hombros[0][0] - 36, A.hombros[0][1] - 36, 52, 110], dibujo: ala(0), densidad: D },
  { nombre: 'colgado-ala-2', caja: [A.hombros[1][0] - 16, A.hombros[1][1] - 36, 52, 110], dibujo: ala(1), densidad: D },
  { nombre: 'colgado-cuerpo', caja: [-34, -8, 68, 160], dibujo: cuerpo(), densidad: D },
  { nombre: 'colgado-cabeza', caja: [-22, 140, 44, 56], dibujo: cabeza(), densidad: D * 1.3 },
  { nombre: 'colgado-dormido', caja: [-16, 168, 32, 14], dibujo: dormido(), densidad: D * 2 },
  { nombre: 'colgado-ojos', caja: [-16, 170, 32, 16], dibujo: ojos(), densidad: D * 2 },
  { nombre: 'colgado-boca', caja: [-8, 146, 16, 10], dibujo: bocaAbierta(), densidad: D * 2 },
  { nombre: 'colgado-gorro', caja: [A.coronilla[0] - 22, A.coronilla[1] - 12, 44, 80], dibujo: gorro(), densidad: D },
  { nombre: 'colgado-carozo', caja: [KX - 10, KY - 13, 20, 28], dibujo: carozo(), densidad: D * 2 },
  { nombre: 'colgado-gota', caja: [KX - 1, KY + 8, 10, 11], dibujo: gota(), densidad: D * 2 },
  { nombre: 'colgado-sueno', caja: [16, SY - SRY * 1.2, SX + SRX * 1.15 - 16, SRY * 2.4], dibujo: sueno(), densidad: 2.4 },
  { nombre: 'colgado-angelito', caja: [-20, -20, 40, 36], dibujo: angelito(), densidad: 3 },
  { nombre: 'colgado-tiro', caja: [12, -6, 16, 14], dibujo: tiro(), densidad: 3 },
  { nombre: 'colgado-pop', caja: [SX - SRX * 1.5, SY - SRY * 1.5, SRX * 3, SRY * 3], dibujo: pop(), densidad: 1.6 },
];

const img = imagenesDe(PIEZAS_COLGADO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El colgado armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const angelitos = [1, 2].map((i) => parte(`angelito-${i}`, img('colgado-angelito') + parte(`tiro-${i}`, img('colgado-tiro'), '', o[`tiro-${i}`]), t[`angelito-${i}`])).join('');
  return (
    parte('hamaca',
      parte('ala-1', img('colgado-ala-1'), t['ala-1']) +
      parte('ala-2', img('colgado-ala-2'), t['ala-2']) +
      img('colgado-cuerpo') +
      parte('carozo', img('colgado-carozo') + parte('gota', img('colgado-gota'), t.gota, o.gota), t.carozo) +
      parte('cabeza',
        parte('gorro', img('colgado-gorro'), t.gorro) +
        img('colgado-cabeza') +
        parte('dormido', img('colgado-dormido'), '', o.dormido) +
        parte('ojos', img('colgado-ojos'), '', o.ojos) +
        parte('boca', img('colgado-boca'), '', o.boca),
        t.cabeza) +
      parte('sueno', img('colgado-sueno') + angelitos, t.sueno, o.sueno) +
      parte('pop', img('colgado-pop'), t.pop, o.pop),
      t.hamaca) +
    // Las piernas van arriba de la rama, encima de todo lo que cuelga.
    img('colgado-piernas')
  );
}

/** El colgado en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function colgadoEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: dormido cabeza abajo, soñando. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--colgado" data-id="el-que-duerme-colgado" role="button" tabindex="0" aria-label="${nombres.get('el-que-duerme-colgado') ?? 'El que duerme colgado'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: despierto de golpe, con el saco abierto y el temor saltando del dedo. */
export const RETRATO = { caja: [COLGADO.x - 70, COLGADO.rama - 40, 150, 170] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('arbol-lejos') + fondo('arbol-piso') + colgadoEn(LEVANTARSE);
}

export const COLGADO_PERSONAJE: Personaje = {
  id: 'el-que-duerme-colgado',
  region: 'el-arbol',
  ancla: COLGADO.x,
  piezas: PIEZAS_COLGADO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
