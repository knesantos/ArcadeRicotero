/**
 * El as del Club París (`D-73`, vigesimonovena vuelta), en el muelle de los astilleros, al lado de su valija.
 *
 * *"Sos el as del Club París / sos la joya del lugar"* y *"pero cabe todo lo tuyo en una maldita valija"* son de
 * *Blues de la artillería*, en *La mosca y la sopa* (1991). Se toma al pie de la letra: **es un as**. Un naipe francés,
 * el as de corazones, con piernas y brazos flacos. Del mismo tema: *"sos un aristócrata de cotillón"* (la galera es de
 * cartón, con su elástico; el monóculo, de plástico; el bigote, postizo y medio despegado; el matasuegras), *"el acento
 * del barrio te sale mal"* (ese bigote, que se le tuerce), *"si tu moneda hablara"* (la moneda que revolea, y que se le
 * escapa), *"cuál es tu charter"* (la etiqueta colgada de la manija) y *"cierran los bares por donde vas"* (la valija
 * se le cierra a él). Y como es un naipe, cuando se pone de canto casi no está. Tocado, **cabe**: se dobla al medio,
 * se mete en la valija, se dobla otra vez y la tapa se cierra con todo lo suyo adentro. La galera queda afuera.
 *
 * De la letra son el as, la valija, el cotillón, la moneda y el charter. Del dibujo son el palo (corazones: negro
 * sobre la noche no se leía), el dorso, las polainas y que se pliegue. Es **papel**: plano, de canto fino, con una
 * esquina doblada; cuando se dobla, la mitad de abajo pasa para atrás y se le ve el dorso, que asoma torcido.
 *
 * Viste *La mosca y la sopa*, medido con sharp: el blanco del naipe es el haz del seguidor de la foto de la tapa y el
 * dorso es ese haz donde se pierde; el corazón es el rojo de la tapa; la galera, el bigote y las piernas, el negro de
 * la foto; la valija, el naranja de las luces del escenario; la moneda, el amarillo del cartel del título
 * (`--bestia-asparis-*`).
 *
 * Coordenadas: el (0, 0) es la tabla del muelle entre los zapatos (`rig-asparis.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, poli } from './trazos.ts';
import { ASPARIS, ASPARIS_ARMADO as A, CABE, QUIETO, marcas, type Momento } from './rig-asparis.ts';

const ID = 'el-as-del-club-paris';

/** Las tintas de *La mosca y la sopa* (`tokens.css`). */
const C = {
  carta: 'var(--bestia-asparis-carta)',
  cartaHonda: 'var(--bestia-asparis-carta-honda)',
  dorso: 'var(--bestia-asparis-dorso)',
  dorsoClaro: 'var(--bestia-asparis-dorso-claro)',
  rojo: 'var(--bestia-asparis-rojo)',
  naranja: 'var(--bestia-asparis-naranja)',
  naranjaClaro: 'var(--bestia-asparis-naranja-claro)',
  negro: 'var(--bestia-asparis-negro)',
  amarillo: 'var(--bestia-asparis-amarillo)',
  amarilloHondo: 'var(--bestia-asparis-amarillo-hondo)',
};

const W = A.ancho / 2;
const [TOPE, MEDIO, PIE] = [A.copete, A.doblez, A.pie];
/** El radio de las esquinas (de naipe: chico) y lo que mide la esquina doblada. */
const R = 5;
const OREJA = 15;

/* ------------------------------------------------------------------
   El naipe: la mitad de arriba (la cara), la de abajo (el corazón) y el dorso
   ------------------------------------------------------------------ */

