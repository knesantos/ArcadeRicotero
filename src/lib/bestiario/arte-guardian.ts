/**
 * El ángel guardián más tonto (`D-73`, vigesimonovena vuelta), al pie del árbol, al lado del que duerme colgado.
 *
 * *"Sin darte cuenta ahí estás / con tu cara de colgado / tu ángel guardián es de todos el más tonto que hay"* es de
 * *La dicha no es una cosa alegre*, en *Luzbelito* (1996). Se toma al pie de la letra: **guarda, y guarda mal**. Tiene
 * tendida una lona de rescate de bomberos, con su diana, para atajar al que cuelga… un metro corrida de donde hace
 * falta: debajo de la misma rama soldada, pero del tramo donde no cuelga nadie. A ese tramo le clava la vista, con la
 * cabeza para atrás, de espaldas al colgado (*"con tu cara de colgado"*), que duerme al lado. Del mismo tema: *"incombustible no sos"* (el
 * casco de bombero, que le queda grande), *"refugiado en tu soledad"* (está solo sosteniendo una lona que es para
 * varios: la otra punta se la tiene una estaca) y *"mientras la vida pasa / sin darte cuenta"* (todo lo que le pasa, le
 * pasa por arriba). Tocado, le cae un nido entero en el casco y le apaga la vela; recién ahí levanta la lona y se tapa
 * con ella, tarde.
 *
 * De la letra son el guardián, lo tonto, el colgado de al lado y el casco. Del dibujo son la lona con la diana, las
 * estacas, el nido, las medias con sandalias y las alas chicas.
 *
 * Viste *Luzbelito*, medido con sharp: la túnica y las alas son el yeso del busto de la tapa y la cara es ese busto
 * bajo la vela; **el cabo de vela prendido arriba del casco es el del busto**, que lo lleva en la cabeza; el casco es
 * el cobre del marco y la aureola su dorado; la lona es el papel marmolado, con sus vetas. La tapa no tiene rojo: la
 * diana va en cobre y yeso (`--bestia-guardian-*`).
 *
 * No se parece al ángel de la soledad (sepia, adulto, envuelto en las alas) ni al angelito frito (un nene chamuscado,
 * sentado): es largo, flaco, de cogote y nariz, con uniforme.
 *
 * Coordenadas: el (0, 0) es la tierra entre los pies (`rig-guardian.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, poli } from './trazos.ts';
import { GUARDIAN, GUARDIAN_ARMADO as A, QUIETO, TARDE, marcas, type Momento } from './rig-guardian.ts';

const ID = 'el-angel-guardian';

/** Las tintas de *Luzbelito* (`tokens.css`). */
const C = {
  hueso: 'var(--bestia-guardian-hueso)',
  huesoClaro: 'var(--bestia-guardian-hueso-claro)',
  pliegue: 'var(--bestia-guardian-pliegue)',
  piel: 'var(--bestia-guardian-piel)',
  pielHonda: 'var(--bestia-guardian-piel-honda)',
  pielSombra: 'var(--bestia-guardian-piel-sombra)',
  oro: 'var(--bestia-guardian-oro)',
  oroClaro: 'var(--bestia-guardian-oro-claro)',
  cobre: 'var(--bestia-guardian-cobre)',
  oxido: 'var(--bestia-guardian-oxido)',
  marmol: 'var(--bestia-guardian-marmol)',
  marmolClaro: 'var(--bestia-guardian-marmol-claro)',
  veta: 'var(--bestia-guardian-veta)',
  negro: 'var(--bestia-guardian-negro)',
  sombra: 'var(--bestia-guardian-sombra)',
  llama: 'var(--bestia-guardian-llama)',
  llamaClara: 'var(--bestia-guardian-llama-clara)',
};

/* ------------------------------------------------------------------
   La estaca y la percha: lo que no se mueve
   ------------------------------------------------------------------ */

/**
 * La percha vacía, colgada del tramo de la rama soldada donde no cuelga nadie: de madera, con su gancho de alambre.
 * Es lo que él mira. El gancho es `A.percha`.
 */
