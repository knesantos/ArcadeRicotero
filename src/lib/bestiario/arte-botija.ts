/**
 * El botija rapado (`D-73`, vigesimocuarta vuelta), en la planchada del ferry que sale de los astilleros.
 *
 * *"Pudo cruzar el charco a tiempo / ¡Zafó!"* es de *Botija rapado*, en *Lobo suelto, cordero atado* (1993).
 * Botija es pibe del otro lado del río, y el charco es el río mismo. Acá es un pibe flaco, rapado a las
 * apuradas, con las orejas despegadas y la nuca a la vista: en la nuca tiene la curita del tajito que se hizo
 * con la máquina. Muerde el boleto del ferry para tener las manos libres. Va con la remera grande de cuello
 * estirado, la bermuda deshilachada, una media caída y el cordón de una zapatilla desatado. Lleva todo lo
 * suyo en un bolso de lona con el cierre roto, atado con cinta de embalar: asoman el termo y una media. En
 * la muñeca, un reloj de plástico que mira a cada rato.
 *
 * Viste la tapa del disco dos de *Lobo suelto, cordero atado*, medida con sharp: la piel es la cara del
 * cordero, la remera la lana azul, la bermuda y las zapatillas la tinta del hocico, el bolso el naranja del
 * fondo, la correa y el termo las pezuñas, la cinta y el boleto las letras del título, el ojo el verde del
 * ojo del cordero y lo blanco sus uñas.
 *
 * Coordenadas: el (0, 0) es el piso entre los pies, y va de perfil para la derecha (`rig-botija.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { BOTIJA, BOTIJA_ARMADO as A, QUIETO, ZAFO, alRecinto, marcas, type Momento } from './rig-botija.ts';

/** Las tintas de *Lobo suelto, cordero atado* (`tokens.css`). */
const C = {
  piel: 'var(--bestia-botija-piel)',
  pielClara: 'var(--bestia-botija-piel-clara)',
  pielHonda: 'var(--bestia-botija-piel-honda)',
  azul: 'var(--bestia-botija-azul)',
  azulClaro: 'var(--bestia-botija-azul-claro)',
  azulHondo: 'var(--bestia-botija-azul-hondo)',
  tinta: 'var(--bestia-botija-tinta)',
  naranja: 'var(--bestia-botija-naranja)',
  naranjaClara: 'var(--bestia-botija-naranja-clara)',
  cuero: 'var(--bestia-botija-cuero)',
  cueroHondo: 'var(--bestia-botija-cuero-hondo)',
  marron: 'var(--bestia-botija-marron)',
  amarillo: 'var(--bestia-botija-amarillo)',
  hueso: 'var(--bestia-botija-hueso)',
  verde: 'var(--bestia-botija-verde)',
};

/* ------------------------------------------------------------------
   Las piernas: la bermuda, las canillas flacas, las medias y las zapatillas
   ------------------------------------------------------------------ */

/** El muslo con la bermuda de jean deshilachada hasta la rodilla. */
function muslo(n: 0 | 1): string {
  const [x, y] = A.ingles[n];
  const r = y + A.muslo;
  const d = curva([[x - 7.5, y - 3], [x + 7, y - 3], [x + 7.6, y + 12], [x + 7, r - 2], [x + 3, r + 1], [x - 2, r - 0.6], [x - 7.4, r + 0.6], [x - 7.8, y + 14]]);
  const hondo = n === 0;
  const flecos = Array.from({ length: 7 }, (_, i) => trazo(`M${f(x - 6 + i * 2)} ${f(r - 1 + (i % 2))} l${f(((i % 3) - 1) * 0.6)} ${f(2.4 + (i % 2) * 1.6)}`, C.hueso, 0.5, 0.6)).join('');
  return conGrano(
    enmascarado(`m-botija-muslo-${n + 1}`, d,
      forma(d, C.tinta) + nube(x - 3, y + 14, 4, 16, C.azulHondo, 's', hondo ? 0.5 : 0.9) + nube(x + 5, y + 12, 3, 14, C.marron, 's', 0.5) +
      // La costura del costado y el bolsillo de atrás, gastado.
      trazo(`M${f(x - 5)} ${f(y)} L${f(x - 4)} ${f(r - 2)}`, C.azulClaro, 0.6, 0.5) +
      trazo(`M${f(x - 6)} ${f(y + 2)} l7 0 l-1 7 l-6 0 Z`, C.azulHondo, 0.6, 0.7) +
      nube(x, r - 2, 8, 2, C.azulClaro, 's', 0.5) + (hondo ? nube(x, y + 12, 10, 20, C.tinta, 'm', 0.5) : '')) +
    flecos,
  );
}