/** Un corazón con la punta para abajo, centrado en (x, y), de `r` de medio ancho. Con `alReves`, la punta para arriba. */
function corazon(x: number, y: number, r: number, alReves = false): string {
  const s = alReves ? -1 : 1;
  return `M${x} ${y + s * r * 1.05} C${x - r * 0.5} ${y + s * r * 0.55} ${x - r * 1.1} ${y + s * r * 0.1} ${x - r * 1.05} ${y - s * r * 0.4} C${x - r} ${y - s * r * 1.05} ${x - r * 0.2} ${y - s * r * 1.1} ${x} ${y - s * r * 0.45} C${x + r * 0.2} ${y - s * r * 1.1} ${x + r} ${y - s * r * 1.05} ${x + r * 1.05} ${y - s * r * 0.4} C${x + r * 1.1} ${y + s * r * 0.1} ${x + r * 0.5} ${y + s * r * 0.55} ${x} ${y + s * r * 1.05} Z`;
}

/** La A del índice, dibujada a pulso: dos palos y el travesaño. `s` es −1 para la de abajo, que va cabeza abajo. */
const letraA = (x: number, y: number, h: number, s: 1 | -1 = 1): string => `M${x - h * 0.36} ${y + s * h * 0.5} L${x} ${y - s * h * 0.5} L${x + h * 0.36} ${y + s * h * 0.5} M${x - h * 0.2} ${y + s * h * 0.14} L${x + h * 0.2} ${y + s * h * 0.14}`;

/**
 * El paño del dorso entre dos alturas: el azul con los rombos, adentro del marco blanco, y el rombo rojo en el medio
 * del naipe. Lo usan el dorso entero y la mitad de abajo cuando se da vuelta.
 */
function panioDelDorso(id: string, y0: number, y1: number): string {
  const adentro = `M${-W + 7} ${Math.max(y0, TOPE + 7)} L${W - 7} ${Math.max(y0, TOPE + 7)} L${W - 7} ${Math.min(y1, PIE - 7)} L${-W + 7} ${Math.min(y1, PIE - 7)} Z`;
  let rombos = '';
  for (let i = -8; i <= 8; i++) rombos += `M${i * 14 - 80} ${TOPE} l160 160 M${i * 14 + 80} ${TOPE} l-160 160 `;
  const [cx, cy] = [0, (TOPE + PIE) / 2];
  return enmascarado(id, adentro,
    forma(adentro, C.dorso) + trazo(rombos, C.dorsoClaro, 1.3, 0.75) +
    forma(poli([[cx, cy - 22], [cx + 15, cy], [cx, cy + 22], [cx - 15, cy]]), C.carta) + forma(poli([[cx, cy - 16], [cx + 11, cy], [cx, cy + 16], [cx - 11, cy]]), C.rojo));
}

/** La mitad de abajo, vista del dorso: es lo que se ve cuando se pliega para atrás y asoma por arriba y por el costado. */
function vuelta(): string {
  const d = `M${-W} ${MEDIO} L${-W} ${PIE - R} Q${-W} ${PIE} ${-W + R} ${PIE} L${W - R} ${PIE} Q${W} ${PIE} ${W} ${PIE - R} L${W} ${MEDIO} Z`;
  return conGrano(forma(d, C.carta) + panioDelDorso('m-asparis-vuelta', MEDIO, PIE) + trazo(d, C.cartaHonda, 1));
}