function percha(): string {
  const [x, y] = A.percha;
  const palo = `M${x - 30} ${y + 34} Q${x - 16} ${y + 20} ${x} ${y + 18} Q${x + 16} ${y + 20} ${x + 30} ${y + 34} L${x + 26} ${y + 39} Q${x + 14} ${y + 28} ${x} ${y + 26} Q${x - 14} ${y + 28} ${x - 26} ${y + 39} Z`;
  return conGrano(
    `<path d="M${x} ${y + 20} L${x} ${y + 10} Q${x + 9} ${y + 6} ${x + 6} ${y - 2} Q${x} ${y - 9} ${x - 6} ${y - 1}" fill="none" stroke="${C.veta}" stroke-width="2" stroke-linecap="round"/>` +
    enmascarado('m-guardian-percha', palo, forma(palo, C.oxido) + nube(x - 10, y + 22, 14, 2.4, C.oro, 'xs', 0.6) + nube(x + 16, y + 32, 12, 3, C.sombra, 'xs', 0.7)) +
    trazo(`M${x - 26} ${y + 39} L${x + 26} ${y + 39}`, C.oxido, 2.4) + trazo(`M${x - 24} ${y + 38} L${x + 6} ${y + 38}`, C.oro, 0.7, 0.6),
  );
}

/** La estaca que le tiene la otra punta de la lona, clavada torcida al pie del tronco, con su atadura. */
function estaca(): string {
  const [x, y] = A.estaca;
  const d = poli([[x - 4, y - 26], [x + 4, y - 28], [x + 9, y + 6], [x + 1, y + 6]]);
  return conGrano(
    nube(x + 6, y + 6, 14, 3, C.negro, 'xs', 0.7) +
    enmascarado('m-guardian-estaca', d, forma(d, C.oxido) + nube(x + 7, y - 10, 3, 16, C.sombra, 'xs', 0.8) + nube(x - 2, y - 12, 1.6, 14, C.oro, 'xs', 0.4)) +
    // La cabeza astillada de tanto mazazo, y la soga que le tiene la punta de la lona, con dos vueltas y el nudo.
    forma(poli([[x - 5, y - 26], [x - 2, y - 33], [x + 1, y - 28], [x + 5, y - 28]]), C.oxido) +
    trazo(`M${x - 4} ${y - 14} L${x + 6} ${y - 16} M${x - 3.6} ${y - 10} L${x + 6.6} ${y - 12}`, C.huesoClaro, 2) + forma(elipse(x + 7, y - 13, 2.6, 2.6), C.hueso) +
    trazo(`M${x - 3} ${y - 12} Q${x - 9} ${y - 8} ${x - 14} ${y - 9}`, C.huesoClaro, 1.6),
  );
}

/* ------------------------------------------------------------------
   El cuerpo: la túnica corta, las medias con sandalias
   ------------------------------------------------------------------ */

function cuerpo(): string {
  const tunica = curva([[-25, -154], [0, -158], [25, -154], [30, -110], [36, -60], [41, -36], [28, -30], [14, -35], [0, -30], [-14, -35], [-28, -30], [-41, -36], [-36, -60], [-30, -110]]);
  const pierna = (s: -1 | 1): string => {
    const media = poli([[s * 9, -36], [s * 19, -36], [s * 19, -8], [s * 11, -8]]);
    const pie = curva([[s * 8, -9], [s * 20, -10], [s * 34, -5], [s * 35, 0], [s * 8, 0]]);
    return (
      // La media, blanca y arrugada, y la sandalia arriba: dos tiras y la suela.
      enmascarado(`m-guardian-media-${s}`, media, forma(media, C.huesoClaro) + nube(s * 18, -22, 3, 14, C.pliegue, 'xs', 0.35) + trazo(`M${s * 9} -30 l${s * 10} 0 M${s * 9} -25 l${s * 10} 1 M${s * 9} -19 l${s * 10} -1`, C.pliegue, 0.8, 0.5)) +
      enmascarado(`m-guardian-pie-${s}`, pie, forma(pie, C.huesoClaro) + nube(s * 26, -1, 9, 3, C.pliegue, 'xs', 0.4)) +
      trazo(`M${s * 12} -9 Q${s * 18} -3 ${s * 16} 0 M${s * 22} -9 Q${s * 28} -4 ${s * 27} 0`, C.pielSombra, 2.6) + trazo(`M${s * 7} 0.6 L${s * 36} 0.6`, C.sombra, 2.4)
    );
  };
  return conGrano(
    nube(0, 1, 44, 4, C.negro, 's', 0.7) +
    pierna(-1) + pierna(1) +
    enmascarado('m-guardian-tunica', tunica,
      forma(tunica, C.hueso) + nube(-22, -90, 9, 60, C.huesoClaro, 's', 0.7) + nube(26, -80, 11, 60, C.pliegue, 's', 0.42) + nube(0, -34, 44, 8, C.pliegue, 's', 0.36) +
      // Los pliegues, que caen del cinto, y el cuello de la túnica.
      trazo('M-14 -98 Q-18 -64 -20 -34 M-2 -98 Q-2 -64 0 -32 M12 -98 Q16 -64 20 -34 M24 -100 Q30 -70 34 -40', C.pliegue, 1.2, 0.5) +
      trazo('M-12 -156 Q0 -144 12 -156', C.pliegue, 1.6, 0.6)) +
    // El cinto de soga, con el nudo y las dos puntas, y el silbato colgado del cuello.
    trazo('M-30 -103 Q0 -96 30 -103', C.oxido, 4) + trazo('M-30 -104.4 Q0 -97.4 30 -104.4', C.oro, 1, 0.6) + forma(elipse(-8, -100, 4, 3.4), C.oxido) + trazo('M-9 -98 Q-13 -86 -10 -76 M-6 -98 Q-4 -88 -5 -80', C.oxido, 2.4) +
    trazo('M-9 -154 Q4 -128 12 -122', C.sombra, 1) + forma(poli([[9, -125], [21, -121], [20, -115], [8, -119]]), C.cobre) + forma(elipse(21, -118, 3.4, 3.4), C.cobre) + forma(elipse(21, -118, 1.4, 1.4), C.negro),
  );
}