/** La canilla flaca con la rodilla nudosa, y la media: la de acá se le cayó. */
function canilla(n: 0 | 1): string {
  const [x] = A.ingles[n];
  const k = A.ingles[n][1] + A.muslo;
  const t = k + A.canilla;
  const hondo = n === 0;
  const d = curva([[x - 3.6, k - 2], [x + 3.4, k - 3], [x + 4, k + 3], [x + 2.6, k + 14], [x + 2.4, t - 2], [x - 2.4, t - 2], [x - 2.6, k + 15], [x - 3.2, k + 4]]);
  const media = n === 1
    ? curva([[x - 3, t - 9], [x + 3, t - 10], [x + 3.6, t - 6], [x + 3.6, t + 1], [x - 3.4, t + 1], [x - 4, t - 5]])
    : curva([[x - 2.8, t - 13], [x + 2.8, t - 13], [x + 3, t + 1], [x - 3, t + 1]]);
  const pliegues = n === 1 ? [t - 8, t - 6, t - 4, t - 2].map((y, i) => trazo(`M${f(x - 3.4)} ${f(y)} q3.4 ${i % 2 ? 1.6 : -1} 7 0`, C.pielHonda, 0.6, 0.5)).join('') : trazo(`M${f(x - 2.6)} ${f(t - 11)} l5.4 0 M${f(x - 2.6)} ${f(t - 9.6)} l5.4 0`, C.naranja, 0.8, 0.8);
  return conGrano(
    enmascarado(`m-botija-canilla-${n + 1}`, d,
      forma(d, hondo ? C.pielHonda : C.piel) + nube(x - 2, k + 14, 1.6, 12, C.pielClara, 's', hondo ? 0.3 : 0.7) + nube(x + 3, k + 14, 2, 14, C.pielHonda, 's', 0.8) +
      // La rodilla nudosa, raspada.
      nube(x + 1, k + 1, 3.4, 3, C.pielClara, 's', hondo ? 0.4 : 0.9) + trazo(`M${f(x)} ${f(k + 2)} l1.4 -0.6 M${f(x - 0.4)} ${f(k + 3.2)} l1.6 -0.4`, C.naranja, 0.5, 0.7) +
      trazo(`M${f(x - 1)} ${f(k + 8)} l0.4 3 M${f(x + 1)} ${f(k + 10)} l0.3 2`, C.marron, 0.4, 0.5)) +
    enmascarado(`m-botija-media-${n + 1}`, media, forma(media, C.hueso) + nube(x + 3, t - 4, 2, 8, C.azulClaro, 's', 0.6) + pliegues + (hondo ? nube(x, t - 6, 6, 10, C.azulHondo, 'm', 0.4) : '')),
  );
}

/** La zapatilla gastada, con la suela despegada; la de acá con el cordón desatado que se arrastra. */
function zapatilla(n: 0 | 1): string {
  const [x] = A.ingles[n];
  const t = A.ingles[n][1] + A.muslo + A.canilla;
  const s = t + A.tobillo;
  const d = curva([[x - 5, t - 2], [x + 2, t - 3], [x + 6, t + 0.6], [x + 12, s - 2.6], [x + 13, s - 0.4], [x + 6, s], [x - 4, s], [x - 6, s - 2.4]]);
  const hondo = n === 0;
  const cordones = [0, 1, 2].map((i) => trazo(`M${f(x + 1 + i * 2.2)} ${f(t - 1.4 + i * 1.2)} l2.4 0.6`, C.hueso, 0.7, 0.85)).join('');
  const suelto = n === 1 ? trazo(`M${f(x + 5)} ${f(t + 1.6)} Q${f(x - 2)} ${f(s + 1)} ${f(x - 8)} ${f(s + 0.6)} Q${f(x - 12)} ${f(s + 0.2)} ${f(x - 14)} ${f(s + 1.4)}`, C.hueso, 0.7, 0.9) + forma(elipse(x - 14, s + 1.4, 0.8, 0.6), C.amarillo) : '';
  return conGrano(
    suelto +
    enmascarado(`m-botija-zapatilla-${n + 1}`, d,
      forma(d, C.tinta) + nube(x + 4, t + 1, 6, 2.4, C.azulClaro, 's', hondo ? 0.3 : 0.6) + nube(x - 3, s - 2, 4, 3, C.marron, 's', 0.6) +
      // La puntera de goma y la suela, que se despegó adelante.
      forma(`M${f(x - 6)} ${f(s - 2)} L${f(x + 12)} ${f(s - 2)} L${f(x + 13)} ${f(s)} L${f(x - 6)} ${f(s)} Z`, C.hueso, hondo ? 0.6 : 0.95) +
      forma(elipse(x + 11, s - 2.4, 2.4, 1.8), C.hueso, hondo ? 0.5 : 0.85) + (hondo ? nube(x, s - 3, 12, 6, C.tinta, 'm', 0.4) : '')) +
    trazo(`M${f(x + 6)} ${f(s)} q4 1.6 7.6 0.2`, C.tinta, 0.8, 0.8) +
    cordones,
  );
}