/** La mitad de arriba: el índice, los ojos con el monóculo, la boca y el elástico de la galera. */
function arriba(): string {
  // Es papel: plano, de esquinas de naipe, con el canto fino. La esquina de arriba a la derecha está doblada.
  const d = `M${-W} ${MEDIO} L${-W} ${TOPE + R} Q${-W} ${TOPE} ${-W + R} ${TOPE} L${W - OREJA} ${TOPE} L${W} ${TOPE + OREJA} L${W} ${MEDIO} Z`;
  const ojo = (x: number, y: number): string =>
    forma(elipse(x, y, 7, 7.6), C.cartaHonda) + trazo(elipse(x, y, 7, 7.6), C.negro, 1.3) + forma(elipse(x + 1.6, y + 1.2, 3, 3.4), C.negro) + forma(elipse(x + 0.6, y, 0.9, 0.9), C.carta) +
    // El párpado pesado: mira desde arriba.
    forma(`M${x - 7.4} ${y - 1} A7.4 8 0 0 1 ${x + 7.4} ${y - 1} Z`, C.cartaHonda) + trazo(`M${x - 7.6} ${y - 1} L${x + 7.6} ${y - 1}`, C.negro, 1.5);
  return conGrano(
    // El papel, liso; el único volumen es un alabeo leve, de un lado.
    enmascarado('m-asparis-arriba', d, forma(d, C.carta) + nube(W + 4, (TOPE + MEDIO) / 2, 10, 50, C.cartaHonda, 's', 0.45)) +
    trazo(d, C.cartaHonda, 1) +
    // La esquina doblada: se le ve el dorso.
    forma(poli([[W - OREJA, TOPE], [W, TOPE + OREJA], [W - OREJA + 1.6, TOPE + OREJA - 1.6]]), C.dorso) + trazo(`M${W - OREJA} ${TOPE} L${W} ${TOPE + OREJA}`, C.cartaHonda, 1) +
    // El índice: la A y el corazón chico.
    trazo(letraA(-W + 15, TOPE + 19, 19), C.rojo, 3.2) + forma(corazon(-W + 15, TOPE + 39, 6.4), C.rojo) +
    // El elástico de la galera, que baja por los costados de la cara y se junta abajo del mentón que no tiene.
    trazo(`M-22 ${TOPE + 1} Q-27 -160 -9 ${MEDIO + 1} M22 ${TOPE + 1} Q27 -160 9 ${MEDIO + 1}`, C.negro, 0.8, 0.55) +
    // Las cejas, una más alta que la otra, y los ojos.
    trazo('M-21 -184 Q-13 -190 -4 -185 M5 -189 Q14 -195 23 -188', C.negro, 2.2) +
    ojo(-12, -171) + ojo(13, -172) +
    // El monóculo de plástico, con su cordón.
    trazo(elipse(13, -172, 10.4, 11), C.amarilloHondo, 2.6) + trazo('M7 -180 q4 -3 9 -1', C.amarillo, 1.1, 0.9) + trazo(`M22.6 -167 Q34 -152 30 ${MEDIO + 2}`, C.amarilloHondo, 1.1) +
    // La boca, chica, de costado.
    trazo(`M${A.boca[0] - 6} ${A.boca[1]} Q${A.boca[0]} ${A.boca[1] + 3.4} ${A.boca[0] + 8} ${A.boca[1] - 1.6}`, C.negro, 1.8),
  );
}

/** La mitad de abajo: el corazón grande y el índice cabeza abajo. */
function abajo(): string {
  const d = `M${-W} ${MEDIO} L${-W} ${PIE - R} Q${-W} ${PIE} ${-W + R} ${PIE} L${W - R} ${PIE} Q${W} ${PIE} ${W} ${PIE - R} L${W} ${MEDIO} Z`;
  const cy = (MEDIO + PIE) / 2 - 3;
  return conGrano(
    enmascarado('m-asparis-abajo', d, forma(d, C.carta) + nube(W + 4, cy, 10, 50, C.cartaHonda, 's', 0.45)) +
    trazo(d, C.cartaHonda, 1) +
    // El corazón, en tinta plana: es un naipe impreso.
    forma(corazon(0, cy, 25), C.rojo) +
    trazo(letraA(W - 15, PIE - 19, 19, -1), C.rojo, 3.2) + forma(corazon(W - 15, PIE - 39, 6.4, true), C.rojo) +
    // La marca del doblez, que ya tiene de tanto guardarse.
    trazo(`M${-W + 1} ${MEDIO + 0.7} L${W - 1} ${MEDIO + 0.7}`, C.cartaHonda, 1.4),
  );
}

/** El dorso: el marco blanco y el paño azul con los rombos, y un rombo rojo en el medio. */
function dorso(): string {
  const d = cajaRedonda(-W, TOPE, A.ancho, A.alto, R);
  return conGrano(forma(d, C.carta) + panioDelDorso('m-asparis-dorso', TOPE, PIE) + trazo(d, C.cartaHonda, 1));
}