/** Un ala, la de la derecha: chica para el cuerpo que tiene, con tres filas de plumas. La raíz es el (0, 0). */
function ala(): string {
  const d = curva([[0, 4], [6, -24], [28, -46], [56, -52], [70, -40], [64, -22], [52, -8], [36, 4], [16, 12]]);
  const fila = (y: number, desde: number, hasta: number, n: number): string => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = desde + ((hasta - desde) * i) / (n - 1);
      s += `M${x - 6} ${y - i * 2.4} q4 9 9 2 `;
    }
    return s;
  };
  return conGrano(
    enmascarado('m-guardian-ala', d,
      forma(d, C.huesoClaro) + nube(40, -4, 26, 10, C.hueso, 's', 0.9) + nube(52, -10, 16, 10, C.pliegue, 's', 0.3) +
      trazo(fila(-10, 16, 54, 5), C.pliegue, 1, 0.55) + trazo(fila(-22, 20, 60, 5), C.pliegue, 1, 0.5) + trazo(fila(-34, 30, 64, 4), C.pliegue, 1, 0.45)) +
    // El canto de las plumas largas, serruchado, y el huesito del hombro.
    trazo('M70 -40 l-4 6 l5 3 l-6 5 l4 4 l-7 4 l3 5 l-8 3 l2 5 l-9 3', C.pliegue, 1.1, 0.7) + trazo('M2 0 Q10 -24 30 -44', C.pliegue, 1.4, 0.5),
  );
}

/** Un brazo: la manga ancha, del hombro (0, 0) para abajo, y la mano, que agarra. */
function brazo(): string {
  const L = A.brazo;
  const manga = curva([[-7, -2], [7, -2], [10, L - 24], [11, L - 16], [-11, L - 16], [-10, L - 24]]);
  const mano = curva([[-5, L - 17], [5, L - 17], [7, L - 6], [5, L + 3], [-4, L + 3], [-7, L - 6]]);
  return conGrano(
    // La mano es de yeso, como la cara: larga, de dedos juntos.
    enmascarado('m-guardian-mano', mano, forma(mano, C.hueso) + nube(5, L - 4, 4, 8, C.pliegue, 'xs', 0.35) + nube(-4, L - 8, 3, 6, C.huesoClaro, 'xs', 0.7) + trazo(`M-3 ${L - 4} l0 6 M0 ${L - 3} l0 6 M3 ${L - 4} l0 6`, C.pliegue, 0.8, 0.6)) +
    enmascarado('m-guardian-manga', manga, forma(manga, C.hueso) + nube(-5, L / 2, 4, L / 2, C.huesoClaro, 'xs', 0.7) + nube(8, L / 2, 5, L / 2, C.pliegue, 's', 0.4) + trazo(`M-2 10 Q0 ${L / 2} 2 ${L - 22}`, C.pliegue, 1, 0.45)) +
    trazo(`M-11 ${L - 16} L11 ${L - 16}`, C.pliegue, 1.6, 0.7),
  );
}