/* ------------------------------------------------------------------
   El cuerpo: la remera grande, la correa del bolso, el cogote
   ------------------------------------------------------------------ */

const REMERA: readonly P[] = [[-3, -110], [-10, -106], [-13, -97], [-12.6, -82], [-13.6, -66], [-12, -57], [-2, -55.6], [10, -57], [14, -63], [13.4, -80], [15, -96], [13, -105], [8, -110], [3, -107]];

function torso(): string {
  const d = curva(REMERA);
  const [, cy] = A.cadera;
  // La bermuda que asoma abajo de la remera, con el cinto de piolín.
  const bermuda = poli([[-11, cy + 2], [11, cy + 2], [11, cy + 12], [-11, cy + 12]]);
  // La correa del bolso cruza el pecho, del hombro de allá a la cadera de acá.
  const correa = `M11 -105 Q4 -88 -12 -68 L-15 -70 Q1 -90 8 -106 Z`;
  // El cogote flaco, con la nuez.
  const cogote = curva([[-1, -118], [6, -118], [8.4, -113], [9.6, -110], [7, -106], [-1, -106]]);
  return conGrano(
    enmascarado('m-botija-cogote', cogote, forma(cogote, C.piel) + nube(1, -112, 3, 6, C.pielHonda, 's', 0.9) + nube(8, -112, 1.6, 2, C.pielClara, 'xs', 0.9)) +
    enmascarado('m-botija-bermuda', bermuda, forma(bermuda, C.tinta) + nube(0, cy + 8, 12, 4, C.azulHondo, 's', 0.8) + trazo(`M-10 ${cy + 4} L10 ${cy + 4}`, C.marron, 0.8, 0.8)) +
    enmascarado('m-botija-remera', d,
      forma(d, C.azul) +
      // La lana azul de la tapa: la luz de arriba, la panza honda y los pliegues de una remera que le queda grande.
      nube(-2, -98, 10, 6, C.azulClaro, 'm', 0.9) + nube(10, -82, 4, 22, C.azulHondo, 'm', 0.9) + nube(-8, -72, 6, 14, C.azulClaro, 's', 0.4) +
      nube(0, -58, 16, 4, C.azulHondo, 'm', 0.8) +
      [-92, -84, -76].map((y, i) => trazo(`M${-11 + i} ${y} Q-4 ${y + 4 - i} 4 ${y + 1}`, C.azulHondo, 1, 0.7)).join('') +
      trazo('M-12 -62 Q0 -58 13 -62', C.azulHondo, 0.8, 0.6) +
      // El agujerito del ruedo, de tanto engancharse.
      forma(elipse(7, -61, 1.6, 1.1), C.pielHonda) + trazo('M5.6 -61.6 l-1 -0.8 M8.4 -61.4 l1 -0.6', C.azulClaro, 0.4, 0.7) +
      // El cuello estirado, que se le cae de un lado.
      trazo('M-3 -110 Q3 -103 8 -110', C.azulHondo, 2.4) + trazo('M-3 -109 Q3 -102.4 8 -109', C.azulClaro, 0.7, 0.8)) +
    enmascarado('m-botija-correa', correa, forma(correa, C.cuero) + nube(-2, -86, 3, 10, C.cueroHondo, 's', 0.8) + trazo('M10 -104.6 Q2.6 -88.6 -13 -68.6', C.cueroHondo, 0.6, 0.8)) +
    // La hebilla de la correa.
    forma(cajaRedonda(-1.4, -91, 5, 4, 0.8), C.amarillo, 0.95) + forma(cajaRedonda(0, -90, 2.2, 2, 0.4), C.cuero),
  );
}

/* ------------------------------------------------------------------
   El bolso de lona con el cierre roto, atado con cinta de embalar
   ------------------------------------------------------------------ */