/** Los párpados, cerrados: tapan los dos ojos. */
function parpados(): string {
  const uno = (x: number, y: number): string => forma(elipse(x, y, 7.2, 7.8), C.cartaHonda) + trazo(`M${x - 7} ${y + 2} Q${x} ${y + 6} ${x + 7} ${y + 2}`, C.negro, 1.5);
  return conGrano(uno(-12, -171) + uno(13, -172));
}

/** El bigote postizo: dos guías enruladas. El medio es el (0, 0). */
function bigote(): string {
  const guia = (s: 1 | -1): string => curva([[0, -3], [s * 9, -6], [s * 19, -2], [s * 25, -9], [s * 28, -6], [s * 23, 3], [s * 11, 4], [0, 2]]);
  return conGrano(forma(guia(-1), C.negro) + forma(guia(1), C.negro) + trazo('M-22 -3 Q-12 -6 -2 -2 M3 -2 Q13 -6 23 -3', C.cartaHonda, 0.8, 0.5) + forma(elipse(0, -0.6, 3, 3.2), C.negro));
}

/** La galera de cartón, que apoya en el (0, 0): el ala, la copa abollada, la cinta roja y la grampa. */
function galera(): string {
  const copa = curva([[-17, -4], [-19, -40], [-8, -45], [8, -43], [20, -41], [17, -4]]);
  return conGrano(
    forma(elipse(0, -2, 31, 6.4), C.negro) + trazo('M-30 -3 Q0 -11 30 -3', C.cartaHonda, 1.2, 0.75) +
    enmascarado('m-asparis-copa', copa, forma(copa, C.negro) + nube(-12, -24, 4, 20, C.dorso, 'xs', 0.75) + nube(13, -24, 3, 18, C.naranjaClaro, 'xs', 0.4) + forma(poli([[-20, -15], [20, -13], [20, -6], [-20, -7]]), C.rojo)) +
    forma(elipse(0.6, -42.6, 14.4, 3.4), C.negro) + trazo('M-13 -43 Q0 -47 15 -42', C.cartaHonda, 1.1, 0.8) + trazo(`M-19 -38 Q-20 -22 -17.6 -6 M20 -39 Q20.6 -22 17.4 -6`, C.cartaHonda, 0.9, 0.55) +
    // La grampa del cartón y la abolladura.
    trazo('M3 -30 l5 1', C.cartaHonda, 1.4) + trazo('M-9 -34 q5 4 3 10', C.dorso, 1, 0.8),
  );
}

/* ------------------------------------------------------------------
   Las piernas, los brazos, la moneda y el matasuegras
   ------------------------------------------------------------------ */

/** Las dos piernas, flacas, con las polainas blancas y los zapatos para afuera. El canto del naipe es `PIE`. */
function piernas(): string {
  const una = (s: 1 | -1): string => {
    const x = s * 21;
    const zapato = curva([[x - s * 4, -9], [x + s * 6, -10], [x + s * 22, -5], [x + s * 24, 0], [x - s * 5, 0]]);
    const polaina = poli([[x - 5, -22], [x + 5, -22], [x + 5 + (s > 0 ? 7 : 0), -7], [x - 5 - (s < 0 ? 7 : 0), -7]]);
    return (
      trazo(`M${x} ${PIE - 2} Q${x + s * 3} -34 ${x} -16`, C.negro, 5.4) + trazo(`M${x - 1.6} ${PIE - 2} Q${x + s * 1.4} -34 ${x - 1.6} -18`, C.dorso, 1, 0.8) +
      forma(zapato, C.negro) + trazo(`M${x + s * 6} -9.4 Q${x + s * 18} -8 ${x + s * 23} -2`, C.cartaHonda, 1, 0.7) +
      forma(polaina, C.carta) + trazo(`M${x - s * 1} -19 l0 9`, C.cartaHonda, 1) + [0, 1, 2].map((i) => forma(elipse(x + s * 2.4, -18.6 + i * 3.6, 0.9, 0.9), C.negro)).join('')
    );
  };
  return conGrano(nube(0, 1, 40, 3.4, C.negro, 'xs', 0.8) + una(-1) + una(1));
}