/* ------------------------------------------------------------------
   La cabeza: el cogote largo, la nariz, el casco que le queda grande
   ------------------------------------------------------------------ */

/**
 * La cabeza, mirando para la derecha, con la base del cogote en el (0, 0): la escena la echa para atrás. No es un
 * muñeco: es el busto de yeso de la tapa, a aerógrafo. El cogote de pollo, la cara larga y lisa, la nariz de estatua,
 * los ojos de vidrio con el párpado a media asta, la boca que le quedó abierta, y el casco de bombero de cobre: la
 * cresta alta de atrás para adelante, el ala larga hasta la nuca, el escudo en la frente y el cabo de vela arriba.
 */
function cabeza(): string {
  const cogote = curva([[-7, 8], [-7, -14], [-5, -30], [-5, -46], [6, -46], [6, -30], [5, -16], [7, 8]]);
  const cara = curva([[-14, -58], [-13, -78], [-3, -90], [9, -89], [16, -81], [18, -73], [22, -64], [27, -56], [21, -52], [21, -48], [19, -37], [14, -30], [3, -32], [-10, -40], [-14, -50]]);
  const casco = curva([[-19, -74], [-21, -90], [-13, -104], [2, -108], [15, -102], [21, -88], [20, -77], [5, -81], [-8, -79]]);
  const nuca = curva([[-14, -84], [-27, -80], [-39, -68], [-48, -50], [-49, -38], [-40, -40], [-33, -54], [-22, -68], [-12, -75]]);
  const pico = curva([[15, -81], [22, -80], [24.6, -77], [20, -76], [15, -77]]);
  const cresta = curva([[-23, -82], [-22, -98], [-13, -111], [-1, -116], [10, -112], [17, -102], [12, -98], [3, -105], [-8, -104], [-16, -92]]);
  const [kx, ky] = A.casco;
  const ojo = (x: number, y: number, rx: number, ry: number): string => {
    const almendra = `M${x - rx} ${y} Q${x} ${y - ry * 1.5} ${x + rx} ${y} Q${x} ${y + ry * 1.3} ${x - rx} ${y} Z`;
    return (
      // La ojera, soplada, y el ojo de vidrio: el iris pálido, la pupila chica, un brillo duro.
      nube(x, y + ry * 0.9, rx * 1.2, ry, C.pielSombra, 'xs', 0.4) +
      enmascarado(`m-guardian-ojo-${Math.round(x)}`, almendra, forma(almendra, C.huesoClaro) + forma(elipse(x + rx * 0.2, y - ry * 0.1, rx * 0.46, rx * 0.46), C.veta) + forma(elipse(x + rx * 0.2, y - ry * 0.1, rx * 0.18, rx * 0.18), C.negro) +
        // El párpado de arriba, caído hasta la mitad.
        forma(`M${x - rx - 1} ${y - ry * 2} L${x + rx + 1} ${y - ry * 2} L${x + rx + 1} ${y - ry * 0.16} L${x - rx - 1} ${y - ry * 0.06} Z`, C.hueso) + nube(x, y - ry * 0.5, rx, ry * 0.4, C.pliegue, 'xs', 0.3)) +
      trazo(`M${x - rx} ${y - ry * 0.06} L${x + rx} ${y - ry * 0.16}`, C.sombra, 1.1) + trazo(`M${x - rx} ${y} Q${x} ${y + ry * 1.3} ${x + rx} ${y}`, C.pliegue, 0.7, 0.7) +
      forma(elipse(x + rx * 0.02, y + ry * 0.22, 0.7, 0.7), C.huesoClaro)
    );
  };
  return conGrano(
    // El cogote de pollo: largo, flaco, con sus arrugas y la nuez.
    enmascarado('m-guardian-cogote', cogote, forma(cogote, C.hueso) + nube(-5, -18, 3, 26, C.pliegue, 'xs', 0.4) + nube(4, -40, 6, 5, C.pliegue, 'xs', 0.5) + nube(2, -10, 2, 22, C.huesoClaro, 'xs', 0.6) +
      trazo('M-6 -8 q6 2 12 0 M-6 -17 q6 2 11 0 M-5 -26 q5 2 10 0 M-5 -34 q5 1.6 10 0', C.pliegue, 0.8, 0.55)) +
    forma(elipse(6.4, -22, 2.6, 4), C.hueso) + nube(7.4, -21, 1.6, 3, C.pliegue, 'xs', 0.5) +
    // La oreja, larga, pegada.
    forma(curva([[-9, -67], [-16, -71], [-18, -56], [-11, -50]]), C.hueso) + trazo('M-14 -66 q-2 6 1 11', C.pliegue, 1, 0.7) +
    // La cara: larga y lisa, de yeso, con el volumen soplado. No sonríe: la boca le quedó abierta.
    enmascarado('m-guardian-cara', cara,
      forma(cara, C.hueso) + nube(-9, -52, 8, 22, C.pliegue, 's', 0.36) + nube(3, -45, 9, 9, C.pliegue, 's', 0.3) + nube(10, -33, 12, 4, C.pliegue, 's', 0.4) + nube(12, -79, 12, 4, C.pliegue, 's', 0.34) +
      nube(8, -58, 5, 4, C.huesoClaro, 's', 0.8) + nube(21, -62, 3, 9, C.huesoClaro, 'xs', 0.85) + nube(4, -84, 9, 3, C.huesoClaro, 'xs', 0.6)) +
    // La nariz, recta y larga, de estatua, con su ollar.
    trazo('M17 -73 L26 -57 Q24 -52 20 -52', C.pliegue, 0.9, 0.7) + forma(elipse(22.6, -54.4, 1.3, 0.9), C.sombra) +
    // La boca abierta, floja, con el labio de abajo caído y un diente solo.
    forma(curva([[13, -46], [20, -47.4], [21, -43], [19, -37.6], [13, -39]]), C.negro) + forma(curva([[14, -40.4], [19, -39.4], [19.6, -36.6], [14, -37.6]]), C.pielSombra) + forma(poli([[16.4, -46.6], [19, -47], [19, -44], [16.6, -44]]), C.huesoClaro) +
    trazo('M12 -46.4 Q16 -48.6 21 -47.6', C.pliegue, 1, 0.8) + trazo('M12.6 -38 Q16 -35.4 20 -36.4', C.pliegue, 1.2, 0.9) +
    ojo(9, -68, 6.4, 3.6) + ojo(18.4, -69.6, 3, 3) +
    // El casco de bombero: el ala larga de atrás hasta la nuca, el pico corto, la copa, y la cresta alta de atrás para adelante.
    // El ala de atrás: larga, cae sobre la nuca y se abre, con su filete.
    enmascarado('m-guardian-nuca', nuca, forma(nuca, C.cobre) + nube(-40, -50, 7, 14, C.oxido, 'xs', 0.85) + nube(-26, -76, 9, 3, C.oro, 'xs', 0.6) + trazo('M-20 -76 Q-34 -64 -42 -44 M-27 -78 Q-40 -66 -46 -46', C.oxido, 0.9, 0.7)) + trazo('M-49 -38 Q-44 -37 -40 -40', C.oro, 1.6) + trazo('M-14 -84.6 Q-28 -81 -39 -69 Q-47 -56 -49.6 -39', C.oro, 1.1, 0.85) +
    enmascarado('m-guardian-pico', pico, forma(pico, C.cobre) + nube(21, -76.6, 4, 1.2, C.oxido, 'xs', 0.8)) + trazo('M15 -81.4 Q22 -81 24.6 -77', C.oro, 1, 0.85) +
    enmascarado('m-guardian-casco', casco, forma(casco, C.cobre) + nube(-14, -88, 6, 13, C.oxido, 's', 0.75) + nube(6, -100, 8, 4, C.oro, 's', 0.6) + nube(2, -80, 20, 2.4, C.oxido, 'xs', 0.7) +
      // Los gajos de la copa.
      trazo('M-12 -103 Q-15 -90 -12 -79 M-3 -107 Q-5 -92 -3 -80 M6 -107 Q8 -92 6 -81', C.oxido, 1, 0.7)) +
    trazo('M-19 -75 Q0 -83 20 -79', C.oro, 2.4) +
    // La cresta: un peine alto de bronce, de la nuca a la frente, con el canto ondulado.
    enmascarado('m-guardian-cresta', cresta, forma(cresta, C.oro) + nube(-12, -98, 10, 5, C.oxido, 'xs', 0.6) + nube(0, -114, 10, 1.6, C.llamaClara, 'xs', 0.7)) +
    trazo('M-23 -82 Q-22 -98 -13 -111 Q-1 -117 10 -112 Q15 -108 17 -102', C.oxido, 1.6) + trazo('M-19 -90 l6 -3 M-15 -100 l6 -3 M-8 -107 l5 -2 M0 -109 l5 0 M7 -107 l5 3', C.oxido, 1.1, 0.8) +
    // El escudo de adelante, parado sobre la frente.
    forma(poli([[8, -103], [16, -110], [24, -102], [25.6, -86], [16, -76], [7, -83]]), C.oxido) + forma(poli([[9.6, -101.6], [16, -107.4], [22.4, -101], [23.6, -87], [16, -79], [8.8, -84.6]]), C.oro) + forma(elipse(16, -92, 4.2, 5.6), C.cobre) + trazo('M13.6 -95 L18.4 -89 M18.4 -95 L13.6 -89', C.oro, 1.1) +
    // El cabo de vela, pegado con su propia cera en lo alto de la cresta: es el del busto de la tapa.
    forma(curva([[kx - 6, ky + 2], [kx - 3, ky - 2], [kx + 3, ky - 2], [kx + 7, ky + 3], [kx + 2, ky + 5], [kx - 3, ky + 4]]), C.huesoClaro) +
    forma(poli([[kx - 3, ky], [kx + 3, ky], [kx + 2.6, ky - 11], [kx - 2.6, ky - 11]]), C.huesoClaro) + nube(kx + 1.6, ky - 5, 1.4, 5, C.hueso, 'xs', 0.8) + forma(elipse(kx - 3, ky - 6, 1.3, 2.4), C.huesoClaro) + trazo(`M${kx} ${ky - 11} l0 -3`, C.negro, 1),
  );
}