function bolso(): string {
  const d = curva([[-30, -72], [-8, -73], [-5, -66], [-5, -54], [-9, -49], [-29, -49], [-33, -55], [-33, -66]]);
  // El cierre roto: los dientes que quedan, y la boca abierta del bolso.
  const dientes = Array.from({ length: 9 }, (_, i) => forma(caja2(-28 + i * 2.2, -72.6 + (i > 5 ? 1.4 : 0), 1, 1.4), C.hueso, 0.8)).join('');
  // Lo que asoma: el termo con su tapón, y una media que cuelga del costado.
  const termo = curva([[-26, -84], [-20, -84], [-19.6, -71], [-26.4, -71]]);
  const media = `M-32 -60 Q-38 -58 -37 -50 Q-36.4 -46 -39 -44 L-36 -43 Q-33 -46 -33.4 -52 Z`;
  return conGrano(
    enmascarado('m-botija-termo', termo, forma(termo, C.cueroHondo) + nube(-21, -78, 2, 8, C.cuero, 's', 0.9) + nube(-25, -80, 1.2, 4, C.hueso, 'xs', 0.6)) +
    forma(cajaRedonda(-26.6, -88, 7.6, 4.4, 1.2), C.tinta) + forma(cajaRedonda(-25.6, -87.4, 2, 2.4, 0.6), C.azulClaro, 0.6) +
    enmascarado('m-botija-bolso', d,
      forma(d, C.naranja) + nube(-26, -66, 8, 8, C.naranjaClara, 'm', 0.95) + nube(-10, -58, 6, 10, C.cueroHondo, 'm', 0.7) + nube(-20, -50, 14, 3, C.cueroHondo, 'm', 0.8) +
      // Las costuras de la lona.
      trazo('M-31 -66 Q-19 -64 -6 -66 M-31 -55 Q-19 -53 -6 -55', C.cueroHondo, 0.6, 0.6) +
      // La cinta de embalar dando dos vueltas, en cruz, con el rollo que alguien dejó colgando.
      soplo('M-28 -74 L-24 -74 L-9 -48 L-13 -48 Z', C.amarillo, 'xs', 0.95) + soplo('M-12 -74 L-8 -73 L-26 -48 L-30 -49 Z', C.amarillo, 'xs', 0.9) +
      trazo('M-27 -72 L-12 -50', C.hueso, 0.5, 0.6) + trazo('M-11 -72 L-27 -50', C.hueso, 0.5, 0.5) +
      dientes) +
    trazo('M-29 -72.4 Q-19 -74 -8 -72.8', C.cueroHondo, 1, 0.9) +
    enmascarado('m-botija-media-bolso', media, forma(media, C.hueso) + nube(-37, -48, 2, 4, C.azulClaro, 's', 0.6) + trazo('M-36.4 -52 l2.6 0.4 M-37 -49 l2.4 0.6', C.naranja, 0.7, 0.8)) +
    // El pedazo de cinta suelto que flamea.
    forma('M-8 -48 L-5 -48 L-2 -40 L-4 -41 L-6 -39 Z', C.amarillo, 0.95),
  );
}
const caja2 = (x: number, y: number, w: number, h: number): string => `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;

/* ------------------------------------------------------------------
   Los brazos, con el reloj de plástico en la muñeca de acá
   ------------------------------------------------------------------ */

function brazo(n: 0 | 1): string {
  const [x, y] = A.hombros[n];
  const c = y + A.brazo;
  const hondo = n === 0;
  const manga = curva([[x - 5, y - 3], [x + 5, y - 3], [x + 5.6, y + 8], [x + 4.6, y + 11], [x - 4.6, y + 11.6], [x - 5.6, y + 6]]);
  const piel = curva([[x - 2.6, y + 8], [x + 2.6, y + 8], [x + 2.4, c], [x - 2.4, c]]);
  return conGrano(
    enmascarado(`m-botija-brazo-${n + 1}`, piel, forma(piel, hondo ? C.pielHonda : C.piel) + nube(x - 1.6, y + 15, 1, 6, C.pielClara, 's', hondo ? 0.2 : 0.6) + nube(x + 2, y + 16, 1.4, 8, C.pielHonda, 's', 0.8)) +
    enmascarado(`m-botija-manga-${n + 1}`, manga, forma(manga, hondo ? C.azulHondo : C.azul) + nube(x - 2, y + 2, 4, 5, C.azulClaro, 's', hondo ? 0.3 : 0.8) + nube(x + 3, y + 9, 4, 3, C.azulHondo, 's', 0.9) + trazo(`M${x - 4.6} ${y + 10.6} Q${x} ${y + 12} ${x + 4.6} ${y + 10.4}`, C.azulHondo, 0.8, 0.8)),
  );
}

function antebrazo(n: 0 | 1): string {
  const [x, y] = A.hombros[n];
  const c = y + A.brazo;
  const m = c + A.antebrazo;
  const hondo = n === 0;
  const d = curva([[x - 2.6, c - 1.4], [x + 2.6, c - 1.4], [x + 2.2, m - 6], [x - 2.2, m - 6]]);
  // La mano medio cerrada, con los nudillos.
  const mano = curva([[x - 3.6, m - 6], [x + 3.4, m - 6.4], [x + 4.6, m - 1], [x + 3, m + 3.4], [x - 1, m + 4], [x - 4, m + 1]]);
  const reloj = n === 1
    ? forma(cajaRedonda(x - 3, m - 9.6, 6, 2.6, 0.6), C.naranja) + forma(cajaRedonda(x + 1.2, m - 10.4, 3.4, 4, 0.8), C.hueso) + trazo(`M${f(x + 2.9)} ${f(m - 8.4)} l0 -1.2 M${f(x + 2.9)} ${f(m - 8.4)} l0.9 0.4`, C.tinta, 0.4) + nube(x + 2.4, m - 9.4, 0.8, 0.6, C.azulClaro, 'xs', 0.6)
    : '';
  return conGrano(
    enmascarado(`m-botija-antebrazo-${n + 1}`, d, forma(d, hondo ? C.pielHonda : C.piel) + nube(x - 1.4, c + 8, 1, 7, C.pielClara, 's', hondo ? 0.2 : 0.7) + nube(x + 2, c + 8, 1.4, 8, C.pielHonda, 's', 0.8)) +
    // El codo huesudo.
    forma(elipse(x + 0.6, c, 2.8, 2.6), hondo ? C.pielHonda : C.piel) + nube(x + 1, c, 1.4, 1.2, C.pielClara, 'xs', hondo ? 0.3 : 0.8) +
    enmascarado(`m-botija-mano-${n + 1}`, mano, forma(mano, hondo ? C.pielHonda : C.piel) + nube(x - 1, m - 3, 2.4, 3, C.pielClara, 's', hondo ? 0.3 : 0.8) + nube(x + 3, m + 1, 2, 3, C.pielHonda, 's', 0.9) +
      trazo(`M${f(x + 3.6)} ${f(m - 3)} l-2 0.4 M${f(x + 3.4)} ${f(m - 0.4)} l-2 0.4`, C.pielHonda, 0.5, 0.8)) +
    reloj,
  );
}

/* ------------------------------------------------------------------
   La cabeza rapada: la oreja despegada, la curita de la nuca, el ojo, la nariz
   ------------------------------------------------------------------ */

const CRANEO: readonly P[] = [[-9, -134], [-6, -146], [3, -152.6], [14, -151], [21, -145], [23.6, -140], [23, -136.6], [27, -133], [31, -129.4], [27.6, -127.6], [25.4, -126.6], [25.6, -124], [24, -122], [24.6, -119.6], [22, -115], [15, -113.4], [8, -114.4], [2, -118], [-4, -121.6], [-8, -127]];

function cabeza(): string {
  const d = curva(CRANEO);
  const [ox, oy] = A.ojo;
  // El rapado: la pelusa azulada de la tapa soplada en el cráneo, menos en la cara, y el remolino de la coronilla.
  const pelusa = soplo('M-10 -130 Q-8 -150 6 -154 Q18 -154 22 -144 Q16 -144 12 -141 Q8 -138 7 -130 Q2 -122 -6 -122 Z', C.azulHondo, 's', 0.55);
  const remolino = Array.from({ length: 3 }, (_, i) => trazo(`M${f(-1 + i)} ${f(-147 + i * 0.6)} a${f(3 + i * 2.2)} ${f(2 + i * 1.4)} 0 1 1 ${f(2 + i * 2)} ${f(1.4 + i)}`, C.azulHondo, 0.5, 0.5)).join('');
  const puntitos = Array.from({ length: 34 }, (_, i) => {
    const a = (i * 137.5 * Math.PI) / 180;
    const r = 3 + ((i * 7) % 13);
    const [px, py] = [2 + Math.cos(a) * r * 1.1, -140 + Math.sin(a) * r * 0.8];
    return px < 12 || py < -146 ? forma(elipse(px, py, 0.35, 0.35), C.azulHondo, 0.7) : '';
  }).join('');
  // La oreja despegada, grande, con la luz que se transparenta.
  const oreja = curva([[-2, -136], [2, -141], [6, -139], [6.6, -131], [4, -124], [0, -123], [-1.6, -127], [0.4, -131]]);
  // La curita en la nuca, cruzada, sobre el tajito de la máquina.
  const curita = `<g transform="rotate(-28 -6 -127)">${forma(cajaRedonda(-11, -128.6, 10, 3.4, 1.4), C.hueso, 0.95)}${forma(cajaRedonda(-7.6, -128.2, 3.4, 2.6, 0.6), C.naranjaClara, 0.8)}${[-10, -9, -3.4, -2.2].map((x) => forma(elipse(x, -126.9, 0.25, 0.25), C.pielHonda, 0.7)).join('')}</g>`;
  // Los pliegues de la nuca flaca.
  const pliegues = trazo('M-6 -121.6 Q-2 -119 1 -118.4 M-7 -124 Q-3 -121.6 0 -121.4', C.pielHonda, 0.7, 0.8);
  const nariz = soplo('M23 -137 Q26.8 -133.6 30.6 -129.6 Q27.6 -127 25 -127 Z', C.pielClara, 'xs', 0.7) + trazo('M26 -127.8 q1.4 -0.4 2.4 0.2', C.pielHonda, 0.7, 0.9);
  // La boca cerrada mordiendo, con el labio de abajo apretado y los dos dientes de adelante.
  const boca = trazo('M21 -122.4 Q23 -121.4 25 -122.2', C.pielHonda, 0.9) + forma(cajaRedonda(23, -123.6, 1.6, 2, 0.4), C.hueso, 0.95) + forma(cajaRedonda(24.6, -123.4, 1.4, 1.8, 0.4), C.hueso, 0.85);
  return conGrano(
    enmascarado('m-botija-craneo', d,
      forma(d, C.piel) +
      // La cara de la tapa: luz de frente en la frente y el pómulo, lo hondo en la sien y en la nuca.
      nube(16, -146, 8, 4, C.pielClara, 'm', 0.85) + nube(20, -128, 4, 4, C.pielClara, 's', 0.7) + nube(-4, -132, 6, 12, C.pielHonda, 'm', 0.85) + nube(10, -118, 10, 3, C.pielHonda, 's', 0.8) +
      pelusa + puntitos + remolino +
      // El ojo hundido: la cuenca, lo blanco y el iris verde de los ojos del cordero.
      nube(ox, oy, 5, 3.6, C.pielHonda, 's', 0.9) +
      forma(`M${ox - 3.6} ${oy} Q${ox} ${oy - 3.2} ${ox + 3.6} ${oy - 0.4} Q${ox} ${oy + 2.6} ${ox - 3.6} ${oy} Z`, C.hueso) +
      nube(ox - 2, oy + 1.6, 3, 1, C.cuero, 'xs', 0.6) +
      nariz + boca + nube(22, -118, 3, 2, C.pielClara, 's', 0.5) +
      curita + pliegues) +
    enmascarado('m-botija-oreja', oreja, forma(oreja, C.piel) + nube(3, -132, 3, 6, C.naranja, 's', 0.5) + nube(1.4, -132, 1.6, 4, C.pielHonda, 's', 0.9) + trazo('M1 -137 Q4.6 -137 4.4 -131 Q4 -127 1.4 -126', C.pielHonda, 0.7, 0.9)),
  );
}

/** El iris verde y la pupila, que miran para todos lados. */
function pupila(): string {
  const [ox, oy] = A.ojo;
  const ojo = `M${ox - 3.6} ${oy} Q${ox} ${oy - 3.2} ${ox + 3.6} ${oy - 0.4} Q${ox} ${oy + 2.6} ${ox - 3.6} ${oy} Z`;
  return enmascarado('m-botija-ojo', ojo, forma(elipse(ox + 0.8, oy - 0.4, 2, 2.2), C.verde) + forma(elipse(ox + 1, oy - 0.4, 1, 1.2), C.tinta) + forma(elipse(ox + 0.2, oy - 1.2, 0.5, 0.5), C.hueso, 0.9));
}

/** El párpado, que baja desde arriba del ojo. */
function parpado(): string {
  const [ox, oy] = A.ojo;
  const d = `M${ox - 4.2} ${oy - 3} L${ox + 4.4} ${oy - 3} L${ox + 4.4} ${oy + 0.6} Q${ox} ${oy + 3.2} ${ox - 4.2} ${oy + 0.6} Z`;
  return conGrano(enmascarado('m-botija-parpado', d, forma(d, C.piel) + nube(ox, oy - 2, 4, 1.6, C.pielClara, 's', 0.6)) + trazo(`M${ox - 4} ${oy + 0.6} Q${ox} ${oy + 3} ${ox + 4.2} ${oy + 0.6}`, C.pielHonda, 0.7));
}

/** La ceja, que es lo único que no se rapó. */
function ceja(): string {
  const [x, y] = A.ceja;
  return trazo(`M${x - 4.6} ${y + 1} Q${x} ${y - 1.6} ${x + 5} ${y + 0.4}`, C.marron, 1.6) + trazo(`M${x - 3.6} ${y + 0.4} Q${x} ${y - 1.4} ${x + 4} ${y}`, C.pielHonda, 0.5, 0.6);
}

/** La boca abierta del grito, con los dientes de arriba y la lengua. */
function boca(): string {
  const [x, y] = A.boca;
  const d = `M${x - 4} ${y - 1.6} Q${x} ${y - 3.4} ${x + 3} ${y - 2} Q${x + 3} ${y + 4} ${x - 1} ${y + 5.6} Q${x - 4.6} ${y + 3} ${x - 4} ${y - 1.6} Z`;
  return conGrano(
    forma(curva([[x - 6, y - 3], [x + 3.4, y - 3.4], [x + 4, y + 6], [x - 6, y + 7]]), C.piel) +
    enmascarado('m-botija-boca', d, forma(d, C.tinta) + forma(elipse(x - 1, y + 5, 3, 2), C.naranja, 0.9) + forma(`M${x - 3.6} ${y - 2} L${x + 2.8} ${y - 2.4} L${x + 2.6} ${y - 0.6} L${x - 3.6} ${y - 0.4} Z`, C.hueso)) +
    trazo(d, C.pielHonda, 0.6),
  );
}

/** El boleto del ferry, mordido: el papel, la franja de color, el talón picado y las marcas de los dientes. */
function boleto(): string {
  const [x, y] = A.boca;
  const papel = poli([[x - 1, y - 2.8], [x + 12, y - 4.4], [x + 13, y + 1.6], [x + 0.4, y + 2.6]]);
  const picado = Array.from({ length: 4 }, (_, i) => forma(elipse(x + 9, y - 3 + i * 1.5, 0.3, 0.4), C.cuero, 0.8)).join('');
  return conGrano(
    enmascarado('m-botija-boleto', papel,
      forma(papel, C.hueso) + forma(poli([[x - 1, y - 1.2], [x + 13, y - 2.8], [x + 13, y - 1.3], [x - 1, y + 0.3]]), C.amarillo, 0.9) +
      trazo(`M${x + 2.6} ${y + 1.4} l5 -0.5 M${x + 10.2} ${y - 2.8} l1.6 -0.2 M${x + 10.4} ${y + 0.6} l1.6 -0.2`, C.cueroHondo, 0.45, 0.8) +
      nube(x + 11.4, y + 1, 2.4, 1.6, C.cuero, 's', 0.5)) +
    picado +
    // Las marcas de los dientes, en la punta mordida.
    trazo(`M${x} ${y - 2.6} l0.7 1 l0.7 -1 M${x + 0.4} ${y + 2.2} l0.7 -0.9 l0.7 0.9`, C.pielHonda, 0.4, 0.8),
  );
}

/** Las gotas del susto, que saltan de la cabeza rapada. */
function gotas(): string {
  const [hx, hy] = A.cabeza;
  return [[-14, -10, -30], [-2, -24, 0], [12, -18, 30], [22, -6, 50]].map(([dx, dy, g]) => {
    const [x, y] = [hx + dx!, hy + dy!];
    return `<g transform="rotate(${g} ${x} ${y})">${forma(`M${x} ${y - 3.4} Q${x + 2.2} ${y} ${x} ${y + 1.6} Q${x - 2.2} ${y} ${x} ${y - 3.4} Z`, C.azulClaro, 0.9)}${forma(elipse(x - 0.5, y - 0.4, 0.5, 0.7), C.hueso, 0.9)}</g>`;
  }).join('');
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.6;
const [HX, HY] = A.cabeza;
const [BX, BY] = A.boca;
const [OX, OY] = A.ojo;
const cajaPierna = (n: 0 | 1, y0: number, alto: number, x0 = -9, ancho = 18): [number, number, number, number] => [A.ingles[n][0] + x0, y0, ancho, alto];
const tobillo = (n: 0 | 1): number => A.ingles[n][1] + A.muslo + A.canilla;

export const PIEZAS_BOTIJA: readonly Pieza[] = [
  ...([0, 1] as const).flatMap((n) => [
    { nombre: `botija-brazo-${n + 1}`, caja: [A.hombros[n][0] - 7, A.hombros[n][1] - 5, 14, A.brazo + 9] as const, dibujo: brazo(n), densidad: D * 1.3 },
    { nombre: `botija-antebrazo-${n + 1}`, caja: [A.hombros[n][0] - 6, A.hombros[n][1] + A.brazo - 4, 12, A.antebrazo + 9] as const, dibujo: antebrazo(n), densidad: D * 1.3 },
    { nombre: `botija-muslo-${n + 1}`, caja: cajaPierna(n, A.ingles[n][1] - 5, A.muslo + 10), dibujo: muslo(n), densidad: D },
    { nombre: `botija-canilla-${n + 1}`, caja: cajaPierna(n, A.ingles[n][1] + A.muslo - 5, A.canilla + 8, -6, 12), dibujo: canilla(n), densidad: D * 1.2 },
    { nombre: `botija-zapatilla-${n + 1}`, caja: cajaPierna(n, tobillo(n) - 5, 13, -16, 32), dibujo: zapatilla(n), densidad: D * 1.3 },
  ]),
  { nombre: 'botija-torso', caja: [-17, -121, 34, 70], dibujo: torso(), densidad: D },
  { nombre: 'botija-bolso', caja: [-42, -92, 42, 56], dibujo: bolso(), densidad: D },
  { nombre: 'botija-cabeza', caja: [HX - 20, HY - 22, 42, 44], dibujo: cabeza(), densidad: D * 1.4 },
  { nombre: 'botija-pupila', caja: [OX - 5, OY - 4, 10, 8], dibujo: pupila(), densidad: D * 2 },
  { nombre: 'botija-parpado', caja: [OX - 5, OY - 4, 10, 8], dibujo: parpado(), densidad: D * 2 },
  { nombre: 'botija-ceja', caja: [A.ceja[0] - 6, A.ceja[1] - 3, 12, 5], dibujo: ceja(), densidad: D * 2 },
  { nombre: 'botija-boca', caja: [BX - 7, BY - 5, 12, 13], dibujo: boca(), densidad: D * 2 },
  { nombre: 'botija-boleto', caja: [BX - 2, BY - 7, 20, 11], dibujo: boleto(), densidad: D * 2 },
  { nombre: 'botija-gotas', caja: [HX - 18, HY - 30, 44, 28], dibujo: gotas(), densidad: D * 1.4 },
];

const img = imagenesDe(PIEZAS_BOTIJA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El botija armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const brazoEntero = (n: 1 | 2): string => parte(`hombro-${n}`, img(`botija-brazo-${n}`) + parte(`codo-${n}`, img(`botija-antebrazo-${n}`), t[`codo-${n}`]), t[`hombro-${n}`]);
  const piernaEntera = (n: 1 | 2): string =>
    parte(`muslo-${n}`, img(`botija-muslo-${n}`), t[`muslo-${n}`]) + parte(`canilla-${n}`, img(`botija-canilla-${n}`), t[`canilla-${n}`]) + parte(`zapatilla-${n}`, img(`botija-zapatilla-${n}`), t[`zapatilla-${n}`]);
  return parte('viaje',
    parte('torso-atras', brazoEntero(1), t['torso-atras']) +
    piernaEntera(1) +
    piernaEntera(2) +
    parte('torso',
      img('botija-torso') +
      parte('bolso', img('botija-bolso'), t.bolso) +
      parte('cabeza',
        parte('cara',
          img('botija-cabeza') +
          parte('pupila', img('botija-pupila'), t.pupila) +
          parte('parpado', img('botija-parpado'), t.parpado) +
          parte('ceja', img('botija-ceja'), t.ceja) +
          parte('boca', img('botija-boca'), '', o.boca) +
          parte('boleto', img('botija-boleto'), t.boleto),
          t.cara) +
        parte('gotas', img('botija-gotas'), t.gotas, o.gotas),
        t.cabeza) +
      brazoEntero(2),
      t.torso),
    t.viaje);
}

/** El botija en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function botijaEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: parado en la planchada, con el boleto en los dientes. */
function titere(nombres: ReadonlyMap<string, string>): string {
  const [x0, y0] = alRecinto([-30, -158]);
  const [x1, y1] = alRecinto([34, 8]);
  return (
    `<g class="titere titere--botija" data-id="el-botija-rapado" role="button" tabindex="0" aria-label="${nombres.get('el-botija-rapado') ?? 'El botija rapado'}">` +
    `<rect class="bt-botija-toque" x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}"/>` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: en la planchada, con los brazos arriba, el grito y el boleto saltando. */
export const RETRATO = (() => {
  const [x0, y0] = alRecinto([-64, -200]);
  const [x1, y1] = alRecinto([64, 24]);
  return { caja: [x0, y0, x1 - x0, y1 - y0] as const };
})();
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('astillero-lejos') + fondo('astillero-piso') + botijaEn(ZAFO);
}

export const BOTIJA_PERSONAJE: Personaje = {
  id: 'el-botija-rapado',
  region: 'los-astilleros',
  ancla: BOTIJA.ancla,
  piezas: PIEZAS_BOTIJA,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