/** Un brazo: flaco, del hombro (0, 0) para abajo, con el puño de la camisa y el guante blanco. */
function brazo(): string {
  const L = A.brazo;
  return conGrano(
    trazo(`M0 0 Q3 ${L / 2} 0 ${L - 9}`, C.negro, 4.6) + trazo(`M-1.4 2 Q1.4 ${L / 2} -1.4 ${L - 11}`, C.dorso, 0.9, 0.8) +
    forma(poli([[-4.4, L - 13], [4.4, L - 13], [5, L - 8], [-5, L - 8]]), C.carta) +
    forma(curva([[-6, L - 8], [6, L - 8], [7.4, L], [3, L + 5], [-3, L + 5], [-7.4, L]]), C.carta) + nube(3, L + 1, 4, 4, C.cartaHonda, 'xs', 0.7) + trazo(`M-2.4 ${L - 2} l0 5 M1.6 ${L - 2} l0 5.4`, C.cartaHonda, 0.9),
  );
}

/** La moneda, de frente: el canto, la cara con una efigie de perfil y el brillo. El medio es el (0, 0). */
function moneda(): string {
  return conGrano(
    forma(elipse(0, 0, 8, 8), C.amarilloHondo) + forma(elipse(-0.5, -0.5, 6.6, 6.6), C.amarillo) +
    trazo('M-1.6 -3.6 q4 0.6 3 3.6 q-0.4 2.4 -3 3 M-1.6 -3.6 l0 6.6', C.amarilloHondo, 1.2) + nube(-2.6, -3, 2.4, 1.8, C.carta, 'xs', 0.8),
  );
}

/** El matasuegras: sale de la boca (el (0, 0)) para la izquierda, a rayas, con la punta enroscada y un flequillo de papel. */
function matasuegras(): string {
  const tubo = poli([[0, -3], [-58, -5.4], [-58, 5.4], [0, 3]]);
  let rayas = '';
  for (let i = 0; i < 8; i++) rayas += forma(poli([[-6 - i * 7.4, -6], [-9.6 - i * 7.4, -6], [-7 - i * 7.4, 6], [-3.4 - i * 7.4, 6]]), i % 2 ? C.rojo : C.amarillo);
  return conGrano(
    forma(poli([[5, -2.4], [-2, -3.4], [-2, 3.4], [5, 2.4]]), C.carta) +
    enmascarado('m-asparis-mata', tubo, forma(tubo, C.naranjaClaro) + rayas + nube(-30, 4, 30, 2, C.negro, 'xs', 0.3)) +
    // La punta, que no termina de desenroscarse, y el flequillo.
    `<path d="M-58 0 a8 8 0 1 0 -7 7.4 a4.6 4.6 0 1 0 -1.6 -8.6" fill="none" stroke="${C.rojo}" stroke-width="4.4" stroke-linecap="round"/>` +
    trazo('M-73 -4 l-7 -5 M-74 0 l-9 -1 M-73 4 l-8 4', C.amarillo, 1.3),
  );
}

/* ------------------------------------------------------------------
   La valija
   ------------------------------------------------------------------ */

const V = A.valija;
const [VX0, VX1, VY] = [V.x - V.ancho / 2, V.x + V.ancho / 2, -V.alto];

/** Lo que se ve por la boca cuando está abierta: el canto de atrás y lo oscuro de adentro. */
function valijaFondo(): string {
  return conGrano(forma(poli([[VX0 + 2, VY - 5], [VX1 - 2, VY - 5], [VX1, VY + 6], [VX0, VY + 6]]), C.negro) + trazo(`M${VX0 + 3} ${VY - 5} L${VX1 - 3} ${VY - 5}`, C.naranja, 1.6, 0.9));
}