/** Los párpados, cerrados sobre los dos ojos. */
function parpados(): string {
  const uno = (x: number, y: number, rx: number, ry: number): string =>
    forma(`M${x - rx} ${y} Q${x} ${y - ry * 1.5} ${x + rx} ${y} Q${x} ${y + ry * 1.3} ${x - rx} ${y} Z`, C.hueso) + trazo(`M${x - rx} ${y} Q${x} ${y + ry * 1.3} ${x + rx} ${y}`, C.sombra, 1.1);
  return conGrano(uno(9, -68, 6.4, 3.6) + uno(18.4, -69.6, 3, 3));
}

/** La boca del bostezo: un hueco grande, con la lengua y los dos dientes. El medio es el (0, 0). */
function bocaza(): string {
  const d = curva([[-7, -7], [0, -10], [6, -7], [8, 4], [3, 13], [-5, 12], [-8, 3]]);
  return conGrano(enmascarado('m-guardian-bocaza', d, forma(d, C.negro) + forma(elipse(0, 9, 6, 4.6), C.pielSombra) + forma(poli([[1, -10], [5, -9], [5, -4], [1, -5]]), C.huesoClaro)) + trazo(d, C.pliegue, 1, 0.9));
}

/** La llama del cabo de vela. La base es el (0, 0). */
function llama(): string {
  const d = 'M0 0 C-5 -3 -4 -9 0 -17 C4 -9 5 -3 0 0 Z';
  return nube(0, -8, 9, 11, C.llama, 's', 0.42) + forma(d, C.llama) + forma('M0 -1 C-2.4 -3 -2 -6 0 -10 C2 -6 2.4 -3 0 -1 Z', C.llamaClara);
}