/** La tapa, abierta del todo: el forro rojo, las dos cintas cruzadas y el bolsillo. La bisagra es el canto de abajo (`VY`). */
function tapa(): string {
  const d = cajaRedonda(VX0, VY - 74, V.ancho, 74, 6);
  const forro = cajaRedonda(VX0 + 5, VY - 69, V.ancho - 10, 66, 3);
  return conGrano(
    forma(d, C.naranja) +
    enmascarado('m-asparis-forro', forro, forma(forro, C.rojo) + nube(V.x + 26, VY - 26, 26, 28, C.negro, 's', 0.42) + nube(V.x - 28, VY - 44, 20, 8, C.naranjaClaro, 's', 0.3) +
      trazo(`M${VX0 + 5} ${VY - 66} L${VX1 - 5} ${VY - 8} M${VX1 - 5} ${VY - 66} L${VX0 + 5} ${VY - 8}`, C.cartaHonda, 2.6, 0.85) +
      // El bolsillo fruncido, con un naipe más asomando: el as de la manga.
      forma(poli([[V.x - 12, VY - 30], [V.x + 4, VY - 33], [V.x + 6, VY - 16], [V.x - 10, VY - 14]]), C.carta) +
      trazo(`M${VX0 + 10} ${VY - 18} Q${V.x} ${VY - 24} ${VX1 - 10} ${VY - 18}`, C.negro, 1.2, 0.7) + nube(V.x, VY - 10, 38, 6, C.negro, 'xs', 0.35)) +
    trazo(`M${VX0 + 2} ${VY - 70} Q${VX0 + 1} ${VY - 30} ${VX0 + 2} ${VY - 3}`, C.naranjaClaro, 1.4, 0.8),
  );
}

/** La tapa cerrada, vista de adelante: el canto de arriba y la manija, con la etiqueta del charter colgada. */
function cierre(): string {
  const d = cajaRedonda(VX0, VY - 9, V.ancho, 11, 4);
  return conGrano(
    trazo(`M${V.x - 13} ${VY - 8} q0 -11 13 -11 q13 0 13 11`, C.negro, 4) + trazo(`M${V.x - 11} ${VY - 10} q1 -7 11 -7.4`, C.cartaHonda, 0.9, 0.6) +
    enmascarado('m-asparis-cierre', d, forma(d, C.naranja) + nube(V.x - 20, VY - 7, 24, 2.4, C.naranjaClaro, 'xs', 0.8) + nube(V.x + 30, VY - 3, 20, 4, C.negro, 'xs', 0.45)) +
    trazo(`M${VX0 + 2} ${VY + 1.4} L${VX1 - 2} ${VY + 1.4}`, C.negro, 1.4, 0.8),
  );
}

/** El frente: el cuero naranja gastado, las dos correas con hebilla, los esquineros, las calcomanías y la etiqueta del charter. */
function valijaFrente(): string {
  const d = cajaRedonda(VX0, VY, V.ancho, V.alto, 6);
  const correa = (x: number): string => forma(poli([[x - 4, VY], [x + 4, VY], [x + 4, 0], [x - 4, 0]]), C.negro) + trazo(`M${x - 2.6} ${VY + 2} L${x - 2.6} -2`, C.dorso, 0.8, 0.6) + forma(cajaRedonda(x - 6, VY + 16, 12, 10, 2), C.amarilloHondo) + forma(poli([[x - 3, VY + 19], [x + 3, VY + 19], [x + 3, VY + 23], [x - 3, VY + 23]]), C.negro);
  const esquinero = (x: number, y: number, sx: 1 | -1, sy: 1 | -1): string => forma(`M${x} ${y} l${sx * 13} 0 q${-sx * 9} ${sy * 3} ${-sx * 13} ${sy * 13} Z`, C.amarilloHondo);
  // La etiqueta del charter: un cartón amarillo colgado de la manija con un piolín, con su franja y dos renglones.
  const [ex, ey] = [VX0 + 12, VY + 12];
  const etiqueta =
    trazo(`M${V.x - 12} ${VY - 6} Q${ex + 12} ${VY - 2} ${ex + 2} ${ey - 9}`, C.cartaHonda, 0.9) +
    `<g transform="rotate(-14 ${ex} ${ey})">` + forma(poli([[ex - 8, ey - 6], [ex - 3, ey - 10], [ex + 8, ey - 10], [ex + 8, ey + 12], [ex - 8, ey + 12]]), C.amarillo) + forma(elipse(ex - 3, ey - 6, 1.3, 1.3), C.negro) +
    forma(poli([[ex - 8, ey - 1], [ex + 8, ey - 1], [ex + 8, ey + 3], [ex - 8, ey + 3]]), C.rojo) + trazo(`M${ex - 5} ${ey + 6.6} L${ex + 5} ${ey + 6.6} M${ex - 5} ${ey + 9.4} L${ex + 2} ${ey + 9.4}`, C.negro, 0.9, 0.8) + `</g>`;
  return conGrano(
    nube(V.x, 1, V.ancho / 2 + 6, 3.4, C.negro, 'xs', 0.85) +
    enmascarado('m-asparis-valija', d,
      forma(d, C.naranja) + nube(VX0 + 14, VY + 14, 20, 14, C.naranjaClaro, 's', 0.6) + nube(VX1 - 10, -18, 18, 30, C.negro, 's', 0.5) + nube(V.x, -3, V.ancho / 2, 6, C.negro, 's', 0.45) +
      // Lo gastado: rayones y una mancha de agua.
      trazo(`M${V.x - 6} ${VY + 30} l14 5 M${V.x + 2} ${VY + 44} l10 -3`, C.naranjaClaro, 0.8, 0.5) + nube(V.x + 6, -12, 12, 5, C.negro, 'xs', 0.25) +
      esquinero(VX0, VY, 1, 1) + esquinero(VX1, VY, -1, 1) + esquinero(VX0, 0, 1, -1) + esquinero(VX1, 0, -1, -1) +
      correa(V.x - 22) + correa(V.x + 24) +
      // Una calcomanía de corazón, medio arrancada.
      `<g transform="rotate(12 ${V.x + 2} ${VY + 36})">` + forma(elipse(V.x + 2, VY + 37, 9, 9), C.carta) + forma(corazon(V.x + 2, VY + 37, 5.4), C.rojo) + `</g>`) +
    trazo(`M${VX0 + 4} ${VY + 0.8} L${VX1 - 4} ${VY + 0.8}`, C.naranjaClaro, 1.4, 0.8) +
    etiqueta,
  );
}