/** La aureola: un aro de oro visto de costado. El medio es el (0, 0). */
function aureola(): string {
  // Tinta plana, con su canto y un brillo duro: nada soplado alrededor.
  return (
    `<ellipse cx="0" cy="0" rx="19" ry="6" fill="none" stroke="${C.oxido}" stroke-width="5.6"/>` +
    `<ellipse cx="0" cy="0" rx="19" ry="6" fill="none" stroke="${C.oro}" stroke-width="3.4"/>` +
    trazo('M-15 -3.8 Q-8 -6.6 0 -6.4', C.llamaClara, 1.3) + trazo('M9 5 Q14 3.6 17 1.4', C.cobre, 1.1, 0.9)
  );
}

/* ------------------------------------------------------------------
   La lona de rescate, con su diana, y el nido
   ------------------------------------------------------------------ */

/** La lona, tendida: redonda, de papel marmolado, con las argollas del canto y la diana en el medio. El medio es el (0, 0). */
function lona(): string {
  const { rx, ry } = A.lona;
  const arriba = elipse(0, 0, rx, ry);
  const canto = `M${-rx} 0 Q${-rx} 9 ${-rx * 0.5} ${ry + 4} Q0 ${ry + 10} ${rx * 0.5} ${ry + 4} Q${rx} 9 ${rx} 0 Q${rx * 0.5} ${ry + 1} 0 ${ry} Q${-rx * 0.5} ${ry + 1} ${-rx} 0 Z`;
  const aro = (k: number, color: string): string => forma(elipse(0, 0, rx * k, ry * k), color);
  // El anillo de manijas: lazos de soga todo alrededor, para que la tengan entre varios. La tiene él solo.
  let manijas = '';
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + 0.22;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    const [x, y] = [c * rx, s * ry];
    manijas += `M${(x - s * 5).toFixed(1)} ${(y + c * 2).toFixed(1)} Q${(x + c * 9).toFixed(1)} ${(y + s * 7 + 3).toFixed(1)} ${(x + s * 5).toFixed(1)} ${(y - c * 2).toFixed(1)} `;
  }
  return conGrano(
    trazo(manijas, C.sombra, 2.6, 0.8) + trazo(manijas, C.huesoClaro, 1.5) +
    // El canto grueso de adelante, cosido.
    enmascarado('m-guardian-canto', canto, forma(canto, C.negro) + nube(0, ry + 3, rx * 0.8, 4, C.marmol, 'xs', 0.9) + trazo(`M${-rx + 6} 7 Q0 ${ry + 11} ${rx - 6} 7`, C.veta, 0.9, 0.5)) +
    enmascarado('m-guardian-lona', arriba,
      forma(arriba, C.marmol) + nube(-22, -7, 22, 7, C.marmolClaro, 's', 0.7) + nube(26, 8, 20, 6, C.negro, 's', 0.55) +
      // Las vetas del marmolado, que se enroscan.
      trazo(`M${-rx} -3 C-34 -18 -18 5 -4 -10 S28 -18 ${rx} -5 M${-rx + 8} 10 C-30 2 -16 18 4 10 S34 5 ${rx - 4} 12`, C.veta, 1, 0.6) +
      // La diana: cobre, yeso, cobre, yeso.
      aro(0.76, C.cobre) + aro(0.57, C.huesoClaro) + aro(0.38, C.cobre) + aro(0.18, C.huesoClaro) + nube(16, 7, 22, 5, C.negro, 's', 0.26)) +
    `<ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="none" stroke="${C.veta}" stroke-width="1.6" opacity="0.85"/>`,
  );
}

/** El nido, entero: un cuenco de ramitas con tres huevos. Apoya en el (0, 0). */
function nido(): string {
  const cuenco = curva([[-22, -12], [22, -12], [20, -3], [10, 2], [-10, 2], [-20, -3]]);
  const huevo = (x: number, y: number, g: number): string =>
    `<g transform="rotate(${g} ${x} ${y})">` + forma(elipse(x, y, 5.6, 7.4), C.huesoClaro) + nube(x + 2, y + 2, 3, 4, C.hueso, 'xs', 0.9) + forma(elipse(x - 1.6, y - 2, 0.9, 0.9), C.pielHonda) + forma(elipse(x + 1.4, y + 1, 0.7, 0.7), C.pielHonda) + forma(elipse(x - 0.4, y + 3.4, 0.7, 0.7), C.pielHonda) + `</g>`;
  let ramitas = '';
  const pts: Array<readonly [number, number, number, number]> = [[-24, -12, 10, -4], [-18, -4, 20, -10], [-20, -8, 16, 0], [-10, 1, 24, -9], [-22, -14, -6, 2], [6, 2, 23, -14], [-14, -13, 14, -13], [-26, -8, -14, -16], [18, -15, 28, -8], [-4, -2, 12, -6]];
  pts.forEach(([a, b, c, d], i) => (ramitas += trazo(`M${a} ${b} L${c} ${d}`, i % 3 === 0 ? C.oxido : i % 3 === 1 ? C.sombra : C.oro, 1.5, i % 3 === 2 ? 0.6 : 1)));
  return conGrano(huevo(-9, -15, -18) + huevo(1, -17, 6) + huevo(11, -14, 24) + enmascarado('m-guardian-nido', cuenco, forma(cuenco, C.sombra) + nube(0, -2, 18, 4, C.negro, 'xs', 0.6)) + ramitas);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.2;

export const PIEZAS_GUARDIAN: readonly Pieza[] = [
  { nombre: 'guardian-percha', caja: [A.percha[0] - 34, A.percha[1] - 12, 68, 56], dibujo: percha(), densidad: D },
  { nombre: 'guardian-estaca', caja: [A.estaca[0] - 18, A.estaca[1] - 36, 36, 46], dibujo: estaca(), densidad: D },
  { nombre: 'guardian-cuerpo', caja: [-50, -164, 100, 172], dibujo: cuerpo(), densidad: D },
  { nombre: 'guardian-ala', caja: [-6, -58, 84, 76], dibujo: ala(), densidad: D },
  { nombre: 'guardian-brazo', caja: [-14, -6, 28, A.brazo + 12], dibujo: brazo(), densidad: D },
  { nombre: 'guardian-cabeza', caja: [-54, -136, 90, 148], dibujo: cabeza(), densidad: D * 1.5 },
  { nombre: 'guardian-parpados', caja: [0, -76, 24, 16], dibujo: parpados(), densidad: D * 1.5 },
  { nombre: 'guardian-bocaza', caja: [-11, -13, 22, 29], dibujo: bocaza(), densidad: D * 1.5 },
  { nombre: 'guardian-llama', caja: [-14, -24, 28, 28], dibujo: llama(), densidad: D * 1.5 },
  { nombre: 'guardian-aureola', caja: [-24, -11, 48, 22], dibujo: aureola(), densidad: D * 1.5 },
  { nombre: 'guardian-lona', caja: [-A.lona.rx - 14, -A.lona.ry - 12, A.lona.rx * 2 + 28, A.lona.ry * 2 + 30], dibujo: lona(), densidad: D },
  { nombre: 'guardian-nido', caja: [-32, -28, 64, 34], dibujo: nido(), densidad: D * 1.5 },
];

const img = imagenesDe(PIEZAS_GUARDIAN);
const parte = (nombre: string, cuerpoDe: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpoDe}</g>`;

/** El ángel armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    // La percha no es de él: queda colgada de la rama aunque él se corra.
    img('guardian-percha') +
    parte('todo',
      parte('ala-i', img('guardian-ala'), t['ala-i']) + parte('ala-d', img('guardian-ala'), t['ala-d']) +
      parte('cuerpo', img('guardian-cuerpo'), t.cuerpo) +
      parte('cabeza', img('guardian-cabeza') + parte('parpados', img('guardian-parpados'), '', o.parpados) + parte('bocaza', img('guardian-bocaza'), t.bocaza, o.bocaza) + parte('llama', img('guardian-llama'), t.llama, o.llama), t.cabeza) +
      parte('aureola', img('guardian-aureola'), t.aureola) +
      parte('brazo-i', img('guardian-brazo'), t['brazo-i']) +
      img('guardian-estaca') +
      parte('lona', img('guardian-lona'), t.lona) +
      parte('brazo-d', img('guardian-brazo'), t['brazo-d']) +
      parte('nido', img('guardian-nido'), t.nido, o.nido),
      t.todo)
  );
}

/** El ángel en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function guardianEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: la lona tendida y la vista clavada en la rama vacía. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--guardian" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El ángel guardián más tonto'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: con el nido en el casco, la vela apagada y la lona de techo, tarde. */
export const RETRATO = { caja: [GUARDIAN.x - 86, GUARDIAN.piso - 186, 140, 192] as const };
function retrato(): string {
  return `<image href="/bestiario/arbol-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/><image href="/bestiario/arbol-piso.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` + guardianEn(TARDE);
}

export const GUARDIAN_PERSONAJE: Personaje = {
  id: ID,
  region: 'el-arbol',
  ancla: GUARDIAN.x,
  piezas: PIEZAS_GUARDIAN,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