/** El guante, agarrado del canto de la valija: cuatro dedos por afuera. */
function guante(): string {
  const [gx, gy] = [VX0 + 20, VY];
  return conGrano([0, 1, 2, 3].map((i) => forma(cajaRedonda(gx + i * 5.2, gy - 3, 4.6, 11 - (i === 3 ? 2 : 0), 2.2), C.carta)).join('') + trazo(`M${gx} ${gy + 0.6} l20 0`, C.cartaHonda, 0.8, 0.8));
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.2;

export const PIEZAS_ASPARIS: readonly Pieza[] = [
  { nombre: 'asparis-piernas', caja: [-52, PIE - 6, 104, -PIE + 12], dibujo: piernas(), densidad: D },
  { nombre: 'asparis-arriba', caja: [-W - 4, TOPE - 4, A.ancho + 8, MEDIO - TOPE + 4], dibujo: arriba(), densidad: D * 1.3 },
  { nombre: 'asparis-abajo', caja: [-W - 4, MEDIO, A.ancho + 8, PIE - MEDIO + 4], dibujo: abajo(), densidad: D * 1.3 },
  { nombre: 'asparis-vuelta', caja: [-W - 4, MEDIO - 2, A.ancho + 8, PIE - MEDIO + 6], dibujo: vuelta(), densidad: D * 1.3 },
  { nombre: 'asparis-dorso', caja: [-W - 4, TOPE - 4, A.ancho + 8, A.alto + 8], dibujo: dorso(), densidad: D },
  { nombre: 'asparis-parpados', caja: [-22, -182, 46, 22], dibujo: parpados(), densidad: D * 1.3 },
  { nombre: 'asparis-bigote', caja: [-32, -12, 64, 20], dibujo: bigote(), densidad: D * 1.5 },
  { nombre: 'asparis-galera', caja: [-36, -52, 72, 60], dibujo: galera(), densidad: D * 1.3 },
  { nombre: 'asparis-brazo', caja: [-10, -4, 20, A.brazo + 14], dibujo: brazo(), densidad: D * 1.3 },
  { nombre: 'asparis-moneda', caja: [-10, -10, 20, 20], dibujo: moneda(), densidad: D * 2 },
  { nombre: 'asparis-mata', caja: [-88, -14, 96, 28], dibujo: matasuegras(), densidad: D * 1.3 },
  { nombre: 'asparis-valija-fondo', caja: [VX0 - 2, VY - 8, V.ancho + 4, 16], dibujo: valijaFondo(), densidad: D },
  { nombre: 'asparis-tapa', caja: [VX0 - 2, VY - 76, V.ancho + 4, 78], dibujo: tapa(), densidad: D },
  { nombre: 'asparis-cierre', caja: [VX0 - 2, VY - 24, V.ancho + 4, 28], dibujo: cierre(), densidad: D },
  { nombre: 'asparis-valija-frente', caja: [VX0 - 8, VY - 10, V.ancho + 16, V.alto + 16], dibujo: valijaFrente(), densidad: D },
  { nombre: 'asparis-guante', caja: [VX0 + 16, VY - 6, 30, 18], dibujo: guante(), densidad: D * 1.5 },
];

const img = imagenesDe(PIEZAS_ASPARIS);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El as armado con las marcas de un momento. El naipe va entre la tapa y el frente de la valija: así entra. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    parte('valija-fondo', img('asparis-valija-fondo'), t['valija-fondo'], o['valija-fondo']) +
    parte('tapa', img('asparis-tapa'), t.tapa, o.tapa) +
    parte('piernas', img('asparis-piernas'), t.piernas, o.piernas) +
    parte('naipe',
      // La mitad de abajo: de frente mientras se pliega, y del dorso cuando ya pasó para atrás (va detrás de la cara).
      parte('vuelta', img('asparis-vuelta'), t.vuelta, o.vuelta) +
      parte('abajo', img('asparis-abajo'), t.abajo, o.abajo) +
      img('asparis-arriba') +
      parte('parpados', img('asparis-parpados'), '', o.parpados) +
      parte('mata', img('asparis-mata'), t.mata, o.mata) +
      parte('bigote', img('asparis-bigote'), t.bigote) +
      parte('dorso', img('asparis-dorso'), '', o.dorso) +
      parte('brazos', parte('brazo-i', img('asparis-brazo'), t['brazo-i']) + parte('brazo-d', img('asparis-brazo'), t['brazo-d']), '', o.brazos),
      t.naipe, o.naipe) +
    parte('moneda', img('asparis-moneda'), t.moneda, o.moneda) +
    parte('valija-frente', img('asparis-valija-frente'), t['valija-frente']) +
    parte('cierre', img('asparis-cierre'), t.cierre, o.cierre) +
    parte('guante', img('asparis-guante'), '', o.guante) +
    parte('galera', img('asparis-galera'), t.galera)
  );
}

/** El as en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function asparisEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: parado al lado de la valija cerrada, con la moneda en el guante. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--asparis" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El as del Club París'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: doblado al medio y metido en la valija, agarrado del canto. */
export const RETRATO = { caja: [ASPARIS.x - 34, ASPARIS.piso - 116, 136, 124] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/astillero-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/astillero-piso.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    asparisEn(CABE)
  );
}

export const ASPARIS_PERSONAJE: Personaje = {
  id: ID,
  region: 'los-astilleros',
  ancla: ASPARIS.x,
  piezas: PIEZAS_ASPARIS,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
